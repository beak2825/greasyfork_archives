// ==UserScript==
// @name        DLSite RJ/BJコードプレビュー
// @namespace   上下左右前後
// @description RJ/BJコードからDLSiteのプレビューを生成するやつ
// @match     *://*/*
// @version     1.0.8
// @license     MIT
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/452419/DLSite%20RJBJ%E3%82%B3%E3%83%BC%E3%83%89%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/452419/DLSite%20RJBJ%E3%82%B3%E3%83%BC%E3%83%89%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.meta.js
// ==/UserScript==

const RJ_REGEX = new RegExp('[RBV][JE][0-9]{6,8}(?!\.html)', 'ig')

const URL_REGEX = new RegExp('https:\/\/','ig')

const VOICELINK_CLASS = 'voicelink'

const RJCODE_ATTRIBUTE = 'rjcode'

const css = `
.voicepopup {
  z-index: 50000;
  max-width: 80%;
  max-height: 80%;
  position: fixed;
  box-shadow: 0 0 0 2.5px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.voicepopup img {
  width: 100%;
  height: auto;
  max-width: 360px;
}

.voicelink {
  color: currentColor;
  font-weight: bold;
  -webkit-text-stroke: 0.5px !important;
}

.voicelink: hover {
  text-decoration: none;
}

.voicepopup > .voice-info {
  padding: 12px 16px;
  font-size: 0.88rem;
  line-height: 1.2;
  max-width: 360px;
  display: grid;
  grid-gap: 6px;
  box-sizing: border-box;
  color: #212121;
}

.voicepopup > .voice-info > p {
  margin: 0;
  font-weight: bold;
}

.voicepopup > .voice-info > p > span {
  font-weight: normal;
}

.voicepopup .voice-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1;
}

.voicepopup .error {
  height: 210px;
  line-height: 210px;
  text-align: center;
}

.voicepopup.discord-dark {
  background-color: #36393f;
  color: #dcddde;
  font-size: 0.9375rem;
}`

function getAdditionalPopupClasses() {
  const hostname = document.location.hostname
  switch (hostname) {
    case 'boards.4chan.org':
      return 'post reply'
    case 'discordapp.com':
      return 'discord-dark'
    default:
      return null
  }
}

function getXmlHttpRequest() {
  return typeof GM !== 'undefined' && GM !== null
    ? GM.xmlHttpRequest
    : GM_xmlhttpRequest
}

const Parser = {
walkNodes: function (elem) {
  const rjNodeTreeWalker = document.createTreeWalker(
    elem,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'A' || node.tagName === 'TEXTAREA') {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.classList.contains(VOICELINK_CLASS)) {
            console.log(node.nodeValue);
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.parentElement.tagName === 'TEXTAREA' || node.nodeValue.match(URL_REGEX)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.nodeValue.match(RJ_REGEX)) {
             console.log(node.nodeValue);
            return NodeFilter.FILTER_ACCEPT;
          }
        }
        return NodeFilter.FILTER_SKIP;
      },
    },
    false
  );

  let currentNode;
  while (currentNode = rjNodeTreeWalker.nextNode()) {
    if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.classList.contains(VOICELINK_CLASS)) {
      Parser.rebindEvents(currentNode);
    } else if (currentNode.nodeType === Node.TEXT_NODE) {
      Parser.linkify(currentNode);
    }
  }
},

  wrapRJCode: function (rjCode) {
    var e
    e = document.createElement('a')
    e.classList = VOICELINK_CLASS
    e.href = `https://www.dlsite.com/maniax/work/=/product_id/${rjCode}.html/?locale=ja_JP`
    e.innerHTML = rjCode
    e.target = '_blank'
    e.rel = 'noreferrer'
    e.classList.add(rjCode)
    e.setAttribute(RJCODE_ATTRIBUTE, rjCode.toUpperCase())
    e.addEventListener('mouseover', Popup.over)
    e.addEventListener('mouseout', Popup.out)
    e.addEventListener('mousemove', Popup.move)
    return e
  },

  linkify: function (textNode) {
    const nodeOriginalText = textNode.nodeValue
    const matches = []

    let match
    while ((match = RJ_REGEX.exec(nodeOriginalText))) {
      matches.push({
        index: match.index,
        value: match[0],
      })
    }

    // Keep text in text node until first RJ code
    textNode.nodeValue = nodeOriginalText.substring(0, matches[0].index)

    // Insert rest of text while linkifying RJ codes
    let prevNode = null
    for (let i = 0; i < matches.length; ++i) {
      // Insert linkified RJ code
      const rjLinkNode = Parser.wrapRJCode(matches[i].value)
      textNode.parentNode.insertBefore(
        rjLinkNode,
        prevNode ? prevNode.nextSibling : textNode.nextSibling,
      )

      // Insert text after if there is any
      let upper
      if (i === matches.length - 1) upper = undefined
      else upper = matches[i + 1].index
      let substring
      if (
        (substring = nodeOriginalText.substring(matches[i].index + matches[i].value.length, upper))
      ) {
        const subtextNode = document.createTextNode(substring)
        textNode.parentNode.insertBefore(
          subtextNode,
          rjLinkNode.nextElementSibling,
        )
        prevNode = subtextNode
      } else {
        prevNode = rjLinkNode
      }
    }
  },

  rebindEvents: function (elem) {
    if (elem.nodeName === 'A') {
      elem.addEventListener('mouseover', Popup.over)
      elem.addEventListener('mouseout', Popup.out)
      elem.addEventListener('mousemove', Popup.move)
    } else {
      const voicelinks = elem.querySelectorAll('.' + VOICELINK_CLASS)
      for (var i = 0, ii = voicelinks.length; i < ii; i++) {
        const voicelink = voicelinks[i]
        voicelink.addEventListener('mouseover', Popup.over)
        voicelink.addEventListener('mouseout', Popup.out)
        voicelink.addEventListener('mousemove', Popup.move)
      }
    }
  },
}

var globalCodes = []

const Popup = {
  makePopup: function (e, rjCode) {
    const popup = document.createElement('div')
    popup.className = 'voicepopup ' + (getAdditionalPopupClasses() || '')
    popup.id = 'voice-' + rjCode
    popup.style = 'display: flex'
    document.body.appendChild(popup)
    DLsite.request(rjCode, function (workInfo) {
      if (workInfo === null)
        popup.innerHTML = "<div class='error'>Work not found.</span>"
      else {
        function onError(source){
            console.log(img);

            img.onerror=null;
            img.src=workInfo.img.replace('jpg','webp');
            console.log(img);
            return true;
        };
        const img = document.createElement('img');
        img.onerror = (source) => onError(source);
        img.src = workInfo.img
        img.onload = () => Popup.move(e)

        console.log(img);
        let html = `<div class='voice-info'>
                       <h4 class='voice-title'>${workInfo.title.trim()}</h4>
                       <p>サークル名：<span>${workInfo.circle.trim()}</span></p>`
        if (workInfo.date)
          html += `<p>販売日：<span>${workInfo.date}</span></p>`
        else if (workInfo.dateAnnounce)
          html += `<p>予告開始日：<span>${workInfo.dateAnnounce}</span></p>`

        html += `<p>年齢指定：<span>${workInfo.rating.trim()}</span></p>`

        if (workInfo.cv) html += `<p>声優：<span>${workInfo.cv}</span></p>`
        if (workInfo.tags) {
          html += `<p>ジャンル：<span>`
          workInfo.tags.forEach((tag) => { html += tag + '\u3000' })
          html += '</span></p>'
        }

        if (workInfo.filesize) html += `<p>ファイル容量：<span>${workInfo.filesize}</span></p>`

        html += '</div>'
        popup.innerHTML = html
        popup.insertBefore(img, popup.childNodes[0])
      }

      Popup.move(e)
    })
  },
  humanFileSize: function (size) {
    if (!size) return ''
    var i = Math.floor(Math.log(size) / Math.log(1024))
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ' ' +
      ['B', 'kB', 'MB', 'GB', 'TB'][i]
    )
  },

  over: function (e) {
    const rjCode = e.target.getAttribute(RJCODE_ATTRIBUTE)
    const popup = document.querySelector('div#voice-' + rjCode)
    if (popup) {
      const style = popup.getAttribute('style').replace('none', 'flex')
      popup.setAttribute('style', style)
    } else {
      Popup.makePopup(e, rjCode)
    }
  },

  out: function (e) {
    const rjCode = e.target.getAttribute('rjcode')
    const popup = document.querySelector('div#voice-' + rjCode)
    if (popup) {
      const style = popup.getAttribute('style').replace('flex', 'none')
      popup.setAttribute('style', style)
    }
  },

  move: function (e) {
    const rjCode = e.target.getAttribute('rjcode')
    const popup = document.querySelector('div#voice-' + rjCode)
    if (popup) {
      // 如果右侧没有超出屏幕范围
      if (popup.offsetWidth + e.clientX + 24 < window.innerWidth) {
        popup.style.left = e.clientX + 8 + 'px'
      } else {
        // 显示在左侧
        popup.style.left = e.clientX - popup.offsetWidth - 8 + 'px'
      }

      // 如果下方超出屏幕范围
      if (popup.offsetHeight + e.clientY + 16 > window.innerHeight) {
        // 尽可能靠下
        popup.style.top = window.innerHeight - popup.offsetHeight - 16 + 'px'
      } else {
        popup.style.top = e.clientY + 'px'
      }
    }
  },
}

const DLsite = {
  parseWorkDOM: function (dom, rj) {
    // workInfo: {
    //     rj: any;
    //     img: string;
    //     title: any;
    //     circle: any;
    //     date: any;
    //     rating: any;
    //     tags: any[];
    //     cv: any;
    //     filesize: any;
    //     dateAnnounce: any;
    // }
    const workInfo = {}
    workInfo.rj = rj

    let rj_group

    if (rj.endsWith('000')) rj_group = rj
    else {
      if (rj.length == 8){

      rj_group = (parseInt(rj.slice(2, 5)) + 1).toString() + '000'


          if (rj.startsWith("R")){
            rj_group = 'RJ' + ('000000' + rj_group).substring(rj_group.length)
          }
          else if(rj.startsWith("B")){
            rj_group = 'BJ' + ('000000' + rj_group).substring(rj_group.length)
          }
        }

     else{
      rj_group = (parseInt(rj.slice(2, 7)) + 1).toString() + '000'
                         if (rj.startsWith("R")){
            rj_group = 'RJ' + ('00000000' + rj_group).substring(rj_group.length)
          }
    else if(rj.startsWith("B")){
            rj_group = 'BJ' + ('00000000' + rj_group).substring(rj_group.length)
          }
    else{
                    rj_group = 'VJ' + ('00000000' + rj_group).substring(rj_group.length)
    }
      }
    }

    console.log(rj);
    console.log(rj_group);
    if (rj.startsWith("R")){
        workInfo.img =
      'https://img.dlsite.jp/modpub/images2/work/doujin/' +
      rj_group +
      '/' +
      rj +
      '_img_main.jpg'
    }
    else if(rj.startsWith("B")){
              workInfo.img =
      'https://img.dlsite.jp/modpub/images2/work/books/' +
      rj_group +
      '/' +
      rj +
      '_img_main.jpg'

    }
    else{
                      workInfo.img =
      'https://img.dlsite.jp/modpub/images2/work/professional/' +
      rj_group +
      '/' +
      rj +
      '_img_main.jpg'
    }

    workInfo.title = dom.getElementById('work_name').textContent
    workInfo.circle = dom.querySelector('span.maker_name').textContent

    const table_outline = dom.querySelector('table#work_outline')
    for (var i = 0, ii = table_outline.rows.length; i < ii; i++) {
      const row = table_outline.rows[i]
      const row_header = row.cells[0].textContent
      const row_data = row.cells[1]
      switch (true) {
        case row_header.includes('販売日'):
          workInfo.date = row_data.textContent
          break
        case row_header.includes('年齢指定'):
          workInfo.rating = row_data.textContent
          break
        case row_header.includes('ジャンル'):
          const tag_nodes = row_data.querySelectorAll('a')
          workInfo.tags = [...tag_nodes].map((a) => {
            return a.textContent
          })
          break
        case row_header.includes('声優'):
          workInfo.cv = row_data.textContent
          break
        case row_header.includes('ファイル容量'):
          workInfo.filesize = row_data.textContent.replace('合計', '').trim()
          break
        default:
          break
      }
    }

    const work_date_ana = dom.querySelector('strong.work_date_ana')
    if (work_date_ana) {
      workInfo.dateAnnounce = work_date_ana.innerText
          if (rj.startsWith("R")){
          workInfo.img =
        'https://img.dlsite.jp/modpub/images2/work/doujin/' +
        rj_group +
        '/' +
        rj +
        '_ana_img_main.jpg'
      }
      else{
                workInfo.img =
        'https://img.dlsite.jp/modpub/images2/work/books/' +
        rj_group +
        '/' +
        rj +
        '_ana_img_main.jpg'

      }

    }

    return workInfo
  },

  request: function (rjCode, callback) {
    const url = `https://www.dlsite.com/maniax/work/=/product_id/${rjCode}.html/?locale=ja_JP`
    getXmlHttpRequest()({
      method: 'GET',
      url,
      headers: {
        Accept: 'text/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0)',
      },
      onload: function (resp) {
        if (resp.readyState === 4 && resp.status === 200) {
          const dom = new DOMParser().parseFromString(
            resp.responseText,
            'text/html',
          )
          const workInfo = DLsite.parseWorkDOM(dom, rjCode)
          callback(workInfo)
        } else if (resp.readyState === 4 && resp.status === 404)
          DLsite.requestAnnounce(rjCode, callback)
      },
    })
  },

  requestAnnounce: function (rjCode, callback) {
    const url = `https://www.dlsite.com/maniax/announce/=/product_id/${rjCode}.html/?locale=ja_JP`
    getXmlHttpRequest()({
      method: 'GET',
      url,
      headers: {
        Accept: 'text/xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:67.0)',
      },
      onload: function (resp) {
        if (resp.readyState === 4 && resp.status === 200) {
          const dom = new DOMParser().parseFromString(
            resp.responseText,
            'text/html',
          )
          const workInfo = DLsite.parseWorkDOM(dom, rjCode)
          callback(workInfo)
        } else if (resp.readyState === 4 && resp.status === 404) callback(null)
      },
    })
  },
}

document.addEventListener('DOMContentLoaded', function () {
  const style = document.createElement('style')
  style.innerHTML = css
  document.head.appendChild(style)

  Parser.walkNodes(document.body)

  const observer = new MutationObserver(function (m) {
    for (let i = 0; i < m.length; ++i) {
      let addedNodes = m[i].addedNodes

      for (let j = 0; j < addedNodes.length; ++j) {
        Parser.walkNodes(addedNodes[j])
      }
    }
  })

  document.addEventListener('securitypolicyviolation', function (e) {
    if (e.blockedURI.includes('img.dlsite.jp')) {
      const img = document.querySelector(`img[src="${e.blockedURI}"]`)
      img.remove()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
})

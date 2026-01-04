// ==UserScript==
// @name        Download Original Picture
// @name:zh-CN  下载原始图片
// @description  A tool to help you download full size images from websites
// @description:zh-CN  一个帮你从网站下载原始尺寸图片的工具
// @namespace    https://hx.fyi/
// @version     0.1.5
// @license     GPL-3.0
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTA4IDUwOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+IDxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRDA1QjsiIGN4PSIyNTQiIGN5PSIyNTQiIHI9IjI1NCIvPiA8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTM3Mi44LDE5NkgzNjhjLTIuNC00MC40LTM1LjYtNzIuNC03Ni40LTcyLjRjLTQsMC04LDAuNC0xMS42LDAuOGMtMTYtMjguNC00Ni00Ny42LTgwLjgtNDcuNiBjLTUxLjIsMC05Mi40LDQxLjYtOTIuNCw5Mi40YzAsMTAuOCwyLDIxLjIsNS4yLDMwLjhjLTI1LjIsMTAtNDIuOCwzNC00Mi44LDYyLjRjMCwzNi40LDI5LjYsNjYuNCw2Ni40LDY2LjRoMjM3LjIgYzM2LjQsMCw2Ni40LTI5LjYsNjYuNC02Ni40QzQzOC44LDIyNS42LDQwOS4yLDE5NiwzNzIuOCwxOTZ6Ii8+IDxwYXRoIHN0eWxlPSJmaWxsOiNGRjcwNTg7IiBkPSJNMzI1LjIsMzYyLjRsLTY2LjQsNjYuNGMtMi44LDIuOC03LjIsMi44LTEwLDBsLTY2LTY2LjRjLTQuNC00LjQtMS4yLTEyLDQuOC0xMmgxNC44IGM0LDAsNy4yLTMuMiw3LjItNy4ydi05NmMwLTQsMy4yLTcuMiw3LjItNy4yaDc0LjhjNCwwLDcuMiwzLjIsNy4yLDcuMnY5NmMwLDQsMy4yLDcuMiw3LjIsNy4yaDE0LjggQzMyNi40LDM1MC40LDMyOS42LDM1OCwzMjUuMiwzNjIuNHoiLz4gPC9zdmc+IA==
// @author      hzfi < hzfi@hx.fyi >
// @supportURL  https://github.com/hzfi/user-scripts-and-styles/issues/new
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=your.email.here@example.com&item_name=Greasy+Fork+donation
// @contributionAmount 5
// @include     *://medium.com/*
// @include     *://x.com/*
// @include     *://*.x.com/*
// @include     *://weibo.com/*
// @include     *://*.weibo.com/*
// @include     *://*.vmgirls.com/*
// @include     *://wallpaperhub.app/*
// @include     *://*.bing.com/*
// @include     *://*.msn.cn/*
// @include     *://instagram.com/*
// @include     *://*.instagram.com/*
// @include     *://tiktok.com/*
// @include     *://*.tiktok.com/*
// @include     *://*.douyin.com/*
// @include     *://*.kuaishou.com/*
// @include     *://*.xiaohongshu.com/*
// @match     *://nijijourney.com/*
// @match     *://*.midjourney.com/*
// @match     *://dribbble.com/*
// @match     *://*.dribbble.com/*
// @match     *://bsky.app/*
// @match     *://mastodon.social/*
// @match     *://mastodon.online/*


// @noframes
// @grant          unsafeWindow
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_info
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/396746/Download%20Original%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/396746/Download%20Original%20Picture.meta.js
// ==/UserScript==

const styleContent = `.hx-download-original-images-tool{
  position: absolute;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTA4IDUwOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+IDxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRDA1QjsiIGN4PSIyNTQiIGN5PSIyNTQiIHI9IjI1NCIvPiA8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTM3Mi44LDE5NkgzNjhjLTIuNC00MC40LTM1LjYtNzIuNC03Ni40LTcyLjRjLTQsMC04LDAuNC0xMS42LDAuOGMtMTYtMjguNC00Ni00Ny42LTgwLjgtNDcuNiBjLTUxLjIsMC05Mi40LDQxLjYtOTIuNCw5Mi40YzAsMTAuOCwyLDIxLjIsNS4yLDMwLjhjLTI1LjIsMTAtNDIuOCwzNC00Mi44LDYyLjRjMCwzNi40LDI5LjYsNjYuNCw2Ni40LDY2LjRoMjM3LjIgYzM2LjQsMCw2Ni40LTI5LjYsNjYuNC02Ni40QzQzOC44LDIyNS42LDQwOS4yLDE5NiwzNzIuOCwxOTZ6Ii8+IDxwYXRoIHN0eWxlPSJmaWxsOiNGRjcwNTg7IiBkPSJNMzI1LjIsMzYyLjRsLTY2LjQsNjYuNGMtMi44LDIuOC03LjIsMi44LTEwLDBsLTY2LTY2LjRjLTQuNC00LjQtMS4yLTEyLDQuOC0xMmgxNC44IGM0LDAsNy4yLTMuMiw3LjItNy4ydi05NmMwLTQsMy4yLTcuMiw3LjItNy4yaDc0LjhjNCwwLDcuMiwzLjIsNy4yLDcuMnY5NmMwLDQsMy4yLDcuMiw3LjIsNy4yaDE0LjggQzMyNi40LDM1MC40LDMyOS42LDM1OCwzMjUuMiwzNjIuNHoiLz4gPC9zdmc+IA==);
  background-size: cover;
  width: 50px;
  height: 50px;
  cursor: pointer;
  opacity: .35;
  z-index: 50000;
  transform: scale(.75);
  transition: all cubic-bezier(0.18, 0.89, 0.32, 1.28) 250ms;
}
.hx-download-original-images-tool.white{
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9ImluaGVyaXQiIGltcGxpY2l0LWNvbnNlbnQtc291cmNlPSJ0cnVlIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEuMDEyMiAwIDAgMS4wMTIyIC0yOC42ODQgLTMuNDMzOSkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjMiPgogIDxjaXJjbGUgY3g9IjQwLjE5NCIgY3k9IjE1LjI0OCIgcj0iOC45ODI0Ii8+CiAgPHBhdGggZD0ibTQ1IDE3LTQuNTMzIDMuNTQ3Yy0wLjE2NjU5IDAuMTMwMzUtMC4zODQ2MSAwLjE0OTU3LTAuNTM0MTggMGwtNC41NjY0LTMuNTQ3Yy0wLjIzNTA0LTAuMjM1MDQtMC4wNjQxLTAuNjQxMDIgMC4yNTY0MS0wLjY0MTAyaDIuNDM2MmMwLjIxMzY3IDAgMC4zODQ2MS0wLjE3MDk0IDAuMzg0NjEtMC4zODQ2MXYtNS43MzI5YzAtMC4yMTM2NyAwLjE3MDk0LTAuMzg0NjEgMC4zODQ2MS0wLjM4NDYxaDIuNzAzNmMwLjIxMzY3IDAgMC4zODQ2MSAwLjE3MDk0IDAuMzg0NjEgMC4zODQ2MXY1LjczMjljMCAwLjIxMzY3IDAuMTcwOTQgMC4zODQ2MSAwLjM4NDYxIDAuMzg0NjFoMi40NjM5YzAuMjk5MTQgMCAwLjQ5NjgyIDAuNDM2MTggMC4yMzUwNCAwLjY0MTAyeiIvPgogPC9nPgo8L3N2Zz4K);
  width: 24px;
  height: 24px;
}
.hx-download-original-images-tool:hover {
  opacity:1;
  transform: scale(.9);
}
.hx-download-original-images-tool:active {
  opacity:.8;
  transform: scale(.7)  rotateZ(360deg);
}
.hx-download-original-images-tool-msg {
position: fixed;
left: -250px;
bottom: 50px;
width: 250px;
background: linear-gradient(to bottom right, #00000037, #0004 , #00000057 );
box-shadow: 1px 0 20px 1px #64646433;
padding: 2px 20px;
z-index: 65536;
border-radius: 100px;
color: #fff;
transform: translateX(280px) translateY(0);
transition: all cubic-bezier(0.18, 0.89, 0.32, 1.28) 250ms;
}`

const head = document.getElementsByTagName('head');
head[0].insertAdjacentHTML('beforeend', `<style type="text/css">${styleContent}</style>`);

GM_addStyle(styleContent);


console.warn('Welcome to %c \ud83d\ude48\ud83d\ude49\ud83d\ude4a\u0020\u0048\u007a\u00b2\u0020\u0053\u0063\u0072\u0069\u0070\u0074\u0020\u004c\u0069\u0062\u0072\u0061\u0072\u0079 %c v0.06 ', 'background-color:teal;color: white;border:1px solid teal;border-radius: 4px 0 0 4px;border-left-width:0;padding:1px;margin:2px 0;font-size:1.1em', 'background-color:#777;color: white;border:1px solid #777;border-radius: 0 4px 4px 0;border-right-width:0;padding:1px;margin:5px 0;');

try {
  customElements.define('hxdownload-message',
    class extends HTMLElement {
      constructor () {
        super();

        const divElem = document.createElement('div');
        // divElem.textContent = this.getAttribute('text');
        divElem.className = 'text-node'
        // style
        const style = document.createElement('style');
        style.append(document.createTextNode(`
    .text-node{
      font-size: 14px;
      line-height: 21px;
      font-family: sans-serif;
      width: 100%;
      overflow: hidden;
      word-break: break-word;
    }
    `))
        const shadowRoot = this.attachShadow({
          mode: 'open'
        });
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(divElem);
      }
    }
  );

} catch (error) {

}


globalThis.__hx_Msg_list = new Set();

class __hx_MsgIns {
  constructor (text) {
    this.text = text;
    this.el = document.createElement('hxdownload-message')
    document.body.insertAdjacentElement('beforeend', this.el)
    this.el.className = 'hx-download-original-images-tool-msg';
    this.textEl = this.el.shadowRoot.querySelector('.text-node')
    this.textEl.innerText = text;
    __hx_Msg_list.add(this);
    this.el.style.transform = `translateX(280px) translateY(-${(__hx_Msg_list.size - 1) * 50}px)`
  }
  /**
   * @param {any} text
   */
  update(text) {
    this.textEl.innerText = text
  }
  close() {
    this.textEl.innerText = ''
    this.el.parentElement.removeChild(this.el)
    __hx_Msg_list.delete(this);
  }
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const openDown = (url, e, name) => {
  e && e.preventDefault();
  e && e.stopPropagation()


  const downBlobUrl = (blobUrl) => {
    let el = document.createElement("a");
    el.setAttribute("href", blobUrl);
    if (name) {
      el.setAttribute("download", name)
    }
    if (document.createEvent) {
      const event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      el.dispatchEvent(event);
    } else {
      el.click();
    }

  }

  if (url.startsWith('blob')) {
    downBlobUrl(url)
    return

  }

  fetch(url, {
    mode: "cors"
  })
    .then(async resp => {
      // instead of response.json() and other methods
      const reader = resp.body.getReader();
      const contentLength = +resp.headers.get('Content-Length');
      const ct = (resp.headers && resp.headers.get('Content-Type')) || '';
      console.log('ct', ct);
      // Step 3: read the data
      let receivedLength = 0; // received that many bytes at the moment
      let chunks = []; // array of received binary chunks (comprises the body)


      const __hx_Msg = new __hx_MsgIns('Loading');


      // infinite loop while the body is downloading
      while (true) {
        // done is true for the last chunk
        // value is Uint8Array of the chunk bytes
        const {
          done,
          value
        } = await reader.read();

        if (done) {
          break;
        }
        chunks.push(value);
        receivedLength += value.length;
        const text =
          __hx_Msg.update(`Received ${formatBytes(receivedLength)} / ${formatBytes(contentLength)}`)
      }
      __hx_Msg.close()
      return new Blob(chunks, {
        type: ct
      });


      // // Step 4: concatenate chunks into single Uint8Array
      // let chunksAll = new Uint8Array(receivedLength); // (4.1)
      // let position = 0;
      // for(let chunk of chunks) {
      //   chunksAll.set(chunk, position); // (4.2)
      //   position += chunk.length;
      // }

      // // Step 5: decode into a string
      // let result = new TextDecoder("utf-8").decode(chunksAll);

      // // We're done!
      // let commits = JSON.parse(result);
      // alert(commits[0].author.login);

      // return resp.blob()
    })
    .then(r => {
      const blobUrl = URL.createObjectURL(r)
      downBlobUrl(blobUrl)
    })
    .catch(err => {
      console.log("Request failed", err);
    });
}

const hostname = window.location.hostname

const lastItem = (arr, index = 0) => arr.length ? arr[arr.length - 1 - index] : ''

const createDomAll = (item, fn) => {
  let domDL = document.createElement('a');
  domDL.className = 'hx-download-original-images-tool'
  domDL.title = '下载原始图片'

  // item.addEventListener('load', _ => {
  let link = fn(item.src)
  domDL.href = link || item.src
  domDL.addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    openDown(link, e, lastItem(link.split('/')))
  })
  // })
  item.insertAdjacentElement('afterEnd', domDL)
}

const createDom = (cfg) => {
  const {
    parent,
    link,
    name,
    className = '',
    style = '',
    target,
    postion = 'afterEnd',
    linkArr
  } = cfg

  const genDomDL = (dom) => {
    let domDL = dom || document.createElement('a');
    Object.assign(domDL, {
      title: '下载原始图片',
      className: 'hx-download-original-images-tool ' + className,
      style: style,
      href: link,
    })
    domDL.onclick = e => {
      e && e.preventDefault();
      e && e.stopPropagation()
      const newName = name || lastItem(link.split('/'))
      if (linkArr) {
        linkArr.forEach(({
          link,
          name
        }) => openDown(link, e, name))
      } else {
        openDown(link, e, newName);
      }
    }
    return domDL
  }

  let parent2 = parent
  if (!parent && target) {
    parent2 = target.parentElement
  }
  // if (['afterEnd', 'beforeBegin'].includes(postion)) {
  //   parent2 = target.parentElement.parentElement
  // }
  const exist = parent2.querySelector('.hx-download-original-images-tool')
  if (exist) {
    genDomDL(exist)
  } else {
    parent2.insertAdjacentElement(postion, genDomDL())
  }
}

const updateLink = (dom, link) => {
  dom.href = link
  const newName = lastItem(link.split('/'))
  dom.onclick = e => openDown(link, e, newName)
}

const init = () => {

  if ([
    'x.com',
    'mobile.x.com',
    'tweetdeck.x.com',
  ].includes(hostname)) {
    //x
    window.addEventListener('mouseover', ({
      target
    }) => {
      const src = target && target.src
      const parent = target.parentElement
      const next = parent && parent.nextElementSibling
      if (target.tagName == 'IMG' &&
        !(next && next.className.includes('hx-download-original-images-tool')) &&
        !/profile_images|emoji|video_thumb/g.test(src)) {
        const link = src.replace(/\&name=\w+/g, '&name=orig')
        const name = lastItem(link.split('/')).replace(/\?format=(\w+)\&name=orig/g, (_, b) => `.${b}`)
        const style = 'margin-left: 10px;margin-top: 10px;'
        const cfg = {
          parent,
          link,
          name,
          style
        }
        createDom(cfg)
      }
    })
  } else if (hostname.includes('weibo')) {
    const isWeiboNode = dom => {
      const getNodeValue = el => el.attributes['node-type'] && el.attributes['node-type'].nodeValue
      if (getNodeValue(dom.parentElement) === 'artwork_box' || getNodeValue(dom) === 'img_box' || dom.className.includes('woo-picture-main') || dom.className.includes('woo-picture-slot') || dom.className.includes('imgInstance')) {
        return true
      } else {
        return false
      }
    }
    window.addEventListener('mouseover', ({
      target
    }) => {
      const parent = target.parentElement
      const next = parent && parent.nextElementSibling
      if (target.tagName == 'IMG' && isWeiboNode(parent)) {
        const link = target.src.replace(/orj\d+|mw\d+/g, 'large')
        if (next && next.className.includes('hx-download-original-images-tool')) {
          updateLink(next, link)
        } else {
          const style = 'top: 40px;right: 10px;'
          const cfg = {
            parent,
            link,
            style
          }
          createDom(cfg)
        }
      }
    })
  } else if (hostname === "www.vmgirls.com") {
    // vmgirls
    let domDL = document.createElement('a');
    domDL.className = 'hx-download-original-images-tool '
    domDL.style = 'position: relative;margin-right: 10px;display: inline-block;vertical-align: -20px;'
    domDL.title = '下载原始图片'
    domDL.onclick = e => {
      const list1 = [...document.querySelector('.post').querySelectorAll('a')].filter(x => x.src && x.src.indexOf('static.vmgirls.com/image') !== -1)
      const list2 = [...document.querySelector('.post-content').querySelectorAll('img')].filter(x => x.src && x.src.indexOf('t.cdn.ink/image') !== -1)
      const imgList = [...list1, ...list2].map((x, i) => ({
        link: x.src && x.src.replace('-scaled', ''),
        name: `${x.alt || x.title}_${i}.jpg`
      }))
      domDL.title += ' ' + imgList.length
      imgList.forEach(x => openDown(x.link, e, x.name))
      const link1 = imgList.map(x => x.link).join('\n')
      const link2 = imgList.map(x => `aria2c -o ${x.name} ${x.link}`).join('\n')
      const content = `<html><head><meta charset="utf-8"><title>获取链接</title></head><body><textarea style="width: 850px; height: 250px; margin: 30px;">${link1}</textarea>
    <textarea style="width: 850px; height: 250px; margin: 30px;">${link2}</textarea>
    </body></html>`
      window.open(URL.createObjectURL(new Blob([content], {
        type: 'text/html'
      })))
    }
    document.querySelector('.main-submenu').insertAdjacentElement('afterBegin', domDL)
  } else if (hostname === "medium.com") {
    // medium
    document.querySelector('article').querySelectorAll('img').forEach(x => {
      if (x.width < 80) {
        return
      } else if (x.src.includes('max')) {
        createDomAll(x, src => src.replace(/max\/\d+\//g, 'max/30000/'))
      } else if (x.src.includes('resize')) {
        // https://miro.medium.com/v2/resize:fit:700/1*OG99lac_uxo6nUOcJtUrNw.jpeg
        createDomAll(x, src => src.replace(/resize:fit:\d+\//g, ''))
      }
    })
  } else if (hostname === "wallpaperhub.app") {
    // wallpaperhub
    const odomList = [...document.querySelectorAll('.downloadButton')]
    odomList.forEach(odom => {
      if (odom) {
        let link0 = odom.href.split('downloadUrl=')[1]
        const link = link0
        const style = 'position: relative;margin-right: 10px;display: inline-block;vertical-align: -20px;'
        const cfg = {
          parent: odom.parentElement.parentElement,
          link,
          style,
          postion: 'beforeBegin'
        }
        createDom(cfg)
      }
    })
  } else if (hostname === "ntp.msn.cn") {
    // edge 首页
    const link = document.querySelector('background-image')._imageSource;
    const style = 'position: fixed;right: 80px;top: 40px;'
    const cfg = {
      parent: document.body,
      link,
      className: 'white',
      style,
      postion: 'beforeBegin'
    }
    createDom(cfg)
  } else if (hostname === "www.bing.com") {
    // bing 首页
    const orig = document.querySelector('[style*="th?id="]').style.backgroundImage
    const link = orig.match(/th\?id\=[\w\d\.\-\_]+/g)[0].replace('1920x1080', 'UHD').replace('webp', 'jpg')
    const name = link && link.split('=')[1]
    const style = 'position: relative;width: 42px;height: 42px;margin: 0;opacity: .9;'
    const cfg = {
      parent: document.querySelector('#id_h'),
      link,
      name,
      className: 'white',
      style,
      postion: 'afterBegin'
    }
    createDom(cfg)
  } else if (hostname === "cn.bing.com") {
    // bing 首页
    const link = document.querySelector('#bgImgProgLoad').dataset.ultraDefinitionSrc.split('&')[0];
    const name = link && link.split('=')[1]
    const style = 'position: fixed;right: 225px;bottom: 53px;margin: 0px;width: 64px;height: 64px;z-index: 550;opacity: .9;'
    const cfg = {
      parent: document.body,
      link,
      name,
      className: 'white',
      style,
      postion: 'beforeBegin'
    }
    createDom(cfg)
  } else if (hostname === "www.instagram.com") {
    window.addEventListener('mouseover', ({
      target
    }) => {
      const el = target.previousElementSibling
      const el2 = target.parentElement
      const img = (el && el.querySelector('img:not([data-testid])') || el2 && el2.querySelector('video:not([data-testid])'))
      if (img) {
        const src = img.src
        const parent = img.parentElement
        const link = src
        const style = 'left: 10px;top: 10px;'
        const cfg = {
          parent,
          link,
          style,
          target: img,
          name: img.alt ? (img.alt + '.jpg') : src.split(/[\?\/]/g).filter(x => x.endsWith('.jpg'))[0],
          postion: 'beforeEnd'
        }
        createDom(cfg)
      }
    })
  } else if (hostname === "www.tiktok.com") {
    window.addEventListener('mouseover', ({
      target
    }) => {
      if (target.tagName == 'VIDEO') {
        const src = target.src
        const parent = target.parentElement
        const link = src
        const style = 'left: 10px;top: 10px;'
        const cfg = {
          parent,
          link,
          style,
          target,
          name: lastItem(src.split('?')[0].split('/').filter(x => x)),
          postion: 'beforeEnd'
        }
        createDom(cfg)
      }
    })
  } else if (hostname === "www.douyin.com") {
    window.addEventListener('mouseover', ({
      target
    }) => {
      // if (target && target.tagName === 'VIDEO') {
      //   const src = (target.querySelector('source') || target).src
      //   const link = src
      //   const style = 'left: 10px;top: 10px;'
      //   const cfg = {
      //     link,
      //     style,
      //     target,
      //     postion: 'afterEnd',
      //     name: lastItem(src.split('?')[0].split('/').filter(x => x)),
      //   }
      //   createDom(cfg)
      //   return
      // } else
      if (target && target.parentElement) {
        const container = target.parentElement.parentElement || {
          className: ''
        }
        if (container && container.className.includes('videoContainer') && container.querySelector('video')) {
          const src = (container.querySelector('source') || container.querySelector('video')).src
          const link = src
          const style = 'left: 10px;top: 10px;'
          const cfg = {
            link,
            style,
            target: container,
            postion: 'beforeEnd',
            name: lastItem(src.split('?')[0].split('/').filter(x => x)),
          }
          createDom(cfg)
        }

      }
    })
  } else if (hostname === "www.kuaishou.com") {
    window.addEventListener('mouseover', ({
      target
    }) => {
      if (target && target.parentElement) {
        const container = target.parentElement.parentElement || {
          className: ''
        }
        if (container && container.className.includes('kwai-player') && container.querySelector('video')) {
          const src = (container.querySelector('source') || container.querySelector('video')).src
          const link = src
          const style = 'left: 10px;top: 10px;'
          const cfg = {
            link,
            style,
            target: container,
            postion: 'beforeEnd',
            name: lastItem(src.split('?')[0].split('/').filter(x => x)),
          }
          createDom(cfg)
        }

      }
    })
  } else if (hostname === "www.xiaohongshu.com") {
    window.addEventListener('mouseover', ({
      target
    }) => {
      const container = target && target.parentElement
      if (container && container.className && container.className.includes('carousel')) {
        const inner = container.querySelector('li:not([style*=none]) .inner')
        const src = inner && inner.style['background-image'].replace(/^url\(\"|\"\)$/g, '')
        const link = src
        const style = 'left: 10px;top: 10px;'
        const cfg = {
          link,
          style,
          parent: container,
          postion: 'beforeEnd',
          name: lastItem(src.split('?')[0].split('/').filter(x => x)) + '.jpg',
        }
        createDom(cfg)
      }


    })
  } else if (hostname === "dribbble.com") {
    window.addEventListener('mouseover', ({
      target
    }) => {
      const container = target && target.parentElement && target.parentElement.parentElement
      if (container && container.className && (container.className.includes('block-media') || container.className.includes('video-container'))) {
        const inner = container.querySelector('img') || container.querySelector('video');
        let src = '';
        if (inner.tagName === 'IMG') {
          src = (inner && (inner.src || inner.srcset)).split('?')[0]
        } else if (inner.tagName === 'VIDEO') {
          src = inner && inner.src
        }
        const link = src
        const style = 'left: 10px;top: 10px;'
        const cfg = {
          link,
          style,
          parent: container,
          postion: 'beforeEnd',
          name: lastItem(src.split('?')[0].split('/').filter(x => x)),
        }
        createDom(cfg)
      }


    })

  } else if (hostname === "nijijourney.com" || hostname === 'www.midjourney.com') {
    window.addEventListener('mouseover', ({
      target
    }) => {
      const container = target && target.parentElement && target.parentElement.parentElement
      if (container) {
        const inner = container.querySelector('link')
        const src = inner && inner.href.replace('_32_N.webp', '.webp')
        const link = src || ''
        const style = 'left: 10px;top: 10px;'
        const baseName = lastItem(link.split(/[\/\?]/), 1);
        let linkArr = []
        //linkArr.forEach(({ link, name}
        const linkCount = lastItem(link.split(/[\.\_\/]/), 1)
        const cfg = {
          link,
          style,
          parent: container,
          postion: 'beforeEnd',
          name: baseName,
        }
        if (Number(linkCount) > 0) {
          cfg.linkArr = Array.from({
            length: Number(linkCount) + 1
          }).map((x, i) => ({
            link: link.replace(/(\d).webp$/, i + '.webp'),
            name: baseName + '_' + i
          }))
        }
        createDom(cfg)
      }


    })
  } else if ([
    'bsky.app',
  ].includes(hostname)) {
    window.addEventListener('mouseover', ({
      target
    }) => {
      const src = target && target.src
      const parent = target.parentElement
      const next = parent && parent.nextElementSibling
      if (target.tagName == 'IMG' && target.width >= 100 && target.height >= 100 &&
        !(next && next.className.includes('hx-download-original-images-tool')) &&
        !/profile_images|emoji|video_thumb/g.test(src)) {
        const link = src.replace(/^https:\/\/cdn\.bsky\.app\/img\/feed_thumbnail\/plain\/(did:plc:[a-z0-9]+)\/([a-z0-9]+)@(jpg|jpeg|png|gif|bmp|webp|svg|tiff)$/, 'https://bsky.social/xrpc/com.atproto.sync.getBlob?did=$1&cid=$2')
        const name = src.replace(/^https:\/\/cdn\.bsky\.app\/img\/feed_thumbnail\/plain\/(did:plc:[a-z0-9]+)\/([a-z0-9]+)@(jpg|jpeg|png|gif|bmp|webp|svg|tiff)$/, '$1.$2.$3')
        const style = 'margin-left: 10px;margin-top: 10px;'
        const cfg = {
          parent,
          link,
          name,
          style
        }
        createDom(cfg)
      }
    })
    // 长毛象
  } else if (
    [
      'mastodon.social',
      'mastodon.online',
    ].includes(hostname)
  ) {
    window.addEventListener('mouseover', ({
      target
    }) => {
      const container = target && target.parentElement && target.parentElement.parentElement
      if (container && container.className && (container.className.includes('media-gallery__item')

      )) {
        const inner = container.querySelector('img')
          || container.querySelector('video');
        let src = '';
        if (inner.tagName === 'IMG') {
          src = (inner && (inner.src || inner.srcset)).split('?')[0]
        } else if (inner.tagName === 'VIDEO') {
          src = inner && inner.src
        }
        const link = src?.replace('/small/', '/original/')
        const style = 'left: 10px;top: 10px;'
        const cfg = {
          link,
          style,
          parent: container,
          postion: 'beforeEnd',
          name: lastItem(src.split('?')[0].split('/').filter(x => x)),
        }
        createDom(cfg)
      }


    })
  } else {
    // others
  }

}

setTimeout(() => {
  init()
}, 1200);

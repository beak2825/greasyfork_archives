// ==UserScript==
// @name         EXGF
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  /oh /hsh /zhq
// @author       ExplodingKonjac && JWRuixi
// @license      GPLv3
// @match        http://*.gdfzoj.com/*
// @icon         http://www.gdfzoj.com:23380/images/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/509658/EXGF.user.js
// @updateURL https://update.greasyfork.org/scripts/509658/EXGF.meta.js
// ==/UserScript==

(function () {
  "user strict";
  var css = "";
  css += [
    ".card table, .tab-content table {",
    "  background: none;",
    "}",
    ".card, .table {",
    "  background: rgba(252, 252, 252, .85);",
    "  border-radius: 5px;",
    "}",
    "html > body {",
    "  background-image: url(https://cdn-fusion.imgcdn.store/i/2024/p8HeWzxkl75PEHUJ.png);",
    "  background-repeat: no-repeat;",
    "  background-size: cover;",
    "  background-position: center;",
    "  background-attachment: fixed;",
    "}",
    ".nav-tabs .nav-link, .nav-pills .nav-link {",
    "  background-color: #e0f7ff;",
    "  border-radius: 0px;",
    "}",
    ".nav, .table, .table th, .table td, .card {",
    "  border: none;",
    "}",
    ".nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active, .nav-pills .nav-link.active, .nav-pills .show>.nav-link {",
    "  color: #fff;",
    "  background-color: #3498db;",
    "  border: none;",
    "}",
    ".row {",
    "  margin-bottom: 10px;",
    "}",
    "code {",
    "  font-family: Fira Code !important;",
    "}",
    ".sh_keyword, .sh_function {",
    "  font-weight: 600 !important;",
    "}",
    "h1:is(.text-center), h2:is(.text-center) {",
    " color: #fff !important;",
    "}"
  ].join("\n");

  if ((new RegExp("http://www.gdfzoj.com:23380/problem/[0-9]+/manage/*").test(document.location.href)) || (new RegExp("http://www.gdfzoj.com:23380/admin/*").test(document.location.href))) {
    css += [
      "h1, h2, h3, h5, h6, label, .top-buffer-md, p, li, dd, dt {",
      "  color: #fff !important;",
      "}"
    ].join("\n");
  }

  if ((new RegExp("http://www.gdfzoj.com:23380/problem/[0-9]+/manage/*").test(document.location.href)) || ((new RegExp("http://www.gdfzoj.com:23380/admin/*").test(document.location.href)) && !(new RegExp("http://www.gdfzoj.com:23380/admin/custom-test").test(document.location.href)))) {
    css += [
      "h4 {",
      "  color: #fff !important;",
      "}"
    ].join("\n");
  }

  if (new RegExp("http://www.gdfzoj.com:23380/problems/*").test(document.location.href)) {
    css += [
      ".row:not(:has(.offset-md-3)) {",
      "  background: rgba(252, 252, 252, .85);",
      "  border-radius: 5px;",
      "  margin-left: 0px;",
      "  margin-right: 0px;",
      "}",
      ".col-lg-4 {",
      "  padding-top: 10px;",
      "  padding-bottom: 8px;",
      "}",
      ".offset-md-3.col-md-6 > .justify-content-center {",
      "  display: none;",
      "}"
    ].join("\n");
  }

  if ((new RegExp("http://www.gdfzoj.com:23380/problem/*").test(document.location.href)) || (new RegExp("http://www.gdfzoj.com:23380/contest/[0-9]+/problem/*").test(document.location.href))) {
    css += [
      ".row {",
      "  margin-left: 0px;",
      "  margin-right: 0px;",
      "}",
      ".tab-content {",
      "  background: rgba(252, 252, 252, .85);",
      "  border-radius: 5px;",
      "  margin-top: 15px;",
      "  padding: 15px;",
      "}",
      ".page-header {",
      "  border-bottom: none !important;",
      "}"
    ].join("\n");
  }

  if (new RegExp("http://www.gdfzoj.com:23380/submission/*").test(document.location.href)) {
    css += [
      ".card-header.bg-info {",
      "  background-color: #eee !important;",
      "}"
    ].join('\n');
  }

  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  } else if (typeof addStyle != "undefined") {
    addStyle(css);
  } else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }

  // Select all elements with the class 'uoj-username'
  const usernames = document.querySelectorAll('.uoj-username');
  const me = ['valor']; // Change it as you see fit!
  const specified_users = ['ceba'];

  usernames.forEach(username => {
    const text = username.textContent;
    if (text.length > 0) {
      if (specified_users.includes(text)) {
        const firstLetter = text.charAt(0); 
        const restOfText = text.slice(1);
        username.innerHTML = `
          <span style="font-size: 0;">
              <span style="color: black; font-size: small;">${firstLetter}</span>
              <span style="color: red; font-size: small;">${restOfText}</span>
          </span>
      `;
      } else if (me.includes(text)) {
        username.innerHTML = `
          <span style="
            background: linear-gradient(87deg, #5e72e4 0%, #825ee4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          ">
            ${text}
          </span>
        `;
      }
    }
  });

  // Find all elements with class .card-title under .card.border-info.mb-3
  const cardTitles = document.querySelectorAll('.card.border-info.mb-3 .card-title');

  // Iterate over each card title
  cardTitles.forEach(cardTitle => {
    // Check if the corresponding .sh_sourceCode element is present under the same parent
    const CodeElement = cardTitle.closest('.card.border-info.mb-3').querySelector('code');

    if (CodeElement) {
      // Set the font size
      cardTitle.style.fontSize = '1.75rem';
      cardTitle.style.display = 'inline-block';

      // Check how many .card-title elements have a corresponding .sh_sourceCode
      const siblingCardTitles = Array.from(cardTitle.closest('.uoj-content').querySelectorAll('.card-title'))
        .filter(title => title.closest('.card.border-info.mb-3').querySelector('code'));

      // Set the inner text only if there's exactly one .card-title with a corresponding .sh_sourceCode
      if (siblingCardTitles.length === 1) {
        cardTitle.innerText = 'Source Code';
      }

      // Create the button
      const button = document.createElement('button');
      button.innerHTML = "<div class='exgf-copy'></div>"; // Optional: to use the SVG background
      button.id = 'copyButton';

      // Apply styles to the button
      button.style.color = '#6c757d';
      button.style.border = '0px solid #3498db';
      button.style.marginLeft = '5px'; // Adjust margin as needed
      button.style.fontSize = '0';
      button.style.transition = 'background-color .3s';
      button.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg class=\"icon\" style=\"width: 1em;height: 1em;vertical-align: middle;fill: rgb(108, 117, 125);overflow: hidden;\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2669\"><path d=\"M661.333333 234.666667A64 64 0 0 1 725.333333 298.666667v597.333333a64 64 0 0 1-64 64h-469.333333A64 64 0 0 1 128 896V298.666667a64 64 0 0 1 64-64z m-21.333333 85.333333H213.333333v554.666667h426.666667v-554.666667z m191.829333-256a64 64 0 0 1 63.744 57.856l0.256 6.144v575.701333a42.666667 42.666667 0 0 1-85.034666 4.992l-0.298667-4.992V149.333333H384a42.666667 42.666667 0 0 1-42.368-37.674666L341.333333 106.666667a42.666667 42.666667 0 0 1 37.674667-42.368L384 64h447.829333z\" p-id=\"2670\"></path></svg>')";
      button.style.height = '20px';
      button.style.width = '20px';
      button.style.padding = '0';
      button.style.display = 'inline-block'; // Ensure the button is inline

      // Insert the button after the card title
      cardTitle.parentNode.insertBefore(button, cardTitle.nextSibling);

      // Add the click event listener for the button
      button.addEventListener('click', function () {
        const textToCopy = CodeElement.innerText; // Copy the text from the corresponding .sh_cpp element
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);

        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
      });
    }
  });

  const emoji_dic = {
    'yiw': 'https://www.emojiall.com/img/platform/qq/031@2x.gif',
    'shuai': 'https://www.emojiall.com/img/platform/qq/035@2x.gif',
    'jy': 'https://www.emojiall.com/img/platform/qq/000@2x.gif',
    'zhm': 'https://www.emojiall.com/img/platform/qq/030@2x.gif',
    'shui': 'https://www.emojiall.com/img/platform/qq/008@2x.gif',
    'oh': 'https://www.emojiall.com/img/platform/qq/066@2x.gif',
    'hsh': 'https://www.emojiall.com/img/platform/qq/103@2x.gif',
    'zhq': 'https://s2.loli.net/2023/02/28/atHeX39NGlMfnYI.gif',
    'kuk': 'https://www.emojiall.com/img/platform/qq/016@2x.gif',
    'tiao': 'https://www.emojiall.com/img/platform/qq/041@2x.gif',
    'qd': 'https://www.emojiall.com/img/platform/qq/074@2x.gif',
    'kx': 'https://www.emojiall.com/img/platform/qq/216@2x.gif',
    'my': 'https://www.emojiall.com/img/platform/qq/219@2x.gif',
    'll': 'https://www.emojiall.com/img/platform/qq/005@2x.gif',
    'gz': 'https://www.emojiall.com/img/platform/qq/073@2x.gif',
    'qiao': 'https://www.emojiall.com/img/platform/qq/037@2x.gif',
    'kk': 'https://www.emojiall.com/img/platform/qq/081@2x.gif',
    'cy': 'https://www.emojiall.com/img/platform/qq/013@2x.gif',
    'dz': 'https://www.emojiall.com/img/platform/qq/172@2x.gif',
    'gg': 'https://www.emojiall.com/img/platform/qq/010@2x.gif',
    'hanx': 'https://www.emojiall.com/img/platform/qq/027@2x.gif',
    'fad': 'https://www.emojiall.com/img/platform/qq/039@2x.gif'
  }
  const name_dic = {
    // put names here
    // 'nick name': 'real name'
    '吴尉华': '🐷',
    '谢佳贤': '🐉',
    '张乐涛': '🐢',
    '戴恒飞': '😇',
    '陈梓慠': '🤯',
    '陆梓炀': '🦄',
    '陆梓炀<sup>ℵ</sup>': '🦄',
    '王孜研': '🕊',
    '王孜研<sup>ℵ</sup>': '🕊',
    '王诚俊': '🔨',
    '陈诚': '🤡'
  }
  window.score_blocks = new Array()
  window.name_blocks = new Array()
  window.show_score = false
  window.show_name = false

  window.show_score = GM_getValue('_emojigfoj_show_score')
  if (window.show_score === undefined) {
    GM_setValue('_emojigfoj_show_score', window.show_score = false)
  }
  window.show_name = GM_getValue('_emojigfoj_show_name')
  if (window.show_name === undefined) {
    GM_setValue('_emojigfoj_show_name', window.show_name = false)
  }

  function extendScore(e) {
    e.firstChild.style.width = '0pt'
    e.lastChild.style.width = String(e.oldwidth) + 'pt'
  }
  function shrinkScore(e) {
    if (window.show_score) return
    e.firstChild.style.width = '20pt'
    e.lastChild.style.width = '0pt'
  }
  function showName(e) {
    e.innerHTML = e.realname
  }
  function showNick(e) {
    e.innerHTML = e.nickname
  }
  function getScoreLevel(x) { // 0<=x<=1
    if (x < 0) return 'yiw'
    else if (x == 0) return 'my'
    else if (x < 0.1) return 'shuai'
    else if (x < 0.2) return 'qiao'
    else if (x < 0.3) return 'shui'
    else if (x < 0.4) return 'gg'
    else if (x < 0.5) return 'oh'
    else if (x < 0.6) return 'hsh'
    else if (x < 0.7) return 'tiao'
    else if (x < 0.8) return 'hanx'
    else if (x < 0.9) return 'gz'
    else if (x < 1.0) return 'kx'
    else if (x == 1.0) return 'kuk'
    else if (x > 1.0) return 'jy'
  }
  function newEmoji(url) { // create emoji element
    var res = document.createElement('img')
    res.className = "emoji"
    res.src = url
    return res
  }
  function newScoreBlock(score, emj) { // create score block element
    var res = document.createElement('span')
    res.oldwidth = score.offsetWidth
    if (!window.show_score) {
      score.style.width = '0pt'
    }
    else {
      emj.style.width = '0pt'
      score.style.width = res.oldwidth + 'pt'
    }
    res.style.width = Math.max(res.oldwidth, 20) + 'pt'
    res.className = "score-block"
    res.appendChild(emj)
    res.innerHTML += score.outerHTML
    res.onmouseover = function () { extendScore(res) }
    res.onmouseleave = function () { shrinkScore(res) }
    window.score_blocks.push(res)
    return res
  }
  function newSwitch(id, text, func) { // create a new switch, call func(switch) when changed
    var elem = document.createElement('label')
    elem.className = 'dropdown-item option-label'
    elem.setAttribute('for', id)
    elem.innerHTML += '<input type="checkbox" id="' + id + '" class="custom-control-input">'
    elem.innerHTML += '<div class="option-slider"></div>'
    elem.innerHTML += '<span class="option-text">' + text + '</span>'
    elem.addEventListener('change', function () {
      func(document.getElementById(id))
    })
    return elem
  }
  function createOptionsDropdown() { // create options page
    var elem = document.createElement('li')
    elem.className = 'nav-item dropdown'
    var toggle = document.createElement('a')
    toggle.className = 'nav-link dropdown-toggle'
    toggle.id = 'OptionsDropdown'
    toggle.href = '#'
    toggle.style = 'font-weight: bold'
    toggle.setAttribute('data-toggle', 'dropdown')
    toggle.setAttribute('aria-haspopup', 'true')
    toggle.setAttribute('aria-expanded', 'false')
    toggle.innerHTML = 'Extension'
    elem.appendChild(toggle)
    var menu = document.createElement('div')
    menu.className = 'dropdown-menu'
    menu.setAttribute('aria-labelledby', 'UserDropdown')
    menu.appendChild(newSwitch('ScoreSwitch', 'Show Score', function (e) {
      window.show_score = e.checked
      GM_setValue('_emojigfoj_show_score', e.checked)
      window.score_blocks.forEach(e.checked ? extendScore : shrinkScore)
    }))
    menu.appendChild(newSwitch('NameSwitch', 'Show Real Name', function (e) {
      window.show_name = e.checked
      GM_setValue('_emojigfoj_show_name', e.checked)
      window.name_blocks.forEach(e.checked ? showName : showNick)
    }))
    elem.appendChild(menu)
    var user = document.querySelector('#UserDropdown').parentNode
    user.parentNode.insertBefore(elem, user)
    document.getElementById('ScoreSwitch').checked = window.show_score
    document.getElementById('NameSwitch').checked = window.show_name
  }

  createOptionsDropdown()

  document.querySelectorAll('a[class="uoj-score"]').forEach(function (e) {
    var max_score = 100
    if (e.hasAttribute('data-max')) max_score = Number(e.getAttribute('data-max'))
    var x = Number(e.innerHTML) / max_score
    var url = ''
    if (e.innerHTML == '97') url = emoji_dic.zhm
    else url = emoji_dic[getScoreLevel(x)]
    e.parentNode.insertBefore(newScoreBlock(e, newEmoji(url)), e)
    e.remove()
  })

  document.querySelectorAll('a[class="small"]').forEach(function (e) {
    var str = e.innerHTML
    var url = null
    if (str == 'Compile Error') url = emoji_dic.qd
    else if (str == 'Waiting') url = emoji_dic.zhq
    else if (str == 'Waiting Rejudge') url = emoji_dic.zhq
    else if (str == 'Judging') url = emoji_dic.fad
    if (url != null) e.parentNode.appendChild(newEmoji(url))
  })

  document.querySelectorAll('.uoj-username').forEach(function (e) {
    e.nickname = e.innerHTML
    e.realname = e.nickname
    if (e.nickname in name_dic) {
      e.realname = name_dic[e.nickname]
    }
    e.innerHTML = (window.show_name ? e.realname : e.nickname)
    window.name_blocks.push(e)
  })

  var max_score_elem = document.querySelector('span[class="uoj-score"]')
  if (max_score_elem != null) {
    var max_score = Number(max_score_elem.innerHTML);
    document.querySelectorAll('th').forEach(function (e) {
      var str = ''
      if (e.innerHTML == '总分') str = '赋分'
      else if (e.innerHTML == 'Total Score') str = 'Relative Score'
      else return
      e.insertAdjacentHTML('afterend', '<th style="width:5em">' + str + '</th>')
    })
    document.querySelectorAll('span[class="uoj-score"]').forEach(function (e) {
      var x = (max_score ? Number(e.innerHTML) / max_score : 0)
      var url = emoji_dic[getScoreLevel(x)]
      var str = String((x * 100).toFixed(2)) + '%'
      var pa = e.parentElement
      pa.insertBefore(newScoreBlock(e, newEmoji(url)), e)
      pa.parentElement.insertAdjacentHTML('afterend', '<td style="width:5em; overflow: hidden">' + str + '</td>');
      e.remove()
    })
  }

  var sty = document.createElement('style')
  sty.type = 'text/css'
  sty.innerHTML = `
/* some css */
.emoji {
display: inline-block;
vertical-align: middle;
width: 20pt;
height: 20pt;
transition: width 0.5s;
}
.uoj-score {
display: inline-block;
vertical-align: middle;
overflow: hidden;
transition: width 0.5s;
}
.score-block {
display: inline-block;
white-space: nowrap;
height: 20pt;
}
.option-label {
margin: 0
}
.option-text {
vertical-align: middle;
}
.option-slider {
vertical-align: middle;
position: relative;
display: inline-block;
cursor: pointer;
width: 2em;
height: 1em;
margin-right: 5px;
border: #adb5bd solid 1px;
border-radius: .5em;
background: #ffffff;
transition: all 0.15s;
}
.option-slider::before {
position: absolute;
display: inline-block;
background: #adb5bd;
border-radius: .5em;
content: "";
height: calc(1em - 4px);
width: calc(1em - 4px);
left: 2px;
bottom: 1px;
transition: all 0.15s;
}
.custom-control-input:checked + .option-slider {
background: #007bff;
border: #007bff solid 1px;
}
.custom-control-input:checked + .option-slider::before {
background: #ffffff;
left: 1em;
}
`
  document.head.appendChild(sty)
})();
// ==UserScript==
// @name         侧边栏AI插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  侧边栏AI插件，仅限于个人学习使用，在原版作者夜雨【chatGPT tools Plus（修改版）】插件的基础上修改而来，在此感谢原作者，大家可以去原作者那里支持一波
// @author       千帆一叶渡
// @match        *://*/*
// @match        about:blank
// @match        about:newtab
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_getResourceText
// @grant      GM_setClipboard
// @run-at     document-end
// @require    https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/showdown/2.1.0/showdown.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.6/katex.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @resource toastCss  https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css
// @resource katexCss  https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.6/katex.css
// @connect    api.forchange.cn
// @connect    hunyuan.tencent.com
// @connect    chatforai.cc
// @connect    api.aigcfun.com
// @connect    chatbot.theb.ai
// @connect    cbjtestapi.binjie.site
// @connect    freechatgpt.xgp.one
// @connect    luntianxia.uk
// @connect    chat.51buygpt.com
// @connect    extkj.cn
// @connect    xjai.cc
// @connect    zw7.lol
// @connect    xeasy.me
// @connect   aifree.site
// @connect   ai5.wuguokai.top
// @connect   chat.aidutu.cn
// @connect   aichat.leiluan.cc
// @connect   chat.gptservice.xyz
// @connect   promplate.dev
// @connect   ai.ls
// @connect   letsearches.com
// @connect   powerchat.top
// @connect   wobcw.com
// @connect   chat.68686.ltd
// @connect   t66.ltd
// @connect   t-chat.cn
// @connect   www.aitianhu.com
// @connect   free.anzz.top
// @connect   chat.ohtoai.com
// @connect   freeopenai.xyz
// @connect   supremes.pro
// @connect   bnu120.space
// @connect   free-chat.asia
// @connect   chat7.aifks001.online
// @connect   a0.chat
// @connect   ai.usesless.com
// @connect   www.ftcl.store
// @connect   sunls.me
// @connect   www.pizzagpt.it
// @connect   www.phind.com
// @connect   chat.bushiai.com
// @connect   chatgpt.qdymys.cn
// @connect   pp2pdf.com
// @connect   api.aichatos.cloud
// @connect   ai.fakeopen.com
// @connect   chat2.wuguokai.cn
// @connect   www.gtpcleandx.xyz
// @connect   gpt.esojourn.org
// @connect   free-api.cveoy.top  ----废了----
// @connect   chatcleand.xyz
// @connect   154.40.59.105
// @connect   gptplus.one
// @connect   xcbl.cc
// @connect   hz-it-dev.com
// @connect   6bbs.cn
// @connect   toyaml.com
// @connect   38.47.97.76
// @connect   lbb.ai
// @connect   lovebaby.today
// @connect   gamejx.cn
// @connect   chat86.cn
// @connect   ai001.live
// @connect   ai003.live
// @connect   ai006.live
// @connect   promptboom.com
// @connect   hehanwang.com
// @connect   caipacity.com
// @connect   chatzhang.top
// @connect   51mskd.com
// @connect   forwardminded.xyz
// @connect   1chat.cc
// @connect   api.minimax.chat
// @connect   cytsee.com
// @connect   skybyte.me
// @connect   alllinkai1.com
// @connect   baidu.com
// @connect   geekr.dev
// @connect   chatgptdddd.com
// @connect   anfans.cn
// @connect   bing.com
// @connect   openai.com
// @connect   tongyi.aliyun.com
// @connect   qianwen.aliyun.com
// @connect   ai-yuxin.space
// @connect   xinghuo.xfyun.cn
// @connect   geetest.com
// @connect   neice.tiangong.cn
// @connect   chat.tiangong.cn
// @connect   yeyu1024.xyz
// @connect   chatglm.cn
// @connect   open.bigmodel.cn
// @connect   gptgo.ai
// @connect   chat.360.cn
// @connect   chat.360.com
// @connect   mixerbox.com
// @connect   ohmygpt.com
// @connect   muspimerol.site
// @connect   frechat.xyz
// @compatible   Chrome, Firefox
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487979/%E4%BE%A7%E8%BE%B9%E6%A0%8FAI%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/487979/%E4%BE%A7%E8%BE%B9%E6%A0%8FAI%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

/**
 * 需要ai Token的平台，在这里设置个人的ai相关token，来解决数据跨域问题
 */
const aiTokenInfo = {
  //智普ai
  zhiPu_apiKey: '如果需要用到这个ai，就去官网注册，填你们自己的apiKey，用不到可不管',
  //miniMax平台ai
  minimax_group_id: '如果需要用到这个ai，就去官网注册，填你们自己的group_id，用不到可不管',
  minimax_api_key: '如果需要用到这个ai，就去官网注册，填你们自己的api_key，用不到可不管'
}

const Toast = {
  warn: function (msg, title, options) {
    try {
      toastr.warning(msg, title, options)
    } catch (e) {
    }
  },
  info: function (msg, title, options) {
    try {
      toastr.info(msg, title, options)
    } catch (e) {
    }
  },
  success: function (msg, title, options) {
    try {
      toastr.success(msg, title, options)
    } catch (e) {
    }
  },
  error: function (msg, title, options) {
    try {
      toastr.error(msg, title, options)
    } catch (e) {
    }
  },
};

const util = (function () {

  function initPubKey() {
    Object.keys(aiTokenInfo).forEach(key => {
      GM_setValue(key, aiTokenInfo[key])
    });
  }

  function setPubkey() {
    let gptMode = util.getGPTMode()
    console.log("当前模型：" + gptMode);
    if (gptMode === "zhiPuAi") {
      let apiKey = prompt("请输入您的智谱apiKey", "");
      if (apiKey) {
        GM_setValue("zhiPu_apiKey", apiKey)
      }
    } else if (gptMode === "miniMax") {
      let minimax_group_id = prompt("请输入您的minimax_group_id", "");
      if (minimax_group_id) {
        GM_setValue("minimax_group_id", minimax_group_id)
      }
      let minimax_api_key = prompt("请输入您的minimax_api_key", "");
      if (minimax_api_key) {
        GM_setValue("minimax_api_key", minimax_api_key)
      }
    } else if (gptMode === "zhiNao360") {
      GM_setValue("zhiNao360_sessionId", null);
    } else if (gptMode === "SPARK") {
      GM_setValue("sp_chatId", null);
    } else if (gptMode === "tongYi") {
      GM_setValue("tongYi_sessionId", null);
    } else if (gptMode === "chatGLM") {
      GM_setValue("chatGLM_token", null);
      GM_setValue("chatGLM_task_id", null);
    } else if (gptMode === "tianGong") {
      GM_setValue("tg_session_id", null);
      GM_setValue("tg_message_id", null);
    }
  }

  function setGlobalStyle() {
    try {
      GM_addStyle(GM_getResourceText("katexCss"));
      GM_addStyle(GM_getResourceText("toastCss"));
      hljs.configure({ignoreUnescapedHTML: true});
      toastr.options = {
        "positionClass": "toast-top-center", 
        "showDuration": "300",               
        "hideDuration": "300",               
        "timeOut": "3000",                   
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };
    } catch (e) {
      console.error("设置全局样式出现异常！", e);
    }
  }

  function isJSON(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  function formattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  function formatTime() {
    let padZero = (num) => {
      return num < 10 ? `0${num}` : num;
    }
    const now = new Date(); 
    const hours = now.getHours(); 
    const minutes = now.getMinutes(); 
    const seconds = now.getSeconds(); 
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }

  function generateRandomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function generateRandomIP() {
    const ip = [];
    for (let i = 0; i < 4; i++) {
      ip.push(Math.floor(Math.random() * 256));
    }
    console.log(ip.join('.'))
    return ip.join('.');
  }

  function decodeSpark(src) {
    const bytes = CryptoJS.enc.Base64.parse(src);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  function getGPTMode() {
    return GM_getValue("GPTMODE");
  }

  function isMobile() {
    let userAgentInfo = navigator.userAgent.toLowerCase();
    let mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "Mobile"];
    let mobile_flag = false;
    for (let v = 0; v < mobileAgents.length; v++) {
      if (userAgentInfo.indexOf(mobileAgents[v].toLowerCase()) > -1) {
        mobile_flag = true;
        break;
      }
    }
    return mobile_flag;
  }

  function toRawText(exp) {
    try {
      exp = exp.replace(/\&amp;/gi, "&").replace(/<br>/g, "\n").replace(/<br \/>/g, "\n")
      .replace(/\&gt;/g, ">").replace(/\&lt;/g, "<")
      exp = exp.replace(/\\begin\{bmatrix\}(.*?)\\end\{bmatrix\}/g, (_, tex) => {
        return `\\begin\{bmatrix\}${tex.replace(/\\/g, "\\\\")}\\end\{bmatrix\}`;
      })
      exp = exp.replace(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g, (_, tex) => {
        return `\\begin\{pmatrix\}${tex.replace(/\\/g, "\\\\")}\\end\{pmatrix\}`;
      })
    } catch (e) {
    }
    return exp;
  }

  function txtToHtml(rawHtml) {
    let katex_options = {displayMode: false, throwOnError: false}
    let renderedHtml = rawHtml;
    try {
      renderedHtml = rawHtml.replace(/<em>/g, "").replace(/<\/em>/g, "").replace(/\$\$(.*?)\$\$/g, (_, tex) => {
        return katex.renderToString(util.toRawText(tex), katex_options);
      });
      renderedHtml = renderedHtml.replace(/\$(.*?)\$/g, (_, tex) => {
        return katex.renderToString(util.toRawText(tex), katex_options);
      });
    } catch (ex) {
      console.error(ex)
    }
    return renderedHtml;
  }

  function addHeadCss() {
    let darkTheme = GM_getValue("darkTheme")

    if (!document.getElementById("github-markdown-link")) {
      if (darkTheme === "白") {
        $("head").append($(
            '<link id="github-markdown-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">'
        ));
      } else {
        $("head").append($(
            '<link id="github-markdown-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css">'
        ));
      }
    }
    if (!document.getElementById("highlight-link")) {
      if (darkTheme === "白") {
        $("head").append($(
            '<link id="highlight-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/atom-one-light.min.css">'
        ));
      } else {
        $("head").append($(
            '<link id="highlight-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/monokai-sublime.min.css">'
        ));
      }
    }
  }

  function showGptHistory(your_qus, gptAnswer) {
    let darkTheme = GM_getValue("darkTheme")
    let start = GM_getValue("your_qus_start");
    if (start === 'Y') {
      if (gptAnswer && document.getElementById('gptHistory').innerHTML !== '') {
        let answer = document.createElement('div');
        answer.innerHTML = gptAnswer;
        answer.style = darkTheme === "白" ? 'background-color: #caf0f8;' : 'background-color: #03045e;';
        document.getElementById('gptHistory').appendChild(answer);
      }
      let question = document.createElement('div');
      question.innerHTML = '😃：' + your_qus;
      question.style = darkTheme === "白" ? 'text-align:right; background-color: #90e0ef;' : 'text-align:right; background-color: #0077b6;';
      document.getElementById('gptHistory').appendChild(question);
      GM_setValue("your_qus_start", 'N');
    }
  }

  function highlightCodeStr() {
    let gptAnswerDiv = document.querySelector("#gptAnswer");
    if (gptAnswerDiv) {
      gptAnswerDiv.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  }

  function getCookieValue(cookies, cookieName) {
    let name = cookieName + "=";
    let cookieArray = cookies.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  }

  function addMessageChain(messageChain, element, maxLength) {
    maxLength = maxLength || 6;
    if (messageChain.length >= maxLength) {
      messageChain.shift();
    }
    messageChain.push(element);
    return messageChain;
  }

  function mdConverter(rawData) {
    const converter = new showdown.Converter({
      extensions: ['myext']
    });
    converter.setOption('tables', true);
    converter.setOption('openLinksInNewWindow', true);
    converter.setOption('strikethrough', true);
    converter.setOption('emoji', true);

    showdown.setFlavor('github');

    try {
      return converter.makeHtml(rawData); 
    } catch (ex) {
      console.error('Error when converting markdown to HTML: ', ex);
      return rawData;
    }
  }

  async function GM_fetch(details) {
    return new Promise((resolve, reject) => {
      switch (details.responseType) {
        case "stream":
          details.onloadstart = (res) => {
            resolve(res)
          }
          break;
        default:
          details.onload = (res) => {
            resolve(res)
          };
      }
      details.onerror = (res) => {
        reject(res)
      };
      details.ontimeout = (res) => {
        reject(res)
      };
      details.onabort = (res) => {
        reject(res)
      };
      GM_xmlhttpRequest(details)
    });
  }

  async function digestMessage(str) {
    const hash = CryptoJS.SHA256(str);
    return hash.toString(CryptoJS.enc.Hex);
  }

  async function generateSignatureWithPkey(key) {
    const {
      t: e,
      m: t,
      pkey: n
    } = key;
    console.log("当前公钥:" + n)
    const a = `${e}:${t}:${n}`;
    return await digestMessage(a);
  }

  async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return {
    initPubKey: () => initPubKey(),
    setPubkey: () => setPubkey(),
    setGlobalStyle: () => setGlobalStyle(),
    isJSON: (str) => isJSON(str),
    formattedDate: () => formattedDate(),
    formatTime: () => formatTime(),
    generateRandomString: (length) => generateRandomString(length),
    generateRandomIP: () => generateRandomIP(),
    decodeSpark: (src) => decodeSpark(src),
    getGPTMode: () => getGPTMode(),
    isMobile: () => isMobile(),
    toRawText: (exp) => toRawText(exp),
    txtToHtml: (rawHtml) => txtToHtml(rawHtml),
    addHeadCss: () => addHeadCss(),
    showGptHistory: (your_qus, gptAnswer) => showGptHistory(your_qus, gptAnswer),
    highlightCodeStr: () => highlightCodeStr(),
    getCookieValue: (cookies, cookieName) => getCookieValue(cookies, cookieName),
    addMessageChain: (messageChain, element, maxLength) => addMessageChain(messageChain, element, maxLength),
    mdConverter: (rawData) => mdConverter(rawData),
    GM_fetch: (details) => GM_fetch(details),
    digestMessage: (str) => digestMessage(str),
    generateSignatureWithPkey: (key) => generateSignatureWithPkey(key),
    delay: (ms) => delay(ms)
  }

})();

const extendMarkdown = () => {
  (function (extension) {
    if (typeof showdown !== 'undefined') {
      extension(showdown);
    }
    else if (typeof define === 'function' && define.amd) {
      define(['showdown'], extension);
    }
    else if (typeof exports === 'object') {
      module.exports = extension(require('showdown'));
    } else {
      throw Error('Could not find showdown library');
    }
  }(function (showdown) {
    showdown.extension('myext', function () {
      return [
        {
          type: 'output',  
          filter: function (source, converter, options) {
            return util.txtToHtml(source);
          }
        },
        {
          type: 'output',
          filter: function (source, converter, options) {
            return source.replace(/<script/gi, '&lt;script').replace(/<meta/gi, '&lt;meta');
          }
        },
        {
          type: 'output',
          filter: text => text.replace(
              /^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/mg,
              (str, name, rawContent, _, padding) => {
                const content = converter.makeHtml(rawContent.replace(new RegExp(`^${padding}`, 'gm'), ''))
                return `<div class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>:${content}</div>`
              }
          )
        },
        {
          type: 'lang',
          filter: text => text.replace(
              /^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/mg,
              (str, name, _, content) =>
                  `<small class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>: ${content}</small>`
          )
        },
        {
          type: 'lang',
          filter: text => text.replace(
              /\[\^([\d\w]+)\]/m,
              (str, name) => `<a href="#footnote-${name}"><sup>[${name}]</sup></a>`
          )
        },
        {
          type: 'lang',
          filter: text => text.replace(/\\n+/g, "\n")
        },
        {
          type: "lang",
          regex: "\\B(\\\\)?@glyphicon-([\\S]+)\\b",
          replace: function (a, b, c) {
            return b === "\\" ? a : '<span class="glyphicon glyphicon-' + c + '">' + "</span>"
          }
        },
        {
          type: "lang",
          regex: "\\B(\\\\)?@fa-([\\S]+)\\b",
          replace: function (a, b, c) {
            return b === "\\" ? a : '<i class="fa fa-' + c + '">' + "</i>"
          }
        }
      ];
    })
  }))
}

(function () {
  'use strict';


  util.initPubKey();
  util.setGlobalStyle();
  util.addHeadCss();

  extendMarkdown();



  let rawAns;
  let isShowRaw = false;
  let your_qus;
  let abortXml;
  let gptAnswer;

  function showAnswerAndHighlight(codeStr) {
    if (!codeStr) {
      return
    }
    codeStr = "" + codeStr;
    rawAns = codeStr;
    try {
      document.getElementById('gptAnswer').innerHTML = util.mdConverter(codeStr);
    } catch (ex) {
      console.error(ex)
    }
    util.highlightCodeStr()
    let preList = document.querySelectorAll("#gptAnswer pre")
    preList.forEach((pre) => {
      try {
        if (!pre.querySelector(".btn-pre-copy")) {
          let copyBtn = document.createElement("span");
          copyBtn.setAttribute("class", "btn-pre-copy");
          copyBtn.addEventListener("click", (event) => {
            let _this = event.target 
            let pre = _this.parentNode; 
            _this.innerText = ''; 
            GM_setClipboard(pre.innerText, "text"); 
            _this.innerText = '复制成功' 
            Toast.success("复制成功!") 
            setTimeout(() => {
              _this.innerText = '复制代码' 
            }, 2000)
          })
          copyBtn.innerText = '复制代码' 
          pre.insertBefore(copyBtn, pre.firstChild) 
        }
      } catch (e) {
        console.log(e)
      }
    })
    gptAnswer = document.getElementById('gptAnswer').innerHTML;
  }


  GM_add_box_style();
  keyEvent();
  creatBox().then(() => {
    pivElemAddEventAndValue()
  });


  function GM_add_box_style() {
    GM_addStyle(`
    #gptAnswer{
       margin: 10px;
       border-top: solid;
       border-bottom: solid;
    }
    #gptInput{
        border-radius: 20px;
        flex: 1;
        padding-left: 10px;
        height: 35px;
        border:0;
        background-color: transparent;
        font-size: 15px;
        font-weight: 500;
    }
    #button_GPT:hover{
        cursor: pointer;
    }
    /* 整体div容器 */
    #gptDiv{
        width:100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        height: fit-content;
    }
    #gptInputBox{
        display:flex;
        justify-content: space-around;
        border-radius: 20px;
        border: 1px solid #c4c7ce;
        margin-left: 10px;
    }
    #button_GPT{
        border: 0;
        background-color: transparent;
        font-size: 14px;
        padding: 5px;
    }
    #gptStatus{
        margin-left: 10px;
    }
    #modeSelect {
        border: 1px solid #c4c7ce;
        border-radius: 10px;
        margin: 3px;
        text-align: center;
        color: RGB(193,73,55);
        -webkit-appearance: none;
    }

    #modeSelect::-webkit-scrollbar {
      width: 8px; /* 滚动条宽度 */
    }

    #modeSelect::-webkit-scrollbar-thumb {
      background-color: #888; /* 滚动条颜色 */
      border-radius: 4px; /* 滚动条圆角 */
    }

    #modeSelect::-webkit-scrollbar-thumb:hover {
      background-color: #555; /* 滚动条悬停时颜色 */
    }

    #modeSelect::-webkit-scrollbar-track {
      background-color: #f1f1f1; /* 滚动条背景色 */
      border-radius: 4px; /* 滚动条背景圆角 */
    }

    .chatSetting{
        display: block;
        text-align: right;
        margin-top: 10px;
        margin-right: 8px;
        margin-bottom: 1px;
    }
    .chatHide{
         display: none;
    }

    #chatSetting{
       text-decoration: none !important;
    }
    #chatSetting:hover{
       cursor: pointer;
       text-decoration: underline !important;
    }

    #website a:nth-child(odd){
        color: #ffbb00;
    }

    #website a:nth-child(even){
        color: #0bbbac;
    }

    #website a {
        border: 1px solid;
        border-radius: 3px;
        margin-right: 9px;
        margin-bottom: 5px;
    }
    #website hr {
        border: none;
        border-top: 1px dashed #999;
        margin: 5px 0px 5px 0px;
    }

    gptDiv p{
        white-space: pre-line;
    }

    pre .btn-pre-copy{
        text-align: right;
        display: block;
    }

    pre .btn-pre-copy:hover{
        cursor: pointer;
    }

    .fullScreen{
        z-index: 999 !important;
        position: fixed  !important;
        top: 0  !important;
        left: 0  !important;
        right: 0  !important;
        width: 100%  !important;
        height: 100%  !important;
        bottom: 0  !important;
        overflow-y: scroll !important;
    }

    .bgtransparent{
        background-color: transparent !important;
    }

    .floating-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007bff;
      color: #fff;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
      z-index: 9999 !important;
    }

    .floating-button a {
      text-decoration: none;
      color: inherit;
      z-index: 9999 !important;
    }

    /* fix bilibili高级弹幕背景问题 */
    #bilibili-player pre {
      background-color: transparent !important;
       overflow-x: hidden; !important;
       overflow-y: hidden; !important;
    }
    
    .gpt-container {
        box-sizing: border-box;
        height: -webkit-min-content;
        height: min-content;
        width: 455px;
        margin-top: 8px;
        margin-bottom: 8px;
        border: 1px solid #dfe1e5;
        border-radius: 8px;
        overflow: hidden;
        padding: 15px;
        background-color:#fcfcfc
    }

    #dot{
        height: 4px;
        width: 4px;
        display: inline-block;
        border-radius: 2px;
        animation: dotting 2.4s  infinite step-start;
    }
    
    @keyframes dotting {
        25%{
            box-shadow: 4px 0 0 #71777D;
        }
        50%{
            box-shadow: 4px 0 0 #71777D ,14px 0 0 #71777D;
        }
        75%{
            box-shadow: 4px 0 0 #71777D ,14px 0 0 #71777D, 24px 0 0 #71777D;
        }
    }
    
    pre{
        overflow-x: scroll;
        overflow-y: hidden;
        background: #fffaec;
        border-radius: 4px;
        padding: 14px 3px;
    }
    
    pre::-webkit-scrollbar {

    }
    `)
  }

  function keyEvent() {
    document.onkeydown = function (e) {
      let keyNum = window.event ? e.keyCode : e.which;
      if (keyNum === 13) {
        let myInput = document.getElementById('gptInput');
        if (myInput === document.activeElement) {
          document.getElementById('button_GPT').click()
        } else {
          console.log("失焦不执行")
        }
      }
    }
  }

  function do_it() {
    isShowRaw = false;
    rawAns = undefined;

    document.getElementById('gptAnswer').innerHTML = `<div>加载中<span id="dot"></span></div>`;

    const SEARCH_MODES = {
      ANSEAPP: ANSEAPP,  
      CLEANDX: CLEANDX,  
      hunYuan: hunYuan,  
      MixerBox: MixerBox,  
      miniMax: miniMax, 
      SPARK: SPARK,  
      tianGong: tianGong, 
      tongYi: tongYi,  
      TOYAML: TOYAML,  
      yiYan: yiYan,  
      YQCLOUD: YQCLOUD,  
      zhiNao360: zhiNao360, 
      chatGLM: chatGLM,  
      zhiPuAi: zhiPuAi 
    };

    let GPTMode = util.getGPTMode();
    console.log("当前模式：" + GPTMode);

    const modeFunction = SEARCH_MODES[GPTMode] || YQCLOUD;
    modeFunction();
  }

  function createSidebarPage(div) {
    const floatBall = document.createElement('div');
    floatBall.id = "myFloatBall";
    floatBall.textContent = '🌏';
    floatBall.style.cssText = `
        position: fixed;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        background-color: #f90;
        color: white;
        padding: 8px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 9999;
    `;
    document.body.appendChild(floatBall);

    const sideBar = document.createElement('div');
    sideBar.id = "mySideBar";
    sideBar.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 0;
        height: 100%;
        background-color: white;
        box-shadow: -1px 0 10px rgba(0, 0, 0, 0.5);
        overflow-y: auto; /* 修改这一行来显示垂直滚动条 */
        transition: width 0.5s;
        z-index: 9998;
    `;
    document.body.appendChild(sideBar);
    sideBar.appendChild(div);

    const closeButton = document.createElement('div');
    closeButton.textContent = '➡️';
    closeButton.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        background-color: #f90;
        color: white;
        padding: 8px;
        cursor: pointer;
    `;
    sideBar.appendChild(closeButton);

    floatBall.addEventListener('click', function () {
      sideBar.style.width = '33.3%';
      floatBall.style.display = 'none';
    });

    closeButton.addEventListener('click', function () {
      sideBar.style.width = '0';
      floatBall.style.display = 'block';
    });
  }

  function creatBox() {
    return new Promise((resolve) => {
      let divE = document.createElement('div');
      divE.id = 'gptDiv';
      let pE = document.createElement('p');
      pE.className = 'textClass';
      divE.appendChild(pE);
      divE.classList.add("gpt-container");
      divE.classList.add("markdown-body");
      divE.innerHTML = `
    <div id="gptInputBox">
        <input autocomplete="off" placeholder="若用不了,请更新KEY或切换线路" id="gptInput" list="suggestions" type=text><button id="button_GPT" >🔍️ 搜索</button>
        <datalist id="suggestions"></datalist>
    </div>
    <div class="chatSetting"><a id="chatSetting">⚙ 设置</a></div>
    <div id=gptCueBox>
      <p class="chatHide" id="gptStatus">
         <select id="modeSelect">        
            <option value="Default">默认线路[兼容]</option>
            <option value="ANSEAPP">ANSEAPP</option>
            <option value="CLEANDX">CLEANDX-需翻墙</option>
            <option value="hunYuan">腾讯混元-需登录</option>
            <option value="MixerBox">MixerBox-需翻墙</option>
            <option value="miniMax">miniMax-需登录</option>
            <option value="SPARK">讯飞星火-需登录</option>
            <option value="tianGong">天工AI-需登录</option>
            <option value="tongYi">通义千问-需登录</option>
            <option value="TOYAML">TOYAML</option>
            <option value="yiYan">文心一言-需登录</option>
            <option value="YQCLOUD">YQCLOUD</option>
            <option value="zhiNao360">360智脑-需登录</option>
            <option value="chatGLM">智谱清言-需登录</option>
            <option value="zhiPuAi">智谱AI-需登录</option>
      <!--      <option value="GPTPLUS">GPTPLUS-不能用</option>-->
      <!--      <option value="PRTBOOM">PRTBOOM-需翻墙-太慢了</option>-->
      <!--      <option value="BNU120">BNU120-不能用</option>-->
      <!--      <option value="YeYu">自定义key-需翻墙-不可用</option>-->
      <!--      <option value="newBing">New Bing-试试</option>-->
      <!--      <option value="OPENAI-3.5">OPENAI-3.5-需翻墙-需登录</option>-->
      <!--      <option value="OPENAI-4.0">OPENAI-4.0-需翻墙-需登录</option>-->
      <!--      <option value="AIFREE">AIFREE-流量异常-不可用</option>-->
      <!--      <option value="ChatGO">ChatGO-地址有问题</option>-->
      <!--      <option value="ANZZ">ANZZ-需翻墙-有问题</option>-->
      <!--      <option  value="THEBAI">THEBAI-需翻墙-有问题</option>-->
      <!--      <option value="YUXIN">YUXIN-网址有问题</option>-->
      <!--      <option value="PIZZA">PIZZA[兼容]-需翻墙-有问题</option>-->
      <!--      <option value="AITIANHU">AITIANHU-网站不稳定</option>-->
      <!--      <option value="TDCHAT">TDCHAT-网站不稳定</option>-->
      <!--      <option value="GEEKR">GEEKR-不能用-有问题</option>-->
      <!--      <option value="OhMyGPT">OhMyGPT-需翻墙-有问题</option>-->
      <!--      <option value="AILS">AILS-要钱</option>-->
      <!--      <option value="PHIND">PHIND-有问题</option>-->
      <!--      <option value="WOBCW">WOBCW-废了</option>-->
      <!--      <option value="CVEOY">CVEOY-网站不稳定</option>-->
          </select>部分线路需要科学上网</p>
      <p class="chatHide" id="warn" style="margin: 10px"><a id="updatePubkey" style="color: #ff0000;" href="javascript:void(0)">♻ 更新KEY</a>:用于需登录和需要api令牌的</p>
<!--      <p class="chatHide" id="autoClickP" style="margin: 10px"><a id="autoClick" style="color: #ff0000;" href="javascript:void(0)">🖱 自动点击开关</a>:用于设置搜索是否自动点击</p>-->
      <p class="chatHide" id="darkThemeP" style="margin: 10px"><a id="darkTheme" style="color: #ff0000;" href="javascript:void(0)">☀ 暗黑模式开关</a>:用于设置暗黑/白天</p>
      <p class="chatHide" id="autoTipsP" style="margin: 10px"><a id="autoTips" style="color: #ff0000;"  href="javascript:void(0)">🔔 自动提示开关</a>:用于设置搜索框自动提示</p>
      <!-- 历史记录区 -->
      <article id="gptHistory" class="markdown-body"></article>
      <!-- 答案展示区 -->
      <article id="gptAnswer" class="markdown-body"></article>
    </div>
    <span class="speak" style="margin-right: 10px;text-align: right">
      <a id="shrinkAnswer" style="cursor: pointer" href="javascript:void(0)" >➡ 收缩</a>
      <a id="cleanAnswer" style="cursor: pointer" href="javascript:void(0)" >🧹 清除</a>
      <a id="speakAnswer" style="cursor: pointer" href="javascript:void(0)" >🔊 朗读</a>
      <a id="copyAns" style="cursor: pointer" href="javascript:void(0)" >📑 复制</a>
      <a id="rawAns" style="cursor: pointer" href="javascript:void(0)" >📖 原文</a>
      <a id="stopAns" style="cursor: pointer" href="javascript:void(0)">🚫 中断</a>
      <a id="fullScreen" style="cursor: pointer" href="javascript:void(0)">↔ 全屏</a>
      <a id="hideGptDiv" style="cursor: pointer" href="javascript:void(0)">↘ 隐藏</a>
    </span>`;
      resolve(createSidebarPage(divE))
    })
  }

  let history_disable = false;
  let speakAudio;
  let isPlayend = true;

  async function pivElemAddEventAndValue() {
    document.getElementById("gptInput").value = '';

    document.getElementById('button_GPT').addEventListener('click', () => {
      your_qus = document.getElementById("gptInput").value
      if (your_qus.startsWith("/font-size:")) {
        let fontSize = your_qus.substring("/font-size:".length)
        document.querySelector("#gptDiv").style.fontSize = fontSize;
        GM_setValue("gpt_font_size", fontSize)
        Toast.success(`字体设置成功:${fontSize}`)
        return
      }
      if (your_qus.startsWith("/history_disable:")) {
        let dis = your_qus.substring("/history_disable:".length)
        history_disable = (dis === 'true');
        GM_setValue("history_disable", dis)
        Toast.success(`禁用历史记录设置成功:${history_disable}`)
        return
      }
      GM_setValue("your_qus_start", "Y");
      util.showGptHistory(your_qus, gptAnswer);
      do_it()
    })

    document.getElementById('gptInput').addEventListener('keyup', () => {
      if (GM_getValue("autoTips") !== 'on') {
        return
      }
      let current;
      let word = document.getElementById('gptInput').value;
      if (!word) {
        return;
      }
      if (current) {
        current.abort();
      }
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.baidu.com/sugrec?&prod=pc&wd=" + encodeURIComponent(word),
        responseType: "text",
        onload: (r) => {
          if (r.status === 200) {
            let dataList = JSON.parse(r.responseText).g;
            const su = document.querySelector('#suggestions');
            su.innerHTML = '';
            dataList && dataList.forEach(v => {
              const optionElement = document.createElement('option');
              optionElement.value = v.q;
              optionElement.innerText = v.q;
              su.appendChild(optionElement);
            });
          }
        }
      });
    })

    let chatSetting = false;
    document.getElementById('chatSetting').addEventListener('click', () => {
      if (!chatSetting) {
        try {
          document.querySelector("#gptStatus").classList.remove("chatHide")
          document.querySelector("#warn").classList.remove("chatHide")
          document.querySelector("#darkThemeP").classList.remove("chatHide")
          document.querySelector("#autoTipsP").classList.remove("chatHide")
          document.querySelector("#website").classList.remove("chatHide") 
        } catch (e) {
          console.log(e)
        }
        chatSetting = true;
      } else {
        try {
          document.querySelector("#gptStatus").classList.add("chatHide")
          document.querySelector("#warn").classList.add("chatHide")
          document.querySelector("#darkThemeP").classList.add("chatHide")
          document.querySelector("#autoTipsP").classList.add("chatHide")
          document.querySelector("#website").classList.add("chatHide") 
        } catch (e) {
          console.log(e)
        }
        chatSetting = false;
      }
    })

    document.getElementById('modeSelect').addEventListener('change', function () {
      GM_setValue('GPTMODE', this.value);
      Toast.success(`切换成功，当前线路:${this.value}`)
    });

    document.getElementById('updatePubkey').addEventListener('click', () => {
      Toast.info("正在更新，请稍后...")
      util.setPubkey()
    })


    document.getElementById('darkTheme').addEventListener('click', () => {
      try {
        document.getElementById("github-markdown-link").remove()
        document.getElementById("highlight-link").remove()
      } catch (e) {
        console.error(e)
      }
      let darkTheme = GM_getValue("darkTheme");
      if (darkTheme === "白") {
        GM_setValue("darkTheme", "黑")
        Toast.success("暗黑模式已经开启")
      } else {
        GM_setValue("darkTheme", "白")
        Toast.success("白天模式已经开启")
      }
      util.addHeadCss();
    })

    document.getElementById('autoTips').addEventListener('click', () => {
      if (GM_getValue("autoTips") === 'on') {
        GM_setValue("autoTips", "off")
        Toast.error("自动提示已关")
      } else {
        GM_setValue("autoTips", "on")
        Toast.success("自动提示已开启")
      }
    })

    let isFullScreen = false;

    document.getElementById('shrinkAnswer').addEventListener('click', () => {
      if (isFullScreen) {
        document.getElementById("gptDiv").classList.remove("fullScreen")
        isFullScreen = false;
      }
      document.getElementById('mySideBar').style.width = '0';
      document.getElementById('myFloatBall').style.display = 'block';
    })

    document.getElementById('cleanAnswer').addEventListener('click', () => {
      document.getElementById('gptHistory').innerHTML = '';
      document.getElementById('gptAnswer').innerHTML = '';
      your_qus = '';
      gptAnswer = '';
    })

    document.getElementById('speakAnswer').addEventListener('click', () => {
      let ans = document.querySelector("#gptAnswer");
      if (!isPlayend) {
        Toast.success('已暂停播放!');
        speakAudio.pause();
        isPlayend = true;
        return;
      } else {
        Toast.warn('音频已停止,正在重新播放！')
      }
      if (ans) {
        let speakText = ans.innerText;

        const result = confirm("是否启用外国口音朗读? 默认为中文口音。");
        let dialect = "zh-CHS"
        if (result) {
          dialect = "en"
          console.log("英文朗读！");
        }

        let f = JSON.stringify({
          curTime: Date.now(),
          rate: "1",
          spokenDialect: dialect,
          text: speakText
        })

        let sParam = CryptoJS.AES.encrypt(f.replace(/^"|"$/g, ""), CryptoJS.enc.Utf8.parse("76350b1840ff9832eb6244ac6d444366"), {
          "iv": CryptoJS.enc.Utf8.parse(atob("AAAAAAAAAAAAAAAAAAAAAA==") || "76350b1840ff9832eb6244ac6d444366"),
          "mode": CryptoJS.mode.CBC,
          "pad": CryptoJS.pad.Pkcs7
        }).toString();

        speakAudio = new Audio(`https://fanyi.sogou.com/openapi/external/getWebTTS?S-AppId=102356845&S-Param=${encodeURIComponent(sParam)}`);
        speakAudio.play()
        isPlayend = false;
        speakAudio.addEventListener("ended", function () {
          isPlayend = true;
          Toast.success('音频已播放完毕！');
        })
      }
    })

    document.getElementById('rawAns').addEventListener('click', (ev) => {
      let ans = document.querySelector("#gptAnswer");
      if (!rawAns) {
        Toast.error("原文无内容")
        return
      }
      if (!isShowRaw) {
        ans.innerText = rawAns;
        isShowRaw = true;
        Toast.success("已为你显示原文")
      } else {
        showAnswerAndHighlight(rawAns)
        isShowRaw = false;
        Toast.success("已为你显示非原文")
      }
    })

    document.getElementById('stopAns').addEventListener('click', (ev) => {
      try {
        if (abortXml) {
          abortXml.abort();
          abortXml = undefined;
        } else {
          Toast.error("无法中断!")
        }
      } catch (ex) {
        console.error("中断失败：", ex)
        Toast.error("中断失败!")
      }
    })

    document.getElementById('fullScreen').addEventListener('click', (ev) => {
      try {
        if (!isFullScreen) {
          document.getElementById("gptDiv").classList.add("fullScreen")
          isFullScreen = true;
        } else {
          document.getElementById("gptDiv").classList.remove("fullScreen")
          isFullScreen = false;
        }
      } catch (ex) {
        console.error("ex：", ex)
        Toast.error("未知异常!")
      }
    })

    document.getElementById('hideGptDiv').addEventListener('click', (ev) => {
      try {
        $("body").append(`<div class="floating-button"><a href="javascript:void(0)">显示</a></div>`)
        $(".floating-button a").click(function () {
          $("#gptDiv").show();
          $(".floating-button").remove()
        });
        $("#gptDiv").hide();
      } catch (ex) {
        console.error("ex：", ex)
        Toast.error("未知异常!")
      }
    })

    document.getElementById('copyAns').addEventListener('click', (ev) => {
      let ans = document.querySelector("#gptAnswer");
      if (isShowRaw) {
        GM_setClipboard(rawAns, "text");
      } else {
        let cps = document.querySelectorAll(".btn-pre-copy");
        for (let cp of cps) {
          cp.innerText = ''
        }
        GM_setClipboard(ans.innerText, "text");
        for (let cp of cps) {
          cp.innerText = '复制代码'
        }
      }
      Toast.success("复制成功!")
    })

  }


  let userId_yqcloud = "#/chat/" + Date.now();

  function YQCLOUD() {
    console.log(userId_yqcloud)
    abortXml = GM_xmlhttpRequest({
      method: "POST",
      url: "https://api.aichatos.cloud/api/generateStream",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://chat6.aichatos.com/",
        "origin": "https://chat6.aichatos.com",
        "accept": "application/json, text/plain, */*"
      },
      data: JSON.stringify({
        prompt: your_qus,
        apikey: "",
        system: "",
        withoutContext: false,
        userId: userId_yqcloud,
        network: true
      }),
      onloadstart: (stream) => {
        let result = [];
        const reader = stream.response.getReader();
        reader.read().then(function processText({done, value}) {
          if (done) {
            let finalResult = result.join("")
            showAnswerAndHighlight(finalResult)
            return;
          }
          let d = new TextDecoder("utf8").decode(new Uint8Array(value));
          result.push(d)
          try {
            console.log(result.join(""))
            showAnswerAndHighlight(result.join(""))
          } catch (e) {
            console.log(e)
          }
          return reader.read().then(processText);
        });
      },
      responseType: "stream",
      onerror: function (err) {
        console.log(err)
        Toast.error("未知错误!")
      }
    })
  }




  async function tongYi() {
    let tongYi_sessionId = GM_getValue("tongYi_sessionId");
    if (!tongYi_sessionId) {
      showAnswerAndHighlight("会话id为空，请先登录[通义千问](https://qianwen.aliyun.com/chat)，再尝试请求。")
    }
    console.log('通义千问会话id：', tongYi_sessionId);
    let sendData = JSON.stringify({
      "action": "next",
      "msgId": util.generateRandomString(32),  
      "parentMsgId": "0",
      "contents": [
        {
          "contentType": "text",
          "content": your_qus
        }
      ],
      "timeout": 17,
      "openSearch": false,
      "sessionId": tongYi_sessionId,
      "model": ""
    })
    util.GM_fetch({
      method: 'POST',
      url: 'https://qianwen.aliyun.com/conversation',
      headers: {
        "origin": "https://qianwen.aliyun.com/",
        "referer": "https://qianwen.aliyun.com/chat",
        "Content-Type": "application/json",
        "accept": "text/event-stream",
        "x-platform": "pc_tongyi",
        "x-xsrf-token": null
      },
      responseType: "stream",
      data: sendData
    }).then((stream) => {
      let reader = stream.response.getReader()
      reader.read().then(function processText({done, value}) {
        if (done) {
          return
        }
        let responseItem = new TextDecoder("utf-8").decode(value)
        console.info(responseItem)
        responseItem.split("\n").forEach(item => {
          try {
            let response = JSON.parse(item.replace(/data: /gi, "").trim());
            if (!tongYi_sessionId) {
              GM_setValue("tongYi_sessionId", response.sessionId);
            }
            let content = JSON.parse(item.replace(/data: /gi, "").trim()).content[0];
            showAnswerAndHighlight(content)
          } catch (ex) {
          }
        })
        return reader.read().then(processText)
      }, function (reason) {
        console.error(reason)
        Toast.error("未知错误!" + reason)
      }).catch((ex) => {
        console.error(ex)
        Toast.error("未知错误!" + ex)
      })
    })
  }




  async function init_sp_chatId() {
    if (util.getGPTMode() !== "SPARK" || GM_getValue("sp_chatId")) {
      return;
    }
    const response = await util.GM_fetch({
      method: "POST",
      url: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/create-chat-list",
      headers: {
        "accept": "application/json, text/plain, */*",
        "x-requested-with": "XMLHttpRequest",
        "origin": "https://xinghuo.xfyun.cn",
        "Content-Type": "application/json",
        "referer": "https://xinghuo.xfyun.cn/desk"
      },
      data: "{}" 
    })
    try {
      let sp_fd = String(+new Date()).slice(-6);
      let sp_chatId = JSON.parse(response.responseText).data.id;
      GM_setValue("sp_fd", sp_fd);
      GM_setValue("sp_chatId", sp_chatId);
      Toast.success("已获取讯飞星火会话id：+" + sp_chatId);
    } catch (error) {
      console.error(error)
      Toast.error("讯飞星火会话id获取失败")
    }
  }

  setTimeout(init_sp_chatId, 500)

  async function SPARK() {
    let sp_chatId = GM_getValue("sp_chatId");
    if (!sp_chatId) {
      showAnswerAndHighlight("会话id为空，请先登录[讯飞星火](https://xinghuo.xfyun.cn/)，再尝试请求。")
      return;
    }
    let sp_GtToken = GM_getValue("sp_GtToken");
    let sp_fd = GM_getValue("sp_fd");
    console.log('星火会话id：' + sp_chatId);
    console.log('星火唯一标识：' + sp_fd);
    console.log('星火会话Token：' + sp_GtToken);
    let sendData = `------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"fd\"\r\n\r\n${sp_fd}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"clientType\"\r\n\r\n2\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"chatId\"\r\n\r\n${sp_chatId}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\n${your_qus}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"GtToken\"\r\n\r\n${sp_GtToken}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk--\r\n`;
    console.log("sendData:" + sendData)
    try {
      const stream = await util.GM_fetch({
        method: 'POST',
        url: 'https://xinghuo.xfyun.cn/iflygpt-chat/u/chat_message/chat',
        headers: {
          "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryAS7tSr3osJng5Nxk",
          "accept": "text/event-stream",
          "x-requested-with": "XMLHttpRequest",
          "origin": "https://xinghuo.xfyun.cn",
          "referer": "https://xinghuo.xfyun.cn/desk"
        },
        responseType: "stream",
        data: sendData
      });
      const reader = stream.response.getReader();
      let ans = [];
      let decoder = new TextDecoder("utf-8");
      while (true) {
        const {done, value} = await reader.read();
        if (done) {
          return;
        }
        let responseItem = decoder.decode(value);
        console.log(responseItem);
        responseItem.split("\n").forEach(item => {
          try {
            if (item.startsWith('data:<end>')) {
              return;
            }
            let regex = /@(.*)<sid>$/;
            if (item.endsWith('<sid>')) {
              let match = item.match(regex);
              if (match && match[1]) {
                GM_setValue("sp_GtToken", match[1]);
                return;
              }
            }
            let cleanItem = item.replace(/data:/gi, "").trim();
            if (cleanItem) {
              let chunk = util.decodeSpark(cleanItem);
              ans.push(chunk);
              showAnswerAndHighlight(ans.join(""));
            }
          } catch (ex) {
            console.error("解析数据异常:", item, ex);
          }
        });
      }
    } catch (ex) {
      console.error("请求过程中出现异常:", ex);
      Toast.error("未知错误!");
    }
  }



  let tianGong_count = 0;

  async function init_tianGong_token() {
    if (/\.tiangong.cn/.test(location.host)) {
      let tg_token = localStorage.getItem("aiChatResearchToken");
      let tg_invite_Token = localStorage.getItem("aiChatQueueWaitToken")
      if (tg_token && tg_invite_Token) {
        Toast.info('天工token获取成功');
        GM_setValue("tg_token", tg_token)
        GM_setValue("tg_invite_Token", tg_invite_Token)
      } else if (tianGong_count < 3) {
        tianGong_count++;
        setTimeout(init_tianGong_token, 5000)
      } else {
        Toast.info(`天工token获取失败，请尝试刷新页面！`);
      }
    }
  }

  setTimeout(init_tianGong_token);

  async function get_tg_session_id(tg_token, tg_invite_Token) {
    let req1 = await util.GM_fetch({
      method: "POST",
      url: "https://neice.tiangong.cn/api/v1/session/newSession",
      headers: {
        "accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "device": "Web",
        "origin": "https://neice.tiangong.cn",
        "referer": "https://neice.tiangong.cn/interlocutionPage",
        "token": `Bearer ${tg_token}`,
        "invite-token": `Bearer ${tg_invite_Token}`
      },
      data: JSON.stringify({
        "data": {
          "content": your_qus
        }
      })
    })
    try {
      let rj = JSON.parse(req1.responseText);
      if (rj.code_msg.includes("请重新排队")) {
        return null;
      }
      let tg_session_id = rj.resp_data.session_id
      GM_setValue("tg_session_id", tg_session_id);
      let tg_message_id = rj.resp_data.dialogue[rj.resp_data.dialogue.length - 1].message_id
      GM_setValue("tg_message_id", tg_message_id);
      return tg_session_id;
    } catch (e) {
      console.error("获取tg_session_id失败！", e)
      return null;
    }
  }

  async function get_tg_message_id(tg_token, tg_invite_Token, tg_session_id) {
    let req1 = await util.GM_fetch({
      method: "POST",
      url: "https://neice.tiangong.cn/api/v1/chat/chat",
      headers: {
        "accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "device": "Web",
        "origin": "https://neice.tiangong.cn",
        "referer": "https://neice.tiangong.cn/interlocutionPage",
        "token": `Bearer ${tg_token}`,
        "invite-token": `Bearer ${tg_invite_Token}`
      },
      data: JSON.stringify({
        "data": {
          "content": your_qus,
          "session_id": tg_session_id
        }
      })
    })
    try {
      return JSON.parse(req1.responseText).resp_data.result_message.message_id;
    } catch (e) {
      console.error("获取tg_message_id失败！", e)
      return null;
    }
  }

  async function tianGong() {
    let tg_token = GM_getValue("tg_token");
    let tg_invite_Token = GM_getValue("tg_invite_Token");
    if (!tg_invite_Token || !tg_token) {
      showAnswerAndHighlight("token为空，请先登录[天工AI](https://neice.tiangong.cn/interlocutionPage)，再尝试请求。")
      return;
    }
    let tg_message_id;
    let tg_session_id = GM_getValue("tg_session_id");
    if (!tg_session_id) {
      tg_session_id = await get_tg_session_id(tg_token, tg_invite_Token);
      console.log("[天工AI]tg_session_id:", tg_session_id);
      if (!tg_session_id) {
        showAnswerAndHighlight("[天工AI]token为空已失效，请先登录[天工AI](https://neice.tiangong.cn/interlocutionPage)，再尝试请求。")
        return;
      }
      tg_message_id = GM_getValue("tg_message_id");
    } else {
      tg_message_id = await get_tg_message_id(tg_token, tg_invite_Token, tg_session_id);
      console.log("[天工AI]tg_message_id:", tg_message_id);
      if (!tg_message_id) {
        showAnswerAndHighlight("[天工AI]tg_message_id获取失败，请尝试点击[更新key]或者更换其他线路。")
        return;
      }
    }
    for (let i = 0; i < 120; i++) {
      let req2 = await util.GM_fetch({
        method: "POST",
        timeout: 3000,
        url: "https://neice.tiangong.cn/api/v1/chat/getMessage",
        headers: {
          "accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "device": "Web",
          "origin": "https://neice.tiangong.cn",
          "referer": "https://neice.tiangong.cn/interlocutionPage",
          "token": `Bearer ${tg_token}`,
          "invite-token": `Bearer ${tg_invite_Token}`
        },
        data: JSON.stringify({
          "data": {
            "message_id": tg_message_id
          }
        })
      })
      let rr = req2.responseText;
      console.log(rr)
      let rj = JSON.parse(rr);
      try {
        if (rj.resp_data.result_message.content) {
          showAnswerAndHighlight(rj.resp_data.result_message.content)
        }
        if (rj.resp_data.result_message.status === 3) {
          break;
        }
      } catch (e) {
      }
      await util.delay(1000)
    }
  }




  async function yiYan() {
    let YiYan_sessionId = GM_getValue("YiYan_sessionId");
    if (!YiYan_sessionId || YiYan_sessionId === 'null') {
      YiYan_sessionId = null;
      showAnswerAndHighlight("请稍后...该线路为官网线路，使用该线路，请确保已经登百度账号，再尝试请求。[百度](https://www.baidu.com/)")
    }
    console.log("YiYan_sessionId:", YiYan_sessionId)
    util.GM_fetch({
      method: 'POST',
      url: 'https://chat-ws.baidu.com/aichat/api/conversation',
      headers: {
        "origin": "https://www.baidu.com",
        "referer": "https://www.baidu.com/",
        "Content-Type": "application/json",
        "accept": "text/event-stream"
      },
      responseType: "stream",
      data: JSON.stringify({
        "message": {
          "inputMethod": "keyboard",
          "isRebuild": false,
          "content": {
            "query": your_qus,
            "qtype": 0
          }
        },
        "sessionId": YiYan_sessionId
      })
    }).then((stream) => {
      let reader = stream.response.getReader()
      let ans = []
      let preResponseItem = '';
      let combineItem = []; 
      let referenceList; 
      reader.read().then(function processText({done, value}) {
        if (done) {
          console.log("===done==")
          let result = ans.join("");
          let arr = result.match(/\^(.*?)\^/g);
          let oldArr = arr?.slice();
          if (!oldArr) {
            return;
          }
          if (referenceList && referenceList.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < referenceList.length; j++) {
                if (arr[i].includes(`[${j + 1}]`)) {
                  let url = referenceList[j].url;
                  arr[i] = arr[i].replace(`[${j + 1}]`, `[${j + 1}](${url})`)
                }
              }
            }
          }
          console.log("arr:", arr)
          console.log("oldArr:", oldArr)
          for (let i = 0; i < oldArr.length; i++) {
            result = result.replace(oldArr[i], arr[i].replace(/\^/g, ""))
          }
          showAnswerAndHighlight(result)
          return
        }
        let responseItem = new TextDecoder("utf-8").decode(value)
        console.log(responseItem)
        if (!responseItem.includes("event:ping") && !responseItem.startsWith("event:messag")) {
          combineItem.push(preResponseItem)
          combineItem.push(responseItem)
          preResponseItem = '';
          responseItem = combineItem.join("")
          console.log("combineItem:", responseItem)
          combineItem = [];
        } else if (!responseItem.includes("event:ping")) {
          preResponseItem = responseItem;
        }

        responseItem.split("\n").forEach(item => {
          try {
            if (item.startsWith('event:')) {
              return;
            }
            let ii = item.replace(/data:/gi, "").trim();
            if (ii && ii !== "") {
              if (!YiYan_sessionId) {
                GM_setValue("YiYan_sessionId", JSON.parse(ii).sessionId);
              }
              let parsed = JSON.parse(ii);
              if (parsed && parsed.data && parsed.data.message && parsed.data.message.content && parsed.data.message.content.generator) {
                if (parsed.data.message.content.generator.text) {
                  ans.push(parsed.data.message.content.generator.text);
                }
                if (parsed.data.message.content.generator.referenceList) {
                  referenceList = JSON.parse(ii).data.message.content.generator.referenceList
                }
              } else {
                return;
              }
              showAnswerAndHighlight(ans.join(""))
            }
          } catch (ex) {
            console.error("解析数据出现异常：" + ex)
          }
        })
        return reader.read().then(processText)
      }, function (reason) {
        console.log("响应出现异常：" + reason)
      }).catch((ex) => {
        console.log("程序执行出现异常：" + ex)
      })
    })
  }



  let hunYuan_count = 0;

  async function initHunYuanId() {
    if (location.href.includes("hunyuan.tencent.com")) {
      let hunYuan_tUserId = util.getCookieValue(document.cookie, "hy_user");
      if (hunYuan_tUserId) {
        Toast.info(`混元用户id获取成功:${hunYuan_tUserId}`);
        GM_setValue("hunYuan_tUserId", hunYuan_tUserId);
      } else {
        setTimeout(initHunYuanId, 5000)
        if (hunYuan_count < 3) {
          Toast.info(`混元用户id获取失败，请再次刷新!`);
        }
        hunYuan_count++;
      }
    }
  }

  setTimeout(initHunYuanId);

  let hunYuan_chatId;

  async function hunYuan() {
    let hunYuan_tUserId = GM_getValue("hunYuan_tUserId");
    if (!hunYuan_tUserId) {
      showAnswerAndHighlight("用户id为空，请先登录[混元官网](https://hunyuan.tencent.com/bot/chat)获取，再尝试请求")
      return;
    }
    console.log("hunYuan_tUserId:", hunYuan_tUserId);
    if (!hunYuan_chatId) {
      let req1 = await util.GM_fetch({
        method: "POST",
        url: `https://hunyuan.tencent.com/api/generate/id`,
        headers: {
          "accept": "application/json, text/plain, */*",
          "origin": "https://hunyuan.tencent.com",
          "referer": `https://hunyuan.tencent.com/bot/chat`,
          "t-userid": GM_getValue("hunYuan_tUserId"),
          "x-requested-with": "XMLHttpRequest",
          "x-source": "web"
        },
        data: null
      });
      hunYuan_chatId = req1.responseText;
    }
    util.GM_fetch({
      method: 'POST', 
      url: `https://hunyuan.tencent.com/api/chat/${hunYuan_chatId}`, 
      headers: {
        "origin": "https://hunyuan.tencent.com", 
        "referer": `https://hunyuan.tencent.com/bot/chat`, 
        "chat_version": "v1", 
        "content-type": "text/plain;charset=UTF-8", 
        "accept": "*/*",
        "t-userid": hunYuan_tUserId, 
        "x-requested-with": "XMLHttpRequest",
        "x-source": "web" 
      },
      responseType: "stream", 
      data: JSON.stringify({ 
        "model": "gpt_175B_0404",
        "prompt": your_qus,
        "displayPrompt": your_qus,
        "displayPromptType": 1,
        "plugin": "Adaptive",
        "isSkipHistory": false
      })
    }).then((stream) => {
      let reader = stream.response.getReader() 
      let ans = [] 
      reader.read().then(function processText({done, value}) {
        if (done) {
          let result = ans.join("");
          showAnswerAndHighlight(result)
          return
        }
        let responseItem = new TextDecoder("utf-8").decode(value)
        console.log(responseItem);
        responseItem.split("\n").forEach(item => {
          try {
            let ii = item.replace(/data:/gi, "").trim();
            if (ii && ii !== "") {
              let chunk = JSON.parse(ii).msg
              ans.push(chunk)
              showAnswerAndHighlight(ans.join(""))
            }
          } catch (ex) {
            console.error(item)
          }
        })
        return reader.read().then(processText)
      }, function (reason) {
        Toast.error("未知错误!")
        console.log(reason)
      }).catch((ex) => {
        Toast.error("未知错误!")
        console.log(ex)
      })
    })
  }


  let chatGLM_count = 0;

  async function init_chatGLM_token() {
    if (location.href.includes("chatglm.cn")) {
      let chatGLM_token = util.getCookieValue(document.cookie, "chatglm_token")
      if (chatGLM_token) {
        Toast.info(`智谱清言token获取成功`);
        GM_setValue("chatGLM_token", chatGLM_token);
      } else if (chatGLM_count < 3) {
        chatGLM_count++;
        setTimeout(init_chatGLM_token, 5000)
      } else {
        Toast.info(`智谱清言token获取失败，请尝试刷新页面！`);
      }
    }
  }

  setTimeout(init_chatGLM_token);

  async function get_chatGLM_task_id(chatGLM_token) {
    let chatGLM_task_id = GM_getValue("chatGLM_task_id");
    if (chatGLM_task_id) {
      return chatGLM_task_id;
    }
    let req1 = await util.GM_fetch({
      method: "POST",
      url: `https://chatglm.cn/chatglm/backend-api/v1/conversation`,
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json;charset=UTF-8",
        "origin": "https://chatglm.cn",
        "referer": `https://chatglm.cn/detail`,
        "authorization": `Bearer ${chatGLM_token}`
      },
      data: JSON.stringify({
        "prompt": your_qus
      })
    })
    try {
      chatGLM_task_id = JSON.parse(req1.responseText).result.task_id;
      GM_setValue("chatGLM_task_id", chatGLM_task_id);
      return chatGLM_task_id;
    } catch (e) {
      console.error("获取chatGLM_task_id失败！", e)
      return null;
    }
  }

  async function get_chatGLM_context_id(chatGLM_token, chatGLM_task_id) {
    let req1 = await util.GM_fetch({
      method: "POST",
      url: `https://chatglm.cn/chatglm/backend-api/v1/stream_context`,
      headers: {
        "accept": "application/json, text/plain, */*",
        "authorization": `Bearer ${chatGLM_token}`,
        "origin": "https://chatglm.cn",
        "content-type": "application/json;charset=UTF-8",
        "referer": `https://chatglm.cn/detail`
      },
      data: JSON.stringify({
        "prompt": your_qus,
        "seed": 69809,
        "max_tokens": 512,
        "conversation_task_id": chatGLM_task_id,
        "retry": false,
        "retry_history_task_id": null
      })
    })
    try {
      return JSON.parse(req1.responseText).result.context_id;
    } catch (e) {
      console.error("获取chatGLM_context_id失败！", e)
      return null;
    }
  }

  async function chatGLM() {
    let chatGLM_token = GM_getValue("chatGLM_token");
    console.log("[智谱清言]token:", chatGLM_token);
    if (!chatGLM_token) {
      showAnswerAndHighlight("token为空，请先登录[智谱清言](https://chatglm.cn/)，再尝试请求。")
      return;
    }
    let chatGLM_task_id = await get_chatGLM_task_id(chatGLM_token);
    console.log("[智谱清言]chatGLM_task_id:", chatGLM_task_id);
    if (!chatGLM_task_id) {
      showAnswerAndHighlight("[智谱清言]chatGLM_task_id获取失败，请尝试点击[更新key]或者更换其他线路。")
      return;
    }
    let chatGLM_context_id = await get_chatGLM_context_id(chatGLM_token, chatGLM_task_id);
    console.log("[智谱清言]chatGLM_context_id:", chatGLM_context_id);
    if (!chatGLM_context_id) {
      showAnswerAndHighlight("[智谱清言]chatGLM_context_id获取失败，请尝试点击[更新key]或者更换其他线路。")
      return;
    }
    util.GM_fetch({
      method: "GET",
      url: `https://chatglm.cn/chatglm/backend-api/v1/stream?context_id=${chatGLM_context_id}`,
      headers: {
        "accept": "text/event-stream",
        "origin": "https://chatglm.cn",
        "referer": `https://chatglm.cn/detail`
      },
      responseType: "stream"
    }).then((stream) => {
      let reader = stream.response.getReader()
      reader.read().then(function processText({done, value}) {
        if (done) {
          return
        }
        let responseItem = new TextDecoder("utf-8").decode(value)
        responseItem.split("\n\n\n\n").forEach(item => {
          try {
            console.info(item)
            let ii = item.replace(/data:|event:(add|finish)|type:done/gi, "").trim();
            if (ii) {
              showAnswerAndHighlight(ii)
            }
          } catch (ex) {
            console.error(ex)
          }
        })
        return reader.read().then(processText)
      }, function (reason) {
        console.error(reason)
        Toast.error("未知错误!" + reason)
      }).catch((ex) => {
        console.error(ex)
        Toast.error("未知错误!" + ex)
      })
    })
  }


  let zhipuPrompt = []; 

  function base64UrlEncode(str) {
    let encodedSource = CryptoJS.enc.Base64.stringify(str);
    const reg = new RegExp('/', 'g');
    encodedSource = encodedSource.replace(/=+$/, '').replace(/\+/g, '-').replace(reg, '_');
    return encodedSource;
  }

  function generate_token(apikey, exp_seconds) {
    const [id, secretKey] = apikey.split(".");
    const payload = {
      "api_key": id,
      "exp": Date.now() + exp_seconds * 1000, 
      "timestamp": Date.now() 
    };
    const encodedHeader = base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify({alg: 'HS256', sign_type: 'SIGN', typ: "JWT"})));
    const encodedPayload = base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));
    const signature = CryptoJS.HmacSHA256(encodedHeader + '.' + encodedPayload, secretKey);
    return encodedHeader + '.' + encodedPayload + '.' + base64UrlEncode(signature);
  }

  async function zhiPuAi() {
    let zhiPu_apiKey = GM_getValue("zhiPu_apiKey");
    if (!zhiPu_apiKey) {
      showAnswerAndHighlight("apikey不存在。请前往[智谱AI](https://open.bigmodel.cn/usercenter/apikeys)申请，然后点击设置里的更新key");
      return;
    }
    console.log("zhiPu_apiKey:", zhiPu_apiKey);
    util.addMessageChain(zhipuPrompt, {"role": "user", "content": your_qus}, 10);
    util.GM_fetch({
      method: "POST",
      url: `https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_std/sse-invoke`,
      headers: {
        "accept": "text/event-stream",
        "Content-Type": "application/json",
        "Authorization": generate_token(zhiPu_apiKey, 1000)
      },
      data: JSON.stringify({
        model: "chatglm_std",
        prompt: zhipuPrompt,
        temperature: 0.95,
        top_p: 0.7,
        incremental: true
      }),
      responseType: "stream"
    }).then((stream) => {
      let reader = stream.response.getReader();
      let ans = []; 
      reader.read().then(function processText({done, value}) {
        if (done) {
          if (ans.length > 0) {
            util.addMessageChain(zhipuPrompt, {"role": "assistant", "content": ans.join("")}, 10);
          }
          return;
        }
        let responseItem = new TextDecoder("utf-8").decode(value);
        console.error(responseItem);
        responseItem = responseItem.split("\n");
        console.warn(responseItem);
        responseItem.forEach(item => {
          try {
            if (item && item.startsWith("data:")) {
              let ii = item.replace(/data:/gi, "");
              if (ii) {
                ans.push(ii);
                showAnswerAndHighlight(ans.join(""));
              }
            }
          } catch (ex) {
            console.error(item);
          }
        });
        return reader.read().then(processText);
      }, function (reason) {
        Toast.error("未知错误!");
        console.log(reason);
      }).catch((ex) => {
        Toast.error("未知错误!");
        console.log(ex);
      });
    });
  }




  async function zhiNao360() {
    let zhiNao360_sessionId = GM_getValue("zhiNao360_sessionId");
    if (!zhiNao360_sessionId) {
      showAnswerAndHighlight("会话id为空，请先登录[360智脑](https://chat.360.cn/)，创建一个会话，再尝试请求。")
    }
    console.log('360智脑会话id：' + zhiNao360_sessionId);
    const sendData = JSON.stringify({
      "prompt": your_qus,
      "conversation_id": zhiNao360_sessionId,
      "source_type": "prophet_web",
      "role": "00000001",
      "is_regenerate": false,
      "is_so": true
    });
    util.GM_fetch({
      method: "POST",
      url: `https://chat.360.com/backend-api/api/common/chat`,
      headers: {
        "accept": "text/event-stream",
        "origin": "https://chat.360.com",
        "referer": `https://chat.360.com/index`,
        "content-type": "application/json"
      },
      data: sendData,
      responseType: "stream"
    }).then((stream) => {
      let reader = stream.response.getReader()
      let result = []
      reader.read().then(function processText({done, value}) {
        if (done) {
          return
        }
        let responseItem = new TextDecoder("utf-8").decode(value)
        console.info(responseItem)
        if (responseItem) {
          responseItem.split("\n").forEach(item => {
            try {
              if (item.startsWith('event:')) {
                return;
              }
              if (item.startsWith("data: CONVERSATIONID####")) {
                zhiNao360_sessionId = item.replace(/data: CONVERSATIONID####/gi, "")
                GM_setValue("zhiNao360_sessionId", zhiNao360_sessionId);
              } else if (item.startsWith("data: MESSAGEID####")) {
              } else if (item.startsWith("data")) {
                let i = item.replace(/data: /gi, "")
                if (/^\d+$/.test(i) || !util.isJSON(i)) {
                  result.push(i)
                } else {
                  result.push("\n")
                }
              }
            } catch (e) {
            }
          })
          showAnswerAndHighlight(result.join(""))
        }
        return reader.read().then(processText)
      }, function (reason) {
        console.log(reason)
        Toast.error("未知错误!")
      }).catch((ex) => {
        Toast.error("未知错误!")
        console.error(ex)
      })
    })
  }



  async function MixerBox() {
    util.GM_fetch({
      method: "POST",
      url: `https://chatai.mixerbox.com/api/chat/stream`,
      headers: {
        "Referer": "https://chatai.mixerbox.com/chat",
        "origin": "https://chatai.mixerbox.com",
        "accept": "*/*",
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Android 12; Mobile; rv:107.0) Gecko/107.0 Firefox/107.0"
      },
      data: JSON.stringify({
        "prompt": [
          {
            "role": "user",
            "content": your_qus
          }
        ],
        "lang": "zh",
        "model": "gpt-3.5-turbo",
        "plugins": [],
        "pluginSets": [],
        "getRecommendQuestions": true,
        "isSummarize": false,
        "webVersion": "1.4.5",
        "userAgent": "Mozilla/5.0 (Android 12; Mobile; rv:107.0) Gecko/107.0 Firefox/107.0",
        "isExtension": false
      }),
      responseType: "stream"
    }).then((stream) => {
      let result = []
      const reader = stream.response.getReader();
      reader.read().then(function processText({done, value}) {
        if (done) {
          return;
        }
        try {
          let d = new TextDecoder("utf8").decode(new Uint8Array(value));
          console.warn(d)
          d.split("\n").forEach(item => {
            try {
              if (item.startsWith("data")) {
                result.push(item.replace(/data:/gi, ""))
              }
            } catch (ex) {

            }
          })
          showAnswerAndHighlight(result.join("").replace(/\[space\]/gi, " ").replace(/\[NEWLINE\]/gi, "\n").replace(/message_donedone/gi, "\n").replace(/\[DONE\]/gi, "\n"))
        } catch (e) {
          console.log(e)
        }
        return reader.read().then(processText);
      });
    }, reason => {
      console.log(reason)
      Toast.error("未知错误!")
    }).catch((ex) => {
      console.log(ex)
      Toast.error("未知错误!")
    })
  }



  let minimax_messageChain = [];

  async function miniMax() {
    let minimax_group_id = GM_getValue("minimax_group_id");
    let minimax_api_key = GM_getValue("minimax_api_key");
    if (!minimax_group_id || !minimax_api_key) {
      showAnswerAndHighlight("group_id或api_key不存在，请到[https://api.minimax.chat/](https://api.minimax.chat/)注册，申请。然后点击 设置-》更新秘钥");
      return;
    }
    util.addMessageChain(minimax_messageChain, {
      "sender_type": "USER",
      "sender_name": "用户",
      "text": your_qus
    }, 10)
    let sendData = {
      "model": "abab5.5-chat",  
      "tokens_to_generate": 1024, 
      "temperature": 0.9, 
      "top_p": 0.95, 
      "stream": false, 
      "reply_constraints": { 
        "sender_type": "BOT",
        "sender_name": "MM智能助理"
      },
      "sample_messages": [], 
      "plugins": [], 
      "messages": minimax_messageChain,  
      "bot_setting": [  
        {
          "bot_name": "MM智能助理",
          "content": "MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。"
        }
      ]
    }
    util.GM_fetch({
      method: "POST",
      url: `https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=${minimax_group_id}`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${minimax_api_key}`
      },
      data: JSON.stringify(sendData),
      responseType: "stream"
    }).then((stream) => {   
      let result = [];
      const reader = stream.response.getReader();
      reader.read().then(function processText({done, value}) {
        if (done) {
          util.addMessageChain(minimax_messageChain, {
            "sender_type": "BOT",
            "sender_name": "MM智能助理",
            "text": result.join("")
          }, 10)
          return;
        }
        try {
          let d = new TextDecoder("utf8").decode(new Uint8Array(value));
          result.push(JSON.parse(d).reply)  
          showAnswerAndHighlight(result.join("")) 
        } catch (e) {  
          console.log(e)
        }
        return reader.read().then(processText); 
      });
    }, reason => {  
      console.log(reason);
      Toast.error("未知错误!");
    }).catch((ex) => { 
      console.log(ex);
      Toast.error("未知错误!");
    })
  }


  let cleandxid = util.generateRandomString(21);
  let cleandxList = [];

  function CLEANDX() {
    let Baseurl = "https://c3.a0.chat/";
    console.log(util.formatTime())
    cleandxList.push({"content": your_qus, "role": "user", "nickname": "我", "time": `${util.formattedDate()} ${util.formatTime()}`, "isMe": true})
    cleandxList.push({"content": "正在思考中...", "role": "assistant", "nickname": "小助手", "time": `${util.formattedDate()} ${util.formatTime()}`, "isMe": false})
    console.log(cleandxList)
    console.log(cleandxid)
    if (cleandxList.length > 6) {
      cleandxList = cleandxList.shift();
    }
    abortXml = GM_xmlhttpRequest({
      method: "POST",
      url: Baseurl + "v1/chat/gpt/",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": util.generateRandomIP(),
        "Referer": Baseurl,
        "accept": "application/json, text/plain, */*"
      },
      data: JSON.stringify({
        "list": cleandxList,
        "id": cleandxid,
        "title": your_qus,
        "prompt": "",
        "temperature": 0.5,
        "models": "0",
        "time": `${util.formattedDate()} ${util.formatTime()}`,
        "continuous": true
      }),
      onloadstart: (stream) => {
        let result = [];
        const reader = stream.response.getReader();
        reader.read().then(function processText({done, value}) {
          if (done) {
            let finalResult = result.join("")
            try {
              console.log(finalResult)
              cleandxList[cleandxList.length - 1] = {
                "content": finalResult,
                "role": "assistant",
                "nickname": "小助手",
                "time": `${util.formattedDate()} ${util.formatTime()}`,
                "isMe": false
              };
              showAnswerAndHighlight(finalResult)
            } catch (e) {
              console.log(e)
            }
            return;
          }
          try {
            let d = new TextDecoder("utf8").decode(new Uint8Array(value));
            console.log(d)
            result.push(d)
            showAnswerAndHighlight(result.join(""))
          } catch (e) {
            console.log(e)
          }
          return reader.read().then(processText);
        });
      },
      responseType: "stream",
      onerror: function (err) {
        console.log(err)
        Toast.error("未知错误!" + err.message)
      }
    });
  }


  let messageChain_anseapp = [];

  async function ANSEAPP() {
    let baseURL = "https://forward.free-chat.asia/";
    util.addMessageChain(messageChain_anseapp, {role: "user", content: your_qus})
    util.GM_fetch({
      method: "POST",
      url: baseURL + "v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer undefined`,
        "Referer": 'https://anse.free-chat.asia/'
      },
      data: JSON.stringify({
        "model": "gpt-3.5-turbo-16k",
        "messages": messageChain_anseapp,
        "temperature": 0.7,
        "max_tokens": 4096,
        "stream": true
      }),
      responseType: "stream"
    }).then((stream) => {
      let result = [];
      let finalResult = [];
      const reader = stream.response.getReader();
      reader.read().then(function processText({done, value}) {
        if (done) {
          finalResult = result.join("")
          util.addMessageChain(messageChain_anseapp,
              {role: "assistant", content: finalResult.replace(/muspimerol/gi, "")}
          )
          showAnswerAndHighlight(finalResult.replace(/muspimerol/gi, ""))
          return;
        }

        try {
          let d = new TextDecoder("utf8").decode(new Uint8Array(value));
          console.log("raw:", d)
          let dd = d.replace(/data: /g, "").split("\n\n")
          console.log("dd:", dd)
          dd.forEach(item => {
            try {
              let delta = JSON.parse(item).choices[0].delta.content
              result.push(delta)
              showAnswerAndHighlight(result.join("").replace(/muspimerol/gi, ""))
            } catch (e) {

            }
          })
        } catch (e) {
          console.log(e)
        }
        return reader.read().then(processText);
      });
    }, function (err) {
      console.error(err)
      Toast.error("未知错误!" + err.message)
    })
  }


  function TOYAML() {
    util.GM_fetch({
      method: "GET",
      url: "https://toyaml.com/stream?q=" + encodeURI(your_qus),
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://toyaml.com/",
        "accept": "*/*"
      },
      responseType: "stream"
    }).then((stream) => {
      let finalResult = [];
      const reader = stream.response.getReader();
      reader.read().then(function processText({done, value}) {
        if (done) {
          return;
        }
        try {
          let byteArray = new Uint8Array(value);
          let decoder = new TextDecoder('utf-8');
          let nowResult = decoder.decode(byteArray)
          console.log(nowResult)
          if (!nowResult.match(/答案来自/)) {
            finalResult.push(nowResult)
          }
          showAnswerAndHighlight(finalResult.join(""))

        } catch (ex) {
          console.log(ex)
        }

        return reader.read().then(processText);
      });
    }).catch((ex) => {
      console.log(ex)
      Toast.error("未知错误!" + ex.message)
    })
  }


  setTimeout(() => {
    if (GM_getValue('GPTMODE')) {
      const selectEl = document.getElementById('modeSelect');
      let optionElements = selectEl.querySelectorAll("option");
      for (let op in optionElements) {
        if (optionElements[op].value === GM_getValue('GPTMODE')) {
          optionElements[op].setAttribute("selected", "selected");
          break;
        }
      }
    }

    if (GM_getValue('gpt_font_size')) {
      document.querySelector("#gptDiv").style.fontSize = GM_getValue('gpt_font_size');
    }

    if (GM_getValue('history_disable')) {
      let dis = GM_getValue('history_disable');
      history_disable = (dis === 'true' ? true : false);
    }

  }, 1000)
  
})
();
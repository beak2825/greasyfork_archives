// ==UserScript==
// @name        知乎获取大图链接
// @description 知乎批量获取原始图片的地址链接
// @namespace   huching.net
// @include     https://www.zhihu.com/question/
// @match        *://www.zhihu.com/*
// @version     0.7.14
// @license     MIT License
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMzYiIHdpZHRoPSIzNSIgdmlld0JveD0iMCAwIDM1IDM2Ij4gDQogPGcgZmlsbD0iIzAwOEZFQiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMS4wMmUzKSI+DQogIDxwYXRoICBkPSJtMy40NyAxLjAyZTNjLTIuMTEtMC4xMDctMy4wNSAwLjkzNC0yLjg0IDMuMTJ2MjcuNmMtMC4yMTMgMi4wOCAwLjg3OSAzLjA3IDMuMjggMi45NmgyNy40YzEuOTctMC4xMDcgMy4wNy0xLjIgMy4yOC0zLjI4di0yNy4yYzAuMTA3LTIuMjktMC44MjctMy4zOS0yLjgtMy4yOGgtMjguM3ptMS4zOCAyLjk1YzAuMTQzLTAuMDEgMC4yOTggMCAwLjQ2NSAwLjAxMmgyNC42YzEuMTUgMC4xMDcgMS43MiAwLjY4MSAxLjcyIDEuNzJ2MjRjMC4xODcgMS42OC0wLjQzOSAyLjQ3LTEuODggMi4zNmgtMjQuMS0wLjQzOWMtMS4wNyAwLTEuNi0wLjU3Mi0xLjYtMS43MnYtMjQuOGMtMC4xNjMtMSAwLjI1NS0xLjUzIDEuMjYtMS41N3ptOS44IDAuNDJjLTAuNTA4IDAuMDM4LTAuOTU1IDAuMzE1LTEuMzQgMC44MzItMS44OSAyLjgzLTQuMTMgNS4yMy02LjcyIDcuMi0wLjg1MyAwLjgyNy0wLjk2IDEuNjUtMC4zMiAyLjQ4IDAuNzIgMC42NCAxLjU1IDAuNTg2IDIuNDgtMC4xNiAwLjEwNy0wLjEwNyAwLjM3NC0wLjMwNiAwLjgwMS0wLjYgMS4wNC0wLjgyNyAxLjc3LTEuNTEgMi4yLTIuMDQgMS4yMyAxLjM2IDIuNDcgMi40IDMuNzIgMy4xMi0xLjU1IDAuODI3LTQuNTEgMS41MS04Ljg4IDIuMDQtMS4wNCAwLjIxMy0xLjUxIDAuNzg3LTEuNCAxLjcyIDAuMTg3IDAuODI3IDAuODUzIDEuMTkgMiAxLjA4IDUuMzMtMC42MTMgOS4xMy0xLjYgMTEuNC0yLjk2IDQuNCAxLjk3IDcuOTUgMi45MSAxMC42IDIuOCAxLjA0IDAgMS42MS0wLjQ2NyAxLjcyLTEuNCAwLTAuOTMzLTAuNTIxLTEuNTEtMS41Ni0xLjcyLTEuMzYgMC0yLjY3LTAuMTA1LTMuOTItMC4zMTgtMS4xNS0wLjI5My0yLjQ5LTAuNzA3LTQuMDQtMS4yNCAyLjI5LTEuNDcgNC4wMS0zLjA4IDUuMTYtNC44NCAwLjYxMy0xLjE1IDAuODE1LTEuOTcgMC42MDItMi40OC0wLjI5My0wLjUzMy0xLjA3LTAuODAxLTIuMzItMC44MDFoLTguOTJjMC41MzMtMC45MzMgMC40MjYtMS43Ny0wLjMyLTIuNTItMC4zNS0wLjE1LTAuNjc3LTAuMjE0LTAuOTgyLTAuMTkyem0tMS4wNiA1LjUxaDkuMjRjLTAuMzIgMC43NDctMS43NyAyLjA1LTQuMzYgMy45Mi0xLjI1LTAuNjEzLTIuODgtMS45Mi00Ljg4LTMuOTJ6bTEgOS40M2MtMC42Ni0wLjAyNS0xLjE0IDAuMjczLTEuNDQgMC44OTMtMC4zMiAwLjgyNyAwLjA0MDEgMS40NSAxLjA4IDEuODggMi40IDAuODI3IDQuODUgMS45MiA3LjM2IDMuMjggMC44MjcgMC40MjcgMS40OSAwLjI2NiAyLTAuNDggMC4yMTMtMC44MjctMC4wOTMyLTEuNTUtMC45Mi0yLjE2LTEuOTctMS4wNC00LjQzLTIuMTMtNy4zNi0zLjI4LTAuMjYtMC4wOC0wLjUwMS0wLjEyNC0wLjcyMS0wLjEzM3ptLTMuOTYgNi4yMWMtMS4yNSAwLTEuOTcgMC40MTItMi4xNiAxLjI0LTAuMTA3IDAuOTMzIDAuNDUzIDEuNTEgMS42OCAxLjcyIDYuODggMC45MzMgMTIgMS44NyAxNS41IDIuOCAxLjE1IDAuMzIgMS45MyAwLjA2NSAyLjM2LTAuNzYyIDAuMjEzLTAuOTMzLTAuMjU0LTEuNjEtMS40LTIuMDQtNi4yNy0xLjQ3LTExLjYtMi40NS0xNi0yLjk2eiIvPg0KIDwvZz4NCjwvc3ZnPg0K
// @supportURL   http://huching.net
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26047/%E7%9F%A5%E4%B9%8E%E8%8E%B7%E5%8F%96%E5%A4%A7%E5%9B%BE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/26047/%E7%9F%A5%E4%B9%8E%E8%8E%B7%E5%8F%96%E5%A4%A7%E5%9B%BE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


let head = document.getElementsByTagName('head');
head[0].insertAdjacentHTML('beforeend', '<style type="text/css">.CornerButtons{bottom: 50px;}#dl{position: fixed;bottom: 10px;right: 12px;z-index: 10;}#shadow{background-color:rgba(0,0,0,.65);position:fixed;top:0;right:0;bottom:0;left:0;z-index:10010}#shadow>div{width:70vw;margin:80px auto;position:relative;z-index:10011;background:#fff;border-radius:2px;max-width:900px;height:calc(100vh - 160px)}#shadow>div>div{font-size:24px;line-height:33px;padding:25px;text-align:center}#urltext{height:calc(100% - 140px);width:calc(100% - 100px);max-height:calc(100% - 140px);max-width:calc(100% - 100px);border:1px solid #666;border-radius:3px;color:#777;padding:8px 10px;margin:0 40px 40px;resize:both;line-height:1.3;font-size:13px;overflow-y:scroll}</style>');
document.body.insertAdjacentHTML('beforeend', '<div class="CornerAnimayedFlex"><button id="dl" class="Button CornerButton Button--plain" data-tooltip="获取大图链接" data-tooltip-position="left" aria-label="获取大图链接" type="button"><svg width="18" height="16" viewBox="0 0 35 36" xmlns="http://www.w3.org/2000/svg" class="Icon Icon--download" aria-hidden="true" style="height: 16px; width: 18px;"><title>获取大图链接</title><g transform="translate(0 -1020)"><path d="m14.8 1.93v18l-6.55-6.6-3.6 3.6 9.15 9.1 3.6 3.6 3.6-3.6 9.1-9.1-3.6-3.6-6.6 6.6v-18l-5.1 0.03z" transform="translate(0 1.02e3)"/><rect transform="rotate(90)" height="25.5" width="5.08" y="-30.1" x="1.05e3"/></g></svg></button></div>');
let dl = document.getElementById('dl');
dl.onclick = function () {
  document.body.setAttribute('style', 'overflow: hidden');
  document.body.insertAdjacentHTML('beforeend', '<div id="shadow"><div><div>全选复制下载链接</div><textarea id="urltext"></textarea><button id="close" class="Modal-closeButton-3JkR" title="关闭"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="CloseIcon-icon-2xww"><path d="M8.142 6.6l-5.53-5.53c-.42-.42-1.115-.425-1.54 0-.43.43-.427 1.117-.002 1.543l5.53 5.53-5.53 5.528c-.42.422-.425 1.117 0 1.543.43.43 1.117.427 1.543 0l5.53-5.528 5.528 5.53c.422.42 1.117.424 1.543-.002.43-.43.427-1.116 0-1.542L9.686 8.143l5.53-5.53c.42-.42.424-1.115-.002-1.54-.43-.43-1.116-.427-1.542-.002L8.143 6.6z" fill="#FFF" fill-rule="evenodd"></path></svg></button></div></div>');
  let url = document.getElementById('urltext');
  let img = document.images;
  for (i = 0; i < img.length; i++) {
    if (typeof img[i].dataset.original === 'string') {
      url.innerHTML += img[i].dataset.original + '\r'
    }
  }
  url.onclick = function () {
    url.select();
  }
  let close = document.getElementById('close');
  close.onclick = function () {
    document.body.setAttribute('style', '');
    let shadow = document.getElementById('shadow');
    shadow.parentNode.removeChild(shadow);
  }
}


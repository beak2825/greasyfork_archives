/*
 * ============================================================================== *
 ****************************** CodemaoUltra v0.4.1 ******************************
 ************* Copyright (C) 2023 xwmm92 ************
 * ============================================================================== *
*/
 
// ==UserScript==
// @name         CodemaoUltra
// @namespace    https://box3.codemao.cn/u/azOxwOxmxOcjcsh
// @version      0.4.1
// @compatible   edge
// @compatible   chrome
// @description  box3辅助
// @author       xwmm92
// @match        https://box3.codemao.cn/*
// @match        https://box3.fun/*
// @match        https://shequ.codemao.cn/*
// @match        https://static.box3.codemao.cn/block/*
// @match        https://static.box3.fun/block/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.17
// @require      https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/stats.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require      https://greasyfork.org/scripts/451480-md5%E5%8A%A0%E5%AF%86/code/md5%E5%8A%A0%E5%AF%86.js?version=1094400
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource     swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at       document-idle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMCA3OWMwLTM1LjQgMjguNS02NCA2My45LTY0LjFzNjQuMSAyOC42IDY0LjEgNjRjMCA5LjQtMi4xIDE4LjQtNS43IDI2LjUtMSAyLjMtMi4zIDQuNi0zLjYgNi43LS40LjYtMSAxLTEuNyAxSDExYy0uNyAwLTEuMy0uNC0xLjctMS0xLjMtMi4yLTIuNS00LjQtMy42LTYuN0MyLjEgOTcuNCAwIDg4LjQgMCA3OXptMjQuNC0zOS43Yy01LjIgNS4xLTkuMiAxMS4xLTEyIDE3LjgtMyA2LjktNC41IDE0LjItNC41IDIxLjhhNTUuODYgNTUuODYgMCAwIDAgNC40IDIxLjhjLjcgMS42IDEuNCAzLjIgMi4yIDQuN2g5OC44Yy44LTEuNSAxLjYtMy4xIDIuMi00LjdhNTUuODYgNTUuODYgMCAwIDAgNC40LTIxLjggNTUuODYgNTUuODYgMCAwIDAtNC40LTIxLjhjLTIuOC02LjctNi45LTEyLjctMTItMTcuOC01LjEtNS4yLTExLjEtOS4yLTE3LjgtMTJhNTUuODYgNTUuODYgMCAwIDAtMjEuOC00LjQgNTUuODYgNTUuODYgMCAwIDAtMjEuOCA0LjRjLTYuNiAyLjgtMTIuNiA2LjgtMTcuNyAxMnoiIGZpbGw9IiM0NDQiLz48cGF0aCBkPSJNMTIuNCA1Ny4xYzIuOC02LjcgNi45LTEyLjcgMTItMTcuOCA1LjEtNS4yIDExLjEtOS4yIDE3LjgtMTJBNTUuODYgNTUuODYgMCAwIDEgNjQgMjIuOWE1NS44NiA1NS44NiAwIDAgMSAyMS44IDQuNGM2LjcgMi44IDEyLjcgNi45IDE3LjggMTIgNS4yIDUuMSA5LjIgMTEuMSAxMiAxNy44YTU1Ljg2IDU1Ljg2IDAgMCAxIDQuNCAyMS44IDU1Ljg2IDU1Ljg2IDAgMCAxLTQuNCAyMS44Yy0uNyAxLjYtMS40IDMuMi0yLjIgNC43SDE0LjZjLS44LTEuNS0xLjYtMy4xLTIuMi00LjdBNTUuODYgNTUuODYgMCAwIDEgOCA3OC45Yy0uMS03LjYgMS40LTE0LjkgNC40LTIxLjh6IiBmaWxsPSIjNjQ5OTUwIi8+PHBhdGggZD0iTTc3LjUgNjAuOUM2OCA4MS4yIDY0LjkgODQuNiA2NC42IDg1Yy0xLjUgMS41LTMuNSAyLjMtNS42IDIuM3MtNC4xLS44LTUuNi0yLjNhNy45MSA3LjkxIDAgMCAxIDAtMTEuMmMuMy0uNCAzLjgtMy40IDI0LjEtMTIuOXptMC04Yy0xLjEgMC0yLjMuMi0zLjQuOEM2My4yIDU4LjggNTEgNjQuOSA0Ny44IDY4LjFjLTYuMiA2LjItNi4yIDE2LjMgMCAyMi41IDMuMSAzLjEgNy4yIDQuNyAxMS4yIDQuN3M4LjEtMS42IDExLjItNC43YzMuMi0zLjIgOS4zLTE1LjQgMTQuNC0yNi4zIDIuNi01LjYtMS43LTExLjQtNy4xLTExLjR6TTYzLjkgMjkuOGMtMjcuMiAwLTQ5LjUgMjIuNi00OS4xIDQ5LjggMCAzLjYuNSA3LjIgMS4zIDEwLjYuNCAxLjggMiAzLjEgMy45IDMuMSAyLjYgMCA0LjQtMi40IDMuOS00LjktLjctMy0xLjEtNi4yLTEuMS05LjNBNDIuMDQgNDIuMDQgMCAwIDEgMjYgNjNjMi01IDUtOS40IDguOC0xMy4yUzQzIDQzLjEgNDcuOSA0MWE0Mi4wNCA0Mi4wNCAwIDAgMSAzMi4yIDBjNC45IDIuMSA5LjMgNS4xIDEzLjEgOC45Qzk3IDUzLjYgOTkuOSA1OCAxMDIgNjNhNDIuMDQgNDIuMDQgMCAwIDEgMy4yIDE2LjFjMCAzLjItLjQgNi4zLTEuMSA5LjMtLjYgMi41IDEuMyA0LjkgMy45IDQuOSAxLjggMCAzLjUtMS4zIDMuOS0zLjEuOC0zLjYgMS4zLTcuMyAxLjMtMTEuMSAwLTI3LjMtMjIuMS00OS4zLTQ5LjMtNDkuM3oiIGZpbGw9IiM0NDQiLz48L3N2Zz4=
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/479757/CodemaoUltra.user.js
// @updateURL https://update.greasyfork.org/scripts/479757/CodemaoUltra.meta.js
// ==/UserScript==
var banben = "v0.4.1";
(o=>{const a=document.createElement("style");a.dataset.source="vite-plugin-monkey",a.innerText=o,document.head.appendChild(a)})('@keyframes opacity-show{0%{opacity:0}to{opacity:1}}@keyframes opacity-hide{to{opacity:0}}.swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:rgba(54,70,93,.99);box-shadow:0 0 1px #00000013,0 1px 2px #00000013,1px 2px 4px #00000013,1px 3px 8px #00000013,2px 4px 16px #00000013;pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:.5em 0 0;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(54,70,93,.99)}.swal2-container.swal2-backdrop-hide{background:transparent!important}.swal2-container.swal2-top-start,.swal2-container.swal2-center-start,.swal2-container.swal2-bottom-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-top,.swal2-container.swal2-center,.swal2-container.swal2-bottom{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-top-end,.swal2-container.swal2-center-end,.swal2-container.swal2-bottom-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-start>.swal2-popup,.swal2-container.swal2-center-left>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-start>.swal2-popup,.swal2-container.swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-row>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:transparent;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:none}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:#fff;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px #7066e080}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px #dc374180}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px #6e788180}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 1px #36465dfc,0 0 0 3px #7a91b2fc}.swal2-styled:focus{outline:none}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid rgba(255,255,255,.2);color:#fff;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{position:fixed;z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:transparent;color:#fff;font-family:serif;font-family:monospace;font-size:3em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:transparent;color:#f27474}.swal2-close:focus{outline:none;box-shadow:inset 0 0 0 3px #6496c880}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:#fff;font-size:1.125em;font-weight:250;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-input,.swal2-file,.swal2-textarea,.swal2-select,.swal2-radio,.swal2-checkbox{margin:1em 2em 3px}.swal2-input,.swal2-file,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(73,94,125,.99);box-shadow:inset 0 1px 1px #0000000f,0 0 0 3px transparent;color:#fff;font-size:1.125em}.swal2-input.swal2-inputerror,.swal2-file.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-input:focus,.swal2-file:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px #0000000f,0 0 0 3px #6496c880}.swal2-input::placeholder,.swal2-file::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:transparent}.swal2-range input{width:80%}.swal2-range output{width:20%;color:#fff;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(73,94,125,.99);font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(73,94,125,.99);color:#fff;font-size:1.125em}.swal2-radio,.swal2-checkbox{align-items:center;justify-content:center;background:transparent;color:#fff}.swal2-radio label,.swal2-checkbox label{margin:0 .6em;font-size:1.125em}.swal2-radio input,.swal2-checkbox input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:transparent;color:#fff;font-size:1em;font-weight:300}.swal2-validation-message:before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:transparent;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:rgba(122,145,178,.99);color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:rgba(122,145,178,.99)}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{animation:opacity-show .3s}.swal2-hide{animation:opacity-hide .1s}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotate(2deg)}33%{transform:translateY(0) rotate(-2deg)}66%{transform:translateY(.3125em) rotate(2deg)}to{transform:translateY(0) rotate(0)}}@keyframes swal2-toast-hide{to{transform:rotate(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}to{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}to{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}to{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}to{transform:scale(.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}to{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}to{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}to{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}to{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}to{transform:rotateX(0);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}to{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotate(45deg);opacity:0}25%{transform:rotate(-25deg);opacity:.4}50%{transform:rotate(15deg);opacity:.8}75%{transform:rotate(-5deg);opacity:1}to{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px #36465dfc}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translate(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translate(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}.lil-gui{--background-color: transparent;--text-color: rgba(255, 255, 255, .8);--title-background-color: rgba(0, 0, 0, .3);--title-text-color: rgba(255, 255, 255, .9);--widget-color: rgba(100, 100, 100, .1);--hover-color: rgba(100, 100, 100, .2);--focus-color: rgba(255, 255, 255, .2);--number-color: var(--primary-color);--string-color: #ffab00;--font-size: 12px;--input-font-size: 10px;--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;--font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;--padding: 4px;--spacing: 4px;--widget-height: 20px;--name-width: 45%;--slider-knob-width: 2px;--slider-input-width: 27%;--color-input-width: 27%;--slider-input-min-width: 45px;--color-input-min-width: 45px;--folder-indent: 5px;--widget-padding: 0 0 0 3px;--widget-border-radius: var(--border-radius);--checkbox-size: calc(.75 * var(--widget-height));--scrollbar-width: 2px;max-height:70vh}.lil-gui .name{user-select:none!important}.lil-gui *{transition:background-color .25s}.lil-gui.root{transform:translateY(0px);border:1px solid transparent;background:rgba(0,0,0,.8);backdrop-filter:blur(var(--blur));filter:saturate(50%);transition:border-color .5s,box-shadow .5s,filter .25s;box-shadow:0 0 0 var(--primary-color);border-radius:var(--border-radius)}.lil-gui.root:hover{border-color:var(--primary-color);box-shadow:0 0 5px var(--primary-color);filter:none}.lil-gui input[type=checkbox]:checked:before{color:var(--primary-color)}option{background:rgba(0,0,0,.5);color:#ffffff80;border-left:1px solid transparent}option:hover{background:rgba(0,0,0,.5);color:#fffc;border-left:1px solid #2196f3}.lil-gui.closed>.children{transform:translateY(-20px);filter:grayscale(100%);opacity:0}.lil-gui.transition>.children{transition-duration:.5s;transition-property:height,opacity,transform,filter;transition-timing-function:cubic-bezier(.2,.6,.35,1);overflow:hidden;pointer-events:none}.lil-gui input{background:transparent;border-bottom:1px solid rgba(255,255,255,.1)}.lil-gui .controller.number:hover .fill{background-color:var(--number-color);box-shadow:0 0 5px var(--number-color)}.lil-gui .controller.number:hover input{text-shadow:0 0 5px var(--number-color)}::selection{background:#ff5f42;color:#42e2ff}.container-window{position:fixed;left:50px;top:50px;z-index:999}.container-window .handle{cursor:move;position:relative;margin-left:auto;width:calc(100% - 80px);border-left:1px solid rgba(255,255,255,.8);opacity:0;height:25px;background-color:#0003;color:#fffc;display:flex;justify-content:center;align-items:center;z-index:999;transition:opacity .25s;font-size:4px}.container-window .handle:hover{opacity:1}._2x0RglLpha6lx9vdRMkP5r{user-select:text!important}.swal2-popup{font-size:unset!important}.swal2-backdrop-show{backdrop-filter:blur(5px);background:rgba(0,0,0,.5)!important}canvas.magic-cursor-canvas{height:100vh;width:100vw;position:fixed;top:0;left:0;z-index:9999999999;opacity:.5;pointer-events:none;transition:opacity .25s}');
(async function () {
    async function run() {
        //运行成功！
        console.log("CodemaoUltra运行成功");
        //工具
        var dialogzindex = 99999
        const setv = ((html, name, value) => { html.setAttribute(name, value) });
        const setn = ((html, value) => { html.setAttribute(value, "") });
        const seth = ((html, html5) => { html.innerHTML = html5 });
        const sett = ((html, text) => { html.innerText = text });
        const addhtml = ((position, localName, data, html) => { var newHtml = document.createElement(localName); for (var name in data) { newHtml.setAttribute(name, data[name]) }; newHtml.innerHTML = html; var newElement = position.appendChild(newHtml); return (newElement) })
        const addanot = ((position, value) => { var newHtml = document.createComment(value); var newElement = position.appendChild(newHtml); return (newElement) });
        const addwindow = (name, content, width, img = null, closeyes = true, position = document.body) => {
            var dialog = addhtml(position, "div", { class: "box3edittooldiv box3tooldialog dongtai kaishizhuangtai", show: "true", oncontextmenu: "return false;", style: `top:10px;left:10px;width:${width}px;z-index:${dialogzindex}` }, "");
            var dialogdb = addhtml(dialog, "div", { class: "db" }, "");
            setTimeout(() => { dialog.classList.remove("kaishizhuangtai") }, 10)
            setTimeout(() => { dialog.classList.remove("dongtai") }, 260);
            if (img) {
                addhtml(dialogdb, "img", { width: "100", height: "100%", src: img, style: "margin-right: 10px;" }, ``)
            }
            var dialogydtzd = addhtml(dialog, "div", { class: "ydtzd", title: "拖动" }, "");
            var a = addhtml(dialogdb, "div", { style: "display: flex;flex-direction: column;" }, `<span style='font-weight: bold;font-size:20px'>${name}</span><font style='font-size:12px;color:#aaa;display: flex;flex-direction: row;'></font>`)
            sett(a.getElementsByTagName("font")[0], content)
            var dialogclose = addhtml(dialogdb, "button", { title: "关闭", zdy: "", jy: !closeyes }, "×");
            if (closeyes) {
                dialogclose.onclick = () => { setTimeout(() => { dialog.classList.add("dongtai", "kaishizhuangtai"); }, 10); setTimeout(() => { dialog.remove(); }, 260) }
            }
            dialog.onmousedown = () => { dialogzindex += 1; dialog.style.zIndex = dialogzindex }
            dialogydtzd.onmousedown = (en) => {
                setv(dialogydtzd, "ox", en.offsetX)
                setv(dialogydtzd, "oy", en.offsetY)
                document.onmousemove = (e) => {
                    dialog.style.top = (e.clientY - en.offsetY) + "px"
                    dialog.style.left = (e.clientX - en.offsetX) + "px"
                }
            }
            dialogydtzd.onmouseup = () => { document.onmousemove = null; }
            return ({ close: () => { setTimeout(() => { dialog.classList.add("dongtai", "kaishizhuangtai"); }, 10); setTimeout(() => { dialog.remove(); }, 260) }, openclose: () => { setv(dialogclose, "jy", "false"); dialogclose.onclick = () => { setTimeout(() => { dialog.classList.add("dongtai", "kaishizhuangtai"); }, 10); setTimeout(() => { dialog.remove(); }, 260) } }, dialog })
        }
        function getCookie(variable = '') {
            var query = document.cookie
            var vars = query.split("; ");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1]}
            }
            return null;
        }
        function setCookie(variable = 'a',content = '0'){
            document.cookie = `${variable}=${content}`
            return(document.cookie);
        }
        function getParameters(variable = ''){
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1]}
            }
            return(null);
        }
        function downloadMp3(filePath,name) {
            fetch(filePath).then(res => res.blob()).then(blob => {
                const a = document.createElement('a');
                a.style.display = 'none'
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = name+'.mp3';
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }
        function returnTime(t) {//返回时间 t：时间戳
            var nowTime = new Date(t);
            return {"年": nowTime.getFullYear(),"月": nowTime.getMonth() + 1,"日": nowTime.getDate(),"周": '星期' + "日一二三四五六".split("")[Number(nowTime.getDay())],"时": nowTime.getHours(),"分": nowTime.getMinutes(),"秒": nowTime.getSeconds()}
        };
        const reload=()=>{location.reload()};//重新加载
        function logs(...l){console.log("%cCodemaoUltra","background: #e7520d; border-radius: 3px; padding: 0 4px; color: #fff",...l)};//输出数据
        function isIE(){return !!document.documentMode};//是否是IE浏览器
        const requestAnimationFrame =
              window.requestAnimationFrame || // 谷歌浏览器
              window.webkitRequestAnimationFrame || // 其他浏览器
              window.mozRequestAnimationFrame || // 火狐浏览器
              window.oRequestAnimationFrame || // 欧朋浏览器
              window.msRequestAnimationFrame || // IE浏览器
              function(a){ // 上面这些都不是就返回这个函数
                  setTimeout(a,1000 / 60);
              };
 
        if(isIE()){alert("你这个浏览器好像太老了欸，\n试试换个Google Chrome或者Microsoft Edge再来体验CodemaoUltra吧~");return};//IE提示
        //主程序
        try{
            var mode114514 = 'box';
            var toolfunc = null,toolfunc2 = null,toolfunc3 = null,toolfunc4 = null,nowmode,beiyongnowmode,isoldmode=false,isstagingmode=false
            var tool;
            const getElement = async (selector, timeout = 30e3) => {
                let el;
                const start = Date.now();
                do {
                    el = document.querySelector(selector);
                    if (Date.now() - start > timeout) {
                        console.error("Wait element timeout.", selector);
                    }
                    await new Promise(requestAnimationFrame);
                } while (!el);
                return el;
            };
            const waitElement=async(selector)=>{let el;do{el=document.querySelector(selector);await new Promise(requestAnimationFrame)}while(!el);}
            addanot(document.body,"———————————————————————————————————————")
            addanot(document.body,` CodemaoUltra ${banben} by xwmm92 `)
            addanot(document.body," https://box3.codemao.cn/u/azOxwOxmxOcjcsh ")
            addanot(document.body,"———————————————————————————————————————")
            var statsDiv = new Stats();
            document.body.append(statsDiv.domElement);
            statsDiv.domElement.title="点击切换模式"
            function updatastate(){
                requestAnimationFrame(updatastate);
                statsDiv.update();
            }
            var CodemaoUltra = {toolfunc,toolfunc2,toolfunc3,toolfunc4,nowmode,beiyongnowmode,isoldmode,isstagingmode};
            updatastate()
            var userhuanchun =null
            function logs(...l){console.log("[CodemaoUltraLog]",...l)}
            function getMode(){
                var a = location.pathname,b
                if(window.location.hostname=='shequ.codemao.cn'){
                    mode114514='shequ'
                }else if(window.location.hostname=='box3.codemao.cn'||window.location.hostname=='box3.fun'){
                    mode114514='box'
                }
                if(mode114514=='box'){
                    if(a.startsWith("/e/")){
                        b="Edit"
                    }else if(a.startsWith("/p/")){
                        b="Play"
                    }else if(a.startsWith("/g/")){
                        b="MapRead"
                    }else if(a.startsWith("/m/")){
                        b="MusicRead"
                    }else if(a.startsWith("/v/")){
                        b="ModelRead"
                    }else if(a.startsWith("/me/content")){
                        if(/map|null/.test(String(getParameters("type"))))b="Works"
                        else if(/model/.test(String(getParameters("type"))))b="ModelWorks"
                        else if(/music/.test(String(getParameters("type"))))b="MusicWorks"
                        else b="OtherMode"
                    }else if(a.startsWith("/maas")){
                        b="Maas"
                    }else if(a.startsWith("/u/")){
                        b="User"//HomePage
                    }else if(a.startsWith("/block/Qm")&&/static.box3/.test(location.href)){
                        b="BoxStatic";
                    }else if(a=="/"){
                        b="HomePage"
                    }else {
                        b="OtherMode"
                    }
                }else{
                    if(a.startsWith("/work/")){ // 社区
                        b="shequWork"
                    }else if(a.startsWith("/community/")||a.startsWith('/wiki/forum/')){ // 社区帖子
                        b="shequCommunityRead"
                    }else if(a.startsWith("/community")){
                        b="shequCommunity";
                    }else{
                        b="ShequOtherMode"
                    }
                }
                return b;
            }
            var initinterval = setInterval(()=>{
                nowmode = getMode();
                if(location.href != beiyongnowmode){
                    logs("更换模式 "+nowmode)
                    console.log(nowmode);
                    updatamode(nowmode)
                }
            },1)
            var cpmsetck=localStorage.getItem('cpmset');
            var CodemaoUltrasettings = {
                width:250,
                showmonitor:true,
                monitorposition:0,
                monitortm:90,
                primaryColor: "#ff5f42",
                blur: 5,
                borderRound: true,
                windowPos: [0, 0],
                left:100,
                top:0,
                autoSave:true,
                save:()=>{
                    localStorage.setItem("cpmset",`${JSON.stringify({
                        width:CodemaoUltrasettings.width,
                        showmonitor:CodemaoUltrasettings.showmonitor,
                        monitorposition:CodemaoUltrasettings.monitorposition,
                        monitortm:CodemaoUltrasettings.monitortm,
                        autoSave:CodemaoUltrasettings.autoSave,
                        blur:CodemaoUltrasettings.blur,
                        primaryColor:CodemaoUltrasettings.primaryColor,
                        borderRound:CodemaoUltrasettings.borderRound,
                        windowPos:CodemaoUltrasettings.windowPos,
                        left:CodemaoUltrasettings.left,
                        top:CodemaoUltrasettings.top,
                    })}`)
                    cpmsetck=localStorage.getItem('cpmset');
                    if(!CodemaoUltrasettings.autoSave)alert('保存成功！');
                },
                manualSave:()=>{
                    localStorage.setItem("cpmset",`${JSON.stringify({
                        width:CodemaoUltrasettings.width,
                        showmonitor:CodemaoUltrasettings.showmonitor,
                        monitorposition:CodemaoUltrasettings.monitorposition,
                        monitortm:CodemaoUltrasettings.monitortm,
                        autoSave:CodemaoUltrasettings.autoSave,
                        blur:CodemaoUltrasettings.blur,
                        primaryColor:CodemaoUltrasettings.primaryColor,
                        borderRound:CodemaoUltrasettings.borderRound,
                        windowPos:CodemaoUltrasettings.windowPos,
                        left:CodemaoUltrasettings.left,
                        top:CodemaoUltrasettings.top,
                    })}`)
                    cpmsetck=localStorage.getItem('cpmset');
                    reload();
                },
                del:()=>{
                    if(cpmsetck==null){alert('还未保存！');return;}
                    localStorage.setItem("cpmset",``)
                    reload();
                },
                updateSettings:()=>{
                    var e = CodemaoUltrasettings.monitorposition
                    var data=[[0,null,0,null],[0,null,null,0],[null,0,null,0],[null,0,0,null]];
                    statsDiv.domElement.style.top=typeof data[e][0]=="number"?data[e][0]+"px":"unset";statsDiv.domElement.style.bottom=typeof data[e][1]=="number"?data[e][1]+"px":"unset";
                    statsDiv.domElement.style.right=typeof data[e][3]=="number"?data[e][3]+"px":"unset";statsDiv.domElement.style.left=typeof data[e][2]=="number"?data[e][2]+"px":"unset";
                    tool.domElement.style.width=CodemaoUltrasettings.width+"px";
                    var x = CodemaoUltrasettings.showmonitor
                    statsDiv.domElement.style.display = x?"block":"none";//setmonitorposition.enable(x);setmonitortm.enable(x);
                    statsDiv.domElement.style.opacity = CodemaoUltrasettings.monitortm/100;
                    GM_setValue("b3tbsettings", JSON.stringify(CodemaoUltrasettings));
                },
                reset:()=>{
                    if(!confirm('确定重置全部设置吗！！'))return;
                    Object.assign(CodemaoUltrasettings,{
                        width:250,
                        showmonitor:true,
                        monitorposition:0,
                        monitortm:90,
                        primaryColor: "#ff5f42",
                        blur: 5,
                        borderRound: true,
                        windowPos: [0, 0],
                        left: 100,
                        top:0,
                    });
                    CodemaoUltrasettings.autoSave=true;
                    CodemaoUltrasettings.save();
                    CodemaoUltrasettings.autoSave=true;
                    CodemaoUltrasettings.primaryColor= "#ff5f42"
                    CodemaoUltrasettings.blur= 5
                    CodemaoUltrasettings.borderRound= true
                    CodemaoUltrasettings.windowPos= [0, 0]
                    CodemaoUltrasettings.top = 0
                    CodemaoUltrasettings.left = 100
                    CodemaoUltrasettings.updateSettings();
                    reload();
                }
            }
            if(cpmsetck){
                try{
                    Object.assign(CodemaoUltrasettings,JSON.parse(cpmsetck));
                }catch(err){
                    alert('保存的设置加载失败，如果需要，以下是错误信息：'+err);
                }
            }
            function updatamode(m){
                beiyongnowmode = location.href;
                logs("当前模式："+m)
                var init = async(md)=>{
                    if(mode114514=='box'&&m!="BoxStatic"){
                        if(/Play|Edit/.test(m)){
                            toolfunc3 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
                        }else{
                            toolfunc3 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website
                        }
                        logs(toolfunc2);
                        logs(toolfunc3);
                    }
                    const ranges = [
                        [0xA1, 0xA9, 0xA1, 0xFE],
                        [0xB0, 0xF7, 0xA1, 0xFE],
                        [0x81, 0xA0, 0x40, 0xFE],
                        [0xAA, 0xFE, 0x40, 0xA0],
                        [0xA8, 0xA9, 0x40, 0xA0],
                        [0xAA, 0xAF, 0xA1, 0xFE],
                        [0xF8, 0xFE, 0xA1, 0xFE],
                        [0xA1, 0xA7, 0x40, 0xA0],
                    ]
                    const codes = new Uint16Array(23940);
                    let i = 0
 
                    for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
                        for (let b2 = b2Begin; b2 <= b2End; b2++) {
                            if (b2 !== 0x7F) {
                                for (let b1 = b1Begin; b1 <= b1End; b1++) {
                                    codes[i++] = b2 << 8 | b1
                                }
                            }
                        }
                    }
                    const str = new TextDecoder('gbk').decode(codes);
                    const table = new Uint16Array(65536);
                    for (let i = 0; i < str.length; i++) {
                        table[str.charCodeAt(i)] = codes[i];
                    }
                    function stringToGbk(str='') {
                        const buf = new Uint8Array(str.length * 2)
                        let n = 0
                        let no=[],wrong=[];
                        for (let i = 0; i < str.length; i++) {
                            if(str[i]==' '){
                                wrong.push(n,n+1);
                            }
                            if(str[i].match(/[0-9a-zA-Z()!*]/)){
                                buf[n++] = 255;
                                no.push(str[i]);
                                continue;
                            }
                            if(str[i]=='€'){
                                buf[n++] = 0x80;
                                continue;
                            }
                            const code = str.charCodeAt(i)
                            if (code < 0x80) {
                                buf[n++] = code
                            } else {
                                const gbk = table[code];
                                buf[n++] = gbk & 0xFF
                                buf[n++] = gbk >> 8
                            }
                        }
                        return [buf.subarray(0, n),no,wrong]
                    }
                    function glabled_code_repair(t=''){
                        var [u8arr,uc,wrong]= stringToGbk(t);
                        var x = [''],q=0,ret=[''],q2=0,wait=false,ans='';
                        u8arr.forEach((e,i) => {
                            if(wrong.includes(i)){
                                if(!wait){
                                    ret.push('');
                                    x.push('');
                                    x[q2]+='?';
                                    q2++;
                                    wait=true;
                                }else{
                                    x[q2-1]+='?';
                                }
                            }else {
                                wait=false;
                                if(e==255){
                                    x[q2]+=uc[q++];
                                }else{
                                    var p=e.toString(16);
                                    if(p.length<2)p='0'+p;
                                    x[q2] += '%' + p;
                                }
                                try{
                                    ret[q2]=decodeURIComponent(x[q2]);
                                }catch(e){
                                    ret[q2]+='?';
                                }
                            }
                        });
                        ret.forEach(e=>{ans+=e});
                        return ans;
                    }
                    async function creat(hash, size) {
                        axios({
                            method: 'post',
                            url: 'https://backend.box3.fun/container/create-game-edit',
                            data: JSON.parse(`{"image":"Qmdkqjkx8YXCEzQuNrZhEr75dpRGHcWY7oiCxg5oQqfzox.png","name":"空白的地图(${size}) (未激活)","describe":"${size}","hash":"${hash}","resourceId":0}`),
                            withCredentials: true
                        })
                            .then(({
                            request
                        }) => {
                            console.log(JSON.parse(request.responseText)['data']['value'].slice(5));
                        });
                        location.reload();
                    }
                    async function creatPRO(hash, size) {
                        axios({
                            method: 'post',
                            url: 'https://code-api-pc.dao3.fun/ugc/creator/content/create-game-edit',
                            data: JSON.parse(`{"image":"Qmdkqjkx8YXCEzQuNrZhEr75dpRGHcWY7oiCxg5oQqfzox.png","name":"空白的地图(${size}) (未激活)","describe":"${size}","hash":"${hash}","resourceId":0}`),
                            withCredentials: true
                        })
                            .then(({
                            request
                        }) => {
                            console.log(JSON.parse(request.responseText)['data']['value'].slice(5));
                        });
                        location.reload();
                    }
                    function getGameplayCore() {
                        return document.querySelector(".desktop")._reactRootContainer._internalRoot
                            .current.updateQueue.baseState.element.props.children.props.children
                            .props;
                    }
                    function getEditorCore() {
                        return document.querySelector(".desktop")._reactRootContainer._internalRoot
                            .current.updateQueue.baseState.element.props.children.props.children
                            .props;
                    }
                    var datas = {
                        "发送长消息":()=>{
                            var dialogs = addwindow("发送长消息","确保你没有被禁言，然后在下方输入消息，回车换行，Shift+回车发送。\n如果按某些按键时无法键入内容而导致人物移动，请自行在其他可以输入文本的网站或输入框等地方输入，复制后再粘贴过来\n另外，发送的内容请自行打开“聊天区”查看",500);
                            var div1 = addhtml(dialogs.dialog,"div",{class:"div"},"");
                            var div2 = addhtml(dialogs.dialog,"div",{class:"div"},"");
                            var input = addhtml(div2,"textarea",{style:"width:100%;height:250px;background:#0000;color:#fff;outline: none;resize: none;padding:10px;margin-top:10px"},"")
                            var fjcg=()=>{var a = addhtml(dialogs.dialog,"div",{class:"div"},"发送成功！");setTimeout(()=>{a.remove()},2000)}
                            var send = ()=>{
                                if(m=='Play'){
                                    toolfunc.state.box3.chat.sendMessage(input.value);
                                }else{
                                    toolfunc3.state.box3.chat.sendMessage(input.value);
                                }
                                setTimeout(()=>{input.value=""},100);fjcg()
                            }
                            addhtml(div1,"button",{},"粘贴文本").onclick=async()=>{input.value=await navigator.clipboard.readText();}
                            addhtml(div1,"button",{},"一键发送").onclick=send
                            input.onkeydown=(e)=>{if(e.key=="Enter"&&e.shiftKey){send()}}
                        },
                        "地图信息":()=>{
                            var dialogs = addwindow(toolfunc2.containerName,toolfunc2.containerDesc,500,"https://static.box3.codemao.cn/block/"+toolfunc2.image);
                            var div1 = addhtml(dialogs.dialog,"div",{class:"div"},"");
                            var fjcg=()=>{var a = addhtml(dialogs.dialog,"div",{class:"div"},"复制成功！");setTimeout(()=>{a.remove()},2000)}
                            addhtml(div1,"button",{},"复制地图名").onclick=()=>{navigator.clipboard.writeText(toolfunc2.containerName);fjcg()}
                            addhtml(div1,"button",{},"复制简介").onclick=()=>{navigator.clipboard.writeText(toolfunc2.containerDesc);fjcg()}
                            addhtml(div1,"button",{},"复制封面链接").onclick=()=>{navigator.clipboard.writeText("https://static.box3.codemao.cn/block/"+toolfunc2.image);fjcg()}
                            addhtml(div1,"button",{},"在新标签页中打开封面").onclick=()=>{window.open("https://static.box3.codemao.cn/block/"+toolfunc2.image)}
                        },
                        "未开放":()=>{
                            addwindow("敬请期待！","",300);
                        },
                        "作者":()=>{
                            window.open("https://box3.codemao.cn/u/azOxwOxmxOcjcsh")
                        },
                        "更新":()=>{
                            window.open("https://greasyfork.org/zh-CN/scripts/479757-codemaoultra")
                        },
                        "建造256256704地图":async()=>{
                            if (confirm('确认创建256*256*704地图？')) {
                                creat('QmTuELNrZixUHYytsqJAUCw8R22868ePtkNCQ4DMUd8wCg', '256*256*704');
                            }
                            reload();
                        },
                        "建造1024641024地图":async()=>{
                            if (confirm('确认创建1024*64*1024地图？')) {
                                creat('QmNorKXGb2RwP3KRQBpkH2vfJJ4ziva5qMc1cU6SJyBSTa', '1024*64*1024');
                            }
                            reload();
                        },"建造hash地图":async(hash,name="空白地图")=>{
                            if(!await confirm("提示：确认创建？"))return
                            var edithash = await document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website.rpc.container.api.createGameEdit({
                                image:"Qmdkqjkx8YXCEzQuNrZhEr75dpRGHcWY7oiCxg5oQqfzox.png",
                                name:name,describe:"",hash,
                                createNow: true,
                            })
                            open(location.origin+"/e/"+edithash.split("-")[1])
                            for (let i of "12345") {
                                document.querySelector("#main > main > div.bg-white.mb-24.p-24-0.cKMigh6PpW3tleaZK6J1R > div > div.hAB8LjZSi73-MLk-0ZUWg.tab-bar > button._3AspHqpBNnv2Z9vUyC6Fnx.vbojj-sJcBnYnXKqRwxoU._12b-ZtA2Hl4-wYcKqK83AR._1SS6wc-FMtveQU1rUrkRW.Lz4uEvJd_qOzG39N7jnOg._1KXyfkOCOG7H7xR_ULs_R7._3mGcht4WhuRtvCwPGKNEvg").click();
                                await new Promise((e) => setTimeout(e, 100));
                            }
                            reload();
                        },"测试":(async()=>{
                            if(!await confirm("提示：确认创建？"))return
                            var edithash = await document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website.rpc.container.api.createGameEdit({
                                image:"Qmdkqjkx8YXCEzQuNrZhEr75dpRGHcWY7oiCxg5oQqfzox.png",
                                name:"PRO地图测试",describe:"",hash:"QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU",
                                createNow: true,
                            })
                            open(location.origin+"/e/"+edithash.split("-")[1])
                            for (let i of "12345") {
                                document.querySelector("#main > main > div.bg-white.mb-24.p-24-0.cKMigh6PpW3tleaZK6J1R > div > div.hAB8LjZSi73-MLk-0ZUWg.tab-bar > button._3AspHqpBNnv2Z9vUyC6Fnx.vbojj-sJcBnYnXKqRwxoU._12b-ZtA2Hl4-wYcKqK83AR._1SS6wc-FMtveQU1rUrkRW.Lz4uEvJd_qOzG39N7jnOg._1KXyfkOCOG7H7xR_ULs_R7._3mGcht4WhuRtvCwPGKNEvg").click();
                                await new Promise((e) => setTimeout(e, 100));
                            }
                            reload();
                        }),'赤碧城': (() => {
                            if (confirm('确认创建赤碧城地图？')) {
                                creat('QmSZSz9U7UViiZM5SBFRmb96xMRvkSTayhjknc5MtezotZ', '赤碧城');
                            }
                        }),
                        '故宫': (() => {
                            if (confirm('确认创建故宫地图？')) {
                                creat('QmaUdPGfnMuLgtj9th1PoviN1HdhsbYrk4yASZkfwZJRuX', '故宫');
                            }
                        }),
                        '黄鹤楼捉妖': (() => {
                            if (confirm('确认创建黄鹤楼捉妖地图？')) {
                                creat('QmeHTRPWySwrMXLtgVD7YgKVhDHgiDQHmwjjVbeVvmzMMz', '黄鹤楼捉妖');
                            }
                        }),
                        '天空秘境': (() => {
                            if (confirm('确认创建天空秘境地图？')) {
                                creat('QmcsGEY8cmzDBKVpg6zWbzWj59v1hkWkua28HcdGtRtMUN', '天空秘境');
                            }
                        }),
                        '糖豆人：终极淘汰赛': (() => {
                            if (confirm('确认创建糖豆人：终极淘汰赛地图？')) {
                                creat('QmbymrpmGQ7EddgMg31KJkQayMYMsnqxSH3BwcraAUBxuE', '糖豆人：终极淘汰赛');
                            }
                        }),'奇幻世界': (() => {
                            if (confirm('确认创建奇幻世界地图？')) {
                                creat('QmPa4bGR9iwRBt8y3SiRrAH16t5KKxcQciDGr45TinhMJt', '奇幻世界');
                            }
                        }),'梗明星大乱斗': (() => {
                            if (confirm('确认创建梗明星大乱斗地图？')) {
                                creat('QmengnaxUPvfSBXC7QdFH6zdTbbBWAWfrjp7Rqrp7qSUZC', '梗明星大乱斗');
                            }
                        }),"hash相关": () => {
                            addwindow("什么是Hash？", "Hash，又名哈希值，是一个以Qm开头再加上一些随机大小写字母、数字组成的Key字串符\n在Box3，许多的文件都是以一个Hash来储存在一个核心文件夹里，\n那个核心文件夹就是static.box3.codemao.cn/block/。\n拿到了文件Hash之后，把Hash粘贴到核心文件夹链接的后面，然后就可以访问文件里面的内容了。\n当然，也可以加上扩展名（例如音乐就是.mp3，图片就是.png）", 500)
                        },"使用hash值建造": () => {
                            var dialogs = addwindow("建造Hash", "在输入框里输入文件内容，然后点击建造\n当然你也可以上传文件并建造", document.documentElement.clientWidth - 180);
                            var div1 = addhtml(dialogs.dialog, "div", { class: "div" }, "");
                            var div2 = addhtml(dialogs.dialog, "div", { class: "div" }, "");
                            var input = addhtml(div2, "textarea", { style: "width:100%;height:" + (document.documentElement.clientHeight / 2) + "px;background:#0000;color:#fff;outline: none;resize: vertical;padding:10px;margin-top:10px;max-height:" + (document.documentElement.clientHeight - 350) + 'px;min-height:100px;' }, "")
                            addhtml(div1, "button", {}, "粘贴文本").onclick = async () => { input.value = await navigator.clipboard.readText(); }
                            addhtml(div1, "button", {}, "建造").onclick = async () => {
                                var xhr = new XMLHttpRequest()
                                xhr.open("POST", "https://static.box3.codemao.cn/block/")
                                xhr.onreadystatechange = () => {
                                    if (xhr.status == 200 && xhr.readyState == 4) {
                                        var d3 = addhtml(dialogs.dialog, "div", { class: "div" }, ``);
                                        addhtml(d3, "span", {}, "建造成功！Hash：")
                                        addhtml(d3, "span", { style: "margin-right:10px" }, JSON.parse(xhr.response)["Key"]);
                                        var fjcg = () => { var a = addhtml(dialogs.dialog, "div", { class: "div" }, "复制成功！"); setTimeout(() => { a.remove() }, 2000) }
                                        addhtml(d3, "button", {}, "复制").onclick = async () => { navigator.clipboard.writeText(JSON.parse(xhr.response)["Key"]); fjcg() }
                                        addhtml(d3, "button", {}, "在新标签页中打开").onclick = async () => { window.open("https://static.box3.codemao.cn/block/" + JSON.parse(xhr.response)["Key"]) }
                                        addhtml(d3, "button", {}, "关闭").onclick = async () => { d3.remove() }
                                    }
                                }
                                xhr.send(input.value)
                            }
                        },
                        "创作星空树":()=>{
                            var shequWorkId = window.location.pathname;
                            shequWorkId = shequWorkId.substring(shequWorkId.lastIndexOf('/') + 1, shequWorkId.length);
                            window.open(`https://shequ.codemao.cn/tree/${shequWorkId}`)
                        },
                        "pg数据库使用教程":async()=>{
                            window.open(`https://demo.hedgedoc.org/s/AHrRtpgBv`)
                        },
                        "无功能":()=>{},"回到原版神岛首页":()=>{location.href="https://box3.codemao.cn/"},
                        "清空聊天区":()=>{
                            if(nowmode=="Play"){
                                document.func.state.box3.state.chat.log=[]
                            }else if(nowmode="Edit"){
                                toolfunc3.state.box3.state.chat.log=[]
                            }
                        },
                        "GBK":()=>{
                            try{
                                var pre=document.querySelector('pre');
                                var rep=confirm('即将修复，显示“？”的地方为信息丢失处，以永久损失无法恢复');
                                if(!rep)return;
                                pre.innerText=glabled_code_repair(pre.innerText);
                            }catch(e){
                                alert('修复失败，报错：'+e.message);
                                console.error('Repair Error:'+e);
                            }
                        },
                        "GBK?":()=>{
                            alert('在box3 static中，文字是用GBK编码储存的，而信息上传时却通常使用UTF-8。两种编码对一个汉字使用的编码数量不同，因此当解析出现误差时就会显示乱码');
                        },
                    }
                    var shijiao = {
                        '1':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 2
                        },
                        '2':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 0
                        },
                        '3':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 1
                        },
                        '4':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 3
                        },
                        '5':()=>{
                            document.func.state.box3.state.secret.replica.camera.mode = 4
                        },
                    }
                    if(window["CodemaoUltraDiv"]){window["CodemaoUltraDiv"].destroy();window["CodemaoUltraDiv"]=undefined}
                    tool = new lil.GUI({ title: `🧰 CodemaoUltra${/Play|Edit/.test(md)?("（"+md+"Mode）"):""}` });
                    const element = document.querySelector(".lil-gui.root");
 
 
 
 
                    document.tool = tool
                    /** @type {HTMLElement} */
                    const Tooltitle = tool.$title;
                    Tooltitle.style.cursor="all-scroll"
                    Tooltitle.onmousedown = (en) => {
                        setv(Tooltitle, "ox", en.offsetX)
                        setv(Tooltitle, "oy", en.offsetY)
                        document.onmousemove = (e) => {
                            tool.domElement.style.top = (e.clientY - en.offsetY) + "px"
                            tool.domElement.style.left = (e.clientX - en.offsetX) + "px"
                            CodemaoUltrasettings["left"]= (e.clientX - en.offsetX);
                            CodemaoUltrasettings["top"]= (e.clientY - en.offsetY);
                            CodemaoUltrasettings.save();
                        }
                    }
                    Tooltitle.onmouseup = () => { document.onmousemove = null; }
                    tool.domElement.style.userSelect = 'none';
                    tool.domElement.style.left = Number(CodemaoUltrasettings["left"]).toString()+'px';
                    tool.domElement.style.top=Number(CodemaoUltrasettings["top"]).toString()+"px";
                    element.style.setProperty("--primary-color", CodemaoUltrasettings["primaryColor"]);
                    element.style.setProperty(
                        "--border-radius",
                        CodemaoUltrasettings["borderRound"] ? "5px" : "0"
                    );
                    element.style.setProperty("--blur", CodemaoUltrasettings["blur"].toString() + "px");
                    element.style.setProperty("--primary-color", CodemaoUltrasettings["primaryColor"]);
                    element.style.setProperty("--primary-color", CodemaoUltrasettings["primaryColor"]);
                    window["CodemaoUltraDiv"]=tool;
                    var p25 = tool.addFolder('⚙️ CodemaoUltra设置').close();
                    p25.add(CodemaoUltrasettings, 'width', 200, document.documentElement.clientWidth-200, 1).name('工具栏长度').onFinishChange((e)=>{
                        tool.domElement.style.width=e+"px";
                        if(CodemaoUltrasettings.autoSave)CodemaoUltrasettings.save();
                    })
                    p25.add(CodemaoUltrasettings, 'blur', 0, 10, 1).name('背景模糊度').onFinishChange((e)=>{
                        element.style.setProperty("--blur", CodemaoUltrasettings["blur"].toString() + "px");
                        if(CodemaoUltrasettings.autoSave)CodemaoUltrasettings.save();
                    })
                    p25.addColor(CodemaoUltrasettings, "primaryColor").name("主题颜色").onChange((e)=>{
                        if(CodemaoUltrasettings.autoSave)CodemaoUltrasettings.save();
                    })
                    var jianshiqi = p25.addFolder('⚙️ 监视器设置').close();
                    jianshiqi.add(CodemaoUltrasettings, 'showmonitor').name('👁️‍🗨️ 显示监视器').onChange((e)=>{
                        statsDiv.domElement.style.display = e?"block":"none";
                        if(CodemaoUltrasettings.autoSave)CodemaoUltrasettings.save();
                    });
                    jianshiqi.add(CodemaoUltrasettings, 'monitorposition',{"左上角":0,"右上角":1,"右下角":2,"左下角":3}).name('监视器位置').onChange((e)=>{
                        var data =[
                            [0,null,0,null],
                            [0,null,null,0],
                            [null,0,null,0],
                            [null,0,0,null]
                        ]
                        statsDiv.domElement.style.top=typeof data[e][0]=="number"?data[e][0]+"px":"unset";
                        statsDiv.domElement.style.bottom=typeof data[e][1]=="number"?data[e][1]+"px":"unset";
                        statsDiv.domElement.style.right=typeof data[e][3]=="number"?data[e][3]+"px":"unset";
                        statsDiv.domElement.style.left=typeof data[e][2]=="number"?data[e][2]+"px":"unset";
                        if(CodemaoUltrasettings.autoSave)CodemaoUltrasettings.save();
                    });
                    jianshiqi.add(CodemaoUltrasettings, 'monitortm',10,100,1).name('👁️‍🗨️ 监视器不透明度').onChange((e)=>{
                        statsDiv.domElement.style.opacity = e/100;
                        if(CodemaoUltrasettings.autoSave)CodemaoUltrasettings.save();
                    });
                    p25.add(CodemaoUltrasettings, 'autoSave').name('💾 自动保存').onChange((e)=>{
                        if(CodemaoUltrasettings.autoSave)CodemaoUltrasettings.save();
                    });
                    p25.add(CodemaoUltrasettings, 'manualSave').name('💾 保存并刷新');
                    p25.add(CodemaoUltrasettings, 'del').name('❌ 删除保存的设置并刷新');
                    p25.add(CodemaoUltrasettings, 'reset').name('❌ 重置并刷新');
                    CodemaoUltrasettings.updateSettings();
                    var p1 = tool.addFolder('🔥 常用功能（Tools）');
                    if(/Play|Edit/.test(m)){
                        p25.close()
                        var p11 = p1.addFolder('✨ 地图（Map）');
                        var p111 = p11;
                        p111.add(datas, '地图信息').name('✨ 地图信息');
                        var p12 = p1.addFolder('✉️ 聊天（Chat）');
                        p12.add(datas, '发送长消息').name('✉️ 发送长消息');
                        p12.add(datas, '清空聊天区').name('❌ 清空聊天区');
                        var interval = setInterval(()=>{
                            var jianceduixiang =
                                (
                                    m=="Play"?
                                    document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.eventBackendURL:
                                    document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.language
                                );
                            if(!jianceduixiang){
                                if(window["CodemaoUltraDiv"]){window["CodemaoUltraDiv"].destroy();window["CodemaoUltraDiv"]=undefined}
                                clearInterval(interval);
                            }
                        },100);
                    }
                    var p2 = tool.addFolder('关于 当前版本：'+banben).close();
                    p2.add(datas, '作者').name('✨ 作者主页');
                    p2.add(datas, '更新').name('🆕 检查更新');
                    function returnTime(t) {
                        var nowTime = new Date(t)
                        return {
                            "年": nowTime.getFullYear(),
                            "月": nowTime.getMonth() + 1,
                            "日": nowTime.getDate(),
                            "周": '星期' + ['日', '一', '二', '三', '四', '五', '六'][Number(nowTime.getDay())],
                            "时": nowTime.getHours(),
                            "分": nowTime.getMinutes(),
                            "秒": nowTime.getSeconds()
                        }
                    }
                    if(/MapRead|MusicRead|ModelRead/.test(m)){
                        window["workcontent"] = await document.func.rpc.content.api.get({
                            type: "id",
                            data: {
                                contentId: Number(location.pathname.replace(location.pathname.substring(0,3), "")),
                                isPublic: true,
                                meshHash: location.pathname.substring(1,2)=="v"?true:false,
                                type: {g:1,v:2,m:3}[location.pathname.substring(1,2)],
                                userId: 0,
                            },
                        })
                        logs(workcontent)
                        var datas2 = {
                            "获取建造时间":()=>{
                                var t = returnTime(workcontent.created_at.valueOf())
                                addwindow("开始制作时间",`${t.年}月${t.月}月${t.日}日 ${t.周} ${(String(t.时).length==1?'0'+t.时:t.时)}:${(String(t.分).length==1?'0'+t.分:t.分)}:${(String(t.秒).length==1?'0'+t.秒:t.秒)}`)
                            },
                            "查看全面展示图":()=>{
                                var dialog = addwindow("查看展示图",`请选择一张：`).dialog
                                for(var a in workcontent.banner){
                                    var b = addhtml(dialog,"div",{class:"div",style:"font-size:13px"},"")
                                    var c = Number(a)+1
                                    addhtml(b,"span",{style:"margin-right:5px"},"第"+c+"张：")
                                    addhtml(b,"a",{href:"https://static.box3.codemao.cn/block/"+workcontent.banner[a],target:"_blank",style:"color:#fff;text-decoration: underline;"},workcontent.banner[a])
                                }
                            },
                            "查看高清封面":()=>{
                                window.open(`https://static.box3.codemao.cn/block/${workcontent.image}_cover_1024_1024.png`)
                            },
                        };
                    }
                    console.log('m:'+m)
                    console.log('md:'+md)
                    if(md == 'Play'){
                        tool.close()
                        userhuanchun=null
                        const settingsFolder = p1.addFolder("🎮 高级画质设定").close();
                        var VFXSettingsFolder = settingsFolder.addFolder("📈 视觉&性能").close();
                        var particleSettingsFolder = settingsFolder.addFolder("💻 后处理特效").close();
                        var postProcessSettingsFolder = settingsFolder.addFolder("🎵 音量合成器").close();
                        var cameraSettingsFolder = settingsFolder.addFolder("📷 摄像机控制").close();
                        var SFXSettingsFolder = settingsFolder.addFolder("✨ 实体粒子数量").close();
                        ;[//数据来源于box3++
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "resolutionScale", {
                                极低: 0.1,
                                非常低: 0.2,
                                低: 0.3,
                                中: 0.5,
                                高: 0.7,
                                较高: 0.8,
                                全高清: 1,
                                "超采样（1.1x）": 1.1,
                                "超采样（1.25x）": 1.25,
                                "超采样（1.5x）": 1.5,
                                "超采样（2.0x）": 2,
                                "超采样（2.5x）": 2.5,
                                "超采样（3.0x）": 3,
                                "超采样（4.0x）": 4
                            }).name("清晰度（重进生效）"),
                            VFXSettingsFolder.add(
                                document.func.state.uiState.settings,
                                "animationQuality",
                                {
                                    低: 0,
                                    中: 100,
                                    高: 200
                                },
                                1
                            ).name("动画质量"),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "drawDistance", {
                                非常近: 16,
                                近: 32,
                                中: 64,
                                远: 128,
                                较远: 256,
                                非常远: 512,
                                极远: 1024,
                                荒唐: 2048,
                                疯狂: 4096
                            }).name("视野距离"),
                            VFXSettingsFolder.add(
                                document.func.state.uiState.settings,
                                "cameraSensitivity",
                                0.01,
                                3,
                                0.01
                            ).name("视角灵敏度"),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "safeShaders").name(
                                "安全光影（追求极致效果请关闭）"
                            ),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "shadowResolution", {
                                关闭: 0,
                                极低: 128,
                                低: 512,
                                中: 1024,
                                高: 2048,
                                非常高: 4096
                            }).name("阴影质量"),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "gamma", 0, 2).name("伽马"),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "lowQualityTextures").name(
                                "低质量贴图"
                            ),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "hdSky").name("高清天空"),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "reflections").name("反射模式"),
                            VFXSettingsFolder.add(document.func.state.uiState.settings, "parallaxMap").name("视差贴图"),
                            VFXSettingsFolder.add(
                                document.func.state.uiState.settings,
                                "parallaxDistance",
                                1,
                                128,
                                0.1
                            ).name("视差距离"),
                            particleSettingsFolder.add(document.func.state.uiState.settings, "postprocess").name("启用后处理特效"),
                            particleSettingsFolder.add(document.func.state.uiState.settings, "depthOfField", {
                                关闭: 0,
                                低: 16,
                                中: 32,
                                高: 64,
                                散光: 128
                            }).name("景深强度"),
                            particleSettingsFolder.add(document.func.state.uiState.settings, "volumetricScattering").name("体积散射"),
                            particleSettingsFolder.add(document.func.state.uiState.settings, "bloom").name("荧光特效"),
                            particleSettingsFolder.add(document.func.state.uiState.settings, "fxaa").name("FXAA抗锯齿"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "masterMute").name("主音量静音"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "masterVolume", 0, 1, 0.01).name("主音量大小"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "effectsMute").name("音效静音"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "effectsVolume", 0, 1).name("音效音量"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "maxSoundEffects", 0, 100, 1).name("最大音效数量"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "uiMute").name("界面音效静音"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "uiVolume", 0, 1, 0.01).name("界面音效音量"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "musicMute").name("背景音乐静音"),
                            postProcessSettingsFolder.add(document.func.state.uiState.settings, "musicVolume", 0, 1, 0.01).name("背景音乐音量"),
                            SFXSettingsFolder.add(document.func.state.uiState.settings, "maxParticles", 0, 131052, 1).name(
                                "最大粒子数量"
                            ),
                            SFXSettingsFolder.add(
                                document.func.state.uiState.settings,
                                "maxParticleGroups",
                                0,
                                1024,
                                1
                            ).name("最大粒子组数量")
                        ].forEach((i) => i.onChange(()=>{getGameplayCore().setGameSettings(document.func.state.uiState.settings);}));
                        setInterval(()=>{
                            var a=document.querySelectorAll('._2x0RglLpha6lx9vdRMkP5r');
                            if(!a.length)return;
                            a.forEach(e=>{
                                if(e.children.length)return;
                                var k=e.innerText;
                                e.innerHTML=`<p style="user-select: text"></p>`;
                                e.children[0].innerText=k;
                            });
                        },100);
                    }else if(md=="Edit"){
                        tool.close()
                        userhuanchun=null
                        var p115 = p1.addFolder('界面显示');
                        p115.add(toolfunc3.state.box3.state, "hideUI").name("👁隐藏界面");
                        const _settingsFolder = p1.addFolder("🎮 高级画质设定").close();
                        var _VFXSettingsFolder = _settingsFolder.addFolder("📈 视觉&性能").close();
                        var _particleSettingsFolder = _settingsFolder.addFolder("💻 后处理特效").close();
                        var _postProcessSettingsFolder = _settingsFolder.addFolder("🎵 音量合成器").close();
                        var _cameraSettingsFolder = _settingsFolder.addFolder("📷 摄像机控制").close();
                        var _SFXSettingsFolder = _settingsFolder.addFolder("✨ 实体粒子数量").close();
                        ;[
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "resolutionScale", {
                                极低: 0.1,
                                非常低: 0.2,
                                低: 0.3,
                                中: 0.5,
                                高: 0.7,
                                较高: 0.8,
                                全高清: 1,
                                "超采样（1.1x）": 1.1,
                                "超采样（1.25x）": 1.25,
                                "超采样（1.5x）": 1.5,
                                "超采样（2.0x）": 2,
                                "超采样（2.5x）": 2.5,
                                "超采样（3.0x）": 3,
                                "超采样（4.0x）": 4
                            }).name("清晰度（重进生效）"),
                            _VFXSettingsFolder.add(
                                document.func.client.state.box3.state.settings,
                                "animationQuality",
                                {
                                    低: 0,
                                    中: 100,
                                    高: 200
                                },
                                1
                            ).name("动画质量"),
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "drawDistance", {
                                非常近: 16,
                                近: 32,
                                中: 64,
                                远: 128,
                                较远: 256,
                                非常远: 512,
                                极远: 1024,
                                荒唐: 2048,
                                疯狂: 4096
                            }).name("视野距离"),
                            _VFXSettingsFolder.add(
                                document.func.client.state.box3.state.settings,
                                "cameraSensitivity",
                                0.01,
                                3,
                                0.01
                            ).name("视角灵敏度"),
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "safeShaders").name(
                                "安全光影（追求极致效果请关闭）"
                            ),
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "shadowResolution", {
                                关闭: 0,
                                极低: 128,
                                低: 512,
                                中: 1024,
                                高: 2048,
                                非常高: 4096
                            }).name("阴影质量"),
                            __VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "gamma", 0, 2).name("伽马"),
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "lowQualityTextures").name(
                                "低质量贴图"
                            ),
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "hdSky").name("高清天空"),
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "reflections").name("反射模式"),
                            _VFXSettingsFolder.add(document.func.client.state.box3.state.settings, "parallaxMap").name("视差贴图"),
                            _VFXSettingsFolder.add(
                                document.func.client.state.box3.state.settings,
                                "parallaxDistance",
                                1,
                                128,
                                0.1
                            ).name("视差距离"),
                            _particleSettingsFolder.add(document.func.client.state.box3.state.settings, "postprocess").name("启用后处理特效"),
                            _particleSettingsFolder.add(document.func.client.state.box3.state.settings, "depthOfField", {
                                关闭: 0,
                                低: 16,
                                中: 32,
                                高: 64,
                                散光: 128
                            }).name("景深强度"),
                            _particleSettingsFolder.add(document.func.client.state.box3.state.settings, "volumetricScattering").name("体积散射"),
                            _particleSettingsFolder.add(document.func.client.state.box3.state.settings, "bloom").name("荧光特效"),
                            _particleSettingsFolder.add(document.func.client.state.box3.state.settings, "fxaa").name("FXAA抗锯齿"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "masterMute").name("主音量静音"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "masterVolume", 0, 1, 0.01).name("主音量大小"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "effectsMute").name("音效静音"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "effectsVolume", 0, 1).name("音效音量"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "maxSoundEffects", 0, 100, 1).name("最大音效数量"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "uiMute").name("界面音效静音"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "uiVolume", 0, 1, 0.01).name("界面音效音量"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "musicMute").name("背景音乐静音"),
                            _postProcessSettingsFolder.add(document.func.client.state.box3.state.settings, "musicVolume", 0, 1, 0.01).name("背景音乐音量"),
                            _SFXSettingsFolder.add(document.func.client.state.box3.state.settings, "maxParticles", 0, 131052, 1).name(
                                "最大粒子数量"
                            ),
                            _SFXSettingsFolder.add(
                                document.func.client.state.box3.state.settings,
                                "maxParticleGroups",
                                0,
                                1024,
                                1
                            ).name("最大粒子组数量")
                        ].forEach((i) => i.onChange(()=>{document.func.client._setGameSettings(document.func.client.state.box3.state.settings);}));
                        setInterval(()=>{
                            var a=document.querySelectorAll('.ewiWP7xeQi2lL41Slo6EY');
                            if(!a.length)return;
                            for(const i of a[0].children){
                                i.onclick=()=>{
                                    navigator.clipboard.writeText(i.innerText).then(()=>{
                                        alert('复制成功！');
                                    }).catch((err)=>{
                                        alert('复制失败！\n'+err);
                                    });
                                }
                            }
                        },100);
                        setInterval(()=>{
                            var a=document.querySelectorAll('._2x0RglLpha6lx9vdRMkP5r');
                            if(!a.length)return;
                            a.forEach(e=>{
                                if(e.children.length)return;
                                var k=e.innerText;
                                e.innerHTML=`<p style="user-select: text"></p>`;
                                e.children[0].innerText=k;
                            });
                        },100);
                    }
                    else if(md=="Works"){
                        userhuanchun=null
                        var p11111 = p1.addFolder('✨ 建造地图（Create Map）');
                        var p111111 = p11111.addFolder('✨ 巨大地图').close();
                        var p123111 = p11111.addFolder('✨ 特殊地图').close();

                        var nbmap = p11111.addFolder('⚠️私密地图（内部使用）').close();
                        nbmap.add(datas, '糖豆人：终极淘汰赛').name('建造 糖豆人：终极淘汰赛');
                        nbmap.add(datas, '奇幻世界').name('建造 奇幻世界');
                        nbmap.add(datas, '梗明星大乱斗').name('建造 梗明星大乱斗');

                        p111111.add(datas, '建造256256704地图').name('建造一个 256x256x704 巨大地图');
                        p111111.add(datas, '建造1024641024地图').name('建造一个 1024x64x1024 贼大地图');
                        p123111.add(datas, '赤碧城').name('建造一个 赤碧城');
                        p123111.add(datas, '故宫').name('建造一个 故宫');
                        p123111.add(datas, '黄鹤楼捉妖').name('建造一个 黄鹤楼捉妖');
                        p123111.add(datas, '天空秘境').name('建造一个 天空秘境');
                        //p123111.add(datas, '测试').name('测试');
                        //var p111113 = p11111.addFolder('✏️ 自定义建造').close();
                        
                        var secrethash = p11111.addFolder('hash建造').close();
                        secrethash.add(datas, '使用hash值建造').name('用您已知的hash值建造地图');
                        secrethash.add(datas, 'hash相关').name('什么是hash');
                        secrethash.add(datas, '盗取hash').name('如何获取地图的hash');

                        var hashcreatemapdata={
                            "hash":"QmcVLxG4LY3QSSrjgNE7W1WX5oK5imD9ZrxxsSRmjxtbmz",
                            "function":async()=>{
                                if(!confirm("💡 提示：确认创建？"))return
                                if((hashcreatemapdata["hash"].length!=46)||(hashcreatemapdata["hash"].startsWith("Qm")==false)){
                                    alert("💡 请问您这Hash保熟吗？（）")
                                    return
                                }
                                datas["建造hash地图"](hashcreatemapdata["hash"],"未激活地图（进入地图后即可激活）")
                            }
                        }
                        const zidingyiditujianzaomorenwenjiandata={
                            "audio/acceleration.mp3":{"contentId":0,"hash":"QmSwteVxeNU9wo6ymgwgZuaHRP4WsRmNtW8SfqcukTEUYe.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/airhorn.mp3":{"contentId":0,"hash":"QmXNeXPiGGHKbY6ho9fBSbW3pJbf5ZH8d4fgsW6ATYxF8k.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/boo.mp3":{"contentId":0,"hash":"QmRwZyCAkWmFXgdzGZs4XVvQYxSghKeHtoGfj1xdnWa71t.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/boy_hurt.mp3":{"contentId":0,"hash":"QmYWbKcqgVSgo5gXVwb7QcsYsFVtUP1KzLWvQsFce6RGVh.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/break_block.mp3":{"contentId":0,"hash":"QmTaUJ7bmi2nCh8VeDxFZpx6kaSXNjuDBuRRCQZravJ1Za.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/bubbles.mp3":{"contentId":0,"hash":"QmVjPHRvHYSsXQLogo2fShAy42b9X2fGbL5jj9yP1FvaWT.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/death.mp3":{"contentId":0,"hash":"QmS7GbdxuGWoUpT1cramd1dCnmrMCCF9FbAwmCupqJJJov.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/dive.mp3":{"contentId":0,"hash":"QmemkF2gMae2SkXYxffhQVQoh6KgmHkTugrDEGWkMcVXKh.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/door_close.mp3":{"contentId":0,"hash":"QmbQWUYC6UQ9MemR5SMpkv5jPyQ4sBqdZXYHdGkQ9ibkm6.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/door_open.mp3":{"contentId":0,"hash":"QmeBquf5Pm85K17vkiYdNNq2gdn9qWzR21iiqcZqC2FmcR.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/double_jump.mp3":{"contentId":0,"hash":"QmeD93k5DuPDer1TGyxdm3AaDZbr2fFDm8eZHb44W1Caxj.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/drama.mp3":{"contentId":0,"hash":"QmbicxPot1SWDYNmbLyqu3QUeuWEeh6QUf4mpcKn6h5cw2.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/electric.mp3":{"contentId":0,"hash":"QmQK4arKsnmq3AbksocurGdFaxAQNSTRyqV1mU5y68XAUs.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/elephant.mp3":{"contentId":0,"hash":"QmZyhpzSMB9fxsSiP278q7qKCEQEgRRRbKZMkbMtL5KNiN.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/explode.mp3":{"contentId":0,"hash":"QmZ1FQxWDWvaLL7vnsLyvxCdwKoHLJJZvtpdeVN9v5Yc4z.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/footstep.mp3":{"contentId":0,"hash":"QmZpcdh2Mw2fW13mgcj3L8NjbSYmZGa26kVqSVb8xvkEoG.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/girl_hurt.mp3":{"contentId":0,"hash":"QmPGWu34kmGE2E6qUsM5w671hTSh8ikeTt9LizA9ZDNjwF.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/gunshot.mp3":{"contentId":0,"hash":"Qmdt8zng4wHSGNxshdFQGpDExffRtgftLqqSRgBgQH8WG8.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/hit.mp3":{"contentId":0,"hash":"QmXpmb2gUXfGJ9iSqwtWXZMJzp6L8kJqS4HpsJCh4gdhDG.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/jump.mp3":{"contentId":0,"hash":"QmYjQtVHnDJHdfGkVb31YAQxR5Yh6jeZmb4M33VYexKGX1.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/land.mp3":{"contentId":0,"hash":"QmTSfa9fptd4pzVv2QswVCbtYC7oSAu12NkoMmDYfugo7w.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/laugh.mp3":{"contentId":0,"hash":"QmUAbAcxUVxTH9TLFFBQkUZdzH9QceeJqpSCNZA6TWcmrV.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/place_block.mp3":{"contentId":0,"hash":"QmfUZkKKdgXR3gPDq5SmTNnJfeWg6xa2dXse4WBqDZFdLK.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/player_spawn.mp3":{"contentId":0,"hash":"QmXMgCjudjq7QwXDieQTMriL9sqmL2s6tspCoUaSZzHDSp.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/punch.mp3":{"contentId":0,"hash":"QmR1WTyca2aQ1hAMr8n82ULiYPDpjnKSR3Z5qECsFeCr4F.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/rain.mp3":{"contentId":0,"hash":"QmPK3sGJiddn6nBeBu28oDnb5ua8N8uhNrKrMNbVEnLXvA.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/reach_goal.mp3":{"contentId":0,"hash":"QmXpuMoAAf1QRJkh45WdKe7zAUDRqYoVBnxw8Wjy3wfzNZ.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/reach_record_point.mp3":{"contentId":0,"hash":"QmbhfMPCDg15nQgKrZm9f5enXhXcD9H7YMErVskFZVEabd.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/rooster.mp3":{"contentId":0,"hash":"QmPq3p35GgwD94m5n5YtmA9rfeGz7m3CamAQ3VrZkEZuT9.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/sad_trombone.mp3":{"contentId":0,"hash":"QmRRaq2MC5yTJYpktAa1dCVQmgNeXRrShnEpfg3pxG4Rcw.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/scream.mp3":{"contentId":0,"hash":"QmWc7ef1m9Tc3mCXvkmr3TTCcc7tHr4uj2y9AP9U68RNMz.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/send_chat.mp3":{"contentId":0,"hash":"QmWvY461DpP47bGR6MNVqE4UtcKXuDhKGLJPHS42HgtR4z.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/splash.mp3":{"contentId":0,"hash":"QmSAXXFwAFTnZCrw4qEWC9qjSuAvktHbCc8Xufarb9gwVh.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/swim.mp3":{"contentId":0,"hash":"Qmd5krXxH5UREqB4Qy4bhjLDmhVerCugSmK9VeRwsW3Xzt.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/sword1.mp3":{"contentId":0,"hash":"QmdbtQxdisg7DP9d5pgCEfkNFUzuNoq3XYLKB5rCHRba43.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/sword2.mp3":{"contentId":0,"hash":"QmVZ3rruiSyN15QRNNbWruiZLRpNgFCAVbvEUUCfGWjQUJ.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/time_start.mp3":{"contentId":0,"hash":"QmZtC4RzLcaKdqp7Rab6yrbiMuWuo8uZqNRhH6svaWGcpY.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "audio/wolf.mp3":{"contentId":0,"hash":"QmeRsXcMUZLbLDySY5B7qqwkUWamkRvrTaQpK4ZqA5omro.mp3","ownerId":0,"previewImage":"","size":0,"type":6},
                            "lut/BleachBypass.lut":{"contentId":0,"hash":"QmXQhswZTrpCqTRd9w8M13u5n7tt3SbBf5JqhGJtFPcz83.lut","ownerId":0,"previewImage":"QmRqG785C5yEd7BDpxJg9U41yB4oNXXfAQZQfa7LGcg1oe.png","size":0,"type":3},
                            "lut/CandleLight.lut":{"contentId":0,"hash":"QmThZvKXdRd1fPkV8oPqzistrXogUPVyprsz4QiaRr6Jhu.lut","ownerId":0,"previewImage":"QmXBswvJgpVM5TLvvmx46zf1dZq3agKaUdVofGRxqfUxLZ.png","size":0,"type":3},
                            "lut/CoolContrast.lut":{"contentId":0,"hash":"Qmf6KJDCsKo2exAnRhix6XXRzAzaCnwNzCXJL1KG3RFmW5.lut","ownerId":0,"previewImage":"QmZCT5RRrjrcJNtQDF93wGmoJ1vCpsGsTFGtqSegp9Zc6z.png","size":0,"type":3},
                            "lut/DesaturatedFog.lut":{"contentId":0,"hash":"QmdtFy7R8TEAehdM3EPddWeSuxNbw5fbPoeDijDsYhbxUW.lut","ownerId":0,"previewImage":"QmcjsNiJxd7XjoGm9Ju88JJhi1NZsL4eRQsbU5umfyWhZE.png","size":0,"type":3},
                            "lut/Evening.lut":{"contentId":0,"hash":"QmZNQuwVcuNNMgNxq6QmRdqoRvF8kphWEBVyrvjK7GbM45.lut","ownerId":0,"previewImage":"QmUixXmrSFzqDhDusCjX21bNyrn2J12HzTsa6Ggbc6AubT.png","size":0,"type":3},
                            "lut/Fall.lut":{"contentId":0,"hash":"QmeBv9HyLmfCa9kRtx1xj6GTVeQiMTDmroJ4f1xWiyfA5C.lut","ownerId":0,"previewImage":"QmV58994bGvmrB59T3syqun3RCtvm3tiCcCHuqUFC8ou8M.png","size":0,"type":3},
                            "lut/Filmic.lut":{"contentId":0,"hash":"QmbPPdiNH1yk7gF9rnscRFb7sF58T4bNbVvLzj7BvXjxbP.lut","ownerId":0,"previewImage":"QmQeo3tQSoaVnXDRqGUzjumNAyGT9MhFcnHepKucz7VAhp.png","size":0,"type":3},
                            "lut/Filmic2.lut":{"contentId":0,"hash":"Qma3DTt6cPuvsv4f1JBKYfz396dBjpH5zbc6W5ChLJaMJw.lut","ownerId":0,"previewImage":"QmUc99VvgKCBYGHq1C9yQFocHSjDgApfRimDdkdrNmgqMt.png","size":0,"type":3},
                            "lut/Filmic3.lut":{"contentId":0,"hash":"QmQn5mb6q4QmsmEFCB2x7HBniA1HT8by8MG2iatS9hpige.lut","ownerId":0,"previewImage":"QmTY2TDMKPEBaxhVdhWyx6cizcZMoKZjLPz9yvVHBzwq3N.png","size":0,"type":3},
                            "lut/Filmic4.lut":{"contentId":0,"hash":"QmR8sJvk4wiVhJC8n4ZFFSX2wxcyYR6tDTkGko1hCEAeWD.lut","ownerId":0,"previewImage":"QmPXx4ykgqTXg6M6jVNZi9GXzVn721C4U3tb2dyLwXs3cT.png","size":0,"type":3},
                            "lut/Filmic5.lut":{"contentId":0,"hash":"QmaF1SRPHZKimfDEgmTEctWqJKV4bc4MT1HNaLnSSGnx5G.lut","ownerId":0,"previewImage":"QmbJv89S9Mayk96fjtpfrUZJu89wyGRy6vtPvh6QmxcDix.png","size":0,"type":3},
                            "lut/Filmic6.lut":{"contentId":0,"hash":"QmcSZZb2qj6yRGrPmMm6P7XSFJZ9hiEuVYK9vQLvWgj9Ac.lut","ownerId":0,"previewImage":"QmbAQyjea8CKA4SLThdgwyHbwCZG8na5pEA93qTSjH6M4u.png","size":0,"type":3},
                            "lut/Filmic7.lut":{"contentId":0,"hash":"QmeYCaG7EceuaJYLGXthdKZ99TRCwwkMTBiRsU6zvQEidX.lut","ownerId":0,"previewImage":"QmSXJz2EGb7QWF6ZfpFVyjoSGAwvwoiCiRsRJqXAxfZKRD.png","size":0,"type":3},
                            "lut/Filmic8.lut":{"contentId":0,"hash":"QmejgZqpZ39LtujCSrr2865VrpDNR2mcTfoYjkBmQUDDxq.lut","ownerId":0,"previewImage":"QmYbs8iNAHyX2tCfttRiFNqPF7epc5Rn9uvR4GHCNZtmsy.png","size":0,"type":3},
                            "lut/Filmic9.lut":{"contentId":0,"hash":"QmcBWUcLZ7nPfjowXc7ogRb2hhwEZxdsVEGFo3g4c79BgA.lut","ownerId":0,"previewImage":"QmR5c1KJN5w18cUAhPVsBs8m6DYHqJ5JQwCEy5nExJnavb.png","size":0,"type":3},
                            "lut/Greyscale.lut":{"contentId":0,"hash":"QmNu3tLkUj44aZEddDzS564aYbXzJZbM7nR7h39TZh2cJA.lut","ownerId":0,"previewImage":"QmdKuUZZeweVgpmFjhNavuy6wdA5Dq3wtX4unM42Dx6vNN.png","size":0,"type":3},
                            "lut/Hawaii.lut":{"contentId":0,"hash":"QmU64g94zZQHpmPwqfgJd87HDZ7hGyTDHqpsPMgWuA3z2Q.lut","ownerId":0,"previewImage":"QmQGySHKPbMFkUQ9QLtKBvXWw5dp9PVAuFa9Q1gr6D4fzx.png","size":0,"type":3},
                            "lut/HighContrast-Cold.lut":{"contentId":0,"hash":"QmfKTpefzVP11WnQSS1dLpWsc5EmHqEMUye28ZivrSny4V.lut","ownerId":0,"previewImage":"QmfQrau31MrxhKm8GBsK6r7kZoNepr4DoTZ4QyXUY3fd7e.png","size":0,"type":3},
                            "lut/Inverted.lut":{"contentId":0,"hash":"QmNtqgQvQ9nz6qcqPfVPa9PWTpjzgnaj8yqiS9WAnkBYQU.lut","ownerId":0,"previewImage":"QmTnfofTMFTXeqbeMhwrVzHqh6UFychRwKyjqaxcc97GYT.png","size":0,"type":3},
                            "lut/MatrixBlue.lut":{"contentId":0,"hash":"QmVBPffsHHRPz6rzyxPB2KiTvU8xr9u6CNHD27VPTYHPtr.lut","ownerId":0,"previewImage":"QmZSyV6Ki29Dx81Zx1afr1NpcczL8fNDPF8zwKP4h34eZe.png","size":0,"type":3},
                            "lut/MatrixGreen.lut":{"contentId":0,"hash":"QmYNy6MQrvUAXkTrAtsgkM53SirxoeDshpkmegDbocERGQ.lut","ownerId":0,"previewImage":"QmdhXbWDx3tTncdoDXVpj991EidbPqzgDLydymPszhoTtC.png","size":0,"type":3},
                            "lut/Neutral.lut":{"contentId":0,"hash":"Qmd6EtCsyVJuoLZPvEKneDm56rsWjPCex9DvdQZEGc76Tr.lut","ownerId":0,"previewImage":"QmYcKXKdSHpYLmg53zuybfD1gVpYY6GZxctiSYkCx6V7jo.png","size":0,"type":3},
                            "lut/Night1.lut":{"contentId":0,"hash":"QmYrSKX4J6Vmb8k9B9YiUU1RE9tnL4ruWxHYRsTZbe8Lu8.lut","ownerId":0,"previewImage":"QmXdCmba6a7Cd34xnCyvKo56EvZAoVnrygnm7LWKWBwJ3T.png","size":0,"type":3},
                            "lut/Night2.lut":{"contentId":0,"hash":"QmRZLYtrtBadbgeZvLtBbwheXjhK1GkPyhuXKRwtGqRpiS.lut","ownerId":0,"previewImage":"QmUvfm8gS7Bcqsn7h2Vz1vxkR2FioDmtcnAvUe4ezWrDEn.png","size":0,"type":3},
                            "lut/Night_Dark.lut":{"contentId":0,"hash":"QmSiyA9gDzgNtXuUHrHGbqrgQe1DZWcMztfUECgPw7YfcY.lut","ownerId":0,"previewImage":"QmRNsQRyeRSHmXnWqnpcda5pBHC6CyrZho1MfJr8S4sh2q.png","size":0,"type":3},
                            "lut/Overexpose.lut":{"contentId":0,"hash":"QmYikfDdu7rmH6qHtcQ4y5Bq8D2yAAitfgmevkGivxe9um.lut","ownerId":0,"previewImage":"QmVg6LGLFqtd5WKykXC2h7xJzQajCr989UydYwDSdnxd2o.png","size":0,"type":3},
                            "lut/Psychedelic.lut":{"contentId":0,"hash":"QmdpLCgSN6kFQp6ueUqPzypVzLzyFpAegLCduvUdewEVyq.lut","ownerId":0,"previewImage":"QmRMMx3qRzonrbZ5C9wGPzua6DKycrHp8pLcCCkSVaw5tH.png","size":0,"type":3},
                            "lut/SinCity.lut":{"contentId":0,"hash":"QmevW17o6xjjoayFiB9HFuHwWJyDFzQP3BEAawZeHJvJBY.lut","ownerId":0,"previewImage":"QmdKuUZZeweVgpmFjhNavuy6wdA5Dq3wtX4unM42Dx6vNN.png","size":0,"type":3},
                            "lut/StrongAmber.lut":{"contentId":0,"hash":"QmWqWMcnZshR6LRQmrdxrryyQG4ZPgPgYy2aimVu2uEKXo.lut","ownerId":0,"previewImage":"QmZndMabLKGM8vTojgBfM8ZX8oezB8XPkgCevQVLdWpAXP.png","size":0,"type":3},
                            "lut/Warm.lut":{"contentId":0,"hash":"QmUJQLotrDc7dJ8XcqmSuGGP17oCh24S42EHA9ADaM2ZF2.lut","ownerId":0,"previewImage":"QmVWqSf3mkBKRiAPuHVA6iccbo3UwimLDasq6xpp96B6Mw.png","size":0,"type":3},
                            "lut/WarmContrast.lut":{"contentId":0,"hash":"QmbKsxWrMtmuHonyj3QaHrmgaHLeYEvkYTXh4KJ6azqFyC.lut","ownerId":0,"previewImage":"QmXRf98kvpQAvtqEHBU8JNLSDScZTiSP9CJbiRKhKRWozj.png","size":0,"type":3},
                            "mesh/车.vb":{"contentId":0,"hash":"QmVXRbe6RzFrXoLRFwZK31C6psUKR35iQo7sckKvAg8JCo","ownerId":0,"previewImage":"QmRpiNug59R1bK976BaqCrA9mTFEKZBYT9JknyyG9gm7Eo.png","size":0,"type":2},
                            "snow/bubble.part":{"contentId":0,"hash":"QmVS8V24MEkunywvzGKHc98gVb9rdKTC4QnBwqGEVr7JRG.png","ownerId":0,"previewImage":"QmVS8V24MEkunywvzGKHc98gVb9rdKTC4QnBwqGEVr7JRG.png","size":0,"type":4},
                            "snow/dandelion.part":{"contentId":0,"hash":"QmfShzFgtRN17cgVUbyZGdg4WeYwx6JCf7a5uM9iYneiAj.png","ownerId":0,"previewImage":"QmfShzFgtRN17cgVUbyZGdg4WeYwx6JCf7a5uM9iYneiAj.png","size":0,"type":4},
                            "snow/heart.part":{"contentId":0,"hash":"QmZAvaeryktujrDAuoks42Lm2xuKZ4oupARyjHHQCxwGhf.png","ownerId":0,"previewImage":"QmZAvaeryktujrDAuoks42Lm2xuKZ4oupARyjHHQCxwGhf.png","size":0,"type":4},
                            "snow/leaf.part":{"contentId":0,"hash":"QmWnbtsWV8L6azXHyJr4ckjywpF5yQSW2rZfwo4XG2DW6X.png","ownerId":0,"previewImage":"QmWnbtsWV8L6azXHyJr4ckjywpF5yQSW2rZfwo4XG2DW6X.png","size":0,"type":4},
                            "snow/maple.part":{"contentId":0,"hash":"QmWokmZPstZNMtQ1zqihh4vbBpeA7TgsPUVbY2Vi5JEW32.png","ownerId":0,"previewImage":"QmWokmZPstZNMtQ1zqihh4vbBpeA7TgsPUVbY2Vi5JEW32.png","size":0,"type":4},
                            "snow/sakura.part":{"contentId":0,"hash":"QmZxg6x9D8wU5nd5SvQnrKHUnYYFAn62YGdvjA3Jhu89FQ.png","ownerId":0,"previewImage":"QmZxg6x9D8wU5nd5SvQnrKHUnYYFAn62YGdvjA3Jhu89FQ.png","size":0,"type":4},
                            "snow/snow.part":{"contentId":0,"hash":"QmUQspcsShnTNzuPzfoWAaHXgrUQnrv8VeYkBauimUC2L3.png","ownerId":0,"previewImage":"QmUQspcsShnTNzuPzfoWAaHXgrUQnrv8VeYkBauimUC2L3.png","size":0,"type":4},
                            "snow/snow2.part":{"contentId":0,"hash":"QmYr3zNUZqWLSYpVXrwZneGhmCdq8FozdxqVVtGjTUU9eq.png","ownerId":0,"previewImage":"QmYr3zNUZqWLSYpVXrwZneGhmCdq8FozdxqVVtGjTUU9eq.png","size":0,"type":4},
                            "snow/snow3.part":{"contentId":0,"hash":"Qmbcp4GCzYPsZHRJzCM8biFncos44cGrKLbUPqcHQxfZ4X.png","ownerId":0,"previewImage":"Qmbcp4GCzYPsZHRJzCM8biFncos44cGrKLbUPqcHQxfZ4X.png","size":0,"type":4},
                            "snow/star.part":{"contentId":0,"hash":"QmU3DEHFUCjzZJVibiscZ9SaebFMpWHcfNdXuncpDqyr9A.png","ownerId":0,"previewImage":"QmU3DEHFUCjzZJVibiscZ9SaebFMpWHcfNdXuncpDqyr9A.png","size":0,"type":4}
                        }
                        var zidingyiditujianzaodata={
                            x:256,
                            y:256,
                            z:704,
                            pg:false,
                            indexjsname:"index",
                            player:{
                                allowAction0:true,
                                allowAction1:true,
                                allowDoubleJump:true,
                                allowFlight:false,
                                allowJump:true,
                                allowMove:true,
                                cameraType:"follow",
                                color:[1,1,1],
                                invisible:false,
                                noClip:false,
                                enabledDamage:false,
                                hp:100,
                                maxHp:100,
                                showHealthBar:true,
                                scale:1,
                                shininess:0,
                                showName:true,
                            },
                            files:Object.assign(zidingyiditujianzaomorenwenjiandata,Object.create({})),
                            hasfog:true,
                            async tips(){
                                await alert("x、y、z必须都是32的倍数\n地形的尺寸x,y,z各个乘起来的积\n不能小于32768（32x32x32）；\n为了神岛服务器的健康，\n也不能太大。\n本自定义功能太高级，点击后等待约20s才能完成数据合成、开始建造，请注意浏览器弹窗")
                            },
                            async func(){
                                zidingyiditujianzaodatacreatebtn.disable()
                                var{x,y,z,pg,indexjsname,player:playersettings,hasfog,files:mapfilesdatas}=this
                                if(!x||!y||!z){
                                    alert("💡 神岛还不支持这么小的地形呢（）");
                                    zidingyiditujianzaodatacreatebtn.disable(false);return
                                }
                                if(x*y*z<32768){
                                    alert("💡 神岛还不支持这么小的地形呢（）");
                                    zidingyiditujianzaodatacreatebtn.disable(false);return
                                }
                                var chunks=[],
                                    xx=x/32,
                                    yy=y/32,
                                    zz=z/32;
                                try{
                                    for (let i = 1; i < zz; i++) {
                                        chunks = chunks.concat(new Array(xx - 1).fill('"QmY4M7B58dARVAJyYf7aonuGjNnaUFUusCQXq9tmifLEKY"'));
                                        chunks.push('"Qmcoad9FnMdKGbxn5ifLdCaivVi6T7E2bmDVAdJbwuRD2a"');
                                        chunks = chunks.concat(new Array((yy - 1) * xx).fill('"QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU"'));
                                    }
                                    chunks = chunks.concat(new Array(xx - 1).fill('"QmaCUNCe7XDEnXJqprgikquGk6H5nkMegxi77h2aaRyc2b"'));
                                    chunks.push('"QmX49DZMGEY9ANyzfbrWhiEKk1hkz9SRpFn2NTKMRUjQzj"');
                                    chunks = chunks.concat(new Array((yy - 1) * xx).fill('"QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU"'));
                                    const voxels = `{"chunks": [${chunks}],"shape": {"x": ${x},"y": ${y},"z": ${z}}}`;
                                    fetch("https://static.box3.codemao.cn/block/",{ method: 'POST', body: voxels }).then((xhr)=>{return xhr.json()}).then(async(xhr)=>{
                                        const playersettingshash = await fetch("https://static.box3.codemao.cn/block/",{ method: 'POST', body: JSON.stringify({
                                            "allowAction0":playersettings.allowAction0,
                                            "allowAction1":playersettings.allowAction1,
                                            "allowDoubleJump":playersettings.allowDoubleJump,
                                            "allowFlight":playersettings.allowFlight,
                                            "allowJump":playersettings.allowJump,
                                            "allowMove":playersettings.allowMove,
                                            "cameraType":playersettings.cameraType,
                                            "color":playersettings.color,
                                            "colorLUT":"",
                                            "crouchAcceleration":0.09,
                                            "crouchSpeed":0.1,
                                            "damage":{
                                                "enabled":playersettings.enabledDamage,
                                                "hp":playersettings.hp,
                                                "maxHp":playersettings.maxHp,
                                                "showDamage":true,
                                                "showHealth":playersettings.showHealthBar,
                                            },
                                            "doubleJumpPower":0.9,
                                            "emissive":0,
                                            "flyAcceleration":2,
                                            "flySpeed":2,
                                            "friction":0,
                                            "initialPosition":{"x":x/2,"y":y,"z":z/2},
                                            "initialYaw":0,
                                            "invisible":playersettings.invisible,
                                            "jumpAccelerationFactor":0.55,
                                            "jumpPower":0.96,
                                            "jumpSpeedFactor":0.85,
                                            "mass":1,
                                            "metalness":0,
                                            "movementBounds":{
                                                "hi":{"x":x+50,"y":y+50,"z":z+50},
                                                "lo":{"x":-50,"y":-50,"z":-50}
                                            },
                                            "noClip":playersettings.noClip,
                                            "playerSounds":{
                                                "action0":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},
                                                "action1":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},
                                                "crouch":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},
                                                "doubleJump":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/double_jump.mp3"},
                                                "endFly":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},
                                                "enterWater":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/dive.mp3"},
                                                "jump":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/jump.mp3"},
                                                "land":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/land.mp3"},
                                                "leaveWater":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/splash.mp3"},
                                                "music":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":0,"sample":""},
                                                "spawn":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/spawn.mp3"},
                                                "startFly":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""},
                                                "step":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0.20000000298023224,"radius":32,"sample":"audio/step.mp3"},
                                                "swim":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/swim.mp3"}
                                            },
                                            "restitution":0,
                                            "runAcceleration":0.35,
                                            "runSpeed":0.4,
                                            "scale":playersettings.scale,
                                            "shininess":playersettings.shininess,
                                            "showName":playersettings.showName,
                                            "sounds":{
                                                "chat":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/chat.mp3"},
                                                "die":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/die.mp3"},
                                                "hurt":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":"audio/hurt.mp3"},
                                                "interact":{"gain":1,"gainRange":0,"pitch":1,"pitchRange":0,"radius":32,"sample":""}
                                            },
                                            "swimAcceleration":0.1,
                                            "swimSpeed":0.4,
                                            "walkAcceleration":0.19,
                                            "walkSpeed":0.22
                                        })}).then((xhr)=>{return xhr.json()});
                                        const scriptIndexName={}
                                        scriptIndexName[`${indexjsname}.js`]={
                                            "contentId":0,
                                            "hash":"QmZXxG29m8tpGbwZNqymN9S5CG6MW7hPXoa6utazYMkDpU",
                                            "ownerId":0,
                                            "previewImage":"",
                                            "size":12,
                                            "type":1
                                        }
                                        const scriptAssetsss = await fetch("https://static.box3.codemao.cn/block/",{ method: 'POST',body:JSON.stringify(scriptIndexName)}).then((xhr)=>{return xhr.json()});
                                        const filesdatashash = await fetch("https://static.box3.codemao.cn/block/",{ method: 'POST',body:JSON.stringify(mapfilesdatas)}).then((xhr)=>{return xhr.json()});
                                        if(xhr.errormessage){alert("💡 请求出错！");zidingyiditujianzaodatacreatebtn.disable(false);return}
                                        var voxelshash=xhr["Key"];
                                        fetch("https://static.box3.codemao.cn/block/",{ method: 'POST', body: JSON.stringify(
                                            {
                                                ambientSound: "QmcNbLSSQfVcDpH9jSX38RSVrL1SZK3vNMZwaP7cMkKqvY",
                                                assets: filesdatashash.Key,
                                                collisionFilter: [],
                                                committerId: 0,
                                                deleteAssets: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
                                                editRoot: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
                                                entities: "QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK",
                                                environment: hasfog?"QmRC98696VxEVsScYsChTzU2uDguFBboruxKYhwtFnAPK7":"QmZGRD8taN5sZxQaaVUdXcqz1XfX113EwiSbdt9QdPRNPo",
                                                features: {enableTriggerAPI: true},
                                                folders: "QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK",
                                                info: "QmXNsFZxmhdfyMbdc6BaoDgkfWAjgbPGrps3UNk3tJLNiR",
                                                physics: "QmTzt6Z6Mm11NQjTeXspDMJtddzDadzwhgwfWUtNG5XCrD",
                                                player: playersettingshash.Key,
                                                prevHash: "QmP2c7LxFD2j2EBk6inaDhhBE2DuuQ2TLtJRNpKXLyvbuL",
                                                scriptAssets: scriptAssetsss.Key,
                                                scriptIndex: indexjsname+".js",
                                                storageMode: (pg?`pg`:`sqlite`),
                                                timestamp: new Date().toJSON(),
                                                type: "project",
                                                version: "0.3.11",
                                                voxels: voxelshash,
                                                zones: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
                                            }
                                        )}).then((xhr)=>{return xhr.json()}).then((xhr)=>{
                                            var hash=xhr["Key"];
                                            console.log(xhr,hash)
                                            if(xhr.errormessage){alert("💡 请求出错！");zidingyiditujianzaodatacreatebtn.disable(false);return}
                                            datas["建造hash地图"](hash,"自定义地图");
                                            zidingyiditujianzaodatacreatebtn.disable(false)
                                        });
                                    });
                                }catch(e){
                                    alert("💡 数值太大或建造出错！")
                                    zidingyiditujianzaodatacreatebtn.disable(false)
                                }
                            }
                        }
                        Object.assign({hashcreatemapdata,zidingyiditujianzaodata},CodemaoUltra)
                        var q4KVLbQ4O9=p111113.addFolder("地形");
                        var dc86r5v6f7=p111113.addFolder("数据库").close();
                        var DEr1Ga3oje=p111113.addFolder("玩家").close();
                        //var Dn2U1DM08b=p111113.addFolder("天气").close();
                        var A7l24720gX=p111113.addFolder("代码").close();
                        var filef_9VIw3lUaTf=p111113.addFolder("文件").close();
                        var filef_9VIw3lUaTf_data={
                            selecteds:[],
                            c_data_v36LBuuXL7fS_k:[],
                            deleteallselect(dd,cals){
                                if(confirm("确认？")){
                                    this.selecteds.forEach((v)=>{
                                        delete zidingyiditujianzaodata.files[v];
                                    })
                                    this.reload(dd,cals);
                                }
                            },
                            createImg(...config){
                                const filee = addhtml(document.body, "input", { style: "display:none", type: 'file', accept: "image" }, "");
                                filee.click()
                                const svvawf = this
                                filee.onchange = function () {
                                    filee.remove();
                                    var file = this.files[0];
                                    if (!file) return;
                                    if (/image\/\w+/.test(file.type)) {
                                        var reader = new FileReader();
                                        reader.onload = () => {
                                            const s = addwindow("图片设置","",500);
                                            const dd = s.dialog;
                                            const d1 = addhtml(dd,"div",{class:"div"},"");
                                            addhtml(d1,"span",{},"长度");
                                            const i1 = addhtml(d1,"input",{type:"number",style:"width:50px",value:"100"},"");
                                            addhtml(d1,"span",{},"宽度");
                                            const i2 = addhtml(d1,"input",{type:"number",style:"width:50px",value:"100"},"");
                                            const d12 = addhtml(dd,"div",{class:"div"},"");
                                            addhtml(d12,"span",{},"文件名");
                                            const i5 = addhtml(d12,"input",{type:"text",value:"image"},"");
                                            const d2 = addhtml(dd,"div",{class:"div"},"");
                                            const b1 = addhtml(d2,"button",{},"上传并添加");
                                            b1.onclick=(async()=>{
                                                s.closeDisabled(1);
                                                const filesname=i5.value;
                                                const data = {"data":"","height":Number(i2.value),"width":Number(i1.value)};
                                                d1.remove();
                                                d2.remove();
                                                d12.remove();
                                                const d3 = addhtml(dd,"div",{class:"div"},"正在上传图片");
                                                const datahash = await fetch("https://static.box3.codemao.cn/block/",{ method: 'POST', body: new Blob([reader.result]) }).then((xhr)=>{return xhr.json()});
                                                sett(d3,"正在上传数据");
                                                data.data=datahash.Key;
                                                const imgdatahash = await fetch("https://static.box3.codemao.cn/block/",{ method: 'POST', body: JSON.stringify(data) }).then((xhr)=>{return xhr.json()});
                                                sett(d3,"正在添加到自定义地图文件");
                                                const filn=/.+\/(.+)/.exec(file.type)[1];
                                                zidingyiditujianzaodata.files["image/"+filesname+"."+filn]={"contentId":0,"hash":imgdatahash.Key,"ownerId":0,"previewImage":datahash.Key+"."+filn,"size":0,"type":5}
                                                sett(d3,"完成");
                                                s.closeDisabled(0);
                                                s.close();
                                                svvawf.reload(...config);
                                            });
                                        };
                                        reader.readAsText(file,"UTF-8");
                                    } else {
                                        alert("文件格式错误！")
                                    }
                                }
                            },
                            manage(){
                                const s = addwindow("管理文件","管理自定义地图的文件",document.documentElement.clientWidth-180);
                                const dd = s.dialog;
                                const o0B88tD4h7w5 = this;
                                var d1 = addhtml(dd,"div",{class:"div"},"");
                                var alllselect=addhtml(d1,"input",{type:"checkbox",style:"margin-right:10px;"},"");
                                this.alllselect_u3Ec8pyfM3g1=alllselect;
                                this.savagwe=addhtml(d1,"span",{},"已选择");
                                this.savagwes=addhtml(d1,"b",{},"0");
                                this.savagwew=addhtml(d1,"span",{style:"margin-right:10px;"},"个");
                                this.savagwe.style.display="none";
                                this.savagwes.style.display="none";
                                this.savagwew.style.display="none";
                                alllselect.onchange=function(){
                                    if(this.checked){
                                        this.indeterminate=false
                                        o0B88tD4h7w5.selecteds=o0B88tD4h7w5.c_data_v36LBuuXL7fS_k.map((v)=>{v.checked=true;return v.getAttribute("value")});
                                        o0B88tD4h7w5.savagwe.style.display="none";
                                        o0B88tD4h7w5.savagwes.style.display="";
                                        o0B88tD4h7w5.savagwew.style.display="none";
                                        o0B88tD4h7w5.deletebtn.style.display="";
                                        o0B88tD4h7w5.savagwes.style.marginRight="10px";
                                        sett(o0B88tD4h7w5.savagwes,"全选")
                                    }else{
                                        o0B88tD4h7w5.selecteds=[];
                                        o0B88tD4h7w5.c_data_v36LBuuXL7fS_k.forEach((v)=>{v.checked=false;});
                                        this.indeterminate=false
                                        o0B88tD4h7w5.savagwe.style.display="none";
                                        o0B88tD4h7w5.savagwes.style.display="none";
                                        o0B88tD4h7w5.savagwew.style.display="none";
                                        o0B88tD4h7w5.deletebtn.style.display="none";
                                        o0B88tD4h7w5.savagwes.style.marginRight="";
                                    }
                                }
                                var d2 = addhtml(dd,"div",{class:"sbxdiv"},"");
                                addhtml(d1,"button",{},"刷新").onclick=(()=>{
                                    this.reload(d2,alllselect);
                                });
                                addhtml(d1,"button",{},"上传图片").onclick=(()=>{
                                    this.createImg(d2,alllselect);
                                });
                                this.deletebtn=addhtml(d1,"button",{},"删除")
                                this.deletebtn.onclick=(()=>{
                                    this.deleteallselect(d2,alllselect);
                                });
                                this.reload(d2,alllselect);
                                addhtml(dd,"style",{},`.sbxdiv {max-height: ${document.documentElement.clientHeight-150}px;overflow: auto;}.sbxdiv::-webkit-scrollbar {height: 5px;width: 5px;}.sbxdiv::-webkit-scrollbar-thumb {background: #aaa5;border-radius: 50px}.sbxdiv::-webkit-scrollbar-thumb:hover {background: #aaa;}.sbxdiv::-webkit-scrollbar-thumb:active {background: #aaa3;}.sbxdiv::-webkit-scrollbar-track {background: #0000;border-radius: 50px}`)
                            },
                            listsGetSortCompare(type, direction) {
                                var compareFuncs = {
                                    'NUMERIC': function(a, b) {
                                        return Number(a) - Number(b); },
                                    'TEXT': function(a, b) {
                                        return a.toString() > b.toString() ? 1 : -1; },
                                    'IGNORE_CASE': function(a, b) {
                                        return a.toString().toLowerCase() > b.toString().toLowerCase() ? 1 : -1; },
                                };
                                var compare = compareFuncs[type];
                                return function(a, b) { return compare(a, b) * direction; };
                            },
                            reload(dd,cals){
                                this.selecteds=[];
                                seth(dd,"");
                                const data = zidingyiditujianzaodata.files;
                                const targw = this;
                                targw.savagwe.style.display="none";
                                targw.savagwes.style.display="none";
                                targw.savagwew.style.display="none";
                                targw.savagwes.style.marginRight="";
                                targw.deletebtn.style.display="none";
                                targw.alllselect_u3Ec8pyfM3g1.indeterminate=false;
                                targw.alllselect_u3Ec8pyfM3g1.checked=false;
                                const sorts = Object.keys(data).slice().sort(targw.listsGetSortCompare("TEXT", 1));;
                                for(let s of sorts){
                                    var dw= addhtml(dd,"div",{class:"div"},"");
                                    var sssss = addhtml(dw,"label",{style:"margin-right:10px;"},"");
                                    var sssfasasvaw=addhtml(sssss,"input",{type:"checkbox",value:s,style:"margin-right:10px;"},"")
                                    targw.c_data_v36LBuuXL7fS_k.push(sssfasasvaw)
                                    sssfasasvaw.onchange=function(){
                                        if(this.checked){
                                            targw.selecteds.push(this.getAttribute("value"))
                                        }else{
                                            targw.selecteds.splice(targw.selecteds.indexOf(this.getAttribute("value")),1)
                                        }
                                        if(targw.selecteds.length==targw.c_data_v36LBuuXL7fS_k.length){
                                            cals.checked=true
                                            cals.indeterminate=false
                                            targw.savagwe.style.display="none";
                                            targw.savagwes.style.display="";
                                            targw.savagwew.style.display="none";
                                            targw.deletebtn.style.display="";
                                            targw.savagwes.style.marginRight="10px";
                                            sett(targw.savagwes,"全选")
                                        }else if(targw.selecteds.length==0){
                                            cals.checked=false
                                            cals.indeterminate=false
                                            targw.savagwe.style.display="none";
                                            targw.savagwes.style.display="none";
                                            targw.savagwew.style.display="none";
                                            targw.savagwes.style.marginRight="";
                                            targw.deletebtn.style.display="none";
                                        }else{
                                            cals.checked=false
                                            cals.indeterminate=true
                                            targw.savagwe.style.display="";
                                            targw.savagwes.style.display="";
                                            targw.savagwew.style.display="";
                                            targw.savagwes.style.marginRight="";
                                            targw.deletebtn.style.display="";
                                            sett(targw.savagwes,targw.selecteds.length)
                                        }
                                    };
                                    addhtml(sssss,"span",{},s);
                                    addhtml(dw,"button",{},"重命名").onclick=(()=>{
                                        const wdas = /(.+)\/.+\..+/.exec(s)[1];
                                        const kuozhanm = /.+\/.+(\..+)/.exec(s)[1];
                                        const yuam = /.+\/(.+)\..+/.exec(s)[1];
                                        const jieshup = prompt("请输入新名字",yuam)
                                        if(jieshup){
                                            const yuanlaideshia = Object.assign(data[s],Object.create({}));
                                            delete zidingyiditujianzaodata.files[s];
                                            yuanlaideshia.size=jieshup.length;
                                            zidingyiditujianzaodata.files[wdas+"/"+jieshup+kuozhanm]=Object.assign(yuanlaideshia,Object.create({}));
                                            targw.reload(dd,cals);
                                        }
                                    });
                                    addhtml(dw,"button",{},"查看hash").onclick=(()=>{
                                        const neewd = addwindow(s,"该文件的Hash").dialog;
                                        addhtml(neewd,"div",{class:"div"},data[s].hash)
                                        var div1 = addhtml(neewd,"div",{class:"div"},"");
                                        var fjcg=()=>{var a = addhtml(neewd,"div",{class:"div"},"✔ 复制成功！");setTimeout(()=>{a.remove()},2000)}
                                        addhtml(div1,"button",{},"复制").onclick=()=>{navigator.clipboard.writeText(data[s].hash);fjcg()}
                                        addhtml(div1,"button",{},"在新标签页中打开").onclick=()=>{open("https://static.box3.codemao.cn/block/"+data[s].hash)}
                                    });
                                }
                            }
                        }
                        filef_9VIw3lUaTf.add(filef_9VIw3lUaTf_data, 'manage').name('管理自定义地图文件');
                        q4KVLbQ4O9.add(zidingyiditujianzaodata, 'x').name('尺寸x');
                        q4KVLbQ4O9.add(zidingyiditujianzaodata, 'y').name('尺寸y');
                        q4KVLbQ4O9.add(zidingyiditujianzaodata, 'z').name('尺寸z');
                        q4KVLbQ4O9.add(zidingyiditujianzaodata, 'tips').name(' ！提示 ！');
                        dc86r5v6f7.add(zidingyiditujianzaodata, 'pg').name('使用pg数据库');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'allowAction0').name('启用左键/A键');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'allowAction1').name('启用右键/B键');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'allowJump').name('允许跳跃');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'allowDoubleJump').name('允许二段跳');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'allowFlight').name('允许飞行');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'allowMove').name('允许移动');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'cameraType',{"第一人称":"fps","第三人称(默认)":"follow"}).name('视角模式');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'scale',0.2,50,0.01).name('大小');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'shininess',0,1,0.01).name('荧光度');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'showName').name('显示名字');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'invisible').name('隐身');
                        DEr1Ga3oje.addColor(zidingyiditujianzaodata.player, 'color').name('玩家颜色');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'noClip').name('可穿墙');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'enabledDamage').name('允许伤害');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'hp').name('初始生命值');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'maxHp',1,1000000,1).name('最大生命值');
                        DEr1Ga3oje.add(zidingyiditujianzaodata.player, 'showHealthBar').name('显示血量条');
                        //Dn2U1DM08b.add(zidingyiditujianzaodata, 'hasfog').name('启用雾气');
                        A7l24720gX.add(zidingyiditujianzaodata, 'indexjsname').name('主代码名称');
                        var zidingyiditujianzaodatacreatebtn = p111113.add(zidingyiditujianzaodata, 'func').name('建造｜约20s后开始创建');
                        p111113.add(datas, 'pg数据库使用教程').name('💡pg数据库教程');
                    }
                    else if(md=="Maas"){
                        userhuanchun=null
                        p1.add(datas, '回到原版神岛首页').name('回到原版神岛首页');
                        if(confirm("检测到当前为首页为商业版，\n是否跳转到原版神岛首页？")){datas['回到原版神岛首页']()}
                    }
                    else if(md=="HomePage"){
                        userhuanchun=null
                        if(mode114514=='box')p1.add(datas, '未开放').name('本页面暂无其他扩展工具');
                    }
                    else if(md=="User"){
                        var ssv = location.pathname.replace(location.pathname.substring(0,3), "")
                        if(isNaN(Number(ssv))){
                            window["usercontent"] = await document.func.rpc.user.api.get({publishedContentsCount:true,condition:"username",value:ssv})
                        }else{
                            window["usercontent"] = await document.func.rpc.user.api.get({publishedContentsCount:true,condition:"id",value:ssv})
                        }
                        console.log(usercontent)
                        setTimeout(()=>{
                            if(userhuanchun=="/u/")return
                            userhuanchun = location.pathname.substring(0,3)
                            var normalUsers=`<div class="_3ad7RnKp0WvPrytuJgHNZC">`;
                            var official=`<div class="O_1bkQ86ZNwsQID9yt2-5 IWXvKdLYkyQRIR-bhYjk1 _1lys4tbynXnfWH-M3WNvLL"><picture><source type="image/avif" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.avif 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.avif 2x"><source type="image/webp" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.webp 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.webp 2x"><source type="image/jpeg" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.jpg 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.jpg 2x"><source type="image/png" srcset="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.png 1x, https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_32_32_cover.png 2x"><img alt="" width="16" height="16" class="_3vfmbi4TlRDt_HCAsy45gl web-img" crossorigin="anonymous" src="https://static.box3.codemao.cn/img/QmPAKA9JfXiBXVDYGRe4B1x8e4abA2p5kDcpcZUrwNFMzh_16_16_cover.png" style="border: none; margin-right: 4px;"></picture><span class="_2IjTwrns7m6QeUouRJZaJK">`;
                            var vvvip=`<div class="O_1bkQ86ZNwsQID9yt2-5 IWXvKdLYkyQRIR-bhYjk1 _2CIZkiR5Tk_te3xyfL1QWJ"><picture><source type="image/avif" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.avif 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.avif 2x"><source type="image/webp" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.webp 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.webp 2x"><source type="image/jpeg" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.jpg 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.jpg 2x"><source type="image/png" srcset="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.png 1x, https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_32_32_cover.png 2x"><img alt="" width="16" height="16" class="_3vfmbi4TlRDt_HCAsy45gl web-img" crossorigin="anonymous" src="https://static.box3.codemao.cn/img/QmfBiBYTz4KY9SuGJvvhZLL52b852a5CsS1ipzzciTuGnM_16_16_cover.png" style="border: none; margin-right: 4px;"></picture><span class="mj5Q_r1tWrcjg7W7QLjHI">`
                            var uctsyv = document.querySelector("#main > main._2jTAXSb-GRY2o25tiqdq_z > ._1j6CQ8Mao1X47ufWW0UfI5 > .eQ4WOXbFnE2kwanAO8YNj > ._16IUw3NEvNlyHAOuWKbRMb > .flex > .flex")
                            var devId = [2526,3514199,4075204];
                            if(devId.includes(usercontent.id)){
                                addhtml(uctsyv,"div",{},official+`CodemaoUltra开发者</div>`)
                            }
                            if(usercontent.id=="106081"){
                                addhtml(uctsyv,"div",{},official+`幻想一笑而过小号</div>`)
                            }
                            if(usercontent.id=="8"){
                                addhtml(uctsyv,"div",{},vvvip+`shyfcka</div>`)
                            }
                            addhtml(uctsyv,"div",{},normalUsers+`UID:${usercontent.id}</div>`)
                        },1000)
                        p1.add({
                            "查看高清头像":()=>{
                                window.open(`https://static.box3.codemao.cn/block/${usercontent.avatar_hash}_cover_1024_1024.png`)
                            },
                        }, '查看高清头像').name('🖼️查看1024×1024高清头像');
                    }
                    else if(m=='shequWork'){
                        userhuanchun=null
                        p1.add(datas, '创作星空树').name('🌳跳转到创作星空树');
                    }
                    else if(m=='shequCommunity'){
                        userhuanchun=null
                        logs('success shequCommunity')
                        //onload = async () => {
                        'use strict';
                        let link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.type = "text/css";
                        link.href = "https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css";
                        document.head.appendChild(link);
                        var doNotShield = {
                            width: 640,
                            height: 480,
                            run: async () => {
                                const content = document.querySelector(textarea).contentDocument.body;
                                const data = encodeURI(`<link href="https://static.codemao.cn/community/prism/prism.min.css" rel="stylesheet" type="text/css" />${content.innerHTML}`);
                                GM_xmlhttpRequest({
                                    method: "post",
                                    url: "https://static.box3.codemao.cn/block",
                                    data: data,
                                    binary: true,
                                    async onload({ response }) {
                                        document.querySelector(textarea).contentDocument.body.innerHTML = `<iframe src="//box3statichelper.pythonanywhere.com/hash.html?hash=${JSON.parse(response).Key}" style="width: ${doNotShield.width}px; height: ${doNotShield.height}px; display: block; margin: 40px auto; max-width: 100%;"></iframe>`;
                                    },
                                });
                            }
                        };
                        const textarea = "#react-tinymce-0_ifr";
                        //document.querySelector("#root > div > div.r-index--main_cont > div > div.r-community--right_search_container > div > div.r-community--search_header > a.r-community--send_btn").addEventListener("click", () => {
                        p1.add(doNotShield, "width", 10, 1500, 10).name("宽度（px）");
                        p1.add(doNotShield, "height", 10, 3000, 10).name("高度（px）");
                        p1.add(doNotShield, "run").name("❗️ 使用防屏蔽功能");
                        //});
                        //document.querySelector("#root > div > div.r-index--main_cont > div > div:nth-child(4) > div > div.c-model_box--content_wrap > div > a").addEventListener("click", () => {
                        //
                        //});
                        //};
                    }else if(m=="shequCommunityRead"){
                        const CODES={
                            'javascript':'JavaScript',
                            'python':'Python',
                            'cpp':'C++',
                            'c':'C'
                        }
                        console.log(CODES);
                        setInterval(()=>{
                            document.querySelectorAll('code').forEach((c)=>{
                                if(c.className.trim().startsWith('language')&&c.parentElement.children.length<=1){
                                    var f=c.parentElement;
                                    var d=document.createElement('div');
                                    d.innerHTML=`<span id="_mce_caret" data-mce-bogus="1" data-mce-type="format-caret"><strong><span style="font-size: x-large;" data-mce-style="font-size: x-large;">&#65279;源代码-${CODES[c.className.trim().slice(9)]} </span></strong></span><br data-mce-bogus="1">`;
                                    f.insertBefore(d,c);
                                    var b=document.createElement('button');
                                    b.innerHTML='<img src="https://static.box3.codemao.cn/block/QmRjcKZT7hsCPLqufrb4q6CGpiakqqEze8DnTLDQLAAzE7.png" width="20">';
                                    b.onclick=()=>{
                                        navigator.clipboard.writeText(c.innerText).then(()=>{
                                            alert('复制成功！');
                                        }).catch((err)=>{
                                            alert('复制失败！\n'+err);
                                        });
                                    }
                                    d.appendChild(b);
                                    d.style.display='flex';
                                    d.style.backgroundColor='#e2ddd9';
                                }
                            });
                        },1000);
                        p1.add(datas, '未开放').name('本页面暂无其他扩展工具');
                    }
                    else if(m=="MapRead"){
                        userhuanchun=null
                        p1.add(datas2, '获取建造时间').name('获取开始制作时间');
                        p1.add(datas2, '查看高清封面').name('查看1024×1024高清封面');
                        p1.add(datas2, '查看全面展示图').name('查看全面+高清展示图');
                    }
                    else if(m=="ModelRead"){
                        userhuanchun=null
                        p1.add(datas2, '获取建造时间').name('获取开始制作时间');
                    }
                    else if(m=="MusicRead"){
                        userhuanchun=null
                        p1.add(datas, '未开放').name('本页面暂无其他扩展工具');
                    }
                    else if(m=="BoxStatic"){
                        userhuanchun=null;
                        p1.add(datas,'GBK').name('GBK乱码修复');
                        p1.add(datas,'GBK?').name('❔ 什么是GBK乱码');
                    }
                    else{
                        userhuanchun=null
                        p1.add(datas, '无功能').name('本页面暂无其他扩展工具')
                    }
                }
                if(/Play|Edit/.test(m)){
                    logs("地图模式："+m)
                    if (window.location.href.includes('/e/')) {
                        document.func = document.querySelector('.desktop')._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
                    }
                    if (window.location.href.includes('/p/')) {
                        var box3CoreElement = document.querySelector('#react-container');
                        var reactNodeName = Object.keys(box3CoreElement).filter(function (v) {
                            return v.includes('reactContain');
                        })[0];
                        document.func =box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children.props.children.props;
                    }
                    //document.func = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
                    toolfunc=document.func
                    logs(document.func);
                    if(m=="Play"){
                        var nowDH= new Date().getHours()
                        logs(nowDH)
                        var admins=[2526];
                    }else if(m=="Edit"){}
                    var interval = setInterval(()=>{
                        var jianceduixiang =
                            (
                                m=="Play"?
                                document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.eventBackendURL:
                                document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.language
                            )
                        if(jianceduixiang){
                            init(m);
                            clearInterval(interval);
                        }else{
                            toolfunc2 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
                        }
                    },100);
                }else{
                    logs("其他模式："+m)
                    if(mode114514=='box'&&m!="BoxStatic"){
                        document.func = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website;
                        toolfunc=document.func;
                        logs(document.func);
                        var interval = setInterval(()=>{
                            var jianceduixiang =document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website.intl.locale;
                            if(jianceduixiang){
                                init(m);
                                clearInterval(interval);
                            }else{
                                toolfunc2 = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website;
                            }
                        },100);
                    }else{
                        init(m);
                        clearInterval(interval);
                    }
                }
            }
            // 网页提速
            // https://greasyfork.org/zh-CN/scripts/436453
            let util = {
                getValue(name) {
                    return GM_getValue(name);
                },
 
                setValue(name, value) {
                    GM_setValue(name, value);
                },
 
                include(str, arr) {
                    str = str.replace(/[-_]/ig, '');
                    for (let i = 0, l = arr.length; i < l; i++) {
                        let val = arr[i];
                        if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                            return true;
                        }
                    }
                    return false;
                },
 
                addStyle(id, tag, css) {
                    tag = tag || 'style';
                    let doc = document, styleDom = doc.getElementById(id);
                    if (styleDom) return;
                    let style = doc.createElement(tag);
                    style.rel = 'stylesheet';
                    style.id = id;
                    tag === 'style' ? style.innerHTML = css : style.href = css;
                    doc.head.appendChild(style);
                },
 
                reg: {
                    chrome: /^https?:\/\/chrome.google.com\/webstore\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
                    edge: /^https?:\/\/microsoftedge.microsoft.com\/addons\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
                    firefox: /^https?:\/\/(reviewers\.)?(addons\.mozilla\.org|addons(?:-dev)?\.allizom\.org)\/.*?(?:addon|review)\/([^/<>"'?#]+)/,
                    microsoft: /^https?:\/\/(?:apps|www).microsoft.com\/(?:store|p)\/.+?\/([a-zA-Z\d]{10,})(?=[\/#?]|$)/,
                }
            };
 
            let main = {
                initValue() {
                    let value = [{
                        name: 'setting_success_times',
                        value: 0
                    }, {
                        name: 'allow_external_links',
                        value: true
                    }, {
                        name: 'allow_query_links',
                        value: true
                    }, {
                        name: 'enable_store_link',
                        value: true
                    }, {
                        name: 'enable_target_self',
                        value: false
                    }, {
                        name: 'enable_animation',
                        value: false
                    }, {
                        name: 'delay_on_hover',
                        value: 65
                    }, {
                        name: 'exclude_list',
                        value: ''
                    }, {
                        name: 'exclude_keyword',
                        value: 'login\nlogout\nregister\nsignin\nsignup\nsignout\npay\ncreate\nedit\ndownload\ndel\nreset\nsubmit\ndoubleclick\ngoogleads\nexit'
                    }];
 
                    value.forEach((v) => {
                        util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
                    });
                },
 
                registerMenuCommand() {
                    GM_registerMenuCommand('🚀 已加速：' + util.getValue('setting_success_times') + '次', () => {
                        Swal.fire({
                            showCancelButton: true,
                            title: '确定要重置加速次数吗？',
                            icon: 'warning',
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            customClass: {
                                popup: 'instant-popup',
                            },
                        }).then((res) => {
                            if (res.isConfirmed) {
                                util.setValue('setting_success_times', 0);
                                history.go(0);
                            }
                        });
                    });
                    GM_registerMenuCommand('⚙️ 设置', () => {
                        let dom = `<div style="font-size: 1em;">
                              <label class="instant-setting-label">加速外部链接<input type="checkbox" id="S-External" ${util.getValue('allow_external_links') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label"><span>加速含参数链接 <a href="https://www.youxiaohou.com/tool/install-instantpage.html#%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E">详见</a></span><input type="checkbox" id="S-Query" ${util.getValue('allow_query_links') ? 'checked' : ''}
                              class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速扩展/应用商店链接<input type="checkbox" id="S-Store" ${util.getValue('enable_store_link') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速链接在当前页打开<input type="checkbox" id="S-Target" ${util.getValue('enable_target_self') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速动画效果<input type="checkbox" id="S-Animate" ${util.getValue('enable_animation') ? 'checked' : ''}
                              class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">链接预读延时（毫秒）<input type="number" min="65" id="S-Delay" value="${util.getValue('delay_on_hover')}"
                              class="instant-setting-input"></label>
                              <label class="instant-setting-label-col">排除下列网址 <textarea placeholder="列表中的域名将不开启加速器，一行一个，例如：www.baidu.com" id="S-Exclude" class="instant-setting-textarea">${util.getValue('exclude_list')}</textarea></label>
                              <label class="instant-setting-label-col">排除下列关键词 <textarea placeholder="链接中含关键词将不开启加速器，一行一个，例如：logout" id="S-Exclude-Word" class="instant-setting-textarea">${util.getValue('exclude_keyword')}</textarea></label>
                            </div>`;
                        Swal.fire({
                            title: '加速器配置',
                            html: dom,
                            showCloseButton: true,
                            confirmButtonText: '保存',
                            footer: '<div style="text-align: center;font-size: 1em;">点击查看 <a href="https://www.youxiaohou.com/tool/install-instantpage.html" target="_blank">使用说明</a>，助手免费开源，Powered by <a href="https://www.youxiaohou.com">油小猴</a></div>',
                            customClass: {
                                popup: 'instant-popup',
                            },
                        }).then((res) => {
                            if (res.isConfirmed) {
                                history.go(0);
                            }
                        });
 
                        document.getElementById('S-External').addEventListener('change', (e) => {
                            util.setValue('allow_external_links', e.currentTarget.checked);
                        });
                        document.getElementById('S-Query').addEventListener('change', (e) => {
                            util.setValue('allow_query_links', e.currentTarget.checked);
                        });
                        document.getElementById('S-Store').addEventListener('change', (e) => {
                            util.setValue('enable_store_link', e.currentTarget.checked);
                        });
                        document.getElementById('S-Target').addEventListener('change', (e) => {
                            util.setValue('enable_target_self', e.currentTarget.checked);
                        });
                        document.getElementById('S-Animate').addEventListener('change', (e) => {
                            util.setValue('enable_animation', e.currentTarget.checked);
                        });
                        document.getElementById('S-Delay').addEventListener('change', (e) => {
                            util.setValue('delay_on_hover', e.currentTarget.value);
                        });
                        document.getElementById('S-Exclude').addEventListener('change', (e) => {
                            util.setValue('exclude_list', e.currentTarget.value);
                        });
                        document.getElementById('S-Exclude-Word').addEventListener('change', (e) => {
                            util.setValue('exclude_keyword', e.currentTarget.value);
                        });
                    });
                },
 
                //在排除名单里
                inExcludeList() {
                    let exclude = util.getValue('exclude_list').split('\n');
                    let host = location.host;
                    return exclude.includes(host);
                },
 
                //加速主代码
                instantPage() {
                    if (window.instantLoaded) return;
                    let mouseoverTimer;
                    let lastTouchTimestamp;
                    const prefetches = new Set();
                    const prefetchElement = document.createElement('link');
                    const isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports('prefetch')
                    && window.IntersectionObserver && 'isIntersecting' in IntersectionObserverEntry.prototype;
                    const isOnline = () => window.navigator.onLine;
                    const allowQueryString = 'instantAllowQueryString' in document.body.dataset || util.getValue('allow_query_links');
                    const allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset || util.getValue('allow_external_links');
                    const useWhitelist = 'instantWhitelist' in document.body.dataset;
                    const mousedownShortcut = 'instantMousedownShortcut' in document.body.dataset;
                    const DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION = 1111;
                    const enableAnimation = util.getValue('enable_animation');
                    const enableTargetSelf = util.getValue('enable_target_self');
                    const enableStoreLink = util.getValue('enable_store_link');
                    window.instantLoaded = true;
                    const excludeKeyword = util.getValue('exclude_keyword').split('\n');
 
                    let delayOnHover = util.getValue('delay_on_hover');
                    let useMousedown = false;
                    let useMousedownOnly = false;
                    let useViewport = false;
 
                    if ('instantIntensity' in document.body.dataset) {
                        const intensity = document.body.dataset.instantIntensity;
 
                        if (intensity.substr(0, 'mousedown'.length) === 'mousedown') {
                            useMousedown = true;
                            if (intensity === 'mousedown-only') {
                                useMousedownOnly = true;
                            }
                        } else if (intensity.substr(0, 'viewport'.length) === 'viewport') {
                            if (!(navigator.connection && (navigator.connection.saveData || (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g'))))) {
                                if (intensity === "viewport") {
                                    if (document.documentElement.clientWidth * document.documentElement.clientHeight < 450000) {
                                        useViewport = true;
                                    }
                                } else if (intensity === "viewport-all") {
                                    useViewport = true;
                                }
                            }
                        } else {
                            const milliseconds = parseInt(intensity);
                            if (!Number.isNaN(milliseconds)) {
                                delayOnHover = milliseconds;
                            }
                        }
                    }
 
                    if (isSupported) {
                        const eventListenersOptions = {
                            capture: true,
                            passive: true,
                        };
 
                        if (!useMousedownOnly) {
                            document.addEventListener('touchstart', touchstartListener, eventListenersOptions);
                        }
 
                        if (!useMousedown) {
                            document.addEventListener('mouseover', mouseoverListener, eventListenersOptions);
                        } else if (!mousedownShortcut) {
                            document.addEventListener('mousedown', mousedownListener, eventListenersOptions);
                        }
 
                        if (mousedownShortcut) {
                            document.addEventListener('mousedown', mousedownShortcutListener, eventListenersOptions);
                        }
 
 
                        if (useViewport) {
                            let triggeringFunction;
                            if (window.requestIdleCallback) {
                                triggeringFunction = (callback) => {
                                    requestIdleCallback(callback, {
                                        timeout: 1500,
                                    });
                                };
                            } else {
                                triggeringFunction = (callback) => {
                                    callback();
                                };
                            }
 
                            triggeringFunction(() => {
                                const intersectionObserver = new IntersectionObserver((entries) => {
                                    entries.forEach((entry) => {
                                        if (entry.isIntersecting) {
                                            const linkElement = entry.target;
                                            intersectionObserver.unobserve(linkElement);
                                            preload(linkElement);
                                        }
                                    });
                                });
 
                                document.querySelectorAll('a').forEach((linkElement) => {
                                    if (isPreloadable(linkElement)) {
                                        intersectionObserver.observe(linkElement);
                                    }
                                });
                            });
                        }
                    }
 
                    function touchstartListener(event) {
                        /* Chrome on Android calls mouseover before touchcancel so `lastTouchTimestamp`
                 * must be assigned on touchstart to be measured on mouseover. */
                        lastTouchTimestamp = performance.now();
 
                        const linkElement = event.target.closest('a');
 
                        if (!isPreloadable(linkElement)) {
                            return;
                        }
 
                        preload(linkElement);
                    }
 
                    function mouseoverListener(event) {
                        if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
                            return;
                        }
 
                        if (!('closest' in event.target)) {
                            // Without this check sometimes an error “event.target.closest is not a function” is thrown, for unknown reasons
                            // That error denotes that `event.target` isn’t undefined. My best guess is that it’s the Document.
 
                            // Details could be gleaned from throwing such an error:
                            //throw new TypeError(`instant.page non-element event target: timeStamp=${~~event.timeStamp}, type=${event.type}, typeof=${typeof event.target}, nodeType=${event.target.nodeType}, nodeName=${event.target.nodeName}, viewport=${innerWidth}x${innerHeight}, coords=${event.clientX}x${event.clientY}, scroll=${scrollX}x${scrollY}`)
                            return
                        }
 
                        const linkElement = event.target.closest('a');
 
                        if (!isPreloadable(linkElement)) {
                            return;
                        }
 
                        linkElement.addEventListener('mouseout', mouseoutListener, {passive: true});
 
                        mouseoverTimer = setTimeout(() => {
                            preload(linkElement);
                            mouseoverTimer = undefined;
                        }, delayOnHover);
                    }
 
                    function mousedownListener(event) {
                        const linkElement = event.target.closest('a');
 
                        if (!isPreloadable(linkElement)) {
                            return;
                        }
 
                        preload(linkElement);
                    }
 
                    function mouseoutListener(event) {
                        if (event.relatedTarget && event.target.closest('a') === event.relatedTarget.closest('a')) {
                            return;
                        }
 
                        if (mouseoverTimer) {
                            clearTimeout(mouseoverTimer);
                            mouseoverTimer = undefined;
                        }
                    }
 
                    function mousedownShortcutListener(event) {
                        if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
                            return;
                        }
 
                        const linkElement = event.target.closest('a');
 
                        if (event.which > 1 || event.metaKey || event.ctrlKey) {
                            return;
                        }
 
                        if (!linkElement) {
                            return;
                        }
 
                        linkElement.addEventListener('click', function (event) {
                            if (event.detail === 1337) {
                                return;
                            }
                            event.preventDefault();
                        }, {capture: true, passive: false, once: true});
                        const customEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            detail: 1337
                        });
                        linkElement.dispatchEvent(customEvent);
                    }
                    function isPreloadable(linkElement) {
                        if (!linkElement || !linkElement.href) {
                            return;
                        }
                        if (util.include(linkElement.href, excludeKeyword)) {
                            if (!util.reg.chrome.test(linkElement.href) &&
                                !util.reg.edge.test(linkElement.href) &&
                                !util.reg.edge.test(linkElement.href) &&
                                !util.reg.microsoft.test(linkElement.href)) {
                                return;
                            }
                        }
                        if (useWhitelist && !('instant' in linkElement.dataset)) {
                            return;
                        }
                        if (!allowExternalLinks && linkElement.origin !== location.origin && !('instant' in linkElement.dataset)) {
                            return;
                        }
                        if (!['http:', 'https:'].includes(linkElement.protocol)) {
                            return;
                        }
                        if (linkElement.protocol === 'http:' && location.protocol === 'https:') {
                            if (linkElement.href.indexOf('http://www.baidu.com/link?url') === 0) {
                                linkElement.href = linkElement.href.replace('http', 'https');
                            } else {
                                return;
                            }
                        }
                        //下载文件不加速
                        if (/\.[a-zA-Z0-9]{0,5}$/i.test(linkElement.href)) {
                            //排除域名，网站扩展名
                            if (!/(com|cn|top|ltd|net|tech|shop|vip|xyz|wang|cloud|online|site|love|art|xin|store|fun|cc|website|press|space|beer|luxe|video|ren|group|fit|yoga|org|pro|ink|biz|info|design|link|work|mobi|kim|pub|name|tv|co|asia|red|live|wiki|gov|life|world|run|show|city|gold|today|plus|cool|icu|company|chat|zone|fans|law|host|center|club|email|fund|social|team|guru|htm|html|php|asp|jsp)$/i.test(linkElement.href)) {
                                return;
                            }
                        }
                        if (!allowQueryString && linkElement.search && !('instant' in linkElement.dataset)) {
                            return;
                        }
                        if (linkElement.hash && linkElement.pathname + linkElement.search === location.pathname + location.search) {
                            return;
                        }
                        if (linkElement.dataset.filename || linkElement.dataset.noInstant) {
                            return;
                        }
                        return true;
                    }
                    function preload(linkElement) {
                        let url = linkElement.href;
                        if (!isOnline()) {
                            return;
                        }
                        if (prefetches.has(url)) {
                            return;
                        }
                        if (enableStoreLink) {
                            if (util.reg.chrome.test(url)) {
                                linkElement.href = url.replace("chrome.google.com", "chrome.crxsoso.com");
                            }
                            if (util.reg.edge.test(url)) {
                                linkElement.href = url.replace("microsoftedge.microsoft.com", "microsoftedge.crxsoso.com");
                            }
                            if (util.reg.firefox.test(url)) {
                                linkElement.href = url.replace("addons.mozilla.org", "addons.crxsoso.com");
                            }
                            if (util.reg.microsoft.test(url)) {
                                linkElement.href = url.replace(/(www|apps)\.microsoft\.com/, "apps.crxsoso.com");
                            }
                        }
                        const prefetcher = document.createElement('link');
                        prefetcher.rel = 'prefetch';
                        prefetcher.href = url;
                        document.head.appendChild(prefetcher);
                        prefetches.add(url);
                        if (enableAnimation) {
                            linkElement.classList.add("link-instanted");
                        }
                        if (enableTargetSelf) {
                            linkElement.target = '_self';
                        }
                        util.setValue('setting_success_times', util.getValue('setting_success_times') + 1);
                    }
                },
                addPluginStyle() {
                    let style = `
                .instant-popup { font-size: 14px !important; }
                .instant-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                .instant-setting-label-col { display: flex;align-items: flex-start;;padding-top: 15px;flex-direction:column }
                .instant-setting-checkbox { width: 16px;height: 16px; }
                .instant-setting-textarea { width: 100%; margin: 14px 0 0; height: 60px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
                .instant-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
                 @keyframes instantAnminate { from { opacity: 1; } 50% { opacity: 0.4 } to { opacity: 0.9; }}
                .link-instanted { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
                .link-instanted * { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
            `;
                    if (document.head) {
                        util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                        util.addStyle('instant-style', 'style', style);
                    }
                    const headObserver = new MutationObserver(() => {
                        util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                        util.addStyle('instant-style', 'style', style);
                    });
                    headObserver.observe(document.head, {childList: true, subtree: true});
                },
                init() {
                    this.initValue();
                    this.addPluginStyle();
                    this.registerMenuCommand();
                    if (this.inExcludeList()) return;
                    this.instantPage();
                }
            };
            main.init();
            //css样式
            addhtml(document.body,"style",{type:"text/css"},`
.box3edittooldiv {
    position: fixed;
    background: #383838;
    color: #fff;
    padding: 20px;
    right: 0px;
    bottom: 0px;
    box-shadow: 0px 0px 30px -10px #000;
    margin: 8px 20px;
    z-index:999999;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
}
.box3edittooldiv .div{
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;
    margin-top: 5px;
}
.box3edittooldiv[show=false] {
    display: none
}
.box3edittooldivycxx {
    position: fixed;
    right: 0px;
    bottom: -16.75px;
    box-shadow: 0px 0px 30px -10px #000;
    z-index:999999;
    transition: .5s;
}
.box3edittooldivycxx:hover {
    bottom: 0px;
}
.box3edittooldivycxx[show=false] {
    display: none
}
.box3edittooldiv .db{
    color: #fff;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;
}
.box3edittooldiv .db div{
    margin-right: 20px;
}
.box3edittooldiv .div button{margin-right: 5px;}
.box3edittooldiv button[zdy]{background:#0000;color:#fff;position: absolute;top: 0;right: 0;z-index:99999999999999999999999999999999999999999999999999999999999999999}
.box3edittooldiv .ahref{color:currentColor}
.box3edittooldiv .ahref:hover{text-decoration: underline;color:#fff}
.box3edittooldiv .ahref:active{color:#f44747}
.box3edittooldiv .db button{
    font-size:30px;
    padding: 0px 10px;
    border-top-right-radius: 10px;
    transition: .1s;
}
.box3edittooldiv .db button:hover{
    background:#a00a
}
.box3tooldialog {
    top: inherit;
    left: inherit;
    bottom: inherit;
    right: inherit;
    margin: 0;
}
.box3tooldialog .db button[jy=true] {
    opacity: .5;
    cursor: no-drop;
}
.box3tooldialog .ydtzd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    cursor: all-scroll;
}
.box3edittooldiv .db div font{
    max-height: 100px;
    overflow: auto;
    padding:5px 5px 0px 0px
}
.box3edittooldiv .db div font::-webkit-scrollbar {
    height: 5px;
    width: 5px;
}
.box3edittooldiv .db div font::-webkit-scrollbar-thumb {
    background: #aaa5;
    border-radius: 50px
}
.box3edittooldiv .db div font::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
.box3edittooldiv .db div font::-webkit-scrollbar-thumb:active {
    background: #aaa3;
}
.box3edittooldiv .db div font::-webkit-scrollbar-track {
    background: #0000;
    border-radius: 50px
}
 
.box3edittooldiv .div textarea::-webkit-scrollbar {
    height: 5px;
    width: 5px;
}
.box3edittooldiv .div textarea::-webkit-scrollbar-thumb {
    background: #aaa5;
    border-radius: 50px
}
.box3edittooldiv .div textarea::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
.box3edittooldiv .div textarea::-webkit-scrollbar-thumb:active {
    background: #aaa3;
}
.box3edittooldiv .div textarea::-webkit-scrollbar-track {
    background: #0000;
    border-radius: 50px
}
 
.box3tooldialog.dongtai{
    transition: .25s cubic-bezier(0, 0, 0, 0.9);
}
.box3tooldialog.kaishizhuangtai{
    transform: scale(0.75);
    opacity: 0;
}
._3ad7RnKp0WvPrytuJgHNZC {
    width: auto;
    padding: 0px 8px;
    height: 20px;
    font-size: 12px;
    margin-right: 5px;
    user-select: text !important;;
}
._3ad7RnKp0WvPrytuJgHNZC::selection{
    background:#ff952b50;color:#fff
}
._2p590X3xza5oTJJZ3ToFcx ._1yZ6NeMjfGScb4F10xmspg {
  width: calc(25% - 120px);
}
 
 
`);
 
        }catch (error) {
            if(/_reactRootContainer|_internalRoot|current|updateQueue|baseState|element|props|children/.test(error.message)){setTimeout(()=>{run()},100);return}
            console.error("CodemaoUltra运行失败！");
            console.error(error);
            alert("CodemaoUltra运行失败！");
            alert(error)
        }
    }
    setTimeout(()=>{run()},100)//加载时需要等待
})();
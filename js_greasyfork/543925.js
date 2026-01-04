// ==UserScript==
// @name            PT瀑布流视图
// @name:en         PT_Fall-View
// @namespace       vite-plugin-monkey
// @version         0.3.11
// @author          Kesa
// @description     PT瀑布流视图(2025重构)
// @description:en  PT Fall/Masonry View (restructured 2025)
// @license         MIT
// @icon            https://avatars.githubusercontent.com/u/23617963
// @match           https://kp.m-team.cc/*
// @match           https://zp.m-team.io/*
// @match           https://xp.m-team.cc/*
// @match           https://ap.m-team.cc/*
// @match           https://next.m-team.cc/*
// @match           https://xp.m-team.io/*
// @match           https://test2.m-team.cc/*
// @match           https://ob.m-team.cc/*
// @exclude         */offers.php*
// @exclude         */index.php*
// @exclude         */forums.php*
// @exclude         */viewrequests.php*
// @exclude         */seek.php*
// @exclude         *m-team*/detail/*
// @exclude         *m-team*/showcase*
// @exclude         *m-team*/showcaseDetail*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/543925/PT%E7%80%91%E5%B8%83%E6%B5%81%E8%A7%86%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/543925/PT%E7%80%91%E5%B8%83%E6%B5%81%E8%A7%86%E5%9B%BE.meta.js
// ==/UserScript==

(r=>{if(typeof GM_addStyle=="function"){GM_addStyle(r);return}const n=document.createElement("style");n.textContent=r,document.head.append(n)})(` button:focus,\r
button:focus-visible {\r
  /* outline: 2px auto -webkit-focus-ring-color; */\r
  /* outline: none; */\r
  outline: 3px solid var(--bg-3);\r
}\r
\r
.Fall_DOM{\r
  padding-bottom: 10px; /* \u786E\u4FDD\u5E95\u90E8\u6709\u8DB3\u591F\u7684\u7A7A\u95F4 */\r
  background-color: var(--bg-1);\r
}\r
\r
#_fallHolder {\r
  position: absolute;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  min-height: 10px;\r
  z-index: 101;\r
}\r
\r
#_shield {\r
  position: absolute;\r
  top: 0;\r
  left: 0;\r
  width: 100%;\r
  height: 100%;\r
  background-color: rgba(0, 0, 0, 0.5);\r
  z-index: 100;\r
  cursor: help;\r
  transition: background-color 0.3s ease;\r
}\r
#_shield:hover {\r
  background-color: rgba(0, 0, 0, 0.9);\r
}

  :where(div.masonry.svelte-b2jtby) {
    display: flex;
    justify-content: center;
    overflow-wrap: anywhere;
    box-sizing: border-box;
  }
  :where(div.masonry.svelte-b2jtby div.col:where(.svelte-b2jtby)) {
    display: grid;
    height: max-content;
    width: 100%;
  }

@-webkit-keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@-webkit-keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@-webkit-keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@-webkit-keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@-webkit-keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}@keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}.notyf{position:fixed;top:0;left:0;height:100%;width:100%;color:#fff;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;pointer-events:none;box-sizing:border-box;padding:20px}.notyf__icon--error,.notyf__icon--success{height:21px;width:21px;background:#fff;border-radius:50%;display:block;margin:0 auto;position:relative}.notyf__icon--error:after,.notyf__icon--error:before{content:"";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px;left:9px;height:12px;top:5px}.notyf__icon--error:after{transform:rotate(-45deg)}.notyf__icon--error:before{transform:rotate(45deg)}.notyf__icon--success:after,.notyf__icon--success:before{content:"";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px}.notyf__icon--success:after{height:6px;transform:rotate(-45deg);top:9px;left:6px}.notyf__icon--success:before{height:11px;transform:rotate(45deg);top:5px;left:10px}.notyf__toast{display:block;overflow:hidden;pointer-events:auto;-webkit-animation:notyf-fadeinup .3s ease-in forwards;animation:notyf-fadeinup .3s ease-in forwards;box-shadow:0 3px 7px 0 rgba(0,0,0,.25);position:relative;padding:0 15px;border-radius:2px;max-width:300px;transform:translateY(25%);box-sizing:border-box;flex-shrink:0}.notyf__toast--disappear{transform:translateY(0);-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s}.notyf__toast--disappear .notyf__icon,.notyf__toast--disappear .notyf__message{-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;opacity:1;transform:translateY(0)}.notyf__toast--disappear .notyf__dismiss{-webkit-animation:notyf-fadeoutright .3s forwards;animation:notyf-fadeoutright .3s forwards;opacity:1;transform:translateX(0)}.notyf__toast--disappear .notyf__message{-webkit-animation-delay:.05s;animation-delay:.05s}.notyf__toast--upper{margin-bottom:20px}.notyf__toast--lower{margin-top:20px}.notyf__toast--dismissible .notyf__wrapper{padding-right:30px}.notyf__ripple{height:400px;width:400px;position:absolute;transform-origin:bottom right;right:0;top:0;border-radius:50%;transform:scale(0) translateY(-51%) translateX(13%);z-index:5;-webkit-animation:ripple .4s ease-out forwards;animation:ripple .4s ease-out forwards}.notyf__wrapper{display:flex;align-items:center;padding-top:17px;padding-bottom:17px;padding-right:15px;border-radius:3px;position:relative;z-index:10}.notyf__icon{width:22px;text-align:center;font-size:1.3em;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.3s;animation-delay:.3s;margin-right:13px}.notyf__dismiss{position:absolute;top:0;right:0;height:100%;width:26px;margin-right:-15px;-webkit-animation:notyf-fadeinleft .3s forwards;animation:notyf-fadeinleft .3s forwards;-webkit-animation-delay:.35s;animation-delay:.35s;opacity:0}.notyf__dismiss-btn{background-color:rgba(0,0,0,.25);border:none;cursor:pointer;transition:opacity .2s ease,background-color .2s ease;outline:none;opacity:.35;height:100%;width:100%}.notyf__dismiss-btn:after,.notyf__dismiss-btn:before{content:"";background:#fff;height:12px;width:2px;border-radius:3px;position:absolute;left:calc(50% - 1px);top:calc(50% - 5px)}.notyf__dismiss-btn:after{transform:rotate(-45deg)}.notyf__dismiss-btn:before{transform:rotate(45deg)}.notyf__dismiss-btn:hover{opacity:.7;background-color:rgba(0,0,0,.15)}.notyf__dismiss-btn:active{opacity:.8}.notyf__message{vertical-align:middle;position:relative;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s;line-height:1.5em}@media only screen and (max-width:480px){.notyf{padding:0}.notyf__ripple{height:600px;width:600px;-webkit-animation-duration:.5s;animation-duration:.5s}.notyf__toast{max-width:none;border-radius:0;box-shadow:0 -2px 7px 0 rgba(0,0,0,.13);width:100%}.notyf__dismiss{width:56px}}
\r
  .card_holder.svelte-1q2qbu1 {\r
    border-radius: var(--borderRadius);\r
    overflow: hidden;\r
  }\r
\r
  /* \u5361\u7247\u5206\u7C7B */\r
  .card-category.svelte-1q2qbu1 {\r
    height: 20px;\r
    padding: 0 2px;\r
    border: 1px;\r
    background: black;\r
    color: white;\r
    font-weight: 900;\r
    overflow: hidden;\r
    white-space: nowrap;\r
    text-overflow: ellipsis;\r
\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
  }\r
\r
  /* \u5361\u7247\u79CD\u7C7Btag\u9884\u89C8\u56FE */\r
  .card_category-img.svelte-1q2qbu1 {\r
    /* height: 18px; */\r
    height: 35px;\r
    width: 28px;\r
\r
    /* background-size: 100% 141%; */\r
    background-position: center top;\r
\r
    /* padding-left: 5%; */\r
    padding-top: 6px;\r
  }\r
\r
  .card_category_square.svelte-1q2qbu1 {\r
    width: 40px;\r
    height: 40px;\r
    padding-top: 0;\r
    border-radius: 10px;\r
  }\r
\r
  /* (unused) .card_new_page_highlight {\r
    /* position: absolute; *\\/\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    background-color: rgba(8, 68, 0, 0.5);\r
    color: white;\r
    text-align: center;\r
    padding: 8px 8px;\r
  }*/\r
\r
  .lazy-image.svelte-1q2qbu1 {\r
    opacity: 0.2;\r
    transition: opacity 0.5s ease;\r
  }\r
  /* FIXME: \u4E0D\u77E5\u9053\u4E3A\u5565\u8FD9\u91CC\u4E0D\u8D77\u4F5C\u7528 */\r
  /* (unused) .lazy-image.loaded {\r
    opacity: 1;\r
  }*/\r
  .card_info.svelte-1q2qbu1 {\r
    display: flex;\r
    justify-content: center;\r
    align-items: center;\r
    flex-direction: column;\r
\r
    padding: 0px 8px;\r
\r
    & .card_info-item:where(.svelte-1q2qbu1) {\r
      display: flex;\r
      justify-content: space-around;\r
      align-items: center;\r
\r
      /* min-height: 32px; */\r
      width: 100%;\r
    }\r
\r
    & .card_info__dl_and_cl:where(.svelte-1q2qbu1) {\r
      display: flex;\r
      justify-content: center;\r
      align-items: center;\r
\r
      height: 32px;\r
    }\r
\r
    & .card_info__statistics:where(.svelte-1q2qbu1) {\r
      display: flex;\r
      justify-content: center;\r
      align-items: center;\r
    }\r
  }\r
\r
  .card_info__topping.svelte-1q2qbu1 {\r
    display: flex;\r
    /* justify-content: center; */\r
    align-items: center;\r
  }\r
\r
  .__main_title.svelte-1q2qbu1 {\r
    white-space: pre-wrap;\r
    /* word-wrap: break-word; */\r
    /* overflow-wrap: break-word; */\r
    /* font-size: 16px; */\r
    font-weight: bold;\r
    text-align: center;\r
    display: flex;\r
    justify-content: center;\r
    padding-left: 0.5rem;\r
    padding-right: 0.5rem;\r
\r
    &:hover {\r
      text-decoration: underline;\r
    }\r
  }\r
\r
  /* \u6807\u7B7E */\r
  .cl-tags.svelte-1q2qbu1 {\r
    display: flex;\r
    justify-content: center;\r
    align-items: center;\r
    flex-wrap: wrap;\r
\r
    gap: 2px;\r
\r
    padding-top: 4px;\r
    padding-bottom: 4px;\r
  }\r
  ._tag.svelte-1q2qbu1 {\r
    /* padding: 1px 6px; */\r
    height: 1.3em;\r
    line-height: 1.3em;\r
    padding: 0 0.5em;\r
    border-radius: 6px;\r
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\r
    font-size: 12px;\r
  }\r
  ._tag_diy.svelte-1q2qbu1 {\r
    color: #ffffff;\r
    background-color: rgb(90, 189, 72);\r
  }\r
  ._tag_dub.svelte-1q2qbu1 {\r
    color: #ffffff;\r
    background-color: rgb(90, 59, 20);\r
  }\r
  ._tag_sub.svelte-1q2qbu1 {\r
    color: #ffffff;\r
    background-color: rgb(59, 74, 127);\r
  }\r
  ._tag_discount_50.svelte-1q2qbu1 {\r
    background-color: rgb(255, 85, 0);\r
    color: #ffffff;\r
  }\r
  ._tag_discount_free.svelte-1q2qbu1 {\r
    background-color: rgb(16, 142, 233);\r
    color: #ffffff;\r
  }\r
\r
  .card_pic.svelte-1q2qbu1 {\r
    position: relative;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    /* flex-direction: column; */\r
\r
    background-color: var(--cateColor);\r
  }\r
\r
  .card_pic.svelte-1q2qbu1 img:where(.svelte-1q2qbu1) {\r
    width: 100%;\r
    height: 100%;\r
  }\r
\r
  .pic_error.svelte-1q2qbu1 {\r
    display: flex;\r
    justify-content: center;\r
    align-items: center;\r
    width: 100%;\r
    height: 100%;\r
    padding: 10px;\r
    gap: 10px;\r
    line-height: 24px;\r
  }\r
\r
  /* \u5361\u7247\u7D22\u5F15 */\r
  .card-index.svelte-1q2qbu1 {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    padding: 4px 9px 4px 9px;\r
    margin: 0;\r
    /* height: 20px; */\r
    line-height: 16px;\r
    font-size: 16px;\r
    font-weight: bold;\r
\r
    background-color: rgba(0, 0, 0, 0.5);\r
    color: white;\r
    /* border-top-right-radius: 100px; */\r
    /* border-bottom-right-radius: 100px; */\r
\r
    z-index: 2;\r
\r
    display: flex;\r
    align-items: center;\r
\r
    pointer-events: none;\r
  }\r
\r
  /* \u5361\u7247\u7D22\u5F15_\u53F3 */\r
  .card-index-right.svelte-1q2qbu1 {\r
    left: initial;\r
    right: 0;\r
    padding: 4px 4px 4px 8px;\r
\r
    background-color: rgb(0, 0, 0);\r
    color: white;\r
\r
    /* border-top-left-radius: 20px; */\r
    /* border-bottom-left-radius: 20px; */\r
  }\r
\r
  /* \u60AC\u6D6E\u9884\u89C8: \u5C40\u90E8\u89E6\u53D1\u5668 */\r
  .hover-trigger.svelte-1q2qbu1 {\r
    position: absolute;\r
    top: 28px;\r
    right: 8px;\r
    /* padding-right: 19px; */\r
    /* padding-left: 2px; */\r
    padding: 0;\r
    width: 42px;\r
    margin: 0;\r
    height: 40px;\r
    line-height: 16px;\r
    font-size: 16px;\r
\r
    /* background-color: rgb(255, 187, 16); */\r
\r
    opacity: 0.5;\r
\r
    /* color: yellow; */\r
    /* border-top-right-radius: 0px; */\r
    /* border-bottom-left-radius: 100px; */\r
    border-radius: 9999px;\r
\r
    display: flex;\r
    align-items: center;\r
\r
    /* pointer-events: none; */\r
\r
    z-index: 2;\r
    transition: opacity 0.3s ease;\r
\r
    &:hover {\r
      opacity: 0.8;\r
    }\r
  }\r
\r
  /* \u6DFB\u52A0\u60AC\u6D6E\u6548\u679C\u76F8\u5173\u6837\u5F0F */\r
  .hover-overlay.svelte-1q2qbu1 {\r
    position: absolute;\r
    bottom: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    background: rgba(0, 0, 0, 0.5);\r
    opacity: 0;\r
    transition: opacity 0.3s ease;\r
    /* pointer-events: none; */\r
    z-index: 1;\r
  }\r
\r
  .overlay-content.svelte-1q2qbu1 {\r
    width: 100%;\r
    position: absolute;\r
    bottom: 0;\r
    left: 50%;\r
    transform: translateX(-50%);\r
\r
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 20%, transparent 100%);\r
    background: rgba(255, 255, 255, 0.9);\r
    /* background-color: rgba(0, 0, 0, 0.5); */\r
\r
    padding: 0 0px 2px;\r
    /* border-radius: 4px; */\r
    color: #333;\r
    font-size: 14px;\r
    white-space: nowrap;\r
\r
    display: flex;\r
    flex-direction: column;\r
\r
    & .card_info-item:where(.svelte-1q2qbu1) {\r
      display: flex;\r
      justify-content: center;\r
      align-items: center;\r
\r
      padding: 2px;\r
\r
      padding-left: 8px;\r
      padding-right: 8px;\r
    }\r
\r
    & .__main_title:where(.svelte-1q2qbu1) {\r
      text-align: center;\r
      white-space: pre-wrap;\r
      /* word-wrap: break-word; */\r
      /* overflow-wrap: break-word; */\r
\r
      /* font-size: 16px; */\r
      font-weight: bold;\r
\r
      &:hover {\r
        text-decoration: underline;\r
      }\r
    }\r
\r
    & .__sub_title:where(.svelte-1q2qbu1) {\r
      white-space: pre-wrap;\r
      /* word-wrap: break-word; */\r
      /* overflow-wrap: break-word; */\r
      overflow: hidden;\r
    }\r
\r
    & .card_info__statistics:where(.svelte-1q2qbu1) {\r
      display: flex;\r
      justify-content: space-evenly;\r
      align-items: center;\r
\r
      height: 32px;\r
    }\r
  }\r
\r
  .__center.svelte-1q2qbu1 {\r
    display: flex;\r
    justify-content: center;\r
    align-items: center;\r
  }\r
\r
  .__inner_index_and_size.svelte-1q2qbu1 {\r
    display: flex;\r
    justify-content: space-between;\r
    align-items: center;\r
    position: absolute;\r
    width: 100%;\r
    left: 0;\r
    top: -24px;\r
  }\r
\r
  .__inner_index.svelte-1q2qbu1 {\r
    position: relative;\r
    width: fit-content;\r
\r
    display: flex;\r
    justify-content: flex-start;\r
    align-items: center;\r
  }\r
\r
  .__inner_size.svelte-1q2qbu1 {\r
    position: relative;\r
    width: fit-content;\r
\r
    display: flex;\r
    justify-content: flex-end;\r
    align-items: center;\r
  }\r
\r
  .__iframe_button.svelte-1q2qbu1 {\r
    flex: 1;\r
    height: 24px;\r
    padding: 4px 8px;\r
    margin: 0;\r
    border: none;\r
    background: none;\r
    outline: none;\r
    appearance: none;\r
    box-sizing: border-box;\r
    white-space: nowrap;\r
    opacity: 1;\r
    transition: opacity 0.3s ease;\r
\r
    &:hover {\r
      opacity: 0.7;\r
    }\r
  }\r

\r
  .fall_holder.svelte-1vmncc1 {\r
    background-color: var(--bg-1);\r
\r
    overflow: hidden;\r
  }\r
\r
  .text_center.svelte-1vmncc1 {\r
    text-align: center;\r
    padding: 8px 0;\r
    margin: 0;\r
  }\r

\r
  .__btn.svelte-1a87xm5 {\r
    background-color: var(--bg-2);\r
    color: white;\r
    border: none;\r
    padding: 4px 8px;\r
    border-radius: 4px;\r
    font-size: 14px;\r
    transition: background-color 0.3s;\r
    cursor: pointer;\r
  }\r
\r
  .__btnWide.svelte-1a87xm5 {\r
    height: 40px;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
  }\r
\r
  .__btn.svelte-1a87xm5:hover {\r
    background-color: var(--hover);\r
  }\r
\r
  .modal-overlay.svelte-1a87xm5 {\r
    position: fixed;\r
    top: 0;\r
    left: 0;\r
    right: 0;\r
    bottom: 0;\r
    background-color: rgba(0, 0, 0, 0.5);\r
    display: flex;\r
    justify-content: center;\r
    align-items: center;\r
    z-index: 25000;\r
  }\r
\r
  .modal-content.svelte-1a87xm5 {\r
    background: var(--bg-3);\r
    border-radius: 8px;\r
    border: 4px solid var(--bg-2);\r
    /* padding: 12px; */\r
    width: 500px;\r
    max-width: 90vw;\r
    max-height: 80vh;\r
    overflow-y: auto;\r
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\r
  }\r
\r
  .modal-header.svelte-1a87xm5 {\r
    display: flex;\r
    justify-content: space-between;\r
    align-items: center;\r
    padding: 16px 20px;\r
    border-bottom: 4px solid var(--bg-2);\r
  }\r
\r
  .modal-header.svelte-1a87xm5 h3:where(.svelte-1a87xm5) {\r
    margin: 0;\r
    font-size: 16px;\r
  }\r
\r
  .close-btn.svelte-1a87xm5 {\r
    background: none;\r
    border: none;\r
    font-size: 24px;\r
    cursor: pointer;\r
    padding: 0;\r
    width: 24px;\r
    height: 24px;\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
  }\r
\r
  .modal-body.svelte-1a87xm5 {\r
    padding: 0px 20px 10px;\r
    line-height: 1.6;\r
  }\r
\r
  .modal-body.svelte-1a87xm5 h4:where(.svelte-1a87xm5) {\r
    margin: 16px 0 8px 0;\r
    color: #1890ff;\r
  }\r
\r
  .modal-body.svelte-1a87xm5 p:where(.svelte-1a87xm5) {\r
    margin: 0 0 12px 0;\r
  }\r
\r
  .modal-code.svelte-1a87xm5 {\r
    background-color: var(--bg-1);\r
    padding: 4px;\r
    border-radius: 4px;\r
  }\r

\r
  .switch-container.svelte-18ntgfp {\r
    display: inline-block;\r
    cursor: pointer;\r
  }\r
\r
  .switch-background.svelte-18ntgfp {\r
    position: relative;\r
    width: 48px;\r
    height: 24px;\r
    background-color: #e0e0e0;\r
    border-radius: 12px;\r
    transition: background-color 0.2s;\r
  }\r
\r
  .switch-slider.svelte-18ntgfp {\r
    position: absolute;\r
    width: 20px;\r
    height: 20px;\r
    background-color: white;\r
    border-radius: 50%;\r
    top: 2px;\r
    left: 2px;\r
    transition: all 0.2s;\r
  }\r
\r
  .switch-slider.checked.svelte-18ntgfp {\r
    transform: translateX(24px);\r
    /* // \u6DFB\u52A0\u84DD\u8272\u80CC\u666F */\r
    background-color: #2196f3;\r
  }\r
\r
  .switch-background.svelte-18ntgfp:hover {\r
    background-color: #d0d0d0;\r
  }\r
\r
  .switch-container.svelte-18ntgfp:active .switch-slider:where(.svelte-18ntgfp) {\r
    transform: translateX(24px) scale(0.95);\r
  }\r

\r
  .flowP.svelte-4gkzar {\r
    position: fixed;\r
\r
    width: 80px;\r
    max-height: 300px;\r
\r
    border-radius: 12px;\r
    overflow: hidden;\r
\r
    padding-bottom: 8px;\r
    padding: 0px 0px 8px;\r
\r
    /* background-color: #fff4; */\r
    background-color: var(--bg-1);\r
    transition:\r
      opacity 0.3s,\r
      border 0.3s;\r
\r
    font-size: 16px;\r
\r
    opacity: 0.7;\r
\r
    z-index: 15000;\r
\r
    border: 2px solid transparent;\r
    &:hover {\r
      opacity: 1;\r
      border: 2px solid var(--isFallView);\r
    }\r
  }\r
\r
  .flowPDragger.svelte-4gkzar {\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
    line-height: 14px;\r
    font-size: 12px;\r
    height: 14px;\r
    transition: background-color 0.3s ease-in-out;\r
    background-color: var(--isFallView);\r
\r
    &:hover {\r
      cursor: move; /* \u8BBE\u7F6E\u9F20\u6807\u60AC\u505C\u65F6\u7684\u56FE\u6807\u4E3A\u79FB\u52A8 */\r
    }\r
  }\r
\r
  .flowPHolder.svelte-4gkzar {\r
    /* position: relative; */\r
    display: flex;\r
    flex-direction: column;\r
    justify-content: center;\r
    align-items: center;\r
    padding-top: 2px;\r
    gap: 4px;\r
  }\r
\r
  .flowBtn.svelte-4gkzar {\r
    padding: 4px;\r
    border-radius: 4px;\r
    border: 2px solid transparent;\r
    transition: all 0.2s;\r
\r
    font-size: 14px;\r
    /* font-weight: bold; */\r
\r
    width: 72px;\r
\r
    background-color: var(--bg-2);\r
    color: var(--get-text-color);\r
\r
    &:hover {\r
      border-color: var(--bg-3);\r
    }\r
\r
    &:active {\r
      transform: translateY(4px);\r
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);\r
    }\r
\r
    & .flowBtn_text:where(.svelte-4gkzar) {\r
      padding-top: 3px;\r
      padding-bottom: 3px;\r
    }\r
\r
    /* @media (prefers-color-scheme: dark) {\r
      background-color: #2a2a2a;\r
      color: #ffffff;\r
\r
      &:hover {\r
        background-color: #3a3a3a;\r
        color: #ffffff;\r
      }\r
    } */\r
  }\r
\r
  /* \u914D\u7F6E\u83DC\u5355\u6837\u5F0F */\r
  .config-menu-overlay.svelte-4gkzar {\r
    color: var(--get-text-color);\r
    position: fixed;\r
    top: 0;\r
    left: 0;\r
    right: 0;\r
    bottom: 0;\r
    background-color: rgba(0, 0, 0, 0.5);\r
    display: flex;\r
    justify-content: flex-end;\r
    z-index: 20000;\r
  }\r
\r
  .config-menu.svelte-4gkzar {\r
    background-color: #ffffff;\r
    width: 300px;\r
    height: 100vh;\r
    padding: 20px;\r
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);\r
    overflow-y: auto;\r
  }\r
\r
  .config-menu-header.svelte-4gkzar {\r
    display: flex;\r
    justify-content: space-between;\r
    align-items: center;\r
    margin-bottom: 12px;\r
  }\r
\r
  .close-btn.svelte-4gkzar {\r
    background: none;\r
    border: none;\r
    font-size: 24px;\r
    cursor: pointer;\r
    padding: 0 8px;\r
    transform: translateY(-4px);\r
  }\r
\r
  .config-menu-content.svelte-4gkzar {\r
    display: flex;\r
    flex-direction: column;\r
    gap: 4px;\r
\r
    font-size: 14px;\r
\r
    & h3:where(.svelte-4gkzar) {\r
      margin-top: 28px;\r
    }\r
  }\r
\r
  .config-item.svelte-4gkzar {\r
    display: flex;\r
    align-items: center;\r
    justify-content: space-between;\r
  }\r
\r
  .config-item.svelte-4gkzar span:where(.svelte-4gkzar) {\r
    display: flex;\r
    justify-content: end;\r
  }\r
\r
  .config-item.svelte-4gkzar ._single_item:where(.svelte-4gkzar) {\r
    padding-right: 8px;\r
    flex: 1;\r
  }\r
\r
  .config-item.svelte-4gkzar input:where(.svelte-4gkzar) {\r
    width: 120px;\r
  }\r

\r
  div#_iframe_holder.svelte-126sfo0 {\r
    position: fixed;\r
    top: 0;\r
    left: 0;\r
    width: 100vw;\r
    height: 100vh;\r
    background-color: rgba(0, 38, 38, 0.607);\r
    z-index: 30000;\r
\r
    display: flex;\r
  }\r
\r
  div._iframe_back.svelte-126sfo0 {\r
    position: absolute;\r
    width: 100%;\r
    height: 100%;\r
  }\r
\r
  div._iframe_parent.svelte-126sfo0 {\r
    position: relative;\r
    /* width: 1246px; */\r
    height: 96%;\r
    margin: auto;\r
    display: flex;\r
    align-items: center;\r
  }\r
\r
  div._iframe_parent.svelte-126sfo0 iframe:where(.svelte-126sfo0) {\r
    height: 100%;\r
    border-radius: 20px;\r
    user-select: none;\r
  }\r
\r
  ._iframeCloseBtn.svelte-126sfo0 {\r
    width: 40px;\r
    height: 40px;\r
    background: white;\r
\r
    position: absolute;\r
\r
    top: 10px;\r
    right: 10px;\r
\r
    border-radius: 40px;\r
    transition: all 0.5s;\r
\r
    z-index: 30001;\r
\r
    /* \u60AC\u6D6E */\r
    &:hover {\r
      opacity: 0.7;\r
      transform: scale(1.2);\r
    }\r
    /* \u70B9\u51FB(\u957F\u6309\u624D\u660E\u663E) */\r
    &:active {\r
      opacity: 0.9;\r
      transform: scale(1.9);\r
    }\r
  }\r
\r
  .resize-handle.svelte-126sfo0 {\r
    position: absolute;\r
    width: 16px;\r
    height: 100%;\r
    background: var(--textColor2);\r
    cursor: col-resize;\r
    transition: all 0.2s ease;\r
    z-index: 1;\r
    opacity: 0.4;\r
\r
    &:hover {\r
      opacity: 0.6;\r
    }\r
\r
    &:active {\r
      opacity: 0.8;\r
      background: var(--textColor1);\r
    }\r
  }\r
\r
  .resize-handle-left.svelte-126sfo0 {\r
    left: -16px;\r
    border-radius: 6px 0 0 6px;\r
  }\r
\r
  .resize-handle-right.svelte-126sfo0 {\r
    right: -16px;\r
    border-radius: 0 6px 6px 0;\r
  }\r
\r
  .iframe-overlay.svelte-126sfo0 {\r
    position: absolute;\r
    top: 0;\r
    left: 0;\r
    width: 100%;\r
    height: 100%;\r
    z-index: 30001;\r
    user-select: none;\r
  } `);

(function () {
      'use strict';

      var Ua=Object.defineProperty;var Vi=e=>{throw TypeError(e)};var Ya=(e,t,r)=>t in e?Ua(e,t,{enumerable:true,configurable:true,writable:true,value:r}):e[t]=r;var Un=(e,t,r)=>Ya(e,typeof t!="symbol"?t+"":t,r),Yn=(e,t,r)=>t.has(e)||Vi("Cannot "+r);var Ke=(e,t,r)=>(Yn(e,t,"read from private field"),r?r.call(e):t.get(e)),gr=(e,t,r)=>t.has(e)?Vi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),Xn=(e,t,r,n)=>(Yn(e,t,"write to private field"),t.set(e,r),r),Ii=(e,t,r)=>(Yn(e,t,"access private method"),r);var yn=Array.isArray,Xa=Array.prototype.indexOf,hi=Array.from,Ki=Object.defineProperty,Mt=Object.getOwnPropertyDescriptor,ea=Object.getOwnPropertyDescriptors,Qa=Object.prototype,Ja=Array.prototype,gi=Object.getPrototypeOf;function Ka(e){return typeof e=="function"}const Re=()=>{};function es(e){return e()}function ei(e){for(var t=0;t<e.length;t++)e[t]();}const Ie=2,ta=4,Ir=8,wn=16,Ge=32,Xt=64,cn=128,$t=256,un=512,xe=1024,gt=2048,St=4096,Ze=8192,Qt=16384,ra=32768,xn=65536,ts=1<<17,rs=1<<19,na=1<<20,Nt=Symbol("$state"),ns=Symbol("legacy props"),is=Symbol("");function ia(e){return e===this.v}function aa(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function pi(e){return !aa(e,this.v)}function as(e){throw new Error("https://svelte.dev/e/effect_in_teardown")}function ss(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function os(e){throw new Error("https://svelte.dev/e/effect_orphan")}function ls(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function cs(e){throw new Error("https://svelte.dev/e/props_invalid_value")}function us(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function vs(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function ds(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function fs(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let Jt=false;function _s(){Jt=true;}const mi=1,bi=2,sa=4,hs=8,gs=16,ps=1,ms=2,bs=4,ys=8,ws=16,xs=1,Cs=2,ks=4,Es=1,Ls=2,Me=Symbol();function Ve(e,t){var r={f:0,v:e,reactions:null,equals:ia,rv:0,wv:0};return r}function Cn(e,t=false){var n;const r=Ve(e);return t||(r.equals=pi),Jt&&re!==null&&re.l!==null&&((n=re.l).s??(n.s=[])).push(r),r}function X(e,t=false){return Ms(Cn(e,t))}function Ms(e){return ae!==null&&!nt&&ae.f&Ie&&(We===null?Ps([e]):We.push(e)),e}function Se(e,t){return I(e,H(()=>l(e))),t}function I(e,t){return ae!==null&&!nt&&Pr()&&ae.f&(Ie|wn)&&(We===null||!We.includes(e))&&fs(),ti(e,t)}function ti(e,t){return e.equals(t)||(e.v,e.v=t,e.wv=Ca(),oa(e,gt),Pr()&&J!==null&&J.f&xe&&!(J.f&(Ge|Xt))&&(et===null?Hs([e]):et.push(e))),t}function oa(e,t){var r=e.reactions;if(r!==null)for(var n=Pr(),i=r.length,a=0;a<i;a++){var s=r[a],c=s.f;c&gt||!n&&s===J||(Oe(s,t),c&(xe|$t)&&(c&Ie?oa(s,St):Nn(s)));}}let la=false;function Ht(e,t=null,r){if(typeof e!="object"||e===null||Nt in e)return e;const n=gi(e);if(n!==Qa&&n!==Ja)return e;var i=new Map,a=yn(e),s=Ve(0);a&&i.set("length",Ve(e.length));var c;return new Proxy(e,{defineProperty(v,d,_){(!("value"in _)||_.configurable===false||_.enumerable===false||_.writable===false)&&us();var o=i.get(d);return o===undefined?(o=Ve(_.value),i.set(d,o)):I(o,Ht(_.value,c)),true},deleteProperty(v,d){var _=i.get(d);if(_===undefined)d in v&&i.set(d,Ve(Me));else {if(a&&typeof d=="string"){var o=i.get("length"),u=Number(d);Number.isInteger(u)&&u<o.v&&I(o,u);}I(_,Me),Ti(s);}return  true},get(v,d,_){var p;if(d===Nt)return e;var o=i.get(d),u=d in v;if(o===undefined&&(!u||(p=Mt(v,d))!=null&&p.writable)&&(o=Ve(Ht(u?v[d]:Me,c)),i.set(d,o)),o!==undefined){var f=l(o);return f===Me?undefined:f}return Reflect.get(v,d,_)},getOwnPropertyDescriptor(v,d){var _=Reflect.getOwnPropertyDescriptor(v,d);if(_&&"value"in _){var o=i.get(d);o&&(_.value=l(o));}else if(_===undefined){var u=i.get(d),f=u==null?undefined:u.v;if(u!==undefined&&f!==Me)return {enumerable:true,configurable:true,value:f,writable:true}}return _},has(v,d){var f;if(d===Nt)return  true;var _=i.get(d),o=_!==undefined&&_.v!==Me||Reflect.has(v,d);if(_!==undefined||J!==null&&(!o||(f=Mt(v,d))!=null&&f.writable)){_===undefined&&(_=Ve(o?Ht(v[d],c):Me),i.set(d,_));var u=l(_);if(u===Me)return  false}return o},set(v,d,_,o){var b;var u=i.get(d),f=d in v;if(a&&d==="length")for(var p=_;p<u.v;p+=1){var m=i.get(p+"");m!==undefined?I(m,Me):p in v&&(m=Ve(Me),i.set(p+"",m));}u===undefined?(!f||(b=Mt(v,d))!=null&&b.writable)&&(u=Ve(undefined),I(u,Ht(_,c)),i.set(d,u)):(f=u.v!==Me,I(u,Ht(_,c)));var N=Reflect.getOwnPropertyDescriptor(v,d);if(N!=null&&N.set&&N.set.call(o,_),!f){if(a&&typeof d=="string"){var S=i.get("length"),C=Number(d);Number.isInteger(C)&&C>=S.v&&I(S,C+1);}Ti(s);}return  true},ownKeys(v){l(s);var d=Reflect.ownKeys(v).filter(u=>{var f=i.get(u);return f===undefined||f.v!==Me});for(var[_,o]of i)o.v!==Me&&!(_ in v)&&d.push(_);return d},setPrototypeOf(){vs();}})}function Ti(e,t=1){I(e,e.v+t);}var Mr,ca,ua;function Ns(){if(Mr===undefined){Mr=window;var e=Element.prototype,t=Node.prototype;ca=Mt(t,"firstChild").get,ua=Mt(t,"nextSibling").get,e.__click=undefined,e.__className="",e.__attributes=null,e.__styles=null,e.__e=undefined,Text.prototype.__t=undefined;}}function yi(e=""){return document.createTextNode(e)}function Wt(e){return ca.call(e)}function kn(e){return ua.call(e)}function h(e,t){return Wt(e)}function $e(e,t){{var r=Wt(e);return r instanceof Comment&&r.data===""?kn(r):r}}function g(e,t=1,r=false){let n=e;for(;t--;)n=kn(n);return n}function $s(e){e.textContent="";}function Nr(e){var t=Ie|gt;J===null?t|=$t:J.f|=na;var r=ae!==null&&ae.f&Ie?ae:null;const n={children:null,ctx:re,deps:null,equals:ia,f:t,fn:e,reactions:null,rv:0,v:null,wv:0,parent:r??J};return r!==null&&(r.children??(r.children=[])).push(n),n}function tt(e){const t=Nr(e);return t.equals=pi,t}function va(e){var t=e.children;if(t!==null){e.children=null;for(var r=0;r<t.length;r+=1){var n=t[r];n.f&Ie?wi(n):ht(n);}}}function Ss(e){for(var t=e.parent;t!==null;){if(!(t.f&Ie))return t;t=t.parent;}return null}function da(e){var t,r=J;He(Ss(e));try{va(e),t=Ea(e);}finally{He(r);}return t}function fa(e){var t=da(e),r=(kt||e.f&$t)&&e.deps!==null?St:xe;Oe(e,r),e.equals(t)||(e.v=t,e.wv=Ca());}function wi(e){va(e),Sr(e,0),Oe(e,Qt),e.v=e.children=e.deps=e.ctx=e.reactions=null;}function _a(e){J===null&&ae===null&&os(),ae!==null&&ae.f&$t&&ss(),Ei&&as();}function qs(e,t){var r=t.last;r===null?t.last=t.first=e:(r.next=e,e.prev=r,t.last=e);}function Kt(e,t,r,n=true){var i=(e&Xt)!==0,a=J,s={ctx:re,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:e|gt,first:null,fn:t,last:null,next:null,parent:i?null:a,prev:null,teardown:null,transitions:null,wv:0};if(r){var c=Ot;try{Ai(!0),Mn(s),s.f|=ra;}catch(_){throw ht(s),_}finally{Ai(c);}}else t!==null&&Nn(s);var v=r&&s.deps===null&&s.first===null&&s.nodes_start===null&&s.teardown===null&&(s.f&(na|cn))===0;if(!v&&!i&&n&&(a!==null&&qs(s,a),ae!==null&&ae.f&Ie)){var d=ae;(d.children??(d.children=[])).push(s);}return s}function xi(e){const t=Kt(Ir,null,false);return Oe(t,xe),t.teardown=e,t}function ri(e){_a();var t=J!==null&&(J.f&Ge)!==0&&re!==null&&!re.m;if(t){var r=re;(r.e??(r.e=[])).push({fn:e,effect:J,reaction:ae});}else {var n=Tr(e);return n}}function Vs(e){return _a(),zr(e)}function Is(e){const t=Kt(Xt,e,true);return (r={})=>new Promise(n=>{r.outro?vn(t,()=>{ht(t),n(undefined);}):(ht(t),n(undefined));})}function Tr(e){return Kt(ta,e,false)}function _t(e,t){var r=re,n={effect:null,ran:false};r.l.r1.push(n),n.effect=zr(()=>{e(),!n.ran&&(n.ran=true,I(r.l.r2,true),H(t));});}function Ar(){var e=re;zr(()=>{if(l(e.l.r2)){for(var t of e.l.r1){var r=t.effect;r.f&xe&&Oe(r,St),er(r)&&Mn(r),t.ran=false;}e.l.r2.v=false;}});}function zr(e){return Kt(Ir,e,true)}function Y(e,t=[],r=Nr){const n=t.map(r);return Ci(()=>e(...n.map(l)))}function Ci(e,t=0){return Kt(Ir|wn|t,e,true)}function $r(e,t=true){return Kt(Ir|Ge,e,true,t)}function ha(e){var t=e.teardown;if(t!==null){const r=Ei,n=ae;zi(true),je(null);try{t.call(null);}finally{zi(r),je(n);}}}function ga(e){var t=e.deriveds;if(t!==null){e.deriveds=null;for(var r=0;r<t.length;r+=1)wi(t[r]);}}function pa(e,t=false){var r=e.first;for(e.first=e.last=null;r!==null;){var n=r.next;ht(r,t),r=n;}}function Ts(e){for(var t=e.first;t!==null;){var r=t.next;t.f&Ge||ht(t),t=r;}}function ht(e,t=true){var r=false;if((t||e.f&rs)&&e.nodes_start!==null){for(var n=e.nodes_start,i=e.nodes_end;n!==null;){var a=n===i?null:kn(n);n.remove(),n=a;}r=true;}pa(e,t&&!r),ga(e),Sr(e,0),Oe(e,Qt);var s=e.transitions;if(s!==null)for(const v of s)v.stop();ha(e);var c=e.parent;c!==null&&c.first!==null&&ma(e),e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes_start=e.nodes_end=null;}function ma(e){var t=e.parent,r=e.prev,n=e.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),t!==null&&(t.first===e&&(t.first=n),t.last===e&&(t.last=r));}function vn(e,t){var r=[];ki(e,r,true),ba(r,()=>{ht(e),t&&t();});}function ba(e,t){var r=e.length;if(r>0){var n=()=>--r||t();for(var i of e)i.out(n);}else t();}function ki(e,t,r){if(!(e.f&Ze)){if(e.f^=Ze,e.transitions!==null)for(const s of e.transitions)(s.is_global||r)&&t.push(s);for(var n=e.first;n!==null;){var i=n.next,a=(n.f&xn)!==0||(n.f&Ge)!==0;ki(n,t,a?r:false),n=i;}}}function dn(e){ya(e,true);}function ya(e,t){if(e.f&Ze){e.f^=Ze,e.f&xe||(e.f^=xe),er(e)&&(Oe(e,gt),Nn(e));for(var r=e.first;r!==null;){var n=r.next,i=(r.f&xn)!==0||(r.f&Ge)!==0;ya(r,i?t:false),r=n;}if(e.transitions!==null)for(const a of e.transitions)(a.is_global||t)&&a.in();}}let ni=false,ii=[];function As(){ni=false;const e=ii.slice();ii=[],ei(e);}function En(e){ni||(ni=true,queueMicrotask(As)),ii.push(e);}function zs(){throw new Error("https://svelte.dev/e/invalid_default_snippet")}function wa(e){throw new Error("https://svelte.dev/e/lifecycle_outside_component")}let nn=false,fn=false,_n=null,Ot=false,Ei=false;function Ai(e){Ot=e;}function zi(e){Ei=e;}let ai=[],Cr=0;let ae=null,nt=false;function je(e){ae=e;}let J=null;function He(e){J=e;}let We=null;function Ps(e){We=e;}let Ne=null,qe=0,et=null;function Hs(e){et=e;}let xa=1,hn=0,kt=false,re=null;function Ca(){return ++xa}function Pr(){return !Jt||re!==null&&re.l===null}function er(e){var d;var t=e.f;if(t&gt)return  true;if(t&St){var r=e.deps,n=(t&$t)!==0;if(r!==null){var i,a,s=(t&un)!==0,c=n&&J!==null&&!kt,v=r.length;if(s||c){for(i=0;i<v;i++)a=r[i],(s||!((d=a==null?undefined:a.reactions)!=null&&d.includes(e)))&&(a.reactions??(a.reactions=[])).push(e);s&&(e.f^=un);}for(i=0;i<v;i++)if(a=r[i],er(a)&&fa(a),a.wv>e.wv)return  true}(!n||J!==null&&!kt)&&Oe(e,xe);}return  false}function Os(e,t){for(var r=t;r!==null;){if(r.f&cn)try{r.fn(e);return}catch{r.f^=cn;}r=r.parent;}throw nn=false,e}function Rs(e){return (e.f&Qt)===0&&(e.parent===null||(e.parent.f&cn)===0)}function Ln(e,t,r,n){if(nn){if(r===null&&(nn=false),Rs(t))throw e;return}r!==null&&(nn=true);{Os(e,t);return}}function ka(e,t,r=0){var n=e.reactions;if(n!==null)for(var i=0;i<n.length;i++){var a=n[i];a.f&Ie?ka(a,t,r+1):t===a&&(r===0?Oe(a,gt):a.f&xe&&Oe(a,St),Nn(a));}}function Ea(e){var f;var t=Ne,r=qe,n=et,i=ae,a=kt,s=We,c=re,v=nt,d=e.f;Ne=null,qe=0,et=null,ae=d&(Ge|Xt)?null:e,kt=!Ot&&(d&$t)!==0,We=null,re=e.ctx,nt=false,hn++;try{var _=(0,e.fn)(),o=e.deps;if(Ne!==null){var u;if(Sr(e,qe),o!==null&&qe>0)for(o.length=qe+Ne.length,u=0;u<Ne.length;u++)o[qe+u]=Ne[u];else e.deps=o=Ne;if(!kt)for(u=qe;u<o.length;u++)((f=o[u]).reactions??(f.reactions=[])).push(e);}else o!==null&&qe<o.length&&(Sr(e,qe),o.length=qe);if(Pr()&&et!==null&&!(e.f&(Ie|St|gt)))for(u=0;u<et.length;u++)ka(et[u],e);return i!==null&&hn++,_}finally{Ne=t,qe=r,et=n,ae=i,kt=a,We=s,re=c,nt=v;}}function Fs(e,t){let r=t.reactions;if(r!==null){var n=Xa.call(r,e);if(n!==-1){var i=r.length-1;i===0?r=t.reactions=null:(r[n]=r[i],r.pop());}}r===null&&t.f&Ie&&(Ne===null||!Ne.includes(t))&&(Oe(t,St),t.f&($t|un)||(t.f^=un),Sr(t,0));}function Sr(e,t){var r=e.deps;if(r!==null)for(var n=t;n<r.length;n++)Fs(e,r[n]);}function Mn(e){var t=e.f;if(!(t&Qt)){Oe(e,xe);var r=J,n=re;J=e;try{t&wn?Ts(e):pa(e),ga(e),ha(e);var i=Ea(e);e.teardown=typeof i=="function"?i:null,e.wv=xa;var a=e.deps,s;}catch(c){Ln(c,e,r,n||e.ctx);}finally{J=r;}}}function Ds(){if(Cr>1e3){Cr=0;try{ls();}catch(e){if(_n!==null)Ln(e,_n,null);else throw e}}Cr++;}function Bs(e){var t=e.length;if(t!==0){Ds();var r=Ot;Ot=true;try{for(var n=0;n<t;n++){var i=e[n];i.f&xe||(i.f^=xe);var a=[];La(i,a),Zs(a);}}finally{Ot=r;}}}function Zs(e){var t=e.length;if(t!==0)for(var r=0;r<t;r++){var n=e[r];if(!(n.f&(Qt|Ze)))try{er(n)&&(Mn(n),n.deps===null&&n.first===null&&n.nodes_start===null&&(n.teardown===null?ma(n):n.fn=null));}catch(i){Ln(i,n,null,n.ctx);}}}function Ws(){if(fn=false,Cr>1001)return;const e=ai;ai=[],Bs(e),fn||(Cr=0,_n=null);}function Nn(e){fn||(fn=true,queueMicrotask(Ws)),_n=e;for(var t=e;t.parent!==null;){t=t.parent;var r=t.f;if(r&(Xt|Ge)){if(!(r&xe))return;t.f^=xe;}}ai.push(t);}function La(e,t){var r=e.first,n=[];e:for(;r!==null;){var i=r.f,a=(i&Ge)!==0,s=a&&(i&xe)!==0,c=r.next;if(!s&&!(i&Ze))if(i&Ir){if(a)r.f^=xe;else try{er(r)&&Mn(r);}catch(o){Ln(o,r,null,r.ctx);}var v=r.first;if(v!==null){r=v;continue}}else i&ta&&n.push(r);if(c===null){let o=r.parent;for(;o!==null;){if(e===o)break e;var d=o.next;if(d!==null){r=d;continue e}o=o.parent;}}r=c;}for(var _=0;_<n.length;_++)v=n[_],t.push(v),La(v,t);}function l(e){var _;var t=e.f,r=(t&Ie)!==0;if(r&&t&Qt){var n=da(e);return wi(e),n}if(ae!==null&&!nt){We!==null&&We.includes(e)&&ds();var i=ae.deps;e.rv<hn&&(e.rv=hn,Ne===null&&i!==null&&i[qe]===e?qe++:Ne===null?Ne=[e]:Ne.push(e));}else if(r&&e.deps===null)for(var a=e,s=a.parent,c=a;s!==null;)if(s.f&Ie){var v=s;c=v,s=v.parent;}else {var d=s;(_=d.deriveds)!=null&&_.includes(c)||(d.deriveds??(d.deriveds=[])).push(c);break}return r&&(a=e,er(a)&&fa(a)),e.v}function H(e){var t=nt;try{return nt=!0,e()}finally{nt=t;}}const js=-7169;function Oe(e,t){e.f=e.f&js|t;}function pt(e,t=false,r){re={p:re,c:null,e:null,m:false,s:e,x:null,l:null},Jt&&!t&&(re.l={s:null,u:null,r1:[],r2:Ve(false)});}function mt(e){const t=re;if(t!==null){e!==undefined&&(t.x=e);const s=t.e;if(s!==null){var r=J,n=ae;t.e=null;try{for(var i=0;i<s.length;i++){var a=s[i];He(a.effect),je(a.reaction),Tr(a.fn);}}finally{He(r),je(n);}}re=t.p,t.m=true;}return e||{}}function Ct(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(Nt in e)si(e);else if(!Array.isArray(e))for(let t in e){const r=e[t];typeof r=="object"&&r&&Nt in r&&si(r);}}}function si(e,t=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let n in e)try{si(e[n],t);}catch{}const r=gi(e);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const n=ea(r);for(let i in n){const a=n[i].get;if(a)try{a.call(e);}catch{}}}}}const Gs=["touchstart","touchmove"];function Us(e){return Gs.includes(e)}let Pi=false;function Ys(){Pi||(Pi=true,document.addEventListener("reset",e=>{Promise.resolve().then(()=>{var t;if(!e.defaultPrevented)for(const r of e.target.elements)(t=r.__on_r)==null||t.call(r);});},{capture:true}));}function Ma(e){var t=ae,r=J;je(null),He(null);try{return e()}finally{je(t),He(r);}}function Xs(e,t,r,n=r){e.addEventListener(t,()=>Ma(r));const i=e.__on_r;i?e.__on_r=()=>{i(),n(true);}:e.__on_r=()=>n(true),Ys();}const Qs=new Set,Hi=new Set;function Js(e,t,r,n={}){function i(a){if(n.capture||pr.call(t,a),!a.cancelBubble)return Ma(()=>r==null?void 0:r.call(this,a))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?En(()=>{t.addEventListener(e,i,n);}):t.addEventListener(e,i,n),i}function B(e,t,r,n,i){var a={capture:n,passive:i},s=Js(e,t,r,a);(t===document.body||t===window||t===document)&&xi(()=>{t.removeEventListener(e,s,a);});}function pr(e){var C;var t=this,r=t.ownerDocument,n=e.type,i=((C=e.composedPath)==null?undefined:C.call(e))||[],a=i[0]||e.target,s=0,c=e.__root;if(c){var v=i.indexOf(c);if(v!==-1&&(t===document||t===window)){e.__root=t;return}var d=i.indexOf(t);if(d===-1)return;v<=d&&(s=v);}if(a=i[s]||e.target,a!==t){Ki(e,"currentTarget",{configurable:true,get(){return a||r}});var _=ae,o=J;je(null),He(null);try{for(var u,f=[];a!==null;){var p=a.assignedSlot||a.parentNode||a.host||null;try{var m=a["__"+n];if(m!==void 0&&!a.disabled)if(yn(m)){var[N,...S]=m;N.apply(a,[e,...S]);}else m.call(a,e);}catch(b){u?f.push(b):u=b;}if(e.cancelBubble||p===t||p===null)break;a=p;}if(u){for(let b of f)queueMicrotask(()=>{throw b});throw u}}finally{e.__root=t,delete e.currentTarget,je(_),He(o);}}}function Na(e){var t=document.createElement("template");return t.innerHTML=e,t.content}function gn(e,t){var r=J;r.nodes_start===null&&(r.nodes_start=e,r.nodes_end=t);}function z(e,t){var r=(t&Es)!==0,n=(t&Ls)!==0,i,a=!e.startsWith("<!>");return ()=>{i===undefined&&(i=Na(a?e:"<!>"+e),r||(i=Wt(i)));var s=n?document.importNode(i,true):i.cloneNode(true);if(r){var c=Wt(s),v=s.lastChild;gn(c,v);}else gn(s,s);return s}}function tr(e,t,r="svg"){var n=!e.startsWith("<!>"),i=`<${r}>${n?e:"<!>"+e}</${r}>`,a;return ()=>{if(!a){var s=Na(i),c=Wt(s);a=Wt(c);}var v=a.cloneNode(true);return gn(v,v),v}}function dt(){var e=document.createDocumentFragment(),t=document.createComment(""),r=yi();return e.append(t,r),gn(t,r),e}function L(e,t){e!==null&&e.before(t);}let oi=true;function K(e,t){var r=t==null?"":typeof t=="object"?t+"":t;r!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=r,e.nodeValue=r==null?"":r+"");}function qr(e,t){return Ks(e,t)}const zt=new Map;function Ks(e,{target:t,anchor:r,props:n={},events:i,context:a,intro:s=true}){Ns();var c=new Set,v=o=>{for(var u=0;u<o.length;u++){var f=o[u];if(!c.has(f)){c.add(f);var p=Us(f);t.addEventListener(f,pr,{passive:p});var m=zt.get(f);m===undefined?(document.addEventListener(f,pr,{passive:p}),zt.set(f,1)):zt.set(f,m+1);}}};v(hi(Qs)),Hi.add(v);var d=undefined,_=Is(()=>{var o=r??t.appendChild(yi());return $r(()=>{if(a){pt({});var u=re;u.c=a;}i&&(n.$$events=i),oi=s,d=e(o,n)||{},oi=true,a&&mt();}),()=>{var p;for(var u of c){t.removeEventListener(u,pr);var f=zt.get(u);--f===0?(document.removeEventListener(u,pr),zt.delete(u)):zt.set(u,f);}Hi.delete(v),o!==r&&((p=o.parentNode)==null||p.removeChild(o));}});return eo.set(d,_),d}let eo=new WeakMap;function Z(e,t,r=false){var n=e,i=null,a=null,s=Me,c=r?xn:0,v=false;const d=(o,u=true)=>{v=true,_(u,o);},_=(o,u)=>{s!==(s=o)&&(s?(i?dn(i):u&&(i=$r(()=>u(n))),a&&vn(a,()=>{a=null;})):(a?dn(a):u&&(a=$r(()=>u(n))),i&&vn(i,()=>{i=null;})));};Ci(()=>{v=false,t(d),v||_(null,null);},c);}let an=null;function mr(e,t){return t}function to(e,t,r,n){for(var i=[],a=t.length,s=0;s<a;s++)ki(t[s].e,i,true);var c=a>0&&i.length===0&&r!==null;if(c){var v=r.parentNode;$s(v),v.append(r),n.clear(),ct(e,t[0].prev,t[a-1].next);}ba(i,()=>{for(var d=0;d<a;d++){var _=t[d];c||(n.delete(_.k),ct(e,_.prev,_.next)),ht(_.e,!c);}});}function Et(e,t,r,n,i,a=null){var s=e,c={flags:t,items:new Map,first:null},v=(t&sa)!==0;if(v){var d=e;s=d.appendChild(yi());}var _=null,o=false,u=tt(()=>{var f=r();return yn(f)?f:f==null?[]:hi(f)});Ci(()=>{var f=l(u),p=f.length;if(!(o&&p===0)){o=p===0;{var m=ae;ro(f,c,s,i,t,(m.f&Ze)!==0,n,r);}a!==null&&(p===0?_?dn(_):_=$r(()=>a(s)):_!==null&&vn(_,()=>{_=null;})),l(u);}});}function ro(e,t,r,n,i,a,s,c){var D,ne,le,se;var v=(i&hs)!==0,d=(i&(mi|bi))!==0,_=e.length,o=t.items,u=t.first,f=u,p,m=null,N,S=[],C=[],b,P,k,E;if(v)for(E=0;E<_;E+=1)b=e[E],P=s(b,E),k=o.get(P),k!==undefined&&((D=k.a)==null||D.measure(),(N??(N=new Set)).add(k));for(E=0;E<_;E+=1){if(b=e[E],P=s(b,E),k=o.get(P),k===undefined){var T=f?f.e.nodes_start:r;m=io(T,t,m,m===null?t.first:m.next,b,P,E,n,i,c),o.set(P,m),S=[],C=[],f=m.next;continue}if(d&&no(k,b,E,i),k.e.f&Ze&&(dn(k.e),v&&((ne=k.a)==null||ne.unfix(),(N??(N=new Set)).delete(k))),k!==f){if(p!==undefined&&p.has(k)){if(S.length<C.length){var x=C[0],M;m=x.prev;var A=S[0],O=S[S.length-1];for(M=0;M<S.length;M+=1)Oi(S[M],x,r);for(M=0;M<C.length;M+=1)p.delete(C[M]);ct(t,A.prev,O.next),ct(t,m,A),ct(t,O,x),f=x,m=O,E-=1,S=[],C=[];}else p.delete(k),Oi(k,f,r),ct(t,k.prev,k.next),ct(t,k,m===null?t.first:m.next),ct(t,m,k),m=k;continue}for(S=[],C=[];f!==null&&f.k!==P;)(a||!(f.e.f&Ze))&&(p??(p=new Set)).add(f),C.push(f),f=f.next;if(f===null)continue;k=f;}S.push(k),m=k,f=k.next;}if(f!==null||p!==undefined){for(var w=p===undefined?[]:hi(p);f!==null;)(a||!(f.e.f&Ze))&&w.push(f),f=f.next;var q=w.length;if(q>0){var F=i&sa&&_===0?r:null;if(v){for(E=0;E<q;E+=1)(le=w[E].a)==null||le.measure();for(E=0;E<q;E+=1)(se=w[E].a)==null||se.fix();}to(t,w,F,o);}}v&&En(()=>{var me;if(N!==undefined)for(k of N)(me=k.a)==null||me.apply();}),J.first=t.first&&t.first.e,J.last=m&&m.e;}function no(e,t,r,n){n&mi&&ti(e.v,t),n&bi?ti(e.i,r):e.i=r;}function io(e,t,r,n,i,a,s,c,v,d){var _=an,o=(v&mi)!==0,u=(v&gs)===0,f=o?u?Cn(i):Ve(i):i,p=v&bi?Ve(s):s,m={i:p,v:f,k:a,a:null,e:null,prev:r,next:n};an=m;try{return m.e=$r(()=>c(e,f,p,d),la),m.e.prev=r&&r.e,m.e.next=n&&n.e,r===null?t.first=m:(r.next=m,r.e.next=m.e),n!==null&&(n.prev=m,n.e.prev=m.e),m}finally{an=_;}}function Oi(e,t,r){for(var n=e.next?e.next.e.nodes_start:r,i=t?t.e.nodes_start:r,a=e.e.nodes_start;a!==n;){var s=kn(a);i.before(a),a=s;}}function ct(e,t,r){t===null?e.first=r:(t.next=r,t.e.next=r&&r.e),r!==null&&(r.prev=t,r.e.prev=t&&t.e);}function Ri(e,t,r,n,i){var c;var a=(c=t.$$slots)==null?undefined:c[r],s=false;a===true&&(a=t.children,s=true),a===undefined?i!==null&&i(e):a(e,s?()=>n:n);}function $(e,t,r,n){var i=e.__attributes??(e.__attributes={});i[t]!==(i[t]=r)&&(t==="style"&&"__styles"in e&&(e.__styles={}),t==="loading"&&(e[is]=r),r==null?e.removeAttribute(t):typeof r!="string"&&ao(e).includes(t)?e[t]=r:e.setAttribute(t,r));}var Fi=new Map;function ao(e){var t=Fi.get(e.nodeName);if(t)return t;Fi.set(e.nodeName,t=[]);for(var r,n=e,i=Element.prototype;i!==n;){r=ea(n);for(var a in r)r[a].set&&t.push(a);n=gi(n);}return t}function Di(e,t,r){var n=e.__className,i=so(t);(n!==i||la)&&(t==null?e.removeAttribute("class"):e.className=i,e.__className=i);}function so(e,t){return (e??"")+""}function br(e,t,r){if(r){if(e.classList.contains(t))return;e.classList.add(t);}else {if(!e.classList.contains(t))return;e.classList.remove(t);}}function Pe(e,t,r,n){var i=e.__styles??(e.__styles={});i[t]!==r&&(i[t]=r,r==null?e.style.removeProperty(t):e.style.setProperty(t,r,""));}const oo=()=>performance.now(),rt={tick:e=>requestAnimationFrame(e),now:()=>oo(),tasks:new Set};function $a(){const e=rt.now();rt.tasks.forEach(t=>{t.c(e)||(rt.tasks.delete(t),t.f());}),rt.tasks.size!==0&&rt.tick($a);}function lo(e){let t;return rt.tasks.size===0&&rt.tick($a),{promise:new Promise(r=>{rt.tasks.add(t={c:e,f:r});}),abort(){rt.tasks.delete(t);}}}function en(e,t){e.dispatchEvent(new CustomEvent(t));}function co(e){if(e==="float")return "cssFloat";if(e==="offset")return "cssOffset";if(e.startsWith("--"))return e;const t=e.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(r=>r[0].toUpperCase()+r.slice(1)).join("")}function Bi(e){const t={},r=e.split(";");for(const n of r){const[i,a]=n.split(":");if(!i||a===undefined)break;const s=co(i.trim());t[s]=a.trim();}return t}const uo=e=>e;function vo(e,t,r){var n=an,i,a,s,c=null;n.a??(n.a={element:e,measure(){i=this.element.getBoundingClientRect();},apply(){if(s==null||s.abort(),a=this.element.getBoundingClientRect(),i.left!==a.left||i.right!==a.right||i.top!==a.top||i.bottom!==a.bottom){const v=t()(this.element,{from:i,to:a},r==null?undefined:r());s=pn(this.element,v,undefined,1,()=>{s==null||s.abort(),s=undefined;});}},fix(){if(!e.getAnimations().length){var{position:v,width:d,height:_}=getComputedStyle(e);if(v!=="absolute"&&v!=="fixed"){var o=e.style;c={position:o.position,width:o.width,height:o.height,transform:o.transform},o.position="absolute",o.width=d,o.height=_;var u=e.getBoundingClientRect();if(i.left!==u.left||i.top!==u.top){var f=`translate(${i.left-u.left}px, ${i.top-u.top}px)`;o.transform=o.transform?`${o.transform} ${f}`:f;}}}},unfix(){if(c){var v=e.style;v.position=c.position,v.width=c.width,v.height=c.height,v.transform=c.transform;}}}),n.a.element=e;}function jt(e,t,r,n){var i=(e&xs)!==0,a=(e&Cs)!==0,s=i&&a,c=(e&ks)!==0,v=s?"both":i?"in":"out",d,_=t.inert,o=t.style.overflow,u,f;function p(){var b=ae,P=J;je(null),He(null);try{return d??(d=r()(t,(n==null?void 0:n())??{},{direction:v}))}finally{je(b),He(P);}}var m={is_global:c,in(){var b;if(t.inert=_,!i){f==null||f.abort(),(b=f==null?undefined:f.reset)==null||b.call(f);return}a||u==null||u.abort(),en(t,"introstart"),u=pn(t,p(),f,1,()=>{en(t,"introend"),u==null||u.abort(),u=d=undefined,t.style.overflow=o;});},out(b){if(!a){b==null||b(),d=undefined;return}t.inert=true,en(t,"outrostart"),f=pn(t,p(),u,0,()=>{en(t,"outroend"),b==null||b();});},stop:()=>{u==null||u.abort(),f==null||f.abort();}},N=J;if((N.transitions??(N.transitions=[])).push(m),i&&oi){var S=c;if(!S){for(var C=N.parent;C&&C.f&xn;)for(;(C=C.parent)&&!(C.f&wn););S=!C||(C.f&ra)!==0;}S&&Tr(()=>{H(()=>m.in());});}}function pn(e,t,r,n,i){var a=n===1;if(Ka(t)){var s,c=false;return En(()=>{if(!c){var N=t({direction:a?"in":"out"});s=pn(e,N,r,n,i);}}),{abort:()=>{c=true,s==null||s.abort();},deactivate:()=>s.deactivate(),reset:()=>s.reset(),t:()=>s.t()}}if(r==null||r.deactivate(),!(t!=null&&t.duration))return i(),{abort:Re,deactivate:Re,reset:Re,t:()=>n};const{delay:v=0,css:d,tick:_,easing:o=uo}=t;var u=[];if(a&&r===undefined&&(_&&_(0,1),d)){var f=Bi(d(0,1));u.push(f,f);}var p=()=>1-n,m=e.animate(u,{duration:v});return m.onfinish=()=>{var N=(r==null?undefined:r.t())??1-n;r==null||r.abort();var S=n-N,C=t.duration*Math.abs(S),b=[];if(C>0){var P=false;if(d)for(var k=Math.ceil(C/16.666666666666668),E=0;E<=k;E+=1){var T=N+S*o(E/k),x=Bi(d(T,1-T));b.push(x),P||(P=x.overflow==="hidden");}P&&(e.style.overflow="hidden"),p=()=>{var M=m.currentTime;return N+S*o(M/C)},_&&lo(()=>{if(m.playState!=="running")return  false;var M=p();return _(M,1-M),true});}m=e.animate(b,{duration:C,fill:"forwards"}),m.onfinish=()=>{p=()=>n,_==null||_(n,1-n),i();};},{abort:()=>{m&&(m.cancel(),m.effect=null,m.onfinish=Re);},deactivate:()=>{i=Re;},reset:()=>{n===0&&(_==null||_(1,0));},t:()=>p()}}function tn(e,t,r=t){var n=Pr();Xs(e,"input",i=>{var a=i?e.defaultValue:e.value;if(a=Qn(e)?Jn(a):a,r(a),n&&a!==(a=t())){var s=e.selectionStart,c=e.selectionEnd;e.value=a??"",c!==null&&(e.selectionStart=s,e.selectionEnd=Math.min(c,e.value.length));}}),H(t)==null&&e.value&&r(Qn(e)?Jn(e.value):e.value),zr(()=>{var i=t();Qn(e)&&i===Jn(e.value)||e.type==="date"&&!i&&!e.value||i!==e.value&&(e.value=i??"");});}function Qn(e){var t=e.type;return t==="number"||t==="range"}function Jn(e){return e===""?null:+e}function Kn(e,t,r){var n=Mt(e,t);n&&n.set&&(e[t]=r,xi(()=>{e[t]=null;}));}var vt,Zt,Vr,mn,Sa;const bn=class bn{constructor(t){gr(this,mn);gr(this,vt,new WeakMap);gr(this,Zt);gr(this,Vr);Xn(this,Vr,t);}observe(t,r){var n=Ke(this,vt).get(t)||new Set;return n.add(r),Ke(this,vt).set(t,n),Ii(this,mn,Sa).call(this).observe(t,Ke(this,Vr)),()=>{var i=Ke(this,vt).get(t);i.delete(r),i.size===0&&(Ke(this,vt).delete(t),Ke(this,Zt).unobserve(t));}}};vt=new WeakMap,Zt=new WeakMap,Vr=new WeakMap,mn=new WeakSet,Sa=function(){return Ke(this,Zt)??Xn(this,Zt,new ResizeObserver(t=>{for(var r of t){bn.entries.set(r.target,r);for(var n of Ke(this,vt).get(r.target)||[])n(r);}}))},Un(bn,"entries",new WeakMap);let li=bn;var fo=new li({box:"border-box"});function Zi(e,t,r){var n=fo.observe(e,()=>r(e[t]));Tr(()=>(H(()=>r(e[t])),n));}function Wi(e,t){return e===t||(e==null?undefined:e[Nt])===t}function ut(e={},t,r,n){return Tr(()=>{var i,a;return zr(()=>{i=a,a=[],H(()=>{e!==r(...a)&&(t(e,...a),i&&Wi(r(...i),e)&&t(null,...i));});}),()=>{En(()=>{a&&Wi(r(...a),e)&&t(null,...a);});}}),e}function Li(e){return function(...t){var r=t[0];r.target===this&&(e==null||e.apply(this,t));}}function kr(e){return function(...t){var r=t[0];return r.stopPropagation(),e==null?undefined:e.apply(this,t)}}function qt(e=false){const t=re,r=t.l.u;if(!r)return;let n=()=>Ct(t.s);if(e){let i=0,a={};const s=Nr(()=>{let c=false;const v=t.s;for(const d in v)v[d]!==a[d]&&(a[d]=v[d],c=true);return c&&i++,i});n=()=>l(s);}r.b.length&&Vs(()=>{ji(t,n),ei(r.b);}),ri(()=>{const i=H(()=>r.m.map(es));return ()=>{for(const a of i)typeof a=="function"&&a();}}),r.a.length&&ri(()=>{ji(t,n),ei(r.a);});}function ji(e,t){if(e.l.s)for(const r of e.l.s)l(r);t();}function _o(e){var t=Ve(0);return function(){return arguments.length===1?(I(t,l(t)+1),arguments[0]):(l(t),e())}}function Gi(e,t){var a;var r=(a=e.$$events)==null?undefined:a[t.type],n=yn(r)?r.slice():r==null?[]:[r];for(var i of n)i.call(this,t);}function qa(e,t,r){if(e==null)return t(undefined),Re;const n=H(()=>e.subscribe(t,r));return n.unsubscribe?()=>n.unsubscribe():n}const Pt=[];function $n(e,t=Re){let r=null;const n=new Set;function i(c){if(aa(e,c)&&(e=c,r)){const v=!Pt.length;for(const d of n)d[1](),Pt.push(d,e);if(v){for(let d=0;d<Pt.length;d+=2)Pt[d][0](Pt[d+1]);Pt.length=0;}}}function a(c){i(c(e));}function s(c,v=Re){const d=[c,v];return n.add(d),n.size===1&&(r=t(i,a)||Re),c(e),()=>{n.delete(d),n.size===0&&r&&(r(),r=null);}}return {set:i,update:a,subscribe:s}}function sn(e){let t;return qa(e,r=>t=r)(),t}let yr=false,ci=Symbol();function ie(e,t,r){const n=r[t]??(r[t]={store:null,source:Cn(undefined),unsubscribe:Re});if(n.store!==e&&!(ci in r))if(n.unsubscribe(),n.store=e??null,e==null)n.source.v=undefined,n.unsubscribe=Re;else {var i=true;n.unsubscribe=qa(e,a=>{i?n.source.v=a:I(n.source,a);}),i=false;}return e&&ci in r?sn(e):l(n.source)}function he(e,t){return e.set(t),t}function rr(){const e={};function t(){xi(()=>{for(var r in e)e[r].unsubscribe();Ki(e,ci,{enumerable:false,value:true});});}return [e,t]}function _e(e,t,r){return e.set(r),t}function rn(){yr=true;}function ho(e){var t=yr;try{return yr=!1,[e(),yr]}finally{yr=t;}}function Ui(e){for(var t=J,r=J;t!==null&&!(t.f&(Ge|Xt));)t=t.parent;try{return He(t),e()}finally{He(r);}}function ve(e,t,r,n){var T;var i=(r&ps)!==0,a=!Jt||(r&ms)!==0,s=(r&ys)!==0,c=(r&ws)!==0,v=false,d;s?[d,v]=ho(()=>e[t]):d=e[t];var _=Nt in e||ns in e,o=s&&(((T=Mt(e,t))==null?undefined:T.set)??(_&&t in e&&(x=>e[t]=x)))||undefined,u=n,f=true,p=false,m=()=>(p=true,f&&(f=false,c?u=H(n):u=n),u);d===undefined&&n!==undefined&&(o&&a&&cs(),d=m(),o&&o(d));var N;if(a)N=()=>{var x=e[t];return x===undefined?m():(f=true,p=false,x)};else {var S=Ui(()=>(i?Nr:tt)(()=>e[t]));S.f|=ts,N=()=>{var x=l(S);return x!==undefined&&(u=undefined),x===undefined?u:x};}if(!(r&bs))return N;if(o){var C=e.$$legacy;return function(x,M){return arguments.length>0?((!a||!M||C||v)&&o(M?N():x),x):N()}}var b=false,P=false,k=Cn(d),E=Ui(()=>Nr(()=>{var x=N(),M=l(k);return b?(b=!1,P=!0,M):(P=!1,k.v=x)}));return i||(E.equals=pi),function(x,M){if(arguments.length>0){const A=M?l(E):a&&s?Ht(x):x;return E.equals(A)||(b=true,I(k,A),p&&u!==undefined&&(u=A),H(()=>l(E))),x}return l(E)}}function Sn(e){re===null&&wa(),Jt&&re.l!==null?go(re).m.push(e):ri(()=>{const t=H(e);if(typeof t=="function")return t});}function Va(e){re===null&&wa(),Sn(()=>()=>H(e));}function go(e){var t=e.l;return t.u??(t.u={a:[],b:[],m:[]})}const po="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(po);_s();const mo=e=>e;function Gt(e,{delay:t=0,duration:r=400,easing:n=mo}={}){const i=+getComputedStyle(e).opacity;return {delay:t,duration:r,easing:n,css:a=>`opacity: ${a*i}`}}function xt(e,t=()=>{}){if(!e)return;const r=document.querySelector(e);if(r){t(r);return}new MutationObserver((i,a)=>{const s=document.querySelector(e);s&&(a.disconnect(),t(s));}).observe(document.documentElement,{childList:true,subtree:true});}function Rt(e){if(typeof e=="string")try{const t=JSON.parse(e);return Rt(t)}catch{return e}if(Array.isArray(e))return e.map(t=>Rt(t));if(e!==null&&typeof e=="object"){const t={};for(const r in e)e.hasOwnProperty(r)&&(t[r]=Rt(e[r]));return t}return e}window.__JsonParse=Rt;function Ft(e){if(!e)return "inherit";let t=e.toString().trim();if(t.startsWith("var(")){const s=t.match(/var\(([^)]+)\)/);if(s){const c=s[1],v=getComputedStyle(document.documentElement).getPropertyValue(c).trim();if(v)t=v;else return "inherit"}}if(t.startsWith("rgba(")||t.startsWith("rgb(")){const s=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);if(s){const[,c,v,d]=s;return (parseInt(c)*299+parseInt(v)*587+parseInt(d)*114)/1e3<128?"#FFFFFF":"#000000"}}t=t.replace("#","");let r,n,i;if(t.length===3)r=parseInt(t[0]+t[0],16),n=parseInt(t[1]+t[1],16),i=parseInt(t[2]+t[2],16);else if(t.length===6)r=parseInt(t.substr(0,2),16),n=parseInt(t.substr(2,2),16),i=parseInt(t.substr(4,2),16);else if(t.length===8)r=parseInt(t.substr(0,2),16),n=parseInt(t.substr(2,2),16),i=parseInt(t.substr(4,2),16);else return "inherit";return (r*299+n*587+i*114)/1e3<128?"#FFFFFF":"#000000"}const Ia="Kesa:Fall",Yi=()=>{try{return Rt(localStorage.getItem(Ia))??{}}catch{return {}}},Te=(e,t)=>{const r=Yi(),n=e in r?r[e]:t,{subscribe:i,set:a,update:s}=$n(n);return i(c=>{const v=Yi();localStorage.setItem(Ia,JSON.stringify({...v,[e]:c}));}),{subscribe:i,set:c=>{typeof c=="function"?s(c):a(c);},update:s}},on=$n(0),Ta=$n(""),Er=Te("_isFallView",true),wr=$n(0),ui=Te("_panelPos",{x:0,y:0}),vi=Te("_show_hover_pic",1),Lr=Te("_state_hover_pic",false),di=Te("_pic_failed_showInfo",1),xr=Te("_card_layout",{min:300,max:600,gap:8}),Ae=Te("_card_detail",{all:false,category:true,title:false,topping:true,free:true,size:true,sub_title:false,tags:false,download_collect:false,upload_time:false,statistics:false}),bo=Te("_show_nexus_pic",1),fi=Te("_block_gay",1),ln=Te("_card_radius",{enabled:true,value:16}),Aa=Te("_mt_label",{}),za=Te("_mt_categories",{}),Lt=Te("_textColor",{t1:"black",t2:"black",t3:"black"});function yo(e={path:"/search",method:"POST"}){const t=XMLHttpRequest.prototype.open,r=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(n,i){return this._requestMetadata={method:n.toUpperCase(),url:i,isTarget:i.includes(e.path)&&n.toUpperCase()===e.method},t.apply(this,arguments)},XMLHttpRequest.prototype.send=function(n){var i;if((i=this._requestMetadata)!=null&&i.isTarget){const a=this.onreadystatechange,s=this.onload;this.addEventListener("readystatechange",()=>{this.readyState===4&&this._captureResponseData(),a==null||a.call(this);}),this.onload=d=>{this._captureResponseData(),s==null||s.call(this,d);};const c={url:this._requestMetadata.url,body:n instanceof Document?n.documentElement.outerHTML:n},v=new CustomEvent(`req>${e.method}->${e.path}`,{detail:c});window.dispatchEvent(v);}return r.apply(this,arguments)},XMLHttpRequest.prototype._captureResponseData=function(){if(!this._hasCaptured&&this._requestMetadata.isTarget){try{const n={status:this.status,headers:this.getAllResponseHeaders(),data:this._parseResponse()},i=new CustomEvent(`res>${e.method}->${e.path}`,{detail:n});window.dispatchEvent(i);}catch(n){console.error("<PT-Fall> Capture failed:",n);}this._hasCaptured=true;}},XMLHttpRequest.prototype._parseResponse=function(){var n;try{switch(this.responseType){case "json":return this.response;case "document":return (n=this.responseXML)==null?void 0:n.documentElement.outerHTML;case "arraybuffer":return new Uint8Array(this.response);case "blob":return URL.createObjectURL(this.response);default:return this.responseText}}catch{return this.responseText}};}function wo(e){const t=e-1;return t*t*t+1}function xo(e,{from:t,to:r},n={}){var{delay:i=0,duration:a=E=>Math.sqrt(E)*120,easing:s=wo}=n,c=getComputedStyle(e),v=c.transform==="none"?"":c.transform,[d,_]=c.transformOrigin.split(" ").map(parseFloat);d/=e.clientWidth,_/=e.clientHeight;var o=Co(e),u=e.clientWidth/r.width/o,f=e.clientHeight/r.height/o,p=t.left+t.width*d,m=t.top+t.height*_,N=r.left+r.width*d,S=r.top+r.height*_,C=(p-N)*u,b=(m-S)*f,P=t.width/r.width,k=t.height/r.height;return {delay:i,duration:typeof a=="function"?a(Math.sqrt(C*C+b*b)):a,easing:s,css:(E,T)=>{var x=T*C,M=T*b,A=E+T*P,O=E+T*k;return `transform: ${v} translate(${x}px, ${M}px) scale(${A}, ${O});`}}}function Co(e){if("currentCSSZoom"in e)return e.currentCSSZoom;for(var t=e,r=1;t!==null;)r*=+getComputedStyle(t).zoom,t=t.parentElement;return r}var ko=z('<span class="svelte-b2jtby"> </span>'),Eo=z('<div class="svelte-b2jtby"><!></div>'),Lo=z('<span class="svelte-b2jtby"> </span>'),Mo=z("<div><!></div>"),No=z("<div></div>");function $o(e,t){pt(t,false);const r=X(),n=X();let i=ve(t,"animate",8,true),a=ve(t,"columnClass",24,()=>""),s=ve(t,"duration",8,200),c=ve(t,"gap",8,20),v=ve(t,"getId",8,C=>typeof C=="number"||typeof C=="string"?C:C[d()]),d=ve(t,"idKey",24,()=>"id"),_=ve(t,"items",8),o=ve(t,"masonryHeight",12,0),u=ve(t,"masonryWidth",12,0),f=ve(t,"maxColWidth",8,500),p=ve(t,"minColWidth",8,330),m=ve(t,"style",24,()=>""),N=ve(t,"class",24,()=>"");_t(()=>(Ct(_()),Ct(u()),Ct(p()),Ct(c())),()=>{I(r,Math.min(_().length,Math.floor(u()/(p()+c()))||1));}),_t(()=>(Ct(_()),l(r)),()=>{I(n,_().reduce((C,b,P)=>(C[P%C.length].push([b,P]),C),Array(l(r)).fill(null).map(()=>[])));}),Ar(),qt();var S=No();Et(S,5,()=>l(n),mr,(C,b)=>{var P=Mo(),k=h(P);{var E=x=>{var M=dt(),A=$e(M);Et(A,9,()=>l(b),([O,w])=>v()(O),(O,w)=>{let q=()=>l(w)[0],F=()=>l(w)[1];var D=Eo(),ne=h(D);Ri(ne,t,"default",{get idx(){return F()},get item(){return q()}},le=>{var se=ko(),me=h(se);Y(()=>K(me,q())),L(le,se);}),jt(1,D,()=>Gt,()=>({delay:100,duration:s()})),jt(2,D,()=>Gt,()=>({delay:0,duration:s()})),vo(D,()=>xo,()=>({duration:s()})),L(O,D);}),L(x,M);},T=x=>{var M=dt(),A=$e(M);Et(A,1,()=>l(b),([O,w])=>v()(O),(O,w)=>{let q=()=>l(w)[0],F=()=>l(w)[1];var D=dt(),ne=$e(D);Ri(ne,t,"default",{get idx(){return F()},get item(){return q()}},le=>{var se=Lo(),me=h(se);Y(()=>K(me,q())),L(le,se);}),L(O,D);}),L(x,M);};Z(k,x=>{i()?x(E):x(T,false);});}Y(()=>{Di(P,`col ${a()??""} svelte-b2jtby`),$(P,"style",`gap: ${c()??""}px; max-width: ${f()??""}px;`);}),L(C,P);}),Y(()=>{Di(S,`masonry ${N()??""} svelte-b2jtby`),$(S,"style",`gap: ${c()??""}px; ${m()??""}`);}),Zi(S,"clientWidth",u),Zi(S,"clientHeight",o),L(e,S),mt();}var ze=function(){return ze=Object.assign||function(t){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a]);}return t},ze.apply(this,arguments)},So=function(){function e(t){this.options=t,this.listeners={};}return e.prototype.on=function(t,r){var n=this.listeners[t]||[];this.listeners[t]=n.concat([r]);},e.prototype.triggerEvent=function(t,r){var n=this,i=this.listeners[t]||[];i.forEach(function(a){return a({target:n,event:r})});},e}(),Ut;(function(e){e[e.Add=0]="Add",e[e.Remove=1]="Remove";})(Ut||(Ut={}));var qo=function(){function e(){this.notifications=[];}return e.prototype.push=function(t){this.notifications.push(t),this.updateFn(t,Ut.Add,this.notifications);},e.prototype.splice=function(t,r){var n=this.notifications.splice(t,r)[0];return this.updateFn(n,Ut.Remove,this.notifications),n},e.prototype.indexOf=function(t){return this.notifications.indexOf(t)},e.prototype.onUpdate=function(t){this.updateFn=t;},e}(),ft;(function(e){e.Dismiss="dismiss",e.Click="click";})(ft||(ft={}));var Xi={types:[{type:"success",className:"notyf__toast--success",backgroundColor:"#3dc763",icon:{className:"notyf__icon--success",tagName:"i"}},{type:"error",className:"notyf__toast--error",backgroundColor:"#ed3d3d",icon:{className:"notyf__icon--error",tagName:"i"}}],duration:2e3,ripple:true,position:{x:"right",y:"bottom"},dismissible:false},Vo=function(){function e(){this.notifications=[],this.events={},this.X_POSITION_FLEX_MAP={left:"flex-start",center:"center",right:"flex-end"},this.Y_POSITION_FLEX_MAP={top:"flex-start",center:"center",bottom:"flex-end"};var t=document.createDocumentFragment(),r=this._createHTMLElement({tagName:"div",className:"notyf"});t.appendChild(r),document.body.appendChild(t),this.container=r,this.animationEndEventName=this._getAnimationEndEventName(),this._createA11yContainer();}return e.prototype.on=function(t,r){var n;this.events=ze(ze({},this.events),(n={},n[t]=r,n));},e.prototype.update=function(t,r){r===Ut.Add?this.addNotification(t):r===Ut.Remove&&this.removeNotification(t);},e.prototype.removeNotification=function(t){var r=this,n=this._popRenderedNotification(t),i;if(n){i=n.node,i.classList.add("notyf__toast--disappear");var a;i.addEventListener(this.animationEndEventName,a=function(s){s.target===i&&(i.removeEventListener(r.animationEndEventName,a),r.container.removeChild(i));});}},e.prototype.addNotification=function(t){var r=this._renderNotification(t);this.notifications.push({notification:t,node:r}),this._announce(t.options.message||"Notification");},e.prototype._renderNotification=function(t){var r,n=this._buildNotificationCard(t),i=t.options.className;return i&&(r=n.classList).add.apply(r,i.split(" ")),this.container.appendChild(n),n},e.prototype._popRenderedNotification=function(t){for(var r=-1,n=0;n<this.notifications.length&&r<0;n++)this.notifications[n].notification===t&&(r=n);if(r!==-1)return this.notifications.splice(r,1)[0]},e.prototype.getXPosition=function(t){var r;return ((r=t==null?undefined:t.position)===null||r===undefined?undefined:r.x)||"right"},e.prototype.getYPosition=function(t){var r;return ((r=t==null?undefined:t.position)===null||r===undefined?undefined:r.y)||"bottom"},e.prototype.adjustContainerAlignment=function(t){var r=this.X_POSITION_FLEX_MAP[this.getXPosition(t)],n=this.Y_POSITION_FLEX_MAP[this.getYPosition(t)],i=this.container.style;i.setProperty("justify-content",n),i.setProperty("align-items",r);},e.prototype._buildNotificationCard=function(t){var r=this,n=t.options,i=n.icon;this.adjustContainerAlignment(n);var a=this._createHTMLElement({tagName:"div",className:"notyf__toast"}),s=this._createHTMLElement({tagName:"div",className:"notyf__ripple"}),c=this._createHTMLElement({tagName:"div",className:"notyf__wrapper"}),v=this._createHTMLElement({tagName:"div",className:"notyf__message"});v.innerHTML=n.message||"";var d=n.background||n.backgroundColor;if(i){var _=this._createHTMLElement({tagName:"div",className:"notyf__icon"});if((typeof i=="string"||i instanceof String)&&(_.innerHTML=new String(i).valueOf()),typeof i=="object"){var o=i.tagName,u=o===undefined?"i":o,f=i.className,p=i.text,m=i.color,N=m===undefined?d:m,S=this._createHTMLElement({tagName:u,className:f,text:p});N&&(S.style.color=N),_.appendChild(S);}c.appendChild(_);}if(c.appendChild(v),a.appendChild(c),d&&(n.ripple?(s.style.background=d,a.appendChild(s)):a.style.background=d),n.dismissible){var C=this._createHTMLElement({tagName:"div",className:"notyf__dismiss"}),b=this._createHTMLElement({tagName:"button",className:"notyf__dismiss-btn"});C.appendChild(b),c.appendChild(C),a.classList.add("notyf__toast--dismissible"),b.addEventListener("click",function(k){var E,T;(T=(E=r.events)[ft.Dismiss])===null||T===undefined||T.call(E,{target:t,event:k}),k.stopPropagation();});}a.addEventListener("click",function(k){var E,T;return (T=(E=r.events)[ft.Click])===null||T===undefined?undefined:T.call(E,{target:t,event:k})});var P=this.getYPosition(n)==="top"?"upper":"lower";return a.classList.add("notyf__toast--"+P),a},e.prototype._createHTMLElement=function(t){var r=t.tagName,n=t.className,i=t.text,a=document.createElement(r);return n&&(a.className=n),a.textContent=i||null,a},e.prototype._createA11yContainer=function(){var t=this._createHTMLElement({tagName:"div",className:"notyf-announcer"});t.setAttribute("aria-atomic","true"),t.setAttribute("aria-live","polite"),t.style.border="0",t.style.clip="rect(0 0 0 0)",t.style.height="1px",t.style.margin="-1px",t.style.overflow="hidden",t.style.padding="0",t.style.position="absolute",t.style.width="1px",t.style.outline="0",document.body.appendChild(t),this.a11yContainer=t;},e.prototype._announce=function(t){var r=this;this.a11yContainer.textContent="",setTimeout(function(){r.a11yContainer.textContent=t;},100);},e.prototype._getAnimationEndEventName=function(){var t=document.createElement("_fake"),r={MozTransition:"animationend",OTransition:"oAnimationEnd",WebkitTransition:"webkitAnimationEnd",transition:"animationend"},n;for(n in r)if(t.style[n]!==undefined)return r[n];return "animationend"},e}(),Pa=function(){function e(t){var r=this;this.dismiss=this._removeNotification,this.notifications=new qo,this.view=new Vo;var n=this.registerTypes(t);this.options=ze(ze({},Xi),t),this.options.types=n,this.notifications.onUpdate(function(i,a){return r.view.update(i,a)}),this.view.on(ft.Dismiss,function(i){var a=i.target,s=i.event;r._removeNotification(a),a.triggerEvent(ft.Dismiss,s);}),this.view.on(ft.Click,function(i){var a=i.target,s=i.event;return a.triggerEvent(ft.Click,s)});}return e.prototype.error=function(t){var r=this.normalizeOptions("error",t);return this.open(r)},e.prototype.success=function(t){var r=this.normalizeOptions("success",t);return this.open(r)},e.prototype.open=function(t){var r=this.options.types.find(function(a){var s=a.type;return s===t.type})||{},n=ze(ze({},r),t);this.assignProps(["ripple","position","dismissible"],n);var i=new So(n);return this._pushNotification(i),i},e.prototype.dismissAll=function(){for(;this.notifications.splice(0,1););},e.prototype.assignProps=function(t,r){var n=this;t.forEach(function(i){r[i]=r[i]==null?n.options[i]:r[i];});},e.prototype._pushNotification=function(t){var r=this;this.notifications.push(t);var n=t.options.duration!==undefined?t.options.duration:this.options.duration;n&&setTimeout(function(){return r._removeNotification(t)},n);},e.prototype._removeNotification=function(t){var r=this.notifications.indexOf(t);r!==-1&&this.notifications.splice(r,1);},e.prototype.normalizeOptions=function(t,r){var n={type:t};return typeof r=="string"?n.message=r:typeof r=="object"&&(n=ze(ze({},n),r)),n},e.prototype.registerTypes=function(t){var r=(t&&t.types||[]).slice(),n=Xi.types.map(function(i){var a=-1;r.forEach(function(c,v){c.type===i.type&&(a=v);});var s=a!==-1?r.splice(a,1)[0]:{};return ze(ze({},i),s)});return n.concat(r)},e}();new Pa({duration:5e3,dismissible:true});const Dt=new Pa({duration:3e3,dismissible:true,position:{x:"left",y:"top"},types:[{type:"warning",background:"orange",icon:false}]}),Io="data:image/svg+xml,%3csvg%20stroke='currentColor'%20fill='currentColor'%20stroke-width='0'%20viewBox='0%200%2024%2024'%20height='25'%20width='25'%20xmlns='http://www.w3.org/2000/svg'%20style='%20vertical-align:%20middle;%20--darkreader-inline-fill:%20currentColor;%20--darkreader-inline-stroke:%20currentColor;'%20%3e%3cpath%20d='M12%205c-3.859%200-7%203.141-7%207s3.141%207%207%207%207-3.141%207-7-3.141-7-7-7zm0%2012c-2.757%200-5-2.243-5-5s2.243-5%205-5%205%202.243%205%205-2.243%205-5%205z'%3e%3c/path%3e%3cpath%20d='M12%209c-1.627%200-3%201.373-3%203s1.373%203%203%203%203-1.373%203-3-1.373-3-3-3z'%3e%3c/path%3e%3c/svg%3e",To="data:image/svg+xml,%3csvg%20viewBox='64%2064%20896%20896'%20focusable='false'%20data-icon='arrow-up'%20width='1em'%20height='1em'%20fill='green'%20aria-hidden='true'%20xmlns='http://www.w3.org/2000/svg'%20%3e%3cpath%20d='M868%20545.5L536.1%20163a31.96%2031.96%200%2000-48.3%200L156%20545.5a7.97%207.97%200%20006%2013.2h81c4.6%200%209-2%2012.1-5.5L474%20300.9V864c0%204.4%203.6%208%208%208h60c4.4%200%208-3.6%208-8V300.9l218.9%20252.3c3%203.5%207.4%205.5%2012.1%205.5h81c6.8%200%2010.5-8%206-13.2z'%3e%3c/path%3e%3c/svg%3e",Ao="data:image/svg+xml,%3csvg%20viewBox='64%2064%20896%20896'%20focusable='false'%20data-icon='arrow-down'%20width='1em'%20height='1em'%20fill='red'%20aria-hidden='true'%20xmlns='http://www.w3.org/2000/svg'%20%3e%3cpath%20d='M862%20465.3h-81c-4.6%200-9%202-12.1%205.5L550%20723.1V160c0-4.4-3.6-8-8-8h-60c-4.4%200-8%203.6-8%208v563.1L255.1%20470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8%200-10.5%208.1-6%2013.2L487.9%20861a31.96%2031.96%200%200048.3%200L868%20478.5c4.5-5.2.8-13.2-6-13.2z'%3e%3c/path%3e%3c/svg%3e",zo="data:image/svg+xml,%3csvg%20viewBox='64%2064%20896%20896'%20focusable='false'%20data-icon='download'%20width='1em'%20height='1em'%20fill='currentColor'%20aria-hidden='true'%20xmlns='http://www.w3.org/2000/svg'%20%3e%3cpath%20d='M505.7%20661a8%208%200%200012.6%200l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4%200-8%203.6-8%208v338.3H400c-6.7%200-10.4%207.7-6.3%2012.9l112%20141.8zM878%20626h-60c-4.4%200-8%203.6-8%208v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4%200-8%203.6-8%208v198c0%2017.7%2014.3%2032%2032%2032h684c17.7%200%2032-14.3%2032-32V634c0-4.4-3.6-8-8-8z'%3e%3c/path%3e%3c/svg%3e",Po="data:image/svg+xml,%3csvg%20viewBox='64%2064%20896%20896'%20focusable='false'%20data-icon='star'%20width='1em'%20height='1em'%20fill='currentColor'%20aria-hidden='true'%20xmlns='http://www.w3.org/2000/svg'%20%3e%3cpath%20d='M908.1%20353.1l-253.9-36.9L540.7%2086.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9%2014.5L369.8%20316.2l-253.9%2036.9c-7%201-13.4%204.3-18.3%209.3a32.05%2032.05%200%2000.6%2045.3l183.7%20179.1-43.4%20252.9a31.95%2031.95%200%200046.4%2033.7L512%20754l227.1%20119.4c6.2%203.3%2013.4%204.4%2020.3%203.2%2017.4-3%2029.1-19.5%2026.1-36.9l-43.4-252.9%20183.7-179.1c5-4.9%208.3-11.3%209.3-18.3%202.7-17.5-9.5-33.7-27-36.3z'%3e%3c/path%3e%3c/svg%3e",Ho="data:image/svg+xml,%3csvg%20viewBox='0%200%2024%2024'%20xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cstyle%3e%20.cls-1{fill:%232eb1b7;}%20.cls-2{fill:%2356b54e;}%20.cls-3{fill:%235dc6d1;}%20.cls-4{fill:%2360cc5a;}%20.cls-5{fill:%23ffce69;}%20.cls-6{fill:%236c2e7c;}%20%3c/style%3e%3c/defs%3e%3cg%20id='Icons'%3e%3crect%20class='cls-1'%20height='22'%20rx='4'%20width='22'%20x='1'%20y='1'/%3e%3cpath%20class='cls-2'%20d='M23,18v1a4,4,0,0,1-4,4H5a4,4,0,0,1-3.9-3.1l7.19-7.19a1.008,1.008,0,0,1,1.42,0l1.8,1.8a1,1,0,0,0,1.46-.05l2.33-2.65a1,1,0,0,1,1.46-.05Z'/%3e%3cpath%20class='cls-3'%20d='M23,5v9a4.025,4.025,0,0,1-1.17,2.83l-5.07-5.07a1,1,0,0,0-1.46.05l-2.33,2.65a1,1,0,0,1-1.46.05l-1.8-1.8a1.008,1.008,0,0,0-1.42,0L3.36,17.64A3.988,3.988,0,0,1,1,14V5A4,4,0,0,1,5,1H19A4,4,0,0,1,23,5Z'/%3e%3cpath%20class='cls-4'%20d='M21.83,16.83A4.025,4.025,0,0,1,19,18H5a3.931,3.931,0,0,1-1.64-.36l4.93-4.93a1.008,1.008,0,0,1,1.42,0l1.8,1.8a1,1,0,0,0,1.46-.05l2.33-2.65a1,1,0,0,1,1.46-.05Z'/%3e%3ccircle%20class='cls-5'%20cx='7'%20cy='7'%20r='2'/%3e%3c/g%3e%3cg%20data-name='Layer%204'%20id='Layer_4'%3e%3cpath%20class='cls-6'%20d='M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0Zm3,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H19a3,3,0,0,1,3,3Z'/%3e%3cpath%20class='cls-6'%20d='M7,10A3,3,0,1,0,4,7,3,3,0,0,0,7,10ZM7,6A1,1,0,1,1,6,7,1,1,0,0,1,7,6Z'/%3e%3cpath%20class='cls-6'%20d='M16.707,10.293a.956.956,0,0,0-.74-.293,1.006,1.006,0,0,0-.72.341L12.217,13.8l-2.51-2.511a1,1,0,0,0-1.414,0l-4,4a1,1,0,1,0,1.414,1.414L9,13.414l1.9,1.9L8.247,18.341a1,1,0,0,0,1.506,1.318l3.218-3.678.006,0,.007-.011,3.065-3.5,2.244,2.244a1,1,0,0,0,1.414-1.414Z'/%3e%3c/g%3e%3c/svg%3e",j="https://static.m-team.cc/static/cate/",Bt={architecture:"Mteam",TL_Selector:"div.app-content__inner",LOADING_PIC:"/static/media/logo.80b63235eaf702e44a8d.png",HOST:"https://test2.m-team.cc",API:{search:{url:"/search",fullUrl:"/api/torrent/search",method:"POST"}},ICON:{SIZE:Io,SEEDERS:To,LEECHERS:Ao,DOWNLOAD:zo,COLLECTION:Po,PIN:"/static/trans.gif",PREVIEW:Ho},CATEGORY:{401:{src:j+"moviesd.png",alt:"電影/SD",color:"#c74854"},402:{src:j+"tvhd.png",alt:"影劇/綜藝/HD",color:"#276fb8"},403:{src:j+"tvsd.png",alt:"影劇/綜藝/SD",color:"#c74854"},404:{src:j+"bbc.png",alt:"紀錄",color:"#23ac38"},405:{src:j+"anime.png",alt:"動畫",color:"#996c34"},406:{src:j+"mv.png",alt:"演唱",color:"#8a57a1"},407:{src:j+"sport.png",alt:"運動",color:"#23ac38"},409:{src:j+"other.png",alt:"Misc(其他)",color:"#996c34"},419:{src:j+"moviehd.png",alt:"電影/HD",color:"#c01a20"},420:{src:j+"moviedvd.png",alt:"電影/DVDiSo",color:"#c74854"},421:{src:j+"moviebd.png",alt:"電影/Blu-Ray",color:"#00a0e9"},422:{src:j+"software.png",alt:"軟體",color:"#f39800"},423:{src:j+"game-pc-3.jpeg",alt:"PC遊戲",color:"#f39800"},427:{src:j+"Study.png",alt:"教育(書面)",color:"#7FC269"},434:{src:j+"flac.png",alt:"Music(無損)",color:"#8a57a1"},435:{src:j+"tvdvd.png",alt:"影劇/綜藝/DVDiSo",color:"#4dbebd"},438:{src:j+"tvbd.png",alt:"影劇/綜藝/BD",color:"#1897d6"},439:{src:j+"movieremux.png",alt:"電影/Remux",color:"#1b2a51"},451:{src:j+"Study_Video.png",alt:"教育(影片)",color:"#7FC269"},442:{src:j+"Study_Audio.png",alt:"有聲書",color:"#7FC269"},448:{src:j+"pcgame.png",alt:"TV遊戲",color:"#f39800"},410:{src:j+"cenhd.png",alt:"AV(有碼)/HD Censored",color:"#F520CB"},411:{src:j+"hgame.png",alt:"H-遊戲",color:"#f49800"},412:{src:j+"hanime.png",alt:"H-動畫",color:"#f49800"},413:{src:j+"hcomic.png",alt:"H-漫畫",color:"#f49800"},424:{src:j+"censd.png",alt:"AV(有碼)/SD Censored",color:"#DA55A9"},425:{src:j+"ivvideo.png",alt:"IV(寫真影集)",color:"#bb1e9a"},426:{src:j+"uendvd.png",alt:"AV(無碼)/DVDiSo Uncensored",color:"#f77afa"},429:{src:j+"uenhd.png",alt:"AV(無碼)/HD Uncensored",color:"#f52bcb"},430:{src:j+"uensd.png",alt:"AV(無碼)/SD Uncensored",color:"#db55a9"},431:{src:j+"cenbd.png",alt:"AV(有碼)/Blu-Ray Censored",color:"#19a7ec"},432:{src:j+"uenbd.png",alt:"AV(無碼)/Blu-Ray Uncensored",color:"#19a7ec"},433:{src:j+"ivpic.png",alt:"IV(寫真圖集)",color:"#bb1e9a"},436:{src:j+"adult0day.png",alt:"AV(網站)/0Day",color:"#bb1e9a"},437:{src:j+"cendvd.png",alt:"AV(有碼)/DVDiSo Censored",color:"#f77afa"},440:{src:j+"gayhd.gif",alt:"AV(Gay)/HD",color:"#f52bcb"}},TAG:{"4k":{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},"8k":{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},hdr:{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},hdr10:{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},"hdr10+":{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},hlg:{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},DoVi:{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},HDRVi:{color:"#4e5561",bgColor:"#ffffff8f",colorV2:"#4a5156",bgColorV2:"#e9e9e9"},中字:{color:"#ad2a2a",bgColor:"#d14a4a2e"},中配:{color:"#5b3991",bgColor:"#5b399129"}},INDEX:0,Iframe_Width:1260,get_bg_color:function(){const e=getComputedStyle(document.documentElement).getPropertyValue("--background-2"),t=getComputedStyle(document.documentElement).getPropertyValue("--bg-3");return e||t||"#000000"},special:function(){let e=Oo(),t=Ro();return e&&t},pageLoaded:function(){}};function Oo(){const e=Array.from(document.querySelectorAll(".ant-table-row-level-0 .ant-col a[href]"));return e.forEach(function(t){t.addEventListener("click",function(r){r.preventDefault(),_iframe_switch.set(1),_iframe_url.set(t.href);});}),e.length}function Ro(){document.querySelectorAll(".ant-image-mask").forEach(r=>{r.remove();});const t=Array.from(document.querySelectorAll(".torrent-list__thumbnail"));return t.forEach(r=>{r.classList+=" preview_Origin";}),t.length}const Mi=".preview_Origin";document.body.addEventListener("mouseover",function(e){if(e.target.matches(Mi)){const t=e,r=e.target;handleMouseOver(t,r);}});document.body.addEventListener("mouseout",function(e){e.target.matches(Mi)&&handleMouseOut(e);});document.body.addEventListener("mousemove",function(e){if(e.target.matches(Mi)){const t=e.target;handleMouseMove(e,t);}});var Fo=tr('<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><path d="M7 7h10v2H7zm0 4h7v2H7z"></path><path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path></svg>');function Qi(e){var t=Fo();L(e,t);}const Be=class Be{static getInstance(){return Be.instance||(Be.instance=new Be),Be.instance}constructor(){if(Be.instance)return Be.instance;Be.instance=this,this.container=null,this.imgElements=null,this.img_bg=null,this.img_main=null,this.unsubscribe=null,this.init(),this.unsubscribe=Lr.subscribe(t=>{this.container&&(console.log(`[HoverView]<${Date.now()}> _state_hover_pic changed to ${t}, clearing preview`),this.img_main&&(this.img_main.style.objectFit=t?"contain":"scale-down"));});}init(){this.container=document.querySelector(".kp_container")||this.createPreview(),document.body.appendChild(this.container);}createPreview(){const t=Object.assign(document.createElement("div"),{className:"kp_container",style:`
      background-color: rgba(0,0,0,0.8);
      opacity: 1;
      position: fixed;
      z-index: 10000;
      pointer-events: none;
      transition: all .3s;
      display: none;
      `});return this.img_main=Object.assign(document.createElement("img"),{className:"kp_img",style:`
      position: absolute;
      z-index: 10002;
      pointer-events: none;
      width: 100%;
      height: 100%;
      object-fit: ${sn(Lr)?"contain":"scale-down"};
      `}),t.appendChild(this.img_main),this.img_bg=Object.assign(document.createElement("img"),{className:"kp_img",style:`
      position: absolute;
      z-index: 10001;
      pointer-events: none;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(8px);
      opacity: 0.9;
      `}),t.appendChild(this.img_bg),t}handleMouseOver(t,r){if(this.container){if(!r){console.warn("[FALL]: imgEle is null");return}if(this.img_main&&(this.img_main.style.objectFit=sn(Lr)?"contain":"scale-down"),sn(bo)){const n=r.getAttribute("src");n&&(document.querySelectorAll(".kp_img").forEach(a=>{a.setAttribute("src",n);}),this.imgElements=r,this.updatePosition(t),this.container.style.display="block");}}}handleMouseMove(t){this.container&&this.container.style.display==="block"&&this.updatePosition(t);}updatePosition(t){const r=this.previewPosition(t);this.container.style.left=r.left,this.container.style.top=r.top,this.container.style.width=r.width,this.container.style.height=r.height;}previewPosition(t){let r=0,n=0;try{r=this.imgElements.naturalWidth,n=this.imgElements.naturalHeight;}catch{}const i=t.clientX,a=t.clientY,s=window.innerWidth,c=window.innerHeight,v={bot:{width:s,height:window.innerHeight-a},top:{width:s,height:a},right:{width:window.innerWidth-i,height:c},left:{width:i,height:c}};let d=0,_="";const o={top:{left:0,top:0,width:s+"px",height:a+"px"},bot:{left:0,top:a+"px",width:s+"px",height:window.innerHeight-a+"px"},left:{left:0,top:0,width:i+"px",height:c+"px"},right:{left:i+"px",top:0,width:window.innerWidth-i+"px",height:c+"px"}};for(const u in v){const f=Math.min(v[u].width/r,v[u].height/n);f>d&&(d=f,_=u);}return o[_]||{left:0,top:0,width:0,height:0}}clearPreview(){document.querySelectorAll(".kp_img").forEach(t=>{t.setAttribute("src","");}),this.container&&(this.container.style.display="none");}changeState(){if(this.img_main){let t=this.img_main.style.objectFit;this.img_main.style.objectFit=t=="contain"?"scale-down":"contain";}}destroy(){this.container&&(this.container.style.display="none",this.clearPreview()),this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null);}};Un(Be,"instance",null);let Yt=Be;function Do(){document.querySelectorAll(".kp_img").forEach(t=>{t.setAttribute("src","");});const e=document.querySelector(".kp_container");e&&(e.style.display="none");}window.__clearPreview=Do;Yt.getInstance();const Bo="data:image/svg+xml,%3csvg%20width='256px'%20height='256px'%20viewBox='0%200%2024.00%2024.00'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%20transform='matrix(1,%200,%200,%201,%200,%200)'%20%3e%3cg%20id='SVGRepo_bgCarrier'%20stroke-width='0'%20transform='translate(0,0),%20scale(1)'%20/%3e%3cg%20id='SVGRepo_tracerCarrier'%20stroke-linecap='round'%20stroke-linejoin='round'%20stroke='%23CCCCCC'%20stroke-width='0.048'%20/%3e%3cg%20id='SVGRepo_iconCarrier'%3e%3cpath%20d='M13%203L13.7071%202.29289C13.5196%202.10536%2013.2652%202%2013%202V3ZM14%2022C14.5523%2022%2015%2021.5523%2015%2021C15%2020.4477%2014.5523%2020%2014%2020V22ZM19%209H20C20%208.73478%2019.8946%208.48043%2019.7071%208.29289L19%209ZM18%2010C18%2010.5523%2018.4477%2011%2019%2011C19.5523%2011%2020%2010.5523%2020%2010H18ZM5.21799%2019.908L4.32698%2020.362H4.32698L5.21799%2019.908ZM6.09202%2020.782L6.54601%2019.891L6.54601%2019.891L6.09202%2020.782ZM6.09202%203.21799L5.63803%202.32698L5.63803%202.32698L6.09202%203.21799ZM5.21799%204.09202L4.32698%203.63803L4.32698%203.63803L5.21799%204.09202ZM13.109%208.45399L14%208V8L13.109%208.45399ZM13.546%208.89101L14%208L13.546%208.89101ZM17.2299%2017.7929C16.8394%2018.1834%2016.8394%2018.8166%2017.2299%2019.2071C17.6204%2019.5976%2018.2536%2019.5976%2018.6441%2019.2071L17.2299%2017.7929ZM15.0316%2015.2507C14.8939%2015.7856%2015.2159%2016.3308%2015.7507%2016.4684C16.2856%2016.6061%2016.8308%2016.2841%2016.9684%2015.7493L15.0316%2015.2507ZM17.9375%2020C17.3852%2020%2016.9375%2020.4477%2016.9375%2021C16.9375%2021.5523%2017.3852%2022%2017.9375%2022V20ZM17.9475%2022C18.4998%2022%2018.9475%2021.5523%2018.9475%2021C18.9475%2020.4477%2018.4998%2020%2017.9475%2020V22ZM13%202H8.2V4H13V2ZM4%206.2V17.8H6V6.2H4ZM8.2%2022H14V20H8.2V22ZM19.7071%208.29289L13.7071%202.29289L12.2929%203.70711L18.2929%209.70711L19.7071%208.29289ZM20%2010V9H18V10H20ZM4%2017.8C4%2018.3436%203.99922%2018.8114%204.03057%2019.195C4.06287%2019.5904%204.13419%2019.9836%204.32698%2020.362L6.10899%2019.454C6.0838%2019.4045%206.04612%2019.3038%206.02393%2019.0322C6.00078%2018.7488%206%2018.3766%206%2017.8H4ZM8.2%2020C7.62345%2020%207.25117%2019.9992%206.96784%2019.9761C6.69617%2019.9539%206.59545%2019.9162%206.54601%2019.891L5.63803%2021.673C6.01641%2021.8658%206.40963%2021.9371%206.80497%2021.9694C7.18864%2022.0008%207.65645%2022%208.2%2022V20ZM4.32698%2020.362C4.6146%2020.9265%205.07354%2021.3854%205.63803%2021.673L6.54601%2019.891C6.35785%2019.7951%206.20487%2019.6422%206.10899%2019.454L4.32698%2020.362ZM8.2%202C7.65645%202%207.18864%201.99922%206.80497%202.03057C6.40963%202.06287%206.01641%202.13419%205.63803%202.32698L6.54601%204.10899C6.59545%204.0838%206.69617%204.04612%206.96784%204.02393C7.25117%204.00078%207.62345%204%208.2%204V2ZM6%206.2C6%205.62345%206.00078%205.25117%206.02393%204.96784C6.04612%204.69617%206.0838%204.59545%206.10899%204.54601L4.32698%203.63803C4.13419%204.01641%204.06287%204.40963%204.03057%204.80497C3.99922%205.18864%204%205.65645%204%206.2H6ZM5.63803%202.32698C5.07354%202.6146%204.6146%203.07354%204.32698%203.63803L6.10899%204.54601C6.20487%204.35785%206.35785%204.20487%206.54601%204.10899L5.63803%202.32698ZM12%203V7.4H14V3H12ZM14.6%2010H19V8H14.6V10ZM12%207.4C12%207.66353%2011.9992%207.92131%2012.0169%208.13823C12.0356%208.36682%2012.0797%208.63656%2012.218%208.90798L14%208C14.0293%208.05751%2014.0189%208.08028%2014.0103%207.97537C14.0008%207.85878%2014%207.69653%2014%207.4H12ZM14.6%208C14.3035%208%2014.1412%207.99922%2014.0246%207.9897C13.9197%207.98113%2013.9425%207.9707%2014%208L13.092%209.78201C13.3634%209.92031%2013.6332%209.96438%2013.8618%209.98305C14.0787%2010.0008%2014.3365%2010%2014.6%2010V8ZM12.218%208.90798C12.4097%209.2843%2012.7157%209.59027%2013.092%209.78201L14%208V8L12.218%208.90798ZM18.937%2016C18.937%2016.1732%2018.8915%2016.3053%2018.6175%2016.5697C18.4638%2016.718%2018.2828%2016.8653%2018.0319%2017.074C17.7936%2017.2723%2017.5141%2017.5087%2017.2299%2017.7929L18.6441%2019.2071C18.86%2018.9913%2019.0805%2018.8033%2019.3109%2018.6116C19.5287%2018.4305%2019.7852%2018.2223%2020.0065%2018.0087C20.4825%2017.5493%2020.937%2016.9314%2020.937%2016H18.937ZM17.937%2015C18.4893%2015%2018.937%2015.4477%2018.937%2016H20.937C20.937%2014.3431%2019.5938%2013%2017.937%2013V15ZM16.9684%2015.7493C17.0795%2015.3177%2017.4724%2015%2017.937%2015V13C16.5377%2013%2015.3645%2013.957%2015.0316%2015.2507L16.9684%2015.7493ZM17.9375%2022H17.9475V20H17.9375V22Z'%20fill='%23c00000'%20/%3e%3c/g%3e%3c/svg%3e",Zo="data:image/svg+xml,%3csvg%20viewBox='-2.4%20-2.4%2028.80%2028.80'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%20stroke='%23000000'%20%3e%3cg%20id='SVGRepo_bgCarrier'%20stroke-width='0'%20/%3e%3cg%20id='SVGRepo_iconCarrier'%3e%3cpath%20d='M15.6%2015.6C15.6%2015.6%2014.25%2013.8%2012%2013.8C9.75%2013.8%208.4%2015.6%208.4%2015.6M14.7%209.3H14.709M9.3%209.3H9.309M21%2012C21%2016.9706%2016.9706%2021%2012%2021C7.02944%2021%203%2016.9706%203%2012C3%207.02944%207.02944%203%2012%203C16.9706%203%2021%207.02944%2021%2012ZM15.15%209.3C15.15%209.54853%2014.9485%209.75%2014.7%209.75C14.4515%209.75%2014.25%209.54853%2014.25%209.3C14.25%209.05147%2014.4515%208.85%2014.7%208.85C14.9485%208.85%2015.15%209.05147%2015.15%209.3ZM9.75%209.3C9.75%209.54853%209.54853%209.75%209.3%209.75C9.05147%209.75%208.85%209.54853%208.85%209.3C8.85%209.05147%209.05147%208.85%209.3%208.85C9.54853%208.85%209.75%209.05147%209.75%209.3Z'%20stroke='%23000000'%20stroke-width='1.8'%20stroke-linecap='round'%20stroke-linejoin='round'%20/%3e%3c/g%3e%3c/svg%3e";var ke=_o(()=>Bt),Wo=z('<div class="card-category svelte-1q2qbu1"><img class="card_category-img svelte-1q2qbu1"> </div>'),jo=z('<a class="__main_title svelte-1q2qbu1" target="_blank" rel="noopener noreferrer"> </a>'),Go=z('<div class="pic_error svelte-1q2qbu1"><div><img style="height: 100%; width:60px; border-radius:20px;" alt="pic error" class="svelte-1q2qbu1"></div> <div class="ant-typography" style="color: white; font-size:16px;">GAY WARNING<br>同志警告</div></div>'),Uo=z('<img class="lazy-image svelte-1q2qbu1">'),Yo=z('<div class="pic_error svelte-1q2qbu1" style=""><div><img style="height: 100%;width: 100px;" alt="no pic" class="svelte-1q2qbu1"></div> <div>本种没有图片</div></div>'),Xo=z('<div class="pic_error svelte-1q2qbu1" style=""><div><img style="height: 100%;width: 100px;" alt="pic error" class="svelte-1q2qbu1"></div> <div class="ant-typography">图片加载失败</div></div>'),Qo=z('<div class="hover-trigger svelte-1q2qbu1" role="button" aria-label="悬浮预览" tabindex="0"><img style="pointer-events: none;" alt="PREVIEW" class="svelte-1q2qbu1"></div>'),Jo=z(`<img style="
                    background: url(/static/media/icons.8bb5446ebbbd07050285.gif) 0 -202px;
                    height: 14px;
                    width: 14px;" alt="PIN" class="svelte-1q2qbu1">`),Ko=z('<div class="card_info__topping svelte-1q2qbu1"></div> &nbsp;',1),el=z('<div class="_tag svelte-1q2qbu1"> </div>'),tl=z('<div class="_tag _tag_diy svelte-1q2qbu1">DIY</div>'),rl=z('<div class="_tag _tag_dub svelte-1q2qbu1">国配</div>'),nl=z('<div class="_tag _tag_sub svelte-1q2qbu1">中字</div>'),il=z('<div class="_tag svelte-1q2qbu1"> </div>'),al=z('<div class="cl-tags svelte-1q2qbu1"><!> <!> <!> <!></div>'),sl=z(`<img style="
                  background: url(/static/media/icons.8bb5446ebbbd07050285.gif) 0 -202px;
                  height: 14px;
                  width: 14px;" alt="PIN" class="svelte-1q2qbu1">`),ol=z('<div class="card_info__topping svelte-1q2qbu1"></div> &nbsp;',1),ll=z('<div class="_tag svelte-1q2qbu1"> </div>'),cl=z('<div class="card-index svelte-1q2qbu1"><!> <!></div>'),ul=z('<div class="card-index card-index-right svelte-1q2qbu1"> </div>'),vl=z('<div class="card_info-item card_info__sub_title svelte-1q2qbu1" style="padding-top: 4px;"><div> </div></div>'),dl=z('<div class="_tag _tag_diy svelte-1q2qbu1">DIY</div>'),fl=z('<div class="_tag _tag_dub svelte-1q2qbu1">国配</div>'),_l=z('<div class="_tag _tag_sub svelte-1q2qbu1">中字</div>'),hl=z('<div class="_tag svelte-1q2qbu1"> </div>'),gl=z('<div class="cl-tags svelte-1q2qbu1"><!> <!> <!> <!></div>'),pl=z('<div class="card_info-item card_info__dl_and_cl svelte-1q2qbu1"><button title="(原列表的这俩按钮会消失)">下载 & 收藏</button></div>'),ml=z('<div class="card_info-item card_info__upload_time svelte-1q2qbu1"><div> </div></div>'),bl=z('<div class="card_info-item card_info__statistics svelte-1q2qbu1"><!> &nbsp; <b> </b> &nbsp;&nbsp; <img alt="SVG_Seeders"> &nbsp; <b> </b> &nbsp;&nbsp; <img alt="SVG_Leechers"> &nbsp; <b> </b></div>'),yl=z('<div class="card_info svelte-1q2qbu1"><!>  <!> <!> <!> <!></div>'),wl=z(`<div class="card_holder svelte-1q2qbu1"><!> <div class="card_title"><!></div> <div class="card_pic svelte-1q2qbu1"><!> <!>  <div class="hover-overlay svelte-1q2qbu1"><div class="overlay-content svelte-1q2qbu1"><div class="__inner_index_and_size svelte-1q2qbu1"><div class="card-index __inner_index svelte-1q2qbu1" style="background-color:black; color:white"><!> <!></div> <button class="__iframe_button svelte-1q2qbu1">内窗预览</button> <div class="card-index card-index-right __inner_index __inner_size svelte-1q2qbu1"> </div></div> <div class="card-category card_info-item svelte-1q2qbu1"><img class="card_category-img card_category_square svelte-1q2qbu1" style="width: 36px;height: 36px;"> </div> <div style="width: 100%;" class="card_info-item card_info__sub_title svelte-1q2qbu1"><a class="__main_title __straight svelte-1q2qbu1" target="_blank" rel="noopener noreferrer"> </a></div> <div style="width: 100%;" class="card_info-item card_info__sub_title svelte-1q2qbu1"><div class="__sub_title svelte-1q2qbu1"> </div></div>  <!> <div class="card_info-item card_info__upload_time svelte-1q2qbu1"><div> </div></div> <div class="card_info-item card_info__statistics svelte-1q2qbu1"><div class="__center svelte-1q2qbu1"><!> <b> </b></div> <div class="__center svelte-1q2qbu1"><img style="width: 14px; height: 14px;" alt="SVG_Seeders" class="svelte-1q2qbu1"> <b> </b></div> <div class="__center svelte-1q2qbu1"><img style="width: 14px; height: 14px;" alt="SVG_Leechers" class="svelte-1q2qbu1"> <b> </b></div> <div><button title="(原列表的这俩按钮会消失)" style="
                background-color: inherit; border-color:transparent">下载&收藏</button></div></div></div></div> <!> <!></div> <!></div>`);function xl(e,t){pt(t,false);const[r,n]=rr(),i=()=>ie(za,"$_mt_categories",r),a=()=>ie(Aa,"$_mt_label",r),s=()=>ie(fi,"$_block_gay",r),c=()=>ie(Ae,"$_card_detail",r),v=()=>ie(ln,"$_card_radius",r),d=()=>ie(di,"$_pic_failed_showInfo",r),_=()=>ie(vi,"$_show_hover_pic",r);let o=ve(t,"torrentInfo",8),u=X(false),f=X();o().status.toppingLevel&&I(f,Array(Number(o().status.toppingLevel)).fill());const p=o().status.discount,m=o().status.discountEndTime,N={FREE:"免费",PERCENT_50:"50%"},S=()=>{const y=new Date,V=new Date(m);return Math.floor((V.getTime()-y.getTime())/(1e3*3600))};let C=X(),b=X();const P="rgba(255, 255, 255, 0.5)";let k=X(),E=X();const T=`https://${location.host}/browse?cat=`+o().category;ke().CATEGORY[o().category]||(I(b,P),Dt.open({type:"warning",message:`存在未知分类: ${o().category}`}),ke(ke().CATEGORY[o().category]={src:"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmMDAwMCIvPjwvc3ZnPg==",alt:"未知分类(TG或论坛联系我)",color:P})),I(k,i()[o().category].nameChs??ke().CATEGORY[o().category].alt),I(E,i()[o().category].image?j+i()[o().category].image:ke().CATEGORY[o().category].src),I(b,ke().CATEGORY[o().category].color??P);const x=l(b)?Ft(l(b)):"black";let M=X([]);o().labelsNew.length&&I(M,o().labelsNew.map(y=>{if(ke().TAG[y])return {key:y,config:ke().TAG[y]};if(a()){console.warn("[FALL]: 存在本地没有的 tag: ",y);let V;for(const W in a())if(y==a()[W].tag){V=a()[W];break}if(V)return {key:y,config:V}}return null}).filter(Boolean));function A(y){if(y===0)return "0 B";const V=["B","KB","MB","GB","TB"];let W=0,Q=y;for(;Q>=1024&&W<V.length-1;)Q/=1024,W++;return `${Q.toFixed(2).replace(/\.?0+$/,"")} ${V[W]}`}let O=X(),w=X();function q(y,V){const W=document.querySelectorAll(`a[href^="/detail/${y}"]`),Q=[];W.forEach(fe=>{if(!/\/detail\/\d+/.test(fe.href))return;const oe=fe.closest("tr");oe&&oe.querySelectorAll("button").forEach(ge=>{ge.querySelector("span.ant-btn-icon")&&Q.push(ge);});}),Q.length?(Q[0].style.margin=0,[...new Set(Q)].forEach(oe=>{V.appendChild(oe);})):Dt.error("没找到捏, 建议在种子详情里下载收藏~");}let F=X(false),D=X(false),ne=Yt.getInstance(),le=X(),se=X(),me=X(0);function it(){l(se)&&I(me,l(se).offsetHeight);}let Fe=X(false),G=X(false);const de="/static/cate/gayhd.gif";let Le=X(false);const Ue="https://static.m-team.cc/static/media/logo.80b63235eaf702e44a8d.png";let Vt=o().imageList[0]||Ue,U=X(),at,Ye=X(false);const qn=()=>{l(Ye)||(Se(U,l(U).style.width="100%"),Se(U,l(U).src=Vt),l(U).classList.add("loaded"),Se(U,l(U).style.opacity=1),I(Ye,true),l(se)&&it());};function nr(){he(Ta,"https://"+location.host+"/detail/"+o().id),he(on,1);}Sn(()=>{l(Ye)||(at=new IntersectionObserver(y=>{y.forEach(V=>{V.isIntersecting&&(qn(),at.unobserve(l(U)));});},{rootMargin:"100px"}),l(U)&&!l(Ye)&&at.observe(l(U)),o().pt_fall_highlight&&l(C).scrollIntoView({behavior:"smooth"})),it(),l(U)&&Se(U,l(U).style.width="auto");}),Va(()=>{at&&at.disconnect();}),_t(()=>l(se),()=>{l(se)&&it();}),_t(()=>(Ct(o()),s(),l(U),l(se)),()=>{o().category==440&&s()==0&&l(U)&&(Se(U,l(U).style.width="100%"),Se(U,l(U).src=Vt),l(U).classList.add("loaded"),Se(U,l(U).style.opacity=1),I(Ye,true),l(se)&&it());}),_t(()=>c(),()=>{I(Le,c().sub_title||c().tags||c().download_collect||c().upload_time||c().statistics);}),Ar(),qt();var bt=wl(),ir=h(bt);{var Vn=y=>{var V=Wo();$(V,"data-href",T);var W=h(V),Q=g(W);Y(()=>{$(V,"style",`
      background-color: ${l(b)??"transparent"};
      color: ${x??""}`),$(W,"src",l(E)),$(W,"alt",l(k)),K(Q,`    ${l(k)??""}`);}),L(y,V);};Z(ir,y=>{c().category&&y(Vn);});}var yt=g(ir,2),Hr=h(yt);{var Or=y=>{var V=jo(),W=h(V);Y(()=>{$(V,"href","/detail/"+o().id),K(W,o().name);}),L(y,V);};Z(Hr,y=>{(c().title||d()&&(l(Fe)||l(G)))&&y(Or);});}var It=g(yt,2),Rr=h(It);{var Fr=y=>{var V=dt(),W=$e(V);{var Q=oe=>{var ge=Go(),Ce=h(ge),be=h(Ce);$(be,"src",de),Y(()=>$(ge,"style",`  background-color: ${l(b)??""}`)),L(oe,ge);},fe=oe=>{var ge=dt(),Ce=$e(ge);{var be=ee=>{var ce=Uo();$(ce,"data-src",Vt),ut(ce,te=>I(U,te),()=>l(U)),Y(()=>{$(ce,"src",l(Ye)?Vt:Ue),$(ce,"alt",o().id);}),B("error",ce,()=>{I(Fe,true),l(U)||console.log(`<${o().index}>[${o().id}] imgElement 丢失.`);}),L(ee,ce);},Je=ee=>{var ce=Yo(),te=h(ce),ue=h(te);$(ue,"src",Zo),B("load",ue,()=>{I(G,true);}),L(ee,ce);};Z(Ce,ee=>{o().imageList[0]?ee(be):ee(Je,false);},true);}L(oe,ge);};Z(W,oe=>{s()&&o().category==440?oe(Q):oe(fe,false);});}L(y,V);},In=y=>{var V=Xo(),W=h(V),Q=h(W);$(Q,"src",Bo);var fe=g(W,2);Y(oe=>$(fe,"style",`color: ${oe??""}; font-size:16px;`),[()=>Ft(l(b))],tt),L(y,V);};Z(Rr,y=>{l(Fe)?y(In,false):y(Fr);});}var ar=g(Rr,2);{var Tn=y=>{var V=Qo(),W=h(V);Y(()=>$(W,"src",ke().ICON.PREVIEW)),B("click",V,()=>{ne.changeState();}),B("mouseover",V,Q=>{I(F,true),ne.handleMouseOver(Q,l(U));}),B("keydown",V,Q=>{Q.key==="Escape"&&ne.clearPreview();}),L(y,V);};Z(ar,y=>{_()&&!(l(Fe)||l(G))&&y(Tn);});}var De=g(ar,2),Dr=h(De),sr=h(Dr),Br=h(sr),or=h(Br);{var An=y=>{var V=Ko(),W=$e(V);Et(W,5,()=>l(f),mr,(Q,fe)=>{var oe=Jo();Y(()=>$(oe,"src",ke().ICON.PIN)),L(Q,oe);}),L(y,V);};Z(or,y=>{o().status.toppingLevel!="0"&&y(An);});}var lr=g(or),zn=g(lr);{var Zr=y=>{var V=el();br(V,"_tag_discount_free",p=="FREE"),br(V,"_tag_discount_50",p=="PERCENT_50");var W=h(V);Y(Q=>K(W,`${N[p]??""}${Q??""}`),[()=>m?":"+S()+"小时":""],tt),L(y,V);};Z(zn,y=>{p!="NORMAL"&&y(Zr);});}var cr=g(Br,2),ur=g(cr,2),Pn=h(ur),wt=g(sr,2);$(wt,"data-href",T);var vr=h(wt),Wr=g(vr),dr=g(wt,2),Tt=h(dr),Hn=h(Tt),fr=g(dr,2),On=h(fr),jr=h(On),Gr=g(fr,2);{var Ur=y=>{var V=al(),W=h(V);{var Q=ee=>{var ce=tl();L(ee,ce);};Z(W,ee=>{(Number(o().labels)&1)===1&&ee(Q);});}var fe=g(W,2);{var oe=ee=>{var ce=rl();L(ee,ce);};Z(fe,ee=>{(Number(o().labels)&2)===2&&ee(oe);});}var ge=g(fe,2);{var Ce=ee=>{var ce=nl();L(ee,ce);};Z(ge,ee=>{(Number(o().labels)&4)===4&&ee(Ce);});}var be=g(ge,2);{var Je=ee=>{var ce=dt(),te=$e(ce);Et(te,1,()=>l(M),mr,(ue,ye)=>{var we=il(),At=h(we);Y(()=>{$(we,"style",`background-color: ${l(ye).config.bgColor??""}; color: ${l(ye).config.color??""}`),K(At,l(ye).key);}),L(ue,we);}),L(ee,ce);};Z(be,ee=>{l(M).length!=0&&ee(Je);});}L(y,V);};Z(Gr,y=>{(Number(o().labels)||l(M).length)&&y(Ur);});}var Yr=g(Gr,2),Xr=h(Yr),Rn=h(Xr),Fn=g(Yr,2),Qr=h(Fn),R=h(Qr);Qi(R);var Xe=g(R,2),Qe=h(Xe),st=g(Qr,2),ot=h(st),_r=g(ot,2),Dn=h(_r),Ni=g(st,2),$i=h(Ni),Ha=g($i,2),Oa=h(Ha),Bn=g(Ni,2),Si=h(Bn);ut(Bn,y=>I(O,y),()=>l(O)),ut(Dr,y=>I(se,y),()=>l(se)),ut(De,y=>I(le,y),()=>l(le));var qi=g(De,2);{var Ra=y=>{var V=cl(),W=h(V);{var Q=Ce=>{var be=ol(),Je=$e(be);Et(Je,5,()=>l(f),mr,(ee,ce)=>{var te=sl();Y(()=>$(te,"src",ke().ICON.PIN)),L(ee,te);}),L(Ce,be);};Z(W,Ce=>{c().topping&&o().status.toppingLevel!="0"&&Ce(Q);});}var fe=g(W),oe=g(fe);{var ge=Ce=>{var be=ll();br(be,"_tag_discount_free",p=="FREE"),br(be,"_tag_discount_50",p=="PERCENT_50");var Je=h(be);Y(ee=>K(Je,`${N[p]??""}${ee??""}`),[()=>m?":"+S()+"小时":""],tt),L(Ce,be);};Z(oe,Ce=>{c().free&&p!="NORMAL"&&Ce(ge);});}Y(()=>K(fe,` ${o().index??""}

          `)),L(y,V);};Z(qi,y=>{l(u)||y(Ra);});}var Fa=g(qi,2);{var Da=y=>{var V=ul(),W=h(V);Y(Q=>{$(V,"style",`background-color: ${l(b)??"transparent"}; color:${x??""}`),K(W,Q);},[()=>A(o().size)],tt),L(y,V);};Z(Fa,y=>{c().size&&!l(u)&&y(Da);});}var Ba=g(It,2);{var Za=y=>{var V=yl(),W=h(V);{var Q=te=>{var ue=vl(),ye=h(ue),we=h(ye);Y(()=>K(we,o().smallDescr)),L(te,ue);};Z(W,te=>{(c().sub_title||d()&&(l(Fe)||l(G)))&&te(Q);});}var fe=g(W,2);{var oe=te=>{var ue=gl(),ye=h(ue);{var we=pe=>{var lt=dl();L(pe,lt);};Z(ye,pe=>{(o().labels&1)===1&&pe(we);});}var At=g(ye,2);{var Jr=pe=>{var lt=fl();L(pe,lt);};Z(At,pe=>{(o().labels&2)===2&&pe(Jr);});}var hr=g(At,2);{var Zn=pe=>{var lt=_l();L(pe,lt);};Z(hr,pe=>{(o().labels&4)===4&&pe(Zn);});}var Kr=g(hr,2);{var Wn=pe=>{var lt=dt(),Wa=$e(lt);Et(Wa,1,()=>l(M),mr,(ja,jn)=>{var Gn=hl(),Ga=h(Gn);Y(()=>{$(Gn,"style",`background-color: ${l(jn).config.bgColor??""}; color: ${l(jn).config.color??""}`),K(Ga,l(jn).key);}),L(ja,Gn);}),L(pe,lt);};Z(Kr,pe=>{l(M).length!=0&&pe(Wn);});}L(te,ue);};Z(fe,te=>{c().tags&&(Number(o().labels)||l(M).length)&&te(oe);});}var ge=g(fe,2);{var Ce=te=>{var ue=pl(),ye=h(ue);ut(ue,we=>I(w,we),()=>l(w)),Y(()=>$(ye,"style",`
              background-color: ${(l(b)?l(b):"transparent")??""};
              color: ${x??""} ;
              border: 3px solid transparent;
              border-radius: 14px;
              overflow: hidden;
            `)),B("click",ye,we=>{q(o().id,l(w)),we.target.style.display="none";}),L(te,ue);};Z(ge,te=>{c().download_collect&&te(Ce);});}var be=g(ge,2);{var Je=te=>{var ue=ml(),ye=h(ue),we=h(ye);Y(()=>K(we,`上传时间:${o().createdDate??""}`)),L(te,ue);};Z(be,te=>{c().upload_time&&te(Je);});}var ee=g(be,2);{var ce=te=>{var ue=bl(),ye=h(ue);Qi(ye);var we=g(ye,2),At=h(we),Jr=g(we,2),hr=g(Jr,2),Zn=h(hr),Kr=g(hr,2),Wn=g(Kr,2),pe=h(Wn);Y(()=>{K(At,o().status.comments),$(Jr,"src",ke().ICON.SEEDERS),K(Zn,o().status.seeders),$(Kr,"src",ke().ICON.LEECHERS),K(pe,o().status.leechers);}),L(te,ue);};Z(ee,te=>{c().statistics&&te(ce);});}Y(()=>$(V,"style",`
        background-color: ${(l(b)?l(b)+"b0":"transparent")??""};
        color: ${x??""}`)),L(y,V);};Z(Ba,y=>{(l(Le)||d()&&(l(Fe)||l(G)))&&y(Za);});}ut(bt,y=>I(C,y),()=>l(C)),Y(y=>{Pe(bt,"--borderRadius",v().enabled?v().value+"px":"0"),$(yt,"style",`background-color: ${l(b)+"10"}`),$(It,"style",`min-height: ${l(me)+24}px;`),Pe(It,"--cateColor",l(b)+"b0"),K(lr,` ${o().index??""}

              `),$(cr,"style",`background-color: ${l(b)??"transparent"}; color:${x??""}`),$(ur,"style",`background-color: ${l(b)??"transparent"}; color:${x??""}`),K(Pn,y),$(wt,"style",`
            height: 40px;
            background-color: ${l(b)??"transparent"};
            color: ${x??""}`),$(vr,"src",l(E)),$(vr,"alt",l(k)),K(Wr,`    ${l(k)??""}`),$(Tt,"href","/detail/"+o().id),$(Tt,"title",o().name),K(Hn,o().name),K(jr,o().smallDescr),K(Rn,`上传时间:${o().createdDate??""}`),K(Qe,o().status.comments),$(ot,"src",ke().ICON.SEEDERS),K(Dn,o().status.seeders),$($i,"src",ke().ICON.LEECHERS),K(Oa,o().status.leechers),$(Bn,"style",`
              background-color: ${(l(b)?l(b):"transparent")??""};
              color: ${x??""} ;
              border-radius: 14px;
              overflow: hidden;
            `);},[()=>A(o().size)],tt),B("click",cr,nr),B("mousedown",dr,kr(y=>{y.stopPropagation();})),B("mousedown",Si,kr(y=>{y.stopPropagation();})),B("click",Si,kr(y=>{q(o().id,l(O)),y.target.style.display="none";})),B("mouseenter",De,()=>{l(U)&&Se(U,l(U).style.filter="blur(2px)"),Se(le,l(le).style.opacity="1"),I(u,true);}),B("mousemove",De,y=>{I(D,true),l(F)&&l(D)&&ne.handleMouseMove(y);}),B("mouseleave",De,()=>{l(U)&&Se(U,l(U).style.filter="none"),Se(le,l(le).style.opacity="0"),I(u,false),I(D,false),l(F)&&(I(F,false),ne.clearPreview());}),B("mousedown",De,Li(nr)),L(e,bt),mt(),n();}var Cl=z('<p class="text_center svelte-1vmncc1">没有结果捏</p>'),kl=z('<main><div class="fall_holder svelte-1vmncc1" style=""><!></div></main>');function El(e,t){var E,T,x,M;pt(t,false);const[r,n]=rr(),i=()=>ie(xr,"$_card_layout",r),a=X();let s=ve(t,"infoList",8),c=X(s().data);l(c).length;let v=X();Bt.get_bg_color(),Object.keys(l(c)).forEach((A,O)=>{Se(c,l(c)[A].index=O+1);}),console.log("Mteam_Fall:First	"+l(c).length);function d(A,O=true){let w=A.data;console.log("Mteam_Fall:New:	"+w.length),O?(_(),Object.keys(w).forEach((q,F)=>{w[q].index=F+1,F==0&&(w[q].pt_fall_highlight=true);}),I(c,[...w])):(Object.keys(w).forEach((q,F)=>{w[q].index=F+1+l(c).length,F==0&&(w[q].pt_fall_highlight=true);}),I(c,[...l(c),...w]));}function _(){I(c,[]);}function o(A,O){O=="top"&&A.scrollIntoView({behavior:"smooth"}),O=="bottom"&&(A.scrollIntoView({behavior:"auto",block:"end",inline:"nearest"}),A.scrollIntoView({behavior:"auto",block:"end",inline:"nearest"}),A.scrollIntoView({behavior:"auto",block:"end",inline:"nearest"}));}function u(A="top"){o(l(v),A);}let f,p,m;try{f=Rt(localStorage.getItem("persist:persist")),p=(T=(E=f.sysinfo)==null?void 0:E.sysConf)==null?void 0:T.TORRENT_LABEL_CONFIG,m=(M=(x=f.sysinfo)==null?void 0:x.categoryList)==null?void 0:M.categorys,p&&he(Aa,p),m&&he(za,m);}catch(A){console.error(A),console.log(f);}_t(()=>l(c),()=>{I(a,[...l(c)]);}),Ar(),qt();var N=kl(),S=h(N),C=h(S);{var b=A=>{$o(A,{animate:true,get items(){return l(a)},get minColWidth(){return i().min},get maxColWidth(){return i().max},get gap(){return i().gap},children:zs,$$slots:{default:(O,w)=>{const q=tt(()=>w.item);xl(O,{get torrentInfo(){return l(q)}});}}});},P=A=>{var O=Cl();L(A,O);};Z(C,A=>{l(a).length?A(b):A(P,false);});}ut(N,A=>I(v,A),()=>l(v)),L(e,N),Kn(t,"updateList",d),Kn(t,"clearList",_),Kn(t,"focusFall",u);var k=mt({updateList:d,clearList:_,focusFall:u});return n(),k}let Ll="0.3.11";var Ml=tr('<svg class="tgme_logo" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle cx="17" cy="17" fill="#40a9ff" r="17"></circle><path d="m7.06510669 16.9258959c5.22739451-2.1065178 8.71314291-3.4952633 10.45724521-4.1662364 4.9797665-1.9157646 6.0145193-2.2485535 6.6889567-2.2595423.1483363-.0024169.480005.0315855.6948461.192827.1814076.1361492.23132.3200675.2552048.4491519.0238847.1290844.0536269.4231419.0299841.65291-.2698553 2.6225356-1.4375148 8.986738-2.0315537 11.9240228-.2513602 1.2428753-.7499132 1.5088847-1.2290685 1.5496672-1.0413153.0886298-1.8284257-.4857912-2.8369905-1.0972863-1.5782048-.9568691-2.5327083-1.3984317-4.0646293-2.3321592-1.7703998-1.0790837-.212559-1.583655.7963867-2.5529189.2640459-.2536609 4.7753906-4.3097041 4.755976-4.431706-.0070494-.0442984-.1409018-.481649-.2457499-.5678447-.104848-.0861957-.2595946-.0567202-.3712641-.033278-.1582881.0332286-2.6794907 1.5745492-7.5636077 4.6239616-.715635.4545193-1.3638349.6759763-1.9445998.6643712-.64024672-.0127938-1.87182452-.334829-2.78737602-.6100966-1.12296117-.3376271-1.53748501-.4966332-1.45976769-1.0700283.04048-.2986597.32581586-.610598.8560076-.935815z" fill="#fff"></path></g></svg>');function Nl(e,t){let r=ve(t,"height",8,34),n=ve(t,"width",8,34);var i=Ml();Y(()=>{$(i,"height",r()),$(i,"width",n());}),L(e,i);}var $l=z('<div class="modal-overlay svelte-1a87xm5" role="button" aria-hidden="true"><div class="modal-content svelte-1a87xm5" role="button" aria-hidden="true"><div class="modal-header svelte-1a87xm5"><h3 class="svelte-1a87xm5">关于 PT-Fall</h3> <button class="close-btn svelte-1a87xm5">&times;</button></div> <div class="modal-body svelte-1a87xm5"><h4 class="svelte-1a87xm5">PT-Fall 是一个专为 M-team 站点量身定制的瀑布流视图插件</h4> <p class="svelte-1a87xm5">Github: <a href="https://github.com/KesaubeEire/PT_Fall-View" target="_blank">https://github.com/KesaubeEire/PT_Fall-View</a></p> <p class="svelte-1a87xm5">GreaseFork: <a href="https://greasyfork.org/zh-CN/scripts/543925" target="_blank">https://greasyfork.org/zh-CN/scripts/543925</a></p></div></div></div>'),Sl=z('<div class="modal-overlay svelte-1a87xm5" role="button" aria-hidden="true"><div class="modal-content svelte-1a87xm5" role="button" aria-hidden="true"><div class="modal-header svelte-1a87xm5"><h3 class="svelte-1a87xm5">FAQ - 常见问题</h3> <button class="close-btn svelte-1a87xm5">&times;</button></div> <div class="modal-body svelte-1a87xm5"><h4 class="svelte-1a87xm5">Q: 如何联系反馈问题</h4> <p class="svelte-1a87xm5"><a class="__btn __btnWide svelte-1a87xm5" href="https://t.me/+Nd_qIisDjQ80ZTc9" target="_blank"><!> &nbsp;Telegram</a></p> <h4 class="svelte-1a87xm5">Q: 找不到悬浮框</h4> <button class="__btn svelte-1a87xm5">重置悬浮框位置</button> <p class="svelte-1a87xm5"><br>可以通过拖拽悬浮框顶部的颜色条来移动悬浮框的位置 <br>从 PTPP 那里来的灵感 ( 感恩 ||T|| 佬 )</p> <h4 class="svelte-1a87xm5">Q: 插件没有生效怎么办</h4> <p class="svelte-1a87xm5">可能是浏览器缓存了请求<br>尝试使用 Ctrl+Shift+R / Ctrl+F5 强制刷新页面</p> <h4 class="svelte-1a87xm5">Q: 如何切换瀑布流视图</h4> <p class="svelte-1a87xm5">点击悬浮面板中的第一个图标(瀑布/列表)按钮<br>即可在瀑布流和原列表视图间切换</p> <h4 class="svelte-1a87xm5">Q: 如何调整卡片布局</h4> <p class="svelte-1a87xm5">点击悬浮面板中的"配置"按钮<br>可以调整卡片的最小 / 最大宽度、间隔等参数</p> <h4 class="svelte-1a87xm5">Q: 快捷键</h4> <p class="svelte-1a87xm5"><span class="modal-code svelte-1a87xm5">x</span> 可以切换瀑布流视图</p> <p class="svelte-1a87xm5"><span class="modal-code svelte-1a87xm5">ESC</span> 可以从 次级菜单 / 配置菜单 / iframe 中退出</p> <h4 class="svelte-1a87xm5">Q: 深色模式颜色有些不对劲怎么办?</h4> <p class="svelte-1a87xm5">先刷新一下试试, 有些字体颜色不能即时更改<br>刷新后就可以了<br>还有颜色不对劲的 telegram 上截图告诉我</p></div></div></div>'),ql=z('<div class="entry_mteam"><div class="ant-typography" style="line-height: 1.5; text-align: center;"><button class="__btn svelte-1a87xm5" id="_ptFall_about">PT-Fall<br><span style="font-weight: 600;"></span></button> <button class="__btn svelte-1a87xm5" id="_ptFall_faq">常见问题<br>FAQ</button></div></div> <!> <!>',1);function Vl(e,t){pt(t,false);const[r,n]=rr(),i=()=>ie(Er,"$_isFallView",r),a=()=>ie(Lt,"$_textColor",r);let s=X(false),c=X(false);function v(){I(s,true);}function d(){I(s,false);}function _(){I(c,true);}function o(){I(c,false);}let u=X();_t(()=>i(),()=>{I(u,i()?"#4ff74f":"yellow");}),Ar(),qt();var f=ql();B("keydown",Mr,T=>{T.key==="Escape"&&(d(),o());},true);var p=$e(f),m=h(p),N=h(m),S=g(h(N),2);S.textContent=`[v${Ll}]`;var C=g(N,2),b=g(p,2);{var P=T=>{var x=$l(),M=h(x),A=h(M),O=g(h(A),2);Y(()=>$(M,"style",`color: ${a().t3}`)),B("click",O,o),B("click",M,kr(function(w){Gi.call(this,t,w);})),jt(3,x,()=>Gt,()=>({duration:200})),B("click",x,o),L(T,x);};Z(b,T=>{l(c)&&T(P);});}var k=g(b,2);{var E=T=>{var x=Sl(),M=h(x),A=h(M),O=g(h(A),2),w=g(A,2),q=g(h(w),2),F=h(q),D=h(F);Nl(D,{height:24,width:24});var ne=g(q,4),le=g(ne,18),se=h(le),me=g(le,2),it=h(me);Y(()=>{$(M,"style",`color: ${a().t3}`),$(F,"style",`color: ${a().t2}`),Pe(F,"--hover","#40a9ff"),$(ne,"style",`color: ${a().t2}`),Pe(ne,"--hover","#40a9ff"),$(se,"style",`color: ${a().t1}`),$(it,"style",`color: ${a().t1}`);}),B("click",O,d),B("click",ne,()=>{he(ui,{x:0,y:0});}),B("click",M,kr(function(Fe){Gi.call(this,t,Fe);})),jt(3,x,()=>Gt,()=>({duration:200})),B("click",x,d),L(T,x);};Z(k,T=>{l(s)&&T(E);});}Y(()=>{$(N,"style",`color: ${a().t2}`),Pe(N,"--hover","green"),Pe(S,"color",l(u)),$(C,"style",`color: ${a().t2}`),Pe(C,"--hover","#40a9ff");}),B("click",N,_),B("click",C,v),L(e,f),mt(),n();}function Il(e,t){pt(t,false);const[r,n]=rr(),i=()=>ie(Er,"$_isFallView",r),a=()=>ie(Lt,"$_textColor",r);let s,c,v,d=true,_=false,o=getComputedStyle(document.documentElement).getPropertyValue("--bg-2").trim(),u;const f=X(document.createElement("div"));l(f).classList.add("Fall_DOM"),console.log("=====> 启动劫持 XHR 和 Fetch 请求 <====="),yo(),xt(Bt.TL_Selector,C),xt('a[href="/index"][target="_self"]',w=>{if(s)Dt.error("未找到目标链接元素"),console.warn("[FALL]: 未找到目标链接元素");else {w.insertAdjacentHTML("afterend",'<div class="ptFallReadme"></div>');const q=w.parentNode.querySelector(".ptFallReadme");s=qr(Vl,{target:q});}}),Sn(()=>{O(),console.log("=====> 启动劫持 pushState 方法 <====="),M(),u=new MutationObserver(()=>{const w=getComputedStyle(document.documentElement).getPropertyValue("--bg-2").trim();w!==o&&(o=w,console.log("--bg-2 变化:",o),O());}),u.observe(document.documentElement,{attributes:true,attributeFilter:["style","class","data-theme"]});}),Va(()=>{u&&u.disconnect(),S();});let p=X(),m=X();function N(){xt(".ant-pagination",w=>{w&&w.parentNode&&w.parentNode!==l(f)&&I(m,w.parentNode),w&&(I(p,w),i()&&l(f).appendChild(l(p)));});}function S(){l(p)&&l(p).parentNode&&l(p).parentNode.removeChild(l(p));}function C(w){if(w.parentNode){console.log("元素已找到，正在插入兄弟节点:",w);const q={path:"/search",method:"POST"};window.addEventListener("req>POST->/search",F=>{console.log(`<PT-Fall>[Request]  (${q.method} -> ${q.path})
`,F.detail),F.detail.url.includes("api/torrent/search")&&!F.detail.body.includes('"mode":"waterfall"')?_=true:_=false,d=true,d?c&&c.focusFall():c&&c.focusFall("bottom"),S();}),window.addEventListener("res>POST->/search",F=>{const D=JSON.parse(F.detail.data);if(!_){console.warn(`<PT-Fall>[未被接受的Response] (${q.method}->${q.path})[通过事件捕获]:
`,D);return}console.log(`<PT-Fall>[Response] (${q.method}->${q.path})[通过事件捕获]:
`,D),T(i()),b(w),Dt.success("捕获到 /search !"),v=D.data,c?c.updateList(v,d):c=qr(El,{target:l(f),props:{infoList:v}}),N();});}else Dt.error(`找不到指定节点
若总是如此请报告bug`),console.error("无法插入：目标元素没有父节点");}function b(w){const q=w.parentNode.querySelector(".ant-spin-nested-loading"),F=document.createElement("div");F.id="_shield",F.addEventListener("click",()=>{confirm(`[PT-Fall]
如果你认为你被阻挡了请点击确认
这个阻挡效果会被取消
这可能导致显示错误
请确认您不在一般的瀑布流视图下
比如您在逛论坛或者在发种之类的被遮挡了再点`)&&(F.style.display="none");}),q.querySelector("#_shield")||q.appendChild(F);const D=document.createElement("div");D.id="_fallHolder",q.querySelector("#_fallHolder")||(q.appendChild(D),D.appendChild(l(f)));}let P="",k="",E="";function T(w){Se(f,l(f).style.display=w?"block":"none"),xt("#_fallHolder",q=>{q.style.display=w?"block":"none";}),xt("#_shield",q=>{q.style.display=w?"block":"none";}),xt(Bt.TL_Selector+".flex",q=>{k||(k=getComputedStyle(q).getPropertyValue("max-width"),E=getComputedStyle(q).getPropertyValue("padding-left")),q.style.maxWidth=w?"none":k,q.style.paddingLeft=w?"80px":E,q.style.paddingRight=w?"80px":E;}),xt(Bt.TL_Selector+" .mx-auto",q=>{P||(P=q.style.margin),q.style.margin=w?0:P;});}window.changeFallView=T;const x=history.pushState;function M(){history.pushState=function(w,q,F){console.log(`%c ====> URL跳转劫持: %c${F}`,"color: cyan","color: white"),F.includes("/browse")||F=="/waterfall"?console.log(`--->属于 browse 范围: ${F}`):(console.warn(`[FALL]: --->不属于 browse 范围: ${F}`),T(false)),x.apply(history,arguments);};}function A(w){return getComputedStyle(document.documentElement).getPropertyValue(w).trim()}function O(){_e(Lt,H(a).t1=Ft(A("--bg-1")),H(a)),_e(Lt,H(a).t2=Ft(A("--bg-2")),H(a)),_e(Lt,H(a).t3=Ft(A("--bg-3")),H(a));}_t(()=>(l(f),i(),l(p),l(m)),()=>{l(f)&&(i()&&l(p)&&l(f).appendChild(l(p)),!i()&&l(p)&&l(m)&&l(m).appendChild(l(p)));}),Ar(),qt(),mt(),n();}function Ji(e){if(location.hostname.includes("m-team"))return Bt}var Tl=z('<div class="switch-container svelte-18ntgfp"><div class="switch-background svelte-18ntgfp"><div class="switch-slider svelte-18ntgfp"></div></div></div>');function Ee(e,t){let r=ve(t,"checked",12,false);function n(){r(!r());}var i=Tl(),a=h(i),s=h(a);Y(()=>br(s,"checked",r())),B("click",i,n),L(e,i);}var Al=tr(`<svg viewBox="0 0 32 32" width="20" height="20" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><defs><style>.cls-1 {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2px;
      }</style></defs><g data-name="43-browser" id="_43-browser"><rect class="cls-1" height="30" width="30" x="1" y="1"></rect><line class="cls-1" x1="1" x2="31" y1="9" y2="9"></line><line class="cls-1" x1="5" x2="7" y1="5" y2="5"></line><line class="cls-1" x1="11" x2="13" y1="5" y2="5"></line><line class="cls-1" x1="9" x2="25" y1="16" y2="16"></line><line class="cls-1" x1="7" x2="25" y1="20" y2="20"></line><line class="cls-1" x1="7" x2="25" y1="24" y2="24"></line></g></svg>`);function zl(e){var t=Al();L(e,t);}var Pl=tr(`<svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><defs><style>.cls-1 {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2px;
      }</style></defs><g data-name="80-setting" id="_80-setting"><circle class="cls-1" cx="10" cy="6" r="3"></circle><circle class="cls-1" cx="22" cy="16" r="3"></circle><circle class="cls-1" cx="10" cy="26" r="3"></circle><line class="cls-1" x1="7" x2="1" y1="6" y2="6"></line><line class="cls-1" x1="15" x2="1" y1="16" y2="16"></line><line class="cls-1" x1="7" x2="1" y1="26" y2="26"></line><line class="cls-1" x1="31" x2="17" y1="26" y2="26"></line><line class="cls-1" x1="31" x2="25" y1="16" y2="16"></line><line class="cls-1" x1="31" x2="17" y1="6" y2="6"></line></g></svg>`);function Hl(e){var t=Pl();L(e,t);}var Ol=tr('<svg enable-background="new 0 0 64 64" width="20" height="20" id="Layer_1" version="1.1" viewBox="0 0 64 64" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19,2.875H3.5c-0.829,0-1.5,0.671-1.5,1.5v19.979c0,0.829,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.671,1.5-1.5V4.375  C20.5,3.546,19.829,2.875,19,2.875z M17.5,22.854H5V5.875h12.5V22.854z"></path><path d="M19,28.773H3.5c-0.829,0-1.5,0.671-1.5,1.5v6.166c0,0.828,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.672,1.5-1.5v-6.166  C20.5,29.445,19.829,28.773,19,28.773z M17.5,34.939H5v-3.166h12.5V34.939z"></path><path d="M19,40.859H3.5c-0.829,0-1.5,0.672-1.5,1.5v17.266c0,0.828,0.671,1.5,1.5,1.5H19c0.829,0,1.5-0.672,1.5-1.5V42.359  C20.5,41.531,19.829,40.859,19,40.859z M17.5,58.125H5V43.859h12.5V58.125z"></path><path d="M40,2.875H24.5c-0.829,0-1.5,0.671-1.5,1.5v14.25c0,0.829,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.671,1.5-1.5V4.375  C41.5,3.546,40.828,2.875,40,2.875z M38.5,17.125H26V5.875h12.5V17.125z"></path><path d="M40,23.125H24.5c-0.829,0-1.5,0.671-1.5,1.5V46.5c0,0.828,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.672,1.5-1.5V24.625  C41.5,23.796,40.828,23.125,40,23.125z M38.5,45H26V26.125h12.5V45z"></path><path d="M40,51H24.5c-0.829,0-1.5,0.672-1.5,1.5v7.125c0,0.828,0.671,1.5,1.5,1.5H40c0.828,0,1.5-0.672,1.5-1.5V52.5  C41.5,51.672,40.828,51,40,51z M38.5,58.125H26V54h12.5V58.125z"></path><path d="M60.5,2.875H45c-0.828,0-1.5,0.671-1.5,1.5v35.171c0,0.828,0.672,1.5,1.5,1.5h15.5c0.828,0,1.5-0.672,1.5-1.5V4.375  C62,3.546,61.328,2.875,60.5,2.875z M59,38.046H46.5V5.875H59V38.046z"></path><path d="M60.5,44.346H45c-0.828,0-1.5,0.672-1.5,1.5v13.779c0,0.828,0.672,1.5,1.5,1.5h15.5c0.828,0,1.5-0.672,1.5-1.5V45.846  C62,45.018,61.328,44.346,60.5,44.346z M59,58.125H46.5V47.346H59V58.125z"></path></svg>');function Rl(e){var t=Ol();L(e,t);}var Fl=z('<div><!></div> <div class="flowBtn_text svelte-4gkzar">瀑布</div>',1),Dl=z('<div><!></div> <div class="flowBtn_text svelte-4gkzar">列表</div>',1),Bl=z('<div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar"> </span></div> <!></div>'),Zl=z('<div class="config-item svelte-4gkzar"><span class="svelte-4gkzar"> </span> <input type="range" min="0" max="40" step="1" class="svelte-4gkzar"></div>'),Wl=z('<div class="config-menu-overlay svelte-4gkzar"><div class="config-menu svelte-4gkzar"><div class="config-menu-header svelte-4gkzar"><span style="font-size: 18px; font-weight: bold;">配置菜单</span> <button class="close-btn svelte-4gkzar">&times;</button></div> <div class="config-menu-content svelte-4gkzar"><h3 class="svelte-4gkzar"># 卡片布局</h3> <div class="config-item svelte-4gkzar"><span class="svelte-4gkzar"> </span> <input type="range" min="200" step="1" list="values" class="svelte-4gkzar"></div> <div class="config-item svelte-4gkzar"><span class="svelte-4gkzar"> </span> <input type="range" step="1" list="values" class="svelte-4gkzar"></div> <div class="config-item svelte-4gkzar"><span class="svelte-4gkzar"> </span> <input type="range" min="0" max="100" step="1" list="values" class="svelte-4gkzar"></div> <h3 class="svelte-4gkzar"># 特殊配置</h3> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">图片加载失败时显示标题</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">显示鼠标悬浮预览大图</span></div> <!></div> <!> <h3 class="svelte-4gkzar"># 卡片常驻信息展示</h3>  <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">分区</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">标题</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">置顶</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">免费</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">大小</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">副标题</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">标签</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">下载&收藏</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">上传时间</span></div> <!></div> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">评论/上传/下载</span></div> <!></div> <h3 class="svelte-4gkzar"># 卡片屏蔽</h3> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">屏蔽 gay 区</span></div> <!></div> <h3 class="svelte-4gkzar"># 卡片样式</h3> <div class="config-item svelte-4gkzar"><div class="_single_item svelte-4gkzar"><span class="svelte-4gkzar">自定义圆角</span></div> <!></div> <!></div></div></div>'),jl=z('<div class="flowP svelte-4gkzar"><div class="flowPDragger svelte-4gkzar" role="button" tabindex="0" aria-hidden="true"><!></div> <div class="flowPHolder ant-typography svelte-4gkzar"><button class="flowBtn svelte-4gkzar"><!></button> <button class="flowBtn svelte-4gkzar"><div><!></div> <div class="flowBtn_text svelte-4gkzar">配置</div></button> <button class="flowBtn svelte-4gkzar">清除悬浮预览图</button></div></div> <!>',1);function Gl(e,t){pt(t,false);const[r,n]=rr(),i=()=>ie(ui,"$_panelPos",r),a=()=>ie(Er,"$_isFallView",r),s=()=>ie(Lt,"$_textColor",r),c=()=>ie(wr,"$_side_panel_switch",r),v=()=>ie(xr,"$_card_layout",r),d=()=>ie(di,"$_pic_failed_showInfo",r),_=()=>ie(vi,"$_show_hover_pic",r),o=()=>ie(Lr,"$_state_hover_pic",r),u=()=>ie(Ae,"$_card_detail",r),f=()=>ie(fi,"$_block_gay",r),p=()=>ie(ln,"$_card_radius",r);let m=X(),N=false,S=0,C=0;function b(G,de,Le){return G<=de&&(G=de),G>=Le&&(G=Le),G}const P=G=>{G.preventDefault(),N=true,S=G.clientX-l(m).getBoundingClientRect().left,C=G.clientY-l(m).getBoundingClientRect().top;},k=G=>{if(!N)return;const de=b(G.clientX-S,0,window.innerWidth-(l(m).getBoundingClientRect().width+5)),Le=b(G.clientY-C,0,window.innerHeight-(l(m).getBoundingClientRect().height+5));he(ui,{x:de,y:Le});},E=()=>{N=false;};Sn(()=>(window.addEventListener("mousemove",k),window.addEventListener("mouseup",E),()=>{window.removeEventListener("mousemove",k),window.removeEventListener("mouseup",E);})),qt();var T=jl();B("keydown",Mr,G=>{G.key==="x"&&(he(Er,!a()),window.changeFallView(a()));},true);var x=$e(T),M=h(x),A=h(M);Z(A,G=>{});var O=g(M,2),w=h(O),q=h(w);{var F=G=>{var de=Fl(),Le=$e(de),Ue=h(Le);Rl(Ue),L(G,de);},D=G=>{var de=Dl(),Le=$e(de),Ue=h(Le);zl(Ue),L(G,de);};Z(q,G=>{a()?G(F):G(D,false);});}var ne=g(w,2),le=h(ne),se=h(le);Hl(se);var me=g(ne,2);ut(x,G=>I(m,G),()=>l(m));var it=g(x,2);{var Fe=G=>{var de=Wl(),Le=h(de),Ue=h(Le),Vt=g(h(Ue),2),U=g(Ue,2),at=g(h(U),2),Ye=h(at),qn=h(Ye),nr=g(Ye,2),bt=g(at,2),ir=h(bt),Vn=h(ir),yt=g(ir,2),Hr=g(bt,2),Or=h(Hr),It=h(Or),Rr=g(Or,2),Fr=g(Hr,4),In=g(h(Fr),2);Ee(In,{get checked(){return rn(),d()},set checked(R){he(di,R);},$$legacy:true});var ar=g(Fr,2),Tn=g(h(ar),2);Ee(Tn,{get checked(){return rn(),_()},set checked(R){he(vi,R);},$$legacy:true});var De=g(ar,2);{var Dr=R=>{var Xe=Bl(),Qe=h(Xe),st=h(Qe),ot=h(st),_r=g(Qe,2);Ee(_r,{get checked(){return rn(),o()},set checked(Dn){he(Lr,Dn);},$$legacy:true}),Y(()=>K(ot,`预览大图默认状态: ${(o()?"尽量铺满":"尽量原图大小")??""}`)),L(R,Xe);};Z(De,R=>{_()&&R(Dr);});}var sr=g(De,4),Br=g(h(sr),2);Ee(Br,{get checked(){return u().category},set checked(R){_e(Ae,H(u).category=R,H(u));},$$legacy:true});var or=g(sr,2),An=g(h(or),2);Ee(An,{get checked(){return u().title},set checked(R){_e(Ae,H(u).title=R,H(u));},$$legacy:true});var lr=g(or,2),zn=g(h(lr),2);Ee(zn,{get checked(){return u().topping},set checked(R){_e(Ae,H(u).topping=R,H(u));},$$legacy:true});var Zr=g(lr,2),cr=g(h(Zr),2);Ee(cr,{get checked(){return u().free},set checked(R){_e(Ae,H(u).free=R,H(u));},$$legacy:true});var ur=g(Zr,2),Pn=g(h(ur),2);Ee(Pn,{get checked(){return u().size},set checked(R){_e(Ae,H(u).size=R,H(u));},$$legacy:true});var wt=g(ur,2),vr=g(h(wt),2);Ee(vr,{get checked(){return u().sub_title},set checked(R){_e(Ae,H(u).sub_title=R,H(u));},$$legacy:true});var Wr=g(wt,2),dr=g(h(Wr),2);Ee(dr,{get checked(){return u().tags},set checked(R){_e(Ae,H(u).tags=R,H(u));},$$legacy:true});var Tt=g(Wr,2),Hn=g(h(Tt),2);Ee(Hn,{get checked(){return u().download_collect},set checked(R){_e(Ae,H(u).download_collect=R,H(u));},$$legacy:true});var fr=g(Tt,2),On=g(h(fr),2);Ee(On,{get checked(){return u().upload_time},set checked(R){_e(Ae,H(u).upload_time=R,H(u));},$$legacy:true});var jr=g(fr,2),Gr=g(h(jr),2);Ee(Gr,{get checked(){return u().statistics},set checked(R){_e(Ae,H(u).statistics=R,H(u));},$$legacy:true});var Ur=g(jr,4),Yr=g(h(Ur),2);Ee(Yr,{get checked(){return rn(),f()},set checked(R){he(fi,R);},$$legacy:true});var Xr=g(Ur,4),Rn=g(h(Xr),2);Ee(Rn,{get checked(){return p().enabled},set checked(R){_e(ln,H(p).enabled=R,H(p));},$$legacy:true});var Fn=g(Xr,2);{var Qr=R=>{var Xe=Zl(),Qe=h(Xe),st=h(Qe),ot=g(Qe,2);Y(()=>K(st,`圆角大小: ${p().value??""} px`)),tn(ot,()=>p().value,_r=>_e(ln,H(p).value=_r,H(p))),L(R,Xe);};Z(Fn,R=>{p().enabled&&R(Qr);});}Y((R,Xe,Qe,st,ot)=>{Pe(de,"--get-text-color",R),$(Le,"style",`background-color: ${Xe??""};`),K(qn,`最小宽度: ${v().min??""} px`),$(nr,"max",Qe),K(Vn,`最大宽度: ${v().max??""} px`),$(yt,"min",st),$(yt,"max",ot),K(It,`卡片间隔: ${v().gap??""} px`);},[()=>Ft(Ji().get_bg_color()),()=>Ji().get_bg_color(),()=>Math.max(400,v().max),()=>Math.min(200,v().min),()=>Math.max(800,v().min*2)],tt),B("click",Vt,()=>he(wr,false)),tn(nr,()=>v().min,R=>_e(xr,H(v).min=R,H(v))),tn(yt,()=>v().max,R=>_e(xr,H(v).max=R,H(v))),tn(Rr,()=>v().gap,R=>_e(xr,H(v).gap=R,H(v))),jt(3,de,()=>Gt,()=>({duration:100})),B("click",de,Li(()=>he(wr,false))),L(G,de);};Z(it,G=>{c()&&G(Fe);});}Y(()=>{$(x,"style",`top:${i().y??""}px; left:${i().x??""}px;`),Pe(x,"--isFallView",a()?"#4ff74f":"yellow"),Pe(O,"--get-text-color",s().t2);}),B("mousedown",M,P),B("click",w,()=>{he(Er,!a()),window.changeFallView(a());}),B("click",ne,()=>{he(wr,!c());}),B("click",me,()=>{window.__clearPreview();}),L(e,T),mt(),n();}var Ul=tr('<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_iconCarrier"><circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5"></circle><path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path></g></svg>');function Yl(e){var t=Ul();L(e,t);}var Xl=z('<div class="iframe-overlay svelte-126sfo0"></div>'),Ql=z('<div id="_iframe_holder" class="svelte-126sfo0"><div class="_iframe_back svelte-126sfo0"></div> <div class="_iframe_parent svelte-126sfo0"><div class="resize-handle resize-handle-left svelte-126sfo0"></div> <!> <iframe frameborder="0" class="svelte-126sfo0"></iframe> <div class="_iframeCloseBtn svelte-126sfo0"><!></div> <div class="resize-handle resize-handle-right svelte-126sfo0"></div></div></div>');function Jl(e,t){pt(t,false);const[r,n]=rr(),i=()=>ie(on,"$_iframe_switch",r),a=()=>ie(Lt,"$_textColor",r),s=()=>ie(Ta,"$_iframe_url",r);let c=ve(t,"_app",8),v;function d(){o||he(on,0);}let _=X(1e3),o=false,u=X(false),f=()=>{};function p(P,k){const E=P.clientX,T=l(_);o=true,I(u,true),document.body.style.userSelect="none",f=x=>{if(!o)return;const M=x.clientX-E,A=k==="right"?T+M*2:T-M*2;I(_,Math.max(1e3,Math.min(A,window.innerWidth*.95)));},window.addEventListener("mousemove",f),window.addEventListener("mouseup",m);}function m(){o=false,I(u,false),document.body.style.userSelect="",window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",m);}function N(P){P.key==="Escape"&&(he(on,0),he(wr,false),Yt.getInstance()&&Yt.getInstance().clearPreview());}v=true,v&&qr(Il,{target:c()}),qr(Gl,{target:c()}),console.log("-------------->  PT_Fall Launch   <--------------"),qt();var S=dt();B("keydown",Mr,N,true);var C=$e(S);{var b=P=>{var k=Ql(),E=h(k),T=g(E,2),x=h(T),M=g(x,2);{var A=D=>{var ne=Xl();L(D,ne);};Z(M,D=>{l(u)&&D(A);});}var O=g(M,2),w=g(O,2),q=h(w);Yl(q);var F=g(w,2);Y(()=>{Pe(T,"--textColor1",a().t1),Pe(T,"--textColor2",a().t1+"90"),$(O,"src",s()),$(O,"title",s()),$(O,"style",`width: ${l(_)??""}px;`);}),B("click",E,Li(d),true),B("mousedown",x,D=>p(D,"left")),B("load",O,D=>{const ne=D.target.contentDocument||D.target.contentWindow.document;if(!ne){console.error("无法访问iframe内容文档, 可能是由于跨域限制。"),Dt.error("无法访问iframe内容文档, 可能是由于跨域限制。");return}const le=()=>{const me=ne.querySelector(".ant-card.detail-view");me&&(me.scrollIntoView({behavior:"smooth"}),console.log("成功滚动到目标元素！"),clearInterval(se));},se=setInterval(le,500);le();}),B("click",O,D=>{m(),D.stopPropagation();}),B("mouseup",O,D=>{m();}),B("click",w,d),B("mousedown",F,D=>p(D,"right")),jt(3,k,()=>Gt,()=>({duration:300})),L(P,k);};Z(C,P=>{i()&&P(b);});}L(e,S),mt(),n();}const _i=document.createElement("div");document.body.append(_i);qr(Jl,{target:_i,props:{_app:_i}});

})();
// ==UserScript==
// @name 百度网页优化去广告-Moe背景/自定义图片
// @namespace ？？？
// @version 1.0.9
// @description 建议使用stylus插件加载css，虽然油猴也行。已适配手机端
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match *://*.baidu.com/*
// @match https://www.baidu.com/
// @downloadURL https://update.greasyfork.org/scripts/423893/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A-Moe%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/423893/%E7%99%BE%E5%BA%A6%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A-Moe%E8%83%8C%E6%99%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "baidu.com" || location.hostname.endsWith(".baidu.com"))) {
  css += `

  body:before
    {
      content: "";
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -100;
      background-image: url(https://i0.hdslb.com/bfs/album/a284e6269702e91c0e8c8302a96f961bcbaeb2b7.jpg);
      background-position: center ;
      background-size: cover;
      background-attachment: fixed;
      background-repeat: no-repeat;
      opacity: .2
      }
      
      .FYB_RD, .se-ft-promlink, .c-line-clamp1{display: none}
      #head{background: rgba(0,0,0,0);}
      #form{background: rgba(255, 255, 255, .2);}
      #rs,#page-relative{opacity: .4}
      .bdsug{background: rgba(255, 255, 255, .8);}
      .wrapper_new .sam_newgrid~#page {background-color: rgba(0,0,0,0);}
      .wrapper_new #foot {background-color: rgba(0,0,0,0);}
      .wrapper_new #foot #help {background-color: rgba(0,0,0,0);}
      body .se-page-hd {background: rgba(0,0,0,0);}
      #page-bd, .se-head-tablink,.c-container, .se-page-controller .new-pagenav, .se-page-copyright, .se-page-ft {background: rgba(0,0,0,0);}
      .banner{opacity:0!important}
      .se-form{background: rgba(0,0,0,0)}
  `;
}
if (location.href === "https://www.baidu.com/") {
  css += `
      /*百度首页优化*/
      #s_wrap,#bottom_layer,.s-top-nav{display: none!important}
      #s_top_wrap{background: rgba(0,0,0,0);}
      #form{opacity:.5}
      #lg{opacity:0}`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

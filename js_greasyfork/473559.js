// ==UserScript==
// @name               18Comic(禁漫天堂)净化增强
// @name:zh-TW         18Comic(禁漫天堂)凈化增強
// @name:en            18ComicEnhance
// @namespace          https://github.com/GangPeter/pgscript
// @version            1.3.5
// @author             GangPeter
// @description        去除18Comic(禁漫天堂)广告、拦截弹窗、修复布局、支持PC端|移动端
// @description:zh-TW  去除18comic(禁漫天堂)廣告、攔截彈窗、修復布局、支持PC端|移動端
// @description:en     Remove 18comic ads
// @license            None
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABOElEQVR4nGL4DwRvyqX/M4AYU1PtIQwQYAAJOzo5QUTeAjkwjF8ArBdDxZsyCOP69etQASRZuBkwAJGUwjQTWdepCsv/nl5e/11dnCAmwHQgK1qfb/v/aY0mdncjY7gVMAAy7Q0Il0nBxdAUoOpGOBKoA68Vb5EU2Nna/g8KDv5/rtIMEhHf9l9H8YGLq+v/a9eu/Z+f5QDzJqqxj6u1/m8osEWEJC4vosUOAUeiA3DIgmNRBkpjeh9rOMHDCk0TMoZ5GGQwhgHgWMCi4VCZ1f/yKOf/FdHO/49XWGFPThBTMf3aGWf9f/KUKf+/fv36//fv3//7+vqA6d8BNcUiOx3dkLvV+v/93Oz/2zs4/Hd3d/8f4u38/0G1Dtx1mNEANADdG1jDAmoRqheI0EggOaNmKYSrcEcjAAAA//8XWQ2RAAAABklEQVQDAHc3181KAu2LAAAAAElFTkSuQmCC
// @homepageURL        https://github.com/GangPeter/pgscript
// @supportURL         https://github.com/GangPeter/pgscript
// @match              *://*.18comic.vip/*
// @match              *://*.18comic.org/*
// @match              *://*.jmcomic.me/*
// @grant              GM_addStyle
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/473559/18Comic%28%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%29%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/473559/18Comic%28%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%29%E5%87%80%E5%8C%96%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const i=document.createElement("style");i.textContent=a,document.head.append(i)})(" #billboard-modal,#guide-modal,div.modal-backdrop.fade.in{display:none!important}div.top-nav>div>ul>div.pull-left>li.top-menu-link{display:none!important}#wrapper>div.div-bf-pv{display:none!important}li:has(a[href*=veteran]){display:none!important}li:has(a[href*=games]){display:none!important}li:has(a[href*=mailto]){display:none!important}li:has(a[href*=videos_cosav]){display:none!important}a[href*=bonus]{display:none!important}#wrapper>div.footer-pad{display:none!important}#wrapper>div.container>div.footer-pad{display:none!important}#wrapper>div.footer-container{display:none!important}#wrapper>div.container>div.footer-container{display:none!important}#wrapper>div.float-right-daily{display:none!important}#wrapper>div.float-right-image{display:none!important}#wrapper>div.container>div.row:has(div.col-lg-3)[style]{display:none!important}div.container>div.row:has(div.col-lg-3.col-md-3.col-sm-3.col-xs-6){display:none!important}#wrapper>div.hidden-lg{display:none!important}div[data-group=album_detail]{display:none!important}body>div.ipprtcnt{display:none!important}#wrapper>div.container>div.row>div>div.panel>div.panel-body>div.row>div[data-show*=ok]{display:none!important}iframe{display:none!important}div:has(p)[data-group=content_page]{display:none!important}div:has(ins)[data-group=content_page]{display:none!important}div.c835e-33_e,div.center.scramble-page.thewayhome,ul.tips-overlay.container[data-type*=_u_guide]{display:none!important}#wrapper>div.owl-carousel.partial-view.owl-loaded.owl-drag{display:none!important}div[id*=exo-native-widget]>div.exo-native-widget-outer-container{display:none!important}div.blog_adv,div.top_adv{display:none!important}div.container>div.row>div>div.panel.panel-default>div[style*=text-align]{display:none!important}li.top-menu-m:has(a[data-label=menu-top-link]){display:none!important}div.d-lg-flex.align-items-center>ul.nav.navbar-nav.navbar-left>li.visible-xs.visible-sm.copy-block{display:none!important}div.d-lg-flex.align-items-center>ul.nav.navbar-nav.navbar-left>li.visible-xs.visible-sm.navbar-nav-icon{display:none!important}#wrapper>div.container{padding-bottom:50px!important} ");

(function () {
  'use strict';

  var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
    LogLevel2["Debug"] = "DEBUG";
    LogLevel2["Info"] = "INFO";
    LogLevel2["Warn"] = "WARN";
    LogLevel2["Error"] = "ERROR";
    return LogLevel2;
  })(LogLevel || {});
  function PGLOG(level, funName, message) {
    const now = /* @__PURE__ */ new Date();
    const time = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const logMessage = `${time} [${funName}|${level}]: ${message}`;
    console.log(logMessage);
  }
  const FUNNAME = "18Comic增强";
  PGLOG(LogLevel.Info, FUNNAME, "启动!");

})();
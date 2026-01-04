// ==UserScript==
// @name        LEQING_LINK
// @description    LEQING INSERT A LINK
// @version     1.1
// @author      AMANE
// @namespace   none
// @match       http://220.189.209.56:3001/*
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @compatible  Chrome
// @compatible  Firefox
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/450021/LEQING_LINK.user.js
// @updateURL https://update.greasyfork.org/scripts/450021/LEQING_LINK.meta.js
// ==/UserScript==
/* jshint esversion: 8 */



(function () {

    window.setTimeout(() => {
        if (location.href.indexOf('220.189.209.56:3001') === -1) {
            return;
        }
        const $target = $('#sidebarNav ul');
        // 插入链接
       const $el1 = $(`
        <li class="sidebar-menus" id="uni-link">
          <a id="blueglory" data-original-title="" title="" class="sidebar-subMenus-ul">
            <span class="sidebar-icon yf yf-lg yf-mkxz"></span>&nbsp;&nbsp;&nbsp;
            <span class="sidebar-title">数智建</span><i class="sidebar-caret fa fa-angle-right"></i>
          </a>
        </li>`);
       const $el2 = $(`
        <li class="sidebar-menus" id="uni-video">
          <a id="blueglory" data-original-title="" title="" class="sidebar-subMenus-ul">
            <span class="sidebar-icon yf yf-lg yf-zhkb"></span>&nbsp;&nbsp;&nbsp;
            <span class="sidebar-title">视频监控</span><i class="sidebar-caret fa fa-angle-right"></i>
          </a>
        </li>`);

       $target.append($el1);
       $target.append($el2);

       // 绑定点击跳转   
       $('#uni-link').click(() => { window.open('https://charts.uni-ubi.com/machinery/elevator?projectId=1210') });
       $('#uni-video').click(() => { window.open('https://sc.uni-ubi.com/site/safety/monitor/video/monitor/video/preview') });

  }, 1000)
})();

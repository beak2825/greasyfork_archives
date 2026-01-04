// ==UserScript==
// @name         屏蔽一切关于复联！！！六亲不认 慎用
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  防止剧透，强行屏蔽一切关于复联的信息
// @author       Yuchen
// @match        *://*/*
// @exclude      https://greasyfork.org/zh-CN/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/382171/%E5%B1%8F%E8%94%BD%E4%B8%80%E5%88%87%E5%85%B3%E4%BA%8E%E5%A4%8D%E8%81%94%EF%BC%81%EF%BC%81%EF%BC%81%E5%85%AD%E4%BA%B2%E4%B8%8D%E8%AE%A4%20%E6%85%8E%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/382171/%E5%B1%8F%E8%94%BD%E4%B8%80%E5%88%87%E5%85%B3%E4%BA%8E%E5%A4%8D%E8%81%94%EF%BC%81%EF%BC%81%EF%BC%81%E5%85%AD%E4%BA%B2%E4%B8%8D%E8%AE%A4%20%E6%85%8E%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var r = ()=> ["复联","复仇者联盟","雷神","钢铁侠","寡姐","托尼","浩克","灭霸","蚁人","绿巨人","小蜘蛛","美队","奇异博士","无限手套","鹰眼","幻世","猩红女巫"].map((item,index)=>{
        var $dom = $("a:contains('"+item+"'),span:contains('"+item+"'),p:contains('"+item+"'),em:contains('"+item+"')");
        $dom.closest('div').html("<span style='color:red'>[复联！小心剧透 已被油猴插件屏蔽]</span>");

    });
    r();
    var observer = new MutationObserver(r);
    observer.observe(document.body, { 'childList': true, 'attributes': true });
})();
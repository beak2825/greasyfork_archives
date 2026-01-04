// ==UserScript==
// @icon        https://www.youtube.com/favicon.ico
// @homepage     
    // @name        【自用】-恢复youtube页面
    // @version      2021.08.18
    // @description  恢复youtube页面
    // @author       heckles
    // @match        https://*.youtube.com/*
// @namespace https://blog.maple3142.net/
// @downloadURL https://update.greasyfork.org/scripts/431000/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91-%E6%81%A2%E5%A4%8Dyoutube%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/431000/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91-%E6%81%A2%E5%A4%8Dyoutube%E9%A1%B5%E9%9D%A2.meta.js
    // ==/UserScript==
     
  

function addNewStyle(newStyle) {//增加新样式表
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

  addNewStyle('\
#meta-contents,\
#info-contents{\
    display: contents !important;\
}\
ytd-watch-metadata.style-scope {\
    display: none !important;\
}\
');

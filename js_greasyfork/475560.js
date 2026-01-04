// ==UserScript==
// @name         12315平台插件
// @namespace    http://huclele.tk
// @version      0.2
// @description  实现12315平台编辑自由
// @author       鱼在水中游
// @match        https://www.12315.cn/cuser/portal/tscase/information
// @icon         https://www.12315.cn/favicon.ico
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/475560/12315%E5%B9%B3%E5%8F%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/475560/12315%E5%B9%B3%E5%8F%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

	//允许多行文本框粘贴事件
    document.onpaste = function (event){
        if(window.event){
            event = window.event;
        }
        try{
            return true;
        }catch (e){
            return false;
        }
    }
})();
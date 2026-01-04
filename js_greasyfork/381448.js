// ==UserScript==
// @icon         https://www.finnciti.com/favicon.ico
// @name         太阳finnciti自动获取所有ID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动获取所有ID
// @author       Sun
// @match        *://www.finnciti.com/?page=prizes_peep_live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381448/%E5%A4%AA%E9%98%B3finnciti%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%89%80%E6%9C%89ID.user.js
// @updateURL https://update.greasyfork.org/scripts/381448/%E5%A4%AA%E9%98%B3finnciti%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E6%89%80%E6%9C%89ID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var str="";$("#FCHids").find($("li")).each(function(){if(str){str=str+'|'+$(this).text()}else{str=$(this).text()}});prompt("ID",str);console.log(str);
})();
// ==UserScript==
// @name         老师评价自动评价
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://222.179.134.225:81/xsjxpj.aspx?xkkh=*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383371/%E8%80%81%E5%B8%88%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/383371/%E8%80%81%E5%B8%88%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
        let tb = $(".pjnr tr:gt(0)").each(function(){
        $("td:eq(2) select").val("优秀");
    });
    $(".pjnr tr:last").find("td:eq(2) select").val("良好");
        $("#Button1").click();
    if($("#pjkc option:last").is($("#pjkc option[selected=selected]"))){
        $("#Button2").click();
        //window.alert = function(){ return true; }
    }
})();
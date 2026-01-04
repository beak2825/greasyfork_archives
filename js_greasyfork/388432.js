// ==UserScript==
// @name         DLD missionassign assistant
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  help you draw the rewards of missionassign by one key
// @author       You
// @match        https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&B_UID=0&sid=&channel=0&g_ut=1&cmd=missionassign&subtype=0
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388432/DLD%20missionassign%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/388432/DLD%20missionassign%20assistant.meta.js
// ==/UserScript==

function request(url, callback){
    $.ajaxSettings.async = false;
    let retData;
    $.get(url, function(data){
        retData = data;
    });
    return retData;
};

(function() {
    'use strict';
    let $a = $("<a>一键</a>").css("color", "red");
    $a.on('click', function(e) {
		$("a").each(function(){
			if($(this).text() == "查看"){
				let url = $(this).attr("href").replace("subtype=1", "subtype=5")
                request(url);
			};
		});
        window.location.reload();
    });
	$("a").first().after($a);
})();
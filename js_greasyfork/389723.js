// ==UserScript==
// @name         DLD weapongod assistant
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&B_UID=0&sid=&channel=0&g_ut=1&cmd=weapongod&sub=*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=weapongod&sub=1
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=weapongod&sub=1&weapon_type=*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389723/DLD%20weapongod%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/389723/DLD%20weapongod%20assistant.meta.js
// ==/UserScript==

function request(url){
    $.ajaxSettings.async = false;
    let retData;
    $.get(url, function(data){
        retData = data;
    });
    return retData;
};
(function() {
    'use strict';
	$("a").each(function(){
		if($(this).text() == "镶嵌符石"){
            let pageData = request($(this).attr("href")),
                hole1 = /槽位1[^消]+消耗/.exec(pageData)[0],
                hole2 = /槽位2[^消]+消耗/.exec(pageData)[0],
                $div= $("<div></div>"),
                data = hole1 + "|" + hole2;
            data = data.replace(/融合等级：[1-9]级 战斗力：[1-9]/g, "").replace(/<br \/>/g, "").replace(/——/g, "—").replace(/战斗力[^消]+消耗/g, "").replace(/消耗/g, "");
			$div.html(data);
			$(this).next().after($div);
            $(this).text(".");
		};
	});
})();
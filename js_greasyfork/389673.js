// ==UserScript==
// @name         DLD intfmerid assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  get and combine internal force by one key
// @author       You
// @match        https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&*sid=&channel=0&g_ut=1&cmd=intfmerid&sub=*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389673/DLD%20intfmerid%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/389673/DLD%20intfmerid%20assistant.meta.js
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
	let $a = $("<a>一键合成</a>").css("color", "red");
    $a.on('click', function(e) {
		let pageData = request("https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=intfmerid&sub=10&op=4"),
			result = />[^>]+<\/a>&nbsp;[阳阴]&nbsp;[1-9]级/.exec(pageData)[0].replace("</a>", "").replace(">", "").replace(/&nbsp;/g, "").replace(/[阴阳]/, " "),
			data = /cult=[\d]+/.exec(pageData)[0].replace("cult=", "");
        result += " 修为：";
        if(result.indexOf("3级") != -1){
            result += data - 270 + "/1200";
        }else if(result.indexOf("4级") != -1){
            result += data - 1470 + "/8100";
        }else if(result.indexOf("5级") != -1){
            result += data - 9570 + "/45000";
        };
		let $text = $("#result");
		if( $text.length ){
			$text.html(result);
		}else{
			$a.after(`<span id="result">${result}</span>`);
		};
    });
	$("a").each(function(){
		if($(this).text() == "一键拾取"){
			$(this).after($a);
		};
	});
})();
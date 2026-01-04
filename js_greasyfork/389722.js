// ==UserScript==
// @name         DLD doppelganger assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=doppelganger&op=*&subtype=*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389722/DLD%20doppelganger%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/389722/DLD%20doppelganger%20assistant.meta.js
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
	let $a = $("<a>查看等级</a>").css("color", "red");
    $a.on('click', function(e) {
		$("a").each(function(){
			let $this = $(this);
			if($this.attr("href") && $this.attr("href").indexOf("cmd=view&") != -1){
				let pageData = request($this.attr("href")),
					level = /[0-9]级神[器技]/.exec(pageData)[0].replace("神器", "").replace("神技", "");
				$this.text($this.text() + level)
			};
		});
    });
	$($("a")[1]).after($a);
})();
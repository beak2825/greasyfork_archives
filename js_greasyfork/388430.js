// ==UserScript==
// @name         DLD factionarmy assistant
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  help you hit the members of factoryarmy by one key
// @author       You
// @match        https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=factionarmy&op=viewpoint&point_id=*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388430/DLD%20factionarmy%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/388430/DLD%20factionarmy%20assistant.meta.js
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
	let $a = $("<a>一键</a>").css("color", "red");
    $a.on('click', function(e) {
		let dead = false;
		$("a").each(function(){
			if( !dead){
				let $this = $(this);
				if($this.text() == "攻击"){
					let result = request($this.attr("href"));
					if(result.indexOf("血量不足") != -1){
						dead = true;
						alert("已阵亡");
					};
				};
				if($this.text() == "下一页"){
					window.location.reload();
				}else if($this.text() == "返回远征"){
					$this.click();
				};

			};
		});
    });
	$("a").first().after($a);
})();
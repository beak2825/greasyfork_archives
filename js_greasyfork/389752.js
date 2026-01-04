// ==UserScript==
// @name         DLD inscription assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=inscription&subtype=2&type_id=*
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=inscription&subtype=4&type_id=*&weapon_idx=*&attr_id=*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389752/DLD%20inscription%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/389752/DLD%20inscription%20assistant.meta.js
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
	let $a = $("<a>强化</a>").css("color", "red");
    $a.on('click', function(e) {
		let pageData = request($(this).data("href")),
			result = /Lv[0-9]/.exec(pageData)[0] + " " + /祝福值：[\d]+\/[\d]+/.exec(pageData) + " " + /剩余：[\d]+/.exec(pageData)[0] + " " + /消耗：[^祝]+[\d]+/.exec(pageData)[0],
            resultID = "result" + $(this).attr("id").replace(/x/g, "");
        $("#"+resultID).remove();
		$(this).next().after(`<span id="${resultID}">${result}</span>`);
    });
	let $a2 = $("<a>强化10次</a>").css("color", "red");
    $a2.on('click', function(e) {
		let pageData = request($(this).data("href")),
			result = /Lv[0-9]/.exec(pageData)[0] + " " + /祝福值：[\d]+\/[\d]+/.exec(pageData) + " " + /剩余：[\d]+/.exec(pageData)[0] + " " + /消耗：[^祝]+[\d]+/.exec(pageData)[0],
            resultID = "result" + $(this).attr("id").replace(/x/g, "");
        $("#"+resultID).remove();
		$(this).after(`<span id="${resultID}">${result}</span>`);
    });
    let need2reload = false;
	$("a").each(function(index){
		let $this = $(this);
		if($this.text() == "强化"){
			let url = $this.attr("href").replace("subtype=3", "subtype=5"),
				$aClone = $a.clone(true),
				$a2Clone = $a2.clone(true);
			$aClone.attr("data-href", url).attr("id", "x"+index);
			$a2Clone.attr("data-href", url + "&times=10").attr("id", "xx"+index);
			$this.after($a2Clone).after($aClone);
			$this.text(".");
		}else if($this.text() == "开启"){
            request($this.attr("href"));
            need2reload = true;
        };
	});
    if(need2reload)
        window.location.reload();
})();
// ==UserScript==
// @name         DLD courier assistant
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  help to filter the courier power lower than you when you click the refresh button
// @author       You
// @include      https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=*&cmd=cargo&op=3
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388431/DLD%20courier%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/388431/DLD%20courier%20assistant.meta.js
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

    var selfPower = window.sessionStorage.getItem("selfPower"),
        autoHijack = !!window.sessionStorage.getItem("autoHijack"),
        powerList = window.sessionStorage.getItem("powerList"),
        $refresh = $($("a")[3]);
    if(!!powerList){
        powerList = JSON.parse(powerList);
    }else{
        powerList = {};
    };
    if(!selfPower){
        var pageData = request("https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&B_UID=0&sid=&channel=0&g_ut=1&cmd=viewselfpower&type=1");
        if( !!pageData ){
            selfPower = parseFloat(pageData.match(/综合战斗力：(.*)<br \/>/)[1]);
            window.sessionStorage.setItem("selfPower", selfPower);
        };
    };
	$("a").each(function(){
		let $this = $(this);
		if($this.text() == "拦截"){
            let name = $this[0].previousSibling.previousSibling.textContent,
				href = $this.attr("href");
            if(name.indexOf("温良恭") != -1){
                var uid = href.match(/passerby_uin=(\d*)$/)[1],
                    power = powerList[uid];
                if(!power){
                    let infoUrl = `https://dld.qzapp.z.qq.com/qpet/cgi-bin/phonepk?zapp_uin=&sid=&channel=0&g_ut=1&cmd=totalinfo&B_UID=${uid}&page=1&type=9&from_pf_list=1`;
                    pageData = request(infoUrl);
                    if( !!pageData && pageData.match(/战斗力<\/a>:(.*) 胜率:/)){
                        power = parseFloat(pageData.match(/战斗力<\/a>:(.*) 胜率:/)[1]);
                    }else{
                        power = 9999;
                    };
                    powerList[uid] = power;
                };
                if( power < selfPower ){
                    let $span = $(`<span>${power}</span>`).css("color", "red");
                    $this.next().after($span);
                    if( autoHijack ){
                        pageData = request(href);
                        if( pageData.indexOf("剩余拦截次数：0") != -1 ){
                            autoHijack = false;
                            window.sessionStorage.clear();
                            $refresh[0].click();
                        };
                    };
                };
            };
		};
	});

    window.sessionStorage.setItem("powerList", JSON.stringify(powerList));
    let $a;
    if(!autoHijack){
		$a = $("<a>自动(温)</a>").css("color", "red");
        $a.on('click', function(e) {
            console.log(11)
            window.sessionStorage.setItem("autoHijack", 1);
            $refresh[0].click();
        });
    }else{
        $a = $("<a>取消</a>").css("color", "red");
        $a.on('click', function(e) {
            window.sessionStorage.clear();
            $refresh[0].click();
        });
    };
	$refresh.after($a);
    if( autoHijack ){
        setTimeout( function(){
            $refresh[0].click();
        }, 20000 );
    }
    /*window.onunload = function(){
        window.sessionStorage.clear();
    };*/
})();
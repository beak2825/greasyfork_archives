// ==UserScript==
// @name         proxy getter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从代理表中获取代理 ip:port 列表
// @author       me10zyl
// @match        http://www.proxynova.com/proxy-server-list/*
// @match        http://cn-proxy.com/*
// @match        http://www.kuaidaili.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/22838/proxy%20getter.user.js
// @updateURL https://update.greasyfork.org/scripts/22838/proxy%20getter.meta.js
// ==/UserScript==

var selectors = ["#tbl_proxy_list",".table-container", "#index_free_list"];
(function() {

    // Your code here...

    for(var i in selectors){
        if($(selectors[i]).length <= 0){
            continue;
        }
        $(selectors[i]).before("<button id='copy_btn_1234'>复制这些代理地址</button>");
        $("#copy_btn_1234").click(function(){
            catchProxies();
        });
    }

    $(document).keypress(function(e){
        if(e.which == 55){
            catchProxies();
        }
    });
})();

function catchProxies(){
    var ips = [];
    console.log("start fetch proxy ips...");
    for(var i in selectors){
        if($(selectors[i]).length <= 0){
            continue;
        }
        $(selectors[i] + " tr").each(function(){
            var ip = $(this).find("td:first-child").text().trim();
            var port = $(this).find("td:nth-child(2)").text().trim();
            if(!/\s+/.test(port)){
                var str = ip + ":" + port;
                console.log(str);
                ips.push(str);
            }
        });
    }
    var alertstr = "";
    for(var j in ips){
        alertstr += ips[j] + "\n";
    }
    copyToClipboard(alertstr);
}


function copyToClipboard(text){
        window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}
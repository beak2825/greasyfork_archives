// ==UserScript==
// @name         沃尔玛查询upc
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在页面显示商品UPC码
// @author       Take
// @match        *://www.walmart.com/ip/*
// @match        *://www.target.com/p/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429073/%E6%B2%83%E5%B0%94%E7%8E%9B%E6%9F%A5%E8%AF%A2upc.user.js
// @updateURL https://update.greasyfork.org/scripts/429073/%E6%B2%83%E5%B0%94%E7%8E%9B%E6%9F%A5%E8%AF%A2upc.meta.js
// ==/UserScript==

(function() {
    var www = window.location.host;
    var html = document.documentElement.outerHTML;
    var a,upc
    if(www == "www.walmart.com"){
        a = html.indexOf('"upc":"');
        console.log("沃尔玛");
        var b = html.indexOf('","fetched"');//沃尔玛
        upc = html.substring(a+7,b);
    }else{
        a = html.indexOf('UPC</b>');
        upc = html.substring(a+9,a+21);
    }

    console.log("upc为：",upc);
    if(upc!="" && upc.length<=12){
        var div = document.createElement("div");
        div.innerHTML = "<div class='upc' onclick='copyText()'>UPC：<span id='myupc'>"+upc+"</sapn> <a target='_blank' href='https://www.amazon.com/s?k="+upc+"&ref=nb_sb_noss'>Go></a></div><style>a{color:white;text-decoration:none}a:hover{color:#f5a8a8;text-decoration:none}.upc{position: fixed;right: 0;top: 23%;background-color: #2271dc;border-radius: 5px;color: white;padding: 5px 15px;z-index: 99999;}</style>";
        document.body.appendChild(div);
        //window.open('https://www.amazon.com/s?k='+upc+'&ref=nb_sb_noss', '_blank');
    }


function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
})();


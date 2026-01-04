// ==UserScript==
// @name         sosobtc屏蔽插件
// @namespace    undefined
// @version      0.26
// @description  用于屏蔽sosobtc聊天室中恶意用户
// @author       misaka
// @match        http://io.sosobtc.com/*
// @match        https://k.sosobtc.com/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/31090/sosobtc%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/31090/sosobtc%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

//您可以在这里添加需要屏蔽的新用户
//如您要屏蔽用户*.*.123.123
//则在最下面添加代码user[4]="*.*.123.123";
//注意user和Array里面的数字每次都要加1

var users=new Array(8);
users[0]="*.*.206.229";
users[1]="*.*.165.105";
users[2]="*.*.24.107";
users[3]="*.*.248.162";
users[4]="*.*.207.145";
users[5]="*.*.132.221";
users[6]="*.*.133.9";
users[7]="*.*.152.21";
users[8]="heiheihei234578";

console.info("start");
setInterval(function(){run();}, 1000);

function run() {
    $("#world").bind('DOMNodeInserted',hideli());
}

function hideli() {
    for (var x in users)
    {
        $("font:contains("+users[x]+")").hide();
        $("font:contains("+users[x]+")").next().hide();
        $("font:contains("+users[x]+")").next().next().hide();
    }
}

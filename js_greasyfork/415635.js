// ==UserScript==
// @name         小米積分500
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://www.mi.com/tw/service/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415635/%E5%B0%8F%E7%B1%B3%E7%A9%8D%E5%88%86500.user.js
// @updateURL https://update.greasyfork.org/scripts/415635/%E5%B0%8F%E7%B1%B3%E7%A9%8D%E5%88%86500.meta.js
// ==/UserScript==

//商城積分500
fetch("https://go.buy.mi.com/tw/loyalty/exchangereward?from=pc&rewardType=coupon&rewardId=711", {
    "credentials": "include",
    "method": "GET",
});

//米家積分500
fetch("https://go.buy.mi.com/tw/loyalty/exchangereward?from=pc&rewardType=coupon&rewardId=719", {
    "credentials": "include",
    "method": "GET",
});

//2020-1111
fetch("https://hd.c.mi.com/tw/eventapi/api/raffle/drawprize", {
    "credentials": "include",
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    "body": "tag=20double11-tw&present_id=1618",
    "method": "POST",
});

//無門檻250
fetch("https://hd.c.mi.com/tw/eventapi/api/raffle/drawprize", {
    "credentials": "include",
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    "body": "tag=20double11-tw&present_id=1617",
    "method": "POST",
});
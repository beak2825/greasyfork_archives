// ==UserScript==
// @name         이랜드몰 미쏘전용
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @description  try to take over the world!d
// @author       You
// @match        https://www.elandmall.com/shop/initPlanShop.action?disp_ctg_no=2104514687
// @match        https://m.elandmall.com/shop/initPlanShop.action?disp_ctg_no=2104514687
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439785/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EB%AF%B8%EC%8F%98%EC%A0%84%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/439785/%EC%9D%B4%EB%9E%9C%EB%93%9C%EB%AA%B0%20%EB%AF%B8%EC%8F%98%EC%A0%84%EC%9A%A9.meta.js
// ==/UserScript==


var stack = 0;
function macroFunc(){
    var macro = setInterval(function() {
        eval("elandmall.cpnDown({promo_no : 'm/X3Oa776e9DKBTQXdma2A==,lD93ZSUAiFJQTNnir+ZDug==,m5YFVxT1WCxfJhgYJrwtTw==,letRQTgtAAxy32vMEUoamg==',cert_key: '07qc2wm08fSgepfGXe5kP6fjHEWBNr5B4CjpU8yN6Yc=,07qc2wm08fSgepfGXe5kP9l8L/s8XdJPFgiqritrdhI=,07qc2wm08fSgepfGXe5kPyVpD/93enep5vtPPbDsVLk=,07qc2wm08fSgepfGXe5kP7xOVoT3vllZQAZNOh1Bn3g='})");
        if(stack > 2000)
            clearInterval(macro);
        stack++;
    }, 50);
}


var alrtScope;
if (typeof unsafeWindow === "undefined") {
    alrtScope = window;
} else {
    alrtScope = unsafeWindow;
}

var alertcnt=0;
alrtScope.alert = function (str) {
    $('html > head > title').text(++alertcnt+'회 '+str);
};


macroFunc();
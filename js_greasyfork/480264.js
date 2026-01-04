// ==UserScript==
// @name         预约挂号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license 1
// @description  这是预约挂号
// @author       You
// @match        https://www.114yygh.com/hospital/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5axxw.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/480264/%E9%A2%84%E7%BA%A6%E6%8C%82%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480264/%E9%A2%84%E7%BA%A6%E6%8C%82%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
ajaxHooker.hook(request => {
    if (request.url.includes( '/web/product/detail')) {
        request.response = res => {
            const obj=JSON.parse(res.responseText)
                        console.log(obj);
            obj.data=obj.data.map(a=>{
                a.detail=a.detail.map(b=>{
                b.wnumber=9

                    return b
                })
                return a
            })
            res.responseText = JSON.stringify(obj);
        };
    }

        if (request.url.includes( '/web/product/list')) {
        request.response = res => {
                        console.log(res.responseText);
            const obj=JSON.parse(res.responseText)
                        console.log(obj);
            obj.data.calendars=obj.data.calendars.map(a=>{
                a.status="AVAILABLE"
                return a
            })
            res.responseText = JSON.stringify(obj);
        };
    }
});

})();
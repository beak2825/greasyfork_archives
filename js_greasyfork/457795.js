// ==UserScript==
// @name         hyperbeam VIP
// @namespace    hyperbeam.taozhiyu.github.io
// @version      0.1
// @description  unlock VIP
// @author       涛之雨
// @match        *://hyperbeam.com/*
// @icon         https://hyperbeam.com/images/favicon.png
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant        none
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/457795/hyperbeam%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/457795/hyperbeam%20VIP.meta.js
// ==/UserScript==

/* global ajaxHooker*/
/* jshint esversion: 11 */
(function() {
    'use strict';

    ;(()=>{
        const Date_=Date;
        Date=function(a){
            const d=new Date_(a);
            this.tao=a;
            this.zhiyu=d;
            return isNaN(d)?a:d;
        };
        Object.getOwnPropertyNames(Date_.prototype).map(a=>{
            Date.prototype[a]=function(){
                const d=new Date_(this.zhiyu)[a]();
                return isNaN(d)?this.tao:d;
            };
        });
        Date.now=Date_.now;
    })();
    ajaxHooker.hook(request => {
        if (request.url.includes('/private/graphql')) {
            request.response = res => {
                const a=res.json;
                if(a?.data?.me?.user){
                    a.data.me.user.admin=true;
                    a.data.me.subExpiryDate=true;
                    a.data.me.billing={
                        ...a.data.me.billing,
                        renewalDate:"someday(Maybe)",
                        billingDate:"2099",
                        status: "ACTIVE",
                    };
                    a.data.me.subExpiryDate="2099";
                }
                res.json=a;
            };
        }
    });
})();
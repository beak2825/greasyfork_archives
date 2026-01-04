// ==UserScript==
// @name         查看当前BUFF账号信息插件
// @namespace    https://greasyfork.org/zh-CN/users/988964-yan-ping-chen
// @version      1.23
// @description  查看当前BUFF账号信息插件。
// @author       chinapok
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license         AGPL-3.0
// @copyright       2024, chinapok
// @require         https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @match           https://buff.163.com/?game=csgo
// @run-at          document-body
// @grant           unsafeWindow
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @grant           GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/484603/%E6%9F%A5%E7%9C%8B%E5%BD%93%E5%89%8DBUFF%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/484603/%E6%9F%A5%E7%9C%8B%E5%BD%93%E5%89%8DBUFF%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buff_info = unsafeWindow.g.user;
    if(typeof buff_info == 'undefined'){
		showMessage("账户未登录","无法查看当前BUFF账号信息，请先登录BUFF。","error",false);
	}else{
        let steam_id = unsafeWindow.g.user.steamid?unsafeWindow.g.user.steamid:'未绑定steam账户';
        let buff_nick_name = unsafeWindow.g.user.nickname;
        let buff_id = unsafeWindow.g.user.id;
        let buff_mobile = unsafeWindow.g.user.mobile;
        let requireCookieNames = ['session'];
        GM_cookie("list",{domain:'.buff.163.com'},function(cookieInfos, error) {
            if (!error) {
                var session;
                cookieInfos.forEach(function (cookieInfo) {
                    if (requireCookieNames.includes(cookieInfo.name)) {
                        session = `【 "buff_cookie" : "${cookieInfo.name}=${cookieInfo.value}; HttpOnly; Path=/", 】`;
                    }
                });
                if(session && session != undefined){
                    showMessage("当前账户COOKIE",session,"info",false);
                }else{
                 showMessage("无法获取COOKIE","请使用篡改猴测试版【 https://chromewebstore.google.com/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4%E6%B5%8B%E8%AF%95%E7%89%88/gcalenpjmijncebpfijmoaglllgpjagf 】，重新安装本插件。","info",false);
                }
            } else {
                 showMessage("获取COOKIE错误","请联系作者反馈。","info",false);
            }
        });
        showMessage("当前账户信息","STEAM ID："+steam_id+"<br/>BUFF昵称："+buff_nick_name+"；<br/>BUFF手机号："+buff_mobile+"<br/>BUFF ID："+buff_id,"info",false);
    }
       GM_addStyle(".jq-toast-wrap{display:block;position:fixed;width:250px;pointer-events:none!important;margin:0;padding:0;letter-spacing:normal;z-index:9000!important}.jq-toast-wrap *{margin:0;padding:0}.jq-toast-wrap.bottom-left{bottom:20px;left:20px}.jq-toast-wrap.bottom-right{bottom:20px;right:40px}.jq-toast-wrap.top-left{top:20px;left:20px}.jq-toast-wrap.top-right{top:20px;right:74px}.jq-toast-single{display:block;width:100%;padding:10px;margin:0 0 5px;border-radius:4px;font-size:15px;font-family:arial,sans-serif;line-height:18px;position:relative;pointer-events:all!important;background-color:#444;color:white;white-space:normal;word-break:break-all;overflow:hidden}.jq-toast-single hr{border:1px solid #fff;margin:4px 0}.jq-toast-single h2{font-family:arial,sans-serif;font-size:18px;font-weight:bold;margin:0 0 7px;background:0;color:inherit;line-height:inherit;letter-spacing:normal}.jq-toast-single a{color:#eee;text-decoration:none;font-weight:bold;border-bottom:1px solid white;margin-right:8px}.jq-toast-single ul{margin:0 0 0 15px;background:0;padding:0}.jq-toast-single ul li{list-style-type:disc!important;line-height:17px;background:0;margin:0;padding:0;letter-spacing:normal}.close-jq-toast-single{position:absolute;top:2px;right:5px;font-size:22px;cursor:pointer}.jq-toast-loader{display:block;position:absolute;bottom:0;height:4px;width:0;left:0;background:#000!important;opacity:.4}.jq-toast-loaded{width:100%}.jq-has-icon{padding:10px 10px 10px 43px;background-repeat:no-repeat;background-position:10px}.jq-icon-info{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=');background-color:#2878c1e6;color:#d9edf7;border-color:#bce8f1}.jq-icon-warning{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGYSURBVEhL5ZSvTsNQFMbXZGICMYGYmJhAQIJAICYQPAACiSDB8AiICQQJT4CqQEwgJvYASAQCiZiYmJhAIBATCARJy+9rTsldd8sKu1M0+dLb057v6/lbq/2rK0mS/TRNj9cWNAKPYIJII7gIxCcQ51cvqID+GIEX8ASG4B1bK5gIZFeQfoJdEXOfgX4QAQg7kH2A65yQ87lyxb27sggkAzAuFhbbg1K2kgCkB1bVwyIR9m2L7PRPIhDUIXgGtyKw575yz3lTNs6X4JXnjV+LKM/m3MydnTbtOKIjtz6VhCBq4vSm3ncdrD2lk0VgUXSVKjVDJXJzijW1RQdsU7F77He8u68koNZTz8Oz5yGa6J3H3lZ0xYgXBK2QymlWWA+RWnYhskLBv2vmE+hBMCtbA7KX5drWyRT/2JsqZ2IvfB9Y4bWDNMFbJRFmC9E74SoS0CqulwjkC0+5bpcV1CZ8NMej4pjy0U+doDQsGyo1hzVJttIjhQ7GnBtRFN1UarUlH8F3xict+HY07rEzoUGPlWcjRFRr4/gChZgc3ZL2d8oAAAAASUVORK5CYII=');background-color:#F89406cc;color:#fcf8e3;border-color:#faebcc}.jq-icon-error{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHOSURBVEhLrZa/SgNBEMZzh0WKCClSCKaIYOED+AAKeQQLG8HWztLCImBrYadgIdY+gIKNYkBFSwu7CAoqCgkkoGBI/E28PdbLZmeDLgzZzcx83/zZ2SSXC1j9fr+I1Hq93g2yxH4iwM1vkoBWAdxCmpzTxfkN2RcyZNaHFIkSo10+8kgxkXIURV5HGxTmFuc75B2RfQkpxHG8aAgaAFa0tAHqYFfQ7Iwe2yhODk8+J4C7yAoRTWI3w/4klGRgR4lO7Rpn9+gvMyWp+uxFh8+H+ARlgN1nJuJuQAYvNkEnwGFck18Er4q3egEc/oO+mhLdKgRyhdNFiacC0rlOCbhNVz4H9FnAYgDBvU3QIioZlJFLJtsoHYRDfiZoUyIxqCtRpVlANq0EU4dApjrtgezPFad5S19Wgjkc0hNVnuF4HjVA6C7QrSIbylB+oZe3aHgBsqlNqKYH48jXyJKMuAbiyVJ8KzaB3eRc0pg9VwQ4niFryI68qiOi3AbjwdsfnAtk0bCjTLJKr6mrD9g8iq/S/B81hguOMlQTnVyG40wAcjnmgsCNESDrjme7wfftP4P7SP4N3CJZdvzoNyGq2c/HWOXJGsvVg+RA/k2MC/wN6I2YA2Pt8GkAAAAASUVORK5CYII=');background-color:#d4372fcc;color:#f2dede;border-color:#ebccd1}.jq-icon-success{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==');color:#dff0d8;background-color:#059850e6;border-color:#d6e9c6}.jq-icon-info:hover{background-color:#2878c1}.jq-icon-warning:hover{background-color:#e48b06}.jq-icon-error:hover{background-color:#c53d36}.jq-icon-success:hover{background-color:#059850}");
    function showMessage(title, msg, type = "info", time = 5000, position = 'top-right'){
        return $.toast({text: msg,heading: title,icon: type,showHideTransition: 'fade',allowToastClose: true,hideAfter: time,stack: 10,position: position,textAlign: 'left',loader: true});
    }
})();
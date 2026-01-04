// ==UserScript==
// @name         精选审核
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  精选审核增加快捷键
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        *://zhidao.baidu.com/metis/auth/applyuserlist*
// @match        https://zhidao.baidu.com/youliao/qslist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389530/%E7%B2%BE%E9%80%89%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/389530/%E7%B2%BE%E9%80%89%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

jQuery(function () {
    jQuery(document).keydown(function (event) {
        let m = location.href.match(/uid=(\w+)/);
        //let m = `https://zhidao.baidu.com/metis/auth/applyuserlist?status=0#/detail?uid=735675742&status=0`.match(/uid=(\w+)/);
        if (m && m.length) {
            let uid = m[1];
            if (uid) {
                if (event.keyCode == 49) {
                    console.log("关闭图片")
                    jQuery(jQuery("div").toArray().filter(e => jQuery(e).css('position') == "fixed")).click();
                    jQuery.ajax({
                        url: 'https://zhidao.baidu.com/metis/submit/teamaudit',
                        type: 'post',
                        data: {
                            uid: uid,
                            opType: 'deny',
                            userFields: 'idcardImg',
                        },
                        success: function (data) {
                            console.log(JSON.stringify(data, null, 2));
                            if (data.errno == 0) {
                                location = 'https://zhidao.baidu.com/metis/auth/applyuserlist?status=0#/';
                            } else {
                                alert(JSON.stringify(data, null, 2));
                            }
                        }
                    });
                }
                if (event.keyCode == 50) {
                    console.log("关闭图片")
                    jQuery(jQuery("div").toArray().filter(e => jQuery(e).css('position') == "fixed")).click();
                    console.log("通过");
                    jQuery.ajax({
                        url: 'https://zhidao.baidu.com/metis/submit/teamaudit',
                        type: 'post',
                        data: {
                            uid: uid,
                            opType: 'pass',
                        },
                        success: function (data) {
                            console.log(JSON.stringify(data, null, 2));
                            if (data.errno == 0) {
                                location = 'https://zhidao.baidu.com/metis/auth/applyuserlist?status=0#/';
                            } else {
                                alert(JSON.stringify(data, null, 2));
                            }
                        }
                    });
                }
            }
        }
    })
});
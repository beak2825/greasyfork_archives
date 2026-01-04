// ==UserScript==
// @name         超星章节测验自动瞎完成
// @namespace    https://mooc1.chaoxing.com/
// @version      0.1
// @description  章节测验自动瞎完
// @author       星星课
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/432306/%E8%B6%85%E6%98%9F%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C%E8%87%AA%E5%8A%A8%E7%9E%8E%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/432306/%E8%B6%85%E6%98%9F%E7%AB%A0%E8%8A%82%E6%B5%8B%E9%AA%8C%E8%87%AA%E5%8A%A8%E7%9E%8E%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==
var window = unsafeWindow;
(function () {
    'use strict';
    var timer=setInterval(() => {


        var timus = $("iframe").contents().find("iframe").contents().find("iframe").contents().find(".StudentTimu");
        if (timus.length > 0) {
            clearInterval(timer);
        }
        for (var i = 0; i < timus.length; i += 1) {
            var tm = timus.eq(i);
            var radio_num = tm.find(":radio").length;
            if (radio_num > 0) {
                var rand = parseInt(Math.random() * radio_num);
                tm.find(":radio").eq(rand).click();
            }
            var checkbox_num = tm.find(":checkbox").length;
            if (checkbox_num > 0) {
                var rand = parseInt(Math.random() * checkbox_num + 1);
                var choose = new Array();
                for (var j = 0; j < rand; j += 1) {
                    do {
                        var rand_ = parseInt(Math.random() * checkbox_num);
                        if (choose.indexOf(rand_) < 0) {
                            tm.find(":checkbox").eq(rand_).click();
                            choose.push(rand_);
                            break;
                        }
                    } while (true);


                }

            }

        }
    }, 3000);
})();
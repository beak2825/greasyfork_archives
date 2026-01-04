// ==UserScript==
// @name         一键撸猫
// @namespace    knva
// @version      0.4
// @homepage     https://greasyfork.org/zh-CN/scripts/381918
// @description  一键撸猫帮助你更好的撸猫
// @author       knva
// @match        https://likexia.gitee.io/cat-zh/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381918/%E4%B8%80%E9%94%AE%E6%92%B8%E7%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/381918/%E4%B8%80%E9%94%AE%E6%92%B8%E7%8C%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var UI = {
        Btn: (pclass, text) => {
            return `<div class="btn nosel modern ${pclass}" style="position: relative; display: block;"  > <div class="btnContent" title=""><span>${text}</span></div></div>`;
        },
    };
    var WG = {
        init: () => {
            var html = UI.Btn("startbtn1", '开始采集') + UI.Btn("startbtn2", '开始精炼');

            $("#gameContainerId").after(html);
            ; $(".startbtn1").on("click", () => {
                WG.starttimer(0);
                if (WG.p_timer[0] == null) {
                    $(".startbtn1 span").text('开始采集')
                } else {
                    $(".startbtn1 span").text('停止采集')
                }
            })
                ; $(".startbtn2").on("click", () => {
                    WG.starttimer(1);
                    if (WG.p_timer[1] == null) {
                        $(".startbtn2 span").text('开始精炼')
                    } else {
                        $(".startbtn2 span").text('停止精炼')
                    }
                })
        },
        sleep: () => {
        },
        p_timer: [null, null],
        starttimer: p => {
            if (WG.p_timer[p] != null) {
                clearInterval(WG.p_timer[p]);
                WG.p_timer[p]=null;
                return;
            }
            if (p == 0) {
                WG.p_timer[p] = setInterval(() => {
                    $.each($(".btn"), function () {
                        if ($(this).html().indexOf("采集猫薄荷") >= 0) {
                            $(this).click();
                        }
                    });
                }, 1);
            }
            if (p == 1) {
                WG.p_timer[p] = setInterval(() => {
                    $.each($(".btn"), function () {
                        if ($(this).html().indexOf("精炼猫薄荷") >= 0) {
                            $(this).click();
                        }
                    });
                }, 100);
            }
        },
        stoptimer: () => {
            for (let item of WG.p_timer) {
                clearInterval(item);
            }
        }

    }
    // Your code here...

    $(document).ready(function () {
        WG.init();


    });
})();
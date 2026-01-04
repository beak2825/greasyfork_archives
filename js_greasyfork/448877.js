// ==UserScript==
// @name         MC官网禁止弹窗
// @namespace    Vikrant
// @version      1.0.0
// @description  禁止在打开或刷新MC国际版官网时，弹出的跳转网易版MC官网的弹窗
// @author       Vikrant4096
// @match        https://www.minecraft.net/zh-hans*
// @icon         none
// @grant        unsafeWindow
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/448877/MC%E5%AE%98%E7%BD%91%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/448877/MC%E5%AE%98%E7%BD%91%E7%A6%81%E6%AD%A2%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function main() {                           //制造一个假的弹窗元素供网页js操作，避免真正的弹窗被显示出来
        let fake = document.createElement("div")
        fake.classList.add("geo-loc-wrapper-edit-content")
        let fakeModal = document.createElement("div")
        fakeModal.id = ("netease-promotion-modal")
        $(document.body).prepend(fake)          //插在body最前面，可以让网页的选择器选中它而不是真正的弹窗
        fake.append(fakeModal)
    }
    function stop(e) {
        clearInterval(e)
    }
    let scan = setInterval(() => {              //尽可能快地插入假元素
        let body = document.body
        if (!!body) {
            stop(scan)
            main()
        }
    }, 20);

    //附：网页源代码里显示弹窗的部分
    /*    
    $(document).ready((function () {
        0 != $("#netease-promotion-modal").length
            &&
            ($("#netease-promotion-modal").closest(".geo-loc-wrapper-edit-content").length > 0
                ?
                $("#netease-promotion-modal").remove()
                :
                ($("#netease-promotion-modal").parents("body").hasClass("modal-open")
                    &&
                    $("#netease-promotion-modal").parents("body").removeClass("modal-open"),
                    $("#netease-promotion-modal").parents("body").addClass("modal-open"),
                    $("#netease-promotion-modal").addClass("show"),
                    $("#popup-btn").on("click", (function () {
                        $("#netease-promotion-modal").find("show"),
                        $("#netease-promotion-modal").removeClass("show"),
                        $("#netease-promotion-modal").parents("body").removeClass("modal-open")
                    }))
                )
            )
    }))
    */
})();
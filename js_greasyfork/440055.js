// ==UserScript==
// @name         Tapd小助手
// @namespace    tapd
// @version      0.1.1
// @description  Tpad小助手
// @author       yaxinliu
// @include      *://tapd.oa.com/*
// @include      *://tapd.woa.com/*
// @icon         http://tapd.oa.com/favicon.ico
// @grant        none
// @run-at       document-body
// @license      Private
// @downloadURL https://update.greasyfork.org/scripts/440055/Tapd%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/440055/Tapd%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    class DOMNode {
        constructor (selector) {
            this.selector = selector
            this.timmer = null
            this.triggered = false
        }

        onReady(callback) {
            const self = this
            document.addEventListener("DOMSubtreeModified", function(event) {
                const target = event.target
                if (self.triggered) {
                    return
                }
                if (target !== document.querySelector(self.selector)) {
                    return
                }
                if (self.timmer) {
                    clearTimeout(self.timmer)
                }
                self.timmer = setTimeout(() => {
                    self.triggered = true
                    callback()
                }, 100)
            })
        }
    }

    const className = ".iteration_gird #div_tabs .member-bar"
    const dom = new DOMNode(className)
    dom.onReady(function() {
        const $elem = $(`<div class="member-left-block" style="float: left; margin-top: 10px;">
        <div>
            <a class="font font-unfold fold-operation unfold-all" style="user-select:none;">&nbsp;&nbsp;全部展开</a>
        </div>
    </div>`)
        $(className).append($elem)
        $elem.click(function() {
            const $this = $(this).find(".fold-operation")
            console.log($this)
            // 全部展开
            if ($this.hasClass("unfold-all")) {
                unfoldAll()
                $this.removeClass("unfold-all font-unfold")
                    .addClass("fold-all font-fold")
                    .html("&nbsp;&nbsp;全部折叠")
                return
            }
            // 折叠
            foldAll()
            $this.removeClass("fold-all font-fold")
                .addClass("unfold-all font-unfold")
                .html("&nbsp;&nbsp;全部展开")
        })
    })

    function unfoldAll() {
        $(".iteration_gird #div_tabs #member_content .member_area .font-unfold").trigger("click")
        
        // .each(function(idx, elem) {
        //     console.log(elem)
        //     const code = $(elem).attr("onclick").replace(")", ").bind(elem)()")
        //     eval(code)
        // })
    }

    function foldAll() {
        $(".iteration_gird #div_tabs #member_content .member_area .font-fold").trigger("click")
    }
})(window.jQuery);

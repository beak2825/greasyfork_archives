// ==UserScript==
// @name         Tencent iwiki Tweaker
// @namespace    iwiki
// @version      0.0.3
// @description  腾讯iwiki优化器
// @author       yaxinliu
// @match        http*://iwiki.woa.com/*
// @icon         https://iwiki.woa.com/tencent/static/portal/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      Private
// @downloadURL https://update.greasyfork.org/scripts/404927/Tencent%20iwiki%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/404927/Tencent%20iwiki%20Tweaker.meta.js
// ==/UserScript==

(function($) {

    $(document).on("click", ".plugin_pagetree_children_content", function(e) {
        const $this = $(e.target)
        const $content = $this.parents(".plugin_pagetree_children_content")
        const $toggleChildrenWrapper = $content.siblings(".plugin_pagetree_childtoggle_container")

        if ($this.hasClass("fn-the-link")) {
            return
        }

        if ($toggleChildrenWrapper.find("span.no-children").length === 0) {
            // 有子节点
            e.preventDefault()
            $toggleChildrenWrapper.find("a.plugin_pagetree_childtoggle").trigger("click")

            return
        }
    }).on("dblclick", ".plugin_pagetree_children_content", function (e) {
        const link = e.target.getAttribute("href")
        if (link !== null) {
            window.location.href = link
        }
    });

    $(document).on("DOMSubtreeModified", ".plugin_pagetree .plugin_pagetree_children_container", function(e) {
        if (!e.target.classList.contains("plugin_pagetree_children_container")) {
            return
        }
        $(e.target).find(".plugin_pagetree_children_content").each(function(idx, elem) {
            const $dom = $(elem)
            const hasOpenLink = $dom.find(".fn-open-link").length !== 0
            if (hasOpenLink) {
                return
            }

            const hasChildren = $dom.siblings(".plugin_pagetree_childtoggle_container").find("a.plugin_pagetree_childtoggle").length !== 0

            if (hasChildren) {
                // 有子节点，补充一下打开标识
                const $itemWrapper = $dom.find(".plugin_pagetree_children_span")
                const $link = $itemWrapper.find("a")
                const theLink = $link.attr("href")

                const $openLink = $(`<span class="fn-open-link">&nbsp;<a class="fn-the-link" href="${theLink}" style="background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfkBRoLIxgX1ctpAAAAT0lEQVQoz2NgGHjAiC6g9B9C34PKMKEruMfIIIDMZ0HVeY9RiZ/hA4MAwwcMBRBDIdL3PirBRdGt+MAgcO8jwgVYHIcOmBgIKGUhbMbAAwCk2RI22v2ErQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0yNlQxMTozMjozOCswMDowMNVV1SAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMjZUMTE6MzI6MzgrMDA6MDCkCG2cAAAAAElFTkSuQmCC');width: 16px;height: 16px;"></a></span>`)
                $itemWrapper.append($openLink)
            }
        })

    })
})(window.jQuery);

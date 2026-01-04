// ==UserScript==
// @name         CodeChef Tag Hiding
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  hide tags in CodeChef
// @author       luma
// @match        https://www.codechef.com/problems/*
// @match        https://www.codechef.com/*/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378574/CodeChef%20Tag%20Hiding.user.js
// @updateURL https://update.greasyfork.org/scripts/378574/CodeChef%20Tag%20Hiding.meta.js
// ==/UserScript==

(function() {
    'use strict'
    const $button = $("<span>")
    $button.addClass("button")
    $button.addClass("blue")
    $button.css("padding-left", "10px")
    $button.css("padding-right", "10px")

    let $tags
    let initiated = false
    let tagHidden = false

    const target = document.body;
    const observer = new MutationObserver((mutations) => {
        if(init()) {
            observer.disconnect()
        }
    });
    const config = { attributes: false, childList: true, characterData: false, subtree: true }
    observer.observe(target, config)

    init()

    $button.on("click", () => {
        if(tagHidden) showTags();
        else hideTags();
    })

    function init() {
        if(initiated) return

        $tags = $("aside.problem-info").find("label").filter((i, e) => $(e).text().match(/Tags/)).parent().children("span")
        const ready = $tags.length === 1

        if(!ready) return false

        $tags.before($button)


        let tagHidden = false
        hideTags();
        return initiated = true
    }

    function hideTags() {
        tagHidden = true
        $tags.hide()
        $button.text("show")
    }
    function showTags() {
        tagHidden = false
        $tags.show()
        $button.text("hide")
    }
})();
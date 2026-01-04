// ==UserScript==
// @name         Hardcore FL
// @namespace    http://fallenlondon.com/
// @version      2024-12-22b
// @description  Hides requirements.
// @author       Hannah~
// @license      MIT
// @match        https://www.fallenlondon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fallenlondon.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/521514/Hardcore%20FL.user.js
// @updateURL https://update.greasyfork.org/scripts/521514/Hardcore%20FL.meta.js
// ==/UserScript==

/* global $ */ // Tells ESLint that $ is a real function

(function() {
    // Toggle stuff
    // Original Hardcore: reqS, reqC, diff, and equip set to true
    // Surprise Cards: reqC, descC, lockC, and blackC set to true
    let options = {
        // Remove quality requirements from storylets
        reqS: true,

        // Remove quality requirements from cards
        reqC: true,

        // Remove title and description from cards
        descC: true,

        // Prevent you from pressing "Perhaps Not" on cards (reccomend combining with previous one)
        lockC: true,

        // Replace all card images with black when in deck (reccomend combining with previous two)
        blackC: true,

        // Remove the ability to discard cards
        disc: true,

        // Remove quality updates when you do actions and replace them with vague result
        upd: true,

        // Remove challenge difficulties and replace them with only the name of the stat used
        diff: true,

        // Remove qualities from "Myself"
        qual: true,

        // Remove stats from equipment
        equip: true,

        // Remove sidebar information, only leave a visual candle and outfit switcher
        side: true,
    }
    new MutationObserver(function (mutations) {
        // remove quality requirements from storylets
        if (options.reqS) {$(".quality-requirement").remove()}
        // and cards
        if (options.reqC) {$(".tooltip__secondary-description").remove()}

        if (options.descC && $(".deck").length) {
            $(".tooltip__desc > span").remove()
            $(".tooltip__desc > p").remove()
            $(".tooltip__desc__noImage > span").remove()
            $(".tooltip__desc__noImage > p").remove()
            $(".hand .small-card__title-and-buttonlet").remove()
            $(".hand .small-card__teaser").remove()
        }

        // remove "Perhaps Not" from cards
        if (options.lockC && $(".buttonlet-frequency").length) {
            $(".buttons--storylet-exit-options").remove()
        }

        if (options.blackC) {
            $(".hand__card img").attr("src", "//images.fallenlondon.com/icons/black.png")
        }

        if (options.disc) {$(".card__discard-button").remove()}

        // remove quality updates
        if (options.upd) {
            $(".quality-update:not(#HARDCOREFL_MYSTERYUPDATE)").remove()
            // and replace them with an extremely vague "something happened"
            if ($(".branch.media--quality-updates").length && !$(".branch.media--quality-updates").find("#HARDCOREFL_MYSTERYUPDATE").length) {
                console.log("here goes nothing "+$(".branch.media--quality-updates").length+!$(".branch.media--quality-updates").find("#HARDCOREFL_MYSTERYUPDATE").length);
                $(".branch.media--quality-updates").append(`
                    <div class="quality-update" id="HARDCOREFL_MYSTERYUPDATE">
                        <div class="quality-update__left">
                            <div class="icon">
                                <div aria-label="" tabindex="0" role="button" style="outline: 0px; outline-offset: 0px; cursor: default;">
                                    <img class="cursor-default media__object" height="40" src="//images.fallenlondon.com/icons/questionsmall.png" width="40">
                                </div>
                            </div>
                        </div>
                        <div class="quality-update__body">
                            <div>Something happened. Unless it didn't.</div>
                        </div>
                    </div>
               `);
            }
        }

        // Remove challenge difficulties
        if (options.diff) {
            $(".challenge:not(.HARDCORE_IGNORE)").each(function() {
                $(this).addClass("HARDCORE_IGNORE")
                let $img = $(this).children().first().children().first().children().first()
                let $cText = $(this).children().last()
                let $cInfo = $cText.children().first().contents()
                $cInfo.last()[0].data = ` ${$img.prop("alt")} challenge`
                $cInfo.eq(1).remove()
                $cText.children().eq(1).remove()
            })
        }

        // remove qualities from "Myself" page
        if (options.qual) {$(".quality-group").remove()}

        // remove stats from equipment
        if (options.equip) {$(".enhancements-description").remove()}

        // remove sidebar qualities
        if (options.side) {$(".items.items--list").remove()}

    }).observe(document, {childList: true, subtree: true});
    console.log("[Hardcore FL] Mutation Observer Set up")
})();
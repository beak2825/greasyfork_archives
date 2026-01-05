// ==UserScript==
// @name         Google map keyboard accelerator
// @namespace   https://greasyfork.org/users/5795-ikeyan
// @version      0.1
// @description  Add keyboard shortcuts to Google map. 
// @author       ikeyan
// @match        https://www.google.co.jp/maps
// @match        https://www.google.co.jp/maps?*
// @match        https://www.google.co.jp/maps/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/26059/Google%20map%20keyboard%20accelerator.user.js
// @updateURL https://update.greasyfork.org/scripts/26059/Google%20map%20keyboard%20accelerator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function $(selector) {
        return document.querySelector(selector);
    }
    function $$(selector) {
        return [].slice.call(document.querySelectorAll(selector));
    }
    function getModifiedKey(e) {
        var key = "";
        if (e.ctrlKey)
            key += "C-";
        key += e.key;
        return key;
    }
    function getOffset(el) {
        var x = 0, y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: y, left: x };
    }
    function getOuterSize(el) {
        var style = window.getComputedStyle(el);
        var height = el.offsetHeight + [style.marginTop, style.marginBottom, style.borderTopWidth, style.borderBottomWidth, style.paddingTop, style.paddingBottom].map(parseFloat).reduce(function(x,y){return x+y;});
        var width = el.offsetWidth + [style.marginLeft, style.marginRight, style.borderLeftWidth, style.borderRightWidth, style.paddingLeft, style.paddingRight].map(parseFloat).reduce(function(x,y){return x+y;});
        return {width: width, height: height};
    }
    function isPaneCollapsed() {
        var appContainer = $('#app-container:not(.pane-collapsed-mode)');
        return !appContainer;
    }
    var ReviewSubheaderTextContentSet = {
        "Review summary": true, //English (United States)
        "리뷰 요약": true, //한국어
        "クチコミの概要": true, //日本語
        "评价摘要": true, //简体中文
    };
    function isReviewSubheader(h2) {
        return ReviewSubheaderTextContentSet.hasOwnProperty(h2.textContent);
    }
    window.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keypress", handleKeyPress, false);
    function handleKeyDown(e) {
        var key = getModifiedKey(e);
        if (key === "," || key === "<") {
            if (isPaneCollapsed()) {
                setTimeout(function() {
                    $('.widget-pane-content-holder>div').focus();
                }, 30);
            } else {
                $('canvas').focus();
                setTimeout(function() {
                    $('canvas').focus();
                }, 30);
            }
        }
    }
    function handleKeyPress(e) {
        var key = getModifiedKey(e);
        if (key === "C-s" || key === "C-S") {//保存, save
            var saveButton = $('.section-entity-action-save-button');
            if (saveButton) {
                e.preventDefault();
                saveButton.click();
            }
        }
        if (key === "C-n" || key === "C-N") {// 付近を検索, nearby
            if (!isPaneCollapsed()) {
                var searchNearbySprite = $('.maps-sprite-pane-action-ic-searchnearby');
                if (searchNearbySprite) {
                    e.preventDefault();
                    searchNearbySprite.closest('button').click();
                }
            }
        }
        if (key === "C-R" || key === "C-r") {// 口コミ, reviews
            var reviewSectionHeader = $$('h2.section-subheader-large-text').filter(isReviewSubheader)[0];
            var omni = $('#omnibox');
            if (reviewSectionHeader) {
                var pos = getOffset(reviewSectionHeader);
                var basePos = getOffset(reviewSectionHeader.closest('.scrollable-y'));
                reviewSectionHeader.closest('.scrollable-y').scrollTop = pos.top - basePos.top - getOuterSize(omni).height;
            }
        }
        if (key === "C-T" || key === "C-t") {
            var sectionHeroHeaderDirections = $('.section-hero-header-directions');
            if (sectionHeroHeaderDirections) {
                sectionHeroHeaderDirections.click();
            } else {
                var closeDirections = $('.close-directions');
                if (closeDirections) {
                    closeDirections.click();
                }
            }
        }
        if (key === "C-m") { //地図にフォーカス
            $('canvas').focus();
            e.preventDefault();
        }
        if (key === "C-l" || key === "C-L") { //ラベルを追加/編集, label
            if (!isPaneCollapsed()) {
            var button = $('button[jsaction="pane.info.editAliasNickname"]');
                if (button) {
                    e.preventDefault();
                    button.click();
                }
            }
        }
        if (key === "C-w" || key === "C-W") { //ウェブサイトに行く, go to website
            if (!isPaneCollapsed()) {
                var link = $('.maps-sprite-pane-info-website~* a[href]');
                if (link) {
                    link.click();
                }
            }
        }
        if (key === "/") {
            if (!isPaneCollapsed()) {
                var searchBox = $('#searchboxinput');
                if (searchBox && document.activeElement !== searchBox) {
                    e.preventDefault();
                    searchBox.focus();
                }
            }
        }
    }
})();
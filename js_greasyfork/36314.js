// ==UserScript==
// @name        E-Hentai & ExHentai Fade or hide viewed galleries
// @namespace   https://greasyfork.org/users/25356
// @description Fade or hide viewed galleries on e-hentai and exhentai. Now working with GM4
// @version     7.9

// @match     https://exhentai.org/*
// @match     https://e-hentai.org/*

// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require	https://code.jquery.com/jquery-git.min.js


// @grant		GM.getValue
// @grant		GM.setValue
// @grant		GM_getValue
// @grant		GM_setValue
// @grant       GM_addValueChangeListener
// @author      CoLdAsIcE
// @downloadURL https://update.greasyfork.org/scripts/36314/E-Hentai%20%20ExHentai%20Fade%20or%20hide%20viewed%20galleries.user.js
// @updateURL https://update.greasyfork.org/scripts/36314/E-Hentai%20%20ExHentai%20Fade%20or%20hide%20viewed%20galleries.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    let $hideGal = await GM.getValue("EHXFade_hidevisited", false);

    async function isGalVisited(gid) {
        let $md = await GM.getValue("g_" + gid, 0);
        if ($md == 1) {
            return true;
        }

        return false;
    }

    async function visitGal(gid) {
        GM.setValue("g_" + gid, 0)
        if (!await isGalVisited(gid)) {
            GM.setValue("g_" + gid, 1);

        }
    }

    function saveViewedGal() {
        if (document.URL.match(/^https?:\/\/(e-|e[^-])hentai\.org\/g\/.*$/)) { //gallery case
            //record visited galleries to local DB
            const $gal_idx = document.URL.match(/^https?:\/\/(?:e-|e[^-])hentai\.org\/g\/(\d*)\/.*$/);
            console.log("should match 2 items:", $gal_idx, "Should match gal nr:", $gal_idx[1])

            if (!isNaN($gal_idx[1])) {
                const gal_id = parseInt($gal_idx[1])

                visitGal(gal_id);
            }
        }
    }

    async function fadeThumb($tag, tr = false) {
        let $p
        const $alpha = parseFloat(0.2);

        if (tr) {
            $p = $tag.closest('tr');
        } else {
            $p = $tag.closest('.gl1t');
        }

        if (isNaN($alpha))
            $alpha = '0.2';

        $p.css('opacity', $alpha);

        $p.hover(
            function () {
                $(this).stop().fadeTo('fast', 1);
            },
            function () {
                $(this).stop().fadeTo('fast', $alpha);
            }
        );
    }


    //fades thumbnails that is divs
    async function fadeViewedGalThumb() {
        console.log("should contain many elements:", $('.itg.gld > div.gl1t'), "GalThumb")
        $('.itg.gld > div.gl1t').each(async function () {
            if (document.URL.match(/^https?:\/\/(e-|e[^-])hentai\.org\/(?!s).*$/) && self == top) { //search / index case, exclude iframe
                const $tagContainer = $(this);
                const $gallery = $(this).closest('.gl1t');
                const $gal_href = $tagContainer.closest('.gl1t').find('div.gl3t a').first().attr('href');
                const $gal_idx = $gal_href.match(/^https?:\/\/(?:e-|e[^-])hentai\.org\/g\/(\d*)\/.*$/);

                if (!isNaN($gal_idx[1])) {
                    const gal_id = parseInt($gal_idx[1], 10);

                    if (await isGalVisited(gal_id)) {
                        if (!$hideGal) {
                            fadeThumb($tagContainer);
                            $gallery.show();
                        } else {
                            $gallery.hide();
                        }
                    }
                }
            }
        });
    }

    //fades anything with table
    async function fadeViewedGalTable(compact = null) {
        console.log("should contain many elements:", $('table.itg > tbody > tr'), "GalTable")

        const className = compact ? 'gl1c' : 'gl1m'
        const title = compact ? '.gl3c' : '.gl3m'

        $('table.itg > tbody > tr').each(async function () {
            const isAGallery = this.firstElementChild.classList[0] === className

            if (document.URL.match(/^https?:\/\/(e-|e[^-])hentai\.org\/(?!s).*$/) && self == top && isAGallery) { //search / index case, exclude iframe
                const $tagContainer = $(this);
                const $gallery = $(this).closest('tr');
                const $gal_href = $tagContainer.closest('tr').find(title + ' a').first().attr('href');
                const $gal_idx = $gal_href.match(/^https?:\/\/(?:e-|e[^-])hentai\.org\/g\/(\d*)\/.*$/);

                if (!isNaN($gal_idx[1])) {
                    const gal_id = parseInt($gal_idx[1], 10);

                    if (await isGalVisited(gal_id)) {
                        if (!$hideGal) {
                            fadeThumb($tagContainer, true);
                            $gallery.show();
                        } else {
                            $gallery.hide();
                        }
                    }
                }

            }
        });
    }

    //fades extended
    async function fadeViewedGalExt() {
        console.log("should contain many elements:", $('table.itg > tbody > tr'), "fadeGalExt")

        $('table.itg > tbody > tr').each(async function () {
            if (document.URL.match(/^https?:\/\/(e-|e[^-])hentai\.org\/(?!s).*$/) && self == top) { //search / index case, exclude iframe
                const $tagContainer = $(this);
                const $gallery = $(this).closest('tr');
                const $gal_href = $tagContainer.closest('tr').find('.gl2e a').last().attr('href');
                const $gal_idx = $gal_href.match(/^https?:\/\/(?:e-|e[^-])hentai\.org\/g\/(\d*)\/.*$/);

                if (!isNaN($gal_idx[1])) {
                    const gal_id = parseInt($gal_idx[1], 10);

                    if (await isGalVisited(gal_id)) {
                        if (!$hideGal) {
                            fadeThumb($tagContainer, true);
                            $gallery.show();
                        } else {
                            $gallery.hide();
                        }
                    }
                }
            }
        });
    }

    async function css() {
        $('<style type="text/css">'
          + 'a:visited > div, a:visited > div > div {font-weight:normal; color:#4b90eb !important; }' +
          '</style>').appendTo("head");

        if (document.URL.match(/^https?:\/\/(e-)hentai\.org/)) {
            $('<style type="text/css">' +
              'div.hideGal {position:absolute; width:65px; height:auto; color:#5C0D11; border: 1px solid #5C0D11; z-index: 10; cursor:pointer; }' +
              'div.hideGal div.tab { margin:6px; text-align: center;}' +
              '</style>').appendTo("head");
        } else {
            $('<style type="text/css">' +
              'div.hideGal {position:absolute; width:65px; height:auto; color:skyblue; border: 1px solid #000000; z-index: 10; cursor:pointer; }' +
              'div.hideGal div.tab { margin:6px; text-align: center;}' +
              '</style>').appendTo("head");
        }
    }

    async function hideVisitedGal() {
        //add a hide gallery tab
        const ele = document.getElementsByClassName("ido")
        const width = ele.length > 0 && document.getElementsByClassName("ido")[0].clientWidth

        //show only button once
        $('div.ido .hideGal').length === 0 && $('div.ido').prepend(`<div class="hideGal"><div class="tab" id="toggleseen">${$hideGal ? "Show": "Hide"} viewed galleries</div></div>`)

        //hide or show gallery
        $('#toggleseen').parent().click(function (e) {
            $hideGal = !$hideGal;

            GM.setValue("EHXFade_hidevisited", $hideGal);

            if ($hideGal) {
                $("#toggleseen").text("Show viewed galleries");
            } else {
                $("#toggleseen").text("Hide viewed galleries");
            }

            applyChanges();

        });
    }

    async function applyChanges() {
        //make sure FadeGalleries are not run everytime we open a gallery
        const openedGal = document.URL.match(/^https?:\/\/(?:e-|e[^-])hentai\.org\/g\/(\d*)\/.*$/) || false

        if (!openedGal) {
            FadeGalleries();
        }
    }

    async function FadeGalleries() {
        //fade based on what viewing style is used
        console.log("should be a html element", document.querySelector("#toggleseen"), "FadeGalleries");
        const $select = $('#ujumpbox ~ div ~ div ~ div select');
        const $selectValue = $select.val()
        console.log("should be either p, m, l, e or t:", $selectValue);
        switch ($selectValue) {
            case 'p':
            case 'm':
                fadeViewedGalTable();
                break;
            case 'l':
                fadeViewedGalTable(true);
                break;
            case 'e':
                fadeViewedGalExt();
                break;
            case 't':
                fadeViewedGalThumb();
                break;
        }
    }

    css();
    hideVisitedGal();
    saveViewedGal();
    applyChanges();
})();
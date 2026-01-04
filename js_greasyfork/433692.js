// ==UserScript==
// @name         Itch.io Simple Remove from Collection
// @namespace    https://github.com/refatK
// @version      1.0.1
// @homepageURL  https://github.com/refatK/Itch.io-Simple-Remove-from-Collection
// @description  Easily remove games from your itch.io collections from within the "Add to Collection" modal of a game.
// @author       RefatK
// @license      MIT
// @match        *://itch.io/*
// @match        *://*.itch.io/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @connect      itch.io
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433692/Itchio%20Simple%20Remove%20from%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/433692/Itchio%20Simple%20Remove%20from%20Collection.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global $, Itch */
$(document).ready(function () {
    const GAME_URL_REGEX = "/https:\/\/.+\.itch\.io/g"
    const bodyObserver = new MutationObserver(OnBodyChange);
    const lightboxObserver = new MutationObserver(OnLightboxChange)

    var _gameId
    var _csrf

    // --- ON LOAD ---
    _csrf = GetCsrf()

    let pageUrl = window.location.href

    if (IsAddToCollectionPage(pageUrl)) {
        if (!IsGameInAnyCollection()) { return }

        let gameCreator = GetUserFromGamePage(pageUrl)
        let gameName = GetGameNameFromGamePage(pageUrl)
        GetGameIdFromItchApi(gameCreator, gameName).then(AddAndEnableRemoveButtons())
    } else {
        // wait for add-to-collection lightbox to load on any other page
        bodyObserver.observe($("body")[0], { childList: true })
    }


    // --- EVENTS ---

    // On click "Add To Collection" button for a game
    $('div, #user_tools').on('click', 'a.add_to_collection_btn', function () {
        _gameId = GetGameIdFromGameCell(this)
    });

    function OnBodyChange() {
        // observe lightbox div once loaded on the page
        if ($("div#lightbox_container").length > 0) {
            lightboxObserver.observe($("div#lightbox_container")[0], { childList: true })
            // lightbox container stays loaded now, so we can stop observing for it to load
            bodyObserver.disconnect()
        }
    }

    // On the lightbox being loaded on the page
    function OnLightboxChange() {
        if (!IsGameInAnyCollection()) { return }
        AddAndEnableRemoveButtons()
    }


    // --- HELPER FUNCTIONS ---

    function GetCsrf() {
        return $("meta[name=csrf_token]").attr("value")
    }

    function IsGameInAnyCollection() {
        return $("ul.already_in").length > 0
    }

    function GetGameIdFromGameCell(addToCollectionBtn) {
        let pageUrl = window.location.href
        let gameId = ""
        let gameCell = addToCollectionBtn.closest('div.game_cell')

        if (gameCell) {
            gameId = $(gameCell).attr("data-game_id")
        } else {
            gameId = $("meta[name='itch:path']").attr("content").replace("games/", "")
        }

        return gameId
    }

    async function GetGameIdFromItchApi(gameCreator, gameName) {
        await $.getScript( "https://static.itch.io/api.js" ) // Used to get game id
        return new Promise(function (resolve, reject) {
            Itch.getGameData({
                user: gameCreator,
                game: gameName,
                onComplete: function (data) {
                    if ('errors' in data) {
                        console.error(`ERROR: Could not find game "${this.user}" by ${this.game}.`)
                        console.error(data)
                        reject()
                    }

                    _gameId = data.id
                    resolve(_gameId)
                }
            })
        })
    }

    function AddRemoveButtonUi(collectionLinkEl) {
        let collectionId = collectionLinkEl.find("a").prop("href").split("/")[4]
        const removeHTML = $(`<a class="remove_from_coll_btn button outline" title="Remove the game from the collection." value="${collectionId}">❌</a>`)
        removeHTML.css({
            "margin-right": "5px",
            "display": "inline",
            "padding": "4px"
        });
        collectionLinkEl.prepend(removeHTML)
    }

    function PostRemoveGameFromCollection(collectionId, gameId, csrf_token, elToHideOnSuccess) {
        GM.xmlHttpRequest({
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            url: `https://itch.io/collection/${collectionId}/remove/${gameId}`,
            data: `csrf_token=${csrf_token}`,
            onload: function (res) {
                let resJson = JSON.parse(res.responseText)
                if (resJson.removed) {
                    elToHideOnSuccess.remove()
                } else {
                    console.error(res.responseText)
                }
            },
        });
    }

    function AddAndEnableRemoveButtons() {
        $('li.already_in_row').each(function (i) {
            AddRemoveButtonUi($('li.already_in_row').eq(i))
        })
        // Add click event for the newly added remove buttons
        $('.remove_from_coll_btn').click(function (e) {
            let collId = $(this).attr("value")
            PostRemoveGameFromCollection(collId, _gameId, _csrf, $(this).closest('li.already_in_row'))
        })
    }

    function IsAddToCollectionPage(url) {
        return url.includes("add-to-collection")
    }

    function GetUserFromGamePage(url) {
        if (url.includes("?source=game")) {
            return url.split("/")[2].split(".")[0]
        } else {
            return url.split("/")[4]
        }
    }

    function GetGameNameFromGamePage(url) {
        if (url.includes("?source=game")) {
            return url.split("/")[3]
        } else {
            return url.split("/")[5]
        }
    }
});

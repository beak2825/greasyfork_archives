// ==UserScript==
// @name              GGn New Nintendy
// @namespace         https://greasyfork.org
// @license           MIT
// @version           1.4
// @description       GGn New Nintendy uploader for GGn
// @author            Sapphire_e, Blegshkreen, limeman, lucianjp, drlivog
// @match             https://gazellegames.net/upload.php*
// @match             https://gazellegames.net/torrents.php?action=editgroup*
// @match             https://www.nintendo.com/us/store/products/*
// @grant             GM.xmlHttpRequest
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_addValueChangeListener
// @grant             GM_removeValueChangeListener
// @grant             window.close
// @connect           store-jp.nintendo.com
// @connect           search.nintendo-europe.com
// @connect           nintendo.com
// @connect           algolia.net
// @downloadURL https://update.greasyfork.org/scripts/484207/GGn%20New%20Nintendy.user.js
// @updateURL https://update.greasyfork.org/scripts/484207/GGn%20New%20Nintendy.meta.js
// ==/UserScript==
/* eslint-env jquery */
/* jshint esversion: 11 */

const showImageThumb = true; //Show Image Thumbnails for cover and screenshots, click on image to open in new tab/window
const debugMode = false;

//Nintendo regional website domains
const NINTENDO_EU_SEARCH_URL = "https://search.nintendo-europe.com/en/select?q="; //ends with q=, query goes at end
const NINTENDO_UK_GAME_URL_PREFIX = "https://www.nintendo.com/en-gb";
const NINTENDO_JP_SEARCH_URL = "https://store-jp.nintendo.com/on/demandware.store/Sites-MNS-Site/ja_JP/SearchServices-GetSuggestions?q="; //ends with q=, query goes at end
const NINTENDO_JP_STORE_URL_PREFIX = "https://store-jp.nintendo.com";
const NINTENDO_JP_URL = "";
const NINTENDO_US_INCLUDE = "nintendo.com/us/";
const NINTENDO_US_GAME_URL_PREFIX = "https://www.nintendo.com";

//Nintendo US keys and url from: https://github.com/favna/nintendo-switch-eshop
const US_ALGOLIA_ID = 'U3B6GR4UA3';
const US_ALGOLIA_KEY = 'c4da8be7fd29f0f5bfa42920b0a99dc7';
const QUERIED_US_ALGOLIA_KEY_NEW = 'a29c6927638bfd8cee23993e51e721c9';
const QUERIED_US_ALGOLIA_KEY_OLD = '6efbfb0f8f80defc44895018caf77504';
const US_GET_GAMES_URL = `https://${US_ALGOLIA_ID}-dsn.algolia.net/1/indexes/*/queries`;
const QUERIED_US_GET_GAMES_URL_NEW = `https://${US_ALGOLIA_ID}-dsn.algolia.net/1/indexes/store_all_products_en_us/query`;
const QUERIED_US_GET_GAMES_URL_OLD = `https://${US_ALGOLIA_ID}-dsn.algolia.net/1/indexes/ncom_game_en_us/query`;
const US_ALGOLIA_HEADERS = {
    'Content-Type': 'application/json',
    'X-Algolia-API-Key': US_ALGOLIA_KEY,
    'X-Algolia-Application-Id': US_ALGOLIA_ID
};

let windowReference;
let valListener;
let blockRedirect=false;

(function() {

    'use strict';
    if (window.location.href.includes("gazellegames.net")) {
        // Add Switch button (this shows up to the left of the Win, Lin and Mac buttons that the GGn Uploady script uses)
        $('<a href="#0" id="fill_switch"> Switch </a>').insertAfter('#steamid').on('click', () => {
            $("#platform").val("Switch").trigger('change');
            return false;
        } );

        $('#platform').on('change', (evt) => {
            const platform = document.querySelector('#platform');
            if (platform.options[platform.selectedIndex].parentElement.label === "Nintendo" && $('#searchNintendoUS').length==0) {
                $(' <button id="searchNintendoJP">Search Nintendo (JP)</button>').insertAfter('#platform').on('click', (evt)=> {
                    if (document.getElementsByClassName("ndyResultsTd")[0]) {
                        $('.ndyResultsTd').remove();
                        //let toAddChild = document.querySelectorAll("#groupinfo tbody tr")[2].querySelectorAll("td")[1];
                        //toAddChild.appendChild(document.createRange().createContextualFragment('<span class="ndyResultsTd"></span>'));
                        $('#groupinfo tbody tr').eq(2).find('td').eq(1).append('<span class="ndyResultsTd"><span class="ndyResultParent"><p>Loading...</p></span</span>');
                    }
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: NINTENDO_JP_SEARCH_URL + $("#title").val() + "\"",
                        responseType: "json",
                        onload: resultsJP
                    });
                    evt.preventDefault();
                    return true;
                });
                $(' <button id="searchNintendoUK">Search Nintendo (UK)</button>').insertAfter('#platform').on('click', (evt)=> {
                    if (document.getElementsByClassName("ndyResultsTd")[0]) {
                        //document.getElementsByClassName("ndyResultsTd")[0].remove();
                        $('.ndyResultsTd').remove();
                        //let toAddChild = document.querySelectorAll("#groupinfo tbody tr")[2].querySelectorAll("td")[1];
                        //toAddChild.appendChild(document.createRange().createContextualFragment('<span class="ndyResultsTd"></span>'));
                        $('#groupinfo tbody tr').eq(2).find('td').eq(1).append('<span class="ndyResultsTd"><span class="ndyResultParent"><p>Loading...</p></span</span>');
                    }
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: NINTENDO_EU_SEARCH_URL + $("#title").val() + "\"",
                        responseType: "json",
                        onload: resultsUK
                    });
                    evt.preventDefault();
                    return false;
                });
                $(' <button id="searchNintendoUS">Search Nintendo (US)</button>').insertAfter('#platform').on('click', (evt)=> {
                    debug("Search Nintendo US");
                    if (document.getElementsByClassName("ndyResultsTd")[0]) {
                        //document.getElementsByClassName("ndyResultsTd")[0].remove();
                        $('.ndyResultsTd').eq(0).remove();
                        //let toAddChild = document.querySelectorAll("#groupinfo tbody tr")[2].querySelectorAll("td")[1];
                        //toAddChild.appendChild(document.createRange().createContextualFragment('<span class="ndyResultsTd"></span>'));
                        $('#groupinfo tbody tr').eq(2).find('td').eq(1).append('<span class="ndyResultsTd"><span class="ndyResultParent"><p>Loading...</p></span</span>');
                    }
                    GM.xmlHttpRequest({
                        method: 'POST',
                        url: QUERIED_US_GET_GAMES_URL_NEW,
                        headers: {
                            ...US_ALGOLIA_HEADERS,
                            'X-Algolia-API-Key': QUERIED_US_ALGOLIA_KEY_NEW
                        },
                        data: JSON.stringify( {
                            'hitsPerPage': 20,
                            'page': 0,
                            'query': $("#title").val()
                        }),
                        responseType: "json",
                        onload: resultsUS
                    });
                    evt.preventDefault();
                    return false;
                });
            }
        });
    } else if (window.location.href.includes(NINTENDO_US_INCLUDE)) {
        let loadDate = GM_getValue('loadNintendoUS');
        if (Date.now() - loadDate < 60000) {
            debug("Checking Nintendo Page");
            window.setTimeout(getNintendoData, 1000);
        }
    }

})();

// Create clickable buttons below the Game title: field with a collection of results from the primary search
function resultsUK(response) {

    const platform = $('#platform').val();
    debug("resultsUK");
    $('.ndyResultsTd').remove();

    $('#groupinfo tbody tr').eq(2).find('td').eq(1).append('<span class="ndyResultsTd"></span>');

    debug(response.response.response.docs);

    response.response.response.docs.forEach(doc => {
        if (doc.type != "GAME") return;
        let found = 0;
        for (let i=0; i<doc.system_names_txt.length; i++) {
            if (doc.system_names_txt[i].includes(platform)) {
                found = i;
                break;
            }
        }
        doc.title = doc.title.replaceAll("™",""); //remove TM and Quotes from title
        $('.ndyResultsTd').eq(0).append(`<span class="ndyResultParent"><br><a href="#0" class="ndyResult" urlQuery="${doc.title.replaceAll("\"","")}">- ${doc.title} [${doc.system_names_txt?.at(found)}]</a></span>`);
        $(`a[urlQuery="${doc.title.replaceAll("\"","")}"]`).on("click", (evt) => {
            debug(evt.target.getAttribute('urlQuery') + " clicked");
            blockRedirect=false;
            $('.urlStatus').remove();
            $(evt.target).parent().append('<span class="urlStatus"><p> Loading...</p>');
            fill_upload_form_UK(doc);
            evt.preventDefault();
            return false;
        });
    });
}

function resultsUS(response) {

    debug("resultsUS");
    debug(response?.response?.hits);

    $('.ndyResultsTd').remove();
    $('#groupinfo tbody tr').eq(2).find('td').eq(1).append('<span class="ndyResultsTd"></span>');

    response.response.hits.forEach(doc => {
        if (doc.topLevelCategory != "Games") return;
        doc.title = doc.title.replace("™","").replace("®","");
        $('.ndyResultsTd').eq(0).append(`<span class="ndyResultParent"><br><a href="#0" class="ndyResult USResult" urlQuery="${doc.title.replaceAll("\"","")}">- ${doc.title} [${doc.platform}]</a></span>`);
        $(`a[urlQuery="${doc.title.replaceAll("\"","")}"]`).on("click", (evt) => {
            debug(evt.target.getAttribute('urlQuery') + " clicked");
            blockRedirect=false;
            $('.urlStatus').remove();
            $(evt.target).parent().append('<span class="urlStatus"> Loading...</span>');
            GM.xmlHttpRequest({
                method: "POST",
                url: QUERIED_US_GET_GAMES_URL_OLD,
                headers: {
                    ...US_ALGOLIA_HEADERS,
                    'X-Algolia-API-Key': QUERIED_US_ALGOLIA_KEY_OLD
                },
                data: JSON.stringify({
                    'hitsPerPage': 20,
                    'page': 0,
                    'query': evt.target.getAttribute('urlQuery')
                }),
                responseType: "json",
                context: doc,
                onload: fill_upload_form_US
            });
            evt.preventDefault();
            return false;
        });
    });
}

// Create clickable buttons below the Game title: field with a collection of results from the primary search
function resultsJP(response) {

    debug("resultsJP");
    debug(response.response.suggestions.product.products);
    $('.ndyResultsTd').eq(0).remove();
    $('#groupinfo tbody tr').eq(2).find('td').eq(1).append('<span class="ndyResultsTd"></span>');

    response.response.suggestions.product.products.forEach(doc => {
        if (!doc.url.includes("software")) return;
        $('.ndyResultsTd').eq(0).append(`<span class="ndyResultParent"></br><a href="#0" class="ndyResult JPResult" urlQuery="${doc.name.replaceAll("\"","")}">- ${doc.name}</a></span>`);
        $(`a[urlQuery="${doc.name.replaceAll("\"","")}"]`).on("click", function (evt) {
            debug(evt.target.getAttribute('urlQuery') + " clicked");
            blockRedirect=false;
            $('.urlStatus').remove();
            $(evt.target).parent().append('<span class="urlStatus">Loading...</span>');
            GM.xmlHttpRequest({
                method: "GET",
                url: NINTENDO_JP_STORE_URL_PREFIX + doc.url,
                context: doc,
                onload: fill_upload_form_JP
            });
            $("#title").val(doc.name);
            $('#gameswebsiteuri').val(NINTENDO_JP_STORE_URL_PREFIX + doc.url);
            evt.preventDefault();
            return false;
        });
    });
}

// Fills in the upload form, *after* the game name is clicked on
function fill_upload_form_UK(game) {
    //var game = gameresult.response.response.docs[0]
    if (blockRedirect) {
        debug('Redirect blocked UK');
        return;
    }
    if (game) {
        debug(game)
        let rating;
        switch (game.age_rating_sorting_i + "+") {
            case ("3+"): rating = "1";
                break;
            case ("7+"): rating = "3";
                break;
            case ("12+"): rating = "5";
                break;
            case ("16+"): rating = "7";
                break;
            case ("18+"): rating = "9";
                break;
            default: rating = "13";
                break;
        }

        $("#gameswebsiteuri").val(NINTENDO_UK_GAME_URL_PREFIX + game.url);

        // Release year (requires some parsing to delete month and day)
        $("#year").val(game?.pretty_date_s.split("/")[game.pretty_date_s.split("/").length - 1]);

        // Age rating
        $("#Rating").val(rating);

        // Game title as it appears in the search (overwrites field used to generate search)
        $("#title").val(game?.title?.replace("™",""));

        if (showImageThumb && $("#image").parent().find('img.coverthumb').length == 0) {
            $("#image").parent().prepend('<img class="coverthumb" height=25 title="Click to open full size image" style="display: inline-block; margin-bottom: -8px;">');
            $("#image").parent().children('img.coverthumb').eq(0).on('click', (evt) => { window.open(evt.target.src, "popup_image", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600"); return false; });
            $("#image").on('change', () => { $("#image").parent().find('img.coverthumb').prop('src', $('#image').val()); });
        }

        // Cover image (this could be replaced with a higher res image in the future ...)
        $("#image").val(game?.image_url_sq_s || game?.image_url_h2x1_s);
        if (showImageThumb) {
            $("#image").parent().find('img.coverthumb').prop('src', $('#image').val());
        }

        // Tags - TODO - this will likely require some editing - it's not clear that all the game tags from Nintendo will match
        // the deired names that we use on site at GGn
        var genres = [];
        game?.pretty_game_categories_txt.forEach(gameTag => {
            // Special cases for gametags that do not match with our naming conventions
            switch(gameTag)
            {
                case "First-Person":
                    gameTag = "first.person.shooter";
                    break;
                case "rts":
                    gameTag = "real.time.strategy";
                    break;
                case "Role-Playing":
                    gameTag = "role.playing.game";
                    break;
                case "tbs":
                    gameTag = "turn.based.strategy";
                    break;
                case "sci-fi":
                    gameTag ="science.fiction";
                    break;
            } //end case statment
            gameTag = gameTag.replace(" ",".");
            genres.push(gameTag.toLowerCase());
        });
        $("#tags").val(genres?.join(", "));

        // Pull the game description from NINTENDO_UK_GAME_URL and save it into the game description field (Need to scrape the #Overview page on nintendo.co.uk)
        GM.xmlHttpRequest({
            method: "GET",
            url: NINTENDO_UK_GAME_URL_PREFIX + game.url + "#Overview",
            onload: function (response) {
                const doc = new DOMParser().parseFromString(response.response, 'text/html');
                let gameDescription = html2bb( doc.querySelector("#Overview .game-section-content").innerHTML ).replaceAll(/<.*?>/igm,"");
                debug(gameDescription);

                gameDescription = gameDescription.replace(/[^\n^\.]*?provided by the publisher[\s\S]*/, "");
                gameDescription = gameDescription.replaceAll("[\n{3,}]","\n\n");
                gameDescription = gameDescription?.replace(/[\n]?Subscribe[\s]*to[\n\s]*on[\n\s]*YouTube[\n]?/gm, "");
                gameDescription = gameDescription.replace(/[\n]*link dummy[\n]*/gm, "");
                gameDescription = gameDescription.replace(/[\n]* *This link will be used for the button *[\n]*/gm, "");
                gameDescription = gameDescription.replace(/\[\*\] *\n+/gm, "");
                $("#album_desc").val("[align=center][b][u]About the game[/u][/b][/align]\n\n" + gameDescription.trim() );
                const trailer = doc.querySelector('#banner-main-trailer iframe')?.src?.split('?')[0];
                $("#trailer").val(trailer);
            }
        });

        // ------------ Images ------------ //
        // Images (Need to scrape the info from the #Gallery page on NINTENDO_UK_GAME_URL_PREFIX)
        debug(NINTENDO_UK_GAME_URL_PREFIX + game.url + "#Gallery"); // debugging print statement (can comment if desired)
        GM.xmlHttpRequest({
            method: "GET",
            url: NINTENDO_UK_GAME_URL_PREFIX + game.url + "#Gallery",
            onload: function (response) {

                //parse the response from nintendo.co.uk of the page we wish to scrape
                var doc = new DOMParser().parseFromString(response.response, 'text/html');

                //Grab only images with the css class of img-reponsive and the alt tag of NSwitch
                var imagesFromNin = doc.querySelectorAll('.img-responsive[alt^="NSwitch"]');
                debug(imagesFromNin);

                // Scrape images and store them in the images array
                var images = [];
                for (var node of imagesFromNin) {
                    //check and remove _TM_Standard for image names so you get the fullsized images
                    if (!node.alt.toLowerCase().includes("trailer") && !node.alt.toLowerCase().includes("extras") && !node.alt.toLowerCase().includes("overview") && !node.alt.toLowerCase().includes("expansion")) {
                        let imageURLstring = node.dataset.xs.replace("_TM_Standard", "");
                        imageURLstring = imageURLstring.startsWith("https:") ? imageURLstring : "https:" + imageURLstring;
                        images.push(imageURLstring);
                    }
                }

                // Screenshot fields
                //var add_screen = $("#image_block a[href='#']").first();
                var add_screen = $("a:contains('+')");
                if(images.length>0) $("[name='screens[]']").val("");
                const screens_initial_length = $("[name='screens[]']").length;
                images.forEach(function(screenshot, index) {

                    //The site doesn't accept more than 20 screenshots
                    if (index >= 20) return;

                    //There's 4 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
                    if (index >= screens_initial_length) add_screen.click();

                    // store the screenshot link in the corect screen field.
                    let screen = $("[name='screens[]']").eq(index);
                    $(screen).val(screenshot).change();
                    if (showImageThumb) {
                        if ($(screen).parent().find('img.coverthumb').length == 0) {
                            $(screen).parent().prepend('<img class="coverthumb" height=25 title="Click to open full size image" style="display: inline-block; margin-bottom: -8px;">');
                            $(screen).parent().children('img.coverthumb').eq(0).on('click', (evt) => { window.open(evt.target.src, "popup_image", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600"); return false; });
                            $(screen).on('change', () => { $(screen).parent().find('img.coverthumb').prop('src', $(screen).val()); });
                        }
                        $(screen).parent().find('img.coverthumb').prop('src', $(screen).val());
                    }
                });

            }
        });

        // Fill in release type as ROM (all switch uploads are ROM)
        document.getElementById('miscellaneous').value = 'ROM';
        blockRedirect=true;
        $(`.urlStatus`).text(' Complete');
    }
}

function fill_upload_form_US(gameresponse) {
    debug("fill_upload_form_US");
    if (blockRedirect) {
        debug('Redirect blocked US');
        return;
    }
    const game = gameresponse.context;

    const oldHitWithSameNsuid = gameresponse.response.hits.find((oldHit) => oldHit.nsuid === game.nsuid);

    if (oldHitWithSameNsuid) debug(oldHitWithSameNsuid);

    let doc = new DOMParser();

    let rating;
    switch (game.contentRatingCode) {
        case ("E"): rating = "3";
            break;
        case ("E10"): rating = "5";
            break;
        case ("T"): rating = "7";
            break;
        case ("M"): rating = "9";
            break;
        case ("AO"): rating = "11";
            break;
        default: rating = "13";
            break;
    }

    $("#gameswebsiteuri").val(NINTENDO_US_GAME_URL_PREFIX + game.url);
    //Year, get from releaseDate format(YYYY-MM-DDTHH:MM:SS.###Z)
    $('#year').val(game.releaseDate?.split("-")?.at(0));
    // Age rating
    $("#Rating").val(rating);
    // Game title as it appears in the search (overwrites field used to generate search)
    $("#title").val(game.title);

    if (showImageThumb && $("#image").parent().find('img.coverthumb').length == 0) {
        $("#image").parent().prepend('<img class="coverthumb" height="25" title="Click to open full size image" style="display: inline-block; margin-bottom: -8px;">');
        $("#image").parent().children('img.coverthumb').eq(0).on('click', (evt) => { window.open(evt.target.src, "popup_image", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600"); return false; });
        $("#image").on('change', () => { $("#image").parent().find('img.coverthumb').prop('src', $('#image').val()); });
    }
    // Cover image (this could be replaced with a higher res image in the future ...)
    if (oldHitWithSameNsuid?.boxart && (!oldHitWithSameNsuid?.boxart.endsWith('.jpg') || !oldHitWithSameNsuid?.boxart.endsWith('.jpeg'))) {
        oldHitWithSameNsuid.boxart = oldHitWithSameNsuid.boxart + '.jpg';
    }
    $("#image").val(oldHitWithSameNsuid?.boxart || ("https://assets.nintendo.com/image/upload/f_jpg/" + game.productImage + ".jpg"));
    if (showImageThumb) {
        $("#image").parent().find('img.coverthumb').prop('src', $('#image').val());
    }

    // Tags - TODO - this will likely require some editing - it's not clear that all the game tags from Nintendo will match
    // the deired names that we use on site at GGn
    var genres = [];
    game?.genres?.forEach(gameTag => {
        // Special cases for gametags that do not match with our naming conventions
        switch(gameTag)
        {
            case "First-Person":
                gameTag = "first.person.shooter";
                break;
            case "rts":
                gameTag = "real.time.strategy";
                break;
            case "Role-Playing":
                gameTag = "role.playing.game";
                break;
            case "tbs":
                gameTag = "turn.based.strategy";
                break;
            case "sci-fi":
                gameTag ="science.fiction";
                break;
            case "Other":
                return; //skip "Other" tag
        } //end case statment
        gameTag = gameTag.replace(" ",".");
        genres.push(gameTag.toLowerCase());
    });
    $("#tags").val(genres.join(", "));

    // ------------ Images ------------ //
    // Images (Need to scrape the info from the Game Website)
    debug(NINTENDO_US_GAME_URL_PREFIX + game.url); // debugging print statement (can comment if desired)
    GM_setValue('loadNintendoUS', Date.now());
    valListener = GM_addValueChangeListener('nintendoData', function(key, oldValue, newValue, remote) {
        GM_removeValueChangeListener(valListener);
        let images = [];
        debug(newValue);
        newValue.images.forEach ( node => {
            let imageURLstring = node.replace(/\/f_\w+\//,'/f_jpg/');
            imageURLstring = (imageURLstring.endsWith(".jpg") || imageURLstring.endsWith(".jpeg")) ? imageURLstring : imageURLstring + ".jpg";
            imageURLstring = imageURLstring.startsWith("http") ? imageURLstring : "https:" + imageURLstring;
            images.push(imageURLstring);
        });

        if (newValue.coverart) {
            const ct = new Image();
            ct.src = $("#image").val();
            ct.decode().then(()=>{
                debug(ct.naturalWidth + 'x' + ct.naturalHeight);
                if (ct.naturalWidth >= ct.naturalHeight) { //AR < 1
                    $("#image").val(newValue.coverart).change();
                }
            });
        }

        if (images?.length) {
            debug(images)
        } else {
            debug("no images");
        }

        if(images.length>0) $("[name='screens[]']").val(""); //if we have images then reset all the screenshots values to blank
        const screens_initial_length = $("[name='screens[]']").length;

        // Screenshot fields
        const add_screen = $("a:contains('+')");
        images.forEach(function(screenshot, index) {

            //The site doesn't accept more than 20 screenshots
            if (index >= 20) return;

            //There's 4 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
            if (index >= screens_initial_length) add_screen.click();


            let screen = $("[name='screens[]']").eq(index);

            if (showImageThumb && $(screen).parent().find('img.coverthumb').length == 0) {
                $(screen).parent().prepend('<img class="coverthumb" height=25 title="Click to open full size image" style="display: inline-block; margin-bottom: -8px;">');
                $(screen).parent().children('img.coverthumb').eq(0).on('click', (evt) => { window.open(evt.target.src, "popup_image", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600"); return false; });
                $(screen).on('change', () => { $(screen).parent().find('img.coverthumb').prop('src', $(screen).val()); });
            }
            // store the screenshot link in the corect screen field.
            $(screen).val(screenshot);
            if (showImageThumb) {
                $(screen).parent().find('img.coverthumb').prop('src', $(screen).val());
            }
        });

        let gameDescription = html2bb( newValue.description );

        debug(gameDescription);

        gameDescription = gameDescription.replace(/[^\n^\.]*?provided by the publisher[\s\S]*/, "");
        gameDescription = gameDescription?.replace(/[\n]?Subscribe to on [\n\s]*YouTube[\n]?/g, "");
        gameDescription = gameDescription?.replace(/^Learn more.*?\n/mg, "");
        gameDescription = gameDescription?.replace(/^Browse membership options.*?\n/mg, "");
        gameDescription = gameDescription?.replace(/^\*+.*?\n/mg, "");
        gameDescription = gameDescription?.replace(/[\n]?Watch ?the ?trailer[\n]?/gi, "");
        gameDescription = gameDescription?.replace(/Slide 1 of [\d]+/g, "");
        gameDescription = gameDescription?.replace(/Active gallery item: 1 of [\d]+\./g, "");
        gameDescription = gameDescription?.replace(/(?<=([\n\]])+) *Play video *(?=([\[\n])+)/g, "");
        gameDescription = gameDescription?.replaceAll("Previous gallery item", "");
        gameDescription = gameDescription?.replaceAll("Next gallery item", "");
        gameDescription = gameDescription?.replace(/[\n]* *(\[[^\]]+?\])? *Official Trailer \#\d+ *(\[\/[^\]]+?\])? *[\n]?/g, "");
        gameDescription = gameDescription?.replace(/[\n]?link dummy[\n]?/g, "");
        gameDescription = gameDescription?.replace(/[\n]? *This link will be used for the button *[\n]?/g, "");
        gameDescription = gameDescription?.replace(/[\n]? *Read more *[\n]?/g,"");
        gameDescription = gameDescription?.replace(/[\n]? *Video Player is loading[\s\S]*Next up: *[\n]?/ig, "\n");
        gameDescription = gameDescription?.replace(/([\.\?\!])([A-Z\[\(\"\'])/g, "$1 $2");
        gameDescription = gameDescription?.replace(/\[\*\]Gallery item.*\n/gm,"");
        gameDescription = gameDescription?.replace(/([\n\r]){3,}/g, "$1$1");
        gameDescription = gameDescription.replace(/\[\*\] *\n+/gm, "");
        if (!gameDescription) {
            gameDescription = doc.parseFromString(newValue?.description, 'text/html')?.querySelector('div')?.innerText;
        }
        $("#album_desc").val("[align=center][b][u]About the game[/u][/b][/align]\n\n" + gameDescription.trim() );

        if (!debugMode) windowReference?.close();
        GM_removeValueChangeListener(valListener);
        $('.urlStatus').text(' Complete');
        blockRedirect=true;
        debug('completed');
    });
    windowReference = window.open(NINTENDO_US_GAME_URL_PREFIX + game.url, "popup", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=400");
    document.getElementById('miscellaneous').value = 'ROM';

}

function fill_upload_form_JP(game) {
    if (!game) return;
    if (blockRedirect) {
        debug('Redirect blocked JP');
        return;
    }
    const doc = new DOMParser().parseFromString(game.response, 'text/html');

    debug(doc);

    //TODO: Need translation for japanese tags
    const tagNodes = doc.querySelectorAll('span.productDetail--tag__label');
    let genres=[];
    tagNodes.forEach( node => {
        let gameTag = node.innerText;
        switch(gameTag)
        {
            case "アクション":
                gameTag = "action";
                break;
            case "アドベンチャー":
                gameTag = "adventure";
                break;
            case "Role-Playing":
                gameTag = "role.playing.game";
                break;
            case "tbs":
                gameTag = "turn.based.strategy";
                break;
            case "sci-fi":
                gameTag ="science.fiction";
                break;
            case "Other":
                return; //skip other tag
            default:
                return; //not translated result
        } //end case statment
        gameTag = gameTag.replace(" ",".");
        genres.push(gameTag.toLowerCase());
    });
    $("#tags").val(genres.join(", "));

    let year = doc.querySelector('.productDetail--spec tr:last-child td')?.innerText.substr(0,4);
    $('#year').val(year);

    let rating;
    switch (doc.querySelector('.productDetail--CERO__rating img')?.alt) {
        case ("CERO A"): rating = "3";
            break;
        case ("CERO B"): rating = "5";
            break;
        case ("CERO C"): rating = "7";
            break;
        case ("CERO D"): rating = "9";
            break;
        case ("CERO Z"): rating = "11";
            break;
        default: rating = "13";
            break;
    }
    // Age rating
    $("#Rating").val(rating);

    const images = doc.querySelectorAll('.c-heroCarousel__imageItem img');
    let haveTrailer = false;
    let ssnum = 0;
    const add_screen = $("a:contains('+')");

    if(images.length>0) $("[name='screens[]']").val(""); //if we have images then reset all the screenshots values to blank
    const screens_initial_length = $("[name='screens[]']").length;

    for (let i=0; i<images.length; i++) {
        if (i===0) {
            $("#image").val(images[i].src.slice(0,images[i].src.indexOf("?")));
            continue;
        }
        let imageurl = images[i].src;
        if (!haveTrailer && imageurl.includes("youtube.com")) {
            const match = imageurl.match(/youtube\.com\/\w+\/([^\/]+)\//i);
            if (match?.at(1)) {
                $('#trailer').val("https://www.youtube.com/watch?v="+match[1]);
                haveTrailer = true;
            }
        } else if (imageurl.includes("store-jp.nintendo.com")) {
            //The site doesn't accept more than 20 screenshots
            if (ssnum >= 20) break;
            //There's 4 screenshot boxes by default. If we need to add more, we do as if the user clicked on the "[+]" (for reasons mentioned above)
            if (ssnum >= screens_initial_length) add_screen.click();
            // store the screenshot link in the corect screen field.
            $("[name='screens[]']").eq(ssnum).val(imageurl.slice(0,images[i].src.indexOf("?") || imageurl.length));
            ssnum++;
        }
    }
    let gameDescription = "";
    doc.querySelectorAll('.productDetail--catchphrase__title,.productDetail--catchphrase__longDescription').forEach( x => { gameDescription+= x.outerHTML; });
    gameDescription = html2bb(gameDescription);
    $("#album_desc").val("[align=center][b][u]About the game[/u][/b][/align]\n" + gameDescription.trim() );
    document.getElementById('miscellaneous').value = 'ROM';
    blockRedirect=true;
    $('.urlStatus').text(' Complete');
}

// function pulled from GGn Uploady script - this is needed to parse the html <p> tags, etc., and
// turn them into nice clean BBcode for the game description
function html2bb(str) {
    if (!str) return "";
    str = str.replaceAll(/<style[\s\S]+?\/style>/ig,"");
    str = str.replaceAll(/<script[\s\S]+?\/script>/ig,"");
    str = str.replaceAll(/<iframe[\s\S]+?\/iframe>/ig,"");
    str = str.replace(/<div[^>]*?>[\n]?/ig, "\n");
    str = str.replace(/[\n]?< *\/div *>/ig, "\n");
    str = str.replace(/<span[^>]*?>[\n]?/ig, "");
    str = str.replace(/[\n]?< *\/span *>/ig, "");
    str = str.replace(/<p[^>]*>[\n]?/ig, "\n");
    str = str.replace(/[\n]?<\/p>/ig, "\n");
    str = str.replace(/[\n]?< *br *\/? *>[\n]?/ig, "\n\n"); //*/
    str = str.replace(/< *b *>[\n]?/ig, "[b]");
    str = str.replace(/[\n]?< *\/ *b *>/ig, "[/b]");
    str = str.replace(/< *u *>[\n]?/ig, "[u]");
    str = str.replace(/[\n]?< *\/ *u *>/ig, "[/u]");
    str = str.replace(/< *i *>[\n]?/ig, "[i]");
    str = str.replace(/[\n]?< *\/ *i *>/ig, "[/i]");
    str = str.replace(/< *strong[^>]*>[\n]?/ig, "[b]");
    str = str.replace(/[\n]?< *\/ *strong *>/ig, "[/b]");
    str = str.replace(/< *em[^\w]*[^>]*>[\n]?/ig, "[i]");
    str = str.replace(/[\n]?< *\/ *em *>/ig, "[/i]");
    str = str.replace(/[\n]?< *li(>|[^\w]+[^>]*?>)[\n]?/ig, "\n[*]");
    str = str.replace(/[\n]?< *\/ *li *>/ig, "\n");
    str = str.replace(/< *ul[^>]*>[\n]?/g, "");
    str = str.replace(/[\n]?< *\/ *ul *>/g, "");
    str = str.replace(/< *h[12][^>]*?>[\n]*/ig, "\n\n[align=center][u][b]");
    str = str.replace(/< *h3[^>]*?>[\n]*/ig, "\n\n[u][b]");
    str = str.replace(/< *h4[^>]*?>[\n]*/ig, "\n[b]");
    str = str.replace(/[\n]*< *\/ *h[12] *>[\n]*/ig, "[/b][/u][/align]\n\n");
    str = str.replace(/[\n]*< *\/ *h[3] *>[\n]*/ig, "[/b][/u]\n");
    str = str.replace(/[\n]*< *\/ *h[4] *>[\n]*/ig, "[/b]\n");
    str = str.replace(/[\n]?< *\/ *h[\d]+ *>/ig, " ");
    str = str.replaceAll(/\&nbsp;/g, " ");
    str = str.replaceAll(/\&gt;/g, ">");
    str = str.replaceAll(/\&lt;/g, "<");
    str = str.replace(/\"/g, "\"");
    str = str.replace(/\&/g, "&");
    str = str.replace(/< *img[^>]*>/ig, "");
    str = str.replace(/< *a[^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    str = str.replaceAll(/<[^>]*>/ig, ""); //remove all other HTML tags, maybe see if > is inside double quotes, but challenging.
    //<-- BBCode formatting below -->//
    str = str.replace(/“/g, "\"");
    str = str.replace(/”/g, "\"");
    //str = str.replace(/\[\/b\]\[\/u\]\[\/align\]\n\n/g, "[/b][/u][/align]\n");
    str = str.replace(/\n\n\[\*\]/g, "\n[*]");
    str = str.replaceAll(/\t/g, ""); //remove all tabs
    str = str.replaceAll(/\n[ 　\t                　]+/g, "\n"); //remove all spaces after linebreak, expanded to all whitespace characters as per Wikipedia (https://en.wikipedia.org/wiki/Whitespace_character)
    str = str.replaceAll("[*] *\n", ""); //remove empty lists
    str = str.replaceAll(/[\n]?\[align=center\]\[u\]\[b\][\s]*\[\/b\]\[\/u\]\[\/align\][\n]?/g,""); //remove empty h2
    str = str.replaceAll(/[\n]?\[u\]\[b\][\s]*\[\/b\]\[\/u\][\n]?/g,""); //remove empty h3
    let count=0;
    while (str.match(/\[([a-z]+)=?[^\]]*?\][\s]*\[\/\1\]/) && count<10) {
        str = str.replaceAll(/\[([a-z]+)=?[^\]]*?\][\s]*\[\/\1\]/g,""); //remove empty tags
        count++;
    }
    str = str.replaceAll(/(\[\/?\w\])(\1)*/g,"$1"); //remove duplicate bbcode
    //str = str.replaceAll("[align=center][u][b]\n[/b][/u][/align]",""); //empty tag
    str = str.replaceAll(/[\n]{3,}/g, "\n\n");
    return str.trim();
}

function getNintendoData(tries=0) {
    let physical = document.querySelectorAll('#main input[type="radio"][id^="Physical"]');
    if (physical?.length > 0) {
        if (physical.length > 1) {
            for (let p of physical) {
                if (!p.parentElement.innerText.includes("Edition")) {
                    physical = p;
                    break;
                }
            }
        } else {
            physical = physical[0];
        }
        if (!window.location.href.includes(physical.getAttribute('href'))) {
            debug(window.location.href);
            debug(physical?.getAttribute('href'));
            window.location = physical.getAttribute('href');
            return;
        }
    }
    let data = {};
    data.loadTime = Date.now();
    const imagesFromNin = Array.from(document.querySelectorAll('#nuka-carousel-slider-frame div[id^=nuka].slide img'));
    let description = document.querySelector('#main div[class^="ProductDetailstyles"],.pmp-module,div[class^="PMP"]')?.outerHTML || document.querySelector('#main section:nth-child(3)')?.outerHTML;
    if (imagesFromNin.length == 0 && tries > 5) {
        debug("Images not found");
        if (!debugMode) window.close();
        return;
    } else if (imagesFromNin.length == 0) {
        //try again after 1000ms
        debug("Continue to wait.");
        window.setTimeout(()=>{getNintendoData(tries+1);}, 1000);
    } else {
        data.images = [];
        if (physical && imagesFromNin?.length > 1) {
            data.coverart = imagesFromNin.shift().getAttribute('src');
            const h = data.coverart?.match(/\d{1,4}x(\d{1,4})/i)?.at(1);
            if (h) {
                data.coverart = data.coverart.replace(/ar_16:9/i,"ar_9:16").replace(/c_\w+/i,"c_crop").replace(/w_\d+/i,'h_'+h).replace('f_auto','f_jpg') + '.jpg';
                debug(data.coverart);
            }
        }
        imagesFromNin.forEach( node => {
            if (!node?.alt.toLowerCase().includes("trailer")) {
                data.images.push(node.src);
                debug(node)
            }
        });
        data.description = description;
        GM_setValue('nintendoData', data);
        GM_removeValueChangeListener(valListener);
        if (!debugMode) window.close();
    }
}

function debug(msg) {
    if (debugMode === true || debugMode === 1 || debugMode === "1" || debugMode === "true") { console.log(msg); }
}
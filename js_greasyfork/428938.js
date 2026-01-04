// ==UserScript==
// @name         WK lesson cherry-picker - kanji
// @namespace    alphaxion
// @version      1.1
// @description  Lets you pick which lesson you want to start by adding a button next to new kanji. Requires WKOF.
// @author       Alphaxion
// @match        https://www.wanikani.com/kanji/*
// @run-at       document-end
// @connect      api.wanikani.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/428938/WK%20lesson%20cherry-picker%20-%20kanji.user.js
// @updateURL https://update.greasyfork.org/scripts/428938/WK%20lesson%20cherry-picker%20-%20kanji.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* global wkof */

    var place;

    var level = document.getElementsByClassName("page-header__icon--level")[0].innerHTML;
    var voc = document.getElementsByClassName("page-header__icon--kanji")[0].innerHTML;
    var sub_id;
    var ass_id;

    // Bonus : add a link to jisho.org
    var lien = "https://jisho.org/search/" + voc;
    document.getElementsByClassName("page-header__icon--level")[0].insertAdjacentHTML("beforebegin",
        '<a href="' + lien + '" class="page-header__icon wklcp-icon" style="color: #ffffff; background-color: #707070; width: 3em;">JISHO</a>');

    var modules = 'ItemData, Settings';
    wkof.include(modules);
    wkof.ready(modules).then(function() {
        wkof.Settings.load("wklcp", {apikey: "none"}).then(startup);
    });

    function startup() {
        var config = {
            wk_items: {
                options: {assignments: true},
                filters: {
                    item_type: 'kan',
                    srs: 'init',
                    level: level
                }
            }
        };
        wkof.ItemData.get_items(config).then(function(items) {
            for (const ele of items) {
                if(ele.data.characters == voc) {
                    sub_id = ele.id;
                    build_button();
                    break;
                }
            }
        });
    }

    function build_button() {
        document.getElementsByClassName("page-header__icon--level")[0].insertAdjacentHTML("beforebegin", '<a href="javascript:void(0)" id="wklcplearnb" class="page-header__icon wklcp-icon">LEARN</a>');
        place = document.getElementById("wklcplearnb");
        place.style.color = "#ffffff";
        place.style.backgroundColor = "#a100f1";
        place.style.width = "3em";

        place.addEventListener("click", event_learn, false);
        if (wkof.settings.wklcp.apikey == "none") {
            add_key();
        }
    }

    function event_learn(ev) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.wanikani.com/v2/assignments?srs_stages=0&subject_types=kanji&levels=" + level,
            headers: {
                "Authorization": "Bearer " + wkof.settings.wklcp.apikey,
                "Wanikani-Revision": "20170710"
            },
            onload: function(response) {
                if(response.status != 200) {
                    if(confirm("WK API answered : " + response.status + " " + response.statusText + "\nDo you want to enter a different API key?")) {
                        add_key();
                    }
                }
                else {
                    var res = JSON.parse(response.responseText);
                    for (const ele of res.data) {
                        if (ele.data.subject_id == sub_id) {
                            ass_id = ele.id;
                            send_learn_request();
                            break;
                        }
                    }
                }
            }
        });
    }

    function send_learn_request() {
        // GM_ évite problème CORS
        GM_xmlhttpRequest({
            method: "PUT",
            url: "https://api.wanikani.com/v2/assignments/" + ass_id + "/start",
            headers: {
                "Authorization": "Bearer " + wkof.settings.wklcp.apikey,
                "Wanikani-Revision": "20170710"
            },
            onload: function(response) {
                console.log(JSON.parse(response.responseText));
                if(response.status != 200) {
                    if(confirm("WK API answered : " + response.status + " " + response.statusText + "\nDo you want to enter a different API key?")) {
                        add_key();
                    }
                }
                else {
                    place.remove();
                }
            }
        });
    }

    function add_key() {
        var dirtykey = prompt("Please enter an API key with 'assignment start' permission");
        if(dirtykey != null) {
            wkof.settings.wklcp.apikey = dirtykey;
            wkof.Settings.save("wklcp");
        }
    }

})();

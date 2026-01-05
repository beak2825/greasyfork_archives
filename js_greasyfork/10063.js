// ==UserScript==
// @name          WaniKani Quick Info KT
// @namespace     https://www.wanikani.com
// @description   Shows available information while waiting for the server response. Originally by Ethan, Modified.
// @version       0.1.4
// @include       http*://www.wanikani.com/review/session*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/10063/WaniKani%20Quick%20Info%20KT.user.js
// @updateURL https://update.greasyfork.org/scripts/10063/WaniKani%20Quick%20Info%20KT.meta.js
// ==/UserScript==

/*global $, console, additionalContent, Notes, UserSynonyms, setTimeout*/
/*jslint plusplus: true */

(function () {
    'use strict';
    additionalContent.itemInfo = function () { return; }; // replace with empty function. will prevent execute on firefox, do nothing on chrome.
    function newItemInfo() {
        // takes in a string and returns an array containing only the kanji characters in the string.
        function getComponents(vocab) {
            var c, components = [];
            for (c = 0; c < vocab.length; c++) {
                if (/^[\u4e00-\u9faf]+$/.test(vocab[c])) {
                    components.push(vocab[c]);
                }
            }
            return components;
        }
        function regex(key) {
            switch (key) {
            case "radical":
                return (/\[(?:radical)\]/gi);
            case "kanji":
                return (/\[(?:kanji)\]/gi);
            case "vocabulary":
                return (/\[(?:vocabulary)\]/gi);
            case "meaning":
                return (/\[(?:meaning)\]/gi);
            case "reading":
                return (/\[(?:reading)\]/gi);
            case "ja":
                return (/\[(?:ja)\]/gi);
            case "closeTagSpan":
                return (/\[\/(?:radical|kanji|vocabulary|meaning|reading|ja)\]/gi);
            }
        }
        function htmlify(str) {
            var i, keys;
            str = str.replace("\r\n", "<br><br>");
            keys = [ "radical", "kanji", "vocabulary", "meaning", "reading", "ja", "closeTagSpan" ];
            function filter(str, key) {
                switch (key) {
                case "ja":
                    return str.replace(regex(key), '<span lang="ja">');
                case "closeTagSpan":
                    return str.replace(regex(key), "</span>");
                default:
                    return str.replace(regex(key), '<span class="highlight-' + key + '">');
                }
            }
            for (i = 0; i < keys.length; i++) {
                str = filter(str, keys[i]);
            }
            return str;
        }
        function getRkvId(item) {
            var rkvType = item.rad ? "r" : item.kan ? "k" : item.voc ? "v" : undefined;
            return (rkvType + item.id);
        }
        function checkCurItem(readMeanType1, rkvId1) {
            var readMeanType2, rkvId2;
            readMeanType2 = $.jStorage.get("questionType");
            rkvId2 = getRkvId($.jStorage.get("currentItem"));
            return (readMeanType1 === readMeanType2 && rkvId1 === rkvId2);
        }
        // normal meaning/name always start with a Capital letter, but injected synonyms are always lowercase only
        // answerChecker injects cur.syn into cur.en when validating a 'meaning' question
        function meaningSynFilterFmt(meaningList) {
            return $.grep(meaningList, function (str) {
                return str.toLowerCase() !== str;
            }).join(", ");
        }
        $("#option-item-info").off("click"); // delete all click handlers for this element
        $("#option-item-info").click(function () {
            // replace the main button toggler code
            if ($("#option-item-info").hasClass("active")) { // if info button .active
                $("#additional-content li").removeClass("active"); // deactivate all buttons
                $("#information").hide().children().hide(); // hide "#information" and child "#item-info"
                $("html, body").animate({ scrollTop: 0 }, 200); // scroll up
            } else if ($("#user-response").is(":disabled")) { // info button NOT .active and not waiting for answer
                $("#information").show().children().hide(); // show "#information" and hide any visible children
                $("html, body").animate({ scrollTop: $("#user-response").offset().top - 10 }, 200); // scroll down
                $("#additional-content li").removeClass("active"); // deactivate all buttons
                $("#option-item-info").addClass("active"); // make info button active
                $("#item-info").fadeIn(300); // show #item-info
            }
            // this replaces another click handler that we deleted
            if ($("#user-response").is(":disabled")) {
                $("#answer-exception").remove();
            }
            var rkvId, itemInfoCol1, itemInfoCol2, cur, readMeanType, itemInfo, loading;
            itemInfo = $("#item-info");
            cur = $.jStorage.get("currentItem");
            readMeanType = $.jStorage.get("questionType");
            rkvId = getRkvId(cur);
            if (itemInfo.is(":visible") && (itemInfo.data("question-type") !== readMeanType || itemInfo.data("id") !== rkvId)) {
                itemInfoCol1 = $("#item-info-col1");
                itemInfoCol2 = $("#item-info-col2");
                itemInfoCol1.empty();
                itemInfoCol2.empty();
                loading = '<img height="40px" src="https://cdn-staging.wanikani.com/assets/v03/loading-100x100-3f623bf48901ac45b1f40168644dbc901efd41b633b9f6d95a5d3ecda3f2111d.gif">'; //put crabigator here
                if (cur.rad) {
                    itemInfoCol1.html('<section id="item-info-name"><h2>Name</h2>' + meaningSynFilterFmt(cur.en) + '</section><section class="user-synonyms"><h2>User Synonyms</h2></section>');
                    itemInfoCol2.html('<section id="item-info-mnemonic"><h2>Mnemonics</h2>' + loading + '</section><section id="note-meaning"></section>');
                    UserSynonyms.load("radical", cur.syn, cur.id, true);
                    $("#all-info").hide();
                    $.getJSON("/json/radical/" + cur.id, function (radJSON) {
                        if (!checkCurItem(readMeanType, rkvId)) {
                            return; // item has since changed, ignore this data.
                        }
                        radJSON.mnemonic = htmlify(radJSON.mnemonic);
                        itemInfoCol1.find("section#item-info-name").html("<h2>Name</h2>" + radJSON.en);
                        itemInfoCol2.find("section#item-info-mnemonic").html("<h2>Mnemonics</h2>" + radJSON.mnemonic);
                        itemInfoCol2.find("section#note-meaning").html("<h2>Name Note</h2>");
                        Notes.add("radical", "meaning", cur.id, radJSON.meaning_note, itemInfoCol2.find("section#note-meaning"));
                        itemInfo.data("id", rkvId);
                        itemInfo.data("question-type", readMeanType);
                    }).fail(function () {
                        $("#information-offline").show();
                    });
                } else if (cur.kan) {
                    (function () {
                        var emphReading;
                        emphReading = cur.emph === "onyomi" ? cur.on : cur.kun;
                        itemInfoCol1.html('<section id="item-info-meaning"><h2>Meanings</h2>' + meaningSynFilterFmt(cur.en) + '</section><section class="user-synonyms"><h2>User Synonyms</h2></section><section id="item-info-reading"><h2>Important Readings (' + cur.emph + ")</h2>" + emphReading + '</section><section id="related-items"><h2>Radical Combination</h2>' + loading + "</section>");
                        itemInfoCol2.html('<section id="item-info-meaning-mnemonic"><h2>Meaning Mnemonic</h2>' + loading + '</section><section id="note-meaning"></section><section id="item-info-reading-mnemonic"><h2>Reading Mnemonic</h2>' + loading + '</section><section id="note-reading"></section>');
                        UserSynonyms.load("kanji", cur.syn, cur.id, true);
                        if (readMeanType === "meaning") {
                            $("#item-info-reading, #item-info-reading-mnemonic, #note-reading").hide();
                        } else {
                            $("#item-info-meaning, #item-info-meaning-mnemonic, #note-meaning, .user-synonyms").hide();
                        }
                        $("#all-info").show();
                    }());
                    $.getJSON("/json/kanji/" + cur.id, function (kanJSON) {
                        if (!checkCurItem(readMeanType, rkvId)) {
                            return; // item has since changed, ignore this data.
                        }
                        var relatedRadChar, relatedRad, i, relatedRadStr, relatedRadList;
                        kanJSON.meaning_mnemonic = htmlify(kanJSON.meaning_mnemonic);
                        kanJSON.reading_mnemonic = htmlify(kanJSON.reading_mnemonic);
                        kanJSON.meaning_hint = htmlify(kanJSON.meaning_hint);
                        kanJSON.reading_hint = htmlify(kanJSON.reading_hint);
                        relatedRadStr = "";
                        relatedRadList = kanJSON.related;
                        for (i = 0; i < relatedRadList.length; i++) {
                            relatedRad = relatedRadList[i];
                            if (relatedRad.custom_font_name) {
                                relatedRadChar = '<i class="radical-' + relatedRad.custom_font_name + '"></i>';
                            } else if (/\.png/i.test(relatedRad.rad)) {
                                relatedRadChar = '<img src="https://s3.amazonaws.com/s3.wanikani.com/images/radicals/' + relatedRad.rad + '">';
                            } else {
                                relatedRadChar = relatedRad.rad;
                            }
                            relatedRadStr += '<li><a title="View radical information page" target="_blank" href="/radicals/' + relatedRad.slug + '"><span class="radical" lang="ja">' + relatedRadChar + "</span> " + relatedRad.en.split(",")[0] + "</li>";
                        }
                        itemInfoCol1.find("section#item-info-meaning").html("<h2>Meanings</h2>" + kanJSON.en);
                        itemInfoCol1.find("section#related-items").html('<h2>Radical Combination</h2><ul class="radical">' + relatedRadStr + "</ul>");
                        itemInfoCol2.find("section#item-info-meaning-mnemonic").html('<h2>Meaning Mnemonic</h2>' + kanJSON.meaning_mnemonic + '<blockquote><h3><i class="icon-question-sign"></i> HINT</h3>' + kanJSON.meaning_hint + '</blockquote>');
                        itemInfoCol2.find("section#item-info-reading-mnemonic").html('<h2>Reading Mnemonic</h2>' + kanJSON.reading_mnemonic + '<blockquote><h3><i class="icon-question-sign"></i> HINT</h3>' + kanJSON.reading_hint + '</blockquote>');
                        itemInfoCol2.find("section#note-meaning").html("<h2>Meaning Note</h2>");
                        Notes.add("kanji", "meaning", cur.id, kanJSON.meaning_note, itemInfoCol2.find("section#note-meaning"));
                        itemInfoCol2.find("section#note-reading").html("<h2>Reading Note</h2>");
                        Notes.add("kanji", "reading", cur.id, kanJSON.reading_note, itemInfoCol2.find("section#note-reading"));
                        itemInfo.data("id", rkvId);
                        itemInfo.data("question-type", readMeanType);
                    }).fail(function () {
                        $("#information-offline").show();
                    });
                } else if (cur.voc) {
                    (function () {
                        var i, relatedKanStr, relatedKanList, relatedKan;
                        relatedKanStr = "";
                        relatedKanList = getComponents(cur.voc);
                        for (i = 0; i < relatedKanList.length; i++) {
                            relatedKan = relatedKanList[i];
                            relatedKanStr += '<li><a title="View kanji information page" target="_blank" href="/kanji/' + relatedKan + '"><span class="kanji" lang="ja">' + relatedKan + "</span></a></li>";
                        }
                        itemInfoCol1.html('<section id="item-info-meaning"><h2>Meanings</h2>' + meaningSynFilterFmt(cur.en) + '</section><section class="user-synonyms"><h2>User Synonyms</h2></section><section id="item-info-reading"><h2>Reading</h2>' + cur.kana.join(", ") + '</section><section id="part-of-speech"><h2>Part of Speech</h2>' + loading + '</section><section id="related-items"><h2>Related Kanji</h2><ul class="kanji">' + relatedKanStr + "</ul></section>");
                        itemInfoCol2.html('<section id="item-info-meaning-mnemonic"><h2>Meaning Explanation</h2>' + loading + '</section><section id="note-meaning"></section><section id="item-info-reading-mnemonic"><h2>Reading Explanation</h2>' + loading + '</section><section id="note-reading"></section><section id="item-info-context-sentences"><h2>Context Sentence</h2>' + loading + "</section>");
                        UserSynonyms.load("vocabulary", cur.syn, cur.id, true);
                        if (readMeanType === "meaning") {
                            $("#item-info-reading, #item-info-reading-mnemonic, #note-reading").hide();
                        } else {
                            $("#item-info-meaning, #item-info-meaning-mnemonic, #note-meaning, .user-synonyms").hide();
                        }
                        $("#all-info").show();
                    }());
                    $.getJSON("/json/vocabulary/" + cur.id, function (vocJSON) {
                        if (!checkCurItem(readMeanType, rkvId)) {
                            return; // item has since changed, ignore this data.
                        }
                        var sentenceStr, relatedKan, i, relatedKanStr, relatedKanList;
                        vocJSON.meaning_explanation = htmlify(vocJSON.meaning_explanation);
                        vocJSON.reading_explanation = htmlify(vocJSON.reading_explanation);
                        relatedKanStr = "";
                        relatedKanList = vocJSON.related;
                        for (i = 0; i < relatedKanList.length; i++) {
                            relatedKan = relatedKanList[i];
                            relatedKanStr += '<li><a title="View kanji information page" target="_blank" href="/kanji/' + relatedKan.slug + '"><span class="kanji" lang="ja">' + relatedKan.kan + "</span> " + relatedKan.en + "</a></li>";
                        }
                        if (vocJSON.sentences.length === 0) {
                            sentenceStr = "<p>N/A</p>";
                        } else {
                            sentenceStr = "<p>" + vocJSON.sentences[0][0] + "</p><p>" + vocJSON.sentences[0][1] + "</p>";
                        }
                        itemInfoCol1.find("section#item-info-meaning").html("<h2>Meanings</h2>" + vocJSON.en);
                        itemInfoCol1.find("section#item-info-reading").html("<h2>Reading</h2>" + vocJSON.kana);
                        itemInfoCol1.find("section#part-of-speech").html("<h2>Part of Speech</h2>" + vocJSON.part_of_speech);
                        itemInfoCol1.find("section#related-items").html('<h2>Related Kanji</h2><ul class="kanji">' + relatedKanStr + "</ul>");
                        itemInfoCol2.find("section#item-info-meaning-mnemonic").html('<h2>Meaning Explanation</h2>' + vocJSON.meaning_explanation);
                        itemInfoCol2.find("section#item-info-reading-mnemonic").html('<h2>Reading Explanation</h2>' + vocJSON.reading_explanation);
                        itemInfoCol2.find("section#note-meaning").html("<h2>Meaning Note</h2>");
                        Notes.add("vocabulary", "meaning", cur.id, vocJSON.meaning_note, itemInfoCol2.find("section#note-meaning"));
                        itemInfoCol2.find("section#note-reading").html("<h2>Reading Note</h2>");
                        Notes.add("vocabulary", "reading", cur.id, vocJSON.reading_note, itemInfoCol2.find("section#note-reading"));
                        itemInfoCol2.find("section#item-info-context-sentences").html("<h2>Context Sentence</h2>" + sentenceStr);
                        itemInfo.data("id", rkvId);
                        itemInfo.data("question-type", readMeanType);
                    }).fail(function () {
                        $("#information-offline").show();
                    });
                }
            }
        });
    }
    // delayed load to make sure this loads after (and so can replace) the original
    setTimeout(function () {
        additionalContent.itemInfo = newItemInfo; // replace empty function with new function
        additionalContent.itemInfo(); // execute it
        console.log('WaniKani Quick Info KT: loaded replacement function');
    }, 100);
    console.log('WaniKani Quick Info KT: script load end');
}());

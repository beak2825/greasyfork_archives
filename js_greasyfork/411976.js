// ==UserScript==
// @name         DeepL Twitter translation
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add "Translate tweet with DeepL" button
// @author       Remonade
// @match        https://twitter.com/*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @require https://code.jquery.com/jquery-3.6.3.min.js
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @icon https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL https://update.greasyfork.org/scripts/411976/DeepL%20Twitter%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/411976/DeepL%20Twitter%20translation.meta.js
// ==/UserScript==

/* globals jQuery, $, GM_config */

(() => {
    'use strict';

    var availableLanguages = ["Bulgarian / BG",
                            "Czech / CS",
                            "Danish / DA",
                            "German / DE",
                            "Greek / EL",
                            "English (British) / EN-GB",
                            "English (American) / EN-US",
                            "Spanish / ES",
                            "Estonian / ET",
                            "Finnish / FI",
                            "French / FR",
                            "Hungarian / HU",
                            "Indonesian / ID",
                            "Italian / IT",
                            "Japanese / JA",
                            "Lithuanian / LT",
                            "Latvian / LV",
                            "Dutch / NL",
                            "Polish / PL",
                            "Portuguese (Brazilian) / PT-BR",
                            "Portuguese (European) / PT-PT",
                            "Romanian / RO",
                            "Russian / RU",
                            "Slovak / SK",
                            "Slovenian / SL",
                            "Swedish / SV",
                            "Turkish / TR",
                            "Ukrainian / UK",
                            "Chinese (simplified) / ZH" ];
    availableLanguages.sort();

    GM_config.init({
        "id": "TranslateDeeplSettings",
        "title": "Translate with DeepL settings",
        "fields":
        {
            "TargetLang":
            {
                "label": "Target language",
                "section": ["Translation settings"],
                "type": "select",
                "options": availableLanguages,
                "default": "English (American) / EN-US"
            },
            "DeeplApiKey":
            {
                "label": "DeepL API key",
                "type": "text",
                "default": ""
            },
            "TranslateHashtags":
            {
                "label": "Translate hashtags",
                "type": "checkbox",
                "default": true
            }
        }
    });

    GM_registerMenuCommand("Settings", () => {
        GM_config.open();
    });

    function isHTML(str) {
        let doc = new DOMParser().parseFromString(str, "text/html");
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    }

    function injectDeeplTranslationButton(tweetTextContainer) {
        var translateButtonContainer = $(tweetTextContainer).siblings()[0];

        if(translateButtonContainer != undefined) {
            let tweetLang = tweetTextContainer.attr("lang"),
                tweetContent = "",
                deeplButtonContainer = $(translateButtonContainer).clone().appendTo($(translateButtonContainer).parent());

            tweetTextContainer.children().each((index,item) => {
                if(item.nodeName === "SPAN") {
                    var tweetPart = $(item).html().trim();
                    var isHtml = isHTML(tweetPart);
                    if(tweetPart && tweetPart != "" && !isHtml) {
                        tweetContent += " " + tweetPart;
                    }
                    else if(isHtml) {
                        var itemChild = $(item).children().get(0);

                        // HASHTAG
                        if(GM_config.get("TranslateHashtags") && itemChild.nodeName == "A" && $(itemChild).attr("href").includes("hashtag")) {
                            tweetPart = $(itemChild).html().trim();
                            isHtml = isHTML(tweetPart);
                            if(tweetPart && tweetPart != "" && !isHtml) {
                                tweetContent += "\n" + tweetPart.replace("#", "%23");
                            }
                        }
                    }
                }
                else if(item.nodeName == "IMG") {
                    if($(item).attr("alt") !== undefined) {
                        tweetContent += " " + $(item).attr("alt");
                    }
                }
            });

            deeplButtonContainer.children("span").html("Translate Tweet with DeepL");
            deeplButtonContainer.hover(function() {
                $(this).css("text-decoration", "underline");
            }, function() {
                $(this).css("text-decoration", "none");
            });

            deeplButtonContainer.on("click", () => {
                var TargetLangCode = GM_config.get("TargetLang").split('/')[1].trim();

                if(GM_config.get("DeeplApiKey") !== "") {
                    var translationContainer = $("#tweetDeeplTranslation")[0];
                    if(translationContainer === undefined) {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: GM_config.get("DeeplApiKey").endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate",
                            headers: {
                                "Authorization": "DeepL-Auth-Key " + GM_config.get("DeeplApiKey"),
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            data: "text=" + tweetContent + "&target_lang=" + TargetLangCode,
                            onload: (response) => {
                                if(response.responseText !== undefined) {
                                    var result = JSON.parse(response.responseText);
                                    if(result.translations.length > 0) {
                                        var translation = result.translations[0].text;
                                        translateButtonContainer = $(tweetTextContainer).siblings()[0];
                                        translationContainer = $(tweetTextContainer).clone().appendTo($(translateButtonContainer).parent());
                                        translationContainer.removeAttr("lang");
                                        translationContainer.removeAttr("data-testid");
                                        translationContainer.attr("id", "tweetDeeplTranslation");
                                        translationContainer.html(translation);
                                        $("span", deeplButtonContainer).html("Translated by DeepL");
                                        var deeplButtonContainerTmp = deeplButtonContainer;
                                        deeplButtonContainer = deeplButtonContainer.clone(true, true).appendTo($(translateButtonContainer).parent());
                                        deeplButtonContainerTmp.remove();
                                    }
                                    else {
                                        alert("No translation return by DeepL API");
                                    }
                                }
                                else {
                                    alert("Error during call to DeepL API");
                                }
                            },
                            onerror: (response) => {
                                alert("Error during call to DeepL API");
                                console.error("Error during call to DeepL API", response);
                            }
                        });
                    }
                    else {
                        translationContainer.remove();
                        $("span", deeplButtonContainer).html("Translate Tweet with DeepL");
                    }
                }
                else {
                    tweetContent = tweetContent.replaceAll("/", "\\/").replace(/(?:\r\n|\r|\n)/g, '%0D').trim();
                    window.open(`https://www.deepl.com/translator#${tweetLang}/${TargetLangCode}/${tweetContent}`,'_blank');
                }
            });
        }
    }

    function addObserverIfHeadNodeAvailable() {
        const target = $("head > title")[0],
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
        observer = new MutationObserver((mutations) => {
            var tweetTexts = [];
            mutations.forEach((mutation) => {
                var tweetTextContainer = $("div[data-testid='tweetText']", mutation.addedNodes)[0];
                if(tweetTextContainer !== undefined && !tweetTexts.includes(tweetTextContainer)) {
                    tweetTexts.push(tweetTextContainer);
                }
            });

            tweetTexts.forEach((tweetTextContainer) => {
                injectDeeplTranslationButton($(tweetTextContainer));
            });
        });
        if(!target) {
            return;
        }
        clearInterval(waitForHeadNodeInterval);
        observer.observe($("body")[0], { subtree: true, characterData: true, childList: true });
    }

    let waitForHeadNodeInterval = setInterval(addObserverIfHeadNodeAvailable, 100);
})();
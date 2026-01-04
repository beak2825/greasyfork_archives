// ==UserScript==
// @name         Like and Dislike counter remover
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Now that number of dislike is hidden like counter is useless so I'll hide it too
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/435963/Like%20and%20Dislike%20counter%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/435963/Like%20and%20Dislike%20counter%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //url to test https://www.youtube.com/watch?v=IkpM9J2_KaM
    //var buttons = document.querySelectorAll("#top-level-buttons-computed > ytd-toggle-button-renderer yt-formatted-string");
    //console.log("\""+document.querySelector("html").getAttribute("lang")+"\":{\"like\":\""+buttons[0].innerText+"\",\"dislike\":\""+buttons[1].innerText+"\"},")
    var language = {"af-ZA":{"like":"laaik","dislike":"laaik nie"},
                "az-Latn-AZ":{"like":"bəyən","dislike":"bəyənmi̇rəm"},
                "id-ID":{"like":"suka","dislike":"tidak suka"},
                "ms-MY":{"like":"suka","dislike":"tidak suka"},
                "bs-Latn-BA":{"like":"sviđa mi se","dislike":"ne sviđa mi se"},
                "ca-ES":{"like":"m'agrada","dislike":"no m'agrada"},
                "cs-CZ":{"like":"to se mi líbí","dislike":"nelíbí se"},
                "da-DK":{"like":"kan lide","dislike":"kan ikke lide"},
                "de-DE":{"like":"mag ich","dislike":"mag ich nicht"},
                "et-EE":{"like":"meeldib","dislike":"ei meeldi"},
                "en-IN":{"like":"likes","dislike":"dislike"},
                "en-GB":{"like":"likes","dislike":"dislike"},
                "en":{"like":"likes","dislike":"dislike"},
                "es-ES":{"like":"Me gusta","dislike":"no me gusta"},
                "es-419":{"like":"Me gusta”","dislike":"no me gusta"},
                "es-US":{"like":"Me gusta”","dislike":"no me gusta"},
                "eu-ES":{"like":"Gustatzen zait","dislike":"ez zait gustatzen"},
                "fil-PH":{"like":"i-like","dislike":"i-dislike"},
                "fr-FR":{"like":"J'aime","dislike":"je n'aime pas"},
                "fr-CA":{"like":"J'aime","dislike":"je n'aime pas"},
                "gl-ES":{"like":"Gústame","dislike":"non me gusta"},
                "hr-HR":{"like":"sviđa mi se","dislike":"ne sviđa mi se"},
                "zu-ZA":{"like":"ukuthanda","dislike":"ukungathandi"},
                "is-IS":{"like":"líkar","dislike":"mislíkar"},
                "it-IT":{"like":"mi piace","dislike":"non mi piace"},
                "sw-TZ":{"like":"imenipendeza","dislike":"haijanipendeza"},
                "lv-LV":{"like":"patīk","dislike":"nepatīk"},
                "lt-LT":{"like":"pažymėti, kad patinka","dislike":"pažymėti, kad nepatinka"},
                "hu-HU":{"like":"tetszik","dislike":"nem tetszik"},
                "nl-NL":{"like":"vind ik leuk","dislike":"vind ik niet leuk"},
                "nb-NO":{"like":"liker","dislike":"liker ikke"},
                "uz-Latn-UZ":{"like":"yoqdi","dislike":"yoqmadi"},
                "sq-AL":{"like":"më pëlqen","dislike":"mos e pëlqe"},
                "vi-VN":{"like":"thích","dislike":"không thích"},
                "tr-TR":{"like":"beğen","dislike":"beğenme"},
                "be-BY":{"like":"адабаецца","dislike":"е падабаецца"},
                "bg-BG":{"like":"аресване","dislike":"ехаресване"},
                "ky-KG":{"like":"акты","dislike":"аккан жок"},
                "kk-KZ":{"like":"найды","dislike":"намайды"},
                "mk-MK":{"like":"и се допаѓа","dislike":"е ми се допаѓа"},
                "mn-MN":{"like":"аалагдаж байна","dislike":"аалагдаагүй"},
                "ru-RU":{"like":"равится","dislike":"е нравится"},
                "sr-Cyrl-RS":{"like":"виђање","dislike":"есвиђање"},
                "uk-UA":{"like":"одобається","dislike":"е подобається"},
                "el-GR":{"like":"ου αρεσει","dislike":"εν μου αρεσει"},
                "hy-AM":{"like":"ՀԱՎԱՆԵԼ","dislike":"ՉՀԱՎԱՆԵԼ"},
                "he-IL":{"like":"לייק","dislike":"דיסלייק"},
                "ur-PK":{"like":"پسند کریں","dislike":"ناپسند کریں"},
                "ar":{"like":"أعجبني","dislike":"لم يعجبني"},
                "fa-IR":{"like":"پسندیدن","dislike":"نپسندیدن"},
                "ne-NP":{"like":"न पराउनुहोस्","dislike":"न नपराउनुहोस्"},
                "mr-IN":{"like":"वड दर्शवा","dislike":"ावड दर्शवा"},
                "hi-IN":{"like":"ाइक","dislike":"ापसंद"},
                "as-IN":{"like":"াইক কৰক","dislike":"িছলাইক কৰক"},
                "bn-BD":{"like":"ছন্দ","dislike":"পছন্দ"},
                "pa-Guru-IN":{"like":"ਸੰਦ ਕਰੋ","dislike":"ਾਪਸੰਦ"},
                "gu-IN":{"like":"સંદ","dislike":"ાપસંદ"},
                "or-IN":{"like":"ସନ୍ଦ","dislike":"ାପସନ୍ଦ"},
                "ta-IN":{"like":"ிருப்பம்","dislike":"ிடிக்கவில்லை"},
                "te-IN":{"like":"ష్టంగా గుర్తించు","dislike":"యిష్టంగా గుర్తించు"},
                "kn-IN":{"like":"ಷ್ಟ","dislike":"ಷ್ಟವಿಲ್ಲ"},
                "ml-IN":{"like":"ൈക്ക് ചെയ്യുക","dislike":"ിസ്‌ലൈക്കുചെയ്യുക"},
                "si-LK":{"like":"ැමතියි","dislike":"කමැතියි"},
                "th-TH":{"like":"อบ","dislike":"ม่ชอบ"},
                "lo-LA":{"like":"ັກ","dislike":"ໍ່ມັກ"},
                "my-MM":{"like":"ိုက်ခ်","dislike":"ကြိုက်"},
                "ka-GE":{"like":"ოწონება","dislike":"აწუნება"},
                "am-ET":{"like":"ውደድ","dislike":"ለመውደድ"},
                "km-KH":{"like":"ចូលចិត្ត","dislike":"មិន​ចូលចិត្ត"},
                "zh-Hans-CN":{"like":"顶","dislike":"踩"},
                "zh-Hant-TW":{"like":"喜歡","dislike":"不喜歡"},
                "zh-Hant-HK":{"like":"喜歡","dislike":"不喜歡"},
                "ja-JP":{"like":"高評価","dislike":"低評価"},
                "ko-KR":{"like":"좋아요","dislike":"싫어요"}
               }
    //return;
        //https://stackoverflow.com/a/52809105----
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });

    //https://stackoverflow.com/a/45956628----
    //youtube wtf events
    //new layout > 2017
    window.addEventListener("yt-navigate-finish", function(event) {
        window.dispatchEvent(new Event('locationchange'))
    });

    //old layout < 2017
    window.addEventListener("spfdone", function(e) {
        window.dispatchEvent(new Event('locationchange'))
    });

    //let style = document.createElement("style");
    //style.innerHTML = "#top-level-buttons-computed > ytd-toggle-button-renderer yt-formatted-string{display: none !important}";
    //document.head.appendChild(style);
    let firstRun = true;

    function getLabelButton(button){
        var text = button["toggleButtonRenderer"]["defaultText"];
        try{
            var label = text["accessibility"]["accessibilityData"]["label"];
        }catch{
            label = text["simpleText"];
        }
        return label.replace(/([0-9\.\ ]+ )?/,"");
    }

    function setText(likeLabel,dislikeLabel){
        var buttons = document.querySelectorAll("#top-level-buttons-computed > ytd-toggle-button-renderer yt-formatted-string");
        //new_buttons because there is a new ui
        var new_buttons = document.querySelector("#segmented-like-button .yt-core-attributed-string");
        if(buttons.length < 2 && new_buttons === null){
            setTimeout(function(){setText(likeLabel,dislikeLabel)},5);
        }else{
            if(buttons.length >= 2 && document.querySelector("#like-bar").getAttribute("style") == null){
                buttons[0].innerHTML = likeLabel;
                buttons[1].innerHTML = dislikeLabel;
                buttons[0].innerText = likeLabel;
                buttons[1].innerText = dislikeLabel;

                if(firstRun){
                    //document.head.removeChild(style);

                    new MutationObserver(function (mutationList,observer){
                        observer.disconnect();
                        if(document.querySelector("#like-bar").getAttribute("style") == null)
                            buttons[0].innerHTML = likeLabel;
                            buttons[0].innerText = likeLabel;
                        observer.observe(buttons[0],{childList : true});
                    }).observe(buttons[0],{childList : true});

                    new MutationObserver(function (mutationList,observer){
                        observer.disconnect();
                        if(document.querySelector("#like-bar").getAttribute("style") == null)
                            buttons[1].innerHTML = dislikeLabel;
                            buttons[1].innerText = dislikeLabel;
                        observer.observe(buttons[1],{childList : true});
                    }).observe(buttons[1],{childList : true});
                    firstRun = false;
                }
            }else if(new_buttons){
                new_buttons.innerHTML = "";
                new_buttons.innerText = "";
                if(firstRun) {
                    new MutationObserver(function (mutationList,observer){
                        observer.disconnect();
                        new_buttons.innerHTML = "";
                        new_buttons.innerText = "";
                        observer.observe(new_buttons,{childList : true});
                    }).observe(new_buttons,{childList : true});
                    firstRun = false;
                }
            }else if(firstRun){
                //document.head.removeChild(style);
                firstRun = false;
            }
        }
    }

    function replaceText(){
        try{
            if(document.URL.match(/^(https:\/\/www\.youtube\.com)\/(watch\?v\=)/) == null) return;
            var st;
            // new layout 21/10/2023
            var newLayout = document.querySelectorAll("#segmented-like-button .yt-spec-button-shape-next__button-text-content").length > 0;
            // new layout 30/11/2023
            if(newLayout == false){
                newLayout = document.querySelectorAll("like-button-view-model").length > 0;
            }
            if(newLayout == false){
                // old layout
                var buttons = document.querySelectorAll("#top-level-buttons-computed > ytd-toggle-button-renderer yt-formatted-string");
                var new_buttons = document.querySelector("#segmented-like-button .yt-core-attributed-string");
                if(buttons.length < 2 && new_buttons === null){
                    setTimeout(replaceText,5);
                    return;
                }
                var lang = document.querySelector("html").getAttribute("lang");
                var likeLabel = language[lang]["like"];
                var dislikeLabel = language[lang]["dislike"];

                setText(likeLabel,dislikeLabel);
                st = document.createElement("style");
                st.innerHTML = ".yt-spec-button-shape-next__icon {margin: 0px !important}";
                document.body.appendChild(st);
            } else {
                st = document.querySelector("#like-dislike-counter-remover-style");
                if(st === null){
                    st = document.createElement("style");
                    st.setAttribute("id","like-dislike-counter-remover-style");
                    st.innerHTML = "#segmented-like-button .yt-spec-button-shape-next__button-text-content,  like-button-view-model toggle-button-view-model button > div:last-of-type{display: none !important} "+
                                   "#segmented-like-button .yt-spec-button-shape-next__icon, like-button-view-model toggle-button-view-model button > div:first-of-type {margin-left: 0px !important; margin-right: -6px !important}";
                    document.body.appendChild(st);
                }
            }

        }catch(e){
            console.log(e);
        }
    }
    //window.addEventListener("load",replaceText);
    window.addEventListener('locationchange', replaceText);
    replaceText();
    // Your code here...
})();
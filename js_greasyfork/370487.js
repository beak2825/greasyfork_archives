// ==UserScript==
// @name         Autotranslate Review
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370487/Autotranslate%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/370487/Autotranslate%20Review.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //jQuery("#item-info-meaning-mnemonic").text().substring(19)
    //jQuery("#item-info-reading-mnemonic").text().substring(19)

    setInterval(function(){

        // https://github.com/matheuss/google-translate-api/blob/master/languages.js
    var language = navigator.language.split("-")[0] // replace with language string from above

    if (localStorage.autoTranslateReview == undefined){
        localStorage.setItem("autoTranslateReview","{}")
    }


        if (jQuery("#itemInfoMeaningMnemonic, #itemInfoReadingMnemonic, #noteMeaning, #noteReading").length == 0){
            if (jQuery("#item-info-meaning-mnemonic").text().substring(19).length > 0){
                SetText(jQuery("#item-info-meaning-mnemonic"), "itemInfoMeaningMnemonic", jQuery("#item-info-meaning-mnemonic").text().substring(19))
            }
            if (jQuery("#note-meaning").text().substring(19).length > 0){
             //   SetText(jQuery("#note-meaning"), "noteMeaning", jQuery("#note-meaning").text().substring(12))
            }
            if (jQuery("#item-info-reading-mnemonic").text().substring(19).length > 0){
                SetText(jQuery("#item-info-reading-mnemonic"), "itemInfoReadingMnemonic", jQuery("#item-info-reading-mnemonic").text().substring(19))
            }
            if (jQuery("#note-reading").text().substring(12).length > 0){
            //    SetText(jQuery("#note-reading"), "noteReading", jQuery("#note-reading").text().substring(19))
            }
        }
     }, 3000);

    function SetText(element, identifier, text){



    var cache = JSON.parse(localStorage.autoTranslateReview)
    var cacheItem = jQuery("#character").attr("class") + "-" + jQuery("#character").text().trim() + identifier;

     if (cache[cacheItem] !== undefined){
            jQuery(element).append("<p id='" + identifier + "'>" + cache[cacheItem]  + "</p>")
        }
     else{
        jQuery.getJSON({ url:"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=de&dt=t&q=" + encodeURIComponent(text)}, function( ret ) {
            var trans = ret[0][0][1] === "Meaning Explanation" ? "": ret[0].map(x=> x[0]).join("");
            jQuery(element).append("<p id='" + identifier + "'>" + trans + "</p>")
            var cache = JSON.parse(localStorage.autoTranslateReview)
            cache[cacheItem] = trans;
            localStorage.setItem("autoTranslateReview",JSON.stringify(cache))
        })
     }
    }

    // Your code here...
})();
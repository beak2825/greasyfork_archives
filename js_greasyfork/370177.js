// ==UserScript==
// @name         AutoTranslate Kanji and Vocab Page
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a google translated
// @author       You
// @match        https://www.wanikani.com/kanji/*
// @match        https://www.wanikani.com/vocabulary/*
// @match        https://www.wanikani.com/radicals/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370177/AutoTranslate%20Kanji%20and%20Vocab%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/370177/AutoTranslate%20Kanji%20and%20Vocab%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://github.com/matheuss/google-translate-api/blob/master/languages.js
    var language = navigator.language.split("-")[0] // replace with language string from above

    if (localStorage.autoTranslate == undefined){
        localStorage.setItem("autoTranslate","{}")
    }

    var cache = JSON.parse(localStorage.autoTranslate)
    var max = 0;
    var source = [];
    var trans = [];
    var fromCahe = false;

    var cacheItem = jQuery("header h1 span").eq(0).attr('class') + "-" + jQuery("header h1 span").eq(0).text()


    if (cache[cacheItem] !== undefined){
        trans = cache[cacheItem];
        fromCahe = true;
    }

    max = $( "h2:contains('Name Mnemonic') , h2:contains('Reading Mnemonic') , h2:contains('Meaning Mnemonic') , h2:contains('Reading Explanation') , h2:contains('Meaning Explanation') "  ).parent().find("p").length
    jQuery.each( $( "h2:contains('Name Mnemonic') , h2:contains('Reading Mnemonic') , h2:contains('Meaning Mnemonic') , h2:contains('Reading Explanation') , h2:contains('Meaning Explanation') "  ).parent().find("p"), function( key, value ) {
        var text = jQuery(value).text();
        source.push(value);

        if (fromCahe == false)
            jQuery.getJSON({ url:"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=de&dt=t&q=" + encodeURIComponent(text)}, function( ret ) {
                trans[key]= ret[0][0][1] === "Meaning Explanation" ? "": ret[0].map(x=> x[0]).join("");
                save();
            })
        else
            save();
    });

    function save(){
        if (max == trans.length ){
            cache[cacheItem] = trans;
            localStorage.setItem("autoTranslate",JSON.stringify(cache))
            render(source,trans)
        }
    }

    function render(source, items){
        for(var i=0; i<source.length;i++){
            if(jQuery("#trans" + i).length == 0 && items[i] !== undefined)
            jQuery(source[i]).after("<p id='trans"+i+"'>" + items[i] + "</p>")
        }
    }


    // Your code here...
})();
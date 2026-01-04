// ==UserScript==
// @name         Goo Dictionary Example Questions Extractor
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  try to take over the world!
// @author       You
// @match        https://dictionary.goo.ne.jp/jn/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374488/Goo%20Dictionary%20Example%20Questions%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/374488/Goo%20Dictionary%20Example%20Questions%20Extractor.meta.js
// ==/UserScript==

(function() {

//get example sentences
    var title = jQuery('.basic_title h1').text().match(/【(.*?)】/g); //for nouns that don't use the dash
    console.log(title);
    if(title != null){
        title = title[0].replace(/[【】]/g, '');
    }
    var reg = /「.{0,10}[―](.*?)」/g;
    var str = jQuery('div.contents').text();
    var arr = str.match(reg);
    if(arr == null){
        reg = new RegExp("「.{0,10}"+title+"(.*?)」", 'g');
        arr = str.match(reg);
    }
//get similar words
    var str2 = "類語   ";
    jQuery('.related_words_box dd a').each(function(){
        x = jQuery(this).text().replace(/\((.*?)\)/g, '');
        str2 += x+"\n";
    })

    var apnd = "<div style='position:fixed; bottom:0; left:0;'>";
    apnd+= "<textarea id='extract_area_similar_words' style='width:300px; height:75px;'>Synonyms</textarea>";
    apnd+= "<br/><textarea id='extract_area' style='width:300px; height:200px;'></textarea>";
    apnd+= "</div>";
    $( "body" ).append( apnd );
    if(arr != null){
        for(var i = 0, ent; i < arr.length; i++){
            i < arr.length -1 ? ent = '\n' : ent = '';
            jQuery('#extract_area').text(jQuery('#extract_area').text() + arr[i] + ent);
            console.log(arr[i]);
        };
    }
    if(str2 != ''){
        jQuery('#extract_area_similar_words').text(str2);
    }
    if(jQuery('#extract_area').text() !== ''){
        var x = document.getElementById("extract_area");
        x.select();
        console.log('Select data');
    }else{
        console.log('no data to copy');
    }
})();
// ==UserScript==
// @name         KollaFilm2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  This is the last script
// @author       D3lta
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://*/e/*
// @icon         https://www.google.com/s2/favicons?domain=kollafilm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433953/KollaFilm2.user.js
// @updateURL https://update.greasyfork.org/scripts/433953/KollaFilm2.meta.js
// ==/UserScript==

$(document).ready(function() {
    setTimeout(function(){
        var url2 = $('iframe')[0].baseURI
        $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        }
        var url3 = $.urlParam('url4'); // name

        if (url2.indexOf("streamtape") >= 0) {
            var source = $('#robotlink')[0].innerText
            var poster = $('#mainvideo')[0].poster
            if ($('#mainvideo')[0].firstElementChild.src) {
                var caption = $('#mainvideo')[0].firstElementChild.src;
            }
            //console.log('https://d3ltanuub28.000webhostapp.com/index.php?url2='+url2+'&url=https:'+source+'&poster='+poster+'&caption='+caption);
            window.location.href = 'https://d3ltanuub28.000webhostapp.com/index.php?url3='+url3+'&url2='+url2+'&url=https:'+source+'&poster='+poster+'&caption='+caption;
        } else if (url2.indexOf("streamlare") >= 0) {
            var source2 = $('.jw-video')[0].src;
            //console.log(source2);
            window.location.href = 'https://d3ltanuub28.000webhostapp.com/index.php?url3='+url3+'&url2='+url2+'&url='+source2;
        } else {
            var source3 = $('#robotlink')[0].innerText
            var poster2 = $('#mainvideo')[0].poster
            if ($('#mainvideo')[0].firstElementChild) {
                var caption2 = $('#mainvideo')[0].firstElementChild.src;
            } else {
              caption2 = "null";
            }
            //console.log('https://d3ltanuub28.000webhostapp.com/index.php?url2='+url2+'&url=https:'+source+'&poster='+poster+'&caption='+caption);
            window.location.href = 'https://d3ltanuub28.000webhostapp.com/index.php?url3='+url3+'&url2='+url2+'&url=https:'+source3+'&poster='+poster2+'&caption='+caption2;
        }
    }, 500);
});
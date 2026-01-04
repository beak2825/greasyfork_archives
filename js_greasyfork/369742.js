// ==UserScript==
// @name         RYM: Average rating manipulator (greater than 2.5)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  manipulate the average rating on rym albums!
// @author       ando
// @match        https://rateyourmusic.com/release/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369742/RYM%3A%20Average%20rating%20manipulator%20%28greater%20than%2025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369742/RYM%3A%20Average%20rating%20manipulator%20%28greater%20than%2025%29.meta.js
// ==/UserScript==

// /[0-9].[0-9], [0-9]{1,2}/g

(function() {
    'use strict';
    var chart = $("script:contains('data.addRows')").text();
    var patt = /[0-9].[0-9], [0-9]{1,5}/g;
    var r_patt = /[0-9].[0-9]/g;
    var v_patt = /, [0-9]{1,5}/g;
    var avg = 0.0;
    var total = 0.0;
    $.each($(chart.match(patt)), function(){
        if (parseFloat(this.match(r_patt)) > 2.5){
            avg = avg + parseFloat(this.match(r_patt)) * parseFloat(String(this.match(v_patt)).slice(2,));
            total = total + parseFloat(String(this.match(v_patt)).slice(2,))
        }
    })
    $('span.avg_rating').parent().after('<br>'+(avg/total).toFixed(2)+' / 5.0 from '+total+' ratings');
})();
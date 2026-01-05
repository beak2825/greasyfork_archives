// ==UserScript==
// @name        IMDB actors age at year of release
// @namespace   robin
// @include     http://www.imdb.com/title/tt*
// @version     1
// @grant       none
// @description Display the age of actor or actress that they had when the film was released
// @downloadURL https://update.greasyfork.org/scripts/24717/IMDB%20actors%20age%20at%20year%20of%20release.user.js
// @updateURL https://update.greasyfork.org/scripts/24717/IMDB%20actors%20age%20at%20year%20of%20release.meta.js
// ==/UserScript==

var productionYear = $('title').text().match(/\d{4}/g);
$( ".nm , .itemprop" ).each(function( index ) {
    var detailURL = $(this).find("a").attr('href'),
    	e = $(this);
    $.get(detailURL, "html" ).success(function( data ) {
        var born = $('time', data).attr('datetime'),
        	ages = "";
        for (var i in productionYear)
        {
        	ages += i > 0 && i != productionYear.length ? "-" : "";
        	ages += productionYear[i] - born.substring(0,4);
        }
        var age = new Date( (new Date() - new Date(born) ) ).getFullYear() - 1970;
        e.children().wrap("<span style=\"border:none\" title=\"born: " + born.substring(0,4) + " (currently " + age + " years old)\" />" ).after(" (" + ages + ")");
    });
});
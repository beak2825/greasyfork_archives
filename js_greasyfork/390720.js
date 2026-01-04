// ==UserScript==
// @name         Discogs/Listing/include-update-dates
// @namespace    https://greasyfork.org/en/scripts/390720/
// @version      0.5
// @description  load rss page and copy over listings updated dates
// @author       denlekke
// @match        https://www.discogs.com/sell/*
// @match        https://www.discogs.com/seller/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390720/DiscogsListinginclude-update-dates.user.js
// @updateURL https://update.greasyfork.org/scripts/390720/DiscogsListinginclude-update-dates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var rssiframe = document.createElement('iframe');
    var url = window.location.href.toString();
    var link = 'https://www.discogs.com/sell/mplistrss?output=rss&';

    if(url.includes('?')){
        link = url+'&output=rss'
    }
    else{
        link = url+'?output=rss'
    }
    rssiframe.setAttribute('src', link);
    console.log(link);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var responsexml = xhttp.responseXML;
            var entries = responsexml.getElementsByTagName("entry");
            var listings = document.getElementsByClassName('item_description');

            for( var i = 0; i< listings.length; i++){
                var listingID = listings[i].childNodes[1].childNodes[1].href.split('item/')[1];

                for(var j =0; j<entries.length; j++){
                    var entryID = entries[j].getElementsByTagName("id")[0].innerHTML.split('item/')[1];

                    if(entryID === listingID){
                        var updated = entries[j].getElementsByTagName("updated")[0].innerHTML;
                        var date = updated.split('T')[0];
                        var time = updated.split('T')[1].split('Z')[0];
                        var addHTML = ''
                        addHTML += '<span class ="mplabel item_update_date">';
                        addHTML += 'Listing Updated: ';
                        addHTML += '</span>';
                        addHTML += '<span class ="item_update_date">';
                        addHTML += date+' - '+time;
                        addHTML += '</span><br>';

                        if(url.includes('seller')){
                            var temp = listings[i].childNodes[5].innerHTML;
                            listings[i].childNodes[5].innerHTML = addHTML+temp;
                        }
                        else if(url.includes('sell/list')){
                            var temp2 = listings[i].childNodes[5].innerHTML;
                            listings[i].childNodes[5].innerHTML = addHTML+temp2;
                        }
                        else{
                            var temp3 = listings[i].childNodes[7].innerHTML;
                            listings[i].childNodes[7].innerHTML = addHTML+temp3;
                        }
                    }
                }
            }
        }
    };
    xhttp.open("GET", link, true);
    xhttp.send();

})();
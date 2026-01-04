// ==UserScript==
// @name         Discogs/Release/SearchLinks
// @version      2.0
// @description  Link to a search pages
// @author       denlekke
// @include      http*://*discogs.com/*
// @grant        none
// @namespace https://greasyfork.org/en/scripts/387915
// @downloadURL https://update.greasyfork.org/scripts/387915/DiscogsReleaseSearchLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/387915/DiscogsReleaseSearchLinks.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var json_element=document.getElementById('release_schema');
    json_element = JSON.parse(json_element.text);
    var album_name = json_element.name;
    var artist=json_element.releaseOf.byArtist[0].name.trim()
    if(album_name)
    {
        var album = album_name.trim()
        // if slash present, put either side of it in an "or" search
        var album_for_ebay = album;
        if (album.includes("/")){
            album_for_ebay = "("+album.split("/")[0].trim()+","+ album.split("/")[1].trim()+")";
        }
        album = album.split("/")[0];

        //placing the new section
        var parent_element=document.getElementsByClassName('content_pzwez')[0].childNodes[0];
        var insert_before_element = parent_element.childNodes[7];
        var div=document.createElement('div');
        div.setAttribute('class', 'side_3-xID');
        div.setAttribute('id', 'search_links');
        div.setAttribute('style', 'order:2');
        parent_element.insertBefore(div,insert_before_element);


        var header_div = document.createElement('div');
        header_div.setAttribute('class', 'header_W2hzl');
        div.appendChild(header_div);

        var h3=document.createElement('h3');
        header_div.appendChild(h3);
        h3.appendChild(document.createTextNode('Search Links'));

        //2nd lowest depth
        var d2=document.createElement('div');
        d2.setAttribute('class', 'content_1TFzi');
        div.appendChild(d2);

        //lowest depth parent element
        var d1=document.createElement('div');
        d1.setAttribute('class', 'items_3gMeU');
        d2.appendChild(d1);
        //d1.className+='section statistics';

        var ulLeft = document.createElement('ul');
        var ulRight = document.createElement('ul');
        var tempLi;
        var a;

        a=document.createElement('a');
        a.href="https://www.youtube.com/results?search_query="+encodeURIComponent('"'+artist.trim()+'"'+' '+'"'+album.trim()+'"');
        a.innerHTML = 'Youtube Exact';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulLeft.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://gripsweat.com/search/?query="+encodeURIComponent(artist.trim()+' '+album.trim());
        a.innerHTML = 'Gripsweat';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulLeft.appendChild(tempLi);

        //ebay
        //first determine format
        var formatID = ""
        var formatString = ""
        var format = document.querySelector("a[href^='/search/?format_exact=Cassette']")
        if (format != null){
            formatID = "176983"
            formatString = "Cassette"
        }
        format = document.querySelector("a[href^='/search/?format_exact=CD']")
        if (format != null){
            formatID = "176984"
            formatString = "CD"
        }
        format = document.querySelector("a[href^='/search/?format_exact=Vinyl']")
        if (format != null){
            formatID = "176985"
            formatString = "Vinyl"
        }
        a=document.createElement('a');
        a.href="https://www.ebay.com/sch/"+formatID+"/i.html?_from=R40&_blrs=category_constraint&LH_PrefLoc=2&_nkw="+encodeURIComponent(artist.trim()+' '+album_for_ebay.trim());
        a.innerHTML = 'Ebay '+formatString;
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulLeft.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://www.popsike.com/php/quicksearch.php?searchtext="+encodeURIComponent(artist.trim()+' '+album.trim());
        a.innerHTML = 'Popsike';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulLeft.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://www.amazon.com/s?k="+encodeURIComponent(artist.trim()+' '+album.trim())+"&i=digital-music&bbn=163856011&rh=p_n_feature_browse-bin%3A625150011";
        a.innerHTML = 'Amazon';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulLeft.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://www.cdandlp.com/en/search/?q="+encodeURIComponent(artist.trim()+' '+album.trim());
        a.innerHTML = 'CDandLP';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulRight.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://redacted.ch/torrents.php?searchstr="+encodeURIComponent(artist.trim()+' '+album.trim());
        a.innerHTML = 'RED';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulRight.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://www.google.com/search?q="+encodeURIComponent('"'+artist.trim()+'" "'+album.trim()+'"');
        a.innerHTML = 'Google';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulRight.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://www.google.com/search?q="+encodeURIComponent(artist.trim()+' '+album.trim()+" site:deezer.com");
        a.innerHTML = 'Google Deezer';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulRight.appendChild(tempLi);

        a=document.createElement('a');
        a.href="https://www.deezer.com/search/"+encodeURIComponent(artist.trim()+' '+album.trim());
        a.innerHTML = 'Deezer US';
        a.target = '_blank';
        tempLi = document.createElement('li');
        tempLi.appendChild(a)
        ulRight.appendChild(tempLi);

        d1.appendChild(ulLeft);
        d1.appendChild(ulRight);

        var year=document.getElementsByClassName('head');
        for(var i=0; i<year.length; i++)
        {
            if(year[i].innerHTML.indexOf('Released')!==-1)
            {
                year=year[i].nextElementSibling.textContent.trim().split(' ');
                year=year[year.length-1];
                break;
            }
        }


        //add track specific youtube search links
        var track_list = document.querySelectorAll('span.tracklist_track_title');
        //var track_list = document.querySelectorAll('td.tracklist_track_pos');
        var artist_list = document.querySelectorAll('td.tracklist_track_artists');

        console.log(track_list);
        var track_name = '';
        var youtube_link = '';

        //for each track element, create the link
        for(i=0; i<track_list.length; i++)
        {
            if (artist_list.length > 0){
                artist = artist_list[i].childNodes[1].innerHTML;
            }
            track_name = track_list[i].innerHTML;
            a=document.createElement('a');
            a.href="https://www.youtube.com/results?search_query="+encodeURIComponent('"'+artist.trim()+'"'+' '+'"'+track_name.trim()+'"');
            a.innerHTML = '->';
            a.target = '_blank';
            track_list[i].appendChild(a)
        }

    }
})();
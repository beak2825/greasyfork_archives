// ==UserScript==
// @name         Discogs/Release/SearchLinks+EmbedStats
// @version      2.0
// @description  Link to a search pages
// @author       denlekke
// @include      http*://*discogs.com/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/428728/DiscogsReleaseSearchLinks%2BEmbedStats.user.js
// @updateURL https://update.greasyfork.org/scripts/428728/DiscogsReleaseSearchLinks%2BEmbedStats.meta.js
// ==/UserScript==

window.addEventListener("load", function(event) {
    searchlinks()
    embedstats()
});

function embedstats() {
    'use strict';

    var $ = window.jQuery;


    var darkmode = false;
    if(darkmode){
        document.body.style.backgroundColor = "#121212";
        document.body.style.color = "white";
        document.body.style.opacity = "75%";
        $('a').css('color', 'green');
    }
    //add right side padding the right hand info column
    $('.side_3-xID').css('marginRight', '10px');
    //stats embedding
    if(window.location.href.includes("/release/")|window.location.href.includes("/master/") &! window.location.href.includes("/stats/")){
        //get release id from url (used to create ratings url)
        var releaseIdStats = ''
        var release_id = 0
        var iframeLink = ''
        if(window.location.href.includes("release/")){
            releaseIdStats=parseInt(window.location.href.split('release/')[1]);
            release_id=parseInt(window.location.href.split('release/')[1]);
            iframeLink = 'https://www.discogs.com/release/stats/'+releaseIdStats;
        }
        else{
            releaseIdStats=parseInt(window.location.href.split('master/')[1]);
            iframeLink = 'https://www.discogs.com/master/stats/'+releaseIdStats;
        }

        //divide the page
        var row = document.createElement('div');
        row.setAttribute('id', 'row');
        row.setAttribute('class', 'row');
        var colR = document.createElement('div');
        colR.setAttribute('id', 'colR');
        colR.setAttribute('class', 'colR');
        colR.setAttribute('style','float:right; width: 80%;height: 100%; overflow:hidden; margin-left:0px;');
        var colL = document.createElement('ratings');
        colL.setAttribute('id', 'colL');
        colL.setAttribute('class', 'colL');
        colL.setAttribute('style','float:left; width: 20%;height: 100%; margin-top:0px; overflow:hidden;');
        colL.setAttribute('scrolling', 'yes');

        row.appendChild(colL);
        row.appendChild(colR);

        //place entire row
        var root_element = document.getElementsByClassName('root_2aII_')[0];
        var header_element = document.getElementsByClassName('header_2TYJF')[0];
        var search_element = document.getElementsByClassName('search_1Ms28 search_3dQh3')[0];
        //search_element.style.marginLeft = 'px';
        var discogs_logo_element = document.getElementsByClassName('link_1ctor logo_2EgN2')[0];
        discogs_logo_element.style.marginLeft = '8px';
        discogs_logo_element.style.marginRight = '0px';
        //discogs_logo_element.style.marginRight = '10.6%';
        header_element.childNodes[0].style.marginLeft = '0';
        header_element.childNodes[0].style.padding = '0';
        //header_element.childNodes[0].style.paddingLeft = '2px';
        header_element.appendChild(row, header_element);
        search_element.style.left = '-120px';
        //search_element.style.marginRight = '120px';
        search_element.style.marginLeft = '21.5%';
        var profile_element = document.getElementsByClassName('profile_2xwkL')[0];
        profile_element.style.marginRight = '-80px';
        var profile_dropdown_element = document.getElementsByClassName('dropdown_3tXuz')[0];
        profile_dropdown_element.style.zIndex = '100';
        var drop_down_search_element = document.getElementsByClassName('dropdown_KJhVE')[0];
        console.log(drop_down_search_element.style.zIndex);
        drop_down_search_element.style.zIndex = '100';

        //stuff to put in right column of row (the regular discogs page)
        var page = document.getElementsByClassName('content_pzwez')[0];
        var page_content = page.childNodes[0]
        page_content.setAttribute('style','padding:0');
        //page_content.setAttribute('style','padding:0');
        page_content.style.marginTop = '10px';
        page.className = 'aside_right';
        page.setAttribute('style', 'margin: unset !important');
        colR.appendChild(page, colR);


        //var pushfooter = document.getElementById('push_footer');
        //colR.appendChild(pushfooter, colR);

        var footer = document.getElementById('site_footer_wrap');
        colR.appendChild(footer, colR);

        //stuff to put in left column of row (ratings page)
        var ifrm = document.createElement('iframe');

        ifrm.setAttribute('src', iframeLink);
        ifrm.setAttribute('id', 'stats_iframe');
        var colRHeight = colR.scrollHeight;
        //var colRHeight = window.innerHeight - 55;
        ifrm.setAttribute('style','width: 102%; height: '+colRHeight+'px; margin-top:0px; margin-left:7px;visibility:hidden;');

        ifrm.setAttribute('frameborder', '0');
        ifrm.setAttribute('overflow-y', 'hidden');
        ifrm.setAttribute('overflow-x', 'hidden');

        ifrm.addEventListener("load", ev => {

            var iframeDocument = document.getElementById('stats_iframe').contentDocument;
            if (darkmode){
                $('a').css('color', 'green');
                iframeDocument.body.style.backgroundColor = "#121212";
                iframeDocument.body.style.color = "white";
            }
            var statsGroups = iframeDocument.querySelectorAll(".release_stats_group");

            //Discogs Enhancer dark theme detection and application to stats iframe
            if(document.querySelector("html").className.includes("de-dark-theme")){
                var mainCssText = getComputedStyle(document.body).cssText;
                iframeDocument.body.style.cssText = mainCssText;
                iframeDocument.documentElement.classList.add('de-dark-theme');
                //iframeDocument.documentElement.appendChild(link);

                var cssLink = document.createElement("link");
                cssLink.href = "https://raw.githubusercontent.com/salcido/discogs-enhancer/master/css/dark-theme.scss";
                //cssLink.rel = "stylesheet";
                //cssLink.type = "text/css";
                frames[0].document.head.appendChild(cssLink);
            }

            if (statsGroups != null){
                var htmlOutput = '';
                var htmlRatings = '';
                var htmlHaves = '';
                var htmlWants = '';

                for (var j =0; j < statsGroups.length; j++){
                    var content = ''
                    var groupInnerText = statsGroups[j].innerText;
                    var groupInnerHTML = statsGroups[j].innerHTML;

                    if(groupInnerText.includes(' have this')){
                        content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                        htmlHaves += '<h3>Have</h3>';
                        htmlHaves += content;

                        //metacogs
                        var haveParent = statsGroups[j].querySelectorAll(".release_stats_group_list")[0]
                        var haveList = haveParent.querySelectorAll(".linked_username");
                        console.log(haveList);
                        for(var s=0; s < haveList.length; s++){
                            username = haveList[s].innerText;
                            //store the rating to database
                            if(release_id != 0){
                                console.log(release_id+username+1);
                                GM_xmlhttpRequest ( {
                                    method:     "POST",
                                    url:        "http://denlekke.aphrodite.feralhosting.com:5000/have_list",
                                    data:       "release_id=" +release_id+"&username="+username+"&have=1",
                                    headers:    {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    onload:     function (response) {
                                        alert(response);
                                        var json = $.parseJSON(response);
                                    }
                                } );
                            }
                        }
                    }
                    else if(groupInnerText.includes(' want this')){
                        content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                        htmlWants += '<h3>Want</h3>';
                        htmlWants += content;

                        //metacogs
                        var wantParent = statsGroups[j].querySelectorAll(".release_stats_group_list")[0]
                        var wantList = wantParent.querySelectorAll(".linked_username");
                        console.log(wantList);
                        for(var z=0; z < wantList.length; z++){
                            username = wantList[z].innerText;
                            //store the rating to database
                            if(release_id != 0){
                                console.log(release_id+username+1);
                                GM_xmlhttpRequest ( {
                                    method:     "POST",
                                    url:        "http://denlekke.aphrodite.feralhosting.com:5000/want_list",
                                    data:       "release_id=" +release_id+"&username="+username+"&want=1",
                                    headers:    {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    onload:     function (response) {
                                        alert(response);
                                        var json = $.parseJSON(response);
                                    }
                                } );
                            }
                        }
                    }
                    else if(groupInnerText.includes(' Rating')){
                        content = statsGroups[j].querySelectorAll(".release_stats_group_list")[0];

                        var fiveRaters = [];
                        var fourRaters = [];
                        var threeRaters = [];
                        var twoRaters = [];
                        var oneRaters = [];

                        var ratingsList = content.querySelectorAll("li");

                        for(var q=0; q < ratingsList.length; q++){
                            var rating;
                            var username;
                            if(ratingsList[q].childNodes[3]){
                                rating = ratingsList[q].childNodes[3].getAttribute('data-value');
                                username = ratingsList[q].querySelectorAll(".linked_username")[0].innerText;
                            }
                            else{
                                rating = 0;
                            }
                            //console.log(rating);
                            if(rating === '1'){
                                oneRaters.push(ratingsList[q]);
                            }
                            else if(rating === '2'){
                                twoRaters.push(ratingsList[q]);
                            }
                            else if(rating === '3'){
                                threeRaters.push(ratingsList[q]);
                            }
                            else if(rating === '4'){
                                fourRaters.push(ratingsList[q]);
                            }
                            else if(rating === '5'){
                                fiveRaters.push(ratingsList[q]);
                            }

                            //store the rating to database
                            if(release_id != 0 && rating != 0){
                                console.log(release_id+username+rating);
                                GM_xmlhttpRequest ( {
                                    method:     "POST",
                                    url:        "http://denlekke.aphrodite.feralhosting.com:5000/rating",
                                    data:       "release_id=" +release_id+"&username="+username+"&rating="+rating,
                                    headers:    {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    onload:     function (response) {
                                        alert(response);
                                        var json = $.parseJSON(response);
                                    }
                                } );
                            }

                        }
                        content = ''
                        for (var ratinghtml of fiveRaters){
                            var temp = ratinghtml.innerHTML;
                            content += ratinghtml.outerHTML;
                        }
                        for (ratinghtml of fourRaters){
                            temp = ratinghtml.innerHTML;
                            content += ratinghtml.outerHTML;
                        }
                        for (ratinghtml of threeRaters){
                            temp = ratinghtml.innerHTML;
                            content += ratinghtml.outerHTML;
                        }
                        for (ratinghtml of twoRaters){
                            temp = ratinghtml.innerHTML;
                            content += ratinghtml.outerHTML;
                        }
                        for (ratinghtml of oneRaters){
                            temp = ratinghtml.innerHTML;
                            content += ratinghtml.outerHTML;
                        }

                        htmlRatings += '<h3>Rating</h3>';
                        htmlRatings += "<ul>"+content+"</ul>";
                    }
                }

                if (htmlWants === ''){
                    htmlWants = '<h3>WANT</h3><ul>No information available</ul>';
                }
                if (htmlHaves === ''){
                    htmlHaves = '<h3>HAVE</h3><ul>No information available</ul>';
                }
                if (htmlRatings === ''){
                    htmlRatings = '<h3>RATING</h3><ul>No information available</ul>';
                }

                var main = iframeDocument.body;
                htmlOutput = htmlRatings+htmlHaves+htmlWants;
                main.innerHTML = htmlOutput;
                main.style.minWidth = 'unset';

                //make iframe visible
                ifrm.setAttribute('style','width: 102%; height: '+colRHeight+'px; margin-top:0px; margin-left:7px;background-color:#323334;visibility:visible;');
            }
        })

        colL.appendChild(ifrm, colL);
    }
}

function searchlinks() {
    'use strict';

    //var json_element=document.getElementById('release_schema');
    var artist = document.getElementsByClassName('link_1ctor link_15cpV')[0].text;
    //json_element = JSON.parse(json_element.text);
    //var album_name = json_element.name;
    var album = document.getElementsByClassName('header_3FV2N')[0].innerText.split(' – ')[1];
    console.log(album);
    //var artist=json_element.releaseOf.byArtist[0].name.trim()
    if(album)
    {
        //var album = album_name.trim()
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
}
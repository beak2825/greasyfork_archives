// ==UserScript==
// @name         Discogs/EmbedStats/test
// @namespace    https://greasyfork.org/en/scripts/397867-discogs-embedstats
// @version      1.4
// @description  embed stats page on left side of release page
// @author       denlekke
// @match        http*://www.discogs.com/*release/*
// @match        http*://www.discogs.com/*master/*
// @exclude      http*://www.discogs.com/*/stats/*
// @exclude      http*://www.discogs.com/sell/release/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430993/DiscogsEmbedStatstest.user.js
// @updateURL https://update.greasyfork.org/scripts/430993/DiscogsEmbedStatstest.meta.js
// ==/UserScript==



window.addEventListener("load", function(event) {
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
        colL.setAttribute('style','float:left; width: 20%;height: 100%; margin-top:60px; overflow:hidden;');
        colL.setAttribute('scrolling', 'yes');

        row.appendChild(colL);
        row.appendChild(colR);

        //place entire row
        var root_element = document.getElementsByClassName('root_2aII_')[0];
        var header_element = document.getElementsByClassName('header_2TYJF')[0];
        var header_bar = document.getElementsByClassName('content_3oPo5')[0];
        header_bar.style.marginLeft = '0px';
        header_bar.style.paddingLeft = '14px';
        colR.appendChild(header_bar, colR);
        var search_element = document.getElementsByClassName('search_1Ms28 search_3dQh3')[0];

        header_element.appendChild(row, header_element);

        var profile_element = document.getElementsByClassName('profile_2xwkL')[0];
        profile_element.style.marginRight = '-80px';
        var profile_dropdown_element = document.getElementsByClassName('dropdown_3tXuz')[0];
        if(profile_dropdown_element){
            profile_dropdown_element.style.zIndex = '100';
        }
        var drop_down_search_element = document.getElementsByClassName('dropdown_KJhVE')[0];
        console.log(drop_down_search_element.style.zIndex);
        drop_down_search_element.style.zIndex = '100';

        //stuff to put in right column of row (the regular discogs page)
        var page = document.getElementsByClassName('content_pzwez')[0];
        var page_content = page.childNodes[0]
        page_content.setAttribute('style','padding:0');

        page_content.style.marginTop = '10px';
        page_content.style.marginLeft = '12px';
        page.className = 'aside_right';
        page.setAttribute('style', 'margin: unset !important');
        colR.appendChild(page, colR);

        var footer = document.getElementById('site_footer_wrap');
        colR.appendChild(footer, colR);

        //stuff to put in left column of row (ratings page)
        var ifrm = document.createElement('iframe');

        ifrm.setAttribute('src', iframeLink);
        ifrm.setAttribute('id', 'stats_iframe');
        var colRHeight = colR.scrollHeight;

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

                        //htmlRatings += '<h3>Rating</h3>';
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
                main.style.backgroundColor = '#323334';
                $('a').css({
                    color: '#829fc4'
                });
                $('a').css('color', '#829fc4');

                var links = iframeDocument.getElementsByTagName("a");
                for(var i=0;i<links.length;i++)
                {
                    if(links[i].href)
                    {
                        links[i].style.color = '#829fc4';
                    }
                }


                main.style.minWidth = 'unset';

                //make iframe visible
                ifrm.setAttribute('style','width: 102%; height: '+colRHeight+'px; margin-top:0px; margin-left:7px;background-color:#323334;visibility:visible;');
            }
        })

        colL.appendChild(ifrm, colL);
    }
}

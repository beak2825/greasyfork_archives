// ==UserScript==
// @name         Discogs/EmbedStats/TEST
// @namespace    https://greasyfork.org/en/scripts/448764
// @version      1.03
// @description  embed stats page on left side of release page
// @author       denlekke
// @match        http*://www.discogs.com/*release/*
// @match        http*://www.discogs.com/*master/*
// @exclude      http*://www.discogs.com/*/stats/*
// @exclude      http*://www.discogs.com/*/videos/update*
// @exclude      http*://www.discogs.com/sell/release/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/477729/DiscogsEmbedStatsTEST.user.js
// @updateURL https://update.greasyfork.org/scripts/477729/DiscogsEmbedStatsTEST.meta.js
// ==/UserScript==



window.addEventListener("load", function(event) {
    embedstats()
});

function embedstats() {
    'use strict';

    var $ = window.jQuery;


    var darkmode = false;
    if (document.getElementsByClassName('de-dark-theme').length > 0){
        darkmode = true;
    }
    /*
    console.log(darkmode)
    if(darkmode){
        document.body.style.backgroundColor = "#323334";
        document.body.style.color = "white";
    }*/

//this breaks when not logged in via red
    //var main_root = document.querySelector('.de-release');
    var main_root = document.getElementById('app');

    // Create the left column (20%)
    var colL = document.createElement('div');
    colL.setAttribute('id', 'colL');
    colL.setAttribute('class', 'colL');
    colL.setAttribute('style', 'float: left; width: 20%; height: 100%; margin-top: 0; overflow: hidden;');

    // Create the middle column (60%)
    var colM = document.createElement('div');
    colM.setAttribute('id', 'colM');
    colM.setAttribute('class', 'colM');
    colM.setAttribute('style', 'float: left; width: 80%; height: 100%; margin-top: 0; overflow: hidden;');
/*
    // Create the right column (20%)
    var colR = document.createElement('div');
    colR.setAttribute('id', 'colR');
    colR.setAttribute('class', 'colR');
    colR.setAttribute('style', 'float: left; width: 20%; height: 100%; margin-top: 0; overflow: hidden;');

        //move right column content to the new container
    var asideRightContent = document.querySelector('.aside_right');
    if (asideRightContent) {
        colM.appendChild(asideRightContent);
    }
    */

    //move center column content to the new container
        var centerContent = document.querySelector('.c_amped_1bai0_1 light');
    if (centerContent) {
        colM.appendChild(centerContent);
    }




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

        console.log(iframeLink);
        //divide the page
        var original_page = document.getElementsByClassName("root_2aII_")[0];
        //removed on 2023-6-14
        original_page.setAttribute('style','margin-left:0%;');
        var original_header = document.getElementsByClassName("content_3oPo5")[0];
        original_header.setAttribute('style','margin-left:20%;padding-left:14px;');
/*
        var colL = document.createElement('ratings');
        colL.setAttribute('id', 'colL');
        colL.setAttribute('class', 'colL');
        colL.setAttribute('style','float:left; width: 20%;height: 100%; margin-top:0px; overflow:hidden;');
        colL.setAttribute('scrolling', 'yes');

        var colR = document.createElement('original_content');
        colR.setAttribute('id', 'colR');
        colR.setAttribute('class', 'colR');
        colR.setAttribute('style','float:left; width: 80%;height: 100%; margin-top:0px; overflow:hidden;');
        colR.setAttribute('scrolling', 'yes');
*/
        //place entire row
        var root_element = document.getElementsByClassName('de-release')[0];
        var header_element = document.getElementsByClassName('header_2TYJF')[0];

        var search_element = document.getElementsByClassName('search_1Ms28 search_3dQh3')[0];

        original_page.parentNode.insertBefore(colL, original_page);
/*
        var profile_element = document.getElementsByClassName('profile_2xwkL')[0];
        if (profile_element) {
            profile_element.style.marginRight = '-80px';
        }
*/
        var profile_dropdown_element = document.getElementsByClassName('dropdown_3tXuz')[0];
        if(profile_dropdown_element){
            profile_dropdown_element.style.zIndex = '100';
        }
        var drop_down_search_element = document.getElementsByClassName('dropdown_KJhVE')[0];
        if (drop_down_search_element){
            console.log(drop_down_search_element.style.zIndex);
            drop_down_search_element.style.zIndex = '100';
        }
        //stuff to put in right column of row (the regular discogs page)
        var page = document.getElementsByClassName('content_pzwez')[0];
        //var page_content = page.childNodes[0]
        var page_content = document.getElementsByClassName('content_3oPo5')[1];
        page_content.setAttribute('style','padding:0');

        page_content.style.marginTop = '10px';
        page_content.style.marginLeft = '12px';
        page.className = 'aside_right';
        page.setAttribute('style', 'margin: unset !important');

        //add margin to right side of the header bar so the user page icon isn't too far right
        var icons_section = document.getElementsByClassName('icons_3Fewb')[0];
        if (icons_section){
            icons_section.style.marginRight = '50px';
        }
        //stuff to put in left column of row (ratings page)
        var ifrm = document.createElement('iframe');

        ifrm.setAttribute('src', iframeLink);
        ifrm.setAttribute('id', 'stats_iframe');
        //var colRHeight = colR.scrollHeight;

        var iframe_width = colL.offsetWidth;
        ifrm.setAttribute('style','margin-top:0px; margin-left:7px;visibility:hidden;width:'+iframe_width+'px;');

        ifrm.setAttribute('frameborder', '0');
        ifrm.setAttribute('overflow-y', 'hidden');
        ifrm.setAttribute('overflow-x', 'hidden');
        console.log(ifrm);

        ifrm.addEventListener("load", ev => {
            console.log("stats page load");

            var iframeDocument = document.getElementById('stats_iframe').contentDocument;
            /*
            if (darkmode){
                //$('a').css('color', 'green');
                iframeDocument.body.style.backgroundColor = "#323334";
                iframeDocument.body.style.color = "white";
            }*/
            var statsGroups = iframeDocument.querySelectorAll(".release_stats_group");

            //Discogs Enhancer dark theme detection and application to stats iframe
            if(document.querySelector("html").className.includes("de-dark-theme")){
                var mainCssText = getComputedStyle(document.body).cssText;
                iframeDocument.body.style.cssText = mainCssText;
                iframeDocument.documentElement.classList.add('de-dark-theme');

                var cssLink = document.createElement("link");
                cssLink.href = "https://raw.githubusercontent.com/salcido/discogs-enhancer/master/css/dark-theme.scss";
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
                    console.log(groupInnerText);

                    if(groupInnerText.includes(' have this')){
                        content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                        htmlHaves += '<h3>Have</h3>';
                        htmlHaves += content;
                    }
                    else if(groupInnerText.includes(' want this')){
                        content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                        htmlWants += '<h3>Want</h3>';
                        htmlWants += content;
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
                var ifrm_height = original_page.offsetHeight;
                htmlOutput = htmlRatings+htmlHaves+htmlWants;
                main.innerHTML = htmlOutput;
                main.style.marginLeft = '7px';
                main.style.width = iframe_width-6+'px';
                main.style.minWidth = iframe_width-6+'px';
                //main.style.height = ifrm_height+'px';
                if (darkmode){
                    main.style.backgroundColor = '#323334';

                    var elements = main.getElementsByTagName("a");
                    for(var j=0;j<elements.length;j++)
                    {
                        if(elements[j].href.includes('/user/')){
                            elements[j].style.color = '#829FC4';
                        }
                    }

                    var elements = main.getElementsByTagName("h3");
                    for(var j=0;j<elements.length;j++)
                    {
                        elements[j].style.color = '#CCCCCC';
                    }
                    var elements = main.getElementsByTagName("ul");
                    for(var j=0;j<elements.length;j++)
                    {
                        elements[j].style.color = '#CCCCCC';
                    }
                }
                //make iframe visible

                ifrm.style = ifrm.style+'visibility:visible;width:107%;height:'+ifrm_height+'px;';
                //main.style.height = ifrm_height+17+'px;'
            }
        })
        colL.appendChild(ifrm, colL);
        console.log(colL);

    }
    // Find the element to be removed
var siteFooterWrap = document.querySelector('.footer_3-cC_');
siteFooterWrap.style = siteFooterWrap.style+'visibility:none;display:hidden;';



        // Append the columns to the DOM
    //main_root.insertBefore(colR,main_root.firstChild);
    main_root.insertBefore(colM,main_root.firstChild);
    colM.style.backgroundColor = '#323334';
    main_root.insertBefore(colL,main_root.firstChild);
            var style = document.createElement('style');
        style.innerHTML = `
    @media (max-width: 768px) {
        .colL {
            width: 100%;
        }
        .colM {
            width: 100%;
        }
        .colR {
            width: 100%;
        }
    }
    @media (min-width: 769px) and (max-width: 1024px) {
        .colL {
            width: 30%;
        }
        .colM {
            width: 40%;
        }
        .colR {
            width: 30%;
        }
    }
    /* Add more media queries for different screen sizes as needed */
`;
        document.head.appendChild(style);
}

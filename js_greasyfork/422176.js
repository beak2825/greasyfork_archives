// ==UserScript==
// @name         Sonarr & Radarr Link Adder
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      3.1
// @description  Adds links to specified series on the table view
// @author       Bunta
// @include      http://localhost:8989/*
// @include      http://localhost:7878/*
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422176/Sonarr%20%20Radarr%20Link%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/422176/Sonarr%20%20Radarr%20Link%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // define what links to add to series/movie on the table list
    // these links will appear as icons to the right of the specified series' or movies' names
    // syntax: [Title, URL, icon] Note: Title must match the series/movie title in the list
    let tableLinks = [
        ['Tokyo Revengers', 'https://nyaa.si/?f=0&c=0_0&q=tokyo+revengers+dual', 'https://nyaa.si/static/favicon.png'],
    ];

    // define what links to add to the "Links" menu for all series/movies
    // syntax: [Link Title, URL]
    // URL can use following substitutions:
    //    {title} - Link Title
    let menuLinks = [
        ['MyAnimeList', 'https://myanimelist.net/anime.php?q={title}'],
    ];

    var tableArray = [];
    tableLinks.forEach(item => {tableArray.push(item[0])});

    var menuArray = [];
    menuLinks.forEach(item => {menuArray.push(item[0])});

    // Options for the observer (which mutations to observe: attributes, childList, subtree, characterData)
    const config = { attributes: false, characterData: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {

        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log(mutation);
                //console.log(mutation.target.classList);

                // Adding initial links on series table view page load
                if (mutation.target.classList.length > 0 && (mutation.target.classList[0].contains('root') || mutation.target.classList[0].contains('Page-main-Swphf'))) {
                    $(mutation.target).find('a').filter(function() { return tableArray.includes($(this).text()) && $(this).parent().find('a').length < 2 }).each( function(index) {
                        //console.log( $( this ).text() );
                        tableLinks.forEach(item => {
                            if (item[0] == $(this).text())
                                $( '<a href="' + item[1] + '" target="_blank"><img src="' + item[2] + '" width=25 height=20 style="padding:0 5px 0 0;">' ).insertBefore(this);
                        });
                    });
                }

                // Adding links to series table view when scrolling table
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.classList.length > 0 && (node.classList[0].contains('SeriesIndexTable-row-mcybv') || node.classList[0].contains('MovieIndexTable-row-MZIas'))) {
                            $(node).find('a').filter(function() { return tableArray.includes($(this).text()) && $(this).parent().find('a').length < 2 }).each( function(index) {
                                //console.log( $( this ).text() );
                                tableLinks.forEach(item => {
                                    if (item[0] == $(this).text())
                                        $( '<a href="' + item[1] + '" target="_blank"><img src="' + item[2] + '" width=25 height=20 style="padding:0 5px 0 0;">' ).insertBefore(this);
                                });
                            });
                        }
                    });
                }

                // Adding links to "Links" shortcuts on series view
                if (mutation.target.classList.length > 0) {
                    if (menuLinks.length > 0 && mutation.target.classList[0].contains('Tooltip-tooltipContainer-gDO7_')) {
                        var linkClass = 'SeriesDetailsLinks-link-RfjeR Link-link-RInnp Link-to-kylTi'
                        var spanClass = 'SeriesDetailsLinks-linkLabel-SAKtg Label-label-DYldh Label-info-QWFsu Label-large-qZ9AP'
                        var links = $(mutation.target).find('div.SeriesDetailsLinks-links-cHw2_');
                        if (links.length === 0) {
                            linkClass = 'MovieDetailsLinks-link-RA9Kf Link-link-RInnp Link-to-kylTi'
                            spanClass = 'MovieDetailsLinks-linkLabel-GGMIV Label-label-DYldh Label-info-QWFsu Label-large-qZ9AP'
                            links = $(mutation.target).find('div.MovieDetailsLinks-links-eFF77');
                        }
                        //console.log("Links: " + links.length);
                        if (links.length === 0) continue;
                        if (links.find('a').filter(function() { return menuArray.includes($(this).text()) }).length > 0) continue;
                        var itemTitle = $('div.SeriesDetails-title-pJv1g,div.MovieDetails-title-yaEzx span').text();
                        if (!itemTitle) continue;
                        menuLinks.forEach(item => {
                            links.append( '<a target="_blank" href="'+item[1].replace('{title}', itemTitle)+'" class="'+linkClass+'"><span class="'+spanClass+'">'+item[0]+'</span></a>');
                        });
                    }
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(document.body, config);

    // Later, you can stop observing
    //observer.disconnect();

})();
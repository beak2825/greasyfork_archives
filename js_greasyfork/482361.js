// ==UserScript==
// @name         MyAnimeList's Customizable Anime Page Cleaner
// @description  A barely functional script to get rid of useless stuff from my anime list anime page, like the holy opinion of some zoomer weebs.
// @namespace    https://ko-fi.com/mugenrei
// @match        *://myanimelist.net/anime/*
// @license  WTFPL
// @version  1.0
// @author   mugenrei
//
// @downloadURL https://update.greasyfork.org/scripts/482361/MyAnimeList%27s%20Customizable%20Anime%20Page%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/482361/MyAnimeList%27s%20Customizable%20Anime%20Page%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // The add to list and score for YOU to give will still be available ;).
    var classListToCheckRight = [];
    //comment out to enable episode videos, streaming platform ad.
    classListToCheckRight.push("episode_video;anime-slide-block", "anime-detail-header-video")
    //comment out to enable Statistics Block, if you care.
    classListToCheckRight.push("stats-block")
    //comment out to enable MALxJapan, MyAnimeList is not Japanese.
    classListToCheckRight.push("widget-content")
    //comment out to enable reviews, if you care about mostly western ramblings about fan service.
    classListToCheckRight.push("anime-info-review__header", "review-element")
    //comment out to enable stacks, social gimmick, useless to inform about the anime.
    classListToCheckRight.push("detail-stack-block")
    //comment out to enable recommendations, can be useful to find similar anime.
    classListToCheckRight.push("anime_recommendation;anime-slide-block")
    //comment out to enable forum discussions, useless.
    classListToCheckRight.push("page-forum")
    //comment out to enable Recent News, broken for now, don't disable it.
    // classListToCheckRight.push("clearfix")

    var classListToCheckLeft = [];
    //comment out to enable watch button, again streaming platform ad.
    classListToCheckLeft.push("broadcast-block;di-b", "anime-detail-header-video")
    //comment out to enable social sharing buttons, useless.
    classListToCheckLeft.push("js-sns-icon-container")
    //comment out to enable Streaming Platforms, ads.
    classListToCheckLeft.push("broadcasts")
    //comment out to enable Statistics, you care?
    classListToCheckLeft.push("Stats", "Score¶spaceit_pad", "Ranked¶spaceit_pad", "Popularity¶spaceit_pad", "Members¶spaceit_pad", "Favorites¶spaceit_pad", "Score¶spaceit_pad")

    //set false to enable Footer
    const removeFooter = true
    //set false to enable HorizontalNav
    const removeHorizontalNav = false

    // Find the div with class "rightside"
    const rightsideDiv = document.querySelector('div.rightside');
    // Find the div with class "rightside"
    const leftsideDiv = document.querySelector('div.leftside');

    const footer = document.querySelector('footer');

    // Check if the div is found
    if (rightsideDiv) {
        if (removeHorizontalNav) {
            const nav = rightsideDiv.querySelector('#horiznav_nav')
            nav.remove();
        }
        // Find the table inside the div
        const table = rightsideDiv.querySelector('table');

        // Check if the table is found
        if (table) {
            // Find the tbody inside the table
            const tbody = table.querySelector('tbody');

            // Check if tbody is found
            if (tbody) {
                // Get all child nodes of the tbody
                const tbodyChildren = tbody.childNodes;

                // Filter only the tr elements from the child nodes
                const trElements = Array.from(tbodyChildren).filter(node => node.tagName === 'TR');

                // Loop through each tr element and print it
                trElements.forEach((tr, index) => {
                    // console.log(`Row ${index + 1}:`, tr.innerHTML);

                    // Check for div elements within the tr
                    const divElements = tr.querySelectorAll('div');
                    // Check for h2 elements within the tr
                    const h2Elements = tr.querySelectorAll('h2');
                    // Check for h2 elements within the tr
                    const aElements = tr.querySelectorAll('a');

                    // Loop through each div element and check for classes
                    divElements.forEach((div, divIndex) => {
                        const divClasses = Array.from(div.classList);

                        // Check if any class in the div is in the classListToCheckRight
                        const hasMatchingClass = classListToCheckRight.some(className => {
                            // Check if the class name contains a separator

                            if (className.includes(';')) {
                                const [id, classToCheck] = className.split(';');
                                return div.id == id && divClasses.includes(classToCheck);
                            } else {
                                return divClasses.includes(className);
                            }
                        });

                        if (hasMatchingClass) {
                            console.log(`Div ${divIndex + 1} inside Row ${index + 1} has a matching class:`, divClasses);

                            // Remove the div element from the DOM
                            div.remove();
                        }
                    });

                    // Loop through each div element and check for classes
                    h2Elements.forEach((h2, h2Index) => {
                        // const divClasses = Array.from(h2.classList);

                        if (classListToCheckRight.includes('episode_video') && h2.innerHTML.includes('Episode Videos')) {
                          h2.remove();
                        }
                        if (classListToCheckRight.includes('anime-info-review__header') && h2.innerHTML.includes('Reviews')) {
                          h2.remove();
                        }
                        if (classListToCheckRight.includes('detail-stack-block') && h2.innerHTML.includes('Interest Stacks')) {
                          h2.remove();
                        }
                        if (classListToCheckRight.includes('recommendation') && h2.innerHTML.includes('Recommendations')) {
                          h2.remove();
                        }
                        if (classListToCheckRight.includes('page-forum') && h2.innerHTML.includes('Recent Forum Discussion')) {
                          h2.remove();
                        }
                        if (classListToCheckRight.includes('clearfix') && h2.innerHTML.includes('Recent News')) {
                          h2.remove();
                        }
                    });

                    // Loop through each div element and check for classes
                    aElements.forEach((a, aIndex) => {
                        const aClasses = Array.from(a.classList);

                        if (classListToCheckRight.includes('recommendation') && aClasses.includes('btn-detail')) {
                          a.remove();
                        }
                    });

                });
            } else {
                console.error('Tbody not found inside the table');
            }
        } else {
            console.error('Table not found inside the div with class "rightside"');
        }
    } else {
        console.error('Div with class "rightside" not found');
    }

    if (leftsideDiv) {
        // Check for div elements within the tr
        const divElements = leftsideDiv.querySelectorAll('div');
        // Check for h2 elements within the tr
        const h2Elements = leftsideDiv.querySelectorAll('h2');

        // Loop through each div element and check for classes
        divElements.forEach((div, divIndex) => {
            const divClasses = Array.from(div.classList);

            // Check if any class in the div is in the classListToCheckLeft
            const hasMatchingClass = classListToCheckLeft.some(className => {
                // Check if the class name contains a separator

                if (className.includes(';')) {
                    const [id, classToCheck] = className.split(';');
                    return div.id == id && divClasses.includes(classToCheck);
                } else if (className.includes('¶')){
                    const [text, classToCheck] = className.split('¶');
                    const span = div.querySelector('span')

                    if (span && span.innerHTML.includes(text)) {
                        return span.innerHTML.includes(text) && divClasses.includes(classToCheck);
                    }
                }
                else {
                    return divClasses.includes(className);
                }
            });

            if (hasMatchingClass) {
                // Remove the div element from the DOM
                div.remove();
            }
        });

        // Loop through each div element and check for classes
        h2Elements.forEach((h2, h2Index) => {
            if (classListToCheckLeft.includes('broadcasts') && h2.innerHTML.includes('Streaming Platforms')) {
              h2.remove();
            }
            if (classListToCheckLeft.includes('Stats') && h2.innerHTML.includes('Statistics')) {
              h2.remove();
            }
        });

    } else {
        console.error('Div with class "rightside" not found');
    }

    if (footer && removeFooter) {
      footer.remove();
    }
})();


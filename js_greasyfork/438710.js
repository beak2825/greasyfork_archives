// ==UserScript==
// @name         EDHRec Pioneer Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       bjcolber
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @description  Filter EDHRec results to only show Pioneer legal cards
// @grant        none
// @include      https://edhrec.com/cards/*
// @include      https://edhrec.com/commanders/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438710/EDHRec%20Pioneer%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/438710/EDHRec%20Pioneer%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = ms => new Promise(r => setTimeout(r, ms));
    const origFetch = window.fetch;

    const legalityMap = {}
    window.fetch = async (...args) => {

        if(args[0].includes("json.edhrec.com")) {
            const response = await origFetch(...args);
            const data = await response.clone().json();

            //const cardlists = data.container.json_dict.cardlists;

            const filteredCardLists = await Promise.all(data.container.json_dict.cardlists.map( async(cardList) => {
                const {cardviews, header, tags} = cardList;


                const promises = cardviews.map((card) => {
                     return delay(500)
                         .then(() => {
                            const cardname = card.name.split("//")[0].trim();
                            return origFetch(`https://api.scryfall.com/cards/named?exact=${cardname}`)
                         })
                         .then(resp => resp.json())
                });

                const scryFallCards = await Promise.all(promises);
                const cardMap = scryFallCards.reduce((acc, curr) => {
                    if(curr.name) {
                        acc[curr.name] = curr;
                    }
                    return acc;

                }, {});



                const filteredCardviews = cardviews.filter( (card) => {
                    if(cardMap[card.name]) {
                        return cardMap[card.name].legalities.pioneer === "legal"

                    }
                    // if the card is not in the card list, don't filter it out because idk wtf happened.
                    return true;

                });
                return {
                    cardviews: filteredCardviews,
                    header: header,
                    tags: tags
                };


            }));

            data.container.json_dict.cardlists = filteredCardLists;

            const respBlob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const newResp = new Response(respBlob,{"status" : 200 , "statusText" : "ok"});
             return newResp;

            // return response;
        }

        return origFetch(...args);


    }



    const fetchCardByName = async (name) => {
        const cardname = name.split("//")[0].trim();
        const resp = await fetch(`https://api.scryfall.com/cards/named?exact=${cardname}`);
        return resp.json();
    }

    const getPageCardName = () => {
        const pageTitle = $(".page-heading").html().trim();
        const lastIdx = pageTitle.lastIndexOf(" ");
        return pageTitle.substring(0, lastIdx)
    }

    const injectLegality = (isLegal) => {
        var $span = $( document.createElement('span') );
        if (isLegal) {
            $span.text("Legal  ")
            $span.css({"color": "green"})
        } else {
            $span.text("Not Legal  ")
            $span.css({"color": "red"})
        }
        const pageTitle = $(".page-heading").prepend($span);
    }




    window.addEventListener('DOMContentLoaded', (event) => {
         let pageTitle = $(".page-heading")[0];


        const config = { characterData: false, attributes: false, childList: true, subtree: false };

        const onPageTitleChange = async (mutations, observer) => {
            const pageTitleText = $(pageTitle).html().trim();
            if(pageTitleText) {
                const lastIdx = pageTitleText.lastIndexOf(" ");
                const currCardName = pageTitleText.substring(0, lastIdx)
                const card = await fetchCardByName(currCardName);
                if(card.legalities){
                    injectLegality(card.legalities.pioneer === "legal");
                }

           }
        }


        let observer = new MutationObserver(onPageTitleChange)

        observer.observe(pageTitle, config)

    });







})();
// ==UserScript==
// @name             nautiljon-total-time
// @namespace        http://tampermonkey.net/
// @version          0.6.4
// @description      Dans le bloc-notes et les collections, calcule la durée totale de la liste des animes et dramas sélectionnés ainsi que la durée totale par série. Calcule également la durée totale des séries sur leur fiche.
// @author           Ed38
// @license          MIT
// @match            https://www.nautiljon.com/membre/a-voir,*,anime.html*
// @match            https://www.nautiljon.com/membre/a-voir,*,drama.html*
// @match            https://www.nautiljon.com/membre/possede,*,anime.html*
// @match            https://www.nautiljon.com/membre/possede,*,drama.html*
// @match            https://www.nautiljon.com/membre/vu,*,anime.html*
// @match            https://www.nautiljon.com/membre/vu,*,drama.html*
// @match            https://www.nautiljon.com/animes/*
// @match            https://www.nautiljon.com/dramas/*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=nautiljon.com
// @grant            GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/446469/nautiljon-total-time.user.js
// @updateURL https://update.greasyfork.org/scripts/446469/nautiljon-total-time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const testListURL = /^https:\/\/www.nautiljon.com\/membre\/(a-voir|possede|vu),.*/ ;
    const episodeTypeLabel = [] ;
    episodeTypeLabel["a-voir"] = "Épisodes à voir : " ;
    episodeTypeLabel["possede"] = "Épisodes possédés : " ;
    let episodeType ;
    let searchTypingState = false ;
    let counterLock = false ;
    let infoSheetLock = false ;
    let collectionNode ;

    let urlMatch = document.location.href.match(testListURL) ;
    if (urlMatch) {
        episodeType = urlMatch[1] ;
        if (episodeType === "vu") {
            // Nauti'liste
            reformatNautiliste() ;
        }
        else
        {
            // Bloc-notes & Collection
            document.querySelector("input[data-id='listingListe']").addEventListener("keyup", searchTyping, false);
            totalTimeCounter();
        }
    }
    else {
        // Info sheet
        collectionNode = document.querySelector('#collection_anime') ;
        if (!collectionNode) {
            collectionNode = document.querySelector('#collection_drama') ;
        }
        if (collectionNode) {

            collectionNode.addEventListener("click", watchedChange, false);
        }
        infoSheetDuration() ;
    }

    function watchedChange() {
        setTimeout(infoSheetDuration, 300);
    }

    function searchTyping(){
        searchTypingState = true ;
        totalTimeCounter() ;
    }

    function infoSheetDuration(){
        let hours = 0 ;
        let minutes = 0 ;
        let numberOfEpisodesSpan = document.querySelector('span[itemprop = "numberOfEpisodes"]')
        let numberOfEpisodes = numberOfEpisodesSpan.textContent ;
        if(numberOfEpisodes > 1){
            let durationText = numberOfEpisodesSpan.nextSibling.textContent.replace(/\s+/g, '') ;
            // hours & minutes
            let hoursMatch = durationText.match(/(\d+)h/) ;
            if (hoursMatch) {
                hours = ~~hoursMatch[1] ;
                let minutesMatch = durationText.match(/h(\d+)/) ;
                if (minutesMatch) {
                    minutes = ~~minutesMatch[1] ;
                }
            }
            else {
                let minutesMatch = durationText.match(/(\d+)min/) ;
                if (minutesMatch) {
                    minutes = ~~minutesMatch[1] ;
                }
            }

            let epDuration = (hours * 60 + minutes) ;
            let totalDuration = numberOfEpisodes * epDuration ;
            let itemHours = Math.trunc(totalDuration / 60) ;
            let itemMinutes = totalDuration % 60 ;

            let totalDurationSpan = document.querySelector('#totalDuration') ;
            if (!totalDurationSpan) {
                totalDurationSpan = document.createElement("span") ;
                totalDurationSpan.classList.add("infos_small") ;
                totalDurationSpan.id = "totalDuration" ;
                numberOfEpisodesSpan.parentNode.appendChild(totalDurationSpan) ;
            }

            totalDurationSpan.innerHTML=' (' + itemHours + ' h ' + itemMinutes.toString().padStart(2,"0") + ' min)' ;

            // Watched / to watch durations
            if (collectionNode) {
                let watched = collectionNode.querySelector('span[id^="ep_"]') ;
                let watchedEp = ~~watched.innerHTML ;
                let toWatchEp = ~~numberOfEpisodes - watchedEp ;

                if (toWatchEp != 0 && watchedEp != 0) {
                    let watchedTime = watchedEp * epDuration ;
                    let watchedHours = Math.trunc(watchedTime / 60) ;
                    let watchedMinutes = watchedTime % 60 ;
                    let toWatchTime = toWatchEp * epDuration ;
                    let toWatchHours = Math.trunc(toWatchTime / 60) ;
                    let toWatchMinutes = toWatchTime % 60 ;
                    let watchedDetailsText = " Déjà&nbsp;vu&nbsp;:&nbsp;<strong>" + watchedHours + "&nbsp;h&nbsp;" + watchedMinutes + "&nbsp;min</strong>. À&nbsp;voir&nbsp;:&nbsp;<strong>" + toWatchHours + "&nbsp;h&nbsp;" + toWatchMinutes + "&nbsp;min</strong>." ;
                    let elDetails = document.querySelector('#watchedDetails');

                    if (!elDetails) {
                        elDetails = document.createElement("span") ;
                        elDetails.id = "watchedDetails" ;
                        elDetails.style.marginLeft = "1em" ;
                        collectionNode.querySelector("div").appendChild(elDetails) ;
                    }
                    elDetails.innerHTML = watchedDetailsText ;
                }
                else {
                    if (collectionNode.querySelector('#watchedDetails')){
                        collectionNode.querySelector('#watchedDetails').innerHTML = "" ;
                    }
                }
            }
        }
    }

    function totalTimeCounter() {
        if (counterLock === true) {
            return ;
        }
        counterLock = true ;
        GM_addStyle('@media (min-width:1025px) {.total-time::before {content:"\\A"; white-space: pre;}}') ;
        let durationLabel = "Temps total : " ;
        let episodesLabel = episodeTypeLabel[episodeType] ;
        let counter = 0 ;
        let episodesCounter = 0 ;
        let durationNode ;
        let durationText ;
        let itemTotal = 0 ;
        let itemHours = 0 ;
        let itemMinutes = 0 ;
        let durationsNode = document.getElementsByClassName("t_progression") ;

        for (let i = 0 ; i < durationsNode.length; i++) {
            itemLoop: {
                let numberOfEpisodes = 0 ;
                let hours = 0 ;
                let minutes = 0 ;
                if (durationsNode[i].checkVisibility()) {
                    durationNode = durationsNode[i] ;
                    durationText = durationsNode[i].textContent;
                    durationText = durationText.replace(/\s+/g, '') ; // remove whitespaces
                    let test=durationText;
                    durationText = durationText.replace(/\(.*\)$/, '') ; // remove existing result

                    // Skip if unknow data
                    if (durationText.match(/\?/)){
                        break itemLoop ;
                    }

                    // Number of episodes
                    let episodesMatch = durationText.match(/(\d+)[x×].*/) ;
                    if (episodesMatch) {
                        numberOfEpisodes = episodesMatch[1] ;
                    }
                    else {
                        numberOfEpisodes = 1 ;
                    }

                    // hours & minutes
                    let hoursMatch = durationText.match(/(\d+)h/) ;
                    if (hoursMatch) {
                        hours = hoursMatch[1] ;
                        let minutesMatch = durationText.match(/h(\d+)/) ;
                        if (minutesMatch) {
                            minutes = minutesMatch[1] ;
                        }
                    }
                    else {
                        let minutesMatch = durationText.match(/(\d+)min/) ;
                        if (minutesMatch) {
                            minutes = minutesMatch[1] ;
                        }
                    }
                }

                itemTotal = ~~numberOfEpisodes * (~~hours * 60 + ~~minutes) ;
                counter = counter + itemTotal ;

                if (numberOfEpisodes > 1){
                    itemHours = Math.trunc(itemTotal / 60) ;
                    itemMinutes = itemTotal % 60 ;
                    let itemTotalText = '(' + itemHours.toLocaleString() + ' h ' + itemMinutes.toString().padStart(2,"0") + ' min)' ;
                    let itemTotalDisplay = durationsNode[i].querySelector('[data-id="itemTotalDuration"]') ;
                    if (itemTotalDisplay) {
                        itemTotalDisplay.innerHTML=itemTotalText ;
                    }
                    else {
                        durationsNode[i].insertAdjacentHTML('beforeend', ' <span class="infos_small total-time" data-id="itemTotalDuration">' + itemTotalText + '</span>') ;
                    }
                }

                episodesCounter = ~~episodesCounter + ~~numberOfEpisodes ;

            }
        }

        let counterHours = Math.trunc(counter / 60) ;
        let counterMinutes = counter % 60 ;
        let totalDurationText = episodesLabel + "<strong>" + episodesCounter.toLocaleString() + "</strong>. " + durationLabel + "<strong>" + counterHours.toLocaleString() + " h " + counterMinutes.toString().padStart(2,"0") + " min</strong>";
        let totalDisplay = document.querySelector('[data-id="totalDuration"]') ;
        if (totalDisplay) {
            totalDisplay.innerHTML = totalDurationText ;
        }
        else {
            let statsStatut = document.getElementsByClassName("stats_statut") ;
            let counterDiv = document.createElement("div") ;
            counterDiv.setAttribute("class","stats_prix") ;
            counterDiv.dataset.id="totalDuration" ;
            counterDiv.innerHTML = totalDurationText ;
            statsStatut[0].parentNode.insertBefore(counterDiv,statsStatut[0]) ;
        }
        counterLock = false ;
        if (searchTypingState === true) {
            searchTypingState = false ;
            totalTimeCounter() ;
        }
    }

    function reformatNautiliste() {
        let totalEpisodesDisplay = document.getElementsByClassName("stats_prix")[0].querySelector("strong:nth-child(1)") ;
        let totalDurationDisplay = document.getElementsByClassName("stats_prix")[0].querySelector("strong:nth-child(2)") ;

        let totalEpisodes = ~~totalEpisodesDisplay.innerHTML ;
        totalEpisodesDisplay.innerHTML = totalEpisodes.toLocaleString() ;

        let totalDurationText = totalDurationDisplay.innerHTML ;
        let days = 0 ;
        let hours = 0 ;
        let minutes = 0 ;

        let daysMatch = totalDurationText.match(/(\d+) jour.*/)
        if (daysMatch) {
            days = daysMatch[1] ;
        }
        let hoursMatch = totalDurationText.match(/(\d+) heure.*/)
        if (hoursMatch) {
            hours = hoursMatch[1] ;
        }
        let minutesMatch = totalDurationText.match(/(\d+) minute.*/)
        if (minutesMatch) {
            minutes = minutesMatch[1] ;
        }

        let newTotalDurationText = (~~days * 24 + ~~hours).toLocaleString() + " h " + minutes.toLocaleString() + " min" ;

        totalDurationDisplay.innerHTML = newTotalDurationText ;
    }

})();


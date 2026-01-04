// ==UserScript==
// @name         hdrezka rating
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  add rating to films cover
// @author       cjvnjde
// @match        http://hdrezka.ag/series/*
// @match        http://hdrezka.ag/films/*
// @match        http://hdrezka.ag/index.php?do=search*
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/379007/hdrezka%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/379007/hdrezka%20rating.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const listOfFilms = document.querySelectorAll('.b-content__inline_item-link');
    const listOfLinks = [];
    const listOfStat = [];
    for(let i = 0; i < listOfFilms.length; i++){
        listOfLinks.push(listOfFilms[i].querySelector('a').href);
        listOfStat.push(listOfFilms[i].querySelector('div'));
    }
    const getRating = (link) => {
        return new Promise((resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: link,
                onload: function({response}) {
                    const ratingSpan = /<span id="rating-layer-num-.{1,60}<\/span/.exec(response)
                    let rating = '';
                    if(ratingSpan[0]){
                        rating = /(>)(.*)(<\/)/.exec(ratingSpan[0])
                    }
                    sessionStorage.setItem(link, rating[2]);
                    resolve({rating: rating[2], link: link});
                },
              onerror: function(e){
                console.error(e);
              }
            })
        }))
    }
    const ListOfRating = listOfLinks.map(link => {
        if(sessionStorage.getItem(link)){
            return {rating: sessionStorage.getItem(link), link: link}
        }
        return getRating(link);
    })

    Promise.all(ListOfRating).then(data => {
        if(data.length === listOfFilms.length){
            data.forEach((data, id) => {
                listOfStat[id].innerHTML += `, ${data.rating}`;
            })
        }
    })
})();
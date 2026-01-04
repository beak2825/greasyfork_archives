// ==UserScript==
// @name MALScore
// @namespace Ract
// @author Ract
// @description Adds MyAnimeList link and score to AniList anime and manga pages
// @match https://anilist.co/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=147465
// @grant GM_xmlhttpRequest
// @version 2
// @downloadURL https://update.greasyfork.org/scripts/375926/MALScore.user.js
// @updateURL https://update.greasyfork.org/scripts/375926/MALScore.meta.js
// ==/UserScript==
// Thanks to https://greasyfork.org/en/scripts/5890-kitsu-mal-rating for code reference
var SCRIPT_NAME = 'MAL Score';


var Util = {
    log: function() {
        var args = [].slice.call(arguments);
        args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: #233c7b;');
        console.log.apply(console, args);
    },
    q: function(query, context) {
        return (context || document).querySelector(query);
    },
    qq: function(query, context) {
        return [].slice.call((context || document).querySelectorAll(query));
    }
};

function getRating(malURL,cb){
    GM_xmlhttpRequest({
        method: 'GET',
        url: malURL,
        onload: function(response) {
          try {
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = response.responseText;

            var sidebar = Util.q('#content > table > tbody > tr > td.borderClass', tempDiv);
            var rating = Util.q('span[itemprop="ratingValue"]', sidebar);
            var headerNum;

            if (Util.q('h2.mt8', sidebar)) headerNum = 4;
            else headerNum = 3;

            if (rating) {
              rating = rating.innerText;
            } else {
              var score = Util.q('h2:nth-of-type(' + headerNum + ') + div', sidebar).innerText.replace(/[\n\r]/g, '');
              if (score.match(/Score:\s+N\/A/)) {
                rating = null;
              } else {
                rating = score.match(/[0-9]{1,2}\.[0-9]{2}/)[0];
              }
            }
            Util.log(rating)
            cb(rating);
          } catch (err) {
            Util.log('Failed to parse MAL page');
          }
        }
        });
}
waitForUrl(function() {
GM_xmlhttpRequest({
    method: "POST",
    url: "https://graphql.anilist.co",
    data: JSON.stringify({
          query: `query ($id: Int,$type:MediaType) {
                      Media (id: $id, type:$type) {
                          idMal
                      }
                  }`,
          variables: {
            "id": window.location.pathname.split("/")[2],
            "type": window.location.pathname.split("/")[1].toUpperCase()
          }
      }),
    headers: {
        "Content-Type": "application/json"
    },
    onload: function(response) {
        var type = window.location.pathname.split("/")[1].toLowerCase();
        var malID=JSON.parse(response.responseText)["data"]["Media"]["idMal"];
        var malURL = "https://myanimelist.net/" + type+ "/"+ malID;
        //Util.log(malURL);
        getRating(malURL,function(rating) {
            //Util.log("rating"+rating);
            waitForElems({
              sel: '.data:not(#malscorebox)',
              stop: true,
              onmatch: function() {
                  //Util.log("ratingfound"+rating);
                  document.getElementsByClassName("data")[0].innerHTML+=`<div id="malscorebox" data-v-ead17872="" class="data-set"><div data-v-ead17872="" class="type">MAL Score</div> <div id="malscore" data-v-ead17872="" class="value"><a rel="noopener noreferrer" href="${malURL}">${rating}</a></div></div>`
              }
            });
        });

    }
});
});
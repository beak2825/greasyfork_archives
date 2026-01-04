// ==UserScript==
// @name        MangaDex recommendations
// @namespace   https://greasyfork.org/users/412318
// @include     /^https?:\/\/mangadex\.org\/title\/\d+/
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlhttpRequest
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version     1.0
// @author      henrik9999
// @run-at      document-idle
// @description This script adds recommendations to similar Manga on MangaDex
// @downloadURL https://update.greasyfork.org/scripts/415324/MangaDex%20recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/415324/MangaDex%20recommendations.meta.js
// ==/UserScript==

const api = {};

if (typeof GM_xmlhttpRequest !== 'undefined') {
    api.GM_xmlhttpRequest = GM_xmlhttpRequest;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.xmlHttpRequest !== 'undefined'
) {
    api.GM_xmlhttpRequest = GM.xmlHttpRequest;
}

if (typeof GM_setValue !== 'undefined') {
    api.GM_setValue = GM_setValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.setValue !== 'undefined'
) {
    api.GM_setValue = GM.setValue;
}

if (typeof GM_getValue !== 'undefined') {
    api.GM_getValue = GM_getValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.getValue !== 'undefined'
) {
    api.GM_getValue = GM.getValue;
}


$(document).ready(function() {  
    $("ul.edit.nav.nav-tabs").append('<li class="nav-item"><a class="nav-link md-recommendations" href="#"><span class="fas fa-heart fa-fw " aria-hidden="true"></span> <span class="d-none d-md-inline">Recommendations</span></a></li>');
  
    $( ".md-recommendations" ).click(async function() {
      $('ul.edit.nav.nav-tabs a.nav-link').removeClass('active');
      $( ".md-recommendations").addClass('active');
      $('div.edit.tab-content').empty().append('<i class="fa fa-spinner fa-pulse fa-5x mt-5" aria-hidden="true"></i>');
      const recs = buildRecommendationsForId(await getAllRecommendations(), window.location.href.split("/")[4])
      $('div.edit.tab-content').empty().append(recs);
    });
});


function buildRecommendationsForId(recommendations, id) {
  console.log(id);
    if(recommendations[id]) {
      let recHtml = '<div class="row mt-1 mx-0">';
      recommendations[id]['m_ids'].forEach(function(item, index) {
        recHtml += `<div class="col-lg-2 p-2">
        <a href="https://mangadex.org/title/${item}" target="_blank">
        <div class="card h-100">
        <img class="card-img-top" loading="lazy" style="height: 250px;" src="https://mangadex.org/images/manga/${item}.large.jpg">
        <div class="card-body">
        <h5 class="card-text">${recommendations[id]['m_titles'][index]}</h5>
        </div>
        </div>
        </a>
        </div>`
      });
      recHtml += "</div>";
      
      return recHtml;
    } else {
      
      return '<h1 class="mt-1">No recommendations found!</h1>'
    }
}


async function getAllRecommendations() {
    console.log("getPageSearch")
    var cache = await api.GM_getValue("recommendationsCache");
    var cacheTime = await api.GM_getValue("recommendationsCacheTime");
    if (cache != null && !$.isEmptyObject(cache) && cacheTime != null && new Date().getTime() - parseInt(cacheTime) < 24 * 60 * 60 * 1000) {
        console.log("cache recommendations");
        return cache;
    } else {
        console.log("new recommendations");
        let pageSearch = await new Promise((resolve, reject) => {
            api.GM_xmlhttpRequest({
                method: "GET",
                url: 'https://raw.githubusercontent.com/goldbattle/MangadexRecomendations/master/output/mangas_compressed.json',
                onload: function(response) {
                    if (response.status === 200 && response.responseText) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        resolve({});
                    }
                }
            });
        })
        await api.GM_setValue("recommendationsCacheTime", new Date().getTime());
        await api.GM_setValue("recommendationsCache", pageSearch);
        return pageSearch;
    }
}

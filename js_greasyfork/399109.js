// ==UserScript==
// @name        MyAnimeList Manga/Anime search and stream links
// @namespace   https://greasyfork.org/users/412318
// @include     /^https?:\/\/myanimelist\.net\/(anime|manga)(\/)\d+/
// @grant       GM_xmlhttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version     1.7
// @author      henrik9999
// @run-at      document-idle
// @description This script adds search and stream links for manga and anime pages on MyAnimeList
// @downloadURL https://update.greasyfork.org/scripts/399109/MyAnimeList%20MangaAnime%20search%20and%20stream%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/399109/MyAnimeList%20MangaAnime%20search%20and%20stream%20links.meta.js
// ==/UserScript==

var pageType;
var pageId;


function favicon(domain){
  return 'https://www.google.com/s2/favicons?domain='+domain;
}

async function getPageSearch(){
  console.log("getPageSearch")
  var cache = await GM.getValue("pageSearchCache");
  var cacheTime = await GM.getValue("pageSearchCacheTime");
  if(cache != null && !$.isEmptyObject(cache) && cacheTime != null && new Date().getTime() - parseInt(cacheTime) < 12*60*60*1000) {
    console.log("cache getpagesearch");
    return cache;
  } else {
    console.log("new getpagesearch");
    let pageSearch = await new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: 'https://api.malsync.moe/general/pagesearch',
      onload: function(response) {
        if(response.status === 200 && response.responseText) {
          resolve(JSON.parse(response.responseText));
        } else {
          resolve({});
        }
      }
    });
  })
    await GM.setValue("pageSearchCacheTime",new Date().getTime());
    await GM.setValue("pageSearchCache",pageSearch);
    return pageSearch;
  }
}

async function siteSearch() {
  console.log('Site Search');
  $('h2:contains("Information")').before('<h2 id="mal-sync-search-links" class="mal_links">Search</h2><div class="MALSync-search"><a>[Show]</a></div><br class="mal_links" />');
  var pageSearch = await getPageSearch();
  $('.MALSync-search').one('click', async () => {
    $('.MALSync-search').remove();
    console.log(pageSearch)
    var title = $('meta[property="og:title"]').first().attr('content').trim();
    var titleEncoded = encodeURI(title);
    var html = '';
    var imgStyle = 'position: relative; top: 4px;'

    for (var key in pageSearch) {
      var page = pageSearch[key];
      if(page.type !== pageType) continue;

      var linkContent = `<img style="${imgStyle}" src="${favicon(page.domain)}"> ${page.name}`;
      if(typeof page.completeSearchTag === 'undefined'){
        var link =
        `<a target="_blank" href="${page.searchUrl.replace("##searchkey##",titleEncoded)}">
        ${linkContent}
        </a>`
      }else{
        var link = page.completeSearchTag(title, linkContent);
      }

      var googleSeach = '';
      if( typeof page.googleSearchDomain !== 'undefined'){
        googleSeach =`<a target="_blank" href="https://www.google.com/search?q=${titleEncoded}+site:${page.googleSearchDomain}">
        <img style="${imgStyle}" src="${favicon('google.com')}">
        </a>`;
      }

      html +=
      `<div class="mal_links" id="${key}" style="padding: 1px 0;">
      ${link}
      ${googleSeach}
      </div>`;
    }

    $('#mal-sync-search-links').after(html);
  });
}

async function getMalToStreamApi(type, id){
  if(!id) return {};
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: 'https://api.malsync.moe/mal/'+type+'/'+id,
      onload: async function(response) {
        if(response.status === 200) {
          var data = JSON.parse(response.responseText);
          for(var pageKey in data.Sites){
            if(await GM.getValue(pageKey) != null && !await GM.getValue(pageKey)){
              console.log(pageKey+' is deactivated');
              delete data.Sites[pageKey];
              continue;
            }
          }
          if(data && data.Sites) resolve(data.Sites);
          resolve({});
        } else {
          resolve({});
        }
      }
    });
  })
}

async function malToStream(){
  console.log('malToStream');
  getMalToStreamApi(pageType, pageId).then((links) => {
    console.log(links)
    var html = '';
    for(var pageKey in links){
      var page = links[pageKey];

      var tempHtml = '';
      var tempUrl = '';
      for(var streamKey in page){
        var stream = page[streamKey];
        tempHtml += '<div class="mal_links"><a target="_blank" href="'+stream['url']+'">'+stream['title']+'</a></div>';
        tempUrl = stream['url'];
      }
      html += '<h2 id="'+pageKey+'Links" class="mal_links"><img src="'+favicon(tempUrl.split('/')[2])+'"> '+pageKey+'<span title="'+pageKey+'" class="remove-mal-sync" style="float: right; font-weight: 100; line-height: 2; cursor: pointer; color: grey;">x</span></h2>';
      html += tempHtml;
      html += '<br class="mal_links" />';

    }
    $(document).ready(function(){
      $('h2:contains("Information")').before(html);
        $('.remove-mal-sync').click(async function(){
          var key = $(this).attr('title');
          console.log(key)
          await GM.setValue(key, false);
          location.reload();
        });
    });
  })
}


$(document).ready(function(){
  pageType = document.URL.split("/")[3].toLowerCase();
  pageId = document.URL.split("/")[4];
  siteSearch();
  malToStream();
});
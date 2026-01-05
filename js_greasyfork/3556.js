// ==UserScript==
// @name            FeedlyTool mini Save For Later
// @version         0.0.2
// @author          kik0220
// @namespace       https://sites.google.com/site/feedlytool/
// @description     Display "Save for Later" count. This is the edition that was limited to Save For Later feature Chrome extension of "FeedlyTool".
// @description:ja  「Save for Later」の件数を表示します。これはChrome拡張「FeedlyTool」のSave For Later機能に限定したものです。
// @icon            http://feedlytool.kk22.jp/icon.png
// @match           http://feedly.com/*
// @match           https://feedly.com/*
// @exclude         http://feedly.com/#welcome
// @exclude         https://feedly.com/#welcome
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @connect         cloud.feedly.com
// @copyright       2013+, kik0220
// @downloadURL https://update.greasyfork.org/scripts/3556/FeedlyTool%20mini%20Save%20For%20Later.user.js
// @updateURL https://update.greasyfork.org/scripts/3556/FeedlyTool%20mini%20Save%20For%20Later.meta.js
// ==/UserScript==

var accessToken = '';
var userId = '';
var lastLocation = '';
var currentDir = '';
var customCSS = [
  '#feedlyTool_savedTab_count { float: right; font-size: 10px; opacity: 0.75; }',
  '#savedtab_label { float: left; }'
].join('');

GM_addStyle(customCSS);
document.addEventListener("DOMSubtreeModified", getCookie, false);
document.body.addEventListener("DOMSubtreeModified", function (e) {
  if (lastLocation != document.location.href) {
    lastLocation = document.location.href;
    getSaved();
  }
}, false);

function getCookie(){
  if(document.location.href.indexOf('/i/welcome') > -1){return;}
  var all = document.cookie;
  if(all === null){return;}
  all = all.split(';');
  for(var i = 0; i < all.length; i++){
    var cookie = all[i];
    if(cookie.indexOf('feedly.session=') < 0){continue;}
    var json;
    try{
      json = JSON.parse(cookie.replace('feedly.session=', ''));
      accessToken = json.feedlyToken;
      userId = json.feedlyId;
    } catch(e) {return;}
    document.removeEventListener("DOMSubtreeModified", getCookie, false);
    setTimeout(getSaved(), 3000);
    return;
  }
}

function getSaved(){
  if(!accessToken||!userId){return;}
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://cloud.feedly.com/v3/markers/tags',
    headers: { 'Authorization': 'OAuth '+accessToken },
    onload: function(res) {
      if(res.status !== 200){return;}
      var response = JSON.parse(res.responseText);
      var count = response.taggedEntries['user/'+userId+'/tag/global.saved'].length;
      var target = document.getElementById('feedlyTool_savedTab_count');
      var targetParent = document.getElementById('savedtab');
      if(target){
        target.innerText = count;
      } else if(targetParent) {
        targetParent.innerHTML += '<div id="feedlyTool_savedTab_count">'+ count +'</div>';
      }
    }
  });
}
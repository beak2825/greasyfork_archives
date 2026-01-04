// ==UserScript==
// @name         Youtube - Copy Channel RSS Feed Url To Clipboard
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a Tampermonkey menu to copy a Youtube Channel's RSS feed url to the clipboard.
// @author       You
// @match        https://www.youtube.com/user/*
// @match        https://www.youtube.com/channel/*
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/36357/Youtube%20-%20Copy%20Channel%20RSS%20Feed%20Url%20To%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/36357/Youtube%20-%20Copy%20Channel%20RSS%20Feed%20Url%20To%20Clipboard.meta.js
// ==/UserScript==



function getChannelRSS(){
  let channelRSSurl = ''
  
  /*
    we need to re-request the current page cause youtube doesn't update the json on the page in the <script> source or the 
    ytInitialData.metadata.channelMetadataRenderer.rssUrl when they change the url without a full page reload (e.g. when you click on one of your channels on the left).
  */
  
  GM_xmlhttpRequest({
    method: "GET",
    url: window.location.href,
    onload: function({responseText}) {
      if(responseText.includes('"rssUrl"')){
        channelRSSurl = responseText.split('"rssUrl":"')[1].split('"')[0]
      }
      else{ // for some reason the rssUrl isn't in the json on the page sometimes, in that case, try to fall back to if the channel name in the url is the youtube channel id
        channelRSSurl = `https://www.youtube.com/feeds/videos.xml?channel_id=${ window.location.href.split('/channel/')[1].split('/')[0] }`
      }
      GM_setClipboard(channelRSSurl)
    }
  })
}

GM_registerMenuCommand('Copy Youtube Channel RSS Feed To Clipboard', getChannelRSS)

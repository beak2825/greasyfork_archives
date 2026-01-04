// ==UserScript==
// @name         Export YouTube Subscriptions to RSS OPML
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.10
// @description  Adds the option to export subscriptions from YouTube as an OPML file of RSS feeds.
// @author       Gavin Borg
// @match        https://www.youtube.com/feed/channels
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/418574/Export%20YouTube%20Subscriptions%20to%20RSS%20OPML.user.js
// @updateURL https://update.greasyfork.org/scripts/418574/Export%20YouTube%20Subscriptions%20to%20RSS%20OPML.meta.js
// ==/UserScript==

function exportSubscriptions() {
   var channels = [];
   var inChannels = false;
   var channelURLFragment = "www.youtube.com/channel/";

   var links = document.querySelectorAll("a#main-link"); // Link for each channel entry
   for(var i = 0; i < links.length; i++) {
      var title = links[i].querySelector("yt-formatted-string[title]").innerText;
         var channelId = getChannelId(links[i]);
         if(channelId) {
            inChannels = true; // Found our first channel
         }

         if(inChannels) {
            if(!channelId) {
               break; // Once we're in the channels block, any link that's not to a channel means we've exited it and are finished.
            }

            channels.push({"title":title, "id":channelId});
         }
   }

   // Build download link and click it
   var xml = buildXML(channels);
   var fileType = "text/plain";
   var blob = new Blob([xml], {type: fileType});
   var blobURL = window.URL.createObjectURL(blob);
   var filename = "youtubeSubscriptions.opml";
   var downloadLink = document.createElement("a");
   downloadLink.setAttribute("href", blobURL);
   downloadLink.setAttribute("download", filename);
   downloadLink.dataset.downloadurl = fileType + ":" + filename + ":" + blobURL;
   downloadLink.click();
}

function getChannelId(link) {
   try {
      if (link.data.browseEndpoint.browseId.startsWith("UC")) {
         return link.data.browseEndpoint.browseId;
      }
   } catch {
   }
}

function buildXML(channels) {
   // Goal structure:
   //  <opml version="1.0">
   //   <head>
   //   <title>YouTube Subscriptions as RSS</title>
   //   </head>
   //   <body>
   //   <outline text="YouTube Subscriptions" title="YouTube Subscriptions">
   //    <outline type="rss" text="" title="" xmlURL="" />
   //    ...
   //   </outline>
   //   </body>
   //  </opml>

   var xmlDoc = document.implementation.createDocument("", "", null);
   var opml = xmlDoc.createElement("opml");
   opml.setAttribute("version", "1.0");

   var head = xmlDoc.createElement("head");
   var title = xmlDoc.createElement("title");

   if (window.trustedTypes && window.trustedTypes.createPolicy) {
     window.trustedTypes.createPolicy('default', {
       createHTML: (string, sink) => string
     });
     title.innerHTML = window.trustedTypes.defaultPolicy.createHTML("YouTube Subscriptions as RSS");
   } else {
     title.innerHTML = "YouTube Subscriptions as RSS";
   }

   head.appendChild(title);
   opml.appendChild(head);

   var body = xmlDoc.createElement("body");
   var parentOutline = xmlDoc.createElement("outline");
   parentOutline.setAttribute("text", "YouTube Subscriptions")
   parentOutline.setAttribute("title", "YouTube Subscriptions")

   for(var j = 0; j < channels.length; j++) {
      var outline = xmlDoc.createElement("outline");
      outline.setAttribute("type", "rss");
      outline.setAttribute("text", channels[j].title);
      outline.setAttribute("title", channels[j].title);
      outline.setAttribute("xmlUrl", "https://www.youtube.com/feeds/videos.xml?channel_id=" + channels[j].id);
      parentOutline.appendChild(outline);
   }

   body.appendChild(parentOutline);

   opml.appendChild(body);
   xmlDoc.appendChild(opml);

   var s = new XMLSerializer();
   return s.serializeToString(xmlDoc);
}

// Support both Greasemonkey and others (Greasemonkey check must come first because it can't handle checking if GM_registerMenuCommand exists without crashing)
if(GM.registerMenuCommand) {
    GM.registerMenuCommand("Export YouTube Subscriptions to OPML", exportSubscriptions, "x");
}
else {
    GM_registerMenuCommand("Export YouTube Subscriptions to OPML", exportSubscriptions, "x");
}

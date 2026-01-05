// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Hush
/* jshint multistr: true */

// ==UserScript==
// @name            leanforward
// @namespace       https://greasyfork.org/en/users/24734-ctag
// @description     Fix Deviantart's SitBack page for flash-less browsers.
// @version         01.02.02
// @author          Christopher Bero
// @license         LGPL-3.0 http://www.gnu.org/licenses/lgpl-3.0.en.html
// @homepageURL     https://github.com/ctag/leanforward
// @resource        license http://www.gnu.org/licenses/lgpl-3.0.txt
// @include         /.*justsitback\.deviantart\.com.*/
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/15518/leanforward.user.js
// @updateURL https://update.greasyfork.org/scripts/15518/leanforward.meta.js
// ==/UserScript==

// Variables
var _DEBUG = false;
var divContent = document.getElementById("sitbackcontent");
var imageLoad;
var imageDisp;
var deviationData = [];
var imageIndex = 0;
var timerID;
// RSS Request Variables
var queryData;
var rssUrl;
var rssBase = 'http://backend.deviantart.com/rss.xml?type=deviation';
var reqJson;
// http RSS request options
var limit = 20; // fetch 20 images at a time
var offset = 0; // offset from front, incremented by 'limit'
var rssEnd = false; // Boolean, are we out of RSS data?
// Transition variables
var delay = 10000;

if (_DEBUG) console.log("Running leanforward.user.js [" + GM_info.script.version + "]");

/**
 * getQueryVariable
 * Get the rssQuery GET variable from the sitback URL
 */
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

function displayNext() {
  imageIndex++;
  if (imageIndex >= deviationData.length) {
    imageIndex = 0;
  }
  //if (_DEBUG) console.log("Setting image to: ", imageLoad.attr('src'));
  console.log("Loading image: " + imageIndex);
  imageDisp.attr('src', imageLoad.attr('src'));
  imageLoad.attr('src', deviationData[imageIndex].image.url);
  if (imageIndex === (deviationData.length - limit + 1)) {
    console.log("End of images! Getting more...");
    //window.clearInterval(timerID);
    doTransfer();
  }
}

function addGetVar(url, name, value)
{
  url = url + '&' + name + '=' + value;
  return url;
}

function buildQueryURL()
{
  if (!queryData) {
    queryData  = getQueryVariable('rssQuery');
  }
  rssUrl = addGetVar(rssBase, 'q', queryData);
  rssUrl = addGetVar(rssUrl, 'limit', limit);
  rssUrl = addGetVar(rssUrl, 'offset', offset);
  offset += limit;
  console.log("Build Query URL: ", rssUrl);
}

function loopStart()
{
  timerID = window.setInterval(displayNext, delay);
}

function loopStop()
{
  window.clearInterval(timerID);
}

function transferComplete(data) {
  if (_DEBUG) console.log("Transfer Complete: ");
  var xml = $.parseXML(data.responseText);
  var parsed = $(xml);
  var items = parsed.find('item');
  $.each(items, function () {
    item = $(this);
    deviation = {};
    deviation.image = {};
    deviation.title = item.find('title').text();
    deviation.description = item.find('description').text();
    deviation.url = item.find('link').text(); // A url to the page
    deviation.copyright = item.find('media\\:copyright, copyright').text();
    deviation.copyrightUrl = item.find('media\\:copyright, copyright').attr('url');
    deviation.image.url = item.find('media\\:content, content').attr('url');
    deviation.image.width = item.find('media\\:content, content').attr('width');
    deviation.image.height = item.find('media\\:content, content').attr('height');
    deviation.image.medium = item.find('media\\:content, content').attr('medium');
    deviationData.push(deviation);
    if (_DEBUG) console.log("New image data: ", deviation);
  });

  //if (_DEBUG) console.log("transfer complete data: ", data.responseText);
  // var reg = /<media:content url=\"(.*)\" height/mg; // gross, I know.
  // var match = reg.exec(data.responseText);
  // while (match !== null) {
  //   deviationData.push(match[1]);
  //   match = reg.exec(data.responseText);
  // }
  //if (_DEBUG) console.log("Images: ", deviationData);
  if (!imageDisp.attr('src')) {
    imageDisp.attr('src', deviationData[0].image.url);
    imageLoad.attr('src', deviationData[1].image.url);
    imageIndex = 0;
    loopStart();
  }
}

function transferFailed(error) {
  console.log("http Request Error: ", error);
}

function doTransfer() {
  console.log("Getting an additional " + limit + " images, already have " + deviationData.length);
  buildQueryURL();
  // Send cross-site RSS request
  GM_xmlhttpRequest({
    method: "GET",
    synchronous: false,
    timeout: delay,
    url: rssUrl,
    onload: transferComplete,
    onerror: transferFailed,
    onabort: transferFailed,
    ontimeout: transferFailed
  });
}

function setup() {
  // console.log("Doc domain: ", document.domain);
  // document.domain = "deviantart.com"; // Doesn't work here
  // console.log(document.domain);
  divContent.textContent = "";
  var img1 = document.createElement("img");
  var img2 = document.createElement("img");
  img1.id = "img_load";
  img1.className = "img_loading";
  img2.id = "img_disp";
  img2.className = "img_displayed";
  divContent.appendChild(img1);
  divContent.appendChild(img2);

  imageLoad = $("#img_load");
  imageDisp = $("#img_disp");
  imageLoad.css({
    "max-width": "100%",
    "max-height": "100%",
    "display": "none"
  });
  imageDisp.css({
    "max-width": "100%",
    "max-height": "100%",
    "display": "block",
    "margin": "0 auto"
  });
  console.log("Done with setup()");
}

/**
 * DO THINGS
 */

// Throw something on the page.
divContent.textContent = "Oh, hello there! Give us just a second to fetch your images...";
// Setup the page
setup();
// Kick off the RSS feed loop
doTransfer();


/**
 * ONLY UNUSED CODE BELOW HERE
 */

// googleUrl = document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q=' + encodeURIComponent(rssUrl);

// function getRSS(rssURL) {
//   $.ajax({
//     url: rssURL,
//     type: "GET",
//     crossDomain: true,
//     dataType: 'json',
//     success: function(xml) {
//       deviationData.length = xml.responseData.feed.entries.length;
//       console.log("Array Length: ", deviationData.length);
//       for (var i = 0; i < deviationData.length; i++) {
//         deviationData.push(xml.responseData.feed.entries[i].mediaGroups[0].contents[0].url);
//         //console.log("Image: ", deviationData[i]);
//       }
//       document.getElementById("sitbackcontent").textContent = "";
//       setupImage();
//
//       timerID = window.setInterval(displayNext, 5000);
//       //displayNext();
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log('Unable to load feed, Incorrect path or invalid feed');
//       // console.log('URL: ', googleUrl);
//       // console.log("Returned text: ", textStatus);
//     }
//   });
// }

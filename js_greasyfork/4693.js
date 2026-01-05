// ==UserScript==
// @name Gif TO Gfycat
// @namespace nr
// @author n33t0r
// @description Converts links ending in GIF to Gfycat versions.
// @run-at document-start
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include *.gif
// @grant none
// @icon http://n33t0r.neocities.org/gfy.png
// @version 0.3.2
// @downloadURL https://update.greasyfork.org/scripts/4693/Gif%20TO%20Gfycat.user.js
// @updateURL https://update.greasyfork.org/scripts/4693/Gif%20TO%20Gfycat.meta.js
// ==/UserScript==
//  $(document).ready(function () {
  window.stop();
  var currentUrl = window.location.href;
  getgfy(currentUrl);
  function getgfy(rawGifLink) {
    var urlPrefix = 'http://gfycat.com/cajax/checkUrl/';
    var encGifLink = encodeURI(rawGifLink);
    var reqUrl = urlPrefix + encGifLink;
    $.ajax({
      url: reqUrl,
      type: 'GET',
      datatype: 'json',
      success: function (json) {
        if (json.urlKnown) {
          console.log('Processed Url with link:' + json.gfyUrl);
          redirectFn(json.gfyUrl);
        } 
        else {
          console.log('Url not previously processed');
          if (!json.error) {
            makeNewRequest(encGifLink);
            console.error('Not Valid GIF');
          }
        }
      },
      error: function (xhr, status, errorThrown) {
        console.log('Failed to get AJAX req with status:' + status);
        console.error(errorThrown);
        console.dir(xhr);
      }
    });
  }
  function makeNewRequest(urlSuffix) {
    var urlPrefix = 'http://upload.gfycat.com/transcode?fetchUrl=';
    var requestUrl = urlPrefix + urlSuffix;
    $.ajax({
      url: requestUrl,
      datatype: 'json',
      type: 'GET',
      success: function (json) {
        if (json.gfyName != undefined) {
          console.log('New Url with link:' + 'http://gfycat.com/' + json.gfyName);
          redirectFn('http://gfycat.com/' + json.gfyName);
        }
      },
      error: function (xhr, status, errorThrown) {
        console.log('Failed to get AJAX req with status:' + status);
        console.error(errorThrown);
        console.dir(xhr);
      }
    });
  }
  function redirectFn(urls) {
    console.log('FinalUrl For Redirection is' + urls);
    window.location.replace(urls);
  }
//  });

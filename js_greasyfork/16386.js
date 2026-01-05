// ==UserScript==
// @name        Original Yify Embetterment
// @namespace   yts.ag
// @description Add content ratings to Yify listings and replace torrent urls with magnet links, add hover popup with actors and synopsis.
//
// @include     https://yts.ag/browse-movie*
// @include     http://yts.ag/browse-movie*
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// @version     0.3.1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/16386/Original%20Yify%20Embetterment.user.js
// @updateURL https://update.greasyfork.org/scripts/16386/Original%20Yify%20Embetterment.meta.js
// ==/UserScript==

function addMpaaRating(dom, div) {
  $(".icon-eye", $(dom)).each(function(i) {
    var rating = $(this).parent().text().trim();
    // console.log("mpaa: "+rating);
    var star = div.find('.icon-star');
    star.replaceWith('<h4 class="rating">'+rating+'</h4>');
  });
}

function is1080magnet(url) {
  var index = url.search("1080p");
  return (index > -1);
}

function replaceOriginalTorrentLinks(dom, div) {
  $(".magnet-download", $(dom)).each(function(i) {
    var url = $(this).attr('href');
    // console.log("mag: "+url);
    var orig1080tor = null;
    var orig720tor = null;
    var links = div.find('.browse-movie-tags a');
    $(links).each(function(i) {
      // console.log("test: "+$(this).text());
      if ($(this).text().indexOf("1080p") >= 0) {
        // 1080
        orig1080tor = $(this);
      } else {
        // 720
        orig720tor = $(this);
      }
    });

    if (is1080magnet(url)) {
      // replace 1080 link
      orig1080tor.replaceWith('<a href="'+url+'">1080p</a>');
      // console.log("replaced 1080");
    } else {
      // replace 720 link
      orig720tor.replaceWith('<a href="'+url+'">720p</a>');
      // console.log("replaced 720");
    }
  });
}

function addPopupCast(dom, div) {
  var actors = [];
  var data = null;
  $(".actors span", $(dom)).each(function(i) {
    data = $(this).text();
    if (actors.indexOf(data) == -1) {
      // console.log("Adding ACTOR: "+data);
      actors.push(data);
    }
  });
  var popup = "CAST: " + actors.join(', ');
  $("#synopsis :nth-child(3)", $(dom)).each(function(i) {
    data = $(this).text().trim();
    if (data !== "") {
      popup += "\n\nSYNOPSIS: " + data;
    }
  });
  // console.log(popup);
  div.find("a").prop("title", popup);
}


function imposeMyWill(url, div) {
  var data = null;
  // console.log("IMW-URL: "+ url);
  // console.log("DIV: "+ div);
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function(response) {
      // We've received a response
      data = $.parseHTML(response.responseText);
      // console.log("DATA: "+ data);
      replaceOriginalTorrentLinks(data, div);
      addMpaaRating(data, div);
      addPopupCast(data, div);
      return;
    },
    onerror: function(response) {
      data = JSON.parse(response.responseText);
      console.log('ERROR: '+data);
      // $('#yts-options').html('<p>ERROR! Failed to connect to the YTS website.</p>');
    }
  });
}

function removeAds() {
  var ads = $('a.hidden-xs');
  if (ads.length) {
    console.log('Removing ad box.');
    ads.remove();
  }
}

$(document).ready(function() {
  var divs = $(".col-lg-4");
  var link = null;
  var url = null;

  // removeAds();

  $(divs).each(function(i) {
    link = $(this).find('.browse-movie-link');
    url = link.attr('href');
    // console.log("URL: "+url);
    imposeMyWill(url, $(this));
  });
});

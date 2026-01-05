// ==UserScript==
// @name        Youtube Embed Tweak HTML5 (16 February 2018)
// @namespace 	embedtweak
// @icon        http://i.imgur.com/JyEgdDl.png
// @description	Forces all emdedded Youtube videos to the new player. With options for: Video size, https, hide annotations and hide related and hide controls
// @version	    1.8
// @include	    http*
// @exclude   	*liveleak.com*
// @exclude   	*youtube.com/*
// @exclude    	*redditmedia.com/*
// @exclude    	*twitter.com/*
// @grant       none
//
// Thanks to wOxxOm for contributing observer code.
//
// @downloadURL https://update.greasyfork.org/scripts/3435/Youtube%20Embed%20Tweak%20HTML5%20%2816%20February%202018%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3435/Youtube%20Embed%20Tweak%20HTML5%20%2816%20February%202018%29.meta.js
// ==/UserScript==
//
// Set variables below
//
// Set Video Size, with a 16:9 preset, Large (1024x576) medium (720x405) or Set size in percentage, for a video size as a percantage of the container size.
var videosize = 'medium';
// nochangeurl must be set to no for player settings to work. yes = default url and no = modified url, size is always modified.
var nochangeurl = 'no';
// Show youtube logo, yes or no
var ytlogo = 'yes';
// Show annoations yes or no.
var annotation = 'no';
// Show Related videos at end of playback, yes or no.
var related = 'no';
// Force https option, yes or no
var ssl = 'yes';
// Autoplay, yes or no
var autoplay = 'no';
// The player progress bar colour setting, red or white, white disables the youtube logo setting above
var color = 'white';
// autohide player controls, yes shows, no hides.
var controls = 'no';

////////////////////////////////////////////////
// No need to modify anything past this point //
////////////////////////////////////////////////


var ob = new MutationObserver(function(mutations){
  for (var m, i=0; i<mutations.length && (m=mutations[i]); i++)
    for (var nodes=m.addedNodes, n, j=0; j<nodes.length && (n=nodes[j]); j++)
      if (n.nodeType == Node.ELEMENT_NODE)
        embedTweak(n);
});
ob.observe(document, {subtree:true, childList:true});

if (document.body)
  embedTweak(document.body);

function embedTweak(node) {

var i,j,k,index;
var video_id,video_url,video_link;
var risky_elements,risky_attributes,risky_node;
var risky_tags = [
  'object',
  'embed',
  'iframe'
];
var bad_elements = [
];
var bad_ids = [
];
for (i = 0; i < risky_tags.length; i++) {
  risky_elements = node.getElementsByTagName(risky_tags[i]);
  for (j = 0; j < risky_elements.length; j++) {
    index = 0;
    risky_attributes = risky_elements[j].attributes;
    for (k = 0; k < risky_attributes.length; k++) {
      risky_node = risky_attributes[k].nodeValue;
      if (risky_node.indexOf('youtube.com') >= 0) {
        risky_elements[j].style.display = 'none';
        if (risky_node.indexOf('/v/') >= 0) {
          index = risky_node.indexOf('/v/') + 3;
        } else if (risky_node.indexOf('?v=') >= 0) {
          index = risky_node.indexOf('?v=') + 3;
        } else if (risky_node.indexOf('/embed/') >= 0) {
          index = risky_node.indexOf('/embed/') + 7;
        }
        if (index > 0) {
          video_id = risky_node.substring(index, index + 11);
          bad_elements.push(risky_elements[j]);
          bad_ids.push(video_id);
        }
        break;
      }
    }
  }
}
for (i = 0; i < bad_ids.length; i++) {
  video_id = bad_ids[i];
  if (nochangeurl == 'yes') {
    video_url = 'http://www.youtube.com/embed/' + video_id;
  }
  else {
    if (ssl == 'yes') {
      protid = 'https://';
    }
    if (ssl == 'no') {
      protid = 'http://';
    }
    if (annotation == 'no') {
      ivid = 'iv_load_policy=3&';
    }
    if (annotation == 'yes') {
      ivid = 'iv_load_policy=1&';
    }
    if (related == 'no') {
      relatedid = 'rel=0&';
    }
    if (related == 'yes') {
      relatedid = 'rel=1&';
    }
    if (ytlogo == 'no') {
        ytlogoid = 'modestbranding=1&';
    }
    if (ytlogo == 'yes') {
        ytlogoid = 'modestbranding=0&';
    }
    if (autoplay == 'no') {
        autoplayid = 'autoplay=0&';
    }
    if (autoplay== 'yes') {
        autoplayid = 'autoplay=1&';
    }
    if (color == 'red') {
        colorid = 'color=red&';
    }
    if (color == 'white') {
        colorid = 'color=white&';
    }
    if (controls == 'no') {
        controlsid = 'controls=2&';
    }
    if (controls == 'yes') {
        controlsid = 'controls=1&';
    }
    video_url = protid + 'www.youtube.com/embed/' + video_id + '?' + ivid + relatedid + ytlogoid + autoplayid + colorid + controlsid;
  }
  video_link = document.createElement('iframe');
  video_link.setAttribute('src', video_url);
  if (videosize == 'large') {
    video_link.width = '1024';
    video_link.height = '576';
  }
  if (videosize == 'medium') {
    video_link.width = '720';
    video_link.height = '405';
  }
  video_link.setAttribute('frameborder', '0');
  video_link.setAttribute('allowfullscreen', '1');
  bad_elements[i].parentNode.replaceChild(video_link, bad_elements[i]);
}
}
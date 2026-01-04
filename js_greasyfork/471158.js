// ==UserScript==
// @name         TornChat v2
// @author       ETC[2617154]
// @match        https://www.torn.com/*
// @version      0.8
// @description  Enhances the chat functionality on the Torn website by adding features such as hiding image links, embedding YouTube videos, and expanding image previews.
// @icon         https://i.ibb.co/MCTCRmc/2f9f4ccf109705ec910f06f61c29974a.jpg
// @license      MIT
// @namespace https://greasyfork.org/users/1130202
// @downloadURL https://update.greasyfork.org/scripts/471158/TornChat%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/471158/TornChat%20v2.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = {
  childList: true,
  attributes: true,
  subtree: true,
  attributeFilter: ['class', 'style']
};

myObserver.observe(document.querySelector('#chatRoot'), obsConfig);

function mutationHandler(mutationRecords) {
  mutationRecords.forEach(function (mutation) {
    if (mutation.type == "childList") {
      var section = mutation.addedNodes[0];
      // Catch Valid links
      if (section && section.tagName && section.tagName == 'A') {
        // Hide Image Links
        var href = section.href;
        if (section.className != 'your-class-name' && (href.includes('imgur') || href.includes('gyazo') || href.includes('png') || href.includes('jpg'))) {
          section.hidden = true;
        }
      }
      // When chat box opened
      if (section && section.className && section.className.includes('chat-box-content')) {
        var spans = section.getElementsByTagName("span");
        for (var i = 0; i < spans.length; i++) {
          var span = spans[i];
          // Only select messages
          if (span.title != '') {
            doMedia(span);
          }
        }
      }
      // Catch message
      if (section && section.className && section.className.includes('message')) {
        // Goto span
        var message = section.getElementsByTagName('span')[0];
        doMedia(message);
      }
    }
  });
}

window.addEventListener('load', function() {
  // Get spans
  var root = document.getElementById("chatRoot");
  var spans = root.getElementsByTagName("span");
  for (var i = 0; i < spans.length; i++) {
    var span = spans[i];
    // Only select messages
    if (span.title != '') {
      doMedia(span);
    }
  }
}, false);

function doMedia(span) {
  // Loop through span's children
  for (var j = 0; j < span.children.length; j++) {
    var child = span.children[j];
    // If not A tag, continue
    if (child.tagName != 'A') continue;
    // Simplify link
    var link = child.href;
    // Catch media links
    if (link.includes('youtu.be') || link.includes('www.youtube')) {
      var code = getYoutubeCode(link);

      // Create video element
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + code;
      iframe.classList.add('your-class-name');
      iframe.frameBorder = 0;
      span.appendChild(iframe);
      child.hidden = true;
    } else if (link.includes('imgur') || link.includes('gyazo') || link.includes('png') || link.includes('jpg')) {
      // Clean and format image links
      if (link.includes('gyazo')) {
        var splice = link.split('//');
        var splice2 = link.split('//');
        splice.splice(1, 0, "//i.");
        splice.splice(4, 0, ".jpg");
        link = splice.join('');
        splice2.splice(1, 0, "//i.");
        splice2.splice(4, 0, ".png");
        var link2 = splice2.join('');

        var x = document.createElement('div');
        var s = '<a href=' + link + ' class="your-class-name" target="_blank"><img src="' + link + '" alt="" style="width: -webkit-fill-available;"/></a>';
        var s2 = '<a href=' + link2 + ' class="your-class-name" target="_blank"><img src="' + link2 + '" alt="" style="width: -webkit-fill-available;"/></a>';
        x.innerHTML = s + s2;
        span.appendChild(x);
        child.hidden = true;
        continue;
      } else if (!link.includes('png') && !link.includes('jpg') && !link.includes('jpeg') && !link.includes('gif')) {
        // If no file extension, add .png
        splice = link.split('//');
        splice.splice(1, 0, "//i.");
        splice.splice(4, 0, ".png");
        link = splice.join('');
      }
      // Create image element
      var x = document.createElement('div');
      var s = '<a href=' + link + ' class="your-class-name" target="_blank"><img src="' + link + '" style="width: -webkit-fill-available;"/></a>';
      x.innerHTML = s;
      span.appendChild(x);
      child.hidden = true;
    }
  }
}

function getYoutubeCode(link) {
  var code = '';
  if (link.includes('youtu.be')) {
    code = link.substr(link.lastIndexOf('/') + 1);
  } else if (link.includes('www.youtube')) {
    code = link.split("?v=")[1];
    code = code.split("&")[0];
  }
  return code;
}
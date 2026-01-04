// ==UserScript==
// @name fuck embeds
// @description fuck
// @version 0.1
// @namespace Violentmonkey Scripts
// @match *://*/*
// @grant none
// 
// @downloadURL https://update.greasyfork.org/scripts/430460/fuck%20embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/430460/fuck%20embeds.meta.js
// ==/UserScript==

var sites = [
  {
    'embed_url': /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/embed\/.+$/,
    'orig_url': function(u) {
      let id = /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/embed\/([\w-]{1,11}).*$/.exec(u);
      if (id) {
        id = id[1];
      } else {
        return false;
      }
      return "https://www.youtube.com/watch?v="+id;
    }
  },
  {
    'embed_url': /^https:\/\/(?:\w{0,3}\.)?pornhub\.com\/embed\/\w+$/,
    'orig_url': function(u) {
      let id = /^https:\/\/(?:\w{0,3}\.)?pornhub\.com\/embed\/(\w+)$/.exec(u);
      if (id) {
        id = id[1];
      } else {
        return false;
      }
      return "https://pornhub.com/view_video.php?viewkey="+id;
    }
  },
  {
    'embed_url': /^(?:https:)?\/\/(?:www\.)?dailymotion\.com\/embed\/video\/[a-z0-9]{7}$/,
    'orig_url': function(u) {
      return u.replace("/embed", "");
    }
  },
  {
    'embed_url': /^https\:\/\/player\.vimeo\.com\/video\/\d*$/,
    'orig_url': function(u) {
      return u.replace("/video", "").replace("player.", "");
    }
  },
  {
    'embed_url': /^https?:\/\/(?:www\.)?vlive\.tv\/embed\/\d*$/,
    'orig_url': function(u) {
      return u.replace("/embed", "/video");
    }
  },
  {
    'embed_url': /^(?:https?:)?\/\/tv\.naver\.com\/embed\/\d+(?:\?.*)?/,
    'orig_url': function(u) {
      let id = /^(?:https?:)?\/\/tv\.naver\.com\/embed\/(\d+)(?:\?.*)?/.exec(u);
      if (id) {
        id = id[1];
      } else {
        return false;
      }
      return "https://tv.naver.com/v/"+id;
    }
  }
]

let ob = new window.MutationObserver(function() {
  let ifr = document.querySelectorAll('iframe');
  ifr.forEach(function(i) {
    let src = i.getAttribute('src');
    sites.forEach(function(site) {
      if (site.embed_url.test(src)) {
        src = site.orig_url(src);
        let a = document.createElement('a');
        a.innerHTML = src;
        a.setAttribute('href', src);
        a.setAttribute('target', '_blank');
        i.parentNode.replaceChild(a, i);
        return;
      }
    });
  });
});

ob.observe(document, {
  childList: true,
  subtree: true,
});
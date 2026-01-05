// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Linkify
// @namespace   https://greasyfork.org/users/2291
// @description Turns text-URLs into working links. This applies to every webpage
//              so turn it off if you don't need it, it can slow things down.
// @match       http://*/*
// @match       https://*/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/1805/ZSMTurker%27s%20Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/1805/ZSMTurker%27s%20Linkify.meta.js
// ==/UserScript==

function linkify(string, buildHashtagUrl, includeW3, target, noFollow) {
  relNoFollow = "";
  if (noFollow) {
    relNoFollow = " rel=\"nofollow\"";
  }
  
  string = string.replace(/((http|https|ftp)\:\/\/|\bw{3}\.)[a-z0-9\-\.]+\.[a-z]{2,3}(:[a-z0-9]*)?\/?([a-z\u00C0-\u017F0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])*/gi, function(captured) {
    var uri;
    if (captured.toLowerCase().indexOf("www.") == 0) {
      if (!includeW3) {
        return captured;
      }
      uri = "http://" + captured;
    } else {
      uri = captured;
    }
    return "<a href=\"" + uri+ "\" target=\"" + target + "\"" + relNoFollow + ">" + captured + "</a>";
  });
  
  if (buildHashtagUrl) {
    string = string.replace(/\B#(\w+)/g, "<a href=" + buildHashtagUrl("$1") +" target=\"" + target + "\"" + relNoFollow + ">#$1</a>");
  }
  return string;
}

(function($) {
  $.fn.linkify = function(opts) {
    return this.each(function() {
      var $this = $(this);
      var buildHashtagUrl;
      var includeW3 = true;
      var target = '_self';
      var noFollow = true;
      if (opts) {
        if (typeof opts == "function") {
          buildHashtagUrl = opts;
        } else {
          if (typeof opts.hashtagUrlBuilder == "function") {
            buildHashtagUrl = opts.hashtagUrlBuilder;
          }
          if (typeof opts.includeW3 == "boolean") {
            includeW3 = opts.includeW3;
          }
          if (typeof opts.target == "string") {
            target = opts.target;
          }
          if (typeof opts.noFollow == "boolean") {
            noFollow = opts.noFollow;
          }
        }
      }
      $this.html(
          $.map(
            $this.contents(),
            function(n, i) {
                if (n.nodeType == 3) {
                    return linkify(n.data, buildHashtagUrl, includeW3, target, noFollow);
                } else {
                    return n.outerHTML;
                }
            }
        ).join("")
      );
    });
  }
})(jQuery);

$( window ).on( 'load', function() {
    $('p').linkify();
} );
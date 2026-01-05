// ==UserScript==
// @name           Reddit Link Hijack Remover
// @author	       jmesmon
// @description    Remove link-click tracking from reddit
// @include        *://reddit.com/*
// @include        *://*.reddit.com/*
// @grant          none
// @namespace      https://github.com/jmesmon
// @license        AGPL3
// @supportURL	   https://github.com/jmesmon/greasy/issues
// @run-at         document-end
// @version 0.0.1.20210226040629
// @downloadURL https://update.greasyfork.org/scripts/20752/Reddit%20Link%20Hijack%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/20752/Reddit%20Link%20Hijack%20Remover.meta.js
// ==/UserScript==

// TODO: consider if run-at document-start is useful, and how we can
// effectively hook urls as they show up in that case (right now it doesn't
// work).

(function () {
  'use strict';
  function cl(ac) {
    var a = ac.querySelectorAll('a.outbound');
    var ct_out = 0, ct_aff = 0, ct = 0, ct_in = 0;
    for (var i = 0; i < a.length; i++) {
      /*
      // This is reddit's function to determine the url, which is stored in `o`.
      // It then hooks window unload to call sendBeacon with the url in `o` or
      // modifies the href attribute (if sendBeacon is disabled in config or unsupported by the browser).
      function o(e) {
       var t = $(e),
        r = Date.now(),
        o;
       return t.attr('data-inbound-url')
         ? o = t.attr('data-inbound-url')
         : !n && t.attr('data-outbound-expiration') > r && (o = t.attr('data-outbound-url')),
         o && (i ? s = o : e.href = o),
       !0
      }
      */

      // Some minimal counting so we can tell things are working
      if (a[i].getAttribute('data-inbound-url')) {
        ct_in++;
      }
      if (a[i].getAttribute('data-affiliate-url')) {
        ct_aff++;
      }
      if (a[i].getAttribute('data-outbound-url') || a[i].getAttribute('data-outbound-expiration')) {
        ct_out++;
      }

      // Goals:
      //  - make sure `o` stays undefined.
      //  - avoid ever getting this function called
      // Removing all the relevent attributes gets us both of those

      // Unclear what the purpose of these is, but they are being used to
      // re-write urls (and trigger entry to the fn above), so remove.
      a[i].removeAttribute('data-inbound-url');

      // Doesn't appear that reddit is injecting these affiliate links
      // anymore, but no reason to remove this
      a[i].removeAttribute('data-affiliate-url');

      // We don't actually need to remove this, but it does short circuit
      // the condition quicker & cleans up the html, so do it.
      a[i].removeAttribute('data-outbound-expiration');
      a[i].removeAttribute('data-outbound-url');
      a[i].classList.remove('outbound');
      ct++;
    }

    console.log('hijacks removed: outbound ' + ct_out + ', inbound ' + ct_in + ', affiliate ' + ct_aff + ', examined ' + ct);
  }

  var obs = new MutationObserver(function (r, self) {
    for (var i = 0; i < r.length; i++) {
      var ad = r[i].addedNodes;
      for (var j = 0; j < ad.length; j++) {
        var n = ad[j];
        cl(n);
      }
    }
  });
  obs.observe(document, {
    childList: true,
    subtree: true
  });

  // TODO: consider patching out window.navigator.sendBeacon (which reddit only uses for this link tracking)
  // TODO: consider blocking the recent_srs cookie used for tracking
  cl(document);
}) ();


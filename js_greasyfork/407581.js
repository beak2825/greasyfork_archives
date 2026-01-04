// ==UserScript==
// @name        Remove URL parameters
// @description Hides UTM and other tracking parameters from URLs.
// @include     http://*
// @include     https://*
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/407581/Remove%20URL%20parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/407581/Remove%20URL%20parameters.meta.js
// ==/UserScript==

{
   let url = new URL(window.location.href);
   {  // Remove garbage keys
      let params = url.searchParams;
      if (params.get("wpsrc") == "socialedge")
         params.delete("wpsrc");
      for(var key of params.keys()) {
         switch (key) {
            case "tse_id":
               params.delete(key);
               continue;
         }
         if (key.startsWith("utm_"))
            params.delete(key);
      }
   }
   //
   // show altered URL in URL bar
   //
   history.replaceState(
      {},
      window.title,
      url.href
   );
}
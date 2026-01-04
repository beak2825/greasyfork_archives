// ==UserScript==
// @name         Google Lucky Bang
// @namespace    https://greasyfork.org/en/users/8615-joeytwiddle
// @version      1.0.3
// @description  Add a ! to the end of your google search to perform a lucky search
// @author       joeytwiddle
// This is supposed to be all google search sites.  Copied from faviconizegoogle.user.js
// But then I also added /url pages, to catch "Redirect Notice"s
// @include      /https?:\/\/((www\.)?|encrypted\.)google\.[a-z]{2,3}(\.[a-z]{2})?\/(search|webhp|\?gws_rd|\?gfe_rd|url)?.*/
// TODO This currently acts on pages which do not support lucky search (e.g. Google Images).  Ideally we would activate only on pages where we can actually help!
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/390477/Google%20Lucky%20Bang.user.js
// @updateURL https://update.greasyfork.org/scripts/390477/Google%20Lucky%20Bang.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const params = {};
  document.location.search.slice(1).split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });

  // If we are on a search page, and the query ends with "!", then change to a lucky search (and remove the "!")
  if (document.location.pathname === '/search') {

    if (params.q && params.q.slice(-1) === '!') {
      const newQuery = params.q.slice(0, -1);

      console.log("Doing lucky search for:", newQuery);

      // Store the time
      GM_setValue('lucky_search_initiated', String(Date.now()));

      // Example lucky URL: https://www.google.com/search?sxsrf=ACYBGNS3YpGqRlxp6MfsZ-8oYSGTyllGOA%3A1569379745064&source=hp&ei=odWKXeO0Af_B3LUPoNaDuAQ&q=test%21&btnI=I%27m+Feeling+Lucky&oq=test%21&gs_l=psy-ab.3..0i131j0l9.9511.10195..14336...0.0..0.69.340.6......0....1..gws-wiz.....10..35i362i39j35i39j0i67j0i131i67.HtcsjjxXywM

      //const newUrl = `${document.location.origin}/search?q=${encodeURIComponent(newQuery)}&btnI=I%27m+Feeling+Lucky`;
      const { origin, pathname, search } = document.location;
      const newUrl = `${origin}${pathname}${search.replace(/\bq=[^&]*/, `q=${encodeURIComponent(newQuery)}`)}&btnI=I%27m+Feeling+Lucky`;

      //document.location.replace(newUrl);
      document.location.assign(newUrl);
    }
  }

  // Problem: After the above code, Google was taking us to a "Redirect Notice" page.
  // "The page you were on is trying to send you to ..."
  // Solution: If we are on a "Redirect Notice" page, and within a reasonable time window of a lucky search, then automatically follow the link
  if (document.location.pathname === '/url') {
    const startTime = Number(GM_getValue('lucky_search_initiated'));
    if (typeof startTime === 'number' && startTime >= Date.now() - 15 * 1000 && startTime <= Date.now()) {
      const url = params.q;
      if (url) {
        console.log("Automatically following the redirect to:", url);
        GM_setValue('lucky_search_initiated', '');
        //document.location.replace(url);
        document.location.assign(url);
      }
    }
  }
})();

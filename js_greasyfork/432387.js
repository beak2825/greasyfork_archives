// ==UserScript==
// @name        General URL Cleaner Revived
// @namespace   https://greasyfork.org/en/users/594496-divided-by
// @author      dividedby
// @description Cleans URLs from various popular sites and removes tracking parameters
// @version     4.2.6
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=dividedbyerror@gmail.com&item_name=Greasy+Fork+Donation
// @contributionAmount  $1
// @include     https://www.newegg.com/*
// @include     https://www.newegg.ca/*
// @include     /^https:\/\/[a-z.]*\.?bing(\.[a-z]{2,3})?(\.[a-z]+)?\/.*$/
// @include     https://www.youtube.com/*
// @include     https://www.imdb.com/*
// @include     https://www.facebook.com/*
// @include     https://disqus.com/embed/comments/*
// @include     https://www.target.com/*
// @include     https://www.linkedin.com/*
// @include     https://www.etsy.com/*
// @include     https://www.yahoo.com/*
// @include     /^https:\/\/[a-z0-9.]*\.?amazon(\.[a-z0-9]{2,3})?(\.[a-z]+)?\/.*$/
// @include     /^https:\/\/[a-z0-9.]*\.?google(\.[a-z0-9]{2,3})?(\.[a-z]+)?\/.*$/
// @include     /^https:\/\/[a-z0-9.]*\.?ebay(desc)?(\.[a-z0-9]{2,3})?(\.[a-z]+)?\/.*$/
// @include     /^https:\/\/[a-z0-9.]*twitter.com\/.*$/
// @exclude     /^https:\/\/[a-z0-9.]*\.?amazon(\.[a-z0-9]{2,3})?(\.[a-z]+)?\/(?:gp\/(?:cart|buy|css|legacy|your-account).*|sspa.*)$/
// @exclude     https://apis.google.com/*
// @exclude     https://accounts.google.com/*
// @exclude     https://support.google.com/*
// @exclude     https://www.google.com/recaptcha/*
// @exclude     https://hangouts.google.com/webchat/*
// @exclude     https://gsuite.google.com/*
// @exclude     https://calendar.google.com/*
// @exclude     https://docs.google.com/spreadsheets/*
// @exclude     https://takeout.google.com/*
// @run-at      document-idle

// @downloadURL https://update.greasyfork.org/scripts/432387/General%20URL%20Cleaner%20Revived.user.js
// @updateURL https://update.greasyfork.org/scripts/432387/General%20URL%20Cleaner%20Revived.meta.js
// ==/UserScript==

(() => {
  /*
   * Vars
   */

  const currHost = location.host;
  const currPath = location.pathname;
  const currSearch = location.search;

  const ebay = /^[a-z.]*\.?ebay(desc)?(\.[a-z]{2,3})?(\.[a-z]+)?$/;
  const amazon = /^[a-z.]*\.?amazon(\.[a-z]{2,3})?(\.[a-z]+)?$/;
  const google = /^[a-z.]*\.?google(\.[a-z]{2,3})?(\.[a-z]+)?$/;
  const target = /^[a-z.]*\.?target\.com$/;
  const bing = /^[a-z.]*\.?bing(\.[a-z]{2,3})?(\.[a-z]+)?$/;

  const amazonParams =
    /&?_?(encoding|crid|sprefix|ref|th|url|ie|pf_rd_[^&#]*?|pd_rd_[^&#]*?|bbn|rw_html_to_wsrp|ref_|content-id)(=[^&#]*)?($|&)/g;
  const neweggParams = /&(cm_sp|icid|ignorebbr)(=[^&#]*)?($|&)/g;
  const imdbParams = /&(pf_rd_[a-z]|ref_)(=[^&#]*)?($|&)/g;
  const bingParams =
    /&(redig|toWww|ghpl|lq|ghc|ghsh|ghacc|ghpl|go|qs|form|FORM|filt|pq|s[cpk]|qpvt|cvid)(=[^&#]*)?(?=$|&)/g;
  const youtubeParams =
    /&(feature|src_vid|annotation_id|[gh]l)(=[^&#]*)?($|&)/g;
  const ebayParams = /[?&](_(o?sacat|odkw|from|trksid)|rt)(=[^&#]*)?(?=&|$)/g;
  const twitterParams = /&(src|ref_src|ref_url|vertical|s)(=[^&#]*)?($|&)/g;
  const targetParams = /&(lnk|tref|searchTermRaw)(=[^&#]*)?($|&)/g;
  const facebookParams = /&(set)(=[^&#]*)?($|&)/g;
  const googleParams =
    /(?:&|^)(uact|iflsig|sxsrf|ved|source(id)?|s?ei|tab|tbo|h[ls]|authuser|n?um|ie|aqs|as_qdr|bav|bi[wh]|bs|bvm|cad|channel|complete|cp|s?client|d[pc]r|e(ch|msg|s_sm)|g(fe|ws)_rd|gpsrc|noj|btnG|o[eq]|p(si|bx|f|q)|rct|rlz|site|spell|tbas|usg|xhr|gs_[a-z]+)(=[^&#]*)?(?=$|&)/g;
  const linkedinParams =
    /&(eBP|refId|trackingId|trk|flagship3_search_srp_jobs|lipi|lici)(=[^&#]*)?($|&)/g;
  const etsyParams =
    /&(click_key|click_sum|ref|pro|frs|ga_order|ga_search_type|ga_view_type|ga_search_query|sts|organic_search_click|plkey)(=[^&#]*)?($|&)/g;
  const yahooParams = /&(guccounter|guce_referrer|guce_referrer_sig)(=[^&#]*)?($|&)/g;

  /*
   * Main
   */

  if (bing.test(currHost)) {
    setCurrUrl(cleanBing(currSearch));
    cleanLinks(parserAll);
    return;
  }

  if (currHost == "www.linkedin.com") {
    setCurrUrl(cleanLinkedin(currSearch));
    cleanLinks(parserAll);
    return;
  }

  if (currHost == "www.etsy.com") {
    setCurrUrl(cleanEtsy(currSearch));
    cleanLinks(parserAll);
    return;
  }

  if (currHost == "www.yahoo.com") {
    setCurrUrl(cleanYahoo(currSearch));
    cleanLinks(parserAll);
    return;
  }

  if (currHost === "www.youtube.com") {
    if (currPath === "/redirect") {
      location.href = cleanYoutubeRedir(currSearch);
    }

    if (currPath === "/watch") {
      setCurrUrl(cleanYoutube(currSearch));
    }

    cleanLinks(parserYoutube);
    return;
  }

  if (currHost.endsWith(".newegg.com") || currHost.endsWith(".newegg.ca")) {
    if (currSearch) {
      setCurrUrl(cleanNewegg(currSearch));
    }

    cleanLinks(parserNewegg);
    return;
  }

  if (currHost === "www.imdb.com") {
    if (currSearch) {
      setCurrUrl(cleanImdb(currSearch));
    }

    cleanLinks(parserIMDB);
    onhashchange = deleteHash();
    return;
  }

  if (google.test(currHost)) {
    if (currPath === "/url" || currPath === "/imgres") {
      location.href = cleanGenericRedir(currSearch);
    }

    if (!currSearch && !/[&#]q=/.test(location.hash)) {
      return;
    }

    setCurrUrl(cleanGoogle(currPath + currSearch));
    changeState(googleInstant);

    if (currSearch.includes("tbm=isch")) {
      cleanLinksAlways(parserGoogleImages);
    } else {
      cleanLinks(parserGoogle);
    }

    return;
  }

  if (ebay.test(currHost)) {
    if (currPath.includes("/itm/")) {
      setCurrUrl(cleanEbayItem(location));
    } else if (currSearch) {
      setCurrUrl(cleanEbayParams(currSearch));
    }

    cleanLinks(parserEbay);
    onhashchange = deleteHash;
    return;
  }

  if (target.test(currHost)) {
    if (currPath.includes("/p/")) {
      setCurrUrl(cleanTargetItemp(location));
    } else if (currSearch) {
      setCurrUrl(cleanTargetParams(currSearch));
    }

    cleanLinks(parserTarget);
    onhashchange = deleteHash;
    return;
  }

  if (amazon.test(currHost)) {
    if (currPath.includes("/dp/")) {
      setCurrUrl(cleanAmazonItemdp(location));
    } else if (currPath.includes("/gp/product")) {
      setCurrUrl(cleanAmazonItemgp(location));
    } else if (currSearch) {
      setCurrUrl(cleanAmazonParams(currSearch));
    }

    cleanLinks(parserAmazon);
    onhashchange = deleteHash();
    return;
  }

  if (currHost == "twitter.com") {
    if (currSearch) {
      setCurrUrl(cleanTwitterParams(currSearch));
    }

    cleanLinks(parserTwitter);
    return;
  }

  if (currHost == "www.facebook.com") {
    if (currSearch) {
      setCurrUrl(cleanFacebookParams(currSearch));
    }

    cleanLinks(parserFacebook);
    return;
  }

  if (currHost == "disqus.com") {
    cleanLinks(parserDisqus);
    return;
  }

  if (currHost === "app.getpocket.com") {
    cleanLinks(parserAll);
    return;
  }

  /*
   * Boilerplate functions
   */

  function setCurrUrl(url) {
    history.replaceState(null, null, url);
  }

  function deleteHash() {
    history.replaceState(null, null, " ");
  }

  function observe(func) {
    new MutationObserver(func).observe(document, {
      childList: true,
      subtree: true,
    });
  }

  // Clean links once, mark as cleaned, then ignore them
  function cleanLinks(linkParser) {
    observe(function () {
      for (let a of document.links) {
        if (a.cleaned) {
          continue;
        }

        if (a.protocol && a.protocol.startsWith("http")) {
          linkParser(a);
        }

        a.cleaned = 1;
      }
    });
  }

  // Always clean links
  function cleanLinksAlways(linkParser) {
    observe(function () {
      for (let a of document.links)
        if (a.protocol && a.protocol.startsWith("http")) {
          linkParser(a);
        }
    });
  }

  function googleInstant(url) {
    let parts = url.split("#");
    if (parts.length !== 2) {
      return url;
    }

    let hash = parts[1];
    if (hash === "imgrc=_") {
      return " ";
    }

    if (/(^|&)q=/.test(hash)) {
      return "?" + hash;
    }

    return "#" + hash;
  }

  // Intercept & modify url passed into history.replaceState/pushState
  function changeState(mod) {
    history.realPushState = history.pushState;
    history.realReplaceState = history.replaceState;

    history.pushState = function () {
      history.realPushState(null, null, mod(arguments[2]));
    };

    history.replaceState = function () {
      history.realReplaceState(null, null, mod(arguments[2]));
    };
  }

  /*
   * Link parsing functions
   */

  function parserAll(a) {
    let host = a.host;
    let path = a.pathname;
    if (a.cleaned) {
      return;
    }

    if (google.test(host)) {
      if (path === "/imgres" || path === "/url") {
        a.href = cleanGenericRedir(a.search);
      } else if (a.search) {
        a.search = cleanGoogle(a.search);
      }

      return;
    }

    if (host === "www.youtube.com") {
      if (path === "/watch") {
        a.search = cleanYoutube(a.search);
      } else if (path === "/redirect") {
        a.href = cleanYoutubeRedir(a.search);
      }

      a.cleaned = 1;
      return;
    }

    if (host === "getpocket.com") {
      if (path === "/redirect") {
        a.href = cleanPocketRedir(a.href);
      }
    }

    parserAmazon(a);
    parserEbay(a);
    parserNewegg(a);
    parserIMDB(a);

    if (a.search) {
      a.search = cleanUtm(a.search);
    }

    if (a.hash) {
      a.hash = cleanUtm(a.hash);
    }

    a.cleaned = 1;
  }

  function parserGoogle(a) {
    a.removeAttribute("onmousedown");
    parserAll(a);
  }

  function parserGoogleImages(a) {
    let jsaction = a.getAttribute("jsaction");
    if (jsaction && jsaction.includes("down:irc.rl")) {
      console.log(a);
      a.removeAttribute("jsaction");
    }

    a.removeAttribute("onmousedown");
    parserAll(a);
  }

  function parserYoutube(a) {
    parserAll(a);
    let text = a.innerText;
    let href = a.getAttribute("href");
    if (
      text === href ||
      (text.endsWith("...") && href.startsWith(text.slice(0, -3)))
    ) {
      a.innerText = href;
    }
  }

  function parserTarget(a) {
    if (!target.test(a.host)) {
      return;
    }

    if (a.pathname.includes("/p/")) {
      a.href = cleanTargetItemp(a);
    } else if (a.search) {
      a.href = cleanTargetParams(a.href);
    }
  }

  function parserAmazon(a) {
    if (!amazon.test(a.host)) {
      return;
    }

    if (a.pathname.includes("black-curtain-redirect.html")) {
      a.href = cleanAmazonRedir(location);
    } else if (a.pathname.includes("/dp/")) {
      a.href = cleanAmazonItemdp(a);
    } else if (a.pathname.includes("/gp/product")) {
      a.href = cleanAmazonItemgp(a);
    } else if (a.pathname.includes("/picassoRedirect")) {
      a.href = cleanGenericRedir(a.search);
      a.search = "";
    } else if (a.search) {
      a.href = cleanAmazonParams(a.href);
    }

    if (a.pathname.includes("/ref=")) {
      a.pathname = cleanAmazonParams(a.pathname);
    }
  }

  function parserEbay(a) {
    if (!ebay.test(a.host)) {
      return;
    }

    if (a.pathname.includes("/itm/")) {
      a.href = cleanEbayItem(a);
    } else if (a.host.startsWith("pulsar.")) {
      a.href = cleanEbayPulsar(a.search);
    } else if (a.search) {
      a.search = cleanEbayParams(a.search);
    }
  }

  function parserNewegg(a) {
    if (!a.host.endsWith(".newegg.com") && !a.host.endsWith(".newegg.ca")) {
      return;
    }

    if (a.search && !a.pathname.includes("/marketplace/")) {
      a.search = cleanNewegg(a.search);
    }
  }

  function parserIMDB(a) {
    if (a.host === "www.imdb.com" && a.search) {
      a.search = cleanImdb(a.search);
    }
  }

  function parserTwitter(a) {
    if (a.host !== "t.co") {
      return;
    }

    let fake = "t.co" + a.pathname;
    let real = a.getAttribute("data-expanded-url");
    if (real) {
      a.href = real;
      a.removeAttribute("data-expanded-url");
      sessionStorage.setItem(fake, real);
      return;
    }

    if (!a.classList.contains("TwitterCard-container")) {
      return;
    }

    real = sessionStorage.getItem(fake);
    if (real) {
      a.href = real;
    }
  }

  function parserFacebook(a) {
    let onclick = a.getAttribute("onclick");
    if (!onclick || !onclick.startsWith("LinkshimAsyncLink")) {
      return;
    }

    if (a.host !== "l.facebook.com") {
      return;
    }

    a.href = cleanGenericRedir(a.search);
    a.removeAttribute("onclick");
    a.removeAttribute("onmouseover");
  }

  function parserDisqus(a) {
    if (a.host === "disq.us" && a.pathname === "/url") {
      a.href = a.href.replace(/\:.*/, "");
    }
    a.href = cleanGenericRedir(a.search);

    parserAll(a);
  }

  /*
   * URL string functions
   */

  function cleanGoogle(url) {
    return url.replace("?", "?&").replace(googleParams, "").replace("&", "");
  }

  function cleanBing(url) {
    return url
      .replace("?", "?&")
      .replace(bingParams, "")
      .replace("&", "")
      .replace(/\?$/, "");
  }

  function cleanLinkedin(url) {
    return url.replace("?", "?&").replace(linkedinParams, "").replace("&", "");
  }

  function cleanEtsy(url) {
    return url.replace("?", "?&").replace(etsyParams, "").replace("&", "");
  }

  function cleanYahoo(url) {
    return url.replace("?", "?&").replace(yahooParams, "").replace("&", "");
  }

  function cleanTwitterParams(url) {
    return url.replace("?", "?&").replace(twitterParams, "").replace("&", "");
  }

  function cleanYoutube(url) {
    return url.replace("?", "?&").replace(youtubeParams, "").replace("&", "");
  }

  function cleanImdb(url) {
    return url
      .replace("?", "?&")
      .replace(imdbParams, "")
      .replace("&", "")
      .replace(/\?$/, "");
  }

  function cleanNewegg(url) {
    return url.replace("?", "?&").replace(neweggParams, "").replace("&", "");
  }

  function cleanTargetParams(url) {
    return url
      .replace("?", "?&", "#")
      .replace(targetParams, "")
      .replace("&", "");
  }

  function cleanFacebookParams(url) {
    return url
      .replace("?", "?&", "#")
      .replace(facebookParams, "")
      .replace("&", "");
  }

  function cleanAmazonParams(url) {
    return url
      .replace("?", "?&")
      .replace(amazonParams, "")
      .replace("&", "")
      .replace(/\?$/, "");
  }

  function cleanEbayParams(url) {
    return url.replace("?", "?&").replace(ebayParams, "").replace("&", "");
  }

  function cleanTargetItemp(a) {
    let item = a.pathname.replace(/(?<=\/p).*(?=\/A)/, "");
    return a.origin + item;
  }

  function cleanAmazonItemgp(a) {
    let item = a.pathname.match(/\/[A-Z0-9]{10}/);
    return a.origin + "/gp/product" + item + a.hash;
  }

  function cleanAmazonItemdp(a) {
    let item = a.pathname.match(/\/dp(\/[A-Z0-9]{10})/)[1];
    return a.origin + "/dp" + item + a.hash;
  }

  function cleanEbayItem(a) {
    let item = a.pathname.match(/\/[0-9]{12}/);
    let origList = a.search.replace(/&/g, "?").match(/\?orig_cvip=[^?]+/) || "";
    return a.origin + "/itm" + item + origList + a.hash;
  }

  function cleanEbayPulsar(url) {
    let item = url.match(/%7B%22mecs%22%3A%22([0-9]{12})/).pop();
    return location.origin + "/itm/" + item;
  }

  function cleanYoutubeRedir(url) {
    return decodeURIComponent(url.match(/[?&]q=([^&]+)/).pop());
  }

  function cleanAmazonRedir(url) {
    return decodeURIComponent(url.match(/[?&]redirectUrl=([^&]+)/).pop());
  }

  function cleanGenericRedir(url) {
    return decodeURIComponent(url.match(/[?&](new|img)?u(rl)?=([^&]+)/i).pop());
  }

  function cleanGenericRedir2(url) {
    return decodeURIComponent(url.match(/[?&]\w*url=([^&]+)/i).pop());
  }

  function cleanUtm(url) {
    var urlparts = url.split("?");
    if (urlparts.length >= 2) {
      var pars = urlparts[1].split(/[&;]/g);
      //reverse iteration as may be destructive
      for (var i = pars.length; (i -= 1) > 0; ) {
        if (/^utm_/.test(pars[i])) {
          pars.splice(i, 1);
        }
      }
      return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    }
    return url;
  }

  function cleanPocketRedir(url) {
    return decodeURIComponent(
      url.replace("https://getpocket.com/redirect?url=", "")
    );
  }
})();

// ==UserScript==
// @name         CleanURLs (Clean URL Improved)
// @namespace    i2p.schimon.cleanurl
// @description  Remove tracking parameters and redirect to original URL. This software utilizes the URL Interface instead of RegEx.
// @homepageURL  https://greasyfork.org/scripts/465933-clean-url-improved
// @supportURL   https://greasyfork.org/scripts/465933-clean-url-improved/feedback
// @author       Schimon Jehudah
// @collaborator Angilbert Dimitri
// @collaborator LeDimiScript
// @collaborator アンジルベールディミトリ
// @copyright    2023 - 2026, Schimon Jehudah (http://schimon.i2p)
// @license      MIT; https://opensource.org/licenses/MIT
// @run-at       document-start
// @match        file:///*
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @version      26.01.27
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5qlPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/465933/CleanURLs%20%28Clean%20URL%20Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465933/CleanURLs%20%28Clean%20URL%20Improved%29.meta.js
// ==/UserScript==

/*

NEWS

Handle /ref=

Added .replace(/\/ref=/g, "/?ref=")

Coding like a Japanese

TODO

1) Delete empty parameters

2) Statistics
    GM.getValue("links-total")
    GM.getValue("links-bad")
    GM.getValue("links-good")
    GM.getValue("parameters-total")
    GM.getValue("parameters-bad")
    GM.getValue("parameters-good")
    GM.getValue("parameters-urls")
    GM.getValue("parameters-unclassified")

    GM.setValue("pbl", "hostname-parameter")
    GM.setValue("pwl", "hostname-parameter")

3.1) Keep the position on the link (not near)

3.2) Focus cursor on the yellow or white spot.

3.3.) Be more strict on shopping websites (e.g. Remove parameter "tag").

FIXME

Whitelisted parameters without values are realized to purged-url

*/

/*

Simple version of this Userscript
let url = new URL(location.href);
if (url.hash || url.search) {
  location.href = url.origin + url.pathname
};

*/

// https://openuserjs.org/scripts/tfr/YouTube_Link_Cleaner

// Check whether HTML; otherwise, exit.
//if (!document.contentType == "text/html")
//if (document.doctype == null) return;

var gmGetValue,
    gmSetValue,
    gmNotification,
    gmRegisterMenuCommand;

if (typeof GM !== "undefined" && typeof GM.getValue === "function") {
  gmGetValue = true;
} else {
  gmGetValue = false;
  console.warn("Greasemonkey API GM.getValue does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.setValue === "function") {
  gmSetValue = true;
} else {
  gmSetValue = false;
  console.warn("Greasemonkey API GM.setValue does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.notification === "function") {
  gmNotification = true;
} else {
  gmNotification = false;
  console.warn("Greasemonkey API GM.notification does not seem to be available.");
}

if (typeof GM !== "undefined" && typeof GM.registerMenuCommand === "function") {
  gmRegisterMenuCommand = true;
} else {
  gmRegisterMenuCommand = false;
  console.warn("Greasemonkey API GM.registerMenuCommand does not seem to be available.");
}

var itemColor, newURLItem, selectionItem, urlParameter;

//let point = [];
const namespace = "i2p.schimon.cleanurl";

// List of url parameters
const urls = [
  "ap_id",
  "media",
  "mortyurl",
  "redirect",
  "ref",
  "rf",
  "source",
  "src",
  "target",
  "url",
  "utm_source",
  "utm_term"];

// List of alphabet
const alphabet = "abcdefghijklmnopqrstuvwxyz";

// List of reserved parameters
const whitelist = [
  "_action",              // roundcube
  "_task",                // roundcube
  "act",                  // invision board
  "action",               // bugzilla
  "activeTab",            // npmjs
  "all-lists",            // hyperkitty
  "analyzed",             // trac
  "ap_id",                // activitypub
  "arch",                 // postmarketOS
  "archived",             // forgejo
  "architecture",         // distrowatch.com
  "art",                  // article
  "artist",               // bandcamp jamendo
  "assignee",             // forgejo
  "author",               // git
  "b32",                  // i2p
  "bill",                 // law
  "basedon",              // distrowatch.com
  "board",                // simple machines forum
  "branch",               // postmarketOS
  "CategoryID",           // id
  "category",             // id
  "categories",           // searxng
  "catid",                // id
  "cc",                   // trac
  "ci",                   // fossil-scm.org
  "code",                 // code
  "component",            // addons.palemoon.org
  "confirmation_token",   // dev.gajim.org
  "content",              // id
  "contributor",          // lulu
  "CurrentMDW",           // menuetos.be
  "dark",                 // yorik.uncreated.net
  "date",                 // date
  "days",                 // mediawiki
  "defaultinit",          // distrowatch.com
  "desktop",              // distrowatch.com
  "distribution",         // betterbird.eu
  "diff",                 // mediawiki
  "do",                   // flyspray
  "do_union",             // bugzilla
  "district",             // house.mo.gov
  "distrorange",          // distrowatch.com
  "engine",               // simplytranslate
  "exp_time",             // cdn
  "expires",              // cdn
  "ezimgfmt",             // cdn image processor
  "feed",                 // mediawiki
  "feedformat",           // mediawiki
  "fid",                  // mybb
  "file",                 // tw-cms
  "file_host",            // cdn
  "filename",             // filename
  "flavor",               // blojsom
  "for",                  // cdn
  "format",               // file type
  "from",                 // redmine
  "func",                 // tw-cms
  "gid",                  // entirelydigital.com
  "guid",                 // guid
  "group",                // bugzilla
  "group_id",             // sourceforge.net
  "hash",                 // cdn
  "hidebots",             // mediawiki
  "hit",                  // tasnimnews.com RSS
  "hl",                   // language
  "i2paddresshelper",     // i2p
  "id",                   // id
  "ie",                   // character encoding
  "ip",                   // ip address
  "isosize",              // distrowatch.com
  "item_class",           // greasyfork.org
  "item_id",              // greasyfork.org
  "iv_load_policy",       // invidious
  "jid",                  // jabber id (xmpp)
  "key",                  // cdn
  "keywords",             // trac
  "labels",               // codeberg
  "lang",                 // language
  "language",             // searxng
  "library",              // openuserjs.org
  "limit",                // mediawiki
  "list",                 // video
  "locale",               // locale
  "logout",               // bugzilla
  "lr",                   // cdn
  "lra",                  // cdn
  "maintainer",           // postmarketOS
  "member",               // xmb forum
  "milestone",            // forgejo
  "mobileaction",         // mediawiki
  "mode",                 // darkconquest.org
  "module",               // tw-cms
  "mortyurl",             // morty searxng
  "name",                 // archlinux
  "news_id",              // post
  "netinstall",           // distrowatch.com
  "node",                 // movim
  "notbasedon",           // distrowatch.com
  "nsm",                  // fossil-scm.org
  "oldid",                // mediawiki
  "op",                   // tw-cms
  "order",                // bugzilla
  "orderby",              // sumo torrent
  "orderBy",              // openuserjs.org
  "orderDir",             // openuserjs.org
  "origin",               // openuserjs.org
  "ostype",               // distrowatch.com
  "outputType",           // xml
//"p",                    // search query, page number
  "package",              // distrowatch.com
  "package_id",           // sourceforge.net
  "packager",             // archlinux, artixlinux, parabola
  "page",                 // mybb
  "page_id",              // picapica.im
//"param",
  "period",               // greasyfork.org
  "pid",                  // fluxbb
  "pkg",                  // distrowatch.com
  "pkgver",               // distrowatch.com
  "playlistPosition",     // peertube
  "poster",               // forgejo
  "public_key",           // session
  "preferencesReturnUrl", // return url
  "priority",             // trac
  "product",              // bugzilla
  "project",              // flyspray
  "profile",              // copy.sh/v86/
  "pubsub",               // rivista xmpp journal
//"q",                    // search query
  "query",                // search query
  "query_format",         // bugzilla
  "raw",                  // portal.mozz.us
  "redirect_to_referer",  // dev.gajim.org
  "redlink",              // mediawiki
  "ref_type",             // gitlab
//"referer",              // connect NOTE provided pathname contains connect or register
  "relation",             // distrowatch.com
  "repo",                 // postmarketOS
  "repo_name",            // git
  "reporter",             // trac
  "reproduced",           // trac
  "resolution",           // bugzilla
  "requestee",            // bugzilla
  "requester",            // bugzilla
  "return_to",            // connect
  "role",                 // hyperkitty
  "rolling",              // distrowatch.com
//"s",                    // search query
  "search",               // search query
  "searchterm",           // treebuilder.de
  "selectedItem",         // atlassian
  "set",                  // savannah.gnu.org
  "showtopic",            // invision board
  "show_all_versions",    // greasyfork.org
  "showforum",            // forums.duke4.net
//"si",                   // TODO make this specific to yt
  "sign",                 // cdn
  "signature",            // cdn
  "size",                 // rss
  "sort",                 // greasyfork.org
  "speed",                // cdn
  "ss",                   // fossil-scm.org
  "st",                   // invision board
  "start",                // page
  "start_time",           // media playback
  "state",                // forgejo
  "status",               // distrowatch.com
  "subcat",               // solidtorrents
  "state",                // cdn
  "station",              // christiannetcast.com / truthradio.com
  "__switch_theme",       // theanarchistlibrary.org
//"tag",                  // id
  "tags",                 // blasta
  "template",             // zapier
  "tid",                  // mybb
  "title",                // send (share) links and mediawiki
  "to",                   // gitlab
  "top",                  // hubzilla (atom syndication feed)
  "topic",                // simple machines forum
  "type",                 // file type
//"url",                  // url NOTE not sure whether to whitelist or blacklist
  "utf8",                 // encoding
  "urlversion",           // mediawiki
  "v1",                   // greasyfork.org
  "v2",                   // greasyfork.org
  "version",              // greasyfork.org
  "version_id",           // gitlab
//"view",                 // invision board
  "view-source",          // git.sr.ht
  "vfx",                  // fossil-scm.org
//"_x_tr_sl", // translate online service
//"_x_tr_tl=", // translate online service
//"_x_tr_hl=", // translate online service
//"_x_tr_pto", // translate online service
//"_x_tr_hist", // translate online service
  "year",                 // year
  "your",                 // getkirby.com
  ];

// TODO 
// List of usefull hash
const goodHash = [
  "advanced",             // distrowatch.com
  "simple",               // distrowatch.com
  ];

// List of useless hash
const hash = [
  "!psicash",
  "back-url",
  "back_url",
  "intcid",
  "niche-",
//"searchinput",
  "src",
  "xtor"];

// List of useless parameters
const blacklist = [
  "ad",
  "ad-location",
  "ad_medium",
  "ad_name",
  "ad_pvid",
  "ad_sub",
//"ad_tags",
  "adt_ei",
  "advertising-id",
//"aem_p4p_detail",
  "af",
  "aff",
  "aff_fcid",
  "aff_fsk",
  "aff_platform",
  "aff_trace_key",
  "affiliate",
  "affparams",
  "afftrack",
  "afSmartRedirect",
//"aid",
  "algo_exp_id",
  "algo_pvid",
  "ar",
//"ascsubtag",
//"asc_contentid",
  "asgtbndr",
  "atc",
  "ats",
  "autostart",
//"b64e", // breaks yandex
  "bizType",
//"block",
  "_bsa_req",
  "bta",
  "businessType",
  "campaign",
  "campaign_id",
  "campaignId",
//"__cf_chl_rt_tk",
//"cid", // breaks sacred magick
  "ck",
//"clickid",
//"client_id",
//"cm_ven",
//"cmd",
  "content-id",
  "crid",
  "cst",
  "cts",
  "curPageLogUid",
//"data", // breaks yandex
  "dc",
//"dchild",
//"dclid",
  "deals-widget",
  "dgcid",
  "dicbo",
  "ds",
//"dt",
  "e9s", // rumble.com
  "edd",
  "edm_click_module",
//"ei",
//"embed",
//"_encoding",
//"etext", // breaks yandex
  "eventSource",
  "fbclid",
  "feature",
  "field-lbr_brands_browse-bin",
  "forced_click",
//"fr",
  "frs",
//"from", // breaks yandex
  "_ga",
  "ga_order",
  "ga_search_query",
  "ga_search_type",
  "ga_view_type",
  "gadid",
  "gatewayAdapt",
//"gclid",
//"gclsrc",
  "gh_jid",
  "__goaway_challenge",
  "__goaway_id",
  "gps-id",
//"gs_lcp",
  "gt",
  "guccounter",
  "hdtime",
//"hosted_button_id",
  "ICID",
  "ico",
  "ig_rid",
//"idzone",
//"iflsig",
  "intake",
  "intcmp",
  "irclickid",
//"irgwc",
//"irpid",
  "is_from_webapp",
  "itid",
//"itok",
//"katds_labels",
//"keywords",
  "keyno",
  "landed",
  "l10n",
  "linkCode",
  "mc",
  "mid",
  "__mk_de_DE",
  "mp",
  "nats",
  "nci",
  "obOrigUrl",
  "offer_id",
  "opened-from",
  "optout",
  "oq",
  "organic_search_click",
  "pa",
  "Partner",
  "partner",
  "partner_id",
  "partner_ID",
  "pcampaignid",
  "pd_rd_i",
  "pd_rd_r",
  "pd_rd_w",
  "pd_rd_wg",
  "pdp_npi",
  "pf_rd_i",
  "pf_rd_m",
  "pf_rd_p",
  "pf_rd_r",
  "pf_rd_s",
  "pf_rd_t",
  "pg",
  "PHPSESSID",
  "pk_campaign",
  "pdp_ext_f",
  "pkey",
  "Platform",
  "platform",
  "plkey",
  "pqr",
  "pr",
  "pro",
  "prod",
  "prom",
  "promo",
  "promocode",
  "promoid",
  "psc",
  "psprogram",
  "pubid",
  "pvid",
  "qid",
//"r",
  "realDomain",
  "recruiter_id",
  "redirect",
  "ref",
  "ref_",
  "ref_src",
  "refcode",
  "referral",
  "referrer",
  "refinements",
  "reftag",
  "related_post_from",
  "rf",
  "rnid",
  "rowan_id1",
  "rowan_msg_id",
//"rss",
  "ru",
//"sCh",
  "sclient",
  "scm",
  "scm_id",
  "scm-url",
//"sd",
  "sender_device",
  "sh",
  "shareId",
  "showVariations",
//"si",
//"sid", // breaks whatsup.org.il
  "___SID",
//"site_id",
  "sk",
  "smid",
  "social_params",
  "source",
  "sourceId",
  "sp_csd",
  "spLa",
  "spm",
  "spreadType",
//"sprefix",
  "sr",
  "src",
  "_src",
  "src_cmp",
  "src_player",
  "src_src",
  "srcSns",
  "su",
//"sxin_0_pb",
  "_t",
//"tag",
  "tcampaign",
  "td",
  "terminal_id",
//"text",
  "th", // Sometimes restored after page load
//"title",
  "tracelog",
  "trans-rights",
  "traffic_id",
  "traffic_source",
  "traffic_type",
  "tt",
  "uact",
  "ug_edm_item_id",
  "userId",
  "utm",
//"utm1",
//"utm2",
//"utm3",
//"utm4",
//"utm5",
//"utm6",
//"utm7",
//"utm8",
//"utm9",
  "utm_campaign",
  "utm_content",
  "utm_id",
  "utm_medium",
  "utm_source",
  "utm_term",
  "uuid",
//"utype",
//"ve",
//"ved",
  "wt_mc",
//"zone"
  ];

// URL Indexers
const paraIDX = [
  "algo_exp_id",
  "algo_pvid",
  "b64e",
  "cst",
  "cts",
  "data",
  "ei",
//"etext",
  "from",
  "iflsig",
  "gbv",
  "gs_lcp",
  "hdtime",
  "keyno",
  "l10n",
  "mc",
  "oq",
//"q",
  "sei",
  "sclient",
  "sign",
  "source",
  "state",
//"text",
  "uact",
  "uuid",
  "ved"];

// Market Places 
const paraMKT = [
  "___SID",
  "_t",
  "ad_pvid",
  "af",
  "aff_fsk",
  "aff_platform",
  "aff_trace_key",
  "afSmartRedirect",
  "bizType",
  "businessType",
  "ck",
  "content-id",
  "crid",
  "curPageLogUid",
  "deals-widget",
  "edm_click_module",
  "gatewayAdapt",
  "gps-id",
  "keywords",
  "__mk_de_DE",
  "pd_rd_i",
  "pd_rd_r",
  "pd_rd_w",
  "pd_rd_wg",
  "pdp_npi",
  "pf_rd_i",
  "pf_rd_m",
  "pf_rd_p",
  "pf_rd_r",
  "pf_rd_s",
  "pf_rd_t",
  "platform",
  "pdp_ext_f",
  "ref_",
  "refinements",
  "rnid",
  "rowan_id1",
  "rowan_msg_id",
  "scm",
  "scm_id",
  "scm-url",
  "shareId",
//"showVariations",
  "sk",
  "smid",
  "social_params",
  "spLa",
  "spm",
  "spreadType",
  "sprefix",
  "sr",
  "srcSns",
//"sxin_0_pb",
  "terminal_id",
  "th", // Sometimes restored after page load
  "tracelog",
  "tt",
  "ug_edm_item_id"];

// IL
const paraIL = [
  "dicbo",
  "obOrigUrl"];

// General
const paraWWW = [
  "aff",
  "promo",
  "promoid",
  "ref",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term"];

// For URL of the Address bar
// Check and modify page address
// TODO Add bar and ask to clean address bar
(function modifyURL() {
  let check = [],
        url = new URL(location.href.replace("/ref=", "?ref="));
        // NOTE Marketplace website which uses /ref= instead of ?ref=
        // location.href.replace(/\/ref=/g, "/?ref=");
  // TODO turn into boolean function
  for (let i = 0; i < blacklist.length; i++) {
    if (url.searchParams.has(blacklist[i])) {
      check.push(blacklist[i]);
      url.searchParams.delete(blacklist[i]);
      //newURL = url.origin + url.pathname + url.search + url.hash;
    }
  }
  // TODO turn into boolean function
  for (let i = 0; i < hash.length; i++) {
    if (url.hash.startsWith("#" + hash[i])) {
      check.push(hash[i]);
      //newURL = url.origin + url.pathname + url.search;
    }
  }
  if (check.length > 0) {
    let newURL = url.origin + url.pathname + url.search;
    window.location.replace(newURL);
    //location.href = newURL;
  }
})();


// NOTE Marketplace website which uses /ref= instead of ?ref=
(function correctSlashRefURLs() {
  window.addEventListener("load", function() {
    for (let i = 0; i < document.links.length; i++) {
      if (document.links[i].href.includes("/ref=")) {
        document.links[i].href = document.links[i].href.replace("/ref=", "?ref=");
        document.links[i].setAttribute("slash-ref", "");
      }
    }
  });
})();

(function scanAllURLs() {
  window.addEventListener("load", function() {
    for (let i = 0; i < document.links.length; i++) {
      let url = new URL(document.links[i].href);
      // NOTE Consider BitTorrent Magnet links
      // removing trackers would need a warning about
      // private torrents, if torrent is not public (dht-enabled)
      const allowedProtocolSchemes = [
        "finger:", "ftp:", "ftps:", "freenet:",
        "gemini:", "gopher:", "http:", "https:",
        "ipfs:", "wap:"]; // mailto, magnet, xmpp
      if (url.search && allowedProtocolSchemes.includes(url.protocol)) {
      //if (url.search || url.hash) {
        document.links[i].setAttribute("href-data", document.links[i].href);
      }
    }

    // TODO Hunt (for any) links within attributes using getAttributeNames()[i]
    
    // Event Listener
    // TODO Scan "e.target.childNodes" until "href-data" (link) is found
    document.body.addEventListener("mouseover", function(e) { // mouseover works with keyboard too
      //if (e.target && e.target.nodeName == "A") {
      let hrefData = e.target.getAttribute("href-data");
      //if (e.target && hrefData && !document.getElementById(namespace)) {
      if (e.target && hrefData && hrefData != document.getElementById("url-original")) {
        if (document.getElementById(namespace)) {
          document.getElementById(namespace).remove();
        }
        selectionItem = createButton(e.pageX, e.pageY, hrefData);
        hrefData = new URL(hrefData);
        selectionItem.append(purgeURL(hrefData));
        let types = ["whitelist", "blacklist", "original"];
        for (let i = 0; i < types.length; i++) {
          let button = purgeURL(hrefData, types[i]);
          if (types[i] == "original" && e.target.getAttribute("slash-ref") == "") {
            button.href = button.href.replace("?ref=", "/ref=");
          }
          let exist;
          selectionItem.childNodes.forEach(
            node => {
              if (button.href == node.href) {
                exist = true;
              }
            }
          );
          if (!exist) {
            selectionItem.append(button);
          }
        }
    
        // Check for URLs
        for (let i = 0; i < urls.length; i++) {
          if (hrefData.searchParams.get(urls[i])) { // hrefData.includes("url=")
            urlParameter = hrefData.searchParams.get(urls[i]);
            try {
              urlParameter = new URL (urlParameter);
            } catch {
              if (urlParameter.includes(".")) {  // NOTE It is a guess
                try {
                  urlParameter = new URL ("http:" + urlParameter);
                } catch {}
              }
            }
            if (typeof urlParameter == "object" && // confirm url object
                urlParameter != location.href) {   // provided url isn"t the same as of page
              newURLItem = extractURL(urlParameter);
              selectionItem.prepend(newURLItem);
            }
          }
        }
    
        /*
        // compare original against purged
        //if (selectionItem.querySelector(`#url-purged`) &&
        //    selectionItem.querySelector(`#url-original`)) {
        if (selectionItem.querySelector(`#url-purged`)) {
          //let urlOrigin = new URL (selectionItem.querySelector(`#url-original`).href);
          let urlPurge = new URL (selectionItem.querySelector(`#url-purged`).href);
          // NOTE
          // These "searchParams.sort" ~~may be~~ *are not* redundant.
          // See resUrl.searchParams.sort()
          urlPurge.searchParams.sort();
          hrefData.searchParams.sort();
          //console.log(hrefData.search);
          //console.log(urlPurge.search);
          if (hrefData.search == urlPurge.search &&
              selectionItem.querySelector(`#url-original`)) {
            selectionItem.querySelector(`#url-original`).remove();
          }
        } else
        // compare original against safe
        if (selectionItem.querySelector(`#url-known`)) {
          //let urlOrigin = new URL (selectionItem.querySelector(`#url-original`).href);
          let urlKnown = new URL (selectionItem.querySelector(`#url-known`).href);
          // NOTE
          // These "searchParams.sort" ~~may be~~ *are not* redundant.
          // See resUrl.searchParams.sort()
          urlKnown.searchParams.sort();
          hrefData.searchParams.sort();
          //console.log(hrefData.search);
          //console.log(urlKnown.search);
          if (hrefData.search == urlKnown.search &&
              selectionItem.querySelector(`#url-original`)) {
            selectionItem.querySelector(`#url-original`).remove();
          }
        }
        */
    
        // compare original against safe and purged
        // NOTE on "item.href = decodeURI(resUrl)"
        // The solution was here.
        // Decode was not the issue
        // This is a good example to show that
        // smaller tasks are as important as bigger tasks
        let urlsToCompare = ["#url-known", "#url-purged"];
        for (let i = 0; i < urlsToCompare.length; i++) {
          if (selectionItem.querySelector(urlsToCompare[i])) {
            //let urlOrigin = new URL (selectionItem.querySelector(`#url-original`).href);
            let urlToCompare = new URL (selectionItem.querySelector(urlsToCompare[i]).href);
            // NOTE
            // These "searchParams.sort" ~~may be~~ *are not* redundant.
            // See resUrl.searchParams.sort()
            urlToCompare.searchParams.sort();
            hrefData.searchParams.sort();
            //console.log(hrefData.search);
            //console.log(urlToCompare.search);
            if (hrefData.search == urlToCompare.search &&
                selectionItem.querySelector(`#url-original`)) {
              selectionItem.querySelector(`#url-original`).remove();
            }
          }
        }
    
        // do not add element, if url has only whitelisted parameters and no potential url
        // add element, only if a potential url or non-whitelisted parameter was found
        let urlTypes = ["url-extracted", "url-original", "url-purged"];
        for (let i = 0; i < urlTypes.length; i++) {
          if (selectionItem.querySelector(`#${urlTypes[i]}`)) {
            document.body.append(selectionItem);
            return;
          }
        }
    
        // NOTE in case return did not reach
        // it means that there is no link to process
        e.target.removeAttribute("href-data");
    
        //if (!e.target.getAttribute("slash-ref") == "") {
        //  e.target.removeAttribute("href-data")
        //}
    
      }
    });
  });
})();

(function scanBadURLs() {
  window.addEventListener("load", function() {
    for (let i = 0; i < document.links.length; i++) {
      // TODO callback, Mutation Observer, and Event Listener
      // TODO Count links increaseByOne("links")
      // NOTE To count links, add return statement to function cleanLink()
      // return statement will indicate that link is positive for subject
      // parameters and therefore should be counted. Counter will be added
      // by one, once detected that url is not equal to (new) url.
      hash.forEach(j => cleanLink(document.links[i], j, "hash"));
      blacklist.forEach(j => cleanLink(document.links[i], j, "para"));
    }
  });
})();

// TODO Add an Event Listener
function cleanLink(link, target, type) {
  let url = new URL(link.href);
  switch (type) {
    case "hash":
      //console.log("hash " + i)
      if (url.hash.startsWith("#" + target)) {
        //link.setAttribute("href-data", link.href);
        link.href = url.origin + url.pathname + url.search;
        //increaseByOne("hashes")
      }
      break;
    case "para":
      //console.log("para " + i)
      if (url.searchParams.has(target)) { 
        url.searchParams.delete(target);
        //link.setAttribute("href-data", link.href);
        link.href = url.origin + url.pathname + url.search;
        //increaseByOne("parameters")
      }
      break;
  }

  /*
  // EXTRA
  // For URL of hyperlinks
  for (const a of document.querySelectorAll("a")) {
    try{
      let url = new URL(a.href);
      for (let i = 0; i < blacklist.length; i++) {
        if (url.searchParams.has(blacklist[i])) {
          url.searchParams.delete(blacklist[i]);
        }
      }
      a.href = url;
    } catch (err) {
      //console.warn("Found no href for element: " + a);
      //console.error(err);
    }
  } */

}

function createButton(x, y, url) {
  // create element
  let item = document.createElement(namespace);
  // set content
  item.id = namespace;
  // set position
  item.style.all = "unset";
  item.style.position = "absolute";
  //item.style.left = x+5 + "px";
  //item.style.top = y-3 + "px";
  item.style.left = x+45 + "px";
  item.style.top = y-65 + "px";
  // set appearance
  item.style.fontFamily = "none"; // emoji
  item.style.background = "#333";
  item.style.borderRadius = "5%";
  item.style.padding = "3px";
  item.style.direction = "ltr";
  item.style.zIndex = 10000;
  //item.style.opacity = 0.7;
  //item.style.filter = "brightness(0.7) drop-shadow(2px 4px 6px black)";
  item.style.filter = "brightness(0.7)";
  // center character
  item.style.justifyContent = "center";
  item.style.alignItems = "center";
  item.style.display = "flex";
  // disable selection marks
  item.style.userSelect = "none";
  item.style.cursor = "default";
  // set button behaviour
  item.onmouseover = () => {
    //item.style.opacity = 1;
    //item.style.filter = "drop-shadow(2px 4px 6px black)";
    item.style.filter = "unset";
  };
  item.onmouseleave = () => { // onmouseout
    // TODO Wait a few seconds
    item.remove();
  };
  return item;
}

function extractURL(url) {
  let item = document.createElement("a");
  item.textContent = "🔗"; // 🧧 🏷️ 🔖 🔗
  item.title = "Extracted URL";
  item.id = "url-extracted";
  item.style.all = "unset";
  item.style.background = "grey";
  item.style.borderRadius = "50%";
  item.style.outline = "none";
  item.style.height = "1em";
  item.style.width = "1em";
  item.style.padding = "3px";
  item.style.margin = "3px";
  //item.style.fontSize = "0.9rem" // 90%
  item.style.lineHeight = "normal"; // initial
  //item.style.height = "fit-content";
  item.href = url;
  return item;
}

// TODO Use icons (with shapes) for cases when color is not optimal
function purgeURL(url, listType) {
  let orgUrl = null;
  let itemTitle, itemId, resUrl;
  let item = document.createElement("a");
  item.style.all = "unset";
  switch (listType) {
    case "blacklist":
      itemColor = "yellow";
      //itemTextContent = "🟡";
      itemTitle = "Semi-safe link"; // Purged URL
      itemId = "url-purged";
      resUrl = hrefDataHandler(url, blacklist);
      break;
    case "original": // TODO dbclick (double-click)
      itemColor = "orangered";
      //itemTextContent = "🔴";
      itemTitle = "Unsafe link"; // Original URL
      itemId = "url-original";
      //resUrl = encodeURI(url);
      // NOTE By executing url.searchParams.sort()
      // we change the order of parameters
      // which means that we create a new and unique url
      // which means that it can be used to identify users that use this program
      // NOTE We execute url.searchParams.sort()
      // in order to avoid false positive for url of blacklisted parameters
      // but we don"t apply that change on item "url-original"
      //url.searchParams.sort();
      orgUrl = url;
      item.style.cursor = `not-allowed`; // no-drop
      item.onmouseenter = () => {
        item.style.background = "darkorange";
        item.style.filter = `drop-shadow(2px 4px 6px ${itemColor})`;
      };
      item.onmouseout = () => {
        item.style.background = itemColor;
        item.style.filter = "unset";
      };
      break;
    case "whitelist":
      itemColor = "lawngreen";
      //itemTextContent = "🟢";
      itemTitle = "Safe link"; // Link with whitelisted parameters
      itemId = "url-known";
      resUrl = hrefDataHandler(url, whitelist);
      break;
    default:
      itemColor = "antiquewhite";
      //itemTextContent = "⚪";
      itemTitle = "Base link"; // Link without parameters
      itemId = "url-base";
      resUrl = url.origin + url.pathname;
      resUrl = new URL(resUrl); // NOTE To avoid error in resUrl.searchParams.sort()
      break;
  }
  item.id = itemId;
  item.title = itemTitle;
  item.style.background = itemColor;
  //item.textContent = itemTextContent;
  item.style.borderRadius = "50%";
  item.style.outline = "none";
  item.style.height = "1em";
  item.style.width = "1em";
  item.style.padding = "3px";
  item.style.margin = "3px";
  if (orgUrl){
    item.href = orgUrl;
  } else {
    // NOTE Avoid duplicates by sorting parameters of all links
    resUrl.searchParams.sort();
    // NOTE Avoid false positive by decoding
    // TODO decode from ?C=N%3BO%3DD to ?C=N;O=D
    // FIXME decodeURI doesn"t appear to work
    // Text page https://mirror.lyrahosting.com/gnu/a2ps/ (columns raw)
    // SOLVED See "urlsToCompare"
    //item.href = decodeURI(resUrl);
    //item.href = decodeURIComponent(resUrl);
    // TODO whitespace turns into plus and
    // then red/white appears for the same uri
    item.href = resUrl;
  }
  return item;
}

// NOTE The URL API doesn"t list parameters
// without explicitly calling them, therefore
// reading lengths of unknown parameters is
// impossible, hence
// set a loop from Aa - Zz or
// add Aa - Zz to whitelist
function hrefDataHandler(url, listType) {
  url = new URL(url.href);
  // NOTE Avoid duplicates by sorting parameters of all links
  //url.searchParams.sort();
  switch (listType) {
    case whitelist:
      let newURL = new URL (url.origin + url.pathname);
      for (let i = 0; i < whitelist.length; i++) {
        if (url.searchParams.has(whitelist[i])) {
          newURL.searchParams.set(
            whitelist[i],
            url.searchParams.get(whitelist[i]) // catchedValue
          );
        }
      }

      // Whitelist parameters of single character long
      let a2z = alphabet.split("");
      for (let i = 0; i < a2z.length; i++) {
        if (url.searchParams.has(a2z[i])) {
          newURL.searchParams.set(
            a2z[i],
            url.searchParams.get(a2z[i])
          );
        }
      }

      let A2Z = alphabet.toUpperCase().split("");
      for (let i = 0; i < A2Z.length; i++) {
        if (url.searchParams.has(A2Z[i])) {
          newURL.searchParams.set(
            A2Z[i],
            url.searchParams.get(A2Z[i])
          );
        }
      }

      /*
      let a2z = genCharArray("a", "z");
      for (let i = 0; i < a2z.length; i++) {
        if (url.searchParams.has(a2z[i])) {
          newURL.searchParams.set(
            a2z[i],
            url.searchParams.get(a2z[i]) // catchedValue
          );
        }
      }

      let A2Z = genCharArray("A", "Z");
      for (let i = 0; i < A2Z.length; i++) {
        if (url.searchParams.has(A2Z[i])) {
          newURL.searchParams.set(
            A2Z[i],
            url.searchParams.get(A2Z[i]) // catchedValue
          );
        }
      }
      */

      url = newURL;
      break;
    case blacklist:
      for (let i = 0; i < blacklist.length; i++) {
        if (url.searchParams.has(blacklist[i])) {
          url.searchParams.delete(blacklist[i]);
          //increaseByOne("parameters")
        }
      }
      //increaseByOne("links")
      break;
  }
  return url;
}

// /questions/24597634/how-to-generate-an-array-of-the-alphabet
function genCharArray(charA, charZ) {
  var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
  for (; i <= j; ++i) {
    a.push(String.fromCharCode(i));
  }
  return a;
}

async function increaseByOne(key) {
  let currentValue = await GM.getValue(key, 0);
  await GM.setValue(key, currentValue + 1);
  console.log(key);
  console.log(currentValue);
}

// NOTE Marketplace website which uses /ref= instead of ?ref=
// Check for .getAttribute("slash-ref") == ""
function deleteSerialNumber(url) {
  let newURL = [];
  let pattern = /^[0-9\-]+$/;
  let oldUrl = url.toString().split("/");
  for (const cell of oldUrl) {
    if (!pattern.test(cell)) {
      newURL.push(cell);
    }
  }
  newURL = newURL.join("/");
  return new URL(newURL);
}

// ==UserScript==
// @name         Change YouTube Leftbar Subscription Links To Channel/User Video Page
// @namespace    ChangeYouTubeLeftbarSubscriptionLinksToChannelUserVideoPage
// @version      1.5.41
// @license      AGPL v3
// @author       jcunews
// @description  Change YouTube leftbar's subscription links to channel/user video page. This script can optionally also move updated links to top of the list (if there's enough space), optionally uncollapse all updated links which may extend the non collapsible links, and optionally display the number of updated & total links following the "SUBSCRIPTION" section label. All features can be enabled/disabled from the script code. For new YouTube layout only.
// @website      https://greasyfork.org/en/users/85671-jcunews
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/36400/Change%20YouTube%20Leftbar%20Subscription%20Links%20To%20ChannelUser%20Video%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/36400/Change%20YouTube%20Leftbar%20Subscription%20Links%20To%20ChannelUser%20Video%20Page.meta.js
// ==/UserScript==

//Note: Users of Violentmonkey under Firefox should disable Violentmonkey's `Synchronous page mode` setting, and enable `Alternative page mode in Firefox` setting; for consistent result.

(yigd => {
  //===== Configuration Start ===

  var changeLinksURL         = true; //Change links' URLs from the Home tab, to the Videos tab.
  var moveUpdatedLinksToTop  = true; //Move updated links to top of list without uncollapsing them.
  var UncollapseUpdatedLinks = true; //Uncollapse updated links. This may extend the length of uncollapsed links.
                                     //If enabled, it will implicitly enable moveUpdatedLinksToTop.
  var showLinksCount         = true; //Display number of updated links and total links following the "SUBSCRIPTION" section label.
  var autoExpandCollapsed    = true; //Auto expand collapsed links.

  //===== Configuration End ===

  var to = {createHTML: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to, html = s => tp.createHTML(s);

  function changeUrl(url, m) {
    return url;
    if (m = url.match(/^\/feed\/subscriptions\/([^\/]+)$/)) {
      return "/channel/" + m[1] + "/videos";
    } else return url + "/videos";
  }

  function updateSubscriptionCount(a, b, u, t) {
    function count(v, w) {
      if ((w = v.guideEntryRenderer) && w.entryData) {
        t++;
        if (w.presentationStyle === "GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT") u++;
      } else if ((w = v.guideCollapsibleEntryRenderer) && (w = w.expandableItems) && w.forEach) {
        w.forEach(count)
      }
    }
    if ((a = document.querySelector("ytd-guide-section-renderer:nth-child(2) #guide-section-title")) && !window.ytlssc_ujs) {
      if (b = a.closest('[hidden]')) {
        b.style.cssText = 'position:absolute;right:1em;margin-top:.2em';
        b.hidden = false
      }
      a.insertAdjacentHTML("beforeend", html(' (<span id=ytlssc_ujs>-/-</span>)'))
    }
    if (window.ytlssc_ujs) {
      u = 0; t = 0;
      if (a && (a = a.parentNode.__shady_native_parentNode.__data || a.parentNode.__dataHost?.__data) && (a = a.shownItems) && a.forEach) a.forEach(count);
      ytlssc_ujs.textContent = u + "/" + t
    } else setTimeout(updateSubscriptionCount, 500)
  }

  function updateEndpoint(ep, gd, si) {
    function processPage(h, url, o) {
      if ((h = h.match(/var ytInitialData = (\{.*?\});/)) && (h = JSON.parse(h[1]).contents.twoColumnBrowseResultsRenderer.tabs)) {
        h.some((a, i, b) => {
          if (!(b = a.tabRenderer).content && (/^\/(@|[^\/]+\/)[^\/]+\/videos$/).test((b = b.endpoint).commandMetadata.webCommandMetadata.url)) {
            ep.browseEndpoint = b.browseEndpoint;
            ep.clickTrackingParams = b.clickTrackingParams;
            ep.commandMetadata = b.commandMetadata;
            if (url) b.commandMetadata.webCommandMetadata.url = url + "/videos";
            gd.some((d, i) => {
              if (d.browseEndpoint.browseId === b.browseEndpoint.browseId) {
                d.browseEndpoint = b.browseEndpoint;
                d.clickTrackingParams = b.clickTrackingParams;
                d.commandMetadata = b.commandMetadata;
                if (i = document.querySelector(`ytd-guide-section-renderer:nth-child(${si + 1}) a[href="${d.browseEndpoint.canonicalBaseUrl}"]`)) {
                  i.href = b.commandMetadata.webCommandMetadata.url
                }
                return true
              }
            });
            return true
          }
        })
      }
    }
    function processResponse(r, url) {
      if ((r.status >= 400) && !url) { //yt bugfix. STOOPEED YOUTUBE!
        if (ep.commandMetadata.webCommandMetadata.webPageType === "WEB_PAGE_TYPE_CHANNEL") {
          fetch(url = "/channel/" + ep.browseEndpoint.browseId, {credentials: "omit"}).then(r => processResponse(r, url))
        }
        return
      } else r.text().then(h => processPage(h, url))
    }
    ep.commandMetadata.webCommandMetadata.url = changeUrl(ep.commandMetadata.webCommandMetadata.url);
    if (ep.webNavigationEndpointData) ep.webNavigationEndpointData.url = changeUrl(ep.webNavigationEndpointData.url);
    (function waitGD() {
      if (
        (gd = window["guide-renderer"].__data || document.querySelector("#guide-renderer #sections")?.__dataHost) &&
        (gd = gd.data || gd.__data?.data) && (gd = gd.items) &&
        (gd = gd.reduce(
          (r, v, i) => {
            if (!r && (v = v.guideSubscriptionsSectionRenderer) && (v = v.items)) {
              si = i;
              r = v.reduce((r, e) => {
                if (e.guideCollapsibleEntryRenderer) {
                  e.guideCollapsibleEntryRenderer.expandableItems.forEach(t => {
                    if (!t.guideEntryRenderer.icon || (t.guideEntryRenderer.icon.iconType !== "ADD_CIRCLE")) r.push(t.guideEntryRenderer.navigationEndpoint)
                  });
                } else if (e.guideEntryRenderer) r.push(e.guideEntryRenderer.navigationEndpoint);
                return r;
              }, []);
            }
            return r;
          }, null
        ))
      ) {
        fetch(ep.commandMetadata.webCommandMetadata.url, {credentials: "omit"}).then(processResponse)
      } else setTimeout(waitGD, 100)
    })()
  }

  function patchGuide(guide, z) {
    if (guide && guide.items && !guide.cysl_done) try {
      guide.cysl_done = 1;
      guide.items.forEach((v, is, vc, l, w, x, c, i, u,q) => {
        if (v.guideSubscriptionsSectionRenderer) {
          delete v.guideSubscriptionsSectionRenderer.sort;
          //change links' URL
          if (changeLinksURL) {
            v.guideSubscriptionsSectionRenderer.items.forEach(w => {
              if (w.guideCollapsibleEntryRenderer) {
                w.guideCollapsibleEntryRenderer.expandableItems.forEach(x => {
                  if (x.guideEntryRenderer.badges && (x = x.guideEntryRenderer.navigationEndpoint)) updateEndpoint(x);
                });
              } else if (w = w.guideEntryRenderer?.navigationEndpoint) updateEndpoint(w);
            });
          }
          //move links with new uploads to top
          if (moveUpdatedLinksToTop) {
            v = v.guideSubscriptionsSectionRenderer.items; //v = main links container. includes collapsed links container wrapper at end
            if (!v[0].guideEntryRenderer) is = v.splice(0, 1)[0]; //temporarily remove section label item
            vc = v.length - 1; //vc = main links count
            x = w = v[vc].guideCollapsibleEntryRenderer; //w = collapsed links container wrapper
            l = v.splice(0, vc); //l = list1. move main links into list1. list1 now: mainLinks
            c = -1;
            if (w) { //has collapsed links container? w = collapsed links container
              (w = w.expandableItems).some((e, i) => { //count collapsed links
                if (!e.guideEntryRenderer.entryData) {
                  c = i;
                  return true;
                }
              });
              l.push.apply(l, w.splice(0, c >= 0 ? c : w.length)); //append collapsed links to list1. list1 now: mainLinks, collapsedLinks
            }
            c = []; //c = list2 = collapsed new links
            for (i = l.length - 1; i >= 0; i--) { //move new links in list1 into main links container
              u = l[i].guideEntryRenderer.presentationStyle === "GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT";
              if (l[i].guideEntryRenderer.count || u) {
                if ((u = UncollapseUpdatedLinks && u) || vc--) {
                  v.unshift(l.splice(i, 1)[0]);
                  if (u) vc--;
                } else c.unshift(l.splice(i, 1)[0]);
              }
            }
            c.push.apply(c, l); //append any remaining list1 links (non updated links) into list2
            if (vc > 0) { //original-length main links container still has free slot?
              l = c.splice(0, vc); //move collapsed links in list2 into list1. same count as main links container free slots
              l.unshift.apply(l, [v.length - 1, 0]); //prepare arguments for below task
              v.splice.apply(v, l); //move collapsed links in list1 into main links container
            }
            if (w) w.unshift.apply(w, c); //if has collapsed links container, move remaining collapsed links in list2 into it
            if (is) v.unshift(is); //readd section label item
            if ((w = x.expandableItems) && (x = x.expanderItem?.guideEntryRenderer)) { //update collapsed link count
              if (x?.formattedTitle?.simpleText) x.formattedTitle.simpleText = x.formattedTitle.simpleText.replace(/\d+/, w.length - 1);
              if (x?.accessibility?.accessibilityData?.label) x.accessibility.accessibilityData.label = x.accessibility.accessibilityData.label.replace(/\d+/, w.length - 1);
            }
          }
        }
      });
      if (showLinksCount) updateSubscriptionCount();
      return true;
    } catch(z) {console.log('err',z)}
    return false;
  }

  Object.defineProperty(window, "ytInitialGuideData", {
    get(v) {
      return yigd;
    },
    set(v) {
      delete window.ytInitialGuideData;
      patchGuide(v);
      return yigd = v;
    }
  });
  JSON.parse_cylslcvp = JSON.parse;
  JSON.parse = function(txt) {
    var res = JSON.parse_cylslcvp.apply(this, arguments);
    if ((/\/youtubei\/v1\/guide\?/).test(JSON.url_cylslcvp)) patchGuide(res);
    return res;
  };
  var fetch_ = window.fetch;
  window.fetch = async function(opts) {
    var fres = await fetch_.apply(this, arguments);
    if ((/\/youtubei\/v1\/guide\?/).test(opts.url)) {
      JSON.url_cylslcvp = opts.url;
      var frtext = fres.text;
      fres.text = async function() {
        var tres = await frtext.apply(this, arguments), z, tr;
        try {
          tr = JSON.parse_cylslcvp(tres);
          patchGuide(tr);
          tres = JSON.stringify(tr)
        } catch(z) {}
        return tres
      }
      var frjson = fres.json;
      fres.json = async function() {
        var jres = await frjson.apply(this, arguments);
        patchGuide(jres);
        return jres
      }
    } else JSON.url_cylslcvp = "";
    if (showLinksCount) setTimeout(updateSubscriptionCount, 100);
    return fres
  };
  var nac = Node.prototype.appendChild, ge, gs;
  Node.prototype.appendChild = function(e) {
    var z;
    if ((this.tagName === "BODY") && (e?.tagName === "IFRAME")) {
      var r = nac.apply(this, arguments);
      try {
        if (/^about:blank\b/.test(e.contentWindow.location.href)) e.contentWindow.fetch = fetch
      } catch(z) {}
      return r
    } else {
      if (autoExpandCollapsed && e.matches?.('ytd-guide-collapsible-entry-renderer')) {
        (function we(a, t) {
          if (a = e.querySelector('#expander-item')) {
            gs = (ge = e.closest('#guide-inner-content')).scrollTop;
            ge.onscroll = ev => {
              ge.onscroll = null;
              ge.scrollTop = gs
            };
            a.click();
            t = Date.now();
            (function wa() {
              if (document.activeElement && (document.activeElement.tagName !== "BODY")) {
                document.activeElement.blur()
              } else if ((Date.now() - t) < 1000) requestAnimationFrame(wa)
            })()
          } else setTimeout(we, 20)
        })()
      }
      return nac.apply(this, arguments)
    }
  };

  if (showLinksCount) {
    addEventListener("click", (ev, a, aa, b) => {
      if ((a = ev.target) && a.matches && a.matches("ytd-guide-section-renderer:nth-child(2) ytd-guide-entry-renderer *")) {
        while (a.tagName !== "A") a = a.parentNode;
        if (/^\/((c|channel|u|user)|@[^\\]+)\//.test(a.pathname)) {
          if (b = a.__dataHost || a.__data) {
            b = b.navigationEndpoint;
            if (b.presentationStyle === "GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT") {
              (function usc() {
                if (b.presentationStyle !== "GUIDE_ENTRY_PRESENTATION_STYLE_NEW_CONTENT") {
                  updateSubscriptionCount()
                } else setTimeout(usc, 500)
              })();
            }
          } else if (b = a.closest('ytd-guide-entry-renderer[line-end-style="dot"]')) {
            (function usc2() {
              if (b.getAttribute("line-end-style") !== "dot") {
                updateSubscriptionCount()
              } else setTimeout(usc2, 500)
            })();
          }
        }
      }
    }, true)
  }

})()

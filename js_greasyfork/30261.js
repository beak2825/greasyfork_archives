// ==UserScript==
// @name        Mark Watched YouTube Videos
// @namespace   MarkWatchedYouTubeVideos
// @version     1.4.69
// @license     AGPL v3
// @author      jcunews
// @description Add an indicator for watched videos on YouTube. Use GM menus to display history statistics, backup history, and restore/merge history.
// @website     https://greasyfork.org/en/users/85671-jcunews
// @match       *://www.youtube.com/*
// @match       *://www.youtube-nocookie.com/*
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/30261/Mark%20Watched%20YouTube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/30261/Mark%20Watched%20YouTube%20Videos.meta.js
// ==/UserScript==

/*
- Use ALT+LeftClick or ALT+RightClick on a video list item to manually toggle the watched marker. The mouse button is defined in the script and can be changed.
- For restoring/merging history, source file can also be a YouTube's history data JSON (downloadable from https://support.google.com/accounts/answer/3024190?hl=en). Or a list of YouTube video URLs (using current time as timestamps).
*/

(() => {
  //=== config start ===
  var maxWatchedVideoAge   = 10 * 365; //number of days. set to zero to disable (not recommended)
  var contentLoadMarkDelay = 600;      //number of milliseconds to wait before marking video items on content load phase (increase if slow network/browser)
  var markerMouseButtons   = [0, 1];   //one or more mouse buttons to use for manual marker toggle. 0=left, 1=right, 2=middle. e.g.:
                                       //if `[0]`, only left button is used, which is ALT+LeftClick.
                                       //if `[1]`, only right button is used, which is ALT+RightClick.
                                       //if `[0,1]`, any left or right button can be used, which is: ALT+LeftClick or ALT+RightClick.
  //=== config end ===

  var
    watchedVideos, ageMultiplier = 24 * 60 * 60 * 1000, xu = /(?:\/watch(?:\?|.*?&)v=|\/embed\/)([^\/\?&]+)|\/shorts\/([^\/\?]+)/,
    querySelector = Element.prototype.querySelector, querySelectorAll = Element.prototype.querySelectorAll;
  var cl=console.log;

  function getVideoId(url) {
    var vid = url.match(xu);
    if (vid) vid = vid[1] || vid[2];
    return vid;
  }

  function watched(vid) {
    return !!watchedVideos.entries[vid];
  }

  function processVideoItems(selector) {
    var items = document.querySelectorAll(selector), i, link;
    for (i = items.length-1; i >= 0; i--) {
      if (link = querySelector.call(items[i], "A")) {
        if (watched(getVideoId(link.href))) {
          items[i].classList.add("watched");
        } else items[i].classList.remove("watched");
      }
    }
  }

  function processAllVideoItems() {
    //home page
    processVideoItems(`.yt-uix-shelfslider-list>.yt-shelf-grid-item`);
    processVideoItems(`
#contents.ytd-rich-grid-renderer>ytd-rich-item-renderer,
#contents.ytd-rich-shelf-renderer ytd-rich-item-renderer.ytd-rich-shelf-renderer,
#contents.ytd-rich-grid-renderer>ytd-rich-grid-row ytd-rich-grid-media`);
    //subscriptions page
    processVideoItems(`.multirow-shelf>.shelf-content>.yt-shelf-grid-item`);
    //history:watch page
    processVideoItems(`
ytd-section-list-renderer[page-subtype="history"] .ytd-item-section-renderer>ytd-video-renderer,
ytd-section-list-renderer[page-subtype="history"] ytd-item-section-renderer yt-lockup-view-model.ytd-item-section-renderer
`);
    //channel/user home page
    processVideoItems(`
#contents>.ytd-item-section-renderer>.ytd-newspaper-renderer,
#items>.yt-horizontal-list-renderer`); //old
    processVideoItems(`
#contents>.ytd-channel-featured-content-renderer,
#contents>.ytd-shelf-renderer>#grid-container>.ytd-expanded-shelf-contents-renderer`); //new
    //channel/user video page
    processVideoItems(`
.yt-uix-slider-list>.featured-content-item,
.channels-browse-content-grid>.channels-content-item,
#items>.ytd-grid-renderer,
#contents>.ytd-rich-grid-renderer`);
    //channel/user shorts page
    processVideoItems(`
ytd-rich-item-renderer ytd-rich-grid-slim-media`);
    //channel/user playlist page
    processVideoItems(`
.expanded-shelf>.expanded-shelf-content-list>.expanded-shelf-content-item-wrapper,
.ytd-playlist-video-renderer`);
    //channel/user playlist item page
    processVideoItems(`
.pl-video-list .pl-video-table .pl-video,
ytd-playlist-panel-video-renderer`);
    //channel/user search page
    if (/^\/(?:(?:c|channel|user)\/)?.*?\/search/.test(location.pathname)) {
      processVideoItems(`.ytd-browse #contents>.ytd-item-section-renderer`); //new
    }
    //search page
    processVideoItems(`
#results>.section-list .item-section>li,
#browse-items-primary>.browse-list-item-container`); //old
    processVideoItems(`
.ytd-search #contents>ytd-video-renderer,
.ytd-search #contents>ytd-playlist-renderer,
.ytd-search #items>ytd-video-renderer`); //new
    //video page
    processVideoItems(`
.watch-sidebar-body>.video-list>.video-list-item,
.playlist-videos-container>.playlist-videos-list>li`); //old
    processVideoItems(`
.ytd-compact-video-renderer,
.ytd-compact-radio-renderer,
qytd-watch-next-secondary-results-renderer .yt-lockup-view-model-wiz,
ytd-watch-next-secondary-results-renderer ytd-item-section-renderer yt-lockup-view-model.ytd-item-section-renderer
`); //new
  }

  function addHistory(vid, time, noSave, i) {
    if (!watchedVideos.entries[vid]) {
      watchedVideos.index.push(vid);
    } else {
      i = watchedVideos.index.indexOf(vid);
      if (i >= 0) watchedVideos.index.push(watchedVideos.index.splice(i, 1)[0])
    }
    watchedVideos.entries[vid] = time;
    if (!noSave) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
  }

  function delHistory(index, noSave) {
    delete watchedVideos.entries[watchedVideos.index[index]];
    watchedVideos.index.splice(index, 1);
    if (!noSave) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
  }

  var dc, ut;
  function parseData(s, a, i, j, z) {
    try {
      dc = false;
      s = JSON.parse(s);
      //convert to new format if old format.
      //old: [{id:<strVID>, timestamp:<numDate>}, ...]
      //new: {entries:{<stdVID>:<numDate>, ...}, index:[<strVID>, ...]}
      if (Array.isArray(s) && (!s.length || (("object" === typeof s[0]) && s[0].id && s[0].timestamp))) {
        a = s;
        s = {entries: {}, index: []};
        a.forEach(o => {
          s.entries[o.id] = o.timestamp;
          s.index.push(o.id);
        });
      } else if (("object" !== typeof s) || ("object" !== typeof s.entries) || !Array.isArray(s.index)) return null;
      //reconstruct index if broken
      if (s.index.length !== (a = Object.keys(s.entries)).length) {
        s.index = a.map(k => [k, s.entries[k]]).sort((x, y) => x[1] - y[1]).map(v => v[0]);
        dc = true;
      }
      return s;
    } catch(z) {
      return null;
    }
  }

  function parseYouTubeData(s, a) {
    try {
      s = JSON.parse(s);
      //convert to native format if YouTube format.
      //old: [{titleUrl:<strUrl>, time:<strIsoDate>}, ...] (excludes irrelevant properties)
      //new: {entries:{<stdVID>:<numDate>, ...}, index:[<strVID>, ...]}
      if (Array.isArray(s) && (!s.length || (("object" === typeof s[0]) && s[0].titleUrl && s[0].time))) {
        a = s;
        s = {entries: {}, index: []};
        a.forEach((o, m, t) => {
          if (o.titleUrl && (m = o.titleUrl.match(xu))) {
            if (isNaN(t = (new Date(o.time)).getTime())) t = (new Date()).getTime();
            s.entries[m[1] || m[2]] = t;
            s.index.push(m[1] || m[2]);
          }
        });
        s.index.reverse();
        return s;
      } else return null;
    } catch(a) {
      return null;
    }
  }

  function mergeData(o, a) {
    o.index.forEach(i => {
      if (watchedVideos.entries[i]) {
        if (watchedVideos.entries[i] < o.entries[i]) watchedVideos.entries[i] = o.entries[i];
      } else watchedVideos.entries[i] = o.entries[i];
    });
    a = Object.keys(watchedVideos.entries);
    watchedVideos.index = a.map(k => [k, watchedVideos.entries[k]]).sort((x, y) => x[1] - y[1]).map(v => v[0]);
  }

  function getHistory(a, b) {
    a = GM_getValue("watchedVideos");
    if (a === undefined) {
      a = '{"entries": {}, "index": []}';
    } else if ("object" === typeof a) a = JSON.stringify(a);
    if (b = parseData(a)) {
      watchedVideos = b;
      if (dc) b = JSON.stringify(b);
    } else b = JSON.stringify(watchedVideos = {entries: {}, index: []});
    GM_setValue("watchedVideos", b);
  }

  function doProcessPage() {
    //get list of watched videos
    getHistory();

    //remove old watched video history
    var now = (new Date()).valueOf(), changed, vid;
    if (maxWatchedVideoAge > 0) {
      while (watchedVideos.index.length) {
        if (((now - watchedVideos.entries[watchedVideos.index[0]]) / ageMultiplier) > maxWatchedVideoAge) {
          delHistory(0, false);
          changed = true;
        } else break;
      }
      if (changed) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
    }

    //check and remember current video
    if ((vid = getVideoId(location.href)) && !watched(vid)) addHistory(vid, now);

    //mark watched videos
    processAllVideoItems();
  }

  function processPage() {
    setTimeout(doProcessPage, Math.floor(contentLoadMarkDelay / 2));
  }

  function delayedProcessPage() {
    setTimeout(doProcessPage, contentLoadMarkDelay);
  }

  function toggleMarker(ele, i) {
    if (ele) {
      if (!ele.href && (i = ele.closest('a'))) ele = i;
      if (ele.href) {
        i = getVideoId(ele.href);
      } else {
        while (ele) {
          while (ele && (!ele.__data || !ele.__data.data || !ele.__data.data.videoId)) ele = ele.__dataHost || ele.parentNode;
          if (ele) {
            i = ele.__data.data.videoId;
            break
          }
        }
      }
      if (i) {
        if ((ele = watchedVideos.index.indexOf(i)) >= 0) {
          delHistory(ele);
        } else addHistory(i, (new Date()).valueOf());
        processAllVideoItems();
      }
    }
  }

  var rxListUrl = /\/\w+_ajax\?|\/results\?search_query|\/v1\/(browse|next|search)\?/;
  var xhropen = XMLHttpRequest.prototype.open, xhrsend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url) {
    this.url_mwyv = url;
    return xhropen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(method, url) {
    if (rxListUrl.test(this.url_mwyv) && !this.listened_mwyv) {
      this.listened_mwyv = 1;
      this.addEventListener("load", delayedProcessPage);
    }
    return xhrsend.apply(this, arguments);
  };

  var fetch_ = unsafeWindow.fetch;
  unsafeWindow.fetch = function(opt) {
    let url = opt.url || opt;
    if (rxListUrl.test(opt.url || opt)) {
      return fetch_.apply(this, arguments).finally(delayedProcessPage);
    } else return fetch_.apply(this, arguments);
  };
  var nac = unsafeWindow.Node.prototype.appendChild;
  unsafeWindow.Node.prototype.appendChild = function(e) {
    var z;
    if ((this.tagName === "BODY") && (e?.tagName === "IFRAME")) {
      var r = nac.apply(this, arguments);
      try {
        if (/^about:blank\b/.test(e.contentWindow.location.href)) e.contentWindow.fetch = fetch
      } catch(z) {}
      return r
    } else return nac.apply(this, arguments)
  }

  var to = {createHTML: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to, html = s => tp.createHTML(s);

  addEventListener("DOMContentLoaded", sty => {
    sty = document.createElement("STYLE");
    sty.innerHTML = html(`
.watched:not(ytd-thumbnail):not(.details):not(.metadata), .watched .yt-ui-ellipsis
  { outline: .2em solid #aca; border-radius: 1em; background-color: #cec !important }
html[dark] .watched:not(ytd-thumbnail):not(.details):not(.metadata), html[dark] .watched .yt-ui-ellipsis,
.playlist-videos-container>.playlist-videos-list>li.watched,
.playlist-videos-container>.playlist-videos-list>li.watched>a,
.playlist-videos-container>.playlist-videos-list>li.watched .yt-ui-ellipsis
  { outline: .2em solid #040; border-radius: 1em; background-color: #030 !important }`);
    document.head.appendChild(sty);
    var nde = Node.prototype.dispatchEvent;
    Node.prototype.dispatchEvent = function(ev) {
      if (ev.type === "yt-service-request-completed") {
        clearTimeout(ut);
        ut = setTimeout(doProcessPage, contentLoadMarkDelay / 2)
      }
      return nde.apply(this, arguments)
    };
  });

  var lastFocusState = document.hasFocus();
  addEventListener("blur", () => {
    lastFocusState = false;
  });
  addEventListener("focus", () => {
    if (!lastFocusState) processPage();
    lastFocusState = true;
  });
  addEventListener("click", (ev) => {
    if ((markerMouseButtons.indexOf(ev.button) >= 0) && ev.altKey) {
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      ev.preventDefault();
      toggleMarker(ev.target);
    }
  }, true);

  if (markerMouseButtons.indexOf(1) >= 0) {
    addEventListener("contextmenu", (ev) => {
      if (ev.altKey) toggleMarker(ev.target);
    });
  }
  if (window["body-container"]) { //old
    addEventListener("spfdone", processPage);
    processPage();
  } else { //new
    var t = 0;
    function pl() {
      clearTimeout(t);
      t = setTimeout(processPage, 300);
    }
    (function init(vm) {
      if (vm = document.getElementById("visibility-monitor")) {
        vm.addEventListener("viewport-load", pl);
      } else setTimeout(init, 100);
    })();
    (function init2(mh) {
      if (mh = document.getElementById("masthead")) {
        mh.addEventListener("yt-rendererstamper-finished", pl);
      } else setTimeout(init2, 100);
    })();
    addEventListener("load", delayedProcessPage);
    addEventListener("spfprocess", delayedProcessPage);
  }

  GM_registerMenuCommand("Display History Statistics", () => {
    function sum(r, v) {
      return r + v;
    }
    function avg(arr, cnt) {
      arr = Object.values(arr);
      cnt = cnt || arr?.length;
      return arr?.length ? Math.round(arr.reduce(sum, 0) / cnt) : "(n/a)";
    }
    var t0 = Infinity, t1 = -Infinity, d0 = Infinity, d1 = -Infinity, ld = {}, e0, e1, o0, o1, sp, ad, am, ay;
    getHistory();
    Object.keys(watchedVideos.entries).forEach((k, t, a) => {
      t = new Date(watchedVideos.entries[k]);
      a = t.getTime();
      if (a < t0) t0 = a;
      if (a > t1) t1 = a;
      a = Math.floor(a / 86400000);
      if (a < d0) d0 = a;
      if (a > d1) d1 = a;
      ld[a] = (ld[a] || 0) + 1;
    });
    d1 -= d0 - 1;
    if (watchedVideos.index.length) {
      e0 = (o0 = new Date(t0)).toLocaleString();
      e1 = (o1 = new Date(t1)).toLocaleString();
      t1 = o1.getFullYear() - o0.getFullYear();
      if ((t0 = o1.getMonth() - o0.getMonth()) < 0) {
        t0 += 12;
        t1--
      }
      if ((d0 = o1.getDate() - o0.getDate()) < 0) {
        d0 += 30;
        if (--t0 < 0) {
          t0 += 12;
          t1 --
        }
      }
      sp = `${t1} years ${t0} months ${d0} days (${d1} days total)`;
      ad = avg(ld, d1);
      am = avg(ld, d1 / 30);
      ay = avg(ld, d1 / 365);
    } else e0 = e1 = sp = ad = am = ay = "(n/a)";
    alert(`\
Number of entries: ${watchedVideos.index.length}
Oldest entry: ${e0}
Newest entry: ${e1}
Time span: ${sp}

Average viewed videos per day: ${ad}
Average viewed videos per month: ${am}
Average viewed videos per year: ${ay}

History data size: ${JSON.stringify(watchedVideos).length} bytes\
`);
  });

  GM_registerMenuCommand("Backup History Data", (a, b) => {
    document.body.appendChild(a = document.createElement("A")).href = URL.createObjectURL(new Blob([JSON.stringify(watchedVideos)], {type: "application/json"}));
    a.download = `MarkWatchedYouTubeVideos_${(new Date()).toISOString()}.json`;
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  });

  GM_registerMenuCommand("Restore History Data", (a, b) => {
    function askRestore(o) {
      if (confirm(`Selected history data file contains ${o.index.length} entries.\n\nRestore from this data?`)) {
        if (mwyvrhm_ujs.checked) {
          mergeData(o);
        } else watchedVideos = o;
        GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
        a.remove();
        doProcessPage();
      }
    }
    if (window.mwyvrh_ujs) return;
    (a = document.createElement("DIV")).id = "mwyvrh_ujs";
    a.innerHTML = html(`<style>
#mwyvrh_ujs{
  display:flex;position:fixed;z-index:99999;left:0;top:0;right:0;bottom:0;margin:0;border:none;padding:0;background:rgb(0,0,0,0.5);
  color:#000;font-family:sans-serif;font-size:12pt;line-height:12pt;font-weight:normal;cursor:pointer;
}
#mwyvrhb_ujs{
  margin:auto;border:.3rem solid #007;border-radius:.3rem;padding:.5rem .5em;background-color:#fff;cursor:auto;
}
#mwyvrht_ujs{margin-bottom:1rem;font-size:14pt;line-height:14pt;font-weight:bold}
#mwyvrhmc_ujs{margin:.5em 0 1em 0;text-align:center}
#mwyvrhi_ujs{display:block;margin:1rem auto .5rem auto;overflow:hidden}
</style>
<div id="mwyvrhb_ujs">
  <div id="mwyvrht_ujs">Mark Watched YouTube Videos</div>
  Please select a file to restore history data from.
  <div id="mwyvrhmc_ujs"><label><input id="mwyvrhm_ujs" type="checkbox" checked /> Merge history data instead of replace.</label></div>
  <input id="mwyvrhi_ujs" type="file" multiple />
</div>`);
    a.onclick = e => {
      (e.target === a) && a.remove();
    };
    (b = querySelector.call(a, "#mwyvrhi_ujs")).onchange = r => {
      r = new FileReader();
      r.onload = (o, t) => {
        if (o = parseData(r = r.result)) { //parse as native format
          if (o.index.length) {
            askRestore(o);
          } else alert("File doesn't contain any history entry.");
        } else if (o = parseYouTubeData(r)) { //parse as YouTube format
          if (o.index.length) {
            askRestore(o);
          } else alert("File doesn't contain any history entry.");
        } else { //parse as URL list
          o = {entries: {}, index: []};
          t = (new Date()).getTime();
          r = r.replace(/\r/g, "").split("\n");
          while (r.length && !r[0].trim()) r.shift();
          if (r.length && xu.test(r[0])) {
            r.forEach(s => {
              if (s = s.match(xu)) {
                o.entries[s[1] || s[2]] = t;
                o.index.push(s[1] || s[2]);
              }
            });
            if (o.index.length) {
              askRestore(o);
            } else alert("File doesn't contain any history entry.");
          } else alert("Invalid history data file.");
        }
      };
      r.readAsText(b.files[0]);
    };
    document.documentElement.appendChild(a);
    b.click();
  });
})();

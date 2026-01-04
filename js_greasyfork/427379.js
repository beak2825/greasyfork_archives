// ==UserScript==
// @name        Plain old youtube (2020) | 7KT EDITION
// @namespace gjwse90gj98we
// @version 2.6.1
// @description 7ktTube: Reverts YouTube to the 2016 Layout! (Polymer Engine FIX) | Customisation interface(API) included | Customizable thumbnail size | Customizable video player size | Download video button(no redirect) | Grey-out thumbnails on watched videos | Hide suggestions blocks | Hide  all the filter bars | And much more!
// @author 7KT SWE
// @icon https://i.ibb.co/YhZQfdT/7kt-tube.png
// @homepageURL     https://openuserjs.org/scripts/7kt_swe/Plain_old_youtube_(2020)_7KT_EDITION
// @contributionURL https://www.paypal.com/donate/?hosted_button_id=2EJR4DLTR4Y7Q
// @supportURL      https://openuserjs.org/scripts/7kt_swe/Plain_old_youtube_(2020)_7KT_EDITION/issues
// @require https://unpkg.com/vue@2.6.12/dist/vue.js
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM.getValue
// @grant GM.setValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant unsafeWindow
// @run-at document-start
// @compatible Chrome >=55 + Tampermonkey + Violentmonkey
// @compatible Firefox >=56 + Tampermonkey + Violentmonkey
// @compatible Opera + Tampermonkey + Violentmonkey
// @compatible Edge + Tampermonkey + Violentmonkey
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427379/Plain%20old%20youtube%20%282020%29%20%7C%207KT%20EDITION.user.js
// @updateURL https://update.greasyfork.org/scripts/427379/Plain%20old%20youtube%20%282020%29%20%7C%207KT%20EDITION.meta.js
// ==/UserScript==

/*
  - Grey out watched video thumbnails info:
  - Use ALT+LeftClick or ALT+RightClick on a video list item to manually toggle the watched marker. The mouse button is defined in the script and can be changed.
  - For restoring/merging history, source file can also be a YouTube's history data JSON (downloadable from https://support.google.com/accounts/answer/3024190?hl=en). Or a list of YouTube video URLs (using current time as timestamps).
*/
(() => {
  //=== config start ===
  var maxWatchedVideoAge = 5 * 365; //number of days. set to zero to disable (not recommended)
  var contentLoadMarkDelay = 600; //number of milliseconds to wait before marking video items on content load phase (increase if slow network/browser)
  var markerMouseButtons = [0, 1]; //one or more mouse buttons to use for manual marker toggle. 0=left, 1=right, 2=middle. e.g.:
  //if `[0]`, only left button is used, which is ALT+LeftClick.
  //if `[1]`, only right button is used, which is ALT+RightClick.
  //if `[0,1]`, any left or right button can be used, which is: ALT+LeftClick or ALT+RightClick.
  //=== config end ===
  var watchedVideos, ageMultiplier = 24 * 60 * 60 * 1000,
    xu = /\/watch(?:\?|.*?&)v=([^&]+)/;

  function getVideoId(url) {
    var vid = url.match(xu);
    if (vid) vid = vid[1] || vid[2];
    return vid;
  }

  function watched(vid) {
    return !!watchedVideos.entries[vid];
  }

  function processVideoItems(selector) {
    var items = document.querySelectorAll(selector),
      i, link;
    for (i = items.length - 1; i >= 0; i--) {
      if (link = items[i].querySelector("A")) {
        if (watched(getVideoId(link.href))) {
          items[i].classList.add("watched");
        }
        else items[i].classList.remove("watched");
      }
    }
  }

  function processAllVideoItems() {
    //home page
    processVideoItems(".yt-uix-shelfslider-list>.yt-shelf-grid-item");
    processVideoItems("#contents.ytd-rich-grid-renderer>ytd-rich-item-renderer,#contents.ytd-rich-shelf-renderer ytd-rich-item-renderer.ytd-rich-shelf-renderer");
    //subscriptions page
    processVideoItems(".multirow-shelf>.shelf-content>.yt-shelf-grid-item");
    //history:watch page
    processVideoItems('ytd-section-list-renderer[page-subtype="history"] .ytd-item-section-renderer>ytd-video-renderer');
    //channel/user home page
    processVideoItems("#contents>.ytd-item-section-renderer>.ytd-newspaper-renderer,#items>.yt-horizontal-list-renderer"); //old
    processVideoItems("#contents>.ytd-channel-featured-content-renderer,#contents>.ytd-shelf-renderer>#grid-container>.ytd-expanded-shelf-contents-renderer"); //new
    //channel/user video page
    processVideoItems(".yt-uix-slider-list>.featured-content-item,.channels-browse-content-grid>.channels-content-item,#items>.ytd-grid-renderer");
    //channel/user playlist page
    processVideoItems(".expanded-shelf>.expanded-shelf-content-list>.expanded-shelf-content-item-wrapper,.ytd-playlist-video-renderer");
    //channel/user playlist item page
    processVideoItems(".pl-video-list .pl-video-table .pl-video,ytd-playlist-panel-video-renderer");
    //channel/user search page
    if (/^\/(?:c|channel|user)\/.*?\/search/.test(location.pathname)) {
      processVideoItems(".ytd-browse #contents>.ytd-item-section-renderer"); //new
    }
    //search page
    processVideoItems("#results>.section-list .item-section>li,#browse-items-primary>.browse-list-item-container"); //old
    processVideoItems(".ytd-search #contents>ytd-video-renderer,.ytd-search #contents>ytd-playlist-renderer,.ytd-search #items>ytd-video-renderer"); //new
    //video page
    processVideoItems(".watch-sidebar-body>.video-list>.video-list-item,.playlist-videos-container>.playlist-videos-list>li"); //old
    processVideoItems(".ytd-compact-video-renderer"); //new
  }

  function addHistory(vid, time, noSave, i) {
    if (!watchedVideos.entries[vid]) {
      watchedVideos.index.push(vid);
    }
    else {
      i = watchedVideos.index.indexOf(vid);
      if (i >= 0) watchedVideos.index.push(watchedVideos.index.splice(i, 1)[0])
    }
    watchedVideos.entries[vid] = time;
    if (!noSave) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
  }

  function delHistory(index, noSave) {
    v
    delete watchedVideos.entries[watchedVideos.index[index]];
    watchedVideos.index.splice(index, 1);
    if (!noSave) GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
  }
  var dc;

  function parseData(s, a, i, j, z) {
    try {
      dc = false;
      s = JSON.parse(s);
      //convert to new format if old format.
      //old: [{id:<strVID>, timestamp:<numDate>}, ...]
      //new: {entries:{<stdVID>:<numDate>, ...}, index:[<strVID>, ...]}
      if (Array.isArray(s) && (!s.length || (("object" === typeof s[0]) && s[0].id && s[0].timestamp))) {
        a = s;
        s = {
          entries: {},
          index: []
        };
        a.forEach(o => {
          s.entries[o.id] = o.timestamp;
          s.index.push(o.id);
        });
      }
      else if (("object" !== typeof s) || ("object" !== typeof s.entries) || !Array.isArray(s.index)) return null;
      //reconstruct index if broken
      if (s.index.length !== (a = Object.keys(s.entries))
        .length) {
        s.index = a.map(k => [k, s.entries[k]])
          .sort((x, y) => x[1] - y[1])
          .map(v => v[0]);
        dc = true;
      }
      return s;
    }
    catch (z) {
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
        s = {
          entries: {},
          index: []
        };
        a.forEach((o, m, t) => {
          if (o.titleUrl && (m = o.titleUrl.match(xu))) {
            if (isNaN(t = (new Date(o.time))
                .getTime())) t = (new Date())
              .getTime();
            s.entries[m[1]] = t;
            s.index.push(m[1]);
          }
        });
        s.index.reverse();
        return s;
      }
      else return null;
    }
    catch (a) {
      return null;
    }
  }

  function mergeData(o, a) {
    o.index.forEach(i => {
      if (watchedVideos.entries[i]) {
        if (watchedVideos.entries[i] < o.entries[i]) watchedVideos.entries[i] = o.entries[i];
      }
      else watchedVideos.entries[i] = o.entries[i];
    });
    a = Object.keys(watchedVideos.entries);
    watchedVideos.index = a.map(k => [k, watchedVideos.entries[k]])
      .sort((x, y) => x[1] - y[1])
      .map(v => v[0]);
  }

  function getHistory(a, b) {
    a = GM_getValue("watchedVideos");
    if (a === undefined) {
      a = '{"entries": {}, "index": []}';
    }
    else if ("object" === typeof a) a = JSON.stringify(a);
    if (b = parseData(a)) {
      watchedVideos = b;
      if (dc) b = JSON.stringify(b);
    }
    else b = JSON.stringify(watchedVideos = {
      entries: {},
      index: []
    });
    GM_setValue("watchedVideos", b);
  }

  function doProcessPage() {
    //get list of watched videos
    getHistory();
    //remove old watched video history
    var now = (new Date())
      .valueOf(),
      changed, vid;
    if (maxWatchedVideoAge > 0) {
      while (watchedVideos.index.length) {
        if (((now - watchedVideos.entries[watchedVideos.index[0]]) / ageMultiplier) > maxWatchedVideoAge) {
          delHistory(0, false);
          changed = true;
        }
        else break;
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
      if (ele.href) {
        i = getVideoId(ele.href);
      }
      else {
        ele = ele.parentNode;
        while (ele) {
          if (ele.tagName === "A") {
            i = getVideoId(ele.href);
            break;
          }
          ele = ele.parentNode;
        }
      }
      if (i) {
        if ((ele = watchedVideos.index.indexOf(i)) >= 0) {
          delHistory(ele);
        }
        else addHistory(i, (new Date())
          .valueOf());
        processAllVideoItems();
      }
    }
  }
  var rxListUrl = /\/\w+_ajax\?|\/results\?search_query|\/v\d+\/browse\?|\/youtubei\/v1\/search\?/;
  var xhropen = XMLHttpRequest.prototype.open,
    xhrsend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.url_mwyv = url;
    return xhropen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (method, url) {
    if (rxListUrl.test(this.url_mwyv) && !this.listened_mwyv) {
      this.listened_mwyv = 1;
      this.addEventListener("load", delayedProcessPage);
    }
    return xhrsend.apply(this, arguments);
  };
  var fetch_ = unsafeWindow.fetch;
  unsafeWindow.fetch = function (opt) {
    let url = opt.url || opt;
    if (rxListUrl.test(opt.url || opt)) {
      return fetch_.apply(this, arguments)
        .finally(delayedProcessPage);
    }
    else return fetch_.apply(this, arguments);
  };
  var lastFocusState = document.hasFocus();
  addEventListener("blur", () => {
    lastFocusState = false;
  });
  addEventListener("focus", () => {
    if (!lastFocusState) processPage();
    lastFocusState = true;
  });
  addEventListener("click", (ev) => {
    if ((markerMouseButtons.indexOf(ev.button) >= 0) && ev.altKey) toggleMarker(ev.target);
  });
  if (markerMouseButtons.indexOf(1) >= 0) {
    addEventListener("contextmenu", (ev) => {
      if (ev.altKey) toggleMarker(ev.target);
    });
  }
  if (window["body-container"]) { //old
    addEventListener("spfdone", processPage);
    processPage();
  }
  else { //new
    var t = 0;

    function pl() {
      clearTimeout(t);
      t = setTimeout(processPage, 300);
    }
    (function init(vm) {
      if (vm = document.getElementById("visibility-monitor")) {
        vm.addEventListener("viewport-load", pl);
      }
      else setTimeout(init, 100);
    })();
    (function init2(mh) {
      if (mh = document.getElementById("masthead")) {
        mh.addEventListener("yt-rendererstamper-finished", pl);
      }
      else setTimeout(init2, 100);
    })();
    addEventListener("load", delayedProcessPage);
    addEventListener("spfprocess", delayedProcessPage);
  }
  GM_registerMenuCommand("Display History Statistics", () => {
    function sum(r, v) {
      return r + v;
    }

    function avg(arr) {
      return arr && arr.length ? Math.round(arr.reduce(sum, 0) / arr.length) : "(n/a)";
    }
    var pd, pm, py, ld = [],
      lm = [],
      ly = [];
    getHistory();
    Object.keys(watchedVideos.entries)
      .forEach((k, t) => {
        t = new Date(watchedVideos.entries[k]);
        if (!pd || (pd !== t.getDate())) {
          ld.push(1);
          pd = t.getDate();
        }
        else ld[ld.length - 1]++;
        if (!pm || (pm !== (t.getMonth() + 1))) {
          lm.push(1);
          pm = t.getMonth() + 1;
        }
        else lm[lm.length - 1]++;
        if (!py || (py !== t.getFullYear())) {
          ly.push(1);
          py = t.getFullYear();
        }
        else ly[ly.length - 1]++;
      });
    if (watchedVideos.index.length) {
      pd = (new Date(watchedVideos.entries[watchedVideos.index[0]]))
        .toLocaleString();
      pm = (new Date(watchedVideos.entries[watchedVideos.index[watchedVideos.index.length - 1]]))
        .toLocaleString();
    }
    else {
      pd = "(n/a)";
      pm = "(n/a)";
    }
    alert(`\
Number of entries: ${watchedVideos.index.length}
Oldest entry: ${pd}
Newest entry: ${pm}

Average viewed videos per day: ${avg(ld)}
Average viewed videos per month: ${avg(lm)}
Average viewed videos per year: ${avg(ly)}\
`);
  });
  GM_registerMenuCommand("Backup History Data", (a, b) => {
    document.body.appendChild(a = document.createElement("A"))
      .href = URL.createObjectURL(new Blob([JSON.stringify(watchedVideos)], {
        type: "application/json"
      }));
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
        }
        else watchedVideos = o;
        GM_setValue("watchedVideos", JSON.stringify(watchedVideos));
        a.remove();
        doProcessPage();
      }
    }
    if (window.mwyvrh_ujs) return;
    (a = document.createElement("DIV"))
    .id = "mwyvrh_ujs";
    a.innerHTML = `<style>
      #mwyvrh_ujs {display:flex;position:fixed;z-index:99999;left:0;top:0;right:0;bottom:0;margin:0;border:none;padding:0;background:rgb(0,0,0,0.5);color:#000;font-family:sans-serif;font-size:12pt;line-height:12pt;font-weight:normal;cursor:pointer}
      #mwyvrhb_ujs {margin:auto;border:.3rem solid #007;border-radius:.3rem;padding:.5rem .5em;background-color:#fff;cursor:auto}
      #mwyvrht_ujs {margin-bottom:1rem;font-size:14pt;line-height:14pt;font-weight:bold}
      #mwyvrhmc_ujs {margin:.5em 0 1em 0;text-align:center}
      #mwyvrhi_ujs {display:block;margin:1rem auto .5rem auto;overflow:hidden}
      </style><div id="mwyvrhb_ujs"><div id="mwyvrht_ujs">Mark Watched YouTube Videos</div>Please select a file to restore history data from.<div id="mwyvrhmc_ujs"><label><input id="mwyvrhm_ujs" type="checkbox" checked /> Merge history data instead of replace.</label></div><input id="mwyvrhi_ujs" type="file" multiple /></div>`;
    a.onclick = e => {
      (e.target === a) && a.remove();
    };
    (b = a.querySelector("#mwyvrhi_ujs"))
    .onchange = r => {
      r = new FileReader();
      r.onload = (o, t) => {
        if (o = parseData(r = r.result)) { //parse as native format
          if (o.index.length) {
            askRestore(o);
          }
          else alert("File doesn't contain any history entry.");
        }
        else if (o = parseYouTubeData(r)) { //parse as YouTube format
          if (o.index.length) {
            askRestore(o);
          }
          else alert("File doesn't contain any history entry.");
        }
        else { //parse as URL list
          o = {
            entries: {},
            index: []
          };
          t = (new Date())
            .getTime();
          r = r.replace(/\r/g, "")
            .split("\n");
          while (r.length && !r[0].trim()) r.shift();
          if (r.length && xu.test(r[0])) {
            r.forEach(s => {
              if (s = s.match(xu)) {
                o.entries[s[1]] = t;
                o.index.push(s[1]);
              }
            });
            if (o.index.length) {
              askRestore(o);
            }
            else alert("File doesn't contain any history entry.");
          }
          else alert("Invalid history data file.");
        }
      };
      r.readAsText(b.files[0]);
    };
    document.documentElement.appendChild(a);
    b.click();
  });
})();
(function () {
	
  'use strict';
  let fix_version = '2.4.3';	// as close to header as possible: in hopes to not forget
  if (window.YTEngine2) return; // in-development kill-switch
  if (document.location.pathname == '/error') // there is nothing to do on error page
    return;
  // test local storage availability (required for settings saving) and load settings
  let settings = {},
    ls;
  try {
    function lsTest(st, v) {
      st.setItem('__fix_test__', v);
      return st.getItem('__fix_test__') == v;
    };
    let _s = window.localStorage;
    if (lsTest(_s, 'qwe') && lsTest(_s, 'rty')) { // do 2 times just in case LS stored value once, but does not let change it later
      ls = _s;
      settings = JSON.parse(ls.getItem('__fix__settings__')) || {};
    }
  }
  catch (e) {}
  // delete old settings
  if ("default_player_640" in settings) {
    settings.default_player = settings.default_player_640 ? 3 : 0;
    delete settings.default_player_640;
  }
  if ("reduce_thumbnail" in settings) {
    settings.thumbnail_size = settings.reduce_thumbnail ? 2 : 0;
    delete settings.reduce_thumbnail;
  }
  // set default values
  if (!("inst_ver" in settings))
	settings.inst_ver = fix_version;
  if (!("classic_logo" in settings))
    settings.classic_logo = true;
  if (!("smaller_search" in settings))
    settings.smaller_search = true;
  if (!("thumb_preview" in settings))
    settings.thumb_review = false;
  if (!("profile_picture" in settings))
    settings.profile_picture = true;
  if (!("grey_watched" in settings))
    settings.grey_watched = true;
  if (!("hide_filters" in settings))
    settings.hide_filters = true;
  if (!("default_player" in settings))
    settings.default_player = 2;
  if (!("hide_guide" in settings))
    settings.hide_guide = false;
  if (!("hide_yt_suggested_blocks" in settings))
    settings.hide_yt_suggested_blocks = true;
  if (!("logo_target" in settings))
    settings.logo_target = "";
  if (!("thumbnail_size" in settings))
    settings.thumbnail_size = 0;
  if (!("thumbnail_size_m" in settings))
    settings.thumbnail_size_m = 720;
  if (!("search_thumbnail" in settings))
    settings.search_thumbnail = 0;
  if (!("clear_search" in settings))
    settings.clear_search = false;
  if (!("channel_top" in settings))
    settings.channel_top = 0;
  if (!("video_quality" in settings))
	settings.video_quality = 0;
  console.log('fix settings:', settings);
  // catch "settings" page
  if (document.location.pathname == '/fix-settings') {
    document.title = "YouTube | 7KT EDITION: Settings";
    let back = document.createElement('div');
    back.className = 'ytfixback';
    let plane = document.createElement('div'),
      e1, e2, e3, e4;
    plane.className = 'ytfix';
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = [
      '.ytfix{font-family:tahoma;position:absolute;left:0;top:0;right:0;padding:3em;background: #eee url(https://i.ibb.co/jgXjyZn/7kttube.png) no-repeat;background-repeat-y: no-repeat;background-position-x: 300px;background-position-y: 20px;}', '.ytfix_line{margin:1em}', '.ytfix_line span,.ytfix_line input,.ytfix_line select{margin-right:1em}', 'form{padding-left: 10px;}', '.ytfix_field{padding:0.2em;border:1px solid #888}', '.ytfix_button{color: #fff;font-weight: bold;background: #ec2828;padding:0.6em;border:1px solid #fff;margin-bottom: 10px;}', '.ytfix_button:hover {background: #525252;cursor: pointer}', '.ytfix_hide{display:none}', '.ytfixback{position:absolute;left:0;top:0;right:0;height:100%;background:#eee}', '.ytfix donate{padding:0;border:1px solid #888}', 'h2{text-decoration: underline}', 'h5{font-style: italic}', 'paypal{padding-left: 60px; font-size: 0.83em; font-weight: bold;}'
    ].join('');
    plane.appendChild(style);

    function AddLine() {
      let q = document.createElement('div');
      q.className = 'ytfix_line';
      for (let i = 0, L = arguments.length; i < L; ++i)
        q.appendChild(arguments[i]);
      plane.appendChild(q);
      return q;
    }
    e1 = document.createElement('h2');
    e1.appendChild(document.createTextNode('YouTube | 7KT EDITION Settings:'));
    AddLine(e1);
    if (!ls) {
      e1 = document.createElement('span');
      e1.style = 'color:red';
      e1.appendChild(document.createTextNode('Cannot edit settings: no access to local storage.'));
      AddLine(e1);
      e1 = document.createElement('span');
      e1.appendChild(document.createTextNode('If you are using Firefox, allow cookies for this site.'));
      AddLine(e1);
    }
    else {
      let ess = {};

      function MakeDesc(desc) {
        let e = document.createElement('span');
        e.appendChild(document.createTextNode(desc));
        return e;
      }

      function MakeBoolElement(nm) {
        let e = document.createElement('input');
        e.type = 'checkbox';
        e.checked = settings[nm];
        ess[nm] = e;
        return e;
      }

      function MakeListElement(nm, opts) {
        let e = document.createElement('select');
        e.className = 'ytfix_field';
        ess[nm] = e;
        for (let i = 0, L = opts.length; i < L; ++i) {
          let o = document.createElement('option');
          o.appendChild(document.createTextNode(opts[i]));
          //if (i == val)
          //  o.setAttribute ('selected', '');
          e.appendChild(o);
        }
        e.selectedIndex = settings[nm];
        return e;
      }

      function MakeTextElement(nm) {
        let e = document.createElement('input');
        e.className = 'ytfix_field';
        e.value = settings[nm];
        ess[nm] = e;
        return e;
      }
      AddLine(MakeBoolElement("classic_logo"), MakeDesc("Use YouTube's classic logo"));
      AddLine(MakeBoolElement("smaller_search"), MakeDesc("Make searchbar smaller and better positioned"));
      AddLine(MakeBoolElement("thumb_preview"), MakeDesc("Disable video previews when mouse-over thumbnails"));
      AddLine(MakeBoolElement("profile_picture"), MakeDesc("Make profile pictures square again"));
      AddLine(MakeBoolElement("grey_watched"), MakeDesc("Grey-out already watched videos/thumbnails and make them less visible"));
      AddLine(MakeBoolElement("hide_filters"), MakeDesc("Hide Filters bar at Home page and in up next column"));
      AddLine(MakeBoolElement("hide_guide"), MakeDesc('Hide "Guide" menu when page opens'));
      let tsm = MakeTextElement("thumbnail_size_m");
      tsm.className = settings.thumbnail_size == 5 ? 'ytfix_field' : 'ytfix_hide';
      let tsi = MakeListElement("thumbnail_size", ['default', '180px', '240px', '360px', '480px', 'manual']);
      tsi.addEventListener('change', function () {
        ess.thumbnail_size_m.className = ess.thumbnail_size.selectedIndex == 5 ? 'ytfix_field' : 'ytfix_hide';
      });
      AddLine(MakeDesc('Set thumbnails width for front page'), tsi, tsm);
      AddLine(MakeDesc('Set thumbnails width for search page'), MakeListElement("search_thumbnail", ['default', '240px', '360px']));
	  AddLine(MakeDesc('Set video player size:'), MakeListElement("default_player", ['Flexible', '640x360px', '853x480px', '1280x720px']));
	  AddLine (MakeDesc ('Force video quality'), MakeListElement ('video_quality', ['Auto (default)', '144p', '240p', '360p', '480p', '720p', '1080p (HD)', '1440p (HD)', '2160p (4K)', '2880p (5K)', '4320p (8K)']));
      AddLine(MakeBoolElement("hide_yt_suggested_blocks"), MakeDesc('Hide suggestions blocks on main page (recommended playlists, latest posts, etc.)'));
      AddLine(MakeBoolElement("clear_search"), MakeDesc("Hide suggestions blocks in search (for you, people also watched, etc.)"));
      AddLine(MakeDesc("Modify channels' pages behaviour"), MakeListElement('channel_top', ['default', 'hide banner with scrolling', 'hide banner on load']));
      AddLine(MakeDesc("Change YT logo target to https://www.youtube.com/..."), MakeTextElement("logo_target"));
      e1 = document.createElement('input');
      e1.type = 'button';
      e1.className = 'ytfix_button';
      e1.value = 'Save settings and return to YouTube';
      e1.addEventListener('click', function () {
        settings.classic_logo = ess.classic_logo.checked;
        settings.smaller_search = ess.smaller_search.checked;
        settings.thumb_preview = ess.thumb_preview.checked;
        settings.profile_picture = ess.profile_picture.checked;
        settings.grey_watched = ess.grey_watched.checked;
        settings.hide_filters = ess.hide_filters.checked;
        settings.hide_guide = ess.hide_guide.checked;
        settings.thumbnail_size = ess.thumbnail_size.selectedIndex;
        if (settings.thumbnail_size == 5) {
          let v = ess.thumbnail_size_m.value;
          if (!/^\d+$/.test(v)) {
            alert('Error: invalid value for thumbnails size');
            return;
          }
          settings.thumbnail_size_m = parseInt(v);
        }
        settings.search_thumbnail = ess.search_thumbnail.selectedIndex;
        settings.default_player = ess.default_player.selectedIndex;
        settings.hide_yt_suggested_blocks = ess.hide_yt_suggested_blocks.checked;
        settings.channel_top = ess.channel_top.selectedIndex;
        settings.logo_target = ess.logo_target.value;
        settings.clear_search = ess.clear_search.checked;
		settings.video_quality = ess.video_quality.selectedIndex;
        ls.setItem('__fix__settings__', JSON.stringify(settings));
        alert('Settings saved');
        history.back();
      });
      e2 = document.createElement('input');
      e2.type = 'button';
      e2.className = 'ytfix_button';
      e2.value = 'Return to YouTube without saving';
      e2.addEventListener('click', function () {
        history.back();
      });
      e3 = document.createElement('input');
      e3.type = 'button';
      e3.className = 'ytfix_button';
      e3.value = 'DONATE PayPal';
      e3.addEventListener('click', function () {
        location.href = 'https://www.paypal.com/donate?hosted_button_id=2EJR4DLTR4Y7Q';
      });
      AddLine(e1, e2);
      e4 = document.createElement('b');
      e4.appendChild(document.createElement("br"));
      e4.appendChild(document.createElement("br"));
      e4.appendChild(document.createElement("br"));
      e4.appendChild(document.createElement("br"));
      e4.appendChild(document.createTextNode('Do you like this script?'));
      e4.appendChild(document.createElement("br"));
      e4.appendChild(document.createElement("br"));
      AddLine(e4);
      e4 = document.createElement('paypal');
      e4.appendChild(document.createTextNode('PayPal'));
      AddLine(e4);
      e4.innerHTML += "<form action='https://www.paypal.com/donate' method='post' target='_top'><input type='hidden' name='hosted_button_id' value='2EJR4DLTR4Y7Q' /><input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif' border='0' name='submit' title='PayPal - The safer, easier way to pay online!' alt='Donate with PayPal button' /><img alt='' border='0' src='https://www.paypal.com/en_US/i/scr/pixel.gif' width='1' height='1' /></form>"
      e4 = document.createElement('h5');
      e4.appendChild(document.createTextNode('Please donate to keep this project alive and up to date!'));
      AddLine(e4);
      e4 = document.createElement('h5');
      e4.appendChild(document.createTextNode('I, "7kt" have spent many hours creating this script, even more so by daily debugging / responding to bug reports,'));
      e4.appendChild(document.createElement("br"));
      e4.appendChild(document.createTextNode('figuring out and develop all requests of new functions and improvements. Thank you for your support!'));
      AddLine(e4);
    }
    let int = setInterval(function () {
      if (!document.body)
        return;
      document.body.appendChild(back);
      document.body.appendChild(plane);
      clearInterval(int);
    }, 1);
  }
  // apply settings
  let styles = [],
    intervals = [];

  function addInterval(period, func, params) {
    if (!period)
      period = 1;
    intervals.push({
      cnt: period,
      period: period,
      call: func,
      params: params || []
    });
  }
  if (settings.hide_guide)
    addInterval(1, function (info) {
      if (info.act == 0) { // observe location change
        let url = document.location.toString();
        if (url != info.url)
          info.act = 1;
      }
      if (info.act == 1) { // wait for sorp page load completion
        let Q = document.getElementsByTagName('yt-page-navigation-progress');
        if (!Q.length)
          return;
        if (Q[0].hasAttribute('hidden'))
          info.act = 2;
      }
      if (info.act == 2) { // wait for button and press it if necessary
        let guide_button = document.getElementById('guide-button');
        if (!guide_button)
          return;
        let tmp = guide_button.getElementsByTagName('button');
        if (!tmp.length)
          return;
        tmp = tmp[0];
        if (!tmp.hasAttribute('aria-pressed'))
          return;
        if (tmp.attributes['aria-pressed'].value == 'true')
          guide_button.click();
        else {
          info.url = document.location.toString();
          info.act = 0;
        }
      }
    }, [{
      act: 2
    }]);
  // old engine:
  //if (document.getElementById ('appbar-guide-button'))
  //  document.documentElement.classList.remove ('show-guide');
  if (settings.classic_logo) {
    styles.push('ytd-masthead #logo-icon-container, #contentContainer #logo-icon-container, ytd-topbar-logo-renderer > #logo {content: url("https://i.ibb.co/rfKJyVz/classic-Logo.png") !important;width: 72px !important;height: auto !important;}ytd-masthead[dark] #logo-icon-container, html[dark] #contentContainer #logo-icon-container, ytd-masthead[dark] ytd-topbar-logo-renderer > #logo, html[dark] ytd-topbar-logo-renderer > #logo {content: url("https://i.ibb.co/56XCNzt/classic-Logo-Dark.png") !important;width: 72px !important;height: auto !important;}#start > #masthead-logo, #masthead > #masthead-logo {content: url("https://i.ibb.co/56XCNzt/classic-Logo-Dark.png") !important;width: 72px !important;height: auto !important;}html[dark] #start > #masthead-logo, html[dark] #masthead > #masthead-logo {content: url("https://i.ibb.co/56XCNzt/classic-Logo-Dark.png") !important;width: 72px !important;height: auto !important}html:not([dark]) ytd-guide-entry-renderer[active] > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, html:not([dark]) ytd-guide-entry-renderer[active] > #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover {background-color: #cd201f !important}');
  }
  if (settings.thumb_preview) {
    styles.push('#avatar-link.ytd-rich-grid-media,#avatar-link.ytd-rich-grid-video-renderer,#avatar.ytd-c4-tabbed-header-renderer,#masthead-ad,#offer-module,#play.fade-in.ytd-moving-thumbnail-renderer,#play.show.ytd-moving-thumbnail-renderer,#selectionBar.paper-tabs,#thumbnail.ytd-moving-thumbnail-renderer,.not-visible.paper-tabs,.ytp-miniplayer-button,[id*=skeleton],paper-ripple,ytd-compact-movie-renderer.ytd-watch-next-secondary-results-renderer,ytd-compact-promoted-item-renderer,ytd-mini-guide-renderer.ytd-app,ytd-search ytd-video-renderer[use-prominent-thumbs] #channel-info.ytd-video-renderer>a>yt-img-shadow.ytd-video-renderer{display:none!important}#details.ytd-rich-grid-video-renderer{cursor:auto!important;pointer-events:none!important}#details.ytd-rich-grid-video-renderer *>a,#details.ytd-rich-grid-video-renderer *>button.yt-icon-button{cursor:pointer!important;pointer-events:initial!important}');
  }
  if (settings.profile_picture) {
    styles.push('#thumbnail.ytd-profile-column-user-info-renderer, yt-img-shadow.ytd-topbar-menu-button-renderer, #avatar.ytd-active-account-header-renderer, #avatar.ytd-video-owner-renderer, #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer, #author-thumbnail.ytd-comment-simplebox-renderer, #avatar.ytd-c4-tabbed-header-renderer, yt-img-shadow.ytd-channel-avatar-editor, yt-img-shadow.ytd-guide-entry-renderer, #author-thumbnail.ytd-commentbox, ytd-commentbox[is-reply][is-backstage-comment] #author-thumbnail.ytd-commentbox {border-radius: 0%!important;}');
  }
  if (settings.hide_filters) {
    styles.push('#header.ytd-rich-grid-renderer{display:none!important} yt-related-chip-cloud-renderer{display:none!important}');
  }
  if (settings.smaller_search) {
    styles.push('#center.ytd-masthead { margin-right: auto;flex: 0 1 628px!important} ytd-searchbox.ytd-masthead{margin: 0 0 0 25px!important}');
  }
  if (settings.grey_watched) {
    styles.push('.watched:not(ytd-thumbnail):not(.details):not(.metadata), .watched .yt-ui-ellipsis {mix-blend-mode:luminosity}html[dark] .watched, html[dark] .watched .yt-ui-ellipsis,.playlist-videos-container>.playlist-videos-list>li.watched,.playlist-videos-container>.playlist-videos-list>li.watched>a,.playlist-videos-container>.playlist-videos-list>li.watched .yt-ui-ellipsis{mix-blend-mode:luminosity } .watched ytd-thumbnail #thumbnail.ytd-thumbnail {opacity: 0.35 !important; mix-blend-mode:luminosity}');
  }
  if (settings.thumbnail_size)
    styles.push('ytd-rich-item-renderer{width:' + [0, 180, 240, 360, 480, settings.thumbnail_size_m][settings.thumbnail_size] + 'px!important}');
  if (settings.hide_yt_suggested_blocks)
    styles.push('div#contents.ytd-rich-grid-renderer ytd-rich-section-renderer{display:none!important}');
  if (settings.search_thumbnail) {
    let sz = [0, 240, 360][settings.search_thumbnail] + 'px!important';
    // min-width defaults to 240px, max-width defaults to 360px
    // sizes for: videos, playlists, channels, mixes
    styles.push('ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer,ytd-playlist-renderer[use-prominent-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer,ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer,ytd-radio-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-radio-renderer{min-width:' + sz + ';max-width:' + sz + '}');
  }
  if (settings.clear_search)
    styles.push('ytd-two-column-search-results-renderer ytd-shelf-renderer.style-scope.ytd-item-section-renderer,ytd-two-column-search-results-renderer ytd-horizontal-card-list-renderer.style-scope.ytd-item-section-renderer{display:none!important}');
	const sizes = [undefined, { w: 640, h: 360 }, { w: 854, h: 480 }, { w: 1280, h: 720 }];
  let size_norm = sizes[settings.default_player];
  if (size_norm)
        styles.push('#primary.ytd-watch-flexy, #player-container-outer{--ytd-watch-flexy-min-player-width:' + size_norm.h + 'px!important;min-height:' + size_norm.h + 'px!important;min-width:--ytd-watch-flexy-min-player-width: 100%!important;max-width:' + size_norm.w + 'px!important}ytd-watch-flexy[flexy_][is-two-columns_][is-extra-wide-video_] #primary.ytd-watch-flexy, ytd-watch-flexy[flexy_][is-two-columns_][is-four-three-to-sixteen-nine-video_] #primary.ytd-watch-flexy{min-width:' + size_norm.w + 'px!important} ytd-watch-flexy[flexy_][flexy-large-window_]:not([is-extra-wide-video_]), ytd-watch-flexy[flexy_][flexy-large-window_][transcript-opened_][is-two-columns_]:not([is-extra-wide-video_]), ytd-watch-flexy[flexy_][flexy-large-window_][playlist][is-two-columns_]:not([is-extra-wide-video_]), ytd-watch-flexy[flexy_][flexy-large-window_][should-stamp-chat][is-two-columns_]:not([is-extra-wide-video_]) {--ytd-watch-flexy-min-player-height:' + size_norm.h + 'px!important;');
  if (size_norm)
    addInterval(1, function (sn, st) {
      let eq = document.getElementsByTagName("ytd-watch-flexy");
      if (!eq.length)
        return;
      let s = eq[0].hasAttribute('size_norm') ? st : sn;
      if (!s)
        return;
      let ep = document.getElementById("movie_player");
      if (ep && ep.setInternalSize && ep.isFullscreen && ep.getPlayerSize && !ep.isFullscreen() && ep.getPlayerSize()
        .width != s[0])
        ep.setInternalSize(s[0], s[1]);
    }, [size_norm]);
  if (settings.logo_target) {
    let X = settings.logo_target;
    if (X[0] != '/')
      X = '/' + X;
    X = document.location.origin + X;
    addInterval(1, function (url) {
      let l = document.querySelectorAll('a#logo');
      for (let i = l.length; --i >= 0;) {
        let Q = l[i];
        let D = Q.data;
        if (D && D.commandMetadata && Q.href != url) {
          Q.href = url;
          D.commandMetadata.webCommandMetadata.url = url;
        }
      }
    }, [X]);
  }
  if (settings.channel_top)
    styles.push('app-header#header.style-scope.ytd-c4-tabbed-header-renderer{transform:none!important;position:absolute;left:0px!important;top:0px;margin-top:0px}');
  if (settings.channel_top > 1) {
    styles.push('div#contentContainer.style-scope.app-header-layout{padding-top:148px!important}');
    styles.push('div#contentContainer.style-scope.app-header{height:148px!important}');
    styles.push('div.banner-visible-area.style-scope.ytd-c4-tabbed-header-renderer{display:none!important}');
  }
  	if (settings.video_quality) {
		const qv = ['', 'tiny', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'hd2160', 'hd2880', 'highres'];
		function IsQualityAvailable (qq, q) {
			for (let i = qq.length; --i >= 0; )
				if (q == qq [i])
					return true;
			return false;
			}
		function UpdateVideoQuality (st) {
			let ep = document.getElementById ("movie_player");
			if (!ep || !ep.getPreferredQuality || !ep.getAvailableQualityLevels || !ep.setPlaybackQualityRange || !ep.getVideoData || ep.getPreferredQuality () != 'auto')
				return;
			let vid = ep.getVideoData ().video_id;
			if (st.fail == vid)	// last time on this video we've issues
				return;
			let qq = ep.getAvailableQualityLevels ();
			if (!qq || !qq.length)
				return;
			let det = settings.video_quality;
			while (det < qv.length && !IsQualityAvailable (qq, qv [det]))
				++det;
			if (det == qv.length) {
				console.log ('Unknown video qualities in list: ', qq);
				st.fail = vid;
				return;
				}
			ep.setPlaybackQualityRange (qv [det], qv [det]);
			};
		addInterval (1, UpdateVideoQuality, [{}]);
		}
  // "settings" button
  // can't store created button: Polymer overrides it's content on soft reload leaving tags in place
  // but can store element that Polymer does not know how to deal with and just drops
  let settingsButtonMark;

  function createSettingsButton() {
    if (settingsButtonMark && settingsButtonMark.parentNode)
      return;
    let toolBar = document.getElementsByTagName('ytd-topbar-menu-button-renderer');
    let _1st = toolBar[0];
    if (!_1st)
      return;
    toolBar = _1st.parentNode;
    let sb = document.createElement('ytd-topbar-menu-button-renderer');
    sb.className = 'style-scope ytd-masthead style-default';
    sb.setAttribute('use-keyboard-focused', '');
    sb.setAttribute('is-icon-button', '');
    sb.setAttribute('has-no-text', '');
    toolBar.insertBefore(sb, toolBar.childNodes[0]);
    let mark = document.createElement('fix-settings-mark');
    mark.style = 'display:none';
    toolBar.insertBefore(mark, sb); // must be added to parent node of buttons in order to Polymer dropped it on soft reload
    let icb = document.createElement('yt-icon-button');
    icb.id = 'button';
    icb.className = 'style-scope ytd-topbar-menu-button-renderer style-default';
    let aa = document.createElement('a');
    aa.className = 'yt-simple-endpoint style-scope ytd-topbar-menu-button-renderer';
    aa.setAttribute('tabindex', '-1');
    aa.href = '/fix-settings';
    aa.appendChild(icb);
    sb.getElementsByTagName('div')[0].appendChild(aa); // created by YT scripts
    let bb = icb.getElementsByTagName('button')[0]; // created by YT scripts
    bb.setAttribute('aria-label', 'fixes settings');
    let ic = document.createElement('yt-icon');
    ic.className = 'style-scope ytd-topbar-menu-button-renderer';
    bb.appendChild(ic);
    let gpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    gpath.className.baseVal = 'style-scope yt-icon';
    gpath.setAttribute('d', 'M1 20l6-6h2l11-11v-1l2-1 1 1-1 2h-1l-11 11v2l-6 6h-1l-2-2zM13 15l2-2 8 8v1l-1 1h-1zM9 11l2-2-2-2 1.5-3-3-3h-2l3 3-1.5 3-3 1.5-3-3v2l3 3 3-1.5z');
    let svgg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svgg.className.baseVal = 'style-scope yt-icon';
    svgg.appendChild(gpath);
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.className.baseVal = 'style-scope yt-icon';
    svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
    svg.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('style', 'pointer-events: none; display: block; width: 100%; height: 100%;');
    svg.appendChild(svgg);
    ic.appendChild(svg); // YT clears *ic
    settingsButtonMark = mark;
  }
  addInterval(1, createSettingsButton, []);
  // styles
  function AddStyles() {
    if (styles.length == 0)
      return;
    if (!document.head)
      return setTimeout(AddStyles, 1);
    let style_element = document.createElement('style');
    style_element.type = 'text/css';
    style_element.innerHTML = styles.join('');
    document.head.appendChild(style_element);
  }
  AddStyles();
  // intervals
  setInterval(function () {
    for (let i = intervals.length; --i >= 0;) {
      let Q = intervals[i];
      if (--Q.cnt > 0)
        continue;
      Q.call.apply(this, Q.params);
      Q.cnt = Q.period;
    }
  }, 1000);
  console.log('Fixed loaded');
})();
(function () {
  "use strict";
  var vidfix = {
    inject: function (is_user_script) {
      var modules;
      var vidfix_api;
      var user_settings;
      var default_language;
      var send_settings_to_page;
      var receive_settings_from_page;
      modules = [];
      vidfix_api = {
        initializeBypasses: function () {
          var ytd_watch;
          var sizeBypass;
          if (ytd_watch = document.querySelector("ytd-watch, ytd-watch-flexy")) {
            sizeBypass = function () {
              var width;
              var height;
              var movie_player;
              if (!ytd_watch.theater && !document.querySelector(".iri-full-browser") && (movie_player = document.querySelector("#movie_player"))) {
                width = movie_player.offsetWidth;
                height = Math.round(movie_player.offsetWidth / (16 / 9));
                if (ytd_watch.updateStyles) {
                  ytd_watch.updateStyles({
                    "--ytd-watch-flexy-width-ratio": 1,
                    "--ytd-watch-flexy-height-ratio": 0.5625
                  });
                  ytd_watch.updateStyles({
                    "--ytd-watch-width-ratio": 1,
                    "--ytd-watch-height-ratio": 0.5625
                  });
                }
              }
              else {
                width = window.NaN;
                height = window.NaN;
              }
              return {
                width: width,
                height: height
              };
            };
            if (ytd_watch.calculateCurrentPlayerSize_) {
              if (!ytd_watch.calculateCurrentPlayerSize_.bypassed) {
                ytd_watch.calculateCurrentPlayerSize_ = sizeBypass;
                ytd_watch.calculateCurrentPlayerSize_.bypassed = true;
              }
              if (!ytd_watch.calculateNormalPlayerSize_.bypassed) {
                ytd_watch.calculateNormalPlayerSize_ = sizeBypass;
                ytd_watch.calculateNormalPlayerSize_.bypassed = true;
              }
            }
          }
        },
        initializeSettings: function (new_settings) {
          var i;
          var j;
          var option;
          var options;
          var loaded_settings;
          var vidfix_settings;
          if (vidfix_settings = document.getElementById("vidfix-settings")) {
            loaded_settings = JSON.parse(vidfix_settings.textContent || "null");
            receive_settings_from_page = vidfix_settings.getAttribute("settings-beacon-from");
            send_settings_to_page = vidfix_settings.getAttribute("settings-beacon-to");
            vidfix_settings.remove();
          }
          user_settings = new_settings || loaded_settings || user_settings || {};
          for (i = 0; i < modules.length; i++) {
            for (options in modules[i].options) {
              if (modules[i].options.hasOwnProperty(options)) {
                option = modules[i].options[options];
                if (!(option.id in user_settings) && "value" in option) {
                  user_settings[option.id] = option.value;
                }
              }
            }
          }
        },
        initializeModulesUpdate: function () {
          var i;
          for (i = 0; i < modules.length; i++) {
            if (modules[i].onSettingsUpdated) {
              modules[i].onSettingsUpdated();
            }
          }
        },
        initializeModules: function () {
          var i;
          for (i = 0; i < modules.length; i++) {
            if (modules[i].ini) {
              modules[i].ini();
            }
          }
        },
        initializeOption: function () {
          var key;
          if (this.started) {
            return true;
          }
          this.started = true;
          for (key in this.options) {
            if (this.options.hasOwnProperty(key)) {
              if (!(key in user_settings) && this.options[key].value) {
                user_settings[key] = this.options[key].value;
              }
            }
          }
          return false;
        },
        initializeBroadcast: function (event) {
          if (event.data) {
            if (event.data.type === "settings") {
              if (event.data.payload) {
                if (event.data.payload.broadcast_id === this.broadcast_channel.name) {
                  this.initializeSettings(event.data.payload);
                  this.initializeModulesUpdate();
                }
              }
            }
          }
        },
        ini: function () {
          this.initializeSettings();
          this.broadcast_channel = new BroadcastChannel(user_settings.broadcast_id);
          this.broadcast_channel.addEventListener("message", this.initializeBroadcast.bind(this));
          document.documentElement.addEventListener("load", this.initializeSettingsButton, true);
          document.documentElement.addEventListener("load", this.initializeBypasses, true);
          if (this.isSettingsPage) {
            this.initializeModules();
          }
        }
      };
      vidfix_api.ini();
    },
    isAllowedPage: function () {
      var current_page;
      if (current_page = window.location.pathname.match(/\/[a-z-]+/)) {
        current_page = current_page[0];
      }
      else {
        current_page = window.location.pathname;
      }
      return [
        "/tv", "/embed", "/live_chat", "/account", "/account_notifications", "/create_channel", "/dashboard", "/upload", "/webcam"
      ].indexOf(current_page) < 0;
    },
    generateUUID: function () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
        /[018]/g,
        function (point) {
          return (point ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> point / 4).toString(16);
        }
      );
    },
    saveSettings: function () {
      if (this.is_user_script) {
        this.GM.setValue(this.id, JSON.stringify(this.user_settings));
      }
      else {
        chrome.storage.local.set({
          vidfixSettings: this.user_settings
        });
      }
    },
    updateSettingsOnOpenWindows: function () {
      this.broadcast_channel
        .postMessage({
          type: "settings",
          payload: this.user_settings
        });
    },
    settingsUpdatedFromOtherWindow: function (event) {
      if (event.data && event.data.broadcast_id === this.broadcast_channel.name) {
        this.user_settings = event.data;
        this.saveSettings();
      }
    },
    contentScriptMessages: function (custom_event) {
      var updated_settings;
      if ((updated_settings = custom_event.detail.settings) !== undefined) {
        this.saveSettings();
      }
    },
    initializeScript: function (event) {
      var holder;
      this.user_settings = event[this.id] || event;
      if (!this.user_settings.broadcast_id) {
        this.user_settings.broadcast_id = this.generateUUID();
        this.saveSettings();
      }
      this.broadcast_channel = new BroadcastChannel(this.user_settings.broadcast_id);
      this.broadcast_channel.addEventListener("message", this.settingsUpdatedFromOtherWindow.bind(this));
      event = JSON.stringify(this.user_settings);
      holder = document.createElement("vidfix-settings");
      holder.id = "vidfix-settings";
      holder.textContent = event;
      holder.setAttribute("style", "display: none");
      holder.setAttribute("settings-beacon-from", this.receive_settings_from_page);
      holder.setAttribute("settings-beacon-to", this.send_settings_to_page);
      document.documentElement.appendChild(holder);
      holder = document.createElement("script");
      holder.textContent = "(" + this.inject + "(" + this.is_user_script.toString() + "))";
      document.documentElement.appendChild(holder);
      holder.remove();
      this.inject = null;
      delete this.inject;
    },
    main: function (event) {
      var now;
      var context;
      now = Date.now();
      this.receive_settings_from_page = now + "-" + this.generateUUID();
      this.send_settings_to_page = now + 1 + "-" + this.generateUUID();
      window.addEventListener(
        this.receive_settings_from_page, this.contentScriptMessages.bind(this), false
      );
      if (!event) {
        if (this.is_user_script) {
          context = this;
          // javascript promises are horrible
          this.GM
            .getValue(this.id, "{}")
            .then(function (value) {
              event = JSON.parse(value);
              context.initializeScript(event);
            });
        }
      }
      else {
        this.initializeScript(event);
      }
    },
    ini: function () {
      if (this.isAllowedPage()) {
        this.is_settings_page = window.location.pathname === "/vidfix-settings";
        this.id = "vidfixSettings";
        if (typeof GM === "object" || typeof GM_info === "object") {
          this.is_user_script = true;
          // GreaseMonkey 4 polly fill
          // https://arantius.com/misc/greasemonkey/imports/greasemonkey4-polyfill.js
          if (typeof GM === "undefined") {
            this.GM = {
              setValue: GM_setValue,
              info: GM_info,
              getValue: function () {
                return new Promise((resolve, reject) => {
                  try {
                    resolve(GM_getValue.apply(this, arguments));
                  }
                  catch (e) {
                    reject(e);
                  }
                });
              }
            };
          }
          else {
            this.GM = GM;
          }
          this.main();
        }
        else {
          this.is_user_script = false;
          chrome.storage.local.get(this.id, this.main.bind(this));
        }
      }
    }
  };
  vidfix.ini();

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }
  addGlobalStyle('.html5-video-player { background-color: #000; }');
}());
(function () {
  'use strict'
  const DEBUG = true
  const RESTORE_ORIGINAL_TITLE_FOR_CURRENT_VIDEO = true
  const createLogger = (console, tag) =>
    Object.keys(console)
    .map(k => [k, (...args) => (DEBUG ? console[k](tag + ': ' + args[0], ...args.slice(1)) : void 0)])
    .reduce((acc, [k, fn]) => ((acc[k] = fn), acc), {})
  const logger = createLogger(console, 'YTDL')
  const sleep = ms => new Promise(res => setTimeout(res, ms))
  const LANG_FALLBACK = 'en'
  const LOCALE = {
    en: {
      togglelinks: 'Show/Hide Links',
      stream: 'DOWNLOAD VIDEO',
      adaptive: 'Adaptive',
      videoid: 'Video Id: ',
      inbrowser_adaptive_merger: 'In browser adaptive video & audio merger'
    },
    'zh-tw': {
      togglelinks: '顯示 / 隱藏連結',
      stream: '串流 Stream',
      adaptive: '自適應 Adaptive',
      videoid: '影片 ID: ',
      inbrowser_adaptive_merger: '瀏覽器版自適應影片及聲音合成器'
    },
    zh: {
      togglelinks: '显示 / 隐藏链接',
      stream: '串流 Stream',
      adaptive: '自适应 Adaptive',
      videoid: '视频 ID: ',
      inbrowser_adaptive_merger: '浏览器版自适应视频及声音合成器'
    },
    kr: {
      togglelinks: '링크 보이기/숨기기',
      stream: '스트리밍',
      adaptive: '조정 가능한',
      videoid: 'Video Id: {{id}}'
    },
    es: {
      togglelinks: 'Mostrar/Ocultar Links',
      stream: 'Stream',
      adaptive: 'Adaptable',
      videoid: 'Id del Video: ',
      inbrowser_adaptive_merger: 'Acoplar Audio a Video '
    },
    he: {
      togglelinks: 'הצג/הסתר קישורים',
      stream: 'סטרים',
      adaptive: 'אדפטיבי',
      videoid: 'מזהה סרטון: {{id}}'
    }
  }
  const findLang = l => {
    // language resolution logic: zh-tw --(if not exists)--> zh --(if not exists)--> LANG_FALLBACK(en)
    l = l.toLowerCase()
      .replace('_', '-')
    if (l in LOCALE) return l
    else if (l.length > 2) return findLang(l.split('-')[0])
    else return LANG_FALLBACK
  }
  const $ = (s, x = document) => x.querySelector(s)
  const $el = (tag, opts) => {
    const el = document.createElement(tag)
    Object.assign(el, opts)
    return el
  }
  const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parseDecsig = data => {
    try {
      if (data.startsWith('var script')) {
        // they inject the script via script tag
        const obj = {}
        const document = {
          createElement: () => obj,
          head: {
            appendChild: () => {}
          }
        }
        eval(data)
        data = obj.innerHTML
      }
      const fnnameresult = /=([a-zA-Z0-9\$]+?)\(decodeURIComponent/.exec(
        data
      )
      const fnname = fnnameresult[1]
      const _argnamefnbodyresult = new RegExp(escapeRegExp(fnname) + '=function\\((.+?)\\){(.+?)}')
        .exec(data)
      const [_, argname, fnbody] = _argnamefnbodyresult
      const helpernameresult = /;(.+?)\..+?\(/.exec(fnbody)
      const helpername = helpernameresult[1]
      const helperresult = new RegExp('var ' + escapeRegExp(helpername) + '={[\\s\\S]+?};')
        .exec(data)
      const helper = helperresult[0]
      logger.log(`parsedecsig result: %s=>{%s\n%s}`, argname, helper, fnbody)
      return new Function([argname], helper + '\n' + fnbody)
    }
    catch (e) {
      logger.error('parsedecsig error: %o', e)
      logger.info('script content: %s', data)
      logger.info(
        'If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.'
      )
    }
  }
  const parseQuery = s => [...new URLSearchParams(s)
    .entries()
  ].reduce((acc, [k, v]) => ((acc[k] = v), acc), {})
  const getVideo = async (id, decsig) => {
    return xf
      .get(`https://www.youtube.com/get_video_info?video_id=${id}&html5=1`)
      .text()
      .then(async data => {
        const obj = parseQuery(data)
        const playerResponse = JSON.parse(obj.player_response)
        logger.log(`video %s data: %o`, id, obj)
        logger.log(`video %s playerResponse: %o`, id, playerResponse)
        if (obj.status === 'fail') {
          throw obj
        }
        let stream = []
        if (playerResponse.streamingData.formats) {
          stream = playerResponse.streamingData.formats.map(x => Object.assign(x, parseQuery(x.cipher)))
          logger.log(`video %s stream: %o`, id, stream)
          if (stream[0].sp && stream[0].sp.includes('sig')) {
            stream = stream
              .map(x => ({
                ...x,
                s: decsig(x.s)
              }))
              .map(x => ({
                ...x,
                url: x.url + `&sig=${x.s}`
              }))
          }
        }
        let adaptive = []
        if (playerResponse.streamingData.adaptiveFormats) {
          adaptive = playerResponse.streamingData.adaptiveFormats.map(x =>
            Object.assign(x, parseQuery(x.cipher))
          )
          logger.log(`video %s adaptive: %o`, id, adaptive)
          if (adaptive[0].sp && adaptive[0].sp.includes('sig')) {
            adaptive = adaptive
              .map(x => ({
                ...x,
                s: decsig(x.s)
              }))
              .map(x => ({
                ...x,
                url: x.url + `&sig=${x.s}`
              }))
          }
        }
        logger.log(`video %s result: %o`, id, {
          stream,
          adaptive
        })
        return {
          stream,
          adaptive,
          meta: obj
        }
      })
  }
  const getVideoDetails = id =>
    xf
    .get('https://www.googleapis.com/youtube/v3/videos', {
      qs: {
        key: 'AIzaSyBk6o0igFl-P4Qe4ouVlRTPlqX7kruWdUg',
        part: 'snippet',
        id
      }
    })
  const workerMessageHandler = async e => {
    const decsig = await xf.get(e.data.path)
      .text(parseDecsig)
    const result = await getVideo(e.data.id, decsig)
    self.postMessage(result)
  }
  const ytdlWorkerCode = `
importScripts('https://unpkg.com/xfetch-js@0.5.0/dist/xfetch.min.js')
const DEBUG=${DEBUG}
const logger=(${createLogger})(console, 'YTDL')
const escapeRegExp=${escapeRegExp}
const parseQuery=${parseQuery}
const parseDecsig=${parseDecsig}
const getVideo=${getVideo}
self.onmessage=${workerMessageHandler}`
  const ytdlWorker = new Worker(URL.createObjectURL(new Blob([ytdlWorkerCode])))
  const workerGetVideo = (id, path) => {
    logger.log(`workerGetVideo start: %s %s`, id, path)
    return new Promise((res, rej) => {
      const callback = e => {
        ytdlWorker.removeEventListener('message', callback)
        logger.log('workerGetVideo end: %o', e.data)
        res(e.data)
      }
      ytdlWorker.addEventListener('message', callback)
      ytdlWorker.postMessage({
        id,
        path
      })
    })
  }
  const template = `

<table width="100%" cellspacing="0" padding="0">
<tr align="left" valign="top">
    <div class="d-flex">
      <div class="t-left fs-16px f-1 of-h">

<a class="ytdl-link-btn fs-14px" target="_blank" v-for="vid in stream" :href="vid.url" :title="vid.type" v-text="vid.type||vid.quality"></a>
                 </div>
      </div></th>
  </tr>

</table>

`.slice(1)
  const app = new Vue({
    data() {
      return {
        hide: true,
        id: '',
        stream: [],
        adaptive: [],
        dark: false,
        lang: findLang(navigator.language)
      }
    },
    template
  })
  logger.log(`default language: %s`, app.lang)
  // attach element
  const shadowHost = $el('div')
  const shadow = shadowHost.attachShadow ? shadowHost.attachShadow({
    mode: 'closed'
  }) : shadowHost // no shadow dom
  logger.log('shadowHost: %o', shadowHost)
  const container = $el('div')
  shadow.appendChild(container)
  app.$mount(container)
  if (DEBUG && typeof unsafeWindow !== 'undefined') {
    // expose some functions for debugging
    unsafeWindow.$app = app
    unsafeWindow.parseQuery = parseQuery
    unsafeWindow.parseDecsig = parseDecsig
    unsafeWindow.getVideo = getVideo
  }
  const getLangCode = () => {
    return (
      (ytplayer && ytplayer.config && ytplayer.config.args.host_language) ||
      (yt && yt.config_.GAPI_LOCALE) ||
      navigator.language ||
      "en_US"
    );
  };
  const textToHtml = t => {
    t = t.replace(
      /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim, '<a href="$1" target="_blank">$1</a>'
    )
    t = t.replace(/\n/g, '<br>')
    return t
  }
  const applyOriginalTitle = meta => {
    const data = eval(`(${meta.player_response})`)
      .videoDetails // not a valid json, so JSON.parse won't work
    if ($('#eow-title')) {
      // legacy youtube
      $('#eow-title')
        .textContent = data.title
      $('#eow-description')
        .innerHTML = textToHtml(data.shortDescription)
    }
    else if ($('h1.title')) {
      // new youtube (polymer)
      $('h1.title')
        .textContent = data.title
      $('yt-formatted-string.content')
        .innerHTML = textToHtml(data.shortDescription)
    }
  }
  const load = async id => {
    try {
      const basejs =
        (typeof ytplayer !== 'undefined' && ytplayer.config.assets ?
          'https://' + location.host + ytplayer.config.assets.js :
          'https://' +
          location.host +
          ytplayer.web_player_context_config.jsUrl) ||
        $('script[src$="base.js"]')
        .src
      const data = await workerGetVideo(id, basejs)
      logger.log('video loaded: %s', id)
      if (RESTORE_ORIGINAL_TITLE_FOR_CURRENT_VIDEO) {
        try {
          applyOriginalTitle(data.meta)
        }
        catch (e) {
          // just make sure the main function will work even if original title applier doesn't work
        }
      }
      app.id = id
      app.stream = data.stream
      app.adaptive = data.adaptive
      app.meta = data.meta
      const actLang = getLangCode()
      if (actLang !== null) {
        const lang = findLang(actLang)
        logger.log('youtube ui lang: %s', actLang)
        logger.log('ytdl lang:', lang)
        app.lang = lang
      }
    }
    catch (err) {
      logger.error('load', err)
    }
  }
  let prev = null
  setInterval(() => {
    const el =
      $('#info-contents') ||
      $('#watch-header') ||
      $('.page-container:not([hidden]) ytm-item-section-renderer>lazy-list')
    if (el && !el.contains(shadowHost)) {
      el.appendChild(shadowHost)
    }
    if (location.href !== prev) {
      logger.log(`page change: ${prev} -> ${location.href}`)
      prev = location.href
      if (location.pathname === '/watch') {
        shadowHost.style.display = 'block'
        const id = parseQuery(location.search)
          .v
        logger.log('start loading new video: %s', id)
        app.hide = false // fold it
        load(id)
      }
      else {
        shadowHost.style.display = 'none'
      }
    }
  }, 1000)
  const css = `

.t-left{
text-align: left;
  margin-top: 5px;
    margin-right: 10px;
}
.d-flex{
display: flex;
}
.f-1{
flex: 1;
}
.fs-14px{
font-size: 10px;
}
.fs-16px{
font-size: 15px;
font-weight: 500;
margin-top: -18px;
}
.of-h{
overflow: hidden;
}
.box{
border-bottom: 1px solid var(--yt-border-color);
font-family: 'YouTube Noto',Roboto,arial,sans-serif !important;
}
.box-toggle{
margin: 3px;
user-select: none;
-moz-user-select: -moz-none;
}
.box-toggle:hover{
color: blue;
}
.ytdl-link-btn{
text-decoration: none !important;
outline: 2px;
text-align: center;
padding: 2px;
margin-right: 7px;
margin-bottom: 0px;
text-transform: uppercase;
vertical-align: middle;
letter-spacing: 0.5px;
display: initial;
border-radius: 0px !important;
color: #fff;
background: #909090;
}

a.ytdl-link-btn:hover{
color: #fff;
background: #c00;
}
.box.dark{
color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-primary-text-color));
}
.box.dark .ytdl-link-btn{
color: var(--ytd-video-primary-info-renderer-title-color, var(--yt-primary-text-color));
}
.box.dark .ytdl-link-btn:hover{
color: rgba(200, 200, 255, 0.8);
}
.box.dark .box-toggle:hover{
color: rgba(200, 200, 255, 0.8);
}
`
  shadow.appendChild($el('style', {
    textContent: css
  }))
})()

function injectStylesheet(url) {
  ('head')
  .append('<link rel="stylesheet" href="' + url + '" type="text/css" />');
}
(function replace() {
  var css = [
 "f:root {"
, " 	 --dgyt-bg-color-dark: rgb(15,15,15);"
, " 	 --dgyt-bg-color-medium: rgb(33,33,33);"
, " 	 --dgyt-cell-bg-color: rgba(0,0,0,0.2);"
, "  	 --dgyt-menu-bg-color: rgba(21,21,21,0.8);"
, " 	 --dgyt-button-color: rgba(255,255,255,0.1);"
, " 	 --dgyt-button-color-hover: rgba(255,255,255,0.22);"
, " 	 --dgyt-border-color: rgba(0,0,0,0.2);"
, " 	 --dgyt-text-main: rgb(192,192,192);"
, " 	 --dgyt-text-secondary: rgb(142,142,142);"
, " 	 --dgyt-text-highlight: rgb(255,255,255);"
, " 	 --dgyt-color-red: rgb(204,24,30);"
, " 	 --dgyt-color-blue: rgb(22,122,198);"
, " 	 --dgyt-color-yellow: rgb(245,213,98);"
, " 	 --dgyt-color-orange: rgb(255,85,0);"
, " 	 --dgyt-color-purple: rgb(156,39,176);"
, " 	 --dgyt-color-green: rgb(76,175,80);"
, " }"
,":root {"
, "   --yt-link-letter-spacing:0!important; "
, "   --ytd-user-comment_-_letter-spacing:0!important;"
, " }"
, " tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {"
, "   letter-spacing:0"
, " }"
, " html:not(.style-scope)[typography-spacing] {"
, "   --yt-subheadline-letter-spacing: 0;"
, "   --yt-subheadline-link-letter-spacing: 0;"
, "   --yt-link-letter-spacing: .25px;"
, "   --yt-thumbnail-attribution-letter-spacing: 0;"
, "   --yt-user-comment-letter-spacing: 0;"
, "   --yt-guide-highlight-letter-spacing: 0;"
, "   --yt-caption-letter-spacing: 0;"
, "   --yt-badge-letter-spacing: 0;"
, "   --yt-tab-system-letter-spacing: 0;"
, " }"
, "  #avatar-link.ytd-rich-grid-media {"
, " 	 height: 0px!important;"
, " 	 margin-top: 0px!important;"
, " 	 margin-right: 0px!important;"
, " 	 visibility: hidden!important;"
, " 	 position: fixed!important;"
, " }"
, " yt-live-chat-message-input-renderer  {"
, "    margin-bottom: -1px;"
, " }"
, "#chat.ytd-watch-flexy {"
, " 	 margin-bottom: var(--ytd-margin-3x)!important;"
, " 	 margin-left: -14px;"
, " 	 margin-right: 14px;"
, " }"
, "#chat-container.ytd-watch-flexy:not([chat-collapsed]){"
, " 	width: var(--ytd-watch-flexy-chat-max-width);"
, " 	margin-left: -14px;"
, " 	margin-right: 14px;"
, " 	margin-bottom: 10px;"
, " }"
, " ytd-watch-flexy[flexy] #chat.ytd-watch-flexy:not([collapsed]).ytd-watch-flexy, ytd-watch-flexy[flexy] #chat-container.ytd-watch-flexy:not([chat-collapsed]).ytd-watch-flexy {"
, " 	min-height: 591px !important;"
, " }"
, "  ytd-watch-flexy[flexy][theater] #columns.ytd-watch-flexy{"
, "   min-width:100%!important"
, " }"
, "  ytd-watch-flexy[is-two-columns_][theater] #columns.ytd-watch-flexy {"
, " 	min-width: 100%;"
, " }"
, " ytd-watch-flexy[flexy][is-two-columns_][theater] #primary.ytd-watch-flexy, ytd-watch-flexy[flexy][is-two-columns_] #primary.ytd-watch-flexy {"
, " 	justify-content: flex-start;"
, " 	max-width: var(--ytd-watch-flexy-max-player-width);"
, " 	min-width: 80%;"
, " }"
, " ytd-watch-flexy[flexy][is-two-columns_][theater][is-four-three-to-sixteen-nine-video_] #primary.ytd-watch-flexy{"
, " 	justify-content: flex-start;"
, " 	min-width:70%;"
, " }"
, "  yt-icon.style-scope.ytd-badge-supported-renderer, ytd-author-comment-badge-renderer:not([m]) #icon.ytd-author-comment-badge-renderer {"
, " 	color: transparent;"
, " 	fill: transparent!important;"
, " 	background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflbdpYum.webp) -146px -556px;"
, " 	height: 9px;"
, " 	margin-bottom:0px;"
, " }"
, " yt-icon.style-scope.ytd-badge-supported-renderer:hover, ytd-author-comment-badge-renderer #icon.ytd-author-comment-badge-renderer:hover{"
, " 	background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflbdpYum.webp) -732px -646px"
, " }"
, "  #contents.ytd-rich-metadata-row-renderer *.ytd-rich-metadata-row-renderer {"
, " 	 content-visibility: hidden!important;"
, " 	 visibility: hidden!important;"
, " 	 height: 0px"
, " }"
, "  a {"
, " 	 color: #167ac6"
, " }"
, "  a:visited {"
, " 	 color: #167ac6"
, " }"
, "  ytd-banner-promo-renderer.banner-promo-style-type-masthead-v2 .ytd-banner-promo-renderer-background.ytd-banner-promo-renderer {"
, " 	 visibility: hidden;"
, " 	 height: 0px!important"
, " }"
, "  ytd-action-companion-ad-renderer {"
, " 	 display: none!important"
, " }"
, "  #expander.ytd-comment-renderer>paper-button.ytd-expander {"
, " 	 text-align: left;"
, " 	"
, " }"
, "  .title.style-scope.ytd-video-primary-info-renderer yt-formatted-string.ytd-video-primary-info-renderer {"
, " 	font-size: 20px;"
, " }"
, " ytd-toggle-button-renderer {"
, " 	font-weight: normal !important;"
, " }"
, " #like-bar.ytd-sentiment-bar-renderer {"
, " 	background: #167ac6 !important;"
, " }"
, " html:not([dark]) #author-text.yt-simple-endpoint.ytd-comment-renderer {"
, " 	color: #128ee9 !important;"
, " }"
, " html:not([dark]) ytd-author-comment-badge-renderer {"
, " 	--ytd-author-comment-badge-name-color: #128ee9 !important;"
, " }"
, " html:not([dark]) .more-button.ytd-comment-replies-renderer, html:not([dark]) .less-button.ytd-comment-replies-renderer {"
, " 	color: #2793e6 !important;"
, " }"
, " ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy, ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy {"
, " 	padding-top:12px !important;"
, " }"
, " ytd-expander.ytd-video-secondary-info-renderer {"
, " 	line-height:15px !important;"
, " 	font-size:13px !important;"
, "    --ytd-expander-collapsed-height: 65px!important;"
, " }"
, " #description.ytd-video-secondary-info-renderer {"
, " 	max-width:none !important;"
, " }"
, " html:not([dark]) #vote-count-middle.ytd-comment-action-buttons-renderer {"
, " 	color: #128ee9 !important;"
, " }"
, " html[dark] #vote-count-middle.ytd-comment-action-buttons-renderer {"
, " 	color: #3ea6ff !important;"
, " }"
, " .content.ytd-metadata-row-header-renderer {"
, " 	display:none !important;"
, " }"
, " ytd-metadata-row-renderer {"
, " 	margin:0 !important;"
, " }"
, " #title.ytd-metadata-row-renderer {"
, " 	font-size:11px !important;"
, " 	margin:0 !important;"
, " }"
, "  .content.ytd-metadata-row-renderer {"
, " 	font-size:11px !important;"
, " 	font-weight:normal !important;"
, " }"
, " html:not([dark]) ytd-author-comment-badge-renderer[creator] {"
, " 	background-color: transparent !important;"
, " }"
, " #primary-inner.ytd-watch-flexy #title.ytd-rich-metadata-renderer, #primary-inner.ytd-watch-flexy #subtitle.ytd-rich-metadata-renderer, #primary-inner.ytd-watch-flexy #call-to-action.ytd-rich-metadata-renderer {"
, " 	font-size: 11px !important;"
, " 	line-height: 15px !important;"
, " 	margin-top: 0px !important;"
, " }"
, " #primary-inner.ytd-watch-flexy #call-to-action.ytd-rich-metadata-renderer {"
, " 	align-items: normal !important;"
, " }"
, " #primary-inner.ytd-watch-flexy #call-to-action.ytd-rich-metadata-renderer yt-icon {"
, " 	display: none;"
, " }"
, " #primary-inner.ytd-watch-flexy ytd-thumbnail.ytd-rich-metadata-renderer {"
, " 	max-width: 40px !important;"
, " 	max-height: 56px !important;"
, " 	margin: 0px 10px 0 0 !important;"
, " }"
, " #primary-inner.ytd-watch-flexy ytd-rich-metadata-renderer {"
, " 	max-width: min-content !important;"
, " 	min-width: max-content !important;"
, " }"
, " #always-shown ytd-rich-metadata-renderer {"
, " 	background: none;"
, " }"
, "  ytd-watch-flexy[is-two-columns_][fullscreen] #columns.ytd-watch-flexy {"
, " 	min-width: 100%"
, " }"
, " ytd-watch-flexy[flexy][is-two-columns_][fullscreen] #primary.ytd-watch-flexy, ytd-watch-flexy[flexy][is-two-columns_] #primary.ytd-watch-flexy {"
, " 	justify-content: flex-start;"
, " 	max-width: var(--ytd-watch-flexy-max-player-width);"
, " 	min-width: 80%;"
, " }"
, " ytd-watch-flexy[flexy][is-two-columns_][fullscreen][is-four-three-to-sixteen-nine-video_] #primary.ytd-watch-flexy{"
, " 	justify-content: flex-start;"
, " 	min-width:70%;"
, " }"
, "  ytd-watch-flexy[flexy][fullscreen] #columns.ytd-watch-flexy{"
, " 	min-width:100%!important"
, " }"
, "  html{"
, " 	font-family:'YouTube Noto',Roboto,arial,sans-serif!important"
, " }"
, " html:not(.style-scope){"
, " 	--paper-font-common-base_-_font-family: 'YouTube Noto', Roboto, arial, sans-serif !important;"
, " 	--paper-font-body1_-_font-size: 13px !important;"
, " 	--paper-font-body2_-_font-size: 13px !important;"
, " 	--paper-font-caption_-_font-size: 12px !important;"
, " 	--paper-font-menu_-_font-size: 13px !important;"
, " 	--paper-font-button_-_font-size: 13px !important;"
, " 	--ytd-thumbnail-attribution_-_font-size: 11px !important;"
, " 	--ytd-user-comment_-_font-size: 13px !important;"
, " 	--ytd-caption_-_font-size: 11px !important;"
, " 	--ytd-tab-system_-_font-size: 13px !important;"
, " 	--ytd-comment-link_-_font-size: 13px !important;"
, " 	--ytd-subheadline_-_font-size: 13px !important;"
, " 	--ytd-grid-video-title_-_font-size: 13px !important;"
, " 	--paper-font-body1_-_font-weight: 500 !important;"
, " 	--ytd-thumbnail-attribution_-_font-weight: 400 !important;"
, " 	--ytd-user-comment_-_font-weight: 400 !important;"
, " 	--ytd-subheadline_-_font-weight: 400 !important;"
, " 	--ytd-thumbnail-attribution_-_line-height: 1.4em !important;"
, " 	--ytd-user-comment_-_line-height: 1.3em !important;"
, " 	--ytd-comment-link_-_line-height: 1.3em !important;"
, " 	--ytd-subheadline_-_line-height: 1.3em !important;"
, " 	--paper-font-button_-_text-transform: none !important;"
, " 	--yt-endpoint-hover_-_text-decoration: underline !important;"
, " 	--ytd-rich-grid-item-margin: 10px !important"
, "   --paper-tooltip_-_letter-spacing:0;"
, "   --ytd-grid-video-title_-_letter-spacing:0!important;"
, " 	--ytd-masthead-height: 49px !important;"
, " 	--ytd-toolbar-height: 49px !important"
, " }"
, " #channel-container *>#text.ytd-channel-name{"
, " 	font-size:20px!important"
, " }"
, " #title.ytd-rich-grid-renderer,#title.ytd-rich-shelf-renderer,#title.ytd-vertical-channel-section-renderer{"
, " 	font-size:15px!important"
, " }"
, " #video-title.ytd-playlist-renderer,#video-title.ytd-radio-renderer,#video-title.ytd-video-renderer,ytd-compact-video-renderer #video-title.ytd-compact-video-renderer{"
, " 	font-size:14px!important"
, " }"
, " #author-text.yt-simple-endpoint.ytd-comment-renderer,#content-text.ytd-backstage-post-renderer,#content-text.ytd-comment-renderer,#expander.ytd-comment-replies-renderer,#video-title.ytd-rich-grid-video-renderer,.title.ytd-guide-entry-renderer,.title.ytd-mini-channel-renderer,h3.ytd-rich-grid-media,ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button-end.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer,ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer,ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer,ytd-guide-entry-renderer[active],ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media{"
, " 	font-size:13px!important"
, " }"
, " .less-button.ytd-video-secondary-info-renderer,.more-button.ytd-video-secondary-info-renderer{"
, " 	font-size:13px!important"
, " }"
, " #guide-section-title.ytd-guide-section-renderer,.badge.ytd-badge-supported-renderer,ytd-mini-channel-renderer a.yt-simple-endpoint.ytd-button-renderer,ytd-video-meta-block[rich-meta] #channel-name.ytd-video-meta-block,ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block{"
, " 	font-size:11px!important"
, " }"
, " .less-button.ytd-comment-renderer,.more-button.ytd-comment-renderer{"
, " 	font-size:13px!important;"
, " 	text-transform:uppercase!important"
, " }"
, " #upnext.ytd-compact-autoplay-renderer,#video-title.ytd-playlist-renderer,#video-title.ytd-radio-renderer,#video-title.ytd-video-renderer{"
, " 	font-weight:500!important"
, " }"
, " .badge.ytd-badge-supported-renderer{"
, " 	font-weight:400!important"
, " }"
, " #content-text.ytd-backstage-post-renderer,#content-text.ytd-comment-renderer,#expander.ytd-comment-replies-renderer,#title.ytd-rich-grid-renderer,#title.ytd-rich-shelf-renderer,#video-title.ytd-rich-grid-video-renderer,ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button-end.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer,ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer,ytd-expander.ytd-video-secondary-info-renderer,ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media{"
, " 	line-height:1.3em!important"
, " }"
, " ytd-compact-video-renderer #video-title.ytd-compact-video-renderer,ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer{"
, " 	line-height:1.2!important"
, " }"
, " .title.ytd-guide-entry-renderer,ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer{"
, " 	line-height:20px!important"
, " }"

, " #author-text.yt-simple-endpoint.ytd-comment-renderer:hover,#video-title.ytd-playlist-renderer:hover,#video-title.ytd-radio-renderer:hover,#video-title.ytd-rich-grid-video-renderer:hover,#video-title.ytd-video-renderer:hover,yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover,ytd-comment-replies-renderer *>ytd-button-renderer yt-formatted-string.ytd-button-renderer:hover,ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer:hover,ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media:hover{"
, " 	text-decoration:underline!important"
, " }"
, " #autoplay.ytd-compact-autoplay-renderer,#title.ytd-vertical-channel-section-renderer,paper-tabs.ytd-c4-tabbed-header-renderer,ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button-end.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer,ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer{"
, " 	text-transform:initial!important"
, " }"
, " @media (min-width:900px){"
, " 	ytd-rich-grid-renderer{"
, " 	--ytd-rich-grid-items-per-row: 4 !important"
, " }"
, " }"
, " @media (min-width:1200px){"
, " 	ytd-rich-grid-renderer{"
, " 	--ytd-rich-grid-items-per-row: 5 !important"
, " }"
, " }"
, " @media (min-width:1800px){"
, " 	ytd-rich-grid-renderer{"
, " 	--ytd-rich-grid-items-per-row: 6 !important"
, " }"
, " }"
, " @media (min-width:2500px){"
, " 	ytd-rich-grid-renderer{"
, " 	--ytd-rich-grid-items-per-row: 9 !important"
, " }"
, " }"
, " ytd-two-column-browse-results-renderer{"
, " 	margin-top:10px!important"
, " }"
, " @media (min-width:900px){"
, " 	ytd-two-column-browse-results-renderer{"
, " 	max-width:850px!important"
, " }"
, " }"
, " @media (min-width:1200px){"
, " 	ytd-two-column-browse-results-renderer{"
, " 	max-width:1056px!important"
, " }"
, " }"
, " @media (min-width:1800px){"
, " 	ytd-two-column-browse-results-renderer{"
, " 	max-width:1262px!important"
, " }"
, " }"
, " @media (min-width:2500px){"
, " 	ytd-two-column-browse-results-renderer{"
, " 	max-width:2200px!important"
, " }"
, " }"
, " @media (min-width:900px){"
, " 	html:not(.style-scope){"
, " 	--ytd-grid-video-item_-_width: 196px !important;"
, " 	--ytd-grid-thumbnail_-_width: 196px !important;"
, " 	--ytd-grid-thumbnail_-_height: 110px !important;"
, " 	--ytd-thumbnail-height: 110px !important"
, " }"
, " }"
, " @media (min-width:2500px){"
, " 	html:not(.style-scope){"
, " 	--ytd-grid-video-item_-_width: 210px !important;"
, " 	--ytd-grid-thumbnail_-_width: 210px !important;"
, " 	--ytd-grid-thumbnail_-_height: 118px !important;"
, " 	--ytd-thumbnail-height: 118px !important"
, " }"
, " }"
, " 	ytd-two-column-browse-results-renderer{"
, " 	margin-top:10px!important"    
, " }"
, " #grid-title.ytd-rich-grid-renderer{"
, " 	margin:10px 0 0 10px!important"
, " }"
, " ytd-thumbnail.ytd-grid-video-renderer,ytd-thumbnail.ytd-rich-grid-media,ytd-thumbnail.ytd-rich-grid-video-renderer{"
, " 	margin-bottom:4px!important"
, " }"
, " ytd-rich-grid-media[mini-mode] h3.ytd-rich-grid-media{"
, " 	margin-bottom:1px!important;"
, " 	padding-right:24px!important"
, " }"
, " h3.ytd-rich-grid-media{"
, " 	margin:0!important"
, " }"
, " #rich-shelf-header.ytd-rich-shelf-renderer{"
, " 	margin:10px 0!important"
, " }"
, " #meta.ytd-grid-video-renderer,#meta.ytd-rich-grid-media,#meta.ytd-rich-grid-video-renderer{"
, " 	padding-right:0!important"
, " }"
, " ytd-rich-item-renderer{"
, " 	margin-bottom:12px!important"
, " }"
, " h3.ytd-grid-video-renderer,h3.ytd-rich-grid-video-renderer{"
, " 	margin:0 20px 0 0!important"
, " }"
, " html:not([dark]) paper-button.ytd-expander,html:not([dark]) ytd-rich-shelf-renderer{"
, " 	border-top:1px solid #e2e2e2!important"
, " }"
, " html:not([dark]) #show-more-button.ytd-rich-shelf-renderer,html:not([dark]) ytd-rich-shelf-renderer[is-show-more-hidden] #dismissable.ytd-rich-shelf-renderer{"
, " 	border-bottom:1px solid #e2e2e2!important"
, " }"
, " html[dark] ytd-rich-shelf-renderer{"
, " 	border-top:1px solid #1a1a1a!important"
, " }"
, " html[dark] #show-more-button.ytd-rich-shelf-renderer,html[dark] ytd-rich-shelf-renderer[is-show-more-hidden] #dismissable.ytd-rich-shelf-renderer{"
, " 	border-bottom:1px solid #1a1a1a!important"
, " }"
, " ytd-section-list-renderer[page-subtype=subscriptions] #items.ytd-grid-renderer>ytd-grid-video-renderer.ytd-grid-renderer{"
, " 	width:196px!important;"
, " 	margin-right:10px!important;"
, " 	margin-bottom:12px!important"
, " }"
, " ytd-section-list-renderer[page-subtype=subscriptions] ytd-thumbnail.ytd-grid-video-renderer{"
, " 	height:110px!important;"
, " 	width:196px!important;"
, " 	margin-bottom:4px!important"
, " }"
, " ytd-section-list-renderer[page-subtype=channels] #items.ytd-grid-renderer,ytd-section-list-renderer[page-subtype=subscriptions] #items.ytd-grid-renderer{"
, " 	margin-right:-15px!important"
, " }"
, " ytd-browse[page-subtype=channels] app-header{"
, " 	transform:unset!important;"
, " 	position:static!important;"
, " 	margin-top:0!important"
, " }"
, " #contentContainer.app-header-layout{"
, " 	padding-top:0!important"
, " }"
, " #header.ytd-c4-tabbed-header-renderer{"
, " 	--app-header-background-front-layer_-_background-position: center 0 !important"
, " }"
, " @media (min-width:900px){"
, " 	#header.ytd-c4-tabbed-header-renderer{"
, " 	--app-header-background-front-layer_-_background-size: 100% 175px !important"
, " }"
, " }"
, " @media (min-width:1800px){"
, " 	#header.ytd-c4-tabbed-header-renderer{"
, " 	--app-header-background-front-layer_-_background-size: 100% 209.1382614px !important"
, " }"
, " }"
, " @media (min-width:2500px){"
, " 	#header.ytd-c4-tabbed-header-renderer{"
, " 	--app-header-background-front-layer_-_background-size: 100% 245px !important"
, " }"
, " }"
, " @media (min-width:900px){"
, " 	ytd-c4-tabbed-header-renderer[has-channel-art] .banner-visible-area.ytd-c4-tabbed-header-renderer,ytd-c4-tabbed-header-renderer[has-channel-art][guide-persistent-and-visible] .banner-visible-area.ytd-c4-tabbed-header-renderer{"
, " 	height:175px!important"
, " }"
, " }"
, " @media (min-width:1800px){"
, " 	ytd-c4-tabbed-header-renderer[has-channel-art] .banner-visible-area.ytd-c4-tabbed-header-renderer,ytd-c4-tabbed-header-renderer[has-channel-art][guide-persistent-and-visible] .banner-visible-area.ytd-c4-tabbed-header-renderer{"
, " 	height:209.1382614px!important"
, " }"
, " }"
, " @media (min-width:2500px){"
, " 	ytd-c4-tabbed-header-renderer[has-channel-art] .banner-visible-area.ytd-c4-tabbed-header-renderer,ytd-c4-tabbed-header-renderer[has-channel-art][guide-persistent-and-visible] .banner-visible-area.ytd-c4-tabbed-header-renderer{"
, " 	height:245px!important"
, " }"
, " }"
, " @media (min-width:900px){"
, " 	#header.ytd-browse{"
, " 	width:850px!important"
, " }"
, " ytd-browse-feed-actions-renderer.ytd-two-column-browse-results-renderer{"
, "   padding: 0!important;"
, " }"
, " @media (min-width:1200px){"
, " 	#header.ytd-browse{"
, " 	width:1056px!important"
, " }"
, " ytd-browse-feed-actions-renderer.ytd-two-column-browse-results-renderer{"
, " 	padding:0 15px!important;"
, " }"
, " }"
, " @media (min-width:1800px){"
, " 	#header.ytd-browse{"
, " 	width:1262px!important;"
, " 	padding:0 15px!important;"
, " }"
, " ytd-browse-feed-actions-renderer.ytd-two-column-browse-results-renderer{"
, " 	padding:0 15px!important;"

, " }"
, " ytd-browse-feed-actions-renderer.ytd-two-column-browse-results-renderer{"
, " 	padding:0 15px!important;"
, " }"
, " }"
, " @media (min-width:2500px){"
, " 	#header.ytd-browse{"
, " 	width:2200px!important"
, " }"
, " ytd-browse-feed-actions-renderer.ytd-two-column-browse-results-renderer{"
, " 	padding:0 15px!important;"
, " }"
, " ytd-browse-secondary-contents-renderer.ytd-two-column-browse-results-renderer{"
, " 	margin-left:10px!important;"
, " 	padding:15px!important;"
, " }"
, " }"
, " ytd-section-list-renderer{"
, " 	padding:0 15px!important;"
, " }"
, " ytd-browse[page-subtype~=channels] ytd-two-column-browse-results-renderer.ytd-browse *>#items.ytd-grid-renderer>ytd-grid-video-renderer.ytd-grid-renderer{"
, " 	margin-right:10px!important;"
, " 	margin-bottom:20px!important"
, " }"
, " #tabs-container.ytd-c4-tabbed-header-renderer,app-toolbar.ytd-c4-tabbed-header-renderer,paper-tabs.ytd-c4-tabbed-header-renderer{"
, " 	height:32px!important"
, " }"
, " tp-yt-app-toolbar.ytd-c4-tabbed-header-renderer, #tabs-container.ytd-c4-tabbed-header-renderer, #tabs-inner-container.ytd-c4-tabbed-header-renderer, tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer, #tabsContainer.tp-yt-paper-tabs {"
, "   height:32px"
, " }"
, " #tabsContent.tp-yt-paper-tabs > :not(#selectionBar) {"
, "   padding-left:3px;"
, "   padding-right:3px;"
, "   margin-left:20px"
, " }"
, " #selectionBar.tp-yt-paper-tabs {"
, "   display:none"
, " }"
, " tp-yt-paper-tab.ytd-c4-tabbed-header-renderer {"
, "   padding-bottom:3px;"
, "   height:29px!important"
, " }"
, " tp-yt-paper-tab.ytd-c4-tabbed-header-renderer:hover, tp-yt-paper-tab.iron-selected.ytd-c4-tabbed-header-renderer {"
, "   border-bottom:3px solid #cc181e;"
, "   padding:0"
, " }"
, " ytd-c4-tabbed-header-renderer[guide-persistent-and-visible] tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {"
, "   margin-left: calc(50% - 642px - -56px)!important;"
, " }"    
, " ytd-c4-tabbed-header-renderer[guide-persistent-and-visible] tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {"
, "   margin-left:-56px!important"
, " }"
, " .tab-content.tp-yt-paper-tab {"
, "   color: #666;"
, "   font-size: 13px;"
, "   font-weight: normal;"
, "   font-family:roboto"
, " }"
, " tp-yt-paper-tab.iron-selected.ytd-c4-tabbed-header-renderer .tab-content.tp-yt-paper-tab {"
, " color: var(--yt-lightsource-primary-title-color);"
, "   font-weight:500"
, " }"
, " #tabs-container.ytd-c4-tabbed-header-renderer {"
, "   margin-left:0!important"
, " }"
, " yt-icon-button.ytd-expandable-tab-renderer {"
, "   opacity: .33;"
, "   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfluKv9vH.png) 0 -738px;"
, "   background-size: auto;"
, "   width: 15px!important;"
, "   height: 15px!important;"
, "   color:transparent"
, " }"
, " yt-icon-button.ytd-expandable-tab-renderer:hover {"
, "   opacity:1"
, " }"
, " .input-content.tp-yt-paper-input-container > label, .input-content.tp-yt-paper-input-container > iron-input {"
, "   height:15px;"
, "   padding-top:5px;"
, "   padding-bottom:6px;"
, "   margin-bottom:3px"
, " }"
, " paper-tab.ytd-c4-tabbed-header-renderer{"
, " 	padding:0 12px!important"
, " }"
, " paper-tabs.ytd-c4-tabbed-header-renderer{"
, " 	margin-left:0!important;"
, " 	padding-bottom:0!important"
, " }"
, " #channel-header.ytd-c4-tabbed-header-renderer{"
, " 	padding:15px!important"
, " }"
, " html:not([dark]) ytd-c4-tabbed-header-renderer{"
, " 	--yt-lightsource-section1-color: #fff !important"
, " }"
, " html:not([dark]) app-toolbar.ytd-c4-tabbed-header-renderer{"
, " 	background-color:#fff!important"
, " }"
, " html:not([dark]) paper-tabs.ytd-c4-tabbed-header-renderer{"
, " 	--paper-tabs-selection-bar-color: #f00"
, " }"
, " html:not([dark]) paper-tab.iron-selected.ytd-c4-tabbed-header-renderer>.tab-content.paper-tab,html:not([dark]) paper-tab:not(.iron-selected)>.tab-content.paper-tab:hover{"
, " 	box-shadow:inset 0 -3px red"
, " }"
, "  html:not([dark]) paper-tab:not(.iron-selected)>.tab-content.paper-tab{"
, " 	opacity:.8!important;"
, " 	font-weight:400!important"
, " }"
, " html[dark] ytd-c4-tabbed-header-renderer{"
, " 	--yt-lightsource-section1-color: #212121 !important"
, " }"
, " html[dark] app-toolbar.ytd-c4-tabbed-header-renderer{"
, " 	background-color:#212121!important"
, " }"
, " html[dark] paper-tabs.ytd-c4-tabbed-header-renderer{"
, " 	--paper-tabs-selection-bar-color: #cd1821 !important"
, " }"
, " html[dark] paper-tab.iron-selected.ytd-c4-tabbed-header-renderer>.tab-content.paper-tab,html[dark] paper-tab:not(.iron-selected)>.tab-content.paper-tab:hover{"
, " 	box-shadow:inset 0 -3px #cd1821!important"
, " }"
, " ytd-section-list-renderer[page-subtype=channels] #items.ytd-grid-renderer>ytd-grid-video-renderer.ytd-grid-renderer{"
, " 	width:196px!important"
, " }"
, " ytd-section-list-renderer[page-subtype=channels] #items.ytd-grid-renderer ytd-thumbnail.ytd-grid-video-renderer{"
, " 	width:196px!important;"
, " 	height:110px!important"
, " }"
, " #content.ytd-rich-section-renderer>.ytd-rich-section-renderer,#title.ytd-vertical-channel-section-renderer{"
, " 	margin-bottom:10px!important"
, " }"
, " #metadata-container.ytd-channel-video-player-renderer,#title.ytd-channel-video-player-renderer{"
, " 	margin-bottom:3px!important"
, " }"
, " #description.ytd-channel-video-player-renderer{"
, " 	margin-top:7px!important"
, " }"
, " ytd-browse[page-subtype~=channels] #contents.ytd-shelf-renderer,ytd-browse[page-subtype~=channels] .grid-subheader.ytd-shelf-renderer{"
, " 	margin-top:15px!important"
, " }"
, " #items.ytd-watch-next-secondary-results-renderer,ytd-comments{"
, " 	padding:15px!important"
, " }"
, " ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy,ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy{"
, " 	padding-top:10px!important"
, " }"
, " ytd-watch-next-secondary-results-renderer{"
, " 	position:relative!important;"
, " 	right:14px!important"
, " }"
, " ytd-watch-flexy[fullscreen] #secondary.ytd-watch-flexy,ytd-watch-flexy[theater] #secondary.ytd-watch-flexy{"
, " 	margin-top:10px!important"
, " }"
, " ytd-comments-header-renderer{"
, " 	margin-top:0!important"
, " }"
, " #top-row.ytd-video-secondary-info-renderer{"
, " 	padding-top:0!important"
, " }"
, " ytd-app[mini-guide-visible_] ytd-page-manager.ytd-app,ytd-expander.ytd-video-secondary-info-renderer{"
, " 	margin-left:0!important"
, " }"
, " ytd-video-secondary-info-renderer{"
, " 	margin:10px 0!important;"
, " 	padding:15px!important"
, " }"
, " ytd-video-primary-info-renderer{"
, " 	padding:15px!important;"
, " 	margin-top:10px!important;"
, " 	--yt-button-icon-size: 32px !important"
, " }"
, " #expander.ytd-comment-renderer>paper-button.ytd-expander{"
, " 	padding:8px!important;"
, " 	margin-top:8px!important"
, " }"
, " ytd-sentiment-bar-renderer{"
, " 	padding-top:13px!important"
, " }"
, " #menu.ytd-video-primary-info-renderer{"
, " 	top:13px!important"
, " }"
, " html:not([dark]) #like-bar.ytd-sentiment-bar-renderer{"
, " 	background:#167ac6!important"
, " }"
, " html[dark] #like-bar.ytd-sentiment-bar-renderer{"
, " 	background:#1879c6!important"
, " }"
, " #container.ytd-playlist-panel-renderer{"
, " 	position:relative!important;"
, " 	right:14px!important"
, " }"
, " #playlist.ytd-watch-flexy{"
, " 	margin-bottom:10px!important"
, " }"
, " html:not([dark]) app-drawer#guide{"
, " 	border-right:1px solid #e8e8e8!important"
, " }"
, " html:not([dark]) #guide-section-title.ytd-guide-section-renderer{"
, " 	color:red"
, " }"
, " html:not([dark]) ytd-guide-entry-renderer[active] .guide-icon.ytd-guide-entry-renderer,html:not([dark]) ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer{"
, " 	color:#fff!important"
, " }"
, " html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,html:not([dark]) ytd-guide-entry-renderer[active]>#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover{"
, " 	background-color:red"
, " }"
, " html:not([dark]) #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover{"
, " 	background-color:#444!important;"
, " 	color:unset!important"
, " }"
, " html:not([dark]) .guide-icon.ytd-guide-entry-renderer{"
, " 	color:unset!important"
, " }"
, " html:not([dark]) .guide-icon.ytd-guide-entry-renderer:hover, html:not([dark]) .title.ytd-guide-entry-renderer:hover{"
, " 	color:#fff"
, " }"
, "tp-yt-paper-item.ytd-guide-entry-renderer{"
, " 	color:#878787"
, " }"
, "tp-yt-paper-item.ytd-guide-entry-renderer:hover{"
, " 	color:#fff!important"
, " }"
, " html:not([dark]) ytd-guide-entry-renderer[active] *>.title.ytd-guide-entry-renderer,html:not([dark]) ytd-guide-entry-renderer[active] .guide-icon.ytd-guide-entry-renderer{"
, " 	text-shadow:-1px -1px 0 rgba(0,0,0,.25)!important"
, " }"
, " ytd-app{"
, " 	--app-drawer-width: 230px !important"
, " }"
, " app-drawer.ytd-app:not([persistent]).ytd-app,ytd-guide-renderer.ytd-app{"
, " 	width:230px!important"
, " }"
, " app-drawer.ytd-app:not([persistent]).ytd-app{"
, " 	border-right:none!important;"
, " 	box-shadow:5px 10px 15px 5px rgba(0,0,0,.1)!important;"
, " 	transition-duration:0ms!important"
, " }"
, " #contentContainer.app-drawer,#scrim{"
, " 	transition-duration:0ms!important"
, " }"
, " paper-item.ytd-guide-entry-renderer{"
, " 	height:28px!important;"
, " 	padding:0 8px!important"
, " }"
, " tp-yt-paper-item.ytd-guide-entry-renderer{"
, " 	height:28px!important;"
, " 	padding:0px 8px!important;"
, " }"
, " #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer>paper-item{"
, " 	min-height:28px!important"
, " }"
, " .guide-icon.ytd-guide-entry-renderer{"
, " 	--iron-icon-height: 20px !important;"
, " 	--iron-icon-width: 20px !important;"
, " 	margin-right:6px!important"
, " }"
, " #sections.ytd-guide-renderer>.ytd-guide-renderer{"
, " 	padding:13px 22px!important"
, " }"
, " #guide-spacer.ytd-app{"
, " 	margin-top:50px!important"
, " }"
, " yt-img-shadow.ytd-guide-entry-renderer{"
, " 	margin-right:6px!important;"
, " }"
, "  #guide-section-title.ytd-guide-section-renderer{"
, " 	padding:1px 0 8px!important;"
, " 	margin:0 5px!important"
, " }"
, " ytd-guide-section-renderer {"
, " --paper-item-min-height: 20px!important;"   
, " }"
, " #container.ytd-masthead,#header.ytd-app,ytd-masthead.shell{"
, " 	height:49px!important"
, " }"
, " #container.ytd-masthead{"
, " 	max-height:49px!important"
, " }"
, " ytd-masthead.shell,ytd-masthead:not([dark]) #container.ytd-masthead{"
, " 	border-bottom:1px solid #e8e8e8!important"
, " }"
, " html[dark] #container.ytd-searchbox,html[dark] #search-icon-legacy.ytd-searchbox{"
, " 	box-shadow:none!important;"
, " 	background-color:#383838!important;"
, " 	border:0!important"
, " }"
, " #masthead-container.ytd-app{"
, " 	transition:none!important"
, " }"
, " html:not([dark]) #sign-in-button #button.ytd-button-renderer,html:not([dark]) ytd-button-renderer.style-suggestive.ytd-masthead #button.ytd-button-renderer{"
, " 	height:28px!important;"
, " 	padding:0 10px!important;"
, " 	font-size:11px!important;"
, " 	background-color:#167ac6!important;"
, " 	color:#fff!important;"
, " 	border:0!important;"
, " 	margin-top:5px!important"
, " }"
, " html:not([dark]) #sign-in-button #button.ytd-button-renderer:active,html:not([dark]) #sign-in-button #button.ytd-button-renderer:hover,html:not([dark]) ytd-button-renderer.style-suggestive.ytd-masthead #button.ytd-button-renderer:active,html:not([dark]) ytd-button-renderer.style-suggestive.ytd-masthead #button.ytd-button-renderer:hover{"
, " 	background-color:#126db3!important"
, " }"
, " html:not([dark]) #sign-in-button #button.ytd-button-renderer>yt-formatted-string.ytd-button-renderer,html:not([dark]) ytd-button-renderer.style-suggestive.ytd-masthead #button.ytd-button-renderer>yt-formatted-string.ytd-button-renderer{"
, " 	margin-left:0!important"
, " }"
, " html:not([dark]) #sign-in-button #button.ytd-button-renderer>yt-icon,html:not([dark]) ytd-button-renderer.style-suggestive.ytd-masthead #button.ytd-button-renderer>yt-icon{"
, " 	display:none!important"
, " }"
, " html:not([dark]) .ytd-masthead button.yt-icon-button>yt-icon{"
, " 	opacity:.75!important"
, " }"
, " html:not(.style-scope):not([dark]){"
, " 	--yt-spec-brand-background-primary: #fff !important;"
, " 	--yt-spec-general-background-a: #f1f1f1 !important;"
, " 	--yt-lightsource-section1-color: #fff !important;"
, " 	--yt-spec-text-secondary: #767676 !important;"
, " 	--yt-spec-call-to-action: #167ac6 !important;"
, " 	--yt-spec-text-primary: #222 !important"
, " }"
, " html:not([dark]) #header.ytd-c4-tabbed-header-renderer,html:not([dark]) #info.ytd-watch-flexy,html:not([dark]) #items.ytd-watch-next-secondary-results-renderer,html:not([dark]) #meta.ytd-watch-flexy,html:not([dark]) #primary.ytd-two-column-browse-results-renderer,html:not([dark]) ytd-browse-secondary-contents-renderer.ytd-two-column-browse-results-renderer,html:not([dark]) ytd-comments,html:not([dark]) ytd-two-column-search-results-renderer[center-results] #primary.ytd-two-column-search-results-renderer{"
, " 	box-shadow:0 1px 2px rgba(0,0,0,.1)!important;"
, " 	background-color:#fff!important"
, " }"
, " html:not([dark]) ytd-comments,html:not([dark]) ytd-expander.ytd-video-secondary-info-renderer,html:not([dark]) ytd-video-primary-info-renderer,html:not([dark]) ytd-video-secondary-info-renderer{"
, " 	border:0!important"
, " }"
, " html:not([dark]) #title.ytd-rich-grid-renderer,html:not([dark]) #title.ytd-rich-shelf-renderer,html:not([dark]) #title.ytd-vertical-channel-section-renderer,html:not([dark]) paper-tabs.ytd-c4-tabbed-header-renderer{"
, " 	color:#333!important"
, " }"
, " html:not([dark]) #author-text.yt-simple-endpoint.ytd-comment-renderer,html:not([dark]) #title.ytd-channel-video-player-renderer a,html:not([dark]) #video-title-link.ytd-rich-grid-media,html:not([dark]) #video-title.ytd-playlist-renderer,html:not([dark]) #video-title.ytd-rich-grid-video-renderer,html:not([dark]) #video-title.ytd-video-renderer,html:not([dark]) .title.ytd-mini-channel-renderer:hover,html:not([dark]) h3.ytd-rich-grid-media,html:not([dark]) yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover,html:not([dark]) ytd-compact-playlist-renderer #video-title.ytd-compact-playlist-renderer:hover,html:not([dark]) ytd-compact-radio-renderer.use-ellipsis #video-title.ytd-compact-radio-renderer:hover,html:not([dark]) ytd-compact-video-renderer #video-title.ytd-compact-video-renderer:hover,html:not([dark]) ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer,html:not([dark]) ytd-rich-grid-media[mini-mode] #video-title.ytd-rich-grid-media{"
, " 	color:#167ac6!important"
, " }"
, " html:not([dark]) ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button-end.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer:hover,html:not([dark]) ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer:hover{"
, " 	color:#555!important"
, " }"
, " html[dark]:not(.style-scope){"
, " 	--yt-spec-brand-background-primary: #212121 !important;"
, " 	--yt-spec-general-background-a: #0f0f0f !important;"
, " 	--yt-lightsource-section1-color: #212121 !important;"
, " 	--yt-spec-text-secondary: #8f8f8f !important;"
, " 	--yt-spec-call-to-action: #1879c6 !important"
, " }"
, " html[dark] #header.ytd-c4-tabbed-header-renderer,html[dark] #info.ytd-watch-flexy,html[dark] #items.ytd-watch-next-secondary-results-renderer,html[dark] #meta.ytd-watch-flexy,html[dark] #primary.ytd-two-column-browse-results-renderer,html[dark] ytd-browse-secondary-contents-renderer.ytd-two-column-browse-results-renderer,html[dark] ytd-comments,html[dark] ytd-two-column-search-results-renderer[center-results] #primary.ytd-two-column-search-results-renderer{"
, " 	box-shadow:0 1px 2px rgba(0,0,0,.1)!important;"
, " 	background-color:#212121!important"
, " }"
, " #submenu.ytd-multi-page-menu-renderer ytd-multi-page-menu-renderer.ytd-multi-page-menu-renderer,html[dark] ytd-comments,html[dark] ytd-expander.ytd-video-secondary-info-renderer,html[dark] ytd-video-primary-info-renderer,html[dark] ytd-video-secondary-info-renderer{"
, " 	border:0!important"
, " }"
, " html[dark] #title.ytd-rich-grid-renderer,html[dark] #title.ytd-rich-shelf-renderer,html[dark] paper-tabs.ytd-c4-tabbed-header-renderer{"
, " 	color:#c1c1c1!important"
, " }"
, " html[dark] #author-text.yt-simple-endpoint.ytd-comment-renderer,html[dark] #video-title.ytd-rich-grid-video-renderer,html[dark] #video-title.ytd-video-renderer,html[dark] .title.ytd-mini-channel-renderer:hover,html[dark] yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:hover,html[dark] ytd-compact-video-renderer #video-title.ytd-compact-video-renderer:hover,html[dark] ytd-grid-video-renderer #video-title.yt-simple-endpoint.ytd-grid-video-renderer{"
, " 	color:#c1c1c1!important"
, " }"
, " html[dark] ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button-end.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer:hover,html[dark] ytd-comment-action-buttons-renderer:not([use-comment-icon]) #reply-button.ytd-comment-action-buttons-renderer ytd-button-renderer.ytd-comment-action-buttons-renderer:not([is-icon-button]).ytd-comment-action-buttons-renderer:hover{"
, " 	color:#909090!important"
, " }"
, " body[style='overflow: hidden;']"
, " {"
, " 	overflow-y:auto!important"
, " }"
, " #details.ytd-rich-grid-video-renderer{"
, " 	cursor:auto!important;"
, " 	pointer-events:none!important"
, " }"
, " #details.ytd-rich-grid-video-renderer *>a,#details.ytd-rich-grid-video-renderer *>button.yt-icon-button{"
, " 	cursor:pointer!important;"
, " 	pointer-events:initial!important"
, " }"
, " #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer{"
, " 	width:48px!important;"
, " 	height:48px!important"
, " }"
, " tp-yt-paper-button.ytd-expander{"
, " 	margin:0px 0 -15px!important"
, " }"
, " html:not([dark]) paper-button.keyboard-focus.ytd-subscribe-button-renderer,html:not([dark]) ytd-button-renderer.style-destructive[is-paper-button]{"
, " 	border-color:transparent!important;"
, " 	box-shadow:none!important"
, " }"
, " #subscribe-button paper-button.ytd-button-renderer,paper-button.keyboard-focus.ytd-subscribe-button-renderer,paper-button.ytd-subscribe-button-renderer[subscribed],ytd-button-renderer.style-destructive[is-paper-button]{"
, " 	text-transform:none!important"
, " }"
, " html:not([dark]) paper-button.ytd-subscribe-button-renderer[subscribed],html:not([dark]) ytd-button-renderer.style-compact-gray[is-paper-button],html:not([dark]) ytd-button-renderer.style-suggestive[is-paper-button] paper-button.ytd-button-renderer{"
, " 	border:1px solid #d3d3d3!important;"
, " 	background-color:#f8f8f8!important;"
, " 	color:#333!important;"
, " 	box-shadow:0 1px 0 rgba(0,0,0,.05)!important;"
, " 	border-radius:2px!important;"
, " 	text-transform:none!important"
, " }"
, " html:not([dark]) paper-button.ytd-subscribe-button-renderer[subscribed]:hover,html:not([dark]) ytd-button-renderer.style-compact-gray[is-paper-button]:hover,html:not([dark]) ytd-button-renderer.style-suggestive[is-paper-button] paper-button.ytd-button-renderer:hover{"
, " 	background-color:#f0f0f0!important;"
, " 	border-color:#c6c6c6!important;"
, " 	box-shadow:0 1px 0 rgba(0,0,0,.1)!important"
, " }"
, " html:not([dark]) paper-button.ytd-subscribe-button-renderer[subscribed]:active,html:not([dark]) ytd-button-renderer.style-compact-gray[is-paper-button]:active,html:not([dark]) ytd-button-renderer.style-suggestive[is-paper-button] paper-button.ytd-button-renderer:active{"
, " 	background-color:#e9e9e9!important;"
, " 	border-color:#c6c6c6!important;"
, " 	box-shadow:inset 0 1px 0 #ddd!important"
, " }"
, " .toggle-container.paper-toggle-button{"
, " 	width:37px!important;"
, " 	height:15px!important;"
, " 	cursor:pointer!important"
, " }"
, " .toggle-button.paper-toggle-button{"
, " 	width:13px!important;"
, " 	height:13px!important;"
, " 	box-shadow:none!important;"
, " 	top:1px!important;"
, " 	display:none"
, " }"
    , " paper-ripple,yt-interaction {"
, "   margin-left:0px !important"
, " }"
, " paper-toggle-button[checked] .toggle-button.paper-toggle-button{"
, " 	left:7px!important"
, " }"
, " html:not([dark]) paper-toggle-button[checked]:not([disabled]) .toggle-bar.paper-toggle-button{"
, " 	background-color:#167ac6!important;"
, " 	opacity:unset!important"
, " }"
, " html:not([dark]) .toggle-bar.paper-toggle-button{"
, " 	background-color:#b8b8b8!important;"
, " 	opacity:unset!important"
, " }"
, " html:not([dark]) .toggle-button.paper-toggle-button{"
, " 	background-color:#fbfbfb!important"
, " }"
, " .dropdown-content.paper-menu-button,html:not([dark]) ytd-multi-page-menu-renderer{"
, " 	border:1px solid #c5c5c5!important;"
, " 	border-top:1px solid #c5c5c5!important;"
, " 	box-shadow:0 0 15px rgba(0,0,0,.18)!important"
, " }"
, " html:not([dark]) ytd-menu-popup-renderer{"
, " 	border:1px solid #d3d3d3!important;"
, " 	box-shadow:0 2px 4px rgba(0,0,0,.2)!important;"
, " 	border-radius:0!important"
, " }"
, " ytd-radio-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-radio-renderer,ytd-search ytd-playlist-renderer[use-prominent-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer,ytd-search ytd-video-renderer[use-prominent-thumbs] ytd-thumbnail.ytd-video-renderer{"
, " 	max-width:196px!important;"
, " 	min-width:196px!important"
, " }"
, " ytd-radio-renderer.ytd-item-section-renderer ytd-thumbnail-overlay-side-panel-renderer,ytd-search ytd-playlist-thumbnail #thumbnail.ytd-playlist-thumbnail ytd-thumbnail-overlay-side-panel-renderer{"
, " 	width:70px!important"
, " }"
, " ytd-search #channel-name.ytd-video-renderer{"
, " 	padding-left:0!important"
, " }"
, " #notification-count {"
, "   width: 15px!important;"
, "   height: 15px!important;"
, "   border-radius: 2px!important;"
, "   border: solid var(--yt-spec-brand-background-primary)!important;"
, "   border-width: 1px 1px!important;"
, "   line-height: 14px!important;"
, "   top: 4px!important;"
, " }"
, " ytd-channel-renderer[use-prominent-thumbs] #avatar-section.ytd-channel-renderer{"
, " 	min-width:136px!important;"
, " 	max-width:136px!important"
, " }"
, " #spinnerContainer {"
, "   transform: rotate(0deg) !important;"
, "   -webkit-animation: none !important;"
, "   animation: none !important;"
, " }"
, ".paper-spinner {content:url(https://s.ytimg.com/yts/img/icn_loading_animated-vflff1Mjj.gif)"
, " }"
, "	ytd-button-renderer.style-suggestive[is-paper-button] paper-button.ytd-button-renderer  {"
, "   height: 24px;"
, "   font-size: 12px;"
, "   outline: 1px solid transparent;"
, "   border-radius: 2px;"
, "   box-shadow: 0 1px 0 rgb(0 0 0 / 5%);"
, " }"
, " ytd-subscription-notification-toggle-button-renderer #button.ytd-subscription-notification-toggle-button-renderer {"
, "   height:24px;"
, "   width:24px;"
, "   padding:0px;"
, "   outline: 1px solid transparent;"
, "   border-radius: 2px;"
, "   box-shadow: 0 1px 0 rgb(0 0 0 / 5%);"
, "   border: 1px solid transparent!important;"
, "   background-color: transparent;"
, " }"    
, " html:not([dark]) ytd-subscription-notification-toggle-button-renderer #button.ytd-subscription-notification-toggle-button-renderer {"
, "   height:24px;"
, "   width:24px;"
, "   padding:0px;"
, "   outline: 1px solid transparent;"
, "   border-radius: 2px;"
, "   box-shadow: 0 1px 0 rgb(0 0 0 / 5%);"
, "   border: 1px solid #d3d3d3!important;"
, "   background-color: #f8f8f8;"
, " }"

    		/*subscribe*/
, "	tp-yt-paper-button.ytd-subscribe-button-renderer, paper-button.keyboard-focus.ytd-subscribe-button-renderer {"
, "   background-color: #e62117;"
, "   color:#fefefe;"
, "   height: 24px;"
, "   text-transform: none !important;"
, "   outline: 1px solid transparent;"
, "   border-radius: 2px;"
, "   box-shadow: 0 1px 0 rgb(0 0 0 / 15%);"
, "   border-color: #d3d3d3 !important;"
, " }"
, " tp-yt-paper-button.ytd-subscribe-button-renderer:hover {"
, "   background-image: linear-gradient(to top,#dc2f2c 0,#fa362a 100%);"
, "   box-shadow: inset 0 1px 0 rgb(0 0 0 / 20%);"
, " }"
, " tp-yt-paper-button.ytd-subscribe-button-renderer:active {"
, "   background-image: linear-gradient(to top,#b01d13 0,#c6282c 100%);"
, "   box-shadow: inset 0 1px 0 rgb(0 0 0 / 30%);"
, " }"
    , " tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed] {"
, "   background-image: linear-gradient(to top,#383838 0,#383838 100%);"
, "   box-shadow:none"
, " }"
, " html:not([dark]) tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed] {"
, "   background-image: linear-gradient(to top,#f6f6f6 0,#fcfcfc 100%);"
, "   border: 1px solid #ccc;"
, "   color: #999;"
, "   box-shadow:none"
, " }"
, " tp-yt-paper-button.ytd-subscribe-button-renderer:active {"
, "   background-color:#b31217"
, " }"
, " tp-yt-paper-button.ytd-subscribe-button-renderer:before {"
, "   content:' . ..,';"
, "   color:transparent;"
, "   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfl-Nn88d.png) -721px -88px;"
, "   position:relative;"
, "   right:7px;"
, "   width: 16px;"
, "   height: 12px;"
, " }"
    		/*unsubscribe*/
, " tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed], paper-button.ytd-subscribe-button-renderer[subscribed]:focus {"
, "   margin-right:0px;"
, " }"
, " tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:before {"
, "   background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfl-Nn88d.png) -898px -128px;"
, "   right:3px"
, " }"    
, " ytd-button-renderer.style-primary[is-paper-button] {"
, "   border-color: transparent!important;"    
, "   border: 1px solid #1b7fcc;"
, "   background: #1b7fcc;"
, "   color: #fff;"
, " }"
, " ytd-button-renderer.style-primary[is-paper-button]:hover {"
, "   background: #126db3;"
, " }"
, " ytd-button-renderer.style-primary[is-paper-button]:active {"
, "   background: #095b99;"
, "   box-shadow: inset 0 1px 0 rgb(0 0 0 / 50%);"
, " }"
, " ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer {"
, "   background-color:var(--yt-spec-badge-chip-background)!important;"
, "   border-color: transparent!important;"
, "   height: 24px;"
, "   font-size: 12px;"
, "   outline: 1px solid transparent;"
, "   border-radius: 2px;"
, "   box-shadow: 0 1px 0 rgb(0 0 0 / 5%);"
, "   text-transform: none!important;"    
, "   color:var(--yt-spec-text-secondary)!important;"
, " }"   
, " html:not([dark]) ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button.ytd-button-renderer {"
, "   background-color:#f8f8f8 ;"
, "   border-color: #d3d3d3!important;"
, "   height: 24px;"
, "   font-size: 12px;"
, "   outline: 1px solid transparent;"
, "   border-radius: 2px;"
, "   box-shadow: 0 1px 0 rgb(0 0 0 / 5%);"
, "   text-transform: none!important;"    
, "   color:var(--yt-spec-text-secondary)!important;"
, " }"   
    		/* like bar */
, " ytd-toggle-button-renderer.style-scope:nth-child(1) > a:nth-child(1) > yt-icon-button:nth-child(1) > button:nth-child(1) > yt-icon:nth-child(1) {"
, "		content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(1 -1)' viewBox='0 0 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23909090' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%23909090' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%23909090' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"
, " ytd-toggle-button-renderer.style-scope:nth-child(1) > a:nth-child(1) > yt-icon-button.style-default-active:nth-child(1) > button:nth-child(1) > yt-icon:nth-child(1) {"
, "		content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(1 -1)' viewBox='0 0 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%2320944B' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%2320944B' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%2320944B' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"

, " ytd-toggle-button-renderer.style-scope:nth-child(2) > a:nth-child(1) > yt-icon-button:nth-child(1) > button:nth-child(1) > yt-icon:nth-child(1) {"
, "		content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(-1 1)' viewBox='0 -150 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23909090' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%23909090' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%23909090' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"
, " ytd-toggle-button-renderer.style-scope:nth-child(2) > a:nth-child(1) > yt-icon-button.style-default-active:nth-child(1) > button:nth-child(1) > yt-icon:nth-child(1) {"
, "		content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(-1 1)' viewBox='0 -150 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23EE353E' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%23EE353E' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%23EE353E' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"
		/* ~--COMMENTS--~ */
, " ytd-comments#comments.style-scope.ytd-watch-flexy ytd-item-section-renderer#sections.style-scope.ytd-comments div#contents.style-scope.ytd-item-section-renderer ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer ytd-comment-renderer#comment.style-scope.ytd-comment-thread-renderer div#body.style-scope.ytd-comment-renderer div#main.style-scope.ytd-comment-renderer ytd-comment-action-buttons-renderer#action-buttons.style-scope.ytd-comment-renderer div#toolbar.style-scope.ytd-comment-action-buttons-renderer ytd-toggle-button-renderer#like-button.style-scope.ytd-comment-action-buttons-renderer.style-text.size-default a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-icon-button#button.style-scope.ytd-toggle-button-renderer.style-text.size-default button#button.style-scope.yt-icon-button yt-icon.style-scope.ytd-toggle-button-renderer { "
, "		content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(1 -1)' viewBox='0 0 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23909090' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%23909090' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%23909090' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"
, " ytd-comments#comments.style-scope.ytd-watch-flexy ytd-item-section-renderer#sections.style-scope.ytd-comments div#contents.style-scope.ytd-item-section-renderer ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer ytd-comment-renderer#comment.style-scope.ytd-comment-thread-renderer div#body.style-scope.ytd-comment-renderer div#main.style-scope.ytd-comment-renderer ytd-comment-action-buttons-renderer#action-buttons.style-scope.ytd-comment-renderer div#toolbar.style-scope.ytd-comment-action-buttons-renderer ytd-toggle-button-renderer#dislike-button.style-scope.ytd-comment-action-buttons-renderer.style-text.size-default a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-icon-button#button.style-scope.ytd-toggle-button-renderer.style-text.size-default button#button.style-scope.yt-icon-button yt-icon.style-scope.ytd-toggle-button-renderer {"
, "		content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(-1 1)' viewBox='0 -150 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23909090' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%23909090' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%23909090' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"
		/* like active */
, " ytd-comments#comments.style-scope.ytd-watch-flexy ytd-item-section-renderer#sections.style-scope.ytd-comments div#contents.style-scope.ytd-item-section-renderer ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer ytd-comment-renderer#comment.style-scope.ytd-comment-thread-renderer div#body.style-scope.ytd-comment-renderer div#main.style-scope.ytd-comment-renderer ytd-comment-action-buttons-renderer#action-buttons.style-scope.ytd-comment-renderer div#toolbar.style-scope.ytd-comment-action-buttons-renderer ytd-toggle-button-renderer#like-button.style-scope.ytd-comment-action-buttons-renderer.style-default-active.size-default a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-icon-button#button.style-scope.ytd-toggle-button-renderer.style-default-active.size-default button#button.style-scope.yt-icon-button yt-icon.style-scope.ytd-toggle-button-renderer { "
, "		 content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(1 -1)' viewBox='0 0 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%2320944B' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%2320944B' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%2320944B' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"
		/* dislike active */
, " ytd-comments#comments.style-scope.ytd-watch-flexy ytd-item-section-renderer#sections.style-scope.ytd-comments div#contents.style-scope.ytd-item-section-renderer ytd-comment-thread-renderer.style-scope.ytd-item-section-renderer ytd-comment-renderer#comment.style-scope.ytd-comment-thread-renderer div#body.style-scope.ytd-comment-renderer div#main.style-scope.ytd-comment-renderer ytd-comment-action-buttons-renderer#action-buttons.style-scope.ytd-comment-renderer div#toolbar.style-scope.ytd-comment-action-buttons-renderer ytd-toggle-button-renderer#dislike-button.style-scope.ytd-comment-action-buttons-renderer.style-default-active.size-default a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer yt-icon-button#button.style-scope.ytd-toggle-button-renderer.style-default-active.size-default button#button.style-scope.yt-icon-button yt-icon.style-scope.ytd-toggle-button-renderer {"
, "		content: url('data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' transform='scale(-1 1)' viewBox='0 -150 1500 1500' height='24px' width='24px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23EE353E' id='path6' d='M 965 1326 c-57 -57 -160 -142 -275 -226 -102 -73 -203 -149 -226 -167 -23 -18 -46 -33 -53 -33 -8 0 -11 -92 -11 -345 0 -269 3 -345 13 -345 6 0 175 -45 374 -102 200 -56 364 -100 366 -97 2 2 52 177 111 389 59 212 109 392 112 401 4 13 -35 27 -223 80 -125 35 -221 65 -213 67 22 5 119 122 149 178 20 39 25 64 25 124 1 127 -12 173 -49 168 -5 0 -51 -42 -100 -92 z' /%3E%3Cpath style='fill:%23EE353E' id='path8' d='M30 550 l0 -370 130 0 130 0 0 370 0 370 -130 0 -130 0 0 -370z' /%3E%3Cpath style='fill:%23EE353E' id='path10' d='' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A') !important;"
, " }"
		/* old Meh face for player error */
, " yt-icon.yt-player-error-message-renderer {"
, "   --iron-icon-fill-color: #ffe0;"
, "   -ms-flex: var(--layout-flex-none_-_-ms-flex);"
, "   -webkit-flex: var(--layout-flex-none_-_-webkit-flex);"
, "   flex: var(--layout-flex-none_-_flex);"
, "   height: 100px;"
, "   width: 150px;"
, "   background-size: 140px, 50px;"
, "   background-repeat: no-repeat;"
, "   background-image: url(https://s.ytimg.com/yts/img/meh7-vflGevej7.png);"
, "   fill: transparent;"
, " }"
, " div#reason.style-scope.yt-player-error-message-renderer { "
, "   font-size: 25px;"
, "   text-shadow: 1px 1px 3px #7b7b7b;"
, " }"
, " #reason.yt-player-error-message-renderer::after{"
, "   font-size: 25px;"
, "   text-shadow: 1px 1px 3px #7b7b7b;"
, " }"
, " yt-playability-error-supported-renderers {"
, "   display: block;"
, "   background: linear-gradient(#383838, #141518)!important;"
, "   -ms-flex: var(--layout-flex_-_-ms-flex)!important;"
, "   -webkit-flex: var(--layout-flex_-_-webkit-flex)!important;"
, "   flex: var(--layout-flex_-_flex)!important;"
, "   -webkit-flex-basis: var(--layout-flex_-_-webkit-flex-basis)!important;"
, "   flex-basis: var(--layout-flex_-_flex-basis)!important;"
, "   -ms-flex-direction: var(--layout-vertical_-_-ms-flex-direction)!important;"
, "   -webkit-flex-direction: var(--layout-vertical_-_-webkit-flex-direction)!important;"
, "   flex-direction: var(--layout-vertical_-_flex-direction)!important;"
, " }"
, " * {"
, "   text-transform:none;"
, " }"
, " ytd-search-filter-renderer.ytd-search-filter-group-renderer {"
, "   padding-top:0;"
, " }"
, " ytd-search-filter-renderer yt-formatted-string.ytd-search-filter-renderer {"
, "   font-size:12px;"
, "   height:21px;"
, "   color:#333"
, " }"
, " ytd-search-filter-renderer yt-formatted-string.ytd-search-filter-renderer:hover {"
, "   color:#167ac6"
, " }"
, " #filter-group-name.ytd-search-filter-group-renderer {"
, "   padding-bottom:0;"
, "   border-bottom:none"
, " }"
, " yt-img-shadow.ytd-video-renderer {"
, "   display:none"
, " }"
  ].join("\n");
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(css);
  }
  else if (typeof PRO_addStyle != "undefined") {
    PRO_addStyle(css);
  }
  else if (typeof addStyle != "undefined") {
    addStyle(css);
  }
  else {
    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
      heads[0].appendChild(node);
    }
    else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }
})()
window.onload = () => {
  document.querySelectorAll("#masthead-ad").forEach((el) => el.remove());
  document.body.addEventListener("yt-navigate-finish", function (event) {
    if (document.getElementsByTagName("ytd-miniplayer").length) {
      document
        .querySelector("ytd-miniplayer")
        .parentNode.removeChild(document.querySelector("ytd-miniplayer"));
    }
    if (document.getElementsByClassName("ytp-miniplayer-button").length) {
      document
        .querySelector(".ytp-miniplayer-button")
        .parentNode.removeChild(
          document.querySelector(".ytp-miniplayer-button")
        );
    }
    if (window.location.pathname != "/watch") {
      let mp = document.querySelector("#movie_player video") !== null;
      if (mp) {
        document
          .querySelector("#movie_player video")
          .parentNode.removeChild(
            document.querySelector("#movie_player video")
          );
      }
      else {}
    }
  });
};

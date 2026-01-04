// ==UserScript==
// @name         Add YouTube Video Progress
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.18.108
// @license      GNU AGPLv3
// @author       jcunews
// @description  Adds a progress bars (or dots) at bottom of video, a progress text which includes video quality and subtitle indicators, and a chapter title box on the YouTube video page.
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @inject-into  page
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/453523/Add%20YouTube%20Video%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/453523/Add%20YouTube%20Video%20Progress.meta.js
// ==/UserScript==

/*
Changelog (this version only. Full list is greasyfork.org):
- Fixed progress percentage text which may only show 99% at end of video

Notes:
- On the progress text, the current video quality will have a "+" suffix if there's a higher one available.
- Hovering the mouse cursor onto the video quality text will show the current and available video quality IDs and short description.
- A "[C]" text may be shown to indicate subtitle availability, and hovering the mouse over it will show the available subtitle languages.
- For videos which have 60fps and/or HDR video qualities, the listed available video qualities only includes the highest quality ones.
  The video player may present a lower video quality depending on the network speed, web browser capability, and user account setting.
- Hovering the chapter box will display the previous and/or next chapter titles.
- Hovering the mouse over the publication date will show a tooltip containing the complete publication date in local time, considering
  that YouTube may only shows how long the video was published. If the video was live streamed, it will contain the starting and
  ending recording time.
- For new YouTube layout only.
- TamperMonkey users should change the TamperMonkey's "Inject Mode" setting to "Instant" for more reliable script result.
*/

(window => {

//===== CONFIGURATION BEGIN =====

//*** Default settings (configurable via GUI) ***
var progressbarAutohide     = true; //autohide progressbar when YouTube video controls is visible
var progressbarBelowVideo   = false; //show progressbar below video frame instead of within video frame
var progressbarDotStyle     = false; //show graphical progress as dots instead of bars
var progressbarHeight       = 3; //in pixels
var progressbarColor        = "rgb(0,0,0,0.2)"; //e.g. opaque: "#fff" or "#e0e0e0" or "cyan"; or semi-transparent: "rgb(0,0,0,0.3)" (i.e. 30% opaque)
var progressbarElapsedColor = "rgb(255,0,0,0.7)";
var progressbarBufferColor  = "rgb(51,119,255,0.7)";
var progressbarDotStyleSize = 4; //Dot size (for width & height) in pixels if dot style is enabled
var progressTextEnabled     = true;  //enable showing progress text including chapter title
var progressTextInDocTitle  = false; //also include progress text in document (browser tab) title
var subtitleLanguageCode    = "en"; //2-letters language code for select preferred subtitle language hotkey

//*** Internal settings (not configurable via GUI) ***
var contentLoadProcessDelay = 0; //number of milliseconds before processing dynamically loaded contents (increase if slow network/browser)
var progressTextStyles      = "display:inline-block;vertical-align:top;border:1px solid #ccc;border-radius:4px;padding:2px;background:#eee;text-align:center;white-space:nowrap;font-size:9pt;line-height:normal";
//styles override for progress text in YouTube Dark Mode
var progressTextStylesDark  = "border:1px solid #bbb;background:#111;color:#bbb";
//style rules override for configuration GUI in YouTube Dark Mode
var configGuiStylesDark     = `
#ayvpPopup{border-color:#bbb;background:#111;color:#bbb}
#ayvpCaption{background:#333;color:#ddd;font-weight:bold}
#ayvpContent input,
#ayvpControls button{background:#333;color:#bbb}
`;
//swap functionality of Click and Ctrl+Click on subtitle indicator
//false: Click = use preferred subtitle; Ctrl+Click = toggle subtitle
//true : Click = toggle subtitle; Ctrl+Click = use preferred subtitle
var swapSubtitleFunction    = true;

//===== CONFIGURATION END =====

var timerWaitInfo, timerProgressMonitor, timerWaitPlayer, timerDoubleCheck, vplayer, eleProgressText, eleChapter, fmtMaps = {};
var resNums = {
  "light"  :  "144p", //(old ID)
  "tiny"   :  "144p",
  "small"  :  "240p",
  "medium" :  "360p", //nHD
  "large"  :  "480p", //WNTSC
  "hd720"  :  "720p", //HD 1K
  "hd1080" : "1080p", //FHD 2K
  "hd1440" : "1440p", //QHD
  "hd2160" : "2160p", //UHD 4K
  "hd2880" : "2880p", //UHD+ 5K
  "highres": "4320p", //FUHD 8K (YouTube's highest resolution [2019 April])
  "hd6480" : "6480p", //(fictional ID for 12K. Just in case...)
  "hd8640" : "8640p"  //(fictional ID for QUHD 16K. Just in case...)
};
var resDescs = {
  "light"  : "light\xa0(144p\xa0~QCIF)", //(old ID)
  "tiny"   : "tiny\xa0(144p\xa0~QCIF)",
  "small"  : "small\xa0(240p\xa0~SIF)",
  "medium" : "medium\xa0(360p\xa0nHD)",
  "large"  : "large\xa0(480p\xa0WNTSC)",
  "hd720"  : "hd720\xa0(720p\xa0HD\xa01K)",
  "hd1080" : "hd1080\xa0(1080p\xa0FHD\xa02K)",
  "hd1440" : "hd1440\xa0(1440p\xa0QHD)",
  "hd2160" : "hd2160\xa0(2160p\xa0UHD\xa04K)",
  "hd2880" : "hd2880\xa0(2880p\xa0UHD+\xa05K)",
  "highres": "highres\xa0(4320p\xa0FUHD 8K)", //YouTube's highest resolution [2019 April]
  "hd6480" : "hd6480\xa0(6480p\xa012K)",      //fictional ID for 12K. Just in case...
  "hd8640" : "hd8640\xa0(8640p\xa0QUHD\xa016K)"  //fictional ID for QUHD 16K. Just in case...
};
var fmts = [
  ['3GP',  'MP4V',   [13,17,36]],
  ['FLV',  'H263',   [5,6]],
  ['FLV',  'H264',   [34,35]],
  ['MP4',  'H264',   [18,22,37,38,59,78,82,83,84,85,91,92,93,94,95,96,132,133,134,135,136,137,138,151,160,212,264,266,298,299]],
  ['WebM', 'VP8',    [43,44,45,46,100,101,102,167,168,169,170,218,219]],
  ['WebM', 'VP9',    [242,243,244,245,246,247,248,271,272,278,302,303,308,313,315]],
  ['WebM', 'VP9.2',  [330,331,332,333,334,335,336,337,338,339]], //HDR. 388 & 339 for 2880p & 4320p are assumed. may actually be incorrect.
  ['M4A',  'AAC',    [139,140,141,256,258]],
  ['M4A',  'DTS-ES', [325]],
  ['M4A',  'AC-3',   [328]],
  ['WebM', 'Vorbis', [171,172]],
  ['WebM', 'Opus',   [249,250,251]]
];
fmts.forEach(a => a[2].forEach(f => fmtMaps[f] = [a[0], a[1]]));

var langList = ("\
Afrikaans,af;Albanian,sq;Amharic,am;Arabic,ar;Armenian,hy;Azerbaijani,az;Bangla,bn;Basque,eu;Belarusian,be;Bosnian,bs;\
Bulgarian,bg;Burmese,my;Catalan,ca;Cebuano,ceb;Chinese (Simplified),zh-Hans;Chinese (Traditional),zh-Hant;Corsican,co;\
Croatian,hr;Czech,cs;Danish,da;Dutch,nl;English,en;Esperanto,eo;Estonian,et;Filipino,fil;Finnish,fi;French,fr;Galician,gl;\
Georgian,ka;German,de;Greek,el;Gujarati,gu;Haitian Creole,ht;Hausa,ha;Hawaiian,haw;Hebrew,iw;Hindi,hi;Hmong,hmn;Hungarian,hu;\
Icelandic,is;Igbo,ig;Indonesian,id;Irish,ga;Italian,it;Japanese,ja;Javanese,jv;Kannada,kn;Kazakh,kk;Khmer,km;Kinyarwanda,rw;\
Korean,ko;Kurdish,ku;Kyrgyz,ky;Lao,lo;Latin,la;Latvian,lv;Lithuanian,lt;Luxembourgish,lb;Macedonian,mk;Malagasy,mg;Malay,ms;\
Malayalam,ml;Maltese,mt;Maori,mi;Marathi,mr;Mongolian,mn;Nepali,ne;Norwegian,no;Nyanja,ny;Odia,or;Pashto,ps;Persian,fa;\
Polish,pl;Portuguese,pt;Punjabi,pa;Romanian,ro;Russian,ru;Samoan,sm;Scottish Gaelic,gd;Serbian,sr;Shona,sn;Sindhi,sd;\
Sinhala,si;Slovak,sk;Slovenian,sl;Somali,so;Southern Sotho,st;Spanish,es;Sundanese,su;Swahili,sw;Swedish,sv;Tajik,tg;\
Tamil,ta;Tatar,tt;Telugu,te;Thai,th;Turkish,tr;Turkmen,tk;Ukrainian,uk;Urdu,ur;Uyghur,ug;Uzbek,uz;Vietnamese,vi;Welsh,cy;\
Western Frisian,fy;Xhosa,xh;Yiddish,yi;Yoruba,yo;Zulu,zu").split(";").map(a => a.split(","));

function loadConfig(r, d, z) {
  d = {
    id: "ayvp", ver: 1, pbAutohide: progressbarAutohide, pbPosBelow: progressbarBelowVideo, pbDotStyle: progressbarDotStyle, pbHeight: progressbarHeight,
    pbColor: progressbarColor, pbElapsedColor: progressbarElapsedColor, pbBufferColor: progressbarBufferColor,
    pbDotStyleSize: progressbarDotStyleSize, ptEnabled: progressTextEnabled, ptDocTitle: progressTextInDocTitle, subLangCode: subtitleLanguageCode
  };
  r = GM_getValue("cfg", "");
  if (r) {
    try {
      r = JSON.parse(r);
    } catch(z) {
      r = {};
    }
    if (r.id === "ayvp") {
      Object.keys(d).forEach(k => {
        if (!(k in r)) r[k] = d[k];
      });
    } else {
      GM_setValue("cfg", JSON.stringify(d));
      alert("YouTube Video Progressbar configuration has been reset to default due to data corruption.");
    }
  } else {
    GM_setValue("cfg", JSON.stringify(r = d));
  }
  return r;
}

var cfg = loadConfig();

function updProgressTextPos(a) {
  window["info-text"].classList.remove("floatingProgress");
  if (eleProgressText.offsetTop) window["info-text"].classList.add("floatingProgress");
}

var ytpr, ql, resDescs2, orgTitle, chaps;

function getPlayer() {
  if (ytpr && window.movie_player) {
    return vplayer = window.movie_player;
  } else return (vplayer = document.querySelector(".html5-video-player"));
}

function selectCaption(ev, v, o, c, a) {
  if ((v = getPlayer()) && (o = v.getPlayerResponse().captions) && (o = o.playerCaptionsTracklistRenderer) && (o = o.captionTracks)) {
    if (ev && (ev.ctrlKey == swapSubtitleFunction)) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      v.toggleSubtitles();
      return;
    }
    if ((c = v.getOption("captions", "track")) && c.vss_id) {
      if (c.vss_id === ("." + cfg.subLangCode)) {
        a = o.find(ct => ct.vssId === ("a." + cfg.subLangCode));
        if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[0] === ".") && (ct.vssId.substr(1) !== cfg.subLangCode));
        if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== cfg.subLangCode));
      }
      if (!a && (c.vss_id === ("a." + cfg.subLangCode))) {
        a = o.find(ct => ct.isTranslatable && (ct.vssId[0] === ".") && (ct.vssId.substr(1) !== cfg.subLangCode));
        if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== cfg.subLangCode));
      }
      if (!a && c.is_translateable && (c.vss_id[0] === ".") && (c.vss_id.substr(1) !== cfg.subLangCode)) {
        a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== cfg.subLangCode));
      }
    }
    if (!a) {
      a = o.find(ct => ct.vssId === ("." + cfg.subLangCode));
      if (!a) a = o.find(ct => ct.vssId === ("a." + cfg.subLangCode));
      if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[0] === ".") && (ct.vssId.substr(1) !== cfg.subLangCode));
      if (!a) a = o.find(ct => ct.isTranslatable && (ct.vssId[1] === ".") && (ct.vssId.substr(2) !== cfg.subLangCode));
      if (!a) {
        a = o.find(ct => ct.isTranslatable && (
          ((ct.vssId[0] === ".") && (ct.vssId.substr(1) !== cfg.subLangCode)) ||
          ((ct.vssId[1] === ".") && (ct.vssId.substr(2) !== cfg.subLangCode))
        ));
      }
      if (!a) return;
    }
    a = {languageCode: a.languageCode, vss_id: a.vssId};
    if (a.languageCode !== cfg.subLangCode) {
      v.getPlayerResponse().captions.playerCaptionsTracklistRenderer.translationLanguages.some(l => {
        if (l.languageCode === cfg.subLangCode) {
          a.translationLanguage = {languageCode: cfg.subLangCode};
          a.translationLanguage.languageName = l.languageName.simpleText;
          return true;
        }
      });
    }
    if (!c.languageCode) v.toggleSubtitles();
    v.setOption("captions", "track", a);
  }
}

function processInfo(ev) {
  ql = null;
  if (window.vidprogress || !/^\/watch|\/shorts\//.test(location.pathname)) return;
  clearTimeout(timerWaitInfo);
  if (!eleProgressText) {
    eleProgressText = document.createElement("DIV");
    eleProgressText.id = "vidprogress";
    eleProgressText.style.cssText = `display:${cfg.ptEnabled ? "inline-block" : "none"}!important`;
    eleProgressText.innerHTML = `<span id="curq" style="font-weight:500"></span>
<span id="subs" style="display:none"></span><span id="curtime" style="display:inline-block;margin-left:1ex"></span>
<style>
#player{z-index:1}
.html5-video-player{overflow:visible}
video[style*="top: -"]{top:-9999px!important}
ytd-watch-metadata #snippet{max-height:4rem!important}
ytd-watch-metadata #plain-snippet-text{display:none}
ytd-watch-metadata #snippet-text>yt-formatted-string,
ytd-watch-metadata #snippet-text>yt-formatted-string>.yt-formatted-string.style-scope:nth-child(5){display:block!important}
ytd-watch-metadata #description-inline-expander>yt-formatted-string>.yt-formatted-string.style-scope:nth-child(5){display:block!important}
#info :is(ytd-toggle-button-renderer,ytd-button-renderer):not(:first-child),
yt-icon-button:is(.ytd-toggle-button-renderer,.ytd-button-renderer):not(:first-child){margin-left:8px}
#info ytd-toggle-button-renderer, #info ytd-button-renderer{font-size:9pt!important}
#info ytd-toggle-button-renderer a.ytd-toggle-button-renderer,
#info ytd-button-renderer a.ytd-button-renderer,
ytd-button-renderer.force-icon-button a.ytd-button-renderer,
ytd-button-renderer.force-icon-button a.ytd-button-renderer{padding-right:0}
#menu-container{white-space:nowrap}
#menu-container>#menu{display:inline-block}
#description-and-actions #description,
#description-and-actions #actions{min-width:0!important}
#description-and-actions #actions{flex-grow:unset}
#info yt-icon-button.ytd-toggle-button-renderer,
#info yt-icon-button.ytd-button-renderer,
:is(#description-and-actions,#actions) yt-icon-button:is(.ytd-toggle-button-renderer,.ytd-button-renderer){
  width:calc(var(--yt-button-icon-size,var(--yt-icon-width,40px)) - 10px)!important;
  height:calc(var(--yt-button-icon-size,var(--yt-icon-height,40px)) - 10px)!important;
  padding:0 4px 0 0!important;
}
#description-and-actions .ytd-menu-renderer[style-target="button"]{width:calc(var(--yt-icon-width) - 14px);height:calc(var(--yt-icon-height) - 14px)}
#actions ytd-toggle-button-renderer.force-icon-button a.ytd-toggle-button-renderer,
#actions ytd-button-renderer.force-icon-button a.ytd-button-renderer{padding-right:0}
#actions yt-icon-button.ytd-toggle-button-renderer,
#actions yt-icon-button.ytd-button-renderer{padding:8px 0;width:24px}
#vidprogress{${progressTextStyles};margin-left:10px;margin-right:1em;min-width:27ex;max-height:1.2em}
#menu-container #vidprogress{margin-top:.6em}
ytd-watch-metadata #vidprogress{position:absolute;z-index:1;margin-top:1em;margin-left:23em}
#description-and-actions #vidprogress{position:static;margin-left:0;margin-top:.9em}
html[dark] #vidprogress{${progressTextStylesDark}}
#info-text{position:relative;margin-top:1rem}
#info-text.floatingProgress{overflow:visible!important}
#info-text.floatingProgress>#vidprogress{position:absolute;right:0;bottom:1.7rem}
#vidprogress #subs{cursor:pointer}
#vidchap{position:relative}
#chapwrap{
  ${progressTextStyles};display:none;position:absolute;right:0;border:none;margin-left:0;
  padding:0;height:valv(1.2em + 6px);background:transparent;overflow:hidden;
}
#chap{
  ${progressTextStyles};position:relative;margin-left:0;margin-top:.4em;border:none;padding:0;transition:margin-top 200ms linear;
}
#chapprogresswrap{position:absolute;z-index:0;left:1px;top:1px;width:calc(100% - 2px);height:calc(100% - 2px)}
#chapprogress{
  ${progressTextStyles};display:block;margin-left:0;border:none;border-radius:0;padding:0;
  width:33%;height:100%;background:rgb(0,192,0,0.3);pointer-events:none;
}
#chaptext{${progressTextStyles};position:relative;z-index:1;margin-left:0;background:transparent}
html[dark] #chap{${progressTextStylesDark};border:none}
#chap.chide{margin-top:-2em}
</style>`;
  }
  (function waitInfo(a, b, c, d) {
    a = (a = document.querySelector("ytd-watch-metadata")) && (getComputedStyle(a).display !== "none") ?
      "ytd-watch-metadata #description-content,ytd-watch-metadata #actions" : "#info-text #date,#menu-container #menu";
    if (b = document.querySelector(a)) {
      if (
        b.matches("ytd-watch-metadata #description") && (c = b.querySelector("#plain-snippet-text")) && !c.tcf && c.firstChild &&
        (d = c.firstChild.data.match(/(^.*?\u2022.*?\u2022\s+)(.*)/))
      ) {
        c.firstChild.data = `${d[1]}\n${d[2]}`;
        c.tcf = true;
      }
      b.parentNode.insertBefore(eleProgressText, b);
      subs.addEventListener("click", selectCaption);
      addEventListener("resize", updProgressTextPos);
      addEventListener("yt-navigate-finish", updProgressTextPos);
      updProgressTextPos();
      eleChapter = document.createElement("DIV");
      eleChapter.id = "vidchap";
      eleChapter.innerHTML = `<div id="chapwrap" style="display:${cfg.ptEnabled ? "block" : "none"}"><div id="chap" class="chide">
<div id="chapprogresswrap"><div id="chapprogress"></div></div><div id="chaptext"></div>
</div></div>`;
      (b = document.querySelector("#primary #player")).parentNode.insertBefore(eleChapter, b.nextSibling);
      setTimeout(updProgressTextPos, 0);
    } else timerWaitInfo = setTimeout(waitInfo, 200);
  })();
}

function processPlayer(ev) {
  function zerolead(n){
    return n > 9 ? n : "0" + n;
  }

  function sec2hms(sec) {
   var c = sec % 60, d = Math.floor(sec / 60);
   return (d >= 60 ? zerolead(Math.floor(d / 60)) + ":" : "") + zerolead(d % 60) + ":" + zerolead(c);
  }

  function dateElapsed(c, t, r, a, b) {
    r = Math.floor((((t = new Date).getFullYear() * 12 + t.getMonth()) - (c.getFullYear() * 12 + c.getMonth())) / 12);
    if (!r) {
      r = Math.floor(t.getTime() / 86400000) - Math.floor(c.getTime() / 86400000);
      if (!(b = Math.floor(r / 30))) {
        if (!r) {
          return "today"
        } else if (b = Math.floor(r / 7)) {
          return b > 1 ? b + " weeks ago" : "a week ago"
        } else return r > 1 ? r + " days ago" : "a day ago"
      } else return b > 1 ? b + " months ago" : "a month ago"
    } else return r > 1 ? r + " years ago" : "a year ago"
  }

  function updProgress(a, b, c, d, e, f, g, h, l){
    a = getPlayer();
    if (a && window.vidprogress2b && a.getCurrentTime) try {
      if (window.curtime) try {
        b = a.getPlaybackQuality();
        if (!ql) {
          if (window["page-manager"] && (c = window["page-manager"].getCurrentData()) &&
            (d = c.playerResponse) && (!ytpr || (d.trackingParams !== ytpr.trackingParams))) {
            orgTitle = document.title;
            ytpr = (
              c.player && c.player.args && (
                (c.player.args.player_response && JSON.parse_(c.player.args.player_response)) || c.player.args.raw_player_response
              )
            ) || d;
            if (window.date) window.date.title = "";
            chaps = [];
            chaps.last = 0;
            chapwrap.style.display = "";
            chap.className = "chide"
            if (ytpr && ytpr.videoDetails && ytpr.videoDetails.shortDescription) {
              if (h = ytpr.videoDetails.shortDescription.match(/^(?:\s*\d+\.)?\s*(\d{1,2}:)?\d{1,2}:\d{1,2}\s+\S+.*/gm)) {
                chaps = h.map(s => {
                  s = s.match(/^(?:\s*\d+\.)?\s*(\d{1,2}:)?(\d{1,2}):(\d{1,2})\s+(?:(?:-|\u2013|\u2014|\u2015)\s+)?(.*?)\s*$/u);
                  s[1] = s[1] ? parseInt(s[1]) : 0;
                  s[2] = s[2] ? parseInt(s[2]) : 0;
                  s[3] = s[3] ? parseInt(s[3]) : 0;
                  return {time: (s[1] * 3600) + (s[2] * 60) + s[3], txt: s[4]}
                });
                chaps.some((o, i) => {
                  if ((i > 0) && (o.time < chaps[i - 1].time)) {
                    chaps.splice(i);
                    return true
                  }
                });
              }
            }
            if (!chaps.length) {
              if (
                (h = c) && (h = h.response) && (h = h.playerOverlays) && (h = h.playerOverlayRenderer) && (h = h.decoratedPlayerBarRenderer) &&
                (h = h.decoratedPlayerBarRenderer) && (h = h.playerBar) && (h = h.multiMarkersPlayerBarRenderer) && (h = h.markersMap)
              ) {
                h.some(m => {
                  if (m.key === "AUTO_CHAPTERS") {
                    if ((m = m.value) && (m = m.chapters) && m.length && m[0] && m[0].chapterRenderer && m[0].chapterRenderer) {
                      chaps = m.map(a => ({time: Math.floor(a.chapterRenderer.timeRangeStartMillis / 1000), txt: a.chapterRenderer.title.simpleText}))
                    }
                    return true
                  }
                })
              }
            }
            if (chaps.length && chaps[0].time) chaps.unshift({time: 0, txt: "(Untitled)"});
          }
          if (ytpr) {
            if ((h = document.querySelector("#info-strings>yt-formatted-string")) && !h.title && d && (e = d.microformat) && (e = e.playerMicroformatRenderer)) {
              if ((f = e.liveBroadcastDetails) && f.startTimestamp) {
                g = "Started: " + (c = new Date(f.startTimestamp)).toLocaleString() + " (" + dateElapsed(c) + ")";
                if (f.endTimestamp) g += ";   Ended: " + new Date(f.endTimestamp).toLocaleString();
              } else g = "";
              if (!g) {
                g = ((c = new Date(e.publishDate || e.uploadDate)).toLocaleDateString());
                if (!h.textContent.includes("ago")) g += " (" + dateElapsed(c) + ")";
              }
              h.title = g;
            }
            if (ytpr.streamingData.adaptiveFormats) {
              ql = {};
              resDescs2 = {};
              ytpr.streamingData.adaptiveFormats.forEach((o, i) => {
                if (!o.audioQuality) ql[o.quality] = [o.quality, o.qualityLabel, o.bitrate];
              });
              Object.keys(ql).forEach(k => {
                resDescs2[k] = resDescs[k].replace("(" + resNums[k], "(" + (ql[k] = (ql[k][1] || ql[k][0])));
              });
            }
          }
        }
        if (ql) {
          c = ql[b] || b;
        } else c = resNums[b] || b;
        (d = a.getAvailableQualityLevels()).pop();
        curq.textContent = c + (d.indexOf(b) > 0 ? "+" : "");
        e = a.getVideoStats();
        g = fmtMaps[e.afmt] || ("a" + e.afmt);
        if (e.fmt) { //has video
          if (f = fmtMaps[e.fmt]) {
            f = `${f[0]} ${f[1]}`;
          } else f = "vid" + e.fmt;
          if (e.afmt) { //video & audio
            if (g = fmtMaps[e.afmt]) {
              e = ` [${f} ${g[1]}]`;
            } else e = ` [${f} aud${e.afmt}]`;
          } else { //no audio. video only
            e = ` [${f}]`;
          }
        } else if (e.afmt) { //no video. audio only
          if (f = fmtMaps[e.afmt]) {
            e = ` [${f[0]} ${f[1]}]`;
          } else e = ` [aud${e.afmt}]`;
        } else e = "";
        if (ql) {
          curq.title = `Current: ${resDescs2[b] || b}${e} (${a.offsetWidth}x${a.offsetHeight} viewport)\nAvailable: ${d.map(b => resDescs2[b] || b).join(", ")}`;
        } else curq.title = `Current: ${resDescs[b] || b}${e} (${a.offsetWidth}x${a.offsetHeight} viewport)\nAvailable: ${d.map(b => resDescs[b] || b).join(", ")}`;
      } catch(b) {
        curq.textContent = "???";
        curq.title = b.message;
      }
      if (window.subs) {
        if (ytpr && ytpr.captions && ytpr.captions.playerCaptionsTracklistRenderer && ytpr.captions.playerCaptionsTracklistRenderer.captionTracks) {
          b = (d = ytpr.captions.playerCaptionsTracklistRenderer.captionTracks).map(v => v.name.simpleText);
          if (b.length) {
            c = a.getOption("captions", "track");
            b = [
              c.vss_id &&
                (c.vss_id.substr(0, 2) === "a.") ? "[c]" : ((d.length === 1) && (d[0].vssId[1] === ".") ? "[c]" : "[C]"),
              `Current subtitle: ${
                c && c.languageCode ?
                  c.languageName + (c.translationLanguage && c.translationLanguage.languageName ? " >> " + c.translationLanguage.languageName : "") :
                  "(none)"
              }\nAvailable subtitles: ${b.join(", ")}\nClick: Toggle subtitle\nCtrl+Click: Show preferred subtitle language`,
              `display:inline-block${c && c.languageCode ? ";font-weight:bold" : ""}`
            ];
          } else b = ["", "", ""];
        } else b = ["", "", ""];
        subs.textContent = b[0];
        subs.title = b[1];
        subs.style.cssText = b[2];
      }
      b = a.getCurrentTime();
      if (b >= 0) {
        l = a.getDuration();
        if (!a.getVideoData().isLive) {
          if (window.curtime) {
            curtime.textContent = sec2hms(Math.floor(b)) + " / " + sec2hms(Math.floor(l)) + " (" + Math.floor(parseFloat((b * 100 / l).toFixed(3))) + "%)";
            if (chaps.length) {
              chaps.some((c, i, d) => {
                if ((b >= c.time) && (((i + 1) === chaps.length) || (b < chaps[i + 1].time))) {
                  d = (i < (chaps.length - 1) ? chaps[i + 1].time : l) - c.time;
                  chapprogress.style.width = Math.floor((b - c.time) * 100 / d) + "%";
                  if (i !== chaps.last) {
                    function doshow(d) {
                      chap.ontransitionend = null;
                      chaptext.textContent = c.txt;
                      chap.title = (i ? `Previous: ${chaps[i - 1].txt}` : "") + ((i + 1) < chaps.length ? (i ? "\n" : "") + `Next: ${chaps[i + 1].txt}` : "");
                      chapwrap.style.display = "block";
                      chap.className = "";
                    }
                    chaps.last = i;
                    if (chap.className) {
                      doshow();
                    } else {
                      chap.ontransitionend = doshow;
                      chap.className = "chide";
                    }
                    return true;
                  }
                }
              });
            } else {
              chapwrap.style.display = "";
              chap.ontransitionend = null;
              chap.className = "chide"
            }
          }
          if (cfg.pbDotStyle) {
            vidprogress2b.style.left = Math.ceil((b / l) * vidprogress2.offsetWidth) + "px";
            vidprogress2c.style.left = Math.ceil((a.getVideoBytesLoaded() / a.getVideoBytesTotal()) * vidprogress2.offsetWidth) + "px";
          } else {
            vidprogress2b.style.width = Math.ceil((b / l) * vidprogress2.offsetWidth) + "px";
            vidprogress2c.style.width = Math.ceil((a.getVideoBytesLoaded() / a.getVideoBytesTotal()) * vidprogress2.offsetWidth) + "px";
          }
        } else {
          if (window.curtime) curtime.textContent = "LIVE";
          if (cfg.pbDotStyle) {
            vidprogress2b.style.left = "100%";
          } else vidprogress2b.style.width = "100%";
        }
      } else throw 0;
      vidprogress2.style.display = cfg.pbAutohide && !a.classList.contains("ytp-autohide") ? "none" : "";
      vidprogress2.style.transform = cfg.pbPosBelow && !document.querySelector("ytd-watch-flexy").attributes.fullscreen ? "translateY(100%)" : "";
      if (cfg.ptDocTitle) document.title = `${curq.textContent}${subs.textContent ? " " + subs.textContent : ""} ${curtime.textContent} ${orgTitle}`;
    } catch(a) {
      if (window.curtime) {
        if (cfg.ptDocTitle) document.title = "??? " + orgTitle;
        curtime.textContent = "???";
      }
      if (cfg.pbDotStyle) {
        vidprogress2b.style.left = "0px";
        vidprogress2c.style.left = "0px";
      } else {
        vidprogress2b.style.width = "0px";
        vidprogress2c.style.width = "0px";
      }
      if (window.chapwrap) {
        chapwrap.style.display = "";
        chap.ontransitionend = null;
        chap.className = "chide"
      }
    }
  }

  function resumeProgressMonitor() {
    if (timerProgressMonitor) return;
    updProgress();
    timerProgressMonitor = setInterval(updProgress, 200);
  }

  function pauseProgressMonitor() {
    clearInterval(timerProgressMonitor);
    timerProgressMonitor = 0;
    updProgress();
  }

  clearInterval(timerProgressMonitor);
  timerProgressMonitor = 0;
  clearTimeout(timerWaitPlayer);
  timerWaitPlayer = 0;
  clearInterval(timerDoubleCheck);
  timerDoubleCheck = 0;
  (function waitPlayer(v) {
    if (!window.vidprogress2 && getPlayer() && (vplayer.id !== "c4-player") && (a = vplayer.parentNode.querySelector("video"))) {
      b = document.createElement("DIV");
      b.id = "vidprogress2";
      b.style.cssText = `position:absolute;z-index:10;bottom:0;width:100%;height:${
cfg.pbDotStyle ? cfg.pbDotStyleSize : cfg.pbHeight}px;background:${cfg.pbColor}`;
      v = cfg.pbDotStyle ? "width:" + cfg.pbDotStyleSize + "px;margin-left:-" + Math.floor(cfg.pbDotStyleSize / 2) + "px;" : "";
      b.innerHTML = `<div id="vidprogress2c" style="position:absolute;${v}height:100%;background:${cfg.pbBufferColor}"></div>
<div id="vidprogress2b" style="position:absolute;${v}height:100%;background:${cfg.pbElapsedColor}"></div>`;
      vplayer.appendChild(b);
      if (vplayer.getPlayerState() === 1) resumeProgressMonitor();
      //useful: onLoadedMetadata(), onStateChange(state), onPlayVideo(info), onReady(playerApi), onVideoAreaChange(), onVideoDataChange(info)
      //states: -1=notReady, 0=ended, 1=playing, 2=paused, 3=ready, 4=???, 5=notAvailable?
      (v = vplayer.querySelector("video")).addEventListener("loadedmetadata", resumeProgressMonitor);
      v.addEventListener("play", resumeProgressMonitor);
      v.addEventListener("pause", pauseProgressMonitor);
    } else timerWaitPlayer = setTimeout(waitPlayer, 200);
  })();

  function doubleCheck() {
    if (getPlayer() && vplayer.getPlayerState) {
      if (vplayer.getPlayerState() === 1) {
        resumeProgressMonitor();
      } else pauseProgressMonitor();
    }
  }
  if (!timerDoubleCheck) timerDoubleCheck = setInterval(doubleCheck, 500);
}

function init() {
  orgTitle = document.title;
  processInfo();
  processPlayer();
}

function parseColor(c, e) {
  (e = document.createElement("DIV")).style.color = c;
  c = getComputedStyle(document.documentElement.appendChild(e)).color;
  e.remove();
  if (e = c.match(/(\d+), (\d+), (\d+)(?:, (\d+\.\d+))?/)) {
    return [("0" + parseInt(e[1]).toString(16).toUpperCase()).substr(-2) + ("0" + parseInt(e[2]).toString(16).toUpperCase()).substr(-2) +
      ("0" + parseInt(e[3]).toString(16).toUpperCase()).substr(-2), e[4] ? parseFloat(e[4]).toFixed(1) : "1"];
  }
  return ["000000", "1"];
}

function toRgba(rgb, opacity) {
  return rgb + ("0" + Math.floor(opacity * 255).toString(16)).substr(-2);
}

GM_registerMenuCommand("Configuration", (elePop, a) => {
  if (window.ayvpConfig) return;
  (elePop = document.createElement("DIV")).id = "ayvpConfig";
  elePop.innerHTML = `<style>
#ayvpConfig{
  position:fixed;z-index:999999999;left:0;top:0;right:0;bottom:0;background:rgb(0,0,0,0.5);
  color:#000;font:normal normal normal 10pt/normal sans-serif;cursor:pointer
}
#ayvpPopup{position:fixed;top:.5em;right:.5em;border:.1em solid #000;border-radius:.5em;padding:.3em;background:#fff;cursor:auto}
#ayvpCaption{border-radius:.3em;padding:.2em .3em;background:#444;color:#fff;font-weight:bold}
#ayvpContent{margin-top:1em}
#ayvpContent tr+tr td{padding-top:.5em}
#ayvpContent td+td{padding-left:.5em}
#ayvpContent .radio:last-child,
#ayvpContent .radio:last-child{margin-left:1em}
#ayvpContent .radio input{vertical-align:middle;margin-top:-.1em}
#ayvpPbh,
#ayvpPbds{margin-left:.5em;width:4em}
#ayvpContent .preview{display:inline-block;margin-left:.5em;white-space:nowrap}
#ayvpContent .preview .barContainer{
  display:inline-block;position:relative;vertical-align:bottom;width:70pt;height:13pt;overflow:hidden;background:#000;
  white-space:normal;word-break:break-all;color:#fff;font-size:7pt;line-height:1em;
}
#ayvpContent .preview .barBase{position:absolute;left:0;right:0;bottom:0}
#ayvpContent .preview .barBase *{height:100%}
#ayvpContent .preview .barBuf,
#ayvpContent .preview .barElap{width:66%}
#ayvpContent .hrgb{width:4em;text-transform:uppercase}
#ayvpContent .picker{margin-right:1em;vertical-align:top;width:2em;height:1.5em;padding:0}
#ayvpContent .opacity{width:3em}
#ayvpContent #ayvpPslc{margin-left:1ex}
#ayvpControls{margin:1em 0 .5em 0;text-align:center}
#ayvpControls button{margin:0 2em;width:5em}
#ayvpControls #ayvpExp{float:left;margin-left:.3em}
#ayvpControls #ayvpImp{float:right;margin-right:.3em}
#ayvpControls #ayvpImpFile{display:none}
${document.documentElement.attributes["dark"] ? configGuiStylesDark : ""}
</style>
<form id="ayvpPopup">
  <div id="ayvpCaption">YouTube Video Progress Configuration</div>
  <table id="ayvpContent">
    <tr>
      <td>Progressbar Auto Hide: <span title="Auto hide when YouTube video controls is visible">[?]</span></td>
      <td>
        <label class="radio"><input id="ayvpPbae" type="radio" name="ahide" value="0" /> Disabled</label>
        <label class="radio"><input id="ayvpPbad" type="radio" name="ahide" value="1" /> Enabled</label>
      </td>
    </tr>
    <tr>
      <td>Show Progressbar Below Video: <span title="Applies only when not in fullscreen mode">[?]</span></td>
      <td>
        <label class="radio"><input id="ayvpPbpi" type="radio" name="ppos" value="0" /> No</label>
        <label class="radio"><input id="ayvpPbpo" type="radio" name="ppos" value="1" /> Yes</label>
      </td>
    </tr>
    <tr>
      <td>Progressbar Style:</td>
      <td>
        <label class="radio"><input id="ayvpPbsl" type="radio" name="style" value="0" /> Line</label>
        <label class="radio"><input id="ayvpPbsd" type="radio" name="style" value="1" /> Dot</label>
      </td>
    </tr>
    <tr>
      <td>Progressbar Height:</td>
      <td>
        <input id="ayvpPbh" type="number" min="0" max="999" maxlength="3" value="${cfg.pbHeight}" required /> pixels
        <div class="preview">
          Preview:
          <div class="barContainer" title="Preview for line style progress only">
            .
            <div class="barBase" style="height:${cfg.pbHeight}px;background:${cfg.pbColor}">
              <div class="barBuf" style="background:${cfg.pbBufferColor}">
                <div class="barElap" style="background:${cfg.pbElapsedColor}"></div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
${
  (() => {
    return [
      ["Background", "b", parseColor(cfg.pbColor), "Base"],
      ["Elapsed", "e", parseColor(cfg.pbElapsedColor), "Elap"],
      ["Buffer", "u", parseColor(cfg.pbBufferColor), "Buf"]
    ].map(t => {
      return `<tr>
        <td>Progressbar ${t[0]} Color:</td>
        <td bar="${t[3]}">#<input class="hrgb" maxlength="6" pattern="(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})" value="${t[2][0]}" required />
          <input class="picker" type="color" value="#${t[2][0]}" prevvalue="#${t[2][0]}" />
          Opacity: <input class="opacity" type="number" min="0.0" max="1.0" step="0.1" value="${t[2][1]}" required /> (0.0 - 1.0)</td>
      </tr>`
    }).join("");
  })()
}
    <tr>
      <td>Progressbar Dot-style Size:</td>
      <td>
        <input id="ayvpPbds" type="number" min="0" max="999" maxlength="3" value="${cfg.pbDotStyleSize}" required /> pixels
      </td>
    </tr>
    <tr>
      <td>Progress Text: <span title="If disabled, chapter box will also be disabled">[?]</span></td>
      <td>
        <label class="radio"><input id="ayvpPtds" type="radio" name="ptext" value="0" /> Disabled</label>
        <label class="radio"><input id="ayvpPten" type="radio" name="ptext" value="1" /> Enabled</label>
      </td>
    </tr>
    <tr>
      <td>Progress Text In Document Title: <span title="Include progress text in page title (browser tab title)">[?]</span></td>
      <td>
        <label class="radio"><input id="ayvpPttd" type="radio" name="dtitle" value="0" /> Disabled</label>
        <label class="radio"><input id="ayvpPtte" type="radio" name="dtitle" value="1" /> Enabled</label>
      </td>
    </tr>
    <tr>
      <td>Preferred Subtitle Language:</td>
      <td>
        <select id="ayvpPslc"></select>
      </td>
    </tr>
  </table>
  <div id="ayvpControls">
    <button id="ayvpExp">Export</button>
    <button id="ayvpImp">Import</button><input id="ayvpImpFile" type="file" />
    <button id="ayvpOk" type="submit">OK</button>
    <button id="ayvpCancel">Cancel</button>
  </div>
</form>`;
  elePop.querySelectorAll("input[name=ahide]")[cfg.pbAutohide ? 1 : 0].checked = true;
  elePop.querySelectorAll("input[name=ppos]")[cfg.pbPosBelow ? 1 : 0].checked = true;
  elePop.querySelectorAll("input[name=style]")[cfg.pbDotStyle ? 1 : 0].checked = true;
  elePop.querySelector(".barContainer").firstChild.data = "Sample content ".repeat(5);
  elePop.querySelectorAll("input[name=ptext]")[cfg.ptEnabled ? 1 : 0].checked = true;
  elePop.querySelectorAll("input[name=dtitle]")[cfg.ptDocTitle ? 1 : 0].checked = true;
  a = elePop.querySelector("#ayvpPslc");
  langList.forEach((l, e) => {
    (e = document.createElement("OPTION")).value = l[1];
    e.textContent = l[0];
    a.appendChild(e);
  });
  a.value = cfg.subLangCode;
  function applyConfig(a) {
    if (window.vidprogress) {
      if (window.vidprogress2) {
        vidprogress2.style.height = (cfg.pbDotStyle ? cfg.pbDotStyleSize : cfg.pbHeight) + "px";
        vidprogress2.style.background = cfg.pbColor;
        vidprogress2b.style.background = cfg.pbElapsedColor;
        vidprogress2c.style.background = cfg.pbBufferColor;
        if (cfg.pbDotStyle) {
          vidprogress2c.style.marginLeft = vidprogress2b.style.marginLeft = Math.floor(cfg.pbDotStyleSize / 2) + "px;";
          vidprogress2c.style.width = vidprogress2b.style.width = cfg.pbDotStyleSize + "px";
        } else {
          vidprogress2c.style.left = vidprogress2b.style.left = "";
          vidprogress2c.style.marginLeft = vidprogress2b.style.marginLeft = "";
          vidprogress2c.style.width = vidprogress2b.style.width = "";
        }
      }
      if (window.subs && subs.style.fontWeight) selectCaption();
      vidprogress.style.setProperty("display", cfg.ptEnabled ? "inline-block" : "none", "important");
      if (window.vidchap) vidchap.style.display = !cfg.ptEnabled ? "none" : "";
    }
  }
  function saveConfig(ev, a) {
    if (ev) ev.preventDefault();
    if (JSON.parse(GM_getValue("cfg", JSON.stringify(cfg))).ver > cfg.ver) {
      alert(`Can not save configuration changes.
Current script instance is older than the installed script.
Please reload the page to use the newer script then try again.`);
      elePop.remove();
      return;
    }
    cfg.pbAutohide = elePop.querySelector('input[name=ahide]:checked').value === "1";
    cfg.pbPosBelow = elePop.querySelector('input[name=ppos]:checked').value === "1";
    cfg.pbDotStyle = elePop.querySelector('input[name=style]:checked').value === "1";
    cfg.pbHeight = parseInt(ayvpPbh.value);
    [["pbColor", "Base"], ["pbElapsedColor", "Elap"], ["pbBufferColor", "Buf"]].forEach(v => {
      cfg[v[0]] = toRgba(elePop.querySelector(`td[bar=${v[1]}] .picker`).value, elePop.querySelector(`td[bar=${v[1]}] .opacity`).value);
    });
    cfg.pbDotStyleSize = parseInt(ayvpPbds.value);
    cfg.ptEnabled = elePop.querySelector('input[name=ptext]:checked').value === "1";
    if (!(cfg.ptDocTitle = elePop.querySelector('input[name=dtitle]:checked').value === "1")) document.title = orgTitle;
    cfg.subLangCode = ayvpPslc.value;
    GM_setValue("cfg", JSON.stringify(cfg));
    applyConfig();
    if (ev) elePop.remove();
  }
  elePop.lastElementChild.addEventListener("submit", saveConfig);
  elePop.addEventListener("keydown", ev => ev.stopPropagation(), true);
  elePop.addEventListener("input", (ev, e, b) => {
    if ((e = ev.target).id) { //height. line style
      if (e.id === "ayvpPbh") elePop.querySelector(".barBase").style.height = e.value + "px";
    } else { //colors
      b = elePop.querySelector(".bar" + e.parentNode.getAttribute("bar"));
      if (e.type === "color") { //picker
        b.style.background = e.value + ("0" + Math.floor(e.nextElementSibling.value * 255).toString(16)).substr(-2);
      } else if (e.type === "number") { //opacity
        b.style.background = e.previousElementSibling.value + ("0" + Math.floor(e.value * 255).toString(16)).substr(-2);
      } else { //hrgb
        e.nextElementSibling.value = "#" + e.value;
        b.style.background = e.nextElementSibling.value + ("0" + Math.floor(e.nextElementSibling.nextElementSibling.value * 255).toString(16)).substr(-2);
      }
    }
  });
  elePop.addEventListener("change", (ev, e, r) => {
    if ((e = ev.target).className === "picker") {
      if (e.value.substr(1).toUpperCase() !== e.getAttribute("prevvalue")) {
        e.setAttribute("prevvalue", e.previousElementSibling.value = e.value.substr(1).toUpperCase());
        elePop.querySelector(".bar" + e.parentNode.getAttribute("bar")).style.background =
          e.value + ("0" + Math.floor(e.nextElementSibling.value * 255).toString(16)).substr(-2);
      }
    } else if (e.id === "ayvpImpFile") {
      r = new FileReader();
      r.onload = (o, t, z) => {
        try {
          o = JSON.parse(r.result);
          if (!o.id === "ayvp") throw 0;
          if (o.ver > cfg.ver) {
            alert(`Can not import configuration changes.
Current script instance is older than the installed script.
Please reload the page to use the newer script then try again.`);
            return;
          }
          cfg = o;
          GM_setValue(cfg, r.result);
          applyConfig();
          elePop.remove();
        } catch(z) {
          alert(z.message ? "Invalid configuration file." : z);
        }
      };
      r.readAsText(e.files[0]);
    }
  });
  elePop.addEventListener("click", (ev, a) => {
    switch (ev.target.id) {
      case "ayvpExp":
        if (JSON.parse(GM_getValue("cfg", JSON.stringify(cfg))).ver > cfg.ver) {
          alert(`Can not export configuration changes.
Current script instance is older than the installed script.
Please reload the page to use the newer script then try again.`);
          elePop.remove();
          break;
        }
        saveConfig();
        JSON.stringify(cfg);
        document.body.appendChild(a = document.createElement("A")).href = URL.createObjectURL(new Blob([JSON.stringify(cfg)], {type: "application/json"}));
        a.download = `YouTubeVideoProgressbar.json`;
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
        break;
      case "ayvpImp":
        ayvpImpFile.click();
        break;
      case "ayvpConfig":
      case "ayvpCancel":
        elePop.remove();
        break;
      default:
        return;
    }
    ev.preventDefault();
  });
  document.documentElement.append(elePop);
});

addEventListener("yt-page-data-updated", processInfo);
addEventListener("yt-player-released", processPlayer);
addEventListener("load", init);
addEventListener("spfprocess", () => {
  setTimeout(init, contentLoadProcessDelay);
});

})(unsafeWindow);

// ==UserScript==
// @name        Enstyler
// @namespace   dealz.rrr.de
// @description MyDealz Enstyler enhanced features
// @author      gnadelwartz
// @license     LGPL-3.0; http://www.gnu.org/licenses/lgpl-3.0.txt
// @include     https://www.dealabs.com/*
// @include     https://nl.pepper.com/*
// @include     https://www.preisjaeger.at/*
// @include     https://www.mydealz.de/*
// @include     https://www.hotukdeals.com/*
// @include     https://userstyles.org/styles/128262/*
// @include     https://www.amazon.*
// @version     20.07.292
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @require     https://unpkg.com/umbrellajs
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/Enstyler@808bbfb40f089845f4d96e07eca419b14c73d86c/translations.js
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/GM_config@3bfccb1cb4238694566ec491ee83d8df94da18d5/GM_config-min.js
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/lz-string@a96e60cb8df3892ef8e4c4c700af9110122fbe61/lz-string.min.js
// @require     https://cdn.jsdelivr.net/gh/gnadelwartz/sjcl@20de886688dcabda2da1a42cd89790aacc987b09/sjcl.js
// @require     https://cdn.jsdelivr.net/gh/delight-im/ShortURL@5ddbfe89528637ff73212200773db876bbd0bebd/JavaScript/ShortURL.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/24243/Enstyler.user.js
// @updateURL https://update.greasyfork.org/scripts/24243/Enstyler.meta.js
// ==/UserScript==
// @ the original development source with comments can be found here: https://greasyfork.org/de/scripts/24244-enstylerjs-develop
// @ if you don't trust this minimized script use the development source.
function EnstylerInit() {
  (enUserLogin = u(".avatar--type-nav").length) ? (enUserName = (enUserName = u(".navDropDown a").attr(enHREF)).replace(/.*\/profile\/([^\/]+).*/, "$1"), GM_setValue("enCSyncUser", enUserName)) : enUserName = GM_getValue("enCSyncUser", ""), 
  enSection = enLocParser.pathname.replace(/\/([^\/]+\/*).*/, "/$1");
}

function EnstylerDealActions() {
  if (enTransTags = 5, myDealAction) {
    u("footer logo--brandmark").length && (enDealFooter = "%0D%0A%0D%0A-- %0D%0A" + u("#footer > div:nth-child(1)  p.size--all-l.text--b").first().text());
    var e = enLocParser.pathname;
    switch ("" != enUserName && (e = e.replace(enUserName + "/", "")), enDealAdd = enDealAction[0], !0) {
     case e.endsWith("profile/diskussion"):
     case enUserLogin && e.endsWith(enUserName):
      enDealAdd += enDealAction[2];
    }
    enDealAdd = enLangLocalize(enDealAdd + enDealAction[3] + enDealAction[5], enDealLang, enLANG), enSocialAdd = enLangLocalize(enDealAction[6] + enDealAction[4], enDealLang, enLANG), enCommentAdd = enLangLocalize(enDealAction[3] + enDealAction[5], enDealLang, enLANG);
  }
  EnstylerDealActionsDo();
}

function EnstylerDealActionsDo() {
  var e, t, n, a, o, i, r, l, s, c, d, p;
  enMyCSSID = enUserKey(""), (myDealAction || myTouch || myFixHtml || myVotebar || myPrice || enBlackTemp == enValOff) && (s = u(".thread--type-list, .cept-listing--card").length, u("article").not(".enClassActionDone, ." + enClassHidden).each(function(f) {
    if (u(f).addClass("enClassActionDone"), !u(f).hasClass("threadWidget--type-card--item")) if (null !== (e = u(f).attr(enID))) {
      if (n = u(f).find(".thread-title a"), c = "c" != e[0], enBlackTemp != enValOff && (c ? s ? (d = (u(f).find(".thread-title a").text() + " @" + u(f).find("a.user").text()).replace(unwantedRegex[1], " "), 
      l = null !== (l = u(f).find(".vote-temp")).text() ? parseInt(l.text()) : 9999) : (l = 9999, d = "") : (d = (u(f).find(".userHtml").text() + " @" + u(f).find("a.user").text()).replace(unwantedRegex[1], " "), 
      l = 0), (!enWhiteTrue || !d.match(enWhite)) && (enBlackTemp >= l || enBlackTrue && d.match(enBlack)))) {
        var g = u(f).parent();
        g.hasClass("threadCardLayout--card") ? g.addClass(enClassHidden) : u(f).addClass(enClassHidden), enBlacklisted++;
      }
      myFixHtml && u(f).find(".userHtml").each(function(e) {
        u(e).html(u(e).html().replace(/[^ -~¡-ÿ✘►○●✰€≠]+|(&nbsp;)+|(\n\r)+|<\/p>|<div>/g, " ").replace(/<\/div>/g, "<br>").replace(/<p>|<br>( *<br>)+/g, "<br><br>").replace(/(<li>)(<br>)+|<br>*(<br><\/li>)/g, "$1"));
      }), myPrice && c && (d = u(f).find(".thread-price.text--b")).length && ((o = u(f).find(".cept-dealBtn")).hasClass("ico--type-redirect-white") ? o.html(d.html()) : o.html(d.html() + '<span class="ico ico--type-redirect-white size--all-xl space--l-1"></span>'), 
      u(f).find(".cept-tb").html(d.html())), myDealAction && c && (s || (n = u(f).find(".thread-title"), enTransTags = 20), enTranslateGoogle(n), (i = u(f).find(".vote-temp")).length && (i = parseInt(i.text()), 
      myVotebar && (l = u(f).find(".vote-temp").attr("class").replace(/.*charcoal|.*vote-temp--/i, ""), 0 > (r = i / (myVotescale / 70) + 5) && (r *= -3), p = f, s || (p = u(u(f).find("div").first())), u(p).prepend('<div class="votebar vote-progress voteBar--' + l + '" style="width: ' + r + '%;"></div>'), 
      u(f).hasClass("thread--type-card") && (i = 0), i > myVotescale / 2.51 ? u(p).prepend(enDealFlame) : -myVotescale / 10.1 > i && u(p).prepend(enDealIce))), s ? (u(f).find("span.meta-ribbon.hide--toW3").removeClass("hide--toW3"), 
      u(f).find(".threadGrid-title .thread-title.lineClamp--2").removeClass("lineClamp--2"), a = enMinimzeHref(n.first().outerHTML.replace(/\n|\r|\t/g, "").replace(/^.*href="/, "").replace(/".*/, "")), o = enDealComposeAction(u(f), n.text(), a, enDealAdd.replace(enPATTERN[enTITLE], n.text())), 
      u(f).find(".cept-comment-link").append(o)) : (o = enDealComposeAction(u(f), n.text(), enMinimzeHref(enLocParser.toString()), enSocialAdd.replace(enPATTERN[enTITLE], n.text())), u(f).find("a.btn--twitter").parent().append(o))), 
      (t = u(f).find(".userHtml")).length && enTranslateGoogle(t);
    } else u(f).remove();
  }), EnstylerBlacklistShow());
}

function enDealComposeAction(e, t, n, a) {
  return 100 > (t = encodeURIComponent(("Gnadelwartz" == enUserName ? "KayDealz" : enInterName) + ": " + t.replace(/\r|\n|\t/g, " ").replace(/  */g, " "))).length && e.find("span.thread-price").length && (t += encodeURIComponent(" -> " + e.find("span.thread-price").text().replace(/ |\t/g, ""))), 
  n = enMinimzeHref(n), a.replace(enPATTERN[enHREF], "\n\r" + n).replace(enPATTERN[enTEXT], truncStringWord(t, 160, "%20") + "&body=" + t + "%0D%0A%0D%0A" + n + enDealFooter);
}

function enMinimzeHref(e) {
  return e = e.replace(/(.*)\/.*-/, "$1/md-"), enCCMail && !e.startsWith("https://dealz.rrr.de/") && (e = e.replace(/^https:\/\/.*?\//, "https://dealz.rrr.de/" + enInterName + "/") + "?ID=" + enMyCSSID), 
  e;
}

function EnstylerBlacklist() {
  enUserLogin && !GM_config.get("enConfWhitelist").includes(enUserName) && GM_config.set("enConfWhitelist", "@" + enUserName + "," + GM_config.get("enConfWhitelist"));
  var e = GM_config.get("enConfBlacklist").replace(unwantedRegex[0], "");
  enBlack = RegExp(e.replace(/^,|,$/g, "").replace(/(.),(.)/g, "$1|$2"), "i"), (enBlackTrue = !" ".match(enBlack)) || "" == e || alert(confLang("regexfailed")), enWhite = RegExp(GM_config.get("enConfWhitelist").replace(/^,|,$/g, "").replace(/(.),(.)/g, "$1|$2"), "i"), 
  enWhiteTrue = !" ".match(enWhite), enBlackTemp = GM_config.get("enCBlackC"), enBlackTrue = enBlackTrue && enBlackTemp != enValOff;
}

function EnstylerBlacklistShow() {
  enConfDefs.default.enCUnblackL.label = enUnblackText.replace(enPATTERN[enTEXT], enBlacklisted);
}

function EnstylerBlacklistUnhide() {
  enBlacklisted = 0, EnstylerBlacklistShow(), u("." + enClassHidden).removeClass(enClassHidden);
}

function EnstylerFixedNav() {
  var e = u(".subNavMenu .subNavMenu-layer").first();
  if (GM_config.get("enCNavF")) if ("/deals/" != enSection && "/gutscheine/" != enSection) {
    var t = u("header.js-sticky").html();
    u("header.forceLayer").replace('<header class="enFixedNav">' + t + "</header>");
    var n = myFixedCSS.every;
    enSection == EnstylerSiteConfig("discussion") && (n += myFixedCSS.discus), (u(".nav-subheadline").length || "/profile/" == enSection) && (n += myFixedCSS.subnav), addStyleString(n);
  } else e = u(".vote-box").first();
  e && e.after(enMenuButton);
}

function EnstylerDealTime() {
  TodayStart.setHours(0, 0, 0, 0), today = enLangLocalize('<span class="hide--toW2"><EN-LANG:today>&nbsp;</span>', enTimeLang, enLANG), oclock = enLangLocalize('<span class="hide--toW2">&nbsp;<EN-LANG:oclock></span>', enTimeLang, enLANG), 
  yesterday = enLangLocalize("<EN-LANG:yesterday> ", enTimeLang, enLANG), EnstylerDealTimeDo();
}

function EnstylerDealTimeDo() {
  if (myDealTime) {
    var e, t, n, a = Date.now();
    u(".meta-ribbon, time, .metaRibbon").not("." + EnstylerTimeSeen).each(function(o) {
      if (u(o).addClass(EnstylerTimeSeen), !(e = u(o).html()).includes(" am ")) {
        switch (DealDate.setTime(a - (60 * parseInt(e.replace(/.* ([0-9].*) [hu].*|.*/, "$1")) + parseInt(e.replace(/.* ([0-9].*) m.*|.*/, "$1"))) * enTime2Min), t = (a - DealDate) / enTime2Min, n = DealDate.toString().slice(16, 21), 
        !0) {
         case 5 > n.length || 60 > t:
          return;

         case t > 1440:
          e += "&nbsp;(" + n + oclock + ")";
          break;

         case TodayStart > DealDate:
          e = yesterday + n + oclock;
          break;

         default:
          e += "&nbsp;(" + today + n + oclock + ")";
        }
        u(o).html(e);
      }
    });
  }
}

function EnstylerLastSeen() {
  if (LastSeenOnce) if (LastSeenOnce = !1, enSection.match(enMainSectionMatch)) {
    if (enSeArt = GM_getValue(enSec, ""), SyncLastSeen(), EnstylerLastSeenDo(), "" == enLocParser.search) {
      var e = !1;
      u("article").not(".threadWidget-item").each(function(t) {
        e || 0 != u(t).find(".cept-pinned-flag").length || (GM_setValue(enSec, u(t).attr(enID)), GM_setValue(enSec + "Last", enSeArt), SaveLastSeen(), e = !0);
      });
    }
  } else EnstylerLastSeenLast();
}

function EnstylerLastSeenDo() {
  if ("" != enSec) if (GM_setValue("enLastCheck" + enSec, Date.now() / enMs2Min), enSeArt) {
    GM_setValue(enSec + "Last", enSeArt);
    var e = u("#" + enSeArt);
    e.addClass("enClassMarkArticle"), enLaArt.startsWith("thread_") && (e = u("#" + enLaArt)).addClass("enClassMarkArticleLoad");
  } else GM_setValue(enSec, "thread_1");
}

function EnstylerLastSeenLast() {
  var e = GM_getValue(enNewestBase + "LastSec", "");
  GM_setValue(e, GM_getValue(e + "Last", ""));
}

function enCheckUpdates() {
  var e = Date.now() / enMs2Min - GM_getValue("enLastUpdateCheck", "0");
  10 > GM_getValue("MyCSS", "").length && (e = -1), (e > enUpdInt || 0 > e) && enUpdateCSS();
}

function enUpdateCSS() {
  var e = parseInt(Date.now() / enMs2Min), t = enComposeUpdateOpt();
  enCacheExternalResource(enUpdateUrl + t, MyCSS), GM_setValue("enLastUpdateCheck", e), enSaveMyCSS();
}

function enComposeUpdateOpt() {
  var e = GM_getValue(enCssOpt, "");
  if ("" == e || !e.startsWith("#")) return "";
  var t = (e = e.replace(/\n/g, "")).split(";");
  e = "";
  for (var n = 0; n < t.length; n++) if ("" != t[n]) {
    var a = t[n].split(":");
    2 > a.length || (e += "&" + a[1].slice(0, -1) + "=" + a[1]);
  }
  return "?" + e.slice(1);
}

function EnstylerMenuActions() {
  EnstylerAddNav("Main", "<EN-LANG:enstyler>", '<EN-LANG:enhref>" target="_blank', "enMainHomepage", "home"), EnstylerAddNav("Main", "Enstyler Discussion", "https://t.me/joinchat/IvvRthRhMcX6rDQU-pZrWw", "enMainHomepage", "page"), 
  EnstylerAddNav("MainButton", "<EN-LANG:settings>", showEnstylerConfig, EnstylerButton, "gear-grey"), EnstylerAddNav("Main", "Deal-O-Mat / Telegram Groups", "https://dealz.rrr.de/deal-O-mat/", "enMainHomepage", "home");
}

function EnstylerAddNav(e, t, n, a, o) {
  void 0 !== o && "" != o || (o = enNavIconPat);
  var i = !1, r = enMenuItemCode[e].replace(enPATTERN[enID], a).replace(enPATTERN[enTEXT], t);
  o != enNavIconPat && (r = r.split(enNavIconPat).join("#" + o)), "function" == typeof n ? i = !0 : r = r.replace(enPATTERN[enHREF], n), "M" == e[0] && ("" == enAddMain && u(".nav-link.navMenu-trigger").on("click", function() {
    setTimeout(EnstylerMainDo, 200);
  }), enAddMain += r, i && (enAddMainFunc[enAddMainCount++] = {
    ID: a,
    target: n
  }));
}

function EnstylerMainDo() {
  if (!enAddMainDone) {
    enAddMainDone = !0, u(".popover-content nav .navMenu-div").first().insertAdjacentHTML("beforebegin", enLangLocalize(enAddMain, enMenuLang, enLANG));
    var e = u(".popover--mainNav"), t = 35 * (enAddMain.split(enNavEntry).length - 1) + parseInt(e.attr("style").split("height: ")[1]);
    e.attr("style", e.attr("style").replace(/height: [0-9.]*px/, "height: " + t + "px"));
    for (var n = 0; enAddMainCount > n; n++) u("section #" + enAddMainFunc[n].ID).on("click", enAddMainFunc[n].target);
  }
}

function confLang(e) {
  return enLangLocalize("<EN-LANG:" + e + ">", enConfigLang, enLANG);
}

function confMess(e) {
  return enLangLocalize("<EN-LANG:" + e + ">", enMessageLang, enLANG);
}

function showEnstylerConfig() {
  u("body").prepend('<div id="enOverDim"></div>'), GM_config.open(), document.getElementById("main").click(), enGMConfigOpen = !0;
}

function closeEnstylerConfig() {
  u("#enOverDim").remove(), enGMConfigOpen = !1;
}

function confLangOpen() {
  u('.GM_config button[id$="_saveBtn"]').html(confLang("save")), u('.GM_config button[id$="_closeBtn"]').html(confLang("close")), u("#GM_config_resetLink").html(confMess("reset"));
}

function EnstylerSyncIDShow() {
  enSyncKey != enValOff && (u('.GM_config input[id$="_field_enCSync"]').first().value = confLang("sync") + " " + enUserKey(""));
}

function SyncSettings() {
  EnGetValue("", enSetValue), EnGetValue(enSettings, enSetSettings);
}

function SaveSettings() {
  EnSaveValue(enCssOpt, GM_getValue(enCssOpt, "")), enSaveMyCSS();
  for (var e = "", t = 0; t < enSaveSettings.length; t++) e += enSaveSettings[t] + "=" + GM_config.get(enSaveSettings[t]) + "&";
  EnSaveValue(enSettings, e);
}

function SaveLastSeen() {
  enAutoSync && (Date.now() / enMs2Min - GM_getValue("enLastCheck" + enSec, "0") > 5 && (delay = 500), setTimeout(function() {
    EnSaveValue(enSec, GM_getValue(enSec, ""));
  }, 1 * enMs2Min / 2));
}

function SyncLastSeen() {
  if (enAutoSync) {
    var e = Date.now() / enMs2Min, t = e - GM_getValue("enLastCheck" + enSec, "0");
    (t > 1 || 0 > t) && (GM_setValue("enLastCheck" + enSec, e), EnGetValue(enSec, enSetLastSeen));
  }
}

function enSetLastSeen(e, t) {
  enLaArt = t, EnstylerLastSeenDo(), enLaArt.replace(/thread_/i, "") > enSeArt.replace(/thread_/i, "") && enSetValue(e + "Last", t);
}

function enSaveMyCSS() {
  EnSaveValue("", extraCSS + GM_getValue(MyCSS, "").replace(/^.*?{/, "").replace(/} *@-moz-document.*/, ""), !1);
}

function enSetSettings(e, t) {
  for (var n = t.split("&"), a = 0; a < n.length; a++) {
    var o = n[a].split("=");
    o.length >= 2 && enSaveSettings.includes(o[0]) && ("false" == o[1] ? GM_config.fields[o[0]].value = !1 : GM_config.fields[o[0]].value = o[1], GM_config.fields[o[0]].reload());
  }
}

function enAmazonMobileRedirect() {
  var e = enLocParser.href;
  return !!e.startsWith("https://www.amazon") && (GM_config.get("enCRedirect") && (e.includes("/gp/aw/d/") ? window.location.replace(e.replace("/gp/aw/d/", "/dp/")) : e.includes("/gp/aw/ol/") && window.location.replace(e.replace("/gp/aw/ol/", "/gp/offer-listing/"))), 
  !0);
}

function EnstylerStart() {
  EnstylerShowPage(), EnstylerFixedNav(), EnstylerLastSeen(), EnstylerDealTime(), EnstylerBlacklist(), EnstylerDealActions();
}

function EnstylerRedo() {
  EnstylerShowPage(), EnstylerLastSeenDo(), EnstylerDealTimeDo(), EnstylerDealActionsDo();
}

function EnstylerShowPage() {
  if (myDealTime) {
    var e = u(".search-input");
    e.lenth || e.nodes[0].setAttribute("placeholder", enShowDate + enLangLocalize(" <EN-LANG:oclock>", enTimeLang, enLANG) + ("/" == enLocParser.pathname ? " (home" : " (" + enLocParser.pathname.replace(/(^.*)[\/]|-.*/g, "")) + (enLocParser.search.length ? " |" + enLocParser.search.replace(/.*=/, "") + "|" : "") + ")");
  }
}

function EnstylerDelayedInit() {
  var e = shadeRGBColor(getStyle(u(".nav").first(), "background-color"), .1), t = shadeRGBColor(getStyle(u(".btn--mode-special").first(), "background-color"), .1), n = shadeRGBColor(e, .7), a = medainRGBColor(getStyle(u("#main").first(), "background-color")) > 100 ? "" : ".notification-item {color: #111;} body, .user, .thread-title, .subNavMenu-link, .mute--text2 {color: #aaa !important} .notification-item--read, .card-title, .mute--text, .userHtml-quote, .userHtml .userHtml-quote-source, .widget-title, .linkGrey, .thread-userOptionLink, .btn--mode-white--dark, .btn--mode-boxSec, .thread--expired.thread--type-card, .thread--expired.thread--type-list {color: #888;} article, section {border: 1px #666 solid} img, .votebar, .vote-tempIco, .vote-temp, .vote-temp--hot, .text--color-red, .vote-btn, .emoji, .ico, .dot {filter: grayscale(.25);}";
  addStyleString(" .GM_config {background-color: " + e + " !important; color: " + n + ";} .GM_config select {background-color: " + e + " !important;} .GM_config .section_header, .GM_config .config_header {background-color: " + shadeRGBColor(e, -.25) + " !important; color: " + n + " !important;} .nav-link-text:hover, .js-navDropDown-messages:hover, .js-navDropDown-activities:hover  { background-color: " + shadeRGBColor(e, .1) + " !important;} .GM_config input[type=button] { background-color: " + t + " !important; border-color: " + t + " !important; min-width: 10em;} .GM_config input[type=button]:hover, .btn--mode-special:hover { background-color: " + shadeRGBColor(t, .2) + " !important; border-color: " + shadeRGBColor(t, .2) + " !important;} .bg--inverted { background-color: " + t + " }" + a), 
  EnstylerMenuActions(), isMobile ? u("#main").on("DOMSubtreeModified", debounce(300, function() {
    window.requestAnimationFrame(EnstylerRedo);
  })) : u(".js-pagi-bottom").on("DOMSubtreeModified", debounce(200, function() {
    window.requestAnimationFrame(EnstylerRedo);
  }));
}

function WaitForBody() {
  if (!enAmazonMobileRedirect()) if (u("#messages-list").length || u("#footer").length) {
    if (enEarlyInit(), enLocParser.pathname.match(enDisableScript)) return;
    WaitForDOM();
  } else window.requestAnimationFrame(WaitForBody);
}

function WaitForDOM() {
  var e = getStyle(u(".nav, #navigation").first(), "background-color").replace(/[^\(]*/, "");
  u(".vwo-deal-button, #footer").length && "" != e ? MAIN() : window.requestAnimationFrame(function() {
    setTimeout(WaitForDOM, 80);
  });
}

function enEarlyInit() {
  addStyleString(GM_getValue("Enstyler2_CSS", ""), 'domain("' + enLocParser.hostname), enCCMail = GM_config.get("enCCMail"), myDealAction = GM_config.get("enCDealA"), myTouch = GM_config.get("enCTouch"), 
  myCompact = GM_config.get("enCCompact"), myPrice = GM_config.get("enCPrice"), myFixHtml = GM_config.get("enCFixHtml"), myVotescale = GM_config.get("enCDealVbar"), myVotebar = myVotescale != enValOff, 
  myDealTime = GM_config.get("enCDealT"), myPrice && (extraCSS += ".threadGrid-title .flex, .threadGrid-title .overflow--fade {display: none;}"), myCompact && (extraCSS += ".threadGrid {padding: .3em !important;} .threadGrid-headerMeta, .threadGrid-title {height: 2.8em;}.thread-title {white-space: nowrap;} .threadGrid-headerMeta {height: 2.3em;} .thread--compact .threadGrid-image {display: none}.space--mt-2, .space--mv-2 {margin-top: .25em;} .vote-box {height: 2.1em} .votebar {top: 0;} .threadTempBadge-icon {font-size: 1.3em !important;}", 
  myPrice && (enCSS += ".threadGrid-headerMeta, .threadGrid-title {height: 2em !important;}")), myTouch && (extraCSS += "article .footerMeta-actionSlot .ico::before, article .threadItem-footerMeta .ico::before, article .threadCardLayout--row--small .ico::before, .thread-userOptionLink.ico:before {-webkit-transform: scale(1.7); transform: scale(1.7); width: 1.5em; left: .4em;}.ico--reduce3 {left: .5em;} #emergency {transform: scale(1.5); margin-left: .7em;}article a.btn--ctrl--fixed {-webkit-transform: scale(1.2); transform: scale(1.2); left: 0; margin-left: 3em; min-width: 4em;}.vote-down, .vote-up {padding-top: 0.25em; padding-bottom: 0.25em} .thread-avatar { width: 2.3em; height: 2.3em;}"), 
  myVotebar || (extraCSS += ".threadTempBadge { display: unset; }"), myDealAction && (extraCSS += "button.meta-ribbon-btn.hide--fromW3 {display: none}"), addStyleString(enCSS + extraCSS + enNavCSS);
}

function MAIN() {
  EnstylerInit(), enCheckUpdates(), document.body.appendChild(enGMFrame), addStyleString(".bg--off {background-color: " + shadeRGBColor(getStyle(u(".bg--main").first(), "background-color"), -.08) + "!important;}"), 
  setTimeout(EnstylerDelayedInit, 400), EnstylerStart();
}

function enUserstyleDo() {
  if (!u("#EnstylerButton").length) {
    document.body.appendChild(enGMFrame), addStyleString(enCSS + ".advancedsettings_hidden {max-width: 640px; border-radius: 8px; background-color: #ffffff; margin-bottom: 30px; padding: 30px; display: flex; flex-direction: row; flex-wrap: wrap; margin-top: 14px;} #ownedButtons {visibility: visible; border: 1px solid red;} #top_android_button, .android_button_banner, .walking, .overlay_background { display: none !important; }"), 
    addStyleString(GM_getValue("Enstyler2_CSS", ""), "url(https://userstyles.org");
    var e = setInterval(function() {
      u("#style-settings").length && (u("#EnstylerButton").length || createEnstylerButton(), clearInterval(e));
    }, 1e3);
  }
}

function createEnstylerButton() {
  u("#advancedsettings_area").attr("class", "advancedsettings_shown"), u(".advanced_button").remove(), input.setAttribute("style", "font-size: 1.3em; padding: 0.7em; background-color: #69be28; color: white; border-radius: 8px; border: 1px solid grey; margin-top: 1em; font-weight: bold;"), 
  u("#style-settings").before(input), window.scrollTo(100, 400), enSetOptions();
}

function saveEnstylerCSS() {
  enSaveOptions(), setTimeout(window.close, 1e3);
}

function enSaveOptions() {
  var e, t, n, a = "";
  u("#style-settings select").each(function(o) {
    e = u(o).attr(enID), t = o.value, n = u("option[value=" + t + "]").text(), a += "#" + e + ":" + t + ":" + n + ";\n";
  }), u("#style-settings input[type=text]").each(function(o) {
    e = u(o).attr(enID), t = o.value, a += "#" + e + ":" + t + ":" + (n = "RGB-Clolor") + ";\n";
  }), u("#style-settings input:checked").each(function(o) {
    e = u(o).attr(enID), t = o.value, n = u("label[for=" + e + "]").text(), a += "#" + e + ":" + t + ":" + n + ";\n";
  }), GM_config.set("saveOpt", a), GM_setValue(enCssOpt, a);
}

function enSetOptions() {
  input.value = confLang("options");
  var e = GM_getValue(enCssOpt, ""), t = (e = e.replace(/\n/g, "")).split(";");
  if ("" != e && e.startsWith("#")) {
    for (var n = 0; n < t.length; n++) {
      var a = t[n].split(":");
      a[0].startsWith("#setting") ? (u(a[0]).first().selectedIndex = "-1", u(a[0]).first().value = a[1]) : a[0].startsWith("#option") ? u(a[0]).first().checked = !0 : "" != a[0] && enDebugLog('ignoring unkown option: "' + a + '"');
    }
    addStyleString("#button { display: none; }");
  }
}

function enComposeCSS() {
  var e = GM_getValue(enCssOpt, "");
  if ("" == e || !e.startsWith("#")) return "";
  var t = (e = e.replace(/\n/g, "")).split(";");
  e = "";
  for (var n = 0; n < t.length; n++) if ("" != t[n]) {
    var a = t[n].split(":");
    2 > a.length || (e += "&" + a[0] + "=" + a[1]);
  }
  return e = "?" + e.slice(1).replace(/#/g, ""), enDebugLog(e), e;
}

//var isIE = /*@cc_on!@*/false || !!document.documentMode;
function mobileLog(e) {
  GM_setValue(saveLog, GM_getValue(saveLog, "") + e + "\n");
}

function mobileShowLog() {
  GM_getValue(saveLog, "");
}

function mobileClearLog() {
  GM_setValue(saveLog, "Enstyler Log\n");
}

function EnstylerSiteConfig(e) {
  return enGetSiteConfig(enInterName, e);
}

function enGetSiteConfig(e, t) {
  return enSiteConfig.hasOwnProperty(e) && enSiteConfig[e].hasOwnProperty(t) ? enSiteConfig[e][t] : "";
}

function enLangLocalize(e, t, n) {
  return enDealLang.hasOwnProperty(n) && void 0 !== t[n] || (n = "en"), (e = e.replace(enLangPat, function(e, a) {
    return t.hasOwnProperty(n) && t[n].hasOwnProperty(a) ? t[n][a] : a;
  })).match(enLangPat) ? enLangLocalize(e, t, n) : e;
}

function addStyleString(e, t) {
  // check if style contains @-moz-document rules
  if (void 0 === t && (t = ""), e.match(enUserScript.detect)) {
    "" == t && (t = enLocParser.hostname);
    var n = e.split(t);
    e = "";
    for (var a = 1; a < n.length; a++) -1 != n[a].indexOf("{") && (e += n[a].replace(enUserScript.split, "").replace(enUserScript.next, ""));
  }
  for (var o, i = 0, r = enCSSmax; e.length > r && (o = e.substring(r).indexOf("}.")) > 0; ) addStyleString(e.slice(i, r += o + 1)), i = r, r += enCSSmax;
  var l = document.createElement("style");
  l.innerHTML = e.slice(i), document.body.appendChild(l);
}

function capitalizeFirstLetter(e) {
  return e[0].toUpperCase() + e.slice(1);
}

function truncStringWord(e, t, n) {
  return void 0 === n && (n = " "), e.length > t ? (e = e.substr(0, t - 1)).substr(0, e.lastIndexOf(n)) + "..." : e;
}

function shadeRGBColor(e, t) {
  if (void 0 === t && (t = .1), void 0 === e) return "rgba(0,0,0,0)";
  var n = e.split(","), a = 0 > t ? 0 : 255, o = 0 > t ? -1 * t : t, i = parseInt(n[0].slice(4)), r = parseInt(n[1]), l = parseInt(n[2]);
  return "rgb(" + (Math.round((a - i) * o) + i) + "," + (Math.round((a - r) * o) + r) + "," + (Math.round((a - l) * o) + l) + ")";
}

function medainRGBColor(e) {
  var t = e.split(","), n = parseInt(t[0].slice(4)), a = parseInt(t[1]), o = parseInt(t[2]);
  return Math.round((n + a + o) / 3);
}

function debounce(e, t) {
  var n = null;
  return function() {
    clearTimeout(n), n = setTimeout(function() {
      t.call(this);
    }, e);
  };
}

/* curreently we assume its a CSS or JS File, so we strip comments and @namespace @moz-document... */ function enCacheExternalResource(e, t) {
  GM_xmlhttpRequest({
    method: "GET",
    url: e,
    onload: function(e) {
      var n = e.responseText.replace(/\r\n/g, " ").replace(/\/\*.*?\*\/|   *|\t/g, "").replace(/([:;]) /g, "$1").replace(/1111.11%/g, "100%");
      n.length > 60 && (GM_setValue(t, n), addStyleString(n));
    },
    onerror: function() {
      alert(confMess("cssfailed"));
    }
  });
}

function enTranslateGoogle(thisObj) {
  if (enLANG != enSiteLANG && thisObj.length) {
    var text = thisObj.html().replace(/[#\(\)]|\n|\r|\t/g, ""), html = "", transTags = [], count, match, buff = "", last = 0, regex = /<.*?>/gi;
    for (count = 0; match = regex.exec(text); count++) {
      if (count > enTransTags || buff.length + (match.index - last) > enMaxTrans) {
        var space = text.lastIndexOf(" ", last + (enMaxTrans - buff.length));
        buff += text.slice(last, last + space), html = text.slice(last + space);
        break;
      }
      transTags[count] = match[0], buff += text.slice(last, match.index) + '<a href="' + count + '">', last = regex.lastIndex;
    }
    if (buff.length || (buff = text, buff.length <= enMaxTrans)) var query = enGoogleTransURL.replace(/<ENSTYLER-LANG-HERE>/, enLANG).replace(/<ENSTYLER-HTML-HERE>/, encodeURI(buff)), ret = GM_xmlhttpRequest({
      method: "GET",
      url: query,
      onload: function(res) {
        text = eval("(" + res.responseText + ")")[0][0][0];
        try {
          for (x = 1; 5 > x; x++) text += eval("(" + res.responseText + ")")[0][x][0];
        } catch (e) {}
        for (count--; count >= 0; count--) text = text.replace(RegExp('< *a href *= *"' + count + '" *>'), transTags[count]);
        thisObj.html(text + " " + html);
      }
    });
  }
}

function EnSaveValue(e, t, n) {
  if ("" != enUserName && enSyncKey != enValOff) {
    if (void 0 === n && (n = !0), e + t == enSaveUrlLast) return;
    enSaveUrlLast = e + t;
    var a = n ? enEncrypt(t) : LZString.compressToEncodedURIComponent(t), o = enSaveURL + "ID=" + enUserKey(e) + "&value=" + a;
    GM_xmlhttpRequest({
      method: "GET",
      url: o
    });
  }
}

function EnGetValue(e, t, n) {
  if ("" == enUserName && (enUserName = GM_getValue("enCSyncUser", "")), "" != enUserName && enSyncKey != enValOff) {
    void 0 === n && (n = !0);
    var a = "https://dealz.rrr.de/enstyler/load.php?ID=" + enUserKey(e);
    GM_xmlhttpRequest({
      method: "GET",
      url: a,
      onload: function(a) {
        200 === a.status && a.responseText.length > 30 && t(e, n ? enDecrypt(a.responseText) : LZString.decompressFromEncodedURIComponent(a.responseText));
      }
    });
  }
}

function enSetValue(e, t) {
  GM_setValue(e + "", t + "");
}

function enEncrypt(e) {
  return btoa(sjcl.encrypt(enUserKey(""), e));
}

function enDecrypt(e) {
  return sjcl.decrypt(enUserKey(""), atob(e));
}

function enUserKey(e) {
  return enShortKey(enUserName + enSyncKey + e);
}

function enShortKey(e) {
  return ShortURL.encode(parseInt(e.toLowerCase().split("").map(function(e) {
    return "eariotnslcudpmhgbfywkvxzjq".indexOf(e) + 1 || "9876543210".indexOf(e) + 1 || "";
  }).join("")));
}

function getStyle(e, t) {
  if (window.getComputedStyle) try {
    return getComputedStyle(e).getPropertyValue(t);
  } catch (e) {} else if (e.currentStyle) try {
    return e.currentStyle[t];
  } catch (e) {}
  return "";
}

var DEBUG = !0, DEBUGXX = !0, DEBUGXXX = !1, DEBUGINT = !1, enLocParser = location, enInterSite = enLocParser.hostname.replace("www.", ""), enInterName = capitalizeFirstLetter(enInterSite.replace(/^\.|\..*/g, "")), enInter = "Mydealz" != enInterName, enUpdInt = 1440, enMs2Min = 6e4, enTime2Min = enMs2Min, enUserLogin = !1, enUserName = "", enSection = enLocParser.pathname.replace(/\/([^\/]+\/*).*/, "/$1"), enValOff = "off", enSyncKey = enValOff, enAutoSync = !1, isFirefox = "undefined" != typeof InstallTrigger, isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/Linux/i.test(navigator.userAgent) && void 0 !== GM_info.scriptHandler && GM_info.scriptHandler.startsWith("USI") && (isMobile = !0);

var saveLog = "enMobileLog", enDebugLog = console.error, enInitTime;

mobileClearLog();

var enDisableScript = /settings$/, enLangPat = /<EN-LANG:(.*?)>/g, enSiteLANG = void 0 === enSiteConfig[enInterName] ? "en" : enSiteConfig[enInterName].lang, enLANG = enSiteLANG, enHostpath = enLocParser.protocol + "//" + enLocParser.host + enLocParser.pathname, enDealAction = [ '<a title="<EN-LANG:post>" class="space--h-1" style="font-size: xx-large"href="<ENSTYLER-HREF-HERE>#comment-form" data-handler="track" data-track="{&quot;action&quot;:&quot;scroll_to_comment_add_form&quot;,&quot;label&quot;:&quot;engagement&quot;}">+</a>', '<a title="<EN-LANG:remove>"class="space--h-1" style="font-size: x-large"data-handler="track replace" data-replace="{&quot;endpoint&quot;:&quot;https://www.mydealz.de/threads/<ENSTYLER-ID-HERE>/remove&quot;,&quot;method&quot;:&quot;post&quot;}" data-track="{&quot;action&quot;:&quot;save_thread&quot;,&quot;label&quot;:&quot;engagement&quot;}">-</a>', '<a title="<EN-LANG:edit>" class="space--h-1" style="font-size: x-large"href="<ENSTYLER-HREF-HERE>/edit" data-handler="track" data-track="{&quot;action&quot;:&quot;goto_Update startededit_form&quot;,&quot;beacon&quot;:true}"><span>E</a>', '<a title="<EN-LANG:mail>" class="space--h-1" style="font-size: x-large"href="mailto:?subject=<ENSTYLER-TEXT-HERE>" <span class="hide--toW3"><span>M</a>', '<a title="<EN-LANG:mail>" class="btn btn--messenger btn--mail space--ml-2" style="background-color: #69BE28;"href="mailto:?subject=<ENSTYLER-TEXT-HERE>"><span class="ico ico--type-mail-white ico--reduce size--all-xxl"></span><svg width="22px" height="22px" class="icon icon--mail icon-u--1"><use xlink:href="/assets/img/ico_39d8b.svg#mail"></use></svg><span class="space--ml-2"><EN-LANG:mail></span></a>', '<a title="<EN-LANG:telegram>" class="space--h-1" style="font-size: x-large" target="blank"href="https://telegram.me/share/url?url=<ENSTYLER-HREF-HERE>&text=<ENSTYLER-TITLE-HERE>" <span class="hide--toW3"><span>T</a>', '<a title="<EN-LANG:telegram>" class="btn btn--messenger btn--mail space--ml-2" style="background-color: #10a0d0;" target="blank"href="https://telegram.me/share/url?url=<ENSTYLER-HREF-HERE>&text=<ENSTYLER-TITLE-HERE>"><span class="ico ico--type-mail-white ico--reduce size--all-xxl"></span><svg width="17px" height="17px" class="icon icon--external icon-u--1"><use xlink:href="/assets/img/ico_39d8b.svg#external"></use></svg><span class="space--ml-2"><EN-LANG:telegram></span></a>' ], enDealFlame = '<span class="vote-tempIco ico ico--type-flame2-red threadTempBadge-icon" style="position: absolute; display: block; margin-left: .3em; font-size: 2em;"></span>', enDealIce = '<span class="vote-tempIco ico ico--type-snowflake-blueTint threadTempBadge-icon" style="position: absolute; display: block; margin-left: .3em; font-size: 2em;"></span>', enDealMarker = "#thread_", enDealAdd = "", enSocialAdd, enCommentAdd, enDealFooter = "", enCCMail, enMyCSSID, myDealAction, myTouch, myFixHtml, myVotebar, myVotescale, myCompact, myPrice, myDealTime, enClassHidden = "enClassHidden", enClassBlackDone = "enClassBlackDone", enBlacklisted = 0, unwantedRegex = [ /[\[\]\(\)\{\}\?\:\;\!\"\*\+\ ]/g, /[\[\]\(\)\{\}\?\.\:\;\!\"\*\+\,\n\r\t]+/g ], enBlack, enBlackTrue, enWhite, enWhiteTrue, enBlackTemp, myFixedCSS = {
  every: ".enFixedNav { display: block; position: fixed; width: 100%; z-index: 120;} .listingProfile {margin-bottom: -55px}.listingProfile, .subNav, .profileHeader, .tabbedInterface, .splitPage-wrapper {margin-top: 55px}",
  subnav: ".subNav {margin-top: 0 !important;} .nav-subheadline {margin-top: 55px}",
  discus: ".tGrid.page2-center.height--all-full {margin-top: calc(55px + 10px);} #footer .page-content { padding-top: calc(55px + 10px);}"
}, DealDate = new Date(), TodayStart = new Date(), EnstylerTimeSeen = "enTimeSeen", today = "", oclock = "", yesterday = "", enNewestBase = "enNewest" + enInterSite, enSec = enNewestBase + "-" + enSection.replace(/\//, ""), LastSeenOnce = !0, enSeArt = "", enLaArt = "", enUpdateUrl = "https://userstyles.org/styles/128262/enstyler2-style-your-mydealz.css", MyCSS = "Enstyler2_CSS", enCssOpt = "EnstylerCssOpt", enMainSectionMatch = /^\/$|^\/hot$|^\/new$|^\/settings$|^\/discussed$|^\/hei%C3%9F$|^\/diskutiert$/, enHREF = "href", enID = "id", enTEXT = "text", enTITLE = "title", enPATTERN = {
  href: /<ENSTYLER-HREF-HERE>/g,
  id: /<ENSTYLER-ID-HERE>/g,
  text: /<ENSTYLER-TEXT-HERE>/g,
  title: /<ENSTYLER-TITLE-HERE>/g
}, enNavEntry = "enNavEntry", enMenuItemCode = {
  Main: '<a class="space--h-2 lbox--v-4 enNavEntry navMenu-link" id="<ENSTYLER-ID-HERE>" href="<ENSTYLER-HREF-HERE>" data-handler="track" data-track="{&quot;action&quot;:&quot;goto_main_target&quot;,&quot;beacon&quot;:true}"><span class="lbox--h-4"><svg width="24px" height="20px" class="icon icon--comments"></span><ENSTYLER-TEXT-HERE></a>',
  Sub: '<li class="enNavEntry subNavMenu-item--separator test-tablink-discussed"><a  href="<ENSTYLER-HREF-HERE>" class="subNavMenu-item subNavMenu-link space--h-4 vAlign--all-m" id="<ENSTYLER-ID-HERE>" data-handler="track" data-track="{&quot;action&quot;:&quot;goto_menu_target sort&quot;,&quot;label&quot;:&quot;diskutiert&quot;,&quot;beacon&quot;:true}"><span class="box--all-i size--all-xl vAlign--all-m"><ENSTYLER-TEXT-HERE></span><span class="js-vue-container--threadcount" data-handler="vue" data-vue="{&quot;count&quot;:null}"></span></a></li>',
  MainButton: '<a class="space--h-2 lbox--v-4 enNavEntry navMenu-link" id="<ENSTYLER-ID-HERE>"><span class="lbox--h-4"><svg width="24px" height="20px" class="icon icon--comments"></span><ENSTYLER-TEXT-HERE></a>'
}, enNavGrid = '<div id="enButt"><a title="Grid Layout" id="enGrid" href="' + enHostpath + '?layout=grid"><img src="https://dealz.rrr.de/enstyler/grid.png"></a><a title="List Layout" id="enList" href="' + enHostpath + '?layout=horizontal"><img src="https://dealz.rrr.de/enstyler/list.png"></a><a title="Text Layout" id="enText" href="' + enHostpath + '?layout=text"><img src="https://dealz.rrr.de/enstyler/text.png"></a></div>', enNavCSS = "#enGrid, #enList, #enText { padding: 0.5em; } #enButt {left: 3em; top: 1em; padding-left: 4em; display: inline-block;}", enMenuItemLength = enMenuItemCode.length, EnstylerButton = "EnstylerButton", enMenuButton = document.createElement("input");

enMenuButton.type = "button", enMenuButton.setAttribute(enID, "emergency"), enMenuButton.onclick = showEnstylerConfig, enMenuButton.value = "Enstyler", enMenuButton.setAttribute("style", "cursor: pointer; padding-left: 1em; padding-bottom: 0.5em; font-weight: 600; font-size: 10px !important; color: #FFCC00 !important;"), 
enMenuButton.setAttribute("title", "Enstyler Einstellungen");

var enNavIconPat = "#discussion", enAddMain = "", enAddMainFunc = [], enAddMainCount = 0, enAddMainDone = !1, enUpdateWindow, enUnblackText = enLangLocalize("<EN-LANG:unblack> <ENSTYLER-TEXT-HERE> Dealz", enConfigLang, enLANG), enConfDefs = [];

enConfDefs.default = {
  enCSS: {
    label: confLang("configcss"),
    title: confMess("configcss"),
    type: "button",
    click: function() {
      enUpdateWindow = window.open("https://userstyles.org/styles/128262", "UserCSS", "left=0,top=0"), GM_setValue("enLastUpdateCheck", 0);
    }
  },
  enJS: {
    label: confLang("userscript"),
    title: confMess("userscript"),
    type: "button",
    click: function() {
      enUpdateWindow = window.open("https://greasyfork.org/scripts/24243-enstylerjs/code/EnstylerJS.user.js", "UserScript", "width=210,height=210,left=0,top=0"), setTimeout(enUpdateWindow.close, 5e3);
    }
  },
  enCNavF: {
    label: confLang("navfixed"),
    title: confMess("navfixed"),
    type: "checkbox",
    default: !0,
    section: [ confLang("config"), "" ]
  },
  enCMax: {
    label: confLang("max"),
    title: confMess("max"),
    type: "select",
    options: enSiteConfig.width,
    default: "1450"
  },
  enCDealA: {
    label: confLang("dealaction"),
    title: confMess("dealaction"),
    type: "checkbox",
    default: !0
  },
  enCDealVbar: {
    label: confLang("dealvotebar"),
    title: confMess("dealvotebar"),
    type: "select",
    options: enSiteConfig.votescale,
    default: "500"
  },
  enCTouch: {
    label: confLang("touch"),
    title: confMess("touch"),
    type: "checkbox",
    default: !0
  },
  enCWidth: {
    label: confLang("width"),
    title: confMess("width"),
    type: "select",
    options: enSiteConfig.width,
    default: enValOff
  },
  enCPrice: {
    label: confLang("price"),
    title: confMess("price"),
    type: "checkbox",
    default: !1
  },
  enCCompact: {
    label: confLang("compact"),
    title: confMess("compact"),
    type: "checkbox",
    default: !1
  },
  enCCMail: {
    label: confLang("cssdealz"),
    title: confMess("cssdealz"),
    type: "checkbox",
    default: !1
  },
  enCRedirect: {
    label: confLang("redir"),
    title: confMess("redir"),
    type: "checkbox",
    default: !0
  },
  enCPageP: {
    label: confLang("picker"),
    title: confMess("picker"),
    type: "checkbox",
    default: !0
  },
  enCDealT: {
    label: confLang("dealtime"),
    title: confMess("dealtime"),
    type: "checkbox",
    default: !0
  },
  enCFixHtml: {
    label: confLang("fixhtml"),
    title: confMess("fixhtml"),
    type: "checkbox",
    default: !0
  },
  enCBlackC: {
    label: confLang("blacklist"),
    title: confMess("blacklist"),
    type: "select",
    options: enSiteConfig.blackcold,
    default: "-20"
  },
  enConfBlacklist: {
    label: confLang("black"),
    title: confMess("black"),
    type: "text",
    size: 70,
    default: ""
  },
  enConfWhitelist: {
    label: confLang("white"),
    title: confMess("white"),
    type: "text",
    size: 70,
    default: ""
  },
  enCUnblackL: {
    label: confLang("unblack"),
    title: confMess("unblack"),
    type: "button",
    click: EnstylerBlacklistUnhide
  },
  enCLang: {
    label: confLang("lang"),
    title: confMess("lang"),
    type: "select",
    options: enSiteConfig.languages,
    default: "auto"
  }
}, enConfDefs.sync = {
  enCAutoS: {
    label: confLang("autosync"),
    title: confMess("autosync"),
    type: "checkbox",
    section: [ confLang("syncconf"), "" ],
    default: !0
  },
  enCSyncKey: {
    label: confLang("synckey"),
    title: confMess("synckey"),
    type: "text",
    size: 10,
    default: enValOff
  },
  enCSync: {
    label: confLang("sync"),
    title: confMess("sync"),
    type: "button",
    click: function() {
      SyncSettings();
    }
  }
};

var enSaveSettings = [ "enCNavF", "enCDealA", "enCDealVbar", "enCTouch", "enCRedirect", "enCPageP", "enCFixHtml", "enCDealT", "enCBlackC", "enConfBlacklist", "enConfWhitelist", "enCAutoS" ], enGMFrame = document.createElement("div");

enGMFrame.setAttribute("class", "GM_config");

var enGMConfigOpen = !1, enRemConf = [ {
  val: enValOff,
  field: "enCBlackC",
  rem: "enConfWhitelist"
}, {
  val: enValOff,
  field: "enCBlackC",
  rem: "enConfBlacklist"
}, {
  val: enValOff,
  field: "enCBlackC",
  rem: "enCUnblackL"
}, {
  val: enValOff,
  field: "enCSyncKey",
  rem: "enCSync"
}, {
  val: enValOff,
  field: "enCSyncKey",
  rem: "enCAutoS"
} ], enSettings = "enSettings", enShowDate = new Date().toLocaleString("de-DE", {
  hour: "numeric",
  minute: "numeric"
}), enCSS = [ ".card-inner::after {display: none !important} .GM_config {color: white !important; opacity: 0.92 !important; left: 5% !important; height: auto !important; padding-bottom: 10px !important; top: 1.4em !important; box-shadow: 10px 10px 20px black; min-width: 21em; max-width: 40em !important; border-radius: 10px} #enOverDim {background-color: black; z-index: 999; position: fixed; top: 0; right: 0; bottom: 0; left: 0; opacity: 0.5} .GM_config input, .GM_config button, .GM_config textarea { border: 1px solid; margin: 0.5em 0em 0.2em 1em; padding: 0.1em;} .GM_config .reset { font-size: 9pt; padding-right: 1em; } .GM_config .config_header {font-size: 14pt !important; border: none !important; padding: 0.2em; font-weight: bold; text-align: center;} .GM_config .section_header { border: none !important; background-color:#005293 !important; !important; text-align: center; margin-top: 1em;} .GM_config .field_label:hover {color: gray;} .GM_config a:hover {text-decoration: underline; color: darkgray;} .GM_config .config_var {display: inline-block;} .GM_config .field_label {display: inline-block; min-width: 14em;  margin-left: 2em; } .GM_config button, .GM_config input[type=button] { font-weight: bold; text-align: center; color: #fff; background-color:  #58a618 !important; } .GM_config button:hover {background-color: #a5d867 !important; border-color: #a5d867 !important;} .enClassHidden, #EnPopup_closeBtn, .voteBar-- { display: none !important; } .votebar {display: inline-block; position: relative; top: .3em; height: .5em; margin-left: 2.5em; max-width: 80% } .voteBar--warm { background-color:  #ffb612 } .voteBar--hot  { background-color:  #e00034 } .voteBar--burn { background-color:  #e00034 } .voteBar--cold, .voteBar--colder { background-color:: #00a9e0 } .voteBar--cold, .voteBar--colder { background-color: #5bc6e8 } .threadTempBadge { display: none; } .flex--justify-space-between { justify-content: unset !important; }", ".gridLayout { width: unset; max-width: " + GM_getValue("enMax", "") + "px !important;}", ".page2-center, .thread-list--type-list--sideAds, .thread-list--type-list, .listLayout { max-width: " + GM_getValue("enMax", "") + "px !important;}" ].join(" "), extraCSS = "", EnstylerStartTime = Date.now(), input = document.createElement("input");

input.type = "button", input.setAttribute(enID, EnstylerButton), input.onclick = saveEnstylerCSS, input.value = confLang("options");

var enWidth = GM_getValue("enWidth", enValOff);

isMobile && enWidth != enValOff && u("meta[name=viewport]").attr("content", "width=" + enWidth + "px, initial-scale=1");

var enUserScript = {
  detect: /.*?@-moz-document .*?\{\s*/,
  split: /^.*?\{/,
  next: /}\s*@-moz-document.*/
}, enCSSmax = 16100, enGoogleTransURL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=<ENSTYLER-LANG-HERE>&dt=t&q=<ENSTYLER-HTML-HERE>", enMaxTrans = 300, enTransTags = 5, enSaveURL = "https://dealz.rrr.de/enstyler/save.php?", enSaveUrlLast = "", enGMSave = !1;

if (window.location.hostname.endsWith("userstyles.org")) return GM_config.init({
  id: "GM_config",
  fields: {
    saveOpt: {
      type: "textarea"
    }
  },
  frame: enGMFrame
}), setTimeout(enUserstyleDo, 5e3), void ("complete" === document.readyState || "loading" !== document.readyState ? enUserstyleDo() : document.addEventListener("DOMContentLoaded", enUserstyleDo));

var enFixedNavLast = !1;

GM_config.init({
  id: enInter ? "GM_config" + enInterSite : "GM_config",
  title: confLang("headline"),
  fields: Object.assign(enConfDefs.default, enConfDefs.sync, enConfDefs.debug),
  events: {
    init: function() {},
    open: function() {
      enFixedNavLast = GM_config.get("enCNavF"), confLangOpen(), EnstylerSyncIDShow(), u('.GM_config [id$="_enJS_var"]').after(enNavGrid);
      for (var e = 0; e < enRemConf.length; e++) GM_config.get(enRemConf[e].field) == enRemConf[e].val && GM_config.fields[enRemConf[e].rem].remove();
      isMobile || GM_config.fields.enCWidth.remove();
    },
    save: function() {
      SaveSettings(), GM_setValue("enWidth", GM_config.get("enCWidth")), GM_setValue("enMax", GM_config.get("enCMax")), enSyncKey = GM_config.get("enCSyncKey"), enAutoSync = GM_config.get("enCAutoS"), GM_config.close(), 
      showEnstylerConfig(), enGMSave ? window.location.reload() : enGMSave = !0;
    },
    close: function() {
      closeEnstylerConfig(), enCheckUpdates();
    }
  },
  frame: enGMFrame
}), enSyncKey = GM_config.get("enCSyncKey"), enAutoSync = GM_config.get("enCAutoS"), "auto" != GM_config.get("enCLang") && (enLANG = GM_config.get("enCLang")), window.eval("window['ga-disable-UA-2467049-1'] = true;"), 
WaitForBody();
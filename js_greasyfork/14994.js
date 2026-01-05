// ==UserScript==
// @name        WtW Enhancement Suite
// @namespace   Javascript
// @description Offers new features and numerous tweaks for the WiththeWill Digimon Forums. Made by Theigno.
// @include     http://withthewill.net/*
// @include     https://withthewill.net/*
// @version     1.2.4.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14994/WtW%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/14994/WtW%20Enhancement%20Suite.meta.js
// ==/UserScript==
var scriptovers = "1.2.4.1";

function oldCheck() {
   var nameEQ = "compaMode=";
   var ca = document.cookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
   }
   return null;
}

function treatAsUTC(date) {
   var result = new Date(date);
   result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
   return result;
}

function daysBetween(startDate, endDate) {
   var millisecondsPerDay = 24 * 60 * 60 * 1000;
   return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

function datinator(prodate) {
   var findate;
   if (prodate == "Yesterday" || prodate == "Today") {
      findate = new Date();
      findate.setDate(findate.getDate() - 1);
   } else {
      var mons = 0;
      var dato = prodate.split("-");
      if (dato[0] == "01") {
         mons = "January"
      }
      if (dato[0] == "02") {
         mons = "February"
      }
      if (dato[0] == "03") {
         mons = "March"
      }
      if (dato[0] == "04") {
         mons = "April"
      }
      if (dato[0] == "05") {
         mons = "May"
      }
      if (dato[0] == "06") {
         mons = "June"
      }
      if (dato[0] == "07") {
         mons = "July"
      }
      if (dato[0] == "08") {
         mons = "August"
      }
      if (dato[0] == "09") {
         mons = "September"
      }
      if (dato[0] == "10") {
         mons = "October"
      }
      if (dato[0] == "11") {
         mons = "November"
      }
      if (dato[0] == "12") {
         mons = "December"
      }
      findate = Date.parse(mons + " " + dato[1] + ", " + dato[2])
   }
   return findate
}

function readCookie(Cname, old) {
   function readLocal(name) {
      return localStorage.getItem(name);
   }

   function readCook(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) == ' ') c = c.substring(1, c.length);
         if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
   }
   if (old || oldCheck() !== null) {
      return readCook(Cname);
   } else {
      return readLocal(Cname);
   }
}

function createCookie(Cname, Cval, Cexp, old) {
   function createLocal(name, value) {
      localStorage.setItem(name, value);
   }

   function createCook(name, value, days) {
      var expires = "";
      if (days !== 0) {
         var date = new Date();
         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
         expires = "; expires=" + date.toUTCString();
      } else {
         var minu = new Date();
         minu.setTime(minu.getTime() + (20 * 60 * 1000));
         expires = "; expires=" + minu.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
   }
   if (old || readCookie('compaMode', 1) !== null) {
      createCook(Cname, Cval, Cexp);
   } else {
      createLocal(Cname, Cval);
   }
}

function eraseCookie(Cname, old) {
   function eraseLocal(name) {
      localStorage.removeItem(name);
   }

   function eraseCook(name) {
      createCookie(name, "", -1, 1);
   }
   if (old || readCookie('compaMode', 1) !== null) {
      eraseCook(Cname);
   } else {
      eraseLocal(Cname);
   }
}
var mulpySheet = (function() {
   var style = document.createElement("style");
   style.appendChild(document.createTextNode(""));
   document.head.appendChild(style);
   return style.sheet;
})();

function addCSSRule(sheet, selector, rules, index) {
   if ("insertRule" in sheet) {
      sheet.insertRule(selector + "{" + rules + "}", index);
   } else if ("addRule" in sheet) {
      sheet.addRule(selector, rules, index);
   }
}

function storageAvailable(type) {
   try {
      var storage = window[type],
         x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
   } catch (e) {
      return false;
   }
}
if (storageAvailable('localStorage')) {
   console.log("Local Storage capabilities detected");
} else {
   if (readCookie("storFail", 1) === null) {
      alert("Local storage seems to be either disabled or unsupported.\n if you can't find a way to turn it on, you should use the cookie based version of this script.");
      createCookie("storFail", "1", 500, 1);
   }
}

function unhidify() {
   if (readCookie("deHide") === null) {
      return
   }
   var hidType = document.querySelectorAll("[type=hidden]");
   var hidClass = document.getElementsByClassName("hidden");
   for (var i = 0; i < hidClass.length; ++i) {
      hidClass[i].className = hidClass[i].className.replace(/hidden/, "");
   }
   for (var i = 0; i < hidType.length; ++i) {
      var perant = hidType[i].parentNode;
      var posi = 0;
      for (var n = 0; n < perant.childNodes.length; n++) {
         if (perant.childNodes[n] == hidType[i]) {
            posi = n;
            break;
         };
      };
      var wrapser = document.createElement('div')
      wrapser.className = "hidWrap";
      var wrupser = document.createElement('div')
      wrupser.className = "hidWrup";
      wrupser.textContent = hidType[i].name + "\n";
      wrapser.appendChild(wrupser);
      wrapser.appendChild(hidType[i]);
      hidType[i].removeAttribute("type");
      perant.insertBefore(wrapser, perant.childNodes[posi])
   }
}

function unNotice() {
   if (readCookie("disNotice") === null) {
      return;
   }
   if (document.getElementById("notices")) {
      var notLi = document.getElementById("notices").getElementsByTagName('li');
      for (var i = 0; i < notLi.length; ++i) {
         if (/If you are having issues getting a recovery password, registering or anything else, hit the Contact button or email godofchaos@gmail\.com/.test(notLi[i].textContent) || /If this is your first visit, be sure to\n\t\tcheck out the FAQ by clicking the\n\t\tlink above\. You may have to register\n\t\tbefore you can post: click the register link above to proceed\. To start viewing messages,\n\t\tselect the forum that you want to visit from the selection below\./.test(notLi[i].textContent)) {
            notLi[i].style.display = "none";
         }
      }
   }
}

function defaultSettings() {
   if (readCookie("optInvoke") !== null) {
      return;
   }
   var cookList = [
      {
         name: "uniFix",
         Cval: 1
    },
      {
         name: "fixQuote",
         Cval: 1
    },
      {
         name: "deClutter",
         Cval: 1
    },
      {
         name: "aktiv",
         Cval: 1
    },
      {
         name: "optInvoke",
         Cval: 1
    },
      {
         name: "searchRep",
         Cval: 1
    },
      {
         name: "directSearch",
         Cval: 1
    },
      {
         name: "BannerCB",
         Cval: 1
    },
      {
         name: "BannerCent",
         Cval: 1
    },
      {
         name: "aKey0",
         Cval: 4
    },
      {
         name: "aLink0",
         Cval: "search\\.php(\\?(?!do).+)?$"
    },
      {
         name: "aMode0",
         Cval: "r"
    },
      {
         name: "aKey1",
         Cval: 9
    },
      {
         name: "aLink1",
         Cval: "https://withthewill.net/sendmessage.php"
    },
      {
         name: "aMode1",
         Cval: "l"
    },
      {
         name: "aKey2",
         Cval: 3
    },
      {
         name: "aLink2",
         Cval: "printthread.php"
    },
      {
         name: "aMode2",
         Cval: "w"
    },
      {
         name: "dKey0",
         Cval: "S"
    },
      {
         name: "dLink0",
         Cval: "Submit Buttons"
    },
      {
         name: "dMode0",
         Cval: "s"
    },
      {
         name: "dKey1",
         Cval: "X"
    },
      {
         name: "dLink1",
         Cval: "Advanced reply"
    },
      {
         name: "dMode1",
         Cval: "x"
    },
      {
         name: "dKey2",
         Cval: "C"
    },
      {
         name: "dLink2",
         Cval: "Cancel"
    },
      {
         name: "dMode2",
         Cval: "c"
    },
      {
         name: "dKey3",
         Cval: "R"
    },
      {
         name: "dLink3",
         Cval: "Reset Fields"
    },
      {
         name: "dMode3",
         Cval: "r"
    },
      {
         name: "disCount",
         Cval: 1
    },
      {
         name: "accAble",
         Cval: 1
    },
      {
         name: "linkShort",
         Cval: 1
    }];
   for (var i = 0; i < cookList.length; ++i) {
      createCookie(cookList[i].name, cookList[i].Cval, 500);
   }
}

function isElementInViewport(el) {
   var rect = el.getBoundingClientRect();
   return (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */ rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */ );
}

function cssOverride() {
   addCSSRule(mulpySheet, "#finishT", "height: 50px; font-size: 18px; font-weight: bold;");
   addCSSRule(mulpySheet, "#finishT", "text-align: center");
   addCSSRule(mulpySheet, "#exportation, #importation", "display: block");
   addCSSRule(mulpySheet, "#importation", "float:left;");
   addCSSRule(mulpySheet, "#exportation", "margin-bottom:5px;");
   addCSSRule(mulpySheet, ".indentPut", "margin: 0 0 10px 20px !important;");
   addCSSRule(mulpySheet, ".downgin", "margin-bottom: 30px !important;", 1);
   addCSSRule(mulpySheet, ".standard_error.theigedit", "position: relative; z-index: 40000; width:220px; text-align: center; padding: 0;");
   if (readCookie('noShad') === null) {
      addCSSRule(mulpySheet, ".standard_error.theigedit", "box-shadow: -2px 6px 10px rgba(0, 0, 0, 0.6);");
   }
   addCSSRule(mulpySheet, '#globalsearch, .navbar_advanced_search li,  .navbar_advanced_search', 'pointer-events:none;');
   addCSSRule(mulpySheet, '.navbar_advanced_search li *, #globalsearch form', 'pointer-events:auto;');
   addCSSRule(mulpySheet, ".genContain", "background-color: transparent; z-index: 40000; width:0; height:0; position: fixed; top: 20%; right:240px;");
   addCSSRule(mulpySheet, ".nonsticky.theigedit", "width:100px; height: 200px;");
   addCSSRule(mulpySheet, ".newcontent_textcontrol.theigedit", " width:200px; height: 50px;");
   addCSSRule(mulpySheet, "#cbBox label input", "float:Left; width:20px");
   addCSSRule(mulpySheet, "#cbBox label", "float:Left; width:95px; margin-top: 10px");
   addCSSRule(mulpySheet, "#cbBox label:nth-child(2)", "width:125px;");
   addCSSRule(mulpySheet, "#cutoffBut", "margin-top: 5px; padding: 3px");
   addCSSRule(mulpySheet, ".ish_inquisition, #bulkySpan", "display: table; position: absolute; width: 100%; text-align: center;");
   addCSSRule(mulpySheet, ".ish_inquisition b", "color: #BBB;");
   addCSSRule(mulpySheet, '#kripp', 'font-weight:bold; color: #666; float:left; margin: 5px 20px 0 0;');
   addCSSRule(mulpySheet, ".ish_inquisition b", "color: #BBB;");
   addCSSRule(mulpySheet, ".globalsearch .textboxcontainer", "float: none !important;");
   addCSSRule(mulpySheet, ".globalsearch input.textbox", "float: right !important;");
   addCSSRule(mulpySheet, "#colTog", "float: right; margin-top: 1px;");
   addCSSRule(mulpySheet, ".defRow", "background: #333;");
   addCSSRule(mulpySheet, "#keyTable .normRow, #userTable .normRow, .normRow td, #keyTable .defRow, #userTable .defRow , .defRow td", "border: 1px solid grey; padding:5px;");
   addCSSRule(mulpySheet, "#keyTable .firstRow td, #userTable .firstRow td", "border: 1px solid grey; padding:4px;");
   addCSSRule(mulpySheet, "#keyTable, #userTable", "width: 120%; margin-bottom: 15px; text-align: center; background:#222; position: relative; left:-25%;");
   addCSSRule(mulpySheet, "#keyTable .normRow td:nth-child(3), #keyTable .defRow td:nth-child(3),  #userTable .normRow td:nth-child(4), #userTable .defRow td:nth-child(4)", 'cursor:pointer; background: no-repeat url("https://withthewill.net/images/wtwstyle/cms/edit_small.png") center');
   addCSSRule(mulpySheet, "#keyTable .normRow td:nth-child(4), #userTable .normRow td:nth-child(5)", 'cursor:pointer; background: no-repeat url("https://withthewill.net/images/wtwstyle/cms/delete_small.png") center');
   addCSSRule(mulpySheet, ".siteicon_forum.theigedit", 'cursor:pointer; background-image: url(https://withthewill.net/images/wtwstyle/buttons/edit_40b-hover.png)!important;');
   addCSSRule(mulpySheet, "#keyTable .normRow td:nth-child(4):hover,#keyTable .defRow td:nth-child(3):hover , #userTable .normRow td:nth-child(5):hover, #keyTable .normRow td:nth-child(3):hover, #userTable .normRow td:nth-child(4):hover", "background-color:#bbb !important;");
   addCSSRule(mulpySheet, "#whoposted .posterlist .blockrow:nth-child(even)", "background-color:#E0EFE8 ");
   addCSSRule(mulpySheet, "#whoposted .posterlist .stats dt", "display: none !important;");
   addCSSRule(mulpySheet, "#whoposted  .posterlist .blockrow:hover *", "color:#236ABF !important;");
   addCSSRule(mulpySheet, "#linkMode", "margin: 0 15px 10px 0;");
   addCSSRule(mulpySheet, "#bulkySpan label", "font-size: 11px; margin:  7px   !important;");
   addCSSRule(mulpySheet, '#bulkySpan input[type="checkbox"]', "margin-left: 5px  !important; transform: translate(0,3px);");
   addCSSRule(mulpySheet, '#bulkySpan input[type="button"]', "margin-left: 5px; margin-top: -3px; height:23px;");
   addCSSRule(mulpySheet, '#bulkySpan', "width:60% !important;");
   addCSSRule(mulpySheet, '.blockrow input', "transform: translate(0,2px);");
   addCSSRule(mulpySheet, '#dragWrap', 'position:fixed; top: 0px; right:0px');
   addCSSRule(mulpySheet, '#quickreply_title a.cillapse, .forumhead h2 a.cillapse, form .blockhead a.cillapse, h3 a.cillapse, h2.blockhead .cillapse', 'position:static; float:right; margin-right:-5px;');
   addCSSRule(mulpySheet, '.forumhead h2 a.cillapse', 'top:0px;');
   addCSSRule(mulpySheet, '.threadlisthead a.cillapse', 'top:5px; float:right; right:13px; position:absolute;');
   addCSSRule(mulpySheet, '.hidWra', 'display:inline-block; width:140px;');
   addCSSRule(mulpySheet, '.searchliststats  a.cillapse, #usercp_nav a.cillaps', 'left:20px; position:absolute');
   addCSSRule(mulpySheet, '#wgo a.cillapse', 'float:right; position:absolute; right:5px;');
   addCSSRule(mulpySheet, '#above_who_online + .block .blockbody', 'overflow-x:auto');
   addCSSRule(mulpySheet, '.threadinfohead a.cillapse', 'position:absolute; float:right; right:5px');
   if (readCookie('hovState') !== null) {
      addCSSRule(mulpySheet, ".forumbit_post:hover .forumrow, .threadbit:hover .sticky, .threadbit:hover .nonsticky, .threadbit:hover .threadstats, .threadbit:hover .threadpostedin", "background-color:#4C4C4C !important; transition:-webkit-transition: background-color ease 0.3s; -moz-transition: background-color ease 0.3s; -o-transition: background-color ease 0.3s; transition: background-color ease 0.3s;");
      addCSSRule(mulpySheet, ".forumbit_post .forumrow, .threadbit .sticky,.threadbit .nonsticky, .threadbit .threadstats, .threadbit .threadpostedin", "-webkit-transition: background-color ease 0.5s; -moz-transition: background-color ease 0.5s; -o-transition: background-color ease 0.5s; transition: background-color ease 0.5s;");
      addCSSRule(mulpySheet, ".postuseravatar img:hover", "box-shadow: 0px 0px 18px #fff !important; transform: scale(0.95,0.95); transition: all ease 0.5s;");
      addCSSRule(mulpySheet, ".postuseravatar img", "transition: all ease 0.3s !important;");
      addCSSRule(mulpySheet, 'img[src*="images/wtwstyle/statusicon/forum_new-48.png"] ', "-webkit-transition: all ease 0.3s; -moz-transition: all ease 0.3s; -o-transition: all ease 0.3s; transition: all ease 0.3s;");
      addCSSRule(mulpySheet, 'img[src*="images/wtwstyle/statusicon/forum_new-48.png"]:hover ', "-webkit-transition: all ease 0.3s; -moz-transition: all ease 0.3s; -o-transition: all ease 0.3s; transition: all ease 0.3s; transform: rotate(-5deg); filter: drop-shadow(0px 0px 5px #B2F6F7);");
   }
   if (readCookie("Swidth") !== null && readCookie("Shover") !== null) {
      if (document.querySelectorAll(".globalsearch input.textbox").length !== 0) document.querySelectorAll(".globalsearch input.textbox")[0].required = true;
      addCSSRule(mulpySheet, ".globalsearch input.textbox:focus", "width: " + readCookie("Swidth") + "px !important; -webkit-transition: width ease 0.3s ; -moz-transition: width ease 0.3s ; -o-transition: width ease 0.3s ; transition: width ease 0.3s ;");
      addCSSRule(mulpySheet, ".globalsearch input.textbox:valid", "width: " + readCookie("Swidth") + "px !important; -webkit-transition: width ease 0.3s ; -moz-transition: width ease 0.3s ; -o-transition: width ease 0.3s ; transition: width ease 0.3s ;");
      addCSSRule(mulpySheet, ".globalsearch input.textbox:hover", "width: " + readCookie("Swidth") + "px !important; -webkit-transition: width ease 0.3s ; -moz-transition: width ease 0.3s ; -o-transition: width ease 0.3s ; transition: width ease 0.3s ;");
      addCSSRule(mulpySheet, ".globalsearch input.textbox:invalid", "box-shadow: 0px 0px 0px transparent !important;");
      addCSSRule(mulpySheet, ".globalsearch input.textbox", "-webkit-transition: width ease 0.3s ; -moz-transition: width ease 0.3s ; -o-transition: width ease 0.3s ; transition: width ease 0.3s ;");
   } else if (readCookie("Swidth") !== null && readCookie("Shover") === null) {
      addCSSRule(mulpySheet, ".globalsearch input.textbox", "width: " + readCookie("Swidth") + "px !important;");
   }
   if (readCookie("rAlign") !== null) {
      addCSSRule(mulpySheet, ".globalsearch input.textbox", "text-align: right !important;");
   }
   if (readCookie("plainAva") !== null) {
      addCSSRule(mulpySheet, ".postuseravatar > img", "-webkit-transition: all ease 0.3s; -moz-transition: all ease 0.3s; -o-transition: all ease 0.3s; transition: all ease 0.3s;");
      if (readCookie("keepBorder") !== null) {
         addCSSRule(mulpySheet, ".postuseravatar > img", "box-shadow: 0 0 0 transparent !important;");
      } else {
         addCSSRule(mulpySheet, ".postuseravatar > img", "border: none !important; box-shadow: 0 0 0 transparent !important;");
      }
   }
   addCSSRule(mulpySheet, ".standard_error.theigedit div div form div label", "display: inline");
   addCSSRule(mulpySheet, ".standard_error.theigedit div div form div input", "width: 50px; text-align:center;");
   addCSSRule(mulpySheet, ".standard_error.theigedit div div form div ", "margin-bottom: 5px");
   addCSSRule(mulpySheet, ".standard_error.theigedit div div form div + div", "margin-bottom: 10px");
   addCSSRule(mulpySheet, ".lowerCut, .upperCut", "display: none !important;");
   addCSSRule(mulpySheet, "#groupstats dl.stats dt", "width: 80% !important;");
   addCSSRule(mulpySheet, "#groupstats dl.stats  dd", "width: auto !important;");
   addCSSRule(mulpySheet, " #membersblock ul.blockrow li", "word-break: break-all;");
   if (readCookie("deClutter") !== null) {
      addCSSRule(mulpySheet, "#groupstats .stats:nth-child(3),  #groupstats .stats:nth-child(4) ", "display:none !important");
      addCSSRule(mulpySheet, 'a[name="faq_vb3_albums"] + div ', "display:none !important");
      addCSSRule(mulpySheet, 'a[name="faq_vb3_rss_podcasting"] + div ', "display:none !important");
   }
   if (readCookie("EditGen") !== null) {
      if (readCookie("quickVB") !== null) {
         addCSSRule(mulpySheet, "#cke_contents_vB_Editor_QR_editor", "height: " + readCookie("quickVB") + "px !important");
      }
      if (readCookie("fullVB") !== null) {
         addCSSRule(mulpySheet, "#cke_contents_vB_Editor_001_editor", "height: " + readCookie("fullVB") + "px !important");
      }
   }
   if (readCookie("trigShad") !== null && readCookie("ShadAni") === null) {
      addCSSRule(mulpySheet, ".main_logo img", "box-shadow: 0px 0px 25px " + readCookie("shadCol") + " !important");
      addCSSRule(mulpySheet, ".main_logo img", "border: 0 !important");
      addCSSRule(mulpySheet, ".main_logo img", "-webkit-transition: all ease 1s; -moz-transition: all ease 1s; -o-transition: all ease 1s; transition: all ease 1s;");
   } else if (readCookie("trigShad") !== null && readCookie("ShadAni") !== null) {
      addCSSRule(mulpySheet, ".main_logo img", "box-shadow: 0px 0px 15px " + readCookie("shadCol") + " !important");
      addCSSRule(mulpySheet, ".main_logo img", "border: 0 !important");
      addCSSRule(mulpySheet, ".main_logo img", "-webkit-transition: all ease 1s; -moz-transition: all ease 1s; -o-transition: all ease 1s; transition: all ease 1s;");
      addCSSRule(mulpySheet, ".main_logo img:hover", "box-shadow: 0px 0px 25px 10px " + readCookie("shadCol") + " !important");
      addCSSRule(mulpySheet, ".main_logo img:hover", "-webkit-transition: all ease 1s; -moz-transition: all ease 1s; -o-transition: all ease 1s; transition: all ease 1s;");
   }
   if (readCookie("postAlterna") !== null) {
      addCSSRule(mulpySheet, ".postcontrols", "float:right !important; position: absolute; width: auto !important; right: 0px; left: 205px");
      addCSSRule(mulpySheet, ".postcontrols *", "margin: 0px 15px 0px 15px !important;");
      addCSSRule(mulpySheet, "a.editpost", "float:left; margin: 0 !important;");
   }
   if (readCookie("BannerCent") !== null) {
      addCSSRule(mulpySheet, ".main_logo img", "max-width:100% !important;");
   }
   if (readCookie("postAlterna") !== null) {
      addCSSRule(mulpySheet, ".understate:hover", "font-weight: bold;");
      addCSSRule(mulpySheet, ".threadstats .understate", "text-decoration: underline !important;");
   }
   if (readCookie("spoilMe") !== null) {
      addCSSRule(mulpySheet, '.postcontent span[style="color: #000000; background-color: #000000; text-shadow: none;"]', 'color:inherit !important;');
   }
   if (readCookie("statWin") !== null) {
      if (/misc\.php\?do=whoposted/.test(window.location.href)) {
         addCSSRule(mulpySheet, ".blockfoot a", "color:#FFF !important;");
         addCSSRule(mulpySheet, "body", "width: 583px !important; margin: 0 auto !important; -webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; transform-style: preserve-3d;");
         addCSSRule(mulpySheet, "a", "color: #677F7E !important");
         document.body.getElementsByClassName('blockfoot')[0].getElementsByTagName('a')[0].textContent = "Show Thread";
         var bit = document.body.getElementsByClassName('posterlist')[0].getElementsByClassName('stats');
         for (var i = 0; i < bit.length; ++i) {
            if (bit[i].getElementsByTagName('a').length === 0) {
               continue;
            }
            bit[i].getElementsByTagName('a')[0].textContent = "Posts: " + bit[i].getElementsByTagName('a')[0].textContent;
         }
      }
   }
}

function collaTog(mainBlock, colBut, secBlock) {
   if (readCookie(mainBlock.id + "lapsed") === null) {
      mainBlock.style.display = "none";
      if (secBlock) {
         secBlock.style.display = "none";
      }
      colBut.getElementsByTagName("img")[0].src = "images/wtwstyle/buttons/collapse_40b_collapsed.png";
      createCookie(mainBlock.id + "lapsed", 1, 500);
   } else {
      mainBlock.removeAttribute("style");
      if (secBlock) {
         secBlock.removeAttribute("style");
      }
      colBut.getElementsByTagName("img")[0].src = "images/wtwstyle/buttons/collapse_40b.png";
      eraseCookie(mainBlock.id + "lapsed");
   }
}

function adcolla(colget, colcont, colget2) {
   var imstring = "images/wtwstyle/buttons/collapse_40b.png"
   if (readCookie(colget.id + "lapsed") !== null) {
      colget.style.display = "none";
      imstring = "images/wtwstyle/buttons/collapse_40b_collapsed.png"
      if (colget2) {
         colget2.style.display = "none";
      }
   }
   var general = document.createElement("a");
   general.className = "cillapse" + " cillapse_" + colget.id;
   //general.id= "cillapse_"+colget.id;
   general.href = window.location.href.split("#")[0] + "#top";
   var generimg = document.createElement('img');
   generimg.src = imstring;
   general.appendChild(generimg);
   colcont.appendChild(general);
   general.addEventListener("click", function() {
      collaTog(colget, this, colget2)
   }, false);
}

function bodyRep() {
   var i;
   if (readCookie("linkShort") !== null) {
      var thrdLink = document.querySelectorAll('a[href*="threads/"]');
      var membLink = document.querySelectorAll('a[href*="members/"]');
      for (i = 0; i < thrdLink.length; ++i) {
         thrdLink[i].href = thrdLink[i].href.replace(/\/([0-9]+)-[^?\/#]+/, "/$1");
      }
      for (i = 0; i < membLink.length; ++i) {
         membLink[i].href = membLink[i].href.replace(/\/([0-9]+)-[^?\/#]+/, "/$1");
         if (readCookie("aboutMem") !== null) membLink[i].href = membLink[i].href.replace(/members\/([0-9]+)$/, "members\/$1?tab=aboutme#aboutme");
      }
   }
   if (readCookie("wioNum") !== null) {
      var whoOnline = document.querySelectorAll('a[href*="online.php"]');
      for (i = 0; i < whoOnline.length; ++i) {
         whoOnline[i].href = whoOnline[i].href.replace(/will\.net\/online\.php$/, "will.net/online.php?s=&sortfield=username&sortorder=asc&who=all&ua=1&pp=" + readCookie("wioNum"));
      }
   }
   if (readCookie("settLink") !== null) {
      var CPlink = document.querySelectorAll('a[href*="usercp.php"]');
      CPlink[0].textContent = "Subscription Overview";
      var contLi = document.createElement('li');
      var realSet = document.createElement('a');
      realSet.textContent = "Settings";
      realSet.href = "https://withthewill.net/profile.php?do=editoptions";
      contLi.appendChild(realSet);
      var parLi = document.getElementsByClassName('isuser')[0];
      var sibLi = parLi.querySelectorAll('.isuser li:nth-child(3)')[0];
      parLi.insertBefore(contLi, sibLi);
   }
   if (readCookie("memliNum") !== null) {
      var memList = document.querySelectorAll('a[href*="memberlist.php"]');
      for (i = 0; i < memList.length; ++i) {
         memList[i].href = memList[i].href.replace(/will\.net\/memberlist\.php$/, "will.net/memberlist.php?pp=" + readCookie("memliNum"));
      }
   }
   if (readCookie("deClutter") !== null) {
      if (/will\.net\/group\.php\?groupid\=[0-9]+/.test(window.location.href)) {
         document.getElementById('menu-grouptools').querySelectorAll('a[href*="&do=message"]')[0].parentNode.style.display = "none";
         document.getElementById('menu-grouptools').querySelectorAll('a[href*="&do=grouppictures"]')[0].parentNode.style.display = "none";
         document.getElementById('menu-grouptools').querySelectorAll('a[href*="&do=markread"]')[0].parentNode.style.display = "none";
      }
      if ((/will\.net\/group\.php\?cat\=[0-9]+/.test(window.location.href)) || (/will\.net\/group\.php\?do=grouplist/.test(window.location.href))) {
         document.getElementsByClassName('threadlastpost')[0].getElementsByTagName('a')[0].textContent = "Date Created";
         document.getElementsByClassName('threadstats')[0].querySelectorAll('a[href*="group.php?do=grouplist&sort=discussions"]')[0].style.display = "none";
         document.querySelectorAll('a[href*="groupsubscription.php"]')[0].style.display = "none";
         var mirks = document.getElementsByClassName('threadstats');
         for (i = 0; i < mirks.length; ++i) {
            mirks[i].innerHTML = mirks[i].innerHTML.replace(/\/\n/g, "");
         }
         var murks = document.getElementsByClassName('lastpostby');
         for (i = 0; i < murks.length; ++i) {
            murks[i].className = "lastpostby";
            murks[i].style.marginRight = "5px";
         }
         var marks = document.getElementsByClassName('stats');
         for (i = 0; i < marks.length; ++i) {
            if ((/Messages/.test(marks[i].textContent)) || (/Discussions/.test(marks[i].textContent))) marks[i].textContent = "";
         }
      }
      if (/will.net\/faq\.php\?faq=vb3_board_faq/.test(window.location.href)) {
         var mork = document.getElementsByClassName('faqlinks');
         mork[0].querySelectorAll('a[href*="faq.php?faq=vb3_board_usage#faq_vb3_rss_podcasting"]')[0].style.display = "none";
         mork[1].querySelectorAll('a[href*="faq.php?faq=vb3_user_profile#faq_vb3_albums"]')[0].style.display = "none";
      }
   }
   if (readCookie("searchRep") !== null && (!/will\.net\/search\.php\?search_type=1/.test(window.location.href))) {
      var sLink = document.querySelectorAll('a[href*="search.php"]');
      for (i = 0; i < sLink.length; ++i) sLink[i].href = sLink[i].href.replace(/search\.php$/, "search.php?search_type=1#ads=1");
   }
   if (readCookie("staffStuff") !== null) {
      var stPic = document.querySelectorAll('img[src="images/ranks/rank-staff.png"]');
      for (i = 0; i < stPic.length; ++i) stPic[i].src = "https://i.imgur.com/CAnZBBR.png";
   }
   if (readCookie("pReset") !== null) {
      var pCountNode = document.getElementsByClassName('nodecontrols');
      for (i = 0; i < pCountNode.length; ++i) {
         if (pCountNode[i].getElementsByClassName("iepostcounter").length !== 0) pCountNode[i].getElementsByClassName("iepostcounter")[0].textContent = "#" + (i + 1);
      }
   }
   if (readCookie("statWin") !== null) {
      var statt = document.querySelectorAll(".threadstats .understate");
      for (i = 0; i < statt.length; ++i) {
         statt[i].setAttribute("onclick", "");
      }
   }
}

function expandStats() {
   if (readCookie("ownStats" === null)) {
      return;
   }
   var statli = document.getElementsByClassName('threadstats');
   for (var i = 0; i < statli.length; ++i) {
      if (statli[i].title.match(/^You have ([0-9]+) post\(s\) in this thread/)) {
         var gnomic = document.createElement('li');
         gnomic.textContent = "Own Posts: ";
         var hold = statli[i].getElementsByClassName("understate")[0].href.split("=")[2];
         var hald = document.getElementsByClassName("welcomelink")[0].getElementsByTagName("a")[0].href.split(/\/|\?/)[4];
         var gnimic = document.createElement('a');
         gnimic.href = "https://withthewill.net/search.php?do=finduser&userid=" + hald + "&searchthreadid=" + hold + "&contenttype=vBForum_Post&showposts=1";
         gnimic.className = "understate";
         gnimic.textContent = statli[i].title.replace(/^You have ([0-9]+) post.+$/, "$1");
         gnomic.appendChild(gnimic);
         statli[i].appendChild(gnomic);
      }
   }
}

function replyRino() {
   if (window.location.pathname.split('/')[1] !== "threads" && window.location.pathname.split('/')[1] !== "newreply.php" && window.location.pathname.split('/')[1] !== "editpost.php" && !/private\.php\?do=(showpm|insertpm|newpm)/.test(window.location.href) && window.location.pathname.split('/')[1] !== "newthread.php") {
      return;
   }

   function prevlink() {
      var revy = document.getElementById("postlist");
      var postlist = revy.getElementsByClassName("postbit")
      for (var i = 0; i < postlist.length; ++i) {
         var heads = postlist[i].getElementsByClassName("header")[0]
         heads.innerHTML = '<a href="threads/' + window.location.href.split("=")[window.location.href.split("=").length - 1] + "?p=" + postlist[i].id.replace(/[^0-9]/g, "") + "&viewfull=1#post" + postlist[i].id.replace(/[^0-9]/g, "") + '">' + heads.innerHTML + "</a>";
      }
   }
   if (window.location.pathname.split('/')[1] == "newreply.php" && readCookie("prevLinks") !== null) {
      prevlink()
   }

   function subLinkPrev() {
      if (readCookie("subLinking") === null || /threads\//.test(window.location.href) || document.getElementsByClassName("postcontainer").length === 0) {
         return;
      }
      var halodri = document.getElementsByClassName("postcontainer")[0];
      var striga;
      var proto;
      var protolink;
      var idstring;
      var exQoute;
      var mondor;

      function neutralize(targetList) {
         for (var i = 0; i < targetList.length; ++i) {
            var divli = targetList[i].getElementsByTagName("div");
            for (var d = 0; d < divli.length; ++d) {
               divli[d].className += " nolink";
            }
         }
      }

      function marchOn(proto, elem) {
         for (var i = 0; i < elem.length; ++i) {
            if (elem[i].firstElementChild.style.textAlign == "left" && (elem[i].textContent.trim().length) - (elem[i].firstElementChild.textContent.trim().length) === 0 && !/nolink/.test(elem[i].className)) {
               idstring = elem[i].textContent.match(/\w+/)[0] + "-" + proto;
               elem[i].title = idstring;
               if (elem[i].style.textAlign == "right") {
                  elem[i].id = idstring;
               } else {
                  elem[i].firstElementChild.innerHTML = '<a href="' + location.href.split("#")[0] + "#" + idstring + '">' + elem[i].firstElementChild.innerHTML + '</a>';
               }
            }
         }
      }
      proto = "link";
      protolink = window.location.href;
      striga = halodri.querySelectorAll('div[style="text-align: right;"]');
      mondor = halodri.querySelectorAll('div[style="text-align: center;"]');
      exQuote = halodri.getElementsByClassName('quote_container');
      neutralize(exQuote);
      marchOn(proto, striga);
      marchOn(proto, mondor);
   }
   subLinkPrev();
   if (readCookie('repRed') === null) {
      return;
   }

   function showerino(valures, elema) {
      var maxNum = 20000;
      if (/private\.php\?do=(showpm|insertpm|newpm)/.test(window.location.href)) {
         maxNum = 5000;
      }
      var voptimize = valures.trim().replace(/[^\r](?=(\n|\r))/g, "aa").length;
      if (document.getElementById("kripp") !== null) {
         document.getElementById("kripp").textContent = "Number of characters: " + voptimize;
         if (voptimize > maxNum) elema.style.backgroundColor = "#F47373";
         else elema.style.backgroundColor = "#fff";
      }
   }

   function detectino() {
      var roleBox = document.querySelectorAll('textarea[role="textbox"]');
      if (roleBox.length === 0) {
         var arrian = document.getElementById("kripp");
         if (arrian !== null) {
            arrian.parentNode.removeChild(arrian);
         }
         return;
      }
      roleBox[0].addEventListener('input', function() {
         showerino(this.value, this);
      }, false);
      var valliMax = 20000;
      if (/private\.php\?do=(showpm|insertpm|newpm)/.test(window.location.href)) {
         valliMax = 5000;
      }
      var valcount = roleBox[0].value.trim().replace(/[^\r](?=(\n|\r))/g, "aa").length;
      var showMe = document.createElement('span');
      showMe.id = "kripp";
      showMe.style.marginTop = "5px";
      showMe.textContent = "Number of characters: " + valcount;
      if (valcount > valliMax) {
         roleBox[0].style.backgroundColor = "#F47373";
      }
      if (document.getElementById('cke_top_vB_Editor_QR_editor') !== null) {
         if (readCookie('bottPlay') !== null) {
            var purpur = document.getElementById('cke_bottom_vB_Editor_QR_editor');
            purpur.insertBefore(showMe, purpur.getElementsByClassName('cke_resizer')[0]);
         } else {
            document.getElementById('cke_top_vB_Editor_QR_editor').appendChild(showMe);
         }
      } else if (document.getElementById('cke_top_vB_Editor_001_editor') !== null) {
         if (readCookie('bottPlay') !== null) {
            var parpar = document.getElementById('cke_bottom_vB_Editor_001_editor');
            parpar.insertBefore(showMe, parpar.getElementsByClassName('cke_resizer')[0]);
         } else {
            document.getElementById('cke_top_vB_Editor_001_editor').appendChild(showMe);
         }
      }
   }
   var haltMe = setInterval(function() {
      if (document.getElementById('cke_6')) {
         detectino();
         document.getElementById('cke_6').addEventListener('click', function() {
            detectino();
         }, false);
         clearInterval(haltMe);
      }
   }, 200);
}

function escapeReg(str) {
   return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function killNames() {
   if (readCookie('repActive') === null) {
      return;
   }
   if (readCookie('everPlace') !== null && !/net\/newreply\.php/.test(window.location.href) && !/net\/threads\//.test(window.location.href) && !/\?do\=insertpm\&/.test(window.location.href) && !/net\/profile\.php\?do\=editoptions/.test(window.location.href)) {
      var amaZ = 0;
      while (readCookie('regId' + amaZ) !== null) {
         document.body.innerHTML = document.body.innerHTML.replace(new RegExp(escapeReg(readCookie('oriNam' + amaZ)), 'g'), readCookie('newNam' + amaZ));
         amaZ++;
      }
   } else {
      if (!/net\/threads\//.test(window.location.href)) {
         return;
      }
      var iter = 0;
      var postPart = document.getElementsByClassName('postcontainer');
      var warg;
      var numNum;
      var melga;
      var omega;
      while (readCookie('regId' + iter) !== null) {
         for (var i = 0; i < postPart.length; ++i) {
            if (postPart[i].getElementsByClassName('username')[0].href !== undefined) {
               warg = postPart[i].getElementsByClassName('postcontent')[0];
               melga = postPart[i].getElementsByClassName('username')[0];
               numNum = melga.href.replace(/(?:.+)?members\/([0-9]+)(?:.+)?/, "$1");
               omega = postPart[i].getElementsByClassName('usertitle')[0];
               warg.innerHTML = warg.innerHTML.replace(new RegExp(escapeReg(readCookie('oriNam' + iter)), 'g'), readCookie('newNam' + iter));
               if (melga.getElementsByTagName('strong')[0].getElementsByTagName('span').length !== 0) {
                  melga.getElementsByTagName('strong')[0].getElementsByTagName('span')[0].textContent = melga.getElementsByTagName('strong')[0].getElementsByTagName('span')[0].textContent.replace(readCookie('oriNam' + iter), readCookie('newNam' + iter));
               } else {
                  melga.getElementsByTagName('strong')[0].textContent = melga.getElementsByTagName('strong')[0].textContent.replace(readCookie('oriNam' + iter), readCookie('newNam' + iter));
               }
               if (readCookie('newTit' + iter) !== null && numNum == readCookie('regId' + iter)) {
                  if (/banned/i.test(omega.textContent) && !/banned/i.test(readCookie('newTit' + iter))) {
                     createCookie('newTit' + iter, readCookie('newTit' + iter) + " (Banned)", 500);
                  }
                  if (/banned/i.test(readCookie('newTit' + iter)) && !/banned/i.test(omega.textContent)) {
                     createCookie('newTit' + iter, readCookie('newTit' + iter).split("(")[0], 500);
                  }
                  omega.textContent = readCookie('newTit' + iter);
               }
            }
         }
         iter++;
      }
   }
}
var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var _dragElement;

function ExtractNumber(value) {
   var n = parseInt(value);
   return n === null || isNaN(n) ? 0 : n;
}

function $(id) {
   return document.getElementById(id);
}

function InitDragDrop() {
   document.onmousedown = OnMouseDown;
   document.onmouseup = OnMouseUp;
}
InitDragDrop();

function OnMouseDown(e) {
   if (e === null) e = window.event;
   var target = e.target.parentElement;
   if ((e.button == 1 && window.event !== null || e.button === 0) && target.className == 'standard_error theigedit') {
      _startX = e.clientX;
      _startY = e.clientY;
      _offsetX = ExtractNumber(target.style.left);
      _offsetY = ExtractNumber(target.style.top);
      _dragElement = target;
      document.onmousemove = OnMouseMove;
      document.body.focus();
      document.onselectstart = function() {
         return false;
      };
      target.ondragstart = function() {
         return false;
      };
      return false;
   }
}

function OnMouseMove(e) {
   if (e === null) e = window.event;
   _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
   _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
}

function OnMouseUp(e) {
   if (_dragElement !== null) {
      createCookie(_dragElement.id + "-posTop", _dragElement.style.top, 500);
      createCookie(_dragElement.id + "-posLeft", _dragElement.style.left, 500);
      document.onmousemove = null;
      document.onselectstart = null;
      _dragElement.ondragstart = null;
      _dragElement = null;
   }
}

function togSearch() {
   if (readCookie("searchRep") === null) {
      return;
   }
   var searchForm = document.getElementById('navbar_search');
   searchForm.setAttribute('action', 'javascript:void(0);');
   searchForm.removeAttribute('method');
   var searchSub = document.getElementById('navbar_search').getElementsByClassName('searchbutton')[0];
   searchSub.addEventListener('click', function() {
      advaSearch(document.getElementById('navbar_search').getElementsByClassName('textbox')[0].value);
   }, false);
}
if (document.getElementById('forumsearch')) {
   window.setTimeout(function() {
      var choice = document.getElementsByName('forumchoice[]')[0].value;
      var butSe = document.getElementById('forumsearch').getElementsByTagName('li')[0].getElementsByClassName('button')[0];
      var BoxSe = document.getElementById('forumsearch').getElementsByTagName('li')[0].getElementsByClassName('searchbox')[0];
      document.getElementById('forumsearch').getElementsByTagName('form')[0].setAttribute('action', 'javascript:void(0);');
      butSe.type = "button";
      var additivum = " forum:" + choice + "; ";
      document.getElementById('forumsearch').getElementsByTagName('form')[0].removeAttribute('method');
      butSe.addEventListener("click", function() {
         suppisearch(BoxSe.value);
      });

      function keyDowns(e) {
         if (e.keyCode == 13) {
            suppisearch(BoxSe.value);
         }
      }
      BoxSe.addEventListener("keydown", keyDowns, false);

      function suppisearch(quert) {
         if (document.getElementById('popupsearch').getElementsByClassName('submitoptions')[0].getElementsByTagName('input')[0].checked) {
            additivum += "results:threads;";
         }
         advaSearch(quert + additivum);
      }
   }, 10);
}
if (document.getElementById('searchthread')) {
   window.setTimeout(function() {
      var choice = document.getElementsByName('searchthreadid')[0].value;
      var butSe = document.getElementById('searchthread').getElementsByClassName('button')[0];
      var BoxSe = document.getElementById('searchthread').getElementsByClassName('searchbox')[0];
      document.getElementById('searchthread').getElementsByTagName('form')[0].setAttribute('action', 'javascript:void(0);');
      butSe.type = "button";
      var additivum = " thread:" + choice + "; ";
      document.getElementById('searchthread').getElementsByTagName('form')[0].removeAttribute('method');
      butSe.addEventListener("click", function() {
         suppisearch(BoxSe.value);
      });

      function keyDowns(e) {
         if (e.keyCode == 13) {
            suppisearch(BoxSe.value);
         }
      }
      BoxSe.addEventListener("keydown", keyDowns, false);

      function suppisearch(quert) {
         advaSearch(quert + additivum);
      }
   }, 10);
}

function advaSearch(query, alterna) {
   var filEx = /((?:forum|thread)([- ]?id)?:[^;]+;)|(\b[^:")\]} ]+:[^;:]+;)/gi;
   var rawQuery = query.replace(filEx, '').replace(/ +$/, '');
   var exQuery = query.match(filEx);
   var sLink = 'https://withthewill.net/search.php?query=' + rawQuery + "&type[]=1&showposts=1&childforums=1&titleonly=0";
   var hanky = "";
   if (query.length === 0) {
      document.location.href = 'https://withthewill.net/search.php?search_type=1#ads=1';
   } else {
      createCookie("squer", query, 500);
      if (readCookie("directSearch") !== null) {
         if (exQuery) {
            for (var i = 0; i < exQuery.length; ++i) {
               var exLabel = exQuery[i].match(/[^:]+/)[0];
               var exCont = exQuery[i].match(/[^:;]+(?=;)/)[0];
               console.log(exCont);
               console.log(exLabel);
               if (/^user$/i.test(exLabel)) {
                  hanky = /,( +)?threads/;
                  if (hanky.test(exCont)) {
                     exCont = exCont.replace(hanky, '');
                     sLink += "&starteronly=1&showposts=0";
                  } else {
                     sLink += "&starteronly=0";
                  }
                  hanky = /,( +)?partial/;
                  if (hanky.test(exCont)) {
                     exCont = exCont.replace(hanky, '');
                     sLink += "&exactname=0";
                  } else {
                     sLink += "&exactname=1";
                  }
                  sLink += '&searchuser=' + exCont;
               } else if (/^userid$/i.test(exLabel)) {
                  hanky = /,( +)?threads/;
                  if (hanky.test(exCont)) {
                     exCont = exCont.replace(hanky, '');
                     sLink += "&starteronly=1&showposts=0";
                  } else {
                     sLink += "&starteronly=0";
                  }
                  sLink += '&userid=' + exCont;
               } else if (/^only-title$/i.test(exLabel)) {
                  if (exCont == "1") sLink += "&titleonly=1";
               } else if (/^min-age$/i.test(exLabel)) {
                  var daiz = 0;
                  if (/^[0-9]+[dmy]?/gi.test(exCont)) {
                     var dateNum = exCont.match(/[0-9]+[dwmy]?/gi);
                     for (i = 0; i < dateNum.length; ++i) {
                        if (/([0-9]$)|d$/i.test(dateNum[i])) {
                           daiz += parseInt(dateNum[i]);
                        } else if (/w$/i.test(dateNum[i])) {
                           daiz += parseInt(dateNum[i]) * 7;
                        } else if (/m$/i.test(dateNum[i])) {
                           daiz += parseInt(dateNum[i]) * 30;
                        } else if (/y$/i.test(dateNum[i])) {
                           daiz += parseInt(dateNum[i]) * 365;
                        }
                     }
                     sLink += "&searchdate=" + daiz + "&beforeafter=before";
                  } else if (/^new$/i.test(exCont)) {
                     sLink += "&searchdate=lastvisit&beforeafter=before";
                  }
               } else if (/^max-age$/i.test(exLabel)) {
                  var daiz2 = 0;
                  if (/^[0-9]+[dmy]?/gi.test(exCont)) {
                     var dateNum2 = exCont.match(/[0-9]+[dwmy]?/gi);
                     for (var k = 0; k < dateNum2.length; ++k) {
                        if (/([0-9]$)|d$/i.test(dateNum2[k])) {
                           daiz2 += parseInt(dateNum2[k]);
                        } else if (/w$/i.test(dateNum2[k])) {
                           daiz2 += parseInt(dateNum2[k]) * 7;
                        } else if (/m$/i.test(dateNum2[k])) {
                           daiz2 += parseInt(dateNum2[k]) * 30;
                        } else if (/y$/i.test(dateNum2[k])) {
                           daiz2 += parseInt(dateNum2[k]) * 365;
                        }
                     }
                     sLink += "&searchdate=" + daiz2 + "&beforeafter=after";
                  } else if (/^new$/i.test(exCont)) {
                     sLink += "&searchdate=lastvisit";
                  }
               } else if (/^sort( +)?$/i.test(exLabel)) {
                  if (/^( +)?user(s|name)?( +)?$/i.test(exCont)) sLink += "&sortby=user";
                  else if (/^( +)?(thread)?title(s)?( +)?$/i.test(exCont)) sLink += "&sortby=title";
                  else if (/^( +)?(post(s)?|repl(y|ies))( +)?$/i.test(exCont)) sLink += "&sortby=replycount";
                  else if (/^( +)?((thread)[- ]?date|date[- ]?start(ed)?|start[- ]?date)( +)?$/i.test(exCont)) sLink += "&sortby=threadstart";
                  else if (/^( +)?(post[- ]?date|date[- ]?posted)( +)?$/i.test(exCont)) sLink += "&sortby=dateline";
                  else if (/^( +)?view(s|[- ]?number)( +)?$/i.test(exCont)) sLink += "&sortby=views";
                  else if (/^( +)?forums?( +)?$/i.test(exCont)) sLink += "&sortby=forum";
               } else if (/^order( +)?$/i.test(exLabel)) {
                  if (/^( +)?asc(ending)?( +)?$/i.test(exCont)) sLink += "&sortorder=ascending&order=ascending";
                  else if (/^( +)?desc(ending)?( +)?$/i.test(exCont)) sLink += "&sortorder=descending&order=descending";
               } else if (/^tags?( +)?$/i.test(exLabel)) {
                  sLink += "&contenttypeid=1&tag=" + exCont;
               }
               if (/^forum( +)?$/i.test(exLabel)) {
                  if (/^( +)?[0-9]+( +)?$/i.test(exCont)) {
                     sLink += "&forumchoice[]=" + exCont;
                  } else if (/s\/[0-9]+/.test(exCont)) {
                     exCont = exCont.replace(/.+s\/([0-9]+).+/, "$1");
                     sLink += "&forumchoice[]=" + exCont;
                  }
               }
               if (/^max-repl(ies|y)( +)?$/i.test(exLabel)) {
                  if (/^( +)?[0-9]+( +)?$/i.test(exCont)) {
                     sLink += "&replyless=1&replylimit=" + exCont;
                  }
               }
               if (/^min-repl(ies|y)( +)?$/i.test(exLabel)) {
                  if (/^( +)?[0-9]+( +)?$/i.test(exCont)) {
                     sLink += "&replyless=0&replylimit=" + exCont;
                  }
               }
               if (/^thread( +)?$/i.test(exLabel)) {
                  if (/^( +)?[0-9]+( +)?$/i.test(exCont)) {
                     sLink += "&searchthreadid=" + exCont;
                  } else if (/s\/[0-9]+/.test(exCont)) {
                     exCont = exCont.replace(/.+s\/([0-9]+).+/, "$1");
                     sLink += "&searchthreadid=" + exCont;
                  }
               }
               if (/^(child|sub)[-]?forums?( +)?$/i.test(exLabel)) {
                  if (/^( +)?(0|false)( +)?$/i.test(exCont)) {
                     sLink += "&childforums=0";
                  } else {
                     sLink += "&childforums=1";
                  }
               }
               if (/^(search[-]?)?titles?( +)?$/i.test(exLabel)) {
                  if (/^( +)?(1|true)( +)?$/i.test(exCont)) {
                     sLink += "&titleonly=1";
                  } else {
                     sLink += "&titleonly=0";
                  }
               }
               if (/^results?$/i.test(exLabel)) {
                  if (/^( +)?posts?( +)?$/i.test(exCont)) sLink += "&showposts=1";
                  else if (/^( +)?threads?( +)?$/i.test(exCont)) {
                     sLink += "&showposts=0";
                  }
               }
            }
         }
         sLink += "&do=process";
      //   alert(rawQuery)
         if (alterna) return sLink;
         document.location.href = sLink;
      } else {
         document.location.href = 'https://withthewill.net/search.php?query=' + query + '&type[]=1&showposts=1&do=process';
      }
   }
}

function checkopt(targForm) {
   var BlMessenger;
   var list = targForm.querySelectorAll('input[type=checkbox]');
   var tList = targForm.querySelectorAll('input[type=text]');
   if (targForm.name == "theignopt") BlMessenger = document.getElementById("finishT");
   var ErLog = false;
   for (var i = 0; i < list.length; ++i) {
      var item = list[i];
      if (!item.disabled) {
         if (item.checked) {
            createCookie(item.name, 1, 500);
         } else {
            if (readCookie(item.name) == 1) {
               eraseCookie(item.name);
            }
         }
      }
   }

   function failCheck(Eleme) {
      if (Eleme.value.length === 0) {
         eraseCookie(Eleme.name);
         eraseCookie(Eleme.name + "-log");
      } else {
         ErLog = true;
         Eleme.style.backgroundColor = "#F47373";
      }
   }

   function succeedCheck(Elemen) {
      createCookie(Elemen.name, itemT1.value, 500);
      createCookie(Elemen.name + "-log", itemT1.value, 500);
      Elemen.style.backgroundColor = "#94ED80";
   }
   for (i = 0; i < tList.length; ++i) {
      var itemT1 = tList[i];
      if (!itemT1.disabled) {
         if (itemT1.className == "text100") {
            var limitVal = parseInt(itemT1.value);
            if (itemT1.value.match(/^[0-9]+$/) && limitVal <= 100 && limitVal > 0) {
               succeedCheck(itemT1);
            } else {
               failCheck(itemT1);
            }
         } else if (itemT1.className == "textGen") {
            succeedCheck(itemT1);
         } else if (itemT1.className == "textU") {
            var limitVal2 = parseInt(itemT1.value);
            if (itemT1.value.match(/^[0-9]+$/) && limitVal2 >= 0) {
               succeedCheck(itemT1);
            } else {
               failCheck(itemT1);
            }
         } else if (itemT1.className == "textcol") {
            if (/(^#[0-9A-F]{6}$|^#[0-9A-F]{3}$)|(^(rgb\([0-9]{1,3}, ?[0-9]{1,3}, ?[0-9]{1,3}\))$|^rgba\([0-9]{1,3}, ?[0-9]{1,3}, ?[0-9]{1,3}, ?(0(\.[0-9])?|1)\)$)/i.test(itemT1.value)) {
               succeedCheck(itemT1);
            } else {
               failCheck(itemT1);
            }
         } else {
            alert(itemT1.className);
         }
      } else {
         eraseCookie(itemT1.name);
      }
   }
   if (targForm.name == "theignopt") {
      BlMessenger.innerHTML = "Done!";
      if (ErLog) {
         window.setTimeout(function() {
            BlMessenger.innerHTML += "<br />...But we encountered some problems.";
         }, 600);
      } else {
         window.setTimeout(function() {
            BlMessenger.innerHTML += "<br />Reloading page...";
            window.setTimeout(function() {
               window.location.reload();
            }, 300);
         }, 400);
      }
   }
}

function autoctive() {
   if (window.location.pathname.split('/')[1] !== "activity.php" || readCookie("actiActive") !== null) {
      return
   }
   var acbut = document.getElementById("newactivity_container");

   function spanClick() {
      if (!/hidden/.test(acbut.className)) {
         document.getElementById("newactivitylink").click();
      }
   }
   setInterval(function() {
      spanClick();
   }, 1000);
}
autoctive();

function StreamIvity() {
   if (readCookie("aktiv") !== null) {
      window.setTimeout(function() {
         var yuiList = document.getElementById("yui-gen6");
         var aStreamLi = document.createElement("li");
         aStreamLi.setAttribute("id", "vbqlink_acitivity");
         var aStream = document.createElement("a");
         aStream.setAttribute("href", "activity.php");
         aStream.textContent = "Activity Stream";
         yuiList.appendChild(aStreamLi).appendChild(aStream);
      }, 200);
   }
}

function exSet(targForm) {
   var finArr = new Array([]);
   var arrNum = 1;
   finArr[0] = scriptovers;

   function cookiefy(CooName) {
      finArr[arrNum] = new Array([]);
      finArr[arrNum][0] = CooName;
      finArr[arrNum][1] = encodeURIComponent(readCookie(CooName));
      ++arrNum;
   }
   var aDel = 0;
   var dDel = 0;
   var uDel = 0;
   while (readCookie("aKey" + aDel) !== null) {
      cookiefy("aKey" + aDel);
      if (readCookie("aMode" + aDel) !== null) {
         cookiefy("aMode" + aDel);
      }
      if (readCookie("aLink" + aDel) !== null) {
         cookiefy("aLink" + aDel);
      }
      if (readCookie("aQuery" + aDel) !== null) {
         cookiefy("aQuery" + aDel);
      }
      aDel++;
   }
   while (readCookie("dKey" + dDel) !== null) {
      cookiefy("dKey" + dDel);
      if (readCookie("dMode" + dDel) !== null) {
         cookiefy("dMode" + dDel);
      }
      if (readCookie("dLink" + dDel) !== null) {
         cookiefy("dLink" + dDel);
      }
      dDel++;
   }
   if (readCookie("incName") === null) {
      while (readCookie("regId" + uDel) !== null) {
         cookiefy("regId" + uDel);
         cookiefy("oriNam" + uDel);
         cookiefy("newNam" + uDel);
         cookiefy("newTit" + uDel);
         uDel++;
      }
   }
   var listItem = targForm.getElementsByTagName("input");
   for (var i = 0; i < listItem.length; ++i) {
      if (readCookie(listItem[i].name) !== null) {
         cookiefy(listItem[i].name);
      }
      if (readCookie(listItem[i].name + "-log") !== null) {
         cookiefy(listItem[i].name + "-log");
      }
   }
   if (readCookie("grantEx") !== null) {
      finArr[arrNum] = new Array([]);
      finArr[arrNum][0] = "exmode";
      finArr[arrNum][1] = "1";
   }
   window.prompt("Your exported Settings:", btoa(JSON.stringify(finArr)));
}

function impSet() {
   var BlMessenger = document.getElementById("finishT");
   var rawList = atob(window.prompt("Paste your exported Settings"));
   var cookList = JSON.parse(rawList);
   var securitae = false;
   if (readCookie("exmode") !== null) {
      securitae = true;
   }
   if (cookList.constructor === Array) {
      if (cookList[0] != scriptovers) {
         var verswarn = confirm("You are importing Settings generated from another version of WES.\nThis might have unintended consequences, do you still want to continue?");
         if (verswarn === false) return;
      }
      if (readCookie("exmode") == null && cookList[cookList.length - 1][0] == "exmode") {
         var exWarn = confirm("You have recieved the honor of obtaining a configuration of the Extended Edition of WES.\nPress Okay to update your installation to use the Extended Edition features or Cancel ");
         if (exWarn === true) {
            securitae = true
         };
      }
      allReset(document.getElementById('menStart'), 1);
      if (/regid/i.test(rawList)) {
         createCookie('nameActive', 1, 500);
      }
      for (var i = 1; i < cookList.length; ++i) {
         if ((cookList[i][0] == "exmode" || cookList[i][0] == "grantEx") && securitae == false) {
            continue
         }
         if (securitae == true) {
            createCookie("exmode", "1", 500)
         }
         createCookie(cookList[i][0], decodeURIComponent(cookList[i][1]), 500);
      }
      BlMessenger.innerHTML = "Import successfull!";
      window.setTimeout(function() {
         BlMessenger.innerHTML += "<br />Reloading page...";
         window.setTimeout(function() {
            window.location.reload();
         }, 300);
      }, 400);
   } else {
      alert("Faulty data");
   }
}

function allReset(targForm, noSet) {
   var aDel = 0;
   var dDel = 0;
   var uDel = 0;
   if (targForm.name == "theignopt") {
      eraseCookie("optInvoke");
      eraseCookie("exmode");
      eraseCookie('nameActive');
      while (readCookie("aKey" + aDel) !== null) {
         eraseCookie("aKey" + aDel);
         eraseCookie("aMode" + aDel);
         eraseCookie("aLink" + aDel);
         eraseCookie("aQuery" + aDel);
         aDel++;
      }
      while (readCookie("dKey" + dDel) !== null) {
         eraseCookie("dKey" + dDel);
         eraseCookie("dMode" + dDel);
         eraseCookie("dLink" + dDel);
         dDel++;
      }
      while (readCookie("regId" + uDel) !== null) {
         eraseCookie("regId" + uDel);
         eraseCookie("oriNam" + uDel);
         eraseCookie("newNam" + uDel);
         eraseCookie("newTit" + uDel);
         uDel++;
      }
   }
   var listItem = targForm.getElementsByTagName("input");
   for (var i = 0; i < listItem.length; ++i) {
      eraseCookie(listItem[i].name);
      //  alert(listItem[i].name);
      eraseCookie(listItem[i].name + "-log");
   }
   if (targForm.name == "theignopt" && !noSet) location.reload();
}

function getpostsats(miniWord, maxiWord) {
   var minWord = parseInt(miniWord);
   var maxWord = parseInt(maxiWord);
   var textReg = /((?!(\+|\*|\,|!|<|>|\^))\S)+/g;
   var japReg = /([\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B)+/g;
   var allpost = document.getElementsByClassName('postcontainer');
   var totallength;
   if (maxWord < minWord && !(maxWord === 0 && minWord == 1)) {
      alert("WTF DUDE!");
      for (var m = 0; m < allpost.length; m++) allpost[m].style.transform = "rotate(180deg)";
      eraseCookie("lowerText");
      eraseCookie("upperText");
      return "Someone doesn't understand numbers...";
   }
   for (var i = 0; i < allpost.length; i++) {
      var staffPost = false;
      var postBy = allpost[i].getElementsByClassName("bbcode_postedby").length * 4;
      //  console.log(postBy);
      if (
         ((allpost[i].getElementsByClassName('userinfo')[0].getElementsByTagName('img')[1] !== undefined && (/admin/.test(allpost[i].getElementsByClassName('userinfo')[0].getElementsByTagName('img')[1].src) || /AnZBBR/.test(allpost[i].getElementsByClassName('userinfo')[0].getElementsByTagName('img')[1].src) || /staff/.test(allpost[i].getElementsByClassName('userinfo')[0].getElementsByTagName('img')[1].src))) || /Moderator/.test(allpost[i].getElementsByClassName('usertitle')[0].textContent)) && readCookie('DANGERMODE', 1) === null) {
         staffPost = true;
      }
      var quota = allpost[i].querySelectorAll('.postcontent > .bbcode_container > .bbcode_quote > .quote_container');
      var qlength = 0;
      var nestedQuL = 0;
      var tJap = 0;
      var qJap = 0;
      var pJap = 0;
      var isJapQ = false;
      var isJap = japReg.test(allpost[i].getElementsByClassName('postcontent')[0].textContent);
      if (isJap) pJap = allpost[i].getElementsByClassName('postcontent')[0].textContent.match(japReg).length;
      for (var k = 0; k < quota.length; k++) {
         if (readCookie("onlyUs") !== null) {
            if (!/^(\s+)?Originally Posted by /.test(quota[k].textContent)) {
               continue;
            }
         }
         qlength += quota[k].textContent.match(textReg).length;
         isJapQ = japReg.test(quota[k].textContent);
         if (isJapQ) {
            qJap += quota[k].textContent.match(japReg).length;
         }
         //   console.log(qlength + ' (quote ' + (k + 1) + ') #' + (i + 1));
      }
      var finalquote = qlength - qJap - postBy;
      tJap = pJap - qJap;
      // console.log("amount of japanese text: "+tJap)
      var textlength = 0;
      if (/\w/.test(allpost[i].getElementsByClassName('postcontent')[0].textContent)) {
         textlength = allpost[i].getElementsByClassName('postcontent')[0].textContent.match(textReg).length;
      }
      if (readCookie("quoteCount") === null) {
         totallength = textlength - tJap - finalquote - postBy;
      } else {
         totallength = textlength - tJap - postBy;
      }
      /*  console.log(textlength + ' (full post) #' + (i + 1));
          if (finalquote !== 0)
          {
              console.log(totallength + ' (minus quotes) #' + (i + 1));
          } */
      if (allpost[i].getElementsByClassName('ish_inquisition').length === 0 && readCookie("disCount") !== null) {
         var countSpan = document.createElement('span');
         countSpan.style.color = "#aaa";
         countSpan.setAttribute('class', 'ish_inquisition');
         countSpan.innerHTML = "words: <b>" + totallength + "</b>";
         if (finalquote !== 0 && readCookie("quoteCount") === null) countSpan.innerHTML += " (and <b>" + finalquote + "</b> quoted)";
         if (finalquote !== 0 && readCookie("quoteCount") !== null) countSpan.innerHTML += " (including <b>" + finalquote + "</b> quoted)";
         if (tJap !== 0) countSpan.innerHTML += ", instances of japanese text: <b>" + tJap + "</b>";
         if (qJap !== 0) countSpan.innerHTML += ", plus <b>" + qJap + "</b>  in quotes";
         if (qJap !== 0 && tJap !== 0) countSpan.innerHTML += " (<b>" + pJap + "</b> in total)";
         var Nodd = allpost[i].getElementsByClassName('nodecontrols')[0];
         var NoddParent = Nodd.parentNode;
         NoddParent.insertBefore(countSpan, Nodd);
      }
      if (staffPost === true) {} else {
         if (minWord > totallength) {
            allpost[i].className += " lowerCut";
         } else {
            allpost[i].className = allpost[i].className.replace(/(?:^|\s)lowerCut(?!\S)/g, '');
         }
         if (maxWord < totallength) {
            allpost[i].className += " upperCut";
         } else {
            allpost[i].className = allpost[i].className.replace(/(?:^|\s)upperCut(?!\S)/g, '');
         }
      }
   }
}

function accessOverride() {
   if (readCookie('accAble') === null) return;
   var onPage = false;
   var defNum = 0;
   var norNum = 0;
   var dList;
   var endA = document.querySelectorAll('a[accesskey]');
   var tagaList = document.getElementsByTagName('a');
   for (var i = 0; i < endA.length; i++) {
      endA[i].removeAttribute('accesskey');
   }
   while (readCookie("dKey" + defNum) !== null) {
      dList = document.querySelectorAll('*[accesskey=' + readCookie('dMode' + defNum) + ']');
      for (i = 0; i < dList.length; i++) {
         dList[i].setAttribute('accesskey', readCookie("dKey" + defNum));
         dList[i].setAttribute('title', '(Alt+ ' + readCookie("dKey" + defNum) + ')');
      }
      defNum++;
   }
   while (readCookie("aKey" + norNum) !== null) {
      if (readCookie('aMode' + norNum) == "l" || readCookie('aMode' + norNum) == "s") {
         for (i = 0; i < tagaList.length; i++) {
            if (tagaList[i].href == readCookie('aLink' + norNum) && readCookie('lightHigh') !== null && tagaList[i].querySelectorAll('*').length === 0 && new RegExp(escapeReg(readCookie('aKey' + norNum)), 'i').test(tagaList[i].innerHTML)) {
               tagaList[i].innerHTML = tagaList[i].innerHTML.replace(new RegExp(escapeReg(readCookie('aKey' + norNum)), 'i'), "<u>$&</u>");
            }
         }
         for (i = 0; i < tagaList.length; i++) {
            onPage = false;
            if (tagaList[i].href == readCookie('aLink' + norNum)) {
               tagaList[i].setAttribute('accesskey', readCookie('aKey' + norNum));
               tagaList[i].setAttribute('title', "Access Key: " + readCookie('aKey' + norNum));
               onPage = true;
               break;
            }
         }
         if (onPage === false && (readCookie('uniKey') !== null || readCookie('aMode' + norNum) == "s")) {
            var poorMansLink = document.createElement('a');
            poorMansLink.href = readCookie('aLink' + norNum);
            poorMansLink.setAttribute('accesskey', readCookie('aKey' + norNum));
            poorMansLink.setAttribute('title', "Access Key: " + readCookie('aKey' + norNum));
            document.body.appendChild(poorMansLink);
         }
      } else if (readCookie('aMode' + norNum) == "w") {
         var fuzzyLinks = document.querySelectorAll('a[href*="' + readCookie('aLink' + norNum) + '"]');
         for (i = 0; i < fuzzyLinks.length; i++) {
            if (readCookie('lightHigh') !== null && fuzzyLinks[i].querySelectorAll('*').length === 0 && new RegExp(escapeReg(readCookie('aKey' + norNum)), 'i').test(fuzzyLinks[i].innerHTML)) {
               fuzzyLinks[i].innerHTML = fuzzyLinks[i].innerHTML.replace(new RegExp(escapeReg(readCookie('aKey' + norNum)), 'i'), "<u>$&</u>");
            }
         }
         if (document.querySelectorAll('a[href*="' + readCookie('aLink' + norNum) + '"]').length !== 0) {
            document.querySelectorAll('a[href*="' + readCookie('aLink' + norNum) + '"]')[0].setAttribute('accesskey', readCookie('aKey' + norNum));
            document.querySelectorAll('a[href*="' + readCookie('aLink' + norNum) + '"]')[0].setAttribute('title', "access key: " + readCookie('aKey' + norNum));
         }
      } else if (readCookie('aMode' + norNum) == "r") {
         for (i = 0; i < tagaList.length; i++) {
            if (tagaList[i].href.match(readCookie('aLink' + norNum)) && readCookie('lightHigh') !== null && tagaList[i].querySelectorAll('*').length === 0 && new RegExp(escapeReg(readCookie('aKey' + norNum)), 'i').test(tagaList[i].innerHTML)) {
               tagaList[i].innerHTML = tagaList[i].innerHTML.replace(new RegExp(escapeReg(readCookie('aKey' + norNum)), 'i'), "<u>$&</u>");
            }
         }
         for (i = 0; i < tagaList.length; i++) {
            if (tagaList[i].href.match(readCookie('aLink' + norNum))) {
               tagaList[i].setAttribute('accesskey', readCookie('aKey' + norNum));
               tagaList[i].setAttribute('title', 'access key: ' + readCookie('aKey' + norNum));
               break;
            }
         }
      }
      norNum++;
   }
}

function bannLink() {
   if (readCookie("BannerCB") === null) return;
   var linkLok;
   if (readCookie("portP") !== null) {
      LinkLok = "https://withthewill.net/";
   } else {
      LinkLok = "https://withthewill.net/forum.php";
   }
   var banject = document.getElementsByClassName("main_logo")[0].getElementsByTagName("img")[0];
   banject.parentNode.innerHTML = '<a href="' + LinkLok + '"' + ">" + banject.parentNode.innerHTML + "</a>"
}

function boxCheck(targForm) {
   var checkedList = targForm.querySelectorAll('input[type=checkbox]');
   for (var i = 0; i < checkedList.length; ++i) {
      var item = checkedList[i];
      if (item.name == "DANGERMODE") {
         if (readCookie(item.name, 1) !== null) {
            item.checked = true;
         } else {
            item.checked = false;
         }
      } else if (readCookie(item.name) !== null) {
         item.checked = true;
      } else {
         item.checked = false;
      }
   }
}

function textCheck(targForm) {
   var textList = targForm.querySelectorAll('input[type=text]');
   for (var i = 0; i < textList.length; ++i) {
      var itemt = textList[i];
      if (readCookie(itemt.name + "-log") !== null) {
         itemt.value = readCookie(itemt.name + "-log");
      } else {
         itemt.value = itemt.value;
      }
   }
}

function deployMenu() {
   if (!/withthewill\.net\/profile\.php\?do=editoptions/.test(window.location.href)) {
      return;
   }
   var menubody = document.createElement('div');
   menubody.setAttribute('class', 'blockbody settings_form_border formcontrols ');
   var theigForm = document.createElement('form');
   theigForm.setAttribute('class', 'block');
   theigForm.setAttribute('id', 'menStart');
   theigForm.setAttribute('name', 'theignopt');
   var menuh3 = document.createElement('h3');
   menuh3.setAttribute('class', 'blocksubhead');
   var blockrowElem = document.createElement('div');
   blockrowElem.setAttribute('class', 'blockrow');
   var genRow = blockrowElem.cloneNode(false);
   var sectionElem = document.createElement('div');
   sectionElem.setAttribute('class', 'section');
   sectionElem.setAttribute('id', 'newDW');
   var genSect = sectionElem.cloneNode(false);
   menuh3.textContent = 'Theignoptions';
   var optiFrag = document.body.getElementsByClassName('cp_content')[0];
   optiFrag.appendChild(theigForm).appendChild(menubody).appendChild(menuh3);
   menubody.appendChild(genSect);

   function subSect(secTitle, secId, pText) {
      var secBody = document.createElement("div");
      secBody.setAttribute('class', 'blockrow');
      var secLabel = document.createElement('label');
      secLabel.textContent = secTitle;
      var secul = document.createElement("ul");
      secul.setAttribute('id', secId);
      secul.setAttribute('class', 'checkradio group rightcol');
      secBody.appendChild(secLabel);
      secBody.appendChild(secul);
      if (pText !== undefined) {
         var secP = document.createElement('p');
         secP.textContent = pText;
         secP.setAttribute('class', 'description');
         secBody.appendChild(secP);
      }
      genSect.appendChild(secBody);
   }

   function discheck() {
      var theignopt = document.getElementById('menStart');
      var cb1 = theignopt.overSearch.checked;
      var cb2 = theignopt.BannerCB.checked;
      var cb3 = theignopt.EditGen.checked;
      var cb4 = theignopt.trigShad.checked;
      var cb5 = theignopt.linkShort.checked;
      var cb6 = theignopt.textCut.checked;
      var cb7 = theignopt.plainAva.checked;
      var cb8 = theignopt.searchRep.checked;
      var cb9 = theignopt.accAble.checked;
      var cb11 = theignopt.repRed.checked;
      if (readCookie('nameActive') !== null) {
         var cb10 = theignopt.repActive.checked;
         theignopt.everPlace.disabled = !cb10;
      }
      theignopt.bottPlay.disabled = !cb11;
      theignopt.onlyUs.disabled = !cb6;
      theignopt.directSearch.disabled = !cb8;
      theignopt.uniKey.disabled = !cb9;
      theignopt.lightHigh.disabled = !cb9;
      theignopt.disCount.disabled = !cb6;
      theignopt.quoteCount.disabled = !cb6;
      theignopt.autoCut.disabled = !cb6;
      theignopt.dangerBut.disabled = !cb6;
      theignopt.keepBorder.disabled = !cb7;
      theignopt.memliNum.disabled = !cb1;
      theignopt.wioNum.disabled = !cb1;
      theignopt.aboutMem.disabled = !cb5;
      theignopt.ShadAni.disabled = !cb4;
      theignopt.shadCol.disabled = !cb4;
      theignopt.portP.disabled = !cb2;
      theignopt.searchNum.disabled = !cb1;
      theignopt.quickVB.disabled = !cb3;
      theignopt.fullVB.disabled = !cb3;
   }

   function genInput(section, preset, name, title, value, description, spClass, shadeT) {
      var error = false;
      var typus = "";
      var tClass = "";
      if (preset == "cbo") {
         typus = "checkbox";
      } else if (preset == "text100") {
         typus = "text";
         tClass = "text100";
      } else if (preset == "textU") {
         typus = "text";
         tClass = "textU";
      } else if (preset == "textCol") {
         typus = "text";
         tClass = "textcol";
      } else {
         alert("input error");
         error = true;
      }
      if (!error) {
         var liCont = document.createElement('li');
         if (spClass !== undefined) {
            liCont.setAttribute('class', spClass);
         }
         var inpEle = document.createElement('input');
         inpEle.setAttribute('name', name);
         inpEle.setAttribute('type', typus);
         inpEle.setAttribute('id', name + "-inpId");
         if (preset == "cbo") {
            inpEle.addEventListener("click", discheck, false);
         }
         if (value !== undefined) {
            inpEle.setAttribute('value', value);
         }
         if (preset == "text100" || preset == "textU" || preset == "textCol") {
            inpEle.setAttribute('class', tClass);
            inpEle.addEventListener('focus', function() {
               this.style.backgroundColor = "#FFF";
            }, false);
         }
         var labEle = document.createElement('label');
         labEle.setAttribute('id', name);
         labEle.setAttribute('for', name + "-inpId");
         labEle.textContent = " " + title;
         labEle.style.display = "inline";
         var shadEle = document.createElement('span');
         shadEle.setAttribute('class', 'shade');
         if (shadeT !== undefined) {
            shadEle.textContent = " " + shadeT;
         }
         liCont.appendChild(inpEle);
         liCont.appendChild(labEle).appendChild(shadEle);
         if (description !== undefined); {
            var descP = document.createElement('p');
            descP.setAttribute('class', "description");
            if (description !== undefined) descP.innerHTML = description;
            liCont.appendChild(descP);
         }
         document.getElementById(section).appendChild(liCont);
      }
   }

   function sectFiller(targetDiv, targArr) {
      var propertyArray = [];
      for (var i = 0; i < targArr.length; ++i) {
         var SubObj = targArr[i];
         if (readCookie("exmode") == null && SubObj.bstat !== "1") {
            continue
         }
         var keys = Object.keys(SubObj);
         propertyArray[i] = [];
         propertyArray[i] = [targetDiv];
         for (var k = 1; k < keys.length; k++) {
            var val = SubObj[keys[k]];
            propertyArray[i].push(val);
         }
         genInput.apply(null, propertyArray[i]);
      }
   }
   var basicButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "fixQuote",
         description: "Fix broken quotes in old threads"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "uniFix",
         description: "Fix broken Entity References in old threads"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "deClutter",
         description: "Remove useless buttons and sections"
    }];
   var menButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "BannerCB",
         description: "Make the WtW Banner link to the Main Page"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "portP",
         description: "Link to the Main Portal instead",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "BannerCent",
         description: "Relative Banner scaling"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "settLink",
         description: 'Separated links for "Settings" and "Subscriptions"'
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "aktiv",
         description: 'add "Activity Stream" to the "Quick Links" menu',
         initial_value: "0",
         longer_description: "",
         stylingClass: "generic",
    }];
   var interButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "linkShort",
         description: "Shorten links for profiles and threads"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "aboutMem",
         description: '"About me"-Page is the default page when viewing Member Profiles',
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "plainAva",
         description: "Plain Avatars"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "keepBorder",
         description: 'Keep borders',
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut downgin"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "disNotice",
         description: "Don't show registration notice when not logged in"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "hovState",
         description: "Additional hover states and transitions for certain elements"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "colmore",
         description: "More collapsable elements"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "statLine",
         description: "The links to the Thread Statistics are underlined"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "statWin",
         description: "Thread Statistics don't open in a separate window"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "ownStats",
         description: "Show Number of own replies to a Thread with direct search"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "postAlterna",
         description: "Alternate Post-Controls Layout"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "pReset",
         description: "Reset displayed Post count on each page",
         initial_value: "0",
         longer_description: "",
         stylingClass: "generic",
         shaded_text: "(does NOT affect the actual link)"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "prevLinks",
         description: "Show links to individual posts in the Topic Review"
    },

      {
         bstat: "1",
         input_type: "cbo",
         name: "spoilMe",
         description: "Disable Spoiler tags",
         initial_value: "0",
         longer_description: "",
         stylingClass: "generic",
         shaded_text: " (Warning: may contain spoilers)"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "staffStuff",
         description: "Staff is now Stuff."
    }];
   var extButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "subLinking",
         description: "Activate WES sub-post Linking"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "repRed",
         description: "Show character counter when writing new Posts or PMs",
         initial_value: "",
         longer_description: "only works for the Standard Editor with extra formatting controls, <b>not</b> for the WYSIWYG Editor"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "bottPlay",
         description: "Show counter at the bottom of the editor",
         initial_value: "",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "dayPost",
         description: "Show Posts Per Day in the Member List ",
         initial_value: "",
         longer_description: "",
         stylingClass: "downgin"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "overSearch",
         description: "Enable Max Result Overrides",
    },
      {
         bstat: "1",
         input_type: "text100",
         name: "searchNum",
         description: "Maximum number of search results per page",
         initial_value: "25",
         longer_description: "(Between 0 and 100)",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "text100",
         name: "memliNum",
         description: "Memberlist entries per page",
         initial_value: "25",
         longer_description: "(Between 0 and 100)",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "text100",
         name: "wioNum",
         description: '"Who-is-Online" entries per page',
         initial_value: "25",
         longer_description: "(I think you know by now)",
         stylingClass: "indentPut downgin"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "EditGen",
         description: "Enable custom Editor height"
    },
      {
         bstat: "1",
         input_type: "textU",
         name: "quickVB",
         description: "Height of the quick reply Editor in pixels",
         initial_value: "100",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "textU",
         name: "fullVB",
         description: "Height of the advanced Editor in pixels",
         initial_value: "250",
         longer_description: "",
         stylingClass: "indentPut downgin"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "trigShad",
         description: "Enable an awesome custom color for the drop shadow on the Main Banner"
    },
      {
         bstat: "1",
         input_type: "textCol",
         name: "shadCol",
         description: "Custom color code for the box-shadow",
         initial_value: "#f00",
         longer_description: "Use either hex or rgb values, as in #274363 or rgb(123,223,123) [rgba is also supported.]",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "ShadAni",
         description: "Enable Hover Animation",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    }];
   var searchButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "searchRep",
         description: '"Advanced Search" points to Single Content Search set to "Posts"'
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "directSearch",
         description: "Direct-Search option input",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "lightsOff",
         description: "Don't highlight search results",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "querKeep",
         description: "On the Results page, keep the search query in the Search Field",
         initial_value: "0",
         longer_description: "",
         stylingClass: "downgin"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "popSearch",
         description: 'Search result Bulk Opener',
         initial_value: "0",
         longer_description: "If you really want to use the Bulk Opener you might want to disable your Pop-up blocker on WtW and check your browser settings for opening new windows and tabs.",
         stylingClass: "downgin"
    },
      {
         bstat: "1",
         input_type: "textU",
         name: "Swidth",
         description: "Set Quick Search Field width",
         initial_value: "200",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "Shover",
         description: "Only change width when hovering or entering text",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "rAlign",
         description: "Align text to the right",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    }];
   var wButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "textCut",
         description: "Enable Text-Cutter/Counter"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "quoteCount",
         description: "Include quoted passages in word count"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "onlyUs",
         description: "Only ignore quotes of users"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "autoCut",
         description: "Enable automatic cutting on page-load"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "disCount",
         description: "Show word count in post header"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "noShad",
         description: "Disable drop shadow",
         initial_value: "0",
         longer_description: "(Might result in better performance when dragging)",
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "dangerBut",
         description: "Show button to enable DANGER MODE"
    }];
   var accButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "accAble",
         description: "Enable Access Key Override"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "uniKey",
         description: "Universally apply Access Keys for complete URLs",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "lightHigh",
         description: "Highlight Access Keys in link text",
         initial_value: "0",
         longer_description: "",
         stylingClass: "indentPut downgin"
    }];
   var renaButts = [
      {
         bstat: "1",
         input_type: "cbo",
         name: "repActive",
         description: "Activate Username replacement"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "everPlace",
         description: "Activate replacement outside of threads",
         initial_value: "0",
         longer_description: "Does NOT affect the sites for new replies or PMs. <br/> Might break some non-WES javascript on the page.",
         stylingClass: "indentPut",
         shaded_text: "(possibly unstable)"
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "incName",
         description: "Don't include name replacing in exported settings",
         initial_value: "0",
         longer_description: "",
         stylingClass: "downgin"
    }];
   var bugButts = [
      {
         bstat: "2",
         input_type: "cbo",
         name: "grantEx",
         description: "Exported settings serve as upgrade",
         initial_value: "0",
         longer_description: "While this option is enabled the exported settings will upgrade the WES installation of anyone who imports it to the extended version.",
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "compaMode",
         description: "Always use cookies instead of HTML5 local storage",
         initial_value: "0",
         longer_description: "Use in case you get an error message about your browser's local storage capabilities",
    },
      {
         bstat: "1",
         input_type: "cbo",
         name: "deHide",
         description: "Show hidden page elements and form fields",
         initial_value: "0",
         longer_description: "...usually just useless and annoying.",
         stylingClass: "downgin",
    }

    ];

   function genFooter() {
      var baseDiv = document.createElement('div');
      baseDiv.setAttribute('class', 'blockfoot actionbuttons settings_form_border');
      baseDiv.style.border = "none";
      var groupDiv = document.createElement('div');
      groupDiv.setAttribute('class', "group");
      var finP = document.createElement('p');
      finP.setAttribute('id', "finishT");
      baseDiv.appendChild(groupDiv).appendChild(finP);
      var checkB = document.createElement('input');
      checkB.setAttribute('id', 'finalcheck');
      checkB.setAttribute('class', 'button');
      checkB.setAttribute('type', 'button');
      checkB.setAttribute('value', 'Apply Changes');
      checkB.style.marginRight = "5px";
      var expor = document.createElement('input');
      expor.setAttribute('id', 'exportation');
      expor.setAttribute('class', 'button');
      expor.setAttribute('type', 'button');
      expor.setAttribute('value', 'Export Settings');
      var impor = document.createElement('input');
      impor.setAttribute('id', 'importation');
      impor.setAttribute('class', 'button');
      impor.setAttribute('type', 'button');
      impor.setAttribute('value', 'Import Settings');
      var resB = document.createElement('input');
      resB.setAttribute('id', 'AllDelete');
      resB.setAttribute('class', 'button');
      resB.setAttribute('type', 'button');
      resB.setAttribute('value', 'Reset to Default');
      groupDiv.appendChild(expor);
      groupDiv.appendChild(impor);
      groupDiv.appendChild(checkB);
      groupDiv.appendChild(resB);
      document.getElementById('newDW').appendChild(baseDiv);
   }
   subSect("General Fixes:", "basFix", "Fixes some of the little annoyances on the forum.");
   subSect("Main Menu Modifications:", "MenMod", "Various options for changing the functionality of the Main Menu bar.");
   subSect("Basic Interface Tweaks:", "intFace", "Some funny little things you can do to WtW to make yourself feel better about the world.");
   subSect("Extended Customization:", "extFunc", "Some more in-depth options.");
   subSect("Search Overhaul:", "searchHaul", "Extended functionality for the quicksearch");
   subSect("Word count-based Post cut-off:", "wCut", "Only enable DANGER MODE if you really know what you are doing.");
   subSect("Customizeable Access keys:", "acKey", "More Access Keys for everyone, now editable!");
   sectFiller("basFix", basicButts);
   sectFiller("MenMod", menButts);
   sectFiller("intFace", interButts);
   sectFiller("extFunc", extButts);
   sectFiller("searchHaul", searchButts);
   sectFiller("wCut", wButts);
   sectFiller("acKey", accButts);
   if (readCookie('nameActive') !== null) {
      subSect("User Renamer", "usNamer", "You discovered the secret User Renamer! Yay!");
      sectFiller("usNamer", renaButts);
   }
   subSect("Debug and Compatibility features", "deBug", "Only enable the options above if the script is fucking up really badly!");
   sectFiller("deBug", bugButts);

   function oldToggle(maus) {
      if (readCookie('compaMode', 1) === null) {
         alert('Cookie Mode enabled');
         createCookie('compaMode', 1, 500, 1);
      } else {
         alert('Cookie Mode disabled');
         eraseCookie('compaMode', 1);
      }
      window.location.reload();
   }
   document.getElementById('compaMode-inpId').addEventListener('click', function() {
      oldToggle(this);
   }, false);
   genFooter();
   // document.body.getElementsByClassName('cp_content')[0].appendChild(optiFrag);
   function setAcessStorage() {
      var mainTab = document.createElement('table');
      mainTab.setAttribute("id", "keyTable");
      var adderLabel = document.createElement('label');
      var adderSelect = document.createElement('select');
      var linkOpt = document.createElement('option');
      var wildOpt = document.createElement('option');
      var regOpt = document.createElement('option');
      var sOpt = document.createElement('option');
      var selBut = document.createElement('input');
      adderSelect.setAttribute('id', 'linkMode');
      adderSelect.setAttribute('class', 'seleLabel');
      selBut.setAttribute('type', 'button');
      selBut.setAttribute('value', 'Add');
      selBut.setAttribute('id', 'addBut');
      linkOpt.setAttribute('value', 'l');
      sOpt.setAttribute('value', 's');
      sOpt.textContent = "New search query";
      linkOpt.textContent = "New complete URL";
      wildOpt.setAttribute('value', 'w');
      wildOpt.textContent = "New partial URL";
      regOpt.setAttribute('value', 'r');
      regOpt.textContent = "New Regular Expression to match Link";
      adderLabel.appendChild(adderSelect).appendChild(linkOpt);
      adderSelect.appendChild(wildOpt);
      adderSelect.appendChild(regOpt);
      adderSelect.appendChild(sOpt);
      document.getElementById("acKey").appendChild(mainTab);
      document.getElementById("acKey").appendChild(adderLabel).appendChild(selBut);
      selBut.addEventListener('click', function() {
         neoAccess(document.getElementById('linkMode').options[document.getElementById('linkMode').selectedIndex].value);
      }, false);
   }
   setAcessStorage();

   function populateTable() {
      var mainTab = document.getElementById('keyTable');
      mainTab.innerHTML = "";
      var headLine = document.createElement('tr');
      var headKey = document.createElement('td');
      var headLink = document.createElement('td');
      var headEdit = document.createElement('td');
      var headKill = document.createElement('td');
      headLine.setAttribute("class", "firstRow blockhead");
      headLink.textContent = "Target Link or Expression";
      headKey.textContent = "Access Key";
      headEdit.textContent = "Edit";
      headKill.textContent = "Remove";
      mainTab.appendChild(headLine).appendChild(headLink);
      headLine.appendChild(headKey);
      headLine.appendChild(headEdit);
      headLine.appendChild(headKill);
      var d = 0;
      while (readCookie("dKey" + d) !== null) {
         var dLine = document.createElement('tr');
         var dKey = document.createElement('td');
         var dLink = document.createElement('td');
         var dEdit = document.createElement('td');
         var dKill = document.createElement('td');
         dLine.setAttribute('class', 'defRow');
         dLink.textContent = readCookie("dLink" + d);
         dKey.textContent = readCookie("dKey" + d);
         dEdit.setAttribute('id', d + "-editDefault");
         dEdit.addEventListener('click', function() {
            editDefault(parseInt(this.id));
         }, false);
         dLine.appendChild(dLink);
         dLine.appendChild(dKey);
         dLine.appendChild(dEdit);
         dLine.appendChild(dKill);
         mainTab.appendChild(dLine);
         d++;
      }
      var c = 0;
      while (readCookie("aKey" + c) !== null) {
         var nLine = document.createElement('tr');
         var nKey = document.createElement('td');
         var nLink = document.createElement('td');
         var nEdit = document.createElement('td');
         var nKill = document.createElement('td');
         var linkA = document.createElement('a');
         nLine.setAttribute('class', 'normRow');
         if (readCookie("aMode" + c) == "l") {
            if (/^https?:\/\//.test(readCookie("aLink" + c))) {
               linkA.href = readCookie("aLink" + c);
               linkA.textContent = readCookie("aLink" + c).replace(/^https?:\/\//, "");
            } else {
               linkA.href = "https://" + readCookie("aLink" + c);
               linkA.textContent = readCookie("aLink" + c);
            }
            nLink.appendChild(linkA);
         } else if (readCookie("aMode" + c) == "s") {
            if (/^https?:\/\//.test(readCookie("aLink" + c))) {
               linkA.href = readCookie("aLink" + c);
               linkA.textContent = "Search for: " + readCookie("aQuery" + c);
            } else {
               linkA.href = "https://" + readCookie("aLink" + c);
               linkA.textContent = "Search for: " + readCookie("aQuery" + c);
            }
            nLink.appendChild(linkA);
         } else if (readCookie("aMode" + c) == "w") {
            nLink.textContent = "Link containing \"" + readCookie("aLink" + c) + "\"";
         } else if (readCookie("aMode" + c) == "r") {
            nLink.innerHTML = "Link matching <i>/" + readCookie("aLink" + c) + "/</i>";
         }
         nKey.textContent = readCookie("aKey" + c);
         nKill.setAttribute('id', c + "-kill");
         nEdit.setAttribute('id', c + "-edit");
         nKill.addEventListener('click', function() {
            murder(parseInt(this.id));
         }, false);
         nEdit.addEventListener('click', function() {
            editC(parseInt(this.id));
         }, false);
         nLine.appendChild(nLink);
         nLine.appendChild(nKey);
         nLine.appendChild(nEdit);
         nLine.appendChild(nKill);
         mainTab.appendChild(nLine);
         c++;
      }
   }
   populateTable();

   function neoAccess(mode) {
      var lWord = "link";
      var linkPut;
      if (mode == 'r') {
         lWord = 'Expression';
      }
      if (mode == 's') {
         lWord = 'query';
      }
      linkPut = prompt('Enter ' + lWord);
      var keyPut = prompt('Enter access Key').toUpperCase();
      var unFil = linkPut;
      var cid = 0;
      var defCheck = 0;
      if (!linkPut || !keyPut || keyPut.length != 1) {
         alert('invalid input!');
         return;
      }
      if (mode == 's') {
         linkPut = advaSearch(linkPut, 1);
      }
      while (readCookie('dKey' + defCheck) !== null) {
         if (readCookie('dKey' + defCheck) == keyPut) {
            alert("This Access Key is already assigned elsewhere.");
            return;
         }
         defCheck++;
      }
      while (readCookie('aMode' + cid) !== null) {
         if (readCookie('aKey' + cid) == keyPut) {
            alert("This Access Key is already assigned elsewhere.");
            return;
         }
         if (readCookie('aLink' + cid) == linkPut && readCookie('aMode' + cid) == mode) {
            alert("This " + lWord + " is already assigned to another Access Key.");
            return;
         }
         cid++;
      }
      createCookie('aKey' + cid, keyPut, 500);
      createCookie('aLink' + cid, linkPut, 500);
      createCookie('aMode' + cid, mode, 500);
      if (mode == 's') {
         createCookie('aQuery' + cid, unFil, 500);
      }
      populateTable();
   }

   function editC(tget) {
      var lWord = "link";
      var saveRy;
      var linkPut;
      var cid = 0;
      var defCheck = 0;
      if (readCookie('aMode' + tget) == 'r') lWord = 'expression';
      if (readCookie('aMode' + tget) == 's') lWord = 'query';
      if (readCookie('aMode' + tget) == 's') {
         linkPut = prompt('Enter new ' + lWord, readCookie('aQuery' + tget));
      } else {
         linkPut = prompt('Enter new ' + lWord, readCookie('aLink' + tget));
      }
      if (readCookie('aMode' + tget) == 's') {
         saveRy = linkPut;
         linkPut = advaSearch(linkPut, 1);
      }
      var keyPut = prompt('Enter new access Key', readCookie('aKey' + tget)).toUpperCase();
      if (!linkPut || !keyPut || keyPut.length != 1) {
         alert('invalid input!');
         return;
      }
      while (readCookie('dKey' + defCheck) !== null) {
         if (readCookie('dKey' + defCheck) == keyPut) {
            alert("This Access Key is already assigned elsewhere.");
            return;
         }
         defCheck++;
      }
      while (readCookie('aMode' + cid) !== null) {
         if (readCookie('aKey' + cid) == keyPut && readCookie('aKey' + cid) != readCookie('aKey' + tget)) {
            alert("This Access Key is already assigned elsewhere.");
            return;
         }
         if (readCookie('aLink' + cid) == linkPut && readCookie('aMode' + cid) == readCookie('aMode' + tget) && readCookie('aLink' + cid) != readCookie('aLink' + tget)) {
            alert("This " + lWord + " is already assigned to another Access Key");
            return;
         }
         cid++;
      }
      createCookie('aLink' + tget, linkPut, 500);
      createCookie('aKey' + tget, keyPut, 500);
      if (readCookie('aMode' + tget) == 's') {
         createCookie('aQuery' + tget, saveRy, 500);
      }
      populateTable();
   }

   function editDefault(dtget) {
      var keyPut = prompt("Enter new Access Key:", readCookie('dKey' + dtget)).toUpperCase();
      var defCheck = 0;
      var cid = 0;
      if (!keyPut || keyPut.length != 1) {
         keyPut = "";
      }
      while (readCookie('dKey' + defCheck) !== null) {
         if ((readCookie('dKey' + defCheck) == keyPut) && (readCookie('dLink' + defCheck) != readCookie('dLink' + dtget)) && keyPut.length !== 0) {
            alert("This Access Key is already assigned elsewhere.");
            return;
         }
         defCheck++;
      }
      while (readCookie('aMode' + cid) !== null) {
         if (readCookie('aKey' + cid) == keyPut && keyPut != readCookie('dKey' + dtget)) {
            alert("This Access Key is already assigned elsewhere.");
            return;
         }
         cid++;
      }
      createCookie('dKey' + dtget, keyPut, 500);
      populateTable();
   }

   function murder(victim) {
      var searC = false;
      var sortNum = victim + 1;
      eraseCookie("aLink" + victim);
      eraseCookie("aKey" + victim);
      eraseCookie("aMode" + victim);
      if (readCookie("aQuery" + victim) !== null) {
         eraseCookie("Query" + victim);
         searC = true;
      }
      while (readCookie("aKey" + sortNum) !== null) {
         createCookie("aKey" + (sortNum - 1), readCookie("aKey" + sortNum), 500);
         createCookie("aLink" + (sortNum - 1), readCookie("aLink" + sortNum), 500);
         createCookie("aMode" + (sortNum - 1), readCookie("aMode" + sortNum), 500);
         if (searC === true) {
            createCookie("aQuery" + (sortNum - 1), readCookie("aQuery" + sortNum), 500);
         }
         eraseCookie("aKey" + sortNum);
         eraseCookie("aLink" + sortNum);
         eraseCookie("aMode" + sortNum); {
            eraseCookie("aQuery" + sortNum);
         }
         sortNum++;
      }
      populateTable();
   }

   function setUserStorage() {
      if (readCookie('nameActive') === null) {
         return;
      }
      var mainUsTab = document.createElement('table');
      mainUsTab.setAttribute("id", "userTable");
      document.getElementById("usNamer").appendChild(mainUsTab);
   }
   setUserStorage();

   function populateUsers() {
      if (readCookie('nameActive') === null) {
         return;
      }
      var mainUsTab = document.getElementById('userTable');
      mainUsTab.innerHTML = "";
      var headerLine = document.createElement('tr');
      var headerKey = document.createElement('td');
      var headerLink = document.createElement('td');
      var headerTit = document.createElement('td');
      var headerEdit = document.createElement('td');
      var headerKill = document.createElement('td');
      headerLine.setAttribute("class", "firstRow blockhead");
      headerLink.textContent = "Username";
      headerKey.textContent = "Replacement";
      headerEdit.textContent = "Edit";
      headerTit.textContent = "Usertitle";
      headerKill.textContent = "Remove";
      mainUsTab.appendChild(headerLine).appendChild(headerLink);
      headerLine.appendChild(headerKey);
      headerLine.appendChild(headerTit);
      headerLine.appendChild(headerEdit);
      headerLine.appendChild(headerKill);
      var c = 0;
      while (readCookie("regId" + c) !== null) {
         var UsLine = document.createElement('tr');
         var UsKey = document.createElement('td');
         var UsLink = document.createElement('td');
         var UsEdit = document.createElement('td');
         var UsTit = document.createElement('td');
         var UsKill = document.createElement('td');
         var linkUs = document.createElement('a');
         UsLine.setAttribute('class', 'normRow');
         linkUs.href = "https://withthewill.net/members/" + readCookie("regId" + c) + "?tab=aboutme#aboutme";
         linkUs.textContent = readCookie("oriNam" + c);
         UsLink.appendChild(linkUs);
         UsKey.textContent = readCookie("newNam" + c);
         if (readCookie('newTit' + c) !== null) {
            UsTit.textContent = readCookie("newTit" + c);
         }
         UsKill.setAttribute('id', c + "-UsKill");
         UsEdit.setAttribute('id', c + "-UsEdit");
         UsKill.addEventListener('click', function() {
            killUser(parseInt(this.id));
         }, false);
         UsEdit.addEventListener('click', function() {
            editU(parseInt(this.id));
         }, false);
         UsLine.appendChild(UsLink);
         UsLine.appendChild(UsKey);
         UsLine.appendChild(UsTit);
         UsLine.appendChild(UsEdit);
         UsLine.appendChild(UsKill);
         mainUsTab.appendChild(UsLine);
         c++;
      }
   }
   populateUsers();

   function editU(tgetter) {
      var lWord = "name";
      if (readCookie('oriNam' + tgetter) == 'r') lWord = 'expression';
      var namPut = prompt('Enter new ' + lWord + ":", readCookie('newNam' + tgetter));
      var titPut = prompt('Enter new usertitle:', readCookie('newTit' + tgetter).replace(/( +)?\(Banned\)/i, "")).replace(/( +)?\(Banned\)/i, "");
      if (titPut.match(/(^| |\()banned(\b|\!|\))/i) || namPut.match(/(^| |\()banned(\b|\!|\))/i)) {
         alert('nope');
         return;
      }
      if (readCookie('newTit' + tgetter) == "Banned") {
         titPut += " (Banned)";
      }
      if (!namPut) {
         alert('Invalid Input!');
         return;
      }
      if (namPut) {
         createCookie('newNam' + tgetter, namPut, 500);
      }
      if (titPut) {
         if (readCookie('newTit' + tgetter).match(/( +)?\(Banned\)/i)) {
            createCookie('newTit' + tgetter, titPut + " (Banned)", 500);
         } else {
            createCookie('newTit' + tgetter, titPut, 500);
         }
      }
      populateUsers();
   }

   function killUser(voctom) {
      var sorterNum = voctom + 1;
      eraseCookie("newNam" + voctom);
      eraseCookie("regId" + voctom);
      eraseCookie("oriNam" + voctom);
      eraseCookie("newTit" + voctom);
      while (readCookie("regId" + sorterNum) !== null) {
         createCookie("regId" + (sorterNum - 1), readCookie("regId" + sorterNum), 500);
         createCookie("newNam" + (sorterNum - 1), readCookie("newNam" + sorterNum), 500);
         createCookie("oriNam" + (sorterNum - 1), readCookie("oriNam" + sorterNum), 500);
         createCookie("newTit" + (sorterNum - 1), readCookie("newTit" + sorterNum), 500);
         eraseCookie("regId" + sorterNum);
         eraseCookie("newNam" + sorterNum);
         eraseCookie("oriNam" + sorterNum);
         eraseCookie("newTit" + sorterNum);
         sorterNum++;
      }
      populateUsers();
   }
   var submitter = document.getElementById("finalcheck");
   var deleter = document.getElementById("AllDelete");
   submitter.addEventListener("click", function() {
      checkopt(document.getElementById('menStart'));
   }, false);
   deleter.addEventListener("click", function() {
      allReset(document.getElementById('menStart'));
   }, false);
   boxCheck(document.getElementById('menStart'));
   textCheck(document.getElementById('menStart'));
   discheck();
   var exporter = document.getElementById("exportation");
   exporter.addEventListener("click", function() {
      exSet(document.getElementById('menStart'));
   }, false);
   var importer = document.getElementById("importation");
   importer.addEventListener("click", function() {
      impSet();
   }, false);
}

function CharFix(lisTarget) {
   if (readCookie("uniFix") === null) {
      return;
   }
   for (var i = 0; i < lisTarget.length; i++) {
      lisTarget[i].innerHTML = lisTarget[i].innerHTML.replace(/&amp;/g, "&");
   }
}

function searchFunc() {
   if (/search\.php/.test(window.location.href) && readCookie("squer") !== null && readCookie("querKeep") !== null) {
      document.getElementById('navbar_search').getElementsByClassName('textbox')[0].value = readCookie("squer");
   }
   if (window.location.pathname.split('/')[1] !== "search.php" && !/tags\.php\?tag=/.test(window.location.href)) {
      eraseCookie("squer");
      return;
   }
   var resList = document.getElementsByClassName("postcontent");
   CharFix(resList);

   function searchRestrict() {
      if (readCookie("searchNum") === null) {
         return;
      }
      var numResults = document.getElementsByClassName('imodselector').length;
      var limitSearch = parseInt(readCookie("searchNum"));
      var sLinks = document.getElementsByTagName('a');
      if (limitSearch != 25 && !window.location.href.match("&pp=") && ((limitSearch < numResults && limitSearch < 25) || numResults == 25)) {
         window.location.href = window.location.href + '&pp=' + limitSearch + "#pagetitle";
      }
      for (var i = 0; i < sLinks.length; i++) {
         sLinks[i].href = sLinks[i].href.replace(/&pp=(&|$)/, "&pp=" + limitSearch + "&");
      }
      document.getElementById("pagination_top").getElementsByTagName("form")[0].setAttribute('action', 'javascript:void(0);');
      var jumpPut = document.getElementsByClassName("jumptopage")[0].getElementsByTagName("label")[0].getElementsByTagName("input")[0];
      var jumpBut = document.getElementsByClassName("jumptopage")[0].getElementsByClassName("button")[0];
      jumpPut.addEventListener("keydown", keyDowns, false);

      function keyDowns(e) {
         if (e.keyCode == 13) {
            pageJump(jumpPut.value);
         }
      }

      function pageJump(trgt) {
         window.location.href = window.location.href.split("&")[0] + "&pp=" + readCookie("searchNum") + "&page=" + trgt;
         //window.location.reload();
      }
      jumpBut.setAttribute("type", "button");
      jumpBut.addEventListener("click", function() {
         pageJump(jumpPut.value);
      }, false);
   }

   function noLight() {
      if (readCookie("lightsOff") === null) return;
      var anchoRage = document.getElementsByClassName('searchresults block')[0].getElementsByTagName('a');
      for (var i = 0; i < anchoRage.length; ++i) {
         anchoRage[i].href = anchoRage[i].href.replace(/(\?|&)highlight=[^#]+/, '');
      }
   }
   noLight();

   function openRes(newT, unT, lastP) {
      var finaLlink;
      var selectRes;
      var rBit = document.body.getElementsByClassName('threadbit');
      for (var i = 0; i < rBit.length; ++i) {
         console.log(i);
         if (rBit[i].querySelectorAll('div[id="below_unread"]').length !== 0) {
            if (newT) {
               break;
            } else {
               continue;
            }
         }
         if (unT) {
            selectRes = rBit[i].getElementsByClassName('threadtitle_unread');
         } else {
            selectRes = rBit[i].getElementsByClassName('title');
         }
         if (selectRes.length !== 0) {
            finaLlink = selectRes[0].href;
            if (lastP) {
               if (!/\?goto=newpost/.test(finaLlink)) finaLlink += "?goto=newpost";
            }
            window.open(finaLlink, '_blank');
         }
      }
   }

   function bulkInit() {
      if (readCookie('popSearch') === null || document.getElementById('thread') === null) {
         return;
      }
      var bDiv = document.createElement('span');
      bDiv.setAttribute('id', 'bulkySpan');
      bDiv.innerHTML = "Bulk Open: ";
      var newLab = document.createElement('label');
      var newBut = document.createElement('input');
      var unLab = document.createElement('label');
      var unBut = document.createElement('input');
      var lastBut = document.createElement('input');
      var lastLab = document.createElement('label');
      var subBut = document.createElement('input');
      newBut.setAttribute('type', 'checkbox');
      unBut.setAttribute('type', 'checkbox');
      lastBut.setAttribute('type', 'checkbox');
      newBut.setAttribute('name', 'newBut');
      unBut.setAttribute('name', 'unBut');
      lastBut.setAttribute('name', 'lastBut');
      newBut.setAttribute('id', 'newButt');
      unBut.setAttribute('id', 'unButt');
      subBut.setAttribute('type', 'button');
      subBut.setAttribute('value', 'Go!');
      newLab.textContent = "New Results";
      unLab.textContent = "Unread Results";
      lastLab.textContent = "Skip to new post";
      subBut.addEventListener('click', function() {
         openRes(newBut.checked, unBut.checked, lastBut.checked);
      }, false);
      newBut.addEventListener('click', function() {
         checkopt(bDiv);
      }, false);
      lastBut.addEventListener('click', function() {
         checkopt(bDiv);
      }, false);
      unBut.addEventListener('click', function() {
         checkopt(bDiv);
      }, false);
      var mowg = document.getElementsByClassName('searchresults block')[0].getElementsByClassName('searchlisthead')[0];
      if (document.getElementById('below_unread') !== null) {
         bDiv.appendChild(newLab).appendChild(newBut);
      }
      bDiv.appendChild(unLab).appendChild(unBut);
      bDiv.appendChild(lastLab).appendChild(lastBut);
      bDiv.appendChild(subBut);
      mowg.insertBefore(bDiv, mowg.getElementsByClassName('mainsearchstats')[0]);
      boxCheck(bDiv);
   }
   bulkInit();
   if (readCookie("overSearch") !== null) {
      searchRestrict();
   }
}

function threadFuncs() {
   // if (!/net\/threads\//.test(window.location.href)) {
   if (window.location.pathname.split('/')[1] !== "threads") {
      return;
   }
   var rawquote = document.getElementsByClassName('postcontent');
   var misspound = false;

   function poundCheck() {
      if (/#/.test(location.href) && !document.getElementById(location.href.split("#")[1])) {
         misspound = true;
      }
   }

   function poundResolve() {
      if (misspound === true && readCookie("subLinking") !== null) {
         location.href = location.href;
         misspound = false;
      }
   }

   function subLinkGen() {
      if (readCookie("subLinking") === null) {
         return;
      }
      var halodri = document.getElementsByClassName("postcontainer");
      var striga;
      var proto;
      var protolink;
      var idstring;
      var dormant;
      var mondor;
      var exQuote;

      function neutralize(targetList) {
         for (var i = 0; i < targetList.length; ++i) {
            var divli = targetList[i].getElementsByTagName("div");
            for (var d = 0; d < divli.length; ++d) {
               divli[d].className += " nolink";
            }
         }
      }

      function marchOn(proto, elem) {
         for (var i = 0; i < elem.length; ++i) {
            if (!/nolink/.test(elem[i].className) && elem[i].firstElementChild.style.textAlign == "left" && (elem[i].textContent.trim().length) - (elem[i].firstElementChild.textContent.trim().length) === 0) {
               //alert(protolink);
               idstring = elem[i].textContent.match(/\w+/)[0] + "-" + proto;
               elem[i].title = idstring;
               if (elem[i].style.textAlign == "right") {
                  elem[i].id = idstring;
               } else {
                  elem[i].firstElementChild.innerHTML = '<a href="' + location.href.split("#")[0] + "#" + idstring + '">' + elem[i].firstElementChild.innerHTML + '</a>';
               }
            }
         }
      }
      if (/viewfull/.test(location.href)) {
         dormant = '&viewfull=1#';
      } else {
         dormant = "#";
      }
      for (var j = 0; j < halodri.length; ++j) {
         proto = halodri[j].id.split("_")[1];
         protolink = "https://withthewill.net/showthread.php?p=" + proto;
         striga = halodri[j].querySelectorAll('div[style="text-align: right;"]');
         mondor = halodri[j].querySelectorAll('div[style="text-align: center;"]');
         exQuote = halodri[j].getElementsByClassName("quote_container");
         neutralize(exQuote);
         marchOn(proto, striga);
         marchOn(proto, mondor);
      }
   }
   poundCheck();

   function quoteFix() {
      if (readCookie("fixQuote") === null) {
         return;
      }
      for (var i = 0; i < rawquote.length; i++) {
         rawquote[i].innerHTML = rawquote[i].innerHTML.replace(/\[quote author=(.+) link[^\]]+\]/g, '<div class="bbcode_container"><div class="bbcode_quote"><div class="quote_container"><div class="bbcode_quote_container"></div><div class="bbcode_postedby"><img title="Quote" src="images/wtwstyle/misc/quote_icon.png" alt="Quote"> Originally Posted by <strong>' + '$1 ' + '</strong></div><div class="message">').replace(/\[\/quote\]/g, '</div></div></div></div>').replace(/message"><br>/g, 'message">').replace(/<\/div><\/div><\/div><\/div><br>/g, '</div></div></div></div>').replace(/\[size ?= ?([0-9]+pt) ?\]/gi, '<span style="font-size:$1;">').replace(/\[\/size\]/gi, '</span>');
      }
   }
   quoteFix();
   CharFix(rawquote);

   function cutDown(victim) {
      checkopt(victim);
      getpostsats(readCookie("lowerText"), readCookie("upperText"));
   }
   if (readCookie("autoCut") !== null) {
      getpostsats(readCookie("lowerText"), readCookie("upperText"));
   }

   function cutInterface() {
      var dragWrap = document.createElement('div');
      var cutCont = document.createElement('div');
      var cutH = document.createElement('h2');
      var cutBod = document.createElement('div');
      var cutRow = document.createElement('div');
      var cutForm = document.createElement('form');
      var upperDiv = document.createElement('div');
      var upperLabel = document.createElement('label');
      var upperText = document.createElement('input');
      var upperSpan = document.createElement('span');
      var lowerDiv = document.createElement('div');
      var lowerLabel = document.createElement('label');
      var lowerText = document.createElement('input');
      var lowerSpan = document.createElement('span');
      var ApplBut = document.createElement('input');
      var autoCheck = document.createElement('input');
      var autoLabel = document.createElement('label');
      var dangerCheck = document.createElement('input');
      var dangerLabel = document.createElement('label');
      var cbBox = document.createElement('div');
      var colImg = document.createElement('img');
      cutForm.setAttribute('name', 'cutForm');
      colImg.setAttribute('src', 'images/wtwstyle/buttons/collapse_40b.png');
      colImg.setAttribute('id', 'colTog');
      dragWrap.setAttribute('id', 'dragWrap');
      cbBox.setAttribute('id', 'cbBox');
      autoCheck.setAttribute('name', 'autoCut');
      autoCheck.setAttribute('id', 'autoCut-id');
      autoCheck.setAttribute('type', 'checkbox');
      autoLabel.setAttribute('for', 'autoCut-id');
      autoLabel.setAttribute('id', 'autoLabel');
      dangerCheck.setAttribute('name', 'DANGERMODE');
      dangerCheck.setAttribute('id', 'DANGERMODE-id');
      dangerCheck.setAttribute('type', 'checkbox');
      dangerLabel.setAttribute('for', 'DANGERMODE-id');
      ApplBut.addEventListener('click', function() {
         cutDown(cutForm);
      });
      dangerCheck.addEventListener('click', function() {
         checkopt(cutForm);
      });
      autoCheck.addEventListener('click', function() {
         checkopt(cutForm);
      });
      lowerText.addEventListener('focus', function() {
         this.style.backgroundColor = "#FFF";
      }, false);
      upperText.addEventListener('focus', function() {
         this.style.backgroundColor = "#FFF";
      }, false);
      ApplBut.setAttribute('type', "button");
      ApplBut.setAttribute('class', "button");
      ApplBut.setAttribute('value', "Cutoff!");
      ApplBut.setAttribute('id', "cutoffBut");
      cutCont.setAttribute('class', 'standard_error theigedit');
      cutCont.setAttribute('id', 'textCutter');
      cutH.setAttribute('class', 'drag blockhead');
      cutBod.setAttribute('class', 'blockbody formcontrols theigedit');
      cutRow.setAttribute('class', 'blockrow restore');
      cutForm.setAttribute('name', 'cutForm');
      cutForm.setAttribute('id', 'cutForm');
      upperLabel.setAttribute('for', 'uppertext');
      upperText.setAttribute('class', 'textU');
      upperText.setAttribute('type', 'text');
      upperText.setAttribute('name', 'upperText');
      upperText.setAttribute('id', 'uppertext');
      lowerLabel.setAttribute('for', 'lowertext');
      lowerText.setAttribute('class', 'textU');
      lowerText.setAttribute('type', 'text');
      lowerText.setAttribute('name', 'lowerText');
      lowerText.setAttribute('id', 'lowertext');
      lowerLabel.textContent = 'Lower Limit: ';
      upperSpan.textContent = " words";
      upperLabel.textContent = 'Upper Limit: ';
      lowerSpan.textContent = " words";
      dangerLabel.textContent = "Dangerous Mode";
      autoLabel.textContent = "Auto Mode";
      cutH.textContent = "Word Count Settings";
      upperDiv.appendChild(upperLabel);
      upperDiv.appendChild(upperText);
      upperDiv.appendChild(upperSpan);
      lowerDiv.appendChild(lowerLabel);
      lowerDiv.appendChild(lowerText);
      lowerDiv.appendChild(lowerSpan);
      cutCont.appendChild(cutH);
      cutH.appendChild(colImg);
      cutCont.appendChild(cutBod).appendChild(cutRow).appendChild(cutForm).appendChild(upperDiv);
      cutForm.appendChild(lowerDiv);
      cutForm.appendChild(cbBox).appendChild(autoLabel).appendChild(autoCheck);
      cutForm.appendChild(ApplBut);
      if (readCookie("dangerBut") !== null) {
         cbBox.appendChild(dangerLabel).appendChild(dangerCheck);
         ApplBut.style.marginTop = "15px";
      }
      if (readCookie("textCutter-posTop") !== null && readCookie("textCutter-posLeft") !== null) {
         cutCont.style.top = readCookie("textCutter-posTop");
         cutCont.style.left = readCookie("textCutter-posLeft");
      }
      document.getElementsByClassName('body_wrapper')[0].appendChild(dragWrap).appendChild(cutCont);
      if (!isElementInViewport(cutCont)) {
         cutCont.style.top = "20px";
         cutCont.style.right = "20px";
         cutCont.style.left = "auto";
      }
   }

   function fieldCollapse() {
      if (readCookie("collap") !== null) {
         lapsed = true;
      }
      if (lapsed === false) {
         document.querySelectorAll('.formcontrols.theigedit')[0].style.display = 'none';
         document.getElementById("colTog").style.transform = "rotate(180deg)";
         createCookie("collap", "1", 500);
         lapsed = true;
      } else if (lapsed === true) {
         document.querySelectorAll('.formcontrols.theigedit')[0].style.display = 'block';
         document.getElementById("colTog").style.transform = "rotate(0deg)";
         eraseCookie("collap");
         lapsed = false;
      }
   }

   function checkLapse() {
      if (readCookie("collap") !== null) {
         document.querySelectorAll('.formcontrols.theigedit')[0].style.display = 'none';
         document.getElementById("colTog").style.transform = "rotate(180deg)";
      }
   }
   if (readCookie("textCut") !== null) {
      cutInterface();
      textCheck(document.getElementById('cutForm'));
      boxCheck(document.getElementById('cutForm'));
      var lapsed = false;
      var hibi = document.getElementById('colTog');
      hibi.addEventListener('click', function() {
         fieldCollapse();
      }, false);
      checkLapse();
   }

   function userStruct() {
      var conts = document.getElementsByClassName('userinfo');
      for (var i = 0; i < conts.length; ++i) {
         if (conts[i].getElementsByTagName('strong').length === 0) continue;
         var NaM = conts[i].getElementsByClassName('username')[0].textContent.trim();
         var fid = conts[i].getElementsByClassName('username')[0].href.replace(/(?:.+)?members\/([0-9]+)(?:.+)?/, "$1");
         var normTit = conts[i].getElementsByClassName('usertitle')[0].textContent.trim();
         var newLi = document.createElement('li');
         var newA = document.createElement('a');
         newLi.setAttribute('class', 'right theigedit');
         newA.textContent = "rename";
         newA.setAttribute('class', 'siteicon_forum theigedit');

         function setArgs(mog, mag, mig) {
            newA.addEventListener('click', function() {
               userSelect(mog, mag, mig);
            }, false);
         }
         setArgs(NaM, fid, normTit);
         conts[i].getElementsByClassName('memberaction_body')[0].appendChild(newLi).appendChild(newA);
      }
   }
   userStruct();

   function userSelect(Uname, idNum, nTit) {
      if (idNum == 3963) {
         var theigFirm = confirm('You DARE rename the one who wrote this script??????');
         if (theigFirm === false) {
            return;
         }
      }
      var usNum = 0;
      while (readCookie('regId' + usNum) !== null) {
         if (readCookie('regId' + usNum) == idNum) {
            alert("This user is already renamed!");
            return;
         }
         usNum++;
      }
      var rePut = prompt('Enter new name', Uname);
      var cusTit = prompt('New custom usertitle:', nTit);
      if (cusTit.match(/(^| |\()banned(\b|\!|\))/i) || rePut.match(/(^| |\()banned(\b|\!|\))/i)) {
         alert('nope');
         return;
      }
      if (cusTit != nTit && nTit == "Banned") {
         cusTit += " (Banned)";
      }
      if (rePut == Uname && cusTit == nTit) {
         return;
      }
      if (!rePut) {
         alert('invalid replacement');
         return;
      }
      createCookie('regId' + usNum, idNum, 500);
      createCookie('oriNam' + usNum, Uname, 500);
      createCookie('newNam' + usNum, rePut, 500);
      createCookie('newTit' + usNum, cusTit, 500);
      alert('user succesfully renamed');
      if (readCookie('nameActive') === null) {
         createCookie('nameActive', "1", 500);
         createCookie('repActive', "1", 500);
      }
      window.location.reload();
   }

   function dangerActivator() {
      if (document.getElementById('DANGERMODE-id').checked) {
         if (readCookie("DANGERMODE", 1) === null) {
            createCookie("DANGERMODE", 1, 0, 1);
            console.log("Danger Mode Activated");
            //createCookie("DANGERMODE", 1);
         }
      } else {
         eraseCookie("DANGERMODE", 1);
         eraseCookie("DANGERMODE", 1);
         console.log("DANGER MODE deactivated!");
      }
   }
   if (readCookie("dangerBut") !== null) {
      var hobo = document.getElementById('DANGERMODE-id');
      hobo.addEventListener("click", dangerActivator, false);
   }
   subLinkGen();
   poundResolve();
}

function moreColli() {
   if (readCookie("colmore") === null) {
      return
   }
   var nopo;
   var virgo;
   var nopossi;
   var vago = document.getElementById("wgo");
   if (vago) {
      virgo = vago.getElementsByClassName("blockbody")[0]
      virgo.id = vago.id + "-body";
      adcolla(virgo, vago.getElementsByClassName("blockhead")[0]);
   }
   vago = document.getElementById("quick_reply");
   if (vago) {
      virgo = vago.getElementsByClassName("wysiwyg_block")[0];
      virgo.id = vago.id + "-body";
      adcolla(virgo, document.getElementById("quickreply_title"));
   }
   vago = document.getElementById("thread_info");
   if (vago) {
      virgo = vago.getElementsByClassName("inner_block")[0]
      virgo.id = vago.id + "-body";
      adcolla(virgo, vago.getElementsByClassName("blockhead")[0]);
   }
   vago = document.querySelectorAll('form[action="profile.php?do=updateoptions"]')[0];
   if (vago) {
      virgo = vago.getElementsByClassName("blockbody")[0]
      virgo.id = vago.id + "-body";
      adcolla(virgo, vago.getElementsByClassName("blockhead")[0]);
   }
   vago = document.getElementById("pmfolderlist");
   if (vago) {
      virgo = vago.getElementsByClassName("blockbody")[0]
      virgo.id = vago.id + "-body";
      adcolla(virgo, vago.getElementsByClassName("blockhead")[0]);
   }
   vago = document.getElementById("userlist");
   if (vago) {
      virgo = vago.getElementsByClassName("blockbody")[0]
      virgo.id = vago.id + "-body";
      adcolla(virgo, vago.getElementsByClassName("blockhead")[0]);
   }
   vago = document.getElementById("subscription_info");
   if (vago) {
      virgo = vago.getElementsByTagName("dl")[0]
      virgo.id = vago.id + "-body";
      adcolla(virgo, vago.getElementsByTagName("h5")[0]);
   }
   vago = document.getElementById("usercp_nav");
   if (vago) {
      var dongo = vago.getElementsByClassName("block");
      for (var i = 0; i < dongo.length; ++i) {
         adcolla(dongo[i].getElementsByClassName("blockbody")[0], dongo[i].getElementsByClassName("blockhead")[0]);
      }
   }
   vago = document.getElementsByClassName("searchresults");
   for (var i = 0; i < vago.length; ++i) {
      nopo = document.getElementById("searchbits");
      nopo.id = vago[i].id + "-body";
      adcolla(nopo, vago[i].getElementsByClassName("mainsearchstats")[0]);
   }
   vago = document.getElementsByClassName("forumbits");
   for (var i = 0; i < vago.length; ++i) {
      nopo = vago[i].getElementsByTagName("ol")[0];
      nopo.id = vago[i].id + "-" + i + "-body";
      adcolla(nopo, vago[i].getElementsByTagName("h2")[0]);
   }
   vago = document.getElementsByClassName("threadlist");
   for (var i = 0; i < vago.length; ++i) {
      nopo = vago[i].getElementsByTagName("ol")[0];
      if (vago[i].getElementsByTagName("ol").length === 2) {
         nopossi = vago[i].getElementsByTagName("ol")[1];
         nopossi.id = vago[i].id + "-" + i + "-body_2";
      }
      nopo.id = vago[i].id + "-" + i + "-body";
      adcolla(nopo, vago[i].getElementsByClassName("threadlisthead")[0], nopossi);
   }
   vago = document.getElementsByClassName("postcontainer");
   for (var i = 0; i < vago.length; ++i) {
      nopo = vago[i].getElementsByClassName("postdetails")[0]
      nopo.id = vago[i].id + "-body";
      adcolla(nopo, vago[i].getElementsByClassName("nodecontrols")[0]);
   }
}

function addInfo() {
   var ganymede = "";
   if (readCookie("exmode") !== null) {
      ganymede = " Extended Edition"
   }
   var copyfoot = document.getElementById("footer_copyright");
   var myright = document.createElement("div")
   myright.id = "WES-right"
   myright.innerHTML = "<br/>Extended with Theigno's WithTheWill Enhancement Suite" + ganymede + " " + scriptovers;
   copyfoot.appendChild(myright);
}

function moreMem() {
   if (window.location.pathname.split(/\/|\./)[1] !== "memberlist" || readCookie("dayPost") == null) {
      return;
   }
   var tableo = document.getElementById("memberlist_table");
   var dayble = document.createElement("th")
   var dayblec = document.createElement("span");
   dayblec.className = "blocksubhead"
   dayblec.textContent = "Posts Per Day";
   dayble.appendChild(dayblec)
   var hurks = tableo.getElementsByClassName("columnsort")[0];
   var harks = hurks.getElementsByTagName("th")[5];
   var morg = harks.parentNode.insertBefore(dayble, harks)
   var tablist = tableo.getElementsByTagName("tr");
   var nextable;
   for (var i = 1; i < tablist.length; ++i) {
      var daters = tablist[i].getElementsByClassName('joindate')[0].textContent;
      var posters = parseInt(tablist[i].getElementsByClassName('postcount')[0].textContent.replace(",", ""))
      var nowDa = new Date();
      var pdNum = (posters / Math.round(daysBetween(datinator(daters), nowDa))).toFixed(2)
      nextable = document.createElement("td");
      nextable.textContent = pdNum;
      nextable.className = "ppd"
      tablist[i].insertBefore(nextable, tablist[i].getElementsByClassName("lastvisit")[0])
   }
}
unNotice();
defaultSettings();
unhidify()
cssOverride();
expandStats();
replyRino();
bodyRep();
killNames();
togSearch();
StreamIvity();
accessOverride();
bannLink();
deployMenu();
moreColli();
searchFunc();
threadFuncs();
moreMem();
addInfo();
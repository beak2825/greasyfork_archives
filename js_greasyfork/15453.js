// ==UserScript==
// @name        ReleaseBB rlsbb TV Show Tracker
// @description Follow TV Shows on rlsbb.ru and swiftly find new episodes
// @namespace   drdre
// @license     MIT
// @icon        https://proxybb.com/wp-content/uploads/2021/02/favicon.ico
// @include     /^https?:\/\/(www\.)?rlsbb\.com\/(\?.+)?$/
// @include     /^https?:\/\/(www\.)?rlsbb\.com\/page\/\d+\/?.*/
// @include     /^https?:\/\/(www\.)?rlsbb\.com\/category\/tv-shows\/(page\/\d+\/?)?$/
// @include     /^https?:\/\/(www\.)?rlsbb\.com\/\?s=.+&submit=Find$/
// @include     /^https?:\/\/(www\.)?rlsbb\.com\/search/.*$/
// @include     /^https?:\/\/(www\.)?rlsbb\.(to|ru)\/(\?.+)?$/
// @include     /^https?:\/\/(www\.)?rlsbb\.(to|ru)\/page\/\d+\/?.*/
// @include     /^https?:\/\/(www\.)?rlsbb\.(to|ru)\/category\/tv-shows\/(page\/\d+\/?)?$/
// @include     /^https?:\/\/(www\.)?rlsbb\.(to|ru)\/\?s=.+&submit=Find$/
// @include     /^https?:\/\/(www\.)?rlsbb\.(to|ru)\/search/.*$/
// @include     /^https?:\/\/(www\.)?proxybb\.com\/(\?.+)?$/
// @include     /^https?:\/\/(www\.)?proxybb\.com\/page\/\d+\/?.*/
// @include     /^https?:\/\/(www\.)?proxybb\.com\/category\/tv-shows\/(page\/\d+\/?)?$/
// @include     /^https?:\/\/(www\.)?proxybb\.com\/\?s=.+&submit=Find$/
// @include     /^https?:\/\/(www\.)?proxybb\.com\/search/.*$/
// @include     /^https?:\/\/(www\.)?rlsbb\.unblockit\.(id|onl|ws|kim)\/(\?.+)?$/
// @include     /^https?:\/\/(www\.)?rlsbb\.unblockit\.(id|onl|ws|kim)\/page\/\d+\/?.*/
// @include     /^https?:\/\/(www\.)?rlsbb\.unblockit\.(id|onl|ws|kim)\/category\/tv-shows\/(page\/\d+\/?)?$/
// @include     /^https?:\/\/(www\.)?rlsbb\.unblockit\.(id|onl|ws|kim)\/\?s=.+&submit=Find$/
// @include     /^https?:\/\/(www\.)?rlsbb\.unblockit\.(id|onl|ws|kim)\/search/.*$/
// @include     /^https?:\/\/(www\.)?releasebb\.net\/(\?.+)?$/
// @include     /^https?:\/\/(www\.)?releasebb\.net\/page\/\d+\/?.*/
// @include     /^https?:\/\/(www\.)?releasebb\.net\/category\/tv-shows\/(page\/\d+\/?)?$/
// @include     /^https?:\/\/(www\.)?releasebb\.net\/\?s=.+&submit=Find$/
// @include     /^https?:\/\/(www\.)?releasebb\.net\/search/.*$/

// @exclude     https://www.rlsbb.ru/maintenance.html
// @exclude     https://www.rlsbb.com/maintenance.htm
// @exclude     https://rlsbb.ru/maintenance.html
// @exclude     https:/rlsbb.com/maintenance.html
// @exclude     https:/releasebb.net/maintenance.html
// @version     20

// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlHttpRequest
// @grant       GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/15453/ReleaseBB%20rlsbb%20TV%20Show%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/15453/ReleaseBB%20rlsbb%20TV%20Show%20Tracker.meta.js
// ==/UserScript==
"use strict";


var nukes = ["PROPER","REPACK","RERIP","UPDATE","REAL"];



function pad2(i) {
  if(i < 10 && i > -10) {
     return "0"+parseInt(i,10)
  }
  return ""+parseInt(i,10);
}

function int(s) {
  return parseInt(s,10);
}

function float(s) {
  return parseFloat(s);
}

function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }

function parseMonthname(name) {
  var o = {"month": "long"};
  for(var i = 0; i < 12; i++) {
    if((new Date(i*2678400000)).toLocaleDateString("en-US", o) == name) {
      return i;
    }
  }
  return -1;
}

function humanBytes(bytes, precision) {
  bytes = parseInt(bytes,10);
  if(bytes === 0) return '0 Byte';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toPrecision(2)) + ' ' + sizes[i];
}

function minutesSince (time) {
  const seconds = ((new Date()).getTime() - time.getTime()) / 1000
  const min = Math.round(seconds / 60)
  if (min < 50) {
     return seconds > 60 ? min + ' min ago' : 'now'
  }
  const h = Math.round(min / 60)
  if (h < 49) {
    return h + ' hour' + (h == 1?'':'s') + ' ago'
  }
  const d = parseInt(h / 24)
  if (d < 365) {
    return d + ' day' + (d == 1?'':'s') + ' ago'
  }
  const years = parseInt(d / 365)
  const daysLeft = d - (years * 365)
  return years + 'y+' + daysLeft + 'day' + (daysLeft === 1?'':'s') + ' ago'
}

function base64BinaryString(s) {
  const base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const l = s.length;
  var o = [];
  var char0,char1,char2,char3;
  var byte0,byte1,byte2;
  var t;
  var i = 0;
  while(i < l) {
    byte0 = s.charCodeAt(i++) & 0xff;
    byte1 = i<l?s.charCodeAt(i++) & 0xff:0;
    byte2 = i<l?s.charCodeAt(i++) & 0xff:0;
    char0 = byte0 >> 2;
    char1 = ((byte0 & 0x3) << 4) | (byte1 >> 4);
    char2 = ((byte1 & 0x0f) << 2) | (byte2 >> 6);
    char3 = byte2 & 0x3f;
    t = i - (l - 1);
    if(t == 1) {
      char3 = 64;
    } else if(t == 2) {
      char3 = 64;
      char2 = 64;
    }
    o.push(base64.charAt(char0), base64.charAt(char1), base64.charAt(char2), base64.charAt(char3));
  }
  return o.join("");
}

function loadCrossSiteImage(url,cb) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  var img0 = document.createElement("img"); // To get image dimensions
  img0.addEventListener("load",function(){
    if(img0.height == 0 || img0.width == 0) return;
    canvas.height = img0.height;
    canvas.width = img0.width;
    GM.xmlHttpRequest ({
      method: 'GET',
      overrideMimeType: 'text/plain; charset=x-user-defined',
      url: url, // Load cross site image into canvase
      onload: function (resp) {
        var dataurl = "data:image/jpeg;base64," + base64BinaryString(resp.responseText);
        var img1 = document.createElement("img"); // Image is already data url, but let's compress it a little bit
        img1.addEventListener("load",function(){
          ctx.drawImage(img1, 0, 0);
          cb(url,canvas.toDataURL("image/jpeg",0.2));
        });
        img1.src = dataurl;
      }
    });
  });
  img0.src = url;
}

function isScrolledIntoView(el) {
    // https://stackoverflow.com/a/22480938
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    // return (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    return elemTop < window.innerHeight && elemBottom >= 0;
}


// #################################


var libversion = false;
var lastlibversion = false;
var records;
var ignoreShows;

var libmaxlifetime = 1000;
var lastlibload = -1;

var mapID2Index = {}; // temporary cache for finding an entry by its ID i.e. unique URL

function addCSS() {
  document.head.appendChild(document.createElement('style')).innerHTML = `
#rlsbbmymainwin {
  position:fixed;
  top:0px;
  left:0px;
  z-index:999;
  font-size: 13px;
}
#rlsbbmymainwin button, #rlsbbmymainwin input {
  padding: 3px;
}
#rlsbbmymainwin ul {
  list-style:none;
  margin: 0 0 0 3px;
}
.rlsbbmy_menu {
  overflow:auto; margin-top:1px; margin-bottom:3px; background: #bbb;
}
.rlsbbmy_button {
  cursor:pointer;
  border-radius: 5px 5px 0 0;
  color: black;
  background: #bbb;
  text-shadow: 1px 1px 0 #eee;
  float: left;
  padding:0px 2px 24px;
  margin: 1px;
  height: 20px;
  text-align: center;
  font-size: 14px;
}
.rlsbbmy_showlister {
  overflow:auto;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  text-align:center;
}
.rlsbbmy_showentry {
  margin:3px 20px 3px 5px;
  min-width:240px;
  min-height:20px;
  font-weight:bolder;
  text-shadow:1px -1px 5px white;
}
.rlsbbmy_showentry_newtag {
  display: inline-block;
  margin-top:20px;
  box-shadow:-3px -3px 8px white;
  background: rgba(255, 255, 0, 0.6);
  border: 2px solid black; color: black;
  font-family: comic sans ms;
  font-weight: normal;
  border-radius:20px 5px 5px 50px;
  padding:0 2px 0 6px;
}
.rlsbbmy_showentry_ignorebutton {
  margin-top: 0px;
  margin-left:220px;
  text-shadow:1px -1px 5px white;
  color:silver;
  cursor:pointer;
}
`
}
async function load() {
  if((new Date()).getTime() - lastlibload < libmaxlifetime) {
    return;
  }
  lastlibload = (new Date()).getTime();
  libversion = int(await GM.getValue("libversion",Number.MIN_SAFE_INTEGER));
  if(lastlibversion == libversion) return;
  records = JSON.parse(await GM.getValue("records","[]"));
  ignoreShows = new Set(JSON.parse(await GM.getValue("ignoreShows","[]")));
  lastlibversion = libversion;
  mapID2Index = {};
}

async function save() {
  if(libversion === false) {
    throw Error("save() cannot be called before load()");
  }
  libversion++;

  if(libversion == Number.MAX_SAFE_INTEGER) {
    libversion = Number.MIN_SAFE_INTEGER;
  }
  await GM.setValue("libversion",libversion);
  records = sortRecordsInPlace(records);
  await GM.setValue("records",JSON.stringify(records));
  await GM.setValue("ignoreShows",JSON.stringify(Array.from(ignoreShows)));
  lastlibversion++;
}
async function saveOnlyRecords() {
  if(libversion === false) {
    throw Error("save() cannot be called before load()");
  }
  libversion++;

  if(libversion == Number.MAX_SAFE_INTEGER) {
    libversion = Number.MIN_SAFE_INTEGER;
  }
  await GM.setValue("libversion",libversion);
  records = sortRecordsInPlace(records);
  await GM.setValue("records",JSON.stringify(records));
  lastlibversion++;
}
async function saveOnlyIgnored() {
  if(libversion === false) {
    throw Error("save() cannot be called before load()");
  }
  libversion++;

  if(libversion == Number.MAX_SAFE_INTEGER) {
    libversion = Number.MIN_SAFE_INTEGER;
  }
  await GM.setValue("libversion",libversion);
  await GM.setValue("ignoreShows",JSON.stringify(Array.from(ignoreShows)));
  lastlibversion++;
}





function getRecordById(id) {
  if(mapID2Index[id]) {
    return records[mapID2Index[id]];
  }
  for(var i = 0; i < records.length; i++) {
    if(records[i].id == id) {
      mapID2Index[id] = i;
      return records[i];
    }
  }
  return false;
}


async function Episode(episode) {
  await load();
  if(typeof episode == "string") {
    return getRecordById(episode);
  } else if("id" in episode) {
    return getRecordById(episode.id);
  } else {
    throw new Error("Wrong format episode:"+JSON.stringify(episode));
  }
}

async function isDownloaded(id) {
  var record = await Episode(id);
  return record.hasOwnProperty("downloaded") && record.downloaded;
}

async function setDownloaded(id) {
  var record = await Episode(id);
  record.downloaded = true;
  await saveOnlyRecords();
}

async function isIgnoredShow(id) {
  var record = await Episode(id);
  if(record.show && ignoreShows.has(record.show)) {
    return true;
  }
  return false;
}


async function ignoreShow(id) {

  if(await isIgnoredShow(id)) {
    return true;
  } else {
    var record = await Episode(id);
    if(record.show) {
      ignoreShows.add(record.show);
      await saveOnlyIgnored();
      return true;
    }
  }
  return false;
}

async function unIgnoreShow(id) {
  if(! await isIgnoredShow(id)) {
    return true;
  } else {
    var record = await Episode(id);
    if(record.show) {
      if(!ignoreShows.has(record.show)) {
        return true;
      } else {
        ignoreShows.delete(record.show);
        await saveOnlyIgnored();
        return true;
      }
    }
  }
  return false;
}

async function toggleIgnoreShow(id) {
  if(await isIgnoredShow(id)) {
    if(await unIgnoreShow(id)) {
      return 1;
    }
  } else {
    if(await ignoreShow(id)) {
      return -1;
    }
  }
  return 0;
}

function removeIgnoredShowsFrom(arr) {
  var narr = arr.filter(function(record){
    return record.show && !ignoreShows.has(record.show);
  });
  return narr;
}

function sortRecordsInPlace(arr) {
  arr.sort(function(a,b) {
    return b.time - a.time;
  });
  return arr;
}

function sortRecordsByTitle(arr) {
  var narr = arr.slice(0);
  narr.sort(function(a,b) {
    return a.title.localeCompare(b.title);
  });
  return narr;
}

async function getLatestEpisodes() {
  await load();
  var episodes = {};
  for(var i = 0; i < records.length; i++) {
    if(("show" in records[i]) && (!(records[i].show in episodes) || episodes[records[i].show].time <= records[i].time)) {
      episodes[records[i].show] = records[i];
    }
  }
  return Object.keys(episodes).map(function (show) {
    return episodes[show];
  });
}

function readPost(post) {

  var entryContent = post.getElementsByClassName("entry-summary")[0];

  var link = post.querySelector('.entry-header .entry-title a');

  var subtitle = post.querySelector('.entry-header .entry-meta');

  var id = link.href;
  var upperCaseContent = entryContent.innerHTML.toUpperCase();
  var isnuke = false;
  let record = getRecordById(id)
  if(record !== false) {
    if(0 == Array.prototype.filter.call(nukes, function(a) { return -1!=upperCaseContent.indexOf(a)}).length) {
      post.querySelectorAll('.postDay').forEach(function (e) {
         const span = e.appendChild(document.createElement('span'))
         span.setAttribute("title", "You already saw this post")
         span.style.cursor = 'help'
         span.appendChild(document.createTextNode('✅'))
         if ("firstSeen" in record) {
           const since = minutesSince(new Date(record.firstSeen))
           span.setAttribute("title", "You already saw this post " + since)
         }
      })
      throw "error_recordexists";
      return;
    } else {
      // It's a nuke
      isnuke = true;
    }
  }

  var time = subtitle.innerHTML.match(/Posted on (\D+) (\d+)\D\D, (\d{4}) at (\d+):(\d{2})\s*(|am|pm)/); // Posted on August 17th, 2014 at 10:47 pm
  var title = trim(link.innerHTML);

  var result = {
    "id": id,
    "title": title,
    "time": (new Date(int(time[3]), parseMonthname(time[1]),int(time[2]), int(time[4])+((time[6] === 'pm' && int(time[4]) !== 12)?12:0), int(time[5]), 0, 0)).getTime(),
    "firstSeen" : new Date().getTime(),
    "release" : []
  };

  var tvshow;

  if((tvshow = title.match(/^(.*)\s(\d+)\xD70*(\d+)\s/)) || (tvshow = title.match(/^(.*)\sS0*(\d+)E0*(\d+)\s/) )) {
    result["show"] = trim(tvshow[1]).toLowerCase();
    result["showWithCase"] = trim(tvshow[1]);
    result["season"] = int(tvshow[2]);
    result["episode"] = int(tvshow[3]);
  }

  // Find actual releasenames of movie
  var strong = entryContent.getElementsByTagName("strong");
  for(let i = 0; i < strong.length; i++) {
    if(strong[i].innerHTML.match(/Release Name:/)) {
      result["release"].push(trim(strong[i].nextSibling.textContent));
    } else if(strong[i].innerHTML.match(/Links:/)) {
      var a = strong[i].parentNode.getElementsByTagName("a");
      var m;
      for(let j = 0; j < a.length; j++) {
        if(m = a[j].href.match(/imdb\.com\/title\/(\w+)/)) {
          result["imdb"] = m[1];
          break;
        }
      }

    }
  }

  // Find actual releasenames of tvshow
  strong = entryContent.getElementsByTagName("strong");
  for(let i = 0; i < strong.length; i++) {
    let m;
    if((m = strong[i].innerHTML.match(/\.(\d+)\xD70*(\d+)\./)) || (m = strong[i].innerHTML.match(/\.S0*(\d+)E0*(\d+)\./) )) {
      result["release"].push(trim(strong[i].innerHTML));
    }
  }

  // Find tvshow image
  var img = false;
  if(entryContent.getElementsByTagName("p").length) {
    if(entryContent.getElementsByTagName("p")[0].getElementsByTagName("img").length) {
      img = entryContent.getElementsByTagName("p")[0].getElementsByTagName("img")[0];
    }
  }
  if("show" in result && img) {
    result["image"] = img.src;
  }

  if("show" in result || "imdb" in result) { // Only save tvshows or movies
    if(isnuke) {
      records[mapID2Index[id]] = result; // Overwrite record
    } else {
      records.push(result); // New record
    }
  }
}

async function readPosts() {
  await load();
  var error_recordexists = false;
  var posts = document.getElementsByClassName("post");
  for(var i = 0; i < posts.length; i++) {
    try {
      readPost(posts[i]);
    } catch(e) {
      if(e == "error_recordexists") {
        error_recordexists = true;
      } else {
        throw e;
      }
    }
  }
  await saveOnlyRecords();
  if(error_recordexists) {
    throw "error_recordexists";
  }
}

function crawl() {
  let crawlto = -1
  if(document.location.href.indexOf("#crawlbackto=") === -1) {
    if(!confirm("Start scanning?\nTo stop the process you'll have to close the tab/window!")) {
      return false;
    }
  } else {
    crawlto = parseInt(document.location.href.split("#crawlbackto=")[1])
  }

  var url = document.querySelector('.navigation a.next.page-numbers').href + "#crawlbackto=" + crawlto;
  document.location.href = url;
}

var mw;
function getMainWindow() {
  const id = "rlsbbmymainwin";
  if(mw) {
    return mw;
  }
  mw = {};
  mw.main = document.createElement("div");
  mw.main.id = id;
  document.body.appendChild(mw.main);

  mw.controls = document.createElement("div");
  mw.main.appendChild(mw.controls);

  mw.menu = document.createElement("div");
  mw.menu.setAttribute("class","rlsbbmy_menu");
  mw.menu.style.maxHeight = (window.innerHeight - 150) + "px";
  mw.main.appendChild(mw.menu);

  mw.lists = document.createElement("div");
  mw.lists.setAttribute("style","");
  mw.main.appendChild(mw.lists);
  return mw;
}

function showButton(title,click) {
  var c = getMainWindow().controls;
  var br = c.getElementsByTagName("br");
  if(br.length) {
    br = br[br.length-1];
  } else {
    br = document.createElement("br");
    br.style = "clear:left";
    c.appendChild(br);
  }

  var b = document.createElement("div");
  b.setAttribute("class", "rlsbbmy_button")
  b.addEventListener("click",click);
  b.addEventListener("mouseover",function() {
    this.dataset.oldbgImage = this.style.backgroundImage;
    this.style.backgroundImage = "linear-gradient(0.50turn, #ccc, #fff, #ccc)";
  });
  b.addEventListener("mouseout",function() {
   if (this.dataset.oldbgImage) {
     this.style.backgroundImage = this.dataset.oldbgImage;
   }
  });
  b.innerHTML = title;
  c.insertBefore(b,br);

}

async function showIgnoreMenu() {
  var c = getMainWindow().menu;
  c.innerHTML = "";
  if(c.dataset.menu == "ignore") {
    c.dataset.menu = "";
    return;
  } else {
    c.dataset.menu = "ignore";
  }

  var allshows = await getLatestEpisodes();
  allshows = sortRecordsByTitle(allshows);

  var ul = document.createElement("ul");
  var li;
  var lis = [];


  // Search by key
  var search = function(s) {
    for(var i = 0; i < lis.length; i++) {
      if(lis[i].textContent.toLowerCase().startsWith(s)) {
        lis[i].scrollIntoView();
        window.scrollY = 0;
        return;
      }
    }
  };

  var search_it = false;
  var search_str = "";
  var keyup = function(ev) {
    search_str += ev.key;
    search(search_str);
    if(search_it !== false) {
      clearTimeout(search_it);
    }
    search_it = setTimeout(function() {
      search_str = "";
    },2000);
  };
  document.body.addEventListener("keyup",keyup,false);


  var toggle = async function(ev) {
    var id = this.dataset.id;
    var status = await toggleIgnoreShow(id);
    if(status == 1) {
      this.style.background = "#99CC99";
    } else if(status == -1) {
      this.style.background = "red";
    } else {
      this.style.background = "yellow";
      alert("An error occurred. Try reloading the page.");
    }
  };

  var ignoreAll = async function(ev, button) {
    if(!confirm("Really ignore all shows?")) return;

    if (button) {
      button.innerHTML = 'Wait..'
      window.setInterval(() => button.innerHTML += '.', 500)
    }

    var allshows = await getLatestEpisodes();

    const promises = []

    for(let i = 0; i < allshows.length; i++) {
      promises.push(ignoreShow(allshows[i].id));
    }
    await Promise.all(promises)
    document.location.reload();
  };

  var showAll = async function(ev) {
    for(let i = 0; i < lis.length; i++) {
      ul.removeChild(lis[i]);
    }
    lis = [];

    for(let i = 0; i < allshows.length; i++) {
      li = document.createElement("li");
      li.setAttribute("data-id",allshows[i].id);
      li.appendChild(document.createTextNode(allshows[i].showWithCase+" S"+ pad2(allshows[i].season)+"E"+pad2(allshows[i].episode)));
      if(await isIgnoredShow(allshows[i].id)) {
        li.style.background = "red";
      } else {
        li.style.background = "#99CC99";
      }
      li.addEventListener("click",toggle,false);
      ul.appendChild(li);
      lis.push(li);
    }
  };

  var b;

  b = document.createElement("button");
  b.innerHTML = "Show all";
  b.addEventListener("click",function() {showAll();},false);
  c.appendChild(b);

  b = document.createElement("button");
  b.innerHTML = "Ignore all";
  b.addEventListener("click",function(ev) {ignoreAll(ev, this);},false);
  c.appendChild(b);



  for(let i = 0; i < allshows.length; i++) {
    if(await isIgnoredShow(allshows[i].id)) {
      continue;
    }
    li = document.createElement("li");
    li.setAttribute("data-id",allshows[i].id);
    li.appendChild(document.createTextNode(allshows[i].showWithCase+" S"+ pad2(allshows[i].season)+"E"+pad2(allshows[i].episode)));
    if(! await isDownloaded(allshows[i])) {
      li.style.background = "white"; // New show
    } else {
      li.style.background = "#99CC99"; // Old show that is not ignored
    }
    li.addEventListener("click",toggle,false);
    ul.appendChild(li);
    lis.push(li);
  }
  c.appendChild(ul);

}




async function showCleanMenu(forceshow) {
  // Toggle Clean Menu
  var c = getMainWindow().menu;
  c.innerHTML = "";
  if(c.dataset.menu == "clean" && forceshow !== true) {
    c.dataset.menu = "";
    return;
  } else {
    c.dataset.menu = "clean";
  }

  await loadImageCache();
  var allshows = await getLatestEpisodes();

  var ul = document.createElement("ul");


  var clearButKeepEpisodes = async function(ev) {
    await load();

    records = records.filter(function(record){
      return "show" in record && record.show;
    });

    await save();
    showCleanMenu(true);
  };

  var clearButKeepEpisodesDeleteIgnored = async function(ev) {
    await load();

    records = records.filter(function(record){
      return "show" in record && record.show && !ignoreShows.has(record.show);
    });

    await save();
    showCleanMenu(true);
  };

  var clearAllImageCache = async function(ev) {
    await GM.setValue("imageCache","{}");

    await loadImageCache();
    showCleanMenu(true);
  };

  var clearOlderThan3Years = async function(ev) {
    if(!confirm('Clear everything older than 3 years?')) return

    await load();

    const cut = (new Date()).getTime() - 3*365*24*60*60*1000

    records = records.filter(function(record){
      return "time" in record && record.time > cut;
    });

    await save();
    showCleanMenu(true);
  };

  var clearImageCacheButKeepEpisodes = async function(ev) {
    await loadImageCache();
    var episodes = await getLatestEpisodes();
    episodes = removeIgnoredShowsFrom(episodes);
    var newImageCache = {}
    for(let i = 0; i < episodes.length; i++) {
      if(episodes[i].image) {
        var url = episodes[i].image;
        if(imageCache[url]) {
          newImageCache[url] = imageCache[url];
        }
      }
    }
    await GM.setValue("imageCache",JSON.stringify(newImageCache));
    await loadImageCache();
    showCleanMenu(true);
  };

  var exportDatabase = async function(button) {
    await load();
		const dateSuffix = (new Date()).toISOString().split('T')[0]
    const a = (button || c).parentNode.appendChild(document.createElement('a'))
    a.download = 'ignoredShows_' + dateSuffix + '.json'
    a.appendChild(document.createTextNode(a.download))
    a.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(Array.from(ignoreShows),null,2))
    window.setTimeout(() => a.click(), 50)
  };

  var importDatabase = async function(fileList) {
    if (fileList.length === 0) {
      return
    }

    let data
    try {
      data = await (new Response(fileList[0])).json()
    } catch (e) {
      window.alert('Could not load/parse JSON file:\n' + e)
      return
    }

    if(!data || !Array.isArray(data)) {
      window.alert('Wrong data type:\n' + data)
      return
    }

    const n = data.length
    if (window.confirm('Found ' + n + ' ignored shows. Continue import?')) {
        await load();
        for(let i = 0; i < data.length; i++) {
          ignoreShows.add(data[i])
        }
        await saveOnlyIgnored();
        showCleanMenu(true);
    }
  };


  var b,li;

  li = document.createElement("li");
  li.appendChild(document.createTextNode("Cleaning options:"))
  c.appendChild(li);

  li = document.createElement("li");
  b = document.createElement("button");
  b.innerHTML = "Keep TV Shows";
  b.addEventListener("click",function() {clearButKeepEpisodes();},false);
  li.appendChild(b)
  c.appendChild(li);

  li = document.createElement("li");
  b = document.createElement("button");
  b.innerHTML = "Keep TV Shows (delete ignored shows)";
  b.addEventListener("click",function() {clearButKeepEpisodesDeleteIgnored();},false);
  li.appendChild(b)
  c.appendChild(li);

  li = document.createElement("li");
  b = document.createElement("button");
  b.innerHTML = "Clear image cache";
  b.addEventListener("click",function() {clearAllImageCache();},false);
  li.appendChild(b)
  c.appendChild(li)

  li = document.createElement("li");
  b = document.createElement("button");
  b.innerHTML = "Clear image cache (keep tracked TV Shows)";
  b.addEventListener("click",function() {clearImageCacheButKeepEpisodes();},false);
  li.appendChild(b)
  c.appendChild(li)

  li = document.createElement("li");
  b = document.createElement("button");
  b.innerHTML = "Clear everything older than 3 years";
  b.addEventListener("click",function() {clearOlderThan3Years();},false);
  li.appendChild(b)
  c.appendChild(li)

  li = document.createElement("li");
  b = document.createElement("button");
  b.innerHTML = "Backup";
  b.addEventListener("click",function() {exportDatabase(this);},false);
  li.appendChild(b)
  c.appendChild(li)

  li = document.createElement("li");
  b = document.createElement("input");
  b.type = "file";
  b.accept = ".json,application/json";
  b.addEventListener("change", function() {importDatabase(this.files);}, false)
  li.appendChild(document.createTextNode("Restore:"))
  li.appendChild(b)
  c.appendChild(li)

  li = document.createElement("li");
  b = document.createElement("input");
  b.value = allshows.length +" TV shows";
  b.disabled = 1;
  li.appendChild(b)
  c.appendChild(li);

  li = document.createElement("li");
  b = document.createElement("input");
  b.value = records.length +" total records";
  b.disabled = 1;
  li.appendChild(b)
  c.appendChild(li);

  li = document.createElement("li");
  b = document.createElement("input");
  GM.getValue("imageCache","").then(function(s) {
      b.value = Object.keys(imageCache).length +" images ("+humanBytes(s.length)+")";
  });
  b.disabled = 1;
  li.appendChild(b)
  c.appendChild(li);





  c.appendChild(ul);
}


var imageCache;
var imageCache_maxlifetimeinmemory = 3000;
var imageCache_lastload = -1;

async function loadImageCache() {
  if((new Date()).getTime() - imageCache_lastload < imageCache_maxlifetimeinmemory) {
    return;
  }
  imageCache_lastload = (new Date()).getTime();

  imageCache = JSON.parse(await GM.getValue("imageCache","{}"));
}

function cacheImage(url,dataurl) {
  imageCache[url] = dataurl;
  GM.setValue("imageCache",JSON.stringify(imageCache));
}

async function showTVShows() {
  addCSS();
  await loadImageCache();
  var loadedImages = 0;
  const maxLoadImagesAtOnce = 20;
  var entriesWithoutLoadedImage = [];

  var confirmedOnce = {};
  var confirmOnce = function(text) {
    if(confirmedOnce[text]) {
      return true;
    } else {
    	if(confirm(text)) {
        confirmedOnce[text] = true;
        return true;
      } else {
        return false;
      }
    }
  };

  var c = getMainWindow().lists;
  var div = document.createElement("div");
  div.setAttribute("class","rlsbbmy_showlister");
  div.style.maxHeight = (window.innerHeight - 150) + "px"
  try {
    var style = window.getComputedStyle(document.body)
    div.style.backgroundImage = style.backgroundImage
    div.style.backgroundRepeat = style.backgroundRepeat
    div.style.backgroundPositionY = '-50px'
  } catch(e) {
    div.style.background = '#bbb'
  }

  const openEpisode = function() {
    const el = this
    if(el.dataset.episodeid) {
      setDownloaded(el.dataset.episodeid).then(function() {
        // Mark grey and remove new tag
        el.style.borderColor = "silver";
        el.style.color = "silver";
        el.removeChild(el.querySelector(".rlsbbmy_showentry_newtag"));
        el.removeChild(el.querySelector(".rlsbbmy_showentry_ignorebutton"));
      });
      window.setTimeout(function() {
        GM.openInTab(el.dataset.episodeid);
         //var record = await Episode(el.dataset.episodeid);
        //window.open("http://www.rlsbb.com/?s=%22"+encodeURIComponent(record.showWithCase)+"%22&submit=Find");
        //window.open("http://rlsbb.com/search/"+encodeURIComponent(record.showWithCase)+"?first");
      }, 0)
    }
  };
  var div_header = document.createElement("div");
  var bg = "background: #bbb;";
  div_header.style = bg+"cursor:pointer;";
  div_header.appendChild(document.createTextNode("TVShows"));
  div.appendChild(div_header);
  var div_select = document.createElement("div");
  div_select.style.display = "none";
  div.appendChild(div_select);

  var onLoadBackgroundImage = async function() {
    let entry = this.parentNode;
    var w = float(entry.clientWidth);
    var img = this;
    if(!img.width || !img.height) {
      entry.removeChild(img);
      return; // Something is wrong with the image!
    }

    entry.style.background = "no-repeat url('"+img.src+"') white";
    var h = Math.ceil(w * (float(img.height)/ float(img.width)));
    entry.style.height = h+"px";
    entry.style.backgroundSize = w+"px "+h+"px";
    entry.removeChild(img);
  };

  div_header.addEventListener("click",async function(ev) {
    // Show/Load TV episodes
    if(div_select.style.display == "block") {
      div_select.style.display = "none";
      return;
    }
    div_select.style.display = "block";
    if(div_select.children.length > 1) {
      return;
    }
    var episodes = await getLatestEpisodes();
    episodes = removeIgnoredShowsFrom(episodes);
    episodes = sortRecordsInPlace(episodes);

    for(let i = 0; i < episodes.length; i++) {
      var entry = document.createElement("div");
      entry.dataset.episodeid = episodes[i].id;
      if(episodes[i].showWithCase.length < 40) {
        entry.appendChild(document.createTextNode(episodes[i].showWithCase+" S"+ pad2(episodes[i].season)+"E"+pad2(episodes[i].episode)));
      } else {
        let span = document.createElement("span");
        span.setAttribute("title", episodes[i].showWithCase+" S"+ pad2(episodes[i].season)+"E"+pad2(episodes[i].episode));
        span.appendChild(document.createTextNode(episodes[i].showWithCase.substr(0,40)+" S"+ pad2(episodes[i].season)+"E"+pad2(episodes[i].episode)));
        entry.appendChild(span);
      }
      entry.addEventListener("click",openEpisode);
      div_select.appendChild(entry);
      entry.setAttribute("class", "rlsbbmy_showentry");
      entry.style = bg;
      if(! await isDownloaded(episodes[i])) { // New episode
        entry.style.textShadow = "1px -1px 5px black";
        entry.style.color = "#ff2";
        entry.style.borderStyle = "solid";
        entry.style.borderColor = "rgba(255, 255, 0, 0.4) yellow"
        entry.style.borderWidth = "1px 1px 1px 6px";

         // NEW tag
        var div_new = document.createElement("div");
        div_new.setAttribute("class","rlsbbmy_showentry_newtag");
        if(episodes[i].image) {
           div_new.style.transform = "rotate("+(310+Math.ceil(Math.random()*20))+"deg)";
        }
        div_new.appendChild(document.createTextNode("\u309C NEW")); //&#12444;
        entry.appendChild(div_new);

        // Ignore button
        var div_ign = document.createElement("div");
        div_ign.setAttribute("class","rlsbbmy_showentry_ignorebutton");
        div_ign.appendChild(document.createTextNode("\u2717")); //&cross;
        div_ign.addEventListener("click",async function(ev) {
            ev.stopPropagation();
            if(confirmOnce("Ignore?")) {
                if(await ignoreShow(this.parentNode.dataset.episodeid)) {
                    this.parentNode.parentNode.removeChild(this.parentNode);
                } else {
                    alert("An error occured!");
                }
            }
        });
        entry.insertBefore(div_ign,entry.firstChild);
      }
      if(episodes[i].image && loadedImages < maxLoadImagesAtOnce) {
        loadedImages++;
        var url = episodes[i].image;

        if(imageCache[url]) {
          url = imageCache[url]
        } else {
          loadCrossSiteImage(url,cacheImage);
        }

        var img = document.createElement("img");
        img.addEventListener("load",onLoadBackgroundImage);
        img.src = url; // Preload background image to get size
        img.style = "max-width:180px; display:none";
        entry.appendChild(img);
      } else if(episodes[i].image) {
        // Enough images loaded already, show them later on scroll event
        entry.dataset.imageurl = episodes[i].image;
        entriesWithoutLoadedImage.push(entry);
      } else {
        entry.style.borderStyle = "solid";
        entry.style.borderWidth = "1px";
      }
    }
  });
  div.addEventListener("scroll",async function(ev) {
    if( entriesWithoutLoadedImage.length == 0) {
      return true;
    }

    var el = entriesWithoutLoadedImage[0];
    if(isScrolledIntoView(el)) {
      var elist = entriesWithoutLoadedImage;
      entriesWithoutLoadedImage = []; // Clear it so the next event doesn't do something strange

      // Load the rest of the images
      for(var i = 0; i < elist.length; i++) {
        var url = elist[i].dataset.imageurl;

        if(imageCache[url]) {
          url = imageCache[url]
        } else {
          loadCrossSiteImage(url,cacheImage);
        }

        var img = document.createElement("img");
        img.addEventListener("load",onLoadBackgroundImage);
        img.src = url; // Preload background image to get size
        img.style = "max-width:180px; display:none";
        elist[i].appendChild(img);
      }
    }
  });



  c.appendChild(div);
}





async function page_articles() {
  var error_recordexists = false;

  try {
    await readPosts();
  } catch(e) {
    if(e == "error_recordexists") {
      error_recordexists = true;
    } else {
      throw e;
    }
  }

  var crawlback;
  if(crawlback = document.location.hash.match(/crawlbackto=(-?\d+)/)) {
    var end = int(crawlback[1]);
    if(error_recordexists && end === -1) {
      document.title = "Scanning finished!";
      alert("Scanning finished!");
    } else {
      if(!document.location.href.match(new RegExp("page\/"+end+"\/"))) {
        document.title = "Crawling...";
        crawl();
        return;
      }
    }
  }

  await showTVShows();
  showButton("Scan",crawl);
  showButton("Ignore",showIgnoreMenu);
  showButton("Clean",showCleanMenu);

}

function page_searchresults() {
  var m = document.body.firstChild.textContent.match(/Please try again in (\d+) seconds./);
  if(m) {
    window.setTimeout(function() { document.location.reload() },3000+int(m[1])*1000);
  }
}


function removeAds() {
  // Remove advertising
  let ads = document.querySelector(".mgbox");
  if(ads) {
    ads.parentNode.parentNode.removeChild(ads.parentNode);
    clearInterval(adIv)
  }
  ads = document.querySelector("#mgiframe");
  if(ads) {
    ads.remove();
    clearInterval(adIv)
  }
  ads = document.querySelector('html>iframe')
  if(ads) {
    ads.remove();
  }
}

var adIv;
(function() {
  // Move dark mode button to the right
  document.querySelectorAll('.dark-button,.light-button,.nightmodebt').forEach(function (el) {
    el.style.left = 'auto'
    el.style.right = '10px'
  })

  if(document.title.indexOf('Just a moment') !== -1) {
    // DDoS protection by Cloudflare
    return
  }
  if (document.getElementById('cf-error-details')) {
    // Cloudflare error
    document.location.host = 'rlsbb.unblockit.id'
  }

  if(document.location.href.endsWith("&submit=Find") || document.location.href.indexOf("/search/") != -1) {
    page_searchresults();
  } else {
    page_articles();
  }

  // Remove advertising
  adIv = window.setInterval(removeAds, 500);
})();

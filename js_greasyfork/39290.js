// ==UserScript==
// @name         Bertrand's Drawception ANBT
// @author       Bertrand the Healer
// @namespace    https://bertrandthehealer.github.io/
// @version      1.177.2018.12
// @description  Enhancement script for Drawception.com - Artists Need Better Tools
// @match        http://drawception.com/*
// @match        https://drawception.com/*
// @grant        none
// @run-at       document-start
// @license      Public domain
// @downloadURL https://update.greasyfork.org/scripts/39290/Bertrand%27s%20Drawception%20ANBT.user.js
// @updateURL https://update.greasyfork.org/scripts/39290/Bertrand%27s%20Drawception%20ANBT.meta.js
// ==/UserScript==

function wrapped() {

var SCRIPT_VERSION = "1.177.2018.12";
var NEWCANVAS_VERSION = 43; // Increase to update the cached canvas
var SITE_VERSION = "a84e6c5f"; // Last seen site version

// == DEFAULT OPTIONS ==

var options =
{
  enableWacom: 0, // Whether to enable Wacom plugin and thus pressure sensitivity support
  fixTabletPluginGoingAWOL: 1, // Fix pressure sensitivity disappearing in case of stupid/old Wacom plugin
  hideCross: 0, // Whether to hide the cross when drawing
  enterToCaption: 0, // Whether to submit caption by pressing Enter
  pressureExponent: 0.5, // Smaller = softer tablet response, bigger = sharper
  brushSizes: [2, 5, 12, 35], // Brush sizes for choosing via keyboard
  chatAutoConnect: 0, // Whether to automatically connect to the chat
  ownPanelLikesSecret: 0,
  backup: 1,
  timeoutSound: 0,
  timeoutSoundBlitz: 0,
  timeoutSoundVolume: 100,
  newCanvas: 1,
  proxyImgur: 0,
  rememberPosition: 0,
  ajaxRetry: 1,
  localeTimestamp: 0,
  autoplay: 1, // Whether to automatically start playback of a recorded drawing
  submitConfirm: 1,
  smoothening: 1,
  autoBypassNSFW: 0,
  colorNumberShortcuts: 1,
  colorUnderCursorHint: 1,
  bookmarkOwnCaptions: 0,
  colorDoublePress: 0,
  markStalePosts: 1,
  newCanvasCSS: "",
  forumHiddenUsers: "",
  maxCommentHeight: 1000,
  useOldFont: true,
  useOldFontSize: true,
  colorizeNavBar: true,
  checkForNotifications: true,
};

/*
== HOW TO USE ==
- Chrome/Iron: (Recommended: all features, best performance)
  - add the script in Tampermonkey addon
  - or open URL: chrome://extensions then drag and drop this .user.js file on it
- Firefox: add the script in Greasemonkey addon
- Opera 12.x: add the script in "site properties"

== FEATURES ==
General
- Menu buttons in the header for easier access
- No temptation to judge
- An embedded chat
- Automatically retry failed requests to reduce annoying error messages
Canvas:
- Completely new drawing canvas with ability to record and display the drawing process
View game
- Add reverse panels button
- Add "like all" button
- Track new comments
- Show when the game was started
- Ability to favorite panels
Play
- Much faster skipping
- Play modes for those who only caption or only draw
- Enter pressed in caption mode submits the caption
- Ability to bookmark games without participating
- Show your panel position and track changes in unfinished games list
Forum
- Better-looking timestamps with correct timezone
- Clickable drawing panels
- Clickable links
- Show and highlight direct links to forum posts
*/

var __DEBUG__, prestoOpera, username, userid;
var usingTablet, bgoptions, fileInput, sandboxDrawingStart;

var playMode = localStorage.getItem("gpe_playMode");
playMode = (playMode === null) ? 0 : parseInt(playMode, 10);
var inDark = localStorage.getItem("gpe_inDark");
inDark = (inDark === null) ? 0 : parseInt(inDark, 10);

var MODE_ALL = 0;
var MODE_CAPTION_ONLY = 1;
var MODE_DRAW_ONLY = 2;
var availablePlayModes = ["Mode: captions and drawings", "Mode: only make captions", "Mode: only draw"];
var alarmSoundOgg = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAABnHAAAAAAAAHQUSFoBHgF2b3JiaXMAAAAAAUSsAAAAAAAAYG0AAAAAAADJAU9nZ1MAAAAAAAAAAAAAZxwAAAEAAABq35G0DxD/////////////////NQN2b3JiaXMAAAAAAAAAAAEFdm9yYmlzH0JDVgEAAAEAFGNWKWaZUpJbihlzmDFnGWPUWoolhBRCKKVzVlurKbWaWsq5xZxzzpViUilFmVJQW4oZY1IpBhlTEltpIYQUQgehcxJbaa2l2FpqObacc62VUk4ppBhTiEromFJMKaQYU4pK6Jxz0DnmnFOMSgg1lVpTyTGFlFtLKXROQgephM5SS7F0kEoHJXRQOms5lRJTKZ1jVkJquaUcU8qtpphzjIHQkFUAAAEAwEAQGrIKAFAAABCGoSiKAoSGrAIAMgAABOAojuIokiI5kmM5FhAasgoAAAIAEAAAwHAUSZEUy9EcTdIszdI8U5ZlWZZlWZZlWZZd13VdIDRkFQAAAQBAKAcZxRgQhJSyEggNWQUAIAAAAIIowxADQkNWAQAAAQAIUR4h5qGj3nvvEXIeIeYdg9577yG0XjnqoaTee++99x5777n33nvvkWFeIeehk9577xFiHBnFmXLee+8hpJwx6J2D3nvvvfeec+451957752j3kHpqdTee++Vk14x6Z2jXnvvJdUeQuqlpN5777333nvvvffee++9955777333nvvrefeau+9995777333nvvvffee++9995777333nvvgdCQVQAAEAAAYRg2iHHHpPfae2GYJ4Zp56T3nnvlqGcMegqx9557773X3nvvvffeeyA0ZBUAAAgAACGEEFJIIYUUUkghhhhiyCGHHIIIKqmkoooqqqiiiiqqLKOMMsook4wyyiyjjjrqqMPOQgoppNJKC620VFtvLdUehBBCCCGEEEIIIYQQvvceCA1ZBQCAAAAwxhhjjEEIIYQQQkgppZRiiimmmAJCQ1YBAIAAAAIAAAAsSZM0R3M8x3M8x1M8R3RER3RER5RESbRETfREUTRFVbRF3dRN3dRNXdVN27VVW7ZlXdddXddlXdZlXdd1Xdd1Xdd1Xdd1XbeB0JBVAAAIAABhkEEGGYQQQkghhZRSijHGGHPOOSA0ZBUAAAgAIAAAAEBxFEdxHMmRJMmyLM3yLM8SNVMzNVNzNVdzRVd1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';

if (typeof GM_addStyle == 'undefined')
{
  var GM_addStyle = function(css)
  {
    var parent = document.getElementsByTagName("head")[0];
    if (!parent) parent = document.documentElement;
    var style = document.createElement("style");
    style.type = "text/css";
    var textNode = document.createTextNode(css);
    style.appendChild(textNode);
    parent.appendChild(style);
  };
}

/*
canvas integration todo:
- autoskipping captions/drawings
*/

// Executed on completely empty page. That means no jQuery!
function setupNewCanvas(insandbox, url, origpage)
{
  var canvasHTML = localStorage.getItem("anbt_canvasHTML");
  var canvasHTMLver = localStorage.getItem("anbt_canvasHTMLver");
  if (!canvasHTML || canvasHTMLver < NEWCANVAS_VERSION || canvasHTML.length < 10000)
  {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://api.github.com/repos/grompe/Drawception-ANBT/contents/newcanvas_embedding.html");
    xhr.setRequestHeader("Accept", "application/vnd.github.3.raw");
    xhr.onload = function()
    {
      if (this.responseText.length < 10000)
      {
        alert("Error: instead of new canvas code, got this response from GitHub:\n" + this.responseText);
        location.pathname = "/";
      } else {
        localStorage.setItem("anbt_canvasHTML", this.responseText);
        localStorage.setItem("anbt_canvasHTMLver", NEWCANVAS_VERSION);
        setupNewCanvas(insandbox, url);
      }
    };
    xhr.onerror = function()
    {
      alert("Error loading the new canvas code. Please try again.");
      location.pathname = "/";
    };
    xhr.send();
    //localStorage.setItem("anbt_canvasHTML", atob(""));
    return;
  }
  // Save friend game id if any
  var friendgameid = url.match(/play\/(.+)\//);

  var panelid = url.match(/sandbox\/#?([^\/]+)/);

  // Handle drawing contests only
  var incontest = url.match(/contests\/play\//) && document.getElementById("canvas-holder");
  // Disable built-in safety warning
  if (incontest) window.onbeforeunload = function(){};

  var sound = alarmSoundOgg;
  var vertitle = "ANBT v" + SCRIPT_VERSION;

  // Show normal address
  var normalurl;
  if (insandbox)
  {
    normalurl = "/sandbox/";
    if (panelid) normalurl += "#" + panelid[1];
  } else if (incontest) {
    normalurl = "/contests/play/";
  } else {
    normalurl = "/play/";
    if (friendgameid) normalurl += friendgameid[1] + "/";
  }
  try
  {
    if (location.pathname + location.hash != normalurl) history.pushState({}, document.title, normalurl);
  } catch(e) {};

  document.open();
  window.anbtReady = function()
  {
    if (friendgameid) window.friendgameid = friendgameid[1];
    if (panelid) window.panelid = panelid[1];
    window.insandbox = insandbox;
    window.incontest = incontest;
    window.options = options;
    window.alarmSoundOgg = sound;
    window.vertitle = vertitle;
    // Vue.js makes current page too different to reuse
    //if (origpage) window.origpage = origpage;

    var script = document.createElement("script");
    script.textContent = "(" + needToGoDeeper.toString() + ")();";
    document.body.appendChild(script);
  };
  document.write(canvasHTML);
  document.close();
}

// To be inserted on new canvas page. No jQuery!
function needToGoDeeper()
{

function sendGet(url, onloadfunc, onerrorfunc, ontimeoutfunc)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.timeout = 15000;
  xhr.onload = onloadfunc;
  xhr.onerror = onerrorfunc || onloadfunc;
  xhr.ontimeout = ontimeoutfunc || onerrorfunc || onloadfunc;
  xhr.send();
}

function sendPost(url, paramsobj, onloadfunc, onerrorfunc, ontimeoutfunc)
{
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.timeout = 15000;
  xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xhr.onload = onloadfunc;
  xhr.onerror = onerrorfunc || onloadfunc;
  xhr.ontimeout = ontimeoutfunc || onerrorfunc || onloadfunc;
  xhr.send(JSON.stringify(paramsobj));
}



function extractInfoFromHTML(html)
{
  var doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = html;
  var el;
  var drawapp = doc.querySelector("draw-app") || doc.querySelector("describe");
  if (!drawapp) drawapp = {getAttribute: function() {return false}};
  function getel(query)
  {
    el = doc.querySelector(query);
    return el;
  }
  return {
    error: getel(".error") ? el.textContent.trim() : false,
    gameid: drawapp.getAttribute("game_token"),
    blitz: drawapp.getAttribute(":blitz_mode") == "true",
    nsfw: drawapp.getAttribute(":nsfw") == "true",
    friend: drawapp.getAttribute(":game_public") != "true",
    drawfirst: drawapp.getAttribute(":draw_first") == "true",
    timeleft: drawapp.getAttribute(":seconds") * 1,
    caption: drawapp.getAttribute("phrase"),
    image: drawapp.getAttribute("img_url"),
    palette: drawapp.getAttribute("theme_id"),
    bgbutton: drawapp.getAttribute(":bg_layer") == "1",
    playerurl: "/profile/",
    avatar: null,
    coins: "-",
    pubgames: "-",
    friendgames: "-",
    notifications: "-",
    drawinglink: getel(".gamepanel img") ? el.getAttribute("src") : false,
    drawingbylink: getel("#main p a") ? [el.textContent.trim(), el.getAttribute("href")] : false,
    drawncaption: getel("h1.game-title") ? el.textContent.trim() : false,
    notloggedin: getel("form.form-login") != null,
    limitreached: false, // ??? appears to be redirecting to /play/limit/ which gives "game not found" error
    html: html,
  };
}

function getParametersFromPlay()
{
  var url = window.incontest ? "/contests/play/" : "/play/";
  if (window.friendgameid)
  {
    url += window.friendgameid + "/";
    window.friendgameid = false;
  }
  try
  {
    if (location.pathname != url) history.replaceState({}, null, url);
  } catch(e) {};
  if (window.origpage)
  {
    window.gameinfo = extractInfoFromHTML(window.origpage);
    handlePlayParameters();
    window.origpage = null;
    return;
  }
  // On Firefox, requesting "/play/" url would immediately return a cached error.
  // Firefox, WTF? So we use cache-busting here.
  sendGet(url + "?" + Date.now(), function()
  {
    var html = this.responseText;
    if (html == "")
    {
      window.gameinfo = {
        error: "Server returned a blank response :("
      };
    } else {
      window.gameinfo = extractInfoFromHTML(html);
    }
    handlePlayParameters();
  }, function()
  {
    window.gameinfo = {
      error: "Server error: " + this.statusText
    };
    handlePlayParameters();
  });
}

function exitToSandbox()
{
  if (window.incontext && !window.drawing_aborted)
  {
    sendPost("/contests/exit.json", {game_token: window.gameinfo.gameid}, function()
    {
      alert("You have missed your contest.");
    });
  }
  if (window.gameinfo.drawfirst && !window.drawing_aborted)
  {
    sendPost("/play/abort-start.json", {game_token: window.gameinfo.gameid}, function()
    {
      alert("You have missed your Draw First game.\nIt has been aborted.");
    }, function()
    {
      alert("You have missed your Draw First game.\nI tried aborting it, but an error occured. :(");
    });
  }
  timerStart = Date.now();
  ID("newcanvasyo").className = "sandbox";
  timerCallback = function(){};
  updateTimer();
  document.title = "Sandbox - Drawception";
  ID("gamemode").innerHTML = "Sandbox";
  ID("headerinfo").innerHTML = 'Sandbox with ' + vertitle;
  try
  {
    history.replaceState({}, null, "/sandbox/");
  } catch(e) {};
  anbt.Unlock();
}

function handleCommonParameters()
{
  if (gameinfo.notloggedin)
  {
    ID("start").parentNode.innerHTML = '<a href="/login" class="headerbutton active">Login'
      + '</a> <a href="/connect/" class="headerbutton active">Register</a>';
    return;
  }
  if (gameinfo.avatar)
  {
    ID("infoavatar").src = gameinfo.avatar;
  }
  ID("infoprofile").href = gameinfo.playerurl;
  ID("infocoins").innerHTML = gameinfo.coins;
  ID("infogames").innerHTML = gameinfo.pubgames;
  ID("infofriendgames").innerHTML = gameinfo.friendgames || 0;
  ID("infonotifications").innerHTML = gameinfo.notifications;
}

function handleSandboxParameters()
{
  if (gameinfo.drawingbylink)
  {
    var playername = gameinfo.drawingbylink[0];
    var playerlink = gameinfo.drawingbylink[1];
    var replaylink = '<a href="http://grompe.org.ru/drawit/#drawception/' +
      location.hash.substr(1) + '" title="Public replay link for sharing">Drawing</a>';
    ID("headerinfo").innerHTML = replaylink + ' by <a href="' + playerlink + '">' + playername + '</a>';
    document.title = playername + "'s drawing - Drawception";
    if (gameinfo.drawncaption)
    {
      ID("drawthis").innerHTML = '"' + gameinfo.drawncaption + '"';
      ID("drawthis").classList.remove("onlyplay");
      ID("emptytitle").classList.add("onlyplay");
    }
    if (options.autoplay) anbt.Play();
  } else {
    ID("headerinfo").innerHTML = 'Sandbox with ' + vertitle;
    ID("drawthis").classList.add("onlyplay");
  }

  handleCommonParameters();
}

function handlePlayParameters()
{
  var info = window.gameinfo;

  ID("skip").disabled = info.drawfirst || window.incontest;
  ID("report").disabled = info.drawfirst || window.incontest;
  ID("exit").disabled = false;
  ID("start").disabled = false;
  ID("bookmark").disabled = info.drawfirst || window.incontest;
  ID("options").disabled = true; // Not implemented yet!
  ID("timeplus").disabled = window.incontest;
  ID("submit").disabled = false;

  ID("headerinfo").innerHTML = 'Playing with ' + vertitle;
  ID("drawthis").classList.add("onlyplay");
  ID("emptytitle").classList.remove("onlyplay");

  window.submitting = false;
  window.drawing_aborted = false;

  if (info.error)
  {
    alert("Play Error:\n" + info.error);
    return exitToSandbox();
  }
  if (info.limitreached)
  {
    alert("Play limit reached!");
    return exitToSandbox();
  }

  if (window.incontest)
  {
    ID("gamemode").innerHTML = "Contest";
  } else {
    ID("gamemode").innerHTML = (info.friend ? "Friend " : "Public ") +
      (info.nsfw ? "Not Safe For Work (18+) " : "safe for work ") +
      (info.blitz ? "BLITZ " : "") +
      "Game";
  }
  ID("drawthis").innerHTML = info.caption || info.drawfirst && "(Start your game!)" || "";
  ID("tocaption").src = "";

  var newcanvas = ID("newcanvasyo");
  newcanvas.className = "play";
  if (info.friend) newcanvas.classList.add("friend");
  ID("palettechooser").className = info.friend ? "" : "onlysandbox";
  if (info.nsfw) newcanvas.classList.add("nsfw");
  if (info.blitz) newcanvas.classList.add("blitz");
  newcanvas.classList.add(info.image ? "captioning" : "drawing");

  // Clear
  if (anbt.isStroking) anbt.StrokeEnd();
  anbt.Unlock();
  for (var i = anbt.svg.childNodes.length - 1; i > 0; i--)
  {
    var el = anbt.svg.childNodes[i];
    anbt.svg.removeChild(el);
  }
  anbt.Seek(0);
  anbt.MoveSeekbar(1);
  anbt.unsaved = false;

  var palettemap = {
    "default": ["Normal", "#fffdc9"],
    theme_holiday: ["Holiday", "#ffffff"],
    theme_thanksgiving: ["Thanksgiving", "#f5e9ce"],
    halloween: ["Halloween", "#444444"],
    theme_cga: ["CGA", "#ffff55"],
    shades_of_grey: ["Grayscale", "#e9e9e9"],
    theme_bw: ["Black and white", "#ffffff"],
    theme_gameboy: ["Gameboy", "#9bbc0f"],
    theme_neon: ["Neon", "#00abff"],
    theme_sepia: ["Sepia", "#ffe2c4"],
    theme_valentines: ["Valentine's", "#ffccdf"],
    theme_blues: ["the blues", "#295c6f"],
    theme_spring: ["Spring", "#ffffff"],
    theme_beach: ["Beach", "#f7dca2"],
    theme_beach_2: ["Tile pool","#2271a2"],
    theme_coty_2016: ["Colors of 2016", "#648589"],
    theme_bee: ["Bee", "#ffffff"],
    theme_coty_2017: ["Colors of 2017", "#5f7278"],
    theme_fire_ice: ["Fire and Ice", "#040526"],
    theme_coty_2018: ["Canyon Sunset", "#2e1b50"],
    theme_juice: ["Juice", "#fced95"],
    theme_tropical: ["Tropical", "#2f0946"],
    theme_grimby_grays: ["Grimby Grays", "#f0efeb"]
  };
  var pal = info.palette;
  var paldata;
  if (!info.image)
  {
    // Drawing
    if (pal == "theme_roulette")
    {
      // Since site update, the game reports already chosen palette,
      // but apparently this still happens sometimes. ???
      alert("Warning: Drawception roulette didn't give a theme. ANBT will choose a random palette.");
      delete palettes.Roulette;
      var k = Object.keys(palettemap);
      var n = k[k.length * Math.random() << 0];
      palettes.Roulette = palettes[palettemap[n][0]];
      paldata = ["Roulette", palettemap[n][1]];
    } else {
      if (pal) paldata = palettemap[pal.toLowerCase()];
    }
    if (!paldata)
    {
      if (!pal)
      {
        alert("Error, please report! Failed to extract the palette.\nAre you using the latest ANBT version?");
      } else {
        alert("Error, please report! Unknown palette: '" + pal + "'.\nAre you using the latest ANBT version?");
      }
      // Prevent from drawing with a wrong palette
      anbt.Lock();
      ID("submit").disabled = true;
    } else {
      setPaletteByName(paldata[0]);
      anbt.SetBackground(paldata[1]);
      anbt.color = [palettes[paldata[0]][0], "eraser"];
      updateColorIndicators();
    }
    ID("setbackground").hidden = !info.bgbutton;
  } else {
    // Caption
    if (info.image.length <= 30)
    {
      // Broken drawing =(
      ID("tocaption").src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAD6AQMAAAAho+iwAAAABlBMVEWAQED///94jotxAAABiklEQVR4Xu3W0UrCUBjA8eOO5CLK7VxLzDWFrjK6Eaha8FHuppfwBRJvdjlMIK/K3qA3OZBBd/UIm9UL2O2inMJBptNuog/6/h4Q2Y8J387Y2KIoiqIoiqIoiuIxXnbI5cmXSiJjD3LmFyrGY46PqVAx/HPDv9/w3wsJTTgapuDkcEIQMFxzo937S8+F5OkWI2IKymQl3yiZ6j8zYsRY6vUYDcOfGkuMknE5/aQAMczX9O+iKIrKJWuSxliQqT61hOmMucsYK6uzLWfDenF34EXhOX+s377KLCZcs1bxhNXQqnAvrExWM8vvY3amORCNsplu2nZPWKdj1tecTHZZLA97ZnjBB/XrkWIZWT+bsmTowp+7FHSnyMi7CpuMrWcwNsMMxnJzrCUbwwq/2/MLJb8lP4L2zVHJ35Bp1rE8Uc2bALoNHQvcoNG3Yf5Pm6EnHG50Ye0YmiG4V08LmWD7wmF9gJwFgoHbnZzNSDE/Co3orSB2YGsbovAgaD9vlkB/WbkbdQVWMNxR1Ddnf4eSZpHZYAAAAABJRU5ErkJggg==";
    } else {
      ID("tocaption").src = info.image;
    }
    ID("caption").value = "";
    ID("caption").focus();
    ID("caption").setAttribute("maxlength", 45);
    ID("usedchars").textContent = "45";
  }

  timerStart = Date.now() + 1000 * info.timeleft;
  timerCallback = function(){};
  updateTimer();
  window.timesup = false;

  if ((options.timeoutSound && !info.blitz) || (options.timeoutSoundBlitz && info.blitz))
  {
    window.playedWarningSound = false;
    var alarm = new Audio(window.alarmSoundOgg);
    alarm.volume = options.timeoutSoundVolume / 100;
  }

  timerCallback = function(s)
  {
    if (alarm && !window.playedWarningSound && s <= (info.blitz ? 5 : 61) && s > 0)
    {
      alarm.play();
      window.playedWarningSound = true;
    }
    if (s < 1)
    {
      document.title = "[TIME'S UP!] Playing Drawception";
      if (info.image || window.timesup)
      {
        // If pressed submit before timer expired, let it process or retry in case of error
        if (!window.submitting)
        {
          if (info.image)
          {
            getParametersFromPlay();
          } else {
            // Allow to save the drawing after time's up
            exitToSandbox();
          }
        }
      } else {
        newcanvas.classList.add("locked");
        anbt.Lock();
        timerStart += 15000; // 15 seconds to submit
        updateTimer();
        window.timesup = true;
      }
    } else {
      var m1 = Math.floor(s / 60), s1 = Math.floor(s % 60);
      m1 = ("0" + m1).slice(-2);
      s1 = ("0" + s1).slice(-2);
      document.title = "[" + m1 + ":" + s1 + "] Playing Drawception";
    }
  };

  handleCommonParameters();
}

function include(script, callback)
{
  var tag = document.createElement("script");
  tag.src = script;
  tag.onload = callback;
  document.body.appendChild(tag);
}

function decodeHTML(html)
{
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function bindCanvasEvents()
{
  var unsavedStopAction = function()
  {
    return anbt.unsaved && !confirm("You haven't saved the drawing. Abandon?");
  };

  ID("exit").addEventListener('click', function()
  {
    if (window.incontest)
    {
      if (!confirm("Quit the contest? Entry coins will be lost!")) return;
      ID("exit").disabled = true;
      sendPost("/contests/exit.json", {game_token: window.gameinfo.gameid}, function()
      {
        ID("exit").disabled = false;
        window.drawing_aborted = true;
        exitToSandbox();
        document.location.pathname = "/contests/";
      }, function()
      {
        ID("exit").disabled = false;
        alert("Server error. :( Try again?");
      }, function()
      {
        ID("exit").disabled = false;
        alert("Server didn't respond in time. :( Try again?");
      });
      return;
    }
    if (window.gameinfo.drawfirst)
    {
      if (!confirm("Abort creating a draw first game?")) return;
      ID("exit").disabled = true;
      sendPost("/play/abort-start.json", {game_token: window.gameinfo.gameid}, function()
      {
        ID("exit").disabled = false;
        window.drawing_aborted = true;
        exitToSandbox();
        document.location.pathname = "/create/";
      }, function()
      {
        ID("exit").disabled = false;
        alert("Server error. :( Try again?");
      }, function()
      {
        ID("exit").disabled = false;
        alert("Server didn't respond in time. :( Try again?");
      });
      return;
    }
    if (!confirm("Really exit?")) return;
    ID("exit").disabled = true;
    sendPost("/play/exit.json", {game_token: window.gameinfo.gameid}, function()
    {
      ID("exit").disabled = false;
      exitToSandbox();
    });
  });

  ID("skip").addEventListener('click', function()
  {
    if (unsavedStopAction()) return;
    ID("skip").disabled = true;
    sendPost("/play/skip.json", {game_token: window.gameinfo.gameid}, function()
    {
      // Postpone enabling skip until we get game info
      getParametersFromPlay();
    }, function()
    {
      ID("skip").disabled = false;
      getParametersFromPlay();
    });
  });

  ID("start").addEventListener('click', function()
  {
    if (unsavedStopAction()) return;
    ID("start").disabled = true;
    getParametersFromPlay();
  });

  ID("report").addEventListener('click', function()
  {
    if (!confirm("Report this panel?")) return;
    sendPost("/play/flag.json", {game_token: window.gameinfo.gameid}, function()
    {
      ID("report").disabled = false;
      getParametersFromPlay();
    });
  });

  ID("bookmark").addEventListener('click', function()
  {
    ID("bookmark").disabled = true;
    var games = localStorage.getItem("gpe_gameBookmarks");
    games = games ? JSON.parse(games) : {};
    var caption = window.gameinfo.caption;
    games[window.gameinfo.gameid] = {time: Date.now(), caption: caption ? decodeHTML(caption) : ""};
    localStorage.setItem("gpe_gameBookmarks", JSON.stringify(games));
  });

  ID("submit").addEventListener('click', function()
  {
    var moreThanMinuteLeft = timerStart - Date.now() > 60000;
    if (options.submitConfirm && moreThanMinuteLeft && !confirm("Ready to submit this drawing?")) return;
    ID("submit").disabled = true;
    anbt.MakePNG(300, 250, true);
    if (options.backup)
    {
      localStorage.setItem("anbt_drawingbackup_newcanvas", anbt.pngBase64);
    }
    window.submitting = true;

    var url;
    if (window.incontest)
    {
      url = "/contests/submit-drawing.json";
    } else {
      url = "/play/draw.json";
    }
    sendPost(url, {game_token: window.gameinfo.gameid, panel: anbt.pngBase64}, function()
    {
      var o;
      try
      {
        o = JSON.parse(this.responseText);
      } catch (e) {
        o = {error: this.responseText};
      }
      if (o.error)
      {
        ID("submit").disabled = false;
        if (typeof o.error == "object")
        {
          alert("Error! Please report this data:\n" +
            "game: " + window.gameinfo.gameid + "\n\n" +
            "response: \n" + JSON.stringify(o.error)
            );
        } else {
          alert(o.error);
        }
      } else if (o.message) {
        ID("submit").disabled = false;
        alert(o.message);
      } else if (o.url) {
        window.onbeforeunload = function(){};
        location.replace(o.url);
      }
    }, function()
    {
      ID("submit").disabled = false;
      alert("Server error. :( Try again?");
    }, function()
    {
      ID("submit").disabled = false;
      alert("Server didn't respond in time. :( Try again?");
    });
  });

  ID("submitcaption").addEventListener('click', function()
  {
    var title = ID("caption").value;
    if (!title)
    {
      ID("caption").focus();
      return alert("You haven't entered a caption!");
    }
    var onCaptionSuccess = function()
    {
      if (options.bookmarkOwnCaptions)
      {
        var games = localStorage.getItem("gpe_gameBookmarks");
        games = games ? JSON.parse(games) : {};
        games[window.gameinfo.gameid] = {time: Date.now(), caption: '"' + title + '"', own: true};
        localStorage.setItem("gpe_gameBookmarks", JSON.stringify(games));
      }
    };
    window.submitting = true;
    ID("submitcaption").disabled = true;

    var url;
    if (window.incontest)
    {
      url = "/contests/submit-caption.json";
    } else {
      url = "/play/describe.json";
    }
    sendPost(url, {game_token: window.gameinfo.gameid, title: title}, function()
    {
      var o;
      try
      {
        o = JSON.parse(this.responseText);
      } catch (e) {
        o = {error: this.responseText};
      }
      if (o.error)
      {
        ID("submitcaption").disabled = false;
        if (typeof o.error == "object")
        {
          alert("Error! Please report this data:\n" +
            "game: " + window.gameinfo.gameid + "\n\n" +
            "response: \n" + JSON.stringify(o.error)
            );
        } else {
          alert(o.error);
        }
      } else if (o.message) {
        ID("submitcaption").disabled = false;
        alert(o.message);
      } else if (o.url) {
        onCaptionSuccess();
        location.replace(o.url);
      }
    }, function()
    {
      ID("submitcaption").disabled = false;
      alert("Server error. :( Try again?");
    }, function()
    {
      ID("submitcaption").disabled = false;
      alert("Server didn't respond in time. :( Try again?");
    });
  });

  if (options.enterToCaption)
  {
    ID("caption").addEventListener('keydown', function(e)
    {
      if (e.keyCode == 13)
      {
        e.preventDefault();
        ID("submitcaption").click();
      }
    });
  }

  var updateUsedChars = function(e)
  {
    ID("usedchars").textContent = 45 - ID("caption").value.length;
  };
  ID("caption").addEventListener('change', updateUsedChars);
  ID("caption").addEventListener('keydown', updateUsedChars);
  ID("caption").addEventListener('input', updateUsedChars);

  ID("timeplus").addEventListener('click', function()
  {
    if (window.gameinfo.friend)
    {
      ID("timeplus").disabled = true;
      sendPost("/play/exit.json", {game_token: window.gameinfo.gameid}, function()
      {
        sendGet("/play/" + window.gameinfo.gameid + "/?" + Date.now(), function()
        {
          ID("timeplus").disabled = false;
          var html = this.responseText;
          if (html == "")
          {
            window.gameinfo = {
              error: "Server returned a blank response :("
            };
          } else {
            window.gameinfo = extractInfoFromHTML(html);
          }
          timerStart = Date.now() + 1000 * window.gameinfo.timeleft;
        }, function()
        {
          ID("timeplus").disabled = false;
          alert("Server error. :( Try again?");
        });
      }, function()
      {
        ID("timeplus").disabled = false;
        alert("Server error. :( Try again?");
      }, function()
      {
        ID("timeplus").disabled = false;
        alert("Server didn't respond in time. :( Try again?");
      });
      return;
    }
    ID("timeplus").disabled = true;
    sendPost("/play/add-time.json", {game_token: window.gameinfo.gameid}, function()
    {
      var o = JSON.parse(this.responseText);
      if (o.error)
      {
        alert(o.error);
      } else if (o.callJS == "updatePlayTime") {
        timerStart += o.data.seconds * 1000;
        if (window.timesup)
        {
          ID("newcanvasyo").classList.remove("locked");
          anbt.Unlock();
          timerStart -= 15000; // remove 15 seconds to submit
          window.timesup = false;
        }
        updateTimer();
        ID("timeplus").classList.remove("show");
        // Let play warning sound twice
        window.playedWarningSound = false;
      }
      ID("timeplus").disabled = false;
    }, function()
    {
      ID("timeplus").disabled = false;
      alert("Server error. :( Try again?");
    }, function()
    {
      ID("timeplus").disabled = false;
      alert("Server didn't respond in time. :( Try again?");
    });
  });

  var old_getClosestColor = window.getClosestColor;
  window.getClosestColor = function(rgb, pal)
  {
    // Allow any color in friend games
    if (window.gameinfo && window.gameinfo.friend) return rgb2hex(rgb[0], rgb[1], rgb[2]);
    return old_getClosestColor(rgb, pal);
  };
}

function deeper_main()
{
  window.onerror = function(e, file, line)
  {
    // Silence the bogus error message from the overwritten page's timer
    if (e.toString().indexOf("periodsToSeconds") != -1) return;
    // Silence the useless error message
    if (e.toString().match(/script error/i)) return;
    if (line)
    {
      alert(e + "\nline: " + line);
    } else {
      alert(e);
    }
  };

  if (options.newCanvasCSS)
  {
    var parent = document.getElementsByTagName("head")[0];
    if (!parent) parent = document.documentElement;
    var style = document.createElement("style");
    style.type = "text/css";
    var textNode = document.createTextNode(options.newCanvasCSS);
    style.appendChild(textNode);
    parent.appendChild(style);
  }
  
  if (options.enableWacom)
  {
    var stupidPlugin = document.createElement("object");
    var container = ID("wacomContainer");
    stupidPlugin.setAttribute("id", "wacom");
    stupidPlugin.setAttribute("type", "application/x-wacomtabletplugin");
    stupidPlugin.setAttribute("width", "1");
    stupidPlugin.setAttribute("height", "1");
    container.appendChild(stupidPlugin);
    if (options.fixTabletPluginGoingAWOL) fixPluginGoingAWOL();
  }
  bindCanvasEvents();
  if (window.insandbox)
  {
    if (window.panelid)
    {
      sendGet("/panel/drawing/" + window.panelid + "/-/", function()
      {
        window.gameinfo = extractInfoFromHTML(this.responseText);
        anbt.FromURL(gameinfo.drawinglink + "?anbt"); // workaround for non-CORS cached image
        handleSandboxParameters();
      }, function()
      {
        alert("Error loading the panel page. Please try again.");
      });
    } else {
      if (window.origpage)
      {
        window.gameinfo = extractInfoFromHTML(window.origpage);
        handleSandboxParameters();
        window.origpage = null;
      } else {
        sendGet("/sandbox/", function()
        {
          window.gameinfo = extractInfoFromHTML(this.responseText);
          handleSandboxParameters();
        }, function() {});
      }
      if (options.backup)
      {
        var pngdata = localStorage.getItem("anbt_drawingbackup_newcanvas");
        if (pngdata)
        {
          anbt.FromPNG(base642bytes(pngdata.substr(22)).buffer);
          localStorage.removeItem("anbt_drawingbackup_newcanvas");
        }
      }
    }
  } else {
    ID("newcanvasyo").className = "play";
    getParametersFromPlay();
  }

  if (!options.smoothening)
  {
    buildSmoothPath = function(points, path)
    {
      if (points.length < 2) return;
      path.pathSegList.initialize(path.createSVGPathSegMovetoAbs(points[0].x, points[0].y));
      for (var i = 1; i < points.length; i++)
      {
        var c = points[i];
        path.pathSegList.appendItem(path.createSVGPathSegLinetoAbs(c.x, c.y));
      }
    }
  }

  // Poor poor memory devices, let's save on memory to avoid them "crashing"...
  if (/iPad|iPhone/.test(navigator.userAgent)) anbt.fastUndoLevels = 3;
  
  window.$ = function()
  {
    alert("Some additional script conflicts with ANBT new canvas, please disable it.");
    window.$ = null;
    throw new Error("Script conflict with ANBT new canvas");
  };
}
deeper_main();
} // needToGoDeeper end

function isBlitzInPlay()
{
  var mode = $(".label-game-mode");
  if (mode.length && mode.text().match(/blitz/i)) return true;
  return false;
}

function linkifyNodeText(node)
{
  var t = $(node);
  if (t.text().indexOf("://") == -1) return;
  t.html(t.html().replace(/([^"]|^)(https?:\/\/(?:(?:(?:[^\s<()]*\([^\s<()]*\))+)|(?:[^\s<()]+)))/g, '$1<a href="$2">$2</a>'));
}

function enhanceCanvas(insandbox)
{
}

function empowerPlay()
{
}

// Event functions referred to in HTML must have unwrapped access

window.reversePanels = reversePanels;
function reversePanels()
{
  var e = $(".gamepanel-holder").parent();
  e.parent().append(e.get().reverse());
  return false;
}

window.likePanelById = likePanelById;
function likePanelById(id)
{
  $.ajax({url: '/game/like/panel.json?panelid=' + id + '&action=Like'});
}

window.likeAll = likeAll;
function likeAll()
{
  var likebuttons = [];
  $(".likebutton.btn-default").each(
    function(k, v)
    {
      if ($(v).parent().parent().parent().find(".panel-user a").text().trim() != username)
      {
        likebuttons.push(v);
      }
    }
  );
  var keepLiking = function()
  {
    if (likebuttons.length)
    {
      likebuttons.shift().click()
      setTimeout(keepLiking, 1500);
    }
  };
  keepLiking();
  return false;
}

window.toggleLight = toggleLight;
function toggleLight()
{
  var css = document.getElementById("darkgraycss");
  if (!inDark)
  {
    if (!css)
    {
      css = document.createElement("style");
      css.id = "darkgraycss";
      css.type = "text/css";
      css.appendChild(document.createTextNode(localStorage.getItem("gpe_darkCSS")));
      Array.from(document.querySelectorAll("img[src='/img/duck-gray.svg']")).forEach(function (x)
      {
        x.setAttribute("src", "/img/duck.svg");
      });
    }
    document.head.appendChild(css);
    inDark = 1;
  } else {
    Array.from(document.querySelectorAll("img[src='/img/duck.svg']:not([alt='duck']),img[title='Quack'],img[src='/img/duck.svg'][rel='tooltip']")).forEach(function (x)
    {
      x.setAttribute("src", "/img/duck-gray.svg");
    });
    document.head.removeChild(css);
    inDark = 0;
  }
  localStorage.setItem("gpe_inDark", inDark.toString());
  return;
}

function panelUrlToDate(url)
{
  var m = url.match(/\/images\/panels\/(\d+)\/(\d+)-(\d+)\//);
  if (!m) return;
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var day = (100 + parseInt(m[3], 10)).toString().slice(-2);
  return monthNames[parseInt(m[2], 10) - 1] + " " + day + ", " + m[1];
}

function fixLocationToCanonical(m)
{
  var ogurl = $('meta[property="og:url"]').attr("content");
  if (ogurl && ogurl.match(m))
  {
    ogurl = ogurl.replace("https://drawception.com", "");
    try
    {
      if (location.pathname != ogurl)
      {
        history.replaceState({}, null, ogurl + location.hash);
      }
    } catch(e) {};
  }
}

function betterCreateGame()
{
  if (!options.enterToCaption)
  {
    $('#createGameForm input[name="title"]').on("keydown",function(e)
    {
      if(e.keyCode == 13)
      {
        e.preventDefault();
      }
    });
  }
}

function betterGame()
{
  if (document.title == "Not Safe For Work (18+) Gate")
  {
    if (options.autoBypassNSFW)
    {
      DrawceptionPlay.bypassNsfwGate();
    }
    return;
  }

  fixLocationToCanonical("/game/");

  var drawings = $('img[src^="https://cdn.drawception.com/images/panels/"],img[src^="https://cdn.drawception.com/drawings/"]');

  // Show each drawing make date
  drawings.each(function()
  {
    var d;
    if (d = panelUrlToDate(this.src))
    {
      this.title = "Made on " + d;
    }
  });

  // Fix misaligned panels
  var tryNextPanel = function()
  {
    if (!this.naturalWidth && !this.triedFixing)
    {
      var pos = this.src.match(/-(\d+)\.png$/)[1];
      pos++;
      this.src = this.src.replace(/-(\d+)\.png$/, "-" + pos + ".png");
      this.triedFixing = true;
    }
  };
  // TODO: also fix if script is executed after page load
  drawings.on("error", tryNextPanel);

  // Hide your own number of likes
  if (options.ownPanelLikesSecret)
    $(".panel-user").find('a[href*="/' + userid + '/"]').parent().parent().find("span.disabled .numlikes").text("?").css("opacity", "0.5");

  // Reverse panels button and like all button
  $("#btn-copy-url")
    .after(' <a href="#" class="btn btn-default" onclick="return reversePanels();" title="Reverse panels"><span class="fas fa-sort-amount-up"></span> Reverse</a>')
    .after(' <a href="#" class="btn btn-default" onclick="return likeAll();" title="Like all panels"><span class="fas fa-thumbs-up"></span> Like all</a>');

  // Panel favorite buttons
  var favButton = $('<span class="panel-number anbt_favpanel fas fa-heart text-muted" title="Favorite"></span>');
  favButton.click(function(e)
    {
      e.preventDefault();
      var t = $(this);
      if (t.hasClass("anbt_favedpanel")) return;
      var tp = t.parent();
      var id = scrambleID(tp.find(".gamepanel").attr("id").slice(6));

      var panels = localStorage.getItem("gpe_panelFavorites");
      panels = panels ? JSON.parse(panels) : {};

      var panel = {time: Date.now(), by: tp.find(".panel-user a").text()};
      var img = tp.find(".gamepanel img");
      if (img.length)
      {
        // Drawing panel
        panel.image = img.attr("src");
        panel.caption = img.attr("alt");
      } else {
        // Caption panel
        panel.caption = tp.find(".gamepanel").text().trim();
      }
      panels[id] = panel;
      localStorage.setItem("gpe_panelFavorites", JSON.stringify(panels));
      t.addClass("anbt_favedpanel");
    }
  );
  $(".panel-number").after(favButton);

  // Panel replay button
  if (options.newCanvas)
  {
    var addReplayButton = function()
    {
      if (this.replayAdded) return;
      this.replayAdded = true;
      var panel = $(this).parent();
      var src = this.src;
      checkForRecording(this.src, function()
      {
        var id;
        var newid = src.match(/(\w+).png$/)[1];
        if (newid.length > 8)
        {
          id = newid;
        } else {
          id = scrambleID(panel.attr("id").slice(6));
        }
        var replayButton = $('<a href="/sandbox/#' + id + '" class="panel-number anbt_replaypanel fas fa-redo-alt text-muted" title="Replay"></span>');
        replayButton.click(function(e)
        {
          if (e.which === 2) return;
          e.preventDefault();
          setupNewCanvas(true, "/sandbox/#" + id);
        });
        panel.before(replayButton);
      });
    };
    drawings.on("load", addReplayButton);
    drawings.each(function()
    {
      if (this.complete) addReplayButton.call(this);
    });
  }

  // Comments appear dynamically after the page is loaded now
  function betterComments()
  {
    // Linkify the links and add ability to address comment holders again
    $('.comment-body').each(function()
      {
        $(this).parent().parent().addClass("comment-holder");
        linkifyNodeText(this);
      }
    );

    // Interlink game panels and comments
    var gamePlayers = [];
    var playerdata = {};
    $(".gamepanel-holder").each(function(i)
      {
        var t = $(this);
        var det = t.find(".panel-details");
        var gamepanel = t.find(".gamepanel");
        var a = det.find(".panel-user a");
        if (!a.length) return;
        var id = a.attr("href").match(/\/player\/(\d+)\//)[1];
        playerdata[id] =
        {
          panel_number: i + 1,
          player_anchor: a.get(0),
          panel_id: gamepanel.attr("id"),
          drew: gamepanel.has("img").length != 0,
          comments: 0
        }
        gamePlayers.push(id);
      }
    );

    // Highlight new comments and remember seen comments
    var seenComments = localStorage.getItem("gpe_seenComments");
    seenComments = (seenComments === null) ? {} : JSON.parse(seenComments);
    var gameid = document.location.href.match(/game\/([^\/]+)\//)[1];
    var holders = $(".comment-holder");
    if (holders.length)
    {
      // Clear old tracked comments
      var hour = Math.floor(Date.now() / (1000 * 60*60)); // timestamp with 1 hour precision
      for (var tempgame in seenComments)
      {
        // Store game entry for up to a week after last tracked comment
        if (seenComments[tempgame].h + 24*7 < hour)
        {
          delete seenComments[tempgame];
        }
      }
      var maxseenid = 0;
      holders.each(function()
      {
        var t = $(this);
        var dateel = t.find("a.text-muted").first();
        var vue = this.__vue__;
        if (vue)
        {
          var text = dateel.text().trim();
          dateel.text(text + ', ' + formatTimestamp(vue.comment_date * 1000));
          if (vue.edit_date > 0)
          {
            var el = dateel.parent().find('span[rel="tooltip"]');
            var text2 = el.attr('title');
            text2 += ", " + formatTimestamp(vue.edit_date * 1000).replace(/ /g, "\u00A0"); // prevent the short tooltip width from breaking date apart
            el.attr('title', text2);
          }
        }
        var ago = dateel.text();
        var anchorid = t.attr("id");
        var commentid = parseInt(anchorid.slice(1), 10);
        // Also allow linking to specific comment
        dateel.attr("title", "Link to comment");
        dateel.text(dateel.text().trim() + " #" + commentid);
        // Track comments from up to week ago
        if (ago.match(/just now|min|hour|a day| [1-7] day/))
        {
          if (!(seenComments[gameid] && seenComments[gameid].id >= commentid))
          {
            t.addClass("comment-new");
            if (maxseenid < commentid) maxseenid = commentid;
          }
        }
        // Add game perticipation info
        var m = t.find(".text-bold a").attr("href").match(/\/player\/(\d+)\//);
        if (m)
        {
          var id = m[1];
          if (gamePlayers.indexOf(id) != -1)
          {
            var drew = 0;
            var drew = playerdata[id].drew ? 'drew' : 'wrote';
            dateel.before('<a href="#' + playerdata[id].panel_id +
              '">(' + drew + ' #' + playerdata[id].panel_number + ')</a> ');
            playerdata[id].comments += 1;
          }
        }
      });
      if (maxseenid) seenComments[gameid] = {h: hour, id: maxseenid};
      localStorage.setItem("gpe_seenComments", JSON.stringify(seenComments));
    }
    for (var i = 0; i < gamePlayers.length; i++)
    {
      var data = playerdata[gamePlayers[i]];
      if (data.comments != 0)
      {
        var cmt = data.comments == 1 ? " comment" : " comments";
        var cmt2 = 'Player left '+ data.comments + cmt;
        data.player_anchor.title = cmt2;
        $(data.player_anchor).after('<sup title="' + cmt2 + '">' + data.comments + '</sup>');
      }
    }
    if (options.maxCommentHeight)
    {
      var h = options.maxCommentHeight;
      $(".comment-body").click(function()
      {
        var t = $(this);
        if ((t.height() > h-50) && !$(location.hash).has(t).length)
        {
          location.hash = "#" + t.parent().parent().attr("id");
        }
      });
    }
  }
  function waitForComments()
  {
    if (document.querySelector('.comment-body'))
    {
      betterComments();
    } else {
      setTimeout(waitForComments, 1000);
    }
  }
  setTimeout(waitForComments, 200);
  
}

function checkForRecording(url, yesfunc, retrying)
{
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function()
  {
    var buffer = this.response;
    var dv = new DataView(buffer);
    var magic = dv.getUint32(0);
    if (magic != 0x89504e47) return xhr.onerror(); // Drawception started hijacking XHR errors and putting HTML in there
    for (var i = 8; i < buffer.byteLength; i += 4 /* Skip CRC */)
    {
      var chunklen = dv.getUint32(i);
      i += 4;
      var chunkname = dv.getUint32(i);
      i += 4;
      if (chunkname == 0x73764762)
      {
        return yesfunc();
      } else {
        if (chunkname == 0x49454e44) break;
        i += chunklen;
      }
    }
  };
  xhr.onerror = function(e)
  {
    console.log("checkForRecording fail (likely due to cache without CORS), retrying");
    if (!retrying) checkForRecording(url + "?anbt", yesfunc, true);
  };
  xhr.send();
}

function betterPanel()
{
  // Just for quickly opening a panel by its numerical ID
  if (!$(".gamepanel").length && location.hash)
  {
    var id = location.hash.match(/\d+/);
    location.pathname = "/panel/-/" + scrambleID(id) + "/-/";
  }

  fixLocationToCanonical("/panel/");

  var favButton = $('<button class="btn btn-info" style="margin-top: 20px"><span class="fas fa-heart"></span> <b>Favorite</b></button>');
  favButton.click(function(e)
    {
      e.preventDefault();
      var panels = localStorage.getItem("gpe_panelFavorites");
      panels = panels ? JSON.parse(panels) : {};
      var panel = {time: Date.now(), by: $(".gamepanel-holder + p a").text()};
      var id = document.location.href.match(/\/panel\/[^\/]+\/([^\/]+)\//)[1];
      var img = $(".gamepanel img");
      if (img.length)
      {
        // Drawing panel
        panel.image = img.attr("src");
        panel.caption = img.attr("alt");
      } else {
        // Caption panel
        panel.caption = $(".gamepanel").text().trim();
      }
      panels[id] = panel;
      localStorage.setItem("gpe_panelFavorites", JSON.stringify(panels));
      $(this).attr("disabled", "disabled").find("b").text("Favorited!");
    }
  );
  $(".gamepanel").after(favButton);

  var d, img = $(".gamepanel img");
  if (img.length && (d = panelUrlToDate(img.attr("src"))))
  {
    $("#main .lead").first().append("<br>made on " + d);
  }

  var panelId = getPanelId(location.pathname);

  // Only panels after 14924553 might have a recording
  if (options.newCanvas && unscrambleID(panelId) >= 14924553)
  {
    var img = $(".gamepanel img");
    if (img.length)
    {
      checkForRecording(img.attr("src"), function()
      {
        var replayLink = $('<a class="btn btn-primary" style="margin-top: 20px" href="/sandbox/#' + panelId + '"><span class="fas fa-redo-alt"></span> <b>Replay</b></a> ');
        replayLink.click(function(e)
        {
          if (e.which === 2) return;
          e.preventDefault();
          setupNewCanvas(true, "/sandbox/#" + panelId);
        });
        $(".gamepanel").after(replayLink);
      });
    }
  }

  if ($(".btn-primary").last().text() == "Play again")
  {
    // Allow adding to cover creator
    var ccButton = $('<button class="btn btn-info" style="margin-top: 20px"><span class="fas fa-plus"></span> <b>Add to Cover Creator</b></button>');
    ccButton.click(function(e)
      {
        e.preventDefault();
        var ids;
        var id = unscrambleID(panelId);
        var cookie = $.cookie('covercreatorids');
        if (!cookie) {
          ids = [];
        } else {
          ids = JSON.parse(cookie);
        }
        if (ids.indexOf(id) == -1)
        {
          if (ids.length > 98)
          {
            apprise("Max cover creator drawings selected. Please remove some before adding more.");
            return;
          } else {
            ids.push(id.toString());
          }
        } else {
          $(this).attr("disabled", "disabled").find("b").text("Already added!");
          return;
        }
        $.cookie('covercreatorids', JSON.stringify(ids), {expires: 365, path: '/'});
        $(this).attr("disabled", "disabled").find("b").text("Added!");
      }
    );
    $(".gamepanel").after(ccButton);
  }

  if (options.rememberPosition && $(".regForm > .lead").text().match(/public game/)) // your own panel
  {
    panelPositions.load();
    if (!panelPositions.player[panelId])
    {
      $.get("/player/" + userid + "/-/", function(html)
      {
        html = html.replace(/<img\b[^>]*>/ig, ''); // prevent image preload
        var profilePage = $.parseHTML(html);
        var panelProgressText = $(profilePage).find("a[href='" + location.pathname + "']").next().find(".progress-bar-text").text();
        var panelPosition = parseInt(panelProgressText.match(/\d+/)[0]);
        panelPositions.player[panelId] = panelPosition;
        panelPositions.clear(profilePage);
        panelPositions.save();

        $(".regForm > .lead").append("<br>").append($("<span>").text(panelProgressText));
      });
    }
  }
}

var panelPositions =
{
  player: null,
  last: null,
  load: function ()
  {
    function loadObj(key)
    {
      var val = localStorage.getItem(key);
      return val && JSON.parse(val) || {};
    }

    panelPositions.player = loadObj("gpe_panelPositions");
    panelPositions.last = loadObj("gpe_lastGamePositions");
  },
  save: function ()
  {
    localStorage.setItem("gpe_panelPositions", JSON.stringify(panelPositions.player));
    localStorage.setItem("gpe_lastGamePositions", JSON.stringify(panelPositions.last));
  },
  clear: function (page)
  {
    function clearKeys(obj, keys)
    {
      $.each(obj, function (k) { if (keys.indexOf(k) < 0) delete obj[k]; });
    }

    var existingIds = $(page).find(".progress-striped").map(function()
    {
      return getPanelId($(this).prev().attr("href"));
    }).get();
    clearKeys(panelPositions.player, existingIds);
    clearKeys(panelPositions.last, existingIds);
  }
};

function initAjaxRetry()
{
  if (!options.ajaxRetry) return;

  var requestCount = 0;

  $.ajaxPrefilter(function (options, originalOptions)
  {
    requestCount++;
    $("body").css("cursor", "progress");

    if (options.retryEnabled) return;

    var isComment = options.url === "/game/comments/add.json";
    var retryCount = 0;

    options.retryEnabled = true;
    options.success = function (data, textStatus, jqXHR)
    {
      if (options.url === "/game/like/panel.json" && data && data.error === "Invalid request. You already liked this?")
      {
        data = { callJS: "updateLikeDisplay", data: { panelid: originalOptions.data.panelid, setstatus: originalOptions.data.action === "Like" ? "on" : "off"} };
      }

      if (options.url === "/play/skip.json" && data && data.error === "Sorry, but we couldn\u0027t find your current game.")
      {
        location.reload();
        return;
      }

      if (options.url === "/play/exit.json" && data && data.error === "Sorry, but we couldn\u0027t find your current game.")
      {
        location.pathname = "/";
        return;
      }

      originalOptions.success && originalOptions.success(data, textStatus, jqXHR);
    };
    options.error = function ()
    {
      if (!isComment && retryCount++ < 5)
        $.ajax(options);
      else
        originalOptions.error && originalOptions.error.apply(this, arguments);

      if (isComment)
        $("#commentButton").button("reset");
    };
    options.complete = function ()
    {
      originalOptions.complete && originalOptions.complete.apply(this, arguments);

      if (--requestCount <= 0)
        $("body").css("cursor", "");
    };
  });
}

function getPanelId(url)
{
  var match = url.match(/\/panel\/[^\/]+\/(\w+)\//);
  return match && match[1];
}

function simpleHash(s)
{
  return s.toString().split("").reduce(function(a, b)
    {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0
  );
}

function rot13(s)
{
  return s.toString().split("").map(function(c)
    {
      c = c.charCodeAt(0);
      if (c >= 97 && c <= 122) c = (c - 97 + 13) % 26 + 97;
      if (c >= 65 && c <= 90) c = (c - 65 + 13) % 26 + 65;
      return String.fromCharCode(c);
    }
  ).join("");
}

function randomGreeting()
{
  // Spoilers!
  var g = ["Oruvaq lbh!", "Ubcr vg'f abg envavat gbqnl.", "Jurer vf lbhe tbq abj?",
    "Lbh fubhyq srry 5% zber cbjreshy abj.", "Fhqqrayl, abguvat unccrarq!", "^_^",
    "Guvf gnxrf fb ybat gb svavfu...", "Jungrire lbh qb, qba'g ernq guvf grkg.",
    "Pyvpx urer sbe 1 serr KC", "Or cngvrag.", "Whfg qba'g fgneg nal qenzn nobhg vg.",
    "47726S6Q2069732074686520677265617465737421", "Cynl fzneg.", "Cynl avpr.",
    "Fzvyr!", "Qba'g sbetrg gb rng.", "V xabj jung lbh'ir qbar.", "Fpvrapr!",
    "Gbqnl vf n tbbq qnl."];
  var change_every_half_day = Math.floor(Date.now() / (1000 * 60 * 60 * 12));
  var rnddata = simpleHash(change_every_half_day + parseInt(userid, 10) + 178889);
  return rot13(g[rnddata % g.length]);
}

function formatTimestamp(d)
{
  if (typeof d == "number") d = new Date(d);
  if (options.localeTimestamp) return d.toLocaleString();
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var s = [
    (100 + d.getDate() + "").slice(-2),
    " ",
    months[d.getMonth()],
    " ",
    d.getFullYear(),
    " ",
    (100 + d.getHours() + "").slice(-2),
    ":",
    (100 + d.getMinutes() + "").slice(-2)
  ].join("");
  return s;
}

window.viewMyPanelFavorites = viewMyPanelFavorites;
function viewMyPanelFavorites()
{
  var panels = localStorage.getItem("gpe_panelFavorites");
  panels = panels ? JSON.parse(panels) : {};
  var result = "";
  var needsupdate = false;
  for (var id in panels)
  {
    if (panels[id].image && panels[id].image.match(/^\/pub\/panels\//))
    {
      needsupdate = true;
      panels[id].image = panels[id].image.replace("/pub/panels/", "https://cdn.drawception.com/images/panels/");
    }
    result += '<div id="' + id + '" style="float: left; position: relative; min-width: 150px;">' +
      '<div class="thumbpanel-holder" style="overflow:hidden"><a class="anbt_paneldel" href="#" title="Remove">X</a>' +
      '<a href="/panel/-/' +
      id + '/-/" class="thumbpanel" rel="tooltip" title="' +
      panels[id].caption + '">' +
      (panels[id].image
        ? '<img src="' + panels[id].image + '" width="125" height="104" alt="' + panels[id].caption + '" />'
        : panels[id].caption) +
      '</a><span class="text-muted" style="white-space:nowrap">by ' + panels[id].by +
      '</span><br><small class="text-muted"><span class="fas fa-heart"></span> ' +
      formatTimestamp(panels[id].time) + '</small></div></div>';
  }
  if (needsupdate)
  {
    localStorage.setItem("gpe_panelFavorites", JSON.stringify(panels));
  }
  if (result)
  {
    result += '<div style="clear:left"></div>';
  } else {
    result = "You don't have any favorited panels.";
  }
  $("#anbt_userpage").html(result);
  $("#anbt_userpage").on("click", ".anbt_paneldel", function(e)
    {
      e.preventDefault();
      var id = $(this).parent().parent().attr("id");
      $("#" + id).fadeOut();
      delete panels[id];
      localStorage.setItem("gpe_panelFavorites", JSON.stringify(panels));
    }
  );
}

window.viewMyGameBookmarks = viewMyGameBookmarks;
function viewMyGameBookmarks()
{
  var removeButtonHTML = '<a class="anbt_gamedel pull-right lead fas fa-times btn btn-sm btn-danger" href="#" title="Remove" style="margin-left: 10px"></a>';
  var games = localStorage.getItem("gpe_gameBookmarks");
  games = games ? JSON.parse(games) : {};
  var result = "";
  for (var id in games)
  {
    var extraClass = "";
    if (games[id].own) {
      extraClass = " anbt_owncaption";
    }
    if (id.length > 10) // token, seen lengths: 43, 32; just in case assuming everything > 10 is a token
    {
      result += '<p class="well' + extraClass + '" id="' + id + '"><span>' + id + '</span>' + removeButtonHTML + '</p>';
      (function(id)
        {
          $.ajax(
            {
              url: '/play/' + id,
              cache: false,
              error: function(e)
              {
                $("#" + id).find("span").text("Error while retrieving game: " + e.statusText);
                return;
              },
              success: function(e)
              {
                var m = e.match(/Game is not private/) || e.match(/Problem loading game/) && "del";
                if (m)
                {
                  var gamename = "";
                  if (games[id].caption) gamename += " " + games[id].caption;
                  if (games[id].own) gamename = " with your caption" + gamename;
                  if (games[id].time) gamename += " bookmarked on " + formatTimestamp(games[id].time);
                  if (!gamename) gamename = id;
                  var status = (m == "del") ? "Deleted" : "Unfinished public";
                  $("#" + id).find("span").text(status + " game" + gamename);
                  return;
                }
                var title = e.match(/<title>(.+)<\/title>/)[1];
                m = e.match(/\/game\/([^\/]+)\/[^\/]+\//);
                var url = m[0];
                var gameid = m[1];
                delete games[id];
                games[gameid] = {title: title, url: url};
                $("#" + id).attr("id", gameid).find("span").replaceWith('<a href="' + url +'">' + title + '</a>');
                localStorage.setItem("gpe_gameBookmarks", JSON.stringify(games));
              }
            }
          );
        }
      )(id);
    }
    else if (id.length == 10) // game ID
    {
      result += '<p class="well' + extraClass + '" id="' + id + '"><a href="' + games[id].url + '">' + games[id].title + '</a>' + removeButtonHTML + '</p>';
    }
  }
  if (!result) result = "You don't have any bookmarked games.";
  $("#anbt_userpage").html(result);
  $("#anbt_userpage").on("click", ".anbt_gamedel", function(e)
    {
      e.preventDefault();
      var id = $(this).parent().attr("id");
      $("#" + id).fadeOut();
      delete games[id];
      localStorage.setItem("gpe_gameBookmarks", JSON.stringify(games));
    }
  );
}

// Convert times
// Forum time is Florida, GMT-6, to be +1 DST since 08 Mar 2015, 2:00
// starts on the second Sunday in March and ends on the first Sunday in November
function isFloridaDST()
{
  d = new Date(Date.now() - 6 * 60 * 60 * 1000);
  var month = d.getUTCMonth();
  var day = d.getUTCDate();
  var hours = d.getUTCHours();
  var dayofweek = d.getUTCDay();

  if (month < 2 || month > 10) return false;
  if (month > 2 && month < 10) return true;
  if (month == 2)
  {
    if (day < 8) return false;
    if (day > 14) return true;
    if (dayofweek == 7) return (hours > 1);
    return day > dayofweek + 7;
  }
  if (month == 10)
  {
    if (day > 7) return false;
    if (dayofweek == 7) return (hours < 1);
    return day <= dayofweek;
  }
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function convertForumTime(year, month, day, hours, minutes)
{
  var d = new Date(year, month, day, hours, minutes);
  var tzo = d.getTimezoneOffset() * 60 * 1000;
  var dst = isFloridaDST();
  return formatTimestamp(d.getTime() - tzo + (6 - dst) * 60 * 60 * 1000);
}

function betterPlayer()
{
  // Linkify the links in location
  var pubinfo = $('.profile-user-header div>b:contains("Location")').parent();
  if (pubinfo.length)
  {
    linkifyNodeText(pubinfo);
  }

  var loc = document.location.href;
  // If it's user's homepage, add new buttons in there
  if (loc.match(new RegExp('/player/' + userid + '/[^/]+/(?:$|#)')))
  {
    var a = $("<h2>ANBT stuff: </h2>");
    a.append('<a class="btn btn-primary" href="#anbt_panelfavorites" onclick="viewMyPanelFavorites();">Panel Favorites</a> ');
    a.append('<a class="btn btn-primary" href="#anbt_gamebookmarks" onclick="viewMyGameBookmarks();">Game Bookmarks</a> ');
    var profilemain = $(".profile-owner-content-main").first();
    profilemain.prepend('<p id="anbt_userpage">' + randomGreeting() + '</p>');
    profilemain.prepend(a);

    if (document.location.hash.indexOf("#anbt_panelfavorites") != -1) viewMyPanelFavorites();
    if (document.location.hash.indexOf("#anbt_gamebookmarks") != -1) viewMyGameBookmarks();

    if (options.rememberPosition)
    {
      panelPositions.load();
      panelPositions.clear(document);

      $(".progress-striped").each(function ()
      {
        var panelId = getPanelId($(this).prev().attr("href"));
        var playerPanelPosition = panelPositions.player[panelId];
        var lastSeenPanelPosition = panelPositions.last[panelId];
        var panelProgress = $(this).find(".progress-bar-text");
        var panelProgressText = panelProgress.text();
        var panelPosition = parseInt(panelProgressText.match(/\d+/)[0]);
        var totalPanelCount = parseInt(panelProgressText.match(/\d+/g)[1]);

        panelProgress.css("pointer-events", "none"); // to make tooltips work under label
        if ((playerPanelPosition || lastSeenPanelPosition || panelPosition) < panelPosition)
        {
          $(this).find(".progress-bar")
            .width((playerPanelPosition || lastSeenPanelPosition) / totalPanelCount * 100 + "%");
        }
        if (playerPanelPosition && panelPosition > playerPanelPosition && playerPanelPosition < lastSeenPanelPosition)
        {
          $('<div class="progress-bar progress-bar-info" title="Panels added after yours">')
            .width((Math.min(lastSeenPanelPosition || panelPosition, panelPosition) - playerPanelPosition) / totalPanelCount * 100 + "%")
            .insertBefore(panelProgress)
            .tooltip();
        }
        if (lastSeenPanelPosition && panelPosition > lastSeenPanelPosition)
        {
          $('<div class="progress-bar progress-bar-success" title="Panels added recently">')
            .width((panelPosition - lastSeenPanelPosition) / totalPanelCount * 100 + "%")
            .insertBefore(panelProgress)
            .tooltip();
        }
        if (lastSeenPanelPosition && panelPosition < lastSeenPanelPosition)
        {
          $('<div class="progress-bar progress-bar-danger" title="Panel was removed recently">')
            .width(1 / totalPanelCount * 100 + "%")
            .insertBefore(panelProgress)
            .tooltip();
        }
        if (playerPanelPosition)
        {
          $('<span title="Your panel position">')
            .text("#" + playerPanelPosition)
            .insertBefore(this)
            .tooltip();
        }

        panelPositions.last[panelId] = panelPosition;
      });

      panelPositions.save();
    }

    // Show your exact registration date
    if (window.date)
    {
      var pubinfo = $(".profile-user-header>div.row>div>h1+p");
      if (pubinfo.length)
      {
        var newregdate = formatTimestamp(date);
        pubinfo.contents()[4].nodeValue = " " + newregdate + " \xa0";
      }
    }

  } else { // Not the current user's profile or not profile homepage
    var drawings = $('img[src^="https://cdn.drawception.com/images/panels/"],img[src^="https://cdn.drawception.com/drawings/"]');
    // Show replayable panels; links are not straightforward to make since there's no panel ID
    if (options.newCanvas)
    {
      var addReplaySign = function()
      {
        if (this.replayAdded) return;
        this.replayAdded = true;
        var panel = $(this).parent().parent();
        var src = this.src;
        checkForRecording(this.src, function()
        {
          var replaySign;
          var newid = src.match(/(\w+).png$/)[1];
          if (newid.length > 8)
          {
            replaySign = $('<a href="/sandbox/#' + newid + '" class="pull-right fas fa-redo-alt" style="color:#8af;margin-right:4px" title="Replay!"></a>');
            replaySign.click(function(e)
            {
              if (e.which === 2) return;
              e.preventDefault();
              setupNewCanvas(true, "/sandbox/#" + newid);
            });
          } else {
            replaySign = $('<span class="pull-right fas fa-redo-alt" style="color:#8af;margin-right:4px" title="Replayable!"></span>');
          }
          panel.append(replaySign);
          replaySign.tooltip();
        });
      };
      drawings.on("load", addReplaySign);
      drawings.each(function()
      {
        if (this.complete) addReplaySign.call(this);
      });
    }
    // Detect Draw Firsts
    drawings.each(function()
    {
      if (this.src.match(/-1\.png$/))
      {
        var drawFirstSign = $('<span class="pull-right" title="Draw First game"><img src="/img/icon-coins.png"></span>');
        $(this).parent().parent().append(drawFirstSign);
        drawFirstSign.tooltip();
      }
    });
  }

  // Convert timestamps in user profile's forum posts and game comments
  if (loc.match(/player\/\d+\/[^/]+\/(posts)|(comments)\//))
  {
    // Show topic title at the top of the posts instead and display subforum
    // Show game title at the top of the posts
    $(".forum-thread-starter").each(function()
      {
        var t = $(this);
        var vue = this.childNodes[0].__vue__;
        if (vue)
        {
          var ts = t.find("a.text-muted").first();
          var text = ts.text().trim();
          ts.text(text + ", " + formatTimestamp(vue.comment_date * 1000));
          if (vue.edit_date > 0)
          {
            var el = ts.parent().find('span[rel="tooltip"]');
            var text2 = el.attr('title');
            text2 += ", " + formatTimestamp(vue.edit_date * 1000).replace(/ /g, "\u00A0"); // prevent the short tooltip width from breaking date apart
            el.attr('title', text2);
          }
        }
        var postlink = t.find(".add-margin-top small.text-muted");
        var created = postlink.text().match(/^\s*Created/);
        var commented = postlink.text().match(/^\s*Commented/);
        var prefix = commented ? "Comment in the game" : created ? "New thread" : "Reply in";
        var n = $('<h4 class="anbt_threadtitle">' + prefix + ": </h4>");
        var thread = postlink.find("a");
        n.append(thread);
        t.prepend(n);
        postlink.parent().remove();
      }
    );
  }
}

function betterForum()
{
  var ncPosts = [];
  $("span.muted, span.text-muted, small.text-muted").each(function(index)
    {
      var year, month, day, minutes, hours;
      var m, t = $(this), tx = t.text();
      // Don't touch relative times
      if (tx.indexOf('ago') != -1) return;
      if (m = tx.match(/^\s*\(last post (...) (\d+).. (\d+):(\d+)([ap]m)\)\s*$/))
      {
        var d = new Date();
        month = months.indexOf(m[1]);
        day = parseInt(m[2], 10);
        hours = parseInt(m[3], 10) % 12;
        minutes = parseInt(m[4], 10);
        year = d.getFullYear();
        if ((d.getMonth() < 6) && (month >= 6)) year--;
        hours += (m[5] == 'pm') ? 12 : 0;
        var time = convertForumTime(year, month, day, hours, minutes);
        t.text("(last post " + time + ")");
        // Track new posts at subforum list
        if (location.href.match(/forums\/$/))
        {
          if (time != localStorage.getItem("anbt_subforum" + index))
          {
            t.parent().prepend('<span class="label label-sm label-warning">NEW</span> ');
            localStorage.setItem("anbt_subforum" + index, time);
          }
        }
      }
    }
  );

  if (options.markStalePosts)
  {
    function markStalePost(el, age)
    {
      if (age < 30) return;
      var r = 0;
      if (age > 60) r = 1;
      if (age > 120) r = 2;
      if (age > 365) r = 3;
      el.addClass("anbt_necropost anbt_necropost" + r);
    }
    // Skip the first post
    for (var i = 1; i < ncPosts.length; i++)
    {
      var el = ncPosts[i][0];
      var time = ncPosts[i][1];
      var lastpage = !$(".pagination").length || $(".pagination .active:last-child").length;
      var nexttime = ncPosts[i + 1] ? ncPosts[i + 1][1] : (lastpage ? Date.now() / 86400000 : 0);
      var age = nexttime - time;
      if (age > 30)
      {
        markStalePost($(el).parent().parent().parent().parent(), age);
      }
    }

    GM_addStyle(
      ".anbt_necropost:after {display: block; height: 14px; border-bottom: 2px solid black; content: ' '; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAOCAMAAADOvxanAAAAElBMVEUAAAD///8wLiSYlYNnZFXm5Nfd4sMOAAAAAnRSTlMAAHaTzTgAAABBSURBVHheXchBEoBADAJBMsD/v2yZdS8Oly40k9NIk54ySm/8DYb6NWuuex1ak7VdbAcpNrCU8HmP4/hzd9oAXj6sBgHBLAHrRAAAAABJRU5ErkJggg==)}" +
      ".anbt_necropost0:after {background: none; border-bottom: 1px solid black}" +
      ".anbt_necropost1:after {background: none}" +
      ".anbt_necropost2:after {background-repeat: no-repeat; background-position: center}" +
      ".anbt_necropost3:after {}" +
      ".anbt_necropost span.muted:after {content: ' (old post)'}"
    );
  }
  // Linkify the links
  $('.comment-body *').each(function()
    {
      linkifyNodeText(this);
    }
  );

  // Linkify drawing panels
  $('img[src*="/images/panels/"], img[src*="/pub/panels/"]').each(function()
    {
      var t = $(this);
      if (!t.parent().is("a"))
      {
        var gameid = t.attr("src").match(/\/([^-]+)-\d+.png/)[1];
        var gameurl = "/game/" + gameid + "/-/";
        t.wrap('<a href="' + gameurl +'"></a>');
      }
    }
  );
  $('img[src*="/drawings/"]').each(function()
    {
      var t = $(this);
      if (!t.parent().is("a"))
      {
        var panelid = t.attr("src").match(/(\w+).png$/)[1];
        var panelurl = "/panel/drawing/" + panelid + "/-/";
        t.wrap('<a href="' + panelurl +'"></a>');
      }
    }
  );
  $('img[src*="/panel/"]').each(function()
    {
      var t = $(this);
      if (!t.parent().is("a"))
      {
        t.wrap('<a href="' + t.attr("src") + '-/"></a>');
      }
    }
  );
  // Linkify full game image
  $('img[src*="/images/games/"], img[src*="/pub/games/"]').each(function()
    {
      var t = $(this);
      if (!t.parent().is("a"))
      {
        var gameid = t.attr("src").match(/\/([^\/]+)\.png/)[1];
        var gameurl = "/game/" + gameid + "/-/";
        t.wrap('<a href="' + gameurl +'"></a>');
      }
    }
  );
  // Fix the dead link
  $('img[src*="/display-panel.php?"]').each(function()
    {
      var t = $(this);
      if (!t.parent().is("a"))
      {
        var panelid = t.attr("src").match(/x=(\d+)/)[1];
        var newsrc = "/panel/drawing/" + scrambleID(panelid) + "/";
        t.attr("src", newsrc);
        t.wrap('<a href="' + newsrc + '-/"></a>');
      }
    }
  );

  // Show posts IDs and link
  if (document.location.pathname.match(/\/forums\/(\w+)\/.+/))
  {
    var hideuserids = options.forumHiddenUsers ? options.forumHiddenUsers.split(",") : "";
    if (hideuserids != "")
    {
      GM_addStyle(
        ".anbt_hideUserPost:not(:target) {opacity: 0.4; margin-bottom: 10px}" +
        ".anbt_hideUserPost:not(:target) .comment-body, .anbt_hideUserPost:not(:target) .avatar {display: none}" +
        ""
      );
    }
    var lastid = 0;
    $(".comment-avatar").parent().parent().parent().each(function()
      {
        var t = $(this), anch, id;
        t.addClass("comment-holder"); // No identification for these anymore, this is unhelpful!
        try
        {
          anch = t.attr("id");
        } catch(e) {}
        var ts = t.find("a.text-muted").first();
        var vue = this.childNodes[0].__vue__;
        if (vue)
        {
          var text = ts.text().trim();
          ts.text(text + ", " + formatTimestamp(vue.comment_date * 1000));
          if (vue.edit_date > 0)
          {
            var el = ts.parent().find('span[rel="tooltip"]');
            var text2 = el.attr('title');
            text2 += ", " + formatTimestamp(vue.edit_date * 1000).replace(/ /g, "\u00A0"); // prevent the short tooltip width from breaking date apart
            el.attr('title', text2);
          }
        }
        if (anch)
        {
          id = parseInt(anch.substring(1), 10);
          var text = ts.text().trim();
          ts.text(text + " #" + id);
          ts.attr("title", "Link to post");
          if (id < lastid)
          {
            ts.addClass("wrong-order");
          }
          var h = t.find('a[href^="/player/"]').first().attr('href');
          if (h)
          {
            var userid = h.match(/\d+/)[0];
            if (hideuserids.indexOf(userid) != -1) t.addClass('anbt_hideUserPost');
          }
          lastid = id;
        }
      }
    );

    // Warn about posting to another page
    if ($(".comment-holder").length == 20)
    {
      $("#comment-form btn-primary").after('<div>Note: posting to another page</div>');
    }
  }

  if (options.proxyImgur)
  {
    $('img[src*="imgur.com/"]').each(function()
      {
        var t = $(this);
        // Google Proxy has died.
        //t.attr("src", "http://www.gmodules.com/ig/proxy?url=" + encodeURIComponent(t.attr("src")));
        t.attr("src", t.attr("src").replace('imgur.com', 'filmot.com'));
      }
    );
  }

  var pagination = $(".pagination");
  if (pagination.length)
  {
    var e = pagination.clone();
    $(".breadcrumb").after(e);
    e.wrap('<div class="text-center"></div>');
  }

  // For the topic list pages only
  if (document.location.pathname.match(/\/forums\/(\w+)\/$/))
  {
    var hidden_topics = localStorage.getItem("gpe_forumHiddenTopics");
    hidden_topics = hidden_topics ? JSON.parse(hidden_topics) : [];
    var hidden = 0;

    var tempUnhideLink = $('<a class="text-muted anbt_unhidet">');

    $(".forum-thread").each(function()
      {
        var t = $(this);
        var m = t.find("a:first-child").attr("href").match(/\/forums\/\w+\/(\d+)\//);
        // Don't let them hide the ANBT topic ;)
        if (!m || !m[1] || (m[1] == 11830)) return;

        var id = m[1];
        if (hidden_topics.indexOf(id) != -1)
        {
          t.addClass("anbt_hidden");
          hidden++;
        }
        var hideLink = $('<a class="text-muted anbt_hft">');
        hideLink.click(function()
          {
            var ht = localStorage.getItem("gpe_forumHiddenTopics");
            ht = ht ? JSON.parse(ht) : [];
            if (hidden_topics.indexOf(id) != -1)
            {
              if (ht.indexOf(id) != -1) ht.remove(id);
              hidden_topics.remove(id);
              t.removeClass("anbt_hidden");
              hidden--;
            } else {
              if (ht.indexOf(id) == -1) ht.push(id);
              hidden_topics.push(id);
              t.addClass("anbt_hidden");
              hidden++;
              tempUnhideLink.show();
            }
            tempUnhideLink.text(hidden);
            localStorage.setItem("gpe_forumHiddenTopics", JSON.stringify(ht));
          }
        );
        t.find("p:nth-child(2)").append(hideLink);
      }
    );
    tempUnhideLink.text(hidden);
    tempUnhideLink.click(function(){ $("#main").toggleClass("anbt_showt"); });
    if (!hidden) tempUnhideLink.hide();
    $(".forum-thread").first().before(tempUnhideLink);
  }
}

function loadScriptSettings()
{
  var result = localStorage.getItem("gpe_anbtSettings");
  if (!result) return;
  result = JSON.parse(result);
  for (var i in result) options[i] = result[i];
}

window.updateScriptSettings = updateScriptSettings;
function updateScriptSettings(theForm)
{
  var result = {};
  $(theForm).find("input,textarea").each(function()
    {
      if (this.type == "checkbox")
      {
        result[this.name] = this.checked ? 1 : 0;
      }
      else if (this.getAttribute("data-subtype") == "number")
      {
        result[this.name] = parseFloat(this.value) || 0;
      }
      else
      {
        result[this.name] = this.value;
      }
    }
  );
  localStorage.setItem("gpe_anbtSettings", JSON.stringify(result));
  loadScriptSettings();
  $("#anbtSettingsOK").fadeIn("slow").fadeOut("slow");
  return false;
}

function escapeHTML(t)
{
  return t.toString().replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function addScriptSettings()
{
  var theForm = $('<form class="regForm form-horizontal" action="#" onsubmit="return updateScriptSettings(this);"></form>');
  theForm.append('<legend>ANBT script settings</legend>');

  var addGroup = function(name, settings)
  {
    var div = $('<div class="control-group"></div>');
    div.append('<label class="control-label">' + name + '</label>');
    settings.forEach(function(id)
      {
        var v = options[id[0]], name = id[0], t = id[1], desc = id[2];
        var c = $('<div class="controls"></div>');
        if (t == "boolean")
        {
          c.append('<label><input type="checkbox" id="anbt_' + name + '" name="' + name + '" value="1" ' + (v ? 'checked="checked"' : '') + '"> ' + desc + '</label>');
        }
        else if (t == "number")
        {
          if (!v) v = 0;
          c.append('<b>' + desc + ':</b><input class="form-control" type="text" data-subtype="number" name="' + name + '" value="' + escapeHTML(v) + '">');
        }
        else if (t == "longstr")
        {
          c.append('<b>' + desc + ':</b><textarea class="form-control" name="' + name + '">' + escapeHTML(v) + '</textarea>');
        }
        else
        {
          c.append('<b>' + desc + ':</b><input class="form-control" type="text" name="' + name + '" value="' + escapeHTML(v) + '">');
        }
        div.append(c);
      }
    );
    theForm.append(div);
  };
  addGroup('Pen Tablet (requires plugin: <a href="http://www.wacomeng.com/web/fbWTPInstall.zip">Windows</a> | <a href="http://www.wacomeng.com/web/Wacom%20Mac%20Plug-in%20Installer.zip">Mac OS</a> | <a href="https://github.com/ZaneA/WacomWebPlugin">Linux</a>)',
    [
      ["enableWacom", "boolean", "Enable Wacom plugin / pressure sensitivity support"],
      ["fixTabletPluginGoingAWOL", "boolean", "Try to prevent Wacom plugin from disappearing"],
      //["pressureExponent", "number", "Pressure exponent (smaller = softer tablet response, bigger = sharper)"],
    ]
  );
  addGroup("Play (most settings are for the new canvas only)",
    [
      ["newCanvas", "boolean", 'New drawing canvas (also allows <a href="http://grompe.org.ru/replayable-drawception/">watching playback</a>)'],
      ["submitConfirm", "boolean", "Confirm submitting if more than a minute is left"],
      ["smoothening", "boolean", "Smoothing of strokes"],
      ["hideCross", "boolean", "Hide the cross when drawing"],
      ["enterToCaption", "boolean", "Submit captions (and start games) by pressing Enter"],
      ["backup", "boolean", "Save the drawing in case of error and restore it in sandbox"],
      ["timeoutSound", "boolean", "Warning sound when only a minute is left (normal games)"],
      ["timeoutSoundBlitz", "boolean", "Warning sound when only 5 seconds left (blitz)"],
      ["timeoutSoundVolume", "number", "Volume of the warning sound, in %"],
      ["rememberPosition", "boolean", "Show your panel position and track changes in unfinished games list"],
      ['colorNumberShortcuts', 'boolean', "Use 0-9 keys to select the color"],
      ['colorUnderCursorHint', 'boolean', "Show the color under the cursor in the palette"],
      ['colorDoublePress', 'boolean', 'Double press 0-9 keys to select color without pressing shift'],
      ['bookmarkOwnCaptions', 'boolean', "Automatically bookmark your own captions in case of dustcatchers"],
    ]
  );
  addGroup("Miscellaneous",
    [
      ["localeTimestamp", "boolean", "Format timestamps as your system locale (" + (new Date()).toLocaleString() +")"],
      ["ownPanelLikesSecret", "boolean", "Hide your own panels' number of Likes (in game only)"],
      ["proxyImgur", "boolean", "Replace imgur.com links to filmot.com to load, in case your ISP blocks them"],
      ["ajaxRetry", "boolean", "Retry failed AJAX requests"],
      ["autoplay", "boolean", "Automatically start replay when watching playback"],
      ["autoBypassNSFW", "boolean", "Automatically bypass NSFW game warning"],
      ["markStalePosts", "boolean", "Mark stale forum posts"],
      ["maxCommentHeight", "number", "Maximum comments and posts height until directly linked (px, 0 = no limit)"],
      ["useOldFont", "boolean", "Use old Nunito font (which is usually bolder and less wiggly)"],
      ["useOldFontSize", "boolean", "Use old, smaller font size"],
      ["colorizeNavBar", "boolean", "Change top bar color based on panel colors"],
      ["checkForNotifications", "boolean", "Check for notifications periodically while page is open"],
    ]
  );
  addGroup("Advanced",
    [
      ["newCanvasCSS", "longstr", 'Custom CSS for new canvas (experimental, <a href="https://github.com/grompe/Drawception-ANBT/tree/master/newcanvas_styles">get styles here</a>)'],
      ["forumHiddenUsers", "longstr", 'Comma-separated list of user IDs whose forum posts are hidden'],
    ]
  );
  theForm.append('<br><div class="control-group"><div class="controls"><input name="submit" type="submit" class="btn btn-primary" value="Apply"> <b id="anbtSettingsOK" class="label label-theme_holiday" style="display:none">Saved!</b></div></div>');
  $("#main").prepend(theForm);

  // Extend "location" input to max server-accepted 65 characters
  $('input[name="location"]').attr('maxlength', "65");
}

function autoSkip(reason)
{
  var autoSkipInfo = $('<div id="autoSkipInfo" class="text-warning" style="cursor: pointer">(CLICK TO CANCEL)<br>Auto-skipping in <span id="autoSkipCounter">3</span>...<br>Reason: ' +  reason + '</div>');
  $(".play-instruction").append(autoSkipInfo);
  autoSkipInfo.click(function(e)
    {
      e.preventDefault();
      $("#autoSkipCounter").countdown("pause");
      autoSkipInfo.hide();
    }
  );
  $("#autoSkipCounter").countdown({
      until: 3,
      compact: 1,
      format: "S",
      onExpiry: timesUp
  });
}

var theAlphabet = "36QtfkmuFds0UjlvCGIXZ125bEMhz48JSYgipwKn7OVHRBPoy9DLWaceqxANTr";
// Game IDs will never contain these symbols: u 0U lv I J i V o
// So they are base 52 for some reason...

function decTo62(n)
{
  var b = theAlphabet;
  var result = '';
  var bLen = b.length;
  while (n != 0) {
    var q = n % bLen;
    result = b[q] + result;
    n = (n - q) / bLen;
  }
  return result;
}

function _62ToDec(n)
{
  n = n.toString();
  var b = theAlphabet;
  var cache_pos = {};
  var bLen = b.length;
  var result = 0;
  var pow = 1;
  for (var i = n.length-1; i >= 0; i--) {
    var c = n[i];
    if (typeof cache_pos[c] == 'undefined') {
      cache_pos[c] = b.indexOf(c);
    }
    result += pow * cache_pos[c];
    pow *= bLen;
  }
  return result;
}

window.scrambleID = scrambleID;
function scrambleID(num)
{
  if (isNaN(num)) throw new Error("Invalid panel ID");
  return decTo62(parseInt(num, 10) + 3521614606208).split("").reverse().join("");
}

window.unscrambleID = unscrambleID;
function unscrambleID(str)
{
  return _62ToDec(str.split("").reverse().join("")) - 3521614606208;
}

window.stalkNextPanel = stalkNextPanel;
function stalkNextPanel(forward)
{
  if (!forward) forward = 1;
  var sid = location.href.match(/\/panel\/[^\/]+\/(\w+)\/[^\/]+\//)[1];
  var sid2 = scrambleID(unscrambleID(sid) + 1 * forward);
  location.href = location.href.replace(sid, sid2);
}

function valueToHex(val)
{
  return (Math.floor(val/16)%16).toString(16)+(Math.floor(val)%16).toString(16);
}

function eyedropper(x, y)
{
  var p = drawApp.context.getImageData(x, y, 1, 1).data;
  return (p[3] > 0) ? ("#" + valueToHex(p[0]) + valueToHex(p[1]) + valueToHex(p[2])) : null;
}

function invertColor(c)
{
  // Support only hex color
  if (c.charAt(0) != "#") return c;
  c = c.substring(1);
  // Ensure it's in long form
  if (c.length == 3) c = c.charAt(0) + c.charAt(0) + c.charAt(1) + c.charAt(1) + c.charAt(2) + c.charAt(2);
  return "#" + ("000000" + (parseInt(c, 16) ^ 0xFFFFFF).toString(16)).slice(-6);
}

function pagodaBoxError()
{
  if ((document.title == "Pagoda Box") &&
      (
           (document.body.innerHTML.match("All Routes" + " Down."))
        || (document.body.innerHTML.match("There appears to be an error" + " with this site."))
      )
    )
  {
    GM_addStyle(
      "body {background: #755 !important}" +
      ""
    );
    div = document.createElement("div");
    div.innerHTML = '<h1>ANBT speaking:</h1>' +
      'Meanwhile, you can visit the chat: ' +
      '<a href="http://chat.grompe.org.ru/#drawception">http://chat.grompe.org.ru/#drawception</a><br>' +
      'Or use the new sandbox: <a href="http://grompe.org.ru/drawit/">http://grompe.org.ru/drawit/</a>';
    document.body.appendChild(div);
    return true;
  }
}

function hookIntoWebpack()
{
  webpackJsonp([0], // 0 is the "common" pack
  {
    65535: function(module, exports, __webpack_require__)
    {
      // obfuscated value. If this changes, then this will be an update hell...
      var jQuery = __webpack_require__("7t+N");

      window.$ = window.jQuery = jQuery;
    },
  }, [65535]);
}

function pageEnhancements()
{
  var loc = document.location.href;
  loadScriptSettings();

  if (typeof DrawceptionPlay == "undefined") return; // Firefox Greasemonkey seems to call pageEnhancements() after document.write...
  if (document.getElementById("newcanvasyo")) return; // Chrome, I'm looking at you too...
  hookIntoWebpack();

  __DEBUG__ = document.getElementById("_debug_");
  prestoOpera = navigator.userAgent.match(/\bPresto\b/);

  // Stop tracking me! Best to block
  // api.mixpanel.com and cdn.mxpnl.com
  if (typeof mixpanel != "undefined") mixpanel = {track: function(){}, identify: function(){}};

  initAjaxRetry();

  try
  {
    var tmpuserlink = $('.player-dropdown a[href^="/player/"]');
    username = tmpuserlink.find('strong').text();
    userid = tmpuserlink.attr("href").match(/\/player\/(\d+)\//)[1];
    localStorage.setItem("gpe_lastSeenName", username);
    localStorage.setItem("gpe_lastSeenId", userid);
  }
  catch(e){}

  var insandbox = loc.match(/drawception\.com\/sandbox\/#?(.*)/);
  var inplay = loc.match(/drawception\.com\/(:?contests\/)?play\/(.*)/);
  if (options.newCanvas)
  {
    var hasCanvas = document.getElementById("canvas-holder");
    // If created a friend game, the link won't present playable canvas
    var hasCanvasOrGameForm = document.querySelector(".playtimer");
    var captioncontest = loc.match(/contests\/play\//) && !hasCanvas;
    if (!captioncontest && (insandbox || (inplay && hasCanvasOrGameForm) || __DEBUG__))
    {
      setTimeout(function()
      {
        setupNewCanvas(insandbox, loc, document.body.innerHTML);
      }, 1);
      return;
    }
  } else {
    if (insandbox || inplay || __DEBUG__)
    {
      enhanceCanvas(insandbox);
    }
    if (inplay || __DEBUG__)
    {
      empowerPlay();
    }
  }
  if (loc.match(/drawception\.com\/game\//))
  {
    betterGame();
  }
  if (loc.match(/drawception\.com\/panel\//))
  {
    betterPanel();
  }
  if (loc.match(/drawception\.com\/player\//))
  {
    betterPlayer();
  }
  if (loc.match(/drawception\.com\/forums\//))
  {
    betterForum();
  }
  if (loc.match(/drawception\.com\/settings\//))
  {
    addScriptSettings();
  }
  if (loc.match(/drawception\.com\/create/))
  {
    betterCreateGame();
  }
  GM_addStyle(
    ".panel-user {width: auto} .panel-details img.loading {display: none}" +
    ".gpe-wide, .gpe-wide-block {display: none}" +
    ".gpe-btn {padding: 5px 8px; height: 28px}" +
    ".gpe-spacer {margin-right: 7px; float:left}" +
    "@media (min-width:992px) {.navbar-toggle,.btn-menu-player {display: none} .gpe-wide {display: inline} .gpe-wide-block {display: block}}" +
    "@media (min-width:1200px) {.gpe-btn {padding: 5px 16px;} .gpe-spacer {margin-right: 20px;} .panel-number {left: -30px}}" +
    "#anbtver {font-size: 10px; position:absolute; opacity:0.3; right:10px}" +
    ".anbt_paneldel {position:absolute; padding:1px 6px; color:#FFF; background:#d9534f; text-decoration: none !important; right: 18px; border-radius: 5px}" +
    ".anbt_paneldel:hover {background:#d2322d}" +
    ".anbt_favpanel {top: 20px; font-weight: normal; padding: 0 2px}" +
    ".anbt_favpanel:hover {color: #d9534f; cursor:pointer}" +
    ".anbt_favedpanel {color: #d9534f; border-color: #d9534f}" +
    ".anbt_replaypanel {top: 55px; font-weight: normal; padding: 0 8px}" +
    ".anbt_replaypanel:hover {color: #8af; text-decoration: none}" +
    ".anbt_owncaption:before {content: ''; display: inline-block; background: #5C5; border: 1px solid #080; width: 10px; height: 10px; border-radius: 10px; margin-right: 10px;}" +
    ".gamepanel, .thumbpanel, .comment-body {word-wrap: break-word}" +
    ".comment-body img {max-width: 100%}" +
    ".forum-thread.anbt_hidden {display: none}" +
    ".anbt_showt .forum-thread.anbt_hidden {display: block; opacity: 0.6}" +
    ".anbt_unhidet:after {content: ' threads hidden. Show'}" +
    ".anbt_showt .anbt_unhidet:after {content: ' threads hidden. Hide'}" +
    ".anbt_hft:after {content: '[hide]'}" +
    ".anbt_hft, .anbt_unhidet {padding-left: 0.4em; cursor:pointer}" +
    ".forum-thread.anbt_hidden .anbt_hft:after {content: '[show]'}" +
    ".anbt_threadtitle {margin: 0 0 10px}" +
    ".avatar {box-sizing: content-box}" +
    ".pagination {margin: 0px}" +
    ".navbar {position: fixed; width: 100%; top: 0; left: 0; z-index: 1060}" + //floating navbar
    "#main {padding-top: 50px}" + //space for floating navbar
    ".btn-menu {background-color: rgba(0,0,0,.3); height: 30.5px}" + //colors and sizes for navbar buttons
    ".btn-primary {background-color: rgba(0,0,0,.3)}" + //color for play button
    ".btn-info {background-color: rgba(0,0,0,.3)}" + //color for create game button
    ".btn-primary {border-color: rgba(0,0,0,0)}" + //border for play button
    ".btn-info {border-color: rgba(0,0,0,0)}" + //border for create game button
    ".logout-item:hover {background-color: #c93232}" + //logout button red on hover
    ".btn {border-radius: 5px}" + //border radius for buttons
    ".avatar-sm {border-radius: 5px; height: 30.5px; width: 30.5px; margin-top: 2px;}" + //smaller profile button
    ".navbar-toggle {background-color: rgba(0,0,0,.3)}" + //Overflow menu background color
    ".navbar-default .navbar-toggle .icon-bar {background-color: white}" + //Overflow menu icon colors
    ".profile-user-header {background: none; -webkit-box-shadow: none; box-shadow: none;}" + //Remove divider after tabs
    ".profile-header {-webkit-box-shadow: none; box-shadow: none;}" + //Remove shadow from cover
    ""
  );


  if (options.maxCommentHeight)
  {
    var h = options.maxCommentHeight;
    GM_addStyle(
      ".comment-holder[id]:not(:target) .comment-body {overflow-y: hidden; max-height: " + h + "px; position:relative}" +
      ".comment-holder[id]:not(:target) .comment-body:before" +
      "{content: 'Click to read more'; position:absolute; width:100%; height:50px; left:0; top:" + (h-50) + "px;" +
      "text-align: center; font-weight: bold; color: #fff; text-shadow: 0 0 2px #000; padding-top: 20px; background:linear-gradient(transparent, rgba(0,0,0,0.4))}"
    );
    $(".comment-body").click(function()
    {
      var t = $(this);
      if ((t.height() > h-50) && !$(location.hash).has(t).length)
      {
        location.hash = "#" + t.parent().parent().attr("id");
      }
    });
  }
  if (options.useOldFontSize)
  {
    document.body.style.fontSize = "15px";
  }
  if (options.useOldFont)
  {
    $("link[href*='Nunito']").remove();
    GM_addStyle(
      "@font-face { font-family: 'Nunito'; font-style: normal; font-weight: 400; src: local('Nunito Regular'), local('Nunito-Regular'), " +
      "url(data:application/font-woff;base64,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) format('woff');}"
    );
  }
  // Enhance menu for higher resolutions
  var p = $(".navbar-toggle").parent();
  //p.prepend('<a href="/" class="gpe-wide" style="float:left; margin-right:8px"><img src="/img/logo-sm.png" width="166" height="43" alt="drawception" /></a>');
  p.append('<span class="gpe-wide gpe-spacer">&nbsp</span>');
  p.append('<a href="/sandbox/" title="Sandbox" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="background:#5A5; border-radius: 5px 0 0 5px;"><span class="fas fa-edit" style="color:#BFB" /></a>');
  p.append('<a href="/browse/all-games/" title="Browse Games" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="border-radius:0"><span class="fas fa-folder-open" /></a>');
  p.append('<a href="/contests/" title="Contests" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="border-radius:0"><span class="fas fa-trophy" /></a>');
  p.append('<a href="javascript:toggleLight()" title="Toggle light" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="background:#AA5; border-radius:0"><span class="fas fa-eye" style="color:#FFB" /></a>');
  p.append('<a href="/leaderboard/" title="Leaderboards" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="border-radius:0"><span class="fas fa-fire" /></a>');
  p.append('<a href="/faq/" title="FAQ" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="border-radius:0"><span class="fas fa-question-circle " /></a>');
  p.append('<a href="/forums/" title="Forums" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="background:#55A; border-radius: 0"><span class="fas fa-comments" style="color:#BBF" /></a>');
  p.append('<a href="/search/" title="Search" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="border-radius:0"><span class="fas fa-search" /></a>');
  p.append('<a id="menusettings" href="/settings/" title="Settings" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="border-radius:0"><span class="fas fa-cog" /></a>');
  p.append('<a href="/logout" title="Log Out" class="gpe-wide gpe-btn btn btn-menu navbar-btn navbar-user-item" style="background:#A55; border-radius: 0 5px 5px 0"><span class="fas fa-sign-out-alt" style="color:#FBB" /></a>');

  //add menu items
  var p = $("#main-menu");
  p.append('<a href="javascript:toggleLight()" class="list-group-item"><span class="glyphicon glyphicon-eye-open"></span> Toggle Light</a>');
  p.append('<a href="/browse/all-games/" class="list-group-item"><span class="glyphicon glyphicon-folder-open"></span> Browse Games</a>');

  p = $(".btn-menu-player").parent();
  var userlink = $('.player-dropdown a[href^="/player/"]').attr("href");
  var useravatar = $('.btn-menu-player').html();
  p.append('<a href="' + userlink + '" title="View Profile" class="gpe-wide-block navbar-btn navbar-user-item" style="margin-top:8px">' + useravatar + '</a>');

  // Tell to look at settings if freshly installed
  var newSettingsSeen = localStorage.getItem("anbt_newSettingsSeen");
  if (!newSettingsSeen && $(window).width() > 974)
  {
    var freshSettingsHint = "Thanks for choosing ANBT! Script settings are on the settings page, click to remove this hint.";
    if (!options.newCanvas)
    {
      freshSettingsHint += " Don't forget to try the new canvas!";
    }
    $("#menusettings").attr("title", "");
    $("#menusettings").tooltip({container: "body", placement: "bottom", title: freshSettingsHint});
    $("#menusettings").tooltip("show");
    var freshHintRemove = function()
    {
      localStorage.setItem("anbt_newSettingsSeen", 1);
    };
    $("#menusettings").on('click', freshHintRemove);
    $("#menusettings").on('mousedown', freshHintRemove);
    $("#menusettings").on('touchstart', freshHintRemove);
  }
  // Make new notifications actually discernable from the old ones
  var num = $("#user-notify-count").text().trim();
  GM_addStyle(
    "#user-notify-list .list-group .list-group-item .fas {color: #888}" +
    "#user-notify-list .list-group .list-group-item:nth-child(-n+" + num + ") .fas {color: #2F5}" +
    "a.wrong-order {color: #F99} div.comment-holder:target {background-color: #DFD}" +
    ".comment-new a.text-muted:last-child:after {content: 'New'; color: #2F5; font-weight: bold; background-color: #183; border-radius: 9px; display: inline-block; padding: 0px 6px; margin-left: 10px;}"
  );

  // Show an error if it occurs instead of "loading forever"
  window.getNotifications = function()
  {
    if (!notificationsOpened)
    {
      $("#user-notify-list").html('<img src="/img/loading.gif" alt="Loading...."/>');
      $.ajax(
        {
          url: "/notification/view/",
          cache: false,
          error: function(e)
          {
            $("#user-notify-list").html(e.statusText);
            notificationsOpened = true;
          },
          success: function (e)
          {
            $("#user-notify-list").html(e);
            $("#user-notify-count").text("0");
            notificationsOpened = true;
          }
        }
      );
    }
  };

  //show desktop notification
  try{
    Notification.requestPermission();//get notification permissions if they aren't already granted
    window.getNotifications();//load notifications
    var unreadNotifications = $("#user-notify-count")[0].innerHTML;//get number of unread notifications
    if(unreadNotifications>0){//if there are unread notifications
      if(window.Notification){//and we have notification permissions
        const notification = new Notification("Drawception", {//create a new notification
          tag: "tag",
          body: unreadNotifications +" new notifications",
          iconUrl: "https://drawception.com/img/logo-d-large.png",
          icon: "https://drawception.com/img/logo-d-large.png"
          }
        );
        notification.onclick = function() {//when the notification is activated
          launchNotifications(notification, unreadNotifications);//run function
          notification.close();//close notification
        };
      }
    }
  }catch{}

  //runs when user clicks on notification
  function launchNotifications(notification, unreadNotifications) {
    var childNodes = $("#user-notify-list")[0].firstChild.getElementsByTagName("a");//get list of notifications
    for (i = 0; i < unreadNotifications; i++) {
      if(childNodes[i].href!=window.location.href){
        window.open(childNodes[i].href, "_blank").focus();//open link for each new notification
      }else{
        location.reload();
      }
    }
  }

  //check for notifications every 30 seconds
  if(options.checkForNotifications){var notificationTimer = setInterval(checkNotifications, 30000);}

  function checkNotifications(){
    try{
      var unreadCount = "";
      $.get('https://drawception.com/', function (response) {//grab the homepage
        parser = new DOMParser();
        doc = parser.parseFromString(response, "text/html");//parse the homepage
        unreadCount = doc.getElementById("user-notify-count").innerHTML;//get unread count
        console.log(unreadCount+" new notifications");
        if(parseInt(unreadCount)>0){//if there are new notifications
          if(window.Notification){//and we have notification permissions
            const notification = new Notification("Drawception", {//create a new notification
              tag: "tag",
              body: unreadCount +" new notifications",
              iconUrl: "https://drawception.com/img/logo-d-large.png",
              icon: "https://drawception.com/img/logo-d-large.png"
              }
            );
            notification.onclick = function() {//when the notification is activated
              notification.close();//close notification
              location.reload();//reload page
            };
          }
        }
      });
    }catch{}
  }

  //change navbar color
  if(options.colorizeNavBar){

    //set navbar color based on first panel
    try{
      //if the first panel is a drawing, set navbar color to average color
      if (typeof document.getElementsByClassName("gamepanel")[0].firstChild.src !== 'undefined') {
        $("#nav-drag")[0].style.background = "url("+document.getElementsByClassName("gamepanel")[0].firstChild.src+")";
      }
      //if the second panel is a drawing, set navbar color to average color
      if (typeof document.getElementsByClassName("gamepanel")[1].firstChild.src !== 'undefined') {
        $("#nav-drag")[0].style.background = "url("+document.getElementsByClassName("gamepanel")[1].firstChild.src+")";
      }
      $("#nav-drag")[0].style.backgroundSize = "1px 1px";
      $("#nav-drag")[0].style.backgroundRepeat = "repeat";
    }catch{}
    
    //set navbar color based on theme
    try{//if the game is not a vet game the theme will be in the first "label-no-select" element
      var navbarColor = "#0CE853";
      var theme = document.getElementsByClassName("label-no-select")[0].innerHTML;
      switch(theme) {
        case "bee":
          navbarColor = "#EAB618";
          break;
        case "canyon sunset":
          navbarColor = "#2E1B50";
          break;
        case "halloween":
          navbarColor = "#BEF202";
          break;
        case "sepia":
          navbarColor = "#402305";
          break;
        case "the blues":
          navbarColor = "#295C6F";
          break;
        case "grayscale":
          navbarColor = "#333333";
          break;
        case "spring":
          navbarColor = "#9ED396";
          break;
        case "b &amp; w":
          navbarColor = "#000000";
          break;
        case "beach":
          navbarColor = "#F7DCA2";
          break;
        case "cga":
          navbarColor = "#FFFF55";
          break;
        case "coty 2016":
          navbarColor = "#648589";
          break;
        case "gameboy":
          navbarColor = "#9BBC0F";
          break;
        case "neon":
          navbarColor = "#00ABFF";
          break;
        case "coty 2017":
          navbarColor = "#5F7278";
          break;
        case "thanksgiving":
          navbarColor = "#F5E9CE";
          break;
        case "fire &amp; ice":
          navbarColor = "#FD2119";
          break;
        case "holiday":
          navbarColor = "#3D9949";
          break;
        case "valentines":
          navbarColor = "#FFCCDF";
          break;
        default:
          //leave it green
      }
      if(navbarColor != "#0CE853"){
        //if there is a theme remove the color generated from the first drawing
        $("#nav-drag")[0].style.background = "";
      }
      $("#nav-drag")[0].style.backgroundColor = navbarColor;
    }catch{}
    try{//if the game is a vet game the theme will be in the second "label-no-select" element
      var navbarColor = "#0CE853";
      var theme = document.getElementsByClassName("label-no-select")[1].innerHTML;
      switch(theme) {
        case "bee":
          navbarColor = "#EAB618";
          break;
        case "canyon sunset":
          navbarColor = "#2E1B50";
          break;
        case "halloween":
          navbarColor = "#BEF202";
          break;
        case "sepia":
          navbarColor = "#402305";
          break;
        case "the blues":
          navbarColor = "#295C6F";
          break;
        case "grayscale":
          navbarColor = "#333333";
          break;
        case "spring":
          navbarColor = "#9ED396";
          break;
        case "b &amp; w":
          navbarColor = "#000000";
          break;
        case "beach":
          navbarColor = "#F7DCA2";
          break;
        case "cga":
          navbarColor = "#FFFF55";
          break;
        case "coty 2016":
          navbarColor = "#648589";
          break;
        case "gameboy":
          navbarColor = "#9BBC0F";
          break;
        case "neon":
          navbarColor = "#00ABFF";
          break;
        case "coty 2017":
          navbarColor = "#5F7278";
          break;
        case "thanksgiving":
          navbarColor = "#F5E9CE";
          break;
        case "fire &amp; ice":
          navbarColor = "#FD2119";
          break;
        case "holiday":
          navbarColor = "#3D9949";
          break;
        case "valentines":
          navbarColor = "#FFCCDF";
          break;
        default:
          //leave it green
      }
      if(navbarColor != "#0CE853"){
        //if there is a theme remove the color generated from the first drawing
        $("#nav-drag")[0].style.background = "";
      }
      $("#nav-drag")[0].style.backgroundColor = navbarColor;
    }catch{}
    try{//if the game is a vet game and a top game the theme will be in the third "label-no-select" element
      var navbarColor = "#0CE853";
      var theme = document.getElementsByClassName("label-no-select")[2].innerHTML;
      switch(theme) {
        case "bee":
          navbarColor = "#EAB618";
          break;
        case "canyon sunset":
          navbarColor = "#2E1B50";
          break;
        case "halloween":
          navbarColor = "#BEF202";
          break;
        case "sepia":
          navbarColor = "#402305";
          break;
        case "the blues":
          navbarColor = "#295C6F";
          break;
        case "grayscale":
          navbarColor = "#333333";
          break;
        case "spring":
          navbarColor = "#9ED396";
          break;
        case "b &amp; w":
          navbarColor = "#000000";
          break;
        case "beach":
          navbarColor = "#F7DCA2";
          break;
        case "cga":
          navbarColor = "#FFFF55";
          break;
        case "coty 2016":
          navbarColor = "#648589";
          break;
        case "gameboy":
          navbarColor = "#9BBC0F";
          break;
        case "neon":
          navbarColor = "#00ABFF";
          break;
        case "coty 2017":
          navbarColor = "#5F7278";
          break;
        case "thanksgiving":
          navbarColor = "#F5E9CE";
          break;
        case "fire &amp; ice":
          navbarColor = "#FD2119";
          break;
        case "holiday":
          navbarColor = "#3D9949";
          break;
        case "valentines":
          navbarColor = "#FFCCDF";
          break;
        default:
          //leave it green
      }
      if(navbarColor != "#0CE853"){
        //if there is a theme remove the color generated from the first drawing
        $("#nav-drag")[0].style.background = "";
      }
      $("#nav-drag")[0].style.backgroundColor = navbarColor;
    }catch{}

    //set navbar color based on user profile image
    try{
      $("#nav-drag")[0].style.background = "url("+document.getElementsByClassName("profile-avatar")[0].src+")";
      $("#nav-drag")[0].style.backgroundSize = "1px 1px";
      $("#nav-drag")[0].style.backgroundRepeat = "repeat";
    }catch{}
  }
  

  

  var versionDisplay;
  try
  {
    var appver = $('script[src^="/build/app"]').attr("src").match(/(\w+)\.js$/)[1];
    var commonver = $('script[src^="/build/common"]').attr("src").match(/(\w+)\.js$/)[1];
    versionDisplay = "ANBT v" + SCRIPT_VERSION + " | app " + appver;
    if (appver != SITE_VERSION) versionDisplay += "*";
    versionDisplay += " | common " + commonver;
    if (commonver != "6daa7d0a") versionDisplay += "*!!!"; // didn't break with one update, hurray
  } catch(e)
  {
    versionDisplay = "ANBT v" + SCRIPT_VERSION;
  }
  $("#header-bar-container").append('<div id="anbtver">' + versionDisplay + '</div>');

  $(".footer-main .list-unstyled").eq(0).append('<li><a href="/forums/general/11830/anbt-script/?page=9999">ANBT script</a></li>');
  $(".footer-main .list-unstyled").eq(1).append('<li><a href="http://drawception.wikia.com/">Wiki</a></li>');
  $(".footer-main .list-unstyled").eq(2).append('<li><a href="http://chat.grompe.org.ru/#drawception">Chat</a> (<a href="https://discord.gg/tHtPy3u">Discord</a>)</li>');
  
  if (options.newCanvas)
  {
    var directToNewSandbox, directToNewPlay;
    {
      directToNewSandbox = function(e)
      {
        if (e.which === 2) return;
        e.preventDefault();
        setupNewCanvas(true, this.href);
      };
      directToNewPlay = function(e)
      {
        if (e.which === 2) return;
        e.preventDefault();
        setupNewCanvas(false, this.href);
      };
    }
    $('a[href^="/sandbox/"]').click(directToNewSandbox);
    $('a[href="/play/"]').click(directToNewPlay);
  }
}

var mark = document.createElement("b");
mark.id = "_anbt_";
mark.style = "display:none";
document.body.appendChild(mark);
if (parseInt(localStorage.getItem("gpe_inDark"), 10) == 1)
{
  Array.from(document.querySelectorAll("img[src='/img/duck-gray.svg']")).forEach(function (x)
  {
    x.setAttribute("src", "/img/duck.svg");
  });
}
if (pagodaBoxError()) return;

if (typeof DrawceptionPlay == "undefined")
{
  // Fix for Chrome new loading algorithm, apparently
  var loader = setInterval(
    function()
    {
      if (typeof DrawceptionPlay == "undefined") return;
      pageEnhancements();
      clearInterval(loader);
    },
    100
  );
} else {
  pageEnhancements();
}

} // wrapped

// From http://userstyles.org/styles/93911/dark-gray-style-for-drawception-com
localStorage.setItem("gpe_darkCSS",
  ("a{color:#77c0ff$}#nav-drag{~#555$;background-image:none$}.wrapper{~#444$}.icon-bar{~#77c0ff$}#user-notify-count{color:#77c0ff$}.glyphicon-bell{color:#77c0ff$}.btn-bright{color:#cccccc$;~#7f7f7f$}.btn-default{~#7f7f7f$;border-bottom-color:#666$;border-left-color:#666$;border-right-color:#666$;border-top-color:#666$;color:#CCC$}" +
  ".btn-default:hover,.btn-default:focus,.btn-default:active,.btn-default.active,.open .dropdown-toggle.btn-default{~#757575$;border-bottom-color:#565656$;border-left-color:#565656$;border-right-color:#565656$;border-top-color:#565656$;color:#DDD$}" +
  ".btn-success{~#2e2e2e$;border-bottom-color:#262626$;border-left-color:#262626$;border-right-color:#262626$;border-top-color:#262626$;color:#CCC$}" +
  ".btn-success:hover,.btn-success:focus,.btn-success:active,.btn-success.active,.open .dropdown-toggle.btn-success{~#232323$;border-bottom-color:#1c1c1c$;border-left-color:#1c1c1c$;border-right-color:#1c1c1c$;border-top-color:#1c1c1c$;color:#DDD$}" +
  ".btn-primary{~#213184$;border-bottom-color:#1a1a68$;border-left-color:#1a1a68$;border-right-color:#1a1a68$;border-top-color:#1a1a68$;color:#CCC$}" +
  ".btn-primary:hover,.btn-primary:focus,.btn-primary:active,.btn-primary.active,.open .dropdown-toggle.btn-primary{~#191964$;border-bottom-color:#141450$;border-left-color:#141450$;border-right-color:#141450$;border-top-color:#141450$;color:#DDD$}" +
  ".btn-info{~#2d7787$;border-bottom-color:#236969$;border-left-color:#236969$;border-right-color:#236969$;border-top-color:#236969$;color:#CCC$}" +
  ".btn-info:hover,.btn-info:focus,.btn-info:active,.btn-info.active,.open .dropdown-toggle.btn-info{~#1c5454$;border-bottom-color:#133939$;border-left-color:#133939$;border-right-color:#133939$;border-top-color:#133939$;color:#DDD$}" +
  ".navbar-default .navbar-toggle:hover,.navbar-default .navbar-toggle:focus{~#3b3b3b$}.navbar-toggle{~#393939$}.navbar{border-bottom:1px solid #000$}.forum-thread-starter,.breadcrumb,.regForm{~#555$}" +
  ".form-control{~#555$;border:1px solid #000$;color:#EEE$}code,pre{~#656$;color:#FCC$}body{color:#EEE$}footer{~#333$;border-top:1px solid #000$}" +
  ".pagination>li:not(.disabled):not(.active),.pagination>li:not(.disabled):not(.active)>a:hover,.pagination>li:not(.disabled):not(.active)>span:hover,.pagination>li:not(.disabled):not(.active)>a:focus,.pagination>li:not(.disabled):not(.active)>span:focus{~#444$}.pagination>li>a,.pagination>li>span{~#555$;border:1px solid #000$}" +
  ".pagination>.active>a,.pagination>.active>span,.pagination>.active>a:hover,.pagination>.active>span:hover,.pagination>.active>a:focus,.pagination>.active>span:focus{~#666$;border-top:1px solid #444$;border-bottom:1px solid #444$}" +
  ".drawingForm{~#555$}.well{~#666$;border:1px solid #333$}#timeleft{color:#AAA$}legend{border-bottom:1px solid #000$}.thumbpanel{color:#EEE;~#555$}.thumbpanel img{~#fffdc9$}.panel-number,.modal-content,.profile-user-header{~#555$}" +
  "#commentForm{~#555$;border:1px solid #000$}.modal-header,.nav-tabs{border-bottom:1px solid #000$}hr,.modal-footer{border-top:1px solid #000$}" +
  ".store-item{background:#666$;~-moz-linear-gradient(top,#666 0,#333 100%)$;~-webkit-gradient(linear,left top,left bottom,color-stop(0,#666),color-stop(100%,#333))$;~-webkit-linear-gradient(top,#666 0,#333 100%)$;~-o-linear-gradient(top,#666 0,#333 100%)$;~-ms-linear-gradient(top,#666 0,#333 100%)$;~linear-gradient(to bottom,#666 0,#333 100%)$;border:1px solid #222$}" +
  ".store-item:hover{border:1px solid #000$}.store-item-title{~#222$;color:#DDD$}.store-title-link{color:#DDD$}.profile-award{~#222$}.profile-award-unlocked{~#888$}.progress-bar{color:#CCC$;~#214565$}.progress{~#333$}" +
  ".progress-striped .progress-bar{background-image:-webkit-gradient(linear,0 100%,100% 0,color-stop(.25,rgba(0,0,0,0.15)),color-stop(.25,transparent),color-stop(.5,transparent),color-stop(.5,rgba(0,0,0,0.15)),color-stop(.75,rgba(0,0,0,0.15)),color-stop(.75,transparent),to(transparent))$;background-image:-webkit-linear-gradient(45deg,rgba(0,0,0,0.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,0.15) 50%,rgba(0,0,0,0.15) 75%,transparent 75%,transparent)$;background-image:-moz-linear-gradient(45deg,rgba(0,0,0,0.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,0.15) 50%,rgba(0,0,0,0.15) 75%,transparent 75%,transparent)$;background-image:linear-gradient(45deg,rgba(0,0,0,0.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,0.15) 50%,rgba(0,0,0,0.15) 75%,transparent 75%,transparent)$}" +
  ".progress-bar-success{~#363$}.progress-bar-info{~#367$}.progress-bar-warning{~#863$}.progress-bar-danger{~#733$}" +
  ".nav-tabs>li.active>a,.nav-tabs>li.active>a:hover,.nav-tabs>li.active>a:focus{color:#DDD$;~#555$;border:1px solid #222$}.nav>li>a:hover,.nav>li>a:focus{~#333$;border-bottom-color:#222$;border-left-color:#111$;border-right-color:#111$;border-top-color:#111$}" +
  ".nav>li.disabled>a,.nav>li.disabled>a:hover,.nav>li.disabled>a:focus{color:#555$}.table-striped>tbody>tr:nth-child(2n+1)>td,.table-striped>tbody>tr:nth-child(2n+1)>th{~#333$}" +
  ".table-hover>tbody>tr:hover>td,.table-hover>tbody>tr:hover>th{~#555$}.table thead>tr>th,.table tbody>tr>th,.table tfoot>tr>th,.table thead>tr>td,.table tbody>tr>td,.table tfoot>tr>td{border-top:1px solid #333$}.news-alert{~#555$;border:2px solid #444$}" +
  ".btn-menu{~#2e2e2e$}.logout-item{~#c93232$}.btn-menu:hover{~#232323$}.btn-yellow{~#8a874e$}.btn-yellow:hover{~#747034$}" +
  "a.label{color:#fff$}.text-muted,a.text-muted{color:#999$}a.wrong-order{color:#F99$}div.comment-holder:target{~#454$}" +
  ".popover{~#777$}.popover-title{~#666$;border-bottom:1px solid #444$}.popover.top .arrow:after{border-top-color:#777$}.popover.right .arrow:after{border-right-color:#777$}.popover.bottom .arrow:after{border-bottom-color:#777$}.popover.left .arrow:after{border-left-color:#777$}" +
  ".label-fancy{~#444$;border-color:#333$;color:#FFF$}" +
  ".avatar,.profile-avatar{~#444$;border:1px solid #777$;}" +
  ".bg-lifesupport{~#444$}body{~#555$}.snap-content{~#333$}" +
  "select,textarea{color:#000$}.help-block{color:#ddd$}.jumbotron{~#444$}" +
  ".navbar-dropdown{~#444$}a.list-group-item{~#444$;color:#fff$;border:1px solid #222$}a.list-group-item:hover,a.list-group-item:focus{~#222$}" +
  ".likebutton.btn-success{color:#050$;~#5A5$}.likebutton.btn-success:hover{~#494$}" +
  ".thumbnail[style*='background-color: rgb(255, 255, 255)']{~#555$}" +
  ".popup,.v--modal{~#666$;border:1px solid #222$}.btn-reaction{~#666$;border:none$;color:#AAA$}.create-game-wrapper{~#444$}" +
  ".profile-header{~#555$}.profile-nav > li > a{~#333$}.profile-nav>li.active>a,.profile-nav>li>a:hover{~#555$}" + 
  ".gsc-control-cse{~#444$;border-color:#333$}.gsc-above-wrapper-area,.gsc-result{border:none$}.gs-snippet{color:#AAA$}.gs-visibleUrl{color:#8A8$}a.gs-title b,.gs-visibleUrl b{color:#EEE$}.gsc-adBlock{display:none$}.gsc-input{~#444$;border-color:#333$;color:#EEE$}" +
   ".highlight{border:none$;background:#454$}#header-emotes{~#555$}#header-bar-container{border:none$}.paypal-button-tag-content{color:#EEE$}.numlikes{color:#EEE$}.gsc-input-box{~#444$;border-color:#333$}.gsc-completion-container{~#333$;border-color:#000$}.gsc-completion-selected{~#222$}.gsc-completion-container b{color:#AAA$}.alert-nice{~#4a4a4a$}.store-buy-coins{~#777$}.store-buy-coins:hover{~#666$}.store-buy-coins>h2,.store-buy-coins>h2>small{color:#EEE$}.store-package-selector{~#888$}.store-package-selector>label{color:#EEE$}.label-stat{~#444$;color:#EEE$;border:1px solid #555$}.label-stat.disabled{~#333$}.option{~#2e2e2e$;color:#EEE$;border-color:#2e2e2e$}.option.selected{border-color:#e2e2e2$}.sleek-select{~#2e2e2e$}select{color:#EEE$}.modal-note{color:#EEE$}.vue-dialog-button{~#555$;border:none$}.vue-dialog-button:hover{~#5a5a5a$}.vue-dialog-buttons{border-top:1px solid #222$}.dashboard-item{~#333$}legend{color:#EEE$}.list-group-item{~#444$;color:#EEE$;border:1px solid #222$}.alert-warning{color:#EEE$;~#555$;border-color:#555$}.btn-reaction.active{border:1px solid #EEE$}.bg-shadow-box{~#333$}.btn-gray{~#222$;border:none$}.btn-gray:hover{color:#EEE$;~#1a1a1a$}.btn-bright{~#333$;color:#EEE$}" +
  // We have entered specificity hell...
  "a.anbt_replaypanel:hover{color:#8af$}" +
  ".anbt_favedpanel{color:#d9534f$}" +
  // Some lamey compression method!
  "").replace(/~/g, "background-color:").replace(/\$/g, " !important")
);

if (parseInt(localStorage.getItem("gpe_inDark"), 10) == 1)
{
  var css = document.createElement("style");
  css.id = "darkgraycss";
  css.type = "text/css";
  css.appendChild(document.createTextNode(localStorage.getItem("gpe_darkCSS")));
  if (document.head)
  {
    document.head.appendChild(css);
  } else {
    var darkLoad = setInterval(
      function()
      {
        if (!document.head) return;
        document.head.appendChild(css);
        clearInterval(darkLoad);
      },
      100
    );
  }
}

function anbtLoad()
{
  if (document.getElementById("_anbt_")) return;
  var script = document.createElement("script");
  script.textContent = "(" + wrapped.toString() + ")();";
  document.body.appendChild(script);
  return true;
}

if (document && document.body)
{
  anbtLoad();
  if (window.opera && parseInt(localStorage.getItem("gpe_operaWarning"), 10) != 1)
  {
    var w = document.createElement("h2");
    w.innerHTML = "ANBT speaking:<br/>Rename your script file so it doesn't contain \".user.\" part for smoother loading!<br/>This warning is only shown once.";
    var m = document.getElementById("main");
    m.insertBefore(w, m.firstChild);
    localStorage.setItem("gpe_operaWarning", 1);
  }
}
document.addEventListener("DOMContentLoaded", anbtLoad, false);

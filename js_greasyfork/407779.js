// ==UserScript==
// @name          IMDb Movie Link Enhancer
// @description   Highlights movie titles and adds your ratings for movies you've seen (voted for).
// @namespace     http://userscripts-mirror.org/users/69068
// @include       http://*.imdb.com/*
// @exclude       http://i.imdb.com/*
// @exclude       http://*.imdb.com/images/*
// @exclude       http://*.imdb.com/mymovies/list?votehistory*
// @exclude       http://*.imdb.com/list/ratings*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// @connect       imdb.com
// @version       0.01
// @downloadURL https://update.greasyfork.org/scripts/407779/IMDb%20Movie%20Link%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/407779/IMDb%20Movie%20Link%20Enhancer.meta.js
// ==/UserScript==

(function() {

var enhancedColors = [
  {name:"Title color", key:"-title-color", default:"000000"},
  {name:"Title background", key:"-title-bg", default:"6BE06B"},
  {name:"Rating color", key:"-rating-color", default:"FFFFFF"},
  {name:"Rating background", key:"-rating-bg", default:"C2163A"}
];
var colorPattern = /^[0-9a-f]{6}$/i;
var account = getUserAccount();
if (account != GM_getValue("account", "")) {
  GM_setValue("account", account);
  GM_setValue("titles", 0);
  GM_setValue("movies", "");
}
if (account != "Login") {
  setUserStyle();
  setUserVoteAction();
  highlightMovies();
  getUserVoteHistory();
}
GM_registerMenuCommand("IMDb Movie Link Enhancer Settings...", showUserPreferences);


function getUserAccount() {
  var accountLink = document.evaluate('//div[@id="nb_personal"]/a/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return (accountLink.singleNodeValue) ? parseAccount(trim(accountLink.singleNodeValue.innerHTML)) : "Login";
}

function parseAccount(accountStr) {
  return accountStr.substring(0, accountStr.length - 10);
}

function trim(stringToTrim) {
  return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function setUserStyle() {
  GM_addStyle(
    "a.enhanced {background-color:#" + getEnhancedColor(1) + "; color:#" + getEnhancedColor(0) + " !important; font-weight:bold; padding:0 5px;}\
     span.enhanced {background-color:#" + getEnhancedColor(3) + "; color:#" + getEnhancedColor(2) + " !important; font-weight:bold !important; font-size:100% !important; margin-right:3px; padding:0 5px;}\
     u.enhancedSample {background-color:#" + getEnhancedColor(1) + "; color:#" + getEnhancedColor(0) + "; font-weight:bold; padding:0 5px;}\
     span.enhancedSample {background-color:#" + getEnhancedColor(3) + "; color:#" + getEnhancedColor(2) + "; font-weight:bold; font-size:100%; margin-right:3px; padding:0 5px;}\
     div#prefsPopup {z-index: 1000; font-family:arial,sans-serif; font-size:83%; position:fixed; bottom:auto; left:20px; right:20px; top:20px; padding:10px; background-color:#F8F4E8; border:2px solid #888888;}\
     div.prefsTitle {font-weight: bold; font-size:1.2em;} button.prefsCancel {font-weight:normal; margin-left:3px;} label.prefsLabel {font-weight:normal;}\
     div#prefsPopup button {padding:0;} a.prefsLink {color:#0000FF; font-weight:bold;} .enhancerError {color:#990000; background:#FFDCDC}"
  );
}

function getEnhancedColor(index) {
  return GM_getValue(account + enhancedColors[index].key, enhancedColors[index].default);
}

function setEnhancedColor(index, value) {
  GM_setValue(account + enhancedColors[index].key, value);
}

function setUserVoteAction() {
  if (/title\/tt\d+/.exec(document.location.href)) {
    var starbar = document.evaluate('//div[@id="starbar"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (starbar.singleNodeValue) {
      var voteLink = starbar.singleNodeValue.nextSibling;
      while (voteLink) {
        if (voteLink.href) voteLink.addEventListener("click", function() { GM_setValue("update", true); getUserVoteHistory(); }, false);
        voteLink = voteLink.nextSibling;
      }
    }
  }
}

function getUserVoteHistory() {
  var votes_url = "http://www.imdb.com/mymovies/list?votehistory&a=1";
  GM_xmlhttpRequest({
    method: "GET",
    url: votes_url,
    onreadystatechange: function(details) {
      if (details.readyState == 4) {
        var findtitles = /<b>(\d*) Titles*<\/b>/;
        var result = findtitles.exec(details.responseText);
        var titles = parseInt(result[1]);
        if (GM_getValue("update", false) || (titles != GM_getValue("titles", 0))) {
          var votes = details.responseText.match(/<b>Votes<\/b>/);
          var findmovie = votes 
              ? /<a href="\/title\/tt(\d*)\/[\s\S]*?<td align="center" bgcolor="#FFFFFF">(\d*)<\/td>/g
              : /<a href="\/title\/tt(\d*)\//g;
          var count = 0;
          var movies = "";
          while(movie = findmovie.exec(details.responseText)) {
            movies += "," + movie[1] + "|" + (votes ? movie[2] : "N/A");
            count ++;
          }
          GM_setValue("titles", titles);
          GM_setValue("movies", movies.substr(1));
          GM_setValue("update", false);
          highlightMovies();
        }
      }
    }
  })
}

function highlightMovies() {
  if (GM_getValue("titles", 0) == 0) return;

  var ratings = new Array(GM_getValue("titles", 0));
  var list = GM_getValue("movies", "").split(",");
  for (var i = 0; i < list.length; i++) {
    var data = list[i].split("|");
    ratings[data[0]] = data[1];
  }

  var links1 = document.evaluate(
      '//a[starts-with(@href, "/title/tt")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  processMovieLinks(links1, ratings, getIdFromUrl);

  var links2 = document.evaluate(
      '//a[starts-with(@href, "/rg/tt-recs/link/title/tt")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  processMovieLinks(links2, ratings, getIdFromUrl);
  
  var links3 = document.evaluate(
      '//a[starts-with(@href, "/Title?")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  processMovieLinks(links3, ratings, getIdFromLegacyUrl);
}

function processMovieLinks(links, ratings, getId) {
  for (var i = 0; i < links.snapshotLength; i++) {
    var movieLink = links.snapshotItem(i);
    if (movieLink.href[movieLink.href.length-1] != "/") continue;
    if (movieLink.parentNode.id == "tn15crumbs") continue;

    var movieRating = ratings[getId(movieLink.href)];
    if (movieRating && !isEnhancedLink(movieLink) && !isImageLink(movieLink)) {
      movieLink.className = "enhanced";
      movieLink.parentNode.insertBefore(getRatingElement(movieRating), movieLink);
    }
    if (!movieRating && isEnhancedLink(movieLink)) {
      movieLink.className = "";
      movieLink.parentNode.removeChild(movieLink.previousSibling);
    }
  }
}

function isEnhancedLink(movieLink) {
  return movieLink.className == "enhanced";
}

function isImageLink(movieLink) {
  var count = movieLink.childNodes.length;
  if (count > 2) count = 2;
  for (var i = 0; i < count; i++) {
    if (movieLink.childNodes[i].tagName == "IMG") return true;
  }
  return false;
}

// URL format: "/title/tt***/"
function getIdFromUrl(url, ratings) {
  var index = url.lastIndexOf("/tt");
  return url.substring(index + 3, url.length - 1);
}

// URL format: "/Title?***"
function getIdFromLegacyUrl(url, ratings) {
  var index = url.indexOf("/Title?");
  return url.substring(index + 7);
}

function getRatingElement(rating) {
  var elem = document.createElement("span");
  elem.className = "enhanced";
  elem.innerHTML = rating;
  return elem;
}

function showUserPreferences() {
  var prefs = $("prefsPopup");
  if(!prefs){
    currentPrefs = [getEnhancedColor(0), getEnhancedColor(1), getEnhancedColor(2), getEnhancedColor(3)];
    var html = "<div class='prefsTitle'>IMDb Movie Link Enhancer Settings</div>";
    html += "<a class='prefsLink' href='http://userscripts.org/scripts/show/36817'>website &raquo;</a>";
    html += "<p><table cellspacing='3' cellpadding='0'><tr><td>";
    html += "Select your own colors for the color of the text/background for title/rating elements.";
    html += "<br>Type 6 hex digit color values, e.g. 22FFCC, directly into the corresponding textboxes <br> or select an element and use the color picker.";
    html += "<p><span class='enhancedSample' id='prefsEnhancedRating'>6</span><u class='enhancedSample' id='prefsEnhancedMovie'>Sample Movie Title</u>";
    html += "<p><table cellspacing='3' cellpadding='0'>";
    for (var i=0; i<enhancedColors.length; i++) {
      html += "<tr><td>#<input id='prefsColor" + i + "' type='text' size='6' maxlength='6' value='" + currentPrefs[i] + "'></td>";
      html += "<td><label class='prefsLabel' for='prefsColorIndex" + i + "'><input type='radio' name='prefsColorIndex' id='prefsColorIndex" + i + "'>" + enhancedColors[i].name + "</label></td></tr>";
    }
    html += "<tr><td colspan='2'><input id='prefsDefaultColors' type='checkbox'>Restore default colors</input></td></tr>";
    html += "</table><p><button id='prefsSave' class='prefsSave'>Save preferences</button><button id='prefsCancel' class='prefsCancel'>Cancel</button>";
    html += "</td><td valign='top'>" + getColorPickerHTML() + "</td></tr></table>";
    prefs = document.createElement("div");
    prefs.id = "prefsPopup";
    prefs.innerHTML = html;
    document.body.appendChild(prefs);
    initColorPicker();
    for (var i=0; i<enhancedColors.length; i++) {
      var elem = $('prefsColor' + i);
      elem.addEventListener("change", function(e) {
        var value = e.target.value;
        changePrefsColor(idx(e.target.id), value);
      }, false);
      elem.addEventListener("keyup", function(e) {
        var value = e.target.value;
        if (value.length == 6) changePrefsColor(idx(e.target.id), value);
      }, false);
      elem.addEventListener("click", function(e) {
        var index = idx(e.target.id);
        $('prefsColorIndex' + index).checked = true;
        syncColorPicker(index);
      }, false);
      elem = $('prefsColorIndex' + i);
      elem.addEventListener("click", function(e) {
        var index = idx(e.target.id);
        $('prefsColor' + index).focus();
        syncColorPicker(index);
      }, false);
    }
    $('prefsDefaultColors').addEventListener("click", function(e) {
      if (e.target.checked) {
        currentPrefs = [enhancedColors[0].default, enhancedColors[1].default, enhancedColors[2].default, enhancedColors[3].default];
        resetPrefsColors();
        for (var i=0; i<enhancedColors.length; i++)
          if($('prefsColorIndex' + i).checked) syncColorPicker(i);
      }
    }, false);
    $('prefsSave').addEventListener("click", function(e) {
      for (var i=0; i<enhancedColors.length; i++) {
        var value = $('prefsColor' + i).value;
        if (isValidColor(value)) setEnhancedColor(i, value);
      }
      setUserStyle();
      prefs.style.display = "none";
    }, false);
    $('prefsCancel').addEventListener("click", function(e) {
      currentPrefs = [getEnhancedColor(0), getEnhancedColor(1), getEnhancedColor(2), getEnhancedColor(3)];
      resetPrefsColors();
      $('prefsDefaultColors').checked = false;
      syncColorPicker(defaultIndex);
      prefs.style.display = "none";
    }, false);
  }
  prefs.style.display="";
}

function $(id) {
  return document.getElementById(id);
}

function idx(id) {
  return parseInt(id[id.length-1]);
}

function resetPrefsColors() {
  $("prefsEnhancedMovie").style.color = "#" + currentPrefs[0];
  $("prefsEnhancedMovie").style.background = "#" + currentPrefs[1];
  $("prefsEnhancedRating").style.color = "#" + currentPrefs[2];
  $("prefsEnhancedRating").style.background = "#" + currentPrefs[3];
  for (var i=0; i<enhancedColors.length; i++) {
    $('prefsColor' + i).value = currentPrefs[i];
    clearColorError(i);
  }
  checkColorsState();
}

function changePrefsColor(index, value) {
  if (isValidColor(value)) {
    setPrefsColor(index, value);
  } else {
    setColorError(index);
    $('prefsDefaultColors').checked = false;
    $('prefsSave').disabled = true;
  }
}

function setPrefsColor(index, value) {
  currentPrefs[index] = value;
  $("prefsColor" + index).value = value.toUpperCase();
  var style = $((index<2) ? "prefsEnhancedMovie" : "prefsEnhancedRating").style;
  if (index%2 == 0) {
    style.color = "#" + value;
  } else {
    style.background = "#" + value;
  }
  $('prefsDefaultColors').checked = false;
  clearColorError(index);
  checkColorsState();
  syncColorPicker(index);
}

function isValidColor(value) {
  return colorPattern.test(value);
}

function setColorError(index) {
  $('prefsColor' + index).className = "enhancerError";
}

function clearColorError(index) {
  $('prefsColor' + index).className = "";
}

function checkColorsState() {
  var valid = true;
  for (var i=0; i<enhancedColors.length; i++) {
    if ($('prefsColor' + i).className == "enhancerError") {
      valid = false;
      break;
    }
  }
  $('prefsSave').disabled = !valid;
}

function getColorPickerHTML() {
  var url = 'http://sites.google.com/site/cdefasnu/_/rsrc/1225013049972/imdb-script/';
  var html = '<div style="position:relative; height:256px; width:315px">';
  html += '<div id="gradientBox" style="cursor:crosshair; position:absolute; left:15px; width:256px; height:256px;">';
  html += '<img id="gradientImg" style="display:block; width:256px; height:256px;" src="' + url + '/color_picker_gradient.png" />';
  html += '<img id="circle" style="position:absolute; height:11px; width:11px;" src="' + url + '/color_picker_circle.gif" /></div>';
  html += '<div id="hueBarDiv" style="position:absolute; left:280px;width:35px; height:256px;">';
  html += '<img style="position:absolute; height:256px; width:19px; left:8px;" src="' + url + '/color_picker_bar.png" />';
  html += '<img id="arrows" style="position:absolute; height:9px; width:35px;" src="' + url + '/color_picker_arrows.gif" /></div></div>';
  return html;
}

var currentColor;
var currentPrefs;
var currentIndex;
var defaultIndex = 1;

function initColorPicker() {
  currentColor = Colors.ColorFromHex(currentPrefs[defaultIndex]);
  new dragObject("arrows", "hueBarDiv", arrowsLowBounds, arrowsUpBounds, arrowsDown, arrowsMoved, null);
  new dragObject("circle", "gradientBox", circleLowBounds, circleUpBounds, circleDown, circleMoved, null);
  syncColorPicker(defaultIndex);
}

function syncColorPicker(index) {
  currentIndex = index;
  currentColor.SetHexString(currentPrefs[index]);
  $('prefsColorIndex' + index).checked = true;
  colorChanged("box");
}

function colorChanged(source) {
  if(source != "box") setPrefsColor(currentIndex, currentColor.HexString());
  if(source == "arrows" || source == "box") {
    $("gradientBox").style.backgroundColor = "#" + Colors.ColorFromHSV(currentColor.Hue(), 1, 1).HexString();
  }
  if(source == "box") {
    var el = $("arrows");
    el.style.top = (256 - currentColor.Hue()*255/359.99 - arrowsOffset.Y) + 'px';
    var pos = new Position(currentColor.Value()*255, (1-currentColor.Saturation())*255);
    pos = correctOffset(pos, circleOffset, true);
    pos.Apply("circle");
  }
}

// Color Picker, http://blog.paranoidferret.com/index.php/2007/08/22/javascript-interactive-color-picker/

var Colors = new function() {
  this.ColorFromHSV = function(hue, sat, val) {
    var color = new Color();
    color.SetHSV(hue,sat,val);
    return color;
  }
  this.ColorFromRGB = function(r, g, b) {
    var color = new Color();
    color.SetRGB(r,g,b);
    return color;
  }
  this.ColorFromHex = function(hexStr) {
    var color = new Color();
    color.SetHexString(hexStr);
    return color;
  }
  function Color() {
    var red = 0;
    var green = 0;
    var blue = 0;
    var hue = 0;
    var saturation = 0;
    var value = 0;
    this.SetRGB = function(r, g, b) {
      r = r/255.0;
      red = r > 1 ? 1 : r < 0 ? 0 : r;
      g = g/255.0;
      green = g > 1 ? 1 : g < 0 ? 0 : g;
      b = b/255.0;
      blue = b > 1 ? 1 : b < 0 ? 0 : b;
      calculateHSV();
      return true;
    }
    this.Red = function() { return Math.round(red*255); }
    this.Green = function() { return Math.round(green*255); }
    this.Blue = function() { return Math.round(blue*255); }
    this.SetHSV = function(h, s, v) {
      hue = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
      saturation = (s > 1) ? 1 : (s < 0) ? 0 : s;
      value = (v > 1) ? 1 : (v < 0) ? 0 : v;
      calculateRGB();
      return true;
    }
    this.Hue = function() { return hue; }
    this.Saturation = function() { return saturation; }
    this.Value = function() { return value; }
    this.SetHexString = function(hexString) {
      var r = parseInt(hexString.substr(0, 2), 16);
      var g = parseInt(hexString.substr(2, 2), 16);
      var b = parseInt(hexString.substr(4, 2), 16);
      return this.SetRGB(r,g,b);
    }
    this.HexString = function() {
      var rStr = this.Red().toString(16);
      if (rStr.length == 1) rStr = '0' + rStr;
      var gStr = this.Green().toString(16);
      if (gStr.length == 1) gStr = '0' + gStr;
      var bStr = this.Blue().toString(16);
      if (bStr.length == 1) bStr = '0' + bStr;
      return (rStr + gStr + bStr);
    }
    this.Complement = function() {
      var newHue = (hue>= 180) ? hue - 180 : hue + 180;
      var newVal = (value * (saturation - 1) + 1);
      var newSat = (value*saturation) / newVal;
      var newColor = new Color();
      newColor.SetHSV(newHue, newSat, newVal);
      return newColor;
    }
    function calculateHSV() {
      var max = Math.max(Math.max(red, green), blue);
      var min = Math.min(Math.min(red, green), blue);
      value = max;
      saturation = 0;
      if(max != 0) saturation = 1 - min/max;
      hue = 0;
      if(min == max) return;
      var delta = (max - min);
      if (red == max)
        hue = (green - blue) / delta;
      else if (green == max)
        hue = 2 + ((blue - red) / delta);
      else
        hue = 4 + ((red - green) / delta);
      hue = hue * 60;
      if(hue <0) hue += 360;
    }
    function calculateRGB() {
      red = value;
      green = value;
      blue = value;
      var tHue = (hue / 60);
      var i = Math.floor(tHue);
      var f = tHue - i;
      var p = value * (1 - saturation);
      var q = value * (1 - saturation * f);
      var t = value * (1 - saturation * (1 - f));
      switch(i) {
        case 0:
          red = value; green = t; blue = p;
          break;
        case 1:
          red = q; green = value; blue = p;
          break;
        case 2:
          red = p; green = value; blue = t;
          break;
        case 3:
          red = p; green = q; blue = value;
          break;
        case 4:
          red = t; green = p; blue = value;
          break;
        default:
          red = value; green = p; blue = q;
          break;
      }
    }
  }
}
();

function Position(x, y) {
  this.X = x;
  this.Y = y;
  this.Add = function(val) {
    var newPos = new Position(this.X, this.Y);
    if(val != null) {
      if(!isNaN(val.X)) newPos.X += val.X;
      if(!isNaN(val.Y)) newPos.Y += val.Y
    }
    return newPos;
  }
  this.Subtract = function(val) {
    var newPos = new Position(this.X, this.Y);
    if(val != null)
    {
      if(!isNaN(val.X)) newPos.X -= val.X;
      if(!isNaN(val.Y)) newPos.Y -= val.Y
    }
    return newPos;
  }
  this.Min = function(val) {
    var newPos = new Position(this.X, this.Y)
    if(val == null) return newPos;
    if(!isNaN(val.X) && this.X > val.X) newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y > val.Y) newPos.Y = val.Y;
    return newPos;
  }
  this.Max = function(val) {
    var newPos = new Position(this.X, this.Y)
    if(val == null) return newPos;
    if(!isNaN(val.X) && this.X < val.X) newPos.X = val.X;
    if(!isNaN(val.Y) && this.Y < val.Y) newPos.Y = val.Y;
    return newPos;
  }
  this.Bound = function(lower, upper) {
    var newPos = this.Max(lower);
    return newPos.Min(upper);
  }
  this.Check = function() {
    var newPos = new Position(this.X, this.Y);
    if(isNaN(newPos.X)) newPos.X = 0;
    if(isNaN(newPos.Y)) newPos.Y = 0;
    return newPos;
  }
  this.Apply = function(element) {
    if(typeof(element) == "string") element = $(element);
    if(element == null) return;
    if(!isNaN(this.X)) element.style.left = this.X + 'px';
    if(!isNaN(this.Y)) element.style.top = this.Y + 'px';
  }
}

var pointerOffset = new Position(0, 1);
var circleOffset = new Position(5, 5);
var arrowsOffset = new Position(0, 4);
var arrowsLowBounds = new Position(0, -4);
var arrowsUpBounds = new Position(0, 251);
var circleLowBounds = new Position(-5, -5);
var circleUpBounds = new Position(250, 250);

function correctOffset(pos, offset, neg){
  if(neg) return pos.Subtract(offset);
  return pos.Add(offset);
}
function hookEvent(element, eventName, callback) {
  if(typeof(element) == "string") element = $(element);
  if(element == null) return;
  if(element.addEventListener) element.addEventListener(eventName, callback, false);
  else if(element.attachEvent) element.attachEvent("on" + eventName, callback);
}
function unhookEvent(element, eventName, callback) {
  if(typeof(element) == "string") element = $(element);
  if(element == null) return;
  if(element.removeEventListener) element.removeEventListener(eventName, callback, false);
  else if(element.detachEvent) element.detachEvent("on" + eventName, callback);
}
function cancelEvent(e) {
  e = e ? e : window.event;
  if(e.stopPropagation) e.stopPropagation();
  if(e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.cancel = true;
  e.returnValue = false;
  return false;
}
function getMousePos(eventObj) {
  eventObj = eventObj ? eventObj : window.event;
  var pos;
  if(isNaN(eventObj.layerX)) pos = new Position(eventObj.offsetX, eventObj.offsetY);
  else pos = new Position(eventObj.layerX, eventObj.layerY);
  return correctOffset(pos, pointerOffset, true);
}
function getEventTarget(e) {
  e = e ? e : window.event;
  return e.target ? e.target : e.srcElement;
}
function absoluteCursorPostion(eventObj) {
  eventObj = eventObj ? eventObj : window.event;
  if(isNaN(window.scrollX))
    return new Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
      eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
  else return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, attachLater) {
  if(typeof(element) == "string") element = $(element);
  if(element == null) return;
  if(lowerBound != null && upperBound != null) {
    var temp = lowerBound.Min(upperBound);
    upperBound = lowerBound.Max(upperBound);
    lowerBound = temp;
  }
  var cursorStartPos = null;
  var elementStartPos = null;
  var dragging = false;
  var listening = false;
  var disposed = false;
  function dragStart(eventObj) {
    if(dragging || !listening || disposed) return;
    dragging = true;
    if(startCallback != null) startCallback(eventObj, element);
    cursorStartPos = absoluteCursorPostion(eventObj);
    elementStartPos = new Position(parseInt(element.style.left), parseInt(element.style.top));
    elementStartPos = elementStartPos.Check();
    hookEvent(document, "mousemove", dragGo);
    hookEvent(document, "mouseup", dragStopHook);
    return cancelEvent(eventObj);
  }
  function dragGo(eventObj) {
    if(!dragging || disposed) return;
    var newPos = absoluteCursorPostion(eventObj);
    newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
    newPos = newPos.Bound(lowerBound, upperBound)
    newPos.Apply(element);
    if(moveCallback != null) moveCallback(newPos, element);
    return cancelEvent(eventObj);
  }
  function dragStopHook(eventObj) {
    dragStop();
    return cancelEvent(eventObj);
  }
  function dragStop() {
    if(!dragging || disposed) return;
    unhookEvent(document, "mousemove", dragGo);
    unhookEvent(document, "mouseup", dragStopHook);
    cursorStartPos = null;
    elementStartPos = null;
    if(endCallback != null) endCallback(element);
    dragging = false;
  }
  this.Dispose = function() {
    if(disposed) return;
    this.StopListening(true);
    element = null;
    attachElement = null
    lowerBound = null;
    upperBound = null;
    startCallback = null;
    moveCallback = null
    endCallback = null;
    disposed = true;
  }
  this.StartListening = function() {
    if(listening || disposed) return;
    listening = true;
    hookEvent(attachElement, "mousedown", dragStart);
  }
  this.StopListening = function(stopCurrentDragging) {
    if(!listening || disposed) return;
    unhookEvent(attachElement, "mousedown", dragStart);
    listening = false;
    if(stopCurrentDragging && dragging) dragStop();
  }
  this.IsDragging = function() { return dragging; }
  this.IsListening = function() { return listening; }
  this.IsDisposed = function() { return disposed; }
  if(typeof(attachElement) == "string") attachElement = $(attachElement);
  if(attachElement == null) attachElement = element;
  if(!attachLater) this.StartListening();
}

function arrowsDown(e, arrows) {
  var pos = getMousePos(e);
  if(getEventTarget(e) == arrows) pos.Y += parseInt(arrows.style.top);
  pos = correctOffset(pos, arrowsOffset, true);
  pos = pos.Bound(arrowsLowBounds, arrowsUpBounds);
  pos.Apply(arrows);
  arrowsMoved(pos);
}
function circleDown(e, circle) {
  var pos = getMousePos(e);
  if(getEventTarget(e) == circle) {
    pos.X += parseInt(circle.style.left);
    pos.Y += parseInt(circle.style.top);
  }
  pos = correctOffset(pos, circleOffset, true);
  pos = pos.Bound(circleLowBounds, circleUpBounds);
  pos.Apply(circle);
  circleMoved(pos);
}
function arrowsMoved(pos, element) {
  pos = correctOffset(pos, arrowsOffset, false);
  currentColor.SetHSV((256 - pos.Y)*359.99/255, currentColor.Saturation(), currentColor.Value());
  colorChanged("arrows");
}
function circleMoved(pos, element) {
  pos = correctOffset(pos, circleOffset, false);
  currentColor.SetHSV(currentColor.Hue(), 1-pos.Y/255.0, pos.X/255.0);
  colorChanged("circle");
}

})()
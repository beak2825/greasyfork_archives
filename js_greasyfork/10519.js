// ==UserScript==
// @name        osu! Show Modding Activity Score
// @description Show modding activity score on user's profile page
// @namespace   https://osu.ppy.sh/u/376831
// @include     *osu.ppy.sh/u/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10519/osu%21%20Show%20Modding%20Activity%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/10519/osu%21%20Show%20Modding%20Activity%20Score.meta.js
// ==/UserScript==
var scoreFontSize = 14;
var isScoreBold = true;
addLoadEvent(loadEvent);
function loadEvent() {
  expandProfile('kudos', true);
  addActivityElement();
  var id = window.setInterval(function () {
    seeIfKdLoaded(id);
  }, 1000);
}
function seeIfKdLoaded(id) {
  var kds = document.getElementById('kudos');
  if (kds.lastChild) {
    doAfterKdLoaded(id);
  }
}
function doAfterKdLoaded(id) {
  expandProfile('general', true);
  scrollToStart();
  var kdList = getKdHistoryWithoutDenied();
  var averageActivity = getAverageActivity(kdList) / (1000 * 60 * 60 * 24);
  addActivityScore(averageActivity);
  var score = document.getElementById('moddingActivityScores');
  if (score) {
    window.clearInterval(id);
  }
}
function getDateByString(dateString) {
  return new Date(Date.parse(dateString.replace(/-/g, '/')));
}
function getDates(kudosElement) {
  var dates = kudosElement.getElementsByTagName('time');
  var date = new Array();
  for (var i = 0; i < dates.length; i++) {
    date[i] = getDateByString(dates[i].title);
  }
  return date;
}
function getIsDenieds(kudosElement) {
  var denieds = kudosElement.getElementsByTagName('time');
  var isDenied = Array();
  for (var i = 0; i < denieds.length; i++) {
    isDenied[i] = denieds[i].nextSibling.textContent.indexOf('Denied') != - 1 ? true : false;
  }
  return isDenied;
}
function getLinks(kudosElement) {
  var links = kudosElement.getElementsByTagName('a');
  var link = new Array();
  var linkIndex = 0;
  for (var i = 0; i < links.length; i++) {
    if (links[i].href.indexOf('forum/p') != - 1) {
      link[linkIndex] = links[i].href;
      linkIndex += 1;
    }
  }
  return link;
}
function getKdHistory() {
  var kds = document.getElementById('kudos');
  if (!kds) {
    return new Array();
  } else {
    var date = getDates(kds);
    var isDeny = getIsDenieds(kds);
    var links = getLinks(kds);
    var kd = new Array();
    for (var i = 0; i < date.length; i++) {
      kd[i] = new Array(i, date[i], isDeny[i], links[i]);
    }
    return kd;
  }
}
function getDeniedList(allKdList) {
  var deniedList = new Array();
  var index = 0;
  for (var i = 1; i < allKdList.length; i++) {
    if (allKdList[i][2]) {
      deniedList[index] = allKdList[i];
      index += 1;
    }
  }
  return deniedList;
}
function isThisKdHistoryDenied(kdHistory, allDeniedList) {
  for (var i = 0; i < allDeniedList.length; i++) {
    if (kdHistory[3] == allDeniedList[i][3]) {
      return true;
    }
  }
  return false;
}
function getKdHistoryWithoutDenied() {
  var kds = getKdHistory();
  var deniedList = getDeniedList(kds);
  var kd = new Array();
  var index = 0;
  for (var i = 0; i < kds.length; i++) {
    if (kds[i][2]) {
      continue;
    }
    if (!isThisKdHistoryDenied(kds[i], deniedList)) {
      kd[index] = kds[i];
      index += 1;
    }
  }
  return kd;
}
function scrollToStart() {
  location.hash = '';
}
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function () {
      oldonload();
      func();
    }
  }
}
function getDateOffset(nowDate, date) {
  return nowDate.getTime() - date.getTime();
}
function getAverageActivity(kdList) {
  var nowDate = new Date();
  var sum = 0;
  for (var i = 0; i < kdList.length; i++) {
    sum += getDateOffset(nowDate, kdList[i][1]);
  }
  return sum / kdList.length;
}
function addActivityElement() {
  var div = document.createElement('div');
  div.style['font-size'] = scoreFontSize + 'px';
  var center = document.createElement('center');
  div.appendChild(center);
  center.innerHTML = 'Modding Activity: ';
  var b = document.createElement('b');
  b.id = 'moddingActivityScores';
  b.innerHTML = '∞';
  if (!isScoreBold) {
    b.style.fontWeight = 'normal';
  }
  center.appendChild(b);
  var p = document.createElement('p');
  center.appendChild(p);
  var head = document.getElementsByClassName('centrep userbox') [0];
  insertAfter(div, head);
}
function addActivityScore(number) {
  var score = document.getElementById('moddingActivityScores');
  score.innerHTML = roundNumber(number, 2);
}
function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  } 
  else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}
function roundNumber(number, decimals) {
  var newString;
  decimals = Number(decimals);
  if (decimals < 1) {
    newString = (Math.round(number)).toString();
  } else {
    var numString = number.toString();
    if (numString.lastIndexOf('.') == - 1) {
      numString += '.';
    }
    var cutoff = numString.lastIndexOf('.') + decimals;
    var d1 = Number(numString.substring(cutoff, cutoff + 1));
    var d2 = Number(numString.substring(cutoff + 1, cutoff + 2));
    if (d2 >= 5) {
      if (d1 == 9 && cutoff > 0) {
        while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
          if (d1 != '.') {
            cutoff -= 1;
            d1 = Number(numString.substring(cutoff, cutoff + 1));
          } else {
            cutoff -= 1;
          }
        }
      }
      d1 += 1;
    }
    if (d1 == 10) {
      numString = numString.substring(0, numString.lastIndexOf('.'));
      var roundedNum = Number(numString) + 1;
      newString = roundedNum.toString() + '.';
    } else {
      newString = numString.substring(0, cutoff) + d1.toString();
    }
  }
  if (newString.lastIndexOf('.') == - 1) {
    newString += '.';
  }
  var decs = (newString.substring(newString.lastIndexOf('.') + 1)).length;
  for (var i = 0; i < decimals - decs; i++)
  newString += '0';
  var newNumber = Number(newString);
  return newString;
}

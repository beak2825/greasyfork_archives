// ==UserScript==
// @name         MatchResult-Review Script
// @namespace    https://greasyfork.org/users/198348
// @version      0.0.2
// @description  View match result in advance (under 50 minutes before the match start)
// @author       TM supporter
// @include	     http://trophymanager.com/matches/*
// @include	     https://trophymanager.com/matches/*
// @downloadURL https://update.greasyfork.org/scripts/370596/MatchResult-Review%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/370596/MatchResult-Review%20Script.meta.js
// ==/UserScript==

function insertBefore(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode);
}

function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function getGoalsReport(report) {
  var goalsReport = [];
  Object.keys(report).forEach(function(key, index) {
    var minuteArr = report[key];
    for (var i = 0; i < minuteArr.length; i++) {
      var paramArr = minuteArr[i].parameters;
      var goalScorerId;
      var goalFound = false;
      if (paramArr) {
        for (var j = 0; j < paramArr.length; j++) {
          var paramObj = paramArr[j];
          if (paramObj.goal) {
            goalsReport.push({
              minute: key,
              scorer: paramObj.goal.player
            });
          }
        }
      }
    }
  });
  return goalsReport;
}

function mergeMinutes(data) {
  var seen = {};
  data = data.filter(function(entry) {
    var previous;
    if (seen.hasOwnProperty(entry.scorer)) {
      previous = seen[entry.scorer];
      previous.minute.push(' '+ entry.minute + '\'');
      return false;
    }
    if (!Array.isArray(entry.minute)) {
      entry.minute = [entry.minute + '\''];
    }
    seen[entry.scorer] = entry;
    return true;
  });
  return data;
}

function formatReport(goalsRp, homeLineup, awayLineup) {
  var rps = mergeMinutes(goalsRp);
  var homeReport = [];
  var awayReport = [];
  rps.forEach(function (rp) {
    if (homeLineup.hasOwnProperty(rp.scorer)) {
      rp.scorer = homeLineup[rp.scorer];
      homeReport.push(rp);
    }
    if (awayLineup.hasOwnProperty(rp.scorer)) {
      rp.scorer = awayLineup[rp.scorer];
      awayReport.push(rp);
    }
  });
 return {
   homeReport: homeReport,
   awayReport: awayReport
 }
}

function showMatchResult() {
  var resultDiv = document.createElement('div');
  var matchID = location.href.match(/([^\/]*)\/*$/)[1];
  var xhr = new XMLHttpRequest();
  var url = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchID;
  resultDiv.className = 'main_center';

  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
	  var data = JSON.parse(this.responseText);
      var homeClub = data.club.home.club_name;
	  var awayClub = data.club.away.club_name;
      var report = data.report;
      var homeLineup = data.lineup.home;
      var awayLineup = data.lineup.away;
      var scoreData = report[Object.keys(report).sort().pop()];
      var finalText = scoreData[0].chance.text[0];
      var finalScore = 'vs';
      var goalsReport = [];
      var goalsRpDiv = '<div id="goalRpDiv" style="width:100%;margin:0px;padding:0px;background-color:#000000;font-family:arial;font-size:12px;">';
      var homeGoalDiv = '<div id="homeGoalDiv" style="display:inline-block;width:47%;margin:0px;padding:0px;padding-bottom:5px;text-align:right;vertical-align:top;">'
        +'<ul style="list-style-type:none;padding:0px;margin:0px;">';
      var awayGoalDiv = '<div id="awayGoalDiv" style="display:inline-block;width:45%;margin:0px;padding:0px;padding-bottom:5px;text-align:left;vertical-align:top;">'
      + '<ul style="list-style-type:none; padding:0px;margin:0px;">';
      var centerDiv = '<div style="display:inline-block;width:8%;margin:0px;padding:0px;padding-bottom:5px;text-align:center;color:#CF0;"></div>';
      var homeGoals = [];
      var awayGoals = [];
	  var homeScores = 0;
	  var awayScores = 0;
      if (report) {
        goalsReport = getGoalsReport(report);
        var finalReport = formatReport(goalsReport, homeLineup, awayLineup);
        homeGoals = finalReport.homeReport;
        awayGoals = finalReport.awayReport;
		homeGoals.forEach(function (obj) {
		  homeScores += parseInt(obj.minute.length);
		});
	    awayGoals.forEach(function (obj) {
		  awayScores += parseInt(obj.minute.length);
		});
		finalScore = homeScores + ' - ' + awayScores;
	  }
	  var htmlTxt = '<div style="width:100%;margin-top:10px;padding:10px;padding-bottom:5px;background-color:#000000;font-size:16px;font-weight:bold;">';
	  htmlTxt += '<div style="display:inline-block;width:46%;margin:0px;padding:0px;text-align:right;">' + homeClub + '</div>'
        + '<div style="display:inline-block;width:8%;margin:0px;padding:0px;text-align:center;color:#fff">' + finalScore + '</div>'
        + '<div style="display:inline-block;width:46%;margin:0px;padding:0px;text-align:left;">' + awayClub + '</div></div>'
      resultDiv.innerHTML = htmlTxt + goalsRpDiv;
      var mainCenters = document.getElementsByClassName('main_center');
	  var lastMainDiv = mainCenters[mainCenters.length - 1];
        if (lastMainDiv) {
		  insertBefore(resultDiv, lastMainDiv);
        }
    }
  };
}

(function() {
  'use strict';
  showMatchResult();
})();
// ==UserScript==
// @name             League Result 
// @version          2023090501
// @description  联赛全部比分查看 View league result in advance
// @author       CắnCua United
// @include      *trophymanager.com/league*
// @namespace https://greasyfork.org/users/15590
// @downloadURL https://update.greasyfork.org/scripts/377207/League%20Result.user.js
// @updateURL https://update.greasyfork.org/scripts/377207/League%20Result.meta.js
// ==/UserScript==


function parseMatchIds() {
  var matchIds = [];
  $('#next_round_table td').each(function () {
    var hrefVal = $(this).children('a').attr('href');
    if (hrefVal) {
      var matchID = hrefVal.substr(hrefVal.lastIndexOf('matches/') + 8, hrefVal.length - 10);
      matchIds.push(matchID);
    }
  });
  return matchIds;
}


function replaceScore(matchId, finalScore) {
  var matchIds = [];
  $('#next_round_table td').each(function () {
    var hrefVal = $(this).children('a').attr('href');
    if (hrefVal && hrefVal === '/matches/' + matchId + '/') {
      $(this).children('a').html(finalScore );
    }
  });
}

function getGoalsReport(report) {
  var goalsReport = [];
  Object.keys(report).forEach(function (key, index) {
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
  data = data.filter(function (entry) {
    var previous;
    if (seen.hasOwnProperty(entry.scorer)) {
      previous = seen[entry.scorer];
      previous.minute.push(' ' + entry.minute + '\'');
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

function getTheJobDone() {
  var matchIds = parseMatchIds();
  var scoreArr = [];
  matchIds.forEach(function (matchId) {
    var xhr = new XMLHttpRequest();
    var url = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchId;

    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        var report = data.report;
        var homeLineup = data.lineup.home;
        var awayLineup = data.lineup.away;
        var finalScore = 'Not available';
        var goalsReport = [];
        var homeGoals = [];
        var awayGoals = [];
        var homeScores = 0;
        var awayScores = 0;
        if (report) {
          goalsReport = getGoalsReport(report);
          var hasResult = Object.keys(report).length > 3 ? true : false;
          var finalReport = formatReport(goalsReport, homeLineup, awayLineup);
          homeGoals = finalReport.homeReport;
          awayGoals = finalReport.awayReport;
          homeGoals.forEach(function (obj) {
            homeScores += parseInt(obj.minute.length, 10);
          });
          awayGoals.forEach(function (obj) {
            awayScores += parseInt(obj.minute.length, 10);
          });
          if (hasResult) {
            finalScore = homeScores + '-' + awayScores;
            replaceScore(matchId, finalScore);
          }
        }
      }
    };
  });
}

(function () {
  'use strict';
  getTheJobDone();
})();

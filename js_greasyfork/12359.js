// ==UserScript==
// @name         Kongregate Level Extension
// @description  Updates the profile level as if the level cap was at level 100
// @namespace    resterman
// @version      1.0.2
// @author       resterman
// @match        http://www.kongregate.com/accounts/*
// @downloadURL https://update.greasyfork.org/scripts/12359/Kongregate%20Level%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/12359/Kongregate%20Level%20Extension.meta.js
// ==/UserScript==
var REAL_MAX_LVL = 65;
var FAKE_MAX_LVL = 100;
var levelPoints = [
];
levelPoints[65] = 36560;
levelPoints[66] = 38340;
levelPoints[67] = 40195;
levelPoints[68] = 42125;
levelPoints[69] = 44130;
levelPoints[70] = 46210;
levelPoints[71] = 48375;
levelPoints[72] = 50625;
levelPoints[73] = 52960;
levelPoints[74] = 55380;
levelPoints[75] = 57885;
levelPoints[76] = 60485;
levelPoints[77] = 63180;
levelPoints[78] = 65970;
levelPoints[79] = 68855;
levelPoints[80] = 71835;
levelPoints[81] = 74920;
levelPoints[82] = 78110;
levelPoints[83] = 81405;
levelPoints[84] = 84805;
levelPoints[85] = 88310;
levelPoints[86] = 91930;
levelPoints[87] = 95665;
levelPoints[88] = 99515;
levelPoints[89] = 103480;
levelPoints[90] = 107560;
levelPoints[91] = 111765;
levelPoints[92] = 116095;
levelPoints[93] = 120550;
levelPoints[94] = 125130;
levelPoints[95] = 129835;
levelPoints[96] = 134675;
levelPoints[97] = 139650;
levelPoints[98] = 144760;
levelPoints[99] = 150005;
levelPoints[100] = 155385;
function setupCSS() {
  var levelStyle = document.createElement('style');
  for (var i = REAL_MAX_LVL; i <= FAKE_MAX_LVL; i++)
  levelStyle.innerHTML += '.level_' + i + '{background-position: 100% ' + ( - 1555 - 20 * (i - REAL_MAX_LVL)) + 'px;}';
  document.head.appendChild(levelStyle);
}
function updateUserLevel() {
  getUserPoints(function (points) {
    if (points < levelPoints[REAL_MAX_LVL])
    return;
    var fakeLevel = getUserLevel(points);
    var htmlLevel = document.getElementById('user_level').getElementsByTagName('a') [1].getElementsByTagName('span') [0];
    htmlLevel.innerHTML = '' + fakeLevel;
    createProgressBar(fakeLevel, points);
  });
}
var getUserPoints = function (next) {
  var myKongNav = document.getElementById('user_points');
  var navPoints = myKongNav ? myKongNav.getElementsByClassName('user_metric_stat') [0].getElementsByTagName('span') [0] : null;
  if (navPoints) next(parseInt(navPoints.textContent));
   else setTimeout(function () {
    getUserPoints(next);
  }, 1000);
};
var getUserLevel = function (points) {
  var i = REAL_MAX_LVL;
  while (i <= FAKE_MAX_LVL && points >= levelPoints[i])
  i++;
  return i - 1;
};
function createProgressBar(level, points) {
  if (level >= FAKE_MAX_LVL)
  return;
  var pointsLeft = levelPoints[level + 1] - points;
  var pointsBetween = levelPoints[level + 1] - levelPoints[level];
  var percentageRemaining = 100 * (1 - (pointsLeft / pointsBetween));
  var pointsInfo = document.createElement('span');
  pointsInfo.className = 'points_bar_container';
  var pointsInfoP = document.createElement('p');
  var pointsBarContainer = document.createElement('points_bar_container');
  pointsBarContainer.className = 'points_info mlm';
  pointsBarContainer.innerHTML = 'Points needed for next level: <strong class="points_to_level_up">' + pointsLeft + '</strong></span>';
  var pointsBar = document.createElement('span');
  pointsBar.className = 'points_bar mhm';
  var pointsProgress = document.createElement('span');
  pointsProgress.className = 'points_progress';
  pointsProgress.setAttribute('style', 'width:' + percentageRemaining + '%;');
  pointsBar.appendChild(pointsProgress);
  var pointsLevel = document.createElement('span');
  pointsLevel.className = 'points_level';
  pointsLevel.innerHTML = 'Level <span class="spritesite levelbug level_' + (level + 1) + ' title="Level ' + (level + 1) + '"></span>';
  pointsInfoP.appendChild(pointsBarContainer);
  pointsInfoP.appendChild(pointsBar);
  pointsInfoP.appendChild(pointsLevel);
  pointsInfo.appendChild(pointsInfoP);
  document.getElementById('profile_heading').appendChild(pointsInfo);
    
  var currentLevel = document.getElementById('profile_hgroup').getElementsByClassName('levelbug')[0];
  currentLevel.className = "spritesite levelbug level_" + level;
}

(function () {
  setupCSS();
  updateUserLevel();
}) ();

// ==UserScript==
// @name         HH Battle Win-rate
// @namespace    ZYScript
// @version      1.0.3
// @description  Displays the win rate against an enemy in the battle screen (Still in beta testing).
// @author       Xynoth
// @match        https://nutaku.haremheroes.com/battle.html*
// @require      https://greasyfork.org/scripts/369869-winrate-library/code/WinRate%20Library.js?version=624172
// @grant        HHWinrate
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/40963/HH%20Battle%20Win-rate.user.js
// @updateURL https://update.greasyfork.org/scripts/40963/HH%20Battle%20Win-rate.meta.js
// ==/UserScript==
// We get the stat variables first.
// If you want to show the real percentages (by default it will show as 0 if you are worse on the normal rounds) set as false:
var NormalComparison = true;

// If you want to use the low ego correction, set as true, (if you are getting some false values over 77%, consider setting as false)
var WRCorrection = true;

if (WRCorrection == true) {
   if (HeroNormalRounds - HeroWorstRounds > 1) {WinRate += 0.110}
   if (HeroBestRounds - HeroNormalRounds > 1) {WinRate += 0.110}}
if (WinRate > 1) {WinRate = 1}

// This changes the symbol depending on the rounds variance.
var RangeSym = "~";
var ERangeSym = "~";
var RoundsVariance = "↑" + HeroBestRounds + "~" + HeroNormalRounds + "~" + HeroWorstRounds + "↓";
var ERoundsVariance = "↑" + EnemyBestRounds + "~" + EnemyNormalRounds + "~" + EnemyWorstRounds + "↓";

if (HeroBestRounds == HeroNormalRounds && HeroNormalRounds == HeroWorstRounds) {RoundsVariance = HeroNormalRounds}
if (EnemyBestRounds == EnemyNormalRounds && EnemyNormalRounds == EnemyWorstRounds) {ERoundsVariance = EnemyNormalRounds}

WinRate *= 100;
if (WinRate == 0) {parseFloat(WinRate)}
else if (WinRate == 100) {parseFloat(WinRate)}
else {WinRate = parseFloat(WinRate).toFixed(1)}

// Fix for eternal turns
var Percent = "%";
if (EnemyTurns == "∞") {ERoundsVariance = "∞"; RoundsVariance = 0;WinRate = "Don't.";Percent = ""}
if (HeroTurns == "∞") {RoundsVariance = "∞"; ERoundsVariance = 0;WinRate = "D'uh!";Percent = ""}

// Win rate comments
var TrololoComment;

if (JudgeHardcore == 1) {
    if (WinRate >= 88.9) {TrololoComment = "Beat this NOOB!"}
    if (WinRate >= 50.01) {if (WinRate <= 88.8) {TrololoComment = "Feeling lucky?"}}
    if (WinRate == 50) {TrololoComment = "Anything could happen!"}
    if (WinRate >= 0.01) {if (WinRate <= 49.9) {TrololoComment = "Nope."}}
    if (WinRate == 0) {TrololoComment = "Fancy losing some mojo?"}
    if (WinRate == "D'uh!") {TrololoComment = "Quite one sided, isn't it?"}
    if (WinRate == "Don't.") {TrololoComment = "Don't."}}
else if (JudgeCharm == 1) {
    if (WinRate >= 88.9) {TrololoComment = "Beat this peasant."}
    if (WinRate >= 50.01) {if (WinRate <= 88.8) {TrololoComment = "Anything could happen."}}
    if (WinRate == 50) {TrololoComment = "This might be entertaining."}
    if (WinRate >= 0.01) {if (WinRate <= 49.9) {TrololoComment = "I'm with him this time."}}
    if (WinRate == 0) {TrololoComment = "Get out of here, you peasant!"}
    if (WinRate == "D'uh!") {TrololoComment = "Quite one sided, isn't it?"}
    if (WinRate == "Don't.") {TrololoComment = "Don't."}}
else if (JudgeKnowHow == 1) {
    if (WinRate >= 88.9) {TrololoComment = "Victory is yours."}
    if (WinRate >= 50.01) {if (WinRate <= 88.8) {TrololoComment = "You might win."}}
    if (WinRate == 50) {TrololoComment = "Might be an even match."}
    if (WinRate >= 0.01) {if (WinRate <= 49.9) {TrololoComment = "Wouldn't be wise to try."}}
    if (WinRate == 0) {TrololoComment = "If you want to lose mojo..."}
    if (WinRate == "D'uh!") {TrololoComment = "Quite one sided, isn't it?"}
    if (WinRate == "Don't.") {TrololoComment = "Don't."}}

// LOST MOJO CALCULATION

var LostMojo = Number($(".rewards_list .slot_mojo h3").text()) - 32;

if (LostMojo == 0) {LostMojo = -1}

// This appends the win rate text inside the judge balloon.
var start = function () {
    var WinRatediv = $("#battle_middle .battle_balloon div[rel='start']");
    WinRatediv.html('<div style="position: absolute; bottom: 0px; padding: 2px; font-size: 0.5em; display: flex; width: 100%; justify-content: center; flex-direction:column; margin-left: -4%">'
                     +"<span id='Trololo'></span>"
                     +"<span id='WinRate' style='font-size: 1.1em'></span>"
                     +"<span id='Noob-turns' style='font-size: 0.9em'></span>"
                     +'</div>'+WinRatediv.html());
    document.getElementById("Noob-turns").innerHTML = "You: " + RoundsVariance + "  VS  " + "Enemy: " + ERoundsVariance;
    document.getElementById("Trololo").innerHTML = TrololoComment;
    if (window.location.href.indexOf("id_troll") > -1) {document.getElementById("WinRate").innerHTML = "Win Rate: " + WinRate + Percent}
    else {document.getElementById("WinRate").innerHTML = "[W/R: " + WinRate + "%]" + " [If loss: " + LostMojo + " Mojo]";}
    var Reloadiv = $("#battle_middle .battle_balloon");
    Reloadiv.html('<div style="position: absolute; padding: 2px; font-size: 1em; display: flex; margin-left: 90%">'
                  +"<span id='reloader' style='cursor:pointer' onclick='window.location.reload(true)'>※</span>"
                  +'</div>'+Reloadiv.html());
};

// Fix to prevent glitches
if (ERoundsVariance == 0 || ERoundsVariance == "NaN") {
    if (RoundsVariance != "∞") {location.reload()}
    else {$("document").ready(start)}}
else if (RoundsVariance == 0 || RoundsVariance == "NaN") {
    if (ERoundsVariance != "∞") {location.reload()}
    else {$("document").ready(start)}}
else {$("document").ready(start)}

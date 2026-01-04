// ==UserScript==
// @name        Boardgamearena Railways Of The World UI overlay
// @namespace   Violentmonkey Scripts
// @match       https://boardgamearena.com/*railwaysoftheworld*
// @grant       none
// @version     1.6
// @author      Tethys
// @license     GNU GPLv3
// @description Make cards/scoreboard visible as an overlay in Railways Of The World
// @downloadURL https://update.greasyfork.org/scripts/435813/Boardgamearena%20Railways%20Of%20The%20World%20UI%20overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/435813/Boardgamearena%20Railways%20Of%20The%20World%20UI%20overlay.meta.js
// ==/UserScript==

document.head.appendChild(document.createElement("style")).innerHTML=`
#toggle_buttons {
  position: fixed;
  left: 0;
  top: 62px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  z-index: 5000;
}

#toggle_buttons button {
  padding: 0.2em;
  border: 1px solid #000;
  font-weight: bold;
  background: linear-gradient(45deg, rgba(121,72,61,0.8), rgba(150,80,80,0.8));
  color: #eee;
  padding-bottom: 0.3em;
  padding-top: 0.3em;
  z-index: 5001;
}

#toggle_buttons button:hover {
  color: #eea;
}

#ROTWinfo {
  position: absolute;
  left: 4%;
  top: 4%;
  width: 92%;
  height: 92%;
  overflow: auto;
  background-color: rgba(100,100,100,0.8);
  padding: 0.5em;
  z-index: 3000;
}

#board_engine_cards_item_0 { left: 0px; top: 0px; }
#board_engine_cards_item_1 { left: 205px !important; top: 0px !important; }
#board_engine_cards_item_2 { left: 410px !important; top: 0px !important; }
#board_engine_cards_item_3 { left: 615px !important; top: 0px !important; }
#board_engine_cards_item_4 { left: 0px !important; top: 134px !important; }
#board_engine_cards_item_5 { left: 205px !important; top: 134px !important; }
#board_engine_cards_item_6 { left: 410px !important; top: 134px !important; }
#board_engine_cards_item_7 { left: 615px !important; top: 134px !important; }

`;

let buttons = document.createElement('div');
let cards_button = document.createElement('button');
let engines_button = document.createElement('button');
let score_button = document.createElement('button');
let players_button = document.createElement('button');

var wrap = document.getElementById('game_play_area_wrap');
var gameview = document.getElementById('pagesection_gameview');
var panel = document.getElementById('ROTWinfo');
var cards = document.getElementById('operation_cards');
var engines = document.getElementById('board_engine_cards');
var scoreboard = document.getElementById('board_score_track');
var players = document.getElementById('rotw_playertables');
var hideshow = document.getElementById('hideShowOpCards');

cards_button.innerHTML = 'Cards (1)';
engines_button.innerHTML = 'Engines (2)';
players_button.innerHTML = 'Players (3)';
score_button.innerHTML = 'Scoreboard (4)';

buttons.id = 'toggle_buttons';
buttons.appendChild(cards_button);
buttons.appendChild(engines_button);
buttons.appendChild(players_button);
if (!!scoreboard) { buttons.appendChild(score_button); }

hideshow.style.display = 'none';
engines.style.display = 'none';
players.style.display = 'none';
if (!!scoreboard) { scoreboard.style.display = 'none'; }

function toggle_elem(elem)
{
  if (elem.style.display == 'none')
  {
    elem.style.display = 'block';
    panel.style.display = 'block';
  } else
  {
    elem.style.display = 'none';
    panel.style.display = 'none';
  }
}

function toggle_cards() {
  if (panel.style.display == 'none')
    panel.style.display = 'block'
  else
    panel.style.display = 'none';
}

cards_button.onclick = function() {
  engines.style.display = 'none';
  players.style.display = 'none';
  if (scoreboard) { scoreboard.style.display = 'none'; }
  toggle_elem(cards);
}

engines_button.onclick = function() {
  cards.style.display = 'none';
  players.style.display = 'none';
  if (scoreboard) { scoreboard.style.display = 'none'; }
  toggle_elem(engines);
}

players_button.onclick = function() {
  cards.style.display = 'none';
  engines.style.display = 'none';
  if (scoreboard) { scoreboard.style.display = 'none'; }
  toggle_elem(players);
}

if (scoreboard) {
  score_button.onclick = function() {
    cards.style.display = 'none';
    engines.style.display = 'none';
    players.style.display = 'none';
    toggle_elem(scoreboard);
  }
}

if (panel)
{
  gameview.insertBefore(buttons, wrap);
}

document.addEventListener('keyup', function(event) {
  if (event.key == '1') { cards_button.click(); }
  else if (event.key == '2' ) { engines_button.click(); }
  else if (event.key == '3' ) { players_button.click(); }
  else if (event.key == '4' ) { score_button.click(); }
  else { console.log("=== unrecognised key: %s", event.key); }
});

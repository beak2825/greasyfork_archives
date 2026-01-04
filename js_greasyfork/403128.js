// ==UserScript==
// @name         Refined Nations
// @version      3.6.4
// @description  UI tweaks for MaBi Web Nations
// @match        http://www.mabiweb.com/modules.php?name=Game_Manager
// @match        http://www.mabiweb.com/modules.php?name=Game_Manager&reloaded=true
// @match        http://www.mabiweb.com/modules.php?name=Game_Manager&op=your_games*
// @match        http://www.mabiweb.com/modules.php?name=GM_Nations*
// @author       Mark Woon
// @namespace    https://github.com/markwoon/
// @supportURL   https://github.com/markwoon/RefinedNations
// @icon         https://raw.githubusercontent.com/markwoon/RefinedNations/b14a0e06e8f585a451d6d99e40a08a6f04b43398/images/marie_curie.png
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/403128/Refined%20Nations.user.js
// @updateURL https://update.greasyfork.org/scripts/403128/Refined%20Nations.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
/* global GM_config, RefinedNationsConfig */
'use strict';

let gameUrl;

const MAX_SAVED_GAMES = 10;
let numSavedGames = 6;
let isConfigOpen = false;

/**
 * GM_config open callback.
 */
const onOpenConfig = () => {
  isConfigOpen = true;
  for (let x = numSavedGames + 1; x <= MAX_SAVED_GAMES; x += 1) {
    GM_config.fields[`game${x}Id`].remove();
    GM_config.fields[`game${x}Slack`].remove();
  }
}
/**
 * GM_config save callback.  Closes settings panel and reloads page to apply changes.
 */
const onSaveConfig = () => {
  if (isConfigOpen) {
    GM_config.close();
    if (gameUrl) {
      // gameUrl is only defined if on game page and logged in
      window.location.href = gameUrl;
    }
  }
}
/**
 * GM_config close callback.
 */
const onCloseConfig = () => {
  isConfigOpen = false;
}

const title = document.createElement('div')
title.innerHTML = 'Refined Nations Config<div style="font-size: 9pt; background-color: #EFEFEF;">Mouse over field names for help.</div>';

/**
 * Initialize config.
 */
// initially build support for MAX_SAVED_GAMES games, then hide unused games
GM_config.init(buildGmConfig(MAX_SAVED_GAMES));
numSavedGames = GM_config.get('numSavedGames');
// noinspection JSUnresolvedFunction
GM_registerMenuCommand('Refined Nations Settings', () => {
  GM_config.open();
  RefinedNationsConfig.style.maxHeight = '58em';
  RefinedNationsConfig.style.maxWidth = '35em';
});


function findIndex(array, matcher) {
  for (let x = 0; x < array.length; x += 1) {
    if (matcher(array[x])) {
      return x;
    }
  }
  return -1;
}


let username = '';
const logoutLink = document.querySelector('a[href="modules.php?name=Your_Account&op=logout"]');
if (logoutLink) {
  // noinspection JSUnresolvedVariable
  const welcomeText = logoutLink.parentNode.innerHTML;
  const match = welcomeText.match(/Welcome (\w+)!/);
  if (match) {
    username = match[1];
  }
  console.log('Logged in as', username);
}


//---------- BEGIN GAMES MANAGER CODE ----------//

/**
 * Imports game from Games Manager into config.
 */
const importGameConfig = (event) => {
  console.log('Importing games from game manager');
  let listIndex = parseInt(event.target['data-listIndex'], 10);
  if (isNaN(listIndex)) {
    console.error('Missing data-listIndex property!');
  }

  const gamesTables = document.querySelectorAll('#gamemanager-gamelists > table > tbody');
  if (!gamesTables) {
    console.log('No games tables?!?');
    return;
  }
  const gamesTable = gamesTables[listIndex];
  if (!gamesTable) {
    console.log('No games table??');
    return;
  }
  const configs = [];
  for (let x = 1; x <= numSavedGames; x++) {
    const config = getGameConfig(x);
    if (config) {
      configs.push(config);
    }
  }

  const games = [];
  for (let x = 1; x < gamesTable.children.length; x += 1) {
    const tr = gamesTable.children[x];
    if (tr.children[6].innerHTML.match('GM_Nations')) {
      const id = tr.children[0].innerHTML;
      const cfgIdx = findIndex(configs, (cfg) => cfg.id === id);
      if (cfgIdx !== -1) {
        configs.splice(cfgIdx, 1);
      } else {
        games.push({
          id,
          name: tr.children[2].innerHTML.substring(0, tr.children[2].innerHTML.indexOf('<br')),
        });
      }
    }
  }

  let updated = false;
  if (configs.length > 0) {
    console.log('Completed games', configs);
    for (let configNum = 1; configNum <= numSavedGames; configNum += 1) {
      const config = getGameConfig(configNum);
      if (config) {
        // remove config for completed game
        for (let x = 0; x < configs.length; x += 1) {
          if (config.id === configs[x].id) {
            GM_config.set(`game${configNum}Id`, '');
            GM_config.set(`game${configNum}Slack`, '');
            updated = true;
            break;
          }
        }
      }
    }
  }
  let numAdded = 0;
  if (games.length > 0) {
    console.log('New games', games);
    for (let x = 0; x < games.length; x += 1) {
      let added = false;
      // find an empty spot to add game
      for (let configNum = 1; configNum <= numSavedGames; configNum += 1) {
        const config = getGameConfig(configNum);
        if (!config || !config.id) {
          console.log(`Adding ${games[x].name} as Game ${configNum}`);
          GM_config.set(`game${configNum}Id`, `${games[x].id}:${games[x].name}`);
          updated = true;
          added = true;
          numAdded += 1;
          break;
        }
      }
      if (!added) {
        console.log(`Not enough slots to add all games.  Only added ${x} out of ${games.length} new games.`);
        break;
      }
    }
  }
  if (updated) {
    console.log('Saving config');
    GM_config.save();
    alert(`Games successfully updated.\n${configs.length} completed games removed, ${numAdded}/${games.length} new games added.`);
  } else {
    alert('No changes.');
  }
}

if (window.location.href.indexOf('http://www.mabiweb.com/modules.php?name=Game_Manager') !== -1) {
  console.log('In Game Manager');
  if (!username) {
    console.log('...but not logged in')
    updateFavIcon(false);

  } else {
    const gameLists = document.querySelectorAll('#gamemanager-gamelists > div');
    if (gameLists) {
      let listIndex = -1;
      for (let x = 0; x < gameLists.length; x += 1) {
        if (gameLists[x].innerHTML.indexOf('Your running games') !== -1) {
          listIndex = x;
          // add import button
          const importBtn = document.createElement('button');
          importBtn.innerHTML = 'Import into Refined Nations';
          importBtn['data-listIndex'] = x;
          importBtn.onclick = importGameConfig;
          importBtn.style.float = 'right';
          importBtn.style.margin = '0 5px 4px 0';
          importBtn.style.display = 'inline';
          gameLists[x].appendChild(importBtn);
          break;
        }
      }

      if (listIndex === -1) {
        console.log('...but not in any games');
        updateFavIcon(false);
        // noinspection JSAnnotator
        return;
      }

      let gotTurn = false;
      const gamesTables = document.querySelectorAll('#gamemanager-gamelists > table > tbody');
      if (gamesTables) {
        const gamesTable = gamesTables[listIndex];
        if (gamesTable) {
          for (let x = 1; x < gamesTable.children.length; x += 1) {
            const tr = gamesTable.children[x];
            if (tr.innerHTML.indexOf(`<strong style="color:red">${username}</strong>`) !== -1) {
              gotTurn = true;
              break;
            }
          }
        }
      }
      updateFavIcon(gotTurn);

      if (GM_config.get('autoReload')) {
        handleAutoReload(gotTurn);
      }
    }
  }

  // noinspection JSAnnotator
  return;
}

//---------- END GAMES MANAGER CODE ----------//


if (GM_config.get('hideChrome')) {
  console.log('hiding extraneous padding');
  // noinspection JSUnresolvedFunction
  GM_addStyle(`
body > table:first-of-type {
  display: none;
}
body > table:nth-of-type(3) {
  display: none;
}
body > table:nth-of-type(4) > tbody > tr:first-of-type > td:nth-of-type(1) {
  display: none;
}
body > table:nth-of-type(4) > tbody > tr:first-of-type > td:nth-of-type(2) {
  display: none;
}
body > table:nth-of-type(4) > tbody > tr:first-of-type > td:nth-of-type(3) {
  display: none;
}
body > table:nth-of-type(4) > tbody > tr:first-of-type > td:nth-of-type(5) {
  display: none;
}
#nations-game > hr {
  display: none;
}
#placeholder ul {
  margin: 1em 0 0 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
`);
}



// don't continue if game is over
const header = document.getElementById('nations-gameheader');
if (header.innerHTML.match('Game finished')) {
  console.log('Game over...');
  // noinspection JSAnnotator
  return;
}

// get game ID and URL
// it is sometimes unavailable, and we don't want to continue if that's the case
const urlMatch = window.location.href.match(/g_id=([0-9]+)/);
if (!urlMatch) {
  console.log('CANNOT DETERMINE GAME ID!');
  // noinspection JSAnnotator
  return;
}
const gameId = urlMatch[1];
console.log('Game ID:', gameId);
gameUrl = `http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=${gameId}&op=view_game_reset`;
console.log('Reload URL:', gameUrl);

// add game id to footer
const footer = document.getElementById('nations-gamefooter');
footer.innerHTML = footer.innerHTML + `<br><br>GAME ID:${gameId}<br /><br />Refined Nations v${GM_info.script.version}`;


if (GM_config.get('hideHeader')) {
  console.log('hiding header');
  // noinspection JSUnresolvedFunction
  GM_addStyle(`
#nations-gameheader {
  display: none;
}
`);
}



if (username) {
  // add game menu
  const menu = loadGameMenu();
  if (menu) {
    const tr = logoutLink.parentNode.parentNode.parentNode.parentNode;
    tr.children[0].width = '35%';
    tr.children[1].width = '50%';
    tr.children[2].width = '15%';
    const node = document.createElement('span');
    node.innerHTML = '<b style="margin-left: 4em;">Games:&nbsp;</b>';
    node.appendChild(menu);
    tr.children[0].appendChild(node);
  }
}


// get round #
const match = header.innerHTML.match(/round:\s*(<b>.*?<\/b>)\s*<br>(.*?)<br>/m);
if (!match) {
  console.error('CANNOT DETERMINE PLAYERS!');
  // noinspection JSAnnotator
  return;
}
const round = match[1];
const playerString = match[2];

// get current player
let currentPlayer = playerString.match(/<b>(.+?)<\/b>/m)[1];
console.log('Current player is', currentPlayer);

// get player order and levels
const difficultyMatch =
    header.innerHTML.match(/level\s+<b>(Chieftain|Prince|King|Emperor)<\/b>/m);
let difficulty = '';
if (difficultyMatch) {
  switch (difficultyMatch[1]) {
    case 'Chieftain':
      difficulty = '(lv. 4)';
      break;
    case 'Prince':
      difficulty = '(lv. 3)';
      break;
    case 'King':
      difficulty = '(lv. 2)';
      break;
    case 'Emperor':
      difficulty = '(lv. 1)';
      break;
  }
}
const playerOrder = [];
const playerLevels = {};
const playerInfoRegex = />(\w+)(?:<\/b>)?( \(lv\. [1-4]\))?&nbsp;/gm
let rez;
while ((rez = playerInfoRegex.exec(playerString))) {
  playerOrder.push(rez[1]);
  if (rez[2]) {
    playerLevels[rez[1]] = rez[2];
  } else {
    playerLevels[rez[1]] = difficulty;
  }
}
console.log('Player order:', playerOrder);
console.log('Player levels:', playerLevels);

// determine board order
const players = [];
const userIsPlaying = playerOrder.includes(username);
const isUserTurn = currentPlayer === username;
if (userIsPlaying) {
  console.log('Player is in this game!');
  if (!GM_config.get('showBoardsInPlayerOrder')) {
    console.log('Making player\'s board first');
    players.push(username);
  }
  updateFavIcon(isUserTurn);
}
for (let x = 1; x < 7; x++) {
  const pid = GM_config.get(`player${x}`);
  if (pid && playerOrder.includes(pid) && !players.includes(pid)) {
    players.push(pid);
  }
}
for (let x = 0; x < playerOrder.length; x++) {
  if (!players.includes(playerOrder[x])) {
    players.push(playerOrder[x]);
  }
}
console.log('Board order:', players);

const autoReload = GM_config.get('autoReload') && userIsPlaying;

// see if we have advanced directives for this game
const gameConfig = userIsPlaying ? loadGameConfig() : null;


// add option to change player colors at the top
if (userIsPlaying) {
  const options = document.querySelector('body > table:nth-of-type(2) > tbody> tr:nth-of-type(2) > td:nth-of-type(2) > font > b');
  const colorOpt = document.createElement('span');
  colorOpt.innerHTML = `&nbsp;·&nbsp;<a href="http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=${gameId}&op=change_colors_form">Change Player Colors</a>`;
  options.appendChild(colorOpt);
}


// player actions only available when it's the player's turn
let playerActions = document.querySelector('#nations-gameheader table');
if (playerActions) {
  const tds = playerActions.children[0].children[0];
  if (tds.children.length === 1) {
    playerActions = '';
  } else {
    // this appears when there are special actions to be taken (e.g. growth phase)
    const playerToken = tds.children[0];
    playerToken.parentNode.removeChild(playerToken);
    playerActions.style.border = 'solid red 4px';
    playerActions.style.margin = '0 0 0 16em';
    const links = document.querySelectorAll('#nations-gameheader table a img');
    links.forEach((l) => {
      l.style.border = 'solid blue 2px';
    });
  }
}


// move resource tracks into a main game div
const tracks = document.getElementById('nations-tracks');
if (tracks) {
  console.log('Moving resource tracks');
  tracks.parentNode.removeChild(tracks);
  const nationsBoard = document.getElementById('nations-board');
  nationsBoard.parentNode.insertBefore(tracks, nationsBoard.nextSibling);
  nationsBoard.style.height = '560';
  tracks.removeAttribute('style');
}


// re-configure tracks div
const newTracksTable = [];

const addTrackSpacer = () => {
  const td = document.createElement('td');
  td.innerHTML = '&nbsp;&nbsp;';
  newTracksTable.push(td);
};

const addTrackCell = (...content) => {
  const td = document.createElement('td');
  content.forEach((n) => td.appendChild(n));
  newTracksTable.push(td);
};

const tracksTable = document.querySelector('#nations-tracks table tbody tr');
if (tracksTable) {
  const justice = tracksTable.children[0].children[0];
  const military = tracksTable.children[2].children[0];
  const science = tracksTable.children[4].children[0];
  let extraActions = document.createElement('table');
  extraActions.style.paddingRight = '2em';
  let gotExtraActions = false;
  let passTurn;
  if (tracksTable.children.length > 5) {
    for (let x = 5; x < tracksTable.children.length; x += 1) {
      const cellValue = tracksTable.children[x];
      if (cellValue.innerHTML.indexOf('Pass Turn') !== -1) {
        passTurn = cellValue;
      } else if (cellValue.innerHTML.indexOf('buy') === 0) {
        if (x + 1 < tracksTable.children.length && tracksTable.children[x + 1].innerHTML.indexOf('Buy-Advisor') !== -1) {
          x += 1;
          const link = tracksTable.children[x].children[0];
          link.style.color = 'blue';
          link.style.verticalAlign = 'inherit';
          const tr = document.createElement('tr');
          const td = document.createElement('td');
          td.innerHTML = cellValue.textContent.replace('buyfrom', 'buy from') + '&nbsp;';
          td.style.verticalAlign = 'middle';
          td.appendChild(link);
          tr.appendChild(td);
          extraActions.appendChild(tr);
          gotExtraActions = true;
        }
      }
    }
  }

  // build status cell
  const statusTd = document.createElement('td');
  statusTd.style['text-align'] = 'center';
  statusTd.innerHTML = `<div style="margin: 0 8px 8px 4px;">${round}</div>`;
  const actionsTable = document.createElement('table');
  actionsTable.style.margin = 'auto';
  statusTd.appendChild(actionsTable);
  const actionsRow = document.createElement('tr');
  actionsTable.appendChild(actionsRow);

  if (passTurn) {
    // add pass turn link
    const turnCell = document.createElement('td');
    turnCell.style.paddingRight = '2em';
    turnCell.appendChild(passTurn);
    actionsRow.appendChild(turnCell);
    if (gotExtraActions) {
      actionsRow.appendChild(extraActions);
    } else {
      turnCell.style.paddingBottom = '1rem';
    }
  }

  // add reload page button
  const reloadCell = document.createElement('td');
  const reloadButton = document.createElement('button');
  reloadButton.innerHTML = 'Refresh Page';
  reloadButton.onclick = () => {
    window.location.href = gameUrl;
  };
  reloadCell.appendChild(reloadButton);

  if (autoReload) {
    // add auto-reload indicator
    const reloadMsg = document.createElement('div');
    reloadMsg.style.fontSize = '8pt';
    reloadMsg.style.color = '#999999';
    reloadMsg.innerHTML = 'auto-reload enabled';
    reloadCell.appendChild(reloadMsg);
  }
  actionsRow.appendChild(reloadCell);


  // build new tracks table
  newTracksTable.push(statusTd);

  const actions = document.getElementById('nations-actions');
  if (actions) {
    const actionRow = actions.children[0].children[0].children[0];
    actionRow.removeChild(actionRow.children[2]);
    actionRow.children[1].style.border = 'none';
    addTrackCell(actions);
    addTrackSpacer();
    addTrackCell(justice, military, science);

    if (gameConfig && gameConfig.slack) {
      const endTurnCell = actionRow.children[1]
      for (let x = 0; x < endTurnCell.children.length; x++) {
        const node = endTurnCell.children[x];
        if (node.nodeName === 'A') {
          // add onclick handler to send slack notification
          // eslint-disable-next-line no-unused-vars
          node.onclick = async (evt) => {
            if (forgotFreeMoves()) {
              console.log('***** FORGOT FREE MOVES! *****');
              if (!confirm('Do you want to give up your free moves?')) {
                evt.preventDefault();
                evt.stopPropagation();
                return;
              }
            }
            await sendSlackNotification();
          }
        }
      }
      console.log('Will send Slack notification when ending turn')
    }

  } else {
    addTrackCell(justice);
    addTrackSpacer();
    addTrackCell(military);
    addTrackSpacer();
    addTrackCell(science);
  }

  // remove existing elements from track table
  while (tracksTable.firstChild) {
    tracksTable.removeChild(tracksTable.lastChild);
  }
  // and replace with new tracks
  newTracksTable.forEach((n) => tracksTable.appendChild(n));

  if (playerActions) {
    tracks.appendChild(playerActions);
  }
}


// add level and current player info to tabs
const tabList = document.querySelector('#placeholder ul');
const playerColors = {};
if (tabList) {
  const size = tabList.children.length;
  console.log('Adding levels and current player info to tabs');
  for (let x = 0; x < size; x++) {
    const tab = tabList.children[x];
    const name = tab.children[0].innerHTML;
    if (players.indexOf(name) !== -1) {
      const link = tab.children[0];
      playerColors[name] = link.style.color;
      tab.removeChild(link);

      const div = document.createElement('div');
      div.style.border = 'solid grey 1px';
      div.style.padding = '5px 25px';
      if (name === currentPlayer) {
        div.appendChild(document.createTextNode('* '));
      }
      link.style.border = 'none';
      link.style.padding = '0';
      div.appendChild(link);
      if (playerLevels[name]) {
        div.appendChild(document.createTextNode(' ' + playerLevels[name]));
      }
      tab.appendChild(div);
    }
  }
}


// move recent action
const nationsBoardImg = document.getElementById('nations-board_image');
if (nationsBoardImg) {
  console.log('Moving recent actions section');
  const recentActions = document.getElementById('recent_actions_right');
  console.log('Moving recent actions');
  reorder(nationsBoardImg, recentActions);
  recentActions.style.top = '0';
  if (players.length === 6) {
    recentActions.style.left = '1220px';
  } else {
    recentActions.style.left = '1112px';
  }
}


// re-configure player boards
const p1 = document.getElementById(players[0]);
if (p1) {
  console.log('Got P1');
  p1.style.display = 'block';
  addProductionTable(players[0], p1);

  if (GM_config.get('showAllBoards')) {
    for (let x = 5; x > 0; x--) {
      if (players[x]) {
        console.log('Player', x, '-', players[x]);
        showBoard(p1, players[x]);
      }
    }
  }
}


const warnings = [];

function addWarning(userIcon, card, hint = '') {
  warnings.push(`<li>${userIcon} <b>${card}</b>${hint}</li>`);
}

function warnIfUnderConstruction(playerBoard, userIcon, wonder) {
  const img = playerBoard.querySelector(`img[src="modules/GM_Nations/images/Progress_Cards/${wonder}.jpg"]`);
  if (img && img.style.top === '33px') {
    addWarning(userIcon, wonder.replaceAll('_', ' '), ' under construction!')
  }
}
function warnIfInPlay(playerBoard, userIcon, wonder, hint, isArtifact = false, useOnce = false) {
  const img = playerBoard.querySelector(`img[src="modules/GM_Nations/images/Progress_Cards/${wonder}.jpg"]`);
  if (img) {
    let card = wonder.replaceAll('_', ' ');
    const hintText = hint ? `: ${hint}` : '';
    if (isArtifact && img.style.top === '33px') {
      addWarning(userIcon, wonder.replaceAll('_', ' '), ' under construction!')
    } else {
      if (useOnce) {
        if (img.nextSibling && img.nextSibling.hasAttribute('src') &&
            img.nextSibling.getAttribute('src').endsWith('Token_X.png')) {
          card = `<span style="text-decoration: line-through">${card}</span>`;
        }
      }
      addWarning(userIcon, card, hintText);
    }
  }
}

function rgbToBoardColor(rgba) {
  const hex = '#' + rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/)
      .slice(1)
      .map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
          .toString(16)
          .padStart(2, '0')
          .replace('NaN', ''))
      .join('');
  switch (hex) {
    case '#3167f1':
      return 'Blue';
    case '#963bba':
      return 'Purple';
    case '#e32928':
      return 'Red';
    case '#52a22e':
      return 'Green';
    case '#ffde50':
      return 'Yellow';
    case '#e67e22':
      return 'Orange';
    case '#8c8c8c':
      return 'Gray';
    case '#ff33bb':
      return 'Pink';
    case '#1affff':
      return 'Cyan';
  }
  console.warn(`Unknown color: ${rgba} (hex: #${hex}`);
  return null;
}

for (let x = 0; x < players.length; x++) {
  const p = document.getElementById(players[x]);
  const board = p.querySelector(`#${players[x]} > img`);
  let userIcon = players[x];
  let userColor = 'Gray';
  if (!board) {
    console.warn('Cannot find board for player', players[x]);
  } else if (!board?.style?.borderColor) {
    console.warn('Cannot determine color for player', players[x]);
  } else {
    userColor = rgbToBoardColor(board.style.borderColor);
    userIcon = `<img src="/modules/GM_Nations/images/Disc_${userColor}.png" alt="${userColor} player" style="vertical-align: middle; height: 1.25em" />`;
  }
  const meepleIcon = `<img src="/modules/GM_Nations/images/Meeple_${userColor}.png" alt="${userColor} meeple" style="vertical-align: middle; height: 1.25em" />`;

  warnIfInPlay(p, userIcon, 'Pocahontas', 'all: colonies require +4<img src="/modules/GM_Nations/images/Military.png" alt="Military" style="vertical-align: middle; height: 1.25em" />');
  if (players[x] !== username) {
    warnIfInPlay(p, userIcon,'Assassin');
    warnIfInPlay(p, userIcon,'Cape_of_Good_Hope', 'colonies -4 <img src="/modules/GM_Nations/images/Military.png" alt="Military" style="vertical-align: middle; height: 1.25em" />', true);
    warnIfInPlay(p, userIcon, 'Hannibal', 'battles cost +1<img src="/modules/GM_Nations/images/Token_Gold.png" alt="Gold" style="vertical-align: middle; height: 1.25em" />');
    warnIfInPlay(p, userIcon, 'Petra', 'can exchange resources', true, true);
    warnIfInPlay(p, userIcon, 'Piazza_San_Marco', 'can exchange resources', true, true);
    warnIfInPlay(p, userIcon, 'Sun_Tzu');

    warnIfUnderConstruction(p, userIcon, 'British_Museum');
    warnIfUnderConstruction(p, userIcon, 'Terracotta_Army');
    warnIfUnderConstruction(p, userIcon, 'Titanic');

    let img = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Axumite_Kingdom.jpg"]');
    if (img && img.getAttribute('width') !== '30') {
      addWarning(userIcon, 'Axumite Kingdom');
    }

    img = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Democratic_Republicans.jpg"]');
    if (img && img.getAttribute('width') !== '30') {
      addWarning(userIcon, 'Democratic Republicans');
    }

    img = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Jagellonian_Dynasty.jpg"]');
    if (img && img.getAttribute('width') !== '30') {
      addWarning(userIcon, 'Jagellonian Dynasty');
    }

    img = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Heian_Period.jpg"]');
    if (img && img.getAttribute('width') !== '30') {
      addWarning(userIcon, 'Heian Period',': +4<img src="/modules/GM_Nations/images/Heritage.png" alt="Books" style="vertical-align: middle; height: 1.25em" />/golden age</li>');
    }

    img = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Sassanid_Empire.jpg"]');
    if (img && img.getAttribute('width') !== '30') {
      addWarning(userIcon, 'Sassanid Empire', ': free turmoils');
    }

    const arabs = p.querySelector('img[src="modules/GM_Nations/images/DPlayerBoard_Arabs.jpg"]');
    if (arabs) {
      const umayyad = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Umayyad_Caliphate.jpg"]');
      const abbasid = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Abbasid_Caliphate.jpg"]');
      if (umayyad && umayyad.getAttribute('width') !== '30') {
        addWarning(userIcon, 'Umayyad Caliphate', ': colonies -4<img src="/modules/GM_Nations/images/Military.png" alt="Military" style="vertical-align: middle; height: 1.25em" /></li>');
      } else if (abbasid && abbasid.getAttribute('width') !== '30') {
        addWarning(userIcon, 'Abbasid Caliphate', ': may buy <img src="/modules/GM_Nations/images/Token_VP.png" alt="VP" style="vertical-align: middle; height: 1.25em" /> when others buy golden age</li>');
      } else {
        addWarning(userIcon, 'Arabs', `: +${meepleIcon}/battle</li>`);
      }
    }

    const korea = p.querySelector('img[src="modules/GM_Nations/images/DPlayerBoard_Korea.jpg"]');
    if (korea) {
      const joseon = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Joseon_Kingdom.jpg"]');
      const koryo = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Koryo_Kingdom.jpg"]');
      if ((!joseon || joseon.getAttribute('width') === '30') &&
          (!koryo || koryo.getAttribute('width') === '30')) {
        addWarning(userIcon, 'Korea', ': +2 <img src="/modules/GM_Nations/images/Cube_Architect.png" alt="Architect" style="vertical-align: middle; height: 1.25em" />/golden age');
      }
    }

    const mongols = p.querySelector('img[src="modules/GM_Nations/images/DPlayerBoard_Mongolia.jpg"]');
    if (mongols) {
      const goldenHorde = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Golden_Horde.jpg"]');
      const yuanDynasty = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Yuan_Dynasty.jpg"]');
      if ((!goldenHorde || goldenHorde.getAttribute('width') === '30') &&
          (!yuanDynasty || yuanDynasty.getAttribute('width') === '30')) {
        addWarning(userIcon, 'Mongols', ': war penalty');
      }
      continue;
    }

    const vikings = p.querySelector('img[src="modules/GM_Nations/images/DPlayerBoard_Vikings.jpg"]');
    if (vikings) {
      const varangians = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Varangians.jpg"]');
      const normans = p.querySelector('img[src="modules/GM_Nations/images/Dynasties_Cards/Normans.jpg"]');
      if ((!normans || normans.getAttribute('width') === '30') &&
          (!varangians || varangians.getAttribute('width') === '30')) {
        addWarning(userIcon, 'Vikings', ': others lose resource after production');
      }
    }
  }
}
if (warnings.length > 0) {
  const tr = document.querySelector('#nations-tracks table tbody tr');
  if (tr) {
    const td = document.createElement('td');
    td.style.padding = '1.5em 0 0 1.5em';
    td.style.verticalAlign = 'top';
    td.innerHTML = '<h4>Alerts</h4><ul style="padding-left: 1.5em;">' + warnings.join('') + '</ul>';
    tr.appendChild(td);
  }
}


if (autoReload) {
  handleAutoReload(currentPlayer === username);
}


/**
 * Move `second` node after `first` node in DOM.
 */
function reorder(first, second) {
  second.parentNode.removeChild(second);
  first.parentNode.insertBefore(second, first.nextSibling);
}


/**
 * Makes a player's board visible.
 */
function showBoard(p1, playerName) {
  const p = document.getElementById(playerName);
  if (p) {
    console.log(`Showing ${playerName}'s board`);
    reorder(p1, p);
    p.style.display = 'block';
    addProductionTable(playerName, p);
  }
}


/**
 * Makes a player's production results visible.
 */
function addProductionTable(playerId, playerNode) {
  const nametag = document.createElement('div');
  nametag.style.position = 'absolute';
  nametag.style.left = '1070px';
  if (playerColors[playerId]) {
    nametag.style.color = playerColors[playerId];
  }
  nametag.innerHTML = `<b>${playerId}</b>`;
  playerNode.appendChild(nametag);

  console.log('Adding production results for ', playerId);
  let resources = document.querySelector('#' + playerId + ' img:last-of-type');
  if (resources) {
    if (!resources.onmouseover) {
      resources = playerNode.children[playerNode.children.length - 2];
    }
    if (resources.onmouseover) {
      const mouseOver = resources.getAttribute('onmouseover');
      const match = mouseOver.match(/(<TABLE.*<\/TABLE>)/m);
      if (match) {
        let productionTable = match[1];
        // strip out style because it's using JS escapes
        productionTable = productionTable.replace(/style=\\'.*?\\'/mg, '');
        productionTable = productionTable.replace(/<TD><IMG/mg, '<TD style="font-size: 14pt; vertical-align: top;"><IMG style="position: relative; height: 30px;"');
        productionTable = productionTable.replace(/width="30"/mg, '');
        productionTable = productionTable.replace(/\(/, '<br /><span style="font-size: 0.8em">(');
        productionTable = productionTable.replace(/\)/, ')</font>');

        const div = document.createElement('div');
        div.innerHTML = productionTable;
        div.style.position = 'absolute';
        div.style.top = '3em';
        div.style.left = '1070px';
        div.style.background = '#fff';

        const table = div.children[0];
        table.style['text-align'] = 'center';

        playerNode.appendChild(div);
        console.log('...added');
      }
    }
  }
  if (playerId === username) {
    movePersonalNotes(playerNode);
  }
}

/**
 * Makes a user's personal notes visible.
 */
function movePersonalNotes(playerNode) {
  if (GM_config.get('showPersonalNotes')) {
    const notesForm = document.querySelector('#personal_notes form');
    if (notesForm) {
      const textarea = document.querySelector('#personal_notes textarea');
      textarea.style.width = '290px';
      textarea.style.height = '300px';

      const div = document.createElement('div');
      div.appendChild(notesForm);
      div.style.position = 'absolute';
      div.style.left = '1070px';
      div.style.top = '14em';
      playerNode.appendChild(div);

      const tab = document.querySelector('#placeholder ul.tab li:last-child');
      if (tab) {
        tab.parentNode.removeChild(tab);
      }
    }
  }
}



function loadGameMenu() {
  const configs = [];
  for (let x = 1; x <= numSavedGames; x++) {
    const config = getGameConfig(x);
    if (config) {
      configs.push(config);
    }
  }
  if (configs.length > 0) {
    const select = document.createElement('select')
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.text = 'pick one to switch to it';
    select.appendChild(emptyOption);
    for (let x = 0; x < configs.length; x++) {
      const config = configs[x];
      const option = document.createElement('option');
      option.value = `http://www.mabiweb.com/modules.php?name=GM_Nations&g_id=${config.id}&op=view_game_reset`;
      option.text = config.name ? config.name : `Game ${config.id}`;
      if (config.id === gameId) {
        option.selected = true;
      }
      select.appendChild(option);
    }
    select.onchange = (evt) => {
      if (evt.target.value && evt.target.value !== window.location.href) {
        window.location.href = evt.target.value;
      }
    };
    return select;
  }
}


/**
 * Loads game config, if any.
 */
function loadGameConfig() {
  for (let x = 1; x <= numSavedGames; x++) {
    const config = getGameConfig(x);
    if (config && config.id === gameId) {
      console.log('Found game config:', config);
      return config;
    }
  }
}


function getGameConfig(num) {
  const nameInfo = trim(GM_config.get(`game${num}Id`));
  if (nameInfo) {
    const config = {};
    const idx = nameInfo.indexOf(':');
    if (idx !== -1) {
      const id = trim(nameInfo.substring(0, idx));
      let name = trim(nameInfo.substring(idx + 1, nameInfo.length));
      config.id = id;
      config.name = name;
      config.slack = trim(GM_config.get(`game${num}Slack`));
    } else {
      config.id = nameInfo;
      config.slack = trim(GM_config.get(`game${num}Slack`));
    }
    return config;
  }
}


/**
 * Trim spaces from start and end of a string.
 */
function trim(value) {
  if (typeof value === 'string') {
    return value.replace(/^\s+|\s+$/g, '');
  }
  return value;
}


function getLastAction() {
  const log = document.getElementById('nations-recentlog');
  return log ? trim(log.children[log.children.length - 1].innerHTML) : '';
}

function forgotFreeMoves() {
  let action = getLastAction();
  const idx = action.indexOf(`${username}: `);
  if (idx === -1) {
    return false;
  }
  action = action.substring(idx + username.length + 2, action.length);
  if (action.indexOf('\'Korea\' special ability: may hire 2 architects for free') !== -1) {
    return true;
  }
  return false;
}


/**
 * Sends Slack end-turn notification.
 */
async function sendSlackNotification() {
  try {
    const data = {
      text: `${getSlackName()} ${getSlackActionText()} ${getSlackGameLink()}`,
    }
    const response = await fetch(gameConfig.slack, {
      method: 'post',
      body: JSON.stringify(data)
    });
    if (response.status !== 200) {
      console.error('Slack responded with ', response.status);
    }
  } catch (error) {
    console.error('Error posting to slack', error);
  }
}

/**
 * Gets user name for Slack message.
 */
function getSlackName() {
  const name = trim(GM_config.get('slackDisplayName'));
  if (name) {
    return name;
  }
  return username;
}

/**
 * Gets action for Slack message.
 */
function getSlackActionText() {
  let action = getLastAction();

  if (GM_config.get('slackDescriptiveMove')) {
    return getSlackFancyActionText(action);
  } else {
    return getSlackSimpleActionText(action);
  }
}

function getSlackSimpleActionText(action) {
  return action.indexOf(`${username}: pass`) !== -1 ? 'passed' : 'made a move';
}

function getSlackFancyActionText(action) {
  const idx = action.indexOf(`${username}: `);
  if (idx === -1) {
    return getSlackSimpleActionText(action);
  }
  action = action.substring(idx + username.length + 2, action.length);

  if (action !== 'pass') {
    action = action
        .replace(/<img width="27" src="modules\/GM_Nations\/images\/(?:Token_)?Heritage\.png" style="vertical-align: middle; margin: 3">/g, ':nations_book:')
        .replace(/<img width="27" src="modules\/GM_Nations\/images\/Token_([A-Za-z]+)\.png" style="vertical-align: middle; margin: 3">/g, ':$1:')
        .replace(/<img width="27" src="modules\/GM_Nations\/images\/Meeple_([A-Za-z]+)\.png" style="vertical-align: middle; margin: 3">/g, ' :meeple_$1:')
        .replace(/(?:'(.+?)') <img width="25" src="modules\/GM_Nations\/images\/(?:Progress|Dynasties)_Cards\/(?:.+?)\.jpg" onmouseover=".+?" style="vertical-align: middle; margin: 3">/g, '_$1_ ')
        .replace(/(:meeple_[A-Za-z]+:) from<img width="35" src="modules\/GM_Nations\/images\/Token_([A-Za-z]+)_Worker.png" style="vertical-align: middle; margin: 3">/g,
            (text, g1, g2) => `${g2.toLowerCase()} ${g1}`)
        .replace(/(:meeple_[A-Za-z]+:) to<img width="35" src="modules\/GM_Nations\/images\/Token_([A-Za-z]+)_Worker.png" style="vertical-align: middle; margin: 3">/g,
            (text, g1, g2) => `${g2.toLowerCase()} ${g1}`)
        .replace(/<img width="27" src="modules\/GM_Nations\/images\/Disc_([A-Za-z]+)\.png" style="vertical-align: middle; margin: 3">/g, '')
        // deal with Victoria Falls
        .replace(/<img width="25" src="modules\/GM_Nations\/images\/(?:Progress|Dynasties)_Cards\/([A-Za-z\-_]+)\.jpg" onmouseover=".+?" style="vertical-align: middle; margin: 3">/g, '_$1_')
        .replace(/&nbsp;/g, ' ')
        .replace(/draw 20 cards +([A-Za-z\-_ ]+)/, 'drew 20 cards, got ')
    ;
    action = action.replace(/[Bb]uy /, 'bought ')
        .replace('deploy ', 'deployed ')
        .replace('hire ', 'hired ')
        .replace(/ +paying /, ', paid ')
        .replace(/^place /, 'placed ')
        .replace('replace ', 'replaced ')
        .replace(/take /g, 'took ')
        .replace(', took ', 'and took ')
        .replace('may took', 'may take')
        // collapse sequential whitespace to a single space
        .replace(/\s+/g, ' ')
        // consistent spacing between number and emoji
        .replace(/(\d):/g, '$1 :')
        // consistent spacing after open parentheses
        .replace(/\( /g, '(')
        // consistent spacing after close parentheses
        .replace(/\)[^\s,.]/g, ') ')
        // remove space before commas
        .replace(/\s,/g, ',')
    ;

    if (!GM_config.get('slackEmojis')) {
      action = action
          .replace(/:meeple_[A-Za-z]+?:/, ' worker')
          .replace(/([0-9]+) ?:gold:/i, (text, g1) => {
            return `$${g1}`;
          })
          .replace(/([0-9]+) ?:([A-Za-z_]+):/i, (text, g1, g2) => {
            let noun = g2.toLowerCase();
            if (noun === 'nations_book') {
              noun = 'book';
            } else if (noun === 'vp') {
              noun = 'VP';
            } else if (noun === 'food') {
              return `${g1} ${noun}`;
            }
            if (g1 > 1) {
              return `${g1} ${noun}s`;
            }
            return `1 ${noun}`;
          })
      ;
    }
    return action;
  }
  return 'passed';
}

/**
 * Gets game link for Slack message.
 */
function getSlackGameLink() {
  if (gameConfig.name) {
    return `in <${gameUrl}|${gameConfig.name}>`;
  }
  return `in <${gameUrl}|game ${gameId}>`;
}


/**
 * Handle auto-reloading: either schedule auto-reload, or notify if auto-reloaded and it's now the
 * user's turn.
 */
function handleAutoReload(gotTurn) {
  console.log('Auto-reload enabled');
  if (gotTurn) {
    console.log('...but it\'s your turn');
    if (window.location.href.indexOf('&reloaded=true') !== -1) {
      // noinspection JSUnresolvedFunction
      GM_notification(`It's your turn!`, 'Nations@Mabi Web', '', () => window.focus());
    }
  } else {
    const reloadInterval = GM_config.get('reloadInterval');
    if (reloadInterval > 0) {
      console.log(`Will reload in ${reloadInterval} minute${reloadInterval > 1 ? 's' : ''}`);
      setTimeout(() => {
        if (gameUrl) {
          window.location.href = gameUrl + '&reloaded=true';
        } else {
          if (window.location.href.indexOf('&reloaded=true') !== -1) {
            window.location.reload();
          } else {
            window.location = window.location + '&reloaded=true';
          }
        }
      }, 60000 * reloadInterval);
    } else {
      console.log('Invalid reloadTimer value');
    }
  }
}


/**
 * Updates the favicon.
 */
function updateFavIcon(showTurnIcon) {
  console.log('Updating favicon');
  try {
    let link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.type = 'image/png';
    link.href = showTurnIcon
        ? 'https://raw.githubusercontent.com/markwoon/RefinedNations/b14a0e06e8f585a451d6d99e40a08a6f04b43398/images/marie_curie.png'
        : 'http://www.mabiweb.com/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
  } catch (error) {
    console.error('Error updating favicon', error);
  }
}



//----- GM_config helpers -----//

/**
 * Generates config fields for GM_config.
 * This allows us to dynamically change the # of saved games.
 */
function buildConfigFields(numGames) {
  let configFields = {
    hideChrome: {
      section: 'UI',
      label: 'Hide Extraneous UI',
      labelPos: 'left',
      type: 'checkbox',
      default: true,
      title: 'Hides the MaBi Web UI and as much unnecessary UI as possible.'
    },
    hideHeader: {
      label: 'Hide Game Header',
      type: 'checkbox',
      default: true,
      title: 'Hides the Nations game header containing player info.',
    },
    showPersonalNotes: {
      label: 'Relocate Personal Notes',
      type: 'checkbox',
      default: true,
      title: 'Move personal notes from tab and place next to player board.'
    },

    autoReload: {
      section: [
        'Auto-Reloading',
        'If you are a player in the game, this will auto-reload the page.  When it is your turn, you will get a browser notification.',
      ],
      label: 'Enable Auto-Reloading',
      labelPos: 'left',
      type: 'checkbox',
      default: false,
      title: 'If enabled, page will auto-reload and notify you when it is your turn.'
    },
    reloadInterval: {
      label: 'Interval (minutes)',
      labelPos: 'left',
      type: 'unsigned int',
      size: 2,
      default: 5,
      title: 'The interval between reloads.',
    },

    showAllBoards: {
      section: 'Player Boards',
      label: 'Show All Boards',
      labelPos: 'left',
      type: 'checkbox',
      default: true,
      title: 'If enabled, this will show all player boards on the same page.'
    },
    showBoardsInPlayerOrder: {
      label: 'Show My Board In Player Order',
      type: 'checkbox',
      default: false,
      title: 'By default, your board will always be first.  Enabling this will place your board in turn order.'
    },

    player1: {
      section: [
        'Board Order',
        'This controls the ordering of player boards when showing all boards.  Do not include yourself in this list.  ' +
        'Listed players that are not in the game will be ignored.  ' +
        'Players in the game that are not listed will have their boards displayed in turn order.'
      ],
      label: 'Player',
      labelPos: 'left',
      type: 'text',
      default: '',
    },
    player2: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player3: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player4: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player5: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    player6: {
      label: 'Player',
      type: 'text',
      default: '',
    },
    //
    numSavedGames: {
      section: [
        'Games',
        'This section facilitates playing multiple games at a time.  ' +
        'Listing your games here will allow you to switch between them in the game header.  ' +
        'Adding a Slack Incoming Webhook for a game will post notifications to that channel when ' +
        'you have completed your move.'
      ],
      label: '# of Games',
      labelPos: 'left',
      type: 'unsigned int',
      default: 6,
      title: 'Number of games to track (maximum of 10).'
    }
  };
  for (let x = 1; x <= numGames; x += 1) {
    configFields[`game${x}Id`] = {
      label: `Game ${x}`,
      labelPos: 'left',
      type: 'text',
      default: '',
      title: 'Format = "Game ID:Game Name"',
    };
    configFields[`game${x}Slack`] = {
      label: 'Slack Webhook',
      type: 'text',
      default: '',
      size: 40,
      title: `Slack Webhook URL to post to whenever you complete your move in Game ${x}.`,
    }
  }
  configFields = {
    ...configFields,
    slackDisplayName: {
      section: [
        'Slack',
        'This is only used if you have Slack configured above.  These settings apply to all games.',
      ],
      label: 'Display Name',
      labelPos: 'left',
      type: 'string',
      default: '',
      title: 'The name to use when announcing your move.  Defaults to MaBi Web user ID if not specified.'
    },
    slackDescriptiveMove: {
      label: 'Descriptive Notifications',
      type: 'checkbox',
      default: true,
      title: 'Sends descriptive notifications instead of generic "moved"/"passed".'
    },
    slackEmojis: {
      label: 'Use Emojis',
      type: 'checkbox',
      default: false,
      title: 'If using descriptive notifications, this will enable the use of emojis.  Requires Nations emojis to be installed.'
    },
  };
  return configFields;
}

function buildGmConfig(numGames) {
  return {
    id: 'RefinedNationsConfig',
    title: title,
    fields: buildConfigFields(numGames),
    events: {
      open: onOpenConfig,
      save: onSaveConfig,
      close: onCloseConfig,
    },
    css: `
#RefinedNationsConfig_header.config_header.center {
  padding: 0;
}
#RefinedNationsConfig .center {
  text-align: inherit;
  padding: 4px;
}
#RefinedNationsConfig .section_desc {
  border: none;
  margin: 0;
}
#RefinedNationsConfig .section_header_holder {
  margin-top: 1em;
}
#RefinedNationsConfig .section_header_holder > div:nth-of-type(2) {
  margin-top: 0.5em;
}
[type="checkbox"] {
  vertical-align: middle;
}
`,
  };
}

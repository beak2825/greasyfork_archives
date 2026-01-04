// ==UserScript==
// @name         Match stats and actions 51 minutes before match
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get match stats and actions 51 minutes before match
// @author       Shomi
// @match        https://trophymanager.com/matches/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trophymanager.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445913/Match%20stats%20and%20actions%2051%20minutes%20before%20match.user.js
// @updateURL https://update.greasyfork.org/scripts/445913/Match%20stats%20and%20actions%2051%20minutes%20before%20match.meta.js
// ==/UserScript==
const defaultStats = {
  goals: 0,
  shoots: {
    total: 0,
    onTarget: 0
  },
  setPieces: 0,
  penalties: 0,
  cards: {
    yellow: 0,
    red: 0
  },
  possession: 50
}
const getMatch = matchId => {
  $.get(`/ajax/match.ajax.php?id=${matchId}`, function (responseText) {
    let data = JSON.parse(responseText);
    const {report, club, lineup} = data;
    let homeTeam = JSON.parse(JSON.stringify({...defaultStats, id: club.home.id}));
    let awayTeam = JSON.parse(JSON.stringify({...defaultStats, id: club.away.id}));
    let actions = [];
    Object.keys(report)
      .reduce((chances, chance) => {
        report[chance].forEach(c => c.minute = chance)
        chances.push(...report[chance])
        return chances
      }, [])
      .forEach(chance => {
        (chance.parameters || []).forEach(parameter => {
          if (parameter.goal) {
            if (chance.club === homeTeam.id) {
              homeTeam.goals++;
              const player = lineup.home[parameter.goal.player];
              actions.push({name: 'Goal', player: player.name, minute: chance.minute})
            } else {
              awayTeam.goals++;
              const player = lineup.away[parameter.goal.player];
              actions.push({name: 'Goal', player: player.name, minute: chance.minute})
            }
          }
          if (parameter.shot) {
            if (chance.club === homeTeam.id) {
              homeTeam.shoots.total++;
              if (parameter.shot.target === 'on') homeTeam.shoots.onTarget++
            } else {
              awayTeam.shoots.total++;
              if (parameter.shot.target === 'on') awayTeam.shoots.onTarget++
            }
          }
          if (parameter.set_piece) {
            if (chance.club === homeTeam.id) homeTeam.setPieces++;
            else awayTeam.setPieces++;
          }
          if (parameter.penalty) {
            if (chance.club === homeTeam.id) homeTeam.penalties++;
            else awayTeam.penalties++;
          }
          if (parameter.yellow) {
            if (chance.club === homeTeam.id) {
              awayTeam.cards.yellow++;
              const player = lineup.away[parameter.yellow];
              actions.push({name: 'Yellow card', player: player.name, minute: chance.minute})
            } else {
              homeTeam.cards.yellow++;
              const player = lineup.home[parameter.yellow];
              actions.push({name: 'Yellow card', player: player.name, minute: chance.minute})
            }
          }
          if (parameter.red) {
            if (chance.club === homeTeam.id) {
              awayTeam.cards.red++;
              const player = lineup.away[parameter.red];
              actions.push({name: 'Red card', player: player.name, minute: chance.minute})
            } else {
              homeTeam.cards.red++;
              const player = lineup.home[parameter.red];
              actions.push({name: 'Red card', player: player.name, minute: chance.minute})
            }
          }
          if (parameter.yellow_red) {
            if (chance.club === homeTeam.id) {
              awayTeam.cards.yellow++;
              awayTeam.cards.red++;
              const player = lineup.away[parameter.red];
              actions.push({name: 'Red card', player: player.name, minute: chance.minute})
            } else {
              homeTeam.cards.yellow++;
              homeTeam.cards.red++;
              const player = lineup.home[parameter.red];
              actions.push({name: 'Red card', player: player.name, minute: chance.minute})
            }
          }
        })
      })
    setTimeout(() => {
      let html2 = `<table style="width: 400px;background-color: black;text-align: center;">
  <tr>
    <th>${club.home.club_name}</th>
    <th></th>
    <th>${club.away.club_name}</th>
  </tr>
  <tr>
    <td>${homeTeam.goals}</td>
    <td>Goals</td>
    <td>${awayTeam.goals}</td>
  </tr>
  <tr>
    <td>${homeTeam.shoots.total}</td>
    <td>Shots</td>
    <td>${awayTeam.shoots.total}</td>
  </tr>
  <tr>
    <td>${homeTeam.shoots.onTarget}</td>
    <td>Shots On Target</td>
    <td>${awayTeam.shoots.onTarget}</td>
  </tr>
  <tr>
    <td>${homeTeam.setPieces}</td>
    <td>Set Pieces</td>
    <td>${awayTeam.setPieces}</td>
  </tr>
  <tr>
    <td>${homeTeam.penalties}</td>
    <td>Penalties</td>
    <td>${awayTeam.penalties}</td>
  </tr>
  <tr>
    <td>${homeTeam.cards.yellow}</td>
    <td>Yellow Cards</td>
    <td>${awayTeam.cards.yellow}</td>
  </tr>
  <tr>
    <td>${homeTeam.cards.red}</td>
    <td>Red Cards</td>
    <td>${awayTeam.cards.red}</td>
  </tr>
  <tr>
    <td></td>
    <td>Actions</td>
    <td></td>
  </tr>`;
      actions.forEach(action => {
        html2 += `<tr style="color: ${action.name === 'Goal' ? 'green' : action.name === 'Red card' ? 'red' : 'yellow'}">
                    <td>${action.minute}'</td>
                    <td>${action.player}</td>
                    <td>${action.name}</td>
                </tr>`
      })
      html2 += '</table>'
      $('body').prepend(html2);
    }, 5000)
  })
}

(function () {
  'use strict';
  const matchId = window.location.pathname.replace('/matches/', '').replace('/', '');
  getMatch(matchId);
  // https://trophymanager.com/ajax/match.ajax.php?id=158830722&_=1653070834118
  // Your code here...

})();

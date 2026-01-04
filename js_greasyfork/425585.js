// ==UserScript==
// @name         csgostats.gg Rating 2.0
// @description  Add HLTV's Rating 2.0 to csgostats.gg match page scoreboard
// @version      1.1.1
// @author       traschke
// @namespace    https://github.com/traschke/csgostats-rating20-userscript
// @supportURL   https://github.com/traschke/csgostats-rating20-userscript/issues
// @match        https://csgostats.gg/match/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425585/csgostatsgg%20Rating%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/425585/csgostatsgg%20Rating%2020.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const tdDict = {
    name: 0,
    kills: 2,
    deaths: 3,
    assists: 4,
    adr: 7,
    kast: 33,
    rating20: 35
  }

  const scoreboardNthDict = {
    t: 1,
    ct: 3
  }

  const colorDict = {
    ratingPositive: '#597E35',
    ratingNegative: '#AB3D40'
  }

  function calcRating20 (adr, kast, kpr, dpr, impact) {
    // We're using Daves reverse engineered formula: https://flashed.gg/posts/reverse-engineering-hltv-rating/
    return (0.73 * kast) + (0.3591 * kpr) + (-0.5329 * dpr) + (0.2372 * impact) + (0.0032 * adr) + 0.1587
  }

  function getRowsTds (row) {
    return row.querySelectorAll('td')
  }

  function insertRating20ToScoreboard (row, rating20) {
    const roundedRating20 = Math.round(rating20 * 100) / 100
    const color = ((roundedRating20 >= 1.0) ? colorDict.ratingPositive : colorDict.ratingNegative)
    row.insertAdjacentHTML('beforeend', `<td class="split" style="color: ${color};" align="center">${roundedRating20}</td>`)
  }

  function insertRating20ScoreboardHeader () {
    const scoreboardHeaderRows = document.querySelectorAll('#match-scoreboard > thead > tr')
    scoreboardHeaderRows[1].insertAdjacentHTML('beforeend', '<th><span>Rating 2.0</span></th>')
  }

  function executeAdrRegex (str) {
    const regex = /(?<damage>[0-9]+) over (?<rounds>[0-9]+) rounds/g
    return regex.exec(str)
  }

  function getRoundsFromRow (row) {
    return parseInt(executeAdrRegex(getRowsTds(row)[tdDict.adr].title).groups.rounds)
  }

  function getDamageFromRow (row) {
    return parseInt(executeAdrRegex(getRowsTds(row)[tdDict.adr].title).groups.damage)
  }

  function calcSomethingPerRound (value, rounds) {
    return value * 1.0 / rounds
  }

  function getKastFromRow (row) {
    return parseFloat(getRowsTds(row)[tdDict.kast].innerText) / 100.0
  }

  function getKillsFromRow (row) {
    return getRowsTds(row)[tdDict.kills].innerText
  }

  function getDeathsFromRow (row) {
    return getRowsTds(row)[tdDict.deaths].innerText
  }

  function getAssistsFromRow (row) {
    return getRowsTds(row)[tdDict.assists].innerText
  }

  function calcImpact (kpr, apr) {
    return 2.13 * kpr + 0.42 * apr - 0.41
  }

  // eslint-disable-next-line no-unused-vars
  function getPlayerNameFromRow (row) {
    return getRowsTds(row)[tdDict.name].querySelector('a > span').innerText
  }

  function getScoreboards () {
    return document.querySelectorAll(`#match-scoreboard > tbody:nth-of-type(${scoreboardNthDict.t}), #match-scoreboard > tbody:nth-of-type(${scoreboardNthDict.ct})`)
  }

  function getPlayerRows (scoreboard) {
    return scoreboard.querySelectorAll('tr')
  }

  function sortScoreboard (scoreboard, colId, ascending = false) {
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent
    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
      v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx))

    Array.from(getPlayerRows(scoreboard))
      .sort(comparer(colId, ascending))
      .forEach(tr => scoreboard.appendChild(tr))
  }

  insertRating20ScoreboardHeader()

  getScoreboards().forEach(scoreboard => {
    getPlayerRows(scoreboard).forEach(row => {
      const rounds = getRoundsFromRow(row)
      const damage = getDamageFromRow(row)
      const adr = calcSomethingPerRound(damage, rounds)
      const kast = getKastFromRow(row)
      const kills = getKillsFromRow(row)
      const deaths = getDeathsFromRow(row)
      const assists = getAssistsFromRow(row)
      const kpr = calcSomethingPerRound(kills, rounds)
      const dpr = calcSomethingPerRound(deaths, rounds)
      const apr = calcSomethingPerRound(assists, rounds)
      const impact = calcImpact(kpr, apr)
      const rating20 = calcRating20(adr, kast, kpr, dpr, impact)
      insertRating20ToScoreboard(row, rating20)
    })
    sortScoreboard(scoreboard, tdDict.rating20, false)
  })
})()

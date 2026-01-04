// ==UserScript==
// @name         Blaseball Bet Stars
// @version      2.0
// @description  Display teams stars on blaseball.com
// @author       chrisw-b
// @match        https://blaseball.com/*
// @match        https://www.blaseball.com/*
// @license MIT
// @namespace https://greasyfork.org/users/1016522
// @downloadURL https://update.greasyfork.org/scripts/458838/Blaseball%20Bet%20Stars.user.js
// @updateURL https://update.greasyfork.org/scripts/458838/Blaseball%20Bet%20Stars.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULTS = {
    'Enable Team Stats': true,
    'Enable Pitchers': true,
    'Spillover Count': 0,
  };

  /* monorail settings integration */
  const NAMESPACE = 'Blaseball Betting Stars';

  const OPTIONS = {
    'Enable Team Stats': { defaultValue: DEFAULTS['Enable Team Stats'], type: 'checkbox' },
    'Enable Pitchers': { defaultValue: DEFAULTS['Enable Pitchers'], type: 'checkbox' },
    'Spillover Count': { defaultValue: DEFAULTS['Spillover Count'], type: 'number' },
  };

  const getOption = (option) => {
    if (document.hasOwnProperty('_BLASEBALL_USERSCRIPT_OPTIONS_GET')) {
      return document._BLASEBALL_USERSCRIPT_OPTIONS_GET(NAMESPACE, option);
    }

    return OPTIONS[option].defaultValue;
  };

  /* Useful constants */
  const TEAM_MAP = {
    SHOE: 'bfd38797-8404-4b38-8b82-341da28b1f83',
    TKO: 'c73b705c-40ad-4633-a6ed-d357ee2e2bcf',
    YELL: '7966eb04-efcc-499b-8f03-d13916330531',
    STKS: 'b024e975-1c4a-4575-8936-a3754a08806a',
    LOVE: 'b72f3061-f573-40d7-832a-5ad475bd7909',
    CMT: 'eb67ae5e-c4bf-46ca-bbbc-425cd34182ff',
    JAZZ: 'a37f9158-7f82-46bc-908c-c9e2dda7c33b',
    DALE: 'b63be8c2-576a-4d6e-8daf-814f8bcea96f',
    OHWO: 'bb4a9de5-c924-4923-a0cb-9d1445f1ee5d',
    SPY: '9debc64f-74b7-4ae1-a4d6-fce0144b6ea5',
    PIES: '23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7',
    TACO: '878c1bf6-0d21-4659-bfee-916c8314d69c',
    WAFC: 'ca3f1c8c-c025-4d8e-8eef-5be6accbeb16',
    KCBM: 'adc5b394-8f76-416d-9ce9-813706877b84',
    SEA: '105bc3ff-1320-4e37-8ef0-8d595cb95dd0',
    CDMX: '57ec08cc-0411-4643-b304-0e80dbc15ac7',
    TGRS: '747b8e4a-7e50-4638-a973-ea7950a3e739',
    MECH: '46358869-dce9-4a01-bfba-ac24fc56f57e',
    CRAB: '8d87c468-699a-47a8-b40d-cfb73a5660ad',
    ATL: 'd9f89a8a-c563-493e-9d64-78e4f9a55d4a',
    SUN: 'f02aeae2-5e6a-4098-9842-02d2273f25c7',
    FRI: '979aee4a-6d80-4863-bf1c-ee1a78e06024',
    BOS: '3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e',
    NYM: '36569151-a2fb-43c1-9df7-2df512424c82',
  };

  /* sibr api access */
  const playerMap = new Map();
  let gameData = undefined;
  let teamData = undefined;

  const fetchSibrData = async (kind, id) => {
    let data = {};
    const sibrUri = new URL('https://api2.sibr.dev/chronicler/v0/entities');
    sibrUri.searchParams.append('kind', kind);
    if (id) sibrUri.searchParams.append('id', id);

    try {
      const res = await fetch(sibrUri);
      const json = await res.json();
      data = json.items;
    } catch (e) {
      console.warn(e);
    }
    return data;
  };

  const getTeamData = async () => {
    if (teamData) return teamData;

    teamData = await fetchSibrData('team');
    return teamData;
  };

  const getGameData = async () => {
    if (gameData) return gameData;

    gameData = await fetchSibrData('game');
    return gameData;
  };

  const getPlayerData = async (id) => {
    let savedPlayer = playerMap.get(id);
    if (savedPlayer) return savedPlayer;

    const fetchedData = await fetchSibrData('player', id);
    savedPlayer = fetchedData[0].data;

    playerMap.set(id, savedPlayer);
    return savedPlayer;
  };

  /* Time calculation */
  const addHoursToDate = (date, hours) => {
    return new Date(new Date(date).setTime(date.getTime() + hours * 60 * 60 * 1000));
  };

  const getNextBlaseballStart = () => {
    const nextNoon = new Date();
    if (nextNoon.getUTCHours() >= 11) nextNoon.setUTCDate(nextNoon.getUTCDate() + 1);
    nextNoon.setUTCHours(11, 59, 0, 0);
    return nextNoon;
  };

  const getTimeUtc = (dateStr) => {
    const localDate = new Date(dateStr);
    const spilloverDate = addHoursToDate(localDate, getOption('Spillover Count') * -1);
    const nextBlaseballStart = getNextBlaseballStart();

    if (localDate < nextBlaseballStart) return spilloverDate.toISOString();
    else return localDate.toISOString();
  };

  /* Create DOM elements */
  const createStatP = (name, key, teamStats) => {
    const stat = document.createElement('p');
    const statScore = teamStats.find((stat) => stat.name === key).stars.toFixed(3);
    stat.innerHTML = `${name}: ${statScore}`;
    stat.classList.add('bet-widget__record');
    return stat;
  };

  const createPitcherP = async (pitcher, favored) => {
    const pitcherStars = pitcher.categoryRatings.find((category) => category.name === 'pitching').stars;
    const pitcherControl = pitcher.attributes.find((attr) => attr.name === 'Control').value;
    const pitcherGuile = pitcher.attributes.find((attr) => attr.name === 'Guile').value;
    const pitcherStuff = pitcher.attributes.find((attr) => attr.name === 'Stuff').value;
    const pitcherPara = document.createElement('p');
    pitcherPara.style['font-weight'] = '700';
    if (favored) {
      pitcherPara.style.color = 'var(--team-foreground)';
    } else {
      pitcherPara.style.color = '#828799';
    }
    pitcherPara.innerHTML = `${pitcher.name}: ${pitcherStars}`;
    pitcherPara.title = `Control: ${pitcherControl}, Guile: ${pitcherGuile}, Stuff: ${pitcherStuff}`;
    return pitcherPara;
  };

  /* DOM modifications */
  const addTeamStats = async (teamDataList, gameGroup) => {
    Object.keys(TEAM_MAP).map(async (abbrev) => {
      const teamStats = teamDataList.find((entry) => entry.entity_id === TEAM_MAP[abbrev]).data.categoryRatings;
      const bets = gameGroup.querySelectorAll('div.bet-widget__info');
      const betsTeam = Array.from(bets).filter((entry) => entry.innerHTML.includes(abbrev));
      betsTeam.forEach((entry) => {
        const starGrid = document.createElement('div');
        starGrid.style.display = 'grid';
        starGrid.style['grid-template-columns'] = 'repeat(2, 1fr)';
        starGrid.style['column-gap'] = '8px';

        const batting = createStatP('Bat', 'batting', teamStats);
        const defense = createStatP('Def', 'defense', teamStats);
        const running = createStatP('Run', 'running', teamStats);
        const pitching = createStatP('Pch', 'pitching', teamStats);
        starGrid.append(batting);
        starGrid.append(defense);
        starGrid.append(running);
        starGrid.append(pitching);

        entry.append(starGrid);
      });
    });
  };

  const addPitcherStats = async (gameData, gameGroup) => {
    const teamNames = Object.keys(TEAM_MAP);
    const gameTimeUtc = getTimeUtc(gameGroup.id);
    const games = gameGroup.querySelectorAll('li.bet-widget__game');
    games.forEach(async (game) => {
      const teams = game.querySelectorAll('div.bet-widget__data');
      const awayTeam = teamNames.find((name) => teams[0].innerHTML.includes(name));
      const homeTeam = teamNames.find((name) => teams[1].innerHTML.includes(name));

      const awayTeamDiv = teams[0].querySelector('div.bet-widget__info');
      const homeTeamDiv = teams[1].querySelector('div.bet-widget__info');

      if (!homeTeamDiv || !awayTeamDiv) return;

      const sibrInfo = gameData.find(
        (game) =>
          game.data.startTime === gameTimeUtc &&
          TEAM_MAP[homeTeam] === game.data.homeTeam.id &&
          TEAM_MAP[awayTeam] === game.data.awayTeam.id,
      );

      if (sibrInfo) {
        const homePitcherData = await getPlayerData(sibrInfo.data.homePitcher.id);
        const awayPitcherData = await getPlayerData(sibrInfo.data.awayPitcher.id);

        const homeFavored =
          +homePitcherData.categoryRatings.find((category) => category.name === 'pitching').stars >
          +awayPitcherData.categoryRatings.find((category) => category.name === 'pitching').stars;
        const equallyFavored =
          +homePitcherData.categoryRatings.find((category) => category.name === 'pitching').stars ===
          +awayPitcherData.categoryRatings.find((category) => category.name === 'pitching').stars;

        const homePitcher = await createPitcherP(homePitcherData, homeFavored && !equallyFavored);
        const awayPitcher = await createPitcherP(awayPitcherData, !homeFavored && !equallyFavored);

        awayTeamDiv.append(awayPitcher);
        homeTeamDiv.append(homePitcher);
      }
    });
  };

  if (document.hasOwnProperty('_BLASEBALL_USERSCRIPT_OPTIONS_REGISTER')) {
    for (const option of Object.keys(OPTIONS)) {
      const defaultValue = OPTIONS[option].defaultValue;
      const type = OPTIONS[option].type;
      document._BLASEBALL_USERSCRIPT_OPTIONS_REGISTER(NAMESPACE, option, defaultValue, type);
    }
  }

  const addData = async function (mutationsList, observer) {
    const gameData = await getGameData();
    const teamData = await getTeamData();
    mutationsList.forEach((mutation) => {
      if (mutation.type == 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.classList && node.classList.contains('hour')) {
            if (getOption('Enable Pitchers')) addPitcherStats(gameData, node);
            if (getOption('Enable Team Stats')) addTeamStats(teamData, node);
          }
        });
      }
    });
  };

  if (document.hasOwnProperty('_BLASEBALL_USERSCRIPT_REGISTER')) {
    document._BLASEBALL_USERSCRIPT_REGISTER(NAMESPACE, addData, (mutations) => document.querySelector('section.hour'));
  } else {
    const main = document.getElementsByTagName('body')[0];
    const config = { childList: true, subtree: true };
    const mutationCallback = function (mutationsList, observer) {
      addData(mutationsList);

      observer.disconnect();
      observer.observe(main, config);
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(main, config);
  }
})();

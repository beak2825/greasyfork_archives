// ==UserScript==
// @name         playmafia 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  playmafia useful scripts
// @author       Gleb
// @include      https://playmafia.pro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426738/playmafia%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/426738/playmafia%2020.meta.js
// ==/UserScript==
delete localStorage.debug;

function dragElement(e) {
  let n = 0, t = 0, o = 0, u = 0;

  function l(e) {
    (e = e || window.event).preventDefault();
    o = e.clientX;
    u = e.clientY;
    document.onmouseup = m;
    document.onmousemove = d;
  }

  function d(l) {
    (l = l || window.event).preventDefault();
    n = o - l.clientX;
    t = u - l.clientY;
    o = l.clientX;
    u = l.clientY;
    e.style.top = e.offsetTop - t + 'px';
    e.style.left = e.offsetLeft - n + 'px';
  }

  function m() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  document.getElementById(e.id + 'header') ? document.getElementById(e.id + 'header').onmousedown = l
    : e.onmousedown = l;
}

class PlaymafiaHelper {

  gameInfoUrl = 'https://het2.playmafia.pro:4243/api/game/get-game-info';
  games = {};
  gamesListUrl = '/current-games/get-current-games';
  lobbyListUrl = '/lobby/get-lobby-list';

  get favorites() {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || [];
    } catch {
      localStorage.setItem('favorites', '[]');
      return [];
    }
  }

  set favorites(value) {
    let favorites;
    try {
      favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    } catch {
      favorites = [];
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.includes(value) ? favorites.filter(e => e !== value) : [...favorites, value]));
  }

  isFavorite(e) {
    if (this.favorites.includes(e)) {
      return '★';
    } else {
      return '☆';
    }
  }

  clickFavorite() {
    const { n, t } = arguments[0];
    this.favorites = n;
    t.innerText = this.isFavorite(n);
    if (this.favorites.includes(n)) {
      t.parentElement.classList.add('favorites');
      t.closest('#gametable > tbody > tr').classList.add('favorites');
    } else {
      t.parentElement.classList.remove('favorites');
      if (!t.closest('#gametable > tbody > tr').querySelector('.favorites')) {
        t.closest('#gametable > tbody > tr').classList.remove('favorites');
      }
    }
  }

  createPlayTable = () => {
    const el = document.createElement('div');
    el.id = 'playtable';
    el.innerHTML = `<style>
        #playtable{position:absolute;z-index:9000;background-color:#121213;border:1px solid #000;color:#c4c4c4;text-align:center}
        #playtableheader{padding:10px;cursor:move;z-index:9001;background-color:#2a2a2b;color:#f9dc38;text-align:right}
        #gametable{border-collapse:collapse}#gametable>tbody>tr,#gametable>thead>tr{font-size:large;font-weight:500}
        #gametable>tbody>tr:nth-child(even){background-color:#25272f}.hidden{display:none}
        #gametable>tbody>tr>td,#gametable>thead>tr>th{padding:10px 16px}#playtableheader{font-size:large;font-weight:700}
        .toggle{display:inline-block;cursor:pointer;font-size:small;font-weight:400;position:absolute;top:5px;left:5px}
        .title{margin-left:100px}.dropdown2{position:relative;display:table-cell}
        .dropdown-content2{display:none;position:absolute;background-color:#17191f;box-shadow:0 8px 16px 0 rgba(0,0,0,.2);z-index:1;font-weight:700}
        .dropdown-content2 a{white-space:nowrap;color:#b8b9bc;padding:5px 16px 5px 5px;display:table-cell;min-width:250px}
        .dropdown-content2 td{white-space:nowrap;color:#b8b9bc;padding:5px 16px;display:table-cell;font-size:medium}
        .dropdown-content2 tr:hover{color:#000;background-color:#e9e4b2}.dropdown-content2 tr:hover td{color:#000}
        .dropdown-content2 a:hover{color:#000;background-color:#ddd}.dropdown2:hover .dropdown-content2{display:table-cell}
        .favorites{box-shadow:inset 0 0 10px #e9e4b2;}
        </style>
        <div id="playtableheader">
        <div class="toggle">Показать</div>
        <div class="title">Playmafia Helper 2.0&nbsp; <a onclick="delete localStorage.games; window.playmafiaHelper.updateTable()" title="Обновить список">↻</a></div>
        </div>

        <table id="gametable" class="hidden"><thead><tr><th>ID</th><th>Тип</th><th>День</th><th>Состав</th><th>Просмотр</th></tr></thead><tbody></tbody></table>`;

    document.body.insertAdjacentElement('afterbegin', el);
    const toggle = document.querySelector('.toggle');
    toggle.onclick = () => {
      toggle.innerText = toggle.innerText === 'Скрыть' ? 'Показать' : 'Скрыть';
      document.querySelector(`#playtable table`).classList.toggle('hidden');
    };
    dragElement(el);
  };

  getGameSocketUrl = id => {
    const body = JSON.stringify({ 'gameId': `${id}` });
    let lobbyUrlData = this.getXHR(this.gameInfoUrl, 'POST', body);
    if (!lobbyUrlData) return false;
    let lobbyUrl = JSON.parse(lobbyUrlData)?.result?.gameContainer?.socketIoUrl?.substr(8);
    if (!lobbyUrl) return false;
    return `wss://${lobbyUrl}/socket.io/?intention=view_game&userId=undefined&authKey=undefined&gameId=${id}&EIO=3&transport=websocket`;
  };

  getGames = () => {
    const parse = function(raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        return { 'result': [] };
      }
    };
    const gamesList = (parse)(this.getXHR(this.gamesListUrl)).result;
    const lobbyList = (parse)(this.getXHR(this.lobbyListUrl)).result;
    const result = {};
    gamesList.forEach(e => {
      result[e.gameId] = result[e.gameId] ? { ...result[e.gameId], ...e } : e;
    });
    lobbyList.filter(e => e.gameIsStarted || e.playerNumber === 10).forEach(e => {
      e.gameId = e.lobbyId;
      e.gameMode = 'lobby';
      e.dayNumber = 1;

      result[e.lobbyId] = result[e.lobbyId] ? { ...e, ...result[e.lobbyId] } : e;
    });
    console.log(gamesList, lobbyList, result);

    return Object.values(result);
  };

  getMode = (type) => {
    switch (type) {
      case 'lobby':
      case 'fast':
        return 'Лобби';
      case 'league':
        return 'Лига';
      case 'tournament':
        return 'Турнир';
      default:
        return type;
    }
  };

  getUserTable = user => {
    const { rating: { pmp, wp, wp_position }, nickname, id, state: { type } } = user;
    const position = (wp > 0) ? `Позиция в WP: ${(wp_position)} (${(wp)})` : '&nbsp;';
    let userState = '', title = '';
    switch (type) {
      case 'killed_by_mafia':
        userState = '💀';
        title = 'Убит мафией';
        break;
      case 'voted':
        userState = '🤚';
        title = 'Заголосован';
        break;
      case 'disqualified':
        userState = '🤬';
        title = 'Дисквалифицирован';
        break;
      case 'farewell_minute':
        userState = '✝️';
        title = 'Прощальная речь';
        break;
      case 'speech':
      case 'blaming_speech':
        userState = '💬';
        title = 'Говорит';
        break;
      case 'lost_signal':
        userState = '🔌';
        title = 'Минус интернет';
        break;
      default:
        userState = '&nbsp;';
    }
    if (id === 10) {
      userState = '⚖️';
      title = 'Судья';
    }

    return `<tr style="white-space:nowrap" class="${this.favorites.includes(nickname) ? 'favorites' : ''}">
                            <td onclick="playmafiaHelper.clickFavorite({'t':this, 'n':'${nickname}'});" style="cursor:pointer">${this.isFavorite(nickname)}</td>
                            <td>${(nickname)}</td>
                            <td title="${title}" style="cursor: pointer">${userState}</td>
                            <td>PMP: ${(pmp)}</td>
                            <td>${position}</td>
                        </tr>`;
  };

  getXHR = (url, method = 'GET', data = undefined) => {
    const xhr = new XMLHttpRequest();
    try {
      xhr.open(method, url, false);
      if (data) {
        xhr.send(data);
      } else {
        xhr.send();
      }
    } catch (e) {
      return false;
    }

    return xhr.status === 200 ? xhr.response : false;
  };

  prepareCabinet = () => {
    document.querySelector('div.userinfo > img').onclick = function() {
      this.classList.toggle('avatar');
    };
  };

  prepareUserTable(gameId) {
    if (!this.games[gameId]?.players) return;
    localStorage.setItem('games', JSON.stringify(Object.values(this.games)));
    const gameData = this.games[gameId];
    const el = document.querySelector(`#s${gameId}.dropdown2`);
    const pObject = this.processUsers(gameData);
    const playersTable = pObject.players.join('');
    el.innerHTML = `<p style="cursor:pointer">${pObject.alive}/10 ▼</p><table class="dropdown-content2">${playersTable}</table>`;
    if (playersTable.includes('★')) {
      el.closest('#gametable > tbody > tr').classList.add('favorites');
    }
  }

  prepareWatch = () => {
    const e = document.createElement('a');
    e.href = 'https://playmafia.pro/game?role=viewer&game_id=' + window.location.search.replace('?game=', '') + '&superViewer=true';
    e.click();
  };

  processUsers = gameData => {
    const users = [...Object.values(gameData.players)].sort((a, b) => a.nickname.localeCompare(b.nickname));
    const judge = users.filter(user => user.id === 10);
    const living = users.filter(user => !['killed_by_mafia', 'voted', 'disqualified'].includes(user.state.type) && user.id !== 10);
    const killed = users.filter(user => ['killed_by_mafia', 'voted', 'disqualified'].includes(user.state.type) && user.id !== 10);
    const players = [...judge, ...living, ...killed].map(this.getUserTable);
    return { alive: living.length, players: players };
  };

  updateTable = () => {
    const tableBody = document.querySelector('#playtable table tbody');
    tableBody.innerHTML = '';
    this.games = {};
    this.getGames().sort((a, b) => a.gameId - b.gameId).forEach((game) => {
      const { gameMode, gameId, dayNumber } = game;
      this.games[gameId] = game;

      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${(gameId)}</td>
                      <td>${this.getMode(gameMode)}</td>
                      <td>${(dayNumber)}</td>
                      <td id="s${(gameId)}" class="dropdown2"></td>
                      <td><a href="/watch-games?game=${(gameId)}" style="color:#f9dc38;border:none">Смотреть</a></td>`;
      tableBody.insertAdjacentElement('beforeend', tr);

      const socketUrl = this.getGameSocketUrl(gameId);
      if (!socketUrl) {
        document.querySelector(`#s${gameId}.dropdown2`).innerHTML = 'Нет данных';
        return;
      }
      let socket = new WebSocket(socketUrl);
      socket.onopen = () => socket.send(`42["connect_room",{"role":"viewer","gameId":${gameId},"userId":null}]`);
      socket.onmessage = event => {
        if (event.data.includes('on_detailed_game_state')) try {
          const playersData = JSON.parse(event.data.substr(2))[1]['players'];
          let players = {};
          playersData.forEach(player => players[player.id] = player);
          this.games[gameId].players = players;
        } finally {
          socket.close();
          this.prepareUserTable(gameId);
        }
      };
    });
  };
}

function change() {
  if (window.location.pathname === '/game') return;
  if (!window.playmafiaHelper) window.playmafiaHelper = new PlaymafiaHelper();
  if (!document.querySelector('#playtable')) window.playmafiaHelper.createPlayTable();
  window.playmafiaHelper.updateTable();

  if (window.location.pathname.includes('/watch-games') && window.location.search.includes('?game=')) {
    window.playmafiaHelper.prepareWatch();
  }

  if (window.location.pathname.includes('/cabinet')) {
    window.playmafiaHelper.prepareCabinet();
  }
}

change();
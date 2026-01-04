// ==UserScript==
// @name         TW Achivement Point Ranking
// @namespace    n3mesis
// @version      0.1
// @description  create a achivement points ranking
// @author       n3mesis
// @include      http*://*.the-west.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454248/TW%20Achivement%20Point%20Ranking.user.js
// @updateURL https://update.greasyfork.org/scripts/454248/TW%20Achivement%20Point%20Ranking.meta.js
// ==/UserScript==
 
(function (code) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + code + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  N3R = {
    window: null,
    table: null,
    achvptslist: [],
    last: null,
    allPlayers: null,
    rows: {
      list: { name: 'Get Playerlist' },
      players: { name: 'Load achivement points' },
      localStorage: { name: 'Safe ranking in local storage' },
    },
  };
 
  function progbar(row) {
    N3R.rows[row].progbar.getMainDiv().show();
    return N3R.rows[row].progbar;
  }
 
  async function getallplayers() {
    const resp = await fetch(
      location.href.split('#')[0] +
        '?window=ranking&mode=get_data',
      {
        credentials: 'include',
        headers: {
          'User-Agent': navigator.userAgent,
          'Accept':
            'application/json, text/javascript, */*; q=0.01',
          'Content-Type':
            'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
        },
        referrer: location.href.split('#')[0],
        body: 'page=0&tab=experience&entries_per_page=50000',
        method: 'POST',
        mode: 'cors',
      }
    );
    return await resp.json();
  }
 
  const getplayerdata = (player_id) =>
    new Promise((resolve, reject) => {
      Ajax.remoteCallMode(
        'profile',
        'init',
        { playerId: player_id },
        function (player_id) {
          if (player_id.error) reject(player_id.error);
          else resolve(player_id);
        }
      );
    });
 
  async function importDoIt(m) {
    progbar('list').setMaxValue(1);
    N3R.allPlayers = await getallplayers();
    let max = m
      ? Math.min(m, N3R.allPlayers.ranking.length)
      : N3R.allPlayers.ranking.length;
    progbar('list').increase(1);
    N3R.achvptslist = [];
    progbar('players').setMaxValue(max);
    progbar('localStorage').setMaxValue(1);
    await getPoints(max);
    N3R.achvptslist = N3R.achvptslist.sort(
      (a, b) => b.achvpoints - a.achvpoints
    );
    saveRanking();
    N3R.last = timeConv(new Date().valueOf());
    progbar('localStorage').increase(1);
  }
 
  async function getPoints(max) {
    let i = 0;
    for (const val of N3R.allPlayers.ranking) {
      if (i >= max) return;
      let playerdata = await getplayerdata(val.player_id);
      N3R.achvptslist.push({
        name: val.name,
        player_id: val.player_id,
        achvpoints: playerdata.achvpoints,
      });
      progbar('players').increase(1);
      i++;
    }
  }
 
  function applyCss() {
    if (!document.getElementById('N3Rstyle')) {
      const css =
        '.n3_rank{width:15%;margin-left:10px}.n3_name{width:45%}.n3_achivement_points{width:30%}.n3_innerwnd{width:540px;position:absolute;margin-left:5px;top:2px;}.n3_row{width:170px;margin-left:10px}.n3_progress{text-align:center;width:330px;}';
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = 'N3Rstyle';
      document.head.appendChild(style);
    }
  }
 
  function openImportWindow() {
    N3R.window = wman
      .open('n3mesis_achvlist', 'Load Achivement Points Ranking', 'noreload nocloseall'
      )
      .setSize(600, 320)
      .setMiniTitle('N3R');
    N3R.table = new west.gui.Table(true)
      .appendTo(
        $('<div class="n3_innerwnd"></div>')
          .appendTo(N3R.window.getContentPane())
      )
      .addColumns(['n3_row', 'n3_progress'])
      .appendToCell('head', 'n3_row', 'task')
      .appendToCell('head', 'n3_progress', 'progress');
    for (var row in N3R.rows) {
      N3R.table
        .appendRow()
        .appendToCell(-1, 'n3_row', N3R.rows[row].name)
        .appendToCell(-1, 'n3_progress',
          (N3R.rows[row].progbar = new west.gui.Progressbar(0, 0))
            .getMainDiv()
            .hide()
        );
    }
  }
 
  function openRankingWindow() {
    const content = $('<div style="padding:10px;"></div>');
 
    N3R.table = new west.gui.Table();
    N3R.table
      .addColumn('n3_rank', 'rank')
      .addColumn('n3_name', 'name')
      .addColumn('n3_achivement_points', 'achivement_points')
      .appendToCell('head', 'n3_rank', 'Rank')
      .appendToCell('head', 'n3_name', 'Name')
      .appendToCell('head', 'n3_achivement_points', 'Achivement points')
      .bodyscroll.divMain.style.height = '262px';
 
    for (i = 0; i < N3R.achvptslist.length; i++) {
      const val = N3R.achvptslist[i];
      const player = '<a href="javascript:PlayerProfileWindow.open(' + val.player_id + ');">' + val.name + '</a>';
      const points = '<a href="javascript:AchievementWindow.open(' + val.player_id + ');">' + val.achvpoints + '</a>';
      N3R.table
        .appendRow()
        .appendToCell(-1, 'n3_rank', i + 1)
        .appendToCell(-1, 'n3_name', player)
        .appendToCell(-1, 'n3_achivement_points', points);
    }
 
    const update = new west.gui.Button('Update Ranking');
    update.click(async function () {
      openImportWindow();
      await importDoIt();
      openRankingWindow();
    });
 
    const partly = new west.gui.Button('Update partly');
    partly.setTooltip(
      'Update the ranking, but only with the top exp players. So the progress is faster.'
    );
    partly.click(async function () {
      let top = parseInt(
        prompt('How many players should be loaded?')
      );
      if (!top || isNaN(top)) {
        return;
      }
      openImportWindow();
      await importDoIt(top);
      openRankingWindow();
    });
    const partlyhtml = $(
      '<div style="display: inline-block"></div>'
    );
    partlyhtml.html(partly.getMainDiv());
 
    const search = new west.gui.Textfield();
    search
      .addKeyUpListener(function () {
        let input = search.getValue();
        tableSearch(input);
      })
      .setPlaceholder('Playername');
 
    content.append(N3R.table.getMainDiv());
    content.append(update.getMainDiv());
    content.append(partlyhtml);
    content.append(search.getMainDiv());
    content.append(
      '<div style="color:green;margin-top:8px;">Last import: ' + (N3R.last != null ? N3R.last : ' never imported') + '</div>'
    );
 
    N3R.window = wman
      .open('n3mesis_achvlist', 'Achivement Points Ranking', 'noreload')
      .setSize(550, 493)
      .setMiniTitle('N3R')
      .appendToContentPane(content);
  }
 
  function saveRanking() {
    localStorage.setItem(
      'N3RRanking',
      JSON.stringify({
        date: new Date().valueOf(),
        ranking: N3R.achvptslist,
      })
    );
  }
 
  function loadRanking() {
    if (localStorage.getItem('N3RRanking')) {
      const storage = JSON.parse(
        localStorage.getItem('N3RRanking')
      );
      N3R.last = timeConv(storage.date);
      N3R.achvptslist = storage.ranking;
    } else {
      return false;
    }
  }
 
  function timeConv(timestamp) {
    let t = new Date(timestamp);
    let year = t.getFullYear();
    let month = t.getMonth() + 1;
    let date = t.getDate();
    let hour = t.getHours();
    let min = t.getMinutes().toString().padStart(2, '0');
    let time = hour + ':' + min + '  ' + date + '.' + month + '.' + year;
    return time;
  }
 
  function createN3RButton() {
    var icon = $('<div></div>')
      .attr({
        class: 'menulink',
        title: 'Achivement Ranking',
      })
      .css({
        'background':
          "url('data:image/jpeg;base64,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')",
        'background-position': '0px 0px',
      })
      .mouseleave(function () {
        $(this).css('background-position', '0px 0px');
      })
      .mouseenter(function (e) {
        $(this).css('background-position', '25px 0px');
      })
      .click(function () {
        start();
      });
    var bottom = $('<div></div>').attr({
      class: 'menucontainer_bottom',
    });
    $('#ui_menubar .ui_menucontainer:last').after(
      $('<div></div>')
        .attr({
          class: 'ui_menucontainer',
          id: 'N3R',
        })
        .append(icon)
        .append(bottom)
    );
  }
 
  function tableSearch(input) {
    for (i = 0; i < N3R.achvptslist.length; i++) {
      if (N3R.achvptslist[i].name.toLowerCase().includes(input.toLowerCase())) {
          N3R.table.rows[i].show();
      } else {
          N3R.table.rows[i].hide();
      }
    }
  }
 
  function start() {
    applyCss();
    loadRanking();
    openRankingWindow();
  }
 
  createN3RButton();
});
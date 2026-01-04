// ==UserScript==
// @name         TW Duel+
// @namespace    Johnny
// @author       Johnny
// @version      1.4
// @description  List of players for dueling (with dueling level, XP and distance) for The West Classic
// @match        https://classic.the-west.net/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31696/TW%20Duel%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/31696/TW%20Duel%2B.meta.js
// ==/UserScript==

window.DuelPlus = {
  windowName: 'DuelPlus',
  players: [],

  init: function() {
    DuelPlus.addCss();

    DuelPlus.initDuelMotivation();
    DuelPlus.updateDuelMotivation();
    setInterval(DuelPlus.updateDuelMotivation, 5000);

    let val = setInterval(function() {
      if (Object.keys(WMap.mapData.towns.obj).length !== 0) {
        clearInterval(val);
        DuelPlus.getData();
        DuelPlus.addMenuButton();
      }
    }, 500);
  },

  addCss: function() {
    let barTopPosition = 3;
    let barLeftPosition = 135;
    let healthBarStyle = window.getComputedStyle(document.getElementById('health_bar'));
    if (healthBarStyle.getPropertyValue('left') === '201px') {
      barTopPosition = 0;
      barLeftPosition = 201;
    }

    let css = '\
      #menu_duel_plus a { background: url("data:image/png;base64,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"); cursor: pointer; } \
      #window_' + DuelPlus.windowName + '_content { overflow-y: auto; } \
      #duel_motivation_bar { position: absolute; top: ' + barTopPosition + 'px; left: ' + barLeftPosition + 'px; width: 104px; height: 18px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAASCAMAAACAe2s0AAABOFBMVEVaWlpIR0ZGRkZSUlJYWFhKSkpPSUNNTU1RUVFOTk4sJiIzLCdhXFdEREQxKyZCQkIzLSc1NTUvKSQ1Lyk7Ojo4ODhbVVBlYFtYUkw8PDxHQDtCOzY4MSslIBw9PT0xMTFoYl5PS0dAQEA+ODIrJiErJSEpJB9+enZfWVVLRUA3NzfBbzF0TjGjXSkhHRoeGheIhIF1cGxwamZrZmJoXFJeV1FSTUlFQ0FLRD1FPji1aC2tYyuFTSMZFhN6dnKcd1x7alyqe1hvYVfNhEu/ekZtVEBiTT2eZTtuTjWEVjSKVzKRWS88NS+fXSubWiqZWCaQjImpgWOMbljBhFewfFR1YlSreVOLaVB+YUxkVUmobkJVSkFaSz/Kez53Vj1JQj3CdjyXYjq9bC+jYS+nYCqTVCWRVCV6RyDfEOENAAABo0lEQVQ4y7XVx3KrMBgFYOHYyr2AhZBMMRgwprh3O+7pvd7ee0ne/w0CxslMFlkl+ha/dLQ5mtFC4FVns6d7FPkBwQUDPt1Gpd8tl3ua6larSdaKmnoOysUq5a1We7Fot6yAf7r4vrpuUkR4f5W9sYlB0eQYKBAH7ryXE47jUB6odI0BLOy+/vPbzsdyiuxQHxg8YIDwW3uzEze7lFccHALTTzEgWIPv/+aHSVEpL9MAjEmKAY8f7U///3DV7R0xK9nyhACIMgxAlNuqNy++vN2bfUpJdg2iqGidAYhq27P5zWW9fnVyX/SCAYiUwd/G4deDevOU44bVZdEaA1FRdriRyej70+bRu18foyIdpxkYUqWUjd5q/cPV/GLaPNUFIHoglgYr6bvx+HH64fbhTJauERXF3pw1js+uG7sYaD85BjZhzZZinDuSDi6PBwJQJy8Z6BuyYpekpdLoqDH2ATQBA6ony0puRfn8jVqggOlE73U65W5frIjPQCtWoElJ/FuoSVZNHLYBCQJUMETNPacCEp4BxoQPrVbLCnm0yqHVXtwCv3pQaiNJDV0AAAAASUVORK5CYII="); } \
      #duel_motivation_filler { position: absolute; top: 2px; left: 2px; width: 1px; height: 14px; font-size: 1px; background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAOBAMAAAAcbWtvAAAAGFBMVEXCaiiXUh+vYCSdViC8ZyezYiWpXSOkWiKTt/PhAAAAIElEQVQI12MQYFBgYGAQAEIDhgIgO4DBgYEByE5gYAAAGowCMXxR6jQAAAAASUVORK5CYII="); } \
      #health_bar { top: ' + (barTopPosition + 18) + 'px !important; } \
      #energy_bar { top: ' + (barTopPosition + 18 * 2) + 'px !important; } \
      #experience_bar { top: ' + (barTopPosition + 18 * 3) + 'px !important; } \
    ';
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.getElementsByTagName('head')[0].appendChild(style);
  },

  addMenuButton: function() {
    let button = document.createElement('li');
    button.id = 'menu_duel_plus';
    let buttonLink = document.createElement('a');
    buttonLink.onclick = DuelPlus.openWindow;
    button.appendChild(buttonLink);
    let duelMenu = document.getElementById('menu_duel');
    duelMenu.parentNode.insertBefore(button, duelMenu.nextSibling);
  },

  initDuelMotivation: function() {
    document.getElementById('health_bar').insertAdjacentHTML('beforebegin', '<div id="duel_motivation_bar"><div id="duel_motivation_filler"></div></div>');
    DuelPlus.duelMotivationPopup = new MousePopup('', 250,{opacity: 0.9});
    document.getElementById('duel_motivation_bar').addMousePopup(DuelPlus.duelMotivationPopup);
  },

  updateDuelMotivation: function() {
    new Ajax('game.php?window=ranking&mode=ajax_cities', {
      method: 'post',
      data: {type: 'cities', page: 0, skill: false, search: false, rank: false, action: 'refresh'},
      onComplete: function(data) {
        data = Json.evaluate(data);
        if (data.page) {
          let tmp = document.createElement('div');
          tmp.innerHTML = data.page;
          let firstTown = tmp.querySelector('#ranking_table tr:nth-child(2) td:nth-child(2) a');
          if (firstTown) {
            let townId = firstTown.href.substring(firstTown.href.lastIndexOf('id:') + 3, firstTown.href.lastIndexOf('}'));
            new Ajax('game.php?window=building_saloon&town_id=' + townId, {
              method: 'post',
              onComplete: function(data2) {
                data2 = Json.evaluate(data2);
                if (data2.page) {
                  let tmp2 = document.createElement('div');
                  tmp2.innerHTML = data2.page;
                  let motivation = tmp2.querySelector('.bar_perc');
                  if (motivation) {
                    motivation = parseInt(motivation.textContent);
                    DuelPlus.duelMotivationPopup.setXHTML('<b>Duel motivation: </b>' + motivation + '%');
                    let filler = document.getElementById('duel_motivation_filler');
                    filler.style.width = motivation / 100 * 84 + 'px';
                  }
                }
              }
            }).request();
          }
        }
      }
    }).request();
  },

  openWindow: function() {
    if (!AjaxWindow.windows[DuelPlus.windowName]) {
      let win = new Element('div', {
        'id': 'window_' + DuelPlus.windowName,
        'class': 'window'
      });

      AjaxWindow.windows[DuelPlus.windowName] = win;

      let html = '\
        <div class="window_borders"> \
        <h2 id="window_' + DuelPlus.windowName + '_title" class="window_title"></h2> \
        <a href="javascript:AjaxWindow.closeAll();" class="window_closeall"></a><a href="javascript:AjaxWindow.toggleSize(\'' + DuelPlus.windowName + '\');" class="window_minimize"></a><a href="javascript:AjaxWindow.close(\'' + DuelPlus.windowName + '\');" class="window_close"></a> \
        <div id="window_' + DuelPlus.windowName + '_content" class="window_content"></div> \
        </div> \
      ';
      win.setHTML(html);
      win.bringToTop();
      win.injectInside('windows');
      win.centerLeft();

      let win_title = $('window_' + DuelPlus.windowName + '_title');
      win_title.addEvent('dblclick', function () {
        win.centerLeft();
        win.setStyle('top', 133);
      });
      win.makeDraggable({
        handle: win_title,
        onStart: function () {
        },
        onComplete: function () {
        }.bind(AjaxWindow)
      });
      win.addEvent('mousedown', win.bringToTop.bind(win, []));
      win_title.addEvent('mousedown', win.bringToTop.bind(win, []));

      let win_content = $('window_' + DuelPlus.windowName + '_content');
      DuelPlus.clear(win_content);
      win_content.appendChild(DuelPlus.getPlayers());
    } else {
      AjaxWindow.maximize(DuelPlus.windowName);
      AjaxWindow.windows[DuelPlus.windowName].bringToTop();
    }
  },

  getPlayers: function() {
    DuelPlus.players.sort(function(a, b) {
      return b.xp - a.xp;
    });

    let table = document.createElement('table');
    table.className = 'saloon_duel_table';
    let th = document.createElement('tr');
    th.innerHTML = '\
      <th style="width:200px;">Character name</th> \
      <th style="width:75px;">Dueling level</th> \
      <th style="width:75px;">Experience</th> \
      <th style="width:218px;">Duel</th> \
      <th style="width:75px;">Distance</th> \
    ';
    table.appendChild(th);

    for (let player of DuelPlus.players) {
    	if (player.xp > 0) {
	      let row = document.createElement('tr');
	      let td1 = document.createElement('td');
	      td1.innerHTML = player.player;
	      row.appendChild(td1);
	      let td2 = document.createElement('td');
	      td2.innerHTML = player.lvl;
	      td2.className = 'center';
	      row.appendChild(td2);
	      let td3 = document.createElement('td');
	      td3.innerHTML = player.xp;
	      td3.className = 'center';
	      row.appendChild(td3);
	      let td4 = document.createElement('td');
	      td4.innerHTML = player.duel;
	      row.appendChild(td4);
	      let td5 = document.createElement('td');
	      td5.innerHTML = player.way_time.formatDuration();
	      td5.className = 'center';
	      row.appendChild(td5);
	      table.appendChild(row);
	    }
    }

    return table;
  },

  getData: function() {
    WMap.mapData.towns.each(function(town) {
      if (town.town) {
        let way_time = WMap.calcWayTime(Tasks.last_pos, town);
        let townId = town.town.town_id;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
            let data = JSON.parse(xhr.responseText || '{}');
            if (data.page) {
              let html = document.createElement('div');
              html.innerHTML = data.page;
              let rows = html.querySelectorAll('.saloon_duel_table tr:not(:first-child)');
              for (let row of rows) {
                let columns = row.querySelectorAll('td');
                DuelPlus.players.push({
                  player: columns[0].innerHTML,
                  lvl: parseInt(columns[1].innerHTML, 10),
                  xp: parseInt(columns[2].innerHTML, 10),
                  duel: columns[3].innerHTML,
                  way_time: way_time,
                });
              }
            }
          }
        };
        xhr.open('POST', 'game.php?window=building_saloon&town_id=' + townId, true);
        xhr.send();
      }
    });
  },

  clear: function(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  },
};

DuelPlus.init();
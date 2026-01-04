// ==UserScript==
// @name         TW Trader
// @namespace    Johnny
// @author       Johnny
// @version      1.1
// @description  Finding items in towns for The West Classic
// @match        https://classic.the-west.net/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31695/TW%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/31695/TW%20Trader.meta.js
// ==/UserScript==

window.TWTrader = {
  towns: {},
  items: [],
  buildings: ['tailor', 'gunsmith', 'general'],

  windowName: 'TWTrader',

  init: function() {
    let val = setInterval(function() {
      if (Object.keys(WMap.mapData.towns.obj).length !== 0) {
        clearInterval(val);
        TWTrader.getData();
        TWTrader.addMenuButton();
      }
    }, 500);
  },

  addMenuButton: function() {
    let button = document.createElement('li');
    button.id = 'menu_quests_plus';
    let buttonLink = document.createElement('a');
    buttonLink.onclick = TWTrader.openWindow;
    buttonLink.innerHTML = '<span>Quests+</span>';
    buttonLink.style.cursor = 'pointer';
    buttonLink.style.background = 'url("data:image/png;base64,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")';
    button.appendChild(buttonLink);
    document.getElementById('right_menu').appendChild(button);
  },

  openWindow: function() {
    if (!AjaxWindow.windows[TWTrader.windowName]) {
      let win = new Element('div', {
        'id': 'window_' + TWTrader.windowName,
        'class': 'window'
      });

      AjaxWindow.windows[TWTrader.windowName] = win;

      let html = '\
        <div class="window_borders"> \
        <h2 id="window_' + TWTrader.windowName + '_title" class="window_title"><span>Quests+</span></h2> \
        <a href="javascript:AjaxWindow.closeAll();" class="window_closeall"></a><a href="javascript:AjaxWindow.toggleSize(\'' + TWTrader.windowName + '\');" class="window_minimize"></a><a href="javascript:AjaxWindow.close(\'' + TWTrader.windowName + '\');" class="window_close"></a> \
        <div id="window_' + TWTrader.windowName + '_content" class="window_content"></div> \
        </div> \
      ';
      win.setHTML(html);
      win.bringToTop();
      win.injectInside('windows');
      win.centerLeft();

      let win_title = $('window_' + TWTrader.windowName + '_title');
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

      let win_content = $('window_' + TWTrader.windowName + '_content');
      win_content.style.overflowY = 'auto';
      TWTrader.clear(win_content);
      win_content.appendChild(TWTrader.getItems());
    } else {
      AjaxWindow.maximize(TWTrader.windowName);
      AjaxWindow.windows[TWTrader.windowName].bringToTop();
    }
  },

  getItems: function() {
    let wrap = document.createElement('div');
    wrap.style.textAlign = 'center';

    let towns_div = document.createElement('div');
    towns_div.id = TWTrader.windowName + '_towns';
    towns_div.style.marginBottom = '10px';
    wrap.appendChild(towns_div);

    for (let item of TWTrader.items) {
      if (item) {
        let item_div = new Item(item, true).get_bag_el();
        item_div.style.cursor = 'pointer';
        item_div.style.float = 'none';
        item_div.style.display = 'inline-block';
        item_div.addEventListener('click', function() {
          TWTrader.renderTowns(item.towns);
        }, false);
        wrap.appendChild(item_div);
      }
    }

    return wrap;
  },

  renderTowns: function(towns) {
    let sortedTowns = [];
    for (let town of towns) {
      sortedTowns.push({
        id: town,
        name: TWTrader.towns[town].name,
        way_time: TWTrader.towns[town].way_time
      });
    }
    sortedTowns.sort(function(a, b) {
      return a.way_time - b.way_time;
    });

    let towns_div = document.getElementById(TWTrader.windowName + '_towns');
    TWTrader.clear(towns_div);
    for (let town of sortedTowns) {
      let town_div = document.createElement('div');
      town_div.className = 'questlog_header';
      town_div.style.width = 'auto';
      town_div.style.margin = '0 0 -1px';
      town_div.innerHTML = '<a href="javascript:AjaxWindow.show(\'town\',{town_id:' + town.id + '});">' + town.name + '</a> (distance: ' + town.way_time.formatDuration() + ')';
      towns_div.appendChild(town_div);
    }
  },

  getData: function() {
    WMap.mapData.towns.each(function(town) {
      if (town.town) {
        let way_time = WMap.calcWayTime(Tasks.last_pos, town);
        TWTrader.towns[town.town.town_id] = {
          name: town.town.name,
          way_time: way_time
        };

        let townId = town.town.town_id;
        for (let i = 0; i < TWTrader.buildings.length; i++) {
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200) {
              let data = JSON.parse(xhr.responseText || '{}');
              if (data.js && data.page) {
                let townStart = data.page.indexOf('town_id: ') + 9;
                let townStr = data.page.substring(townStart, data.page.indexOf('<', townStart)).split('});">');
                let townId = townStr[0];

                let itemsStart = data.js.indexOf('var trader_inv = ') + 17;
                let itemsStr = data.js.substring(itemsStart, data.js.indexOf('];', itemsStart) + 1);
                let items = JSON.parse(itemsStr);
                for (let i = 0; i < items.length; i++) {
                  let itemId = items[i].item_id;
                  if (!TWTrader.items[itemId]) {
                    TWTrader.items[itemId] = items[i];
                    TWTrader.items[itemId].towns = [townId];
                  } else {
                    TWTrader.items[itemId].towns.push(townId);
                  }
                }
              }
            }
          };
          xhr.open('POST', 'game.php?window=building_' + TWTrader.buildings[i] + '&town_id=' + townId, true);
          xhr.send();
        }
      }
    });
  },

  clear: function(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  },
};

TWTrader.init();
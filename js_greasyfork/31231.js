// ==UserScript==
// @name         TW Ranking+
// @namespace    Johnny
// @author       Johnny
// @version      1.6
// @description  Extended Ranking for The West Classic
// @match        https://classic.the-west.net/game.php*
// @connect      107.170.27.137
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/31231/TW%20Ranking%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/31231/TW%20Ranking%2B.meta.js
// ==/UserScript==

(function() {
  let towns = [];
  let lastModified = 0;
  let windowName = 'RankingPlus';

  let style = '\
    #menu_ranking_plus a { background: url("data:image/png;base64,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"); cursor: pointer; } \
    #window_' + windowName + '_title { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAAAZCAMAAAAc2dwqAAAAyVBMVEUAAAAsFA4rEg8uFRHt6uEwFw4vFxM8KiRALii8tq+akoxQNzPk4NgxGRNUOzZYPzpPNjE+LCVJMSxNNC/QzMReRT9ELylDKiWBd3I0GxZSOjQ9JB/GwblaQT1WPTmmn5hjS0ZtVE9kWFNIMCra1s2Rg3xpUUpFMy04IBtURkFAKyY1HhiBd3F6YlxhSEJALSZAKCPWzsOAbGXGvLKyq6OgkYlzaGOsoJaMe3NkV1NKOjKuoZinmZCaiYGJd2+Nb1llWFRjWFPJv7bBkC4lAAAAAXRSTlMAQObYZgAABItJREFUSMeVVgl7ojAQDQmySIAoKCiIhXrU1tVW2+59//8ftTMhcjX47T5bDZNh3sscKHl8sG377ottR/D55c4GPI7HaLuzoyiyHx4fHuxH2x6/KzHGzXcKsL4bAx7H8s7Whrpo2f43MAmeqGEY9AKjQn0Fn7QJo+OrM/f61c5dGqOjY/ewI7nPqA7tWIqy/mfwqsA05q6htiG64TXw0iAm+TT1UPN1gEdDChsMKk6tWe9Xrem/EKZxEJCRP4rnzJD8zVRpclkbkYGxgQJjb806P2XS5KpDjn9efMwD8nPqc8yehIxXhaiMLdSu9JIJjVnrp49UHbz0Vkj54fCTkNOnJEr3HmNVAdSyWz+0OKbE4h635G7lRGfmpIw9NB1m6MC01VVsTQEG24nt9xNBvE5FlHryDK1I3frBLqpDrJvJVQtQZ1zUKXO7Y6lrftZUV3E1Us28XbD9RhQ+Cr7aSR9WT+fbzIHFMYewunfND40sqFF8D+raqOZRrV3zVobR5hAXSoOVBtlHUuHjkqeWlMQougwMpskcGEAdxpmYM3q/gBwOIxDlOlhrmbtb15zJ3N2Yw6Epj7JxzYVjTjCga/5iSqkuh1DkgZS7j/lX0sDrMtxZ5X2q9G86Wq5KdaDhAyhEvLCZakXsu/s1CKOlOgkHxANcEA5i5bJv1mr23cp/JS1slmEK8hhV6e2trNJStviLOUR6B1S7kLs1ijNU7txbuoCzLEC3PWmo05UUwTAFSLn3p99JB+djAq2HLwS66yuLmDgUMLsBQlCHhB+kOkCtbigzbUCpqbExJ3g/ToV2LAzFiq85Lzaki9Mhf7IMVj3lWW9lP69lPy3Mm983F3W3pbqJuaZSHYUdSi/qKKijUt2trqQDyaao98HxfCJv8Lz190b9xXil72BkHcyWbU/a6tbQcjeq78ARvRlU1oiwskyq080q2irmNN8+Ew1e82APp0CXQV/jIR9qNH/dl92+GMxMlyl1E3jWuFFVWZm7mZoKKqEvrGJkwO7F4hvRYX2eRh6Vqpj2YVzNrLEAIRuYjd9SlEvpRR2qavcdtuqLg1uU9s0qsCERbu7885po8XycrixVTKovrUqoXCiTOnkT9QY2IWQThpf1fpPhhaKwUv/4THrwqcifqvupRp1KaFdE5dLUp8gd9eDTVrbWp0YiKT6RXmwOxZ6Wh+y+s4HSCKiqbvSjGn/Hhb5zwL86rOxtDQudj7Yb0o8/h+2KdUrU/YXcukLozP1+7YC0dZ70WDyTK9hAbTu/UmQ/eBZjFmvA8jzPsuZzdNKYNX6tPlNxFY+CFxc/yDW8FJmw1IHKBpF3Q3gLWFCkpYCs3nyOVdKZdX6NlFFr7uGJkaWiS/38K7mG0/mwDXnCl8epP+J+IjIe+jzCpZ+Eo4T7mVhmS87DIPTDOI1Xq+hJZ9b6BQH3l8ssEwmfbosin+b5kidLwYMROCfFoTiRq/ixzYIkCbnIhMh8XwgecsAo4Hz1FMdxOAo5sIz4yBegX0wBOrPOj4dRnIgkDIIoEBmYhIC9EA49igJfcJGfSRt/AdMtYsYMrQ/3AAAAAElFTkSuQmCC"); } \
    #window_' + windowName + '_content { overflow-y: scroll; } \
    #window_' + windowName + '_content #ranking_table th { cursor: pointer; font-size: 9px; } \
    #window_' + windowName + '_content #ranking_table td { padding: 0; text-align: center; vertical-align: middle; } \
    #window_' + windowName + '_content #ranking_table .green { font-weight: bold; background: green !important; color: white; } \
    #window_' + windowName + '_content #ranking_table .red { font-weight: bold; background: darkred !important; color: white; } \
  ';
  GM_addStyle(style);

  GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://107.170.27.137/data.json?' + new Date().getTime(),
    onload: function(resp) {
      towns = JSON.parse(resp.responseText);

      let start = resp.responseHeaders.indexOf('Last-Modified:') + 14;
      lastModified = resp.responseHeaders.substring(start, resp.responseHeaders.indexOf('\n', start)) || 0;
    }
  });

  let button = document.createElement('li');
  button.id = 'menu_ranking_plus';
  let buttonLink = document.createElement('a');
  buttonLink.onclick = openWindow;
  buttonLink.innerHTML = '<span>Ranking+</span>';
  button.appendChild(buttonLink);
  let rankingMenu = document.getElementById('menu_ranking');
  rankingMenu.parentNode.insertBefore(button, rankingMenu.nextSibling);

  function openWindow() {
    if (!unsafeWindow.AjaxWindow.windows[windowName]) {
      let win = document.createElement('div');
      win.id = 'window_' + windowName;
      win.className = 'window';

      unsafeWindow.AjaxWindow.windows[windowName] = win;

      let html = '\
        <div class="window_borders"> \
        <h2 id="window_' + windowName + '_title" class="window_title"><span>Ranking+</span></h2> \
        <a href="javascript:AjaxWindow.closeAll();" class="window_closeall"></a><a href="javascript:AjaxWindow.toggleSize(\'' + windowName + '\');" class="window_minimize"></a><a href="javascript:AjaxWindow.close(\'' + windowName + '\');" class="window_close"></a> \
        <div id="window_' + windowName + '_content" class="window_content"></div> \
        </div> \
      ';
      win.innerHTML = html;
      win.style.zIndex = ++unsafeWindow.lastIndex;
      win.style.left = window.innerWidth / 2 - 365.5 + 'px';
      document.getElementById('windows').appendChild(win);

      unsafeWindow.AjaxWindow.windows[windowName].makeDraggable();

      win.addEventListener('mousedown', function() {
        win.style.zIndex = ++unsafeWindow.lastIndex;
      }.bind(win), false);

      printSortedTowns('allDuels');
    } else {
      unsafeWindow.AjaxWindow.windows[windowName] = 'block';
      unsafeWindow.AjaxWindow.windows[windowName] = ++unsafeWindow.lastIndex;
    }
  }

  function printSortedTowns(method) {
    towns.sort(function(a, b) {
      if (method === 'name') {
        return (a[method] > b[method]) ? 1 : ((b[method] > a[method]) ? -1 : 0);
      }
      return b[method] - a[method];
    });

    let win_content = document.getElementById('window_' + windowName + '_content');
    clear(win_content);
    win_content.appendChild(renderWindowContent());
  }

  function renderWindowContent() {
    let wrapper = document.createElement('div');

    let updateTime = document.createElement('div');
    updateTime.style.marginBottom = '5px';
    let date = new Date(lastModified);
    updateTime.innerHTML = 'Last update: ' + date.toLocaleString();

    let table = document.createElement('table');
    table.id = 'ranking_table';

    let trH = document.createElement('tr');
    let headers = ['Town', 'All duels', 'Duels won', 'Duels lost', 'Diff', 'KO opponents', 'KO members', 'Highest counting hit in a duel', 'Best dueller of the town', 'Best duelling opponent'];
    let headersObj = ['name', 'allDuels', 'duelsWon', 'duelsLost', 'diff', 'koOpponents', 'koMembers', 'bestDmg', 'bestTownDmg', 'bestOpponentDmg'];
    for (let i = 0; i < headers.length; i++) {
      let th = document.createElement('th');
      th.innerHTML = headers[i];
      th.dataset.obj = headersObj[i];
      th.addEventListener('click', function() {
        printSortedTowns(this.dataset.obj);
      }, false);
      trH.appendChild(th);
    }
    table.appendChild(trH);

    for (let j = 0; j < towns.length; j++) {
      let town = towns[j];
      let tr = document.createElement('tr');

      let td1 = document.createElement('td');
      td1.innerHTML = town.town;
      tr.appendChild(td1);

      let td2 = document.createElement('td');
      td2.className = 'bold';
      td2.innerHTML = town.allDuels;
      tr.appendChild(td2);

      let td3 = document.createElement('td');
      if (town.duelsWon > town.duelsLost) td3.className = 'green';
      td3.innerHTML = town.duelsWon;
      tr.appendChild(td3);

      let td4 = document.createElement('td');
      if (town.duelsLost > town.duelsWon) td4.className = 'red';
      td4.innerHTML = town.duelsLost;
      tr.appendChild(td4);

      let td5 = document.createElement('td');
      td5.innerHTML = town.diff;
      tr.appendChild(td5);

      let td6 = document.createElement('td');
      if (town.koOpponents > town.koMembers) td6.className = 'green';
      td6.innerHTML = town.koOpponents;
      tr.appendChild(td6);

      let td7 = document.createElement('td');
      if (town.koMembers > town.koOpponents) td7.className = 'red';
      td7.innerHTML = town.koMembers;
      tr.appendChild(td7);

      let td8 = document.createElement('td');
      td8.innerHTML = (town.bestDmg > 0 ? town.bestDmg + ' dmg<br>' + town.bestPlayer : '-');
      tr.appendChild(td8);

      let td9 = document.createElement('td');
      td9.innerHTML = (town.bestTownDmg > 0 ? town.bestTownDmg + ' dmg<br>' + town.bestTownPlayer : '-');
      tr.appendChild(td9);

      let td10 = document.createElement('td');
      td10.innerHTML = (town.bestOpponentDmg > 0 ? town.bestOpponentDmg + ' dmg<br>' + town.bestOpponentPlayer : '-');
      tr.appendChild(td10);

      table.appendChild(tr);
    }

    wrapper.appendChild(updateTime);
    wrapper.appendChild(table);
    return wrapper;
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }
})();
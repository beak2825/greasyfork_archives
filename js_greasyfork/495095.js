// ==UserScript==
// @name         Mark scheduled games as favorites on the new Games Done Quick website
// @description  With this script you can click to highlight your favorite games in the GDQ schedule list.
// @namespace    http://gamesdonequick.com/
// @version      1.2
// @author       ciscoheat
// @match        https://gamesdonequick.com/schedule/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495095/Mark%20scheduled%20games%20as%20favorites%20on%20the%20new%20Games%20Done%20Quick%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/495095/Mark%20scheduled%20games%20as%20favorites%20on%20the%20new%20Games%20Done%20Quick%20website.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let selected = new Set()

  function selected_has(game) {
    return selected.has(game)
  }

  function selected_toggle(game) {
    if(!selected_has(game)) {
      selected.add(game);
    } else {
      selected.delete(game);
    }

    localStorage.favorites = JSON.stringify(Array.from(selected));
    games_showSelected();
  }

  /////////////////////////////////////////////////////////////////

  let games = []

  function games_parse() {
    games = Array.from(document.querySelectorAll('.schedule')).map(el => {
      const parent = el.parentNode
      const button = parent.firstChild
      const name = button.firstChild.innerText.trim()

      // Remove if no time conversion is wanted
      button.querySelectorAll('.font-monospace').forEach(time => {
        if(time.innerText.endsWith('AM') || time.innerText.endsWith('PM')) {
          time.innerText = convertTime12to24(time.innerText)
        }
      })

      return { name, button }
    }).filter(game => game.name)

    games_createClickEvents()
  }

  function games_createClickEvents() {
    let currentClick = []

    games.forEach(game => {
      const selected = game.button

      game.button.addEventListener('mousedown', (e) => {
        if(e.button != 0) return;
        currentClick = [e.pageX, e.pageY];
      })

      game.button.addEventListener('mouseup', (e) => {
        if(e.button != 0) return;
        if(Math.abs(e.pageX - currentClick[0]) > 2 || Math.abs(e.pageY - currentClick[1]) > 2) return;
        selected_toggle(game.name)
      });
    })

    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', games_parseWithDelay)
    })

    games_showSelected()
  }

  function games_parseWithDelay() {
    console.log('clicked');
    document.querySelectorAll('button').forEach((button) => {
      button.removeEventListener('click', games_parseWithDelay);
    })

    setTimeout(games_parse)
  }

  function games_showSelected() {
    games.forEach(game => {
      const selected = selected_has(game.name)
      const passed = game.button.classList.contains('bg-slate-100')
      const show = selected && !passed

      game.button.style.backgroundColor = selected && !passed ? 'var(--gdq-blue)' : null
      game.button.style.color = passed && selected ? 'var(--gdq-blue)' : selected ? 'white' : null
    })
  }

  ///////////////////////////////////////////////////////////////

  const wait = setInterval(() => {
    if(!document.querySelector('.schedule')) return
    clearInterval(wait)

    try {
      selected = new Set(JSON.parse(localStorage.favorites))
    } catch(_) {
      selected = new Set()
    }

    // Start interaction
    games_parseWithDelay();
  }, 25)

  const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0')
  }

})();
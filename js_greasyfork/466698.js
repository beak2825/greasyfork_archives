// ==UserScript==
// @name            HWM_roulette_upd
// @namespace       Мифист
// @author          Мифист
// @version         1.2
// @description     Пропатченная рулетка
// @match           https://www.heroeswm.ru/roulette.php*
// @match           https://*.lordswm.com/roulette.php*
// @run-at          document-end
// @grant           none
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/466698/HWM_roulette_upd.user.js
// @updateURL https://update.greasyfork.org/scripts/466698/HWM_roulette_upd.meta.js
// ==/UserScript==

(function(view) {
  'use strict';

  clearTimeout(view.Timer);

  if (!Element.prototype.scrollIntoViewIfNeeded) {
    Element.prototype.scrollIntoViewIfNeeded = Element.prototype.scrollIntoView;
  }

  // =========================

  const DEV_ID = '5781303';
  const PATH = '/roulette.php';
  const MODULE_NAME = 'HWM_roulette_upd';
  const SYMBOL = Symbol.for(`__${DEV_ID}__`);
  const modules = view[SYMBOL] || (view[SYMBOL] = {});
  modules[MODULE_NAME] = '1.0';

  const {
    $, $$,
    fetch, clamp, wait, memoize,
    attempt, parseNode, getElemIndex
  } = (document[`__utils_${DEV_ID}`] || (() => {
    const $ = (selector, ctx = document) => ctx.querySelector(selector);
    const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
    const getElemIndex = elem => [...elem.parentNode.children].indexOf(elem);
    const clamp = (min, val, max = Infinity) => Math.max(min, Math.min(val, max));
    const wait = (sec = 1) => new Promise((resolve) => setTimeout(resolve, 1e3 * sec));

    function attempt(that, callback, thisArg) {
      if (thisArg == null) thisArg = that;
      return that ? callback.call(thisArg, that) : null;
    }

    function parseNode(html, callback) {
      let elem = document.createElement('div');
      elem.innerHTML = html;
      elem = elem.firstElementChild.cloneNode(true);
      callback && callback.call(elem, elem);
      return elem;
    }

    function memoize(fn) {
      const cache = new Map();
      return (x) => cache.get(x) || cache.set(x, fn(x)).get(x);
    }

    function fetch({ url, method = 'GET', type = 'document', body = null }) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = type;

        xhr.onload = () => {
          const {status} = xhr;
          if (status === 200) return resolve(xhr.response);

          const er = new Error(`Error with status ${status}`);
          er.status = status;
          reject(er);
        };

        xhr.onerror = () => {
          const {status} = xhr;
          const er = new Error(`HTTP error with status ${status}`);
          er.status = status;
          reject(er);
        };

        xhr.send(body);
      });
    }

    fetch.get = url => fetch({ url });
    fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });

    return {
      $, $$,
      fetch, clamp, wait, memoize,
      attempt, parseNode, getElemIndex
    };
  })());

  const formatNum = (num) => num.toLocaleString('en');
  const parseNum = (num) => String(num).replaceAll(',', '') >> 0;
  const activeElem = (elem) => elem.classList.add('__active');
  const inactiveElem = (elem) => elem.classList.remove('__active');
  const reduceBets = (bets, key = 'value') => bets.reduce((a, b) => a + b[key], 0);

  // =========================

  let locked = false;
  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const [MIN, MAX, CASH] = getMinMaxCash();

  function getMinMaxCash(context = document) {
    const script = context.forms[0].previousElementSibling;
    const {text} = script;
    const reg = /bet\.value [><] (\d+)/g;
    const [cash, min] = [...text.matchAll(reg)].map(match => +match[1]);
    const max = +text.match(/maxsum = (\d+)/)[1];
    return [min, max, cash];
  }

  function checkMoney(value) {
    if (roulCash < value) return !!roulAlert.notEnoughMoney();
    if (roulBets.sum + value > roulBets.MAX) return !!roulAlert.outOfRange();
    return true;
  }

  function hwmBetToObject(elem) {
    const id = elem.lastElementChild.textContent;
    const value = parseNum(elem.firstElementChild.textContent);
    return { id, value };
  }

  function renderApp() {
    return /*html*/`
      <main id="container">
        ${templates.Tools()}
        ${templates.Roul()}
        ${templates.Wheel()}
        ${templates.Details()}
        ${templates.Bets()}
        ${templates.Games()}
        ${templates.Density()}
        ${templates.Alert()}
        <div id="roul-tip"></div>
        <div id="roul-mark">
          <div>roulette</div>
          by <a href="/pl_info.php?id=${DEV_ID}">Мифист</a>
        </div>
      </main>
    `;
  }

  const templates = {
    Games() {
      return /*html*/`
        <section id="roul-games" class="roul-box">
          <div class="roul-games__info roul-box">
            <div class="roul-games__bets roul-box-body ui-scroll"></div>
            <footer class="roul-games__footer roul-box-footer"></footer>
          </div>
          <div class="roul-games__content roul-box-body ui-scroll">
            <div class="roul-games__body"></div>
            <b id="load_prev_games" title="Загрузить последние 24 игры">+</b>
          </div>
        </section>
      `;
    },

    Density(context = document) {
      const table = $$('table.wb', context).pop().firstElementChild;
      const allSum = table.lastElementChild.textContent.split(/\s/)[0];

      const items = [...table.children].slice(1, -1).map(row => {
        const id = row.lastElementChild.textContent;
        const val = row.firstElementChild.textContent;
        return /*html*/`
          <div class="roul-box-row">
            <span class="roul-bet-key">${roulID.get(id)}</span>
            <span class="roul-bet-value">${val}</span>
          </div>
        `;
      });

      return /*html*/`
        <section id="roul-density" class="roul-box">
          <header class="roul-box-header">
            Плотность ставок
            <button id="roul-density__upd">&orarr;</button>
          </header>
          <div class="roul-box-body ui-scroll">${items.join('')}</div>
          <footer class="roul-box-footer">
            Всего:
            <span class="roul-sum">${allSum}</span>
          </footer>
        </section>
      `;
    },

    Details() {
      return /*html*/`
        <section id="roul-details" class="roul-box">
          <div id="roul-cash">Баланс: <span class="roul-sum">${formatNum(CASH)}</span></div>
          <div id="roul-minbet">Минимальная ставка: <span class="roul-sum">${formatNum(MIN)}</span></div>
          <div id="roul-maxbet">Макс. сумма ставок: <span class="roul-sum">${formatNum(MAX)}</span></div>
          <div>До спина: <span id="roul-timer">00:00</span></div>
        </section>
      `;
    },

    Bets() {
      return /*html*/`
        <section id="roul-bets" class="roul-box">
          <header class="roul-bets__tabs">
            <div class="roul-bets__tab __active">Ставки (стол)</div>
            <div class="roul-bets__tab">Ставки (принято) <span id="roul-bets__count">0 / 0</span></div>
          </header>
          <div class="roul-box">
            <div class="roul-bets__body roul-box-body ui-scroll"></div>
            <footer class="roul-bets__footer roul-box-footer">
              <div class="roul-bets__apply">
                <div class="roul-bets__action" data-action="cancel">&times;</div>
                <div class="roul-bets__action" data-action="accept">&check;</div>
              </div>
              Всего: <span class="roul-sum">0</span>
            </footer>
          </div>
          <div class="roul-box" hidden>
            <div class="roul-bets__body roul-box-body ui-scroll"></div>
            <footer class="roul-bets__footer roul-box-footer">Всего: <span class="roul-sum">0</span></footer>
          </div>
        </section>
      `;
    },

    Alert() {
      return /*html*/`
        <div id="roul-alert" data-action="hide">
          <div id="roul-alert__inner">
            <div id="roul-alert__content"></div>
            <button id="roul-alert__ok" data-action="hide">OK</button>
          </div>
        </div>
      `;
    },

    Wheel() {
      const numbers = '0-28-9-26-30-11-7-20-32-17-5-22-34-15-3-24-36-13-1-00-27-10-25-29-12-8-19-31-18-6-21-33-16-4-23-35-14-2'.split('-');
      const angle = 360 / numbers.length / 360;
      const rotate = ind => `style="--turn: ${+(angle * ind).toFixed(3)}turn"`;
      const getSegment = (num, ind) => {
        return /*html*/`<div class="wheel__segment" data-num="${num}" ${rotate(ind)}></div>`;
      };

      return /*html*/`
        <section id="wheel">
          <div id="wheel__main">
            <div id="wheel__segments">${numbers.map(getSegment).join('')}</div>
            <div id="wheel__rotor">
              ${'<div class="wheel__line"></div>'.repeat(4)}
              <div id="wheel__turret"></div>
            </div>
          </div>
          <div id="wheel__ball"></div>
          <div id="wheel__info">
            <div id="wheel__number"></div>
            <div id="wheel__score">Выигрыш: </div>
          </div>
        </section>
      `;
    },

    Tools() {
      function getCoin(val) {
        return /*html*/`<b class="roul-coin" data-coin="${val}" data-action="setMultiplier"></b>`;
      }

      const coins = [5, 25, 50, 100, 250, 500, '1e3', 'MIN', 'MAX'];

      return /*html*/`
        <section id="roul-tools">
          <div class="roul-tools__item">${coins.map(getCoin).join('')}</div>
          <div class="roul-tools__item">
            <button class="roul-tools__btn" data-action="rebet" title="Повторить последние ставки">&larr;</button>
          </div>
        </section>
      `.replace('" data-coin="100', ' __active" data-coin="100');
    },

    Roul() {
      return /*html*/`
        <section id="roulette">
          ${this.RoulInside()}
          ${this.RoulOutside()}
          ${this.Chips()}
        </section>
      `;
    },

    RoulInside() {
      const getColor = id => RED_NUMBERS.includes(id) ? 'red' : 'black';
      const getZero = id => getCell(id).replace('black', 'zero');

      function getCell(id) {
        const className = `roul-area roul-cell roul-num roul-${getColor(id)}`;
        return /*html*/`
          <div class="${className}" data-id="Straight up ${id}">
            <b class="roul-value">${id}</b>
            <b class="roul-fish"></b>
          </div>
        `;
      }

      function getColumn(order) {
        return getCell('&').replace('num roul-black', 'x3 roul-column')
          .replace('Straight up &', `${order} Column`)
          .replace('&', '2 to 1');
      }

      const coloredCellsHTML = [...Array(12)].map((x, i) => {
        const start = i * 3 + 1;
        const cells = [start + 2, start + 1, start].map(getCell);
        return /*html*/`<div class="roulette__col">${cells.join('')}</div>`;
      }).join('');

      const zerosHTML = ['00', '0'].map(getZero).join('');
      const columnsHTML = ['3rd', '2nd', '1st'].map(getColumn).join('');

      return /*html*/`
        <div class="roulette__section">
          <div class="roulette__col">${zerosHTML}</div>
          ${coloredCellsHTML}
          <div class="roulette__col">${columnsHTML}</div>
        </div>
      `;
    },

    RoulOutside() {
      const defaultClasses = ['area', 'outside', 'x3'].map(x => `roul-${x}`);

      function getDozen(order) {
        const classes = [...defaultClasses, 'roul-dozen'];
        return /*html*/`
          <div class="${classes.join(' ')}" data-id="${order} Dozen">
            <b class="roul-value">${order[0]}<sup>${order.slice(1)}</sup> 12</b>
            <b class="roul-fish"></b>
          </div>
        `;
      }

      function getSection(id) {
        const value = id === '1-18 Half' ? '1 to 18' : id === '19-36 Half' ? '19 to 36' : id;
        const classes = [...defaultClasses];
        if (/R|B/.test(id[0])) classes.push(`roul-${id.toLowerCase()}`);

        return /*html*/`
          <div class="${classes.join(' ')}" data-id="${id}">
            <b class="roul-value">${value}</b>
            <b class="roul-fish"></b>
          </div>
        `;
      }

      const dozens = ['1st', '2nd', '3rd'];
      const others = ['1-18 Half', 'EVEN', 'RED', 'BLACK', 'ODD', '19-36 Half'];

      return /*html*/`
        <div class="roulette__section">
          ${dozens.map(getDozen).join('')}
          ${others.map(getSection).join('')}
        </div>
      `;
    },

    Chips() {
      function chip(id, num = 0, mod = 'n') {
        const className = `roul-chip roul-chip${num} roul-chip-${mod}`;
        return /*html*/`<b class="${className}" data-id="${id}"></b>`;
      }

      function getSplits(start) {
        return chip(`Split ${start}, ${start + 3}`, 4)
          + chip(`Split ${start - 1}, ${start + 2}`, 6)
          + chip(`Split ${start - 2}, ${start + 1}`, 8)
          + chip(`Split ${start - 1}, ${start}`, 5, 'h')
          + chip(`Split ${start - 2}, ${start - 1}`, 7, 'h');
      }

      function getCorners(start) {
        const nums1 = [start - 1, start, start + 2, start + 3].join(', ');
        const nums2 = [start - 2, start - 1, start + 1, start + 2].join(', ');
        return chip(`Corner ${nums1}`, 5) + chip(`Corner ${nums2}`, 7);
      }

      function getStreetAndSixline(start) {
        return chip(`Street ${start - 2}-${start}`, 9, 'h')
          + chip(`Sixline ${start - 2}-${start + 3}`, 9);
      }

      const colsHTML = [...Array(11)].map((x, i) => {
        const start = i * 3 + 3;
        return /*html*/`
          <div class="roul-chips__col">
            ${getSplits(start)}
            ${getCorners(start)}
            ${getStreetAndSixline(start)}
          </div>
        `;
      }).join('');

      return /*html*/`
        <div id="roul-chips">
          <div class="roul-chips__col">
            ${chip('Split 3, 00', 4)}
            ${chip('Numbers 2, 00, 3', 5)}
            ${chip('Split 2, 00', 0, 'x').replace('>', ' style="top: 4.5em;">')}
            ${chip('Split 0, 2', 0, 'x').replace('>', ' style="top: 6.3em;">')}
            ${chip('Split 0, 1', 8)}
            ${chip('Numbers 0, 1, 2', 7)}
            ${chip('Numbers 0, 00, 1, 2, 3', 9)}
            ${chip('Split 0, 00', 0, 'h').replace('>', ' style="top: 50%;">')}
            ${chip('Numbers 0, 00, 2').replace('>', ' style="top: 50%;">')}
          </div>
          ${colsHTML}
          <div class="roul-chips__col">
            ${chip('Split 35, 36', 5, 'h')}
            ${chip('Split 34, 35', 7, 'h')}
            ${chip('Street 34-36', 9, 'h')}
            ${chip('Red Snake', 9)}
          </div>
        </div>
      `;
    },
  };

  const roulID = {
    get(id) { return this[id] || id; },
    'Numbers 0, 00, 1, 2, 3': 'Top Line',
    'Numbers 0, 1, 2': 'Basket 1',
    'Numbers 0, 00, 2': 'Basket 2',
    'Numbers 2, 00, 3': 'Basket 3',
    'Split 0, 00': 'Row',
    'Split 2, 00': 'Split 00, 2',
    'Split 3, 00': 'Split 00, 3',
    '1-18 Half': '1 to 18',
    '19-36 Half': '19 to 36',
  };

  roulID.keys = Object.keys(roulID).slice(1);

  // =========================

  const logError = {
    create: (status, msg) => Object.assign(new Error(msg), { status }),
    disconnect(er, data) {
      const text = {
        '-1': 'Произошла деавторизация; рулетка не доступна',
        0:  'Потеряно соединение с интернетом',
      }[er.status] || 'Что-то пошло не так :)';

      this.show(er, text);
      data && this.handleData(data);
    },
    show({message}, userText) {
      console.error(message);
      roulAlert.show(/*html*/`
        <div id="roul-log">
          <p>${message}</p>
          <p>${userText}</p>
        </div>
      `);
    },
    handleData(data) {
      const log = $('#roul-log');
      const link = parseNode(`<a href="#">${data.text}</a>`);
      log.appendChild(link);
      link.onclick = (e) => {
        link.onclick = null;
        e.preventDefault();
        data.callback();
      };
    }
  }

  // =============== [[ FORM ]]

  const formData = ((form) => {
    !form.parlay_dec && setParlayDec(document.body);

    function setParlayDec(ctx) {
      const gameId = ctx.innerHTML.match(/inforoul\.php\?id=(\d+)/)[1];
      const inputHTML = `<input name="parlay_dec" value="${+gameId + 1}">`;
      form.appendChild(parseNode(inputHTML));
    }

    function isEquals(bet1, bet2) {
      const a = [bet1.id, bet1.value].toString();
      const b = [bet2.id, bet2.value].toString();
      return a === b;
    }

    function betToPostData(bet) {
      const data = new FormData(form);
      data.set('bettype', bet.id);
      data.set('bet', bet.value);
      return data;
    }

    function sendRedSnake(self, snakeBet) {
      if (!snakeBet.initialized) {
        snakeBet.initialized = true;
        const keys = '9, 12|16, 19|27, 30|1|5|14|23|32|34'.split('|');
        snakeBet.keys = keys.map((x, i) => {
          return i < 3 ? `Split ${x}` : `Straight up ${x}`;
        });
      }

      const betVal = snakeBet.value / 12 >> 0;
      const bets = snakeBet.keys.map((id) => {
        const value = betVal * (1 + +id.startsWith('Sp'));
        return { id, value, count: 0, onLoadEnd: Function.prototype };
      });

      return new Promise(function next(resolve, reject) {
        if (locked) bets.splice(0);

        if (!bets.length) {
          snakeBet.onLoadEnd(snakeBet.keys.length ? 2 : 1);
          return resolve();
        }

        const bet = bets.pop();
        return self.send(bet).then(status => {
          if (status === 1) {
            snakeBet.keys.splice(snakeBet.keys.indexOf(bet.id), 1);
          } else if (!bet.count++) bets.push(bet);

          return wait(0.2).then(() => next(resolve, reject));
        }).catch(reject);
      });
    }

    return {
      get seconds() {
        return form.minutes.value * 60 + +form.seconds.value;
      },
      get restSeconds() {
        return clamp(0, 300 - this.seconds);
      },
      get gameId() {
        return form.parlay_dec.value;
      },
      async send(bet) {
        if (bet.id === 'Red Snake') return await sendRedSnake(this, bet);

        const doc = await fetch.post(form.action, betToPostData(bet))

        if (!doc.URL.includes(PATH)) {
          throw logError.create(-1, 'Authorization error');
        }

        const table = $('table.wb:nth-child(2)', doc);
        const test = isEquals(bet, hwmBetToObject(table.rows[1]));
        const status = test ? 1 : 2;
        bet.onLoadEnd(status);
        return status;
      },
      update(newForm) {
        form = document.importNode(newForm, true);
        !form.parlay_dec && setParlayDec(newForm.closest('body'));
      }
    };
  })(document.forms[0].cloneNode(true));

  // =========================

  const initialBets = [...$('table.wb:nth-child(2)').rows]
    .slice(1, -1)
    .map(hwmBetToObject);

  const container = parseNode(renderApp());

  $$('link', document.head).forEach((link) => {
    const reg = /(sweetalert|top_basic)\.css/;
    return reg.test(link.href) && link.remove();
  });

  parseNode('<style id="roul-CSS"></style>', function() {
    this.append(/*css*/`
      @keyframes roulWin {
        0% {filter: brightness(1);}
        100% {filter: brightness(1.1);}
      }

      @keyframes roulSpin {
        100% {transform: rotate(1turn);}
      }

      /* === GLOBAL === */

        :root {
          font-size: 10px;
          overflow-y: visible;
        }
        body.txt {
          overflow-y: visible;
        }
        main *,
        ::before,
        ::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        [hidden] {
          display: none !important;
        }

      /* === COMMON === */

        .ui-scroll {
          overflow-x: hidden;
          overflow-y: auto;
        }
        .ui-scroll::-webkit-scrollbar {
          width: 6px;
          background-color: #eee;
        }
        .ui-scroll::-webkit-scrollbar-thumb {
          background-color: #ccc;
        }
        .ui-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #aaa;
        }
        .ui-scroll::-webkit-scrollbar-thumb:active {
          background-color: gray;
        }

        .roul-bet-key {
          padding: 0 0.5em;
          border-right: var(--border);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 11.5em;
        }
        .roul-bet-value {
          padding: 0 0.5em;
          text-align: center;
          color: brown;
          flex: 1;
        }
        .roul-box {
          background-color: var(--bg);
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .roul-box-body {
          background-color: inherit;
        }
        .roul-box-body:empty {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .roul-box-body:empty::after {
          content: "No bets";
          color: gray;
        }
        .roul-box-row {
          line-height: 1.8;
          display: flex;
          background-color: inherit;
          box-shadow: var(--shadow);
        }
        .roul-box-row:nth-child(odd) {
          background-color: #efebe4;
        }
        .roul-box-header,
        .roul-box-footer {
          line-height: 2;
          position: relative;
          padding: 0 0.5em;
          background-color: #e9e0c6;
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .roul-box-footer {
          margin-top: -1px;
          text-align: right;
          background-color: #d9e4d2;
        }
        .roul-box-body:empty + footer {
          visibility: hidden;
        }
        .roul-sum {
          color: brown;
        }

      /* === CONTAINER === */

        #container {
          --bg: #e9e4dc;
          --shadow: 0 0 0 1px #aaa;
          --border: 1px solid #aaa;
          --highlight-color-1: #d7c4a4;
          --highlight-color-2: #dfd6c8;
          --highlight-color-3: #eaebb9;
          --selected-bet: linear-gradient(to right, var(--highlight-color-3), transparent);

          font-family: Arial, Helvetica, sans-serif;
          font-size: 1.6rem;
          max-width: 102rem;
          min-width: 64rem;
          position: relative;
          margin: 1rem auto 0;
          color: #333;
          user-select: none;
        }
        #container.__locked > section {
          filter: grayscale(.3);
          pointer-events: none;
        }

      /* === TOOLS === */

        #roul-tools {
          width: 100%;
          max-width: 84rem;
          display: flex;
          justify-content: space-between;
          column-gap: 3em;
          position: absolute;
          left: calc(50% - 42rem);
          top: 1rem;
        }
        #container.__locked > #roul-tools {
          filter: grayscale(1);
        }
        .roul-tools__item {
          display: flex;
          column-gap: 0.2em;
        }

        .roul-coin,
        .roul-tools__btn {
          font-size: 1em;
          width: 3em;
          height: 3em;
          display: inline-block;
          position: relative;
          border-radius: 50%;
          cursor: pointer;
        }
        .roul-coin {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #172533;
          background-color: #333;
          box-shadow: inset 0 0 0 0.5rem currentColor, inset 0 0 0 0.6rem #cfcf89;
          opacity: .7;
        }
        .roul-coin:nth-child(1) {
          color: #88a06d;
        }
        .roul-coin:nth-child(2) {
          color: #a89632;
        }
        .roul-coin:nth-child(3) {
          color: #bc6d0b;
        }
        .roul-coin:nth-child(4) {
          color: #8d2525;
        }
        .roul-coin:nth-child(5) {
          color: #62258d;
        }
        .roul-coin:nth-child(6) {
          color: #0044a5;
        }
        .roul-coin:nth-child(7) {
          color: #115b68;
        }
        .roul-coin:hover {
          transform: scale(1.2);
          z-index: 2;
        }
        .roul-coin.__active {
          opacity: 1;
          pointer-events: none;
        }
        .roul-coin::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border: .2em dashed #eee;
          border-radius: inherit;
          box-shadow: 0 0 0 1px #555, 0 0 4px 1px #111;
        }
        .roul-coin::after {
          content: attr(data-coin);
          font-family: Consolas, monospace;
          font-size: .95em;
          color: #eee;
        }

        .roul-tools__btn {
          background-color: #f3e9d1;
          border: 2px solid #999;
          border-color: #999 #666 #666 #999;
        }
        .roul-tools__btn:hover,
        .roul-tools__btn:focus {
          background-color: #eadec0;
        }
        .roul-tools__btn:active {
          transform: scale(.9);
        }
        .roul-tools__btn::after {
          content: "";
          position: absolute;
          top: 2px; right: 2px; bottom: 2px; left: 2px;
          border: 1px dashed #999;
          border-radius: inherit;
        }

      /* === ROULETTE === */

        #roulette {
          font-size: 2rem;
          width: 42em;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: absolute;
          left: calc(50% - 42rem);
          top: 9.5rem;
          color: #8191a2;
          pointer-events: none;
        }
        #roulette::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: -1em;
          background-color: var(--bg);
          border: 2px solid #afa18e;
          border-top-left-radius: 1.5em;
        }
        .roulette__section {
          display: flex;
          flex-wrap: wrap;
        }
        .roulette__section:first-child {
          height: 10.8em;
          position: relative;
          z-index: 2;
        }
        .roulette__section:nth-child(2) {
          width: calc(100% - 6em);
          height: 8em;
        }
        .roulette__col {
          display: flex;
          flex-direction: column;
        }
        .roulette__col:nth-last-child(2) {
          position: relative;
          z-index: 2;
        }
        .roul-area {
          position: relative;
          background-color: var(--bg);
          box-shadow: 0 0 0 1px #8d8d8d;
          cursor: pointer;
          pointer-events: auto;
        }
        .__target {
          background-color: #dfd6c8;
        }
        .roul-area:hover {
          background-color: #d7c4a4;
        }
        .roul-x3.__target,
        .roul-x3:hover {
          color: #eadecf;
          background-color: #c4a97e;
        }
        .roul-cell {
          flex: 1;
          width: 3em;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .roul-black {
          color: #222 !important;
        }
        .roul-red {
          color: #b43b3b !important;
        }

        #winner {
          background-color: var(--highlight-color-3);
          animation: roulWin .3s alternate 4;
        }

        .roul-value {
          pointer-events: none;
        }
        .roul-column > .roul-value {
          transform: rotate(-90deg);
        }

        /* outside */

        .roul-outside {
          width: 6em;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .roul-dozen {
          width: 12em;
        }
        .roul-outside > .roul-value {
          font-size: 1.1em;
        }
        .roul-dozen > .roul-value {
          font-size: 1.5em;
        }

        /* chips */

        #roul-chips {
          height: 10.8em;
          display: flex;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
        }
        .roul-chips__col {
          width: 3em;
          height: 100%;
          position: relative;
        }
        .roul-chip {
          width: 0.8em;
          height: 0.8em;
          position: absolute;
          right: -0.4em;
          margin-top: -0.4em;
          background-color: transparent !important;
          pointer-events: auto;
          cursor: pointer;
          z-index: 4;
        }
        .roul-chip-h {
          width: auto;
          left: 0; right: 0;
        }
        .roul-chip4 {
          top: 0;
        }
        .roul-chip5, .roul-chip6 {
          top: 33.333%;
        }
        .roul-chip7, .roul-chip8 {
          top: 66.666%;
        }
        .roul-chip9 {
          top: 100%;
          z-index: 5;
        }
        .roul-chip4, .roul-chip6, .roul-chip8 {
          height: 3.6em;
          margin-top: 0;
        }
        .roul-chip[data-id^="Cor"],
        .roul-chip[data-id^="Six"] {
          z-index: 6;
        }
        .roul-chip-x {
          height: 1em;
          margin-top: -0.5em;
        }
        .roul-chips__col:first-child > .roul-chip {
          z-index: 7;
        }
        .roul-fish,
        .roul-chip::after {
          --size: 1.5em;
          font-size: 0.8em;
          width: var(--size);
          height: var(--size);
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: calc(50% - var(--size) / 2);
          left: calc(50% - var(--size) / 2);
          color: #eee;
          background-color: #1c405f;
          border: .2em dashed;
          border-radius: 50%;
          box-shadow: 0 0 0 1px #333, 0 0 3px 1px #111;
          pointer-events: none;
          opacity: 0;
          z-index: 4;
        }
        .roul-fish::after,
        .roul-chip::after {
          content: "$";
          font-weight: normal;
        }
        .roul-area:hover > .roul-fish,
        .__target > .roul-fish,
        .roul-chip:hover::after,
        .roul-chip.__target::after {
          opacity: 1;
        }

        /* zero */

        .roul-zero {
          color: #55a867;
          border-top-left-radius: 3rem;
        }
        .roul-zero:last-child {
          border-top-left-radius: 0;
          border-bottom-left-radius: 3rem;
        }

        /* disable */

        #container.__locked .roul-area,
        #container.__locked .roul-chip {
          pointer-events: none;
        }

      /* === WHEEL === */

        #wheel {
          --diameter: 26rem;
          --radius: calc(var(--diameter) / 2);
          width: var(--diameter);
          height: var(--diameter);
          position: absolute;
          left: -23rem;
          top: -8rem;
          text-align: center;
          color: #eee;
          border-radius: 50%;
          filter: drop-shadow(0 0 2px #333);
          pointer-events: none;
          z-index: 100;
        }
        #wheel::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: -9%;
          border-radius: inherit;
          background-color: #6b432f;
          background-image: radial-gradient(50% 50%, #5d2e18 91%, #271a07 92%, #6b432f 93%);
          box-shadow: inset -2px -2px 4px #fff9;
        }
        #wheel.__spining {
          transition: transform 2.05s linear;
        }
        #wheel.__spinending {
          transition: transform 5.1s cubic-bezier(.35, .9, .7, 1);
        }
        #wheel__main {
          --turn: 0;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: inherit;
          transition: inherit;
          transform: rotate(calc(1turn * var(--turn)));
        }

        /* segments */

        #wheel__segments {
          height: 100%;
          position: relative;
        }
        #wheel__segments::before,
        #wheel__segments::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: 50%;
        }
        #wheel__segments::before {
          margin: -4px;
          border: 1px solid #8b7b74;
          box-shadow: inset 0 0 0 6px #bfb997, inset 0 0 0 8px #e3e0ca;
          z-index: 2;
        }
        #wheel__segments::after {
          margin: 12%;
          background-color: rgba(10, 10, 10, .5);
          border: 1px solid #e6cc9a;
          box-shadow: inset 0 0 0 1px #e4d6bb;
        }
        .wheel__segment {
          --size: calc(var(--diameter) / 12);
          --size2: calc(var(--size) / 2);
          width: var(--size);
          height: 50%;
          position: absolute;
          left: calc(50% - var(--size2));
          top: 0;
          color: #222;
          border: 0 solid transparent;
          border-width: var(--radius) var(--size2) 0;
          border-top-color: currentColor;
          transform: rotate(var(--turn));
          transform-origin: bottom;
        }
        .wheel__segment:nth-child(odd) {
          color: #ba3535;
        }
        .wheel__segment:nth-child(1),
        .wheel__segment:nth-child(20) {
          color: #43914b;
        }
        .wheel__segment.__active {
          color: #5f9ea0;
        }
        .wheel__segment::after {
          content: attr(data-num);
          font-family: Arial, Helvetica, sans-serif;
          font-size: var(--size2);
          width: inherit;
          position: absolute;
          left: -1em;
          top: calc(-1 * var(--radius) + 1em);
          color: #eee;
        }

        /* rotor */

        #wheel__rotor {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: 28%;
          background-color: #633d2b;
          background-image: radial-gradient(circle, #6b4838 50%, #1e0c03);
          border: 1px solid #e6cc9a;
          border-radius: inherit;
          box-shadow: inset 0 0 0 1px #eee0c6;
          z-index: 2;
        }
        .wheel__line {
          height: 1px;
          position: absolute;
          left: 0.2em;
          right: 0.2em;
          top: 0.2em;
          bottom: 0.2em;
          margin: auto;
          background-color: black;
          box-shadow: 0 0 2px gray;
        }
        .wheel__line:nth-child(2) {
          transform: rotate(90deg);
        }
        .wheel__line:nth-child(3) {
          transform: rotate(45deg);
        }
        .wheel__line:nth-child(4) {
          transform: rotate(135deg);
        }
        #wheel__turret {
          width: 40%;
          height: 40%;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          background-image: radial-gradient(50% 50%, #ebd5ab 40%, #9c8a63 60%, #e9d09e 80%, #998a6c 90%);
          box-shadow: 0 0 .4rem 1px #383838;
          border-radius: 50%;
        }
        #wheel__turret::before,
        #wheel__turret::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: 14%;
          border: 0.3rem dashed #b49f82;
          border-radius: inherit;
        }
        #wheel__turret::after {
          margin: 38%;
          background-color: #e2d9c5;
          border: 1px solid #b2a89a;
          box-shadow: inset 0 0 2px #666;
        }

        /* ball */

        #wheel__ball {
          --turn: 0;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: 4%;
          transform: rotate(calc(-1turn * var(--turn)));
          transition: margin .6s ease-out;
          z-index: 5;
        }
        .__spining > #wheel__ball {
          transition: inherit;
          will-change: transform;
        }
        .__result #wheel__ball {
          margin: 20%;
          transition: margin .4s ease-out;
        }
        #wheel__ball::after {
          --size: calc(var(--radius) / 9);
          content: "";
          width: var(--size);
          height: var(--size);
          display: inline-block;
          background-color: white;
          border-radius: 50%;
          box-shadow: inset 1px 1px 3px 2px #999;
          filter: drop-shadow(2px 3px 4px black);
        }

        /* info */

        #wheel__info {
          font-size: calc(var(--radius) / 10);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: 30%;
          border-radius: inherit;
          opacity: 0;
          visibility: hidden;
          transition: opacity .5s, visibility .5s;
        }
        .__result #wheel__info {
          opacity: 1;
          visibility: visible;
        }
        #wheel__number {
          font-size: 3.5em;
        }
        #wheel__score {
          font-size: 1.2em;
          line-height: 1.4;
        }
        #wheel__score::after {
          content: attr(data-score);
          display: block;
          color: #e3c59d;
        }

      /* === MINI WHEEL === */

        #wheel-wrap {
          width: 9rem;
          height: 6rem;
          position: absolute;
          left: calc(100% - 3rem);
          top: 0;
          background-color: var(--bg);
          outline: 1px solid black;
          overflow: hidden;
          visibility: hidden;
        }
        #wheel.mini-wheel {
          --diameter: 30rem;
          left: -4rem;
          top: 0.5rem;
          filter: none;
          transform: rotate(-30deg);
        }

      /* === DETAILS === */

        @keyframes roulTimerBlink {
          from {
            transform: scale(1);
            filter: opacity(1);
          }
          to {
            transform: scale(1.1);
            filter: opacity(0.6);
          }
        }
        #roul-details {
          font-family: Consolas, monospace;
          line-height: 1.3em;
          position: absolute;
          left: -22rem;
          top: 22rem;
          padding: 0.3em 0.6em;
        }
        #roul-cash {
          color: #416e90;
        }
        #roul-maxbet {
          margin-bottom: 0.4rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid #aaa;
        }
        #roul-timer {
          display: inline-block;
          color: #59908e;
        }
        #roul-timer.__blink {
          color: #ca0000;
          animation: roulTimerBlink .5s linear infinite alternate;
        }

      /* === BETS === */

        #roul-bets {
          width: 34rem;
          position: absolute;
          left: -22rem;
          top: 34rem;
        }
        .roul-bets__tabs {
          line-height: 2;
          display: flex;
          position: relative;
        }
        .roul-bets__tab {
          flex: 1 auto;
          padding: 0 0.5em;
          color: gray;
          background-color: #dcd7c8;
          box-shadow: var(--shadow);
          cursor: pointer;
        }
        .roul-bets__tab:hover {
          background-color: #e3ddca;
        }
        .roul-bets__tab.__active {
          color: inherit;
          background-color: #e9e0c6;
          pointer-events: none;
        }
        #roul-bets__count {
          font-family: Consolas, monospace;
          font-size: 0.8em;
          min-width: 4.3em;
          float: right;
          text-align: right;
          pointer-events: none;
        }

        .roul-bets__body {
          height: 17.3rem;
        }

        .roul-bets__apply {
          display: flex;
          float: left;
          position: relative;
          left: -0.5em;
        }
        .roul-bets__action {
          --d: 0deg;
          --s: 30%;
          --l: 90%;
          width: 2em;
          text-align: center;
          background-color: #eee;
          background-color: hsl(var(--d, 180deg), var(--s), var(--l));
          box-shadow: var(--shadow);
          cursor: pointer;
        }
        .roul-bets__action[data-action="accept"] {
          --d: 150deg;
        }
        .roul-bets__action:hover {
          --s: 40%;
          --l: 85%;
        }

        .roul-bet.__active {
          background-image: var(--selected-bet);
        }
        .roul-bet.__win {
          background-image: var(--selected-bet);
          animation: roulWin .3s alternate 4;
        }

        .roul-bet__action {
          width: 2em;
          text-align: center;
          background-color: #eee;
          box-shadow: var(--shadow);
          cursor: pointer;
        }
        .roul-bet__action:hover {
          background-color: #fff;
        }
        .roul-bet__action[data-action="remove"] {
          color: brown;
        }

        .roul-bet__status {
          width: 2em;
          position: relative;
          text-align: center;
        }
        [data-status="0"] > .roul-bet__status::after {
          content: "";
          width: 0.9em;
          height: 0.9em;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          border: 2px solid royalblue;
          border-right-color: transparent;
          border-radius: 50%;
          animation: roulSpin .75s linear infinite;
        }
        [data-status="1"] > .roul-bet__status::after {
          content: "✓";
          color: green;
        }
        [data-status="2"] > .roul-bet__status::after {
          content: "✗";
          display: block;
          color: brown;
          cursor: pointer;
        }

      /* === GAMES === */

        #roul-games {
          --size: 3rem;
          height: calc(var(--size) * 8 - 1px);
          position: absolute;
          left: calc(100% - 3rem);
          top: 8rem;
          overflow: visible;
          pointer-events: auto !important;
          z-index: 100;
        }
        #roul-games::before,
        #roul-games::after {
          content: "";
          width: 1px;
          position: absolute;
          left: var(--size);
          top: 0;
          bottom: 0;
          background-color: #ccc;
        }
        #roul-games::after {
          left: calc(var(--size) * 2);
        }
        .roul-games__content {
          height: 100%;
        }
        .roul-games__content::before {
          content: "";
          width: 4px;
          position: absolute;
          right: 100%;
          top: 0;
          bottom: 0;
        }
        .roul-games__body {
          width: calc(var(--size) * 3);
          min-height: 100%;
          overflow: hidden;
          background-color: inherit;
        }
        .roul-game {
          font: inherit;
          width: var(--size);
          height: var(--size);
          line-height: var(--size);
          position: relative;
          float: left;
          text-align: center;
          text-decoration: none;
          color: #222;
          background-color: inherit;
          outline: 1px solid #ccc;
          z-index: 2;
        }
        .roul-game:empty {
          pointer-events: none;
        }
        .roul-game:nth-child(3n+2) {
          color: #4aab55;
        }
        .roul-game:nth-child(3n) {
          color: #b20000;
        }
        .roul-game.__active {
          background-color: #eadbae;
        }
        .roul-game.__loading {
          color: transparent;
        }
        .roul-game.__loading::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: 8px;
          border: 2px solid royalblue;
          border-right-color: transparent;
          border-radius: 50%;
          animation: roulSpin .75s linear infinite;
        }

        /* info */

        .roul-games__info {
          width: max-content;
          min-width: 24rem;
          height: 100%;
          position: absolute;
          right: calc(100% + 4px);
          top: 0;
          opacity: .97;
          visibility: hidden;
        }
        .roul-games__info.__shown {
          visibility: visible;
        }
        .roul-games__info::before {
          content: "";
          width: 4px;
          position: absolute;
          left: 100%;
          top: 0;
          bottom: 0;
        }
        .roul-games__bets {
          height: calc(100% - var(--size) + 1px);
        }
        .roul-game-bet {
          line-height: var(--size);
        }
        .roul-game-bet.__selected {
          background-image: var(--selected-bet);
        }
        .roul-game-bet__value {
          color: inherit;
        }
        .roul-game-bet__value::before {
          content: attr(data-bet);
          color: brown;
        }
        .roul-game-bet__value::after {
          content: attr(data-prize);
          color: green;
        }

        .roul-games__footer {
          padding: 0;
          padding-left: 3rem;
          text-align: left;
        }
        .roul-games__footer > .roul-game-bet {
          background-color: inherit;
          pointer-events: none;
        }
        #roul-game-repeat {
          width: 2.9rem;
          line-height: 3rem;
          position: absolute;
          left: 0;
          top: 0;
          text-align: center;
          background-color: white;
          cursor: pointer;
        }

        #load_prev_games {
          font-weight: normal;
          width: 2rem;
          line-height: 2rem;
          position: absolute;
          right: .4rem; bottom: .4rem;
          text-align: center;
          background-color: white;
          box-shadow: 0 0 0 1px #999;
          cursor: pointer;
        }

      /* === DENSITY === */

        #roul-density {
          min-width: 20rem;
          position: absolute;
          left: calc(100% - 12rem);
          top: 34rem;
          pointer-events: auto !important;
          z-index: 2;
        }
        #roul-density > header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          column-gap: 0.5em;
        }
        #roul-density__upd {
          width: 2rem;
          height: 2rem;
          margin-left: 0.6em;
          background-color: white;
          border: 1px solid #555;
          border-radius: 50%;
          cursor: pointer;
        }
        #roul-density__upd.__loading {
          animation: roulSpin .4s linear infinite;
        }
        #roul-density > div {
          height: 26rem;
        }

      /* === TIP === */

        #roul-tip {
          line-height: 3.4rem;
          position: fixed;
          left: 0; top: 0;
          padding: 0 1rem;
          background-color: #eee;
          border: var(--border);
          box-shadow: 0 0 1px #777;
          overflow: hidden;
          pointer-events: none;
          opacity: .95;
          z-index: 102;
        }
        #roul-tip:empty {
          display: none;
        }
        #roul-tip::after {
          content: attr(data-value);
          display: inline-block;
          margin-left: 1rem;
          padding-left: 1rem;
          border-left: inherit;
          color: brown;
        }

      /* === MARK === */

        #roul-mark {
          line-height: 1.4;
          position: absolute;
          left: 50%;
          top: 51rem;
          margin-right: -50%;
          transform: translateX(-50%);
          text-align: center;
          pointer-events: none;
          opacity: 0.3;
        }
        #roul-mark:hover {
          opacity: 1;
          transition: opacity .2s .2s;
        }
        #roul-mark > div {
          font-family: serif;
          font-size: 2.2em;
          color: #ffeab6;
          letter-spacing: 0.15em;
          text-shadow: 0 0 2px black, 0 0 2px black;
          text-transform: uppercase;
        }
        #roul-mark > a {
          font: inherit;
          color: #824242;
          pointer-events: auto;
          text-decoration: none;
        }
        #roul-mark > a:hover {
          text-decoration: underline;
        }

      /* === ALERT === */

        #roul-alert {
          font-size: 1.1em;
          position: fixed;
          top: 0; right: 0; bottom: 0; left: 0;
          background-color: rgba(127, 127, 127, .7);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.25s, visibility 0.25s;
          z-index: 105;
        }
        #roul-alert.__shown {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        #roul-alert__inner {
          max-width: 32em;
          margin: auto;
          padding: 1em;
          color: #eee;
          background-color: #444;
          border: 1px solid gray;
          border-top: none;
          box-shadow: 0 0 6px #666;
          overflow: hidden;
          transform: perspective(50em) rotateX(-40deg);
          transform-origin: 50% 0;
          transition: transform 0.15s ease-out;
          cursor: default;
        }
        #roul-alert.__shown #roul-alert__inner {
          transform: perspective(50em) rotateX(0);
        }
        #roul-alert__content {
          line-height: 1.5;
          padding: 1em;
          margin-bottom: 1em;
          text-align: center;
          background-color: #555;
          border: 1px dashed gray;
        }
        #roul-alert__ok {
          float: right;
          padding: .4em 2em;
          text-align: center;
          color: #eee;
          background-color: #8a766f;
          border: 1px solid #bbb;
          outline: 1px solid #444;
          outline-offset: -3px;
          cursor: pointer;
        }
        #roul-alert__ok:hover {
          background-color: #9e8c86;
        }
        #roul-alert__ok:focus {
          border-color: #dabe99;
        }

        #roul-log {
          text-align: justify;
        }
        #roul-log > p:first-child {
          color: lightcoral;
        }
        #roul-log > a {
          display: inline-block;
          color: inherit;
          margin-top: 1em;
        }

      @media screen and (max-width: 1480px) {
        #roul-tools {
          font-size: 0.9em;
          width: auto;
          padding: 0 0.5em;
          left: 0;
        }
        #roulette {
          font-size: 1.7rem;
          top: 26em;
          left: -0.7em;
          transform: rotate(90deg);
          transform-origin: top;
        }
        .roul-num > .roul-value {
          transform: rotate(-90deg);
        }
        #wheel {
          left: 42rem;
          top: 10rem;
        }
        #wheel-wrap {
          left: 74rem;
          top: 3rem;
        }
        #roul-details {
          left: 38rem;
          top: 42rem;
        }
        #roul-bets {
          left: 38rem;
          top: 54rem;
        }
        #roul-games {
          left: 74rem;
          top: 11rem;
        }
        #roul-density {
          left: 74rem;
          top: 45.3rem;
        }
        #roul-mark {
          left: calc(80rem + 14vw);
          top: 2rem;
        }
      }

      @media screen and (max-width: 1160px) {
        #roul-mark {
          left: 79rem;
          top: 36.3rem;
        }
      }
    `);

    container.prepend(this);
    $('body > center').replaceWith(container);
  });

  // =============== [[ CASH ]]

  const roulCash = ((target) => {
    let cash = CASH;
    const goldNode = modules.HWM_new_header
      ? attempt($('.header-res'), el => el.lastChild)
      : ($('#ResourceAmount') || $('#top_res_table td:nth-child(2)'));

    return {
      get value() {
        return cash - roulBets.sum;
      },
      set value(val) {
        cash = val;
        this.update(val);
      },
      update(val) {
        const value = formatNum(val || this.value);
        target.textContent = value;
        if (goldNode) goldNode.textContent = value;
      },
      valueOf() {
        return this.value;
      }
    };
  })($('#roul-cash > span'));

  // =============== [[ DENSITY ]]

  const roulDensity = ((target) => {
    const {children} = target;
    const button = children[0].firstElementChild;
    let isLoading = false;

    return {
      __init__() {
        button.addEventListener('click', this.update);
      },
      clear() {
        children[1].innerHTML = '';
      },
      update() {
        if (isLoading) return;

        isLoading = true;
        button.classList.add('__loading');

        fetch.get(PATH).then((doc) => {
          if (!doc.URL.includes(PATH)) {
            throw logError.create(-1, 'Authorization error');
          }

          const elems = [...parseNode(templates.Density(doc)).children];
          children[1].replaceWith(elems[1]);
          children[2].replaceWith(elems[2]);

          isLoading = false;
          button.classList.remove('__loading');
        }).catch(handleError);

        function handleError(er) {
          isLoading = false;
          button.classList.remove('__loading');
          return logError.disconnect(er);
        }
      }
    };
  })($('#roul-density'));

  // =============== [[ BETS ]]

  const roulBets = ((target) => {
    const tabElems = [...target.firstElementChild.children];
    const contElems = [...target.children].slice(1);
    const bodyElems = contElems.map(el => el.firstElementChild);
    const sumElems = contElems.map(el => el.lastElementChild.lastElementChild);

    const bets1 = [];
    const bets2 = [];

    const getBets = ind => !ind ? bets1 : bets2;

    let tabIndex = 0;

    class Bet {
      constructor(id, value) {
        createBet.call(this, 0, {id, value});
      }
      static create({id, value}) {
        return parseNode(/*html*/`
          <div class="roul-bet roul-box-row">
            <div class="roul-bet__action" data-action="remove">&times;</div>
            <div class="roul-bet__action" data-action="multiply">&times;2</div>
            <div class="roul-bet__key roul-bet-key">${roulID.get(id)}</div>
            <div class="roul-bet__value roul-bet-value">${formatNum(value)}</div>
          </div>
        `);
      }
      static get activeBet() {
        return $('.__active', bodyElems[0]);
      }
      refresh(val) {
        this.value += val;
        this.target.lastElementChild.textContent = formatNum(this.value);
        roulCash.update();
        updateBetsSum();
      }
      remove() {
        this.target.remove();
        roulAPI.unselect(this.id);
        bets1.splice(bets1.indexOf(this), 1);
        roulCash.update();
        updateBetsSum();
      }
      multiply(meta) {
        if (meta) {
          const min = this.id === 'Red Snake' ? roulBets.MIN * 12 : roulBets.MIN;
          if (~~(this.value / 2) < min) return this.remove();
        } else if (!checkMoney(this.value)) return;

        this.refresh(meta ? -this.value / 2 >> 0 : this.value);
        this.select();
      }
      select() {
        attempt(Bet.activeBet, inactiveElem);
        activeElem(this.target);
        this.target.scrollIntoViewIfNeeded(false);
      }
    }

    class Bet2 {
      constructor(id, value, status = 0) {
        createBet.call(this, 1, {id, value, status});
      }
      static create({id, value, status}) {
        return parseNode(/*html*/`
          <div class="roul-bet roul-bet2 roul-box-row" data-status="${status}">
            <div class="roul-bet__status"></div>
            <div class="roul-bet__key roul-bet-key">${roulID.get(id)}</div>
            <div class="roul-bet__value roul-bet-value">${formatNum(value)}</div>
          </div>
        `);
      }
      win() {
        this.target.classList.add('__win');
        this.target.scrollIntoViewIfNeeded(false);
      }
      submit() {
        this.target.dataset.status = this.status = 0;
        return formData.send(this);
      }
      onLoadEnd(status) {
        this.target.dataset.status = this.status = status;
        recount();
      }
    }

    function createBet(ind, data) {
      Object.assign(this, data);
      this.target = [Bet, Bet2][ind].create(data);
      getBets(ind).push(this);
      bodyElems[ind].prepend(this.target);
    }

    function clearBets(ind = 0) {
      getBets(ind).splice(0);
      bodyElems[ind].innerHTML = '';
      sumElems[ind].textContent = '0';
    }

    function updateBetsSum(ind = 0) {
      const sum = reduceBets(getBets(ind));
      sumElems[ind].textContent = formatNum(sum);
    }

    function recount() {
      const {completed} = this.data;
      const countElem = tabElems[1].firstElementChild;
      countElem.textContent = `${completed.length} / ${bets2.length}`;
    }

    return {
      __init__() {
        recount = recount.bind(this);

        target.addEventListener('click', (e) => {
          e.stopPropagation();
          if (locked) return;

          const trg = e.target;

          if (trg.matches('.roul-bets__tab')) {
            this.switchTab(getElemIndex(trg));
            return;
          }

          if (trg.matches('.roul-bets__action')) {
            this[trg.dataset.action]();
            return;
          }

          if (trg.matches('.roul-bet__action')) {
            const bet = this.find('target', trg.parentNode);
            bet[trg.dataset.action](e.ctrlKey);
            return;
          }

          if (trg.matches('[data-status="2"] > .roul-bet__status')) {
            const bet = this.find('target', trg.parentNode, bets2);
            return bet.submit().catch(er => {
              bet.onLoadEnd(2);
              return logError.disconnect(er);
            });
          }
        });

        if (!initialBets.length) return;

        initialBets.forEach((bet) => new Bet2(bet.id, bet.value, 1));
        this.switchTab(1);
        updateBetsSum(1);
        recount();
      },
      MIN,
      MAX,
      lastBets: [],
      get data() {
        return {
          get completed() {
            return bets2.filter((bet) => bet.status === 1);
          },
          get failed() {
            return bets2.filter((bet) => bet.status === 2);
          }
        };
      },
      get sum() {
        return reduceBets(bets1) + reduceBets(bets2);
      },
      get multiplier() {
        const multiplier = roulTools.activeCoinValue;
        const value = multiplier === 'MAX'
          ? this.MAX - this.sum
          : multiplier === 'MIN'
          ? this.MIN
          : +multiplier;

        return clamp(1, value, roulCash);
      },
      switchTab(ind) {
        if (tabIndex === ind) return;

        tabIndex = ind;
        inactiveElem(tabElems[ind ^ 1]);
        activeElem(tabElems[ind]);
        contElems[0].hidden = !!ind;
        contElems[1].hidden = !ind;
      },
      find(key, value, bets = bets1) {
        return bets.find(bet => bet[key] === value);
      },
      add() {
        const bet = new Bet(...arguments);
        bet.refresh(0);
        return bet;
      },
      cancel() {
        this.clearTableBets();
        roulCash.update();
      },
      accept() {
        const bets = bets1.map(bet => new Bet2(bet.id, bet.value));
        const snakeIndex = bets.findIndex(bet => bet.id === 'Red Snake');
        snakeIndex > 0 && bets.unshift(bets.splice(snakeIndex, 1)[0]);

        this.clearTableBets();
        this.switchTab(1);
        updateBetsSum(1);

        return this.acceptSequentially(bets).catch((er) => {
          bets.splice(0).forEach((bet) => bet.onLoadEnd(2));
          logError.disconnect(er);
          return er;
        });
      },
      acceptSequentially(bets) {
        return new Promise(function next(resolve, reject) {
          if (locked) bets.splice(0).forEach((bet) => bet.onLoadEnd(2));
          if (!bets.length) return resolve(roulBets.data.failed);

          const bet = bets.pop();
          return bet.submit()
            .then(() => wait(0.2))
            .then(() => next(resolve, reject))
            .catch((er) => {
              bet.onLoadEnd(2);
              return reject(er);
            });
        });
      },
      clearTableBets() {
        clearBets(0);
        roulAPI.clear();
      },
      clear() {
        clearBets(1);
        this.clearTableBets();
        recount();
      },
      updateMinMax(MIN, MAX) {
        Object.assign(this, { MIN, MAX })
        $('#roul-minbet').lastChild.textContent = formatNum(MIN);
        $('#roul-maxbet').lastChild.textContent = formatNum(MAX);
      }
    };
  })($('#roul-bets'));

  function mergeBets(bets, callback) {
    const data = new Map;

    bets.forEach((bet) => {
      const bet2 = data.get(bet.id);
      if (!bet2) return data.set(bet.id, bet);

      bet2.value += bet.value;
      callback && callback(bet2, bet);
    });

    return [...data.values()];
  }

  function rebet(bets) {
    const sum = bets.reduce((a, b) => a + b.value, 0);
    if (!(sum && checkMoney(sum))) return false;

    roulBets.switchTab(0);

    let lastBet = null;

    bets.forEach((bet, i) => {
      lastBet = roulBets.find('id', bet.id);
      if (lastBet) return lastBet.refresh(bet.value);

      roulAPI.select(bet.id);
      lastBet = roulBets.add(bet.id, bet.value);
    });

    lastBet.select();
    return true;
  }

  // =============== [[ GAMES ]]

  const roulGames = ((target) => {
    let activeGame = null;
    const infoElem = target.firstElementChild;
    const bodyElem = target.lastElementChild.firstElementChild;
    const [betsElem, footer] = infoElem.children;

    footer.appendChild(parseNode(getBetTemplate({
      id: 'Итого',
      value: 0,
      prize: 0,
    })));

    const allSumElem = footer.firstElementChild.lastElementChild;

    const toggleInfo = infoElem.classList.toggle.bind(
      infoElem.classList,
      '__shown'
    );

    const getDefaultGameData = elem => ({
      gameId: elem.search.slice(4),
      number: elem.textContent,
      totalBet: 0,
      totalPrize: 0
    });

    function updateSum(game) {
      allSumElem.dataset.bet = formatNum(game.totalBet);
      allSumElem.dataset.prize = formatNum(game.totalPrize);
    }

    function getBetTemplate(bet) {
      const value = formatNum(bet.value);
      const prize = formatNum(bet.prize);
      const selected = bet.prize ? ' __selected' : '';

      return /*html*/`
        <div class="roul-game-bet roul-box-row${selected}">
          <div class="roul-game-bet__key roul-bet-key">${roulID.get(bet.id)}</div>
          <div class="roul-game-bet__value roul-bet-value" data-bet="${value}" data-prize="${prize}"> / </div>
        </div>
      `;
    }

    function hwmGameToObject(table, data) {
      const bets = [];
      const rows = table.children;

      for (let i = 1; i < 30; i++) {
        const row = rows[i];

        if (i === 1) {
          if (row.textContent.startsWith('Все')) break;
          i++;
          continue;
        }

        if (row.childElementCount === 3) {
          data.totalBet = parseNum(row.firstElementChild.textContent);
          data.totalPrize = parseNum(row.lastElementChild.textContent);
          break;
        }

        const nodes = row.children;
        const id = nodes[2].textContent;
        const value = parseNum(nodes[0].textContent);
        const prize = parseNum(nodes[3].textContent);
        bets.push({ id, value, prize });
      }

      data.bets = !bets.length ? null : mergeBets(bets, (bet1, bet2) => {
        bet1.prize += bet2.prize;
      });

      return data;
    }

    return {
      __init__() {
        let isLoading = false;

        target.addEventListener('mouseleave', this.hide.bind(this));

        bodyElem.addEventListener('mouseover', (e) => {
          e.stopPropagation();

          const trg = e.target;
          trg.matches('.roul-game[href]') && this.showGame(trg);
        });

        bodyElem.nextElementSibling.addEventListener('click', (e) => {
          const button = e.currentTarget;
          if (isLoading) return;

          isLoading = true;
          const add = ([gameId, number]) => this.add({gameId, number});

          this.loadPrevGames().then((games) => {
            button.remove();
            bodyElem.innerHTML = '';
            games.reverse().forEach(add);
          }).catch((er) => {
            isLoading = false;
            logError.disconnect(er);
          });
        });

        const repeatButton = parseNode(
          '<div id="roul-game-repeat" title="Повторить ставки">&larr;</div>'
        );
        footer.prepend(repeatButton);

        repeatButton.addEventListener('click', () => {
          if (!activeGame || locked) return;
          attempt(activeGame.__gameData.bets, rebet);
        });
      },
      get lastGame() {
        return attempt($('a[href]', bodyElem), elem => {
          return elem.__gameData || getDefaultGameData(elem);
        });
      },
      hide() {
        attempt(activeGame, inactiveElem);
        activeGame = null;
        toggleInfo(false);
      },
      add(data) {
        const {gameId, number} = data;
        const create = parseNode.bind(null, '<a class="roul-game"></a>');
        const elems = [...Array(3)].map(create);
        const elem = elems[RED_NUMBERS.includes(+number) ? 2 : !!+number ^ 1];

        elem.textContent = number;
        elem.href = `/inforoul.php?id=${gameId}`;
        elem.target = '_blank';

        bodyElem.parentNode.scrollTop = 0;
        bodyElem.prepend(...elems);

        if (data.hasOwnProperty('bets')) elem.__gameData = data;
      },
      async showGame(elem) {
        attempt(activeGame, inactiveElem);
        activeGame = elem;

        const gameData = elem.__gameData
          || await this.loadGame(elem).catch(er => er);

        if (gameData instanceof Error) {
          elem.classList.remove('__loading');
          logError.disconnect(gameData);
          return;
        }

        if (elem !== activeGame) return;

        if (gameData.bets) {
          betsElem.innerHTML = gameData.bets.map(getBetTemplate).join('');
          updateSum(gameData);
        } else betsElem.innerHTML = '';

        activeElem(elem);
        toggleInfo(true);
      },
      async loadGame(elem) {
        elem.classList.add('__loading');

        const data = getDefaultGameData(elem);
        const doc = await fetch.get(`/inforoul.php?id=${data.gameId}`);
        const table = $('table.wbwhite > tbody', doc);

        elem.classList.remove('__loading');
        return (elem.__gameData = hwmGameToObject(table, data));
      },
      async loadPrevGames() {
        const doc = await fetch.get('/allroul.php');

        return $$('table.wb > tbody > tr', doc).slice(1).map(row => {
          const gameId = row.firstElementChild.firstElementChild.search.slice(4);
          const number = row.lastElementChild.textContent.trim();
          return [gameId, number];
        });
      }
    };
  })($('#roul-games'));

  // =============== [[ ROULETTE ]]

  const roulAPI = ((target, data) => {
    const targets = document.getElementsByClassName('__target');
    const styles = [0, 0].map(() => document.createElement('style'));
    container.firstElementChild.after(...styles);

    const getID = el => el.dataset.id;
    const getCSS = ind => `{background-color: var(--highlight-color-${ind})}`;

    const getHighlightedCSS = memoize(id => {
      return getSelectors(id).join(',') + getCSS(1);
    });

    function getSelectors(id) {
      const items = data[id].items;
      return items.map(item => `[data-id="${getID(item)}"]`);
    }

    function reselectTargetItems() {
      const selectrors = Array.from(targets, el => getSelectors(getID(el)));
      const css = !selectrors.length ? '' : selectrors.join(',') + getCSS(2);
      styles[0].textContent = css;
    }

    return {
      target,
      data,
      find: (id) => data[id],
      highlight(id) {
        styles[1].textContent = getHighlightedCSS(id);
      },
      unhighlight() {
        styles[1].textContent = '';
      },
      select(id) {
        data[id].target.classList.add('__target');
        reselectTargetItems();
      },
      unselect(id) {
        data[id].target.classList.remove('__target');
        reselectTargetItems();
      },
      clear() {
        styles[0].textContent = styles[1].textContent = '';
        [...targets].forEach(el => el.classList.remove('__target'));
      }
    };
  })($('#roulette'), {});

  const roulette = ((target, that) => {
    const elems = $$('.roul-area');

    ['00', '0'].forEach(num => setData(elems.shift()));

    function setData(target, isOutside = false) {
      const {id} = target.dataset;
      const factor = id[0] === 'S' ? 36 : /Col|Doz/.test(id) ? 3 : 2;
      const dispatcher = isOutside ? outsideData[id] : (() => [target]);
      that[id] = createData(id, factor, target, dispatcher);
    }

    function createData(id, factor, target, dispatcher) {
      return {
        id,
        factor,
        target,
        get items() {
          return dispatcher();
        }
      };
    }

    function dispatch(callback) {
      let items = null;
      return () => items || (items = callback());
    }

    const insideElems = elems.slice(0, 36);
    const outsideElems = elems.slice(36);

    const boundSlice = (...values) => elems.slice.bind(insideElems, ...values);
    const boundFilter = fn => elems.filter.bind(insideElems, fn);

    const not = fn => (...args) => !fn(...args);
    const orderIsEqual = (div, rem) => (x, i) => i % div === rem;
    const isEven = orderIsEqual(2, 1);
    const isRed = el => RED_NUMBERS.includes(+el.dataset.id.slice(12));

    const outsideData = {
      '1st Column': dispatch(boundFilter(orderIsEqual(3, 2))),
      '2nd Column': dispatch(boundFilter(orderIsEqual(3, 1))),
      '3rd Column': dispatch(boundFilter(orderIsEqual(3, 0))),
      '1st Dozen': dispatch(boundSlice(0, 12)),
      '2nd Dozen': dispatch(boundSlice(12, 24)),
      '3rd Dozen': dispatch(boundSlice(24)),
      '1-18 Half': dispatch(boundSlice(0, 18)),
      'EVEN': dispatch(boundFilter(isEven)),
      'RED': dispatch(boundFilter(isRed)),
      'BLACK': dispatch(boundFilter(not(isRed))),
      'ODD': dispatch(boundFilter(not(isEven))),
      '19-36 Half': dispatch(boundSlice(18))
    };

    roulAPI.__init__ = function() {
      insideElems.forEach(elem => setData(elem));
      outsideElems.forEach(elem => setData(elem, true));
      initChips(this.data);

      target.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        const trg = e.target;
        const {id} = trg.dataset;
        id && this.highlight(id);

        if (id && trg.matches('.__target')) setElemMoveHandler(id, trg);
        else roulTip.hide();
      });

      target.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        roulTip.hide();
        this.unhighlight();
      });

      target.addEventListener('click', (e) => {
        e.stopPropagation();
        if (locked) return;

        const elem = e.target.closest('[data-id]');
        if (!elem) return;

        const meta = e.ctrlKey;
        const {id} = elem.dataset;
        const {multiplier} = roulBets;
        const isMaxCoin = roulTools.activeCoinValue === 'MAX';
        const isSnake = id === 'Red Snake';
        const minSnakeBet = roulBets.MIN * 12;
        const bet = roulBets.find('id', id);

        if (!bet) {
          if (meta) return;

          const value = isSnake
            ? clamp(minSnakeBet, multiplier * (isMaxCoin ? 1 : 12))
            : clamp(roulBets.MIN, multiplier);

          if (!checkMoney(value)) return;

          roulBets.add(id, value).select();
          return after.call(this);
        }

        if (!testBet.call(this, isSnake ? minSnakeBet : roulBets.MIN)) return;

        bet.refresh(meta ? -multiplier : multiplier);
        bet.select();
        after.call(this);

        function testBet(min) {
          if (!meta) return checkMoney(multiplier);
          if (!(isMaxCoin || bet.value - multiplier < min)) return true;

          bet.remove();
          roulTip.hide();
          this.unselect(id);
        }

        function after() {
          this.select(id);
          roulBets.switchTab(0);
          setElemMoveHandler(id, elem);
          elem.onmousemove(e);
        }
      });

      function setElemMoveHandler(id, elem) {
        elem.onmousemove = (e) => {
          elem.matches('.__target') && roulTip.show(e, id);
        };
        elem.onmouseleave = () => {
          elem.onmouseleave = elem.onmousemove = null;
        };
      }
    };

    return that;
  })(roulAPI.target, roulAPI.data);

  function initChips(that) {
    const factors = {
      Split: 18,
      Street: 12,
      Numbers: 12,
      Corner: 9,
      Sixline: 6
    };

    function getItems(nums) {
      return nums.map(num => that[`Straight up ${num}`].target);
    }

    function add(target, id, factor, nums) {
      let items = null;

      that[id] = {
        id,
        factor,
        target,
        get items() {
          return items || (items = getItems(nums));
        }
      };
    }

    function streetline(target, id, factor, start) {
      const nums = [...Array(factor === 6 ? 6 : 3)].map((x, i) => start - i);
      return add(target, id, factor, nums);
    }

    const chips = $$('.roul-chip');
    add(chips.pop(), 'Red Snake', 3, [1, 5, 9, 12, 14, 16, 19, 23, 27, 30, 32, 34]);

    chips.forEach((chip) => {
      const {id} = chip.dataset;
      const key = id.split(' ', 1)[0];
      const nums = id.match(/\d+/g);

      switch (key) {
        case 'Street':
        case 'Sixline':
          return streetline(chip, id, factors[key], +nums.pop());
        case 'Split':
        case 'Corner':
        case 'Numbers':
          return add(chip, id, nums.length === 5 ? 7 : factors[key], nums);
      }
    });
  }

  // =============== [[ TIP ]]

  const roulTip = ((target) => {
    const htmlElem = document.documentElement;
    const getClientWidth = () => htmlElem.clientWidth;

    return {
      move(x, y) {
        target.style.transform = `translate(${~~x}px, ${~~y}px)`;
      },
      show(e, id) {
        target.textContent = roulID.get(id);
        target.dataset.value = formatNum(roulBets.find('id', id).value);

        const maxX = getClientWidth() - target.offsetWidth - 5;
        const maxY = view.innerHeight - target.offsetHeight;
        const x = Math.min(e.clientX + 10, maxX);
        const y = Math.min(e.clientY + 10, maxY);

        this.move(x, y);
      },
      hide() {
        if (this.shown) target.textContent = '';
      },
      get shown() {
        return !!target.offsetWidth;
      }
    };
  })($('#roul-tip'));

  // =============== [[ WHEEL ]]

  const roulWheel = ((target) => {
    let isLoading = false;
    let isNumDefined = false;
    let prevSegment = null;

    const segments = [...$('#wheel__segments').children];
    const altSegments = segments.map((el) => el.cloneNode());
    const wheelClasses = target.classList;
    const wheelMain = target.firstElementChild;
    const wheelStyle = wheelMain.style;
    const ballStyle = wheelMain.nextElementSibling.style;
    const infoElem = target.lastElementChild;

    const fix3 = (num) => +num.toFixed(3);
    const getTurn = (style) => parseFloat(style.getPropertyValue('--turn') || '0');
    const setTurn = (style, turn) => style.setProperty('--turn', fix3(turn));
    const recalcTurn = (style, plus) => setTurn(style, plus + getTurn(style));
    const resetTurnToMin = (style) => setTurn(style, getTurn(style) % 1);

    const getSegment = memoize(number => {
      const index = segments.findIndex(el => el.dataset.num === number);
      const [r, g, b] = ['#ba3535', '#43914b', '#222'];
      return {
        number,
        color: !+number ? g : RED_NUMBERS.includes(+number) ? r : b,
        turn: getTurn(segments[index].style),
        segment: segments[index],
        altSegment: altSegments[index]
      };
    });

    const wrapper = parseNode(/*html*/`
      <div id="wheel-wrap">
        <div id="wheel" class="mini-wheel">
          <div id="wheel__main">
            <div id="wheel__segments"></div>
          </div>
        </div>
      </div>
    `);

    const miniWheel = wrapper.firstElementChild;
    const miniWheelStyle = miniWheel.firstElementChild.style;

    miniWheel.firstElementChild.firstElementChild.append(...altSegments);
    target.after(wrapper);

    function calcBallTurn() {
      const turn = getTurn(wheelStyle);
      const val = ~~turn + fix3(Math.ceil(turn) - turn);
      setTurn(ballStyle, val - prevSegment.turn);
    }

    function waitForResult(endTime) {
      if (isNumDefined) return stoping();

      [wheelStyle, ballStyle].forEach((style) => recalcTurn(style, 2));
      !(isLoading || endTime - Date.now() > 0) && defineNumber();
      setTimeout(waitForResult, 2e3, endTime);
    }

    async function defineNumber() {
      isLoading = true;
      const {gameId} = formData;
      const doc = await fetch.get(`/inforoul.php?id=${gameId}`).catch(er => er);

      if (doc instanceof Error) {
        return logError.disconnect(doc, {
          text: 'Попробовать снова (закончить раунд)?',
          callback() {
            roulAlert.hide();
            defineNumber();
          }
        });
      }

      const elem = $('td.wbwhite > div:last-child', doc);
      if (!elem) return (isLoading = false);

      isNumDefined = true;
      const number = elem.textContent.split(' ').pop();
      prevSegment = getSegment(number);
      console.log(`${gameId}: ${number}`);
    }

    function stoping() {
      wheelClasses.add('__spinending');
      miniWheel.classList.add('__spinending');

      recalcTurn(wheelStyle, 2 + Math.random() * 0.2);
      calcBallTurn();
      setTurn(miniWheelStyle, 2 - prevSegment.turn);

      wrapper.style.visibility = 'visible';
      wait(5).then(roulWheel.endSpin);
    }

    function spinAfter(game) {
      const scoreElem = infoElem.lastElementChild;
      scoreElem.hidden = !game.bets;
      scoreElem.dataset.score = formatNum(game.totalPrize);

      roulGames.add(game);
      roulCash.value += game.totalPrize;
      wait(3.5).then(next);

      function next() {
        return loadNextGame().then(startGame).catch(er => {
          logError.disconnect(er, {
            text: 'Попробовать снова (начать следующую игру)?',
            callback() {
              roulAlert.hide();
              next();
            }
          });
        });
      }
    }

    return {
      onGameStart() {
        wrapper.style.visibility = '';
        setTurn(miniWheelStyle, 0);
        [prevSegment.segment, prevSegment.altSegment].forEach(inactiveElem);
      },
      startSpin(endTime) {
        locked = true;
        isNumDefined = isLoading = false;
        document.title = 'Roulette | spining . . .';

        container.classList.add('__locked');
        wheelClasses.add('__spining');

        roulBets.clearTableBets();
        roulBets.switchTab(1);

        setTimeout(waitForResult, 50, endTime);
      },
      endSpin() {
        wheelClasses.remove('__spining', '__spinending');
        miniWheel.classList.remove('__spinending');
        [wheelStyle, ballStyle].forEach(resetTurnToMin);
        [prevSegment.segment, prevSegment.altSegment].forEach(activeElem);

        document.title = `Roulette | Number ${prevSegment.number}`;
        infoElem.firstElementChild.textContent = prevSegment.number;
        infoElem.style.backgroundColor = prevSegment.color;

        container.classList.add('__result');
        endGame(prevSegment.number, spinAfter);
      }
    };
  })($('#wheel'));

  // =============== [[ ALERT ]]

  const roulAlert = ((target) => {
    const body = target.firstElementChild.firstElementChild;
    const button = body.nextElementSibling;

    function onCloseHandler({key}) {
      return key === 'Escape' && this.hide();
    }

    return {
      __init__() {
        onCloseHandler = onCloseHandler.bind(this);

        target.addEventListener('click', (e) => {
          e.stopPropagation();
          const trg = e.target;
          const {action} = trg.dataset;
          action && this[action]();
        });
      },
      show(html) {
        body.innerHTML = html;
        target.classList.add('__shown');
        document.addEventListener('keydown', onCloseHandler);
        setTimeout(button.focus.bind(button), 50);
      },
      hide() {
        target.classList.remove('__shown');
        document.removeEventListener('keydown', onCloseHandler);
      },
      notEnoughMoney() {
        this.show('Недостаточно денег!');
      },
      outOfRange() {
        const sum = `<b style="color:gold">${formatNum(roulBets.MAX)}</b>`;
        this.show(`Сумма ставок не может превышать ${sum}`);
      }
    };
  })($('#roul-alert'));

  // =============== [[ TOOLS ]]

  const roulTools = ((target) => {
    let activeCoinValue = '100';

    return {
      __init__() {
        target.addEventListener('click', (e) => {
          e.stopPropagation();
          if (locked) return;

          const trg = e.target;
          const {action} = trg.dataset;
          this[action] && this[action](trg);
        });
      },
      get activeCoin() {
        return $('.roul-coin.__active', target);
      },
      get activeCoinValue() {
        return activeCoinValue;
      },
      setMultiplier(coin) {
        attempt(this.activeCoin, inactiveElem);
        activeElem(coin);
        activeCoinValue = coin.dataset.coin;
      },
      rebet() {
        return rebet(roulBets.lastBets);
      }
    };
  })($('#roul-tools'));

  // =============== [[ TIMER ]]

  const roulTimer = createTimer($('#roul-timer'), {
    onTick(timer) {
      document.title = `Roulette | ${timer}`;
      timer.value <= 10 && timer.target.classList.add('__blink');
    },
    onStop(timer) {
      timer.target.classList.remove('__blink');
      roulWheel.startSpin(timer.endTime);
    }
  });

  function createTimer(target, props) {
    const format = (num) => num > 9 ? num : `0${num}`;
    const getValue = (sec) => Math.max(0, sec - 10);

    let playState = false;
    let startTime = 0;
    let endTime = 0;
    let timeVal = 0;
    let timerId = 0;

    function stringify(value) {
      const min = format(value / 60 >> 0);
      const sec = format(value % 60);
      return `${min}:${sec}`;
    }

    function clear() {
      playState = false;
      clearTimeout(timerId);
    }

    function ticking() {
      timeVal = getValue((endTime - Date.now()) / 1e3 >> 0);
      target.textContent = stringify(timeVal);
      props.onTick(that);
      timerId = setTimeout(ticking, 1e3);

      if (!timeVal) {
        clear();
        props.onStop(that);
      }
    }

    function resetTimeStamps() {
      startTime = Date.now();
      endTime = startTime + formData.restSeconds * 1e3;
    }

    const that = {
      target,
      get value() {
        return timeVal;
      },
      get endTime() {
        return endTime;
      },
      start() {
        if (playState) return;
        if (!startTime) resetTimeStamps();

        playState = true;
        ticking();
      },
      pause() {
        return playState && clear();
      },
      reset() {
        resetTimeStamps();
        this.pause();
        this.start();
      },
      toString() {
        return stringify(this.value);
      }
    };

    return that;
  }

  // =========================

  function endGame(number, callback) {
    const numElem = roulette[`Straight up ${number}`].target;
    numElem.id = 'winner';

    const bets = mergeBets(roulBets.data.completed);

    const game = {
      number,
      gameId: formData.gameId,
      totalBet: reduceBets(bets),
      totalPrize: 0,
      bets: null
    };

    if (!bets.length) return callback(game);

    game.bets = bets.map((bet) => ({
      id: bet.id,
      value: bet.value,
      prize: ~~attempt(roulette[bet.id], data => {
        const test = data.items.includes(numElem);
        test && bet.win();
        return test ? bet.value * data.factor : 0;
      })
    }));

    game.totalPrize = reduceBets(game.bets, 'prize');
    callback(game);
  }

  function startGame() {
    locked = false;

    attempt(roulGames.lastGame.bets, bets => (roulBets.lastBets = [...bets]));
    attempt($('#winner'), el => el.removeAttribute('id'));
    container.classList.remove('__result', '__locked');

    roulBets.clear();
    roulDensity.clear();
    roulTimer.reset();
    roulWheel.onGameStart();
  }

  function loadNextGame() {
    return fetch.get(PATH).then((doc) => {
      if (!doc.URL.includes(PATH)) {
        throw logError.create(-1, 'Authorization error');
      }

      const [min, max, cash] = getMinMaxCash(doc);
      roulBets.MAX !== max && roulBets.updateMinMax(min, max);
      roulCash.value = cash;
      formData.update(doc.forms[0]);
    });
  }

  // =========================

  container.addEventListener('mouseover', (e) => {
    e.stopPropagation();

    const trg = e.target;
    if (!trg.matches('.roul-bet-key')) return;

    const key = trg.textContent;
    const id = roulID.keys.find(k => roulID[k] === key) || key;
    const roulElem = roulette[id].target;

    roulAPI.highlight(id);

    trg.onmouseleave = () => {
      trg.onmouseleave = null;
      roulAPI.unhighlight();
    };
  });

  document.addEventListener('keydown', (e) => {
    if (locked || !/Numpad[1-9]/.test(e.code)) return;
    e.preventDefault();
    roulTools.setMultiplier($(`.roul-coin:nth-child(${e.code.slice(6)})`));
  });

  // Чтобы не забивать асинхронный стек и память
  // глупым тяжеловесным админским кодом
  if (!modules.HWM_new_header) stopHeartWhenNeeded();

  function stopHeartWhenNeeded() {
    if (!view.hasOwnProperty('top_line_draw_canvas_heart')) return;

    const target = $('#health_amount');
    const nativeSetTimeout = view.setTimeout;
    const hwmHeartBeatFnName = 'run_top_line_heart_timer';

    view.setTimeout = function(handler, delay, ...args) {
      if (!handler) return nativeSetTimeout(null);
      if (handler.name === hwmHeartBeatFnName) return heartBeat(...arguments);
      return nativeSetTimeout(handler, delay, ...args);
    };

    function heartBeat() {
      if (target.textContent === '100') {
        view.setTimeout = nativeSetTimeout;
        return nativeSetTimeout(null);
      } else return nativeSetTimeout(...arguments);
    }
  }

  // =========================

  roulTools.__init__();
  roulBets.__init__();
  roulGames.__init__();
  roulDensity.__init__();
  roulAlert.__init__();
  roulAPI.__init__();

  roulTimer.start();
})(document.defaultView);
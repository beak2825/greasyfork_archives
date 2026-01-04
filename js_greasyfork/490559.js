// ==UserScript==
// @name         Adminer Enhancement
// @namespace    http://forhot2000.cn/
// @version      0.1.1
// @description  format numbers and date time values
// @author       forhot2000@qq.com
// @license      MIT
// @grant        none
// @match        http://wedb-dbm.forhot2000.cn:8080/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIRJREFUOE/lk8ENgDAIRWVCd3Awd3BCDAgEsIUmHu2thP8KnwLbxwMrekTEUR7Q6QAmplTiqESYJeAl9q8J0ACzMvnF3IGLMUDFsB+hI7zO5z6CcFg8IACJTSCYEPMQLT8DRoZmaLRhsYJqWuZB1cJfADzuyT9oPfCfKY+y25d2mbpluwEYtncFnvC7DAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/490559/Adminer%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/490559/Adminer%20Enhancement.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const INT_REG = /^\d+$/;
  function isInt(val) {
    return INT_REG.test(val);
  }

  const DATE_MIN = new Date('2020-01-01').getTime();
  const DATE_MAX = new Date('2050-01-01').getTime();

  function isMilliseconds(val) {
    return val >= DATE_MIN && val < DATE_MAX;
  }

  function isSeconds(val) {
    val *= 1000;
    return val >= DATE_MIN && val < DATE_MAX;
  }

  function fmtTimestamp(val) {
    const d = new Date(val);
    return d.toISOString();
  }

  function fmtUnixTime(val) {
    const d = new Date(val * 1000);
    return d.toISOString();
  }

  function fmtInt1(val) {
    const s = val.toString();
    const len = s.length;
    const tmp = [];
    const n = Math.ceil(len / 3);
    const m = len % 3;
    const offset = m === 0 ? 0 : 3 - m;
    for (let i = 0; i < n; i++) {
      tmp[i] = s.substring(Math.max(0, i * 3 - offset), Math.max(0, (i + 1) * 3 - offset));
    }
    return tmp.join(',');
  }

  const UNITS = ['K', 'M', 'G', 'T'];
  const THROTTLERS = [900, 900_000, 900_000_000, 900_000_000_000];
  const VALUES = [1 << 10, 1 << 20, 1 << 30, 1 << 40];
  function fmtInt2(val) {
    let p = -1;
    for (let i = 0; i < THROTTLERS.length; i++) {
      if (val < THROTTLERS[i]) {
        p = i - 1;
        break;
      }
    }
    return p < 0 ? val.toString() : (val / VALUES[p]).toFixed(2) + UNITS[p];
  }

  if (typeof document !== 'undefined') {
    const DATA_VALUE = 'data-value';
    const INT_FIELDS = /time|length|rows|desc/i;
    const TYPE_AUTO = 'auto';
    const TYPE_STRING = 'string';
    const TYPE_INT = 'int';
    const TYPE_SECONDS = 'seconds';
    const TYPE_MILLISECONDS = 'milliseconds';

    const $table = document.querySelector('table#table');
    const $headerRow = $table.querySelector('thead>tr');
    const $rows = Array.from($table.querySelectorAll('tbody>tr')).map(function ($row) {
      return Array.from($row.querySelectorAll('td'));
    });
    const columns = Array.from($headerRow.querySelectorAll('td,th')).map(function (el) {
      const name = el.innerText;
      return {
        name: name,
        type: INT_FIELDS.test(name) ? TYPE_AUTO : TYPE_STRING,
        flags: {
          maybeInt: true,
          maybeMilliseconds: true,
          maybeSeconds: true,
        },
      };
    });
    $rows.forEach(function ($cells) {
      $cells.forEach(function ($cell, colIndex) {
        if (!$cell.hasAttribute(DATA_VALUE)) {
          $cell.setAttribute(DATA_VALUE, $cell.innerText);
        }
        const val = $cell.getAttribute(DATA_VALUE);
        const col = columns[colIndex];
        if (col.type === TYPE_AUTO) {
          if (!isInt(val)) {
            col.flags.maybeInt = false;
          } else {
            if (!isMilliseconds(val)) {
              col.flags.maybeMilliseconds = false;
            }
            if (!isSeconds(val)) {
              col.flags.maybeSeconds = false;
            }
          }
        }
      });
    });

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (col.type === TYPE_AUTO) {
        if (col.flags.maybeInt) {
          if (col.flags.maybeMilliseconds) {
            col.type = TYPE_MILLISECONDS;
          } else if (col.flags.maybeSeconds) {
            col.type = TYPE_SECONDS;
          } else {
            col.type = TYPE_INT;
          }
        } else {
          col.type = TYPE_STRING;
        }
      }
      delete col.flags;
    }
    console.log(columns);

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const updateCell = function (callback) {
        $rows.forEach(function ($cells) {
          const $cell = $cells[i];
          const val = $cell.getAttribute(DATA_VALUE);
          $cell.innerText = callback(val, $cell);
        });
      };
      switch (col.type) {
        case TYPE_MILLISECONDS: {
          updateCell(function (origin) {
            const val = parseInt(origin);
            const txt = fmtTimestamp(val);
            return `${origin} [${txt}]`;
          });
          break;
        }
        case TYPE_SECONDS: {
          updateCell(function (origin) {
            const val = parseInt(origin);
            const txt = fmtUnixTime(val);
            return `${origin} [${txt}]`;
          });
          break;
        }
        case TYPE_INT: {
          updateCell(function (origin) {
            const val = parseInt(origin);
            const txt = fmtInt2(val);
            if (txt === origin) {
              return origin;
            }
            return `${origin} [${txt}]`;
          });
          break;
        }
      }
    }
  }
})();

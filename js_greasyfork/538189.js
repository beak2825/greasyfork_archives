// ==UserScript==
// @name         ATP ITP Tour Statistics
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Skript vytvářející dvě tabulky se statistikami + přidává i api s Hawkeye
// @author       MK, MH
// @match        https://itp-atp-sls.infosys-platforms.com/prod/api/stats-plus/v1/keystats/year/*
// @match        https://www.atptour.com/en/scores/stats-centre/live/*
// @icon         https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1415386231/utypaslbyxwfuwhfdzxd.png
// @grant        GM_xmlhttpRequest
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/538189/ATP%20ITP%20Tour%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/538189/ATP%20ITP%20Tour%20Statistics.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const currentUrl = window.location.href;

  if (currentUrl.includes('itp-atp-sls.infosys-platforms.com')) {
    handleEncryptedSource();
  } else if (currentUrl.includes('atptour.com/-/Hawkeye/MatchStats')) {
    handleAtpSource();
  }

  function handleEncryptedSource() {
    function loadCryptoJSAndRun() {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
      script.onload = runScriptKeystats;
      document.head.appendChild(script);
    }

    function decode(data) {
      const e = formatDate(new Date(data.lastModified));
      const n = CryptoJS.enc.Utf8.parse(e);
      const r = CryptoJS.enc.Utf8.parse(e.toUpperCase());

      const decrypted = CryptoJS.AES.decrypt(data.response, n, {
        iv: r,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    }

    function formatDate(t) {
      const e = new Date().getTimezoneOffset();
      const n = new Date(t.getTime() + 60 * e * 1000).getDate();
      const r = parseInt((n < 10 ? '0' + n : n).toString().split('').reverse().join(''));
      const i = t.getFullYear();
      const a = parseInt(i.toString().split('').reverse().join(''));
      let o = parseInt(t.getTime().toString(), 16).toString(36) + ((i + a) * (n + r)).toString(24);
      const s = o.length;

      if (s < 14) {
        for (let c = 0; c < 14 - s; c++) o += '0';
      } else if (s > 14) {
        o = o.substr(0, 14);
      }

      return '#' + o + '$';
    }

    function runScriptKeystats() {
      const data = JSON.parse(document.querySelector('body > pre').textContent);
      const decodedData = decode(data);
      const set0Stats = decodedData.setStats.set0;

      createTable(extractKeystatsData(decodedData, set0Stats), 'keystats');
    }

    function extractKeystatsData(decodedData, set0Stats) {
      const player1 = decodedData.players[0].player1Name || 'Player 1';
      const player2 = decodedData.players[1].player1Name || 'Player 2';

      const orderedStatNames = [
        'Aces',
        'Double Faults',
        '1st Serve',
        '1st Serve Points Won',
        '2nd Serve Points Won',
        '1st Serve Return Points Won',
        '2nd Serve Return Points Won',
        'Net Points Won',
        'Winners',
        'Unforced Errors',
        'Max Speed',
        '1st Serve Average Speed',
        '2nd Serve Average Speed'
      ];

      const tableData = {
        header: ['Keystats Event', player1, player2],
        rows: []
      };

      orderedStatNames.forEach(statName => {
        const stat = set0Stats.find(s => s.name === statName);
        if (stat) tableData.rows.push([stat.name, stat.player1, stat.player2]);
      });

      return tableData;
    }

    loadCryptoJSAndRun();
  }

  function handleAtpSource() {
    function runScriptAtp() {
      try {
        const data = JSON.parse(document.querySelector('body > pre').textContent);
        createTable(extractAtpData(data), 'atp');
      } catch (error) {
        console.error('Error parsing ATP data:', error);
      }
    }

    function extractAtpData(data) {
      const matchData = data.Match || data;

      let playerTeam, opponentTeam, player1Stats, player2Stats;

      if (matchData.PlayerTeam && matchData.OpponentTeam) {
        playerTeam = matchData.PlayerTeam;
        opponentTeam = matchData.OpponentTeam;

        player1Stats = playerTeam.SetScores?.find(set => set.SetNumber === 0)?.Stats;
        player2Stats = opponentTeam.SetScores?.find(set => set.SetNumber === 0)?.Stats;
      }

      if ((!player1Stats || !player2Stats) && matchData.PlayerTeam1 && matchData.PlayerTeam2) {
        playerTeam = matchData.PlayerTeam1;
        opponentTeam = matchData.PlayerTeam2;

        player1Stats = playerTeam.Sets?.find(set => set.SetNumber === 0)?.Stats;
        player2Stats = opponentTeam.Sets?.find(set => set.SetNumber === 0)?.Stats;
      }

      if (!playerTeam || !opponentTeam || !player1Stats || !player2Stats) return null;

      const player1Name = `${playerTeam.PlayerFirstNameFull || playerTeam.PlayerFirstName || playerTeam.Player?.PlayerFirstName} ${playerTeam.PlayerLastName || playerTeam.Player?.PlayerLastName}`;
      const player2Name = `${opponentTeam.PlayerFirstNameFull || opponentTeam.PlayerFirstName || opponentTeam.Player?.PlayerFirstName} ${opponentTeam.PlayerLastName || opponentTeam.Player?.PlayerLastName}`;

      const tableData = {
        header: ['ATP Event', player1Name, player2Name],
        rows: []
      };

      const statMappings = [
        { name: 'Aces', getValue: s => s.ServiceStats?.Aces?.Number || 0 },
        { name: 'Double Faults', getValue: s => s.ServiceStats?.DoubleFaults?.Number || 0 },
        {
          name: '1st Serve', getValue: s => {
            const fs = s.ServiceStats?.FirstServe;
            return fs ? `${fs.Percent}% (${fs.Dividend}/${fs.Divisor})` : 'N/A';
          }
        },
        {
          name: '1st Serve Points Won', getValue: s => {
            const fs = s.ServiceStats?.FirstServePointsWon;
            return fs ? `${fs.Percent}% (${fs.Dividend}/${fs.Divisor})` : 'N/A';
          }
        },
        {
          name: '2nd Serve Points Won', getValue: s => {
            const ss = s.ServiceStats?.SecondServePointsWon;
            return ss ? `${ss.Percent}% (${ss.Dividend}/${ss.Divisor})` : 'N/A';
          }
        },
        {
          name: '1st Serve Return Points Won', getValue: s => {
            const fsr = s.ReturnStats?.FirstServeReturnPointsWon;
            return fsr ? `${fsr.Percent}% (${fsr.Dividend}/${fsr.Divisor})` : 'N/A';
          }
        },
        {
          name: '2nd Serve Return Points Won', getValue: s => {
            const ssr = s.ReturnStats?.SecondServeReturnPointsWon;
            return ssr ? `${ssr.Percent}% (${ssr.Dividend}/${ssr.Divisor})` : 'N/A';
          }
        },
        {
          name: 'Break Points Saved', getValue: s => {
            const bp = s.ServiceStats?.BreakPointsSaved;
            return bp ? `${bp.Percent}% (${bp.Dividend}/${bp.Divisor})` : 'N/A';
          }
        },
        {
          name: 'Break Points Converted', getValue: s => {
            const bp = s.ReturnStats?.BreakPointsConverted;
            return bp ? `${bp.Percent}% (${bp.Dividend}/${bp.Divisor})` : 'N/A';
          }
        },
        {
          name: 'Total Points Won', getValue: s => {
            const tp = s.PointStats?.TotalPointsWon;
            return tp ? `${tp.Percent}% (${tp.Dividend}/${tp.Divisor})` : 'N/A';
          }
        }
      ];

      statMappings.forEach(({ name, getValue }) => {
        tableData.rows.push([name, getValue(player1Stats), getValue(player2Stats)]);
      });

      return tableData;
    }

    runScriptAtp();
  }

  function createTable(tableData, sourceType) {
    if (!tableData) return;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .kvido-table {
        position: fixed;
        top: 60px;
        left: 360px;
        border: 3px solid black;
        background-color: white;
        font-size: 20px;
        vertical-align: middle;
        z-index: 999999999;
      }
      .kvido-table.atp {
        background-color: #f0f8ff;
        border-color: #0066cc;
      }
      .kvido-table td {
        border: 1px solid black;
        padding: 5px;
      }
      .kvido-table td:first-child {
        text-align: right;
        padding-right: 10px;
        font-weight: bold;
      }
      .kvido-table td:nth-child(n+2) {
        text-align: center;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    const table = document.createElement('table');
    table.className = `kvido-table ${sourceType}`;

    const headerRow = table.insertRow();
    tableData.header.forEach(text => {
      const cell = headerRow.insertCell();
      cell.textContent = text;
    });

    tableData.rows.forEach(row => {
      const tr = table.insertRow();
      tr.id = row[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      row.forEach(cellData => {
        const td = tr.insertCell();
        td.textContent = cellData;
      });
    });

    document.body.appendChild(table);
  }
})();
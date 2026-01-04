// ==UserScript==
// @name           rzscript
// @namespace      rzscript
// @description    Versión actualizada de MZScript
// @homepage       https://github.com/rhonaldomaster/rzscript
// @include        https://www.managerzone.com/?p=
// @grant          none
// @version        0.2
// @copyright      GNU/GPL v3
// @author         rhonaldomaster
// @credits        c_c, serbocapo
// @license        GPL-3.0-or-later
// @compatible     chrome
// @compatible     firefox
// @compatible     opera
// @compatible     safari
// @compatible     edge
// @downloadURL https://update.greasyfork.org/scripts/482697/rzscript.user.js
// @updateURL https://update.greasyfork.org/scripts/482697/rzscript.meta.js
// ==/UserScript==
const rzscript = (() => {
  const sports = ['', 'soccer', 'hockey'];

  const init = () => {
    setStyles();
    createQuickLinks();
    createForumLinks();
    setPageFunctions();
    setEvents();
    addTeamBadgeToPlayers();
  };

  const setStyles = () => {
    const css =
      '#pt-wrapper{bottom:52px;filter:alpha(opacity=50);opacity:0.5;}#notifications-wrapper{bottom:-2px;}' +
      '.quicklink{background-color:#4A4A4A;border:0;border-radius:4px;box-shadow:0 0 1px 0 #000;color:#FFF;cursor:pointer;display:inline-block;margin-left:4px;padding:2px 4px;text-decoration:none;}' +
      '.quicklink:hover{background-color:#000000;box-shadow:0 0 2px 0 #000000;color:#FFFFFF;text-decoration:none;}' +
      '.pagelinks{padding:0 4px 8px;}' +
      '.quicklinks{text-align:center;}' +
      '#fluid-menu-opener > div.sport-line,#top-wrapper-sport-line{background:#5d5b5f none repeat scroll 0 0;}' +
      '.preview-results{border:2px solid #2A4CB0;cursor:pointer;float:right;height:20px;padding:4px 0 0 4px;width:20px;}' +
      '.bbcode{margin:auto;max-width:640px;}' +
      '.player-image.soccer{position: relative;}' +
      '.player-image.soccer .player-team-badge{background-position: center; height: auto; padding: 5px; position: absolute; right: 24px; top: 44px; width: auto;}';
    if (typeof GM_addStyle != 'undefined') {
      GM_addStyle(css);
      return;
    } else if (typeof PRO_addStyle != 'undefined') {
      PRO_addStyle(css);
      return;
    } else if (typeof addStyle != 'undefined') {
      addStyle(css);
      return;
    }
    let heads = document.querySelectorAll('head');
    if (heads.length < 1) {
      return;
    }
    let node = document.createElement('style');
    node.appendChild(document.createTextNode(css));
    heads[0].appendChild(node);
  };

  // Quick links
  const createButtonLinks = (data) => {
    const container = document.querySelector(data.selector);
    if (container) {
      return;
    }
    let html =
      '<div ' +
      (data.selector.charAt(0) == '.' ? 'class' : 'id') +
      '="' +
      data.selector.replace(/\./g, '') +
      '">';
    html += data.links.reduce((prev, curr) => {
      return (
        prev +
        '<a class="quicklink" href="' +
        curr.url +
        '"' +
        (curr.url.indexOf('?p=') < 0 ? ' target="_blank"' : '') +
        ' title="' +
        curr.title +
        '">' +
        curr.text +
        '</a>'
      );
    }, '');
    html += '</div>';
    data.wrapper.insertAdjacentHTML(data.prepend ? 'afterbegin' : 'beforeend', html);
  };

  const createForumLinks = () => {
    const options = {
      selector: '.js-forum-buttons',
      wrapper: document.querySelector('#notifications-wrapper'),
      links: [
        {
          text: 'MER',
          title: 'Mercado(Transfers)',
          url: '?p=forum&sub=topics&forum_id=254&sport=soccer'
        },
        { text: 'AMI', title: 'Amistosos', url: '?p=forum&sub=topics&forum_id=249&sport=soccer' },
        { text: 'MZH', title: 'MZ Habla', url: '?p=forum&sub=topics&forum_id=253&sport=soccer' },
        {
          text: 'PYR',
          title: 'Preguntas y Respuestas',
          url: '?p=forum&sub=topics&forum_id=255&sport=soccer'
        },
        {
          text: 'DA',
          title: 'Discusi&oacute;n Abierta',
          url: '?p=forum&sub=topics&forum_id=250&sport=soccer'
        },
        {
          text: 'FED',
          title: 'Federaciones',
          url: '?p=forum&sub=topics&forum_id=251&sport=soccer'
        },
        {
          text: 'HDC',
          title: 'Hablemos de copas',
          url: '?p=forum&sub=topics&forum_id=252&sport=soccer'
        }
      ],
      prepend: false
    };
    createButtonLinks(options);
  };

  const createQuickLinks = () => {
    const options = {
      selector: '.pagelinks .quicklinks',
      wrapper: document.querySelector('#contentDiv'),
      links: [
        { text: 'Monitoreo', title: 'Monitoreo', url: '?p=transfer&sub=yourplayers' },
        { text: 'Vista Alternativa', title: 'Ver Vista Alternativa', url: '?p=players&sub=alt' },
        { text: 'Seguimiento', title: 'Ir a Seguimiento', url: '?p=shortlist' },
        { text: 'Finanzas', title: 'Ver Finanzas', url: '?p=economy' },
        { text: 'Mercado', title: 'Ver Mercado', url: '?p=transfer' },
        { text: 'Jugados', title: 'Ver los Partidos Jugados', url: '?p=match&sub=played' },
        {
          text: 'Pr&oacute;ximos',
          title: 'Ver los Pr&oacute;ximos Partidos',
          url: '?p=match&sub=scheduled'
        },
        { text: 'T&aacute;cticas', title: 'Ir a T&aacute;cticas', url: '?p=tactics' },
        {
          text: 'Lesiones/Sanciones',
          title: 'Ver Lesionados/Sancionados',
          url: '?p=players&sub=unavailable'
        },
        {
          text: 'Reporte entr.',
          title: 'Ver el Reporte de Entrenamiento',
          url: '?p=training_report'
        },
        { text: 'Entrenamiento', title: 'Ir al Entrenamiento General', url: '?p=training' },
        { text: 'Skiller', title: 'Skiller MZ Player', url: 'http://mzplayer.se' },
        { text: 'Top 11', title: 'Ir a top11', url: 'https://oxi.se/top11/' }
      ],
      prepend: true
    };
    createButtonLinks(options);
  };

  // End quick links

  // Signature
  const renderSignatureDiv = () => {
    const signature = obtainSignature();
    if (signature && localStorage.getItem('showAlwaysUserSignature')) {
      setSignature(signature, false);
    }
    let container = document.querySelector('.bbcode');
    const html =
      '<form class="js-signature-form">' +
      '<table style="width:100%;">' +
      '<tr>' +
      '<td><span>Texto</span> <small>(Usa bbcode)</small></td>' +
      '</tr>' +
      '<tr>' +
      '<td><textarea name="signature" cols="84" rows="5" style="padding:5px;">' +
      (signature ? signature : '') +
      '</textarea></td>' +
      '</tr>' +
      '<tr>' +
      '<td>' +
      '<button type="button" class="quicklink js-signature">Agregar firma</button>' +
      '<button type="button" class="quicklink js-save-signature">Guardar firma</button>' +
      '<button type="button" class="quicklink js-delete-signature">Borrar firma</button>' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '</form>';
    container.insertAdjacentHTML('beforeend', html);
  };

  const setSignature = (signature, isFromForm) => {
    let textarea = document.querySelector('.markItUpEditor');
    const put = !isFromForm && textarea.value !== '' ? false : true;
    if (!put) {
      return;
    }
    textarea.value += '\r\n\r\n';
    for (let i = 0; i <= 50; i++) {
      textarea.value += '-';
    }
    textarea.value += '\r\n' + signature;
    resetCursor(textarea);
  };

  const saveSignature = () => {
    let form = document.querySelector('.js-signature-form');
    form = JSON.parse(formToJSONString(form));
    let signature = form.signature.replace(/^(\s|\&nbsp;)*|(\s|\&nbsp;)*$/g, '');
    if (signature !== '' && signature.length > 0 && signature !== null) {
      saveUserSignature(signature);
    }
    let showAlways = window.confirm('Mostrar siempre?');
    if (showAlways) {
      localStorage.setItem('showAlwaysUserSignature', showAlways);
      return;
    }
    localStorage.removeItem('showAlwaysUserSignature');
  };

  const resetCursor = (element) => {
    if (element.setSelectionRange) {
      element.focus().setSelectionRange(0, 0);
    } else if (element.createTextRange) {
      let range = element.createTextRange();
      range.moveStart('character', 0).select();
    }
  };

  const saveUserSignature = (signature) => {
    const savedSignature = localStorage.getItem('userSignature');
    if (savedSignature != signature) {
      localStorage.setItem('userSignature', signature);
    }
  };

  const dropSignature = () => {
    localStorage.removeItem('userSignature');
    localStorage.removeItem('showAlwaysUserSignature');
    alert('La firma fue eliminada');
  };

  const putSignature = (ev) => {
    ev.preventDefault();
    let form = document.querySelector('.js-signature-form');
    form = JSON.parse(formToJSONString(form));
    let signature = form.signature.replace(/^(\s|\&nbsp;)*|(\s|\&nbsp;)*$/g, '');
    if (signature !== '' && signature.length > 0 && signature !== null) {
      setSignature(signature, true);
    }
  };

  const obtainSignature = () => {
    let signature = '';
    if (localStorage.getItem('userSignature')) {
      signature = localStorage.getItem('userSignature');
    } else if (localStorage.getItem('firmaMZ')) {
      signature = localStorage.getItem('firmaMZ');
    }
    return signature;
  };

  // End signature

  // Matches data
  const linkToSeniorLeague = () => {
    const wrapper = document.querySelector('#match-info-wrapper');
    if (!wrapper) {
      return;
    }
    let h1 = wrapper.querySelector('h1');
    const text = h1.innerHTML;
    const i18nLeague = ['Liga', 'League'];
    if (i18nLeague.indexOf(text) > -1) {
      h1.innerHTML = '<a href="?p=league&type=senior">' + text + '</a>';
    }
  };

  const getPlayerData = (teamXML, playerId) => {
    let player = null;
    const players = teamXML.getElementsByTagName('Player');
    for (let i = 0; i < players.length; i++) {
      if (playerId == players[i].getAttribute('id')) {
        player = players[i];
      }
    }
    return player;
  };

  const playersMatchValue = () => {
    if (ajaxSport == 'soccer') {
      footballMatchValues();
    } else if (ajaxSport == 'hockey') {
      hockeyMatchValues();
    }
  };

  const footballMatchValues = () => {
    let teamsDiv = document.querySelectorAll('.matchStats:not(.matchStats--detailed)');
    if (!teamsDiv) {
      return;
    }

    const teamHeadings = document.querySelectorAll('.team-table');
    for (let i = 0; i < teamHeadings.length; i++) {
      const links = teamHeadings[i].querySelectorAll('a');
      renderFootballTeamValue(links[0].href.split('&tid=')[1], teamsDiv[i]);
    }
  };

  const renderFootballTeamValue = (teamId, teamTable) => {
    if (!teamTable) {
      return;
    }
    const ajax = $.ajax({
      url: '/xml/team_playerlist.php',
      type: 'GET',
      data: { sport_id: sports.indexOf(ajaxSport), team_id: teamId }
    });
    ajax.done((data) => {
      const currency = data.getElementsByTagName('TeamPlayers')[0].getAttribute('teamCurrency');
      let playing11Value = 0,
        playing11 = 0;
      const firstRow = teamTable.querySelector('thead tr');
      const tableBody = teamTable.querySelector('tbody');
      const tableFoot = teamTable.querySelector('tfoot');
      const totalsRow = tableFoot.rows[2];

      firstRow.innerHTML = '<td>Valor</td>' + firstRow.innerHTML;
      for (let i = 0; i < tableBody.rows.length; i++) {
        if (tableBody.rows[i].querySelector('img')) {
          tableBody.rows[i].cells[0].colSpan = '16';
        } else {
          const link = tableBody.rows[i].querySelector('a');
          const playerData = link
            ? getPlayerData(data, link.href.split('&')[1].split('=')[1])
            : null;

          if (playerData) {
            let playerValue = toLocaleCurrency(playerData.getAttribute('value'), currency);
            playing11 += 1;

            const playerNameCell = tableBody.rows[i].querySelector('.player-label')?.parentElement;
            if (playerNameCell) {
              const row = playerNameCell.parentElement;
              row.innerHTML =
                '<td style="width:62px;text-align:right;padding-right:15px">' +
                formatMoney(playerValue) +
                '</td>' +
                row.innerHTML;
            }

            if (playing11 < 12) {
              playing11Value += playerValue;
            }
          }
        }
      }
      tableFoot.rows[1].cells[0].colSpan = '2';
      totalsRow.innerHTML = '<td>' + formatMoney(playing11Value) + '</td><td colspan="8"></td>';
    });
  };

  const hockeyMatchValues = () => {
    let teamsDiv = document.querySelectorAll('.team-table');
    if (!teamsDiv) {
      return;
    }
    for (let i = 0; i < teamsDiv.length; i++) {
      let links = teamsDiv[i].querySelectorAll('a');
      renderHockeyTeamValue(links[0].href.split('&')[1].split('=')[1], i);
    }
    const teamHeadings = document.querySelectorAll('.team-table');
    for (let i = 0; i < teamHeadings.length; i++) {
      const links = teamHeadings[i].querySelectorAll('a');
      renderHockeyTeamValue(links[0].href.split('&tid=')[1], teamsDiv[i]);
    }
  };

  const renderHockeyTeamValue = (teamId, teamTable) => {
    if (!teamTable) {
      return;
    }
    const ajax = $.ajax({
      url: '/xml/team_playerlist.php',
      type: 'GET',
      data: { sport_id: sports.indexOf(ajaxSport), team_id: teamId }
    });
    ajax.done((data) => {
      const currency = data.getElementsByTagName('TeamPlayers')[0].getAttribute('teamCurrency');
      let playing21Value = 0,
        playing21 = 0;
      let firstRow = teamTable.rows[0];
      let secondRow = teamTable.rows[1],
        tableBody = teamTable.querySelector('tbody');
      let tableFoot = teamTable.querySelector('tfoot'),
        totalsRow = tableFoot.rows[1];
      firstRow.cells[0].colSpan = 10;
      teamTable.rows[2].cells[0].colSpan = 19;
      secondRow.innerHTML = '<td>Valor</td>' + secondRow.innerHTML;
      let goalkeeperTable = document.querySelectorAll(
        '#match-statistics .hitlist_wrapper_background table'
      )[tableIndex + 1];
      let goalkeeperLink = goalkeeperTable.querySelector('a');
      let goalkeeperData = getPlayerData(data, goalkeeperLink.href.split('&')[1].split('=')[1]);
      let goalkeeperValue = 0;
      if (goalkeeperData) {
        goalkeeperValue = toLocaleCurrency(goalkeeperData.getAttribute('value'), currency);
      }
      for (let i = 0; i < tableBody.rows.length; i++) {
        if (tableBody.rows[i].querySelector('img')) {
          tableBody.rows[i].cells[0].colSpan = '19';
        } else {
          if (tableBody.rows[i].cells[0] !== '') {
            let link = tableBody.rows[i].querySelector('a');
            if (link) {
              let playerData = getPlayerData(data, link.href.split('&')[1].split('=')[1]);
              if (playerData) {
                let playerValue = toLocaleCurrency(playerData.getAttribute('value'), currency);
                playing21 += 1;
                tableBody.rows[i].innerHTML =
                  '<td style="width:62px;text-align:right;padding-right:15px">' +
                  formatMoney(playerValue) +
                  '</td>' +
                  tableBody.rows[i].innerHTML;
                if (playing21 < 21) {
                  playing21Value += playerValue;
                }
              }
            } else {
              tableBody.rows[i].innerHTML =
                '<td style="width:62px;text-align:right;padding-right:15px"></td>' +
                tableBody.rows[i].innerHTML;
            }
          } else if (tableBody.rows[i].cells < 2) {
            tableBody.rows[i].innerHTML =
              '<td style="width:62px;text-align:right;padding-right:15px"></td>' +
              tableBody.rows[i].innerHTML;
          }
        }
      }
      totalsRow.innerHTML =
        '<td style="width:62px;text-align:right;padding-right:15px">' +
        (formatMoney(playing21Value + goalkeeperValue) +
          '<br><small>Incluye valor de portero</small>') +
        '</td>' +
        totalsRow.innerHTML;
      tableFoot.rows[3].cells[0].colSpan = '19';

      let goalkeeperTableHead = goalkeeperTable.querySelector('thead');
      goalkeeperTableHead.rows[0].innerHTML =
        '<td>Valor</td>' + goalkeeperTableHead.rows[0].innerHTML;
      let goalkeeperTableBody = goalkeeperTable.querySelector('tbody');
      goalkeeperTableBody.rows[0].innerHTML =
        '<td style="width:62px;text-align:right;padding-right:15px">' +
        formatMoney(goalkeeperValue) +
        '</td>' +
        goalkeeperTableBody.rows[0].innerHTML;
      goalkeeperTable.querySelector('tfoot').rows[0].cells[0].colSpan = '19';
    });
  };

  const previewResultsButton = () => {
    let container = document.querySelector('#results-fixtures-wrapper');
    const html =
      '<button type="button" class="results-fixtures-type flex-grow-0 js-preview-results">' +
      'Ver resultados' +
      '</button>';
    container.insertAdjacentHTML('afterbegin', html);
  };

  const getMatchesResults = () => {
    let matches = document.querySelectorAll('#fixtures-results-list > .odd');
    for (let i = 0; i < matches.length; i++) {
      let scoreBlock = matches[i].querySelector('.score-cell-wrapper > a');
      let tacticWrapper = $.trim(matches[i].querySelector('.set-default-wrapper').innerHTML);
      if (tacticWrapper === '') {
        let matchId = scoreBlock.href.split('&')[2].split('=')[1];
        renderMatchScore(matchId, scoreBlock);
      }
    }
  };

  const renderMatchScore = (matchId, matchBlock) => {
    const ajax = $.ajax({
      url: '/xml/match_info.php',
      type: 'GET',
      data: { sport_id: sports.indexOf(ajaxSport), match_id: matchId }
    });
    ajax.done((data) => {
      if (data.getElementsByTagName('ManagerZone_Error')[0]) {
        return;
      }
      let myTeamId = matchBlock.href.split('&')[3].split('=')[1];
      let score = {
        local: data.getElementsByTagName('Team')[0].getAttribute('goals') * 1,
        visitor: data.getElementsByTagName('Team')[1].getAttribute('goals') * 1
      };
      matchBlock.innerHTML = score.local + ' - ' + score.visitor;
      if (score.local == score.visitor) {
        matchBlock.className = 'yellow';
      } else if (myTeamId == data.getElementsByTagName('Team')[0].getAttribute('id')) {
        matchBlock.className = score.local > score.visitor ? 'green' : 'red';
      } else if (myTeamId == data.getElementsByTagName('Team')[1].getAttribute('id')) {
        matchBlock.className = score.local > score.visitor ? 'red' : 'green';
      }
    });
  };

  // End matches data

  // Cups and FL
  const renderCupCountryAndDivChecker = () => {
    const categories = [
      'private_cup&sub',
      'cup&sub',
      'u18',
      'u21',
      'u23',
      'world',
      'u18_world',
      'friendlyseries&sub'
    ];
    const url = window.location.href;
    let appliesIn = categories.filter((elem) => {
      return url.indexOf(elem) > -1;
    });
    if (appliesIn.length < 1) {
      return;
    }
    let containerSelector, clickedElementSelector, targetContainerSelector;
    if (url.indexOf('cup&sub') > -1) {
      containerSelector = '#cup-div';
      clickedElementSelector = '#ui-id-4';
      targetContainerSelector = '#group-stages';
    } else if (url.indexOf('friendlyseries&sub') > -1) {
      containerSelector = '#friendly-series-div';
      clickedElementSelector = '#ui-id-2';
      targetContainerSelector = '#ui-tabs-2';
    }
    if (typeof containerSelector === undefined) {
      return;
    }
    $(document).on('click', '.js-view-div-country', () => {
      renderDivAndCountry(targetContainerSelector);
    });
    if (typeof clickedElementSelector !== undefined) {
      $(containerSelector).on('click', clickedElementSelector, () => {
        setTimeout(() => {
          renderDivAndCountryButton();
        }, 1500);
      });
    }
  };

  const renderDivAndCountryButton = () => {
    let tableHeader = document.querySelectorAll('.nice_table thead tr.seriesHeader')[0];
    let firstCell = tableHeader.cells[0];
    firstCell.innerHTML =
      '<img class="js-view-div-country" src="https://i.imgur.com/IwaQRmF.png" title="Ver divisi&oacute;n y pa&iacute;s" style="cursor:pointer;">';
  };

  const renderDivAndCountry = (containerSelector) => {
    if (containerSelector === '' || !containerSelector) {
      return;
    }
    let container = document.querySelector(containerSelector);
    if (!container) {
      return;
    }
    let rows = container.querySelectorAll('.nice_table tbody > tr');
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let link = row.querySelectorAll('a')[0];
      let teamId = link.href.split('&')[1].replace('tid=', '');
      const ajax = $.ajax({
        url: '/xml/manager_data.php',
        type: 'GET',
        data: { sport_id: sports.indexOf(ajaxSport), team_id: teamId }
      });
      (function (container) {
        ajax.done((data) => {
          let index = sports.indexOf(ajaxSport) - 1;
          let divName = data.getElementsByTagName('Team')[index].getAttribute('seriesName'),
            country = data.getElementsByTagName('UserData')[0].getAttribute('countryShortname');
          let divId = data.getElementsByTagName('Team')[index].getAttribute('seriesId'),
            idTeam = data.getElementsByTagName('Team')[index].getAttribute('teamId');

          let countryHtml =
            '<img src="http://static.managerzone.com/nocache-581/img/flags/12/' +
            country.toLowerCase() +
            '.png">&nbsp;';
          let divHtml =
            '&nbsp;- &gt; <a href="?p=league&type=senior&sid=' +
            divId +
            '&tid=' +
            idTeam +
            '">' +
            divName +
            '</a>';
          container.insertAdjacentHTML('beforeend', divHtml);
          container.insertAdjacentHTML('afterbegin', countryHtml);
        });
      })(link.parentNode);
    }
  };

  // End cups and FL

  // Training
  const visualTrainingBalls = () => {
    setTimeout(() => {
      const container = document.querySelector('#training_report');
      if (!container) {
        return;
      }
      const table = container.childNodes[2],
        tbody = table.querySelector('tbody');
      for (let i = 0; i < tbody.rows.length; i++) {
        let cell = tbody.rows[i].cells[4];
        let balls = cell.querySelectorAll('img').length;
        cell.querySelector('div').innerHTML += '<b>(' + balls + ')</b>';
      }
    }, 2500);
  };

  // End training

  // General utils
  const onlyNumbers = (e) => {
    if (
      $.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const formToJSONString = (form) => {
    let obj = {};
    let elements = form.querySelectorAll('input, select, textarea');
    for (let i = 0; i < elements.length; ++i) {
      if (elements[i].name) {
        obj[elements[i].name] = elements[i].value.trim();
      }
    }
    return JSON.stringify(obj);
  };

  const treatAsUTC = (date) => {
    let result = new Date(date);
    return result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  };

  const reformatDate = (strDate) => {
    let splittedDate = strDate.split('-');
    return splittedDate[2] + '-' + splittedDate[1] + '-' + splittedDate[0];
  };

  const daysBetween = (startDate, endDate) => {
    let millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
  };

  const toLocaleCurrency = (value, currency) => {
    const currencies = {
      USD: 7.4234,
      EUR: 9.1775,
      SEK: 1,
      MM: 1,
      UYU: 0.256963,
      R$: 2.62589,
      GBP: 13.35247,
      DKK: 1.23522,
      NOK: 1.07245,
      CHF: 5.86737,
      CAD: 5.70899,
      AUD: 5.66999,
      ILS: 1.6953,
      MXN: 0.68576,
      ARS: 2.64445,
      BOB: 0.939,
      PYG: 0.001309,
      RUB: 0.26313,
      PLN: 1.95278,
      ISK: 0.10433,
      BGL: 4.70738,
      BGN: 4.70738,
      ZAR: 1.23733,
      US$: 7.4234,
      THB: 0.17079,
      SIT: 0.03896,
      SKK: 0.24946,
      JPY: 0.06,
      INR: 0.17,
      MZ: 1
    };
    const toSEK = 1 / currencies[currency],
      cCurrency = localStorage.getItem('moneda');
    if (cCurrency) {
      return Math.round((1 / currencies[cMoneda]) * (value / toSEK));
    }
    return Math.round((1 / currencies['USD']) * (value / toSEK));
  };

  const formatMoney = (value) => {
    let result = '',
      number = value.toString();
    while (number.length > 3) {
      result = '.' + number.substr(number.length - 3) + result;
      number = number.substring(0, number.length - 3);
    }
    return number + result;
  };

  // end general utils

  // Taxes
  const calculateTaxes = (config) => {
    const days = daysBetween(reformatDate(config.boughtDate), reformatDate(config.soldDate));
    if (days < 0) {
      alert('Por favor revise las fechas ingresadas');
      return;
    }
    let tax = { value: 0, percentage: 0 },
      profit = config.soldPrice - config.boughtPrice;
    if (profit > 0) {
      tax.percentage = days > 69 ? 15 : days > 26 ? 50 : 95;
      if (config.originalPlayer) {
        tax.percentage = 15;
      } else if (config.exYouth) {
        tax.percentage = config.playerAge < 20 ? 25 : config.playerAge < 21 ? 20 : 15;
      }
    }
    tax.value = Math.round(profit * (tax.percentage / 100));
    return tax;
  };

  const calculateTaxesAction = (ev) => {
    ev.preventDefault();
    let form = ev.target;
    let jsonForm = formToJSONString(form);
    jsonForm = JSON.parse(jsonForm);
    let taxConfig = {
      originalPlayer: jsonForm.origin * 1 == 2,
      exYouth: jsonForm.origin * 1 == 1,
      playerAge: jsonForm.playerAge * 1,
      boughtDate: jsonForm.boughtDate,
      soldDate: jsonForm.soldDate,
      boughtPrice: jsonForm.origin * 1 === 0 ? jsonForm.boughtValue * 1 : jsonForm.playerValue,
      soldPrice: jsonForm.soldValue * 1
    };

    let taxes = calculateTaxes(taxConfig);
    let html =
      'Se descuentan ' +
      formatMoney(taxes.value) +
      ' en impuestos (' +
      taxes.percentage +
      '%)<br>Recibes ' +
      formatMoney(taxConfig.soldPrice - taxes.value);
    document.querySelector('.js-tax-result').innerHTML = html;
  };

  const getTaxesForm = () => {
    return (
      '<article style="padding-left:5px;">' +
      '<h3>Calcular impuestos</h3>' +
      '<div>' +
      '<form class="js-calculate-tax">' +
      '<table style="width:100%;">' +
      '<tr>' +
      '<td><span>Origen jugador</span></td>' +
      '<td>' +
      '<select name="origin">' +
      '<option value="0">Comprado</option>' +
      '<option value="1">Ex juvenil</option>' +
      '<option value="2">Original del club</option>' +
      '</select>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><span>Valor jugador</span> <span style="color:#A3A30D;">*</span></td>' +
      '<td><input type="text" name="playerValue" value="0" class="js-only-numbers"></td>' +
      '</tr>' +
      '<tr>' +
      '<td><span>Edad jugador</span> <span style="color:#A3A30D;">*</span></td>' +
      '<td>' +
      '<select name="playerAge">' +
      '<option value="19">19</option>' +
      '<option value="20">20</option>' +
      '<option value="21">M&aacute;s de 20</option>' +
      '</select>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td><span>Valor compra</span> <span style="color:#FF043D;">*</span></td>' +
      '<td><input type="text" name="boughtValue" class="js-only-numbers"></td>' +
      '</tr>' +
      '<tr>' +
      '<td><span>Valor venta</span></td>' +
      '<td><input type="text" name="soldValue" class="js-only-numbers"></td>' +
      '</tr>' +
      '<tr>' +
      '<td><span>Fecha compra</span> <span style="color:#FF043D;">*</span></td>' +
      '<td><input type="text" name="boughtDate" placeholder="dd-mm-aaaa"></td>' +
      '</tr>' +
      '<tr>' +
      '<td><span>Fecha venta</span></td>' +
      '<td><input type="text" name="soldDate" placeholder="dd-mm-aaaa"></td>' +
      '</tr>' +
      '</table>' +
      '<div>' +
      '<span style="color:#FF043D;">*</span> <span>Si el jugador fue comprado</span><br>' +
      '<span style="color:#A3A30D;">*</span> <span>Si el jugador es original del club o ex juvenil</span>' +
      '</div>' +
      '<div style="margin-top:4px;">' +
      '<button type="submit" class="quicklink"><span class="buttonClassMiddle">Calcular</span></button>' +
      '</div>' +
      '<div>' +
      '<p class="js-tax-result"></p>' +
      '</div>' +
      '</form>' +
      '</div>' +
      '</article>'
    );
  };

  const renderTaxCalculation = (ev) => {
    ev.preventDefault();
    let html = getTaxesForm();
    let container = document.querySelector('.dg_playerview_info');
    container.insertAdjacentHTML('beforeend', html);
  };

  const renderTaxCalculationButton = () => {
    let parent = document.querySelector('.dg_playerview_info');
    let container = parent.querySelector('p');
    let html =
      '<a href="#" class="js-render-tax mzbtn buttondiv button_red">' +
      '<span class="buttonClassMiddle" style="white-space:nowrap;">Impuestos</span><span class="buttonClassRight">&nbsp;</span>' +
      '</a>';
    container.insertAdjacentHTML('beforeend', html);
  };

  // End taxes

  // Forum
  const forumPagination = () => {
    const posts = document.querySelectorAll('#topics-list > dd');
    for (let i = 0; i < posts.length; i++) {
      let link = posts[i]
        .querySelector('.topics-col-title')
        .querySelector('a')
        .getAttribute('href');
      let counterDiv = posts[i].querySelector('.topics-col-counter');
      let text = (counterDiv.innerText || counterDiv.textContent).split(' / ');
      let messageCount = parseInt(text[1]);
      let pageQuantity = Math.floor(parseInt(messageCount) / 50);
      if (pageQuantity > 0 && messageCount > 50) {
        let html = '';
        let limit = pageQuantity > 5 ? 5 : pageQuantity + 1;
        for (let j = 2; j < limit; j++) {
          html +=
            '<a href="' +
            link +
            '&offset=' +
            (j - 1) * 50 +
            '" title="Ir a p&aacute;gina ' +
            j +
            '">' +
            j +
            '</a>&#160;';
        }
      }
    }
  };

  const getCCButtons = () => {
    return (
      '<div>' +
      '<div class="mzbtn buttondiv button_account" title="Borrar texto del area de mensaje">' +
      '<span class="buttonClassMiddle js-empty-post-textarea" style="white-space: nowrap">Vaciar</span><span class="buttonClassRight">&nbsp;</span>' +
      '</div>' +
      '<div class="js-icons-container">' +
      '<img src="https://i.imgur.com/3YitWv3.gif" alt=">"/>&nbsp;' +
      '<img src="https://i.imgur.com/Q3B4Dqz.gif" title="(y)" alt="(y)"/>&nbsp;' +
      '<img src="https://i.imgur.com/vWFv3Gt.gif" title="(n)" alt="(n)"/>&nbsp;' +
      '<img src="https://i.imgur.com/jaT1cb4.gif" height="20px" title="wtf" alt="wtf"/>&nbsp;' +
      '<img src="https://i.imgur.com/VfbyDHO.gif" height="20px" title="fail" alt="fail"/>&nbsp;' +
      '<img src="https://i.imgur.com/cheJFuk.gif" height="20px" title="repost" alt="repost"/>&nbsp;' +
      '<img src="https://i.imgur.com/jDjyKTf.gif" title="cri" alt="cri"/>&nbsp;' +
      '<img src="https://i.imgur.com/6PopX5q.gif" title="ha-ha" alt="ha-ha"/>' +
      '<img src="https://i.imgur.com/nRp5BpE.gif" title=":)" alt=":)"/>&nbsp;' +
      '<img src="https://i.imgur.com/CcuKTNz.gif" title=":D" alt=":D"/>&nbsp;' +
      '<img src="https://i.imgur.com/Dfl5ZGS.gif" title="D" alt="D"/>&nbsp;' +
      '<img src="https://i.imgur.com/8t9ZJse.gif" title="xD" alt="xD"/>&nbsp;' +
      '<img src="https://i.imgur.com/1kJhHCs.gif" title=":/" alt=":/"/>&nbsp;' +
      '<img src="https://i.imgur.com/1ncAraF.gif" title=":(" alt=":("/>&nbsp;' +
      '<img src="https://i.imgur.com/xp6xUJJ.gif" title=":*(" alt=":*("/>&nbsp;' +
      '<img src="https://i.imgur.com/qOigaWi.png" title=":S" alt=":S"/>&nbsp;' +
      '<img src="https://i.imgur.com/nITjZn5.gif" title="erm" alt="erm"/>&nbsp;' +
      '<img src="https://i.imgur.com/rSqmTPO.gif" title="8-)" alt="8-)"/>&nbsp;' +
      '<img src="https://i.imgur.com/qP1rAQ5.png" title="¬¬" alt="¬¬"/>&nbsp;' +
      '<img src="https://i.imgur.com/HdNdWN0.png" title="porfi" alt="porfi"/>&nbsp;' +
      '<img src="https://i.imgur.com/QuXS7fE.gif" title="O.O" alt="O.O"/>&nbsp;' +
      '<img src="https://i.imgur.com/RUQN2Hy.gif" title="_hm" alt="_hm"/>&nbsp;' +
      '<img src="https://i.imgur.com/QLCdFIE.gif" title=">:(" alt=">:("/>&nbsp;' +
      '<img src="https://i.imgur.com/55sAO1r.gif" title=">:)" alt=">:)"/>&nbsp;' +
      '<img src="https://i.imgur.com/KbQOSgw.gif" title="flirt" alt="flirt"/>&nbsp;' +
      '<img src="https://i.imgur.com/t5dALqK.gif" title=":P" alt=":P"/>&nbsp;' +
      '<img src="https://i.imgur.com/zpY2A6I.gif" title="|-(" alt="|-("/>&nbsp;' +
      '<img src="https://i.imgur.com/yPtUjin.gif" title=";)" alt=";)"/>&nbsp;' +
      '<img src="https://i.imgur.com/OOsLDaW.gif" title="(h)" alt="(h)"/>&nbsp;' +
      '<img src="https://i.imgur.com/LdCQyai.png" title="u.u" alt="u.u"/>&nbsp;' +
      '<img src="https://i.imgur.com/KnhAURP.gif" title="shh" alt="shh"/>&nbsp;' +
      '<img src="https://i.imgur.com/BzPDfzF.gif" title="nana" alt="nana"/>' +
      '<img src="https://i.imgur.com/XEHiXuO.gif" height="23px" title="rock" alt="rock"/>' +
      '<img src="https://i.imgur.com/CsCrOnE.gif" title="grr" alt="grr"/>&nbsp;' +
      '<img src="https://i.imgur.com/K2d1Mbv.gif" height="23px" title="jaja" alt="jaja"/>' +
      '<img src="https://i.imgur.com/SMcjsnf.gif" title="eah" alt="eah"/>' +
      '<img src="https://i.imgur.com/aaPvRo4.gif" title="clap" alt="clap"/>' +
      '<img src="https://i.imgur.com/av8bxvU.gif" title="bla" alt="bla"/>' +
      '<img src="https://i.imgur.com/oQYWBTO.gif" title="l" alt="l"/>&nbsp;' +
      '<img src="https://i.imgur.com/z64hDgz.gif" title="grr" alt="grr"/>&nbsp;' +
      '<img src="https://i.imgur.com/NA84WqF.gif" title="angel" alt="angel"/>&nbsp;' +
      '<img src="https://i.imgur.com/N2cdFNy.gif" title="diablo" alt="diablo"/>&nbsp;' +
      '<img src="https://i.imgur.com/YWe8hno.gif" title="baba" alt="baba"/>' +
      '<img src="https://i.imgur.com/1t7YpCo.gif" height="23px" title="x)" alt="x)"/>&nbsp;' +
      '<img src="https://i.imgur.com/UR5t0o6.gif" title="plz" alt="plz"/>&nbsp;' +
      '<img src="https://i.imgur.com/KKx3thu.gif" title="umm" alt="umm"/>' +
      '<img src="https://i.imgur.com/sC8Mgmi.gif" title="facepalm" alt="facepalm"/>&nbsp;' +
      '<img src="https://i.imgur.com/gJw92DZ.gif title="zzz" alt="zzz"/>' +
      '<img src="https://i.imgur.com/RzjaSKr.gif" title="om" alt="om"/>' +
      '<img src="https://i.imgur.com/7iCxtYD.gif" title="uh" alt="uh"/>' +
      '</div>' +
      '</div>'
    );
  };

  const postItem = (html) => {
    let textarea = document.querySelector('.markItUpEditor');
    let scrollTop = textarea.scrollTop;
    let selectionStart = textarea.selectionStart;
    let selectionEnd = textarea.selectionEnd;
    textarea.value =
      textarea.value.substr(0, selectionStart) +
      html +
      textarea.value.substr(selectionEnd, textarea.value.length);
    textarea.scrollTop = scrollTop;
  };

  const postSmiley = (ev) => {
    let img = ev.target;
    let url = img.getAttribute('src');
    let html = '[image url=' + url + ']';
    postItem(html);
  };

  const emptyPostTextarea = (ev) => {
    let textarea = document.querySelector('#forum_form_message');
    textarea.value = '';
  };

  const renderCCBar = () => {
    setTimeout(() => {
      let container = document.querySelector('.bbcode');
      if (container) {
        let html = getCCButtons();
        container.insertAdjacentHTML('afterbegin', html);
      }
    }, 1500);
  };

  const renderPostQuicklinks = () => {
    const posts = document.querySelectorAll('.forum_body');
    const titles = ['Ir al GB', 'Posts recientes del usuario', 'Invitar amistoso'],
      texts = ['Guestbook', 'Posts', 'Amistosos'];
    const url = window.location.href;
    const forum = url[3].replace('forum_id=', '');
    for (let i = 0; i < posts.length; i++) {
      let author = posts[i].querySelector('.post-author');
      let authorContainer = author.querySelector('a');
      let authorId = authorContainer.href.split('&')[1].replace('uid=', '');
      let authorName = authorContainer.innerHTML;
      let badgeContainer = posts[i].querySelector('.forum-post-badges');
      let authorTeamId = badgeContainer
        .querySelector('img')
        .src.split('=')[1]
        .replace('&sport', '');
      let html =
        '<a class="quicklink" href="/?p=guestbook&uid=' +
        authorId +
        '" title="' +
        titles[0] +
        '">' +
        texts[0] +
        '</a>' +
        '<a class="quicklink" href="?p=forum&sub=search&search_keywords=&search_keyword_type=any&search_author=' +
        authorName +
        '&search_forum=' +
        forum +
        '&search_range=7&search_sort_by=post_date&search_sort_order=desc" title="' +
        titles[1] +
        '">' +
        texts[1] +
        '</a>' +
        '<a class="quicklink" href="?p=team&sub=challenge&tid=' +
        authorTeamId +
        '" title="' +
        titles[2] +
        '">' +
        texts[2] +
        '</a>';
      author.insertAdjacentHTML('beforeend', html);
    }
  };

  // End forum

  // General config
  const setPageFunctions = () => {
    const url = window.location.href;
    if (
      url.indexOf('topics&forum_id') > -1 ||
      url.indexOf('topic&topic_id') > -1 ||
      url.indexOf('guestbook') > -1
    ) {
      renderCCBar();
      renderSignatureDiv();
      renderPostQuicklinks();
      forumPagination();
    } else if (url.indexOf('p=match&sub=result') > -1) {
      linkToSeniorLeague();
      playersMatchValue();
    } else if (url.indexOf('training') > -1) {
      visualTrainingBalls();
    } else if (url.indexOf('sub=scheduled') > -1) {
      previewResultsButton();
    } else if (url.indexOf('players&pid') > -1) {
      renderTaxCalculationButton();
    } else if (url.indexOf('standings&fsid') > -1) {
      setTimeout(() => {
        renderDivAndCountryButton();
      }, 1500);
    }
    renderCupCountryAndDivChecker();
  };

  const addTeamBadgeToPlayers = () => {
    const currentPage = window.location.href;
    if (!currentPage.includes('p=players')) {
      return;
    } else if (currentPage.includes('&') && currentPage.indexOf('&pid=') < 0) {
      return;
    }

    const playerContainers = Array.prototype.slice.call(
      document.querySelectorAll('.player-image.soccer')
    );
    let teamID = null;
    let badgeHTML = '';
    for (let i = 0; i < playerContainers.length; i++) {
      const playerContainer = playerContainers[i];
      const playerLink = playerContainer
        .closest('.playerContainer')
        ?.querySelector('a.subheader')
        ?.getAttribute('href');

      if (!teamID) {
        teamID = playerLink.split('&')[2].replace(/\D+/, '');
        badgeHTML = `<div class="player-team-badge" style="background-image: url(dynimg/badge.php?team_id=${teamID}&sport=soccer&location=icon)"></div>`;
      }

      playerContainer.insertAdjacentHTML('afterbegin', badgeHTML);
    }
  };

  const setEvents = () => {
    $(document)
      .on('click', '.js-delete-signature', dropSignature)
      .on('click', '.js-empty-post-textarea', emptyPostTextarea)
      .on('click', '.js-icons-container img', postSmiley)
      .on('click', '.js-preview-results', getMatchesResults)
      .on('click', '.js-save-signature', saveSignature)
      .on('click', '.js-signature', putSignature)
      .on('click', '.js-render-tax', renderTaxCalculation)
      .on('click', '.training_report_header', visualTrainingBalls)
      .on('submit', '.js-calculate-tax', calculateTaxesAction)
      .on('keydown change', '.js-only-numbers', onlyNumbers);
  };

  return {
    init: init
  };
})();

window.addEventListener('load', () => {
  rzscript.init();
});

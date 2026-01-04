// ==UserScript==
// @name         Freigaben-Tracker
// @namespace    leeSalami.lss
// @version      1.2.3
// @description  Trackt die Freigaben und den Verdienst der Allianzmitglieder. Zum Tracken muss die Hauptseite des Spiels geöffnet bleiben. Die Statistiken befinden sich unter Verband -> Verbandskasse.
// @author       leeSalami
// @license      All Rights Reserved
// @match        https://*.leitstellenspiel.de
// @match        https://*.leitstellenspiel.de/verband/kasse*
// @require      https://cdn.jsdelivr.net/npm/croner@9/dist/croner.umd.js
// @require      https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js?v=1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValues
// @downloadURL https://update.greasyfork.org/scripts/528076/Freigaben-Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/528076/Freigaben-Tracker.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  /**
   * Maximales Alter der gespeicherten Daten, bevor die Daten gelöscht werden. Angabe in Tagen.
   */
  const MAX_STORAGE_DAYS = 180;

  const allianceSpendingElement = document.getElementById('alliance-finances-spendings');
  const lastUserCreditsCheckKey = 'last-users-credits-check';
  let currentPeriod = 'daily';
  let missionsKey;
  let usersKey;
  let userCreditsKey;
  let userCreditsYesterdayKey;
  let today;
  let todayString;
  let currentStartDate;
  let currentEndDate;
  let trackedMissions;
  let trackedUsers;
  let db;
  let allianceId;
  let job;

  if (typeof alliance_id !== 'undefined') {
    allianceId = alliance_id.toString();
  } else {
    allianceId = document.getElementById('bs-example-navbar-collapse-alliance').querySelector(':scope > ul > li > a[href^="/alliances/"]')?.href?.replace(/\D/g, '');
  }

  if (!allianceId) {
    return;
  }

  await updateTimeSensitiveData();

  if (allianceSpendingElement) {
    await cleanup();
    db = await openDb();
    await createOutputTable();
  } else {
    const missionMarkerAddOrig = missionMarkerAdd;
    missionMarkerAdd = async (mission) => {
      missionMarkerAddOrig(mission);
      await trackMission(mission);
    }

    configureCron();
    await initialUpdate();
  }

  async function cleanup() {
    const lastCleanup = await GM.getValue('last-cleanup', null);

    if (lastCleanup !== null && Date.now() - lastCleanup < 86_400_000) {
      return;
    }

    const maxStorageTime = MAX_STORAGE_DAYS * 86_400_000;
    const entries = await GM.listValues();

    for (let i = 0, n = entries.length; i < n; i++) {
      const time = getTimeFromStorageKey(entries[i]);

      if (time === '') {
        continue;
      }

      if ((entries[i].endsWith('-missions') && time !== todayString) || (!entries[i].endsWith('-missions') && Date.now() - parseInt(time, 10) * 1000 > maxStorageTime)) {
        await GM.deleteValue(entries[i]);
      }
    }

    await GM.setValue('last-cleanup', Date.now());
  }

  async function trackMission(mission) {
    if ((!Array.isArray(trackedMissions) && trackedMissions.hasOwnProperty(mission.user_id) && trackedMissions[mission.user_id].includes(mission.id)) || (Array.isArray(trackedMissions) && trackedMissions.includes(mission.id)) || mission.user_id === null || mission.alliance_shared_at < today) {
      return;
    }

    if (!trackedUsers.hasOwnProperty(mission.user_id)) {
      trackedUsers[mission.user_id] = {
        'count': 1,
        'totalCredits': mission.average_credits
      }
    } else {
      trackedUsers[mission.user_id].count++;
      trackedUsers[mission.user_id].totalCredits += mission.average_credits;
    }

    if (Array.isArray(trackedMissions)) {
      trackedMissions.push(mission.id);
    } else if (!trackedMissions.hasOwnProperty(mission.user_id)) {
      trackedMissions[mission.user_id] = [];
      trackedMissions[mission.user_id].push(mission.id);
    } else {
      trackedMissions[mission.user_id].push(mission.id);
    }

    await GM.setValue(missionsKey, JSON.stringify(trackedMissions));
    await GM.setValue(usersKey, JSON.stringify(trackedUsers));
  }

  async function createOutputTable() {
    const wrapper = document.createElement('div');
    wrapper.id = 'alliance-members-credits';
    wrapper.className = 'panel panel-default';
    allianceSpendingElement.insertAdjacentElement('afterend', wrapper);

    const headingWrapper = document.createElement('div');
    headingWrapper.className = 'panel-heading';
    wrapper.append(headingWrapper);

    const heading = document.createElement('h4');
    heading.innerText = 'Geteilte Credits ';
    headingWrapper.append(heading);

    const periodSwitchWrapper = document.createElement('div');
    periodSwitchWrapper.className = 'btn-group';
    heading.append(periodSwitchWrapper);

    const dailyButton = document.createElement('a');
    dailyButton.className = 'period-switch btn btn-success';
    dailyButton.innerText = 'Täglich';
    dailyButton.addEventListener('click', (e) => changePeriod(e, 'daily'));
    periodSwitchWrapper.append(dailyButton);

    const weeklyButton = document.createElement('a');
    weeklyButton.className = 'period-switch btn btn-default';
    weeklyButton.innerText = 'Wöchentlich';
    weeklyButton.addEventListener('click', (e) => changePeriod(e, 'weekly'));
    periodSwitchWrapper.append(weeklyButton);

    const monthlyButton = document.createElement('a');
    monthlyButton.className = 'period-switch btn btn-default';
    monthlyButton.innerText = 'Monatlich';
    monthlyButton.addEventListener('click', (e) => changePeriod(e, 'monthly'));
    periodSwitchWrapper.append(monthlyButton);

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'btn btn-default hide-screenshot';
    copyButton.style.float = 'right';
    copyButton.addEventListener('click', copyTableToClipboard);

    const copyButtonIcon = document.createElement('img');
    copyButtonIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAhUlEQVR4nO2UTQ5AMBBGZ8GlhL3GyfycEjuHeELY0GKi0i68pJtvpvMWk4xISIAU6IBpey2Q+BQ0nKnfDKyA0TI0A3JLPgBGI1g+2MiBwlHrNYKVr/rlF8Qr4IArvxUGF8hNHq/g8yX7FLhu0RWqW2SUkh4oHwsuxCu++sIJdrT18AKJmRmC/XLqUJUgawAAAABJRU5ErkJggg==';
    copyButtonIcon.style.width = '15px';
    copyButtonIcon.style.height = '15px';
    copyButton.append(copyButtonIcon);
    heading.append(copyButton);

    const body = document.createElement('div');
    body.className = 'panel-body';
    body.style.position = 'relative';
    wrapper.append(body);

    const table = document.createElement('table');
    table.className = 'table table-striped';
    table.innerHTML = '<thead><tr><th>Name</th><th>Credits</th><th>Anzahl</th><th>Durchschnitt</th><th>Einnahmen</th><th>Anteil</th></tr></thead>';

    const tbody = document.createElement('tbody');
    tbody.id = 'alliance-members-credits-tbody';
    tbody.innerHTML = '<tr><td colspan="6" style="padding:0"><div class="alert alert-info">Lade...</div></td></tr>';
    table.append(tbody);

    const date = document.createElement('span');
    date.id = 'alliance-members-credits-date';
    date.innerText = ` ${formatDate(today)} `;
    date.dataset.date = todayString;

    const previous = document.createElement('a');
    previous.className = 'btn btn-success member-credits';
    previous.innerText = '<<';
    previous.addEventListener('click', (e) => rebuildTableEvent(e, 'previous'));

    const next = document.createElement('a');
    next.className = 'btn btn-success member-credits';
    next.innerText = '>>';
    next.addEventListener('click', (e) => rebuildTableEvent(e, 'next'));

    const updateButton = document.createElement('button');
    updateButton.type = 'button';
    updateButton.className = 'btn btn-success member-credits hide-screenshot';
    updateButton.style.position = 'absolute';
    updateButton.style.right = '15px';
    updateButton.addEventListener('click', (e) => rebuildTableEvent(e, 'update'));

    const updateButtonIcon = document.createElement('img');
    updateButtonIcon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABIklEQVR4nO3UO0oDURgF4FG00mjjDhRbH2AnEgR3FTToJqIuQVDSCimyBxW34BOiFnafXLwDo+jcG0PAIqeagfOf87/uXxQTjArs4RS3eMMLrnGC5ijCq+hL4xIrlbh2jvgOnqPAHVpYxxwWsIFD3EfOE7ZwEH5yMi/Fz9Co4S6hG7nvZUkpg35FfCqj2llcVXuWGmjZll8zr6JsS65B2JaA1l/FA+oCwioGrBXjAF6jwXzx3+BzfQMG4zLYjAY3daSf0B5y4J1hDNqZ4ot4iDG7uQbhoM1kiE/jIsb0UmTfnn03nINE5ueR+4jlHIN2PFwhQCz9KA4xCDbi936lLYG7nar2y6kN2cRTnEIvmXnCtInjeNAG8TGG+XRqBzpBkYkPkjZVj0xtk+cAAAAASUVORK5CYII=';
    updateButtonIcon.style.width = '15px';
    updateButtonIcon.style.height = '15px';
    updateButton.append(updateButtonIcon);

    body.append(previous);
    body.append(date);
    body.append(next);
    body.append(updateButton);
    body.append(table);

    await rebuildTable();
  }

  function changePeriod(event, newPeriod) {
    const buttons = document.getElementById('alliance-members-credits').querySelectorAll(':scope .period-switch');

    if (buttons) {
      for (let i = 0, n = buttons.length; i < n; i++) {
        buttons[i].classList.add('btn-default');
        buttons[i].classList.remove('btn-success');
      }

      event.currentTarget.classList.add('btn-success');
    }

    currentPeriod = newPeriod;
    calculateDateRange();
    rebuildTable();
  }

  function copyTableToClipboard(e) {
    e.preventDefault();
    const wrapper = document.getElementById('alliance-members-credits');

    if (!wrapper) {
      return;
    }

    const filter = (node) => {
      const exclusionClasses = ['hide-screenshot'];
      return !exclusionClasses.some((classname) => node.classList?.contains(classname));
    }

    htmlToImage.toBlob(wrapper, { filter: filter}).then((blob) => {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
    });
  }

  function calculateDateRange(direction = null) {
    if (!currentStartDate || !currentEndDate || !direction) {
      currentStartDate = new Date(parseInt(today, 10) * 1000);
      currentEndDate = new Date(parseInt(today, 10) * 1000);

      if (currentPeriod === 'weekly') {
        currentStartDate.setDate(currentStartDate.getDate() - currentStartDate.getDay() + (currentStartDate.getDay() === 0 ? -6 : 1));
        currentEndDate.setDate(currentEndDate.getDate() - currentEndDate.getDay() + 7);
      } else if (currentPeriod === 'monthly') {
        currentStartDate.setDate(1);
        currentEndDate.setMonth(currentEndDate.getMonth() + 1, 0);
      }
    }

    if (currentPeriod === 'daily') {
      if (direction === 'next') {
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        currentEndDate.setDate(currentEndDate.getDate() + 1);
      } else if (direction === 'previous') {
        currentStartDate.setDate(currentStartDate.getDate() - 1);
        currentEndDate.setDate(currentEndDate.getDate() - 1);
      }
    } else if (currentPeriod === 'weekly') {
      if (direction === 'next') {
        currentStartDate.setDate(currentStartDate.getDate() + 7);
        currentEndDate.setDate(currentEndDate.getDate() + 7);
      } else if (direction === 'previous') {
        currentStartDate.setDate(currentStartDate.getDate() - 7);
        currentEndDate.setDate(currentEndDate.getDate() - 7);
      }
    } else if (currentPeriod === 'monthly') {
      if (direction === 'next') {
        currentStartDate.setMonth(currentStartDate.getMonth() + 1);
        currentEndDate.setMonth(currentEndDate.getMonth() + 1);
      } else if (direction === 'previous') {
        currentStartDate.setMonth(currentStartDate.getMonth() - 1, 1);
        currentEndDate.setMonth( currentEndDate.getMonth(), 0);
      }
    }
  }

  function rebuildTableEvent(event, direction = null) {
    event?.preventDefault();
    rebuildTable(direction);
  }

  async function rebuildTable(direction = null) {
    const tbody = document.getElementById('alliance-members-credits-tbody');

    if (!tbody) {
      return;
    }

    const dateElement = document.getElementById('alliance-members-credits-date');

    if (!dateElement) {
      return;
    }

    toggleTableButtons();
    await updateAllianceMembersCredits();
    calculateDateRange(direction);
    const endTimeStamp = currentEndDate.getTime() / 1000;
    const startTimeStamp = currentStartDate.getTime() / 1000;
    let currentTimestamp = startTimeStamp;
    let trackedUsers = {};

    do {
      let storedUsers = JSON.parse(await GM.getValue(`${currentTimestamp}-users`, '{}'));
      let storedUsersCredits = JSON.parse(await GM.getValue(`${currentTimestamp}-users-credits`, '{}'));

      for (const userId in storedUsersCredits) {
        if (!storedUsersCredits.hasOwnProperty(userId)) {
          continue;
        }

        if (trackedUsers.hasOwnProperty(userId)) {
          trackedUsers[userId].creditsLast = storedUsersCredits[userId].creditsLast;
          trackedUsers[userId].earnedCredits = storedUsersCredits[userId].creditsLast - trackedUsers[userId].creditsFirst;

        } else {
          trackedUsers[userId] = {
            'userId': userId,
            'count': 0,
            'totalCredits': 0,
            'creditsFirst': storedUsersCredits[userId].creditsFirst,
            'creditsLast': storedUsersCredits[userId].creditsLast,
            'earnedCredits': storedUsersCredits[userId].creditsLast - storedUsersCredits[userId].creditsFirst
          }
        }

        if (storedUsers.hasOwnProperty(userId)) {
          trackedUsers[userId].count += storedUsers[userId].count;
          trackedUsers[userId].totalCredits += storedUsers[userId].totalCredits;
        }
      }

      currentTimestamp += 86400
    } while (currentTimestamp <= endTimeStamp && currentTimestamp <= today);

    const table = $(tbody.parentElement);
    table.trigger('destroy');

    if (startTimeStamp === endTimeStamp) {
      dateElement.innerText = ` ${formatDate(startTimeStamp)} `;
    } else {
      dateElement.innerText = ` ${formatDate(startTimeStamp)} - ${formatDate(endTimeStamp)} `;
    }

    const trackedUsersArray = [];

    for (const userId in trackedUsers) {
      if (!trackedUsers.hasOwnProperty(userId)) {
        continue;
      }

      trackedUsersArray.push([trackedUsers[userId].totalCredits, trackedUsers[userId].earnedCredits, trackedUsers[userId]]);
    }

    if (!trackedUsersArray.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="padding:0"><div class="alert alert-info">Kein Eintrag gefunden</div></td></tr>';
      toggleTableButtons();
      return;
    }

    trackedUsersArray.sort((a, b) => b[0] - a[0] || b[1] - a[1]);

    let tableContent = '';
    let hasRow = false;

    for (let i = 0, n = trackedUsersArray.length; i < n; i++) {
      if (trackedUsersArray[i][2].totalCredits === 0 && trackedUsersArray[i][2].count === 0 && trackedUsersArray[i][2].earnedCredits === 0) {
        continue;
      }

      const username = (await getUserById(trackedUsersArray[i][2].userId))?.name ?? 'Unbekannt';
      let ratio = 0;
      let average = 0;

      if (trackedUsersArray[i][2].earnedCredits > 0) {
        ratio = trackedUsersArray[i][2].totalCredits / trackedUsersArray[i][2].earnedCredits;
      }
      if (trackedUsersArray[i][2].count > 0) {
        average = trackedUsersArray[i][2].totalCredits / trackedUsersArray[i][2].count;
      }

      hasRow = true;
      tableContent += `<tr><td><a href="/profile/${trackedUsersArray[i][2].userId}">${username}</a></td><td>${I18n.toNumber(trackedUsersArray[i][2].totalCredits, { precision: 0 })}</td><td>${I18n.toNumber(trackedUsersArray[i][2].count, { precision: 0 })}</td><td>${I18n.toNumber(average, { precision: 0 })}</td><td>${I18n.toNumber(trackedUsersArray[i][2].earnedCredits, { precision: 0 })}</td><td>${I18n.toNumber(ratio * 100, { precision: 2 })} %</td></tr>`
    }

    if (hasRow) {
      tbody.innerHTML = tableContent;
      table.tablesorter({ sortList: [[1, 1]], usNumberFormat: false });
    } else {
      tbody.innerHTML = '<tr><td colspan="7" style="padding:0"><div class="alert alert-info">Kein Eintrag gefunden</div></td></tr>';
    }

    toggleTableButtons();
  }

  async function getUserById(id, retry = false) {
    const user = await getData(db, 'allianceUsers', parseInt(id, 10));

    if (user === undefined && retry === false) {
      await updateAllianceInfo(db, 60);
      return await getUserById(id, true);
    } else {
      return user;
    }
  }

  async function initialUpdate() {
    if (await GM.getValue(userCreditsKey, null) === null) {
      await updateAllianceMembersCredits();
    }
  }

  function configureCron() {
    job = new Cron('0 0 * * *', { timezone: 'Europe/Berlin' }, async () => {
      await updateTimeSensitiveData();
      await checkAllianceMembersCredits(true);
    });
  }

  async function updateAllianceMembersCredits(force = false) {
    const lastUpdate = await GM.getValue(lastUserCreditsCheckKey, null);
    const usersCredits = await GM.getValue(userCreditsKey, null);
    if (lastUpdate === null || usersCredits === null || force || Date.now() - lastUpdate >= 3_600_000) {
      await checkAllianceMembersCredits();
    }
  }

  async function updateTimeSensitiveData() {
    const baseDate = new Date(new Date().toLocaleDateString('en-US', {
      timeZone: 'Europe/Berlin',
      timeZoneName: 'short'
    }));
    today = baseDate.getTime() / 1000;
    todayString = today.toString();
    missionsKey = `${todayString}-missions`;
    usersKey = `${todayString}-users`;
    userCreditsKey = `${todayString}-users-credits`;

    baseDate.setDate(baseDate.getDate() - 1);
    userCreditsYesterdayKey = `${(baseDate.getTime() / 1000).toString()}-users-credits`;

    trackedMissions = JSON.parse(await GM.getValue(missionsKey, '{}'));
    trackedUsers = JSON.parse(await GM.getValue(usersKey, '{}'));
  }

  async function checkAllianceMembersCredits(newDay = false) {
    const usersCredits = JSON.parse(await GM.getValue(userCreditsKey, '{}'));
    let userCreditsYesterday;

    if (newDay) {
      userCreditsYesterday = JSON.parse(await GM.getValue(userCreditsYesterdayKey, '{}'));
    }

    const parser = new DOMParser();
    let minCredits = 0;
    let page = 1;
    let userRowsCount = 20;

    do {
      const userCredits = await fetch(`/verband/mitglieder/${allianceId}?page=${page}`);

      if (!userCredits.ok) {
        break;
      }

      const doc = parser.parseFromString(await userCredits.text(), 'text/html');

      if (doc.querySelector('.alert')?.innerText?.includes('Keine Mitglieder gefunden.')) {
        break;
      }

      const userRows = doc.querySelectorAll('table > tbody > tr');
      userRowsCount = userRows.length;

      for (let i = 0; i < userRowsCount; i++) {
        const userLinkElement = userRows[i].querySelector('table > tbody > tr > td:nth-of-type(1) > a[href^="/profile/"]');
        const creditsElement = userRows[i].querySelector('table > tbody > tr > td:nth-of-type(3)');

        if (userLinkElement === null || creditsElement === null) {
          continue;
        }

        const userCredits = parseInt(creditsElement.innerText.replace(/\D/g, ''), 10);
        minCredits = userCredits;

        if (userCredits < 50_000_000) {
          continue;
        }

        const userId = userLinkElement.href.replace(/\D/g, '');

        if (!usersCredits.hasOwnProperty(userId)) {
          usersCredits[userId] = {
            'creditsFirst': userCredits,
            'creditsLast': userCredits
          };
        } else {
          usersCredits[userId].creditsLast = userCredits;
        }

        if (newDay && userCreditsYesterday.hasOwnProperty(userId)) {
          userCreditsYesterday[userId].creditsLast = userCredits;
        }
      }

      page++;
      await new Promise(r => setTimeout(r, 250));
    } while (userRowsCount === 20 && minCredits >= 50_000_000);

    await GM.setValue(userCreditsKey, JSON.stringify(usersCredits));
    await GM.setValue(lastUserCreditsCheckKey, Date.now());

    if (newDay) {
      await GM.setValue(userCreditsYesterdayKey, JSON.stringify(userCreditsYesterday));
    }
  }

  function toggleTableButtons() {
    const buttons = document.querySelectorAll('.member-credits.btn');

    for (let i = 0, n = buttons.length; i < n; i++) {
      if (buttons[i].classList.contains('disabled')) {
        buttons[i].classList.remove('disabled');
        buttons[i].disabled = false;
      } else {
        buttons[i].classList.add('disabled');
        buttons[i].disabled = true;
      }
    }
  }

  function getTimeFromStorageKey(storageKey) {
    const time = storageKey.replace(/(\d{10})-\D+/, '$1');
    return time.replace(/\D/g, '');
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }
})();
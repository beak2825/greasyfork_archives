// ==UserScript==
// @name         Bangumi-Episode Air Status Corrector
// @name:zh-CN   班固米-单集放送状态修正
// @version      0.2.5
// @description  Correct the air status of individual episodes, using timing data and your custom settings from the /dev/app/2527 gadget
// @author       banzhe, age, weiduhuo
// @namespace    https://github.com/weiduhuo/scripts
// @match        *://bgm.tv/
// @match        *://bgm.tv/subject/*
// @match        *://bgm.tv/ep/*
// @match        *://bangumi.tv/
// @match        *://bangumi.tv/subject/*
// @match        *://bangumi.tv/ep/*
// @match        *://chii.in/
// @match        *://chii.in/subject/*
// @match        *://chii.in/ep/*
// @grant        none
// @license      MIT
// @description:zh-CN  基于/dev/app/2527组件的时间数据与用户设置，对单集放送状态进行修正，若数据不存在默认将当天放送标为绿色
// @downloadURL https://update.greasyfork.org/scripts/535328/Bangumi-Episode%20Air%20Status%20Corrector.user.js
// @updateURL https://update.greasyfork.org/scripts/535328/Bangumi-Episode%20Air%20Status%20Corrector.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TIME_SET_STORAGE_KEY = 'BGM_HOME_ANIME_TIME_SET_AGE';
  const TIME_SET_SETTINGS_KEY = 'BGM_HOME_ANIME_TIME_SETTINGS_AGE';
  const EPS_AIR_DATE_KEY_PREF = 'epsAirDate-';

  const Now = new Date();
  const Today = Now.getDay();
  const CurrentHours = Now.getHours();
  const CurrentMinutes = Now.getMinutes();
  const OneDay = 86400e3;
  // 待修正的单集候选日期
  const CandDays = [
    new Date(Date.now() - OneDay),
    Now,
    new Date(Date.now() + OneDay),
    new Date(Date.now() + OneDay * 2),
  ].map(
    (date) => `${date.toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' })}`
  );
  const AirDateRe = /首播.*(\d{4}-\d{2}-\d{2})/;

  const TimeStatus2AirStatus = {
    'past':    {en: 'Air',   zh: '已放送'},
    'future':  {en: 'Today', zh: '即将放送'}, // 原为 '放送中'
    'horizon': {en: 'NA',    zh: '未放送'},
  };
  const AirStatusClasses = Object.values(TimeStatus2AirStatus).map(c => c.en);
  const EpBtnClasses = AirStatusClasses.map(c => `epBtn${c}`);

  let animeTimeData;
  let animeTimeSettings;
  let subjectId;

  function main() {
    const pathname = window.location.pathname;
    const urlPatterns = [
      { type: 'home', regex: /^\/$/ },
      { type: 'subject', regex: /^\/subject\/(\d+)$/ },
      { type: 'eps', regex: /^\/subject\/(\d+)\/ep$/ },
      { type: 'ep', regex: /^\/ep\/(\d+)$/ },
    ]
    for (const pattern of urlPatterns) {
      const matches = pathname.match(pattern.regex);
      if (!matches) continue;
      switch(pattern.type) {
        case 'home': subjectId = null; handlerEpBlocks(); break;
        case 'subject': subjectId = matches[1]; handlerEpBlocks(); break;
        case 'eps': subjectId = matches[1]; handlerEpLines(); break;
        case 'ep': handlerSideEpList(); break;
      }
      break;
    }
  }

  function getStoragedata(key) {
    const data = localStorage.getItem(key);
    if (!data) return {};
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  function getTimeStatus(subId) {
    animeTimeData ??= getStoragedata(TIME_SET_STORAGE_KEY);
    const timeData = animeTimeData[subId];
    if (!timeData) return null;
    animeTimeSettings ??= getStoragedata(TIME_SET_SETTINGS_KEY);

    const [hours, minutes] = timeData.time.split(':').map(Number);
    const targetDay = timeData.weekDay;

    let dayDiff = targetDay - Today;
    if (dayDiff < -3) dayDiff += 7;
    else if (dayDiff > 3) dayDiff -= 7;

    const totalDiffHours = dayDiff * 24 + (hours - CurrentHours) + (minutes - CurrentMinutes) / 60;

    // 已放送
    if (totalDiffHours < 0) return 'past';
    // 即将放送
    switch (animeTimeSettings.showStyleGreen) {
      case 0: if (totalDiffHours >= 0 && totalDiffHours < 18) return 'future'; break;
      case 1: if (totalDiffHours >= 0 && totalDiffHours < 24) return 'future'; break;
      case 2: if (dayDiff === 0 && totalDiffHours >= 0) return 'future'; break;
      case 3: if ((dayDiff === 0 && totalDiffHours >= 0) || (dayDiff === 1 && hours < 6)) return 'future'; break;
      case 4: if ((dayDiff === 0 && totalDiffHours >= 0) || (dayDiff === 1 && hours < 8)) return 'future'; break;
      // 预留功能：今天内30小时制即将放送
      case 6: if ((dayDiff === 0 && totalDiffHours >= 0 && (CurrentHours >= 6 === hours >=6)) || (dayDiff === 1 && hours < 6 && CurrentHours >= 6)) return 'future'; break;
      case 5:
      default: return null;
    }
    // 未放送
    return 'horizon';
  }

  function correctEpBtn(btn, status, day) {
    if (btn.classList.contains('epBtnWatched')) return;
    if (status === null) {
      // 默认仅将当天放送标为绿色
      if (day === 1) status = 'future';
      else if (day === 2) status = 'horizon';
      else return;
    }
    status = TimeStatus2AirStatus[status].en;
    const targetClass = `epBtn${status}`;
    if (btn.classList.contains(targetClass)) return;
    let preStatus;
    EpBtnClasses.forEach(c => {
      if (btn.classList.contains(c)) preStatus = c.slice(5);
      btn.classList.toggle(c, c === targetClass);
    });
    console.log(`修正状态 ${preStatus} > ${status}`, btn);
  }

  function correctAirStatus(ele, status, day) {
    if (status === null) {
      if (day === 1) status = 'future';
      else if (day === 2) status = 'horizon';
      else return;
    } else {
      // 修改文体提示：'放送中' > '即将放送'
      ele.title = TimeStatus2AirStatus[status].zh;
    }
    status = TimeStatus2AirStatus[status].en;
    const inner = ele.children[0];
    if (inner.classList.contains(status)) return;
    let preStatus;
    AirStatusClasses.forEach(c => {
      if (inner.classList.contains(c)) preStatus = c
      inner.classList.toggle(c, c === status)
    });
    console.log(`修正状态 ${preStatus} > ${status}`, ele);
  }

  function handlerEpBlocks() {
    const episodeList = document.getElementsByClassName('prg_popup');
    for (const episode of episodeList) {
      const tipElement = episode.getElementsByClassName('tip')[0];
      const match = tipElement?.textContent.match(AirDateRe);
      if (!match) continue;
      const airDate = match[1];
      const day = CandDays.indexOf(airDate);
      if (day === -1) continue;
      const candEpBtn = document.getElementById(episode.id.replace('info', ''));
      const subId = subjectId || candEpBtn.getAttribute('subject_id');
      const timeStatus = getTimeStatus(subId);
      correctEpBtn(candEpBtn, timeStatus, day);
    }
  }

  /** @param {Document} doc */
  function handlerEpLines(doc = document) {
    const episodeList = doc.querySelectorAll('.line_detail > ul > li');
    const virtual = doc !== document;
    const epsAirDate = {};
    for (const episode of episodeList) {
      const airStatus = episode.getElementsByClassName('epAirStatus')[0];
      if (!airStatus) continue;
      const smallElement = episode.querySelector('h6 ~ small');
      const match = smallElement?.textContent.match(AirDateRe);
      if (!match) continue;
      const airDate = match[1];
      const day = CandDays.indexOf(airDate);
      if (day === -1) continue;
      const epPath = episode.querySelector('h6 a[href^="/ep"]').pathname;
      epsAirDate[epPath] = airDate;
      if (virtual) continue;
      
      const timeStatus = getTimeStatus(subjectId);
      correctAirStatus(airStatus, timeStatus, day);
    }
    const dataKey = EPS_AIR_DATE_KEY_PREF + subjectId;
    sessionStorage.setItem(dataKey, JSON.stringify(epsAirDate));
    return epsAirDate;
  }

  async function fetchEpLinesPage() {
    const host = location.host;
    const protocol = location.protocol;
    const res = await fetch(`${protocol}//${host}/subject/${subjectId}/ep`);
    if (!res.ok) return null;
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc;
  }

  async function handlerSideEpList() {
    subjectId = document.querySelector('#subject_inner_info a').href.split('/').pop();
    const dataKey = EPS_AIR_DATE_KEY_PREF + subjectId;
    let epsAirDate = sessionStorage.getItem(dataKey);
    if (epsAirDate) {
      epsAirDate = JSON.parse(epsAirDate);
    } else {
      const doc = await fetchEpLinesPage();
      if (!doc) return;
      epsAirDate = handlerEpLines(doc);
    }
    const sideEpList = document.getElementsByClassName('sideEpList')[0];
    for (const [epPath, airDate] of Object.entries(epsAirDate)) {
      const epLink = sideEpList.querySelector(`a[href="${epPath}"]`);
      if (!epLink) continue;
      const airStatus = epLink.previousElementSibling;
      const day = CandDays.indexOf(airDate);
      const timeStatus = getTimeStatus(subjectId);
      correctAirStatus(airStatus, timeStatus, day);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    setTimeout(main, 0);
  }
})();
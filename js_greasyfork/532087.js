// ==UserScript==
// @name         Bangumi-Restructure Person Works Filter Layout
// @name:zh-CN   班固米-重置人物作品过滤器布局
// @version      0.1.1
// @description  Restructure person works filter into a grid layout, and sort staff roles
// @author       weiduhuo
// @namespace    https://github.com/weiduhuo/scripts
// @match        *://bgm.tv/person/*
// @match        *://bangumi.tv/person/*
// @match        *://chii.in/person/*
// @grant        none
// @license      MIT
// @description:zh-CN  将人物作品过滤器重新排列为网格布局，并基于接口数据对职位进行排序
// @downloadURL https://update.greasyfork.org/scripts/532087/Bangumi-Restructure%20Person%20Works%20Filter%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/532087/Bangumi-Restructure%20Person%20Works%20Filter%20Layout.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const Group2StaffPrefId = {
    'book': 2,
    'anime': 0,
    'music': 3,
    'game': 1,
    'real': 4,
  };

  const urlPattern = /^\/person\/\d+\/works(?!\/voice)/; // 排除配音角色页面
  if (!urlPattern.test(window.location.pathname)) return;
  const subjectFilter = document.querySelector('.subjectFilter');
  if (!subjectFilter) return;

  subjectFilter.classList.add('filterRelayout');
  const totalGroups = subjectFilter.firstElementChild;
  const totalStaffs = subjectFilter.lastElementChild;
  totalGroups.style.display = 'none';
  totalStaffs.style.display = 'none';

  const style = document.createElement('style');
  style.innerHTML = `
    .subjectFilter.filterRelayout {
      display: grid;
      grid-template-columns: auto 1fr;
    }
    .subjectFilter.filterRelayout > div.item,
    .subjectFilter.filterRelayout > ul.item > li {
      padding: 3px 0 3px 10px;
    }
    .subjectFilter.filterRelayout > .item {
      border-top: 1px solid #FFF;
      border-bottom: 1px solid #EEE;
    }
    html[data-theme='dark'] .subjectFilter.filterRelayout > .item {
      border-top: 1px solid transparent;
      border-bottom: 1px solid #444;
    }
    .subjectFilter.filterRelayout > .item:nth-child(odd) {
      border-right: 1px solid #EEE;
      /* padding-right: 10px; */
    }
    html[data-theme='dark'] .subjectFilter.filterRelayout > .item:nth-child(odd) {
      border-right: 1px solid #444;
    }
    .subjectFilter.filterRelayout > .item:nth-child(even) {
      border-left: 1px solid #FFF;
    }
    html[data-theme='dark'] .subjectFilter.filterRelayout > .item:nth-child(even) {
      border-left: 1px solid transparent;
    }
    .subjectFilter.filterRelayout > ul.item > li {
      float: left;
    }
    .subjectFilter.filterRelayout .title span {
      display: block;
      color: #aaa;
      padding: 2px 5px;
    }
    .subjectFilter.filterRelayout .item a {
      display: block;
      padding: 2px 5px;
    }
    .subjectFilter.filterRelayout .item a:hover,
    .subjectFilter.filterRelayout .item a.focus {
      background: #f09199;
      color: #fff;
      text-decoration: none;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      -moz-background-clip: padding;
      -webkit-background-clip: padding-box;
      background-clip: padding-box;
    }
  `;
  document.head.appendChild(style);

  const groupStaffs = [];
  const fragment = document.createDocumentFragment();
  const staffs = totalStaffs.querySelectorAll('li');
  const staffHeader = document.createElement('ul');
  staffHeader.className = 'item';
  staffHeader.append(staffs[0], staffs[1]);

  for (const [i, groupLi] of totalGroups.querySelectorAll('li').entries()) {
    if (i === 1) continue;
    const a = groupLi.firstElementChild;
    const div = document.createElement('div');
    div.className = 'item';
    div.appendChild(a);
    if (i === 0) {
      div.classList.add('title');
      fragment.append(div, staffHeader); // 横向表头
      continue;
    }
    const ul = document.createElement('ul');
    ul.className = 'item';
    fragment.append(div, ul);
    const groupName = getLastPathSegment(a);
    groupStaffs[Group2StaffPrefId[groupName]] = ul;
  }

  for (const [i, staffLi] of staffs.entries()) {
    if (i <= 1) continue;
    const preId = getStaffPrefId(staffLi);
    groupStaffs[preId].appendChild(staffLi);
  }

  subjectFilter.append(fragment);
  totalGroups.remove();
  totalStaffs.remove();

  // 职位排序
  for (const [groupName, id] of Object.entries(Group2StaffPrefId)) {
    if (!groupStaffs[id]) continue;
    let orderMap = localStorage.getItem(`BangumiStaffSorting_${groupName}JobOrderMap`);
    if (!orderMap) continue;
    orderMap = JSON.parse(orderMap).exact;
    const JobDict = {};
    for (const jobLi of groupStaffs[id].children) {
      JobDict[getJobName(jobLi)] = jobLi;
    }
    let sortedJobs = Object.keys(JobDict);
    sortedJobs.sort((a, b) => orderMap[a] - orderMap[b]);
    for (const job of sortedJobs) {
      groupStaffs[id].appendChild(JobDict[job]);
    }
  }

  function getJobName(li) {
    return li.innerText.trim().split(' (')[0];
  }

  function getStaffPrefId(li) {
    const a = li.querySelector('a');
    const id = getLastPathSegment(a);
    if (id.length < 4) return 0;
    return id[0];
  }

  function getLastPathSegment(a) {
    return a.pathname.split('/').pop();
  }

})();
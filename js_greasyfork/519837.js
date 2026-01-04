// ==UserScript==
// @name         有没有人一起从零开始刷力扣-fix
// @namespace    likou-replace
// @version      1.2
// @description  针对 https://leetcode.cn/circle/discuss/48kq9d/ 这篇文章生效，原作者的脚本未加上题名字
// @author       Permission
// @match        https://leetcode.cn/circle/discuss/48kq9d/
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license      gpl
// @downloadURL https://update.greasyfork.org/scripts/519837/%E6%9C%89%E6%B2%A1%E6%9C%89%E4%BA%BA%E4%B8%80%E8%B5%B7%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%88%B7%E5%8A%9B%E6%89%A3-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/519837/%E6%9C%89%E6%B2%A1%E6%9C%89%E4%BA%BA%E4%B8%80%E8%B5%B7%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%88%B7%E5%8A%9B%E6%89%A3-fix.meta.js
// ==/UserScript==

/* globals $, jQuery */
'use strict';

let proMap = new Map(),
  transMap = new Map(),
  statuMap = new Map(),
  infoMap = new Map(),
  buildMapComplete = false;

const getProblems = () => {
  $.get('https://leetcode.cn/api/problems/all/').then((response) => {
    getTrans(JSON.parse(response));
  });
};

const getTrans = (picker) => {
  $.ajax({
    method: 'POST',
    url: 'https://leetcode.cn/graphql/',
    headers: {
      'content-type': 'application/json',
      'x-definition-name': 'getQuestionTranslation',
      'x-operation-name': 'getQuestionTranslation',
      'x-csrftoken': getCookie('csrftoken'),
      'x-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    data: JSON.stringify({
      operationName: 'getQuestionTranslation',
      variables: {},
      query:
        'query getQuestionTranslation($lang: String) {translations: allAppliedQuestionTranslations(lang: $lang) {title questionId __typename}}'
    })
  }).then((trans) => {
    buildMap(picker, trans);
  });
};

const buildMap = (picker, trans) => {
  for (let pro of picker.stat_status_pairs) {
    proMap.set(pro.stat.frontend_question_id, pro.stat.question__title_slug);
    infoMap.set(pro.stat.frontend_question_id, {
     en: pro.stat.question__title_slug,
      level: pro?.difficulty?.level??'',
      status: pro.status,
    });
    statuMap.set(pro.stat.frontend_question_id, pro.status);
  }
  for (let t of trans.data.translations) {
    transMap.set(t.questionId, t.title);
    let r = infoMap.get(t.questionId);
    if (r) {
      r.zh = t.title;
      infoMap.set(t.questionId, r);
    }
  }
  console.log('infoMap',infoMap);
  buildMapComplete = true;
};

const getCookie = (name) => {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

const replace = () => {
  let even = true;
  for (let problem of $('table tr td')) {
    if (!even) {
      let htmlString = '';
      let normalExit = true;
      let tag = '';
      for (let id of problem.textContent.split('、')) {
        if (isNaN(parseInt(id))) {
          normalExit = false;
          break;
        }
        tag = id;
             let r = infoMap.get(id);
        htmlString += `<a href = 'https://leetcode.cn/problems/${r?.en}/' target = '_blank' style="${r?.status == 'ac' ? 'color:red' : ''}; font-size:14px;" >${id}. ${r?.level}- ${r?.zh}</a>、`;
      }
      if (normalExit) {
        console.log(
          `<td ${statuMap.get(tag) == 'ac' ? 'bgcolor="red"' : 'bgcolor="blue"'}>${htmlString.substring(0, htmlString.length - 1)}</td>`
        );
        problem.innerHTML = `<td>${htmlString.substring(0, htmlString.length - 1)}</td>`;
      }
    }
    even = !even;
  }
};

getProblems();

const interval = setInterval(() => {
  if (buildMapComplete && $('table tr td').length !== 0) {
    clearInterval(interval);
    replace();
  }
}, 5e2);

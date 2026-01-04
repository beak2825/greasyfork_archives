// ==UserScript==
// @name         lab-assignment-system-gakujo-grades-sender
// @namespace    https://lab-assignment-system-project.web.app/
// @version      0.1.1
// @description  成績情報を取得し、lab-assignment-system に送信する。
// @author       earlgray
// @match        https://gakujo.shizuoka.ac.jp/kyoumu/seisekiSearchStudentInit.do*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446819/lab-assignment-system-gakujo-grades-sender.user.js
// @updateURL https://update.greasyfork.org/scripts/446819/lab-assignment-system-gakujo-grades-sender.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   *
   * @param {HTMLDivElement} html
   * @returns
   */
  const scrapeStudentInfo = async (html) => {
    const pElem = html.querySelector(
      'div > table:nth-child(10) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr > td > p'
    );
    if (!pElem) {
      return;
    }
    const matches = pElem.textContent
      .trim()
      .match(/学籍番号：(\d+)　\n\t\t\t\t  学生氏名：(.+)/i);
    if (matches.length !== 3) {
      alert('matches.length !== 3');
      return;
    }
    const studentNumber = matches[1].replace('　', '');
    const studentName = matches[2];
    return {
      studentNumber: studentNumber,
      studentName: studentName,
    };
  };

  /**
   *
   * @param {HTMLDivElement} html
   * @returns
   */
  const scrapeGradesTable = async (html) => {
    const trList = html.querySelectorAll(
      'div > table:nth-child(12) > tbody > tr > td > table > tbody > tr'
    );
    if (trList === 0) {
      return;
    }

    const grades = new Array(0);
    for (const tr of Array.from(trList).slice(1)) {
      const unitNum = Number(
        tr.querySelector('td:nth-child(5)').textContent.trim()
      );
      const point = Number(
        tr.querySelector('td:nth-child(7)').textContent.trim()
      );
      const gp = Number(tr.querySelector('td:nth-child(8)').textContent.trim());
      const reportedAt = tr
        .querySelector('td:nth-child(10)')
        .textContent.trim();
      grades.push({
        unitNum: unitNum,
        gp: gp,
        reportedAt: reportedAt,
        point: point,
      });
    }

    return {
      grades: grades,
    };
  };

  const postJson = async (url, data, token) => {
    return await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Register-Token': token,
      },
      body: JSON.stringify(data),
    });
  };

  const scrapeGrades = async () => {
    const currentUrl = window.location.href;
    const resp = await fetch(currentUrl);
    if (!resp.ok) {
      console.error(`failed to fetch ${currentUrl}`);
      console.error('Maybe it is a session error');
      return;
    }
    const tmpElem = document.createElement('div');
    tmpElem.innerHTML = await resp.text();
    const gradeObj = await scrapeGradesTable(tmpElem);
    const studentInfo = await scrapeStudentInfo(tmpElem);
    let jsonObj = gradeObj;
    jsonObj.studentName = studentInfo.studentName;
    jsonObj.studentNumber = studentInfo.studentNumber;
    return jsonObj;
  };

  const form = document.querySelector('form[name=SeisekiStudentForm]');
  const btn = document.createElement('button');
  btn.textContent = '成績情報を送信する';
  btn.onclick = async () => {
    try {
      const jsonObj = await scrapeGrades();
      console.log(JSON.stringify(jsonObj));

      const registerToken =
        window.prompt('成績登録トークンを入力してください。');
      const backendUrl =
        'https://lab-assignment-system-backend-jgpefn3ota-an.a.run.app/grades';
      const resp = await postJson(backendUrl, jsonObj, registerToken);
      if (!resp.ok) {
        switch (resp.status) {
          case 400:
            alert('成績データの形式が正しくありません');
            break;
          case 401:
            alert('成績登録トークンが正しくありません');
            break;
          case 409:
            alert('成績登録が既に登録されています。更新する場合はプロフィールから成績情報の削除を行なってください。');
            break;
          default:
            alert('原因不明のエラーが発生しました');
        }
      } else {
        alert('成績の登録に成功しました');
      }
    } catch (e) {
      console.error(e);
    }
  };
  form.parentElement.insertBefore(btn, form.nextSibling);
})();

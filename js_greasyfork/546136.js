// ==UserScript==
// @name:en         hinatazaka46-ext-schedule
// @name:ja         日向坂46関連 追加スケジュール挿入
// @namespace       https://greasyfork.org/ja/users/1328592-naoqv
// @description:en  Insert extra schedules
// @description:ja  日向坂46関連 追加スケジュール挿入
// @version         0.03
// @icon            https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @compatible      chrome
// @compatible      firefox
// @grant           none
// @license         MIT
// ==/UserScript==
"use strict";

const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

const SCHEDULE_TYPE = {WEEKLY:'w', SPOT:'s'};

const EXT_WEEKLY_SCHEDULES =  {
  '日': [
         {categ: 'ラジオ', from: '20250101', to: '20250810', start: '19:30', end: '20:00', title: 'DARAZFM「おひさまコネクト」', link: 'https://x.com/ohisamaconnect'},
         {categ: 'ラジオ', from: '20250824', to: '20251231', start: '19:30', end: '20:00', title: 'DARAZFM「おひさまコネクト」', link: 'https://x.com/ohisamaconnect'}
       ],
  '月': [{categ: 'ラジオ', from: '20250101', to: '20251231', start: '20:00', end: '20:30', title: 'DARAZFM「おひさまコネクト」(再)', link: 'https://x.com/ohisamaconnect'}]
};

const EXT_SPOT_SCHEDULES = [
  {categ: 'ラジオ', date: '20250817', start: '16:30', end: '17:00', title: 'DARAZFM「おひさまコネクト」', link: 'https://x.com/ohisamaconnect'},
  {categ: 'ラジオ', date: '20250818', start: '20:00', end: '20:55', title: 'TOKYO FM「エフエムレインボー」', link: 'https://www.tfm.co.jp/shovels/fmrainbow/'},
];


/**
 * 指定する日付の追加のスケジュールを挿入
 * @param {string}      dispYearMonth
 * @param {HTMLElement} lMainContentsUl
 * @param {number}      day - 日付
 * @param {HTMLElement} dayElem - 日付に対応するスケジュール群の要素
 */ 
const insertExtSchedule = (dispYearMonth, lMainContentsUl, day, dayElem) => {

  const date = dispYearMonth + String(day).padStart(2, '0');

  insertSpotSchedule(date, dayElem)
  insertWeeklySchedule(date, dayElem);

  void lMainContentsUl.offsetHeight;
};

/**
 * 指定する日付の追加のスポットスケジュールを挿入
 * @param {string}      date - 日付文字列(yyyyMMdd)
 * @param {HTMLElement} dayElem - 日付に対応するスケジュール群の要素
 */ 
const insertSpotSchedule = (date, dayElem) => {
  Array.prototype.forEach.call(EXT_SPOT_SCHEDULES, (x) => {
    if (date == x.date) {
   	  insert(dayElem, SCHEDULE_TYPE.SPOT, x);   
    }
  });
};

/**
 * 指定する日付の追加の週刊スケジュールを挿入
 * @param {string}      date - 日付文字列(yyyyMMdd)
 * @param {HTMLElement} dayElem - 日付に対応するスケジュール群の要素
 */ 
const insertWeeklySchedule = (date, dayElem) => {

  const dow = dayElem.querySelector('b').innerText;

  Array.prototype.forEach.call(Object.keys(EXT_WEEKLY_SCHEDULES), (dayOfWeek) => {
    if (dow == dayOfWeek) {
      Array.prototype.forEach.call(EXT_WEEKLY_SCHEDULES[dow], (x) => {
        if (date >= x.from && date <= x.to) {
	        insert(dayElem, SCHEDULE_TYPE.WEEKLY, x);
        }
      });
    }
  });
}

/**
 * 追加スケジュールを挿入
 * @param {HTMLElement} dayElem
 * @param {string} type 
 * @param {[key: string]: string}
 */ 
const insert = (dayElem, type, schedule) => {

  const items = dayElem.getElementsByClassName('p-schedule__item');

  // "たいてい"のスケジュールは開始時刻の昇順になってるので配列の順序を反転
  Array.prototype.some.call(Array.prototype.slice.call(items).reverse(), (item, i) => {

    const timeElem = item.querySelector('.c-schedule__time--list');

    if (timeElem.innerText) {

      const time = timeElem.innerText.match(/[0-9]{1,2}:[0-9]{2}/)[0];
      const start = schedule.start;

      // 挿入する開始時刻が既存のスケジュールの開始時刻より後の場合
      if (time < start || i == items.length - 1) {

        item.insertAdjacentHTML('afterend',
          `<li class="p-schedule__item">
             <a href="${schedule.link}">
               <div class="p-schedule__head">
                 <div class="c-schedule__category category_media">
                   ${schedule.categ}
                 </div>
                 <div class="c-schedule__time--list">
                   ${start + '〜' + schedule.end}
                 </div>
               </div>
               <p class="c-schedule__text">
                 ${type == 'w' ? '🗓️' : '📍'} ${schedule.title}
               </p>
             </a>
           </li>`);
        return true;
      }
    }
    return false;
  });
};

/**
 * 予定のない日を埋める
 * @param {string}      dispYearMonth
 * @param {HTMLElement} lMainContentsUl
 */
const fillEmpty = (dispYearMonth, lMainContentsUl) => {

  const year = parseInt(dispYearMonth.substring(0, 4));
  const month = parseInt(dispYearMonth.substring(5, 6)) - 1;
  // 末日
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  const days = Array.prototype.map.call(lMainContentsUl.querySelectorAll('.c-schedule__date--list span'), (x) => {
    return parseInt(x.innerText);
  });

  const diff = [];

  for (i = 1; i <= lastDay; i++) {
    if (days.indexOf(i) === -1) {
      diff.push(new Date(year, month, i));
    }
  }

  const listGroup = lMainContentsUl.querySelectorAll('.p-schedule__list-group');

  Array.prototype.forEach.call(listGroup, (x) => {
    const date = parseInt(x.querySelector('span').innerText);

    Array.prototype.forEach.call([...diff], (d) => {

      if (d.getDate() < date) {
        x.insertAdjacentHTML('beforebegin',
         `<div class="p-schedule__list-group">
            <div class="c-schedule__date--list">
              <span>${d.getDate()}</span><b>${DAY_OF_WEEK[d.getDay()]}</b>
            </div>
            <ul class="p-schedule__list p-schedule__list--long">
            </ul>
          </div>`);
        diff.shift();
      }
    });
  });
};

// ==UserScript==
// @name        hinatazaka46-dateutil
// @namespace   https://greasyfork.org/ja/users/1328592-naoqv
// @description  Hinatazak46 dateeutil
// @description:ja  日向坂46 日付ユーティリティライブラリ
// @version     0.08
// @icon        https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @compatible  chrome
// @compatible  firefox
// @grant       none
// @license     MIT
// ==/UserScript==

"use strict";

const last2digitsFromYear = (year) => (((str) => str.substring(str.length - 2))(year.toString()));

const weekDay = {
  0: 'Sun.',
  1: 'Mon.',
  2: 'Tue.',
  3: 'Wed.',
  4: 'Thu.',
  5: 'Fri.',
  6: 'Sat.',
};

/**
 * 年表示を短縮表記して曜日を付加 yyyy.MM.dd hh:mm → 'yy.MM.dd(a) hh:mm
 * @param {string} yearSelector - 年表示要素セレクタ
 */
const shortenYearWithDay = (yearSelector) => {
  Array.prototype.forEach.call(document.querySelectorAll(yearSelector), (x) => {
 
    const text = x.innerText;
    const match = text.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})(\s(\d{2}):(\d{2}))?/);

    if (match && match[3]) {

      const date = new Date(parseInt(match[1]), parseInt(match[2] - 1), parseInt(match[3]), match[4] ? parseInt(match[4]) : 0, match[4] ? parseInt(match[4]) : 0, 0, 0);

      if (match[5]) {
        x.innerText
        = text.replace(/\d{4}\.\d{1,2}\.\d{1,2}\s\d{2}:\d{2}/, `'${last2digitsFromYear(date.getFullYear())}.${date.getMonth() + 1}.${date.getDate()} ${weekDay[date.getDay()]} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`);
      } else {
        x.innerText
        = text.replace(/\d{4}\.\d{1,2}\.\d{1,2}/, `'${last2digitsFromYear(date.getFullYear())}.${date.getMonth() + 1}.${date.getDate()} ${weekDay[date.getDay()]}`);
      }
    } else {
      x.innerText = text.replace(/^(?!')\d{2}(\d{2}\.)/, "'$1");
    }
  });
};

/**
 * Excel日付型のシリアル値からDateオブジェクトを生成
 * @param {string} serial - シリアル値
 */
const excelSerialToDate = (serial) => {
  // Excelは1900年1月1日を1として扱うが、JSのDateは1970年が起点
  // 1900-01-01 から 1970-01-01 までの日数 = 25569日（ただし、Excelの1900年はうるう年として誤認しているので補正必要）
  const msPerDay = 24 * 60 * 60 * 1000;
  const excelEpochOffset = 25569;

  // Excelのシリアル値が整数の場合も小数（時間付き）でも対応
  const date = new Date((parseInt(serial) - excelEpochOffset) * msPerDay);
  return date;
};

/**
 * 黄道12星座
 */
const ZODIAC = {

  ARIES       : "おひつじ座",
  TAURUS      : "おうし座",
  GEMINI      : "ふたご座",
  CANCER      : "かに座",
  LEO         : "しし座",
  VIRGO       : "おとめ座",
  LIBRA       : "てんびん座",
  SCORPIO     : "さそり座",
  SAGITTARIUS : "いて座",
  CAPRICORN   : "やぎ座",
  AQUARIUS    : "みずがめ座",
  PISCES      : "うお座"
}

/**
 * 誕生日日付に該当する星座を返す
 * @param {date} date - 誕生日
 */
const getZodiacSign = (date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC.AQUARIUS;
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC.PISCES;
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC.ARIES;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC.TAURUS;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC.GEMINI;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC.CANCER;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC.LEO;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC.VIRGO;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC.LIBRA;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC.SCORPIO;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC.SAGITTARIUS;
  return ZODIAC.CAPRICORN; // (12/22〜1/19)
};

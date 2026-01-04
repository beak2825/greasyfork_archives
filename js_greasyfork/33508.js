// ==UserScript==
// @name         Gmail Calender Connector
// @version      1.0.3
// @description  Füllt bei Anlage eines Kalendereintrages aus einer E-Mail heraus automatisch Datum und Uhrzeit aus
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Gmail%20Calender%20Connector]%20
// @include      https://calendar.google.com/calendar/*/eventedit?dates*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/33508/Gmail%20Calender%20Connector.user.js
// @updateURL https://update.greasyfork.org/scripts/33508/Gmail%20Calender%20Connector.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ['warn', 'single', {'avoidEscape': true}] */
/* eslint curly: 'off' */

var now = new Date();
var link = location.search;
link = link.replace('Januar', '01.').replace('Februar', '02.').replace('März', '03.').replace('April', '04.').replace('Mai', '05.').replace('Juni', '06.');
link = link.replace('Juli', '07.').replace('August', '08.').replace('September', '09.').replace('Oktober', '10.').replace('November', '11.').replace('Dezember', '12.');
link = link.replace('Jan.', '01.').replace('Febr.', '02.').replace('März', '03.').replace('Apr.', '04.').replace('Mai', '05.').replace('Juni', '06.');
link = link.replace('Juli', '07.').replace('Aug.', '08.').replace('Sept.', '09.').replace('Okt.', '10.').replace('Nov.', '11.').replace('Dez.', '12.');
link = link.replace('&sf', '33.12.&sf');
var date = link.match(/([0-3]?\d)\.\+?([0-3]?\d)\./g) [0].replace('+', '');
var time = link.replace(/(\.|:)(\d\d)?(\+)?Uhr/, ':$2').replace(/(\d\d)(\+)?Uhr/, '$1:00').replace('&sf', '12:00&sf');
time = time.match(/([0-2]?\d)\:(\d\d)/g) [0].replace(':', '');
var starttime = (Number(time)+(5/3)*now.getTimezoneOffset()).toString();
if (starttime.length == 3) {
  starttime = '0' + starttime;
}
var endtime = (Number(starttime) + 200).toString();
if (endtime.length == 3) {
  endtime = '0' + endtime;
}
if (date != '33.12.') {
  if (date.split('.') [0].length == 1) {
    date = '0' + date;
  }
  if (date.split('.') [1].length == 1) {
    date = date.replace('.', '.0');
  }
  date = now.getFullYear() + date.split('.') [1] + date.split('.') [0];
  date = date + 'T' + starttime + '00Z/' + date + 'T' + endtime + '00Z';
  location.search = '?text=' + document.URL.split('&text=') [1].split('&details=')[0] + '&dates=' + date + '&details=' + document.URL.split('&details=') [1] ;
} else {
  var mail = link.match(/(Sonntag|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|&sf)/g) [0];
  if (mail != '&sf') {
    var weekday = 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_');
    mail = weekday.indexOf(mail);
    var dated = String(now.getDate() + mail - now.getDay());
    if (now.getDay() >= mail){
      dated = Number(dated) + 7;
    }
    var month = String(now.getMonth() + 1);
    if (month.length == 1){
      month = '0' + month;
    }
    if (dated.length == 1){
      dated = '0' + dated;
    }
    date = now.getFullYear() + month + dated;
    date = date + 'T' + starttime + '00Z/' + date + 'T' + endtime + '00Z';
    location.search = '?text=' + document.URL.split('&text=') [1].split('&details=')[0] + '&dates=' + date + '&details=' + document.URL.split('&details=') [1];
  }
}

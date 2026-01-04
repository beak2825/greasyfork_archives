// ==UserScript==
// @name         scombZ時間割教室の修正
// @namespace    twitter.com/to_ku_me
// @version      0.1.2
// @description  時間割のページで表示される教室の背景の透明度を下げることで可読性を上げます。
// @author       とくめいっ！
// @match        https://scombz.shibaura-it.ac.jp/lms/timetable
// @icon         http://www.sic.shibaura-it.ac.jp/MoSICA/shikaz.png
// @downloadURL https://update.greasyfork.org/scripts/444153/scombZ%E6%99%82%E9%96%93%E5%89%B2%E6%95%99%E5%AE%A4%E3%81%AE%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/444153/scombZ%E6%99%82%E9%96%93%E5%89%B2%E6%95%99%E5%AE%A4%E3%81%AE%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

let style = `<style>
.ui-widget-shadow {
	opacity: 1;
}
<style>`;

document.querySelector(`head`).insertAdjacentHTML('beforeend', style);
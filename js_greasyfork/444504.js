// ==UserScript==
// @name         CINEMACITY予約Googleカレンダー連携
// @namespace    https://github.com/AyeBee/CINEMACITYSyncToGoogleCalender
// @version      1.1
// @description  CINEMACITYのマイページに、予約内容のGoogleカレンダー登録ボタンを追加します。
// @author       ayebee
// @match        https://res.cinemacity.co.jp/TicketReserver/mypage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cinemacity.co.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444504/CINEMACITY%E4%BA%88%E7%B4%84Google%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E9%80%A3%E6%90%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/444504/CINEMACITY%E4%BA%88%E7%B4%84Google%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E9%80%A3%E6%90%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.querySelectorAll('#reserves>.reserve-box')).forEach(e => {
        const items = Array.from(e.querySelectorAll('dl > dd')).map(i => i.textContent.trim());

        //console.log(items);

        const title = items[0];

        const [date, time] = items[1].split("\u{A0}");
        const date2 = date.replace(/日\(.\)$/, '').split(/年|月/).map(i => i.padStart(2, '0')).join('');
        const [beginTime, endTime] = time.split('-').map(i => `${date2}T${i.replace(':', '').padStart(4, '0')}00`);
        
        const place = items[2];
        const numberOfSheets = items[3];
        const sheetName = items[4];
        const totalPrice = items[5];
        const number = items[6];

        const text = encodeURIComponent(`${title} 【${sheetName}】`);
        const dates = `${beginTime}/${endTime}`;
        const location = encodeURIComponent(place);
        const details = encodeURIComponent(`
             https://res.cinemacity.co.jp/TicketReserver/mypage
            【ログイン】https://res.cinemacity.co.jp/TicketReserver/mypage
            【作品名】${title}
            【上映日時】${date} ${time}
            【劇場】${place}
            【枚数】${numberOfSheets}
            【座席】${sheetName}
            【合計金額】${totalPrice}
            【チケット番号】${number}
        `.trim().split("\n").map(i => i.trim()).join("\n"));
        
        const button = document.createElement('input');
        button.type = 'button';
        button.value = 'Googleカレンダー登録';
        button.onclick = () => {
            window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&location=${location}&details=${details}`, '_blank');
            return false;
        }

        const buttonWrapper = document.createElement('div');
        buttonWrapper.appendChild(button);
        buttonWrapper.style.paddingTop = '2px';
        buttonWrapper.style.paddingRight = '2px';
        buttonWrapper.style.float = 'right';

        e.querySelector('.reserve-num > .clear').before(buttonWrapper);
    });
})();

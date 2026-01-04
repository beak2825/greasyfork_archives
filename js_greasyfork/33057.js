// ==UserScript==
// @name         Sort Steam Achievement
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Makes Steam achievements sorted by unlock date.
// @author       Makazeu
// @match        *://steamcommunity.com/id/*/stats/*
// @grant        none
// @require      https://cdn.bootcss.com/moment.js/2.18.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/33057/Sort%20Steam%20Achievement.user.js
// @updateURL https://update.greasyfork.org/scripts/33057/Sort%20Steam%20Achievement.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    let comparator = (a, b) => {
        let a_datetime = datetimeParser(
            a.children[1].children[0].children[0].innerText.trim());
        let b_datetime = datetimeParser(
            b.children[1].children[0].children[0].innerText.trim());
        return a_datetime.isBefore(b_datetime) ? -1 : 1;
    };

    let datetimeParser =  datetime => {
        datetime = datetime.substring('解锁日期 '.length);
    
        datetime = datetime.replace('上午', ' AM ');
        datetime = datetime.replace('下午', ' PM ');
    
        if (datetime.includes('年')) {
            return moment(datetime, 'YYYY年MM月DD日 A HH:mm');
        } else {
            return moment(datetime, 'MM月DD日 A HH:mm');
        }
    };

    let achieveFilter = (key, value) => {
        if (value.innerHTML === '') return false; 
        if (value.children[1].children[0].children.length < 3) return false;
        if (!value.children[1].children[0].children[0]
            .innerText.includes('解锁')) return false;
        return true;
    };

    let achieveSet = jQuery('#personalAchieve');
    let achieveRows = achieveSet.children().filter(achieveFilter);
    let arr = Array.from(achieveRows);
    
    arr.sort(comparator);

    for (let i = 0; i < achieveRows.length; i++) {
        let element = achieveRows[i];
        element.remove();
    }

    arr.forEach( achieve => {
        //console.log(achieve.children[1].children[0].children[1].innerText);
        achieveSet.prepend(achieve);
    });
    
})();

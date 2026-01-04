// ==UserScript==
// @name         Sum Volume
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Calculate sum of volume
// @author       amiwrpremium
// @match        https://wallex.ir/app/daily-trades-volume
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429797/Sum%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/429797/Sum%20Volume.meta.js
// ==/UserScript==

(function() {
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (document.querySelector('#pjax-container > section.content-header > h1').innerText === 'حجم معاملات امروز ') {
        let table = document.querySelector('#pjax-container > section.content > div > div > div > div > div > div.panel-body > table > tbody')
        let header = document.querySelector('#pjax-container > section.content-header > h1')

        let result = document.createElement('p')
        result.innerHTML = '</br>مجموع: '
        header.appendChild(result)

        function get_sum() {
            let sum_list = []
            let sum = 0;

            for (let i in table.rows) {
                try {
                    let row = table.rows[i]
                    let key = row.cells[0].innerText
                    let value = parseInt(row.cells[1].innerText.split(' ')[0].replaceAll(',', ''))
                    if (key.includes('ریال') && !key.includes('تتر')) {
                        sum_list.push(value)
                    }
                } catch (e) {
                }
            }

            for (let i = 0; i < sum_list.length; i++) {
                sum += sum_list[i];
            }
            result.innerHTML = `</br>مجموع: ${numberWithCommas(sum)}`
            console.log(sum);
        }
        get_sum()
    }
    else{
        console.log('NO')
    }
})();
// ==UserScript==
// @name         Make Otsuka-Poratl convinient
// @version      1.0
// @description  Mark date colored in Otsuka-Portal.
// @author       Yuto Uematsu
// @match        http://op.d1.otsuka-shokai.co.jp/Pages/default.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=otsuka-shokai.co.jp
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      Yuto-34

// @namespace https://greasyfork.org/users/895947
// @downloadURL https://update.greasyfork.org/scripts/467931/Make%20Otsuka-Poratl%20convinient.user.js
// @updateURL https://update.greasyfork.org/scripts/467931/Make%20Otsuka-Poratl%20convinient.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getDateAsFormat(date) {
        var year = date.getFullYear();
        var month = ('00' + (date.getMonth() + 1)).slice(-2);
        var day = ('00' + date.getDate()).slice(-2);
        var today = "[" + year + "/" + month + "/" + day + "]";
        return today;
    }

    function setDateColor(date, color, weight = 'bold') {
        var pLinks = document.getElementsByClassName('pagelink');
        for (let i = 0; i < pLinks.length; i++) {
            var pLink = pLinks[i];
            var pLinkV = pLink.innerText;
            // console.log(pLinkV);
            if (pLinkV == date) {
                pLink.style.color = color;
                pLink.style.fontWeight = weight
            }
            pLink.style.fontSize = '12px';
        }
    }

    function setWidth() {
        document.getElementsByClassName('tableCol-75')[0].style.width = '100%';
        const areas = document.getElementsByClassName('ms-WPBorder ms-wpContentDivSpace');
        for (let i = 0; i < areas.length; i++) {
            var area = areas[i];
            area.style.width = '100%';
        }
        const lists = document.getElementsByClassName('cbqWrap');
        for (let i = 0; i < lists.length; i++) {
            var list = lists[i];
            list.style.width = '100%';
            console.log(lists.children[i].textContent);
        }


        const dls = document.getElementsByTagName('dl');
        const dds = document.getElementsByTagName('dd');
        for (let i = 0; i < dls.length; i++) {
            var dl = dls[i];
            var dd = dds[i];
            // dl.calssList.add('dl_width_set');
            // dd.calssList.add('dd_width_set');
            dd.style.width = 'calc(95% - 90px)';
            dl.style.width = 'calc(100% - 6px)';
            // dl.style.width = '';
        }
    }


    var date = new Date();
    var today = getDateAsFormat(date);
    date.setDate(date.getDate() - 1);
    var yesterday = getDateAsFormat(date);
    console.log(today);
    console.log(yesterday);

    setDateColor(today, "red");
    setDateColor(yesterday, "green", "noramal");


    // // 例)2秒スリープさせる
    // const d1 = new Date();
    // while (true) {
    //     const d2 = new Date();
    //     console.log(d2 - d1);
    //     if (d2 - d1 > 1000) {
    //         console.log(d2 - d1);
    //         break;
    //     }
    // }

    setWidth();

    let childSpan = document.createElement('button');
    childSpan.id = 'changeButton';
    childSpan.class = 'changeBoxesButton';
    childSpan.value = 'submit';
    childSpan.innerText = '変更';
    childSpan.setAttribute('onclick', 'setWidth()');

    const par = document.getElementById('zz7_RootAspMenu');
    par.appendChild(childSpan);
})();
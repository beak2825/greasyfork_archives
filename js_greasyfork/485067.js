// ==UserScript==
// @name         Cортировка юнитов ГЛ по лидерству или инициативе
// @version      1.0.3
// @description  Сортирует юниты ГЛ по лидерству и показывает очки лидерства. Так же есть сортировка по инициативе.
// @author       isnt
// @include      /^https:\/\/((www|qrator|my)(\.heroeswm\.ru|\.lordswm\.com))\/leader_army\.php.*/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @namespace isnt
// @downloadURL https://update.greasyfork.org/scripts/485067/C%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%8E%D0%BD%D0%B8%D1%82%D0%BE%D0%B2%20%D0%93%D0%9B%20%D0%BF%D0%BE%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D1%81%D1%82%D0%B2%D1%83%20%D0%B8%D0%BB%D0%B8%20%D0%B8%D0%BD%D0%B8%D1%86%D0%B8%D0%B0%D1%82%D0%B8%D0%B2%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/485067/C%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%8E%D0%BD%D0%B8%D1%82%D0%BE%D0%B2%20%D0%93%D0%9B%20%D0%BF%D0%BE%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D1%81%D1%82%D0%B2%D1%83%20%D0%B8%D0%BB%D0%B8%20%D0%B8%D0%BD%D0%B8%D1%86%D0%B8%D0%B0%D1%82%D0%B8%D0%B2%D0%B5.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let sorting_key = 1;
    let race = 12;
    const showCount = () => {
        let nf = new Intl.NumberFormat('en-US');
        let arrDOM = [...document.querySelectorAll("#cre_top > div")];
        let bookmark = document.querySelectorAll(".leader_bookmarks > div");
        for (let i = 1; i < bookmark.length; i++) {
            if (bookmark[2].className == 'selected_bookmark') race = 12;
            else if (bookmark[13].className == 'selected_bookmark') race = 0;
            else if (bookmark[i].className == 'selected_bookmark') race = i - 2;
        }
        if (race == 12) {
            for (let i = 1; i < obj.length; i++) {
                if (obj[i] == undefined) continue;
                arrDOM[i - 1].sumCount = obj[i].cost * obj[i].count;
                arrDOM[i - 1].innerHTML += `<p style="display: none;position: absolute; z-index: 10; top: -8px; left: 6px; font-weight: 600; font-size: 11px; color: #140e06;background-color: #f5c140;padding: 1px 5px;border-radius: 4px;">${nf.format(arrDOM[i-1].sumCount)}</p>`
            }
        } else {
            let arr = [];
            for (let i = 1; i < obj.length - 1; i++) {
                if (obj[i].race !== race) continue;
                arr.push(obj[i].cost * obj[i].count);
                // arrDOM[i-1].sumCount = obj[i].cost * obj[i].count;
                // arrDOM[i-1].innerHTML += `<p style="display: none;position: absolute; z-index: 10; top: -8px; left: 6px; font-weight: 600; font-size: 11px; color: #140e06;background-color: #f5c140;padding: 1px 5px;border-radius: 4px;">${nf.format(arrDOM[i-1].sumCount)}</p>`
            }
            for (let i = 0; i < arr.length; i++) {
                arrDOM[i].sumCount = arr[i];
                arrDOM[i].innerHTML += `<p style="display: none;position: absolute; z-index: 10; top: -8px; left: 6px; font-weight: 600; font-size: 11px; color: #140e06;background-color: #f5c140;padding: 1px 5px;border-radius: 4px;">${nf.format(arrDOM[i].sumCount)}</p>`
            }
        }
        document.querySelectorAll("#cre_top > div").forEach(function(el) {
            el.addEventListener('mouseenter', function(e) { //
                this.children[3].style.display = 'block';
            });
            el.addEventListener('mouseleave', function(e) { //
                this.children[3].style.display = 'none';
            });
        });
    }
    const sumLeaders = () => {
        // let arrDOM = [...document.querySelectorAll("#cre_top > div")];
        let i = document.createElement("div");
        i.setAttribute('class', 'bookmark');
        i.title = 'Cортировка по очкам лидерства';
        // i.setAttribute('style', 'position: absolute; top: 12px; left: 24px;');
        i.innerHTML = `<img src="https://i.imgur.com/Af5HMCT.png" style="width: 24px;">`;
        i.addEventListener("click", function(e) {
            sortLeaders();
        });
        document.querySelector("#army_info_div > div.leader_bookmarks").prepend(i);
        showCount();
        // for(let i = 1; i < obj.length; i++) {
        //      if(obj[i] == undefined) continue;
        //      arrDOM[i-1].sumCount = obj[i].cost * obj[i].count;
        //      arrDOM[i-1].innerHTML += `<p style="display: none;position: absolute; z-index: 10; top: -8px; left: 6px; font-weight: 600; font-size: 11px; color: #140e06;background-color: #f5c140;padding: 1px 5px;border-radius: 4px;">${nf.format(arrDOM[i-1].sumCount)}</p>`
        // }
    }
    const initBtn = () => {
        let i = document.createElement("div");
        i.setAttribute('class', 'bookmark');
        i.title = 'Cортировка по инициативе';
        i.innerHTML = `<img src="https://dcdn.heroeswm.ru/i/icons/attr_initiative2.png" style="width: 24px;">`;
        i.addEventListener("click", function(e) {
            sortInit();
        });
        document.querySelector("#army_info_div > div.leader_bookmarks").prepend(i);
    }
    window.onload = function() {
        initBtn();
        sumLeaders();
        let bookmark = document.querySelectorAll(".leader_bookmarks > div");
        bookmark.forEach(function(el) {
            if (el.title !== 'Cортировка по очкам лидерства') {
                el.addEventListener('click', function(e) { //
                    showCount();
                });
            }
        });
    }
    const sortLeaders = () => {
        if (sorting_key == 1) {
            // arr.sort((a, b) => Number(b.sumCount) - Number(a.sumCount)).forEach((a, i) => {
            //    a.parentElement.appendChild(a);
            // })
            obj.sort((a, b) => b.cost * b.count - a.cost * a.count)
            if (obj[0] !== 0) obj.unshift(0);
            show_army();
            showCount();
            sorting_key = 0;
        } else {
            // arr.sort((a, b) => Number(a.sumCount) - Number(b.sumCount)).forEach((a, i) => {
            //      a.parentElement.appendChild(a);
            // })
            obj.sort((a, b) => a.cost * a.count - b.cost * b.count)
            if (obj[0] !== 0) obj.unshift(0);
            show_army();
            showCount();
            sorting_key = 1;
        }
    }
    const reInit = (init) => {
        let re1 = /(.*)<font/gm;
        let re2 = /\+([\s\S]+?)%/gm;
        let x = '';
        if (/font/i.test(init)) {
            let plus = re2.exec(init);
            x = re1.exec(init);
            x = Number(x[1]) + Number(plus[1]);
        } else x = init;
        return x;
    }
    const sortInit = () => {
        if (sorting_key == 1) {
            obj.sort((a, b) => reInit(b.maxinit) - reInit(a.maxinit))
            if (obj[0] !== 0) obj.unshift(0);
            show_army();
            showCount();
            sorting_key = 0;
        } else {
            obj.sort((a, b) => reInit(a.maxinit) - reInit(b.maxinit))
            if (obj[0] !== 0) obj.unshift(0);
            show_army();
            showCount();
            sorting_key = 1;
        }
    }
})();
// ==UserScript==
// @name         clanwar_helper
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @author       Лосось
// @description  clanwar_helper_to_fuck_928
// @match        /^https{0,1}:\/\/((www|my|mirror)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(clan_info).php*/
// @include      /^https{0,1}:\/\/((www|my|mirror)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(clan_info).php*/
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544735/clanwar_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/544735/clanwar_helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let clanId = 1519;

    let links = ['https://my.lordswm.com', 'https://www.heroeswm.ru'];
    let link = location.href.slice(0,22) === 'https://my.lordswm.com' ? links[0] : links[1];

    const createEl = (el, style, innerText) => {
        let element = document.createElement(el);
        if (style) element.style = style;
        if (innerText) element.innerText = innerText;
        return element;
    }

    // mySign block
    let myCode = localStorage.getItem('myCode');
    let currentId = document.cookie.match(/pl_id=\d*/gi).join('');
    let myId = localStorage.getItem('myId');

    let fetchCode = async () => {
        fetch(`${link}/castle.php?show_castle_f=1`)
            .then(function(response) {
            return response.text()
        })
            .then(function(html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var element = doc.getElementsByClassName('castle_yes_no_buttons')[0].getElementsByTagName('a')[0].href;
            var code = element.slice(-32);
            var plId = document.cookie.match(/pl_id=\d*/gi);
            localStorage.setItem('myCode', code);
        })
            .catch(function(err) {
        });
    }

    if (!myCode) fetchCode();

    if (myId !== currentId) {
        fetchCode();
        localStorage.setItem('myId', currentId);
    }
    // end of mySing block

    const fetchSpy = (id) => {
        fetch(`${link}/clan_bplan.php?id=${clanId}&action=explore_obj&sign=${myCode}&exp_value=${id}`)
            .then((res) => {
            const dialog = createEl("div","z-index: 999999; position: fixed; width: 450px; padding: 10px; border: 1px solid grey; height: 25px; display:flex; align-items: center; text-content: center; border-radius: 10px; background: white; top: 10%; left: 50%;transform: translate(-50%, -50%);");
            dialog.id = 'aboba';
            if (res.url.includes("not_found=1")) {
                const msg = createEl(
                    "div",
                    "font-size: 12px; color: blue; font-weight: bold;",
                    `У разведчиков нет информации о нападениях на объект #${id} сегодня. Очки бс. не сняты.`
                );
                dialog.appendChild(msg);

            } else if (res.url.includes("result=")) {
                const msg = createEl(
                    "div",
                    "font-size: 12px;color: green; font-weight: bold;",
                    "Будет. Смотри военную политику."
                );
                dialog.appendChild(msg);
            }
            document.body.appendChild(dialog);

            const timeout = setTimeout(() => {
                dialog.style.display = "none";
            }, 1500);
        });
    }

    const fetchDopka = (id) => {
        fetch(`${link}/clan_bplan.php?id=${clanId}&action=order_obj&sign=${myCode}&order_value=${id}`)
            .then((res) => {
            const dialog = createEl("div","position: fixed; width: 450px; padding: 10px; border: 1px solid grey; height: 25px; display:flex; align-items: center; text-content: center; border-radius: 10px; background: white; top: 50%; left: 50%;transform: translate(-50%, -50%);");

            if (res.url.includes("already_found=1")) {
                const msg = createEl(
                    "div",
                    "font-size: 12px; color: blue; font-weight: bold;",
                    `Вы или кто-то другой уже заказали нападение на объект #${id} Очки бс. и золото не сняты.`
                );
                dialog.appendChild(msg);

            } else if (res.url.includes("result=")) {
                const msg = createEl(
                    "div",
                    "font-size: 12px;color: green; font-weight: bold;",
                    "Заказано. Смотри военную политику."
                );
                dialog.appendChild(msg);
            }
            document.body.append(dialog);

            const timeout = setTimeout(() => {
                dialog.style.display = "none";
            }, 1500);
        });
    }


    let center = [...document.getElementsByTagName('center')]
    center = center.filter(el => el.innerHTML.includes("под контролем"));

    let parentCenter = center.length > 1 ? center[1].parentElement : center[0].parentElement;

    let tds = [...parentCenter.getElementsByTagName("td")];
    tds = tds.filter(el => el.innerHTML.includes('object-info'));

    tds.forEach(el => {
        let objId = el.innerHTML.match(/\d+/gi)[0];
        let spySpan = createEl('span', 'cursor: pointer; text-decoration: underline; margin-left: 20px; margin-right: 20px;', 'Разведка');
        let spyImg = createEl('img', 'width: 20px; height: 20px;');
        spyImg.src = 'https://cdn-icons-png.flaticon.com/128/3850/3850205.png';
        spySpan.append(spyImg);
        let survSpan = createEl('span', 'cursor: pointer; text-decoration: underline', 'Допка');
        let survImg = createEl('img', 'width: 20px; height: 20px;');
        survImg.src = 'https://cdn-icons-png.flaticon.com/128/4793/4793069.png';
        survSpan.append(survImg);

        spySpan.addEventListener("click", () => {
            fetchSpy(objId);
        });

        survSpan.addEventListener("click", () => {
            fetchDopka(objId);
        })

        el.append(spySpan);
        el.append(survSpan);
    })

})();
// ==UserScript==
// @name         Clan Warehouse Fast Dress Up
// @namespace    nexterot
// @version      1.0.0
// @license      none
// @description  Расширение для клан склада, позволяющее надевать/cнимать арты на странице склада
// @author       nexterot
// @match        https://www.heroeswm.ru/sklad_info.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @homepage     https://greasyfork.org/ru/scripts/515615-clan-warehouse-fast-dress-up
// @downloadURL https://update.greasyfork.org/scripts/515615/Clan%20Warehouse%20Fast%20Dress%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/515615/Clan%20Warehouse%20Fast%20Dress%20Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(main, 300);

    function main()
    {
        var allArtsids = [];
        var returnLinks = [];
        for (const a of document.links) {
            var res = a.href.match(/inventory\.php\?art_return=(\d+)&/);
            if (!res) {
                continue;
            }

            if (a.parentElement.innerHTML.includes('В ремонте')) {
                continue;
            }

            var td = a.parentElement;
            var tr = td.parentElement;
            var tbody = tr.parentElement;
            var trArts = tbody.rows[0];

            var re = /uid=(\d+)/g;
            var m;
            var artsIdsToDressOn = [];
            do {
                m = re.exec(trArts.innerHTML);
                if (m) {
                    artsIdsToDressOn.push(m[1]);
                    allArtsids.push(m[1]);
                }
            } while (m);

            var unknownSet = false;
            var tr2 = trArts.querySelector("td:nth-child(1) > table > tbody > tr:nth-child(1) > td > table > tbody > tr");
            if (tr2 && tr2.cells.length != artsIdsToDressOn.length) {
                unknownSet = true;
            }

            if (!unknownSet && artsIdsToDressOn.length == 0) {
                artsIdsToDressOn.push(res[1]);
                allArtsids.push(res[1]);
            }

            returnLinks.push(a.href);

            if (a.parentElement.innerHTML.includes('Еще боев: 0')) {
                continue;
            }
            var dressUpButton = document.createElement('a');
            dressUpButton.innerHTML = 'надеть';
            dressUpButton.href = "javascript:void(0)";
            if (!unknownSet) {
                dressUpButton.addEventListener("click", clickDressOn(artsIdsToDressOn));
            } else {
                dressUpButton.addEventListener("click", function(){alert('сорри, комплекты акционки только через "надеть всё" :(')});
                dressUpButton.title = 'сорри, комплекты акционки только через "надеть всё" :(';
                dressUpButton.style.color = '#ff0000';
                dressUpButton.style.setProperty("text-decoration", "line-through");
            }
            var br = document.createElement('br');
            a.parentElement.appendChild(br);
            a.parentElement.appendChild(dressUpButton);
        }
        for (const b of document.getElementsByTagName('b')) {
            if (b.innerHTML.includes('Ваша аренда')) {

                var undressAllButton = document.createElement('a');
                undressAllButton.innerHTML = 'снять всё';
                undressAllButton.href = "javascript:void(0)";
                undressAllButton.addEventListener("click", clickUndressAll());
                br = document.createElement('b');
                br.innerHTML = " \\ ";
                b.parentElement.appendChild(br);
                b.parentElement.appendChild(undressAllButton);


                if (returnLinks.length > 0) {
                    var returnAllButton = document.createElement('a');
                    returnAllButton.innerHTML = 'вернуть всё';
                    returnAllButton.href = "javascript:void(0)";
                    returnAllButton.addEventListener("click", returnAll(returnLinks));
                    br = document.createElement('b');
                    br.innerHTML = " \\ ";
                    b.parentElement.appendChild(br);
                    b.parentElement.appendChild(returnAllButton);
                }

                if (returnLinks.length > 0) {
                    var dressUpAllButton = document.createElement('a');
                    dressUpAllButton.innerHTML = 'надеть всё';
                    dressUpAllButton.href = "javascript:void(0)";
                    dressUpAllButton.addEventListener("click", clickDressAllOn());
                    br = document.createElement('b');
                    br.innerHTML = " \\ ";
                    b.parentElement.appendChild(br);
                    b.parentElement.appendChild(dressUpAllButton);
                }

                break;
            }
        }
    }
    function returnAll(links) {
        return async function(event) {
            for (var i = 0; i < links.length; i++) {
                getPage(links[i]);
                await await new Promise(resolve => setTimeout(resolve, 300));
            }
            setTimeout(reload, 300);
        };
    }
    function clickUndressAll() {
        return function(event) {
            getPage(`https://www.heroeswm.ru/inventory.php?all_off=100&js=1`);
            setTimeout(reload, 300);
        };
    }
    function clickDressOn(ids) {
        return async function(event) {
            for (var i = 0; i < ids.length; i++) {
                getPage(`https://www.heroeswm.ru/inventory.php?dress=${ids[i]}&js=1&last_ring_dress=0`);
                await await new Promise(resolve => setTimeout(resolve, 300));
            }
            setTimeout(reload, 300);
        };
    }
    function clickDressAllOn() {
        return async function(event) {
            var pText = await getPage('https://www.heroeswm.ru/inventory.php');
            var re = /arts\[(\d+)\]\['sklad_id'\] = ([1-9]\d*)/g;
            var m;
            var artIndexes = [];
            do {
                m = re.exec(pText);
                if (m) {
                    artIndexes.push(m[1]);
                }
            } while (m);

            var artIds = [];
            for (var id of artIndexes) {
                re = new RegExp(`arts\\[${id}\\]\\['arenda_war'\\] = ([1-9]\\d*)`);
                   // console.log(re);
                m = re.exec(pText);
                if (!m) {
                    continue;
                }
                re = new RegExp(`arts\\[${id}\\]\\['dressed'\\] = 0`);
                   // console.log(re);
                m = re.exec(pText);
                if (!m) {
                    continue;
                }
                re = new RegExp(`arts\\[${id}\\]\\['id'\\] = ([1-9]\\d*)`);
                   // console.log(re);
                m = re.exec(pText);
                if (m) {
                    artIds.push(m[1]);
                }
            }
                // console.log(artIds);

            clickDressOn(artIds)(null);
        };
    }
    function reload() {
        window.location.reload(true);
    }
    async function getPage(aURL) {
        var response = fetch(aURL)
            .then((resp) => resp.arrayBuffer());
        let html = new TextDecoder('windows-1251').decode(await response);
        return html;
    }
})();
// ==UserScript==
// @name         SmithNotification
// @license      none
// @namespace    nexterot
// @version      1.8.1
// @description  Показывает иконку кирки, есть сломанные артефакты на кланскладе, или когда подвесили арт на починку
// @author       nexterot
// @include      *heroeswm.ru*
// @exclude      *heroeswm.ru/sklad_info.php*
// @exclude      *heroeswm.ru/war.php*
// @exclude      *heroeswm.ru/cgame.php*
// @exclude      *heroeswm.ru/mod_workbench.php*
// @exclude      *heroeswm.ru/inventory.php*
// @exclude      *heroeswm.ru/frames.php*
// @exclude      *heroeswm.ru/chat*
// @exclude      *daily*
// @grant        GM_getValue
// @grant        GM_setValue
// @homepage     https://greasyfork.org/ru/scripts/471596-smithnotification
// @downloadURL https://update.greasyfork.org/scripts/471596/SmithNotification.user.js
// @updateURL https://update.greasyfork.org/scripts/471596/SmithNotification.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const ScriptName = 'SmithNotification';
    const CookieName = 'forge_end_time';
    const inventoryLink = 'inventory.php';
    const forgeLink = 'mod_workbench.php?type=repair';
    const clanAmbarLink = 'sklad_info.php?id=32&cat=0';
    var redirectLink = clanAmbarLink;
    setTimeout(main, 300);
    async function main() {
        var forgeEndTime = GM_getValue(CookieName, null);
        if (forgeEndTime != null && new Date() < Date.parse(forgeEndTime)) {
            log(`no need to check forgery until ${forgeEndTime.slice(0, -37)}`);
            return;
        }

        var pText = await getPage(forgeLink);
        if (pText == null) {
            log(`could not get "${forgeLink}"`);
            return;
        }

        var res = /В ремонте: еще (?:(\d+)(?: ч\. ))?(\d+) мин\./.exec(pText);
            //console.log(res);
        if (res != null && res.length == 3) {
            var today = new Date();
            var deltaHours = res[1] ?? 0;
            var deltaMinutes = res[2] ?? 0;
            today.setHours(today.getHours() + Number(deltaHours));
            today.setMinutes(today.getMinutes() + Number(deltaMinutes));
            var todayString = today.toString();
            GM_setValue(CookieName, todayString);
            log(`an artifact is being repaired: until ${todayString}`);
            return;
        }

        var pTextAmbar = await getPage(clanAmbarLink);
        if (pTextAmbar == null) {
            log(`could not get "${clanAmbarLink}"`);
            return;
        }
        // console.log(pTextAmbar);
        if (!pTextAmbar.includes("Ремонтировать") && !pTextAmbar.includes("другой район")) {
            log(`no artifacts in clan ambar, trying to check inventory queue...`);

            var inventoryText = await getPage(inventoryLink);
            if (inventoryText == null) {
                log(`could not get "${inventoryLink}"`);
                return;
            }
            if (!inventoryText.includes("Отремонтировать артефакт за")) {
                log(`no artifacts in inventory queue`);
                return;
            }

            log(`there are some artifacts in inventory queue! trying to show an icon...`);

            redirectLink = inventoryLink;
        }

        log(`there are some artifacts in clan ambar! trying to show an icon...`);

        // NEW DESKTOP INTERFACE
        var home = document.getElementById("MenuHome");
        if (home != null) {
            log(`detected interface is "new desktop"`);
            var homeParent = home.parentElement.parentElement;
            var position = 'position_tr';
            var hasSms = homeParent.innerHTML.includes('Для Вас есть новое сообщение!');
            if (hasSms) {
                position = 'position_br';
            }
            homeParent.innerHTML += `<a href="${redirectLink}"><div class="${position}" id="hwm_topline_with_hint1" hwm_label="Для Вас есть новая работенка!" style="height:24px;width:24px;position: absolute;"><img class="NotificationIcon" src="https://dcdn.heroeswm.ru/i/shop_images/attr_durability.png"></div></a>`;
        }
        else {
            // MOBILE INTERFACE
            home = document.getElementById("link_home");
            if (home != null) {
                log(`detected interface is "mobile"`);
                var panelNot = "PanelNot1";
                if (home.parentElement.innerHTML.includes("window.location.href='sms.php'")) {
                    panelNot = "PanelNot2";
                }
                home.innerHTML += `<div class="PanelBottomNotification ${panelNot} PanelBottomNotification_add" style="font-size: 15px; line-height: 20px;"><img src="https://dcdn.heroeswm.ru/i/shop_images/attr_durability.png" class="PanelNotPic" alt="" title="" border="0" onclick="window.location.href='${redirectLink}'; return false;"></div>`;
            } else {
                // OLD DESKTOP INTERFACE
                home = document.evaluate(
                    '/html/body/table/tbody/tr/td/table/tbody/tr[3]/td/table/tbody/tr/td[4]/table/tbody/tr/td[1]/table/tbody/tr[2]/td/table/tbody/tr',
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null,
                ).singleNodeValue;

                if (home != null) {
                    log(`detected interface is "old desktop"`);
                    home.innerHTML += `<td><a href="${redirectLink}"><img align="absmiddle" src="https://dcdn.heroeswm.ru/i/shop_images/attr_durability.png" width="12" height="12" border="0" title="Для Вас есть новая работенка!!"></a>&nbsp;</td>`;
                }
                else {
                    log(`script could not determine platform! URL is: ${document.location}`);
                }
            }
        }
    }
    async function getPage(aURL) {
        var response = fetch(aURL)
            .then((resp) => resp.arrayBuffer());
        let html = new TextDecoder('windows-1251').decode(await response);
        return html;
    }
    function convertDateToUTC(date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
    function log(str) {
        console.log(`${ScriptName}: ${str}`);
    }
})();
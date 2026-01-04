// ==UserScript==
// @name         AuctionHuntMenu
// @namespace    https://greasyfork.org/ru/scripts/418634-auctionhuntmenu
// @version      0.2
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/auction\.php.?/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/418634/AuctionHuntMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/418634/AuctionHuntMenu.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }
    let data = {
        "Охотник": [
            ["Тесак охотника", "hunter_sword1", "weapon"],
            ["Щит охотника", "hunter_shield1", "shield"],
            ["Сапоги охотника", "hunter_boots1", "boots"],
            ["Рубаха охотника", "hunter_jacket1", "cuirass"],
            ["Лук охотника", "hunter_bow1", "weapon"],
            ["Перчатка охотника", "hunter_gloves1", "other"],
            ["Кулон охотника", "hunter_pendant1", "necklace"],
            ["Шляпа охотника", "hunter_hat1", "helm"]
        ],
        "МО": [
            ["Сабля мастера-охотника", "hunterdsword", "weapon"],
            ["Лёгкая сабля мастера-охотника", "huntersword2", "weapon"],
            ["Кинжал мастера-охотника", "hunterdagger", "weapon"],
            ["Щит мастера-охотника", "huntershield2", "shield"],
            ["Сапоги мастера-охотника", "hunter_boots2", "boots"],
            ["Лёгкие сапоги мастера-охотника", "hunter_boots3", "boots"],
            ["Броня мастера-охотника", "hunter_armor1", "cuirass"],
            ["Маскхалат мастера-охотника", "hunter_mask1", "cloack"],
            ["Лук мастера-охотника", "hunter_bow2", "weapon"],
            ["Стрелы мастера-охотника", "hunter_arrows1", "other"],
            ["Амулет мастера-охотника", "hunter_amulet1", "necklace"],
            ["Кольцо полёта мастера-охотника", "hunter_ring1", "ring"],
            ["Кольцо ловкости мастера-охотника", "hunter_ring2", "ring"],
            ["Шлем мастера-охотника", "hunter_helm", "helm"],
            ["Костяной шлем мастера-охотника", "hunter_roga1", "helm"],
        ],
        "ВО": [
            ["Меч великого охотника", "gm_sword", "weapon"],
            ["Кастет великого охотника", "gm_kastet", "weapon"],
            ["Щит великого охотника", "gm_defence", "shield"],
            ["Сапоги великого охотника", "gm_spdb", "boots"],
            ["Броня великого охотника", "gm_arm", "cuirass"],
            ["Маскхалат великого охотника", "gm_protect", "cloack"],
            ["Лук великого охотника", "gm_abow", "weapon"],
            ["Стрелы великого охотника", "gm_3arrows", "other"],
            ["Амулет великого охотника", "gm_amul", "necklace"],
            ["Кольцо ловкости в. охотника", "gm_sring", "ring"],
            ["Заколдованное кольцо в. охотника", "gm_rring", "ring"],
            ["Шлем великого охотника", "gm_hat", "helm"]
        ],
        "ЗБ": [
            ["Меч зверобоя", "sh_sword", "weapon"],
            ["Копьё зверобоя", "sh_spear", "weapon"],
            ["Щит зверобоя", "sh_shield", "shield"],
            ["Сапоги зверобоя", "sh_boots", "boots"],
            ["Броня зверобоя", "sh_armor", "cuirass"],
            ["Маскхалат зверобоя", "sh_cloak", "cloack"],
            ["Лук зверобоя", "sh_bow", "weapon"],
            ["Стрелы зверобоя", "sh_4arrows", "other"],
            ["Амулет зверобоя", "sh_amulet2", "necklace"],
            ["Кольцо ловкости зверобоя", "sh_ring1", "ring"],
            ["Кольцо силы зверобоя", "sh_ring2", "ring"],
            ["Шлем зверобоя", "sh_helmet", "helm"]
        ],
        "Лес": [
            ["Амулет леса", "neut_amulet", "necklace"],
            ["Лесной плащ", "les_cl", "cloack"],
            ["Кинжал леса", "forest_dagger", "weapon"],
            ["Клинок леса", "forest_blade", "weapon"],
            ["Лук леса", "forest_bow", "weapon"],
            ["Сапоги леса", "forest_boots", "boots"]
        ],
    }

    main();

    function main() {
        let target = document.querySelector("#mark_helm");
        target.insertAdjacentHTML("beforebegin", createStyle());
        Object
            .entries(data)
            .forEach(([key, value], index) =>
                target.insertAdjacentHTML("beforebegin", getHTMLTemplate(index, key, convertDataToHTML(value))))
        target.insertAdjacentHTML("beforebegin", `<br>`);

        openMenu();
    }

    function openMenu() {
        let current_item = new URLSearchParams(window.location.search).get("art_type");
        Object
            .entries(data)
            .forEach(([key, value], index) =>
                value.forEach(item => {
                    if (current_item === item[1]) {
                        document.querySelector(`#spoiler${index}`).click()
                    }
                })
            )
    }

    function getHTMLTemplate(index, groupName, groupData) {
        return `
        <div>
            <input type="checkbox" id="spoiler${index}"/>
            <label for="spoiler${index}">
                ${groupName}
            </label>
            <div class="spoiler">
                ${groupData}
            </div>
        </div>
        `
    }

    function convertDataToHTML(value) {
        return value.reduce((result, current) => result + getHTMLFromArtInfo(current), "")
    }

    function getHTMLFromArtInfo(value) {
        return `
        &nbsp;&nbsp;&nbsp;<a href="/auction.php?cat=${value[2]}&art_type=${value[1]}"><span style="font-size:11px;">${value[0]}</span></a><br>
        `
    }

    function createStyle() {
        return `
        <style>
                input[id^="spoiler"] {
                    display: none;
                }
        
                input[id^="spoiler"] + label {
                    text-decoration: underline;
                    display: block;
                    text-align: left;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all .6s;
                }
        
                input[id^="spoiler"] ~ .spoiler {
                    width: 90%;
                    height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: all .6s;
                }
        
                input[id^="spoiler"]:checked + label + .spoiler {
                    height: auto;
                    opacity: 1;
                }
        </style> 
        `
    }

})(window);
// ==UserScript==
// @name         depoSets 29072024
// @namespace    http://tampermonkey.net/
// @version      0.4.13
// @description  Арендовать кастомный набор со склада в 1 клик. Кнопка снять все арты, вернуть все арты на складе. Инструкция на скрине снизу.
// @author       Something begins
// @license     none
// @match       https://www.heroeswm.ru/sklad_info*
// @match       https://my.lordswm.com/sklad_info*
// @match       https://www.lordswm.com/sklad_info*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502098/depoSets%2029072024.user.js
// @updateURL https://update.greasyfork.org/scripts/502098/depoSets%2029072024.meta.js
// ==/UserScript==
function getElementDepth(element) {
    if (!element.children || element.children.length === 0) {
        return 1;
    }
    let maxDepth = 0;
    for (let child of element.children) {
        let childDepth = getElementDepth(child);
        if (childDepth > maxDepth) {
            maxDepth = childDepth;
        }
    }
    return maxDepth + 1;
}
function getLeastLayered(elArr){
    const eleMap = new Map();
    for (const ele of elArr){
        eleMap.set(ele, getElementDepth(ele));
    }
    let minKey = null;
    let minValue = Infinity;
    for (let [key, value] of eleMap.entries()) {
        if (value < minValue) {
            minValue = value;
            minKey = key;
        }
    }
    return minKey
}
function findFromString(arg, eleType){
    const allEles = document.querySelectorAll(eleType);
    let includeArr;
    if (typeof arg === "object"){
        includeArr = Array.from(allEles).filter(ele => {
            let othersInclude = true;
            for (const str of arg){
                if (!ele.textContent.includes(str)) {
                    othersInclude = false;
                    break;
                }
            }
            return othersInclude;
        });
    }else{
        includeArr = Array.from(allEles).filter(ele => {return ele.textContent.includes(arg)});
    }

    return getLeastLayered(includeArr);
}
function main(){
    const allTds = document.querySelectorAll("td");
    const setAmount = 6;
    const redirectTo = "/inventory.php";
    const defaultSets = '{"1":"Мифриловый перстень времён [N12E12A12W12F12], Великое кольцо аномалий [N12E12A12W12F12], Кулон сингулярности [N12E12A12W12F12] || Мифриловый амулет времён [N12E12A12W12F12]","2":"Мифриловый перстень времён [E11A11W11F11] || Мифриловый перстень времён [N10E10A10W10F10] || Мифриловый перстень времён [N12E12A12W12F12], Великий доспех ловчего [D12E12A12W12F12]","3":"Мифриловый перстень времён [E11A11W11F11] || Мифриловый перстень времён [N10E10A10W10F10] || Мифриловый перстень времён [N12E12A12W12F12], Глефа повелителя тьмы [I12E12A12W12F12]","4":"Кулон сингулярности [N12E12A12W12F12] || Мифриловый амулет времён [N12E12A12W12F12], Мифриловый перстень времён [N1E12A12W12F12] || Мифриловый перстень времён [N12E12A12W12F12]","5":"Кольцо пирата-капитана [N12E12A12W12F12], Кулон сингулярности [N12E12A12W12F12], Мифриловый перстень времён [N12E12A12W12F12]","6":"Кольцо пирата-капитана [N12E12A12W12F12], Великое кольцо аномалий [N12E12A12W12F12], Кулон сингулярности [N12E12A12W12F12], Великий посох времён [I12E12A12W12F12]"}';
    const defaultNames = '{"1":"Маг","2":"Раш броня","3":"Раш глефа","4":"ГО","5":"КД","6":"ТЭ"}';
    const stylesHTML = `
<style>
    .set_container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }

    .set_list {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 10px;
    }
    .set_name {
        width: 20%;
        box-sizing: border-box;
        margin-bottom: 10px;
        margin-right: 10px;
        align-self: center;
    }

    button, span, select.available_battles_count {
        width: auto;
        align-self: center;
        padding: 5px;
        margin-left: 5px;
    }
    .undress_button{
cursor: pointer;
align-self: center;
    }
</style>
`;

    const setParentHTML = `
<div id = "set_parent" style="display: flex;flex-direction: column;"></div>
`;
    const saveButtonHTML = `
<button id = "save_button"> Сохранить </button>
`;

    const origin = location.origin + location.pathname + "?id=" + location.href.match(/id=(\d+)/)[1];
    console.log(origin);

    async function fetchMultipleUrls(urls) {
        const fetchPromises = urls.map(url => {
            return fetch(url, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'text/html; charset=windows-1251',
                }),
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.arrayBuffer();
            })
                .then(buffer => {
                const decoder = new TextDecoder('windows-1251');
                return { url: url, text: decoder.decode(new Uint8Array(buffer)) };
            });
        });

        try {
            const results = await Promise.all(fetchPromises);
            return results;
        } catch (error) {
            console.error('Error fetching URLs:', error);
            throw error;
        }
    }

    function returnAll() {
        const allAs = document.querySelectorAll("a");
        const returnAs = Array.from(allAs).filter(a => { return a.href.includes("art_return") });
        const allLinks = returnAs.map(a => a.href);
        console.log(allLinks);
        consequetiveFetches(allLinks, () => { location.reload() });
    }

    function undress() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/inventory.php?all_off=100', true);
        xhr.overrideMimeType('text/plain; charset=windows-1251');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200)
                // send_storage_async_get(document.location);
                location.reload();
        };
        xhr.send(null);
    }

    function draw_undress_button(content) {
        content.insertAdjacentHTML("afterEnd", "<b>");
        var a = document.createElement('a');
        a.href = '';
        a.textContent = ' (вернуть все) ';

        content.appendChild(a);
        const undressButtonHTML = `<td><img class = 'undress_button' src = 'https://dcdn.heroeswm.ru/i/inv_im/btn_art_rem.png'></img></td>`;

        content.appendChild(a);
        let undressParent = findFromString("Ваша аренда", "td");
        undressParent && undressParent.insertAdjacentHTML("beforeEnd", undressButtonHTML);
        const undressButton = document.querySelector(".undress_button");
        a.addEventListener('click', function(e) {
            e.preventDefault();
            returnAll();
        });
        undressButton.addEventListener('click', function(e) {
            e.preventDefault();
            undress();
        });
        document.addEventListener("keydown", event => {
            if (event.altKey) {
                if (["q", "Q", "й", "Й"].includes(event.key)) {
                    returnAll();
                }
                if (["w", "W", "Ц", "ц"].includes(event.key)) {
                    undress();
                }
            }
        });
    }

    function getAllCatsURLs() {
        const weaponA = findFromString("Оружие", "a");
        const armorA = findFromString("Броня", "a");
        const jewelA = findFromString("Ювелирка", "a");
        const backpackA = findFromString("Рюкзак", "a");
        if ([weaponA, armorA, jewelA, backpackA].includes(null)) return false;
        return [weaponA.href, armorA.href, jewelA.href, backpackA.href];
    }


    function countOccurrences(arr, target) {
        return arr.reduce((count, element) => (element === target ? count + 1 : count), 0);
    }

    function consequetiveFetches(urlArr, callback = () => {}, i = 0) {
        if (i >= urlArr.length) {
            callback();
            return;
        } else {
            fetch(urlArr[i]).then((response) => {
                if (!response.ok) {
                    console.error(`HTTP error! Status: ${response.status}, Text: ${response.statusText}`);
                    consequetiveFetches(urlArr, callback, i);
                } else {
                    consequetiveFetches(urlArr, callback, i + 1);
                }
            })
        }
    }

    function getReqDepoArts(requiredArts, battlesAmount, fetchedData) {
        let allArts = [];
        const neededArts = [];
        const missingArts = [];
        for (const data of fetchedData) {
            const arts = getArtList(data.text);
            console.log("arts", arts);
            allArts = allArts.concat(arts);
        }
        for (let i = 0; i < allArts.length; i++) {
            allArts[i].index = i;
        }
        console.log("allArts", allArts);
        for (const reqArtName of requiredArts) {
            console.log("reqArtName", reqArtName);
            const alternatives = reqArtName.split("||");
            let matchedArts;
            if (alternatives.length > 1) {
                for (const alternative of alternatives) {
                    matchedArts = allArts.filter(art => { return alternative.trim().toLowerCase() === art.name.toLowerCase() && !art.taken && art.availableBattlesCount >= battlesAmount });
                    if (matchedArts.length === 0) {
                        matchedArts = allArts.filter(art => { return alternative.trim().toLowerCase() === art.name.toLowerCase() && !art.taken });
                    }
                    if (matchedArts.length > 0) break;
                }
            } else {
                matchedArts = allArts.filter(art => { return reqArtName.trim().toLowerCase() === art.name.toLowerCase() && !art.taken && art.availableBattlesCount >= battlesAmount });
                if (matchedArts.length === 0) matchedArts = allArts.filter(art => { return reqArtName.trim().toLowerCase() === art.name.toLowerCase() && !art.taken });
            }
            console.log("matchedArts", matchedArts);
            if (matchedArts.length === 0) {
                missingArts.push(reqArtName);
                continue;
            };
            const chosenArt = matchedArts[0];
            neededArts.push(chosenArt);
            allArts[chosenArt.index].taken = true;
        }
        console.log("neededArts", neededArts);
        return { neededArts: neededArts, missingArts: missingArts };
    }
    async function fetchDataAndProcess(requiredArts, battlesAmount) {
        const neededLinks = [];
        let warningMessage = "";
        const fetchedData = await fetchMultipleUrls(getAllCatsURLs());
        const artData = getReqDepoArts(requiredArts, battlesAmount, fetchedData);
        for (const chosenArt of artData.neededArts) {
            neededLinks.push(getRentLink(origin, chosenArt.artId, chosenArt.sign, chosenArt.category, battlesAmount));
            if (battlesAmount > chosenArt.availableBattlesCount) {
                warningMessage += "Взято " + chosenArt.name + " на " + chosenArt.availableBattlesCount + " боев;\n";
            }
        }
        for (const missingArtName of artData.missingArts) {
            warningMessage += missingArtName + " недоступен;\n";
        }
        consequetiveFetches(neededLinks, () => { location.href = location.origin + redirectTo });
        warningMessage !== "" && alert(warningMessage);
    }

    const parser = new DOMParser();


    function getArtList(HTMLText) {

        const arts = [];
        const doc = parser.parseFromString(HTMLText, 'text/html');
        let tbody = doc.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody");
        if (!tbody) tbody = doc.querySelector("#android_container > table:nth-child(4) > tbody");
        if (!tbody) tbody = doc.querySelector("#android_container > table:nth-child(3) > tbody > tr > td > table > tbody")
        for (const tr of tbody.children) {
            const nameEle = tr.querySelector("font");
            if (!nameEle) continue;
            let name = nameEle.textContent.match(/\'(.*?)\'/);
            // const _dura = nameEle.textContent.match(/(\d+)\//)[1];
            if (!name) {
                console.log(tr);
                console.error("Название арта не найдено");
                continue;
            }
            name = name[1];
            // name = name.split("[")[0].trim();
            name = name.trim();

            const button = tr.querySelector("input[value='Взять в аренду']");
            if (!button) continue;
            const artId = button.id.match(/\d+/)[0];
            const sign = tr.querySelector("input[name='sign']").value;
            const category = tr.querySelector("input[name='cat']").value;
            const availableBattlesCount = tr.querySelector("select").children.length;
            arts.push({ name: name, artId: artId, sign: sign, category: category, availableBattlesCount: availableBattlesCount, taken: false });
        }
        return arts;
    }

    function getRentLink(origin, artId, sign, category, battlesAmount) {
        const link = origin + "&sign=" + sign + "&cat" + category + "&action=rent&inv_id=" + artId + "&set_id=0&bcnt" + artId + "=" + battlesAmount;
        return link;
    }
    document.addEventListener("input", event => {
        if (!["set_list", "set_name"].includes(event.target.className)) return;
        event.target.style.height = "auto";
        event.target.style.height = `${event.target.scrollHeight+2}px`;
    });1
    let attachTo = findFromString("Всего артефактов: ", "td");
    console.log("attachTo", attachTo);
    attachTo.insertAdjacentHTML("afterbegin", stylesHTML + setParentHTML);
    const parent = document.querySelector("#set_parent");

    //if (!sets) sets = JSON.parse(defaultSets);
    //else sets = JSON.parse(sets);
    //if (!names) names = JSON.parse(defaultNames);
    //else names = JSON.parse(names);
    const sets = JSON.parse(defaultSets);
    const names = JSON.parse(defaultNames);

    console.log("sets", sets);
    for (let i = 0; i < setAmount; i++) {
        const test = sets[i + 1];
        const set = test ? test.toString() : "";
        const test2 = names[i + 1];
        const name = test2 ? test2.toString() : "";

        const setHTML = `
<div class="set_container">
    <span>${i+1}. </span>
    <textarea class = "set_name" placeholder = "Навание комплекта" rows="2" cols="3">${name}</textarea>
    <textarea class="set_list" placeholder="Список артефактов через запятую, альтернативы через ||. Пример: Меч холода, Амулет холода || Клевер фортуны, Кольцо холода" cols="5" rows="3">${set}</textarea>
    <span> на </span>
    <select id = "set_select${i}" class="available_battles_count"></select>
    <span> боев </span>
    <button class="set_button"> Аренда </button>
</div>
`;
        parent.insertAdjacentHTML("beforeend", setHTML);
        console.log("check", document.querySelector(`#set_select${i}`));
        const select = document.querySelector(`#set_select${i}`);
        for (let i = 1; i <= 20; i++) {
            select.insertAdjacentHTML("beforeend", `<option value=${i}>${i}</option>`);
        }
    }
    [".set_list", ".set_name"].forEach(selector => {
        for (const textarea of document.querySelectorAll(selector)) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight+2}px`;
        }
    })
    parent.insertAdjacentHTML("beforeend", saveButtonHTML);
    let undressTd = findFromString("Ваша аренда", "td");
    undressTd && draw_undress_button(undressTd);
    document.addEventListener("click", event => {
        const ele = event.target;
        if (ele.className === "set_button") {
            const areaText = ele.parentElement.querySelector(".set_list").value;
            const battlesAmount = ele.parentElement.querySelector(".available_battles_count").selectedIndex + 1;
            let requiredArts = areaText.split(",");
            for (let i = 0; i < requiredArts.length; i++) {
                requiredArts[i] = requiredArts[i].trim();
            }
            requiredArts = requiredArts.filter(artName => { return artName !== "" && artName !== " " });
            ele.textContent = " Загрузка... ";
            fetchDataAndProcess(requiredArts, battlesAmount);
        }
        if (ele.id === "save_button") {
            const dict = {};
            const names = {};
            for (const setTextArea of document.querySelectorAll(".set_list")) {
                const areaNo = setTextArea.parentElement.querySelector("span").textContent.match(/\d+/)[0];
                dict[areaNo] = setTextArea.value;
            }
            for (const nameTextArea of document.querySelectorAll(".set_name")) {
                const areaNo = nameTextArea.parentElement.querySelector("span").textContent.match(/\d+/)[0];
                names[areaNo] = nameTextArea.value;
            }
            // set_name
            console.log(dict);
            localStorage.setItem("depoScript1_sets", JSON.stringify(dict));
            localStorage.setItem("depoScript1_set_names", JSON.stringify(names));

        }
    });
}
try{
    main();
}
catch (e) {
    document.body.insertAdjacentHTML("afterBegin",
                                     `<div style="z-index:101; position: fixed; max-width: 90%; overflow-wrap: break-word; background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px;">
            <span style="color: white; font-size: 12px;">${e}</span>
        </div>`);
}
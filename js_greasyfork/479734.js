// ==UserScript==
// @name        hwmNewspaper
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|178\.248\.235\.15)\/home\.php/
// @description На странице персонажа ссылки на новости дейли, темы форума, или клановую рассылку. Текущие цены на элементы.
// @version     6.1
// @author      Tamozhnya1
// @namespace   Tamozhnya1
// @grant       GM.xmlHttpRequest
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479734/hwmNewspaper.user.js
// @updateURL https://update.greasyfork.org/scripts/479734/hwmNewspaper.meta.js
// ==/UserScript==

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
const PlayerId = playerIdMatch ? playerIdMatch[1] : "";
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const win = window.wrappedJSObject || unsafeWindow;
const isHeartOnPage = (document.querySelector("canvas#heart") || document.querySelector("div#heart_js_mobile")) ? true : false;
const isMooving = location.pathname == '/map.php' && !document.getElementById("map_right_block");
const isNewInterface = document.querySelector("div#hwm_header") ? true : false;
const isMobileInterface = document.querySelector("div#btnMenuGlobal") ? true : false;
const isMobileDevice = mobileCheck(); // Там нет мышки
const isNewPersonPage = document.querySelector("div#hwm_no_zoom") ? true : false;

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });
if(!PlayerId) {
    return;
}


const LotType = { Purchase: 1, Auction: 2 };
var ElementsTypes = { "42": "abrasive", "43": "snake_poison", "46": "tiger_tusk", "44": "ice_crystal", "45": "moon_stone", "40": "fire_crystal", "37": "meteorit", "41": "witch_flower", "39": "wind_flower", "78": "fern_flower", "38": "badgrib" }
var ElementNames = ["abrasive", "snake_poison", "tiger_tusk", "ice_crystal", "moon_stone", "fire_crystal", "meteorit", "witch_flower", "wind_flower", "fern_flower", "badgrib"];
var ResourcesTypes = { "wood": { Type: "1", ImageName: "wood" }, "ore": { Type: "2", ImageName: "ore" }, "mercury": { Type: "3", ImageName: "mercury" }, "sulphur": { Type: "4", ImageName: "sulfur" }, "crystal": { Type: "5", ImageName: "crystals" }, "gem": { Type: "6", ImageName: "gems" } };
var forumNames = { "2": "ОиФ", "10": "ВиП", "24": "Турниры", "3": "ИиП", "12": "БиП", "11": "ФВТ", "27": "Встречи", "14": "Обычные артефакты", "21": "Аренда", "22": "УКиО", "23": "ПЭСиП", "25": "ПЗ(Бои)", "13": "ПЗ(Финансы)", "7": "ТП", "8": "ОиС" };
const locations = {
    1: [50,50,"Empire Capital","EmC","Столица Империи"],
    2: [51,50,"East River","EsR","Восточная Река"],
    3: [50,49,"Tiger Lake","TgL","Тигриное Озеро"],
    4: [51,49,"Rogues' Wood","RgW","Лес Разбойников"],
    5: [50,51,"Wolf Dale","WoD","Долина Волков"],
    6: [50,48,"Peaceful Camp","PcC","Мирный Лагерь"],
    7: [49,51,"Lizard Lowland","LzL","Равнина Ящеров"],
    8: [49,50,"Green Wood","GrW","Зеленый Лес"],
    9: [49,48,"Eagle Nest","EgN","Орлиное Гнездо"],
    10: [50,52,"Portal Ruins","PoR","Руины Портала"],
    11: [51,51,"Dragons' Caves","DrC","Пещеры Драконов"],
    12: [49,49,"Shining Spring","ShS","Сияющий Родник"],
    13: [48,49,"Sunny City","SnC","Солнечный Город"],
    14: [52,50,"Magma Mines","MgM","Магма Шахты"],
    15: [52,49,"Bear Mountain","BrM","Медвежья Гора"],
    16: [52,48,"Fairy Trees","FrT","Магический Лес"],
    17: [53,50,"Harbour City","HrC","Портовый Город"],
    18: [53,49,"Mythril Coast","MfC","Мифриловый Берег"],
    19: [51,52,"Great Wall","GtW","Великая Стена"],
    20: [51,53,"Titans' Valley","TiV","Равнина Титанов"],
    21: [52,53,"Fishing Village","FsV","Рыбачье село"],
    22: [52,54,"Kingdom Castle","KiC","Замок Королевства"],
    23: [48,48,"Ungovernable Steppe","UnS","Непокорная Степь"],
    24: [51,48,"Crystal Garden","CrG","Кристальный Сад"],
    25: [53,52,"East Island","EsI","Восточный Остров"],
    26: [49,52,"The Wilderness","ThW","Дикие земли"],
    27: [48,50,"Sublime Arbor","SbA","Великое Древо"]
};
const Strings = { "ru": { BuyNow: "Купить сразу!" }, "en": { BuyNow: "Buy now!" } };
const LocalizedString = Strings[document.documentElement.lang];
const horizontalPadding = 25;
addStyle(`
.newspaper-panel {
  margin: 0 auto 0px;
  padding: 15px ${horizontalPadding}px 20px;
  overflow: hidden;
  min-width: 400px;
  border-radius: 5px;
  border: 0 #adadad solid;
  /*background: url(../i/inv_im/corner_lt2.png) no-repeat top left, url(../i/inv_im/corner_rt2.png) no-repeat top right, url(../i/inv_im/corner_lb2.png) no-repeat bottom left, url(../i/inv_im/corner_rb2.png) no-repeat bottom right #f5f3ea;
  background-size: 14px;*/
  box-shadow: inset 0 0 0 1px #b19673, 0 2px 5px rgb(0 0 0 / 25%);
  
  /* Base paper color with a subtle gradient */
  background: linear-gradient(to bottom, #f5f5dc, #e0d0b0); 

  /* Add a subtle "grain" or "texture" using repeating linear gradients */
  background-image: 
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.05) 0px,
      rgba(0, 0, 0, 0.05) 1px,
      transparent 1px,
      transparent 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.03) 0px,
      rgba(0, 0, 0, 0.03) 1px,
      transparent 1px,
      transparent 3px
    );
  background-blend-mode: multiply; /* Blends the textures with the base color */
}
.newspaper-panel-collapsed {
    display: none !important;
}
.hover-link:hover{ color: red }
.newspaper-title-row {
    display: flex;
    padding: 5px;
  font-family: 'Playfair Display', serif; /* A classic, elegant serif font */
  font-size: 6em; /* Large size for prominence */
  font-weight: 900; /* Extra bold for impact */
  text-transform: uppercase; /* All caps for a traditional newspaper look */
  color: #333; /* Dark grey for readability */
  text-align: center; /* Centered on the page */
  letter-spacing: 2px; /* Slightly increased letter spacing */
  line-height: 1.1; /* Adjust line height for better visual balance */
}
.newspaper-title-item {
    text-decoration: none;
    align-self: center;
    border-radius: 1.5rem;
    padding: 0.25rem .75rem;
    display: inline;
    font-size: 12px;
    font-weight: normal;
    cursor: pointer;
    background-color: #eae8dd00;
}
.newspaper-title-item-active {
    background-color: #eae8dd;
}
.newspaper-title-item-active:hover {
  background: #eae8dd80;
}
.newspaper-spoiler-expanded {
    transform: rotate(90deg);
}
.newspaper-resources {
  display: flex;
  justify-content: space-around;
  background-color: #eae8dd;
  border-radius: 5px;
  border: 0 #adadad solid;
  margin-top: 10px;
}

.clan-style {
  display: inline-flex;
  background-color: #adadad40;
  padding: 3px 7px;
  margin-left: 7px;
  border: 0;
  border-radius: 4px;
  color: #592C08;
}

.newspaper-resources-item {
  align-self: center;
  display: flex;
}

.text-title {
  text-align:left;
  padding-top: 6px;
}

@media screen and (min-width: 320px) and (max-width: 600px) {
  .newspaper-panel {
    width: auto;
  }

  .newspaper-title-item {
    font-size: 10px;
  }

  .newspaper-resources {
    flex-wrap: wrap;
    height: auto;
    padding: 5px;
  }
  .newspaper-resources-item {
    margin: 0 10px 10px 0;
    font-size: 12px;
  }
  .text-title {
    font-size: 12px;
  }
  .news-head__settings {
    width: 10%;
  }
}`);

main();
async function main() {
    //let widgetContainer = isNewPersonPage ? document.querySelector("body > center") : document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(6) > td:nth-child(1)");
    let widgetContainer;
    if(isNewPersonPage) {
        widgetContainer = isMobileInterface ? document.querySelector("div#set_mobile_max_width") : document.querySelector("div#hwm_no_zoom");
        if(isMobileInterface) {
            widgetContainer.style.flexWrap = "wrap";
            addElement("div", { style: "flex-basis: 100%; height: 0;"}, widgetContainer);
        }
    } else {
        const table = isMobileInterface ? document.querySelector("div#android_container > table") : document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table");
        if(getBool("WidgetPosition")) {
            const firstRow = table.rows[0];
            firstRow.insertAdjacentHTML("beforebegin", `<tr><td colspan=2 id=widgetContainer></td></tr>`);
        } else {
            const lastRow = table.rows[table.rows.length - 1];
            lastRow.insertAdjacentHTML("afterend", `<tr><td colspan=2 id=widgetContainer></td></tr>`);
        }
        widgetContainer = document.getElementById("widgetContainer");
    }
    let widthSnippet = "";
    if(isNewPersonPage) {
        const anchorRect = document.querySelector("div#set_mobile_max_width").getBoundingClientRect();
        widthSnippet = ` style="width: ${anchorRect.width - horizontalPadding * 2 - 4}px;"`;
    }
    if(widgetContainer) {
        const divOuterInnerHTML = `
<div class="newspaper-panel"${widthSnippet}>
    <div id="newspaperHeader" class="newspaper-title-row">
        <div id="newspaperDailyPreviewTab" class="newspaper-title-item">📰 Daily</div>
        <div id="newspaperForumPreviewTab" class="newspaper-title-item">👥 ${isEn ? "Forum" : "Форум"}</div>
        <div id="newspaperClanLettersPreviewTab" class="newspaper-title-item">🧑‍🤝‍🧑 ${isEn ? "Clan messages" : "Клановая рассылка"}</div>
        <div id="newspaperSpoiler" class="newspaper-title-item"><img src="https://dcdn3.heroeswm.ru/i/inv_im/btn_expand.svg"></div>
        <div id="newspaperSettingsActivator" class="newspaper-title-item" style="font-size: 20px; font-weight: bold;" title="${isEn ? "Settings" : "Настройки"}">&#9881;</div>
    </div>
    <div id="newspaperContentPanel"></div>
    <div id="newspaperResourcesPanel" class="newspaper-resources"></div>
</div>
`;
        widgetContainer.insertAdjacentHTML(getBool("WidgetPosition") ? "afterbegin" : "beforeend", divOuterInnerHTML),
        document.getElementById('newspaperSpoiler').addEventListener("click", function(event) { setValue("Shown", 1 - Number(getValue("Shown", 1))); databind(); });
        document.getElementById('newspaperSettingsActivator').addEventListener("click", showSettings);
        document.getElementById('newspaperDailyPreviewTab').addEventListener("click", function(event) { setValue("SecondClick", parseInt(getValue("SelectedTab", 0)) == 0); setValue("SelectedTab", 0); databind(); });
        document.getElementById('newspaperForumPreviewTab').addEventListener("click", function(event) { setValue("SecondClick", parseInt(getValue("SelectedTab", 0)) == 1); setValue("SelectedTab", 1); databind(); });
        document.getElementById('newspaperClanLettersPreviewTab').addEventListener("click", function(event) { setValue("SecondClick", parseInt(getValue("SelectedTab", 0)) == 2); setValue("SelectedTab", 2); databind(); });
        setValue("SecondClick", false);
        databind();
    }
}
async function fillClansList(hwmWidgetSettingsPanel) {
    const doc = await getRequest(`/pl_clans.php`);
    const clanInfos = Array.from(doc.querySelectorAll("td > li > a[href^='clan_info.php']")).map(x => { return { Id: getUrlParamValue(x.href, "id"), Name: x.firstChild.innerText }; });
    if(clanInfos.length > 0) {
        if(!getValue("ClanId") || !clanInfos.find(x => x.Id == getValue("ClanId"))) {
            setValue("ClanId", clanInfos[0].Id);
        }
        const clansBlock = hwmWidgetSettingsPanel.querySelector("div#widgetClansBlock");
        for(const clanInfo of clanInfos) {
            addElement("div", { innerHTML: `<input type="radio" id="${clanInfo.Id}" name="clan" ${clanInfo.Id == getValue("ClanId") ? "checked" : ""}><label for="${clanInfo.Id}">#${clanInfo.Id} ${clanInfo.Name}</label>`}, clansBlock);
        }
        [...clansBlock.querySelectorAll("input[name=clan]")].forEach(x => x.addEventListener("click", function() {
            const selectedClan = clansBlock.querySelector("input[name=clan]:checked");
            if(selectedClan) {
                setValue("ClanId", selectedClan.id);
            } else {
                deleteValue("ClanId");
            }
        }));
    } else {
        deleteValue("ClanId");
        hwmWidgetSettingsPanel.querySelector("div#widgetClansBlock").innerHTML = isEn ? "You are not a member of any clans" : "Вы не состоите в кланах";
    }
}
async function databind() {
    //console.log(`Shown: ${getValue("Shown")}, SelectedTab: ${getValue("SelectedTab")}, SecondClick: ${getValue("SecondClick")}`);
    if(getBool("SecondClick")) {
        switch(parseInt(getValue("SelectedTab", 0))) {
            case 0: window.open("https://daily.heroeswm.ru/", "_blank"); break;
            case 1: window.open(`/forum_thread.php?id=${getValue("ForumId", "2")}`, "_blank"); break;
            case 2: window.open(`/sms_clans.php?clan_id=${getValue("ClanId")}`, "_blank"); break;
        }
        return;
    }
    const shown = getValue("Shown", 1);
    const newspaperSpoiler = document.getElementById('newspaperSpoiler');
    const newspaperContentPanel = document.getElementById("newspaperContentPanel");
    const resourcesPanel = document.getElementById("newspaperResourcesPanel");
    const newspaperDailyPreviewTab = document.getElementById('newspaperDailyPreviewTab');
    const newspaperForumPreviewTab = document.getElementById('newspaperForumPreviewTab');
    const newspaperClanLettersPreviewTab = document.getElementById('newspaperClanLettersPreviewTab');
    
    newspaperSpoiler.classList.toggle("newspaper-spoiler-expanded", shown != 0);
    newspaperContentPanel.classList.toggle("newspaper-panel-collapsed", shown == 0);
    resourcesPanel.classList.toggle("newspaper-panel-collapsed", shown == 0);
    
    newspaperDailyPreviewTab.classList.toggle("newspaper-title-item-active", shown != 0 && parseInt(getValue("SelectedTab", 0)) == 0);
    newspaperForumPreviewTab.classList.toggle("newspaper-title-item-active", shown != 0 && parseInt(getValue("SelectedTab", 0)) == 1);
    newspaperClanLettersPreviewTab.classList.toggle("newspaper-title-item-active", shown != 0 && parseInt(getValue("SelectedTab", 0)) == 2);
    if(shown != 0) {
        switch(parseInt(getValue("SelectedTab", 0))) {
            case 0: getDailyNews(); break;
            case 1: getForumNews(); break;
            case 2: getClanNews(); break;
        }
        getResources();
    }
}
function showSettings() {
    if(showPupupPanel(GM_info.script.name, databind)) {
        return;
    }
    const fieldsMap = [];
    const hwmWidgetSettingsPanel = addElement("div", { id: "hwmWidgetSettingsPanel", innerHTML: `
<p>${isEn ? "Forum choosing" : "Выбор форума"}</p>
${Object.keys(forumNames).reduce((t, k) => t += `<div><input type="radio" id="${k}" name="forum" ${getValue("ForumId", "2") == k ? "checked" : ""}><label for="${k}">${forumNames[k]}</label></div>`, "")}
<p>${isEn ? "Clan choosing" : "Выбор клана"}</p>
<div id=widgetClansBlock></div>
<label for="ShowItemsAmountInput">${isEn ? "Messages number" : "Количество отображаемых сообщений"}</label><input type="number" id="ShowItemsAmountInput" value="${getValue("ShowItemsAmount", 5)}" onfocus="this.select(); "/>
<label for="widgetPositionCheckbox">${isEn ? "Widget position" : "Положение виджета (вверху (если отмечено) / внизу)"}</label><input type="checkbox" id="widgetPositionCheckbox" />
`});
    fillClansList(hwmWidgetSettingsPanel);
    hwmWidgetSettingsPanel.querySelector("#widgetPositionCheckbox").checked = getBool("WidgetPosition");
    [...hwmWidgetSettingsPanel.querySelectorAll("input[name=forum]")].forEach(x => x.addEventListener("click", function() { setValue("ForumId", hwmWidgetSettingsPanel.querySelector(`input[name='forum']:checked`).id); }));
    hwmWidgetSettingsPanel.querySelector("#widgetPositionCheckbox").addEventListener("change", function() { setValue("WidgetPosition", this.checked); });
    hwmWidgetSettingsPanel.querySelector("#ShowItemsAmountInput").addEventListener("change", function() { setValue("ShowItemsAmount", this.value); });
    fieldsMap.push([hwmWidgetSettingsPanel]);
    createPupupPanel(GM_info.script.name, getScriptReferenceHtml() + " " + getSendErrorMailReferenceHtml(), fieldsMap, databind);
}
function trimming(string, l) {
    //console.log(`string: ${string}, l: ${l}`);
    var s = string;
    if(string.length > l) {
        for(var i = l; i >= 0; i--) {
            if(string.charAt(i) == ' ') {
                s = string.substr(0, i) + '...';
            }
        }
        s = string.substr(0, l) + '...';
    }
    return s.replace(/&[^#]/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
}
async function getElementLots() {
    const arts = [];
    for(const elementName of ElementNames) {
        const doc = await getRequest(`/auction.php?cat=elements&sort=0&art_type=${elementName}`);
        const firstLotRow = doc.querySelector("center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(3)");
        let row = firstLotRow;
        while(row = row.nextElementSibling) {
            const art = parseLotRow(row);
            if(art) {
                arts.push(art);
            }
        }
    }
    setValue("LastElementsRequestTime", Date.now());
    const grouppedArts = groupBy(arts.filter(x => x.LotType == LotType.Purchase), "ArtId");
    return grouppedArts;
}
function parseLotRow(row) {
    if(!row || row.nodeName != "TR") {
        return;
    }
    const goldImageElement = row.querySelector("img[src*='gold.png']");
    if(!goldImageElement) {
        return;
    }
    const lotPrice = parseFloat(goldImageElement.parentNode.nextElementSibling.innerText.replace(/,/g, ""));
    let artId;
    let lotAmount = 1;
    const lotAmountExec = new RegExp(`(\\d+) ${isEn ? "pcs." : "шт."}`).exec(row.innerHTML);
    //console.log(lotAmountExec);
    if(lotAmountExec) {
        lotAmount = parseInt(lotAmountExec[1]);
    }
    const lotType = row.innerHTML.includes(LocalizedString.BuyNow) ? LotType.Purchase : LotType.Auction;
    const artImageRefElement = row.querySelector("a[href*='art_info.php']");
    if(!artImageRefElement) {
        const elementsList = Object.values(ElementsTypes).join("|");
        const elementParse = (new RegExp(`gn_res/(${elementsList}).png`)).exec(row.innerHTML);
        if(elementParse) {
            artId = elementParse[1];
        }
        if(row.innerHTML.includes("house_cert")) {
            const locationsList = Object.values(locations).map(x => x[2]).join("|");
            const sertParse = (new RegExp(`<br>(${locationsList})&nbsp;<b>`)).exec(row.innerHTML);
            if(sertParse) {
                artId = getSertIdByLocationName(sertParse[1]);
            }
        }
        const resourcesList = Object.values(ResourcesTypes).map(x => x.ImageName).join("|");
        const resourceParse = (new RegExp(`/(${resourcesList}).png`)).exec(row.innerHTML);
        if(resourceParse) {
            artId = "res_" + resourceParse[1];
        }
        if(row.innerHTML.includes("auc_dom")) {
            const locationsList = Object.values(locations).map(x => x[2]).join("|");
            const sertParse = (new RegExp(`<br>(${locationsList})&nbsp;<b>`)).exec(row.innerHTML);
            if(sertParse) {
                artId = getHouseIdByLocationName(sertParse[1]);
            }
        }
        if(row.innerHTML.includes("obj_share_pic")) {
            const locationsList = Object.values(locations).map(x => x[2]).join("|");
            const sertParse = (new RegExp(`<br>(${locationsList})&nbsp;<b>`)).exec(row.innerHTML);
            if(sertParse) {
                artId = getShaIdByLocationName(sertParse[1]);
            }
        }
    } else {
        artId = getUrlParamValue(artImageRefElement.href, "id");
        var artUid = getUrlParamValue(artImageRefElement.href, "uid");;
        const strengthData = row.innerText.match(/\d+\/\d+/);
        var restLotStrength = parseInt(strengthData[0].split("/")[0]);
        var lotStrength = parseInt(strengthData[0].split("/")[1]);
    }
    const lotRef = row.querySelector("a[href^='auction_lot_protocol.php']");
    const lotId = getUrlParamValue(lotRef.href, "id");

    const imgR = row.querySelector("td:nth-child(1) > table > tbody > tr > td:nth-child(1) > img");

    return { ArtUid: artUid, ArtId: artId, LotStrength: lotStrength, RestLotStrength: restLotStrength, LotPrice: lotPrice, LotType: lotType, LotAmount: lotAmount, LotId: lotId, ImageUrl: imgR.getAttribute('src'), Title: imgR.getAttribute('title') };
}
async function getResources(force = false) {
    const resourcesPanel = document.getElementById("newspaperResourcesPanel");
    let elementsData = [];
    if(parseInt(getValue("LastElementsRequestTime", 0)) + 5 * 60 * 1000 < Date.now() || force) {
        resourcesPanel.innerHTML = getWheelImage();
        const grouppedArts = await getElementLots();
        for(const elementName of ElementNames) {
            const arts = grouppedArts[elementName]
            if(arts.length == 0) {
                continue;
            }
            const art = arts[0];
            let price = art.LotPrice;
            let secondLotPrice = price;
            if(arts.length > 1) {
                secondLotPrice = arts[1].LotPrice;
            }
            elementsData.push({ ElementName: elementName,
                Price: price,
                ImageUrl: art.ImageUrl,
                Title: art.Title,
                Diffrence: secondLotPrice - price,
                AuctionUrl: `/auction.php?cat=elements&sort=0&art_type=${elementName}`,
                NewAuctionUrl: `/auction_new_lot.php?${elementName}=${(price - 1)}`
            });
        }
        //console.log(elementsData);
        setValue("elementsData", JSON.stringify(elementsData));
    } else {
        elementsData = JSON.parse(getValue("elementsData", "[]"));
        //console.log(elementsData);
    }
    let resourcesHtml = "";
    for(const elementData of elementsData) {
        resourcesHtml += `
<div class='newspaper-resources-item'>
<div style='align-self: center;'>
    <a class='hover-link' href='${elementData.NewAuctionUrl}' target='_blank'>
        <img src='${elementData.ImageUrl}' width='20' heigth='20' border='0'>
    </a>
</div>
<a class='hover-link' target='_. blank' style='text-decoration: none; align-self: center; margin-left: 5px; font-size: 9px;' href='${elementData.AuctionUrl}' title='${isEn ? "First and second lot price difference" : "Разница первого и второго лотов"}: ${elementData.Diffrence}'>${elementData.Price}</a>
<div style='${(elementData.Diffrence >= 150 ? 'display: inline-flex; background-color: #f33800; padding: 5px;margin-left: 5px; border: 0; border-radius: 4px; color: #fff;' : 'display: none;')}'>
    <span title='' style='font-size: 8px; font-weight: bold;'>${elementData.Diffrence}</span>
</div>
</div>`;
    }
    resourcesPanel.innerHTML = resourcesHtml + `<button id="refreshElementsButton" value="${isEn ? "Refresh" : "Обновить"}" title="${isEn ? "Refresh" : "Обновить"}" >&#8635;</button>`;
    resourcesPanel.querySelector("#refreshElementsButton").addEventListener("click", function() { getResources(true); });
}
async function getClanNews() {
    if(!getValue("ClanId")) {
        document.getElementById("newspaperContentPanel").innerHTML = "Вы не состоите в кланах";
        return;
    }
    const doc = await getRequest(`/sms_clans.php?clan_id=${getValue("ClanId")}`);
    const letters = Array.from(doc.querySelectorAll("table.wbwhite a[href^='/sms_clans.php'][href*='read']")).map(x => { return {
        Title: x.innerHTML,
        Ref: x.href,
        DateText: x.parentNode.previousElementSibling.innerHTML,
        IsHot:  (Date.now() - parseDate(x.parentNode.previousElementSibling.innerHTML, false, true).getTime()) / (1000 * 60 * 60) <= 12,
    }; }).slice(0, parseInt(getValue("ShowItemsAmount", 5)));
    //console.log(letters);
    //console.log(`letters: ${letters.length}`);
    let clanLetters = "";
    for(const letter of letters) {
        clanLetters += `
<div class='text-title'>
    <a class='hover-link' style='text-decoration:none; ${letter.IsHot ? "font-weight: bold; color: red;" : ""}' target='_blank' href='${letter.Ref}' title='${letter.Title}'>${letter.IsHot ? "📣 " : "• "}${letter.Title}</a>
    <div class='clan-style'>
        <span title='Дата' style='font-size:9px'>${letter.DateText}</span>
    </div>
</div>
`;
    }
    document.getElementById("newspaperContentPanel").innerHTML = clanLetters;
}
async function getForumNews() {
    const forumId = getValue("ForumId", "2");
    const doc = await getRequest(`/forum_thread.php?id=${forumId}`);
    const messages = Array.from(doc.querySelectorAll("tr > td:nth-child(1) > a[href^='forum_messages.php']")).map(x => { return {
        Fixed: getParent(x, "tr").querySelector("img[src*='skrepka.gif']") ? true : false,
        Title: x.innerHTML,
        Reference: x.href,
        LastCommentReference: getParent(x, "tr").querySelector("a[href^='forum_messages.php'][href*='page=last']"),
        CommentsAmount: parseInt(getParent(x, "tr").cells[2].innerHTML),
        IsHot: parseInt(getParent(x, "tr").cells[2].innerHTML) <= 20
    };}).filter(x => !x.Fixed).slice(0, parseInt(getValue("ShowItemsAmount", 5)));
    let forumNews = "";
    for(const message of messages) {
        forumNews += `
<div class='text-title'>
    <a class='hover-link' style='text-decoration: none;${(message.IsHot ? ' font-weight: bold; color: #ff4d00' : '')}' target='_blank' href='${message.Reference}' title='${message.Title}'>${(message.IsHot ? "🔥" : "•")} ${message.Title}
    </a>
    <div style='display: inline-flex; background-color: #adadad40;padding: 3px 7px; margin-left: 7px; border: 0; border-radius: 4px; color: #592C08;'>
        <a href="${message.LastCommentReference}" title='Количество комментариев. Перейти к последнему.' target='_blank' style='font-size: 9px'>${message.CommentsAmount}</a>
    </div>
</div>`;
    }
    document.getElementById("newspaperContentPanel").innerHTML = forumNews;
}
async function getDailyNews() {
    const newsPanel = document.getElementById("newspaperContentPanel");
    newsPanel.innerHTML = `${getWheelImage()}&nbsp;&nbsp;Загрузка списка новостей...`;
    let dailyNews = JSON.parse(getValue("DailyNews", "[]")).map(x => JSON.parse(x)); //console.log(dailyNews);
    dailyNews = distinctBy(dailyNews, x => x.href);

    if(parseInt(getValue("LastDailyNewsRequestTime", 0)) + 6 * 3600 * 1000 < getServerTime()) {
        const dailyNewsRefs = dailyNews.map(x => x.href);
        setValue("LastDailyNewsRequestTime", getServerTime());
        const doc = await getRequest("https://daily.heroeswm.ru");
        const allNewsRefs = Array.from(doc.querySelectorAll("a[href^='https://daily.heroeswm.ru/n/']"));
        const newsRefs = groupBy(allNewsRefs.filter(x => x.hash != "#last"), x => x.href); //console.log(newsRefs);
        dailyNews = dailyNews.filter(x => allNewsRefs.map(x => x.href).includes(x.href));
        dailyNews.forEach(x => x.isHot = false);
        const newNews = [];
        for(const newsRefKey in newsRefs) {
            const newsRef = newsRefs[newsRefKey][0];
            if(dailyNewsRefs.includes(newsRef.href)) {
                continue;
            }
            const commentsRef = allNewsRefs.find(x => x.pathname == newsRef.pathname && x.hash == "#last"); // https://daily.heroeswm.ru/n/sun-sword?last#last
            const commentsAmount = commentsRef ? parseInt(commentsRef.innerText) : 0;
            newNews.push({ href: newsRef.href, text: newsRef.innerText, commentsAmount: commentsAmount, isHot: true });
        }
        dailyNews.unshift(...newNews);
        setValue("DailyNews", JSON.stringify(dailyNews.map(x => JSON.stringify(x))));
    }

    let newsText = "";
    for(const dailyNewsItem of dailyNews) {
        let comments = "";
        if(dailyNewsItem.commentsAmount > 0) {
            comments = ` (<a class='hover-link' style='text-decoration: none; font-style: italic; font-size: 10px;' target='_blank' href='${dailyNewsItem.href}?last#last'>${(isEn ? "Comments: " : "Комментариев: ") + dailyNewsItem.commentsAmount}</a>)`;
        }
        newsText += `
<div class='text-title'>
    <a class='hover-link' style='text-decoration: none;' target='_blank' href='${dailyNewsItem.href}'>${dailyNewsItem.isHot ? "⚡" : "•"} ${dailyNewsItem.text}</a>${comments}
</div>`;
    }
    //console.log(newsText);
    newsPanel.innerHTML = newsText;
}
function getWheelImage() { return '<img border="0" align="absmiddle" height="11" src="https://dcdn.heroeswm.ru/css/loading.gif">'; }
function getSertIdByLocationNumber(locationNumber) { return "sec_" + (locationNumber.toString()).padStart(2, "0"); }
function getSertIdByLocationName(locationName) {
    const locationNumber = Object.keys(locations).find(x => locations[x][2] == locationName);
    return getSertIdByLocationNumber(locationNumber);
}
function getHouseIdByLocationNumber(locationNumber) { return "dom_" + (locationNumber.toString()).padStart(2, "0"); }
function getHouseIdByLocationName(locationName) {
    const locationNumber = Object.keys(locations).find(x => locations[x][2] == locationName);
    return getHouseIdByLocationNumber(locationNumber);
}
function distinctBy(arr, criteria) { return arr.filter((x, i) => arr.findIndex(y => criteria(y) == criteria(x)) == i); }
// API
function getURL(url) { window.location.href = url; }
function createDataList(inputElement, dataListId, buttonsClass) {
    const datalist = addElement("datalist", { id: dataListId });
    const valuesData = getValue("DataList" + dataListId);
    let values = [];
    if(valuesData) {
        values = valuesData.split(",");
    }
    for(const value of values) {
        addElement("option", { value: value }, datalist);
    }
    inputElement.parentNode.insertBefore(datalist, inputElement.nextSibling);
    inputElement.setAttribute("list", dataListId);

    const clearListButton = addElement("input", { type: "button", value: "x", title: LocalizedString.ClearList, class: buttonsClass, style: "min-width: 20px; width: 20px; text-align: center; padding: 2px 2px 2px 2px;" });
    clearListButton.addEventListener("click", function() { if(window.confirm(LocalizedString.ClearList)) { deleteValue("DataList" + dataListId); datalist.innerHTML = ""; } }, false);
    inputElement.parentNode.insertBefore(clearListButton, datalist.nextSibling);

    return datalist;
}
function showCurrentNotification(html) {
    //setValue("CurrentNotification", `{"Type":"1","Message":"The next-sibling combinator is made of the code point that separates two compound selectors. The elements represented by the two compound selectors share the same parent in the document tree and the element represented by the first compound selector immediately precedes the element represented by the second one. Non-element nodes (e.g. text between elements) are ignored when considering the adjacency of elements."}`);
    if(!isHeartOnPage) {
        return;
    }
    let currentNotificationHolder = document.querySelector("div#currentNotificationHolder");
    let currentNotificationContent = document.querySelector("div#currentNotificationContent");
    if(!currentNotificationHolder) {
        currentNotificationHolder = addElement("div", { id: "currentNotificationHolder", style: "display: flex; position: fixed; transition-duration: 0.8s; left: 50%; transform: translateX(-50%); bottom: -300px; width: 200px; border: 2px solid #000000; background-image: linear-gradient(to bottom, #EAE0C8 0%, #DBD1B9 100%); font: 10pt sans-serif;" }, document.body);
        currentNotificationContent = addElement("div", { id: "currentNotificationContent", style: "text-align: center;" }, currentNotificationHolder);
        const divClose = addElement("div", { title: isEn ? "Close" : "Закрыть", innerText: "x", style: "border: 1px solid #abc; flex-basis: 15px; height: 15px; text-align: center; cursor: pointer;" }, currentNotificationHolder);
        divClose.addEventListener("click", function() {
            const rect = currentNotificationHolder.getBoundingClientRect();
            currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
        });
    }
    currentNotificationContent.innerHTML = html;
    const rect = currentNotificationHolder.getBoundingClientRect();
    currentNotificationHolder.style.bottom = `${-rect.height-1}px`;
    currentNotificationHolder.style.bottom = "0";
    setTimeout(function() { currentNotificationHolder.style.bottom = `${-rect.height-1}px`; }, 3000);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Array and object
function groupBy(list, keyFieldOrSelector) { return list.reduce(function(t, item) { const keyValue = typeof keyFieldOrSelector === 'function' ? keyFieldOrSelector(item) : item[keyFieldOrSelector]; (t[keyValue] = t[keyValue] || []).push(item); return t; }, {}); };
function getKeyByValue(object, value) { return Object.keys(object).find(key => object[key] === value); }
function findKey(obj, selector) { return Object.keys(obj).find(selector); }
function pushNew(array, newValue) { if(array.indexOf(newValue) == -1) { array.push(newValue); } }
function sortBy(field, reverse, evaluator) {
    const key = evaluator ? function(x) { return evaluator(x[field]); } : function(x) { return x[field]; };
    return function(a, b) { return a = key(a), b = key(b), (reverse ? -1 : 1) * ((a > b) - (b > a)); }
}
// HttpRequests
function getRequest(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: data,
            onload: function(response) { resolve(response); },
            onerror: function(error) { reject(error); }
        });
    });
}
function fetch({ url, method = 'GET', type = 'document', body = null }) {
    return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.responseType = type;

          xhr.onload = () => {
            if (xhr.status === 200) return resolve(xhr.response);
            throwError(`Error with status ${xhr.status}`);
          };

          xhr.onerror = () => throwError(`HTTP error with status ${xhr.status}`);

          xhr.send(body);

          function throwError(msg) {
            const err = new Error(msg);
            err.status = xhr.status;
            reject(err);
          }
    });
}
// Storage
function getValue(key, defaultValue) { return GM_getValue(key, defaultValue); };
function setValue(key, value) { GM_setValue(key, value); };
function deleteValue(key) { return GM_deleteValue(key); };
function getPlayerValue(key, defaultValue) { return getValue(`${key}${PlayerId}`, defaultValue); };
function setPlayerValue(key, value) { setValue(`${key}${PlayerId}`, value); };
function deletePlayerValue(key) { return deleteValue(`${key}${PlayerId}`); };
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    //console.log(`valueName: ${valueName}, value: ${value}, ${typeof(value)}`)
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function setOrDeleteNumberValue(key, value) {
    if(!value || value == "" || isNaN(Number(value))) {
        deleteValue(key);
    } else {
        setValue(key, value);
    }
}
function setOrDeleteNumberPlayerValue(key, value) { setOrDeleteNumberValue(key + PlayerId, value); }
function getStorageKeys(filter) { return listValues().filter(filter); }
// Html DOM
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function addStyle(css) { addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function getNearestAncestorSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextSibling) {
            return parentNode.nextSibling;
        }
    }
}
function getNearestAncestorElementSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextElementSibling) {
            return parentNode.nextElementSibling;
        }
    }
}
function nextSequential(node) { return node.firstChild || node.nextSibling || getNearestAncestorSibling(node); }
function nextSequentialElement(element) { return element.firstElementChild || element.nextElementSibling || getNearestAncestorElementSibling(element); }
function getSequentialsUntil(firstElement, lastElementTagName) {
    let currentElement = firstElement;
    const resultElements = [currentElement];
    while((currentElement = nextSequential(currentElement)) && currentElement.nodeName.toLowerCase() != lastElementTagName.toLowerCase()) {
        resultElements.push(currentElement);
    }
    if(currentElement) {
        resultElements.push(currentElement);
    }
    return resultElements;
}
function findChildrenTextContainsValue(selector, value) { return Array.from(document.querySelectorAll(selector)).reduce((t, x) => { const match = Array.from(x.childNodes).filter(y => y.nodeName == "#text" && y.textContent.includes(value)); return [...t, ...match]; }, []); }
// Popup panel
function createPupupPanel(panelName, panelTitle, fieldsMap, panelToggleHandler) {
    const backgroundPopupPanel = addElement("div", { id: panelName, style: "position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); z-index: 200;" }, document.body);
    backgroundPopupPanel.addEventListener("click", function(e) { if(e.target == this) { hidePupupPanel(panelName, panelToggleHandler); }});
    const topStyle = isMobileDevice ? "" : "top: 50%; transform: translateY(-50%);";
    const contentDiv = addElement("div", { style: `${topStyle} padding: 5px; display: flex; flex-wrap: wrap; position: relative; margin: auto; padding: 0; width: fit-content; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); border: 1mm ridge rgb(211, 220, 50);` }, backgroundPopupPanel);
    if(panelTitle) {
        addElement("b", { innerHTML: panelTitle, style: "text-align: center; margin: auto; width: 90%; display: block;" }, contentDiv);
    }
    const divClose = addElement("span", { id: panelName + "close", title: isEn ? "Close" : "Закрыть", innerHTML: "&times;", style: "cursor: pointer; font-size: 20px; font-weight: bold;" }, contentDiv);
    divClose.addEventListener("click", function() { hidePupupPanel(panelName, panelToggleHandler); });

    addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);

    if(fieldsMap) {
        let contentTable = addElement("table", { style: "flex-basis: 100%; width: min-content;"}, contentDiv);
        for(const rowData of fieldsMap) {
            if(rowData.length == 0) { // Спомощью передачи пустой стороки-массива, указываем, что надо начать новую таблицу после брейка
                addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);
                contentTable = addElement("table", undefined, contentDiv);
                continue;
            }
            const row = addElement("tr", undefined, contentTable);
            for(const cellData of rowData) {
                const cell = addElement("td", undefined, row);
                if(cellData) {
                    if(typeof(cellData) == "string") {
                        cell.innerText = cellData;
                    } else {
                        cell.appendChild(cellData);
                    }
                }
            }
        }
    }
    if(panelToggleHandler) {
        panelToggleHandler(true);
    }
    return contentDiv;
}
function showPupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    if(backgroundPopupPanel) {
        backgroundPopupPanel.style.display = '';
        if(panelToggleHandler) {
            panelToggleHandler(true);
        }
        return true;
    }
    return false;
}
function hidePupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    backgroundPopupPanel.style.display = 'none';
    if(panelToggleHandler) {
        panelToggleHandler(false);
    }
}
// Script autor and url
function getScriptLastAuthor() {
    let authors = GM_info.script.author;
    if(!authors) {
        const authorsMatch = GM_info.scriptMetaStr.match(/@author(.+)\n/);
        authors = authorsMatch ? authorsMatch[1] : "";
    }
    const authorsArr = authors.split(",").map(x => x.trim()).filter(x => x);
    return authorsArr[authorsArr.length - 1];
}
function getDownloadUrl() {
    let result = GM_info.script.downloadURL;
    if(!result) {
        const downloadURLMatch = GM_info.scriptMetaStr.match(/@downloadURL(.+)\n/);
        result = downloadURLMatch ? downloadURLMatch[1] : "";
        result = result.trim();
    }
    return result;
}
function getScriptReferenceHtml() { return `<a href="${getDownloadUrl()}" title="${isEn ? "Check for update" : "Проверить обновление скрипта"}" target=_blanc>${GM_info.script.name} ${GM_info.script.version}</a>`; }
function getSendErrorMailReferenceHtml() { return `<a href="sms-create.php?mailto=${getScriptLastAuthor()}&subject=${isEn ? "Error in" : "Ошибка в"} ${GM_info.script.name} ${GM_info.script.version} (${GM_info.scriptHandler} ${GM_info.version})" target=_blanc>${isEn ? "Bug report" : "Сообщить об ошибке"}</a>`; }
// Server time
function getServerTime() { return Date.now() - parseInt(getValue("ClientServerTimeDifference", 0)); }
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время // Это та дата, которая в toUTCString покажет время по москве
function toServerTime(clientTime) { return clientTime -  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function toClientTime(serverTime) { return serverTime +  parseInt(GM_getValue("ClientServerTimeDifference", 0)); }
function truncToFiveMinutes(time) { return Math.floor(time / 300000) * 300000; }
function today() { const now = new Date(getServerTime()); now.setHours(0, 0, 0, 0); return now; }
function tomorrow() { const today1 = today(); today1.setDate(today1.getDate() + 1); return today1; }
async function requestServerTime() {
    if(parseInt(getValue("LastClientServerTimeDifferenceRequestDate", 0)) + 6 * 60 * 60 * 1000 < Date.now()) {
        setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
        const responseText = await getRequestText("/time.php");
        const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
        if(responseParcing) {
            setValue("ClientServerTimeDifference", Date.now() - parseInt(responseParcing[1]) * 1000);
        }
    } else {
        setTimeout(requestServerTime, 60 * 60 * 1000);
    }
}
// dateString - игровое время, взятое со страниц игры. Оно всегда московское // Как результат возвращаем серверную дату
function parseDate(dateString, isFuture = false, isPast = false) {
    //console.log(dateString)
    if(!dateString) {
        return;
    }
    const dateStrings = dateString.split(" ");

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const gameDate = getGameDate();
    let year = gameDate.getUTCFullYear();
    let month = gameDate.getUTCMonth();
    let day = gameDate.getUTCDate();
    const timePart = dateStrings.find(x => x.includes(":"));
    if(timePart) {
        var time = timePart.split(":");
        hours = parseInt(time[0]);
        minutes = parseInt(time[1]);
        if(time.length > 2) {
            seconds = parseInt(time[2]);
        }
        if(dateStrings.length == 1) {
            let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            if(isPast && result > gameDate) {
                result.setUTCDate(result.getUTCDate() - 1);
            }
            if(isFuture && result < gameDate) {
                result.setUTCDate(result.getUTCDate() + 1);
            }
            //console.log(`result: ${result}, gameDate: ${gameDate}`)
            result.setUTCHours(result.getUTCHours() - 3);
            return result;
        }
    }

    const datePart = dateStrings.find(x => x.includes("-"));
    if(datePart) {
        const date = datePart.split("-");
        month = parseInt(date[isEn ? (date.length == 3 ? 1 : 0) : 1]) - 1;
        day = parseInt(date[isEn ? (date.length == 3 ? 2 : 1) : 0]);
        if(date.length == 3) {
            const yearText = isEn ? date[0] : date[2];
            year = parseInt(yearText);
            if(yearText.length < 4) {
                year += Math.floor(gameDate.getUTCFullYear() / 1000) * 1000;
            }
        } else {
            if(isFuture && month == 0 && gameDate.getUTCMonth() == 11) {
                year += 1;
            }
        }
    }
    if(dateStrings.length > 2) {
        const letterDateExec = /(\d{2}):(\d{2}) (\d{2}) (.{3,4})/.exec(dateString);
        if(letterDateExec) {
            //console.log(letterDateExec)
            day = parseInt(letterDateExec[3]);
            //const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthShortNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
            month = monthShortNames.findIndex(x => x.toLowerCase() == letterDateExec[4].toLowerCase());
            if(isPast && Date.UTC(year, month, day, hours, minutes, seconds) > gameDate.getTime()) {
                year -= 1;
            }
        }
    }
    //console.log(`year: ${year}, month: ${month}, day: ${day}, time[0]: ${time[0]}, time[1]: ${time[1]}, ${new Date(year, month, day, parseInt(time[0]), parseInt(time[1]))}`);
    let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    result.setUTCHours(result.getUTCHours() - 3);
    return result;
}
// Misc
async function initUserName() {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        //console.log(document.querySelector("h1").innerText)
        setPlayerValue("UserName", document.querySelector("h1").innerText);
    }
    if(location.pathname == "/home.php") {
        //console.log(document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText)
        const userNameRef = document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`);
        if(userNameRef) {
            setPlayerValue("UserName", userNameRef.innerText);
        }
    }
    if(!getPlayerValue("UserName")) {
        const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
        setPlayerValue("UserName", doc.querySelector("h1").innerText);
    }
}
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function showBigData(data) { console.log(data); /*addElement("TEXTAREA", { innerText: data }, document.body);*/ }
function round0(value) { return Math.round(value * 10) / 10; }
function round00(value) { return Math.round(value * 100) / 100; }
function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
// MutationObserver
function observe(targets, handler, config = { childList: true, subtree: true }) {
    targets = Array.isArray(targets) ? targets : [targets];
    targets = targets.map(x => { if(typeof x === 'function') { return x(document); } return x; }); // Можем передавать не элементы, а их селекторы
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        for(const target of targets) {
            if(target) {
                observer.observe(target, config);
            }
        }
    });
    for(const target of targets) {
        if(target) {
            ob.observe(target, config);
        }
    }
}
// UpdatePanels
// Если используется url, то это должна быть та же локация с другими параметрами
async function refreshUpdatePanels(panelSelectors, postProcessor, url = location.href) {
    panelSelectors = Array.isArray(panelSelectors) ? panelSelectors : [panelSelectors];
    let freshDocument;
    for(const panelSelector of panelSelectors) {
        const updatePanel = panelSelector(document);
        //console.log(panelSelector.toString())
        //console.log(updatePanel)
        if(updatePanel) {
            freshDocument = freshDocument || await getRequest(url);
            const freshUpdatePanel = panelSelector(freshDocument);
            if(!freshUpdatePanel) {
                console.log(updatePanel)
                continue;
            }
            if(postProcessor) {
                postProcessor(freshUpdatePanel);
            }
            updatePanel.innerHTML = freshUpdatePanel.innerHTML;
            Array.from(updatePanel.querySelectorAll("script")).forEach(x => {
                x.insertAdjacentElement("afterend", addElement("script", { innerHTML: x.innerHTML })); // Передобавляем скрипты, как элементы, что они сработали
                x.remove();
            });
        }
    }
    if(typeof win.hwm_hints_init === 'function') win.hwm_hints_init();
    return freshDocument;
}

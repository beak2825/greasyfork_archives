// ==UserScript==
// @name           hwmAdvancedMenu
// @namespace      Tamozhnya1
// @author         Tamozhnya1
// @description    Расширенное меню
// @version        5.4
// @include        *.heroeswm.ru/*
// @include        *.lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant       GM.xmlHttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/482089/hwmAdvancedMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/482089/hwmAdvancedMenu.meta.js
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
let notificationNumber = 0;
const localElementNames = {
    "abrasive": isEn ? "Abrasive" : "Абразив",
    "snake_poison": isEn ? "Viper venom" : "Змеиный яд",
    "tiger_tusk": isEn ? "Tiger`s claw" : "Клык тигра",
    "ice_crystal": isEn ? "Ice crystal" : "Ледяной кристалл",
    "moon_stone": isEn ? "Moonstone" : "Лунный камень",
    "fire_crystal": isEn ? "Fire crystal" : "Огненный кристалл",
    "meteorit": isEn ? "Meteorite shard" : "Осколок метеорита",
    "witch_flower": isEn ? "Witch bloom" : "Цветок ведьм",
    "wind_flower": isEn ? "Windflower" : "Цветок ветров",
    "fern_flower": isEn ? "Fern flower" : "Цветок папоротника",
    "badgrib": isEn ? "Toadstool" : "Ядовитый гриб"
};
const resources = [ { type: "1", name: isEn ? 'Wood' : 'Древесина', png: "wood" }, { type: "2", name: isEn ? 'Ore' : 'Руда', png: "ore" }, { type: "3", name: isEn ? 'Mercury' : 'Ртуть', png: "mercury" }, { type: "4", name: isEn ? 'Sulfur' : 'Сера', png: "sulfur" }, { type: "5", name: isEn ? 'Crystals' : 'Кристаллы', png: "crystals" }, { type: "6", name: isEn ? 'Gems' : 'Самоцветы', png: "gems" } ];

fetch.get = (url) => fetch({ url });
fetch.post = (url, data) => fetch({ url, method: 'POST', body: data });


if(!PlayerId) {
    return;
}
if(!isHeartOnPage) {
    return;
}

addStyle(`
.button-62 {
  background: linear-gradient(to bottom right, #E47B8E, #FF9A5A);
  border: 0;
  border-radius: 5px;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 500;
  outline: transparent;
  padding: 0 5px;
  text-align: center;
  text-decoration: none;
  transition: box-shadow .2s ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
}

.button-62:not([disabled]):focus {
  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
}

.button-62:not([disabled]):hover {
  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
}
.button-62:disabled,button[disabled] {
    background: linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%);
}
table.smithTable {
    width: 100%;
    background: BurlyWood;
    border: 5px solid BurlyWood;
    border-radius: 5px;
    margin-top: 1px;
}
table.smithTable th {
    border: 1px none #f5c137;
    overflow: hidden;
    text-align: center;
    font-size: 11px;
}
table.smithTable td {
    border: 1px none #f5c137;
    overflow: hidden;
    text-align: center;
}
table.smithTable tr:nth-child(odd) {
  background: Wheat;
}
table.smithTable tr:nth-child(even) {
  background: white;
}
.waiting {
    cursor: wait;
}
.not-allowed {
    cursor: not-allowed;
}
.busket0 {
    cursor: pointer;
    display: inline;
    color: yellow;
    vertical-align: middle;
    border: 1px solid;
    cursor: pointer;
    padding: 0px 5px;
}
.busket {
    background: #123512;
    cursor: pointer;
    display: inline;
    position: absolute;
    right: 0;
    top: 0;
    height: 92%;
    vertical-align: middle;
    font-size: 18px;
    border: 1px solid;
    border-radius: 5px;
    cursor: pointer;
    padding: 0px 5px;
}
.auction-common-lots-activator {
    position: relative;
}
.auction-common-lots-activator:hover > div.auction-common-lots {
    visibility: visible;
}
.auction-common-lots {
    transition-property: visibility;
    transition-delay: 0.4s;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    min-width: 140px;
    background-color: #8888d7;
    visibility: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 2px;
}
.auction-common-lots a {
    width: calc(100%/6 - 2px) !important;
    min-width: 22px !important;
    padding: 0px !important;
    text-decoration: none;
}
.auction-common-lots img {
    width: 22px;
    height: 22px;
    border: 0;
}
.flex-new-line {
    flex-basis: 100%; height: 0;
}
`);
main();
async function main() {
    initUserName();
    processHouses();
    processQuickLinks();
    processForum();
    checkMilitaryClan();
    // После рынка вставим ссылки на ресурсы, с задержкой в пол секунды
    const auctionRef = isNewInterface ? document.querySelector("div.sh_dd_container a[href='auction.php']") : document.querySelector("li:has(> a[href='auction.php'])");
    if(auctionRef) {
        auctionRef.classList.add("auction-common-lots-activator");
        const auctionCommonLotsDiv = addElement("div", { id: "auctionCommonLotsDiv", class: "auction-common-lots" }, auctionRef);
        showMarket(auctionCommonLotsDiv);
        if(isMobileDevice) {
            auctionRef.addEventListener("touchstart", function(e) { if(auctionCommonLotsDiv.style.visibility == 'hidden') { auctionCommonLotsDiv.style.visibility = 'visible'; } } );
        }
    }
    // После передачи ресурсов вставим основные ссылки персонажа
    const transferRef = isNewInterface ? document.querySelector("div.sh_dd_container a[href='transfer.php']") : getParent(document.querySelector("li > a[href='transfer.php']"), "li");
    if(transferRef) {
        const personalReferences = [
            { href: `el_transfer.php`, text: isEn ? 'Transfer elements' : 'Передача элементов' },
            { href: 'javascript:void(0);', text: "" },
            { href: `pl_info.php?id=${PlayerId}`, text: getPlayerValue("UserName") || (isEn ? 'Character' : 'Персонаж') },
            { href: `pl_transfers.php?id=${PlayerId}`, text: isEn ? 'Transfer log' : 'Протокол передач' },
            { href: `pl_warlog.php?id=${PlayerId}`, text: isEn ? 'Combat log' : 'Протокол боев' },
            { href: `pl_cardlog.php?id=${PlayerId}`, text: isEn ? 'Game log' : 'Протокол игр' },
            { href: `friends.php`, text: isEn ? 'Your friends' : 'Ваши друзья' },
            { href: `/pl_clans.php`, text: isEn ? 'Your clans' : 'Ваши кланы' },
            { href: `ephoto_albums.php`, text: isEn ? 'Your photos' : 'Ваш фотоальбом' },
            { href: 'javascript:void(0);', text: "" },
            { href: `logout.php?${Math.round( Math.random()* 100000 )}`, text: isEn ? 'Logout' : 'Выход' }
        ];
        const html = personalReferences.reduce((t, x) => t + getMenuItemTemplate(x.href, x.text), "");
        transferRef.insertAdjacentHTML('afterend', html);
    }
    // Расширение карты
    const mapMenuContainer = isNewInterface ? document.querySelector("div.sh_dd_container a[href='map.php?st=hs']") : getParent(document.querySelector("li > a[href='map.php?st=hs']"), "li");
    if(mapMenuContainer) {
        const housesInfo = JSON.parse(getPlayerValue("PlayerHouses", "{}"));
        let mapExtenders = Object.keys(housesInfo).map(x => ({ href: `house_info.php?id=${x}`, text: housesInfo[x].replace(" ", "&nbsp;") }));
        // Арендованные дома. Берутся из скрипта Transporter
        for(let locationNumber = 1; locationNumber <= 27; locationNumber++) {
            const guestInfo = JSON.parse(getValue(`GuestInfo${locationNumber}`, "{}"));
            for(const key in guestInfo) {
                mapExtenders = [...mapExtenders, { href: `house_info.php?id=${key}`, text: guestInfo[key].HostInfo, title: `до ${(new Date(guestInfo[key].ExpireDate)).toLocaleString()}` }];
            }
        }
        //
        mapExtenders = [...mapExtenders, { href: 'javascript:void(0);', text: "" }, { href: 'ecostat.php', text: isEn ? 'Economic statistics' : 'Эконом. статистика' }
        , { href: 'arts_arenda.php', text: isEn ? 'Artifacts at lease' : 'Предметы в аренде' }];
        // Ссылки по боевому клану. Появляются после захода на страницу кланов
        const clanId = getPlayerValue("MilitaryClanId");
        if(clanId) {
            const clanName = getPlayerValue("MilitaryClanName");
            mapExtenders = [...mapExtenders, { href: 'javascript:void(0);', text: "" },
                { href: `/clan_info.php?id=${clanId}`, text: clanName || (isEn ? 'Military clan' : 'Боевой клан') },
                { href: `/sklad_info.php?clan_id=${clanId}`, text: isEn ? 'Clan depository' : 'Клан-склад' },
                { href: `/sms_clans.php?clan_id=${clanId}`, text: isEn ? 'Clan post' : 'Клановая рассылка' }
            ];
        }
        const html = mapExtenders.reduce((t, x) => t + getMenuItemTemplate(x.href, x.text, x.title), "");
        //console.log(mapExtenders)
        mapMenuContainer.insertAdjacentHTML('afterend', html);
    }
    const leaderGuildRef = isNewInterface ? document.querySelector("div.sh_dd_container a[href='leader_guild.php']") : getParent(document.querySelector("li > a[href='leader_guild.php']"), "li");
    if(leaderGuildRef) {
        const leaderGuildReferences = [
            { href: `leader_army.php`, text: isEn ? 'Recruiting' : 'Набор армии' },
            { href: `leader_army_exchange.php`, text: isEn ? 'Creature Exchange' : 'Обмен существ' }
        ];
        const html = leaderGuildReferences.reduce((t, x) => t + getMenuItemTemplate(x.href, x.text), "");
        leaderGuildRef.insertAdjacentHTML('afterend', html);
    }
    // Ивент подземные пещеры
    const recruitEventRef = isNewInterface ? document.querySelector("div.sh_dd_container a[href='recruit_event.php']") : getParent(document.querySelector("li > a[href='recruit_event.php']"), "li");
    if(recruitEventRef) {
        const recruitEventReferences = [
            { href: `recruit_event_set.php`, text: isEn ? 'Recruiting' : 'Набор армии' },
        ];
        const html = recruitEventReferences.reduce((t, x) => t + getMenuItemTemplate(x.href, x.text), "");
        recruitEventRef.insertAdjacentHTML('afterend', html);
    }
    // Ивент парный портал
    const tj2EventRef = isNewInterface ? document.querySelector("div.sh_dd_container a[href='tj_event2.php']") : getParent(document.querySelector("li > a[href='tj_event2.php']"), "li");
    if(tj2EventRef) {
        const recruitEventReferences = [
            { href: `tj_set.php`, text: isEn ? 'Recruiting' : 'Набор армии' },
        ];
        const html = recruitEventReferences.reduce((t, x) => t + getMenuItemTemplate(x.href, x.text), "");
        tj2EventRef.insertAdjacentHTML('afterend', html);
    }
    // Ивент легенды пустошей
    const journeyEventRef = isNewInterface ? document.querySelector("div.sh_dd_container a[href='journey_event.php']") : getParent(document.querySelector("li > a[href='journey_event.php']"), "li");
    if(journeyEventRef) {
        const recruitEventReferences = [
            { href: `journey_event.php?castle=1`, text: isEn ? 'Castle' : 'Замок' },
            { href: `journey_event_army.php?from=castle`, text: isEn ? 'Recruiting' : 'Набор армии' },
        ];
        const html = recruitEventReferences.reduce((t, x) => t + getMenuItemTemplate(x.href, x.text), "");
        journeyEventRef.insertAdjacentHTML('afterend', html);
    }
    
    // Добавим для ГЛ набор армии и объмены
    // Добавим форумов и дейли
    const forumsContainer = isNewInterface ? document.querySelector("div.sh_dd_container a[href='forum.php#t1']") : getParent(document.querySelector("li > a[href='forum.php#t1']"), "li");
    if(forumsContainer) {
        const forumExtenders = [
            { href: `forum_thread.php?id=${isEn ? '103' : '3'}`, text: isEn ? 'Ideas and suggestions' : 'Идеи и предложения' },
            { href: `forum_thread.php?id=${isEn ? '121' : '22'}`, text: isEn ? 'Smiths and Ench. services' : 'Услуги кузнецов и оруж.' },
            { href: 'javascript:void(0);', text: "" },
            { href: `${isEn ? 'http://daily.heroeswm.ru/newscom.php' : 'http://daily.heroeswm.ru/'}`, text: isEn ? 'HWM Daily ENG' : 'Геройская лента' },
            { href: `${isEn ? 'https://daily-help.ru/' : 'https://daily-help.ru/'}`, text: isEn ? 'Unofficial help for the game' : 'Неофициальная справка по игре' }
        ];
        let html = forumExtenders.reduce((t, x) => t + getMenuItemTemplate(x.href, x.text), "");
        const lastForumTreads = JSON.parse(getValue("LastForumTreads", "[]")); console.log(lastForumTreads);
        if(lastForumTreads.length > 0) {
            html += getMenuItemTemplate('javascript:void(0);', "");
        }
        html += lastForumTreads.reduce((t, x) => t + getMenuItemTemplate(`/forum_messages.php?tid=${x.threadId}${x.pageIndex ? `&page=${x.pageIndex}` : ""}`, x.threadName, "", `forumReference${x.threadId}`, "forumThreadRef" + x.threadId), "");
        forumsContainer.insertAdjacentHTML('afterend', html);
        Array.from(document.querySelectorAll(`span[id^='forumReference']`)).forEach(x => x.addEventListener("click", deleteForumReferenceMenuItem));
    }
    // После чатов добавим быстрые ссылки
    const framesContainer = isNewInterface ? document.querySelector("div.sh_dd_container a[href='frames.php?room=4']") : getParent(document.querySelector("li > a[href='frames.php?room=4']"), "li");
    if(framesContainer) {
        //GM_deleteValue(`QuickLinks${PlayerId}`);
        let quickLinks = JSON.parse(getPlayerValue("QuickLinks", "[]")).filter(x => x.Name && x.Reference);
        quickLinks.push({ Name: isEn ? "Settings" : "Настройки", Reference: "javascript:void(0);", id: `${GM_info.script.name}Settings` });
        if(quickLinks.length > 0) {
            quickLinks = [{ Reference: "javascript:void(0);", Name: "" }, ...quickLinks];
            const html = quickLinks.reduce((t, x) => t + getMenuItemTemplate(x.Reference, x.Name, undefined, undefined, x.id), "");
            framesContainer.insertAdjacentHTML('afterend', html);
        }
        document.getElementById(`${GM_info.script.name}Settings`).addEventListener("click", function(e) { closeDropdown(e.target); showSettings(); });
    }
    if(getPlayerBool("hideTavern")) {
        if(isNewInterface) {
            document.querySelector("div.mm_item > a[href='tavern.php']").closest("div").remove();
            document.querySelector("a[href='frames.php?room=4']").remove();
        } else {
            const menuItem = getParent(document.querySelector("li a[href='tavern.php']"), "td", 3);
            menuItem.previousElementSibling.remove();
            menuItem.remove();
            document.querySelector("a[href='frames.php?room=4']").closest("li").remove();
        }
        if(location.pathname == "/tavern.php") {
            location.href = "/home.php";
        }
        if(location.pathname == "/frames.php" && getUrlParamValue(location.href, "room") == "4") {
            location.href = "/home.php";
        }
    }
    if(getPlayerBool("hideRoulette")) {
        if(isNewInterface) {
            document.querySelector("div.mm_item > a[href='roulette.php']").closest("div").remove();
            document.querySelector("a[href='frames.php?room=3']").remove();
        } else {
            const menuItem = getParent(document.querySelector("li a[href='roulette.php']"), "td", 3);
            menuItem.previousElementSibling.remove();
            menuItem.remove();
            document.querySelector("a[href='frames.php?room=3']").closest("li").remove();
        }
        if(location.pathname == "/roulette.php") {
            location.href = "/home.php";
        }
        if(location.pathname == "/frames.php" && getUrlParamValue(location.href, "room") == "3") {
            location.href = "/home.php";
        }
        Array.from(document.querySelectorAll("a[href*='roulette.php']")).forEach(x => x.remove());
    }
    if(getPlayerBool("hideForum")) {
        if(isNewInterface) {
            document.querySelector("div.mm_item > a[href='forum.php']").closest("div").remove();
        } else {
            const menuItem = getParent(document.querySelector("li a[href='forum.php']"), "td", 3);
            menuItem.previousElementSibling.remove();
            menuItem.remove();
        }
        if(location.pathname == "/forum.php") {
            location.href = "/home.php";
        }
        Array.from(document.querySelectorAll("a[href*='forum.php']")).forEach(x => x.remove());
    }
    processForumNews();
}
function showMarket(container) {
    //const html = resources.reduce((t, x) => t + getMenuItemTemplate(`auction.php?cat=res&sort=0&type=${x.type}`, `&nbsp;&nbsp;${x.name}`), "");
    let html = "";
    for(const resource of resources) {
        html += `<a href="/auction.php?cat=res&amp;sort=0&amp;type=${resource.type}"><img src="/i/r/48/${resource.png}.png" title="${resource.name}"></a>`;
    }
    //html += "<div class='flex-new-line'></div>";
    for(const name in localElementNames) {
        if(name == "meteorit") {
            //html += "<div class='flex-new-line'></div>";
        }
        html += `<a href="/auction.php?cat=elements&sort=0&art_type=${name}"><img src="/i/gn_res/${name}.png" title="${localElementNames[name]}"></a>`;
    }
    container.insertAdjacentHTML('beforeend', html);
}
function closeDropdown(menuItem) {
    const closestExpandable = menuItem.closest("div[id$=_expandable]");
    if(closestExpandable) {
        closestExpandable.style.display = "none";
    }
}
function deleteForumReferenceMenuItem(e) {
    //e.stopPropagation();
    e.preventDefault();
    const threadId = e.target.id.replace("forumReference", "");
    //console.log(`threadId: ${threadId}`)
    const lastForumTreads = JSON.parse(getValue("LastForumTreads", "[]")).filter(x => x.threadId != threadId);
    setValue("LastForumTreads", JSON.stringify(lastForumTreads));
    
    const menuItem = isNewInterface ? getParent(e.target, "a") : getParent(e.target, "li");
    //console.log(menuItem)
    menuItem.remove();
}
function processForum() {
    if(location.pathname == '/forum_messages.php') {
        if(getValue("LastForumTreads")) {
            const saved = JSON.parse(getValue("LastForumTreads"));
            if(!Array.isArray(saved)) {
                GM_deleteValue("LastForumTreads");
            }
        }
        //https://www.heroeswm.ru/forum_messages.php?tid=2964583&page=5
        const threadId = getUrlParamValue(location.href, "tid");
        const threadName = document.querySelector(`a[href='forum_messages.php?tid=${threadId}'`).innerText;
        const maxMessageNumber = [...document.querySelectorAll("table.table3 a.pi")].map(x => parseInt(x.innerText)).filter(x => x).reduce((t, x) => Math.max(t, x), 0);
        
        let currentPageIndex = 0;
        const currentPageContainer = document.querySelector("center>table>tbody>tr>td>center:first-of-type>b>font");        //console.log(currentPageContainer);
        if(currentPageContainer) {
            currentPageIndex = parseInt(currentPageContainer.innerText) - 1;
        }
        // const lastPageContainer = document.querySelector("center>table>tbody>tr>td>center:first-of-type>a:last-of-type");        //console.log(lastPageContainer);
        // if(lastPageContainer) {
            // var lastPageIndex = parseInt(getUrlParamValue(lastPageContainer.href, "page"));
            // if(lastPageIndex < currentPageIndex) {
                // lastPageIndex = currentPageIndex;
            // }
        // }
        let lastForumTreads = JSON.parse(getValue("LastForumTreads", "[]"));
        const thisThread = lastForumTreads.find(x => x.threadId == threadId) || { threadId: threadId, threadName: threadName, pageIndex: currentPageIndex, viewTime: Date.now(), maxMessageNumber: maxMessageNumber };
        if(thisThread.pageIndex == currentPageIndex && thisThread.scrollPosition) {
            window.scrollTo(0, thisThread.scrollPosition);
        }
        thisThread.pageIndex = currentPageIndex;
        if((thisThread.maxViewedMessageNumber || 0) < maxMessageNumber) {
            thisThread.maxViewedMessageNumber = maxMessageNumber; // Максимальный просмотренный номер обновляется только здесь
        }
        if(maxMessageNumber > thisThread.maxMessageNumber) {
            thisThread.maxMessageNumber = maxMessageNumber; // Обновим максимальный номер, если видим больший
        }
        if(thisThread.news && thisThread.maxViewedMessageNumber == thisThread.maxMessageNumber) {
            delete thisThread.news;
        }
        console.log(thisThread);
        
        //thisThread.scrollPosition = window.scrollY;
        lastForumTreads = lastForumTreads.filter(x => x.threadId != thisThread.threadId);
        lastForumTreads.unshift(thisThread);
        lastForumTreads = lastForumTreads.slice(0, Number(getPlayerValue("tracingForumMessagesAmount", 10)));
        setValue("LastForumTreads", JSON.stringify(lastForumTreads));
        
        document.addEventListener("scroll", (event) => {
            const lastForumTreads = JSON.parse(getValue("LastForumTreads", "[]"));
            const threadId = getUrlParamValue(location.href, "tid");
            const scrolledTread = lastForumTreads.find(x => x.threadId == threadId);
            if(scrolledTread) {
                scrolledTread.scrollPosition = window.scrollY;
                setValue("LastForumTreads", JSON.stringify(lastForumTreads));
            }
        });
    }
}
async function processForumNews() {
    setTimeout(processForumNews, 1000 * 60);
    const lastForumTreads = JSON.parse(getValue("LastForumTreads", "[]"));
    for(const forumTread of lastForumTreads.filter(x => (x.viewTime + parseInt(getPlayerValue("tracingForumMessagesFrequence", 30)) * 60 * 1000) < Date.now() && !x.news)) {
        console.log(forumTread);
        const doc = await getRequest(`/forum_messages.php?tid=${forumTread.threadId}&page=last`);
        forumTread.viewTime = Date.now();
        const maxMessageNumber = [...doc.querySelectorAll("table.table3 a.pi")].map(x => parseInt(x.innerText)).filter(x => x).reduce((t, x) => Math.max(t, x), 0);
        forumTread.maxMessageNumber = maxMessageNumber;
        if(forumTread.maxViewedMessageNumber < maxMessageNumber) {
            forumTread.news = true;
        }
        //console.log(`Process forumTread ${forumTread.threadId}, maxMessageNumber: ${maxMessageNumber}, now: ${new Date()}, forumTread.viewTime: ${new Date(forumTread.viewTime)}`);
    }
    setValue("LastForumTreads", JSON.stringify(lastForumTreads)); //console.log(lastForumTreads);
    processNewForumMesagges();
}
function processNewForumMesagges() {
    const lastForumTreads = JSON.parse(getValue("LastForumTreads", "[]")); //console.log(lastForumTreads);
    toggleForumIndicator("/i/new_top/_panelForum.png", isEn ? "There are new messages" : "Есть новые сообщения", `/forum_messages.php?tid=${lastForumTreads.find(x => x.news)?.threadId}&page=last`, getPlayerBool("showNewForumMessagesIndicator", true) && lastForumTreads.filter(x => x.news).length > 0, "NewForumMessagesTitle", "NewForumMessages");
    for(const forumTread of lastForumTreads) {
        const forumThreadNews = document.querySelector(`a#forumThreadRef${forumTread.threadId} > div`);
        const newsRef = forumThreadNews.querySelector("a[name=newsRef]");
        if(!newsRef && forumTread.news) {
            addElement("a", { name: "newsRef", href: `/forum_messages.php?tid=${forumTread.threadId}&page=last`, innerHTML: `<img src="/i/new_top/_panelForum.png" style="width: 14px; height: 14px; display: inline-block; vertical-align: bottom;" />`, title: isEn ? "There are new messages. Go to last." : "Есть новые сообщения. Перейти к последнему." }, forumThreadNews, "afterbegin");
        }
        if(newsRef && !forumTread.news) {
            newsRef.remove();
        }
    }
}
function getMenuItemTemplate(href, text, title, deleteId, id) {
    if(text.length > 30) {
        if(!title) {
            title = text;
        }
        text = text.substring(0, 30) + "...";
    }
    if(!isNewInterface) {
        if(text == "") {
            return "<hr>";
        }
        let deleteElementText = "";
        if(deleteId) {
            deleteElementText = `<span id="${deleteId}" title='${isEn ? "Delete" : "Удалить"}' class="busket0">🗑</span>`;
        }
        return `<li><a${id ? ` id="${id}"` : ""} href='${href}' title='${title || ""}' style="">${text}${deleteElementText}</a></li>`;
    } else {
        let deleteElementText = "";
        if(deleteId) {
            deleteElementText = `<span id="${deleteId}" title='${isEn ? "Delete" : "Удалить"}' class="busket">🗑</span>`;
        }
        return `<a${id ? ` id="${id}"` : ""} href='${href}' title='${title || ""}' style='text-decoration: none;'><div style=' position: relative; ${text == "" ? "padding: 0; height: 2px;" : ""}'>${text}${deleteElementText}</div></a>`;
    }
}
function processHouses() {
    if(location.pathname == "/pl_info_realty.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        const housesInfo = Array.from(document.querySelectorAll("a[href^='house_info.php']")).reduce((t, x) => ({...t, [getUrlParamValue(x.href, "id")]: getParent(x, "tr").cells[4].innerText }), {});
        //console.log(housesInfo);
        setPlayerValue("PlayerHouses", JSON.stringify(housesInfo));
    }
}
function processQuickLinks() {
    if(location.pathname == "/pers_navlinks.php") {
        const tbody = getParent(document.querySelector("form[action='pers_navlinks.php']"), "tbody");
        const tr = addElement("tr", {}, tbody);
        const td = addElement("td", {}, tr);
        addElement("center", { innerText: isEn ? "Custom references (in Chat menu)" : "Пользовательские ссылки (доступны в меню \"Чат\")",  style: "font-size: 20px; font-weight: bold;" }, td);
        let table = addElement("table", { id: "customReferenceTable", class: "smithTable", innerHTML: `<tr><th>${isEn ? "Name" : "Наименование"}</th><th>${isEn ? "Reference" : "Ссылка"}</th></tr>` }, td);
        table = table.firstChild;
        const quickLinks = Array(10).fill({"Name":"","Reference":""});
        JSON.parse(getPlayerValue("QuickLinks", "[]")).forEach((x, i) => { quickLinks[i] = x; });
        //console.log(quickLinks)
        for(const quickLink of quickLinks) {
            const html = `<tr><td width="20%"><input type=text style="width: 100%;" value="${quickLink.Name || ""}" /></td><td><input type=text style="width: 100%;" value="${quickLink.Reference || ""}" /></td></tr>`;
            table.insertAdjacentHTML('beforeend', html);
        }
        table.addEventListener("change", saveQuickLinks);
    }
}
function saveQuickLinks() {
    const quickLinks = Array.from(document.querySelectorAll("#customReferenceTable tr:has(input)")).map(x => { return { Name: x.querySelector("td:nth-of-type(1)>input").value, Reference: x.querySelector("td:nth-of-type(2)>input").value }; }).filter(x => x.Name || x.Reference);
    setPlayerValue("QuickLinks", JSON.stringify(quickLinks));
}
async function checkMilitaryClan() {
    if(location.pathname == '/pl_clans.php') {
        const doc = location.pathname == '/pl_clans.php' ? document : await getRequest(`/pl_clans.php`);
        const clanInfos = Array.from(doc.querySelectorAll("td > li > a[href^='clan_info.php']")).map(x => { return { Id: getUrlParamValue(x.href, "id"), Name: x.firstChild.innerText, Ref: x.href }; });
        for(const clanInfo of clanInfos) {
            const clanInfoDoc = await getRequest(clanInfo.Ref);
            if(clanInfoDoc.body.innerHTML.includes(isEn ? "[Military clan]" : "[боевой клан]")) {
                var militaryClanId = clanInfo.Id;
                var clanName = clanInfo.Name;
                break;
            }
        }
        if(militaryClanId) {
            setPlayerValue("MilitaryClanId", militaryClanId);
            setPlayerValue("MilitaryClanName", clanName);
        } else {
            deletePlayerValue("MilitaryClanId");
            deletePlayerValue("MilitaryClanName");
        }
    }
    if(!getPlayerValue("MilitaryClanId")) {
        console.log("Вы не состоите в боевом клане");
        return false;
    }
    return true;
}
function showSettings() {
    if(showPupupPanel(GM_info.script.name)) {
        return;
    }
    const fieldsMap = [];

    const hideTavernLable = addElement("label", { for: "hideTavernCheckbox", innerText: isEn ? "Hide tavern" : "Скрыть таверну" });
    const hideTavernCheckbox = addElement("input", { id: "hideTavernCheckbox", type: "checkbox" });
    hideTavernCheckbox.checked = getPlayerBool("hideTavern");
    hideTavernCheckbox.addEventListener("change", function() { setPlayerValue("hideTavern", this.checked); });
    fieldsMap.push([hideTavernLable, hideTavernCheckbox]);

    const hideRouletteLable = addElement("label", { for: "hideRouletteCheckbox", innerText: isEn ? "Hide roulette" : "Скрыть рулетку" });
    const hideRouletteCheckbox = addElement("input", { id: "hideRouletteCheckbox", type: "checkbox" });
    hideRouletteCheckbox.checked = getPlayerBool("hideRoulette");
    hideRouletteCheckbox.addEventListener("change", function() { setPlayerValue("hideRoulette", this.checked); });
    fieldsMap.push([hideRouletteLable, hideRouletteCheckbox]);

    const hideForumLable = addElement("label", { for: "hideForumCheckbox", innerText: isEn ? "Hide forum" : "Скрыть форум" });
    const hideForumCheckbox = addElement("input", { id: "hideForumCheckbox", type: "checkbox" });
    hideForumCheckbox.checked = getPlayerBool("hideForum");
    hideForumCheckbox.addEventListener("change", function() { setPlayerValue("hideForum", this.checked); });
    fieldsMap.push([hideForumLable, hideForumCheckbox]);

    const tracingForumMessagesAmountLable = addElement("label", { for: "tracingForumMessagesAmountInput", innerText: isEn ? "Number of topics monitored on the forum" : "Количество отслеживаемых тем на форуме" });
    const tracingForumMessagesAmountInput = addElement("input", { id: "tracingForumMessagesAmountInput", type: "number", value: getPlayerValue("tracingForumMessagesAmount"), placeholder: 10, min: 0, max: 20 });
    tracingForumMessagesAmountInput.addEventListener("change", function() { const amount = Number(this.value); if(amount >= 0 && amount <= 20) { setPlayerValue("tracingForumMessagesAmount", amount); } else { this.value = 10; } });
    fieldsMap.push([tracingForumMessagesAmountLable, tracingForumMessagesAmountInput]);

    const showNewForumMessagesIndicatorLable = addElement("label", { for: "showNewForumMessagesIndicatorCheckbox", innerText: isEn ? "Show new forum messages indicator" : "Показывать индикатор новых сообщений на форуме" });
    const showNewForumMessagesIndicatorCheckbox = addElement("input", { id: "showNewForumMessagesIndicatorCheckbox", type: "checkbox" });
    showNewForumMessagesIndicatorCheckbox.checked = getPlayerBool("showNewForumMessagesIndicator", true);
    showNewForumMessagesIndicatorCheckbox.addEventListener("change", function() { setPlayerValue("showNewForumMessagesIndicator", this.checked); });
    fieldsMap.push([showNewForumMessagesIndicatorLable, showNewForumMessagesIndicatorCheckbox]);

    const tracingForumMessagesFrequenceLable = addElement("label", { for: "tracingForumMessagesFrequenceInput", innerText: isEn ? "Forum topic update poll frequency, min." : "Частота опроса обновления тем на форуме, мин." });
    const tracingForumMessagesFrequenceInput = addElement("input", { id: "tracingForumMessagesFrequenceInput", type: "number", value: getPlayerValue("tracingForumMessagesFrequence"), placeholder: 30, min: 5, max: 120 });
    tracingForumMessagesFrequenceInput.addEventListener("change", function() { const value = Number(this.value); if(value >= 5 && value <= 120) { setPlayerValue("tracingForumMessagesFrequence", value); } else { this.value = 30; } });
    fieldsMap.push([tracingForumMessagesFrequenceLable, tracingForumMessagesFrequenceInput]);

    createPupupPanel(GM_info.script.name, getScriptReferenceHtml() + " " + getSendErrorMailReferenceHtml(), fieldsMap);
}
function toggleForumIndicator(imageName, message, url, condition, indicatorContainerId, indicatorId) {
    if(condition) {
        const homeRef = document.querySelector("a[href='forum.php']");
        const existingIndicator = document.getElementById(indicatorContainerId);
        if(existingIndicator) {
            existingIndicator.title = message;
        } else {
            notificationNumber++;
            //console.log(`notificationNumber: ${notificationNumber}`);
            if(isMobileInterface) {
                const link_home = document.querySelector("div#link_forum")
                const a = addElement("a", { id: indicatorId, href: url }, link_home);
                const width = 22;
                const height = 21;
                const top = 13 + height;
                const right = -3 + width * (notificationNumber - 1);
                const div = addElement("div", { id: indicatorContainerId, title: message, style: `line-height: 20.6px; position: absolute; top: ${top}px; right: ${right}px;`, class: "PanelBottomNotification PanelBottomNotification_add" }, a);
                addElement("img", { src: imageName, class: "NotificationIcon" }, div);
            } else if(isNewInterface) {
                const a = addElement("a", { id: indicatorId, href: url }, homeRef.parentNode);
                const width = 24;
                const height = 24;
                const top = -1 + height;
                const right = -3 + width * (notificationNumber - 1);
                const div = addElement("div", { id: indicatorContainerId, title: message, style: `height: ${height}px; width: ${width}px; position: absolute; top: ${top}px; right: ${right}px;` }, a);
                addElement("img", { src: imageName, class: "NotificationIcon" }, div);
            } else {
                const td = getParent(homeRef, "td");
                const newTd = addElement("td", { id: indicatorId }, td.parentNode);
                const a = addElement("a", { href: url }, newTd);
                addElement("img", { id: indicatorContainerId, src: imageName, title: message, style: "width: 12px; height: 12px; border-radius: 50%;" }, a);
            }
        }
    } else {
        const existingIndicator = document.getElementById(indicatorId);
        if(existingIndicator) {
            existingIndicator.remove();
            notificationNumber--;
        }
    }
}
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
    //GM_setValue("CurrentNotification", `{"Type":"1","Message":"The next-sibling combinator is made of the code point that separates two compound selectors. The elements represented by the two compound selectors share the same parent in the document tree and the element represented by the first compound selector immediately precedes the element represented by the second one. Non-element nodes (e.g. text between elements) are ignored when considering the adjacency of elements."}`);
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

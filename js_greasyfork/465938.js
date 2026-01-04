// ==UserScript==
// @name           hwmResoursesAsImages
// @namespace      hwmResoursesAsImages
// @description    Ресурсы и части в картинках
// @author         raTaHoa; Чеширский КотЪ; code: Dinozon2, ElMarado; style: sw.East
// @version        5.2
// @include        https://*.heroeswm.ru/pl_info.php*
// @include        https://*.lordswm.com/pl_info.php*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465938/hwmResoursesAsImages.user.js
// @updateURL https://update.greasyfork.org/scripts/465938/hwmResoursesAsImages.meta.js
// ==/UserScript==

addStyle (`
.resourceSlot{
   float: left;
   width: 48px;
   height: 48px;
   margin: 4px 4px 4px 0;
   padding: 0;
   border: 4px solid #fff;
   box-shadow: 0px 0px 5px #aaa;
   z-index: 1;
   position: relative;
}
.resourceSlot img {
   display: block;
   width: 42px;
   height: 42px;
   margin: 3px 0 0 3px;
   padding: 0;
}
.resourceSlot a img {
   -webkit-transition: all 0.2s linear;
      -moz-transition: all 0.2s linear;
       -ms-transition: all 0.2s linear;
        -o-transition: all 0.2s linear;
           transition: all 0.2s linear;
}
.resourceSlot:hover a img {
   -webkit-transform: scale(1.20,1.20);
      -moz-transform: scale(1.20,1.20);
       -ms-transform: scale(1.20,1.20);
        -o-transform: scale(1.10,1.20);
           transform: scale(1.20,1.20);
   opacity:1;
}
.resourceSlot a{
   text-decoration: none;
}
.amountSlot {
   position: absolute;
   min-width: 14px;
   height: 13px;
   margin: -48px 0 0 -3px;
   padding: 0 1px 1px;
   color: #fff;
   border: 2px solid #fff;
   background: #222;
   -webkit-box-shadow: 1px 1px 1px #aaa;
      -moz-box-shadow: 1px 1px 1px #aaa;
           box-shadow: 1px 1px 1px #aaa;
   z-index: 15;
   font-size: 10px;
   text-align: center;
   text-decoration: none !important;
   text-shadow: 1px 1px 1px rgba(0,0,0, 0.8);
   cursor: pointer;
   opacity: .7;
   -webkit-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
      -moz-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
       -ms-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
        -o-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
           transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;
}` );
const ElementsArray = {
    "Доспех войны": "part_warlord_armor",
    
    "Сапоги страха": "part_fear_boots",
    "Роба страха": "part_fear_bonearmour",
    "Коса страха": "part_fear_scythe",
    "Плащ страха": "part_fear_cloack",
    "Амулет страха": "part_fear_amulk",
    "Щит страха": "part_fear_shield",
    "Фонарь страха": "part_fear_lantern",
    "Серп страха": "part_fear_sickle",
    "Лук страха": "part_fear_bow",
    "Маска страха": "part_fear_maska",
    "Кольцо страха": "part_fear_dring",
    
    "Магма меч": "part_magma_swrd",
    "Магма шлем": "part_magma_helm",
    "Магма кулон": "part_magma_pend",
    "Магма кольцо": "part_magma_rd",
    "Магма доспех": "part_magma_armor",
    "Магма плащ": "part_magma_clc",
    "Магма арбалет": "part_magma_arb",
    "Магма сапоги": "part_magma_boots",
    "Магма щит": "part_magma_lshield",
    "Магма кинжал": "part_magma_dagger",
    "Небесный посох": "part_heaven_staff",
    "Небесная диадема": "part_heaven_helm",
    "Небесные сандалии": "part_heaven_bts",
    "Небесный доспех": "part_heaven_armr",
    "Небесная мантия": "part_heaven_clk",
    "Небесный лук": "part_heaven_bow",
    "Небесный щит": "part_heaven_shield",
    "Небесный амулет": "part_heaven_amlt",
    "Небесное кольцо": "part_heaven_rn",
    "Небесный кинжал": "part_heaven_dagger",
        // *** Артефакты тьмы
    'Амулет тьмы':          'part_dark_amul',
    'Доспех тьмы':          'part_dark_armor',
    'Меч тьмы':             'part_dark_sword',
    'Сапоги тьмы':          'part_dark_boots',
    'Топор тьмы':           'part_dark_axe',
    'Шлем тьмы':            'part_dark_helmet',
    'Щит тьмы':             'part_dark_shield',
    'Плащ тьмы':            'part_dark_cloak',
    'Кинжал тьмы':          'part_dark_dagger',
    'Кольцо тьмы':          'part_dark_ring',
    'Лук тьмы':             'part_dark_bow',
        // *** Имперские артефакты
    'Имперский амулет':     'part_imp_amul',
    'Имперский арбалет':    'part_imp_crossbow',
    'Имперский доспех':     'part_imp_armor',
    'Имперский кинжал':     'part_imp_dagger',
    'Имперское кольцо':     'part_imp_ring',
    'Имперский меч':        'part_imp_sword',
    'Имперский плащ':       'part_imp_cloak',
    'Имперские сапоги':     'part_imp_boots',
    'Имперский шлем':       'part_imp_helmet',
    'Имперский щит':        'part_imp_shield',
        // *** Части Гильдии Лидеров
    'Части редкого отряда':       'https://dcdn.heroeswm.ru/i/rewards/gn/task3.png',
    'Частей редкого отряда':      'https://dcdn.heroeswm.ru/i/rewards/gn/task3.png',
    'Части очень редкого отряда': 'https://dcdn.heroeswm.ru/i/rewards/gn/task4.png',
    'Частей очень редкого отряда':'https://dcdn.heroeswm.ru/i/rewards/gn/task4.png',
    'Части таинственного свитка': 'https://i.imgur.com/38VoKxQ.png',
        // *** Элементы Гильдии Наёмников
    'Абразив':              'abrasive',
    'Змеиный яд':           'snake_poison',
    'Клык тигра':           'tiger_tusk',
    'Ледяной кристалл':     'ice_crystal',
    'Лунный камень':        'moon_stone',
    'Огненный кристалл':    'fire_crystal',
    'Осколок метеорита':    'meteorit',
    'Цветок ведьм':         'witch_flower',
    'Цветок ветров':        'wind_flower',
    'Цветок папоротника':   'fern_flower',
    'Ядовитый гриб':        'badgrib',
        // *** Элементы с предприятий
    'Кожа':                 'https://i.imgur.com/Xn82L25.png',
    'Сталь':                'https://i.imgur.com/hwThTJE.png',
    'Никель':               'https://i.imgur.com/6lHniay.png',
    'Волшебный порошок':    'https://i.imgur.com/IuqF7rI.png',
    'Мифриловая руда':      'https://i.imgur.com/dv6rzKn.png',
    'Обсидиан':             'https://i.imgur.com/4yOWbK8.png',
    'Мифрил':               'https://i.imgur.com/1Y1Z7Mq.png',
    'Орихалк':              'https://i.imgur.com/qRGZzCs.png'
};

main();
function main() {
    const resourcesPanel = getResourcesPanel();
    if(!resourcesPanel) {
        return;
    }
    const parsedResourcesInfo = getParsedResourcesInfo(resourcesPanel);
    for(const resource of parsedResourcesInfo) {
        if(resource.Amount > 0) {
            let resourceCode = ElementsArray[resource.Name];
            if(!resourceCode) {
                continue;
            }
            const toolTip = `${resource.Name}: ${resource.Amount}`;
            let html;
            if(resourceCode.startsWith("https")) {
                html = `<a href="#"><img src="${resourceCode}" alt="${toolTip}" title="${toolTip}"></a>`;
            } else {
                let artCategory;
                let imageSource;
                if(isArtPart(resource.Name)) { 
                    artCategory = "part";
                    imageSource = `/i/artifacts/parts/${resourceCode}.png`;
                } else {
                    artCategory = "elements";
                    imageSource = `/i/gn_res/${resourceCode}.png?v=0`;
                }
                html = `<a href="/auction.php?cat=${artCategory}&sort=0&art_type=${resourceCode}"><img src="${imageSource}" alt="${toolTip}" title="${toolTip}"></a>`;
            }
            let amountDivWidth = Math.max(15, Math.ceil(getNumberLength(resource.Amount) * 7.5));
            //console.log(`resource.Amount: ${resource.Amount}, amountDivWidth: ${amountDivWidth}`);
            html += `<div class="amountSlot" style="width: ${amountDivWidth}px">${resource.Amount}</div>`;
            if(resource.TextNode.nextSibling && resource.TextNode.nextSibling.tagName.toLowerCase() == "br") {
                resource.TextNode.nextSibling.remove();
            }
            resource.TextNode.replaceWith(createElement("div", { class: "resourceSlot", innerHTML: html }));
        }
    }
}
function isArtPart(name) { return name.includes('Импер') || name.includes('Магма') || name.includes('тьмы') || name.includes('Небесн') || name.includes('страха') || name.includes('войны'); }
function getParsedResourcesInfo(resourcesPanel) {
    const walker = document.createTreeWalker(resourcesPanel, NodeFilter.SHOW_TEXT);
    let textNodes = [];
    while(walker.nextNode()) {
        textNodes.push(walker.currentNode)
    }
    textNodes = textNodes.map(x => [x, x.textContent.replace("\n", "").trimStart()]).filter(x => x[1] != "" && !x[1].includes("function")).map(x => { return { TextNode: x[0], Name: x[1].split(":")[0], Amount: parseInt(x[1].split(":")[1].replace(/,/g, "")) }; });
    //console.log(textNodes);
    return textNodes;
}
function getResourcesPanel() {
    const tables = document.querySelectorAll("table.wblight");
    for(const table of tables) {
        const bolds = table.querySelectorAll("b");
        for(const bold of bolds) {
            if(bold.innerText == "Ресурсы") {
                return table.rows[1].cells[0];
            }
        }
    }
}
function getNumberLength(number) { return number.toString().length; }
function addElement(type, parent, data) {
    let el = createElement(type, data);
    if(parent) {
        parent.appendChild(el);
    }
    return el;
}
function createElement(type, data) {
    let el = document.createElement(type);
    if(data) {
        for(let key in data) {
            if(key == "innerText" || key == "innerHTML") {
                el[key] = data[key];
            } else {
                el.setAttribute(key, data[key]);
            }
        }
    }
    return el;
}
function addStyle(css) { addElement("style", document.head, { type: "text/css", innerHTML: css }); }


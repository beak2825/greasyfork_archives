

//
// ==UserScript==
// @license CC0
// @name           HWM_Auctioneer
// @author         Tags https://www.heroeswm.ru/pl_info.php?id=7773958
// @namespace      http://tampermonkey.net/
// @description    Торговый скрипт для HWM.
// @icon           https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @version        4.0.3
// @include        /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/(pl_info.php*|inventory.php.*|auction_new_lot.php.*|object-info.php*|house_info.php*|transfer.php*)/
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @require https://update.greasyfork.org/scripts/447488/1321559/HWM_Resources.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/446604/HWM_Auctioneer.user.js
// @updateURL https://update.greasyfork.org/scripts/446604/HWM_Auctioneer.meta.js
// ==/UserScript==
const debugLogEnabled = false;

const version = '4.0.3';
const str_script_name = 'HWM_Auctioneer';
const str_url_aut = 'sms-create.php?mailto=Tags&subject=Скрипт: ' + str_script_name + ' v' + version + '. Найдена ошибка:';

//Кнопки мыши
const LMB = 0;
const RMB = 2;
const MMB = 1;

if (typeof GM_deleteValue === 'undefined') {
    this.GM_getValue = function(key, def) {
        return localStorage[key] || def;
    };
    this.GM_setValue = function(key, value) {
        return (localStorage[key] = value);
    };
    this.GM_deleteValue = function(key) {
        return delete localStorage[key];
    };

    this.GM_addStyle = function(key) {
        let style = document.createElement('style');
        style.textContent = key;
        document.querySelector("head").appendChild(style);
    }
}
if (typeof GM_listValues === 'undefined') {
    this.GM_listValues = function() {
        const values = [];
        for (let i = 0; i < localStorage.length; i++) {
            values.push(localStorage.key(i));
        }
        return values;
    }
}

GM_addStyle(`

    .dialog {background-color: #F6F3EA; border-radius: 5px; box-sizing: border-box; box-shadow: 0 0 0px 12px rgba(200, 200, 200, 0.5); left: calc(50% - 300px); max-height: calc(100% - 100px); overflow: auto; padding: 15px; position: fixed; top: 50px; z-index: 1105;}
    .dialogOverlay {background-color: rgba(0, 0, 0, 0.7); height: 100%; left: 0; position: fixed; top: 0; width: 100%;}
    .btn_close {position:absolute;left:calc(100% - 45px);float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;}
    .btn_settings {text-decoration:underline;cursor:pointer;font-weight:bold;font-size:10px;width:500px;}
    .small_text {font-weight:bold;font-size:10px;}
    #inv_sell_auction {
      width: 25px;
      height: 25px;
      display: none;
      border-radius: 15px;
      bottom: 0;
      justify-content: center;
      align-items: center;
      background-color: #503a29;
      border-color: #d78334;
      position: absolute;
      font-size: 0.45em;}
    #inv_sell_auction > a > .inv_item_select_img {width: 20px;}
    #inv_search_auction .inv_item_select_img {width: 20px;}
    #inv_search_auction {
      width: 25px;
      display: none;
      height: 25px;
      border-radius: 15px;
      right: 0;
      position: absolute;
      bottom: 0;
      font-size: 0.45em;
      justify-content: center;
      align-items: center;
      background-color: #503a29;
      border-color: #d78334;}
    .inventory_item2:hover #inv_search_auction {display: flex;}
    .inventory_item2:hover #inv_sell_auction {display: flex;}
    .arts_info.shop_art_info:hover #inv_search_auction {
      display: flex;
    }.sellable_element {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }.wb #inv_sell_auction {
      display: flex;
      position: unset;
      height: fit-content;
    }.minPrice {
      display: flex;
      justify-content: left;
      align-items: center;
    }.settingsBtn {
      margin-top: 20px;
    }
    .keyboard {
      padding: 3px;
      margin: 3px;
      width: 60px;
    }
    @media only screen and (max-width: 768px) {
     .dialog {
      background-color: #F6F3EA;
      border-radius: 5px;
      box-sizing: border-box;
      box-shadow: 0 0 0px 12px rgba(200, 200, 200, 0.5);
      left: auto;
      max-height: calc(100% - 100px);
      overflow: auto;
      padding: 15px;
      position: absolute;
      top: 25%;
      z-index: 1105;
    }
    #inv_search_auction .inv_item_select_img {
      width: 15px;
    }
    #inv_search_auction {
      width: 20px;
      height: 20px;
      }
      #inv_sell_auction {
       width: 20px;
      height: 20px;}
    #inv_sell_auction > a > .inv_item_select_img {
      width: 15px;
    }
    }

    `);

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function addEvent(elem, evType, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(evType, fn, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + evType, fn);
    } else {
        elem["on" + evType] = fn;
    }
}

function $(id) {
    return document.querySelector(id);
}

function IntFormatWithThouthandSeparator(num) {
    var n = num.toString(),
        p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i) {
        return p < 0 || i < p ? ($0 + ',') : $0;
    });
}

// ------------------ dialog

function close_setting_form() {
    let bg = document.querySelector(`#bgOverlay${str_script_name}`);
    let bgc = document.querySelector(`#bgCenter${str_script_name}`);
    if (bg) {
        bg.style.display = bgc.style.display = 'none';
    }
}

function clear_all_params() {
    if (confirm("Вы действительно хотите сбросить все сохраненные настройки?")) {
        var keys = GM_listValues();
        for (var i = 0, key = null; key = keys[i]; i++) {
            GM_deleteValue(key);
        }
    }
}

function setCheck(ch) {
    if (GM_getValue(ch) && GM_getValue(ch) == 1) {
        GM_setValue(ch, 0);
    } else {
        GM_setValue(ch, 1);
    }
}

function setEdit(id, key) {
    var LValue = parseInt($('#' + id).value);
    GM_setValue(key, LValue);
}

function show_dialog_base(ASettingsHTML) {
    let bg = document.querySelector(`#bgOverlay${str_script_name}`);
    let bgc = document.querySelector(`#bgCenter${str_script_name}`);
    if (!bg) {

        bg = Object.assign(
            document.createElement("div"), {
                id: `bgOverlay${str_script_name}`,
                className: `dialogOverlay`,
                onclick: close_setting_form()
            });
        bgc = Object.assign(
            document.createElement("div"), {
                id: `bgCenter${str_script_name}`,
                className: `dialog`,
                onclick: close_setting_form()
            });

        document.body.appendChild(bg);
        document.body.appendChild(bgc);
        bgc.innerHTML =
            `<div style="border:1px solid #abc;padding:5px;margin:2px;">`+
            `  <div class="btn_close" id="bt_close${str_script_name}" title="Закрыть">X</div><center>`+
            ` <table><tr>`+
            `  <td><b>${str_script_name} <font style="color:#0070FF;">${version}</font></b></td></tr><tr><td><hr/></td></tr><tr>`+
            `  <td><div id="dialog_content${str_script_name}">(Empty)</div></td>`+
            `    </tr><tr><td><hr/></td></tr><tr>`+
            `      <td class="small_text" >`+
            `         <a class="small_text" href="${str_url_aut}">Нашли ошибку?</a>&nbsp;&nbsp;`+
            `         <a class="small_text" href="/transfer.php?thanks=${encodeURIComponent(`Подарок. Спасибо за скрипт: ${str_script_name} v.${version}.`)}">Сказать спасибо</a>&nbsp;&nbsp;` +
            '          <a class="small_text" style="left:calc(50% - 100px);" href="javascript:void(0);" id="settings_reset' + str_script_name + '">Скинуть все настройки</a> ' +
            '        </td>' +
            '      </tr>' +
            '      <tr>' +
            '        <td class="small_text" >' +
            '          Автор: <a class="small_text" href="https://www.heroeswm.ru/pl_info.php?id=7773958">Tags</a>' +
            '        </td>' +
            '      </tr>' +
            '    </table>' +
            '  </center>' +
            '</div>';

        addEvent($('#bt_close' + str_script_name), 'click', close_setting_form);
        addEvent($('#settings_reset' + str_script_name), 'click', clear_all_params);
    }
    bg.style.display = bgc.style.display = 'block';

    $('#dialog_content' + str_script_name).innerHTML = ASettingsHTML;
}

function show_settings_base(ASettingsHTML) {
    show_dialog_base('<div><b>Настройки:</b></div>' + ASettingsHTML);
}


// -----------------------------------------------
var GlobalCultureName = location.href.match('lordswm') ? "en-US" : "ru-RU",
    GlobalStrings = {
        "ru-RU": {
            Sell: "Пр-ь:",
            _30m: "30м",
            _1h: "1ч",
            _3h: "3ч",
            _6h: "6ч",
            _12h: "12ч",
            _1d: "1д",
            _2d: "2д",
            _3d: "3д",
        },
        "en-US": {
            Sell: "Sell:",
            _30m: "30m",
            _1h: "1h",
            _3h: "3h",
            _6h: "6h",
            _12h: "12h",
            _1d: "1d",
            _2d: "2d",
            _3d: "3d",
        }
    },
    GlobalLocalizedString = GlobalStrings[GlobalCultureName];

function CreateSearchButtons() {
    const items = Array.from(document.getElementsByClassName('arts_info shop_art_info'));
    if (debugLogEnabled) console.log(items);
    for (let item of items) {

        item.appendChild(createSearchButton(`${item.children[1].href}`))
    }
}

async function GetAuctionLink(itemLink) {
    let response = await fetch(`${itemLink}`);
    let data = await response.text();
    return Array.from(new DOMParser().parseFromString(data, "text/html").getElementsByClassName('art_info_left_block')[0].childNodes[1].childNodes)?.filter(a => a.href.includes('auction'))[0]?.href.replace(window.location.origin, "");
}

async function GetMinPrice(aucLink) {
    let response = await fetch(`${aucLink}&sort=4&sbn=1&sau=0&snew=1`);
    let data = await response.text();

    let images = Array.from(new DOMParser().parseFromString(data, "text/html").getElementsByClassName("wbwhite")[0].getElementsByClassName('rs'));
    let prices = [];
    for (let rs of images) {
        if (rs) {
            const item = rs.closest(`.wb`);

            console.log( Array.from(rs.closest(`.wb`).querySelector("[valign=top]").childNodes))
            const durability = Array.from(rs.closest(`.wb`).querySelector("[valign=top]").childNodes).filter(n=>n.nodeName==="#text").pop();
            prices.push({price:~~(rs.parentNode.parentNode.childNodes[1].innerText.replace(',', '')), durability:durability.textContent.slice(11)});

        }
    }


    return prices;
}

function createSearchButton(link) {
    if (debugLogEnabled) {
        console.log(`Create search button for link ${link}`)
    }
    const searchDiv = Object.assign(
        document.createElement("div"), {
            id: `inv_search_auction`,
            className: `inv_item_select`,
            onmousedown: async function(e) {
                if (location.href.includes('/inventory.php')) {
                    document.getElementById('inv_menu').getElementsByClassName('inv_btn_close show_hint')[0].click();
                }
                let target = "_blank";
                let btn = 0;
                switch (e.button) {
                    case RMB:
                        return;
                    case MMB:
                        btn = MMB;
                        break;
                    case LMB:
                    default:
                        if (!e.ctrlKey) {
                            target = "_self"
                        }
                        btn = LMB;
                        break;
                }

                let itemAuctionLink = await GetAuctionLink(link);
                if (location.href.includes('/inventory.php')) {
                    document.getElementById('inv_menu').getElementsByClassName('inv_btn_close show_hint')[0].click();
                }

                popupBlockerChecker.check(window.open(itemAuctionLink, target));
                window.focus();
            },

            onmouseup: function(e) {

                if (location.href.includes('/inventory.php')) {
                    document.getElementById('inv_menu').getElementsByClassName('inv_btn_close show_hint')[0].click();
                }
            }
        });

    let elemLink = document.createElement("a");
    elemLink.innerHTML = `<img hint=\"Найти на рынке\" title=\"Найти на рынке\" src=\"https://dcdn.heroeswm.ru/i/shop_images/magnifying_glass_icon_32.png\" hwm_hint_added=\"1\" class=\"inv_item_select_img\">`;



    searchDiv.appendChild(elemLink);
    return searchDiv;
}

function AddNewLotHrefs() {
    const local_arts = arts;
    const sellableArts = local_arts.filter(art => {
        return art.transfer_ok && art.transfer_ok === 1 && art.durability1 > 0
    });

    let inventory = Array.from(document.getElementById("inventory_block").childNodes)

    if (local_arts) {
        for (let art of local_arts) {
            const elem = inventory.filter(o => o.attributes.art_idx && o.attributes.art_idx.value === local_arts.indexOf(art).toString())[0]
            if (elem) {
                if (Array.from(elem.childNodes).filter(e => e.innerHTML.includes("Найти на рынке")).length === 0) {
                    elem.appendChild(createSearchButton(`/art_info.php?id=${art.art_id.split('@')[0]}`));
                }
            }
        }
    }

    if (sellableArts) {
        for (let art of sellableArts) {
            const elem = inventory.filter(o => o.attributes.art_idx && o.attributes.art_idx.value === local_arts.indexOf(art).toString())[0]
            if (elem) {
                if (Array.from(elem.childNodes).filter(e => e.innerHTML.includes("Продать")).length === 0) {
                    let artSellId = art.id;
                    let sellDiv = Object.assign(
                        document.createElement("div"), {
                            id: `inv_sell_auction`,
                            className: `inv_item_select`,
                            innerHTML: `<a title=\"Продать\" href=\"/auction_new_lot.php?art=${art.art_id}@${artSellId}&signature=${encodeURIComponent(art.name)} ${encodeURIComponent(art.durability1+"/"+art.durability2)}\">` +
                            `<img hint=\"Продать\" src=\"https://dcdn2.heroeswm.ru/i/r/48/gold.png\" hwm_hint_added=\"1\" class=\"inv_item_select_img\"></a>`
                            });
                    elem.appendChild(sellDiv)
                }
            }
        }
    }
    var inventoryDiv = document.getElementById("inventory_block");
    if (inventoryDiv && document.getElementById("hwm_optionsHWM_Auctioneer") === null) {
        let LDiv = document.createElement('div');
        LDiv.className=`settingsBtn`;
        LDiv.innerHTML = `<div id="hwm_options${str_script_name}" style="position: absolute;right: 2em;bottom: 1em;text-decoration: underline;cursor: pointer;font-weight: bold;font-size: 10px;">Настройки ${str_script_name}</div>`;
        inventoryDiv.appendChild(LDiv);
        addEvent($(`#hwm_options${str_script_name}`), 'click', open_setting_form);
    }
}

function PriceChanged() {
    if ((~~document.forms.anl_form_ok.price.value) < 0) {
        document.forms.anl_form_ok.price.value = 0
    }
    document.forms.anl_form_ok.price.value =document.forms.anl_form_ok.price.value.trim().replace(/[^\d]/g, '');
    if(document.forms.anl_form_ok.price.value==="") document.forms.anl_form_ok.price.value =0;
    document.getElementById("profit").innerText = `Вы получите: ${Math.round(document.forms.anl_form_ok.price.value*0.99)}`;
    anl_check_button();
}

function SavePrice() {
    var itemSelector = document.forms.anl_form_ok.item;
    var LPrice = parseInt(document.forms.anl_form_ok.price.value);
    var LName = itemSelector.options[itemSelector.selectedIndex].text.split(' (')[0].split(' [i]')[0];
    if (LName != '') {
        let LInfo = document.createTextNode('');

        LInfo = $('#save_price_info');
        if (!LInfo) {
            LInfo = document.createElement('b');
            LInfo.id = 'save_price_info';
            $('#id_save_price').parentNode.appendChild(LInfo);
        }
        if (LPrice && (LPrice != 0) && (LPrice != '')) {
            GM_setValue(LName, LPrice);
            LInfo.innerHTML = 'Сохранена цена ' + LPrice + ' для артефакта "' + LName + '"';
        } else {
            GM_deleteValue(LName);
            LInfo.innerHTML = 'Удалена цена для артефакта "' + LName + '"';
        }
    }
}

function LoadPrice() {
    var itemSelector = document.forms.anl_form_ok.item;
    var priceInputBox = document.forms.anl_form_ok.price;
    var LName = itemSelector.options[itemSelector.selectedIndex].text.split(' (')[0].split(' [i]')[0];
    priceInputBox.value = GM_getValue(LName, '0');
    priceInputBox.dispatchEvent(new Event('change'));
}



function open_setting_form() {
    show_settings_base('<input type="checkbox" id="id_one_click" title="Выставлять лот в один клик"> Выставлять лот в один клик');

    var check_one_click = $('#id_one_click');
    check_one_click.checked = GM_getValue('one_click', 0) == 1 ? 'checked' : '';
    check_one_click.addEventListener("click", function() {
        setCheck('one_click');
    });

}

function ChangePrice(value) {
    var parsed = parseInt(document.forms.anl_form_ok.price.value)

    document.forms.anl_form_ok.price.value = isNaN(parsed) ? 0 + parseInt(value) : parsed + parseInt(value);
    document.forms.anl_form_ok.price.dispatchEvent(new Event('change'));
}

function InitNewLotForm() {
    console.log(`Инициализируем форму продажи.`);
    if (document.forms.anl_form_ok.sign) {
        if (GM_getValue('one_click', 0) == 1) {
            document.forms.anl_form_ok.submit();
        }
    } else {

        const priceInputBox = document.forms.anl_form_ok.price;

        document.forms.anl_form_ok.item.onchange = LoadPrice;
        const params = new URLSearchParams(window.location.search);

        let art = decodeURIComponent(params.get("art"));
        let signature = decodeURIComponent(params.get("signature"));

        if (art != null) {

            let foundArray = Array.from(document.forms.anl_form_ok.item.options).filter(elem=>elem.value===art);
            let found = foundArray.length>0;
            let index;
            if(found){
                const item = foundArray.pop();
                index = Array.from(document.forms.anl_form_ok.item.options).indexOf(item);
            }
            else{
                foundArray = Array.from(document.forms.anl_form_ok.item.options).filter(elem=>elem.innerText.includes(`${signature}`));
                found = foundArray.length>0;

                if(found){
                    index = Array.from(document.forms.anl_form_ok.item.options).indexOf(foundArray.pop());
                }
                else{
                    document.forms.anl_form_ok.item.options.add(new Option(`${signature}`, art));
                    index = document.forms.anl_form_ok.item.options.length - 1;
                }

            }

            //Межбраузерный костыль
            document.forms.anl_form_ok.item.options[document.forms.anl_form_ok.item.options.selectedIndex].selected = false;
            document.forms.anl_form_ok.item.options.selectedIndex = index;
            document.forms.anl_form_ok.item.options[index].selected = true;

            this.anl_check_selection();
            if(this.value){
                this.anl_check_count();
            }

        }
        let element = params.get("element");
        if (element) {
            let options = Array.from(document.forms.anl_form_ok.item.options);
            let searchedOption = options.filter(e => e.value === element).pop();
            let index = options.indexOf(searchedOption);
            document.forms.anl_form_ok.item.options[document.forms.anl_form_ok.item.options.selectedIndex].selected = false;
            document.forms.anl_form_ok.item.selectedIndex = index;
            document.forms.anl_form_ok.item.options[index].selected = true;
        }


        document.forms.anl_form_ok.duration.selectedIndex = 3;

        const currentMinPriceButton = Object.assign(
            document.createElement('input'), {
                type: 'button',
                style: 'margin-right: 10px; width:180px',
                id: 'id_search_min',
                className:` home_button2 btn_hover2`,
                value: 'Обновить мин. цену.',
                onclick: async function(e) {

                    const isResource = ["gem","crystal","sulphur","wood", "mercury", "ore"].some(r=> document.forms.anl_form_ok.item.selectedOptions[0].value===r);
                    if(isResource){
                        currentMinPrice.innerHTML ="Недоступно для базовых ресурсов.";
                        return;
                    }
                    const isElement =document.forms.anl_form_ok.item.selectedOptions[0].value.includes("EL_");
                    const isArtPart =document.forms.anl_form_ok.item.selectedOptions[0].value.includes("ARTPART_");
                    let itemLink = ``;

                    if(isElement) itemLink =  `/auction.php?cat=elements&sort=0&art_type=${MercenaryElements[Object.keys(MercenaryElements).filter(e=>MercenaryElements[e].id===document.forms.anl_form_ok.item.selectedOptions[0].value)].art_type}`;

                    if(isArtPart)
                        itemLink = isArtPart?`/auction.php?cat=part&sort=0&art_type=${"part"+document.forms.anl_form_ok.item.selectedOptions[0].value.split("ARTPART")[1]}`:itemLink;
                    if(!isArtPart && !isElement)
                        itemLink=await GetAuctionLink(`/art_info.php?id=${document.forms.anl_form_ok.item.selectedOptions[0].value.split('@')[0]}`);
                    const minPrices = await GetMinPrice(itemLink);
                    let count = 0;
                    console.log(minPrices)
                    if(minPrices.length===0){
                        currentMinPrice.innerHTML ="Ни один лот не был выставлен.";
                    }
                    else{
                        if(minPrices.length<8){
                            count = minPrices.length
                        }
                        else{
                            count = 8
                        }
                        let minpriceStr = "";
                        if(isElement||isArtPart)
                        {
                            for(let i =0;i<count;i++){
                                if(minPrices[i].price){
                                    minpriceStr+=(`${minPrices[i].price} <img src="https://dcdn2.heroeswm.ru/i/r/48/gold.png" title="Золото" alt="" class="rs" width="24" height="24" border="0">`);}
                            }
                            currentMinPrice.innerHTML = minpriceStr ;
                        }else{

                            for(let i =0;i<count;i++){
                                if(minPrices[i].price){
                                    minpriceStr+=(`${minPrices[i].price}(${minPrices[i].durability}) <img src="https://dcdn2.heroeswm.ru/i/r/48/gold.png" title="Золото" alt="" class="rs" width="24" height="24" border="0">`);}

                            }
                            currentMinPrice.innerHTML = minpriceStr ;
                        }
                    }
                }
            });

        const minPriceWarn = document.createTextNode("Цена проверяется для предмета с ПОЛНОЙ прочностью и только с видом продажи 'ПРОДАТЬ СРАЗУ'.")

        const currentMinPrice = Object.assign(
            document.createElement("div"), {
                innerHTML: `Не обновлено <img src="https://dcdn2.heroeswm.ru/i/r/48/gold.png?v=3.23de65" title="Золото" alt="" class="rs" width="24" height="24" border="0">`,
                className: 'minPrice',
            });

        document.getElementsByName('atype')[0].after(currentMinPrice);
        document.getElementsByName('atype')[0].after(minPriceWarn);
        document.getElementsByName('atype')[0].after(currentMinPriceButton);
        document.getElementsByName('atype')[0].after(document.createElement("br"));
        document.getElementsByName('atype')[0].after(document.createElement("br"));

        const profit = Object.assign(
            document.createElement("div"), {
                id: 'profit',
            });

        priceInputBox.onchange = PriceChanged;
        priceInputBox.onkeyup = PriceChanged;
        priceInputBox.onpaste = PriceChanged;
        priceInputBox.after(profit);
        LoadPrice();




        const posKeyboardContainer = document.createElement("div");
        const negKeyboardContainer = document.createElement("div");

        const btnValuesPos = [1, 10, 100, 1000];
        const btnValuesNeg = [-1, -10, -100, -1000];
        for (const value of btnValuesPos) {
            posKeyboardContainer.appendChild(Object.assign(
                document.createElement("input"), {
                    type: `button`,
                    className:`keyboard home_button2 btn_hover2`,
                    value: `${value>0?'+':''}${value}`,
                    onclick: () => ChangePrice(value),
                }));

        }
        for (const value of btnValuesNeg) {
            negKeyboardContainer.appendChild(Object.assign(
                document.createElement("input"), {
                    type: `button`,
                    className:`keyboard home_button2 btn_hover2`,
                    value: `${value>0?'+':''}${value}`,
                    onclick: () => ChangePrice(value),
                }));

        }
        priceInputBox.parentNode.insertBefore(posKeyboardContainer, priceInputBox.nextSibling);
        priceInputBox.parentNode.insertBefore(negKeyboardContainer, priceInputBox.nextSibling);
        let LNewDiv = document.createElement('b');
        LNewDiv.innerHTML = '<input type="button" style="width:95; margin-left:41px;" id="id_save_price" class="home_button2 btn_hover2" value="Сохранить">';
        priceInputBox.parentNode.insertBefore(LNewDiv, priceInputBox.nextSibling);
        addEvent($('#id_save_price'), "click", SavePrice);
        const settingsBtn = Object.assign(
            document.createElement("div"), {
                id: `hwm_options${str_script_name}`,
                style: "display: inline;text-decoration: underline;cursor: pointer;font-weight: bold;font-size: 10px;",
                innerText: `Настройки ${str_script_name}`,
                onclick: open_setting_form
            });

        document.forms.anl_form_ok.appendChild(settingsBtn);
        document.forms.anl_form_ok.insertBefore(document.createElement("br"), settingsBtn);
        document.forms.anl_form_ok.insertBefore(document.createElement("br"), settingsBtn);
        settingsBtn.after(document.createElement("br"));
        settingsBtn.after(document.createElement("br"));



        this.anl_check_selection();
        if(this.value)
            this.anl_check_count();

        document.getElementById('anl_count').defaultValue = "1";
        document.forms.anl_form_ok.anl_count.defaultValue = "1";
        document.getElementById('anl_count').value = "1";
        document.forms.anl_form_ok.anl_count.value = "1";
        this.anl_check_button()
    }
}

var popupBlockerChecker = {
    check: function(popup_window) {
        var scope = this;
        if (popup_window) {
            if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                setTimeout(function() {
                    scope.is_popup_blocked(scope, popup_window);
                }, 200);
            } else {
                popup_window.onload = function() {
                    scope.is_popup_blocked(scope, popup_window);
                };
            }
        } else {
            scope.displayError();
        }
    },
    is_popup_blocked: function(scope, popup_window) {
        if ((popup_window.innerHeight > 0) == false) {
            scope.displayError();
        }
    },
    displayError: function() {
        if (debugLogEnabled) {
            console.log("Включён блокировщик всплывающих окон.");
        }
        swal("Включён блокировщик всплывающих окон. Поиск предмета на рынке невозможен.");
    }
};

function CreateSellElements() {
    let isOwnPage = getCookie("pl_id") === location.search.split('?id=').slice(1).pop()
    if (isOwnPage) {
        const tables = Array.from(document.getElementsByClassName('wb'));
        const elementsTable = tables[tables.indexOf(tables.filter(e=>e.innerText=="Ресурсы")[0])+3];
        const nodes = Array.from(elementsTable.childNodes);
        const items = nodes.filter(i=>{return (i instanceof HTMLDivElement) && i.hasAttribute("ismercenary")&&i.getAttribute("ismercenary")==="true"});
        console.log(items)
        //Вытаскиваем все доступные элементы и превращаем в объекты.
        for (let item of items) {
            let name = item.getAttribute("name").toLowerCase();
            console.log(name);
            let ItemExists =window.MercenaryElements[name]!=='undefined'
            console.log(ItemExists)
            if (ItemExists) {
                item.classList.add("sellable_element");
                let sellDiv = document.createElement("div");
                sellDiv.id = "inv_sell_auction";
                sellDiv.classList.add("inv_item_select")
                sellDiv.innerHTML = `<a title="Продать" href=\"/auction_new_lot.php?element=${window.MercenaryElements[name].id}\">` +
                    `<img hint="Продать"  src="https://dcdn2.heroeswm.ru/i/r/48/gold.png" hwm_hint_added="1" class="inv_item_select_img" style="width: 14px;">`;
                item.appendChild(sellDiv)
            }


        }
    }
}

function Init() {
    try {
        switch (true) {
            case location.href.includes('/inventory.php'):
                setInterval(() => AddNewLotHrefs(), 500);
                break;

            case location.href.includes('/auction_new_lot.php'):
                InitNewLotForm();
                break;

            case location.href.includes('/pl_info.php'):
                CreateSellElements();
            case location.href.includes('/object-info.php'):
            case location.href.includes('/house_info.php'):
                CreateSearchButtons();
                break;
            case location.href.includes('/transfer.php'):
                var LSps = new URLSearchParams(location.search).get('thanks');
                if (LSps != null) {
                    document.getElementsByName("nick")[0].value = 'Tags';
                    document.getElementsByName("gold")[0].value = '1000';
                    document.getElementsByName("desc")[0].value = LSps;
                }
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error)
    }
}

Init();


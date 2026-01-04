// ==UserScript==
// @name         MFC Buy Links
// @namespace    https://myfigurecollection.net/profile/tharglet
// @version      2.2
// @description  Adds a box for direct links to shop's searches
// @author       Tharglet
// @license      CC BY-NC-SA 4.0
// @match        https://myfigurecollection.net/item/*
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/405729/MFC%20Buy%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/405729/MFC%20Buy%20Links.meta.js
// ==/UserScript==

////////LICENCE////////
//This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/.
//Please credit 'Tharglet' for the original code, and provide a link to my MFC profile: https://myfigurecollection.net/profile/tharglet
///////////////////////

//Polyfill for GM_addStyle for Greasemonkey...
if(typeof GM_addStyle == 'undefined') {
    GM_addStyle = (aCss) => {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

GM_addStyle(`
h4 {
font-style: italic;
padding-bottom: 5px;
padding-top: 10px;
}
.buylinks__row {
display: flex;
}
.buylinks__column {
flex: 1;
padding-bottom: 4px;
}
.buylinks__settings__setting-title {
display: block;
float: left;
clear: both;
width: 150px;
padding-bottom: 4px;
}
.buylinks__settings__setting-group {
display: block;
float: left;
}
.buylinks__shop-title {
font-size: 1.2em;
font-weight: normal;
padding-left:0;
padding-bottom: 6px;
margin-bottom: 6px;
}
.buylinks__label {
padding-left: 4px;
}
.buylinks__termselector label {
padding-right: 12px;
}
.buylinks__button[aria-disabled=true] {
color: lightgray;
}
.buylinks--hidden {
display: none;
}
.buylinks__savebutton {
margin-top: 8px;
}
`);

const shopTypeLookup = {
    shop: 'Shop',
    info: 'Information',
    proxy: 'Proxy',
};

(async () => {
    'use strict';
    let targetBlank = await GM.getValue('targetBlank', true);
    let targetString = targetBlank ? "target='_blank'" : '';
    const savedSearchSettings = await GM.getValue('searchSettings', null);
    let searchSettings;
    if(savedSearchSettings === null) {
        await GM.setValue('searchSettings', '{"origins": "first", "manufacturers": "first", "title": "yes", "characters": "first"}');
        searchSettings = {
            origins: 'first',
            manufacturers: 'first',
            title: 'yes',
            characters: 'first',
        };
    } else {
        searchSettings = JSON.parse(savedSearchSettings);
    }
    let shopConfig = await GM.getValue('shopConfig', null);
    let shops = [{
        key: 'mandarake',
        display: 'Mandarake',
        type: 'shop',
        searches: {
            en: 'https://order.mandarake.co.jp/order/listPage/list?keyword=%s&lang=en',
            ja: 'https://order.mandarake.co.jp/order/listPage/list?keyword=%s&lang=en',
        }

    }, {
        key: 'amiami',
        display: 'AmiAmi',
        type: 'shop',
        searches: {
            en: 'https://www.amiami.com/eng/search/list/?s_keywords=%s',
            jan: 'https://www.amiami.com/eng/search/list/?s_keywords=%s',
        }

    }, {
        key: 'surujp',
        display: 'Suruga-ya.jp',
        type: 'shop',
        searches: {
            ja: 'https://www.suruga-ya.jp/search?search_word=%s',
            jan: 'https://www.suruga-ya.jp/search?gtin=%s',
        }
    }, {
        key: 'surucom',
        display: 'Suruga-ya.com',
        type: 'shop',
        searches: {
            en: 'https://www.suruga-ya.com/en/products?keyword=%s',
        }
    }, {
        key: 'amazonjp',
        display: 'Amazon.co.jp',
        type: 'shop',
        searches: {
            ja: 'https://www.amazon.co.jp/s?k=%s',
            jan: 'https://www.amazon.co.jp/s?k=%s',
        }
    }, {
        key: 'yaj',
        display: 'Yahoo! Auctions Japan',
        type: 'shop',
        searches: {
            ja: 'https://auctions.yahoo.co.jp/search/search?p=%s',
        }
    }, {
        key: 'milestone',
        display: 'Milestone',
        type: 'info',
        searches: {
            en: 'https://b2b.mile-stone.jp/en/search/0/keyword=%s/',
            jan: 'https://b2b.mile-stone.jp/en/search/0/jan=%s/',
        }

    }, {
        key: 'hpoi',
        display: 'Hpoi',
        type: 'info',
        searches: {
            ja: 'https://www.hpoi.net/search?keyword=%s',
            jan: 'https://www.hpoi.net/search?keyword=%s',
        }
    }, {
        key: 'buyee',
        display: 'Buyee',
        type: 'proxy',
        searches: {
            ja: 'https://buyee.jp/item/search/query/%s',
        }
    }, {
        key: 'fromjapan',
        display: 'From Japan',
        type: 'proxy',
        searches: {
            ja: 'https://www.fromjapan.co.jp/en/item/search/%s/',
        }
    }, {
        key: 'zenmarket',
        display: 'Zenmarket',
        type: 'proxy',
        searches: {
            ja: 'https://zenmarket.jp/en/marketplace.aspx?q=%s',
        }
    }, {
        key: 'neokyo',
        display: 'Neokyo',
        type: 'proxy',
        searches: {
            ja: 'https://neokyo.com/en/search-results?keyword=%s',
        }
    }];
    //functions
    const renderShopBlock = () => {
        let shopGrid = {};
        shops.map((shop) => {
            if(!shopConfig[shop.key]) {
                shopConfig[shop.key] = {
                    display: 'true'
                };
                GM.setValue('shopConfig', JSON.stringify(shopConfig));
            }
            if(shopConfig[shop.key].display === 'true') {
                let shopToAdd = '';
                shopToAdd += `<div class="buylinks__row"><div class="buylinks__column">${shop.display}</div><div class="buylinks__column">`;
                shopToAdd += shop.searches.ja ? `<a href='#' id='search_${shop.key}_ja' class="buylinks__button buylinks__button-ja" data-for="${shop.key}" ${targetString}>Japanese</a>` : '<div>&nbsp;</div>';
                shopToAdd += '</div><div class="buylinks__column">';
                shopToAdd += shop.searches.en ? `<a href='#' id='search_${shop.key}_en' class="buylinks__button buylinks__button-en" data-for="${shop.key}" ${targetString}>English</a>` : '<div>&nbsp;</div>';
                shopToAdd += '</div><div class="buylinks__column">';
                shopToAdd += shop.searches.jan && jan ? `<a href='${shop.searches.jan.replace('%s', jan)}' class="buylinks__button buylinks__button-jan" data-for="${shop.key}" ${targetString}>JAN</a>` : '<div>&nbsp;</div>';
                shopToAdd += '</div></div>';
                if(!shopGrid[shop.type]) {
                    shopGrid[shop.type] = shopToAdd;
                } else {
                    shopGrid[shop.type] += shopToAdd;
                }
            }
        });
        let shopHtml = '';
        for(let shopType in shopGrid) {
            shopHtml += `<h3 class="buylinks__shop-title">${shopTypeLookup[shopType]}</h3>${shopGrid[shopType]}`
        }
        if(shopHtml.length > 0) {
            return shopHtml;
        }
        return '<h3 class="buylinks__shop-title">No sites enabled</h3><div>Please use the settings button in the top-right of this block to enable one or more sites</div>'
    }

    const generateSearchList = (fields, fieldName) => {
        if(fields.length > 0) {
            const fieldNameLower = fieldName.toLowerCase();
            let seachListHtml = '';
            seachListHtml += `<div class="buylinks__termselector">${fieldName}: `;
            fields.map((field, idx) => {
                let checked = '';
                if(idx === 0 && (searchSettings[fieldNameLower] === 'first' || searchSettings[fieldNameLower] === 'all')) {
                    checked = "checked='checked'";
                } else if(idx > 0 && searchSettings[fieldNameLower] === 'all') {
                    checked = "checked='checked'";
                }
                seachListHtml += `<input id='${fieldNameLower}_${idx}' type='checkbox' ${checked} class='buylinks__termselector__checkbox' data-en='${field.en.replace("'", '&apos;')}' data-ja='${field.ja.replace("'", '&apos;')}'/>
                <label class='buylinks__label' for='${fieldNameLower}_${idx}'>${field.en}</label>`
            });
            seachListHtml += '</div>';
            return seachListHtml;
        }
        return '';
    }

    const updateSearch = () => {
        const checkedBoxes = document.querySelectorAll('.buylinks__termselector__checkbox:checked');
        if(checkedBoxes.length > 0) {
            document.querySelectorAll('.buylinks__button-en').forEach(ele => {
                ele.setAttribute('aria-disabled', false);
            });
            document.querySelectorAll('.buylinks__button-ja').forEach(ele => {
                ele.setAttribute('aria-disabled', false);
            });
            let searchJa = '';
            let searchEn = '';
            checkedBoxes.forEach(box => {
                if(searchEn.length !== 0) {
                    searchEn += '%20';
                }
                searchEn += encodeURIComponent(box.attributes['data-en'].value);
                if(searchJa.length !== 0) {
                    searchJa += '%20';
                }
                searchJa += encodeURIComponent(box.attributes['data-ja'].value);
            });
            shops.forEach(shop => {
                if(shopConfig[shop.key].display === 'true') {
                    if(shop.searches.en) {
                        const searchAnchorEn = document.getElementById(`search_${shop.key}_en`);
                        searchAnchorEn.setAttribute('href', shop.searches.en.replace('%s', searchEn));
                    }
                    if(shop.searches.ja) {
                        const searchAnchorJa = document.getElementById(`search_${shop.key}_ja`);
                        searchAnchorJa.setAttribute('href', shop.searches.ja.replace('%s', searchJa));
                    }
                }
            });
        } else {
            document.querySelectorAll('.buylinks__button-en').forEach(ele => {
                ele.setAttribute('href', '');
                ele.setAttribute('aria-disabled', true);
            });
            document.querySelectorAll('.buylinks__button-ja').forEach(ele => {
                ele.setAttribute('href', '');
                ele.setAttribute('aria-disabled', true);
            });
        }
    }

    const saveSettings = async () => {
        searchSettings = {
            origins: document.querySelector('input[name="origin_default"]:checked').value || 'first',
            manufacturers: document.querySelector('input[name="mfr_default"]:checked').value || 'first',
            title: document.querySelector('input[name="title_default"]:checked').value || 'yes',
            characters: document.querySelector('input[name="char_default"]:checked').value || 'first',
        };
        await GM.setValue('searchSettings', JSON.stringify(searchSettings));
        await Promise.all(shops.map((shop) => {
            const shopVisibilityElement = document.querySelector(`input[name='${shop.key}_visibility']:checked`);
            if(shopVisibilityElement !== null) {
                shopConfig[shop.key].display = shopVisibilityElement.value
            }
        }));
        await GM.setValue('shopConfig', JSON.stringify(shopConfig));
        const targetSettingCheckboxValue = document.querySelector(`input[name='targetblank']:checked`).value;
        if(targetSettingCheckboxValue === 'no') {
            targetBlank = false;
            targetString = '';
            await GM.setValue('targetBlank', false);
        } else {
            targetBlank = true;
            targetString = "target='_blank'";
            await GM.setValue('targetBlank', true);
        }
        //refresh shop area
        document.getElementById("buylinks-shoparea").innerHTML = renderShopBlock();
        updateSearch();
        //Show "saved!"
        document.getElementById('buylinks-savesettings-text').classList.remove('buylinks--hidden');
        setTimeout(() => { document.getElementById('buylinks-savesettings-text').classList.add('buylinks--hidden'); }, 3000);

    }
    //Code!
    shops.sort(function(a, b) {
        var textA = a.key
        var textB = b.key;
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    //Prep shopConfig var
    if(shopConfig) {
        shopConfig = JSON.parse(shopConfig);
    } else {
        shopConfig = {}
    }
    //Find item properties
    let jan = null;
    let productIdElement = document.querySelector('meta[itemprop="productID"]');
    if(productIdElement) {
        let productId = productIdElement.attributes.content.value;
        if(productId.startsWith('jan:')) {
            jan = productId.substring(4);
        }
    }
    //prep selector block
    let origins = [];
    let chars = [];
    let title = null;
    let mfrs = [];
    const figureData = Array.from(document.querySelectorAll('.split-right.righter .form-label'));
    let origin = figureData.find(el => el.textContent === 'Origin');
    if(origin) {
        Array.from(origin.parentElement.querySelectorAll("span")).map((ele) => {
            if(ele.innerText !== 'Original Character') {
                origins.push({
                    en: ele.innerText,
                    ja: ele.attributes.switch.value
                });
            }
        });
    }
    let character = figureData.find(el => el.textContent.startsWith('Character'));
    if(character) {
        Array.from(character.parentElement.querySelectorAll("span")).map((ele) => {
            chars.push({
                en: ele.innerText,
                ja: ele.attributes.switch.value
            });
        });
    }
    let titleFind = figureData.find(el => el.textContent.startsWith('Title'));
    if(titleFind) {
        const titleData = titleFind.parentElement.querySelector('a');
        title = {
            en: titleData.innerText,
            ja: titleData.attributes.switch.value
        };
    }
    let manufacturerFind = Array.from(document.querySelectorAll('.split-right.righter .form-input small'))
    .filter(el => el.textContent === 'As Manufacturer');
    if(manufacturerFind) {
        manufacturerFind.map(ele => {
            const mfr = ele.parentElement.querySelector('span');
            mfrs.push({
                en: mfr.innerText,
                ja: mfr.attributes.switch.value
            });
        });
    }
    let searchSelectorHtml = '<h3 class="buylinks__shop-title">Search options</h3><div>';
    searchSelectorHtml += generateSearchList(origins, 'Origins');
    searchSelectorHtml += generateSearchList(chars, 'Characters');
    searchSelectorHtml += generateSearchList(mfrs, 'Manufacturers');
    if(title) {
        searchSelectorHtml += `<div class="buylinks__termselector">Title:
        <input id='title_1' type='checkbox' class='buylinks__termselector__checkbox' ${searchSettings.title === 'yes' ? "checked='checked'" : ''} data-en='${title.en.replace("'", '&apos;')}' data-ja='${title.ja.replace("'", '&apos;')}''/>
        <label class='buylinks__label' for='title_1'>${title.en}</label></div>`;
    }
    searchSelectorHtml += '</div>';
    //prep buy block
    let shopHtml = renderShopBlock();
    let shopSettingsHtml = '';
    shops.forEach((shop) => {
        shopSettingsHtml += `<div class='buylinks__settings__setting-title'>${shop.display}:</div>
        <div class='buylinks__settings__setting-group'>
<input id='${shop.key}_visibility_no' name='${shop.key}_visibility' type='radio' value='false' ${shopConfig[shop.key].display === 'true'? '' : "checked='checked'"}/><label class='buylinks__label' for='${shop.key}_visibility_no'>No</label>
<input id='${shop.key}_visibility_yes' name='${shop.key}_visibility' type='radio' value='true' ${shopConfig[shop.key].display === 'true'? "checked='checked'" : ''}/><label class='buylinks__label' for='${shop.key}_visibility_yes'>Yes</label>
        </div>`
    });
    shopSettingsHtml += '<div style="clear: both;"></div>';
    const buyBox = `<section><h2>Buy!<nav class="actions"><a href="#" id="buylinks-settings-button" title="Settings"><span class="tiny-icon-only icon-sliders"></a></nav></h2>
<div id='buylinks-settings' class='form buylinks--hidden'>
<h3 class="buylinks__shop-title">General settings</h3>
<div class='buylinks__settings__setting-title'>Target new window:</div>
<div class='buylinks__settings__setting-group'>
<input id='targetblank_no' name='targetblank' type='radio' value='no' ${targetBlank ? '' : "checked='checked'"}/><label class='buylinks__label' for='targetblank_no'>No</label>
<input id='targetblank_yes' name='targetblank' type='radio' value='yes' ${targetBlank ? "checked='checked'" : ''}/><label class='buylinks__label' for='targetblank_yes'>Yes</label>
</div>
<div style="clear: both;"></div>
<h3 class="buylinks__shop-title">Default checkboxes</h3>
<div class='buylinks__settings__setting-title'>Origins:</div>
<div class='buylinks__settings__setting-group'>
<input id='origin_default_none' name='origin_default' type='radio' value='none' ${searchSettings.origins === 'none' ? "checked='checked'" : ''}/><label class='buylinks__label' for='origin_default_none'>None</label>
<input id='origin_default_first' name='origin_default' type='radio' value='first' ${searchSettings.origins === 'first' ? "checked='checked'" : ''}/><label class='buylinks__label' for='origin_default_first'>First</label>
<input id='origin_default_all' name='origin_default' type='radio' value='all' ${searchSettings.origins === 'all' ? "checked='checked'" : ''}/><label class='buylinks__label' for='origin_default_all'>All</label>
</div>
<div class='buylinks__settings__setting-title'>Characters:</div>
<div class='buylinks__settings__setting-group'>
<input id='char_default_none' name='char_default' type='radio' value='none' ${searchSettings.characters === 'none' ? "checked='checked'" : ''}/><label class='buylinks__label' for='char_default_none'>None</label>
<input id='char_default_first' name='char_default' type='radio' value='first' ${searchSettings.characters === 'first' ? "checked='checked'" : ''}/><label class='buylinks__label' for='char_default_first'>First</label>
<input id='char_default_all' name='char_default' type='radio' value='all' ${searchSettings.characters === 'all' ? "checked='checked'" : ''}/><label class='buylinks__label' for='char_default_all'>All</label>
</div>
<div class='buylinks__settings__setting-title'>Manufacturers:</div>
<div class='buylinks__settings__setting-group'>
<input id='mfr_default_none' name='mfr_default' type='radio' value='none' ${searchSettings.manufacturers === 'none' ? "checked='checked'" : ''}/><label class='buylinks__label' for='mfr_default_none'>None</label>
<input id='mfr_default_first' name='mfr_default' type='radio' value='first' ${searchSettings.manufacturers === 'first' ? "checked='checked'" : ''}/><label class='buylinks__label' for='mfr_default_first'>First</label>
<input id='mfr_default_all' name='mfr_default' type='radio' value='all' ${searchSettings.manufacturers === 'all' ? "checked='checked'" : ''}/><label class='buylinks__label' for='mfr_default_all'>All</label>
</div>
<div class='buylinks__settings__setting-title'>Title:</div>
<div class='buylinks__settings__setting-group'>
<input id='title_default_no' name='title_default' type='radio' value='no' ${searchSettings.title === 'no' ? "checked='checked'" : ''}/><label class='buylinks__label' for='title_default_no'>No</label>
<input id='title_default_yes' name='title_default' type='radio' value='yes' ${searchSettings.title === 'yes' ? "checked='checked'" : ''}/><label class='buylinks__label' for='title_default_yes'>Yes</label>
</div>
<div style="clear: both;"></div>
<h3 class="buylinks__shop-title">Shop visibility</h3>
${shopSettingsHtml}
<button id='buylinks-save-button' class='buylinks__savebutton'>Save</button>
<div id='buylinks-savesettings-text' class='buylinks--hidden'>Saved!</div>
</div>
<div class='form'>
${searchSelectorHtml}
<div id='buylinks-shoparea'>${shopHtml}</div>
</div>
</section>`;
    let template = document.createElement('template');
    template.innerHTML = buyBox;
    document.querySelector("#wide .wrapper section").after(template.content.firstChild);
    let checkboxes = document.getElementsByClassName('buylinks__termselector__checkbox');
    Array.from(checkboxes).forEach((element) => {
        element.addEventListener('click', updateSearch);
    });
    document.body.addEventListener('click', (event) => {
        if (event.target.nodeName == 'A' && event.target.getAttribute('aria-disabled') == 'true') {
            event.preventDefault();
        }
    });
    document.getElementById('buylinks-settings-button').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('buylinks-settings').classList.toggle("buylinks--hidden");
    });
    document.getElementById('buylinks-save-button').addEventListener('click', (event) => {
        saveSettings();
    });
    updateSearch();
})();
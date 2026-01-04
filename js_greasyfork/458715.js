 // ==UserScript==
 // @name         Dodatki Allegro | Nowa karta | Tłumaczenie
 // @namespace    http://butosklep.pl/panel/
 // @version      0.9.1
 // @description  Tłumaczenie
 // @author       Marcin
 // @match        https://butosklep.pl/panel/product.php*
 // @match        https://butosklep.iai-shop.com/product.php*
 // @icon         https://butosklep.pl/gfx/pol/favicon.ico
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458715/Dodatki%20Allegro%20%7C%20Nowa%20karta%20%7C%20T%C5%82umaczenie.user.js
// @updateURL https://update.greasyfork.org/scripts/458715/Dodatki%20Allegro%20%7C%20Nowa%20karta%20%7C%20T%C5%82umaczenie.meta.js
 // ==/UserScript==      
 
const LANG_ARRAY = {
    pol_0: "Polish",
    cze_0: "Czech",
    eng_0: "English",
    ger_0: "German",
    lit_0: "Lithuanian",
    rum_0: "Romanian",
    slo_0: "Slovak",
};
 
const COPY_ARRAY = ["pol_8", "ger_8"];
 
function buttonState() {
  // Get the current URL
  const url = window.location.href;
 
  // Select the dropbtn and noHover elements
  const dropbtnEls = document.querySelectorAll(".dropbtn");
  const noHoverEls = document.querySelectorAll(".noHover");
 
  // Disable dropbtns and remove noHover class from elements if URL ends with "#descriptions"
  if (url.endsWith("#descriptions")) {
    dropbtnEls.forEach(el => el.disabled = false);
    noHoverEls.forEach(el => el.classList.remove("noHover"));
  } 
  // Enable dropbtns and add noHover class to elements if URL doesn't end with "#descriptions"
  else {
    dropbtnEls.forEach(el => el.disabled = true);
    document.querySelectorAll('.dropdown:has(button.dropbtn)').forEach(el => el.classList.add("noHover"));
  }
}
 
function checkCategory() {
  const category = document.querySelector("#select2-sizes-container").textContent;
  return category.startsWith('Obuwie');
}
 
function transformDescription(text) {
  let result = text;
  const bIndex = text.indexOf("<b>");
  if (bIndex !== -1 && !isNaN(bIndex)) {
    result = text.substring(0, bIndex);
    const restOfText = text.substring(bIndex);
  } else {
    const pIndex = text.indexOf("</p>");
    if (pIndex !== -1 && !isNaN(pIndex)) {
      result = text.substring(0, pIndex);
      const restOfText = text.substring(pIndex);
    }
  }
  return result;
}
 
function getLastPartOfDescription(id) {
    const languages = [
        { text: "<b> Při výběru velikosti se řiďte tabulkou velikostí.</b></p>", index: 1 },
        { text: "<b> When choosing a size, please refer to the size chart.</b></p>", index: 2 },
        { text: "<b> Bei der Auswahl einer Größe beziehen Sie sich bitte auf die Größentabelle.</b></p>", index: 3 },
        { text: "<b> Renkantis dydį, vadovaukitės dydžių lentele.</b></p>", index: 4 },
        { text: "<b> Când alegeți o mărime, vă rugăm să consultați tabelul cu mărimi.</b></p>", index: 5 },
        { text: "<b> Při výběru velikosti se řiďte tabulkou velikostí.</b></p>", index: 6 }
    ];
 
    const language = languages.find(lang => lang.index === id);
 
    return language ? language.text : '';
}
 
async function makeDescriptionTranslate(sourceText, targetLang) {
    const properSourceText = transformDescription(sourceText);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: `Act like a language translator. I will give you product description for translating. Don't try to enclose any tags.\nNow, translate this sentence:\n
            Polish -${properSourceText}\n
            ${targetLang} -\n`,
            temperature: 0.5,
            max_tokens: 752,
        }),
    };
 
    try {
        const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
        const data = await response.json();
        let result = data.choices[0].text.trim();
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Translation request failed.');
    }
}
 
async function makeTranslate(sourceText, targetLang) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: `Act like a language translator model. I will give you product name for translating. Keep the word seqeuence in place. 
                     Response just with translated text. I will give you some examples in Polish. In given examples, the "Ecoma", "Suzy", "Carrie" are special names. 
                     If the sentence has special name, keep it at the end of sentence.
                     Examples in Polish:
                     ###
                    "Damskie Klasyczne Trampki Białe Z Czerwoną Lamówką Ecoma"
                    "Klapki Z Kokardą I Ozdobnym Misiem Fuksja Suzy"
                    "Damskie Lakierowane Sandały Na Słupku Maciejka Czarne Carrie"
                     ###
                     Now, translate this sentence:
                     Polish - "${sourceText}"
                     ${targetLang} - \n`,
            temperature: 0.5,
            max_tokens: 352,
        }),
    };
 
    try {
        const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
        const data = await response.json();
        let result = data.choices[0].text.trim().replace(/"/g, '');
        // zwiekszone do 80
        if (result.length > 80) {
            result = result.split('-')[1].trim();
        }
        if (result.includes('.')) {
            result = result.split('.').join('');
        }
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Translation request failed.');
    }
}
 
function getLangBaseDescription() {
    const htmlTab = document.querySelector("#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']");
    htmlTab.click();
    const container = document.querySelector("#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']");
    const previewTab = document.querySelector("#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview_0']");
    previewTab.click();
    const polishDescription = container.value;
    return polishDescription;
}
 
function getLangInput(lang) {
    const inputSelector = `.input-group [id*=${lang}].hasValidation`;
    const langInput = document.querySelector(inputSelector)?.value ?? '';
    return langInput;
}
 
async function setLangDescription(id) {
    IAI.aceForm.loaderOn();
    const base = getLangBaseDescription();
    const LANG = Object.keys(LANG_ARRAY)[id];
    const LANG_CODE = LANG_ARRAY[LANG];
 
    const isShoes = checkCategory();
    let totalTranslate = '';
    let lastPart = isShoes ? getLastPartOfDescription(id) : '';
    let translate = await makeDescriptionTranslate(base, LANG_CODE);
    translate += lastPart;
    totalTranslate += '<p>' + translate;
 
    const htmlTabs = document.querySelectorAll("#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']");
    htmlTabs[id].click();
    const container = document.querySelector("#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']");
    container.value = totalTranslate;
    const previewTab = document.querySelector(`#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview_${id}']`);
    previewTab.click();
    IAI.aceForm.loaderOff();
}
 
async function setLangInput(id) {
    IAI.aceForm.loaderOn();
    const baseLang = Object.keys(LANG_ARRAY)[0];
    const BASE_TEXT = getLangInput(baseLang);
    const LANG = Object.keys(LANG_ARRAY)[id];
    const LANG_CODE = LANG_ARRAY[LANG];
 
    const translate = await makeTranslate(BASE_TEXT, LANG_CODE);
    const inputSelector = `.input-group [id*=${LANG}].hasValidation`;
    const input = document.querySelector(inputSelector);
 
    if (input) {
        input.value = translate;
    }
    IAI.aceForm.loaderOff();
}
 
async function setMultipleLangs() {
  const promises = [];
  for (let id = 1; id < Object.keys(LANG_ARRAY).length; id++) {
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        await setLangInput(id);
        resolve();
      }, id * 1500);
    });
    promises.push(promise);
  }
 
  await Promise.all(promises);
  setText(0);
  setText(1);
}
 
async function setMultipleDescriptions() {
  const promises = [];
  for (let id = 1; id < Object.keys(LANG_ARRAY).length; id++) {
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        await setLangDescription(id);
        resolve();
      }, id * 2500);
    });
    promises.push(promise);
  }
 
  await Promise.all(promises);
}
 
function setText(id) {
    const baseLang = id === 1 ? Object.keys(LANG_ARRAY)[3] : Object.keys(LANG_ARRAY)[0];
    const baseText = getLangInput(baseLang);
    const lang = COPY_ARRAY[id];
    const inputSelector = `.input-group [id*=${lang}].hasValidation`;
    const input = document.querySelector(inputSelector);
 
    if (input) {
        input.value = baseText;
    }
}
 
let buttonNamesHTML = `<div class="dropdown noHover">
  <button class="dropbtn" disabled>Tłumaczenia Nazw</button>
  <div class="dropdown-content">
  <a class='czeski'>Czeski</a>
  <a class='angielski'>Angielski</a>
  <a class='niemiecki'>Niemiecki</a>
  <a class='litewski'>Litewski</a>
  <a class='rumunski'>Rumuński</a>
  <a class='slowacki'>Słowacki</a>
  <a class='niemieckiz'>Niemiecki Zazoo</a>
  <a class='polskiz'>Polski Zazoo</a>
  <a class='wszystkie'>Wszystkie</a>
  </div>
</div>`;
 
let buttonDescriptionsHTML = `<div class="dropdown noHover">
  <button class="dropbtn" disabled>Tłumaczenia Opisów</button>
  <div class="dropdown-content">
  <a class='d-czeski'>Czeski</a>
  <a class='d-angielski'>Angielski</a>
  <a class='d-niemiecki'>Niemiecki</a>
  <a class='d-litewski'>Litewski</a>
  <a class='d-rumunski'>Rumuński</a>
  <a class='d-slowacki'>Słowacki</a>
  <a class='d-wszystkie'>Wszystkie</a>
  </div>
</div>`;
 
let stylesProduct = `
#aceform_prod_edit #mainTabs-container > .ace-scroller > .ace-tabs-wrapper > .container {
    height: 99vh;
}
 
.aceform #mainTabs {
    margin-top: 13px;
}
 
.dropbtn {
  background-color: #428BCA !important;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
 
.dropbtn:hover {
    background-color: #428BCA !important;
}
 
.dropdown {
  border: 0 !important;
  position: relative;
  display: inline-block;
}
 
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  bottom: 100%; /* added this attribute */
}
 
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
 
.dropdown-content a:hover {
    background-color: #f1f1f1;
    cursor: pointer;
}
 
.dropdown:hover .dropdown-content {
  display: block;
}
 
.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
 
.noHover {
    pointer-events: none;
}
 
.dropbtn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
 
document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", buttonNamesHTML);
document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", buttonDescriptionsHTML);
 
let styleSheet = document.createElement("style");
styleSheet.innerText = stylesProduct;
document.head.appendChild(styleSheet);
 
const languages = [
    { className: ".czeski", index: 1 },
    { className: ".angielski", index: 2 },
    { className: ".niemiecki", index: 3 },
    { className: ".litewski", index: 4 },
    { className: ".rumunski", index: 5 },
    { className: ".slowacki", index: 6 }
];
 
languages.forEach(lang => {
    document.querySelector(lang.className).addEventListener(
        "click",
        function() {
            setLangInput(lang.index);
        },
        false
    );
});
 
document.querySelector(".niemieckiz").addEventListener(
    "click",
    function() {
        setText(1);
    },
    false
);
 
document.querySelector(".polskiz").addEventListener(
    "click",
    function() {
        setText(0);
    },
    false
);
 
document.querySelector(".wszystkie").addEventListener(
    "click",
    setMultipleLangs
);
 
document.querySelector(".d-wszystkie").addEventListener(
    "click",
    setMultipleDescriptions
);
 
const descriptions = [
    { className: ".d-czeski", index: 1 },
    { className: ".d-angielski", index: 2 },
    { className: ".d-niemiecki", index: 3 },
    { className: ".d-litewski", index: 4 },
    { className: ".d-rumunski", index: 5 },
    { className: ".d-slowacki", index: 6 }
];
 
descriptions.forEach(desc => {
    document.querySelector(desc.className).addEventListener(
        "click",
        function() {
            setLangDescription(desc.index);
        },
        false
    );
});
 
window.addEventListener('hashchange', buttonState);
window.addEventListener("load", buttonState);
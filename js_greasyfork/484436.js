// ==UserScript==
 // @name         Tłumaczenie nazw i opisów | TESTY |
 // @namespace    http://butosklep.pl/panel/
 // @version      0.1.1
 // @description  Przyciski do tłumaczenia
 // @author       Marcin
 // @match        https://butosklep.pl/panel/product.php*
 // @match        https://butosklep.iai-shop.com/panel/product.php*
 // @icon         https://butosklep.pl/gfx/pol/favicon.ico
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484436/T%C5%82umaczenie%20nazw%20i%20opis%C3%B3w%20%7C%20TESTY%20%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/484436/T%C5%82umaczenie%20nazw%20i%20opis%C3%B3w%20%7C%20TESTY%20%7C.meta.js
 // ==/UserScript==
 
const CONST_VARIABLES = {
  BLEBLE: "833035369cc0563dbe15a9b3781a240d8c6f7d9ac8e54a39e39117d0d857989b",
  LANG_ARRAY: {
    pol_0: "Polish",
    bul_0: "Bulgarian",
    cze_0: "Czech",
    eng_0: "English",
    est_0: "Estonian",
    ger_0: "German",
    hun_0: "Hungarian",
    ita_0: "Italian",
    lit_0: "Lithuanian",
    rum_0: "Romanian",
    scr_0: "Croatian",
    slo_0: "Slovak",
    slv_0: "Slovenian",
    spa_0: "Spanish",
  },
 
  COPY_ARRAY: ["pol_8", "ger_8"],
 
  LANGUAGES: [
    {
      className: "bulgarski",
      index: 1,
    },
    {
      className: "czeski",
      index: 2,
    },
    {
      className: "angielski",
      index: 3,
    },
    {
      className: "estonski",
      index: 4,
    },
    {
      className: "niemiecki",
      index: 5,
    },
    {
      className: "wegierski",
      index: 6,
    },
    {
      className: "wloski",
      index: 7,
    },
    {
      className: "litewski",
      index: 8,
    },
    {
      className: "rumunski",
      index: 9,
    },
    {
      className: "chorwacki",
      index: 10,
    },
    {
      className: "slowacki",
      index: 11,
    },
    {
      className: "slowenski",
      index: 12,
    },
    {
      className: "hiszpanski",
      index: 13,
    },
    {
      className: "wszystkie",
      index: 14,
    },
  ],
 
  DESCRIPTIONS: [
    {
      className: "d-bulgarski",
      index: 1,
    },
    {
      className: "d-czeski",
      index: 2,
    },
    {
      className: "d-angielski",
      index: 3,
    },
    {
      className: "d-estonski",
      index: 4,
    },
    {
      className: "d-niemiecki",
      index: 5,
    },
    {
      className: "d-wegierski",
      index: 6,
    },
    {
      className: "d-wloski",
      index: 7,
    },
    {
      className: "d-litewski",
      index: 8,
    },
    {
      className: "d-rumunski",
      index: 9,
    },
    {
      className: "d-chorwacki",
      index: 10,
    },
    {
      className: "d-slowacki",
      index: 11,
    },
    {
      className: "d-slowenski",
      index: 12,
    },
    {
      className: "d-hiszpanski",
      index: 13,
    },
    {
      className: "d-wszystkie",
      index: 14,
    },
  ],
 
  DESC_LANGUAGES: [
    " <b>Когато избирате размер, моля, обърнете се към таблицата с размери.</b></p>",
    " <b>Při výběru velikosti se řiďte tabulkou velikostí.</b></p>",
    " <b>When choosing a size, please refer to the size chart.</b></p>",
    " <b>Suuruse valimisel vaadake suurustabelit.</b></p>",
    " <b>Bei der Auswahl einer Größe beziehen Sie sich bitte auf die Größentabelle.</b></p>",
    " <b>A méret kiválasztásakor vegye figyelembe a mérettáblázatot.</b></p>",
    " <b>Quando si sceglie una taglia, fare riferimento alla tabella delle taglie.</b></p>",
    " <b>Renkantis dydį, vadovaukitės dydžių lentele.</b></p>",
    " <b>Când alegeți o mărime, vă rugăm să consultați tabelul cu mărimi.</b></p>",
    " <b>Prilikom odabira veličine pogledajte tablicu veličina.</b></p>",
    " <b>Při výběru velikosti se řiďte tabulkou velikostí.</b></p>",
    " <b>Pri izbiri velikosti si oglejte tabelo velikosti.</b></p>",
    " <b>Al elegir una talla, consulta la tabla de tallas.</b></p>",
  ],
};
 
function checkCategory() {
  const category = document.querySelector(
    "#select2-sizes-container"
  ).textContent;
  return category.startsWith("Obuwie");
}
 
function transformDescription(text) {
  const bIndex = text.indexOf("<b>");
  const pIndex = text.indexOf("</p>");
  if (bIndex !== -1 && !isNaN(bIndex)) {
    return text.substring(0, bIndex);
  } else if (pIndex !== -1 && !isNaN(pIndex)) {
    return text.substring(0, pIndex);
  }
  return text;
}
 
async function translateText(sourceText, targetLangs, isProductDescription) {
  const properSourceText = isProductDescription
    ? transformDescription(sourceText)
    : sourceText;
 
  const translateType = isProductDescription ? "description" : "name";
 
  // Prepare the payload for the server
  const payload = {
    userPrompt: properSourceText,
    translateType: translateType,
    languages: targetLangs, // Now an array of languages
  };
 
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${CONST_VARIABLES.BLEBLE}`,
    },
    body: JSON.stringify(payload),
  };
 
  try {
    const response = await fetch(
      "https://butosklep.cfolks.pl/app_test/proxy",
      requestOptions
    );
    const data = await response.json();
    console.log("Tokeny: " + data[1]);
    return data[0]; // Return the translations dictionary directly
  } catch (error) {
    console.error(error);
    throw new Error("Translation request failed.");
  }
}
 
async function setLangDescription(id = null, translateAll = false) {
  IAI.aceForm.loaderOn();
  const base = getLangBaseDescription();
 
  // If translateAll is true, get all language names, otherwise get the specific language name by id
  const targetLangs = translateAll
    ? Object.values(CONST_VARIABLES.LANG_ARRAY)
    : [CONST_VARIABLES.LANG_ARRAY[Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]]];
 
  const translations = await translateText(base, targetLangs, true);
  console.log(translations);
 
  // If translateAll is true, loop through all languages. Otherwise, loop through only the specified language by id.
  const langsToProcess = translateAll
    ? Object.keys(CONST_VARIABLES.LANG_ARRAY).slice(1)
    : [Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]];
 
  for (let langKey of langsToProcess) {
    const langId = Object.values(CONST_VARIABLES.LANG_ARRAY).indexOf(
      CONST_VARIABLES.LANG_ARRAY[langKey]
    );
    const isShoes = checkCategory();
    const lastPart = isShoes ? CONST_VARIABLES.DESC_LANGUAGES[langId - 1] : "";
    const totalTranslate =
      "<p>" + translations[CONST_VARIABLES.LANG_ARRAY[langKey]] + lastPart;
 
    const htmlTabs = document.querySelectorAll(
      "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']"
    );
    htmlTabs[langId].click();
    const container = document.querySelector(
      `#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']`
    );
    container.value = totalTranslate;
    const previewTab = document.querySelector(
      `#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview_${langId}']`
    );
    previewTab.click();
  }
 
  IAI.aceForm.loaderOff();
}
 
function getLangBaseDescription() {
  const htmlTab = document.querySelector(
    "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']"
  );
  htmlTab.click();
  const container = document.querySelector(
    "#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']"
  );
  const previewTab = document.querySelector(
    "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview_0']"
  );
  previewTab.click();
  return container.value;
}
 
function getLangInput(lang) {
  const inputSelector = `.input-group [id*=${lang}].hasValidation`;
  return (document.querySelector(inputSelector) || {}).value || "";
}
 
async function setLangNames(id = null, translateAll = false) {
  IAI.aceForm.loaderOn();
  const baseLang = Object.keys(CONST_VARIABLES.LANG_ARRAY)[0];
  const BASE_TEXT = getLangInput(baseLang);
 
  // If translateAll is true, get all language names, otherwise get the specific language name by id
  const targetLangs = translateAll
    ? Object.values(CONST_VARIABLES.LANG_ARRAY)
    : [CONST_VARIABLES.LANG_ARRAY[Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]]];
 
  const translations = await translateText(BASE_TEXT, targetLangs, false); // false because it's not a description
  console.log(translations);
 
  // If translateAll is true, loop through all languages. Otherwise, loop through only the specified language by id.
  const langsToProcess = translateAll
    ? Object.keys(CONST_VARIABLES.LANG_ARRAY).slice(1)
    : [Object.keys(CONST_VARIABLES.LANG_ARRAY)[id]];
 
  for (let langKey of langsToProcess) {
    const translatedText = translations[CONST_VARIABLES.LANG_ARRAY[langKey]];
    const inputSelector = `.input-group [id*=${langKey}].hasValidation`;
    const input = document.querySelector(inputSelector);
    if (input) {
      input.value = translatedText;
    }
  }
 
  IAI.aceForm.loaderOff();
}
 
function setText(id) {
  const baseLang =
    id === 1
      ? Object.keys(CONST_VARIABLES.LANG_ARRAY)[3]
      : Object.keys(CONST_VARIABLES.LANG_ARRAY)[0];
  const baseText = getLangInput(baseLang);
  const lang = CONST_VARIABLES.COPY_ARRAY[id];
  const inputSelector = `.input-group [id*=${lang}].hasValidation`;
  const input = document.querySelector(inputSelector);
  if (input) {
    input.value = baseText;
  }
}
 
/*
  *********************
   
  BUTTONS SECTION
   
  *********************
  */
 
function buttonState() {
  const url = window.location.href;
 
  const dropbtnEls = document.querySelectorAll(".dropbtn");
  const noHoverEls = document.querySelectorAll(".noHover");
 
  if (url.endsWith("#descriptions")) {
    dropbtnEls.forEach((el) => (el.disabled = false));
    noHoverEls.forEach((el) => el.classList.remove("noHover"));
  } else {
    dropbtnEls.forEach((el) => (el.disabled = true));
    document
      .querySelectorAll(".dropdown:has(button.dropbtn)")
      .forEach((el) => el.classList.add("noHover"));
  }
}
 
function createDropdownHTML(text, classNames) {
  const sortedClassNames = classNames.sort((a, b) => {
    if (a === "wszystkie" || a === "d-wszystkie") return -1;
    if (b === "wszystkie" || b === "d-wszystkie") return 1;
    return 0;
  });
 
  return `
      <div class="dropdown noHover">
        <button class="dropbtn" disabled>${text}</button>
        <div class="dropdown-content">
          ${classNames
            .map((className) => {
              // Remove the "d-" prefix if it exists
              const displayText = className.startsWith("d-")
                ? className.slice(2)
                : className;
 
              return `<a class="${className}">${
                className === "wszystkie" || className === "d-wszystkie"
                  ? "Wszystkie"
                  : displayText
              }</a>`;
            })
            .join("")}
        </div>
      </div>`;
}
 
function addEventListenersForLanguages() {
  CONST_VARIABLES.LANGUAGES.forEach((lang) => {
    const element = document.querySelector(`.${lang.className}`);
    element.addEventListener(
      "click",
      function () {
        if (lang.className === "wszystkie") {
          setLangNames(null, true);
        } else {
          setLangNames(lang.index);
        }
      },
      false
    );
  });
}
 
function addEventListenersForDescriptions() {
  CONST_VARIABLES.DESCRIPTIONS.forEach((desc) => {
    document.querySelector(`.${desc.className}`).addEventListener(
      "click",
      function () {
        if (desc.className === "d-wszystkie") {
          setLangDescription(null, true);
        } else {
          setLangDescription(desc.index);
        }
      },
      false
    );
  });
}
 
const BUTTON_DESCRIPTIONS_HTML = createDropdownHTML(
  "Tłumaczenia Opisów",
  CONST_VARIABLES.DESCRIPTIONS.map((desc) => desc.className)
);
 
const BUTTON_NAMES_HTML = createDropdownHTML(
  "Tłumaczenia Nazw",
  CONST_VARIABLES.LANGUAGES.map((lang) => lang.className)
);
 
const DIV_PLACEHOLDER = "<div class='custom-placeholder'></div>";
 
const STYLES = `
#aceform_prod_edit #mainTabs-container > .ace-scroller > .ace-tabs-wrapper > .container {
  height: 99vh;
}
 
.aceform #mainTabs {
  margin-top: 13px;
}
 
.dropbtn {
background-color: #428BCA !important;
color: white;
padding: 12px;
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
min-width: 90px;
box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
z-index: 9999;
top: 100%; /* added this attribute */
}
 
.dropdown-content a {
color: black;
padding: 6px 12px;
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
 
const styleSheet = document.createElement("style");
styleSheet.innerText = STYLES;
document.head.appendChild(styleSheet);
 
window.addEventListener("hashchange", buttonState);
window.addEventListener("load", buttonState);
 
document
  .querySelector("#descriptionsContent")
  .insertAdjacentHTML("afterbegin", DIV_PLACEHOLDER);
 
document
  .querySelector(".custom-placeholder")
  .insertAdjacentHTML("beforeend", BUTTON_DESCRIPTIONS_HTML);
 
document
  .querySelector(".custom-placeholder")
  .insertAdjacentHTML("afterbegin", BUTTON_NAMES_HTML);
 
addEventListenersForLanguages();
addEventListenersForDescriptions();
// ==UserScript==
// @name         My consts
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Constants
// @author       Marcin
// @icon         https://www.google.com/s2/favicons?sz=64&domain=butosklep.pl
// @grant        none
// ==/UserScript==

const API_BASE_URL = "https://butosklep.cfolks.pl/descriptions_app";
const TOKEN_API_URL = "https://butosklep.cfolks.pl/descriptions_app/generate-token";
const TOKEN_EXPIRY_TIME = 3600000;
const LANGUAGE_NAMES = {
  pol: "Polski",
  bul: "Bułgarski",
  cze: "Czeski",
  dut: "Niderlandzki",
  eng: "Angielski",
  est: "Estoński",
  fre: "Francuski",
  ger: "Niemiecki",
  gre: "Grecki",
  hun: "Węgierski",
  ita: "Włoski",
  lav: "Łotewski",
  lit: "Litewski",
  rum: "Rumuński",
  scr: "Chorwacki",
  slo: "Słowacki",
  slv: "Słoweński",
  spa: "Hiszpański",
  ukr: "Ukraiński",
};
const FIELD_NAMES = {
  langId: "ID języka",
  productName: "Nazwa towaru",
  productLongDescription: "Opis towaru",
  productMetaTitle: "Meta tytuł",
  productMetaDescription: "Meta opis",
  productMetaKeywords: "Słowa kluczowe",
};
const LANG_SPECIFIC_HTML = {
  pol: "<b>Przy wyborze rozmiaru prosimy sugerować się tabelą rozmiarów.</b>",
  bul: "<b>Когато избирате размер, моля, обърнете се към таблицата с размери.</b>",
  cze: "<b>Při výběru velikosti se řiďte tabulkou velikostí.</b>",
  dut: "<b>Raadpleeg de maattabel bij het kiezen van je maat.</b>",
  eng: "<b>When choosing a size, please refer to the size chart.</b>",
  est: "<b>Suuruse valimisel vaadake suurustabelit.</b>",
  fre: "<b>Veuillez vous référer au tableau des tailles pour choisir votre taille.</b>",
  ger: "<b>Bei der Auswahl einer Größe beziehen Sie sich bitte auf die Größentabelle.</b>",
  gre: "<b>Παρακαλούμε ανατρέξτε στον πίνακα μεγεθών για να επιλέξετε το μέγεθός σας.</b>",
  hun: "<b>A méret kiválasztásakor vegye figyelembe a mérettáblázatot.</b>",
  ita: "<b>Quando si sceglie una taglia, fare riferimento alla tabella delle taglie.</b>",
  lav: "<b>Izvēloties izmēru, lūdzu, skatiet izmēru tabulu.</b>",
  lit: "<b>Renkantis dydį, vadovaukitės dydžių lentele.</b>",
  rum: "<b>Când alegeți o mărime, vă rugăm să consultați tabelul cu mărimi.</b>",
  scr: "<b>Prilikom odabira veličine pogledajte tablicu veličina.</b>",
  slo: "<b>Při výběru velikosti se řiďte tabulkou velikostí.</b>",
  slv: "<b>Pri izbiri velikosti si oglejte tabelo velikosti.</b>",
  spa: "<b>Al elegir una talla, consulta la tabla de tallas.</b>",
  ukr: "<b>Будь ласка, зверніться до розмірної сітки при виборі розміру.</b>",
};
 
const PRODUCT_SIZE_CHART = `<p>${
  document.querySelector("#select2-sizeschart-container").textContent
}cm</p>`;
 
const MESSAGE_ELEMENT = document.createElement("div");
MESSAGE_ELEMENT.style.marginTop = "15px";
MESSAGE_ELEMENT.style.marginBottom = "15px";
MESSAGE_ELEMENT.style.paddingLeft = "10px";
MESSAGE_ELEMENT.style.paddingRight = "10px";
 
const LOADING_OVERLAY_HTML = `<div id="loadingOverlay" class="loading-custom-overlay">
    <div class="loading-container">
      <div class="loading-custom-message">Ładowanie...</div>
      <div class="spinner"></div>
    </div>
  </div>`;
 
const BASE_HTML = `  <li id="mainTabs-tab-12" class="scrollableTabsLi statistics" data-anchor="translations"><a data-toggle="tab"
    href="#mainTabs-tab-content-12" aria-expanded="true"><svg class="productCard-sidebar-icon" xmlns="http://www.w3.org/2000/svg" width="11.698" height="11.01" viewBox="0 0 11.698 11.01">
                          <path id="Icon_material-wrap-text" data-name="Icon material-wrap-text" d="M6,17.134h4.129V15.757H6ZM17.01,7.5H6V8.876H17.01Zm-2.064,4.129H6V13h9.118a1.376,1.376,0,1,1,0,2.752H13.569V14.381L11.5,16.446l2.064,2.064V17.134h1.376a2.752,2.752,0,1,0,0-5.5Z" transform="translate(-6 -7.5)" fill="#d0d0d0"></path>
                        </svg>Tłumaczenia</a></li>`;
 
const DESC_TAB_CODE_HTML = `<div id="mainTabs-tab-content-12" class="tab-pane fade">
  <div id="translations">
      <div class="aceform container width100" id="translationsSettingsDiv">
          <h3 class="section-header">Tłumaczenia produktów</h3>
          <div class="wrapper-drop-downs">
          <div class="drop-down-buttons shops-select">
          <label>Sklep: </label>
          <select id="shopIdDropdown">
              <option value="0" selected>Domyślne</option>
              <option value="1">Butosklep.pl</option>
              <option value="2">Bugo</option>
              <option value="4">Hurtownia</option>
              <option value="5">Botoshop</option>
              <option value="6">WeLoveShoes</option>
              <option value="8">Zazoo</option>
              <option value="9">Butymalucha</option>
              <option value="10">Butosklep.com</option>
          </select>
          </div>
          <div class="drop-down-buttons langs-select">
          <label>Język: </label>
          <select id="langDropdown">
              <option value="pol">Polski</option>
              <option value="bul">Bułgarski</option>
              <option value="cze">Czeski</option>
              <option value="dut">Niderlandzki</option>
              <option value="eng">Angielski</option>
              <option value="est">Estoński</option>
              <option value="fre">Francuski</option>
              <option value="ger">Niemiecki</option>
              <option value="gre">Grecki</option>
              <option value="hun">Węgierski</option>
              <option value="ita">Włoski</option>
              <option value="lav">Łotewski</option>
              <option value="lit">Litewski</option>
              <option value="rum">Rumuński</option>
              <option value="scr">Chorwacki</option>
              <option value="slo">Słowacki</option>
              <option value="slv">Słoweński</option>
              <option value="spa">Hiszpański</option>
              <option value="ukr">Ukraiński</option>
              <option value="all" selected>Wszystkie</option>
          </select>
          </div>
          <div class="drop-down-buttons fields-select">
          <label>Dane: </label>
          <select id="fieldsDropdown">
              <option value="productName,productLongDescription,productMetaTitle,productMetaDescription,productMetaKeywords" selected>Wszystkie</option>
              <option value="productName">Nazwa</option>
              <option value="productLongDescription">Opis</option>
              <option value="productName,productLongDescription">Nazwa i opis</option>
              <option value="productMetaTitle">Meta tytuł</option>
              <option value="productMetaDescription">Meta opis</option>
              <option value="productMetaKeywords">Słowa kluczowe</option>
              <option value="productMetaTitle,productMetaDescription,productMetaKeywords">Meta tytuł, opis, słowa kluczowe</option>
          </select>
          </div>
          </div>
          <!-- Tab Navigation -->
          <ul id="languageTabs" class="nav nav-tabs">
              <!-- Language tabs -->
          </ul>
 
          <!-- Tab Content -->
          <div id="tabContent" class="tab-content">
              <!-- Language content -->
          </div>
 
          <div style="display: flex; width: 100%;">
            <div style="display: flex;">
              <button id="savingButton" class="btn btn-primary" style="margin-right: 5px;">Zapisz</button>
              <button id="fetchDataButton" class="btn btn-primary" style="margin-right: 5px;">Odśwież</button>
              <button id="translateButton" class="btn btn-primary">Przetłumacz</button>
            </div>
            <div style="display: flex; margin-left: auto;">
              <button id="rephraseButton" class="btn btn-primary" style="margin-right: 5px;">Parafrazuj opis</button>
              <button id="generateButton" class="btn btn-primary">Generuj opis</button>
            </div>
          </div>
 
          <div id="messageContainer" style="height: 30px; margin: 10px 0px; padding: 10px;">
          </div>
      </div>
  </div>
  </div>`;
 
const MODAL_IMAGES_GENERATE_HTML = `  <div id="imagesModal" class="modal-images">
    <div class="modal-content-images">
      <span class="modal-images-close">&times;</span>
      <h2>Wybierz zdjęcia</h2>
      <div id="imagesModalContainer"></div>
      <button id="fetchImagesButton" class="btn btn-primary">Wybierz zdjęcia produktowe</button>
      <button id="uploadImagesButton" class="btn btn-primary">Wgraj zdjęcia</button>
      <button id="openCameraButton" class="btn btn-primary">Włącz kamerkę</button>
      <div id="cameraContainer" hidden>
        <video id="webcamVideo" width="640" height="480" autoplay></video>
        <button id="captureImageButton" class="btn btn-primary">Zrób zdjęcie</button>
      </div>
      <input type="file" id="imageUpload" accept="image/*" multiple style="display:none">
 
      <label for="oldDescriptionArea-generate" class="textareaLabel">Akutalny domyślny opis:</label>
      <textarea id="oldDescriptionArea-generate" cols="30" rows="10" disabled></textarea>
 
      <label for="descriptionArea-generate" id="labelDescriptionGenerate" class="textareaLabel"></label>
      <textarea id="descriptionArea-generate" cols="30" rows="10" placeholder="Wygenerowany opis pojawi się tutaj..." disabled></textarea>
 
      <button id="generateDescriptionButton" class="btn btn-primary" disabled>Wygeneruj opis ze zdjęć</button>
      <button id="saveDescriptionButtonGenerate" class="btn btn-primary" disabled>Zapisz opis</button>
      <div id="messageContainerModal" style="height: 30px; padding: 10px 10px;">
      </div>
    </div>
  </div>`;
 
const MODAL_REPHRASE = ` <div id="rephraseModal" class="modal-rephrase">
    <div class="modal-content-rephrase">
      <span class="modal-rephrase-close">&times;</span>
      <h2>Parafrazuj opis</h2>
      <div id="rephraseModalContainer"></div>
      <!-- Keywords input -->
      <div class="form-group">
        <label for="keywords-rephrase" class="textareaLabel">Słowa kluczowe:</label>
        <input type="text" class="form-control" id="keywords-rephrase" placeholder="Wpisz słowa kluczowe (wciśnij Enter żeby dodać)" />
        <div id="keywords-container" class="mt-2"></div>
      </div>
 
      <!-- Tone selection -->
      <div class="form-group">
        <label for="tone-rephrase" class="textareaLabel">Styl:</label>
        <select class="form-control" id="tone-rephrase">
          <option value="">Wybierz styl</option>
          <option value="formalny">Formalny</option>
          <option value="profesjonalny">Profesjonaly</option>
          <option value="casualowy">Casualowy</option>
        </select>
      </div>
 
      <label for="oldDescriptionArea-rephrase" class="textareaLabel">Akutalny domyślny opis:</label>
      <textarea id="oldDescriptionArea-rephrase" cols="30" rows="10" disabled></textarea>
 
      <label for="descriptionArea-rephrase" id="labelDescriptionRephrase" class="textareaLabel"></label>
      <textarea id="descriptionArea-rephrase" cols="30" rows="10" placeholder="Wygenerowany opis pojawi się tutaj..." disabled></textarea>
 
      <button id="rephraseDescriptionButton" class="btn btn-primary">Parafrazuj aktualny opis</button>
      <button id="saveDescriptionButtonRephrase" class="btn btn-primary" disabled>Zapisz opis</button>
      <div id="messageContainerModal" style="height: 30px; padding: 10px 10px;">
      </div>
    </div>
  </div>`;
 
const CUSTOM_CSS = `  #mainTabs-tab-content-12 {
    background-color: #fff !important;
  }
  #translationsSettingsDiv {
    background-color: #fff !important;
  }
  #mainTabs-tab-content-12 #languageTabs + .tab-content {
    font-size: 1.2rem !important;
  }
  #mainTabs-tab-content-12 #languageTabs .nav-tabs > li > a {
    padding: 12px 20px !important;
    margin-right: 2px !important;
  }
  #mainTabs-tab-content-12 #languageTabs .nav-tabs > li > a:hover {
    background-color: #dcdcdc !important;
  }
  #mainTabs-tab-content-12 #languageTabs .nav-tabs > li.active > a,
  #mainTabs-tab-content-12 #languageTabs .nav-tabs > li.active > a:focus,
  #mainTabs-tab-content-12 #languageTabs .nav-tabs > li.active > a:hover {
    color: #fff !important;
    background-color: #007bff !important;
    border-color: #007bff !important;
  }
  #mainTabs-tab-content-12 .wrapper-drop-downs {
    display: flex;
    flex-direction: row;
  }
  #mainTabs-tab-content-12 .drop-down-buttons {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
    margin-right: 10px !important;
  }
  #mainTabs-tab-content-12 .drop-down-buttons select {
    width: 100% !important;
    height: 40px !important;
    padding: 0.5rem 1rem !important;
    font-size: 1rem !important;
    color: #495057 !important;
    background-color: #fff !important;
    border: 1px solid #ced4da !important;
    border-radius: 0.25rem !important;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
  }
  #mainTabs-tab-content-12 .drop-down-buttons select:focus {
    border-color: #80bdff !important;
    outline: 0 !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  }
  #mainTabs-tab-content-12 .tab-pane > div {
    display: flex !important;
    align-items: center !important;
    padding: 10px !important;
    background-color: #fff !important;
    margin: 10px 0 !important;
  }
  #mainTabs-tab-content-12 .tab-pane > div input[type="text"],
  #mainTabs-tab-content-12 .tab-pane > div textarea {
    width: 100% !important;
    padding: 8px !important;
    margin-left: 10px !important;
    border: 1px solid #ced4da !important;
    border-radius: 4px !important;
    transition: all 0.2s ease-in-out !important;
  }
  #mainTabs-tab-content-12 .tab-pane > div textarea {
    height: 150px !important;
  }
  #mainTabs-tab-content-12 .tab-pane > div input[type="text"]:focus,
  #mainTabs-tab-content-12 .tab-pane > div textarea:focus {
    border-color: #66afe9 !important;
    outline: none !important;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6) !important;
  }
  #mainTabs-tab-content-12 .tab-pane > div .empty-field {
    padding: 10px !important;
    background-color: #e9ecef !important;
    border: none !important;
    color: #6c757d !important;
    font-style: italic !important;
  }
  #mainTabs-tab-content-12 .tab-pane div[id] {
    margin-bottom: 20px !important;
    background-color: #fff !important;
  }
  #mainTabs-tab-content-12 label {
    display: block !important;
    margin-bottom: 0.5rem !important;
    color: #495057 !important;
    font-weight: bold !important;
  }
.loading-custom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s ease;
  opacity: 0;
  pointer-events: none;
}
 
.loading-custom-overlay.active {
  opacity: 1;
  pointer-events: auto;
}
 
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content vertically */
}
 
.loading-custom-message {
  color: white;
  font-size: 24px;
  margin-bottom: 10px; /* Adjust margin for spacing */
}
 
.spinner {
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-top: 8px solid white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}
 
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
  /* The Modal (background) */
  .modal-images,
  .modal-rephrase {
    display: none !important;
    position: fixed;
    z-index: 9998;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  /* Modal Content */
  .modal-content-images,
  .modal-content-rephrase {
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    width: 50%;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    animation-name: animatetop;
    animation-duration: 0.4s;
  }
 
  /* The Close Button */
  .modal-images-close,
  .modal-rephrase-close {
    color: #aaa;
    float: right;
    font-size: 36px;
    font-weight: bold;
    cursor: pointer;
    padding: 10px;
  }
 
  .modal-images-close:hover,
  .modal-images-close:focus,
  .modal-rephrase-close:hover,
  .modal-rephrase-close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  /* Textarea Styling */
  .textareaLabel {
      display: block;
      margin: 20px 20px 2px;
      font-weight: bold;
  }
  #keywords-rephrase,
  #tone-rephrase,
  #keywords-container {
      width: calc(100% - 40px);
      margin: 2px 0px 0px 20px;
  }
 
  #descriptionArea-generate,
  #descriptionArea-rephrase,
  #oldDescriptionArea-generate,
  #oldDescriptionArea-rephrase {
    width: calc(100% - 40px);
    margin: 0px 20px 20px;
    padding: 10px;
    box-sizing: border-box;
    display: block;
    max-height: 200px;
    min-height: 100px;
    overflow-y: auto;
    resize: vertical;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
 
  #oldDescriptionArea-generate:disabled,
  #oldDescriptionArea-rephrase:disabled {
    background-color: #f0f0f0;
    color: #888888;
    cursor: not-allowed;
    opacity: 0.7;
  }
 
  .selected-image {
    border: 2px solid #00f;
  }
  @keyframes animatetop {
    from {top: -300px; opacity: 0}
    to {top: 0; opacity: 1}
  }
 
  .badge {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem;
  }
 
  .badge .close {
    margin-left: 0.5rem;
  }`;
const BRANDS_ALLEGRO = {
  Seastar: ["option[value='248811_1955863']", ""],
  "Big Star": ["option[value='248811_1944280']", ""],
  "bez marki": ["option[value='248811_958954']", ""],
  Maciejka: ["option[value='248811_1974760']", ""],
  "4F": ["option[value='248811_1131479']", ""],
  inna: ["option[value='248811_950468']", ""],
  "Inna marka": ["", "option[value='7174_400']"],
  "Butosklep": ["option[value='248811_2042532']",""],
};
 
const BRANDS_ALLEGRO_CLOTHING = {
  "bez marki": ["option[value='3786_1704209']", "option[value='7174_1704213']"],
  "4F": ["option[value='3786_189']", "option[value='7174_217317']"],
  inna: ["option[value='3786_85']", ""],
  "Inna marka": ["", "option[value='7174_400']"],
};
 
const COLORS_ALLEGRO = {
  Beżowy: "beżowy",
  Złoty: "złoty",
  Srebrny: "srebrny",
  Czarny: "czarny",
  Biały: "biały",
  Szary: "szary",
  Brązowy: "brązowy",
  Granatowy: "granatowy",
  Żółty: "żółty",
  Różowy: "różowy",
  Niebieski: "niebieski",
  Zielony: "zielony",
  Fioletowy: "fioletowy",
  Pomarańczowy: "pomarańczowy",
  Czerwony: "czerwony",
  Wielokolorowy: "wielokolorowy",
  Bezbarwny: "bezbarwny",
};
 
const CONST_VARIABLES = {
  BLEBLE: "833035369cc0563dbe15a9b3781a240d8c6f7d9ac8e54a39e39117d0d857989b",
  LANG_ARRAY: {
    pol_0: "Polish",
    bul_0: "Bulgarian",
    cze_0: "Czech",
    dut_0: "Dutch",
    eng_0: "English",
    est_0: "Estonian",
    fre_0: "French",
    ger_0: "German",
    gre_0: "Greek",
    hun_0: "Hungarian",
    ita_0: "Italian",
    lav_0: "Latvian",
    lit_0: "Lithuanian",
    rum_0: "Romanian",
    scr_0: "Croatian",
    slo_0: "Slovak",
    slv_0: "Slovenian",
    spa_0: "Spanish",
    ukr_0: "Ukrainian",
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
      className: "niderlandzki",
      index: 3,
    },
    {
      className: "angielski",
      index: 4,
    },
    {
      className: "estonski",
      index: 5,
    },
    {
      className: "francuski",
      index: 6,
    },
    {
      className: "niemiecki",
      index: 7,
    },
    {
      className: "grecki",
      index: 8,
    },
    {
      className: "wegierski",
      index: 9,
    },
    {
      className: "wloski",
      index: 10,
    },
    {
      className: "lotewski",
      index: 11,
    },
    {
      className: "litewski",
      index: 12,
    },
    {
      className: "rumunski",
      index: 13,
    },
    {
      className: "chorwacki",
      index: 14,
    },
    {
      className: "slowacki",
      index: 15,
    },
    {
      className: "slowenski",
      index: 16,
    },
    {
      className: "hiszpanski",
      index: 17,
    },
    {
      className: "ukrainski",
      index: 18,
    },
    {
      className: "wszystkie",
      index: 19,
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
      className: "d-niderlandzki",
      index: 3,
    },
    {
      className: "d-angielski",
      index: 4,
    },
    {
      className: "d-estonski",
      index: 5,
    },
    {
      className: "d-francuski",
      index: 6,
    },
    {
      className: "d-niemiecki",
      index: 7,
    },
    {
      className: "d-grecki",
      index: 8,
    },
    {
      className: "d-wegierski",
      index: 9,
    },
    {
      className: "d-wloski",
      index: 10,
    },
    {
      className: "d-lotewski",
      index: 11,
    },
    {
      className: "d-litewski",
      index: 12,
    },
    {
      className: "d-rumunski",
      index: 13,
    },
    {
      className: "d-chorwacki",
      index: 14,
    },
    {
      className: "d-slowacki",
      index: 15,
    },
    {
      className: "d-slowenski",
      index: 16,
    },
    {
      className: "d-hiszpanski",
      index: 17,
    },
    {
      className: "d-ukrainski",
      index: 18,
    },
    {
      className: "d-wszystkie",
      index: 19,
    },
  ],
 
  DESC_LANGUAGES: [
    " <b>Przy wyborze rozmiaru prosimy sugerować się tabelą rozmiarów.</b>",
    " <b>Когато избирате размер, моля, обърнете се към таблицата с размери.</b>",
    " <b>Při výběru velikosti se řiďte tabulkou velikostí.</b>",
    " <b>Raadpleeg de maattabel bij het kiezen van je maat.</b>",
    " <b>When choosing a size, please refer to the size chart.</b>",
    " <b>Suuruse valimisel vaadake suurustabelit.</b>",
    " <b>Veuillez vous référer au tableau des tailles pour choisir votre taille.</b>",
    " <b>Bei der Auswahl einer Größe beziehen Sie sich bitte auf die Größentabelle.</b>",
    " <b>Παρακαλούμε ανατρέξτε στον πίνακα μεγεθών για να επιλέξετε το μέγεθός σας.</b>",
    " <b>A méret kiválasztásakor vegye figyelembe a mérettáblázatot.</b>",
    " <b>Quando si sceglie una taglia, fare riferimento alla tabella delle taglie.</b>",
    " <b>Izvēloties izmēru, lūdzu, skatiet izmēru tabulu.</b>",
    " <b>Renkantis dydį, vadovaukitės dydžių lentele.</b>",
    " <b>Când alegeți o mărime, vă rugăm să consultați tabelul cu mărimi.</b>",
    " <b>Prilikom odabira veličine pogledajte tablicu veličina.</b>",
    " <b>Při výběru velikosti se řiďte tabulkou velikostí.</b>",
    " <b>Pri izbiri velikosti si oglejte tabelo velikosti.</b>",
    " <b>Al elegir una talla, consulta la tabla de tallas.</b>",
    " <b>Будь ласка, зверніться до розмірної сітки при виборі розміру.</b>",
  ],
};
const DOCKED_TOOLBAR_CSS = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50px;
            background-color: #f0f0f0;
            border-top: 1px solid #ddd;
            z-index: 990;
            padding: 10px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;`;
const DOCKED_TOOLBAR_HTML = `     <div class="toolbar-buttons">
      <div class="dropdown" id="dropdown0">
          <button class="dropbtn" id="dropbtn0">Allegro Ubrania</button>
          <div class="dropdown-content" id="dropdown-content0">
              <div class="sub-dropdown">
                  <a class="dropa">Główny kolor</a>
                  <div class="sub-dropdown-content">
                      ${Object.keys(COLORS_ALLEGRO)
                        .map(
                          (color) =>
                            `<a href="#" class="main-color-option" data-color="${color}">${color}</a>`
                        )
                        .join("")}
                  </div>
              </div>
              <a class="dropa" id="btnSizesAllegroClothing">Rozmiary</a>
              <a class="dropa" id="btnEanToAllegroClothing">EANy</a>
              <div class="sub-dropdown">
                  <a class="dropa">Kod producenta</a>
                  <div class="sub-dropdown-content">
                      <input type="text" id="customProducerInputClothing" placeholder="Inny kod producenta">
                      <button id="customProducerButtonClothing">Wstaw</button>
                      <a class="dropa" id="btnProducerToAllegroClothing">Standardowy kod</a>
                  </div>
              </div>
              <div class="sub-dropdown">
                  <a class="dropa">Marka</a>
                  <div class="sub-dropdown-content">
                      <input type="text" id="customBrandInputClothing" data-brand="inna" data-brandchildren="Inna marka" placeholder="Inna marka">
                      <button id="customBrandButtonClothing">Wstaw</button>
                      <a href="#" class="brand-option" data-brand="bez marki">Bez marki</a>
                      <a href="#" class="brand-option" data-brand="4F">4F</a>
                  </div>
              </div>
          </div>
      </div>
      <div class="dropdown" id="dropdown1">
          <button class="dropbtn" id="dropbtn1">Allegro</button>
          <div class="dropdown-content" id="dropdown-content1">
              <div class="sub-dropdown">
                  <a class="dropa">Główny kolor</a>
                  <div class="sub-dropdown-content">
                      ${Object.keys(COLORS_ALLEGRO)
                        .map(
                          (color) =>
                            `<a href="#" class="main-color-option" data-color="${color}">${color}</a>`
                        )
                        .join("")}
                  </div>
              </div>
              <div class="sub-dropdown">
                <a class="dropa">Kolor podeszwy</a>
                <div class="sub-dropdown-content">
                    ${Object.keys(COLORS_ALLEGRO)
                      .map(
                        (color) =>
                          `<a href="#" class="insole-color-option" data-color="${color}">${color}</a>`
                      )
                      .join("")}
                </div>
              </div>
              <a class="dropa" id="btnTableAllegro">Długości wkładek</a>
              <a class="dropa" id="btnEanToAllegro">EANy</a>
              <div class="sub-dropdown">
                  <a class="dropa">Kod producenta</a>
                  <div class="sub-dropdown-content">
                      <input type="text" id="customProducerInput" placeholder="Inny kod producenta">
                      <button id="customProducerButton">Wstaw</button>
                      <a class="dropa" id="btnProducerToAllegro">Standardowy kod</a>
                  </div>
              </div>
              <div class="sub-dropdown">
                  <a class="dropa">Marka</a>
                  <div class="sub-dropdown-content">
                      <input type="text" id="customBrandInput" data-brand="inna" data-brandchildren="Inna marka" placeholder="Inna marka">
                      <button id="customBrandButton">Wstaw</button>
                      <a href="#" class="brand-option" data-brand="Big Star">Big Star</a>
                      <a href="#" class="brand-option" data-brand="Butosklep">Butosklep</a>
                      <a href="#" class="brand-option" data-brand="Seastar">Seastar</a>
                      <a href="#" class="brand-option" data-brand="bez marki">Bez marki</a>
                      <a href="#" class="brand-option" data-brand="4F">4F</a>
                      <a href="#" class="brand-option" data-brand="Maciejka">Maciejka</a>
                  </div>
              </div>
          </div>
      </div>
      <div class="dropdown" id="dropdown2">
          <button class="dropbtn" id="dropbtn2">Opis</button>
          <div class="dropdown-content" id="dropdown-content2">
              <a class="dropa" id="btnCopyTable">Wstaw tabele</a>
          </div>
      </div>
      <div class="dropdown" id="dropdown3">
          <button class="dropbtn" id="dropbtn3">Tłumaczenie</button>
          <div class="dropdown-content" id="dropdown-content3">
              <div class="sub-dropdown">
                  <a class="dropa">Opisy</a>
                  <div class="sub-dropdown-content">
                    <a href="#" class="d-bulgarski">bulgarski</a>
                    <a href="#" class="d-czeski">czeski</a>
                    <a href="#" class="d-niderlandzki">niderlandzki</a>
                    <a href="#" class="d-angielski">angielski</a>
                    <a href="#" class="d-estonski">estonski</a>
                    <a href="#" class="d-francuski">francuski</a>
                    <a href="#" class="d-niemiecki">niemiecki</a>
                    <a href="#" class="d-grecki">grecki</a>
                    <a href="#" class="d-wegierski">wegierski</a>
                    <a href="#" class="d-wloski">wloski</a>
                    <a href="#" class="d-lotewski">lotewski</a>
                    <a href="#" class="d-litewski">litewski</a>
                    <a href="#" class="d-rumunski">rumunski</a>
                    <a href="#" class="d-chorwacki">chorwacki</a>
                    <a href="#" class="d-slowacki">slowacki</a>
                    <a href="#" class="d-slowenski">slowenski</a>
                    <a href="#" class="d-hiszpanski">hiszpanski</a>
                    <a href="#" class="d-ukrainski">ukrainski</a>
                    <a href="#" class="d-wszystkie">Wszystkie</a>
                  </div>
              </div>
              <div class="sub-dropdown">
                  <a class="dropa">Nazwy</a>
                    <div class="sub-dropdown-content">
                      <a href="#" class="bulgarski">bulgarski</a>
                      <a href="#" class="czeski">czeski</a>
                      <a href="#" class="niderlandzki">niderlandzki</a>
                      <a href="#" class="angielski">angielski</a>
                      <a href="#" class="estonski">estonski</a>
                      <a href="#" class="francuski">francuski</a>
                      <a href="#" class="niemiecki">niemiecki</a>
                      <a href="#" class="grecki">grecki</a>
                      <a href="#" class="wegierski">wegierski</a>
                      <a href="#" class="wloski">wloski</a>
                      <a href="#" class="lotewski">lotewski</a>
                      <a href="#" class="litewski">litewski</a>
                      <a href="#" class="rumunski">rumunski</a>
                      <a href="#" class="chorwacki">chorwacki</a>
                      <a href="#" class="slowacki">slowacki</a>
                      <a href="#" class="slowenski">slowenski</a>
                      <a href="#" class="hiszpanski">hiszpanski</a>
                      <a href="#" class="ukrainski">ukrainski</a>
                      <a href="#" class="wszystkie">Wszystkie</a>
                    </div>
              </div>
          </div>
      </div>
    </div>
    </div>
    <div class="message-area" id="messageArea">
    </div>`;
const PANEL_STYLESHEET = `            .dropdown {
                position: relative;
                display: inline-block;
                margin-right: 10px;
            }
            .dropbtn {
                background-color: #834333;
                color: white;
                padding: 10px;
                font-size: 16px;
                border: none;
                cursor: pointer;
            }
            .dropa {
                padding: 10px;
                font-size: 16px;
                border: none;
                cursor: pointer;
            }
            .dropdown-content {
                display: none;
                position: absolute;
                bottom: 100%;
                background-color: #f9f9f9;
                min-width: 160px;
                box-shadow: 0px -8px 16px 0px rgba(0,0,0,0.2);
                z-index: 1;
            }
            .dropdown-content a {
                color: black;
                padding: 12px 16px;
                text-decoration: none;
                display: block;
            }
            .dropdown-content a:hover {background-color: #f1f1f1}
            .dropdown:hover .dropdown-content {
                display: block;
            }
            .dropdown:hover .dropbtn {
                background-color: #CC5500;
            }
            .sub-dropdown {
                position: relative;
                display: block;
            }
            .sub-dropdown-content {
                display: none;
                position: absolute;
                left: 100%; /* Positions the submenu to the right of the button */
                bottom: -50px; /* Positions the submenu above the button */
                background-color: #f9f9f9;
                min-width: 160px;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                z-index: 1;
            }
            .sub-dropdown-content a {
                color: black;
                padding: 12px 16px;
                text-decoration: none;
                display: block;
            }
            .sub-dropdown-content a:hover {
                background-color: #f1f1f1;
            }
            .sub-dropdown:hover .sub-dropdown-content {
                display: block;
            }
            .toolbar-buttons {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-grow: 1;
            }
            .message-area {
                padding: 10px;
                border-radius: 5px;
                color: #333;
                background-color: #f2f2f2;
                text-align: center;
                visibility: hidden;
                flex-shrink: 0;
                width: 30%;
                transition: visibility 0s, opacity 0.5s linear
            }
            .message-area.error {
                background-color: #ffcccc;
                color: #d8000c;
            }
            .message-area.success {
                background-color: #d4edda;
                color: #155724;`;
const CLOTHING_TERMS = [
  "Okrycia wierzchnie",
  "Garnitury",
  "Kamizelki",
  "Koszule",
  "Marynarki",
  "Spodnie",
  "Bluzy",
  "Dresy kompletne",
  "Koszulki bez rękawów",
  "Koszulki polo",
  "Koszulki z długim rękawem",
  "Komplety",
  "Spodenki",
  "Swetry",
  "T-shirty",
  "Jeansy",
  "Bluzki",
  "Body",
  "Bolerka",
  "Garsonki i kostiumy",
  "Golfy",
  "Gorsety",
  "Kombinezony",
  "Legginsy",
  "Marynarki i żakiety",
  "Spódnice i spódniczki",
  "Sukienki",
  "Sukienki wieczorowe",
  "Topy",
  "Tuniki",
  "Zestawy",
  "Kurtki",
];
 // ==UserScript==
 // @name         Dodatki Allegro | Nowa karta | IAI
 // @namespace    http://butosklep.pl/panel/
 // @version      1.90
 // @description  Przyciski
 // @author       Marcin
 // @match        https://butosklep.pl/panel/product.php*
 // @match        https://butosklep.iai-shop.com/panel/product.php*
 // @icon         https://butosklep.pl/gfx/pol/favicon.ico
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458486/Dodatki%20Allegro%20%7C%20Nowa%20karta%20%7C%20IAI.user.js
// @updateURL https://update.greasyfork.org/scripts/458486/Dodatki%20Allegro%20%7C%20Nowa%20karta%20%7C%20IAI.meta.js
 // ==/UserScript==
 function copyTable() {
     const sizeChart = document.querySelector("#select2-sizeschart-container").textContent;
     const languages = Array.from(document.querySelectorAll("#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']")).filter(el => !el.id.includes("auction"));

     languages.forEach(lang => lang.click());

     const edits = document.querySelectorAll("#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']");

     edits.forEach(e => {
         e.value += ` <p>${sizeChart}cm</p>`;
     });

     const previews = document.querySelectorAll("#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview']");

     previews.forEach(prev => prev.click());
 }

 function setValues(sex, node, insole, size) {
     const selectId = sex == "Damskie" ? "1_26388" : sex == "Męskie" ? "1_127048" : null;
     if (selectId) {
         const insoleElement = node.querySelector(".auction_additional_param_1_203093").value = insole;
         const selectElement = node.querySelector(`.auction_additional_param_${selectId}`);
         const options = Array.from(selectElement.options);
         const index = options.findIndex(option => option.text === size);
         if (index !== -1) {
             selectElement.selectedIndex = index;
             selectElement.dispatchEvent(new Event("change"));
         }
     } else {
         node.querySelector("[id^='td_t_fid_1_295_'] input").value = insole; // dlugosc wkladki
         node.querySelector("[id^='td_t_fid_1_5389_'] input").value = size; // rozmiar
     }
 }

 function tableAllegro() {
     const itemSpecificsMode = document.querySelector("#tr_itemSpecificsMode");
     itemSpecificsMode.lastElementChild.firstElementChild.click();

     const sizeChart = document.querySelector("#select2-sizeschart-container").textContent.split("/");
     const sex = document.querySelector("#select2-category-container").textContent.split(' ')[1];
     const sizesMainNodes = Array.from(document.querySelectorAll("[id^='item_specifics']"));

     sizesMainNodes.forEach(node => {
         const allegroSize = node.querySelector("td").textContent.match(/\d+/g).map(Number)[0];
         const matchedSize = sizeChart.find(item => item.startsWith(allegroSize));
         if (matchedSize) {
             const [size, insole] = matchedSize.split("-");
             setValues(sex, node, insole.replace(/,/g, "."), size);
         }
     });
 }

 function colorAllegro() {
     document.querySelector("#tr_itemSpecificsMode").lastChild.lastChild.firstChild.click();

     const COLORS_ALLEGRO = {
         'Beżowy': 'beżowy',
         'Złoty': 'złoty',
         'Srebrny': 'srebrny',
         'Czarny': 'czarny',
         'Biały': 'biały',
         'Szary': 'szary',
         'Brązowy': 'brązowy',
         'Granatowy': 'granatowy',
         'Żółty': 'żółty',
         'Różowy': 'różowy',
         'Niebieski': 'niebieski',
         'Zielony': 'zielony',
         'Fioletowy': 'fioletowy',
         'Pomarańczowy': 'pomarańczowy',
         'Czerwony': 'czerwony',
         'Wielokolorowy': 'wielokolorowy',
         'Bezbarwny': 'bezbarwny'
     }

     let colorFromIAI = document.querySelector("[data-parent='18'").textContent;

     let setColors = function(color, node) {
         node.querySelector("[id^='td_t_fid_1_249512_'] select+span>span>span>span").textContent = color;

         let selectElement = node.querySelector(".auction_additional_param_1_249512");
         let options_damskie = selectElement.options;

         const index = Array.prototype.findIndex.call(options_damskie, function(x) { return x.text === color; });
         selectElement.options[index].selected = true;
     }

     let sizesMainNode = document.querySelectorAll("[id^='item_specifics']");

     for (const node of sizesMainNode) {
         setColors(COLORS_ALLEGRO[colorFromIAI], node);
     }
 }

 function eanToAllegro() {

     let setValues = function(sizeEan, node) {
         node.querySelector("[id^='td_t_fid_1_225693_'] input").value = sizeEan;
     };

     const data = [];
     const trElements = document.querySelectorAll("#table_product-edit-aceform-basic-elem-64 tbody tr");
     trElements.forEach(tr => {
         const size = tr.querySelector(".ace-text").textContent;
         const ean = tr.querySelector("[name^='codes_producer']").value;
         data.push({ size, ean });
     });
     console.log(data);

     let sizesMainNode = document.querySelectorAll("[id^='item_specifics']");

     for (const node of sizesMainNode) {

         let allegroSize = node.querySelector("td").textContent.match(/\d+/g).map(Number).toString();
         let transformedString = allegroSize;

         if (allegroSize.includes(',')) {
             transformedString = allegroSize.replace(/,/g, '/');
         }


         for (const item of data) {
             if (item.size.startsWith(transformedString)) {
                 let ean = item.ean;
                 setValues(ean, node);
             }
         }
     }
 }

 function producerCodeToAllegro() {

     let setValues = function(sizeEan, node) {
         node.querySelector("[id^='td_t_fid_1_224017_'] input").value = sizeEan;
     };

     const data = [];
     const trElements = document.querySelectorAll("#table_product-edit-aceform-basic-elem-64 tbody tr");
     trElements.forEach(tr => {
         const size = tr.querySelector(".ace-text").textContent;
         const producer = document.querySelector("#code").value;
         data.push({ size, producer });
     });
     console.log(data);

     let sizesMainNode = document.querySelectorAll("[id^='item_specifics']");
     const numberOfChildren = sizesMainNode.length;

     if (numberOfChildren < 2) {
         setValues(data[0].producer, sizesMainNode[0]);
     } else {
         for (const node of sizesMainNode) {

             let allegroSize = node.querySelector("td").textContent.match(/\d+/g).map(Number).toString();
             let transformedString = allegroSize;

             if (allegroSize.includes(',')) {
                 transformedString = allegroSize.replace(/,/g, '/');
             }

             for (const item of data) {
                 if (item.size.startsWith(transformedString)) {
                     let producer = item.producer;
                     setValues(producer, node);
                 }
             }
         }
     }
 }

 // inna dzieciece - option[value='7174_400'] || setBrand("option[value='7174_400']", "Inna Marka", "Dziecięce", isDifferent = true);
 // bigstar dzieciec - option[value='7174_956773'] || setBrand("option[value='7174_956773']", "BIG STAR", "Dziecięce");
 // seastar - option[value='7108_847737'] || setBrand("option[value='7108_847737']", "Seastar", "Damskie");
 // inna - option[value='7108_52'] || setBrand("option[value='7108_52']", "inna", "Damskie", isDifferent = true);
 // bigstar - option[value='7108_116'] || setBrand("option[value='7108_116']", "Big Star", "Damskie");

 // funkcja do ustawienia marki na Allegro
 function setBrand(query, brandText, sex, isDifferent = false) {
     const BRAND = brandText;
     const BUTOSKLEP = 'Buto Sklep';
     const setSex = sex == "Damskie" ? "[id^='td_t_fid_1_7108_']" : "[id^='td_t_fid_1_7174_']";

     const sizesMainNode = document.querySelectorAll("[id^='item_specifics']");

     for (const node of sizesMainNode) {
         node.querySelector(`${setSex} select+span>span>span>span:nth-child(1)`).textContent = BRAND;
         node.querySelector(query).selected = true;
         if (isDifferent) {
             node.querySelector(`${setSex} input[id^='fg_auction']`).value = BUTOSKLEP;
         }

     }
 }

 function setWkladka() {
     const setInsole = "option[value='22728_215177']";
     const sizesMainNode = document.querySelectorAll("[id^='item_specifics']");

     for (const node of sizesMainNode) {
         node.querySelector(`${setInsole}`).selected = true;
     }
 }

 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li id="myBackground"></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatTable'>Tabela do opisów</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatColor'>Kolor</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatTableAllegro'>Tabela Allegro</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatEanToAllegro'>EAN Allegro</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatProducerCodeToAllegro'>Kod producenta Allegro</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatSeastar'>Seastar</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatInna'>Inna</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatBigStar'>Dzieciece Big Star</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatInnaDzieciece'>Dzieciece Inna</a></li>`);
 document.querySelector("#mainTabs").insertAdjacentHTML("beforeend", `<li class="myButton"><a class='floatWkladka'>Wkładka - tkanina</a></li>`);

 let stylesProduct =
     `.myButton {
        cursor: pointer !important;
      }
      #myBackground {
        height: 30px;
      }
      .myButton>a {
        margin-left: 22px;
      }`;

 let styleSheet = document.createElement("style");
 styleSheet.innerText = stylesProduct;
 document.head.appendChild(styleSheet);


 document.querySelector(".floatTable").addEventListener("click", copyTable);
 document.querySelector(".floatColor").addEventListener("click", colorAllegro);
 document.querySelector(".floatTableAllegro").addEventListener("click", tableAllegro);
 document.querySelector(".floatEanToAllegro").addEventListener("click", eanToAllegro);
 document.querySelector(".floatProducerCodeToAllegro").addEventListener("click", producerCodeToAllegro);
 document.querySelector(".floatSeastar").addEventListener("click", function() {
     setBrand("option[value='7108_847737']", "Seastar", "Damskie");
 }, false);
 document.querySelector(".floatInna").addEventListener("click", function() {
     setBrand("option[value='7108_52']", "inna", "Damskie", isDifferent = true);
 }, false);
 document.querySelector(".floatBigStar").addEventListener("click", function() {
     setBrand("option[value='7174_956773']", "BIG STAR", "Dziecięce");
 }, false);
 document.querySelector(".floatInnaDzieciece").addEventListener("click", function() {
             setBrand("option[value='7174_400']", "Inna Marka", "Dziecięce", isDifferent = true)
 }, false);
 document.querySelector(".floatWkladka").addEventListener("click", setWkladka);
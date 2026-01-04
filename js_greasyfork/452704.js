 // ==UserScript==
 // @name         Dodatki Allegro | IAI
 // @namespace    http://butosklep.pl/panel/
 // @version      3.31
 // @description  Przyciski
 // @author       Marcin
 // @match        https://butosklep.pl/panel/product-edit.php*
 // @icon         https://butosklep.pl/gfx/pol/favicon.ico
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452704/Dodatki%20Allegro%20%7C%20IAI.user.js
// @updateURL https://update.greasyfork.org/scripts/452704/Dodatki%20Allegro%20%7C%20IAI.meta.js
 // ==/UserScript==

 function copyTable() {
     try {
         let sizeChart = document.querySelector("#sizeschart_sel").value;
         let languages = document.querySelectorAll(
             "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_html']"
         );
         let languagesArray = Array.from(languages);
         languagesArray = languagesArray.filter(
             (el) => !el.attributes.id.value.includes("auction")
         );

         for (const lang of languagesArray) {
             lang.click();
         }

         let edits = document.querySelectorAll(
             "#mainTabsIdTrId [id^='tableRowTextEditTabs_container_html_area_']"
         );

         for (const e of edits) {
             e.value += ` <p>${sizeChart}cm</p>`;
         }

         let previews = document.querySelectorAll(
             "#mainTabsIdTrId [id^='tableRowTextEditTabs_tab_preview']"
         );

         for (const prev of previews) {
             prev.click();
         }
     } catch (err) {
         alert(err);
     }
 }

 function tableAllegro() {
     document
         .querySelector("#tr_itemSpecificsMode")
         .lastChild.lastChild.firstChild.click();

     let setValues = function(sex, node, insole, size) {
         if (sex === "Damskie") {
             node.querySelector(".auction_additional_param_1_203093").value =
                 insole; /* dlugosc wkladki */
             let options_damskie = node.querySelector(
                 ".auction_additional_param_1_26388"
             ).options;
             let count_damskie = 0;
             for (const x of options_damskie) {
                 if (x.textContent == size) {
                     node.querySelector(".auction_additional_param_1_26388").options[
                         count_damskie
                     ].selected = true;
                 }
                 count_damskie++;
             }

         } else if (sex === "Męskie") {
             node.querySelector(".auction_additional_param_1_203093").value =
                 insole; /* dlugosc wkladki */
             let options_meskie = node.querySelector(
                 ".auction_additional_param_1_127048"
             ).options;
             let count_meskie = 0;
             for (const x of options_meskie) {
                 if (x.textContent == size) {
                     node.querySelector(".auction_additional_param_1_127048").options[
                         count_meskie
                     ].selected = true;
                 }
                 count_meskie++;
             }
         } else {
             node.querySelector("[id^='td_t_fid_1_295_'] input").value = insole; /* dlugosc wkladki */
             node.querySelector("[id^='td_t_fid_1_5389_'] input").value = size; /* rozmiar */
         }
     };
     let sizeChart = document
         .querySelector("input[name='sizeschart_sel']")
         .value.split("/");
     let sex = document.querySelector("#category_sel").value.split('/')[0].trim();
     let sizesMainNode = document.querySelectorAll("[id^='item_specifics']");

     for (const node of sizesMainNode) {

         let allegroSize = node
             .querySelector("tr")
             .textContent.match(/\d+/g)
             .map(Number)
             .toString();

         for (const item of sizeChart) {

             if (item.startsWith(allegroSize)) {

                 let [size, insole] = item.split("-");
                 insole = insole.replace(/,/g, ".");
                 setValues(sex, node, insole, size);
             }
         }
     }
 }

  function eanToAllegro() {
     document
         .querySelector("#tr_itemSpecificsMode")
         .lastChild.lastChild.firstChild.click();

     let setValues = function(sizeEan, node) {
         if (containsLettersOrSpaces(sizeEan)) {
             let producerCode = document.querySelector("#fg_code_projector").value;
             node.querySelector("[id^='td_t_fid_1_224017_'] input").value = producerCode;
         } else {
             let producerCode = document.querySelector("#fg_code_projector").value;
             node.querySelector("[id^='td_t_fid_1_224017_'] input").value = producerCode;
             node.querySelector("[id^='td_t_fid_1_225693_'] input").value = sizeEan;
         }
     };

     const containsLettersOrSpaces = function(value) {
         return /[a-zA-Z\s]/.test(value);
     }


     const code_producer_container = document.getElementById("code_producer_container");
     const spans = code_producer_container.getElementsByTagName("span");

     const data = [];
     for (let i = 0; i < spans.length; i++) {
         const size = spans[i].getElementsByTagName("b")[0].innerText;
         const ean = spans[i].innerText.split(":")[1].trim();
         data.push({ size, ean });
     }

     let sizesMainNode = document.querySelectorAll("[id^='item_specifics']");

     for (const node of sizesMainNode) {

         let allegroSize = node
             .querySelector("tr")
             .textContent.match(/\d+/g)
             .map(Number)
             .toString();

         for (const item of data) {
             if (item.size.startsWith(allegroSize)) {
                 let ean = item.ean;
                 setValues(ean, node);
             }
         }
     }
 }

 // seastar
 function seastar() {
     let seastarMarka = document.querySelectorAll("option[value='7108_847737']");
     [].forEach.call(seastarMarka, function(option) {
         option.selected = true;
     });
     document.querySelector(".floatSeastar").innerHTML = "OK!";
 }

 // bigstar dzieciece
 function bigstar_dzieciece() {
     let bigStarMarka = document.querySelectorAll("option[value='7174_956773']");
     [].forEach.call(bigStarMarka, function(option) {
         option.selected = true;
     });
     document.querySelector(".floatBigStar").innerHTML = "OK!";
 }

 // inna dzieciece
 function inna_dzieciece() {
     let innaMarkaDzieciece = document.querySelectorAll("option[value='7174_400']");
     [].forEach.call(innaMarkaDzieciece, function(option) {
         option.selected = true;
     });
     let input_inna_dzieciece = document.querySelectorAll("[id^='tr_fid_1_7174'] input[id^='fg_auction']");
     [].forEach.call(input_inna_dzieciece, function(option) {
         option.value = "Butosklep";
     });
     document.querySelector(".floatInnaDzieciece").innerHTML = "OK!";
 }

 // inna
 function inna() {
     let innaMarka = document.querySelectorAll("option[value='7108_52']");
     [].forEach.call(innaMarka, function(option) {
         option.selected = true;
     });
     let input_inna = document.querySelectorAll("[id^='tr_fid_1_7108'] input[id^='fg_auction']");
     [].forEach.call(input_inna, function(option) {
         option.value = "Butosklep";
     });
     document.querySelector(".floatInna").innerHTML = "OK!";
 }

 document.querySelector(".container").insertAdjacentHTML("beforebegin", "<button class='floatButton floatTable'>Tabela do opisów</button>");
 document.querySelector(".container").insertAdjacentHTML("beforebegin", "<button class='floatButton floatTableAllegro'>Tabela Allegro</button>");
 document.querySelector(".container").insertAdjacentHTML("beforebegin", "<button class='floatButton floatEanToAllegro'>EAN Allegro</button>");
 document.querySelector(".container").insertAdjacentHTML("beforebegin", "<button class='floatButton floatSeastar'>Seastar</button>");
 document.querySelector(".container").insertAdjacentHTML("beforebegin", "<button class='floatButton floatInna'>Inna</button>");
 document.querySelector(".container").insertAdjacentHTML("beforebegin", "<button class='floatButton floatBigStar'>Dzieciece Big Star</button>");
 document.querySelector(".container").insertAdjacentHTML("beforebegin", "<button class='floatButton floatInnaDzieciece'>Dzieciece Inna</button>");

 let stylesProduct =
     `.floatButton {
      position:fixed;
      width:150px;
      height:65px;
      right:20px;
      background-color: #186AAA;
      box-sizing: border-box;
      font-family: inherit;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      color: #FFF !important;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, .25);
      background-image: none !important;
      border: 5px solid #FFF;
      box-shadow: none !important;
      transition: background-color .15s, border-color .15s, opacity .15s;
      vertical-align: middle;
      margin: 0;
      border-width: 4px;
      line-height: 1.38;
      padding: 0px 6px;
      cursor: pointer;
      font-size: 15px;
      border-radius: 3px;
    }
    .floatButton:hover {
      text-decoration: none;
      background-color: #186AAA !important;
      border-color: #428BCA;
    }
    .floatTable {
      bottom:520px;
    }
    .floatTableAllegro {
      bottom:440px;
    }
    .floatEanToAllegro {
      bottom:360px;
    }
    .floatInnaDzieciece {
      bottom:280px;
    }
    .floatBigStar {
      bottom:200px;
    }
    .floatInna {
      bottom:120px;
    }
    .floatSeastar {
      bottom:40px;
    }`;

 let styleSheet = document.createElement("style");
 styleSheet.innerText = stylesProduct;
 document.head.appendChild(styleSheet);

 document.querySelector(".floatTable").addEventListener("click", copyTable);
 document.querySelector(".floatTableAllegro").addEventListener("click", tableAllegro);
 document.querySelector(".floatEanToAllegro").addEventListener("click", eanToAllegro);
 document.querySelector(".floatSeastar").addEventListener("click", seastar);
 document.querySelector(".floatInna").addEventListener("click", inna);
 document.querySelector(".floatBigStar").addEventListener("click", bigstar_dzieciece);
 document.querySelector(".floatInnaDzieciece").addEventListener("click", inna_dzieciece);
// ==UserScript==
// @name         DBA
// @namespace    https://greasyfork.org/en/users/864921-greasyshark
// @version      1.4.2
// @description  Bedre DBA
// @author       Martin Larsen
// @match        https://www.dba.dk/my-items*
// @match        https://www.dba.dk/recommerce/create/*
// @match        https://www.dba.dk/recommerce/forsale/item/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/526542/DBA.user.js
// @updateURL https://update.greasyfork.org/scripts/526542/DBA.meta.js
// ==/UserScript==

/* globals $ MYADS_STATE */

const delay = t => new Promise(resolve => setTimeout(resolve, t));
let lastIndex, unsorted = true;
if (localStorage.DBA_invSort == undefined) localStorage.DBA_invSort = 1;
if (localStorage.DBA_SortBy == undefined) localStorage.DBA_SortBy = "date";
if (localStorage.DBA_DefaultClickAction == undefined) localStorage.DBA_DefaultClickAction = "administrate";
//console.log(localStorage.DBA_DefaultClickAction)
const clickActions = {
   administrate: "https://www.dba.dk/my-items/details/",
   view: "https://www.dba.dk/recommerce/forsale/item/",
   edit: "https://www.dba.dk/recommerce/create/",
   stats: "https://www.dba.dk/recommerce/statistics/"
}

GM_addStyle(`
div#ml-header {
    margin-top: 10px;
}
#generate, #edit {
  text-align: center;
  cursor: pointer;
}
input.select, select {
  cursor: pointer;
}

.better-dba-button {
    width: 130px;
    font-size: 12.2px;
}
.better-dba-ok {
    background: darkgreen;
}
.better-dba-warning {
    background: darkred;
}
.pause-ad {
    background: indianred;
}
.unpause-ad {
    background: seagreen;
}

#clickaction {
    margin-top: 5px;
    padding-left: 5px;
}

#Xclickaction option {
    background: cadetblue;
}

label[for=clickaction] {
    margin-right: 0;
    padding: 2px 6px;
    display: inline-block;
    margin-top: 2px;
    font-weight: bold;
    text-align: center;
    }
`);

(function () {
   'use strict';
   if (document.location.href.match("/recommerce/create/")) {
      setTimeout(addGenerateButton, 700);
   }
   else if (!document.location.href.match("/my-items/details/") && !document.location.href.match("/forsale/")) {
      $(document, "fieldset[role=radiogroup] > input.peer.sr-only").click(e => {
         if (e.target.type != "radio") return;
         setTimeout(() => {
            addCheckboxes();
         }, 100);
      })
      setTimeout(addCheckboxes, 700);
   }
   else if (document.location.href.match("/forsale/") && document.querySelector("finn-topbar").shadowRoot.querySelector("header > nav > a:nth-child(5)").textContent.trim() == "Min DBA") {
      setTimeout(addEditButton, 700);
   }
})();

$("body").on("change", "#clickaction", function (e) {
   localStorage.DBA_DefaultClickAction = e.target.selectedOptions[0].value;
   const clickURL = clickActions[localStorage.DBA_DefaultClickAction];
   $("div.mb-16 h3 a").each((index, el) => { const id = el.href.split("/").pop(); el.href = clickURL + id });
   console.log(e.target.selectedOptions[0].value);
})

$("body").on("click", function (e) {
   if (e.target.tagName == "LABEL" || e.target.tagName == "FIELDSET") $("div.mb-16").unwrap();
})

$("body").on("click", "#sort-date", function () {
   sortByDate();
})

$("body").on("click", "#sort-name", function () {
   sortByName();
})

$("body").on("click", "#sort-views", function () {
   sortByViews();
})

$("body").on("click", "#sort-favs", function () {
   sortByFavs();
})

$("body").on("click", "input.select", function (e) {
   if (e.shiftKey) {
      const checkboxes = $("input.select")
      for (let i = Math.min(lastIndex, getElementIndex(this.parentNode)); i < Math.max(lastIndex, getElementIndex(this.parentNode)); i++) {
         checkboxes[i - 1].checked = this.checked // index is 1-based
      }
   }
   lastIndex = getElementIndex(this.parentNode);
   // console.log("lastIndex", lastIndex)
})

function addCheckboxes() {
   //injectTestData();
   $("#ml-header, input.select").remove();
   let header = `
            <div id="ml-header" style="margin-bottom: 15px">
            <div>
            <button id="invert" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 bg-[--w-black/70]'>Inverter valg</button>
            <button id="get-ids" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 better-dba-ok'>Generér annonce-ID'er</button>
            <button id="sort-name" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 bg-[--w-color-button-primary-background]'>Sorter efter navn</button>
            <button id="sort-date" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 bg-[--w-color-button-primary-background]'>Sorter efter løbetid</button>
            <button id="sort-views" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 bg-[--w-color-button-primary-background]'>Sorter efter visninger</button>
            <button id="sort-favs" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 bg-[--w-color-button-primary-background]'>Sorter efter favoritter</button>
            <div>
            <label for="clickaction" class="better-dba-button bg-[--w-color-callout-background] rounded-4" title="Handling ved klik på annoncer i listen nedenunder">Klikhandling ➤</label>
            <select name="clickaction" id="clickaction" class="better-dba-button bg-[--w-color-callout-background] font-bold py-4 rounded-4" title="Handling ved klik på annoncer i listen nedenunder">
            <option value="administrate">Administrer</option>
            <option value="edit">Rediger</option>
            <option value="view">Vis</option>
            <option value="stats">Statistik</option>
            </select>
            <button id="open-selected" class="better-dba-button bg-[--w-color-callout-background] font-bold py-2 rounded-4">Åbn valgte annoncer</button>
            <button id="pause-selected" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 pause-ad'>Skjul valgte annoncer</button>
            <button id="unpause-selected" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 unpause-ad'>Vis valgte annoncer</button>
            <button id="delete-selected" class='better-dba-button font-bold py-4 s-text-inverted rounded-8 better-dba-warning'>Slet valgte annoncer</button>
            </div>
            </div>
            `;

   const ads = $("div.mb-16");

   const clickURL = clickActions[localStorage.DBA_DefaultClickAction];
   $("div.mb-16 h3 a").each((index, el) => { const id = el.href.split("/").pop(); el.href = clickURL + id; el.target = "_blank" });

   $(header).prependTo(ads.parent());
   $("#clickaction").val(localStorage.DBA_DefaultClickAction);

   $("#invert").click(function () {
      $("input.select").each(function () { this.checked = !this.checked });
   })

   $("#get-ids").click(function () {
      const count = $("input.select:checked").length
      if (count == 0) {
         alert("Ingen annoncer valgt")
         return
      }
      const selectedAds = [];
      $("input.select:checked").each(async function () {
         const listingId = $(this).next().find("a:first").attr("href").split("/").pop();
         selectedAds.push(listingId)
      })
      GM_setClipboard(selectedAds.join(","));
      alert("Annonce-ID'er er lagt på klippebordet")
   })

   $("#open-selected").click(function () {
      const count = $("input.select:checked").length
      if (count == 0) {
         alert("Ingen annoncer valgt")
         return
      }
      const selectedAds = [];
      $("input.select:checked").each(function () {
         const url = $(this).next().find("a:first").attr("href");
         window.open(url);
      })
   })

   $("#delete-selected").click(function () {
      const count = $("input.select:checked").length
      if (count == 0) {
         alert("Ingen annoncer valgt")
         return
      }
      if (!confirm(`Vil du slette ${count} annonce${count > 1 ? "r" : ""}?`)) return
      const csrfToken = MYADS_STATE.csrfToken;
      $("input.select:checked").each(async function () {
         const listingId = $(this).next().find("a:first").attr("href").split("/").pop();
         console.log(listingId)
         let res = await doAd(listingId, "delete", csrfToken)
         $(this).next().remove();
         $(this).remove();
      })
      reduceAdCount(count, null);
   })

   $("#pause-selected").click(function () {
      const count = $("input.select:checked").length
      if (count == 0) {
         alert("Ingen annoncer valgt")
         return
      }
      if (!confirm(`Vil du skjule ${count} annonce${count > 1 ? "r" : ""}?`)) return
      const csrfToken = MYADS_STATE.csrfToken;
      $("input.select:checked").each(async function () {
         const listingId = $(this).next().find("a:first").attr("href").split("/").pop();
         console.log(listingId)
         let res = await doAd(listingId, "pause", csrfToken)
         $(this).next().remove();
         $(this).remove();
      })
      reduceAdCount(count, "Skjult");
   })

   $("#unpause-selected").click(function () {
      const count = $("input.select:checked").length
      if (count == 0) {
         alert("Ingen annoncer valgt")
         return
      }
      if (!confirm(`Vil du vise ${count} annonce${count > 1 ? "r" : ""}?`)) return
      const csrfToken = MYADS_STATE.csrfToken;
      $("input.select:checked").each(async function () {
         const listingId = $(this).next().find("a:first").attr("href").split("/").pop();
         console.log(listingId)
         let res = await doAd(listingId, "play", csrfToken)
         $(this).next().remove();
         $(this).remove();
      })
      reduceAdCount(count, "Aktiv");
   })

   ads.wrap("<div class='wrap'></div>");
   const checkbox = $("<input style='display: inline; float:left; margin-right: 10px' class='select' type='checkbox' title='Vælg annonce'>");
   checkbox.prependTo(".wrap");
   }

async function doAd(id, verb, csrfToken) {
   // debugger;
   let url, method;
   if(verb == "delete") {
      url = `https://www.dba.dk/my-items/api/action/items/${id}`;
      method = "DELETE";
}

   else {
      url = `https://www.dba.dk/my-items/api/action/items/${id}/${verb}`;
      method = "PUT";
}


   return await fetch(url, {
      "headers": {
         "accept": "application/json, text/plain, */*",
         "csrf-token": csrfToken,
         "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
         "sec-ch-ua-mobile": "?0",
         "sec-ch-ua-platform": "\"Linux\""
      },
      "referrer": "https://www.dba.dk/my-items?statusFacetId=ACTIVE",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": method,
      "mode": "cors",
      "credentials": "include"
   });
}

function reduceAdCount(count, destLabelText) {
   // debugger;
   let sourceButton = $("fieldset[role=radiogroup] input:checked").next();
   let sourceText = sourceButton.text().split(" ").shift();
   let oldCount = parseInt(sourceButton.text().split(/[()]/)[1]);
   sourceButton.text(`${sourceText} (${oldCount - count})`);
   if (!destLabelText) return;
   let destButton = $(`label[for^=r]:contains('${destLabelText}')`);
   let destText = destButton.text().split(" ").shift();
   oldCount = parseInt(destButton.text().split(/[()]/)[1]);
   destButton.text(`${destText} (${oldCount + count})`);
}

function addGenerateButton() {
   let header = `
            <div id="ml-header" style="margin-bottom: 15px">
            <div type="text" id="generate" class='font-bold py-4 s-text-inverted rounded-8 bg-[--w-color-button-primary-background]' style='width:200px'>Generér annonce-JSON</div>
            </div>
            `;

   const parent = $("fieldset + .mt-20");
   $(header).insertBefore(parent);
   $("#generate").click(generateJSON);
}

function addEditButton() {
   let header = `
            <div id="ml-header" style="margin-bottom: 15px">
            <div type="text" id="edit" class='font-bold py-4 s-text-inverted rounded-8 bg-[--w-color-button-primary-background]' style='width:200px'>Rediger annonce</div>
            </div>
            `;
   $("main").prepend(header);
   $("#edit").click(() => document.location.href = document.location.href.replace("forsale/item/", "create/"));
}

async function generateJSON(e) {
   let id = decodeURI(document.location.href.split("/").pop()).trim();
   let type = document.querySelector("fieldset[role=radiogroup] input:checked ~ label").textContent;
   let billeder = []
   let pics = Array.from(document.querySelectorAll("img[src^='https://images.dbastatic.dk'"))
   for (let i in pics) {
      billeder.push(pics[i].src.replace(/220x220c/, "1280w"))
   }
   let data = Array.from(document.querySelectorAll("input[type=number],input[type=text]:not([readonly]),select,textarea:not([placeholder])"))
      .map(e => { return { name: (e.previousSibling ?? e.parentNode?.previousSibling).innerText.split("\n").shift(), value: e.value } })
   let annonce = { navn: data.find(e => e.name == "Annonceoverskrift").value, id, type, data, billeder }
   await GM_setClipboard(JSON.stringify(annonce, null, 2) + ",");
   alert("Annonce-JSON er lagt på klippebordet");
}

function sortByViews() {
   if (localStorage.DBA_SortBy == "views") {
      if (!unsorted) localStorage.DBA_invSort = -localStorage.DBA_invSort;
   }
   else {
      localStorage.DBA_invSort = -1;
      localStorage.DBA_SortBy = "views";
   }
   unsorted = false;
   $(".wrap").sort(function (a, b) {
      const a1 = $(a).find("span.button__text:contains(Antal sidevisninger) ~ div.inline-block").text();
      const b1 = $(b).find("span.button__text:contains(Antal sidevisninger) ~ div.inline-block").text();
      return localStorage.DBA_invSort * (a1 - b1);
   }).appendTo($(".wrap").parent());
}

function sortByFavs() {
   if (localStorage.DBA_SortBy == "favs") {
      if (!unsorted) localStorage.DBA_invSort = -localStorage.DBA_invSort;
   }
   else {
      localStorage.DBA_invSort = -1;
      localStorage.DBA_SortBy = "favs";
   }
   unsorted = false;
   $(".wrap").sort(function (a, b) {
      const a1 = $(a).find("span.button__text:contains(Antal favoritter) ~ div.inline-block").text();
      const b1 = $(b).find("span.button__text:contains(Antal favoritter) ~ div.inline-block").text();
      return localStorage.DBA_invSort * (a1 - b1);
   }).appendTo($(".wrap").parent());
}

function sortByName() {
   if (localStorage.DBA_SortBy == "name") {
      if (!unsorted) localStorage.DBA_invSort = -localStorage.DBA_invSort;
   }
   else {
      localStorage.DBA_invSort = 1;
      localStorage.DBA_SortBy = "name";
   }
   unsorted = false;
   $(".wrap").sort(function (a, b) {
      const a1 = $(a).find("h3.mb-4").text();
      const b1 = $(b).find("h3.mb-4").text();
      return localStorage.DBA_invSort * a1.localeCompare(b1);
   }).appendTo($(".wrap").parent());
}

function sortByDate() {
   if (localStorage.DBA_SortBy == "date") {
      if (!unsorted) localStorage.DBA_invSort = -localStorage.DBA_invSort;
   }
   else {
      localStorage.DBA_invSort = 1;
      localStorage.DBA_SortBy = "date";
   }
   unsorted = false;
   $(".wrap").sort(function (a, b) {
      const a1 = +$(a).find("div.inline-block.ml-8:contains(Dage)").text().split(":").pop().trim();
      const b1 = +$(b).find("div.inline-block.ml-8:contains(Dage)").text().split(":").pop().trim();
      return localStorage.DBA_invSort * (b1 - a1);
   }).appendTo($(".wrap").parent())
}

// https://stackoverflow.com/a/42337722/234466
function getElementIndex(element) {
   return Array.from(element.parentNode.children).indexOf(element);
}

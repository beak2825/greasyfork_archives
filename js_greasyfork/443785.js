// ==UserScript==
// @name         Florida State Parks Reserve
// @version      0.6
// @namespace    https://reserve.floridastateparks.org
// @description  Reserve camping site on reserve.floridastateparks.org
// @author       You
// @license      MIT
// @match        https://reserve.floridastateparks.org/Web/Facilities/SearchViewUnitAvailabity.aspx*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/443785/Florida%20State%20Parks%20Reserve.user.js
// @updateURL https://update.greasyfork.org/scripts/443785/Florida%20State%20Parks%20Reserve.meta.js
// ==/UserScript==


GM_registerMenuCommand("Show/Hide Form", toggleForm);


function toggleForm()
{
    const isForm = document.querySelector("#reseve_site_form") != null;
    if(isForm)
    {
        destroyUI();
    } else {
        createUI();
    }
}

function createUI()
{
    const container = document.createElement("div");
    container.setAttribute("style","position: fixed; background-color: coral; bottom: 10px; right: 10px;");

    container.innerHTML = `
        <div id="reseve_site_form" style="padding: 20px; display: flex; flex-direction: column; gap: 10px;">
          <input id="site_id" type="text" placeholder="Site id"/>
          <input id="site_date"type="text" placeholder="Date"/>
          <input id="site_col" type="text" placeholder="Column"/>
          <input id="site_row" type="text" placeholder="Row"/>
          <button id="reserve_site" type="button">OK</button>
        </div>
    `;

    //Add view to the body
    document.querySelector("body").appendChild(container);
    //Set default date to current date
    const arrivalDate = new Date(document.querySelector("#mainContent_txtDateRange").value);
    document.querySelector("#site_date").value = getFormattedDate(arrivalDate);
    //Add on click listener for OK button
    document.querySelector("#reserve_site").onclick = reserve;
    //Add right click listener for gird boxes
    addRightClickListenerBoxes();
}


function destroyUI()
{
    const body = document.querySelector("body");
    const form = document.querySelector("#reseve_site_form");
    body.removeChild(form);
}

function addRightClickListenerBoxes(){
    const boxes = document.querySelectorAll("#divUnitGridBody table tr.unitdata td[id^=td]");
    boxes.forEach(box => {
        box.addEventListener('contextmenu', autoFill);
    });
}

function reserve()
{
    const siteId = document.getElementById("site_id").value;
    const siteCol = document.getElementById("site_col").value;
    const siteRow = document.getElementById("site_row").value;
    const date = document.getElementById("site_date").value;

    if(isNaN(siteId) || isNaN(siteCol) || isNaN(siteRow) || !isValidDate(date)) {
        alert("Plese check the inputs!");
        return;
    }
    const element = document.querySelector(`#td_${siteRow}_${siteCol}`);
    const event = new Event("click",{
        srcElement: element,
        target: element
    })
    const is_filtered = "false";
    const min_stay = 1;
    const max_stay =14;
    const IsWalkin = "false";
    const is_available = "true";
    //Function declared in https://florida-content.usedirect.com/scripts/main.js?v1.2.4
    //showPopWindowAdvanceSearchRDR(e, iconid, cond, column, row, is_available, is_filtered, min_stay, max_stay, IsWalkin)
    return showPopWindowAdvanceSearchRDR(event, siteId,  date, siteCol , siteRow, is_available, is_filtered,min_stay,max_stay, IsWalkin);
}


function autoFill(e)
{
    e.preventDefault();
    clearForm();
    const target = e.target || e.srcElement;

    const siteId = getSiteId(target);
    const [row, col] = getRowAndCol(target);

    setFormValues(siteId, row, col);
}

function getSiteId(element)
{
    const rowElement = element.closest("tr");
    const blockWithId = rowElement.querySelector("td[onclick^='return showPopWindowAdvanceSearchRDR']");
    if(!blockWithId) return "";
    const onClickValue = blockWithId.getAttribute("onclick");
    const regex = /showPopWindowAdvanceSearchRDR\(event,\s*'(?<id>\d+)',/
    const match = regex.exec(onClickValue);
    if(!match?.groups?.id) return "";
    return match.groups.id;
}

function getRowAndCol(element)
{
    const block = element.closest("td");
    if(!block?.id) return;
    const idRegex = /td_(?<row>\d+)_(?<col>\d+)/;
    const matchId = idRegex.exec(block.id);
    const row = matchId.groups.row;
    const col = matchId.groups.col;
    return [row, col];
}

function setFormValues(siteId, row, col)
{
    document.getElementById("site_id").value = siteId;
    document.getElementById("site_col").value = col;
    document.getElementById("site_row").value = row;
}

function clearForm()
{
    setFormValues("","","");
}

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return month + '/' + day + '/' + year;
}

function isValidDate(dateString) {
    const regex = /((0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/[12]\d{3})/;
    if(!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}
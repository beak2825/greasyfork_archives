// ==UserScript==
// @name         vbcs
// @namespace
// @version      1.2
// @description  Edit UI https://my.jia.360.cn/web/myList
// @author       Paul Nguyen
// @grant        none

// @include        /^https?://trading\.vcbs\.com\.vn/.*$/

// @namespace vbcs
// @downloadURL https://update.greasyfork.org/scripts/392043/vbcs.user.js
// @updateURL https://update.greasyfork.org/scripts/392043/vbcs.meta.js
// ==/UserScript==


var stype = '<style>';

$(function() {
    stype += ' #SHB_TLChart {   display: none; }  ';
    stype += ' body > div.hTop > form > div.headerMenu { background: none; }  ';

    stype += ' div#accountBar {   display: none; }  ';

    stype += ' div.headerTop {   display: none; }  ';
    stype += ' body, table, tr, td, div, input, select, .dxgvHSDC { background-color: rgb(48, 48, 47)  !important; background: none; }  ';
    stype += ' body, table, tr, td, div, input, span, select { color: #ccc  !important; }  ';
    stype += ' #Grid_Currenttock_DXMainTable td { color: #ccc  !important; }  ';
    stype += ' #NormalOrderGrid_DXMainTable td { color: #ccc  !important; }  ';
    stype += ' #OrderList_DXMainTable td { color: #ccc  !important; }  ';
    stype += ' #ConOrderList_DXMainTable td { color: #ccc  !important; }  ';
    stype += ' .tabOrderActive { border-bottom: 3px #505050 solid !important; }  ';
    stype += ' #Grid_Currenttock_DXFooterTable {   display: none; }  ';
    stype += ' .choose_pages { border: #505050 thin solid !important; }  ';
    stype += ' input[src="/OnlineTrading/Content/Images/refresh3.png"] { display: none; }  ';

    stype += ' #tblOne > tbody > tr {   display: none; }  ';
    stype += ' #tblOne > tbody > tr:nth-child(7),  #tblOne > tbody > tr:nth-child(8), #tblOne > tbody > tr:nth-child(9), #tblOne > tbody > tr:nth-child(4) {   display: table-row !important; }  ';

    stype += ' #tblSymbolChart { height: unset !important; }  ';
    stype += ' #priceBoardView > div > table > tbody > tr > td { width: 700px !important; }  ';

    setWidthColumnInOrderListDXMainTable(2, 50) //ma CK
    setWidthColumnInOrderListDXMainTable(3, 65) //thoi gian
    setWidthColumnInOrderListDXMainTable(4, 50) //mua ban
    setWidthColumnInOrderListDXMainTable(6, 30) //loai lenh
    setWidthColumnInOrderListDXMainTable(7, 50) //Gia tri
    setWidthColumnInOrderListDXMainTable(8, 50) //gia dat
    setWidthColumnInOrderListDXMainTable(9, 50) //khoi luong khop
    setWidthColumnInOrderListDXMainTable(10, 50);//con lai

    hideColumnInOrderListDXMainTable(1);// so luu ky
    hideColumnInOrderListDXMainTable(2);// Tieu Khoan
    hideColumnInOrderListDXMainTable(8);// Dat tu
    hideColumnInOrderListDXMainTable(11);// Gia tri
    hideColumnInOrderListDXMainTable(13);// Gia khop
    hideColumnInOrderListDXMainTable(14); //Con lai
    hideColumnInOrderListDXMainTable(15); //da huy
    hideColumnInOrderListDXMainTable(16); //da sua
    hideColumnInOrderListDXMainTable(17); //gia tri khop
    hideColumnInOrderListDXMainTable(18); //gia tri con lai

    stype += ' #NormalOrderGrid_DXFooterRow {   display: none; }  ';

    stype += ' #tlSHB > tr > td:nth-child(2), #SHBbidPrice1 { font-size: 15px !important; font-weight: bold !important; }  ';

    stype += ' #MainSplitter, #Footer { height: 900px !important; }  ';

    stype += '<style>';
    $("body").prepend(stype);

    waitForKeyElements ( "#divStockTrans", setFocusAddressInput );

    //#OrderList_DXMainTable > tbody > tr > td:nth-child(7)
    waitForKeyElements ( "#OrderList_DXMainTable > tbody > tr > td:nth-child(7)", SetStatus );

});

function SetStatus (jNode) {
    //jNode.css("border", "1px solid red");
    if(jNode.html().indexOf('Hủy') != -1){ jNode.parent().css("display", "none"); }
    if(jNode.html().indexOf('Khớp') != -1){ jNode.attr('style', 'background-color: #009999 !important'); }
}

function setFocusAddressInput (jNode) {
    //jNode.click();
    $("#priceBoardView > div > table > tbody > tr > td:nth-child(3) > #divStockTrans").appendTo("#priceBoardView > div > table > tbody > tr > td:nth-child(1)");

}

function hideColumnInOrderListDXMainTable(col)
{
    //var col = 14; //Con lai
    stype += ' #OrderList_col'+col+'  { display: none; }  ';
    stype += ' table#OrderList_DXMainTable tr.dxgvDataRow_Metropolis > td:nth-child('+(col + 1)+') {   display: none; }  ';
}

function setWidthColumnInOrderListDXMainTable(col, width)
{
    stype += ' #OrderList_DXMainTable > tbody > tr > td:nth-child('+col+'), #OrderList_DXHeaderTable > tbody > tr > td:nth-child('+col+') { width: '+width+'px !important; }  '; //con lai
}

// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
function waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector ) { var targetNodes, btargetsFound; if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt); else targetNodes = $(iframeSelector).contents () .find (selectorTxt); if (targetNodes && targetNodes.length > 0) { btargetsFound = true; targetNodes.each ( function () { var jThis = $(this); var alreadyFound = jThis.data ('alreadyFound') || false;  if (!alreadyFound) { var cancelFound = actionFunction (jThis); if (cancelFound) btargetsFound = false; else jThis.data ('alreadyFound', true); } } ); } else { btargetsFound = false; } var controlObj = waitForKeyElements.controlObj || {}; var controlKey = selectorTxt.replace (/[^\w]/g, "_"); var timeControl = controlObj [controlKey]; if (btargetsFound && bWaitOnce && timeControl) { clearInterval (timeControl); delete controlObj [controlKey]; } else { if ( ! timeControl) { timeControl = setInterval ( function () { waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector ); }, 300 ); controlObj [controlKey] = timeControl; } } waitForKeyElements.controlObj = controlObj; }



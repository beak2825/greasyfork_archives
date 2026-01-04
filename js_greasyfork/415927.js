// ==UserScript==
// @name         MTParser
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  美团菜品导出
// @author       theoly
// @match        https://*.meituan.com/meishi/*/
// @require      http://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      http://cdn.staticfile.org/xlsx/0.16.1/xlsx.mini.min.js
// @grant        GM_xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415927/MTParser.user.js
// @updateURL https://update.greasyfork.org/scripts/415927/MTParser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    unsafeWindow.addEventListener ("load", function () { addFuncBtn() }, false);
})();

function addFuncBtn(){
    var tagsDiv=$(".tags.clear")[0];
    if(!tagsDiv){
        tagsDiv=$(".details.clear")[0];
    }
    var funcLi = document.createElement('li');

    var button = document.createElement('BUTTON');
    button.innerText = "导出菜品";
    button.onclick = exportDishes;
    button.id = "btnExport";
    button.className = "btn btn-default btn-clr-g";
    funcLi.appendChild(button);

    tagsDiv.appendChild(funcLi);
}

function exportDishes() {
   var appState = unsafeWindow._appState;
   var dishes = appState.recommended;
    var dishesList = [];
    var title = ["id","name","price","image"];
    dishesList.push(title);
    dishes.forEach(function(item, index){
        dishesList.push([item.id,item.name,item.price,item.frontImgUrl]);
    });
   var sheet = XLSX.utils.aoa_to_sheet(dishesList);

    var shopName = appState.detailInfo.name;
   exportXls(sheet, shopName);
}

function exportXls(dishes, shopName){
    openDownloadDialog(sheet2blob([{sheet: dishes,name:'菜品'}]), shopName + ".xlsx");
}

function sheet2blob(sheets) {
    var sheetsSize = sheets.length;
    var SheetNames = [];
    var Sheets = {};
    for (var index = 0; index<sheets.length; index++){
        var child = sheets[index];
        var sheetName = child.name || 'sheet'+(index+1);
        SheetNames.push(sheetName);
        var sheet = child.sheet;
        Sheets[sheetName] = sheet;
    }

    var workbook = {
        SheetNames: SheetNames,
        //Sheets: {}
        Sheets: Sheets
    };
    //workbook.Sheets[sheetName] = sheet; 

    var wopts = {
        bookType: 'xlsx', // file type
        bookSST: false, // no Shared String Table
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }); // to binary
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}
function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // create blob
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; 
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}
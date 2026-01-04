// ==UserScript==
// @name         LazadaToCSV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Puzzlovaski
// @match        https://www.lazada.co.th/products/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/390486/LazadaToCSV.user.js
// @updateURL https://update.greasyfork.org/scripts/390486/LazadaToCSV.meta.js
// ==/UserScript==

//PrimaryCategory*,,รุ่น*,แบรนด์*,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,Name*,,,,,,,,ประเภทของการรับประกัน*,,,,ราคา*,,,,SellerSKU*,,,สินค้าภายในกล่อง*,ความยาวแพคเกจ(ซม)*,ความกว้างแพคเกจ(ซม)*,ความสูงแพคเกจ(ซม)*,น้ำหนักแพคเกจ(กก)*,,,,,,,,,,,,กลุ่มสี*,ชื่อสี*,กันน้ำ*,,,,กลิ่น*,ขนาดแพคเกจ*'

const easyHtml = "<div><a id='lazcsv'></a></div>"
var primcat = ""
var model = ""
var brand = ""
var name = ""
var descrip = ""
var warrantytype = ""
var price = ""
var sku = ""
var packcontent = ""
var length = "1"
var width = "1"
var height = "1"
var weight = "1"

$(document).ready(function(){

    // Add lazCSV line
    $("#container").before(easyHtml);

    resolve();
});

function resolve(){

    $("#lazcsv").text(""+primcat+",,"+model+","+brand+",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"+name+",,,,,,,,"+warrantytype+",,,,"+price+",,,,"+sku+",,,"+packcontent+","+length+","+width+","+height+","+weight);

    var data = JSON.parse($("script[type='application/ld+json']").first().text());

    primcat = data.category;
    model = data.model.name;
    brand = data.brand.name;
    name = data.name;
    descrip = data.description;
    warrantytype = data.offers.warranty.value;
    price = data.offers.price;
    sku = "1";
    packcontent = "product";

    $("#lazcsv").text(`"${primcat}",,"${model}","${brand}",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,"${name}",,"${descrip}",,,,,,"${warrantytype}",,,,"${price}",,,,"${sku}",,,"${packcontent}","${length}","${width}","${height}","${weight}"`);

}
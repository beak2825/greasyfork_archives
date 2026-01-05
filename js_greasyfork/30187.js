// ==UserScript==
// @name         xoatu
// @version      1.5
// @description  try to take over the world!
// @author       P
// @include      https://www3.chotot.com/*  
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/110837
// @downloadURL https://update.greasyfork.org/scripts/30187/xoatu.user.js
// @updateURL https://update.greasyfork.org/scripts/30187/xoatu.meta.js
// ==/UserScript==


var res1,res2,string1,string2,re;
var soad= document.getElementsByName("body").length;

//xóa tiêu đề//
function xoatieude(tucanxoa)
{
    re = new RegExp(tucanxoa, "gi"); //g (chính xác) hoặc gi (gần giống)
    var i=0;
    while(i<soad)
    {
        string1 = document.getElementsByName("subject")[i].value;
        res1 = string1.replace(re, "");
        document.getElementsByName("subject")[i].value = res1;
        i++;
    }
}
//xóa nội dung//
function xoanoidung(tucanxoa)
{
    re = new RegExp(tucanxoa, "g"); //g (chính xác) hoặc gi (gần giống)
    var i=0;
    while(i<soad)
    {
        string2 = document.getElementsByName("body")[i].value;
        res2 = string2.replace(re, "");
        document.getElementsByName("body")[i].value = res2;
        i++;
    }
}


//keyword tiêu đề//
xoatieude("cần ");
xoatieude("cần");
xoatieude("mua ");
xoatieude("mua");
xoatieude("bán ");
xoatieude("bán");

xoatieude("giá ");
xoatieude("giá");

xoatieude("tỷ ");
xoatieude("tỷ");

xoatieude("tuyển ");
xoatieude("tuyển");

xoatieude("tìm ");
xoatieude("tìm");

xoatieude("nhất ");
xoatieude("nhất");

xoatieude("cho thuê ");
xoatieude("cho thuê");

xoatieude("cần thuê ");
xoatieude("cần thuê");

xoatieude("thuê ");
xoatieude("thuê");

xoatieude("đẹp ");
xoatieude("đẹp");

xoatieude("tốt ");
xoatieude("tốt");

xoatieude("rẻ ");
xoatieude("rẻ");

xoatieude("mới ");
xoatieude("mới");

xoatieude("thanh lý ");
xoatieude("thanh lý");


//keyword nội dung//
xoanoidung("nhất ");
xoanoidung("nhất");
xoanoidung("duy nhất ");
xoanoidung("duy nhất");
xoanoidung("Duy Nhất ");
xoanoidung("Duy Nhất");
xoanoidung("Duy nhất ");
xoanoidung("Duy nhất");






/*alert(document.getElementsByName("subject")[0].value);
alert(document.getElementsByName("body")[0].value);
alert(document.getElementsByName("body").length);*/







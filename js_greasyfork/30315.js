// ==UserScript==
// @name         xoatu
// @version      2.5.1
// @description  try to take over the world!
// @author       P
// @include      https://www3.chotot.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/110837
// @downloadURL https://update.greasyfork.org/scripts/30315/xoatu.user.js
// @updateURL https://update.greasyfork.org/scripts/30315/xoatu.meta.js
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
            
//xoa giá//
xoagia();
//keyword nội dung//
xoanoidung("đồng giá ");
xoanoidung("đồng giá");
xoanoidung("duy nhất ");
xoanoidung("duy nhất");
xoanoidung("Duy Nhất ");
xoanoidung("Duy Nhất");
xoanoidung("Duy nhất ");
xoanoidung("Duy nhất");
xoanoidung("nhất ");
xoanoidung("nhất");
xoanoidung("Giá");
//keyword tiêu đề//
xoatieude("siêu phẩm ");
xoatieude("siêu phẩm");
xoatieude("siêu khủng ");
xoatieude("siêu khủng");
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
xoatieude("thanh lý ");
xoatieude("thanh lý");
xoatieude("thanh lí ");
xoatieude("thanh lí");
xoatieude("thanh lý ");
xoatieude("thanh lý");
xoatieude("cực ");
xoatieude("cực");
xoatieude("hót ");
xoatieude("hót");
xoatieude("khủng ");
xoatieude("khủng");
xoatieude("thần thánh ");
xoatieude("thần thánh");
xoatieude("ra đi ");
xoatieude("ra đi");
xoatieude("mềm ");
xoatieude("mềm");
xoatieude("sốc ");
xoatieude("sốc");
xoatieude("độc ");
xoatieude("độc");
xoatieude("độc lạ ");
xoatieude("độc lạ");
xoatieude("sang ");
xoatieude("sang");
xoatieude("chuyển ");
xoatieude("chuyển ");
xoatieude("nhượng lại ");
xoatieude("nhượng lại");
xoatieude("xinh ");
xoatieude("xinh");
xoatieude("gấp ");
xoatieude("gấp");
xoatieude("lung linh ");
xoatieude("lung linh");
xoatieude("bền ");
xoatieude("bền");
xoatieude("rất ");
xoatieude("rất");
xoatieude("nhanh ");
xoatieude("nhanh");
xoatieude("siêu ");
xoatieude("siêu");
xoatieude("hoặc ");
xoatieude("hoặc");
xoatieude("or ");
xoatieude("êm ");
xoatieude("xịn ");
xoatieude("xịn");
xoatieude("keng ");
xoatieude("keng");
xoatieude("hot ");
xoatieude("hot");
xoatieude("chữa cháy ");
xoatieude("chữa cháy");
xoatieude("chửa cháy ");
xoatieude("chửa cháy");
xoatieude("chống cháy ");
xoatieude("chống cháy");
xoatieude("long lanh ");
xoatieude("long lanh");
xoatieude("lung linh ");
xoatieude("lung linh");
xoatieude("ngon ");
xoatieude("ngon");
xoatieude("êm ");
xoatieude("êm");
xoatieude("nhượng ");
xoatieude("nhượng");
xoatieude("xịn ");
xoatieude("xịn");
xoatieude("hiếm ");
xoatieude("hiếm");
xoatieude("sỉ ");
xoatieude("sỉ");
xoatieude("lẻ ");
xoatieude("lẻ");
xoatieude("mạnh ");
xoatieude("mạnh");
xoatieude("tuyệt ");
xoatieude("tuyệt");
xoatieude("dễ thương ");
xoatieude("dễ thương");
xoatieude("dể thương ");
xoatieude("dể thương");
xoatieude("hay ");
xoatieude("hay ");
xoatieude("chất ");
xoatieude("chất");
xoatieude("sale ");
xoatieude("sale");
xoatieude("chuẩn ");
xoatieude("chuẩn");
xoatieude("triệu ");
xoatieude("triệu");
xoatieude("vip ");
xoatieude("vip");
xoatieude("tiền ");
xoatieude("tiền");
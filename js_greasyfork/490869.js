// ==UserScript==
// @name         图书文献助手🔥图书馆联盟🔥豆瓣🔥一键查询
// @namespace    https://eesk.top#   https://eeshu.net  
// @version      0.2.7
// @description  全国图书参考咨询联盟，图书互助，文献互助，电子书资源，pdf电子书代找，电子书下载，电子书互助，电子书分享，豆瓣读书助手，文献互助小帮手，豆瓣资源下载大师，超星数字图书馆，龙岩网络图书馆，读书小助手，读秀，互助者联盟，油猴插件脚本，图书To搜索[红太狼的平底锅]，这个版本更加简单整洁，支持当当网，孔夫子，豆瓣，一键图书互助，支持读秀SSID码查询，EE书库：https://eesk.top
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA1CAYAAADh5qNwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADbSURBVGhD7dcxCsJAEIXhp4dSz6C1NwhYWVpaeIeUdmJhZbelQioDFp5ATIheQwmMlc3GNbIvvK+JU/6wDkxvkIyf6Ji+fTtFUSwUxSJs+w2XyJORDb9Vujmm+6tNzej5sVAUC0WxaHmlV9isZkgrG/9Ez4+FolgoioWiWLR+T5WXE27221dx3iLNv7ulalEeiSEHYk3/KRaKYqGV/sHjnsrcDseHjb7uB7iAG0xHIgtFsVAUC0Wx6GRUlPfUW7aeYJHb0ICeHwtFsVAUi7CVHik9PxaKYqEoDsAL4eFCXTlrHy8AAAAASUVORK5CYII=
// @include			*search*
// @include			*bookDetail.jsp?*
// @include			*advsearch*
// @include			*book.do?go=guide*
// @include			*book.do?go=showmorelib*
// @include			*searchEBook*
// @include			*www.duxiu.com*
// @include			*img.duxiu.com*
// @include			*book.douban.com*
// @include			*product.dangdang.com*
// @include			*kongfz.com*
// @copyright		houge
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/490869/%E5%9B%BE%E4%B9%A6%E6%96%87%E7%8C%AE%E5%8A%A9%E6%89%8B%F0%9F%94%A5%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%81%94%E7%9B%9F%F0%9F%94%A5%E8%B1%86%E7%93%A3%F0%9F%94%A5%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/490869/%E5%9B%BE%E4%B9%A6%E6%96%87%E7%8C%AE%E5%8A%A9%E6%89%8B%F0%9F%94%A5%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%81%94%E7%9B%9F%F0%9F%94%A5%E8%B1%86%E7%93%A3%F0%9F%94%A5%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
//获取当前网页地址
var myurl = window.location.href;
//定义统一的样式
var mystyle = "font-family:Verdana;color:red;font-size:15px;font-weight:bold;text-align:center;margin-top:5px;margin-bottom:5px;text-decoration:none;";
var app = {
    run: function() {
        processUCDSRList();
        processUCDSR();
        processDouban();
        processDangDang();
        processKongFZ();
    }
};
function processKongFZ() {
    var id = null;
    if (myurl.match(/item\.kongfz\.com\/book\/\d+\.html/)) {
        id=isbn;
    }
    else if (myurl.match(/book\.kongfz\.com\/\d+\/\d+/)){
        id=DETAIL.isbn;
    }
 
    if (id && id.length >= 10){
        document.querySelector("h1").appendChild(createImageLink(false,id,null));
    }
}
 
function processDangDang() {
    if (myurl.match(/product\.dangdang\.com\/\d+\.html/)) {
        var detail = document.getElementById("detail_describe").innerHTML;
        if (detail) {
            var isbn = detail.match(/(\d{12}[\dxX])/)[1];
            if (isbn.length >= 10) {
                document.querySelector("h1").insertBefore(createImageLink(false,isbn,"position:relative;top:3px;"),document.querySelector("h1").childNodes[0]);
            }
        }
    }
}
function processDouban() {
    if (myurl.match(/douban\.com\/subject\/\d+\//)) {
        var metas = document.querySelectorAll("meta[property='book:isbn']");
        if (metas.length == 1) {
            var isbn = metas[0].getAttribute("content");
                document.querySelector("h1").insertBefore(createImageLink(false,isbn,null),document.querySelector("h1").childNodes[2]);
        }
    }
}
function processUCDSRList() {
    if (myurl.indexOf("search?") != -1) {
        var tables = document.getElementsByClassName("book1");
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            var dxid = document.getElementById("title"+i).getAttribute('value');
            var dxid =dxid.replace(/<\/?[^>]*>/g, '');//过滤所有的html标签
            var newTr = table.insertRow(table.rows.length);
            var newTd0 = newTr.insertCell(0);
            var newTd1 = newTr.insertCell(1);
            var newTd2 = newTr.insertCell(2);
            newTd1.align = "center";
            newTd1.appendChild(createTextLink(false,dxid));
            newTd1.appendChild(createImageLink(false,dxid,null));
            clearP(table.rows[0]);
        }
    }
}
function clearP(tr){
    var ps = tr.querySelectorAll("p");
    for(var i=ps.length-1;i>=0;i--){
        tr.removeChild(ps[i])
    }
    setTimeout(clearP, 1000,tr);
}

function processUCDSR() {
    if (myurl.indexOf("bookDetail.jsp?") != -1 && myurl.indexOf("/views/specific/") != -1) {
var ssids= document.getElementById('ssidfav');
var ssida = ssids.value;
var ssid=ssida.replace(/-/g, '');
console.log(ssid);
        document.querySelector(".tubookimg").appendChild(createTextLink(true,ssid));
        document.querySelector(".tubookimg").appendChild(createImageLink(true,ssid,null));
    }
}

function buildUrl(searchKey) {
        return "https://www.eebook.net/so/?ie=utf-8&name="+searchKey;
}

function createTextLink(withP,id) {
    var ssNode = document.createElement("p");
    ssNode.innerHTML = id;

    var aLink = document.createElement("a");
    aLink.href = buildUrl(id);
    aLink.target = "_blank";
    aLink.style = mystyle;
    aLink.innerHTML = id;

    return withP?wrapP(aLink):aLink;
}
function createImageLink(withP,id,aCss) {
    var stockNode = document.createElement("img");
    stockNode.src = "https://t00img.yangkeduo.com/chat/images/2024-03-26/29cecb5f4b9c49b29995889e05f59e65.png#?id=" + (id||"");
    stockNode.style = "display: inline;";

    var csgbutton = document.createElement("a");
    csgbutton.href = buildUrl(id);
    csgbutton.target = "_blank";
    csgbutton.appendChild(stockNode);
    if (aCss){
        csgbutton.style = aCss;
    }
    return withP?wrapP(csgbutton):csgbutton;
}
function wrapP(node){
    var p = document.createElement("p");
    p.style = "text-align:center;margin-top: 4px;";
    p.appendChild(node);
    return p;
}
try {
    app.run();
} catch(e) {
    console.log(e);
}
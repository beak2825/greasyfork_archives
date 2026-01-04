// ==UserScript==
// @name        frw
// @namespace   frw
// @include     *frw.org.ir/00/Fa/News/default.aspx*
// @version     1.2.4
// @grant       none
// @description let's not talk about it
// @downloadURL https://update.greasyfork.org/scripts/34459/frw.user.js
// @updateURL https://update.greasyfork.org/scripts/34459/frw.meta.js
// ==/UserScript==
window.populateIframe = function populateIframe(frmid,id, imgLink, newsUrl, title) {
  var iframe = document.getElementById(frmid);
  var doc;
  if (iframe.contentDocument) {
    doc = iframe.contentDocument;
  } else {
    doc = iframe.contentWindow.document;
  }
  var newsDesc = doc.getElementById('ShowNewsContent_BodyLbl').innerHTML;
  var xhttp = new XMLHttpRequest();
  newsDesc = title + '█' + newsDesc;
  var b64desc = btoa(unescape(encodeURIComponent(newsDesc)));
  var reqStr = '{"RawData" : "' + b64desc + '", "Hash" : "' + imgLink + '" , "Url" : "' + newsUrl + '", "OrgId":"493c8b88-095b-4ca2-982f-5d35eb3c0280","Path":"'+window.location.origin+'"}';
  var req = JSON.parse(reqStr);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      alert(this.responseText);
      btnLoad[id].innerHTML = "ثبت شد";
    }
  };
  xhttp.open('POST', 'http://pr.andishehpardaz.ir/api/Main/AddContentDetails', true);
  xhttp.setRequestHeader("Access-Control-Allow-Origin",window.location.origin);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(reqStr);
};
window.loadNewsInFrame = function loadNewsInFrame(id,imgLink, newsUrl, title) {
  var frmArr = document.createElement('iframe');
  frmArr.src = newsUrl;
  frmArr.setAttribute('id', 'newsFrm' + id);
  frmArr.setAttribute('height', '0');
  frmArr.setAttribute('width', '0');
  frmArr.setAttribute('onLoad', 'populateIframe(this.id,'+id+',"' + imgLink + '","' + newsUrl + '","' + title + '");');
  var left = document.getElementById('leftSide');
  left.appendChild(frmArr);
  btnLoad[id].innerHTML = "در حال بارگذاری...";
};
var btnLoad = [];
var tbl = document.getElementById('ShowNewsList1_ListGrid');
var tbody = tbl.children[0];
var chl = tbody.children.length;
var i = 0;
for (i = 0; i < chl; i++) {
  var tbcl1 = tbody.children[i];
  var tbcl2 = tbcl1.children[0];
  var tbcl3 = tbcl2.children[0];
  var tbcl4 = tbcl3.children[0];
  var tbcl5 = tbcl4.children[0];
  var tbcl6 = tbcl5.children[0];
  var tbcl7_lnk = tbcl6.children[2];
  var tbcl8 = tbcl7_lnk.children[0];
  var tbcl7_img = tbcl6.children[0].children[0].children[0].children[0].children[0];
  var lnk = tbcl8.getAttribute('href');
  var title = tbcl8.innerHTML.toString().trim();
  btnLoad[i] = document.createElement('button');
  btnLoad[i].setAttribute('type', 'button');
  btnLoad[i].setAttribute('id', 'btnload'+i);
  btnLoad[i].setAttribute('onclick', 'loadNewsInFrame('+i+',"'+window.location.origin + tbcl7_img.getAttribute('src') + '","'+window.location.origin+'/00/Fa/News/' + lnk + '","' + title + '");');
  btnLoad[i].innerHTML = 'ثبت در اپ موبایل';
  tbcl7_lnk.appendChild(btnLoad[i]);
}
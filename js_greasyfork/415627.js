// ==UserScript==
// @name         Preklik na DEfičurky
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Arekino
// @match        https://www.darkelf.cz/e.asp?id=*
// @match        http://deficurky.detimes.cz/*
// @description:en deficurky preklik
// @grant        none
// @description deficurky preklik
// @downloadURL https://update.greasyfork.org/scripts/415627/Preklik%20na%20DEfi%C4%8Durky.user.js
// @updateURL https://update.greasyfork.org/scripts/415627/Preklik%20na%20DEfi%C4%8Durky.meta.js
// ==/UserScript==

if (document.URL.match("https://www.darkelf.cz/e.asp.*")) {
  const btn = document.createElement('button');
  btn.innerHTML = 'DEfičurky';
  btn.className = 'butt_sml';
  btn.type = 'button';
  btn.onclick = (e) => {
    var domy = parseInt(document.getElementsByTagName('td')[15].innerText);
    var obyv = parseInt(document.getElementsByTagName('td')[17].innerText);
    var pocetVojakov = parseInt(document.getElementsByTagName('td')[19].innerText);
    var listaInf = getFrameDocument("lista_informace");
    var kola = listaInf.getElementsByTagName("span")[3].innerText;
    var pos = kola.search('\/');
    var odtahanychKol = parseInt(kola);
    var maxKol = parseInt(kola.substr(pos + 1));
    var pocetKol = maxKol - odtahanychKol;
    var listaHor = getFrameDocument("Lista_Horni")
    var odkazNaHlaseni = listaHor.querySelector('a[href="hlaseni.asp"]');
    var pocasCele = odkazNaHlaseni.title
    pos = pocasCele.search("Počasí:");
    pos = pos + 14 + pocasCele.substr(pos + 13).search("-");
    var pocasie = parseInt(pocasCele.substr(pos));
    window.open("http://deficurky.detimes.cz/?domy=" + domy + "&obyv=" + obyv + "&voj=" + pocetVojakov + "&kola=" + pocetKol + "&pocasie=" + pocasie, '_blank');
  }
  const td = document.createElement('td');
  const tr = document.createElement('tr');
  td.append(tr);
  tr.append(btn);
  document.getElementsByTagName('tbody')[3].prepend(td);

}
if (document.URL.match("http://deficurky.detimes.cz/.*")) {
  var url = new URL(document.URL);
  if (url.searchParams.get("obyv") != undefined) {
    document.getElementsByTagName('input')[4].value = url.searchParams.get("obyv");
  }
  if (url.searchParams.get("kola") != undefined) {
    document.getElementsByTagName('input')[5].value = url.searchParams.get("kola");
  }
  if (url.searchParams.get("domy") != undefined) {
    document.getElementsByTagName('input')[10].value = url.searchParams.get("domy");
  }
  if (url.searchParams.get("pocasie") != undefined) {
    document.getElementsByTagName('input')[11].value = url.searchParams.get("pocasie");
  }
  if (url.searchParams.get("voj") != undefined) {
    document.getElementsByTagName('input')[12].value = url.searchParams.get("voj");
  }
}

function getFrameDocument(frameName) {
  const frame = window.parent.document.getElementsByName(frameName)[0];
  return frame.contentDocument;
}
// ==UserScript==
// @name     Exportar datos de BSC a CSV
// @version  1
// @grant    none
// @include https://bscscan.com/token/*
// @run-at          document-end
// @description Permite exportar información de estadísticas sobre un contrato de bscscan a un archivo CSV para análisis.
// @namespace https://greasyfork.org/users/172657
// @downloadURL https://update.greasyfork.org/scripts/430857/Exportar%20datos%20de%20BSC%20a%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/430857/Exportar%20datos%20de%20BSC%20a%20CSV.meta.js
// ==/UserScript==

function getTokenAnalytics() {
  let plotData = eval(document.getElementsByTagName('script')[6].text.split('\n').filter(l => l.indexOf("plotData =") >= 0)[0].split('eval(')[1].slice(0,-2));
 	plotData = plotData.map(x => [new Date(x[0]).toISOString().split('T')[0], ...x.slice(1)].join());
  return "fecha,transaction amount,transaction count,unique senders,unique receivers,total uniques\n" + plotData.join('\n');
}

function download(filename, text,parent) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.setAttribute('style', 'border: 1px solid black; border-radius: 15px; padding: 5px 5px 5px 5px; margin-bottom: 10px;display:block;width:20%;text-align:center; background-color:#dfdff1;');
  element.innerText = "Descargar como CSV"
  parent.prepend(element);
}

window.onload = function(){
  let analytics_csv = getTokenAnalytics();
  document.body.innerHTML = '<div style="width: 60%; margin-left: auto; margin-right: auto; margin-top:10px;"><pre>' + analytics_csv + "</pre></div>";
  download("analisis_nieris.csv", analytics_csv, document.getElementsByTagName('div')[0]);
};
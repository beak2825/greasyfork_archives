// ==UserScript==
// @name        Link visibili in marketplace AgID - cloud.italia.it
// @namespace   Violentmonkey Scripts
// @match       https://cloud.italia.it/marketplace/supplier/market/*.html
// @grant       none
// @version     2.04
// @author      glauco
// @description 12/12/2019, 18:38:44 AM
// @downloadURL https://update.greasyfork.org/scripts/392536/Link%20visibili%20in%20marketplace%20AgID%20-%20clouditaliait.user.js
// @updateURL https://update.greasyfork.org/scripts/392536/Link%20visibili%20in%20marketplace%20AgID%20-%20clouditaliait.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var asc=true;
  
  function ConvertiData(d){
        var a = d.split("-");
        var data=new Date(a[2],a[1],a[0]);
        return data.getTime();
  }
  
  document.querySelectorAll('th').forEach(function(item){item.style.cursor="pointer";});
  
  //da https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
  const ValoreCella = (tbody, idx) => (tbody.childNodes[1].children[idx].innerText.match("\\d+\-\\d+\-\\d+")) ? ConvertiData(tbody.childNodes[1].children[idx].innerText) : tbody.childNodes[1].children[idx].innerText;
  const Confronta = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(ValoreCella(asc ? a : b, idx), ValoreCella(asc ? b : a, idx));
  document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
      const table = th.closest('table');
      Array.from(table.querySelectorAll('tbody:nth-child(n+2)'))
          .sort(Confronta(Array.from(th.parentNode.children).indexOf(th), asc = !asc))
          .forEach(tr => table.appendChild(tr) );
  })));
  
  var r=document.getElementsByTagName('tr');
  for(var i=1;i<r.length;i++) {
    if(r[i].hasAttributes())  {
      var t=r[i].childNodes[3].innerHTML;
      r[i].childNodes[3].innerHTML='<a href="https://cloud.italia.it/marketplace/supplier/market/'+r[i].attributes[1].value+'">'+t+'</a>';
      r[i].removeAttribute("class");
      r[i].removeAttribute("data-href");
    }
  }
  document.querySelectorAll('a[href^=mailto]').forEach(function(riga) {
      var str=riga.attributes['href'].textContent;
      (str.includes("<br>")) ? riga.attributes['href'].textContent=str.replace("<br>","") : null;
    }
  )
})();
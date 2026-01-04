// ==UserScript==
// @name     Show Minecraft CPUs on cpubenchmark.net
// @description Go to PassMark's Single Thread Performance Chart (https://www.cpubenchmark.net/singleThread.html) and click button above price column. Cycles between "off", "hide", and "highlight". Filters based on descending price. Prices can change day to day.
// @include  https://www.cpubenchmark.net/singleThread.html
// @version  1
// @grant    none
// @namespace https://greasyfork.org/users/218031
// @downloadURL https://update.greasyfork.org/scripts/379389/Show%20Minecraft%20CPUs%20on%20cpubenchmarknet.user.js
// @updateURL https://update.greasyfork.org/scripts/379389/Show%20Minecraft%20CPUs%20on%20cpubenchmarknet.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.appendChild(document.createTextNode(`
(()=>{
$('#mark tr > td:last-child > a').toArray().reduce((a,e) => {
  let t = e.innerText;
  if(t === 'NA' || t.endsWith('*')) {
    e.parentElement.parentElement.classList.add('hide');
  } else {
    let p = Number(t.substring(1).replace(',',''));
    if(a > p) {
      a = p;
    } else {
      e.parentElement.parentElement.classList.add('hide');
    }
  }
  return a;
},Number.POSITIVE_INFINITY);
let s = document.createElement("style");
s.appendChild(document.createTextNode(""));
document.head.appendChild(s);
s.sheet.insertRule("table.chart caption { position: relative; }");
s.sheet.insertRule("table.chart caption button { position: absolute; bottom:0; right:0; }");
s.sheet.insertRule("table.minecraft:not(.hide) tr.hide { display:none; }");
s.sheet.insertRule("table.minecraft.hide tr:not(.hide) td.chart { background-color:#8f8; }");
let b = $('<button>Minecraft</button>').on('click', e => {
    let t = $('table.chart');
    if(t.hasClass('minecraft')) {
      if(t.hasClass('hide')) {
        t.removeClass('minecraft hide');
      } else {
        t.addClass('hide');
      }
    } else {
      if(t.hasClass('hide')) {
        t.removeClass('hide');
      } else {
        t.addClass('minecraft');
      }
    }
  });
$('table.chart caption').append(b);
})();
`));
document.head.appendChild(script);
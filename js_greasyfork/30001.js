// ==UserScript==
// @name        AntyPrzegląd
// @namespace   http://www.ppe.pl/blog-gry.html
// @description skrypt usuwający codzienny przegląd z listy wpisów
// @include     http://www.ppe.pl/blog-gry.html*
// @version     1.1
// @grant       none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/30001/AntyPrzegl%C4%85d.user.js
// @updateURL https://update.greasyfork.org/scripts/30001/AntyPrzegl%C4%85d.meta.js
// ==/UserScript==

$($('.box.miniDark')[0]).prepend(`
Zmień CPN na : <select id="podmianka">
<option value="Piasek">Piaska</option>
<option selected="selected" value="Nic">Nic</option>
</select>`);


$('#podmianka').change(function(e) {
  console.log(e.currentTarget.value);
  if(e.currentTarget.value == 'Piasek') {
    wipeCPN('gejoza');
  } else {
    wipeCPN();
  }
})

function wipeCPN(arg) {
  for (let i = 0; i < $('.likeh1.di').length; i++) {
    if ($('.likeh1.di') [i].innerHTML.indexOf('Codzienny Przegląd') != - 1) {
      console.log(arg);
      if(arg === 'gejoza') {
        $($('.likeh1.di') [i]).parent().find('.txt,.voltage-1,.lead.fwn,.box-bottom').remove()
        $($('.likeh1.di') [i]).css('font-size', '0px');
        $($('.likeh1.di') [i]).append(`<div class="yo"><iframe width="560" height="315" src="https://www.youtube.com/embed/ZmHwbNQ-rRQ" frameborder="0" allowfullscreen></iframe></div>
`);
      } else {
        $($('.likeh1.di') [i]).parent().find('.yo,.txt,.voltage-1,.lead.fwn,.box-bottom').remove()
        $($('.likeh1.di') [i]).css('font-size', '0px');
//         $($('.likeh1.di') [i]).append('lol');
      }
      
    }
  }
      
}
wipeCPN();

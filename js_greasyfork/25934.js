// ==UserScript==
// @name        Conta Carattri Areadmin
// @description Aggiunge un contatore di caratteri sotto gli input e i textarea all'interno dell'areadmin
// @author Maxeo | maxeo.it
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @include     http://*/admin.php/*
// @include     https://*/admin.php/*
// @icon        http://www.alias2k.com/assets/images/alias-logo-color.png
// @version     1.2.0
// @grant       none
// @namespace https://greasyfork.org/users/88678
// @downloadURL https://update.greasyfork.org/scripts/25934/Conta%20Carattri%20Areadmin.user.js
// @updateURL https://update.greasyfork.org/scripts/25934/Conta%20Carattri%20Areadmin.meta.js
// ==/UserScript==
function eseguiConteggio() {
  ($('textarea, input').each(function () {
    
    
    if (!$(this).parent().find('div').hasClass('counerTxtArea'))
    $(this).parent().append('<div class=\'counerTxtArea\'></div>')
  }), $('textarea, input').unbind(), $('textarea, input').bind('keyup', 'textarea, input', function () {
    $(this).next('.counerTxtArea').html($(this).val().length)
  }))
}
eseguiConteggio(),
setInterval(function () {
  eseguiConteggio()
}, 500);

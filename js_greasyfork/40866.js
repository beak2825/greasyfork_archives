// ==UserScript==
// @name     sqlformat
// @version  1
// @grant    none
// @include http://www.dpriver.com/pp/sqlformat.htm
// @description Unchanged is the way!
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @namespace https://greasyfork.org/users/181068
// @downloadURL https://update.greasyfork.org/scripts/40866/sqlformat.user.js
// @updateURL https://update.greasyfork.org/scripts/40866/sqlformat.meta.js
// ==/UserScript==
setTimeout(gogogo, 100);
function gogogo() {
  $("select[name='keywordcs']").val('Unchanged');
  $("select[name='tablenamecs']").val('Unchanged');
  $("select[name='columnnamecs']").val('Unchanged');
  $("select[name='functioncs']").val('Unchanged');
  $("select[name='datatypecs']").val('Unchanged');
  $("select[name='aliascs']").val('Unchanged');
  $("select[name='quotedidentifiercs']").val('Unchanged');
  $("select[name='identifiercs']").val('Unchanged');
}
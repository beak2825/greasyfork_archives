  // ==UserScript==
// @name        AV AutoLogin
// @description Aula Virtual Auto Login
// @include     https://aulavirtual.upc.edu.pe/*
// @version     v1
// @namespace https://greasyfork.org/users/696834
// @downloadURL https://update.greasyfork.org/scripts/413986/AV%20AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/413986/AV%20AutoLogin.meta.js
// ==/UserScript==
/* eslint-env jquery */

window.addEventListener('load', function () {
  $(document.querySelector("input#entry-login")).click();
})
if(window.location.href== "https://aulavirtual.upc.edu.pe/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_92_1"){
    window.location.href = "https://aulavirtual.upc.edu.pe/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";
}

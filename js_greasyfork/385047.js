// ==UserScript==
// @name         ikcrm_client_jump
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      https://e.ikcrm.com/customers/*
// @exclude      https://e.ikcrm.com/customers/*?tab=load_tab_base
// @grant        none




// @downloadURL https://update.greasyfork.org/scripts/385047/ikcrm_client_jump.user.js
// @updateURL https://update.greasyfork.org/scripts/385047/ikcrm_client_jump.meta.js
// ==/UserScript==




    var current_url = window.location.href;
    //alert(current_url);

    window.location.href = current_url + "?tab=load_tab_base";


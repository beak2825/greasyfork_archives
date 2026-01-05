// ==UserScript==
// @name        AlertManager
// @namespace   nboss
// @include     https://management.atlasit.com/monitoring/alertmanager2/?platform=494
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     0.1
// @grant       GM_setValue
// @grant       GM_getValue
// @author		Iñaki
// @description Script de mejora para Jira
// @downloadURL https://update.greasyfork.org/scripts/25240/AlertManager.user.js
// @updateURL https://update.greasyfork.org/scripts/25240/AlertManager.meta.js
// ==/UserScript==
url=document.location.toString();
$(document).ready(function() {
    var alertas = $('table#alerts tr').length-1;
    if (alertas > 0){
        $(document).prop('title', '('+alertas+') Alert Manager');
    }else{
        $(document).prop('title', 'Alert Manager');
    }
});
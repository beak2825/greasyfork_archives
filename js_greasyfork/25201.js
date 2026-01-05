// ==UserScript==
// @name        JIRA
// @namespace   nboss
// @include     https://cs.atlasit.com/jira*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     0.1
// @grant       GM_setValue
// @grant       GM_getValue
// @author		Iñaki
// @description Script de mejora para Jira
// @downloadURL https://update.greasyfork.org/scripts/25201/JIRA.user.js
// @updateURL https://update.greasyfork.org/scripts/25201/JIRA.meta.js
// ==/UserScript==
url=document.location.toString();
$(document).ready(function() {
    if (url.match("/browse")){
        $("a[href^='https://ar-mgmt-op5.lifecapnet.com']").each(function(){
            //alert(this.href);
            this.text = this.text.replace("ar-mgmt-op5.lifecapnet.com","op5-adminre.atlasit.com");
            this.href = this.href.replace("ar-mgmt-op5.lifecapnet.com","op5-adminre.atlasit.com");
        });
    }
});
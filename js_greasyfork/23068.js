// ==UserScript==
// @name           RW hunter
// @namespace      eRRW
// @author         iMan (Persian Myth)
// @description    support RW
// @version        1.0
// @include        https://www.erepublik.com/*
// @downloadURL https://update.greasyfork.org/scripts/23068/RW%20hunter.user.js
// @updateURL https://update.greasyfork.org/scripts/23068/RW%20hunter.meta.js
// ==/UserScript==

        var ResistanceForceInsert = function($, window, undefined) {
            function controlIt(control){GM_setValue("control", control);}
                function autoRefresh(interval) {setTimeout('location.reload(true);',interval);};
                $(document).ready(function () {
                        if (parent.document.location.toString()==='https://www.erepublik.com/en') {
                                if ($('#battle_listing > ul.resistance_war > li > a#fundRW_btn').length==1) {
                                        $('#fundRW_btn2').trigger('click');
                                } else {
                                        var vNmax = 1; var vNmin = 1;
                                        var vNum = Math.round(Math.random() * (vNmax - vNmin) + vNmin);
                                        autoRefresh(vNum*1000);
                                };
                        };
                });
        };
        // Script Insert
        var script = document.createElement('script');
        script.textContent = '(' + ResistanceForceInsert + ')(jQuery, window);';
        document.body.appendChild(script);
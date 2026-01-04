// ==UserScript==
// @name           APEX extension: Switch Application
// @namespace      iminglei.blogspot.com
// @description    Switch to another application page from current page designer
// @author         Ming (Tim) Lei

// @compatible     chrome Works with Chrome and Tampermonkey

// @include        http*://*/f?p=4000:4500:*

// @version        0.0.1
// @downloadURL https://update.greasyfork.org/scripts/32930/APEX%20extension%3A%20Switch%20Application.user.js
// @updateURL https://update.greasyfork.org/scripts/32930/APEX%20extension%3A%20Switch%20Application.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // add "app switch" button to APEX Page Designer utilities menu bar
    var btn = '<button id="app_switch" title="Switch Application  [Ctrl+Alt+A]" class="a-Button a-Button--noLabel a-Button--iconTextButton js-menuButton a-Button--gapRight a-Button--simple" type="button">' +
        '<span class="a-Icon icon-irr-icons" aria-hidden="true"></span>' +
        '<span class="a-Icon icon-menu-drop-down" aria-hidden="true"></span>' +
        '</button>';
    $('#utilitiesMenu').after(btn);

    // set "app_switch" button click event
    $('#app_switch').on('click.switch', function() {

        // set iframe url
        var se = $v('pInstance'),
            appID = $v('P4500_CURRENT_APP'),
            la = apex.jQuery("#PDrenderingTree_0 span.a-TreeView-label").first().text(),
            pageID = la.substring(5, la.indexOf(":")),
            ifrSRC = 'f?p=APEXT:APP_SWITCH:::NO::G0_INSTANCE,G0_APPID,G0_PAGEID:' + se + ',' + appID + ',' + pageID;

        $('body').append(
            '<div id="div_switch"><iframe scrolling="no" style="position:absolute;height:130px" ' +
            'src="' + ifrSRC + '"></iframe></div>');

        // define dialog
        $("#div_switch").dialog({
            close: function() {
                $(this).dialog("destroy");
                $(this).remove();
                // show scroll bar
                $("body").css("overflow", "");
            },
            create: function() {
                // hide scroll bar
                $("body").css("overflow", "hidden");
            },
            height: 181,
            width: 650,
            position: {
                my: "center top",
                at: "center top",
                of: "#a_PageDesigner",
                //of: "#app_switch"
            },
            title: "Switch Application",
            draggable: true,
            modal: true,
            resizable: false,
            closeText: "Close  [Esc]",
            overlay: {
                background: "#000",
                opacity: 0.15
            }
        });
    });

    // set shortcut keys for "app_switch" button click event
    $(document).keydown(function(e) {
        if ((e.which === 65 || e.which === 97) && e.ctrlKey && e.altKey && !$("#div_switch").length) {
            $('#app_switch').trigger('click.switch');
        }
    });
})();
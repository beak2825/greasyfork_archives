// ==UserScript==
// @name         Stackoverflow Right Sidebar Toggler
// @namespace    https://github.com/GrumpyCrouton/Userscripts/blob/master/Right%20Sidebar%20Toggler
// @version      1.0
// @description  Gives you the ability to collapse right sidebar.
// @author       GrumpyCrouton
// @match        *://*.stackoverflow.com/*
// @match        *://*.stackexchange.com/*
// @match        *://*.superuser.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369524/Stackoverflow%20Right%20Sidebar%20Toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/369524/Stackoverflow%20Right%20Sidebar%20Toggler.meta.js
// ==/UserScript==
document.onreadystatechange = function() {
    if (document.readyState === "interactive") {

        var sidebar = $('#sidebar');
        var content = $('#mainbar');

        if ($("#left-sidebar").length > 0) { //SIDE BAR EXISTS (responsive)
            //body changes

            //add space in left sidebar for options specific to visualcrumbs
            $('nav[role="navigation"] ol:first').append(' \
            <li> \
                <ol class="nav-links"> \
                    <li class="fs-fine tt-uppercase ml8 mt24 mb4 fc-light"> \
                        Options \
                    </li> \
                    <li> \
                        <a class="pl8 js-gps-track nav-links--link -link__with-icon"> \
                            <span id="visualcrumbs_hideRightBar" class="-link--channel-name">Toggle Right Sidebar</span> \
                        </a> \
                    </li> \
                </ol> \
            </li>');

            manageRightBarOnLoad();

        }

        $("#visualcrumbs_hideRightBar").click(handleRightBarCollapse);

        function handleRightBarCollapse() {

            if (sidebar.is(":visible")) {
                GM_setValue("hideRightBar", true);
                content.css("width", "100%");
                sidebar.hide();
            } else {
                GM_setValue("hideRightBar", false);
                content.css("width", "");
                sidebar.show();
            }
        }

        function manageRightBarOnLoad() {
            var result = GM_getValue("hideRightBar", false);
            if (result) {
                content.css("width", "100%");
                sidebar.hide();
            }
        }

    }
}

// ==UserScript==
// @name         template fields
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  enlarges the fields in templates
// @author       Ruben Van Hee @ Lightspeedhq
// @run-at       document-end
// @match        https://us.merchantos.com/?name=admin.listings.display_templates&form_name=listing&__sort_dir=ASC
// @downloadURL https://update.greasyfork.org/scripts/394620/template%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/394620/template%20fields.meta.js
// ==/UserScript==

(function() {
    function fieldEnlarge(){
var fields = document.querySelectorAll('.textarea.data_control');
for (i = 0, len = fields.length; i < len; i++) {
    fields[i].setAttribute("rows","50");
    fields[i].setAttribute("cols","150");
}
    }
    fieldEnlarge();
    document.addEventListener("page:load", function() {
        fieldEnlarge();
    }, false);
})();
// ==UserScript==
// @name         Magento 2 copy roles
// @namespace    dedeman
// @version      1.0
// @description  all
// @author       Dragos
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @match        https://mcprod.dedeman.ro/admin/admin/user_role/editrole/rid*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/459308/Magento%202%20copy%20roles.user.js
// @updateURL https://update.greasyfork.org/scripts/459308/Magento%202%20copy%20roles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('legend:contains(Roles Resources)').append(`<a id="copy" style="cursor: pointer; margin-left: 10px">Copy</a><a id="paste" style="cursor: pointer; margin-left: 10px">Paste</a>`);
        $('#copy').click(function() {
            $(this).fadeOut().fadeIn();
            var checkbox = {};
            $('ul.jstree-no-dots input').each(function() {
                checkbox[this.value] = this.checked;
            });
            GM_setValue('user_role_settings', JSON.stringify(checkbox));
        });
        $('#paste').click(function() {
            $(this).fadeOut().fadeIn();
            if (GM_getValue('user_role_settings')) {
                var checkbox = JSON.parse(GM_getValue('user_role_settings'));
                for (const prop in checkbox) {
                    var element = $(`ul.jstree-no-dots input[value="${prop}"]`);
                    element[0].checked = checkbox[prop];
                    var clasa = 'jstree-unchecked';
                    if (checkbox[prop]) clasa = 'jstree-checked';
                    element.parent().removeClass('jstree-unchecked jstree-checked').addClass(clasa);
                }
                GM_deleteValue('user_role_settings');
            }
            else alert('Nu am gasit informatii salvate!');
        });
    });
})();
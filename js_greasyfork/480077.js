// ==UserScript==
// @name         ElementAvatar
// @namespace    https://streamelements.com
// @version      1.0
// @description  Script for hide Elementals messages and mark them
// @author       Renziito (renziito@streamelements)
// @match        https://*.zendesk.com/agent/tickets/*
// @icon         https://instagram.flim38-1.fna.fbcdn.net/v/t51.2885-19/365391835_1210849436249927_5773702510010019885_n.jpg?stp=dst-jpg_e0_s150x150&cb=efdfa7ed-2e54251b&efg=eyJxZV9ncm91cHMiOiJbXCJpZ19ianBnX3Byb2ZpbGVfcGljXzA3MDUtMFwiXSJ9&_nc_ht=instagram.flim38-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=JOwyrYvDq2UAX-OVDh2&edm=ACWDqb8BAAAA&ccb=7-5&oh=00_AfA0FuAzKXLtuinbTAoDnI-nwEmW8nuSQftkMQe4dD6YgA&oe=655C554A&_nc_sid=ee9879
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480077/ElementAvatar.user.js
// @updateURL https://update.greasyfork.org/scripts/480077/ElementAvatar.meta.js
// ==/UserScript==

(function() {
   'use strict';
//    this.$ = this.jQuery = jQuery.noConflict(true);
    function changeAvatar() {
        var elements = getAssistantMessages();

        if (elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                jQuery(elements[i]).attr('data-role', 'bot-msg');
                jQuery(elements[i]).find('figure img').attr("src", "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Robot-3d-icon.png");
                jQuery(elements[i]).parents("article").css('display','none');
            }
        } else {
            window.setTimeout(changeAvatar, 1000);
        }

    }

    function getAssistantMessages() {
        const elementsSEAssistant = jQuery('a[href="users/StreamElements Assistant:https://static.zdassets.com/web_widget/latest/default_avatar.png"]');
        const elementsElemental = jQuery('a[href="users/Elemental:https://static.zdassets.com/web_widget/latest/default_avatar.png"]');
        let elements = { ...elementsElemental, ...elementsSEAssistant };
        elements.length = elementsElemental.length + elementsSEAssistant.length;
        return elements;
    }

changeAvatar();
})();
// ==UserScript==
// @name         More Reviews Text Replacer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace the "Oh boy! More items became available while you were doing your reviews." text with your own
// @author       RysingDragon
// @match        https://www.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368428/More%20Reviews%20Text%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/368428/More%20Reviews%20Text%20Replacer.meta.js
// ==/UserScript==
window.sample_client = {};

(function(global) {
    wkof.include('Menu,Settings');
    wkof.ready('Menu,Settings').then(install_menu).then(load_settings).then(startup);

    function install_menu() {
        wkof.Menu.insert_script_link({
            name:      'reviews_replacer',
            title:     'More Reviews Text Replacer',
            on_click:  open_settings
        });
    }

    function load_settings() {
        console.log('Loading settings...');
        return wkof.Settings.load('reviews_replacer');
    }

    function open_settings() {
        var config = {
            script_id: 'reviews_replacer',
            title: 'More Reviews Text Replacer',
            content: {
                replaced_text: {
                    type: 'text',
                    label: 'More Reviews Text',
                    default: 'Oh boy! More items became available while you were doing your reviews.',
                },
            }
        }
        var dialog = new wkof.Settings(config);
        dialog.open();
    }

    function startup() {
        var element = document.getElementsByClassName('alert alert-info')[0];
        element.textContent = wkof.settings.reviews_replacer.replaced_text;
    }

})(window.sample_client);
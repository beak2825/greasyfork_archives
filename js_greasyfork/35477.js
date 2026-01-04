// ==UserScript==
// @name         WME Virtual Keyboard
// @namespace    http://tampermonkey.net/
// @version      2017.11.20.003
// @description  Adds a "virtual keyboard" to enter non-english characters (currently only Turkish characters).
// @author       MapOMatic
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35477/WME%20Virtual%20Keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/35477/WME%20Virtual%20Keyboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function buttonOnMouseDown(evt) {
        evt.preventDefault();
        var char = $(evt.target).text();
        var element = document.activeElement;
        var $element = $(element);
        if (element && ($element.is('input:text') || $element.is('textarea'))) {
            var text = $element.val();
            var start = element.selectionStart;
            var end = element.selectionEnd;
            text = text.slice(0,start) + char + text.slice(end);
            $element.val(text);
            element.selectionStart = start+1;
            element.selectionEnd = start+1;
            $element.change();
        }
    }

    function init() {
        console.log('WME More Letters: Initializing...');

        var $menuParentDiv = $('#advanced-tools');

        var $keyboardDiv = $('<div>', {id:'more-letters-popup'})
        .css({padding:'2px', 'background-color': '#ccc',
              'box-shadow':'#b2b2b2 2px 2px 8px', 'z-index':'2001', cursor:'default', 'font-size':'13px',
              'text-align':'center', color:'black', 'margin-bottom':'4px', 'border-radius':'8px'})
        .appendTo($menuParentDiv);

        var chars = [['Ç','Ğ','I','İ','Ö','Ş','Ü'],['ç','ğ','ı','i','ö','ş','ü']];
        var $table = $('<table>');
        var buttonStyle = {width:'22px',height:'22px',padding:'unset'};
        var tdStyle = {padding:'2px 4px'};
        chars.forEach(function(row) {
            var $row = $('<tr>');
            row.forEach(function(char) {
                $row.append(
                    $('<td>').css(tdStyle).append($('<button>', {class:'waze-btn waze-btn-white'}).text(char).css(buttonStyle).mousedown(buttonOnMouseDown))
                );
            });
            $table.append($row);
        });
        $keyboardDiv.append($table);

        $keyboardDiv.mousedown(function(evt) {
            evt.preventDefault();
        }).click(function(evt) {
            evt.preventDefault();
        });
    }

    function bootstrap(retries) {
        retries = retries || 0;
        if (retries === 100) {
            console.log('WME More Letters: Initialization failed.  Exiting script.');
            return;
        }
        if (window.require && W && W.loginManager &&
            W.map && W.loginManager.isLoggedIn() && $('#advanced-tools').length) {
            init();
        } else {
            retries += 1;
            setTimeout(function () {
                bootstrap(retries);
            }, 250);
        }
    }

    bootstrap();
})();

// ==UserScript==
// @name         uTorrent Server drag&drop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow to drop a .torrent file in the µTorrent Server Web interface. This script has been tested for µTorrent Server v3.0-25053. Change the @match address by yours.
// @author       https://github.com/florianleger
// @match        http://192.168.1.14:8081/gui/
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/368873/uTorrent%20Server%20dragdrop.user.js
// @updateURL https://update.greasyfork.org/scripts/368873/uTorrent%20Server%20dragdrop.meta.js
// ==/UserScript==
var $$ = jQuery.noConflict();
(function() {
    'use strict';
    $$(document).ready(function() {
        var fileToUpload = null;
        var DROP_MESSAGE = 'Drop a .torrent here';
        var ADD_SUCCESS_MESSAGE = 'torrent added!';
        var DEFAULT_BKG_COLOR = '#f0f0f0';
        var DROP_BKG_COLOR = '#e0e0e0';
        var ADD_SUCCESS_BKG_COLOR = '#aaffaa';
        console.log('test');
        $$('#CatList').css('position', 'relative');
        $$('#CatList').append('<div id="DropZone" ' +
                              'style="position: absolute; bottom: 0; left: 0; right: 0; transition: all .2s ease; background-color: ' + DEFAULT_BKG_COLOR + '; color: #555; text-align: center; font-family: Arial; font-size: 12px; padding-top: 200px; padding-bottom: 200px;"' +
                              '>' + DROP_MESSAGE + '</div>');
        var dropZone = $$('#DropZone');
        var submitButton = $$('#ADD_FILE_OK');
        var form = $$('#upfrm');
        $$('#torrent_file').remove();
        dropZone.append('<input type="file" name="torrent_file" id="torrent_file" style="position: absolute; cursor: pointer; left: 0px; top: 0px; bottom: 0; right: 0; opacity: 0; height: 100% !important; width: 100%; margin: 0;">');
        $$('#torrent_file').on('dragover', dragOverEventHandler);
        $$('#torrent_file').on('dragenter', dragEnterEventHandler);
        $$('#torrent_file').on('dragleave', dragLeaveEventHandler);
        $$('#torrent_file').on('drop', dropEventHandler);
        _initFileInputZone();
        /**
        * Initializes the invisible file input that covers the drop area.
        */
        function _initFileInputZone() {
            $$('#torrent_file').detach().appendTo('#DropZone');
        }
        function dragOverEventHandler(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        function dragEnterEventHandler(e) {
            dropZone.css('backgroundColor', DROP_BKG_COLOR);
        }
        function dragLeaveEventHandler(e) {
            dropZone.css('backgroundColor', DEFAULT_BKG_COLOR);
        }
        function dropEventHandler(e) {
            if(e.originalEvent.dataTransfer){
                if(e.originalEvent.dataTransfer.files.length) {
                    setTimeout(function(){
                        $$('#torrent_file').detach().appendTo('#upfrm .hcont:first-child');
                        submitButton.click();
                        dropZone.css('background-color', ADD_SUCCESS_BKG_COLOR);
                        dropZone.text(ADD_SUCCESS_MESSAGE);
                        setTimeout(function() {
                            dropZone.text(DROP_MESSAGE);
                            dropZone.css('background-color', DEFAULT_BKG_COLOR);
                            _initFileInputZone();
                        }, 300);
                        console.log('OK');
                    }, 0);
                }
            }
        }
    });
})();
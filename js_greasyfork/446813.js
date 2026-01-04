// ==UserScript==
// @name         vectorizer.io free download
// @version      0.0.2
// @description  vectorizer.io svg preview and free download
// @icon         https://www.vectorizer.io/icon.svg

// @author       You
// @namespace    http://tampermonkey.net/
// @license      MIT

// @match        https://www.vectorizer.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446813/vectorizerio%20free%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/446813/vectorizerio%20free%20download.meta.js
// ==/UserScript==

/* eslint-env jquery */

(function() {
    'use strict';
    function toURL() {
        const svg = $('#outputsvg')[0];
        const content = new XMLSerializer().serializeToString(svg);
        const type = 'image/svg+xml';
        const url = URL.createObjectURL(new Blob([content], {type}));
        return url;
    }

    $('#downloadbtn').off('click').on('click', function(event) {
        event.preventDefault();
        const a = document.createElement('a');
        a.download = this.href.split('/').pop();
        a.href = toURL();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    const btn = $('<button class="btn btn-secondary">Preview</button>');
    btn.on('click', function(event) {
        open(toURL());
    });
    $('#downloadbtn').after(btn);
    
    $(`<style>#nomorecreditsmodal, body>.modal-backdrop.fade.show,#freedownloadmodal { display: none !important; }</style>`).appendTo("head");

})();

// ==UserScript==
// @name         FA Advanced Filter
// @namespace    FurAffinity
// @version      1.03
// @description  On furaffinity.net, hides thumbnails according to desired rating(s) and/or art medium.
// @author       Toboe
// @grant        none
// @run-at       document-end
// @match        *://*.furaffinity.net/*
// @exclude      *://*.furaffinity.net/search
// @exclude      *://*.furaffinity.net/search/*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/29428/FA%20Advanced%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/29428/FA%20Advanced%20Filter.meta.js
// ==/UserScript==

(function() {
        'use strict';

        console.log("FA Advanced Filter");

        const $ = jQuery;

        const artRatings = {
            general: { key: 'general', classId: 'r-general', on: true},
            mature: { key: 'mature', classId: 'r-mature', on: true},
            adult: { key: 'adult', classId: 'r-adult', on: true}
        };

        const artTypes = {
            img: { key: 'image', classId: 't-image', on: true},
            txt: { key: 'text', classId: 't-text', on: true},
            audio: { key: 'audio', classId: 't-audio', on: true}
        };

        const updateFilteredView = function() {
            for(let rating in artRatings) {
                for(let type in artTypes) {
                    let selector = 'figure.' + artRatings[rating].classId + '.' + artTypes[type].classId;
                    let figure = $(selector);
                    figure.each(function(){
                            $(this).toggle(artRatings[rating].on && artTypes[type].on);
                       }
                    );
                }
            }
        };

        const attachPoint = $("body");
        if (attachPoint.length) {
            attachPoint.prepend(`
<input type="checkbox" id="generalControl" checked /> <strong>General</strong>
<input type="checkbox" id="matureControl" checked /> <strong>Mature</strong>
<input type="checkbox" id="adultControl" checked /> <strong>Adult</strong>
<input type="checkbox" id="imageControl" checked /> <strong>Images</strong>
<input type="checkbox" id="textControl" checked /> <strong>Writing</strong>
<input type="checkbox" id="audioControl" checked /> <strong>Music</strong>
            `);
        }

        const checkboxChanged = function(key) {
            let isOn = $('#' + key + 'Control').prop('checked');
            for(let rating in artRatings) {
                if(artRatings[rating].key === key) {
                    artRatings[rating].on = isOn;
                }
            }
            for(let type in artTypes) {
                if(artTypes[type].key === key) {
                    artTypes[type].on = isOn;
                }
            }
            updateFilteredView();
        };

        for(let rating in artRatings) {
            $('#' + artRatings[rating].key + 'Control').click(function() { checkboxChanged(artRatings[rating].key); } );
        }
        for(let type in artTypes) {
            $('#' + artTypes[type].key + 'Control').click(function() { checkboxChanged(artTypes[type].key); } );
        }

        updateFilteredView();
    }
)();
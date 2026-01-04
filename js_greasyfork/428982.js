// ==UserScript==
// @name         RYM Submission Shortcuts
// @namespace    http://rateyourmusic.com/
// @version      1.1
// @description  Adds direct links to various RYM submission pages to your navigation bar.
// @author       MisterMan
// @match        https://rateyourmusic.com/*
// @match        https://rateyourmusic.com/*/*
// @icon         https://e.snmc.io/2.5/img/sonemic.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428982/RYM%20Submission%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/428982/RYM%20Submission%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let add = setInterval(() => {
        if (document.readyState === 'complete') {
            let headerContents = document.getElementById('header_extended_section');

            if (!headerContents) { return }

            let insertionPoint = headerContents.children[9];

            let addProfile = document.createElement('a');
            addProfile.innerText = 'Add Profile';
            addProfile.href = 'https://rateyourmusic.com/artist/profile_ac';
            addProfile.classList.add('header_item');
            headerContents.insertBefore(addProfile, insertionPoint);

            let addLabel = document.createElement('a');
            addLabel.innerText = 'Add Label';
            addLabel.href = 'https://rateyourmusic.com/labels/label_ac';
            addLabel.classList.add('header_item');
            headerContents.insertBefore(addLabel, insertionPoint);

            let addMusicRole = document.createElement('a');
            addMusicRole.innerText = 'Add Music Role';
            addMusicRole.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=e&context=p';
            addMusicRole.classList.add('header_item');
            headerContents.insertBefore(addMusicRole, insertionPoint);

            let addMusicGenre = document.createElement('a');
            addMusicGenre.innerText = 'Add Music Genre';
            addMusicGenre.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=h&context=p';
            addMusicGenre.classList.add('header_item');
            headerContents.insertBefore(addMusicGenre, insertionPoint);

            let addMusicDescriptor = document.createElement('a');
            addMusicDescriptor.innerText = 'Add Music Descriptor';
            addMusicDescriptor.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=d&context=p';
            addMusicDescriptor.classList.add('header_item');
            headerContents.insertBefore(addMusicDescriptor, insertionPoint);

            let addVAClassifier = document.createElement('a');
            addVAClassifier.innerText = 'Add V/A Classifier';
            addVAClassifier.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=l&context=v';
            addVAClassifier.classList.add('header_item');
            headerContents.insertBefore(addVAClassifier, insertionPoint);

            let addFilm = document.createElement('a');
            addFilm.innerText = 'Add Film';
            addFilm.href = 'https://rateyourmusic.com/films/ac';
            addFilm.classList.add('header_item');
            headerContents.insertBefore(addFilm, insertionPoint);

            let addFilmRole = document.createElement('a');
            addFilmRole.innerText = 'Add Film Role';
            addFilmRole.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=e&context=f';
            addFilmRole.classList.add('header_item');
            headerContents.insertBefore(addFilmRole, insertionPoint);

            let addFilmGenre = document.createElement('a');
            addFilmGenre.innerText = 'Add Film Genre';
            addFilmGenre.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=h&context=f';
            addFilmGenre.classList.add('header_item');
            headerContents.insertBefore(addFilmGenre, insertionPoint);

            let addFilmDescriptor = document.createElement('a');
            addFilmDescriptor.innerText = 'Add Film Descriptor';
            addFilmDescriptor.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=d&context=f';
            addFilmDescriptor.classList.add('header_item');
            headerContents.insertBefore(addFilmDescriptor, insertionPoint);

            let addGameRole = document.createElement('a');
            addGameRole.innerText = 'Add Game Role';
            addGameRole.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=e&context=V';
            addGameRole.classList.add('header_item');
            headerContents.insertBefore(addGameRole, insertionPoint);

            let addGameGenre = document.createElement('a');
            addGameGenre.innerText = 'Add Game Genre';
            addGameGenre.href = 'https://rateyourmusic.com/admin/queue/hq/queue_ac?type=h&context=V';
            addGameGenre.classList.add('header_item');
            headerContents.insertBefore(addGameGenre, insertionPoint);

            console.log('Submission links added');
            clearInterval(add);
        }
    }, 100);
})();
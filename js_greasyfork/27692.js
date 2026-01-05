// ==UserScript==
// @name         Jisho Audio Downloader
// @namespace    http://miere.ru/
// @version      0.1
// @description  Adds download audio button to Jisho.org pages which downloads word audio clips.
// @author       Vladislav <miere> Vorobiev
// @match        http://jisho.org/search/*
// @match        http://jisho.org/word/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27692/Jisho%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/27692/Jisho%20Audio%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getWordNameFromAudioID(audioID) {
        if (!audioID || audioID.length < 7) return "unknown";
        var result = "";
        for (var i = 6; i < audioID.length && audioID[i] !== ':'; ++i) {
            result = result + audioID[i];
        }
        return result;
    }

    function getFileExtension(file) {
        if (!file || file.length === 0) return "";
        var extension = [];
        var seperatorFound = false;
        for (var i = file.length - 1; i > 0; --i) {
            if (file[i] === '.') {
                extension.add(file[i]);
                extension.reverse();
                break;
            } else {
                extension.add(file[i]);
            }
        }
        return extension.join('');
    }

    function insertNodeAfter(insertNode, afterNode) {
        afterNode.parentNode.insertBefore(insertNode, afterNode.nextSibling);
    }

    function downloadFileWithFileName(url, fileName) {
        var URL = window.URL || window.webkitURL;

        var xhr = new XMLHttpRequest(),
            a = document.createElement('a'), file;

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onerror = function() {
            a.href = url;
            a.download = fileName;
            a.click();
        };
        xhr.onload = function() {
            file = new Blob([xhr.response], { type : 'application/octet-stream' });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        };
        xhr.send();
    }

    var audioElements = document.getElementsByTagName('audio');
    for (var i = 0; i < audioElements.length; ++i) {
        var audioElement = audioElements[i];
        var audioID = audioElement.id;
        var audioLinkElement = audioElement.nextElementSibling;
        if (!audioLinkElement || !audioLinkElement.dataset || audioLinkElement.dataset.id != audioID) {
            continue; // @TODO: Site layout has changed, skip this or show alert?
        }
        var downloadAudioElement = document.createElement('a');
        downloadAudioElement.className = 'concept_light-status_link';
        downloadAudioElement.dataset.href = audioElement.children[0].src;
        downloadAudioElement.dataset.download = getWordNameFromAudioID(audioID) + getFileExtension(downloadAudioElement.dataset.href);
        downloadAudioElement.innerText = 'Download audio';
        downloadAudioElement.addEventListener('click', function(ev) {
            downloadFileWithFileName(ev.target.dataset.href, ev.target.dataset.download);
        });
        insertNodeAfter(downloadAudioElement, audioLinkElement);
    }
})();
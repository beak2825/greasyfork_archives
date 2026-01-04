// ==UserScript==
// @name         Kemono File Ripper
// @namespace    Tampermonkey/Violentmonkey Scripts
// @version      1.2.1
// @description  Rips all images and videos from Kemono and downloads them as a zip
// @author       Selentia
// @icon         https://raw.githubusercontent.com/Selentia-IX/kemono-file-ripper/main/kr-png.png
// @match        https://kemono.party/*
// @match        https://kemono.cr/*
// @copyright    2025+, Selentia (https://github.com/Selentia-IX/kemono-file-ripper)
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @description  Rips all the static images and videos and files from Kemono and downloads them as a zip
// @downloadURL https://update.greasyfork.org/scripts/545396/Kemono%20File%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/545396/Kemono%20File%20Ripper.meta.js
// ==/UserScript==

/* global JSZip, saveAs, jQuery */

(function waitForLibs() {
    if (typeof JSZip === 'undefined' || typeof saveAs === 'undefined' || typeof jQuery === 'undefined') {
        setTimeout(waitForLibs, 100);
        return;
    }

    (function($) {
        'use strict';

        function sanitizeString(str) {
            return str.replace(/[\\/:*?"<>|]/g, '_').trim();
        }

        function showLoadingBar(percent) {
            let bar = $('#kemono-download-loading');
            if (!bar.length) {
                bar = $('<div id="kemono-download-loading">')
                    .css({
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '5px',
                        background: '#eee',
                        zIndex: 99999
                    })
                    .append($('<div id="kemono-download-progress">').css({
                        height: '100%',
                        width: '0%',
                        background: '#ff9500'
                    }));
                $('body').append(bar);
            }
            $('#kemono-download-progress').css('width', percent + '%');
        }

        function hideLoadingBar() {
            $('#kemono-download-loading').remove();
        }

        async function downloadKemonoMedia() {
            const zip = new JSZip();
            let mediaLinks = [];

            $('.post__thumbnail a.fileThumb').each(function() {
                const url = $(this).attr('href');
                const filename = $(this).attr('download') || url.split('/').pop().split('?')[0];
                mediaLinks.push({url, filename});
            });

            $('.post__video').each(function() {
                const url = $(this).attr('src');
                if (url) {
                    let filename = url.split('/').pop().split('?')[0];
                    const att = $('.post__attachment-link[href*="' + filename + '"]');
                    if (att.length) filename = att.attr('download') || filename;
                    mediaLinks.push({url, filename});
                }
            });

            $('.post__attachment-link').each(function() {
                const url = $(this).attr('href');
                const filename = $(this).attr('download') || url.split('/').pop().split('?')[0];
                if (!mediaLinks.some(m => m.filename === filename)) {
                    mediaLinks.push({url, filename});
                }
            });
            // filters duplicates (feel free to remove it if it conflicts with the file you want)
            mediaLinks = mediaLinks.filter((media, idx, arr) =>
                arr.findIndex(m => m.filename === media.filename) === idx
            );

            const total = mediaLinks.length;
            let completed = 0;

            const title = sanitizeString($('.post__title span').first().text() || 'Kemono_Post');
            const creator = sanitizeString($('.post__user-name').first().text() || 'Unknown_Creator');
            const zipName = `${title} by ${creator}.zip`;

            if (total === 0) {
                alert('No images or videos found!');
                return;
            }

            showLoadingBar(0);

            let saveHandler = saveAs;
            let usePicker = false;
            if ('showSaveFilePicker' in window) {
                usePicker = true;
            }

            const fetchPromises = mediaLinks.map(media =>
                fetch(media.url)
                    .then(response => {
                        if (!response.ok) throw new Error('Network error');
                        return response.blob();
                    })
                    .then(blob => {
                        const index = mediaLinks.indexOf(media) + 1;
                        const ext = media.filename.includes('.') ? media.filename.split('.').pop() : '';
                        const baseName = title !== 'Kemono_Post' ? title : 'file';
                        const newFilename = `${sanitizeString(baseName)}_${index}${ext ? '.' + ext : ''}`;
                        zip.file(newFilename,  blob);
                    })
                    .catch(() => {
                        alert(`Failed to download ${media.filename}`);
                    })
                    .finally(() => {
                        completed++;
                        showLoadingBar(Math.round((completed / total) * 100));
                    })
            );

            await Promise.all(fetchPromises);

            zip.generateAsync({type:"blob"}).then(async function(content) {
                hideLoadingBar();
                if (usePicker) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: zipName,
                            types: [{
                                description: 'Zip Files',
                                accept: {'application/zip': ['.zip']}
                            }]
                        });
                        const writable = await handle.createWritable();
                        await writable.write(content);
                        await writable.close();
                    } catch (e) {
                        saveHandler(content, zipName);
                    }
                } else {
                    saveHandler(content, zipName);
                }
            });
        }

        function insertDownloadButton() {
            if ($('#kemono-download-btn').length) return;
            const actions = $('.post__actions');
            if (!actions.length) return;
            const btn = $('<button id="kemono-download-btn">')
                .text('Download Media')
                .css({
                    marginLeft: '10px',
                    padding: '5px 10px',
                    background: '#ff9500',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                })
                .click(function() {
                    $(this).prop('disabled', true);
                    downloadKemonoMedia().finally(() => {
                        $(this).prop('disabled', false);
                    });
                });
            actions.append(btn);
        }

        $(document).ready(function() {
            insertDownloadButton();
        });

        const observer = new MutationObserver(() => {
            insertDownloadButton();
        });
        observer.observe(document.body, {childList: true, subtree: true});
        })(jQuery);
    })();



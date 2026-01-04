// ==UserScript==
// @name         YouTube™ Multi Downloader v0.3
// @description  This script adds a download button
// @version      0.5
// @date         2024-02-5
// @icon         https://i.imgur.com/InuDDVK.png
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @license      CC-BY-NC-ND-4.0
// @match        *://*.youtube.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/1257725
// @downloadURL https://update.greasyfork.org/scripts/486702/YouTube%E2%84%A2%20Multi%20Downloader%20v03.user.js
// @updateURL https://update.greasyfork.org/scripts/486702/YouTube%E2%84%A2%20Multi%20Downloader%20v03.meta.js
// ==/UserScript==

// Load the Google API script
var script = document.createElement('script');
script.src = 'https://apis.google.com/js/platform.js';
document.head.appendChild(script);

if (typeof _youtube === 'undefined') {
    var _youtube = {
        currentLink: '//yt1s.ltd',
        currentMedia: null,

        init: function () {
            _youtube.pageLoad();
        },

        addClick: function () {
            if (location.href.includes('youtube.com') && /v=[a-zA-Z0-9-_]{11}/.test(location.href)) {
                var tubeID = RegExp.lastMatch.substr(2);
                var newInterface = $('#meta-contents');

                if (newInterface.length) {
                    // Add retro button styles
                    const retroStyles = `
                        /* Your existing styles here */
                        .custom-button.round-button {
                            border-radius: 50px;
                        }

                        /* Additional styles for button */
                        .custom-button {
                            display: inline-block;
                            text-decoration: none;
                            padding: 0.5rem 1rem;
                            border: none;
                            background-color: #1c9c6f; /* YouTube red background color */
                            color: #fff; /* White text color */
                            font-family: "Roboto", "Arial", sans-serif;
                            text-align: center;
                            font-size: 14px;
                            line-height: 1.5;
                            cursor: pointer;
                            transition: background-color 0.3s ease-in-out;
                        }

                        .custom-button:hover {
                            background-color: #ff5555; /* Darker red on hover */
                        }
                    `;

                    // Append retro styles to the head of the document
                    $('head').append(`<style>${retroStyles}</style>`);

                    // Load Font Awesome CSS (not needed anymore, as there is no icon)
                    // var fontAwesomeCSS = `
                    //     @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
                    // `;
                    // $('head').append(`<style>${fontAwesomeCSS}</style>`);

                    // Create and append the download button
                    var addButton = $('<div class="style-scope ytd-watch-metadata" id="_youtube" style=""><a class="custom-button round-button" target="_blank" href="' + _youtube.currentLink + '/https://youtube.com/watch?v=' + tubeID + '">Download</a></div>');
                    var subsBtn = $('#subscribe-button');
                    subsBtn.before(addButton[0]);

              
                }
            }
        },

        pageLoad: function () {
            if (document.body && document.domain === 'www.youtube.com') {
                setInterval(_youtube.inspectPg, 1000);
                _youtube.inspectPg();
            }
        },

        inspectPg: function () {
            if (_youtube.currentMedia !== location.href && typeof ytplayer !== 'undefined' && ytplayer) {
                _youtube.currentMedia = location.href;
                if ($('#_youtube').length) {
                    $('#_youtube').remove();
                }
            }
            if ($('#meta-contents')[0] && !$('#_youtube')[0] && typeof ytplayer !== 'undefined' && ytplayer) {
                _youtube.addClick();
            }
        },
    };
}

// Initialize the script
_youtube.init();

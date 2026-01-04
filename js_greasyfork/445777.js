// ==UserScript==
// @name         Ultimate Lobby Additional Styling for Webcamdarts
// @namespace    https://greasyfork.org/en/users/913506-alexisdot
// @version      0.1.1
// @description  Additional styling for Antoine Maingeot's Ultimate Webcamdarts Lobby
// @author       AlexisDot
// @license      MIT
// @match        https://www.webcamdarts.com/GameOn/Lobby*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webcamdarts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445777/Ultimate%20Lobby%20Additional%20Styling%20for%20Webcamdarts.user.js
// @updateURL https://update.greasyfork.org/scripts/445777/Ultimate%20Lobby%20Additional%20Styling%20for%20Webcamdarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.head.insertAdjacentHTML("beforeend",
                                     `
    <style>
                    .rMenu.userli.available {
                        background: #DDD;
                        border: 0px solid transparent;
                        border-bottom: 10px solid green;
                        color: #030303;
                    }

                    .rMenu.userli.busy {
                        background: #BBB;
                        border: 0px solid transparent;
                        border-bottom: 10px solid red;
                        color: #030303;
                    }

                    .userinfo .fn {
                        color: #444
                    }

                    #nav,
                    .band.navigation {
                        max-width: calc(100% - 300px);
                        position: absolute;
                        z-index: 10;
                        width: calc(100% - 300px);
                    }

                    #nav>div:first-child {
                        width: 800px;
                        /*! max-width: 100%; */
                    }

                    #nav>div:first-child .container {
                        width: 800px;
                        max-width: 800px;
                    }

                    .useroptions {
                        display: block !important;
                    }

                    .useropt {
                        width: 150px !important;
                        height: 28px !important;
                    }

                    .useropt:first-child {
                        top: 28px !important;
                    }

                    .cusermenu {
                        display: none;
                    }

                    #users {
                        height: 85vh !important
                    }

                    .uwdal-clickable {
                        text-decoration: underline !important;
                        cursor: pointer !important;
                        font-weight: bold !important;
                    }
                    }
    </style>
    `)

    // Your code here...
})();
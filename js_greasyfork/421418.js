// ==UserScript==
// @name         Git-Phantom
// @namespace    http://tampermonkey.net/
// @github       https://github.com/Git-Phantom
// @license      Apache License 2.0
// @version      0.0.3
// @description  Bloble Pack Rank XP [ API ]
// @author       Git-Phantom
// @match        http://bloble.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421418/Git-Phantom.user.js
// @updateURL https://update.greasyfork.org/scripts/421418/Git-Phantom.meta.js
// ==/UserScript==

$(document)
        .ready(function () {

                $('#instructionsText, #youtuberOf, .adsbygoogle')
                        .remove()

                var ngrok = prompt("Please enter API server : ", "");

                if (ngrok == null || ngrok == "") { // Connect the game to the API.
                        alert('Connection False ')
                } else {

                        var phantomConnection = $("<script />", {
                                id: 'phantom_js'
                                , class: 'js_phantom'
                                , src: ngrok + '/api/game_api/routes.php'

                        })
                        $("#darkener")
                                .append(phantomConnection)

                        var openconn = $("<button />", { // Connect the API to  player.
                                id: 'openConn'
                                , type: 'button'
                                , onclick: "start()"
                                , style: 'margin-left: 20px; background-color: red; color: white; font-family: "regularF"; font-size: 26px; padding: 6px; border: none; border-radius: 4px; '
                        })

                        $('#userInfoContainer')
                                .append(openconn)
                        $('#openConn')
                                .text('Open Connection')

                        $(function application() {

                                var tag = $("<div />", {
                                        id: 'phantomdiv'
                                        , class: 'phantomd'
                                })
                                $("body")
                                        .append(tag)

                                var phantom = $("<script />", {
                                        id: 'phantom_js'
                                        , class: 'js_phantom'
                                        , src: 'https://rawcdn.githack.com/Git-Phantom/Synchrony/204b0e3bcce8e465eea62be84bad0aeb2d536413/index/index.js' // SOURCE CODE
                                })
                                $("#phantomdiv")
                                        .append(phantom)

                        })


                }

        })

// ==UserScript==
// @name         XXXX Dark-Mode | gookieAT
// @version      1.0
// @description  A Dark-Mode for xxxx.report from gookieAT.
// @author       gookieAT
// @match        https://xxxx.report/*
// @icon         https://www.google.com/s2/favicons?domain=xxxx.report
// @namespace https://greasyfork.org/users/765704
// @downloadURL https://update.greasyfork.org/scripts/425622/XXXX%20Dark-Mode%20%7C%20gookieAT.user.js
// @updateURL https://update.greasyfork.org/scripts/425622/XXXX%20Dark-Mode%20%7C%20gookieAT.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.innerHTML =   `
                        body {
                            background-color: #202020;
                        }

                        .valorant {
                            background-color: #303030;
                            color: #ff4655;
                        }

                        .menu {
                            color: #808080;
                        }

                        header a {
                            color: #808080;
                        }

                        nav {
                            background: #404040;
                        }

                        .sonstige {
                            background-color: #303030;
                            color: #463564;
                        }

                        .sea-of-thieves {
                            background-color: #303030;
                            color: #19cccf;
                        }

                        .dayz {
                            background-color: #303030;
                            color: #4f5343;
                        }

                        .counter-strike {
                            background-color: #303030;
                            color: #d97b00;
                        }

                        .battlefield-v {
                            background-color: #303030;
                            color: #3f6435;
                        }
                    `;
document.getElementsByTagName('head')[0].appendChild(style);
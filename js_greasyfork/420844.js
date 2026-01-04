// ==UserScript==
// @name         Open Discord message links in desktop client
// @namespace    https://jacken.men
// @version      1.1
// @description  Replace Discord message links with links using discord:// protocol so that the messages open in the desktop client.
// @author       jack1142
// @license      Apache-2.0; https://www.apache.org/licenses/LICENSE-2.0
// @match        *://*/*
// @exclude      /^https?://(?:(?:ptb|canary|www)\.)?discord(?:app)?\.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420844/Open%20Discord%20message%20links%20in%20desktop%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/420844/Open%20Discord%20message%20links%20in%20desktop%20client.meta.js
// ==/UserScript==

// Copyright 2021 Jakub Kuczys (https://github.com/jack1142)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function() {
    'use strict';

    const LINK_REGEX = /^https?:\/\/(?:(?:ptb|canary|www)\.)?discord(?:app)?\.com\/channels\/((?:\d{15,21}|@me)\/\d{15,21}\/\d{15,21})\/?$/i;

    const links = document.querySelectorAll("a[href]");

    for (let link of links) {
        const match = link.href.match(LINK_REGEX);
        if (match === null) {
            continue;
        }
        link.href = `discord://discord.com/channels/${match[1]}`;
    }
})();

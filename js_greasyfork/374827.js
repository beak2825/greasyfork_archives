// ==UserScript==
// @name         Recolor.me Tag Auto-Select
// @namespace    https://recolor.me/
// @version      0.1
// @description  Automatically selects the "Adult" tag from the dropdown when creating a new post
// @author       edikit
// @match        https://recolor.me/community/2/GD/new_topic
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374827/Recolorme%20Tag%20Auto-Select.user.js
// @updateURL https://update.greasyfork.org/scripts/374827/Recolorme%20Tag%20Auto-Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByName("forum_topic_content")[0].options[1].selected=true;

})();
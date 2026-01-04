// ==UserScript==
// @name         Pillar videos excel
// @namespace    blah
// @version      0.1
// @description  ayy lmao
// @author       Saladino
// @match        http://moodle.escuelapolitecnica.es/course/*
// @icon         https://www.google.com/s2/favicons?domain=escuelapolitecnica.es
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438678/Pillar%20videos%20excel.user.js
// @updateURL https://update.greasyfork.org/scripts/438678/Pillar%20videos%20excel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var anchors = document.getElementsByTagName("a");

    for (var i = 0; i < anchors.length; i++) {
        let child = anchors[i].getElementsByTagName('iframe')[0]
        if (typeof(child) !== "undefined") {
            let test = child.src
            let url = test.split('&w=')
            anchors[i].href = url[0]
            console.log(anchors[i])
            anchors[i].firstChild.data = 'Link directo'
        }
    }
})();
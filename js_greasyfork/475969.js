// ==UserScript==
// @name         MusicBrainz :: Hide Ninja McTits Search Results
// @namespace    https://greasyfork.org/en/scripts/475969-musicbrainz-hide-ninja-mctits-search-results
// @version      1.0
// @description  Hides all search results for artist "Ninja McTits"
// @author       newstarshipsmell
// @match        https://musicbrainz.org/search?query=*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFWSURBVFhH7dctUgNBGIThiAhERA6AQEYgcSBwcAREDpAD5AYRCEQkkgNwAKpAIpAcAoHYAyAQk16gqzqdb3ay4acQI54qMjuz71eJYHeQUtrJ/dlyHK33FS6WID4F/Pn5uZkf38GEn/sIF3MQncBDG7cBErzDFfT6ZsJFh9geLBgmXv8agBqYwZDXu4SLCqFzDxP3SFw9wyn35ISLLQT2Pei418LuFg64120s4MZDmGsoh2csGHmDBYx4htY+4KYnHunCcxIqeYUpz7U0fuOBEp61yDaeeFYHCCNdeDYIFPFsHaAOUAeoA9QB6gD/aoDGAyU8GwUKwn/HY7jWQAnPBoGc/AMJ4cZH8KihHJ6xSGS7RzKFwMfLRxfulVCk30OpQqT9WZYaVdxnQfreY7lC7BA2fhZet/DPvpgoRC/gJTPA772aKYRHcGkD/M3LqcIAOwXXpcEKYYLRyiFtp7gAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475969/MusicBrainz%20%3A%3A%20Hide%20Ninja%20McTits%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/475969/MusicBrainz%20%3A%3A%20Hide%20Ninja%20McTits%20Search%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var NinjaMcTits = document.querySelectorAll('a[href$="/artist/c0bd0de1-3236-4e60-8155-228dac45671b"]');
    for (var i = 0, len = NinjaMcTits.length; i < len; i++) {
        NinjaMcTits[i].parentNode.parentNode.style.display = 'none';
    }
    if (NinjaMcTits.length > 0) {
        document.querySelector('p.pageselector-results').innerHTML += '<br><br>Hid ' + NinjaMcTits.length + ' unwanted result' + (NinjaMcTits.length > 1 ? 's' : '') + ' for artist:"Ninja McTits"';
    }
})();
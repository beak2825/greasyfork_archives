// ==UserScript==
// @name         by mafia, jebać każdego przegranego
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        http://bubble.am/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30627/by%20mafia%2C%20jeba%C4%87%20ka%C5%BCdego%20przegranego.user.js
// @updateURL https://update.greasyfork.org/scripts/30627/by%20mafia%2C%20jeba%C4%87%20ka%C5%BCdego%20przegranego.meta.js
// ==/UserScript==

(function () {
    var chat = document.querySelector('#chat_textbox');
    var shortcuts = {};

    function append(key, value) {
        shortcuts[key] = value;
    }
    append('/d', 'Było dobrze. ✓ Nie przejmuj się. ✓ Następnym razem będzie lepiej. ✓');
    append('/z', 'Ups nie wyszło × To nic. ✓ Rewanżyk? czy się cykacie? ✓');
    append('/h', 'Nie rozmawiam z ludźmi niepełnosprawnymi. ✓');
    append('/1', 'Z rangą na minusie nie gram ×, wybacz! ✓');
    append('/2', 'Tak! × Już pampersa zaczynam zmieniać! ✓');
    append('/r', 'Serdecznie zapraszam na rewanżyk! ✓');
    append('/a', 'Dziękujemy za przyjęcie rewanżu! ✓');
    append('/l', '2 tysiące lat później... ✓');
    append('/n', 'Nie dodam za mały level.×');
    append('/t', 'Dodam ✓');
    append('/o', 'Opuść klan to dodam ✓');
    append('/i', 'Zapraszam wszystkich do klanu SOWA. Rekrutacja od 50 levela, jeśli jesteś zainteresowany napisz!');

    chat.oninput = function (e) {
        e.preventDefault();
        var value = this.value;
        var key = exists(value);
        if (key) {
            this.value = shortcuts[key];
        }
    }

    function exists(v) {
        return Object.keys(shortcuts).find(function (key) {
            return v.indexOf(key) === 0 && v === key;
        });
    }
}());

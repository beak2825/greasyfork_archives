// ==UserScript==
// @name         GazelleGames :: Weblinks [Search] Links on Edit Pages
// @namespace    https://greasyfork.org/en/scripts/519678-gazellegames-weblinks-search-links-on-edit-pages
// @version      1.0
// @description  On Group Edit pages, replaces the Weblinks section's search links with '[Search]' instead of '[S]' and moves them to the right of the text boxes.
// @author       newstarshipsmell
// @include      /https://gazellegames\.net/torrents\.php\?action=editgroup&groupid=\d+/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMbSURBVDhPARAD7/wAKUVdIkFdJEVkKUppJkNhKkViJUJgJUNlLkNeKztUJEVoH0FmMkRcJ0BeHT9kMUVeADdGZSw8XTBFYik/VyU6TS9FUy5GUixGUytIWipFVipKYSVFWitCUitGVydGWyhDVAAnQVgnQVgqRF0sRl8tSGMqRWApR2MvTmspSmkoS2ssR2IsRFwrRmEtQ1ssQFgkQl4AI0ZcKUhcKkVYJD9ULEZhOVRyN1FyPFZ3O16EPF+FPVFpNURZL0xsKjxUNUBSKUdpACxEZjBBWzVAUqmzv+v5//H///T//7TCw0RshUZneqSxt+Dx+OX//+7//9Xd3zJOYwAmQ2ElOVGrt8Xd6fWOobBGYXRhe4ygt8VUgJ2huMbo8/miuck4WnVCVWSGk5w3U2kAIkVbVG593O33fpOkP2KARHScUIOwXY65W4uz2eb2tsLST3OXOmGINU9qNktmJUJiAC4/W3N7jtjc51JgbUpshU6Do1OPsWGcvHSpydDc3JSlrEx+n0JxjzlZbilMYiVFXAAnR15pdYXCzt5KbYBNcYG0u8HRzMnGzMh4rNTD0tWCprRKgKSZoazZy8vDzdlVZ3EAKkBnU19vs6+uhIKPSGaKSoCsgJ62xLW4dZ60rLe7pa6zWX6bQm+QSmFzq7S9Vl5pAClDXCJFWH6Xnquztm+CkEZ0i3udqaeinluUsXictquqso6YpDJjhEFkd6eutE1khAAsP1AsQ2IlPlxecX+WnqChoKaRlaGPoKpKe5lciqxueoiUlZmXqbWam5aYjYcvR2MAIUZjMkJbN0ZbKkphM1hyPFRwTGeFOmaJRW2QOmiJRXONM1t1NE9qOUVVOEJOK0ddABVAYxk9TSJASxs+VBxBXBtCUyFFVRo8VxpBaB47TR0+TR1BVxk0USREaxVBaBQ+VwAbJT4SLkYHJkITIz309v/29vjx8vf49//p/v/19vj++/b19PL+//8SJDgKKEQTKDkAGCcsESxHBi1OAic5Fy85FCU3FixDCic5ECg0Eyk+CiI+EytFDis9DzBDCyY7FyY790ND5+M5E2cAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519678/GazelleGames%20%3A%3A%20Weblinks%20%5BSearch%5D%20Links%20on%20Edit%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/519678/GazelleGames%20%3A%3A%20Weblinks%20%5BSearch%5D%20Links%20on%20Edit%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.querySelectorAll('td.weblinksTitle a');
    for (var i = 0, len = links.length; i < len; i++) {
        if (links[i].textContent != '[S]') {
            continue;
        }
        links[i].textContent = '[Search]';
        links[i].parentNode.nextSibling.nextSibling.appendChild(links[i]);
    }
})();
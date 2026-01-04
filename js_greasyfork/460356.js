// ==UserScript==
// @name     Transform youtube's new handle url into the old /channel/id format
// @description turns youtube handles into a channel id in the url
// @author clickednebula3
// @match    *.youtube.com/@*
// @run-at   document-start
// @version  1.0
// @namespace https://greasyfork.org/users/1030152
// @downloadURL https://update.greasyfork.org/scripts/460356/Transform%20youtube%27s%20new%20handle%20url%20into%20the%20old%20channelid%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/460356/Transform%20youtube%27s%20new%20handle%20url%20into%20the%20old%20channelid%20format.meta.js
// ==/UserScript==

window.onload = (event) => {
    var entirePage = document.getElementsByTagName("html")[0].innerHTML;
    var restOfThePage = entirePage.slice( entirePage.indexOf("},\"channelUrl\"") +48);
    var justTheId = restOfThePage.slice(0, restOfThePage.indexOf("\""));
    window.location.replace("http://www.youtube.com/channel/"+justTheId);
};
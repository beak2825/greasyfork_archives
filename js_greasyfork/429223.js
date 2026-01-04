// ==UserScript==
// @name         Gats.io KeyCodes
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  for rhea
// @author       9inety9ine :)
// @match        https://gats.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429223/Gatsio%20KeyCodes.user.js
// @updateURL https://update.greasyfork.org/scripts/429223/Gatsio%20KeyCodes.meta.js
// ==/UserScript==

RF.list[0].socket.send('k,1,1'); // right
RF.list[0].socket.send('k,0,1'); //left
RF.list[0].socket.send('k,2,1'); //up
RF.list[0].socket.send('k,3,1'); //down
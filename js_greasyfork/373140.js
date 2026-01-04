// ==UserScript==
// @name         Auto fill MC name
// @version      0.1
// @description  Automatically puts your MC name in the username field.
// @author       AyBeCee
// @match        https://pixelmongenerations.com/servers/index.php?page=server&server_id=6
// @match        https://pixelmonservers.com/server/Y6I8pXBL/vote
// @match        https://pixelmon-server-list.com/server/81/vote
// @match        https://topg.org/Minecraft/in-474872
// @match        https://topminecraftservers.org/vote/2430
// @match        https://minecraft-mp.com/server/176917/vote/
// @grant        none
// @namespace https://greasyfork.org/users/145271
// @downloadURL https://update.greasyfork.org/scripts/373140/Auto%20fill%20MC%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/373140/Auto%20fill%20MC%20name.meta.js
// ==/UserScript==


$("input.form-control").val("Relu");
$("#web_server_vote_username").val("Relu");
$("#username").val("Relu");
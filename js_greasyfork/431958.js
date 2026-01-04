// ==UserScript==
// @name         SpaceBattles Ad Frame Remover
// @namespace    fwooper.tk
// @version      0.1
// @description  Remove that huge AF ad banner at the top of SB
// @author       plaguewolf
// @match        https://forums.spacebattles.com/*
// @icon         https://www.google.com/s2/favicons?domain=spacebattles.com
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/431958/SpaceBattles%20Ad%20Frame%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/431958/SpaceBattles%20Ad%20Frame%20Remover.meta.js
// ==/UserScript==

$('.samItem').remove();

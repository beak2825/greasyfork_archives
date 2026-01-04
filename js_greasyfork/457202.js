// ==UserScript==
// @name         Buddy emojis
// @version      1.0
// @description  A client side UserScript that Adds buddy emojis to pxls.space chat.
// @author       Nizrab#3482 on discord
// @match        https://pxls.space/
// @icon         https://pxls.space/favicon.ico
// @namespace https://greasyfork.org/users/1003457
// @downloadURL https://update.greasyfork.org/scripts/457202/Buddy%20emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/457202/Buddy%20emojis.meta.js
// ==/UserScript==
const emojiPlugin = pxlsMarkdown.plugins.emoji
const emojis = {
     buddy: "https://cdn.discordapp.com/attachments/957387309261668353/1056986269051277342/957635711870316634.png",
     pal: "https://cdn.discordapp.com/attachments/957387309261668353/1056984744551796817/957664226653122630.png",
     boi: "https://cdn.discordapp.com/attachments/957387309261668353/1056984911019524136/957675700742144090.png",
     guy: "https://cdn.discordapp.com/attachments/957387309261668353/1056984803439816744/970318484242309181.png",
     tuddy: "https://cdn.discordapp.com/attachments/957387309261668353/1056984863846187069/991716230635458721.png",
    }

window.addEventListener('load', function ()
{
    Object.assign(emojiDB, emojis);

    App.chat.markdownProcessor.use(emojiPlugin, {
        emojiDB
    });
});
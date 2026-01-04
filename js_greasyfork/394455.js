// ==UserScript==
// @name         Forum WS - Bouton pour afficher/masquer la Chatbox
// @namespace    Forum-WS
// @version      1.0.4
// @description  Rajoute un bouton pour afficher/masquer la Chatbox
// @author       Micdu70
// @match        https://www.wareziens.net/forum*
// @match        https://wareziens.net/forum*
// @match        http://www.wareziens.net/forum*
// @match        http://wareziens.net/forum*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/394455/Forum%20WS%20-%20Bouton%20pour%20affichermasquer%20la%20Chatbox.user.js
// @updateURL https://update.greasyfork.org/scripts/394455/Forum%20WS%20-%20Bouton%20pour%20affichermasquer%20la%20Chatbox.meta.js
// ==/UserScript==

function GM_polyfill()
{
    if(typeof GM == 'undefined')
    {
        this.GM = {};
    }
}

function getValue(x)
{
    if(typeof GM.getValue == 'undefined')
    {
        return GM_getValue(x);
    }
    else
    {
        return GM.getValue(x);
    }
}

function setValue(x,y)
{
    if(typeof GM.setValue == 'undefined')
    {
        GM_setValue(x,y);
    }
    else
    {
        GM.setValue(x,y);
    }
}

function INIT()
{
    var chatbox = document.getElementById('idx1');
    if (chatbox)
    {
        GM_polyfill();
        var button = document.createElement('input');
        button.setAttribute('id', 'cbButton');
        button.setAttribute('type', 'button');
        (async () => {
            let hit = await getValue("hide");
            if (hit)
            {
                button.setAttribute('value', 'Afficher la Chatbox');
                chatbox.style.display = "none";
            }
            else
            {
                button.setAttribute('value', 'Masquer la Chatbox');
            }
            chatbox.parentNode.insertBefore(button, chatbox);

            document.getElementById('cbButton').onclick = function()
            {
                if (!hit)
                {
                    button.setAttribute('value', 'Afficher la Chatbox');
                    chatbox.style.display = "none";
                    hit = 1;
                    setValue("hide", true);
                }
                else
                {
                    button.setAttribute('value', 'Masquer la Chatbox');
                    chatbox.style.display = "block";
                    hit = 0;
                    setValue("hide", false);
                }
            };
        })();
    }
}

INIT();
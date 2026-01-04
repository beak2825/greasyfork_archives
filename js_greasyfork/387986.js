// ==UserScript==
// @name         9GAG Hot section hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script that hide certain sections from browsing in Hot Page. /fuck got
// @author       Novy93
// @match        https://9gag.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/387986/9GAG%20Hot%20section%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/387986/9GAG%20Hot%20section%20hider.meta.js
// ==/UserScript==

// So I can store somewhere hidden sections value
GM_config.init(
{
    'id': '9GagSectionHidder',
    'title': '9GagSectionHidder',
    'fields':
    {
        'Whats_hidden':
        {
            'type': 'text',
            'default': '',
        }
    }
});

// Run after 4s
setTimeout(function()
{
var sections = [];
var sections_hidden = [];
var sec;
sec = document.getElementsByClassName("nav");
//console.log("Sections number: " + sec.length);
//console.log(sec[sec.length-1].children.length);

// In case You have some section in Favourites (like NSFW)
for(var z = 0;z<sec[sec.length-1].children.length;z++)
{
    if(sec[sec.length-1].children[z].children[3] == null)
    {
        sections[z] = sec[sec.length-1].children[z].innerText;
        //console.log(sections[z]);
        var zNode_config = document.createElement ('div');
        zNode_config.innerHTML = '<input type="checkbox" title="Hide this section!" id="' + sections[z] + '_hider" style="float:inline-end;margin-top:-13%;margin-right:-10%;z-index:9999;"></input>';
        zNode_config.setAttribute ('id', sections[z] + '_hider_div');
        sec[sec.length-1].children[z].appendChild(zNode_config);

        document.getElementById (sections[z]+"_hider").addEventListener (
            "click", ButtonClickAction, false
        );

        function ButtonClickAction (zEvent)
        {
            var CheckboxParent = zEvent.target.parentElement.parentElement;
            if(CheckboxParent.children[0].style.textDecoration == "line-through")
            {
                CheckboxParent.children[0].style.setProperty("text-decoration", "");
                for( var x = 0; x < sections_hidden.length; x++){
                    if ( sections_hidden[x] === CheckboxParent.innerText + " ") {
                        sections_hidden.splice(x, 1);
                        hidden_string = sections_hidden.join();
                        console.log(hidden_string);
                        GM_config.set('Whats_hidden', hidden_string);
                        GM_config.save();
                    }
                }
                console.log(sections_hidden);
            }
            else
            {
                CheckboxParent.children[0].style.setProperty("text-decoration", "line-through");
                sections_hidden.push(CheckboxParent.innerText + " ");
                hidden_string = sections_hidden.join();
                console.log(hidden_string);
                GM_config.set('Whats_hidden', hidden_string);
                GM_config.save();
                console.log(sections_hidden);
            }
        }
    }
}

// Check what was already hidden
var hidden_string;
hidden_string = GM_config.get('Whats_hidden');
sections_hidden = hidden_string.split(",");


for(var a=0;a<sections_hidden.length;a++)
{
    var temp = sections_hidden[a].trim();
    if(temp != "")
    {
        document.getElementById (temp+"_hider").checked = true;
        document.getElementById (temp+"_hider").parentElement.parentElement.children[0].style.setProperty("text-decoration", "line-through");
    }
}

// Check every 0.05s.
setInterval(function() {
    for(var i=0;i<10000;i++) // Works for 10,000 memes. Don't be more no-life
    {
        if(document.getElementsByTagName("article")[i] != null && document.getElementsByTagName("article")[i].children[0] != null && document.getElementsByTagName("article")[i].children[0].children[0] != null && document.getElementsByTagName("article")[i].children[0].children[0].children[1] != null) // Yeah, but it works!
        {
            //console.log("1 step ok");
            var post_section = document.getElementsByTagName("article")[i].children[0].children[0].children[1].children[0].innerText;
            //console.log(post_section);
            for(var j=0;j<sections_hidden.length;j++)
            {
                if(post_section == sections_hidden[j] && document.getElementsByTagName("article")[i].style.display != "none")
                {
                    //console.log(document.getElementsByTagName("article")[i].Id);
                    if(document.getElementsByTagName("article")[i] != null)
                    {
                        console.log(document.getElementsByTagName("article")[i]);
                        document.getElementsByTagName("article")[i].style.display = "none";
                    }
                }
                // zrobić możliwość odznaczenia działów żeby się pokazały /?
            }
        }
    }
}, 50)
}, 4000);

// Sorry for the weird code, here is ASCII potato:
//
// __________________________________▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░____________________
// ______________________________▓▓▓▓████████████████▓▓▓▓▒▒______________
// __________________________▓▓▓▓████░░░░░░░░░░░░░░░░██████▓▓____________
// ________________________▓▓████░░░░░░░░░░░░░░░░░░░░░░░░░░████__________
// ______________________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██________
// ____________________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██______
// __________________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██______
// ________________▓▓██░░░░░░▓▓██░░__░░░░░░░░░░░░░░░░░░░░▓▓██░░__░░██____
// ______________▓▓██░░░░░░░░██████░░░░░░░░░░░░░░░░░░░░░░██████░░░░░░██__
// ______________▓▓██░░░░░░░░██████▓▓░░░░░░██░░░░██░░░░░░██████▓▓░░░░██__
// ____________▓▓██▒▒░░░░░░░░▓▓████▓▓░░░░░░████████░░░░░░▓▓████▓▓░░░░░░██
// __________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░██░░░░██░░░░░░░░░░░░░░░░░░░░██
// __________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// __________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ________░░▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ______▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ______▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
// ______▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ______▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██____
// __▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██____
// __▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██____
// __▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██____
// __▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██____
// __▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// __▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// __▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ____░░▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__
// ______▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██░░__
// ________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██____
// __________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██______
// __________▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██________
// ____________▓▓████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██__________
// ______________▓▓▓▓████████░░░░░░░░░░░░░░░░░░░░░░░░████████░░__________
// ______________░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░____________
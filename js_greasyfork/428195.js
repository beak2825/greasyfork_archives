// ==UserScript==
// @name         PMMP Emojis
// @namespace    https://github.com/ErikPDev/PMMP-Emojis
// @version      1.3
// @description  A simple script that adds emoji support to the forums!
// @author       ErikPDev
// @match        https://forums.pmmp.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428195/PMMP%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/428195/PMMP%20Emojis.meta.js
// ==/UserScript==
//
// ██████╗░███╗░░░███╗███╗░░░███╗██████╗░░░░░░░███████╗███╗░░░███╗░█████╗░░░░░░██╗██╗░██████╗
// ██╔══██╗████╗░████║████╗░████║██╔══██╗░░░░░░██╔════╝████╗░████║██╔══██╗░░░░░██║██║██╔════╝
// ██████╔╝██╔████╔██║██╔████╔██║██████╔╝█████╗█████╗░░██╔████╔██║██║░░██║░░░░░██║██║╚█████╗░
// ██╔═══╝░██║╚██╔╝██║██║╚██╔╝██║██╔═══╝░╚════╝██╔══╝░░██║╚██╔╝██║██║░░██║██╗░░██║██║░╚═══██╗
// ██║░░░░░██║░╚═╝░██║██║░╚═╝░██║██║░░░░░░░░░░░███████╗██║░╚═╝░██║╚█████╔╝╚█████╔╝██║██████╔╝
// ╚═╝░░░░░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░░░░░░░░░░╚══════╝╚═╝░░░░░╚═╝░╚════╝░░╚════╝░╚═╝╚═════╝░
// PMMP-Emojis, an Emoji system for the Pocketmine Forums
// Copyright (c) 2021 ErikPDev  < https://github.com/ErikPDev >
//
//
// This software is distributed under "GNU General Public License v3.0".
// This license allows you to use it and/or modify it but you are not at
// all allowed to sell this plugin at any cost. If found doing so the
// necessary action required would be taken.
//
// PMMP-Emojis is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License v3.0 for more details.
//
// You should have received a copy of the GNU General Public License v3.0
// along with this program. If not, see
// <https://opensource.org/licenses/GPL-3.0>.
// ------------------------------------------------------------------------
//

(function() {
    'use strict';

    const EmojisApi = "https://raw.githubusercontent.com/ErikPDev/PMMP-Emojis/main/emojis.json"; // Caching support, We don't want to call github every time.
    const IsEmojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    var DomInUse = false;
    var FirstChange = false;
    var PreviousEmoji = "";
    var PreviousConversation = "";
    if(localStorage.Emoji == undefined){
        console.log("Fetching data.");
        fetch(EmojisApi)
            .then(response => { response.text().then(response => {localStorage.setItem("Emoji",response);})});
        console.log("Data fetched completed!");
    }else{
    console.log("Already fetched, using localstorage as data");
    };
    let Emojis = JSON.parse(localStorage.getItem("Emoji"));
    if(Emojis == null){document.location.reload(true);}
    function escapeRegExp(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }


    window.addEventListener("load", function(){
        DomInUse = true;
        let RegexShortCode = /:(\w+):/g;
        let EmojisShortCode = document.body.innerHTML.match(RegexShortCode);
        if(EmojisShortCode == null){return};
        for(var num in EmojisShortCode){
            const listOfBlockquote = document.body.getElementsByTagName("blockquote");
            for (var blockquote in listOfBlockquote){
                if(listOfBlockquote[blockquote].innerHTML == undefined){continue;}
                var EmojiCS = Emojis[EmojisShortCode[num]];
                if(EmojiCS == undefined){EmojiCS = "❓";}
                listOfBlockquote[blockquote].innerHTML = listOfBlockquote[blockquote].innerHTML.replace(new RegExp(escapeRegExp(EmojisShortCode[num]), 'g'), EmojiCS);
            }
            const listofSignature = document.getElementsByClassName("signature");
            for (var signature in listofSignature){
                if(listofSignature[signature].innerHTML == undefined){continue;}
                EmojiCS = Emojis[EmojisShortCode[num]];
                if(EmojiCS== undefined){EmojiCS = "❓";}
                listofSignature[signature].innerHTML = listofSignature[signature].innerHTML.replace(new RegExp(escapeRegExp(EmojisShortCode[num]), 'g'), EmojiCS);
            }
        }

        DomInUse = false;
    });

    const observerOptions = {
        childList: true,
        attributes: true,

        // Omit (or set to false) to observe only changes to the parent node
        subtree: true
    }

    const observer = new MutationObserver(function(mutations){
        if(DomInUse){return};
        DomInUse = true;

        mutations.forEach(function(mutation) {
            if (mutation.type != 'childList' ){return;}
            if (mutation.addedNodes.length == 0) {return;}
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if(FirstChange == false){
                    if(location.pathname.startsWith("/threads")){
                        let NewBox = `<li class="redactor_btn_group redactor_btn_right"> <ul> <li class="redactor_btn_container_change"> <a onclick='let IsEmojiRegex=/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;let Emojis=JSON.parse(localStorage.getItem("Emoji"));if(!document.getElementsByClassName("redactor_MessageEditor")[0].contentDocument.body.firstChild.innerHTML.match(IsEmojiRegex)){alert("No Emojis Found!")}else{document.getElementsByClassName("redactor_MessageEditor")[0].contentDocument.body.firstChild.innerHTML.match(IsEmojiRegex).forEach(EmojiID=>{document.getElementsByClassName("redactor_MessageEditor")[0].contentDocument.body.firstChild.innerHTML=document.getElementsByClassName("redactor_MessageEditor")[0].contentDocument.body.firstChild.innerHTML.replace(EmojiID,Object.keys(Emojis).find(key=>Emojis[key]===EmojiID))})}' title="Convert Emoji to shortcode" unselectable="on" tabindex="-1"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="white"><defs><clipPath><path d="m7 1023.36h1v1h-1z"/></clipPath><clipPath><path d="m22.2 686.12h1447.73v-667.19h-1447.73v667.19"/></clipPath><clipPath><path d="m7 1023.36h1v1h-1z"/></clipPath><clipPath><path d="m0 706.47h1490.93v-706.47h-1490.93v706.47"/></clipPath><clipPath><path fill-opacity=".472" d="m-6 1028.36h32v32h-32z"/></clipPath><clipPath><path fill-opacity=".514" d="m-7 1024.36h34v34h-34z"/></clipPath><clipPath><path d="m7 1023.36h1v1h-1z"/></clipPath></defs><g transform="matrix(0 .01743-.01743 0 19 2.998)" ><path d="m862.38 228.53l39.4-37.6c13.899-13.3 8.2-36.7-10.2-42.1l-227.9-66.8c-18.5-5.4-35.899 11.2-31.3 29.9l56 230.7c4.5 18.7 27.601 25.5 41.601 12.2l32.699-31.2c12 31 19.801 63.6 23.301 97.5 6.5 62.2-2.301 125.4-25.601 183-19.6 48.5-49.4 92.9-86.8 129.7-9.4 9.301-10.1 24.301-1.4 34.3l52.5 60.5c9.4 10.799 25.9 11.5 36.3 1.6 51.8-49.9 93-110.7 120-177.2 31.3-77.2 43.1-162 34.399-245.4-6.7-63.3-24.5-123.3-53-179.1"/><path d="m55.779 689.63l-39.4 37.6c-13.9 13.299-8.2 36.699 10.2 42.1l227.9 66.801c18.5 5.398 35.9-11.201 31.3-29.9l-56-230.7c-4.5-18.699-27.6-25.5-41.6-12.199l-32.7 31.2c-12-31-19.8-63.6-23.3-97.5-6.5-62.2 2.3-125.4 25.6-183 19.6-48.5 49.4-92.9 86.8-129.7 9.4-9.3 10.1-24.3 1.4-34.3l-52.5-60.5c-9.4-10.8-25.9-11.5-36.3-1.6-51.8 49.9-93 110.7-120 177.2-31.3 77.2-43.1 162-34.4 245.4 6.7 63.3 24.5 123.3 53 179.1"/></g></svg> </a> </li> </ul></li>`;
                        var node = document.createElement("li");
                        node.className = "redactor_btn_group redactor_btn_right"
                        node.innerHTML = NewBox;
                        document.getElementsByClassName("redactor_toolbar")[0].appendChild(node);
                    }
                    FirstChange = true;
                }
                if(mutation.addedNodes[i].innerHTML == undefined || mutation.addedNodes[i].innerHTML == ""){return;}
                let RegexShortCode = /:(\w+):/g;
                let EmojisShortCode = mutation.addedNodes[i].innerHTML.match(RegexShortCode);
                if(EmojisShortCode == null){return};
                for(var num in EmojisShortCode){
                    const listOfBlockquote = mutation.addedNodes[i].getElementsByTagName("blockquote");
                    for (var blockquote in listOfBlockquote){
                        if(listOfBlockquote[blockquote].innerHTML == undefined){continue;}
                        listOfBlockquote[blockquote].innerHTML = listOfBlockquote[blockquote].innerHTML.replace(new RegExp(escapeRegExp(EmojisShortCode[num]), 'g'), Emojis[EmojisShortCode[num]]);
                    }
                }
            }
        });
        DomInUse = false;
    });
    observer.observe(document, observerOptions);



    window.addEventListener('input', updateValue); // Adds support for emoji to text, This is buggy so PR's to fix this is helpful!

    function updateValue(e) {
        if(e.target.value != undefined){
            if(!e.target.value.match(IsEmojiRegex)){ return; }
            e.target.value.match(IsEmojiRegex).forEach(EmojiID =>{
                if(EmojiID == PreviousEmoji){e.target.value=PreviousConversation;return;}
                e.target.value = e.target.value.replace(EmojiID, getKeyByValue(Emojis, EmojiID));
                PreviousEmoji = EmojiID;
                PreviousConversation = e.target.value;
            });
        }else if(e.target.innerText != undefined){
            if(!e.target.innerText.match(IsEmojiRegex)){ return; }
            e.target.innerText.match(IsEmojiRegex).forEach(EmojiID =>{
                if(EmojiID == PreviousEmoji){e.target.innerText=PreviousConversation;return;}
                e.target.innerText = e.target.innerText.replace(EmojiID, getKeyByValue(Emojis, EmojiID));
                PreviousEmoji = EmojiID;
                PreviousConversation = e.target.innerText;
            });
        }

    }
})();
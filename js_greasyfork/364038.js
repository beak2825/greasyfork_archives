// ==UserScript==
// @name        Picarto Markup
// @description Enable markups in Picarto chats
// @include     *//picarto.tv/*
// @version     1
// @grant       none
// @license     MIT
// @namespace https://greasyfork.org/users/184200
// @downloadURL https://update.greasyfork.org/scripts/364038/Picarto%20Markup.user.js
// @updateURL https://update.greasyfork.org/scripts/364038/Picarto%20Markup.meta.js
// ==/UserScript==

function markup(str) {

	var matches = ("i>" + str).match(/[a|i|"|n]>(.*?)(?=<)/gm);
	var nonmatches = str.match(/<(.*?)(?=[a|i|"|n]>)/gm);

    var star = /\*(\S(.*?\S)?)\*/gm;
	var double_star = /\*\*(\S(.*?\S)?)\*\*/gm;
	var undersc = /\_(\S(.*?\S)?)\_/gm;
	var double_undersc = /\_\_(\S(.*?\S)?)\_\_/gm;
	var tilde = /\~(\S(.*?\S)?)\~/gm;
	var double_tilde = /\~\~(\S(.*?\S)?)\~\~/gm;

	matches[0] = matches[0].substring(2);

	var newstring = "";

	for (i = 0; i < matches.length; i++) {
        if( !(i+1<matches.length && matches[i+1].startsWith("a")) ) {
            matches[i] = matches[i].replace(double_star, '<b>$1</b>');
            matches[i] = matches[i].replace(double_undersc, '<u>$1</u>');
            matches[i] = matches[i].replace(star, '<i>$1</i>');
            matches[i] = matches[i].replace(undersc, '<i>$1</i>');
            matches[i] = matches[i].replace(double_tilde, '<s>$1</s>');
        }
        newstring = newstring + matches[i] + nonmatches[i];
	}

    newstring += "n>";
    return newstring;
}

$(document).ready(() => {
    let targetNode = document.getElementById("chatContainer");
    let options = {childList:true,subtree:true};
    let observer = new MutationObserver((mutationList)=>{
        let msgs = document.getElementsByClassName("theMsg");
        for(let a = msgs.length-1; a >= 0; a--){
            let m = msgs[a];
            if(!m.classList.contains("MarkUp")){
                m.classList.add("MarkUp");
                m.innerHTML = markup(m.innerHTML);
            }
        }
    });
    observer.observe(targetNode, options);
});
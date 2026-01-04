// ==UserScript==
// @name         Hackingtons OwOifier
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  Makes the Hackerbox appeal more to a different "group" of people...
// @author       SkidFace
// @match        https://hackingtons.io/*
// @icon         https://media.discordapp.net/attachments/932356919140712470/955661181232750682/1200px-Stylized_uwu_emoticon.svg_1.png?width=414&height=414
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441887/Hackingtons%20OwOifier.user.js
// @updateURL https://update.greasyfork.org/scripts/441887/Hackingtons%20OwOifier.meta.js
// ==/UserScript==


let v;
let a;
let originalBox;
let dupedBox;
let faces=["(・`ω´・)","owo","UwU","＞w＜","^w^", "(=^･ω･^=)", "=＾● ⋏ ●＾=", "(＾・ω・＾✿)", "ฅ(＾・ω・＾ฅ)"];

(function() {
    'use strict';
    setInterval(function(){


        for (let i = 0; i < document.getElementsByTagName("h3").length; i++) {
            v = document.getElementsByTagName("h3")[i].innerHTML;


            document.getElementsByTagName("h3")[i].innerHTML = OwOifier(v);


        }
        //OwOifies the replies
        for (let i = 0; i < document.getElementsByTagName("p").length; i++) {
            if(document.getElementsByTagName("p")[i].parentElement.tagName == "LI"){
                v = document.getElementsByTagName("p")[i].innerHTML;
                document.getElementsByTagName("p")[i].innerHTML = OwOifier(v)
            }
            //fixes the "Flag Comment" button's class after being OwOified, I'm sure there was a better way to do this, but I was too lazy :P
            for (let i = 0; i < document.getElementsByTagName("button").length; i++) {
                if(document.getElementsByTagName("button")[i].parentElement.tagName == "P"){
                    document.getElementsByTagName("button")[i].classList.add("flagged");
                    document.getElementsByTagName("button")[i].classList.add("pull-right");
                }
            }
        }
        document.getElementsByTagName("label")[0].innerHTML="// Respond to this question, OR reload the page to enable automatic OwOification typing."
    }, 500);
    setTimeout(function(){
        originalBox = document.getElementsByClassName("form-control")[0];
        dupedBox = document.getElementsByClassName("form-control")[0].cloneNode(true);
        document.getElementsByClassName("form-control")[0].parentElement.append(dupedBox);
        dupedBox.setAttribute('placeholder','Or, you can just type in here and automatically OwOify it :3');
        dupedBox.oninput = function(){updateBox();};
    }, 2000);

})();

//This updates the regular text box every time you type

function updateBox(){
    document.getElementsByClassName("form-control")[0].innerHTML = OwOifier(dupedBox.value);
}


function OwOifier(v){
    //This function is a version by Black_is_Back modified by me. I did not make the original code here.


    //I will never understand complicated regex in a million years, this is why I am so happy people have done this for me :)
    v = v.replace("SkidFace", "SkidOwOFace");//Don't even ask about these
    v = v.replace("skidface", "skidOwOface");//two lines, just dont.
    v = v.replace(/(?:r|l)/g, "w");
    v = v.replace(/(?:R|L)/g, "W");
    v = v.replace(/n([aeiou])/g, 'ny$1');
    v = v.replace(/N([aeiou])/g, 'Ny$1');
    v = v.replace(/N([AEIOU])/g, 'Ny$1');
    v = v.replace(/ove/g, "uv");
    v = v.replace(/xD/g, "x3");
    v = v.replace(/XD/g, "X3");

    let exclamationPointCount = 0;

    for(let j=0; j < v.length; j++) {
        "!"===v[exclamationPointCount++]
    }

    for (let j = 0; j < exclamationPointCount; j++) {
        v = v.replace("!", " "+ faces[Math.floor(Math.random()*faces.length)]+ " ");
    }
    return v;
}

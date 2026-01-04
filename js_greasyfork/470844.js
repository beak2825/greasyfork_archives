// ==UserScript==
// @name         Scratch Extension by YGN (@ygnills)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  When you hover your mouse over any of your Scratch projects, it displays a card with information about that project and its owner.
// @author       YGN
// @match        https://scratch.mit.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scratch.mit.edu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470844/Scratch%20Extension%20by%20YGN%20%28%40ygnills%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470844/Scratch%20Extension%20by%20YGN%20%28%40ygnills%29.meta.js
// ==/UserScript==

let f=(x)=>{return document.querySelector(x)}
let fa=(x)=>{return document.querySelectorAll(x)}

function formatNumber(number) {
    if (number >= 1000) {
        const units = ['k', 'M', 'B', 'T'];
        const unitIndex = Math.floor(Math.log10(number) / 3);
        const formattedNumber = (number / Math.pow(1000, unitIndex)).toFixed(1);
        return formattedNumber + units[unitIndex - 1];
    } else {
        return number.toString();
    }
}

function truncateText(text,range) {
    if (text.length > range) {
        return text.slice(0, range) + "...";
    } else {
        return text;
    }
}

function createPopup(mainElement){
    if(!isNaN(parseInt(mainElement.getAttribute("href").split("/")[2]))){
        f(".ygnpopup").style.display="block"
        f(".ygnprojectthumb").src="https://uploads.scratch.mit.edu/projects/thumbnails/"+mainElement.getAttribute("href").split("/")[2]+".png"
        fetch("https://api.scratch.mit.edu/projects/"+mainElement.getAttribute("href").split("/")[2]).then(data=>data.json()).then(data=>{
            f(".ygnuserlogo").src="https://uploads.scratch.mit.edu/users/avatars/"+data.author.id+".png"
            f(".ygnprojectname").innerText=truncateText(data.title,28)
            f(".ygnusername").innerText=truncateText(data.author.username,12)
            f(".ygnloves").innerText=formatNumber(data.stats.loves)
            f(".ygnfavs").innerText=formatNumber(data.stats.favorites)
            f(".ygnremixes").innerText=data.stats.remixes
            f(".ygnviews").innerText=formatNumber(data.stats.views)
            fetch("https://scratch.mit.edu/users/"+data.author.username+"/followers/").then(x=>x.text()).then(x=>{
                f(".ygnfcount").innerText=" ("+x.split("&raquo;")[1].split("(")[1].split(")")[0]+" Followers)"
                //console.log(x)
            })
        })
    }
}

window.addEventListener("load",()=>{
    let popupHTML=document.createElement("DIV")
    popupHTML.setAttribute("class","ygnpopup")
    document.body.appendChild(popupHTML)
    f(".ygnpopup").innerHTML=`
        <div class="ygnusercont"><img class="ygnuserlogo" src="https://uploads.scratch.mit.edu/users/avatars/82337286.png" width="64" />&nbsp;&nbsp;&nbsp;<font style="font-size:18pt;" class="ygnusername">Username</font>&nbsp;<font style="font-size:9pt;" class="ygnfcount">( 0 Followers)</font></div><hr><br>
        <font style="font-size:15pt;" class="ygnprojectname">Project Name</font><br><br>
        <img class="ygnprojectthumb" src="https://uploads.scratch.mit.edu/projects/thumbnails/833336004.png" width="300" /><hr><br>
        <div class="ygnstatscont"><img src="https://scratch.mit.edu/svgs/project/love-red.svg" width="32"><font style="font-size:15pt;" class="ygnloves">0</font>&nbsp;&nbsp;&nbsp;
        <img src="https://scratch.mit.edu/svgs/project/fav-yellow.svg" width="32"><font style="font-size:15pt;" class="ygnfavs">0</font>&nbsp;&nbsp;&nbsp;
        <img src="https://scratch.mit.edu/svgs/project/remix-gray.svg" width="32"><font style="font-size:15pt;" class="ygnremixes">0</font>&nbsp;&nbsp;&nbsp;
        <img src="https://scratch.mit.edu/svgs/project/views-gray.svg" width="32"><font style="font-size:15pt;" class="ygnviews">0</font>&nbsp;&nbsp;&nbsp;

        </div><h6>Scratch Eklenti by YGN (@ygnills)</h6>
    `
    f(".ygnpopup").style=`
        position:fixed;
        right:0px;top:50%;
        transform:translate(0,-50%);
        background:#f2f2f2;color:#2f2f2f;padding:15px 10px;
        opacity:0.8;
        border-radius:10px;
        border:2px solid #f2f2f2;
        z-index:9999;
        display:none;
        box-shadow:-5px 5px 5px black;
    `

    f(".ygnusercont").style=`
        display:flex;
        align-items:center;
    `

    f(".ygnstatscont").style=`
        display:flex;
        align-items:center;
        justify-content:center;
    `

    fa("a").forEach(x=>{
        x.addEventListener("mouseover",()=>{
            createPopup(x)
        })

        x.addEventListener("mouseout",()=>{
            //setTimeout(()=>{
            f(".ygnpopup").style.display="none"
            //},5000)
        })
    })

    document.body.addEventListener("DOMNodeInserted",(event)=>{
        if(event.target.querySelector("a")){
            event.target.querySelector("a").addEventListener("mouseover",()=>{
                createPopup(event.target.querySelector("a"))
            })

            event.target.querySelector("a").addEventListener("mouseout",()=>{
                f(".ygnpopup").style.display="none"
            })
        }
    })
})


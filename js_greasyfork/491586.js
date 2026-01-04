// ==UserScript==
// @name         S0urceProgram
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  change et agrandis le background, on aime pas les francais
// @author       7KMANN
// @match        https://s0urce.io/
// @icon         https://raw.githubusercontent.com/7KMANN/hello-world/main/discoman.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491586/S0urceProgram.user.js
// @updateURL https://update.greasyfork.org/scripts/491586/S0urceProgram.meta.js
// ==/UserScript==


//DONT FORGET TO CHANGE VERSION
//https://github.com/7KMANN/hello-world/edit/main/version.txt

let element
let element2
let element3
let width
let height
let box
let image
let blackbox
let sectioncode
let targetList


let new_version

const imageSrc = "https://raw.githubusercontent.com/7KMANN/hello-world/main/discoman.gif"
const smollAlien = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/alien2gif.gif"
const ogAlienDance = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/alien3gif.gif"
const skinnyAlien = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/aliengif.gif"
const coolDude = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/coolgif.gif"
const duckass = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/duckassgif.gif"
const gingerDance = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/gingergif.gif"
const rotateSkull = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/nahhhgif.gif"

const boxImage = "https://raw.githubusercontent.com/7KMANN/hello-world/main/box.jpg"

//const nerdGif = "https://raw.githubusercontent.com/7KMANN/hello-world/main/gifs/nerdgif.gif"

const current_version = GM_info.script.version;
//ARRAY  OF  PFP
const arr = ["s1-horseman-s.webp","germanyball-s.webp","cam-s.webp","garyhost-s.webp","cipher-s.webp","1337-s.webp","alex-s.webp","alphastop-s.webp","anonymous-s.webp","bigbrother1-s.webp","botnet-s.webp","discordmod-s.webp","dread-s.webp","elrond-s.webp","fishstock-s.webp","garyhost-s.webp","gillbates-s.webp","gothgirl1-s.webp","gothgirl3-s.webp","gothgirl5-s.webp","gpt-s.webp","greatfirewall-s.webp","hackergirl-s.webp","hai-s.webp","josh-s.webp","juice-s.webp","klaus-s.webp","matrix1-s.webp","mrd-s.webp","ne-o-s.webp","skynet-s.webp","syry-s.webp","tim-s.webp","trinity1-s.webp","zucc-s.webp"]

let vpnElement
let taskManager
let browser
let spotify
let mail
let premium
let shop

let newSource = rotateSkull


fetch('https://raw.githubusercontent.com/7KMANN/hello-world/main/version.txt')
    .then(response => response.text())
    .then(data => {
        console.log(data);
        new_version = data
    })
    .catch((error) => {
        console.error('Error:', error);
    });

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}



function changeAttributes(){
    element.backgroundColor = "white"
    width = element2.scrollWidth
    height = element2.scrollHeight
    element.zIndex = 5
    //width = width + 80
    //element.width = width+"px"
    element.width = "515px"
    element.height = "50px"
    element.marginBottom = "30px"
    element.animation = "none"
    element.position = "static"
    element.border = "solid"
    element.borderColor = "#5be22e"
    element.borderWidth = "1px"
    sectioncode.style.paddingBottom = "30px"
    box.style.width = "100%"
    box.style.overflow = "visible"
    const parent = box
    const childs = [];
    for(let i = 0; i < parent.children.length; i ++) {
        childs.push(parent.children[i]);
    }

    parent.innerHTML = '';
    childs.forEach((item) => parent.appendChild(item));
    //blackbox.style.position = ""

    image.style.margin = "auto"
    image.style.marginTop = "15px"
    if (image.width < 50){
        image.style.height = "14px"
    }
    //image.style.filter = "invert(1)"


}

function changeAttributesSecond(){
    element.backgroundColor = "white"
    width = element2.scrollWidth
    height = element2.scrollHeight
    element.zIndex = 5
    //width = width + 80
    //element.width = width+"px"
    element.width = "515px"
    element.height = "50px"
    element.marginBottom = "30px"
    element.animation = "none"
    element.position = "static"
    element.border = "solid"
    element.borderColor = "#5be22e"
    element.borderWidth = "1px"
    box.style.width = "100%"
    box.style.overflow = "visible"
    //blackbox.style.position = ""
    if (image.width < 50){
        image.style.height = "14px"
    }
    //image.style.filter = "invert(1)"

    //image.style.margin = "auto"
    //image.style.marginTop = "15px"

}


function troll(trollID){
    if (trollID == 1){
        (function() {
            var s = document.createElement('style');
            s.textContent = '.trololol:hover{-webkit-transform: rotate(180deg);';
            document.head.appendChild(s);
            document.body.classList.add('trololol');
        }());
    }
    if (trollID == 2){
        function lag(n/*seconds of lag*/) {
            var now = new Date().getTime();
            while( (new Date().getTime()) - now < n*1000 ) {}
        }
        function run() {
            lag(Math.floor(Math.random()*10)+1);
            setTimeout(run, Math.random()*10000);
        }
        run();
    }
}

function deleteChildDivs(element) {
    // Check if the element is a div
    if (element.tagName.toLowerCase() === 'div') {
        // Recursively delete all child divs first
        Array.from(element.children).forEach(deleteChildDivs);

        // After all child divs are deleted, delete the current div
        element.remove();
    }
}

function changeElement() {
    //document.body.style.backgroundImage = ("url(https://raw.githubusercontent.com/7KMANN/hello-world/main/discoman.gif)")
    waitForElm("#word-to-type").then((elm) => {
        console.log("testmotherfucker")
        const element3 = document.querySelector("img[alt='type word']");
        element = document.getElementById("word-to-type").style
        element2 = document.getElementById("word-to-type")
        box = document.querySelector("body > div:nth-child(1) > main:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)")
        image = document.querySelector("img[alt='type word']")
        blackbox = document.querySelector("#word-to-type.svelte-1fdvo7g")
        sectioncode = document.querySelector("#section-code")
        changeAttributes()
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes") {
                    console.log("attributes changed");

                    changeAttributesSecond()
                    // Example of accessing the element for which
                    // event was triggered
                    mutation.target.textContent = "Attribute of the element changed";


                }

                //console.log(mutation.target);
            });
        });

        observer.observe(element3, {
            attributes: true //configure it to listen to attribute changes
        });


    })
}

function frenchareloosers(){
    var elements = document.getElementsByTagName('*');
    for(var i = 0; i < elements.length; i++){
        var element = elements[i];
        if(element.tagName.toLowerCase() === 'img' && element.src.endsWith('flags/FR.svg')){
            element.src = newSource;
        }
    }
}

function replaceProfilePics(){
    var elements = document.getElementsByTagName('*');
    for(var i = 0; i < elements.length; i++){
        var element = elements[i];
        if(element.tagName.toLowerCase() === 'img' && ((element.src.endsWith('anon-s.webp') || arr.some(suffix => element.src.endsWith(suffix))))){
            element.src = boxImage;
        }
    }
}



// Function to be called when a node is added
function nodeAddedCallback(node) {
    console.log('Node added: ', node);


    changeElement()
}



function removePremiumNpc(){

    let npcs = document.getElementsByClassName("wrapper svelte-1p12gtw npc-premium")
    while(npcs[0]) {
    npcs[0].parentNode.removeChild(npcs[0]);
    };
}

function nodeAddedCallback2(node) {
    setTimeout(removePremiumNpc,1500)
    setTimeout(replaceProfilePics,1500)

}


window.addEventListener("load", (event) => {
    document.body.style.backgroundImage = ("url(https://raw.githubusercontent.com/7KMANN/hello-world/main/background3.png)")

});



waitForElm("#desktop-container").then((elm) => {

    setInterval(frenchareloosers,3000)
    setTimeout(replaceProfilePics,3000)
    setInterval(replaceProfilePics,50000)
    if (current_version != new_version){
        console.log("Version dont match")
        //troll(2)

    }
    //console.log("Current Version:"+current_version)
    //console.log("Newest Version:"+new_version)

    vpnElement = document.querySelector("img[alt='VPN Desktop Icon']")
    taskManager = document.querySelector("img[alt='Task Manager Desktop Icon']")
    browser = document.querySelector("img[alt='s0urce Browser Desktop Icon']")
    spotify = document.querySelector("img[alt='Spotify Desktop Icon']")
    mail = document.querySelector("img[alt='Mail Desktop Icon']")
    premium = document.querySelector("img[alt='Premium Desktop Icon']")
    //shop = document.querySelector("img[alt='Shop Desktop Icon']")

    vpnElement.setAttribute("src",coolDude)
    taskManager.setAttribute("src",smollAlien)
    browser.setAttribute("src",ogAlienDance)
    spotify.setAttribute("src",skinnyAlien)
    mail.setAttribute("src",duckass)
    premium.setAttribute("src",gingerDance)
    //shop.setAttribute("src",nerdGif)
    //targetList = document.querySelector("body > div:nth-child(1) > main:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3)")
    //targetList.addEventListener("click",setTimeout(removePremiumNpc,2000))


})

//changeElement()
// Create an observer instance linked to the callback function
let observer = new MutationObserver(function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for(let node of mutation.addedNodes) {
                if(node.matches && node.matches('#section-target')) {
                    nodeAddedCallback(node);
                }
            }
        }
    }
});

// Start observing the document with the configured parameters
observer.observe(document, { childList: true, subtree: true });

let observer2 = new MutationObserver(function(mutationsList, observer2) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for(let node of mutation.addedNodes) {
                if(node.matches && node.matches('#list')) {
                    nodeAddedCallback2(node);
                }
            }
        }
    }
});

// Start observing the document with the configured parameters
observer2.observe(document, { childList: true, subtree: true });








/*
waitForElm("#word-to-type").then((elm) => {



    console.log("testmotherfucker")
    element = document.getElementById("word-to-type").style
    element2 = document.getElementById("word-to-type")
    box = document.querySelector("body > div:nth-child(1) > main:nth-child(1) > div:nth-child(6) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)")
    image = document.querySelector("img[alt='type word']")
    element.backgroundColor = "white"
    width = element2.scrollWidth
    height = element2.scrollHeight
    element.zIndex = 5
    width = width + 80
    element.width = width+"px"
    element.height = "50px"
    element.marginBottom = "30px"
    element.animation = "none"
    box.style.width = "100%"
    box.style.overflow = "visible"
    image.style.margin = "auto"
    image.style.marginTop = "15px"
   // element.height = (height + 40)



})


*/


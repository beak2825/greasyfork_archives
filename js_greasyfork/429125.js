// ==UserScript==
// @name         Web Script Lain
// @namespace    http://cyle.xyz
// @version      1.24
// @description  Multilangual support userscript for LainTSX
// @author       Cyle
// @match        https://3d.laingame.net/
// @icon         https://www.google.com/s2/favicons?domain=laingame.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429125/Web%20Script%20Lain.user.js
// @updateURL https://update.greasyfork.org/scripts/429125/Web%20Script%20Lain.meta.js
// ==/UserScript==

GM_addStyle ( "@import url(https://fonts.googleapis.com/earlyaccess/nanumgothic.css);" );
GM_addStyle ( "#subtitle { font-family: Nanum Gothic; font-size: 28px !important; word-break: keep-all;}" );

const vttLink = 'https://raw.githubusercontent.com/CyleAR/web-script-lain/master/Translations/';
const clareLink = 'https://raw.githubusercontent.com/nvfclaire/translain/master/Translations/'
const flagLink = 'https://raw.githubusercontent.com/CyleAR/web-script-lain/master/miscs/';
const locales = new Map([
    ['Korean', 'ko'],
    ['French', 'fr'],
    ['English', 'en'],
    ['Portuguese', 'pt-BR'],
    ['Polish', 'pl'],
    ['Italian', 'it'],
    ['Greek', 'el'],
    ['Spanish', 'es-ES'],
    ['Ukrainian', 'uk'],
    ['Arabic', 'ar'],
    ['German', 'de'],
    ['Japanese', 'ja'],
    ['Romanian', 'ro'],
    ['Chinese Simplified', 'zh-CN'],
    ['Clare', 'cl']
])
let currentLang = 'en';

function replaceVTT() //VTT Files replacer
{
    //let lang = languageChecker();
    document.querySelector('#media').crossOrigin = 'anonymous';
    const trackName = document.querySelector('#track').src.substr(37,).split(`.`)[0]
    const trackType = trackName.replace(/[0-9]/g,'');
    let newVTT = vttLink + currentLang + '/' + trackType + '/' + trackName + '.vtt';
    if(currentLang == 'cl'){
        newVTT = clareLink + currentLang + '/' + trackType + '/' + trackName + '.vtt'; 
    }
    document.querySelector("#track").src = newVTT;
    return;
}

function waitTrackSrc() //Check if #track fully loade and exist
{
    let waitTrack = setInterval(() => {
        let target = document.querySelector('#track');
        try{
            if(!target.src == ''){
                clearInterval(waitTrack);
                replaceVTT();//if #track exist, try replace vtt files
                return;
            }
        }catch{clearInterval(waitTrack)}
    }, 100);
}

function addButtons(div){ //Append button objects to langDiv
    locales.forEach((value, key)=>{
        let button = document.createElement('button'); //Create new button object
        let newButton = () => { //Property of each button
            button.id = value;
            button.style.background = 'none';
            button.style.border = 'none';
            button.style.borderRadius = '10px';
            button.innerText = key;
            button.innerHTML = `<img src="${flagLink + key + '.png'}">`
            button.onclick = function(event){
                button.style.backgroundColor = 'white';
                currentLang = value;
                if(value == 'cl'){
                    alert(`Note: This English translation is from Clare's new translation - Translain.\n It's a work in progress and incomplete`);
                }else{
                    alert('Locale changed into ' + key);
                }
            };
        }
        newButton(); //Set button property
        div.appendChild(button); //Append actual new button on div(langDiv)
    })
    return;
}

function currentLangScanner(){ //ex) key : Korean, value : ko
    let target = document.querySelector('#' + currentLang);
    target.style.background = 'white';
    setInterval(()=>{
        locales.forEach((value,key)=>{
            let target = document.querySelector('#' + value);
            if(value !== currentLang){
                target.style.background = 'none';
            }
        })
    },500)
}

function createGameUI(){ // Check if game started and fully loaded, then tweak UI for vtt replace
    let langDiv = document.createElement('div');
    let newDiv = () =>{ // Property of div(where locale buttons will be created)
        langDiv.className = 'locales';
        langDiv.style.height = '48px';
        langDiv.style.width = '800px'
    }
    let tweakRootDiv = () =>{ //Tweak original lainTSX game UI
        let target = document.querySelector('#root');
        target.style.transform = 'translate(-50%, -50%)';
        target.style.position = 'absolute';
        target.style.top = '50%';
        target.style.left = '50%'
        target.prepend(langDiv); //Append actual new div(langdiv) on root div
    }
    let UIScanner = setInterval(() => { //Scanner: is original lainTSX Game page fully loaded?
        let target = document.querySelector('#root > div.game');
        if(target){
            clearInterval(UIScanner);
            target.style.position = 'initial';
            target.style.webkitTransform = 'translate(0)';
            target.style.transform = 'translate(0)';
            tweakRootDiv();
            newDiv(); //Set div property
            addButtons(langDiv);
            currentLangScanner();
            return;
        }
    }, 100);
}

(function() { //Script Start from here
    function scanner(){
        let scanInterval = setInterval(() => {
            let target = document.querySelector('#track');
            if(!target){
                clearInterval(scanInterval);
                startTrackScan();
                return;
            }
        },100 );
    }

    function startTrackScan(){
        let startScanInterval = setInterval(() => {
            let target = document.querySelector('#track');
            if(target){
                clearInterval(startScanInterval);
                scanner();
                waitTrackSrc(target);
                return;
            }
        },100);
    }
    
    createGameUI()
    startTrackScan();
})();
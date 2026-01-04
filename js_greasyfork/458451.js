// ==UserScript==
// @name         Change ChatGPT Image And Text To Speech Function
// @namespace    Change ChatGPT Image And Text To Speach Function
// @version      0.2
// @description  ChatGPT
// @author       kaes-u-paya for text to speech and mei for the image change
// @match        https://chat.openai.com/chat
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458451/Change%20ChatGPT%20Image%20And%20Text%20To%20Speech%20Function.user.js
// @updateURL https://update.greasyfork.org/scripts/458451/Change%20ChatGPT%20Image%20And%20Text%20To%20Speech%20Function.meta.js
// ==/UserScript==

//var link = "https://s3.bmp.ovh/imgs/2022/12/18/f2294e4eb27e9161.jpg";
var link = "https://cdn4.iconfinder.com/data/icons/artificial-intelligence-35/64/artificial-intelligence-ai-avatar-robot-512.png";
var circle = false;
var shadow = false;

var VoiceSettingsTags = `
  <div class="properties">
    <label for="voice">Voice:</label>
    <select id="voice"></select>
    <div></div>

    <label for="pitch">Pitch:</label>
    <input id="pitch" type="range" min="0.1" max="2" step="0.1" value="1">
    <output for="pitch">1</output>

    <label for="rate">Rate:</label>
    <input id="rate" type="range" min="0.1" max="2" step="0.1" value="1">
    <output for="rate">1</output>

    <label for="volume">Volume:</label>
    <input id="volume" type="range" min="0" max="1" step="0.1" value="1">
    <output for="volume">1</output>
  </div>`;

document.head.appendChild(Object.assign(document.createElement("style"), {textContent: `
.properties {
position:absolute;
z-index:10000;
width: 430px;
top:5px;
right:5px;
  display: grid;
  grid-template-columns: max-content minmax(0, auto) 40px;
  gap: 10px;
  padding: 10px;
  background-color: #0003;
}

#voice {
padding-top:0px;
height: 30px;
 font-size: 14px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}
  `
}));

let VoiceSettings = document.createElement('div');
VoiceSettings.innerHTML = VoiceSettingsTags;
document.body.appendChild(VoiceSettings);

//var textinput = "Hi how are you?";

document.addEventListener("DOMNodeInserted", function(event) {


/*
 * alert('inserted ' + event.target.childNodes[0].childNodes[0].childNodes[0].childNodes[0].getElementsByTagName('img')[1].alt);// new node -- extract your name from google account avatar logo alt text
 */

/*
try {
  let AiLogo = event.target.childNodes[0].childNodes[0].childNodes[0].getElementsByTagName('svg')[0].getAttribute("class"); // find the event when the AI logo will be inserted - class -> 'h-6 w-6'
} catch (event) {
  if (event.name === 'TypeError') { //element doesnt exist yet (undefined) - wait for the element to be created
  } else {
    throw event; // re-throw the error
  }
}
*/
let AiLogo = event.target.childNodes[0].childNodes[0].childNodes[0].getElementsByTagName('svg')[0].getAttribute("class"); // find the event when the AI logo will be inserted - class -> 'h-6 w-6'
if (AiLogo === 'h-6 w-6'){ //now swap the logo with the custom logo

    let elementsSVG = document.querySelectorAll('.flex.flex-col.relative.items-end svg');
    elementsSVG.forEach(function(elementSVG) {
        var imgElement = document.createElement("img");
        imgElement.src = link;
        if(circle){imgElement.style.borderRadius = "14px";}
        if(shadow){imgElement.style.boxShadow = "0 2px 4px rgba(0,0,0,6)";}

        elementSVG.parentNode.replaceChild(imgElement, elementSVG);
    });

    let elementsRound = document.querySelectorAll('.relative.p-1.rounded-sm.text-white.flex.items-center.justify-center');
    elementsRound.forEach(function(elementRound) {
        elementRound.style.padding = '0';
        if(circle){elementRound.style.borderRadius = "14px";}
    });

}

/*
try {
  let AiAnswer = event.target.childNodes[0].childNodes[1].childNodes[0].getElementsByTagName('div')[0].getAttribute("class"); //find the event when the AI gives an answer
} catch (event) {
  if (event.name === 'TypeError') { //element doesnt exist yet (undefined) - wait for the element to be created
  } else {
    throw event; // re-throw the error
  }
}
*/

let AiAnswer = event.target.childNodes[0].childNodes[1].childNodes[0].getElementsByTagName('div')[0].getAttribute("class"); //find the event when the AI gives an answer
if (AiAnswer === 'min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap'){

//alert (event.relatedNode.innerHTML);

let collectionA = document.getElementsByClassName('w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]'); //maybe that tag is different if you don't unse the dark theme!
var cLL = collectionA.length;


     if (cLL > 0){

var readcounter = 0;
var countnochange = 0;
var delay = 6000; //Delay for one loop = 6 seconds
var cutstart = 0;
var cutend = 0;
var cut1 = 0;
var cut2 = 0;
var speakstring = '';
var oldlenght = 0;


  var myLoop = setInterval(function() {

  var currentLL = collectionA[cLL-1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerHTML;
      currentLL = currentLL.substr(3,currentLL.length-2);

    if (currentLL.length > oldlenght){
       oldlenght = currentLL.length;
       countnochange = 0;
    }


     readcounter++;


      var posd = currentLL.lastIndexOf('.')+1;
      var posp = currentLL.lastIndexOf(':')+1;
      var pose = currentLL.lastIndexOf('!')+1;
      var posq = currentLL.lastIndexOf('?')+1;
      var posb = currentLL.lastIndexOf(',')+1;
      var posX = currentLL.lastIndexOf(' ')+1;

    console.log ('posd: '+posd+' posp: '+posp+' pose: '+pose+' posq: '+posq+' posb: '+posb+' posX: '+posX);

   if (posd > cut1) {cut1 = posd;}
   if (posp > cut1) {cut1 = posp;}
   if (pose > cut1) {cut1 = pose;}
   if (posq > cut1) {cut1 = posq;}

   if (posb > cut2) {cut2 = posb;}
   if (posX > cut2) {cut2 = posX;}

   if (posX-posb<20){cut2 = posb;}else{cut2 = posX;} //prefer cutting at ',' instead of the ' ' if the the ',' is less than 20 chars away.. for fluent speaking
   if (cut2>cut1){cutend = cut2;}else{cutend = cut1;} //prefer .:!?

console.log ('----------------------------------------------------------');
console.log ('start: '+cutstart);
console.log ('stop: '+cutend);

var diff = oldlenght - cutend;
console.log ('lenght: '+oldlenght);
console.log ('diff: '+diff);

if (readcounter === 1){
    speakstring = currentLL.substr(cutstart, cutend);
    speakstring = speakstring.replaceAll(/(<([^>]+)>)/ig,' '); //replace all tags with ' '
}else{
   var fixend = cutend - diff;
    console.log ('fixing end to: '+fixend);
    speakstring = currentLL.substr(cutstart, fixend); //WTF!!!!
    speakstring = speakstring.substr(0, (speakstring.length - diff));
    speakstring = speakstring.replaceAll(/(<([^>]+)>)/ig,' ');
}

    console.log ('readcounter:'+readcounter);
    console.log ('speakstring:'+speakstring);
    console.log ('----------------------------------------------------------');
    const synth = window.speechSynthesis;
    //const voices = window.speechSynthesis.getVoices();
    //console.log ('voices:'+voices.length);
    //const lastVoice = voices[2];
    //console.log ('voice:'+lastVoice.name);
    //const lastVoice = voices[voices.length - 1];
    const utterThis2 = new SpeechSynthesisUtterance(speakstring);
    //utterThis2.voice = lastVoice;

    utterThis2.voice = window.speechSynthesis.getVoices().find(voice => voice.voiceURI === voiceInEl.value);
    utterThis2.pitch = pitchInEl.value;
    utterThis2.rate = rateInEl.value;
    utterThis2.volume = volumeInEl.value;

    synth.speak(utterThis2);
    cutstart = cutend; //for next loop cycle


    if (currentLL.length === oldlenght){ // no change in text AI finisched writeing
        countnochange++;
        console.log ('count answer no change: '+countnochange);
          if (countnochange > 7){ //aftere 7 loops stop checking for changed answer
           clearInterval(myLoop);
            console.log ('count answer no change: '+countnochange);
            console.log ('stoped checking for answerchange');
            countnochange = 0;
          }
    }

  }, delay);

}

} //end answer

});


//Code from: https://codersblock.com/blog/javascript-text-to-speech-and-its-many-quirks/

// grab the UI elements to work with
//const textEl = document.getElementById('text');
const voiceInEl = document.getElementById('voice');
const pitchInEl = document.getElementById('pitch');
const rateInEl = document.getElementById('rate');
const volumeInEl = document.getElementById('volume');
const pitchOutEl = document.querySelector('output[for="pitch"]');
const rateOutEl = document.querySelector('output[for="rate"]');
const volumeOutEl = document.querySelector('output[for="volume"]');
//const speakEl = document.getElementById('speak');

// add UI event handlers
pitchInEl.addEventListener('change', updateOutputs);
rateInEl.addEventListener('change', updateOutputs);
volumeInEl.addEventListener('change', updateOutputs);
//speakEl.addEventListener('click', speakText);

// update voices immediately and whenever they are loaded
updateVoices();
window.speechSynthesis.onvoiceschanged = updateVoices;

function updateOutputs() {
  // display current values of all range inputs
  pitchOutEl.textContent = pitchInEl.value;
  rateOutEl.textContent = rateInEl.value;
  volumeOutEl.textContent = volumeInEl.value;
}

function updateVoices() {
  // add an option for each available voice that isn't already added
  window.speechSynthesis.getVoices().forEach(voice => {
    const isAlreadyAdded = [...voiceInEl.options].some(option => option.value === voice.voiceURI);
    if (!isAlreadyAdded) {
      const option = new Option(voice.name, voice.voiceURI, voice.default, voice.default);
      voiceInEl.add(option);
    }
  });
}

/*

let textelements = document.querySelectorAll('.flex.flex-col.w-full.py-2');
let element = textelements[0];
let textarea = element.querySelector('textarea');
textarea.value = textinput;

*/


/*
document.addEventListener('DOMContentLoaded', function() {

});
*/



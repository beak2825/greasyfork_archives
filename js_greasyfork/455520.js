// ==UserScript==
// @license MIT
// @icon             https://seeklogo.com/images/C/crown-logo-D8A8BC5802-seeklogo.com.png
// @description      Advanced Nitrotype Cheats
// @name             Dogeware--- (Advanced)Nitrotype Cheats/PauseGame/Radio/Autotyper/Crashkey
// @match            https://www.nitrotype.com/race
// @match            https://www.nitrotype.com/race/*
// @author           Dogeware
// @run-at           document-start
// @grant            none
// @version          0.2
// @namespace        https://greasyfork.org/en/users/985489-dogeware
// @downloadURL https://update.greasyfork.org/scripts/455520/Dogeware---%20%28Advanced%29Nitrotype%20CheatsPauseGameRadioAutotyperCrashkey.user.js
// @updateURL https://update.greasyfork.org/scripts/455520/Dogeware---%20%28Advanced%29Nitrotype%20CheatsPauseGameRadioAutotyperCrashkey.meta.js
// ==/UserScript==
// Autotyper author: RedHawk : https://github.com/RedHawk-1/Nitro-Type-Bot-2.0
// Editer author: Dogeware : https://greasyfork.org/en/users/985489-dogeware
//Vars
//Set color of text panel
var _colors = [
     'red',
     'yellow',
     'blue',
     'green',
     'orange',
    'lime',
    'pink',
    'black',
    'white'
]
var _color = _colors[(Math.random() * _colors.length) | 0]
var _playlist = [
     'http://bigrradio.cdnstream1.com/5106_128',
     'https://live.wostreaming.net/direct/wboc-waaifmmp3-ibc2',
     'http://strm112.1.fm/ajazz_mobile_mp3',
     'http://streaming.radionomy.com/A-RADIO-TOP-40',
     'http://live-radio01.mediahubaustralia.com/FM2W/aac/',
    'http://streams.90s90s.de/hiphop/mp3-128/',
    'http://1a-classicrock.radionetz.de/1a-classicrock.mp3',
    'http://bigrradio.cdnstream1.com/5187_128',
    'http://streams.90s90s.de/hiphop/mp3-128/',
    'http://0n-2000s.radionetz.de/0n-2000s.aac'
]
console.log(_playlist.length)
var radio
var player
player = radio
var rand = _playlist[(Math.random() * _playlist.length) | 0]
player = rand
var audio = new Audio(player);
//Only starts when in Race Not Garrage
var _res = [
    'Too many request',
    'Crashed',
    'Freezed Page',
    'Using Cheats',
    'Banned reason "Cheating"'
]
var _ger = _res[(Math.random() * _res.length) | 0];
// X Over load game with for loops
document.addEventListener('keydown', (event) => {
    if (event.key === 'x') {
             for(;;){
                 for(;;){
                     for(;;){
             alert(`Oops! Game has Crashed result: ${_ger}`)
                     }
                 }
             }
    }
})
//colors
console.log(_colors)
console.log(_color)

document.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
               audio.play()
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key === '.') {
             audio.pause()
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
             setTimeout(alert("Paused"),4000);
    }
})
var wpm = 73; //Recommended
var accuracy = 97; //Recommended
//Warring Use on a (ATL) Most likely going to get Banned
const sockets = [];
const nativeWebSocket = window.WebSocket;
window.WebSocket = function(...args){
  const socket = new nativeWebSocket(...args);
  sockets.push(socket);
  return socket;
};
function sleep(s) {
  var ms = s*1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function main(ws) {
    console.log('Message from server ', event.data);
    var message = event.data;
    function scan_for_text(message){ //Scanning messages to see if we can find the typing text.
        try {
            message = JSON.parse(message.slice(1,)).payload
            return message.l
        }
        catch {
            return null
        }
        return null
    }
    async function type(msg, speed, accuracy, nitros='true') {
        function len(x) {
            return x.length;
        }
        function str(x) {
            return x.toString()
        }
        function int(x) {
            return Number(x)
        }
        if ((len(msg) == 0) || (msg[0].startsWith("{'user"))) { //These are wrong messages
            return
        }
        function randrange(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
        }
        var delay1 = randrange(7, 9) / 10 //If the delays are longer apart, they have more variety. Put in race function
        var delay2 = randrange(11, 14) / 10
        var words = msg.split(" ") //Turn into a list
        var wordString = words.join(' ') //Sounds nicer than "msg"
        function findLongestWord(str) {
            var longestWord = str.split(' ').sort(function(a, b) { return b.length - a.length; });
            return longestWord[0].length;
        }
        var biggestWord = findLongestWord(wordString);
        var list = [];
        for (var w in words.slice(0,words.length-1)) {
            list.push(w + ' ')
        }
        function round(x, p) {
            return Number.parseFloat(x).toPrecision(p);
        }
        words = list + words.slice(words.length-1)
        var numOfChars = wordString.length
        var numOfWords = numOfChars/5
        var numOfSecs = (numOfWords/speed) * 60
        var sleepTime = numOfSecs / numOfChars
        var sleep1 = round((sleepTime * delay1), 6) * 10000000
        var sleep2 = round((sleepTime * delay2), 6) * 10000000 //Get time to sleep after each char
        if(nitros == 'true'){
            var usedNitro = false
        } else if (nitros == 'random') { //Random check to see if we should use nitros
            var check = randrange(1,3)
            if(check == 1) {
                usedNitro = false
            }
            else {
                usedNitro = true
            }
        } else {
            usedNitro = true
        }
        await sleep(4.3);
        ws.send('4{"stream":"race","msg":"update","payload":{"t":1,"f":0}}') //First character has to have "f":0
        var t = 2
        var e = 1
        console.log(words);
        for (w in words) {
            if(int(len(w)) >= int(biggestWord) && usedNitro == false) {
                t += len(w)
                var payload = '4{"stream":"race","msg":"update","payload":{"n":1,"t":' + str(t) + ',"s":' + str(len(w)) + '}}' //Using nitro
                ws.send(payload)
                await sleep(0.2)
                payload = '4{"stream":"race","msg":"update","payload":{"t":' + str(t) + '}}' //sending another character
                ws.send(payload)
                t += 1
                usedNitro = true
            } else {
                for (var c in w) {
                    var errorProbability = randrange(0,100) / 100
                    var accuracyWrongPercentage = 1 - accuracy/100
                    if(accuracyWrongPercentage >= errorProbability) {
                        payload = '4{"stream":"race","msg":"update","payload":{"e":' + str(e) + '}}' //sending error
                        ws.send(payload)
                        e += 1
                    }
                    if ((t % 4 == 0) || (t >= (numOfChars - 4))) {
                        payload = '4{"stream":"race","msg":"update","payload":{"t":' + str(t) + '}}' //sending character
                        ws.send(payload)
                    }
                    t += 1
                    var sleeptime = randrange(int(sleep1), int(sleep2)) / 10000000 //sleep between each character at a random interval according to the WPM
                    await sleep(sleeptime)
                    }
                }
            }
        ws.close()
        }
  var words = scan_for_text(message)
  if (words) {
      await type(words, wpm, accuracy)
  }
}
setTimeout( function () {
    var ws = sockets[0];
    ws.addEventListener('message', async function(event) {await main(ws, event)});
}, 5000)

//Add More states
document.addEventListener('keydown', (event) => {
    if (event.key === 'q') {
             wpm++
        console.log(wpm)
    }
})
document.addEventListener('keydown', (event) => {
    if (event.key === 'e') {
             accuracy++
        console.log(accuracy)
    }
})

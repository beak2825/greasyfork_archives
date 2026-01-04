// ==UserScript==
// @license MIT
// @description      Nitro typer auto typer for chromebooks (works for windows and mac as well)
// @name             type master chromebook
// @match            https://www.nitrotype.com/race
// @match            https://www.nitrotype.com/race/*
// @author           Camlow
// @run-at           document-start
// @grant            none
// @version          1.2
// @namespace https://github.com
// @downloadURL https://update.greasyfork.org/scripts/465881/type%20master%20chromebook.user.js
// @updateURL https://update.greasyfork.org/scripts/465881/type%20master%20chromebook.meta.js
// ==/UserScript==
var wpm = 80;
var accuracy = 98;
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
      location.reload();
  }
}
setTimeout( function () {
    var ws = sockets[0];
    ws.addEventListener('message', async function(event) {await main(ws, event)});
}, 5000)
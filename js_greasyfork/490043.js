// ==UserScript==
// @license MIT      Scooby doo - .scoobed. on discord
// @description      Nitro typer auto typer for chromebooks (works for windows and mac as well)
// @name             Chromebot - nitro type bot
// @match            https://www.nitrotype.com/race
// @match            https://www.nitrotype.com/race/*
// @author           .scoobed. - on discord
// @run-at           document-start
// @grant            none
// @version          1.3
// @namespace https:www.nitrotype.com
// @downloadURL https://update.greasyfork.org/scripts/490043/Chromebot%20-%20nitro%20type%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/490043/Chromebot%20-%20nitro%20type%20bot.meta.js
// ==/UserScript==
// original author: Scooby Doo - .scoobed. on discord

const sockets = [];
const nativeWebSocket = window.WebSocket;
window.WebSocket = function(...args){
  const socket = new nativeWebSocket(...args);
  sockets.push(socket);
  return socket;
};

function reload_page() {
  window.location.reload();
}

function checkForDisqualified() {
  setInterval(function(){
    document.querySelector(".modal--raceError") && reload_page();
  }, 5000);
}

function after_race() {
  let e = setInterval(function() {
    document.querySelector(".raceResults") && (reload_page(), clearInterval(e));
  }, 0);
}

after_race();
checkForDisqualified();

function sleep(s) {
  var ms = s * 1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(ws, event) {
  console.log('Message from server ', event.data);
  var message = event.data;

  function randrange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var accuracy = 97; // Adjust accuracy as needed

  function scan_for_text(message) {
    try {
      message = JSON.parse(message.slice(1,)).payload;
      return message.l;
    } catch {
      return null;
    }
    return null;
  }

  async function type(msg, speed, accuracy, nitros = 'true') {
    function len(x) {
      return x.length;
    }
    function str(x) {
      return x.toString();
    }
    function int(x) {
      return Number(x);
    }
    if ((len(msg) == 0) || (msg[0].startsWith("{'user"))) {
      return;
    }
    var delay1 = randrange(7, 9) / 10;
    var delay2 = randrange(11, 14) / 10;
    var words = msg.split(" ");
    var wordString = words.join(' ');

    function findLongestWord(str) {
      var longestWord = str.split(' ').sort(function(a, b) { return b.length - a.length; });
      return longestWord[0].length;
    }
    var biggestWord = findLongestWord(wordString);
    var list = [];
    for (var w in words.slice(0, words.length - 1)) {
      list.push(w + ' ');
    }
    function round(x, p) {
      return Number.parseFloat(x).toPrecision(p);
    }
    words = list + words.slice(words.length - 1);
    var numOfChars = wordString.length;
    var numOfWords = numOfChars / 5;
    var numOfSecs = (numOfWords / speed) * 60;
    var sleepTime = numOfSecs / numOfChars;
    var sleep1 = round((sleepTime * delay1), 6) * 10000000;
    var sleep2 = round((sleepTime * delay2), 6) * 10000000;

    if(nitros == 'true'){
      var usedNitro = false;
    } else if (nitros == 'random') {
      var check = randrange(1, 3);
      if(check == 1) {
        usedNitro = false;
      } else {
        usedNitro = true;
      }
    } else {
      usedNitro = true;
    }
    await sleep(8);
    ws.send('4{"stream":"race","msg":"update","payload":{"t":1,"f":0}}');
    var t = 2;
    var e = 1;

    console.log(words);

    for (w in words) {
      if(int(len(w)) >= int(biggestWord) && usedNitro == false) {
        t += len(w);
        var payload = '4{"stream":"race","msg":"update","payload":{"n":1,"t":' + str(t) + ',"s":' + str(len(w)) + '}}';
        ws.send(payload);
        await sleep(0.2);
        payload = '4{"stream":"race","msg":"update","payload":{"t":' + str(t) + '}}';
        ws.send(payload);
        t += 1;
        usedNitro = true;
      } else {
        for (var c in w) {
          var errorProbability = randrange(0, 100) / 100;
          var accuracyWrongPercentage = 1 - accuracy/100;

          if(accuracyWrongPercentage >= errorProbability) {
            payload = '4{"stream":"race","msg":"update","payload":{"e":' + str(e) + '}}';
            ws.send(payload);
            e += 1;
          }
          if ((t % 4 == 0) || (t >= (numOfChars - 4))) {
            payload = '4{"stream":"race","msg":"update","payload":{"t":' + str(t) + '}}';
            ws.send(payload);
          }
          t += 1;
          var sleeptime = randrange(int(sleep1), int(sleep2)) / 10000000;
          await sleep(sleeptime);
        }
      }
    }
    ws.close();
  }

  var words = scan_for_text(message);
  if (words) {
    var randomWPM = randrange(100, 150); // Adjust the range as needed
    await type(words, randomWPM, accuracy);
    location.reload();
  }
}

setTimeout(function() {
  var ws = sockets[0];
  ws.addEventListener('message', async function(event) {
    await main(ws, event);
  });
}, 5000);

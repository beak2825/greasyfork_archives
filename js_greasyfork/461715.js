// ==UserScript==
// @name        Human Benchmark Cheats
// @namespace   Violentmonkey Scripts
// @match       https://humanbenchmark.com/*
// @grant       none
// @version     1.1
// @author      NarwhalKid
// @description Ignore the awful code I made this when I was learning JS
// @downloadURL https://update.greasyfork.org/scripts/461715/Human%20Benchmark%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/461715/Human%20Benchmark%20Cheats.meta.js
// ==/UserScript==





window.addEventListener("load", function () {
  let oldHref = document.location.href,
    bodyDOM = document.querySelector("body");
  function checkModifiedBody() {
    let tmp = document.querySelector("body");
    if (tmp != bodyDOM) {
      bodyDOM = tmp;
      observer.observe(bodyDOM, config);
    }
  }
  const observer = new MutationObserver(function (mutations) {
    if (oldHref != document.location.href) {
      oldHref = document.location.href;
      location.reload();
      window.requestAnimationFrame(checkModifiedBody)
    }
  });
  const config = {
    childList: true,
    subtree: true
  };
  observer.observe(bodyDOM, config);
}, false);








if (window.location.href == "https://humanbenchmark.com/tests/reactiontime") {
var simulateMouseEvent = function(element, eventName, coordX, coordY) {
  element.dispatchEvent(new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coordX,
    clientY: coordY,
    button: 0
  }));
};

var theButton = document.getElementsByClassName("css-42wpoy e19owgy79")[0]

var box = theButton.getBoundingClientRect(),
        coordX = box.left + (box.right - box.left) / 2,
        coordY = box.top + (box.bottom - box.top) / 2;

function waitTilGreen() {
  if (document.getElementsByClassName("view-go")[0]) {
  simulateMouseEvent(theButton, "mousedown", coordX, coordY);
  simulateMouseEvent(theButton, "mouseup", coordX, coordY);
    simulateMouseEvent(theButton, "mousedown", coordX, coordY);
  simulateMouseEvent(theButton, "mouseup", coordX, coordY);
    waitTilGreen()
  } else {
    setTimeout(()=>{
      waitTilGreen()
    },0)
  }
}

waitTilGreen()
}

if (window.location.href == "https://humanbenchmark.com/tests/verbal-memory") {

// shamelessly stolen from https://greasyfork.org/en/scripts/446913-verbal-memory-bot-humanbenchmark-com/

  let INTERVAL = 0;

let botbtn = document.createElement("button");
let startbtn = document.querySelector("button.css-de05nr.e19owgy710");
let settingsdiv = document.createElement("div");
let btndiv = startbtn.parentElement;
botbtn.className = startbtn.className;
botbtn.innerText = "Start Bot";
settingsdiv.className = btndiv.className;
let intervalinput = document.createElement("input");
intervalinput.className = ".css-1gr1qbh";
intervalinput.type = "number";
intervalinput.min = 0;
intervalinput.onchange = () => (INTERVAL = parseInt(intervalinput.value));
intervalinput.value = INTERVAL;
intervalinput.style.color = "black";
intervalinput.placeholder = 0;
settingsdiv.append("Click interval (ms): ");
settingsdiv.append(intervalinput);
let fullnav = document.querySelector("div.full-nav");


let dict = [];


  listenForMemoryStart()

  function listenForMemoryStart() {

    if (document.getElementsByClassName('css-de05nr e19owgy710').length == 2) {
      memoryLoop()
    } else {
      setTimeout(()=>{
        listenForMemoryStart()
      },1)
    }

  }


function memoryLoop() {
	startbtn.click();
	setImmediate(() => {
		let worddiv = document.querySelector("div.word");
		let [seenbtn, newbtn] = document.querySelectorAll(
			"button.css-de05nr.e19owgy710"
		);
		let stopped = false;
		let stopbtn = document.createElement("button");
		stopbtn.className = startbtn.className;
		stopbtn.innerText = "Stop";
		stopbtn.onclick = () => {
			console.log("Stopped");
			stopped = true;
			stopbtn.remove();
		};
		fullnav.append(stopbtn);
		let interval = setInterval(() => {
			if (document.querySelector(".css-0")) {
				console.log("Game ended");
				document
					.querySelector("button.secondary.css-qm6rs9.e19owgy710")
					.addEventListener("click", () =>
						setImmediate(() => {
							dict = [];
							startbtn = document.querySelector(
								"button.css-de05nr.e19owgy710"
							);
							btndiv = startbtn.parentElement;
							appendStuff();
						})
					);
				stopbtn.remove();
				clearInterval(interval);
			} else if (!stopped) {
				let word = worddiv.innerText.trim();
				console.log(word);
				if (dict.includes(word)) seenbtn.click();
				else {
					dict.push(word);
					newbtn.click();
				}
			}
		}, INTERVAL);
	});
};

}


if (window.location.href == "https://humanbenchmark.com/tests/chimp") {
  function mainChimpLoop() {
  i = 1
  loopTilEnd()
  function loopTilEnd() {
  if (document.getElementsByClassName('css-de05nr e19owgy710').length == 1) {
    if (document.getElementsByClassName('css-de05nr e19owgy710')[0].innerText == "Start Test"){
      setTimeout(()=>{
        mainChimpLoop()
      },1)
    } else {
      document.getElementsByClassName('css-de05nr e19owgy710')[0].click()
    mainChimpLoop()
    }

  } else {
    if (document.querySelectorAll('[data-cellnumber="' + i + '"]').length == 1) {
      document.querySelectorAll('[data-cellnumber="' + i + '"]')[0].click()
      i++
      loopTilEnd()
    }
  }
  }
  }
  mainChimpLoop()
}

if (window.location.href == "https://humanbenchmark.com/tests/aim") {


let fullnav = document.querySelector("div.full-nav");
function addStartBtn() {

    stopped = false;
		let stopbtn = document.createElement("button");
		stopbtn.style.fontWeight = "bold"
    stopbtn.style.color = "#333333"
		stopbtn.innerText = "Start";
		stopbtn.onclick = () => {
			console.log("Started");
			shootLoop()
      setTimeout(()=>{
        document.getElementsByClassName('secondary css-qm6rs9 e19owgy710')[0].click()
      },4)
			stopbtn.remove();
		};
		fullnav.append(stopbtn);


  }

  addStartBtn()


function shootLoop() {

  if (document.getElementsByClassName('css-ad1j3y e6yfngs2')[0]) {


  var simulateMouseEvent = function(element, eventName, coordX, coordY) {
  element.dispatchEvent(new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coordX,
    clientY: coordY,
    button: 0
  }));
};

var theButton = document.getElementsByClassName('css-ad1j3y e6yfngs2')[0]

var box = theButton.getBoundingClientRect(),
        coordX = box.left + (box.right - box.left) / 2,
        coordY = box.top + (box.bottom - box.top) / 2;
  simulateMouseEvent(theButton, "mousedown", coordX, coordY);
  simulateMouseEvent(theButton, "mouseup", coordX, coordY);
  shootLoop()


  } else {
    setTimeout(()=>{
      shootLoop()
    },1)
  }
}


}

if (window.location.href == "https://humanbenchmark.com/tests/number-memory") {


let startbtn = document.querySelector("button.css-de05nr.e19owgy710");
let fullnav = document.querySelector("div.full-nav");
  function addStopBtn() {

    stopped = false;
		let stopbtn = document.createElement("button");
		stopbtn.className = startbtn.className;
		stopbtn.innerText = "Stop";
    stopbtn.id = "stopBtn"
		stopbtn.onclick = () => {
			console.log("Stopped");
			stopped = true;
			stopbtn.remove();
		};
		fullnav.append(stopbtn);


  }


  function waitForNumber(){
    if (document.getElementsByClassName('big-number').length != 0) {

      if (!document.getElementById('stopBtn')) {
      addStopBtn()
    }


      number = new Array;
      for(let i = 0; i < document.getElementsByClassName('big-number ')[0].innerText.length; i++) {
        number.push(document.getElementsByClassName('big-number ')[0].innerText[i])
        console.log(document.getElementsByClassName('big-number ')[0].innerText[i])
      }
      console.log(number)



      waitToInput();
    } else {
      setTimeout(()=>{
        waitForNumber()
      },1)
    }
  }

  function waitToInput(){
    if (document.getElementsByTagName('input')[0]) {
      if (stopped == false) {
      number.forEach((element, index)=>{
        document.getElementsByTagName('input')[0].value = document.getElementsByTagName('input')[0].value + number[index]

      })
      document.getElementsByTagName('input')[0].value = document.getElementsByTagName('input')[0].value + "W"
      document.execCommand('delete');
      document.getElementsByClassName('css-de05nr e19owgy710')[1].click()
      document.getElementsByClassName('css-de05nr e19owgy710')[1].click()
      waitForNumber()
      }
    } else {
      setTimeout(()=>{
        waitToInput()
      },1)
    }
  }


  waitForNumber()

}



if (window.location.href == "https://humanbenchmark.com/tests/memory") {



  let startbtn = document.querySelector("button.css-de05nr.e19owgy710");
let fullnav = document.querySelector("div.full-nav");
function addStopBtn() {

    stopped = false;
		let stopbtn = document.createElement("button");
		stopbtn.className = startbtn.className;
		stopbtn.innerText = "Stop";
    stopbtn.id = "stopBtn"
		stopbtn.onclick = () => {
			console.log("Stopped");
			stopped = true;
			stopbtn.remove();
		};
		fullnav.append(stopbtn);


  }


  waitForMemoryBoxes()

  function waitForMemoryBoxes() {

    if (document.getElementsByClassName(' css-lxtdud eut2yre1').length != 0) {

      if (!document.getElementById('stopBtn')) {
      addStopBtn()
    }

      assignIds()
    } else {
      setTimeout(()=>{
        waitForMemoryBoxes()
      },1)
    }
  }

  function assignIds() {
    document.getElementsByClassName(' css-lxtdud eut2yre1').forEach((element, index)=>{
      element.id = "box" + index
    })
    getHighlightedBoxesIds()
  }

  function getHighlightedBoxesIds() {
    boxes = new Array;
    if (document.getElementsByClassName('active css-lxtdud eut2yre1').length != 0) {
      document.getElementsByClassName('active css-lxtdud eut2yre1').forEach((element)=>{
        boxes.push(element.id)
      })
      waitForClickingAndClick();
    } else {
      setTimeout(()=>{
        getHighlightedBoxesIds();
      },1)
    }
  }

  function waitForClickingAndClick() {

    if (document.getElementsByClassName('active css-lxtdud eut2yre1').length == 0) {
      if (stopped == false) {
      boxes.forEach((element)=>{


        var simulateMouseEvent = function(element, eventName, coordX, coordY) {
  element.dispatchEvent(new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coordX,
    clientY: coordY,
    button: 0
  }));
};

var theButton = document.getElementById(element)

var box = theButton.getBoundingClientRect(),
        coordX = box.left + (box.right - box.left) / 2,
        coordY = box.top + (box.bottom - box.top) / 2;
  simulateMouseEvent(theButton, "mousedown", coordX, coordY);
  simulateMouseEvent(theButton, "mouseup", coordX, coordY);



      })
      waitForLevel(document.getElementsByClassName('css-dd6wi1')[0].children[1].innerText)
    }
    } else {
      setTimeout(()=>{
        waitForClickingAndClick()
      },1)
    }
  }

  function waitForLevel(oldLvl) {
    level = document.getElementsByClassName('css-dd6wi1')[0].children[1].innerText
    if (level != oldLvl) {
      if (stopped == false) {
      waitForMemoryBoxes()
      }
    } else {
      setTimeout(()=>{
        waitForLevel(level)
      },1)
    }
  }


}





if (window.location.href == "https://humanbenchmark.com/tests/sequence") {


let startbtn = document.querySelector("button.css-de05nr.e19owgy710");
let fullnav = document.querySelector("div.full-nav");


  function addStopBtn() {

    stopped = false;
		let stopbtn = document.createElement("button");
		stopbtn.className = startbtn.className;
		stopbtn.innerText = "Stop";
    stopbtn.id = "stopBtn"
		stopbtn.onclick = () => {
			console.log("Stopped");
			stopped = true;
			stopbtn.remove();
		};
		fullnav.append(stopbtn);


  }


function waitForSquares() {




    if (document.getElementsByClassName('square').length > 0){
      doCode()
    } else {
      setTimeout(()=>{
        waitForSquares();
      },1)
    }
  }

    waitForSquares()



function doCode(){
  squares = document.getElementsByClassName('square')
  squares.forEach((element, index)=>{
    element.setAttribute('id','box' + index);
  })
  waitForActiveSquare()
}



  function waitForActiveSquare() {

     if (!document.getElementById('stopBtn')) {
      addStopBtn()
    }

    if (document.getElementsByClassName('square active').length > 0){
      squareList = new Array
      squareList.push(document.getElementsByClassName('square active')[0].id)


      listenForMoreBoxes(squareList[0])
      waitForDeactiveSquare();



    } else {
      setTimeout(()=>{
        waitForActiveSquare();
      },1)
    }
  }



  function listenForMoreBoxes(id) {
    if (document.getElementsByClassName('square active').length != 0) {
      currentId = document.getElementsByClassName('square active')[0].id
      if (id != currentId) {
        squareList.push(currentId)
        listenForMoreBoxes(currentId)
      } else {
        setTimeout(()=>{
          listenForMoreBoxes(id)
        },1)
      }
    }
  }





  function waitForDeactiveSquare() {

    if (document.getElementsByClassName('square active').length == 0){

      if (stopped == false) {

      squareList.forEach((element)=>{

        var simulateMouseEvent = function(element, eventName, coordX, coordY) {
  element.dispatchEvent(new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: coordX,
    clientY: coordY,
    button: 0
  }));
};

var theButton = document.getElementById(element)

var box = theButton.getBoundingClientRect(),
        coordX = box.left + (box.right - box.left) / 2,
        coordY = box.top + (box.bottom - box.top) / 2;
  simulateMouseEvent(theButton, "mousedown", coordX, coordY);
  simulateMouseEvent(theButton, "mouseup", coordX, coordY);


      })
      waitForActiveSquare()
      }
    } else {
      setTimeout(()=>{
        waitForDeactiveSquare()
      },1)
    }
}



}
if (window.location.href == "https://humanbenchmark.com/tests/typing") {

  (function() {
      'use strict';

      const origAddEventListener = EventTarget.prototype.addEventListener;

      EventTarget.prototype.addEventListener = function(type, listener, options) {
          if (type === 'keydown' || type === 'keyup' || type === 'keypress') {
              const wrappedListener = function(e) {
                  // Proxy event to override isTrusted
                  const proxyEvent = new Proxy(e, {
                      get(target, prop) {
                          if (prop === 'isTrusted') return true;
                          return Reflect.get(target, prop);
                      }
                  });
                  return listener.call(this, proxyEvent);
              };
              return origAddEventListener.call(this, type, wrappedListener, options);
          }
          return origAddEventListener.call(this, type, listener, options);
      };
  })();

  const textbox = document.querySelector('.letters.notranslate');
  const text = textbox.innerText;

  textbox.focus();

  for (let i = 0; i < text.length; i++) {
    const event = new KeyboardEvent('keydown', {
      key: text[i],
      keyCode: 65,
      bubbles: true,
      cancelable: true
    });
    textbox.dispatchEvent(event);
  }


}
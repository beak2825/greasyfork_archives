// ==UserScript==
// @name         Milovana RNG helper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  none
// @author       Original -> BluNote / This -> (Modified) MrNumbel
// @match        https://milovana.com/webteases/showtease.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394416/Milovana%20RNG%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/394416/Milovana%20RNG%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Build interface
    //Create & Append div
    var parent = document.getElementById("ci");
  	// Do nothing if the page already contains this script's content
  	if (document.getElementById("customWrapper") != null) {
      exit;
    }
  	var hr1 = document.createElement("hr");
  	var hr2 = document.createElement("hr");
  	var hr3 = document.createElement("hr");
    var wrapper = document.createElement("div");
  	var containerDiv = document.createElement("div");
  	var openBtn = document.createElement("button");
    wrapper.id = "customWrapper";
		containerDiv.id = "containerDiv";
  	openBtn.id = "openBtn";
  	openBtn.textContent = "Open RNG tools";
    parent.appendChild(wrapper);
  	wrapper.appendChild(containerDiv);
  	wrapper.appendChild(openBtn);
  
  	// Inside containerDiv
  	var rngPageDiv = document.createElement("div");
  	var rngDiv = document.createElement("div");
  	var closeButtonDiv = document.createElement("div");
  	var pointTrackerDiv = document.createElement("div");
  	containerDiv.appendChild(rngPageDiv);
 		containerDiv.appendChild(hr1);
    containerDiv.appendChild(rngDiv);
  	containerDiv.appendChild(hr2);
  	containerDiv.appendChild(pointTrackerDiv);
  	containerDiv.appendChild(hr3);
    containerDiv.appendChild(closeButtonDiv);
  	
  
  	// Inside closeBtnDiv
  	var closeBtn = document.createElement("button");
  	closeBtn.textContent = "Close RNG tools";
   	closeButtonDiv.appendChild(closeBtn);
  
    //Creating Button
    var btn = document.createElement("input");
    btn.type = "button";
    btn.value = "Roll";
    btn.id = "rng_Button";
    btn.onclick = init;
  	// Append to wrapper
  	wrapper.appendChild(btn);
  
    // Creating Lottery Checkbox
    var check = document.createElement('input');
    check.type = "checkbox";
    check.id = "lotteryEnable";
  
    var label = document.createElement("Label");
    label.innerHTML = "Lottery Mode";
    label.setAttribute("for", "lotteryEnable");
  
  	// Creating Lottery Boxes and title
  	var pPage = document.createElement('p');
    var input1 = document.createElement('input');
    var input2 = document.createElement('input');
  	pPage.textContent = "Page RNG Config";
    input1.type = "number";
    input2.type = "number";
    input1.placeholder = "min";
    input2.placeholder = "max";
    input1.id = "minBox";
    input2.id = "maxBox";
  
    // Look for saved data from previous page
    var storedMin = localStorage.getItem('min');
    var storedMax = localStorage.getItem('max');
    var storedCheck = localStorage.getItem('check');
  	var storedPointsA = localStorage.getItem('pointsA');
  	var storedPointsB = localStorage.getItem('pointsB');
  	var storedPointsC = localStorage.getItem('pointsC');
  
  	// Appending Lottery elements
  	rngPageDiv.appendChild(pPage);
    rngPageDiv.appendChild(input1);
    rngPageDiv.appendChild(input2);
    rngPageDiv.appendChild(document.createElement('br'));
    rngPageDiv.appendChild(check);
  	rngPageDiv.appendChild(label);
    
  
  	if (storedMin != null) input1.value = storedMin;
    if (storedMax != null) input2.value = storedMax;
    if (storedCheck != null) {
        if (storedCheck == "true") {
            check.checked = true;
        } else {
            check.checked = false;
        }
    }

  
  	// Creating RNG boxes and title
  	var pRNG = document.createElement('p');
    var input3 = document.createElement('input');
    var input4 = document.createElement('input');
    var input5 = document.createElement('input');
  	pRNG.textContent = "Roll a number";
    input3.type = "number";
    input4.type = "number";
  	input5.type = "number";
    input3.placeholder = "min";
    input4.placeholder = "max";
  	input5.placeholder = "result";
    input3.id = "minRng";
    input4.id = "maxRng";
  	input5.id = "resultRng";
  	input5.setAttribute('readonly', true); 
  
    // Create button for rolling numbers 
    var btn2 = document.createElement("button");
    btn2.type = "button";
    btn2.textContent = "Roll";
  
  	// Appending RNG elements
  	rngDiv.appendChild(pRNG);
  	rngDiv.appendChild(input3);
  	rngDiv.appendChild(input4);
  	rngDiv.appendChild(input5);
    rngDiv.appendChild(document.createElement('br'));
  	rngDiv.appendChild(btn2);
  
  	// Create elements for storing points
  	var pPoints = document.createElement('p');
  	var input6 = document.createElement('input');
  	var input7 = document.createElement('input');
  	var input8 = document.createElement('input');
  	pPoints.textContent = "Point storage";
   	input6.type = "number";
    input7.type = "number";
    input8.type = "number";
    input6.placeholder = "points a";
  	input7.placeholder = "points b";
  	input8.placeholder = "points c";
    input6.id = "pointsA";
    input7.id = "pointsB";
    input8.id = "pointsC";
  
    // Create button for storing points 
    var btn3 = document.createElement("button");
    btn3.type = "button";
    btn3.textContent = "Save";
  
  	// Appending points elements
    pointTrackerDiv.appendChild(pPoints);
  	pointTrackerDiv.appendChild(input6);
  	pointTrackerDiv.appendChild(input7);
  	pointTrackerDiv.appendChild(input8);
    pointTrackerDiv.appendChild(document.createElement('br'));
  	pointTrackerDiv.appendChild(btn3);
  
    if (storedPointsA != null) input6.value = storedPointsA;
    if (storedPointsB != null) input7.value = storedPointsB;
    if (storedPointsC != null) input8.value = storedPointsC;
  	// btn events
  	openBtn.onclick = function() {
    	containerDiv.style.display = containerDiv.style.display === 'none' ? '' : 'none';
    };
  
    closeBtn.onclick = function() {
    	containerDiv.style.display = 'none';
    };
  
  	btn2.onclick = function() {
    	input5.value = random(Number(input3.value), Number(input4.value));
    };  
  
  	btn3.onclick = function() {
    	localStorage.setItem('pointsA', Number(input6.value));
      localStorage.setItem('pointsB', Number(input7.value));
      localStorage.setItem('pointsC', Number(input8.value));
    };
  
  	// Wrapper style
    Object.assign(wrapper.style, {
      textAlign: 'center',
  	});
  
    // Open btn style
    Object.assign(openBtn.style, {
      padding: '0.6em 1em',
      background: "#b85959",
      color: 'white',
      border: 'none',
      borderRadius: '0.3em',
      cursor: 'pointer',
  	});
  
  	// containerDiv style
    Object.assign(containerDiv.style, {
      padding: '0.6em',
      textAlign: 'left',
      position: 'fixed',
      left: '10vw',
      top: '50%',
      transform: 'translateY(-50%)',
      background: '#faeeee',
      width: '80vw',
      display: 'none',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
      boxShadow: '1px 1px 5px grey',
      zIndex: '100',
  	});
  
  	// p Title style
    Object.assign(pPage.style, {
      fontSize: '30px',
  	});
  
  	Object.assign(pRNG.style, {
      fontSize: '30px',
  	});
  
    Object.assign(pPoints.style, {
      fontSize: '30px',
  	});
  
  	// input style
    Object.assign(input1.style, {
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	});
  
    Object.assign(input2.style, {
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	});
  
  	Object.assign(input3.style, {
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	});  
  
  	Object.assign(input4.style, {
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	}); 
  
  	Object.assign(input5.style, {
      background: 'lightgrey',
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	});
  
  	Object.assign(input6.style, {
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	}); 
  
  	Object.assign(input7.style, {
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	});
  
  	Object.assign(input8.style, {
      margin: '0.3em',
      padding: '0.6em',
      textAlign: 'center',
      borderRadius: '0.3em',
      border: '1px solid #e5c3c3',
  	});
  
  	// checkbox Label style
    Object.assign(label.style, {
      margin: '0.3em',
      padding: '0.6em 1em',
      display: 'inline-block',
      background: "#b85959",
      color: 'white',
      border: 'none',
      borderRadius: '0.3em',
      cursor: 'pointer',
  	});
  
    // closeButtonDiv style
    Object.assign(closeButtonDiv.style, {
      textAlign: 'center',
  	});
  
  	// rngPageDiv style
    Object.assign(rngPageDiv.style, {
      textAlign: 'center',
  	});
  
    // rngDiv style
    Object.assign(rngDiv.style, {
      textAlign: 'center',
  	});
  
    // pointTrackerDiv style
    Object.assign(pointTrackerDiv.style, {
      textAlign: 'center',
  	});
  
  	// Close btn style
     Object.assign(closeBtn.style, {
      margin: '0.3em',
      padding: '0.6em 1em',
      background: "#b85959",
      color: 'white',
      border: 'none',
      borderRadius: '0.3em',
      cursor: 'pointer',
  	});
  
  	// Roll btn style
     Object.assign(btn.style, {
      margin: '0.3em',
      padding: '0.6em 1em',
      background: "#b85959",
      color: 'white',
      border: 'none',
      borderRadius: '0.3em',
      cursor: 'pointer',
  	});
  
    Object.assign(btn2.style, {
      margin: '0.3em',
      padding: '0.6em 1em',
      background: "#b85959",
      color: 'white',
      border: 'none',
      borderRadius: '0.3em',
      cursor: 'pointer',
  	});
  
    Object.assign(btn3.style, {
      margin: '0.3em',
      padding: '0.6em 1em',
      background: "#b85959",
      color: 'white',
      border: 'none',
      borderRadius: '0.3em',
      cursor: 'pointer',
  	});
  
  	// hr style 
    Object.assign(hr1.style, {
      color: 'rgba(200,200,200,0.3)'
  	});
  
  	Object.assign(hr2.style, {
      color: 'rgba(200,200,200,0.3)'
  	});
  
  	Object.assign(hr3.style, {
      color: 'rgba(200,200,200,0.3)'
  	});
  
      function init(){
        //Get and Store min/max to preserve while playing
        var min = Number(input1.value);
        var max = Number(input2.value);
        console.log("min: " + min + " max: " + max);
        localStorage.setItem('min', min);
        localStorage.setItem('max', max);
        localStorage.setItem('check', check.checked);
        //Input validation and rolling
        if (min <= max)
            var rng = random(min, max);
        else {
            alert("min must be smaller or equal to max");
            return;
        }
        console.log("Rolled: " + rng);
        //Get current URL and parse
        var url = window.location.href;
        var currentPage = parsePage(url);
        console.log("Current Page: " + currentPage);
        //Handle Lottery Mode
        if (check.checked == true) lotteryMode(url, currentPage, rng);
        //URL manipulation
        var nextURL = generateNextPage(url, currentPage, rng);
        console.log("New URL: " + nextURL);
        //go to next Page
        if (check.checked == false)
            location.href = nextURL;
    }

    function lotteryMode(url, currentPage, num){
        if (!url.includes("&p=")) url += "&p=" + num;
        else {
            url = url.replace(("&p=" + currentPage), ("&p=" + num));
        }
        console.log("LOTTERY MODE: URL: " + url);
        location.href = url;
    }

    function generateNextPage(url, currentPage, rng){
        var idx = url.search("&p=");
        var num = currentPage + rng;
        console.log("DEBUG: num: " + num);
        if (idx != -1){
            url = url.replace(("p=" + currentPage), ("p=" + num));
            console.log("DEBUG2: " + url);
        }
        else url += "&p=" + num;
        return url;
    }

    function parsePage(url){
        var idx = url.search("&p=");
        if (idx != -1){
            url = url.replace("#t", "");
            return Number(url.slice(idx+3, url.length));
        }
        //First page doesnt specify so in url
        else return 1;
    }

    function random(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
})();
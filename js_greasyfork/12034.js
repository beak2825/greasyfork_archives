// ==UserScript==
// @name         WaniKani Nippongrammar Extension
// @namespace    WK-nippongrammar
// @version      0.11
// @website      http://nippongrammar.appspot.com/
// @description  Svg Canvas used to draw Kanji on reviews and lessons, using website code.
// @author       Code by Aaron Drew, Wanikani adaption by Ethan McCoy
// @include      *.wanikani.com/review/session*
// @include      *.wanikani.com/lesson/session*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/12034/WaniKani%20Nippongrammar%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/12034/WaniKani%20Nippongrammar%20Extension.meta.js
// ==/UserScript==




/**
 * Returns a function that animates a linear curve on a canvas and calls its first argument when complete.
 * @param {HTMLElement} canvas
 * @param {Array.<Number>} p0 - Initial coordinates
 * @param {Array.<Number>} p1 - Final coordinates
 * @param {Number} w0 - Initial stroke width
 * @param {Number} w1 - Final stroke width
 * @param {Number} milliseconds - time taken to draw the stroke in milliseconds
 */
function linearCurve(canvas, p0, p1, w0, w1, milliseconds)
{
	return function(success) {
		var t = 0;
		//canvas.beginPath();
		canvas.lineWidth = w0;
		canvas.moveTo(p0[0],p0[1]);
		var interval = setInterval(function() {
		  // If there's less than 5ms	left
			t += 5 / milliseconds;
			if(t > 1.0)
			{
				//finish drawing line and call success function
				canvas.lineWidth = w1;
				canvas.lineTo(p1[0],p1[1]);
				canvas.stroke();
				clearInterval(interval);
				success();
			}
			else
			// more than 5ms left. t is the portion of time left that equals 5ms
			{

				var x = (1-t)*p0[0] + t*p1[0];
				var y = (1-t)*p0[1] + t*p1[1];
				canvas.lineWidth = w0 * (1 - t) + w1 * t;
				//Draw the line to the percentage along the line and percentage of widths
				canvas.lineTo(x,y);
				canvas.strokeStyle = "white";
				canvas.stroke();
			}
		}, 5);
	};
}

/**
 * Returns a function that animates a bezier curve on a canvas and calls its first argument when complete.
 */
function bezierCurve(canvas, p0, p1, p2, w0, w1, milliseconds)
{
	return function(success) {
		var t = 0;
		//canvas.beginPath();
		canvas.lineWidth = w0;
		canvas.moveTo(p0[0],p0[1]);

		var interval = setInterval(function() {
			t += 1 / milliseconds;
			if(t > 1.0)
			{
				canvas.lineWidth = w1;
				canvas.lineTo(p2[0],p2[1]);
				canvas.stroke();
				clearInterval(interval);
				success();

			}
			else
			{
				var x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
				var y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];

				canvas.lineWidth = w0 * (1 - t) + w1 * t;
				canvas.lineTo(x,y);
                canvas.strokeStyle = "white";
				canvas.stroke();
			}
		}, 1);
	};
}

/**
 * Returns a function that animates a quadratic curve on a canvas and calls its first argument when complete.
 */
function quadraticCurve(canvas, p0, p1, p2, p3, w0, w1, milliseconds)
{
	return function(success) {
		var t = 0;
		//canvas.beginPath();
		canvas.lineWidth = w0;
		canvas.moveTo(p0[0],p0[1]);
		var interval = setInterval(function() {
			t += 1 / milliseconds;
			if(t > 1.0)
			{
				canvas.lineWidth = w1;
				canvas.lineTo(p3[0],p3[1]);
				canvas.stroke();
				clearInterval(interval);
				success();
			}
			else
			{
				var x = (1-t)*(1-t)*(1-t)*p0[0] + 3*(1-t)*(1-t)*t*p1[0] + 3*(1-t)*t*t*p2[0] + t*t*t*p3[0];
				var y = (1-t)*(1-t)*(1-t)*p0[1] + 3*(1-t)*(1-t)*t*p1[1] + 3*(1-t)*t*t*p2[1] + t*t*t*p3[1];
				canvas.lineWidth = w0 * (1 - t) + w1 * t;
				canvas.lineTo(x,y);
                canvas.strokeStyle = "white";
				canvas.stroke();
			}
		}, 1);
	};
}

function renderPath(canvas, path, millisecondsPerStroke, callback)
{
    console.log ("rendering path: " + path);
	var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var lower = "abcdefghijklmnopqrstuvwxyz";
	var last = null;
	var strokes = [];
	// Parse the path string
	while(path.length) {
		var cmd = path.charAt(0);
		var i = 1;
		while(i < path.length) {
			var c = path.charAt(i);
			if((c>='A'&&c<='Z')||(c>='a'&&c<='z'))
				break;
			i++;
		}
		var data = path.substring(1, i);
		path = path.slice(i);

		data = data.replace(/(\d)-(\d)/g, "$1,-$2").split(",");
		for(i=0;i<data.length;i++)
			data[i] = parseFloat(data[i]);

		// convert from relative to absolute positions as needed.
		if(lower.indexOf(cmd) != -1)
		{
			for(i=0;i<data.length;i++)
				data[i] += last[i%2];
			cmd = upper.charAt(lower.indexOf(cmd));
		}

		if(cmd == "L")
			strokes.push(linearCurve(canvas, last, data, 9, 2, millisecondsPerStroke));
		if(cmd == "S")
			strokes.push(bezierCurve(canvas, last, [data[0],data[1]], [data[2], data[3]], 9, 1, millisecondsPerStroke));
		if(cmd == "C")
			strokes.push(quadraticCurve(canvas, last, [data[0],data[1]], [data[2], data[3]], [data[4],data[5]], 9, 1, millisecondsPerStroke));

		if(cmd == "M") {
			last = data;
		} else if(cmd == "L") {
			last = data;
		} else if(cmd == "S") {
			last = [data[2],data[3]];
		} else if(cmd == "C") {
			last = [data[4],data[5]];
		}
	}

	function nextStroke() {
		if(strokes.length)
		{
			strokes.shift()(nextStroke);
		}
		else
		{
			if(typeof callback != "undefined")
				callback();
		}
	};
	nextStroke();
};

function renderMoji(canvas, moji, millisecondsPerStroke)
{
	return function(success, error) {
		kanjiSvg.getSvg(moji, function(moji, svg) {
			renderPath(canvas, svg, millisecondsPerStroke, success);
		}, function(k) {
			if(typeof(error) != "undefined") error();
		});
	};
}

function renderMojiOrSpan(canvasElem, moji, millisecondsPerStroke)
{
	return function(success) {
		renderMoji(canvasElem.getContext("2d"), moji, millisecondsPerStroke)(function() {
			success();
		}, function() {
			canvasElem.outerHTML = "<span>"+moji+"</span>";
			success();
		});
	};
}

function animateWriting(txt, div_id, millisecondsPerStroke)
{
    if (typeof div_id === 'string'){
        document.getElementById(div_id).innerHTML = "";
    }else{
        div_id.innerHTML = "";
    }
	var renderQueue = [];

	function renderNext() {
		if(renderQueue.length)
			renderQueue.shift()();
	}

	for(var i=0;i<txt.length;i++) {
		var ch = txt.charAt(i);
		var canvas = document.createElement("canvas");
		canvas.width = 110;
		canvas.height = 110;
		canvas.style.width = "1em";
		canvas.style.height = "1em";


        if (typeof div_id === 'string'){
            document.getElementById(div_id).appendChild(canvas);
        }else{
            div_id.appendChild(canvas);;
        }

		renderQueue.push(renderMojiOrSpan(canvas, ch, millisecondsPerStroke));
	}

	function nextStroke() {
		if(renderQueue.length)
		{
			renderQueue.shift()(nextStroke, function() {
				nextStroke();
			});
		}
	};
	nextStroke();
};



//"use strict";
//Load resources KanjiSVG and renderer.
$("head").prepend('<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/kanjisvg@0.2.1/kanjiSVG.js"></script>');

// Don't need to load this anymore, just pasted the code above.
//$("head").prepend('<script type="text/javascript" src="https://greasyfork.org/scripts/11951-kanjirender/code/kanjirender.js"></script>');

//NipponGrammar class object
    var NG = {
        //Flag to keep track of state, whether canvas is shown or not.
        strokesShown: true,
        //html div that holds the canvases, each character has its own canvas
        strokeDiv: document.getElementById('strokeChar'),

        //function to show the canvas kanji
        showStrokes : function(){
            //set the flag if false, setting it to true if true does nothing. We want to be sure it is true.
            this.strokesShown = true;
            this.strokeDiv && (this.strokeDiv.style.display = "block");
            this.charDiv && (this.charDiv.style.display = "none");
        },
        //function to hide the canvas and show the original kanji
        showOriginal: function(){
            this.strokesShown = false;
            this.strokeDiv && (this.strokeDiv.style.display = "none");
            this.charDiv && (this.charDiv.style.display = "block");
        },

        showImage: function(){
            //as above but don't change strokesShown flag.
            //This is used for radicals that are images, there are no canvases to show, but we do not want to change the default behaviour of whether we use them or not for other items
            this.strokeDiv && (this.strokeDiv.style.display = "none");
            this.charDiv && (this.charDiv.style.display = "block");
        },

        animateStrokes: function(text){
            //If the document doesn't have a div with the id 'strokeChar', make one and put it in the appropriate spot.
            if (this.strokeDiv === null){
                this.strokeDiv = document.createElement('div');
                //this.strokeDiv.style = "padding: 20px 20px 0; height: 110px; width: 110px",
                this.strokeDiv.id = "strokeChar";

                //charDiv is set when a new quiz is loaded. Lessons and reviews are slightly different layout, so it retrieves it differently for each
                this.charDiv && this.charDiv.parentNode.insertBefore(this.strokeDiv, this.charDiv);
            }

            //I forgot if there's a reason the border is set here
            this.strokeDiv.style.border = "1px";

            //add replay functionality by removing and reapplying click listeners
            this.strokeDiv.removeEventListener("click", handlers.onDivClick);
            this.strokeDiv.addEventListener("click", handlers.onDivClick);

            //function from kanjirender.js. text is the string, strokeChar is id of the div containing the canvases and 10 is the speed to animate the strokes
            animateWriting(text,'strokeChar',10);

            //Default is to show the strokes. run the function initially if flag set. Function will again set the flag because it needs to when called elsewhere.
            if (this.strokesShown){
                console.debug("showing strokes");
                this.showStrokes();
            }
        },
    };

    //Handler functions for mouse events, new quizItem events, and hotkeys
    var handlers = {
        switchViews: function(e){
            //Shift and Left Arrow
            e.shiftKey && e.keyCode === 37 && NG.showStrokes();
            e.shiftKey && e.keyCode === 39 && NG.showOriginal();
        },

        onDivClick: function(){
            NG.animateStrokes(NG.text||"");
        },

        handleKeyChange: function(key, action){

            console.groupCollapsed("animate strokes userscript");

            switch (key){
                case "l/currentLesson":
                case "l/currentQuizItem":
                    //for lessons and their following quizzes
                    NG.charDiv = document.getElementById("character");
                    break;
                case "currentItem":
                    //for reviews
                    var spanArr = document.getElementById("character").getElementsByTagName("span");
                    NG.charDiv = spanArr[spanArr.length-1]; //animate strokes may insert spans for chars it doesn't know.
                    break;
            }
            var cur = $.jStorage.get(key);
            NG.text = cur.voc || cur.kan || cur.rad || "";
            if (NG.text.indexOf(".png") === -1) { //weed out picture radicals for now, extend svg library later
                NG.animateStrokes(NG.text);
                //introduce hotkey switching
                document.addEventListener("keyup", handlers.switchViews);
            }else{
                //remove hotkey switching
                document.removeEventListener("keyup", handlers.switchViews);
                NG.showImage();
            }
            console.groupEnd();
        }
    };

    var handleLevelsPage = function(){
    };




function main() {

if (document.URL.match(/.wanikani.com\/level\//)){
        false&&handleLevelsPage();
    }else{
        $.jStorage.listenKeyChange("currentItem", handlers.handleKeyChange);
        $.jStorage.listenKeyChange("l/currentQuizItem", handlers.handleKeyChange);
        $.jStorage.listenKeyChange("l/currentLesson", handlers.handleKeyChange);
    }


}

function animateWriting(txt, div_id, millisecondsPerStroke)
{
    if (typeof div_id === 'string'){
        document.getElementById(div_id).innerHTML = "";
    }else{
        div_id.innerHTML = "";
    }
	var renderQueue = [];

	function renderNext() {
		if(renderQueue.length) 
			renderQueue.shift()();
	}

	for(var i=0;i<txt.length;i++) {
		var ch = txt.charAt(i);
		var canvas = document.createElement("canvas");
		canvas.width = 110;
		canvas.height = 110;
		canvas.style.width = "110";
		canvas.style.height = "110";

	
        if (typeof div_id === 'string'){
            document.getElementById(div_id).appendChild(canvas);
        }else{
            div_id.appendChild(canvas);;
        }

		renderQueue.push(renderMojiOrSpan(canvas, ch, millisecondsPerStroke));
	}

	function nextStroke() {
		if(renderQueue.length)
		{
			renderQueue.shift()(nextStroke, function() {
				nextStroke();
			});
		}
	};
	nextStroke();
};

if (document.readyState === 'complete')
    main();
else
    window.addEventListener("load", main, false);

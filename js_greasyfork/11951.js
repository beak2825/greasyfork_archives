// ==UserScript==
// @name         kanjirender
// @namespace    kanjirender
// @version      0.3
// @description Kanji render functions
// @author       Aaron Drew
// @include      *.wanikani.com/review/session*
// @grant        none
// @license        MIT
// ==/UserScript==


/**
 * Returns a function that animates a linear curve on a canvas and calls its first argument when complete.
 */
function linearCurve(canvas, p0, p1, w0, w1, milliseconds)
{
	return function(success) {
		var t = 0;
		//canvas.beginPath();
		canvas.lineWidth = w0;
		canvas.moveTo(p0[0],p0[1]);
		var interval = setInterval(function() {
			t += 5 / milliseconds;
			if(t > 1.0)
			{
				canvas.lineWidth = w1;
				canvas.lineTo(p1[0],p1[1]);
				canvas.stroke();
				clearInterval(interval);
				success();
			}
			else
			{
				var x = (1-t)*p0[0] + t*p1[0];
				var y = (1-t)*p0[1] + t*p1[1];
				canvas.lineWidth = w0 * (1 - t) + w1 * t;
				canvas.lineTo(x,y);
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
				canvas.stroke();
			}
		}, 1);
	};
}

function renderPath(canvas, path, millisecondsPerStroke, callback)
{
	var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var lower = "abcdefghijklmnopqrstuvwxyz";
	var last = null;
	var strokes = [];

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

		var data = data.replace(/(\d)-(\d)/g, "$1,-$2").split(",");
		for(var i=0;i<data.length;i++)
			data[i] = parseFloat(data[i]);

		// convert from relative to absolute positions as needed.
		if(lower.indexOf(cmd) != -1)
		{
			for(var i=0;i<data.length;i++)
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

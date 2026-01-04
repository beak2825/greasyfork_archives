// ==UserScript==
// @name         ColorCodedLyrics Add Name Titles To Colored Lyric Lines
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Attempts to automatically title color-coded lyric spans on colorcodedlyrics.com for convenience. May not work on all pages due to small HTML structure variations.
// @author       You
// @match        https://colorcodedlyrics.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=colorcodedlyrics.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489909/ColorCodedLyrics%20Add%20Name%20Titles%20To%20Colored%20Lyric%20Lines.user.js
// @updateURL https://update.greasyfork.org/scripts/489909/ColorCodedLyrics%20Add%20Name%20Titles%20To%20Colored%20Lyric%20Lines.meta.js
// ==/UserScript==

/*The website colorcodedlyrics.com color codes k-pop lyrics based on who's singing them. This script tries to find the member-color key and grab the information. Then, it iterates over each colored lyric span and checks its color. If the span's color is recognized as corresponding to one of the members/the singer, it sets the span's "title" attribute to the name of the member the color corresponds to.
This script may not work on all colorcodedlyrics.com pages due to small variations in the HTML layouts of pages potentially preventing the script from finding the key or lyrics.
Most of this script is color processing code I copied from one of my other projects, because sometimes the site specifies the key's color in "rgb()" format but colors the lyrics in "#rrggbb" (hex triplet) format, and normalization is needed to compare the colors.*/

(function() {
    'use strict';

    //This color processing function was copied from R74n's sandboxels.r74n.com
    function hexToRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    function RGBToHex(rgb) {
        var r = parseInt(rgb.r||rgb[0]);
        var g = parseInt(rgb.g||rgb[1]);
        var b = parseInt(rgb.b||rgb[2]);
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    //End

	//start of sandboxels "a_mod_by_alice.js" mod color conversion and processing code
    function englishFormatList(thingsArrayIn) {
        var thingsArray = thingsArrayIn;
        var amount = thingsArray.length;
        if(amount == 1) {
            return thingsArray[0]
        } else if(amount == 2) {
            return thingsArray.join(" and ")
        } else {
            var lastItem = thingsArray[thingsArray.length - 1];
            thingsArray[thingsArray.length - 1] = "and " + lastItem;
            return thingsArray.join(", ")
        };
    };

    //Limit number to [min, max]
	function bound(number,lowerBound,upperBound) {
		return Math.min(upperBound,Math.max(lowerBound,number));
	};

	//Emergency color wrapper
	function rgbColorBound(color) {
		return bound(color,0,255);
	};

    function rgbStringToUnvalidatedObject(string) { //turns rgb() to {r,g,b} with no bounds checking
		//console.log("Splitting string into object");
		string = string.split(",");
		var red = parseFloat(string[0].substring(4));
		var green = parseFloat(string[1]);
		var blue = parseFloat(string[2].slice(0,-1));
		//console.log("String split: outputs " + red + ", " + green + ", " + blue + ".");
		return {r: red, g: green, b: blue};
	};

	function rgbStringToObject(string,doRounding,doBounding) { //turns rgb() to {r,g,b}
		doRounding = doRounding ?? true;
		doBounding = doBounding ?? true;
		//console.log(`rgbStringToObject: ${string}`);
			//console.log("Splitting string into object");
		if( !(string.startsWith("rgb(")) || !(string.endsWith(")")) ) {
			throw new Error('Color must start with "rgb(" and end with ")"');
		};
		var red,green,blue;
		[red,green,blue] = string.match(/[0-9\-.]+/g).slice(0,3).map(x => parseFloat(x));
			//console.log(`Colors loaded (${red}, ${green}, ${blue})`);
		//NaN checking
			var redNaN = isNaN(red);
			var greenNaN = isNaN(green);
			var blueNaN = isNaN(blue);
			var NanErrorString = "One or more colors are NaN:"
			if(redNaN) { NanErrorString += " red" };
			if(greenNaN) { NanErrorString += " green" };
			if(blueNaN) { NanErrorString += " blue" };
			if(redNaN || greenNaN || blueNaN) { throw new Error(NanErrorString) };
		if(doRounding) {
			red = Math.round(red);
			green = Math.round(green);
			blue = Math.round(blue);
				//console.log(`Colors rounded to (${red}, ${green}, ${blue})`);
		};
		if(doBounding) {
			red = bound(red,0,255)
			green = bound(green,0,255)
			blue = bound(blue,0,255)
				//console.log(`Colors bounded to (${red}, ${green}, ${blue})`);
		};
			//console.log("String split: outputs " + red + ", " + green + ", " + blue + ".");
		return {r: red, g: green, b: blue};
	};

	function hslColorStringToObject(color) {
		if(!color.startsWith("hsl(") || !color.endsWith(")")) {
			throw new Error(`The color ${color} is not a valid hsl() color`)
		};
		var colorTempArray = color.split(",").map(x => x.trim())
		if(colorTempArray.length !== 3) {
			throw new Error(`The color ${color} is not a valid hsl() color`)
		};
		if(!colorTempArray[1].endsWith("%")) { console.log(`hslColorStringToObject: Saturation in color ${color} was missing a %`); colorTempArray[1] += "%"; }
		if(!colorTempArray[2].endsWith("%)")) { console.log(`hslColorStringToObject: Lightness in color ${color} was missing a %`); colorTempArray[2] = [colorTempArray[2].slice(0, colorTempArray[2].length - 1), "%", colorTempArray[2].slice(colorTempArray[2].length - 1)].join(''); }
		var hue = parseFloat(colorTempArray[0].substring(4));
		var saturation = parseFloat(colorTempArray[1].slice(0,-1))
		var lightness = parseFloat(colorTempArray[2].slice(0,-2));
		//NaN checking
			var hueNaN,saturationNaN,lightnessNaN;
			isNaN(hue) ? hueNaN = true : hueNaN = false;
			isNaN(saturation) ? saturationNaN = true : saturationNaN = false;
			isNaN(lightness) ? lightnessNaN = true : lightnessNaN = false;
			var NanErrorString = "One or more colors are NaN:"
			if(hueNaN) { NanErrorString += " hue" };
			if(saturationNaN) { NanErrorString += " saturation" };
			if(lightnessNaN) { NanErrorString += " lightness" };
			if(hueNaN || saturationNaN || lightnessNaN) { throw new Error(NanErrorString) };
		return {h: hue, s: saturation, l: lightness};
	};

	function rgbToHex(color) {
		//console.log(`rgbToHex called on ${typeof(color) === "object" ? JSON.stringify(color) : color}`);
		if(typeof(color) == "object") { //Expects object like "{r: 172, g: 11, b: 34}"
			var red = color.r;
			var green = color.g;
			var blue = color.b;
				//console.log(`Colors loaded (${red}, ${green}, ${blue})`);
			red = Math.round(red);
			green = Math.round(green);
			blue = Math.round(blue);
				//console.log(`Colors rounded to (${red}, ${green}, ${blue})`);
			red = bound(red,0,255)
			green = bound(green,0,255)
			blue = bound(blue,0,255)
				//console.log(`Colors bounded to (${red}, ${green}, ${blue})`);
			red = red.toString(16);
			green = green.toString(16);
			blue = blue.toString(16);
				//console.log(`Colors converted to (0x${red}, 0x${green}, 0x${blue})`);
			//console.log("Padding R");
			while(red.length < 2) {
				red = "0" + red;
			};
			//console.log("Padding G");
			while(green.length < 2) {
				green = "0" + green;
			};
			//console.log("Padding B");
			while(blue.length < 2) {
				blue = "0" + blue;
			};
				//console.log(`Colors padded to (0x${red}, 0x${green}, 0x${blue}), concatenating...`);
			return "#" + red + green + blue;
		} else if(typeof(color) == "string") { //Expects string like "rgb(20,137,4)". Also doesn't round properly for some reason...
				//console.log("Splitting string")
			color = rgbStringToUnvalidatedObject(color);
			red = color.r;
			green = color.g;
			blue = color.b;
				//console.log(`Colors loaded (${red}, ${green}, ${blue})`);
			red = Math.round(red);
			green = Math.round(green);
			blue = Math.round(blue);
				//console.log(`Colors rounded to (${red}, ${green}, ${blue})`);
			red = bound(red,0,255)
			green = bound(green,0,255)
			blue = bound(blue,0,255)
				//console.log(`Colors bounded to (${red}, ${green}, ${blue})`);
			red = red.toString(16);
			green = green.toString(16);
			blue = blue.toString(16);
				//console.log(`Colors converted to (0x${red}, 0x${green}, 0x${blue})`);
			//console.log("Padding R");
			while(red.length < 2) {
				red = "0" + red;
			};
			//console.log("Padding G");
			while(green.length < 2) {
				green = "0" + green;
			};
			//console.log("Padding B");
			while(blue.length < 2) {
				blue = "0" + blue;
			};
				//console.log(`Colors padded to (0x${red}, 0x${green}, 0x${blue}), concatenating...`);
			return "#" + red + green + blue;
			} else {
			throw new Error(`Received invalid color: ${color}`);
		};
	};

	function linearBlendTwoColorObjects(color1,color2,weight1) { /*third argument is for color1 and expects a float from 0
																  to 1, where 0 means "all color2" and 1 means "all color1"*/
		weight1 = weight1 ?? 0.5;
		var w1 = Math.min(Math.max(weight1,0),1);
		var red1 = color1.r;
		var green1 = color1.g;
		var blue1 = color1.b;
		var red2 = color2.r;
		var green2 = color2.g;
		var blue2 = color2.b;
		var red3 = (red1 * w1) + (red2 * (1 - w1));
		var green3 = (green1 * w1) + (green2 * (1 - w1));
		var blue3 = (blue1 * w1) + (blue2 * (1 - w1));
		return {r: red3, g: green3, b: blue3};
	};

	function lightenColor(color,offset,outputType="rgb") {
		if(typeof(color) === "string") {
			if(color.length < 10) {
			//console.log(`detected as hex: ${color}`);
				//catch missing octothorpes
				if(!color.startsWith("#")) {
					color = "#" + color;
				};
			//console.log(`octothorpe checked: ${color}`);

				offset = parseFloat(offset);
				if(isNaN(offset)) {
					throw new Error("Offset is NaN");
				};

				var oldColor = color; //for error display
				color = hexToRGB(color);
				if(color === null) {
					throw new Error(`hexToRGB(color) was null (${oldColor}, maybe it's an invalid hex triplet?)`);
				};

			//console.log("converted color: " + JSON.stringify(color));
				var red = color.r + offset;
				var green = color.g + offset;
				var blue = color.b + offset;
			//console.log(`altered color: rgb(${red},${green},${blue})`);

				//rounding and bounding
				red = Math.round(red);
				green = Math.round(green);
				blue = Math.round(blue);
			//console.log(`rounded color: rgb(${red},${green},${blue})`);
				red = bound(red,0,255)
				green = bound(green,0,255)
				blue = bound(blue,0,255)
			//console.log(`bounded color: rgb(${red},${green},${blue})`);

				color = {r: red, g: green, b: blue};

				switch(outputType.toLowerCase()) {
					case "rgb":
						return `rgb(${red},${green},${blue})`;
						break;
					case "hex":
						return rgbToHex(color);
						break;
					case "json":
						return color;
						break;
					default:
						throw new Error("outputType must be \"rgb\", \"hex\", \"json\"");
				};
			} else {
				if(color.startsWith("rgb(")) {
					color = convertColorFormats(color,"json"); //object conversion
				//console.log(`color converted to object: ${JSON.stringify(color)}`);

					offset = parseFloat(offset);
					if(isNaN(offset)) {
						throw new Error("Offset is NaN");
					};

					var red = color.r + offset;
					var green = color.g + offset;
					var blue = color.b + offset;
				//console.log(`altered color: rgb(${red},${green},${blue})`);

					//rounding and bounding
					red = Math.round(red);
					green = Math.round(green);
					blue = Math.round(blue);
				//console.log(`rounded color: rgb(${red},${green},${blue})`);
					red = bound(red,0,255)
					green = bound(green,0,255)
					blue = bound(blue,0,255)
				//console.log(`bounded color: rgb(${red},${green},${blue})`);

					color = {r: red, g: green, b: blue};

					switch(outputType.toLowerCase()) {
						case "rgb":
							return `rgb(${red},${green},${blue})`;
							break;
						case "hex":
							return rgbToHex(color);
							break;
						case "json":
							return color;
							break;
						default:
							throw new Error("outputType must be \"rgb\", \"hex\", \"json\"");
					};
				} /*else if(color.startsWith("hsl")) {
					throw new Error("HSL is not implemented yet");
				}*/ else {
					throw new Error('Color must be of the type "rgb(red,green,blue)"'/* or "hsl(hue,saturation%,luminance%)"*/);
				};
			};
		} else if(typeof(color) === "object") {
			if(typeof(color.r) === "undefined" || typeof(color.g) === "undefined" || typeof(color.b) === "undefined") {
				throw new Error("Color must be of the form {r: red, g: green, b: blue}");
			};

		//console.log("received color: " + JSON.stringify(color));
			var red = color.r + offset;
			var green = color.g + offset;
			var blue = color.b + offset;
		//console.log(`altered color: rgb(${red},${green},${blue})`);

			//rounding and bounding
			red = Math.round(red);
			green = Math.round(green);
			blue = Math.round(blue);
		//console.log(`rounded color: rgb(${red},${green},${blue})`);
			red = bound(red,0,255)
			green = bound(green,0,255)
			blue = bound(blue,0,255)
		//console.log(`bounded color: rgb(${red},${green},${blue})`);

			color = {r: red, g: green, b: blue};

			switch(outputType.toLowerCase()) {
				case "rgb":
					return `rgb(${red},${green},${blue})`;
					break;
				case "hex":
					return rgbToHex(color);
					break;
				case "json":
					return color;
					break;
				default:
					throw new Error("outputType must be \"rgb\", \"hex\", \"json\"");
			};
		};
	};

	function rgbObjectToString(color,stripAlpha) {
		stripAlpha = stripAlpha ?? false;
		if(typeof(color) !== "object") {
			throw new Error("Input color is not an object");
		};
		var red = color.r;
		var green = color.g;
		var blue = color.b;
			//console.log(`Colors loaded (${red}, ${green}, ${blue})`);
		red = Math.round(red);
		green = Math.round(green);
		blue = Math.round(blue);
			//console.log(`Colors rounded to (${red}, ${green}, ${blue})`);
		red = bound(red,0,255)
		green = bound(green,0,255)
		blue = bound(blue,0,255)
			//console.log(`Colors bounded to (${red}, ${green}, ${blue})`);
		return `rgb(${red},${green},${blue})`
	};

	function convertColorFormats(color,outputType="rgb",stripAlpha) {
		stripAlpha = stripAlpha ?? false;
		if(typeof(color) === "undefined") {
			//console.log("Warning: An element has an undefined color. Unfortunately, due to how the code is structured, I can't say which one.");
			//color = "#FF00FF";
			throw new Error("Color is undefined!");
		};
		//console.log("Logged color for convertColorFormats: " + color);
		var oldColor = color;
		var bytes,r,g,b,a;
		if(typeof(color) === "string") {
			//Hex input case

			if(color.length < 10) {
				//a proper hex quadruplet is still shorter than the shortest proper rgb() string
				//console.log(`detected as hex: ${color}`);
					//catch missing octothorpes
					if(!color.startsWith("#")) {
						color = "#" + color;
					};
				//console.log(`octothorpe checked: ${color}`);

				if(oldColor.length < 6) {
					bytes = oldColor.toLowerCase().match(/[a-z0-9]/g).map(x => parseInt(x.concat(x),16));
				} else {
					bytes = oldColor.toLowerCase().match(/[a-z0-9]{2}/g).map(x => parseInt(x,16));
				};
				r = bytes[0];
				g = bytes[1];
				b = bytes[2];
				if(bytes.length > 3) {
					a = bytes[3] / 255;
				} else {
					a = null
				};
				if(stripAlpha) { a = null };
				//to JSON for ease of use
				color = {"r": r, "g": g, "b": b};
				if(typeof(a) == "number") { color["a"] = a };
			} else {
				//otherwise assume rgb() input
				bytes = color.match(/[\d\.]+/g);
				if(typeof(bytes?.map) == "undefined") {
					console.log(bytes);
					bytes = [255,0,255]
				} else {
					bytes = bytes.map(x => Number(x));
				};
				r = bytes[0];
				g = bytes[1];
				b = bytes[2];
				if(bytes.length > 3) {
					a = bytes[3];
					if(a > 1) {
						a /= 255
					}
				} else {
					a = null
				};
				if(stripAlpha) { a = null };
				//to JSON for ease of use
				color = {"r": r, "g": g, "b": b}
				if(typeof(a) == "number") { color["a"] = a };
			};
		} else if(Array.isArray(color)) {
			bytes = color;
			r = bytes[0];
			g = bytes[1];
			b = bytes[2];
			if(bytes.length > 3) {
				a = bytes[3];
				if(a > 1) {
					a /= 255
				}
			} else {
				a = null
			};
			if(stripAlpha) { a = null };
			//to JSON for ease of use
			color = {"r": r, "g": g, "b": b}
			if(typeof(a) == "number") { color["a"] = a };
		} else if(typeof(color) == "object") {
			//variable mappings only
			r = color.r;
			g = color.g;
			b = color.b;
			if(typeof(color.a) == "number") {
				a = color.a;
			} else {
				a = null
			};
			if(stripAlpha) { a = null }
		};
		//Colors are now objects

		switch(outputType.toLowerCase()) {
			case "rgb":
			case "rgba":
				var _r,_g,_b,_a;
				_r = r;
				_g = g;
				_b = b;
				if(typeof(a) == "number") { _a = a } else { _a = null };
				var values;
				if(stripAlpha || _a == null) {
					values = [_r,_g,_b];
				} else {
					values = [_r,_g,_b,_a];
				};
				for(var i = 0; i <= 2; i++) {
					values[i] = Math.round(values[i])
				};
				return (typeof(a) == "number" ? "rgba" : "rgb") + `(${values.join(",")})`
			case "hex":
				var _r,_g,_b,_a;
				_r = r;
				_g = g;
				_b = b;
				if(typeof(a) == "number") { _a = Math.round(a * 255) } else { _a = null };
				var bytesToBe;
				if(stripAlpha || _a == null) {
					bytesToBe = [_r,_g,_b];
				} else {
					bytesToBe = [_r,_g,_b,_a];
				};
				return "#" + bytesToBe.map(x => Math.round(x).toString(16).padStart(2,"0")).join("");
			case "json":
				return color;
			case "array":
				return Object.values(color);
				break;
			default:
				throw new Error("outputType must be \"rgb\", \"hex\", \"json\", or \"array\"");
		}
	};

	function rgbHexCatcher(color) {
		return convertColorFormats(color,"rgb");
	};

	function _rgbHexCatcher(color) {
		return convertColorFormats(color,"rgb");
	};

	//https://stackoverflow.com/questions/46432335/hex-to-hsl-convert-javascript
	function rgbStringToHSL(rgb,outputType="array") { //Originally a hex-to-HSL function, edited to take RGB and spit out an array
		//console.log("HSLing some RGBs");
		var result = rgbStringToUnvalidatedObject(rgb);

		var r = result.r;
		var g = result.g;
		var b = result.b;

		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max == min){
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		};

		s = s*100;
		s = Math.round(s);
		l = l*100;
		l = Math.round(l);
		h = Math.round(360*h);

		//var colorInHSL = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
		//Edit to return an array
		switch(outputType.toLowerCase()) {
			case "array":
				return [h,s,l];
				break;
			case "hsl":
				return `hsl(${h},${s}%,${l}%)`;
				break;
			case "json":
				return {h: h, s: s, l: l};
			default:
				throw new Error("outputType must be \"array\", \"hsl\", or \"json\"");
				break;
		};
		//console.log("HSL output "+ colorInHSL + ".");

	};

	function normalizeColorToHslObject(color,arrayType) {
		arrayType = arrayType ?? null;
		var ambiguousArrayError = "changeSaturation can't tell if the array input is supposed to be RGB or HSL. Please use an \"arrayType\" argument of \"rgb\" or \"hsl\".";
		var isHsl = false;
		if(Array.isArray(color)) {
			if(arrayType === null) {
				throw new Error(ambiguousArrayError);
			} else if(arrayType === "rgb") {
				color = `rgb(${color[0]},${color[1]},${color[2]})`;
				color = rgbStringToHSL(color,"json"); //rgb arr to hsl obj
			} else if(arrayType === "hsl") {
				color = {h: color[0], s: color[1], l: color[2]}; //hsl arr to hsl obj
			} else {
				throw new Error(ambiguousArrayError);
			};
		} else {
			//by this point, any array cases would have been handled, leaving just hex (rgb), json rgb, json hsl, string rgb, and string hsl
			if(typeof(color) === "string") {
				if(color.length < 10) { //detect hex: assume hex triplet if too short to be a well-formed rgb()
					if(!color.startsWith("#")) {
						color = "#" + color; //catch missing #
					};
					isHsl = false;
				};
				if(color.startsWith("rgb(")) { //detect rgb(): self-explanatory
					isHsl = false;
				};
				if(color.startsWith("hsl(")) { //detect hsl(): self-explanatory
					isHsl = true;
				};
			} else if(typeof(color) === "object") {
				if(typeof(color.r) !== "undefined") { //detect {r,g,b}: check for r key
					isHsl = false;
				};
				if(typeof(color.h) !== "undefined") { //detect {h,s,l}: check for h key
					isHsl = true;
				};
			};
			if(!isHsl) {
				color = convertColorFormats(color,"rgb"); //make any RGBs rgb()
				color = rgbStringToHSL(color,"json"); //make that rgb() an {h,s,l}
			} else { //by this point, it would have to either be a string or an object
				if(typeof(color) === "string") { //if it's a string
					color = hslColorStringToObject(color) //now it's an object
				};
			};
		};
		return color;
	};

	function convertHslObjects(color,outputType="rgb") {
		if(color == null) { console.error("convertHslObjects: Color is null"); color = {h: 300, s: 100, l: 50} };
		switch(outputType.toLowerCase()) {
			//RGB cases
			case "rgb":
				color = convertColorFormats(hslToHex(...Object.values(color)),"json"); //hsl to hex, hex to rgb_json, and rgb_json to rgb()
				return `rgb(${color.r},${color.g},${color.b})`;
				break;
			case "hex":
				color = hslToHex(...Object.values(color)); //hsl to hex
				return color;
				break;
			case "rgbjson":
			case "rgb-json":
			case "rgb_json":
				color = hexToRGB(hslToHex(...Object.values(color))); //hsl to hex and hex to rgb_json
				return color;
				break;
			case "rgbarray":
			case "rgb-array":
			case "rgb_array":
				color = hexToRGB(hslToHex(...Object.values(color))); //hsl to hex, hex to rgb_json, and rgb_json to rgb_array
				return [color.r, color.g, color.b];
				break;
			//HSL cases
			case "hsl":
				//note: color was previously converted to {h, s, l}
				return `hsl(${color.h},${color.s}%,${color.l}%)`;
				break;
			case "hsljson":
			case "hsl-json":
			case "hsl_json":
				return color;
				break;
			case "hslarray":
			case "hsl-array":
			case "hsl_array":
				return [color.h, color.s, color.l];
				break;
			default:
				throw new Error("outputType must be \"rgb\", \"hex\", \"rgb_json\", \"rgb_array\", \"hsl\", \"hsl_json\", or \"hsl_array\"");
		}
	};

	function colorToHsl(color,outputType="json") {
		if(typeof(color.h) == "number" && typeof(color.s) == "number" && typeof(color.l) == "number") {
			return color
		};
		color = convertColorFormats(color,"rgb");
		color = rgbStringToHSL(color,outputType);
		return color;
	};

	//https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
	function hslToHex(h, s, l) { //h, s, l params to hex triplet
	  //console.log(`Hexing some HSLs (the HSLs are ${h},${s},${l})`)
	  s = bound(s,0,100); //limit to 0-100
	  l = bound(l,0,100);
	  l /= 100;
	  var a = s * Math.min(l, 1 - l) / 100;
	  var f = n => {
		var k = (n + h / 30) % 12;
		var color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
	  };
	  //console.log(`Hexed to #${f(0)}${f(8)}${f(4)}`)
	  return `#${f(0)}${f(8)}${f(4)}`;
	};
	//end of sandboxels "a_mod_by_alice.js" mod color conversion and processing code

    //The actual color-titling code
	var colorSpans = Array.from(document.querySelectorAll('div.entry-content p[style*=text-align] span[style^="color"], div.entry-content td[style*=text-align] span[style^="color"], div.entry-content p.has-text-align-center span[style^="color"]') ?? []);
    if(!colorSpans || colorSpans.length < 1) {
        console.warn("No member-color key found.");
        return false
    };

	var table = {};
    var tableText = [];
	for(var i = 0; i < colorSpans.length; i++) {
		var span = colorSpans[i];
		var name = span.textContent.replaceAll(",","").replaceAll(String.fromCodePoint(0xA0)," ").trim();
        tableText.push(`${name}\t${span.style.color.replaceAll(" ","")}`);
		var color = convertHslObjects(normalizeColorToHslObject(span.style.color),"hex");
		table[color] ??= name;
	};
    tableText = tableText.join("\n"); console.log(tableText);

	var coloredSpans = document.querySelectorAll('div.entry-content span[style^="color"]') ?? [];
    var unrecognizedColors = [];
    if(!coloredSpans || coloredSpans.length < 1) {
        console.warn("No colored lyrics found!");
        return false
    };
    for(var j = 0; j < coloredSpans.length; j++) {
		var _span = coloredSpans[j];
		var _color = convertHslObjects(normalizeColorToHslObject(_span.style.color),"hex");
		var colorCorrespondingName = table[_color];
		if(colorCorrespondingName) {
            _span.setAttribute("title",colorCorrespondingName)
        } else {
            if(!(unrecognizedColors.includes(_color))) {
                unrecognizedColors.push(_color);
            };
        };
	};
    if(unrecognizedColors.length > 0) {
        console.warn(`Unknown member/singer for colors ${englishFormatList(unrecognizedColors)}`);
    };
    return true
})();
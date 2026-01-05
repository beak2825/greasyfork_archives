// ==UserScript==
// @name          Image Map Fixer
// @namespace     DoomTay
// @description   Finds image maps where the image fails to load and add colored blocks to make them more visible.
// @include       *
// @version       1.1.1
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/15679/Image%20Map%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/15679/Image%20Map%20Fixer.meta.js
// ==/UserScript==

var pics = document.querySelectorAll("img[usemap]");

for(var i = 0; i < pics.length; i++)
{
	evaluateImage(pics[i]);
}

function evaluateImage(pic)
{
	pic.addEventListener("error", fixMap, true);

	if(pic.complete && pic.naturalWidth == 0) fixMap();

	function fixMap()
	{
		var picOffset = getOffset(pic)
		var map = document.querySelector("map[name = " + pic.useMap.substring(1) + "]");
		if(map)
		{
			var svgNs = "http://www.w3.org/2000/svg";
			var newSVG = document.createElementNS(svgNs, "svg");
			newSVG.setAttribute("class", "patchedMap " + map.name);
			newSVG.setAttributeNS(null, "width", pic.width);
			newSVG.setAttributeNS(null, "height", pic.height);
			newSVG.style.position = "absolute";
			newSVG.style.pointerEvents = "none";
			newSVG.style.left = Math.round(picOffset.left) + "px";
			newSVG.style.top = Math.round(picOffset.top) + "px";
			pic.parentNode.insertBefore(newSVG, pic.nextSibling);
			for(var a = 0; a < map.areas.length; a++)
			{
				if(map.areas[a].getAttribute("shape").toLowerCase() == "default") continue;
				if(map.areas[a].getAttribute("shape"))
				{
					var parsedCoords = map.areas[a].getAttribute("coords").split(",");

					switch(map.areas[a].getAttribute("shape").toLowerCase())
					{
						case "rect":
							var coords = {x: parseInt(parsedCoords[0]), y: parseInt(parsedCoords[1])};
							coords.width = parseInt(parsedCoords[2]) - coords.x;
							coords.height = parseInt(parsedCoords[3]) - coords.y;

							var rect = document.createElementNS(svgNs, "rect");
							rect.setAttributeNS(null, "x", coords.x);
							rect.setAttributeNS(null, "y", coords.y);
							rect.setAttributeNS(null, "width", coords.width);
							rect.setAttributeNS(null, "height", coords.height);
							rect.setAttributeNS(null, "fill", randomColor());

							newSVG.appendChild(rect);
							break;
						case "circle":
							var coords = {x: parseInt(parsedCoords[0]), y: parseInt(parsedCoords[1]), radius: parseInt(parsedCoords[2])};

							var circle = document.createElementNS(svgNs, "circle");
							circle.setAttributeNS(null, "cx", coords.x);
							circle.setAttributeNS(null, "cy", coords.y);
							circle.setAttributeNS(null, "r", coords.radius);
							circle.setAttributeNS(null, "fill", randomColor());

							newSVG.appendChild(circle);
							break;
						case "poly":
							var coords = "";
							for(var c = 0; c < parsedCoords.length; c += 2)
							{
								coords += parsedCoords[c] + "," + parsedCoords[c + 1] + " ";
							}

							var poly = document.createElementNS(svgNs, "polygon");
							poly.setAttributeNS(null, "points", coords);
							poly.setAttributeNS(null, "fill", randomColor());

							newSVG.appendChild(poly);
							break;
						default:
							break;
					}
				}
				else
				{
					var coords = {x: parseInt(parsedCoords[0]), y: parseInt(parsedCoords[1])};
					coords.width = parseInt(parsedCoords[2]) - coords.x;
					coords.height = parseInt(parsedCoords[3]) - coords.y;

					var rect = document.createElementNS(svgNs, "rect");
					rect.setAttributeNS(null, "x", coords.x);
					rect.setAttributeNS(null, "y", coords.y);
					rect.setAttributeNS(null, "width", coords.width);
					rect.setAttributeNS(null, "height", coords.height);
					rect.setAttributeNS(null, "fill", randomColor());

					newSVG.appendChild(rect);
				}
			}
		}
	}

	function randomColor() {
		var color = "rgb(";
		var colorValues = [];
		for(var c = 0; c < 3; c++)
		{
			colorValues.push(Math.floor(Math.random()*256));
		}
		color += colorValues + ")";
		return color;
	}
}

function getOffset(element)
{
	var elementCoords = element.getBoundingClientRect();
	var positioningParent = getPositioningElement(element);
	if(positioningParent != null)
	{
		var parentCoords = positioningParent.getBoundingClientRect();
		var left = elementCoords.left - parentCoords.left;
		var top = elementCoords.top - parentCoords.top;
	}
	else
	{
		var left = elementCoords.left + window.scrollX;
		var top = elementCoords.top + window.scrollY;
	}
	return {left:left, top:top};
}

function getPositioningElement(start)
{
	var startingPoint = start.parentNode;
	while(startingPoint != document.body)
	{
		if(window.getComputedStyle(startingPoint).position == "relative" && window.getComputedStyle(startingPoint).position != "absolute") return startingPoint;
		startingPoint = startingPoint.parentNode;
	}
	return null;
}

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var patchMaps = document.querySelectorAll(".patchedMap");
		observer.disconnect();
		Array.prototype.forEach.call(patchMaps,
			map => {
				var offset = getOffset(map.parentNode.querySelector("img"));
				map.style.left = Math.round(offset.left) + "px";
				map.style.top = Math.round(offset.top) + "px";
			}
		);
		observer.observe(document.body, config);
		if(mutation.target.nodeName == "IMG" && mutation.target.useMap && mutation.target.parentNode.querySelector(".patchedMap"))
		{
			if(mutation.type == "attributes" && mutation.attributeName == "src") mutation.target.parentNode.removeChild(mutation.target.parentNode.querySelector(".patchedMap"));
		}
	});
});

var config = { attributes: true, subtree: true };
observer.observe(document.body, config);
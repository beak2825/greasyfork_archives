// ==UserScript==
// @name          Dead Image Size Revealer
// @namespace     DoomTay
// @description   Shows the size of broken images
// @include       *
// @version       1.0.0
// @exclude       *.svg
// @grant         none


// @downloadURL https://update.greasyfork.org/scripts/37193/Dead%20Image%20Size%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/37193/Dead%20Image%20Size%20Revealer.meta.js
// ==/UserScript==

var pics = document.images;

function relativeToAbsolute(relativeURL)
{
	var testLink = document.createElement("A");
	testLink.href = relativeURL;
	return testLink.href;
}

function addSize(pic) {
	if(pic && pic.src && !getDivSign(pic))
	{
		var offset = getOffset(pic);
		var sizeDiv = document.createElement("div");
		sizeDiv.innerHTML = pic.width + " x " + pic.height;
		sizeDiv.className = "imageSize";
		var bindingClass = randomString();
		sizeDiv.classList.add(bindingClass);
		pic.classList.add(bindingClass);
		pic.parentNode.insertBefore(sizeDiv, pic.nextSibling);
		sizeDiv.style.left = Math.round(offset.left) + "px";
		sizeDiv.style.top = Math.round(offset.top) + "px";
	}
}

var sizeDivStyle = document.createElement("style");
sizeDivStyle.type = "text/css";
sizeDivStyle.innerHTML = ".imageSize { background-color:#333; color: white; position: absolute; font-family: Arial; font-size: 12px; font-weight:normal }";
document.head.appendChild(sizeDivStyle);

for(var i = 0; i < pics.length; i++)
{
	if(window.getComputedStyle(pics[i]) && window.getComputedStyle(pics[i]).width != "auto" && pics[i].width > 40 && pics[i].height > 15)
	{
		if(pics[i].complete && pics[i].naturalWidth == 0) addSize(pics[i]);
		pics[i].addEventListener("load", e => {
			if(getDivSign(e.target))
			{
				var divToRemove = getDivSign(e.target);
				divToRemove.parentNode.removeChild(divToRemove);
				e.target.className = e.target.className.substring(0,e.target.className.length - 6);
			}
		}, true);
		pics[i].addEventListener("error", e => { addSize(e.target); }, true);
	}
}

function randomString()
{
	var string = "";
	for(var i = 0; i < 5; i++)
	{
		string += String.fromCharCode(Math.random() * 26 + 97);
	}
	return string;
}

function getDivSign(image)
{
	for(var c = 0; c < image.classList.length; c++)
	{
		var possibleDiv = image.parentNode.querySelector("div." + image.classList[c]);
		if(possibleDiv) return possibleDiv;
	}
	return null;
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
		//var left = elementCoords.left;
		//var top = elementCoords.top;
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
		var sizeDivs = document.querySelectorAll(".imageSize");
		observer.disconnect();
		Array.prototype.forEach.call(sizeDivs,
			div => {
				var offset = getOffset(document.querySelector("img." + div.classList[1]));
				if(div.style.left != Math.round(offset.left) + "px") div.style.left = Math.round(offset.left) + "px";
				if(div.style.top != Math.round(offset.top) +  "px") div.style.top = Math.round(offset.top) + "px";
			}
		);
		observer.observe(document.body, config);
		if(mutation.target.nodeName == "IMG" && mutation.attributeName == "src" && getDivSign(mutation.target))
		{
			var divToRemove = getDivSign(mutation.target);
			divToRemove.parentNode.removeChild(divToRemove);
			mutation.target.className = mutation.target.className.substring(0,mutation.target.className.length - 6);
		}
	});
});

var config = { attributes: true, subtree: true, childList: true, attributeOldValue: true };
observer.observe(document.body, config);
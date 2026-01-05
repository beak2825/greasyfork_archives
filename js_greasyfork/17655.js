// ==UserScript==
// @name        Fix bad CSS foreground color
// @name:hu     Rossz CSS előtér színek javítása
// @namespace   adventuretc
// @description If you use a dark theme defective CSS styles will give you white on white text color. This is a fix for that.
// @description:hu Ha sötét témát használsz a rossz CSS-ek fehér alapon fehér szöveget eredményezhetnek. Ez egy javítás erre.
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17655/Fix%20bad%20CSS%20foreground%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/17655/Fix%20bad%20CSS%20foreground%20color.meta.js
// ==/UserScript==

main();

setTimeout(function(){ main(); }, 2000);

function main()
{
	var fixedTags = ["textarea", "input", "select"];
	
	for (var i = 0; i<fixedTags.length; ++i)
	{
		var v = fixedTags[i];
		if (!gettag(v)[0])
			continue;

		for (var y = 0; y<gettag(v).length; ++y)
		{
			if (!gettag(v)[y])
				continue;
				
			var observed = gettag(v)[y];
			var changed = gettag(v)[y];
			
			var style = window.getComputedStyle(observed);
			var defaultStyle = window.getDefaultComputedStyle(observed);

			var backgroundColor = style.getPropertyValue("background-color");
			var defaultBackgroundColor = defaultStyle.getPropertyValue("background-color");
			
			if (backgroundColor === "transparent" && !hasStyledBackground(observed))
			{
				var observedMaybe = findUpColoredBackground(observed); //find first parent with color
					
				if (observedMaybe)
				{
					observed = observedMaybe;
				}
				else
				{
					continue;
				}
			}
			
			style = window.getComputedStyle(observed);
			defaultStyle = window.getDefaultComputedStyle(observed);

			backgroundColor = style.getPropertyValue("background-color");
			defaultBackgroundColor = defaultStyle.getPropertyValue("background-color");

			if (hasStyledBackground(observed)) //webpage specified some background
			{
				if (style.color === defaultStyle.color) //but not foreground
				{
					if ( average( rgbArray(backgroundColor) ) > 127  )
					{
						changed.style.color = "#000";
					}
					else
					{
						changed.style.color = "#FFF";
					}
					
					if (backgroundColor === "transparent")
					{
						changed.style.color = "#000";
					}
				}
			}
		}
	}
}

function average(someArr)
{
	var sum = 0;
	
	for (var i=0; i<someArr.length; ++i)
	{
		sum += parseInt(someArr[i]);
	}

	return (sum/someArr.length);
}

function rgbArray(rgb)
{

	rgb = rgb.replace(/[^\d,]/g, '').split(',');
	
	return rgb;
}

function gettag(s)
{
	return document.getElementsByTagName(s);
}

function findUpColoredBackground(el)
{
    while (el.parentNode)
	{
        el = el.parentNode;
		
        if (hasStyledBackground(el)) //webpage specified some background
		{
			if (backgroundColor !== "transparent")
			{
				return el;
			}
		}
    }
    return null;
}

function hasStyledBackground(element)
{
	var style = window.getComputedStyle(element);
	var defaultStyle = window.getDefaultComputedStyle(element);

	var backgroundColor = style.getPropertyValue("background-color");
	var defaultBackgroundColor = defaultStyle.getPropertyValue("background-color");	

	var backgroundImage = style.getPropertyValue("background-image");
	var defaultBackgroundImage = defaultStyle.getPropertyValue("background-image");

	if (backgroundColor !== defaultBackgroundColor)
	{
		return true;
	}
	
	if (backgroundImage !== defaultBackgroundImage)
	{
		return true;
	}
	
	return false;
}
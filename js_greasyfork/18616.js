// ==UserScript==
// @name         SpotTheDifference.com cheat
// @author       Denilson Sá 
// @namespace    http://denilson.sa.nom.br/
// @version      1.0
// @description  Highlights the solution for the games in SpotTheDifference.com
// @grant        none
// @license      Public domain
// @include http://www.spotthedifference.com/*
// @downloadURL https://update.greasyfork.org/scripts/18616/SpotTheDifferencecom%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/18616/SpotTheDifferencecom%20cheat.meta.js
// ==/UserScript==

(function() {
	var head=document.getElementsByTagName('head')[0];
	if( head ) {
		var styletext = '';

		// Photo/Tulip/Buttons/Ladybirds/Books game
		var maps = document.getElementsByTagName('map');
		if( maps.length > 0 )
		{
			for(var mapcounter = 0, map; map = maps[mapcounter]; mapcounter++)
			{
				var framenumber = 0;
				if     ( map.getAttribute('name') == 'map1' ) framenumber = 0;
				else if( map.getAttribute('name') == 'map2' ) framenumber = 1;
				else continue;

				var frame = document.getElementById('frame'+framenumber);
				for(var i = 0, area; area = map.childNodes[i]; i++)
				{
					if( area.nodeType == 1 && area.nodeName.toLowerCase() == 'area' )
					{
						var coords = area.getAttribute('coords');
						if( coords != '0,0,280,360' )
						{
							coords = coords.split(','); // left-x, top-y, right-x, bottom-y
							coords[2] -= coords[0];
							coords[3] -= coords[1];
							var elem = document.createElement('div');

							// Commented out because in Firefox the click does not pass
							// through this element.
							/*
							elem.setAttribute('style',
								'position: absolute; '+
								'left: '  +coords[0]+'px; '+
								'top: '   +coords[1]+'px; '+
								'width: ' +coords[2]+'px; '+
								'height: '+coords[3]+'px; '+
								'outline: 2px red dotted;'
							);
							*/

							elem.setAttribute('style',
								'position: absolute; '+
								'left: '+coords[0]+'px; '+
								'top: ' +coords[1]+'px; '+
								'overflow: visible;'
							);

							// Top border
							var border = document.createElement('div');
							border.setAttribute('style',
								'position: absolute; '+
								'left: 0px; '+
								'top: 0px; '+
								'width: '+coords[2]+'px; '+
								'border-top: red 2px dotted;'
							);
							elem.appendChild(border);

							// Left border
							var border = document.createElement('div');
							border.setAttribute('style',
								'position: absolute; '+
								'left: 0px; '+
								'top: 0px; '+
								'height: '+coords[3]+'px; '+
								'border-left: red 2px dotted;'
							);
							elem.appendChild(border);

							// Right border
							var border = document.createElement('div');
							border.setAttribute('style',
								'position: absolute; '+
								'left: '+coords[2]+'px; '+
								'top: 0px; '+
								'height: '+coords[3]+'px; '+
								'border-right: red 2px dotted;'
							);
							elem.appendChild(border);

							// Bottom border
							var border = document.createElement('div');
							border.setAttribute('style',
								'position: absolute; '+
								'left: 0px; '+
								'top: '+coords[3]+'px; '+
								'width: '+coords[2]+'px; '+
								'border-bottom: red 2px dotted;'
							);
							elem.appendChild(border);

							frame.appendChild(elem);
						}
					}
				}
			}
		}

		// GreaseMonkey compatibility (not needed inside Opera)
		if( typeof unsafeWindow != 'undefined' )
		{
			xy = unsafeWindow.xy;
			dw = unsafeWindow.dw;
			ndiff = unsafeWindow.ndiff;
		}

		// Photo game (but breaks the tulip game)
		/*
		var icache = document.getElementById('icache2');
		if( icache )
		{
			for(var i = 0; i < ndiff+2; i++)
				styletext += '#icache'+i+' { outline: 2px red dotted; }\n';
		}
		*/

		// Domino/Numbers game
		if( typeof xy != 'undefined' )
		{
			for(var i = 0; i < ndiff; i++)
			{
				// Domino
				styletext += 'img[onmousedown="javascript:return diff('+i+');"] { outline: 2px red dotted; }\n';
				// Numbers
				styletext += 'div[onmousedown="diff('+i+');"] { outline: 2px red dotted; }\n';
			}
		}

		// Text game
		if( typeof dw != 'undefined' )
		{
			for(var i = 0; i < dw.length; i++)
				styletext += 'span[onmousedown="javascript:return diff('+dw[i]+');"] { text-decoration: underline; }\n';
		}

		// Adding the style sheet
		var style = document.createElement('style');
		style.setAttribute('type','text/css');
		style.appendChild(document.createTextNode(styletext));
		head.appendChild(style);
	}
})();

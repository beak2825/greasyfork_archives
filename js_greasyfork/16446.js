// ==UserScript==
// @name        	Scene 7 Illegal Image Size
// @namespace   	mh23
// @description 	Takes Scene 7 illegal image size and creates a full size image for saving.  You will need an addon to save a screenshoot of the full window.  I use Pearl Crescent Page Saver for firefox.
// @icon           	http://www.ipxg.net/images/adobe_scene7.png
// @include        	*
// @grant 			GM_xmlhttpRequest
// @run-at 			document-idle
// @version		   	1.0
// @downloadURL https://update.greasyfork.org/scripts/16446/Scene%207%20Illegal%20Image%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/16446/Scene%207%20Illegal%20Image%20Size.meta.js
// ==/UserScript==

//////////creates image on canvas if illegal image size is detected//////////
if (/illegal image size/.test(document.body.innerHTML)) {
	//////////loads xml page to get the images dimensions////////// 
	//creates link to xml
	var xmlUrl = window.location.href.replace(/(\S+)\?\S+/,'$1?req=ctx,xml'); //removes everything after the ? and adds xml code
	//loads xml page
	GM_xmlhttpRequest({
		method: "GET",
		url: xmlUrl,
		onload:function(details) {
			var parser = new DOMParser ();
			var xmlInfo = parser.parseFromString (details.responseText, "text/xml");
			//gets image width
			var xmlWidth = xmlInfo.getElementsByTagName('ctx')[0].getAttribute('dx');
			//gets image height
			var xmlHeight = xmlInfo.getElementsByTagName('ctx')[0].getAttribute('dy');
			//calls function to pull variables out of request
			imgDimensions (xmlWidth, xmlHeight);
		}
	});
	//////////the function that allows us to pull out image dimesions from xml to create full size image////////// 
	function imgDimensions (imgWidth, imgHeight) {
		//replaces title with image name for saving
		var imgName = window.location.href.replace(/\S+\/image\/\w+\/(\S+)\?\S+/,'$1');
		document.title = imgName;
		//adds console log if you want to make sure image is correct size
		var imgDim = 'The image dimensions are: ' + imgWidth + 'px x ' + imgHeight + 'px';
		console.log(imgDim);
		//clears body html, adds style and creates a holding div
		var getBody = document.body;
		getBody.setAttribute('style','padding: 0; margin: 0;');
		getBody.innerHTML = '<div id="holdingDiv" style="width: '+imgWidth+'px; height: '+imgHeight+'px;"></div>';
		
		//////////creates all the variables i will need to construct the image////////// 
		//sets the size of the image tile, all websites i've tested allow at least 1000px image. if you get a blank page you can try lowering this number
		var tileSize = 1000;
		//sets the base url (the part that won't change)
		var baseUrl = window.location.href.replace(/(\S+)\?\S+/,'$1?rgn=');
		//gets us the exact number of rows (horizontal or x) needed (down to the decimal)
		var rows = imgWidth/tileSize;
		//gets us the exact number of columns (vertical or y) needed (down to the decimal)
		var columns = imgHeight/tileSize;
		//gets decimal of rows to help create remainder
		var decRows = '.'+(rows+'').split('.')[1];
		//gets decimal of columns to help create remainder
		var decCol = '.'+(columns+'').split('.')[1];
		//gets remainder of rows
		var remRows = decRows*tileSize;
		//gets remainder of columns
		var remCol = decCol*tileSize;
		//rounds rosw up to give us total amount of rows needed
		var roundUpRows = Math.ceil(rows);
		//rounds columns up to give us the total amount of columns needed
		var roundUpCol = Math.ceil(columns);
		//rounds rows down to check if tile width is a remainder
		var roundDownRows = Math.floor(rows);
		//rounds columns down to check if tile height is a remainder
		var roundDownCol = Math.floor(columns);
		
		//////////this is where we create the image on the canvas//////////
		//loop to create first column (left to right) images
		for(var y=0; y<roundUpCol; y++) {
			var getDiv = document.getElementById('holdingDiv');
			var divId = 'columns'+(y+1);
			var imgClass = 'images';
			var topPadding = y*tileSize;
			var imgPosTop = y*tileSize;
			var imgPosLeft = 0;
			//creates tiles if height is not a remainder
			if(y<roundDownCol) {
				var imgSrc = baseUrl+imgPosLeft+','+imgPosTop+','+tileSize+','+tileSize;
				var imgDiv = document.createElement('div');
				imgDiv.setAttribute('style','float: left; top:'+topPadding+'px;');
				imgDiv.id = divId;
				imgDiv.innerHTML = '<img class="'+imgClass+'" src="'+imgSrc+'">';
				getDiv.appendChild(imgDiv);
			}
			//creates the last tile for the first column if height has a remainder
			else {
				var remImgSrc = baseUrl+imgPosLeft+','+imgPosTop+','+tileSize+','+remCol;
				var imgDiv = document.createElement('div');
				imgDiv.setAttribute('style','float: left; top:'+topPadding+'px;');
				imgDiv.id = divId;
				imgDiv.innerHTML = '<img class="'+imgClass+'" src="'+remImgSrc+'">';
				getDiv.appendChild(imgDiv);
			}
			//loop to create the ramainding columns images
			for(var x=1; x<roundUpRows; x++) {
				imgPosLeft = x*tileSize;
				//creates tile if width is not a remainder & height is not a remainder
				if(x<roundDownRows&&y<roundDownCol) {
					var getDiv = document.getElementById(divId).lastElementChild;
					var imgElement = document.createElement('img');
					var imgSrc = baseUrl+imgPosLeft+','+imgPosTop+','+tileSize+','+tileSize;
					imgElement.src = imgSrc;
					imgElement.setAttribute('class', imgClass);
					getDiv.parentNode.insertBefore(imgElement,getDiv.nextSibling);
				}
				//creates tile if width is a remainder & height is not a remainder
				else if(x==roundDownRows&&y<roundDownCol) {
					var getDiv = document.getElementById(divId).lastElementChild;
					var imgSrcRem = baseUrl+imgPosLeft+','+imgPosTop+','+remRows+','+tileSize;
					var imgElement = document.createElement('img');
					imgElement.src = imgSrcRem;
					imgElement.setAttribute('class', imgClass);
					getDiv.parentNode.insertBefore(imgElement,getDiv.nextSilbing);
				}
				//creates tile if height is a remainder & width is not a remainder
				else if(y==roundDownCol&&x<roundDownRows) {
					var getDiv = document.getElementById(divId).lastElementChild;
					var imgSrcRem = baseUrl+imgPosLeft+','+imgPosTop+','+tileSize+','+remCol;
					var imgElement = document.createElement('img');
					imgElement.src = imgSrcRem;
					imgElement.setAttribute('class', imgClass);
					getDiv.parentNode.insertBefore(imgElement,getDiv.nextSilbing);
				}
				//creates rest of tile
				else {
					var getDiv = document.getElementById(divId).lastElementChild;
					var imgSrcRem = baseUrl+imgPosLeft+','+imgPosTop+','+remRows+','+remCol;
					var imgElement = document.createElement('img');
					imgElement.src = imgSrcRem;
					imgElement.setAttribute('class', imgClass);
					getDiv.parentNode.insertBefore(imgElement,getDiv.nextSilbing);
				}
			}
		}
	}
}
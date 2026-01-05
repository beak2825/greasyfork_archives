// ==UserScript==
// @name         TIMS Dual Weight Modifier
// @namespace    https://greasyfork.org/en/users/14879/
// @version      0.15
// @description  Modifies the Roadway Information overlay layer when both FC and RI are enbled such that both display with
//               differing line weights to see both at the same time
// @include      http://gis.dot.state.oh.us/tims/map*
// @author       Chris Cook
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12163/TIMS%20Dual%20Weight%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/12163/TIMS%20Dual%20Weight%20Modifier.meta.js
// ==/UserScript==

//---------------------------------------------------------------------------------------

// Globals

var roadwayDIVId = 'map-container_Roadway Information'; 
var originalRoadwayDIVElement = document.createElement('div');
var originalImgElementSrc = '';



function bootstrapTIMS()
{
    //console.log(roadwayDIVId);
    //originalRoadwayDIVElement = document.getElementById(roadwayDIVId);
    //console.log(originalRoadwayDIVElement.id);


    // Make the button
    addButton();
}

function addButton()
{
    var buttonDIV = document.createElement('div');
    buttonDIV.id = 'newButtonDiv';

    var buttonSpan = document.createElement('span');

    var input = document.createElement('input');
    input.type = 'button';
    input.value = 'Split Roadway Layers';
    input.onclick = modifyRoadwayLayer;
    buttonSpan.appendChild(input);

    var functionSpan = document.createElement('span');

    var descriptionFC = document.createElement('label');
    descriptionFC.htmlFor = 'dpiFC';
    descriptionFC.appendChild(document.createTextNode('Function Class DPI'));
    functionSpan.appendChild(descriptionFC);

    var weightFC = document.createElement('input');
    weightFC.id = 'dpiFC';
    weightFC.name = 'dpiFC';    
    weightFC.type = 'number';
    weightFC.style.width = '3em';
    weightFC.value = 168;
    functionSpan.appendChild(weightFC);

    var roadwaySpan = document.createElement('span');  

    var descriptionRI = document.createElement('label');
    descriptionRI.htmlFor = 'dpiRI';
    descriptionRI.appendChild(document.createTextNode('Road Inventory DPI'));
    roadwaySpan.appendChild(descriptionRI);

    var weightRI = document.createElement('input');
    weightRI.id = 'dpiRI';
    weightRI.name = 'dpiRI';
    weightRI.type = 'number';
    weightRI.style.width = '3em';
    weightRI.value = 36;
    roadwaySpan.appendChild(weightRI);

    buttonDIV.appendChild(buttonSpan);
    buttonDIV.appendChild(document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0'));
    buttonDIV.appendChild(functionSpan);
    buttonDIV.appendChild(document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0'));
    buttonDIV.appendChild(roadwaySpan);
    buttonDIV.appendChild(document.createElement('br'));
    buttonDIV.appendChild(document.createElement('br'));

    var mapElement = document.getElementById('map-viewer-region');
    mapElement.parentNode.insertBefore(buttonDIV,mapElement.nextSibling);

}


function modifyRoadwayLayer()
{
    var bothLayersPresent = false;
    var alreadySplit = false;
    if (document.getElementById('split layer') !== null){
        alreadySplit = true;
    }
    else{
        originalImgElementSrc = document.getElementById(roadwayDIVId).firstChild.src;
    }

    var roadwayDIVElement = document.getElementById(roadwayDIVId);    
    var imageElementCopy = roadwayDIVElement.firstElementChild.cloneNode(true);
    var imageURL = roadwayDIVElement.firstElementChild.src;
    var imageURL1 = '';
    var imageURL2 = '';
    var weight1 = document.getElementById('dpiFC').value;
    var weight2 = document.getElementById('dpiRI').value;

    var dpiSyntax = 'dpi=';
    var dpiStart = imageURL.search(dpiSyntax);
    var dpiStartOffset = dpiSyntax.length;

    var layerSyntax = 'layers=show';
    var layerStart = imageURL.search(layerSyntax);
    var layerStartOffset = layerSyntax.length;
    var layerEnd = imageURL.search('bbox=');
    var layerPortion = imageURL.substr(layerStart+layerStartOffset,layerEnd-layerStart-layerStartOffset-1);
    //console.log(roadwayDIVElement.firstElementChild.src);
    //console.log(layerPortion);

    var layerDecoded = decodeURIComponent(layerPortion);
    //console.log(layerDecoded);
    if (layerDecoded.search('8') !== -1){
        if (layerDecoded.search('9') !== -1){
            //alert('both layers present');
            bothLayersPresent = true;
        }
    }
    else{
        bothLayersPresent = false;
    }

    if (alreadySplit === false){
        if(bothLayersPresent === true){
            imageURL1 = imageURL.substr(0,layerStart+layerStartOffset);
            imageURL1 += '%3A8';
            imageURL1 += imageURL.substr(layerEnd-1,imageURL.length-(layerEnd-2));
            imageURL1 = imageURL1.replace('dpi=96',dpiSyntax.concat(weight1));
            //console.log(imageURL1);

            imageURL2 = imageURL.substr(0,layerStart+layerStartOffset);
            imageURL2 += '%3A9';
            imageURL2 += imageURL.substr(layerEnd-1,imageURL.length-(layerEnd-2));
            imageURL2 = imageURL2.replace('dpi=96','dpi=48');
            //console.log(imageURL2);

            roadwayDIVElement.firstElementChild.src = imageURL1;

            imageElementCopy.id = 'split layer';
            imageElementCopy.src = imageURL2;
            roadwayDIVElement.appendChild(imageElementCopy);
            //alert('layers split');

        }
        else{ //bothLaysersPresent === false
            alert('missing layers');
        }
    }
    else{ //alreadySplit === true
        if (bothLayersPresent === true){
            //not sure how this could happen since the auto refresh of the map kills the split layer image
            alert('how did we get here?');
        }
        else{ //bothLayersPresnet === false
            roadwayDIVElement.removeChild(roadwayDIVElement.lastElementChild);
            roadwayDIVElement.firstElementChild.src = originalImgElementSrc;
            //alert('original view restored');
        }
    }
}


setTimeout(bootstrapTIMS,2000);
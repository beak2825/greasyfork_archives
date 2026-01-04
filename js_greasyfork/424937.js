// ==UserScript==
// @name         Notion Extension
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Prototype notion extension - No longer in Production
// @author       You
// @match        https://www.notion.so/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/424937/Notion%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/424937/Notion%20Extension.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //notion-green-light
    var lightcolor1 = "rgba(0, 135, 107, 0.2)";
    //Colonial White
    var lightcolor2 = "#fff1ba";
    //notion-green-dark
    var darkcolor1 = "rgba(77,171, 154, 0.5)";
    //Pesto
    var darkcolor2 = "#70632a";

    var color1 = lightcolor1;
    var color2 = lightcolor2;

    var element = {}; // Empty Object
    var removePosition;
                        var accordionMarkerArrray = [];
                        var scrollerChildren;
                        var arrayUsedCheck = [];
var positionsArray = [];
    if (document.body.classList == "notion-body dark") {
        color1 = darkcolor1;
        color2 = darkcolor2;
    }

var notionPageContent = document.getElementsByClassName("notion-page-content");
var notionScrollerVertical = document.getElementsByClassName("notion-scroller");
console.log("notionScrollerVertical" + notionScrollerVertical);


//Function to execute my functions
    const send = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            //FindAndLoopDivs();
            setTimeout(FindAndLoopDivs, 1500);
        })
        return send.apply(this, arguments);
    }

    function FindAndLoopDivs() {
        //notionScrollerVertical for accoirdion
        var accordionOpen;
        var accordionClosed;
        try {
            //overwrite the default accordion setting with the title implement later
            getAccordionTitle();
            //var divs = notionScrollerVertical[1].getElementsByTagName('div');
            function getAccordionTitle(){
            var scrollerChildren = notionScrollerVertical[1].children[0].children[1].children[1].children[0].innerHTML;

            var accordionOpen = scrollerChildren.match(/\(\^[0-9]*\+\)/g);
            accordionOpen = parseInt(String(accordionOpen).replace(/\D/g, ''));
            var arrOpen = accordionOpen.toString(10).replace(/\D/g, '0').split('').map(Number);

            var accordionClosed = scrollerChildren.match(/\(\^[0-9]*\-\)/g);
            accordionClosed = parseInt(String(accordionClosed).replace(/\D/g, ''));
            var arrClosed = accordionClosed.toString(10).replace(/\D/g, '0').split('').map(Number);

            //console.log(scrollerChildren);
            //console.log(arrOpen);
            //console.log(arrClosed);
            }

            getAccordionMarkers();


            function getAccordionMarkers(){
                scrollerChildren = notionScrollerVertical[1].children[1].children[0].children[0].children;
                //console.log(scrollerChildren);

                for (var i = 0; i < scrollerChildren.length; i++) {
                  var tableChild = scrollerChildren[i].children[0].children[1].children[0].children[1];
                  var tableChild2 = scrollerChildren[i];

                  if(tableChild.innerHTML.match(/\(\^[0-9]*\-\)/g)){
                      //accordionId= parseInt(String(accordionClosed).replace(/\D/g, ''));
                      accordionId= String(tableChild.innerHTML).replace(/[^0-9.]/g, "");
                      console.log(tableChild.innerHTML+ "id: "+ accordionId+ " position: "+ i +" boolean: false");
                    tableChild.innerHTML = "Accordion" + accordionId;
                    var pushObject = {id : accordionId, position : i, boolean : "false"};

                    console.log(pushObject);
                    //generateAccordion(pushObject, tableChild2)
                accordionMarkerArrray.push(pushObject);

                }
            }


for (var i = 0; i < accordionMarkerArrray.length; i++) {
var value = accordionMarkerArrray[i].position;
    if (positionsArray.indexOf(value) === -1) positionsArray.push(value);
    //console.log(positionsArray);
    genereateAccordionPanels(positionsArray)
}

function genereateAccordionPanels(positionsArray){
    if (arrayUsedCheck.indexOf(positionsArray) === -1){
        arrayUsedCheck.push(positionsArray);

        //insert panel before the first used check, before and after every subsequent one and at the very end of the list

console.log(arrayUsedCheck);

 for (var i = 0; i < arrayUsedCheck.length; i++) {
     arrayUsedCheck[i]
 }
//scrollerChildren.length
    }
}

function generateAccordion(pushObject, tableChild2){

generateButton()
function generateButton(){
    let newNode = document.createElement("button")
        newNode.classList.add("accordionzz");

    console.log(newNode);

        tableChild2.insertAdjacentElement('afterend', newNode);


    console.log(scrollerChildren[pushObject.position]);
}

}

                for(y=0; y< scrollerChildren.length; y++ ){
                    //console.log(y+": " + scrollerChildren[y]);
                 //var childDiv = scrollerChildren[y].children[0].children[1].children[0];
                 console.log("test")
                 var childDiv = scrollerChildren.children[y];
                 console.log(childDiv);
                 //if a child in this loop matches the regex, add an object to the array specifying the position; the id(specified via text) ; and if + or -
                if (childDiv.match(/\(\^[0-9]*\-\)/g).length > 0) {

                    console.log("----")
                    console.log(childDiv.match(/\(\^[0-9]*\-\)/g));
                    var accordionId = parseInt(String(childDiv).replace(/\D/g, ''));
                    scrollerChildren[y].children[0].children[1].children[0].children[1].innerHTML = "Accordion Button "+ y;
                    console.log(childDiv+ "id: "+ accordionId+ " position: "+ y +" boolean: false");
                    console.log("closed: "+accordionClosed);
                }



                    //var marker = {position: i, id:, boolean:};

                 //console.log(i+  " : " +childDiv);
                }
            }

            for (var i = 0; divs[i]; i++) {

                /*
                if(divs[i].classList == "notion-scroller vertical") {
                    console.log("superindex1");
                    //accordions(divs[i]);
                }
                */
            }
        }
        catch(err) {}


        try {
            //notionPageContent
            var divs = notionPageContent[0].getElementsByTagName('div');
            for (var i = 0; divs[i]; i++) {
                //console.log("getelementsbytagname")
                rowColor(divs[i]);
                //colWidth(divs[i]);

                if(divs[i].classList == "notion-selectable notion-collection_view-block") {
                    console.log("superindex2 ");
                    colorTag(divs[i]);
                    limitEntries(divs[i]);
                    if (!document.hidden) {


                    colorImg(divs[i]);
                        }
                    shuffleEntries(divs[i]);
                    hideNew(divs[i]);

                }

            }
        }
        catch(err) {}
    }

/*
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
*/
        function modifyDisplay(element, setting,){
            element.style.display = setting;
        }

            function getSpecifiedLimit(divs) {
            var divString = divs.innerHTML;
            var result = divString.match(/\(limit:[0-9]\)/g);
            result = parseInt(String(result).replace(/\D/g, ''));
            //document.write("Output : " + result + typeof result);
            return result;
        }

        function classListMatch(classList, string){
            classList == string
            return true;
        }
        function checkIndexOf(indexOf){
            indexOf !== -1;
            return true;
        }
    function limitEntries(divs) {
        //if(classListMatch(divs.classList, "notion-selectable notion-collection_view-block")){
            if (divs.innerHTML.indexOf("(limit:") !== -1) {
                try {//try catch to resolve error messages for children on undefined
                    var childs = divs.children[1].children[0].children[0];
                    var children = childs.children;
                    var limit = getSpecifiedLimit(divs);
                    for (var a = 1; a < children.length-1; a++) {

                        if (a <= limit) {
                            modifyDisplay(children[a], 'block')
                        } else {
                            modifyDisplay(children[a], 'none')
                        }

                    }
                }
                catch(err) {}
            }
        //}
    }


    function colorTag(divs) {
        //!Gallery view only
        if(divs.classList == "notion-selectable notion-collection_view-block") {
            if (divs.innerHTML.indexOf("color:tag") !== -1) {
                console.log("color:tag");
                var childs = divs.children[1].children[0].children[0];
                var children = childs.children;
                for (var a = 0; a < children.length; a++) {
                    //console.log(children[a]);
                    if(children[a].innerHTML.indexOf("display: flex; align-items: center; flex-shrink: 0; min-width: 0px; height: 14px; border-radius: 3px;") !== -1) {
                        var divString = children[a].children[0].innerHTML;
                        var result = divString.match(/display: flex; align-items: center; flex-shrink: 0; min-width: 0px; height: 14px; border-radius: 3px; padding-left: 6px; padding-right: 6px; font-size: 12px; line-height: 120%; color: rgb[a]?\(.*?\); background: rgb[a]?\(.*?\); margin: 0px 6px 0px 0px;/g);
                        result = String(String(result).match(/background: rgb[a]?\(.*?\);/g)).split('(')[1].split(')')[0];
                        children[a].children[0].style["background"] = 'rgba('+result+')';


                    }
                }
            }
        }
    }

    function hideNew(divs){

                //!Gallery view only
        //if(classListMatch(divs.classList, "notion-selectable notion-collection_view-block")){
            if (divs.innerHTML.indexOf("(hide:new") !== -1) {
                try {//try catch to resolve error messages for children on undefined
                    var childs = divs.children[1].children[0].children[0];
                    var children = childs.children;
                    //var limit = getSpecifiedLimit(divs);

                    var limit = children.length - 1;
                    for (var a = 1; a < children.length; a++) {
                        console.log("a: " + a);
                        console.log(limit);
                        if (a < limit) {
                            modifyDisplay(children[a], 'block')
                        } else {
                            modifyDisplay(children[a], 'none')
                        }
                    }
                }
                catch(err) {}
            }
        //}


    }


    function accordions(divs){

                //!Gallery view only
        //if(classListMatch(divs.classList, "notion-selectable notion-collection_view-block")){
        consol.log("indexer");
            if (divs.innerHTML.indexOf("(^") !== -1) {
                console.log("indexed");
                /*
                try {//try catch to resolve error messages for children on undefined
                    var childs = divs.children[1].children[0].children[0];
                    var children = childs.children;
                    //var limit = getSpecifiedLimit(divs);

                    var limit = children.length - 1;
                    for (var a = 1; a < children.length; a++) {
                        console.log("a: " + a);
                        console.log(limit);
                        if (a < limit) {
                            modifyDisplay(children[a], 'block')
                        } else {
                            modifyDisplay(children[a], 'none')
                        }
                    }
                }
                catch(err) {}
                */
            }
        //}
    }

    function getAverageRGB(imgEl) {
        console.log('getavg: ' + imgEl);
        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r:0,g:0,b:0},
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch(e) {
            /* security error, img on diff domain */
            return defaultRGB;
        }

        length = data.data.length;

        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);

        console.log("rgb: " + rgb);
        return rgb;

    }
    function getBase64Image(img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");

        //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        return dataURL;
    }


function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
console.log("rgb: "+r +"  "+ g +" "+ b);
        var colors = r + g + b
        colors = colors/3;
        colors= colors.toString(16);
        colors = "#"+ colors+colors+colors;
        //return colors;

        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';


    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    //return "#" + padZero(r) + padZero(g) + padZero(b);
            var bwHelper = r+g+b/3;
        return('#'+bwHelper+bwHelper+bwHelper);
    console.log();
    //return "#" + r + g + b;
}
var rgbToHex = function (rgb) {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};
var fullColorHex = function(r,g,b) {
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return red+green+blue;
};


    function colorImg(divs) {
        //!Gallery view only
        if(divs.classList == "notion-selectable notion-collection_view-block") {
            if (divs.innerHTML.indexOf("color:img") !== -1) {
                //console.log("color:img");
                var childs = divs.children[1].children[0].children[0];
                var children = childs.children;
                //console.log(children);
                for (var a = 0; a < children.length; a++) {
                    //console.log(children[a]);

                    var img = children[a].getElementsByTagName("img")[0];
                    // img = img.src;
                    console.log(typeof(img));
                    if(typeof(img) == "object"){

                        console.log(img.src);
                        var cln = img.cloneNode(true);
                        cln.src = getBase64Image(img);
                        console.log("cln.src");
                        console.log(cln.src);
                        //console.log("getbase: "+ getBase64Image(img));
                        var rgb = getAverageRGB(cln);

                        console.log('rgb('+rgb.r+','+rgb.g+','+rgb.b+')');
                        console.log("getAvgRgb: "+ getAverageRGB(img));
                        //console.log(getAverageRGB(getBase64Image(img.src)));
                        children[a].children[0].style.background = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';

                        var hex = fullColorHex(rgb.r,rgb.g,rgb.b);
                        console.log("hex: "+hex);
                        var textcolor = invertColor(hex, true);
                        //console.log("hexinvertedbw: "+textcolor);

                        var nodes = children[a].children[0].childNodes;
                        for(var i=0; i<nodes.length; i++) {
                            //if (nodes[i].nodeName.toLowerCase() == 'div') {
                                nodes[i].style.color = textcolor;
                            //}
                        }


                    }
                    //console.log(typeof(img));

                }
            }
        }
    }

    $.fn.shuffleChildren = function() {
    $.each(this.get(), function(index, el) {
        var $el = $(el);
        var $find = $el.children();

        $find.sort(function() {
            return 0.5 - Math.random();
        });

        $el.empty();
        $find.appendTo($el);
    });
};



    function shuffleEntries(divs) {
        //!Gallery view only?
        if (divs.classList == "notion-selectable notion-collection_view-block") {
            if (divs.innerHTML.indexOf("(sort:rand") !== -1) {
                var container = divs.children[1].children[0].children[0];


                for (var i = container.children.length-1; i >= 0; i--) {
                    container.appendChild(container.children[Math.random() * i | 0]);
                }


                //$(childs).shuffleChildren();
                //var children = childs.children;
                //console.log(children);


            }
        }
    }
    //add the number of children as a id so if the number of children increases (durring load) ((maybe decreases in case you delete stuff?)) the function runs again.
    function shuffleEntries2(divs) {
        //!Gallery view only?

        if (divs.classList == "notion-selectable notion-collection_view-block") {

            var container = divs.children[1].children[0].children[0];
            console.log("id: "+ divs.id);
            if (parseInt(divs.id) > container.children.length) {
                if (divs.innerHTML.indexOf("(sort:rand") !== -1) {


                    //id to shuffle just once
                    divs.setAttribute("id", container.children.length);

                    for (var i = container.children.length; i >= 0; i--) {
                        container.appendChild(container.children[Math.random() * i | 0]);
                    }


                    //$(childs).shuffleChildren();
                    //var children = childs.children;
                    //console.log(children);


                }
            }
        }
    }





    //-- Add color if emoji is in row
    function rowColor(divs) {
        //  var divs = document.getElementsByTagName('div');

        if (divs.classList == "notion-selectable notion-page-block notion-collection-item") {
            if (divs.innerHTML.includes("🟩")) {

                console.log("🟩");
                //console.log(divs.classList);
                divs.style["background-color"] = color1;

                //find which child has the emoji

                /*
                var children = divs.children;
                for (var a = 0; a < children.length; a++) {
                    var tableChild = children[a];
                    if (tableChild.innerHTML.includes("🟩") && divs.classList == "notion-selectable notion-page-block notion-collection-item") {
                        //console.log("a"+a);
                        removePosition = a;

                    }
                }
*/
            }
        }
    }



    //---     make small rows half as wide

    function colWidth(divs) {
        // var divs = document.getElementsByTagName('div');
        if (divs.style.width == "100px") {
            //if(divs.innerHTML.includes("typesCheckbox") || divs.innerHTML.includes('role="button"') && divs.innerHTML.indexOf("notion-table-view-header-cell") == -1 ){divs.style.width = "10px";}else{divs.style.width = "50px";}

            //coll with 50px or 30px
            if(divs.innerHTML.includes("typesCheckbox") || divs.innerHTML.includes('M1.5,1.5 L1.5,14.5 L14.5,14.5 L14.5,1.5 L1.5,1.5 Z M0,0 L16,0 L16,16 L0,16 L0,0 Z') || divs.innerHTML.includes('5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039')){
                divs.style.width = "30px";
                divs.style["justify-content"] = "center";
            }
            else{
                divs.style.width = "50px";
            }


            if (divs.classList == "notion-table-view-header-cell") {

                divs.style["border-bottom-width"] = "1px";
                divs.style["border-bottom-style"] = "solid";
                divs.style["border-bottom-color"] = color2;

                divs.children[0].style["padding-left"] = 0;
                divs.children[0].style["padding-right"] = 0;

                //rearange flex
                divs.children[0].children[0].style["flex-direction"] = "column";
                divs.children[0].children[0].style["justify-content"] = "column";
                divs.children[0].children[0].style["width"] = "100%";
                divs.children[0].children[0].style["font-size"] = "12px";

                //----Child containing SVG----
                //console.log(divs.children[0].children[0].children[0]);
                divs.children[0].children[0].children[0].style["margin-right"] = "0";
                //divs.children[0].children[0].children[0].remove();


                //divs.children[0].children[0].children[0].removeChild(child);

                //----Child SVG----
                //console.log(divs.children[0].children[0].children[0]);
                divs.children[0].children[0].children[0].children[0].style["margin-right"] = "0";

                //----Child Containing Text----
                //console.log(divs.children[0].children[0].children[1]);
                divs.children[0].children[0].children[1].style["text-overflow"] = "";
                divs.children[0].children[0].children[1].style['word-wrap'] = 'break-word';
                divs.children[0].children[0].children[1].style["width"] = "50px";
                divs.children[0].children[0].children[1].style["white-space"] = "";
                divs.children[0].children[0].children[1].style["overflow"] = "";
                //  test        divs.children[0].children[0].children[1].style["background-color"] = "red";

            }
        }

    }
    $.noConflict()
})();

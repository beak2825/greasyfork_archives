// ==UserScript==
// @name         		Tukang Download Google Books Preview
// @namespace    		https://github.com/beritaprofit/tukang-e-book/edit/master/tukang-e-book.user.js
// @version      		0.3.0.3
// @description  		Save books to jpg by direct download or by copying to canvas!
// @author       		beritaprofit
// @license     		https://creativecommons.org/licenses/by-sa/4.0/
// @homepage    		https://github.com/beritaprofit/tukang-e-book
// @supportURL  		https://github.com/beritaprofit/tukang-e-book/issues
// @contributionURL             https://github.com/beritaprofit/tukang-e-book#donate
// @include		 			https://books.google.*
// @include		 			https://www.google.com/books/*
// @include     		https://books.google.*/books
// @require      		https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @require      		http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require      		https://greasyfork.org/scripts/381230-filesaver-min-js/code/FileSaverminjs.js?version=685345
// @grant 		 			GM_xmlhttpRequest
// @grant 		 			GM_log


// @downloadURL https://update.greasyfork.org/scripts/381228/Tukang%20Download%20Google%20Books%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/381228/Tukang%20Download%20Google%20Books%20Preview.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);


//from google Book downloader foxyspeed
Array.prototype.inArray = function (value,begin) {
    begin = (begin)?begin:0;
    for (var i=begin; i < this.length; i++) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
};

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode);
  elementStyle.innerHTML = style;
  return elementStyle;
}

addStyleSheet('@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";');




var items = [];
var dllinks;

var i =0;
var percentage
var number;

var num;


var imgBlob;
var srclinks = new Map();
function generateDownloadButton (jNode) {
    //jNode.attr ("src").match (/\d+/g);
    console.log(jNode.attr ("src"));
    //image = document.getElementById('foo')



    var pids= new URL(jNode.attr ("src")).searchParams.get("pg");
    console.log(pids);
    if  (pids!=null) {
        var pidsnum= pids;
        pidsnum.replace( /\D+/g, '');

        //var string_a = "jkjkhj89898";
        var numstring = pidsnum.match(/[^\d]+|\d+/g);

        var name = "Canvas " +numstring[0]+ pad(numstring[1], 4);


        var button2 = document.createElement("Button");
        button2.innerHTML = '<i class="fa fa-file-image-o"></i>';
        button2.setAttribute ('id', name);
        button2.value = jNode.attr ("src");
        //+ "background-color: DodgerBlue; border: none; color: white; padding: 12px 16px; font-size: 16px; cursor: pointer; "
        //button2.style = "position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);background-color: #555;color: white;font-size: 16px;padding: 12px 24px;border: none;cursor: pointer;border-radius: 5px;z-index: 9999"
        button2.style = "position: absolute;top: 0%;left: 2px;transform: translate(2%, 2%);-ms-transform: translate(2%, 2%);z-index: 9999;"
            + "background-color: RoyalBlue; border: none; color: white; padding: 16px 16px; font-size: 16px; cursor: pointer";
        jNode.after(button2);

        button2.addEventListener( 'click', function () {
            //alert("Hi"+name+this.value );
            var imgs = document.getElementsByTagName('img');
            for (var i = imgs.length - 1; i >= 0; i--) {
                if (imgs[i].src == this.value) {
                    //var textNode = document.createElement('b');
                    //imgBlob = base64img(imgs[i]);
                    //alert(imgBlob);
                    //saveImage(base64imgraw(imgs[i]))
                    //saveAs(imgBlob, "hello world.png");
                    saveAs(b64toFile(base64img(imgs[i])), name+".jpg") ;
                }}
        }, true );

        var button3 = document.createElement("Button");
        name = numstring[0]+ pad(numstring[1], 4);

        button3.innerHTML = '<i class="fa fa-download"></i>';
        //button3.innerHTML = numstring[0]+ pad(numstring[1], 4);;
        button3.setAttribute ('id', name);
        button3.value = jNode.attr ("src");
        //button3.style = "position: absolute;top: 0%;left: 100%;transform: translate(-102%, 2%);-ms-transform: translate(-102%, 2%);background-color: #555;color: white;font-size: 16px;padding: 12px 24px;border: none;cursor: pointer;border-radius: 5px;z-index: 9999"
        button3.style = "position: absolute;top: 0%;left: 100%;transform: translate(-102%, 2%);-ms-transform: translate(-102%, 2%);z-index: 9999;"
            + "background-color: RoyalBlue; border: none; color: white; padding: 16px 16px; font-size: 16px; cursor: pointer";
        button2.after(button3);
        button3.addEventListener( 'click', function () {
            saveAs(this.value, name+".jpg");

        }, true );

        if (items.inArray(jNode.attr ("src")) == -1) {
            items.push(jNode.attr ("src"));
        }
    }

    var imgId = jNode.attr("id");
    //button.innerHTML =jNode.attr ("src");
    dllinks=jNode.attr ("src");
    //add(jNode.attr ("src"));


}


waitForKeyElements ("img[src*='content']", generateDownloadButton);



function scalePreserveAspectRatio(imgW,imgH,maxW,maxH){
    return(Math.min((maxW/imgW),(maxH/imgH)));
}

function base64img(i){
    var canvas = document.createElement('canvas');
    canvas.width = i.width;
    canvas.height = i.height;
    var context = canvas.getContext("2d");

    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;

    context.drawImage(i, 0, 0,canvas.width, canvas.height);
    //var blob = canvas.toDataURL("image/png");
    var blob = canvas.toDataURL("image/jpg");
    return blob.replace(/^data:image\/(png|jpg);base64,/, "");
}


function base64imgraw(i){
    var canvas = document.createElement('canvas');
    canvas.width = i.width;
    canvas.height = i.height;
    var context = canvas.getContext("2d");

    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;

    context.drawImage(i, 0, 0,canvas.width, canvas.height);

    //context.drawImage(i, 0, 0,canvas.width, canvas.height);
    //var blob = canvas.toDataURL("image/png");
    var blob = canvas.toDataURL("image/jpg");
    return blob;
}


function b64toFile(b64Data, filename, contentType) {
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);

        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var file = new File(byteArrays, filename, {type: contentType});
    return file;
}


//console.log('sukses');
//alert("hello");

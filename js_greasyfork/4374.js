// ==UserScript==
// @name        Flag Upload
// @include     http://*.legacy-game.net/flag.php*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/4585
// @description A script to build a 40X30 flag on legacy-game.net using a given image.
/*global $,FileReader,pic,HTMLCanvasElement */
// @downloadURL https://update.greasyfork.org/scripts/4374/Flag%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/4374/Flag%20Upload.meta.js
// ==/UserScript==

/*****************************************************
                    General Methods                    
/****************************************************/
//
function create(type,attr,text,parent){
    var ele = document.createElement(type);
    for(var x in attr){
        if(x.hasOwnProperty){
            ele.setAttribute(x,attr[x]);
        }
    }
    if(text){ele.innerHTML = text;}
    if(parent){parent.appendChild(ele);}
    return ele;
}

//Method to convert RGB values into hex for flag variables
function toHex(r, g, b) {
    var hex ="0123456789ABCDEF", ans;
    r = hex.charAt((r - (r % 16)) / 16) + hex.charAt(r % 16);
    g = hex.charAt((g - (g % 16)) / 16) + hex.charAt(g % 16);
    b = hex.charAt((b - (b % 16)) / 16) + hex.charAt(b % 16);
    ans = "#" + r + g + b;
    return ans;
}
/*****************************************************
                    CSS Injection                    
/****************************************************/
var custom = ""+
        "#uploadPanel{height:auto; width:auto; background: red none; border: 5px solid darkred; padding: 5px; position:absolute; top:20px; left:20px; max-height:90%; max-width:90%; padding-right:20px; overflow:auto;}\n"+
        "#flagOut{border:1px solid #c3c3c3; display:inline-block;}\n"+
        "#container{position:relative; display:block; height:30px; width:40px; padding:1px;}\n"+
        "#rawImage{position: absolute; display:block; z-index:1;}\n"+
        "#getArea{position:absolute; height:30px; width:40px; top:1px; left:1px; border:1px solid red;z-index:2;}\n"+
        "#imageUpload{display:block;}\n"+
        "#editPanel{display:none;}";

create('link',{rel:'stylesheet',href:'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css'},false,document.head);
create('style',{type:'text/css'},custom,document.head);

/*****************************************************
                    Interface Creation & Injection                    
/****************************************************/

var panel = create('div',{id:'uploadPanel'},false,document.body);
create('canvas',{id:'flagOut',width:'40',height:'30'},false,panel);
create('input',{id:'toFlag',type:'button',value:'Send to Flag'},false,panel);
create('span',{},'<br/>Resize Select Box:',panel);
create('input',{id:'resizeToggle',type:'checkbox'},false,panel);
create('span',{},'<br/>Keep Aspect Ratio:',panel);
create('input',{id:'Aratio',type:'checkbox',checked:'checked',disabled:'disabled'},false,panel);
create('span',{},'<br/>',panel);
create('input',{id:'reset',type:'button',value:'Reset to 40X30'},false,panel);
create('input',{id:'rawImgHide',type:'button',value:'Show/Hide Canvas'},false,panel);
create('span',{},'<br/>',panel);
create('span',{id:'edit'},'Editing Tools',panel);
var edit = create('div',{id:'editPanel'},false,panel);
create('input',{id:'greyscale',type:'button',value:'Greyscale'},false,edit);
create('input',{id:'invert',type:'button',value:'Invert'},false,edit);
var container = create('div',{id:'container'},false,panel);
create('canvas',{id:'rawImage',width:'40',height:'30'},false,container);
create('div',{id:'getArea'},false,container);
create('input',{id:'imageUpload',type:'file'},false,panel);

/*****************************************************
                    Canvas Methods                    
/****************************************************/

//Sends image data to 'large' canvas, from which we can select the desired area
function toRawCanvas(imgData){
    var img = new Image() ,
        rawcanvas = document.getElementById('rawImage'), 
        context = rawcanvas.getContext('2d'), 
        area;
    img.src = imgData;
    img.onload = function() {
        var container = document.getElementById('container');
        container.style.height=img.height+2+'px';
        container.style.width=img.width+2+'px';
        rawcanvas.height=img.height+2;
        rawcanvas.width=img.width+2;
        context.drawImage(img, 1, 1);
        area = document.getElementById('getArea');
        area.style.top='1px';
        area.style.left='1px';
    };
}

//Ctrl + V to paste an image to the canvas
//Currently only available with Chrome
function onPasteHandler(e){
    if(e.clipboardData) {
        var items = e.clipboardData.items,
            blob, 
            source;
        if(!items){
            alert("Image Not found");
        }
        for (var i = 0; i < items.length; ++i) {
            if (items[i].type.match('image.*')) {
                blob = items[i].getAsFile();
                source = window.webkitURL.createObjectURL(blob);
                toRawCanvas(source);
            }
        }
    }
}
//Use jQuery UI to allow the capture div inside the raw canvas to move freely when dragging
$(function(){
    $('#getArea').draggable({containment:'parent'});
    window.addEventListener("paste", onPasteHandler);
});
//Show/Hide the Raw Canvas from view 
//Mainly for when the image is larger than the window, or file upload is difficult to see
$('#rawImgHide').click(function(){
    $('#container').slideToggle('slow');
});
//Reset the capture div back to default size
$('#reset').click(function(){
    var area = document.getElementById('getArea');
    area.style.height="30px";
    area.style.width="40px";
});
//Allow the capture div to be resizable (jQuery UI)
//Aspect ratio can only be enabled/disabled when the capture div is resizable            
$('#resizeToggle').click(function(){
    if(this.checked){
        if ($('#Aratio').is(':checked')){
            $('#getArea').resizable({aspectRatio: true, containment:'parent'});
        }
        else{
            $('#getArea').resizable({containment:'parent'});
        }
        $('#Aratio').prop('disabled','');
    }
    else{
        $('#getArea').resizable('destroy');
        $('#Aratio').prop('disabled','disabled');
    }
});
//Enable/Disable aspect ratio on capture div
//Disabling may cause stretching/skewing of output flag
$('#Aratio').click(function(){
    if (this.checked){
        $('#getArea').resizable('destroy');
        $('#getArea').resizable({aspectRatio: true, containment:'parent'});
    }
    else{
        $('#getArea').resizable('destroy');
        $('#getArea').resizable({aspectRatio: false, containment:'parent'});
    }
}); 
//Image upload from local machine to raw canvas
$('#imageUpload').change(function(){
    if (document.getElementById("imageUpload").files.length === 0) {
        return;
    }
    var flag = document.getElementById("imageUpload").files[0],
        reader;
    if (!flag.type.match('image.*')) {
        alert("Not an image");
        return;
    }
    reader = new FileReader();
    reader.onload = (function() {
        return function(e) {
            toRawCanvas(e.target.result);
        };
    }(flag));
    reader.readAsDataURL(flag);
});
//After moving capture div to desired area, send containing image to secondry canvas to preview before sending to legacy page
//Resize to fit 40X30 pixels where needed using native methods
$('#getArea').mouseup(function(){
    var rawcanvas = document.getElementById('rawImage'),
        out = document.getElementById('flagOut'),
        area = document.getElementById('getArea'),
        outctx = out.getContext('2d'),
        x=parseInt(area.style.left,10),
        y=parseInt(area.style.top,10);
    outctx.clearRect (0,0,out.width,out.height);
    outctx.drawImage(rawcanvas, x, y,area.clientWidth,area.clientHeight,0,0,out.width,out.height);
});
//Sent image from preview canvas to legacy page, adjusting page variables and 'pixel' block backgrounds
$('#toFlag').click(function(){
    var canvas=document.getElementById('flagOut'),
        context = canvas.getContext('2d'),
        w = canvas.width,
        h = canvas.height,
        imgd = context.getImageData(0, 0, w, h),
        pix = imgd.data;

    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            document.getElementsByName("X"+j+"Y"+i)[0].bgColor = pic[j+i*w] = toHex(pix[(j+i*w)*4], pix[(j+i*w)*4 + 1], pix[(j+i*w)*4 + 2]);
        }
    }
});
/*****************************************************
                    Effect Addons                    
/****************************************************/
//Hide/Show effect options
$('#edit').click(function(){
    $('#editPanel').slideToggle();
});
//Perform greyscale effect on output flag
$('#greyscale').click(function(){
    document.getElementById('flagOut').greyscale();
});
//Invert output flag colours
$('#invert').click(function(){
    document.getElementById('flagOut').invert();
});

HTMLCanvasElement.prototype.greyscale = function(){
    var ctx = this.getContext('2d'),
        data = ctx.getImageData(0,0,this.width,this.height),
        d = data.data;
    for(var i=0;i<d.length;i+=4){
         d[i]= d[i+1] = d[i+2] = 0.2126*d[i] + 0.7152*d[i+1] + 0.0722*d[i+2];
    }
    ctx.putImageData(data,0,0);
};

HTMLCanvasElement.prototype.invert = function(){
    var ctx = this.getContext('2d'),
        data = ctx.getImageData(0,0,this.width,this.height),
        d = data.data;
    for(var i=0;i<d.length;i+=4){
        d[i]=255-d[i];
        d[i+1]=255-d[i+1];
        d[i+2]=255-d[i+2];
    }
    ctx.putImageData(data,0,0);
};
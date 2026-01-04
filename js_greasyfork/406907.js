// ==UserScript==
// @name         5ch image thumbnails&gallery
// @name:ja      5ch 画像サムネとガレリー追加
// @name:fr      5ch thumbnails&gallerie
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  facilitate image browsing in 5ch threads
// @description:ja  5chの画像閲覧支援
// @description:fr  faciliter la vue d'images sur 5ch
// @author       You
// @match        http://*.5ch.net/*
// @match        https://*.5ch.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406907/5ch%20image%20thumbnailsgallery.user.js
// @updateURL https://update.greasyfork.org/scripts/406907/5ch%20image%20thumbnailsgallery.meta.js
// ==/UserScript==

var disablelog = true;
var oldconsolelog = console.log;
var emptyfunction = function() {};
console.log = !disablelog ? oldconsolelog : emptyfunction;

//create thumbnails

var it0 = performance.now();
var t0 = performance.now();
var links = [];
var posts = document.querySelectorAll('div.post');
for (let i = posts.length-1; i>-1;i--){
    var as = posts[i].querySelectorAll('a');
    for (let i = as.length-1; i>-1; i--){
        links.push(as[i]);
    }
}

console.log({links});

var t1 = performance.now();
console.log("generating link array took " + (t1 - t0) + " milliseconds.");

links.forEach(function(element, index) {
//    var address = element.textContent;
    var href = links[index].href; //skip 5ch jump page
    var find = "jump.5ch.net/?";
    var position = href.indexOf(find);
    if (position != -1){
        var newhref = href.substr(position + find.length);
        links[index].href = newhref;
        href=newhref;
    }
    var ext = href.substr(href.length-3);
    if(ext=="jpg" || ext=="png" || ext=="gif" || ext=="bmp"){
        element.className = 'thumblink';
        var newimg = document.createElement("img");
        newimg.src = href;
        newimg.className = 'bigthumb';
        newimg.width = 400;
        newimg.addEventListener("click",function(){resize(this);});
        element.insertAdjacentElement('afterend', newimg);
    }
});

function resize(img){
    console.log(img);
    var stylewidth = img.style.width;
    console.log("oldstylewidth: " + stylewidth);
    console.log('shiftkey: ' + event.shiftKey);
    if (!event.shiftKey) {
        switch(stylewidth){
            case "":
                largesize(img);
                break;
            case "100%":
                truesize(img);
                break;
            case "auto":
                smallsize(img);
                break;
        }
    } else {
        switch(stylewidth){
            case "":
                truesize(img);
                break;
            case "100%":
                smallsize(img);
                break;
            case "auto":
                largesize(img);
                break;
        }
    }
}

// misc features

var inittime0 = performance.now();

var postarray = [];
var thumbarray = [];
var bigthumbarray = [];

makebutton("myButtonhide",buttonhide,"H","5%","0px");
makebutton("myButtonwarp",buttonwarp,"W","10%","0px");
makebutton("myButtonup",buttonup,"↑","32.5%","0px");
makebutton("myButtondown",buttondown,"↓","30%","0px");
makebutton("myButtoncurrent",buttoncurrent,"c","25%","0px");
//makebutton("myButtoncheck",buttoncheck,"check","20%","0px");
makebutton("myButtonfirst",buttonfirst,"f","22.5%","0px");
makebutton("myButtonlast",buttonlast,"l","20%","0px");
makebutton("myButtonresizeall0",buttonresizeall0,"0","60%","0px");
makebutton("myButtonsizeall1",buttonresizeall1,"1","62.5%","0px");
makebutton("myButtonsizeall2",buttonresizeall2,"2","65%","0px");
makebutton("myButtonlightbox",buttonlightbox,"G","90%","0px");

//buttons for debug purposes
/*makebutton("myButtonrebuild",buttonrebuild,"R","95%","0px"); //re-initialize gallery contents
makebutton("myButtonlog",buttonlog,"log","97.5%","97.5%");*/ //toggle console log display

var hidden = false;
function buttonhide (){
    if(!hidden){
        collapse();
    } else {
        uncollapse();
    }
    hidden = !hidden;
    var button = document.getElementById("myButtonhide");
    button.style.color = hidden ? "red" : "";
}

var warp = false;
function buttonwarp (){
    warp = !warp;
    var button = document.getElementById("myButtonwarp");
    button.style.color = warp ? "red" : "";
}

function buttonup(){
    moveelement(-1);
}

function buttondown(){
    moveelement(1);
}

function buttoncurrent(){
    moveelement(0);
}

function buttoncheck(){
    var posts = document.querySelectorAll("img.thumb_i");
    var current = getcurrent(posts);
}

function buttonlast(){
    if(thumbarray.length == 0) {initarrays()};
    var current = getcurrent(bigthumbarray);
    console.log("go to last: last: " + (thumbarray.length-1) + " current: " + current +" move: " +(thumbarray.length-1-current));
    moveelement(thumbarray.length-1-current);
}

function buttonfirst(){
    if(thumbarray.length == 0) {initarrays()};
    var current = getcurrent(bigthumbarray);
    console.log("go to first: current: " + current +" move: " + -current);
    moveelement(-current);
}

function buttonresizeall0(){
    resizeall(0);
}

function buttonresizeall1(){
    resizeall(1);
}

function buttonresizeall2(){
    resizeall(2);
}

function buttonlightbox(){
    var hide = lightbox.style.display == 'none';
    initlightbox();
    lightbox.style.display = hide ? '' : 'none';
    dimlight.style.display = lightbox.style.display;
    document.getElementById('myButtonlightbox').style.color = hide ? 'red' : '';
    var activeelement = document.activeElement;
}

function buttonrebuild(){
    thumbarray = [];
    bigthumbarray = [];
    initarrays();
}

function buttonlog(){
    disablelog = !disablelog;
    console.log = !disablelog ? oldconsolelog : function(){};
    document.getElementById('myButtonlog').style.color = !disablelog ? 'blue' : 'black';
}

function togglelightboxview(){
    var hide = lightboxview.style.display == 'none';
    lightboxview.style.display = hide ? '' : 'none';
    dimdimlight.style.display = lightboxview.style.display;
    var LBVnext = document.getElementById('myButtonLBVnext');
    var LBVprev = document.getElementById('myButtonLBVprev');
    if(LBVnext)LBVnext.style.display = hide ? '' : 'none';
    if(LBVprev)LBVprev.style.display = hide ? '' : 'none';
}

function initarrays(){
    var t0 = performance.now();
    var thumbs = document.querySelectorAll('a.thumblink');
    var bigthumbs = document.querySelectorAll("img.bigthumb");
    thumbarray = Array.from(thumbs);
    bigthumbarray = Array.from(bigthumbs);
    removetreeview(thumbarray,bigthumbarray);
    var t1 = performance.now();
    console.log('initarrays took ' + (t1-t0) + ' miliseconds');
    console.log({thumbarray},{bigthumbarray});
}

function moveelement(change){
    var navoffset = document.getElementsByClassName("navbar-fixed-top search-header")[0].getBoundingClientRect().height;
    if(thumbarray.length == 0) {initarrays()};
    var current = getcurrent(bigthumbarray);
    var target = current+change;
    if (!warp){
        target = Math.min(Math.max(target, 0), thumbarray.length-1); //cap to 0 and last;
    } else{
        target %= (thumbarray.length);
        if(target<0)target=thumbarray.length-1;
    }
    thumbarray[target].scrollIntoView();
    console.log("change: "+change);
    console.log("target: "+target);
    console.log(thumbarray[target]);
    window.scrollBy(0, -navoffset);
}

function collapse(){
    if(postarray.length == 0) {
        var d = document;
        var posts = d.getElementsByClassName("post");
        postarray = Array.from(posts);
    }
    for (let i = postarray.length-1; i > -1; i--){
        var post = postarray[i];
        var message = post.getElementsByClassName("message")[0];
        var content = message.innerText;
        if (content.indexOf("ttp") == -1){
            console.log(post.id + "hide");
            post.style.display = "none";
            post.className = "posthidden";
        } else {
            console.log(post.id + "show");
        }

    }
}

function uncollapse(){
    var d = document;
    var posts = d.getElementsByClassName("posthidden");
    for (let i = posts.length-1; i > -1; i--){
        var post = posts[i];
        post.style.display = "";
        post.className = 'post';

    }

}

function getcurrent(coll){
    console.log('getcurrent of' ,{coll});
    var navoffset = document.getElementsByClassName("navbar-fixed-top search-header")[0].getBoundingClientRect().height;
    console.log("navoffset: " + navoffset);
    for (let i = 0, run = coll.length; i<run;i++){
        var rect = coll[i].getBoundingClientRect();
        console.log("rectbottom check of " +i +"th: " + rect.bottom);
        if (rect.bottom > (navoffset+1)){
            console.log("getcurrent result: " + i);
            return i;
        }
    }
    console.log("getcurrent result: " + (coll.length-1));
    return coll.length-1;
}

function collection2array(coll,array){
    for (let i = 0, run = coll.length; i < run; i++){
        array[i] = coll[i];
    }
}

function removetreeview(array,bigarray){
    bigarray = bigarray || [];
    var oriarraylength = array.length;
    var oribigarraylength = bigarray.length;
    for (let i = array.length-1; i > -1; i--){
        var istreeview = array[i].closest(".treeView");
        var isposthover = array[i].closest('.post_hover');
        if (istreeview || isposthover){
            array.splice(i,1);
        }
    }
    for (let i = bigarray.length-1; i > -1; i--){
        var istreeview = bigarray[i].closest(".treeView");
        var isposthover = bigarray[i].closest('.post_hover');
        if (istreeview || isposthover){
            bigarray.splice(i,1);
        }
    }
    var newarraylength = array.length
    var newbigarraylength = bigarray.length
    }

function resizeall(size){
    console.log({size});
    if(thumbarray.length == 0) {initarrays()};
    var current = getcurrent(bigthumbarray);
    var rescrolloffset = bigthumbarray[current].getBoundingClientRect().top;
    console.log({current},{rescrolloffset});
    var arrayoffunctions = [smallsize, largesize, truesize];
    bigthumbarray.forEach(function(element,index){
        arrayoffunctions[size](element);
    });
    bigthumbarray[current].scrollIntoView();

    window.scrollBy(0,-rescrolloffset);
}

function smallsize(element){
    if(!element)return;
    console.log('transform: smallsize');
    element.style.maxHeight = "";
    element.style.maxWidth = "";
    element.style.width = "";
    element.style.border="";
}
function largesize(element, maxheight, widthmod, border){
    if(!element)return;
    console.log('transform: largesize');
    maxheight = maxheight || 80;
    widthmod = (widthmod || 100)/100;
    widthmod = 1;
    border = border == undefined ? true : border;
    var ratio = element.height / element.width;
    element.style.maxHeight = maxheight +"vh";
    element.style.maxWidth = (maxheight / ratio * widthmod) +"vh";
    element.style.width = "100%";
    element.style.height = "auto";
    console.log({maxheight},{border});
    if (border)element.style.border='2px solid yellow';
}
function truesize(element){
    if(!element)return;
    console.log('transform: truesize');
    element.style.maxHeight = "";
    element.style.maxWidth = "";
    element.style.width = "auto";
    element.style.border='2px solid green';
}

// LIGHT BOX START

var lightbox = document.createElement("div");
lightbox.className = 'lightbox';
lightbox.style.position = 'fixed';
lightbox.style.zIndex = 9998;
lightbox.style.width = '100%';
lightbox.style.height = '100%';
lightbox.style.overflow = 'auto';
lightbox.style.top = 0;
lightbox.style.display = 'none';
lightbox.style.paddingTop = '2.5%';
lightbox.addEventListener('click',lightboxclick);

function lightboxclick(e){
    var cond1 = (event.target.tagName !='IMG');
    var cond2 = (dimdimlight.style.display == 'none');
    var ddl = dimdimlight.style.display;
    console.log({cond1},{cond2});
    if(cond1){
        if(cond2){
            buttonlightbox();
        } else {
            togglelightboxview();
        }
    }
}

var lightboxcontent = document.createElement('div');
lightboxcontent.className = 'lightboxcontent';
lightboxcontent.style.position = 'absolute';
lightboxcontent.style.zIndex = 10005;
lightboxcontent.style.margin = 'auto';
lightboxcontent.style.padding = '2.5%';
lightboxcontent.style.width = '100%';
lightboxcontent.style.maxWidth = '1300px';
lightbox.appendChild(lightboxcontent);

var dimlight = lightbox.cloneNode();
dimlight.className = 'dimlight';
dimlight.style.width = '100%';
dimlight.style.left = 0;
dimlight.style.zIndex = 9997;
dimlight.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
dimlight.style.pointerEvents = 'none';
var lightboxready = false;

var dimdimlight = dimlight.cloneNode();
dimdimlight.className = 'dimdimlight';
dimdimlight.style.zIndex = 10100;
dimdimlight.style.pointerEvents = '';

var lightboxview = lightboxcontent.cloneNode();
lightboxview.className = 'lightboxview';
lightboxview.padding = '';
lightboxview.style.zIndex = 11111;
lightboxview.style.position = 'fixed';
lightboxview.style.display = 'none';
lightboxview.style.maxWidth = '';
lightboxview.style.height = '100%';

var lightboxviewimg = document.createElement('img');
lightboxviewimg.style.zIndex = 33333;
lightboxviewimg.style.position = 'absolute';
lightboxviewimg.style.marginLeft ='auto';
lightboxviewimg.style.marginRight = 'auto';
lightboxviewimg.style.left = 0;
lightboxviewimg.style.right = 0;
lightboxviewimg.style.width = '1px';
lightboxviewimg.style.marginTop = '-2.5vw';

lightboxview.appendChild(lightboxviewimg);
lightbox.appendChild(lightboxview);

function initlightbox(){
    if(lightboxready)return;
    if(thumbarray.length == 0) {initarrays()};
    console.log({bigthumbarray});
    bigthumbarray.forEach(function(element,index){
        var newimg = document.createElement('img');
        newimg.src=element.src;
        newimg.height = 225;
        newimg.addEventListener('click',function(){scroll2me(thumbarray[index]);});
        newimg.addEventListener('mousedown',function(click){lbimgclick(click,index);});
        newimg.style.maxHeight = '80pv';
        newimg.style.maxWidth = '';

        lightboxcontent.appendChild(newimg);

    });
    document.body.appendChild(lightbox);
    lightbox.appendChild(dimlight);
    lightbox.appendChild(dimdimlight);
    makebutton("myButtonLBVnext",buttonLBVnext,"next","1%","52.5%");
    makebutton("myButtonLBVprev",buttonLBVprev,"prev","1%","47.5%");
    document.getElementById('myButtonLBVnext').style.display = 'none';
    document.getElementById('myButtonLBVprev').style.display = 'none';
    console.log({lightbox});
    lightboxready = true;
}

function buttonLBVnext(){
    moveLBV(+1);
}
function buttonLBVprev(){
    moveLBV(-1);
}

var currentLBV = 0;
function lbimgclick(click,index){
    console.log('middleclicked on lightbox img');
    switch (click.which){
        case 2:
            click.preventDefault();
            currentLBV = index;
            lightboxviewimg.src = bigthumbarray[currentLBV].src;
            largesize(lightboxviewimg,'92.5','95',false);
            togglelightboxview();
    }
}

function scroll2me(element){
    element.scrollIntoView();
    var navoffset = document.getElementsByClassName("navbar-fixed-top search-header")[0].getBoundingClientRect().height;
    window.scrollBy(0, -navoffset);
}

function moveLBV(change){
    currentLBV = maptorange(currentLBV+change,bigthumbarray.length-1,0,true);
    lightboxviewimg.src = bigthumbarray[currentLBV].src;
    smallsize(lightboxviewimg);
    largesize(lightboxviewimg,'92.5','95',false);
}


function makebutton(buttonname,event,text,bottom,left){
    text = text || "";
    bottom = bottom || "0";
    left = left || "0";
    var tempbutton = document.createElement("input");
    tempbutton.type = "button";
    tempbutton.id = buttonname;
    tempbutton.value = text;
    tempbutton.style.position = "fixed";
    tempbutton.style.bottom = bottom;
    tempbutton.style.left = left;
    tempbutton.addEventListener("click",event);
    tempbutton.style.zIndex = 9999;
    document.body.appendChild(tempbutton);
}

function maptorange(value,max,min,wrap){
    value = value || 0;
    max = max || 0;
    min = min || 0;
    wrap = wrap || true;
    console.log("maptorange: ",{wrap},{value},{max},{min});
    if (!wrap) return Math.min(Math.max(value, min), max);
    value = value % (max+1);
    if (value < min) value += max - min + 1;
    return value;
}

var inittime1 = performance.now();
console.log((inittime1-inittime0) + ' miliseconds taken by script');



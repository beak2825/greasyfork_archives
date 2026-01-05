// ==UserScript==
// @name           Endless E-hentai Pages
// @description    View e-hentai searches, thumbnails, and images on a single endless page.
// @author         Couchy
// @version        161230
// @namespace      https://greasyfork.org/en/users/50-couchy
// @include        *://g.e-hentai.org/*
// @include        *://e-hentai.org/*
// @include        *://exhentai.org/*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/26140/Endless%20E-hentai%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/26140/Endless%20E-hentai%20Pages.meta.js
// ==/UserScript==

if(document.getElementById("wcr_btnsettings"))
    return;

var appendTo =
    /*1-Search*/safeArray(document.getElementsByClassName("sni"),0) ||
    /*2-Thumbs*/document.getElementById("gdt") ||
    /*3-Images*/document.getElementById("i1");
var type = (appendTo==safeArray(document.getElementsByClassName("itg"),0))?1:(appendTo==document.getElementById("gdt"))?2:(appendTo==safeArray(document.getElementsByClassName("sni"),0))?3:0; if(type==0){return}
var currentPage = new page("");
currentPage = new page(document.body.innerHTML);
if(type == 3){
    appendTo = document.body;
    document.body.setAttribute("style", "text-align:center;");
    appendTo.innerHTML = currentPage.content;
    galleryStyle(document, true);
    var imageError = function(brokeImg){
        brokeImsetAttribute("brokesrc", (brokeImgetAttribute("brokesrc") || brokeImgetAttribute("src")));
        brokeImsetAttribute("title", "Click to reload!");
        brokeImsetAttribute("onclick", "this.setAttribute('src', this.getAttribute('brokesrc')+'?v='+(new Date).getTime()); this.removeAttribute('onclick'); this.removeAttribute('title')");
        brokeImsetAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAACXBAMAAABJtXDJAAAAJFBMVEUAAAAAAAD/zMxmZpkzMzNmZmYzM2bMmZmZZmaZmZnMzMz////Ur+RNAAAAAXRSTlMAQObYZgAAAmtJREFUWMPtmM9r2zAUx9ORMppdqs12u2NNS7bbhiFnG5QxdnJKBLuGDN8bFrxrSqE+79Y/YP/n9Cz5RbKk1KNN5EG/FyHy4cVP0vshDQaoP2yrwQ5lBBX0jBtSLoUjMP9mckfEorAvnO6C1H25pjR3LchWq/iSkLQjlz+FoygSUFpzU5ab3CqWuiTnYmg57YuDdQ6qKo7HJZebg30L8JdVD7nX8Pnox7jkrq/Z3ORexYZmtkPoi5Px8bbZt0a5PY48cAFj36t7sco/kUtNThjiw0YJpt5xRM81bk7XwTmZ11Mjox5rdqKE65OtMvSBi4paPyid0nwH9y6ZOIvDobj3HbmA5SYXKcA1bOTGqNkeuS/FMknkgaL0N3C/qrsWNyJkmUh9FqdR5gbDngeO56uiAGQCuM6paYtzwpRvTtQnriveLWzbBOSkv82+1STMTn1yc0rlKjfDQuE+gienot+I0BC6fa3UuqwnnPQjEWFy5uRQB+SaTzO5slS4iRIfOneF5cEnx/3Qua/VrZVrr8ttsygfMI68cMdYz2Rg6DrbF3fSkau7dllJF5AG6wF1Xq6lPa0Diqxmn5tL/8HeCDrIG5iBC0s4OAsSQgO/hgv4rOHewN5cwEyeK/A2xBC6aP63KzfqyJ105AYPD/VMCQydC/A14REOq9teOHFiCtHxhphabtp1Vbv4hpioSC+4obhvZ6Kg8utexXUHhSigU9tzgyzQ412PEj3ipizvxKX255+9cXFVZZ04Gfy5J879fYwhF1DqtLd9NtnYt+yFc3PDTDzU1Zq5uaNH3wlrzbNuXEZeuP+RYy1pQfkXeY0Mew9Lp6wAAAAASUVORK5CYII=");
    }
    var script = document.createElement("script");
    script.textContent = imageError.toString();
    document.head.appendChild(script);
}
currentPage.content = "";
var ready = true;
var wait = (type == 2) ? 0 : 3500;
var resize = 100;
var auto = false;
var autoTimeout = setTimeout(function(){},0);
var eventHandler = function(e){
    if(e.keyCode == 39){
        if(!e.shiftKey && !e.ctrlKey && currentPage.nextURL && ready && !auto){
            pause();
            get();
        }
        else if(e.ctrlKey && !e.shiftKey && type == 3){
            var input = parseInt(prompt("Image Scale","100"));
            if(input){
                resize = input;
                galleryStyle(document, false);
            }
        }
            else if(e.shiftKey && !e.ctrlKey && currentPage.nextURL && ready){
                var input = parseInt(prompt("Enter time delay in ms or click cancel to stop. (WARNING: short delays may cause errors/bans!)", "10000"));
                if(input){
                    auto = true;
                    wait = parseInt(input);
                    get();
                }
                else{
                    clearTimeout(autoTimeout);
                    auto = false;
                    wait = (type == 2) ? 0 : 3500;
                    ready = true;
                    document.body.style.cursor = "default";
                }
            }
        }
};
document.onkeydown = null;
var eventListener = document.addEventListener("keydown", eventHandler, false);
if(wait > 0){
    pause();
    document.body.style.cursor = "default";
    setTimeout(resume, wait);
}

function safeArray(a, i){
    try{return a[i];}
    catch(e){return "";}
}

function page(html){
    this.content = 
        /*Search*/safeArray(html.match(/(<div class="sni[^]*?)<div class="sb/i),1) || safeArray(html.match(/(<tr class="gtr[^]*?)<\/table>/i),1) ||
        /*Thumbs*/safeArray(html.match(/<div id="gdt">([^]*?)<div class="c"/i),1) ||
        /*Images*/safeArray(html.match(/<a onclick="[^>]*?" href="[^>]*?">(<img id="img" src="[^>]{150,}?"[^>]*?>)/i), 0).replace(/>$/i, " onerror=\"imageError(this);\" onabort=\"imageError(this);\">") + "<br/><br/><br/><br/><br/>";
    this.nextURL = htmlDecode(
        /*Search*/safeArray(html.match(/<a href="(http[^"]*)"[^>]*>&gt;<\/a>/i),1) || 
        /*Thumbs*/function(){var thumbURL=document.location.href.match(/^http:\/\/e(x|-)hentai\.org\/g\/.*\//i);var str=safeArray(html.match(/<td onclick="sp\(([0-9]*)\)"><a href="#" onclick="return false">&gt;<\/a>/i),1);return str?thumbURL+"?p="+str:undefined;}() ||
        /*Images*/function(){var str=safeArray(html.match(/<a href="([^>]*?)"><img src="([^>]{150,}?)"/i),1);return(str&&str!=currentPage.nextURL)?str:"";}()
        );
    //   console.log(JSON.stringify(this));
}

function galleryStyle(target, initial){
    var imgs = target.getElementsByTagName("img");
    for(var i = 0; i < imgs.length; i++){
        if(initial){
            imgs[i].setAttribute("oldwidth", imgs[i].style.width);
            imgs[i].setAttribute("oldheight", imgs[i].style.height);
        }
        imgs[i].style.width = (parseInt(imgs[i].getAttribute("oldwidth"))*resize/100)+"px";
        imgs[i].style.height = (parseInt(imgs[i].getAttribute("oldheight"))*resize/100)+"px";
    }
}

function pause(){
    ready = false;
    document.body.style.cursor = "wait";
}

function resume(){
    ready = true;
    document.body.style.cursor = "default";
}

function html2dom(html){
    var container = document.createElement("div");
    container.innerHTML = html.replace(/<script(.|\s)*?\/script>/gi,"").replace(/<iframe(.|\s)*?\/iframe>/gi,"");
    if(type == 3)
        galleryStyle(container, true);
    return container;
}

function htmlDecode(input){
    if(typeof input === "undefined")
        return undefined;
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function get(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", currentPage.nextURL, true);
    xhr.ontimeout = xhr.onerror = resume;
    xhr.onload = function(){
        currentPage = new page(xhr.responseText);
        //console.log(currentPage, html2dom(currentPage.content));
        
        appendTo.appendChild(html2dom(currentPage.content));
        //if(type == 3){document.images[document.images.length-1].scrollIntoView();}           
        currentPage.content = "";
        if(auto && currentPage.nextURL)
            autoTimeout = setTimeout(get, wait);
        else if(currentPage.nextURL)
                setTimeout(resume, wait);
            else{
                resume();
                ready = false;
            }
    };
    xhr.send();
}
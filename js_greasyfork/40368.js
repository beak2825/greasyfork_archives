// ==UserScript==
// @name         Savmage 2
// @version      1.6
// @description  One click save images with custom filenames.
// @author       Doc
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @include      https://*
// @include      http://*

// @namespace https://greasyfork.org/users/2657
// @downloadURL https://update.greasyfork.org/scripts/40368/Savmage%202.user.js
// @updateURL https://update.greasyfork.org/scripts/40368/Savmage%202.meta.js
// ==/UserScript==

//highlighter
if (window.location.href.indexOf('instagram') !== -1){
setInterval(function(){
    var then = document.querySelectorAll('time');
    var now = new Date();
    for (var i=0;i<then.length;i++){
        var dif = Math.abs(new Date(then[i].dateTime) - now);
        if (dif < 7000000){
            then[i].parentNode.style.background = "orange";
        }
    }
}, 3000)
}
//saver
var capstyle = document.createElement('style');
capstyle.innerHTML = `
.caps:hover{
left:0px!important;
}
.caps>div>*{
width:181px !important;height: auto !important;
}
.savewrapper > * {

position:relative;
}
.savewrapper{
min-width:100px;
min-height:100px;
}
.savepic, .close {
min-width:100px;
background: #9c9c9c;
margin-bottom: 2px;
font-family: courier;
font-size: 13px;
cursor: pointer;
}
.savepic:hover, .close:hover {
background:white;
}
.caps, .saver {
    background: #0009;
    direction: rtl;
    z-index: 9999;
    position: fixed;
    left: -205px;
    top: 5px;
    width: 208px;
    height: 99vh;
    overflow-y: scroll;
    padding-right: 5px;
}
.saver {
direction: ltr;
left:420px;
padding:4px;
}
.savbutton {
    position: absolute;
    z-index: 999;
    left: 0px;
    text-align: left;
    color: #00ffc0;
    cursor: pointer;
    padding-left: 10px;
    font-weight: bolder;
}
`;

var links = document.createElement('textarea');
links.className = "links";
links.style = "display:none;"
document.body.appendChild(links);

document.head.appendChild(capstyle);
var caps = document.createElement('div');
caps.className = "caps";
document.body.appendChild(caps);




var capped = [];
var names = [];
if (GM_getValue("names")) {
    names = GM_getValue("names");
} else {
    names = [];
    GM_setValue("names", names);
}

var selected = '';
if (GM_getValue("selectedtext")){
    selected = GM_getValue("selectedtext");
} else {
    GM_setValue("selectedtext", '[Selected Text Here]');
}
var savebutton = '<div class="savbutton">SAVE</div>';
function cap() {
    var media = document.querySelectorAll('img, video');
    for (var i = 0; i < media.length; i++) {
        //media[i].controls = true;
        var html = media[i].outerHTML;
        html = html.replace('class', 'none').replace('style', 'none').replace('autoplay', 'none');
        if (media[i].src) {
            if (capped.indexOf(media[i].src) == -1) {
                if (media[i].naturalHeight > 300 || media[i].localName == "video") {
                    if (media[i].srcset) {
                        var full = media[i].srcset.split(',')
                        var len = full.length - 1;
                        full = full[len].split(' ')[0];
                        html = html.replace('src', 'src="' + full + '" none');
                        capped.push(media[i].src);
                        caps.innerHTML += '<div class="savewrapper" title="' + full + '">' + savebutton + html + '</div>';
                    } else {
                        capped.push(media[i].src);
                        caps.innerHTML += '<div class="savewrapper" title="' + media[i].src + '">' + savebutton+ html + '</div>';
                    };

                }

            }
        } else {

            var source = media[i].children[0];
            if (source && source.src && capped.indexOf(source.src) == -1) {

                capped.push(source.src);
                caps.innerHTML += '<div class="savewrapper" title="' + source.src + '">'+savebutton + html.replace('poster', 'none') + '</div>';
            }
        }
    }
};
var watching = false;

caps.addEventListener('mouseenter', function(){
watching = true;
    cap();
});

caps.addEventListener('mouseleave', function(){
watching = false;
});

caps.addEventListener('click', function (e) {
    if (GM_getValue("names")) {
    names = GM_getValue("names");
    }
    console.log(e.target.className);

	if (e.target.className !== "savbutton"){
return;
}
var title = e.target.parentNode.title;
    if (e.ctrlKey && title ) {
        var arg = {
                url : title,
                name : title.split('/').pop().split('?')[0]
            };
        GM_download(arg);
        return;
    };
    if (e.altKey && title ) {
        links.value += '\n'+title
    links.select();
    document.execCommand("copy");
        return;
    };


    e.target.style = 'color:red;';
    var saver = document.createElement('div');
    saver.className = "saver";
    saver.innerHTML = "<div class='close'>Close</div>";
    var s = document.createElement('input');
    s.autocomplete = 'off';
    s.placeholder = 'Search...';
    s.className = "entername";
    saver.appendChild(s);
    saver.innerHTML += "<div class='savepic' id='saverselected' title=" + title + ">" + GM_getValue('selectedtext') + "</div>";

    for (var i = 0; i < names.length; i++) {
        saver.innerHTML += "<div class='savepic' title=" + title + ">" + names[i] + "</div>";
    }

    document.body.appendChild(saver);
    var sv = document.getElementsByClassName('entername')[0];

    sv.addEventListener('input', function () {
        var buttons = saver.querySelectorAll('.savepic');
        var search = sv.value;
        document.getElementById('saverselected').innerHTML = sv.value;
        for (var index in buttons) {
            if (buttons[index]){
                if (buttons[index].innerHTML.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                    buttons[index].style.display = 'inline-block';
                } else {
                    buttons[index].style.display = 'none';
                }
            }
        }
    });
    sv.focus();

    saver.addEventListener('click', function (e) {
        if (e.target.className == 'savepic'){
            if (e.ctrlKey) {
            var target = names.indexOf(e.target.innerHTML);
                names.splice(target, 1);
                GM_setValue("names", names);
                document.body.removeChild(saver);
            saver = null;
            } else if(e.altKey) {
                
                      } else {
                var n = e.target.innerHTML.replace(/[^a-zA-Z ]/g, "") + '.'+ e.target.title.split('?')[0].split('.').slice(-1).pop();
                
            var arg = {
                url : e.target.title,
                name : n
            };
            var target = names.indexOf(e.target.innerHTML);
            if (target !== -1){
                 names.splice(target, 1);
            }
            names.unshift(e.target.innerHTML);
            GM_setValue("names", names);
            GM_download(arg);
            document.body.removeChild(saver);
            saver = null;
                }
        } else if (e.target.className == "close"){
            document.body.removeChild(saver);
            saver = null;
        }
    });
return;

});

document.addEventListener('mouseup', function(e) {
    var text = window.getSelection().toString().substring(0, 25);
    if (text){
        GM_setValue("selectedtext", text);
        document.getElementById('saverselected').innerHTML = text;
    }
});

document.addEventListener("DOMContentLoaded", function(event) {

});
cap();
setInterval(function () {
    if (watching){
        cap();
    }
}, 2000);
// ==UserScript==
// @name         SymLite Zupa Tweaker
// @version      0.7
// @author       TB
// @match        https://symlite.moravia.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/166154
// @description Various SymLite tweaks
// @downloadURL https://update.greasyfork.org/scripts/374370/SymLite%20Zupa%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/374370/SymLite%20Zupa%20Tweaker.meta.js
// ==/UserScript==

/*
var ico = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD//////v7+//39/f/+/v7//v7+//39/f/+/v7///////39/f///////v7+//39/f/+/v7//v7+//7+/v////////////////////////////7+/v////////////////////////////////////////////7+/v/+/v7///////j4+P/k5OT/19fX/+Hh4f/Y2Nj/0tLS/+bm5v/19fX/29vb//f39//g4OD/zs7O/+Li4v/i4uL/4+Pj//r6+v/v7+//mZmZ/42Njf+VlZX/p6en/3p6ev/Ozs7/8PHx/4CBgf/39/f/uLi4/5mZmf+Ojo7/qKio/8fHx///////+/v7//Pz8//v7+//6Ojo/+/v7//e39//9PT0///////w7+7//////+jp6f/o6Oj/7e3t/+np6f/u7u7///////7+/v/+/v7//v7+//39/f//////9vLy/72+vv+cp6n/oKut/7m6uv/z8O////////z8/P/+/v7//v7+//7+/v/+/v7//f39//z8/P//////zcrK/3KOk/92sLr/gcLN/4XH0f95s7z/cIuQ/83Ly////////Pz8//39/f/+/v7//v7+//z8/P//////19TT/2+WnP+g7Pn/pOr2/5rf6v+g5fH/puz4/5vn9P9skZf/2tbV///////9/f3//v7+//7+/v/9/v7//////4aZnP9+vMb/Y4OI/2CCh/9ggYf/YIGH/1+Ahv9hgYb/frzH/4udoP///////f39//7+/v/9/f3//////+bi4f92n6b/mNzo/4fAyv+Hwcv/isXP/4rFz/+Jwsz/icHL/5jd6P93n6b/6eTj///////9/f3//Pz8///////Y1dX/d6ev/5je6v+W2ub/neby/5jc5/+a3un/our2/5zg6/+d4+7/eaiv/9zZ2P///////Pz8//39/f//////5ODf/3qkq/+g5/P/isbP/2SKkP+U1uH/ldfi/2eNlP+OydP/nuXx/3mhqP/n4+L///////39/f/+/v7//f7+///+/f+AlJf/k93p/4e9xv87S07/k9Xg/5LT3v88S03/h7/I/5Lb5/+Elpn////+//3+/v/+/v7//v7+//z8/P//////zMrJ/2eSmf+b5PH/m+Dr/5XX4v+V1uH/mt/q/5fg7f9mj5b/0M3N///////8/Pz//v7+//7+/v/+/v7//P39///////AwMD/b5KY/368xv+Mz9r/jM/b/327xf9xk5j/w8LC///////8/f3//v7+//7+/v/+/v7//v7+//7+/v/8/Pz//////+Xh4P+hp6j/iJqd/4udoP+lqqv/5uLi///////8/Pz//v7+//7+/v/+/v7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
document.querySelector("link[rel='shortcut icon']").href = ico;
document.querySelector("link[rel*='icon']").href = ico;

if(window.location.href.match(/Document\?requestId=/)) {
    if(document.querySelectorAll("a[href*=tasks]").length > 0) {
        console.log("Polyglot detected!");
        var a = document.createElement("a");
        a.href = "https://localization.google.com/polyglot?project_id=" + document.querySelector("#req-name").getAttribute("value");
        a.target = "_blank";

        var img = document.createElement("img");
        img.src = "https://www.gstatic.com/polyglot/logo.svg";
        img.style["width"] = "25px";
        img.style["margin"] = "5px";
        a.appendChild(img);
        document.querySelector("h3").appendChild(a);
    }
}
*/

function tabIndexInput(selector, time) {
    if(document.querySelector(selector)!=null) {
        document.querySelector(selector).setAttribute("tabindex",4);
        return;
    }
    else {
        setTimeout(function() {
            tabIndexInput(selector, time);
        }, time);
    }
}


if(window.location.href.match(/symlite\.moravia\.com\/Team/)) {
    var buttons = document.querySelectorAll('i.glyphicon-edit');
    for (var x=0; x<buttons.length; x++) {
        var id = buttons[x].parentElement.href.match(/\/Team\/Edit\?id=([^\&]+)/)[1];
        var url = 'https://symlite.moravia.com/Assignment/MyTasks?userid=' + id;
        addButton(url, buttons[x].parentElement.parentElement);
    }
}

function addButton(url, parent) {
    var a = document.createElement("a");
    a.href = url;
    var i = document.createElement("i");
    i.classList = "glyphicon glyphicon-list-alt";
    a.appendChild(i);
    parent.appendChild(a);
}

if(window.location.href.match(/Vendor(Tasks|Team)/i)) {
    tabIndexInput(".select2-container > input",1000);
    document.querySelector('#vendor-goto').setAttribute("tabindex",5);
    document.querySelector('#vendor-goto').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            e.target.click();
        }
    });
}
// ==UserScript==
// @name       Czerwony pasek
// @namespace  http://www.wykop.pl/*
// @version    1.4
// @description jak przewijasz to masz taki fajny pasek
// @include     *://www.wykop.pl/*
// @exclude      *://www.wykop.pl/cdn/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/32689/Czerwony%20pasek.user.js
// @updateURL https://update.greasyfork.org/scripts/32689/Czerwony%20pasek.meta.js
// ==/UserScript==

(function(){
    var elem = document.getElementById("nav");
    var theCSSprop = window.getComputedStyle(elem,null).getPropertyValue("position");
    var l = document.createElement('div');
    var p = document.createElement('div');
    var car;
    l.setAttribute("id", "lineGGG");
    if(theCSSprop=="fixed")
	l.setAttribute("style", "position:fixed;background:red;top:50px;height:2px;z-index: 100;");
    else
    l.setAttribute("style", "position:fixed;background:red;top:0px;height:2px;z-index: 100;");
    p.setAttribute("id", "procGGG");
	p.setAttribute("style", "position:fixed;top:15px;left:10px;height:20px;width:30px;z-index: 100;");

	document.body.appendChild(p);
	document.body.appendChild(l);
	var ln = document.getElementById('lineGGG');
	var pc = document.getElementById('procGGG');
    function hidde(){
        pc.style.display = "none";
    }
    function round(x, y){
        var s = Math.pow(10, y);
        return (Math.floor(x * s))/s;
    }
    document.onscroll = function(){
        clearTimeout(car);
        pc.style.display = "block";
        var winHe  = window.pageYOffset;
        var limit = document.body.offsetHeight  - window.innerHeight;
        var z = round((winHe/limit*100), 1);
        ln.style.width = z + "%";
        pc.innerHTML = round(z, 0) + "%";
        car = setTimeout(hidde, 1500);
    };
})();
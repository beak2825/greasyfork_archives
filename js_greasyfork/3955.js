// ==UserScript==
// @name        Rooster teeth podcast popup button
// @namespace   http://roosterteeth.com/
// @author      Chris Toft
// @description Adds a popup button to Rooster Teeth podcast pages. This is NOT an official Rooster Teeth extension.
// @include     http://roosterteeth.com/podcast/*
// @include     http://roosterteeth.com/gamepodcast/*
// @include     http://roosterteeth.com/spoilercast/*
// @include     http://roosterteeth.com/screenplay/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3955/Rooster%20teeth%20podcast%20popup%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/3955/Rooster%20teeth%20podcast%20popup%20button.meta.js
// ==/UserScript==

var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function() {
    $('embed').parent().append('<input type="button" value="Open popup" onclick="window.open($(\'embed\').parent().find(\'iframe\').attr(\'src\'),\'Blip player of rooster teeth podcast\',\'height=350,width=570\');">');
});
 
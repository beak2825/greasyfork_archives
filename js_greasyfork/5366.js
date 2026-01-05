// ==UserScript==
// @name       8Chan V Spoiler image change
// @namespace  http://ArcadeRespawn.com/
// @version    0.2
// @require http://code.jquery.com/jquery-2.1.1.js
// @require https://greasyfork.org/scripts/5365-underscore-fork/code/Underscore%20Fork.js?version=19455
// @include *8chan.co/*
// @description  enter something useful
// @match      https://greasyfork.org/
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/5366/8Chan%20V%20Spoiler%20image%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/5366/8Chan%20V%20Spoiler%20image%20change.meta.js
// ==/UserScript==

randomSpoiler = function() {
    var rand = Math.floor(Math.random() * 4);
    
    switch(rand){
        case 0:
            return "https://i.imgur.com/i3n1c0N.gif";
            
        case 1:
            return "https://i.imgur.com/fFWvz5A.gif";
            
        case 2:
            return "https://i.imgur.com/BVbz9kv.gif";
            
        case 3:
            return "https://i.imgur.com/UaX3Xwj.gif";
            
        case 4:
            return "https://i.imgur.com/DJJdfrP.gif";
    }
};

spoilerFunc = function(elem) {
    if(elem.src === "https://8chan.co/static/spoiler.png")
        elem.src = randomSpoiler();
        
    if(elem.src === "https://8chan.co/static/file.png"){
        elem.src = "https://i.imgur.com/HEn965V.gif";
        elem.style = "min-width:128px;"
    }
};

replaceImages = function() {
    var spoilerImages = $("img");
    _.each(spoilerImages, spoilerFunc);
    
    setTimeout(10,replaceImages);
};

replaceImages();
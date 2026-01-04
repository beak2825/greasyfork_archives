

    // ==UserScript==
     
    // @name           RAWRCornerButton
    // @author         Shix
    // @description    Inserts Rhagnor Corner Link to BHD Home Page
    // @match          http*://*beyond-hd.me
    // @version        2
    // @date           2021-04-06
    // @grant          none

    // @namespace https://greasyfork.org/en/users/779691
// @downloadURL https://update.greasyfork.org/scripts/427510/RAWRCornerButton.user.js
// @updateURL https://update.greasyfork.org/scripts/427510/RAWRCornerButton.meta.js
    // ==/UserScript==
     
     
     
    function createImg(x,y) {
    	var img = document.createElement('img');
    	img.id = 'img_' + x;
    	img.src = y;
        img.height = 34;
        img.style.cssText = "border-radius:3px;";
    	return img;
    }
    function createRC(x) {
    	var a = document.createElement('a');
     
    	a.appendChild(x);
    	a.href = "https://beyond-hd.me/forums/topic/rhagnors-4k-rawr-corner.4011";
        a.target = "_blank";
        a.style.cssText = `position: absolute;
                           margin: 0px 7px;`
    	return a;
    }
     
    var target = document.querySelector(".button-left");
     
     
    var rcImg = createImg("rawrcorner","https://i.ibb.co/FgrL1gT/rc-x34.png");
    var rc = createRC(rcImg);
     
    target.appendChild(rc);


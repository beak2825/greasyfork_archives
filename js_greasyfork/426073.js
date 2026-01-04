// ==UserScript==
// @name         Zoom Addon
// @version      0.1
// @description  This is the addon for my krunker hack
// @author       CodeRed
// @match         *://krunker.io/*
// @icon         https://i.imgur.com/O5MRhHs.png

// @grant        none
// @namespace https://greasyfork.org/users/769289
// @downloadURL https://update.greasyfork.org/scripts/426073/Zoom%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/426073/Zoom%20Addon.meta.js
// ==/UserScript==

document.title = "Zoom by CodeRed";
document.getElementById("instructions").style.color = "Purple";
document.getElementById('instructions').innerHTML = 'Loading Zoom';
document.getElementById('modVote').innerHTML = 'Zoom';
document.getElementById("modVote").style.color = "Red";
javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
//Full screen
//<div class="chatItem" style="word-break:break-all;overflow-wrap:break-word;"><span class="chatMsg"><span style="color:#eb5656">DodgyDucks</span><img style="opacity:0.7;margin-right:9px;" class="weaponChatIcon" src="./textures/weapons/icon_1.png"><img class="headShotChatIcon" src="./img/headshot_0.png"><span style="color:#eb5656">SpoopyAmos</span></span></div>
document.fullscreenEnabled =
	document.fullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.documentElement.webkitRequestFullScreen;
(function() {
    let initialize = function(data) {
        let regex = /if\(!\w+\['(\w+)']\)continue/;
        let result = regex.exec(data);
        if (result) {
            const inView = result[1];
            const push = Array.prototype.push;
            Array.prototype.push = function(...args) {
                push.apply(this, args);
                if (args[0] instanceof Object && args[0].isPlayer) {
                    Object.defineProperty(args[0], inView, {value: true, configurable: false});
                }
            }
        }
    }

    const decode = window.TextDecoder.prototype.decode;
    window.TextDecoder.prototype.decode = function(...args) {
        let data = decode.apply(this, args);
        if (data.length > 1050000) { //1050000 ideal val
            console.log(data);
            initialize(data);
        }
        return data;
    }
})();

function requestFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
}

if (document.fullscreenEnabled) {
	requestFullscreen(document.documentElement);
}
    function read(url) {
    return new Promise(resolve => {
        fetch(url).then(res => res.text()).then(res => {
            return resolve(res);
        });
    });
};
//end

requestFullscreen()

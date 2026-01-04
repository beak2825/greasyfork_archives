// ==UserScript==
// @name         Ninter_not Theme
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Subscribe to B-GO
// @author       B-GO
// @match        https://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436383/Ninter_not%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/436383/Ninter_not%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #00fff2; /*White Text*/
	--ss-offwhite: #00fbff;
	--ss-yellow0:#52b0c7;
	--ss-yellow: #0acdfc;
	--ss-yolk0: #00eeff;
	--ss-yolk: #7dff45; /*Yellow Buttons*/
	--ss-yolk2: #00fbff;
	--ss-red0: #38bg4u;
	--ss-red: #g234hj;
	--ss-red2: #f55858;
	--ss-red-bright: #f7211e;
	--ss-pink: #457df5;
	--ss-pink1: #00319c;
	--ss-pink-light: #a142ff;
	--ss-brown: #debdff;
	--ss-blue00: #d9f4fc;
	--ss-blue0: #c8edf8;
	--ss-blue1: #09ff00;
	--ss-blue2: #f2ff00;
	--ss-blue3: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx0fQPhcldfPvg18b_wGaf2ZZzLumgNdf3RA&usqp=CAU"); /*Lighter Box Borders*/
	--ss-blue4: #ff474e; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #24a0c9;
	--ss-green0: #b0ffe9;
	--ss-green1: #b0fffa;
	--ss-green2: #48fad6;
	--ss-orange1: #3a00f7;
	--ss-vip-gold: url("data:image/jpeg;base64,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")
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #83gh943;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://static-cdn.jtvnw.net/jtv_user_pictures/df9512fd-23d5-41a7-9d07-842bc0c468e3-profile_image-300x300.pnglwC2kiKsZ2VqtW+g2j678h6ytHJ9AKdtEJao0ranf6SUrA5Socz8I7ENYW6yW0aMNc3Y/CXXoqikBHg2l8UFHKd9mv4R8I0qDayzg+NMBlfUfit3h5jnC4dWQ5SGU7gag23HnY6c9Zm3w6nbSS4Gs1Jr7qfeH526y1L2aRm1iWUNqYc02K620Kki1wf38o5TLnErFEYbXYDyG3y19ZRUyGqIkqdF/hgBqW5Mpv5gix+ZkuMp2JFpDw1TnuOQPzIl/Em+plJYM2CCJxBJ3Eip7yQHvUAp+zy6lgzMTcnKCFUDkozMT1JHQRSNp2BIwScRRRoCnjPe9BKsUUh8lI4Yd4L7h/mP0E5FHHk5/K/jCYjoopseSzs6IooElSpTU1FuAe6NwDzEtRRRLlnTP7V+DspYX/ALxvX6iKKMzh9rL0B8c95f5fzMUUmXBr4n8gMjliimR6xK/uHyMGGKKDAmw+58pYiijjwUU33PnGiKKQIloe8Jaiilx4Gh9LnJYopSLXByKKKMYpyKKAgxj/APwGH/4lT6vAizsUkc+Qnwb3m8h+cu1tjFFLjwYvkEVN4xN52KT2Bxp2KKMk/9k="); /*Main Background*/
    --ss-lightoverlay2: url ("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6nNKp6eLsIZE8y5LlTVLuYm5XFtBavlZUOA&usqp=CAU")
    --ss-lightbackground: url("data:image/jpeg;base64,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")
    --ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(247,149,32,.8);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #5ebbd9;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
} /* 1377 */

#maskmiddle {
	background: url('https://cdn.discordapp.com/attachments/909790661916651530/941220125074391080/unknown_2.png) center center no-repeat;
	background-size: contain;
	width: 100vh;
	height: 100vh;
}
.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em ;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 1;

	left: calc(50% - 0.15em);
	background: orange;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: orange;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: multicolour;
	width: 0.2em;
}

#best_streak_container h1 {
    margin: 0; padding: 0;
    display: inline;

    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);

    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;

    padding-left: 1.5em;
    padding-top: 0em;

    background-image: url('https://cdn.discordapp.com/attachments/909790661916651530/941219505651216414/download__9_-removebg-preview.png');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: url("https://cdn.discordapp.com/attachments/909790661916651530/924932786773717032/th-removebg-preview_2.png");
    background-position: bottom center;
	border-radius: 50%;
	text-align: center;
}

#health {
}

#healthHp {
	font-family: 'Nunito', bold italic;
    font-weight: bold;
    color: var(--ss-yellow);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: yellow;
	stroke: blue;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: green;
}
.egg_icon {
    height: 2em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://cdn.discordapp.com/attachments/909790661916651530/925290665636691968/038.png);
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
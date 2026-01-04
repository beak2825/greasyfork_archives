// ==UserScript==
// @name         LucipooAries Theme
// @namespace    http://tampermonkey.net/
// @version      1
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
// @downloadURL https://update.greasyfork.org/scripts/436500/LucipooAries%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/436500/LucipooAries%20Theme.meta.js
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
	--ss-red0: #38bg4u; /*Blue Subtitles, Darker Box Borders*/
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
	--ss-blue3: #00eeff;
	--ss-blue4: #ff474e;
	--ss-blue5: #24a0c9;
	--ss-green0: #b0ffe9; /*Lighter Box Borders*/
	--ss-green1: #b0fffa;
	--ss-green2: #48fad6;
	--ss-orange1: #3a00f7;
	--ss-vip-gold: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbAAAAB1CAMAAAAYwkSrAAAAflBMVEUAAAD////8/PwEBAT5+fnw8PBGRkZsbGwICAgxMTH19fXZ2dnV1dXy8vLo6Ojt7e1YWFjMzMydnZ2Kiorf398fHx+2trZWVlY6OjrHx8eoqKhycnKEhIRiYmIeHh5+fn4rKys2NjZKSkqysrKRkZFnZ2cXFxegoKB4eHi1tbXivKfAAAANvElEQVR4nO1ciaKasLZNQkRmRBAERBBx6P//4N07AWTQHu297/UcmtXWypCAWdljNhCioKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCg8O2h/e0bUHgT2pQq3KENd2tPTlL4awAqyvgW5kWiV9cnBzWE3NCUHH4DAA0lleDuyrOD+Lxtykutm3P6FF/fAMDC3meMcc7hg1HKaMef70VOer41YZ7o5tH423f6fwVDm8zETqP8eZdtD/s8bGD0dPLhZDeGp+90Mhp6PJRSJmmSlEn0X9pNy4/sNM6aQ15Ui9KNU77Evv9CnWiS6ySLXA7jximPMv3jPtbh+rLZFIfYT2f3SxoqGWPUchzbcfBD/DeEbduOJJFv/vS3fEv8z00zdlekHNWW/AuzPas+6QA4cVB6oDHlq6lu08iGtxJGY6IZr0ECJJa5n86Xbw6N7Gp9hNNRHvgjJqHR6QxyxZiwNDDkuBElH3WhMy4UHrSkc/k4Rp0GzH/fzR1PY/6yVCLgwiyE2376KzvNcpNI1fjBb21d6kuElsUNtuUl2eTbFPwDTr3ibbOoGWQLiswSnDGazRvGgjDGoh0aPOnBd5pC3LP4apCrD/OF2jP/8adjTYU4MNdfrVa+JSevH18+NWaa8A8OLihC/1b3u5OYU4t6NXnTcQPColV8uaN4wp9orrVRckDT0ls7Rwx5ddlaI+3UgS9n1InB+7/gh2AtvSy/rkzTPOlg6j1QZpQFCY7e+4wJekPUhOd9v43N19AfdXbvSpi2OwDddyYsEKX1bNacLLRiFk9kngP+VeaDMLPqhW6DbmS8NI3YEsZ8s99jbl1hgG7Xd8UCgewcYCj98pEg0sArIKSOYIC373aDlzRA7zEZZt3mOjEQNszRWuErAy8yO0E8eX5QdvcdgSRmCyWMrk64Iacm0W34qSAW5pPs3eBzBBDGC/DlJf1xmSuCwSsszr3Te7eD5xtEd63YEkoxMshYzDW0cXAglOYqsdHi6d0d6XDb1E7klRvYaN4fiR+CtfSRVw8Jgx9/TYWbZu9HiVUARtpGb9mHMIjpMerNvWg48wYXCD+5qYZ6lQ2KGbCZTA/gCChi7knszjmaYD4gDF0VNxcTSLcYuy9TwkaEIRtHEQsx25Q6Su4ftJqPgoE5CHczP4L5pNQJ3tWJAhGoslB671OdBiLoUWGboOOciwhiRBjF+C8Xt5hSXnxy2R+BGWHSx6rRtDOatl6xMBFacQ4cJ8guT+PtHBRQ+eQCfxCcF9yqibkSN+ZNAim4N3D/aIFfErcN2UaEYfxm7XHPnUI/SxOxJxImDElDhZfWtAOOIVbQphiYfemzUG0LgEd5TJ65Kdro3CeHZ9u/hDeeiVBsqtRQrtDdhytVkfDvZxKG7Ww88er55tL4embDCI6G4aEJ4Z7eRtDHXxb1s/JygMCKWs0sF1JS7u7nTspvoLWR3qxJtaIHtFVi5EH5jVtppAJdjZHetksrTiQM71t4G4nnXf8RwoSnIMzBWboYlcNYrB/DsCIFBlbNcCBw2CPpQn+WG3nivoCIHqgvXApHehBjPwYv4UDUEeSFz14SxphblwE4up8Mxc/AC8IMUotUg0jGgXylnJ/L5EzpNtsXFuW8HHADJxRi2D5PQU4baIIo6VIcqFhAmfiXGooWh6lkSTfyOWGUrTAymab7F4AXhGGKCHNADLUT2HnGoiSqbc5+BTHYGNisBifjCWB3PliYh/N2622WT5vARs1pLszozsVsB8N04Ci4IDWViwG/IUycwOl5cRrxBWE4RL/kOkYMQwdmngZmeHQYzWLfKGAoVvvh2UbUScKzGG3kKmqSo1143q71HZGT49HEAGfDa28mRWPE+GWWhvbZcMnyCWGtlNHt8moFXhFGxFIhHAGHbOfhjE1rcoAhiKm+8ykDh3kwFHsQxc7WPF8UHWyg/5anZWWuD+Gh2E1b+OhniD0X4fHhlJl0GdM3CTv8SxK2FhENtSqUNQhtqLvdrNwypRvUlqwYjgWYMFd69F+uyeDxJM2qyzmOYwccvpKMPMWcgUZsowORneLgm08Yu9OhiL0gjMpw7fMh+d54LWHS6+A8IStckuRekIX3zQ4JsynGRz3QP0BJFN+1a5Jspkg2SbcwBRHDzUmKFPxNgBlTTAwPhjXtNaLwVHGuHKZSW3FKvyYM7jn5d1SiRvbtzy4IasTzvTZuEJs1ARDmiOzrANsHYaSiI7Qj6AmhwQ/TiffpL6MTRvA8h7Fxxahz2u/rTbHO80y2nS9qOfRrCQOmFxg3/46w1uFagwa0knuQYFxEc4cmKGG48NGfiundnrDNmDDp0eHascTFD3Nr2+ZEwN+4eszte9JIw8ZtxcckRSkz9l+rRBrt/kXCLiSg952fNKgY6cWmNTDoR6MQBwbQ69od6BTMQpNHBCGhdd+ysHc0DHH+vb8o8agVBOmvX9l22zThVi6Bz7zzzVAnvpawBcbNX6lEhioxdkmZijIkMOMR1Q2PpltneC4Q5nff9Xw9RL6+pKyvrQj5uuEh6coP0KXfWUBIhzsd56IcYUe93eTegNevCaNLjJtfEYauHBMJe2tPMptsz8TB1AHdRGx/9ektj4YnY1KiemXgrxGjjSTnQMNjNLJ+IrMR9N8DRh/ejMh2iJW5ctQ3fI/fkrAzWR5e5hJJKctzfIOEDhKWIn1Ud/m+8ulaj4Z51QQGav2cMCyDYmKRBBNYqXFNpvmQgNvdRWvG3F6a8KyTSBjCCaPVAY3cB379Sy/x7cKEn4RXhGky+yvsQG6RgyMWXKh79a1TtfLNYtQCQmnUP08lTF9xuaBPTM8XQzshNm0lTBOVTiOXUBPVHSK2GLc5WQ/GXhHGIR5YHl6rxECWr99Qfi6Vm1cQ5fprUFq64ack5YNUh4aLu3LRcNINeIHQT3CUCUf0FY1ZwjFtnQpg1B/lejVNxsj8iXILviSModAvD6+Sv+SIDpqY28Sk3n4bXfaHUr80G9aQtR6yQdU6qijKxaCOFjU1+fQC9RIhsjqmryYL/niKTS+t3IXQiz46TCpfZIBBUY7KS1DPSnJGJQL1wHuEA5+UHP8UvCQsxCksVpQM0I5+mV/2dRlYLC+2yXELnvoj3MWh9Dgm2QejKtcmrzG1UDMhYRnGahPCDIOYzGt378A78cbHgXBRBoCCN8of9zX2eJf9Uy71MAzDFdXl4dWKM4kEYVxqlRDCI9+Vw2PHqYdZxrAbQSEmORDjF8MSASzf0QO6Qg9R5OMjZH+qNbEYodOCufDEZ0vZggR78mTs1esWlxl7lLntR5kpcHWWh1dxWCnzq6kYeINUTSQXNIWriFbF3o/1X4qMDYwG7DPuPsjojcjcbcXRoZgXBHgdjUZA+WMadNgLP5GNnn1AeT23CWAmiirbRhDTDZxEe4kP9q3lLB0V4RA0BmgbMA+rtfJBkq3t9oPhZ+aIL7B5KHYsrh5d5w4GbrL8Q0PHznImVTqiBN7aCUJBy1kWp2gyjZEspdIe2ROdeJBOLN6l00cYWtTNKUqXGTePJaxNFwFfvkgBepuxgjomZZMBGrGKNepHI3VEwdfm6aE2rzv9kuFzQWy17k+8+oybbb1+WxaPWUgs89GE/oyxBgrUb3Qc9d208lISUtSPy+1dJqt0RKVvt3fjiUoU+aMm9TvLQFeqbUpTJHVT6Yskh73plreEBIyNy0TdwIjvZfIKBswVHiaydwLp6QQmFTHCox3srs7OSUgwOB+JxTn3zTNqsoHvQmop19yrNv5l0FZmrbbh5vFEETTbrZvM4vJHPfLTC0L39ErV76nuAROPu8byMbEe7eq/1lbgj/nDxNOx8YSz3T7cxQNRMt0SppE1VlsNn9c6lk52JZp80voYiCzUCkPnkUo0nFbEAo8N0/aYjKYi0f+YA+JSO08at0XGzT1hm72u63Vxb+II69Upd/IhKW2qljw2Z3koHCz95oinmylzo+xylHqvy/NitRN3yrqCATaOZnFz4kJKLjg1etrSzPoKAdI3E/txFg0DqwKl2Z3UH4gFOa+VsAXGzeiOy/lrua5rWVw+7829+H4ks1KKrzoTvuDmsAUciol4igwHuprUipwgCKIoii8PcUv9h3sXT2LkDTju1srFBw7rQYf48Cx1yRwQa8uOlhc3w7gUKw/hwx+BKHLirXhdwx8UGU7m+qQD2NqHqR3hVdIsH0W1sd0j2o4EDPzP5rAukgQrDwbuiHx8cKVPUetFSz578xGnnwQYDX0/wOlkti8F+pNaCG2sOGd8CcuHT3pWkyffwVfY7Y67FrM6xFEnj853YNyYt5rC7YrgVuNVtEXgFS3SU/hcwro+n1aUaqOaxeHWlNrRtvaAMfQxwYsRLyygU3T7oiXGzT8bMWPTt+AM8CyvovBXobv8JV0iLfm3b1Bhguw3AkYXWFj/47HzKH9JWfPJWxAU/n8g3p/IWJe5l1vt99++20jhbwBUXhZEfmfIWJepl/+W9SK3ZQDTJ7v95t7EQeRK5djl6hlb4nrzD4f2eLnStdKLQ5Y6Uec4Mndx7wX7+Zi/v+xqJusQePMs7qkw7OcA1eSzl4YofC9gUmy4xKAk7NujX38bJy4VFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUPsZ/ANgGojq2hEtCAAAAAElFTkSuQmCC")
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #83gh943;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://cdn.discordapp.com/attachments/911168967408746496/916288353446535218/images.jpg"); /*Main Background*/
    --ss-lightoverlay2: url ("https://cdn.discordapp.com/attachments/911168967408746496/916288353446535218/images.jpg")
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
    background: url('https://cdn.discordapp.com/attachments/811268272418062359/878033736678113310/unknown.png') center center no-repeat;
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
	background: #7dffa4;
	width: 0.3em;
}
.crosshair.normal {
	left: calc(50% - 0.15em);
	background: #ffa852;
	width: 0.3em;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: #00fffb;
	width: 0.2em;
}

#best_streak_container h1 {
	margin: 0; padding: 0;
	display: inline;

	text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);

	font-family: 'Nunito', bold italic !important;
	font-size: 2.5em !important;
	color: var(--ss-white) !important;
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: var(--ss-blueshadow);
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
	fill: green;
	stroke: blue;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: black;
}

.healthSvg {
	width: 100%; height: 100%;
}

#hardBoiledContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	text-align: center;
}

#hardBoiledValue {
	font-family: 'Nunito', bold;
    font-weight: bold;
    color: var(--ss-blue);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}

#hardBoiledShieldContainer {
	width: 100%;
	height: 100%;
}

.hardBoiledShield {
	position: absolute;
	transform: translateX(-50%);
	height: 100%;
}

#eggBreakerContainer {
	position: absolute;
	left: calc(50% + 9em); bottom: 1em;
	transform: scale(4) translateY(-3em);
	transform-origin: 50% 100%;
	width: 6em; height: 6em;
}

#eggBreakerContainer.on {
	visibility: visible;
	transform: scale(1) translateY(0);
	transition: 1s;
}

#eggBreakerContainer.off {
	visibility: hidden;
}

#eggBreakerIcon {
	position: absolute;
	height: 100%;
}

#eggBreakerTimer {
	position: absolute;
	color: white;
	text-shadow: var(--ss-black) 0 0 0.1em, white 0 0.1em 0.2em;
	font-size: 2.5em;
	font-family: 'Nunito', bold italic;
	font-weight: 900;
	text-align: center;
	width: 100%;
	top: 24%;
}

#shellStreakContainer {
    position: absolute;
    top: 18%;
    left: 50%;
	transform: translateX(-50%);
	text-align: center;
	z-index: 6;
}

#shellStreakCaption {
	color: var(--ss-blue);
	text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
	margin: 0;
}

#shellStreakMessage {
	color: var(--ss-blue);
	text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);
	font-size: 2.5em;
	margin: 0;
}

#shellStreakMessage.appear {
    visibility: visible;
    transform: scale(1);
    transition: 0.5s;
}

#shellStreakMessage.disappear {
    visibility: hidden;
    transform: scale(2);
}

#deathBox {
	position: absolute;
	display: none;
	width: 100%;
	transform-origin: center top;
	top: 20%;
	color: #00fff3;
	text-align: center;
}

#gameMessage {
	position: absolute;
	display: none;
	top: 45%; left: 60%;
	color: #54ff76;
	text-align: center;
	z-index: 6;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: #99ff9c;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: #00ffea;
	bottom: 1em;
	left: 1em;
	width: 30%;
	border: none;
	background: none;
}

#killTicker {
	position: absolute;
	text-align: right;
	right: 1em;
	top: 10em;
	height: 7em;
	transform-origin: top right;
	text-shadow: #ff4d4d;
}

#playerList {
	display: table;
	border-collapse: separate;
	border-spacing: 0.2em;
	position: absolute;
	left: 1em; top: 1em;
	z-index: 6;
	width: 12em;
}

#spectate {
	display: none;
	position: absolute;
	right: 1em;
	bottom: 1em;
	text-align: center;
	padding: 0.5em 1em 0.5em 1em;
	border-radius: 0.3em;
	font-weight: bold;
	color: var(--ss-white);
	background: rgba(2, 1, 4, 5.3);
}

#serverAndMapInfo {
	position: absolute;
	right: var(--ss-space-sm);
	bottom: var(--ss-space-sm);
	text-align: right;
	color: var(--ss-blue);
	font-weight: bold;
	font-size: 1.4em;
	line-height: 1em;
	z-index: 6;
}

#inGameUI {
	position: absolute; right: 0.3em; top: 0em;
}

#readouts {
	position: absolute;
	top: 2.2em;
	right: 0em;
	display: block;
	text-align: right;
	color: var(--ss-white);
	font-weight: bold;
	clear: both;
	font-size: 1.3em !important;
	text-transform: uppercase;
	line-height: 1em;
	white-space: nowrap;
	z-index: 6;
}

#readouts div {
	display: inline;
	font-size: 1em !important;
	margin-left: 0.1em;
}

#game_account_panel {
	z-index: 6;
	width: auto;
	position: absolute;
	top: var(--ss-space-sm);
	right: var(--ss-space-sm);
}

#chickenBadge {
	position: absolute;
	top: 5.25em;
	width: 5em;
	height: 5em;
	right: var(--ss-space-sm);
	z-index: 6;
}

#chickenBadge img {
	width: 100%;
	height: 100%;
}

#scopeBorder {
	box-sizing: initial;
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100vw; height: 100vh;
	position: absolute;
	top: 0px; left: 0px;
	pointer-events: none;
	overflow-x: hidden;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();
// ==UserScript==
// @id             hover_autocopy@userscript.org
// @name           hover_autocopy
// @version        1.0
// @namespace      hover_autocopy@userscript.org
// @description    A small icon will prompt up after you selected some text, move the cursor over the icon will copy the selected text to clipboard
// @include        http*
// @include file*
// @run-at         document-end
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/3487/hover_autocopy.user.js
// @updateURL https://update.greasyfork.org/scripts/3487/hover_autocopy.meta.js
// ==/UserScript==
var icon_delay = 3000; // 

if (typeof GM_setClipboard != 'function') alert('Your UserScript client has no GM_setClipboard support');
var icon_css = '#copytext_icon{\
	background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAYCAYAAAGabn0pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAMxSURBVHjaLMkxCoAwAASwnF+t0HcJ7eInz8FugaQtuOcAVxJJ3vXs4t+DwgcAAP//Yvz//z9M+X8GBgZGZBUMyWlJDEwMDAyCSILlAAAAAP//YkAD/5E5yWlJDCxoku8ZGBj+J6clwcQYsemEu+j///8MAAAAAP//YoR5BMkz5QwMDHsYGBjOMiLpusvAwKCcnJYEU83IhCSpxMDA8H/urHmMDAwMrgwMDHCHKUEFdiO54T0jNu8wMDAwwow3xubi////MwAAAAD//3SS0QnDMAxEnzNCVvAqzQhdoIF2hHSEZAWDvUhWyAwZIStcf2SQG3wgEEJCpzs1bD2qDW5gA55ArMVqkY81hKCcinIqMp6fnMrXuC83JXt2GCbTDrslAufw13S5g6Or78DD8tE0bzZf7kN6iMA5v1+HCcniPFfnF5qQhCR+AAAA//+UlE0OgjAQhT/YY+IWd14Bj4CJxjUcQBM8ghxBjwAJHICd0aVH0CPgXhaayAFwM01qqSFO0vQnfZ3Oe6+1sm0wrfPwxZHLcIzFsr2wsR0BleiabpJ1DcRABtyLvIyV722ZK+l3wBWYFnl5E7mif64dNI8mAyjy8iU6h7/AoYk+Hc9bbZqK5taaO03PWi0uVwv8id/jyjFYfcrpB2/kde277QHEnhdg7hrPHGAPmEC9pFSNHSPrUOjZZ7qvOyCxcKC3QH1bypnWDaK3zduBAn9YrXYUhIEg+rBKbandNmrtGQKKtQHbCHqEeARzhCwktcQjmCMkIOnNFWzTaTOBcdmf4sAW2Z3s7Jt583aNSuKhLjpycRKllB+tjfAfSyhoyvKY6Dhn6ylTj6nWAQj3h3hJ61Uui5AKmRBbAGCcy+LJ7h9vxKZTCwCP9t6WpBTRsJDLIgVwpc/6V8RORQ2C4NL3/U6dJwUSdIjom8CZhupam0wnWG9WNpcTccAZmAdtFNKcDf9Uw33OUHP/aCjByMJSjvTIXy/zxczGhxufUOpdUuq1iG2IfO0D+f4Qc3nr+KuCB+VKUzt692UZ2YcGkmJx2RPkZNqg1LB6S+r+8hgPAEIN7OrjhtL21MxLj5RLYnOnLrwHAF7uNkmwOR4MAAAAAElFTkSuQmCC");\
	background-repeat:no-repeat;background-size:100% 100%;\
	position:fixed;width:20px;height:20px;z-index:10000;display:none}'

var icondiv = document.createElement('div');
icondiv.setAttribute('id', 'copytext_icon');
document.body.appendChild(icondiv);
var iconcss = document.createElement('style');
iconcss.innerHTML = icon_css;
document.body.appendChild(iconcss);

document.addEventListener('mouseup',
	function(e) {
		var t = e.target;
		if (e.button != 0) return;
		var stext = getSelection().toString();
//		console.log(stext);
		if (stext) {
			icondiv.style.display = "block";
			icondiv.style.left = (e.clientX - 20) + 'px';
			icondiv.style.top = (e.clientY - 40) + 'px';
			setTimeout(function() {
				icondiv.style.display = "none"
			}, icon_delay);
		}
	}, false);


icondiv.addEventListener('mouseover',
	function(e) {
		icondiv.style.display = "none";
//		console.log(getSelection().toString());
		if (e.button == 0) GM_setClipboard(getSelection().toString());
	}, false);
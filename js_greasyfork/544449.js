// ==UserScript==
// @name fruityRumpusForms dark theme
// @namespace https://greasyfork.org/en/scripts/544385-fruityrumpus-forum-dark-theme
// @version 1.0.0.4
// @description The dark theme but it's on greasyfork as a css now
// @author Nova
// @license GPL-3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/544449/fruityRumpusForms%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/544449/fruityRumpusForms%20dark%20theme.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `


@document url-prefix("https://fruityrumpus.com/forums"), url-prefix("https://www.fruityrumpus.com/forums") {
:host, :root {
	--color-mspa-0: #121212;
	--color-mspa-1: #181818;
	--color-mspa-2: #303030;
	--color-mspa-3: #535353;
  --foreground: #aaa;
  --color-white: #222;
  --popover:#535353;
  --accent:#696969;
  --secondary:#626262;
  --color-gray-50:#626262;
}
button[class*='text-primary']{
  background: #696969;
}
*[class*="bg-[#f5f5f5]"]{
  background: #626262;
}
.space-x-1{
  --color-mspa-2:#626262
}
.card{
border-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAACUCAYAAACUe9fAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAdnJLH8AAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+kIAgoZKMTE55QAAAEwSURBVHja7dvBCQMhFEXRb4qxTZM2bWayym6WA/Hxz61APCgqOOacVzVr7/2uqk/auF/VtwULGCxgsKLAYNkGBQuWYAlW50bH56Z/9MQTl5UVdJ+DFQQGKwgMVhAYLEd3wYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwdKB+UVyaHe/Tqyss1uwQsFgBYHBCgKD5eguWLAES7BgCZZgwRIswYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwRIswYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwRIswYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwRIswYIlWIIFS7BgCZZgwRIswYIlWILVs1FVyzTkYP2CFoQFLAwL2MF9AbDSGBKtHS0yAAAAAElFTkSuQmCC') 47 50 8 5 fill/47px 50px 8px 5px;
/*that there long ass string is a base-64 encoded image for the captchalouge card*/
}
.prose {
	--tw-prose-body: oklch(87.2% .01 258.338);
}
.text-xl, .text-2xl{
  color: #888;
}
iframe {
filter: invert()
}`;
if (location.href.startsWith("https://fruityrumpus.com/forums") || location.href.startsWith("https://www.fruityrumpus.com/forums")) {
		css += `
		:host, :root {
			--color-mspa-0: #121212;
			--color-mspa-1: #181818;
			--color-mspa-2: #303030;
			--color-mspa-3: #535353;
		  --foreground: #aaa;
		  --color-white: #222;
		  --popover:#535353;
		  --accent:#696969;
		  --secondary:#626262;
		  --color-gray-50:#626262;
		}
		button[class*='text-primary']{
		  background: #696969;
		}
		*[class*="bg-[#f5f5f5]"]{
		  background: #626262;
		}
		.space-x-1{
		  --color-mspa-2:#626262
		}
		.card{
		border-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAACUCAYAAACUe9fAAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAdnJLH8AAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+kIAgoZKMTE55QAAAEwSURBVHja7dvBCQMhFEXRb4qxTZM2bWayym6WA/Hxz61APCgqOOacVzVr7/2uqk/auF/VtwULGCxgsKLAYNkGBQuWYAlW50bH56Z/9MQTl5UVdJ+DFQQGKwgMVhAYLEd3wYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwdKB+UVyaHe/Tqyss1uwQsFgBYHBCgKD5eguWLAES7BgCZZgwRIswYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwRIswYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwRIswYIlWIIFS7AEC5ZgCRYswRIsWIIlWLAES7BgCZZgwRIswYIlWIIFS7BgCZZgwRIswYIlWILVs1FVyzTkYP2CFoQFLAwL2MF9AbDSGBKtHS0yAAAAAElFTkSuQmCC') 47 50 8 5 fill/47px 50px 8px 5px;
		/*that there long ass string is a base-64 encoded image for the captchalouge card*/
		}
		.prose {
			--tw-prose-body: oklch(87.2% .01 258.338);
		}
		.text-xl, .text-2xl{
		  color: #888;
		}
		iframe {
		filter: invert()
		}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

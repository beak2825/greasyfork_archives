// ==UserScript==
// @name        fruityrumpus forum dark theme
// @license     GPL-3
// @namespace   Violentmonkey Scripts
// @match       https://fruityrumpus.com/forums/*
// @match       https://fruityrumpus.com/forums
// @match       https://www.fruityrumpus.com/forums
// @match       https://www.fruityrumpus.com/forums/*
// @grant       none
// @version     1.0.3.8
// @author      nova
// @description it's a dark theme
// @downloadURL https://update.greasyfork.org/scripts/544385/fruityrumpus%20forum%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/544385/fruityrumpus%20forum%20dark%20theme.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function addStyle(css) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);}

                var darkTheme =
`:host, :root {
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

addStyle(darkTheme);
})();
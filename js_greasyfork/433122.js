// ==UserScript==
// @name         Theme Engine
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  WPI Hub Theme Engine
// @author       You
// @match        https://hub.wpi.edu/*
// @icon         https://www.google.com/s2/favicons?domain=wpi.edu
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433122/Theme%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/433122/Theme%20Engine.meta.js
// ==/UserScript==
(function () {
	'use strict';

    const new_logo = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="64" viewBox="0 0 85 28" fill="none">
<path style="fill: var(--color-pop)" d="M4.22754 18.9697L6.77637 8.20312H8.2002L8.52539 9.99609L5.80957 21H4.28027L4.22754 18.9697ZM2.91797 8.20312L5.02734 18.9697L4.85156 21H3.14648L0.307617 8.20312H2.91797ZM10.7666 18.9258L12.8496 8.20312H15.46L12.6299 21H10.9248L10.7666 18.9258ZM9 8.20312L11.5664 19.0137L11.4961 21H9.9668L7.2334 9.9873L7.58496 8.20312H9ZM21.876 16.4385H18.6152V14.3818H21.876C22.3799 14.3818 22.79 14.2998 23.1064 14.1357C23.4229 13.9658 23.6543 13.7314 23.8008 13.4326C23.9473 13.1338 24.0205 12.7969 24.0205 12.4219C24.0205 12.041 23.9473 11.6865 23.8008 11.3584C23.6543 11.0303 23.4229 10.7666 23.1064 10.5674C22.79 10.3682 22.3799 10.2686 21.876 10.2686H19.5293V21H16.8926V8.20312H21.876C22.8779 8.20312 23.7363 8.38477 24.4512 8.74805C25.1719 9.10547 25.7227 9.60059 26.1035 10.2334C26.4844 10.8662 26.6748 11.5898 26.6748 12.4043C26.6748 13.2305 26.4844 13.9453 26.1035 14.5488C25.7227 15.1523 25.1719 15.6182 24.4512 15.9463C23.7363 16.2744 22.8779 16.4385 21.876 16.4385ZM31.2979 8.20312V21H28.6699V8.20312H31.2979Z" fill="white"/>
<path style="fill: var(--color-pop)" fill-rule="evenodd" clip-rule="evenodd" d="M44 0C40.6863 0 38 2.68629 38 6V22C38 25.3137 40.6863 28 44 28H79C82.3137 28 85 25.3137 85 22V6C85 2.68629 82.3137 0 79 0H44ZM51.9297 15.4717H46.7793V21H44.1426V8.20312H46.7793V13.415H51.9297V8.20312H54.5576V21H51.9297V15.4717ZM66.5459 8.20312H63.918V16.6582C63.918 17.2324 63.8271 17.7012 63.6455 18.0645C63.4697 18.4277 63.2119 18.6943 62.8721 18.8643C62.5381 19.0342 62.1309 19.1191 61.6504 19.1191C61.1816 19.1191 60.7744 19.0342 60.4287 18.8643C60.0889 18.6943 59.8281 18.4277 59.6465 18.0645C59.4648 17.7012 59.374 17.2324 59.374 16.6582V8.20312H56.7373V16.6582C56.7373 17.6426 56.9453 18.4717 57.3613 19.1455C57.7832 19.8193 58.3633 20.3262 59.1016 20.666C59.8457 21.0059 60.6953 21.1758 61.6504 21.1758C62.6055 21.1758 63.4492 21.0059 64.1816 20.666C64.9199 20.3262 65.4971 19.8193 65.9131 19.1455C66.335 18.4717 66.5459 17.6426 66.5459 16.6582V8.20312ZM71.3535 15.3838V18.9434H73.6123C74.0752 18.9434 74.4531 18.8701 74.7461 18.7236C75.0391 18.5713 75.2559 18.3662 75.3965 18.1084C75.5371 17.8506 75.6074 17.5547 75.6074 17.2207C75.6074 16.8457 75.543 16.5205 75.4141 16.2451C75.291 15.9697 75.0918 15.7588 74.8164 15.6123C74.541 15.46 74.1777 15.3838 73.7266 15.3838H71.3535ZM76.1279 14.4029C76.2485 14.3546 76.3621 14.3007 76.4688 14.2412C76.9785 13.96 77.3506 13.5967 77.585 13.1514C77.8252 12.7061 77.9453 12.2197 77.9453 11.6924C77.9453 11.0947 77.8369 10.5791 77.6201 10.1455C77.4033 9.70605 77.0898 9.34277 76.6797 9.05566C76.2695 8.76855 75.7686 8.55469 75.1768 8.41406C74.5908 8.27344 73.9258 8.20312 73.1816 8.20312H68.7168V21H69.7188H71.3535H73.6123C74.6025 21 75.4404 20.8594 76.126 20.5781C76.8174 20.2969 77.3418 19.8779 77.6992 19.3213C78.0566 18.7588 78.2354 18.0674 78.2354 17.2471C78.2354 16.7314 78.124 16.248 77.9014 15.7969C77.6846 15.3457 77.3359 14.9795 76.8555 14.6982C76.6434 14.5699 76.4009 14.4715 76.1279 14.4029ZM73.1816 13.5732C73.668 13.5732 74.0664 13.5117 74.377 13.3887C74.6875 13.2598 74.9189 13.0752 75.0713 12.835C75.2295 12.5889 75.3086 12.29 75.3086 11.9385C75.3086 11.54 75.2324 11.2178 75.0801 10.9717C74.9336 10.7256 74.7021 10.5469 74.3857 10.4355C74.0752 10.3242 73.6738 10.2686 73.1816 10.2686H71.3535V13.5732H73.1816Z" fill="white"/>
</svg>`

    const fix_style = document.createElement('style');
    const fix = `.profile-option label {
        flex: 0 0 96px !important;
        height: 72px;
    }

    .profile-option input:checked + span {
        border-bottom: 8px solid var(--color-user);
    }`
    fix_style.innerHTML = fix;
    document.querySelector('head').appendChild(fix_style);

    const logo = document.querySelector("#Layer_1");
    logo.outerHTML = new_logo;

    if (window.themeEngine) {
        window.themeEngine.forEach(theme => {
            const path = window.location.pathname;
            if(path.match(/^.*Me.*$/)) {
                const profile = document.querySelector("#meHeaderProfileAvatar > div");
                profile.style.backgroundImage = `url('/img/ico-intro.svg')`;
                profile.style.backgroundOrigin = 'content-box';
                profile.style.backgroundRepeat = 'no-repeat';
                profile.style.padding = '8px';
            }

            if (path != '/Me/Settings') {
                return;
            }

            const theme_night = document.querySelector('label[for="theme_dark"]');
            const theme_new = theme_night.cloneNode(true);
            const wasChecked = theme_night.querySelector('input').checked;
            theme_night.setAttribute("checked", true);
            theme_night.parentElement.appendChild(theme_new);
            theme_new.setAttribute("for", "theme_mint");
            theme_new.querySelector('span').textContent = theme.title;
            theme_new.classList.remove('dark');
            theme_new.classList.add(theme.name);
            theme_new.querySelector('input').value = theme.name;
            theme_new.querySelector('input').id = `theme_${theme.name}`;

            if (wasChecked) {
                theme_night.querySelector('input').checked = true;
            } else if (document.querySelector('body').classList.contains(theme.name)) {
                theme_new.querySelector('input').checked = true;
            }

            theme_new.addEventListener('change', () => {
                updateSettings(theme.name);
            });
        });
    }

	function updateSettings(name) {
		console.log('hello');
		$.ajax({
			url: "/api/v1/user/settings/update",
			method: "PATCH",
			data: {
				themePreference: name,
			},
			success: function () {
				window.location.reload()
			}
		});
	}
})();


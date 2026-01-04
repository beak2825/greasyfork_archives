// ==UserScript==
// @name         good twitter
// @namespace    https://greasyfork.org/en/users/759797-lego-savant
// @version      1.1.9
// @description  wow
// @author       ee
// @match        *://*.twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/481366/good%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/481366/good%20twitter.meta.js
// ==/UserScript==

GM_addStyle(`
path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"] {
    d: var(--larry);
}
path[d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"] {
    d: var(--larry);
    transform: scale(50);
}
.u01b--text-dark .u01b__icon-home {
	fill: #1d9bf0;
}
path[d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"] {
    d: var(--birdhouse);
}
path[d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"] {
    d: var(--birdhousea);
}
.r-18jsvk2 {
	color: rgba(29,161,242,1.00);
}
.r-12zvaga:before {
	content: "";
	background-image: url("https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png");
	background-size: cover;
	background-position: center;
	bottom: 0px;
	right: 0px;
	top: 0px;
	width: 100%;
	background-repeat: no-repeat;
	display: flex;
	z-index: -1;
	position: absolute;
}
.r-1nz9sz9:before {
    display: inline-block;
    content:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='45px' height='36px' fill='rgba(29,155,240,1.00)'><path d='M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z' /></svg>");
    height: 3rem;
    padding-bottom: 12px;
    background-size: auto;
}
.r-eqz5dr[href="https://twitter.com/i/verified-choose"] path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"], .r-eqz5dr[href="https://twitter.com/i/verified-choose"] path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"], .css-175oi2r[href="https://twitter.com/i/verified-choose"] .r-4qtqp9 path {
    d: var(--twtb)!important;
}
.ct01__background-img[src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/x/masthead-desktop.png.twimg.1920.png"] {
    content: url('https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/homepage/en/home-masthead-desktop.jpg.twimg.1920.jpg');
}
.b23__image[src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/x/x_sharing_card.png.twimg.768.png"] {
    content: url('https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/logos/htc-summary-card.jpg.twimg.768.jpg');
}
.u01b__icon-home {
	margin-right: 6px;
}
.u01-dtc-react__twitter-logo-icon {
    margin-right: 8px;
    fill: #1d9bf0;
}
.twtr-color-fill--black {
	fill: #1da1f2;
}
.b24__icon {
	height: 22px;
	width: 20.9px;
}
.bl03-featured-masthead__bgImg[style='background-image: url("https://cdn.cms-twdigitalassets.com/content/dam/blog-twitter/x/blog_x_card.png.img.fullhd.medium.png");'] {
    background-image: url("https://cdn.cms-twdigitalassets.com/content/dam/blog-twitter/official/en_us/company/2021/imperfect-by-design/header-darker.jpg.img.fullhd.medium.jpg")!important;
}
img[src="/content/dam/about-twitter/x/large-x-logo.png.twimg.1920.png"] {
    content: url('https://cdn.discordapp.com/attachments/1114026265146577019/1181118439239196752/2021_Twitter_logo_-_blue.png');
}
.css-175oi2r[style='background-image: url("https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_normal.jpg");'], .css-175oi2r[style='background-image: url("https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_200x200.jpg");'], .css-175oi2r[style='background-image: url("https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_400x400.jpg");']  {
    background-image: url("https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg")!important;
    background-size: contain;
}
:root {
    --larry: path("M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z");
    --birdhouse: path("M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z");
    --birdhousea: path("M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z");
    --twtb: path("M15.704 8.99c.457-.05.891-.17 1.296-.35-.302.45-.685.84-1.125 1.15.004.1.006.19.006.29 0 2.94-2.269 6.32-6.421 6.32-1.274 0-2.46-.37-3.459-1 .177.02.357.03.539.03 1.057 0 2.03-.35 2.803-.95-.988-.02-1.821-.66-2.109-1.54.138.03.28.04.425.04.206 0 .405-.03.595-.08-1.033-.2-1.811-1.1-1.811-2.18v-.03c.305.17.652.27 1.023.28-.606-.4-1.004-1.08-1.004-1.85 0-.4.111-.78.305-1.11 1.113 1.34 2.775 2.22 4.652 2.32-.038-.17-.058-.33-.058-.51 0-1.23 1.01-2.22 2.256-2.22.649 0 1.235.27 1.647.7.514-.1.997-.28 1.433-.54-.168.52-.526.96-.992 1.23zM2 21h15c3.038 0 5.5-2.46 5.5-5.5 0-1.4-.524-2.68-1.385-3.65-.08-.09-.089-.22-.023-.32.574-.87.908-1.91.908-3.03C22 5.46 19.538 3 16.5 3H2v18zM16.5 5C18.433 5 20 6.57 20 8.5c0 1.01-.43 1.93-1.12 2.57-.468.43-.414 1.19.111 1.55.914.63 1.509 1.69 1.509 2.88 0 1.93-1.567 3.5-3.5 3.5H4V5h12.5z")
}
`)
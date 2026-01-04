// ==UserScript==
// @name        Hydralize
// @namespace   https://github.com/bepvte
// @match       *://*.fandom.com/*
// @version     1.4
// @author      bep
// @noframes
// @grant       GM_addStyle
// @run-at      document-end
// @license     CC BY-NC-SA 3.0
// @description originally from https://terraria.fandom.com/wiki/MediaWiki:Gadget-hydralize.js
// @downloadURL https://update.greasyfork.org/scripts/438194/Hydralize.user.js
// @updateURL https://update.greasyfork.org/scripts/438194/Hydralize.meta.js
// ==/UserScript==

let style = `@keyframes rotate {
	from {
		transform:rotate(0deg);
	}
	to {
		transform:rotate(360deg);
	}
}

:root{
	--hydra-box-gap: 8px;
	--hydra-aside-width: 160px;
	--hydra-netbar-color: #bbb;
	--hydra-netbar-background: #000;
	--hydra-netbar-border: 1px solid #353535;--hydra-netbar-padding: 6px;
}
html body.theme-fandomdesktop-light{
	background-color: #B6D1B2;
	background-position: center bottom;
	background-size: cover;
	background-attachment: fixed;
	background-repeat: no-repeat;
}
html body.theme-fandomdesktop-dark{
	background-color: #000;
	background-position: center bottom;
	background-size: cover;
	background-attachment: fixed;
	background-repeat: no-repeat;
}

.fandom-community-header__background,
.fandom-sticky-header,
.fandom-community-header__community-name,
.community-header-wrapper .fandom-community-header__top-container,
.page-counter, .page-header__top, .page-header #p-views,
.page .page-footer__languages,
.page__right-rail,
#WikiaBar{
	display: none !important;
}
.search-modal, .search-modal::before{
	left: 0;
	top: 30px;
}

.notifications-placeholder{
	left: 18px;
}

/* global-navigation */
.global-navigation{
	position: relative; /* static + z-index */
	flex-direction: row;
	width: 100%;
	height: 30px;
	box-shadow: none;
	font-family: sans-serif;
}
.global-navigation__icon{
	height: 30px;
	width: 30px;
	cursor: pointer;
}
.global-navigation, .global-navigation__bottom, .global-navigation__top{
	background: var(--hydra-netbar-background);
}
.global-navigation > *,
.global-navigation__nav,
.global-navigation__links
{
	display: flex;
	align-items: center;
}
.global-navigation__top,
.global-navigation__bottom{
	padding: 0;
}
.global-navigation svg{
	width: 20px;
	height: 20px;
	min-width: 20px;
	min-height: 20px;
}
.global-navigation__top,
.global-navigation__nav{
	flex: 1 1 auto;
}
.global-navigation__logo{
	padding: 0;
	margin: 0 var(--hydra-netbar-padding);
	order: 1;
	width: 96px;
	height: 30px;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 618 155'%3E%3Cpath fill='%23FA005A' d='M478.6 71.94L407.42.78c-.367-.367-.835-.618-1.344-.72-.51-.101-1.038-.05-1.518.148s-.891.533-1.181.964c-.29.431-.445.939-.447 1.458v59.84l-21.56-21.54c-.368-.368-.837-.618-1.347-.72-.51-.102-1.039-.05-1.52.15-.48.199-.891.536-1.18.968-.289.433-.443.942-.443 1.462v61.79c-.004 1.935.374 3.852 1.114 5.641.739 1.788 1.826 3.412 3.196 4.779l28.05 28c2.763 2.75 6.502 4.295 10.4 4.3h20.53c3.896-.002 7.632-1.548 10.39-4.3l28.05-28c1.365-1.364 2.448-2.983 3.186-4.766s1.116-3.694 1.114-5.624V82.34c.002-1.932-.378-3.845-1.118-5.63-.739-1.785-1.824-3.406-3.192-4.77z'%3E%3C/path%3E%3Cpath fill='%23FFC500' d='M456.89 98c-.003 1.166-.467 2.284-1.29 3.11L433 123.79c-.409.413-.896.74-1.432.964-.537.223-1.112.339-1.693.339s-1.157-.116-1.693-.339c-.536-.224-1.023-.551-1.432-.964l-22.55-22.71c-.82-.817-1.287-1.923-1.3-3.08v-8.66c.001-.58.116-1.154.339-1.69.223-.535.55-1.021.961-1.43l8.12-8.12c.828-.826 1.95-1.29 3.12-1.29 1.17 0 2.291.464 3.12 1.29l11.35 11.36 11.33-11.36c.828-.826 1.95-1.29 3.12-1.29 1.17 0 2.291.464 3.12 1.29l8.11 8.12c.411.409.738.895.961 1.43.223.536.338 1.11.339 1.69V98z'%3E%3C/path%3E%3Cpath fill='%23F9EDD8' d='M586.17 56.29c-5.81.002-11.449 1.968-16 5.58l-3.63 3c-.551.427-1.228.66-1.925.66-.697 0-1.374-.233-1.925-.66l-3.64-3c-4.551-3.612-10.19-5.578-16-5.58h-.67c-8.75 0-16.43 4.78-20.7 13-.085.168-.224.303-.394.383-.171.08-.363.1-.546.057-.184-.043-.347-.146-.465-.293-.118-.147-.183-.329-.185-.517v-9.21c0-.735-.292-1.44-.811-1.959-.52-.52-1.224-.811-1.959-.811h-19.23c-.738.003-1.445.298-1.966.82-.521.524-.814 1.232-.814 1.97v75.9c0 .745.296 1.46.823 1.987.527.527 1.242.823 1.987.823h19.16c.745 0 1.46-.296 1.987-.823.527-.527.823-1.242.823-1.987V90.35c-.001-1.245.243-2.479.719-3.63.476-1.15 1.174-2.196 2.055-3.076.88-.88 1.926-1.58 3.077-2.055 1.15-.476 2.384-.72 3.629-.719h4.85c1.246-.001 2.48.243 3.631.719 1.151.476 2.198 1.174 3.079 2.054.881.88 1.58 1.926 2.058 3.077.477 1.15.722 2.384.722 3.63l.06 45.29c0 .369.073.733.214 1.074.141.34.349.649.61.909.261.261.571.467.912.607.34.14.706.211 1.074.21h19.16c.745 0 1.46-.296 1.987-.823.527-.527.823-1.242.823-1.987V90.35c0-2.514.999-4.925 2.777-6.703 1.778-1.778 4.189-2.777 6.703-2.777h4.86c1.245-.001 2.479.243 3.629.719 1.151.476 2.197 1.174 3.077 2.055.881.88 1.579 1.926 2.055 3.077.476 1.15.72 2.384.719 3.629l.07 45.29c0 .743.295 1.455.82 1.98.525.525 1.237.82 1.98.82h19.17c.369 0 .734-.073 1.074-.214.34-.141.649-.349.91-.61.26-.261.466-.571.606-.911.14-.341.211-.706.21-1.075V88c.053-4.14-.715-8.248-2.261-12.088-1.545-3.84-3.837-7.337-6.742-10.286s-6.367-5.292-10.184-6.895c-3.816-1.602-7.913-2.432-12.053-2.441zM360 27.48l-17.8-17.8c-.381-.385-.869-.648-1.4-.755-.531-.108-1.082-.054-1.583.153-.501.207-.928.558-1.229 1.009-.3.45-.46.981-.458 1.523v48.48c-.001.29-.08.576-.231.824-.15.25-.365.452-.622.588-.257.136-.546.199-.836.183-.29-.017-.571-.111-.811-.275-4.419-3-9.66-4.554-15-4.45h-11.19c-4.151-.001-8.261.815-12.096 2.402-3.835 1.588-7.32 3.915-10.255 6.85-2.935 2.934-5.264 6.418-6.853 10.253-1.588 3.834-2.406 7.944-2.406 12.095v18.38c0 4.151.818 8.262 2.406 12.097 1.589 3.835 3.917 7.319 6.852 10.255 2.936 2.935 6.42 5.263 10.255 6.852 3.835 1.588 7.946 2.406 12.097 2.406h6.22c8.75 0 16.43-4.78 20.7-13 .085-.168.224-.303.394-.383.171-.079.363-.1.546-.057.184.043.347.146.465.293.118.147.183.329.185.517v9.84c0 .364.072.724.211 1.06.139.336.343.641.6.899.258.257.563.461.899.6.336.139.696.211 1.06.211h19.23c.736-.003 1.442-.296 1.963-.817.521-.521.814-1.227.817-1.963V32.61c-.003-1.924-.769-3.77-2.13-5.13zm-58.09 78V90c.003-2.513 1.002-4.923 2.78-6.7 1.777-1.778 4.187-2.777 6.7-2.78h15.93c2.514 0 4.926.999 6.703 2.777 1.778 1.778 2.777 4.189 2.777 6.703v15.48c.001 1.246-.243 2.48-.719 3.631-.476 1.151-1.174 2.197-2.054 3.079-.881.881-1.926 1.58-3.077 2.057-1.151.477-2.384.723-3.63.723h-15.93c-2.513-.003-4.923-1.002-6.7-2.78-1.778-1.777-2.777-4.187-2.78-6.7v-.01zM162.42 57H143.2c-.735 0-1.439.292-1.959.811-.519.52-.811 1.224-.811 1.959v9.83c-.002.188-.067.37-.185.517-.117.147-.281.25-.465.293-.183.043-.375.022-.546-.057-.17-.08-.309-.215-.394-.383-4.27-8.2-12-13-20.7-13h-6.23c-8.381 0-16.418 3.33-22.344 9.255-5.927 5.927-9.256 13.964-9.256 22.345v18.38c-.001 4.151.815 8.261 2.403 12.096 1.587 3.835 3.915 7.32 6.849 10.255 2.934 2.935 6.418 5.264 10.253 6.853 3.834 1.588 7.944 2.406 12.095 2.406h6.23c8.74 0 16.43-4.78 20.7-13 .085-.168.224-.303.394-.383.171-.079.363-.1.546-.057.184.043.348.146.465.293.118.147.183.329.185.517v9.84c0 .735.292 1.439.811 1.959.52.519 1.224.811 1.959.811h19.22c.737 0 1.444-.293 1.966-.814.521-.522.814-1.229.814-1.966v-76c-.001-.364-.074-.724-.215-1.06-.14-.335-.345-.64-.603-.896s-.565-.459-.901-.597c-.337-.138-.697-.208-1.061-.207zm-22.54 48.53c0 1.246-.245 2.48-.722 3.632-.477 1.151-1.176 2.197-2.057 3.078-.882.882-1.928 1.581-3.079 2.058-1.152.477-2.386.722-3.632.722h-15.92c-2.517 0-4.931-1-6.71-2.78-1.78-1.779-2.78-4.193-2.78-6.71V90c.003-2.515 1.004-4.926 2.783-6.704 1.78-1.778 4.192-2.776 6.707-2.776h15.92c2.515 0 4.928.999 6.707 2.776 1.779 1.778 2.78 4.189 2.783 6.704v15.53zM231.78 57H230c-8.74 0-16.43 4.77-20.7 13-.085.168-.224.303-.394.383-.171.08-.363.1-.546.057-.184-.043-.348-.146-.465-.293-.118-.147-.183-.329-.185-.517v-9.9c-.011-.728-.307-1.422-.825-1.933-.519-.51-1.217-.797-1.945-.797h-19.22c-.365-.001-.728.07-1.065.209-.338.14-.645.344-.904.602-.258.259-.463.566-.602.904-.139.337-.21.7-.209 1.065v75.91c0 .743.295 1.455.82 1.98.525.525 1.237.82 1.98.82h19.17c.368 0 .732-.072 1.071-.213.34-.141.649-.347.909-.607s.466-.569.607-.908c.141-.34.213-.704.213-1.072l.07-44.69c0-2.514.999-4.925 2.777-6.703 1.777-1.778 4.189-2.777 6.703-2.777h11.8c2.513.003 4.923 1.002 6.7 2.78 1.778 1.777 2.777 4.187 2.78 6.7l.06 44.64c.003.744.3 1.456.827 1.981.526.524 1.239.819 1.983.819h19.16c.369.001.734-.07 1.075-.21.34-.14.65-.346.911-.607.261-.26.469-.569.61-.909.141-.341.214-.705.214-1.074V88.56c-.011-8.374-3.345-16.401-9.27-22.319C248.185 60.324 240.154 57 231.78 57zM16.23 40.34c-4.305.003-8.434 1.715-11.477 4.76C1.71 48.145 0 52.275 0 56.58v73.15c0 2.591 1.029 5.077 2.86 6.91l16.91 16.9c.41.409.931.688 1.5.8.567.113 1.156.055 1.69-.166.536-.222.993-.597 1.315-1.078.322-.481.494-1.047.495-1.626V114c0-.724.288-1.418.8-1.93s1.206-.8 1.93-.8H56c.773 0 1.526-.246 2.15-.703.624-.456 1.086-1.1 1.32-1.837l5.37-17c.146-.46.182-.947.104-1.423-.077-.476-.266-.928-.55-1.317-.285-.39-.657-.707-1.087-.926-.43-.219-.905-.333-1.387-.334H27.5c-.359.001-.715-.068-1.046-.205-.332-.137-.634-.338-.887-.592-.254-.253-.455-.555-.592-.887-.137-.332-.206-.687-.205-1.046V66.45c0-.358.07-.713.208-1.043.137-.33.339-.631.592-.884.254-.253.555-.453.886-.589.331-.136.686-.205 1.044-.204h43.74c.77 0 1.521-.245 2.143-.7.622-.455 1.084-1.096 1.317-1.83l5.41-16.86c.146-.46.182-.947.104-1.423-.077-.476-.266-.928-.55-1.317-.285-.39-.657-.707-1.087-.926-.43-.219-.905-.333-1.387-.334H16.23z'%3E%3C/path%3E%3C/svg%3E");
	background-size: contain;
	background-position: left 1px;
	background-repeat: no-repeat;
}
.global-navigation__logo .wds-icon,
.global-navigation__logo span{
	display: none;
}
.global-navigation__search,
.global-navigation__search:hover,
.global-navigation__search:active,
.global-navigation__search:focus,
.global-navigation__search:visited,
.global-navigation .wiki-tools__theme-switch,
.global-navigation .wiki-tools__theme-switch:hover,
.global-navigation .wiki-tools__theme-switch:active,
.global-navigation .wiki-tools__theme-switch:focus,
.global-navigation .wiki-tools__theme-switch:visited{
	order: 5;
	border: 0;
	background: transparent;
	color: var(--hydra-netbar-color);
	padding: 0;
	border-left: var(--hydra-netbar-border);
	border-radius: 0;
	box-sizing: content-box;
}
.global-navigation .wiki-tools__theme-switch{
	order: 4;
	width: 30px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.global-navigation__links{
	flex: 1 1 auto;
	order: 2;
	padding-left: 1em;
}
.global-navigation__link,
.global-navigation__links .wds-dropdown{
	margin-left: 0;
	margin-right: var(--hydra-box-gap);
	position: relative;
}
.global-navigation__link .global-navigation__label,
.global-navigation__links .wds-dropdown .global-navigation__label {
	display: none;
}
.global-navigation__link:hover .global-navigation__label{
	display: block;
	--wds-tooltip-background-color: var(--theme-page-background-color--secondary);
	--wds-tooltip-text-color: var(--theme-page-text-color);
	background-color: var(--wds-tooltip-background-color);
	border-radius: 4px;
	-webkit-box-shadow: 0 3px 12px 0 rgba(0,0,0,.3);
	box-shadow: 0 3px 12px 0 rgba(0,0,0,.3);
	color: var(--wds-tooltip-text-color);
	font-size: 12px;
	line-height: 1.25;
	padding: 6px;
	padding-right: 6px;
	position: absolute;
	z-index: 900;
	margin: 0;
	top: 0;
	left: 30px;
}
.global-navigation .global-navigation__link svg,
.global-navigation__links .wds-dropdown svg{
	width: 18px;
	height: 18px;
	min-width: 18px;
	min-height: 18px;
}
.global-navigation__link .global-navigation__icon,
.global-navigation__link .global-navigation__icon:hover,
.global-navigation__link .global-navigation__icon:active,
.global-navigation__link .global-navigation__icon:focus,
.global-navigation__links .wds-dropdown .global-navigation__icon,
.global-navigation__links .wds-dropdown .global-navigation__icon:hover,
.global-navigation__links .wds-dropdown .global-navigation__icon:active,
.global-navigation__links .wds-dropdown .global-navigation__icon:focus{
	border: 0;
	background: none;
	color: var(--hydra-netbar-color);
	width: 24px;
	height: 24px;
}
.global-navigation__link .global-navigation__icon:hover{
	background: rgba(127,127,127, 0.6);
}
.global-navigation__link .global-navigation__icon.has-border svg{
	border: 1.5px solid var(--hydra-netbar-color);
	border-radius: 50%;
	padding: 2px;
}
.global-navigation__links .wds-dropdown .wds-dropdown__toggle{
	width: auto;
}
.global-navigation__links .wds-dropdown .wds-dropdown__content{
	top: 0;
}
.global-navigation .wiki-tools{
	display: none;
}
.global-navigation .fandom-community-header__top-container{
	height: 30px;
	-webkit-box-align: center;
	align-items: center;
	padding: 0;
	flex: 1 1 auto;
}
.fandom-community-header__community-name-wrapper{
	height: 30px;
	padding: 0 0 0 var(--hydra-netbar-padding);
	border-left: var(--hydra-netbar-border);
	border-right: var(--hydra-netbar-border);
	margin-left: var(--hydra-box-gap);
}
.fandom-community-header__community-name-wrapper .official-wiki-badge {
	height: 20px;
	width: 99px;
}
.fandom-community-header__community-name-wrapper .gp-wiki-badge{
	width: 30px;
	height: 30px;
}
.global-navigation .fandom-community-header__top-container svg{
	margin-right: var(--hydra-netbar-padding);
}
.global-navigation__bottom > *{
	padding: 0 var(--hydra-netbar-padding);
	border-left: var(--hydra-netbar-border);
	margin: 0;
}
.global-navigation__bottom .notifications{
	margin: 0;
}
.global-navigation__bottom .notifications .global-navigation__icon{
	display: flex;
}
.global-navigation__bottom .notifications .notifications__counter{
	position: static;
	background: none;
	color: var(--hydra-netbar-color);
	font-size: inherit;
	margin-left: 2px;
	width: auto;
	height: auto;
}
.global-navigation .global-navigation__bottom .notifications .wds-dropdown.is-attached-to-bottom .wds-dropdown__content{
	transition: none;
	left: auto;
	right: 4px;
	top: 34px;
	bottom: 4px;
	border-radius: 4px;
	overflow: hidden;
	box-shadow: 0 0 10px rgba(0,0,0, 0.4);
}
.global-navigation .global-navigation__bottom .notifications .wds-dropdown.is-attached-to-bottom .wds-dropdown__content .wds-tab__content > div > ul > li {
	transition: background-color 0.15s;
	width: 100%;
	overflow: auto;
	word-break: break-word;
	overflow-wrap: break-word;
	hyphens: auto;
}
.global-navigation .global-navigation__bottom .notifications .wds-dropdown.is-attached-to-bottom .wds-dropdown__content .wds-tab__content > div > ul > li:hover {
	background-color: var(--wds-dropdown-background-color);
}

.global-navigation__bottom .wds-dropdown{
	margin-left: 0;
	display: block;
}
.global-navigation__bottom .wds-dropdown__toggle{
	width: auto;
}
.global-navigation .global-navigation__bottom .wds-dropdown__toggle > div,
.global-navigation .global-navigation__bottom .wds-dropdown__toggle > div:hover,
.wds-avatar__image, .wds-avatar__image:hover{
	border: 0;
	background: none;
	color: var(--hydra-netbar-color);
}
.wds-avatar{
	display: flex;
	align-items: center;
	width: auto;
	position: relative;
}
.wds-avatar img.wds-avatar__image{
	min-width: 0;
	width: 24px;
	height: 24px;
	border-width: 0;
	background-color: var(--hydra-netbar-color);
	z-index: 0;
}
.wds-avatar:after{
	content: attr(title);
	margin-left: 4px;
	z-index: 0;
}
.wds-avatar a{
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}
.global-navigation__bottom .global-navigation__icon{
	width: auto;
}

.global-navigation .global-navigation__bottom .wds-dropdown:before,
.global-navigation .global-navigation__bottom .wds-dropdown:after{
	display: none !important;
}
.global-navigation .global-navigation__bottom > .wds-dropdown:not(.notifications):hover > .wds-dropdown__content{
	display: block;
	position: absolute;
	top: 100%;
	right: 0;
	left: auto;
	bottom: auto;
	border: 0;
	border-radius: 0;
	box-shadow: 0 0 10px rgba(0,0,0, 0.4);
	background: var(--hydra-netbar-background);
}
.global-navigation .global-navigation__bottom .wds-dropdown:not(.notifications):hover > .wds-dropdown__content ul:before,
.global-navigation .global-navigation__bottom .wds-dropdown:not(.notifications):hover > .wds-dropdown__content ul:after{
	display: none;
}
.global-navigation .global-navigation__bottom > .wds-dropdown .wds-dropdown__content .wds-list.wds-is-linked li a,
.global-navigation .global-navigation__bottom .wds-sign-out__button{
	color: var(--hydra-netbar-color);
}
.global-navigation .global-navigation__bottom > .wds-dropdown > .wds-dropdown__content ul{
	display: flex;
	flex-direction: column-reverse;
}
/* page layout */
body .main-container{
	margin: 0;
	width: auto;
}
.main-container .resizable-container .community-header-wrapper{
	display: block !important;
	height: auto;
	justify-content: flex-start;
	margin-left: var(--hydra-box-gap);
	z-index:20; /* Fandom... */
}
body .main-container .resizable-container{
	margin: var(--hydra-box-gap) 0 0 0;
	width: auto;
	max-width: none;
	display: grid;
	grid-template-columns: calc( var(--hydra-aside-width) + var(--hydra-box-gap) ) 1fr;
	transition: grid-template-columns 0.2s;
}
body .main-container .resizable-container .gpt-ad{
	display: none;
}

body .wds-global-footer{
	margin-top: 0;
}
html body .main-container .page{
	margin: 0 var(--hydra-box-gap);
	flex: 1 1 auto;
	min-width: 0;
}

body .bottom-ads-container,
body #mixed-content-footer{
	display: block;
	grid-column-start: 1;
	grid-column-end: 3;
	margin: 0;
	border-radius: 0;
}

/* left aside */
.main-container .resizable-container .fandom-community-header{
	display: flex !important;
	flex-direction: column;
	font-size: 12px;
}

.fandom-community-header__image{
	margin: 0 0 var(--hydra-box-gap) 0;
}
.fandom-community-header__image img{
	width: 100%;
	height: auto;
	max-width: none;
	max-height: none;
}

.fandom-community-header .fandom-community-header__local-navigation > ul{
	display: block;
	margin: 0;
	color: var(--theme-page-text-color);
	line-height: 1.25;
}
.fandom-community-header__local-navigation > ul a{
	color: var(--theme-page-text-color);
}
.fandom-community-header__local-navigation > ul a:hover{
	color: var(--theme-page-text-color);
	text-decoration: underline;
}
.fandom-community-header__local-navigation > ul > li{
	background: rgba(var(--theme-page-background-color--rgb), 0.65);
	box-shadow: 0 0 6px rgba(var(--theme-page-text-color--rgb), 0.08);
	margin-bottom: var(--hydra-box-gap);
	border-radius: 5px;
	padding: 4px;
	display: block;
}
.fandom-community-header__local-navigation .wds-dropdown__content{
	display: block;
	position: static;
	transform: none;
	background: none;
	border: none;
	width: auto;
	padding: 0;
}
.fandom-community-header__local-navigation .wiki-tools__search,
.fandom-community-header__local-navigation .wiki-tools__add-new-page,
.fandom-community-header__local-navigation li a[data-tracking="explore-videos"],
.fandom-community-header__local-navigation li a[data-tracking="explore-images"],
.fandom-community-header__local-navigation a[data-tracking="theme-designer"],
.fandom-community-header__local-navigation a[data-tracking="analytics"],
.fandom-community-header__local-navigation #t-upload,
.fandom-community-header__local-navigation #t-specialpages,
.fandom-community-header__local-navigation .wds-dropdown::before,
.fandom-community-header__local-navigation .wds-dropdown::after,
.fandom-community-header__local-navigation a > svg:first-child{
	display: none !important;
}
.fandom-community-header__local-navigation .wds-is-secondary{
	border: 0;
	font-weight: normal;
	text-transform: none;
	min-height: 0;
	justify-content: flex-start;
	padding: 0;
}
.fandom-community-header__local-navigation .first-level-item{
	text-transform: none;
	display: flex;
	width: 100%;
	margin: 0;
	height: auto;
	line-height: 2;
	position: relative;
	cursor: pointer;
}
.fandom-community-header__local-navigation .first-level-item::after{
	/* cover the <a> element to make it unclickable */
	content: "";
	display: block;
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
}
.fandom-community-header__local-navigation .first-level-item a{
	line-height: inherit;
	max-width: none;
	flex: 1 1 auto;
}
.fandom-community-header__local-navigation .first-level-item svg{
	height: 14px;
	width: 14px;
	fill: var(--theme-page-text-mix-color);
	margin-right: 4px;
}
.fandom-community-header__local-navigation .first-level-item a span{
	margin-left: 4px;
}
.fandom-community-header__local-navigation .wds-dropdown .first-level-item svg{
	-webkit-transform: rotate(180deg) !important;
	transform: rotate(180deg) !important;
}
.fandom-community-header__local-navigation .wds-dropdown.collapsed .first-level-item svg{
	-webkit-transform: none !important;
    transform: none !important;
}

.fandom-community-header__local-navigation .wds-dropdown > .wds-dropdown__content,
.fandom-community-header__local-navigation .wds-dropdown.wds-is-active .wds-dropdown__content,
.fandom-community-header__local-navigation .wds-dropdown:not(.wds-is-touch-device):not(.wds-is-not-hoverable):hover .wds-dropdown__content
{
	display: block;
}
.fandom-community-header__local-navigation .wds-dropdown__content .wds-list.wds-is-linked > li{
	padding: 0;
}
.fandom-community-header__local-navigation .wds-dropdown__content .wds-list.wds-is-linked > li > a{
	padding: 0 4px;
	line-height: 2;
	font-size: 12px;
}
.fandom-community-header__local-navigation .wds-dropdown .wds-dropdown-level-nested__toggle svg{
	margin-left: 2px !important;
	width: 8px;
	height: 8px;
	min-width: 0;
	min-height: 0;
	margin-right: 3px;
}
.fandom-community-header__local-navigation .wds-dropdown__content .wds-list.wds-is-linked .wds-dropdown-level-nested .wds-dropdown-level-nested__content	{
	z-index: 100;
	max-width: none;
	min-width: 120px;
	background: rgba(var(--theme-page-background-color--rgb),0.96);
	box-shadow: 0 0 10px -2px var(--wds-dropdown-border-color);
	border-radius: 5px;
	border: 0;
	padding: 4px;
	margin-top: 6px;
}
.fandom-community-header__local-navigation .wds-dropdown__content .wds-list.wds-is-linked .wds-dropdown-level-nested .wds-dropdown-level-nested__content .wds-list.wds-is-linked > li > a{
	font-size: 12px;
}

/* page main */
html body .main-container .resizable-container .page .page__main{
	background: none;
	padding: 0;
	margin-bottom: var(--hydra-box-gap);
	border-radius: 5px;
	overflow: hidden;
	position: relative;
	padding-top: 40px;
	box-shadow: 0 0 6px rgba(var(--theme-page-text-color--rgb), 0.08);
}
body .page-side-tools__wrapper{
	display: flex;
	align-items: flex-end;
	transform: none;
	height: 40px;
	padding: 0 5px;
	background: rgba(var(--theme-page-background-color--rgb), 0.23);
	box-shadow: inset 0 0 10px rgba(var(--theme-page-background-color--rgb), 0.3);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 400;
}
body .page-side-tools__wrapper > *{
	display: none;
}
body .mw-notification-area{
	top: 50px;
}
.page-side-tools__wrapper > #searchform{
	display: flex;
	align-items: flex-end;
	margin: 3px;
	padding-left: 1px;
}
.page-side-tools__wrapper > #simpleSearch{
	display: flex;
	align-items: center;
	margin: 0;
}
.page-side-tools__wrapper > #searchform #searchButton{
	background-image: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2213%22%3E %3Cg fill=%22none%22 stroke=%22%2354595d%22 stroke-width=%222%22%3E %3Cpath d=%22M11.29 11.71l-4-4%22/%3E %3Ccircle cx=%225%22 cy=%225%22 r=%224%22/%3E %3C/g%3E %3C/svg%3E");
	background-position: center center;
	background-repeat: no-repeat;
	background-color: transparent;
	background-size: 14px 14px;
	color: transparent;
	cursor: pointer;
	width: 20px;
	height: 20px;
	border: 0;
	padding: 0;
	margin-left: -21px;
}
#searchInput {
	border-radius: 3px;
	border: 1px solid rgba(var(--theme-page-text-color--rgb),0.2);
	background: var(--theme-page-background-color--secondary);
	width: 15vw;
	min-width: 11.5em;
	max-width: 20em;
	padding: 3px 20px 3px 3px;
	font-size: 14px;
	color: unset;
	transition: border-color 250ms;
}
#searchInput:hover, #searchInput:focus {
	outline: 0;
	border-color: var(--theme-page-text-mix-color);
}
.theme-fandomdesktop-dark .suggestions-results,
.theme-fandomdesktop-dark .suggestions-special {
	background-color: var(--theme-page-background-color--secondary);
	border-color: rgba(var(--theme-page-text-color--rgb),0.2);
}
.theme-fandomdesktop-dark .suggestions-result {
	background-color: var(--theme-page-background-color--secondary);
	color: var(--theme-page-text-color);
}
.theme-fandomdesktop-dark .suggestions-result-current {
	background-color: var(--theme-accent-color);
	color: var(--theme-page-text-color);
}
.theme-fandomdesktop-dark .suggestions-special .special-label {
	color: var(--theme-page-text-color--hover);
}
.theme-fandomdesktop-dark .suggestions-special .special-query {
	color: var(--theme-page-text-color);
}
.theme-fandomdesktop-dark .suggestions-result-current .special-label {
	color: var(--theme-link-color--hover);
}
.theme-fandomdesktop-dark .suggestions-result .highlight {
	color: var(--theme-link-color);
	font-weight: 400;
}
body .page-side-tools__wrapper > ul{
	display: flex;
}
body .page-side-tools__wrapper > .left-tabs{
	flex: 1 0 auto;
}
body .page-side-tools__wrapper > .right-tabs{
	flex: 0 0 auto;
	justify-content: flex-end;
}
body .page-side-tools__wrapper a > svg{
	display: none;
}
body .page-side-tools__wrapper a{
	color: var(--theme-page-text-color);
}
body .page-side-tools__wrapper .wds-dropdown__toggle > .wds-icon{
	margin-left: 3px;
	fill: var(--theme-page-text-mix-color);
}
body .page-side-tools__wrapper > ul > li{
	background: rgba(var(--theme-page-background-color--rgb), 0.4);
	margin: 8px 4px 0;
	border-radius: 5px 5px 0 0;
	border: 1px solid rgba(var(--theme-page-text-color--rgb),0.2);
	border-bottom-width: 0;
}
.page-side-tools__wrapper > ul > li.selected{
	background: var(--theme-page-background-color);
	border-bottom-color: var(--theme-page-background-color);
	border-bottom-width: 1px;
	margin-bottom: -1px;
}
.page-side-tools__wrapper > ul > li > a,
.page-side-tools__wrapper > ul > li.wds-dropdown > .wds-dropdown__toggle{
	display: block;
	line-height: 30px;
	height: 30px;
	padding: 3px 6px 0;
	cursor: pointer;
}
.page-side-tools__wrapper > ul > li.wds-dropdown > .wds-dropdown__toggle:hover{
	text-decoration: underline;
}
.page-side-tools__wrapper .wds-dropdown__content .wds-list > li{
	margin: 0;
}
.page-side-tools__wrapper .wds-dropdown__content{
	max-width: none;
	min-width: 0;
	background: rgba(var(--theme-page-background-color--rgb),0.96);
	box-shadow: 0 0 10px -2px var(--wds-dropdown-border-color);
	border-radius: 0 0 5px 5px;
	border: 0;
	padding: 4px;
	z-index: 450;
}
.page-side-tools__wrapper .wds-dropdown__content:not(.wds-is-not-scrollable) .wds-list{
	background: none;
	max-height: none;
}
.page-side-tools__wrapper .wds-dropdown::before,
.page-side-tools__wrapper .wds-dropdown::after,
.page-side-tools__wrapper .wds-dropdown:not(.wds-is-touch-device):not(.wds-is-not-hoverable):hover:not(.wds-no-chevron)::before,
.page-side-tools__wrapper .wds-dropdown:not(.wds-is-touch-device):not(.wds-is-not-hoverable):hover:not(.wds-no-chevron)::after,
.page-side-tools__wrapper .wds-dropdown .wds-dropdown__content:not(.wds-is-not-scrollable) .wds-list::before,
.page-side-tools__wrapper .wds-dropdown .wds-dropdown__content:not(.wds-is-not-scrollable) .wds-list::after{
	display: none;
}
.page-side-tools__wrapper #ca-share #socialIconImages{
	margin: -4px 0;
}
.page-side-tools__wrapper #ca-share #socialIconImages > a{
	margin: 8px 4px;
	display: block;
}
.page-side-tools__wrapper #ca-share #socialIconImages > a img{
	display: block;
	width: 40px;
	height: 40px;
}
.page-side-tools__wrapper .right-tabs .wds-dropdown__content{
	-webkit-transform: none;
	transform: none;
	left: 0;
	right: auto;
}
.right-tabs .tools-customize{
	font-size: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--theme-page-text-mix-color);
}
.page-side-tools__wrapper .wds-dropdown__content .wds-list > li.tools-customize{
	margin: 6px 0 2px;
}
.right-tabs .tools-customize svg{
	margin-right: 2px;
	width: 10px;
	height: 10px;
	min-width: 10px;
}
.wds-dropdown__content .wds-list.wds-is-linked > li.tools-customize > a:not(.wds-button){
	color: var(--theme-page-text-mix-color);
	padding: 2px 0;
}
.wds-dropdown__content .wds-list.wds-is-linked > li.tools-customize:hover > a:not(.wds-button){
	background: none;
	color: inherit;
}
.right-tabs > .mw-watchlink a{
	width: 32px;
	padding: 7px 5px;
	color: transparent;
	overflow: hidden;
	background-repeat: no-repeat;
	background-size: 16px 16px;
	background-position: center 9px;
}
.right-tabs > .mw-watchlink#ca-unwatch a {
	background-image: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22%3E %3Cdefs%3E %3ClinearGradient id=%22a%22%3E %3Cstop offset=%220%22 stop-color=%22%23c2edff%22/%3E %3Cstop offset=%22.5%22 stop-color=%22%2368bdff%22/%3E %3Cstop offset=%221%22 stop-color=%22%23fff%22/%3E %3C/linearGradient%3E %3ClinearGradient id=%22b%22 x1=%2213.47%22 x2=%224.596%22 y1=%2214.363%22 y2=%223.397%22 xlink:href=%22%23a%22 gradientUnits=%22userSpaceOnUse%22/%3E %3C/defs%3E %3Cpath fill=%22url%28%23b%29%22 stroke=%22%237cb5d1%22 stroke-width=%22.99992%22 d=%22M8.103 1.146l2.175 4.408 4.864.707-3.52 3.431.831 4.845-4.351-2.287-4.351 2.287.831-4.845-3.52-3.431 4.864-.707z%22/%3E %3C/svg%3E")
}
.right-tabs > .mw-watchlink#ca-watch a {
	background-image: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22%3E %3Cpath fill=%22%23fff%22 stroke=%22%237cb5d1%22 stroke-width=%22.99992%22 d=%22M8.103 1.146l2.175 4.408 4.864.707-3.52 3.431.831 4.845-4.351-2.287-4.351 2.287.831-4.845-3.52-3.431 4.864-.707z%22/%3E %3C/svg%3E")
}
.right-tabs > .mw-watchlink#ca-unwatch a:hover,
.right-tabs > .mw-watchlink#ca-unwatch a:focus {
	background-image: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 xmlns:xlink=%22http://www.w3.org/1999/xlink%22%3E %3Cdefs%3E %3ClinearGradient id=%22a%22%3E %3Cstop offset=%220%22 stop-color=%22%23c2edff%22/%3E %3Cstop offset=%22.5%22 stop-color=%22%2368bdff%22/%3E %3Cstop offset=%221%22 stop-color=%22%23fff%22/%3E %3C/linearGradient%3E %3ClinearGradient id=%22b%22 x1=%2213.47%22 x2=%224.596%22 y1=%2214.363%22 y2=%223.397%22 xlink:href=%22%23a%22 gradientUnits=%22userSpaceOnUse%22/%3E %3C/defs%3E %3Cpath fill=%22url%28%23b%29%22 stroke=%22%23c8b250%22 stroke-width=%22.99992%22 d=%22M8.103 1.146l2.175 4.408 4.864.707-3.52 3.431.831 4.845-4.351-2.287-4.351 2.287.831-4.845-3.52-3.431 4.864-.707z%22/%3E %3C/svg%3E")
}
.right-tabs > .mw-watchlink#ca-watch a:hover,
.right-tabs > .mw-watchlink#ca-watch a:focus {
	background-image: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22%3E %3Cpath fill=%22%23fff%22 stroke=%22%23c8b250%22 stroke-width=%22.99992%22 d=%22M8.103 1.146l2.175 4.408 4.864.707-3.52 3.431.831 4.845-4.351-2.287-4.351 2.287.831-4.845-3.52-3.431 4.864-.707z%22/%3E %3C/svg%3E")
}
.right-tabs > .mw-watchlink#ca-unwatch a.loading,
.right-tabs > .mw-watchlink#ca-watch a.loading {
	background-image: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22%3E %3Cpath fill=%22%23fff%22 stroke=%22%23c8ccd1%22 stroke-width=%22.99992%22 d=%22M8.103 1.146l2.175 4.408 4.864.707-3.52 3.431.831 4.845-4.351-2.287-4.351 2.287.831-4.845-3.52-3.431 4.864-.707z%22/%3E %3C/svg%3E");
	animation:rotate 700ms infinite linear;
	outline:0;
	cursor:default;
	pointer-events:none;
	transform-origin:50% 57%;
}
body .page-header, body div#content{
	padding-left: 24px;
	padding-right: 24px;
	background: var(--theme-page-background-color);
}
.page-side-tools__wrapper:first-child + .page-header,
.page-side-tools__wrapper:first-child + div#content{
	border-top: 1px solid rgba(var(--theme-page-text-color--rgb),0.13);
}

body #userProfileApp{
	background: var(--theme-page-background-color);
	position: relative;
}
body #userProfileApp:after{
	content: "";
	display: block;
	width: 100%;
	height: 12px;
	background: var(--theme-page-background-color);
	position: absolute;
	top: 100%;
	left: 0;
}
body.skin-fandomdesktop .page-header{
	margin-bottom: 0;
}
.page-header__bottom{
	padding-top: 24px;
}
div#content{
	padding-top: 1em;
	padding-bottom: 1em;
}
body .page-footer{
	margin: 0;
}
.page-footer .page-footer__categories{
	margin: 0;
	background: var(--theme-page-background-color);
	border: 24px solid var(--theme-page-background-color);
	border-top: 0;
}
.page-footer .license-description{
	background: rgba(var(--theme-page-background-color--rgb), 0.65);
	padding: 24px;
	margin: 0;
}


#hydralize-size-toggle{
	display: flex;
	width: 26px;
	height: 26px;
	cursor: pointer;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
	margin: 4px 4px 4px 3px;
}
#hydralize-size-toggle:hover{
	background-color: rgba(255,255,255,0.6);
}
#hydralize-size-toggle svg:first-child,
.hydralize-content-expanded #hydralize-size-toggle svg:last-child{
	display: none;
}
#hydralize-size-toggle svg:last-child,
.hydralize-content-expanded #hydralize-size-toggle svg:first-child{
	display: block;
}

body.hydralize-content-expanded  .main-container .resizable-container {
   grid-template-columns: 0 1fr;
}
body.hydralize-content-expanded  .main-container .community-header-wrapper{
	overflow: hidden;
}

/* ve-fd-header */
.ve-fd-header > .ve-fd-header__actions > .ve-header-action-item{
	margin-right: 0;
}
.ve-fd-header > .ve-fd-header__actions .ve-ui-pageActionsPopupButtonWidget{
	display: none;
}

/*search suggest*/
.suggestions a.mw-searchSuggest-link,.suggestions a.mw-searchSuggest-link:hover,.suggestions a.mw-searchSuggest-link:active,.suggestions a.mw-searchSuggest-link:focus{color:#000;text-decoration:none}.suggestions-result-current a.mw-searchSuggest-link,.suggestions-result-current a.mw-searchSuggest-link:hover,.suggestions-result-current a.mw-searchSuggest-link:active,.suggestions-result-current a.mw-searchSuggest-link:focus{color:#fff}.suggestions a.mw-searchSuggest-link .special-query{ overflow:hidden;text-overflow:ellipsis;white-space:nowrap}


/*js review gadget*/
.skin-fandomdesktop .wrap-content-review__widget{
	background: var(--theme-page-background-color);
	padding: 1em 24px 0;
}
.skin-fandomdesktop .content-review__widget{
	margin-top: 0;
	padding: 1em;
	background: var(--theme-page-background-color--secondary);
	position: relative;
}
.skin-fandomdesktop .content-review__widget::after{
	content: "";
	display: table;
	clear: both;
}
.content-review__widget .content-review__widget__title{
	margin-bottom: 0;
	padding-left: 0;
}
.content-review__widget .content-review__widget__submit{
	float: left;
	margin-top: 2em;
}
.content-review__widget .content-review__widget__submit button{
	border-color: currentColor;
}
.content-review__widget .content-review__widget__test-mode{
	float: left;
	margin-top: 2em;
}
.content-review__widget .content-review__widget__submit + .content-review__widget__test-mode{
	margin-left: 2em;
}
.content-review__widget .content-review__widget__help{
	position: absolute;
	right: 1em;
	bottom: 0.75em;
}
.skin-fandomdesktop .wrap-content-review__widget + div#content{
	padding-top: 0;
}
/* this part is my code */
.resizable-container > div:empty {
  display: none
}
`;

GM_addStyle(style);
let el = document.createElement("script");
el.text = `
$(function(){
if( mw.config.get("skin") !== "fandomdesktop" ){
	return;
}
if("ontouchstart" in window){ // only when this is not registered in common.js
	return;
}

//this is much faster than mw.loadMessage
var l10n = (function(){
	var data = {
		en: {
			watchlist: 'My Watchlist', // in my account droplist
			view: 'View', // in right tabs
			more: 'More', // in right tabs
			share: 'Share', // in left tabs
			pagetools: 'Page Tools', // in sidebar, section heading
			whatlinkshere: 'What links here',
			'cargo-pagevalues': 'Page values', //in sidebar, under "Page Tools"
			'recentchangeslinked': 'Related changes', //in sidebar, under "Page Tools"
			'log': 'Logs',
			searchText: 'Search '+mw.config.get('wgSiteName'), //placeholder for search box
			searchGo: 'Go', //text for search button in search box
			searchGoTitle: 'Go to a page with this exact name if it exists', //hover text for search button
			darkTheme: 'Dark Theme',
			lightTheme: 'Light Theme'
		},
		zh: {
			watchlist: '我的监视列表',
			view: '查看',
			more: '更多',
			share: '分享',
			pagetools: '页面工具',
			whatlinkshere: '链入页面',
			'cargo-pagevalues': '页面值',
			'recentchangeslinked': '相关更改',
			'log': '日志',
			searchText: '搜索 '+mw.config.get('wgSiteName'),
			searchGo: '搜索',
			searchGoTitle: '若存在标题完全匹配的页面，则直接前往该页面',
			darkTheme: '黑暗主题',
			lightTheme: '明亮主题'
		}
	};
	var lang = mw.config.get("wgUserLanguage");
	return function (key) {
		// (null==undefined) is true,(null===undefined) is false
		return (data[lang] && data[lang][key] != null) ? data[lang][key] : data.en[key];
	};
})();

//unused, remove
$('.fandom-sticky-header').remove();

(function(){
	var $netbar = $('.global-navigation__links');
	//move gp logo to top bar
	$('.fandom-community-header__top-container').appendTo($netbar);
	//move wiki tools to aside:
	var $box = $('.fandom-community-header__local-navigation > ul').find('.explore-menu');
	var $wikitools = $('.wiki-tools').first().find('a').removeClass('wds-button');
	// theme switch to top bar
	var $themeswitch = $wikitools.filter('.wiki-tools__theme-switch').appendTo($netbar);

		// .appendTo($netbar);   $('.wiki-tools').first()
		// .find('a').removeClass('wds-button')
		// .appendTo($box).wrap('<li></li>')
		// .filter('.wiki-tools__theme-switch')
		// .appendTo($netbar);
	var $recent = $wikitools.filter('[data-tracking="recent-changes"]').first().wrap('<li></li>');

	// $('<span></span>', {text: $recent.attr('title').split('[')[0]}).appendTo($recent.empty());
	// sort in this way: main - recent - random - all
	$box.find('a[data-tracking="explore-main-page"]').parent().after(
		$recent.parent(),
		$box.find('a[data-tracking="explore-random"]').parent()
	);
	$wikitools.not('.wiki-tools__theme-switch, [data-tracking="recent-changes"]').appendTo($box.find('.wds-list')).wrap('<li></li>');

	//theme switch without reloading:
	var s = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
	if(!$('#wds-icons-moon-small').length){
		$(s).attr({id:"wds-icons-moon-small", viewbox:"0 0 18 18"}).html('<path d="M9 17C6.97016 16.9786 5.02436 16.1863 3.55687 14.7837C2.08938 13.3812 1.20995 11.4732 1.09679 9.44639C0.983621 7.41959 1.64518 5.42556 2.94741 3.86835C4.24965 2.31113 6.09516 1.3072 8.11 1.05996C8.30858 1.03515 8.51004 1.07049 8.68832 1.16141C8.86659 1.25233 9.01349 1.39465 9.11 1.56996C9.204 1.74498 9.24374 1.94403 9.22414 2.14172C9.20455 2.33942 9.12652 2.5268 9 2.67996C8.3519 3.47677 7.99868 4.47286 8 5.49996C8.00265 6.69263 8.4776 7.83568 9.32094 8.67903C10.1643 9.52237 11.3073 9.99732 12.5 9.99996C13.5271 10.0013 14.5232 9.64806 15.32 8.99996C15.4742 8.87503 15.6621 8.7988 15.8598 8.78099C16.0574 8.76319 16.2559 8.8046 16.43 8.89996C16.6053 8.99648 16.7476 9.14337 16.8386 9.32165C16.9295 9.49993 16.9648 9.70138 16.94 9.89996C16.719 11.8518 15.7877 13.6541 14.3234 14.9635C12.8591 16.2728 10.9643 16.9977 9 17V17ZM6.27 3.64996C5.42973 4.08218 4.70343 4.70674 4.15023 5.47279C3.59703 6.23884 3.23257 7.12471 3.08655 8.05828C2.94053 8.99184 3.01706 9.94669 3.30992 10.8451C3.60278 11.7435 4.10368 12.56 4.77183 13.2281C5.43999 13.8963 6.2565 14.3972 7.15489 14.69C8.05328 14.9829 9.00813 15.0594 9.94169 14.9134C10.8753 14.7674 11.7611 14.4029 12.5272 13.8497C13.2932 13.2965 13.9178 12.5702 14.35 11.73C13.7498 11.9098 13.1265 12.0007 12.5 12C10.7769 11.9973 9.12515 11.3116 7.90673 10.0932C6.68832 8.87482 6.00265 7.22306 6 5.49996C5.99925 4.87342 6.09021 4.25015 6.27 3.64996V3.64996Z"/>').appendTo($('body > svg').first());
	}
	if(!$('#wds-icons-sun-small').length){
		$(s).attr({id:"wds-icons-sun-small", viewbox:"0 0 18 18"}).html('<path d="M9,14a5,5,0,1,1,5-5A5,5,0,0,1,9,14ZM9,6a3,3,0,1,0,3,3A3,3,0,0,0,9,6Zm.2-4a.64.64,0,0,0,.18-.06l.18-.09.15-.12A1.05,1.05,0,0,0,10,1,1,1,0,0,0,9.92.62,1,1,0,0,0,9.71.29L9.56.17,9.38.08A.64.64,0,0,0,9.2,0a1,1,0,0,0-.58.06,1.15,1.15,0,0,0-.33.21,1,1,0,0,0-.21.33A1,1,0,0,0,8,1a1,1,0,0,0,.08.38,1.15,1.15,0,0,0,.21.33A1.05,1.05,0,0,0,9,2Zm.51,15.73a1.15,1.15,0,0,0,.21-.33A1,1,0,0,0,10,17a1,1,0,0,0-1.71-.71A1.05,1.05,0,0,0,8,17a1,1,0,0,0,.08.38,1.15,1.15,0,0,0,.21.33,1,1,0,0,0,1.42,0Zm8-8a1.58,1.58,0,0,0,.12-.15.76.76,0,0,0,.09-.18A.64.64,0,0,0,18,9.2,1.5,1.5,0,0,0,18,9a1,1,0,1,0-2,0,1.5,1.5,0,0,0,0,.2.64.64,0,0,0,.06.18.76.76,0,0,0,.09.18l.12.15a1,1,0,0,0,1.42,0Zm-16,0,.12-.15a.76.76,0,0,0,.09-.18A.64.64,0,0,0,2,9.2,1.5,1.5,0,0,0,2,9a.84.84,0,0,0-.08-.38,1,1,0,0,0-.21-.33,1,1,0,0,0-1.42,0,1,1,0,0,0-.21.33A1,1,0,0,0,0,9a1.5,1.5,0,0,0,0,.2.64.64,0,0,0,.06.18.76.76,0,0,0,.09.18l.12.15a1,1,0,0,0,.33.21A.84.84,0,0,0,1,10,1.05,1.05,0,0,0,1.71,9.71ZM14.85,4.32,15,4.27a1,1,0,0,0,.17-.1.44.44,0,0,0,.15-.12l.13-.15a1.4,1.4,0,0,0,.09-.17,1.39,1.39,0,0,0,.06-.19,1.36,1.36,0,0,0,0-.2A1,1,0,0,0,15.58,3a.87.87,0,0,0-.22-.32.64.64,0,0,0-.15-.13A.91.91,0,0,0,15,2.42l-.19-.06a1,1,0,0,0-.58.06.87.87,0,0,0-.32.22,1,1,0,0,0-.29.7.68.68,0,0,0,0,.2,1.33,1.33,0,0,0,.05.19l.1.17a.79.79,0,0,0,.12.15,1,1,0,0,0,.32.22,1.07,1.07,0,0,0,.39.07A.62.62,0,0,0,14.85,4.32Zm-10.8,11a1,1,0,0,0,.29-.7,1.07,1.07,0,0,0-.07-.39A1,1,0,0,0,4.05,14a1,1,0,0,0-1.41,0,.87.87,0,0,0-.22.32,1.09,1.09,0,0,0-.08.39,1,1,0,0,0,.08.38.87.87,0,0,0,.22.32,1,1,0,0,0,1.41,0Zm11.31,0a1,1,0,0,0,.3-.7,1.09,1.09,0,0,0-.08-.39.87.87,0,0,0-.22-.32A1,1,0,0,0,14,14a1,1,0,0,0-.22.32,1.07,1.07,0,0,0-.07.39,1,1,0,0,0,.07.38,1,1,0,0,0,.22.32,1,1,0,0,0,1.41,0ZM4.05,4.05a.79.79,0,0,0,.12-.15l.1-.17a1.33,1.33,0,0,0,.05-.19.68.68,0,0,0,0-.2,1,1,0,0,0-.29-.7.87.87,0,0,0-.32-.22,1,1,0,0,0-.77,0,.87.87,0,0,0-.32.22A.87.87,0,0,0,2.42,3a1,1,0,0,0-.08.38,1.36,1.36,0,0,0,0,.2l.06.19a1.4,1.4,0,0,0,.09.17l.13.15A1,1,0,0,0,3,4.27a1,1,0,0,0,1.09-.22Z"/>').appendTo($('body > svg').first());
	}
	$themeswitch.on('click', function(event){
		event.preventDefault();
		var targetTheme = $("body").hasClass("theme-fandomdesktop-light") ? "dark" : "light";
		var $this = $(this);
		$.when(
			$.get(mw.util.wikiScript("wikia") + "?controller=ThemeApi&method=themeVariables&variant=" + targetTheme + "&cb=" + (new Date().getTime())),
			$.get(mw.util.wikiScript("load") + "?modules=ext.fandom.DesignSystem.GlobalNavigation.brand." + targetTheme + ".css%7Cext.fandom.DesignSystem.brand." + targetTheme + ".css&only=styles")
		).done(function(wikiCss, brandCss) {
			var combinedCss = wikiCss[0] + brandCss[0];
			var $s = $("#theme-swapper")[0] || $("<style>").attr("id", "theme-swapper").appendTo("body");
			$($s).text(combinedCss);
			$("body").removeClass("theme-fandomdesktop-light theme-fandomdesktop-dark").addClass("theme-fandomdesktop-" + targetTheme);
			$this.attr('title', targetTheme === "dark" ? l10n("lightTheme") : l10n("darkTheme")).empty().append($('<svg class="wds-icon wds-icon-small"><use xlink:href="#wds-icons-'+(targetTheme==="dark"?"sun":"moon")+'-small"></use></svg>'));
			var THEME_OPTION_NAME = "theme";
			if(mw.user.isAnon()){
				$.cookie(THEME_OPTION_NAME, targetTheme, {expires: 7, path: '/', domain: mw.config.get("wgCookieDomain")});
			}
			else{
				(new mw.Api()).saveOption(THEME_OPTION_NAME, targetTheme);
			}
		});
		event.stopPropagation();
	});
})();

(function(){
	var $list = $('#global-navigation-user-signout').parent();
	$('.wds-avatar').append($('<a></a>', {href: $list.find('a[data-tracking-label="account.profile"]').attr('href')}));
	var actions = mw.config.get('wgWikiaPageActions') || [];
	for(var i in actions){
		var info = actions[i];
        if(info.id === 'special:watchlist'){
            $('<li></li>').append($('<a></a>', {text: l10n('watchlist'), href: info.href})).insertBefore($list.find('[data-tracking-label="account.talk"]').parent());
            break;
        }
    }
})();

// js review gadget:
$('.content-review__widget').insertBefore($('#content')).wrap('<div class="wrap-content-review__widget"></div>');

//index wiki nav sections:(for collapsed/expanded status memory)
$(".fandom-community-header__local-navigation > ul > .wds-dropdown").each(function(index, div){
	div.dataset.index = index;
	if($.cookie('hydra-nav-'+index) === "y"){
		$(div).addClass('collapsed').find('.wds-dropdown__content').css('display', 'none');
	}
});

//build page tools on aside (faster than move from right rail after it loaded.)
(function(){
	var tools = mw.config.get("wgRailModuleParams");
	if(tools){
		tools = tools.toolbox;
	}
	else{
		tools = mw.config.get("wgWikiaBarSkinData").navUrls;
	}
	delete tools.mainpage;
	delete tools.upload;
	delete tools.specialpages;
	var $box = $(
		'<li class="wds-dropdown" data-index="pagetools">'+
		'<div class="wds-tabs__tab-label wds-dropdown__toggle first-level-item">'+
		'<a href="#"><span>'+l10n('pagetools')+'</span></a>'+
		'<svg class="wds-icon wds-icon-tiny wds-dropdown__toggle-chevron"><use xlink:href="#wds-icons-dropdown-tiny"></use></svg>'+
		'</div>'+
		'<div class="wds-dropdown__content wds-is-not-scrollable">'+
		'<ul class="wds-list wds-is-linked"></ul>'+
		'</div>'+
		'</li>')
		.appendTo($('.fandom-community-header__local-navigation > ul'))
		.find('ul.wds-list');
	$.each(tools, function(key, item){
		if(!item){
			return;
		}
		$('<a></a>', {
			href: item.href,
			text: item.text || l10n(key) || item.msg,
			id: item.id || 't-'+key,
			rel: item.rel
		}).appendTo($box).wrap('<li></li>');
	});
	if($box.children().length === 0){
		$box.closest('div.wds-dropdown').remove();
	}
	else{
		if($.cookie('hydra-nav-pagetools') === "y"){
			$box.closest('.wds-dropdown').addClass('collapsed')
				.find('.wds-dropdown__content').css('display', 'none');
		}
		$box
		.prepend( $box.find('#t-whatlinkshere').parent(), $box.find('#t-recentchangeslinked').parent() )
		.append( $box.find('#t-info').parent(), $box.find('#t-cargopagevalueslink').parent() );
	}
})();

//move language interwiki links to aside:
(function(){
	var $languages = $('.page-footer__languages');
	if(!$languages.length){ return; }
	var $header = $languages.find('.wds-collapsible-panel__header');
	var $box = $(
		'<li class="wds-dropdown" data-index="languages">'+
		'<div class="wds-tabs__tab-label wds-dropdown__toggle first-level-item">'+
		'<a href="#"><span>'+$header.text()+'</span></a>'+
		'<svg class="wds-icon wds-icon-tiny wds-dropdown__toggle-chevron"><use xlink:href="#wds-icons-dropdown-tiny"></use></svg>'+
		'</div>'+
		'<div class="wds-dropdown__content wds-is-not-scrollable">'+
		'<ul class="wds-list wds-is-linked"></ul>'+
		'</div>'+
		'</li>')
		.appendTo($('.fandom-community-header__local-navigation > ul'))
		.find('ul.wds-list');
	$header.remove();
	$languages.find('.wds-collapsible-panel__content a')
		.appendTo($box).wrap('<li></li>');
	if($.cookie('hydra-nav-languages') === "y"){
		$languages.addClass('collapsed')
			.find('.wds-dropdown__content').css('display', 'none');
	}
})();

//click to toggle expand/collapse for local nav dropdown lists:
$(".fandom-community-header__local-navigation").on("click", '.wds-dropdown__toggle.first-level-item', function(event){
	event.stopPropagation();
	var $item = $(this).closest('.wds-dropdown');
	$item.toggleClass('collapsed').find('.wds-dropdown__content').slideToggle('fast');
	$.cookie('hydra-nav-' + $item[0].dataset.index, $item.hasClass('collapsed')?"y":"n", {expires: 365, path: '/'});
});

//remove empty <li> from aside nav.
$(".fandom-community-header__local-navigation li:empty").remove();


//build topbar.
var $topbar = (function(){
	var $topbar = $('.page-side-tools__wrapper');
	if(!$topbar.length){ return; }

	var $left = $('<ul class="left-tabs"></ul>');
	var $right = $(
		'<ul class="right-tabs">'+
		'<li class="wds-dropdown">'+
		'<div class="wds-dropdown__toggle"><span>' + l10n('more') + '</span><svg class="wds-icon wds-icon-tiny wds-dropdown__toggle-chevron"><use xlink:href="#wds-icons-dropdown-tiny"></use></svg></div>'+
		'<div class="wds-dropdown__content"><ul class="wds-list wds-is-linked"></ul></div>'+
		'</li>'+
		'</ul>');
	$topbar.empty().append($left, $right);
	var $more = $right.find('.wds-list');
	var $cactions = $('#p-cactions');

	var actions = mw.config.get('wgWikiaBarSkinData');
	actions = actions && actions.contentActions;
	(function(){
		if(!actions){ return; }
		//build left/right tabs:
		delete actions['cargo-purge']; //there is actions.purge already
		var $target = $left;
		$.each(actions, function(key, item){
			if(key.substring(0,8) === 'varlang-'){ return; } //skip language variants
			if(key === 'share'){
				$('<li class="wds-dropdown" id="ca-share">'+
					'<div class="wds-dropdown__toggle">'+
					'<span>' + l10n('share') + '</span>'+
					'<svg class="wds-icon wds-icon-tiny wds-dropdown__toggle-chevron"><use xlink:href="#wds-icons-dropdown-tiny"></use></svg>'+
					'</div>'+
					'<div class="wds-dropdown__content">' + item.html + '</div>'+
					'</li>').appendTo($left);
				return;
			}
			if(key === 'edit' || key === 'viewsource' || key === 'history' || key === 'addsection'){
				$target = $right;
			}else if(!key.startsWith('nstab-') && !item.primary){
				$target = $more;
			}
			var $z = $cactions.find('#'+item.id);
			if($z.length){
				//reuse the item from the dropdown list
				$z.closest('li').attr('class', $z.attr('class')).appendTo($target);
			}
			else{
				//build a new one
				var $a = $('<a></a>', {
					accesskey: item.accesskey,
					id: item.id,
					class: (item.class||'') + (item.exists===false?' new':''),
					href: item.href,
					text: item.text,
				});
				if(item.data){
					$.each(item.data, function(index) {
						$a.attr('data-'+index, item.data[index]);
					});
				}
				$('<li></li>',{class: $a.attr('class')}).append($a).appendTo($target);
			}
			//workaround for watch/unwatch: take out watch/unwatch from more menu, and set id/class on li element to make mediawiki.page.watch.ajax work properly.
			var $watch = $more.find('a.mw-watchlink');
			$watch.closest('li').addClass('mw-watchlink').attr('id', $watch.attr('id')).appendTo($right);
			$watch.attr('id', null);
		});
	})();
	//Is there anything left in "old" dropdown list?
	$cactions.find('ul li').appendTo($more);
	//removed old p-views area.
	$('#p-views').remove();
	$more.attr('id', 'p-cactions');
	$right.attr('id', 'p-views');

	//need "view" for right tabs?
	(function(){
		if(!(actions.edit || actions.viewsource)){
			return;
		}
		var $view = $left.find('li.selected').clone().attr('id', 'ca-view').prependTo($right);
		$view.find('a').text(l10n('view'));
		if($right.find('li.selected').length > 1){
			$view.removeClass('selected');
		}
	})();

	//language variants to left tabs (for some non-English languages such as Chinese)
	(function(){
		var $variants = $('.page-header__top .page-header__variants .wds-dropdown');
		if($variants.length === 0){ return; }
		$('<li class="wds-dropdown" id="p-variants"></li>').append($variants.children()).appendTo($left)
		.find('.wds-dropdown__toggle').children().first().wrap('<span></span>');
		//move share to the end
		$left.find('#ca-share').appendTo($left);
	})();

	//merge my tools bar to top right bar:
	(function(){
		var $mytools = $('#WikiaBar ul.tools');
		$mytools.find('li.overflow').each(function(index, li){
			var $li = $(li);
			var $a = $li.find('a');
			var id = $a.attr('id') || 'ca-'+$a.attr('data-name');
			if(id){
				if($right.find('#'+id).length){
					return;
				}
				$a.attr('id', id);
			}
			$li.appendTo($li.parent().hasClass('wds-list') ? $more : $right);
		});
		if($more.children().length){
			$more.closest('.wds-dropdown').appendTo($right); //move more menu to the end
			mw.loader.using("ext.fandom.wikiaBar.js").then(function(){
				$more.append($mytools.find('li.tools-customize'));
			});
		}
		else{
			$more.closest('.wds-dropdown').remove();
		}
	})();
	return $topbar;
})(); //end toolbar


//Search form:
(function(){
	/** taked from Joritochip's HydraRevived (https://dev.fandom.com/wiki/HydraRevived) **/
	var sitename = mw.config.get('wgSiteName');
	$('<form></form>', {action: mw.config.get('wgScript'), id: 'searchform'}).appendTo($topbar).append(
		$('<div></div>', {id: 'simpleSearch'}).append(
			$('<input/>', {
				type: 'search',
				name: 'search',
				placeholder: l10n('searchText'),
				title: l10n('searchText'),
				id: 'searchInput',
				tabindex: '1',
				accesskey: 'f',
				autocomplete: 'off'
			}),
			$('<input/>', {
				type: 'hidden',
				value: 'Special:Search',
				name: 'title'
			}),
			$('<input/>', {
				type: 'submit',
				name: 'go',
				value: l10n('searchGo'),
				title: l10n('searchGoTitle'),
				id: 'searchButton',
				class: 'searchButton'
			})
		)
	);
	/* autocomplete
	 * (based on mediawiki.searchSuggest:
	 * https://gerrit.wikimedia.org/r/plugins/gitiles/mediawiki/core/+/refs/heads/master/resources/src/mediawiki.searchSuggest/searchSuggest.js)
	 */
	var searchNS = $.map(mw.config.get('wgFormattedNamespaces'), function(nsName, nsID) {
		if (nsID >= 0 && mw.user.options.get('searchNs' + nsID)) {
			return Number(nsID);
		}
	});
	mw.searchSuggest = {
		request: function(api, query, response, maxRows, namespace) {
			return api.get({
				formatversion: 2,
				action: 'opensearch',
				search: query,
				namespace: namespace || searchNS,
				limit: maxRows,
				suggest: !0
			}).done(function(data, jqXHR) {
				response(data[1], {
					type: jqXHR.getResponseHeader('X-OpenSearch-Type'),
					searchId: jqXHR.getResponseHeader('X-Search-ID'),
					query: query
				});
			});
		}
	};

	var api, searchboxesSelectors, $searchRegion = $('#simpleSearch, #searchInput').first(),
		$searchInput = $('#searchInput'),
		previousSearchText = $searchInput.val();

	function getFormData(context) {
		var $form, baseHref, linkParams;
		if (!context.formData) {
			$form = context.config.$region.closest('form');
			baseHref = $form.attr('action');
			baseHref += baseHref.indexOf('?') > -1 ? '&' : '?';
			linkParams = $form.
			serializeObject();
			context.formData = {
				textParam: context.data.$textbox.attr('name'),
				linkParams: linkParams,
				baseHref: baseHref
			};
		}
		return context.formData;
	}

	function onBeforeUpdate() {
		var searchText = this.val();
		if (searchText && searchText !== previousSearchText) {
			mw.track('mediawiki.searchSuggest', {
				action: 'session-start'
			});
		}
		previousSearchText = searchText;
	}

	function getInputLocation(context) {
		return context.config.$region.closest('form').find('[data-search-loc]').data('search-loc') || 'header';
	}

	function onAfterUpdate(metadata) {
		var context = this.data('suggestionsContext');
		mw.track('mediawiki.searchSuggest', {
			action: 'impression-results',
			numberOfResults: context.config.suggestions.length,
			resultSetType: metadata.type || 'unknown',
			searchId: metadata.searchId || null,
			query: metadata.query,
			inputLocation: getInputLocation(context)
		});
	}

	function renderFunction(text, context) {
		var formData = getFormData(context),
			textboxConfig = context.data.$textbox.data('mw-searchsuggest') || {};
		formData.linkParams[formData.textParam] = text;
		mw.track(
			'mediawiki.searchSuggest', {
				action: 'render-one',
				formData: formData,
				index: context.config.suggestions.indexOf(text)
			});
		this.text(text);
		if (textboxConfig.wrapAsLink !== false) {
			this.wrap($('<a>').attr('href', formData.baseHref + $.param(formData.linkParams)).attr('title', text).addClass('mw-searchSuggest-link'));
		}
	}

	function selectFunction($input, source) {
		var context = $input.data('suggestionsContext'),
			text = $input.val();
		if (source !== 'keyboard') {
			mw.track('mediawiki.searchSuggest', {
				action: 'click-result',
				numberOfResults: context.config.suggestions.length,
				index: context.config.suggestions.indexOf(text)
			});
		}
		return true;
	}

	function specialRenderFunction(query, context) {
		var $el = this,
			formData = getFormData(context);
		formData.linkParams[formData.textParam] = query;
		mw.track('mediawiki.searchSuggest', {
			action: 'render-one',
			formData: formData,
			index: context.config.suggestions.indexOf(query)
		});
		if ($el.children().length === 0) {
			$el.append($('<div>').addClass('special-label').text(mw.msg('searchsuggest-containing')), $('<div>').addClass(
				'special-query').text(query)).show();
		} else {
			$el.find('.special-query').text(query);
		}
		if ($el.parent().hasClass('mw-searchSuggest-link')) {
			$el.parent().attr('href', formData.baseHref + $.param(formData.linkParams) + '&fulltext=1');
		} else {
			$el.wrap($('<a>').attr('href', formData.baseHref + $.param(formData.linkParams) + '&fulltext=1').addClass('mw-searchSuggest-link'));
		}
	}
	searchboxesSelectors = ['#searchInput', '.mw-searchInput'];
	$(searchboxesSelectors.join(', ')).suggestions({
		fetch: function(query, response, maxRows) {
			var node = this[0];
			api = api || new mw.Api();
			$.data(node, 'request', mw.searchSuggest.request(api, query, response, maxRows));
		},
		cancel: function() {
			var node = this[0],
				request = $.data(node, 'request');
			if (request) {
				request.abort();
				$.removeData(node, 'request');
			}
		},
		result: {
			render: renderFunction,
			select: function() {
				return true;
			}
		},
		update: {
			before: onBeforeUpdate,
			after: onAfterUpdate
		},
		cache: !0,
		highlightInput: !0
	}).on('paste cut drop', function() {
		$(this).trigger('keypress');
	}).each(function() {
		var $this = $(this);
		$this.data(
			'suggestions-context').data.$container.css('fontSize', $this.css('fontSize'));
	});
	if ($searchRegion.length === 0) {
		return;
	}
	$searchInput.suggestions({
		update: {
			before: onBeforeUpdate,
			after: onAfterUpdate
		},
		result: {
			render: renderFunction,
			select: selectFunction
		},
		special: {
			render: specialRenderFunction,
			select: function($input, source) {
				var context = $input.data('suggestionsContext'),
					text = $input.val();
				if (source === 'mouse') {
					mw.track('mediawiki.searchSuggest', {
						action: 'click-result',
						numberOfResults: context.config.suggestions.length,
						index: context.config.suggestions.indexOf(text)
					});
				} else {
					$input.closest('form').append($('<input>').prop({
						type: 'hidden',
						value: 1
					}).attr('name', 'fulltext'));
				}
				return true;
			}
		},
		$region: $searchRegion
	});
	$searchInput.closest('form').on('submit', function() {
		var context = $searchInput.data('suggestionsContext');
		mw.track('mediawiki.searchSuggest', {
			action: 'submit-form',
			numberOfResults: context.config.suggestions.length,
			$form: context.config.$region.closest('form'),
			inputLocation: getInputLocation(context),
			index: context.config.suggestions.indexOf(context.data.$textbox.val())
		});
	}).find('.mw-fallbackSearchButton').remove();
})();

//expand?
(function(){
	$body = $('body');
	$('<div id="hydralize-size-toggle">'+
	'<svg class="wds-icon wds-icon-small"><use href="#wds-icons-zoom-out-small"></use></svg>'+
	'<svg class="wds-icon wds-icon-small"><use href="#wds-icons-zoom-in-small"></use></svg>'+
	'</div>')
	.prependTo($topbar)
	.on('click', function(){
		$body.toggleClass('hydralize-content-expanded');
		//$.cookie('hydralize-content-expanded', $body.hasClass('hydralize-content-expanded')?"y":"n", {expires: 365, path: '/'});
	});
	//$body.toggleClass('hydralize-content-expanded', $.cookie('hydralize-content-expanded') === "y");
})();

//add a flag class to body element for other scripts.
$('body').addClass('hydralized');

}); //end $`
document.body.appendChild(el);

// ==UserScript==
// @name Goodreads Dark Theme (Fork)
// @namespace https://github.com/holyspiritomb
// @version 1.1.1
// @description A dark theme for Goodreads
// @author obscuredetour, moosedookie, holyspiritomb
// @homepageURL https://github.com/holyspiritomb/userstyles/tree/main/goodreads/dark-theme
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.goodreads.com/book/show/*
// @match https://www.goodreads.com/review*
// @include /^(?:https://www\.goodreads\.com/(?!book/add_to_books_widget/).*)$/
// @downloadURL https://update.greasyfork.org/scripts/454499/Goodreads%20Dark%20Theme%20%28Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454499/Goodreads%20Dark%20Theme%20%28Fork%29.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:https://www\\.goodreads\\.com/(?!book/add_to_books_widget/).*)\$").test(location.href)) {
		css += `
			:root {
				/* color variables - darkest to lightest */
				--jet: oklch(0.2376 0 0);
				--space: oklch(0.2484 0 0);
				--raven: oklch(0.2689 0.0011 17.23);
				--asher: oklch(0.2896 0.0013 17.23);
				--aztec: oklch(32% 0.001 17.2);
				--cape-cod: oklch(35.1% 0 0);
				--corduroy: oklch(0.379 0.0018 17.24);
				--mine: oklch(0.3994 0 0);
				--mystic: oklch(0.4923 0 0);
				--grey: oklch(0.7407 0 0);
				--alabaster: oklch(87.8% 0.014 182.7);
				--zircon: oklch(93% 0.001 17.2);
				--concrete: oklch(96.2% 0 0);
				--limestone: oklch(30.4% 0.018 181.5);
				--elm: oklch(53% 0.083 178.4);
				--jade: oklch(54.3% 0.08 174.1);
				--robin: oklch(52.4% 0.042 178.5);
				--neptune: oklch(74.3% 0.075 176.5);
				--conch: oklch(74.2% 0.027 178.8);
				--green-shadow: oklch(76.7% 0.049 177.9);
				--powder-ash: oklch(81.7% 0.019 179.2);
				--mint-ice: oklch(94.9% 0.039 178.7);
				/* backgrounds */
				--bkg-nav: var(--jet);
				--bkg-main: var(--space);
				--bkg-card: var(--raven);
				--bkg-card-foot: var(--asher);
				--bkg-nav-link-hover: var(--corduroy);
				--bkg-button: var(--jade);
				--bkg-button-hover: var(--elm);
				/* text */
				--txt-main: var(--concrete);
				--txt-second: var(--zircon);
				--txt-grey: var(--grey);
				--txt-nav-link: var(--alabaster);
				--txt-link: var(--neptune);
				--txt-link-bright: var(--mint-ice);
				--txt-button: var(--concrete);
				/* borders */
				--border: var(--mine);
				--border-bright: var(--mystic);
			}
		    /* force dark mode on my mobile firefox */
		    :root {
		        --color-background-alert-caution: oklch(77.2% 0.074 43.3);
		        --color-background-alert-informational: oklch(42.7% 0.003 106.5);
		        --color-background-alert-success: oklch(77.8% 0.035 116.4);
		        --color-background-alt: oklch(32.6% 0.016 126.9);
		        --color-background-avatar-hover: oklch(21.8% 0.011 60.8);
		        --color-background-avatar-placeholder-accent: oklch(0.9401 0 0);
		        --color-background-avatar-placeholder-base: oklch(0.5452 0 0);
		        --color-background-body-base: oklch(21.8% 0.011 60.8);
		        --color-background-body-transparent: oklch(21.8% 0.011 60.8 / 0.75);
		        /* --color-background-body-transparent: rgb(0 0 0 / 0.4); */
		        --color-background-book-cover-placeholder-accent: oklch(100% 0 0);
		        --color-background-book-cover-placeholder-base: oklch(91.7% 0.018 73.1);
		        --color-background-book-cover-variant-1: oklch(91.6% 0.033 129.7);
		        --color-background-book-cover-variant-2: oklch(90.9% 0.018 279);
		        --color-background-book-cover-variant-3: oklch(90.3% 0.023 0.6);
		        --color-background-book-cover-variant-4: oklch(91.7% 0.018 73.1);
		        --color-background-button-primary-default: oklch(91.7% 0.018 73.1);
		        --color-background-button-primary-disabled: oklch(65% 0.013 286);
		        --color-background-button-primary-hover: oklch(87% 0.055 75.1);
		        --color-background-button-primary-pressed: oklch(84.7% 0.005 67.8);
		        --color-background-button-secondary-disabled: oklch(42.7% 0.003 106.5);
		        --color-background-chip-select-selected: oklch(0.5452 0 0);
		        --color-background-default: oklch(21.8% 0.011 60.8);
		        --color-background-disabled: oklch(84.7% 0.005 67.8);
		        --color-background-divider: oklch(0.5452 0 0);
		        --color-background-elevation: oklch(0.5452 0 0);
		        --color-background-input-base: oklch(32.6% 0.016 126.9);
		        --color-background-input-hover: oklch(0.5452 0 0);
		        --color-background-knh-highlight-base: oklch(37.7% 0.025 138.5);
		        --color-background-notif-badge-base: oklch(59.7% 0.182 35.8);
		        --color-background-notif-scrollbar-thumb: oklch(0.5452 0 0);
		        --color-background-primary-base: oklch(91.7% 0.018 73.1);
		        --color-background-promo-sidebar: oklch(42.7% 0.003 106.5);
		        --color-background-rating-bar-base: oklch(68.2% 0.173 53);
		        --color-background-rating-bar-empty: oklch(74.3% 0.007 286.2);
		        --color-background-rating-star-base: oklch(68.2% 0.173 53);
		        --color-background-rating-star-empty: oklch(0.5452 0 0);
		        --color-background-rating-star-border: oklch(65% 0.013 286);
		        --color-background-spoiler-tooltip-base: oklch(42.7% 0.003 106.5);
		        --color-background-spoiler-visible: oklch(0.9612 0 0);
		        --color-background-tag-accent: oklch(61.7% 0.107 160.8);
		        --color-background-tag-selector-base: oklch(0.9401 0 0 / 20%);
		        --color-background-tag-selector-hover: oklch(0.9401 0 0 / 50%);
		        --color-background-transparent-active: oklch(32.6% 0.016 126.9 / 0.22);
		        --color-background-transparent-hover: oklch(0% 0 0 / 0.05);
		        --color-background-wtr-base: oklch(55.6% 0.086 161.3);
		        --color-background-wtr-hover: oklch(61.7% 0.107 160.8);
		        --color-background-carousel-pagination: oklch(0.5452 0 0);
		        --color-background-icon-default: oklch(0.9612 0 0);
		        --color-border-avatar: oklch(84.7% 0.005 67.8);
		        --color-border-button-secondary-base: oklch(84.7% 0.005 67.8);
		        --color-border-button-secondary-disabled: oklch(74.3% 0.007 286.2);
		        --color-border-button-secondary-pressed: oklch(65% 0.013 286);
		        --color-border-blockquote: oklch(82.7% 0.009 247.9);
		        --color-border-primary: oklch(21.8% 0.011 60.8);
		        --color-border-input-base: oklch(21.8% 0.011 60.8);
		        --color-border-input-radio-base: oklch(74.3% 0.007 286.2);
		        --color-border-wtr-base: oklch(51% 0.078 161.9);
		        --color-border-elevation-medium: oklch(42.7% 0.003 106.5);
		        --color-brand-amazon-accent: oklch(0 0 0);
		        --color-brand-amazon-base: oklch(87.9% 0.116 89.8);
		        --color-brand-amazon-hover: oklch(90% 0.097 90.2);
		        --color-brand-amazon-shadow: oklch(87.9% 0.116 89.8 / 0.5);
		        --color-brand-apple-accent: oklch(1 0 0);
		        --color-brand-apple-base: oklch(0% 0 0);
		        --color-brand-apple-hover: oklch(42.7% 0.003 106.5);
		        --color-brand-apple-shadow: oklch(0% 0 0 / 0.5);
		        --color-brand-facebook-accent: oklch(100% 0 0);
		        --color-brand-facebook-base: oklch(58.9% 0.203 257.9);
		        --color-brand-facebook-hover: oklch(62.4% 0.184 256.7);
		        --color-brand-facebook-shadow: oklch(58.9% 0.203 257.9 / 0.5);
		        --color-divider-default: oklch(42.7% 0.003 106.5);
		        --color-interaction-focus: oklch(100% 0 0);
		        --color-interaction-hoverarea: oklch(42.7% 0.003 106.5);
		        --color-interaction-hoverlink: oklch(65% 0.013 286);
		        --color-internal-icons-background: oklch(0.9612 0 0);
		        --color-internal-icons-with-edge: oklch(84.7% 0.005 67.8);
		        --color-notification-failure: oklch(71.3% 0.16 36.3);
		        --color-notification-info: oklch(69.8% 0.097 67.6);
		        --color-notification-success: oklch(61.7% 0.107 160.8);
		        --color-shadow-button-active: oklch(64.8% 0.151 275);
		        --color-shadow-button-focus: oklch(21.8% 0.011 60.8);
		        --color-shadow-input-warning: oklch(59.7% 0.182 35.8);
		        --color-shadow-transparent-focus: oklch(36.4% 0.148 270.7 / 0.15);
		        --color-text-action-primary-base: oklch(0.9401 0 0);
		        --color-text-action-primary-hover: oklch(0.9612 0 0);
		        --color-text-action-secondary-base: oklch(51% 0.078 161.9);
		        --color-text-action-secondary-hover: oklch(61.7% 0.107 160.8);
		        --color-text-author-base: oklch(69.8% 0.097 67.6);
		        --color-text-body-3: oklch(84.7% 0.005 67.8);
		        --color-text-body-light: oklch(82.7% 0.009 247.9);
		        --color-text-body-standard: oklch(84.7% 0.005 67.8);
		        --color-text-button-disabled: oklch(100% 0 0);
		        --color-text-button-primary-base: oklch(21.8% 0.011 60.8);
		        --color-text-button-primary-disabled: oklch(84.7% 0.005 67.8);
		        --color-text-button-primary-pressed: oklch(42.7% 0.003 106.5);
		        --color-text-button-pressed: oklch(82.7% 0.009 247.9);
		        --color-text-button-secondary-disabled: oklch(32.6% 0.016 126.9);
		        --color-text-button-transparent-base: oklch(100% 0 0);
		        --color-text-button-tag-base: oklch(0.9612 0 0);
		        --color-text-button-wtr-base: oklch(100% 0 0);
		        --color-text-default: oklch(96.1% 0 0);
		        --color-text-disabled: oklch(65% 0.013 286);
		        --color-text-heading-base: oklch(94% 0 0);
		        --color-text-notif-badge-base: oklch(100% 0 0);
		        --color-text-notif-history: oklch(42.7% 0.003 106.5);
		        --color-text-rating-bar-base: oklch(54.5% 0 0);
		        --color-text-spoiler-hidden: oklch(84.7% 0.005 67.8);
		        --color-text-subdued: oklch(82.7% 0.009 247.9);
		        --color-text-warning: oklch(59.7% 0.182 35.8);
		    }

		    /* Search icon svg */

		    button.Header__toggleSearchContainer > i.Icon.SearchIcon > svg > path {
		        fill: var(--neptune);
		    }

			/* Main Pages & Sections */
			body,
			.gr-homePageBody,
			.mainContentFloat,
			#rating_graph,
			.rating_graph,
			.dropdown__menu--wantToReadMenu,
			.gr-popover,
			#editFavGenres .recsNotice,
			.newsHeader,
			.aboutRightColumnWide section,
			.aboutRightColumnWide section h2,
			#box #boxContents {
				background-color: var(--bkg-main);
				color: var(--txt-second);
				font-family: 'Lato', sans-serif;
			}
			body,
			.mainContent {
				background: url("https://raw.githubusercontent.com/holyspiritomb/userstyles/master/goodreads/dark-theme/img/background.jpg");
				background-attachment: fixed;
		        background-position: top left;
				-webkit-background-size: cover;
				-moz-background-size: cover;
				-o-background-size: cover;
				background-size: cover;
			}
		    .Header {
		        background-color: var(--jet);
		    }
			.mainContentContainer#topLanding {
				/* padding: 25px 0 */
			}
			.mainContent {
				/* margin-top: 10px; */
			}
			@media (min-width: 1200px) {
				main {
					/* width: 1350px; */
				}
				.homeSecondaryColumn,
				.homeTertiaryColumn {
					width: 350px;
				}
				.homePrimaryColumn {
					width: 550px;
				}
			}
			/* Site logo */

		    .Header__logo > svg.GoodreadsWordmark > path {
		        fill: var(--neptune);
		    }
			/* .siteHeader__logo, */
			.logo a img,
			#signedOutHome .discoveryBoxDiscovery .discoveryBoxArrow img {
				filter: brightness(4) sepia(55%) hue-rotate(115deg) saturate(34%)
			}
			.siteHeader__logo:not(.siteHeader__logo--doodle) {
				background: url("https://raw.githubusercontent.com/holyspiritomb/userstyles/main/goodreads/dark-theme/img/goodreads_logo.svg") no-repeat;
				background-position: center;
				background-size: 140px 30px;
			}
			.siteHeader__logo.siteHeader__logo--doodle {
				filter: brightness(.75) sepia(55%) hue-rotate(115deg) saturate(34%);
				-webkit-filter: brightness(.75) sepia(55%) hue-rotate(115deg) saturate(34%);
			}
			#siteheader #logo img {
				filter: brightness(2) sepia(55%) hue-rotate(115deg) saturate(54%);
				-webkit-filter: brightness(2) sepia(55%) hue-rotate(115deg) saturate(54%)
			}
			#siteheader #logo {
				position: relative
			}
			#siteheader #logo:after {
				position: absolute;
				right: -4rem;
				top: 0;
				font-size: 13px;
				color: var(--limestone);
			}
			.gr-icon--authorBadge {
				/* filter: brightness(3) sepia(55%) hue-rotate(115deg) saturate(34%) */
			}
			/* Personal Nav icons */
			.headerPersonalNav__icon,
			#signedOutHome #masthead #headline img {
				filter: brightness(1) sepia(55%) hue-rotate(115deg) saturate(34%)
			}
			img.circularIcon[src*="nophoto"],
			img[src*="nophoto"],
			.wantToReadButton__checkIcon--read {
				filter: brightness(0.75) sepia(55%) hue-rotate(115deg) saturate(34%)
			}
			/* Social icons */
			.gr-footer__socialLink img,
			.gr-h1 img,
			.responsiveSiteFooterV2__socialLink img,
			.responsiveSiteFooter__socialLink img {
				filter: invert(1)
			}
			.brownBox a[id*='folder_'] img,
			a img[src*='arrow'] {
				filter: invert(0.75)
			}
			.dropdown__trigger--profileMenu .headerPersonalNav__icon {
				filter: unset
			}
			.gr-iconButton img[src*="close"] img {
				filter: brightness(2)
			}
			.gr-shareButton__icon {
				filter: brightness(185%) hue-rotate(-12deg) saturate(34%)
			}
			#signedOutHome .discoveryBoxDiscovery {
				background-image: linear-gradient(var(--aztec), var(--aztec)), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAoCAYAAAA%2FtpB3AAAAOElEQVQIW2M6uG%2FlfyZGRkYGdIIBCKAsRgYMWXSCAU5gUYzVAAaELA5tCHUQAxjQZIFir16%2FhXAByw8GmnhQCm8AAAAASUVORK5CYII%3D);
				background-blend-mode: saturation;
			}
			#signedOutHome .mainContentContainer {
				background-image: linear-gradient(var(--bkg-main), var(--bkg-main)), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAASCAYAAACaV7S8AAAALElEQVQIW2P4DwRMnz48YWBiAAIIwcjIBCIYgVw4CyLGAGOhSyApBpoBMhQAWY0LCsZmAMgAAAAASUVORK5CYII%3D);
				background-blend-mode: saturation;
			}
			.reviewFormRereading table tr td .readingSessionDatePicker.smallPicker,
			.reviewFormCurrentlyReading table tr td .readingSessionDatePicker.smallPicker,
			.reviewFormRereading table tr td .readingSessionDatePicker.largePicker,
			.reviewFormCurrentlyReading table tr td .readingSessionDatePicker.largePicker {
				position: relative;
				background: unset;
			}
			.reviewFormRereading table tr td .readingSessionDatePicker.smallPicker::after,
			.reviewFormCurrentlyReading table tr td .readingSessionDatePicker.smallPicker::after,
			.reviewFormRereading table tr td .readingSessionDatePicker.largePicker::after,
			.reviewFormCurrentlyReading table tr td .readingSessionDatePicker.largePicker::after {
				border-color: var(--txt-grey) transparent;
				border-style: solid;
				border-width: 4px 4px 0px 4px;
				height: 0px;
				width: 0px;
				content: '';
				position: absolute;
				top: 12px;
				right: 6px;
			}
			/* radio not checked */
			.shelfChooser .shelves li.exclusive {
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABCUlEQVQ4T6WSyyrFURSHv+8JFBPFQF7huJQyMsDESDE3YqKogxlKydQpJkLxCp6ByNCAMVLKIyztY/9Pu+NyTlmzdfn2Wnutn7RZRIwDM8BITt0BV+ptWWrpRMQB0AdcA685NwCkxz7U9aq+BUbEHvCgXrZPkfyImAcm1dXkN8GI2AVe1OOfoCqW4Ql1zYgYBo7U6b+gAj4FGgncBHrUrS7B5bSHBD4C52r6Y0eLiDlg6V9gvdlaNzq2+1rkCtCbOg4BJ+pUl+AZcFidYxt4VxsdzrEA1NR6KYAd4Em9+EUAi8BYumFLAMWN9oF+4AZ4zvHBLLm31Omb5Aq4BswCozmWxJ1Efl9O8gnL7269xo9RNwAAAABJRU5ErkJggg==);
			}
			/* radio checked */
			.shelfChooser .shelves li.exclusive_chosen {
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACFUlEQVQ4T42SzWsTURTFz4yTYN+8ZFLGCSYhs1DxA6FSmjS6cFFXVcGFC6kg+i+IioqrIoIUd3WhGzdd2I0ouOi2i67aVEMRBM1mZpcEEubzDZlOZ+TFiUYQ8cHjLe773Xs55wj4fQQAguM4jUwmsyiK4hwvxXH8KQzDDUVRmgCS9IJ/5oe/ImNsJYqiI77vNz3P6/ICpfSoLMt1SZIGhJAHvBeHR1M45Hnes8Fg0NZ1/QOADIBDadMDAPuGYVzRNO28LMt3OTyCfN9/allWr1KpvAVAAEylMGdDAAEAZhjGYrFYrBNC7gm9Xu8EIeQVpfQGgBwAZavVfDdF6HFOOY61d6l+4Q4AG4DrOM5qkiQvhSAInjDGplVVfQFgeqvV/EhkenJCNDiW01qYbywBsDqdzpKiKAUhDMPv/X5/vVQqvQag7n77+kUQxpr9xJMEB7VTZ84BGLTb7Yu6rt/6PzCO49rpszN/gEEQPGaMaaqqrvBVN3e21/OF/Ow/Vr2pKIoidLvdY7Isv6GUXk/FyW/ubK/l8pSvBtfx9hbmG7dTcbxUnNWxHcu2bVvlcnkttePwhB37YztM07yqadoMIeThrwC4rrtsWZZRrVbf/y0ApmleU1V1llJ6fxyAycg9j6KoxBhruq7b4YVcLlcihNQkSeoSQh5NRm6sw2i6bdtz2Wz2siiKtTTku8PhcKNQKHyeDPkPVC71JS5Paz4AAAAASUVORK5CYII=);
			}
			/* square not check */
			.shelfChooser .shelves li {
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAb0lEQVQ4T+3SsQkCURRE0TMNiIl92IHWtFawBSj2YgHagGwZgoGBDTz5sKGwP9fJJri8x3ADVfXAC8/WFzIlGVJVJ2xw6QR3WDfwijHJbenU/F0Dxz/4Za2q+qlxjnijyxzsscqs0RnbHuVwT3L4AAzAbofbUnZZAAAAAElFTkSuQmCC);
			}
			.shelfChooser .shelves li.chosen {
				background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABQUlEQVQ4T42SsUrDUBSG/9NKoVhqERwqggbkhkxNSBcn+wj1DeykbqKTW30ApU7iUyg4S7u5GFKXlsYh4mDAoS1V6BCSI1dTrCLc3O1yz3f+//7nEAAwcwBgCOBN3hXHJaIjYuZzACsAblOC2wBKEmwDOCWijkrK8fqd4mLhfnN1bSs16Dz1DpmpqZXLe8uFpYNUoOt5ZozIZc7s2EKMvhyqrLq+X4rCaRugx6owdplZ/lENOl6vBUY9k8ublqaNU4EPg0GdKL7OIGtZQnST0f0o+kFwN3wf29lcviG7ygJpMQ6nPpgubN1ozhL/pTj6mFz5wes+wBXmbKOq6zcyellsC6M2P6Z/rc4iB/MLA+sLOapYmvGsBL8t9jeiEF1EuKwaxsnfpZhXPAMwAaDcnKSJtF6kJKkWAFO1csm7Q0THnzQ1vYcGZm2QAAAAAElFTkSuQmCC);
			}
			/* Book Shelf Settings */
			.displayShelfName {
				font-size: 15px
			}
			a.renameUserShelfLnk {
				font-size: 14px
			}
			a[id^='feature_'].unfeatured_link,
			a[id^='featured_'].featured_link {
				position: relative;
			}
			a[id^='feature_'].unfeatured_link img,
			a[id^='featured_'].featured_link img {
				visibility: hidden
			}
			/* radio checked */
			a[id^='featured_'].featured_link:after {
				position: absolute;
				content: '';
				background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAACFUlEQVQ4T42SzWsTURTFz4yTYN+8ZFLGCSYhs1DxA6FSmjS6cFFXVcGFC6kg+i+IioqrIoIUd3WhGzdd2I0ouOi2i67aVEMRBM1mZpcEEubzDZlOZ+TFiUYQ8cHjLe773Xs55wj4fQQAguM4jUwmsyiK4hwvxXH8KQzDDUVRmgCS9IJ/5oe/ImNsJYqiI77vNz3P6/ICpfSoLMt1SZIGhJAHvBeHR1M45Hnes8Fg0NZ1/QOADIBDadMDAPuGYVzRNO28LMt3OTyCfN9/allWr1KpvAVAAEylMGdDAAEAZhjGYrFYrBNC7gm9Xu8EIeQVpfQGgBwAZavVfDdF6HFOOY61d6l+4Q4AG4DrOM5qkiQvhSAInjDGplVVfQFgeqvV/EhkenJCNDiW01qYbywBsDqdzpKiKAUhDMPv/X5/vVQqvQag7n77+kUQxpr9xJMEB7VTZ84BGLTb7Yu6rt/6PzCO49rpszN/gEEQPGaMaaqqrvBVN3e21/OF/Ow/Vr2pKIoidLvdY7Isv6GUXk/FyW/ubK/l8pSvBtfx9hbmG7dTcbxUnNWxHcu2bVvlcnkttePwhB37YztM07yqadoMIeThrwC4rrtsWZZRrVbf/y0ApmleU1V1llJ6fxyAycg9j6KoxBhruq7b4YVcLlcihNQkSeoSQh5NRm6sw2i6bdtz2Wz2siiKtTTku8PhcKNQKHyeDPkPVC71JS5Paz4AAAAASUVORK5CYII=) center center no-repeat;
				background-size: cover;
				width: 16px;
				height: 16px;
				top: -0.25rem;
				left: 0;
			}
			/* radio unchecked */
			a[id^='feature_'].unfeatured_link:after {
				position: absolute;
				content: '';
				background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABCUlEQVQ4T6WSyyrFURSHv+8JFBPFQF7huJQyMsDESDE3YqKogxlKydQpJkLxCp6ByNCAMVLKIyztY/9Pu+NyTlmzdfn2Wnutn7RZRIwDM8BITt0BV+ptWWrpRMQB0AdcA685NwCkxz7U9aq+BUbEHvCgXrZPkfyImAcm1dXkN8GI2AVe1OOfoCqW4Ql1zYgYBo7U6b+gAj4FGgncBHrUrS7B5bSHBD4C52r6Y0eLiDlg6V9gvdlaNzq2+1rkCtCbOg4BJ+pUl+AZcFidYxt4VxsdzrEA1NR6KYAd4Em9+EUAi8BYumFLAMWN9oF+4AZ4zvHBLLm31Omb5Aq4BswCozmWxJ1Efl9O8gnL7269xo9RNwAAAABJRU5ErkJggg==) center center no-repeat;
				background-size: cover;
				width: 16px;
				height: 16px;
				top: -0.25rem;
				left: 0;
			}
			/* square */
			a[id^='disable_sorting_link_'],
			a[id^='enable_sorting_link_'],
			a[id^='enable_sticky_link_'],
			a[id^='exclusive_link_'],
			a[id^='enable_recs_link_'],
			a[id^='no_recs_link_'] {
				position: relative;
			}
			a[id^='disable_sorting_link_'] > img,
			a[id^='enable_sorting_link_'] > img,
			a[id^='enable_sticky_link_'] > img,
			a[id^='exclusive_link_'] > img,
			a[id^='enable_recs_link_'] > img,
			a[id^='no_recs_link_'] > img {
				visibility: hidden
			}
			/* square checked */
			a[id^='disable_sorting_link_']:after,
			a[id^='no_recs_link_']:after {
				position: absolute;
				content: '';
				background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABQUlEQVQ4T42SsUrDUBSG/9NKoVhqERwqggbkhkxNSBcn+wj1DeykbqKTW30ApU7iUyg4S7u5GFKXlsYh4mDAoS1V6BCSI1dTrCLc3O1yz3f+//7nEAAwcwBgCOBN3hXHJaIjYuZzACsAblOC2wBKEmwDOCWijkrK8fqd4mLhfnN1bSs16Dz1DpmpqZXLe8uFpYNUoOt5ZozIZc7s2EKMvhyqrLq+X4rCaRugx6owdplZ/lENOl6vBUY9k8ublqaNU4EPg0GdKL7OIGtZQnST0f0o+kFwN3wf29lcviG7ygJpMQ6nPpgubN1ozhL/pTj6mFz5wes+wBXmbKOq6zcyellsC6M2P6Z/rc4iB/MLA+sLOapYmvGsBL8t9jeiEF1EuKwaxsnfpZhXPAMwAaDcnKSJtF6kJKkWAFO1csm7Q0THnzQ1vYcGZm2QAAAAAElFTkSuQmCC) center center no-repeat;
				background-size: cover;
				width: 16px;
				height: 16px;
				top: -0.25rem;
				left: 0;
			}
			/* square unchecked */
			a[id^='enable_sorting_link_']:after,
			a[id^='enable_sticky_link_']:after,
			a[id^='exclusive_link_']:after,
			a[id^='enable_recs_link_']:after,
			a[id^='enable_recs_link_'][style="display: none;"]:after {
				position: absolute;
				content: '';
				background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAb0lEQVQ4T+3SsQkCURRE0TMNiIl92IHWtFawBSj2YgHagGwZgoGBDTz5sKGwP9fJJri8x3ADVfXAC8/WFzIlGVJVJ2xw6QR3WDfwijHJbenU/F0Dxz/4Za2q+qlxjnijyxzsscqs0RnbHuVwT3L4AAzAbofbUnZZAAAAAElFTkSuQmCC) center center no-repeat;
				background-size: cover;
				width: 16px;
				height: 16px;
				top: -0.25rem;
				left: 0;
			}
			/* Radio/Checkboxes I cannot overwrite */
			tr.elementList[id^='shelf_'] > td > img[alt="Checkbox disabled"],
			tr.elementList[id^='shelf_'] > td > img[alt="Checkbox checked disabled"] {
				filter: invert(100%) brightness(1.5) saturate(90%);
			}
			.listViewIcon.selected,
			.listViewIcon:hover {
				background: linear-gradient(var(--mystic), var(--mystic)), url("https://s.gr-assets.com/assets/layout/list_selected.png") no-repeat;
			}
			.gridViewIcon.selected,
			.gridViewIcon:hover {
				background: linear-gradient(var(--mystic), var(--mystic)), url("https://s.gr-assets.com/assets/layout/grid_selected.png") no-repeat;
			}
			.listViewIcon img,
			.gridViewIcon img {
				right: 3px;
				filter: invert(1) brightness(1.5);
			}
			.myBooksNav ul li {
				display: inline-block;
			}
			.controlGroup a.controlLink.open {
				padding-bottom: 14px
			}
			/* tool tips */
			.tooltipTriggerText .tooltip,
			.tooltipTrigger .tooltip,
			.longTextPopupForm__header,
			.newsMainContent.mainContentFloat,
			.prototip .addbook,
			.wtrButtonContainer .wtrPrompt input[pattern="\\\\d*"],
			#fav_authors .section,
			.gcaRightContainer,
			.gr-contentBoxMargin--large,
			.modal__content,
			.floatingBox,
			.sequenceIndicators__circle {
				background-color: var(--raven);
				color: var(--txt-second);
				border-color: var(--border);
			}
			.tooltipCaret--left {
				border-right-color: var(--border);
			}
			.tooltipCaret--right {
				border-left-color: var(--border);
			}
			/* yet more tooltip styles */
			.prototip {
				color: var(--txt-second);
				overflow: visible
			}
			li.borderMiddle.borderRow[style],
			.shelfChooser .shelves li:hover,
			.shelfChooser .shelves li.hover,
			.shelfChooser .shelves li.hover:hover,
			.shelfChooser .newShelfButtonLi:hover,
			.shelfChooser .newShelfButtonLi.hover {
				background-color: var(--mystic) !important;
			}
			.prototip .prototip_StemBox li.borderMiddle.borderRow[style] {
				background-color: var(--raven) !important;
			}
			/*   .prototip .prototip_StemBox .prototip_Stem > .prototip_StemImage, */
			.prototip .prototip_Stem > .prototip_StemImage[style*="leftmiddle.png"] {
				transform: rotate(270deg);
			}
			div.prototip_StemImage[style] {
				transform: unset;
			}
			div.prototip_StemImage[style],
			.prototip_StemImage {
				-webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
				clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
				background: var(--mine) !important;
			}
			.prototip .borderFrame {
				border: 6px solid var(--mine);
				border-radius: 6px;
			}
			.prototip .borderCenter[style] {
				padding: 0 !important;
			}
			div.prototip_Between[style],
			.borderBottom.borderRow,
			.borderTop.borderRow {
				height: 0 !important;
			}
			.prototip canvas {
				background: transparent
			}
			/* Navigation & Footer */
		    .Header,
		    .Header__contents,
		    .Header__primaryNavContainer,
		    .Header__searchContainer--open,
			.siteHeader__topLine,
			.siteHeader__primaryNavSeparateLine,
			.footerContainer {
				background: var(--jet)
			}
			.primaryNavMenu--siteHeaderBrowseMenu .primaryNavMenu__menu,
			.primaryNavMenu__menu,
			.dropdown__menu--discussions,
			.dropdown__menu--notifications,
			.siteHeader__subNav--profile,
			.dropButton .floatingBox,
			.wtrButtonContainer .wtrShelfMenu,
			.wtrButtonContainer .wtrFloatingBox,
			.readingChallengeBanner .challengeStatsContainer2,
			#books.covers .bookalike:hover .field.actions,
			.previewBook__topBanner,
			.answerButton,
			.tabs .tab,
			.mediumTabs .tab,
			.bigTabs .tab,
			.genreButton:hover,
			.wantToReadMenu__shelfItem:hover,
			.wantToReadMenu__newShelfButtonContainer:hover,
			.controlGroup .open,
			.controlBody,
			.jobsPageCoreValues__colorContainer {
				background: var(--mine)
			}
			.siteHeader__spotlight--browseMenu::before,
			.wtrButtonContainer .wtrPrompt,
			.brownBox,
			.brown_comment,
			li.sortable_item:hover,
			.genreButton,
			.u-beigeBackground,
			.gr-bookSearchResults,
			.gr-newsfeedItem__details {
				background: var(--cape-cod);
				border-color: transparent;
			}
			.featuredGenres__genreSpotlight::before,
			.genreList__genreLink--selected,
			.genreList__genreLink:hover,
			.wtrButtonContainer .wtrShelfMenu > .wtrShelfList > ul.wtrExclusiveShelves > li:hover,
			.wtrButtonContainer .wtrShelfMenu button.wtrExclusiveShelf:hover,
			.wtrButtonContainer .wtrShelfMenu button.wtrAddShelf:hover,
			.wtrButtonContainer .wtrShelfMenu label.wtrExclusiveShelf:hover,
			.wtrButtonContainer .wtrShelfMenu .wtrNonExclusiveShelves label:hover,
			.wtrButtonContainer .wtrShelfMenu .wtrShelfSearchAddShelf button[type="submit"]:hover,
			.categoryContainer .category:hover,
			.answerButton:hover,
			div.navigationBox div.navRow a:hover,
			.h1Shelf,
			.h1Shelf a,
			.greyBox,
			.contentBox,
			.feedFooterReadStatus .brown_comment,
			.feedFooterReview .brown_comment,
			#signedOutHome #discoveryBox {
				background: var(--aztec)
			}
			.h1Shelf a:hover,
			.gr-bookSearchResults__item--active {
				background: var(--corduroy)
			}
			.answerButton:hover,
			.wantToReadMenu__exclusiveShelf {
				color: var(--concrete);
			}
			.answerButton:hover,
			.wantToReadMenu__exclusiveShelf {
				color: var(--concrete);
			}
			.gr-box--withShadow,
			.floatingBox {
				box-shadow: 0 3px 6px oklch(0% 0 0 / 0.2), 0 2px 4px oklch(0% 0 0 / 0.1);
				-webkit-box-shadow: 0 3px 6px oklch(0% 0 0 / 0.2), 0 2px 4px oklch(0% 0 0 / 0.1);
			}
			.gr-box--withShadowLarge,
			#coverImage,
			#books.covers .bookalike .cover img,
			.gr-popover,
			.yearChallengeBooks .yearChallengeCovers .bookCover,
			.showUserChallengePage .yearChallengeCovers .bookCover {
				box-shadow: 1px 6px 12px oklch(0% 0 0 / 0.25), 1px 3px 6px oklch(0% 0 0 / 0.1);
				-webkit-box-shadow: 1px 6px 12px oklch(0% 0 0 / 0.25), 1px 3px 6px oklch(0% 0 0 / 0.1);
			}
			/*-------------
		      TEXT COLORS
		    -------------*/
			/* Nav Link */
			.siteHeader__topLevelLink,
			.primaryNavMenu__trigger {
				color: var(--txt-nav-link)
			}
			/* Nav Link Hover & Active */
			/* Tabs navigation Hover & Active */
			.siteHeader__topLevelLink:hover,
			.primaryNavMenu__trigger:hover,
			html.no-touchevents .dropdown__trigger--personalNav:hover,
			.headerPersonalNav:hover,
			.primaryNavMenu__trigger--active,
			.dropdown__trigger--personalNavActive,
			.tabs .selectedTab,
			.mediumTabs .selectedTab,
			.bigTabs .selectedTab,
			.selectedTab.tabHeader {
				background-color: var(--bkg-nav-link-hover) !important
			}
			/* LINK TEXT */
			.gr-buttonAsLink,
			a,
			.gr-hyperlink,
			.gr-shareButton,
			button.gr-shareButton,
			.actionLink,
			.actionLinkLite,
			.gr-shareButton__textLabel,
			.shelfLink,
			.updateActionLinks a,
			.actionLinkLites a,
			.wtrButtonContainer .ratingStars .clearRating,
			.wtrButtonContainer .wtrPrompt a,
			.communityQuestionPermalink a,
			.communityQAFooter .likeItContainer a.like_it,
			.moreReaderQA a,
			.actionLinks a,
			.wtrButtonContainer .wtrFloatingBox button.wtrSecondaryCtrl,
			.wtrButtonContainer .wtrFloatingBox button.wtrExclusiveShelf,
			.gcaLink,
			a.shelfNominee__title,
			.helpLinks a,
			.userName,
			.gcaAuthor a.authorName,
			a.gcaPollLink,
			.readingYearContent .missingBooksWidget a,
			.userComment,
			.gr-annotatedBooksPage .annotatedBookItem__bookInfo__knhCta,
			.quizTitle,
			.js-readingNote .spoilerContainer__showLink,
			.responsiveSiteFooter__link {
				color: var(--txt-link) !important;
			}
			/* SVG LINK */
			#rating_graph span,
			.rating_graph span svg g rect {
				fill: var(--txt-link);
			}
			/* EXTRA BRIGHT LINKS */
			.newCommentsText,
			.correct,
			.correct a,
			.selectedShelf,
			a.gcaBookTitle--red {
				color: var(--txt-link-bright)
			}
			/* MAIN TEXT */
			.gr-h1,
			.gr-h3,
			.gr-book__titleLink,
			.gr-hyperlink--bold,
			.gr-newsfeedItem__header,
			#bookAuthors .by,
			#bookAuthors .authorName,
			#bookAuthors .authorName__container,
			.bookAuthorProfile__name a,
			.tooltipTriggerText .tooltip a,
			.tooltipTrigger .tooltip a,
			.wtrButtonContainer .wtrShelfMenu li,
			.wtrButtonContainer .wtrShelfMenu button.wtrExclusiveShelf,
			.wtrButtonContainer .wtrShelfMenu button.wtrAddShelf,
			.wtrButtonContainer .wtrShelfMenu label.wtrExclusiveShelf,
			.wtrButtonContainer .wtrShelfMenu .wtrNonExclusiveShelves label,
			.wtrButtonContainer .wtrShelfMenu .wtrShelfSearchAddShelf button[type="submit"],
			.questionText a,
			.yearChallengeModule .challengeBooksRead,
			.authorName,
			tr.update .authorName,
			.yearChallengeBooks .viewBooksHeader .progressText,
			.showUserChallengePage .viewBooksHeader .progressText,
			.detailChallengeTabs .detailChallengeTabHeader,
			.readingChallengeBanner .challengeStatsContainer2 .challengeStatItem,
			.quizQuestionText,
			.quizDescriptionText,
			.quizAnswerText,
			div.navigationBox h3,
			.newsHeaderText,
			div.wtrPrompt.wtrUserStatusPrompt,
			#fav_authors .title a,
			.yyibCtaBanner,
			.yearInBooksUserBlurb,
			.responsiveSiteFooterV2__heading,
			.responsiveSiteFooter__heading,
			.bookMeta .value,
			.keyValue .value,
			.leadParagraph,
			.gr-marketingPageH2 {
				color: var(--txt-main);
				font-family: 'Lato', sans-serif;
			}
			.textColor {
				color: var(--txt-main) !important
			}
			/* SECONDARY TEXT */
			.gr-book__author,
			.gr-book__authorLink,
			.u-defaultType,
			h2,
			h3,
			h4,
			h5,
			.siteHeader__heading,
			H1,
			.h2Container H2,
			.pageHeader h2,
			.pageHeader,
			h1.quoteText,
			h2.brownBackground a,
			.communityAnswerText,
			.gcaHeader,
			.gcaHeader a,
			.aboutRightColumnWide h2,
			small,
			.gr-metaText,
			.tableList th a,
			.prototip .goodreads .toolbar .title,
			.pollAnswer .result,
			.gr-newsfeedItem__resourceNameLink,
			.secondaryCopy,
			.siteAnnouncement__description,
			.siteHeader__subNavLink,
			.tooltip.book-tooltip .addBookTipDescription,
			.bookTitle,
			.wtrButtonContainer .wtrFloatingBox,
			tr.update .bookTitle,
			tr.update .authorTitle,
			.newsfeedItemAnswerText,
			.category__copy,
			.gr-label,
			.gcaSubheader,
			.askTheAuthorCommunityQuestionAnswerContainer__answerText,
			div.navigationBox .badge,
			.box h1,
			.box h2,
			.contentBox .fieldPara label,
			.readingYearContent .categoryHeading,
			.readingYearContent .abstractionWidget,
			.readingYearContent .averageRatingWidget .ratingText,
			.readingYearContent .crowdFavoriteWidget .bookBlurb .details,
			.readingYearContent .missingBooksWidget .titleText,
			div .challenge-on-track,
			.gr-annotatedBooksPage .annotatedBookItem__bookInfo__bookTitle,
			.groupBook .meta .about .value,
			.groupNav h3,
			#signedOutHome h2:first-child,
			#signedOutHome h3:first-child,
			#signedOutHome p:first-child,
			#signedOutHome .discoveryBoxDiscovery .discoveryBoxResultBook .discoveryBoxResultDescriptors,
			.controlGroup .open,
			.controlBody,
			.communityAnswerText .spoiler .spoilerAnswerText,
			.questionText .spoiler .spoilerAnswerText,
			.communityQuestionText .spoiler .spoilerAnswerText,
			.newsfeedItemAnswerText .spoiler .spoilerAnswerText,
			.reviewFormEdit .shelves,
			.communityQuestionText {
				color: var(--txt-second);
				font-family: 'Lato', sans-serif;
			}
			/* GREY TEXT */
			.darkGreyText,
			h2.brownBackground .extraHeader a,
			.gr-comment__rightSideInformation,
			.siteHeader__sponsoredNavLink,
			.kindlePreviewButtonIcon,
			#details,
			.gr-hyperlink--black,
			.gr-hyperlink--black:hover,
			.gr-form__secondaryAction:hover,
			.gr-form--compact__secondaryAction:hover,
			.gr-form--compact__secondaryAction:hover,
			ul.adminLinks li a,
			.copyright,
			.tooltip.book-tooltip .ratingStars .myRating,
			.userReview,
			.by,
			.wtrButtonContainer .wtrPrompt .wtrPromptInstruction,
			.updateAction,
			.updateAction a,
			.quoteText .authorOrTitle,
			.gcaMoreLink,
			.choiceWidget__votesCast,
			.greyText,
			#aboutFollowUs,
			#aboutFollowUs a,
			.chatterSource,
			.readingChallengeDashboard,
			.askTheAuthorCommunityQuestionAnswerContainer__questionText,
			.gcaAuthor .greyText,
			.gcaAuthor .by,
			.readingYearContent .longestShortestBookWidget .bookBlurbs .details,
			.readingYearContent .mostLeastPopularBookWidget .details,
			.readingYearContent .readingChallengeWidget .encouragementMessage,
			.tooltip.book-tooltip .paddedRating,
			.readingTimeline__row,
			.responsiveSiteFooterV2__link,
			.gr-annotatedBooksPage .annotatedBookItem__bookInfo__bookAuthor,
			.gr-h4,
			.js-readingNote .ownerActionContainer .visibleToggleContainer .visibleToggleContainer__label,
			.js-readingNote .ownerActionContainer .deleteContainer .deleteContainer__label,
			.js-readingNote .ownerActionContainer .markAsSpoilerContainer .markAsSpoilerContainer__label,
			.readingNotesBanner__SharedWith,
			.js-readingNote .noteHighlightContainer__location a,
			.js-readingNote .spoilerContainer__message,
			.communityQANewsfeedItem__spoilerWarning,
			.groupBook .meta label,
			.groupBook .meta dt,
			.bookMeta,
			.keyValue,
			.sharePreview__description,
			.addbook .myRating,
			.giveawayTermsContent,
			.jobsListItem__location,
			.myBooksNav ul li span.greyText {
				color: var(--txt-grey);
				font-family: 'Lato', sans-serif;
			}
			/* Input & WHITE text*/
			input[type="text"]::placeholder,
			input[type="number"]::placeholder,
			input[type="search"]::placeholder,
			input[type="email"]::placeholder,
			input[type="number"]::placeholder,
			input[type="password"]::placeholder,
			textarea::placeholder,
			.contentBox input[type="text"]:focus,
			.contentBox input[type="email"]:focus,
			.contentBox input[type="password"]:focus,
			#explore_search_query,
			.searchBox--large__input:active,
			.searchBox--large__input:focus,
			.searchBox--large__input,
			.wtrButtonContainer .wtrFloatingBox .wtrPromptInstruction,
			.tabs .tab,
			.tabs .selectedTab,
			.mediumTabs .tab,
			.mediumTabs .selectedTab,
			.bigTabs .tab,
			.bigTabs .selectedTab,
			.aboutPageTitle,
			.siteAnnouncement__title,
			.communityQuestionSubTitle,
			.infoBoxRowTitle,
			.wantToReadShelfCreator__addNamedShelfButton,
			.wantToReadShelfCreator__showAddShelfTextboxButton,
			.dataTitle,
			.goodreadsAuthor,
			td,
			th,
			#booklists h2,
			#booklists h3,
			.readingChallengeDashboard .progressReport,
			.yearChallengeTabs .yearChallengeTabHeader,
			.formWithLabels label,
			.fakeLabel,
			.readingYearContent .standoutText,
			.readingYearContent .standoutNumber,
			.groupNav a.current {
				color: var(--concrete);
				font-family: 'Lato', sans-serif;
			}
			select[class*='smallPicker'][style],
			select[class*='largePicker'][style] > option,
			select[class*='smallPicker'][style] > option {
				color: var(--concrete) !important;
			}
			/* Input */
			input[type="text"],
			input[type="number"],
			input[type="search"],
			input[type="email"],
			input[type="number"],
			input[type="password"],
			textarea,
			select,
			input[type=checkbox],
			input[type=radio],
			.inlineFormField,
			input[type=text],
			input[type=number],
			input[type=search],
			input[type=email],
			input[type=number],
			input[type=password],
			.contentBox input[type=text],
			.contentBox input[type=email],
			.contentBox input[type=password],
			.wtrButtonContainer .wtrNewUserStatus input,
			.wtrButtonContainer .wtrUserStatusConfirmation input,
			.js-readingNote .noteHighlightTextContainer__noteContainer .noteContainer__noteText,
			#signedOutHome #sitesearch input,
			#signedOutHome #navBar #signInForm input[type="email"],
			#signedOutHome #navBar #signInForm input[type="text"],
			#signedOutHome #navBar #signInForm input[type="password"],
			.shelfChooser .chooseShelvesLink,
			.reviewFormRereading table tr td .readingSessionDatePicker select,
			.reviewFormCurrentlyReading table tr td .readingSessionDatePicker select {
				background-color: var(--cape-cod);
				border-color: transparent;
				color: var(--concrete);
				font-family: 'Lato', sans-serif;
			}
			.wtrButtonContainer .wtrNewUserStatus input,
			.wtrButtonContainer .wtrUserStatusConfirmation input {
				background-color: var(--cape-cod) !important;
				border-color: transparent !important;
				color: var(--concrete) !important;
			}
			/* Focus Input Borders */
			.gr-commentForm__textarea:focus,
			input[type="text"]:focus,
			input[type="number"]:focus,
			input[type="search"]:focus,
			input[type="email"]:focus,
			input[type="number"]:focus,
			input[type="password"]:focus,
			textarea:focus,
			select:focus,
			input[type=checkbox]:focus,
			input[type=radio]:focus,
			.inlineFormField:focus,
			.contentBox input[type=text]:focus,
			.contentBox input[type=email]:focus,
			.contentBox input[type=password]:focus,
			.js-readingNote .noteHighlightTextContainer__noteContainer .noteContainer__noteText:focus,
			#signedOutHome #sitesearch input:focus,
			#signedOutHome #navBar #signInForm input[type="email"]:focus,
			#signedOutHome #navBar #signInForm input[type="text"]:focus,
			#signedOutHome #navBar #signInForm input[type="password"]:focus {
				background-color: var(--mine);
				border-color: transparent;
				box-shadow: none
			}
			/* Cards - Feed / Progress update popup */
			.gr-newsfeedItem,
			.siteAnnouncement,
			div.navigationBox,
			#choiceBody .rightContainer,
			.longTextPopupForm,
			.gr-childNewsfeedItem__header {
				background-color: var(--bkg-card);
				border-color: var(--border);
			}
			.gr-newsfeedItem,
			.gr-homePageRailContainer,
			.showForLargeWidth,
			.gr-footer__siteLinks,
			.mainContentFloat,
			.siteAnnouncement,
			.gr-childNewsfeedItem__header,
			.aboutWrapper,
			.gr-container-fluid {
				background-color: var(--bkg-card);
				padding: 20px;
				border-radius: 10px;
				border: none;
				margin-top: 8px;
				box-shadow: 2px 2px 5px oklch(0% 0 0 / 0.3);
			}
			/* Card Footer / Progress update popup header */
			.likeInformation,
			.gr-commentForm,
			.gr-comments,
			.categoryContainer .category,
			div.navigationBox div.navigationList,
			.u-beigeBackground,
			.editorialCard,
			.readingYearContent .reviewDisplay,
			.responsiveSiteFooter,
			.responsiveSiteFooterV2 {
				background-color: var(--bkg-card-foot);
				border-color: var(--border);
			}
			/* Child News Feed Item (Author update/likes a post) */
			.gr-childNewsfeedItem__header {
				border: none;
				border-top-left-radius: 10px;
				border-top-right-radius: 10px;
			}
			.gr-childNewsfeedItem__header::after {
				border-color: var(--border)
			}
			.newsfeedNoteHighlightTextContainer__highlightText span {
				padding: 0.25rem 0.25rem 0.25rem 0;
				box-shadow: -0.25rem 0 0 var(--conch);
			}
			.gr-newsfeedItem.gr-mediaBox.gr-childNewsfeedItemContainer {
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}
			/* Progress update popup */
			.u-beigeBackground {
				border-color: transparent
			}
			.longTextPopupForm {
				border: 3px solid var(--border);
				border-radius: 6px;
			}
			.longTextPopupForm__header,
			.longTextPopupForm__remainingCharacterCount,
			.editorialCard__body,
			.gr-h2 {
				color: var(--alabaster)
			}
			/* Border Color */
			hr,
			h1,
			.circularIcon--border,
			img.circularIcon--medium.circularIcon--border,
			.gr-commentForm__textarea,
			.gr-homePageRailContainer,
			.gr-book--border,
			.communityQANewsfeedItem__question,
			.siteHeader__navDivider,
			h2.brownBackground,
			.elementList,
			.noAnswersMessage,
			.noQuestionsMessage,
			.reviewControls,
			.gr-form__submitButton,
			.dropButton .floatingBox,
			#rating_graph span,
			.rating_graph span,
			#leadercol,
			.folder .brownBox,
			.tableList th,
			.horizontalGreyDivider,
			.wtrButtonContainer .wtrShelfMenu > .wtrOtherShelfOptions > label.wtrAddShelf,
			.wtrButtonContainer .wtrShelfMenu,
			.wtrButtonContainer .wtrShelfMenu > .wtrOtherShelfOptions > label.wtrAddShelf,
			.wtrButtonContainer .wtrShelfMenu > .wtrOtherShelfOptions,
			.wtrButtonContainer .wtrFloatingBox,
			.tableListReverse td,
			.tableListReverse th,
			.Updates,
			.userProfileName,
			.wtrButtonContainer .wtrRight,
			.siteHeader__dropdownHeading,
			.gr-notification,
			.answerButton,
			.rightedBox,
			.bigTabs,
			.mediumTabs,
			.tabs,
			div.navigationBox div.navRow,
			.genreButton:hover,
			.wantToReadMenu__newShelfButtonContainer,
			.gr-newsfeedItem,
			.communityQuestionAndAnswer,
			h1.authorName,
			.gcaLink--block,
			.readingChallengeDashboard,
			.yearChallengeTabs,
			.challengeParticipants .challengeProgress,
			.yearChallengeBooks .missingBooksWidget,
			.showUserChallengePage .missingBooksWidget,
			.detailChallengeTabs,
			.gr-bookSearchResults__item,
			.box h2,
			.listElement,
			.footerCtaBanner,
			.readingYearContent .missingBooksWidget,
			.readingYearContent .readingChallengeWidget,
			.mainContentContainer#topLanding .contentBox,
			.gr-annotatedBooksPage .annotatedBooksPage__collection__descriptionContainer,
			.gr-annotatedBooksPage .annotatedBookItem,
			.readingNotesOwnerShareContainer,
			.readingNotesBookDetailsContainer,
			.js-readingNote,
			.groupNav .actionLinkLites,
			#signedOutHome .featureTeaserBox .listTeaser,
			.shareModal__previewContainer,
			.shareModal__bottomContainer--social,
			.shelfChooser .shelves li.exclusive,
			.shelfChooser .newShelfButtonLi,
			.communityAnswer,
			.leftContainer #prevNext {
				border-color: var(--border);
			}
			#descriptionContainer,
			.readingTimeline__text,
			#nextGroupBooks .groupBook,
			#nextGroupBooks .boxHeader,
			#nextGroupBooks .boxFooter,
			.toolset,
			.reviewFormEdit .separator,
			.reviewFormRereading table tr td .pickerDivider,
			.reviewFormCurrentlyReading table tr td .pickerDivider,
			.newsfeedNoteHighlightTextContainer--withBorder {
				border-color: var(--border-bright);
			}
			/* Tab navigation */
			.tabs .tab,
			.tabs .selectedTab,
			.mediumTabs .tab,
			.mediumTabs .selectedTab,
			.bigTabs .tab,
			.bigTabs .selectedTab {
				border-color: var(--txt-link);
				transition: all 0.2s ease-in-out
			}
			.tabs .tab,
			.mediumTabs .tab,
			.bigTabs .tab,
			#signInForm .gr-button.gr-button--dark,
			.reviewFormRereading table tr td .startedAtMonth,
			.reviewFormRereading table tr td .endedAtMonth,
			.reviewFormCurrentlyReading table tr td .startedAtMonth,
			.reviewFormCurrentlyReading table tr td .endedAtMonth,
			.reviewFormRereading table tr td .readingSessionDatePicker select,
			.reviewFormCurrentlyReading table tr td .readingSessionDatePicker select,
			.reviewFormRereading table tr td .startedAtDay,
			.reviewFormRereading table tr td .endedAtDay,
			.reviewFormCurrentlyReading table tr td .startedAtDay,
			.reviewFormCurrentlyReading table tr td .endedAtDay,
			.reviewFormRereading table tr td .startedAtYear,
			.reviewFormRereading table tr td .endedAtYear,
			.reviewFormCurrentlyReading table tr td .startedAtYear,
			.reviewFormCurrentlyReading table tr td .endedAtYear {
				border-color: transparent
			}
			.tabs .tab:hover,
			.mediumTabs .tab:hover,
			.bigTabs .tab:hover,
			.tabs .selectedTab:hover,
			.bigTabs .selectedTab:hover,
			.mediumTabs .selectedTab:hover {
				border-bottom: 2px solid var(--txt-link)
			}
			.wtrButtonContainer .wtrPrompt::before,
			.wtrButtonContainer .wtrPrompt::after {
				border-color: var(--cape-cod) transparent
			}
			/* Navigation box */
			div.navigationBox a.helpTip,
			div.navigationBox div.navRow a:hover,
			div.navigationBox div.navRow a.selected,
			div.navigationBox div.navRow a.selected:hover {
				background: var(--mine);
			}
			div.navigationBox div.navRow a:hover,
			div.navigationBox div.navRow a.selected,
			div.navigationBox div.navRow a.selected:hover {
				padding-left: 10px;
				left: 0;
				width: 260px;
			}
			div.navigationBox div.navRow:first-of-type a:hover,
			div.navigationBox div.navRow:first-of-type a.selected,
			div.navigationBox div.navRow:first-of-type a.selected:hover,
			.noteHighlightTextContainer .likeInformation {
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
			}
			div.navigationBox div.navRow:last-of-type a:hover,
			div.navigationBox div.navRow:last-of-type a.selected,
			div.navigationBox div.navRow:last-of-type a.selected:hover {
				border-bottom-left-radius: 6px;
				border-bottom-right-radius: 6px;
			}
			.prototip:not(.prototipAllowOverflow) .prototip_StemImage {
				transform: rotate(90deg) translateY(-10px);
			}
			.prototip .goodreads,
			.prototip .goodreads .toolbar {
				background: transparent
			}
			#books.table tbody tr {
				border-top-color: var(--border);
				border-bottom-color: var(--border);
			}
			/* User & Author icon images */
			.circularIcon--border {
				background-color: var(--bkg-main);
				border-color: var(--border-bright);
			}
			.userRating__star,
			.choiceWidget__title {
				background-color: transparent
			}
			/* PROGRESS BAR */
			progress[value] {
				-webkit-appearance: none;
				appearance: none;
			}
			/* Firefox */
			/* Notice Box */
			progress,
			.readingTimeline__progressContainer,
			.graphContainer,
			.challengeProgress .graphContainer,
			.barchart {
				background: var(--green-shadow);
			}
			progress::-moz-progress-bar,
			.readingTimeline__progress,
			.graphBar,
			.readingTimeline__bullet {
				background: var(--robin);
			}
			/* Webkit */
			progress[value]::-webkit-progress-bar,
			.readingTimeline__progressContainer,
			.graphContainer,
			.readingYearContent .readingChallengeWidget .readingChallengeProgressBar .challengeProgressBar .graphContainer,
			.readingYearContent .readingChallengeWidget .readingChallengeProgressBar .challengeProgressBar .graphContainerMobile,
			.sequenceIndicators__circle--selected {
				background: var(--green-shadow);
			}
			progress[value]::-webkit-progress-value,
			.readingTimeline__progress,
			.graphBar,
			.readingYearContent .readingChallengeWidget .readingChallengeProgressBar .challengeProgressBar .graphBar,
			.datum {
				background: var(--robin);
			}
			.left.data:hover .barchart {
				background: var(--conch);
			}
			.left.data:hover .datum {
				background: var(--elm);
			}
			/* Buttons */
			.gr-button,
			.gr-form__submitButton,
			.buttonBar,
			.wtrButtonContainer .wtrLeft.wtrDown,
			.gr-form--compact__submitButton,
			.searchBox--large__button,
			.large.button,
			.buttonToggle,
			.wantToReadButton__leftShelved,
			.friendFollowButton,
			.tooltipTriggerText .tooltip a.buttonBar,
			.tooltipTrigger .tooltip a.buttonBar,
			.tooltipTrigger .tooltip a.kcrPreviewButton,
			.tooltipTrigger .tooltip a.syncPreviewButton,
			.js-readingNote .noteHighlightTextContainer__highlightText--highlighted > span,
			.newsfeedNoteHighlightTextContainer__highlightText span,
			#signedOutHome #newAccountBox .button,
			.gr-button.gr-button--dark,
			.buttons .button {
				background-color: var(--conch);
				color: var(--space);
				border-color: var(--border);
			}
			html.desktop .wtrButtonContainer .wtrLeft.wtrDown,
			.js-readingNote .noteHighlightTextContainer__highlightText {
				border-color: var(--conch)
			}
			.gr-button:hover,
			.gr-form__submitButton:hover,
			.buttonBar:hover,
			.gr-form--compact__submitButton:hover,
			.searchBox--large__button:hover,
			.large.button:hover,
			.buttonToggle:hover,
			.wantToReadButton__leftShelved,
			.friendFollowButton:hover,
			.tooltipTriggerText .tooltip a.buttonBar:hover,
			.tooltipTrigger .tooltip a.buttonBar:hover,
			.tooltipTrigger .tooltip a.kcrPreviewButton:hover,
			.tooltipTrigger .tooltip a.syncPreviewButton:hover,
			#signedOutHome #newAccountBox .button:hover,
			.gr-button.gr-button--dark:hover,
			.buttons .button:hover,
			.buttons .button.selected {
				background-color: var(--powder-ash);
			}
			.gr-button:disabled,
			.buttonToggle:disabled,
			.gr-form__submitButton:disabled {
				background-color: var(--bkg-card);
				color: var(--mystic);
				border-color: var(--border);
				cursor: default;
			}
			.gr-button.gr-button--quiet,
			.gr-button.gr-button--caretRight,
			.gr-button--caretRight:hover,
			.gr-button.gr-button--small,
			.yearChallengeModule .viewChallenge {
				color: var(--txt-second);
				border-color: var(--border);
				background-color: transparent;
			}
			.jobsValuesButton {
				border: 2px solid var(--border)
			}
			.jobsValuesButton:hover {
				background-color: var(--border);
				box-shadow: none;
			}
			.gr-button.gr-button--quiet:hover,
			.gr-button.gr-button--small:hover,
			.button.orange:hover {
				color: var(--concrete);
				background-color: var(--bkg-nav-link-hover);
				border-color: var(--bkg-nav-link-hover);
			}
			a.gr-button--choice,
			a.gr-button--dark,
			a.gr-button--red,
			a.gr-button--teal,
			.button,
			.wantToReadButton__leftUnshelved,
			.dropdown--wantToReadMenu,
			.wantToReadButton__leftUnshelved,
			.gr-button--choice,
			html.desktop .wtrButtonContainer .wtrRight.wtrDown,
			html.desktop .wtrButtonContainer .wtrRight.wtrDown:hover,
			html.desktop .wtrButtonContainer .wtrLeft button.wtrToRead,
			html.desktop .wtrButtonContainer .wtrRight.wtrUp,
			html.desktop .wtrButtonContainer .wtrUp .center-ratings .legacyWantToReadButton .button,
			.legacyWantToReadButton .button,
			.legacyWantToReadButton .button .smallButton,
			.friendFollowButton--dark,
			.readingNotes__HelpTip,
			.button.orange {
				background: var(--bkg-button);
				color: var(--txt-button);
				border-color: var(--border);
			}
			.dropdown--wantToReadMenu,
			.wtrButtonContainer .wtrRight {
				border-left-color: var(--neptune) !important;
			}
			a.gr-button--choice:hover,
			a.gr-button--dark:hover,
			a.gr-button--red:hover,
			a.gr-button--teal:hover,
			.wantToReadButton__leftUnshelved:hover,
			.dropdown--wantToReadMenu:hover,
			.gr-button--choice:hover,
			html.desktop .wtrButtonContainer .wtrLeft button.wtrToRead:hover,
			html.desktop .wtrButtonContainer .wtrRight.wtrUp:hover,
			.legacyWantToReadButton .button:hover,
			.friendFollowButton--dark:hover {
				background: var(--bkg-button-hover);
			}
			.wantToReadButton__leftUnshelvedButton,
			.wantToReadButton__leftUnshelvedButton:hover,
			.friendFollowButton--dark,
			.jobsValuesButton {
				color: var(--txt-button);
			}
			/* Notice Box */
			.noticeBox,
			.noticeBox ul,
			.noticeBox ol,
			.noticeBox p,
			.noticeBox td,
			.noticeBox th,
			#signedOutHome #masthead #newAccountBox h2,
			#connectPrompt .connectPromptHolder {
				color: var(--space)
			}
			.noticeBox,
			#connectPrompt .connectPromptHolder {
				background: var(--mint-ice);
				border: 3px solid var(--green-shadow);
				border-radius: 6px;
			}
			/*
		    -------------
		    QUESTIONS
		    -------------
		    */
			/* author name */
			.communityQABookInfo .authorInfoAndActions .authorName,
			.wtrButtonContainer .wtrLeft.wtrDown .gr-form.gr-form--compact {
				color: var(--txt-main);
			}
			.communityQuestion .fullQuestionBody,
			.shelfChooser .shelfChooserWrapper,
			.jobsValuesBox {
				background-color: var(--aztec)
			}
			.communityQuestion .triangle {
				border-color: var(--aztec) transparent transparent transparent
			}
			ul.communityQAFooter.answerFooter .footerItem.comment a,
			.qaInfoModule a {
				color: var(--txt-link)
			}
			.gr-form__secondaryAction,
			.gr-form--compact__secondaryAction {
				color: var(--txt-grey)
			}
			/*
		    -------------
		    EXTRA FEED STYLING
		    -------------
		    */
			/* card feed */
			.gr-newsfeedItem,
			.gr-newsfeedItem__details,
			.js-readingNote .noteHighlightTextContainer__noteContainer .noteContainer__noteText.noEdit {
				border-radius: 10px;
				padding: 1rem 0.75rem 0;
				border: 0;
			}
			/* card author icon */
			.gr-newsfeedItem__headerIcon {
				margin-left: -2.15rem;
			}
			/*----------
		    BORDER RADIUS
		    -----------*/
			/* card book border */
			.gr-book--border,
		    .gr-popover,
			#choiceBody .rightContainer,
			.readingChallengeBanner .bannerYear,
			.readingChallengeBanner .challengeStatsContainer2,
			.readingChallengeDashboard,
			.newsMainContent.mainContentFloat,
			.greyBox,
			#fav_authors .section,
			.readingYearContent .missingBooksWidget,
			.readingYearContent .readingChallengeWidget,
			.aboutHeaderImage img,
			.centered img,
			.jobsValuesBox,
			.gr-editorialBlogPost__image,
			.gr-newsfeedItem__details,
			.js-readingNote .noteHighlightTextContainer__noteContainer .noteContainer__noteText.noEdit,
			.communityQANewsfeedItem__question,
			.siteAnnouncement,
			.siteAnnouncement__masthead img,
			.shareModal__previewContainer,
			.editorialCard,
			.editorialCard img,
			#box,
			#box #boxContents,
			.communityQuestion .fullQuestionBody,
			.newsfeedNoteHighlightTextContainer--withBorder {
				border-radius: 6px;
			}
			.readingYearContent .readingChallengeWidget .readingChallengeBanner .bannerYear,
			.folder .brownBox,
			.tableList th,
			.siteAnnouncement__masthead img,
			.editorialCard img {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}
			.editorialCard .editorialCard__image--left img {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
			.gr-book {
				margin-bottom: 0.75rem;
			}
			/* card footer width expansion */
			.likeInformation,
			.gr-newsfeedItem__footer .gr-comments,
			.gr-newsfeedItem__footer,
			.gr-commentForm {
				width: calc(100% + 0.25rem);
				margin-left: -0.75rem;
				padding: 0 0.25rem 1rem 0.75rem;
				border: 0;
			}
			.likeInformation,
			.js-readingNote .noteHighlightTextContainer__noteContainer .noteContainer__noteText.noEdit {
				padding-top: 1rem;
				padding-bottom: 0.5rem;
			}
			.noteHighlightTextContainer .likeInformation,
			.noteHighlightTextContainer .gr-commentForm {
				width: unset;
				margin-left: unset;
				padding: 8px;
			}
			.gr-comments__seeAllLinkBox {
				margin-top: -0.5rem
			}
			.noteHighlightTextContainer .gr-comments__seeAllLinkBox {
				margin-top: 0
			}
			.gr-newsfeedItem__footer {
				margin: 0 -0.75rem;
				padding: 0 0.75rem;
			}
			.gr-newsfeedItem__footer .gr-comments {
				width: calc(100% + 0.25rem);
			}
			.gr-commentForm {
				border-bottom-left-radius: 10px;
				border-bottom-right-radius: 10px;
			}
			/* list tweaks */
			.tableList td,
			.tableList th,
			.quote,
			.brownBox,
			.newsMainContent.mainContentFloat {
				padding: 1rem 0.5rem;
			}
			.brownBox {
				padding: 0.5rem;
				border-radius: 6px
			}
			.img,
			.blogWidth,
			.twoAcross,
			.headerImage,
			.controlBody,
			.gr-mediaFlexbox__media,
			.floatingBox {
				border-radius: 3px
			}
			/* border removal */
			.u-topGrayBorder,
			.gr-commentForm__textarea,
			.readerQAForm .textInput,
			div.bookRow,
			.tableList td,
			.tableList th,
			.quote,
			.u-bottomGrayBorder,
			.editorialCard,
			.shareBarContainer,
			.shareBarContainerLast,
			.shareBarContainerDarkBorder,
			.wtrButtonContainer .wtrPrompt input[pattern="\\\\d*"],
			.controlGroup .open,
			.controlBody,
			.siteAnnouncement {
				border: 0;
			}
			/* box-shadow removal */
			.gr-commentForm__textarea:focus,
			.contentBox,
			.jobsValuesBox,
			.jobsValuesButton,
			.mainContentContainer#topLanding {
				box-shadow: none;
				-webkit-box-shadow: none;
			}
			/* .distractionless #header { */
				/* margin-bottom: 0 */
			/* } */
			div.bannerYear[style] {
				background-color: var(--elm) !important
			}
			/* Best of Lists */
			.gcaDivider,
			.gcaDivider__centerpiece {
				height: 0
			}
			/* News & Interviews tweaks */
			.newsMainContent.mainContentFloat,
			#box {
				background: transparent;
			}
			/* Revert serif to sans-serif */
			.newsContainer,
			.comment .reviewText {
				font-family: "Lato", "Helvetica Neue", "Helvetica", -apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif
			}
			#box #boxContents {
				margin-top: 0;
				padding-top: 22px;
			}
			/* Review comments */
			.reviewFooter > div[id*='comments_for'] div:first-child {
				border-top-left-radius: 6px;
				border-top-right-radius: 6px;
			}
			.reviewFooter > div[id*='comments_form_review'].brown_comment {
				border-bottom-right-radius: 6px;
				border-bottom-left-radius: 6px;
			}
			.reviewFooter > div[id*='comments_form_review'].brown_comment > textarea,
			.reviewFooter > div[id*='comments_form_review'].brown_comment #comment_body_usertext,
			.shelfChooser input[type=text] {
				background-color: var(--asher)
			}
			/* Remove top banner */
			.siteHeader__topFullImageContainer {
				display: none;
			}
			html.withSiteHeaderTopFullImage .siteHeaderBottomSpacer {
				padding-bottom: 96px;
			}
			html.withSiteHeaderTopFullImage .primaryNavMenu__menu,
			html.withSiteHeaderTopFullImage .dropdown__menu--profileMenu,
			html.withSiteHeaderTopFullImage .dropdown__menu--siteHeader {
				top: initial
			}
		    div.TruncatedContent__text {
				color: var(--concrete);
		    }
		    div.TruncatedContent__text:has(+div.TruncatedContent__gradientOverlay) {
		        background-image: -webkit-linear-gradient(oklch(100% 0 0), oklch(100% 0 0 / 0) 144px);
		        color: transparent;
		        -webkit-text-fill-color: transparent;
		        background-clip: text;
		    }
		    div.TruncatedContent__gradientOverlay {
		        background-image: none;
		    }
		    @media (min-width: 600px) {
		        div.ReviewsList{
		            background-color:oklch(0% 0 0 / 0.3);
		        }
		        div.pageContent,
		        div.mainContentFloat {
		            background-color: oklch(0% 0 0 / 0.85);
		        }
		    }

		    /* new goodreads book pages */

		    @media (min-width: 600px) {
		        main.PageFrame__main.BookPage {
		            background-color:oklch(0% 0 0 / 0.4);
		        }
		    }
		    .gr-popover {
		        border-color: var(--border);
		        border-width: thin;
		    }
		`;
}
if (location.href.startsWith("https://www.goodreads.com/book/show/")) {
  css += `
      div.BookPageMetadataSection__description {
          margin-bottom:15px;
          margin-top: 15px;
      }
      @media (max-width: 600px) {
          div.BookPage__rightColumn {
              backdrop-filter: brightness(70%);
              border-radius: 7px;
              padding-left: 15px;
              padding-right: 15px;
              padding-top: 10px;
          }
      }
      .Label__generic > span.Text,
      .ChoiceAwardBadge__flag > span.Text {
          color: var(--jet);
      }
      .Formatted .spoiler__control:checked + .spoiler{
          background-color: var(--color-background-wtr-base) !important;
      }
  `;
}
if (location.href.startsWith("https://www.goodreads.com/review")) {
  css += `
      @media (max-width: 600px) {
          html.desktop textarea[cols="55"] {
              max-width: 100%;
          }
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

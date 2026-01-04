// ==UserScript==
// @name AO3 Yet Another Dracula (UI)
// @namespace archiveofourown.org
// @version 20240807.23.18
// @description Dracula theme for Archive Of Our Own
// @homepageURL https://github.com/LGZeldner/AO3-dracula
// @grant GM_addStyle
// @run-at document-start
// @match *://*.archiveofourown.org/*
// @match *://*.archiveofourown.com/*
// @match *://*.archiveofourown.gay/*
// @match *://*.archiveofourown.net/*
// @match *://*.ao3.org/*
// @match *://*.archive.transformativeworks.org/*
// @match *://*.insecure.archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/503330/AO3%20Yet%20Another%20Dracula%20%28UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503330/AO3%20Yet%20Another%20Dracula%20%28UI%29.meta.js
// ==/UserScript==

(function() {
let css = `
/*
Table of Contents
**0** fonts, colors, spacing
**1** common rules (default skin overhaul)
*< background
*< cards
*<< main
*<< accent
*<< secondary
*<< notifications 
*<<< normal 
*<<< caution
*<<< error 
*< color
*< links
*< accent
*< no border
*< new border
*< no effects
*< gradients
*< recolored pictures
*< float clearfix hack
**2** font
*< main font
*< work text, summary, comment
*< headings
*< monospace
*< list markers
**3** interactive
*< tabs
*< dropdown
*<< tooltip
*<< calendar
*< modal
*< buttons
*<< hover
*<< arrow buttons
*<< rss
*<< help
*<< tags
*<< pairings
*< input fields
*< checkbox, radio
**4** forms
*< filters
*< toggle forms
*< complex forms
*<< rich text editor
**5** lists, groups
*< alphabet
*< tables 
**6** pages adjustments
*< main page
*< header
*< footer
*< profile
*<< inbox
*<< statistics
*< work
*<< comments
*< collections
*< faq
*< news
**7** visited links
**Extra** background fixes for dracula theme for AO3 & Kudosed and Seen history
**8** media rules
*/
/**0** fonts, colors, spacing */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap');
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap");
/* dracula ui colors */
:root {
    --black: #21222c;
    --blackSecondary: #414558;
    --disabled: #6c7393;
    --greySecondary: #626784;
    --greyTernary: #b6b9c9;
    --white: #f8f8f2;
    --cyan: #80ffea;
    --green: #8aff80;
    --orange: #ffca80;
    --pink: #ff80bf;
    --purple: #9580ff;
    --purpleSecondary: #d4ccff;
    --red: #ff9580;
    --yellow: #ffff80;
    --cyan-transparent: rgba(128,255,234,.1);
    --green-transparent: rgba(138,255,128,.1);
    --orange-transparent: rgba(255,202,128,.1);
    --orange-nontransparent: #383435;
    --pink-transparent: rgba(255,128,191,.1);
    --pink-nontransparent: #382C3B;
    --purple-transparent: rgba(149,128,255,.1);
    --red-transparent: rgba(255,149,128,.1);
    --yellow-transparent: rgba(255,255,128,.1);
    --purple-300: rgba(149,128,255,.3);
    --purple-400: rgba(149,128,255,.4);
    --purple-500: rgba(149,128,255,.5);
    --purple-600: rgba(149,128,255,.6);
    --purple-700: rgba(149,128,255,.7);
    --purple-800: rgba(149,128,255,.8);
    --purple-900: rgba(149,128,255,.9);
    --gradientDegree: 135deg;
    --purple-pink: linear-gradient(var(--gradientDegree),var(--purple) 0%,var(--pink) 100%);
    --cyan-purple: linear-gradient(var(--gradientDegree),var(--cyan) 0%,var(--purple) 100%);
    --pink-yellow: linear-gradient(var(--gradientDegree),var(--pink) 0%,var(--yellow) 100%);
}
:root {
    --font-ao3-serif: Georgia, serif;
    --font-monospace: 'IBM Plex Mono', 'Monaco', 'Consolas', 'Courier New', Courier, monospace;    
	--font-data: var(--font-monospace);
    --font-sans-serif: 'IBM Plex Sans', 'DejaVu Sans', 'Helvetica Neue', 'Trebuchet MS', Helvetica, sans-serif;
	--font-service: var(--font-sans-serif);
	--font-title: var(--font-ao3-serif);
	--font-work: var(--font-sans-serif);
	--font-xs: 0.75rem;
    --font-sm: 0.875rem;
    --font-md: 1rem;
    --font-lg: 1.125rem;
    --font-xl: 1.25rem;
    --font-xxl: 1.75rem;
    --font-w-l: 300;
    --font-w-sb: 600;
	
    --background-main: var(--black);
	--background-card: #282a36; 
	--background-secondary: #333540; 
	--background-selection: #44475A;
    --hover: rgba(255, 255, 255, .09);    
	--hover-opaque: #35363F;
    --background-button: var(--orange-transparent);
    --background-button-opaque: var(--orange-nontransparent);
    --background-button-focus: var(--background-button-opaque);
    --background-tag: var(--blackSecondary);
    --background-disabled: var(--background-main);
    --background-disabled-opaque: var(--background-main);
    --background-dropdown: var(--hover-opaque);
    --background-input: #282a36;
    --background-accent: var(--purple-transparent);
    --background-accent-opaque: #2C2B40;
    --background-approve: var(--green-transparent);
    --background-notice: var(--cyan-transparent);
    --background-error: #382E35;
    --background-caution: #383935;
    --background-collections: rgba(97, 108, 144, .5); 

    --accent: var(--purple);
	--accent-900: var(--purple-900);
	--accent-800: var(--purple-800);
	--accent-700: var(--purple-700);
	--accent-600: var(--purple-600);
	--accent-500: var(--purple-500);
	--accent-400: var(--purple-400);
	--accent-300: var(--purple-300);	
        
    --border-card: var(--background-card);
    --border-interactive-card: var(--blackSecondary);
    --border-alt: #4c5067;
    --border-blockquote: var(--orange);
    --border-track: var(--orange);
    --border-purple-pink: var(--purple-pink) 30 stretch; 
    --border-cyan-purple: var(--cyan-purple) 30 stretch; 
    --border-pink-yellow: var(--pink-yellow) 30 stretch; 
	--border-include: var(--green);
    --border-exclude: var(--red);
    --border-checkbox: var(--greySecondary);
    --border-radio: var(--border-checkbox);
    --border-accent-gradient: var(--border-purple-pink);
    --border-width: 0.125em;

    --text-main: var(--white);
    --text-tab-inactive: var(--text-main);
    --text-tab-hover: var(--text-main);
	--text-tab-current: var(--pink);
    --text-button: var(--orange);
    --text-button-hover: var(--text-main);
    --text-button-focus: var(--text-button);
    --text-button-accent: var(--purpleSecondary);
    --text-disabled: var(--disabled);
    --text-notice: var(--cyan);
	--text-required: var(--orange);
    --text-approve: var(--green);
    --error: var(--red);
    --caution: var(--yellow);
    --link: var(--purpleSecondary);
    --link-hover: var(--text-main);
    --link-visited: var(--greyTernary);
    --link-visited-hover: var(--text-main);
    --link-accent-visited: var(--text-button-accent);

	--rounded: .25rem;
	--rounded-lg: 0.5rem;
	--spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-4-5: 1.125rem;
    --nspacing-4: -1rem;
    --nspacing-4-5: -1.125rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --nspacing-6: -1.5rem;
    --spacing-7: 1.75rem;
    --spacing-8: 2rem;
    --mp-xss: .25em;
    --mp-xs: .5em;
    --mp-sm: .75em;
    --mp-m: 1em;
    --mp-lg: 1.5em;     
    --padding-button-xs: 0 var(--spacing-1);
    --padding-button-sm: 0 var(--spacing-2);
    --padding-button-md: 0.25em var(--spacing-2);
    --padding-button-lg: var(--spacing-1) var(--spacing-3);
}
:root {
    --background-seen: var(--pink-transparent);
    --background-bookmarked: var(--purple-transparent);
}
/**1** common rules (default skin overhaul) */
/*
*< background */
body, table, thead td, thead tr:hover, thead td:hover, thead th:hover, thead tr:hover th, col.name, #dashboard a:hover, fieldset, form dl, fieldset dl dl, fieldset fieldset fieldset, fieldset fieldset dl dl, dd.hideme, fieldset fieldset, .toggled form, .dynamic form, 
.ui-sortable li, /* ? хто ты */ 
.ui-sortable li:hover, 
#ui-datepicker-div, .ui-datepicker table, #modal, form.verbose legend, .verbose form legend, dl.index dd, .listbox, fieldset fieldset.listbox, .listbox > .heading, .removeme fieldset .heading, 
.item dl.visibility, /* ? хто ты */ 
.expandable.secondary, #dashboard .expandable.secondary, .splash .module div.account, #tos_prompt, #tos_prompt .heading, .filters .indicator:before, input[type="checkbox"]:focus, input[type="radio"]:focus, .nomination dt, .child, .actions span.defaulted, .actions label {
	background: var(--background-main);
	color: var(--text-main);
	box-shadow: none;
}
.action, label.action:hover, div.dynamic, .listbox .index, th, .question a:hover, span.action, #dashboard .current, .chapter .preface, .comment h4.byline, .blurb .bookmark.listbox, .blurb .series.listbox, .blurb .work.listbox, .bookmark.listbox > .heading, .series.listbox > .heading, .work.listbox > .heading { background: none }
::selection { background-color: var(--background-selection) }
/*
*< cards */
li.blurb, .splash .news li, .splash .news li:last-of-type, .unread, .notice, .comment_notice, .kudos_notice, .announcement .userstuff, #outer .reading h4.viewed, .reading h4.viewed, ul.notes, .alert .userstuff, .caution, #proxy-notice, p.required, .alert.flash, .comment_error, .kudos_error, .event .userstuff, .error,  .LV_invalid, .dashboard .own, .comment span.unreviewed, li.comment {
    background: var(--background-main);
    border: var(--border-width) solid var(--background-main);
	border-radius: var(--rounded);
}
/*
*<< main */
.splash .favorite li:nth-of-type(odd) a, .dashboard .own, dl.meta, li.blurb, .splash .news li, .splash .news li:last-of-type, dl.work.meta.group, li.comment {
    background-color: var(--background-card);
    border-color: var(--border-card);
	border-radius: var(--rounded);
}
/*
*<< accent */
li.unread.comment, #outer .reading h4.viewed, .reading h4.viewed, .dashboard .bookmark .user.own.module, .bookmark .user.own.module {
	background-color: var(--background-accent);
    border: 0;
}
/*
*<< secondary */
.bookmark .user.blurb, .bookmark .user.module, form blockquote.userstuff, .statistics .index li:nth-of-type(even), .thread .even, .blurb .blurb, .system .tweet_list li, .draft, .draft .wrapper, #dashboard .secondary, .secondary {
	background-color: var(--background-secondary);
    border-color: var(--background-secondary);
}
/*
*<< notifications  */
/*
*<<< normal  */
.notice, .comment_notice, .kudos_notice, .announcement .userstuff,  ul.notes {
	background-color: var(--background-notice);
	border: 0;
	color: var(--text-notice);
}
.announcement .thermometer .track {
    border-radius: var(--rounded);
    border-color: var(--border-track);
    background: var(--background-main);
    background-image: none;
}
/*
*<<< caution */
.alert .userstuff, .caution {
    background-color: var(--background-caution);   	
    color: var(--caution);
	border: 0;
}
/*
*<<< error  */
#proxy-notice, p.required, .alert.flash, .comment_error, .kudos_error, .event .userstuff, .error,  .LV_invalid {
	background-color: var(--background-error);
	color: var(--error);
	border: 0;
}
.LV_invalid:before { border-color: var(--background-error) transparent }
form.verbose legend.required, .required { 	color: var(--error) }
/*
*< color */
#header a, #header a:visited, #header .primary a, #header .primary .open a, #header .primary .menu a, #header .primary .dropdown:hover a, #header .primary .dropdown a:focus, #header h2, #header #search input:focus, #header .search, #footer a, #footer, #footer .heading, #modal.img a, .delete a, .delete a:hover, .top:hover a, .listbox > .heading, .filters .expander, .question a:hover, #dashboard a, #dashboard span, .action, .action:hover, label.action:hover, li.action:hover, .autocomplete div.dropdown ul, .autocomplete .notice, .required .autocomplete, .post .required .warnings, dd.required, form dd.required, .userstuff h2 { color: var(--text-main) }
/*
*< links */
a, a:link, .bookmark .count a, .event .userstuff a, .announcement .userstuff a, .announcement .userstuff a:link,  span.symbol, #footer a {
    color: var(--link);
    border-bottom: 0;
    -webkit-transition: color .2s ease-in-out;
    -moz-transition: color .2s ease-in-out;
    transition: color .2s ease-in-out;
    /* TODO split for skin */
}
a:hover, a:focus, .bookmark .count a:hover, .bookmark .count a:focus, .event .userstuff a:hover, .event .userstuff a:focus, .announcement .userstuff a:hover, span.symbol:hover, span.symbol:focus, #footer a:hover, #footer a:focus { color: var(--link-hover) }
a.cloud7 { color: var(--accent-900) }
a.cloud6 { color: var(--accent-800) }
a.cloud5 { color: var(--accent-700) }
a.cloud4 { color: var(--accent-600) }
a.cloud3 { color: var(--accent-500) }
a.cloud2 { color: var(--accent-400) }
a.cloud1 { color: var(--accent-300) }
/*
*< accent */
#footer, .own, .draft, .draft .wrapper, .unread, .unwrangled, .unreviewed, #header .primary {	background: var(--background-accent) }
span.unread {
    color: black;
    text-transform: uppercase;
    border-color: var(--accent);
    background-color: var(--accent);
}
/* accent color from header */
#header #greeting img, #header .heading a, #header .heading a:visited, #header form, .draggable, .droppable, span.requested, a.work, .blurb h4 a:link, .blurb h4 img, .splash .module h3, .splash .browse li a:before, a.cloud8, #tos_prompt .heading { color: var(--accent) }
.actions .reindex a, #greeting .icon, #dashboard, #dashboard.own { border-color: var(--accent) }
/*
*< no border */
#footer, #modal, .draft .chapter.preface, .chapter.actions + .chapter.preface.group, div.comment fieldset, .dynamic div.comment form, .simple.search fieldset, .filters dt, .comment div.icon, .actions label, .actions label:hover, span.action, span.action:hover, input[type="file"], thead, thead tr, thead th, thead td, thead tr:hover, thead th:hover, thead tr:hover th, #symbols-key dl, .blurb[class*="external"] .header.module,
/* try to avoid three-layer forms */
form fieldset dl, fieldset fieldset fieldset, .filters .group dt.bookmarker, #dashboard > ul:first-of-type { border: 0 }
.dropdown #small_login .footnote a { border-bottom: 0 }
.chapter.preface:last-child { border-top: 0 }
.action, .action:hover, label.action, label.action:hover { border-color: var(--background-main) }
/*
*< new border */
tfoot, tfoot td, tbody tr, tbody th, tr:hover, col.name, #dashboard ul, .ui-datepicker td, #dashboard .secondary, .draft, .preface h3, .userstuff h3, .userstuff h6, .userstuff hr, hr { border-color: var(--border-alt) }
#modal.img .content img, .picture .header, .blurb .header.module, .splash .module h3, form dt { 	
	border-width: 0.1rem;
	border-color: var(--border-interactive-card);
	border-bottom: 0.1rem solid var(--border-interactive-card);
} 
#small_login, fieldset, fieldset dl dl, fieldset fieldset dl dl, /* no border perhaps */
dd.hideme, .ui-sortable li, .ui-sortable li:hover, form.verbose legend, .verbose form legend, .removeme fieldset .heading, .region:first-child .navigation+form legend, .post.bookmark legend, form.single fieldset, form.single legend, .dashboard .filters fieldset, .toggled form, .dynamic form, .expandable.secondary, #dashboard ul.expandable.secondary:first-of-type, .replied, span.claimed, .actions span.defaulted, .listbox, fieldset fieldset.listbox, .listbox > .heading, .inbox .actions label, .bookmark .user, div.comment, .splash .module div.account, .faq .example, .guideline .example, form dl {
	border: var(--border-width) solid var(--border-interactive-card);
	border-radius: var(--rounded);
}
.inbox .actions label { border-width: 1px }
#modal, form blockquote.userstuff { border-radius: var(--rounded) }
/*
*< no effects */
.wrapper, input, textarea, #header .menu, #small_login, #greeting .menu, #header .primary, .secondary, .LV_invalid, .autocomplete div.dropdown ul, .ui-sortable li, .ui-sortable li:hover, .ui-draggable form, #ui-datepicker-div, #modal, #modal.img .content img, #modal.img .footer, form .notice, form ul.notes, .notice, .comment_notice, .kudos_notice, .announcement .userstuff, .qtip-content, ul.notes, .alert .userstuff, .caution, #proxy-notice, p.required, .alert.flash, .comment_error, .kudos_error, .event .userstuff, .error,  .LV_invalid, form blockquote.userstuff, .actions a:hover, .actions input:hover, .actions a:focus, .actions input:focus, label.action:hover, .action:hover, .action:focus, .current, span.delete, .listbox .index {
	box-shadow: none;
	text-shadow: none;	
}
.preface a:hover { text-decoration: none }
.filters input:focus+.indicator+span, a:active, a:focus img, a:focus, #header #search input:focus { outline: none }
/*
*< gradients */
.announcement .thermometer .track {
	background: var(--text-notice);
	border-color: var(--text-notice);
	background-image: linear-gradient(135deg, var(--text-notice) 0%, var(--text-approve) 100%);
}
#modal .content, .userstuff h3:first-of-type, .chapter.preface:first-child {
    border: 0;
    border-bottom: var(--border-width) solid transparent;
    border-image: var(--border-accent-gradient);
}
.chapter.preface:first-child {
    border-bottom: 0;
    border-top: var(--border-width) solid transparent;
}
.home .header h2, .faq .categories h3 {
    border-width: var(--border-width);
	border-image: var(--border-pink-yellow);
}
.chapter .preface + .userstuff h3:first-of-type, .userstuff .toc + #faq h3:first-child {
	border-image: var(--border-cyan-purple);
}
/*
*< recolored pictures */
 /* replace pictures completely */
 #header .logo, #greeting img.icon[src="/images/skins/iconsets/default/icon_user.png"], img[title="Restricted"], a[href="/users/orphan_account"] img.icon, .picture .icon[src="/images/skins/iconsets/default/icon_user.png"] img, .index .picture .icon[src="/images/skins/iconsets/default/icon_user.png"], .icon[src="/images/skins/iconsets/default/icon_user.png"], #symbols-key dl dt img, #bookmark-symbols-key dt img  {
    width:0;
	height:0;
	padding:25px 0 0 25px;
	background-size: contain;
 }
#header .logo { background: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/logo_84_dracula_ui_recolor.png) 0 0/contain no-repeat }
img[title="Restricted"], .blurb h4 img[title="Restricted"] {
    background: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/lock-7-32.png) 0 0 no-repeat;
    background-size: contain;
    padding: var(--spacing-4) 0 0 var(--spacing-4);
    display: inline-block;
    vertical-align: baseline;
}
a[href="/users/orphan_account"] img.icon {
	padding:100px 0 0 100px;
    background: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/orphan-avatar_dracula_ui_recolor.png) 0 0/contain no-repeat;
}
p.kudos, .required-tags .rating-general-audience, .required-tags .rating-explicit, .required-tags .rating-mature, .required-tags .rating-notrated, .required-tags .warning-no, .required-tags .rating-teen, .required-tags .category-none, .required-tags .category-femslash, .required-tags .category-gen, .required-tags .category-het, .required-tags .category-multi, .required-tags .category-other, .required-tags .category-slash, .required-tags .complete-no, .required-tags .complete-yes, .required-tags .warning-yes, .required-tags .warning-choosenotto, .required-tags .external-work, .status .count, .status .private .text, .status .public, .status .hidden, .status .rec, .index .skins .icon, .index .mystery .icon, .index .tag .icon, .index .tagset .icon, .comment .icon .visitor, .comment .icon .anonymous, .abbreviated .icon .anonymous, .abbreviated .icon .visitor, .admin .primary .icon, .skins .primary .icon, .tag .primary .icon, .tagset .primary .icon, a.rss span, #symbols-key dl dt img, #bookmark-symbols-key dt img { 
    background-image: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/imageset_dracula_ui_recolor.png); 
    background-size: auto;
}
#bookmark-symbols-key dt img[alt="Rec"] { background-position: -100px -50px }
#bookmark-symbols-key dt img[alt*="Public"] { background-position: -125px -50px }
#bookmark-symbols-key dt img[alt*="Private"] { background-position: -175px -50px }
#bookmark-symbols-key dt img[alt*="Hidden"] { background-position: -150px -50px }
#symbols-key>dt>img { display: none }
#symbols-key>dt:before {
    font-size: 25px;
    content: "\\25a8\\25A2\\25A2\\25A2";
    word-break: break-all;
    display: block;
    width: 2em;
    line-height: 1;
}
#symbols-key>dt:nth-of-type(2):before { content: "\\25A2\\25a8\\25A2\\25A2" }
#symbols-key>dt:nth-of-type(3):before { content: "\\25A2\\25A2\\25a8\\25A2" }
#symbols-key>dt:nth-of-type(4):before { content: "\\25A2\\25A2\\25A2\\25a8" }
#symbols-key dl dt img[alt="G"] { background-position: -50px -25px }
#symbols-key dl dt img[alt="T"] { background-position: 0px -25px }
#symbols-key dl dt img[alt="M"] { background-position: -75px -25px }
#symbols-key dl dt img[alt="E"] { background-position: -25px -25px }
#symbols-key dl dt img[alt*="blank"] { 
    background-color: var(--background-secondary);
    background-position: -150px 0px 
}
#symbols-key dl dt img[alt="F/F"] { background-position: -25px 0px }
#symbols-key dl dt img[alt="F/M"] { background-position: -75px 0px }
#symbols-key dl dt img[alt="Gen"] { background-position: -50px 0px }
#symbols-key dl dt img[alt="M/M"] { background-position: 0px 0px }
#symbols-key dl dt img[alt="Multi"] { background-position: -100px -0px }
#symbols-key dl dt img[alt="Other"] { background-position: -125px 0px }
#symbols-key dl dt img[alt*="questioned exclamation"] { background-position: -125px -25px }
#symbols-key dl dt img[alt="exclamation mark"] { background-position: -150px -25px }
#symbols-key dl dt img[alt="globe"] { background-position: -75px -50px }
#symbols-key dl dt img[alt*="stop"] { background-position: -100px -25px }
#symbols-key dl dt img[alt="ticky"] { background-position: -175px -25px }
.icon[src="/images/skins/iconsets/default/icon_user.png"], .picture .icon[src="/images/skins/iconsets/default/icon_user.png"] img, .index .picture .icon[src="/images/skins/iconsets/default/icon_user.png"], .abbreviated .icon[src="/images/skins/iconsets/default/icon_user.png"], #greeting img.icon[src="/images/skins/iconsets/default/icon_user.png"] { background-image: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/default-user_ui_recolor.png) }
.icon[src="/images/skins/iconsets/default/icon_user.png"] { padding: 100px 0 0 100px }
.picture .icon[src="/images/skins/iconsets/default/icon_user.png"] img, .index .picture .icon[src="/images/skins/iconsets/default/icon_user.png"] { padding: 55px 0 0 55px }
.abbreviated .icon[src="/images/skins/iconsets/default/icon_user.png"] { padding: 75px 0 0 75px }
#greeting img.icon[src="/images/skins/iconsets/default/icon_user.png"] { padding: 1.786em 0 0 1.786em }
.required-tags .rating-notrated, .required-tags .category-none, .required-tags .warning-no { background-color: var(--background-secondary) }
#main.errors { background-image: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/sadface_dracula_ui_recolor.png) }
#main.error-502 { background-image: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/ao3-502_dracula_ui_recolor.png) }
#main.error-503-maintenance { background-image: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/logo-ruby_dracula_ui_recolor.png) }
#main.session { background-image: url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/logo_big_dracula_ui_recolor.png) }

/*
*< float clearfix hack */
/**2** font */
/*
*< main font */
body, 
.toggled form, .dynamic form, .secondary, .dropdown, .bookmark .user .meta .tag, span.unread, .replied, span.claimed, .actions span.defaulted, blockquote, pre, .userstuff li, .userstuff ol ul li, #show_signups, #hide_signups, .filters h4.heading, input, textarea, select, button, .heading .actions, .heading .action, .heading span.actions, .prompt .blurb h6 {
    font-family: var(--font-service);    
    font-weight: inherit;   
}
strong, b, .userstuff h4, .warning, .warnings, span.byline, a.user, .canonical,
li.requested, .comment .role, .splash .count, .faq .screencast .label, .userstuff dt { font-weight: var(--font-w-sb) }
#main, #workskin, #header,
select { font-size: var(--font-sm) }
/*
*< work text, summary, comment */
#modal .userstuff, #outer .userstuff {
	font-family: var(--font-work);
    font-size: var(--font-md); 
    line-height: 1.375;
	font-weight: lighter;
}
.userstuff p {
    margin: 0 auto;
    line-height: 1.375;
    text-indent: var(--spacing-4);
    text-align: justify;
}
/*
*< headings */
.heading, h1, h2, h3, h4, h5, h6, a.work, .bookmark .user .meta, span.symbol, form.single legend, form.verbose legend, .verbose form legend, .post.bookmark legend, .listbox .heading, .removeme fieldset .heading, .region:first-child .navigation+form legend {
    font-family: var(--font-title);    
}
h2 {
	font-size: var(--font-xxl);
}
.heading a.question { font-size: var(--font-md) }

/*
*< monospace */
kbd, tt, code, var, samp, #outer .reading h4.viewed, .reading h4.viewed, .splash .news .meta, .blurb .datetime, .posted.datetime, .comment .edited, .blurb dl.stats, dl.work.meta dl.stats, #work_dates input[type="text"],  .css pre, #skin_css, .news .meta .published, div.ui-datepicker-title span, .ui-datepicker-calendar {
    font-family: var(--font-data);
}
kbd, tt, code, var, samp, pre, #outer .reading h4.viewed, .reading h4.viewed, .splash .news .meta, .blurb .datetime, .posted.datetime, .comment .edited, .blurb dl.stats {
    font-weight: normal;
    font-size: var(--font-sm);
}
.summary pre { font-size: var(--font-md); }
/*
*< list markers */
ul { list-style: none }
ul > li::marker { color: transparent }
ul.notes li:before, .error ul li:before, .notice ul li:before, .caution ul li:before, .alert.flash ul li:before, .splash .account ul li:before, .userstuff ul li:before {
    content: "—";
    padding-right: 0.25em;
}
/* keep list marker & paragraph together  */
.userstuff ol ul { padding: 0 var(--spacing-1) }
.userstuff ol ul li { margin-inline-start: var(--spacing-1) }
.userstuff ul li p { display: inline }
/**3** interactive */
/*
*< tabs */
/* vertical in sidebar */
#dashboard a { 	color: var(--text-tab-inactive) }
#dashboard a:hover {
	color: var(--text-tab-hover);
	border-radius: var(--rounded) 0 0 var(--rounded);
}
#dashboard .current {
	color: var(--text-tab-current);
	border-right: var(--border-width) solid var(--text-tab-current);
	border-radius: 0;
}
#dashboard ul.navigation.actions li a {
	border-right: 1px solid var(--border-alt);
	border-radius: 0;
}
/* active horizontal */
.actions a.current, .actions a:link.current, .current, a.current, a:link.current, .current a:visited {
	color: var(--text-button-focus);
	background: var(--background-main);
	border-color: var(--background-main);
	border: 0.1rem solid var(--background-main);
}
/*
*< dropdown */
#header .open a,
#header .menu, #small_login, .autocomplete div.dropdown ul, .autocomplete .notice, .dropdown,
/*
*<< tooltip */
.qtip-content, .search [role="tooltip"] {
	background: var(--background-dropdown);
	border-color: var(--background-dropdown);
}
/* tooltip height */
div.autocomplete.dropdown p.notice { margin-bottom: 0 }
/*
*<< calendar */
#ui-datepicker-div { padding: var(--spacing-1) }
ui-datepicker-div a.ui-datepicker-prev.ui-corner-all, #ui-datepicker-div a.ui-datepicker-next.ui-corner-all {     padding: var(--padding-button-xs) }
.ui-datepicker td a { color: var(--text-main) }

/*
*< modal */
/* dark scrollbar */
#modal div.content::-webkit-scrollbar { width: 8px }
#modal div.content::-webkit-scrollbar-track { background: var(--black) }
#modal div.content::-webkit-scrollbar-thumb {
    background: var(--background-input);
    border-width: 4px;
    border-radius: 20px;  
}
#modal div.content::-webkit-scrollbar-thumb:hover { background: var(--hover) }
/*
*< buttons */
.actions a, .actions a:link, .action a, a.action, .action:link, .actions input[type="submit"], .actions input[type="button"], input[type="submit"], .announcement input[type="submit"], button, .announcement .action, span.question, span.delete a, .filters .footnote a, #ui-datepicker-div a.ui-datepicker-prev.ui-corner-all, #ui-datepicker-div a.ui-datepicker-next.ui-corner-all, .tags a[data-remote="true"], #show_signups, #hide_signups {
	background: var(--background-button);
	color: var(--text-button);
	border-color: var(--background-button-opaque);
	border-radius: var(--rounded);
	padding: var(--padding-button-md);
	box-shadow: none;
	transition: none;
}
.actions a:focus, .actions input[type="submit"]:focus, .actions input[type="button"]:focus, .actions a:active, .action:focus, .action a:focus, .delete a:focus, #login .open a:focus {
    background: var(--background-button-focus);
	color: var(--text-button-focus);
	border-color: var(--background-button-focus);
	box-shadow: none;
}
span.disabled, #tos_prompt [disabled], .actions label.disabled {
	background: var(--background-disabled);
	color: var(--text-disabled)
}
span.disabled {
	display: inline-block;
	border-bottom: 1px solid var(--background-disabled-opaque);
	padding: var(--padding-button-lg);
	border-radius: var(--rounded);
	cursor: not-allowed;
}
/* button "details" inside label */
label.action > a, label.action>a:link {
    color:var(--text-button);
	margin-left: var(--spacing-1);
    padding-left: .25em;
	padding-right: var(--spacing-1);
}
.announcement input[type="submit"], .announcement .action { background: var(--background-button-opaque) }
/*
*<< hover */
#header .actions a:hover, #header .actions a:focus, #header .dropdown:hover > a, #header .dropdown a:hover, #header .dropdown .menu a:hover, #header .dropdown .menu a:focus, #header #search .button:hover, .autocomplete .dropdown ul li:hover, .autocomplete .dropdown li.selected, .ui-datepicker tr:hover, .ui-datepicker td:hover,
.splash .favorite li:nth-of-type(odd) a:hover, .splash .favorite li:nth-of-type(odd) a:focus, .question a:hover, .actions a:hover, .actions input[type="submit"]:hover, .actions input[type="button"]:hover, .heading .actions a:hover, .heading span.actions a:hover, a.action:hover, .action:link:hover, .action a:link:hover, .action a:hover, .navigation a:hover, .submit a:hover, input[type="submit"]:hover, button:hover, .announcement input[type="submit"]:hover, .announcement .action:hover, span.question:hover,  tr:hover, td:hover, tbody th:hover, #dashboard a:hover, .filters .footnote a:hover, span.delete a:hover, #ui-datepicker-div a.ui-datepicker-prev.ui-corner-all:hover, #ui-datepicker-div a.ui-datepicker-next.ui-corner-all:hover, .tags a[data-remote="true"]:hover, #show_signups:hover, #hide_signups:hover, #modal.img .footer, #login .open a:hover {
    background: var(--hover);
	color: var(--text-main);
	border-color: var(--hover-opaque);
	box-shadow: none;
}
.announcement input[type="submit"]:hover, .announcement .action:hover { background: var(--dropdown) }
.concise label.action { padding-top: 0 }
.concise label.action a { vertical-align: middle }
/*
*<< arrow buttons */
.heading .actions, .heading .action, .heading span.actions, span.action {
	padding: 0;
	vertical-align: top;
}
.heading .actions a, .heading .action a, .heading span.actions a, span.action a:link, span.action a {
	border: 1px solid var(--background-button-opaque);
	display: inline-block;
	color: var(--text-button);
	padding: var(--padding-button-xs);
	margin: 0;
}
span.action a:only-child { margin-right: var(--spacing-1) }
span.action a:hover, span.action:hover a {
	border-color: var(--hover-opaque);
	color: var(--text-main);
}
/*
*<< rss */
/*
*<< help, cancel */
span.question, span.actions.cancel a, span.delete a { border-radius: var(--rounded-lg) }
span.delete a { padding: var(--padding-button-sm) }
span.actions.cancel, span.symbol span { padding: 0 }
/*
*<< tags */
a.tag {
    color: var(--white);
    padding: 0 var(--spacing-1);
    border-radius: var(--spacing-1);
}
.tags a[data-remote="true"] { padding: var(--padding-button-xs) }
.commas li:after { color: transparent }
a.tag:hover, .listbox .heading a.tag:visited:hover {
    background: var(--hover);
    color: var(--text-main);
    border: 0;    
}
/*
*<< pairings */
li.relationships { border-radius: 0 }
li.relationships a {
    background: var(--background-tag);
    padding: var(--padding-button-xs);
    border-radius: var(--rounded);
    border-style: solid;
    border-bottom-color: transparent;
    border-bottom-color: var(--hover);
}
#outer .reading h4.viewed, .reading h4.viewed {
    padding: var(--padding-button-lg);
}
/*
*< input fields */
input[type="text"], textarea, input[type="password"], input[type="email"], form.search input[type="text"], .actions input[type="text"], textarea:focus {
	padding: 0.25em var(--spacing-1);
    color: var(--text-main);
    border-color: var(--background-input);
    background: var(--background-input);
    box-shadow: none;
    text-shadow: none;
    border-radius: var(--rounded);
    box-sizing: border-box;    
}
/* keep some fields from collapsing */
#header form.search input[type="text"], .search fieldset input[title*="search"] { box-sizing: content-box }
.actions input[type="text"]:hover, .actions input[type="password"]:hover, .actions input[type="email"]:hover { 	border-color: var(--background-input) }
input[type="text"]:focus, form.search input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus, textarea:focus, .actions input[type="text"]:focus { outline: none; border-color: var(--border-alt) }
/* keep autofilled inputs dark, might not work in actual skin :( */
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px var(--background-input) inset !important;
  -webkit-text-fill-color: var(--text-main);
}
input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus { 
    box-shadow: 0 0 0px 1000px var(--background-input) inset !important;
    /* ? add color perhaps */
    -webkit-box-shadow: 0 0 0px 1000px var(--background-input) inset !important 
    /* TODO split for skin */
}
/* invalid fields */
.LV_invalid_field, input[type="text"].LV_invalid_field, input[type="password"].LV_invalid_field, input[type="email"].LV_invalid_field, input.LV_invalid_field:hover, input.LV_invalid_field:active, textarea.LV_invalid_field:hover, textarea.LV_invalid_field:active { border: 1px solid var(--error) }
/*
*< checkbox */
input[type="checkbox"],  input[type="radio"],  .filters [type="radio"], .filters [type="checkbox"], .actions input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: 1px solid var(--border-checkbox);
	border-radius: 0.375em;
    cursor: pointer;
    display: inline-block;
    height: 1.125em;
	width: 1.125em;
    margin: 0;
    outline: none;
    position: relative;
	/* TODO split for skin */
    transition: background .3s, border-color .3s;
    -webkit-transition: background .3s, border-color .3s;
    -moz-transition: background .3s, border-color .3s;
    -o-transition: background .3s, border-color .3s;
    vertical-align: middle;
}
input[type="checkbox"]:after, input[type="radio"]:after,  .filters [type="radio"]:after, .filters [type="checkbox"]:after, .actions input[type="checkbox"]:after {
    content: "";
    display: block;
    position: absolute;
    opacity: 0;    
	border: 0.2rem solid black;
	border-left: 0;
    border-top: 0;    
    width: 50%;
    height: inherit;
    top: 0;
    left: 0;
    transform: translateX(15%) translateY(-20%) scale(0.5) rotate(20deg);
    -webkit-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(20deg);
    -ms-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(20deg);
    -moz-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(20deg);
    -o-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(20deg);
    transition: transform .3s ease, opacity .3s;
    -webkit-transition: opacity .3s, -webkit-transform .3s ease;
    -moz-transition: -moz-transform .3s ease, opacity .3s;	
    -o-transition: -o-transform .3s ease, opacity .3s;	
}
input[type="checkbox"]:checked, .filters [type="checkbox"]:checked, .actions input[type="checkbox"]:checked {
    background: var(--border-checkbox);
	opacity: 1;
	/* TODO split for skin */
    transition: opacity .3s, transform .6s ease;
    -webkit-transition: opacity .3s, -webkit-transform .6s ease;
	-moz-transition: opacity .3s, -moz-transform .6s ease;    
	-o-transition: opacity .3s, -o-transform .6s ease;    
}
input[type="checkbox"]:checked:after, .filters [type="checkbox"]:checked:after, .actions input[type="checkbox"]:checked:after {
	opacity: 1;
	transform: translateX(15%) translateY(-20%) scale(0.5) rotate(43deg);
    -webkit-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(43deg);
    -ms-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(43deg);
    -moz-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(43deg);
    -o-transform: translateX(15%) translateY(-20%) scale(0.5) rotate(43deg);
	/* TODO split for skin */
}
input + label { vertical-align: middle }
label > input[type="checkbox"] { vertical-align: top }
.actions input[type="checkbox"]:hover { border: 1px solid var(--border-checkbox) }
.actions li input[type="checkbox"] {
    margin: 0;
    vertical-align: sub;
}
/*< radio */
input[type="radio"]+label, input[type="checkbox"]+label { padding-left: var(--spacing-1) }
label>input[type="radio"], label>input[type="checkbox"], label>.filters [type="radio"] { margin-right: var(--spacing-1) }
input[type="radio"], input[type="radio"]:after, .filters [type="radio"], .filters [type="radio"]:after {
	border: 1px solid var(--border-radio);
	border-radius: 50%;
    box-sizing: content-box;
}
input[type="radio"]:after, .filters [type="radio"]:after {
	width: inherit;
	height: inherit;
	background: var(--border-radio);
	border: 0;
	transition: none;
	-webkit-transition: none;
	-moz-transition: none;
	-o-transition: none;
		/* TODO split for skin */    
}
input[type="radio"]:checked:after, .filters [type="radio"]:checked:after {
    opacity: 1;
    	/* TODO split for skin */
	transform: scale(0.75);
	-webkit-transform: scale(0.75);
    -moz-transform: scale(0.75);
    -o-transform: scale(0.75);
}
/*< select */
select, select:focus {
    -webkit-appearance: none;
    appearance: none;
	font-size: inherit;
    padding: 0.25em;
	padding-right: 1.5em;
	line-height: 1.286;
	text-overflow: ellipsis;
	text-rendering: auto;
	background: var(--background-input) url(https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/select64.png) right center no-repeat; 
    background-size: contain;
    vertical-align: middle;
    border: 1px solid var(--background-input);
    border-radius: var(--rounded);
    color: var(--text-main);
    outline: none;
}
.action > select { background-color: var(--background-main) }
/**4** forms */
/* get rid of extra space */
legend label { margin-right: 0 }
/* underlined labels on the left */
form dt { 	border-width: var(--border-width) }
/* move inputs on the right to underline */
.meta ul li { padding-left: 0 }
/* add space below tags */
.meta dd ul li.added.tag { margin-bottom: var(--spacing-2) }
/* move tip for the required fields */
dd.required, div.rtf-html-field { position: relative }
.LV_invalid {
	margin: 0;
	left: 0;
	bottom: 0;
}
/* lighten layout in dashboard */
.dashboard>form, .dashboard>form>fieldset>p, #new_challenge_signup>fieldset {
	border-color: var(--background-main);
	padding: 0;
	margin: var(--spacing-2) 0;
}
/* single forms (input+submit) */
form.single input[type="text"] {
    line-height: 1.286;
}
form.single .autocomplete+input+span.submit input[type="submit"] {
    margin-bottom: 0.25em;
}
/* forms with separate submit actions */
/* align form parts */
fieldset {
margin-left: auto;
margin-right: auto }
/*
*< filters */
/* align narrow filters */
.narrow-hidden > fieldset { padding: 0 }
.dashboard>form.filters { margin: 0 }
/* shrink space around submit */
.filters .submit input { margin: var(--spacing-2) 0 }
/* expander aka triangle before group */
.filters .expander, .filters .expanded .expander {
    height: 90%;
    min-height: var(--mp-m);
    outline: none;
    background-image: none;
    padding-left: 0;
} 
.filters .collapsed .expander { outline: none }
.filters .collapsed button::before,
.filters .expanded button::before {
    content: "\\203A";
    font-size: 1.5em;   
    padding: 0 .125em;
    line-height: var(--mp-sm);
}
.filters .expanded button::before {
    display: inline-block;
    transform: rotate(90deg) translateX(.1em); 
}
/* hide ao3 default radio and checkbox design */
.filters [type="radio"]+.indicator,  .filters [type="radio"]+.indicator:before, .filters [type="checkbox"]+.indicator, .filters [type="checkbox"]+.indicator:before { display: none }
/* filters include color */
.filters .include input, .nomination .actions .yes+input { 	border-color: var(--text-approve) }
.filters .include [type="checkbox"]:checked, .filters .include [type="radio"]:checked:after, .nomination .actions .yes+input[type="checkbox"]:checked { background-color: var(--text-approve) }
/* filters exclude color */
.filters .exclude input, .nomination .actions .no+input { border-color: var(--error) }
.filters .exclude [type="checkbox"]:checked, .filters .exclude [type="radio"]:checked:after, .nomination .actions .no+input[type="checkbox"]:checked { background-color: var(--error) }
/* add space between list of tags and input field */
.autocomplete li.added + li.input { margin-top: var(--spacing-1) }
/* clear filters button */
.filters .footnote {
	font-size: var(--font-sm);
	padding: 0 0.643em var(--spacing-1);
}
.filters .footnote a { 
	vertical-align: top;
	font-size: var(--font-xs);
	padding: var(--padding-button-sm) }
/*
*< toggle forms */
/* hide legends */
.dynamic form legend, .toggled form legend, .dynamic .post.bookmark form legend, .toggled .post.bookmark form legend, .filters legend {
	font-size: 0;
	padding: 0;
}
.dynamic form p.footnote + textarea { margin-top: var(--spacing-2) }
/* lighten user-added forms */
.removeme > fieldset { margin: var(--spacing-2) 0 }
/* move button a little down */
.removeme ~ p.actions {
	padding: 0.429em 0.25em 0.25em 0;
	margin-top: var(--spacing-2);
}
/*
*< complex forms */
/* work */
/* set date select into single line */
.datetime select {
    width: 32.3%;
    min-width: 10em;
}
/* edit skin */
/* shrink parent skin form into line */
#advanced_skin .removeme > fieldset > p {
	width: 20%;
	float: right;
}
#advanced_skin .removeme > fieldset > ul.autocomplete { width: 75% }
/* signup form */
  /* long tag labels */
  .listbox .options.index.group {
	  overflow-x: auto;
  }
  .listbox .options.index.group, .listbox .options.index.group label {
	box-sizing: border-box;
	padding-left: 0;
  }
  .listbox .options.index.group label { 
	border-left: 0;
	margin-right: 0;
	white-space: normal;
	height: auto;
  }
  .listbox .options.index.group li {
    margin: 0;
}
/*
*<< rich text editor */
/**5** lists, groups */
/* get rid of redundant scrollbars */
.listbox, .removeme fieldset, .tags li.listbox, fieldset fieldset.listbox {
	overflow: visible;
    position: relative;
	padding: 0 var(--spacing-2) 0;
	box-sizing: border-box;
	margin-top: var(--spacing-4);
}
.listbox > .index {
	padding-bottom: var(--spacing-1);
	padding-left: 0;
}
.listbox > .index > li:last-child { margin-bottom: 0 }
/* decorate headings as legends from forms */
form.verbose legend, .verbose form legend, .post.bookmark legend, .listbox > .heading, .removeme fieldset .heading, .region:first-child .navigation+form legend {
	height: auto;
    width: auto;
    font-size: var(--spacing-4-5);
	opacity: 1;
	padding: var(--spacing-1) var(--spacing-2);
}
.listbox .listbox > .heading, .post.bookmark legend ~ fieldset legend, form.verbose legend ~ fieldset legend, .verbose form legend ~ fieldset legend, .listbox > h5.heading { font-size: var(--spacing-4) }
.removeme fieldset .heading, .listbox > .heading {
    position: absolute;
	z-index: 2;
    top: var(--nspacing-4);
}
.removeme fieldset h4.heading, .listbox > h4.heading { font-size: var(--spacing-4) }
.removeme fieldset > .heading { top: var(--nspacing-6) }
/* hide stuff away */
.listbox .landmark.heading {
	margin: 0;
	padding: 0;
	opacity: 0;
}
/* add extra space inside instead absolute positioned heading */
.listbox > .heading + * { padding-top: var(--spacing-4-5) }
.listbox > .heading + div > ul { padding-top: 0 }
/* add extra space outside to compensate absolute positioned heading */
.listbox > .listbox { margin-top: var(--spacing-8) }
/* remove listbox markup on certain cases - bookmarks, works, series */
.bookmark.listbox, .series.listbox, .work.listbox {
    overflow: auto;
    border: 0;
    padding: 0;
	margin-top: var(--spacing-2);
}
.bookmark.listbox > .heading, .series.listbox > .heading, .work.listbox > .heading {
	position: static;
	border: 0;
	padding: 0;
}
.bookmark.listbox > .heading + *, .series.listbox > .heading + *, .work.listbox > .heading + * { padding: 0 }
/* keep fandom box on profile page from breaking */
.listbox > .index:after { display: none }
/* reduce space between pagination and works */
ol.pagination + ul.group > li.work { margin-top: 0 }
/*
*< alphabet */
/* keep box with floated content from collapsing */
.alphabet .listbox > .index:after, .tags.index:after {
	content: "";
    clear: both;
    display: table;
}
/* keep popular fandoms boxes from randomly floating */
.media .listbox {
	width: auto;
	min-width: 45%;
	float: left;
	margin-right: var(--spacing-5);
}
/* expandable from header lists */
fieldset .tagset.listbox .heading, .expander_parent.heading, .cast.listbox .heading  {
    position: static;
    border: 0;    
}
fieldset .tagset.listbox .heading + *, .expander_parent.heading + *, .cast.listbox .heading + * { padding-top: 0 }
fieldset .tagset.listbox .heading + .actions a { padding: var(--padding-button-xs) }
/*
*< tables  */
thead th {
    text-align: left;
    text-transform: uppercase;
	padding-left: 0;
}
tr:hover, td:hover, td, tbody th, tbody tr:hover th, .ui-datepicker tbody tr, .ui-datepicker tbody td, .ui-datepicker tbody tr:hover, .ui-datepicker td:hover {  border: var(--border-width) solid var(--border-alt) }
.userstuff tr:hover, .userstuff td:hover, .userstuff tbody tr:hover th {  border: none }
/**6** pages adjustments */
/*
*< main page */
/*
*< header */
/* hide red logo */
#header .logo { padding: 42px 0 0 61px }
#header #search .button {
	background: none;
	color: var(--text-main);
}
/* input field */
#header #search .text {
	padding: 0.15em .25em;
	border: 1px solid var(--accent);
    margin-right: 0;
}
/* dropdown menu */
#header .menu li { border-color:  var(--hover) }
/*
*< footer */
/*
*< profile */
#dashboard.own { padding: 0 }
/* fix floated header */
.module.primary.header { float: none }
/* keep navigation to the right */
.home .header ul.actions { 	margin-left: 100px }
ul.navigation.actions, ul.actions[role="navigation"] { padding-right: 0 }
/* align info about other's bookmarks */
.bookmark .recent .index { 	padding: 0 }
.bookmark .own.user .byline {
    margin-right: 0;
    border-bottom: 0.1rem solid var(--border-alt);
	padding-bottom: var(--spacing-1);
    margin-bottom: var(--spacing-1);
}
.bookmark .recent .own.user .byline { border-bottom: 0 }
.picture div.header:only-child, .blurb div.header.module:only-child { border-bottom: 0 }
/* make short blurbs shorter */
.short.blurb .header.module { margin-bottom: 0 }
li.short.blurb > ul.tags.commas { border-top: 0 }
/*
*<< inbox */
.replied, span.claimed {
    background: var(--background-disabled);
    color: var(--text-disabled);
}
/*
*<< statistics */
#stat_chart { background: var(--text-disabled) }
rect[fill="#ffffff"] { opacity: 0 }
rect[fill="#ebebeb"] { opacity: 25% }
rect[fill="#cccccc"] { opacity: 50% }
rect[fill="#993333"] { 
  filter: hue-rotate(260deg);
  -webkit-filter: hue-rotate(260deg);
  opacity: 97%;
}
/*
*< nominations */
.nominations .approved, .nominations .approved:hover, .nominations .rejected, .nominations .rejected:hover, .nominations .unreviewed, .nominations .unreviewed:hover, span.symbol.approved, span.symbol.approved:hover, span.symbol.rejected, span.symbol.rejected:hover, span.symbol.unreviewed, span.symbol.unreviewed:hover {
	background: var(--text-approve);
    color: black;
    vertical-align: baseline;
    padding: var(--padding-button-xs);
}
.nominations .rejected, .nominations .rejected:hover, span.symbol.rejected, span.symbol.rejected:hover { background: var(--error) }
.nominations .unreviewed, .nominations .unreviewed:hover, span.symbol.unreviewed, span.symbol.unreviewed:hover { background: var(--accent) }
/*
*< work */
/* align meta before work */
.blurb .header .heading { margin-right: 7em }
.blurb[class*="external"] .fandoms.heading { min-height: var(--spacing-4) }
dl.meta, .news dl.meta { padding: var(--spacing-2) var(--spacing-2) 0 }
.userstuff blockquote {
    margin-inline-start: 0;
    border-color: var(--border-blockquote);
}
li.blurb > ul.tags.commas { padding-top: var(--spacing-1) }
li.blurb[class*="external-work"] > ul.tags.commas { border-top: 0 }
/*
*<< comments */
/* add some space after actions */
.feedback ul.actions { 	margin-bottom: var(--spacing-1) }
/* shrink space before&after kudos */
p.kudos { margin: var(--spacing-2) 0 }
/* get rid of space on comment form */
.post.comment form label { display: none }
.post.comment form h4 { margin: 0 }
/* align comment headings (attempt to) */
.comment h4.byline {
    padding-left: 0;
    margin-left: 108px;
	border-bottom: var(--border-width) solid var(--border-interactive-card);
}
.abbreviated h4.byline {
    padding-left: 0;
    margin-left: 83px;
}
/*
*< collections */
#header h2 {
    background-color: var(--background-collections);
    border: 0;
}
span.offered { color: var(--text-approve) }
span.requested { color: var(--error) }
span.offered.requested { color: var(--caution) }
/* keep buttons from crossing the line */
.preface.group .actions li a, .preface.group .actions li a:link { padding: var(--padding-button-xs) }
/*
*< tag page */
/* get rid of extra space in the metatags box */
ul.tree li { margin-top: 0 }
/* draw borders for subtags  */
.tree .tags.tree.index {
    border-left: 1px solid var(--border-alt);
	margin-left: var(--spacing-1);
}
/*
*< faq */
.faq .heading .actions a {
    background: var(--background-button-opaque);
}
/*
*< news */
/* news blurbs on the main */
.splash .news li { 	padding: var(--padding-button-lg) }
.news dl.meta { margin-bottom: var(--spacing-2) }
/* hide some stuff  */
.admin .header h3.landmark { font-size: 0 }
/**7** visited links */
a:visited, .listbox .heading a:visited, .splash .favorite li a:visited, .announcement .userstuff a:visited, .splash .favorite li:nth-of-type(odd) a:visited { color: var(--link-visited) }
a:visited:hover, .blurb h4 a:visited:hover, .listbox .heading a:visited:hover, .announcement .userstuff a:focus, .announcement .userstuff a:visited:hover, .splash .favorite li a:visited:hover, .splash .favorite li:nth-of-type(odd) a:visited:hover {
    text-decoration: none;
    color: var(--link-visited-hover);
}
.actions a:visited, .action a:visited, .action:visited, span.action a:visited, .listbox .heading span.action a:visited, .pagination.actions a:visited { color: var(--text-button) }
a.resp-sharing-button__link, .pagination.actions a:visited:hover, .ui-datepicker td a:visited, .ui-datepicker td a:visited:hover, a.tag:visited, a.tag:visited:hover, .action:visited:hover, .action a:visited:hover, .actions a:visited:hover, .listbox .heading span.action a:visited:hover, span.action a:visited:hover, span.action:hover, span.action:hover a:visited, .heading a.tag:visited, .heading a.tag:visited:hover { color: var(--text-main) }

/**Extra** background fixes for dracula theme for AO3 & Kudosed and Seen history, AO3 Tracking userscripts*/
/* blurb options  */
.kh-toggles {
    background-color: var(--background-dropdown);
    border-color: var(--background-dropdown);
}
/* remove pictures & return color to the bg */
.marked-seen, 
.kh-highlight-bookmarked-yes .is-bookmarked, dl.is-bookmarked, .is-bookmarked, 
.kh-highlight-bookmarked-yes .is-bookmarked.marked-seen, dl.is-bookmarked.marked-seen {
    background-image: none !important;
    background-color: var(--background-card) !important;
}
/*bg fix for kudosed*/
.has-kudos.marked-seen, .has-kudos, 
 dl.has-kudos.is-bookmarked,
dl.has-kudos.marked-seen.is-bookmarked, .kh-highlight-bookmarked-yes .has-kudos.is-bookmarked, 
.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos.marked-seen {
  background: url("https://raw.githubusercontent.com/LGZeldner/AO3-dracula/master/pictures/kudos_40_ui_recolor.png") left no-repeat !important;
    background-color: var(--background-card) !important;
}
/* replace pictures with pseudo-elements */
.marked-seen:before, .kh-highlight-bookmarked-yes .is-bookmarked:after, dl.is-bookmarked:after {
    content: "";
    display: block;
    float: left;
    position: absolute;    
    top: 0;
    width: 40px;
    height: 100%;    
}
.marked-seen:before {
    left: 0;
    background-color: var(--background-seen);
}
.kh-skipped-display-placeholder .marked-seen.skipped-work:before {
    position: initial;
    background-color: var(--background-card);
}
.kh-skipped-display-placeholder .marked-seen.skipped-work {
    border-left-color: var(--background-seen);
    border-left-width: 40px;
    padding-left: 0.75em !important;
}
.kh-highlight-bookmarked-yes .is-bookmarked:after, dl.is-bookmarked:after {
    right: 0;
    visibility: visible;
    background-color: var(--background-bookmarked);
    background-image: repeating-linear-gradient(
  135deg,
  var(--background-bookmarked),
  var(--background-bookmarked) 6px,
  var(--border-alt) 2px,
  var(--border-alt) 8px
)
}
/* fix floated content */
.is-bookmarked.blurb ul.actions:last-child,
.is-bookmarked.blurb dl.stats:last-child,
.reading.blurb .stats,
.reading .user.module {
    float: none;
}
.is-bookmarked.blurb ul.actions:last-child li {
    display: block;
    float: right;
    margin: 0;
}
.is-bookmarked.blurb ul.actions:last-child:after,
.reading .user.module:after {
    content: " ";
    clear: both;
    display: table;
}
/*border fix for new*/
.kh-highlight-new-yes li.new-blurb {
    border-left: 5px solid var(--purple) !important;
}
/*collapsed bookmarks*/
.collapsed-blurb div.own.user.module.group {
    margin-top: 1.5em;
}

/*settings*/
#importexport-box, #tracked-box {
    border-color: var(--background-main);
    background-color: var(--background-main);
}
#importexport-box .kh-setting-option {
    color: var(--text-main);
    border: 1px solid var(--background-secondary);
    background-color: var(--background-main);
}
#importexport-box .kh-setting-option.kh-setting-option-selected {
    background-color: var(--border-checkbox);
    border-color: var(--border-checkbox);
}
#importexport-box input[type=button], #tracked-box input[type=button] {
    color: var(--text-button);
    border-color: var(--background-button);
    background: var(--background-button);
}
#importexport-box a.kh-setting-option:hover, #importexport-box input[type=button]:hover, #tracked-box input[type=button]:hover  {
    color: var(--text-main);
    border-color: var(--hover);
    background-color: var(--hover);
}
@media screen and (max-width: 42em) {
    .has-kudos.marked-seen, .has-kudos, dl.has-kudos.is-bookmarked,
dl.has-kudos.marked-seen.is-bookmarked, .kh-highlight-bookmarked-yes .has-kudos.is-bookmarked, 
.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos.marked-seen {
        background-size: 20px !important;
    }
    .marked-seen:before, .kh-highlight-bookmarked-yes .is-bookmarked:after, dl.is-bookmarked:after { width: 20px }
}



/**8** media rules */
@media only screen and (max-width: 62em) {
    #main.dashboard { margin: auto }
    /* dashboard */
    /* fix space between inline elements */
    #dashboard ul { font-size: 0 }
    #dashboard ul.navigation.actions li { font-size: var(--font-sm) }
    #dashboard .current { 
      border-right: 0;
      border-bottom: .125rem solid var(--text-tab-current);
      padding-bottom: 0;
    }
    #dashboard ul.navigation.actions li a {
      border-right: 0;
      border-bottom: 0.0625rem solid var(--border-alt);
      padding: 0 var(--spacing-1) 0.0625rem var(--spacing-1);
    }
    #dashboard .pseud { display: contents }
    #dashboard .expandable.secondary {
      display: block;
      padding: var(--spacing-1);
    }
    #dashboard .expandable.secondary.hidden { display: none }
    #dashboard ul.navigation.actions li a[title*="Switcher"] {
      border-color: transparent;
      border-radius: var(--rounded);
      vertical-align: baseline;
    }
  }
  @media only screen and (max-width: 42em) {
    .javascript, #outer { background: var(--background-main) }
  /* font adjustments */
  /* ? add separate font styles 
    #modal .userstuff, #outer .userstuff { }
    .userstuff p { }
    */
   /* comments */
    .comment h4.byline {
      padding-left: 0;
      margin-left: 58px
    }
    .icon[src="/images/skins/iconsets/default/icon_user.png"], .abbreviated .icon[src="/images/skins/iconsets/default/icon_user.png"]{ padding: 50px 0 0 50px }
     /* main content width */
    #main { padding: var(--spacing-1) var(--spacing-3) }   
    /* header */
    #header > h1 > a > span, #header > h1 > a > sup { display: none }
    #header .logo { padding: 25px 0 0 36px; }
    #greeting .navigation.actions + .icon { display: none }
    #header .primary a { padding: 0.25em 0.5em }
    #header .user .open a:focus { 
      color: var(--text-main);
      background: var(--dropdown);
    }
    #header .menu, #small_login, #header .dropdown:hover .current + .menu, #header .menu, #small_login, #header .dropdown:hover .current + .menu { width: auto }
    #header .primary.navigation li:nth-child(4) .menu { right: 0 }
    #header li {
      display: inline-block;
      float: none;
    }
    #header .search {
      float: none;
    }
    #greeting .navigation.actions a[href*="/users/logout"], #header #search .button {
      font-size: 0;
      height: 1.386rem;
      border-radius: var(--rounded);
    }
    #header #search .button { height: 1.5rem }
    #greeting .navigation.actions a[href*="/users/logout"]:before {
      font-size: var(--font-sm);
      content: "\\2002";
      width: 0.7rem;
      position: relative;
      left: 0.5em;
      display: inline-block;
      border: 0.1rem solid var(--text-main);
      border-radius: var(--rounded) 0 0 var(--rounded);
      border-right-width: 0;
    }
    #greeting .navigation.actions a[href*="/users/logout"]:after {
      font-size: var(--font-md);
      content: "\\21AA";
    }
    #header #search .text { max-width: 10em }
    #header #search .submit.actions {
        position: relative;
        display: inline-block;
        border-radius: 0.25em;
        padding: 0 .25em;
    }
    #header #search .submit.actions:before {
        content: "\\21B5";
        font-size: 1rem;
        position: absolute;
        top: 0;
    }
    #header #search .submit.actions:hover { background-color: rgba(255, 255, 255, .09) }
    #header #search .button:hover { background: none }
    /* blurbs */
    li.blurb, .blurb .blurb { padding: 0.5em }
    .blurb .header .heading, .blurb .header ul { margin: 0 }
    .blurb[class*="external"] .fandoms.heading { min-height: auto }
    .blurb .header p.notice { margin-top: var(--spacing-2) }
    .blurb > .header h4.heading { padding-top: 30px } /* work */
    .picture.blurb > .header h4.heading, .blurb > .picture.header h4.heading { padding-top: var(--spacing-4-5) } /* work */
    .picture.blurb > .header, .blurb > .picture.header { 
      padding-left: 59px; /* people */
      box-sizing: border-box; 
    }
    .index .picture .icon { left: 0 }
    .blurb ul.required-tags { width: auto }
    .blurb ul.required-tags li {
      display: inline-block;
      vertical-align: middle
    }
    .blurb ul.required-tags li+li+li, .blurb ul.required-tags li+li+li+li { position: static }
    .blurb ul.required-tags li:nth-child(2) {
      position: relative;
      left: 28px;
    }
    .blurb ul.required-tags li:nth-child(3) {
      position: relative;
      left: auto;
      right: 28px;
    }
    .bookmark p.status {
      margin: 0;
      margin-right: 4em;
      float: right;
    }
    .bookmark span.count {
      position: static;
      vertical-align: top;
    }
    .bookmark .status span, .bookmark .status a { display: inline-block }
    .status .private .text { vertical-align: top}
    .bookmark .datetime {
      top: 0;
      font-size: var(--font-xs);
      width: 4em;
      text-align: end;
      line-height: 1;
    }
    .bookmark .user .byline, .bookmark .own.user .byline { margin-right: 3em }
    /* work */
    ul.work.navigation.actions { 
      margin-bottom: var(--spacing-2);
      position: relative;
    }
    .work.navigation.actions .expandable.secondary {
      top: 0;
      right: 0;
      left: 0;
      bottom: initial;
    }
    #chapter_index {
      top: initial;
      bottom: 0;
    }
    #chapter_index p {
      width: 100%;
      padding: 0;
    }
    #chapter_index select { 
      width: 100%;
      max-width: 11rem
    }
    #chapter_index li:last-child a { 
      font-size: 0;
      padding-bottom: 1.525rem;
    } 
    #chapter_index li:last-child a:before { 
      content: "\\2261";
      font-size: var(--font-xxl);
      position: relative;
      line-height: 0.8;  
    } 
    .preface.group { margin: var(--spacing-4-5) }
    .chapter.preface.group h3.title { padding-top: 1em }
    .comment div.icon {
      margin: 0;
      position: absolute;
      top: 0.25rem;
      left: 0.15rem;
    }
    .comment blockquote.userstuff p:first-child { text-indent: 50px }
    /* collections */
    .module.primary.header { 
      display: table;
      margin-bottom: 0;  
    }
    .home .header .userstuff, .home .header dl.stats, .home .header .type { margin-left: 0 }
    .home .header h2 { 
        min-height: 50px;
        margin-left: 75px
     }
    .icon, .icon img {
      height: 75px;
      width: 75px;
    }
    .tag .primary .icon {
      height: 100px;
      width: 100px;
    }
    .home .header .icon[src="/images/skins/iconsets/default/icon_user.png"] { padding: 75px 0 0 75px }
    .home .header ul.actions { margin-left: 0 }
    /* forms adjustments */
    #advanced_skin .removeme > fieldset > p {
      display: block;
      width: auto;
      float: none;
    }
    #advanced_skin .removeme > fieldset > ul.autocomplete { width: auto }
    .toggled form fieldset dl, .dynamic form fieldset dl { margin: 0 }
    .toggled form p.footnote, .dynamic form p.footnote { line-height: 1 }
    fieldset, form dl { 
      margin-left: 0;
      margin-right: 0;
    }
    p select, p select+input { margin-bottom: 0 }  
    /* filters */
    .javascript form.filters { right: -14em }
    /* pages adjustments */
    .faq .heading .actions a { margin-top: var(--spacing-1) }
    dl#symbols-key dd { margin-top: -30px }
    #symbols-key>dt:before { width: 4em }
    #symbols-key>dt:nth-of-type(2):before { content: "\\25A2\\25A2\\25a8\\25A2" }
    #symbols-key>dt:nth-of-type(3):before { content: "\\25A2\\25a8\\25A2\\25A2" }
    .admin .primary .icon { background-position: -75px -375px }
    .skins .primary .icon { background-position: -75px -450px }
    #main.invitations-manage { overflow-x: auto }
    .blurb dl.tags dt, .blurb dl.tags dd, dl.meta dt, dl.meta dd, .alphabet .listbox li, .media .listbox {
      width: auto;
      float: none;
    }
    .listbox, .removeme fieldset, .tags li.listbox, fieldset fieldset.listbox { margin-top: var(--spacing-6) }
    .media .listbox { width: 100% }
    .media .listbox p.actions {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
  }
    .media .listbox:after {
      content: "";
      clear: both;
      display: table;
    }
    .child.listbox.group { padding-top: var(--spacing-3) } 
    a[href="/users/orphan_account"] img.icon { padding: 75px 0 0 75px }
  /* edit works */
    .concise li { width: 90% }
    /* modal */
    #modal { width: 90% }
    #modal .content { padding: var(--spacing-3) }
    #main.errors { background-position: center 75% }
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

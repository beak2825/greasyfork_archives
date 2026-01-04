// ==UserScript==
// @name         Sudomemo Theatre (Halloween theme)
// @namespace    https://sudomemo.net/
// @description  to run this theme, run this script.
// @author       Sudomemo, Ghost64
// @include        https://www.sudomemo.net/*
// @grant       GM_addStyle
// @run-at      document-start
// @version 0.0.1.20230813183747
// @downloadURL https://update.greasyfork.org/scripts/473008/Sudomemo%20Theatre%20%28Halloween%20theme%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473008/Sudomemo%20Theatre%20%28Halloween%20theme%29.meta.js
// ==/UserScript==
GM_addStyle ( `
@charset "UTF-8";
:root {
    --theatre-primary: #d05124;
    --bg-halloween-tile: url(data:image/png;base64,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);
    --header-frog-popular: url(/theatre_assets/theme/sudomemo_halloween/header_frog/popular.png);
    --header-frog-hot: url(/theatre_assets/theme/sudomemo_halloween/header_frog/hot.png);
    --header-frog-news: url(/theatre_assets/theme/sudomemo_halloween/header_frog/news.png);
    --header-frog-spotlight: url(/theatre_assets/theme/sudomemo_halloween/header_frog/spotlight.png);
    --header-frog-ranking: url(/theatre_assets/theme/sudomemo_halloween/header_frog/ranking.png);
    --header-frog-recent: url(/theatre_assets/theme/sudomemo_halloween/header_frog/recent.png);
    --header-frog-comments: url(/theatre_assets/theme/sudomemo_halloween/header_frog/comments.png);
    --header-frog-random: url(/theatre_assets/theme/sudomemo_halloween/header_frog/random.png);
    --header-frog-music: url(/theatre_assets/theme/sudomemo_halloween/header_frog/music.png);
    --header-frog-fans: url(/theatre_assets/theme/sudomemo_halloween/header_frog/fans.png);
    --header-frog-trophies: url(/theatre_assets/theme/sudomemo_halloween/header_frog/trophies.png);
}

h1,
h2,
h3,
h4,
h5,
h6 {
    color: #fff;
}

.table {
    color: #fff;
}

hr {
    background-color: #fff;
}

a.topic-banner {
    background-image: var(--bg-halloween-tile);
}

.panel-welcome {
    background-image: var(--bg-halloween-tile);
}

body {
    padding-left: 0px !important;
}

.theme-body {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    background-image: url(/theatre_assets/theme/sudomemo_halloween/fog_tile.png), url(/theatre_assets/theme/sudomemo_halloween/dark_stars.png);
    background-attachment: fixed;
    background-color: #35383c;
    color: white;
}


/* Fog animation (disabled on devices not wide enough to make it out) */

@media only screen and (min-width: 600px) {
    body.theme-body {
        overflow-x: hidden;
        background-image: url(/theatre_assets/theme/sudomemo_halloween/dark_stars.png);
    }
    body.theme-body:before,
    body.theme-body:after {
        content: "";
        position: fixed;
        z-index: -1;
        will-change: transform, opacity;
        height: 100%;
        width: 300%;
        background-size: contain;
        background-position: center;
        background-repeat: repeat-x;
        left: 0px;
    }
    body.theme-body:before {
        margin-top: -20px;
        background-image: url(/theatre_assets/theme/sudomemo_halloween/fog_1.png);
        - animation: drift 200s linear 0s infinite, flicker 60s linear infinite;
    }
    body.theme-body:after {
        top: 0px;
        background-image: url(/theatre_assets/theme/sudomemo_halloween/fog_2.png);
        animation: drift 350s linear 0s infinite, flicker 60s linear infinite;
    }
    @keyframes flicker {
        0%,
        7%,
        27%,
        54%,
        70%,
        100% {
            opacity: 0.4;
        }
        1%,
        14%,
        43%,
        66%,
        80% {
            opacity: 1;
        }
    }
    @keyframes drift {
        from {
            transform: translate3d(0, 0, 0);
        }
        to {
            transform: translate3d(-200vw, 0, 0);
        }
    }
}

.theme-panel-title {
    color: #fff;
    background-color: var(--theatre-primary);
}


/*
.panel-heading {
    font-family: 'Arial Rounded MT Bold', Helvetica Neue, Helvetica, sans-serif;
    letter-spacing: 0.05em;
}
*/

.theme-link {
    /* color: var(--theatre-primary); */
    color: #fff;
}

.theme-link:hover {
    color: var(--theatre-primary);
    text-decoration: underline;
}

.theme-link-inverted {
    color: #fff;
}

.theme-link-inverted:hover {
    color: #fff;
    text-decoration: underline;
}

.wf-loading>body>div.navbar-fixed-top.show-during-boot {
    border-bottom-color: #484848;
}

.theme-navbar-background {
    z-index: 11111;
    /* because hatenastar's menu uses a z-index of over 10000 */
    background: linear-gradient(0deg, rgb(0, 0, 0), rgba(0, 0, 0, 0.55)), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9AgMAAADy7oS2AAAADFBMVEX/mTP/zJj/qVf/unirSjyQAAAFCElEQVRYw7WXy+vTQBDHpxsfTWv0JHjwIGK0+AYJii/yJ/TQaYLGNh71IAERRFAXPfm8VUQUxAd4UBS04EEx6Mk/ICoiqAdRFESFiig+djfZzaZJ9OT3sD9+2Q+zM7Ozs13APkEfhAgKxZDKwgjQBTbLgUXVwIgBryAJAFZ2KoDhO8sFDxZzYOazCgBxB7PAxAA7KgEmMkmAJBzoJewfJwcOSoA5uSpgQDBC9GwJGNi9z4Bk+D7pMrzJgC4D+pYECPbgaSxMMfMt/iWarwOQIA2AZcDBkP0RgIPYMxUwwoil59tA+U1CDjQUYOOAjUGCnlzUdd4MekYKEBHnOwoei1ICsW11X2TAESLyEvMwIwUss6LzJAUuHwcYZ3mgEqDLTAXcvs7WSIEAFLC0ES4EwXc23b0GMOGARxUAMxrh5hRoX93+io2JC98vQg6sNNwNMo1eahQKmmO4nQwYDSiU1THiDHiA3vcKoEnyPPehSgow9g1peRYA5Nd5zvNXpXkDqPSa5eFeZxowjCOa1dsnyys8OgG5jh6Hkl6fhlxHSMkA/XynpXusJH2/d+HFPahWWiOrJsOwBmi4ApOVUZYlgOXoXawBbG66PUEcVpr4Dg4H2CnvQ6VGBxIBNOp8sBEFsGy8PaoETMQDwHS3nIe8dx0SmbzSgkoljOCbv/M0TCkrifkoTik5egKK2hhlYTADqh50OftBCNHPNjAD5soMe5DtQbe4w/OaIDSzm4XJmlRBq16A0NYoNRTYRUD0RKFbYlxPLb9YR+OweN7AUMDMNOldmNIzBTBUdPYpLYBMrQEwLQJNbR57M0+7zJXyskELOB6mfwOMRGxLrk9TgINMUdGCqQEGcg2mAL382bRXqMyzALP18vVGGCSo5XEzwJ013yC/QeZjYKOvYvq1jMJw+FWdQPQdDEzsQaY1Pw+64FHNhZABvIUqjRnwSzsgsY0BjJAqEwkDfqq453swE/2biQKMlxMXMD6TB/HjauFqtR9yC8+sWDsfHh9cSPXC5BbekigHhn47UQAJlyYM2EXl9iOiH8Cq3AI9hwzY64ICvIBuJbkPsJMD/qcc8C/CGXAUYDwWwNn8EIfkQfL7hgqzcYoDweYcODJBLrUXVhEY9e8jlyerdJ4A/CWqnjwU6snzOysFZuV7kcqHrExWmxzoKsDKgIjDlB+gBgfCeVpJqq2w4xarJ8KBmAEqDK4+cODwE2YBWKr701WPvO+QMfriiwt6/27LFQjLR1h1NY+zGCCpacvGBAc0teVBta7JrNZeLgqIIRepAAp96lKnBDwxIsi17i6Uu9YGUGqt+VLy6BNoIpPDMC1a9Cgoz+lakQxflX6E1Fsgu5WJ3IdDequXSa6LwpHm6vLQqAAuNXXgYxk4UujGBP6b9PDrf8jUq33M/YcB/AcAeIjqkTfLO+Yx4P6Q1lZhsl+cbzZybbpV8mEH84E/QFKXt3yg08DRMH3kxLICSnoFprrTyGhbGbiY9iA/q0K1RGeqP/RSl321tqdFOrD7acUZkz2qc/W1SEOra6Cowk2qCse7cwBjs0tQzNxeC5m0LWBzlp/d/8c7sgYw0oGZASSx1hGWu4D7NSAeeaB3jhtTLxQ8jHhQA9rIAJGZyieteiV5NAe8RAOIfG+G+Qd/pgZYEvBzIDI1wJFAvwYYSQCrAYIKiCsBg7mcAWGlkw3sOQLYi1FlmCb6lgCO1r79fXaa/gBo8e6xnfxvqQAAAABJRU5ErkJggg==);
    border-color: #484848;
    border-bottom-width: 2px;
}

.theme-navbar-text li a {
    color: #fff;
}

.theme-navbar-text li a:hover {
    color: var(--theatre-primary);
    background-color: rgba(0, 0, 0, 0.3) !important;
}

.theme-navbar-text .open a,
.theme-navbar-text .open a:hover,
.theme-navbar-text .open a:focus {
    color: var(--theatre-primary);
    background-color: rgba(0, 0, 0, 0);
}

.theme-navbar-text .dropdown-menu a,
.theme-navbar-text .dropdown-menu {
    color: #fff;
    background-color: var(--theatre-primary);
}

.dropdown.open {
    background-color: #000;
}

.dropdown-header {
    font-size: 1em;
    font-weight: bold;
    color: #6d6d6d;
    background-color: #efefef;
}

.dropdown-toggle:focus {
    color: var(--theatre-primary);
}

.btn-custom-active {
    background-color: var(--theatre-primary);
    color: #fff;
    border: solid 1px var(--theatre-primary);
}

.btn-custom-active>a {
    color: #fff;
}

.btn-custom {
    background-color: #35383c;
    color: white;
    ;
    border: solid 1px var(--theatre-primary);
}

.btn-custom>a {
    color: #fff;
}

.btn-custom:hover,
.btn-custom:focus {
    color: var(--theatre-primary);
}

.navbar-custom .navbar-toggle {
    border-width: 2px;
    color: #fff;
}

.navbar-custom .navbar-toggle:hover,
.navbar-custom .navbar-toggle:focus,
.navbar-custom .navbar-toggle:active {
    background-color: #DC8801;
}

.nav>li>a:hover,
.nav>li>a:focus {
    background-color: transparent;
}


/* main.css overrides */


/* Homepage */

.about-sudomemo .left,
.about-sudomemo .right,
.about-sudomemo .big,
.about-sudomemo p {
    color: #fff;
    border: 3px solid var(--theatre-primary);
    background-color: #35383c !important;
}

.about-sudomemo {
    color: #fff;
    background-color: #35383c !important;
}

.about-sudomemo .room {
	color: var(--theatre-primary);
	border-color: var(--theatre-primary);
}

.panel-welcome {
    background-color: #000 !important;
    background-image: var(--bg-halloween-tile);
}

div.grid-footer>a.footer-text {
    color: #fff;
}

.welcome-to {
    text-shadow: unset;
}

.welcome-to h4,
.welcome-to h3 {
    color: #fff;
}

.sudomemo-logo-svg-outline {
    fill: var(--theatre-primary);
}

.sudomemo-logo-svg-play-button {
    stroke: var(--theatre-primary);
}

.sudomemo-logo-svg-mainword {
    stroke: white;
    stroke-width: 20;
}


/* annoying social links */

ul.social-icons>li>a>.fa-stack>i.color-background {
    color: transparent;
}


/* Theatre-wide */

.navbar-brand {
    content: url(/theatre_assets/theme/sudomemo_halloween/sudomemo_logo_orange.svg) !important;
}

div.thumb-container {
    border-bottom: 1px solid #2b2b2b !important;
}

ul.flipnote-list li div.box-container {
    background-color: #4c5157;
}

ul.flipnote-list li {
    box-shadow: none;
}

.flipnote-item-info {
  background-color: black;
}

div.box-container>div.info>span.username a {
    color: #fff;
}


/* Hack for sharing icons bg */

ul.sharing-icons i.fab {
    background: radial-gradient(#fff 55%, transparent 50%);
}

div.info-buttons i.fab {
    background: radial-gradient(#fff 55%, transparent 50%);
}


/* Flipnote view page */

div.flipnote-description {
    background-color: #43474c;
    color: #fff;
}

ul.commentlist .comment {
    background-color: #43474c;
    color: #fff;
}


/* Comment Form (including textarea glow) */

form#postcomment textarea {
    background-color: #43474c;
    color: #fff;
}

form#postcomment textarea:focus {
    border-color: var(--theatre-primary);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgb(220, 63, 1);
}

form#postcomment textarea:disabled {
    color: gray;
}

form#postcomment label {
    color: #fff;
}

span.name {
    color: #fff;
}

div.info-buttons h4 {
    color: #fff;
}


/* Flipnote Player */

.player__controls {
    background: #000;
    color: #fff;
}

.player__scrubber {
    background: #dba48e;
}

.player__controls a.controls__link {
    color: #fff;
}

.scrubber__track__handle {
    background-color: var(--theatre-primary);
}

.scrubber__track__played {
    background-color: var(--theatre-primary);
}


/* Frog on embedded player */

.controls__sudomemo__link>a>img {
    filter: saturate(0) brightness(100);
}


/* Pumpkin Scrubber! */

.scrubber__track__handle:after {
    content: "🎃";
    top: -9px;
    position: absolute;
}


/* Strange positioning difference in embedded page. */

div.embedded-player .scrubber__track__handle:after {
    top: -4px !important;
}

.scrubber__track__handle {
    top: 0px;
    width: 0px;
    height: 0px;
    border: none;
    font-size: 23px;
}


/* quite possibly something we'll want to update the html for to cut down on extra classes */

.theme-panel-body {
    background-color: #35383c !important;
    color: #fff;
}


/* Loading pulser: fox in ghost costume */

div.loadpulse-circle>span.loadpulse-image {
    /* /theatre_assets/theme/sudomemo_halloween/sudomemo_ghost_pulser.png */
    background: url(data:image/png;base64,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) no-repeat;
    width: 100px;
    height: 100px;
    background-size: contain;
}

.loadpulse-ring {
    border: 10px solid #dc4126;
}


/* Profile */

.profile-head #profile-wrapper {
    background-color: var(--theatre-primary);
    color: white;
    border-bottom: 1px solid #4a4b4d
}

div.follow-button>div.btn-group>button.btn-custom {
    background-color: #fff;
    color: var(--theatre-primary);
    border: solid 1px #fff;
}

div.follow-button>div.btn-group>button.btn-custom-active {
    background-color: var(--theatre-primary);
    color: #fff;
    border: solid 1px #fff;
}


/* Candy Stars */

li.star-item>.star-image.yellow {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_yellow.png);
}

li.star-item>.star-image.green {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_green.png);
}

li.star-item>.star-image.red {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_red.png);
}

li.star-item>.star-image.blue {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_blue.png);
}

li.star-item>.star-image.purple {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_purple.png);
}

li.star-item>.star-image-outline.yellow {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_yellow_outline.png);
}

li.star-item>.star-image-outline.green {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_green_outline.png);
}

li.star-item>.star-image-outline.red {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_red_outline.png);
}

li.star-item>.star-image-outline.blue {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_blue_outline.png);
}

li.star-item>.star-image-outline.purple {
    background-image: url(/theatre_assets/theme/sudomemo_halloween/candy_star/candy_star_purple_outline.png);
}

li.star-item>.star-image,
li.star-item>.star-image-outline {
    height: 26px;
    width: 26px;
    margin-top: -4px;
}


/* 2020 updates */

.welcome-frog {
    stroke: #fff;
}

/* 2022 updates */

#frog1, #frog2 {
	margin-top: -40px;
}
` );

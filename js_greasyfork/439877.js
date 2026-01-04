// ==UserScript==
// @name Gloomier - Mono
// @namespace kannibalox
// @version 2.3.1
// @description Gloomier with monospace font
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/439877/Gloomier%20-%20Mono.user.js
// @updateURL https://update.greasyfork.org/scripts/439877/Gloomier%20-%20Mono.meta.js
// ==/UserScript==

(function() {
let css = `@import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');
article, aside, details, figcaption, figure, footer, header, hgroup, main, nav, section, summary { display: block; }
audio, canvas, video { display: inline-block; }
audio:not([controls]) { display: none; height: 0; }
[hidden] { display: none; }
html { font-family: sans-serif; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100% }
body { margin: 0; }
a:active, a:hover, a:focus { outline: 0; }
h1 {font-size: 2em; margin-top: 0.75em; margin-bottom: 0.75em; }
abbr[title] { border-bottom: 1px dotted; }
b, strong { font-weight: bold; }
dfn { font-style: italic; }
hr { -webkit-box-sizing: content-box; -moz-box-sizing: content-box;box-sizing: content-box; height: 1px; background-color: #30373d; border: none; }
mark { background: #ff0; color: #000; }
code, kbd, pre, samp { font-family: monospace, serif; font-size: 1em; }
pre { white-space: pre-wrap; }
q { quotes: "\\201C" "\\201D" "\\2018" "\\2019"; }
small { font-size: 80%; }
sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sup { top: -0.5em; }
sub { bottom: -0.25em; }
img { border: 0; }
svg:not(:root) { overflow: hidden; }
figure { margin: 0; }
fieldset {margin: 0 2px; border-color: #30373d; border-top-style: solid; border-top-width: 0.0625em; padding-top: 0.4625em; border-bottom-style: solid; border-bottom-width: 0.0625em; padding-bottom: 0.9125em; border-left-style: solid; border-left-width: 0.0625em; padding-left: 0.875em; border-right-style: solid;border-right-width: 0.0625em; padding-right: 0.875em; }
legend { border: 0; padding: 0; }
button, input, select, textarea { font-family: inherit; font-size: 100%; margin: 3px; padding: 4px; color: #c3c3c3; background-color: #191d20; border: thin solid #30373d; -webkit-border-radius: 3px;-moz-border-radius: 3px;border-radius: 3px; }
button, input { line-height: normal; }
button, select { text-transform: none; }
button, html input[type="button"], input[type="reset"], input[type="submit"] {-webkit-appearance: button;cursor: pointer;}
button[disabled], html input[disabled] {cursor: default;}
input[type="checkbox"], input[type="radio"] {-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding: 0;}
input[type="search"] {-webkit-appearance: textfield;-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;}
input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-decoration {-webkit-appearance: none;}
textarea {overflow: auto;vertical-align: top; width:95%; min-height: 20%; padding: 5px; }
table {border-collapse: collapse;border-spacing: 0;}
*, *:before, *:after {-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}
blockquote {margin: 10px;padding: 10px;border: dashed thin #30373d;background-color: #171a1d;}
body {color: #c3c3c3;background-color: #0e1012;font-family: "Fira Code", "Segoe UI", Tahoma, sans-serif;font-size: 8pt;margin: 0 auto;text-shadow: 0 1px #000000;}
a {text-decoration: none;color: #9d9d9d;border: none;}
a:hover {text-decoration: none;color: #c3c3c3;border: none;}
.list {margin: 0 0 1em 0;}
.list:last-child {margin-bottom: 0;}
.list--unstyled {list-style: none outside none;padding-left: 0;}
.list--max-count9 {padding-left: 1em;}
.list--max-count99 {padding-left: 2em;}
.list--max-count999 {padding-left: 3em;}
.list--max-count9999 {padding-left: 4em;}
.list--bulleted {list-style-type: disc;}
.list--small-padding {padding-left: 2em;}
.list--form-column {
    float: left;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 1.5em;
}
.list--inline {
    padding-left: 0;
    list-style: none;
}
.list--inline>li {
    display: inline-block;
    padding-right: 5px;
    padding-left: 5px;
}
.list--inline>li:first-child {
    padding-left: 0;
}
.list--inline-full-width {
    display: table;
    width: 100%;
    text-align: center;
}
.list--inline-full-width>li {
    display: table-cell;
}
.list>li {
    margin-top: 2px;
}
p:first-child {
    margin-top: 0;
}
p:last-child {
    margin-bottom: 0;
}
pre {
    margin: 0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}
pre br {
    display: none;
    line-height: 0;
}
th {
    text-align: left;
}
.table {
    width: 100%;
    margin: 0 0 1em 0;
}
.table:last-child {
    margin-bottom: 0;
}
.table>thead>tr, .table>tbody>tr {
    background-color: #0E1012;
}
.table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td {
    border-top: solid thin #30373D;
    line-height: 1.42857;
    padding: 5px;
}
.table thead:first-child tr:first-child th {
    border-top: 0 none;
}
.table--bordered {
    border: solid thin #30373D;
}
.table--bordered>thead>tr>th, .table--bordered>tbody>tr>th, .table--bordered>tfoot>tr>th, .table--bordered>thead>tr>td, .table--bordered>tbody>tr>td, .table--bordered>tfoot>tr>td {
    border: solid thin #30373D;
}
.table--no-border {
    border: 0;
}
.table--no-border>thead>tr>th, .table--no-border>tbody>tr>th, .table--no-border>tfoot>tr>th, .table--no-border>thead>tr>td, .table--no-border>tbody>tr>td, .table--no-border>tfoot>tr>td {
    border: 0;
}
.table--striped>tbody>tr:nth-child(odd)>td, .table--striped>tbody>tr:nth-child(odd)>th {
    background-color: #0E1012;
}
.table--panel-like>thead>tr {
background-color: #171A1D;
}
.table--panel-like>thead>tr>th {
    padding: 4px;
}
.table__background-color--alternative {
    background-color: #0E1012 !important;
}
.table--inplace-sortable>thead>tr>th {
    cursor: pointer;
}
.nobr {
    white-space: nowrap;
}

.clearfix:after, .forum-post__heading:after, .grid:after, .huge-movie-list__movie:after, .poll__bar:after, .sidebar:after, .tabs__bar__list:after {
    content: "";
    display: table;
    clear: both;
}
.text--left {
    text-align: left   !important;
}
.text--center {
    text-align: center !important;
}
.text--right {
    text-align: right  !important;
}
.alert {
    border-radius: 4px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 7px;
}
.alert:first-child {
    margin-top: 0;
}
.alert:last-child {
    margin-bottom: 0;
}
.alert--warning {
    background-color: #0E1012;
}
.alert--error {
    background-color: #0E1012;
}
.alert__link {
    font-weight: bold;
}
.alert__link:hover {
    text-decoration: underline;
}
.alert--error .alert__link {
    font-weight: bold;
}
.alert--error .alert__link:hover {
    text-decoration: underline;
}
.alert-bar {
    width: 400px;
    margin: 5px auto;
    padding: 0.2em;
    font-weight: bold;
    text-align: center;
}
.alert-bar__link {
}
.basic-movie-list__details-row {
    vertical-align: top;
}
.table>tbody>tr.basic-movie-list__details-row {
    background-color: #0e1012;
}
.basic-movie-list__movie__cover {
    width: 117px;
}

.basic-movie-list__movie__cover-link {
    position: relative;
    display: block;
}
.basic-movie-list__movie__cover-link--seen::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    background-image: url("https://passthepopcorn.me/static/common/symbols/seen-overlay.png");
    background-size: cover;
    width: 22px;
    height: 22px;
}

.basic-movie-list__movie__category-icon {
    width: 28px;
    height: 28px;
}
.basic-movie-list__movie__title-row {
    font-weight: bold;
}
.basic-movie-list__movie__new {
    font-size: 10px;
    font-weight: bold;
    opacity: 0.4;
}
.basic-movie-list__movie__bookmark {
    float: right;
}
.basic-movie-list__movie__ratings-and-tags {
    padding-top: 2px;
}
.basic-movie-list__movie__rating-container {
    display: inline;
    padding: 1px 4px;
    margin-right: 4px;
    background-color: #191d20;
    border: thin solid #30373d;
}
.basic-movie-list__movie__rating__title {
    font-weight: bold;
}
.basic-movie-list__movie__tags {
    padding: 2px;
    font-style: italic;
}
.basic-torrent-list__movie__torrent-opener-link {
    font-weight: bold;
    font-style: normal;
    padding-left: 5px;
}
.basic-movie-list__torrent-row {
    height: 1em;
}
.basic-movie-list__torrent-edition__main {
    font-weight: bold;
}
.basic-movie-list__torrent__action {
    float: right;
}
.bbcode-size-1 {
    font-size: 0.75em;
}
.bbcode-size-2 {
    font-size: 1em;
}
.bbcode-size-3 {
    font-size: 1.25em;
}
.bbcode-size-4 {
    font-size: 1.5em;
}
.bbcode-size-5 {
    font-size: 1.75em;
}
.bbcode-size-6 {
    font-size: 2em;
}
.bbcode-size-7 {
    font-size: 2.25em;
}
.bbcode-size-8 {
    font-size: 2.5em;
}
.bbcode-size-9 {
    font-size: 2.75em;
}
.bbcode-size-10 {
    font-size: 3em;
}
.bbcode__image {
    max-width: 500px;
}
.sidebar .bbcode__image {
    width: 100%}
.bbcode-text-preview {
    border: solid thin #30373D;
    padding: 0.5em;
}
.bbcode-toolbar__button {
    background: #0E1012 url("https://passthepopcorn.me/static/common/bbcode_buttons5.png") no-repeat center center;
    width: 24px;
    height: 24px;
    border: 4px solid #0e1012;
    float: left;
}
.bbcode-toolbar__button:hover {
    background: #191d20 url("https://passthepopcorn.me/static/common/bbcode_buttons5.png") no-repeat top left;
border: 4px solid #0e1012;
}
.bbcode-toolbar__size-popup-row {
    cursor: pointer;
    padding: 0 4px;
}
.bbcode-toolbar__size-popup-row:hover {
    background: #191d20;
}
.bbcode-toolbar__color-popup-color {
    cursor: pointer;
    display: inline-block;
    width: 16px;
    height: 16px;
}
.bbcode-toolbar__color-popup-color:hover {
    border: solid 2px #ff8040;
}
.bbcode-toolbar__emoticon-popup-item {
    cursor: pointer;
    display: inline-block;
    border: solid 2px transparent;
}
.bbcode-toolbar__emoticon-popup-item:hover {
    border: solid 2px #ff8040;
}
.bonus-point-history--received {
    color: #418b00;
}
.bonus-point-history--sent {
    color: red;
}
.cover-movie-list__container--centered {
     margin-left: 8px;
}

.cover-movie-list {
     display: inline-block;
     margin: 0px 0px -10px -20px;
}

.cover-movie-list--narrow {
     margin: 0px 0px -10px -12px;
}

.cover-movie-list__movie {
     float: left;
     margin: 0px 0px 10px 20px;
     position: relative;
     text-align: left;
     width: 176px;
}

.cover-movie-list--narrow > .cover-movie-list__movie {
     margin: 0px 0px 10px 12px;
     width: 168px;
}

.cover-movie-list__movie__cover-link {
     display: block;
     height: 246px;
     width: 176px;
}

.cover-movie-list--narrow > .cover-movie-list__movie > .cover-movie-list__movie__cover-link {
     display: block;
     height: 234px;
     width: 168px;
}
.cover-movie-list__movie__undercover {
    padding: 3px;
    background-color: #0e1012;
    border-radius: 0px 0px 6px 6px;
}
.cover-movie-list__movie__title {
    font-weight: bold;
}
.cover-movie-list__movie__new {
    font-size: 10px;
    font-weight: bold;
    opacity: 0.4;
}
.cover-movie-list__movie__rating-and-tags {
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.cover-movie-list__movie__rating {
    background-color: #191d20;
    padding: 1px 4px;
    margin-right: 4px;
}

.cover-movie-list__movie__cover-link--seen::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    background-image: url("https://passthepopcorn.me/static/common/symbols/seen-overlay.png");
    background-size: cover;
    width: 32px;
    height: 32px;
}

.encoding-history-status--finished {
    font-weight: bold;
    color: green;
}
.encoding-history-status--canceled {
    font-weight: bold;
    color: orange;
}
.encoding-history-status--expired {
    font-weight: bold;
    color: red;
}
.footer {
    text-align: center;
    margin: 5px;
}
.footer__disclaimer {
display: none;
}
.form__label {
    font-weight: bold;
}
.form--horizontal .form__label {
    float: right;
}
.form__input {
    margin-right: 0.5em;
    margin-bottom: 0.5em;
}
.generic-form, .search-form {
    width: 785px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 15px;
}
.generic-form--narrow, .search-form--narrow {
    width: 600px;
}
.generic-form--full-width {
    width: 100%}
.search-form--toggleable {
    margin-bottom: 0;
}
.toggleable-search-form__toggler-container {
    text-align: center;
}
.toggleable-search-form__search-form {
    margin-bottom: 15px;
}
.search-form__advanced-basic-toggler {
    text-align: center;
    padding-bottom: 8px;
}
.generic-form__footer, .search-form__footer {
    border-top: thin solid #30373D;
    padding: 10px;
    margin: 5px;
}
.generic-form__footer--right-aligned, .search-form__footer--right-aligned {
}
.generic-form__footer--no-border, .search-form__footer--no-border {
    border-top-style: none;
}
.search-form__footer__results {
}
.forum-post {
    background-color: #0E1012;
    border: thin solid #30373D;
    margin-bottom: 10px;
}
.forum-post--unread {
  -moz-box-shadow: 0 0 3px #b30000;
  -webkit-box-shadow: 0 0 3px #b30000;
  box-shadow: 0 0 3px #b30000;
}
.forum-post__id--staff-post {
    color: #ff0;
}
.forum-post--heading-only {
    margin-bottom: 0px;
}
.forum-post__heading {
background-color:#191d20;
border-bottom: thin solid #30373D;
padding: 4px;
}
.forum-post__avatar-and-body:after {
    content: "";
    display: table;
    clear: both;
}
.forum-post__avatar {
    float: left;
    position: relative;
    padding: 3px;
}
.forum-post__avatar__image {
    display: block;
    width: 150px;
	height: auto;
    border: solid thin #30373D;
}

#reply_box .forum-post__avatar { display: none; }
.forum-post__body {
    overflow: hidden;
    padding: 10px;
}
.forum-topic--is-read {
    background: url(https://passthepopcorn.me/static/forums/read.png) no-repeat center center;
    background-image: url(https://passthepopcorn.me/static/forums/read.png);
}
.forum-topic--is-unread {
    background: url(https://passthepopcorn.me/static/forums/unread.png) no-repeat center center;
    background-image: url(https://passthepopcorn.me/static/forums/unread.png);
}
.forum-topic--is-read-locked-sticky {
    background: url(https://passthepopcorn.me/static/forums/locked_sticky_read.png) no-repeat center center;
}
.forum-topic--is-read-sticky {
    background: url(https://passthepopcorn.me/static/forums/sticky_read.png) no-repeat center center;
}
.forum-topic--is-read-locked {
    background: url(https://passthepopcorn.me/static/forums/locked_read.png) no-repeat center center;
}
.forum-topic--is-unread-locked-sticky {
    background: url(https://passthepopcorn.me/static/forums/locked_sticky_unread.png) no-repeat center center;
}
.forum-topic--is-unread-sticky {
    background: url(https://passthepopcorn.me/static/forums/sticky_unread.png) no-repeat center center;
}
.forum-topic--is-unread-locked {
    background: url(https://passthepopcorn.me/static/forums/locked_unread.png) no-repeat center center;
}
.forum-topic__new {
    color: red;
}
.forum-topic__go-to-last-read {
    float: left;
    background: url("https://passthepopcorn.me/static/styles/dark/images/go_last_read.png") no-repeat center center;
    width: 15px;
    height: 15px;
    margin-left: 5px;
}
.grid {
    margin-left: -1em;
}
.grid__item {
    float: left;
    padding-left: 1em;
}
.grid-u-1 {
    width: 100%}
.grid-u-1-3 {
    width: 33.3%}
.grid-u-1-10 {
    width: 10%}
.grid-u-2-10 {
    width: 20%}
.grid-u-3-10 {
    width: 30%}
.grid-u-4-10 {
    width: 40%}
.grid-u-5-10 {
    width: 50%}
.grid-u-6-10 {
    width: 60%}
.grid-u-7-10 {
    width: 70%}
.grid-u-8-10 {
    width: 80%}
.grid-u-9-10 {
    width: 90%}
.grid-offset-u-1-10 {
    margin-left: 10%}
.grid-offset-u-2-10 {
    margin-left: 20%}
.grid-offset-u-3-10 {
    margin-left: 30%}
.grid-offset-u-4-10 {
    margin-left: 40%}
.grid-offset-u-5-10 {
    margin-left: 50%}
.grid-offset-u-6-10 {
    margin-left: 60%}
.grid-offset-u-7-10 {
    margin-left: 70%}
.grid-offset-u-8-10 {
    margin-left: 80%}
.grid-offset-u-9-10 {
    margin-left: 90%}

.heading:first-child {
    margin-top: 0;
}
.heading--small-bottom-margin {
    margin-bottom: 0.25em;
}
.huge-movie-list__movie {
    background-color: #0e1012;
    border: thin solid #30373d;
}
.huge-movie-list__movie:not(:first-child) {
    margin-top: 15px;
}
.huge-movie-list__movie__cover {
    float: left;
    width: 256px;
}
.huge-movie-list__movie__cover__link {
    display: block;
    height: 360px;
    width: 256px;
}

.huge-movie-list__movie__cover__link--seen::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    background-image: url("https://passthepopcorn.me/static/common/symbols/seen-overlay.png");
    background-size: cover;
    width: 46px;
    height: 46px;
}

.huge-movie-list__movie__details {
    margin-left: 256px;
    position: relative;
    padding: 0 0 0 10px;
}
.huge-movie-list__movie__title {
    font-size: 2.5em;
    font-weight: bold;
}
.huge-movie-list__movie__year {
    font-size: 2.0em;
}
.huge-movie-list__movie__new {
    font-size: 10px;
    font-weight: bold;
    opacity: 0.4;
}
.huge-movie-list__movie__tag-list {
    font-size: 1.5em;
    font-style: italic;
    margin-top: 2px;
}
.huge-movie-list__movie__director-list {
    font-size: 1.5em;
}
.huge-movie-list__movie__ratings-and-synopsis {
    margin-top: 25px;
}
.huge-movie-list__movie__ratings-and-synopsis>tbody>tr>td {
    background-color: #191d20;
    border: solid thin #30373D;
}
.huge-movie-list__movie__ratings {
    width: 130px;
    margin: auto;
}
.huge-movie-list__movie__ratings__icon-column {
    padding: 1px 6px 1px 5px;
}
.huge-movie-list__movie__ratings__votes-column {
    padding: 1px 2px 1px 2px;
}
.huge-movie-list__movie__synopsis {
    padding: 5px;
    font-size: 1.5em;
}
.huge-movie-list__movie__action-row {
    margin-top: 10px;
    font-size: 1.2em;
}
.huge-movie-list__movie__torrent-summary {
    margin-top: 25px;
}
.table>tbody>tr.inbox-message--unread>td {
    background-color: #191d20;
}
.bvalidator_errmsg {
    display: none;
    white-space: nowrap;
    color: #fff;
    font-size: 11px;
    font-weight: bold;
    padding: 4px 10px;
    box-shadow: 2px 2px 2px #222;
    position: relative;
    background: #d51111;
    border: 3px solid #ddd;
}
.bvalidator_errmsg:after, .bvalidator_errmsg:before {
    top: 100%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
}
.bvalidator_errmsg:after {
    border-top-color: #d51111;
    border-width: 8px;
    left: 14px;
    margin-left: -8px;
}
.bvalidator_errmsg:before {
    border-top-color: #ddd;
    border-width: 12px;
    left: 14px;
    margin-left: -12px;
}
.bvalidator_errmsg .bvalidator_close_icon {
    margin-left: 5px;
    margin-top: -2px;
    font-family: Verdana,  Geneva,  sans-serif;
    font-weight: bolder;
    color: #000;
    cursor: pointer;
    font-size: 12px;
}
.bvalidator_errmsg em {
    display: none;
}
#simplemodal-overlay {
    background-color: #000;
    cursor: wait;
}
#simplemodal-overlay-pointer {
    background-color: #000;
    cursor: pointer;
}
#simplemodal-container a.modalCloseImg {
    background: url(https://passthepopcorn.me/static/common/simplemodal_close.png) no-repeat;
    width: 25px;
    height: 29px;
    display: inline;
    z-index: 3200;
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
}
.last5-movies {
    padding: 1em 0 1em 0;
    font-size: 8pt;
}
.last5-movies__table {
    margin: 0 auto;
}
.last5-movies__table>tbody>tr>td {
    padding: 0 10px;
}
.last5-movies__link {
    display: inline-block;
    width: 106px;
    height: 150px;
    margin-bottom: 5px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}
.lightbox {
    position: fixed;
    text-align: center;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    padding: 0px;
    z-index: 1002;
    overflow: auto;
}
.lightbox__shroud {
    position: fixed;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1001;
}
html.lightbox__scroll-lock {
    position: fixed;
    overflow-y: scroll;
    width: 100%}
.main-column {
    margin: 0 255px 10px 0;
    max-width: 715px;
    overflow: hidden;
}
.main-menu {
    width: 100%;
    margin: 20px auto 0 auto;
    z-index: 7;
    border-top: solid thin #30373D;
}
.main-menu__list {
text-align: center;
margin: 5px;
}
.main-menu__item {
    display: inline;
    margin: 0px;
    text-align: center;
    font-size: 15px;
}
.main-menu__link {
    padding: 5px;
    padding-left: 0;
}
.mediainfo {
    margin: 0;
    width: auto;
}
.mediainfo>tbody>tr, .mediainfo__section>tbody>tr {
    background-color: #0e1012;
    vertical-align: top;
}
.mediainfo>tbody>tr>td {
    border: solid thin #30373D;
    padding: 5px;
}
.mediainfo__section {
    margin: 0;
    width: 100%;
    border: none;
    border-top: solid thin #30373d;
    border-collapse: collapse;
}
.mediainfo__section__caption {
    font-weight: bold;
}
.mediainfo__section>tbody>td {
    border: none;
    padding: 2px;
}
.mediainfo--in-release-description {
    width: 100%}
.mediainfo--in-release-description>tbody>tr, .mediainfo--in-release-description .mediainfo__section>tbody>tr {
    background-color: #0e1012;
}
html.busy-cursor, html.busy-cursor * {
    cursor: wait !important;
}
.label {
    font-weight: bold;
width: 35%;
}
.linkbox {
    text-align: center;
    margin: 5px 5px 10px 5px;
}
.large-torrent-list-group-opener {
    background: url("https://passthepopcorn.me/static/styles/dark/images/show.png") no-repeat center center;
    width: 28px;
    height: 28px;
}
.large-torrent-list-group-opener__link {
    display: block;
    width: 28px;
    height: 28px;
    border: none;
}
.no-seeders {
    color: red;
}
.release-description-preview {
    background-color: #191d20;
    border: thin solid #30373d;
    padding: 10px;
}
.film-club-discuss-link {
    text-align: center;
    font-size: 1.25em;
    padding-top: 0.5em;
}
.site-debug {
    margin-bottom: 15px;
}
.missing-torrent-status--exists {
    font-weight: bold;
    color: green;
}
.missing-torrent-status--trumpable {
    font-weight: bold;
    color: orange;
}
.missing-torrent-status--missing {
    font-weight: bold;
    color: red;
}
.movie-page__torrent__panel {
    background-color: #191d20;
    margin: 10px;
    padding: 10px;
    border: dashed thin #30373d;
}
.table>tbody>tr.movie-page__torrent--highlighted {
    background-color: #444;
}
.movie-page__torrent-reports-title {
    font-weight: bold;
}
.movie-page__torrent-report-container {
    margin-top: 8px;
    background-color: #0e1012;
}
.movie-page__torrent-report-date-and-reason {
    padding: 5px;
    border-bottom: 1px dotted #30373d;
}
.movie-page__torrent-report-description {
    padding: 5px 1rem;
}
.movie-page__torrent-report-staff-comment {
    padding: 5px 1rem;
    border-top: 1px dotted #30373d;
    background-color: #0e1012;
}
.movie-tooltip__title-row {
    font-weight: bold;
    font-size: 13px;
}
.movie-tooltip__title {
}
.movie-tooltip__director-list {
    margin-top: 3px;
}
.movie-tooltip__ratings {
    margin: 3px 0 3px 0;
}
.movie-tooltip__rating-container {
    display: inline;
    padding: 0px 2px;
    margin-right: 4px;
    background-color: #0e1012;
    border: thin solid #30373d
}
.movie-tooltip__rating__title {
    font-weight: bold;
}
.movie-tooltip__tag, .movie-tooltip__rating__title>a {
    color: #c9c9c9;
    font-weight: normal;
}
.movie-tooltip__tag:hover, .movie-tooltip__rating__title>a:hover {
}
.movie-tooltip__trailer {
    position: relative;
    margin-top: 10px;
    width: 120px;
    height: 90px;
    cursor: pointer;
}
.movie-tooltip__trailer__image {
    border-color: #30373d;
    border-style: solid;
    border-width: 1px;
    cursor: pointer;
}
.movie-tooltip__trailer__play {
    position: absolute;
    left: 10px;
    bottom: 10px;
    cursor: pointer;
}
.movie-tooltip__synopsis {
    margin-top: 10px;
    line-height: 12px;
}
.movie-tooltip__torrents {
    margin-top: 10px;
}
.movie-tooltip__action-row {
    margin-top: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    border-top: 2px solid #303030;
}
.page__title {
    text-align: center;
}
.page__main-content {
background-color: #1a1d20;
border: 1px solid #30373d;
    margin: 0 auto;
    overflow: auto;
    padding: 15px 19px 15px 19px;
    width: 1013px;
}
.pagination {
    margin: 5px;
    text-align: center;
}
.pagination__link, .pagination__current-page {
    font-weight: bold;
}
.panel {
    background-color: #0E1012;
    border: thin solid #30373D;
    margin-bottom: 1em;
}
.panel--no-margin {
    margin-bottom: 0;
}
.panel__heading {
background-color: #171A1D;
border-bottom: thin solid #30373D;
padding: 4px;
}
.panel__heading__title {
    font-weight: bold;
}
.panel__body {
    padding: 10px;
}
.poll__title {
    font-weight: bold;
}
.poll__list {
    list-style: none outside none;
    padding-left: 1.5em;
}
.poll__option--blank {
    margin-top: 1em;
}
.poll__bar {
    margin-bottom: 0.75em;
}
.poll__bar--no-margin {
    margin-bottom: 0;
}
.poll__bar__left {
    float: left;
    width: 2px;
    height: 9px;
    background: url("https://passthepopcorn.me/static/styles/dark/images/bar_left.gif") center center no-repeat;
    margin: 0px;
    padding: 0px;
}
.poll__bar__center {
    float: left;
    height: 9px;
    background: url("https://passthepopcorn.me/static/styles/dark/images/bar.gif") repeat;
    margin: 0px;
    padding: 0px;
}
.poll__bar__right {
    float: left;
    width: 2px;
    height: 9px;
    background: url("https://passthepopcorn.me/static/styles/dark/images/bar_right.gif") center center no-repeat;
    margin: 0px;
    padding: 0px;
}
.qtip, .qtip {
    position: absolute;
    left: -28000px;
    top: -28000px;
    display: none;
    max-width: 280px;
    min-width: 50px;
    font-size: 10.5px;
    line-height: 12px;
    border-width: 1px;
    border-style: solid;
}
.qtip-content {
    position: relative;
    padding: 5px 9px;
    overflow: hidden;
    text-align: left;
    word-wrap: break-word;
}
.qtip-shadow {
    -webkit-box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.15);
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.15);
}
.qtip:not(.ie9haxors) div.qtip-content, .qtip:not(.ie9haxors) div.qtip-titlebar {
    filter: none;
    -ms-filter: none;
}
.qtip .qtip-tip {
    margin: 0 auto;
    overflow: hidden;
    z-index: 10;
}
.qtip .qtip-tip, .qtip .qtip-tip * {
    position: absolute;
    color: #123456;
    background: transparent;
    border: 0 dashed transparent;
}
.qtip .qtip-tip canvas {
    top: 0;
    left: 0;
}
.qtip-ptp {
    background: rgba(0, 0, 0, 0.92);
    line-height: normal !important;
    max-width: none !important;
    color: #fff;
    border-color: #30373d;
    border-radius: 4px 4px 4px 4px;
    border-style: solid;
    border-width: 2px !important;
}
.ratio-00 {
    color: red;
}
.ratio-01 {
    color: #ff1300;
}
.ratio-02 {
    color: #ff1300;
}
.ratio-03 {
    color: #ff2600;
}
.ratio-04 {
    color: #ff4c00;
}
.ratio-05 {
    color: #ff5e00;
}
.ratio-06 {
    color: #ff5e00;
}
.ratio-07 {
    color: #ff7100;
}
.ratio-08 {
    color: #ff9700;
}
.ratio-09 {
    color: #fa0;
}
.ratio-10 {
    color: #74c42e;
}
.ratio-20 {
    color: #418b00;
}
.ratio-50 {
    color: #418b00;
}
.ratio-infinite {
    color: #418b00;
}
.table>tbody>tr.release-name-movie-list__details-row {
    background-color: #0e1012;
}
.release-name-movie-list__name {
    font-size: 14px;
}
.release-name-movie-list__movie__release-category {
    vertical-align: middle;
    text-align: center;
    background-color: #191d20;
}
.release-name-movie-list__movie__release-category__link {
    white-space: nowrap;
    font-size: 11px;
    font-weight: bold;
    text-shadow: 1px 1px 1px rgba(5, 5, 5, 0.5);
    margin-left: 3px;
    margin-right: 3px;
}
.release-name-movie-list__movie__release-name {
    font-weight: bold;
}
.release-name-movie-list__movie__new {
    font-size: 10px;
    font-weight: bold;
    opacity: 0.4;
}
.release-name-movie-list__movie__bookmark {
    float: right;
}
.release-name-movie-list__movie__ratings-and-tags {
    padding-top: 2px;
}
.release-name-movie-list__movie__rating-container {
    display: inline;
    padding: 1px 4px;
    margin-right: 4px;
    background-color: #191d20;
    border: thin solid #30373d;
}
.release-name-movie-list__movie__rating__title {
    font-weight: bold;
}
.release-name-movie-list__movie__tags {
    padding: 2px;
    font-style: italic;
}
.screenshot-comparison__container {
    position: fixed;
    overflow: auto;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    text-align: center;
}
.screenshot-comparison__row {
    position: relative;
    left: 0;
    top: 0;
}
.screenshot-comparison__image-container {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%}
.screenshot-comparison__image {
    border: 4px solid #404;
}
.screenshot-comparison__label {
    position: fixed;
    top: 0;
    z-index: 2000;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0px 0px 4px #000, 0px 0px 4px #000, 0px 0px 4px #000, 0px 0px 4px #000;
}
.screenshot-comparison__old-school-toggler-container {
    margin: 20px;
}
.screenshot-comparison__help {
    display: inline-block;
    margin-bottom: 20px;
    max-width: 800px;
    color: #fff;
    text-align: left;
}
.screenshot-comparison__old-school-image {
    width: 20%}
.search-bar {
    width: 1013px;
background-color:#1a1d20;
    padding: 0.6em;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    text-align: center;
border-top:1px solid #30373d;border-left:1px solid #30373d;border-right:1px solid #30373d;-webkit-border-top-left-radius:3px;-webkit-border-top-right-radius:3px;-moz-border-radius-topleft:3px;-moz-border-radius-topright:3px;border-top-left-radius:3px;border-top-right-radius:3px;
}
.search-bar__list {
    display: inline;
    margin: 0 6px;
    padding: 0;
}
.search-bar__search-field {
    display: inline;
    margin: 0;
    position: relative;
}
.search-bar__search-field__form {
    display: inline;
}
.search-bar__search-field__input {
    background-color: #0e1012;
    display: inline;
    position: relative;
    top: -1px;
    font-size: 0.9em;
    color: #777;
    border: solid thin #30373D;
    border-radius: 3px;
    padding: 6px;
}
.search-bar__results {
    display: block;
    position: absolute;
    left: 0;
    width: 232px;
    margin: 0;
    padding: 0;
    border: solid thin #30373D;
background-color: #0e1012;
    z-index: 1000;
}
.search-bar__results__list-item {
    display: block;
    margin: 0;
    padding: 0;
    text-align: center;
    line-height: 15px;
    border-bottom: solid thin #30373d;
background-color: #0e1012;
}
.search-bar__results__list-item--is-highlighted {
    background: #191d20;
}
.search-bar__results__link {
    display: block;
    padding: 5px 8px;
}
.search-bar__results__link, .search-bar__results__link:hover {
    color: #777;
}
.search-bar__results__list-item--is-highlighted>.search-bar__results__link, .search-bar__results__list-item--is-highlighted>.search-bar__results__link:hover {
    color: #fff;
}
.sidebar {
    float: right;
    width: 250px;
}
.sidebar-cover-image {
    display: block;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.site-logo {
display: none;
}
.site-logo__link {
display: none;
}
.small-cover-movie-list__movie {
    float: left;
    position: relative
}
.small-cover-movie-list__movie__link {
    width: 138px;
    height: 196px;
    display: block;
}

.small-cover-movie-list__movie__link--seen::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    background-image: url("https://passthepopcorn.me/static/common/symbols/seen-overlay.png");
    background-size: cover;
    width: 26px;
    height: 26px;
}

.snatchlist-status--seeding, .snatchlist-status--not-hnr {
    color: #418b00;
}
.snatchlist-status--not-seeding, .snatchlist-status--hnr {
    color: red;
}
.snatchlist-status--removed-hnr {
    color: #ff5e00;
}
.staff-toolbar {
    width: 1013px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
    margin-bottom: 5px;
    padding: 6px;
    text-align: center;
    font-weight: bold;
    background-color: #1a1d20;
border: solid thin #30373D;
-webkit-border-radius: 3px;
-moz-border-radius: 3px;
border-radius: 3px;
}
.staff-toolbar__link {
    padding: 2px;
}
.star-rating {
    display: inline-block;
    width: 170px;
    height: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
    background: url("https://passthepopcorn.me/static/common/stars/stars.png") repeat-x;
    cursor: pointer;
}
.star-rating--with-inline-rating-display {
    vertical-align: middle;
}
.star-rating--voting-disabled {
    cursor: default;
}
.star-rating__current-user, .star-rating__site {
    display: block;
    position: absolute;
    float: left;
    width: 170px;
    height: 20px;
    padding: 0;
    margin: 0;
    text-decoration: none;
    text-indent: -9000px;
    font-size: 1px;
    z-index: 20;
}
.star-rating__current-user {
    background: url("https://passthepopcorn.me/static/common/stars/stars.png") left 125px;
    z-index: 19;
}
.star-rating__site {
    background: url("https://passthepopcorn.me/static/common/stars/stars.png") left 100px;
    z-index: 18;
}
.star-rating__inline-rating-display {
    margin-left: 10px;
}
.star-rating--big {
    width: 300px;
    height: 40px;
    background: url("https://passthepopcorn.me/static/common/stars/stars2_big_light_v2.png") repeat-x;
}
.star-rating__current-user--big {
    width: 300px;
    height: 40px;
}
.star-rating__current-user--big {
    background: url("https://passthepopcorn.me/static/common/stars/stars2_big_light_v2.png") left 220px;
}
.star-rating-container--big {
    padding: 4px;
    cursor: pointer;
}
.user-info-bar {
    position: absolute;
    top: 0px;
    width: 100%;
background-color:#1a1d20;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    z-index: 20;
}
.user-info-bar__link {
}
.user-info-bar__link:hover {
}
.user-info-bar__link--important {
    font-weight: bold;
}
.user-info-bar__link--highlighted {
    color: #fff;
    font-weight: bold;
}
.user-info-bar__list {
    display: inline;
    margin: 0px 6px;
    padding: 0;
}
.user-info-bar__item {
    position: relative;
    display: inline;
    vertical-align: middle;
    margin: 0 1px;
    padding: 0px;
    line-height: 20px;
}
.user-info-bar__drop-down-menu {
    visibility: hidden;
    position: absolute;
    z-index: 10;
    left: auto;
    right: 0;
    padding: 10px 10px 10px 10px;
    margin: -10px -10px -10px -10px;
}
.user-info-bar__drop-down-menu__item {
    display: block;
    float: none;
    background: #0e1012;
border-bottom: thin solid #30373D;
border-left: thin solid #30373D;
border-right: thin solid #30373D;

}

.user-info-bar__drop-down-menu__item:first-child {
border-top: thin solid #303730;
-webkit-border-top-left-radius: 3px;
-webkit-border-top-right-radius: 3px;
-moz-border-radius-topleft: 3px;
-moz-border-radius-topright: 3px;
border-top-left-radius: 3px;
border-top-right-radius: 3px;
}

.user-info-bar__drop-down-menu__item:last-child {
-webkit-border-bottom-right-radius: 3px;
-webkit-border-bottom-left-radius: 3px;
-moz-border-radius-bottomright: 3px;
-moz-border-radius-bottomleft: 3px;
border-bottom-right-radius: 3px;
border-bottom-left-radius: 3px;
}

.user-info-bar__item--drop-down-menu-opener:hover>.user-info-bar__drop-down-menu {
    visibility: visible;
    top: 100%}
.user-info-bar__drop-down-menu__link {
    text-align: left;
    text-decoration: none;
    padding: .4em 1.5em;
    display: block;
    position: relative;
    white-space: nowrap;
}
.user-info-bar__drop-down-menu__link:hover {
    text-decoration: none;
    background-color: #191d20;
}
.wiki__diff--added {
    color: green;
    background: #dfd;
    text-decoration: none;
}
.wiki__diff--deleted {
    color: red;
    background: #fdd;
    text-decoration: none;
}

.user-page__recent-movie {
    text-align: center;
    margin-top: 8px;
    margin-bottom: 8px;
}
.user-page__recent-movie__link {
    height: 164px;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: 5px;
}

#userhistory .forum-post--heading-only {
margin-bottom: 3px;
}

#userhistory .forum-post--heading-only .forum-post__heading {
background-color:#0e1012;
border-bottom: none;
}

#userhistory .forum-post__heading {
background-color:#191d20;
border-bottom: thin solid #30373D;
padding: 4px;
}

#user .panel--no-margin {
margin-bottom: 3px;
}

#inbox input {
background-color: #0e1012;
}

#inbox #quickpostform input { background-color: #191D20; }
#inbox .panel__body input { background-color: #191D20; }
.alertbar h2 { text-align: center; }

#subject-container input { background-color: #191D20; }

.forum-post__edited { margin-top: 15px; font-style: italic; }

.report_notice {
background-color: #191D20;
border: thin solid #b30000;
-webkit-border-radius: 3px;
-moz-border-radius: 3px;
border-radius: 3px;
}
.panel__heading__toggler { float: right;font-size: 0.75em; }
.last5-movies__show-all-row { text-transform: uppercase; font-size: 8px; }

.tabs__bar__list {
    display: block;
    margin-top: 0px;
    margin-bottom: 14px;
    border-bottom: 2px solid #30373d;
    padding: 0;
    list-style: none;
}
.tabs__bar__item {
    display: block;
    float: left;
    margin-right: 4px;
}
.tabs__bar__item:first-child {
    margin-left: 10px;
}
.tabs__bar__link, .tabs__bar__link:hover, .tabs__bar__link:active, .tabs__bar__link:focus {
    display: block;
    margin-top: 6px;
    border: 2px solid transparent;
    border-radius: 4px 4px 0 0;
    padding: 8px;
    background-color: #0e1012;
    outline: 0;
}
.tabs__bar__item--active>.tabs__bar__link, .tabs__bar__item--active>.tabs__bar__link:hover, .tabs__bar__item--active>.tabs__bar__link:active, .tabs__bar__item--active>.tabs__bar__link:focus {
    margin-top: 0px;
    margin-bottom: -2px;
    border-top-color: #30373d;
    border-left-color: #30373d;
    border-right-color: #30373d;
    padding-top: 14px;
    padding-bottom: 10px;
    background-color: #0e1012;
    color: #fff;
    cursor: default;
}
.tabs__panel {
    display: none;
}
.tabs__panel--active {
    display: block;
}

.torrent-info-link--user-seeding {
    font-weight: bold;
    color: #ffa10c;
}
.torrent-info-link--user-leeching {
    font-weight: bold;
    color: #ff3232;
}
.torrent-info-link--user-uploaded {
    font-weight: bold;
    color: #f432c9;
}
.torrent-info-link--user-snatched {
    font-weight: bold;
    color: #2a8aed;
}
.torrent-info-link--user-downloaded {
    font-weight: bold;
    color: #20b83e;
}
.torrent-info__download-modifier--free, .torrent-info__download-modifier--half, .torrent-info__download-modifier--neutral {
    font-weight: bold;
}
.torrent-info__trumpable {
    font-weight: bold;
    color: orange;
}
.torrent-info__reported {
    font-weight: bold;
    color: red;
}
.user-recommendation__image {
    display: block;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}
.hidden {
    display: none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

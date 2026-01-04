// ==UserScript==
// @name         Goatlings: Custom Theme
// @version      0.7.26
// @description  Complete overhaul of the Goatlings site theme
// @namespace    https://greasyfork.org/en/users/322117
// @author       Felix G. "Automalix"
// @include      http://www.goatlings.com*
// @include      https://www.goatlings.com*
// @include      http://goatlings.com*
// @include      https://goatlings.com*
// @include      www.goatlings.com*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/392151/Goatlings%3A%20Custom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/392151/Goatlings%3A%20Custom%20Theme.meta.js
// ==/UserScript==

/* None of this script allows for an unfair advantage playing any of the games,
fighting enemies, or buying items from shops/auctions/trades. It is 100% cosmetic ONLY. */

let theme = "normal",
    //theme = "ocean",
    //theme = "dark",
    flag = 0;

const CSSStyles = function(checkFlag){
    if(checkFlag === 0){
        flag = 1;
        let style = document.createElement('style'),
            css = "";
        style.type = 'text/css';
        + function loadStr(){
            /* =================================================================

                                    NORMALIZE CSS

         ==================================================================== */

            const normalize_CSS =+ function(){
                css += `
/* normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */
html {
line-height: 1.15;
-webkit-text-size-adjust: 100%;
}
body {
margin: 0;
}
main {
display: block;
}
h1 {
font-size: 2em;
margin: 0.67em 0;
}
hr {
box-sizing: content-box;
height: 0;
overflow: visible;
}
pre {
font-family: monospace, monospace;
font-size: 1em;
}
a {
background-color: transparent;
}
abbr[title] {
border-bottom: none;
text-decoration: underline;
text-decoration: underline dotted;
}
b,
strong {
font-weight: bolder;
}
code,
kbd,
samp {
font-family: monospace, monospace;
font-size: 1em;
}
small {
font-size: 80%;
}
sub,
sup {
font-size: 75%;
line-height: 0;
position: relative;
vertical-align: baseline;
}
sub {
bottom: -0.25em;
}
sup {
top: -0.5em;
}
img {
border-style: none;
}
form {
margin: 0;
}
button,
input,
optgroup,
select,
textarea {
font-family: inherit;
font-size: 100%;
line-height: 1.15;
margin: 0;
}
button,
input {
overflow: visible;
}
button,
select {
text-transform: none;
}
button,
[type="button"],
[type="reset"],
[type="submit"] {
-webkit-appearance: button;
}
button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
border-style: none;
padding: 0;
}
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
outline: 1px dotted ButtonText;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
/* display: none; <- Crashes Chrome on hover */
-webkit-appearance: none;
margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}
input[type=number] {
-moz-appearance: textfield; /* Firefox */
}
fieldset {
padding: 0.35em 0.75em 0.625em;
}
legend {
box-sizing: border-box;
color: inherit;
display: table;
max-width: 100%;
padding: 0;
white-space: normal;
}
progress {
vertical-align: baseline;
}
textarea {
overflow: auto;
}
[type="checkbox"],
[type="radio"] {
box-sizing: border-box;
padding: 0;
}
[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
height: auto;
}
[type="search"] {
-webkit-appearance: textfield;
outline-offset: -2px;
}
[type="search"]::-webkit-search-decoration {
-webkit-appearance: none;
}
::-webkit-file-upload-button {
-webkit-appearance: button;
font: inherit;
}
details {
display: block;
}
summary {
display: list-item;
}
template {
display: none;
}
[hidden] {
display: none;
}`
            }();

            /* =================================================================

                                    ROOT COLOURS

        ==================================================================== */

            if (theme == "normal") {
                const normal_CSS_color_styles =+ function(){
                    css += `:root {
--main: #604325;
--main-dark: #392b0d;
--main-faded: #ccc5bd;
--main-button: #897558;
--main-button-hover: #756349;
--main-light: #ae8960;
--main-lightest: #ccbc85;
--main-dropdown: #956e44;
--main-inventory-hover: #f7f4f0;
--secondary-dropdown: #a7865d;
--accent: #f56991;
--secondary-accent: #8e3234;
--content: #FFFFFF;
--link: #1aa0e3;
--link-hover: #a6d8f1;
--link-button-hover: #e0f5ff;
--wrapper: #ffffcd;
--wrapper-darker: #ebdea1;
--wrapper-darkest: #cfd093;
--background: #a0c0a0;
--background-two: #a0c0a0;
--forum-accent: #dbe7fd;
--forum-accent-alt: #FFFFFF;
--forum-accent-sticky: #feb2c9;
--HP-bar: #d72626;
--HP-filler: #E32044;
--club-accent: #f48181;
--like-button: #ffe0b5;
--like-button-grad-1: #fbb450;
--like-button-grad-2: #f89306;
--like-button-border: #c97e1c;
--like-button-text-shadow: #8f7f24;
--like-button-text: #FFF;
}`;
                }();
            }
            if (theme == "ocean") {
                const ocean_CSS_color_styles =+ function(){
                    css += `:root {
--main: #3b3e40;
--main-dark: #392b0d;
--main-faded: #d3d9eb;
--main-button: #3393df;
--main-button-hover: #3da4f5;
--main-light: #9fb5db;
--main-lightest: #ccbc85;
--main-dropdown: #7976cf;
--main-inventory-hover: #f2fbff;
--secondary-dropdown: #9895f0;
--accent: #f56991;
--secondary-accent: #8e3234;
--content: #FFFFFF;
--link: #3aabe6;
--link-hover: #83c5fc;
--link-button-hover: #f2f4ff;
--wrapper: #fffae0;
--wrapper-darker: #e9e4c7;
--wrapper-darkest: #ded9bf;
--background: #98a8d9;
--background-two: #b6e1e4;
--forum-accent: #dbe7fd;
--forum-accent-alt: #FFFFFF;
--forum-accent-sticky: #feb2c9;
--HP-bar: #d72626;
--HP-filler: #E32044;
--club-accent: #f48181;
--like-button: #ffe0b5;
--like-button-grad-1: #fbb450;
--like-button-grad-2: #f89306;
--like-button-border: #c97e1c;
--like-button-text-shadow: #8f7f24;
--like-button-text: #FFF;
}`;
                }();
            }
            if (theme == "dark") {
                const dark_CSS_color_styles =+ function(){
                    css += `:root {
                    --main: #ccc5bd;
                    --main-dark: #392b0d;
                    --main-faded: #392b0d;
                    --main-button: #897558;
                    --main-button-hover: #756349;
                    --main-light: #ae8960;
                    --main-lightest: #ccbc85;
                    --main-dropdown: #956e44;
                    --main-inventory-hover: #f7f4f0;
                    --secondary-dropdown: #a7865d;
                    --accent: #f56991;
                    --secondary-accent: #8e3234;
                    --content: #3f3f3f;
                    --link: #1aa0e3;
                    --link-hover: #a6d8f1;
                    --link-button-hover: #e0f5ff;
                    --wrapper: #222;
                    --wrapper-darker: #111;
                    --wrapper-darkest: #000;
                    --background: #a0c0a0;
                    --forum-accent: #dbe7fd;
                    --forum-accent-alt: #FFFFFF;
                    --forum-accent-sticky: #feb2c9;
                    --HP-bar: #d72626;
                    --HP-filler: #E32044;
                    --club-accent: #f48181;
                    --like-button: #ffe0b5;
                    --like-button-grad-1: #fbb450;
                    --like-button-grad-2: #f89306;
                    --like-button-border: #c97e1c;
                    --like-button-text-shadow: #8f7f24;
                    --like-button-text: #FFF;
                }`
                }();
            }


            /* =================================================================

                                     MAIN CSS

        ==================================================================== */

            const mainCSS =+ function(){
                css += `
/* ============================================================================================

MAIN CSS START

============================================================================================ */

* {
box-sizing: border-box;
}
body {
font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
font-size: 10pt;
font-weight: 400;
line-height: 1.5;
color: var(--main);
background: var(--background);
background: linear-gradient(45deg, var(--background) 0%, var(--background-two) 100%);
}
table, tr, td {
font-size: 10pt;
}
#wrapper {
position: relative;
margin: 0;
padding: 0;
margin: 0 auto;
width: 940px;
background: var(--wrapper);
min-height: 100vh;
}
#content {
background: var(--content);
width: 930px;
min-height: 530px;
margin: 0 auto;
padding: 10px 20px;
border-radius: 4px;
border: 1px solid var(--wrapper-darker);
}
@media only screen and (min-height: 900px) {
#content {
margin: 5px auto 0 auto;
padding: 15px 20px 10px 20px;
min-height: 755px;
}
}

h2 {
margin-top: 0px;
}
a {
text-decoration: none;
color: var(--link);
font-weight: bold;
transition: .1s ease-in-out;
}
a:hover {
color: var(--link-hover);
}
.center {
text-align: center;
}
.page-title {
border-bottom: 1px solid var(--main-faded);
}
.mystuff {
display: inline-block;
margin: 4px;
}
.table {
border: 1px solid #000;
padding: 4px;
margin: 4px;
width: 100%;
}
hr {
border: none;
border-top: 1px solid var(--main-faded);
width: 100%;
margin: 20px auto;
}
/* latin */
@font-face {
font-family: 'Baloo Bhai';
font-style: normal;
font-weight: 400;
font-display: swap;
src: local('Baloo Bhai Regular'), local('BalooBhai-Regular'), url(https://fonts.gstatic.com/s/baloobhai/v5/ZgNWjP5GM7bCUdmXgWyVvGLOMg.woff2) format('woff2');
unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* ============================================================================================


Original Header & Footer Styles


=============================================================================================== */

#header {
position: relative;
}
#active_pet_image {
position: absolute;
right: 10px;
top: 0px;
}
.reset {
clear: both;
}
.navlink {
margin: 2px;
}
#user-info-wrap {
display: flex;
justify-content: space-between;
align-items: center;
margin-top: 2px;
padding: 10px;
width: 100%;
}
#footer {
text-align: center;
padding: 5px;
}
#footer > p:first-of-type {
display:inline-block;
visibility:hidden;
font-size:0.01px;
}
.small-text {
font-size: 10px;
margin: 0;
}
/* here's my footer styles */
#newFootLinks {
width: 98%;
margin: 0 auto;
display: flex;
justify-content: center;
align-items: center;
flex-wrap: wrap
}
.feet-anchor {
margin: 0 auto;
padding: 5px;
font-size: 85%;
display: inline-block;
}
.feet-anchor:first-of-type {
border: none
}

/* ============================================================================================


Inventory Styles


=============================================================================================== */
.inventoryLinks {
display: flex;
width: 80%;
margin: 2px auto;
justify-content: space-around;
color: var(--main-faded);
}
.if-item{
display: inline-block;
padding: 0.3rem 0;
margin: 0;
border-radius: 4px;
transition: background-color 0.2s ease-in-out;
width: 120px;
text-align: center;
}
.if-item:hover{
color: var(--link);
background-color: var(--link-button-hover);
}
.inventory-flex {
display: flex;
width: 98%;
flex-wrap: wrap;
justify-content: center;
padding: 8px 0;
margin: 0 auto 10px auto;
border: 0px solid var(--main);
border-radius: 4px;
}
.item-invent {
display: inline-block;
margin: 5px;
text-align: center;
width: 125px;
border: 1px solid var(--main-faded);
background-color: var(--content);
border-radius: 4px;
padding: 6px 9px 6px 9px;
}
.item-invent img {
background-color: var(--content);
margin: 4px 0;
border-radius: 4px;
}
.inv-item-hover {
border: 0px solid transparent;
transition: background-color 0.12s ease-in-out;
}
.inv-item-hover:hover{
background-color: var(--main-inventory-hover);
}
.item-invent-view {
border-radius: 4px;
border: 1px solid var(--main-faded);
width: 500px;
display: inline-block;
margin-top: 35px;
padding: 5px;
padding-bottom: 15px;
}
#inventoryFooter {
display: block;
text-align: center;
margin: 0 auto;
width: 100%;
}
#inventoryLinks {
text-align: center;
}


/* ============================================================================================


Event Styles


=============================================================================================== */

.dark_flash_text {
font-weight:bold;
}
.flash_data {
border-radius: 4px;
border: 1px solid var(--main-faded);
padding: 10px 5px;
width: 60%;
max-width: 90%;
margin: 5px auto;
}
.mail-message {
border-radius: 4px;
border: 1px solid #000;
padding: 5px;
margin: 5px;
}
.event {
border-radius: 4px;
border: 1px solid var(--main-faded);
margin: 5px 0 0 0;
padding: 5px 10px;
}
#newsBox {
color: var(--main) !important;
border-radius: 4px;
border: 1px solid #392b0d;
width: 500px;
padding: 0 0 5px 0;
margin: 0 auto;
}
#newsBoxTitle {
text-align: center;
margin: 0 auto;
font-weight: bold;
font-size: 14px !important;
}
#newsBoxText {
text-align: center;
padding: 10px 0;
font-size: 12px !important;
}
.random_event {
margin: 0 auto;
border-radius: 4px;
border: 1px solid var(--main-dark);
width: 600px;
padding: 5px;
}
.random_event_image {
float: left;
width: 90px;
}
.random_event_text {
float: left;
text-align: center;
width: 475px;
}

/* ============================================================================================


HA Buddy Closet Styles


=============================================================================================== */

.base_area {
width: 200px;
border: 1px solid var(--main-faded);
border-radius: 4px;
padding: 12px 0 6px 0;
margin: 5px 0 10px;
}
.item_area {
width: 730px;
border: 1px solid var(--main-faded);
padding: 5px;
border-radius: 4px;
margin: 5px;
}
.closetItem {
display: inline-block;
width: 102px;
margin: 5px;
vertical-align: top;
border: 1px solid transparent;
}
.closetItemImg {
cursor: pointer;
}
.addBorder {
border: 1px solid var(--main);
border-radius:4px;
}
.categories > .button {
display: inline-block;
padding: 0.4rem 0.6rem;
margin: 0;
border-radius: 4px;
transition: background-color 0.2s ease-in-out;
min-width: 50px;
text-align: center;
background-color: transparent;
border: 0;
font-weight: bold;
color: var(--link);
}
.categories > .button:hover,
.categories > .button:active,
.categories > .button:focus{
color: var(--link);
background-color: var(--link-button-hover);
}


/* ============================================================================================


Shop Styles


=============================================================================================== */
.main-shop-flex {
display: flex;
justify-content: center;
margin: 0 auto;
text-align: center;
flex-wrap: wrap;
}
.shoparea {
display: inline-block;
margin: 5px;
text-align: center;
}
.itema {
display: inline-block;
margin: 6px;
text-align: center;
transition: background-color .15s ease-in-out;
width: 115px;
padding: 5px 4px;
border: 1px solid var(--main-faded);
border-radius: 4px;
}
.itema img {
border-radius: 4px;
}
.itema > a > img:hover {
background-color: var(--main-inventory-hover);
}
.item-hover {
display: none;
position: absolute;
top: -70px;
left: -190px;
background: #FFF;
border: 1px solid #000;
border-radius: 4px;
width: 200px;
padding: 5px;
}
.cs-nav {
padding: 5px;
border: 1px solid #000;
border-radius: 4px;
width: 97%;
margin-bottom: 10px;
text-align: center;
}
.cs-area {
padding: 5px;
border: 1px solid #000;
border-radius: 4px;
}
.cs-item {
display: inline-block;
vertical-align: top;
margin: 3px;
text-align: center;
}
.cs-item a {
color: var(--link);
}
.cs-item a:hover {
color: var(--link-hover);
}
.book-cat {
display: inline-block;
vertical-align: top;
margin: 5px;
}
.admin-section {
display: inline-block;
width: 350px;
margin: 5px;
}
.doll-info {
display: inline-block;
border-radius: 4px;
border: 1px solid var(--main-faded);
padding: 5px;
text-align: center;
margin: 5px;
}

.shopItem {
position: relative;
display: inline-block;
margin: 7px;
text-align: center;
width: 145px;
border: 1px solid var(--main-faded);
border-radius: 4px;
padding: 10px 10px 5px 10px;
}
.shopItemA {
position: relative;
display: inline-block;
margin: 4px;
text-align: center;
width: 140px;
vertical-align: top;
}
.table-header {
background: #f9e49c;
padding: 5px;
}

/* =========================================== USER SHOPS ============================================== */
.shop-item-holder {
display: flex;
flex-wrap: wrap;
justify-content: center;
border-radius: 4px;
padding: 4px 3px;
margin: 0 auto;
}
.fl {
display: flex;
justify-content: center;
align-items: center;
margin: 0 auto;
text-align: center;
}
.fl-item {
display: inline-block;
padding: 0.5rem 0.9rem;
margin: 0 0.1rem;
border-radius: 4px;
transition: background-color 0.15s ease-in-out;
}
a.fl-item:hover {
color: var(--link);
background-color: var(--link-button-hover);
}
.item-hover {
display: none;
position: absolute;
top: -120px;
left: -85px;
background-color: var(--content);
border: 1px solid var(--main);
border-radius: 4px;
width: 300px;
padding: 5px;
z-index: 444;
}
.item-hover:before,
.item-hover:after {
content: '';
display: inline-block;
position: absolute;
bottom: -11px;  /* Offset top the height of the pointer's border-width */
left: 140px;
z-index: 444;
width: 0;
height: 0;
overflow: hidden;
border: solid 12px transparent;
border-bottom: 0;
border-top-color: var(--content);
}
.item-hover:before {
bottom: -12px; /* Offset of pointer border-width + bubble border-width */
z-index: 443;
border-top-color: var(--main);
}
.sugar-star-shape {
display: inline-block;
width: 6.5px;
height: 6.5px;
position: relative;
text-align: center;
transform: rotate(20deg);
}
.sugar-star-shape:before {
content: "";
position: absolute;
top: 0;
left: 0;
height: 6.5px;
width: 6.5px;
transform: rotate(135deg);
}
.sugar-star-pink {
background: #f386c9;
z-index: 3;
top: 3px;
left: 2px;
}
.sugar-star-pink:before {
background: #f386c9;
z-index:3;
}
.sugar-star-blue {
background: #42a6f2;
z-index:2;
left: -4.5px;
top: -0.5px;
}
.sugar-star-blue:before {
background: #42a6f2;
z-index:2;
}
.currency {
display: inline-block;
width: 10px;
height: 10px;
}

/* ============================================================================================


User Profile Styles


=============================================================================================== */

.profile-info {
border-radius: 4px;
border: 0;
padding: 10px 0 5px 0;
width: 700px;
margin: 0 auto;
text-align: left;
}
.profile-part-one {
width: 686px;
margin: 0 auto 20px auto;
}
.profile-part-one > table {
position: absolute;
}
.profile-part-one > br:first-of-type {
display: none
}
.profile-part-one > b:first-of-type {
margin-top: 4px;
display: inline-block;
}
.profile-part-two {
float: left;
}
.mypets-pet {
    display: inline-flex;
    border-radius: 4px;
    border: 1px solid var(--main-faded);
    margin: 4px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2px;
}
.mygoat-anchor {
    display: block;
    padding: 0 0 5px 0;
}
.mygoat-img {
    display: block;
    width: 150px;
    height: 150px;
    margin: 5px;
}
.goatlings-header-profile{
font-weight: bold;
font-size: 110%;
margin-left: 7px;
margin-top: 12px;
display: block;
}
#profile-part-one-new img {
height: 12px;
width: 12px;
}
#profile-flex {
display: flex;
justify-content: space-around;
align-items: center;
padding: 5px 15px 0 15px;
border: 1px solid var(--main-faded);
border-radius: 4px
}
#profile-flex > #profile-part-one-new > b,
#profile-flex > #profile-part-two-new > b {
padding-right: 5px;
}
#profile-flex > #profile-part-two-new > b:nth-of-type(7),
#profile-flex > #profile-part-two-new > b:nth-of-type(8) {
padding-right: 0;
}
#profile-part-three-new > center > img {
border-radius: 4px
}
#profile-part-three-new > hr {
margin: 3px auto
}
#profile-part-one-new {
flex-basis: 25%;
}
#profile-part-two-new {
flex-basis: 27%;
}
#profile-part-three-new {
}
.line {
border-right: 1px solid var(--main-faded);
display: inline-block;
height: 8rem;
margin-right: 50px;
}

/* ============================================================================================


Goat Lookup Styles


=============================================================================================== */

.profile-box {
display: flex;
justify-content: center;
width: 700px;
margin: 0 auto;
}
.pet-profile-box {
border-radius: 4px;
border: 1px solid var(--main-faded);
padding: 5px;
width: 210px;
margin: 3px;
text-align: center;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}
.pet-profile-box-two {
border-radius: 4px;
border: 1px solid var(--main-faded);
width: 490px;
padding: 10px;
margin: 3px;
}
.pet-profile-box-three {
border-radius: 4px;
border: 1px solid var(--main-faded);
padding: 10px 10px 5px 10px;
width: 695px;
margin: 3px auto;
}
.pet-profile-box-three > b {
margin-left: -7px;
}
.favitem {
display: inline-block;
margin: 5px;
text-align: center;
}

/* ============================================================================================


Forum Styles


=============================================================================================== */

/* These are styles for the colours of the forum tables */
tr[bgcolor="#FFFFFF"]{
background-color: var(--forum-accent-alt) !important;
}
tr[bgcolor="#dbe7fd"]{
background-color: var(--forum-accent) !important;
}
tr[bgcolor="#feb2c9"]{
background-color: var(--forum-accent-sticky) !important;
}
.forum-post {
margin: 5px auto;
width: 700px;
border-radius: 4px;
border: 1px solid var(--main-light);
}
.forum-post-info {
float: left;
margin: 2px;
padding: 5px;
width: 150px;
border-right: 0px solid var(--main-light);
}
.forum-post-message {
float: left;
margin: 2px;
padding: 5px;
width: 520px;
}
.forum-post-message-bar {
text-align: right;
width: 510px;
}
.forum-reply {
padding: 5px;
text-align: center;
}
.forum-post-small {
margin: 5px;
width: 540px;
border-radius: 4px;
border: 1px solid var(--main-light);
}
.forum-post-message-small {
float: left;
margin: 2px;
padding: 5px;
width: 320px;
}
.forum-post-message-bar-small {
text-align: right;
width: 320px;
}
#livechat {
float: left;
width: 570px;
}
.livechat-msg {
margin: 5px;
border-radius: 4px;
padding: 5px;
border: 1px solid var(--main-light);
width: 550px;
float: left;
}
#livechat-online {
float: left;
vertical-align: top;
margin: 5px;
border-radius: 4px;
padding: 5px;
border: 1px solid var(--main-light);
width: 150px;
vertical-align: top;
}
.like-button {
-moz-box-shadow: inset 0px 1px 0px 0px var(--like-button);
-webkit-box-shadow: inset 0px 1px 0px 0px var(--like-button);
box-shadow: inset 0px 1px 0px 0px var(--like-button);
background: -webkit-gradient(linear,
left top,
left bottom,
color-stop(0.05, var(--like-button-grad-1)),
color-stop(1, var(--like-button-grad-2)));
background: -moz-linear-gradient(top,
var(--like-button-grad-1) 5%,
var(--like-button-grad-2) 100%);
background: -webkit-linear-gradient(top,
var(--like-button-grad-1) 5%,
var(--like-button-grad-2) 100%);
background: -o-linear-gradient(top,
var(--like-button-grad-1) 5%,
var(--like-button-grad-2) 100%);
background: -ms-linear-gradient(top,
var(--like-button-grad-1) 5%,
var(--like-button-grad-2) 100%);
background: linear-gradient(to bottom,
var(--like-button-grad-1) 5%,
var(--like-button-grad-2) 100%);
filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='var(--like-button-grad-1)',
endColorstr='var(--like-button-grad-2)', GradientType=0);
background-color: var(--like-button-grad-1);
-moz-border-radius: 7px;
-webkit-border-radius: 7px;
border-radius: 7px;
border: 1px solid var(--like-button-border);
display: inline-block;
color: var(--like-button-text);
font-family: Trebuchet MS;
font-size: 12px;
font-weight: bold;
padding: 6px 11px;
text-decoration: none;
text-shadow: 0px 1px 0px var(--like-button-text-shadow);
}
.like-button:hover {
background: -webkit-gradient(linear,
left top,
left bottom,
color-stop(0.05, var(--like-button-grad-2)),
color-stop(1, var(--like-button-grad-1)));
background: -moz-linear-gradient(top,
var(--like-button-grad-2) 5%,
var(--like-button-grad-1) 100%);
background: -webkit-linear-gradient(top,
var(--like-button-grad-2) 5%,
var(--like-button-grad-1) 100%);
background: -o-linear-gradient(top,
var(--like-button-grad-2) 5%,
var(--like-button-grad-1) 100%);
background: -ms-linear-gradient(top,
var(--like-button-grad-2) 5%,
var(--like-button-grad-1) 100%);
background: linear-gradient(to bottom,
var(--like-button-grad-2) 5%,
var(--like-button-grad-1) 100%);
filter: progid: DXImageTransform.Microsoft.gradient(startColorstr='var(--like-button-grad-2)',
endColorstr='var(--like-button-grad-1)',
GradientType=0);
background-color: var(--like-button-grad-2);
cursor: pointer;
}
.like-button:active {
position: relative;
top: 1px;
}

/* News post styles */
.news-post {
margin: 5px;
width: 750px;
border-radius: 4px;
border: 1px solid var(--main-light);
padding: 5px;
}
.news-post-who {
height: 70px;
}

/* ============================================================================================


Battle Area Styles


=============================================================================================== */
.HP {
color: var(--HP-bar);
}
.hp_wrapper {
padding: 2px;
background: var(--content);
border-radius: 10px;
border: 1px solid #000;
height: 18px;
width: 156px;
text-align: left;
margin-top: 6px;
}
.hp_filler {
height: 12px;
background: var(--HP-filler);
border-radius: 6px;
}
#battle_log {
border: 1px solid var(--main-light);
border-radius: 4px;
padding: 15px;
width: 80%;
max-width: 100%;
}
#battleAgain{
margin:0 auto;
text-align: center;
}
#battleAgainButton {
margin:20px auto 0 auto;
}
#battleEndLinks {
margin:20px auto 0 auto;
}

/* ============================================================================================


Club Styles


=============================================================================================== */
.club-sidebar {
border: 2px solid var(--club-accent);
padding: 5px;
background: var(--content);
width: 150px;
float: left;
margin: 5px;
text-align: center;
}
.club-area {
border: 2px solid var(--club-accent);
padding: 5px;
background: var(--content);
width: 550px;
min-height: 300px;
float: left;
margin: 5px;
}
.club-name {
background: var(--club-accent);
padding: 5px;
text-align: center;
font-weight: bold;
}
.club-join {
background: var(--club-accent);
padding: 5px;
text-align: center;
font-weight: bold;
}
/* ============================================================================================


Arcade Styles


=============================================================================================== */

.treasure-tile {
display: inline-block;
width: 50px;
height: 50px;
}
.treasure {
width: 500px;
text-align: center;
}
.ss-area {
display: inline-block;
margin: 10px;
width: 100px;
vertical-align: top;
}

/* ============================================================================================


Misc Styles


=============================================================================================== */

#content table {
margin: auto;
}
.item_area,
.news-post {
margin: 20px auto;
}
.habase { /* Not sure where this is used quite yet*/
display: inline-block;
margin: 5px;
}
.explore-area {
display: inline-block;
margin: 5px;
}
.floatleft {
float: left;
margin: 2px;
}
.normal-font {
font-size: 10pt;
}
.bank-area {
border-radius: 4px;
border: 1px solid var(--main-light);
padding: 5px;
text-align: center;
font-size: 140%;
}
.bank-options {
float: left;
margin: 5px;
padding: 5px;
width: 425px;
text-align: left;
font-size: 10pt;
}
.table {
border-radius: 4px;
border: 1px solid var(--main-lightest);
}
.itemcollect {
width: 110px;
display: inline-block;
border: 1px solid #000;
vertical-align: top;
padding: 5px;
text-align: center;
margin: 5px;
}
.trade {
position: relative;
width: 720px;
padding: 5px;
border-radius: 4px;
border: 1px solid #000;
margin: 5px;
}
.trade-item-a {
position: relative;
display: inline-block;
vertical-align: top;
margin: 5px;
width: 110px;
}
.support-reply {
border: 1px solid #000;
margin: 5px;
padding: 5px;
}
.home-items {
display: inline-block;
width: 100px;
margin-bottom: 10px;
}
.goal-wrapper {
display: inline-block;
border-radius: 8px;
width: 100px;
padding: 10px;
text-align: center;
border: 1px solid #DDD;
}
.team-wrapper {
display: inline-block;
border-radius: 8px;
width: 200px;
padding: 10px;
text-align: center;
border: 1px solid #DDD;
}
.team-members-count {
color: var(--secondary-accent);
font-weight: bold;
font-size: 9px;
}
.team-member-btn {
background: #686868;
color: #FFF;
font-weight: bold;
border-radius: 8px;
border: 1px solid #4f4f4f;
padding: 5px;
cursor: pointer;
}

`}();

            /* =================================================================

                               HEADER & DROPDOWN CSS

        ==================================================================== */

            const new_header_and_Dropdown_CSS =+ function(){
                css +=`
#newBanner {
visibility: visible;
}
#navigation {
text-align: left;
width: 100%;
}
/* Remove provided header image, but retain its elements */
#header img {
visibility: hidden;
position: absolute;
width: 0;
height: 0;
top: 0;
}
/* Remove sidebar, but retain its elements */
#sidebar {
top: 0;
left: 0;
visibility: hidden;
opacity: 0;
height: 0 !important;
width: 0 !important;
position: absolute;
}
/* HA Buddy image positioning in new header */
#new_HA_buddy_pic {
left: 30px;
top: 5px;
border-radius: 80px;
width: 110px;
height: 110px;
position: absolute;
}
/* Active goat image positioning in new header */
#active_pet_image img {
left: -120px;
top: -138px;
visibility: visible;
position: absolute;
width: 110px;
height: 110px;
}
/* And now... the navbar */
#nav_bar {
position: absolute;
top: 120px;
left: 8px;
height: 32px;
width: 100%;
line-height: normal;
text-align: center;
background-color: transparent;
vertical-align: middle;
}
#nav_bar ul {
margin: 0;
padding: 0;
list-style: none;
}
#nav_bar li {
margin: 0;
padding: 0;
}
/* the individual menu bubbles */
#nav_bar .nav_item {
display: flex;
background-color: var(--main-dropdown);
justify-content: center;
align-items: center;
border: 3px solid var(--secondary-dropdown);
border-radius: .25rem;
margin: 0 1px;
}
#nav_bar a {
margin: 0;
padding: 0;
text-decoration: none;
border-radius: 2px;
}
/* the individual menu bubbles' list styling */
#nav_bar > ul > li {
float: left !important;
margin: 0;
width: 75px;
height: 32px;
position: relative;
}
/* the individual menu bubbles' content */
#nav_bar > ul > li > a {
color: var(--wrapper);
text-shadow: 2px 0 0 var(--secondary-dropdown),
-2px 0 0 var(--secondary-dropdown),
0 2px 0 var(--secondary-dropdown),
0 -2px 0 var(--secondary-dropdown),
1px 1px var(--secondary-dropdown),
-1px -1px 0 var(--secondary-dropdown),
1px -1px 0 var(--secondary-dropdown),
-1px 1px 0 var(--secondary-dropdown);
font-family: 'Baloo Bhai', Verdana, sans-serif;
font-size: 11.5pt;
line-height: 20px;
display: block;
width: 100%;
padding: 3px 2px 2px 2px;
transition: color .05s;
/* other browser compatibility */
-webkit-transition: color .05s;
-moz-transition: color .05s;
-o-transition: color .05s;
}
#nav_bar > ul > li > a:hover {
color: white;
}
/* the main body of the dropdown */
#nav_bar > ul > li > ul {
opacity: 0;
visibility: hidden;
padding: 0;
background-color: var(--main-dropdown);
text-align: left;
position: absolute;
border: 3px solid var(--secondary-dropdown);
top: 55px;
left: 50%;
margin-left: -90px;
width: 180px;
transition: all .2s .05s;
border-radius: 4px;
box-shadow: 0px 1px 3px rgba(0, 0, 0, .4);
z-index: 99;
/* other browser compatibility */
-webkit-transition: all .2s .05s;
-moz-transition: all .2s .05s;
-o-transition: all .2s .05s;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
-webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, .4);
-moz-box-shadow: 0px 1px 3px rgba(0, 0, 0, .4);
}
#nav_bar > ul > li:hover > ul {
opacity: 1;
top: 42px; /* how far from the top the dropdown animation will go  */
visibility: visible;
}
/* the "nipple" */
#nav_bar > ul > li > ul:before,
#nav_bar > ul > li > ul:after {
content: '';
display: block;
border-color: transparent transparent var(--main-dropdown) transparent;
border-style: solid;
border-width: 10px;
position: absolute;
top: -18px;
left: 50%;
margin-left: -10px;
z-index: 3;
}
#nav_bar > ul > li > ul:after { /* the nipple's outline */
top: -21px; /* Offset of pointer border-width + bubble border-width */
border-bottom-color: var(--secondary-dropdown);
z-index: 2;
}
#nav_bar > ul ul > li { /*.dropdown-item*/
position: relative;
z-index: 4;
}
/* the dropdown menu body's text */
#nav_bar ul ul a {
color: var(--wrapper);
font-size: 9pt;
background-color: var(--main-dropdown);
padding: 6px 8px;
display: block;
transition: background-color .05s;
/* other browser compatibility */
-webkit-transition: background-color .05s;
-moz-transition: background-color .05s;
-o-transition: background-color .05s;
}
#nav_bar ul ul ul {
/* sub-sub-menu */
visibility: hidden;
opacity: 0;
position: absolute;
top: -5px; /* affects the dropdown animation direction */
left: 200px; /* affects the dropdown animation direction */
padding: 2px 0;
background-color: var(--main-dropdown);
border: 3px solid var(--secondary-dropdown);
text-align: left;
width: 180px;
transition: all .2s;
border-radius: 4px;
box-shadow: 0px 1px 3px rgba(0, 0, 0, .4);
/* other browser compatibility */
-webkit-transition: all .2s;
-moz-transition: all .2s;
-o-transition: all .2s;
-webkit-border-radius: 4px;
-moz-border-radius: 4px;
-webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, .4);
-moz-box-shadow: 0px 1px 3px rgba(0, 0, 0, .4);
}
/* the "nipple" for the sub-menu */
#nav_bar > ul > li > ul > li > ul:before,
#nav_bar > ul > li > ul > li > ul:after {
content: '';
display: block;
border-color: transparent var(--main-dropdown) transparent transparent;
border-style: solid;
border-width: 10px;
position: absolute;
top: 7px;
left: -9px;
margin-left: -9px;
z-index: 3;
}
#nav_bar > ul > li > ul > li > ul:before { /* the sub-menu nipple's outline */
top: 7px;
left: -13px; /* Offset of pointer border-width + bubble border-width */
border-right-color: var(--secondary-dropdown);
z-index: 2;
}
#nav_bar ul ul > li:hover > ul {
opacity: 1;
top: -5px;
left: 190px;
visibility: visible;
}
#nav_bar ul ul a:hover {
background-color: var(--wrapper);
color: var(--main);
}`
            }();

            /* =================================================================

                     BUTTON, SELECT, INPUT & NEW SEARCHBAR CSS

        ==================================================================== */

            const new_Search_Bar_CSS =+ function(){
                css += `
/* ================================================================ */
form {
display: flex;
justify-content: center;
align-items: center;
}
.slider-btn {
cursor: default !important;
}
.button, input[type="button"], input[type="submit"] {
display: inline-block;
font-weight: 500;
text-align: center;
padding: 5px 10px;
white-space: nowrap;
color: var(--content);
background-color: var(--main-button);
border: 1px solid var(--secondary-dropdown);
border-radius: 4px;
cursor: pointer;
margin: auto 2px;
transition: color .15s ease-in-out,
background-color .15s ease-in-out,
border-color .15s ease-in-out,
box-shadow .15s ease-in-out;
}
.button:focus, .button:hover, input[type="button"]:hover, input[type="submit"]:hover {
color: var(--wrapper);
background-color: var(--main-button-hover);
border-color: var(--main-dropdown);
text-decoration: none;
}
.custom-input, input[type="text"], input[type="number"], input[type="password"] {
display: inline-block;
padding: 4px 10px;
color: var(--main);
background-color: var(--content);
background-clip: padding-box;
border: 1px solid var(--main-faded);
margin: auto 2px;
border-radius: 4px;
-webkit-appearance: textfield;
-moz-appearance: textfield;
transition: border-color .15s ease-in-out,
box-shadow .15s ease-in-out;
}
.custom-select, select {
display: inline-block;
width: auto;
padding: 5px 21px 5px 10px;
margin: auto 2px;
color: var(--main);
vertical-align: middle;
overflow: visible;
background: var(--content) url("https://i.imgur.com/vh9MNoE.png") no-repeat right 10px top 12px;
background-size: auto;
background-size: 6px 4px;
border: 1px solid var(--main-faded);
border-radius: 4px;
-webkit-appearance: none;
-moz-appearance: none;
appearance: none;
}

/* ================================================================ */

.new-searchbar {
width: 80%;
position: relative;
display: flex;
flex-wrap: wrap;
align-items: stretch;
}
#searchbar-footer {
width: 70%;
margin:0px auto;
}
.search-footer {
margin: 15px auto 0 auto;
}
.new-searchbar > .custom-input {
width: 1%;
position: relative;
flex: 1 1 auto;
margin-bottom: 0;
}
.input-suffix, .input-prefix, .input-sandwich {
position: relative;
z-index: 2;
}
.input-suffix {
margin-left: -5px;
}
.input-prefix {
margin-right: -5px;
}
.input-sandwich {
margin: auto 0 auto -5px;
}
.input-prefix, .input-suffix, .input-sandwich {
display: flex;
}
.new-searchbar > .input-prefix > .custom-select {
border-top-right-radius: 0;
border-bottom-right-radius: 0;
}
.new-searchbar > .input-suffix > .custom-select,
.new-searchbar > .input-suffix > .button {
border-top-left-radius: 0;
border-bottom-left-radius: 0;
}
.new-searchbar > .input-sandwich > .custom-select,
.new-searchbar > .input-sandwich > .custom-input {
border-radius: 0;
}
.no-curves {
border-radius: 0 !important;
}
::placeholder {
color:var(--main-faded);
}
#search-button {
width: 15px;
height: 15px;
margin:0 20px;
cursor: pointer;
}

/* ========== Mini variations of the default inputs ========== */

.select-mini {
background-position-x: 93%;
background-position-y: 55%;
background-repeat: no-repeat;
padding: 6px 24px 6px 10px;
}
.mini-search {
margin:0;
width:100%;
}
.mini-height {
height: 26px;
}
.mini-padding {
padding: 0 10px 2px 10px;
}

/* ============ The sliding search bar ============ */

#search-bar-slidein {
height: 0;
width: 100%;
display: flex;
justify-content: flex-end;
background-color: var(--wrapper);
transition: 0.4s;
opacity: 1;
margin-top: -5px;
}
#search-bar {
opacity: 0;
transition: 0.5s;
width: 450px;
margin-right: 10px;
}
`}();

            /* ======================================================================== */
        }();// end of CSS string Setter
        style.innerHTML = css;
        document.head.appendChild(style);
        flag = 1;
    }
}
const bodyScript = function(checkFlag){
    if(checkFlag === 1 && document.body && document.body.textContent){
        "use strict";
        flag = false;
        let css = "";
        const url = document.URL,
              style = document.createElement("style"),
              bodyText = document.body.textContent || document.body.innerText;

        const getAuthToken = function() {
            let linkArr = document.links,
                urls = [];
            for (let anchors of linkArr) urls.push(anchors.href);
            if(!urls.find(value => /\/login\/logout\/.{32}\//.test(value))) return null;
            let logout = urls.find(value => /\/login\/logout\/.{32}\//.test(value)),
                pos = logout.indexOf("logout"),
                TOKEN = logout.slice(pos + 7, pos + 39);
            return TOKEN;
        }
        /* The auth token is required for many features on the site.
           This is not saved anywhere except on the current page you are viewing. */
        const token = getAuthToken();

        // Remove extraneous elements
        if(document.querySelector(`.reset`)) document.querySelector(`.reset`).remove();

        // Add commas to big numbers for easier viewing
        const commarizer = function(n){
           return Number(n).toLocaleString()
        }

        // Adjusting the style of pagnation in various places
        function pagnaTor(position){
            let currentPage, mainNode;
            switch(position){
                case "shopPagnation":
                    currentPage = document.querySelector('#content > strong');
                    mainNode = document.querySelector('#content');
                    break;
                case "forumPagnation":
                    currentPage = document.querySelector('#content > center > strong');
                    mainNode = document.querySelector('#content > center');
                    break;
                case "forumPagnationBelow":
                    currentPage = document.querySelector('.forum-post > center > strong');
                    mainNode = document.querySelector('.forum-post > center');
                    break;
                case "newsPagnation":
                    currentPage = document.querySelector('#content > center:nth-child(4) > strong');
                    mainNode = document.querySelector('#content > center:nth-child(4)');
                    break;
                case "newsPagnationBottom":
                    currentPage = document.querySelector('#content > center:last-of-type > strong');
                    mainNode = document.querySelector('#content > center:last-of-type');
                    break;
                case "safePagnation":
                    currentPage = document.querySelector('#content > strong:last-of-type');
                    mainNode = document.querySelector('#content')
                    break;
            }
            let flex = document.createElement('div');
            flex.classList.add("fl");
            let pagnationArr = [];
            for(let child of [...mainNode.children]) {
                if (child.hasAttribute("data-ci-pagination-page") || child.localName == "strong") pagnationArr.push(child);
            }
            for(let item of pagnationArr) {
                if(item && item.classList) item.classList.add("fl-item");
                flex.appendChild(item)
            }
            mainNode.appendChild(flex);
            // pagnation button to a nicer arrow
            for(let anchor of [...document.querySelectorAll('.fl-item')]){
                switch(anchor.textContent){
                    case "<":
                        anchor.textContent = "❮"
                        break;
                    case ">":
                        anchor.textContent = "❯"
                        break;
                    case "‹ First":
                        anchor.textContent = "First"
                        break;
                    case "Last ›":
                        anchor.textContent = "Last"
                        break;
                }
            }
        }
        let theresPagnation;
        for(let anchors of document.links) {
            if(anchors.hasAttribute("data-ci-pagination-page")) theresPagnation = true;
        }

        /* ===============================================================


                            NEW HEADER & DROPDOWN HTML


        ================================================================== */

        let HAbuddy = "";
        if(document.querySelector('#sidebar > a > img')){
            HAbuddy = document.querySelector('#sidebar > a > img').src;
            document.querySelector('#sidebar > a > img').style.cssText = "height: 0px; width: 0px; position:absolute;";
        } else HAbuddy = "https://i.imgur.com/4Br88bA.png";

        /* Appending the new header & dropdown links into the HTML.*/
        let banner = ""
        if(theme == "normal") banner = "https://i.imgur.com/nnQgXzL.png";
        if(theme == "ocean") banner = "https://i.imgur.com/8ErIONW.png";
        const new_header_and_Dropdown_HTML = +function(){
            document.getElementById('header').insertAdjacentHTML('beforebegin', `
<img src="${banner}" id="newBanner">
<a href="https://www.goatlings.com/habuddy/">
<img id="new_HA_buddy_pic" src="${HAbuddy}">
</a>
<nav id="nav_bar">
<ul id="main_nav">
<li class="nav_item">
<a href="https://www.goatlings.com/" class="clearBox">Home</a>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/townmap/" class="clearBox">Town</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/Palace">Palace</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/fountain">Fountain</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/clubs">Clubhouse</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/bank">Sugar Bank</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/auctions">Auctions</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/donate">Giving Tree</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/news/" class="clearBox">News</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/EventCalendar">Event Calendar</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/teams">Team Sign Ups</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/goals">Fundraisers</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/mystuff/" class="clearBox">Stuff</a>
<ul class="dropdown">
<div class="nipple"></div>
<li class="dropdown-item">
<a href="https://
www.goatlings.com/inventory/">Inventory</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/itemsorter">Item Sorter</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/usershop/index/">My Shop</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/gallery/index/">My Gallery</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/storage">My Safe</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/auctions/your">My Auctions</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/mypets/">My Goatlings</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/yourtopics/">My Forum Topics</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/buddies">My Buddies</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/clubs">My Club</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/settings">My Settings</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/trades/yourtrades">My Item Trades</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/GoatTrades/your_trades">My Goatling Trades</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/habuddy">My HA Buddy</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/wishlist/">My Wish List</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/create/" class="clearBox">Adopt</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/create/adopt/">Adopt</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/create/cre/">Create</a>
</li>
<li class="dropdown-item">
<a href="https://

www.goatlings.com/create/surrender/">Abandon</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/arcade/" class="clearBox">Arcade</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/hol">Higher or Lower</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/drop_box">Magic Hat</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/daily_item">Gachapon</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/raffle">Raffle</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/trivia">Treasure Trivia</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/lucky_numbers/index/0l">Lucky Three</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/lucky_numbers/index/1">Lucky Four</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/lucky_numbers/index/2">Lucky Five</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/referral">Referral Contest</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/wishing">Wishing Well</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/catchstar">Catch a Falling Star</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/random">Pick a Card</a>
</li>
<li class="dropdown-item">
<a href="https://
www.goatlings.com/slots">Triple Scoop</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/fishing">Gone Fishin</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/ss_mine">Rainbow Caverns</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/token">Goat Token</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/rps">Fluttersnap</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/ShoppingDistrict/" class="clearBox">Shops</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/3">Appearance Dolls</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/14">Library</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/1">Toy Shop</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/9">VIP</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/4">Party Supplies</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/5">Gift Shop</a>
</li>
<li class="dropdown-item">
<a href="https://
www.goatlings.com/shops/view/2">Fruit Salad</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/10">General Foods</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/11">Bakery</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/19">Ice Cream Parlor</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/28">Seasonal Antique Shop</a>
</li>
<li class="dropdown-item has-sub">
<a href="#">HA Buddy Section ⯈</a>
<ul>
<li><a href="https://www.goatlings.com/shops/view/22">HA Buddy Hair Salon</a></li>
<li><a href="https://www.goatlings.com/shops/view/20">HA Buddy Face Space</a></li>
<li><a href="https://www.goatlings.com/shops/view/23">HA Buddy Hats</a></li>
<li><a href="https://
www.goatlings.com/shops/view/12">HA Buddy Boutique</a></li>
<li><a href="https://www.goatlings.com/shops/view/21">HA Buddy Base Place</a></li>
<li><a href="https://www.goatlings.com/shops/view/24">HA Buddy Accessories</a></li>
<li><a href="https://www.goatlings.com/shops/view/25">HA Buddy Background</a></li>
</ul>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/8">Battle Weapons</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/26">Battle Pets</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/17">Battle Defense</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/7">Remedies and Elixirs</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/shops/view/16">Display Name Icons</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/donate">Giving Tree</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/pawn">Pawn Shop</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/craft">Crafting</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/auctions">Auctions</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/battle/" class="clearBox">Battle</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/battle/challengers">Battle Center</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/battle/train_challengers">Training Center</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/battle/thebattle">Current Battle</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/mypets">My Pets</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/forums/index" class="clearBox">Forums</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/2/">News & Announcements</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/16/">Official Contests & Events</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/4/">Introductions</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/1/">General Chat</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/5/">Help</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/8/">Ideas & Suggestions</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/3/">Bugs</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/6/">Shops, Trades, & Auctions</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/20/">Battle</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/9/">Roleplay Chat</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/15/">Clubhouse Bulletin Board</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/12/">HA Buddy</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/17/">Member Contests & Events</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/7/">Galleries</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/18/">Creative Writing Nook</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/14/">Artists Alley</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/13/">Member Created Designs</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/19/" style="font-size:7.7pt; line-height:14px;">Goatlings Gazette Submissions</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/forums/view/10/">Off Topic</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/explore/index" class="clearBox">Explore</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/explore/view">Current Adventure</a>
</li>
<li class="dropdown-item has-sub">
<a href="#">Misty Meadows ⯈</a>
<ul>
<li><a href="https://www.goatlings.com/explore/create/1/${token}">Misty Meadows 1</a></li>
<li><a href="https://www.goatlings.com/explore/create/3/${token}">Misty Meadows 2</a></li>
<li><a href="https://www.goatlings.com/explore/create/4/${token}">Misty Meadows 3</a></li>
<li><a href="https://www.goatlings.com/explore/create/5/${token}">Misty Meadows 4</a></li>
<li><a href="https://www.goatlings.com/explore/create/6/${token}">Misty Meadows 5</a></li>
</ul>
</li>
<li class="dropdown-item has-sub">
<a href="#">Enchanted Forest ⯈</a>
<ul>
<li><a href="https://www.goatlings.com/explore/create/7/${token}">Enchanted Forest 1</a></li>
<li><a href="https://www.goatlings.com/explore/create/12/${token}">Enchanted Forest 2</a></li>
<li><a href="https://www.goatlings.com/explore/create/9/${token}">Enchanted Forest 3</a></li>
<li><a href="https://www.goatlings.com/explore/create/10/${token}">Enchanted Forest 4</a></li>
<li><a href="https://www.goatlings.com/explore/create/11/${token}">Enchanted Forest 5</a></li>
</ul>
</li>
<li class="dropdown-item has-sub">
<a href="#">Phantom Forest ⯈</a>
<ul>
<li><a href="https://www.goatlings.com/explore/create/13/${token}">Phantom Forest 1</a></li>
<li><a href="https://www.goatlings.com/explore/create/14/${token}">Phantom Forest 2</a></li>
<li><a href="https://www.goatlings.com/explore/create/15/${token}">Phantom Forest 3</a></li>
<li><a href="https://www.goatlings.com/explore/create/16/${token}">Phantom Forest 4</a></li>
<li><a href="https://www.goatlings.com/explore/create/17/${token}">Phantom Forest 5</a></li>
</ul>
</li>
<li class="dropdown-item has-sub">
<a href="#">Rainbow Caverns ⯈</a>
<ul>
<li><a href="https://www.goatlings.com/explore/create/18/${token}">Rainbow Caverns 1</a></li>
<li><a href="https://www.goatlings.com/explore/create/19/${token}">Rainbow Caverns 2</a></li>
<li><a href="https://www.goatlings.com/explore/create/20/${token}">Rainbow Caverns 3</a></li>
<li><a href="https://www.goatlings.com/explore/create/21/${token}">Rainbow Caverns 4</a></li>
<li><a href="https://www.goatlings.com/explore/create/22/${token}">Rainbow Caverns 5</a></li>
</ul>
</li>
<li class="dropdown-item has-sub">
<a href="#">Majestic Mountain ⯈</a>
<ul>
<li><a href="https://www.goatlings.com/explore/create/23/${token}">Majestic Mountain 1</a></li>
<li><a href="https://www.goatlings.com/explore/create/24/${token}">Majestic Mountain 2</a></li>
<li><a href="https://www.goatlings.com/explore/create/25/${token}">Majestic Mountain 3</a></li>
<li><a href="https://www.goatlings.com/explore/create/26/${token}">Majestic Mountain 4</a></li>
<li><a href="https://www.goatlings.com/explore/create/27/${token}">Majestic Mountain 5</a></li>
</ul>
</li>
<li class="dropdown-item has-sub">
<a href="#">Sea of Clouds ⯈</a>
<ul>
<li><a href="https://www.goatlings.com/explore/create/28/${token}">Sea of Clouds 1</a></li>
<li><a href="https://www.goatlings.com/explore/create/29/${token}">Sea of Clouds 2</a></li>
<li><a href="https://www.goatlings.com/explore/create/30/${token}">Sea of Clouds 3</a></li>
<li><a href="https://www.goatlings.com/explore/create/31/${token}">Sea of Clouds 4</a></li>
<li><a href="https://www.goatlings.com/explore/create/32/${token}">Sea of Clouds 5</a></li>
</ul>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/battle/thebattle">Current Battle</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/creativepark" class="clearBox">Creative</a>
<ul class="dropdown">
<li class="dropdown-item">
<a href="https://www.goatlings.com/graphics">Graphics</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/flairbanners">Flair Banners</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/coloringpages">Coloring Pages</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/avatars">Avatars</a>
</li>
<li class="dropdown-item">
<a href="https://www.goatlings.com/premadelayouts">Profile Layouts</a>
</li>
</ul>
</li>
<li class="nav_item">
<a href="https://www.goatlings.com/login/logout/${token}/" class="clearBox">Logout</a>
</li>
</ul>
</nav>`)}();

        // Appending the new Search bar in the footer
        const new_Search_Bar_HTML = +function(){
            /* Searchbar in footer */
            if(document.getElementById('footer')) {
                document.getElementById('footer').insertAdjacentHTML('beforebegin', `<aside id="searchbar-footer">
<form action="https://www.goatlings.com/search/searchpro" method="post" accept-charset="utf-8">
<input type="hidden" name="csrf_test_name" value="${token}">
<div class="new-searchbar search-footer">
<div class="input-prefix">
<select class="custom-select" name="specifics">
<option value="0">Contains</option>
<option value="1">Exact</option>
</select>
</div>
<input class="custom-input no-curves" type="text" name="search" placeholder="Search">
<div class="input-sandwich">
<select class="custom-select" name="type">
<option value="0">Item Name</option>
<option value="1">Members</option>
<option value="2">Pets</option>
</select>
</div>
<div class="input-suffix">
<button type="submit" name="s" value="Search" class="button">Search</button>
</div>
</div>
</form>
</aside>`);
            }
            /* The nice spyglass next to the mail icon */
            document.querySelector('#user-info-points').insertAdjacentHTML('afterbegin',
                                                                           `<img id="search-button" src="https://i.imgur.com/HUVhyZz.png">`)
            /* Header searchbar */
            document.querySelector('#user-info-wrap').insertAdjacentHTML('afterend', `<div id="search-bar-slidein">
<aside id="search-bar">
<form action="https://www.goatlings.com/search/searchpro" method="post" accept-charset="utf-8">
<input type="hidden" name="csrf_test_name" value="${token}">
<div class="new-searchbar mini-search">
<div class="input-prefix">
<select class="slider custom-select select-mini mini-height" name="specifics" disabled>
<option value="0">Contains</option>
<option value="1">Exact</option>
</select>
</div>
<input class="slider custom-input mini-height no-curves" type="text" name="search" placeholder="Search"
disabled>
<div class="input-sandwich">
<select class="slider custom-select select-mini mini-height" name="type" disabled>
<option value="0">Item Name</option>
<option value="1">Members</option>
<option value="2">Pets</option>
</select>
</div>
<div class="input-suffix">
<button id="btn-slider" type="submit" name="s" value="Search"
class="button slider slider-btn mini-height mini-padding" disabled>Search</button>
</div>
</div>
</form>
</aside>
</div>`);
            let toggle;
            function toggleSearch() {
                document.querySelector("#btn-slider").classList.toggle("slider-btn");
                if(toggle){
                    document.querySelector("#search-bar").style.opacity = "0";
                    document.querySelector("#search-bar-slidein").style.cssText = "opacity: 0; height: 0; z-index: -99; cursor: auto";
                    let sliderEl = document.querySelectorAll(".slider");
                    for(let value of [...sliderEl]) value.disabled = true;
                    toggle = false;
                }
                else {
                    document.querySelector("#search-bar").style.opacity = "1";
                    document.querySelector("#search-bar-slidein").style.cssText = "opacity: 1; height: 35px; z-index: 2; cursor: pointer";
                    let sliderEl = document.querySelectorAll(".slider");
                    for(let value of [...sliderEl]) value.disabled = false;
                    toggle = true;
                }
            }
            document.querySelector('#search-button').addEventListener('click', toggleSearch)
        }();

        /* ===============================================================


                                   MISC CHANGES


        ================================================================== */
        // Settings page
        if(url.includes('settings') ||
           url.includes('wishlist') ||
           url.includes('usershop') ||
           url.includes('storage')) css += `form {display: block; text-align: center;}`;

        //mypets page
        if(url.includes('goatlings.com/mypets/')){
            css+= `.mypets-pet {display: inline-block;}
                   .mypets-pet > img {margin-top:5px;}
                   .mypets-pet > a:nth-child(3) {display:block; margin:4px 0;}
                   .mypets-pet > form {margin:8px 0}
                   .mypets-pet > a:nth-child(31),
                   .mypets-pet > b:nth-child(21),
                   .mypets-pet > b:nth-child(26) {display:inline-block; margin-top:6px}
                   .mypets-pet > br:nth-child(4),
                   .mypets-pet > br:nth-child(5),
                   .mypets-pet > br:nth-child(19),
                   .mypets-pet > br:nth-child(24),
                   .mypets-pet > br:nth-child(29),
                   .mypets-pet > br:nth-child(38) {display:none}
                   #content > center > form {display:inline-block}`
        }

        if(url.includes('/storage') || url.includes('usershop/index')){
           if (theresPagnation){
                pagnaTor("safePagnation");
            }
           }
        // news page
        if(url.includes('/news/')){
            if (theresPagnation){
                pagnaTor("newsPagnation");
                pagnaTor("newsPagnationBottom");
            }
        }

        /* ===============================================================


                                    HOME PAGE


        ================================================================== */

        if(/http:\/\/www\.goatlings\.com(\/)?$/.test(url)){
            document.querySelector("#content").style.height = "965px";
            const CSS_just_for_the_main_page = +function() {
                css += `
#content {
height: 940px;
}
tr, td, .sf {
display: none;
}
#c {
width: 800px;
margin: 15px auto 0 auto;
text-align: center;
}
#m a:link, #m a:visited, b {
color: #f56991;
font-weight: bold;
}
#m, #n {
color: #615a53;
text-align: justify;
}
#m {
width: 600px;
float: left;
background: var(--content);
padding: 6px;
padding-bottom: 10px;
border: 6px solid #ffc48c;
}
.page {
padding: 6px;
}
.page > p > b {
display: block;
margin-bottom:3px;
}
#content > center:nth-child(2) > br:first-of-type {
display:none;
}
#content > center:nth-child(2) {
padding-top:2px;
}
#n {
width: 160px;
float: right;
background: white;
border:5px solid #ffc48c;
margin-right: 42px;
padding-bottom: 5px;
}
#n > br:last-of-type {
display:none;
}
a.nav:link, a.nav:visited {
display: block;
font: 10pt georgia;
background: #effab4;
color: #a9b472;
padding: 2px;
border: 2px solid white;
text-align: left;
text-decoration: none;
}
a.nav:hover {
background: #d1f2a5;
color: white;
}
#m, #n {
text-align: justify;
}
h1 {
height: 45px;
font: 30pt georgia;
background: #ff9f80;
color: white;
text-align: center;
border-bottom: 10px solid #d1f2a5;
margin: 0;
padding-bottom: 45px;
}
h2, h3 {
height: 20px;
background: #ffc48c;
color: white;
font: 13pt "century gothic";
text-align: center;
margin: 0;
border-bottom: 5px solid white;
font-weight: bold;
padding-bottom: 22px;
}
h3 {
margin-bottom: -10px;
}
img.x {
float: left;
margin: 5px 10px;
}
</style>
`}();
            for(let i = 0; i < 3; i++) document.querySelector('.page > p > br:first-of-type').remove();
            document.querySelector('#content > style').remove()
        }

        if(/goatlings\.com\/login(\/)?$/.test(url)) css += `form {display: block}`; // login page

        /* ===============================================================


                                     FOOTER


        ================================================================== */

        if(document.querySelector('#footer')){
            let footerAnchorURLs = [],
                footerLinkHTML = [],
                footerParagraph = document.querySelector('div[id="footer"] > p');
            for(let i = 0; i < footerParagraph.children.length; i++){
                footerAnchorURLs.push(footerParagraph.children[i]);
                footerLinkHTML.push(`<a href="${footerAnchorURLs[i]}" class="feet-anchor">${footerParagraph.children[i].text}</a>`)
            }
            footerParagraph.insertAdjacentHTML('beforebegin', `<div id="newFootLinks">${footerLinkHTML.join('')}</div>`)
        }

        /* ===============================================================


                                  ERROR PAGES


        ================================================================== */

        // Adding buttons and some styling on error pages
        if(bodyText.indexOf("ERROR:") >= 0){
            css += `#content {text-align:center; padding-top:25px;}`;
            document.querySelector('#content').insertAdjacentHTML('afterbegin', `<h2 class="page-title" style="text-align:left">Oops!</h2>`);
            document.querySelector('#content').insertAdjacentHTML('beforeend', `<br><button onclick="window.history.go(-1)" style="margin-top:10px" class="button">Back</button>`);
        }

        /* ===============================================================


                                   FOUNTAIN


        ================================================================== */
        if (url.includes('fountain')){
            if(bodyText.indexOf("You have healed all your pets.") >= 0){
                document.querySelector('#content').insertAdjacentHTML('beforeend', `
<div style="display: flex; width: 32%; justify-content: space-around; margin: 20px auto 5px auto;">
<a class="fl-item" href="https://www.goatlings.com/battle/challengers">To Battle Center</a>
<a class="fl-item" href="https://www.goatlings.com/battle/train_challengers">To Training Center</a>
</div>`);
            }
        }

        /* ===============================================================


                                    ARCADE


        ================================================================== */

        if(document.querySelector('a[href="https://www.goatlings.com/info"]')){
            let goatTokenAnchor = document.querySelector('a[href="https://www.goatlings.com/info"]');
            goatTokenAnchor.classList.add('if-item');
            goatTokenAnchor.style.cssText = "width: 300px; margin-top:15px;";
        }

        /* ===============================================================


                                   PAWN SHOP


        ================================================================== */

        if(url.includes('/pawn')){
            let newDiv = document.createElement('div');
            newDiv.id = "pawnShopContainer";
            css+= `#pawnShopContainer {display:flex; justify-content: center; flex-wrap:wrap;}`
            let pawnItemNodes = document.querySelectorAll('.itema');
            for(let content of [...pawnItemNodes]){
                newDiv.appendChild(content)
            }
            document.querySelector('#content').appendChild(newDiv);
        }

        /* ===============================================================


                                      BANK


        ================================================================== */

        if(document.querySelector('.bank-area')){
            document.querySelector('.bank-area > a').classList.add("button");
            document.querySelector('.bank-area > a').classList.add("normal-font");
            document.querySelector('.bank-area > a').style.margin = "10px auto 2px auto";
            for(let inputs of [...document.querySelectorAll('input[name="points"]')]) inputs.style.marginLeft = "6px";
            for(let hrs of [...document.querySelectorAll('hr')]) hrs.style.margin = "2px auto 12px auto";
            document.querySelector('.bank-area > br:nth-child(2)').remove();
            document.querySelector('.bank-area > br:nth-child(4)').remove();
            document.querySelector('.bank-area > br:nth-child(6)').remove();
        }

        /* ===============================================================


                                   MAIN SHOPS


        ================================================================== */

        if(url.includes('shops/view/')){
            const main_Shops =+ function() {
                let shopItemHolder = document.createElement('div');
                shopItemHolder.classList.add("main-shop-flex");
                let shopItems = document.querySelectorAll('.shopItem');
                for(let children of [...shopItems]) shopItemHolder.appendChild(children);
                document.querySelector('#content > center > hr').insertAdjacentElement('afterend', shopItemHolder)
            }();

            let image = document.querySelector('center').getElementsByTagName('img')[0].src;
            document.querySelector('center').getElementsByTagName('img')[0].outerHTML = `<a href="${document.URL}"><img src="${image}"></a>`
        }

        /* ===============================================================


                                   USER SHOPS


        ================================================================== */

        if(url.includes('usershop/view/')){
            if(theresPagnation) pagnaTor("shopPagnation"); //fix up pagnation
            //adjusting shop description margins
            document.querySelector('#content > span').style.cssText = "display: inline-block; margin-bottom:10px";

            // code for if there are items inside the shop
            if(document.querySelector('.shopItem')){
                // adding a currency symbol and commas onto shop prices
                let shopItemPrices = document.querySelectorAll('.shopItem > b');
                for(let value of [...shopItemPrices]){
                    let itemPrice = Number(value.textContent.match(/\d/g).join(''));
                    itemPrice = commarizer(itemPrice)
                    value.innerHTML = `<div class="currency" alt="Sugar Star Cost">
                                       <i class="sugar-star-pink sugar-star-shape"></i>
                                       <i class="sugar-star-blue sugar-star-shape"></i></div>
                                       <span>${itemPrice}</span>`;
                }
                // removing extra space
                for (let i = 0; i < 2; i++) document.querySelector('#content > center:last-of-type').nextSibling.remove();

                //making the shop item clickable to purchase, and confirm people actually want to buy
                let shopItemNodes = document.querySelectorAll('.shopItem');
                for(let singleItem of shopItemNodes){
                    let shopItemImageNode = singleItem.childNodes[1],
                        shopItemPurchaseAnchor = singleItem.childNodes[9].href,
                        shopItemName = singleItem.childNodes[3].textContent,
                        shopItemPrice = singleItem.childNodes[7].textContent;
                    shopItemImageNode.style.cursor = "pointer";
                    shopItemImageNode.addEventListener('click', event => {
                        let confirmation = confirm(`Do you want to buy ${shopItemName} for${shopItemPrice} Sugar Stars?`);
                        if(confirmation) location.href = shopItemPurchaseAnchor;
                        else return null;
                    });
                }
                let centerEl = document.querySelector('#content > center:last-of-type'); //this holds the shop items. we want to make this a div
                let shopItemHolder = document.createElement('div');
                shopItemHolder.classList.add("shop-item-holder");
                for(let item of shopItemNodes) shopItemHolder.appendChild(item);
                centerEl.appendChild(shopItemHolder);
            }
        }


        /* ===============================================================


                                   GALLERIES


        ================================================================== */

        if(url.includes('gallery/view/')){
            if(theresPagnation) pagnaTor("shopPagnation"); //fix up pagnation
            //adjusting shop description margins
            document.querySelector('#content > span').style.cssText = "display: inline-block; margin-bottom:10px";

            // code for if there are items inside the gallery
            if(document.querySelector('.shopItem')){

                // removing extra space
                for (let i = 0; i < 2; i++) document.querySelector('#content > center:last-of-type').nextSibling.remove();

                // flex container babey
                let shopItemNodes = document.querySelectorAll('.shopItem');

                let centerEl = document.querySelector('#content > center:last-of-type'); //this holds the items. we want to make this a div
                let shopItemHolder = document.createElement('div');
                shopItemHolder.classList.add("shop-item-holder");
                for(let item of shopItemNodes) shopItemHolder.appendChild(item);
                centerEl.appendChild(shopItemHolder);
            }
        }
        //document.getElementsByClassName("shopItem")[0].parentElement.style.cssText = "display: flex; flex-wrap: wrap; justify-content: center;"

        /* ===============================================================


                                   FORUM EDITS


        ================================================================== */

        if(url.includes('/forums')){
            if (theresPagnation) pagnaTor("forumPagnation");
            css += `/*#content table {width: 800px;}*/
                    td {padding-left: 5px !important;}
                    div.forum-reply table {width: 200px !important;}
                    form {display:block}`; //minor css adjustments
            // clone the return to main/sub forum links from the bottom of the page because I feel it's more useful at the top
            if(url.includes('forums/view_topic')){
                if (theresPagnation) pagnaTor("forumPagnationBelow");
                let bottomLinks = document.querySelector('#content > center'),
                    grabNodes = document.querySelector('#content').children,
                    holdMe = document.createElement('div');
                holdMe.id = "forumLinks";
                bottomLinks.previousSibling.remove();

                let b = grabNodes[grabNodes.length-1].cloneNode(true),
                    c = grabNodes[grabNodes.length-3].cloneNode(true);
                holdMe.appendChild(b);
                holdMe.appendChild(c);
                bottomLinks.prepend(holdMe);
                css += `#forumLinks{display:flex; flex-direction:column; align-items:flex-end;}`;

                //snipping whitespace at the bottom
                for(let i = 0; i < 4; i++) if(document.querySelector('.forum-post:last-of-type')) document.querySelector('.forum-post:last-of-type').nextSibling.remove();
                if(document.querySelector('#forumLinks > br')) document.querySelector('#forumLinks > br').remove() //whitespace after top pagnation
            }
        }

        /* ===============================================================


                               GOAT LOOKUP EDITS


        ================================================================== */

        if(url.includes('/pet/u/')){
            for(let i = 0; i < 2; i++) document.querySelector('.pet-profile-box-three').firstChild.remove()
            document.querySelector('#content > br:nth-child(3)').remove()
        }

        /* ===============================================================


                               USER PROFILE EDITS


        ================================================================== */

        if(/\/profile\/u\//.test(document.URL)){
            css += `#content table {margin: 0} #content > br:nth-child(3) {display:none} hr {margin: 4px auto 6px auto; width: 98%;}`;
            for(let i = 0; i < 2; i++) document.querySelector('.profile-info').previousSibling.remove();
            for(let i = 0; i < 3; i++) document.querySelector('.reset').nextSibling.remove();

            //adding anchors onto goat images to make them clickable
            let myGoats = document.querySelectorAll('.mypets-pet');

            let goatImgSrc, goatAnchor, goatName;
            for(let item of [...myGoats]){
                //console.log(item);
                goatImgSrc = item.children[0].src;
                goatName = item.children[2].textContent;
                goatAnchor = item.children[2].href;
                item.innerHTML = `<a class="mygoat-anchor" href="${goatAnchor}"><img class="mygoat-img" src="${goatImgSrc}">${goatName}</a>`;
            }
            document.querySelector('.reset').insertAdjacentHTML('afterend',
                                                                `<div class="goatlings-header-profile">${document.querySelector('.reset').nextSibling.textContent.trim()}</div>`)
            document.querySelector('.reset').nextSibling.nextSibling.remove();

            //moving profile contents into flex containers!
            let div = []; // creating and identifying 4 new divs
            for(let i = 0; i < 4; i++) div.push(document.createElement("div"));
            let flexContainer = div[0],
                flexItemOne = div[1],
                flexItemTwo = div[2],
                flexItemThree = div[3];
            flexContainer.id = "profile-flex";
            flexItemOne.id = "profile-part-one-new";
            flexItemTwo.id = "profile-part-two-new";
            flexItemThree.id = "profile-part-three-new";

            let profile = document.querySelector('.profile-part-one'),
                table = profile.children[0];

            /* placing stray nodes into flex container */
            let nodeListArr = [];
            for(let i = 2; i < profile.children.length; i++){
                if(profile.children[i]){
                    nodeListArr.push(profile.children[i])
                }
            }
            /* Sticking table contents into flex container bc I hate tables */
            let tableContents = [],
                childrenInTable = [...document.querySelector('.profile-part-one').children[0].children[0].childNodes];

            for(let item of childrenInTable) {
                for(let itemChildren of [...item.childNodes]){
                    for(let itemGrandChildren of [...itemChildren.childNodes]) tableContents.push(itemGrandChildren); // all the data cells in the table's contents
                }
            }
            let br = []; // I need to add breaks because loading the children in this way cuts all the breaks out
            for(let i = 0; i < 7; i++) br.push(document.createElement('br')) // creating an array of <br>s
            for(let i = 2; i <= 12; i += 2){ // sticking in <br>s where necessary
                try {tableContents[i].prepend(br[i/2])}
                catch(ex){tableContents[9].prepend(br[5]);
                          tableContents[11].prepend(br[6])} //possibly the worst way to attempt this ever
            }
            /* placing nicely organizes items into first flex container, and then the second */
            for(let child of tableContents) flexItemOne.appendChild(child);
            for(let child of nodeListArr) flexItemTwo.appendChild(child);

            let profilePartTwoNodes = document.querySelector('.profile-part-two').childNodes; // the place that holds the HA Buddy
            for(let children of [...profilePartTwoNodes]) flexItemThree.appendChild(children);

            // adding User Info text before the actual user info
            let userInfo = document.createElement('span');
            userInfo.style.cssText = `font-weight:bold; font-size:110%;`;
            userInfo.textContent = 'User Profile';
            let hr = document.createElement('hr');
            hr.style.cssText = "margin: 3px auto 10px auto; width: 100%;";

            //actually placing all the items into the main flex container
            document.querySelector('.profile-part-one').appendChild(userInfo);
            document.querySelector('.profile-part-one').appendChild(hr);
            document.querySelector('.profile-part-one').appendChild(flexContainer);

            flexContainer.appendChild(flexItemOne);
            flexContainer.appendChild(flexItemTwo);
            flexContainer.appendChild(flexItemThree);
        }

        /* ===============================================================


                               INVENTORY EDITS


        ================================================================== */

        if(url.includes('inventory')){
            // Repositioning inventory help links
            let addLinks = "",
                mainInvent = /\/inventory\/$/.test(document.URL) || /\/inventory$/.test(document.URL) || /\/inventory\/index\//.test(document.URL) || /index.php\/inventory(\/)*$/.test(document.URL);
            if(mainInvent){
                let stacked;
                if(document.body.textContent.indexOf('Total Items') > 0) stacked = true;
                if(stacked) addLinks = `<a class="if-item" href="https://www.goatlings.com/inventory/index/1">Unstack Items</a>`; // stacked
                else addLinks = `<a class="if-item" href="https://www.goatlings.com/inventory/index/2">Stack Items</a>`; // unstacked
            } else if(/\/inventory/.test(document.URL)) addLinks = `<a class="if-item" href="https://www.goatlings.com/battle/challengers">Battle Center</a>`; // inventory view pages

            let inventoryLinks = `<div class="inventoryLinks">
<a class="if-item" href="https://www.goatlings.com/itemsorter">Item Sorter</a>
<a class="if-item" href="https://www.goatlings.com/inventory/">My Items</a>
<a class="if-item" href="https://www.goatlings.com/gallery">My Gallery</a>
<a class="if-item" href="https://www.goatlings.com/usershop">My Shop</a>
<a class="if-item" href="https://www.goatlings.com/storage">My Safe</a>
${addLinks}
</div>`;
            let inventItemImgNodes = document.querySelectorAll('.item-invent > a > img');
            for(let content of [...inventItemImgNodes]) content.classList.add("inv-item-hover");

            const textDeleter = function(num){ // old inventory links text deleter
                if(document.querySelector(`.page-title`) && bodyText.indexOf("ERROR") == -1) {
                    for(let i = 0; i < num; i++) document.querySelector(`.page-title`).nextSibling.remove();
                }
            }
            if (mainInvent){ // the inventory index
                document.querySelector('#content > center').classList.add("inventory-flex");
                textDeleter(15);
                document.querySelector('#content').insertAdjacentHTML('beforeend', `<div id="inventoryFooter">
${inventoryLinks}
</div>`);
                if (document.querySelectorAll('.item-invent').length > 9) document.querySelector('.page-title').insertAdjacentHTML('afterend', inventoryLinks);
            }
            if(/\/inventory\/view\/\d*/.test(document.URL)){
                textDeleter(13);
                document.querySelector('#content').insertAdjacentHTML('beforeend', inventoryLinks);
                css += `.if-item {margin-top:10px}`;
                let optionDropdown = document.getElementById('option');
                if(optionDropdown){ // Auto selects the most useful item on the dropdown
                    optionDropdown.options.remove(0);
                    if (optionDropdown.options[8]) optionDropdown.options[8].selected = true;
                    else optionDropdown.options[1].selected = true;
                }
            }
            if(/\/inventory\/view_action\/.*/.test(document.URL)){
                css += `.if-item {margin-top:10px}
.item-invent-view > p {margin: 0 auto 5px auto;}`;
                textDeleter(13);
                document.querySelector('#content').insertAdjacentHTML('beforeend', inventoryLinks);
                // Adds a link to go directly to battle if you equip a weapon
                if (bodyText.indexOf("The item was equipped to your pet!") >= 0){
                    document.querySelector('.inventoryLinks').insertAdjacentHTML('beforebegin', `<div class="inventoryLinks">
<a class="if-item" href="https://www.goatlings.com/battle/challengers">To Battle</a>
</div>`);
                }
            }
            if(document.querySelector('div.item-invent')) document.querySelector('div.item-invent').parentElement.style.cssText = "display: flex; flex-direction: row;flex-wrap: wrap;justify-content: center;"
        }

        /* ==================================================================


                                 BATTLE CENTER EDITS


        ===================================================================== */

        if(url.includes('battle')){
            const startBattle = document.querySelectorAll(`input[value="Start Battle"]`);
            for(let i = 0; i < startBattle.length; i++) {
                startBattle[i].addEventListener("click", function(event){
                    //event.preventDefault();
                    //console.log(event)
                    let battleParameters = {
                        enemyURL: startBattle[i].parentElement.action,
                        petID: document.querySelectorAll(`select[name="petid"]`)[i].value,
                    }
                    sessionStorage.setItem("Battle Again Parameters", JSON.stringify(battleParameters));
                    /* Save the enemy ID and the pet ID to use with the Battle Again button in Session Storage
                            This is ONLY saved locally on your browser, and not anywhere else.
                            Only YOU interacting with Goatlings can access this information */
                })
            }
            if(/\/battle\/challengers/.test(document.URL)){
                //let tr = document.querySelectorAll('table[width="700"] > tbody > tr');
                //for(let item of [...tr]) item.style.textAlign = "center";
                document.querySelector('div.battle-grid').parentElement.style.cssText = "display: flex; flex-wrap: wrap; justify-content:center"
                css += "form{display:inline-block !important; margin-bottom: 15px !important} .battle-grid{padding:5px; margin:5px; width:200px; border: 1px solid var(--main-faded); border-radius: 4px;}"
            }
            // check if opponent at 0 hp
            let HP = document.querySelectorAll('.HP'),
                zeroHP = /^0\//;
            // If currently in battle
            if (/\/battle\/thebattle/.test(document.URL)){
                // Extraneous spaces removed and some minor position changes of the win/lose condition text
                let battle_log_breaks = document.querySelectorAll(`#battle_log > br`)
                if(battle_log_breaks.length > 0) battle_log_breaks[battle_log_breaks.length-1].remove()
                if (document.querySelector(`a[href="https://www.goatlings.com/battle/over"]`)){
                    css += `body div#wrapper div#content center p a {display: none}`;

                    let battleResult = "";
                    if (zeroHP.test(HP[0].innerHTML)) battleResult = "YOU LOSE";
                    else if (zeroHP.test(HP[1].innerHTML)) battleResult = "YOU WIN";
                    else battleResult = "THE BATTLE IS OVER";

                    document.querySelector("#content > center > b").textContent = "The battle has ended!";
                    document.getElementById('battle_items').insertAdjacentHTML('beforebegin', `<a href="https://www.goatlings.com/battle/over">${battleResult}! CLICK HERE TO CONTINUE</a>`);
                }
            }

            // If the battle is OVER
            if (/\/battle\/over/.test(document.URL)){
                // Battle Again button implemented as well as new battle footer links for consistency.
                let existingButton = document.querySelector(`input[value="Battle Again"]`),
                    battleParameters = sessionStorage.getItem("Battle Again Parameters") ? JSON.parse(sessionStorage.getItem("Battle Again Parameters")) : "",
                    battleAgainButton = "";
                if (battleParameters){
                    if(!existingButton){
                        battleAgainButton = `<form action="${battleParameters.enemyURL}" method="post" accept-charset="utf-8" style="margin:0">
<input type="hidden" name="csrf_test_name" value="${token}">
<input type="hidden" name="petid" value="${battleParameters.petID}">
<input type="submit" name="s" value="Battle Again" id="battleAgainButton" class="button">
</form>`
                    } else {
                        existingButton.style.marginTop = "20px";
                        battleAgainButton = "";
                    }
                } else battleAgainButton = `<div id="battleAgainButton"><a href="https://www.goatlings.com/explore/view" class="if-item" style="width:150px">Continue exploring?</a></div>`;

                let battleAgainFooter = `<div id="battleAgain">
${battleAgainButton}
<div id="battleEndLinks" class="inventoryLinks">
<a class="if-item" href="https://www.goatlings.com/explore/view">Current Adventure</a>
<a class="if-item" href="https://www.goatlings.com/battle/train_challengers">Training Center</a>
<a class="if-item" href="https://www.goatlings.com/battle/challengers">Battle Center</a>
<a class="if-item" href="https://www.goatlings.com/fountain/">The Fountain</a>
<a class="if-item" href="https://www.goatlings.com/inventory/">Your Inventory</a>
</div>
</div>`;
                document.querySelector("#content > center > p").remove();
                document.querySelector("#content > center").insertAdjacentHTML('afterend', battleAgainFooter);
            }
        }
        if(url.includes('/explore/')) sessionStorage.removeItem("Battle Again Parameters") //delete storage of baddie/goat ID because you can't repeat explore battles

        /* ==================================================================


                                    NEWS ALERT


        ===================================================================== */

        let imgString = "",
            imgArr = document.images;
        for (let value of imgArr) imgString += value.src;
        if (imgString.indexOf("https://www.goatlings.com/images/navinews2.gif") >= 0){
            document.querySelector('#content').insertAdjacentHTML("afterbegin", `
<fieldset id="newsBox">
<legend id="newsBoxTitle">ALERT!</legend>
<div id="newsBoxText">There's a <a href='https://www.goatlings.com/news/'>news</a> update!</div>
</fieldset>`);
        }

        /* ============================================================ */
        style.innerHTML = css;
        document.head.appendChild(style);
        document.querySelector(`link[href="https://www.goatlings.com/styles/main.css"]`).remove(); // we don't need the old CSS
    flag = false;
    }
} //end of the body's function

const observer = new MutationObserver(mutation => {
    for(let element of mutation) {
        if(element.target === document.head && flag === 0){ // if we find a <head> tag in the DOM
            CSSStyles(flag);
        }
        if (element.target === document.body && flag === 1) { // if we find a <body> tag in the DOM
            bodyScript(flag);
            observer.disconnect(); //disconnect here because we got what we needed out of it
            break;
        }
    }
}); // end mutation observer
observer.observe(document.documentElement, {childList: true, subtree: true});


setTimeout(() => {
    if(flag === 0){
        CSSStyles(flag);
        bodyScript(flag);
    }
},5)
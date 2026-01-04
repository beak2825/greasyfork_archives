// ==UserScript==
// @name          AB - Improved Franchise Page
// @namespace     TalkingJello@animebytes.tv
// @version       0.0.3
// @author        TalkingJello
// @description   Improvsies
// @icon          http://animebytes.tv/favicon.ico
// @license       MIT
// @match         *://animebytes.tv/series.php?*
// @match         *://animebytes.tv/artist.php?*
// @match         *://animebytes.tv/user.php?action=edit*
// @grant         GM_getValue
// @grant         GM_setValue
// @require       https://greasyfork.org/scripts/456220-delicious-userscript-library/code/Delicious%20Userscript%20Library.js?version=1125927
// @downloadURL https://update.greasyfork.org/scripts/456222/AB%20-%20Improved%20Franchise%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/456222/AB%20-%20Improved%20Franchise%20Page.meta.js
// ==/UserScript==
/* globals jQuery, $, delicious */

const nameToIcon = {
    "Anime": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 64V352H576V64H64zM0 64C0 28.7 28.7 0 64 0H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM128 448H512c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></svg>`,
    "Printed Media": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>`,
    "Games": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 248c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40zm-24 56c0 22.1-17.9 40-40 40s-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z"/></svg>`,
    "Live Action": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M208 48c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zM152 352V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z"/></svg>`,
    // I don't think packs inside a franchise are even a thing but whatever
    "Packs": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M50.7 58.5L0 160H208V32H93.7C75.5 32 58.9 42.3 50.7 58.5zM240 160H448L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240V160zm208 32H0V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192z"/></svg>`,
    "Album": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 352c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96zm0 32c70.7 0 128-57.3 128-128s-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128zm0-96c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"/></svg>`,
    "Soundtrack": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>`,
    "Single": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M96 96V256c0 53 43 96 96 96s96-43 96-96H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V192H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80V128H208c-8.8 0-16-7.2-16-16s7.2-16 16-16h80c0-53-43-96-96-96S96 43 96 96zM320 240v16c0 70.7-57.3 128-128 128s-128-57.3-128-128V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v24z"/></svg>`,
    "EP": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"/></svg>`,
    "Compilation": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg>`,
    "Remix CD": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 96c39.5 0 66.8 12.2 81.9 21.5L245.6 184l79.3 87.4 36.3-40c14.7-16.2 22.8-37.3 22.8-59.1v-27c0-15.6-4.1-30.8-12-44.3L337.7 42C326.4 22.7 307 6.8 282.1 3.5C267.8 1.6 248.4 0 224 0s-43.8 1.6-58 3.5C141 6.8 121.7 22.7 110.4 42L76 101c-7.8 13.4-12 28.7-12 44.3v27c0 21.9 8.1 42.9 22.8 59.1l57.9 63.8L224 382.6 334.2 504.1c6.4 7 16.3 9.7 25.4 6.6l72-24c7.7-2.6 13.6-8.8 15.6-16.7s0-16.2-5.4-22.2L303.3 295.2 224 207.8l-81.9-90.3C157.3 108.2 184.5 96 224 96zM202.4 406.5L123.2 319 6.3 447.9c-5.4 6-7.5 14.4-5.4 22.2s7.9 14.1 15.6 16.7l72 24c9 3 19 .4 25.4-6.6l88.6-97.7z"/></svg>`,
    "Live Album": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M399.3 509.7c-58.2-8.8-108.2-72.8-137.6-119.7c-20-31.9-25.1-70.3-19.6-107.7L266.3 118c1.4-9.8 5.1-19.2 12.9-25.2c20.2-15.6 72.4-41.5 185.1-24.5s155.2 57.4 170 78.3c5.7 8 6.5 18.1 5.1 27.9L615.2 338.8c-5.5 37.3-21.5 72.6-49.8 97.2c-41.7 36.1-108 82.5-166.1 73.7zm17.1-277.7c.1-.5 .2-1.1 .3-1.6c3.2-21.8-11.6-42-33.1-45.3s-41.5 11.8-44.7 33.5c-.1 .5-.1 1.1-.2 1.6c-.6 5.4 5.2 8.4 10.3 6.7c9-3 18.8-3.9 28.7-2.4s19.1 5.3 26.8 10.8c4.4 3.1 10.8 2 11.8-3.3zm112.6 22.2c4.4 3.1 10.8 2 11.8-3.3c.1-.5 .2-1.1 .3-1.6c3.2-21.8-11.6-42-33.1-45.3s-41.5 11.8-44.7 33.5c-.1 .5-.1 1.1-.2 1.6c-.6 5.4 5.2 8.4 10.3 6.7c9-3 18.8-3.9 28.7-2.4s19.1 5.3 26.8 10.8zm-11.5 85.2c-28.8 12.8-61.4 17.8-94.9 12.8s-63.2-19.5-87-40.3c-6.3-5.5-16.2-1.7-15.2 6.7c5.9 48.5 43 89.1 93 96.7s97.2-20.2 116.8-64.9c3.4-7.7-5-14.3-12.6-10.9zM240.7 446.9c-58.2 8.8-124.5-37.5-166.1-73.7c-28.3-24.5-44.3-59.8-49.8-97.2L.6 111.8C-.8 102 0 91.9 5.7 83.9C20.5 63 63 22.7 175.7 5.6s164.9 8.9 185.1 24.5c.9 .7 1.7 1.4 2.4 2.1c-52.8 4.8-85.1 21-103.6 35.3c-17 13.1-23 32-25 45.9L215.3 244.7c-2.6 .1-5.2 .4-7.9 .8c-35.2 5.3-61.8 32.7-68.2 66.3c-1.6 8.2 8.3 12.2 14.8 7c15.6-12.4 34.1-21.3 54.7-25.4c-3 38.4 4 78.7 25.9 113.6c6.9 11 15 23.1 24.2 35.4c-5.9 2.1-11.9 3.6-18 4.5zM174.1 157c-1-5.3-7.4-6.4-11.8-3.3c-7.7 5.5-16.8 9.3-26.8 10.8s-19.8 .6-28.7-2.4c-5.1-1.7-10.9 1.3-10.3 6.7c.1 .5 .1 1.1 .2 1.6c3.2 21.8 23.2 36.8 44.7 33.5s36.3-23.5 33.1-45.3c-.1-.5-.2-1.1-.3-1.6z"/></svg>`,
    "Spokenword": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M208 0C322.9 0 416 78.8 416 176C416 273.2 322.9 352 208 352C189.3 352 171.2 349.7 153.9 345.8C123.3 364.8 79.13 384 24.95 384C14.97 384 5.93 378.1 2.018 368.9C-1.896 359.7-.0074 349.1 6.739 341.9C7.26 341.5 29.38 317.4 45.73 285.9C17.18 255.8 0 217.6 0 176C0 78.8 93.13 0 208 0zM164.6 298.1C179.2 302.3 193.8 304 208 304C296.2 304 368 246.6 368 176C368 105.4 296.2 48 208 48C119.8 48 48 105.4 48 176C48 211.2 65.71 237.2 80.57 252.9L104.1 277.8L88.31 308.1C84.74 314.1 80.73 321.9 76.55 328.5C94.26 323.4 111.7 315.5 128.7 304.1L145.4 294.6L164.6 298.1zM441.6 128.2C552 132.4 640 209.5 640 304C640 345.6 622.8 383.8 594.3 413.9C610.6 445.4 632.7 469.5 633.3 469.9C640 477.1 641.9 487.7 637.1 496.9C634.1 506.1 625 512 615 512C560.9 512 516.7 492.8 486.1 473.8C468.8 477.7 450.7 480 432 480C350 480 279.1 439.8 245.2 381.5C262.5 379.2 279.1 375.3 294.9 369.9C322.9 407.1 373.9 432 432 432C446.2 432 460.8 430.3 475.4 426.1L494.6 422.6L511.3 432.1C528.3 443.5 545.7 451.4 563.5 456.5C559.3 449.9 555.3 442.1 551.7 436.1L535.9 405.8L559.4 380.9C574.3 365.3 592 339.2 592 304C592 237.7 528.7 183.1 447.1 176.6L448 176C448 159.5 445.8 143.5 441.6 128.2H441.6z"/></svg>`,
    "Image CD": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 224c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32zm-96 32c0 53 43 96 96 96s96-43 96-96s-43-96-96-96s-96 43-96 96zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z"/></svg>`,
    "Vocal CD": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>`,
    "PV": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>`,
    "DVD": `<img src="https://mei.animebytes.tv/CknfzHEUJwM.png" alt="dvd logo" style="filter: invert(1);"/>`,
    "Live": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M407 47c9.4-9.4 24.6-9.4 33.9 0l17.2 17.2c1.9-.1 3.9-.2 5.8-.2h32c11.2 0 21.9 2.3 31.6 6.5L543 55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L564 101.9c7.6 12.2 12 26.7 12 42.1c0 10.2 7.4 18.8 16.7 23c27.9 12.5 47.3 40.5 47.3 73c0 26.2-12.6 49.4-32 64v32c0 8.8-7.2 16-16 16H560c-8.8 0-16-7.2-16-16V320H480v16c0 8.8-7.2 16-16 16H432c-8.8 0-16-7.2-16-16V318.4c-11.8-2.4-22.7-7.4-32-14.4c-1.5-1.1-2.9-2.3-4.3-3.5c-17-14.7-27.7-36.4-27.7-60.5c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 44.7 26.2 83.2 64 101.2V352c0 17.7 14.3 32 32 32h32v64c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V372c-19.8 7.7-41.4 12-64 12s-44.2-4.3-64-12v76c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V329.1L45.9 369.7c-5.4 12.1-19.6 17.6-31.7 12.2S-3.3 362.4 2.1 350.3L24 300.9c5.3-11.9 8-24.7 8-37.7C32 155.7 117.2 68 223.8 64.1l.2-.1h7.2H256h32c41.7 0 83.4 12.1 117.2 25.7c1.7-1.8 3.5-3.6 5.3-5.2L407 81c-9.4-9.4-9.4-24.6 0-33.9zm73 185c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24zm88 24c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24zM480 144c0-8.8-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16zm48 16c8.8 0 16-7.2 16-16s-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16z"/></svg>`,
    "Guest Appearance": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M50.8 452.1L19.2 477.4c-2.1 1.7-4.7 2.6-7.4 2.6C5.3 480 0 474.7 0 468.2V192C0 86 86 0 192 0S384 86 384 192V468.2c0 6.5-5.3 11.8-11.8 11.8c-2.7 0-5.3-.9-7.4-2.6l-31.6-25.3c-3.3-2.7-7.5-4.1-11.8-4.1c-5.9 0-11.5 2.8-15 7.5l-37.6 50.1c-3 4-7.8 6.4-12.8 6.4s-9.8-2.4-12.8-6.4l-38.4-51.2c-3-4-7.8-6.4-12.8-6.4s-9.8 2.4-12.8 6.4l-38.4 51.2c-3 4-7.8 6.4-12.8 6.4s-9.8-2.4-12.8-6.4L77.6 455.5c-3.6-4.7-9.1-7.5-15-7.5c-4.3 0-8.4 1.5-11.7 4.1zM160 192c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm96 32c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z"/></svg>`,
}

const ICONS = {
    EYE: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z"/></svg>`,
    EYE_SLASH: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M150.7 92.77C195 58.27 251.8 32 320 32C400.8 32 465.5 68.84 512.6 112.6C559.4 156 590.7 207.1 605.5 243.7C608.8 251.6 608.8 260.4 605.5 268.3C592.1 300.6 565.2 346.1 525.6 386.7L630.8 469.1C641.2 477.3 643.1 492.4 634.9 502.8C626.7 513.2 611.6 515.1 601.2 506.9L9.196 42.89C-1.236 34.71-3.065 19.63 5.112 9.196C13.29-1.236 28.37-3.065 38.81 5.112L150.7 92.77zM189.8 123.5L235.8 159.5C258.3 139.9 287.8 128 320 128C390.7 128 448 185.3 448 256C448 277.2 442.9 297.1 433.8 314.7L487.6 356.9C521.1 322.8 545.9 283.1 558.6 256C544.1 225.1 518.4 183.5 479.9 147.7C438.8 109.6 385.2 79.1 320 79.1C269.5 79.1 225.1 97.73 189.8 123.5L189.8 123.5zM394.9 284.2C398.2 275.4 400 265.9 400 255.1C400 211.8 364.2 175.1 320 175.1C319.3 175.1 318.7 176 317.1 176C319.3 181.1 320 186.5 320 191.1C320 202.2 317.6 211.8 313.4 220.3L394.9 284.2zM404.3 414.5L446.2 447.5C409.9 467.1 367.8 480 320 480C239.2 480 174.5 443.2 127.4 399.4C80.62 355.1 49.34 304 34.46 268.3C31.18 260.4 31.18 251.6 34.46 243.7C44 220.8 60.29 191.2 83.09 161.5L120.8 191.2C102.1 214.5 89.76 237.6 81.45 255.1C95.02 286 121.6 328.5 160.1 364.3C201.2 402.4 254.8 432 320 432C350.7 432 378.8 425.4 404.3 414.5H404.3zM192 255.1C192 253.1 192.1 250.3 192.3 247.5L248.4 291.7C258.9 312.8 278.5 328.6 302 333.1L358.2 378.2C346.1 381.1 333.3 384 319.1 384C249.3 384 191.1 326.7 191.1 255.1H192z"/></svg>`,
}

function plural(object, count) {
    return count > 1 ? object + 's' : object;
}

function eyeToggle(target, color, forceInitialVisible) {
    const toggle = $(`<span style="cursor: pointer;"></span>`);
    const update = (visible) => {
        toggle.attr('title', visible ? 'Hide' : 'Show')
        const icon = visible ?
              $(ICONS.EYE_SLASH).css('width', '16px').css('fill', color) :
              $(ICONS.EYE).css('width', '14px').css('right', '1px').css('fill', "#fe2a73");
        icon.css('position', 'relative')
        toggle.empty().append(icon);
    };

    toggle.click(() => {
        target.toggle();
        update(target.is(':visible'));
    });
    update(forceInitialVisible !== undefined ? forceInitialVisible : target.is(':visible'));

    return toggle;
}

function ifpButton(name) {
    const div = $(
`<div class="box ifp-button" data-ifp-category-name="${name}">
<div style="
    font-weight: bold;
    color: #fff;
    font-size: 22px;
">
${name}
<br/>
<span class="ifp-big-category-button-subtitle" style="font-size: 12px; color: gray;">
</span>
</div>
</div>`);

    const svg = $(nameToIcon[name]);
    svg.css('width', '28px')
    svg.css('height', '28px')
    svg.css('fill', 'white')
    div.prepend(svg)

    return div;
}

function deliciousSettings () {
    delicious.settings.init('reverseGroupsOrder', true);
    delicious.settings.init('inlineSeriesRelations', true);
    delicious.settings.init('groupEyeToggle', true);
    delicious.settings.init('hideRelatedSeriesTable', false);
    delicious.settings.init('parentSeriesOnly', false);
    delicious.settings.init(
        'groupPaddingInPx',
        12
    );
    delicious.settings.init('separator', null);

    if (delicious.settings.ensureSettingsInserted()) {
        const section = delicious.settings.createCollapsibleSection('Improved Franchise Page');
        const s = section.querySelector('.settings_section_body');

        s.appendChild(delicious.settings.createCheckbox(
            'reverseGroupsOrder',
            'Reverse Groups Order',
            'Reverses the order of the groups in the franchise (or series) page. I constantly found my self scrolling to the bottom and moving upwards. With this enabled the newer groups are at the bottom.'
        ));

        s.appendChild(delicious.settings.createCheckbox(
            'inlineSeriesRelations',
            'Series Relations Inline',
            'In franchise page, add the series relation (such as "Sequel", "Prequel", "Alternate Ending" etc...) to the related series torrent group title it self. Instead of the relation only being shown on the default, seperate relation table.'
        ));

        s.appendChild(delicious.settings.createCheckbox(
            'groupEyeToggle',
            'Group Eye Toggle',
            'Add a small clickable eye to groups in the franchise page that toggles (show/hide) the group.'
        ));

        s.appendChild(delicious.settings.createCheckbox(
            'hideRelatedSeriesTable',
            'Hide Related Series Table',
            `Hides the "Related Series" table. If you feel like you don't need it with the relations inlined.`
        ));

        const parentSeriesOnlyCheckbox = delicious.settings.createCheckbox(
            'parentSeriesOnly',
            'Franchises Only',
            ""
        );
        $(parentSeriesOnlyCheckbox).find('label[for="setting_parentSeriesOnly"]').html(
            `Only apply the script changes to parent series pages (essentially the top most page, the franchise page). That means for example that <a target="_blank" href="https://animebytes.tv/series.php?id=26292">Steins;Gate 0</a> would stay like usual, while it's parent series (<a target="_blank" href="https://animebytes.tv/series.php?id=6944">Steins;Gate</a>) would be "improved".`
        );
        s.appendChild(parentSeriesOnlyCheckbox);

        // Default expanded category
        delicious.settings.init("defaultExpandedCategory", "none");
        s.appendChild(
            delicious.settings.createDropDown(
                "defaultExpandedCategory",
                "Default Expanded Category",
                "Choose a category to select and expand by default. *Note: If a series only has a single category it will always be expanded and no category selection will be available anyways.",
                [
                    ["-None-", "none"],
                    ["-All-", "all"],
                    ...Object.keys(nameToIcon).map(name => [name, name])
                ],
                { default: "none" }
            )
        );

        // Default expanded role
        delicious.settings.init("defaultExpandedRole", "all");
        s.appendChild(
            delicious.settings.createDropDown(
                "defaultExpandedRole",
                "Default Expanded Role",
                "Choose a role to select and expand by default (relevant to artist page only).",
                [
                    ["-None-", "none"],
                    ["-All-", "all"]
                ],
                { default: "all" }
            )
        );

        s.appendChild(
            delicious.settings.createNumberInput(
                'groupPaddingInPx',
                "Torrent Groups Padding",
                `How much (if) padding to add between torrent groups on the franchise (series) page. This helps differentiating between groups. No more giant long wall of torrents. Default is 12, can be set to 0 to disable padding.`,
                {
                    default: "12",
                    required: true,
                }
            )
        );

        s.appendChild(delicious.settings.createColourSetting(
            'separator',
            'Separator', 'Enable/Disable a small colored separator line between groups (can be used together or instead of padding).',
            {default: null}));

        delicious.settings.insertSection(section);
    }

    return {
        parentSeriesOnly: delicious.settings.get('parentSeriesOnly', false),
        reverseGroupsOrder: delicious.settings.get('reverseGroupsOrder', false),
        groupEyeToggle: delicious.settings.get('groupEyeToggle', true),
        inlineSeriesRelations: delicious.settings.get('inlineSeriesRelations', true),
        hideRelatedSeriesTable: delicious.settings.get('hideRelatedSeriesTable', false),
        defaultExpandedCategory: delicious.settings.get('defaultExpandedCategory', "none"),
        defaultExpandedRole: delicious.settings.get('defaultExpandedRole', "all"),
        groupPaddingInPx: delicious.settings.get('groupPaddingInPx', 12),
        separator: delicious.settings.get('separator', null),
    };
}
const settings = deliciousSettings();

function mapSeriesRelations() {
    const map = {};
    $('#series_relation > tbody > tr:not(.colhead)').each(function () {
        const seriesLink = $(this).find('> td:last-child > a').attr('href')
        const relationType = $(this).find('> td:first-child').text()

        if (!seriesLink.startsWith('/series.php?') || !relationType) {
            return;
        }

        map[seriesLink] = relationType;
    });
    return map;
}

function groupPaddingAndSeparator() {
    const separatorBorder = settings.separator ? `solid 0.3px ${settings.separator}` : 'hidden 0 transparent';
    $(`tr.group.discog[id^=group_]:not(:nth-child(2))`).before(
        `<tr style="background: ${$('body').css('background-color')}"><td style="border: solid 1px ${$('body').css('background-color')}; border-top: hidden 0 transparent; border-bottom: ${separatorBorder}; padding: 0; height: ${settings.groupPaddingInPx/2}px;" colspan="100%"></td></tr>`,
        `<tr style="background: ${$('body').css('background-color')}"><td style="border: solid 1px ${$('body').css('background-color')}; border-bottom: hidden 0 transparent; border-top: ${separatorBorder}; padding: 0; height: ${settings.groupPaddingInPx/2}px;" colspan="100%"></td></tr>`
    );
}

(function() {
    'use strict';

    // Only run in series page
    if (window.location.pathname === "/user.php") {
        return;
    }

    // Not a franchise, just a series with a parent franchise
    if (window.location.pathname === "/series.php" && settings.parentSeriesOnly && $('#content > .thin > h2 > a').length !== 0) {
        return;
    }

    // Styles
    $('body').append(
`<style>
    .ifp-button {
        display: flex;
        margin: 0 !important;
        padding: 14px;
        align-items: center;
        gap: 20px;
        flex-grow: 1;
        transition: transform 0.2s, background 0.1s, border-color 0.1s;
        transform: scale(1);
        cursor: pointer;
    }

    .ifp-button:hover {
        transform: scale(1.05);
        background: #303030;
        border-color: #303030;
        z-index: 2;
    }

    .ifp-big-category-button-active {
        background: #0090ff !important;
        border-color: #0090ff !important;
    }

    .ifp-big-category-button-active span {
        color: #363636 !important;
    }

    .ifp-buttons-all-selected > .ifp-big-category-button {
        border: 1px solid #0090ff !important;
    }

    .ifp-small-role-button-active {
        background: #fe2a73 !important;
        border-color: #fe2a73 !important;
    }

    .ifp-small-role-button-active span {
        color: #363636 !important;
    }

    .ifp-buttons-all-selected > .ifp-small-role-button {
        border: 1px solid #fe2a73 !important;
    }
</style>`
);
    // Filters
    // "all", "none" or category name
    let selectedCategory = settings.defaultExpandedCategory || "none";
    let selectedRole = window.location.pathname === "/series.php" || !settings.defaultExpandedRole ? "all" : settings.defaultExpandedRole;

    // domsies
    const sections = $('.torrent_table').map(function () {
        // Wrapping is needed for slide animation to work properly
        const table = $(this);
        const filterBox = table.prev('div.box.torrent_filter_box'); // Optionally put the filter box in the wrapper (Enhanced torrent view userscript)
        table.wrap(`<div style="display: none;"></div>`);
        const wrapper = table.parent();
        filterBox.detach().prependTo(wrapper);

        const nameParts = wrapper.find('tbody > tr:first-child > td:first-child > strong > a:first-child').text().split(' - ');

        return {
            table,
            wrapper,
            category: nameParts[0],
            role: nameParts[1], // Artist role
        }
    }).get();
    const bigButtons = $(`<div style="display: flex; flex-wrap: wrap; margin-bottom: 20px; margin-top: 5px; gap: 5px;"></div>`);
    const smallRoleButtons = $(`<div style="display: flex; flex-wrap: wrap; margin-bottom: 20px; margin-top: 5px; gap: 5px;"></div>`);
    const categoryNameToButton = {};
    const roleNameToButton = {};
    sections.forEach(({category, role}) => {
        if (!categoryNameToButton[category]) {
            const button = ifpButton(category).addClass('ifp-big-category-button').click(() => {
                if (selectedCategory === category) {
                    selectedCategory = "none";
                } else {
                    selectedCategory = category;
                }
                refreshFilters();
            });
            button.appendTo(bigButtons);
            categoryNameToButton[category] = button;
        }

        if (role && !roleNameToButton[role]) {
            const button = ifpButton(role).addClass('ifp-small-role-button').click(() => {
                if (selectedRole === role) {
                    selectedRole = "none";
                } else {
                    selectedRole = role;
                }
                refreshFilters();
            });
            button.appendTo(smallRoleButtons);
            roleNameToButton[role] = button;
        }
    });
    const roleSelectionLinks = $(`<div class="box center" style="padding: 10px; margin-bottom: 0px; margin-top: -5px;"></div>`)
    const expandAllCategoriesLink = $('<a href="javascript:void(0);">Expand All Categories</a>');
    const expandAllRolesLink = $('<a href="javascript:void(0);">Expand All Roles</a>').appendTo(roleSelectionLinks);
    const allTorrentsAreHidden = $(`<h3 style="margin-bottom: 12px;">- All groups are hidden by the selected filters -</h3>`).hide().insertAfter(
        $('.torrent_table').last().parent()
    );

    function refreshFilters (animate = true) {
        const filters = [];
        const whyAllHiddenHints = [];
        $('.ifp-big-category-button-active').removeClass('ifp-big-category-button-active');
        $('.ifp-small-role-button-active').removeClass('ifp-small-role-button-active');

        // Category
        if (selectedCategory === "all") {
            bigButtons.addClass('ifp-buttons-all-selected');
            expandAllCategoriesLink.text('Collapse All Categories');
        } else {
            bigButtons.removeClass('ifp-buttons-all-selected');
            expandAllCategoriesLink.text('Expand All Categories');

            if (selectedCategory === "none" || !categoryNameToButton[selectedCategory]) {
                filters.push(() => false)
                whyAllHiddenHints.push('Select a category');
            } else {
                categoryNameToButton[selectedCategory].addClass('ifp-big-category-button-active');
                filters.push(section => section.category === selectedCategory);
            }
        }

        // Role
        if (selectedRole === "all") {
            smallRoleButtons.addClass('ifp-buttons-all-selected');
            expandAllRolesLink.text('Collapse All Roles');
        } else {
            smallRoleButtons.removeClass('ifp-buttons-all-selected');
            expandAllRolesLink.text('Expand All Roles');

            if (selectedRole === "none" || !roleNameToButton[selectedRole]) {
                filters.push(() => false)
                whyAllHiddenHints.push('Select a role');
            } else {
                roleNameToButton[selectedRole].addClass('ifp-small-role-button-active');
                filters.push(section => section.role === selectedRole);
            }
        }


        // Overlap hint
        if (selectedCategory !== "none" && categoryNameToButton[selectedCategory] && selectedRole !== "none" && roleNameToButton[selectedRole]) {
            whyAllHiddenHints.push('No overlap between category and role');
        }

        // Update hidden notice
        allTorrentsAreHidden.html(`- All groups are hidden by the selected filters -<br/>
${plural('Hint', whyAllHiddenHints.length)}:
${whyAllHiddenHints.map(hint => `<u>${hint}</u>`).join(', ')}`)

        const previouslyShownSections = sections.filter(section => section.wrapper.is(':visible'));
        const newShownSections = sections.filter(section => filters.every(filter => filter(section)));

        if (previouslyShownSections.length === 0) {
            previouslyShownSections.push({wrapper: allTorrentsAreHidden})
        }
        if (newShownSections.length === 0) {
            newShownSections.push({wrapper: allTorrentsAreHidden})
        }

        // Only animate if it's a 1 to 1 switch
        if (previouslyShownSections.length > 1 || newShownSections.length > 1) {
            previouslyShownSections.forEach(({wrapper}) => wrapper.hide());
            newShownSections.forEach(({wrapper}) => wrapper.show());
            return;
        }

        const oldW = previouslyShownSections[0].wrapper;
        const newW = newShownSections[0].wrapper;
        if (oldW.get(0) === newW.get(0)) {
            if (oldW.is(':hidden')) {
                oldW.show();
            }

            return;
        }

        if (animate) {
            oldW.slideUp(Math.min(600, oldW.outerHeight()), () => {
                newW.slideDown(Math.min(600, newW.outerHeight()));
            });
        } else {
            oldW.hide();
            newW.show();
        }
    }

    expandAllCategoriesLink.click(() => {
        if (bigButtons.hasClass('ifp-buttons-all-selected')) {
            selectedCategory = "none";
        } else {
            selectedCategory = "all";
        }

        refreshFilters();
    });

    expandAllRolesLink.click(() => {
        if (smallRoleButtons.hasClass('ifp-buttons-all-selected')) {
            selectedRole = "none";
        } else {
            selectedRole = "all";
        }

        refreshFilters();
    });

    // Related Series
    const seriesToRelationMap = mapSeriesRelations();
    if (settings.hideRelatedSeriesTable) {
        $('#series_relation').parent().hide();
    }

    // Patch default links
    const linksSection = $('#content > .thin > .main_column > .box.center').first();
    const isMusicOnly = new URLSearchParams(window.location.search).get('view') === "ost";
    const switchViewLink = isMusicOnly ? linksSection.find('a[href$="view=all"') : linksSection.find('a[href$="view=ost"').text('View Music Only');
    const showRelatedSeriesLink = !settings.hideRelatedSeriesTable && $('#series_relation > tbody > tr:not(.colhead)').length > 0;
    linksSection.css('margin-bottom', '0').empty().append(
        ...(switchViewLink.length === 1 ? [switchViewLink, ` | `] : []),
        ...(showRelatedSeriesLink ? [`<a href="#series_relation">Related Series</a>`, ` | `] : []),
        `<a href="#screenshots">Screenshots</a>`,
        ` | `,
        `<a href="#series_info">Series Info</a>`,
    );

    if (sections.length <= 1) {
        groupPaddingAndSeparator();
        // No point in making category selections for a single category;
        return;
    }

    // Insert expand all link
    linksSection.prepend(expandAllCategoriesLink, ' | ')

    // Loop torrent tables
    sections.forEach((section) => {
        const {table, category, wrapper} = section;
        // Count items and torrents, reverse items
        let groupsCount = 0;
        let torrentsCount = 0;
        let groupHeader = table.find('> tbody > tr:nth-child(2)');
        let newOrder = [];
        while (groupHeader && groupHeader.length === 1) {
            // Inline series relation
            const title = groupHeader.find('> td > h3')
            const a = title.find('a[href^="/series.php?"]');
            const relationType = seriesToRelationMap[a.attr('href')];
            if (settings.inlineSeriesRelations && relationType) {
                a.append(" - ", `<span title="Relation Type">${relationType}</span>`);
            }

            // Counting
            const groupItems = groupHeader.nextUntil('[id^=group_]');
            groupsCount++;
            torrentsCount += groupItems.filter('.group_torrent').length;

            // group eye toggle
            if (settings.groupEyeToggle) {
                eyeToggle(groupItems, title.css('color'), true).css('float', 'right').appendTo(title);
            }

            const next = groupHeader.nextAll('[id^=group_]').first();
            if (settings.reverseGroupsOrder) {
                newOrder = [groupHeader.detach(), groupItems.detach(), ...newOrder]
            }
            groupHeader = next;
        }
        newOrder.forEach((item) => table.append(item));

        // Hide the default table toggle
        table.find('> tbody > tr:first-child > td:first-child > strong').css('color', "transparent");
        table.find('> tbody > tr:first-child > td:first-child > strong > a:nth-child(2)').hide();

        // Update big button with numbers
        section.groupsCount = groupsCount;
        section.torrentsCount = torrentsCount;
        categoryNameToButton[category].find('.ifp-big-category-button-subtitle').html(
            `<i>${groupsCount}</i> ${plural('group', groupsCount)}
|
<i>${torrentsCount}</i> ${plural('torrent', torrentsCount)}`
);
    });
    linksSection.after(bigButtons, ...(window.location.pathname === "/artist.php" ? [roleSelectionLinks, smallRoleButtons] : []));

    // group padding and separator
    groupPaddingAndSeparator();

    // Support location hash links
    const setActiveCategoryFromHash = () => {
        const selector = window.location.hash;
        const found = $(selector);

        if (found.length !== 1 || !found.hasClass('torrent_table')) {
            return false;
        }

        const matchingSection = sections.find(s => s.table.get(0) === found.get(0));
        if (!matchingSection) {
            return false;
        }

        selectedCategory = matchingSection.category;
        refreshFilters(false);
        return true;
    }
    window.addEventListener('hashchange', () => setActiveCategoryFromHash());
    const setFromHash = setActiveCategoryFromHash();
    if(!setFromHash) {
        refreshFilters(false);
    };

    // Move music cover view to after torrent tables
    if (isMusicOnly || window.location.pathname === "/artist.php") {
        $('#collage_table').detach().insertAfter(
            allTorrentsAreHidden
        );
    }

    //mainColumn.children().first().hide();
})();
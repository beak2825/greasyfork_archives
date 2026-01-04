// ==UserScript==
// @name         Black Admin 2024
// @namespace    http://tampermonkey.net/
// @version      v1.7
// @description  I'll upgrade your admin!
// @author       Nikita Nikitin
// @match        *://tngadmin.triplenext.net/*
// @match        *://yruleradmin.triplenext.net/*
// @match        *://yrulermgr.triplenext.net/*
// @match        *://tngadmin-dev.triplenext.net/*
// @match        *://tngtest.westus.cloudapp.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484246/Black%20Admin%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/484246/Black%20Admin%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Подключение шрифта Roboto Condensed
    function addLink(href) {
        let link = document.createElement('link');
        link.href = href;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    addLink('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;500;700&display=swap');

    // Все стили проекта
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .custom-btn {
        padding: 6px 16px;
        margin: 5px;
        border: none;
        border-radius: 6px;
        background-color: #493E3E;
        color: #BFE7ED;
        font-size: 11px;
        font-family: 'Roboto Condensed', sans-serif;
        text-transform: uppercase;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        transition: background-color 0.3s;
    }
    .custom-btn:hover {
        background-color: #4C585A;
    }
    .custom-btn:active {
        background-color: #2CA9BC;
    }
    .pos-left .image-btn {
        margin-right: 12px;
        order: -1;
    }
    .pos-right .image-btn {
        margin-left: 12px;
        order: 1;
    }
    .pos-left .arrow-svg {
        transform: rotate(180deg);
    }
    .baglist-svg {
        margin-bottom: 4px;
    }
    .image-btn {
        display: inline-block;
        vertical-align: middle;
    }
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }

    .arrow-svg path:nth-child(3) {
        animation: fadeInOut 3s infinite;
    }

    .arrow-svg path:nth-child(2) {
        animation: fadeInOut 3s infinite;
        animation-delay: .5s;
    }

    .arrow-svg path:nth-child(1) {
        animation: fadeInOut 3s infinite;
        animation-delay: 1s;
    }
    .sticky {
        position: fixed;
        max-width: 1230px;
        z-index: 1;
        background-color: #fff;
        transition: all .25s ease;
        border-bottom: 1px solid #CFCFCF;
        box-shadow: 0px 7px 15px -7px rgba(0,0,0,0.2);
        padding: 20px 20px 0 20px;
        margin-left: -20px;
    }
    .custom-shape {
        display: inline-block;
        padding: 0 10px;
        border-radius: 6px;
        border: 1px dashed #878787;
        text-align: center;
        line-height: 1.7;
        margin: 2px;
        font-family: 'Roboto Condensed', sans-serif;
        font-weight: 700;
        transition: background-color 0.5s ease;
    }
    .custom-shape:hover {
        cursor: pointer;
        color: #2CA9BC;
        border-color: #2CA9BC;
    }
    .custom-search {
        padding: 6px 16px !important;
        margin: 5px !important;
        border: none !important;
        border-radius: 6px !important;
        background-color: #493E3E !important;
        color: #BFE7ED !important;
        font-size: 14px !important;
        font-family: 'Roboto Condensed', sans-serif !important;
    }
    /* Стилизация крестика для очистки */
    input[type="search"]::-webkit-search-cancel-button {
        -webkit-appearance: none !important;
        height: 15px !important;
        width: 15px !important;
        cursor: pointer;
        background: url('data:image/svg+xml;utf8,<svg fill="%232CA9BC" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>') center / contain no-repeat;
    }
    .custom-fast-container {
        margin-left: 130px;
        display: inline-flex;
        align-items: center;
    }
    #fastAddContextBtn, #fastAddMultiContextBtn {
        width: 40px;
        height: 32px;
        background-color: #493E3E;
        cursor: pointer;
        color: #BFE7ED;
        border: none;
        border-radius: 6px;
        margin-left: -3px;
    }
    .custom-btn-link {
        width: 20px;
        height: 36px;
        margin-right: 5px;
        border-radius: 4px;
        background-color: #493E3E;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }
    .custom-btn-vRow {
        position: relative;
        top: 18px;
        margin-top: -17px;
        height: 57px;
    }
    .custom-btn-link:hover, #fastAddContextBtn:hover, #fastAddMultiContextBtn:hover {
        background-color: #4C585A;
    }
    .custom-btn-link:active, #fastAddContextBtn:active, #fastAddMultiContextBtn:active  {
        background-color: #2CA9BC;
    }
    .useforcta-btn {
        width: 32px;
        height: 24px;
        border: 1px dashed #493E3E;
        border-radius: 6px;
        display: inline;
        margin-left: 4px;
    }
    .useforcta-btn svg {
        margin-top: 3px;
    }
    .toggle-active {
        background-color: #2CA9BC;
        border-color: #2CA9BC;
    }
    .dblclick p {
        margin-left: 30px;
    }
    #page {
        position: relative;
    }
    .button-container {
        position: absolute;
        top: 0px px;
        left: -124px;
        width: 120px;
        height: 270px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    #page .custom-btn {
        margin: 2px 0px;
    }
    #page #copyCdnFromProducts {
        margin-bottom: 20px;
    }
    `;
    document.head.appendChild(style);

    // SVG иконка
    const svgArrow = `
    <svg class="image-btn arrow-svg" width="15" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
	    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.385.24c.326-.359.817-.31 1.097.11l4.666 6.999c.25.374.25.927 0 1.301l-4.666 7c-.28.42-.771.468-1.097.109-.326-.36-.364-.991-.084-1.41l4.232-6.35-4.232-6.348C8.02 1.23 8.059.6 8.385.24z" fill="#2CA9BC"/>
	    <path opacity=".5" fill-rule="evenodd" clip-rule="evenodd" d="M4.356 1.017c.293-.324.735-.28.987.097l4.2 6.3c.224.337.224.834 0 1.171l-4.2 6.3c-.252.378-.694.421-.987.098-.294-.324-.328-.892-.076-1.27L8.09 8 4.28 2.286c-.252-.378-.218-.946.076-1.27z" fill="#2CA9BC"/>
	    <path opacity=".5" fill-rule="evenodd" clip-rule="evenodd" d="M.315 2.18c.245-.27.613-.233.823.082l3.5 5.25a.918.918 0 0 1 0 .976l-3.5 5.25c-.21.314-.578.35-.823.08-.245-.269-.273-.742-.063-1.057L3.426 8 .252 3.238C.042 2.923.07 2.45.315 2.18z" fill="#2CA9BC"/>
    </svg>`;
    const svgEdit = '<svg class="image-btn edit-svg" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.745 1.255a2.185 2.185 0 0 0-3.09 0L4.679 6.23a2.1 2.1 0 0 0-.552.975L3.52 9.63a.7.7 0 0 0 .849.848l2.423-.605a2.1 2.1 0 0 0 .976-.553l4.976-4.975a2.185 2.185 0 0 0 0-3.09z" fill="#2CA9BC"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 3.5A3.5 3.5 0 0 1 3.5 0H7a.7.7 0 1 1 0 1.4H3.5a2.1 2.1 0 0 0-2.1 2.1v7c0 1.16.94 2.1 2.1 2.1h7a2.1 2.1 0 0 0 2.1-2.1V7A.7.7 0 0 1 14 7v3.5a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 0 10.5v-7z" fill="#485356"/></svg>';
    const svgDictionary = '<svg class="image-btn dictionary-svg" width="15" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.684 5.901a.786.786 0 0 0-.484-.57l-.867-.337v.891l.164.064a.236.236 0 0 1 .082.386L8.014 11.9a.393.393 0 0 1-.42.088l-1.237-.48v.89l.868.338a1.335 1.335 0 0 0 1.428-.3l5.817-5.817a.785.785 0 0 0 .213-.717zM.888 8.254c.039-.542.213-1.253.817-1.22l5.519 2.147a1.335 1.335 0 0 0 1.43-.303l5.334-5.37a.785.785 0 0 0-.272-1.284L8.231.09a1.335 1.335 0 0 0-1.43.303L.62 6.614C.134 7.015 0 7.765 0 8.431c0 .666.044 1.465.8 1.776l-.178-.042 1.663.647v-.595c0-.097.012-.191.032-.284L1.199 9.5C.843 9.365.843 8.881.888 8.254z" fill="#2CA9BC"/><path d="M3.19 9.776a.627.627 0 0 0-.184.442v2.759l1.172-.251L5.639 14v-2.758c0-.166.066-.325.184-.442l.467-.468-2.633-1.024-.468.468z" fill="#485356"/></svg>';
    const svgFeatures = '<svg class="image-btn features-svg" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.077 0H.462C.185 0 0 .185 0 .462v4.615c0 .277.185.461.462.461h4.615c.277 0 .461-.184.461-.461V.462C5.538.185 5.354 0 5.077 0zM5.077 6.461H.462c-.277 0-.462.185-.462.462v4.615c0 .277.185.461.462.461h4.615c.277 0 .461-.184.461-.461V6.923c0-.277-.184-.462-.461-.462zM11.539 0H6.923c-.276 0-.461.185-.461.462v4.615c0 .277.185.461.461.461h4.616c.277 0 .461-.184.461-.461V.462C12 .185 11.816 0 11.54 0z" fill="#2CA9BC"/><path d="M11.077 8.769H9.692V7.384c0-.277-.185-.461-.462-.461-.276 0-.461.184-.461.461V8.77H7.384c-.277 0-.461.185-.461.461 0 .277.184.462.461.462H8.77v1.385c0 .277.185.461.461.461.277 0 .462-.184.462-.461V9.692h1.385c.277 0 .461-.185.461-.462 0-.276-.184-.461-.461-.461z" fill="#485356"/></svg>';
    const svgBagList = '<svg class="image-btn baglist-svg" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3.514h1.475L5.335.94A.7.7 0 1 0 4.007.494L3 3.514zM8.243.394a.717.717 0 0 0-.041.547l.86 2.573h1.475L9.565.494a.717.717 0 0 0-1.322-.1z" fill="#485356"/><path d="M13.825 4.457a.7.7 0 0 0-.532-.244H.708a.7.7 0 0 0-.699.81l1.307 7.81A1.398 1.398 0 0 0 2.715 14h8.6a1.398 1.398 0 0 0 1.398-1.168l1.28-7.808a.7.7 0 0 0-.168-.567zm-8.922 6.047a.699.699 0 0 1-1.398 0V7.708a.7.7 0 0 1 1.398 0v2.796zm2.797 0a.699.699 0 0 1-1.398 0V7.708a.7.7 0 0 1 1.398 0v2.796zm2.796 0a.699.699 0 1 1-1.398 0V7.708a.7.7 0 0 1 1.398 0v2.796z" fill="#2CA9BC"/></svg>';
    const svgLink = '<svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 2.068 6.44 5.141c-.83.835-.817 2.018-.191 2.647a.71.71 0 0 1-1.006 1.003c-1.274-1.28-1.09-3.365.191-4.652l3.06-3.074C9.774-.223 11.855-.409 13.131.873l-.503.502.503-.502c1.274 1.28 1.09 3.365-.191 4.652l-1.53 1.537a.71.71 0 1 1-1.006-1.003l1.53-1.536c.83-.835.817-2.018.191-2.647-.624-.627-1.797-.642-2.627.192z" fill="#2CA9BC"/><path opacity=".5" fill-rule="evenodd" clip-rule="evenodd" d="M7.753 5.207a.71.71 0 0 1 1.004.002c1.274 1.28 1.09 3.365-.191 4.652l-.503-.5.503.5-1.53 1.537-1.53 1.537c-1.282 1.288-3.362 1.474-4.638.192-1.274-1.28-1.09-3.365.191-4.653l1.53-1.536A.71.71 0 1 1 3.595 7.94l-1.53 1.536c-.83.835-.817 2.018-.191 2.647.624.627 1.797.642 2.627-.192l1.53-1.537L7.56 8.86c.83-.835.817-2.018.191-2.647a.71.71 0 0 1 .002-1.005z" fill="#556D74"/></svg>';
    const svgPlus = '<svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6c0 .265-.105.52-.29.708a.987.987 0 0 1-.702.294h-4v4.04c-.011.258-.12.501-.305.68a.987.987 0 0 1-1.372 0 1.007 1.007 0 0 1-.306-.68v-4.04H1.024a.983.983 0 0 1-.721-.282A1.003 1.003 0 0 1 0 6a1.01 1.01 0 0 1 .302-.72.991.991 0 0 1 .721-.282h4.002V.958c.01-.258.12-.501.305-.68a.987.987 0 0 1 1.372 0c.185.179.294.422.305.68v4.04h4.002c.263 0 .515.106.7.294.187.188.291.442.291.708z" fill="#2CA9BC"/></svg>';
    const svgUseforctaDisabled = '<svg width="16" height="13" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.89 7.984a3.177 3.177 0 0 0-4.21-4.21l.96.959A1.962 1.962 0 0 1 9.93 7.025l.96.959z" fill="#493E3E"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3.043 3.278c-.21.172-.408.345-.594.517A16.472 16.472 0 0 0 .27 6.263a5.39 5.39 0 0 0-.032.045l-.008.013-.003.004-.228.34.227.337.001.002.003.004.008.013a5.563 5.563 0 0 0 .15.209 16.472 16.472 0 0 0 2.06 2.303c1.348 1.242 3.31 2.584 5.551 2.584 1.106 0 2.144-.327 3.075-.808l-.907-.906c-.69.31-1.42.502-2.168.502-1.774 0-3.447-1.081-4.73-2.263a15.267 15.267 0 0 1-1.792-1.978A15.27 15.27 0 0 1 3.27 4.686c.202-.186.414-.37.634-.547l-.861-.861zm9.053 5.911c.22-.177.432-.36.634-.547a15.275 15.275 0 0 0 1.792-1.978 15.278 15.278 0 0 0-1.792-1.978C11.447 3.506 9.774 2.424 8 2.424c-.748 0-1.477.192-2.167.503l-.907-.907c.93-.48 1.968-.807 3.074-.807 2.241 0 4.203 1.342 5.551 2.583a16.47 16.47 0 0 1 2.178 2.468l.032.045.008.013.003.004.228.34-.227.337-.001.002-.003.004-.008.013a6.218 6.218 0 0 1-.15.209 16.47 16.47 0 0 1-2.06 2.303 13.95 13.95 0 0 1-.594.518l-.861-.862zM13.453 12.974 1.336.857 2.193 0 14.31 12.117l-.857.857z" fill="#493E3E"/></svg>';
    const svgUseforctaActive = '<svg width="16" height="11" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.996 0C5.754 0 3.791 1.343 2.443 2.585a16.48 16.48 0 0 0-2.18 2.468l-.03.046-.01.012-.002.004-.221.35.22.329.001.001.003.004.008.012a5.5 5.5 0 0 0 .15.21 16.48 16.48 0 0 0 2.061 2.304c1.349 1.243 3.311 2.585 5.553 2.585s4.205-1.342 5.554-2.585a16.472 16.472 0 0 0 2.179-2.468l.032-.046.008-.012.003-.004v-.002L16 5.455l-.227-.339h-.001l-.003-.005-.008-.012a6.362 6.362 0 0 0-.15-.21 16.472 16.472 0 0 0-2.061-2.304C12.201 1.343 10.238 0 7.996 0zm-6.23 5.831c-.116-.143-.215-.27-.295-.376a15.275 15.275 0 0 1 1.793-1.979C4.548 2.294 6.22 1.212 7.996 1.212c1.775 0 3.45 1.082 4.733 2.264a15.276 15.276 0 0 1 1.793 1.98 15.276 15.276 0 0 1-1.793 1.979C11.445 8.615 9.77 9.697 7.996 9.697c-1.775 0-3.448-1.082-4.732-2.264A15.274 15.274 0 0 1 1.766 5.83zm8.049-.376a1.818 1.818 0 1 1-3.637 0 1.818 1.818 0 0 1 3.637 0zm1.212 0a3.03 3.03 0 1 1-6.061 0 3.03 3.03 0 0 1 6.061 0z" fill="#FCFFFF"/></svg>';
    const svgCopy = '<svg class="image-btn copy-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M17.0998 2h-4.2C9.44976 2 8.04977 3.37 8.00977 6.75h3.09003c4.2 0 6.15 1.95 6.15 6.15v3.09c3.38-.04 4.75-1.44 4.75-4.89V6.9c0-3.5-1.4-4.9-4.9-4.9Z" fill="#2CA9BC"/><path d="M11.1 8H6.9C3.4 8 2 9.4 2 12.9v4.2C2 20.6 3.4 22 6.9 22h4.2c3.5 0 4.9-1.4 4.9-4.9v-4.2C16 9.4 14.6 8 11.1 8Zm1.19 5.65-3.71 3.71c-.14.14-.32.21-.51.21s-.37-.07-.51-.21L5.7 15.5c-.28-.28-.28-.73 0-1.01s.73-.28 1.01 0l1.35 1.35 3.21-3.21c.28-.28.73-.28 1.01 0s.29.74.01 1.02Z" fill="#2CA9BC"/></svg>';
    const svgComplex = '<svg class="image-btn complex-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2CA9BC" xmlns="http://www.w3.org/2000/svg"><path d="M15 12c0 1.6569-1.3431 3-3 3s-3-1.3431-3-3 1.3431-3 3-3 3 1.3431 3 3Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3s-.6988 0-.9046.06005c-.3012.08789-.5673.26803-.7608.51506-.1322.16877-.2187.38505-.39169.81761-.24872.6218-.93898.94199-1.57434.73028l-.57078-.19019c-.40489-.13496-.60734-.20245-.80583-.21401-.29157-.01699-.58176.05152-.83495.1971-.17236.09911-.32325.25001-.62504.5518-.32075.32075-.48113.48112-.58301.66419-.14969.26895-.21301.57745-.18137.88362.02153.20839.10576.41898.27423.84015.26383.65957.01002 1.41312-.5991 1.77867l-.27751.16654c-.4249.25493-.63735.38243-.79167.55793-.13656.1553-.23953.3372-.30245.5342C3 11.1156 3 11.3658 3 11.8663c0 .5926 0 .8888.09462 1.1425.08361.2241.2196.4249.39662.5858.20034.182.47271.291 1.01742.5089.55668.2226.8433.8406.6537 1.4094l-.21515.6455c-.14902.447-.22354.6706-.23031.8902-.00815.2641.05359.5256.17897.7581.10428.1935.27091.3601.60413.6933.33323.3332.49985.4998.69325.6041.23255.1254.49408.1872.75815.179.21962-.0068.44316-.0813.89024-.2303l.52698-.1757c.63531-.2117 1.32558.1084 1.57429.7302.17299.4325.25949.6488.39169.8176.1935.247.4596.4272.7608.5151.2058.06.4387.06.9046.06s.6988 0 .9046-.06c.3012-.0879.5673-.2681.7608-.5151.1322-.1688.2187-.3851.3917-.8176.2487-.6218.939-.9419 1.5742-.73l.5266.1756c.4471.149.6707.2235.8903.2303.2641.0081.5256-.0536.7581-.179.1934-.1043.3601-.2709.6933-.6041.3332-.3332.4998-.4999.6041-.6933.1254-.2325.1871-.4941.179-.7581-.0068-.2196-.0813-.4432-.2303-.8903l-.215-.645c-.1897-.569.097-1.1872.6539-1.4099.5447-.2179.8171-.3269 1.0175-.5089.177-.1609.313-.3617.3966-.5858C21 12.7551 21 12.4589 21 11.8663c0-.5005 0-.7507-.0711-.9733-.0629-.197-.1659-.3789-.3024-.5342-.1544-.1755-.3668-.303-.7917-.55793l-.2779-.16671c-.6091-.36549-.863-1.11902-.5991-1.77858.1684-.42115.2527-.63175.2742-.84015.0316-.30617-.0317-.61466-.1814-.88362-.1019-.18306-.2622-.34344-.583-.66419-.3018-.30178-.4527-.45268-.625-.55179-.2532-.14559-.5434-.21409-.835-.19711-.1985.01157-.4009.07905-.8058.21401l-.5704.19014c-.6353.21177-1.3256-.10837-1.5743-.73015-.173-.43256-.2595-.64884-.3917-.81761-.1935-.24703-.4596-.42717-.7608-.51506Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // Функция для создания кнопки
    function createButton(id, name, iconPosition, iconHTML) {
        let button = document.createElement("button");
        button.type = "button";
        button.id = id;
        button.className = 'custom-btn ' + (iconPosition === 'left' ? 'pos-left' : 'pos-right');
        button.innerHTML = (iconPosition === 'left' ? iconHTML + ' ' + name : name + ' ' + iconHTML);
        return button;
    }

    // Добавление кнопок для Prodcuts Page
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    let buttonTarget = document.createElement('div');
    buttonTarget.className = 'button-target';
    buttonContainer.appendChild(buttonTarget);

    let pageElement = document.getElementById('page');
    if (pageElement) {
        if (pageElement.firstChild) {
            pageElement.insertBefore(buttonContainer, pageElement.firstChild);
        } else {
            pageElement.appendChild(buttonContainer);
        }
    } else {
        console.error("Элемент с id 'page' не найден.");
    }

    // Функция для добавления кнопки относительно определенного элемента
    function addButtonRelativeElement(button, selector, position) {
        let target = document.querySelector(selector);
        if (target) {
            if (position === 'before') {
                target.parentNode.insertBefore(button, target);
            } else if (position === 'after') {
                target.parentNode.insertBefore(button, target.nextSibling);
            }
        } else {
            console.warn(`Element with selector "${selector}" not found.`);
        }
    }

    // Создание и добавление кнопок
    let button1 = createButton('moveAllContext', 'Переместить все модели', 'right', svgArrow);
    addButtonRelativeElement(button1, '#availableContextModes', 'before');

    let button2 = createButton('removeAllContext', 'Убрать все модели', 'left', svgArrow);
    addButtonRelativeElement(button2, '#selectedContextModes', 'before');

    let button3 = createButton('moveAllMultiContext', 'Переместить все модели', 'right', svgArrow);
    addButtonRelativeElement(button3, '#availableMultiContextModes', 'before');

    let button4 = createButton('removeAllMultiContext', 'Убрать все модели', 'left', svgArrow);
    addButtonRelativeElement(button4, '#selectedMultiContextModes', 'before');

    let button5 = createButton('moveAllCatalog', 'Переместить все каталоги', 'right', svgArrow);
    addButtonRelativeElement(button5, '#filterBoxBtn', 'after');

    let button6 = createButton('removeAllCatalog', 'Убрать каталоги', 'left', svgArrow);
    addButtonRelativeElement(button6, '#selectedItems', 'before');

    let button7 = createButton('removeAllRef', 'Убрать рефы', 'left', svgArrow);
    addButtonRelativeElement(button7, '#selectedItems', 'before');

    let button8 = createButton('removeAllMode', 'Убрать моды', 'left', svgArrow);
    addButtonRelativeElement(button8, '#modes', 'before');

    let button9 = createButton('linkToBagList', 'BagList', 'left', svgBagList);
    addButtonRelativeElement(button9, '#btn-add-preview-dialog', 'after');

    let button10 = createButton('linkToFeatures', 'Features', 'left', svgFeatures);
    addButtonRelativeElement(button10, '#btn-add-preview-dialog', 'after');

    let button11 = createButton('linkToDictionary', 'Dictionary', 'left', svgDictionary);
    addButtonRelativeElement(button11, '#btn-add-preview-dialog', 'after');

    let button12 = createButton('linkToEdit', 'Edit', 'left', svgEdit);
    addButtonRelativeElement(button12, '#btn-add-preview-dialog', 'after');

    let button13 = createButton('removeAllHumanThumb', 'Убрать силуэты', 'left', svgArrow);
    addButtonRelativeElement(button13, '#humanModels', 'before');

    let button14 = createButton('removeAllHumanSet', 'Убрать силуэты', 'left', svgArrow);
    addButtonRelativeElement(button14, '#humanSetViews', 'before');

    // Button to Products Page
    let button15 = createButton('linkToBagListFromProducts', 'BagList', 'left', svgBagList);
    addButtonRelativeElement(button15, '.button-target', 'after');

    let button16 = createButton('linkToComplexFromProducts', 'Complex', 'left', svgComplex);
    addButtonRelativeElement(button16, '.button-target', 'after');

    let button17 = createButton('linkToFeaturesFromProducts', 'Features', 'left', svgFeatures);
    addButtonRelativeElement(button17, '.button-target', 'after');

    let button18 = createButton('linkToDictionaryFromProducts', 'Dictionary', 'left', svgDictionary);
    addButtonRelativeElement(button18, '.button-target', 'after');

    let button19 = createButton('linkToEditFromProducts', 'Edit', 'left', svgEdit);
    addButtonRelativeElement(button19, '.button-target', 'after');

    let button20 = createButton('copyCdnFromProducts', 'Copy CDN', 'left', svgCopy);
    addButtonRelativeElement(button20, '.button-target', 'after');

    let button21 = createButton('copyLinkFromProducts', 'Copy Link', 'left', svgCopy);
    addButtonRelativeElement(button21, '.button-target', 'after');


    /********************** Кнопки для Products Page ***********************/
    const baseDomain = window.location.origin;
    function openLink(url) {
        window.open(url, '_blank').focus();
    }
    // Функция для копирования текста в буфер обмена
    function copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Ссылка скопирована в буфер обмена');
        }).catch(err => {
            alert('Ошибка при копировании: ' + err);
        });
    }
    // Получение значений ID
    function getValues() {
        const retailerId = document.querySelector('#retailersDropdown option:checked')?.value;
        const categoryId = document.querySelector('#CategoryId option:checked')?.value;
        const genderId = document.querySelector('#editTagsDialog input.tagCheckbox:checked')?.getAttribute('data-tag-id');
        const externalIdValue = document.getElementById('ExternalId') ? document.getElementById('ExternalId').value : '';
        const retailerDomainValue = document.getElementById('RetailerDomain') ? document.getElementById('RetailerDomain').value : '';
        return { retailerId, categoryId, genderId, externalIdValue, retailerDomainValue };
    }
    // Обработчики для копирования и перехода по ссылкам
    const handlers = [
        {
            id: 'copyLinkFromProducts',
            action: () => {
                const regex = /^(https?:\/\/[^\/]+\/[^?]+)\/\d+/;
                const match = window.location.href.match(regex);
                if (match) {
                    copyText(match[0]);
                } else {
                    alert('Не удалось извлечь URL');
                }
            }
        },
        {
            id: 'copyCdnFromProducts',
            action: () => {
                const { externalIdValue, retailerDomainValue } = getValues();
                // Предполагаемая обработка разделения домена и пути, если необходимо
                let path = retailerDomainValue.split('/').slice(1).join('/');
                const encodedDomain = encodeURIComponent(retailerDomainValue.split('/')[0]);
                const encodedPath = path ? '/' + path : ''; // Если есть путь, добавляем его без кодирования
                const link = `https://cdn.tangiblee.com/widget/index.html?id=${encodeURIComponent(externalIdValue)}&domain=${encodedDomain}${encodedPath}&mode=admin-preview&directLink=1`;
                copyText(link);
            }
        },
        {
            id: 'linkToEditFromProducts',
            action: () => {
                const { retailerId } = getValues();
                openLink(`${baseDomain}/Admin/Retailer/Edit/${retailerId}`);
            }
        },
        {
            id: 'linkToDictionaryFromProducts',
            action: () => {
                const { retailerId } = getValues();
                openLink(`${baseDomain}/Admin/Retailer/EditFaceliftFrontSettings/${retailerId}`);
            }
        },
        {
            id: 'linkToFeaturesFromProducts',
            action: () => {
                const { retailerId } = getValues();
                openLink(`${baseDomain}/Admin/Retailer/Configure/${retailerId}`);
            }
        },
        {
            id: 'linkToBagListFromProducts',
            action: () => {
                const { retailerId, categoryId, genderId } = getValues();
                let bagListUrl = `${domain}/Admin/CompareBag/BagList?page=1&pageSize=20`;
                if (retailerId) {
                    bagListUrl += `&retailers=${retailerId}`;
                }
                if (categoryId) {
                    bagListUrl += `&categories=${categoryId}`;
                }
                if (genderId) {
                    bagListUrl += `&gender=${genderId}`;
                }
                bagListUrl += `&sort=12`;
                openLink(bagListUrl);
            }
        },
        {
            id: 'linkToComplexFromProducts',
            action: () => {
                const { retailerId, categoryId, genderId } = getValues();
                openLink(`${baseDomain}/Admin/Configuration/Complex?RetailerId=${retailerId}&CategoryId=${categoryId}&TagId=${genderId}`);
            }
        }
    ];

    // Установка обработчиков событий
    handlers.forEach(({ id, action }) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', action);
        }
    });


    /********************** Закрепить navbar ***********************/
    window.addEventListener('scroll', function() {
        let header = document.querySelector('.head-forms');
        let bHeadDecor = document.querySelector('.b-head-decor');
        let stickyClass = 'sticky';
        let stickyTrigger = 100; // 100px
        let stickyPlaceholder = document.getElementById('sticky-placeholder');

        // Создаем пустой див для заполнителя, если он еще не создан
        if (!stickyPlaceholder) {
            stickyPlaceholder = document.createElement('div');
            stickyPlaceholder.id = 'sticky-placeholder';
            stickyPlaceholder.style.display = 'none'; // Сначала скрыт
            header.parentNode.insertBefore(stickyPlaceholder, header);
        }

        // Проверяем, достигла ли прокрутка точки прилипания
        if (window.scrollY >= stickyTrigger - header.offsetHeight) {
            header.classList.add(stickyClass);
            header.style.top = bHeadDecor ? '88px' : '50px';

            // Показываем заполнитель и задаем ему размеры .head-forms
            stickyPlaceholder.style.display = 'block';
            stickyPlaceholder.style.width = `${header.offsetWidth}px`;
            stickyPlaceholder.style.height = `${header.offsetHeight}px`;
        } else {
            header.classList.remove(stickyClass);
            header.style.top = '';

            // Скрываем заполнитель
            stickyPlaceholder.style.display = 'none';
        }
    });


    /***************** Быстрое копирование ID *****************/
    // Функция для извлечения параметра из URL
    function getUrlParameter(name) {
        let params = new URLSearchParams(window.location.search);
        return params.get(name) || 'null';
    }

    // Функция для добавления .custom-shape
    function addCustomShape(afterLabelFor, customShapeId, urlParameter) {
        let label = document.querySelector(`label[for="${afterLabelFor}"]`);
        if (label) {
            let customShape = document.createElement('div');
            customShape.classList.add('custom-shape');
            customShape.id = customShapeId;
            customShape.textContent = getUrlParameter(urlParameter);
            label.parentNode.insertBefore(customShape, label.nextSibling);
        }
    }

    // Добавляем .custom-shape
    addCustomShape('Retailer', 'copyRetailerId', 'RetailerId');
    addCustomShape('Category', 'copyCategoryId', 'CategoryId');
    addCustomShape('Tag', 'copyTagId', 'TagId');

    // Функция для копирования текста в буфер обмена
    function copyTextToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Текст успешно скопирован');
        }, function(err) {
            console.error('Ошибка при копировании текста: ', err);
        });
    }

    // Обработчики клика для .custom-shape
    document.querySelectorAll('.custom-shape').forEach(function(shape) {
        shape.setAttribute('title', 'Скопировать');
        shape.addEventListener('click', function() {
            copyTextToClipboard(this.textContent);
            this.style.backgroundColor = '#81F4AF';
            setTimeout(() => this.style.backgroundColor = '', 500);
        });
    });


    /***************** Ссылки на ресурсы *****************/
    function getUrlParameter2(name) {
        let regex = new RegExp('[?&]' + name + '=([^&#]*)');
        let results = regex.exec(window.location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    function updateButtonLinks() {
        let domain = window.location.origin;
        let retailerId = getUrlParameter2('RetailerId');
        let categoryId = getUrlParameter2('CategoryId');
        let tagId = getUrlParameter2('TagId');

        let editUrl = `${domain}/Admin/Retailer/Edit/${retailerId}`;
        let dictionaryUrl = `${domain}/Admin/Retailer/EditFaceliftFrontSettings/${retailerId}`;
        let featuresUrl = `${domain}/Admin/Retailer/Configure/${retailerId}`;
        // Построение bagListUrl с учетом наличия параметров
        let bagListUrl = `${domain}/Admin/CompareBag/BagList?page=1&pageSize=20`;
        if (retailerId) {
            bagListUrl += `&retailers=${retailerId}`;
        }
        if (categoryId) {
            bagListUrl += `&categories=${categoryId}`;
        }
        if (tagId) {
            bagListUrl += `&gender=${tagId}`;
        }
        bagListUrl += `&sort=12`;

        document.getElementById('linkToEdit')?.addEventListener('click', () => window.open(editUrl, '_blank'));
        document.getElementById('linkToDictionary')?.addEventListener('click', () => window.open(dictionaryUrl, '_blank'));
        document.getElementById('linkToFeatures')?.addEventListener('click', () => window.open(featuresUrl, '_blank'));
        document.getElementById('linkToBagList')?.addEventListener('click', () => window.open(bagListUrl, '_blank'));
    }
    updateButtonLinks();


    /***************** Проверка isDisabled *****************/
    function updateChosenSingleStyles() {
        let selectElement = document.getElementById('RetailerCategoryConfiguration_Configuration_IsDisabled');
        let chosenSingles = document.querySelectorAll('.chosen-single.chosen-single-with-deselect');

        if (selectElement && chosenSingles.length > 1) {
            let secondChosenSingle = chosenSingles[1];

            if (selectElement.value === 'true') {
                secondChosenSingle.style.color = 'red';
                secondChosenSingle.style.borderColor = 'red';
            } else {
                secondChosenSingle.style.color = '';
                secondChosenSingle.style.borderColor = '';
            }
        }
    }
    document.getElementById('RetailerCategoryConfiguration_Configuration_IsDisabled')
        ?.addEventListener('change', updateChosenSingleStyles);
    updateChosenSingleStyles();


    /***************** Элементы поиска *****************/
    // Функция для создания и вставки элемента поиска
    function createAndInsertSearchInput(beforeElementId, inputId) {
        let searchInput = document.createElement('input');
        searchInput.type = 'search';
        searchInput.placeholder = 'Поиск...';
        searchInput.className = 'custom-search';
        searchInput.id = inputId;

        let beforeElement = document.getElementById(beforeElementId);
        if (beforeElement) {
            beforeElement.parentNode.insertBefore(searchInput, beforeElement);

            // Добавляем обработчик события для поиска
            searchInput.addEventListener('input', function() {
                filterListItems(beforeElement, this.value);
            });
        }
    }
    // Функция для фильтрации элементов списка
    function filterListItems(listElement, searchText) {
        let items = listElement.getElementsByTagName('li');
        for (let item of items) {
            let text = item.textContent || item.innerText;
            item.style.display = text.toLowerCase().includes(searchText.toLowerCase()) ? '' : 'none';
        }
    }
    // Создаем и вставляем инпуты
    createAndInsertSearchInput('availModes', 'searchForModes');
    createAndInsertSearchInput('availableHumanSetViews', 'searchHumanSet');
    createAndInsertSearchInput('availableHumanModels', 'searchHumanThumb');
    createAndInsertSearchInput('availableRoomViews', 'searchRoomViews');


    /***************** Мелкие фиксы *****************/
    let elementsById = ['compare-modes', 'context-modes', 'multi-context-modes'];
    let elementsByClass = ['tab-content'];
    // Добавляем стиль для элементов по ID
    elementsById.forEach(function(id) {
        let element = document.getElementById(id);
        if (element) {
            element.style.overflow = 'hidden';
        }
    });
    // Добавляем стиль для элементов по классу
    elementsByClass.forEach(function(className) {
        let elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.overflow = 'hidden';
        }
    });
    // Устанавливаем стили для элемента с id="selectedItems"
    let selectedItems = document.getElementById('selectedItems');
    if (selectedItems) {
        selectedItems.style.height = '100%';
    }

    // Находим родительский элемент с классами 'row-fluid' и 'draggable-list-wrapper'
    let parentElement = document.querySelector('.row-fluid.draggable-list-wrapper');
    if (parentElement) {
        // Находим первый дочерний элемент с классом 'span6'
        let firstSpan6 = parentElement.querySelector('.span6');

        if (firstSpan6) {
            // Применяем стили Flexbox к первому элементу 'span6'
            firstSpan6.style.display = 'flex';
            firstSpan6.style.flexDirection = 'column';
        }
    }

    // Устанавливаем стили для элемента с id="availableItems"
    let availableItems = document.getElementById('availableItems');
    if (availableItems) {
        availableItems.style.height = '500px';
        availableItems.style.overflowY = 'scroll';
        availableItems.style.flexGrow = '1';
    }


    /***************** Ссылки всем элементам LI *****************/
    let domain = window.location.origin; // Получаем текущий домен

    function createBtnLink(item, url, insertBeforeElement, additionalClass = '') {
        let link = document.createElement('a');
        link.className = 'custom-btn-link' + (additionalClass ? ' ' + additionalClass : '');
        link.href = url;
        link.target = '_blank';
        link.innerHTML = svgLink;

        if (insertBeforeElement) {
            item.insertBefore(link, insertBeforeElement);
        } else {
            item.prepend(link);
        }
    }

    // Функция для обработки context-mode-item и context-mode-item.multi
    function processContextModes() {
        document.querySelectorAll(':not(#availableHumanModels, #humanModels) > .context-mode-item, :not(#availableHumanModels, #humanModels) > .context-mode-item.multi').forEach(function(item) {
            let dataId = item.getAttribute('data-id');
            let url = item.classList.contains('multi') ?
                `${domain}/Admin/MultiContextModes/Edit/${dataId}` :
            `${domain}/Admin/ContextModes/Edit/${dataId}`;
            createBtnLink(item, url);
        });
    }

    // Функция для обработки dblclick
    function processDblClick() {
        document.querySelectorAll('.dblclick').forEach(function(item) {
            let hasCatalogItem = Array.from(item.getElementsByTagName('p')).some(p => p.textContent === 'Catalog Item');
            let url;

            if (hasCatalogItem) {
                let imgUrl = item.getAttribute('data-img');
                let idMatch = imgUrl && imgUrl.match(/\/(\d+)\//);
                let id = idMatch ? idMatch[1] : 'null';
                url = `${domain}/Admin/CompareBag/EditBag/${id}`;
            } else {
                let dataId = item.getAttribute('data-id');
                url = `${domain}/Admin/Gadget/Edit/${dataId}`;
            }

            createBtnLink(item, url);
        });
    }

    // Функция для обработки vRow
    function processVRow() {
        document.querySelectorAll('.vRow').forEach(function(item) {
            let input = item.querySelector('input[id^="ParsableLinks"][id$="__Url"]');
            let cell = item.querySelector('.vCell.w46p');
            if (input && cell) {
                let url = input.value || '#';
                createBtnLink(item, url, cell, 'custom-btn-vRow');
            }
        });
    }

    processContextModes();
    processDblClick();
    processVRow();


    /***************** Блокировка Filter Input *****************/
    let filterBox = document.getElementById('contextModesFilterBox');
    let originalId = filterBox.id; // Сохраняем оригинальный ID
    let tempId = 'tempFilterBoxId'; // Временный ID

    // Функция для изменения ID при наведении мыши на определенные элементы
    function handleHover(event) {
        const hoveredElementId = event.target.id;
        if (hoveredElementId === 'availableContextModes' || hoveredElementId === 'selectedContextModes') {
            filterBox.id = (event.type === 'mouseenter') ? tempId : originalId;
        }
    }
    // Добавляем обработчики событий на родительский элемент
    document.body.addEventListener('mouseenter', handleHover, true);
    document.body.addEventListener('mouseleave', handleHover, true);


    /***************** Логика Double Click для контекст-модов и кнопки перемещения *****************/
    function setupContextModeLogic(availableContainerId, selectedContainerId, baseInputName, moveAllButtonId, removeAllButtonId) {
        let availableContextModes = document.getElementById(availableContainerId);
        let selectedContextModes = document.getElementById(selectedContainerId);

        if (availableContextModes && selectedContextModes) {
            availableContextModes.addEventListener('dblclick', function(event) {
                let target = event.target.closest('li');
                if (target) {
                    selectedContextModes.appendChild(target);
                    createHiddenInputs(target, selectedContextModes, baseInputName);
                    updateInputIndexes(selectedContextModes);
                }
            });

            selectedContextModes.addEventListener('dblclick', function(event) {
                let target = event.target.closest('li');
                if (target) {
                    availableContextModes.appendChild(target);
                    removeAssociatedInputs(target.dataset.id, selectedContextModes);
                    updateInputIndexes(selectedContextModes);
                }
            });
        }

        let moveAllButton = document.getElementById(moveAllButtonId);
        let removeAllButton = document.getElementById(removeAllButtonId);

        if (moveAllButton) {
            moveAllButton.addEventListener('click', function() {
                let visibleItems = Array.from(availableContextModes.querySelectorAll('li')).filter(li => getComputedStyle(li).display === 'block');

                if (visibleItems.length > 15) {
                    alert("Ты пытаешься переместить больше 15 моделей. Тебе компьютер не жалко?");
                    return;
                }

                visibleItems.forEach(li => {
                    selectedContextModes.appendChild(li);
                    createHiddenInputs(li, selectedContextModes, baseInputName);
                });
                updateInputIndexes(selectedContextModes);
            });
        }

        if (removeAllButton) {
            removeAllButton.addEventListener('click', function() {
                Array.from(selectedContextModes.querySelectorAll('li')).forEach(li => {
                    availableContextModes.appendChild(li);
                    removeAssociatedInputs(li.dataset.id, selectedContextModes);
                });
                updateInputIndexes(selectedContextModes);
            });
        }
    }

    // Функция для создания скрытых инпутов
    function createHiddenInputs(li, selectedContextModes, baseInputName) {
        let index = Array.from(selectedContextModes.querySelectorAll('li')).indexOf(li);
        let dataId = li.dataset.id;

        appendHiddenInput(`${baseInputName}[${index}].Id`, dataId, 'context-mode-id', selectedContextModes);
        appendHiddenInput(`${baseInputName}[${index}].skintoneshow`, 'false', `component-props skintone-show-${dataId}`, selectedContextModes);
        appendHiddenInput(`${baseInputName}[${index}].skintoneopacity`, '1', `component-props skintone-opacity-${dataId}`, selectedContextModes);
        appendHiddenInput(`${baseInputName}[${index}].zoomshow`, 'true', `component-props zoom-show-${dataId}`, selectedContextModes);
        appendHiddenInput(`${baseInputName}[${index}].zoomopacity`, '1', `component-props zoom-opacity-${dataId}`, selectedContextModes);
        appendHiddenInput(`${baseInputName}[${index}].useforcta`, 'false', `component-props use-for-cta-${dataId}`, selectedContextModes);
    }

    // Функция для добавления индивидуального скрытого инпута
    function appendHiddenInput(name, value, className, selectedContextModes) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.className = className;
        input.name = name;
        input.value = value;
        selectedContextModes.appendChild(input);
    }

    // Функция для удаления связанных инпутов
    function removeAssociatedInputs(dataId, selectedContextModes) {
        let idInput = selectedContextModes.querySelector(`input.context-mode-id[value="${dataId}"]`);
        idInput?.remove();

        let inputs = selectedContextModes.querySelectorAll(`input[class*="${dataId}"]`);
        inputs.forEach(input => input.remove());
    }

    // Функция для обновления индексов
    function updateInputIndexes(selectedContextModes) {
        Array.from(selectedContextModes.querySelectorAll('li')).forEach((li, index) => {
            let dataId = li.dataset.id;
            let idInput = selectedContextModes.querySelector(`input.context-mode-id[value="${dataId}"]`);
            if (idInput) {
                idInput.name = idInput.name.replace(/\[\d+\]/, `[${index}]`);
            }

            let propInputs = selectedContextModes.querySelectorAll(`input[class*="component-props"][class*="${dataId}"]`);
            propInputs.forEach(input => {
                input.name = input.name.replace(/\[\d+\]/, `[${index}]`);
            });
        });
    }

    // Инициализация для контекст-модов
    setupContextModeLogic('availableContextModes', 'selectedContextModes', 'SelectedContextModeIds', 'moveAllContext', 'removeAllContext');

    // Инициализация для мульти контекст-модов
    setupContextModeLogic('availableMultiContextModes', 'selectedMultiContextModes', 'SelectedMultiContextModeIds', 'moveAllMultiContext', 'removeAllMultiContext');


    /***************** Добавление инпутов для быстрого добавления контекстов *****************/
    function addCustomContainer(targetId, inputId, buttonId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const container = document.createElement('div');
        container.className = 'custom-fast-container';
        container.innerHTML = `
            <input type="text" placeholder="Добавить id..." class="custom-search" id="${inputId}" />
            <button id="${buttonId}" type="button">${svgPlus}</button>
        `;

        targetElement.parentNode.insertBefore(container, targetElement);

        const input = container.querySelector(`#${inputId}`);
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9,\s.]/g, '').replace(/\./g, ',');
        });
    }

    // Добавляем контейнеры в два места на странице
    addCustomContainer('selectedContextModes', 'fastAddContextInput', 'fastAddContextBtn');
    addCustomContainer('selectedMultiContextModes', 'fastAddMultiContextInput', 'fastAddMultiContextBtn');


    /***************** Логика быстрого добавление контекст-модов *****************/
    function setupFastAdd(fastAddButtonId, fastAddInputId, availableContainerId, selectedContainerId, baseInputName) {
        let fastAddButton = document.getElementById(fastAddButtonId);
        let fastAddInput = document.getElementById(fastAddInputId);
        let availableContextModes = document.getElementById(availableContainerId);
        let selectedContextModes = document.getElementById(selectedContainerId);

        function handleFastAdd() {
            let ids = fastAddInput.value.split(/[\s,]+/).filter(Boolean);
            ids.forEach(id => {
                let li = availableContextModes.querySelector(`li[data-id="${id}"]`);
                if (li && getComputedStyle(li).display === 'none') {
                    li.style.display = 'block';
                }
                if (li) {
                    selectedContextModes.appendChild(li);
                    createHiddenInputs(li, selectedContextModes, baseInputName);
                }
            });
            updateInputIndexes(selectedContextModes);
        }

        if (fastAddButton && fastAddInput && availableContextModes && selectedContextModes) {
            fastAddButton.addEventListener('click', handleFastAdd);
            fastAddInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleFastAdd();
                }
            });
        }
    }

    setupFastAdd('fastAddContextBtn', 'fastAddContextInput', 'availableContextModes', 'selectedContextModes', 'SelectedContextModeIds');
    setupFastAdd('fastAddMultiContextBtn', 'fastAddMultiContextInput', 'availableMultiContextModes', 'selectedMultiContextModes', 'SelectedMultiContextModeIds');


    /***************** Кнопка для быстрого UseForCta *****************/
    let selectedContextModes = document.getElementById('selectedContextModes');
    setupModeButtons(selectedContextModes);
    let selectedMultiContextModes = document.getElementById('selectedMultiContextModes');
    setupModeButtons(selectedMultiContextModes);

    function setupModeButtons(container) {
        addUseForCtaButtons(container);
        activateButtonsBasedOnInputs(container);

        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeName === 'LI') {
                            addUseForCtaButton(node, container);
                        }
                    });
                }
            });
        });

        let config = { childList: true };
        observer.observe(container, config);
    }

    function addUseForCtaButtons(container) {
        let listItems = container.querySelectorAll('li');
        listItems.forEach(li => addUseForCtaButton(li, container));
    }

    function addUseForCtaButton(li, container) {
        let settingsBtn = li.querySelector('.complex-mode-settings-btn');
        if (settingsBtn && !li.querySelector('.useforcta-btn')) {
            let dataId = li.dataset.id;
            let useForCtaBtn = document.createElement('button');
            useForCtaBtn.className = 'useforcta-btn';
            useForCtaBtn.type = 'button';
            useForCtaBtn.innerHTML = svgUseforctaDisabled;

            useForCtaBtn.addEventListener('click', function() {
                let isActive = this.classList.contains('toggle-active');

                // Деактивируем все кнопки
                container.querySelectorAll('.useforcta-btn').forEach(btn => {
                    btn.classList.remove('toggle-active');
                    btn.innerHTML = svgUseforctaDisabled;
                });

                // Сбросить все инпуты use-for-cta на false
                container.querySelectorAll('input[name*="useforcta"]').forEach(input => input.value = 'false');

                // Переключаем состояние текущей кнопки, если она уже не активна
                if (!isActive) {
                    this.classList.add('toggle-active');
                    this.innerHTML = svgUseforctaActive;
                    updateUseForCtaInput(this, container, true);
                }
            });

            settingsBtn.parentNode.insertBefore(useForCtaBtn, settingsBtn.nextSibling);
        }
    }

    function updateUseForCtaInput(button, container, isActive) {
        let li = button.closest('li');
        let dataId = li.dataset.id;
        let input = container.querySelector(`input.component-props.use-for-cta-${dataId}`);
        if (input) {
            input.value = isActive ? 'true' : 'false';
        }
    }
    function activateButtonsBasedOnInputs(container) {
        let ctaInputs = container.querySelectorAll('input[name*="useforcta"][value="true"]');
        ctaInputs.forEach(input => {
            let matches = input.className.match(/use-for-cta-(\d+)/);
            if (matches && matches[1]) {
                let dataId = matches[1];
                let correspondingLi = container.querySelector(`li[data-id="${dataId}"]`);
                if (correspondingLi) {
                    let correspondingButton = correspondingLi.querySelector('.useforcta-btn');
                    if (correspondingButton) {
                        correspondingButton.classList.add('toggle-active');
                        correspondingButton.innerHTML = svgUseforctaActive;
                    }
                }
            }
        });
    }

    function onUseForCtaInputChange(input) {
        let dataId = input.className.match(/use-for-cta-(\d+)/)[1];
        let correspondingButton = document.querySelector(`.useforcta-btn[data-id="${dataId}"]`);

        if (input.value === 'true') {
            correspondingButton.classList.add('toggle-active');
            correspondingButton.innerHTML = svgUseforctaActive;
        } else {
            correspondingButton.classList.remove('toggle-active');
            correspondingButton.innerHTML = svgUseforctaDisabled;
        }
    }


    /***************** Быстрое перемещение Catalog/Ref Items *****************/
    // Функция для перемещения элементов Catalog
    function moveAllCatalogItems() {
        let selectedItems = document.getElementById('selectedItems');
        let availableCatalogItems = document.getElementById('availableCatalogItems');

        let maxCatalogIndex = Array.from(selectedItems.querySelectorAll('input[name^="CatalogItemsInfo["]'))
        .reduce((max, input) => {
            let match = input.name.match(/\[(\d+)\]\.OrderValue/);
            return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, -1);

        let maxOrderValue = Array.from(selectedItems.querySelectorAll('input[name$=".OrderValue"]'))
        .reduce((max, input) => Math.max(max, parseInt(input.value, 10) || 0), -1);

        let currentIndex = maxCatalogIndex + 1;

        while (availableCatalogItems.firstElementChild) {
            let listItem = availableCatalogItems.firstElementChild;
            let productId = listItem.dataset.id;

            let inputOrder = document.createElement('input');
            inputOrder.type = 'hidden';
            inputOrder.name = `CatalogItemsInfo[${currentIndex}].OrderValue`;
            inputOrder.value = maxOrderValue + 1;

            let inputProductId = document.createElement('input');
            inputProductId.type = 'hidden';
            inputProductId.name = `CatalogItemsInfo[${currentIndex}].ProductId`;
            inputProductId.value = productId;

            selectedItems.appendChild(listItem);
            selectedItems.appendChild(inputOrder);
            selectedItems.appendChild(inputProductId);

            currentIndex++;
            maxOrderValue++;
        }
    }
    // Функция для удаление элементов Catalog
    function removeAllCatalog() {
        let selectedItems = document.getElementById('selectedItems');
        let availableItems = document.getElementById('availableCatalogItems');

        Array.from(selectedItems.querySelectorAll('li')).forEach(li => {
            if (li.querySelector('p').textContent.includes('Catalog Item')) {
                let productId = li.dataset.id;

                Array.from(selectedItems.querySelectorAll(`input[name$=".ProductId"][value="${productId}"]`)).forEach(input => {
                    let orderInput = input.previousElementSibling;
                    if (orderInput && orderInput.name.includes('OrderValue')) {
                        selectedItems.removeChild(orderInput);
                    }
                    selectedItems.removeChild(input);
                });

                availableItems.appendChild(li);
            }
        });
    }
    // Функция для удаление элементов Ref
    function removeAllRef() {
        let selectedItems = document.getElementById('selectedItems');
        let availableCatalogItems = document.getElementById('availableCatalogItems');

        Array.from(selectedItems.querySelectorAll('li[data-type="Reference"]')).forEach(li => {
            let refItemId = li.dataset.id;

            Array.from(selectedItems.querySelectorAll(`input[name*="RefItemsConfigInfo"][value="${refItemId}"]`)).forEach(input => {
                let indexMatch = input.name.match(/\[(\d+)\]/);
                if (indexMatch) {
                    let index = indexMatch[1];
                    Array.from(selectedItems.querySelectorAll(`input[name^="RefItemsConfigInfo[${index}]"]`)).forEach(groupInput => {
                        selectedItems.removeChild(groupInput);
                    });
                }
            });

            availableCatalogItems.appendChild(li);
        });
    }

    // Добавление обработчиков событий
    document.getElementById('moveAllCatalog').addEventListener('click', moveAllCatalogItems);
    document.getElementById('removeAllCatalog').addEventListener('click', removeAllCatalog);
    document.getElementById('removeAllRef').addEventListener('click', removeAllRef);


    /***************** Быстрое удаление Comapre Modes *****************/
    function removeAllMode() {
        let modes = document.getElementById('modes');
        let availModes = document.getElementById('availModes');

        const excludedIds = ['Product', 'History'];
        const remainingItems = [];

        Array.from(modes.querySelectorAll('li')).forEach(li => {
            let modeId = li.dataset.id;

            if (!excludedIds.includes(modeId)) {
                // Перемещение и удаление элементов, которые не исключены
                Array.from(document.querySelectorAll(`input[type="hidden"][value="${modeId}"]`)).forEach(input => {
                    if (input.name.startsWith('CompareModes[')) {
                        input.parentNode.removeChild(input);
                    }
                });
                availModes.insertBefore(li, availModes.firstChild);
            } else {
                // Сохранение оставшихся элементов для обновления индексов
                remainingItems.push(li);
            }
        });

        // Обновление индексов для оставшихся элементов
        remainingItems.forEach((li, index) => {
            let modeId = li.dataset.id;
            Array.from(document.querySelectorAll(`input[type="hidden"][value="${modeId}"]`)).forEach(input => {
                if (input.name.startsWith('CompareModes[')) {
                    input.name = `CompareModes[${index}]`;
                }
            });
        });
    }

    // Добавление обработчика событий для кнопки
    document.getElementById('removeAllMode').addEventListener('click', removeAllMode);


    /***************** Дабл клик для Comapre Modes *****************/
    function onAvailModesDblClick(event) {
        if (event.target.tagName === 'LI') {
            let li = event.target;
            let modes = document.getElementById('modes');

            // Определяем текущий максимальный индекс
            let maxIndex = Array.from(modes.querySelectorAll('input[name^="CompareModes["]'))
            .reduce((max, input) => {
                let match = input.name.match(/\[(\d+)\]/);
                return match ? Math.max(max, parseInt(match[1], 10)) : max;
            }, -1);

            let newIndex = maxIndex + 1;

            // Перемещаем элемент li
            modes.appendChild(li);

            // Создаем связанный скрытый инпут с правильным индексом
            let hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `CompareModes[${newIndex}]`;
            hiddenInput.value = li.dataset.id; // Или другое нужное значение
            modes.appendChild(hiddenInput);
        }
    }
    function onModesDblClick(event) {
        if (event.target.tagName === 'LI') {
            let li = event.target;
            let modeId = li.dataset.id;
            let availModes = document.getElementById('availModes');

            // Перемещаем элемент li в начало списка availModes
            availModes.insertBefore(li, availModes.firstChild);

            // Удаление связанных скрытых инпутов
            Array.from(document.getElementById('modes').querySelectorAll(`input[value="${modeId}"]`)).forEach(input => {
                document.getElementById('modes').removeChild(input);
            });
        }
    }
    // Добавление обработчиков двойного клика
    document.getElementById('availModes').addEventListener('dblclick', onAvailModesDblClick);
    document.getElementById('modes').addEventListener('dblclick', onModesDblClick);


    /***************** Дабл клик для HumanSet / Human Thumbnail *****************/
    function handleDoubleClickToAdd(event, targetContainerId, hiddenInputNamePrefix) {
        if (event.target.tagName === 'LI') {
            let li = event.target;
            let targetContainer = document.getElementById(targetContainerId);

            let maxIndex = Array.from(targetContainer.querySelectorAll(`input[name^="${hiddenInputNamePrefix}["]`))
            .reduce((max, input) => {
                let match = input.name.match(/\[(\d+)\]/);
                return match ? Math.max(max, parseInt(match[1], 10)) : max;
            }, -1);

            let newIndex = maxIndex + 1;

            let hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = `${hiddenInputNamePrefix}[${newIndex}]`;
            hiddenInput.value = li.dataset.id;
            targetContainer.appendChild(hiddenInput);
            targetContainer.appendChild(li);
        }
    }

    function handleDoubleClickToRemove(event, sourceContainerId) {
        if (event.target.tagName === 'LI') {
            let li = event.target;
            let sourceContainer = document.getElementById(sourceContainerId);
            let itemId = li.dataset.id;

            Array.from(sourceContainer.querySelectorAll(`input[value="${itemId}"]`)).forEach(input => {
                sourceContainer.removeChild(input);
            });

            let availableContainerId = sourceContainerId.replace('human', 'availableHuman');
            let availableContainer = document.getElementById(availableContainerId);
            availableContainer.appendChild(li);
        }
    }

    document.getElementById('availableHumanSetViews').addEventListener('dblclick', (event) => handleDoubleClickToAdd(event, 'humanSetViews', 'HumanSetViewIds'));
    document.getElementById('humanSetViews').addEventListener('dblclick', (event) => handleDoubleClickToRemove(event, 'humanSetViews'));

    document.getElementById('availableHumanModels').addEventListener('dblclick', (event) => handleDoubleClickToAdd(event, 'humanModels', 'HumanModelsIds'));
    document.getElementById('humanModels').addEventListener('dblclick', (event) => handleDoubleClickToRemove(event, 'humanModels'));


    /***************** Быстрое перемещение HumanSet / Human Thumbnail *****************/
    function removeAllItems(sourceContainerId, availableContainerId, inputNamePrefix) {
        let sourceContainer = document.getElementById(sourceContainerId);
        let availableContainer = document.getElementById(availableContainerId);

        // Перемещаем все элементы li
        Array.from(sourceContainer.querySelectorAll('li')).forEach(li => {
            availableContainer.appendChild(li);
        });

        // Удаляем все связанные скрытые инпуты
        Array.from(sourceContainer.querySelectorAll(`input[name^="${inputNamePrefix}["]`)).forEach(input => {
            sourceContainer.removeChild(input);
        });
    }

    document.getElementById('removeAllHumanThumb').addEventListener('click', () => removeAllItems('humanModels', 'availableHumanModels', 'HumanModelsIds'));
    document.getElementById('removeAllHumanSet').addEventListener('click', () => removeAllItems('humanSetViews', 'availableHumanSetViews', 'HumanSetViewIds'));


    /***************** Подсветка Compare Mode *****************/
    function highlightSelectedModes() {
        let selectedModes = new Set();

        document.querySelectorAll('#selectedContextModes li, #selectedMultiContextModes li').forEach(li => {
            let dataName = li.getAttribute('data-name');
            let match = dataName.match(/^\[(.*?)\]/);
            if (match) {
                selectedModes.add(match[1]);
            }
        });

        document.querySelectorAll('#availModes li, #modes li').forEach(li => {
            if (selectedModes.has(li.getAttribute('data-id'))) {
                li.style.color = 'green';
            } else {
                li.style.color = ''; // Сброс цвета, если мод был удален
            }
        });
    }

    const observer = new MutationObserver(highlightSelectedModes);
    const config = { childList: true, subtree: true };

    if (selectedContextModes) {
        observer.observe(selectedContextModes, config);
    }

    if (selectedMultiContextModes) {
        observer.observe(selectedMultiContextModes, config);
    }

    // Выполняем функцию сразу для инициализации
    highlightSelectedModes();

})();
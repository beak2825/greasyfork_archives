// ==UserScript==
// @name         Better Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance dashboard appearance
// @author       Paul Braswell (Siepe)
// @match        http://manage.siepe.local/ConnectwiseTools/ServiceBoard/IT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=siepe.local
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481968/Better%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/481968/Better%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `

@keyframes flicker {
  0%, 100% { background-color: red; }
  50% { background-color: green; }
}

.christmas-lights {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 400px; /* Adjusted for larger size */
  background: url('https://yopropsdigital.com/cdn/shop/products/ChristmasLightsBlinking_530x@2x.gif?v=1574201369') repeat-x;
  background-size: auto 400px; /* Scaled to 3x the original height */
  z-index: 10000;
}





@keyframes move-and-flip {
  0% {
    left: 90%;
    transform: scaleX(1);
  }
  24% {
    left: 52%;
    transform: scaleX(1);
  }
  25% {
    left: 50%;
    transform: scaleX(1);
  }
  50% {
    left: 10%;
    transform: scaleX(1);
  }
  52% {
    left: 10%;
    transform: scaleX(-1);
  }
  73% {
    left: 47%;
    transform: scaleX(-1);
  }
  75% {
    left: 50%;
    transform: scaleX(-1);
  }
  77% {
    left: 53%;
    transform: scaleX(-1);
  }
  98% {
    left: 90%;
    transform: scaleX(-1);
  }
  100% {
    left: 90%;
    transform: scaleX(1);
  }
}

.snowflake {
    position: fixed;
    top: -10px;
    color: white;
    user-select: none;
    z-index: 9999;
    animation-name: fall;
    animation-timing-function: linear;
}

@keyframes fall {
    to {
        transform: translateY(100vh);
    }
}



.halloween-pumpkin-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://i.imgur.com/VK2dgW3.png') repeat; /* Tiled background */
    background-size: 170px 170px; /* Size of each tile */
    opacity: 0.1; /* Adjust for desired opacity */
    z-index: 9998; /* Behind the pumpkin */
}





    :root {
        --table-bg-color: #1a1a1a;
        --table-head-bg-color: #2b2b2b;
        --table-head-secondary-bg-color: #3c3c3c;
        --table-head-border-color: rgba(60, 60, 60, 0.5);
        --table-footer-border-color: #2b2b2b;
        --table-footer-cell-border-color: rgba(60, 60, 60, 0.5);
        --table-footer-bg-color: #2b2b2b;
        --table-head-color: #4d4d4d;
        --table-striped-row-color: #1a1a1a;
        --table-striped-alt-row-color: #121212;
        --table-striped-alt-row-hover-color: #0a0a0a;
        --table-border-color: #2b2b2b;
        --table-borderless-border-color: #2b2b2b;
        --table-borderless-bg-color: transparent;
        --table-foot-bg-color: transparent;
        --table-danger-bg-color: #2b1a1a;
        --table-danger-color: #3c3c3c;
        --table-warning-bg-color: #2b2b1a;
        --table-warning-color: #3c3c3c;
        --table-column-filter-color: #4d4d4d;
        --table-column-filter-active-color: #5e5e5e;
        --col-filter-active-bg-color: rgba(60, 60, 60, 0.15);
        --col-filter-active-color: #5e5e5e;
        --table-grouping-row-bg-color: #0a0a0a;
        --table-pager-border-color: rgba(60, 60, 60, 0.5);
        --cell-selected-bg-color: #3c3c3c;
        --cell-selected-border-color: #4d4d4d;
        --grid-toolbar-button-color: #4d4d4d;
        --grid-toolbar-button-bg-color: #1a1a1a;
        --grid-toolbar-border-color: #4d4d4d;
        --row-selected-bg-color: #3c3c3c;
        --empty-grid-bg-color: #3c3c3c;
        --empty-grid-border-color: rgba(77, 77, 77, 0.5);
        --empty-grid-color: #4d4d4d;
        --ag-column-resize-handle-color: #4d4d4d;
        --modal-header-color: #4d4d4d;
        --modal-header-border-color: #3c3c3c;
        --modal-header-bg-color: #1a1a1a;
        --modal-footer-bg-color: #121212;
        --modal-footer-border-color: #2b2b2b;
        --modal-content-bg-color: #1a1a1a;
        --modal-body-bg-color: #1a1a1a;
        --modal-close-btn-color: #4d4d4d;
        --modal-drop-shadow: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
        --modal-dialog-content-bg-color: #1a1a1a;
        --modal-dialog-body-bg-color: #1a1a1a;
        --modal-dialog-footer-bg-color: #1a1a1a;
        --modal-scroller-bg-color: rgba(60, 60, 60, 0.75);
        --tab-bg-color: transparent;
        --tab-color: #4d4d4d;
        --tab-border-color: #4d4d4d;
        --tab-active-color: #5e5e5e;
        --tab-active-border-color: #5e5e5e;
        --tab-active-bg-color: transparent;
        --tab-content-bg-color: transparent;
        --tab-dropdown-bg-color: #1a1a1a;
        --tab-dropdown-color: #3c3c3c;
        --tab-dropdown-hover-color: #4d4d4d;
        --tab-dropdown-hover-bg-color: #5e5e5e;
        --tab-modal-body-bg-color: #3c3c3c;
        --tab-modal-content-bg-color: transparent;
        --tab-hover-bg-color: #3c3c3c;
        --tab-dropdown-active-bg-color: #3c3c3c;
        --tab-dropdown-active-check-color: #5e5e5e;
        --panel-heading-bg-color: #1a1a1a;
        --panel-heading-color: #3c3c3c;
        --panel-footer-bg-color: #1a1a1a;
        --panel-footer-color: #2b2b2b;
        --panel-body-bg-color: #121212;
        --panel-bg-color: #121212;
        --panel-border-color: #1a1a1a;
        --list-panel-heading-bg-color: #1a1a1a;
        --list-panel-heading-color: #2b2b2b;
        --list-panel-item-bg-color: #121212;
        --list-panel-bg-color: #121212;
        --list-panel-item-color: #2b2b2b;
        --list-panel-border-color: #1a1a1a;
        --list-panel-drop-shadow: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.4));
        --list-panel-item-hover-bg-color: #0a0a0a;
        --panel-link-color: #2b2b2b;
        --panel-badge-primary-bg-color: #1a1a1a;
        --panel-badge-primary-hover-bg-color: #1a1a1a;
        --panel-link-hover-box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.4), 0 8px 10px 1px rgba(0, 0, 0, 0.3), 0 3px 14px 2px rgba(0, 0, 0, 0.2);
        --panel-empty-bg-color: #1a1a1a;
        --panel-empty-border-color: rgba(0, 0, 0, 0.5);
        --panel-empty-color: #2b2b2b;
        --panel-list-heading-bg-color: #1a1a1a;
        --pager-btn-bg-color: transparent;
        --pager-btn-border-color: #1a1a1a;
        --pager-btn-color: rgba(60, 60, 60, 0.75);
        --pager-btn-active-color: #2b2b2b;
        --pager-btn-active-bg-color: rgba(0, 0, 0, 0.25);
        --pager-btn-active-border-color: rgba(0, 0, 0, 0.75);
        --pager-btn-arrow-color: #2b2b2b;
        --pager-btn-arrow-bg-color: transparent;
        --pager-btn-hover-color: rgba(60, 60, 60, 0.75);
        --pager-btn-hover-bg-color: rgba(0, 0, 0, 0.1);
        --pager-btn-hover-border-color: rgba(0, 0, 0, 0.25);
        --pager-dropdown-border-color: rgba(0, 0, 0, 0.5);
        --pager-dropdown-active-border-color: rgba(0, 0, 0, 0.75);
        --pager-dropdown-color: #2b2b2b;
        --pager-dropdown-bg-color: #1a1a1a;
        --scroller-bg-color: #121212;
        --scroller-fg-color: #292929;
    }

    * {
        color: white !important;
    }


    .text-danger {
    color: red !important;
}

    .text-success {
    color: limegreen !important;
}
/*
    .halloween-pumpkin {
    position: fixed;
    top: 33%;
    left: 5%;
    width: 170px;
    height: 170px;
    background: url('https://i.imgur.com/MzLs30I.png') no-repeat center center;
    background-size: contain;
    z-index: 9999;
    }
*/
    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    html, body {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    body {
            background-color: black !important;
    }

        .special-gif {
            position: fixed;
            top: 73%;
            left: 90%;
            width: 178px;
            height: 100px;
            background: url('https://i.imgur.com/3Md5nLX.gif') no-repeat center center;
            background-size: contain;
            z-index: 9999;
            animation: move-and-flip 30s linear infinite;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const pumpkin = document.createElement('div');
    pumpkin.className = 'halloween-pumpkin';
    document.body.appendChild(pumpkin);

    const gifElement = document.createElement('div');
    gifElement.className = 'special-gif';
    document.body.appendChild(gifElement);

    const pumpkinBackground = document.createElement('div');
    pumpkinBackground.className = 'halloween-pumpkin-background';
    document.body.appendChild(pumpkinBackground);

    const christmasLights = document.createElement('div');
christmasLights.className = 'christmas-lights';
document.body.appendChild(christmasLights);

    function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

setInterval(createSnowflake, 100);


})();
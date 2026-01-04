// ==UserScript==
// @name         ValueEdge: Highlight save button when unsaved changes exist
// @namespace    https://github.com/ahr-huber/monkey-scripts/
// @version      2025-03-28
// @description  In ValueEdge you have to manually save changes. This script reminds you by highlighting the save button when there are unsaved changes.
// @license      MIT
// @author       Andreas Huber
// @match        https://*.saas.microfocus.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBzuIOmRodbGLijiWKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEXXBSdJES/5cUWsR4cNyPd/ced+8AoVllqtkTA1TNMtKJuJjLr4qBV/gxigAimJCYqSczi1l4jq97+Ph6F+VZ3uf+HANKwWSATySOMd2wiDeIZzctnfM+cYiVJYX4nHjSoAsSP3JddvmNc8lhgWeGjGx6njhELJa6WO5iVjZU4hnisKJqlC/kXFY4b3FWq3XWvid/YbCgrWS4TnMMCSwhiRREyKijgiosRGnVSDGRpv24h3/E8afIJZOrAkaOBdSgQnL84H/wu1uzOD3lJgXjQO+LbX9EgMAu0GrY9vexbbdOAP8zcKV1/LUmMPdJeqOjhY+AwW3g4rqjyXvA5Q4w/KRLhuRIfppCsQi8n9E35YGhW6B/ze2tvY/TByBLXS3fAAeHwHiJstc93t3X3du/Z9r9/QDakHLQl3fAPwAAAAZiS0dEAO8A7wDvwcyDBQAAAAlwSFlzAAAN1wAADdcBQiibeAAAActJREFUOMutk8trU1EQxn8zuUnqq6Du1I1ulCwtguCj6W3xH5Do0p2iIsabEJdpuxKrtKU7RcxKXLhzIaKGQgPiQnwuhFisLlqEiqGtkOccF7U18UZQdGAOHL7zfcOc+Qb+MaTjlhqO6ZelUTMpIBwF+wxUEDlAxLujrUbWiuNBOyXSIbDtYK/TepnIhgpam8Pz5mjZPOJ9pLVx3ml9lp39xqdSdY3itfM1Vpu0hlzWWC1jjydzbVAFgHz+vZaWbxucCjczmLlIMt8DwLHsbvwg1bXpQ7kt+MHZ9aI/lBXHC/qpA1BvfsWsTD6vIYFqpYqz12vY6lFamcJzHxgZMQCmJyqI7mBm+UxI4PmNBrhFnVm5ujqFocxhTBcojs2GHidzu4g0T+CIdm3HyUvF2Ce0boXAvtNR0eZDNRIKW7sliAepVET8S68YCI53CPhBWgYyj/7MSH7WF+ymizcSPJiqMXh+u7h4WXAFc/ouzLIFiuP3f06heK2I8IZaNA2gLj4MvEXYpGp9vybI/rCVh9J7xPSZQ08KdteZJJi+vvhXu6B+MObggjjuWcQK4V/nG08mnv5+mZLnNqv0XHHI3u7lbMkd6U2t++V/xHcXZav/DXBUYwAAAABJRU5ErkJggg==
// @grant        none
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/531143/ValueEdge%3A%20Highlight%20save%20button%20when%20unsaved%20changes%20exist.user.js
// @updateURL https://update.greasyfork.org/scripts/531143/ValueEdge%3A%20Highlight%20save%20button%20when%20unsaved%20changes%20exist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cssFix_saveButton() {
         const style = document.createElement("style");
        style.textContent = `
        button[icon="save"]:enabled::after {
            content: "";
            box-shadow: 0px 0px 8px 8px red;
            width: 0;
            display: block;
            height: 0;
            position: relative;
            animation: wobble 1 3s;
            animation-iteration-count: 3
        }
        @keyframes wobble {
            25%,
            75% {
                box-shadow: 0px 0px 8px 8px rgb(245 3 3);
            }

            50% {
                box-shadow: 0px 0px 2px 2px rgb(245 3 3);
            }
        }
        `;
        document.body.appendChild(style);
    }

    cssFix_saveButton(); // add visual hint that there are unsaved changes
})();
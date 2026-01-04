// ==UserScript==
// @name         ValueEdge: Add Plain Link
// @namespace    https://github.com/ahr-huber/monkey-scripts/
// @version      2025-11-03
// @description  Adds a plain <a> tag to the link popup.
// @license      MIT
// @author       Andreas Huber
// @match        https://*.saas.microfocus.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBzuIOmRodbGLijiWKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEXXBSdJES/5cUWsR4cNyPd/ced+8AoVllqtkTA1TNMtKJuJjLr4qBV/gxigAimJCYqSczi1l4jq97+Ph6F+VZ3uf+HANKwWSATySOMd2wiDeIZzctnfM+cYiVJYX4nHjSoAsSP3JddvmNc8lhgWeGjGx6njhELJa6WO5iVjZU4hnisKJqlC/kXFY4b3FWq3XWvid/YbCgrWS4TnMMCSwhiRREyKijgiosRGnVSDGRpv24h3/E8afIJZOrAkaOBdSgQnL84H/wu1uzOD3lJgXjQO+LbX9EgMAu0GrY9vexbbdOAP8zcKV1/LUmMPdJeqOjhY+AwW3g4rqjyXvA5Q4w/KRLhuRIfppCsQi8n9E35YGhW6B/ze2tvY/TByBLXS3fAAeHwHiJstc93t3X3du/Z9r9/QDakHLQl3fAPwAAAAZiS0dEAO8A7wDvwcyDBQAAAAlwSFlzAAAN1wAADdcBQiibeAAAActJREFUOMutk8trU1EQxn8zuUnqq6Du1I1ulCwtguCj6W3xH5Do0p2iIsabEJdpuxKrtKU7RcxKXLhzIaKGQgPiQnwuhFisLlqEiqGtkOccF7U18UZQdGAOHL7zfcOc+Qb+MaTjlhqO6ZelUTMpIBwF+wxUEDlAxLujrUbWiuNBOyXSIbDtYK/TepnIhgpam8Pz5mjZPOJ9pLVx3ml9lp39xqdSdY3itfM1Vpu0hlzWWC1jjydzbVAFgHz+vZaWbxucCjczmLlIMt8DwLHsbvwg1bXpQ7kt+MHZ9aI/lBXHC/qpA1BvfsWsTD6vIYFqpYqz12vY6lFamcJzHxgZMQCmJyqI7mBm+UxI4PmNBrhFnVm5ujqFocxhTBcojs2GHidzu4g0T+CIdm3HyUvF2Ce0boXAvtNR0eZDNRIKW7sliAepVET8S68YCI53CPhBWgYyj/7MSH7WF+ymizcSPJiqMXh+u7h4WXAFc/ouzLIFiuP3f06heK2I8IZaNA2gLj4MvEXYpGp9vybI/rCVh9J7xPSZQ08KdteZJJi+vvhXu6B+MObggjjuWcQK4V/nG08mnv5+mZLnNqv0XHHI3u7lbMkd6U2t++V/xHcXZav/DXBUYwAAAABJRU5ErkJggg==
// @grant        none
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/531056/ValueEdge%3A%20Add%20Plain%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/531056/ValueEdge%3A%20Add%20Plain%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openLinkInNewWindow(){
        const description = document.querySelector(".fr-wrapper");
        if(description != null) {
            const links = document.querySelectorAll(".fr-wrapper a");
            links.forEach((link) =>{
                if (link.getAttribute("data-tamper-plainlink") !== "true") {
                    link.addEventListener("click", () =>{
                        document.querySelectorAll(".fr-buttons a").forEach(a => a.remove());
                        _addPlainLinkToButtons(link.getAttribute("href"));
                    });
                    link.setAttribute("data-tamper-plainlink", "true");
                }
            });
        }
    }

    function _addPlainLinkToButtons(href) {
        const buttons = document.querySelector(".fr-buttons");
        if (buttons == null) {
            window.setTimeout(()=>{_addPlainLinkToButtons(href)}, 50);
        }else{
            document.querySelector(".fr-buttons").style="display:flex; align-items: center;"
            const a = document.createElement("a");
            a.textContent = "plain";
            a.setAttribute("href", href);
            a.setAttribute("title", href);
            a.addEventListener("mouseup", (e) => {
                if (e.buttons[1]){
                    document.querySelector(".fr-popup.fr-active").classList.remove("fr-active"); // close popup
                }
            });
            document.querySelector(".fr-buttons").appendChild(a);
        }
    }

     window.setInterval(()=>{
         openLinkInNewWindow();
     }, 500);

})();

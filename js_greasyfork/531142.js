// ==UserScript==
// @name         ValueEdge: Show images in original size
// @namespace    https://github.com/ahr-huber/monkey-scripts/
// @version      2025-03-28
// @description  Images in descriptions cannot be viewed in original size. This script adds an overlay that does exactly that.
// @license      MIT
// @author       Andreas Huber
// @match        https://*.saas.microfocus.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpSIVBzuIOmRodbGLijiWKhbBQmkrtOpgcukXNGlIUlwcBdeCgx+LVQcXZ10dXAVB8APEXXBSdJES/5cUWsR4cNyPd/ced+8AoVllqtkTA1TNMtKJuJjLr4qBV/gxigAimJCYqSczi1l4jq97+Ph6F+VZ3uf+HANKwWSATySOMd2wiDeIZzctnfM+cYiVJYX4nHjSoAsSP3JddvmNc8lhgWeGjGx6njhELJa6WO5iVjZU4hnisKJqlC/kXFY4b3FWq3XWvid/YbCgrWS4TnMMCSwhiRREyKijgiosRGnVSDGRpv24h3/E8afIJZOrAkaOBdSgQnL84H/wu1uzOD3lJgXjQO+LbX9EgMAu0GrY9vexbbdOAP8zcKV1/LUmMPdJeqOjhY+AwW3g4rqjyXvA5Q4w/KRLhuRIfppCsQi8n9E35YGhW6B/ze2tvY/TByBLXS3fAAeHwHiJstc93t3X3du/Z9r9/QDakHLQl3fAPwAAAAZiS0dEAO8A7wDvwcyDBQAAAAlwSFlzAAAN1wAADdcBQiibeAAAActJREFUOMutk8trU1EQxn8zuUnqq6Du1I1ulCwtguCj6W3xH5Do0p2iIsabEJdpuxKrtKU7RcxKXLhzIaKGQgPiQnwuhFisLlqEiqGtkOccF7U18UZQdGAOHL7zfcOc+Qb+MaTjlhqO6ZelUTMpIBwF+wxUEDlAxLujrUbWiuNBOyXSIbDtYK/TepnIhgpam8Pz5mjZPOJ9pLVx3ml9lp39xqdSdY3itfM1Vpu0hlzWWC1jjydzbVAFgHz+vZaWbxucCjczmLlIMt8DwLHsbvwg1bXpQ7kt+MHZ9aI/lBXHC/qpA1BvfsWsTD6vIYFqpYqz12vY6lFamcJzHxgZMQCmJyqI7mBm+UxI4PmNBrhFnVm5ujqFocxhTBcojs2GHidzu4g0T+CIdm3HyUvF2Ce0boXAvtNR0eZDNRIKW7sliAepVET8S68YCI53CPhBWgYyj/7MSH7WF+ymizcSPJiqMXh+u7h4WXAFc/ouzLIFiuP3f06heK2I8IZaNA2gLj4MvEXYpGp9vybI/rCVh9J7xPSZQ08KdteZJJi+vvhXu6B+MObggjjuWcQK4V/nG08mnv5+mZLnNqv0XHHI3u7lbMkd6U2t++V/xHcXZav/DXBUYwAAAABJRU5ErkJggg==
// @grant        none
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/531142/ValueEdge%3A%20Show%20images%20in%20original%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/531142/ValueEdge%3A%20Show%20images%20in%20original%20size.meta.js
// ==/UserScript==

(function() {
    'use strict';

   function imageEnlarge() {
        const style = document.createElement("style");
        style.textContent = `
            .largeImgContainer {
                background-color: #000000db;
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                overflow: scroll;

                img {
                 max-width: 98vw;/**/
                 max-height: 98vh;/**/
                }
                button.close{
                   position:fixed;
                   top:0;
                   right:3em;
                   color: black;
                   font-weight: bold;
                   background: white;
                   border:none;
                   width: 2em;
                   height: 2em;
                   border-radius: 50%;

                }
            }
        `;
        document.body.appendChild(style);
        imageEnlargeInternal();
    }

    function imageEnlargeInternal(){
        const images = document.querySelectorAll(".fr-wrapper img");
        if(images.length == 0){
            window.setTimeout(()=>{imageEnlargeInternal()}, 500);
        }else{
            images.forEach(img => {
                console.log("enlarger for" , img);
                const btnEnlarge = document.createElement("button");
                btnEnlarge.textContent = "⊕";

                img.addEventListener("click", (e) => {
                    e.preventDefault();
                    const largeImgContainer = document.createElement("div");
                    largeImgContainer.classList.add("largeImgContainer");

                    const largeImg = document.createElement("img");
                    largeImg.setAttribute("src", img.getAttribute("src"));
                    largeImgContainer.appendChild(largeImg);

                    const closeButton = document.createElement("button");
                    closeButton.textContent = "X";
                    closeButton.addEventListener("click", () => {largeImgContainer.remove()});
                    closeButton.classList.add("close");
                    largeImgContainer.appendChild(closeButton);

                    document.body.appendChild(largeImgContainer);
                });

            });
        }
    }

    imageEnlarge(); // add click handler to show images in original size
})();

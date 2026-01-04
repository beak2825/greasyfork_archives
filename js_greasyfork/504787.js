// ==UserScript==
// @name         BlockSleuth
// @namespace    http://tampermonkey.net/
// @version      2024-08-23
// @description  PDF or SVG export function for any charts
// @author       Greater Empire
// @match        https://metasleuth.io/result*
// @icon         https://assets.blocksec.com/image/1691494672404-2.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504787/BlockSleuth.user.js
// @updateURL https://update.greasyfork.org/scripts/504787/BlockSleuth.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let GRAPH_AREA = "index_graphContainer__*", GRAPH_AREA_ID = "graphId", DOWNL_VIDEO_BTN_HTML_CLASS_STR = `hishtnikDownlVidBtn`, DOWNL_PHOTO_BTN_HTML_CLASS_STR = `hishtnikDownlPhotoBtn`, DOWNL_THUMB_BTN_HTML_CLASS_STR = `hishtnikDownlThumbBtn`, OPEN_THUMB_BTN_HTML_CLASS_STR = `hishtnikOpenThumbBtn`;
    let POST_MEDIA_ELEMS_CSS_SELECTOR_STR = `video, div[role="button"] img[style="object-fit: cover;"]`, POST_OP_USERNAME_CSS_SELECTOR_STR = `.UE9AK .Jv7Aj.mArmR.MqpiF`;
    let STYLE_HTML_STR =
        `<style>
            .CzVzU > div, ._aatp > div {padding: 5px !important;}
            .CzVzU > div, ._aatp > div, button[aria-label="Go Back"], button[aria-label="Next"] {background: #951111 !important; border: 2px solid #979085 !important;}
        </style`;

    let SAVED_VIDEO_DOWNL_LINKS_OBJ = {}, MAX_SAVED_VIDEO_LINKS_INT = 100;


    function captureHtml() {
        const parentElement = document.getElementById('graphId');
        if (parentElement) {


            const precloneel = parentElement.firstElementChild;

            const firstChild = precloneel.cloneNode(true);

            // Do something with the first child element
            //console.log(firstChild);
            // Create a rectangle for the background
            const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            background.setAttribute("x", "0");
            background.setAttribute("y", "0");
            background.setAttribute("width", "100%");
            background.setAttribute("height", "100%");
            background.setAttribute("fill", "black");

            // Append the background rectangle to the SVG
            firstChild.insertBefore(background, firstChild.firstChild);

            return firstChild.outerHTML;
        } else {
            console.error('Element with id "graphId" not found');
            return null;
        }
    }
    function download_internal(svgContent){

        // Create a Blob from the SVG content
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'jectout.svg';

        // Append link to the body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link after downloading
        document.body.removeChild(link);
    }
    function init(){

        const container = document.querySelector('[class*="index_controlLeft"]');
        if (!container) {
            console.error('Element with id "graphId" not found');
            return;
        }

        // Create the div element
        const div = document.createElement('button');
        div.className = 'ant-btn ant-btn-default index_btn__bYgq7 index_fl__UYWQB';
        div.textContent = 'Export SVG';

        // Create the inner <i> element
        const icon = document.createElement('i');
        icon.className = 'icon-rect iconfont';
        icon.textContent = 'Export SVG';

        // Append the <i> element to the div
        //div.appendChild(icon);

        // Set the onclick function
        div.onclick = function(){
            const htmlCode = captureHtml();
            if (htmlCode) {
                console.log(htmlCode);

                download_internal(htmlCode);
            }

        };



        container.appendChild(div);
        console.log("plugin for block Sleuth is. online");


    }


    init();



})();
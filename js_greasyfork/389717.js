// ==UserScript==
// @name         Oh My Rockness Spotify Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Kent Widman
// @match        https://www.ohmyrockness.com
// @match        https://www.ohmyrockness.com/shows/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389717/Oh%20My%20Rockness%20Spotify%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/389717/Oh%20My%20Rockness%20Spotify%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //debugger;

    const svg = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI2MHB4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2MCA2MCIgd2lkdGg9IjYwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6c2tldGNoPSJodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2gvbnMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48dGl0bGUvPjxkZWZzLz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGlkPSJnbG9zcyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxnIGlkPSJTcG90aWZ5Ij48cGF0aCBkPSJNMzAsNjAgQzQ2LjU2ODU0MzMsNjAgNjAsNDYuNTY4NTQzMyA2MCwzMCBDNjAsMTMuNDMxNDU2NyA0Ni41Njg1NDMzLDAgMzAsMCBDMTMuNDMxNDU2NywwIDAsMTMuNDMxNDU2NyAwLDMwIEMwLDQ2LjU2ODU0MzMgMTMuNDMxNDU2Nyw2MCAzMCw2MCBaIiBmaWxsPSIjNTdCQjYzIi8+PHBhdGggZD0iTTUxLjIxMzIwMzcsOC43ODY3OTYyNiBDNTYuNjQyMTM1OCwxNC4yMTU3MjgzIDYwLDIxLjcxNTcyODMgNjAsMzAgQzYwLDQ2LjU2ODU0MzMgNDYuNTY4NTQzMyw2MCAzMCw2MCBDMjEuNzE1NzI4Myw2MCAxNC4yMTU3MjgzLDU2LjY0MjEzNTggOC43ODY3OTYyNiw1MS4yMTMyMDM3IEw1MS4yMTMyMDM3LDguNzg2Nzk2MjYgWiIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjQwMDAwMDAwNiIgaWQ9InNwb3RpZnkiLz48cGF0aCBkPSJNMzguNjc2MTUyLDQxLjUzNzczODYgQzM4LjQ1OTI5NTQsNDEuNTMxMzc3IDM4LjI0MzEzMzksNDEuNDY3MDUzNyAzOC4wNDcxMjg5LDQxLjM0MzM1NSBDMzguMDQ1MDQzOCw0MS4zNDMzNTUgMzcuNzk0MTI5Niw0MS4xODE0ODY1IDM3LjI3OTA5NTIsNDAuOTAwODY3MiBDMzYuNzYzMzY1Nyw0MC42MTk1NDExIDM2LjAwMzY3MjYsNDAuMjMyMTg3NSAzNS4wNTcwMTAxLDM5LjgyNTc0OSBDMzMuMTY1NzcwNCwzOS4wMDcyMTczIDMwLjUxODMxMjksMzguMTAxMDM2MSAyNy41NTk0NzE1LDM3Ljc1MzI2NjIgQzI2LjY1MTAzNywzNy42NDcyMzg3IDI1Ljc3NjY2MDEsMzcuNTgyMjA4NiAyNC45NDA1MTExLDM3LjU1NDY0MTQgQzIxLjE4MDI3MzQsMzcuNDI4ODIyMiAxOC4yMjQ5MDczLDM3Ljk5NzgzNjEgMTcuMDIwMzgwMiwzOC4yNzkxNjIyIEMxNi42MTcyNDkzLDM4LjM3MzE3MzIgMTYuNDMxNjcwMSwzOC40MzA0MjggMTYuNDMwOTc1MSwzOC40MzA0MjggQzE1Ljc2MDI0ODgsMzguNjMwNDY2NCAxNS4wNTgyNDUsMzguMjM4MTY1IDE0Ljg2MDg0OTksMzcuNTU2NzYyIEMxNC42NjU1NCwzNi44NzM5NDUzIDE1LjA0OTIwOTQsMzYuMTU4NjEzNiAxNS43MTkyNDA2LDM1Ljk1OTI4MiBDMTUuODA0NzMyMiwzNS45MzQ1NDIzIDE5LjYxNzA5ODgsMzQuODA0Mjg5OSAyNS4wMjA0NDIyLDM0Ljk4MTcwOTEgQzI1LjkyMTIzMTIsMzUuMDEyODEwNSAyNi44Njg1ODg3LDM1LjA4MTM3NDkgMjcuODQ3MjIzNSwzNS4xOTY1OTE0IEMzNC40MTIwMDA4LDM1Ljk3NzY2MDEgMzkuMjk4MjI0NiwzOS4xMTI1Mzc4IDM5LjM4ODU4MTUsMzkuMTU5ODk2OCBDMzkuOTgyMTU3LDM5LjUzODA2MTMgNDAuMTYxNDgwNyw0MC4zMzI1NjAyIDM5Ljc5MDMyMjMsNDAuOTM0MDg5MSBDMzkuNTQ0MjczNSw0MS4zMzg0MDcxIDM5LjExMjY0NTQsNDEuNTUyNTgyNSAzOC42NzYxNTIsNDEuNTM3NzM4NiBaIE00My4yNzg3OTQyLDMzLjk0Njg4MTQgQzQyLjk2ODgwMDUsMzQuNDQ5NDUxNCA0Mi40MzA4MjkzLDM0LjcxOTQ2NzkgNDEuODg1MjEyNiwzNC43MDAzODMgQzQxLjYxNDE0MTgsMzQuNjkxMTkzOSA0MS4zNDM3NjYxLDM0LjYxMDYxMzEgNDEuMDk5MTA3NCwzNC40NTUxMDYyIEM0MS4wOTc3MTczLDM0LjQ1NzIyNjcgNDEuMDQyMTEzMSwzNC40MTgzNSA0MC44OTI2NzY2LDM0LjMyOTk5MzggQzQwLjc0MTg1MDEsMzQuMjQwOTMwOCA0MC41MTUyNjI3LDM0LjExMDE2MzYgNDAuMjIwNTYwMiwzMy45NDk3MDg4IEMzOS42MjY5ODQ4LDMzLjYyNTk3MTcgMzguNzU2Nzc4MiwzMy4xODA2NTY0IDM3LjY2NjIzOTgsMzIuNzEwNjAxNSBDMzUuNDkwNzIzMywzMS43Njk3ODQ3IDMyLjQ0NTY5NTQsMzAuNzMwNzE1OSAyOS4wNDQxMDUxLDMwLjMzMjA1MjggQzI4LjAwMjkxNTQsMzAuMjA5MDYwOSAyNi45OTU3ODM0LDMwLjEzNjI1NTQgMjYuMDMzMTM0NywzMC4xMDQ0NDcyIEMyMS43MDY0Mjg3LDI5Ljk1ODgzNjIgMTguMzA1NTMzNSwzMC42MTI2NzIgMTYuOTIzMDcyNywzMC45MzY0MDkxIEMxNi40NjE1NTc0LDMxLjA0NTI2NCAxNi4yNTIzNDY0LDMxLjEwNzQ2NjcgMTYuMjUwOTU2MywzMS4xMDk1ODczIEMxNS40MTM0MTcyLDMxLjM1Njk4NDYgMTQuNTMzNDc5OSwzMC44Njc4NDQ3IDE0LjI4ODgyMTIsMzAuMDE0Njc3MyBDMTQuMDQyNzcyNCwyOS4xNjA4MDMxIDE0LjUyMzA1NDEsMjguMjY2NjM4NCAxNS4zNjI2NzgzLDI4LjAyMDY1NDggQzE1LjQ2OTAyMTUsMjcuOTg3NDMyOCAxOS44ODEyMTkxLDI2LjY4MDQ2OCAyNi4xMzUzMDc1LDI2Ljg4ODI4MTggQzI3LjE3Nzg4NzMsMjYuOTIyOTE3NCAyOC4yNzE5MDEsMjcuMDAwNjcwOSAyOS40MDU1MzI4LDI3LjEzNDk3MjMgQzM3LjAxMjE5NDcsMjguMDQxMTUzNCA0Mi42NjcxNDc0LDMxLjY2NTE3MSA0Mi43Nzk3NDYsMzEuNzI5NDk0MyBDNDMuNTE4NTg3NSwzMi4yMDMwODM1IDQzLjc0Mzc4NDgsMzMuMTk0NzkzNCA0My4yNzg3OTQyLDMzLjk0Njg4MTQgWiBNNDcuMDE4MTgwMywyNi44NjM1NDIgQzQ2LjY0NDkzNjcsMjcuNDY3MTkxNiA0NS45OTcxNDcyLDI3Ljc4OTUxNSA0NS4zNDQ0OTIyLDI3Ljc2NzYwMjYgQzQ1LjAyMTI5MjUsMjcuNzU2OTk5OSA0NC42OTUzMTI2LDI3LjY2MTU3NTIgNDQuNDAyNjk1MiwyNy40NzM1NTMyIEM0NC40MDI2OTUyLDI3LjQ3MzU1MzIgNDQuMzM0NTgsMjcuNDI5NzI4NSA0NC4xNTgwMzY1LDI3LjMyNDQwNzkgQzQzLjk4Mjg4MzEsMjcuMjIxMjA3OSA0My43MTY2Nzc3LDI3LjA2NjQwNzkgNDMuMzY2MzcwOSwyNi44NzU1NTg1IEM0Mi42Njg1Mzc1LDI2LjQ5NzM5NCA0MS42NDE5NDM5LDI1Ljk3MzYxODUgNDAuMzU3NDg1NywyNS40MTgwMzQ3IEMzNy43OTI3Mzk0LDI0LjMxMDQwMTUgMzQuMjA1NTcsMjMuMDg0MDE3NSAzMC4xOTk5Nzg1LDIyLjYxMzk2MjYgQzI4Ljk3MTEyNDUsMjIuNDY5NzY1MyAyNy43ODMyNzg2LDIyLjM4NDk0MzMgMjYuNjUwMzQyLDIyLjM0ODE4NzEgQzIwLjcwMjc3MTksMjIuMTQ2MDI4MiAxNi4yNDA1MzA1LDIzLjIyNjgwMTEgMTUuMzA0MjkzOSwyMy40NzkxNDY0IEMxNS4xNzA4NDM3LDIzLjUxNDQ4ODkgMTUuMTIzNTgsMjMuNTI4NjI1OSAxNS4xMjM1OCwyMy41Mjg2MjU5IEMxNC4xMTc4MzgxLDIzLjgyNzYyMzIgMTMuMDY0MTM3NSwyMy4yMzk1MjQ0IDEyLjc2OTQzNDksMjIuMjE3NDIgQzEyLjQ3NDczMjQsMjEuMTkzOTAxOCAxMy4wNTAyMzY0LDIwLjEyMDE5NzQgMTQuMDU4MDYzNSwxOS44MjEyIEMxNC4xODU5NTMzLDE5Ljc4NTg1NzUgMTkuMzkzMjkxNywxOC4yNDIwOTgxIDI2Ljc3NDA2MTQsMTguNDg4MDgxOCBDMjguMDA1MDAwNiwxOC41MjgzNzIyIDI5LjI5NTAxOTMsMTguNjE4ODQ4OSAzMC42MzI5OTY3LDE4Ljc3NzE4MzIgQzM5LjYxNDQ3MzgsMTkuODQ4MDYwMyA0Ni4yODIxMTksMjQuMTIzNzkzMiA0Ni40MTc2NTQzLDI0LjIwMDgzOTggQzQ3LjMwNTIzNzIsMjQuNzY2MzE5NCA0Ny41NzQyMjI4LDI1Ljk2MDE4ODMgNDcuMDE4MTgwMywyNi44NjM1NDIgWiIgZmlsbD0iI0ZGRkZGRiIvPjwvZz48L2c+PC9zdmc+';
    var observerPage = null;

    // modifyPushState
    function modifyPushState() {
        var pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(history, arguments);
            // todo fix this
            setTimeout(function(){
                //connectCbserver();
                addLinkToBand(document.body)
            }, 1000);
            // fireEvents('pushState', arguments);  // Some event-handling function
        };
    }

    // helper
    function insertAfter(el, referenceNode) {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }

    function addLinkToBand(target) {
        let bands = target.querySelectorAll('.bands a');
        if (bands !== null) {
            bands.forEach(function(band) {
                console.log(band);
                let bandName = band.textContent;
                let bandNameEncoded = encodeURI(bandName);

                // Create element
                let a = document.createElement('a');
                //let linkText = document.createTextNode("spotify");
                let img = document.createElement('img');
                //let linkText = document.createTextNode("spotify");
                img.src = svg;
                img.width = 18;
                img.height = 18;
                a.target = 'spotify_player';
                a.appendChild(img);
                a.href = "https://open.spotify.com/search/" + bandNameEncoded;

                insertAfter(a, band);
            });
        }
    }

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length > 0) {
                    for(let node of mutation.addedNodes) {
                        if (node.nodeType === 1){
                            addLinkToBand(node);
                        }
                    }
                }
                console.log('A child node has been added or removed.');
            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    function connectCbserver() {
        if (observerPage !== null) {
            // stop observing
            observerPage.disconnect();
        }

        // Select the node that will be observed for mutations
        // const targetNode = document.getElementById('mainContainer');
        const targetNode = document.body ;

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };

        // Create an observer instance linked to the callback function
        observerPage = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observerPage.observe(targetNode, config);
    }

    // Your code here...
    modifyPushState();
    connectCbserver();
})();



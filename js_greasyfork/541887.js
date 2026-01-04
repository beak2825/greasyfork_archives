// ==UserScript==
// @name         Audible Custom WebPlayer
// @namespace    https://github.com/waringer/CustomAudiblePlayer/raw/main/CustomAudiblePlayer.user.js
// @version      2025.07.07.01
// @description  Dark Skin and Volume Slider Audible Custom WebPlayer
// @author       waringer
// @license      BSD
// @run-at       document-end
// @match        https://www.audible.de/webplayer*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541887/Audible%20Custom%20WebPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/541887/Audible%20Custom%20WebPlayer.meta.js
// ==/UserScript==

const stylesheet = `
body, html {
    color: #888;
    background-color: #333;
}

.bc-color-background-base {
  background-color: #333;
}

.bc-color-secondary {
  color: rgba(136,136,136,.65);
}

.bc-color-base {
  color: #888;
}

#audio-control-outer-div {
  width: 100%;
  padding: 0.5rem 1.5rem 0 1.5rem;
}

#audio-progress {
  background-color: #f7991c;
  width: 100%;
  height: 2px;
  position: absolute;
  pointer-events: none;
}

#audio-slider {
  width: 100%;
}

#volume-icon {
  float: left;
  padding-right: 1rem;
  padding-top: 0.5rem;
}

#adbl-cloud-player-bottom-menu-area {
  height:auto !important
}
`;

const injectStylesheet = () => {
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(stylesheet);
    } else if (typeof addStyle != "undefined") {
        addStyle(stylesheet);
    } else {
        const stylesheetEl = document.createElement("style");
        stylesheetEl.innerHTML = stylesheet;
        document.body.appendChild(stylesheetEl);
    }
}

function getNode(typeName, attributes, childs) {
  let base = document.createElementNS("http://www.w3.org/2000/svg", typeName);

  for (var attr in attributes) {
      try {
          base.setAttributeNS(null, attr, attributes[attr]);
      } catch (exceptionVar) {
          console.log("getNode attributes error @"+attr+"#"+attributes[attr]+"#"+exceptionVar)
      }
  }

  for (var child in childs) {
    base.appendChild(childs[child]);
  }

  return base
}

const replaceButtons = () => {
    // buffering
    document.querySelector("#adbl-cp-buffering").children[0].src="data:image/svg+xml;base64,"+
        btoa('<svg width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">' +
             '<g><rect width="48" height="48" fill="none"/></g>' +
             '<g><path fill="#888" d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM21,31a2,2,0,0,1-4,0V17a2,2,0,0,1,2-2,2.1,2.1,0,0,1,2,2Zm10,0a2,2,0,0,1-4,0V17a2,2,0,0,1,2-2,2.1,2.1,0,0,1,2,2Z"/></g>' +
             '</svg>');

    // prev chapter
    document.querySelector(".adblPreviousChapter").replaceChild(
        getNode("svg", { width:"50px", height:"50px", viewBox:"0 0 48 48" }, {
            0:getNode("g",null,{0:getNode("rect",{width:"48", height:"48", fill:"none"})}),
            1:getNode("g",null,{
                0:getNode("path",{fill:"#888", d:"M24.8,24,35.4,13.4a1.9,1.9,0,0,0-.2-3,2.1,2.1,0,0,0-2.7.2l-11.9,12a1.9,1.9,0,0,0,0,2.8l11.9,12a2.1,2.1,0,0,0,2.7.2,1.9,1.9,0,0,0,.2-3Z"}),
                1:getNode("path",{fill:"#888", d:"M14,10a2,2,0,0,0-2,2V36a2,2,0,0,0,4,0V12A2,2,0,0,0,14,10Z"})
            })
    }), document.querySelector(".adblPreviousChapter").childNodes[1]);

    // fast rewind
    document.querySelector(".adblFastRewind").replaceChild(
        getNode("svg", { width:"50px", height:"50px", viewBox:"0 0 150 138", style:"shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" }, {
            0:getNode("g",null,{0:getNode("path",{style:"opacity:1", fill:"#888", d:"M 24.5,76.5 C 24.5,75.5 24.5,74.5 24.5,73.5C 25.8333,73.5 27.1667,73.5 28.5,73.5C 32.8683,101.03 49.0349,116.03 77,118.5C 108.676,114.488 124.343,96.4875 124,64.5C 118.661,38.6619 102.827,24.6619 76.5,22.5C 76.8747,25.3965 76.3747,28.0632 75,30.5C 68.7536,27.2938 62.5869,23.9605 56.5,20.5C 62.6076,16.1128 69.2743,12.7795 76.5,10.5C 76.5,12.8333 76.5,15.1667 76.5,17.5C 111.011,21.5078 128.511,40.8411 129,75.5C 121.574,110.232 100.074,125.732 64.5,122C 41.3732,115.377 28.0399,100.21 24.5,76.5 Z"})}),
            1:getNode("text",{fill:"#888","font-family":"Helvetica", "font-size":"24", "text-anchor":"middle", transform:"matrix(1.66863, 0, 0, 1.60969, -38.6568, -30.6274)", x:"68.66", y:"69.75"}, {0:document.createTextNode("30")})
    }), document.querySelector(".adblFastRewind").childNodes[1]);

    // play
    document.querySelector(".adblPlayButton").replaceChild(
        getNode("svg", { width:"50px", height:"50px", viewBox:"0 0 48 48" }, {
            0:getNode("g",null,{0:getNode("rect",{width:"48", height:"48", fill:"none"})}),
            1:getNode("g",null,{0:getNode("path",{fill:"#888", d:"M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM34.6,24.7,18.1,34.8c-.6.4-1.1.1-1.1-.6V13.8c0-.7.5-1,1.1-.6L34.6,23.3A.8.8,0,0,1,34.6,24.7Z"})})
    }), document.querySelector(".adblPlayButton").childNodes[1]);

    // pause
    document.querySelector(".adblPauseButton").replaceChild(
        getNode("svg", { width:"50px", height:"50px", viewBox:"0 0 48 48" }, {
            0:getNode("g",null,{0:getNode("rect",{width:"48", height:"48", fill:"none"})}),
            1:getNode("g",null,{0:getNode("path",{fill:"#888", d:"M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM21,31a2,2,0,0,1-4,0V17a2,2,0,0,1,2-2,2.1,2.1,0,0,1,2,2Zm10,0a2,2,0,0,1-4,0V17a2,2,0,0,1,2-2,2.1,2.1,0,0,1,2,2Z"})})
    }), document.querySelector(".adblPauseButton").childNodes[1]);

    // fast forward
    document.querySelector(".adblFastForward").replaceChild(
        getNode("svg", { width:"50px", height:"50px", viewBox:"0 0 156 150", style:"shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" }, {
            0:getNode("g",null,{0:getNode("path",{style:"opacity:1", fill:"#888", d:"M 129.5,77.5 C 130.833,77.5 132.167,77.5 133.5,77.5C 133.5,79.1667 133.5,80.8333 133.5,82.5C 127.281,110.546 109.781,125.546 81,127.5C 62.2911,126.149 47.6244,117.816 37,102.5C 22.7447,74.6508 27.578,50.8175 51.5,31C 60.5056,24.7476 70.5056,21.5809 81.5,21.5C 81.5,19.1667 81.5,16.8333 81.5,14.5C 88.7257,16.7795 95.3924,20.1128 101.5,24.5C 95.048,28.3927 88.3813,31.726 81.5,34.5C 81.5,31.8333 81.5,29.1667 81.5,26.5C 47.8552,30.6485 32.3552,49.6485 35,83.5C 41.2167,107.788 56.8834,120.788 82,122.5C 109.448,119.548 125.281,104.548 129.5,77.5 Z"})}),
            1:getNode("text",{fill:"#888","font-family":"Helvetica", "font-size":"24", "text-anchor":"middle", transform:"matrix(1.66863, 0, 0, 1.60969, -38.6568, -30.6274)", x:"72.02", y:"72.42"}, {0:document.createTextNode("30")})
    }), document.querySelector(".adblFastForward").childNodes[1]);

    // next chapter
    document.querySelector(".adblNextChapter").replaceChild(
        getNode("svg", { width:"50px", height:"50px", viewBox:"0 0 48 48" }, {
            0:getNode("g",null,{0:getNode("rect",{width:"48", height:"48", fill:"none"})}),
            1:getNode("g",null,{
                0:getNode("path",{fill:"#888", d:"M34,10a2,2,0,0,0-2,2V36a2,2,0,0,0,4,0V12A2,2,0,0,0,34,10Z"}),
                1:getNode("path",{fill:"#888", d:"M15.5,10.6a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3L23.2,24,12.6,34.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l11.9-12a1.9,1.9,0,0,0,0-2.8Z"})
            })
    }), document.querySelector(".adblNextChapter").childNodes[1]);
}

const addVolumeControl = () => {
    document.getElementById("adbl-cloud-player-container").innerHTML += '<div id="audio-control-outer-div"><div id="volume-icon"><svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path fill="#888" d="m4 6v8l5.2 3.9c.3.3.8 0 .8-.5v-14.8c0-.5-.5-.8-.8-.5zm0 8h-3a1 1 0 0 1 -1-1v-6a1 1 0 0 1 1-1h3m0 0"/><path fill="#888" d="m16.4 17.4a1 1 0 0 1 -.7-1.7 8 8 0 0 0 0-11.4 1 1 0 0 1 1.3-1.3 10 10 0 0 1 0 14.2 1 1 0 0 1 -.7.3z"/><path fill="#888" d="m13.5 14.5a1 1 0 0 1 -.7-.3 1 1 0 0 1 0-1.4 4 4 0 0 0 0-5.6 1 1 0 0 1 1.4-1.4 6 6 0 0 1 0 8.4 1 1 0 0 1 -.7.3z"/></svg></div><div id="slider-and-progress" class="bc-range"><div id="audio-progress"></div><input id="audio-slider" type="range" min="0" max="100" value="100"></div></div>';

    const audioSlider = document.getElementById("audio-slider");
    const audioProgress = document.getElementById("audio-progress");

    // Weird hack for Chromium based browsers - the alignment is not the same
    if (!!window.chrome) {
        document.getElementById("slider-and-progress").style.paddingTop = "0.55rem"
    }

    audioSlider.value = localStorage.getItem("ACWP-Volume");
    audioProgress.style.width = `${audioSlider.value}%`;
    document.getElementsByTagName("audio")[0].volume = audioSlider.value / 100;

    audioSlider.oninput = (event) => {
        audioProgress.style.width = `${event.target.value}%`;
        document.getElementsByTagName("audio")[0].volume = event.target.value / 100;
        localStorage.setItem("ACWP-Volume", event.target.value);
    }
}

const main = () => {
    if (localStorage.getItem("ACWP-Volume") === null) localStorage.setItem("ACWP-Volume", 100);
    injectStylesheet();
    replaceButtons();
    addVolumeControl();
}

main();

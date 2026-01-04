// ==UserScript==
// @name         YT Media Controls+
// @namespace    by Zimeh
// @version      2.4
// @description  New volume bar for enchanced precision and higher range + fix for media keys on YouTube
// @author       Zimeh
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482504/YT%20Media%20Controls%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/482504/YT%20Media%20Controls%2B.meta.js
// ==/UserScript==

typeof window.update !== 'undefined' && clearInterval(window.update)
if(isNaN(localStorage.customVolume) || localStorage.customVolume > 100 || localStorage.customVolume < 0) localStorage.customVolume = '25'

let isContainerInserted = false
let hasIcon = false
const container = document.createElement("div");
window.isLooped = false

container.id = 'volumep_container'

const policy = window.trustedTypes.createPolicy('myPolicy', {
    createHTML: (input) => input
});

// Then use this policy to inject HTML
container.innerHTML = policy.createHTML(`
<style>
    #volumep_container{
        padding-bottom:10px;
        padding-top:10px;
        user-select:none;
    }

    #volumep_meter_icon{
        display:flex;
        justify-content:center;
        align-items:center;
    }

    #volumep_meter_val{
        width:80px;
        display:flex;
        justify-content:center;
        align-items:center;
    }

    #volumep_meter{
        font-size:22px;
        width:130px;
        border-radius:5px 0px 0px 5px;
        background-color:#2b2b2b;
        height:30px;
        user-select:none;
        color:#ddd;
        font-weight:bold;
        display:flex;
        justify-content:center;
        align-items:center
    }

    #volumep_slider {
        -webkit-appearance: none;
        position: relative;
        margin:0px;
        overflow: hidden;
        outline:none;
        height: 30px;
        width: 700px;
        border-radius:0px 5px 5px 0px;
        cursor: pointer;
    }

    ::-webkit-slider-runnable-track {
        background: #ddd;
        border-radius:0px 5px 5px 0px;
    }

    ::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 0px; /* 1 */
        height: 40px;
        background: #fff;
        box-shadow: -700px 0 0 700px dodgerblue; /* 2 */
    }

    ::-moz-range-track {
        height: 40px;
        background: #ddd;
        border-radius:0px 5px 5px 0px;
    }

    ::-moz-range-thumb {
        background: #fff;
        height: 0px;
        width: 0px; /* 1 */
        border: 3px solid #999; /* 1 */
        border-radius: 0 !important;
        box-shadow: -700px 0 0 700px dodgerblue;
        box-sizing: border-box;
    }

    ::-ms-fill-lower {
        background: dodgerblue;
    }

    ::-ms-thumb {
        background: #fff;
        border: 2px solid #999; /* 1 */
        height: 0px;
        width: 0px; /* 1 */
        box-sizing: border-box;
    }

    ::-ms-ticks-after {
        display: none;
    }

    ::-ms-ticks-before {
        display: none;
    }

    ::-ms-track {
        background: #ddd;
        border-radius:0px 5px 5px 0px;
        color: transparent;
        height: 0px;
        border: none;
    }

    ::-ms-tooltip {
        display: none;
    }

    #volumep_controls > svg:hover{
        cursor:pointer;
        fill:#cccccc;
        color:#cccccc
    }

    #volumep_controls > svg {
      fill:#9e9e9e
    }
</style>
<div style="display:flex">
    <div id="volumep_meter">
        <div id="volumep_meter_icon"></div>
        <div id="volumep_meter_val">${localStorage.customVolume}%</div>
    </div>
    <input id="volumep_slider" max="100" step="0.1" value="${localStorage.customVolume}" type="range" />
    <div id="volumep_controls">
        <svg width="30" id="volumep_deduct" height="30" viewBox="0 0 24 24"><path d="M19 12.998H5v-2h14z"/></svg>
        <svg width="30" id="volumep_add" height="30" viewBox="0 0 24 24"><path d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
        <svg id="volumep_loop" width="30" height="30" viewBox="0 0 24 24"><path d="M17.91 14c-.478 2.833-2.943 5-5.91 5c-3.308 0-6-2.692-6-6s2.692-6 6-6h2.172l-2.086 2.086L13.5 10.5L18 6l-4.5-4.5l-1.414 1.414L14.172 5H12a8 8 0 0 0 0 16c4.079 0 7.438-3.055 7.931-7z"/></svg>
    </div>
</div>
`);


window.setCustomVol = (v) => {
    localStorage.customVolume = v
    document.querySelector('video').volume = v / 100
    document.getElementById('volumep_meter_val').innerText = v + '%'
    document.getElementById('volumep_slider').value = v
}

window.changeVolume = (x) => {
    if(parseFloat(localStorage.customVolume)+x <= 100 && parseFloat(localStorage.customVolume)-x >= 0) window.setCustomVol((parseFloat(localStorage.customVolume)+x).toFixed(1))
}

setInterval(() => {
    if(window.volumeDown) {
        if(window.volumeDown+500 < Date.now()) window.changeVolume(-0.1)
    }

    if(window.volumeUp) {
        if(window.volumeUp+500 < Date.now()) window.changeVolume(0.1)
    }
}, 10)

window.update = setInterval(()=>{

    const video = document.querySelector('video')
    window.video = video

    if(!isContainerInserted){
        document.getElementById('above-the-fold').prepend(container)
        document.getElementById('volumep_slider').addEventListener('input', v => {  if(v.target.value == '4e-17') return window.setCustomVol(0); v.target.value = parseFloat(v.target.value); window.setCustomVol(v.target.value)  })

        document.getElementById('volumep_add').addEventListener('mousedown', v => { window.changeVolume(0.1); window.volumeUp = Date.now(); })
        document.getElementById('volumep_add').addEventListener('mouseup', v => { window.volumeUp = false })

        document.getElementById('volumep_deduct').addEventListener('mousedown', v => { window.changeVolume(-0.1); window.volumeDown = Date.now(); })
        document.getElementById('volumep_deduct').addEventListener('mouseup', v => { window.volumeDown = false })

        document.getElementById('volumep_loop').addEventListener('mousedown', v => { window.video.loop = !window.video.loop; document.getElementById('volumep_loop').style.fill = window.video.loop ? '#3ea6ff' : ''; window.isLooped = !window.isLooped })
        isContainerInserted = true
    }

    if(window.isLooped !== video.loop){
        window.isLooped = video.loop
        document.getElementById('volumep_loop').style.fill = video.loop ? '#3ea6ff' : ''
    }

    if(localStorage.customVolume !== video.volume*100){
        video.volume = localStorage.customVolume / 100
        var icon = '<svg width="25" height="25" viewBox="0 0 24 24"><path fill="none" stroke="#ddd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4zm11 4l-6 6m0-6l6 6"/></svg>'

        if(localStorage.customVolume > 0) icon = '<svg width="25" height="25" viewBox="0 0 24 24"><path fill="none" stroke="#ddd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4zm4.54 3.46a5 5 0 0 1 0 7.07"/></svg>'
        if(localStorage.customVolume > 20) icon = '<svg width="25" height="25" viewBox="0 0 24 24"><path fill="none" stroke="#ddd" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4zm4.54 3.46a5 5 0 0 1 0 7.07m3.53-10.6a10 10 0 0 1 0 14.14"/></svg>'
        if(localStorage.customVolume > 75) icon = '<svg width="30" height="30" viewBox="0 0 24 24"><path fill="#ddd" d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1m13.5 2A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85"/></svg></svg>'

        if(icon !== sessionStorage.currentIcon || !hasIcon) {
            document.getElementById('volumep_meter_icon').innerHTML = policy.createHTML(icon)
            sessionStorage.currentIcon = icon
            hasIcon = true
        }
    }

    if (!window.navigator.mediaSession.metadata.canSkip) {

        window.navigator.mediaSession.metadata.canSkip = true

        window.navigator.mediaSession.setActionHandler('previoustrack', function() {
            if (document.getElementsByClassName('ytp-prev-button')[0] && document.getElementsByClassName('ytp-prev-button')[0].style.display !== 'none') document.getElementsByClassName('ytp-prev-button')[0].click();
            else history.back()
        });

        window.navigator.mediaSession.setActionHandler('nexttrack', function() {
            document.getElementsByClassName('ytp-next-button')[0].click()
        });
    }
}, 500)
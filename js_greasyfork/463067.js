// ==UserScript==
// @name         s Youtube Automatic BS Skip 2.9.1 fork May2023 bugfix
// @namespace    https://greasyfork.org/en/scripts/392459-youtube-automatic-bs-skip
// @version      2.9.1.13
// @description  Fork of YouTube Automatic BS Skip 2.9.1 by JustDaile https://greasyfork.org/en/scripts/392459-youtube-automatic-bs-skip . Automatic skipping of fixed length intros/outros for your favourite Youtube channels.
// @license MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463067/s%20Youtube%20Automatic%20BS%20Skip%20291%20fork%20May2023%20bugfix.user.js
// @updateURL https://update.greasyfork.org/scripts/463067/s%20Youtube%20Automatic%20BS%20Skip%20291%20fork%20May2023%20bugfix.meta.js
// ==/UserScript==
console.log(`${GM.info.script.name} run`)
//https://greasyfork.org/scripts/392459-youtube-automatic-bs-skip/code/Youtube%20Automatic%20BS%20Skip.user.js
const app = "YouTube Automatic BS Skip";
const version = '2.9.1_DaileAlimoMIT_edited';
const debug = false;
const log = function(line){if (debug) console.log(line)}
// Elements
const controlUI_ID = "outro-controls";
const modal_ID = "modal";
const progressBar_ID = "progress-bar";
const introLen_ID = "intro-length";
const outroLen_ID = "outro-length";
const channelTxt_ID = "channel_txt";
// Actions
const pauseOnOutro = "pause-on-outro";
const nextOnOutro = "next-on-outro";
const apply_ID = "apply";
// add indicators to the progress bar.
const setupProgressBar = function(selector) {
    log('called setupProgressBar');
    if($(`#${progressBar_ID}-intro`).remove()){log("removed intro bar");}
    if($(`#${progressBar_ID}-outro`).remove()){log("removed outro bar");}
    // add intro indicator to progress bar
    if (!document.getElementById(`${progressBar_ID}-intro`)){
        log('created intro indicator');
        selector.prepend(
            $(`<div id="${progressBar_ID}-intro">`).addClass("ytp-load-progress").css({
                "left": "0%",
                "transform": "scaleX(0)",
            })
        );
    }
    // add outro indicator to progress bar
    if (!document.getElementById(`${progressBar_ID}-outro`)) {
        log('created outro indicator');
        selector.prepend(
            $(`<div id="${progressBar_ID}-outro">`).addClass("ytp-load-progress").css({
                "left": "100%",
                "transform": "scaleX(0)",
            })
        );
    }
    return [`${progressBar_ID}-intro`, `${progressBar_ID}-outro`];
};
// update the indecators on the progressbar.
const updateProgressbars = function(intro, outro, duration) {
    // update the intro progress bar
    let introBar = $(`#${progressBar_ID}-intro`);
    var introFraction = intro / duration;
    introBar.css({
        "left": "0%",
        "transform": `scaleX(${introFraction})`,
        "background-color": "green",
    });
    // update the outro progress bar
    let outroBar = $(`#${progressBar_ID}-outro`);
    var outroFraction = outro / duration;
    outroBar.css({
        "left": `${100 - (outroFraction * 100)}%`,
        "transform": `scaleX(${outroFraction})`,
        "background-color": "green",
    });
};
const setupControls = function(selector) {
    // Its easier to modify if we don't chain jquery.append($()) to build the html components
    if($(`#${controlUI_ID}`).remove()){log("removed controls");}
    var controls = document.getElementById(controlUI_ID);
    if (controls == null) {
        log('adding controls to video');
        controls = selector.prepend(`
        <button id="${controlUI_ID}" class="ytp-button loading" title="YABSS" aria-label="YABSS">
           <div class="ytp-autonav-toggle-button-container">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path fill="white" d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/></svg>
           </div>
        </button>
        `);
    }
    if($(`#${modal_ID}`).remove()){log("removed modal");}
    if (document.getElementById(modal_ID) == null) {
        log('adding modal to DOM');
        $('body').append(`
         <div id="${modal_ID}">
            <div id="${modal_ID}-escape"></div>
               <div id="${modal_ID}-content">
                  <div id="${channelTxt_ID}">Loading Channel</div>
                      <h2 id="${controlUI_ID}-title" class="d-flex justify-space-between">YouTube Automatic BS Skip ${version}
                         <a href="https://www.buymeacoffee.com/JustDai" target="_blank">
                            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                               <g><path d="M0,0h24v24H0V0z" fill="none"></path></g>
                               <g fill="#ffffff"><path d="M18.5,3H6C4.9,3,4,3.9,4,5v5.71c0,3.83,2.95,7.18,6.78,7.29c3.96,0.12,7.22-3.06,7.22-7v-1h0.5c1.93,0,3.5-1.57,3.5-3.5 S20.43,3,18.5,3z M16,5v3H6V5H16z M18.5,8H18V5h0.5C19.33,5,20,5.67,20,6.5S19.33,8,18.5,8z M4,19h16v2H4V19z"></path></g>
                            </svg>
                         </a>
                      </h2>
                     <div id="${controlUI_ID}-control-wrapper">
                        <div class="w-100 d-flex justify-space-around align-center">
                        <label for="${introLen_ID}">Intro</label>
                        <input type="number" min="0" id="${introLen_ID}" placeholder="unset" class="input">
                     </div>
                     <div class="w-100 d-flex justify-space-around align-center">
                        <label for="${outroLen_ID}">Outro</label>
                        <input type="number" min="0" id="${outroLen_ID}" placeholder="unset" class="input">
                     </div>
                     <div class="pa">
                        <div>
                        <label for="${controlUI_ID}-outro-action-group">Action on outro <span id='${controlUI_ID}-outro-settings'>(Disabled. Assign outro time to enable)</span></label>
                     </div>
                     <fieldset id="${controlUI_ID}-outro-action-group" class="d-flex">
                        <div>
                            <label for="${pauseOnOutro}">Pause Video</label>
                            <input type="radio" name="outro-action-group" id="${pauseOnOutro}">
                        </div>
                        <div>
                            <label for="${nextOnOutro}">Play Next Video</label>
                            <input type="radio" name="outro-action-group" id="${nextOnOutro}" checked="checked">
                        </div>
                     </fieldset>
                  </div>
               <tp-yt-paper-button id="${apply_ID}" class="style-scope ytd-video-secondary-info-renderer d-flex justify-center align-center" style-target="host" role="button" elevation="3" aria-disabled="false">${apply_ID}</tp-yt-paper-button>
            </div>
         </div>
      </div>`
      );
      var validate=x=>{
        var y=$(`#${x}`).val().toString()
        if(y && y != "" && parseInt(y) != NaN){
          if (y < 0) y = 0
          return Number(y)
        }
        return
      }
      $(`#${controlUI_ID}`).on('click', () => { $(`#${modal_ID}`).toggleClass("show"); });
      $(`#${modal_ID}-escape`).on('click', () => { $(`#${modal_ID}`).removeClass("show"); });
      $(`#${outroLen_ID}`).on('input', () => {
        var outroSeconds = validate(outroLen_ID)
        if(outroSeconds!=undefined) $(`#${controlUI_ID}-outro-settings`)[outroSeconds>0?'addClass':'removeClass']('hide')
      })
      $(`#${apply_ID}`).on("click", function() {
        var introSeconds = validate(introLen_ID)
        if(introSeconds!=undefined) updateapp({intro: introSeconds})
        var outroSeconds = validate(outroLen_ID)
        if(outroSeconds!=undefined) updateapp({outro: outroSeconds})
        updateapp({outact:  $(`#${nextOnOutro}`).get(0).checked?true:false })
        $(`#${modal_ID}`).removeClass("show")
      });
    }
    return controls;
};
const updateControls = ({loadedIntroSetInSeconds, loadedOutroSetInSeconds, channelTxt, tooltipTxt, loading, playNextOnOutro}) => {
    if (channelTxt!=undefined) $(`#${channelTxt_ID}`).text(channelTxt)
    if (tooltipTxt!=undefined) $(`#${controlUI_ID}`).attr('title',  tooltipTxt)
    if (loading!=undefined) $(`#${controlUI_ID}`)[loading?'addClass':'removeClass']('loading')
    if (loadedIntroSetInSeconds!=undefined) $(`#${introLen_ID}`).attr("placeholder", loadedIntroSetInSeconds <= 0? "unset": loadedIntroSetInSeconds)
    if (loadedOutroSetInSeconds!=undefined){
      $(`#${outroLen_ID}`).attr("placeholder", loadedOutroSetInSeconds <= 0? "unset": loadedOutroSetInSeconds)
      $(`#${controlUI_ID}-outro-settings`)[loadedOutroSetInSeconds>0?'addClass':'removeClass']('hide')
    }
    if (playNextOnOutro!=undefined){
      $(`#${nextOnOutro}`).get(0).checked= playNextOnOutro?"checked":false
      $(`#${pauseOnOutro}`).get(0).checked= playNextOnOutro?false:"checked"
    }
};
var introid=x=>x.split(" ").join("_") + "-intro"
var outroid=x=>x.split(" ").join("_") + "-outro"
var outactid=x=>x.split(" ").join("_") + "-outro-action"
var curchannel
const CHNLOAD='loading'
var loadedIntroSetInSeconds
var loadedOutroSetInSeconds
var playNextOnOutro
var updateapp=({channel,intro,outro,outact})=>{
  if(channel) curchannel=channel
  if(curchannel===CHNLOAD){
    updateControls({
      channelTxt: 'N/A',
      tooltipTxt: 'YABSS Loading',
      loading: true,
    })
  }else{
    if(intro!=undefined) GM_setValue(introid(curchannel), intro)
    if(outro!=undefined) GM_setValue(outroid(curchannel), outro)
    loadedIntroSetInSeconds = Number(GM_getValue(introid(curchannel), 0))
    loadedOutroSetInSeconds = Number(GM_getValue(outroid(curchannel), 0))
    if(outact!=undefined) GM_setValue(outactid(curchannel),outact)
    playNextOnOutro = GM_getValue(outactid(curchannel), false)
    updateControls({
      channelTxt: curchannel,
      tooltipTxt: `${curchannel}\nIntro: ${loadedIntroSetInSeconds}s\nOutro: ${loadedOutroSetInSeconds}s${loadedOutroSetInSeconds>0?playNextOnOutro?' (Play Next)':' (Pause)':''}`,
      loading: false,
      loadedIntroSetInSeconds: loadedIntroSetInSeconds,
      loadedOutroSetInSeconds: loadedOutroSetInSeconds,
      playNextOnOutro: playNextOnOutro
    })
  }
}
//
var vs
var curdur
var vsloop=e=>{
  var v=e.target
  if (curdur != v.duration && !isNaN(v.duration) ) { //do these one time per duration change
    curdur = v.duration
    updateProgressbars(loadedIntroSetInSeconds, loadedOutroSetInSeconds, v.duration)
    if(v.currentTime < loadedIntroSetInSeconds)  v.currentTime = loadedIntroSetInSeconds
  }
  if(loadedOutroSetInSeconds>0 && v.duration-loadedOutroSetInSeconds <= v.currentTime){
    v.pause()
    if(playNextOnOutro) $(".ytp-next-button")[0].click();
  }
}
var vsupdate=_=>{
  if(vs!=document.querySelector('.video-stream')){
    vs=document.querySelector('.video-stream')
    vs.addEventListener('timeupdate',vsloop)
  }
  setTimeout(vsupdate,1)
}
vsupdate()
//
const forkJoinJQExistCheck = function({selectors,func1,func2}) {
  var $sins=selectors.map(s=>$(s))
  if($sins.filter(x=>x.length /*.length jquery existence check */ ).length===selectors.length){
    $sins.map((s,i)=>func1[i](s))
    func2()
  }
};
//
var lasturl
var cp=_=>{
  if(lasturl!=document.URL){
    updateapp({channel:CHNLOAD})
    if(document.URL.includes("watch?")){
      forkJoinJQExistCheck({
        selectors: [ '.video-stream', ".ytp-right-controls", ".ytp-progress-bar"],
        func1:[
          _=>{},
          setupControls,
          setupProgressBar
        ],
        func2: async function() {
          lasturl=document.URL
          updateapp({channel:CHNLOAD})
          var thisurl=document.URL
          var channel = await fetch(thisurl).then(a=>a.text()).then(a=>a.match(/"author":"(.*?)"/)[1])
          if(thisurl===document.URL){ // not switched to another video while fetching channel/author
            curdur=0
            if(true){ // a redundant intro skip for the beginning few seconds to tackle 'timeupdate' latency
              var v=document.querySelector('.video-stream')
              var p=!v.paused
              v.pause()
              vsloop({target:v})
              if(p) v.play()
            }
            updateapp({channel:channel})
          }
        }
      })
    }
  }
  setTimeout(cp,100)
}
;(_=>cp())();
// Write the CSS rules to the DOM
GM_addStyle(`
#${modal_ID}-escape {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
}
#${modal_ID} {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    background: rgba(0,0,0,.8);
}
#${modal_ID}.show {
    display: flex;
}
#${modal_ID}-content {
    margin: auto;
    width: 30%;
    height: auto;
    background-color: var(--yt-live-chat-action-panel-background-color);
    border-radius: 6px 6px 6px;
    border: 1px solid white;
    padding: 15px;
    color: white;
    z-index: 1001;
}
#${introLen_ID},#${outroLen_ID} {
    font-size: 1.2em;
    padding: .4em;
    border-radius: .5em;
    border: none;
    width: 80%
}
#${apply_ID} {
    position: relative;
    border: 1px solid white;
    transition: background-color .2s ease-in-out
}
#${apply_ID}:hover {
    background-color: rgba(255,255,255,0.3);
}
#${controlUI_ID}.loading {
    opacity:.3
}
#${controlUI_ID} {
    height: 100%;
    padding: 0;
    margin: 0;
    bottom: 45%;
    position: relative;
}
#${controlUI_ID} svg {
    position: relative;
    top: 20%;
    left: 20%;
}
#${controlUI_ID}-panel {
 margin-right: 1em;
 vertical-align:top
}
#${controlUI_ID} > * {
 display: inline-block;
 max-height: 100%;
}
#${controlUI_ID}-title {
 padding: 2px;
}
#${controlUI_ID}-outro-action-group {
    padding: .5em;
}
#${controlUI_ID}-outro-action-group > div {
 display: block;
 margin: auto;
 text-align-last: justify;
}
#${controlUI_ID}-control-wrapper > * {
    padding: 1em;
}
#action-radios {
  display: none;
}
#action-radios .actions{
  padding-left: 2px;
  text-align: left;
  background-color: black;
  color: white;
}
#${introLen_ID},#${outroLen_ID} {
 margin-right: 2px;
}
#${channelTxt_ID} {
    position: relative;
    top: -3.5em;
    margin-bottom: -1.5em;
}
.w-100 {
    width: 100% !important;
}
.input {
    padding: .2em;
}
.d-flex {
    display: flex;
}
.justify-center {
    justify-content: center;
}
.justify-space-around {
    justify-content: space-around;
}
.justify-space-between {
    justify-content: space-between;
}
.align-center {
    align-items: center;
}
#${controlUI_ID}-outro-settings.hide{
    display:none
}
`);
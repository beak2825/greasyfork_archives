// ==UserScript==
// @name            Social Galactic Enhancer
// @namespace       http://tampermonkey.net/
// @version         0.75
// @description     Enhances the social galactic!
// @author          Rexel
// @match           https://social.infogalactic.com/*
// @require         https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/416349/Social%20Galactic%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/416349/Social%20Galactic%20Enhancer.meta.js
// ==/UserScript==

// Change Log
// 0.75 (19/03/2021)
// - Old comment update checker code removed
// - Replaced with comment button color updater for comment count > 1
// 0.70 (22/02/2021)
// - Added update version checker/button to config options.
// - 'Previous Posts' button goes to the top of the page on being clicked
// 0.60 (01/11/2021)
// - Removed requirement for JQuery, can now open the options and click on the background to close and save.. (quicker that a button)
// 0.55 (11/19/2020)
// - light theme comment icon.. visible again

//console.log('Loading: Social Galactic Enhancer ');

//https://greywyvern.com/code/php/binary2base64
//http://www.stripegenerator.com#Zm9yZT0xNzE3MTc7aD0zMDt3PTQ7cD0xO2JhY2sxPTAwMDAwMDtiYWNrMj1mZjAwMDA7Z3Q9MDtkPTA7c2hhZG93PTA7
const blackBgTile = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAKElEQVQImU3MMQ0AMBDDQH9ImD+8sOhUKd5u8an82mahZgFkARywiwcztAxO3drr/wAAAABJRU5ErkJggg%3D%3D";
const commentTimerDefault = 3500;
const scriptUrl = 'https://greasyfork.org/en/scripts/416349-social-galactic-enhancer';
let versionInfo = GM_info.script.version;
let regexScriptVersion = /version=\"(\d*\.?\d*)\"/;
let scriptVersion = versionInfo;
let linkColor = "#999";
let firstRunComplete = false;
let versionChecked = false;
let configHeadOrig;

// (The third argument is optional)
let ticker = new AdjustingInterval(updateCommentsUrl, 5000, doError);

GM_config.init("Social Galactic Enhancer", {
    stylingEnable: {
        label: "Custom CSS styling",
        type: "checkbox",
        default: true
    },
    commentTargetTab: {
        label: "Comment icon opens link in a new tab ([mmb] will always do that)",
        type: "checkbox",
        default: true
    },
    commentUpdatesEnable: {
        label: "Comment URL updates",
        type: "checkbox",
        default: true
    },
    commentButtonColor: {
        label: "Comment Button Color",
        type: "string",
        default: "#007bff"
    },
    commentTimer: {
        label: "Comment update timer, 1000 = 1 second",
        type: "number",
        default: commentTimerDefault
    },
    enableWallpaper: {
        label: "Custom background wallpaper URL",
        type: "checkbox",
        default: false
    },
    wallpaperUrl:
    {
        label: 'Wallpaper Url',
        type: 'text',
        default: 'https://images2.alphacoders.com/238/238870.jpg'
    },
    updateCheck: {
        label: "Check for updated script version",
        type: "checkbox",
        default: false
    }
});

let baseStyle = `
:root {
    font-size: 62.5%;
}

:root body {
    margin: 0;
    font-size: 1.6rem;
    font-family: Arial;
}

body {
    background-image: url(`+blackBgTile+`);
    background-repeat: repeat;
    //background-position: center;
    //background-repeat: no-repeat;
    //background-size: cover;
    //background-attachment: fixed;
}

/*Nav Bar*/
nav.navbar {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.51) 0%, rgba(0, 0, 0, 0) 90%);
}

/*Logo*/
a.navbar-brand {
    font-size: 2.5rem;
}

/*Search bar*/
ul.navbar-nav form {
    background: #111111ba;
    border-radius: 4px;
}

/*Mid Section*/
.col-md-12 {
    background: #111111de;
    border: 1px solid #565656;
    border-radius: 4px;
    padding-top: 10px;
}

.dark-theme .mat-card {
    background: #242424;
    color: #fff;
}

.ng-star-inserted {
    font-size: 2rem;
}

.mat-card-actions .ng-star-inserted {
    font-size: 1.4rem;
}

.mat-card-content {
    font-size: 1.7rem;
}

.reposted-by {
    font-size: 1.2rem !important;
    font-family: Arial;
}

.trending-hashtags {
    font-size: 1.5rem;
}

.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
    line-height: 45px;
    font-size: 1.5rem;
    padding: 0 8px;
}

.mat-button-toggle-button {
    margin: -7px 0px;
    padding: 0px 2px;
}

.mat-card-content div {
    font-size: 1.6rem !important;
    margin-right: -16px;
    margin-top: 5px !important;
    margin-left: -16px;
    background: #111111a3;
    padding: 0px 15px 0px 15px;
    font-family: Arial;
    box-shadow: 0px 9px 12px #00000057 inset;
}

.mat-card-content div p:first-child {
    margin-right: 0px;
    margin-top: 6px !important;
    margin-left: 0px;
    padding: 5px 0px 5px 0px;
}

mat-card-content .micropost-image {
    max-width: max-content!important;
    max-height: fit-content!important;
    text-align: center;
    padding: 4px 4px 4px 4px;
    border: 1px solid #00000080;
    background: #00000085;
    cursor: pointer;
    transition: .3s;
    border-radius: 2px!important;
}

/* Image Viewer */
.dark-theme .mat-dialog-container {
    box-shadow: 0px 3px 7px 0px rgba(0,0,0,.2), 0 4px 28px 3px rgb(232 17 17 / 47%), 0 19px 46px 8px rgb(133 0 255 / 36%);
    background: linear-gradient(180deg, rgb(35 35 35) 0%, rgb(25 25 25) 74%, rgb(27 27 27) 100%);
    border: 1px solid #444;
    color: #fff;
    padding: 5px 0px 25px 10px;
    overflow: hidden;
}

.dark-theme .mat-card {
    background: linear-gradient(180deg, rgb(47 47 47 / 79%) 0%, rgb(29 29 29 / 58%) 74%, rgb(70 70 70 / 8%) 100%);
    border-top: 1px solid #ffffff52;
    box-shadow: 0px 2px 6px 0px #61616175 inset;
}

.mat-card-date-freshness {
    font-weight: 300 !important;
    font-size: 1.4rem;
    color: #657786;
}

.mat-card-content>* {
    font-size: 1.6rem;
}

.mat-card>.mat-card-actions:last-child {
    margin-bottom: -16px;
    margin-right: -17px;
    margin-left: -17px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.51) 0%, rgba(0, 0, 0, 0) 90%);
    border-radius: 6px;
    padding: 3px 16px 0px 16px;
}

.url-preview-contents {
    background: #0000005c;
    padding: 4px;
    margin-top: -14px;
    border: 1px solid #444;
    border-radius: 4px;
}

.url-preview-image {
    width: auto!important;
    max-width: 100%;
    min-width: 50%;
    margin-top: -14px;
    padding: 4px 4px 4px 4px;
    border: 1px solid #444;
    background: #00000054;
    cursor: pointer;
    transition: .3s;
    border-radius: 4px!important;
}

/*Comment Box*/
.mat-form-field-appearance-outline .mat-form-field-infix {
    padding: 0px 0px;
    margin: 10px 1px;
    border-radius: 5px;
}

.quoted-micropost-text-with-images{
    padding-bottom: 0px!important;
}

.char-count.plenty {
    color: lime;
    padding-left: 10px;
}

.row.post-container {
    padding: 0px 16px;
}

.mat-form-field-appearance-outline .mat-form-field-flex {
    padding: 0px 1px 5px 1px!important;
    margin-top: -10px;
    margin-bottom: -20px;
    position: relative;
}

.mat-form-field-appearance-outline .mat-form-field-wrapper {
    margin: 5px 0px;
}

.dark-theme .mat-form-field-appearance-outline .mat-form-field-outline {
    color: rgba(255, 255, 255, .3);
    background: #222;
    border-radius: 4px;
}

.mat-form-field-infix textarea {
    background: #131313;
    padding: 4px 6px !important;
    font-size: 1.6rem;
}

button.float-right {
    margin-top: 7px;
    margin-right: 5px;
    border: 1px solid #555;
    margin-bottom: -8px;
}

/*Sidears*/
.col-md-12.sidebar {
    background: #191919ed;
    border-radius: 6px;
    padding-top: 12px;
    border: 1px solid #565656;
}

.trending-hashtags.ng-star-inserted {
    background: #111111c7;
    border-radius: 2px;
    margin-bottom: 8px;
}


body.config-dialog-open{
    padding-right: 0px!important;
    overflow: inherit!important;
}

.mat-button-ripple.mat-ripple {
    margin-left: 0px;
    margin-right: 0px;
    background: unset;
    box-shadow: 0px 9px 14px 0px #00000057 inset;
    margin-top: 1px !important;
}

button.mat-button.mat-button-base.mat-primary.ng-star-inserted {
    border: 1px solid #0000008a;
    margin-top: 6px;
    padding: 0px;
    margin-bottom: -7px;
    box-shadow: 0px 9px 12px #00000057 inset;
}

button.float-right.mat-flat-button.mat-button-base.mat-primary {
    border: 1px solid #171717;
}

button.float-right.mat-flat-button.mat-button-base.mat-primary {
    border: 1px solid #000000a1;
    font-size: 2rem;
}

/*
.light-theme .comment-url {
    color: #000;
}

.dark-theme .comment-url {
    color: #FFF;
}
.comment-link {
    color: #3868da!important;
}
*/
`;

let configStyle = `
body {
    display: inline-block;
    padding: 29px!important;
    overflow: hidden;
    font-size: 16px;
    font-family: "Helvetica Neue",Helvetica,Arial,"微軟正黑體",sans-serif;
    color: #d0d0d0!important;
    padding: 0;
    border-radius: 4px;
    border: 1px solid #b1b1b1;
    background: linear-gradient(-220deg, rgb(6 6 6) 0%, rgb(33 33 33) 90%);
    margin: 0;
    line-height: 1;
}

#config-update-button{
    //background-color: #233894;
    padding: 0px 5px;
    color: #fff;
    margin: 0px 5px;
}
.config-dialog-content{
    color: #d0d0d0!important;
    background: linear-gradient(180deg, rgb(47 47 47 / 79%) 0%, rgb(29 29 29 / 58%) 74%, rgb(70 70 70 / 8%) 100%);
}

.config-dialog{
    background: rgb(0 0 0 / 14%);
}
.config-dialog-head:after {
    content: " // version: `+versionInfo+`";
    font-size: 0.58rem;
}

.form-control:focus {
    border-color: #0a53f8;
    color: #ffffff;
}

.form-group label[for="commentTimer"] {
    //display: none;
}
.form-group #commentTimer {
    //display: none;
}`;

setTimeout(function(){ configSetup(); }, 500);

window.addEventListener('load', (event) => {
    //console.log('load: Social Galactic Enhancer ');
    setTimeout(function(){ configSetup(); }, 1000);
});

function versionCheck(){
    if(versionChecked){return;}
    fetch(scriptUrl).then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (html) {
        scriptVersion = html.match(regexScriptVersion)[1];
        //console.log(versionInfo);
        versionButtonUpdate();
    }).catch(function (err) {
        console.warn('versionCheck went wrong.', err);
    });
    versionChecked = true;
}


function versionButtonUpdate(){
    let configHead = document.querySelector('iframe.config-dialog-content').contentDocument.querySelector(".config-dialog-head").innerHTML;
    if(configHead){
        if(configHeadOrig == null){
            configHeadOrig = configHead;
            document.querySelector('iframe.config-dialog-content').contentDocument.querySelector(".config-dialog-head").innerHTML = configHeadOrig + "<a href="+scriptUrl+" target='_blank'><button id='config-update-button' class='btn-sm'>SGE Script Homepage</button></a>";
        }else{
            if(GM_info.script.version == scriptVersion){
                document.querySelector('iframe.config-dialog-content').contentDocument.querySelector(".config-dialog-head").innerHTML = configHeadOrig +"<a href="+scriptUrl+" target='_blank'><button id='config-update-button' class='btn-sm'>SGE Script Homepage</button></a>";
            }else{
                document.querySelector('iframe.config-dialog-content').contentDocument.querySelector(".config-dialog-head").innerHTML = configHeadOrig +"<a href="+scriptUrl+" target='_blank'><button id='config-update-button' style='background-color: #ececec;color: #000' class='btn-sm'>Update Available! (v"+scriptVersion+")</button></a>";
            }
        }
    }
}

function configSetup(){
    if(firstRunComplete){ return;}
    //console.log('configSetup: Social Galactic Enhancer ');
    configRecheck();
    linkColor = (document.querySelector('body').classList.contains('light-theme')) ? "#000" : "#FFF";
    GM_config.onclose = configRecheck;
    //GM_config.onload = configLoad;
    let nav = document.querySelector('span.navbar-text.white-text').firstChild;
    let optionLi = document.createElement('li');
    optionLi.className = "nav-item";
    optionLi.innerHTML = `<span><mat-icon class="mat-icon notranslate fa fa-user-cog mat-icon-no-color" fonticon="fa-user-cog" fontset="fa" role="img" aria-hidden="true"></mat-icon></span>`;
    optionLi.style = "padding-right: 5px;padding-top: 7px;cursor: pointer;";
    optionLi.onclick = function ()
        {GM_config.open();
        if(GM_config.get().updateCheck){
            versionCheck();
        }
        configLoad();
    };

    nav.prepend(optionLi);

    //For Previous button to goto top of the page after being clicked.
    addPrevButtonListener();
    firstRunComplete = true;
};
function addPrevButtonListener() {
    //TODO ADD notification prev button support
    //document.querySelector("body > app-root > div > div > div.col-md-6.middlesection > div > app-notification > div.row > div.col.pull-right > span > button");
    let previousPosts = document.querySelector("body > app-root > div > div > div.col-md-6.middlesection > div > ng-component > div.row > div.col.right > span > button");
    if(previousPosts){
        previousPosts.onclick = function (){
            window.scrollTo(0, 0);
        };
    }else{
        setTimeout(addPrevButtonListener, 3000);
    }
}

function updateCommentsUrl() {
    let commemtButtons = document.querySelectorAll(".mat-button-wrapper .fa-comment");
    commemtButtons.forEach(element => {
        if(element.parentNode){
            if(element.parentNode.textContent.trim() > 0){
                element.parentNode.style.color = GM_config.get().commentButtonColor;
            }
        }
    });
}

function addCss(cssString) {
    let head = document.getElementsByTagName('head')[0];
    let newCss = document.createElement('style');
    newCss.id = "newCss"
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

function removeCss(){
    if(document.getElementById('newCss')){
        document.getElementById('newCss').remove();
    }
    document.body.style.background = "";
}

function configLoad() {
    let addStyle = document.createElement('style');
    addStyle.innerHTML = configStyle;
    document.querySelector('iframe.config-dialog-content').contentDocument.querySelector('head').appendChild(addStyle);
    document.querySelector(".config-dialog").onclick = function ()
        {
        GM_config.close(true);
    };
    versionButtonUpdate();
}

function configRecheck() {
    //console.log('configRecheck: Social Galactic Enhancer ');
    if(GM_config.get().commentUpdatesEnable){
        updateCommentsUrl();
        ticker.interval = (GM_config.get().commentTimer > commentTimerDefault) ? GM_config.get().commentTimer : commentTimerDefault;
        ticker.start();
    }else{
        ticker.stop();
    }

    if(GM_config.get().stylingEnable){
        if(!document.getElementById('newCss')){
            addCss(baseStyle);
        }
        if(GM_config.get().enableWallpaper){
            document.body.style.backgroundImage = "url("+GM_config.get().wallpaperUrl+")";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundAttachment = "fixed";
        }else{
            document.body.style.backgroundImage = "url("+blackBgTile+")";
            document.body.style.backgroundRepeat = "repeat";
            document.body.style.backgroundSize = "unset";
        }
    }else{
        removeCss();
    }
}

// Define the work to be done
var doWork = function() {
    updateCommentsUrl();
};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

/**
 * Self-adjusting interval to account for drifting
 *
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds) - This
 * @param {function} errorFunc (Optional) Callback to run if the drift
 *                             exceeds interval
 */
function AdjustingInterval(workFunc, interval, errorFunc) {
    let that = this;
    let expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}

// ==UserScript==
// @name           Google Play Music Tweaks
// @description:en My personal tweaks for Google Play Music
// @namespace      www.reaverxai.com
// @require       http://code.jquery.com/jquery-1.11.3.min.js
// @include       http://play.google.com/music/listen*
// @include       https://play.google.com/music/listen*
// @include       http://music.google.com/music/listen*
// @include       https://music.google.com/music/listen*
// @match         http://play.google.com/music/listen*
// @match         https://play.google.com/music/listen*
// @match         http://music.google.com/music/listen*
// @match         https://music.google.com/music/listen*
// @run-at        document-end
// @version 0.0.1.20150914140714
// @description My personal tweaks for Google Play Music
// @downloadURL https://update.greasyfork.org/scripts/12328/Google%20Play%20Music%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/12328/Google%20Play%20Music%20Tweaks.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

jQuery.fn.changeTag = function (newTag) {
    var q = this;
    this.each(function (i, el) {
        var h = "<" + el.outerHTML.replace(/(^<[\w-]+|[\w-]+>$)/g, newTag) + ">";
        try {
            el.outerHTML = h;
        } catch (e) { //elem not in dom
            q[i] = jQuery(h)[0];
        }

    });
    return this;
};

addGlobalStyle('a.nav-item-container.tooltip.sub,a#shop-nav,[data-action="upload-music"]{display: none !important}');

addGlobalStyle('#material-app-bar, sj-paper-button.material-primary, paper-button.material-primary, .material-container-details sj-fab, .material-container-details paper-fab, #current-loading-progress, paper-slider::shadow #sliderBar::shadow #activeProgress, paper-slider::shadow #sliderKnobInner, .button.primary, .simple-dialog-buttons button.goog-buttonset-default, .button.primary:focus, .button.primary:hover, .simple-dialog-buttons button.goog-buttonset-default:hover, .simple-dialog-buttons button.goog-buttonset-default:focus {background-color: #7876D0 !important}');

addGlobalStyle('.nav-item-container.selected, .nav-item-container.selected core-icon, .nav-item-container.selected iron-icon, .cluster.material-cluster .lane-button core-icon, .cluster.material-cluster .lane-button iron-icon, #player.material .material-player-middle sj-icon-button[data-id="play-pause"]:not([disabled]), #player.material .material-player-middle paper-icon-button[data-id="play-pause"]:not([disabled]) {color: #7876D0 !important}');

addGlobalStyle('.nav-toolbar .menu-logo {margin: 0 0 0 30px;} sj-icon-button#left-nav-close-button {display: none;}');

addGlobalStyle('[data-is-radio="true"] .reason {display: none !important;} .material-card[data-is-listen-now="true"] .details {padding: 6px !important;} .material-card[data-is-listen-now="true"] {margin: 8px !important; max-width: 255px;} .material-card[data-size="small"][data-type="imfl"] {margin: 8px; width: 400px; cursor: pointer; position: relative;} .material-card[data-size="small"][data-type="imfl"] .image-wrapper-new {height: 100%; width: 100px; left: 0;} .material-card[data-size="small"][data-type="imfl"] .image-wrapper-new {border-radius: 2px 0 0 2px;} .material-card[data-size="small"][data-type="imfl"] .details {overflow: hidden;position: absolute;left: 100px;right: 0px;bottom: 0px;top: 0px;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-align-items: center;-ms-flex-align: center;align-items: center;} .material-card[data-type="imfl"] .description-overlay {display: none;} .material-card[data-size="small"][data-type="imfl"] .image-inner-wrapper {border-radius: 2px 0 0 2px; height: 100%; width: 100px; background: url(http://i.imgur.com/lwJkMTm.png) center no-repeat #D10438;} .material-card[data-size="small"][data-type="imfl"] .title {font-size: 18px; line-height: 22px; max-height: 44px; white-space: normal; overflow: hidden;} .material-card[data-size="small"][data-type="imfl"] .title.fade-out:after {top: auto; height: 23px;} .material-card[data-size="small"][data-type="imfl"] .sub-title.fade-out:after {top: auto; height: 15px;} .material-card[data-size="small"][data-type="imfl"] .image {border-radius: 2px 0 0 2px; display: none;} .material-card[data-size="small"][data-type="imfl"] .radio-overlay {display: none;} core-header-panel #music-content.material .g-content');

//Instant Mixes

addGlobalStyle('.material-card[data-size="small"][data-type="imfl"] { padding: 8.3% 0; flex: 1.7; } .cards .material-card[data-log-position="5"] { display: none; } @media (min-width: 1544px) { .material-card[data-size="small"][data-type="imfl"] { max-width: 430px; } } @media (max-width: 1543px) {  .material-card[data-size="small"][data-type="imfl"] { padding: 9.9% 0; } .cards .material-card[data-log-position="3"] { display: none; } } @media (max-width: 1311px) { .material-card[data-size="small"][data-type="imfl"] { padding: 13.4% 0; flex: 1.5; } .cards .material-card[data-log-position="4"] { display: none; } } @media (max-width: 1083px) { .material-card[data-size="small"][data-type="imfl"] { padding: 15.4% 0; flex: 2.1; } .cards .material-card[data-log-position="2"] { display: none; } }');

//Artist/Album Page

addGlobalStyle('.material-container-details .actions sj-paper-button, .material-container-details .actions sj-icon-button {display: none !important;} .material-detail-view .material-container-details .actions { border-top: 0; margin-bottom: -30px;} sj-fab[data-id="radio"]{margin-right: 68px; padding-left: 15px; background-color: #D10438 !important;} sj-fab[data-id="share-artist"] {margin-right: 136px; padding-left: 14px; background-color: #ef6c00 !important;} core-header-panel#content-container.transparent #material-app-bar, paper-header-panel#content-container.transparent #material-app-bar {background-color: transparent !important;} .material .material-detail-view .cluster-text-protection { margin: 75px -72px 0; padding-bottom: 25px;} .material-detail-view .has-hero-image { margin-top: calc(100vh - 330px); } @media (max-width: 1598px) { .material-detail-view .has-hero-image { margin-top: calc(50vw - 64px - 132px); } }');

//Auto Playlist

addGlobalStyle('#auto-playlists .nav-item-container { display: inline-block; width: 36px; height: 30px; padding: 3px 0; margin-left: 3px; }#auto-playlists .fade-out:after { display: none; } #auto-playlists .nav-item-container core-icon { margin: 3px 0 0 6px; } #auto-playlists { display: inline-block; padding: 0 0 0 6px; margin-top: -5px; } .nav-section-header + #auto-playlists { display: inline-block; } .nav-section-header:nth-child(3) { line-height: 46px; display: inline-block; }');


document.getElementsByClassName("menu-logo")[0] .style.backgroundImage="url('http://i.imgur.com/FpXIgNx.png')";

$('#drawer-panel').removeAttr( "narrow" );
                                                                        
function whenElementLoaded() {

    function whenElementLoaded() {
            $('.column .material-card').unwrap();
            $('.material-card[data-size="small"][data-type="imfl"] .image-wrapper').attr( "class", "image-wrapper-new");
        time=setInterval(function(){
            $('.column .material-card').unwrap();
            $('.material-card[data-size="small"][data-type="imfl"] .image-wrapper').attr( "class", "image-wrapper-new");
        }, 500);
    }

    var intervalID = setInterval(function() {
        if ($(".new-listen-now").length) {
            clearInterval(intervalID);
            whenElementLoaded();
        }
    }, 100);

}

var intervalID = setInterval(function() {
    if ($(".g-content").length) {
        clearInterval(intervalID);
        whenElementLoaded();
    }
}, 100);

function whenElementLoaded2() {

    function whenElementLoaded2() {
            $('sj-paper-button[data-id=radio]').attr( "icon", "sj:instant-mix");    
            $('sj-paper-button[data-id=radio]').attr( "aria-label", "Instant mix");     
            $('sj-paper-button[data-id=radio]').attr( "title", "Instant mix");  
            $('sj-paper-button[data-id=share-artist]').attr( "icon", "av:play-shopping-bag");
            $('sj-paper-button[data-id=share-artist]').attr( "aria-label", "Shop for this Artist");
            $('sj-paper-button[data-id=share-artist]').attr( "title", "Shop for this Artist");
            $('sj-paper-button[data-id=share-artist]').attr( "data-type", "link");
            $('sj-paper-button[data-id=share-artist]').attr( "data-id", "share-artist");
            $('sj-paper-button[data-id=radio]').changeTag('sj-fab'); 
            $('sj-paper-button[data-id=share-artist]').changeTag('sj-fab');   
        time=setInterval(function(){
            $('sj-paper-button[data-id=radio]').attr( "icon", "sj:instant-mix");    
            $('sj-paper-button[data-id=radio]').attr( "aria-label", "Instant mix");     
            $('sj-paper-button[data-id=radio]').attr( "title", "Instant mix");  
            $('sj-paper-button[data-id=share-artist]').attr( "icon", "av:play-shopping-bag");
            $('sj-paper-button[data-id=share-artist]').attr( "aria-label", "Shop for this Artist");
            $('sj-paper-button[data-id=share-artist]').attr( "title", "Shop for this Artist");
            $('sj-paper-button[data-id=share-artist]').attr( "data-type", "link");
            $('sj-paper-button[data-id=share-artist]').attr( "data-id", "share-artist");
            $('sj-paper-button[data-id=radio]').changeTag('sj-fab'); 
            $('sj-paper-button[data-id=share-artist]').changeTag('sj-fab');  
        }, 500);
    }

    var intervalID2 = setInterval(function() {
        if ($(".actions").length) {
            clearInterval(intervalID2);
            whenElementLoaded2();
        }
    }, 100);

}

var intervalID2 = setInterval(function() {
    if ($(".actions").length) {
        clearInterval(intervalID2);
        whenElementLoaded2();
    }
}, 100);


function whenElementLoaded3() {

    function whenElementLoaded3() {
        $('#auto-playlist-thumbs-up').append('<core-icon relative="" id="icon" src="{{src}}" icon="{{icon}}" aria-label="menu" role="img"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path></g></svg></core-icon>');
        $('#auto-playlist-recent').append('<core-icon relative="" id="icon" src="{{src}}" icon="{{icon}}" aria-label="menu" role="img"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-10 5h-2v-2h2v2zm0-4h-2V7h2v6z"></path></g></svg></core-icon>');
        $('#auto-playlist-promo').append('<core-icon relative="" id="icon" src="{{src}}" icon="{{icon}}" aria-label="menu" role="img"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></g></svg></core-icon>');
        
        $( "#auto-playlists div" ).remove();
        
        time=setInterval(function(){

        }, 500);
    }

    var intervalID3 = setInterval(function() {
        if ($("#nav").length) {
            clearInterval(intervalID3);
            whenElementLoaded3();
        }
    }, 100);

}

var intervalID3 = setInterval(function() {
    if ($("#nav").length) {
        clearInterval(intervalID3);
        whenElementLoaded3();
    }
}, 100);
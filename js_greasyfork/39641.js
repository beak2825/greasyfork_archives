// ==UserScript==
// @name        WME Mobile Support
// @author      Tom 'Glodenox' Puttemans
// @namespace   http://tomputtemans.com/
// @description A userscript that makes the WME more useable on mobile devices
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.3.6
// @supportURL  https://github.com/Glodenox/wme-mobile-support/issues
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39641/WME%20Mobile%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/39641/WME%20Mobile%20Support.meta.js
// ==/UserScript==

// Style element to reuse whenever it gets removed by the WME (user login, for example)
var styleElement;

// Initialisation of the script, this will only run completely one time
function init(e) {
  if (e && e.user == null) {
    return;
  }
  // if you require certain features to be loaded, you can add them here
  if (typeof I18n === 'undefined' || typeof W === 'undefined' || typeof W.loginManager === 'undefined') {
    setTimeout(init, 200);
    return;
  }
  if (!W.loginManager.user) {
    W.loginManager.events.register("login", null, applyStyles);
    W.loginManager.events.register("loginStatus", null, applyStyles);
  }
  var viewportMeta = document.createElement('meta');
  viewportMeta.name = 'viewport';
  viewportMeta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0';
  document.head.appendChild(viewportMeta);

  enableTouchEvents();
  //fixSelection(); // disabled as it doesn't really work as hoped
  applyStyles();
}

// Add the missing OpenLayers classes for touch navigation and enable them
function enableTouchEvents() {
  if (!OpenLayers.Control.PinchZoom) {
    OpenLayers.Control.PinchZoom=OpenLayers.Class(OpenLayers.Control,{type:OpenLayers.Control.TYPE_TOOL,containerCenter:null,pinchOrigin:null,currentCenter:null,autoActivate:!0,initialize:function(a){OpenLayers.Control.prototype.initialize.apply(this,arguments);this.handler=new OpenLayers.Handler.Pinch(this,{start:this.pinchStart,move:this.pinchMove,done:this.pinchDone},this.handlerOptions)},activate:function(){var a=OpenLayers.Control.prototype.activate.apply(this,arguments);a&&(this.map.events.on({moveend:this.updateContainerCenter,scope:this}),this.updateContainerCenter());return a},deactivate:function(){var a=OpenLayers.Control.prototype.deactivate.apply(this,arguments);this.map&&this.map.events&&this.map.events.un({moveend:this.updateContainerCenter,scope:this});return a},updateContainerCenter:function(){var a=this.map.layerContainerDiv;this.containerCenter={x:parseInt(a.style.left,10)+50,y:parseInt(a.style.top,10)+50}},pinchStart:function(a){this.currentCenter=this.pinchOrigin=a.xy},pinchMove:function(a,b){var c=b.scale,d=this.containerCenter,e=this.pinchOrigin,f=a.xy,g=Math.round(f.x-e.x+(c-1)*(d.x-e.x)),d=Math.round(f.y-e.y+(c-1)*(d.y-e.y));this.applyTransform("translate("+g+"px, "+d+"px) scale("+c+")");this.currentCenter=f},applyTransform:function(a){var b=this.map.layerContainerDiv.style;b["-webkit-transform"]=a;b["-moz-transform"]=a},pinchDone:function(a,b,c){this.applyTransform("");a=this.map.getZoomForResolution(this.map.getResolution()/c.scale,!0);if(a!==this.map.getZoom()||!this.currentCenter.equals(this.pinchOrigin)){var b=this.map.getResolutionForZoom(a),c=this.map.getLonLatFromPixel(this.pinchOrigin),d=this.currentCenter,e=this.map.getSize();c.lon+=b*(e.w/2-d.x);c.lat-=b*(e.h/2-d.y);this.map.div.clientWidth=this.map.div.clientWidth;this.map.setCenter(c,a)}},CLASS_NAME:"OpenLayers.Control.PinchZoom"});
  }
  if (!OpenLayers.Handler.Pinch) {
    OpenLayers.Handler.Pinch=OpenLayers.Class(OpenLayers.Handler,{started:!1,stopDown:!1,pinching:!1,last:null,start:null,touchstart:function(a){var b=!0;this.pinching=!1;OpenLayers.Event.isMultiTouch(a)?(this.started=!0,this.last=this.start={distance:this.getDistance(a.touches),delta:0,scale:1},this.callback("start",[a,this.start]),b=!this.stopDown):(this.started=!1,this.last=this.start=null);OpenLayers.Event.stop(a);return b},touchmove:function(a){if(this.started&&OpenLayers.Event.isMultiTouch(a)){this.pinching=!0;var b=this.getPinchData(a);this.callback("move",[a,b]);this.last=b;OpenLayers.Event.stop(a)}return!0},touchend:function(a){this.started&&(this.pinching=this.started=!1,this.callback("done",[a,this.start,this.last]),this.last=this.start=null);return!0},activate:function(){var a=!1;OpenLayers.Handler.prototype.activate.apply(this,arguments)&&(this.pinching=!1,a=!0);return a},deactivate:function(){var a=!1;OpenLayers.Handler.prototype.deactivate.apply(this,arguments)&&(this.pinching=this.started=!1,this.last=this.start=null,a=!0);return a},getDistance:function(a){var b=a[0],a=a[1];return Math.sqrt(Math.pow(b.clientX-a.clientX,2)+Math.pow(b.clientY-a.clientY,2))},getPinchData:function(a){a=this.getDistance(a.touches);return{distance:a,delta:this.last.distance-a,scale:a/this.start.distance}},CLASS_NAME:"OpenLayers.Handler.Pinch"});
  }
  W.map.navigationControl.pinchZoom = new OpenLayers.Control.PinchZoom({
    map: W.map
  });
  W.map.navigationControl.pinchZoom.activate();
}

function applyStyles() {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.textContent = `@media screen and (max-width: 1000px) {
  /* Login dialog modifications */
  .modal-dialog-login { width: 100%; margin: 0 }
  .modal-dialog-login .modal-content { width: 350px }
  #login-popup { padding: 10px; width: auto }
  #login-popup .login-popup-content { display: block }
  #login-popup .login-form { padding: 15px; height: auto }
  .modal-dialog-login .login-title { font-size: 19px }
  .modal-open .edit-area > .fluid-fixed { width: 100%; height: 100vh }
  .modal-open #editor-container #WazeMap { height: calc(100vh - 46px) !important }

  /* Hide a lot of stuff */
  .login-popup-links, .language-select, .welcome-message p, .title-text, .topbar .area-managers-region, .olControlPanZoomBar, #links, #advanced-tools, .WazeControlMousePosition, #user-box, #chat-overlay, .google-permalink, .WazeControlPermalink { display: none !important }

  /* Set the default width to several objects so they don't stretch the page */
  #editor-container, #editor-container #map { min-width: auto }

  /* Adjust the sidebar and map so they appear on top of eachother */
  @media (orientation: portrait) {
    .show-sidebar .row-fluid .fluid-fixed { width: 100%; margin-left: 0 }
    .row-fluid #sidebar { width: auto }
    .edit-area { display: flex; flex-direction: column-reverse }
    #editor-container #WazeMap { height: 40vh !important }
    #editor-container:before, .show-sidebar #map, .show-sidebar #map:after { border-radius: 0 }
    .toolbar .toolbar-icon { width: 30px }
    #edit-buttons .toolbar-button { padding: 0 5px }
    .toolbar #edit-buttons .toolbar-button .item-container { padding: 0 5px }
  }

  /* Adjust the sidebar and map so they share the space horizontally */
  @media (orientation: landscape) {
    .show-sidebar .row-fluid .fluid-fixed { width: calc(100% - 330px); min-width: 50%; margin-left: 0 }
    .row-fluid #sidebar { max-width: 50% }
    #sidebar .tab-scroll-gradient { width: 100%; margin-left: -15px }
    .edit-area { display: flex }
  }

  /* Adjust toolbar */
  .toolbar #search { width: 50px; min-width: auto }
  #app-head aside #brand, .group-title { display: none }
  .toolbar .toolbar-icon { position: relative }
  #edit-buttons .toolbar-button .item-icon { display: block; top: 8px; position: relative }
  #edit-buttons .toolbar-button .menu-title { display: none }
  #edit-buttons { flex-grow: 1 }
  #edit-buttons .toolbar-submenu { margin-right: 0 }
  #toolbar .toolbar, #edit-buttons { min-width: auto }

  /* Adjust map controls */
  #WazeMap .full-screen { position: absolute; bottom: 35px; right: 5px; z-index: 1000; font-size: 1.3em }
}`;
  }
  if (!styleElement.parentNode) {
    document.head.appendChild(styleElement);
  }

  var adjustToolbar = function() {
    if (!document.querySelector('#mode-switcher') || !document.querySelector('#edit-buttons')) {
      setTimeout(adjustToolbar, 100);
      return;
    }
    document.querySelector('#mode-switcher .short-title').textContent = 'Mode';
    var addStickyClasses = function(el, classes) {
      var observer = new MutationObserver(function() {
        el.querySelector('.item-icon').classList.add(...classes);
      });
      observer.observe(el, {
        childList: true
      });
      el.querySelector('.item-icon').classList.add(...classes);
    };
    addStickyClasses(document.querySelector('#edit-buttons .toolbar-button.waze-icon-save'), ['fa', 'fa-save']);
    addStickyClasses(document.querySelector('#edit-buttons .toolbar-button.waze-icon-redo'), ['fa', 'fa-chevron-right']);
    addStickyClasses(document.querySelector('#edit-buttons .toolbar-button.waze-icon-undo'), ['fa', 'fa-chevron-left']);
  };
  adjustToolbar();

  var fullScreenButton = document.createElement('button');
  fullScreenButton.classList.add('full-screen', 'fa', 'fa-arrows-alt');
  fullScreenButton.addEventListener('click', function() {
    var docEl = document.documentElement;
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(document);
    }
  });
  document.querySelector('#WazeMap').appendChild(fullScreenButton);
}

init();
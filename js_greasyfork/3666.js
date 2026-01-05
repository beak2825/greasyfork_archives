// ==UserScript==
// @id             www.dailymotion.com-6843eec7-c1ba-4a14-8700-738e52bcb8e6@http://foo.bar/baz
// @name           Dailymotion: "Playback Quality Control" Feature
// @version        0.0.5
// @namespace      http://foo.bar/baz
// @author         David Toso
// @description    Add some site-wide video playback quality control settings to Dailymotion.
// @include        http://www.dailymotion.com/*
// @require        http://code.jquery.com/jquery-1.9.1.min.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/3666/Dailymotion%3A%20%22Playback%20Quality%20Control%22%20Feature.user.js
// @updateURL https://update.greasyfork.org/scripts/3666/Dailymotion%3A%20%22Playback%20Quality%20Control%22%20Feature.meta.js
// ==/UserScript==

// Magic Sauce: prevent the standard Dailymotion Player's JavaScript 
// from ever loading!
window.addEventListener('beforescriptexecute', function(e) {
  if (/window\.DM_Player_Type/.test(e.target.text)) {
    // attempt to block the standard player JS from loading
    // for video & member pages
    console.log("stopped standard player from loading! [DM_Player_Type]");
    e.stopPropagation();
    e.preventDefault();
  } else if (/playerPlaying/.test(e.target.text)) {
    // attempt to block the standard player JS from loading
    // for playlist pages
    console.log("stopped standard player from loading! [playerPlaying]");
    e.stopPropagation();
    e.preventDefault();
  }
}, true);

// Get a list of available 'quality' settings for the current video 
// (in *old* API format -- convert to numeric as per *new* API).
var getAvailableResolutions = function (vID, cID, cb) {
  console.log("inside GAR");
  $('#'+cID).html(
    '<div id="get_res" style="width: 100%; margin-top: 160px; font-size: '+
    '22px; text-align: center; color: white; font-weight: bold">Getting '+
    'available resolutions...</div>');

  var rest_apis = 'https://api.dailymotion.com';
  GM_xmlhttpRequest({
    method: "GET",
    url: rest_apis+"/video/"+vID+"?fields=available_formats",
    onload: function(res) {
      console.log("GOT resolutions");
      var obj = JSON.parse(res.responseText);
      var avail = obj.available_formats;
      var fmts = [];
      for (var i=0; i<avail.length; i++) {
        switch(avail[i]) {
          case 'ld':     fmts.push(240);  break;
          case 'sd':     fmts.push(380);  break;
          case 'hq':     fmts.push(480);  break;
          case 'hd720':  fmts.push(720);  break;
          case 'hd1080': fmts.push(1080); break;
        }
      }
      cb(fmts);
    },
    onerror: function(res) {
      console.log("problem getting available resolutions!");
    }
  });
};


// Wait for element given by selector to become available
var waitFor = function(doc, selector, cb) {
  if ($(selector, doc).get(0)) return cb();
  else setTimeout(function(){ waitFor(doc, selector, cb); }, 200);
};

// Select the best resolution available (from the given list) or
// the maximum desired resolution (as previously recorded) whichever
// is lowest.
var select_best_resolution = function (resolutions, cID, cb) {

  // set 1080p as max desired resolution if setting has never been recorded
  if (GM_getValue('max_desired_quality',null) == null) {
    GM_setValue('max_desired_quality', 1080);
  }

  // set Yes as auto playback setting if setting has never been recorded
  if (GM_getValue('auto_playback',null) == null) {
    GM_setValue('auto_playback', 'Yes');
  }

  // choose best available resolution
  var avail = resolutions.slice(0);
  var best = resolutions.pop();

  // downgrade to desired maximum if required
  var max = GM_getValue('max_desired_quality',null);
  var auto = GM_getValue('auto_playback');
  while (best > max) { best = resolutions.pop(); }

  // fall back to 380 (seems to always be available)
  if (best == null) best = 380;

  // notify of selected resolution
  $('#'+cID).html(
    '<div id="sel_res" style="width: 100%; margin-top: 130px; font-size: 55px;'+
    ' text-align: center; color: white; font-weight: bold">'+best+'P</div>');
  $('#sel_res')
    .fadeOut(1500, function(){ 
      $(this).remove(); 
      cb(best, auto); 
    });

  // asynchronously: build quality tab
  waitFor(document,'.pl_video_tabs ul.mo_tabs', function(){
    build_quality_tab(best, max, avail, auto);
  });
};

// Inject a 'Quality' video tab which shows the available resolutions 
// (current highlighted), and allows the user to select the maximum
// resolution they'd like to set on future video views
var build_quality_tab = function(best, max, avail, auto) {

  avail = avail.map(function(e){ return e+'P'; }).join(", ");
  var re = new RegExp('(, )*('+best+'P)');
  avail = avail.replace(re, function(_all, _p, _f) { return _p+'<b>'+_f+'</b>'; });

  // find tabs & corresponding panels
  var tabs = $('.pl_video_tabs ul.mo_tabs');
  var panels = $('.pl_video_tabs');

  // Render tab
  tabs.append(
    '<li id="tab_myquality" class="pull-start mrg-end-lg"><a class="alt-link'+
    ' link-border-color-on-hvr" href="">Quality</li>');
  panels.append(
    '<div id="tab_myquality_content" class="pl_video_tabmyquality tab_content'+
    ' clearfix" style="display: none"></div>');

  // Render panel
  var myPanel = $('#tab_myquality_content');
  myPanel.append(
    '<h3 class="tab_title clearfix" style="clear:both; font-weight: normal; '+
    'font-size: 20px; color: #0079B8; font-family: arial;">Playback Quality '+
    'Settings</h3>');
  myPanel.append(
    '<p style="font-weight: normal; margin-top: 15px; font-size: 15px; color:'+
    ' black; font-family: arial;"><span style="display: inline-block; width: '+
    '188px;">Resolutions available: </span>'+avail+'</p>');
  myPanel.append(
    '<p style="font-weight: normal; margin-top: 3px; font-size: 15px; color:'+
    ' black; font-family: arial;"><span style="display: inline-block; width: '+
    '188px;">Maximum desired quality: </span><select id="my_sel_qual" style="'+
    'font-size: 12px; width: 230px; background-color: white;"><option value="'+
    '240">240P - I don\'t even</option><option value="380">380P - Low Quality'+
    '</option><option value="480">480P - Standard Definition</option><option '+
    'value="720">720P - High Quality</option><option value="1080">1080P - '+
    'Highest Quality</option></select></p>');
  myPanel.append(
    '<p style="font-weight: normal; margin-top: 3px; font-size: 15px; color:'+
    ' black; font-family: arial;"><span style="display: inline-block; width: '+
    '188px;">Automatic playback: </span><select id="my_auto_play" style="'+
    'font-size: 12px; width: 230px; background-color: white;"><option value="'+
    'Yes">Yes</option><option value="No">No</option></select></p>');

  // Record changes to max desired playback quality setting
  $('#my_sel_qual')
    .val(max)
    .change(function(){ 
      GM_setValue('max_desired_quality', $('#my_sel_qual').eq(0).val()*1); 
    });

  // Record changes to auto playback setting
  $('#my_auto_play')
    .val(auto)
    .change(function(){
      GM_setValue('auto_playback', $('#my_auto_play').eq(0).val());
    });
};

// synchronize readiness of DM Player embedding API and Quality Selection
var when_ready = function(uwin, cb) {
  if ((uwin.__DM_JS_READY == 1) && (uwin.__RES_CHOSEN == 1)) return cb();
  else setTimeout(function(){ when_ready(uwin, cb); }, 50);
};

// load the dailymotion embedded player
var load_embedded_player = function(uwin, quality, auto, cID, vID) {

  // Configure player with previously chosen video quality.
  var params = { 
    api:      1, 
    quality:  quality,
    related:  0, 
    logo:     0, 
    info:     0, 
    autoplay: auto=='Yes'?1:0
  };

  // Actually ask for the video to be loaded! 
  var player = uwin.DM.player(cID, {
    video:    vID, 
    width:    620, 
    height:   348,
    params:   params
  });

  // when we can talk to the flash player via JavaScript...
  player.addEventListener("apiready", function(e) {
    var x = e.target.contentWindow;
    x.onload = function() {

      //$('#player_container').css({ height: 348 });
      console.log("FLASHPLAYER JS API is ready!");
    };
  });
};

// main script entry point
var once = 0;
window.addEventListener('DOMContentLoaded', function(e) {
  if (once) return; once = 1;
  var uwin = unsafeWindow;
  var doc  = uwin.document;

  // Determine whether we're dealing with a Video page, a Playlist page, or a 
  // Member's home page (the User Interface Mode)
  var uiMode;
  if (uwin.DM_CurrentVideoXID) uiMode = 'video';
  if ($('#js-playlist-name').get(0)) uiMode = 'playlist';
  if ($('.user-screenname-inner').get(0)) uiMode = 'member';
  if (!uiMode) return; // don't bother doing the rest if there's no player
  console.log("uiMode="+uiMode);

  // Wait until both Player & Quality selection are ready
  when_ready(uwin, function(){
    console.log("BOTH ARE READY!");
    //if (uiMode != 'video') return;
    load_embedded_player(uwin, 
      uwin.__RES_SETTINGS.quality,
      uwin.__RES_SETTINGS.autoplay,
      uwin.__RES_SETTINGS.container,
      uwin.__RES_SETTINGS.video);
  });

  // Async-load the DM embedded JS API
  (function() {
    var e = doc.createElement('script'); 
    e.async = true;
    e.src = doc.location.protocol + '//api.dmcdn.net/all.js';
    var s = doc.getElementsByTagName('script')[0]; 
    uwin.dmAsyncInit = function() {
      console.log("DM Player API loaded!");
      uwin.__DM_JS_READY = 1;
    };
    s.parentNode.insertBefore(e, s);
  }());

  // Based on the uiMode, find the "currently playing" video ID as well as the
  // container element that will house the embedded DM video player
  var vID, pID, cID;
  switch(uiMode) {
    case 'video': 
      vID = uwin.DM_CurrentVideoXID; 
      cID = 'container_player_main';
      break;
    case 'playlist': 
      vID = $('.js-list-list > div.media > div.media-img',doc)
        .eq(0).attr('data-id'); 
      cID = 'container_main_player';
      break;
    case 'member':
      $('#js-featured-card-title > a')
        .eq(0).attr('href').replace(/\/video\/([^_]+)/, function(_m, _x) { 
          vID = _x; });
      cID = 'container_player_main';
      break; 
  }
  console.log("VID="+vID);

  // Get a list of available resolutions for the "currently playing" video, 
  // then compare that to the users's max desired quality & autoplay
  // preferences before configuring and loading the DM embedded player.
  $('#'+cID).css('background-color', '#00669d');
  getAvailableResolutions(vID, cID, function(resolutions){
    console.log("smeg");
    select_best_resolution(resolutions, cID, function(chosen, auto){
      console.log("selected="+chosen+",autoplay="+auto);
      uwin.__RES_SETTINGS = { 
        quality:    chosen, 
        autoplay:   auto, 
        container:  cID, 
        video:      vID 
      };
      uwin.__RES_CHOSEN = 1;  
    });
  });  

}, true);

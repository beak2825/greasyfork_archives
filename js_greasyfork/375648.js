// ==UserScript==
// @name            Zoom and crop YouTube videos to fill screen height
// @version         0.6.4
// @description     Removes letterboxing by cropping the left and right edges off of full-screen YouTube videos and zooming to fill the screen height.
// @author          uxamend
// @namespace       https://greasyfork.org/en/users/231373-uxamend
// @match           https://www.youtube.com/*
// @match           https://www.youtube-nocookie.com/embed/*
// @exclude-match   https://www.youtube.com/ad_frame*
// @exclude-match   https://www.youtube.com/ad_companion*
// @exclude-match   https://www.youtube.com/embed/
// @exclude-match   https://www.youtube.com/video_masthead*
// @grant           none
// @run-at          document-idle
// @license         CC0-1.0
// @compatible      firefox version >=64 (older versions untested)
// @compatible      chrome version >=71 (older versions untested)
// @downloadURL https://update.greasyfork.org/scripts/375648/Zoom%20and%20crop%20YouTube%20videos%20to%20fill%20screen%20height.user.js
// @updateURL https://update.greasyfork.org/scripts/375648/Zoom%20and%20crop%20YouTube%20videos%20to%20fill%20screen%20height.meta.js
// ==/UserScript==

// In @exclude-matches above, we want to exclude exactly
// https://www.youtube.com/embed/, but not https://www.youtube.com/embed/*
// /embed/ without a subdirectory appears in the background of normal YouTube,
// whereas /embed/* is for embedded videos on other sites.

"use strict";

// ==================================
//   User-defined global parameters
// ==================================

// For tall screens: Sets the narrowest aspect ratio that videos will ever be
// cropped to.
var min_cropped_aspect = 16/10; // Express as a fraction, e.g. 16/10, not 16:10.

// For very wide videos: The maximum proportion of video width to crop off
var max_crop_proportion = 1;

// Sets the aspect ratio of the player for using zoom outside of full-screen.
// This has no effect in full-screen mode.
// To use the screen aspect ratio as the player aspect ratio, set this to zero.
var player_aspect = 16/9; // Set to zero or a fraction, e.g. 16/9, not 16:9.

// Default zoom state outside full-screen (true = enabled, false = disabled)
var def_zoom_n = false;

// Default zoom state in full-screen (true = enabled, false = disabled)
var def_zoom_f = true;

// Sets which key will be used to enable and disable zoom
var zoom_shortcut_key = "z";

// ==================================


var debug_logging_on = false;
var debug_script_name = "Userscript: Zoom YouTube videos to fill screen height"

function debug_log(message) {
  if(debug_logging_on){
    console.log("[" + debug_script_name + "] " + message);
  }
}

/**
 * set_zoom
 * Zooms a specified video to fill specified containing area dimensions.
 * Parameters:
 *     video   video to zoom
 *     cw      containing area width
 *     ch      containing area height
 * Global parameters read:
 *     min_cropped_aspect    minimum aspect ratio to crop videos down to
 *     max_crop_proportion   maximum proportion of video width to crop away
 */
function set_zoom(video, cw, ch) {
  var vs = video.style;
  var video_aspect = video.videoWidth/video.videoHeight;
  var containing_aspect = cw/ch;

  // Don't zoom if the endscreen is showing
  if(!video.ended) {
    // Only zoom and crop videos that are wide enough to crop
    if(video_aspect > containing_aspect && video_aspect > min_cropped_aspect) {
      debug_log("Video is wider than containing area and min_cropped_aspect. Setting zoom.");

      var vh = ch; // vh = video height

      // Apply min_cropped_aspect constraint to video height
      if (min_cropped_aspect > containing_aspect) vh = cw/min_cropped_aspect;

      var vw = video_aspect * vh; // vw = video width (including cropped portion)

      // Apply max_crop_proportion constraint to video width
      if (cw/vw < 1-max_crop_proportion) vw = cw + vw * max_crop_proportion;

      var vt = (ch-vh)/2; // vt = top edge position of video
      var vl = (cw-vw)/2; // vl = left edge position of video

      debug_log("Containing area dimensions: " + cw + "x" + ch + ".");
      debug_log("Calculated new video element dimensions: " + vw + "x" + vh + ", origin at " + vl + ", " + vt + ".");
      debug_log("(Underlying video stream resolution: " + video.videoWidth + "x" + video.videoHeight + ".)");
      debug_log("containing_aspect: " + containing_aspect + ".");
      debug_log("min_cropped_aspect: " + min_cropped_aspect + "." );
      debug_log("video_aspect: " + video_aspect + ".");
      debug_log("max_crop_proportion: " + max_crop_proportion + ".");

      // This might appear to risk creating an endless loop via the mutation
      // observer. However, it doesn't. I'm guessing that changing the dimensions
      // doesn't constitute a mutation, but if it does it can result in at most one
      // superfluous execution of set_zoom(). If the first execution causes a
      // mutation by changing the video element's dimensions, then the second
      // execution, if it is surplus to requirements, should set them to the same
      // values, resulting in no mutation and no third execution (until genuinely
      // needed).
      vs.height = vh + "px";
      vs.width = vw + "px";
      vs.top = vt + "px";
      vs.left = vl + "px";

    } else {
      debug_log("Video is not wide enough to require zoom ("
                + video.videoWidth
                + "x"
                + video.videoHeight
                + "). Not setting zoom.");
      unzoom(video, cw, ch);
    }
  } else {
    debug_log("Video has ended. Not setting zoom. (Otherwise we mess with the endscreen.)");
  }
}

/**
 * unzoom
 * Undoes the visual effects of set_zoom.
 * Note that unzoom does not gurantee to return the video dimensions exactly to
 * their original values, but the visual appearance should be the same (or near
 * enough as makes no odds).
 * Parameters:
 *     video   video to unzoom
 *     cw      containing area width
 *     ch      containing area height
 */
function unzoom(video, cw, ch) {
  // It would be better to somehow trigger YouTube's standard video sizing, but
  // in the absence of a way to trigger that, we'll just do this.
  
  var vs = video.style;
  var video_aspect = video.videoWidth/video.videoHeight;
  var containing_aspect = cw/ch;
  
  // Don't unzoom if the endscreen is showing
  if(!video.ended) {
    debug_log("Unzooming video.");
    
    // Usually the player is sized to fit the video exactly in default view,
    // but not for narrow videos, which are pillarboxed with white bars. Rarely,
    // the player defaults to 16:9 for all videos, so that wide videos are
    // letterboxed with white bars.
    // 
    // In theater mode and full-screen mode, the player has a fixed aspect and
    // the video is letter- or pillarboxed with black bars if it doesn't fit
    // exactly.
    // 
    // To avoid black bars in default view, we must size the video to fill the
    // container in the video's longest dimension only. (Otherwise we could
    // just size it to fill the container in both dimensions.)
    var w, h, t, l;
    if(video_aspect == containing_aspect) {
      // video that fits the container exactly
      w = cw; h = ch; t = 0; l = 0;
    } else if(video_aspect > containing_aspect) {
      // letterboxed video
      w = cw; l = 0;
      h = cw / video_aspect;
      t = (ch - h) / 2;
    } else {
      // pillarboxed video
      h = ch; t = 0;
      w = ch * video_aspect;
      l = (cw - w) / 2;
    }
    
    vs.width = w + "px";
    vs.height = h + "px";
    vs.top = t + "px";
    vs.left = l + "px";
  } else {
    debug_log("Video has ended. Not unzooming. (Otherwise we mess with the endscreen.)");
  }
}

/**
 * in_theater_mode
 * Returns true if we're in Theater mode.
 */
function in_theater_mode() {
  return (document.getElementById("player-theater-container") &&
          document.getElementById("player-theater-container").childElementCount > 0 &&
          !document.fullscreenElement);
}

/**
 * set_player_aspect
 * Changes the aspect ratio of the video player element to the specified aspect
 * ratio, as interpreted by YouTube's default CSS.
 * Parameters:
 *     aspect            aspect ratio to use
 *     theater_default   if true, set theater mode to the default aspect ratio
 *                       instead of the specified aspect ratio
 */
function set_player_aspect(aspect, theater_default=false) {
  debug_log("Setting player aspect to " + aspect + ".");
  
  // We need to set overflow to hidden on the movie-player otherwise the video
  // overhangs in miniplayer mode. Get it by class name rather than id, for
  //  compatibility with embedded videos
  document.getElementsByClassName("html5-video-player")[0].style.setProperty("overflow", "hidden");
  
  // For embedded videos, we don't need to do anything.
  
  // For default view
  if(document.getElementsByTagName("ytd-watch-flexy")[0]) {
    var ytdwfs = document.getElementsByTagName("ytd-watch-flexy")[0].style;
    ytdwfs.setProperty("--ytd-watch-flexy-width-ratio", aspect);
    ytdwfs.setProperty("--ytd-watch-flexy-height-ratio", 1);
  }
  
  // For theater mode
  var ptc = document.getElementById("player-theater-container");
  
  if(in_theater_mode() && !theater_default) {
    debug_log("Setting theater mode height.");
    // 56px for masthead; --ytd-masthead-height is not always set, so can't use
    // that unfortunately
    ptc.style.setProperty("max-height", "calc(100vh - 56px)");
    ptc.style.setProperty("height", "calc((" + (1/aspect) + ") * 100vw)");
  } else {
    debug_log("Unsetting theater mode height.");
    if(ptc) {
      ptc.style.removeProperty("max-height");
      ptc.style.removeProperty("height");
    }
  }
}

/**
 * apply_player_aspect
 * To facilitate zoom and crop when the movie_player is not full-screen, this sets
 * the aspect ratio of the movie_player to follow the player_aspect setting.
 * Calling with the zoom parameter set to false returns the player to the YouTube
 * default of matching the video aspect ratio.
 * Parameters:
 *     zoom   if true, use player_aspect
 *            if false, use the actual video aspect (YouTube default)
 * Global parameters read:
 *     player_aspect   the aspect ratio to use, or zero (indicating to use the
 *                     screen aspect)
 */
function apply_player_aspect(zoom=true) {
  var video = document.getElementsByClassName("html5-main-video")[0];
  var video_aspect = video.videoWidth/video.videoHeight;
  
  if(zoom) {
    if(player_aspect == 0) {
      debug_log("Adjusting player aspect ratio to match screen.");
      var screen_aspect = window.screen.width/window.screen.height;
      if(video_aspect > screen_aspect) {
        set_player_aspect(screen_aspect);
      } else {
        debug_log("No need to change player aspect; video is not wide enough.");
      }
    } else {
      debug_log("Adjusting player aspect ratio to configured value.");
      if(video_aspect > player_aspect) {
        set_player_aspect(player_aspect); 
      } else {
        debug_log("No need to change player aspect; video is not wide enough.");
      }
    }
  } else {
    debug_log("Restoring player aspect ratio to match video.");
    set_player_aspect(video_aspect, true);
    // N.B. If video_aspect is narrow, the expected behaviour of set_player_aspect
    // is that YouTube's CSS may result in the video being pillarboxed, due to the
    // maximum height constraint.
  }
}

/**
 * set_zoom_to_window
 * Zooms a video to fill the window dimensions.
 * Parameters:
 *     video   the video to set zoom for
 *     zoom    if false, will unzoom instead of setting zoom
 * Global parameters read:
 *     min_cropped_aspect    minimum aspect ratio to crop videos down to
 *     max_crop_proportion   maximum proportion of video width to crop away
 */
function set_zoom_to_window(video, zoom=true) {
  if(zoom) {
    set_zoom(video,
           window.innerWidth,
           window.innerHeight);
  } else {
    unzoom(video,
           window.innerWidth,
           window.innerHeight);
  }
}

/**
 * set_zoom_to_movie_player
 * Zooms a video to fill its containing movie_player element in the DOM. When not in
 * full-screen mode, also changes the size of the movie_player to follow the
 * player_aspect setting (else there'll be no zoom and crop).
 * Parameters:
 *     video   the video to set zoom for
 *     zoom    if false, will unzoom instead of setting zoom
 * Global parameters read:
 *     min_cropped_aspect    minimum aspect ratio to crop videos down to
 *     max_crop_proportion   maximum proportion of video width to crop away
 *     player_aspect         aspect ratio setting for non-full-screen movie_player
 */
function set_zoom_to_movie_player(video, zoom=true) {
  if(!document.fullscreenElement) {
    // The movie_player is the grandparent node of the video element.
    // Open question: Is it more likely for the ID of the relevant element to
    // change (so that selecting it as the grandparent is the best strategy), or
    // for its position in the DOM tree to change (so that selecting it by ID is
    // the best strategy)?
    if(zoom) {
      apply_player_aspect(true);
      set_zoom(video,
               video.parentNode.parentNode.clientWidth,
               video.parentNode.parentNode.clientHeight);
    } else {
      unzoom(video,
             video.parentNode.parentNode.clientWidth,
             video.parentNode.parentNode.clientHeight);
    }
  } else {
    apply_player_aspect(false);
    
    // In full-screen mode, the movie-player is not necessarily the same size as
    // the screen, which can cause a slight offset. Use set_zoom_to_window instead
    // for this case.
    set_zoom_to_window(video, zoom);
  }
  zoom_button.update();
}

/**
 * mo_callback
 * Callback function for mutation observer, to re-apply zoom if the video element
 * mutates. E.g. when an ad starts or stops playing, or in other circumstances
 * when the video might change dimensions or become reset to its default,
 * letterboxed state.
 */
function mo_callback(mutation_list, observer) {
  mutation_list.forEach((mutation) => {
    if(mutation.type == "attributes"){
      
      // We have to check whether zoom "should" be on, because the
      // fullscreenchange event may not be fast enough, in which case we will
      // catch the mutations caused by exiting full-screen.
      if(zoom_should_be_on()) {
        debug_log("Video element mutated.");
        set_zoom_to_movie_player(mutation.target);
      } else {
        debug_log("Video element mutated but zoom should be off.");
        zoom_off();
      }
    }
  });
}

var mo = new MutationObserver(mo_callback);

function observe_video_mutations(video) {
  mo.observe(video, {"attributes" : true});
}

/**
 * zoom_on
 * Unconditionally apply zoom and keep it applied until zoom_off is called.
 */
function zoom_on() {
  debug_log("Turning zoom on.");
  var video = document.getElementsByClassName("html5-main-video")[0];
  set_zoom_to_movie_player(video);
  observe_video_mutations(video);
}

/**
 * zoom_off
 * Unconditionally stop applying zoom, until zoom_on is called.
 */
function zoom_off() {
  debug_log("Turning zoom off.");
  mo.disconnect();
  var video = document.getElementsByClassName("html5-main-video")[0];
  apply_player_aspect(false);
  set_zoom_to_movie_player(video, false);
}

// Manual zoom state outside full-screen
var man_enab_n = def_zoom_n;

// Manual zoom state in full-screen
var man_enab_f = def_zoom_f;

/**
 * zoom_should_be_on
 * Returns true if we're in a state where zoom is supposed to currently be
 * enabled, else false.
 */
function zoom_should_be_on() {
  return ((man_enab_n && !document.fullscreenElement)
       || (man_enab_f && document.fullscreenElement));
}

/**
 * zoom_on_or_off
 * Puts zoom into the correct on/off state, as per zoom_should_be_on.
 */
function zoom_on_or_off() {
  if(zoom_should_be_on()) {
    setTimeout(zoom_on, 200);
  } else {
    zoom_off();
  }
}

/**
 * toggle_manual_enab
 * Changes the manual override zoom state for the current display mode; either
 * full-screen or non-full-screen.
 */
function toggle_manual_enab() {
  debug_log("Toggling manual enable state.");
  if(document.fullscreenElement){
    man_enab_f = !man_enab_f;
    if(man_enab_f) debug_log("Set full-screen zoom enabled.");
    else debug_log("Set full-screen zoom disabled.");
  } else {
    man_enab_n = !man_enab_n;
    if(man_enab_n) debug_log("Set non-full-screen zoom enabled.");
    else debug_log("Set non-full-screen zoom disabled.");
  }
  zoom_on_or_off();
}

/**
 * handle_keydown
 * Event handler for any keydown events, to trigger appropriate actions.
 */
function handle_keydown(e) {
  debug_log('"' + e.key + '" key was pressed.');
  if(e.key == zoom_shortcut_key.toLowerCase()) toggle_manual_enab();
  if(e.key == zoom_shortcut_key.toUpperCase()) toggle_manual_enab();
  if(e.key == "i") {
    // Workaround for bug: exiting miniplayer directly into normal view does not
    // trigger reapplication of zoom. Pressing 'i' seems to be the only way to
    // trigger this bug, so detecting the pressing of 'i' seems like a good way
    // to fix it.
    zoom_on_or_off();
  }
}

/**
 * watch_for_fullscreen
 * Start watching for changes to the full-screen state, and make sure the correct
 * zoom state is applied at each transition of full-screen state.
 * N.B. There may be a slight delay in reaction to changes in full-screen state.
 */
function watch_for_fullscreen() {
  debug_log("Adding fullscreenchange event listener.");
  document.addEventListener(
    'fullscreenchange',
    function() {
      debug_log("Full-screen state changed.");
      zoom_on_or_off();
    }
  );
}

/**
 * watch_for_keypresses
 * Start watching for keydown events and handle them when they occur.
 */
function watch_for_keypresses() {
  debug_log("Adding keydown event listener.");
  document.addEventListener(
    'keydown',
    handle_keydown
  );
}

/**
 * create_zoom_button
 * Adds a zoom button to the YouTube player controls, which toggles manual override of
 * zoom state.
 * Returns:
 *     an object representing the button
 */
function create_zoom_button() {
  var right_controls;
  var size_button;
  var tooltip_showing = false;
  var button;
  var icon_path;

  /**
   * set_zoom_button_mode
   * Sets the zoom button to an appropriate mode for the current zoom state.
   */
  function set_zoom_button_mode() {
    var l;

    if(zoom_should_be_on()) {
      icon_path.setAttribute("d",
  "m 8,11 0,14 20,0 0,-14 -20,0 z m 2,4 16,0 0,6 -16,0 0,-6 z"
                       );
      l = "Letterbox (" + zoom_shortcut_key + ")"
    } else {
      icon_path.setAttribute("d",
  "m 4,11 0,14 3,0 0,-2 -1,0 0,-10 1,0 0,-2 -3,0 z\
   m 4,0 0,14 20,0 0,-14 -20,0 z\
   m 21,0 0,2 1,0 0,10 -1,0 0,2 3,0 0,-14 -3,0 z\
   m -19,2 16,0 0,10 -16,0 0,-10 z"
                       );
      l = "Zoom and crop (" + zoom_shortcut_key + ")"
    }

    button.setAttribute("aria-label", l);
    button.setAttribute("title", l);
  }
  
  /**
   * create_zoom_button_icon
   * Adds the icon to the zoom button during initial creation of the button.
   */
  function create_zoom_button_icon() {
    // Create icon SVG element
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("height", "100%");
    s.setAttribute("version", "1.1");
    s.setAttribute("viewBox", "0 0 36 36");
    s.setAttribute("width", "100%");

    var p_id = "zac-path-1";

    // Apply shadow
    var sh = document.createElementNS("http://www.w3.org/2000/svg", "use");
    sh.setAttribute("class", "ytp-svg-shadow");
    sh.setAttribute("href", "#" + p_id);

    // Create icon path
    var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("id", p_id);
    p.setAttribute("class", "ytp-svg-fill");

    // Append path and shadow to SVG
    s.appendChild(sh);
    s.appendChild(p);

    // Append icon to button
    button.appendChild(s);

    icon_path = p;
  }
  
  /**
   * show_zoom_button_tooltip
   * Shows the tooltip associated with the zoom button in a style mimicking that
   * of the other YouTube player buttons.
   * Parameters:
   *     show     if false, the tooltip will be hidden instead of shown
   */
  function show_zoom_button_tooltip(show=true) {
    // Position calculations
    var bbcr = button.getBoundingClientRect();
    var tt_horiz_cen = bbcr.left + bbcr.width/2; // tooltip horizontal centre

    var tt_top_offset = 57; // How far above the button should the tooltip be?

    // For some reason, the existing tooltips are at a different offset in full-screen.
    if(document.fullscreenElement) {
      tt_top_offset = 75;
    }

    var tt_top = bbcr.top + bbcr.height/2 - tt_top_offset; // tooltip top

    // YouTube has an existing tooltip DOM structure that it reuses for all of its
    // player tooltips, but it's easier and more reliable to just create our own,
    // using the same classes.

    // Try to get our existing tooltip from DOM from previous run
    var tt = document.getElementById("zac-tt");

    var tt_text;

    if(!tt) {
      // Create tool-tip DOM structure if not present.
      var mp = document.getElementsByClassName("html5-video-player")[0];
      var tt_text_wrapper = document.createElement("div");
      tt = document.createElement("div");
      tt_text = document.createElement("span");

      tt.setAttribute("class", "ytp-tooltip ytp-bottom");
      tt.setAttribute("id", "zac-tt");
      tt.style.setProperty("position", "fixed");

      tt_text_wrapper.setAttribute("class", "ytp-tooltip-text-wrapper");

      tt_text.setAttribute("class", "ytp-tooltip-text");
      tt_text.setAttribute("id", "zac-tt-text");

      tt.appendChild(tt_text_wrapper);
      tt_text_wrapper.appendChild(tt_text);
      mp.appendChild(tt);
    } else {
      // If DOM structure already present, get tooltip text.
      tt_text = document.getElementById("zac-tt-text");
    }

    if(show) { // show
      tt.style.setProperty("top", tt_top + "px");
      tt_text.innerHTML = button.getAttribute("aria-label");
      tt.style.removeProperty("display"); // show the tooltip

      // Calculate horizontal position. Tooltip must be showing before
      // its width can be queried.
      var tt_width = tt.getBoundingClientRect().width;
      tt.style.setProperty("left", tt_horiz_cen - tt_width / 2 + "px");
      debug_log("tt_width = " + tt_width);
      debug_log("tt_horiz_cen = " + tt_horiz_cen);
      debug_log("tt left position = " + (tt_horiz_cen - tt_width / 2));

      // Remove button title, else the browser may (will) display it as a
      // tooltip, in addition to ours.
      button.removeAttribute("title");
    } else { // hide
      tt.style.setProperty("display", "none");
      tt_text.innerHTML = "";
      button.setAttribute("title", button.getAttribute("aria-label"));
    }

    tooltip_showing = show;

    // All of that just for a tooltip that matches the others. And it's
    // still not perfect. Sheesh.
  }
  
  /**
   * update
   * Ensures the zoom button reflects the current state.
   */
  function update() { 
    set_zoom_button_mode();
    show_zoom_button_tooltip(tooltip_showing);
  }
  
  var button_object;
  
  function add_button() {
    right_controls = document.getElementsByClassName("ytp-right-controls")[0];
    size_button = document.getElementsByClassName("ytp-size-button") [0];
    
    if(right_controls && size_button) {
      debug_log("Adding zoom and crop toggle button.")
      
      // Remove existing button if present (sometimes it persists even after a page reload)
      var existing_button = document.getElementById("zac-zoom-button");
      if(existing_button) {
        debug_log("Destroying old zoom and crop toggle button.")
        right_controls.removeChild(existing_button);
      }
      
      // Create button
      button = document.createElement("button");
      button.setAttribute("class", "ytp-button");
      button.setAttribute("id", "zac-zoom-button");

      create_zoom_button_icon();
      set_zoom_button_mode();

      // Add button to controls
      right_controls.insertBefore(button, size_button);

      // Set event handlers
      button.addEventListener("click", toggle_manual_enab);
      button.addEventListener("mouseover", function(){show_zoom_button_tooltip();});
      button.addEventListener("mouseout", function(){show_zoom_button_tooltip(false);});
      button.addEventListener("focus", function(){show_zoom_button_tooltip();});
      button.addEventListener("blur", function(){show_zoom_button_tooltip(false);});

      button_object = { 
        update : update
      }

    } else {
      // Keep trying until we have somewhere to put the button.
      debug_log("Can't add zoom and crop toggle button yet. Retrying in 200ms.")
      setTimeout(add_button, 200);
    }
  }
  
  add_button();
  return button_object;
}


// Initialise
watch_for_fullscreen();
watch_for_keypresses();
var zoom_button = create_zoom_button();
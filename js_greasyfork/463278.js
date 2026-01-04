// ==UserScript==
// @name         Youtube Music Mod
// @namespace    https://greasyfork.org
// @version      0.8
// @description  Removes the annoying video player on youtube music, adds a screensaver feature, modifies the colors and adds fade colors too
// @author       Red & one other person
// @match        https://music.youtube.com/watch*
// @match        https://music.youtube.com/*
// @icon         https://music.youtube.com/favicon.ico
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/463278/Youtube%20Music%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/463278/Youtube%20Music%20Mod.meta.js
// ==/UserScript==

let watchModActive = false;
let watchModSleepTime = GM_getValue("watchModSleepTime", 6000);
let watchModSleepStart = 0;
let watchModClicks = GM_getValue("watchModClicks", 3);

let fadeModSleepTime = GM_getValue("fadehModSleepTime", 1000);;
let fadeModSleepStart = 0;

let backgroundColor = GM_getValue("backgroundColor", '#300606')
let fadeColor = GM_getValue("fadeColor", '#000000')
let textColor = GM_getValue("textColor", '#ffffff')

let fadeTransition = GM_getValue("fadeTransition", 'background-color .3s ease')
let fadeShadowTransition = GM_getValue("fadeShadowTransition", 'box-shadow .3s ease')

let configOpen = false;

let doneNonWatchStyles = false;
let doneWatchStyles = false;

let previewRotation = false;

function doNonWatchStyles(initial=false, bg) {
  bg = bg ? bg : backgroundColor
  if (doneNonWatchStyles) return;

  const element_list_background = document.querySelector("ytmusic-section-list-renderer");
  element_list_background.style.backgroundColor = bg;
  if (initial) addFade(element_list_background);

  doneNonWatchStyles = true;
}

function doWatchStyles(initial=false, bg) {
  bg = bg ? bg : backgroundColor
  if (doneWatchStyles) return;

  let element_favorites = document.getElementById("items");
  if (element_favorites != null){ element_favorites.remove(); }

  doneWatchStyles = true;
}

function reset_watchModSleepStart(additionalTime = 0) {
  if (typeof additionalTime !== 'number' || isNaN(additionalTime)) additionalTime = 0;
  watchModSleepStart = Date.now() + additionalTime;
  fadeModSleepStart = Date.now() + additionalTime;
}

function updateWatchElement() {
  let watchElement = document.querySelector(".watch-element");
  let contentInfo = document.querySelector(".content-info-wrapper.ytmusic-player-bar");
  if (!watchElement) return;
  let clickCount = parseInt(watchElement.getAttribute('data-click-count'), 10);
  clickCount = isNaN(clickCount) ? 0 : clickCount;
  if (clickCount >= watchModClicks) return;
  if (!contentInfo) {
    setTimeout(updateWatchElement, 100);
    return;
  }
  watchElement.children[0].innerHTML = contentInfo.children[0].innerHTML;
  setTimeout(updateWatchElement, 5000);
}

function checkWatchElement() {
  let watchElement = document.querySelector(".watch-element");

  if (!watchElement) return;

  let currentTime = Date.now();
  let timeElapsed = currentTime - watchModSleepStart;

  if (timeElapsed >= watchModSleepTime) {
    watchElement.style.zIndex = 5;
    watchElement.style.opacity = '1';
    watchElement.setAttribute('data-click-count', '0');
    movePreviewToWatch();
    setTimeout(updateWatchElement, 100)
  } else {
    setTimeout(checkWatchElement, 100);
  }
}

function checkFade() {
  let currentTime = Date.now();
  let timeElapsed = currentTime - fadeModSleepStart;
  const element_navBar = document.querySelector("ytmusic-nav-bar");
  current_bg = element_navBar.style.backgroundColor

  if (timeElapsed >= fadeModSleepTime) {
    if (current_bg !== fadeColor) {
      doneWatchStyles = false;
      doneNonWatchStyles = false;
      run(false, fadeColor, backgroundColor)
    }

    setTimeout(checkFade, 50);
  } else {
    if (current_bg !== backgroundColor) {
      doneWatchStyles = false;
      doneNonWatchStyles = false;
      run(false, backgroundColor, fadeColor)
    }

    setTimeout(checkFade, 50);
  }
}

function fullscreen_div() {
  let fullscreen = document.createElement('div');
  fullscreen.className = 'watch-element';
  fullscreen.style.position = 'absolute';
  fullscreen.style.top = '0';
  fullscreen.style.left = '0';
  fullscreen.style.width = '100%';
  fullscreen.style.height = '100%';
  fullscreen.style.alignItems = 'center';
  fullscreen.style.justifyContent = 'center';
  fullscreen.style.userSelect = 'none';
  fullscreen.style.display = 'flex';
  fullscreen.style.flexDirection = 'column';
  return fullscreen
}

function addWatch() {
  console.log('Adding watch mod...');

  watchModActive = true;
  setTimeout(doWatchStyles(), 100);

  let watchElement = fullscreen_div();
  let watchText = document.createElement("p");
  let gearIcon = makeGearIcon();

  watchElement.style.backgroundColor = 'black';
  // Automatically set / reset to 0 depending on state
  // watchElement.style.zIndex = 5;
  watchElement.style.opacity = 0;
  watchElement.style.transition = 'opacity 1s ease';

  watchText.style.color = "#202020";
  watchText.style.fontSize = 'xx-large';

  gearIcon.style.position = 'absolute';
  gearIcon.style.top = "0";
  gearIcon.style.right = "0";
  gearIcon.style.opacity = 0.2;

  watchElement.appendChild(watchText)
  watchElement.appendChild(gearIcon);


  document.body.appendChild(watchElement);
  reset_watchModSleepStart(2000);
  // account for youtube music load time here
  setTimeout(checkWatchElement, 2000);

  watchElement.addEventListener('click', (event) => {
    let clickCount = parseInt(watchElement.getAttribute('data-click-count'), 10);
    clickCount = isNaN(clickCount) ? 0 : clickCount;
    clickCount++;
    watchElement.setAttribute('data-click-count', clickCount.toString());

    if (clickCount < watchModClicks)  {
      watchElement.children[0].innerHTML = `Press ${watchModClicks - clickCount} times to exit to YouTube Music UI`;
      event.stopPropagation();
    } else if (clickCount === watchModClicks) {
      watchElement.children[0].innerHTML = '';
      watchElement.style.opacity = 0;
      reset_watchModSleepStart();

      setTimeout(() => {
        watchElement.style.zIndex = 0;
      }, 1000)

      setTimeout(checkWatchElement, 1000);
      movePreviewFromWatch();
    } else {
      reset_watchModSleepStart();
    }
  });
};

function removeWatch() {
  console.log('Removing watch mod...');
  watchModActive = false;
  let watchElement = document.querySelector(".watch-element");
  if (!watchElement) return;
  watchElement.remove();
  setTimeout(doNonWatchStyles(), 100);
}

function checkWatch() {
  if (window.location.pathname.endsWith('watch')) {
    switch (watchModActive) {
      case true:
        break;
      case false:
        addWatch();
        break;
    }
    return true;
  } else {
    switch (watchModActive) {
      case false:
        break;
      case true:
        removeWatch();
        break;
    }
    return false;
  }
}

function updatePreview() {
  const musicPreviewImage = document.querySelector("#music-preview-image");
  if (!musicPreviewImage) {return;}

  // update the image
  const image = document.querySelector(".image.style-scope.ytmusic-player-bar");
  musicPreviewImage.src = image.src;
}

function movePreviewToWatch() {
  const musicPreview = document.querySelector("#music-preview");
  const watchElement = document.querySelector(".watch-element");

  watchElement.appendChild(musicPreview);
  musicPreview.style.width = '10vh';
  musicPreview.style.position = 'absolute';
  musicPreview.style.margin = '0 0 50vh';
  musicPreview.style.opacity = '.5';
}

function movePreviewFromWatch() {
  const musicPreview = document.querySelector("#music-preview");
  const element_guide_sections = document.querySelector("#sections");
  element_guide_sections.appendChild(musicPreview);
  musicPreview.style.width = '50%';
  musicPreview.style.position = '';
  musicPreview.style.margin = '25%';
  musicPreview.style.marginTop = 'auto';
  musicPreview.style.opacity = '';
}

function updatePreviewRotation() {
  const musicPreviewImage = document.querySelector("#music-preview-image");
  if (!musicPreviewImage) {return;}

  previewRotation = !previewRotation;

  if (previewRotation){ // reversed
    musicPreviewImage.style.transition = 'transform 5s ease'
    musicPreviewImage.style.transform = `rotateZ(${360}deg)`
  } else {
    musicPreviewImage.style.transition = ''
    musicPreviewImage.style.transform = `rotateZ(${0}deg)`
    setTimeout(updatePreviewRotation, 100);
  }
}

function setPreviewShadow(bg, musicPreview=undefined) {
  musicPreview = musicPreview ? musicPreview : document.querySelector("#music-preview");
  if (!musicPreview) {return;}
  musicPreview.style.boxShadow = `0 0 10px ${bg}`
}

function addPreview(bg) {
  console.log('Adding spinning disk');
  const renderer = document.querySelector(".ytmusic-guide-section-renderer");
  if (!renderer) { setTimeout(() => addPreview(bg), 200); return; }

  // remove youtube junk
  const element_guide_sections = document.querySelector("#sections");
  const elementsToRemove = element_guide_sections.querySelectorAll('.ytmusic-guide-renderer');

  elementsToRemove.forEach(element => {
    element.remove();
  });

  // make music preview
  let musicPreview = document.createElement('div');
  let musicPreviewImage = document.createElement('img');
  musicPreviewImage.alt = "loading mod...";
  musicPreviewImage.style.width = "100%"
  musicPreviewImage.style.height = "100%"
  musicPreviewImage.style.borderRadius = '50%';
  musicPreviewImage.style.objectFit = 'cover';
  musicPreviewImage.style.zIndex = '6';
  musicPreviewImage.style.display = 'flex';
  musicPreviewImage.style.placeItems = 'center'
  musicPreviewImage.style.justifyContent = 'center'
  musicPreviewImage.id = "music-preview-image"

  musicPreview.id = "music-preview"
  musicPreview.style.display = 'flex';
  musicPreview.style.width = '50%';
  musicPreview.style.aspectRatio = '1/1';
  musicPreview.style.margin = '25%';
  musicPreview.style.marginTop = 'auto';
  musicPreview.style.borderRadius = '50%';
  addFadeShadow(musicPreview);
  setPreviewShadow(bg, musicPreview);

  musicPreview.appendChild(musicPreviewImage);
  element_guide_sections.appendChild(musicPreview);
  setInterval(updatePreview, 5000);
  setInterval(updatePreviewRotation, 5000);

  console.log('Added spinning disk');
}

function run(initial=false, bg=undefined, reverse_bg=undefined) {
  bg = bg ? bg : backgroundColor
  reverse_bg = reverse_bg ? reverse_bg : fadeColor;
  if (initial){
    const elementToObserve = document.querySelector("#main-panel");
    const observer = new MutationObserver(function() {
      elementToObserve.remove();
    });

    observer.observe(elementToObserve, {subtree: true, childList: true});
  }

  const element_sideBar = document.querySelector("#contents");
  element_sideBar.style.width = "100%";
  element_sideBar.style.margin = "0px";
  element_sideBar.style.maxWidth = "none";
  element_sideBar.style.backgroundColor = bg
  if (initial) addFade(element_sideBar);

  const element_sidePanel = document.querySelector("#side-panel");
  element_sidePanel.style.width = "100%";
  element_sideBar.style.margin = "0px";
  element_sidePanel.style.padding = "0px";
  element_sidePanel.style.maxWidth = "none";

  const element_top_background = document.querySelector("#nav-bar-background");
  element_top_background.style.backgroundColor = bg
  if (initial) addFade(element_top_background);

  const element_bottom_background = document.querySelector("#player-bar-background");
  element_bottom_background.style.backgroundColor = bg
  if (initial) addFade(element_bottom_background);

  const element_navBar = document.querySelector("ytmusic-nav-bar");
  element_navBar.style.backgroundColor = bg;
  if (initial) addFade(element_navBar);

  const element_player_background = document.querySelector("#player-page");
  element_player_background.style.backgroundColor = bg;
  if (initial) addFade(element_player_background);

  const element_guide_background = document.querySelector("#guide-renderer");
  element_guide_background.style.backgroundColor = bg;
  if (initial) addFade(element_guide_background);

  const element_bottomBar = document.querySelector('ytmusic-player-bar');
  element_bottomBar.style.backgroundColor = bg
  if (initial) addFade(element_bottomBar);

  const element_musicList = document.querySelector('ytmusic-tab-renderer');
  element_musicList.addEventListener("scroll", reset_watchModSleepStart);

  //const element_sidePanel = document.querySelectorAll(".content.style-scope.ytmusic-player-page");
  //element_sidePanel.style.width = "100%";
  //element_sidePanel.style.padding = "0px";

  if (initial) { addPreview(reverse_bg); }
  else {
    setPreviewShadow(reverse_bg);
  }

  const watch = checkWatch();

  if (watch) {
    doWatchStyles(initial, bg);
  } else {
    doNonWatchStyles(initial, bg);
  }
  if (initial) {
    addConfig(element_navBar);
    checkFade();
  }
}

function makeGearIcon() {
  let gearIcon = document.createElement('a');
  gearIcon.innerHTML = `<?xml version="1.0" ?>
<!-- License: CC Attribution. Made by nixx design: https://dribbble.com/nixxdsgn -->
<svg width="64px" height="64px" viewBox="-4 -4 14.3499998 14.3499998" id="svg8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs2"/><path d="m 3.1757813,2.1171875 c -0.5813565,0 -1.0585938,0.4772372 -1.0585938,1.0585938 0,0.5813565 0.4772373,1.0566406 1.0585938,1.0566406 0.5813565,-1e-7 1.0566406,-0.4752841 1.0566406,-1.0566406 -2e-7,-0.5813565 -0.4752841,-1.0585938 -1.0566406,-1.0585938 z m 0,0.5292968 c 0.2953736,0 0.5292968,0.2339233 0.5292968,0.5292969 0,0.2953736 -0.2339232,0.5292968 -0.5292968,0.5292968 -0.2953736,0 -0.5292969,-0.2339232 -0.5292969,-0.5292968 0,-0.2953736 0.2339233,-0.5292969 0.5292969,-0.5292969 z" id="path1863" style="color:#000000;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-feature-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000000;solid-opacity:1;vector-effect:none;fill:#ff2876;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.52916664;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:204.09448242;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate"/><path d="m 3.0576947,0.52916665 c -0.366361,0 -0.6282933,0.2735658 -0.7260541,0.61029865 C 2.0244302,0.97049867 1.6460313,0.96207812 1.3869954,1.2211141 L 1.2211141,1.3869954 C 0.96207812,1.6460313 0.97049867,2.0244301 1.1394653,2.3316406 0.80273245,2.4294014 0.52916665,2.6913336 0.52916665,3.0576946 v 0.2346106 c 0,0.3663609 0.2735658,0.6282931 0.61029865,0.726054 -0.16886958,0.30719 -0.17734508,0.6856513 0.081649,0.9446453 l 0.1658813,0.1658813 c 0.2590359,0.2590361 0.6374347,0.2506157 0.9446452,0.081649 0.097761,0.3367331 0.3596932,0.6102987 0.726054,0.6102987 h 0.2346108 c 0.3663609,0 0.6282931,-0.2735656 0.7260539,-0.6102986 0.3071899,0.1688698 0.6856512,0.1773454 0.944645,-0.081649 L 5.1288858,4.9630045 c 0.258994,-0.258994 0.2505186,-0.6374553 0.081649,-0.9446453 0.3367333,-0.097761 0.610299,-0.359693 0.610299,-0.7260539 V 3.0576946 c 0,-0.366361 -0.2735657,-0.6282932 -0.610299,-0.726054 C 5.3795015,2.0244301 5.3879219,1.6460312 5.1288858,1.3869954 L 4.9630045,1.2211141 C 4.7039687,0.96207812 4.3255698,0.97049875 4.0183592,1.1394653 3.9205984,0.80273245 3.6586662,0.52916665 3.2923053,0.52916665 Z m 0,0.52916665 h 0.2346106 c 0.1596094,0 0.2795696,0.1199602 0.2795696,0.2795695 v 0.109554 a 0.26460978,0.26460978 0 0 0 0.1720827,0.2480469 c 0.026864,0.010056 0.053302,0.020543 0.079582,0.032039 A 0.26460978,0.26460978 0 0 0 4.116545,1.6722486 l 0.076998,-0.076998 c 0.1128866,-0.1128863 0.2824387,-0.1128861 0.3953248,0 l 0.1658813,0.1658812 c 0.1128863,0.1128862 0.1128863,0.2824386 0,0.3953249 l -0.077515,0.077515 a 0.26460978,0.26460978 0 0 0 -0.053227,0.2981734 c 0.012086,0.026115 0.023458,0.052332 0.034107,0.079065 A 0.26460978,0.26460978 0 0 0 4.9040933,2.7781249 H 5.012097 c 0.1596096,0 0.2795695,0.1199602 0.2795695,0.2795697 v 0.2346106 c 0,0.1596094 -0.1199599,0.2795696 -0.2795695,0.2795696 H 4.902543 A 0.26460978,0.26460978 0 0 0 4.6544961,3.7439575 c -0.010057,0.026864 -0.020542,0.053302 -0.032039,0.079582 a 0.26460978,0.26460978 0 0 0 0.055294,0.2930054 l 0.076998,0.076998 c 0.1128866,0.1128861 0.1128866,0.2824387 0,0.3953248 L 4.588867,4.7547483 c -0.1128858,0.1128866 -0.2824387,0.1128866 -0.3953248,0 L 4.1160278,4.6772336 A 0.26460978,0.26460978 0 0 0 3.8178549,4.6240066 c -0.026114,0.012086 -0.052332,0.023458 -0.079065,0.034107 a 0.26460978,0.26460978 0 0 0 -0.166915,0.2459796 v 0.1080037 c 0,0.1596096 -0.1199602,0.2795695 -0.2795696,0.2795695 H 3.0576947 c -0.1596095,0 -0.2795697,-0.1199599 -0.2795697,-0.2795695 V 4.902543 A 0.26460978,0.26460978 0 0 0 2.6060426,4.6544961 c -0.026864,-0.010056 -0.053302,-0.020543 -0.079582,-0.032039 a 0.26460978,0.26460978 0 0 0 -0.2930054,0.055294 l -0.076998,0.076998 c -0.1128862,0.1128866 -0.2824386,0.1128866 -0.3953249,0 L 1.5952515,4.588867 c -0.112886,-0.1128858 -0.112886,-0.2824387 0,-0.3953248 l 0.077515,-0.077514 a 0.26460978,0.26460978 0 0 0 0.053227,-0.298173 C 1.7139075,3.7917409 1.7025344,3.7655228 1.6918865,3.7387896 A 0.26460978,0.26460978 0 0 0 1.4459066,3.5718748 H 1.3379028 c -0.1596093,0 -0.2795695,-0.1199602 -0.2795695,-0.2795696 V 3.0576946 c 0,-0.1596095 0.1199602,-0.2795697 0.2795695,-0.2795697 h 0.109554 A 0.26460978,0.26460978 0 0 0 1.6955037,2.6060425 c 0.010056,-0.026864 0.020543,-0.053302 0.032039,-0.079582 A 0.26460978,0.26460978 0 0 0 1.6722493,2.2334553 l -0.076998,-0.076998 c -0.112886,-0.112886 -0.112886,-0.2824387 0,-0.3953246 L 1.7611328,1.5952515 c 0.1128859,-0.1128861 0.2824387,-0.1128861 0.3953247,0 l 0.077515,0.077515 a 0.26460978,0.26460978 0 0 0 0.2992065,0.05271 c 0.02611,-0.012235 0.052844,-0.023829 0.079582,-0.034623 A 0.26460978,0.26460978 0 0 0 2.778125,1.4453898 v -0.107487 c 0,-0.1596093 0.1199602,-0.2795695 0.2795697,-0.2795695 z" id="circle1865" style="color:#000000;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-feature-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000000;solid-opacity:1;vector-effect:none;fill:#00001d;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.52916664;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:204.09448242;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate"/></svg>`

  gearIcon.style.display = "flex";
  gearIcon.style.alignItems = "center";
  gearIcon.children[0].style.backgroundColor = "#ffffff10";
  gearIcon.children[0].style.borderRadius = "50px";
  gearIcon.children[0].style.marginLeft = "10px";
  gearIcon.children[0].style.marginRight = "10px";
  gearIcon.addEventListener("click", open_config);
  addHover(gearIcon);
  return gearIcon
}

function addConfig(navElement) {
  let navCenter = navElement.querySelector('.center-content');

  let gearIcon = makeGearIcon();
  gearIcon.innerHTML = gearIcon.innerHTML+"YouTube Music mod";

  navCenter.appendChild(gearIcon);
}

function open_config(event) {
  if (typeof event === "object") {
    event.stopPropagation();
  }
  if (configOpen) {
    document.getElementById("confcon").remove();
    document.querySelector("ytmusic-app-layout").style.display = "";
    configOpen = false;
    return;
  } else { configOpen = true;}

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelector("ytmusic-app-layout").style.display = "none";

  let configContainer = fullscreen_div();
  let configElement = document.createElement('div');

  configContainer.style.zIndex = 6;
  configContainer.style.backgroundColor = "black";
  configContainer.id = "confcon";
  configElement.style.width = "500px"
  configElement.style.maxWidth = "90%";
  configElement.style.height = "500px"
  configElement.id = "confelem";
  configElement.style.outline = "1px solid white";
  configElement.style.border = "1px solid black";
  configElement.style.backgroundColor = backgroundColor;
  configElement.style.padding = "10px";

  addTextAlign(configElement, "h1", "YouTube Music Mod Configuration", "center")
  let gearIcon = makeGearIcon();
  gearIcon.style.position = 'absolute';
  gearIcon.style.top = "0";
  gearIcon.style.right = "0";

  addColorConfig(configElement, "Background color", "backgroundColor", backgroundColor, (value) => { backgroundColor = value; });
  addColorConfig(configElement, "Fade color", "fadeColor", fadeColor, (value) => { fadeColor = value; });
  addNumberConfig(configElement, "Miliseconds before fade", "fadeModSleepTime", fadeModSleepTime, (value) => { fadeModSleepTime = value; });
  addNumberConfig(configElement, "Miliseconds before screensaver", "watchModSleepTime", watchModSleepTime, (value) => { watchModSleepTime = value; });
  addNumberConfig(configElement, "Screensaver clicks required", "watchModClicks", watchModClicks, (value) => { watchModClicks = value; });
  addTextConfig(configElement, "Fade transition css", "fadeTransition", fadeTransition, (value) => { fadeTransition = value; addFade(); });
  addTextConfig(configElement, "Shadow fade transition css", "fadeShadowTransition", fadeShadowTransition, (value) => { fadeShadowTransition = value; addFadeShadow(); });

  configContainer.appendChild(gearIcon);
  configContainer.appendChild(configElement);
  document.body.appendChild(configContainer);
}

function addText(configElement, elementName, text) {
  let textElement = document.createElement(elementName);
  textElement.innerHTML = text;
  configElement.appendChild(textElement);
  return textElement;
}

function addTextAlign(configElement, elementName, text, align) {
  let textElement = addText(configElement, elementName, text);
  textElement.style.textAlign = align;
  textElement.style.color = textColor;
  return textElement;
}
function addInputConfig(configElement, text, key, value, ch) {
  let inputContainer = document.createElement('div');
  let textElement = document.createElement('h2');
  let inputElement = document.createElement('input');
  inputElement.value = value;
  inputElement.style.flexGrow = "1";
  inputElement.addEventListener("change", (e) => {
    const result = parseInt(e.target.value);
    const convertedValue = isNaN(result) ? e.target.value : result;
    ch(convertedValue);
    GM_setValue(key, convertedValue);
    open_config();
    open_config();
    doneWatchStyles = false;
    doneNonWatchStyles = false;
    run();
  })

  textElement.innerHTML = text;
  inputElement.style.backgroundColor = backgroundColor;
  inputElement.style.border = '1px dashed white';
  inputElement.style.borderRadius = "50px";
  inputElement.style.outline = "none";
  inputElement.style.padding = "5px 15px";
  textElement.style.color = textColor;
  inputElement.style.color = textColor;
  textElement.style.flexGrow = "1";

  inputContainer.style.display = "flex";
  inputContainer.style.width = "100%";

  inputContainer.appendChild(textElement);
  inputContainer.appendChild(inputElement);
  configElement.appendChild(inputContainer);
  return inputElement;
}
function addColorConfig(configElement, text, key, value, ch) {
  let colorElement = addInputConfig(configElement, text, key, value, ch);
  colorElement.type = 'color';
  colorElement.style.outline = "1px solid black";
  colorElement.style.border = "1px solid white";
  return colorElement;
}
function addNumberConfig(configElement, text, key, value, ch) {
  let numberElement = addInputConfig(configElement, text, key, value, ch);
  numberElement.type = 'number';
  return numberElement;
}
function addTextConfig(configElement, text, key, value, ch) {
  let textElement = addInputConfig(configElement, text, key, value, ch);
  textElement.type = 'text';
  return textElement;
}

function addHover(myLink) {
  myLink.addEventListener('mouseover', function() {
    this.style.cursor = 'pointer';
  });

  myLink.addEventListener('mouseout', function() {
    this.style.cursor = 'auto';
  });
}

function addFade(element) {
  if (element){
    element.style.transition = fadeTransition;
    element.classList.add('added-fade');
  }
  else {
    const allElements = document.querySelectorAll('.added-fade');
    allElements.forEach((el) => {
      el.style.transition = fadeTransition;
    });
  }
}
function addFadeShadow(element) {
  if (element){
    element.style.transition = fadeShadowTransition;
    element.classList.add('added-fade-shadow');
  }
  else {
    const allElements = document.querySelectorAll('.added-fade-shadow');
    allElements.forEach((el) => {
      el.style.transition = fadeShadowTransition;
    });
  }
}

if (window.trustedTypes && window.trustedTypes.createPolicy) {

  window.trustedTypes.createPolicy('default', {

  createHTML: string => string,

  createScriptURL: string => string,

  createScript: string => string,

  });

}
setTimeout(function () {
  setInterval(checkWatch, 500);
  document.addEventListener("pointerdown", reset_watchModSleepStart);
  document.addEventListener("click", reset_watchModSleepStart);
  document.addEventListener("mousemove", reset_watchModSleepStart);
  run(true);
}, 100);



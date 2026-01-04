// ==UserScript==
// @name               YouTube Like/Dislike Shortcuts
// @name:pt-BR         Atalhos Gostei/Não Gostei no YouTube
// @namespace          YTLDS
// @author             warib64
// @description        Enables keyboard shortcuts to like/dislike a video on YouTube.
// @description:pt-BR  Cria atalhos para os botões gostei/não gostei em um vídeo no YouTube.
// @match              *://*.youtube.com/*
// @license            MIT
// @version            5.3
// @downloadURL https://update.greasyfork.org/scripts/481980/YouTube%20LikeDislike%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/481980/YouTube%20LikeDislike%20Shortcuts.meta.js
// ==/UserScript==

// You can change the codes to whichever keys you want to use for liking, disliking, and opening or writing comments on Shorts.
const codeLike = "NumpadAdd";
const codeDislike = "NumpadSubtract";
const codeComments = "NumpadMultiply";
// Don't use a key that only types its character once you type another, or it will be inserted when you type your comment if you don't hit backspace.
const codeWrite = "NumpadDivide";

/* Filling in these quotation marks with the code of a key creates an additional shortcut dedicated to removing your like/dislike,
   that makes it so that pressing the regular shortcuts for liking/disliking multiple times has no effect on the state of that button.
   If you want to use the regular shortcuts for removing likes/dislikes as well, leave this blank. */
let codeRemove = " ";

// Change this to true (no quotation marks) if you want to return to where you previously were, instead of always to the top of the page, after scrolling to the comments.
const savePosition = false;

// If you want the shortcuts to be triggered only when holding ctrl, shift, or alt (not altgr), change this value from 0 to 1, 2, or 3, respectively.
const combination = 0;

// Change this to 0 if you don't want the sound alert. 1 only triggers the alert on regular videos, 2 triggers it on Shorts as well.
const alertPlays = 2;

// Change these values if you want to change the volume percentage of the alerts from their default (value must be between in the 0-100 range).
const likeVolumePercentage = 50;
const dislikeVolumePercentage = 30;

// You can change the sounds for the alerts by using your own audio file URLs or base64 encoded data.
const likeSound = new Audio(`
  data:audio/mp3; base64,
  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
`);

const dislikeSound = new Audio(`
  data:audio/mp3; base64,
  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
`);

//    /\/\/\   Settings   /\/\/\
//  ------------------------------
//    \/\/\/     Code     \/\/\/

let started = false, isShort = false, rendererId = 0, shortsArray = [];
let buttons, adButtons, like, dislike, sLike, sDislike, sCC, openComments, closeComments, panel, isOpen, position, isScrolled, flexy, textbox, commentBox, fsComments, fsSection, fsBox;

if (typeof(codeRemove) === "string") {codeRemove = codeRemove.trim();}

if (alertPlays != 0) {
  likeSound.preload = "auto";
  likeSound.volume = likeVolumePercentage/100;
  dislikeSound.preload = "auto";
  dislikeSound.volume = dislikeVolumePercentage/100;
}

const observer = new MutationObserver(findButtons);
const panelObserver = new MutationObserver(mutations =>
  mutations.forEach(({target}) =>
    isOpen = (target.getAttribute("visibility") === "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED")
  )
);

if (!started) {
  reset();
  if (isShort && !buttons) {
    const initialShortInterval = setInterval(() => {
      findButtons();
      if (openComments) {
        clearInterval(initialShortInterval);
      }
    }, 400);
  }
}

addEventListener('yt-page-data-updated', () => {
  if (!isShort) {
    rendererId = 0;
    reset();
}});

function alert(element) {
  if (checkPressed(element)) {return;}
  if (element === dislike || element === sDislike) {dislikeSound.play();}
  else {likeSound.play();}
}

function checkPressed(element) {
  return (element.getAttribute("aria-pressed") === "true");
}

function findButtons() {
  if ((like && dislike) || (openComments && sLike && sDislike && sCC)) {
    addEventListener("keyup", press, true);
    observer.disconnect();
    if (isShort) {
      let currentURL = location.href, firstEncounter = true;
      const shortInterval = setInterval(() => {
        if (firstEncounter) {
          getId(location.href);
          firstEncounter = false;
        }
        if (location.href !== currentURL) {
          clearInterval(shortInterval);
          currentURL = location.href;
          rendererId = getId(location.href);
          reset();
        }
      }, 400);
      const ccInterval = setInterval(() => {
        if (!closeComments) {
          if (!panel) {panel = document.querySelector('ytd-shorts [target-id="engagement-panel-comments-section"]');}
          else {closeComments = panel.querySelector('#header #visibility-button button');}
        } else {
          clearInterval(ccInterval);
          if (isOpen == null) {isOpen = (panel.getAttribute("visibility") === "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");}
          panelObserver.observe(panel, {attributeFilter: ["visibility"]});
        }
      }, 200);
    }
  } else if (isShort) {
    if (!sCC) {
      const sCCInterval = setInterval(() => {
        let container = document.querySelectorAll('.reel-video-in-sequence-new')[rendererId].querySelector('ytd-reel-video-renderer #player-container');
        sCC = container.querySelector('.player-controls');
        if (sCC) {
          clearInterval(sCCInterval);
          sCC = sCC.querySelector('ytm-closed-captioning-button button');
        }
      }, 300);
    }
    adButtons = document.querySelectorAll('.reel-video-in-sequence-new')[rendererId]?.querySelector('ytd-ad-slot-renderer reel-action-bar-view-model');
    if (adButtons) {
      buttons = adButtons.querySelectorAll('button');
      if (buttons.length === 0) {return;}
      sLike = buttons[0];
      sDislike = buttons[1];
      openComments = buttons[2];
    } else {
      buttons = document.querySelectorAll('.reel-video-in-sequence-new')[rendererId]?.querySelector('#actions');
      if (!buttons) {return;}
      sLike = buttons.querySelector('like-button-view-model button');
      sDislike = buttons.querySelector('dislike-button-view-model button');
      openComments = buttons.querySelector('reel-action-bar-view-model>button-view-model button');
    }
  } else {
    like = document.querySelector('like-button-view-model button');
    dislike = document.querySelector('dislike-button-view-model button');
  }
}

function getCommentBox(mode) {
  if (!flexy) {flexy = document.querySelector('ytd-watch-flexy');}
  if (flexy.hasAttribute('fullscreen')) {return true;}
  else if (!commentBox) {
    if (savePosition) {position = document.documentElement.scrollTop || document.body.scrollTop;}
    else {position = 0;}
    document.querySelector('#bottom-row').scrollIntoView();
    const commentBoxInterval = setInterval(() => {
      commentBox = document.querySelector('div.style-scope.ytd-comment-simplebox-renderer yt-formatted-string');
      if (commentBox) {
        scrollOrFocus(mode);
        clearInterval(commentBoxInterval);
      }
    }, 300);
  } else {scrollOrFocus(mode);}
}

function scrollOrFocus(mode) {
  switch (mode) {
    case 0:
      commentBox.focus();
      isScrolled = true;
      break;
    case 1:
      if (isScrolled) {
        document.documentElement.scrollTop = document.body.scrollTop = position;
        isScrolled = false;
      } else {
        if (isScrolled === false && savePosition) {position = document.documentElement.scrollTop || document.body.scrollTop;}
        commentBox.scrollIntoView();
        isScrolled = true;
      }
      break;
    case 2:
      if (!fsComments) {fsComments = flexy.querySelector('yt-player-quick-action-buttons>toggle-button-view-model button');}
      fsComments.click();
      break;
  }
}

function getId(href) {
  let i;
  for(i = 0; i < shortsArray.length; i++) {
    if (href === shortsArray[i]) {return i;}
  }
  shortsArray.push(href);
  return i;
}

function press(e) {
  if (e.target.getAttribute("contenteditable") === "true") {return;}

  let tag = e.target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") {return;}

  switch (combination) {
    case 1:
      if (!e.ctrlKey) {return;}
      break;
    case 2:
      if (!e.shiftKey) {return;}
      break;
    case 3:
      if (!e.altKey) {return;}
      break;
  }

  switch (e.code) {
    case codeComments:
      if (openComments) {showComments();}
      else if (getCommentBox(1)) {scrollOrFocus(2);}
      break;
    case codeWrite:
      e.preventDefault();
      e.stopPropagation();
      if (textbox) {
        showComments(true);
        setTimeout(() => {
          textbox.click();
        }, 100);
      } else if (openComments) {
        showComments(true);
        const textboxInterval = setInterval(() => {
          if (!textbox) {
            textbox = document.querySelector('#simplebox-placeholder');
          } else {
            textbox.focus();
            clearInterval(textboxInterval);
          }
        }, 300);
      } else {
        if (getCommentBox(0)) {
          if (!fsSection) {fsSection = flexy.querySelector('ytd-engagement-panel-section-list-renderer #content ytd-section-list-renderer');}
          if (!fsSection.hasAttribute('panel-content-visible')) {scrollOrFocus(2);}
          if (!fsBox) {
            const headerInterval = setInterval(() => {
              let header = fsSection.querySelector('#contents #header');
              if (header.hasChildNodes()) {
                fsBox = header.querySelector('#simplebox-placeholder');
                if (fsBox) {
                  clearInterval(headerInterval);
                  fsBox.click();
                }
              }
            }, 300);
          } else {fsBox.click();}
        }
      }
      break;
    case codeLike:
      if (like) {
        if (codeRemove && checkPressed(like)) {break;}
        if (alertPlays !== 0) {alert(like);}
        like.click();
      }
      else if (sLike) {
        if (codeRemove && checkPressed(sLike)) {break;}
        if (alertPlays === 2) {alert(sLike);}
        sLike.click();
      }
      break;
    case codeDislike:
      if (dislike) {
        if (codeRemove && checkPressed(dislike)) {break;}
        if (alertPlays !== 0) {alert(dislike);}
        dislike.click();
      }
      else if (sDislike) {
        if (codeRemove && checkPressed(sDislike)) {break;}
        if (alertPlays === 2) {alert(sDislike);}
        sDislike.click();
      }
      break;
    case codeRemove:
      if (like) {
        if (checkPressed(like)) {like.click();}
        else if (checkPressed(dislike)) {dislike.click();}
      } else if (sLike) {
        if (checkPressed(sLike)) {sLike.click();}
        else if (checkPressed(sDislike)) {sDislike.click();}
      }
      break;
    case "KeyC":
      if (sCC) {sCC.click();}
      break;
  }
}

function reset() {
  isVideo = /^\/watch/.test(location.pathname);
  isShort = /^\/shorts/.test(location.pathname);
  if (isVideo||isShort) {
    removeEventListener("keyup", press, true);
    panelObserver.disconnect;
    observer.observe(document.documentElement, {childList: true, subtree: true});
    short = like = dislike = sLike = sDislike = sCC = commentBox = fsBox = openComments = panel = closeComments = textbox = position = isScrolled = null;
    findButtons();
  }
  if (!started) {started = true;}
}

function showComments(write = false) {
  if (!isOpen) {
    openComments.click();
  } else if (!write) {
    closeComments.click();
  }
}
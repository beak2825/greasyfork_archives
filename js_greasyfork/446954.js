// ==UserScript==
// @name          Youtube: expand description and long comments; show all the replies
// @description   Video description, long comments and list of subscriptions are expanded automatically; all the replies are shown after pressing "Show more replies" button
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.youtube.com/*
// @match         *://*.youtu.be/*
// @icon          https://cdn.icon-icons.com/icons2/1488/PNG/512/5295-youtube-i_102568.png
// @version       1.3.5
// @license       MIT
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/446954/Youtube%3A%20expand%20description%20and%20long%20comments%3B%20show%20all%20the%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/446954/Youtube%3A%20expand%20description%20and%20long%20comments%3B%20show%20all%20the%20replies.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //WORKAROUND: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  var gm_css = `
  #yt_expand_desc_comments_replies * {
    font-family: Roboto, Arial, sans-serif !important;
  }
  #yt_expand_desc_comments_replies .config_header {
    font-size: 20px !important;
    font-weight: bold !important;
  }
  #yt_expand_desc_comments_replies .field_label {
    font-size: 13px !important;
    font-weight: 400 !important;
  }
  #yt_expand_desc_comments_replies input[type="text"] {
    width: 50px !important;
    font-size: 12px !important;
    font-weight: bold !important;
    border-radius: 3px !important;
  }
  #yt_expand_desc_comments_replies button {
    font-size: 12px !important;
  }`;

  var gm_frameStyle = `border: 2px solid rgb(0, 0, 0); border-radius: 6px; height: 50%; width: 30%; margin: 0px; max-height: 350px; max-width: 95%; min-height: 350px; min-width: 500px; opacity: 1; overflow: auto; padding: 0px; position: fixed; z-index: 9999; display: block;`;

  GM_config.init({
    id: 'yt_expand_desc_comments_replies',
    title: 'Settings for "' + GM_info.script.name + '" script',
    css: gm_css,
    frameStyle: gm_frameStyle,
    fields: {
      'fldExpandDesc': {
        'label': 'Expand video description',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldExpandLongComments': {
        'label': 'Expand long comments',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldExpandLongReplies': {
        'label': 'Expand long replies to comments',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldShowAllReplies': {
        'label': 'Show all the replies to a comment',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldExpandSubs': {
        'label': 'Expand list of subscriptions',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      }
    }
  });

  GM_registerMenuCommand('Settings', () => {
    GM_config.open();
  });

  var videoIdAtLastCheck = "";
  var flgNewVideo = false;
  var flgTabviewDesc = false;
  var btnClick = null;
  var i;
  //var waitVideo;

  var observerBody = null;
  var observerSubs = null;
  var flgSubsDone = false;
  var observerDesc = null;
  var observerDescTabview = null;
  var observerComments = null;
  //var observerCommentsTabview = null;
  var observerCommentsNotif = null;
  var observerComPost = null;

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const waitAndScroll = async () => {
    await delay(500);
    window.scrollTo(0, 0);
  };


  //---
  //--- Listen to global page changes
  //---
  const callbackBody = function (mutationsList, observer) {

    var pathArray = window.location.pathname.split('/');
    var firstPath = pathArray[1];
    var lastPath = pathArray[pathArray.length - 1];
    //console.log("firstPath: " + firstPath + " lastPath: " + lastPath);

    rearrangeSubs();

    //Check whether video is new to expand description
    if (firstPath === "watch" || firstPath === "live") {
      var player = document.querySelectorAll("div#content ytd-watch-flexy");
      if (player != null && player.length > 0) {
        var videoId = player[0].getAttribute("video-id");
        player = null;

        if (videoIdAtLastCheck != videoId) {
          videoIdAtLastCheck = videoId;
          flgNewVideo = true;
          flgTabviewDesc = true;
          //console.log("new video " + " / " + videoIdAtLastCheck);
        }
      }
    }

    if (flgNewVideo) {
      //console.log("do desc");
      expandDesc();
    }

    //---
    //--- Listen to Tabview description and expand it
    //---
    if (flgTabviewDesc) {
      if (observerDescTabview == null && (firstPath === "watch" || firstPath === "live")) {
        const callbackDescTabview = function (mutationsList, observer) {
          expandDescTabview();
        }
        let nodeDescTabview = document.querySelector("secondary-wrapper");
        if (nodeDescTabview != null) {
          observerDescTabview = new MutationObserver(callbackDescTabview);
          observerDescTabview.observe(nodeDescTabview, {childList: true, subtree: true, attributes: true, characterData: false});
        }
      }
    }
    //Remove Tabview description observer on non-video pages
    if (observerDescTabview != null && firstPath != "watch" && firstPath != "live") {
      observerDescTabview.disconnect();
      observerDescTabview = null;
    }

    //Remove subscriptions observer after subscriptions have been expanded
    if (flgSubsDone && observerSubs != null) {
      observerSubs.disconnect(); //Expand subscriptions only once
      observerSubs = null;
    }

    //---
    //--- Listen to community posts and expand them
    //---
    if (observerComPost == null && (lastPath === "community" || firstPath === "post" || lastPath === "posts")) {
      const callbackComPost = function (mutationsList, observer) {
        expandComPosts();
        expandComments();
      }
      let nodeComPost = document.querySelector("#primary #contents #contents");
      if (nodeComPost != null) {
        observerComPost = new MutationObserver(callbackComPost);
        observerComPost.observe(nodeComPost, {childList: true, subtree: true, attributes: true, characterData: false});
      }
    }
    //Remove community post observer on non-community pages
    if (observerComPost != null && lastPath != "community" && firstPath != "post" && lastPath != "posts") {
      observerComPost.disconnect();
      observerComPost = null;
    }

    //---
    //--- Listen to comments and expand them
    //---
    if (observerComments == null && (firstPath === "watch" || firstPath === "live" || firstPath === "post" || firstPath === "shorts" || lastPath === "community" || lastPath === "posts")) {
      const callbackComments = function (mutationsList, observer) {
        expandComments();
      }
      let nodeComments = null;
      if (firstPath === "shorts") {
        nodeComments = document.querySelector("ytd-shorts ytd-comments:not([hidden=''])");
        if (nodeComments != null) {
          observerComments = new MutationObserver(callbackComments);
          observerComments.observe(nodeComments, {childList: true, subtree: true, attributes: true, characterData: false});
        }
      } else {
        nodeComments = document.querySelector("#primary ytd-comments:not([hidden=''])");
        if (nodeComments != null) {
          observerComments = new MutationObserver(callbackComments);
          observerComments.observe(nodeComments, {childList: true, subtree: true, attributes: true, characterData: false});
        } else {
          nodeComments = document.querySelector("#tab-comments ytd-comments:not([hidden=''])");
          if (nodeComments != null) {
            observerComments = new MutationObserver(callbackComments);
            observerComments.observe(nodeComments, {childList: true, subtree: true, attributes: true, characterData: false});
          } else {
            nodeComments = document.querySelector("ytm-engagement-panel:not([hidden=''])");
            if (nodeComments != null) {
              observerComments = new MutationObserver(callbackComments);
              observerComments.observe(nodeComments, {childList: true, subtree: true, attributes: true, characterData: false});
            }
          }
        }
      }
    }
    //Remove comments observer
    if (observerComments != null && firstPath != "watch" && firstPath != "live" && firstPath != "shorts" && firstPath != "post" && lastPath != "community" && lastPath != "posts") {
      observerComments.disconnect();
      observerComments = null;
    }

    //---
    //--- Listen to comments in notification submenu and expand them
    //---
    if (observerCommentsNotif == null) {
      const callbackCommentsNotif = function (mutationsList, observer) {
        expandCommentsNotif();
      }
      let nodeCommentsNotif = null;
      nodeCommentsNotif = document.querySelector("ytd-popup-container #contentWrapper");
      if (nodeCommentsNotif != null) {
        observerCommentsNotif = new MutationObserver(callbackCommentsNotif);
        observerCommentsNotif.observe(nodeCommentsNotif, {childList: true, subtree: true, attributes: true, characterData: false});
      }
    }
  }

  let nodeBody = document.querySelector("body");
  if (nodeBody != null) {
    const observerBody = new MutationObserver(callbackBody);
    observerBody.observe(nodeBody, {childList: true, subtree: true, attributes: true, characterData: false});
  }

  //---
  //--- Listen to subscriptions and expand them
  //---
  const callbackSubs = function (mutationsList, observer) {
    expandSubs();
  }
  let nodeSubs = document.querySelector("div#guide-wrapper");
  if (nodeSubs != null) {
    observerSubs = new MutationObserver(callbackSubs);
    observerSubs.observe(nodeSubs, {childList: true, subtree: true, attributes: true, characterData: false});
  }


  //---------------------------------------
  // Expand description
  //---------------------------------------
  function expandDesc() {
    if (GM_config.fields['fldExpandDesc'].value) {
      //Expand description
      btnClick = document.querySelector("#primary tp-yt-paper-button#expand");
      if (btnClick != null /*&& isVisible(btnClick)*/) {
        btnClick.click();
        //console.log("common desc");
        flgNewVideo = false;
        waitAndScroll();
        //return;
      }

      //Expand description - suggested by gcobc12632
      /*btnClick = document.querySelector("yt-interaction#description-interaction");
      if (btnClick != null) {// && isVisible(btnClick)) {
        btnClick.click();
        return;
      }*/

      //Expand description after Tabview script

      //Expand description after 7ktTube | 2016 REDUX script
      btnClick = document.querySelectorAll("div#meta-contents ytd-video-secondary-info-renderer div ytd-expander tp-yt-paper-button#more:not([hidden=''])");
      if (btnClick != null && btnClick.length > 0 /*&& isVisible(btnClick)*/) {
        btnClick[0].click();
        flgNewVideo = false;
        waitAndScroll();
      }
    }
  }
  //---------------------------------------
  // Expand description of Tabview script
  //---------------------------------------
  function expandDescTabview() {
    if (GM_config.fields['fldExpandDesc'].value) {
      btnClick = document.querySelector("#right-tabs .tyt-main-info tp-yt-paper-button#expand");
      if (btnClick != null /*&& isVisible(btnClick)*/) {
        btnClick.click();
        //console.log("tabview desc");
        flgTabviewDesc = false;
        waitAndScroll();
        observerDescTabview.disconnect();
        observerDescTabview = null;
      }
    }
  }

  //---------------------------------------
  // Expand post and comments in community section
  //---------------------------------------
  function expandComPosts() {
    if (GM_config.fields['fldExpandLongComments'].value) {
      //Expand long post in community section
      btnClick = document.querySelectorAll("#post tp-yt-paper-button#more:not([hidden='']) > span.more-button");
      if (btnClick != null && btnClick.length > 0) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].click();
          btnClick[i].parentNode.previousElementSibling.setAttribute("style", "display:none;"); //Hide "Show less" button
        }
      }
    }
  }

  //---------------------------------------
  // Expand comments
  //---------------------------------------
  function expandComments() {
    if (GM_config.fields['fldExpandLongComments'].value) {
      //Expand long comments and hide "show less" button in comments section
      btnClick = document.querySelectorAll("ytd-comments ytd-comment-thread-renderer ytd-comment-view-model#comment tp-yt-paper-button#more:not([hidden='']) > span.more-button");
      if (btnClick != null) {
        if (btnClick.length > 0) {
          for (i = 0; i < btnClick.length; i++) {
            btnClick[i].click();
            btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
            btnClick[i].parentNode.previousElementSibling.setAttribute("style", "display:none;"); //Hide "Show less" button
          }
        } else {
          //Expand long comments in comments section of mobile browser
          btnClick = document.querySelectorAll("ytm-comment-thread-renderer ytm-button-renderer.YtmCommentRendererExpand button:not([hidden='']) > yt-touch-feedback-shape:not([clicked-by-script='true'])");
          if (btnClick != null) {
            for (i = 0; i < btnClick.length; i++) {
              btnClick[i].click();
              btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
            }
          }
        }
      }
    }

    if (GM_config.fields['fldExpandLongReplies'].value) {
      //Expand long replies and hide "show less" button in comments section
      btnClick = document.querySelectorAll("ytd-comments #replies tp-yt-paper-button#more:not([hidden='']) > span.more-button");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].click();
          btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
          btnClick[i].parentNode.previousElementSibling.setAttribute("style", "display:none;"); //Hide "Show less" button
        }
      }
    }

    if (GM_config.fields['fldShowAllReplies'].value) {
      //Show all replies upon pressing "Show more replies" button for common videos and shorts (not for notifications submenu)
      btnClick = document.querySelectorAll("div#replies div#expanded-threads div#button.ytd-continuation-item-renderer:not([hidden]) button.yt-spec-button-shape-next:not([clicked-by-script='true']), ytd-engagement-panel-section-list-renderer div#replies div#expanded-threads div#button.ytd-continuation-item-renderer:not([hidden]) button.yt-spec-button-shape-next:not([clicked-by-script='true'])");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].click();
          btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
        }
      }
      //Rearm "Show more replies" button
      /*btnClick = document.querySelectorAll("#primary div#replies div#expanded-threads div#button.ytd-continuation-item-renderer[hidden=''] button.yt-spec-button-shape-next[clicked-by-script='true'], #right-tabs #tab-comments div#replies div#expander div#expander-contents div#button.ytd-continuation-item-renderer[hidden=''] ytd-button-renderer.ytd-continuation-item-renderer button.yt-spec-button-shape-next[clicked-by-script='true']");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].removeAttribute("clicked-by-script", "true"); //Click it again when it becomes not hidden
        }
      }*/

      //Show all replies upon pressing "View more comments" button (7ktTube | 2016 REDUX script)
      btnClick = document.querySelectorAll("#primary div#replies div#expander div#expander-contents div#button.ytd-continuation-item-renderer:not([hidden]) ytd-button-renderer tp-yt-paper-button#button[role='button']:not([clicked-by-script='true'])");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].click();
          btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
        }
      }
      //Rearm "View more comments" button (7ktTube | 2016 REDUX script)
      /*btnClick = document.querySelectorAll("#primary div#replies div#expander div#expander-contents div#button.ytd-continuation-item-renderer[hidden=''] ytd-button-renderer tp-yt-paper-button#button[role='button'][clicked-by-script='true']");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].click();
          btnClick[i].removeAttribute("clicked-by-script", "true"); //Click it again when it becomes not hidden
        }
      }*/
    }
  }

  //---------------------------------------
  // Expand comments in notification submenu
  //---------------------------------------
  function expandCommentsNotif() {
    if (GM_config.fields['fldExpandLongComments'].value) {
      //Expand long comments and hide "show less" button in notification submenu
      btnClick = document.querySelectorAll("#submenu ytd-comment-thread-renderer > #comment-container tp-yt-paper-button#more:not([hidden='']) > span.more-button[slot='more-button']:not([clicked-by-script='true'])");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].click();
          btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
          btnClick[i].parentNode.previousElementSibling.setAttribute("style", "display:none;"); //Hide "Show less" button
        }
      }
    }

    if (GM_config.fields['fldExpandLongReplies'].value) {
      //Expand long replies and hide "show less" button in notification submenu
      btnClick = document.querySelectorAll("#submenu ytd-comment-thread-renderer > #replies tp-yt-paper-button#more:not([hidden='']) > span.more-button[slot='more-button']:not([clicked-by-script='true'])");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          btnClick[i].click();
          btnClick[i].setAttribute("clicked-by-script", "true"); //Do not click it again
          btnClick[i].parentNode.previousElementSibling.setAttribute("style", "display:none;"); //Hide "Show less" button
        }
      }
    }
  }

  //---------------------------------------
  // Show all subscriptions
  //---------------------------------------
  function expandSubs() {
    if (GM_config.fields['fldExpandSubs'].value) {
      btnClick = document.querySelectorAll("tp-yt-app-drawer[opened] #sections.ytd-guide-renderer ytd-guide-collapsible-entry-renderer.ytd-guide-section-renderer:not([expanded='']) #expander-item");
      if (btnClick != null) {
        for (i = 0; i < btnClick.length; i++) {
          if (isVisible(btnClick[i])) {
            btnClick[i].click();
            flgSubsDone = true;
          }
        }
      }
    }
  }

  //---------------------------------------
  // Rearrange Subscriptions and You sections
  //---------------------------------------
  function rearrangeSubs() {
    var guideSections = document.querySelectorAll("ytd-guide-renderer #sections:not([rearranged=true]) ytd-guide-section-renderer");
    if (guideSections != null) {
      var indexSubs = 0;
      var indexYou = 0;
      for (i = 0; i < guideSections.length; i++) {
        var sectionN = document.querySelector("ytd-guide-renderer #sections ytd-guide-section-renderer:nth-child(" + (i+1) + "):not([rearranged=true]) a#endpoint[href='/feed/subscriptions']");
        if (sectionN != null) indexSubs = i;
        else {
          sectionN = document.querySelector("ytd-guide-renderer #sections ytd-guide-section-renderer:nth-child(" + (i+1) + "):not([rearranged=true]) a#endpoint[href='/feed/you']");
          if (sectionN != null) indexYou = i;
        }
      }

      if (indexSubs < indexYou) {
        var sectionsAll = document.querySelector("ytd-guide-renderer #sections");
        if (sectionsAll != null) sectionsAll.setAttribute("rearranged", "true");
        var sectionSubs = document.querySelector("ytd-guide-renderer #sections ytd-guide-section-renderer:nth-child(" + (indexSubs+1) + ")");
        if (sectionSubs != null) sectionSubs.setAttribute("rearranged", "true");
        var sectionYou = document.querySelector("ytd-guide-renderer #sections ytd-guide-section-renderer:nth-child(" + (indexYou+1) + ")");
        if (sectionYou != null) sectionYou.setAttribute("rearranged", "true");
        sectionYou.parentNode.insertBefore(sectionYou, sectionSubs);
      }
    }
  }

  //---------------------------------------
  // Check all the parents of element to find whether it is visible or not
  //---------------------------------------
  function isVisible(pObj) {
    if (pObj != null) {
      var checkNext = true;
      var vObj = pObj;

      while (checkNext) {
        checkNext = false;
        //console.log("checking element " + vObj.tagName + "#" + vObj.id + ": '" + document.defaultView.getComputedStyle(vObj,null)['display'] + "'");
        if (document.defaultView.getComputedStyle(vObj,null)['display'] != "none") {
          if (vObj.parentElement != null) {
            vObj = vObj.parentElement;
            checkNext = true;
          }
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  }


})();

    /*//Detect spinner at main comments
    var spinnerMain = $( "#primary div#replies div#expander tp-yt-paper-spinner#spinner[active]" );
    if (spinnerMain != null && spinnerMain.length > 0) {
      console.log("main active spinner detected");
      spinnerActive = true;

      //Listen to spinner changes
      const spinnerCallback = function (mutationsList, observer) {
        expandComments();

        //spinnerMain = $( "#primary div#replies div#expander tp-yt-paper-spinner#spinner[active]" );
        if (spinnerMain[0].getAttribute("active") == null || spinnerMain[0].getAttribute("active") == "") {
          console.log("main spinner deactivated");
          spinnerObserver.disconnet();
        }
      }

      var spinnerNode = document.querySelector("#primary div#replies div#expander tp-yt-paper-spinner#spinner[active]");
      if (spinnerNode != null) {
        const spinnerObserver = new MutationObserver(spinnerCallback);
        spinnerObserver.observe(spinnerNode, {childList: true, subtree: true, attributes: true, characterData: true});
      }

    } else if (spinnerActive) {
      console.log("spinner stopped");
      spinnerActive = false;
      expandComments();
    }*/

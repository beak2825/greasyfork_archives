// ==UserScript==
// @name        Image Board Enhancer
// @namespace   ImageBoardEnhancer
// @version     1.5.14
// @description Auto Resize images and video on multiple image boards and enlarges thumbnails on mouse hover and adds content type icons to them.
// @author      DanDanDan
// @match       *://rule34.xxx/*
// @match       *://chan.sankakucomplex.com/*
// @match       *://idol.sankakucomplex.com/*
// @match       *://gelbooru.com/*
// @match       *://danbooru.donmai.us/*
// @match       *://konachan.com/*
// @match       *://konachan.net/*
// @match       *://yande.re/*
// @match       *://safebooru.org/*
// @match       *://rule34.paheal.net/*
// @match       *://rule34hentai.net/*
// @match       *://www.rule34hentai.net/*
// @match       *://e621.net/*
// @match       *://e926.net/*
// @match       *://tbib.org/*
// @match       *://behoimi.org/*
// @match       *://rule34.us/*
// @match       *://www.rule34.us/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require     https://update.greasyfork.org/scripts/490787/1348738/Image%20Board%20Enhancer%20Icons%20%28%2Bmore%29.js
// @require     https://greasyfork.org/scripts/420842-vanilla-js-wheel-zoom/code/vanilla-js-wheel-zoom.js?version=927891
// @grant       GM.setValue
// @grant       GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490791/Image%20Board%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/490791/Image%20Board%20Enhancer.meta.js
// ==/UserScript==
(async () => {
  'use strict';

  var currentVersion = 38;

  // Detect an update from version 1.4.5(25) or lower.
  var version26UpdateTest1 = (typeof await GM.getValue('lastVersion') == 'undefined');
  var version26UpdateTest2 = (typeof await GM.getValue('resizeImageToFit') == 'undefined');
  var lastVersion = await GM.getValue('lastVersion', currentVersion);
  if (version26UpdateTest1 && !version26UpdateTest2)
    lastVersion = await GM.getValue('lastVersion', 26);

  var resizeImageToFit = await GM.getValue('resizeImageToFit', true);
  var resizeVideoToFit = await GM.getValue('resizeVideoToFit', true);
  var autoplayVideos = await GM.getValue('autoplayVideos', true);
  var autoScrollToContent = await GM.getValue('autoScrollToContent', true);
  var updateWithWindowResize = await GM.getValue('updateWithWindowResize', true);
  var updateScrollOnWindowResize = await GM.getValue('updateScrollOnWindowResize', true);
  var showFitButton = await GM.getValue('showFitButton', true);
  var showScrollButton = await GM.getValue('showScrollButton', true);
  var showVotingButtons = await GM.getValue('showVotingButtons', true);
  var removeFluid = await GM.getValue('removeFluid', false);
  var videoVolume = await GM.getValue('videoVolume', 0);
  var enableEnhancedThumbnails = await GM.getValue('enableEnhancedThumbnails', true);
  var enableEnhancedThumbnailsDetails = await GM.getValue('enableEnhancedThumbnailsDetails', true);
  var alwaysShowScrollbars = await GM.getValue('alwaysShowScrollbars', false);
  var enableZoomableImage = await GM.getValue('enableZoomableImage', true);
  var maxZoom = await GM.getValue('maxZoom', 1);
  var zoomSpeed = await GM.getValue('zoomSpeed', 7);
  var resizeButton = await GM.getValue('resizeButton', 'BracketLeft');
  var scrollButton = await GM.getValue('scrollButton', 'BracketRight');
  var iconSize = await GM.getValue('iconSize', 36);
  var defaultClickAction = await GM.getValue('defaultClickAction', 'new-tab');
  var showFavoriteTags = await GM.getValue('showFavoriteTags', { draw: true, open: false });
  var favoriteTags = await GM.getValue('favoriteTags', {});

  var tagDB = await GM.getValue('tagDB', {});

  var hiddenIcons = await GM.getValue('hiddenIcons', []);

  var customSites = await GM.getValue('customSites', {});

  // Create variables. DO NOT CHANGE!
  var currentWindowWidth = 0;
  var currentWindowHeight = 0;
  var currentWindowAspect = 0;
  var contentTrueWidth = 0;
  var contentTrueHeight = 0;
  var contentTrueAspect = 0;
  var resizeReady = false;
  var toolbarDOM = '.sidebar form';
  var containerDOM = '#content';
  var imageDOM = '#image';
  var playerDOM;
  var changeKeyboardShortcut = false;
  var containerAlignment = '';
  var thumbnailDOM = '.thumb';
  var thumbnails = [];
  var animationTagIsGif = false;
  var urlParams = new URLSearchParams(window.location.search);
  var waitingForZoom = false;
  var wzoom;
  var placeSettingsAfter = true;
  var loggedin = false;
  var thumbDetailsOpen = false;
  var tagSearchLink = '/index.php?page=post&s=list&tags=';
  var tagSearchLinkafter = '';
  var removeFavorite = () => { };
  var currentImageThumb = '';
  var tagSplit = ' ';
  var tagsHaveUnderscores = true;
  var tagsURLParam = 'tags';
  var site = document.location.hostname.toLowerCase().replace('www.', '');
  var siteUsesInfScroll = false;

  // Debug stuff.
  var debugMode = false;
  var keepThumbOpen = false;
  if (debugMode) lastVersion = 0; // Forces the changelog to be added.

  function configureSites() {
    if (debugMode) console.log('Function: configureSites');
    // Per-site DOM selection.

    if (site == 'rule34.xxx') { toolbarDOM = '.sidebar > div'; playerDOM = '#gelcomVideoContainer'; animationTagIsGif = true; loggedin = true; /* no loggedin indercator */ }
    else if (site == 'chan.sankakucomplex.com' || site == 'idol.sankakucomplex.com') { toolbarDOM = '#search-form'; tagSearchLink = '/?tags='; loggedin = ($('#navbar li a:contains("My Account")').length > 0); siteUsesInfScroll = true; }
    else if (site == 'gelbooru.com') { toolbarDOM = 'section.aside > *'; placeSettingsAfter = false; containerDOM = 'main'; imageDOM = 'section.image-container.note-container picture img#image, video#gelcomVideoPlayer'; thumbnailDOM = '.thumbnail-preview, .thumb'; loggedin = true; /* no loggedin indercator */ }
    else if (site == 'danbooru.donmai.us') { toolbarDOM = '#search-box'; thumbnailDOM = '.post-preview'; tagSearchLink = '/posts?tags='; loggedin = !($('#nav-login').length > 0); }
    else if (site == 'konachan.com' || site == 'konachan.net') { animationTagIsGif = true; tagSearchLink = '/post?tags='; loggedin = ($('.standard-vote-widget a').length > 0); }
    else if (site == 'yande.re') { tagSearchLink = '/post?tags='; loggedin = ($('.standard-vote-widget a').length > 0); }
    else if (site == 'safebooru.org') { loggedin = true; /* no loggedin indercator */ }
    else if (site == 'tbib.org') { loggedin = true; /* no loggedin indercator */ }
    else if (site == 'behoimi.org') { tagSearchLink = '/post/index?tags='; loggedin = ($('#navbar li a:contains("My Account")').length > 0); }
    else if (site == 'rule34.paheal.net') { tagSearchLink = '/post/list/'; tagSearchLinkafter = '/1'; toolbarDOM = '#Navigationleft'; containerDOM = 'article'; imageDOM = '#main_image'; containerAlignment = 'margin-left: auto;'; /* cannot test loggedin since i dont have an account */ }
    else if (site == 'rule34hentai.net') { tagSearchLink = '/post/list/'; tagSearchLinkafter = '/1'; toolbarDOM = '#Navigationleft'; containerDOM = 'article'; imageDOM = '#main_image'; playerDOM = '#fluid_video_wrapper_video-id'; containerAlignment = 'margin-left: auto;'; loggedin = !(jQuery('#Loginhead').length > 0); }
    else if (site == 'e621.net' || site == 'e926.net') { toolbarDOM = '#search-box'; thumbnailDOM = '.post-preview'; animationTagIsGif = true; tagSearchLink = '/posts?tags='; loggedin = !(jQuery('#nav-sign-in').length > 0); }
    else if (site == 'rule34.us') { toolbarDOM = '.tag-list-left > *'; thumbnailDOM = '.thumbail-container > div'; containerDOM = '.container'; imageDOM = '.content_push > video, .content_push > img'; tagSplit = ', '; tagsHaveUnderscores = false; placeSettingsAfter = false; tagSearchLink = '/index.php?r=posts/index&q='; tagsURLParam = 'q'; loggedin = true; /* no loggedin indercator */ }
    // Custom site DOM selection.
    else if (customSites[site]) {
      var obj = customSites[site];
      if (debugMode) console.log(obj, 'obj');
      if (obj.toolbarDOM) toolbarDOM = obj.toolbarDOM;
      if (obj.containerDOM) containerDOM = obj.containerDOM;
      if (obj.imageDOM) imageDOM = obj.imageDOM;
      if (obj.thumbnailDOM) thumbnailDOM = obj.thumbnailDOM;
      $("body").append("<button id='ibenhancerDeleteConfigButton' style='position: absolute; top: 0px; right: 0px; z-index: 9999999; color: black; background-color: whitesmoke; font-size: 12px;'>Delete site config.</button>");
      $("#ibenhancerDeleteConfigButton").click(deleteSiteConfig);
    }
    // Default site DOM and add setup button.
    else {
      // Add setup button to websites wihtout a config.
      $("body").append("<button id='ibenhancerSetupButton' style='position: absolute; top: 0px; right: 0px; z-index: 9999999; color: black; background-color: whitesmoke; font-size: 12px;'>Setup Image Board Enhancer</button>");
      $("#ibenhancerSetupButton").click(addSiteConfig);
      console.warn('This site is not supported, but may still work.');
    }
  }

  function addSiteConfig() {
    if (debugMode) console.log('Function: addSiteConfig');

    var config = JSON.parse(prompt("Enter config in JSON format.", '{"toolbarDOM": ".sidebar form", "containerDOM": "#content", "imageDOM": "#image", "thumbnailDOM": ".thumb" }'));

    if (config === null || !config || config == {}) {
      alert('Config not valid.');
    } else {
      customSites[site] = config;
      if (debugMode) console.log(customSites);
      GM.setValue('customSites', customSites);
      alert('Config saved.');
      location.reload();
    }
  }

  function deleteSiteConfig() {
    if (debugMode) console.log('Function: deleteSiteConfig');

    delete customSites[site];
    GM.setValue('customSites', customSites);
    alert('Config deleted.');
    location.reload();
  }

  function removeFluidPlayer() {
    if (debugMode) console.log('Function: removeFluidPlayer');

    // Remove the Fluid Video player.
    // Create a new video player with the source of the original. This will break blob content if any sites start using DRM.
    $(playerDOM).replaceWith("<video src='" + ($(containerDOM + ' video').attr('src') || $(containerDOM + ' video source').attr('src')) + "' controls='true' />");

  }

  function getWindowProps() {
    if (debugMode) console.log('Function: getWindowProps');

    // Get window size and aspect ratio.
    currentWindowWidth = document.documentElement.clientWidth;
    currentWindowHeight = document.documentElement.clientHeight;
    if (currentWindowWidth !== 0 && currentWindowHeight !== 0)
      currentWindowAspect = currentWindowWidth / currentWindowHeight;
  }

  function getContentProps() {
    if (debugMode) console.log('Function: getContentProps');

    // Get the real size of the video or image.
    if ($(containerDOM + ' ' + imageDOM).length) {
      var screenImage = $(containerDOM + ' ' + imageDOM);
      if (screenImage[0].videoWidth) {
        contentTrueWidth = screenImage[0].videoWidth;
				contentTrueHeight = screenImage[0].videoHeight;
      }
      else {
      	var theImage = new Image();
      	theImage.src = screenImage.attr("src");
      	contentTrueWidth = theImage.width;
      	contentTrueHeight = theImage.height;
      }
    }
    else if ($(containerDOM + ' video').length) {
      contentTrueWidth = $(containerDOM + ' video')[0].videoWidth;
      contentTrueHeight = $(containerDOM + ' video')[0].videoHeight;
    }



    if (contentTrueWidth !== 0 && contentTrueHeight !== 0)
      contentTrueAspect = contentTrueWidth / contentTrueHeight;
    resizeReady = true;
    if (debugMode) console.log('contentTrueAspect: ', contentTrueAspect)
  }

  function resizeImage() {
    if (debugMode) console.log('Function: resizeImage');

    // Resize the image (This resizes the video on some sites eg. sankakucomplex.com)

    $(containerDOM + ' ' + imageDOM).css('max-width', '');

    if (currentWindowAspect > contentTrueAspect) {
      $(containerDOM + ' ' + imageDOM)[0].width = currentWindowHeight * contentTrueAspect;
      $(containerDOM + ' ' + imageDOM)[0].height = currentWindowHeight;
    }

    else {
      $(containerDOM + ' ' + imageDOM)[0].width = currentWindowWidth;
      $(containerDOM + ' ' + imageDOM)[0].height = currentWindowWidth / contentTrueAspect;
    }

    // Remove css from images.
    $(containerDOM + ' ' + imageDOM).removeAttr('style');
    if (enableZoomableImage && !$(containerDOM + ' video').length) $(containerDOM + ' ' + imageDOM).css({ cursor: 'zoom-in' });
  }

  function resizeFluidVideo() {
    if (debugMode) console.log('Function: resizeFluidVideo');

    // Resize Fluid video player.

    $(containerDOM + ' ' + playerDOM).css('max-width', '');

    if (currentWindowAspect > contentTrueAspect) {
      $(containerDOM + ' ' + playerDOM).css('width', currentWindowHeight * contentTrueAspect);
      $(containerDOM + ' ' + playerDOM).css('height', currentWindowHeight);
    }

    else {
      $(containerDOM + ' ' + playerDOM).css('width', currentWindowWidth);
      $(containerDOM + ' ' + playerDOM).css('height', currentWindowWidth / contentTrueAspect);
    }
  }

  function resizeVideo() {
    // Resize default video.
    if (debugMode) console.log('Function: resizeVideo');

    $(containerDOM + ' video').css('max-width', '');

    if (currentWindowAspect > contentTrueAspect) {
      $(containerDOM + ' video')[0].width = currentWindowHeight * contentTrueAspect;
      $(containerDOM + ' video')[0].height = currentWindowHeight;
    }

    else {
      $(containerDOM + ' video')[0].width = currentWindowWidth;
      $(containerDOM + ' video').height = currentWindowWidth / contentTrueAspect;
    }
  }

  function scrollToContent(delay) {
    // Scroll the window to the video or image.
    if (debugMode) console.log('Function: scrollToContent');


    setTimeout(function () {
      var contentID;

      if ($(containerDOM + ' ' + imageDOM).length) contentID = containerDOM + ' ' + imageDOM;
      else if ($(containerDOM + ' ' + playerDOM).length) contentID = containerDOM + ' ' + playerDOM;
      else if ($(containerDOM + ' video').length) contentID = containerDOM + ' video';

      $([document.documentElement, document.body]).animate({
        scrollTop: $(contentID).offset().top + 1
      }, 0);
      $([document.documentElement, document.body]).animate({
        scrollLeft: $(contentID).offset().left + 1
      }, 0);
    }, delay);

  }

  function fitContent(delay) {
    // Check if resize is ready and what type of content to resize.
    if (debugMode) console.log('Function: fitContent');

    setTimeout(function () {
      if (resizeReady) {
        getWindowProps();
        if ($(containerDOM + ' ' + imageDOM).length) {
          resizeImage();
        }

        else if ($(containerDOM + ' ' + playerDOM).length) {
          resizeFluidVideo();
        }

        else if ($(containerDOM + ' video').length) {
          resizeVideo();
        }
      }
    }, delay);


  }

  function enhanceContent() {
    if (debugMode) console.log('Function: enhanceContent');

    // Remove videos with no id on gelbooru, these are ads and were breaking the script.
    if(site == 'gelbooru.com')
    	$('video:not([id])').remove()

    // Remove the Fluid player if present.
    if (removeFluid && $(playerDOM).length) removeFluidPlayer();

    // Get the image properties, resize, and scroll as the page is loading.
    // If the image loads too quickly it wont fire the event.
    if ($(containerDOM + ' video').length || $(containerDOM + ' ' + imageDOM).length) {

      // Show Scrollbars
      if (alwaysShowScrollbars) $('html').css({ overflow: 'scroll' });

      getContentProps();

      if (resizeImageToFit) fitContent(0);

      if (autoScrollToContent) {
        scrollToContent(0);
        var firstRun = true;
        $(window).focus(function () {
          if (firstRun) {
            scrollToContent(0);
            firstRun = false;
          }
        });
      }
    }

    // Add event listener to the image or video.
    if ($(containerDOM + ' video').length) {
      if (debugMode) console.log('Create video event listener');

      // Change video settings.
      $(containerDOM + ' video').prop('autoplay', autoplayVideos);
      $(containerDOM + ' video').prop('volume', videoVolume);
      $(containerDOM + ' video').prop('loop', true);
      if (autoplayVideos) $(containerDOM + ' video')[0].play(); else $(containerDOM + ' video')[0].pause();

      $(containerDOM + ' video').on('loadedmetadata', function () { //NOTE: replaced 'loadedmetadata' with 'canplay'
        getContentProps();
        if (resizeVideoToFit) fitContent(200);
        if (autoScrollToContent) scrollToContent(200);
        $(containerDOM + ' video').play();

      });
    }
    else if ($(containerDOM + ' ' + imageDOM).length) {
      if (debugMode) console.log('Create image event listener');

      $(containerDOM + ' ' + imageDOM).on('load', function () {
        if (waitingForZoom) {
          if (debugMode) console.log('Waited for zoom');
          setTimeout(openZoom, 16);
          waitingForZoom = false;
        }
        getContentProps();
        if (resizeImageToFit) fitContent(200);
        if (autoScrollToContent) scrollToContent(200);
      });
    }
  }

  function addWindowEvents() {
    if (debugMode) console.log('Function: addWindowEvents');

    // Add the event listener to the window.
    if (updateWithWindowResize) {
      $(window).resize(function () {
        fitContent(0);
        if (updateScrollOnWindowResize) scrollToContent(0);
      });
    }
  }

  function showSettings() {
    if (debugMode) console.log('Function: showSettings');

    $("#ibenhancerSettings").addClass('show');
    $("#ibenhancerSettings-blocker").addClass('show');
    $("html").addClass('ibenhancerSettingVisible');
  }

  function hideSettings() {
    if (debugMode) console.log('Function: hideSettings');

    $("#ibenhancerSettings").removeClass('show');
    $("#ibenhancerSettings-blocker").removeClass('show');
    $("html").removeClass('ibenhancerSettingVisible');

    // Reset the form to original state.
    $("#resizeImageToFitCheckbox").prop('checked', resizeImageToFit);
    $("#resizeVideoToFitCheckbox").prop('checked', resizeVideoToFit);
    $("#autoplayVideosCheckbox").prop('checked', autoplayVideos);
    $("#autoScrollToContentCheckbox").prop('checked', autoScrollToContent);
    $("#updateWithWindowResizeCheckbox").prop('checked', updateWithWindowResize);
    $("#updateScrollOnWindowResizeCheckbox").prop('checked', updateScrollOnWindowResize);
    $("#showFitButtonCheckbox").prop('checked', showFitButton);
    $("#showScrollButtonCheckbox").prop('checked', showScrollButton);
    $("#showVotingButtonsCheckbox").prop('checked', showVotingButtons);
    $("#removeFluidCheckbox").prop('checked', removeFluid);
    $("#enableEnhancedThumbnailsCheckbox").prop('checked', enableEnhancedThumbnails);
    $("#enableEnhancedThumbnailsDetailsCheckbox").prop('checked', enableEnhancedThumbnailsDetails);
    $("#alwaysShowScrollbarsCheckbox").prop('checked', alwaysShowScrollbars);
    $("#enableZoomableImageCheckbox").prop('checked', enableZoomableImage);
    $("#showFavoriteTagsCheckbox").prop('checked', showFavoriteTags['draw']);
    $('#defaultClickActionSelect').val(defaultClickAction);

    $("#maxZoomInput").val(maxZoom);
    $("#zoomSpeedInput").val(zoomSpeed);
    $("#videoVolumeInput").val(videoVolume);

    $("#iconSizeInput").val(iconSize);

    $("#hideIconGifCheckbox").prop('checked', hiddenIcons.includes("gif"));
    $("#hideIconVideoCheckbox").prop('checked', hiddenIcons.includes("video"));
    $("#hideIconSoundCheckbox").prop('checked', hiddenIcons.includes("sound"));
    $("#hideIconFlashCheckbox").prop('checked', hiddenIcons.includes("flash"));
    $("#hideIconStraightCheckbox").prop('checked', hiddenIcons.includes("straight"));
    $("#hideIconGayCheckbox").prop('checked', hiddenIcons.includes("gay"));
    $("#hideIconLesbianCheckbox").prop('checked', hiddenIcons.includes("lesbian"));
    $("#hideIconTransCheckbox").prop('checked', hiddenIcons.includes("trans"));
    $("#hideIconTrapCheckbox").prop('checked', hiddenIcons.includes("trap"));
    $("#hideIconThreeDCheckbox").prop('checked', hiddenIcons.includes("threeD"));
    $("#hideIconLoliCheckbox").prop('checked', hiddenIcons.includes("loli"));
    $("#hideIconShotaCheckbox").prop('checked', hiddenIcons.includes("shota"));
    $("#hideIconGoreDeathCheckbox").prop('checked', hiddenIcons.includes("goreDeath"));
    $("#hideIconPregnantCheckbox").prop('checked', hiddenIcons.includes("pregnant"));
    $("#hideIconBestialityCheckbox").prop('checked', hiddenIcons.includes("bestiality"));
    $("#hideIconFeetCheckbox").prop('checked', hiddenIcons.includes("feet"));
    $("#hideIconBondageCheckbox").prop('checked', hiddenIcons.includes("bondage"));
    $("#hideIconPoopCheckbox").prop('checked', hiddenIcons.includes("poop"));
    $("#hideIconPissCheckbox").prop('checked', hiddenIcons.includes("piss"));
    $("#hideIconGroupCheckbox").prop('checked', hiddenIcons.includes("group"));
    $("#hideIconIncestCheckbox").prop('checked', hiddenIcons.includes("incest"));
    $("#hideIconSafeCheckbox").prop('checked', hiddenIcons.includes("safe"));
    $("#hideIconGeneralCheckbox").prop('checked', hiddenIcons.includes("general"));
    $("#hideIconQuestionableCheckbox").prop('checked', hiddenIcons.includes("questionable"));
    $("#hideIconExplicitCheckbox").prop('checked', hiddenIcons.includes("explicit"));
    $("#hideIconR15Checkbox").prop('checked', hiddenIcons.includes("r15"));
    $("#hideIconR18Checkbox").prop('checked', hiddenIcons.includes("r18"));
    $("#hideIconBukkakeCheckbox").prop('checked', hiddenIcons.includes("bukkake"));
    $("#hideIconTentaclesCheckbox").prop('checked', hiddenIcons.includes("tentacles"));
    $("#hideIconRapeCheckbox").prop('checked', hiddenIcons.includes("rape"));
    $("#hideIconPublicCheckbox").prop('checked', hiddenIcons.includes("public"));
    $("#hideIconFurryCheckbox").prop('checked', hiddenIcons.includes("furry"));
    $("#hideIconFatCheckbox").prop('checked', hiddenIcons.includes("fat"));
    $("#hideIconHypnosisCheckbox").prop('checked', hiddenIcons.includes("hypnosis"));
    $("#hideIconNtrCheckbox").prop('checked', hiddenIcons.includes("ntr"));
    $("#hideIconFemdomCheckbox").prop('checked', hiddenIcons.includes("femdom"));
    $("#hideIconAICheckbox").prop('checked', hiddenIcons.includes("ai"));
    $("#hideIconCensoredCheckbox").prop('checked', hiddenIcons.includes("censored"));
    $("#hideIconUncensoredCheckbox").prop('checked', hiddenIcons.includes("uncensored"));
	$("#hideIconAsianCheckbox").prop('checked', hiddenIcons.includes("asian"));

  }

  function changeResizeButtonClicked() {
    if (debugMode) console.log('Function: changeResizeButtonClicked');

    $('#resizeButton').html('?');
    changeKeyboardShortcut = 'resizeButton';
  }

  function changeScrollButtonClicked() {
    if (debugMode) console.log('Function: changeScrollButtonClicked');

    $('#scrollButton').html('?');
    changeKeyboardShortcut = 'scrollButton';
  }

  function saveSettings() {
    if (debugMode) console.log('Function: saveSettings');

    GM.setValue('resizeImageToFit', $('#resizeImageToFitCheckbox').is(':checked'));

    GM.setValue('resizeVideoToFit', $('#resizeVideoToFitCheckbox').is(':checked'));

    GM.setValue('autoplayVideos', $('#autoplayVideosCheckbox').is(':checked'));

    GM.setValue('autoScrollToContent', $('#autoScrollToContentCheckbox').is(':checked'));

    GM.setValue('updateScrollOnWindowResize', $('#updateScrollOnWindowResizeCheckbox').is(':checked'));

    GM.setValue('updateWithWindowResize', $('#updateWithWindowResizeCheckbox').is(':checked'));

    GM.setValue('showFitButton', $('#showFitButtonCheckbox').is(':checked'));

    GM.setValue('showScrollButton', $('#showScrollButtonCheckbox').is(':checked'));

    GM.setValue('showVotingButtons', $('#showVotingButtonsCheckbox').is(':checked'));

    GM.setValue('removeFluid', $('#removeFluidCheckbox').is(':checked'));

    GM.setValue('videoVolume', $('#videoVolumeInput').val());

    GM.setValue('enableEnhancedThumbnails', $('#enableEnhancedThumbnailsCheckbox').is(':checked'));

    GM.setValue('enableEnhancedThumbnailsDetails', $('#enableEnhancedThumbnailsDetailsCheckbox').is(':checked'));

    GM.setValue('alwaysShowScrollbars', $('#alwaysShowScrollbarsCheckbox').is(':checked'));

    GM.setValue('enableZoomableImage', $('#enableZoomableImageCheckbox').is(':checked'));

    showFavoriteTags['draw'] = $('#showFavoriteTagsCheckbox').is(':checked');
    GM.setValue('showFavoriteTags', showFavoriteTags);

    GM.setValue('defaultClickAction', $('#defaultClickActionSelect').val());

    GM.setValue('maxZoom', $('#maxZoomInput').val());
    GM.setValue('zoomSpeed', $('#zoomSpeedInput').val());

    GM.setValue('iconSize', $('#iconSizeInput').val());

    GM.setValue('resizeButton', resizeButton);
    GM.setValue('scrollButton', scrollButton);

    var newHiddenIcons = [];

    if ($('#hideIconGifCheckbox').is(':checked')) newHiddenIcons.push('gif');
    if ($('#hideIconVideoCheckbox').is(':checked')) newHiddenIcons.push('video');
    if ($('#hideIconSoundCheckbox').is(':checked')) newHiddenIcons.push('sound');
    if ($('#hideIconFlashCheckbox').is(':checked')) newHiddenIcons.push('flash');
    if ($('#hideIconStraightCheckbox').is(':checked')) newHiddenIcons.push('straight');
    if ($('#hideIconGayCheckbox').is(':checked')) newHiddenIcons.push('gay');
    if ($('#hideIconLesbianCheckbox').is(':checked')) newHiddenIcons.push('lesbian');
    if ($('#hideIconTransCheckbox').is(':checked')) newHiddenIcons.push('trans');
    if ($('#hideIconTrapCheckbox').is(':checked')) newHiddenIcons.push('trap');
    if ($('#hideIconThreeDCheckbox').is(':checked')) newHiddenIcons.push('threeD');
    if ($('#hideIconLoliCheckbox').is(':checked')) newHiddenIcons.push('loli');
    if ($('#hideIconShotaCheckbox').is(':checked')) newHiddenIcons.push('shota');
    if ($('#hideIconGoreDeathCheckbox').is(':checked')) newHiddenIcons.push('goreDeath');
    if ($('#hideIconPregnantCheckbox').is(':checked')) newHiddenIcons.push('pregnant');
    if ($('#hideIconBestialityCheckbox').is(':checked')) newHiddenIcons.push('bestiality');
    if ($('#hideIconFeetCheckbox').is(':checked')) newHiddenIcons.push('feet');
    if ($('#hideIconBondageCheckbox').is(':checked')) newHiddenIcons.push('bondage');
    if ($('#hideIconPoopCheckbox').is(':checked')) newHiddenIcons.push('poop');
    if ($('#hideIconPissCheckbox').is(':checked')) newHiddenIcons.push('piss');
    if ($('#hideIconGroupCheckbox').is(':checked')) newHiddenIcons.push('group');
    if ($('#hideIconIncestCheckbox').is(':checked')) newHiddenIcons.push('incest');
    if ($('#hideIconBukkakeCheckbox').is(':checked')) newHiddenIcons.push('bukkake');
    if ($('#hideIconTentaclesCheckbox').is(':checked')) newHiddenIcons.push('tentacles');
    if ($('#hideIconRapeCheckbox').is(':checked')) newHiddenIcons.push('rape');
    if ($('#hideIconPublicCheckbox').is(':checked')) newHiddenIcons.push('public');
    if ($('#hideIconFurryCheckbox').is(':checked')) newHiddenIcons.push('furry');
    if ($('#hideIconFatCheckbox').is(':checked')) newHiddenIcons.push('fat');
    if ($('#hideIconHypnosisCheckbox').is(':checked')) newHiddenIcons.push('hypnosis');
    if ($('#hideIconNtrCheckbox').is(':checked')) newHiddenIcons.push('ntr');
    if ($('#hideIconFemdomCheckbox').is(':checked')) newHiddenIcons.push('femdom');
    if ($('#hideIconAICheckbox').is(':checked')) newHiddenIcons.push('ai');
    if ($('#hideIconSafeCheckbox').is(':checked')) newHiddenIcons.push('safe');
    if ($('#hideIconGeneralCheckbox').is(':checked')) newHiddenIcons.push('general');
    if ($('#hideIconQuestionableCheckbox').is(':checked')) newHiddenIcons.push('questionable');
    if ($('#hideIconExplicitCheckbox').is(':checked')) newHiddenIcons.push('explicit');
    if ($('#hideIconCensoredCheckbox').is(':checked')) newHiddenIcons.push('censored');
    if ($('#hideIconUncensoredCheckbox').is(':checked')) newHiddenIcons.push('uncensored');
    if ($('#hideIconR15Checkbox').is(':checked')) newHiddenIcons.push('r15');
    if ($('#hideIconR18Checkbox').is(':checked')) newHiddenIcons.push('r18');
	if ($('#hideIconAsianCheckbox').is(':checked')) newHiddenIcons.push('asian');

    GM.setValue('hiddenIcons', newHiddenIcons);

    location.reload();
  }

  function createToolbar() {
    if (debugMode) console.log('Function: createToolbar');

    // Create the toolbar. Only create if there isn't one already and if there is a image, video or thumbnails.
    if ($('#ibenhancer').length < 1 && ($(containerDOM + ' ' + imageDOM).length || $(containerDOM + ' video').length || $(thumbnailDOM).length)) {

      if (placeSettingsAfter)
        $(toolbarDOM).first().after("<div id='ibenhancer'>Image Board Enhancer<br></div>");
      else $(toolbarDOM).first().before("<div id='ibenhancer'>Image Board Enhancer<br></div>");

      if (showFitButton && ($(containerDOM + ' ' + imageDOM).length || $(containerDOM + ' video').length)) {
        $("#ibenhancer").append("<button id='fitContentButton' style='margin-top: 3px;'>Fit</button>");
        $("#fitContentButton").click(function () { getContentProps(); fitContent(0); });
      }

      if (showScrollButton && ($(containerDOM + ' ' + imageDOM).length || $(containerDOM + ' video').length)) {
        $("#ibenhancer").append("<button id='scrollContentButton' style='margin-top: 3px;'>Scroll</button>");
        $("#scrollContentButton").click(scrollToContent);
      }

      // Create settings.
      $("#ibenhancer").append("<br><button id='ibenhancerSettingsButton' style='margin-top: 3px;'>Settings</button>");
      $("#ibenhancerSettingsButton").click(showSettings);
      $("#ibenhancer").append(`
        <div id="ibenhancerSettings-blocker"></div>
        <div id="ibenhancerSettings">
          <div id="ibenhancerSettings-options">
            <label><input id="resizeImageToFitCheckbox" type="checkbox" ` + (resizeImageToFit ? `checked` : ``) + `>Resize images to fit screen.</label>
            <br>
            <label><input id="resizeVideoToFitCheckbox" type="checkbox" ` + (resizeVideoToFit ? `checked` : ``) + `>Resize videos to fit screen.</label>
            <br>
            <label><input id="autoplayVideosCheckbox" type="checkbox" ` + (autoplayVideos ? `checked` : ``) + `>Autoplay videos.</label>
            <br>
            <label><input id="autoScrollToContentCheckbox" type="checkbox" ` + (autoScrollToContent ? `checked` : ``) + `>Scroll to content.</label>
            <br>
            <label><input id="updateWithWindowResizeCheckbox" type="checkbox" ` + (updateWithWindowResize ? `checked` : ``) + `>Resize content with window.</label>
            <br>
            <label><input id="updateScrollOnWindowResizeCheckbox" type="checkbox" ` + (updateScrollOnWindowResize ? `checked` : ``) + `>Scroll to content on window resize.</label>
            <br>
            <label><input id="showFitButtonCheckbox" type="checkbox" ` + (showFitButton ? `checked` : ``) + `>Show fit button.</label>
            <br>
            <label><input id="showScrollButtonCheckbox" type="checkbox" ` + (showScrollButton ? `checked` : ``) + `>Show scroll button.</label>
            <br>
            <label><input id="showVotingButtonsCheckbox" type="checkbox" ` + (showVotingButtons ? `checked` : ``) + `>Show like and favorite buttons.</label>
            <br>
            <label><input id="removeFluidCheckbox" type="checkbox" ` + (removeFluid ? `checked` : ``) + `>Remove fluid video player.</label>
            <br>
            <label><input id="enableEnhancedThumbnailsCheckbox" type="checkbox" ` + (enableEnhancedThumbnails ? `checked` : ``) + `>Enable enhanced thumbnails.</label>
            <br>
            <label><input id="enableEnhancedThumbnailsDetailsCheckbox" type="checkbox" ` + (enableEnhancedThumbnailsDetails ? `checked` : ``) + `>Enable enhanced thumbnail right click details.</label>
            <br>
            <label><input id="alwaysShowScrollbarsCheckbox" type="checkbox" ` + (alwaysShowScrollbars ? `checked` : ``) + `>Always show scrollbars. (Fixes resize issue.)</label>
            <br>
            <label><input id="enableZoomableImageCheckbox" type="checkbox" ` + (enableZoomableImage ? `checked` : ``) + `>Enable zoomable image.</label>
            <br>
            <label><input id="showFavoriteTagsCheckbox" type="checkbox" ` + (showFavoriteTags['draw'] ? `checked` : ``) + `>Show favorite tags.</label>
            <br>
            <label class="tooltip-140" tooltip="Only works with Enhanced Thumbnails">Open in: <select style="width:110px;" id="defaultClickActionSelect"><option ` + (defaultClickAction == 'new-tab' ? `selected="selected"` : '') + ` value="new-tab">New Tab</option><option ` + (defaultClickAction != 'new-tab' ? `selected="selected"` : '') + ` value="same-window">Same Window</option></select></label>
            <br>
            <label>Max zoom: <input id="maxZoomInput" type="number" min="1" max="5" step="1" value="` + maxZoom + `" style="width:60px;">1 - 5</label>
            <br>
            <label>Zoom speed: <input id="zoomSpeedInput" type="number" min="1" max="15" step="1" value="` + zoomSpeed + `" style="width:60px;">1 - 15</label>
            <br>
            <label>Video volume: <input id="videoVolumeInput" type="number" min="0" max="1" step="0.01" value="` + videoVolume + `" style="width:60px;">0 - 1</label>
            <br>
            <label>Icon Size: <input id="iconSizeInput" type="number" min="16" max="50" step="1" value="` + iconSize + `" style="width:60px;">16 - 50</label>
            <br>
            <label>Resize keyboard shurtcut: <button id="resizeButton">` + resizeButton + `</button></label>
            <br>
            <label>Scroll keyboard shurtcut: <button id="scrollButton">` + scrollButton + `</button></label>
            <br>
            Hide icons: <button id="hideAllIconsButton">Hide All</button> <button id="unhideAllIconsButton">Unhide All</button>
            <br>
            <span id="iconCheckboxes">
              <label><input id="hideIconGifCheckbox" type="checkbox" ` + (hiddenIcons.includes("gif") ? `checked` : ``) + `>GIF</label><br>
              <label><input id="hideIconVideoCheckbox" type="checkbox" ` + (hiddenIcons.includes("video") ? `checked` : ``) + `>Video</label><br>
              <label><input id="hideIconSoundCheckbox" type="checkbox" ` + (hiddenIcons.includes("sound") ? `checked` : ``) + `>Sound</label><br>
              <label><input id="hideIconFlashCheckbox" type="checkbox" ` + (hiddenIcons.includes("flash") ? `checked` : ``) + `>Flash</label><br>
              <label><input id="hideIconStraightCheckbox" type="checkbox" ` + (hiddenIcons.includes("straight") ? `checked` : ``) + `>Straight</label><br>
              <label><input id="hideIconGayCheckbox" type="checkbox" ` + (hiddenIcons.includes("gay") ? `checked` : ``) + `>Yaoi/Gay</label><br>
              <label><input id="hideIconLesbianCheckbox" type="checkbox" ` + (hiddenIcons.includes("lesbian") ? `checked` : ``) + `>Yuri/Lesbian</label><br>
              <label><input id="hideIconTransCheckbox" type="checkbox" ` + (hiddenIcons.includes("trans") ? `checked` : ``) + `>Futanari/Transgender</label><br>
              <label><input id="hideIconTrapCheckbox" type="checkbox" ` + (hiddenIcons.includes("trap") ? `checked` : ``) + `>Trap</label><br>
              <label><input id="hideIconThreeDCheckbox" type="checkbox" ` + (hiddenIcons.includes("threeD") ? `checked` : ``) + `>3D</label><br>
              <label><input id="hideIconLoliCheckbox" type="checkbox" ` + (hiddenIcons.includes("loli") ? `checked` : ``) + `>Loli</label><br>
              <label><input id="hideIconShotaCheckbox" type="checkbox" ` + (hiddenIcons.includes("shota") ? `checked` : ``) + `>Shota</label><br>
              <label><input id="hideIconGoreDeathCheckbox" type="checkbox" ` + (hiddenIcons.includes("goreDeath") ? `checked` : ``) + `>Gore/Death</label><br>
              <label><input id="hideIconPregnantCheckbox" type="checkbox" ` + (hiddenIcons.includes("pregnant") ? `checked` : ``) + `>Pregnant</label><br>
              <label><input id="hideIconBestialityCheckbox" type="checkbox" ` + (hiddenIcons.includes("bestiality") ? `checked` : ``) + `>Bestiality</label><br>
              <label><input id="hideIconFeetCheckbox" type="checkbox" ` + (hiddenIcons.includes("feet") ? `checked` : ``) + `>Feet/Footjob</label><br>
              <label><input id="hideIconBondageCheckbox" type="checkbox" ` + (hiddenIcons.includes("bondage") ? `checked` : ``) + `>Bondage/BDSM</label><br>
              <label><input id="hideIconPoopCheckbox" type="checkbox" ` + (hiddenIcons.includes("poop") ? `checked` : ``) + `>Scat</label><br>
              <label><input id="hideIconPissCheckbox" type="checkbox" ` + (hiddenIcons.includes("piss") ? `checked` : ``) + `>Piss/Golden Shower</label><br>
              <label><input id="hideIconGroupCheckbox" type="checkbox" ` + (hiddenIcons.includes("group") ? `checked` : ``) + `>Group Sex/Gangbang</label><br>
              <label><input id="hideIconIncestCheckbox" type="checkbox" ` + (hiddenIcons.includes("incest") ? `checked` : ``) + `>Incest</label><br>

              <label><input id="hideIconBukkakeCheckbox" type="checkbox" ` + (hiddenIcons.includes("bukkake") ? `checked` : ``) + `>Bukkake</label><br>
              <label><input id="hideIconTentaclesCheckbox" type="checkbox" ` + (hiddenIcons.includes("tentacles") ? `checked` : ``) + `>Tentacles</label><br>
              <label><input id="hideIconRapeCheckbox" type="checkbox" ` + (hiddenIcons.includes("rape") ? `checked` : ``) + `>Rape</label><br>
              <label><input id="hideIconPublicCheckbox" type="checkbox" ` + (hiddenIcons.includes("public") ? `checked` : ``) + `>Public</label><br>
              <label><input id="hideIconFurryCheckbox" type="checkbox" ` + (hiddenIcons.includes("furry") ? `checked` : ``) + `>Furry</label><br>
              <label><input id="hideIconFatCheckbox" type="checkbox" ` + (hiddenIcons.includes("fat") ? `checked` : ``) + `>BBW</label><br>
              <label><input id="hideIconHypnosisCheckbox" type="checkbox" ` + (hiddenIcons.includes("hypnosis") ? `checked` : ``) + `>Hypnosis</label><br>
              <label><input id="hideIconNtrCheckbox" type="checkbox" ` + (hiddenIcons.includes("ntr") ? `checked` : ``) + `>NTR</label><br>
              <label><input id="hideIconFemdomCheckbox" type="checkbox" ` + (hiddenIcons.includes("femdom") ? `checked` : ``) + `>Femdom/Dominatrix</label><br>
              <label><input id="hideIconAICheckbox" type="checkbox" ` + (hiddenIcons.includes("ai") ? `checked` : ``) + `>AI Generated</label><br>
              <label><input id="hideIconCensoredCheckbox" type="checkbox" ` + (hiddenIcons.includes("censored") ? `checked` : ``) + `>Censored</label><br>
              <label><input id="hideIconUncensoredCheckbox" type="checkbox" ` + (hiddenIcons.includes("uncensored") ? `checked` : ``) + `>Uncensored</label><br>


              <label><input id="hideIconSafeCheckbox" type="checkbox" ` + (hiddenIcons.includes("safe") ? `checked` : ``) + `>Rating: Safe/Sensitive</label><br>
              <label><input id="hideIconGeneralCheckbox" type="checkbox" ` + (hiddenIcons.includes("general") ? `checked` : ``) + `>Rating: General</label><br>
              <label><input id="hideIconQuestionableCheckbox" type="checkbox" ` + (hiddenIcons.includes("questionable") ? `checked` : ``) + `>Rating: Questionable</label><br>
              <label><input id="hideIconExplicitCheckbox" type="checkbox" ` + (hiddenIcons.includes("explicit") ? `checked` : ``) + `>Rating: Explicit</label><br>
              <label><input id="hideIconR15Checkbox" type="checkbox" ` + (hiddenIcons.includes("r15") ? `checked` : ``) + `>Rating: R15+</label><br>
              <label><input id="hideIconR18Checkbox" type="checkbox" ` + (hiddenIcons.includes("r18") ? `checked` : ``) + `>Rating: R18+</label><br>
			  <label><input id="hideIconAsianCheckbox" type="checkbox" ` + (hiddenIcons.includes("asian") ? `checked` : ``) + `>Asian</label><br>
            </span>
            <br>
            <button id="deleteTagDbButton">Delete Tag Database</button>
          </div>
          <button id="ibenhancerSettingsSave">Save</button><button id="ibenhancerSettingsCancel">Cancel</button>
        </div>
      ` );

      $("#ibenhancerSettingsSave").click(saveSettings);
      $("#ibenhancerSettingsCancel").click(hideSettings);
      $("#resizeButton").click(changeResizeButtonClicked);
      $("#scrollButton").click(changeScrollButtonClicked);

      $("#hideAllIconsButton").click(() => $('#iconCheckboxes input[type=checkbox]').prop('checked', true));
      $("#unhideAllIconsButton").click(() => $('#iconCheckboxes input[type=checkbox]').prop('checked', false));

      $("#deleteTagDbButton").click(() => GM.setValue('tagDB', {}));


      addGlobalStyle(`
        html.ibenhancerSettingVisible {
          overflow: hidden !important;
        }
        #ibenhancer {
          background: white !important;
          color: black !important;
          border: solid 1px grey;
          border-radius: 4px;
          padding: 5px;
          width: 170px;
          text-align: center !important;
          margin-top: 5px;
          margin-bottom: 5px;
          margin-right: auto;
          ` + containerAlignment + `
        }
        #ibenhancer *:not(a) {
          color: black !important;
        }
        #ibenhancer, #ibenhancerSettings label {
          font-size: 15px !important;
          font-family: Arial, Helvetica, sans-serif !important;
          font-style: normal !important;
          font-weight: normal !important;
          color: black;
        }
        #ibenhancerSettings-blocker {
          position: fixed;
          content: '';
          background-color: rgba(0, 0, 0, .5);
          width: 100vw;
          height: 100vh;
          top: 0;
          left: 0;
          z-index: 1;
          display: none;
        }
        #ibenhancerSettings-blocker.show {
          display: block;
        }
        #ibenhancerSettings {
          position: fixed;
          width: 400px;
          height: 400px;
          left: calc(50vw - 155px);
          top: calc(50vh - 165px);
          background-color: white;
          border: 2px solid black;
          border-radius: 3px;
          padding: 10px;
          text-align: left;
          z-index: 999999;
          display: none;
          -webkit-box-sizing: unset;
          -moz-box-sizing: unset;
          box-sizing: unset;
          color: black;
          padding-bottom: 0px;
        }
        #ibenhancerSettings-options {
          overflow-y: auto;
          overflow-x: hidden;
          width: 100%;
          height: calc(100% - 32px);
        }
        #ibenhancerSettings-options label {
          white-space: nowrap;
        }
        #ibenhancerSettings input {
          margin: 5px;
          width: auto;
        }
        #ibenhancerSettings input[type=number],
        #ibenhancerSettings select {
          border: solid 1px darkgrey;
          background: #fff;
        }
        #ibenhancer button {
          padding: 3px !important;
          width: auto;
          border: solid 1px darkgrey !important;
          margin: 2px !important;
          border-radius 2px !important;
          background: WhiteSmoke !important;
          cursor: pointer;
        }
        #ibenhancerSettings.show {
          display: block;
        }
        #fitContentButton {
          width: 73px !important;
        }
        #scrollContentButton {
          width: 73px !important;
        }
        #ibenhancerSettingsButton {
          width: 150px !important;
        }
      `);

      // Add the like and favorite button
      if (showVotingButtons && loggedin && ($(containerDOM + ' ' + imageDOM).length || $(containerDOM + ' video').length)) {
        if(debugMode) console.log($(containerDOM + ' ' + imageDOM));
        //if(debugMode) console.log($(containerDOM + ' video'));
        addVotingSystem();
      }

      if (showFavoriteTags['draw'])
        addFavoriteTags();

      if (lastVersion < currentVersion)
        addChangelog();
    }
  }

  function addVotingSystem() {
    if (debugMode) console.log('Function: addVotingSystem');


    // All sites handle votes and favorites differently.
    // Some you can like and then remove that like.
    // Others you can like or dislike and remove.
    // Some you can like or dislike and not remove.
    // Some have a score but no like button.
    // Some have a add to favorite button but not a remove. (Remove from a different page.)
    // And then theres konochan and yand.re, that voting system is weird. 0 to 3 stars where 3 stars adds it to you favorites and favoriting something gives it 3 stars then changing your vote removes the favorite.
    // Sankaku has a great system right at the top, so no need to change that.

    // missing: tbib(like), Danbooru(like), rule34.paheal.net(I dont have an account)

    $("#ibenhancer").append('<br>' +
      '<div id="ibenhancer-post-controls">' +

      '<div id="like-button" class="ibenhancer-button" alt="like" tooltip="Like">' +
      likeButtonSvg +
      '</div>' +

      '<div id="dislike-button" class="ibenhancer-button" alt="dislike" tooltip="Dislike">' +
      likeButtonSvg +
      '</div>' +

      '<div id="favorite-button" class="ibenhancer-button" tooltip="Add to Favorites">' +
      favoriteButtonSvg +
      '</div>' +

      '<div id="unfavorite-button" class="ibenhancer-button" tooltip="Remove from Favorites">' +
      favoriteButtonSvg +
      '</div>' +

      '<div id="star0-button" class="ibenhancer-button ibenhancer-star" tooltip="Remove Vote">' +
      undoButtonSvg +
      '</div>' +

      '<div id="star1-button" class="ibenhancer-button ibenhancer-star" tooltip="Vote Good">' +
      starButtonSvg +
      '</div>' +

      '<div id="star2-button" class="ibenhancer-button ibenhancer-star" tooltip="Vote Great">' +
      starButtonSvg +
      '</div>' +

      '<div id="star3-button" class="ibenhancer-button ibenhancer-star" tooltip="Add to Favorites">' +
      starButtonSvg +
      '</div>' +

      '</div>');

    // rule34.xxx
    // no dislike and unfavorite must be done from favorites page
    if (site == 'rule34.xxx') {
      $('#ibenhancer-post-controls').addClass('show-like');
      $("#like-button").click(function () { $("#stats > ul > li:contains('(vote up)') > a:contains('up')").click(); });
      $('#ibenhancer-post-controls').addClass('show-favorite');
      $("#favorite-button").click(function () { $("#stats + div > ul > li > a:contains('Add to favorites')").click(); });
    }

    // rule34.us
    // no dislike and unfavorite must be done from favorites page
    if (site == 'rule34.us') {
      $('#ibenhancer-post-controls').addClass('show-like');
      $("#like-button").click(function () { $("a[title|='Upvote Image']").click(); });
      $('#ibenhancer-post-controls').addClass('show-favorite');
      $("#favorite-button").click(function () { $(".content_push a:contains('Favorite')").click(); });
    }

    // gelbooru.com
    // no dislike and unfavorite must be done from favorites page
    else if (site == 'gelbooru.com') {
      $('#ibenhancer-post-controls').addClass('show-like');
      $("#like-button").click(function () { $('#container .aside #tag-list a').filter(function (index) { return $(this).text() === "Up"; }).click(); });
      $('#ibenhancer-post-controls').addClass('show-favorite');
      $("#favorite-button").click(function () { $('#container .aside #tag-list a').filter(function (index) { return $(this).text() === "Add to favorites"; }).trigger("click"); });
    }

    // danbooru.donmai.us
    // no like for dislike button BUT there is a score
    else if (site == 'danbooru.donmai.us') {
      $("#favorite-button").click(function () { $('#add-to-favorites')[0].click(); });
      $("#unfavorite-button").click(function () { $('#remove-from-favorites')[0].click(); });

      function checkAddFavorite() {
        if ($('#add-to-favorites').css('display') != 'none')
          $('#ibenhancer-post-controls').addClass('show-favorite');
        else
          $('#ibenhancer-post-controls').removeClass('show-favorite');
      }
      function checkRemoveFavorite() {
        if ($('#remove-from-favorites').css('display') != 'none')
          $('#ibenhancer-post-controls').addClass('show-unfavorite');
        else
          $('#ibenhancer-post-controls').removeClass('show-unfavorite');
      }


      var observerAddFavorite = new MutationObserver(checkAddFavorite);
      observerAddFavorite.observe(document.getElementById('add-to-favorites'), { attributes: true, attributeFilter: ['style'] });

      var observerRemoveFavorite = new MutationObserver(checkRemoveFavorite);
      observerRemoveFavorite.observe(document.getElementById('remove-from-favorites'), { attributes: true, attributeFilter: ['style'] });

      checkAddFavorite();
      checkRemoveFavorite();
    }

    // konachan.com, konachan.net, yande.re
    // Uses a star rating system from 0 to 3, where 3 adds to your favorites.
    else if (site == 'konachan.com' || site == 'konachan.net' || site == 'yande.re') {
      $('#ibenhancer-post-controls').addClass('show-stars');
      $("#star0-button").click(function () {
        $('.stars.standard-vote-widget .star.star-0')[0].click();
      });
      $("#star1-button").click(function () {
        $('.stars.standard-vote-widget .star.star-1')[0].click();
      });
      $("#star2-button").click(function () {
        $('.stars.standard-vote-widget .star.star-2')[0].click();
      });
      $("#star3-button").click(function () {
        $('.stars.standard-vote-widget .star.star-3')[0].click();
      });
      $('.stars.standard-vote-widget .star.star-1').bind('DOMSubtreeModified', function (e) {
        checkStars('1');
      });
      $('.stars.standard-vote-widget .star.star-2').bind('DOMSubtreeModified', function (e) {
        checkStars('2');
      });
      $('.stars.standard-vote-widget .star.star-3').bind('DOMSubtreeModified', function (e) {
        checkStars('3');
      });
      function checkStars(star) {
        if ($('.stars.standard-vote-widget .star.star-' + star).hasClass('star-set-upto'))
          $("#star" + star + "-button").addClass('star-set-upto');
        else
          $("#star" + star + "-button").removeClass('star-set-upto');
      }
      checkStars('1');
      checkStars('2');
      checkStars('3');
    }

    // safebooru.org
    else if (site == 'safebooru.org') {
      $('#ibenhancer-post-controls').addClass('show-favorite');
      $('#ibenhancer-post-controls').addClass('show-like');
      $('#ibenhancer-post-controls').addClass('show-dislike');

      $("#favorite-button").click(function () { $('.sidebar a').filter(function (index) { return $(this).text() === "Add to favorites"; }).click(); });
      $("#like-button").click(function () { $('.sidebar a').filter(function (index) { return $(this).text() === "up"; }).click(); });
      $("#dislike-button").click(function () { $('.sidebar a').filter(function (index) { return $(this).text() === "down"; }).click(); });
    }

    // tbib.org
    else if (site == 'tbib.org') {
      $('#ibenhancer-post-controls').addClass('show-favorite');
      $("#favorite-button").click(function () { $('.sidebar a').filter(function (index) { return $(this).text() === "Add to favorites"; }).click(); });
    }

    // behoimi.org
    else if (site == 'behoimi.org') {
      $('#ibenhancer-post-controls').addClass('show-favorite');
      $('#ibenhancer-post-controls').addClass('show-unfavorite');
      $('#ibenhancer-post-controls').addClass('show-like');
      $('#ibenhancer-post-controls').addClass('show-dislike');

      $("#favorite-button").click(function () { $('#add-to-favs a').click(); });
      $("#unfavorite-button").click(function () { $('#remove-from-favs a').click(); });
      $("#like-button").click(function () { $('#stats a').filter(function (index) { return $(this).text() === "up"; }).click(); });
      $("#dislike-button").click(function () { $('#stats a').filter(function (index) { return $(this).text() === "down"; }).click(); });
    }

    // rule34.paheal.net
    else if (site == 'rule34.paheal.net') {
      // Can't create an account so I can't do this website
    }

    // rule34hentai.net
    else if (site == 'rule34hentai.net') {

      if ($('#Image_Controlsleft input[value="Favorite"]').length > 0)
        $('#ibenhancer-post-controls').addClass('show-favorite');
      if ($('#Image_Controlsleft input[value="Un-Favorite"]').length > 0)
        $('#ibenhancer-post-controls').addClass('show-unfavorite');

      if ($('#Image_Scoreleft input[value="Vote Up"]').length > 0)
        $('#ibenhancer-post-controls').addClass('show-like');



      $("#favorite-button").click(function () { $('#Image_Controlsleft input[value="Favorite"]').click(); });
      $("#unfavorite-button").click(function () { $('#Image_Controlsleft input[value="Un-Favorite"]').click(); });
      $("#like-button").click(function () { $('#Image_Scoreleft input[value="Vote Up"]').click(); });

      // Unused for now.
      var removeLikeRule34hentai = () => $('#Image_Scoreleft input[value="Remove Vote"]').trigger("click");
    }

    // e621.net, e926.net
    else if (site == 'e621.net' || site == 'e926.net') {

      $('#ibenhancer-post-controls').addClass('e621-vote');

      function checkAddFavorite() {
        if ($('#add-fav-button').css('display') != 'none')
          $('#ibenhancer-post-controls').addClass('show-favorite');
        else
          $('#ibenhancer-post-controls').removeClass('show-favorite');
      }
      function checkRemoveFavorite() {
        if ($('#remove-fav-button').css('display') != 'none')
          $('#ibenhancer-post-controls').addClass('show-unfavorite');
        else
          $('#ibenhancer-post-controls').removeClass('show-unfavorite');
      }

      function checkLiked() {
        if ($('#image-extra-controls .image-vote-buttons .post-vote-up-link span').hasClass('score-positive')) {
          $("#like-button").addClass('vote-selected');
        } // Set liked style
        else {
          $("#like-button").removeClass('vote-selected');
        } // Remove liked style
      }
      function checkDisliked() {
        if ($('#image-extra-controls .image-vote-buttons .post-vote-down-link span').hasClass('score-negative')) {
          $("#dislike-button").addClass('vote-selected');
        } // Set disliked style
        else {
          $("#dislike-button").removeClass('vote-selected');
        } // Remove disliked style
      }

      var observerAddFavorite = new MutationObserver(checkAddFavorite);
      observerAddFavorite.observe(document.getElementById('add-fav-button'), { attributes: true, attributeFilter: ['style'] });

      var observerRemoveFavorite = new MutationObserver(checkRemoveFavorite);
      observerRemoveFavorite.observe(document.getElementById('remove-fav-button'), { attributes: true, attributeFilter: ['style'] });

      $('#image-extra-controls .image-vote-buttons .post-vote-up-link span').bind('DOMSubtreeModified', checkLiked);
      $('#image-extra-controls .image-vote-buttons .post-vote-down-link span').bind('DOMSubtreeModified', checkDisliked);

      checkAddFavorite();
      checkRemoveFavorite();
      checkLiked();
      checkDisliked();

      $('#ibenhancer-post-controls').addClass('show-like');
      $('#ibenhancer-post-controls').addClass('show-dislike');

      $("#favorite-button").click(function () { $('#image-extra-controls #add-fav-button').click(); });
      $("#unfavorite-button").click(function () { $('#image-extra-controls #remove-fav-button').click(); });

      $("#like-button").click(function () { $('#image-extra-controls .image-vote-buttons .post-vote-up-link span').click(); });
      $("#dislike-button").click(function () { $('#image-extra-controls .image-vote-buttons .post-vote-down-link span').click(); });
    }

    addGlobalStyle(`
      #ibenhancer-post-controls {
        display: flex;
        justify-content: center;
      }
      .ibenhancer-button {
        cursor: pointer;
        width: 32px;
        padding: 3px;
        margin: 0;
        border: none;
        vertical-align: middle;
        display: none;
      }
      #favorite-button, #unfavorite-button {
        stroke: #E04F5F;
        stroke-width: 64px;
        fill: transparent;
      }
      #unfavorite-button {
        fill: #E04F5F;
      }
      #like-button {
        fill: #2ECC71;
      }
      #dislike-button {
        fill: #E04F5F;
      }
      #ibenhancer-post-controls.e621-vote #like-button,
      #ibenhancer-post-controls.e621-vote #dislike-button {
        fill: #1F3C67;
      }
      #ibenhancer-post-controls.e621-vote #like-button.vote-selected {
        fill: #2ECC71;
      }
      #ibenhancer-post-controls.e621-vote #dislike-button.vote-selected {
        fill: #E04F5F;
      }
      #dislike-button svg {
        transform: scaleY(-1);
      }
      #star0-button, #star1-button, #star2-button, #star3-button {
        stroke-width: 42px;
        fill: transparent;
      }
      #star0-button {
        fill: black;
      }
      #star1-button {
        stroke: #FCA106;
      }
      #star2-button {
        stroke: #FB6222;
      }
      #star3-button {
        stroke: #E04F5F;
      }
      #star1-button.star-set-upto {
        fill: #FCA106;
      }
      #star2-button.star-set-upto {
        fill: #FB6222;
      }
      #star3-button.star-set-upto {
        fill: #E04F5F;
      }
      .ibenhancer-button:hover {
        background-color: rgba(255,255,255,.5);
      }
      .ibenhancer-button:active {
        background-color: rgba(255,255,255,1);
      }
      #ibenhancer-post-controls.show-like #like-button,
      #ibenhancer-post-controls.show-dislike #dislike-button,
      #ibenhancer-post-controls.show-favorite #favorite-button,
      #ibenhancer-post-controls.show-unfavorite #unfavorite-button,
      #ibenhancer-post-controls.show-stars .ibenhancer-star {
        display: block;
      }
    `);
  }

  function addFavoriteTags() {

    if (typeof favoriteTags[site] !== 'string')
      favoriteTags[site] = '';

    $("#ibenhancer").append(`
      <div id="ibenhancer-favorite-tags">
        <details>
          <summary>Favorite Tags</summary>
          <div id="ibenhancer-favorite-tags-content">
            <span id="ibenhancer-favorite-tags-edit-button">Edit</span>
            <div id="ibenhancer-favorite-tags-list"></div>
          </div>
          <div id="ibenhancer-favorite-tags-editor">
            <textarea id="ibenhancer-favorite-tags-textarea" style="width: 90%; height: 100px;"></textarea>
            <button id="ibenhancer-favorite-tags-editor-save-button">Save</button><button id="ibenhancer-favorite-tags-editor-cancel-button">Cancel</button>
          </div>
        </details>
      </div>
    `);

    if (showFavoriteTags['open'])
      $('#ibenhancer-favorite-tags > details').attr('open', true);

    $('#ibenhancer-favorite-tags > details > summary').click(function () {
      setTimeout(function () {
        showFavoriteTags['open'] = $('#ibenhancer-favorite-tags > details')[0].open;
        GM.setValue('showFavoriteTags', showFavoriteTags);
      });
    });

    $('#ibenhancer-favorite-tags-edit-button').click(function () {
      $('#ibenhancer-favorite-tags-textarea').val(favoriteTags[site]);
      $('#ibenhancer-favorite-tags').addClass('edit');
    });

    $('#ibenhancer-favorite-tags-editor-cancel-button').click(function () {
      $('#ibenhancer-favorite-tags').removeClass('edit');
    });

    $('#ibenhancer-favorite-tags-editor-save-button').click(function () {
      favoriteTags[site] = $('#ibenhancer-favorite-tags-textarea').val();
      GM.setValue('favoriteTags', favoriteTags);
      renderFavoriteTags();
      setTimeout(function() {
        $('#ibenhancer-favorite-tags').removeClass('edit');
      });
    });

    function renderFavoriteTags() {
      var tags = favoriteTags[site].split(' ');
      $('#ibenhancer-favorite-tags-list').html(getTagsHtml(tags));
    }

    renderFavoriteTags();

    addGlobalStyle(`
      #ibenhancer-favorite-tags > details > summary {
        margin-left: -8px;
      }
      #ibenhancer-favorite-tags details summary::-webkit-details-marker {
        display: none;
      }
      #ibenhancer-favorite-tags details summary {
        list-style: none;
        cursor: pointer;
      }
      #ibenhancer-favorite-tags details summary:after {
        content: '►';
        float: right;
        transform: rotate(90deg);
      }
      #ibenhancer-favorite-tags details[open] summary:after {
        transform: rotate(270deg);
      }
      #ibenhancer-favorite-tags details {
        text-align: left;
        padding: 2px 8px;
        color: black;
      }
      #ibenhancer-favorite-tags-edit-button {
        color: black;
        cursor: pointer;
        user-select: none;
      }
      #ibenhancer-favorite-tags-edit-button:hover {
        text-decoration: underline;
      }
      #ibenhancer-favorite-tags #ibenhancer-favorite-tags-editor {
        display: none;
      }
      #ibenhancer-favorite-tags.edit #ibenhancer-favorite-tags-content {
        display: none;
      }
      #ibenhancer-favorite-tags.edit #ibenhancer-favorite-tags-editor {
        display: block;
      }
      #ibenhancer-favorite-tags-list {
        display: flex;
        flex-direction: column;
      }
      #ibenhancer-favorite-tags-list a {
        color: #000099;
      }
    `);
  }

  function addChangelog() {
    if (debugMode) console.log('Function: addChangelog');

    // Add Changelog
    $("#ibenhancer").append(`
      <div id="ibenhancer-changelog">
        <details>
          <summary><div id="close-changelog-button" tooltip="Hide">` + closeSvg + `</div>Changelog</summary>
          <div id="ibenhancer-changelog-updates">
            <!-- Remember to move the bold tag! -->

            <details>
              <summary>Version <b>1.5.14</b></summary>
              <div>
                <ul>
                  <li>Voting system should now show up on videos, however video ads may cause it to appear on search pages. (To fix later.)</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.13</summary>
              <div>
                <ul>
                  <li>Removed video ads on Gelbooru, hopefully fixing issues.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.12</summary>
              <div>
                <ul>
                  <li>Fixed Gelbooru resizing. (Hopefully)</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.10</summary>
              <div>
                <ul>
                  <li>Added icons for Censored, Uncensored, General, R15+ and R18+.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.9</summary>
              <div>
                <ul>
                  <li>Added icon for AI Generated art.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.8</summary>
              <div>
                <ul>
                  <li>Reduced CPU usage on most websites.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.7</summary>
              <div>
                <ul>
                  <li>Added favorite tags, this can be hidden from settings.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.6</summary>
              <div>
                <ul>
                  <li>Updated rule34.us support.</li>
                  <li>Fixed enhanced thumbnail alignments (mostly).</li>
                  <li>Added colour to enhanced details tags on rule34.us.</li>
                  <li>Added like and favorite buttons to rule34.us.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.5</summary>
              <div>
                <ul>
                  <li>Added basic support for rule34.us.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.4</summary>
              <div>
                <ul>
                  <li>Added plus and minus links to tags in enhanced thumbnail details on rule34.paheal.net and rule34hentai.net.</li>
                  <li>Removed non tag elements from enhanced thumbnail details tag list.</li>
                </ul>
              </div>
            </details>

            <details>
              <summary>Version 1.5.3</summary>
              <div>Attempt to fix 'Remove fluid video player' on rule34hentai.net.</div>
            </details>

            <details>
              <summary>Version 1.5.2</summary>
              <div>Fixed changelog not staying hidden.</div>
            </details>

            <details>
              <summary>Version 1.5.1</summary>
              <div>Attempt to fix scroll errors.</div>
            </details>

            <details>
              <summary>Version 1.5</summary>
              <div>
              <ul>
                <li>Added right click details to tumbnails. Note: Tag colors are gathered as they are seen in the sidebar, the more posts viewed the more colors will be displayed.</li>
                <li>Added SauceNAO image search to right click details.</li>
                <li>Added default click action setting. Default: New Tab</li>
                <li>Added enhanced thumbnails to favorites page of rule34.xxx, gelbooru, Safebooru and tbib.org. Right click a thumbnail and click the X to remove from favorites.</li>
                <li>Added changelog.</li>
              </ul>
            </div>
            </details>

            <details>
              <summary>Version 1.4</summary>
              <div>Added like and favorite buttons to most supported websites.</div>
            </details>

            <a href="https://greasyfork.org/en/scripts/387312/versions" target="_blank">Full Changelog</a>

          </div>
        </details>
      </div>
    `);

    $('#close-changelog-button').click(function () {
      if (debugMode) console.log('remove changelog');
      $('#ibenhancer-changelog').remove();
      GM.setValue('lastVersion', currentVersion);
    });

    addGlobalStyle(`
      #close-changelog-button {
        display: inline-block;
        height: 9px;
        width: 9px;
        padding: 4px;
        border-radius: 50%;
        margin-top: -18px;
        box-sizing: content-box;
      }
      #close-changelog-button:hover {
        background-color: #ccc;
      }
      #ibenhancer-changelog > details > summary {
        margin-left: -8px;
      }
      #ibenhancer-changelog details summary::-webkit-details-marker {
        display: none;
      }
      #ibenhancer-changelog details summary {
        list-style: none;
        cursor: pointer;
      }
      #ibenhancer-changelog details summary:after {
        content: '►';
        float: right;
        transform: rotate(90deg);
      }
      #ibenhancer-changelog details[open] summary:after {
        transform: rotate(270deg);
      }
      #ibenhancer-changelog details {
        text-align: left;
        padding: 2px 8px;
        color: black;
      }
      #ibenhancer-changelog #ibenhancer-changelog-updates details {
        padding: 0px;
        font-size: .8rem;
        margin-left: -8px;
      }
      #ibenhancer-changelog #ibenhancer-changelog-updates details summary:after, #ibenhancer-changelog #ibenhancer-changelog-updates details[open] summary:after {
        transform: rotate(0deg);
        content: '';
      }
      #ibenhancer-changelog-updates details summary:before {
        content: '+';
        width: 1rem;
        display: inline-block;
        float: left;
        margin-right: -8px;
        width: 17px;
      }
      #ibenhancer-changelog-updates details[open] summary:before {
        content: '-';
      }
      #ibenhancer-changelog-updates details summary + * {
        padding-left: 9px;
      }
      #ibenhancer-changelog-updates ul li {
        list-style-type: disc !important;
        margin-left: 3px !important;
        color: black;
      }
    `);

  }

  function keyboardShortcuts() {
    if (debugMode) console.log('Function: keyboardShortcuts');

    document.addEventListener('keyup', (e) => {
      if (debugMode) console.log(e.code);
      if (changeKeyboardShortcut && e.code == 'Escape') {
        $('#resizeButton').html(resizeButton);
        $('#scrollButton').html(scrollButton);
        changeKeyboardShortcut = false;
      }
      if (!changeKeyboardShortcut) {
        if (e.code === resizeButton) { getContentProps(0); fitContent(0); }
        else if (e.code === scrollButton) scrollToContent(0);
      }
      else if (changeKeyboardShortcut == 'resizeButton') {
        resizeButton = e.code;
        $('#resizeButton').html(e.code);
        changeKeyboardShortcut = false;
      }
      else if (changeKeyboardShortcut == 'scrollButton') {
        scrollButton = e.code;
        $('#scrollButton').html(e.code);
        changeKeyboardShortcut = false;
      }
    });
  }

  function checkForMoreThumbnails() {
    if (debugMode) console.log('Function: checkForMoreThumbnails');

    var oldNumber = thumbnails.length;
    thumbnails = $(thumbnailDOM);
    return (thumbnails.length > oldNumber);
  }

  function getTagsHtml(tags) {
    var tagHTML = '';
    var linksHTML = [];

    for (var i = 0; i < tags.length; i++) {
      if (tags[i] == '//') break;
      if (tags[i] != '') {

        var color = '';
        var tagtype = 5;

        if (tags[i].startsWith("rating:") || tags[i].startsWith("score:") || tags[i].startsWith("user:") || tags[i].startsWith("id:") || tags[i].startsWith("date:") || tags[i].startsWith("status:") || tags[i].startsWith("size:"))
          tagtype = 10;

        if (typeof tagDB[site] !== 'undefined' && typeof tagDB[site][tags[i].replaceAll('_', ' ')] !== 'undefined') {

          color = 'style="color:' + tagDB[site][tags[i].replaceAll('_', ' ')].color + ' !important;"';
          tagtype = tagDB[site][tags[i].replaceAll('_', ' ')].type;
        }

        var plusLink = '';
        var minusLink = '';
        if (site == 'rule34.paheal.net' || site == 'rule34hentai.net') {
          if (document.location.pathname.toLocaleLowerCase().startsWith('/post/list/')) {
            var currentTags = document.location.pathname.toLocaleLowerCase().split('/')[3];
            plusLink = tagSearchLink + currentTags + ' ' + tags[i] + tagSearchLinkafter;
            minusLink = tagSearchLink + currentTags + ' -' + tags[i] + tagSearchLinkafter;
          }
          else {
            plusLink = tagSearchLink + tags[i] + tagSearchLinkafter;
            minusLink = tagSearchLink + '-' + tags[i] + tagSearchLinkafter;
          }
        }
        else if (typeof urlParams.get(tagsURLParam) === 'string') {
          plusLink = tagSearchLink + (urlParams.get(tagsURLParam) + ' ' + tags[i]).replaceAll(' ', '+') + tagSearchLinkafter;
          minusLink = tagSearchLink + (urlParams.get(tagsURLParam) + ' -' + tags[i]).replaceAll(' ', '+') + tagSearchLinkafter;
          if (debugMode) console.log('Remove later', plusLink);
        }
        else {
          plusLink = tagSearchLink + tags[i] + tagSearchLinkafter;
          minusLink = tagSearchLink + '-' + tags[i] + tagSearchLinkafter;
        }
        linksHTML.push({
          html: '<span><a href="' + plusLink + '" ' + color + '>+</a>&nbsp;<a href="' + minusLink + '" ' + color + '>-</a>&nbsp;<a href="' + tagSearchLink + tags[i] + tagSearchLinkafter + '" ' + color + '>' + tags[i].replaceAll('_', ' ') + '</a></span>',
          type: tagtype
        });
      }
    }

    function compare(a, b) {
      if (a.type < b.type) {
        return -1;
      }
      if (a.type > b.type) {
        return 1;
      }
      return 0;
    }

    linksHTML.sort(compare);

    for (let i = 0; i < linksHTML.length; i++) {
      tagHTML += linksHTML[i].html;
    }

    return tagHTML;
  }

  function addEnhancedThumbnails() {
    if (debugMode) console.log('Function: addEnhancedThumbnails');

    if (enableEnhancedThumbnails) thumbnails = $(thumbnailDOM);

    if (debugMode) console.log(thumbnails);

    if (!(thumbnails.length > 0))
      return;

    // The span after a#thumbPlusPreviewLink is to stop ublock origin blocking div and img after a tags with the target _blank on Gelbooru.
    // Why is that a rule its so vague?
    $('body').append(`
      <div id="thumbPlusDetailsBlocker"></div>
      <div id="thumbPlusPreviewContainer">
        <a href="#" id="thumbPlusPreviewLink" target="` + (defaultClickAction == 'new-tab' ? '_blank' : '') + `" style="">
          <span>
            <div id="thumbPlusPreview" class="">
              <div id="thumbPlusPreviewImage"></div>
              <div id="thumbPlusIcons" style="position: relative;">
                <span id="thumbPlusPreviewGif" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("gif") ? `` : `show`) + `" tooltip="GIF">` + icons['gif'] + `</span>
                <span id="thumbPlusPreviewVideo" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("video") ? `` : `show`) + `" tooltip="Video">` + icons['video'] + `</span>
                <span id="thumbPlusPreviewFlash" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("flash") ? `` : `show`) + `" tooltip="Flash Animation">` + icons['flash'] + `</span>
                <span id="thumbPlusPreviewSound" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("sound") ? `` : `show`) + `" tooltip="Has Sound">` + icons['sound'] + `</span>
                <span id="thumbPlusPreview3D" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("threeD") ? `` : `show`) + `" tooltip="3D">` + icons['threeD'] + `</span>
                <span id="thumbPlusPreviewStraight" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("straight") ? `` : `show`) + `" tooltip="Straight">` + icons['straight'] + `</span>
                <span id="thumbPlusPreviewGay" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("gay") ? `` : `show`) + `" tooltip="Yaoi/Gay">` + icons['gay'] + `</span>
                <span id="thumbPlusPreviewLesbian" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("lesbian") ? `` : `show`) + `" tooltip="Yuri/Lesbian">` + icons['lesbian'] + `</span>
                <span id="thumbPlusPreviewTrans" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("trans") ? `` : `show`) + `" tooltip="Futanari/Transgender">` + icons['trans'] + `</span>
                <span id="thumbPlusPreviewTrap" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("trap") ? `` : `show`) + `" tooltip="Trap">` + icons['trap'] + `</span>
                <span id="thumbPlusPreviewLoli" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("loli") ? `` : `show`) + `" tooltip="Loli">` + icons['loli'] + `</span>
                <span id="thumbPlusPreviewShota" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("shota") ? `` : `show`) + `" tooltip="Shota">` + icons['shota'] + `</span>
                <span id="thumbPlusPreviewGoreDeath" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("goreDeath") ? `` : `show`) + `" tooltip="Gore/Death">` + icons['goreDeath'] + `</span>
                <span id="thumbPlusPreviewPregnant" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("pregnant") ? `` : `show`) + `" tooltip="Pregnant">` + icons['pregnant'] + `</span>
                <span id="thumbPlusPreviewBestiality" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("bestiality") ? `` : `show`) + `" tooltip="Bestiality">` + icons['bestiality'] + `</span>
                <span id="thumbPlusPreviewFeet" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("feet") ? `` : `show`) + `" tooltip="Feet/Footjob">` + icons['feet'] + `</span>
                <span id="thumbPlusPreviewBondage" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("bondage") ? `` : `show`) + `" tooltip="Bondage/BDSM">` + icons['bondage'] + `</span>
                <span id="thumbPlusPreviewPoop" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("poop") ? `` : `show`) + `" tooltip="Scat">` + icons['poop'] + `</span>
                <span id="thumbPlusPreviewPiss" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("piss") ? `` : `show`) + `" tooltip="Piss/Golden Shower">` + icons['piss'] + `</span>
                <span id="thumbPlusPreviewGroup" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("group") ? `` : `show`) + `" tooltip="Group Sex/Gangbang">` + icons['group'] + `</span>
                <span id="thumbPlusPreviewIncest" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("incest") ? `` : `show`) + `" tooltip="Incest">` + icons['incest'] + `</span>
                <span id="thumbPlusPreviewBukkake" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("bukkake") ? `` : `show`) + `" tooltip="Bukkake">` + icons['bukkake'] + `</span>
                <span id="thumbPlusPreviewTentacles" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("tentacles") ? `` : `show`) + `" tooltip="Tentacles">` + icons['tentacles'] + `</span>
                <span id="thumbPlusPreviewRape" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("rape") ? `` : `show`) + `" tooltip="Rape">` + icons['rape'] + `</span>
                <span id="thumbPlusPreviewPublic" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("public") ? `` : `show`) + `" tooltip="Public Sex/Exhibitionism">` + icons['public'] + `</span>
                <span id="thumbPlusPreviewFurry" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("furry") ? `` : `show`) + `" tooltip="Furry">` + icons['furry'] + `</span>
                <span id="thumbPlusPreviewFat" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("fat") ? `` : `show`) + `" tooltip="Chubby/BBW">` + icons['fat'] + `</span>
                <span id="thumbPlusPreviewHypnosis" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("hypnosis") ? `` : `show`) + `" tooltip="Hypnosis/Mind Control">` + icons['hypnosis'] + `</span>
                <span id="thumbPlusPreviewNtr" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("ntr") ? `` : `show`) + `" tooltip="Netorare (NTR)/Cuckold">` + icons['ntr'] + `</span>
                <span id="thumbPlusPreviewFemdom" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("femdom") ? `` : `show`) + `" tooltip="Femdom">` + icons['femdom'] + `</span>
                <span id="thumbPlusPreviewAI" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("ai") ? `` : `show`) + `" tooltip="Ai Generated">` + icons['ai'] + `</span>
                <span id="thumbPlusPreviewSafe" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("safe") ? `` : `show`) + `" tooltip="Rating: ` + (site == 'danbooru.donmai.us' ? `Sensitive` : `Safe`) + `">` + icons['safe'] + `</span>
                <span id="thumbPlusPreviewCensored" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("censored") ? `` : `show`) + `" tooltip="Censored">` + icons['censored'] + `</span>
                <span id="thumbPlusPreviewUncensored" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("uncensored") ? `` : `show`) + `" tooltip="Uncensored">` + icons['uncensored'] + `</span>
                <span id="thumbPlusPreviewGeneral" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("general") ? `` : `show`) + `" tooltip="Rating: General">` + icons['general'] + `</span>
                <span id="thumbPlusPreviewQuestionable" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("questionable") ? `` : `show`) + `" tooltip="Rating: Questionable">` + icons['questionable'] + `</span>
                <span id="thumbPlusPreviewExplicit" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("explicit") ? `` : `show`) + `" tooltip="Rating: Explicit">` + icons['explicit'] + `</span>
                <span id="thumbPlusPreviewR15" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("r15") ? `` : `show`) + `" tooltip="Rating: R15+">` + icons['r15'] + `</span>
                <span id="thumbPlusPreviewR18" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("r18") ? `` : `show`) + `" tooltip="Rating: R18+">` + icons['r18'] + `</span>
				<span id="thumbPlusPreviewAsian" class="thumbPlusPreviewIcon ` + (hiddenIcons.includes("Asian") ? `` : `show`) + `" tooltip="Asian">` + icons['asian'] + `</span>
              </div>
            </div>
          </span>
        </a>
        <div id="thumbPlusDetails">
          <div id="thumbPlusDetailsTags">
          </div>
          <div id="thumbPlusDetailsOptions">
            <div><div class="thumbPlusDetailsButton" id="thumbPlusDetailsButtonRemove" tooltip="Remove from Favorites">` + closeSvg + `</div></div>
            <div>
              <div class="thumbPlusDetailsButton" id="thumbPlusDetailsButtonSearch" tooltip="Search SauceNAO">
              ` + searchSvg + `
              </div>
              <a href="#" id="thumbPlusDetailsButtonSameWindow"><div class="thumbPlusDetailsButton" tooltip="Open in This Window">
                ` + windowSvg + `
              </div></a>
              <div class="thumbPlusDetailsButton" id="thumbPlusDetailsButtonNewTab" tooltip="Open in New Tab">
              ` + tabSvg + `
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    $('#thumbPlusPreview').css({ backgroundColor: $('body').css("background-color") != "rgba(0, 0, 0, 0)" ? $('body').css("background-color") : 'white' });
    $('#thumbPlusDetailsTags').css({ backgroundColor: $('body').css("background-color") != "rgba(0, 0, 0, 0)" ? $('body').css("background-color") : 'white' });
    $('#thumbPlusPreview').mouseout(closeThumb);
    $('#thumbPlusDetailsButtonRemove').click(function () { removeFavorite(); });

    $('#thumbPlusDetailsButtonNewTab').click(function () {
      var win = window.open($('#thumbPlusPreviewLink').attr('href'), '_blank');
      win.focus();
    });


    $('#thumbPlusDetailsButtonSearch').click(function () {
      var win = window.open('https://saucenao.com/search.php?url=' + currentImageThumb, '_blank');
      win.focus();
    });

    function closeThumb() {
      if ((!debugMode || (!keepThumbOpen && debugMode)) && !thumbDetailsOpen) {
        $('#thumbPlusPreviewContainer').removeClass('show');
        $('#thumbPlusDetailsButtonRemove').removeClass('show');
        $('#thumbPlusPreview').removeClass('show gif video sound flash straight gay lesbian trans threed trap loli shota gore pregnant bestiality feet bondage poop piss group incest bukkake tentacles rape public furry fat hypnosis ntr femdom ai censored uncensored safe general questionable explicit r15 r18 asian');
      }
    }

    function addThumbnailEnhancement() {
      if (debugMode) console.log('Add thumbnails');
      if (enableEnhancedThumbnails) thumbnails = $(thumbnailDOM);

      var tmp = 0;
      thumbnails.each(function () {
        if (!$(this).hasClass('ibeThumbnail')) {
          $(this).mouseover(function (e) {
            if (!thumbDetailsOpen)
              thumbnailMouseOver(this);
          });
          $(this).addClass('ibeThumbnail');
          tmp++;
        }
      });
      if (debugMode) console.log('Added', tmp, 'thumbnails.');
    }

    addThumbnailEnhancement();
    if (siteUsesInfScroll) setInterval(function () {
      if (checkForMoreThumbnails()) addThumbnailEnhancement();
    }, 100);

    var tags;

    function thumbnailMouseOver(thumb) {

      if ($("a:contains('Remove')", thumb).length > 0) {
        removeFavorite = () => { $("a:contains('Remove')", thumb)[0].click(); };
        $('#thumbPlusDetailsButtonRemove').addClass('show');
      }
      var title;
      if ($('img', thumb).attr('oldtitle') && $('img', thumb).attr('oldtitle') != '') // oldtitle is used for gelbooru
        title = $('img', thumb).attr('oldtitle');
      else if ($('img', thumb).attr('data-title') && $('img', thumb).attr('data-title') != '') // Danbooru moves title to data-title when the tag tooltip opens.
        title = $('img', thumb).attr('data-title');
      else
        title = $('img', thumb).attr('title');

      tags = title.replace('Rating: ', 'Rating:');
      tags = tags.replace('Score: ', 'Score:');
      tags = tags.replace('User: ', 'User:');
      tags = tags.replace('ID: ', 'ID:');
      tags = tags.replace('Date: ', 'Date:');
      tags = tags.replace('Status: ', 'Status:');
      tags = tags.replace(' -', '-');
      tags = tags.split('\n').join(' ');
      tags = tags.split(tagSplit);
      if (!tagsHaveUnderscores) {
        for (var i = 0; i < tags.length; i++) {
          tags[i] = tags[i].replace(' ', '_');
        }
      }
      if (tags.indexOf('Tags:') >= 0) tags.splice(tags.indexOf('Tags:'), 1);

      if (site == 'e621.net' || site == 'e926.net') {

        tags[2] = tags[2] + ' ' + tags[3];
        tags.splice(3, 1);
      }

      if (debugMode) console.log('tags', tags, 'title', title);
      if ($('img', thumb).attr('rating')) tags.push($('img', thumb).attr('rating'));

      for (let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].toLowerCase().split(',').join('');
      }

      $('#thumbPlusPreview').attr('class', '');

      if (tags.includes("webm")) $('#thumbPlusPreview').addClass('video');
      else if (tags.includes("mp4")) $('#thumbPlusPreview').addClass('video');
      else if (tags.includes("animated_gif")) $('#thumbPlusPreview').addClass('gif');
      else if (tags.includes("flash")) $('#thumbPlusPreview').addClass('flash');
      else if (tags.includes("flash_animation")) $('#thumbPlusPreview').addClass('flash');
      else if (tags.includes("video")) $('#thumbPlusPreview').addClass('video');
      else if (tags.includes("animated") && animationTagIsGif && !tags.includes("sound")) $('#thumbPlusPreview').addClass('gif');
      else if (tags.includes("animated")) $('#thumbPlusPreview').addClass('video');

      if (tags.includes("sound")) $('#thumbPlusPreview').addClass('sound');
      else if (tags.includes("audio")) $('#thumbPlusPreview').addClass('sound');
      else if (tags.includes("has_sound")) $('#thumbPlusPreview').addClass('sound');
      else if (tags.includes("has_audio")) $('#thumbPlusPreview').addClass('sound');
      else if (tags.includes("video_with_sound")) $('#thumbPlusPreview').addClass('sound');

      if (tags.includes("hetero")) $('#thumbPlusPreview').addClass('straight');
      else if (tags.includes("straight")) $('#thumbPlusPreview').addClass('straight');
      else if (tags.includes("male/female")) $('#thumbPlusPreview').addClass('straight');

      if (tags.includes("yaoi")) $('#thumbPlusPreview').addClass('gay');
      else if (tags.includes("gay")) $('#thumbPlusPreview').addClass('gay');
      else if (tags.includes("male/male")) $('#thumbPlusPreview').addClass('gay');

      if (tags.includes("yuri")) $('#thumbPlusPreview').addClass('lesbian');
      else if (tags.includes("lesbian")) $('#thumbPlusPreview').addClass('lesbian');
      else if (tags.includes("female/female")) $('#thumbPlusPreview').addClass('lesbian');

      if (tags.includes("intersex")) $('#thumbPlusPreview').addClass('trans');
      else if (tags.includes("futanari")) $('#thumbPlusPreview').addClass('trans');
      else if (tags.includes("newhalf")) $('#thumbPlusPreview').addClass('trans');
      else if (tags.includes("dickgirl")) $('#thumbPlusPreview').addClass('trans');
      else if (tags.includes("shemale")) $('#thumbPlusPreview').addClass('trans');

      if (tags.includes("trap")) $('#thumbPlusPreview').addClass('trap');
      else if (tags.includes("otoko_no_ko")) $('#thumbPlusPreview').addClass('trap');

      if (tags.includes("3d")) $('#thumbPlusPreview').addClass('threed');

      if (tags.includes("loli")) $('#thumbPlusPreview').addClass('loli');

      if (tags.includes("shota")) $('#thumbPlusPreview').addClass('shota');

      if (tags.includes("guro")) $('#thumbPlusPreview').addClass('gore');
      else if (tags.includes("gore")) $('#thumbPlusPreview').addClass('gore');
      else if (tags.includes("death")) $('#thumbPlusPreview').addClass('gore');
      else if (tags.includes("snuf")) $('#thumbPlusPreview').addClass('gore');

      if (tags.includes("pregnant")) $('#thumbPlusPreview').addClass('pregnant');
      else if (tags.includes("pregnant_futa")) $('#thumbPlusPreview').addClass('pregnant');
      else if (tags.includes("pregnant_loli")) $('#thumbPlusPreview').addClass('pregnant');

      if (tags.includes("bestiality")) $('#thumbPlusPreview').addClass('bestiality');
      else if (tags.includes("zoophilia")) $('#thumbPlusPreview').addClass('bestiality');

      // A lot seem to be tagged with feet when it is not the main focus and many foot fetish posts are only tagged as feet.
      // if (tags.includes("feet")) $('#thumbPlusPreview').addClass('feet');
      // else
      if (tags.includes("ashikoki")) $('#thumbPlusPreview').addClass('feet');
      else if (tags.includes("footjob")) $('#thumbPlusPreview').addClass('feet');
      else if (tags.includes("foot_fetish")) $('#thumbPlusPreview').addClass('feet');
      else if (tags.includes("foot_focus")) $('#thumbPlusPreview').addClass('feet');
      else if (tags.includes("foot_worship")) $('#thumbPlusPreview').addClass('feet');
      else if (tags.includes("pov_feet")) $('#thumbPlusPreview').addClass('feet');


      if (tags.includes("bondage")) $('#thumbPlusPreview').addClass('bondage');
      else if (tags.includes("bdsm")) $('#thumbPlusPreview').addClass('bondage');

      if (tags.includes("scat")) $('#thumbPlusPreview').addClass('poop');
      else if (tags.includes("defecating")) $('#thumbPlusPreview').addClass('poop');
      else if (tags.includes("feces")) $('#thumbPlusPreview').addClass('poop');
      else if (tags.includes("coprophagia")) $('#thumbPlusPreview').addClass('poop');
      else if (tags.includes("soiling")) $('#thumbPlusPreview').addClass('poop');

      if (tags.includes("urine")) $('#thumbPlusPreview').addClass('piss');
      else if (tags.includes("urinating")) $('#thumbPlusPreview').addClass('piss');
      else if (tags.includes("peeing")) $('#thumbPlusPreview').addClass('piss');
      else if (tags.includes("golden_shower")) $('#thumbPlusPreview').addClass('piss');
      else if (tags.includes("watersports")) $('#thumbPlusPreview').addClass('piss');

      if (tags.includes("group_sex")) $('#thumbPlusPreview').addClass('group');
      else if (tags.includes("gangbang")) $('#thumbPlusPreview').addClass('group');
      else if (tags.includes("threesome")) $('#thumbPlusPreview').addClass('group');
      else if (tags.includes("orgy")) $('#thumbPlusPreview').addClass('group');
      else if (tags.includes("foursome")) $('#thumbPlusPreview').addClass('group');

      if (tags.includes("incest")) $('#thumbPlusPreview').addClass('incest');

      if (tags.includes("bukkake")) $('#thumbPlusPreview').addClass('bukkake');

      if (tags.includes("tentacles")) $('#thumbPlusPreview').addClass('tentacles');
      else if (tags.includes("tentacle")) $('#thumbPlusPreview').addClass('tentacles');
      else if (tags.includes("tentacle_sex")) $('#thumbPlusPreview').addClass('tentacles');

      if (tags.includes("rape")) $('#thumbPlusPreview').addClass('rape');

      if (tags.includes("exhibitionism")) $('#thumbPlusPreview').addClass('public');
      else if (tags.includes("public_nudity")) $('#thumbPlusPreview').addClass('public');
      else if (tags.includes("public_sex")) $('#thumbPlusPreview').addClass('public');
      else if (tags.includes("public_masturbation")) $('#thumbPlusPreview').addClass('public');
      else if (tags.includes("public_display")) $('#thumbPlusPreview').addClass('public');
      else if (tags.includes("public") && (tags.includes("sex") || tags.includes("nude"))) $('#thumbPlusPreview').addClass('public');

      if (tags.includes("furry")) $('#thumbPlusPreview').addClass('furry');
      else if (tags.includes("anthro")) $('#thumbPlusPreview').addClass('furry');

      if (tags.includes("bbw")) $('#thumbPlusPreview').addClass('fat');
      else if (tags.includes("ssbbw")) $('#thumbPlusPreview').addClass('fat');
      else if (tags.includes("chubby")) $('#thumbPlusPreview').addClass('fat');
      else if (tags.includes("obese")) $('#thumbPlusPreview').addClass('fat');
      else if (tags.includes("overweight")) $('#thumbPlusPreview').addClass('fat');

      if (tags.includes("hypnosis")) $('#thumbPlusPreview').addClass('hypnosis');
      else if (tags.includes("mind_control")) $('#thumbPlusPreview').addClass('hypnosis');

      if (tags.includes("ntr")) $('#thumbPlusPreview').addClass('ntr');
      else if (tags.includes("netorare")) $('#thumbPlusPreview').addClass('ntr');
      else if (tags.includes("cuckold")) $('#thumbPlusPreview').addClass('ntr');

      if (tags.includes("femdom")) $('#thumbPlusPreview').addClass('femdom');
      else if (tags.includes("dominatrix")) $('#thumbPlusPreview').addClass('femdom');

      if (tags.includes("ai_generated")) $('#thumbPlusPreview').addClass('ai');
      else if (tags.includes("ai-generated")) $('#thumbPlusPreview').addClass('ai');
      else if (tags.includes("ai-assisted")) $('#thumbPlusPreview').addClass('ai');
      else if (tags.includes("ai-created")) $('#thumbPlusPreview').addClass('ai');
      else if (tags.includes("novelai")) $('#thumbPlusPreview').addClass('ai');
      else if (tags.includes("stable_diffusion")) $('#thumbPlusPreview').addClass('ai');

      if (tags.includes("censored")) $('#thumbPlusPreview').addClass('censored');

      if (tags.includes("uncensored")) $('#thumbPlusPreview').addClass('uncensored');

	  if (tags.includes("asian")) $('#thumbPlusPreview').addClass('asian');

      if (tags.includes("rating:safe")) $('#thumbPlusPreview').addClass('safe');
      else if (tags.includes("safe")) $('#thumbPlusPreview').addClass('safe');
      else if (tags.includes("rating:s")) $('#thumbPlusPreview').addClass('safe');
      else if (tags.includes("rating:general")) $('#thumbPlusPreview').addClass('general');
      else if (tags.includes("rating:g")) $('#thumbPlusPreview').addClass('general');
      else if (tags.includes("rating:questionable")) $('#thumbPlusPreview').addClass('questionable');
      else if (tags.includes("questionable")) $('#thumbPlusPreview').addClass('questionable');
      else if (tags.includes("rating:q")) $('#thumbPlusPreview').addClass('questionable');
      else if (tags.includes("rating:explicit")) $('#thumbPlusPreview').addClass('explicit');
      else if (tags.includes("explicit")) $('#thumbPlusPreview').addClass('explicit');
      else if (tags.includes("rating:e")) $('#thumbPlusPreview').addClass('explicit');
      else if (tags.includes("rating:r15+")) $('#thumbPlusPreview').addClass('r15');
      else if (tags.includes("rating:r18+")) $('#thumbPlusPreview').addClass('r18');

      // remove in new method has no bugs
      // if (cumulativeOffset(thumb).left < 50)
      //   $('#thumbPlusPreviewContainer').css({ top: cumulativeOffset(thumb).top, left: 50 });
      // else
      //   $('#thumbPlusPreviewContainer').css({ top: cumulativeOffset(thumb).top, left: cumulativeOffset(thumb).left });

      // get position based on img child tag
      var imgTag;
      if ($(thumb).find('img').length > 0 && $(thumb).find('img')[0].offsetParent !== null)
        imgTag = $(thumb).find('img')[0];
      else imgTag = thumb;

      var rect = {
        top: imgTag.getBoundingClientRect().top + document.documentElement.scrollTop,
        left: imgTag.getBoundingClientRect().left + document.documentElement.scrollLeft,
        bottom: imgTag.getBoundingClientRect().bottom + document.documentElement.scrollTop,
        right: imgTag.getBoundingClientRect().right + document.documentElement.scrollLeft,
        width: imgTag.getBoundingClientRect().right - imgTag.getBoundingClientRect().left,
        height: imgTag.getBoundingClientRect().bottom - imgTag.getBoundingClientRect().top
      };

      $('#thumbPlusPreviewContainer').css({ top: rect.top + (rect.height / 2), left: rect.left < 140 && rect.width <= 280 ? 142 : rect.left + (rect.width / 2) });

      if (rect.width > 280)
        $('#thumbPlusPreview').css({ width: rect.width });
      else
        $('#thumbPlusPreview').css({ width: 280 });

      currentImageThumb = $('img', thumb).attr('src');
      $('#thumbPlusPreviewImage').css({ backgroundImage: 'url(' + currentImageThumb + ')' });
      $('#thumbPlusPreviewImage').attr('title', title);

      var height = $('img', thumb).height() * 1.555;
      if (height < 198) height = 198;
      if (height) $('#thumbPlusPreviewImage').css({ height: height });

      if ($(thumb).attr('href')) {
        $('#thumbPlusPreviewLink').attr('href', $(thumb).attr('href'));
      }
      else
        $('#thumbPlusPreviewLink').attr('href', $('a:not(:contains("Remove"))', thumb).attr('href'));

      $('#thumbPlusPreviewContainer').addClass('show');

    }

    function thumbPlusDetails(e) {
      if (enableEnhancedThumbnailsDetails && !thumbDetailsOpen) {
        var tagsWidth = 150;
        var width = document.body.clientWidth;
        var thumbRight = $('#thumbPlusPreview').offset().left + 300 + tagsWidth;
        if (thumbRight > width)
          $('#thumbPlusDetailsTags').addClass('showLeft');

        setTimeout(() => {
          if ($('#thumbPlusDetailsTags').offset().top < 0) {
            var rect = {
              top: document.getElementById('thumbPlusPreview').getBoundingClientRect().top + document.documentElement.scrollTop,
              left: document.getElementById('thumbPlusPreview').getBoundingClientRect().left + document.documentElement.scrollLeft,
              bottom: document.getElementById('thumbPlusPreview').getBoundingClientRect().bottom + document.documentElement.scrollTop,
              right: document.getElementById('thumbPlusPreview').getBoundingClientRect().right + document.documentElement.scrollLeft,
            };

            $('#thumbPlusDetailsTags').css('transform', 'translate(0, ' + -(rect.top + 92) + 'px)');
          }
          $('#thumbPlusDetailsButtonSameWindow').attr('href', $('#thumbPlusPreviewLink').attr('href'));

        });


        $('#thumbPlusDetailsTags').html(getTagsHtml(tags));
        thumbDetailsOpen = true;
        $('#thumbPlusDetails').addClass('show');
        $('#thumbPlusDetailsBlocker').addClass('show');
        return false;
      }
    }

    $('#thumbPlusPreviewLink').on('contextmenu', thumbPlusDetails);

    $('#thumbPlusDetailsBlocker').click(function () {
      thumbDetailsOpen = false;
      $('#thumbPlusDetails').removeClass('show');
      $('#thumbPlusDetailsBlocker').removeClass('show');
      $('#thumbPlusDetailsTags').removeClass('showLeft');
      $('#thumbPlusDetailsTags').css('transform', 'translate(0, -50%)');
      closeThumb();
    });

    addGlobalStyle(`
        #thumbPlusPreviewContainer {
          background-color: transparent;
          position: absolute;
          top: 0px;
          left: 0px;
          display: none;
          z-index: 10001;
          transform: translate(-50%, -50%);
        }
        #thumbPlusPreviewContainer.show {
          display: block;
        }
        #thumbPlusPreview {
          display: flex !important;
          top: 0;
          left: 0;
          border: 2px solid black;
          border-radius: 5px;
          flex-direction: column !important;
          align-content: center !important;
          justify-content: center !important;
          align-items: center !important;
          flex-grow: 4 !important;
          /*margin-left: -50px;
          margin-top: -50px;*/
          width: 280px;
          min-height: 280px;
          max-height: 380px;
        }
        #thumbPlusPreviewImage {
          width: calc(100% * 1);
          height: calc(100% * 0.833);
          margin-left: auto;
          margin-right: auto;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
        }
        #thumbPlusIcons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 4px;
        }
        .thumbPlusPreviewIcon {
          display: none;
          margin: 2px;
          background-color: #fff5;
          border-radius: 3px;
          padding: 0px;
        }
        .thumbPlusPreviewIcon svg,
        .thumbPlusPreviewIcon img {
          border: none;
          vertical-align: middle;
        }
        .thumbPlusPreviewIcon, .thumbPlusPreviewIcon svg,
        .thumbPlusPreviewIcon, .thumbPlusPreviewIcon img {
          width: ` + iconSize + `px;
          height: ` + iconSize + `px;
        }
        #thumbPlusPreview.gif #thumbPlusPreviewGif.show,
        #thumbPlusPreview.video #thumbPlusPreviewVideo.show,
        #thumbPlusPreview.sound #thumbPlusPreviewSound.show,
        #thumbPlusPreview.flash #thumbPlusPreviewFlash.show,
        #thumbPlusPreview.straight #thumbPlusPreviewStraight.show,
        #thumbPlusPreview.gay #thumbPlusPreviewGay.show,
        #thumbPlusPreview.lesbian #thumbPlusPreviewLesbian.show,
        #thumbPlusPreview.trans #thumbPlusPreviewTrans.show,
        #thumbPlusPreview.trap #thumbPlusPreviewTrap.show,
        #thumbPlusPreview.threed #thumbPlusPreview3D.show,
        #thumbPlusPreview.loli #thumbPlusPreviewLoli.show,
        #thumbPlusPreview.shota #thumbPlusPreviewShota.show,
        #thumbPlusPreview.gore #thumbPlusPreviewGoreDeath.show,
        #thumbPlusPreview.pregnant #thumbPlusPreviewPregnant.show,
        #thumbPlusPreview.bestiality #thumbPlusPreviewBestiality.show,
        #thumbPlusPreview.feet #thumbPlusPreviewFeet.show,
        #thumbPlusPreview.bondage #thumbPlusPreviewBondage.show,
        #thumbPlusPreview.poop #thumbPlusPreviewPoop.show,
        #thumbPlusPreview.piss #thumbPlusPreviewPiss.show,
        #thumbPlusPreview.group #thumbPlusPreviewGroup.show,
        #thumbPlusPreview.incest #thumbPlusPreviewIncest.show,
        #thumbPlusPreview.bukkake #thumbPlusPreviewBukkake.show,
        #thumbPlusPreview.tentacles #thumbPlusPreviewTentacles.show,
        #thumbPlusPreview.rape #thumbPlusPreviewRape.show,
        #thumbPlusPreview.public #thumbPlusPreviewPublic.show,
        #thumbPlusPreview.furry #thumbPlusPreviewFurry.show,
        #thumbPlusPreview.fat #thumbPlusPreviewFat.show,
        #thumbPlusPreview.hypnosis #thumbPlusPreviewHypnosis.show,
        #thumbPlusPreview.ntr #thumbPlusPreviewNtr.show,
        #thumbPlusPreview.femdom #thumbPlusPreviewFemdom.show,
        #thumbPlusPreview.ai #thumbPlusPreviewAI.show,
        #thumbPlusPreview.censored #thumbPlusPreviewCensored.show,
        #thumbPlusPreview.uncensored #thumbPlusPreviewUncensored.show,
        #thumbPlusPreview.safe #thumbPlusPreviewSafe.show,
        #thumbPlusPreview.general #thumbPlusPreviewGeneral.show,
        #thumbPlusPreview.questionable #thumbPlusPreviewQuestionable.show,
        #thumbPlusPreview.explicit #thumbPlusPreviewExplicit.show,
        #thumbPlusPreview.r15 #thumbPlusPreviewR15.show,
        #thumbPlusPreview.r18 #thumbPlusPreviewR18.show,
		#thumbPlusPreview.asian #thumbPlusPreviewAsian.show {
          display: inline-block;
        }
        #thumbPlusDetails {
          display: none;
          background: green;
        }
        #thumbPlusDetails.show {
          display: block;
        }
        #thumbPlusDetailsTags {
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 100%;
          width: 150px;
          margin-left: 10px;
          background-color: white;
          border: 2px solid black;
          border-radius: 5px;
          top: 92px;
          transform: translate(0, -50%);
        }

        #thumbPlusDetailsTags span {
          padding: 2px 6px;
          border-bottom: solid 1px rgba(0, 0, 0, .3);
        }

        #thumbPlusDetailsTags span:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        #thumbPlusDetailsTags.showLeft {
          left: auto;
          right: 100%;
          margin-right: 10px
        }

        #thumbPlusDetailsOptions {
          position: absolute;
          width: 100%;
          display: flex;
          justify-content: space-between;
          left: -1px;
          top: 2px;
        }
        #thumbPlusDetailsOptions, #thumbPlusDetailsOptions > div {
          background: none;
        }
        .thumbPlusDetailsButton {
          background: white;
          border-radius: 4px;
          padding: 4px;
          display: inline-block;
          text-align: center;
          margin: 0px 2px;
          Width: 24px;
          height: 24px;
          cursor: pointer;
        }
        #thumbPlusDetailsButtonRemove {
          display: none;
        }
        #thumbPlusDetailsButtonRemove.show {
          display: block;
        }
        #thumbPlusDetailsBlocker {
          position: fixed;
          width: 100vw;
          height: 100vh;
          left: 0px;
          top: 0px;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 10000;
          display: none;
        }
        #thumbPlusDetailsBlocker.show {
          display: block;
        }
        #thumbPlusPreviewContainer * {
          box-sizing: initial;
        }
	    `);

  }

  function closeZoom() {
    if (debugMode) console.log('Function: closeZoom');

    $("#IBEZoomableImageContainer").remove();
    if (alwaysShowScrollbars)
      $("html").css({ overflowX: 'scroll', overflowY: 'scroll' });
    else
      $("html").css({ overflowX: 'auto', overflowY: 'auto' });
  }

  function openZoom() {
    if (debugMode) console.log('Function: openZoom');

    addZoomable();
    $("html").css({ overflowX: 'hidden', overflowY: 'hidden' });
  }

  function addZoomable() {
    if (debugMode) console.log('Function: addZoomable');

    if ($(containerDOM + ' ' + imageDOM)[0].tagName == "IMG") {
      $('body').append(`
        <div id="IBEZoomableImageContainer" class="show">
          <div id="IBEZoomableImage">
            <div id="IBEZoomableContent">
              <img src="` + $(containerDOM + ' ' + imageDOM).attr('src') + `"/>
            </div>
          </div>
          <div id="IBEZoomableImageClose">` + closeSvg + `</div>
        </div>
      `);
      $("#IBEZoomableImageClose").click(function () { history.back(); });
      $('#IBEZoomableContent img').on('load', function () {
        if (wzoom) setTimeout(function () {
          getWindowProps();
          $('#IBEZoomableContent').css({ width: contentTrueWidth + 'px', height: contentTrueHeight + 'px' });
          wzoom.prepare();
        }, 0);
      });
      addGlobalStyle(`
        #IBEZoomableImageContainer {
          position: fixed;
          margin: 0px;
          width: 100vw;
          height: 100vh;
          left: 0px;
          top: 0px;
          background-color: #0009;
          z-index: 999999;
          display: none;
        }
        #IBEZoomableImageContainer.show {
          display: block;
        }
        #IBEZoomableImage {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color:blue;
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
          background-color: gray;
          overflow: hidden;
        }
        #IBEZoomableContent {
          //width: `+ contentTrueWidth + `px;
          //height: `+ contentTrueHeight + `px;
        }
        #IBEZoomableImageContainer img {
          display: block;
          height: auto;
          margin: auto;
      }
        #IBEZoomableImageClose {
          position: absolute;
          width: 30px;
          height: 30px;
          background-color: #0005;
          color: white;
          cursor: pointer;
          fill: white;
        }
        #IBEZoomableImageClose:hover {
          background-color: black;
        }
        #IBEZoomableImageClose svg {
          margin: 5px;
        }
      `);

      var imageElement = document.getElementById('IBEZoomableContent').querySelector('img');

      if (imageElement.complete) {
        init();
      } else {
        imageElement.onload = init;
      }

      function init() {
        var maxScale = parseInt(maxZoom);
        wzoom = WZoom.create('#IBEZoomableContent', {
          type: 'html',
          width: imageElement.naturalWidth,
          height: imageElement.naturalHeight,
          maxScale: maxScale,
          speed: zoomSpeed,
          dragScrollableOptions: {
            onGrab: function () {
              document.getElementById('IBEZoomableImage').style.cursor = 'grabbing';
            },
            onDrop: function () {
              document.getElementById('IBEZoomableImage').style.cursor = 'grab';
            }
          }
        });

        window.addEventListener('resize', function () {
          wzoom.prepare();
        });

      }

    }
  }

  function initZoomable() {
    if (debugMode) console.log('Function: initZoomable');

    if (enableZoomableImage && $(containerDOM + ' ' + imageDOM).length && !$(containerDOM + ' video').length) {

      window.addEventListener('popstate', function (event) {
        if (event.state && event.state.id && event.state.id == 'default') closeZoom();
        else if (event.state && event.state.id && event.state.id == 'zoom') openZoom();
      });



      $(containerDOM + ' ' + imageDOM).click(function () {
        var currentSrc = $(containerDOM + ' ' + imageDOM).attr('src');
        history.replaceState({ id: "default" }, 'title');
        history.pushState({ id: "zoom" }, '');

        setTimeout(function () {
          if (currentSrc == $(containerDOM + ' ' + imageDOM).attr('src')) openZoom();
          else {
            waitingForZoom = true;
          }
        }, 0);
      });

    }
  }

  function getTagsTypes() {
    if (debugMode) console.log('Function: getTagsTypes');

    // TODO: Ensure that tags dom selection is not selecting tags added by this script.

    if (site == 'rule34.us') {
      processR34USTagTypes();
      return;
    }

    var tagDoms = false;

    var colorTypes = false;

    // Init sites tags object.
    if (typeof tagDB[site] === 'undefined')
      tagDB[site] = {};

    // May move these to configureSites().
    if (site == 'rule34.xxx') {
      tagDoms = $('#tag-sidebar a[href^="index.php?page=post&s=list&tags="]');
      colorTypes = {
        copyright: "rgb(170, 0, 170)",
        character: "rgb(0, 170, 0)",
        artist: "rgb(170, 0, 0)",
        general: "rgb(0, 0, 153)",
        meta: "rgb(255, 136, 0)",
      };
    }
    else if (site == 'chan.sankakucomplex.com' || site == 'idol.sankakucomplex.com') {
      tagDoms = $('#tag-sidebar a[href^="/?tags="]');
      colorTypes = {
        copyright: "rgb(170, 0, 170)",
        character: "rgb(0, 170, 0)",
        artist: "rgb(170, 0, 0)",
        general: "rgb(255, 118, 28)",
        meta: "rgb(92, 0, 255)",
        genre: "rgb(128, 70, 27)",
        medium: "rgb(37, 133, 187)",
        circle: "rgb(255, 45, 205)",
      };

    }
    else if (site == 'gelbooru.com') {
      tagDoms = $('#tag-list a[href^="index.php?page=post&s=list&tags="]');
      colorTypes = {
        copyright: "rgb(170, 0, 170)",
        character: "rgb(0, 170, 0)",
        artist: "rgb(170, 0, 0)",
        general: "rgb(51, 122, 183)",
        meta: "rgb(255, 136, 0)",
      };
    }
    else if (site == 'danbooru.donmai.us') {
      tagDoms = $('#tag-box a[href^="/posts?tags="], #tag-list a[href^="/posts?tags="]');
      colorTypes = {
        copyright: "rgb(168, 0, 170)",
        character: "rgb(0, 171, 44)",
        artist: "rgb(192, 0, 4)",
        general: "rgb(0, 117, 248)",
        meta: "rgb(253, 146, 0)",
      };
      // Add check for tooltip open then get tags from that
      // On Mutation event on #post-tooltips run getDanbooruTooltipTags() function.
    }
    else if (site == 'konachan.com' || site == 'konachan.net' || site == 'yande.re') {
      tagDoms = $('#tag-sidebar a[href^="/post?tags="]');
      colorTypes = {
        copyright: "rgb(221, 0, 221)",
        character: "rgb(0, 170, 0)",
        artist: "rgb(204, 204, 0)",
        general: "rgb(238, 136, 135)",
        series: "rgb(221, 0, 221)",
        circle: "rgb(0, 187, 187)",
        meta: "rgb(255, 32, 32)",
      };
    }
    else if (site == 'e621.net' || site == 'e926.net') {
      tagDoms = $('#tag-list a.search-tag');
      colorTypes = {
        copyright: "rgb(221, 0, 221)",
        character: "rgb(0, 170, 0)",
        artist: "rgb(242, 172, 8)",
        species: "rgb(237, 93, 31)",
        general: "rgb(180, 199, 217)",
        meta: "rgb(255, 255, 255)",
      };
    }

    processTagTypes(tagDoms, colorTypes);

  }

  function processTagTypes(tagDoms, colorTypes) {
    // TODO: Check if color is blank if so disregard it. [for some reason some tags are getting the color black.]
    // Also remove black tags from database to fix damages made by this bug.

    if (typeof tagDoms !== 'undefined' && typeof colorTypes !== 'undefined' && tagDoms !== false && colorTypes !== false) {

      for (let i = 0; i < tagDoms.length; i++) {

        let compStyles = window.getComputedStyle(tagDoms[i]);
        if (typeof colorTypes.general !== 'undefined' && compStyles.getPropertyValue('color') != colorTypes.general)
          tagDB[site][tagDoms[i].text.trim()] = {
            color: compStyles.getPropertyValue('color'),
            // 0 = Copyright, 1 = Character, 2 = Artist, 3 = Circle, 4(sankakucomplex) = medium, 4(e621) = Species, 5 = General, 6 = Series, 7 = Meta, 8 = genre
            type:
              (typeof colorTypes.copyright !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.copyright) ? 0
                : (typeof colorTypes.character !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.character) ? 1
                  : (typeof colorTypes.artist !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.artist) ? 2
                    : (typeof colorTypes.circle !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.circle) ? 3
                      : (typeof colorTypes.species !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.species) ? 4
                        : (typeof colorTypes.series !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.series) ? 6
                          : (typeof colorTypes.meta !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.meta) ? 7
                            : (typeof colorTypes.genre !== 'undefined' && compStyles.getPropertyValue('color') == colorTypes.genre) ? 8
                              : 3
          };
      }
    }
    GM.setValue('tagDB', tagDB);
    if (debugMode) console.log('tagDB', tagDB);
  }

  function processR34USTagTypes() {
    var tagDoms = $('a[href*="index.php?r=posts/index&q="]');
    for (var i = 0; i < tagDoms.length; i++) {

      if (tagDoms[i].parentNode.classList.contains('artist-tag'))
        tagDB[site][tagDoms[i].text.trim()] = {
          color: '#A00',
          type: 1
        };

      if (tagDoms[i].parentNode.classList.contains('character-tag'))
        tagDB[site][tagDoms[i].text.trim()] = {
          color: '#0A0',
          type: 2
        };

      if (tagDoms[i].parentNode.classList.contains('copyright-tag'))
        tagDB[site][tagDoms[i].text.trim()] = {
          color: '#A0A',
          type: 3
        };

      if (tagDoms[i].parentNode.classList.contains('metadata-tag'))
        tagDB[site][tagDoms[i].text.trim()] = {
          color: '#F80',
          type: 4
        };
    }
    GM.setValue('tagDB', tagDB);
    if (debugMode) console.log('tagDB', tagDB);
  }

  async function getDanbooruTooltipTags(tagDoms, colorTypes) {
    tagDB = await GM.getValue('tagDB');
    processTagTypes(tagDoms, colorTypes);
  }

  function addCSSTooltipSupport() {
    if (debugMode) console.log('Function: addCSSTooltipSupport');

    addGlobalStyle(`
      [tooltip] {
        position: relative;
      }

      [tooltip]:after,
      [tooltip-left]:after,
      [tooltip-right]:after {
        position        : absolute;
        color           : #FFF;
        background-color: #232F34BB;
        border-radius   : 0.25rem;
        padding         : .5rem;
        white-space     : nowrap;
        display         : none;
        font-size       : .8rem;
        text-align: center;
        z-index: 999999999;
      }

      [tooltip]:after {
        content  : attr(tooltip);
        right    : initial;
        left     : 50%;
        top      : 100%;
        transform: translate(-50%, .5rem);
      }


      [tooltip-left]:after {
        content  : attr(tooltip-left);
        left     : initial;
        right    : calc(100%);
        top      : 50%;
        transform: translate(-0.5rem, -50%);
      }

      [tooltip-right].right:after {
        content  : attr(tooltip-right);
        left     : calc(100%);
        right    : initial;
        top      : 50%;
        transform: translate(.5rem, -50%);
      }

      [tooltip]:hover:after,
      [tooltip-left]:hover:after,
      [tooltip-right]:hover:after {
        display : block;
        position: absolute;
      }
      [tooltip].tooltip-140:after {
        white-space: pre-wrap;
        width: 140px;
        white-space: normal;
      }
    `);
  }

  function addGlobalStyle(css) {
    if (debugMode) console.log('Function: addGlobalStyle');

    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    //style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  // For the future.
  // function httpGet(theUrl, callback) {
  //   xmlhttp = new XMLHttpRequest();
  //   xmlhttp.onreadystatechange = function () {
  //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //       callback(xmlhttp.responseText);
  //     }
  //     else
  //       callback(false);
  //   }
  //   xmlhttp.open("GET", theUrl, false);
  //   xmlhttp.send();
  // }

  // Super special code to block fludi player on rule34hentai.net, it's been giving me such a headache plus it also has to run before everthing else or it don't work.
  // This is a quick fix, i should try to make it better but at the moment i'm just glad its working and hope it continues to work.
  if (removeFluid && site == 'rule34hentai.net') $('#video-id').attr("id", "new-video-id-to-block-fluid");
  $('#new-video-id-to-block-fluid').attr('controls', true);

  configureSites();
  addWindowEvents();
  createToolbar();
  initZoomable();
  keyboardShortcuts();
  getTagsTypes();
  enhanceContent();

  addEnhancedThumbnails();
  addCSSTooltipSupport();

  if (debugMode) console.log('End of script.');
})();

// -Known bugs-
// When clicking back enhanced thumbnails breaks.
// Rule34.us does not work
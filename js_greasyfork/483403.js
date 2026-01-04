// ==UserScript==
// @name         Flickr HI-RES Pics v.11
// @description  Higher resolution shots (by NotYou and DuckDuckGo IA) - Fix For BLURRY shots
// @version      11.0
// @author       decembre
// @namespace    https://greasyfork.org/fr/users/8-decembre
// @icon         https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico

// @match      https://www.flickr.com/groups_pool.gne*
// @match      https://www.flickr.com/groups/*
// @match      https://www.flickr.com/notifications
// @match      https://www.flickr.com/search/*
// @match      https://www.flickr.com/photosof/*
// @match      https://www.flickr.com/photos/*/archives/*
// @match      https://www.flickr.com/*


// @include      https://www.flickr.com/groups_pool.gne*
// @include      https://www.flickr.com/groups/*
// @include      https://www.flickr.com/notifications
// @include      https://www.flickr.com/search/*
// @include      https://www.flickr.com/photosof/*
// @include      https://www.flickr.com/photos/*/archives/*
// @include      https://www.flickr.com/*

// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483403/Flickr%20HI-RES%20Pics%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/483403/Flickr%20HI-RES%20Pics%20v11.meta.js
// ==/UserScript==

(function() {
  var $ = window.jQuery;

  // FLICKR 1 - POOL SMALL (SCR)
  // #pool-photos.sm .thumb img:not(.video-play-icon)[src$="_t.jpg"]
  (function() {
    document.querySelectorAll('#pool-photos.sm .thumb img:not(.video-play-icon)[src$="_t.jpg"]').forEach(elem => {
      if(elem.tagName.toLowerCase() === 'source') {
        const newSrcset = elem.srcset.replace(/\_t\.jpg$/, getNewSource);

        elem.srcset = newSrcset;
      } else {
        const newSource = elem.src.replace(/\_t\.jpg$/, getNewSource);

        elem.src = newSource;
      }

      function getNewSource(m) {
        const indexOfDot = m.indexOf('.')
        const fileExtenstion = m.slice(indexOfDot)
        const fileName = m.slice(0, indexOfDot)

        return fileName.replace('t', 'w') + fileExtenstion
      }

    });

  })();

 // FLICKR 2A - Pool Classic View - JUSTIFIED VIEW (for large blurry image) T to Z -
(function() {
  console.log('Starting justified view image modification...');
  try {
    const modifiedElements = new Set();
    let timeoutId = null;
    const observer = new MutationObserver((mutations) => {
      const elements = document.querySelectorAll('.ju.photo-display-container .pool-photo.photo-display-item .photo_container.pc_t img[src$="_t.jpg"]');
      elements.forEach((elem) => {
        if (!modifiedElements.has(elem)) {
          console.log('Modifying element:', elem);
          const newSource = elem.src.replace(/\_t\.jpg$/, '_z.jpg');
          elem.src = newSource;
          elem.classList.add('HDW');
          console.log('Modified image source:', newSource);
          modifiedElements.add(elem);
        }
      });
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        observer.disconnect();
        console.log('No new modifications arrived. Stopping observer.');
      }, 5000);
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  } catch (error) {
    console.error('Error modifying justified view images:', error);
  }
})();

// FLICKR 3 - NOTIFICATIONS PAGES VIEW (BACK IMG)
    //style="background-image: url(//live.staticflickr.com/65535/49726613923_022f7fb3c2_t.jpg);"
    // style="background-image: url(//live.staticflickr.com/65535/49726613923_022f7fb3c2_b.jpg);"
(function() {
  console.log('Code exécuté');
  var observer = new MutationObserver(function(mutations) {
    var elements = document.querySelectorAll('html.fluid.html-notification-center-page-view .notification-center-page-view .notification-item .thumb-container a.notification-photo-thumb');
    if (elements.length > 0) {
      console.log('Éléments trouvés !');
      elements.forEach(function(elem) {
        var style = elem.style.backgroundImage;
        if (style && style.indexOf('_t.jpg') !== -1) {
          console.log('Background trouvé : ' + style);
          var newStyle = style.replace('_t.jpg', '_b.jpg');
          elem.style.backgroundImage = newStyle;
          console.log('Background modifié : ' + newStyle);
          elem.classList.add('HD');
        } else {
          console.log('Pas de background trouvé pour l\'élément : ' + elem);
        }
      });
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();

// COR 2025.10 - FLICKR 4 - SEARCH PAGES (BACK IMG)
    // .fluid.html-search-photos-unified-page-view main#search-unified-content.main.fluid-centered
(function() {
  console.log('Code exécuté');
  var observer = new MutationObserver(function(mutations) {
    var elements = document.querySelectorAll('.fluid.html-search-photos-unified-page-view main#search-unified-content.main.fluid-centered .search-container-w-sidebar .main.search-photos-results .search-photos-everyone-view .photo-list-view .photo-list-tile-view.forced-aspect-ratio .photo');
    if (elements.length > 0) {
      console.log('Éléments trouvés !');
      elements.forEach(function(elem) {
        var style = elem.style.backgroundImage;
        if (style && style.indexOf('_m.jpg') !== -1) {
          console.log('Background trouvé : ' + style);
          var newStyle = style.replace('_m.jpg', '_c.jpg');
          elem.style.backgroundImage = newStyle;
          console.log('Background modifié : ' + newStyle);
          elem.classList.add('HD');
        } else if (style && style.indexOf('_c.jpg') === -1) {
          console.log('Pas de background trouvé pour l\'élément : ' + elem);
          // Essayez de modifier l'élément à nouveau après un certain délai
          setTimeout(function() {
            var newStyle = elem.style.backgroundImage.replace('_m.jpg', '_c.jpg');
            elem.style.backgroundImage = newStyle;
            console.log('Background modifié : ' + newStyle);
            elem.classList.add('HD');
          }, 1000);
        }
      });
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();


// FLICKR 5 - Photo OF (SRC) (BACK IMG)
    // .HoldPhotos p.RecentPhotos .photo_container a img:not(.video-play-icon)[src$="_t.jpg"]
    //  src="https://live.staticflickr.com/4086/35707812856_5b19db2991_t.jpg"
(function() {
    document.querySelectorAll('.HoldPhotos p.RecentPhotos .photo_container a img:not(.video-play-icon)[src$="_t.jpg"]').forEach(elem => {
      if(elem.tagName.toLowerCase() === 'source') {
        const newSrcset = elem.srcset.replace(/\_t\.jpg$/, getNewSource);

        elem.srcset = newSrcset;
      } else {
        const newSource = elem.src.replace(/\_t\.jpg$/, getNewSource);

        elem.src = newSource;
          elem.classList.add('HD');
      }

      function getNewSource(m) {
        const indexOfDot = m.indexOf('.')
        const fileExtenstion = m.slice(indexOfDot)
        const fileName = m.slice(0, indexOfDot)

        return fileName.replace('t', 'w') + fileExtenstion
      }

    });

  })();

// FLICKR 6 - POOL Clasique - Defered Images
(function() {
  function updateDeferredImages() {
    document.querySelectorAll('.super-liquid #pool-photos.photo-display-container.ju .pc_img.defer.img').forEach(elem => {
      if (elem.src === "https://combo.staticflickr.com/pw/images/spaceout.gif" && elem.dataset.deferSrc) {
        elem.src = elem.dataset.deferSrc;
      }
    });
  }

  updateDeferredImages();

  // Relancer la fonction après 500ms
  setInterval(updateDeferredImages, 500);
})();

// FLICKR 7 - GROUP POOL SMALL (SCR) -after ckick direct - (Not in Tampermonkey?)
// .fluid.html-group-pool-page-view .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view.awake .photo-list-photo-container img:not(.video-play-icon)
  (function() {
    document.querySelectorAll('.fluid.html-group-pool-page-view .group-pool-subheader-view + .photo-list-view .photo-list-photo-view.awake .photo-list-photo-container img:not(.video-play-icon)[src$="_t.jpg"]').forEach(elem => {
      if(elem.tagName.toLowerCase() === 'source') {
        const newSrcset = elem.srcset.replace(/\_t\.jpg$/, getNewSource);

        elem.srcset = newSrcset;
      } else {
        const newSource = elem.src.replace(/\_t\.jpg$/, getNewSource);

        elem.src = newSource;
      }

      function getNewSource(m) {
        const indexOfDot = m.indexOf('.')
        const fileExtenstion = m.slice(indexOfDot)
        const fileName = m.slice(0, indexOfDot)

        return fileName.replace('t', 'w') + fileExtenstion
      }

    });

  })();

// FLICKR 8 - ARCHIVES SMALL (SCR)
  // #archives.sm .archive .thumb span.photo_container a.rapidnofollow:not(.spaceball) img:not(.video-play-icon):not(.video-play-icon)[src$="_t.jpg"]
  (function() {
    document.querySelectorAll('#archives.sm .archive .thumb span.photo_container a.rapidnofollow:not(.spaceball) img:not(.video-play-icon):not(.video-play-icon)[src$="_t.jpg"]').forEach(elem => {
      if(elem.tagName.toLowerCase() === 'source') {
        const newSrcset = elem.srcset.replace(/\_t\.jpg$/, getNewSource);

        elem.srcset = newSrcset;
      } else {
        const newSource = elem.src.replace(/\_t\.jpg$/, getNewSource);

        elem.src = newSource;
      }

      function getNewSource(m) {
        const indexOfDot = m.indexOf('.')
        const fileExtenstion = m.slice(indexOfDot)
        const fileName = m.slice(0, indexOfDot)

        return fileName.replace('t', 'w') + fileExtenstion
      }

    });

  })();


// FLICKR 9 - POOL BETA - GROUP POOL (support GM "Go To User pool")
  (function() {
  // Function to modify the images
  function modifyImages() {
    console.log('Modifying images...');

    // Select the images to modify
    const images = document.querySelectorAll('.fluid.html-group-pool-page-view .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view .photo-list-photo-container img:not(.video-play-icon)[src$="_t.jpg"]');
    console.log(`Found ${images.length} images to modify`);

    if (images.length === 0) {
      console.log('No images found, trying again...');
      return;
    }

    images.forEach((elem, index) => {
      console.log(`Modifying image ${index + 1} of ${images.length}`);

      if (elem.tagName.toLowerCase() === 'source') {
        const originalSrcset = elem.srcset;
        const newSrcset = elem.srcset.replace(/\_t\.jpg$/, getNewSource);
        elem.srcset = newSrcset;
        console.log(`Updated srcset from ${originalSrcset} to ${newSrcset}`);
      } else {
        const originalSrc = elem.src;
        const newSource = elem.src.replace(/\_t\.jpg$/, getNewSource);
        elem.src = newSource;
        console.log(`Updated src from ${originalSrc} to ${newSource}`);
      }

      function getNewSource(m) {
        const indexOfDot = m.indexOf('.');
        const fileExtension = m.slice(indexOfDot);
        const fileName = m.slice(0, indexOfDot);

        return fileName.replace('t', 'w') + fileExtension;
      }
    });

    console.log('Finished modifying images');
  }

  // Function to rerun the script a few times
  function rerunScript() {
    const maxAttempts = 10;
    let attempts = 0;

    function runScript() {
      modifyImages();
      attempts++;

      if (attempts < maxAttempts) {
        setTimeout(runScript, 500); // Wait 0.5 seconds before rerunning the script
      } else {
        console.log('Max attempts reached, stopping script');
      }
    }

    runScript();
  }

  // Wait for the DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, waiting 2 seconds before starting script...');
    setTimeout(function() {
      console.log('Starting script...');
      rerunScript();
    }, 2000);
  });

  // Also try to modify images on every DOM change
  const observer = new MutationObserver(function() {
    modifyImages();
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });

  // Try to modify images on every hash change
  window.addEventListener('hashchange', function() {
    modifyImages();
  });
})();


 GM_addStyle(`
/* FLICKR- TEST - For GM "GO TO POLL " */

html.fluid.html-photo-page-scrappy-view.scrolling-layout .sub-photo-groups-view .sub-photo-context.sub-photo-context-groups ul li:has(ul.utags_ul.utags_ul_0:not(.utags_ul_1)) > span.title > a::after {
  content: "🏷️" ;
  font-size: 8px ;
  opacity: 0.8 ;
}

html.fluid.html-photo-page-scrappy-view.scrolling-layout .sub-photo-groups-view .sub-photo-context.sub-photo-context-groups ul li > span.title a + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) a {
  height: 16px ;
  line-height: 15px ;
  margin: 2px 0px 0px ;
  border-radius: 0px ;
  border-top: unset ;
  border-right: unset ;
  border-bottom: unset ;
  border-image: unset ;
  border-left: 1px solid red ;
}
html.fluid.html-photo-page-scrappy-view.scrolling-layout .sub-photo-groups-view .sub-photo-context.sub-photo-context-groups ul li > span.title a + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) {
  position: absolute !important;
  display: inline-flex ;
  flex-flow: wrap ;
  place-content: flex-end ;
  height: 20px ;
  line-height: normal ;
  width: auto ;
  min-width: 20px ;
  max-width: 75% ;
  margin: 0vh 2px 0px 0px ;
  top: unset !important;
  bottom: 0px !important;
  left: unset !important;
  right: 0px !important;
  opacity: 1 !important;
  border-radius: 5px ;
  box-shadow: none ;
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid red ;
}

html.fluid.html-photo-page-scrappy-view.scrolling-layout .sub-photo-groups-view .sub-photo-context.sub-photo-context-groups ul li > span.title a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) {
  position: absolute !important;
  display: inline-block !important;
  height: 100% ;
  min-height: 15px ;
  max-height: 15px ;
  line-height: normal ;
  width: 100% ;
  min-width: 15px ;
  max-width: 15px ;
  margin: 0vh -23px 0px 0px !important;
  top: unset !important;
  bottom: 0.51vh !important;
  left: unset !important;
  right: 0px ;
  opacity: 1 ;
  visibility: visible !important;
  border-radius: 100% ;
  z-index: 5000000 !important;
  transition: none !important;
  box-shadow: none ;
  background-color: rgba(0, 0, 0, 0);
}
html.fluid.html-photo-page-scrappy-view.scrolling-layout .sub-photo-groups-view .sub-photo-context.sub-photo-context-groups ul li > span.title a + ul.utags_ul.utags_ul_0:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) li {
  display: inline-block !important;
  height: 100% !important;
  min-height: 15px !important;
  max-height: 15px !important;
  line-height: normal !important;
  width: 100% !important;
  min-width: 15px !important;
  max-width: 15px !important;
  margin: 0px 0px 0px -25px !important;
  border-radius: 100% !important;
  content: unset !important;
  opacity: 0.3 !important;
  border: 1px solid red ;
  background-color: gold ;
}
/* PHOTO PAGE - FOR UTAGS + "GO TO POOL */
html.fluid.html-photo-page-scrappy-view.scrolling-layout .sub-photo-contexts-view .sub-photo-context .context-list li .GoToPool + ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity),

html.fluid.html-photo-page-scrappy-view.scrolling-layout .sub-photo-contexts-view .sub-photo-context .context-list li .title ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity),

html.fluid.html-photo-page-scrappy-view.scrolling-layout .droparound .body .content.menu ul:not(#utags_should_has_higher_specificity):not(#utags_should_has_higher_specificity) .utags_ul {
  display: none !important;
  transition: none !important;
}
/* POOL - GROUP POOL  */

/* POOL FOR UTGAS   */
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view):has(.utags_ul) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view .photo-list-photo-view.awake ,
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view):has(.utags_ul) #content .group-pool-page-view .photo-list-view .photo-list-photo-view.awake {
  float: left ;
  height: 100% ;
  min-height: 262px !important;
  max-height: 262px !important;
  z-index: inherit;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view):has(.utags_ul) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view .overlay {
    position: absolute !important;
    width: 100% !important;
    left: -2px !important;
    margin: 0 0 0 0 !important;
  opacity: 1 !important;
  outline: gray solid 1px !important;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view):has(.utags_ul)  #content .group-pool-page-view .photo-list-view .photo-list-photo-view .photo-list-photo-container {
  height: 100% !important;
  min-height: 225px !important;
  max-height: 225px !important;
  width: 100% !important;
  padding:0px 0px 0vh !important;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view):has(.utags_ul)  #content .group-pool-page-view .photo-list-view .photo-list-photo-view {
  float: left !important;
  height: 100% !important;
  min-height: 252px !important;
  max-height: 252px !important;
  z-index: inherit;
  border: 1px solid gray !important;
}

/* UTAGS */
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view):has(.utags_ul) #content .group-pool-page-view .photo-list-view .photo-list-photo-view a.attribution + ul.utags_ul.utags_ul_1:not(#utags_should_has_higher_specificity) {
  position: absolute !important;
  display: inline-block !important;
  width: 100% !important;
  height: 2vh !important;
  margin: 0vh 0px 0px !important;
  top: unset !important;
  bottom: -2.5vh !important;
  transition: none !important;
  z-index: inherit;
}

/* NORMAL */
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) {
  display: inline-block;
  width: 100%;
  height: auto ;
  padding: 0px 0 0vh 0px;
  margin: 0 0 0vh 0 ;
  overflow: hidden auto;
}
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view)  .photo-list-view {
  display: inline-block;
  width: 96%;
  height: auto ;
  padding: 8px 0 0vh 70px;
  margin: 0 0 15vh 0 ;
}

/* THUMBNAILS - TRANSFORM NONE */
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view, .fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view.awake {
  position: relative ;
  display: inline-block ;
  height: 100% ;
  min-height: 190px ;
  max-height: 190px ;
  width: 100% ;
  min-width: 153px ;
  max-width: 153px ;
  margin-left: 6px ;
  margin-right: 5px ;
  margin-bottom: 8px ;
  padding:5px ;
  background-position: center center ;
  background-repeat: no-repeat;
  transform: none !important;
}
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view .photo-list-photo-container,
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view.awake .photo-list-photo-container {
  height: 100% ;
  min-height: 190px ;
  max-height: 190px ;
  width: 100% ;
  min-width: 161px ;
  max-width: 161px ;
  margin-left: -1px  ;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view .photo-list-photo-container img,
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view.awake .photo-list-photo-container img {
  height: 100% ;
  min-height: 190px ;
  max-height: 190px ;
  width: 100% ;
  min-width: 153px ;
  max-width: 153px ;
  object-fit: contain ;
}

/* FOR "HD" GM */
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requredToShowOnServer) .photo-list-photo-view .photo-list-photo-container:has(img:not(.video-play-icon)[src$="_w.jpg"]) .interaction-view::before {
  content: "HD" ;
  position: absolute ;
  display: inline-block;
  width: 15px ;
  height: 8px ;
  line-height: 10px ;
  bottom: 0.5vh ;
  left: 0px ;
  padding: 0px ;
  font-size: 8px ;
  opacity: 0.4 ;
  color: gold ;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view .interaction-view {
  left: 0px ;
  right: 0px ;
  top: 0px ;
  opacity: 1 ;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view)  #content .photo-list-view .photo-list-photo-view .photo-list-photo-interaction {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 1 ;
}
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view .photo-list-photo-interaction, .fluid.html-group-pool-page-view .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view.awake .photo-list-photo-interaction {
  height: 198px;
  width: 153px ;
  right: 1px ;
  left: 0px ;
}


.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .photo-list-photo-interaction a.overlay::after {
  position: absolute ;
  height: 12px ;
  line-height: 10px ;
  left: 5px ;
  top: 5px ;
  font-size: 10px ;
  transform: scale(1) ;
  outline:none !important;
}
/* (new321) POOL BETA - POOL GROUP - .photo-list-photo-interaction a.overlay  */
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) #content .group-pool-page-view .photo-list-view .photo-list-photo-view .photo-list-photo-container .photo-list-photo-interaction a.overlay {
    margin: 0 0 0 0px !important;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view .overlay {
    position: absolute !important;
    width: 99%;
    left: 0px !important;
  opacity: 1 !important;
  outline: gray solid 1px !important;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view.awake .photo-list-photo-interaction .interaction-bar {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  box-sizing: border-box;
  width: 100% ;
  min-width: 100% ;
  bottom: 0px;
  left: 0px;
  padding: 0px 8px 8px;
  z-index: 2;
}
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .photo-list-photo-view .interaction-view .interaction-bar {
  opacity: 0.5 ;
}
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view)  .photo-list-photo-view .interaction-view:hover .interaction-bar {
  overflow: hidden ;
  opacity: 1 ;
  transition: opacity 0.7s ;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .group-pool-subheader-view:not(.requiredToShowOnServer) + .photo-list-view:not(.requiredToShowOnServer) .photo-list-photo-view.awake .photo-list-photo-interaction .interaction-bar .text {
  display: inline-block ;
  width: 100% ;
  min-width: 100% ;
  min-height: 0px;
  margin-bottom: -12px;
  margin-right: 12px;
}
.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) .photo-list-photo-interaction .interaction-bar .text {
  display: inline-block ;
  height: auto ;
  width: 100% ;
  min-width: 100% ;
  max-width: 100% ;
  margin: 0px 0px -12px ;
  overflow: hidden ;
}

.fluid.html-group-pool-page-view:not(.html-photostream-edit-page-view) #content .photo-list-view .photo-list-photo-view .photo-list-photo-interaction .interaction-bar .text a.title {
  height: auto ;
  max-width: 95% ;
  line-height: 8px;
  margin-top: 15px;
  font-size: 8px;
  opacity: 0 ;
  transition: 0.7s;
  color: gray;
}
.fluid.html-group-pool-page-view :not(.html-photostream-edit-page-view).photo-list-photo-interaction .interaction-bar .text .title:not(.empty) {
  text-align: center ;
  color: gold ;
}
.fluid.html-group-pool-page-view :not(.html-photostream-edit-page-view) .photo-list-photo-interaction .interaction-bar .text .title:not(.empty) {
  display: inline-block ;
  width: 100% ;
  min-width: 100% ;
  max-width: 100% ;
  line-height: 10px ;
  margin: 2px 0px 0px;
  overflow: hidden ;
  text-overflow: ellipsis;
  white-space: nowrap ;
  z-index: 2;
  text-shadow: none ;
  color: white ;
}
.fluid.html-group-pool-page-view :not(.html-photostream-edit-page-view) #content .photo-list-view .photo-list-photo-view .photo-list-photo-interaction:hover .interaction-bar .text a.title {
  max-height: 5vh ;
  line-height: 15px ;
  font-size: 13px;
  text-align: center ;
  opacity: 1 ;
  overflow-y: auto ;
  white-space: pre-wrap ;
  word-break: normal ;
  transition: 0.7s;
  color: gold ;
}

.fluid.html-group-pool-page-view :not(.html-photostream-edit-page-view) .photo-list-photo-interaction .interaction-bar .text .attribution {
  display: inline-flex ;
  justify-content: center ;
  max-width: 100% ;
  height: 15px ;
  line-height: 15px ;
  margin: 2px 0px 18px 0;
  text-align: center ;
  z-index: 2;
  overflow: hidden;
  text-shadow: none ;
  color: peru ;
}
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .text .attribution,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement {
  pointer-events: auto ;
}
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement {
  position: absolute ;
  display: inline-block ;
  width: 100% ;
  min-width: 100% ;
  height: 15px ;
  line-height: 10px ;
  left: 0px ;
  bottom: 0px ;
  font-size: 14px;
  text-align: center ;
}
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement .engagement-item,
.fluid.html-group-pool-page-view .engagement-item.fave.last,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement .engagement-item .engagement-count.empty,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement .engagement-item .engagement-count.hidden,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement .engagement-item.hidden {
  display: inline-flex ;
  height: 15px ;
  line-height: 15px ;
}
/* FAVS */
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement .engagement-item.fave .engagement-icon i.animated-fave-star ,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement .engagement-item.fave.faved .engagement-icon i.animated-fave-star {
  visibility: hidden ;
}
.fluid.html-group-pool-page-view .photo-list-tile-view .metadata .bottom-icons .engagement .engagement-item.fave:not(.faved) .engagement-icon i.animated-fave-star::before,
.fluid.html-group-pool-page-view .photo-card-engagement-view .photo-card-engagement .engagement-item .engagement-icon i.animated-fave-star::before,
.fluid.html-group-pool-page-view .photo-list-gallery-photo-view .engagement-item.fave .engagement-icon i.animated-fave-star::before,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .engagement-item.fave .engagement-icon i.animated-fave-star::before {
  content: "★";
  display: inline-block;
  visibility: visible ;
  top: -2px ;
  margin-top: -2px ;
  font-style: normal ;
  color: white ;
}
.fluid.html-group-pool-page-view .photo-card-engagement-view .photo-card-engagement .engagement-item .engagement-icon i.animated-fave-star::before,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .engagement-item.fave .engagement-icon i.animated-fave-star::before,
.fluid.html-group-pool-page-view .photo-list-gallery-photo-view .engagement-item.fave .engagement-icon i.animated-fave-star::before {
  display: inline-block;
  visibility: visible ;
  height: 24px ;
  line-height: 20px ;
  width: 24px;
  margin-left: -4px;
  margin-top: -2px;
  font-size: 18px ;
  font-style: normal ;
  text-align: center ;
}

.fluid.html-group-pool-page-view .photo-list-tile-view .metadata .bottom-icons .engagement .engagement-item.fave.faved .engagement-icon i.animated-fave-star::before,
.fluid.html-group-pool-page-view .photo-list-photo-interaction .interaction-bar .engagement .engagement-item.faved .animated-fave-star::before,
.fluid.html-group-pool-page-view .engagement-item.fave.faved.last .engagement-icon i.animated-fave-star::before, .fluid.html-group-pool-page-view .view.photo-engagement-view .view.fave-view .fave-star.is-faved::before,
.fluid.html-group-pool-page-view .view.photo-engagement-view .view.fave-view .fave-star.false.is-faved::before, a.fave-star.false.is-faved::before {
  content: "★";
  display: inline-block;
  visibility: visible ;
  height: 30px ;
  width: 30px ;
  margin-top: -2px ;
  margin-left: -4px;
  font-size: 20px ;
  font-style: normal ;
  color: red ;
}

/* TOP PAGI */
#topPaginationContainer {
  position: absolute;
  display: block;
  width: 250px;
  height: 40px;
  margin: 0 auto;
  top: 0;
  left: 0;
  right: 0;
}
.group-pool-subheader-view #topPagination {
  display: block;
  top: -7px;
}
/* BOTTOM PAGI */
.fluid.html-group-pool-page-view .photo-list-view + .pagination-view  {
  position: fixed ;
  display: inline-block ;
  width: 100% ;
  min-width: 80% ;
  max-width: 80% ;
  min-height: 20px;
  margin: 20px auto;
  bottom: -2.2vh;
  text-align: center;
  z-index: 500000 ;
}


/* FOOTER */
.fluid.html-group-pool-page-view .footer-full-view:before  {
  content: "ABOUT" !important;
  position: fixed ;
  display: inline-block ;
  width: 3% ;
  margin: 0vh 0px 0px ;
  top: unset ;
  bottom: 0vh ;
  text-align: center ;
  border-radius: 5px 5px  0 0 ;
  transition: none ;
  z-index: inherit;
border: 1px solid silver ;
}
.fluid.html-group-pool-page-view .footer-full-view  {
  position: fixed ;
  display: inline-block ;
  width: 100% ;
  margin: 0vh 0px 0px ;
  top: unset ;
  bottom: -13.2vh ;
  transition: ease bottom 0.7s ;
  z-index: inherit;
}
.fluid.html-group-pool-page-view .footer-full-view:hover  {
  position: fixed ;
  display: inline-block ;
  width: 99.9% ;
  margin: 0vh 0px 0px ;
  top: unset ;
  bottom: 0vh ;
  transition: ease bottom 0.7s ;
  z-index: 500000 ;
background: #111 ;
border: 1px solid gold ;
}
.fluid.html-group-pool-page-view .footer-full-view:hover footer  {
    background: #111 ;
}

     `);
})();


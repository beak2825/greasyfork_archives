// ==UserScript==
// @name         [Global] Image Zoomer
// @description	 Allows zooming into images without changing pages. Hold Ctrl+Shift (Cmd+Shift on MAC) when clicking on an image to load it with the extension.
// @author       MetalTxus
// @version      1.3.9

// @include      *
// @exclude      *youtube.com/embed*

// @icon         https://dl.dropbox.com/s/4mnevtuyvt1eden/48.png
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @require      https://greasyfork.org/scripts/396703-key-navigation/code/Key%20navigation.js
// @namespace    https://greasyfork.org/users/8682
// @downloadURL https://update.greasyfork.org/scripts/39371/%5BGlobal%5D%20Image%20Zoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/39371/%5BGlobal%5D%20Image%20Zoomer.meta.js
// ==/UserScript==

const ENABLED_FOR_LINKS = true;
const preloader = 'https://dl.dropbox.com/s/xbxkvw77dfsrum4/preloader.svg';
const extensions = ['.jpg', '.jpeg', '.png', '.gif'];

const jQuery = window.jQuery;
const setUpKeyNavigation = window.setUpKeyNavigation;

const gizContainer = jQuery(`<div id="giz-container">`);
const gizAnchor = jQuery(`<a target="_blank" id="giz-link">`);
const gizImage = jQuery(`<img class="centered" id="giz-image">`);
const gizPreloader = jQuery(`<img class="centered" id="giz-preloader" src="${preloader}">`);
const gizClose = jQuery(`<span id="giz-close">`);

const initialize = () => {
  jQuery(`<style>
       #giz-container              { position: fixed; top: 0; left: 0; height: 100%; width: 100%; background-color: rgba(0, 0, 0, .9); z-index: 10000; display: none; }
       #giz-container .centered    { position: fixed; left: 50%; top: 50%; }
       #giz-preloader              { margin-left: -32px; margin-top: -33px; z-index: 10001; filter: drop-shadow(0 0 2px rgba(255, 255, 255, 1)); }
       #giz-image                  { max-height: 100%; max-width: 100%; cursor: url(https://dl.dropbox.com/s/32kv0rup3zw5lho/zoom-in.cur), zoom-in; }
       #giz-close                  { width: 32px; height: 32px; right: 0; margin: 4px; position: absolute; display: block; cursor: pointer; background: url(https://dl.dropbox.com/s/7smpm0ohq2ymfey/close.svg); }
     </style>`).appendTo('head');

  gizContainer.click(hideContainer);
  gizClose.click(hideContainer);

  gizAnchor.append(gizImage);
  gizContainer.append(gizAnchor);
  gizContainer.append(gizPreloader);
  gizContainer.append(gizClose);

  jQuery('body').append(gizContainer);

  gizImage
    .on('load', event => {
      const newUrl = event.target.src;
      gizAnchor.attr('href', newUrl);
      showImage();
    })
    .on('error', () => {
      const url = gizImage.attr('src');

      for (var i = 0; i < extensions.length; i++) {
        if (url.includes(extensions[i])) {
          const newUrl = url.replace(extensions[i], extensions[i + 1]);
          gizImage.attr('src', newUrl);
          break;
        }
      }
    });

  jQuery(document).click(event => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      event.target.nodeName.toLowerCase() === 'img' &&
      (ENABLED_FOR_LINKS || event.parentElement.target.nodeName !== 'A')
    ) {
      event.preventDefault();
      loadPreview(event.target);
    }
  });

  jQuery(window).resize(() => {
    if (gizContainer.is(':visible')) {
      relocateImage();
    }
  });

  setUpKeyNavigation({
    onLeftPressed: e => isContainerVisible() && loadSiblingImage(-1) && e.preventDefault(),
    onRightPressed: e => isContainerVisible() && loadSiblingImage(1) && e.preventDefault(),
    onDownPressed: e => isContainerVisible() && hideContainer() && e.preventDefault(),
    onUpPressed: e => isContainerVisible() && e.preventDefault(),
  });

  console.info('Script "Global Image Zoomer" ready for its use');
};

const loadPreview = element => {
  let newURL = element.src;

  if (newURL !== undefined && element.nodeName === 'IMG') {
    newURL = parseURL(newURL);

    if (removeExtension(newURL) !== removeExtension(gizImage.attr('src')) && newURL !== preloader) {
      loadImageUrl(newURL);
    }

    showContainer();
  }
};

const loadImageUrl = newURL => {
  showPreloader();

  gizImage.attr('src', newURL);
  gizAnchor.attr('href', newURL);
};

const loadSiblingImage = increment => {
  if (!isContainerVisible()) return;

  const imagesUrls = [
      ...new Set(
          jQuery('img')
              .map((i, img) => img.src)
              .toArray()
      )
  ];
  const currentImageUrl = gizImage.attr('src');
  const currentIndex = imagesUrls.indexOf(currentImageUrl);
  const requestedIndex = currentIndex + increment;
  if (requestedIndex < 0 || requestedIndex >= imagesUrls.length) {
    hideContainer();
  }
  /*const newIndex = requestedIndex < 0 ? 0 : requestedIndex >= imagesUrls.length ? imagesUrls.length - 1 : requestedIndex;*/
  const newIndex = requestedIndex;
  loadImageUrl(imagesUrls[newIndex]);
};

const parseURL = url => {
  if (urlContains('deviantart.com')) {
    url = url.replace('/200H/', '/').replace('/150/', '/');
  } else if (urlContains('zerochan.net')) {
    url = url.replace('s3.', 'static.').replace('.240.', '.full.');
  }

  return url;
};

const urlContains = text => {
  return window.location.href.includes(text);
};

const removeExtension = url => {
  if (url) {
    extensions.forEach(extension => {
      url = url.replace(extension, '');
    });
  }
  return url;
};

const relocateImage = () => {
  return gizImage.css('margin', `${-Math.ceil(gizImage.height() / 2)}px ${-Math.ceil(gizImage.width() / 2)}px`);
};

const hideContainer = () => {
  return gizContainer.fadeOut(100);
};
const showContainer = () => {
  return gizContainer.fadeIn(100);
};
const isContainerVisible = () => {
  return !jQuery('#giz-container').is(':hidden');
}

const hidePreloader = () => {
  return gizPreloader.hide();
};
const showPreloader = () => {
  return hideImage() && gizPreloader.show();
};

const hideImage = () => {
  return gizImage.hide();
};
const showImage = () => {
  return relocateImage() && hidePreloader() && gizImage.show();
};

setTimeout(() => {
  if (!jQuery('#giz-container').length) {
    initialize();
  }
});
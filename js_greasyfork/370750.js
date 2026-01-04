// ==UserScript==
// @name         Marker's Derpibooru Image Preloader
// @description  Preload previous/next images.
// @version      1.2.14
// @author       Marker
// @license      MIT
// @namespace    https://github.com/marktaiwan/
// @homepageURL  https://github.com/marktaiwan/Derpibooru-Image-Preloader
// @supportURL   https://github.com/marktaiwan/Derpibooru-Image-Preloader/issues
// @include      https://derpibooru.org/*
// @include      https://trixiebooru.org/*
// @include      https://www.derpibooru.org/*
// @include      https://www.trixiebooru.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @inject-into  content
// @noframes
// @require      https://openuserjs.org/src/libs/mark.taiwangmail.com/Derpibooru_Unified_Userscript_UI_Utility.js?v1.2.2
// @downloadURL https://update.greasyfork.org/scripts/370750/Marker%27s%20Derpibooru%20Image%20Preloader.user.js
// @updateURL https://update.greasyfork.org/scripts/370750/Marker%27s%20Derpibooru%20Image%20Preloader.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /* global ConfigManager */
  const config = ConfigManager(
    'Image Preloader',
    'markers_img_prefetcher',
    'Image preloader for a better comic reading experience.'
  );

  // setting up custom API key input
  const apiFieldset = config.addFieldset(
    'Account API key',
    'api_settings',
    'In order to get the correct previous/next images that works with your site filter or "my:*" searches, your API key is needed to authenticate API requests to the site. You can find your API key in your account settings.'
  );
  if (apiFieldset.pageElement) {
    const description = $('i', apiFieldset.pageElement);
    description.innerHTML = description.innerHTML.replace('account settings', '<a href="/registration/edit" target="_blank">account settings</a>');
  }

  const apiSetting = apiFieldset.registerSetting({
    title: 'Stored key:',
    key: 'api_key',
    type: 'text',
    defaultValue: ''
  });
  config.deleteEntry('api_key');  // we only called registerSetting for the UI, we don't actually use this for storing the key

  const apiInput = $('input', apiSetting);
  apiInput.setAttribute('disabled', '');
  apiInput.removeAttribute('data-entry-key');
  apiInput.value = GM_getValue('api_key', '');

  const apiLoad = document.createElement('a');
  apiLoad.href = '#';
  apiLoad.innerText = 'Load key';
  apiLoad.addEventListener('click', e => {
    e.preventDefault();
    const key = window.prompt('Enter your API key:', '').trim();
    if (!key) return;
    GM_setValue('api_key', key);
    apiInput.value = key;
  });

  const apiDelete = document.createElement('a');
  apiDelete.href = '#';
  apiDelete.innerText = 'Delete key';
  apiDelete.addEventListener('click', e => {
    e.preventDefault();
    GM_deleteValue('api_key');
    apiInput.value = '';
  });

  apiSetting.insertAdjacentElement('beforeEnd', document.createElement('br'));
  apiSetting.insertAdjacentElement('beforeEnd', apiLoad);
  apiSetting.insertAdjacentElement('beforeEnd', document.createElement('br'));
  apiSetting.insertAdjacentElement('beforeEnd', apiDelete);

  apiFieldset.registerSetting({
    title: 'Enable API workaround',
    key: 'api_fallback',
    description: 'Uses an alternate method for getting previous/next images, enable this if you don\'t want the script to have your API key.',
    type: 'checkbox',
    defaultValue: true
  });

  // regular settings
  config.registerSetting({
    title: 'Start prefetch',
    key: 'run-at',
    type: 'dropdown',
    defaultValue: 'document-idle',
    selections: [
      {text: 'when current page finishes loading', value: 'document-idle'},
      {text: 'as soon as possible', value: 'document-end'},
    ]
  });
  const imageSelection = config.addFieldset(
    'Preloaded images',
    'selection_settings'
  );
  imageSelection.registerSetting({
    title: 'Previous/next images',
    key: 'get_sequential',
    type: 'checkbox',
    defaultValue: true
  });
  imageSelection.registerSetting({
    title: 'Description',
    key: 'get_description',
    description: 'Preload applicable links found in the description.',
    type: 'checkbox',
    defaultValue: true
  });
  const versionFieldset = config.addFieldset(
    'Image scaling',
    'scaling_settings'
  );
  versionFieldset.registerSetting({
    title: 'Download scaled version',
    key: 'scaled',
    description: 'This is the version you see when you first open a page. If you have \'Scale large images\' disabled in the site settings, this setting will load the full version instead.',
    type: 'checkbox',
    defaultValue: true
  });
  versionFieldset.registerSetting({
    title: 'Download full resolution version',
    key: 'fullres',
    description: 'Turn this on to ensure that the full sized version is always loaded.',
    type: 'checkbox',
    defaultValue: true
  });
  config.registerSetting({
    title: 'Turn off preloading after',
    key: 'off_timer',
    description: 'Automatically turn off the script after periods of inactivity.',
    type: 'dropdown',
    defaultValue: '600',
    selections: [
      {text: ' 5 minutes', value: '300'},
      {text: '10 minutes', value: '600'},
      {text: '20 minutes', value: '1200'},
    ]
  });

  const SCRIPT_ID = 'markers_img_prefetcher';
  const RUN_AT_IDLE = (config.getEntry('run-at') == 'document-idle');
  const WEBM_SUPPORT = MediaSource.isTypeSupported('video/webm; codecs="vp8, vp9, vorbis, opus"');

  const addToLoadingQueue = (function () {
    const MAX_CONNECTIONS = 4;
    const fetchQueue = [];
    let activeConnections = 0;

    const loadingLimited = () => (activeConnections >= MAX_CONNECTIONS && MAX_CONNECTIONS != 0);
    const enqueue = uri => fetchQueue.push(uri);
    const dequeue = () => fetchQueue.shift();
    const fileLoadHandler = () => {
      --activeConnections;
      update();
    };
    const loadFile = fileURI => {
      const IS_VIDEO = (fileURI.endsWith('.webm') || fileURI.endsWith('.mp4'));
      const ele = document.createElement(IS_VIDEO ? 'video' : 'img');
      if (IS_VIDEO) {
        ele.setAttribute('preload', 'auto');
        ele.addEventListener('canplaythrough', fileLoadHandler, {once: true});
      } else {
        ele.addEventListener('load', fileLoadHandler, {once: true});
      }
      ele.src = fileURI;
      ++activeConnections;
    };
    const update = () => {
      while (!loadingLimited()) {
        const uri = dequeue();
        if (uri !== undefined) {
          loadFile(uri);
        } else {
          // queue is empty, end loop.
          break;
        }
      }
    };

    return uri => {
      if (!loadingLimited()) {
        loadFile(uri);
      } else {
        enqueue(uri);
      }
    };
  })();

  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  }

  function getQueryParameter(key) {
    if (!window.location.search) return;
    const array = window.location.search.substring(1).split('&');
    for (let i = 0; i < array.length; i++) {
      if (key == array[i].split('=')[0]) return array[i].split('=')[1];
    }
  }

  /**
   * Picks the appropriate image version for a given width and height
   * of the viewport and the image dimensions.
   */
  function selectVersion(imageWidth, imageHeight, imageSize, imageMime) {
    const imageVersions = {
      small: [320, 240],
      medium: [800, 600],
      large: [1280, 1024]
    };
    let viewWidth = document.documentElement.clientWidth;
    let viewHeight = document.documentElement.clientHeight;

    // load hires if that's what you asked for
    if (JSON.parse(localStorage.getItem('serve_hidpi'))) {
      viewWidth *= (window.devicePixelRatio || 1);
      viewHeight *= (window.devicePixelRatio || 1);
    }

    if (viewWidth > 1024 && imageHeight > 1024 && imageHeight > 2.5 * imageWidth) {
      // Treat as comic-sized dimensions..
      return 'tall';
    }

    // Find a version that is larger than the view in one/both axes
    for (let i = 0, versions = Object.keys(imageVersions); i < versions.length; ++i) {
      const version = versions[i];
      const dimensions = imageVersions[version];
      const versionWidth = Math.min(imageWidth, dimensions[0]);
      const versionHeight = Math.min(imageHeight, dimensions[1]);

      if (versionWidth > viewWidth || versionHeight > viewHeight) {
        return version;
      }
    }

    // If the view is larger than any available version, display the original image.
    //
    // Sanity check to make sure we're not serving unintentionally huge assets
    // all at once (where "huge" > 25 MiB). Videos are loaded in chunks so it
    // doesn't matter too much there.
    if (imageMime === 'video/webm' || imageSize <= 26214400) {
      return 'full';
    } else {
      return 'large';
    }
  }

  function fetchSequentialId(url) {
    return fetch(url, {credentials: 'same-origin'})
      .then(response => response.json())
      .then(json => (json.images.length) ? json.images[0] : null);
  }

  function fetchMeta(metaURI) {
    return fetch(metaURI, {credentials: 'same-origin'})
      .then(response => response.json())
      .then(meta => {
        // check response for 'duplicate_of' redirect
        return (meta.duplicate_of === undefined)
          ? meta
          : fetchMeta(`${window.location.origin}/api/v1/json/images/${meta.duplicate_of}`);
      });
  }

  async function fetchFile(meta) {

    // 'meta' could be an URI or an object
    const metadata = (typeof meta == 'string')
      ? await fetchMeta(meta).then(response => response.image)
      : meta;
    if (meta === null || isEmpty(metadata)) return;

    const version = selectVersion(metadata.width, metadata.height, metadata.size, metadata.mime_type);
    const uris = metadata.representations;
    const serve_webm = JSON.parse(localStorage.getItem('serve_webm'));
    const get_fullres = config.getEntry('fullres');
    const get_scaled = config.getEntry('scaled');
    const site_scaling = (document.querySelector('#image_target, .image-target').dataset.scaled !== 'false');
    const serveGifv = (metadata.mime_type == 'image/gif' && uris.webm !== undefined && serve_webm);  // gifv: video clips masquerading as gifs

    if (serveGifv) {
      uris['full'] = uris[WEBM_SUPPORT ? 'webm' : 'mp4'];
    }

    // May I never have to untangle these two statements again
    if (get_scaled && site_scaling && version !== 'full') {
      addToLoadingQueue(uris[version]);
    }
    if (get_fullres || (get_scaled && (version === 'full' || !site_scaling))) {
      addToLoadingQueue(uris['full']);
    }
  }

  function initPrefetch() {
    config.setEntry('last_run', Date.now());

    const urlTemplate = (imageId, filterId, qualifier) => {
      const queryParameters = [];
      const queryString = getQueryParameter('q');
      const apiKey = GM_getValue('api_key', '');
      let searchQuery = `id.${qualifier}%3A${imageId}`;     // '%3A' == ':'

      if (queryString) searchQuery += `%2C+${queryString}`; // '%2C' == ','
      if (apiKey) queryParameters.push(['key', apiKey.trim()]);
      // reverse the sort order to get the first image greater than the current id
      if (qualifier == 'gt') queryParameters.push(['sd', 'asc']);

      queryParameters.push(
        ['per_page', '1'],
        ['filter_id', filterId],
        ['q', searchQuery]
      );
      return `${window.location.origin}/api/v1/json/search/images?${queryParameters.map(tuple => tuple.join('=')).join('&')}`;
    };

    const regex = new RegExp(
      `^https?://(?:(?:www\\.)?(?:derpibooru\\.org|trixiebooru\\.org)|${window.location.hostname.replace(/\./g, '\\.')})/(?:images/)?(\\d{1,})(?:\\?|\\?.{1,}|/|\\.html)?(?:#.*)?$`
    );
    const description = $('.image-description__text');
    const get_sequential = config.getEntry('get_sequential');
    const get_description = config.getEntry('get_description');

    if (config.getEntry('fullres')) {
      // preload current image's full res version
      const imageTarget = document.querySelector('#image_target, .image-target');
      if (imageTarget.dataset.scaled !== 'false') fetchFile({
        width: Number.parseInt(imageTarget.dataset.width),
        height: Number.parseInt(imageTarget.dataset.height),
        representations: JSON.parse(imageTarget.dataset.uris),
        size: Number.parseInt(imageTarget.dataset.imageSize),
        mime_type: imageTarget.dataset.mimeType,
      });
    }
    if (get_sequential) {
      const currentImageID = regex.exec(window.location.href)[1];
      const filterId = $('.js-datastore').dataset.filterId;

      if (!config.getEntry('api_fallback')) {
        const next = urlTemplate(currentImageID, filterId, 'lt');
        const prev = urlTemplate(currentImageID, filterId, 'gt');
        fetchSequentialId(next).then(fetchFile);
        fetchSequentialId(prev).then(fetchFile);
      } else {
        const next = $('.js-next').href;
        const prev = $('.js-prev').href;
        [next, prev].forEach(url => {
          fetch(url, {credentials: 'same-origin'}).then(response => {
            const matchImageId = regex.exec(response.url);
            if (matchImageId) fetchFile(`${window.location.origin}/api/v1/json/images/${matchImageId[1]}`);
          });
        });
      }
    }
    if (get_description && description !== null) {
      for (const link of $$('a', description)) {
        const matchImageId = regex.exec(link.href);
        if (matchImageId !== null) {
          const metaURI = `${window.location.origin}/api/v1/json/images/${matchImageId[1]}`;
          fetchFile(metaURI);
        }
      }
    }
  }

  function toggleSettings(event) {
    event.stopPropagation();
    if (event.currentTarget.classList.contains('disabled')) return;

    const anchor = event.currentTarget;
    const input = $('input', anchor);
    const entryId = input.dataset.settingEntry;
    const storedValue = config.getEntry(entryId);

    if (anchor === event.target) {
      input.checked = !input.checked;
    }

    if (input.checked !== storedValue) {
      config.setEntry(entryId, input.checked);
    }
  }

  function insertUI() {
    const header = $('header.header');
    const headerRight = $('.header__force-right', header);
    const menuButton = document.createElement('div');
    menuButton.classList.add('dropdown', 'header__dropdown', 'hide-mobile', `${SCRIPT_ID}__menu`);
    menuButton.innerHTML = `
<a class="header__link" href="#" data-click-preventdefault="true">
  <i class="${SCRIPT_ID}__icon fa ${config.getEntry('preload') ? 'fa-shipping-fast' : 'fa-truck'}"></i>
  <span class="hide-limited-desktop"> Preloader </span>
  <span data-click-preventdefault="true"><i class="fa fa-caret-down"></i></span>
</a>
<nav class="dropdown__content dropdown__content-right hide-mobile">
  <a class="${SCRIPT_ID}__main-switch header__link"></a>
  <a class="header__link ${SCRIPT_ID}__option">
    <input type="checkbox" id="${SCRIPT_ID}--get_seq" data-setting-entry="get_sequential">
    <label for="${SCRIPT_ID}--get_seq"> Previous/Next</label>
  </a>
  <a class="header__link ${SCRIPT_ID}__option">
    <input type="checkbox" id="${SCRIPT_ID}--get_desc" data-setting-entry="get_description">
    <label for="${SCRIPT_ID}--get_desc"> Description</label>
  </a>
</nav>`;

    // Attach event listeners
    $(`.${SCRIPT_ID}__main-switch`, menuButton).addEventListener('click', e => {
      e.preventDefault();
      const scriptActive = config.getEntry('preload');
      if (scriptActive) {
        scriptOff();
      } else {
        scriptOn();
      }
    });

    for (const option of $$(`.${SCRIPT_ID}__option`, menuButton)) {
      option.addEventListener('click', toggleSettings);
    }

    updateUI(menuButton);
    headerRight.insertAdjacentElement('afterbegin', menuButton);
  }

  function updateUI(ele) {
    const menu = ele || $(`.${SCRIPT_ID}__menu`);
    const icon = $(`.${SCRIPT_ID}__icon`, menu);
    const mainSwitch = $(`.${SCRIPT_ID}__main-switch`, menu);
    const options = $$(`.${SCRIPT_ID}__option`, menu);
    const scriptActive = config.getEntry('preload');

    if (mainSwitch.innerHTML == '') {
      mainSwitch.innerHTML = `<i class="fa"></i><span> Turn ${scriptActive ? 'off' : 'on'}</span>`;
    }

    if (scriptActive) {
      icon.classList.remove('fa-truck');
      icon.classList.add('fa-shipping-fast');


      $('i', mainSwitch).classList.remove('fa-toggle-off');
      $('i', mainSwitch).classList.add('fa-toggle-on');
      $('span', mainSwitch).innerText = ' Turn off';

      for (const option of options) {
        option.classList.remove('disabled');
        $('input', option).disabled = false;

      }
    } else {
      icon.classList.remove('fa-shipping-fast');
      icon.classList.add('fa-truck');


      $('i', mainSwitch).classList.remove('fa-toggle-on');
      $('i', mainSwitch).classList.add('fa-toggle-off');
      $('span', mainSwitch).innerText = ' Turn on';

      for (const option of options) {
        option.classList.add('disabled');
        $('input', option).disabled = true;
      }
    }

    for (const option of options) {
      const input = $('input', option);
      input.checked = config.getEntry(input.dataset.settingEntry);
    }
  }

  function scriptOn() {
    config.setEntry('preload', true);
    updateUI();
    initPrefetch();
  }

  function scriptOff() {
    config.setEntry('preload', false);
    updateUI();
  }

  function checkTimer() {
    const lastRun = config.getEntry('last_run') || 0;
    const offTimer = Number(config.getEntry('off_timer')) * 1000;  // seconds => milliseconds
    if (Date.now() - lastRun > offTimer) {
      scriptOff();
    }
  }

  function isEmpty(obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }

  // run on main image page, only start after the page finished loading resources
  if (document.querySelector('#image_target, .image-target') !== null) {
    // Use the storage event to update UI across tabs
    window.addEventListener('storage', (function () {
      let preload = config.getEntry('preload');
      let get_sequential = config.getEntry('get_sequential');
      let get_description = config.getEntry('get_description');
      return function (e) {
        if (e.key !== 'derpi_four_u') return;
        const new_preload = config.getEntry('preload');
        const new_get_sequential = config.getEntry('get_sequential');
        const new_get_description = config.getEntry('get_description');

        // check for changes in settings
        if ((preload !== new_preload) || (get_sequential !== new_get_sequential) || (get_description !== new_get_description)) {
          [preload, get_sequential, get_description] = [new_preload, new_get_sequential, new_get_description];
          updateUI();
        }
      };
    })());

    insertUI();
    checkTimer();

    if (config.getEntry('preload')) {
      if (document.readyState !== 'complete' && RUN_AT_IDLE) {
        window.addEventListener('load', initPrefetch);
      } else {
        initPrefetch();
      }
    }
  }
})();

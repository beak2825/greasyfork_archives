// ==UserScript==
// @name         FR:Reborn
// @namespace    https://www.reddit.com/user/RobotOilInc
// @version      1.2.2
// @description  Show all QCs in TaoBao/Yupoo/etc
// @author       RobotOilInc
// @match        https://detail.1688.com/offer/*
// @match        https://*.taobao.com/item.htm*
// @match        https://market.m.taobao.com/app/*/detail.html?id=*
// @match        https://*.tmall.com/item.htm*
// @match        https://*.weidian.com/item.html*
// @match        https://weidian.com/item.html*
// @match        https://*.yupoo.com/albums/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @homepageURL  https://www.fashionreps.page/
// @supportURL   https://greasyfork.org/en/scripts/426976-fr-reborn
// @require      https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @require      https://unpkg.com/js-logger@1.6.1/src/logger.min.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/swagger-client@3.18.4/dist/swagger-client.browser.min.js
// @require      https://unpkg.com/iframe-resizer@4.3.2/js/iframeResizer.min.js
// @require      https://greasyfork.org/scripts/11562-gm-config-8/code/GM_config%208+.js?version=66657
// @resource     sweetalert2 https://unpkg.com/sweetalert2@11.0.15/dist/sweetalert2.min.css
// @run-at       document-end
// @icon         https://i.imgur.com/mYBHjAg.png
// @downloadURL https://update.greasyfork.org/scripts/426976/FR%3AReborn.user.js
// @updateURL https://update.greasyfork.org/scripts/426976/FR%3AReborn.meta.js
// ==/UserScript==

// Define default toast
const Toast = Swal.mixin({
  showConfirmButton: false,
  timerProgressBar: true,
  position: 'top-end',
  timer: 4000,
  toast: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

/**
 * @param text {string}
 * @param type {null|('success'|'error'|'warning'|'info')}
 */
const Snackbar = function (text, type = null) {
  Toast.fire({ title: text, icon: type != null ? type : 'info' });
};

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
 * @param selector
 * @returns {Promise}
 */
const elementReady = function (selector) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) {
      resolve(el);
    }

    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        // Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
};

class Source1688 {
  constructor() {
    this.setup = false;
  }

  /**
   * @param client {SwaggerClient}
   * @returns {Source1688}
   */
  build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    this.client = client;
    this.setup = true;

    return this;
  }

  loadIframe($iframe) {
    if (this.setup === false) {
      throw new Error('Source is not setup, so cannot be used');
    }

    const id = window.location.href.match(/offer\/(\d+)/i)[1];

    // Build URL
    const request = SwaggerClient.buildRequest({
      spec: this.client.spec,
      operationId: 'view1688',
      parameters: { id },
      responseContentType: 'application/json',
    });

    $iframe.hide()
      .css('width', '100%')
      .attr('src', request.url);

    // Finally, append (once it exists)
    elementReady('.od-pc-attribute')
      .then((element) => { $(element).after($iframe); });
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    return hostname.includes('1688.com');
  }
}

class SourceTaobao {
  constructor() {
    this.setup = false;
  }

  /**
   * @param client {SwaggerClient}
   * @returns {SourceTaobao}
   */
  build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    this.client = client;
    this.setup = true;

    return this;
  }

  loadIframe($iframe) {
    if (this.setup === false) {
      throw new Error('Source is not setup, so cannot be used');
    }

    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');

    // Build URL
    const request = SwaggerClient.buildRequest({
      spec: this.client.spec,
      operationId: 'viewTaobao',
      parameters: { id },
      responseContentType: 'application/json',
    });

    // Hide, to later show and add the src
    $iframe.hide()
      .css('width', '100%')
      .attr('src', request.url);

    // Finally append (once it exists)
    elementReady('[class^=BasicContent--root]')
      .then((element) => { $(element).after($iframe); });
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    return hostname.includes('taobao');
  }
}

class SourceTmall {
  constructor() {
    this.setup = false;
  }

  /**
   * @param client {SwaggerClient}
   * @returns {SourceTmall}
   */
  build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    this.client = client;
    this.setup = true;

    return this;
  }

  loadIframe($iframe) {
    if (this.setup === false) {
      throw new Error('Source is not setup, so cannot be used');
    }

    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');

    // Build URL
    const request = SwaggerClient.buildRequest({
      spec: this.client.spec,
      operationId: 'viewTmall',
      parameters: { id },
      responseContentType: 'application/json',
    });

    // Hide, to later show and add the src
    $iframe.hide()
      .css('width', '770px')
      .attr('src', request.url);

    // Finally append (once it exists)
    elementReady('.attributes#attributes')
      .then((element) => { $(element).after($iframe); });
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    return hostname.includes('tmall');
  }
}

class SourceWeidian {
  constructor() {
    this.setup = false;
  }

  /**
   * @param client {SwaggerClient}
   * @returns {SourceWeidian}
   */
  build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    this.client = client;
    this.setup = true;

    return this;
  }

  loadIframe($iframe) {
    if (this.setup === false) {
      throw new Error('Source is not setup, so cannot be used');
    }

    const id = window.location.href.match(/[?&]itemId=(\d+)/i)[1];

    // Build URL
    const request = SwaggerClient.buildRequest({
      spec: this.client.spec,
      operationId: 'viewWeidian',
      parameters: { id },
      responseContentType: 'application/json',
    });

    // Hide, to later show and add the src
    $iframe.hide()
      .css('width', '100%')
      .attr('src', request.url);

    // Finally append (once it exists)
    elementReady('.item-info > .item-wrap')
      .then((element) => { $(element).after($iframe); });
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    // If we are indeed on Weidian, add specific Weidian CSS
    if (hostname.includes('weidian.com')) {
      GM_addStyle('.swal2-icon,.swal2-icon .swal2-icon-content,.swal2-popup.swal2-toast .swal2-title,.swal2-toast-shown .swal2-container{font-size:12px}.swal2-popup.swal2-toast{padding:.2em}.swal2-timer-progress-bar-container{height:.1em}.swal2-container{height:100px}');

      return true;
    }

    return false;
  }
}

class SourceXianyu {
  constructor() {
    this.setup = false;
  }

  /**
   * @param client {SwaggerClient}
   * @returns {SourceXianyu}
   */
  build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    this.client = client;
    this.setup = true;

    return this;
  }

  loadIframe($iframe) {
    if (this.setup === false) {
      throw new Error('Source is not setup, so cannot be used');
    }

    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');

    // Build URL
    const request = SwaggerClient.buildRequest({
      spec: this.client.spec,
      operationId: 'viewXianyu',
      parameters: { id },
      responseContentType: 'application/json',
    });

    // Hide, to later show and add the src
    $iframe.hide()
      .css('width', '770px')
      .attr('src', request.url);

    // Finally append (once it exists)
    elementReady('#root div.rax-view-v2 > div.rax-view-v2:nth-child(3) > div.rax-view-v2:nth-child(2)')
      .then((element) => { $(element).after($iframe); });
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    return hostname.includes('market.m.taobao.com') || hostname.includes('2.taobao.com');
  }
}

class SourceYupoo {
  constructor() {
    this.setup = false;
  }

  /**
   * @param client {SwaggerClient}
   * @returns {SourceYupoo}
   */
  build(client) {
    // If already build before, just return
    if (this.setup) {
      return this;
    }

    this.client = client;
    this.setup = true;

    return this;
  }

  loadIframe($iframe) {
    if (this.setup === false) {
      throw new Error('Source is not setup, so cannot be used');
    }

    const id = window.location.href.match(/^https?:\/\/.*\.x\.yupoo\.com\/albums\/(\d+)/)[1];
    const author = window.location.hostname.replace('.x.yupoo.com', '');

    // Build URL
    const request = SwaggerClient.buildRequest({
      spec: this.client.spec,
      operationId: 'viewYupoo',
      parameters: { id, author },
      responseContentType: 'application/json',
    });

    // Hide, to later show and add the src
    $iframe.hide()
      .attr('src', request.url);

    // Finally append (once it exists)
    elementReady('.showalbum__imagecardwrap')
      .then((element) => { $(element).append($iframe); });
  }

  /**
   * @param hostname {string}
   * @returns {boolean}
   */
  supports(hostname) {
    return hostname.includes('yupoo.com');
  }
}

class Sources {
  /**
   * @param hostname {string}
   */
  constructor(hostname) {
    this.source = null;

    const sources = [new Source1688(), new SourceTaobao(), new SourceTmall(), new SourceYupoo(), new SourceWeidian(), new SourceXianyu()];
    Object.values(sources).forEach((value) => {
      if (value.supports(hostname)) {
        this.source = value;
      }
    });
  }
}

// Inject snackbar css style
GM_addStyle(GM_getResourceText('sweetalert2'));
GM_addStyle('.swal2-container {z-index: 2147483646}');

// Setup proper settings menu
GM_config.init('Settings', {
  serverSection: {
    label: 'QC Server settings',
    type: 'section',
  },
  swaggerDocUrl: {
    label: 'Swagger documentation URL',
    type: 'text',
    default: 'https://www.fashionreps.page/api/doc.json',
  },
});

// Reload page if config changed
GM_config.onclose = (saveFlag) => {
  if (saveFlag) {
    window.location.reload();
  }
};

// Register menu within GM
GM_registerMenuCommand('Settings', GM_config.open);

// eslint-disable-next-line func-names
(async function () {
  // Setup the logger.
  Logger.useDefaults();

  // Log the start of the script.
  Logger.info(`Starting extension '${GM_info.script.name}', version ${GM_info.script.version}`);

  // Get the proper source view, if any
  const { source } = new Sources(window.location.hostname);

  // If we don't have a source, abort
  if (source === null) {
    Logger.error('Unsupported website');

    return;
  }

  /** @type {SwaggerClient} */
  let client;

  // Try to create Swagger client from our own documentation
  try {
    client = await new SwaggerClient({ url: GM_config.get('swaggerDocUrl') });
  } catch (error) {
    Snackbar('We are unable to connect to FR:Reborn, features will be disabled.');
    Logger.error(`We are unable to connect to FR:Reborn: ${GM_config.get('swaggerDocUrl')}`, error);

    return;
  }

  // Create iFrame we will pass to the loader
  const $iframe = $('<iframe id="qciframe" style="border:0" />');
  $iframe.on('load', () => {
    $iframe.iFrameResize({ checkOrigin: ['https://localhost:8000', 'https://www.fashionreps.page', 'https://fashionreps.page'], bodyMargin: 10, bodyPadding: 10 });
    $iframe.show();
  });

  // Build the source and load the iFrame
  source.build(client).loadIframe($iframe);
}());
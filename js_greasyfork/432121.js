// ==UserScript==
// @name         BaseTao - GL/RL extension
// @namespace    https://www.reddit.com/user/RobotOilInc
// @version      1.0.2
// @description  Mark the items you want to keep or return
// @author       RobotOilInc
// @match        https://www.basetao.com/index/myhome/myorder/arrived.html
// @match        https://basetao.com/index/myhome/myorder/arrived.html
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/432121-basetao-gl-rl-extension
// @supportURL   https://greasyfork.org/en/scripts/432121-basetao-gl-rl-extension
// @require      https://unpkg.com/sweetalert2@11/dist/sweetalert2.js
// @require      https://unpkg.com/js-logger@1.6.1/src/logger.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @resource     sweetalert2 https://unpkg.com/sweetalert2@11.0.15/dist/sweetalert2.min.css
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/432121/BaseTao%20-%20GLRL%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/432121/BaseTao%20-%20GLRL%20extension.meta.js
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

const STATES = Object.freeze({
  GREEN_LIGHT: 'green_light',
  RED_LIGHT: 'red_light',
});

class Storage {
  get(orderId) {
    return GM_getValue(orderId, null);
  }

  exists(orderId) {
    return this.get(orderId) !== null;
  }

  set(orderId, state) {
    if (!Object.values(STATES).includes(state)) {
      throw new Error('Invalid state has been passed');
    }

    return GM_setValue(orderId, state);
  }
}

class BaseTaoElement {
  constructor($element) {
    this.object = $element;

    // eslint-disable-next-line prefer-destructuring
    this.orderId = $element.find('td:nth-child(7) > ul:nth-child(3) > li > a').first().attr('href').trim().match(/itemimg\/(\d+)\.html/)[1];
  }
}

class BaseTao {
  constructor() {
    // Ensure the toast looks decent on Basetao
    GM_addStyle('.swal2-popup.swal2-toast .swal2-title {font-size: 1.5em; font-weight: bolder}');

    // Get the username
    const username = $('#dropdownMenu1').text();
    if (typeof username === 'undefined' || username == null || username === '') {
      Snackbar('You need to be logged in to use this extension.');

      return this;
    }

    this.storage = new Storage();

    return this;
  }

  /**
   * @return {Promise<void>}
   */
  async process() {
    // Make copy of the current this, so we can use it later
    const agent = this;

    // Get the container
    const $container = $('.myparcels-ul').first();

    // Add icons to all elements
    $container.find('.tr-bodnone').each(function () {
      agent._buildElement($(this));
    });
  }

  /**
   * @private
   * @param $this
   * @return {Promise<BaseTaoElement>}
   */
  async _buildElement($this) {
    const element = new BaseTaoElement($this);
    const agent = this;

    const $marker = $('<ul class="gl-rl" style="min-width: 4em;padding: 0;border: 1px black dotted;"><li style="width: 100%;text-align: center;"></li></ul>');
    $this.find('td:nth-child(6)').append($marker);

    const $gl = $('<span style="width: 49%;padding: 2px;font-weight: bold;" title="Green light">✔️</span>');
    const $rl = $('<span style="width: 49%;padding: 2px;font-weight: bold;" title="Red light">🛑</span>');
    const $swap = $('<span style="width: 49%;cursor: pointer;padding: 2px;font-weight: bold;" title="Swap">🔁</span>');

    // Always assign the click to swap, because it doesn't matter
    $swap.on('click', () => {
      if (this.storage.get(element.orderId) === STATES.GREEN_LIGHT) {
        this.storage.set(element.orderId, STATES.RED_LIGHT);
        Snackbar('Swapped to RL!');

        // Remove and rebuild
        $marker.remove();
        agent._buildElement($this);

        return;
      }

      if (this.storage.get(element.orderId) === STATES.RED_LIGHT) {
        this.storage.set(element.orderId, STATES.GREEN_LIGHT);
        Snackbar('Swapped to GL!');

        // Remove and rebuild
        $marker.remove();
        agent._buildElement($this);
      }
    });

    // If it already exists, show swap or gl/rl without pointers
    if (this.storage.exists(element.orderId)) {
      if (this.storage.get(element.orderId) === STATES.GREEN_LIGHT) {
        $marker.find('li').append($gl);
      }

      if (this.storage.get(element.orderId) === STATES.RED_LIGHT) {
        $marker.find('li').append($rl);
      }

      $marker.find('li').append($swap);

      return element;
    }

    // Make the spans pointers
    $gl.css('cursor', 'pointer');
    $rl.css('cursor', 'pointer');

    $gl.on('click', () => {
      this.storage.set(element.orderId, STATES.GREEN_LIGHT);
      Snackbar('GL, good stuff!');

      // Remove and rebuild
      $marker.remove();
      agent._buildElement($this);
    });

    $rl.on('click', () => {
      this.storage.set(element.orderId, STATES.RED_LIGHT);
      Snackbar('RL? Sucks to suck');

      // Remove and rebuild
      $marker.remove();
      agent._buildElement($this);
    });

    $marker.find('li').append($gl, $rl);

    return element;
  }
}

// Inject snackbar css style
GM_addStyle(GM_getResourceText('sweetalert2'));

// eslint-disable-next-line func-names
(async function () {
  // Setup the logger.
  Logger.useDefaults();

  // Log the start of the script.
  Logger.info(`Starting extension '${GM_info.script.name}', version ${GM_info.script.version}`);

  // Start building the GL/RL list
  try {
    await new BaseTao().process();
  } catch (error) {
    Snackbar(`An unknown issue has occurred when trying to setup the extension: ${error.message}`);
    Logger.error('An unknown issue has occurred', error);
  }
}());
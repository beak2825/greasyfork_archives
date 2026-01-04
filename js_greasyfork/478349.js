// ==UserScript==
// ==UserLibrary==
// @name        NH_userscript
// @description Wrappers for dealing with variations in userscript managers.
// @version     6
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0-standalone.html
// @homepageURL https://github.com/nexushoratio/userscripts
// @supportURL  https://github.com/nexushoratio/userscripts/issues
// @match       https://www.example.com/*
// ==/UserLibrary==
// ==/UserScript==

window.NexusHoratio ??= {};

window.NexusHoratio.userscript = (function userscript() {
  'use strict';

  /** @type {number} - Bumped per release. */
  const version = 6;

  const NH = window.NexusHoratio.base.ensure(
    [{name: 'base', minVersion: 52}]
  );

  /** Library specific exception. */
  class Exception extends NH.base.Exception {}

  /**
   * @typedef LicenseData
   * @property {string} name - License name.
   * @property {string} url - URL pointing to the license.
   */

  /**
   * Per the *old* GM docs:
   * https://sourceforge.net/p/greasemonkey/wiki/Metadata_Block/#license
   * @returns {LicenseData} - Extracted from the userscript header.
   * @throws {Error} - If cannot be extracted.
   */
  function licenseData() {
    let license = GM.info.script.license;
    if (!license) {
      const magic = '// @license ';

      // Try a legacy way
      const header = GM.info.scriptMetaStr;
      if (header) {
        const line = header.split('\n')
          .find(l => l.startsWith(magic));
        if (line) {
          license = line.slice(magic.length)
            .trim();
        }
      }
    }

    if (!license) {
      const msg = [
        'Unable to extract license information from the userscript.',
        // eslint-disable-next-line no-magic-numbers
        JSON.stringify(GM.info, null, 2),
      ].join('\n');
      throw new Exception(msg);
    }

    const [name, url] = license.split(';');

    return {
      name: name.trim(),
      url: url.trim(),
    };
  }

  /** @returns {string[]} - Raw text about the current environment. */
  function environmentData() {
    const gm = GM.info;
    const msgs = [`${gm.script.name}: ${gm.script.version}`];
    msgs.push('NexusHoratio libraries:');
    for (const [lib, obj] of Object.entries(window.NexusHoratio)) {
      if (Object.hasOwn(obj, 'version')) {
        msgs.push(`  ${lib}: ${obj.version}`);
      } else {
        msgs.push(`  ${lib}: Unknown version`);
      }
    }

    msgs.push(`Userscript manager: ${gm.scriptHandler} ${gm.version}`);

    if (gm.injectInto) {
      msgs.push(`  injected into "${gm.injectInto}"`);
    }

    // Violentmonkey
    if (gm.platform) {
      msgs.push(`Platform: ${gm.platform.browserName} ` +
                `${gm.platform.browserVersion} ${gm.platform.os} ` +
                `${gm.platform.arch}`);
    }

    // Tampermonkey
    if (gm.userAgentData) {
      let msg = 'Platform: ';
      for (const brand of gm.userAgentData.brands.values()) {
        msg += `${brand.brand} ${brand.version} `;
      }
      msg += `${gm.userAgentData?.platform} `;
      msg +=
        `${gm.userAgentData?.architecture}-${gm.userAgentData?.bitness}`;
      msgs.push(msg);
    }
    return msgs;
  }

  /**
   * Fetches value from userscript storage if granted.
   *
   * Purposefully no errors if permissions are not granted
   *
   * @param {string} key - The name of the value to load.
   * @param {*} defaultValue - Value if not stored OR not enabled.
   * @returns {Promise<*>} - The value fetched or defaultValue.
   */
  function getValue(key, defaultValue) {
    if (GM.getValue) {
      return GM.getValue(key, defaultValue);
    }
    return Promise.resolve(defaultValue);
  }

  /**
   * Sets a value in userscript storage if granted.
   *
   * Purposefully no errors if permissions are not granted
   *
   * @param {string} key - The name to use in the storage.
   * @param {*} value - The value to set.
   * @returns {Promise<*>} - Always resolves to null; mostly used to ensure
   * the write is complete.
   */
  function setValue(key, value) {
    if (GM.setValue) {
      return GM.setValue(key, value);
    }
    return Promise.resolve(null);
  }

  return {
    version: version,
    Exception: Exception,
    UserscriptError: Exception,
    licenseData: licenseData,
    environmentData: environmentData,
    getValue: getValue,
    setValue: setValue,
  };

}());

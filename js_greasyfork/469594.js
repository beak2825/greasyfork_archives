// ==UserScript==
// @name        Double-click Image Downloader
// @namespace   leaumar
// @match       *://*/*
// @grant       GM.download
// @grant       GM.xmlHttpRequest
// @connect     *
// @version     3
// @author      leaumar@mailbox.org
// @description Double-click images to download them.
// @license     MPL-2.0
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/469594/Double-click%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469594/Double-click%20Image%20Downloader.meta.js
// ==/UserScript==

class HttpError extends Error {
  constructor(verb, response) {
    super(`HTTP request ${verb}.`, {
      cause: response
    });
  }
}

function httpRequest(method, url) {
  return new Promise((resolve, reject) => {
    function fail(verb) {
      return error => reject(new HttpError(verb, error));
    }

    GM.xmlHttpRequest({
      url: url.href,
      onload: resolve,
      onerror: fail('errored'),
      onabort: fail('aborted'),
      ontimeout: fail('timed out'),
      responseType: 'blob',
    });
  });
}

function httpDownload(url, name) {
  return new Promise((resolve, reject) => {
    function fail(verb) {
      return error => reject(new HttpError(verb, error));
    }

    GM.download({
      url: url.href,
      name,
      onload: () => resolve(),
      onerror: fail('errored'),
      onabort: fail('aborted'),
      ontimeout: fail('timed out'),
      responseType: 'blob',
    });
  });
}

// -----------------

// from the greasemonkey docs
const lineSeparator = '\r\n';
const headerSeparator = ": ";

// is it still the 90s?
function parseHeaders(headersString) {
  return headersString.split(lineSeparator).reduce((accumulator, line) => {
    const pivot = line.indexOf(headerSeparator);
    const name = line.slice(0, pivot).trim().toLowerCase();
    const value = line.slice(pivot + headerSeparator.length).trim();
    accumulator[name] = value;
    return accumulator;
  }, {});
}

// ----------------

function filterFilename(name) {
  // foo.jpg
  return /^.+\.(?:jpe?g|png|gif|webp)$/iu.exec(name)?.[0];
}

async function queryFilename(url) {
  const response = await httpRequest('HEAD', url);
  const disposition = parseHeaders(response.responseHeaders)['content-disposition'];
  if (disposition != null) {
    // naive approach, but proper parsing is WAY overkill
    // attachment; filename="foo.jpg" -> foo.jpg
    const serverName = /^(?:attachment|inline)\s*;\s*filename="([^"]+)"/iu.exec(disposition)?.[1];
    if (serverName != null) {
      return filterFilename(serverName);
    }
  }
}

function readFilename(url) {
  const branch = url.pathname;
  const leaf = branch.slice(branch.lastIndexOf('/') + 1);
  return filterFilename(leaf);
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function downloadImage(url, name, image) {
  const opacity = image.style.opacity ?? 1;

  image.style.opacity = 0.5;
  await Promise.all([httpDownload(url, name), sleep(100)]);
  image.style.opacity = opacity;
}

async function onDoubleClick(dblClick) {
  if (dblClick.target.nodeName === 'IMG') {
    const imageElement = dblClick.target;
    const url = new URL(imageElement.src, location.origin);
    const name = readFilename(url) ?? await queryFilename(url);
    if (name == null) {
      throw new Error('Could not determine a filename.');
    }
    await downloadImage(url, name, imageElement);
  }
}

(function main() {
  document.body.addEventListener('dblclick', dblClick => onDoubleClick(dblClick).catch(console.error));
})();

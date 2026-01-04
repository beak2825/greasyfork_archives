// ==UserScript==
// @name FileDownloader-Module
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Module providing file download functionality with GET and POST support
// @author maanimis
// @grant GM_xmlhttpRequest
// @run-at document-start
// ==/UserScript==

(function () {
  'use strict';

  class FileDownloader {
    static async fetchAsBlob(url, options = {}) {
      const defaultOptions = {
        method: 'GET',
        headers: {},
        body: null,
      };

      const fetchOptions = { ...defaultOptions, ...options };

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: fetchOptions.method,
          url: url,
          headers: fetchOptions.headers,
          data: fetchOptions.body,
          responseType: 'blob',
          onload: function (response) {
            if (response.status >= 200 && response.status < 300) {
              resolve(response.response);
            } else {
              reject(new Error(`HTTP error! Status: ${response.status}`));
            }
          },
          onerror: function (error) {
            reject(new Error('Network error occurred'));
          },
        });
      });
    }

    static async fetchWithPost(url, data, headers = {}) {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      };
      return this.fetchAsBlob(url, options);
    }

    static async fetchWithFormData(url, formData, headers = {}) {
      // When using FormData with GM_xmlhttpRequest, we don't need to set Content-Type
      // as it will be set automatically with the correct boundary
      const options = {
        method: 'POST',
        headers: {
          ...headers,
        },
        body: formData,
      };
      return this.fetchAsBlob(url, options);
    }

    static createObjectUrl(blob) {
      return URL.createObjectURL(blob);
    }

    static revokeObjectUrl(url) {
      URL.revokeObjectURL(url);
    }

    static triggerDownload(blob, filename) {
      const url = this.createObjectUrl(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.revokeObjectUrl(url);
    }

    static openInNewTab(blob) {
      const url = this.createObjectUrl(blob);
      window.open(url);
      return url;
    }
  }

  // Add to window as a module
  window.FileDownloaderModule = FileDownloader;

  // Dispatch an event to notify other scripts that the module is loaded
  const event = new CustomEvent('FileDownloaderModuleLoaded');
  document.dispatchEvent(event);
  console.log('FileDownloader module loaded');
})();

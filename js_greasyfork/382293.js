// ==UserScript==
// @name         Meta Theme Color
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add meta theme color to page
// @author       You
// @include      *
// @connect      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/382293/Meta%20Theme%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/382293/Meta%20Theme%20Color.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var debug = false;
  var log = debug ? console.log : function () {};
  var isResetValue = true;

  function getDataImage(url, callback) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      overrideMimeType: 'text/plain; charset=x-user-defined',
      onload: function (response) {
        var binary = '';
        var responseText = response.responseText;
        var responseTextLen = responseText.length;

        for (var i = 0; i < responseTextLen; i++) {
          binary += String.fromCharCode(responseText.charCodeAt(i) & 255);
        }
        callback('data:image/jpeg;base64,' + btoa(binary));
      },
      onerror: function (response) {

      }
    });
  }

  function getFavicon() {
    var favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (favicon) {
      return favicon.href;
    }
  }

  function getAverageRGB(dataImage, callback) {
    var img = document.createElement('img');
    img.src = dataImage;

    var defaultRGB = {
      r: 0,
      g: 0,
      b: 0
    }; // for non-supporting envs

    img.addEventListener('load', function () {
      var blockSize = 1 // only visit every 5 pixels
      var canvas = document.createElement('canvas');
      var context = canvas.getContext && canvas.getContext('2d');
      var data;
      var i = -4;
      var rgb = {
        r: 0,
        g: 0,
        b: 0
      };
      // var count = 0;
      var rgbs = {};
      var rgbStr, averageRGB;
      var level = 100;

      if (!context) {
        return defaultRGB;
      }

      var height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
      var width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

      context.drawImage(img, 0, 0);
      try {
        data = context.getImageData(0, 0, width, height);
      } catch (e) {
        /* security error, img on diff domain */
        return defaultRGB;
      }

      var length = data.data.length;

      while ((i += blockSize * 4) < length) {
        rgb.r = data.data[i];
        rgb.g = data.data[i + 1];
        rgb.b = data.data[i + 2];
        var luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
        averageRGB = (rgb.r + rgb.g + rgb.b) / 3;
        if ( luminance < 30 || luminance > 200 // ||
           // ((averageRGB - level <= rgb.r && averageRGB + level >= rgb.r) &&
           // (averageRGB - level <= rgb.g && averageRGB + level >= rgb.g) &&
           // (averageRGB - level <= rgb.b && averageRGB + level >= rgb.b))
        ) {
          continue;
        }
        // ++count;
        // rgb.r += data.data[i];
        // rgb.g += data.data[i + 1];
        // rgb.b += data.data[i + 2];
        rgbStr = rgb.r + ',' + rgb.g + ',' + rgb.b;
        rgbs[rgbStr] = (rgbs[rgbStr] || 0) + 1;
      }

      // ~~ used to floor values
      // rgb.r = ~~(rgb.r / count);
      // rgb.g = ~~(rgb.g / count);
      // rgb.b = ~~(rgb.b / count);

      // log('rgbs: ', rgbs);

      var rgbKeys = Object.keys(rgbs);
      if (rgbKeys.length > 0) {
        var rgbCount = Math.max.apply(Math, rgbKeys.map(function (rgb) { return rgbs[rgb]; }));
        var rgbKeysMax = rgbKeys.filter((rgb) => {
          return rgbs[rgb] === rgbCount;
        });

        var rgbArray = rgbKeysMax[Math.floor(Math.random() * rgbKeysMax.length)].split(',');
        rgb = {
          r: Number(rgbArray[0]),
          g: Number(rgbArray[1]),
          b: Number(rgbArray[2])
        };
        log('rgbKeysMax: ', rgbKeysMax);
        log('count: ', rgbCount);
        log('rgb: ', rgb);

        callback(rgb);
      }
    });
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function changeThemeColor(themeColor) {
    var metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    if (!metaThemeColor.dataset.changeThemeColor) {
      metaThemeColor.setAttribute("content", themeColor);
    }
    log('metaThemeColor', metaThemeColor);
    log('https://www.google.com/search?q=' + themeColor.replace('#', '%23'));
  }

  // function changeThemeColor(themeColor) {
  //   var metaThemeColor = document.querySelector('meta[name="theme-color"]');
  //   log('metaThemeColor', metaThemeColor);
  //   if (!metaThemeColor) {
  //     metaThemeColor.setAttribute("content", themeColor);
  //   }
  // }

  function setMetaThemeColor() {
    var faviconUrl = getFavicon();
    log('faviconUrl', faviconUrl);

    if (faviconUrl) {
      var colors = GM_getValue('colors', {});
      log('colors', colors);
      if (isResetValue && colors.version !== GM_info.script.version) {
         colors = {};
         colors.version = GM_info.script.version;
         GM_deleteValue('colors');
         log('GM_deleteValue');
      }

      if (colors[faviconUrl] && !debug) {
        changeThemeColor(colors[faviconUrl]);
      } else {
        getDataImage(faviconUrl, function (data) {
          getAverageRGB(data, function (rgbColor) {
            var hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
            changeThemeColor(hexColor);
            colors[faviconUrl] = hexColor;
            GM_setValue('colors', colors);
          });
        });
      }
    }
  }

  setMetaThemeColor();
})();
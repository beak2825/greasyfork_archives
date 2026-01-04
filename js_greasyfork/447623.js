// ==UserScript==
// @name           Webp To Jpeg
// @description    Convert Webp image to Jpeg image link(need disable cache)
// @namespace https://greasyfork.org/users/3920
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20241009104328
// @downloadURL https://update.greasyfork.org/scripts/447623/Webp%20To%20Jpeg.user.js
// @updateURL https://update.greasyfork.org/scripts/447623/Webp%20To%20Jpeg.meta.js
// ==/UserScript==
 
(function() {
  async function start() {
    Get = function (url, options = {}) {
      return fetch(url, options)
      .then(res => res.blob())
      .then(blob => {
        return URL.createObjectURL(blob);
      });
    };
    let img_header={'Accept':'image/jpeg,image/apng'};
    for (let image of document.images) {
      let url = image.src;

      if (/\?/.test(url)) url += '&';
      else url += '?';
      url += `_=${new Date().getTime()}`;

      image.src = await Get(url, {method:'GET', headers:img_header});
      //console.log(image);

      let element = document.createElement('a');
      element.setAttribute('href', url);
      element.setAttribute('download', '');
      document.body.appendChild(element);
      element.click();
    }
    //let url = document.location.href;
    //await Get(url, {method:'GET', headers:img_header});
    //window.location.href = url;
  }

  async function startDataUrl() {
    GetDataUrl = function (url, options = {}) {
      return fetch(url, options)
      .then(res => res.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }))
      .then(dataUrl => {
        return dataUrl;
      });
    };
    let img_header={'Accept':'image/jpeg,image/apng'};
    for (let image of document.images) {
      let url = image.src;
 
      if (/\?/.test(url)) url += '&';
      else url += '?';
      url += `_=${new Date().getTime()}`;
 
      let name = (url.match(/\/([^\/\?]+)(?:\?|$)/) ? RegExp.$1 : '');
      let src = await GetDataUrl(url, {method:'GET', headers:img_header});
      //console.log(src);

      let element = document.createElement('a');
      element.setAttribute('href', src);
      element.setAttribute('download', name);
      //element.setAttribute('target', '_blank');
      document.body.appendChild(element);
      element.click();
    }
  }

  if (/musicraynmall/.test(document.location.href)) {
    startDataUrl();
  } else {
    start();
  }
})();
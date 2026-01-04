// ==UserScript==
// @name        Wallhaven - Hide AI art from main page
// @match       https://wallhaven.cc/
// @grant       GM.getValue
// @grant       GM_fetch
// @grant       GM.setValue
// @run-at      document-end
// @version     1.0.1
// @author      TheQwertiest
// @description Hide wallpapers with AI tag from the main page
// @license MIT
// @namespace https://greasyfork.org/users/1302515
// @downloadURL https://update.greasyfork.org/scripts/495153/Wallhaven%20-%20Hide%20AI%20art%20from%20main%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/495153/Wallhaven%20-%20Hide%20AI%20art%20from%20main%20page.meta.js
// ==/UserScript==


function removeAiArt(apiKey) {
  for(const cl of ['sm-thumb', 'lg-thumb']) {
    let elements = document.getElementsByClassName(cl);
    for (let el of elements) {
      const image_url = el.getElementsByTagName('a')[0].href;
      const image_id = image_url.split('/').slice(-1);

      GM_fetch(`https://wallhaven.cc/api/v1/w/${image_id}?apikey=${apiKey}`, {
        method: 'GET'
      }).then(function(response){
        let responseJson = JSON.parse(response.text);
        const aiTag = responseJson.data.tags.find((tag) => tag.id === 133451);
        if (aiTag) {
          this.style.display = 'none';
        }
      }.bind(el));
    }
  }
}

async function getApiKey() {
  let apiKey = await GM.getValue('API_KEY', '');
  if (!apiKey) {
    apiKey = prompt('This UserScript requires Wallhaven API key.\nYou can get it from your account page - https://wallhaven.cc/settings/account');
    if (apiKey) {
      await GM.setValue('API_KEY', apiKey);
    }
  }

  return apiKey;
}

(async() => {
  let apiKey = await getApiKey();
  if (apiKey) {
    removeAiArt(apiKey);
  }
})();
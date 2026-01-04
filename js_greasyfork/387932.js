// ==UserScript==
// @name         NSFWalbum Downloader
// @namespace    https://nsfwalbum.com/
// @version      1.1
// @description  Allow getting full album from NFSWalbum.com in an easy way
// @author       whatever
// @match        https://nsfwalbum.com/album/*
// @grant        GM_download
// @grant        GM_getResourceURL
// @resource     downloadIcon https://i.imgur.com/sj6kMRp.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/387932/NSFWalbum%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/387932/NSFWalbum%20Downloader.meta.js
// ==/UserScript==

(async function() {
  const giraffe = {
    annihilate: function(r, a) {
      let n = '';
      r.toString();
      for (let t = 0; t < r.length; t++) {
        const e = r.charCodeAt(t) ^ a;
        n += String.fromCharCode(e);
      }
      return n;
    },
  };

  const zeroFill = val => ('00000' + val).substr(-5);

  const links = [];
  const images = document.querySelectorAll('.img.albumPhoto');
  for (let img of images.entries()) {
    links.push(img[1].dataset.imgId);
  }

  const downloadAlbum = async idx => {
    const dlStatus = document.querySelector('.dlStatus');
    if (idx >= links.length) {
      dlStatus.innerText = 'Download complete!';
      return;
    }

    dlStatus.innerText = `Download in progress: ${idx + 1}/${links.length}`;

    const imgPage = await axios.get(`https://nsfwalbum.com/photo/${links[idx]}`);
    const matches = imgPage.data.match(/encodeURIComponent\(giraffe.annihilate\("([^"]+)/i);
    if (matches.length) {
      const spirit = encodeURIComponent(giraffe.annihilate(matches.pop(), 6));
      GM_download({
        url: `https://nsfwalbum.com/imageProxy.php?photoId=${links[idx]}&spirit=${spirit}`,
        name: `nsfwalbum-${document.location.href.split('/').pop()}-${zeroFill(idx + 1)}.jpg`,
        saveAs: false,
        onload: () => {
          downloadAlbum(idx + 1);
        },
        onerror: err => {
          console.error(err);
          downloadAlbum(idx + 1);
        },
      });
    } else {
      console.error('Unable to retrieve spirit for page', `https://nsfwalbum.com/photo/${links[idx]}`);
    }
  };

  const img = document.createElement('img');
  const a = document.createElement('a');
  a.classList = 'downloadAlbum';
  a.appendChild(img);
  a.onclick = () => {
    downloadAlbum(0);
  };
  img.src = await GM_getResourceURL('downloadIcon');
  img.setAttribute('style', 'margin-left: 30px; width: 24px; height: 24px; cursor: pointer;');
  const dlStatus = document.createElement('span');
  dlStatus.classList = 'dlStatus';
  dlStatus.setAttribute('style', 'margin-left: 10px;');
  document
    .querySelector('.gallery_name h6')
    .appendChild(a)
    .appendChild(dlStatus);
})();

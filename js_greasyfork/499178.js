// ==UserScript==
// @name         R18.dev to plex
// @namespace    http://tampermonkey.net/
// @version      2024-06-28
// @description  gogo
// @author       Ange
// @match        https://r18.dev/videos/vod/movies/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=r18.dev
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/499178/R18dev%20to%20plex.user.js
// @updateURL https://update.greasyfork.org/scripts/499178/R18dev%20to%20plex.meta.js
// ==/UserScript==

let isLoading = false;

const fetchResponse = (url, options = {}) => {
  const requestOptions = {
    headers: { "Cache-Control": "no-cache" },
    ...options,
    url,
    method: options.method || 'GET',
    responseType: options.responseType || 'document',
  };

  if (options.data) requestOptions.data = options.data;

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...requestOptions,
      onload: res => resolve(res),
      onerror: err => reject(err),
    });
  });
};

const getImage = async (url, options = {}) => {
  const { response } = await fetchResponse(url, { ...options, responseType: 'arraybuffer' });
   return response;
};

const cropImageToPoster = async (url) => {
  const image = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageArrBuffer = await getImage(url);
  const imageBlob = new Blob([imageArrBuffer]);

  image.src = URL.createObjectURL(imageBlob);
  image.crossOrigin = 'Anonymous';

  return new Promise((resolve) => {
    image.addEventListener('load', async () => {
      const ratio = 0.703153988;
      const { height, width } = image;

      if (height / width === 1) {
        const originalImage = await getImage(url);
        return resolve(originalImage);
      }

      const targetWidth = height * ratio;
      const leftStart = width - targetWidth;

      canvas.width = targetWidth;
      canvas.height = height;

      ctx.drawImage(
        image,
        leftStart,
        0,
        targetWidth,
        height,
        0,
        0,
        targetWidth,
        height,
      );

      canvas.toBlob(
        async (blob) => {
          // Hack to fix JSZIp from identifying images as undefined
          const response = new Response(blob);
          const buffer = await response.arrayBuffer();
          resolve(buffer);
        },
        'image/jpeg',
        0.95,
      );
    });
  });
};

const createXML = movie => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
<movie>
  <title>${movie.title}</title>
  <originaltitle>${movie.title}</originaltitle>
  <plot>${movie.comment || ''}</plot>
  <set>${movie.series || ''}</set>
  <year>${new Date(movie.releaseDate).getFullYear()}</year>
  <trailer>${movie.sample || ''}</trailer>
  <runtime>${movie.runtime}</runtime>
  <releasedate>${movie.releaseDate}</releasedate>
  <studio>${movie.studio || ''}</studio>
  <thumb>${movie.poster}</thumb>
  <fanart>
    <thumb>${movie.poster}</thumb>
  </fanart>
  <mpaa>XXX</mpaa>
  <id>${movie.dvdId || movie.contentId}</id>
  <fileinfo>
    <streamdetails>
      <audio>
        <language>${movie.languages || 'Japanese'}</language>
      </audio>
    </streamdetails>
  </fileinfo>
  ${movie.genre
    .map((tag) => `<genre>${tag}</genre>`)
    .toString()
    .replace(/,/g, '\n  ')}
  ${
    movie.actress.length === 0
      ? `<actor>
    <name></name>
    <role></role>
    <thumb></thumb>
  </actor>`
      : movie.actress
          .map(
            (actress) => `<actor>
    <name>${actress.name}</name>
    <role></role>
    <thumb>${actress.photo || ''}</thumb>
  </actor>`,
          )
          .toString()
          .replace(/,/g, '\n  ')
  }
</movie>`;
};

const getPosterBlob = async (fanart) => {
  if (fanart.includes('awsimgsrc')) {
    const posterUrl = fanart.replace('pl.jpg', 'ps.jpg');
    const highResPoster = await getImage(posterUrl);
    const bitmap = await createImageBitmap(new Blob([highResPoster]));
    if (bitmap.height > 500) return highResPoster;
  }
  return cropImageToPoster(fanart);
};

const getFanart = (fanart, cid) => {
  if (fanart.includes('digital/video')) return `https://awsimgsrc.dmm.com/dig/digital/video/${cid}/${cid}pl.jpg`;
  if (fanart.includes('mono/movie')) return `https://awsimgsrc.dmm.com/dig/mono/movie/${cid}/${cid}pl.jpg`;
  return fanart;
}

const jsonLink = document.querySelector('#download-json');
const downloadPlexMetadataLink = document.createElement('a');
downloadPlexMetadataLink.outerHTML = `<li>${downloadPlexMetadataLink.outerHTML}</li>`
downloadPlexMetadataLink.innerText = 'ðŸ“¼ Download Plex metadata';
downloadPlexMetadataLink.setAttribute('href', '#download-plex');

const downloadPlexData = async () => {
  const { response: json } = await fetchResponse(jsonLink.href, { responseType: 'json' });
  const fanartSrc = getFanart(json.jacket_full_url, json.content_id);
  const [fanart, poster] = await Promise.all([
    getImage(fanartSrc),
    getPosterBlob(fanartSrc),
  ]);
  const movie = {
    title: json.dvd_id || json.content_id,
    dvdId: json.dvd_id || json.content_id,
    contentId: json.content_id,
    releaseDate: json.release_date,
    studio: json.maker_name_en || json.maker_name_ja,
    poster: json.jacket_full_url,
    runtime: json.runtime_mins,
    sample: json.sample_url || '',
    actress: json.actresses.map(ac => ({ name: ac.name_romaji, photo: `https://pics.dmm.co.jp/mono/actjpgs/${ac.image_url}` })),
    genre: json.categories.map(tag => tag.name_en),
    series: json.series_name_en_is_machine_translation ? '' : json?.series_name_en?.replaceAll('\n', ' ') || '',
  };

  const xmlBlob = createXML(movie);
  const zip = new JSZip();
  const folder = zip.folder(`${movie.dvdId}`);
  folder.file('movie.nfo', xmlBlob);
  folder.file('poster.jpg', poster);
  folder.file('fanart.jpg', fanart); //f
  const content = await zip.generateAsync({ type:'blob' })
  saveAs(content, `${movie.dvdId}.zip`);
};

downloadPlexMetadataLink.addEventListener('click', async e => {
  e.preventDefault();
  if (isLoading) return;
  try {
    isLoading = true;
    await downloadPlexData();
  } catch (e) {
    console.error(e);
  } finally {
    isLoading = false;
  }
});

jsonLink.closest('li').after(downloadPlexMetadataLink);
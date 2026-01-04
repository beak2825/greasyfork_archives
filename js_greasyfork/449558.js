// ==UserScript==
// @name        MGS: Download metadata
// @namespace   Violentmonkey Scripts
// @match       https://www.mgstage.com/product/product_detail/*
// @match       https://www.mgstage.com/monthly/*
// @version     0.3
// @author      Angelium
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @resource    TOAST_CSS https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.6.1/toastify.min.css
// @require     https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.6.1/toastify.min.js
// @inject-into content
// @description 21/03/2022, 10:10:47 am
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449558/MGS%3A%20Download%20metadata.user.js
// @updateURL https://update.greasyfork.org/scripts/449558/MGS%3A%20Download%20metadata.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const actressList = {
  'Airi Suzumura': 'https://pics.r18.com/mono/actjpgs/medium/suzumura_airi.jpg',
};

const translations = {
  label: {
    '出演': 'cast',
    'メーカー': 'studio',
    '収録時間': 'runtime',
    '品番': 'dvdId',
    '配信開始日': 'releaseDate',
    'シリーズ': 'series',
    'レーベル': 'label',
    'ジャンル': 'genre',
    '対応デバイス': 'platform',
    '評価': 'ratings',
    '★お気に入り登録数': 'favourites',
    'サンプル再生回数': 'views',
    '商品発売日': 'productReleaseDate',
  },
  value: {
    'インディ': 'Inda',
    '熟蜜のヒミツ': 'Jukumitsu no Himitsu',
    'ファーストスター': 'First Star',
    '素人おかしや': 'Amateur Candy Store',
    'みなみ工房': 'Minami Kitchen',
    'マジックミラー号ハードボイルド': 'Magic Mirror Number - Hard Boiled',
    'SODクリエイト': 'SOD Create',
    'スコッチ': 'Scotch',
    'シロウト急便': 'Amateur Express Delivery',
    '舞ワイフ': 'My Wife',
    'ビッチガール': 'Bitch Girl',
    '素人CLOVER': 'Amateur CLOVER',
    'スチュワーデス・CA': 'Stewardess',
    'クマネコ本舗': 'Kumaneko Flagship Store',
    'ハメドリネットワーク2nd': 'Fuck Photo Rinet Work Second Edition',
    'E★ナンパDX': 'E-Flirting DX',
    'はめちゃん。':'The Fuck Channel',
    'しろーとLOVETube': 'Amateur LOVETube',
    'まんまんランド': 'Manman Land',
    'いんすた': 'Insta',
    'E★人妻DX': 'E Married Women DX',
    'しろうとちゃん。': 'Shiroto-chan',
    'フライデー': 'Friday',
    '投稿マーケット素人イッてQ': 'Amateur\'s Road',
    '素人羞恥娘。': 'Amateur Shame Girl',
    'マキャベリ': 'Machiavelli',
    'しろうとまんまん': 'Amateur Pussies',
    'ときわ映像': 'Tokiwa Video',
    '#素人しか勝たん': '#Onlyamateurswin',
    '俺の素人-Z-': 'My Amateur - Z -',
    '素人ホイホイZ': 'Amateur Bait Z',
    'プレステージプレミアム(PRESTIGE PREMIUM)': 'PRESTIGE PREMIUM',
    'ナンパTV': 'Nanpa TV',
    '黒船': 'Kurofune',
    '黒猫': 'Kurofune',
    'プレステージ': 'Prestige',
    'J●調査隊 チームK': 'Team K',
    'J●調査隊 teamK': 'Team K',
    'シロウトTV': 'Amateur TV',
    'ラグジュTV': 'Luxury TV',
    'ドキュメンTV': 'Document TV',
    'メガネ': 'Glasses',
    '俺の素人': 'My Amateur',
    'ドキュメントdeハメハメ': 'Document de Hamehame',
    'マーキュリー': 'MERCURY',
    'シロウトTV': 'Amateur TV',
    'アマTV': 'Ama TV',
  },
};

// Map for categories/tags/genre
const CUSTOM_CATEGORIES = {
  '美白': 'Fair-Skinned',
  '痴漢': 'Molester',
  '寝取り･寝取られ': 'Cheating Wife',
  '三十路': 'Thirties',
  '美熟女': 'Mature Women',
  'ビッチガール': 'Bitch Girl',
  'アクメ': 'Orgasm',
  'おっぱいちゃん': 'Titty Girl',
  '放尿・失禁': 'Urination',
  'ショートヘアー': 'Short Hair',
  'キャバ嬢・風俗嬢': 'Club Hostess & Sex Worker',
  '微乳・貧乳': 'Small Tits',
  'DVD未発売': 'DVD not released',
  '配信専用': 'Digital Only',
  'オモチャ': 'Sex Toys',
  '美脚': 'Beautiful Legs',
  '清楚': 'Neat and Clean',
  '美尻': 'Beautiful Ass',
  '初撮り': 'First Shot',
  '配信専用素人': 'Digital Only Amateur',
  '童顔': 'Baby Face',
  '手マン': 'Fingering',
  'Fカップ': 'F-Cup',
  'Gカップ': 'G-Cup',
  'Eカップ': 'E-Cup',
  'Dカップ': 'D-Cup',
  '高身長グラマラス': 'Tall and Glamorous',
  '泥酔': 'Drunk',
  '口内発射': 'Oral Ejaculation',
  '着物・浴衣': 'Kimono/Yukata',
  '寝取り・寝取られ': 'Cheating Wife',
  '風俗': 'Sex Worker',
  'PICKUP素人': 'Pickup Amateur',
  'メガネ': 'Glasses',
  '多人数': 'Multi-person',
  '人妻': 'Married Woman',
  'MGSだけのおまけ映像付き': 'Bonus content',
  'スケベな淫乱淑女': 'Slutty Women',
  '爆乳': 'Big Tits',
  '羞恥・辱め': 'Shame',
  '若妻': 'Young Wife',
  'フルハイビジョン\\(FHD\\)': 'Hi-Def', //escape for regex
  'バック': 'Doggystyle',
  '性教育': 'Sex Education',
  '色白': 'Light Skin',
  '可愛い': 'Cute',
  'アイドル': 'Idol & Celebrity',
  '暴発': 'Accidental',
  '流出': 'Leaked',
};

const my_css = GM_getResourceText("TOAST_CSS");
GM_addStyle(my_css);

const showToast = (text, destination) => Toastify({
  text,
  duration: 3000,
  destination,
  gravity: "top",
  position: "left",
  newWindow: true,
  style: {
    background: "#543fd7",
  },
}).showToast();

const parseDescriptionValues = async (label, value, html) => {
  if (label === 'genre') {
    const genres = await getGenre(html);
    return genres.map(genre => genre.label);
  }
  if (label === 'releaseDate') return value.replace(/\//g, '-');
  if (label === 'runtime') return Number(value.replace('min', ''));
  return translations.value[value] || value;
};

const createSelectActressComponent = () => {
  const ACTRESS_SELECT = createElement('select', { multiple: true, class: 'actress-select' });
  const option = createElement('option', { selected: true, value: '', innerHTML: 'None' });

  ACTRESS_SELECT.appendChild(option);

  Object.keys(actressList).forEach(actress => {
    const option = createElement('option', { value: actress, innerHTML: actress });
    ACTRESS_SELECT.appendChild(option);
  });

  return ACTRESS_SELECT;
};

const getActressesFromSelect = (actressSelectElement) => {
  return [...actressSelectElement.options]
    .filter(option => option.selected && !!option.value)
    .map(option => ({ name: option.value, photo: actressList[option.value] }));
};

const getProductImages = async html => {
  const getHQPosterUrl = imageUrl => {
    const [, params, imageName] = /(images\/[a-z0-9]+\/[a-z0-9]+\/[0-9a-z]+)\/[a-z0-9]{2}_[a-z0-9]{1,2}_([a-z-0-9.]+)/.exec(imageUrl);
    return `https://image.mgstage.com/${params}/pf_e_${imageName}`;
  };
  const poster = { type: 'poster', url: getHQPosterUrl(qs('.enlarge_image', html).src) };
  const fanart = { type: 'fanart', url: qs('#EnlargeImage', html).href };
  const imagePromises = [poster, fanart].map(async imageObj => {
    const response = await fetch(imageObj.url);
    imageObj.image = await response.arrayBuffer();
    return imageObj;
  });

  return Promise.all(imagePromises);
};

const getProductDetails = html => {
  const getTextAndTrim = child => child.innerText.trim().replace('：', '').replace(/[\n\s]+/g, ' ');
  const videoLabelAndValue = qsa('.detail_data table tbody tr', html).map(tr => [...tr.children].map(getTextAndTrim));
  const promises = videoLabelAndValue.map(async ([label, value]) => {
    const engLabel = translations.label[label] ?? label;
    const engValue = await parseDescriptionValues(engLabel, value, html);
    return [engLabel, engValue];
  });

  return Promise.all(promises);
};

const createProductObject = (productDetails, productImages, actresses) => {
  const productDetailsAsObject = productDetails.reduce((acc, [label, value]) => {
    acc[label] = value;
    return acc;
  }, {});

  productDetailsAsObject.title = productDetailsAsObject.dvdId;
  productDetailsAsObject.description = '';
  productDetailsAsObject.actress = actresses;
  productDetailsAsObject.series = productDetailsAsObject.series;
  productImages.forEach(imageObj => productDetailsAsObject[imageObj.type] = imageObj.url);
  return { ...productDetailsAsObject, ...productImages };
};

const createZip = async (metadata, xml, productImages) => {
  try {
    const zip = new JSZip();
    const folder = zip.folder(metadata.dvdId);

    folder.file('movie.nfo', xml);

    productImages.forEach(imageObj => folder.file(`${imageObj.type}.jpg`, imageObj.image));

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'metadata.zip');

    const { actress, genre, studio } = metadata;
    console.log({ actress, genre: genre.join(', '), studio });
  } catch(error) {
    console.log(error);
  }
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
  ${movie.actress.length === 0 ? `<actor>
    <name></name>
    <role></role>
    <thumb></thumb>
  </actor>` : movie.actress.map((actress) => `<actor>
    <name>${actress.name}</name>
    <role></role>
    <thumb>${actress.photo || ''}</thumb>
  </actor>`).toString().replace(/,/g, '\n  ')}
  <director>${movie.director || ''}</director>
</movie>`;
};

const startProductScrape = async (id, actresses) => {
  const html = await getHTML(`https://www.mgstage.com/product/product_detail/${id}`);
  const productImages = await getProductImages(html);
  const productDetails = await getProductDetails(html);
  const metadata = createProductObject(productDetails, productImages, actresses);
  const xml = createXML(metadata);
  createZip(metadata, xml, productImages);
};

const getGenre = async html => {
  const getLabel = ({ innerText: txt }) => CUSTOM_CATEGORIES[txt.trim()] || txt.trim();
  return qsa('.detail_data a[href*="genre"]', html)
    .map(a => ({ label: getLabel(a), url: a.href }))
    .filter(genre => genre.label);
};

const qs = (q, el = document) => el?.querySelector(q);
const qsa = (q, el = document) => [...el?.querySelectorAll(q)];

const createElement = (type, options = {}) => {
  const element = document.createElement(type);

  Object.entries(options).forEach(([key, value]) => {
    if (key === "class") return element.classList.add(value);
    if (key === "innerHTML") return element.innerHTML = value;
    if (key === "text") return element.textContent = value;
    if (key === "addEventListener") return element.addEventListener(...value);
    if (key === "dataset") return Object.entries(value).forEach(([dataKey, dataValue]) => element.dataset[dataKey] = dataValue);
    element.setAttribute(key, value);
  });

  return element;
};

const getHTML = async (url, options = {}) => {
  const response = await fetch(url, options);
  const text = await response.text();
  return new DOMParser().parseFromString(text, 'text/html');
};

const initialize = () => {
  const DETAIL_DATA = qs('.detail_data');
  const WRAPPER = createElement('div', { style: 'margin-bottom: 20px' });
  const SELECT_ACTRESS = createSelectActressComponent();
  SELECT_ACTRESS.setAttribute('style', 'display: block;');

  const scrapeProduct = () => {
    try {
      const id = /product_detail\/([0-9A-Z-]+)/gi.exec(window.location.pathname)[1];
      const actresses = getActressesFromSelect(SELECT_ACTRESS);
      showToast(`Downloading ${id}...`);
      startProductScrape(id, actresses);
    } catch (e) {
      console.error(e);
    }
  };

  const SCRAPE_BUTTON = createElement('button', {
    text: 'Download metadata',
    style: 'display: block; margin-top: 1rem;',
    addEventListener: ["click", scrapeProduct],
  });

  WRAPPER.append(SELECT_ACTRESS);
  SELECT_ACTRESS.after(SCRAPE_BUTTON);
  DETAIL_DATA.after(WRAPPER);
};

initialize();

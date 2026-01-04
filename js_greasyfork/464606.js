// ==UserScript==
// @name         buyNow!
// @namespace    http://2chan.net/
// @version      0.9.5
// @description  ふたばちゃんねる、めぶきちゃんねるのスレッド上で貼られた特定のECサイトのURLからタイトルとあれば価格と画像を取得する
// @author       ame-chan
// @match        http://*.2chan.net/b/res/*
// @match        https://*.2chan.net/b/res/*
// @match        https://kako.futakuro.com/futa/*
// @match        https://tsumanne.net/si/data/*
// @match        https://mebuki.moe/app*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @grant        GM_xmlhttpRequest
// @connect      amazon.co.jp
// @connect      www.amazon.co.jp
// @connect      amzn.to
// @connect      amzn.asia
// @connect      media-amazon.com
// @connect      m.media-amazon.com
// @connect      dlsite.com
// @connect      img.dlsite.jp
// @connect      bookwalker.jp
// @connect      c.bookwalker.jp
// @connect      store.steampowered.com
// @connect      cdn.akamai.steamstatic.com
// @connect      cdn.cloudflare.steamstatic.com
// @connect      store.cloudflare.steamstatic.com
// @connect      youtube.com
// @connect      youtu.be
// @connect      nintendo.com
// @connect      store-jp.nintendo.com
// @connect      dmm.co.jp
// @connect      www.dmm.co.jp
// @connect      dlsoft.dmm.co.jp
// @connect      pics.dmm.co.jp
// @connect      doujin-assets.dmm.co.jp
// @run-at       document-idle
// @require      https://update.greasyfork.org/scripts/552225/1688437/mebuki-page-state.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464606/buyNow%21.user.js
// @updateURL https://update.greasyfork.org/scripts/464606/buyNow%21.meta.js
// ==/UserScript==
(async function () {
  'use strict';
  const WHITE_LIST_DOMAINS = [
    'amazon.co.jp',
    'amzn.to',
    'amzn.asia',
    'dlsite.com',
    'bookwalker.jp',
    'store.steampowered.com',
    'youtube.com',
    'youtu.be',
    'store-jp.nintendo.com',
    'dlsoft.dmm.co.jp',
    'www.dmm.co.jp',
  ];
  const WHITE_LIST_SELECTORS = (() => WHITE_LIST_DOMAINS.map((domain) => `a[href*="${domain}"]`).join(','))();
  const convertHostname = (path) => new URL(path).hostname;
  const isAmazon = (path) => /^(www\.)?amazon.co.jp|amzn\.to|amzn\.asia$/.test(convertHostname(path));
  const isDLsite = (path) => /^(www\.)?dlsite\.com$/.test(convertHostname(path));
  const isBookwalker = (path) => /^(www\.)?bookwalker.jp$/.test(convertHostname(path));
  const isSteam = (path) => /^store\.steampowered\.com$/.test(convertHostname(path));
  const isYouTube = (path) => /^youtu\.be|(www\.)?youtube.com$/.test(convertHostname(path));
  const isNintendoStore = (path) => /^store-jp\.nintendo\.com$/.test(convertHostname(path));
  const isFanzaDoujin = (path) => /^(www\.)?dmm\.co\.jp$/.test(convertHostname(path));
  const isFanzaDlsoft = (path) => /^dlsoft\.dmm\.co\.jp$/.test(convertHostname(path));
  const isProductPage = (url) =>
    /^https?:\/\/(?:www\.)?amazon(.+?)\/(?:exec\/obidos\/ASIN|gp\/product|gp\/aw\/d|o\/ASIN|(?:.+?\/)?dp|d)\/[A-Z0-9]{10}/.test(
      url,
    ) ||
    /^https?:\/\/amzn.(asia|to)\//.test(url) ||
    /^https?:\/\/(www\.)?dlsite\.com\/.+?\/[A-Z0-9]{8,}(\.html)?/.test(url) ||
    /^https?:\/\/(www\.)?bookwalker\.jp\/[a-z0-9]{10}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}/.test(url) ||
    /^https?:\/\/(www\.)?bookwalker\.jp\/(series|tag)\/[0-9]+\//.test(url) ||
    /^https?:\/\/store.steampowered.com\/(agecheck\/)?app\/\d+/.test(url) ||
    /^https?:\/\/(youtu\.be\/|((www|m)\.)?youtube.com\/(watch\?v=|live\/))\w+/.test(url) ||
    /^https?:\/\/store-jp\.nintendo\.com\/(list\/software\/(D)?[0-9]+.html|item\/software\/(D)?[0-9]+)/.test(url) ||
    /^https?:\/\/dlsoft\.dmm\.co\.jp\/(list|detail)\/.+?/.test(url) ||
    /^https?:\/\/(www\.)?dmm\.co\.jp\/dc\/doujin\/.+?/.test(url);
  const isMebuki = () => location.hostname === 'mebuki.moe';
  const getBrandName = (url) => {
    if (isAmazon(url)) {
      return 'amazon';
    } else if (isDLsite(url)) {
      return 'dlsite';
    } else if (isBookwalker(url)) {
      return 'bookwalker';
    } else if (isSteam(url)) {
      return 'steam';
    } else if (isYouTube(url)) {
      return 'youtube';
    } else if (isNintendoStore(url)) {
      return 'nintendo';
    } else if (isFanzaDlsoft(url)) {
      return 'fanzaDlsoft';
    } else if (isFanzaDoujin(url)) {
      return 'fanzaDoujin';
    }
    return '';
  };
  const getOgpImage = (targetDocument) => targetDocument.querySelector('meta[property="og:image"]')?.content || '';
  const getSelectorConditions = {
    amazon: {
      price: (targetDocument) => {
        const priceRange = () => {
          const rangeElm = targetDocument.querySelector('.a-price-range');
          if (!rangeElm) return 0;
          rangeElm.querySelectorAll('.a-offscreen').forEach((el) => el.remove());
          return rangeElm.textContent?.replace(/[\s]+/g, '');
        };
        try {
          const price =
            targetDocument.querySelector('#twister-plus-price-data-price')?.value ||
            targetDocument.querySelector('#kindle-price')?.textContent?.replace(/[\s￥,]+/g, '') ||
            targetDocument.querySelector('[name="displayedPrice"]')?.value ||
            targetDocument.querySelector('.a-price-whole')?.textContent?.replace(/[\s￥,]+/g, '');
          return Math.round(Number(price)) || priceRange() || 0;
        } catch (e) {
          return 0;
        }
      },
      image: (targetDocument) =>
        targetDocument.querySelector('#landingImage')?.src ||
        targetDocument.querySelector('.unrolledScrollBox li:first-child img')?.src ||
        targetDocument.querySelector('[data-a-image-name]')?.src ||
        targetDocument.querySelector('#imgBlkFront')?.src,
      title: (targetDocument) =>
        targetDocument.querySelector('#productTitle')?.textContent ||
        targetDocument.querySelector('#title')?.textContent ||
        targetDocument.querySelector('#landingImage')?.alt ||
        targetDocument.querySelector('.unrolledScrollBox li:first-child img')?.alt ||
        targetDocument.querySelector('[data-a-image-name]')?.alt ||
        targetDocument.querySelector('#imgBlkFront')?.alt,
    },
    dlsite: {
      price: (targetDocument) => {
        try {
          const url = targetDocument.querySelector('meta[property="og:url"]')?.content;
          const productId = url.split('/').pop()?.replace('.html', '');
          const priceElm = targetDocument.querySelector(`[data-product_id="${productId}"][data-price]`);
          return parseInt(priceElm?.getAttribute('data-price') || '0', 10);
        } catch (e) {
          return 0;
        }
      },
      image: getOgpImage,
    },
    bookwalker: {
      price: (targetDocument) => {
        try {
          const price =
            Number(targetDocument.querySelector('.t-c-sales-price__value')?.textContent?.replace(/[^0-9]/g, '')) ||
            Number(
              targetDocument
                .querySelector('.m-tile-list .m-tile .m-book-item__price-num')
                ?.textContent?.replace(/,/g, ''),
            ) ||
            Number(targetDocument.querySelector('#jsprice')?.textContent?.replace(/[円,]/g, '')) ||
            Number(
              targetDocument
                .querySelector('.t-c-product-action-parts-price__value')
                ?.textContent?.replace(/[^0-9]/g, ''),
            );
          return Number.isInteger(price) && price > 0 ? price : 0;
        } catch (e) {
          return 0;
        }
      },
      image: (targetDocument) =>
        targetDocument.querySelector('.m-tile-list .m-tile img')?.getAttribute('data-original') ||
        getOgpImage(targetDocument),
    },
    steam: {
      price: (targetDocument) => {
        try {
          const elm =
            targetDocument.querySelector('.game_area_purchase_game_wrapper .game_purchase_price.price') ||
            targetDocument.querySelector('.game_area_purchase_game .game_purchase_price.price') ||
            targetDocument.querySelector('.game_area_purchase_game_wrapper .discount_final_price');
          const price = elm?.firstChild?.textContent?.replace(/[¥,\s\t\r\n]+/g, '');
          const isComingSoon = targetDocument.querySelector('.game_area_comingsoon');
          const isAgeCheck = targetDocument.querySelector('#app_agegate');
          const num = Number(price);
          if (isAgeCheck) {
            return 'ログインか年齢確認が必要です';
          } else if (isComingSoon) {
            return '近日登場';
          } else if (Number.isInteger(num) && num > 0) {
            return num;
          } else if (typeof price === 'string') {
            return price;
          }
          return 0;
        } catch (e) {
          return 0;
        }
      },
      image: getOgpImage,
    },
    nintendo: {
      price: (targetDocument) => {
        try {
          const mobifyData = targetDocument.querySelector('#mobify-data');
          if (mobifyData instanceof HTMLScriptElement && mobifyData.textContent) {
            const data = JSON.parse(mobifyData.textContent.trim());
            const queries = data?.__PRELOADED_STATE__?.__reactQuery?.queries ?? [];
            for (const query of queries) {
              const price = query?.state?.data?.price ?? 0;
              if (price > 0) {
                return price;
              }
            }
          }
          const priceElm = targetDocument.querySelector('.js-productMainRenderedPrice > span:first-of-type');
          const priceText = priceElm?.textContent?.replace(/,/g, '');
          const price = Number(priceText);
          if (Number.isInteger(price) && price > 0) {
            return price;
          } else if (typeof priceText === 'string') {
            return priceText;
          }
          return 0;
        } catch (e) {
          return 0;
        }
      },
      image: getOgpImage,
    },
    fanzaDlsoft: {
      price: (targetDocument) => {
        try {
          const priceElm =
            targetDocument.querySelector('.tx-bskt-price') ||
            targetDocument.querySelector('.sellingPrice__discountedPrice');
          const priceText = priceElm?.textContent?.replace(/[,円]/g, '');
          const price = Number(priceText);
          if (Number.isInteger(price) && price > 0) {
            return price;
          } else if (typeof priceText === 'string') {
            return priceText;
          }
          return 0;
        } catch (e) {
          return 0;
        }
      },
      image: (targetDocument) => {
        return getOgpImage(targetDocument) || targetDocument.querySelector('.d-item #list .img img')?.src || '';
      },
    },
    fanzaDoujin: {
      price: (targetDocument) => {
        try {
          const priceText =
            targetDocument.querySelector('p.priceList__main')?.textContent?.replace(/[,円]/g, '') ||
            targetDocument.querySelector('.purchase__btn')?.getAttribute('data-price');
          const price = Number(priceText);
          if (Number.isInteger(price) && price > 0) {
            return price;
          } else if (typeof priceText === 'string') {
            return priceText;
          }
          return 0;
        } catch (e) {
          return 0;
        }
      },
      image: (targetDocument) => {
        return (
          getOgpImage(targetDocument) || targetDocument.querySelector('.productList .tileListImg__tmb img')?.src || ''
        );
      },
    },
    // 画像のみ取得
    youtube: {
      price: () => 0,
      image: getOgpImage,
    },
  };
  const addedStyle = `<style id="userjs-buyNow-style">
  .userjs-title {
    display: flex;
    flex-direction: row;
    margin: 8px 0 16px;
    gap: 16px;
    padding: 16px;
    max-width: 800px;
    line-height: 1.6 !important;
    color: #ff3860 !important;
    background-color: #fff;
    border-radius: 4px;
  }
  .userjs-title-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
    line-height: 1.6 !important;
    color: #ff3860 !important;
  }
  .userjs-link {
    padding-right: 24px;
    background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2038%2038%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20stroke%3D%22%23000%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20transform%3D%22translate(1%201)%22%20stroke-width%3D%222%22%3E%3Ccircle%20stroke-opacity%3D%22.5%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2218%22%2F%3E%3Cpath%20d%3D%22M36%2018c0-9.94-8.06-18-18-18%22%3E%20%3CanimateTransform%20attributeName%3D%22transform%22%20type%3D%22rotate%22%20from%3D%220%2018%2018%22%20to%3D%22360%2018%2018%22%20dur%3D%221s%22%20repeatCount%3D%22indefinite%22%2F%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: right center;
  }
  .userjs-imageWrap {
    width: 150px;
  }
  .userjs-imageWrap.-center {
    text-align: center;
  }
  .userjs-imageWrap.-large {
    width: 600px;
  }
  .userjs-image {
    max-width: none !important;
    max-height: none !important;
    transition: all 0.2s ease-in-out;
    border-radius: 4px;
  }
  .userjs-price {
    display: block;
    color: #228b22 !important;
    font-weight: 700;
  }
  </style>`;
  if (!document.querySelector('#userjs-buyNow-style')) {
    document.head.insertAdjacentHTML('beforeend', addedStyle);
  }
  class FileReaderEx extends FileReader {
    constructor() {
      super();
    }
    #readAs(blob, ctx) {
      return new Promise((res, rej) => {
        super.addEventListener('load', ({ target }) => target?.result && res(target.result));
        super.addEventListener('error', ({ target }) => target?.error && rej(target.error));
        super[ctx](blob);
      });
    }
    readAsArrayBuffer(blob) {
      return this.#readAs(blob, 'readAsArrayBuffer');
    }
    readAsDataURL(blob) {
      return this.#readAs(blob, 'readAsDataURL');
    }
  }
  const fetchData = (url, responseType) =>
    new Promise((resolve) => {
      let options = {
        method: 'GET',
        url,
        timeout: 10000,
        onload: (result) => {
          if (result.status === 200 || result.status === 404) {
            return resolve(result.response);
          }
          return resolve(false);
        },
        onerror: () => resolve(false),
        ontimeout: () => resolve(false),
      };
      if (typeof responseType === 'string') {
        options = {
          ...options,
          responseType,
        };
      }
      GM_xmlhttpRequest(options);
    });
  const setFailedText = (linkElm) => {
    if (linkElm && linkElm instanceof HTMLAnchorElement) {
      linkElm.insertAdjacentHTML('afterend', '<span class="userjs-title">データ取得失敗</span>');
    }
  };
  const getPriceText = (price) => {
    let priceText = price;
    if (!price) return '';
    if (typeof price === 'number' && Number.isInteger(price) && price > 0) {
      priceText = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
      }).format(price);
    }
    return `<span class="userjs-price">${priceText}</span>`;
  };
  const setTitleText = ({ targetDocument, selectorCondition, linkElm, brandName }) => {
    let titleElm = targetDocument.querySelector('title');
    let title = titleElm?.textContent ?? '';
    // Amazonはtitleタグが無い場合がある
    if (title === '' && brandName === 'amazon') {
      title = selectorCondition.title(targetDocument);
    }
    if (!title) {
      setFailedText(linkElm);
      return false;
    }
    const price = selectorCondition.price(targetDocument);
    const priceText = getPriceText(price);
    const nextSibling = linkElm.nextElementSibling;
    if (nextSibling && nextSibling instanceof HTMLElement && nextSibling.tagName.toLowerCase() === 'br') {
      nextSibling.style.display = 'none';
    }
    if (title === 'サイトエラー') {
      const errorText = targetDocument.querySelector('#error_box')?.textContent;
      if (errorText) {
        title = errorText;
      }
    }
    if (linkElm && linkElm instanceof HTMLAnchorElement) {
      linkElm.insertAdjacentHTML(
        'afterend',
        `<div class="userjs-title">
        <span class="userjs-title-inner">${title}${priceText}</span>
      </div>`,
      );
      return true;
    }
    return false;
  };
  const setImageElm = async ({ imagePath, titleTextElm }) => {
    const imageMinSize = 150;
    const imageMaxSize = 600;
    const imageEventHandler = (e) => {
      const self = e.currentTarget;
      const div = self?.parentElement;
      if (!(self instanceof HTMLImageElement) || !div) return;
      if (self.width === imageMinSize) {
        div.classList.remove('-center');
        div.classList.add('-large');
        self.width = imageMaxSize;
      } else {
        div.classList.remove('-large');
        if (self.naturalWidth > imageMinSize) {
          self.width = imageMinSize;
        } else {
          div.classList.add('-center');
          self.width = self.naturalWidth;
        }
      }
    };
    const blob = await fetchData(imagePath, 'blob');
    const titleInnerElm = titleTextElm.querySelector('.userjs-title-inner');
    if (!blob || !titleInnerElm) return false;
    const dataUrl = await new FileReaderEx().readAsDataURL(blob);
    const div = document.createElement('div');
    div.classList.add('userjs-imageWrap');
    const img = document.createElement('img');
    img.addEventListener('load', () => {
      if (img.naturalWidth < imageMinSize) {
        img.width = img.naturalWidth;
      }
    });
    img.src = dataUrl;
    img.width = imageMinSize;
    img.classList.add('userjs-image');
    div.appendChild(img);
    img.addEventListener('click', imageEventHandler);
    titleInnerElm.insertAdjacentElement('beforebegin', div);
    return img;
  };
  const setLoading = (linkElm) => {
    const parentElm = linkElm.parentElement;
    if (parentElm instanceof HTMLFontElement || !isProductPage(linkElm.href)) {
      return;
    }
    linkElm.classList.add('userjs-link');
  };
  const removeLoading = (targetElm) => targetElm.classList.remove('userjs-link');
  // AgeCheck
  const isAgeCheck = (targetDocument, selector) => targetDocument.querySelector(selector) !== null;
  const getAgeCheckConfirmAdultPageHref = ({ targetDocument, selector, domain = '' }) => {
    const yesBtnLinkElm = targetDocument.querySelector(selector);
    if (yesBtnLinkElm instanceof HTMLAnchorElement) {
      return `${domain}${yesBtnLinkElm.getAttribute('href')}`;
    }
    return false;
  };
  const getAgeCheckPassedAdultDocument = async ({ targetDocument, linkElm, parser, selector, domain = '' }) => {
    const newHref = getAgeCheckConfirmAdultPageHref({
      targetDocument,
      selector,
      domain,
    });
    const htmlData = newHref && (await fetchData(newHref));
    if (!htmlData) {
      setFailedText(linkElm);
      removeLoading(linkElm);
      return false;
    }
    return parser.parseFromString(htmlData, 'text/html');
  };
  const getNewDocument = async ({ targetDocument, linkElm, parser, brandName }) => {
    const domain = brandName === 'amazon' ? 'https://www.amazon.co.jp' : '';
    const selector = (() => {
      switch (brandName) {
        case 'amazon':
          return '#black-curtain-yes-button a';
        case 'fanzaDlsoft':
        case 'fanzaDoujin':
          return '.ageCheck__link.ageCheck__link--r18';
        default:
          return false;
      }
    })();
    if (selector) {
      const newDocument = await getAgeCheckPassedAdultDocument({
        targetDocument,
        linkElm,
        parser,
        selector,
        domain,
      });
      if (newDocument) {
        return newDocument;
      }
    }
    return false;
  };
  // ふたクロで「新着レスに自動スクロール」にチェックが入っている場合画像差し込み後に下までスクロールさせる
  const scrollIfAutoScrollIsEnabled = () => {
    const checkboxElm = document.querySelector('#autolive_scroll');
    const readmoreElm = document.querySelector('#res_menu');
    if (checkboxElm === null || readmoreElm === null || !checkboxElm?.checked) {
      return;
    }
    const elementHeight = readmoreElm.offsetHeight;
    const viewportHeight = window.innerHeight;
    const offsetTop = readmoreElm.offsetTop;
    window.scrollTo({
      top: offsetTop - viewportHeight + elementHeight,
      behavior: 'smooth',
    });
  };
  // AmazonURLの正規化(amzn.toやamzn.asiaなど)
  const canonicalizeAmazonURL = (targetDocument, linkElm) => {
    const scriptElms = targetDocument.querySelectorAll('script');
    let asin = '';
    for (const scriptElm of scriptElms) {
      const text = scriptElm.textContent;
      if (text && text.includes('var opts')) {
        [, asin] = text.match(/asin:\s?\"(.+?)\"/) || [];
        break;
      }
    }
    if (asin && asin.length) {
      linkElm.href = `https://www.amazon.co.jp/dp/${asin}`;
      linkElm.textContent = `https://www.amazon.co.jp/dp/${asin}`;
    }
  };
  const insertURLData = async (linkElm) => {
    const parentElm = linkElm.parentElement;
    if (parentElm instanceof HTMLFontElement || !isProductPage(linkElm.href)) {
      removeLoading(linkElm);
      return;
    }
    const brandName = getBrandName(linkElm.href);
    if (brandName === '') {
      setFailedText(linkElm);
      removeLoading(linkElm);
      return;
    }
    const htmlData = await fetchData(linkElm.href);
    if (!htmlData) {
      setFailedText(linkElm);
      removeLoading(linkElm);
      return;
    }
    const adultPageLists = ['amazon', 'fanzaDlsoft', 'fanzaDoujin'];
    const parser = new DOMParser();
    let targetDocument = parser.parseFromString(htmlData, 'text/html');
    // AmazonやFANZAのアダルトページ確認画面スキップ
    if (adultPageLists.includes(brandName)) {
      const is18xAmazon = isAgeCheck(targetDocument, '#black-curtain-warning');
      const is18xFanza = isAgeCheck(targetDocument, '.ageCheck');
      if (is18xAmazon || is18xFanza) {
        const newDocument = await getNewDocument({
          targetDocument,
          linkElm,
          parser,
          brandName,
        });
        if (newDocument) {
          targetDocument = newDocument;
        }
      }
    }
    const selectorCondition = getSelectorConditions[brandName];
    const isSuccessSetTitleText = setTitleText({
      targetDocument,
      selectorCondition,
      linkElm,
      brandName,
    });
    const titleTextElm = linkElm.nextElementSibling;
    const imagePath = selectorCondition.image(targetDocument);
    if (imagePath && titleTextElm) {
      const imageElm = await setImageElm({
        imagePath,
        titleTextElm,
      });
      if (imageElm instanceof HTMLImageElement) {
        imageElm.onload = () => scrollIfAutoScrollIsEnabled();
      }
    } else if (!imagePath && !isSuccessSetTitleText) {
      const failedElm = linkElm.nextElementSibling;
      const hasFailedElm = failedElm instanceof HTMLElement && failedElm.classList.contains('userjs-title');
      if (!hasFailedElm) {
        setFailedText(linkElm);
      }
    }
    if (brandName === 'amazon') {
      canonicalizeAmazonURL(targetDocument, linkElm);
    }
    removeLoading(linkElm);
  };
  const replaceDefaultURL = (targetElm) => {
    const linkElms = targetElm.querySelectorAll('a[href]');
    const replaceUrl = (url) => {
      const regex = /http:\/\/www\.dlsite\.com\/(.+?)\/dlaf\/=\/link\/work\/aid\/[a-zA-Z]+\/id\/(RJ[0-9]+)\.html/;
      const newUrlFormat = 'https://www.dlsite.com/$1/work/=/product_id/$2.html';
      return url.replace(regex, newUrlFormat);
    };
    const decodeHtmlEntities = (text) => {
      return text.replace(/&#(\d+);/g, (_, dec) => {
        return String.fromCharCode(dec);
      });
    };
    for (const linkElm of linkElms) {
      const brandName = getBrandName(linkElm.href);
      const href = linkElm.getAttribute('href');
      if (brandName === 'dlsite') {
        linkElm.href = decodeHtmlEntities(decodeURIComponent(replaceUrl(href.replace('/bin/jump.php?', ''))));
      } else {
        linkElm.href = decodeHtmlEntities(decodeURIComponent(href.replace('/bin/jump.php?', '')));
      }
    }
  };
  const updateMebukiPreview = async (linkElm) => {
    const brandName = getBrandName(linkElm.href);
    if (brandName === '') return;
    const htmlData = await fetchData(linkElm.href);
    if (!htmlData) return;
    const adultPageLists = ['amazon', 'fanzaDlsoft', 'fanzaDoujin'];
    const parser = new DOMParser();
    let targetDocument = parser.parseFromString(htmlData, 'text/html');
    if (adultPageLists.includes(brandName)) {
      const is18xAmazon = isAgeCheck(targetDocument, '#black-curtain-warning');
      const is18xFanza = isAgeCheck(targetDocument, '.ageCheck');
      if (is18xAmazon || is18xFanza) {
        const newDocument = await getNewDocument({
          targetDocument,
          linkElm,
          parser,
          brandName,
        });
        if (newDocument) {
          targetDocument = newDocument;
        }
      }
    }
    const selectorCondition = getSelectorConditions[brandName];
    const price = selectorCondition.price(targetDocument);
    const imagePath = selectorCondition.image(targetDocument);
    let titleElm = targetDocument.querySelector('title');
    let title = titleElm?.textContent ?? '';
    if (title === '' && brandName === 'amazon') {
      title = selectorCondition.title(targetDocument);
    }
    let previewDiv = linkElm.nextElementSibling;
    while (previewDiv && !previewDiv.classList.contains('bg-muted/80')) {
      previewDiv = previewDiv.nextElementSibling;
    }
    if (!previewDiv) {
      const priceText = getPriceText(price);
      const nextSibling = linkElm.nextElementSibling;
      if (nextSibling && nextSibling instanceof HTMLElement && nextSibling.tagName.toLowerCase() === 'br') {
        nextSibling.style.display = 'none';
      }
      linkElm.insertAdjacentHTML(
        'afterend',
        `<div class="userjs-title">
        <span class="userjs-title-inner">${title}${priceText}</span>
      </div>`,
      );
      const titleTextElm = linkElm.nextElementSibling;
      if (imagePath && titleTextElm) {
        await setImageElm({
          imagePath,
          titleTextElm,
        });
      }
      if (brandName === 'amazon') {
        canonicalizeAmazonURL(targetDocument, linkElm);
      }
      removeLoading(linkElm);
      return;
    }
    const titleDiv = previewDiv.querySelector('.text-link');
    if (titleDiv && title) {
      titleDiv.textContent = title;
    }
    const priceText = getPriceText(price);
    if (priceText && titleDiv) {
      const priceSpan = document.createElement('div');
      priceSpan.className = 'text-sm font-bold mt-1';
      priceSpan.style.color = '#228b22';
      priceSpan.innerHTML = priceText;
      if (titleDiv.querySelector('.text-sm.font-bold.mt-1') === null) {
        titleDiv.insertAdjacentElement('afterend', priceSpan);
      }
    }
    if (imagePath) {
      const imgElm = previewDiv.querySelector('img');
      const linkWrapper = previewDiv.querySelector('a.pspw-ogp');
      if (imgElm) {
        const blob = await fetchData(imagePath, 'blob');
        if (blob) {
          const dataUrl = await new FileReaderEx().readAsDataURL(blob);
          imgElm.src = dataUrl;
          if (linkWrapper instanceof HTMLAnchorElement) {
            linkWrapper.href = dataUrl;
            linkWrapper.setAttribute('data-buynow-image', dataUrl);
          }
        }
      }
    }
    if (brandName === 'amazon') {
      canonicalizeAmazonURL(targetDocument, linkElm);
    }
    removeLoading(linkElm);
  };
  const observePhotoSwipe = () => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (!(addedNode instanceof HTMLElement)) continue;
          if (addedNode.classList.contains('pswp')) {
            const pswpImg = addedNode.querySelector('.pswp__img');
            const downloadBtn = addedNode.querySelector('.pswp__button--download-button');
            if (pswpImg instanceof HTMLImageElement) {
              const originalSrc = pswpImg.src;
              const messageContent = document.querySelector(`.message-content a[href="${originalSrc}"]`);
              if (messageContent) {
                const dataUrl = messageContent.getAttribute('data-buynow-image');
                if (dataUrl) {
                  pswpImg.src = dataUrl;
                  if (downloadBtn instanceof HTMLAnchorElement) {
                    downloadBtn.href = dataUrl;
                  }
                }
              }
            }
          }
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
    });
  };
  const processingQueue = [];
  let activeRequests = 0;
  const MAX_CONCURRENT_REQUESTS = 3;
  const processQueue = async () => {
    while (activeRequests < MAX_CONCURRENT_REQUESTS && processingQueue.length > 0) {
      const linkElm = processingQueue.shift();
      if (linkElm) {
        activeRequests++;
        insertURLData(linkElm).finally(() => {
          activeRequests--;
          processQueue();
        });
      }
    }
  };
  const observeLinkElements = (linkElms) => {
    const winH = window.innerHeight;
    const observerOptions = {
      root: null,
      // ビューポートの上下にビューポートの高さ分のマージンを持たせる
      rootMargin: `${winH}px 0px`,
      threshold: 0,
    };
    const observer = new IntersectionObserver(async (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const linkElm = entry.target;
          observer.unobserve(linkElm);
          // 見えるようになったリンクを処理キューに追加
          processingQueue.push(linkElm);
          processQueue();
        }
      }
    }, observerOptions);
    linkElms.forEach((linkElm) => observer.observe(linkElm));
  };
  const searchLinkElements = async (targetElm) => {
    const allLinkElms = targetElm.querySelectorAll(WHITE_LIST_SELECTORS);
    if (!allLinkElms.length) return;
    const linkElms = [...allLinkElms].filter((linkElm) => {
      const hasElementNode = Array.from(linkElm.childNodes).some((node) => node.nodeType === Node.ELEMENT_NODE);
      return !hasElementNode;
    });
    if (!linkElms.length) return;
    for (const linkElm of linkElms) {
      setLoading(linkElm);
    }
    if (isMebuki()) {
      for (const linkElm of linkElms) {
        updateMebukiPreview(linkElm);
      }
    } else {
      observeLinkElements(Array.from(linkElms));
    }
  };
  const mutationLinkElements = async (mutations) => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (!(addedNode instanceof HTMLElement)) continue;
        replaceDefaultURL(addedNode);
        searchLinkElements(addedNode);
      }
    }
  };
  const initializeThread = () => {
    const threadElm = isMebuki() ? document.querySelector('.thread-messages') : document.querySelector('.thre');
    if (threadElm instanceof HTMLElement) {
      if (isMebuki()) {
        observePhotoSwipe();
      } else {
        replaceDefaultURL(threadElm);
      }
      searchLinkElements(threadElm);
      const observer = new MutationObserver(mutationLinkElements);
      observer.observe(threadElm, {
        childList: true,
      });
    }
  };
  /** window.USER_SCRIPT_MEBUKI_STATEが確実にセットされるまで待機 */ const waitForMebukiState = async () => {
    if (typeof window.USER_SCRIPT_MEBUKI_STATE !== 'undefined') {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const checkInterval = 50; // 50msごとにチェック
      const maxWaitTime = 10000; // 最大10秒待機
      const startTime = Date.now();
      const intervalId = setInterval(() => {
        if (typeof window.USER_SCRIPT_MEBUKI_STATE !== 'undefined') {
          clearInterval(intervalId);
          resolve();
          return;
        }
        // タイムアウトチェック
        if (Date.now() - startTime >= maxWaitTime) {
          clearInterval(intervalId);
          resolve();
        }
      }, checkInterval);
    });
  };
  if (isMebuki()) {
    await waitForMebukiState();
    const { subscribe, getState } = window.USER_SCRIPT_MEBUKI_STATE;
    subscribe((state) => {
      if (state.isThreadPage) {
        const threadElm = document.querySelector('.thread-messages');
        if (threadElm && !threadElm.hasAttribute('data-buynow-initialized')) {
          threadElm.setAttribute('data-buynow-initialized', 'true');
          initializeThread();
        }
      }
    });
    if (getState().isThreadPage) {
      const threadElm = document.querySelector('ul.thread-messages');
      if (threadElm && !threadElm.hasAttribute('data-buynow-initialized')) {
        threadElm.setAttribute('data-buynow-initialized', 'true');
        initializeThread();
      }
    }
  } else {
    initializeThread();
  }
})();

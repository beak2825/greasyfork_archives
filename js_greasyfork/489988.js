// ==UserScript==
// @name          tesseractJSautofill
// @namespace     https://greasyfork.org
// @version       0.0.2
// @description   auto fill captcha text by tesseract.js
// @match         *://*/*
// @grant         none
// ==/UserScript==

// @require     https://unpkg.com/tesseract.js/dist/tesseract.min.js
const init_worker = async (language) => {
  const lang = language;
  const server = 'https://unpkg.com';
  const langPath = `${server}/@tesseract.js-data/${lang}/4.0.0_best_int`;
  const worker = await Tesseract.createWorker(lang, 1, {
    corePath: `${server}/tesseract.js-core`,
    workerPath: `${server}/tesseract.js/dist/worker.min.js`,
    langPath: langPath,
    logger: () => {
      console.debug('init worker', `${server}/tesseract.js/dist/worker.min.js`);
    },
  });

  return worker;
};

const img_src_to_base64 = (img) => {
  // https://stackoverflow.com/a/22172860
  let canvas = document.createElement('canvas');
  // https://developer.mozilla.org/docs/Web/API/HTMLImageElement/naturalWidth
  canvas.width = img.naturalWidth;
  // https://developer.mozilla.org/docs/Web/API/HTMLImageElement/naturalHeight
  canvas.height = img.naturalHeight;
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.canvas.toDataURL('image/png');
};

const get_captcha_text = async (imgTag, worker) => {
  let node = document.querySelector(imgTag);
  const ret = await worker.recognize(img_src_to_base64(node));
  // console.debug(ret);
  const ret_text = ret.data.text;
  // console.debug(ret_text);
  return ret_text;
};

const auto_fill_captcha_text = async (
  imgTag,
  valueTag,
  loginTag = '',
  delayTime = 3000,
  failFunction = 'reload',
  language = 'eng',
  textLength = 4,
  textType = '\\d'
) => {
  const worker = await init_worker(language);

  let captcha_text = await get_captcha_text(imgTag, worker);
  let optimised_text = captcha_text.trim().split(' ').join('');

  const regex = RegExp(`${textType}{${textLength}}`);

  console.debug(regex, optimised_text, regex.test(optimised_text));

  if (optimised_text.length === textLength && regex.test(optimised_text)) {
    document.querySelector(valueTag).value = optimised_text;
    console.debug('reloadCounter', sessionStorage.getItem('reloadCounter'));
    sessionStorage.setItem('reloadCounter', '0');
    if (loginTag.length > 0) {
      document.querySelector(loginTag).click();
    }
  } else {
    document.querySelector(valueTag).value = '';
    sessionStorage.setItem(
      'reloadCounter',
      `${Number(sessionStorage.getItem('reloadCounter')) + 1}`
    );
    console.debug('reloadCounter', sessionStorage.getItem('reloadCounter'));

    if (failFunction === 'null') return;
    setTimeout(() => {
      if (failFunction === 'reload') {
        location.reload();
      }
    }, delayTime);
  }
};

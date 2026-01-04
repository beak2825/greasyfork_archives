// ==UserScript==
// @name        Ruler
// @namespace   Violentmonkey Scripts
// @include *
// @grant       none
// @version     1.0
// @license     MIT
// @author      fuckduanluan
// @description Inspired by https://www.v2ex.com/t/878358
// @downloadURL https://update.greasyfork.org/scripts/450905/Ruler.user.js
// @updateURL https://update.greasyfork.org/scripts/450905/Ruler.meta.js
// ==/UserScript==


window.addEventListener('load', () => {
  const dec = decodeURIComponent,
      enc = encodeURIComponent,
      decode = function decode(s) {
    return s.replace(/(%[0-9A-Z]{2})+/g, dec);
  };

  function setCookie(key, value, _temp) {
    let _ref = _temp === void 0 ? {} : _temp,
        expires = _ref.expires,
        domain = _ref.domain,
        secure = _ref.secure,
        _ref$path = _ref.path,
        path = _ref$path === void 0 ? '/' : _ref$path;

    if (typeof value !== 'string') {

      value = String(value);
    }


    key = enc(key.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, dec));


    value = enc(value.replace(/%(23|24|26|2B|5E|60|7C)/g, dec).replace(/[\\]/g, escape));
    let text = key + "=" + value;
    text += "; path=" + path.split(';')[0];

    typeof expires === 'number' && (expires = new Date(Date.now() + expires * 36e5)); 


    expires instanceof Date && (text += "; expires=" + expires.toUTCString());
    typeof domain === 'string' && (text += "; domain=" + domain.split(';')[0]);
    secure && (text += '; secure');
    return document.cookie = text;
  }

  function getCookie(key) {
    const cookies = document.cookie ? document.cookie.split('; ') : [],
        rst = [];

    for (let i = 0, len = cookies.length; i < len; ++i) {
      let part = cookies[i].split('='),
          name = decode(part[0]),
          value = decode(part.slice(1).join('='));
      name === key && rst.push(value);
    }

    return rst.length ? rst.length === 1 ? rst[0] : rst : null;
  }
  if (getCookie('hasBanner')) return;
  
  const banner = document.createElement('div');
  banner.style.cssText = `
    color: #eee;
    font-size: 24px;
    text-shadow: 0 3px 3px #666;
    line-height: 22px;
    padding: 8px;
    font-family: "Microsoft Yahei";
    text-align: center;
    cursor: pointer;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 9999;
    background: linear-gradient(-45deg, #0057b7 25%, #ffd700 0, #ffd700 50%, #0057b7 0, #0057b7 75%, #ffd700 0);
    background-size: 100px 100px;
    box-shadow: 0 3px 10px #aaa;
  `;
  banner.textContent = '我们终将在没有黑暗的地方相见';
  banner.addEventListener('click', function() {
    this.style.display = 'none';
    setCookie('hasBanner', 1, { expires: 24 * 7 });
  });
  document.body.appendChild(banner);
});
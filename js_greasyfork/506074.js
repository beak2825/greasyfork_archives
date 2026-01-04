// ==UserScript==
// @name          DM5 动漫屋滚动阅读
// @namespace     https://github.com/fym998/
// @description   DM5 动漫屋滚动阅读，展示章节内的所有图片。如果空间允许，会将图片从右到左排列。点击图片切换至下一张。
// @run-at        document-end
// @match         *://www.dm5.com/m*/
// @match         *://www.dm5.cn/m*/
// @exclude-match *://www.dm5.com/manhua-*/
// @exclude-match *://www.dm5.cn/manhua-*/
// @version       1.1.11
// @author        fym998
// @license       GPL-3.0-or-later
// @supportURL    https://github.com/fym998/dm5.user.js/issues
// @icon          https://www.dm5.com/favicon.ico
// @require       https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require       https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require       https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @downloadURL https://update.greasyfork.org/scripts/506074/DM5%20%E5%8A%A8%E6%BC%AB%E5%B1%8B%E6%BB%9A%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/506074/DM5%20%E5%8A%A8%E6%BC%AB%E5%B1%8B%E6%BB%9A%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function (web, solidJs) {
'use strict';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".view-paging{display:none}.rightToolBar{display:flex;opacity:.6;&>a{align-items:center;display:flex!important;float:unset;font-weight:700}&>a.logo_3{display:none}}#cp_image{display:none!important}#barChapter>img{border:1px solid;cursor:unset!important}";
styleInject(css_248z$1);

var css_248z = ".style-module_imageflow__-PH8J{align-items:center;display:flex;flex-direction:row-reverse;flex-wrap:wrap;justify-content:center;&>img{border:1px solid;display:block;flex-shrink:1;margin:.5em .25em;max-width:100%;min-height:30vh;min-width:30vw}&>img:not(:last-child){cursor:pointer}}";
var styles = {"imageflow":"style-module_imageflow__-PH8J"};
styleInject(css_248z);

var _tmpl$ = /*#__PURE__*/web.template(`<div>`),
  _tmpl$2 = /*#__PURE__*/web.template(`<img loading=lazy>`);
// stylesheet;

async function fetchImageURLs() {
  const count = DM5_IMAGE_COUNT;
  const ret = Array(count + 1);
  const params = new URLSearchParams({
    cid: DM5_CID.toString(),
    key: document.querySelector('#dm5_key').value,
    language: 1 .toString(),
    gtk: 6 .toString(),
    _cid: DM5_CID.toString(),
    _mid: DM5_MID.toString(),
    _dt: DM5_VIEWSIGN_DT.toString(),
    _sign: DM5_VIEWSIGN.toString()
  });
  for (let i = 1; i <= count; i++) {
    if (ret[i]) continue;
    params.set('page', i.toString());
    const code = await (await fetch(`chapterfun.ashx?${params.toString()}`)).text();
    const URLs = eval(code);
    console.log(params.toString(), URLs);
    URLs.forEach(URL => {
      const page = Number(URL.match(/\/(\d+)_/)[1]);
      ret[page] = URL;
    });
  }
  return ret;
}
function setHistory(page) {
  SetReadHistory(DM5_CID, DM5_MID, page, DM5_USERID);
}
function goToPage(index) {
  window.location.hash = `#ipg${index}`;
}
const ImageFlow = () => {
  const [imageURLs] = solidJs.createResource(fetchImageURLs);
  const imageCount = DM5_IMAGE_COUNT;
  const [currentPage, setCurrentPage] = solidJs.createSignal(DM5_PAGE);
  solidJs.createEffect(() => {
    if (imageURLs()) {
      goToPage(currentPage());
      setHistory(currentPage());
    }
  });
  return (() => {
    var _el$ = _tmpl$();
    web.insert(_el$, web.createComponent(solidJs.For, {
      get each() {
        return imageURLs();
      },
      children: (URL, i) => web.createComponent(solidJs.Show, {
        when: URL,
        get children() {
          var _el$2 = _tmpl$2();
          _el$2.addEventListener("load", () => {
            if (currentPage() === i()) goToPage(i());
          });
          _el$2.$$click = () => {
            if (i() < imageCount) setCurrentPage(i() + 1);
          };
          web.setAttribute(_el$2, "src", URL);
          web.effect(_p$ => {
            var _v$ = `ipg${i()}`,
              _v$2 = `page ${i()}`,
              _v$3 = `page ${i()}`;
            _v$ !== _p$.e && web.setAttribute(_el$2, "id", _p$.e = _v$);
            _v$2 !== _p$.t && web.setAttribute(_el$2, "alt", _p$.t = _v$2);
            _v$3 !== _p$.a && web.setAttribute(_el$2, "title", _p$.a = _v$3);
            return _p$;
          }, {
            e: undefined,
            t: undefined,
            a: undefined
          });
          return _el$2;
        }
      })
    }));
    web.effect(() => web.className(_el$, styles.imageflow));
    return _el$;
  })();
};
const container = document.querySelector('#cp_img, #barChapter');
container.removeAttribute('oncontextmenu');
container.parentElement.removeAttribute('oncontextmenu');
if (container.id === 'cp_img') {
  web.render(ImageFlow, container);
} else if (container.id === 'barChapter') {
  container.querySelectorAll('img').forEach(img => {
    img.removeAttribute('onclick');
  });
}
document.querySelector('footer').style.display = 'none';
const backAnchorHTML = `
<a href=${document.querySelector('a.back').href}>
  <div>退出</div>
</a>`;
document.querySelector('.rightToolBar').insertAdjacentHTML('afterbegin', backAnchorHTML);
const metaViewPointHTML = `<meta name="viewport" content="width=device-width, initial-scale=1">`;
document.head.insertAdjacentHTML('afterbegin', metaViewPointHTML);
web.delegateEvents(["click"]);

})(VM.solid.web, VM.solid);

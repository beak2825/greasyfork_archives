// ==UserScript==
// @name        小瞳
// @name:zh-CN  小瞳
// @description  小瞳 wg
// @description:zh-CN  外挂
// @namespace    https://huching.net/
// @version     0.1.3
// @license     GPL-3.0
// @icon        data:image/png;base64,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
// @author      cqm
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @match     https://zhsq-iot.sunac.com.cn/*
// @match     https://zhsq-iot-uat.sunac.com.cn/*
// @match     https://zhsq-iot-uat-api.sunac.com.cn/*

// @noframes
// @grant          unsafeWindow
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_request
// @grant          GM_info
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542241/%E5%B0%8F%E7%9E%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/542241/%E5%B0%8F%E7%9E%B3.meta.js
// ==/UserScript==

const head = document.getElementsByTagName('head');
head[0].insertAdjacentHTML('beforeend', `<style type="text/css">
.hx-download-original-images-tool{
    position: absolute;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABu1JREFUeF7tm11MXEUUgM9d/iltWSiWAoI2sdY/fiwt/kApUTExqcbqk1ptfCtarG/GxFhejA9GK03bVxvjz4M+aB9smmipkFpsDaXQGtsYYGO3UH4W+ZUF9ppzL+dy7mX27rC7cGm5k5DdZWfOnPPNOTNnZu4qsMqLssrtBxeA6wGrnIApBA4ePL4rFArt8ng8TYcP72+6k9jU1x89hPY0Nr6lvVIxAThw4NgZRYFdAGqDteLtDqO+/piKNng8Sg0fXBcAH1nXA9wQcOcAdxJ0VwF3GXTzADcRWkwmiOmzk1mibMoet0yQcmoA5UMnDed9qypo+5aEBKUhHJC4ANCNXzmGiwdAvI+JCYC+S1TPUIebd5Zrb7335IO3KM9RRwj0+CHQfQP6uv0w7vPP6bIQQkwA5vcIAGj85urtjhodrvPmH5thqr1TCCFqANztt73+woIRvzml9zc6CzA64yyX2Vv9MNVxFaY6r2qKNDbWGbvdGADo+2jRyKPx/jkAzpqu9x4aHwd1fAJGvvlugRdEBYDH/tMf7DdsxJG+NrESTDbrQADIC3B1OHKkrgZrRQWA3B8nOnR/Kmi80+4uwk8AZm71w8TPZ01hEBUAmvw4gJU6+jwE8D2FAR2BxQSAx/9KHf1lA/DHSOTYn/nHD4kF8csPUB6WSDIpBJbUA0QAUMHJ1guakqQsYUqtKIekgvyIyluxTp6/ADM3/AvkIYTE/DxIe2xhLuIIAFT0v9aLJv1zN2VB780h0/8QhEhpq+EE0wrSWk8kL44A4ITHo3wRCqmfAUApnwO4B3Dj0ejS0i2Ar1QQQm/vIFxqu2648NqX5lcTUTAFPj9u/Lu07D7Izc02yURZJA8rojwKDTEAeBdAuUSpfNh7AWu+z5UTAcARGv3+B60aKop/VJKTkyAYnDY+c6W5wiK3R2+ywrTKw3anfjqveRkaT1BFAASQTzQ21u2j/2upYqRdnggAGo8QyHhUMiMjDfCVl7GxSRgbm9BGjUbO+858UkV1uTfte/M5TY6dPDQeIWChcJAEADxBmgOgp7tTG3JgbMtW7RVL9rlmSBnoN6XBGAJ89FHZjIx0TdlwBb1haGgETp/6Hfz+AZPbUhsOtLKqxFYetkGwLc3tGlTyAhGAwSeqDHvW/vUn4B8WCgWFu77/+T0mG8IBoNHKL8iBF/dUm5T19fQZMgqLNhrvEcLXX53W3FY0gVHs795dCQ89cq9Jj3Ayr3R0wcmTLVpd9KpIAPigkhco5P446kiLl0gAtpXfD8/U7jC1+fijL43P772/1/QdKczjFitwj3q7/mUTUBzllubLmpzKqmJA76CCUD/95FvtI84DHu96bTOEhTJB7gFavTkviAkAuWvB3XfBa3uflQZwtqkNfjvXaZq4rACs0OwAYFsCLusBcQFAI4Yu/sqrtSYA6OZUrN+RMXYhgG146GAbn08Pq8rKEtN3GBrUnyMAUCmrwiYalg80WiIA5FVWN7eTR0BlJ0H7EMjeAINP7pSaA7ASKSzyApHS3JVFyyCfB2Sg8tG3Wwal54CgNwsGqsxH/OEmQWvcRho1brxdSsyhWt2dQ0XjW1raAV+5PJlVYN2VDsj4+7qRCxirQDDTC/8Wl0EoNdXoy3uxFZKHBhfkAVTBug/gIGjpIkWxjcx+gKfCKK+wMNeIe5Tp8/UaqwLK5N4kAhAor4BgVjYoM/qBJRqf3tM1D4DyAALASWdeboOk4UBYAFhXtBkShYCM8eHAiuRZl1KsIwIwXFwG05leQ8Sani4xAKyBHoAgqMgA4Epbt6+0SUmr2B7Vdhhl851mJHkyAHJ+/WVOZf3uwJQKo/Ez6zNhvEjPxBYDgI9SvA9E7FYC/p0dgOThAKT5ugFf9cIA2O0EsWq47bCsYstVT3YzxC9/2cXB0UOqqlTrT4iYy50FwHxtJnxYmq68Ix2ILNfIyvZjdyCCMkQ3x7ZPi9OxeCweEOloS8a4SIehJMPuSCxcP0sKQHaJtIOwmOVzNjAMMK2fRFnvBVwAYQgsqQfIuHc86+DtMJW4eAAdlsQyB8TTQDtZPP7jFgIEYE1hHjz+hn6cLXMztFxGUz9qcBpCw8NGt6LL0ajmANH1+EoDYB15NFR0PR4VAGxEt6rrKh6FB2p2wLXJlfE7Kxx1dTponAFyA0UPSMQAYP7JsPTapyAx2wuQZD77X26Xp6VO1C8+F4AhwM/+7fSTGk5+cZJS8jCkPLh12W2W6ZA/H2S9AovaA6ghf1IscVMuJGRnQcJG/QLFyTLbpy999GCUrov8b56kPIAMjHSF5iSI+b7ljcc2iwKADXBlmJ1VtcdkRTtHZyCoDdhvNL90WzQAZwxcul5dAEvH9vaQ/D+rDEWbGeNI0wAAAABJRU5ErkJggg==);
    background-size: cover;
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: .55;
    z-index: 50000;
    transform: scale(.75);
    transition: all cubic-bezier(0.18, 0.89, 0.32, 1.28) 250ms;
}
.hx-download-original-images-tool.error{
    background-image: url(data:image/png;base64,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);
}
.hx-download-original-images-tool:hover {
    opacity:1;
    transform: scale(.9);
}
.hx-download-original-images-tool:active {
    opacity:.8;
    transform: scale(.7)  rotateZ(360deg);
}
.hx-download-original-images-tool-msg {
  position: fixed;
  left: -250px;
  bottom: 50px;
  width: 250px;
  background: linear-gradient(to bottom right, #00000037, #0004 , #00000057 );
  box-shadow: 1px 0 20px 1px #64646433;
  padding: 2px 20px;
  z-index: 65536;
  border-radius: 100px;
  color: #fff;
  transform: translateX(280px) translateY(0);
  transition: all cubic-bezier(0.18, 0.89, 0.32, 1.28) 250ms;
}
.imageLabel-content {
  cursor: crosshair;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  pointer-events: none;
  }
.imageLabel-imgdrop {
  min-width: 7px;
  min-height: 7px;
  cursor: pointer;
  position: absolute;
  background-color: #0000004d;
  border: 2px solid #ec407a;
  z-index: 10;
}
.imageLabel-imgdrop span {
  color: #fff;
  word-break: keep-all;
}
.loading_ai {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(#07aaff, #07aaff),
        linear-gradient(90deg, #ffffff33 1px, transparent 0),
        linear-gradient( #ffffff33 1px, transparent 0),
        linear-gradient(transparent, #07aaff);
      background-size: 100% 1.5%, 10% 100%, 100% 8%, 100% 100%;
      background-repeat: no-repeat, repeat, repeat, no-repeat;
      background-position: 0 0, 0 0, 0 0, 0 0;
      clip-path: polygon(0% 0%, 100% 0%, 100% 1.5%, 0% 1.5%);
      animation: moveAI 0.75s infinite linear;
      opacity: .5;
    }
@keyframes moveAI {
  to {
    background-position: 0 100%, 0 0, 0 0, 0 0;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}
</style>`);


try {
  customElements.define('hxdownload-message',
    class extends HTMLElement {
      constructor() {
        super();

        const divElem = document.createElement('div');
        // divElem.textContent = this.getAttribute('text');
        divElem.className = 'text-node';
        // style
        const style = document.createElement('style');
        style.append(document.createTextNode(`
      .text-node{
        font-size: 14px;
        line-height: 21px;
        font-family: sans-serif;
        width: 100%;
        overflow: hidden;
        word-break: break-word;
      }
      `));
        const shadowRoot = this.attachShadow({
          mode: 'open'
        });
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(divElem);
      }
    }
  );

} catch (error) {

}


globalThis.__hx_Msg_list = new Set();

class __hx_MsgIns {
  constructor(text) {
    this.text = text;
    this.el = document.createElement('hxdownload-message');
    document.body.insertAdjacentElement('beforeend', this.el);
    this.el.className = 'hx-download-original-images-tool-msg';
    this.textEl = this.el.shadowRoot.querySelector('.text-node');
    this.textEl.innerText = text;
    __hx_Msg_list.add(this);
    this.el.style.transform = `translateX(280px) translateY(-${(__hx_Msg_list.size - 1) * 50}px)`;
  }

  /**
   * @param {any} text
   */
  update(text) {
    this.textEl.innerText = text;
  }

  close() {
    this.textEl.innerText = '';
    this.el.parentElement.removeChild(this.el);
    __hx_Msg_list.delete(this);
  }
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [ 'Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 根据图片url转为png文件对象
 * @param url
 * @param imageName
 * @returns {Promise<unknown>}
 */
function getImageFileFromUrl(url, imageName) {
  return new Promise(async (resolve, reject) => {
    try {
      const r = await GM.xmlHttpRequest({
        url, method: 'GET', headers: {
          'Accept': 'image/png'
        }, responseType: 'blob'
      });
      // 获取返回结果
      const blob = r.response;
      let imgFile = new File([ blob ], imageName, { type: 'image/jpg' });
      // 返回结果
      resolve(imgFile);
    } catch (e) {
      reject(e);
    }
  });
}


const openDown = async (url, e, name, img) => {
  e && e.preventDefault();
  e && e.stopPropagation();
  if (!img.parentElement) {
    return;
  }
  try {
    if (img.parentElement.querySelector('.imageLabel-content')) {
      img.parentElement.querySelector('.imageLabel-content')
        .remove();
    }
    $(img.parentElement)
      .append('<div class="imageLabel-content"></div>');
    $(img.parentElement.querySelector('.imageLabel-content'))
      .append('<div class="loading_ai"></div>');

   // const file = await getImageFileFromUrl(img.src, name);
    // const data = new FormData();
    // data.append('images', file, name);
    const data = {
      model: 'bot-20250710172919-mtpjx',
      stream: false,
      stream_options: {
        include_usage: false,
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              image_url: {
                url: img.src
              },
              type: 'image_url',
            },
            {
              type: 'text',
              text: '',
            },
          ],
        },
      ],
    };
    const r = await GM.xmlHttpRequest({
      url: 'https://ark.cn-beijing.volces.com/api/v3/bots/chat/completions', method: 'POST', headers: {
        // 'Content-Type': 'multipart/form-data'
         'Content-Type': 'application/json',
        Authorization: 'Bearer 0fa4388a-8bce-4961-9142-8a4e51e330c2',
      }, data: JSON.stringify(data)
    })
      .catch(e => {
        img.parentElement.querySelector('.loading_ai')
          ?.remove();
        console.error(e);
      });
    console.log(r.responseText);
    const res = JSON.parse(r.responseText);
    img.parentElement.querySelector('.loading_ai')
      ?.remove();
    if (!img._ob) {
      const ob = new MutationObserver(function(mutationRecoards, observer) {
        // mutationRecoards变动数组
        // observer 观察者实例
        console.log(mutationRecoards);
        if (mutationRecoards.some(item => item.attributeName === 'src')) {
          // openDown(img.src, e, name, img);
        }
      });
      ob.observe(img, {
        attributes: true,
        characterData: false,
        childList: false,
        subtree: false,
        attributeOldValue: true,
        characterDataOldValue: false
      });
      img._ob = ob;
    }

    setPredictionLabel(res, img);
  } catch (e) {
    console.error(e);
    img.parentElement.querySelector('.loading_ai')
      ?.remove();
  }
};

const getImgWH = Ti => {
  return {
    width: Ti.naturalWidth,
    height: Ti.naturalHeight
  };
};


function setPredictionLabel(res, imageDom) {

  const data = JSON.parse(res.choices[0].message.content);
  let St = data;
  if (!St || 0 === St?.length) {
    $(imageDom.parentElement.querySelector('.hx-download-original-images-tool'))
      .removeClass('error');
    return;
  }
  $(imageDom.parentElement.querySelector('.hx-download-original-images-tool'))
    .addClass('error');
  const $content = $(imageDom.parentElement.querySelector('.imageLabel-content'));
  let Mt,
    bi = $(imageDom.parentElement.querySelector('.imageLabel-content'));
  $(imageDom.parentElement.querySelector('.imageLabel-imgdrop'))
    ?.remove();
  let { width: Ii, height: si } = getImgWH(imageDom);

  data.forEach((item, index) => {
    const {type, desc, score, bbox} = item;
    let pn = {
      x: bbox[0] ,
      y: bbox[1] ,
      ex: bbox[2],
      ey: bbox[3],
    };
    const ki = type ? type + '(' + String(Math.round(100 * score)) + '%)' : '';
    Mt = $('<div class="imageLabel-imgdrop"><span style="font-size:12px;zoom:0.9" class="imageLabel-imgdrop-font">' + (ki || '') + ':' + desc + '</span></div>'),
      Mt.css({
        left: 100 * pn.x + '%',
        top: 100 * pn.y + '%',
        width: 100 * pn.ex + '%',
        height: 100 * pn.ey + '%'
      });
    // .attr('data-json', JSON.stringify(pn));
    bi.append(Mt);
    let On = $(imageDom);
    $content
      .css({
        width: On.width(),
        height: On.height()
      });
  })

}


const hostname = window.location.hostname;

const lastItem = (arr, index = 0) => arr.length ? arr[arr.length - 1 - index] : '';

const createDom = (cfg, img) => {
  const {
    parent,
    link,
    name,
    className = '',
    style = '',
    target,
    postion = 'afterEnd',
    linkArr
  } = cfg;

  const genDomDL = (dom) => {
    let domDL = dom || document.createElement('a');
    Object.assign(domDL, {
      title: '预测',
      className: 'hx-download-original-images-tool ' + className,
      style: style,
      href: 'javascript:;',
    });
    domDL.onclick = async e => {
      e && e.preventDefault();
      e && e.stopPropagation();
      const newName = name || lastItem(link.split('/'));
      await openDown(link, e, newName, img);
    };
    return domDL;
  };

  let parent2 = parent;
  if (!parent && target) {
    parent2 = target.parentElement;
  }
  // if (['afterEnd', 'beforeBegin'].includes(postion)) {
  //   parent2 = target.parentElement.parentElement
  // }
  const exist = parent2.querySelector('.hx-download-original-images-tool');
  if (exist) {
    return genDomDL(exist);
  } else {
    const dom = genDomDL();
    parent2.insertAdjacentElement(postion, dom);
    return dom;
  }
};

const init = () => {
  window.addEventListener('mouseover', ({
    target
  }) => {
    const el = target;
    const img = (el && el.tagName === 'IMG' ? el : null);
    if (img) {
      const src = img.src;
      const parent = img.parentElement;
      const link = src;
      const style = 'left: 10px;top: 10px;';
      const cfg = {
        parent,
        link,
        style,
        target: img,
        name: img.alt ? (img.alt + '.jpg') : src.split(/[\?\/]/g)
          .filter(x => x.endsWith('.jpg'))[0],
        postion: 'beforeEnd'
      };
      createDom(cfg, img);
    }
  });
};

// setTimeout(() => {
//   init();
// }, 1200);
let loading = false;

async function auto() {
  loading = true;
  for (const img of getVisibleImages()) {
    if (img._init) continue;
    if (img.width < 100 || img.height < 100) continue;
    const src = img.src;
    const parent = img.parentElement;
    const link = src;
    const style = 'left: 10px;top: 10px;';
    const cfg = {
      parent,
      link,
      style,
      target: img,
      name: img.alt ? (img.alt + '.jpg') : src.split(/[\?\/]/g)
        .filter(x => x.endsWith('.jpg'))[0],
      postion: 'beforeEnd'
    };
    const dom = createDom(cfg, img);
   // dom.onclick();
    img._init = true;
  }
  loading = false;
}

setInterval(() => {
  if (loading) return;
  auto();
}, 800);


function getVisibleImages() {
  const images = document.querySelectorAll('img');
  const visibleImages = [];

  images.forEach(image => {
    const imageRect = image.getBoundingClientRect();
    if (imageRect.top >= 0 && imageRect.left >= 0 &&
      imageRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      imageRect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
      // 图片在可视区域内
      visibleImages.push(image);
    }
  });
  return visibleImages;
}

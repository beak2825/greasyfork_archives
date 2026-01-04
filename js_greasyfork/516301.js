// ==UserScript==
// @name         u9a9
// @namespace    http://tampermonkey.net/
// @version      2024-10-21
// @description  去广告，高亮关键词，显示预览图
// @author       You
// @match        https://u9a9.net
// @match        https://u9a9.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u9a9.net
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516301/u9a9.user.js
// @updateURL https://update.greasyfork.org/scripts/516301/u9a9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle(`
/* 隐藏广告 */
.row.ad, .alert-dismissable { display: none; }

/* 链接显示完整文本 */
a { white-space: initial; }

/* 只显示完全匹配的结果 */
.strict-match tr.not-strict-match { display: none; }

/* 预览图 */
.images-list {
  white-space: normal;
}
.image-item {
  height: 100px;
  width: auto;
  min-width: 50px;
  background-color: #eee;
  cursor: pointer;
  opacity: 0.8;
  margin: 1px;
}
.image-item:hover {
  opacity: 1;
}
/* 预览大图 */
.preview-box {
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-flow: column;
}
.preview-box * {
  user-select: none;
}
.preview-box.hide {
  display: none;
}
.preview-image {
  flex: auto;
  background: no-repeat center center;
  background-size: contain;
}
.preview-list {
  white-space: nowrap;
  overflow-x: auto;
  text-align: center;
  background-color: #000;
}
.preview-item {
  height: 100px;
  width: auto;
  min-width: 50px;
  background-color: #eee;
  cursor: pointer;
  opacity: 0.8;
  margin: 0 1px;
}
.preview-item:hover {
  opacity: 1;
}
.preview-item.cur {
  opacity: 1;
  outline: solid 2px #f00;
  outline-offset: -2px;
}
.preview-button {
  display: inline-block;
  width: 40px;
  height: 40px;
  text-align: center;
  align-content: center;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: #000;
  opacity: 0.5;
}
.preview-button:hover {
  opacity: 1;
}
#preview-index {
  position: fixed;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 24px;
  padding: 5px 10px;
}
#prev-image, #next-image {
  position: fixed;
  top: calc(50vh - 120px);
}
#prev-image {
  left: 10px;
}
#next-image {
  right: 10px;
}
#preview-close {
  background-color: #f00;
  position: fixed;
  top: 10px;
  right: 10px;
}

/* 关键词高亮 */
::highlight(kw-highlight) {
  background-color: #f06;
  color: white;
}
`);

    // 链接
    const links = [...document.querySelectorAll('tr td:nth-child(2) a')];
    if (links.length === 0) return;

    // 页面标题显示关键词
    const search = decodeURIComponent(location.search.match(/search=(.*?)(&|$|#|\/)/)[1]);
    document.title = `搜索：${search} - ${document.title}`;

    // 高亮链接中的关键词
    const kwList = search.split(' ').filter(kw => !/^(新片速遞)$/.test(kw));
    function getKwRanges(a) {
        const ranges = [];
        kwList.forEach(kw => {
            const start = a.textContent.indexOf(kw);
            if (start !== -1) {
                const range = new Range();
                range.setStart(a.firstChild, start);
                range.setEnd(a.firstChild, start + kw.length);
                ranges.push(range);
            }
        });
        if (ranges.length < kwList.length) {
            a.dataset.notStrictMatch = 'true';
            a.closest('tr').classList.add('not-strict-match');
        }
        return ranges;
    }
    const kwRanges = links.map(a => getKwRanges(a));
    const kwHighlight = new Highlight(...kwRanges.flat());
    CSS.highlights.set('kw-highlight', kwHighlight);

    // 只显示完全匹配的结果
    let isStrictMatch = GM_getValue('isStrictMatch', true);
    const matchMode = document.createElement('button');
    matchMode.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999;';
    document.body.appendChild(matchMode);
    function getIsStrict() {
        return document.body.classList.contains('strict-match');
    }
    function setMatchMode(isStrict) {
        if (isStrict) {
            document.body.classList.add('strict-match');
            matchMode.textContent = "匹配模式：严格";
        } else {
            document.body.classList.remove('strict-match');
            matchMode.textContent = "匹配模式：默认";
        }
        isStrictMatch = isStrict;
        GM_setValue('isStrictMatch', isStrict);
    }
    matchMode.onclick = () => setMatchMode(!isStrictMatch);
    setMatchMode(isStrictMatch);

    // 预览大图
    const preview = {
        isShown: false,
        $root: null,
        $image: null,
        $prevImage: null,
        $nextImage: null,
        $index: null,
        $list: null,
        $curItem: null,
        images: null,
        index: -1,
        init() {
            this.$root = document.createElement('div');
            this.$root.className = 'preview-box';
            this.$root.innerHTML = `
              <div class="preview-image">
                <div class="preview-button" id="prev-image">&lt;</div>
                <div class="preview-button" id="next-image">&gt;</div>
                <div id="preview-index">0 / 0</div>
              </div>
              <div class="preview-list"></div>
              <div class="preview-button" id="preview-close">x</div>`;
            document.body.appendChild(this.$root);
            // 上一张/下一张
            this.$prevImage = this.$root.querySelector('#prev-image');
            this.$nextImage = this.$root.querySelector('#next-image');
            this.$prevImage.onclick = () => this.prev();
            this.$nextImage.onclick = () => this.next();
            // 页码
            this.$index = this.$root.querySelector('#preview-index');
            // 大预览图
            this.$image = this.$root.querySelector('.preview-image');
            // 预览图列表
            this.$list = this.$root.querySelector('.preview-list');
            this.$list.onclick = (e) => {
                if (e.target.classList.contains('preview-item')) {
                    this.slideTo(parseInt(e.target.dataset.index));
                }
            };
            // 关闭
            this.$root.querySelector('#preview-close').onclick = () => this.close();
            // 快捷键
            window.addEventListener('keydown', (e) => {
                if (!this.isShown || e.repeat) return;
                console.log(e.code);
                if (e.code === 'ArrowLeft') this.prev();
                else if (e.code === 'ArrowRight') this.next();
                else if (e.code === 'Escape') this.close();
            });
        },
        show(images, index) {
            this.isShown = true;
            document.body.style.overflow = 'hidden';
            if (!this.$root) this.init();
            else this.$root.classList.remove('hide');
            this.setData(images);
            this.slideTo(index);
        },
        close() {
            this.isShown = false;
            document.body.style.overflow = '';
            this.$root.classList.add('hide')
        },
        setData(images) {
            this.images = images;
            this.$list.innerHTML = images.map((src, i) => `<img src="${src}" data-index="${i}" class="preview-item">`).join('');
            this.$cueItem = null;
        },
        slideTo(index) {
            this.$list.children[this.index]?.classList.remove('cur');
            this.$list.children[index].classList.add('cur');
            this.$list.children[index].scrollIntoView({ behavior: "smooth" });
            this.index = index;
            this.$image.style.backgroundImage = `url(${this.images[index]})`;
            this.$index.textContent = `${index + 1} / ${this.images.length}`;
        },
        prev() {
            this.slideTo(this.index === 0 ? this.images.length - 1 : this.index - 1);
        },
        next() {
            this.slideTo(this.index === this.images.length - 1 ? 0 : this.index + 1);
        }
    };

    // 获取预览图
    const imagesCache = GM_getValue('imagesCache', {});
    async function getImages(url) {
        if (imagesCache[url]) return imagesCache[url];
        const res = await fetch(url);
        const text = await res.text();
        const document = Document.parseHTMLUnsafe(text);
        const images = [...document.querySelectorAll('.panel-body img')].map(img => img.src);
        imagesCache[url] = images;
        GM_setValue('imagesCache', imagesCache);
        return images;
    }
    links.forEach(async (a) => {
        if (isStrictMatch && a.dataset.notStrictMatch === 'true') return;
        const images = await getImages(a.href);
        const imagesList = document.createElement('div');
        imagesList.classList.add('images-list');
        imagesList.innerHTML = images.map((src, i) => `<img src="${src}" data-index="${i}" class="image-item" loading="lazy">`).join('');
        a.closest('td').appendChild(imagesList);
    });
    document.querySelector('tbody').onclick = (e) => {
        if (e.target.className === 'image-item') {
            const images = [...e.target.closest('.images-list').querySelectorAll('img')].map(img => img.src);
            const index = parseInt(e.target.dataset.index);
            preview.show(images, index);
        }
    };

    // 磁力链点击后灰掉整项（当前效果，刷新会重置）
    document.querySelectorAll('.glyphicon-magnet').forEach(i => {
        i.addEventListener('click', () => {
            i.closest('tr').style.opacity = 0.5;
        });
    });
})();
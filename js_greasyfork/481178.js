// ==UserScript==
// @name         Telegraph图片浏览器
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Telegraph图片浏览增强
// @author       montaro2018
// @match        https://telegra.ph/*
// @exclude      https://telegra.ph/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegra.ph
// @resource     https://cdnjs.cloudflare.com/ajax/libs/webfonts/fa-solid-900.woff2
// @resource  fa https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/481178/Telegraph%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481178/Telegraph%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%99%A8.meta.js
// ==/UserScript==


const excludeUrl = "https://telegra.ph/";

unsafeWindow.Vue = Vue;

init();

function init() {
    injectStyle();
    createWrapper();
    var title = getTitle();
    var urls = getImageUrls();
    createVue(urls, title);
}

function injectStyle() {
    var fa = GM_getResourceText("fa");
    fa = fa.replaceAll("../webfonts", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/webfonts");
    GM_addStyle(fa);
    GM_addStyle(`
  .tl_page_wrap {
    display:none;
  }
  #app {
    left: 0;
    top: 0;
    z-index: 99;
    position: absolute;
    width:100%;
    min-height: 100vh;
  }
.photo-viewer {
    background-color: #000;
}

.photo-viewer-header,
.photo-viewer-footer {
    height: 40px;
    display: flex;
    justify-content: center;
    line-height: 40px;
    background-color: #383838;
}

.photo-viewer-header,
.photo-viewer-content,
.photo-viewer-footer {
    color: #fff;
    text-align: center;
}

.photo-viewer-click-left,
.photo-viewer-click-right {
  top: 0;
  left: 0;
  width:50%;
  height: 100%;
  z-index: 99999;
  position: absolute;
}
.photo-viewer-click-right{
  left: 50%;
}

.photo-viewer-content {
    font-size: 0;
    position: relative;
    min-height: calc(100vh - 80px);
}

.photo-viewer-content img {
    max-height: calc(100vh - 80px);
    max-width: 100%;
}

.photo-viewer-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.photo-viewer-counter {
    padding: 0 15px;
}

.photo-viewer-btn:hover {
    cursor: pointer;
    background-color: #525252;
}`);
}

function createWrapper() {
    var app = document.createElement("div");
    app.id = "app";
    document.body.appendChild(app);
}

function getTitle() {
    console.log(document.innerHTML);
    return document.querySelector(".tl_article_header h1").innerText;
}

function getImageUrls() {
    var urls = [];
    var imgs = document.querySelectorAll(".figure_wrapper img");
    imgs.forEach(img => {
        urls.push(img.src);
    })
    return urls;
}

function createVue(urls, title) {
    const { createApp, ref, computed, watch, onMounted } = Vue;
    const app = createApp({
        template: `<photo-viewer :urls="urls" :title="title"/>`,
        setup() {
            return { urls: ref(urls), title: ref(title) };
        }
    });

    app.component(
        "PhotoViewer",
        {
            props: {
                "urls": Array,
                "title": String
            },
            template: `<div class="photo-viewer">
          <div class="photo-viewer-header">{{title}}</div>
          <div class="photo-viewer-content" ref="content">
            <div class="photo-viewer-click-left" @click.stop="clickLeft"></div>
            <div class="photo-viewer-click-right" @click.stop="clickRight"></div>
          </div>
          <div class="photo-viewer-footer">
              <div class="photo-viewer-btn photo-viewer-first" @click="first">
                  <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i>
              </div>
              <div class="photo-viewer-btn photo-viewer-backword" @click="prev">
                  <i class="fa fa-chevron-left"></i>
              </div>
              <div class="photo-viewer-counter">{{counter}}</div>
              <div class="photo-viewer-btn photo-viewer-forward" @click="next">
                  <i class="fa fa-chevron-right"></i>
              </div>
              <div class="photo-viewer-btn photo-viewer-last" @click="last">
                  <i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i>
              </div>
          </div>
      </div>`,
        setup() {
            const currentIndex = ref(0);

            const imgs = ref(urls.map(url => {
                var img = document.createElement("img");
                img.src = url;
                return img;
            }));

            const img = computed(() => {
                return imgs.value[currentIndex.value];
            });

            watch(img, (newImg, oldImg) => {
                if (oldImg != null) {
                    oldImg.remove();
                }
                content.value.appendChild(newImg);
            })

            const total = computed(() => {
                return urls.length;
            })

            const counter = computed(() => {
                return `${currentIndex.value + 1}/${total.value}`
        });

          const content = ref(null);

          const url = computed(() => {
              return urls[currentIndex.value];
          });

          const first = function () {
              currentIndex.value = 0;
          }
          const last = function () {
              if (total.value > 0) {
                  currentIndex.value = total.value - 1;
              }
          }
          const prev = function () {
              if (currentIndex.value > 0) {
                  currentIndex.value--;
              }
          }
          const next = function () {
              if (currentIndex.value < total.value - 1) {
                  currentIndex.value++;

              }
          }
          const clickLeft = function (e) {
              prev();
          }
          const clickRight = function (e) {
              next();
          }

          onMounted(() => {
              document.addEventListener("keydown", e => {
                  if (e.key == "ArrowRight") {
                      next();
                  } else if (e.key == "ArrowLeft") {
                      prev();
                  }
              });
              content.value.appendChild(img.value);
          })
          return { imgs, img, currentIndex, counter, url, first, last, prev, next, clickLeft, clickRight, content };
      }
    }
  );
    app.mount("#app");
}
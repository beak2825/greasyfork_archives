// ==UserScript==
// @name         Image Preview
// @version      0.5
// @license MIT
// @description  preview any image
// @author       You
// @match        https://mp.weixin.qq.com/s*
// @match        https://xie.infoq.cn/article/*
// @match        https://hacks.mozilla.org/*
// @match        https://aotu.io/notes/*
// @match        https://7kms.github.io/*
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11

// @grant        none
// @namespace https://mp.weixin.qq.com/s/*
// @downloadURL https://update.greasyfork.org/scripts/407652/Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/407652/Image%20Preview.meta.js
// ==/UserScript==

(function () {
  // 针对本身是图片的，则不使用
  function shouldIgnore() {
    return /\.(png|jpg|jpeg|svg|gif|webp)$/.test(location.href);
  }

  function initMountedNode() {
    // 插入DOM元素
    const imgPreviewContainer = document.createElement('div');
    imgPreviewContainer.setAttribute('class', 'img-preview-container');
    document.body.appendChild(imgPreviewContainer);
    return imgPreviewContainer;
  }

  function mount(el) {
    // 图片预览组件
    Vue.component('img-preview', {
      props: {
        // 是否显示
        isShow: {
          type: Boolean,
          required: true,
          default: false,
        },

        // 图片url
        picUrl: {
          type: String,
          default: '',
        },
      },
      template: `<transition name="scale">
      <div v-if="isShow && picUrl" class="img-view-wrapper" @click.stop="$emit('update:isShow', false)">
        <img class="img-view" :src="picUrl" alt="not image" />
      </div>
    </transition>`,
      methods: {
        // 固定body不让其滚动
        fixedBody() {
          document.body.style.overflow = 'hidden';
        },
        // 释放body，让其滚动
        looseBody() {
          document.body.style.overflow = 'auto';
        },
      },
      watch: {
        isShow(val) {
          if (val) {
            // 展示
            this.fixedBody();
          } else {
            this.looseBody();
          }
        },
      },
    });

    // 挂载
    const vm = new Vue({
      el,
      data: {
        picUrl: '',
        isShowImgPreview: false,
      },
      template: '<img-preview :pic-url="picUrl" :is-show.sync="isShowImgPreview" />',
      created() {
        // 冒泡阶段处理，避免有些网站把事件拦截掉了
        document.addEventListener(
          'click',
          (ev) => {
            const img = ev.target;
            const { nodeName } = img;
            if (nodeName === 'IMG') {
              // 图片
              this.picUrl = img.getAttribute('src');
              this.isShowImgPreview = true;
            }
          },
          true
        );
      },
    });
  }

  // 添加样式
  function addStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
      .img-view-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: auto;
        z-index: 99999 !important;
        background: rgba(0, 0, 0, 0.6);
      }

      .img-view {
        cursor: zoom-out;
        max-width: 100%;
        max-height: 100%;
      }

      .scale-enter-active,
      .scale-leave-active {
        transition: all 0.4s;
      }

      .scale-enter,
      .scale-leave-to {
        transform: scale(0);
      }`;
    document.head.appendChild(style);
  }

  function main() {
    if (shouldIgnore()) {
      return;
    }

    const el = initMountedNode();
    addStyle();
    mount(el);
  }

  main();
})();

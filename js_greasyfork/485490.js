// ==UserScript==
// @name         🔍一步搜题，自助查题｜无侵入，更安全｜超星学习通｜智慧树｜成人本科｜继续教育｜复制、截图搜题｜超全题库，专业开发，值得信赖
// @version      1.1.2
// @description  一步搜题、自主查题，覆盖范围广，答案全，速度快。安全至上，不侵入主网站网络，不搜集用户信息，不主动提交，安全靠谱有保障，无后顾之忧当。涵盖中学、大学，超星学习通，国家开放大学，智慧树，成人本科，继续教育等题库，支持复制搜题，截图搜题，方便快捷，一步到位，欢迎使用
// @author       You
// @match        *://*/*
// @match        *://超星.com/*
// @match        *://搜题.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://lib.baomitu.com/jquery/3.6.4/jquery.js
// @require      https://lib.baomitu.com/vue/2.6.11/vue.min.js
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_addElement
// @connect      appwk.baidu.com
// @connect      api.ebmonkey.top
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @antifeature  ads      脚本搜索题目时，可能附带广告
// @antifeature  payment  脚本题目搜索，需对接第三方接口付费
// @antifeature  membership 小程序使用，公众号使用
// @namespace https://greasyfork.org/zh-CN/users/1251635-ebsoo
// @downloadURL https://update.greasyfork.org/scripts/485490/%F0%9F%94%8D%E4%B8%80%E6%AD%A5%E6%90%9C%E9%A2%98%EF%BC%8C%E8%87%AA%E5%8A%A9%E6%9F%A5%E9%A2%98%EF%BD%9C%E6%97%A0%E4%BE%B5%E5%85%A5%EF%BC%8C%E6%9B%B4%E5%AE%89%E5%85%A8%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E6%99%BA%E6%85%A7%E6%A0%91%EF%BD%9C%E6%88%90%E4%BA%BA%E6%9C%AC%E7%A7%91%EF%BD%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BD%9C%E5%A4%8D%E5%88%B6%E3%80%81%E6%88%AA%E5%9B%BE%E6%90%9C%E9%A2%98%EF%BD%9C%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%8C%E4%B8%93%E4%B8%9A%E5%BC%80%E5%8F%91%EF%BC%8C%E5%80%BC%E5%BE%97%E4%BF%A1%E8%B5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485490/%F0%9F%94%8D%E4%B8%80%E6%AD%A5%E6%90%9C%E9%A2%98%EF%BC%8C%E8%87%AA%E5%8A%A9%E6%9F%A5%E9%A2%98%EF%BD%9C%E6%97%A0%E4%BE%B5%E5%85%A5%EF%BC%8C%E6%9B%B4%E5%AE%89%E5%85%A8%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E6%99%BA%E6%85%A7%E6%A0%91%EF%BD%9C%E6%88%90%E4%BA%BA%E6%9C%AC%E7%A7%91%EF%BD%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BD%9C%E5%A4%8D%E5%88%B6%E3%80%81%E6%88%AA%E5%9B%BE%E6%90%9C%E9%A2%98%EF%BD%9C%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%8C%E4%B8%93%E4%B8%9A%E5%BC%80%E5%8F%91%EF%BC%8C%E5%80%BC%E5%BE%97%E4%BF%A1%E8%B5%96.meta.js
// ==/UserScript==
$(document).ready(function() {

  if (window.self !== window.top) {
    return;
  }

  // 全局变量
  var show = false;
  var validateKey = '';
  let ebScriptInfo = {
    version: '',
    author: ''
  };
  // var baseEbAddress = 'http://127.0.0.1';
  var baseEbAddress = 'http://api.ebmonkey.top';

  // Header
  Vue.component('eb-header', {
    template:  `
      <div id="ebMyHeader" class="eb-header">
        <div>
        <svg width="136" height="24" viewBox="0 0 136 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="logo">
        <g id="ebsoo" filter="url(#filter0_d_40_1583)">
        <path d="M10.02 13.58H3.44C3.46 15.48 4.26 16.42 6.08 16.42C7.02 16.42 7.84 16.16 8.56 15.48L9.56 17.18C8.42 18.2 7.18 18.44 5.74 18.44C2.46 18.44 1 16.64 1 12.98C1 9.68 2.36 7.56 5.62 7.56C8.6 7.56 10.02 9.48 10.02 12.4V13.58ZM3.44 11.86H7.64C7.64 10.44 6.92 9.54 5.54 9.54C4.14 9.54 3.46 10.46 3.44 11.86ZM21.437 13.02C21.437 16.14 20.417 18.44 17.317 18.44C16.217 18.44 15.297 18.02 14.817 16.86L14.657 18.2H12.457V3.4H14.917V9.04C15.357 8.06 16.197 7.56 17.317 7.56C20.417 7.56 21.437 9.82 21.437 13.02ZM18.937 13.02C18.937 11.42 18.597 9.72 16.917 9.72C15.257 9.72 14.917 11.44 14.917 13.02C14.957 14.82 15.277 16.3 16.917 16.3C18.697 16.3 18.937 14.6 18.937 13.02ZM27.1014 7.56C28.2014 7.56 29.3414 7.76 30.4814 8.58L29.5014 10.42C28.7814 9.92 27.9814 9.6 27.0614 9.6C25.8214 9.6 25.3814 10.22 25.3814 10.74C25.3814 11.28 25.6814 11.74 26.4614 11.84L27.9014 12.04C29.9614 12.32 30.9014 13.38 30.9014 15.08C30.9014 17.38 29.2414 18.42 26.7814 18.42C25.4414 18.42 24.1814 18.2 22.9414 17.32L24.0214 15.44C25.0414 16.14 26.0214 16.3 26.8214 16.3C27.8214 16.3 28.4614 15.96 28.4614 15.18C28.4614 14.66 28.2014 14.2 27.3614 14.08L25.9214 13.84C24.0414 13.58 22.9814 12.62 22.9814 10.88C22.9814 8.7 24.7814 7.56 27.1014 7.56ZM41.6216 12.98C41.6216 16.18 40.6016 18.44 37.1016 18.44C33.6416 18.44 32.6016 16.18 32.6016 12.98C32.6016 9.9 33.5816 7.56 37.1016 7.56C40.6216 7.56 41.6216 9.86 41.6216 12.98ZM39.1216 12.98C39.1216 11.4 38.8816 9.7 37.1016 9.7C35.3416 9.7 35.1016 11.42 35.1016 12.98C35.1016 14.56 35.4416 16.28 37.1016 16.28C38.7816 16.28 39.1216 14.58 39.1216 12.98ZM52.6372 12.98C52.6372 16.18 51.6172 18.44 48.1172 18.44C44.6572 18.44 43.6172 16.18 43.6172 12.98C43.6172 9.9 44.5972 7.56 48.1172 7.56C51.6372 7.56 52.6372 9.86 52.6372 12.98ZM50.1372 12.98C50.1372 11.4 49.8972 9.7 48.1172 9.7C46.3572 9.7 46.1172 11.42 46.1172 12.98C46.1172 14.56 46.4572 16.28 48.1172 16.28C49.7972 16.28 50.1372 14.58 50.1372 12.98Z" fill="white"/>
        </g>
        <g id="&#228;&#184;&#128;&#230;&#173;&#165;&#230;&#144;&#156;&#233;&#162;&#152;" filter="url(#filter1_d_40_1583)">
        <path d="M81.1 9.99V11.862H65.044L64.882 9.99H81.1ZM98.398 11.88C96.472 16.704 93.106 19.17 83.458 19.944L82.9 17.874C89.848 17.406 94.294 15.966 96.022 11.88H98.398ZM92.476 15.372H90.28V11.214H92.476V15.372ZM88.354 11.7L86.086 15.75H83.674L86.122 11.7H88.354ZM92.53 8.838H99.298V10.71H82.936L82.756 8.838H85.546V5.04H87.742V8.838H90.334V3.6H92.53V5.49H98.11V7.326H92.53V8.838ZM114.742 8.856H113.302L113.122 7.308H114.742V6.3C114.742 6.138 114.652 6.066 114.508 6.066H113.356L113.14 4.482H115.48C116.29 4.482 116.722 4.914 116.722 5.706V10.53C116.722 11.322 116.29 11.754 115.48 11.754H112.708V12.888H115.426C116.362 12.888 116.686 13.5 116.416 14.454C116.11 15.534 115.192 16.56 113.842 17.424C114.85 17.658 116.02 17.82 117.388 17.892L116.866 19.764C114.652 19.566 112.888 19.224 111.412 18.63C109.882 19.206 108.082 19.602 106.156 19.764L105.652 17.946C107.02 17.838 108.226 17.658 109.27 17.406C108.442 16.776 107.704 15.966 107.02 14.976H109.252C109.828 15.642 110.584 16.218 111.556 16.668C112.798 16.128 113.68 15.408 114.238 14.544H106.894L106.678 12.888H110.62V11.754H107.884C107.074 11.754 106.624 11.322 106.624 10.53V5.85C106.624 5.094 106.984 4.662 107.758 4.536L110.008 4.158V5.832L108.982 5.976C108.748 6.012 108.604 6.174 108.604 6.408V7.308H110.008V8.856H108.604V9.954C108.604 10.116 108.694 10.17 108.82 10.17H110.62V3.654H112.708V10.17H114.508C114.652 10.17 114.742 10.098 114.742 9.954V8.856ZM104.572 12.96V17.838C104.572 19.08 103.888 19.728 102.808 19.836C102.304 19.89 101.782 19.908 101.224 19.746L100.738 17.946C101.17 18.108 101.566 18.144 101.962 18.108C102.286 18.072 102.52 17.838 102.52 17.352V13.356L100.936 13.662L100.702 11.79L102.52 11.502V8.352H100.972L100.792 6.588H102.52V3.636H104.572V6.588H105.976V8.352H104.572V11.16L105.994 10.926V12.69L104.572 12.96ZM125.164 4.122C125.884 4.122 126.388 4.626 126.388 5.346V9.414C126.388 10.134 125.884 10.638 125.164 10.638H120.79C120.07 10.638 119.566 10.134 119.566 9.414V5.346C119.566 4.626 120.07 4.122 120.79 4.122H125.164ZM131.536 12.816C132.292 14.22 133.228 14.994 134.794 15.48L134.326 17.514C132.868 17.082 131.536 16.146 130.798 14.904C130.168 15.876 129.07 16.686 127.234 17.514L126.658 15.606C129.322 14.436 129.736 13.41 129.736 11.88V8.964H131.59V11.88C131.59 12.204 131.572 12.51 131.536 12.816ZM131.41 5.796L131.212 6.75H133.012C133.786 6.75 134.2 7.182 134.2 7.938V13.536H132.292V8.73C132.292 8.568 132.202 8.478 132.04 8.478H129.25C129.106 8.478 128.998 8.568 128.998 8.73V13.536H127.09V7.938C127.09 7.182 127.522 6.75 128.278 6.75H129.322L129.52 5.796H127L126.838 4.176H134.686V5.796H131.41ZM124.516 17.352C125.362 17.514 126.406 17.568 127.738 17.568H135.406L134.92 19.368H127.792C124.354 19.368 122.5 19.098 121.294 17.748C121.132 18.432 120.898 19.098 120.556 19.8H118.558C119.584 17.784 119.746 15.984 119.71 13.302H121.582C121.6 13.914 121.6 14.472 121.6 14.976C121.834 15.588 122.14 16.074 122.536 16.434V12.96H119.044L118.9 11.16H126.568V12.96H124.516V14.094H126.406V15.822H124.516V17.352ZM124.48 8.208H121.474V8.64C121.474 8.82 121.564 8.91 121.744 8.91H124.21C124.39 8.91 124.48 8.82 124.48 8.64V8.208ZM124.48 6.552V6.12C124.48 5.94 124.39 5.85 124.21 5.85H121.744C121.564 5.85 121.474 5.94 121.474 6.12V6.552H124.48Z" fill="white"/>
        </g>
        <g id="Rectangle 2" filter="url(#filter2_d_40_1583)">
        <rect x="58" y="6" width="2" height="12" fill="white"/>
        </g>
        </g>
        <defs>
        <filter id="filter0_d_40_1583" x="1" y="3.40002" width="52.1372" height="15.5399" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="0.5" dy="0.5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_40_1583"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_40_1583" result="shape"/>
        </filter>
        <filter id="filter1_d_40_1583" x="64.8821" y="3.59998" width="71.0239" height="16.844" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="0.5" dy="0.5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_40_1583"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_40_1583" result="shape"/>
        </filter>
        <filter id="filter2_d_40_1583" x="58" y="6" width="2.5" height="12.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="0.5" dy="0.5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_40_1583"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_40_1583" result="shape"/>
        </filter>
        </defs>
        </svg>
        
        </div>
        <div class="eb-close-icon" @click="closeEv">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 1">
        <path id="Vector" d="M16.5766 3.42342C16.4764 3.32318 16.375 3.2276 16.2712 3.13318C17.9253 6.59162 17.3227 10.859 14.4575 13.7242C10.9256 17.256 5.25947 17.3528 1.60986 14.0144C2.05281 14.9399 2.65661 15.8095 3.42359 16.5765C7.05572 20.2086 12.9445 20.2086 16.5766 16.5765C20.2088 12.9443 20.2088 7.05555 16.5766 3.42342Z" fill="white" fill-opacity="0.3"/>
        <path id="Vector_2" d="M17.0708 2.92925C15.1824 1.04091 12.6705 0 10 0C7.32953 0 4.81758 1.03975 2.92925 2.92925C1.04091 4.81758 0 7.32953 0 10C0 12.6705 1.03975 15.1824 2.92925 17.0708C4.81758 18.9591 7.32953 20 10 20C12.6716 20 15.1824 18.9603 17.0708 17.0708C18.9591 15.1824 20 12.6705 20 10C20 7.32953 18.9603 4.81758 17.0708 2.92925ZM16.0823 16.0823C14.4574 17.7072 12.2986 18.6012 10.0012 18.6012C7.70369 18.6012 5.54377 17.7072 3.91887 16.0823C2.29397 14.4574 1.39993 12.2975 1.39993 10C1.39993 7.70253 2.29397 5.5426 3.91887 3.91771C5.54377 2.29281 7.70369 1.39876 10.0012 1.39876C12.2986 1.39876 14.4586 2.29281 16.0823 3.91771C17.7072 5.5426 18.6012 7.70253 18.6012 10C18.6012 12.2975 17.706 14.4574 16.0823 16.0823Z" fill="white"/>
        <path id="Vector_3" d="M14.5775 5.42255C14.4464 5.29158 14.2686 5.21802 14.0833 5.21802C13.898 5.21802 13.7202 5.29158 13.5891 5.42255L10.0012 9.01039L6.41224 5.42255C6.2811 5.29158 6.10334 5.21802 5.91801 5.21802C5.73267 5.21802 5.55491 5.29158 5.42378 5.42255C5.2928 5.55369 5.21924 5.73145 5.21924 5.91678C5.21924 6.10212 5.2928 6.27988 5.42378 6.41101L9.01161 9.99885L5.42378 13.5867C5.32609 13.6845 5.25958 13.809 5.23264 13.9446C5.20571 14.0802 5.21956 14.2207 5.27244 14.3485C5.32533 14.4762 5.41487 14.5854 5.52977 14.6622C5.64467 14.7391 5.77977 14.7802 5.91801 14.7803C6.09635 14.7803 6.27586 14.7115 6.41224 14.5751L10.0001 10.9873L13.5879 14.5751C13.6528 14.6401 13.7298 14.6917 13.8146 14.7268C13.8994 14.762 13.9903 14.7801 14.0821 14.7801C14.1739 14.7801 14.2648 14.762 14.3497 14.7268C14.4345 14.6917 14.5115 14.6401 14.5764 14.5751C14.7073 14.444 14.7809 14.2662 14.7809 14.0809C14.7809 13.8956 14.7073 13.7178 14.5764 13.5867L10.9885 9.99885L14.5764 6.41101C14.8503 6.13942 14.8503 5.69648 14.5775 5.42255Z" fill="white"/>
        </g>
        </svg>
        
        </div>
      </div>
    `,
    data: function() {
      return {
        draggleId: 'ebMyHeader',
        targetId: 'ebsooWrap0104',
        state: {
          dragging: false,
          initX: 0,
          initY: 0,
          transX: 0,
          transY: 0,
          moveX: 0,
          moveY: 0,
        }
      }
    },
    mounted() {
      this.makeDraggable(this.state, document.getElementById(this.draggleId),  document.getElementById(this.targetId));
    },
    methods: {
      closeEv() {
        ebToggleOpenClose();
      },


      makeDraggable(state, el, target) {
        function globalMousemove(event) {
          const { clientX, clientY } = event;
          const { initX, initY, transX, transY } = state;
          const moveX = clientX - initX;
          const moveY = clientY - initY;
          target.style.transform = `translate(${transX + moveX}px, ${transY + moveY}px)`;
          state.moveX = moveX;
          state.moveY = moveY;
          state.dragging = true;
        }

        function globalMouseup(_event) {
          const { transX, transY, moveX, moveY } = state;
          state.transX = transX + moveX;
          state.transY = transY + moveY;
          state.moveX = 0;
          state.moveYY = 0;
          document.removeEventListener('mousemove', globalMousemove);
          document.removeEventListener('mouseup', globalMouseup);
          state.dragging = null;
        }

        function mousedown(event) {
          const {clientX, clientY} = event;
          state.initX = clientX;
          state.initY = clientY;
          document.addEventListener('mousemove', globalMousemove);
          document.addEventListener('mouseup', globalMouseup);
        }

        el.addEventListener('mousedown', mousedown);
      }
    }
  });

  // Tab 组件
  Vue.component('eb-tab', {
    data: function () {
      return {
        tabList: [
          { name: '搜题' },
          { name: '设置' }
        ],
        currentIndex: 0
      }
    },
    template: `
      <div class="eb-tab-container">
        <div v-for="(tab, idx) in tabList" class="eb-tab" v-bind:class="{ active:  currentIndex == idx }" @click="switchTab(idx)">{{tab.name}}</div>
        <div class="eb-tab-bg" v-bind:class="{ config: currentIndex == 1}"></div>
      </div>
    `,
    methods: {
      switchTab(idx) {
        this.currentIndex = idx;
        this.$emit('switch-tab', idx);
      }
    }
  });

  // Key 输入
  Vue.component('eb-key-context', {
    data: function () {
      return {
        yourKey: '',
      }
    },
    template: `
      <div class="eb-key-context">
        <input id="ebConfigKeyInput" class="eb-key-input" maxlength="16" placeholder="请输入校验码" v-model="yourKey" @input="handleEbKeyInput" />
        <div class="eb-key-pur" @click="toEbSet()">获取校验码 ></div>
      </div>
    `,

    mounted() {
      ebGetValue('ebKey').then(res => {
        let key = JSON.parse(res).key
        this.yourKey = key;
        validateKey = this.yourKey;
      })
    },
    methods: {
      handleEbKeyInput(event) {
        setTimeout(() => {
          validateKey = this.yourKey;
          ebSetValue('ebKey', {
            key: validateKey
          })
        }, 100);
      },

      toEbSet() {
        ebVmdf.$refs.ebSwitchTabRef.switchTab(1);
      }
    }
  });

  // 搜索
  Vue.component('eb-content-search', {
    template: `
      <div class="eb-content-search-container">
        <eb-key-context></eb-key-context>
        <div class="eb-editor-container">
          <iframe id="ebTextIFrame" ref="ebTextIFrame" style="line-height:normal;" width="100%" height="100" frameborder="no"></iframe>
          <div class="eb-editor-footer">
            <div class="eb-btn primary" @click="submit">搜索</div>
            <div class="eb-btn bordered" @click="clear">清空</div>
            <div v-if="remainCount > 0" class="eb-remain-count">剩余{{remainCount}}次</div>
          </div>
        </div>
        <div id="adkfuasdgku" class="eb-answers" v-if="dataList.length">
          <div class="fk-answer-item" v-for="(item, index) in dataList">
            <div class="eb-question" v-html="item.question">{{index}}</div>
            <div class="eb-options-wrap" v-if="item.options.length">
              <div class="eb-label">选项：</div>
              <div v-for="(option, idx) in item.options">{{idx + 1}}、{{option}}</div>
            </div>
            <div class="eb-answer-wrap" v-if="item.answer.length">
              <div class="eb-label">答案：</div>
              <div class="fk-answer" v-for="(answer, idx) in item.answer" v-html="answer">

              </div>
            </div>
            <div class="eb-answer-wrap" v-if="item.errMsg">
              <div class="eb-label">答案：</div>
              <div class="fk-wrong-res"><svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path id="&#233;&#148;&#129;" fill-rule="evenodd" clip-rule="evenodd" d="M7.74699 1.78244C7.28366 1.31912 6.65526 1.05882 6.00002 1.05882C5.34477 1.05882 4.71637 1.31912 4.25305 1.78244C3.78972 2.24577 3.52943 2.87417 3.52943 3.52941V4.94118H8.4706V3.52941C8.4706 2.87417 8.21031 2.24577 7.74699 1.78244ZM9.52943 4.94118V3.52941C9.52943 2.59335 9.15758 1.69563 8.49569 1.03374C7.83379 0.371848 6.93607 0 6.00002 0C5.06396 0 4.16624 0.371848 3.50434 1.03374C2.84245 1.69563 2.4706 2.59335 2.4706 3.52941V4.94118H2.11765C1.55601 4.94118 1.01738 5.16429 0.620245 5.56142C0.223109 5.95856 0 6.49719 0 7.05882V12C0 12.5616 0.223109 13.1003 0.620245 13.4974C1.01738 13.8945 1.55601 14.1177 2.11765 14.1177H9.88236C10.444 14.1177 10.9826 13.8945 11.3798 13.4974C11.7769 13.1003 12 12.5616 12 12V7.05882C12 6.49719 11.7769 5.95856 11.3798 5.56142C10.9826 5.16429 10.444 4.94118 9.88236 4.94118H9.52943ZM9.52943 6H2.4706L2.11765 6C1.83683 6 1.56751 6.11156 1.36895 6.31012C1.17038 6.50869 1.05882 6.77801 1.05882 7.05882V12C1.05882 12.2808 1.17038 12.5501 1.36895 12.7487C1.56751 12.9473 1.83683 13.0588 2.11765 13.0588H9.88236C10.1632 13.0588 10.4325 12.9473 10.6311 12.7487C10.8296 12.5501 10.9412 12.2808 10.9412 12V7.05882C10.9412 6.77801 10.8296 6.50869 10.6311 6.31012C10.4325 6.11156 10.1632 6 9.88236 6L9.52943 6ZM5.62566 10.9626C5.72495 11.0619 5.85961 11.1176 6.00002 11.1176C6.14042 11.1176 6.27508 11.0619 6.37437 10.9626C6.47365 10.8633 6.52943 10.7286 6.52943 10.5882V8.47059C6.52943 8.33018 6.47365 8.19552 6.37437 8.09624C6.27508 7.99695 6.14042 7.94118 6.00002 7.94118C5.85961 7.94118 5.72495 7.99695 5.62566 8.09624C5.52638 8.19552 5.4706 8.33018 5.4706 8.47059V10.5882C5.4706 10.7286 5.52638 10.8633 5.62566 10.9626Z" fill="#999999"/>
              </svg>{{item.errMsg || '服务异常'}}</div>
            </div>
            <div class="eb-answer-wrap" v-if="item.analysis">
              <div class="eb-label">解析：</div>
              <div class="fk-analysis"  v-html="item.analysis">
              </div>
            </div>
          </div>
        </div>
        <div class="eb-no-answers" v-if="!dataList.length">
          <img src="https://cdnjson.com/images/2024/04/18/Group-152xe971416c6ee82cb6.png" alt="Group-152xe971416c6ee82cb6.png" border="0">
          <div>输入校验码和题目后搜索</div>
        </div>
        <eb-loading v-show="showLoading"></eb-loading>
      </div>
    `,
    mounted() {
      setTimeout(() => {
        let iframeRef = document.getElementById('ebTextIFrame')
        var iframeDoc = iframeRef.contentDocument || iframeRef.contentWindow.document;
        $(iframeDoc.body).append($('<div id="ebRealTextInput" class="eb-real-text-input" contenteditable="true"></div>'));
        this.iframeDoc = iframeDoc;

        var style = iframeDoc.createElement('style');
        style.textContent = `
            body {
              margin: 0; background-color: #fff; line-height: normal;
            }
            .eb-real-text-input {
              box-sizing: border-box; width: 374px;height: 100px;background: #F5F7FB;border-radius: 8px 8px 8px 8px;padding: 10px 12px;font-weight: 500;font-size: 14px;color: #282828;
            }
            .eb-real-text-input:empty::before {
              content: '输入题目或者截图进来，然后搜索';
              color: #CCC;
              font-weight: normal;
            }
            .eb-real-text-input:focus {
              border: none; outline: none;
            }
        `;
        iframeDoc.head.appendChild(style);

        this.iframeDoc.getElementById('ebRealTextInput').addEventListener("keydown", function(event) {
          if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            ebEnterThrottle();
          }
        });
      }, 500)
    },
    data: function() {
      return {
        showLoading: false,
        remainCount: 0,
        dataList: [],
        iframeDoc: {}
      }
    },

    methods: {
      submit() {

        let allText = this.iframeDoc.getElementById('ebRealTextInput').innerText;
        allText = allText.replace(/\n|\t|\s/g, '');

        let imgSrc = '';
        let imgDom = this.iframeDoc.querySelector('img');
        if (imgDom) {
          imgSrc = imgDom.src;
        }
      
        if (allText) {
          this.fetchAnswer(allText.substring(0,2000), 1);
        } else if (imgSrc) {
          this.imgHandle(imgSrc).then(res => {
            this.imgOcr(res).then(val => {
              this.fetchAnswer(val, 2);
            })
          })
        } else {
          alert('请输入文字，或者复制截图进来');
          return;
        }
      },

      clear() {
        this.iframeDoc.getElementById('ebRealTextInput').innerHTML = '';
      },

      fetchAnswer(question, type) {
        if (!question) {
          alert('请输入文字，或者复制截图进来');
          return;
        }

        if (question.length < 5) {
          alert(`至少输入5个字，当前值： ${question}`);
          return;
        }

        this.showLoading = true;

        let prodHost = baseEbAddress + '/search/qs?key=' + (validateKey ?  String(validateKey).trim() : '');
        ebProxyHttp('POST', prodHost, {
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            keyWord: question,
            href: location.href || '',
            host: location.host || '',
            type: type || ''
          })
        }).then(response => {
          let responseData = JSON.parse(response.responseText);
          let code = responseData.code;
          let msg = responseData.msg;
          if (code == 1) {
            let dataList = responseData.data.data;
            this.remainCount = responseData.data.remainCount;
            this.dataList = dataList;
            this.showLoading = false;
            $('#adkfuasdgku').scrollTop(0);
            if (!dataList.length) {
              alert('未搜到到相关结果');
            }
          } else {
            this.showLoading = false;
            alert(msg)
          }
        }).catch(_ => {
          this.showLoading = false;
          alert('出错了，请反馈');
        })
      },

      imgHandle(base64) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const image = new Image();
            image.setAttribute("crossOrigin", "Anonymous");
            image.src = base64;
            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                context.fillStyle = "#fff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
                canvas.toBlob(blob => {
                    resolve(blob);
                });
            };
        });
      },
    
      imgOcr(blob) {
        return new Promise((resolve, reject) => {
            var fd = new FormData();
            fd.append("image", blob, "1.png");
            GM_xmlhttpRequest({
                url: "https://appwk.baidu.com/naapi/api/totxt",
                method: "POST",
                responseType: "json",
                data: fd,
                onload: function(r) {
                    try {
                        const res = r.response.words_result.map(item => {
                            return item.words;
                        }).join("");
                        resolve(res);
                    } catch (err) {
                        resolve("");
                    }
                }
            });
        });
      }
    }
  });

  // 配置
  Vue.component('eb-config-set', {
    template: `
      <div class="eb-config-set">
        <div class="eb-config-name">校验码获取方式：</div>
        <div class="eb-way-to-get">
          <div class="eb-config-other" v-html="otherHtml"></div>
        </div>

        <div class="eb-config-name" style="padding-top: 4px; border-top: dashed #ccc 1px;">设置：</div>
        <div class="eb-form-line">
          <div class="eb-form-label">主题色：</div>
          <div class="eb-form-value">
            <div class="eb-color-block eb-colorful" @click="changeTheme(1)">亮色</div>
            <div class="eb-color-block eb-btn-grey" @click="changeTheme(2)">暗色</div>
          </div>
        </div>
      </div>
    `,
    mounted() {

      let url = `${baseEbAddress}/otherInfo?author=${ebScriptInfo.author}&version=${ebScriptInfo.version}`;
      ebProxyHttp('GET', url).then(res => {
        let responseData = JSON.parse(res.responseText);
        console.log('responseData', responseData)
        if (responseData.code == 1) {
          console.log('responseData', responseData.data)
          this.otherHtml = responseData.data.text;
        }
      }).catch(_err => {
        console.log('err', _err)
      })

      ebGetValue('ebTheme').then(res => {
        let type = JSON.parse(res).key || 1;
        this.ebTheme = type;
      }).catch(_ => {
        this.ebTheme = 1;
      });
    },
    data: function() {
      return {
        topDis: '',
        rightDis: '',
        otherHtml: '',
        ebTheme: 1
      }
    },
    methods: {
      changeTheme(type) {
        this.ebTheme = type;
        ebSwitchTheme(type)
      }
    }
  });

  // loading
  Vue.component('eb-loading', {
    template: `
      <div class="eb-loading-wrap">
       <svg t="1710311969650" class="icon eb-loading-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6524" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M511.882596 287.998081h-0.361244a31.998984 31.998984 0 0 1-31.659415-31.977309v-0.361244c0-0.104761 0.115598-11.722364 0.115598-63.658399V96.000564a31.998984 31.998984 0 1 1 64.001581 0V192.001129c0 52.586273-0.111986 63.88237-0.119211 64.337537a32.002596 32.002596 0 0 1-31.977309 31.659415zM511.998194 959.99842a31.998984 31.998984 0 0 1-31.998984-31.998984v-96.379871c0-51.610915-0.111986-63.174332-0.115598-63.286318s0-0.242033 0-0.361243a31.998984 31.998984 0 0 1 63.997968-0.314283c0 0.455167 0.11921 11.711527 0.11921 64.034093v96.307622a31.998984 31.998984 0 0 1-32.002596 31.998984zM330.899406 363.021212a31.897836 31.897836 0 0 1-22.866739-9.612699c-0.075861-0.075861-8.207461-8.370021-44.931515-45.094076L195.198137 240.429485a31.998984 31.998984 0 0 1 45.256635-45.253022L308.336112 263.057803c37.182834 37.182834 45.090463 45.253022 45.41197 45.578141A31.998984 31.998984 0 0 1 330.899406 363.021212zM806.137421 838.11473a31.901448 31.901448 0 0 1-22.628318-9.374279L715.624151 760.859111c-36.724054-36.724054-45.018214-44.859267-45.097687-44.93874a31.998984 31.998984 0 0 1 44.77618-45.729864c0.32512 0.317895 8.395308 8.229136 45.578142 45.411969l67.88134 67.88134a31.998984 31.998984 0 0 1-22.624705 54.630914zM224.000113 838.11473a31.901448 31.901448 0 0 0 22.628317-9.374279l67.88134-67.88134c36.724054-36.724054 45.021826-44.859267 45.097688-44.93874a31.998984 31.998984 0 0 0-44.776181-45.729864c-0.32512 0.317895-8.395308 8.229136-45.578142 45.411969l-67.88134 67.884953a31.998984 31.998984 0 0 0 22.628318 54.627301zM255.948523 544.058589h-0.361244c-0.104761 0-11.722364-0.115598-63.658399-0.115598H95.942765a31.998984 31.998984 0 1 1 0-64.00158h95.996952c52.586273 0 63.88237 0.111986 64.337538 0.11921a31.998984 31.998984 0 0 1 31.659414 31.97731v0.361244a32.002596 32.002596 0 0 1-31.988146 31.659414zM767.939492 544.058589a32.002596 32.002596 0 0 1-31.995372-31.666639v-0.361244a31.998984 31.998984 0 0 1 31.659415-31.970085c0.455167 0 11.754876-0.11921 64.34115-0.11921h96.000564a31.998984 31.998984 0 0 1 0 64.00158H831.944685c-51.936034 0-63.553638 0.111986-63.665624 0.115598h-0.335957zM692.999446 363.0176a31.998984 31.998984 0 0 1-22.863126-54.381656c0.317895-0.32512 8.229136-8.395308 45.41197-45.578141l67.88134-67.884953A31.998984 31.998984 0 1 1 828.693489 240.429485l-67.892177 67.88134c-31.020013 31.023625-41.644196 41.759794-44.241539 44.393262l-0.697201 0.722488a31.908673 31.908673 0 0 1-22.863126 9.591025z" fill="" p-id="6525"></path></svg>
      </div>
    `,
    data: function() {

    },
    methods: {

    }
  });

  let httpClient = GM.xmlHttpRequest ? GM.xmlHttpRequest : (GM_xmlhttpRequest || null);

  const styleText = GM_getResourceText("snow");
  GM_addStyle(styleText);
  GM_addStyle(`
    #ebsooWrap0104 {
      padding-top: 32px;display: none;flex-direction: column; position: fixed;top: 100px;right: 100px;width: 400px;height: 600px;background-color: #fff;z-index:9999;border: solid #FF6C31 1px;overflow: hidden; transform: translate(0, 0);
    }
    #ebsooWrap0104 div {
      margin: unset;
    }
    #ebsooWrap0104 #ebMyHeader {
      position: absolute;left: 0;top: 0;right: 0;height: 72px;padding: 4px 8px;text-align: left;background: linear-gradient(270deg, #FF9800 0%, #FF6C31 100%); cursor: move;font-weight: bold; color: #fff; border-radius: 0px;user-select: none;font-size: 20px;
    }
    #ebsooWrap0104 #ebMyHeader .eb-close-icon {
      position: absolute; right: 8px; top: 3px; cursor: pointer;
    }
    #ebsooWrap0104 .eb-view-content {
      position: relative; height: calc(100% - 40px); background-color: #fff;
    }
    #ebsooWrap0104 .eb-content-search-container {
      height: 100%;display: flex;flex-direction: column; padding: 0 12px;
    }
    #ebsooWrap0104 .eb-editor-container {
      flex-shrink: 0; 
    }
    #ebsooWrap0104 .eb-editor-footer {
      position: relative; display: flex; align-items: center; height: 28px;line-height: 28px;box-sizing: border-box;text-align: center;
    }
    #ebsooWrap0104 .eb-editor-footer .eb-btn {
      width: 60px; height: 28px; line-height: 28px;text-align: center; border-radius: 16px; cursor: pointer; font-size: 14px; letter-spacing: 1px; font-weight: 500;
    }
    #ebsooWrap0104 .eb-editor-footer .eb-btn.primary {
      margin-right: 8px; background: linear-gradient( 270deg, #FF9800 0%, #FF6C31 100%); color: #fff;
    }
    #ebsooWrap0104 .eb-editor-footer .eb-btn.bordered {
      border: 1px solid #BBBBBB; color: #282828; line-height: 26px;
    }
    #ebsooWrap0104 .eb-editor-footer .eb-remain-count {
      position: absolute; right: 10px; font-weight: bold;
    }
    #ebsooWrap0104 .eb-answers {
      flex: 1;text-align: left;overflow-y: scroll; margin-top: 12px;
    }
    #ebsooWrap0104 .eb-answers .fk-answer-item {
      padding: 10px 12px; border: dashed #BBB 1px; margin-bottom: 6px; border-radius: 8px;
    }
    #ebsooWrap0104 .eb-answers .fk-answer-item .eb-question,
    #ebsooWrap0104 .eb-options-wrap,
    #ebsooWrap0104 .eb-answer-wrap {
      font-size: 13px; line-height: 17px;
    }
    #ebsooWrap0104 .fk-answer {
      padding: 0 8px; width: fit-content; min-height: 24px; line-height: 24px; background: rgba(0,160,64,0.08); border-radius: 4px; margin-bottom: 4px; color: #00A040;
    }
    #ebsooWrap0104 .fk-wrong-res {
      width: 100%; height: 40px; line-height: 40px; background: #F5F7FB;border-radius: 8px;font-size: 14px;color: #999999; text-align: center; display: flex; align-items: center; justify-content: center;
    }
    #ebsooWrap0104 .fk-wrong-res svg {
      margin-right: 5px;
    }
    #ebsooWrap0104 .fk-analysis {
      padding: 4px;
    }
    #ebsooWrap0104 .eb-answers em {
      color: #FF5700;font-style: normal;margin: 0 1px;
    }

    #ebsooWrap0104 .eb-label {
      font-size: 14px;margin-top: 8px; margin-bottom: 4px;width: fit-content;color:#999;
    }

    #ebsooWrap0104 .eb-no-answers {
      padding-top: 60px; display: flex; flex-direction: column; align-items: center;font-size: 12px;color: #999999;
    }
    #ebsooWrap0104 .eb-no-answers img {
      width: 100px; height: 100px; margin-bottom: 12px;
    }

    #ebsooWrap0104 .eb-tab-container {
      position: relative; height: 40px; background: linear-gradient( 180deg, #E3E3EE 0%, #FFFFFF 100%); display: flex; justify-content: space-between; z-index: 2; border-top-left-radius: 12px;border-top-right-radius: 12px;
    }
    #ebsooWrap0104 .eb-tab-container .eb-tab {
      position: relative; box-sizing: border-box; width: 200px; position: relative;top: 1px;height: 40px;line-height: 40px;text-align: center;cursor: pointer; z-index: 10000;font-size: 16px; color: #2D2D2D;
    }
    #ebsooWrap0104 .eb-tab-container .eb-tab.active {
      font-weight: 600;
    }
    #ebsooWrap0104 .eb-tab-container .eb-tab-bg {
      position: absolute; left: 0; top: 0; width: 210px; height: 40px;background-image: url('https://cdnjson.com/images/2024/04/18/tab-selectd1ff93d117888cae.png');background-size: 210px auto; z-index: 9999;
    }
    #ebsooWrap0104 .eb-tab-container .eb-tab-bg.config {
      left: 190px; transform: rotateY(180deg);
    }

    #ebsooWrap0104 .eb-key-context {
      height: 52px; padding: 8px 0;display: flex; align-items: center;justify-content: space-between;border-bottom: 1px dashed #E5E5E5;margin-bottom: 12px;
    }

    #ebsooWrap0104 .eb-key-context .eb-key-input {
      box-sizing: border-box; width: 240px;height: 32px; padding: 6px 12px; background: #F5F7FB;border-radius: 8px 8px 8px 8px;border: 1px solid #FF5700;font-size: 12px; color: #282828; text-align: left;
    }
    #ebsooWrap0104 .eb-key-context .eb-key-input::placeholder {
      color: #ccc;
    }
    #ebsooWrap0104 .eb-key-context .eb-key-input:focus {
      outline: none;
    }

    #ebsooWrap0104 .eb-key-context  .eb-key-pur {
      font-weight: 500;font-size: 14px;color: #FF5700; cursor: pointer;
    }

    #ebsooWrap0104 .eb-config-set {
      padding: 0px 16px; text-align: left; user-select: none;
    }
    #ebsooWrap0104 .eb-config-set .eb-config-name {
      font-size: 16px;color: #333;font-weight: bold;margin-bottom: 12px;
    }
    #ebsooWrap0104 .eb-config-set .eb-form-line {
      display: flex; align-items: center;
    }
    #ebsooWrap0104 .eb-config-set .eb-form-line .eb-form-label {
      width: 80px;
    }
    #ebsooWrap0104 .eb-config-set .eb-form-line .eb-form-value {
      flex: 1;
    }
    #ebsooWrap0104 .eb-form-value .eb-color-block {
      box-sizing: border-box; display: inline-block; width: 60px;height: 28px;line-height: 28px;text-align: center;border-radius: 16px;cursor: pointer;font-size: 14px;letter-spacing: 1px;font-weight: 500;
    }
    #ebsooWrap0104 .eb-form-value .eb-color-block.eb-colorful {
      background: linear-gradient(270deg, #FF9800 0%, #FF6C31 100%);color: #fff; margin-right: 8px;
    }
    #ebsooWrap0104 .eb-form-value .eb-color-block.eb-btn-grey {
      border: 1px solid #BBBBBB;color: #282828;
    }
    #ebsooWrap0104 .eb-config-set .eb-config-key-btn {
      margin:0 4px; width: 64px; height: 30px; line-height: 28px;text-align: center; border-radius: 6px; cursor: pointer; font-size: 14px; letter-spacing: 2px; color: #212529; border: 1px solid #212529;
    }
    #ebsooWrap0104 .eb-config-set .eb-way-to-get {
      padding-left: 0;
    }
    #ebsooWrap0104 .eb-config-set .eb-way-to-get .eb-way-item {
      margin-bottom: 12px;
    }
    #ebsooWrap0104 .eb-config-set .eb-way-to-get .eb-way-label {
      margin-bottom: 12px;
    }
    #ebsooWrap0104 .eb-config-set .eb-get-key {
      height: 36px;line-height: 36px;text-align: center;width: 130px;background: linear-gradient(270deg, #FF9800 0%, #FF6C31 100%);color: #fff;border-radius: 12px;font-size: 14px;letter-spacing: 2px; cursor: pointer;animation: ebBtnAni 2s infinite;
    }
    @keyframes ebBtnAni {
      0% {
        scale: 1
      }
      50% {
        scale: 0.9
      }
      100% {
        scale: 1
      }
    }
    #ebsooWrap0104 .eb-config-set .eb-config-key-btn.edit {
      background-color: #198754; color: #fff; border: 1px solid #198754;
    }

    #ebsooWrap0104 .eb-loading-wrap {
      position: absolute;left: 0;top: 0;right: 0;bottom: 0;background-color: rgba(0,0,0,0.05);text-align: center;
    }
    .eb-loading-wrap .eb-loading-icon {
      margin-top: 50%; display: inline; width: 50px;
    }
    .eb-trigger-btn {
      position: fixed; right: 0;bottom:50%; width: 40px; height: 56px; line-height: 56px; background: linear-gradient(270deg, #FF9800 0%, #FF6C31 100%); color: #fff; cursor: pointer;border-top-left-radius:8px; border-bottom-left-radius: 10px; text-align: center; font-size: 20px; user-select: none;z-index: 99999;
    }
    .eb-trigger-btn.eb-grey {
      background: linear-gradient(270deg, #afafaf 0%, #afafaf 100%)
    }
    #ebsooWrap0104.eb-grey  {
      border: solid #afafaf 1px;
    }
    #ebsooWrap0104.eb-grey #ebMyHeader,
    #ebsooWrap0104.eb-grey .eb-btn.primary,
    #ebsooWrap0104.eb-grey .eb-get-key {
      background: linear-gradient(270deg, #afafaf 0%, #afafaf 100%);
    }
    #ebsooWrap0104.eb-grey #ebConfigKeyInput {
      border-color: #afafaf;
    }
    #ebsooWrap0104.eb-grey .eb-key-pur {
      color: #afafaf;
    }
    #ebsooWrap0104.eb-grey .eb-no-answers img {
      filter: contrast(0.3);
    }
    #ebsooWrap0104.eb-grey .eb-config-set {
      filter: grayscale(1);
    }

    #ebsooWrap0104.eb-grey .eb-form-value .eb-color-block.eb-colorful {
      border: 1px solid rgb(187, 187, 187);color: rgb(40, 40, 40); background: none;
    }
    #ebsooWrap0104.eb-grey .eb-form-value .eb-color-block.eb-btn-grey {
      background-color: #BBBBBB; color: #fff;
    }
  `);

  var $wrap = $(`
  <div id="ebsooWrap0104">
    <eb-header></eb-header>
    <eb-tab @switch-tab="handleSwitchTab" ref="ebSwitchTabRef"></eb-tab>
    <div class="eb-view-content">
      <eb-content-search ref="ebContentSearchRef" v-show="currentTabIdx == 0" @patch-remain-count="handlePatchRemainCount"></eb-content-search>
      <eb-config-set :remianCount="remainCount"  v-show="currentTabIdx == 1"></eb-config-set>
    </div>
  </div>
  <div id="ebTriggerBtn" class="eb-trigger-btn">开</div>`);
  $('body').prepend($wrap);

  var ebVmdf = new Vue({
    el: '#ebsooWrap0104',
    data: {
      currentTabIdx: 0,
      remainCount: 0
    },

    mounted() {
      ebGetValue('ebTop').then(res => {
        let topDis = JSON.parse(res).key || 100;
        $('#ebsooWrap0104').css('top', topDis + 'px');
      }).catch(_ => {
        $('#ebsooWrap0104').css('top',  '100px');
      })

      ebGetValue('ebRight').then(res => {
        let rightDis = JSON.parse(res).key || 100;
        $('#ebsooWrap0104').css('right', rightDis + 'px');
      }).catch(_ => {
        $('#ebsooWrap0104').css('right',  '100px');
      });
    },

    methods: {
      handleSwitchTab(idx) {
        this.currentTabIdx = idx;
      },

      handlePatchRemainCount(remainCount) {
        this.remainCount = Number(remainCount);
      }
    }
  });

  ebGetValue('ebTheme').then(res => {
    let type = JSON.parse(res) || 1;
    ebSwitchTheme(type)
  }).catch(_ => {
    ebSwitchTheme(1)
  });

  function ebProxyHttp (method, url, config) {
    let options = {
      timeout: 30000,
    }
    if (config) {
      Object.assign(options, config);
    }
    return new Promise((resolve, reject) => {
      httpClient(Object.assign({
        method: method,
        url: url.indexOf('http') > -1 ? url : baseUrl + url,
        onload: function(response) {
          resolve(response);
        },
        onerror: function (err) {
          reject(err);
        },
        ontimeout: function () {
          reject();
        }
      }, options));
    })
  };


  function ebSetValue (key, val) {
    if (GM_setValue) {
      return new Promise(resolve => {
        resolve(GM_setValue(key, JSON.stringify(val)));
      });
    } else if (GM.getValue) {
      return GM.setValue(key, JSON.stringify(val));
    }
  }

  function ebGetValue (key) {
    if (GM_getValue) {
      return new Promise(resolve => {
        resolve(GM_getValue(key, "{}"))
      })
    } else if (GM.getValue) {
      return GM.getValue(key);
    }
  }

  $('#ebTriggerBtn').on('click', _ => {
    ebToggleOpenClose();
  })

  function ebToggleOpenClose() {
    if (show) {
      show = false;
      $('#ebsooWrap0104').hide();
      $('#ebTriggerBtn').css('background-color', '#198754');
      $('#ebTriggerBtn').html('开');
    } else {
      show = true;
      $('#ebsooWrap0104').css('display', 'flex');
      $('#ebTriggerBtn').css('background-color', '#ccc');
      $('#ebTriggerBtn').html('关');
    }
  }

  function ebThrottle(func, delay) {
    var lastTime;
    return function() {
        var now = Date.now();
        if (!lastTime || now - lastTime >= delay) {
            func.apply(this, arguments);
            lastTime = now;
        }
    }
  }

  var ebEnterThrottle = ebThrottle(function() {
    ebVmdf.$refs.ebContentSearchRef.submit();
  }, 1000);

  function ebSwitchTheme(type) {
    if (type == 1) {
      $('#ebsooWrap0104').removeClass('eb-grey');
      $('#ebTriggerBtn').removeClass('eb-grey');
    }

    if (type == 2) {
      $('#ebsooWrap0104').addClass('eb-grey');
      $('#ebTriggerBtn').addClass('eb-grey');
    }

    ebSetValue('ebTheme', type).catch(err => {
      console.log('err', err)
    })
  }

  function getEbInfo() {
    ebScriptInfo.version = GM_info.script.version || 'unknown';
    ebScriptInfo.author = GM_info.script.author || 'unknown';
  }

  getEbInfo();

})
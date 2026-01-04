// ==UserScript==
// @icon         https://market.m.taobao.com/favicon.ico
// @name         淘宝、天猫、1688「商品分类选项」显示优化
// @namespace    https://github.com/ekoooo/tampermonkey_tb_sku
// @version      0.3.3
// @description  原样式：PC 端宝贝详情「颜色分类」为图片列表，需鼠标移动到上面才显示分类文字。➡️优化后：类似 APP 端显示文字，一目了然
// @author       liuwanlin
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://*.liangxinyao.com/*
// @match        *://*.1688.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/404460/%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%811688%E3%80%8C%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB%E9%80%89%E9%A1%B9%E3%80%8D%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/404460/%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%811688%E3%80%8C%E5%95%86%E5%93%81%E5%88%86%E7%B1%BB%E9%80%89%E9%A1%B9%E3%80%8D%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

const HOSTNAME = location.hostname;

// 直接覆盖 css 就能达到效果
;(function() {
  const INJECT_STYLE_HOST = ['taobao.com', 'tmall.com', 'tmall.hk', 'liangxinyao.com'];

  for (let i = 0; i < INJECT_STYLE_HOST.length; i++) {
    if (HOSTNAME.endsWith(INJECT_STYLE_HOST[i])) {
      GM_addStyle(`
        .tb-prop .tb-img li a {
          background-position-x: 5px !important;
          background-size: 30px 30px !important;
          width: inherit !important;
        }
        .tb-prop .tb-img li span {
          display: block !important;
          text-indent: initial;
          padding: 0 10px !important;
          margin-left: 30px;
        }

        .tb-sku .J_TSaleProp, .tb-skin .J_TSaleProp {
          max-height: 400px;
          overflow: hidden auto;
          border-bottom: 8px solid #b8b7bd38;
        }

        .skuItem {
          text-align: left;
        }
        .skuValueName {
          line-height: 1.4;
          white-space: initial;
        }
      `);
      break;
    }
  }
})();


// 1688
;(function($) {
  if (!HOSTNAME.endsWith('1688.com')) {
    return;
  }

  const imgs = $('.mod-detail-purchasing .vertical-img .box-img img');

  for (let i = 0; i < imgs.length; i++) {
    $(imgs[i])
      .parents('.vertical-img')
      .append('<span class="box-title">' + imgs[i].alt + '</span>');
  }


  GM_addStyle(`
    .mod-detail-purchasing a.image{
      width: inherit !important;
    }

    .mod-detail-purchasing .vertical-img {
      width: inherit !important;
      font-size: 12px;
      display: flex;
      align-items: center;
    }

    .mod-detail-purchasing .box-title {
      margin: 0 10px;
      font-weight: normal;
      color: #000;
      text-align: left;
    }

    .mod-detail-purchasing .table-sku .box-title {
      padding: 5px 0;
    }

    .mod-detail-purchasing .obj-expand {
      display: none;
    }

    .mod-detail-purchasing .obj-content {
      height: inherit !important;
    }
  `);

})(unsafeWindow.jQuery);
// ==UserScript==
// @name       DOLLARS聊天室助手
// @namespace  Violentmonkey Scripts
// @version    10.0.6
// @author     QQ:121610059
// @icon       https://drrr.com/favicon.svg
// @match      https://drrr.com/room/*
// @require    https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.global.prod.min.js
// @grant      GM_addStyle
// @grant      unsafeWindow
// @description Dollars聊天室辅助脚本
// @downloadURL https://update.greasyfork.org/scripts/414535/DOLLARS%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/414535/DOLLARS%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const a=document.createElement("style");a.textContent=n,document.head.append(a)})(' :root:root{--van-nav-bar-background: #1989fa;--van-nav-bar-title-text-color: #fff;--van-nav-bar-icon-color: #fff}#body{width:100%}#talks{background-color:#0a0a0a;position:relative}.talks:before{content:"";position:absolute;top:0;left:calc(-50vw + 50%);width:100vw;height:100%;background-color:#0a0a0a;z-index:-1}.van-popup--center{max-width:100%!important}.van-popup{overflow-y:inherit!important}.tab-content label{font-weight:inherit}:root,:host{--van-black: #000;--van-white: #fff;--van-gray-1: #f7f8fa;--van-gray-2: #f2f3f5;--van-gray-3: #ebedf0;--van-gray-4: #dcdee0;--van-gray-5: #c8c9cc;--van-gray-6: #969799;--van-gray-7: #646566;--van-gray-8: #323233;--van-red: #ee0a24;--van-blue: #1989fa;--van-orange: #ff976a;--van-orange-dark: #ed6a0c;--van-orange-light: #fffbe8;--van-green: #07c160;--van-gradient-red: linear-gradient(to right, #ff6034, #ee0a24);--van-gradient-orange: linear-gradient(to right, #ffd01e, #ff8917);--van-primary-color: var(--van-blue);--van-success-color: var(--van-green);--van-danger-color: var(--van-red);--van-warning-color: var(--van-orange);--van-text-color: var(--van-gray-8);--van-text-color-2: var(--van-gray-6);--van-text-color-3: var(--van-gray-5);--van-active-color: var(--van-gray-2);--van-active-opacity: .6;--van-disabled-opacity: .5;--van-background: var(--van-gray-1);--van-background-2: var(--van-white);--van-background-3: var(--van-white);--van-padding-base: 4px;--van-padding-xs: 8px;--van-padding-sm: 12px;--van-padding-md: 16px;--van-padding-lg: 24px;--van-padding-xl: 32px;--van-font-bold: 600;--van-font-size-xs: 10px;--van-font-size-sm: 12px;--van-font-size-md: 14px;--van-font-size-lg: 16px;--van-line-height-xs: 14px;--van-line-height-sm: 18px;--van-line-height-md: 20px;--van-line-height-lg: 22px;--van-base-font: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Segoe UI, Arial, Roboto, "PingFang SC", "miui", "Hiragino Sans GB", "Microsoft Yahei", sans-serif;--van-price-font: avenir-heavy, "PingFang SC", helvetica neue, arial, sans-serif;--van-duration-base: .3s;--van-duration-fast: .2s;--van-ease-out: ease-out;--van-ease-in: ease-in;--van-border-color: var(--van-gray-3);--van-border-width: 1px;--van-radius-sm: 2px;--van-radius-md: 4px;--van-radius-lg: 8px;--van-radius-max: 999px}.van-theme-dark{--van-text-color: #f5f5f5;--van-text-color-2: #707070;--van-text-color-3: #4d4d4d;--van-border-color: #3a3a3c;--van-active-color: #3a3a3c;--van-background: #000;--van-background-2: #1c1c1e;--van-background-3: #37363b}html{-webkit-tap-highlight-color:transparent}body{margin:0;font-family:var(--van-base-font)}a{text-decoration:none}input,button,textarea{color:inherit;font:inherit}a:focus,input:focus,button:focus,textarea:focus,[class*=van-]:focus{outline:none}ol,ul{margin:0;padding:0;list-style:none}@keyframes van-slide-up-enter{0%{transform:translate3d(0,100%,0)}}@keyframes van-slide-up-leave{to{transform:translate3d(0,100%,0)}}@keyframes van-slide-down-enter{0%{transform:translate3d(0,-100%,0)}}@keyframes van-slide-down-leave{to{transform:translate3d(0,-100%,0)}}@keyframes van-slide-left-enter{0%{transform:translate3d(-100%,0,0)}}@keyframes van-slide-left-leave{to{transform:translate3d(-100%,0,0)}}@keyframes van-slide-right-enter{0%{transform:translate3d(100%,0,0)}}@keyframes van-slide-right-leave{to{transform:translate3d(100%,0,0)}}@keyframes van-fade-in{0%{opacity:0}to{opacity:1}}@keyframes van-fade-out{0%{opacity:1}to{opacity:0}}@keyframes van-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.van-fade-enter-active{animation:var(--van-duration-base) van-fade-in both var(--van-ease-out)}.van-fade-leave-active{animation:var(--van-duration-base) van-fade-out both var(--van-ease-in)}.van-slide-up-enter-active{animation:van-slide-up-enter var(--van-duration-base) both var(--van-ease-out)}.van-slide-up-leave-active{animation:van-slide-up-leave var(--van-duration-base) both var(--van-ease-in)}.van-slide-down-enter-active{animation:van-slide-down-enter var(--van-duration-base) both var(--van-ease-out)}.van-slide-down-leave-active{animation:van-slide-down-leave var(--van-duration-base) both var(--van-ease-in)}.van-slide-left-enter-active{animation:van-slide-left-enter var(--van-duration-base) both var(--van-ease-out)}.van-slide-left-leave-active{animation:van-slide-left-leave var(--van-duration-base) both var(--van-ease-in)}.van-slide-right-enter-active{animation:van-slide-right-enter var(--van-duration-base) both var(--van-ease-out)}.van-slide-right-leave-active{animation:van-slide-right-leave var(--van-duration-base) both var(--van-ease-in)}.van-clearfix:after{display:table;clear:both;content:""}.van-ellipsis{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.van-multi-ellipsis--l2{display:-webkit-box;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp:2;line-break:anywhere;-webkit-box-orient:vertical}.van-multi-ellipsis--l3{display:-webkit-box;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp:3;line-break:anywhere;-webkit-box-orient:vertical}.van-safe-area-top{padding-top:constant(safe-area-inset-top);padding-top:env(safe-area-inset-top)}.van-safe-area-bottom{padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom)}.van-haptics-feedback{cursor:pointer}.van-haptics-feedback:active{opacity:var(--van-active-opacity)}[class*=van-hairline]:after{position:absolute;box-sizing:border-box;content:" ";pointer-events:none;top:-50%;right:-50%;bottom:-50%;left:-50%;border:0 solid var(--van-border-color);transform:scale(.5)}.van-hairline,.van-hairline--top,.van-hairline--left,.van-hairline--right,.van-hairline--bottom,.van-hairline--surround,.van-hairline--top-bottom{position:relative}.van-hairline--top:after{border-top-width:var(--van-border-width)}.van-hairline--left:after{border-left-width:var(--van-border-width)}.van-hairline--right:after{border-right-width:var(--van-border-width)}.van-hairline--bottom:after{border-bottom-width:var(--van-border-width)}.van-hairline--top-bottom:after,.van-hairline-unset--top-bottom:after{border-width:var(--van-border-width) 0}.van-hairline--surround:after{border-width:var(--van-border-width)}:root,:host{--van-badge-size: 16px;--van-badge-color: var(--van-white);--van-badge-padding: 0 3px;--van-badge-font-size: var(--van-font-size-sm);--van-badge-font-weight: var(--van-font-bold);--van-badge-border-width: var(--van-border-width);--van-badge-background: var(--van-danger-color);--van-badge-dot-color: var(--van-danger-color);--van-badge-dot-size: 8px;--van-badge-font: -apple-system-font, helvetica neue, arial, sans-serif}.van-badge{display:inline-block;box-sizing:border-box;min-width:var(--van-badge-size);padding:var(--van-badge-padding);color:var(--van-badge-color);font-weight:var(--van-badge-font-weight);font-size:var(--van-badge-font-size);font-family:var(--van-badge-font);line-height:1.2;text-align:center;background:var(--van-badge-background);border:var(--van-badge-border-width) solid var(--van-background-2);border-radius:var(--van-radius-max)}.van-badge--fixed{position:absolute;transform-origin:100%}.van-badge--top-left{top:0;left:0;transform:translate(-50%,-50%)}.van-badge--top-right{top:0;right:0;transform:translate(50%,-50%)}.van-badge--bottom-left{bottom:0;left:0;transform:translate(-50%,50%)}.van-badge--bottom-right{bottom:0;right:0;transform:translate(50%,50%)}.van-badge--dot{width:var(--van-badge-dot-size);min-width:0;height:var(--van-badge-dot-size);background:var(--van-badge-dot-color);border-radius:100%;border:none;padding:0}.van-badge__wrapper{position:relative;display:inline-block}.van-icon{position:relative;display:inline-block;font:14px/1 vant-icon;font:normal normal normal 14px/1 var(--van-icon-font-family, "vant-icon");font-size:inherit;text-rendering:auto;-webkit-font-smoothing:antialiased}.van-icon:before{display:inline-block}.van-icon-arrow-double-left:before{content:"\uE653"}.van-icon-arrow-double-right:before{content:"\uE654"}.van-icon-contact:before{content:"\uE753"}.van-icon-notes:before{content:"\uE63C"}.van-icon-records:before{content:"\uE63D"}.van-icon-cash-back-record:before{content:"\uE63E"}.van-icon-newspaper:before{content:"\uE63F"}.van-icon-discount:before{content:"\uE640"}.van-icon-completed:before{content:"\uE641"}.van-icon-user:before{content:"\uE642"}.van-icon-description:before{content:"\uE643"}.van-icon-list-switch:before{content:"\uE6AD"}.van-icon-list-switching:before{content:"\uE65A"}.van-icon-link-o:before{content:"\uE751"}.van-icon-miniprogram-o:before{content:"\uE752"}.van-icon-qq:before{content:"\uE74E"}.van-icon-wechat-moments:before{content:"\uE74F"}.van-icon-weibo:before{content:"\uE750"}.van-icon-cash-o:before{content:"\uE74D"}.van-icon-guide-o:before{content:"\uE74C"}.van-icon-invitation:before{content:"\uE6D6"}.van-icon-shield-o:before{content:"\uE74B"}.van-icon-exchange:before{content:"\uE6AF"}.van-icon-eye:before{content:"\uE6B0"}.van-icon-enlarge:before{content:"\uE6B1"}.van-icon-expand-o:before{content:"\uE6B2"}.van-icon-eye-o:before{content:"\uE6B3"}.van-icon-expand:before{content:"\uE6B4"}.van-icon-filter-o:before{content:"\uE6B5"}.van-icon-fire:before{content:"\uE6B6"}.van-icon-fail:before{content:"\uE6B7"}.van-icon-failure:before{content:"\uE6B8"}.van-icon-fire-o:before{content:"\uE6B9"}.van-icon-flag-o:before{content:"\uE6BA"}.van-icon-font:before{content:"\uE6BB"}.van-icon-font-o:before{content:"\uE6BC"}.van-icon-gem-o:before{content:"\uE6BD"}.van-icon-flower-o:before{content:"\uE6BE"}.van-icon-gem:before{content:"\uE6BF"}.van-icon-gift-card:before{content:"\uE6C0"}.van-icon-friends:before{content:"\uE6C1"}.van-icon-friends-o:before{content:"\uE6C2"}.van-icon-gold-coin:before{content:"\uE6C3"}.van-icon-gold-coin-o:before{content:"\uE6C4"}.van-icon-good-job-o:before{content:"\uE6C5"}.van-icon-gift:before{content:"\uE6C6"}.van-icon-gift-o:before{content:"\uE6C7"}.van-icon-gift-card-o:before{content:"\uE6C8"}.van-icon-good-job:before{content:"\uE6C9"}.van-icon-home-o:before{content:"\uE6CA"}.van-icon-goods-collect:before{content:"\uE6CB"}.van-icon-graphic:before{content:"\uE6CC"}.van-icon-goods-collect-o:before{content:"\uE6CD"}.van-icon-hot-o:before{content:"\uE6CE"}.van-icon-info:before{content:"\uE6CF"}.van-icon-hotel-o:before{content:"\uE6D0"}.van-icon-info-o:before{content:"\uE6D1"}.van-icon-hot-sale-o:before{content:"\uE6D2"}.van-icon-hot:before{content:"\uE6D3"}.van-icon-like:before{content:"\uE6D4"}.van-icon-idcard:before{content:"\uE6D5"}.van-icon-like-o:before{content:"\uE6D7"}.van-icon-hot-sale:before{content:"\uE6D8"}.van-icon-location-o:before{content:"\uE6D9"}.van-icon-location:before{content:"\uE6DA"}.van-icon-label:before{content:"\uE6DB"}.van-icon-lock:before{content:"\uE6DC"}.van-icon-label-o:before{content:"\uE6DD"}.van-icon-map-marked:before{content:"\uE6DE"}.van-icon-logistics:before{content:"\uE6DF"}.van-icon-manager:before{content:"\uE6E0"}.van-icon-more:before{content:"\uE6E1"}.van-icon-live:before{content:"\uE6E2"}.van-icon-manager-o:before{content:"\uE6E3"}.van-icon-medal:before{content:"\uE6E4"}.van-icon-more-o:before{content:"\uE6E5"}.van-icon-music-o:before{content:"\uE6E6"}.van-icon-music:before{content:"\uE6E7"}.van-icon-new-arrival-o:before{content:"\uE6E8"}.van-icon-medal-o:before{content:"\uE6E9"}.van-icon-new-o:before{content:"\uE6EA"}.van-icon-free-postage:before{content:"\uE6EB"}.van-icon-newspaper-o:before{content:"\uE6EC"}.van-icon-new-arrival:before{content:"\uE6ED"}.van-icon-minus:before{content:"\uE6EE"}.van-icon-orders-o:before{content:"\uE6EF"}.van-icon-new:before{content:"\uE6F0"}.van-icon-paid:before{content:"\uE6F1"}.van-icon-notes-o:before{content:"\uE6F2"}.van-icon-other-pay:before{content:"\uE6F3"}.van-icon-pause-circle:before{content:"\uE6F4"}.van-icon-pause:before{content:"\uE6F5"}.van-icon-pause-circle-o:before{content:"\uE6F6"}.van-icon-peer-pay:before{content:"\uE6F7"}.van-icon-pending-payment:before{content:"\uE6F8"}.van-icon-passed:before{content:"\uE6F9"}.van-icon-plus:before{content:"\uE6FA"}.van-icon-phone-circle-o:before{content:"\uE6FB"}.van-icon-phone-o:before{content:"\uE6FC"}.van-icon-printer:before{content:"\uE6FD"}.van-icon-photo-fail:before{content:"\uE6FE"}.van-icon-phone:before{content:"\uE6FF"}.van-icon-photo-o:before{content:"\uE700"}.van-icon-play-circle:before{content:"\uE701"}.van-icon-play:before{content:"\uE702"}.van-icon-phone-circle:before{content:"\uE703"}.van-icon-point-gift-o:before{content:"\uE704"}.van-icon-point-gift:before{content:"\uE705"}.van-icon-play-circle-o:before{content:"\uE706"}.van-icon-shrink:before{content:"\uE707"}.van-icon-photo:before{content:"\uE708"}.van-icon-qr:before{content:"\uE709"}.van-icon-qr-invalid:before{content:"\uE70A"}.van-icon-question-o:before{content:"\uE70B"}.van-icon-revoke:before{content:"\uE70C"}.van-icon-replay:before{content:"\uE70D"}.van-icon-service:before{content:"\uE70E"}.van-icon-question:before{content:"\uE70F"}.van-icon-search:before{content:"\uE710"}.van-icon-refund-o:before{content:"\uE711"}.van-icon-service-o:before{content:"\uE712"}.van-icon-scan:before{content:"\uE713"}.van-icon-share:before{content:"\uE714"}.van-icon-send-gift-o:before{content:"\uE715"}.van-icon-share-o:before{content:"\uE716"}.van-icon-setting:before{content:"\uE717"}.van-icon-points:before{content:"\uE718"}.van-icon-photograph:before{content:"\uE719"}.van-icon-shop:before{content:"\uE71A"}.van-icon-shop-o:before{content:"\uE71B"}.van-icon-shop-collect-o:before{content:"\uE71C"}.van-icon-shop-collect:before{content:"\uE71D"}.van-icon-smile:before{content:"\uE71E"}.van-icon-shopping-cart-o:before{content:"\uE71F"}.van-icon-sign:before{content:"\uE720"}.van-icon-sort:before{content:"\uE721"}.van-icon-star-o:before{content:"\uE722"}.van-icon-smile-comment-o:before{content:"\uE723"}.van-icon-stop:before{content:"\uE724"}.van-icon-stop-circle-o:before{content:"\uE725"}.van-icon-smile-o:before{content:"\uE726"}.van-icon-star:before{content:"\uE727"}.van-icon-success:before{content:"\uE728"}.van-icon-stop-circle:before{content:"\uE729"}.van-icon-records-o:before{content:"\uE72A"}.van-icon-shopping-cart:before{content:"\uE72B"}.van-icon-tosend:before{content:"\uE72C"}.van-icon-todo-list:before{content:"\uE72D"}.van-icon-thumb-circle-o:before{content:"\uE72E"}.van-icon-thumb-circle:before{content:"\uE72F"}.van-icon-umbrella-circle:before{content:"\uE730"}.van-icon-underway:before{content:"\uE731"}.van-icon-upgrade:before{content:"\uE732"}.van-icon-todo-list-o:before{content:"\uE733"}.van-icon-tv-o:before{content:"\uE734"}.van-icon-underway-o:before{content:"\uE735"}.van-icon-user-o:before{content:"\uE736"}.van-icon-vip-card-o:before{content:"\uE737"}.van-icon-vip-card:before{content:"\uE738"}.van-icon-send-gift:before{content:"\uE739"}.van-icon-wap-home:before{content:"\uE73A"}.van-icon-wap-nav:before{content:"\uE73B"}.van-icon-volume-o:before{content:"\uE73C"}.van-icon-video:before{content:"\uE73D"}.van-icon-wap-home-o:before{content:"\uE73E"}.van-icon-volume:before{content:"\uE73F"}.van-icon-warning:before{content:"\uE740"}.van-icon-weapp-nav:before{content:"\uE741"}.van-icon-wechat-pay:before{content:"\uE742"}.van-icon-warning-o:before{content:"\uE743"}.van-icon-wechat:before{content:"\uE744"}.van-icon-setting-o:before{content:"\uE745"}.van-icon-youzan-shield:before{content:"\uE746"}.van-icon-warn-o:before{content:"\uE747"}.van-icon-smile-comment:before{content:"\uE748"}.van-icon-user-circle-o:before{content:"\uE749"}.van-icon-video-o:before{content:"\uE74A"}.van-icon-add-square:before{content:"\uE65C"}.van-icon-add:before{content:"\uE65D"}.van-icon-arrow-down:before{content:"\uE65E"}.van-icon-arrow-up:before{content:"\uE65F"}.van-icon-arrow:before{content:"\uE660"}.van-icon-after-sale:before{content:"\uE661"}.van-icon-add-o:before{content:"\uE662"}.van-icon-alipay:before{content:"\uE663"}.van-icon-ascending:before{content:"\uE664"}.van-icon-apps-o:before{content:"\uE665"}.van-icon-aim:before{content:"\uE666"}.van-icon-award:before{content:"\uE667"}.van-icon-arrow-left:before{content:"\uE668"}.van-icon-award-o:before{content:"\uE669"}.van-icon-audio:before{content:"\uE66A"}.van-icon-bag-o:before{content:"\uE66B"}.van-icon-balance-list:before{content:"\uE66C"}.van-icon-back-top:before{content:"\uE66D"}.van-icon-bag:before{content:"\uE66E"}.van-icon-balance-pay:before{content:"\uE66F"}.van-icon-balance-o:before{content:"\uE670"}.van-icon-bar-chart-o:before{content:"\uE671"}.van-icon-bars:before{content:"\uE672"}.van-icon-balance-list-o:before{content:"\uE673"}.van-icon-birthday-cake-o:before{content:"\uE674"}.van-icon-bookmark:before{content:"\uE675"}.van-icon-bill:before{content:"\uE676"}.van-icon-bell:before{content:"\uE677"}.van-icon-browsing-history-o:before{content:"\uE678"}.van-icon-browsing-history:before{content:"\uE679"}.van-icon-bookmark-o:before{content:"\uE67A"}.van-icon-bulb-o:before{content:"\uE67B"}.van-icon-bullhorn-o:before{content:"\uE67C"}.van-icon-bill-o:before{content:"\uE67D"}.van-icon-calendar-o:before{content:"\uE67E"}.van-icon-brush-o:before{content:"\uE67F"}.van-icon-card:before{content:"\uE680"}.van-icon-cart-o:before{content:"\uE681"}.van-icon-cart-circle:before{content:"\uE682"}.van-icon-cart-circle-o:before{content:"\uE683"}.van-icon-cart:before{content:"\uE684"}.van-icon-cash-on-deliver:before{content:"\uE685"}.van-icon-cash-back-record-o:before{content:"\uE686"}.van-icon-cashier-o:before{content:"\uE687"}.van-icon-chart-trending-o:before{content:"\uE688"}.van-icon-certificate:before{content:"\uE689"}.van-icon-chat:before{content:"\uE68A"}.van-icon-clear:before{content:"\uE68B"}.van-icon-chat-o:before{content:"\uE68C"}.van-icon-checked:before{content:"\uE68D"}.van-icon-clock:before{content:"\uE68E"}.van-icon-clock-o:before{content:"\uE68F"}.van-icon-close:before{content:"\uE690"}.van-icon-closed-eye:before{content:"\uE691"}.van-icon-circle:before{content:"\uE692"}.van-icon-cluster-o:before{content:"\uE693"}.van-icon-column:before{content:"\uE694"}.van-icon-comment-circle-o:before{content:"\uE695"}.van-icon-cluster:before{content:"\uE696"}.van-icon-comment:before{content:"\uE697"}.van-icon-comment-o:before{content:"\uE698"}.van-icon-comment-circle:before{content:"\uE699"}.van-icon-completed-o:before{content:"\uE69A"}.van-icon-credit-pay:before{content:"\uE69B"}.van-icon-coupon:before{content:"\uE69C"}.van-icon-debit-pay:before{content:"\uE69D"}.van-icon-coupon-o:before{content:"\uE69E"}.van-icon-contact-o:before{content:"\uE69F"}.van-icon-descending:before{content:"\uE6A0"}.van-icon-desktop-o:before{content:"\uE6A1"}.van-icon-diamond-o:before{content:"\uE6A2"}.van-icon-description-o:before{content:"\uE6A3"}.van-icon-delete:before{content:"\uE6A4"}.van-icon-diamond:before{content:"\uE6A5"}.van-icon-delete-o:before{content:"\uE6A6"}.van-icon-cross:before{content:"\uE6A7"}.van-icon-edit:before{content:"\uE6A8"}.van-icon-ellipsis:before{content:"\uE6A9"}.van-icon-down:before{content:"\uE6AA"}.van-icon-discount-o:before{content:"\uE6AB"}.van-icon-ecard-pay:before{content:"\uE6AC"}.van-icon-envelop-o:before{content:"\uE6AE"}@font-face{font-weight:400;font-family:vant-icon;font-style:normal;font-display:auto;src:url(data:font/woff2;charset=utf-8;base64,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) format("woff2"),url(//at.alicdn.com/t/c/font_2553510_ciljc7axaw7.woff?t=1705587463221) format("woff")}.van-icon__image{display:block;width:1em;height:1em;object-fit:contain}:root,:host{--van-overlay-z-index: 1;--van-overlay-background: rgba(0, 0, 0, .7)}.van-overlay{position:fixed;top:0;left:0;z-index:var(--van-overlay-z-index);width:100%;height:100%;background:var(--van-overlay-background)}:root,:host{--van-popup-background: var(--van-background-2);--van-popup-transition: transform var(--van-duration-base);--van-popup-round-radius: 16px;--van-popup-close-icon-size: 22px;--van-popup-close-icon-color: var(--van-gray-5);--van-popup-close-icon-margin: 16px;--van-popup-close-icon-z-index: 1}.van-overflow-hidden{overflow:hidden!important}.van-popup{position:fixed;max-height:100%;overflow-y:auto;box-sizing:border-box;background:var(--van-popup-background);transition:var(--van-popup-transition);-webkit-overflow-scrolling:touch}.van-popup--center{top:50%;left:0;right:0;width:-webkit-fit-content;width:fit-content;max-width:calc(100vw - var(--van-padding-md) * 2);margin:0 auto;transform:translateY(-50%)}.van-popup--center.van-popup--round{border-radius:var(--van-popup-round-radius)}.van-popup--top{top:0;left:0;width:100%}.van-popup--top.van-popup--round{border-radius:0 0 var(--van-popup-round-radius) var(--van-popup-round-radius)}.van-popup--right{top:50%;right:0;transform:translate3d(0,-50%,0)}.van-popup--right.van-popup--round{border-radius:var(--van-popup-round-radius) 0 0 var(--van-popup-round-radius)}.van-popup--bottom{bottom:0;left:0;width:100%}.van-popup--bottom.van-popup--round{border-radius:var(--van-popup-round-radius) var(--van-popup-round-radius) 0 0}.van-popup--left{top:50%;left:0;transform:translate3d(0,-50%,0)}.van-popup--left.van-popup--round{border-radius:0 var(--van-popup-round-radius) var(--van-popup-round-radius) 0}.van-popup-slide-top-enter-active,.van-popup-slide-left-enter-active,.van-popup-slide-right-enter-active,.van-popup-slide-bottom-enter-active{transition-timing-function:var(--van-ease-out)}.van-popup-slide-top-leave-active,.van-popup-slide-left-leave-active,.van-popup-slide-right-leave-active,.van-popup-slide-bottom-leave-active{transition-timing-function:var(--van-ease-in)}.van-popup-slide-top-enter-from,.van-popup-slide-top-leave-active{transform:translate3d(0,-100%,0)}.van-popup-slide-right-enter-from,.van-popup-slide-right-leave-active{transform:translate3d(100%,-50%,0)}.van-popup-slide-bottom-enter-from,.van-popup-slide-bottom-leave-active{transform:translate3d(0,100%,0)}.van-popup-slide-left-enter-from,.van-popup-slide-left-leave-active{transform:translate3d(-100%,-50%,0)}.van-popup__close-icon{position:absolute;z-index:var(--van-popup-close-icon-z-index);color:var(--van-popup-close-icon-color);font-size:var(--van-popup-close-icon-size)}.van-popup__close-icon--top-left{top:var(--van-popup-close-icon-margin);left:var(--van-popup-close-icon-margin)}.van-popup__close-icon--top-right{top:var(--van-popup-close-icon-margin);right:var(--van-popup-close-icon-margin)}.van-popup__close-icon--bottom-left{bottom:var(--van-popup-close-icon-margin);left:var(--van-popup-close-icon-margin)}.van-popup__close-icon--bottom-right{right:var(--van-popup-close-icon-margin);bottom:var(--van-popup-close-icon-margin)}:root,:host{--van-sticky-z-index: 99}.van-sticky--fixed{position:fixed;z-index:var(--van-sticky-z-index)}:root,:host{--van-swipe-indicator-size: 6px;--van-swipe-indicator-margin: var(--van-padding-sm);--van-swipe-indicator-active-opacity: 1;--van-swipe-indicator-inactive-opacity: .3;--van-swipe-indicator-active-background: var(--van-primary-color);--van-swipe-indicator-inactive-background: var(--van-border-color)}.van-swipe{position:relative;overflow:hidden;transform:translateZ(0);cursor:-webkit-grab;cursor:grab;-webkit-user-select:none;user-select:none}.van-swipe__track{display:flex;height:100%;transition-property:transform}.van-swipe__track--vertical{flex-direction:column}.van-swipe__indicators{position:absolute;bottom:var(--van-swipe-indicator-margin);left:50%;display:flex;transform:translate(-50%)}.van-swipe__indicators--vertical{top:50%;bottom:auto;left:var(--van-swipe-indicator-margin);flex-direction:column;transform:translateY(-50%)}.van-swipe__indicators--vertical .van-swipe__indicator:not(:last-child){margin-bottom:var(--van-swipe-indicator-size)}.van-swipe__indicator{width:var(--van-swipe-indicator-size);height:var(--van-swipe-indicator-size);background-color:var(--van-swipe-indicator-inactive-background);border-radius:100%;opacity:var(--van-swipe-indicator-inactive-opacity);transition:opacity var(--van-duration-fast),background-color var(--van-duration-fast)}.van-swipe__indicator:not(:last-child){margin-right:var(--van-swipe-indicator-size)}.van-swipe__indicator--active{background-color:var(--van-swipe-indicator-active-background);opacity:var(--van-swipe-indicator-active-opacity)}:root,:host{--van-tab-text-color: var(--van-gray-7);--van-tab-active-text-color: var(--van-text-color);--van-tab-disabled-text-color: var(--van-text-color-3);--van-tab-font-size: var(--van-font-size-md);--van-tab-line-height: var(--van-line-height-md);--van-tabs-default-color: var(--van-primary-color);--van-tabs-line-height: 44px;--van-tabs-card-height: 30px;--van-tabs-nav-background: var(--van-background-2);--van-tabs-bottom-bar-width: 40px;--van-tabs-bottom-bar-height: 3px;--van-tabs-bottom-bar-color: var(--van-primary-color)}.van-tab{position:relative;display:flex;flex:1;align-items:center;justify-content:center;box-sizing:border-box;padding:0 var(--van-padding-base);color:var(--van-tab-text-color);font-size:var(--van-tab-font-size);line-height:var(--van-tab-line-height);cursor:pointer}.van-tab--active{color:var(--van-tab-active-text-color);font-weight:var(--van-font-bold)}.van-tab--disabled{color:var(--van-tab-disabled-text-color);cursor:not-allowed}.van-tab--grow{flex:1 0 auto;padding:0 var(--van-padding-sm)}.van-tab--shrink{flex:none;padding:0 var(--van-padding-xs)}.van-tab--card{color:var(--van-tabs-default-color);border-right:var(--van-border-width) solid var(--van-tabs-default-color)}.van-tab--card:last-child{border-right:none}.van-tab--card.van-tab--active{color:var(--van-white);background-color:var(--van-tabs-default-color)}.van-tab--card--disabled{color:var(--van-tab-disabled-text-color)}.van-tab__text--ellipsis{display:-webkit-box;overflow:hidden;-webkit-line-clamp:1;-webkit-box-orient:vertical}.van-tabs{position:relative}.van-tabs__wrap{overflow:hidden}.van-tabs__wrap--page-top{position:fixed}.van-tabs__wrap--content-bottom{top:auto;bottom:0}.van-tabs__nav{position:relative;display:flex;background:var(--van-tabs-nav-background);-webkit-user-select:none;user-select:none}.van-tabs__nav--complete{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch}.van-tabs__nav--complete::-webkit-scrollbar{display:none}.van-tabs__nav--line{box-sizing:content-box;height:100%;padding-bottom:15px}.van-tabs__nav--line.van-tabs__nav--shrink,.van-tabs__nav--line.van-tabs__nav--complete{padding-right:var(--van-padding-xs);padding-left:var(--van-padding-xs)}.van-tabs__nav--card{box-sizing:border-box;height:var(--van-tabs-card-height);margin:0 var(--van-padding-md);border:var(--van-border-width) solid var(--van-tabs-default-color);border-radius:var(--van-radius-sm)}.van-tabs__nav--card.van-tabs__nav--shrink{display:inline-flex}.van-tabs__line{position:absolute;bottom:15px;left:0;z-index:1;width:var(--van-tabs-bottom-bar-width);height:var(--van-tabs-bottom-bar-height);background:var(--van-tabs-bottom-bar-color);border-radius:var(--van-tabs-bottom-bar-height)}.van-tabs__track{position:relative;display:flex;width:100%;height:100%;will-change:left}.van-tabs__content--animated{overflow:hidden}.van-tabs--line .van-tabs__wrap{height:var(--van-tabs-line-height)}.van-tabs--card>.van-tabs__wrap{height:var(--van-tabs-card-height)}.van-radio-group--horizontal{display:flex;flex-wrap:wrap}:root,:host{--van-checkbox-size: 20px;--van-checkbox-border-color: var(--van-gray-5);--van-checkbox-duration: var(--van-duration-fast);--van-checkbox-label-margin: var(--van-padding-xs);--van-checkbox-label-color: var(--van-text-color);--van-checkbox-checked-icon-color: var(--van-primary-color);--van-checkbox-disabled-icon-color: var(--van-gray-5);--van-checkbox-disabled-label-color: var(--van-text-color-3);--van-checkbox-disabled-background: var(--van-border-color)}.van-checkbox{display:flex;align-items:center;overflow:hidden;cursor:pointer;-webkit-user-select:none;user-select:none}.van-checkbox--disabled{cursor:not-allowed}.van-checkbox--label-disabled{cursor:default}.van-checkbox--horizontal{margin-right:var(--van-padding-sm)}.van-checkbox__icon{flex:none;height:1em;font-size:var(--van-checkbox-size);line-height:1em;cursor:pointer}.van-checkbox__icon .van-icon{display:block;box-sizing:border-box;width:1.25em;height:1.25em;color:transparent;font-size:.8em;line-height:1.25;text-align:center;border:1px solid var(--van-checkbox-border-color);transition-duration:var(--van-checkbox-duration);transition-property:color,border-color,background-color}.van-checkbox__icon--round .van-icon{border-radius:100%}.van-checkbox__icon--indeterminate .van-icon{display:flex;align-items:center;justify-content:center;color:var(--van-white);border-color:var(--van-checkbox-checked-icon-color);background-color:var(--van-checkbox-checked-icon-color)}.van-checkbox__icon--checked .van-icon{color:var(--van-white);background-color:var(--van-checkbox-checked-icon-color);border-color:var(--van-checkbox-checked-icon-color)}.van-checkbox__icon--disabled{cursor:not-allowed}.van-checkbox__icon--disabled .van-icon{background-color:var(--van-checkbox-disabled-background);border-color:var(--van-checkbox-disabled-icon-color)}.van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon{color:var(--van-checkbox-disabled-icon-color)}.van-checkbox__label{margin-left:var(--van-checkbox-label-margin);color:var(--van-checkbox-label-color);line-height:var(--van-checkbox-size)}.van-checkbox__label--left{margin:0 var(--van-checkbox-label-margin) 0 0}.van-checkbox__label--disabled{color:var(--van-checkbox-disabled-label-color)}:root,:host{--van-radio-size: 20px;--van-radio-dot-size: 8px;--van-radio-border-color: var(--van-gray-5);--van-radio-duration: var(--van-duration-fast);--van-radio-label-margin: var(--van-padding-xs);--van-radio-label-color: var(--van-text-color);--van-radio-checked-icon-color: var(--van-primary-color);--van-radio-disabled-icon-color: var(--van-gray-5);--van-radio-disabled-label-color: var(--van-text-color-3);--van-radio-disabled-background: var(--van-border-color)}.van-radio{display:flex;align-items:center;overflow:hidden;cursor:pointer;-webkit-user-select:none;user-select:none}.van-radio--disabled{cursor:not-allowed}.van-radio--label-disabled{cursor:default}.van-radio--horizontal{margin-right:var(--van-padding-sm)}.van-radio__icon{flex:none;height:1em;font-size:var(--van-radio-size);line-height:1em;cursor:pointer}.van-radio__icon .van-icon{display:block;box-sizing:border-box;width:1.25em;height:1.25em;color:transparent;font-size:.8em;line-height:1.25;text-align:center;border:1px solid var(--van-radio-border-color);transition-duration:var(--van-radio-duration);transition-property:color,border-color,background-color}.van-radio__icon--round .van-icon{border-radius:100%}.van-radio__icon--dot{position:relative;border-radius:100%;box-sizing:border-box;width:var(--van-radio-size);height:var(--van-radio-size);border:1px solid var(--van-radio-border-color);transition-duration:var(--van-radio-duration);transition-property:border-color}.van-radio__icon--dot__icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:100%;height:calc(100% - var(--van-radio-dot-size));width:calc(100% - var(--van-radio-dot-size));transition-duration:var(--van-radio-duration);transition-property:background-color}.van-radio__icon--checked .van-icon{color:var(--van-white);background-color:var(--van-radio-checked-icon-color);border-color:var(--van-radio-checked-icon-color)}.van-radio__icon--checked.van-radio__icon--dot{border-color:var(--van-radio-checked-icon-color)}.van-radio__icon--checked.van-radio__icon--dot .van-radio__icon--dot__icon{background:var(--van-radio-checked-icon-color)}.van-radio__icon--disabled{cursor:not-allowed}.van-radio__icon--disabled .van-icon{background-color:var(--van-radio-disabled-background);border-color:var(--van-radio-disabled-icon-color)}.van-radio__icon--disabled.van-radio__icon--checked .van-icon{color:var(--van-radio-disabled-icon-color)}.van-radio__label{margin-left:var(--van-radio-label-margin);color:var(--van-radio-label-color);line-height:var(--van-radio-size)}.van-radio__label--left{margin:0 var(--van-radio-label-margin) 0 0}.van-radio__label--disabled{color:var(--van-radio-disabled-label-color)}:root,:host{--van-stepper-background: var(--van-active-color);--van-stepper-button-icon-color: var(--van-text-color);--van-stepper-button-disabled-color: var(--van-background);--van-stepper-button-disabled-icon-color: var(--van-gray-5);--van-stepper-button-round-theme-color: var(--van-primary-color);--van-stepper-input-width: 32px;--van-stepper-input-height: 28px;--van-stepper-input-font-size: var(--van-font-size-md);--van-stepper-input-line-height: normal;--van-stepper-input-text-color: var(--van-text-color);--van-stepper-input-disabled-text-color: var(--van-text-color-3);--van-stepper-input-disabled-background: var(--van-active-color);--van-stepper-radius: var(--van-radius-md)}.van-stepper{display:inline-block;-webkit-user-select:none;user-select:none}.van-stepper__minus,.van-stepper__plus{position:relative;box-sizing:border-box;width:var(--van-stepper-input-height);height:var(--van-stepper-input-height);margin:0;padding:0;color:var(--van-stepper-button-icon-color);vertical-align:middle;background:var(--van-stepper-background);border:0}.van-stepper__minus:before,.van-stepper__plus:before{width:50%;height:1px}.van-stepper__minus:after,.van-stepper__plus:after{width:1px;height:50%}.van-stepper__minus:before,.van-stepper__plus:before,.van-stepper__minus:after,.van-stepper__plus:after{position:absolute;top:50%;left:50%;background-color:currentColor;transform:translate(-50%,-50%);content:""}.van-stepper__minus--disabled,.van-stepper__plus--disabled{color:var(--van-stepper-button-disabled-icon-color);background-color:var(--van-stepper-button-disabled-color);cursor:not-allowed}.van-stepper__minus{border-radius:var(--van-stepper-radius) 0 0 var(--van-stepper-radius)}.van-stepper__minus:after{display:none}.van-stepper__plus{border-radius:0 var(--van-stepper-radius) var(--van-stepper-radius) 0}.van-stepper__input{box-sizing:border-box;width:var(--van-stepper-input-width);height:var(--van-stepper-input-height);margin:0 2px;padding:0;color:var(--van-stepper-input-text-color);font-size:var(--van-stepper-input-font-size);line-height:var(--van-stepper-input-line-height);text-align:center;vertical-align:middle;background:var(--van-stepper-background);border:0;border-width:1px 0;border-radius:0;-webkit-appearance:none}.van-stepper__input:disabled{color:var(--van-stepper-input-disabled-text-color);background-color:var(--van-stepper-input-disabled-background);-webkit-text-fill-color:var(--van-stepper-input-disabled-text-color);opacity:1}.van-stepper__input:read-only{cursor:default}.van-stepper--round .van-stepper__input{background-color:transparent}.van-stepper--round .van-stepper__plus,.van-stepper--round .van-stepper__minus{border-radius:100%}.van-stepper--round .van-stepper__plus--disabled,.van-stepper--round .van-stepper__minus--disabled{opacity:.3;cursor:not-allowed}.van-stepper--round .van-stepper__plus{color:var(--van-white);background:var(--van-stepper-button-round-theme-color)}.van-stepper--round .van-stepper__minus{color:var(--van-stepper-button-round-theme-color);background-color:var(--van-background-2);border:1px solid var(--van-stepper-button-round-theme-color)}:root,:host{--van-cell-font-size: var(--van-font-size-md);--van-cell-line-height: 24px;--van-cell-vertical-padding: 10px;--van-cell-horizontal-padding: var(--van-padding-md);--van-cell-text-color: var(--van-text-color);--van-cell-background: var(--van-background-2);--van-cell-border-color: var(--van-border-color);--van-cell-active-color: var(--van-active-color);--van-cell-required-color: var(--van-danger-color);--van-cell-label-color: var(--van-text-color-2);--van-cell-label-font-size: var(--van-font-size-sm);--van-cell-label-line-height: var(--van-line-height-sm);--van-cell-label-margin-top: var(--van-padding-base);--van-cell-value-color: var(--van-text-color-2);--van-cell-value-font-size: inherit;--van-cell-icon-size: 16px;--van-cell-right-icon-color: var(--van-gray-6);--van-cell-large-vertical-padding: var(--van-padding-sm);--van-cell-large-title-font-size: var(--van-font-size-lg);--van-cell-large-label-font-size: var(--van-font-size-md);--van-cell-large-value-font-size: inherit}.van-cell{position:relative;display:flex;box-sizing:border-box;width:100%;padding:var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);overflow:hidden;color:var(--van-cell-text-color);font-size:var(--van-cell-font-size);line-height:var(--van-cell-line-height);background:var(--van-cell-background)}.van-cell:after{position:absolute;box-sizing:border-box;content:" ";pointer-events:none;right:var(--van-padding-md);bottom:0;left:var(--van-padding-md);border-bottom:1px solid var(--van-cell-border-color);transform:scaleY(.5)}.van-cell:last-child:after,.van-cell--borderless:after{display:none}.van-cell__label{margin-top:var(--van-cell-label-margin-top);color:var(--van-cell-label-color);font-size:var(--van-cell-label-font-size);line-height:var(--van-cell-label-line-height)}.van-cell__title,.van-cell__value{flex:1}.van-cell__value{position:relative;overflow:hidden;color:var(--van-cell-value-color);font-size:var(--van-cell-value-font-size);text-align:right;vertical-align:middle;word-wrap:break-word}.van-cell__left-icon,.van-cell__right-icon{height:var(--van-cell-line-height);font-size:var(--van-cell-icon-size);line-height:var(--van-cell-line-height)}.van-cell__left-icon{margin-right:var(--van-padding-base)}.van-cell__right-icon{margin-left:var(--van-padding-base);color:var(--van-cell-right-icon-color)}.van-cell--clickable{cursor:pointer}.van-cell--clickable:active{background-color:var(--van-cell-active-color)}.van-cell--required{overflow:visible}.van-cell--required:before{position:absolute;left:var(--van-padding-xs);color:var(--van-cell-required-color);font-size:var(--van-cell-font-size);content:"*"}.van-cell--center{align-items:center}.van-cell--large{padding-top:var(--van-cell-large-vertical-padding);padding-bottom:var(--van-cell-large-vertical-padding)}.van-cell--large .van-cell__title{font-size:var(--van-cell-large-title-font-size)}.van-cell--large .van-cell__label{font-size:var(--van-cell-large-label-font-size)}.van-cell--large .van-cell__value{font-size:var(--van-cell-large-value-font-size)}:root,:host{--van-field-label-width: 6.2em;--van-field-label-color: var(--van-text-color);--van-field-label-margin-right: var(--van-padding-sm);--van-field-input-text-color: var(--van-text-color);--van-field-input-error-text-color: var(--van-danger-color);--van-field-input-disabled-text-color: var(--van-text-color-3);--van-field-placeholder-text-color: var(--van-text-color-3);--van-field-icon-size: 18px;--van-field-clear-icon-size: 18px;--van-field-clear-icon-color: var(--van-gray-5);--van-field-right-icon-color: var(--van-gray-6);--van-field-error-message-color: var(--van-danger-color);--van-field-error-message-font-size: 12px;--van-field-text-area-min-height: 60px;--van-field-word-limit-color: var(--van-gray-7);--van-field-word-limit-font-size: var(--van-font-size-sm);--van-field-word-limit-line-height: 16px;--van-field-disabled-text-color: var(--van-text-color-3);--van-field-required-mark-color: var(--van-red)}.van-field{flex-wrap:wrap}.van-field__label{flex:none;box-sizing:border-box;width:var(--van-field-label-width);margin-right:var(--van-field-label-margin-right);color:var(--van-field-label-color);text-align:left;word-wrap:break-word}.van-field__label--center{text-align:center}.van-field__label--right{text-align:right}.van-field__label--top{display:flex;width:100%;text-align:left;margin-bottom:var(--van-padding-base);overflow-wrap:break-word}.van-field__label--required:before{margin-right:2px;color:var(--van-field-required-mark-color);content:"*"}.van-field--disabled .van-field__label{color:var(--van-field-disabled-text-color)}.van-field__value{overflow:visible}.van-field__body{display:flex;align-items:center}.van-field__control{display:block;box-sizing:border-box;width:100%;min-width:0;margin:0;padding:0;color:var(--van-field-input-text-color);line-height:inherit;text-align:left;background-color:transparent;border:0;resize:none;-webkit-user-select:auto;user-select:auto}.van-field__control::-webkit-input-placeholder{color:var(--van-field-placeholder-text-color)}.van-field__control::placeholder{color:var(--van-field-placeholder-text-color)}.van-field__control:read-only{cursor:default}.van-field__control:disabled{color:var(--van-field-input-disabled-text-color);cursor:not-allowed;opacity:1;-webkit-text-fill-color:var(--van-field-input-disabled-text-color)}.van-field__control--center{justify-content:center;text-align:center}.van-field__control--right{justify-content:flex-end;text-align:right}.van-field__control--custom{display:flex;align-items:center;min-height:var(--van-cell-line-height)}.van-field__control--error::-webkit-input-placeholder{color:var(--van-field-input-error-text-color);-webkit-text-fill-color:currentColor}.van-field__control--error,.van-field__control--error::placeholder{color:var(--van-field-input-error-text-color);-webkit-text-fill-color:currentColor}.van-field__control--min-height{min-height:var(--van-field-text-area-min-height)}.van-field__control[type=date],.van-field__control[type=time],.van-field__control[type=datetime-local]{min-height:var(--van-cell-line-height)}.van-field__control[type=search]{-webkit-appearance:none}.van-field__clear,.van-field__icon,.van-field__button,.van-field__right-icon{flex-shrink:0}.van-field__clear,.van-field__right-icon{margin-right:calc(var(--van-padding-xs) * -1);padding:0 var(--van-padding-xs);line-height:inherit}.van-field__clear{color:var(--van-field-clear-icon-color);font-size:var(--van-field-clear-icon-size);cursor:pointer}.van-field__left-icon .van-icon,.van-field__right-icon .van-icon{display:block;font-size:var(--van-field-icon-size);line-height:inherit}.van-field__left-icon{margin-right:var(--van-padding-base)}.van-field__right-icon{color:var(--van-field-right-icon-color)}.van-field__button{padding-left:var(--van-padding-xs)}.van-field__error-message{color:var(--van-field-error-message-color);font-size:var(--van-field-error-message-font-size);text-align:left}.van-field__error-message--center{text-align:center}.van-field__error-message--right{text-align:right}.van-field__word-limit{margin-top:var(--van-padding-base);color:var(--van-field-word-limit-color);font-size:var(--van-field-word-limit-font-size);line-height:var(--van-field-word-limit-line-height);text-align:right}.van-swipe-item{position:relative;flex-shrink:0;width:100%;height:100%}.van-tab__panel,.van-tab__panel-wrapper{flex-shrink:0;box-sizing:border-box;width:100%}.van-tab__panel-wrapper--inactive{height:0;overflow:visible}:root,:host{--van-cell-group-background: var(--van-background-2);--van-cell-group-title-color: var(--van-text-color-2);--van-cell-group-title-padding: var(--van-padding-md) var(--van-padding-md);--van-cell-group-title-font-size: var(--van-font-size-md);--van-cell-group-title-line-height: 16px;--van-cell-group-inset-padding: 0 var(--van-padding-md);--van-cell-group-inset-radius: var(--van-radius-lg);--van-cell-group-inset-title-padding: var(--van-padding-md) var(--van-padding-md)}.van-cell-group{background:var(--van-cell-group-background)}.van-cell-group--inset{margin:var(--van-cell-group-inset-padding);border-radius:var(--van-cell-group-inset-radius);overflow:hidden}.van-cell-group__title{padding:var(--van-cell-group-title-padding);color:var(--van-cell-group-title-color);font-size:var(--van-cell-group-title-font-size);line-height:var(--van-cell-group-title-line-height)}.van-cell-group__title--inset{padding:var(--van-cell-group-inset-title-padding)}:root,:host{--van-loading-text-color: var(--van-text-color-2);--van-loading-text-font-size: var(--van-font-size-md);--van-loading-spinner-color: var(--van-gray-5);--van-loading-spinner-size: 30px;--van-loading-spinner-duration: .8s}.van-loading{position:relative;color:var(--van-loading-spinner-color);font-size:0;vertical-align:middle}.van-loading__spinner{position:relative;display:inline-block;width:var(--van-loading-spinner-size);max-width:100%;height:var(--van-loading-spinner-size);max-height:100%;vertical-align:middle;animation:van-rotate var(--van-loading-spinner-duration) linear infinite}.van-loading__spinner--spinner{animation-timing-function:steps(12)}.van-loading__spinner--circular{animation-duration:2s}.van-loading__line{position:absolute;top:0;left:0;width:100%;height:100%}.van-loading__line:before{display:block;width:2px;height:25%;margin:0 auto;background-color:currentColor;border-radius:40%;content:" "}.van-loading__circular{display:block;width:100%;height:100%}.van-loading__circular circle{animation:van-circular 1.5s ease-in-out infinite;stroke:currentColor;stroke-width:3;stroke-linecap:round}.van-loading__text{display:inline-block;margin-left:var(--van-padding-xs);color:var(--van-loading-text-color);font-size:var(--van-loading-text-font-size);vertical-align:middle}.van-loading--vertical{display:flex;flex-direction:column;align-items:center}.van-loading--vertical .van-loading__text{margin:var(--van-padding-xs) 0 0}@keyframes van-circular{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-40}to{stroke-dasharray:90,150;stroke-dashoffset:-120}}.van-loading__line--1{transform:rotate(30deg);opacity:1}.van-loading__line--2{transform:rotate(60deg);opacity:.9375}.van-loading__line--3{transform:rotate(90deg);opacity:.875}.van-loading__line--4{transform:rotate(120deg);opacity:.8125}.van-loading__line--5{transform:rotate(150deg);opacity:.75}.van-loading__line--6{transform:rotate(180deg);opacity:.6875}.van-loading__line--7{transform:rotate(210deg);opacity:.625}.van-loading__line--8{transform:rotate(240deg);opacity:.5625}.van-loading__line--9{transform:rotate(270deg);opacity:.5}.van-loading__line--10{transform:rotate(300deg);opacity:.4375}.van-loading__line--11{transform:rotate(330deg);opacity:.375}.van-loading__line--12{transform:rotate(360deg);opacity:.3125}:root,:host{--van-switch-size: 26px;--van-switch-width: calc(1.8em + 4px) ;--van-switch-height: calc(1em + 4px) ;--van-switch-node-size: 1em;--van-switch-node-background: var(--van-white);--van-switch-node-shadow: 0 3px 1px 0 rgba(0, 0, 0, .05);--van-switch-background: rgba(120, 120, 128, .16);--van-switch-on-background: var(--van-primary-color);--van-switch-duration: var(--van-duration-base);--van-switch-disabled-opacity: var(--van-disabled-opacity)}.van-theme-dark{--van-switch-background: rgba(120, 120, 128, .32)}.van-switch{position:relative;display:inline-block;box-sizing:content-box;width:var(--van-switch-width);height:var(--van-switch-height);font-size:var(--van-switch-size);background:var(--van-switch-background);border-radius:var(--van-switch-node-size);cursor:pointer;transition:background-color var(--van-switch-duration)}.van-switch__node{position:absolute;top:2px;left:2px;width:var(--van-switch-node-size);height:var(--van-switch-node-size);font-size:inherit;background:var(--van-switch-node-background);border-radius:100%;box-shadow:var(--van-switch-node-shadow);transition:transform var(--van-switch-duration) cubic-bezier(.3,1.05,.4,1.05)}.van-switch__loading{top:25%;left:25%;width:50%;height:50%;line-height:1}.van-switch--on{background:var(--van-switch-on-background)}.van-switch--on .van-switch__node{transform:translate(calc(var(--van-switch-width) - var(--van-switch-node-size) - 4px))}.van-switch--on .van-switch__loading{color:var(--van-switch-on-background)}.van-switch--disabled{cursor:not-allowed;opacity:var(--van-switch-disabled-opacity)}.van-switch--loading{cursor:default}:root,:host{--van-nav-bar-height: 46px;--van-nav-bar-background: var(--van-background-2);--van-nav-bar-arrow-size: 16px;--van-nav-bar-icon-color: var(--van-primary-color);--van-nav-bar-text-color: var(--van-primary-color);--van-nav-bar-title-font-size: var(--van-font-size-lg);--van-nav-bar-title-text-color: var(--van-text-color);--van-nav-bar-z-index: 1;--van-nav-bar-disabled-opacity: var(--van-disabled-opacity)}.van-nav-bar{position:relative;z-index:var(--van-nav-bar-z-index);line-height:var(--van-line-height-lg);text-align:center;background:var(--van-nav-bar-background);-webkit-user-select:none;user-select:none}.van-nav-bar--fixed{position:fixed;top:0;left:0;width:100%}.van-nav-bar--safe-area-inset-top{padding-top:constant(safe-area-inset-top);padding-top:env(safe-area-inset-top)}.van-nav-bar .van-icon{color:var(--van-nav-bar-icon-color)}.van-nav-bar__content{position:relative;display:flex;align-items:center;height:var(--van-nav-bar-height)}.van-nav-bar__arrow{margin-right:var(--van-padding-base);font-size:var(--van-nav-bar-arrow-size)}.van-nav-bar__title{max-width:60%;margin:0 auto;color:var(--van-nav-bar-title-text-color);font-weight:var(--van-font-bold);font-size:var(--van-nav-bar-title-font-size)}.van-nav-bar__left,.van-nav-bar__right{position:absolute;top:0;bottom:0;display:flex;align-items:center;padding:0 var(--van-padding-md);font-size:var(--van-font-size-md)}.van-nav-bar__left--disabled,.van-nav-bar__right--disabled{cursor:not-allowed;opacity:var(--van-nav-bar-disabled-opacity)}.van-nav-bar__left{left:0}.van-nav-bar__right{right:0}.van-nav-bar__text{color:var(--van-nav-bar-text-color)}:root,:host{--van-image-placeholder-text-color: var(--van-text-color-2);--van-image-placeholder-font-size: var(--van-font-size-md);--van-image-placeholder-background: var(--van-background);--van-image-loading-icon-size: 32px;--van-image-loading-icon-color: var(--van-gray-4);--van-image-error-icon-size: 32px;--van-image-error-icon-color: var(--van-gray-4)}.van-image{position:relative;display:inline-block}.van-image--round{overflow:hidden;border-radius:var(--van-radius-max)}.van-image--round .van-image__img{border-radius:inherit}.van-image--block{display:block}.van-image__img,.van-image__error,.van-image__loading{display:block;width:100%;height:100%}.van-image__error,.van-image__loading{position:absolute;top:0;left:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--van-image-placeholder-text-color);font-size:var(--van-image-placeholder-font-size);background:var(--van-image-placeholder-background)}.van-image__loading-icon{color:var(--van-image-loading-icon-color);font-size:var(--van-image-loading-icon-size)}.van-image__error-icon{color:var(--van-image-error-icon-color);font-size:var(--van-image-error-icon-size)}#app[data-v-b5ca6ba1]{position:fixed;left:0;right:0;bottom:0;top:0;margin:auto;z-index:1040;color:#000;width:375px;height:400px;background-color:#eee}.tab-content[data-v-b5ca6ba1]{margin-top:8px}.tab-content .cell-group[data-v-b5ca6ba1]{margin-bottom:8px}.console-switch[data-v-b5ca6ba1]{left:0;bottom:calc(50vh - 15px);position:fixed;display:flex;color:#0a0a0a;background-color:#eee;padding:.5em;box-shadow:0 0 4em 4px #eeeeee8c;align-items:center;border-radius:0 1em 1em 0;border:1px solid #9E9E9E;border-left-width:0}.console-switch span[data-v-b5ca6ba1]{margin-left:5px}:root,:host{--van-toast-max-width: 70%;--van-toast-font-size: var(--van-font-size-md);--van-toast-text-color: var(--van-white);--van-toast-loading-icon-color: var(--van-white);--van-toast-line-height: var(--van-line-height-md);--van-toast-radius: var(--van-radius-lg);--van-toast-background: rgba(0, 0, 0, .7);--van-toast-icon-size: 36px;--van-toast-text-min-width: 96px;--van-toast-text-padding: var(--van-padding-xs) var(--van-padding-sm);--van-toast-default-padding: var(--van-padding-md);--van-toast-default-width: 88px;--van-toast-default-min-height: 88px;--van-toast-position-top-distance: 20%;--van-toast-position-bottom-distance: 20%}.van-toast{display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:content-box;transition:all var(--van-duration-fast);width:var(--van-toast-default-width);max-width:var(--van-toast-max-width);min-height:var(--van-toast-default-min-height);padding:var(--van-toast-default-padding);color:var(--van-toast-text-color);font-size:var(--van-toast-font-size);line-height:var(--van-toast-line-height);white-space:pre-wrap;word-break:break-all;text-align:center;background:var(--van-toast-background);border-radius:var(--van-toast-radius)}.van-toast--break-normal{word-break:normal;word-wrap:normal}.van-toast--break-word{word-break:normal;word-wrap:break-word}.van-toast--unclickable{overflow:hidden;cursor:not-allowed}.van-toast--unclickable *{pointer-events:none}.van-toast--text,.van-toast--html{width:-webkit-fit-content;width:fit-content;min-width:var(--van-toast-text-min-width);min-height:0;padding:var(--van-toast-text-padding)}.van-toast--text .van-toast__text,.van-toast--html .van-toast__text{margin-top:0}.van-toast--top{top:var(--van-toast-position-top-distance)}.van-toast--bottom{top:auto;bottom:var(--van-toast-position-bottom-distance)}.van-toast__icon{font-size:var(--van-toast-icon-size)}.van-toast__loading{padding:var(--van-padding-base);color:var(--van-toast-loading-icon-color)}.van-toast__text{margin-top:var(--van-padding-xs)} ');

(function (vue) {
  'use strict';

  function noop$1() {
  }
  const extend = Object.assign;
  const inBrowser$1 = typeof window !== "undefined";
  const isObject$2 = (val) => val !== null && typeof val === "object";
  const isDef = (val) => val !== void 0 && val !== null;
  const isFunction = (val) => typeof val === "function";
  const isPromise = (val) => isObject$2(val) && isFunction(val.then) && isFunction(val.catch);
  const isNumeric = (val) => typeof val === "number" || /^\d+(\.\d+)?$/.test(val);
  const isIOS$1 = () => inBrowser$1 ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
  function get(object, path) {
    const keys = path.split(".");
    let result = object;
    keys.forEach((key) => {
      var _a;
      result = isObject$2(result) ? (_a = result[key]) != null ? _a : "" : "";
    });
    return result;
  }
  function pick(obj, keys, ignoreUndefined) {
    return keys.reduce(
      (ret, key) => {
        if (!ignoreUndefined || obj[key] !== void 0) {
          ret[key] = obj[key];
        }
        return ret;
      },
      {}
    );
  }
  const toArray = (item) => Array.isArray(item) ? item : [item];
  const unknownProp = null;
  const numericProp = [Number, String];
  const truthProp = {
    type: Boolean,
    default: true
  };
  const makeRequiredProp = (type) => ({
    type,
    required: true
  });
  const makeNumericProp = (defaultVal) => ({
    type: numericProp,
    default: defaultVal
  });
  const makeStringProp = (defaultVal) => ({
    type: String,
    default: defaultVal
  });
  var inBrowser = typeof window !== "undefined";
  function raf(fn) {
    return inBrowser ? requestAnimationFrame(fn) : -1;
  }
  function cancelRaf(id) {
    if (inBrowser) {
      cancelAnimationFrame(id);
    }
  }
  function doubleRaf(fn) {
    raf(() => raf(fn));
  }
  var isWindow = (val) => val === window;
  var makeDOMRect = (width2, height2) => ({
    top: 0,
    left: 0,
    right: width2,
    bottom: height2,
    width: width2,
    height: height2
  });
  var useRect = (elementOrRef) => {
    const element = vue.unref(elementOrRef);
    if (isWindow(element)) {
      const width2 = element.innerWidth;
      const height2 = element.innerHeight;
      return makeDOMRect(width2, height2);
    }
    if (element == null ? void 0 : element.getBoundingClientRect) {
      return element.getBoundingClientRect();
    }
    return makeDOMRect(0, 0);
  };
  function useParent(key) {
    const parent = vue.inject(key, null);
    if (parent) {
      const instance = vue.getCurrentInstance();
      const { link, unlink, internalChildren } = parent;
      link(instance);
      vue.onUnmounted(() => unlink(instance));
      const index = vue.computed(() => internalChildren.indexOf(instance));
      return {
        parent,
        index
      };
    }
    return {
      parent: null,
      index: vue.ref(-1)
    };
  }
  function flattenVNodes(children) {
    const result = [];
    const traverse = (children2) => {
      if (Array.isArray(children2)) {
        children2.forEach((child) => {
          var _a;
          if (vue.isVNode(child)) {
            result.push(child);
            if ((_a = child.component) == null ? void 0 : _a.subTree) {
              result.push(child.component.subTree);
              traverse(child.component.subTree.children);
            }
            if (child.children) {
              traverse(child.children);
            }
          }
        });
      }
    };
    traverse(children);
    return result;
  }
  var findVNodeIndex = (vnodes, vnode) => {
    const index = vnodes.indexOf(vnode);
    if (index === -1) {
      return vnodes.findIndex(
        (item) => vnode.key !== void 0 && vnode.key !== null && item.type === vnode.type && item.key === vnode.key
      );
    }
    return index;
  };
  function sortChildren(parent, publicChildren, internalChildren) {
    const vnodes = flattenVNodes(parent.subTree.children);
    internalChildren.sort(
      (a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode)
    );
    const orderedPublicChildren = internalChildren.map((item) => item.proxy);
    publicChildren.sort((a, b) => {
      const indexA = orderedPublicChildren.indexOf(a);
      const indexB = orderedPublicChildren.indexOf(b);
      return indexA - indexB;
    });
  }
  function useChildren(key) {
    const publicChildren = vue.reactive([]);
    const internalChildren = vue.reactive([]);
    const parent = vue.getCurrentInstance();
    const linkChildren = (value) => {
      const link = (child) => {
        if (child.proxy) {
          internalChildren.push(child);
          publicChildren.push(child.proxy);
          sortChildren(parent, publicChildren, internalChildren);
        }
      };
      const unlink = (child) => {
        const index = internalChildren.indexOf(child);
        publicChildren.splice(index, 1);
        internalChildren.splice(index, 1);
      };
      vue.provide(
        key,
        Object.assign(
          {
            link,
            unlink,
            children: publicChildren,
            internalChildren
          },
          value
        )
      );
    };
    return {
      children: publicChildren,
      linkChildren
    };
  }
  function onMountedOrActivated(hook) {
    let mounted;
    vue.onMounted(() => {
      hook();
      vue.nextTick(() => {
        mounted = true;
      });
    });
    vue.onActivated(() => {
      if (mounted) {
        hook();
      }
    });
  }
  function useEventListener$1(type, listener, options = {}) {
    if (!inBrowser) {
      return;
    }
    const { target = window, passive = false, capture = false } = options;
    let cleaned = false;
    let attached;
    const add = (target2) => {
      if (cleaned) {
        return;
      }
      const element = vue.unref(target2);
      if (element && !attached) {
        element.addEventListener(type, listener, {
          capture,
          passive
        });
        attached = true;
      }
    };
    const remove = (target2) => {
      if (cleaned) {
        return;
      }
      const element = vue.unref(target2);
      if (element && attached) {
        element.removeEventListener(type, listener, capture);
        attached = false;
      }
    };
    vue.onUnmounted(() => remove(target));
    vue.onDeactivated(() => remove(target));
    onMountedOrActivated(() => add(target));
    let stopWatch;
    if (vue.isRef(target)) {
      stopWatch = vue.watch(target, (val, oldVal) => {
        remove(oldVal);
        add(val);
      });
    }
    return () => {
      stopWatch == null ? void 0 : stopWatch();
      remove(target);
      cleaned = true;
    };
  }
  var width;
  var height;
  function useWindowSize() {
    if (!width) {
      width = vue.ref(0);
      height = vue.ref(0);
      if (inBrowser) {
        const update = () => {
          width.value = window.innerWidth;
          height.value = window.innerHeight;
        };
        update();
        window.addEventListener("resize", update, { passive: true });
        window.addEventListener("orientationchange", update, { passive: true });
      }
    }
    return { width, height };
  }
  var overflowScrollReg = /scroll|auto|overlay/i;
  var defaultRoot = inBrowser ? window : void 0;
  function isElement(node) {
    const ELEMENT_NODE_TYPE = 1;
    return node.tagName !== "HTML" && node.tagName !== "BODY" && node.nodeType === ELEMENT_NODE_TYPE;
  }
  function getScrollParent(el, root = defaultRoot) {
    let node = el;
    while (node && node !== root && isElement(node)) {
      const { overflowY } = window.getComputedStyle(node);
      if (overflowScrollReg.test(overflowY)) {
        return node;
      }
      node = node.parentNode;
    }
    return root;
  }
  function useScrollParent(el, root = defaultRoot) {
    const scrollParent = vue.ref();
    vue.onMounted(() => {
      if (el.value) {
        scrollParent.value = getScrollParent(el.value, root);
      }
    });
    return scrollParent;
  }
  var visibility;
  function usePageVisibility() {
    if (!visibility) {
      visibility = vue.ref("visible");
      if (inBrowser) {
        const update = () => {
          visibility.value = document.hidden ? "hidden" : "visible";
        };
        update();
        window.addEventListener("visibilitychange", update);
      }
    }
    return visibility;
  }
  var CUSTOM_FIELD_INJECTION_KEY = Symbol("van-field");
  function useCustomFieldValue(customValue) {
    const field = vue.inject(CUSTOM_FIELD_INJECTION_KEY, null);
    if (field && !field.customValue.value) {
      field.customValue.value = customValue;
      vue.watch(customValue, () => {
        field.resetValidation();
        field.validateWithTrigger("onChange");
      });
    }
  }
  function getScrollTop(el) {
    const top = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
    return Math.max(top, 0);
  }
  function setScrollTop(el, value) {
    if ("scrollTop" in el) {
      el.scrollTop = value;
    } else {
      el.scrollTo(el.scrollX, value);
    }
  }
  function getRootScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  function setRootScrollTop(value) {
    setScrollTop(window, value);
    setScrollTop(document.body, value);
  }
  function getElementTop(el, scroller) {
    if (el === window) {
      return 0;
    }
    const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
    return useRect(el).top + scrollTop;
  }
  const isIOS = isIOS$1();
  function resetScroll() {
    if (isIOS) {
      setRootScrollTop(getRootScrollTop());
    }
  }
  const stopPropagation = (event) => event.stopPropagation();
  function preventDefault(event, isStopPropagation) {
    if (typeof event.cancelable !== "boolean" || event.cancelable) {
      event.preventDefault();
    }
    if (isStopPropagation) {
      stopPropagation(event);
    }
  }
  function isHidden(elementRef) {
    const el = vue.unref(elementRef);
    if (!el) {
      return false;
    }
    const style = window.getComputedStyle(el);
    const hidden = style.display === "none";
    const parentHidden = el.offsetParent === null && style.position !== "fixed";
    return hidden || parentHidden;
  }
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  function addUnit(value) {
    if (isDef(value)) {
      return isNumeric(value) ? `${value}px` : String(value);
    }
    return void 0;
  }
  function getSizeStyle(originSize) {
    if (isDef(originSize)) {
      if (Array.isArray(originSize)) {
        return {
          width: addUnit(originSize[0]),
          height: addUnit(originSize[1])
        };
      }
      const size = addUnit(originSize);
      return {
        width: size,
        height: size
      };
    }
  }
  function getZIndexStyle(zIndex) {
    const style = {};
    if (zIndex !== void 0) {
      style.zIndex = +zIndex;
    }
    return style;
  }
  let rootFontSize;
  function getRootFontSize() {
    if (!rootFontSize) {
      const doc = document.documentElement;
      const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;
      rootFontSize = parseFloat(fontSize);
    }
    return rootFontSize;
  }
  function convertRem(value) {
    value = value.replace(/rem/g, "");
    return +value * getRootFontSize();
  }
  function convertVw(value) {
    value = value.replace(/vw/g, "");
    return +value * windowWidth.value / 100;
  }
  function convertVh(value) {
    value = value.replace(/vh/g, "");
    return +value * windowHeight.value / 100;
  }
  function unitToPx(value) {
    if (typeof value === "number") {
      return value;
    }
    if (inBrowser$1) {
      if (value.includes("rem")) {
        return convertRem(value);
      }
      if (value.includes("vw")) {
        return convertVw(value);
      }
      if (value.includes("vh")) {
        return convertVh(value);
      }
    }
    return parseFloat(value);
  }
  const camelizeRE = /-(\w)/g;
  const camelize = (str) => str.replace(camelizeRE, (_, c) => c.toUpperCase());
  const kebabCase = (str) => str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  function trimExtraChar(value, char, regExp) {
    const index = value.indexOf(char);
    if (index === -1) {
      return value;
    }
    if (char === "-" && index !== 0) {
      return value.slice(0, index);
    }
    return value.slice(0, index + 1) + value.slice(index).replace(regExp, "");
  }
  function formatNumber(value, allowDot = true, allowMinus = true) {
    if (allowDot) {
      value = trimExtraChar(value, ".", /\./g);
    } else {
      value = value.split(".")[0];
    }
    if (allowMinus) {
      value = trimExtraChar(value, "-", /-/g);
    } else {
      value = value.replace(/-/, "");
    }
    const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
    return value.replace(regExp, "");
  }
  function addNumber(num1, num2) {
    const cardinal = 10 ** 10;
    return Math.round((num1 + num2) * cardinal) / cardinal;
  }
  const { hasOwnProperty } = Object.prototype;
  function assignKey(to, from, key) {
    const val = from[key];
    if (!isDef(val)) {
      return;
    }
    if (!hasOwnProperty.call(to, key) || !isObject$2(val)) {
      to[key] = val;
    } else {
      to[key] = deepAssign(Object(to[key]), val);
    }
  }
  function deepAssign(to, from) {
    Object.keys(from).forEach((key) => {
      assignKey(to, from, key);
    });
    return to;
  }
  var stdin_default$m = {
    name: "姓名",
    tel: "电话",
    save: "保存",
    clear: "清空",
    cancel: "取消",
    confirm: "确认",
    delete: "删除",
    loading: "加载中...",
    noCoupon: "暂无优惠券",
    nameEmpty: "请填写姓名",
    addContact: "添加联系人",
    telInvalid: "请填写正确的电话",
    vanCalendar: {
      end: "结束",
      start: "开始",
      title: "日期选择",
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      monthTitle: (year, month) => `${year}年${month}月`,
      rangePrompt: (maxRange) => `最多选择 ${maxRange} 天`
    },
    vanCascader: {
      select: "请选择"
    },
    vanPagination: {
      prev: "上一页",
      next: "下一页"
    },
    vanPullRefresh: {
      pulling: "下拉即可刷新...",
      loosing: "释放即可刷新..."
    },
    vanSubmitBar: {
      label: "合计:"
    },
    vanCoupon: {
      unlimited: "无门槛",
      discount: (discount) => `${discount}折`,
      condition: (condition) => `满${condition}元可用`
    },
    vanCouponCell: {
      title: "优惠券",
      count: (count) => `${count}张可用`
    },
    vanCouponList: {
      exchange: "兑换",
      close: "不使用",
      enable: "可用",
      disabled: "不可用",
      placeholder: "输入优惠码"
    },
    vanAddressEdit: {
      area: "地区",
      areaEmpty: "请选择地区",
      addressEmpty: "请填写详细地址",
      addressDetail: "详细地址",
      defaultAddress: "设为默认收货地址"
    },
    vanAddressList: {
      add: "新增地址"
    }
  };
  const lang = vue.ref("zh-CN");
  const messages = vue.reactive({
    "zh-CN": stdin_default$m
  });
  const Locale = {
    messages() {
      return messages[lang.value];
    },
    use(newLang, newMessages) {
      lang.value = newLang;
      this.add({ [newLang]: newMessages });
    },
    add(newMessages = {}) {
      deepAssign(messages, newMessages);
    }
  };
  var stdin_default$l = Locale;
  function createTranslate(name2) {
    const prefix = camelize(name2) + ".";
    return (path, ...args) => {
      const messages2 = stdin_default$l.messages();
      const message = get(messages2, prefix + path) || get(messages2, path);
      return isFunction(message) ? message(...args) : message;
    };
  }
  function genBem(name2, mods) {
    if (!mods) {
      return "";
    }
    if (typeof mods === "string") {
      return ` ${name2}--${mods}`;
    }
    if (Array.isArray(mods)) {
      return mods.reduce(
        (ret, item) => ret + genBem(name2, item),
        ""
      );
    }
    return Object.keys(mods).reduce(
      (ret, key) => ret + (mods[key] ? genBem(name2, key) : ""),
      ""
    );
  }
  function createBEM(name2) {
    return (el, mods) => {
      if (el && typeof el !== "string") {
        mods = el;
        el = "";
      }
      el = el ? `${name2}__${el}` : name2;
      return `${el}${genBem(el, mods)}`;
    };
  }
  function createNamespace(name2) {
    const prefixedName = `van-${name2}`;
    return [
      prefixedName,
      createBEM(prefixedName),
      createTranslate(prefixedName)
    ];
  }
  const BORDER = "van-hairline";
  const BORDER_BOTTOM = `${BORDER}--bottom`;
  const BORDER_TOP_BOTTOM = `${BORDER}--top-bottom`;
  const HAPTICS_FEEDBACK = "van-haptics-feedback";
  const FORM_KEY = Symbol("van-form");
  const LONG_PRESS_START_TIME = 500;
  const TAP_OFFSET = 5;
  function callInterceptor(interceptor, {
    args = [],
    done,
    canceled,
    error
  }) {
    if (interceptor) {
      const returnVal = interceptor.apply(null, args);
      if (isPromise(returnVal)) {
        returnVal.then((value) => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        }).catch(error || noop$1);
      } else if (returnVal) {
        done();
      } else if (canceled) {
        canceled();
      }
    } else {
      done();
    }
  }
  function withInstall(options) {
    options.install = (app) => {
      const { name: name2 } = options;
      if (name2) {
        app.component(name2, options);
        app.component(camelize(`-${name2}`), options);
      }
    };
    return options;
  }
  const POPUP_TOGGLE_KEY = Symbol();
  function onPopupReopen(callback) {
    const popupToggleStatus = vue.inject(POPUP_TOGGLE_KEY, null);
    if (popupToggleStatus) {
      vue.watch(popupToggleStatus, (show) => {
        if (show) {
          callback();
        }
      });
    }
  }
  const useHeight = (element, withSafeArea) => {
    const height2 = vue.ref();
    const setHeight = () => {
      height2.value = useRect(element).height;
    };
    vue.onMounted(() => {
      vue.nextTick(setHeight);
      if (withSafeArea) {
        for (let i = 1; i <= 3; i++) {
          setTimeout(setHeight, 100 * i);
        }
      }
    });
    onPopupReopen(() => vue.nextTick(setHeight));
    vue.watch([windowWidth, windowHeight], setHeight);
    return height2;
  };
  function usePlaceholder(contentRef, bem2) {
    const height2 = useHeight(contentRef, true);
    return (renderContent) => vue.createVNode("div", {
      "class": bem2("placeholder"),
      "style": {
        height: height2.value ? `${height2.value}px` : void 0
      }
    }, [renderContent()]);
  }
  function useExpose(apis) {
    const instance = vue.getCurrentInstance();
    if (instance) {
      extend(instance.proxy, apis);
    }
  }
  const routeProps = {
    to: [String, Object],
    url: String,
    replace: Boolean
  };
  function route({
    to,
    url,
    replace,
    $router: router
  }) {
    if (to && router) {
      router[replace ? "replace" : "push"](to);
    } else if (url) {
      replace ? location.replace(url) : location.href = url;
    }
  }
  function useRoute() {
    const vm = vue.getCurrentInstance().proxy;
    return () => route(vm);
  }
  const [name$l, bem$l] = createNamespace("badge");
  const badgeProps = {
    dot: Boolean,
    max: numericProp,
    tag: makeStringProp("div"),
    color: String,
    offset: Array,
    content: numericProp,
    showZero: truthProp,
    position: makeStringProp("top-right")
  };
  var stdin_default$k = vue.defineComponent({
    name: name$l,
    props: badgeProps,
    setup(props, {
      slots
    }) {
      const hasContent = () => {
        if (slots.content) {
          return true;
        }
        const {
          content,
          showZero
        } = props;
        return isDef(content) && content !== "" && (showZero || content !== 0 && content !== "0");
      };
      const renderContent = () => {
        const {
          dot,
          max,
          content
        } = props;
        if (!dot && hasContent()) {
          if (slots.content) {
            return slots.content();
          }
          if (isDef(max) && isNumeric(content) && +content > +max) {
            return `${max}+`;
          }
          return content;
        }
      };
      const getOffsetWithMinusString = (val) => val.startsWith("-") ? val.replace("-", "") : `-${val}`;
      const style = vue.computed(() => {
        const style2 = {
          background: props.color
        };
        if (props.offset) {
          const [x, y] = props.offset;
          const {
            position
          } = props;
          const [offsetY, offsetX] = position.split("-");
          if (slots.default) {
            if (typeof y === "number") {
              style2[offsetY] = addUnit(offsetY === "top" ? y : -y);
            } else {
              style2[offsetY] = offsetY === "top" ? addUnit(y) : getOffsetWithMinusString(y);
            }
            if (typeof x === "number") {
              style2[offsetX] = addUnit(offsetX === "left" ? x : -x);
            } else {
              style2[offsetX] = offsetX === "left" ? addUnit(x) : getOffsetWithMinusString(x);
            }
          } else {
            style2.marginTop = addUnit(y);
            style2.marginLeft = addUnit(x);
          }
        }
        return style2;
      });
      const renderBadge = () => {
        if (hasContent() || props.dot) {
          return vue.createVNode("div", {
            "class": bem$l([props.position, {
              dot: props.dot,
              fixed: !!slots.default
            }]),
            "style": style.value
          }, [renderContent()]);
        }
      };
      return () => {
        if (slots.default) {
          const {
            tag
          } = props;
          return vue.createVNode(tag, {
            "class": bem$l("wrapper")
          }, {
            default: () => [slots.default(), renderBadge()]
          });
        }
        return renderBadge();
      };
    }
  });
  const Badge = withInstall(stdin_default$k);
  let globalZIndex = 2e3;
  const useGlobalZIndex = () => ++globalZIndex;
  const setGlobalZIndex = (val) => {
    globalZIndex = val;
  };
  const [name$k, bem$k] = createNamespace("config-provider");
  const CONFIG_PROVIDER_KEY = Symbol(name$k);
  const configProviderProps = {
    tag: makeStringProp("div"),
    theme: makeStringProp("light"),
    zIndex: Number,
    themeVars: Object,
    themeVarsDark: Object,
    themeVarsLight: Object,
    themeVarsScope: makeStringProp("local"),
    iconPrefix: String
  };
  function insertDash(str) {
    return str.replace(/([a-zA-Z])(\d)/g, "$1-$2");
  }
  function mapThemeVarsToCSSVars(themeVars) {
    const cssVars = {};
    Object.keys(themeVars).forEach((key) => {
      const formattedKey = insertDash(kebabCase(key));
      cssVars[`--van-${formattedKey}`] = themeVars[key];
    });
    return cssVars;
  }
  function syncThemeVarsOnRoot(newStyle = {}, oldStyle = {}) {
    Object.keys(newStyle).forEach((key) => {
      if (newStyle[key] !== oldStyle[key]) {
        document.documentElement.style.setProperty(key, newStyle[key]);
      }
    });
    Object.keys(oldStyle).forEach((key) => {
      if (!newStyle[key]) {
        document.documentElement.style.removeProperty(key);
      }
    });
  }
  vue.defineComponent({
    name: name$k,
    props: configProviderProps,
    setup(props, {
      slots
    }) {
      const style = vue.computed(() => mapThemeVarsToCSSVars(extend({}, props.themeVars, props.theme === "dark" ? props.themeVarsDark : props.themeVarsLight)));
      if (inBrowser$1) {
        const addTheme = () => {
          document.documentElement.classList.add(`van-theme-${props.theme}`);
        };
        const removeTheme = (theme = props.theme) => {
          document.documentElement.classList.remove(`van-theme-${theme}`);
        };
        vue.watch(() => props.theme, (newVal, oldVal) => {
          if (oldVal) {
            removeTheme(oldVal);
          }
          addTheme();
        }, {
          immediate: true
        });
        vue.onActivated(addTheme);
        vue.onDeactivated(removeTheme);
        vue.onBeforeUnmount(removeTheme);
        vue.watch(style, (newStyle, oldStyle) => {
          if (props.themeVarsScope === "global") {
            syncThemeVarsOnRoot(newStyle, oldStyle);
          }
        });
        vue.watch(() => props.themeVarsScope, (newScope, oldScope) => {
          if (oldScope === "global") {
            syncThemeVarsOnRoot({}, style.value);
          }
          if (newScope === "global") {
            syncThemeVarsOnRoot(style.value, {});
          }
        });
        if (props.themeVarsScope === "global") {
          syncThemeVarsOnRoot(style.value, {});
        }
      }
      vue.provide(CONFIG_PROVIDER_KEY, props);
      vue.watchEffect(() => {
        if (props.zIndex !== void 0) {
          setGlobalZIndex(props.zIndex);
        }
      });
      return () => vue.createVNode(props.tag, {
        "class": bem$k(),
        "style": props.themeVarsScope === "local" ? style.value : void 0
      }, {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      });
    }
  });
  const [name$j, bem$j] = createNamespace("icon");
  const isImage = (name2) => name2 == null ? void 0 : name2.includes("/");
  const iconProps = {
    dot: Boolean,
    tag: makeStringProp("i"),
    name: String,
    size: numericProp,
    badge: numericProp,
    color: String,
    badgeProps: Object,
    classPrefix: String
  };
  var stdin_default$j = vue.defineComponent({
    name: name$j,
    props: iconProps,
    setup(props, {
      slots
    }) {
      const config = vue.inject(CONFIG_PROVIDER_KEY, null);
      const classPrefix = vue.computed(() => props.classPrefix || (config == null ? void 0 : config.iconPrefix) || bem$j());
      return () => {
        const {
          tag,
          dot,
          name: name2,
          size,
          badge,
          color
        } = props;
        const isImageIcon = isImage(name2);
        return vue.createVNode(Badge, vue.mergeProps({
          "dot": dot,
          "tag": tag,
          "class": [classPrefix.value, isImageIcon ? "" : `${classPrefix.value}-${name2}`],
          "style": {
            color,
            fontSize: addUnit(size)
          },
          "content": badge
        }, props.badgeProps), {
          default: () => {
            var _a;
            return [(_a = slots.default) == null ? void 0 : _a.call(slots), isImageIcon && vue.createVNode("img", {
              "class": bem$j("image"),
              "src": name2
            }, null)];
          }
        });
      };
    }
  });
  const Icon = withInstall(stdin_default$j);
  const [name$i, bem$i] = createNamespace("loading");
  const SpinIcon = Array(12).fill(null).map((_, index) => vue.createVNode("i", {
    "class": bem$i("line", String(index + 1))
  }, null));
  const CircularIcon = vue.createVNode("svg", {
    "class": bem$i("circular"),
    "viewBox": "25 25 50 50"
  }, [vue.createVNode("circle", {
    "cx": "50",
    "cy": "50",
    "r": "20",
    "fill": "none"
  }, null)]);
  const loadingProps = {
    size: numericProp,
    type: makeStringProp("circular"),
    color: String,
    vertical: Boolean,
    textSize: numericProp,
    textColor: String
  };
  var stdin_default$i = vue.defineComponent({
    name: name$i,
    props: loadingProps,
    setup(props, {
      slots
    }) {
      const spinnerStyle = vue.computed(() => extend({
        color: props.color
      }, getSizeStyle(props.size)));
      const renderIcon = () => {
        const DefaultIcon = props.type === "spinner" ? SpinIcon : CircularIcon;
        return vue.createVNode("span", {
          "class": bem$i("spinner", props.type),
          "style": spinnerStyle.value
        }, [slots.icon ? slots.icon() : DefaultIcon]);
      };
      const renderText = () => {
        var _a;
        if (slots.default) {
          return vue.createVNode("span", {
            "class": bem$i("text"),
            "style": {
              fontSize: addUnit(props.textSize),
              color: (_a = props.textColor) != null ? _a : props.color
            }
          }, [slots.default()]);
        }
      };
      return () => {
        const {
          type,
          vertical
        } = props;
        return vue.createVNode("div", {
          "class": bem$i([type, {
            vertical
          }]),
          "aria-live": "polite",
          "aria-busy": true
        }, [renderIcon(), renderText()]);
      };
    }
  });
  const Loading = withInstall(stdin_default$i);
  const popupSharedProps = {
    // whether to show popup
    show: Boolean,
    // z-index
    zIndex: numericProp,
    // whether to show overlay
    overlay: truthProp,
    // transition duration
    duration: numericProp,
    // teleport
    teleport: [String, Object],
    // prevent body scroll
    lockScroll: truthProp,
    // whether to lazy render
    lazyRender: truthProp,
    // callback function before close
    beforeClose: Function,
    // overlay custom style
    overlayStyle: Object,
    // overlay custom class name
    overlayClass: unknownProp,
    // Initial rendering animation
    transitionAppear: Boolean,
    // whether to close popup when overlay is clicked
    closeOnClickOverlay: truthProp
  };
  function getDirection(x, y) {
    if (x > y) {
      return "horizontal";
    }
    if (y > x) {
      return "vertical";
    }
    return "";
  }
  function useTouch() {
    const startX = vue.ref(0);
    const startY = vue.ref(0);
    const deltaX = vue.ref(0);
    const deltaY = vue.ref(0);
    const offsetX = vue.ref(0);
    const offsetY = vue.ref(0);
    const direction = vue.ref("");
    const isTap = vue.ref(true);
    const isVertical = () => direction.value === "vertical";
    const isHorizontal = () => direction.value === "horizontal";
    const reset = () => {
      deltaX.value = 0;
      deltaY.value = 0;
      offsetX.value = 0;
      offsetY.value = 0;
      direction.value = "";
      isTap.value = true;
    };
    const start = (event) => {
      reset();
      startX.value = event.touches[0].clientX;
      startY.value = event.touches[0].clientY;
    };
    const move = (event) => {
      const touch = event.touches[0];
      deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
      deltaY.value = touch.clientY - startY.value;
      offsetX.value = Math.abs(deltaX.value);
      offsetY.value = Math.abs(deltaY.value);
      const LOCK_DIRECTION_DISTANCE = 10;
      if (!direction.value || offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE) {
        direction.value = getDirection(offsetX.value, offsetY.value);
      }
      if (isTap.value && (offsetX.value > TAP_OFFSET || offsetY.value > TAP_OFFSET)) {
        isTap.value = false;
      }
    };
    return {
      move,
      start,
      reset,
      startX,
      startY,
      deltaX,
      deltaY,
      offsetX,
      offsetY,
      direction,
      isVertical,
      isHorizontal,
      isTap
    };
  }
  let totalLockCount = 0;
  const BODY_LOCK_CLASS = "van-overflow-hidden";
  function useLockScroll(rootRef, shouldLock) {
    const touch = useTouch();
    const DIRECTION_UP = "01";
    const DIRECTION_DOWN = "10";
    const onTouchMove = (event) => {
      touch.move(event);
      const direction = touch.deltaY.value > 0 ? DIRECTION_DOWN : DIRECTION_UP;
      const el = getScrollParent(
        event.target,
        rootRef.value
      );
      const { scrollHeight, offsetHeight, scrollTop } = el;
      let status = "11";
      if (scrollTop === 0) {
        status = offsetHeight >= scrollHeight ? "00" : "01";
      } else if (scrollTop + offsetHeight >= scrollHeight) {
        status = "10";
      }
      if (status !== "11" && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
        preventDefault(event, true);
      }
    };
    const lock = () => {
      document.addEventListener("touchstart", touch.start);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      if (!totalLockCount) {
        document.body.classList.add(BODY_LOCK_CLASS);
      }
      totalLockCount++;
    };
    const unlock = () => {
      if (totalLockCount) {
        document.removeEventListener("touchstart", touch.start);
        document.removeEventListener("touchmove", onTouchMove);
        totalLockCount--;
        if (!totalLockCount) {
          document.body.classList.remove(BODY_LOCK_CLASS);
        }
      }
    };
    const init = () => shouldLock() && lock();
    const destroy = () => shouldLock() && unlock();
    onMountedOrActivated(init);
    vue.onDeactivated(destroy);
    vue.onBeforeUnmount(destroy);
    vue.watch(shouldLock, (value) => {
      value ? lock() : unlock();
    });
  }
  function useLazyRender(show) {
    const inited = vue.ref(false);
    vue.watch(
      show,
      (value) => {
        if (value) {
          inited.value = value;
        }
      },
      { immediate: true }
    );
    return (render) => () => inited.value ? render() : null;
  }
  const useScopeId = () => {
    var _a;
    const { scopeId } = ((_a = vue.getCurrentInstance()) == null ? void 0 : _a.vnode) || {};
    return scopeId ? { [scopeId]: "" } : null;
  };
  const [name$h, bem$h] = createNamespace("overlay");
  const overlayProps = {
    show: Boolean,
    zIndex: numericProp,
    duration: numericProp,
    className: unknownProp,
    lockScroll: truthProp,
    lazyRender: truthProp,
    customStyle: Object
  };
  var stdin_default$h = vue.defineComponent({
    name: name$h,
    props: overlayProps,
    setup(props, {
      slots
    }) {
      const root = vue.ref();
      const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
      const onTouchMove = (event) => {
        if (props.lockScroll) {
          preventDefault(event, true);
        }
      };
      const renderOverlay = lazyRender(() => {
        var _a;
        const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
        if (isDef(props.duration)) {
          style.animationDuration = `${props.duration}s`;
        }
        return vue.withDirectives(vue.createVNode("div", {
          "ref": root,
          "style": style,
          "class": [bem$h(), props.className]
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), [[vue.vShow, props.show]]);
      });
      useEventListener$1("touchmove", onTouchMove, {
        target: root
      });
      return () => vue.createVNode(vue.Transition, {
        "name": "van-fade",
        "appear": true
      }, {
        default: renderOverlay
      });
    }
  });
  const Overlay = withInstall(stdin_default$h);
  const popupProps = extend({}, popupSharedProps, {
    round: Boolean,
    position: makeStringProp("center"),
    closeIcon: makeStringProp("cross"),
    closeable: Boolean,
    transition: String,
    iconPrefix: String,
    closeOnPopstate: Boolean,
    closeIconPosition: makeStringProp("top-right"),
    safeAreaInsetTop: Boolean,
    safeAreaInsetBottom: Boolean
  });
  const [name$g, bem$g] = createNamespace("popup");
  var stdin_default$g = vue.defineComponent({
    name: name$g,
    inheritAttrs: false,
    props: popupProps,
    emits: ["open", "close", "opened", "closed", "keydown", "update:show", "clickOverlay", "clickCloseIcon"],
    setup(props, {
      emit,
      attrs,
      slots
    }) {
      let opened;
      let shouldReopen;
      const zIndex = vue.ref();
      const popupRef = vue.ref();
      const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
      const style = vue.computed(() => {
        const style2 = {
          zIndex: zIndex.value
        };
        if (isDef(props.duration)) {
          const key = props.position === "center" ? "animationDuration" : "transitionDuration";
          style2[key] = `${props.duration}s`;
        }
        return style2;
      });
      const open = () => {
        if (!opened) {
          opened = true;
          zIndex.value = props.zIndex !== void 0 ? +props.zIndex : useGlobalZIndex();
          emit("open");
        }
      };
      const close = () => {
        if (opened) {
          callInterceptor(props.beforeClose, {
            done() {
              opened = false;
              emit("close");
              emit("update:show", false);
            }
          });
        }
      };
      const onClickOverlay = (event) => {
        emit("clickOverlay", event);
        if (props.closeOnClickOverlay) {
          close();
        }
      };
      const renderOverlay = () => {
        if (props.overlay) {
          return vue.createVNode(Overlay, vue.mergeProps({
            "show": props.show,
            "class": props.overlayClass,
            "zIndex": zIndex.value,
            "duration": props.duration,
            "customStyle": props.overlayStyle,
            "role": props.closeOnClickOverlay ? "button" : void 0,
            "tabindex": props.closeOnClickOverlay ? 0 : void 0
          }, useScopeId(), {
            "onClick": onClickOverlay
          }), {
            default: slots["overlay-content"]
          });
        }
      };
      const onClickCloseIcon = (event) => {
        emit("clickCloseIcon", event);
        close();
      };
      const renderCloseIcon = () => {
        if (props.closeable) {
          return vue.createVNode(Icon, {
            "role": "button",
            "tabindex": 0,
            "name": props.closeIcon,
            "class": [bem$g("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
            "classPrefix": props.iconPrefix,
            "onClick": onClickCloseIcon
          }, null);
        }
      };
      let timer;
      const onOpened = () => {
        if (timer)
          clearTimeout(timer);
        timer = setTimeout(() => {
          emit("opened");
        });
      };
      const onClosed = () => emit("closed");
      const onKeydown = (event) => emit("keydown", event);
      const renderPopup = lazyRender(() => {
        var _a;
        const {
          round,
          position,
          safeAreaInsetTop,
          safeAreaInsetBottom
        } = props;
        return vue.withDirectives(vue.createVNode("div", vue.mergeProps({
          "ref": popupRef,
          "style": style.value,
          "role": "dialog",
          "tabindex": 0,
          "class": [bem$g({
            round,
            [position]: position
          }), {
            "van-safe-area-top": safeAreaInsetTop,
            "van-safe-area-bottom": safeAreaInsetBottom
          }],
          "onKeydown": onKeydown
        }, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots), renderCloseIcon()]), [[vue.vShow, props.show]]);
      });
      const renderTransition = () => {
        const {
          position,
          transition,
          transitionAppear
        } = props;
        const name2 = position === "center" ? "van-fade" : `van-popup-slide-${position}`;
        return vue.createVNode(vue.Transition, {
          "name": transition || name2,
          "appear": transitionAppear,
          "onAfterEnter": onOpened,
          "onAfterLeave": onClosed
        }, {
          default: renderPopup
        });
      };
      vue.watch(() => props.show, (show) => {
        if (show && !opened) {
          open();
          if (attrs.tabindex === 0) {
            vue.nextTick(() => {
              var _a;
              (_a = popupRef.value) == null ? void 0 : _a.focus();
            });
          }
        }
        if (!show && opened) {
          opened = false;
          emit("close");
        }
      });
      useExpose({
        popupRef
      });
      useLockScroll(popupRef, () => props.show && props.lockScroll);
      useEventListener$1("popstate", () => {
        if (props.closeOnPopstate) {
          close();
          shouldReopen = false;
        }
      });
      vue.onMounted(() => {
        if (props.show) {
          open();
        }
      });
      vue.onActivated(() => {
        if (shouldReopen) {
          emit("update:show", true);
          shouldReopen = false;
        }
      });
      vue.onDeactivated(() => {
        if (props.show && props.teleport) {
          close();
          shouldReopen = true;
        }
      });
      vue.provide(POPUP_TOGGLE_KEY, () => props.show);
      return () => {
        if (props.teleport) {
          return vue.createVNode(vue.Teleport, {
            "to": props.teleport
          }, {
            default: () => [renderOverlay(), renderTransition()]
          });
        }
        return vue.createVNode(vue.Fragment, null, [renderOverlay(), renderTransition()]);
      };
    }
  });
  const Popup = withInstall(stdin_default$g);
  /**
  * @vue/shared v3.4.19
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **/
  const isArray = Array.isArray;
  const isString = (val) => typeof val === "string";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject$1(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function stringifyStyle(styles) {
    let ret = "";
    if (!styles || isString(styles)) {
      return ret;
    }
    for (const key in styles) {
      const value = styles[key];
      const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
      if (isString(value) || typeof value === "number") {
        ret += `${normalizedKey}:${value};`;
      }
    }
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject$1(value)) {
      for (const name2 in value) {
        if (value[name2]) {
          res += name2 + " ";
        }
      }
    }
    return res.trim();
  }
  function scrollLeftTo(scroller, to, duration) {
    let rafId;
    let count = 0;
    const from = scroller.scrollLeft;
    const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
    function cancel() {
      cancelRaf(rafId);
    }
    function animate() {
      scroller.scrollLeft += (to - from) / frames;
      if (++count < frames) {
        rafId = raf(animate);
      }
    }
    animate();
    return cancel;
  }
  function scrollTopTo(scroller, to, duration, callback) {
    let rafId;
    let current2 = getScrollTop(scroller);
    const isDown = current2 < to;
    const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
    const step = (to - current2) / frames;
    function cancel() {
      cancelRaf(rafId);
    }
    function animate() {
      current2 += step;
      if (isDown && current2 > to || !isDown && current2 < to) {
        current2 = to;
      }
      setScrollTop(scroller, current2);
      if (isDown && current2 < to || !isDown && current2 > to) {
        rafId = raf(animate);
      } else if (callback) {
        rafId = raf(callback);
      }
    }
    animate();
    return cancel;
  }
  let current = 0;
  function useId() {
    const vm = vue.getCurrentInstance();
    const { name: name2 = "unknown" } = (vm == null ? void 0 : vm.type) || {};
    return `${name2}-${++current}`;
  }
  function useRefs() {
    const refs = vue.ref([]);
    const cache = [];
    vue.onBeforeUpdate(() => {
      refs.value = [];
    });
    const setRefs = (index) => {
      if (!cache[index]) {
        cache[index] = (el) => {
          refs.value[index] = el;
        };
      }
      return cache[index];
    };
    return [refs, setRefs];
  }
  function useVisibilityChange(target, onChange) {
    if (!inBrowser$1 || !window.IntersectionObserver) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        onChange(entries[0].intersectionRatio > 0);
      },
      { root: document.body }
    );
    const observe = () => {
      if (target.value) {
        observer.observe(target.value);
      }
    };
    const unobserve = () => {
      if (target.value) {
        observer.unobserve(target.value);
      }
    };
    vue.onDeactivated(unobserve);
    vue.onBeforeUnmount(unobserve);
    onMountedOrActivated(observe);
  }
  const [name$f, bem$f] = createNamespace("sticky");
  const stickyProps = {
    zIndex: numericProp,
    position: makeStringProp("top"),
    container: Object,
    offsetTop: makeNumericProp(0),
    offsetBottom: makeNumericProp(0)
  };
  var stdin_default$f = vue.defineComponent({
    name: name$f,
    props: stickyProps,
    emits: ["scroll", "change"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const scrollParent = useScrollParent(root);
      const state = vue.reactive({
        fixed: false,
        width: 0,
        // root width
        height: 0,
        // root height
        transform: 0
      });
      const isReset = vue.ref(false);
      const offset = vue.computed(() => unitToPx(props.position === "top" ? props.offsetTop : props.offsetBottom));
      const rootStyle = vue.computed(() => {
        if (isReset.value) {
          return;
        }
        const {
          fixed,
          height: height2,
          width: width2
        } = state;
        if (fixed) {
          return {
            width: `${width2}px`,
            height: `${height2}px`
          };
        }
      });
      const stickyStyle = vue.computed(() => {
        if (!state.fixed || isReset.value) {
          return;
        }
        const style = extend(getZIndexStyle(props.zIndex), {
          width: `${state.width}px`,
          height: `${state.height}px`,
          [props.position]: `${offset.value}px`
        });
        if (state.transform) {
          style.transform = `translate3d(0, ${state.transform}px, 0)`;
        }
        return style;
      });
      const emitScroll = (scrollTop) => emit("scroll", {
        scrollTop,
        isFixed: state.fixed
      });
      const onScroll = () => {
        if (!root.value || isHidden(root)) {
          return;
        }
        const {
          container,
          position
        } = props;
        const rootRect = useRect(root);
        const scrollTop = getScrollTop(window);
        state.width = rootRect.width;
        state.height = rootRect.height;
        if (position === "top") {
          if (container) {
            const containerRect = useRect(container);
            const difference = containerRect.bottom - offset.value - state.height;
            state.fixed = offset.value > rootRect.top && containerRect.bottom > 0;
            state.transform = difference < 0 ? difference : 0;
          } else {
            state.fixed = offset.value > rootRect.top;
          }
        } else {
          const {
            clientHeight
          } = document.documentElement;
          if (container) {
            const containerRect = useRect(container);
            const difference = clientHeight - containerRect.top - offset.value - state.height;
            state.fixed = clientHeight - offset.value < rootRect.bottom && clientHeight > containerRect.top;
            state.transform = difference < 0 ? -difference : 0;
          } else {
            state.fixed = clientHeight - offset.value < rootRect.bottom;
          }
        }
        emitScroll(scrollTop);
      };
      vue.watch(() => state.fixed, (value) => emit("change", value));
      useEventListener$1("scroll", onScroll, {
        target: scrollParent,
        passive: true
      });
      useVisibilityChange(root, onScroll);
      vue.watch([windowWidth, windowHeight], () => {
        if (!root.value || isHidden(root) || !state.fixed) {
          return;
        }
        isReset.value = true;
        vue.nextTick(() => {
          const rootRect = useRect(root);
          state.width = rootRect.width;
          state.height = rootRect.height;
          isReset.value = false;
        });
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "ref": root,
          "style": rootStyle.value
        }, [vue.createVNode("div", {
          "class": bem$f({
            fixed: state.fixed && !isReset.value
          }),
          "style": stickyStyle.value
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
      };
    }
  });
  const Sticky = withInstall(stdin_default$f);
  const [name$e, bem$e] = createNamespace("swipe");
  const swipeProps = {
    loop: truthProp,
    width: numericProp,
    height: numericProp,
    vertical: Boolean,
    autoplay: makeNumericProp(0),
    duration: makeNumericProp(500),
    touchable: truthProp,
    lazyRender: Boolean,
    initialSwipe: makeNumericProp(0),
    indicatorColor: String,
    showIndicators: truthProp,
    stopPropagation: truthProp
  };
  const SWIPE_KEY = Symbol(name$e);
  var stdin_default$e = vue.defineComponent({
    name: name$e,
    props: swipeProps,
    emits: ["change", "dragStart", "dragEnd"],
    setup(props, {
      emit,
      slots
    }) {
      const root = vue.ref();
      const track = vue.ref();
      const state = vue.reactive({
        rect: null,
        width: 0,
        height: 0,
        offset: 0,
        active: 0,
        swiping: false
      });
      let dragging = false;
      const touch = useTouch();
      const {
        children,
        linkChildren
      } = useChildren(SWIPE_KEY);
      const count = vue.computed(() => children.length);
      const size = vue.computed(() => state[props.vertical ? "height" : "width"]);
      const delta = vue.computed(() => props.vertical ? touch.deltaY.value : touch.deltaX.value);
      const minOffset = vue.computed(() => {
        if (state.rect) {
          const base = props.vertical ? state.rect.height : state.rect.width;
          return base - size.value * count.value;
        }
        return 0;
      });
      const maxCount = vue.computed(() => size.value ? Math.ceil(Math.abs(minOffset.value) / size.value) : count.value);
      const trackSize = vue.computed(() => count.value * size.value);
      const activeIndicator = vue.computed(() => (state.active + count.value) % count.value);
      const isCorrectDirection = vue.computed(() => {
        const expect = props.vertical ? "vertical" : "horizontal";
        return touch.direction.value === expect;
      });
      const trackStyle = vue.computed(() => {
        const style = {
          transitionDuration: `${state.swiping ? 0 : props.duration}ms`,
          transform: `translate${props.vertical ? "Y" : "X"}(${+state.offset.toFixed(2)}px)`
        };
        if (size.value) {
          const mainAxis = props.vertical ? "height" : "width";
          const crossAxis = props.vertical ? "width" : "height";
          style[mainAxis] = `${trackSize.value}px`;
          style[crossAxis] = props[crossAxis] ? `${props[crossAxis]}px` : "";
        }
        return style;
      });
      const getTargetActive = (pace) => {
        const {
          active
        } = state;
        if (pace) {
          if (props.loop) {
            return clamp(active + pace, -1, count.value);
          }
          return clamp(active + pace, 0, maxCount.value);
        }
        return active;
      };
      const getTargetOffset = (targetActive, offset = 0) => {
        let currentPosition = targetActive * size.value;
        if (!props.loop) {
          currentPosition = Math.min(currentPosition, -minOffset.value);
        }
        let targetOffset = offset - currentPosition;
        if (!props.loop) {
          targetOffset = clamp(targetOffset, minOffset.value, 0);
        }
        return targetOffset;
      };
      const move = ({
        pace = 0,
        offset = 0,
        emitChange
      }) => {
        if (count.value <= 1) {
          return;
        }
        const {
          active
        } = state;
        const targetActive = getTargetActive(pace);
        const targetOffset = getTargetOffset(targetActive, offset);
        if (props.loop) {
          if (children[0] && targetOffset !== minOffset.value) {
            const outRightBound = targetOffset < minOffset.value;
            children[0].setOffset(outRightBound ? trackSize.value : 0);
          }
          if (children[count.value - 1] && targetOffset !== 0) {
            const outLeftBound = targetOffset > 0;
            children[count.value - 1].setOffset(outLeftBound ? -trackSize.value : 0);
          }
        }
        state.active = targetActive;
        state.offset = targetOffset;
        if (emitChange && targetActive !== active) {
          emit("change", activeIndicator.value);
        }
      };
      const correctPosition = () => {
        state.swiping = true;
        if (state.active <= -1) {
          move({
            pace: count.value
          });
        } else if (state.active >= count.value) {
          move({
            pace: -count.value
          });
        }
      };
      const prev = () => {
        correctPosition();
        touch.reset();
        doubleRaf(() => {
          state.swiping = false;
          move({
            pace: -1,
            emitChange: true
          });
        });
      };
      const next = () => {
        correctPosition();
        touch.reset();
        doubleRaf(() => {
          state.swiping = false;
          move({
            pace: 1,
            emitChange: true
          });
        });
      };
      let autoplayTimer;
      const stopAutoplay = () => clearTimeout(autoplayTimer);
      const autoplay = () => {
        stopAutoplay();
        if (+props.autoplay > 0 && count.value > 1) {
          autoplayTimer = setTimeout(() => {
            next();
            autoplay();
          }, +props.autoplay);
        }
      };
      const initialize = (active = +props.initialSwipe) => {
        if (!root.value) {
          return;
        }
        const cb = () => {
          var _a, _b;
          if (!isHidden(root)) {
            const rect = {
              width: root.value.offsetWidth,
              height: root.value.offsetHeight
            };
            state.rect = rect;
            state.width = +((_a = props.width) != null ? _a : rect.width);
            state.height = +((_b = props.height) != null ? _b : rect.height);
          }
          if (count.value) {
            active = Math.min(count.value - 1, active);
            if (active === -1) {
              active = count.value - 1;
            }
          }
          state.active = active;
          state.swiping = true;
          state.offset = getTargetOffset(active);
          children.forEach((swipe) => {
            swipe.setOffset(0);
          });
          autoplay();
        };
        if (isHidden(root)) {
          vue.nextTick().then(cb);
        } else {
          cb();
        }
      };
      const resize = () => initialize(state.active);
      let touchStartTime;
      const onTouchStart = (event) => {
        if (!props.touchable || // avoid resetting position on multi-finger touch
        event.touches.length > 1)
          return;
        touch.start(event);
        dragging = false;
        touchStartTime = Date.now();
        stopAutoplay();
        correctPosition();
      };
      const onTouchMove = (event) => {
        if (props.touchable && state.swiping) {
          touch.move(event);
          if (isCorrectDirection.value) {
            const isEdgeTouch = !props.loop && (state.active === 0 && delta.value > 0 || state.active === count.value - 1 && delta.value < 0);
            if (!isEdgeTouch) {
              preventDefault(event, props.stopPropagation);
              move({
                offset: delta.value
              });
              if (!dragging) {
                emit("dragStart", {
                  index: activeIndicator.value
                });
                dragging = true;
              }
            }
          }
        }
      };
      const onTouchEnd = () => {
        if (!props.touchable || !state.swiping) {
          return;
        }
        const duration = Date.now() - touchStartTime;
        const speed = delta.value / duration;
        const shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(delta.value) > size.value / 2;
        if (shouldSwipe && isCorrectDirection.value) {
          const offset = props.vertical ? touch.offsetY.value : touch.offsetX.value;
          let pace = 0;
          if (props.loop) {
            pace = offset > 0 ? delta.value > 0 ? -1 : 1 : 0;
          } else {
            pace = -Math[delta.value > 0 ? "ceil" : "floor"](delta.value / size.value);
          }
          move({
            pace,
            emitChange: true
          });
        } else if (delta.value) {
          move({
            pace: 0
          });
        }
        dragging = false;
        state.swiping = false;
        emit("dragEnd", {
          index: activeIndicator.value
        });
        autoplay();
      };
      const swipeTo = (index, options = {}) => {
        correctPosition();
        touch.reset();
        doubleRaf(() => {
          let targetIndex;
          if (props.loop && index === count.value) {
            targetIndex = state.active === 0 ? 0 : index;
          } else {
            targetIndex = index % count.value;
          }
          if (options.immediate) {
            doubleRaf(() => {
              state.swiping = false;
            });
          } else {
            state.swiping = false;
          }
          move({
            pace: targetIndex - state.active,
            emitChange: true
          });
        });
      };
      const renderDot = (_, index) => {
        const active = index === activeIndicator.value;
        const style = active ? {
          backgroundColor: props.indicatorColor
        } : void 0;
        return vue.createVNode("i", {
          "style": style,
          "class": bem$e("indicator", {
            active
          })
        }, null);
      };
      const renderIndicator = () => {
        if (slots.indicator) {
          return slots.indicator({
            active: activeIndicator.value,
            total: count.value
          });
        }
        if (props.showIndicators && count.value > 1) {
          return vue.createVNode("div", {
            "class": bem$e("indicators", {
              vertical: props.vertical
            })
          }, [Array(count.value).fill("").map(renderDot)]);
        }
      };
      useExpose({
        prev,
        next,
        state,
        resize,
        swipeTo
      });
      linkChildren({
        size,
        props,
        count,
        activeIndicator
      });
      vue.watch(() => props.initialSwipe, (value) => initialize(+value));
      vue.watch(count, () => initialize(state.active));
      vue.watch(() => props.autoplay, autoplay);
      vue.watch([windowWidth, windowHeight, () => props.width, () => props.height], resize);
      vue.watch(usePageVisibility(), (visible) => {
        if (visible === "visible") {
          autoplay();
        } else {
          stopAutoplay();
        }
      });
      vue.onMounted(initialize);
      vue.onActivated(() => initialize(state.active));
      onPopupReopen(() => initialize(state.active));
      vue.onDeactivated(stopAutoplay);
      vue.onBeforeUnmount(stopAutoplay);
      useEventListener$1("touchmove", onTouchMove, {
        target: track
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "ref": root,
          "class": bem$e()
        }, [vue.createVNode("div", {
          "ref": track,
          "style": trackStyle.value,
          "class": bem$e("track", {
            vertical: props.vertical
          }),
          "onTouchstartPassive": onTouchStart,
          "onTouchend": onTouchEnd,
          "onTouchcancel": onTouchEnd
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), renderIndicator()]);
      };
    }
  });
  const Swipe = withInstall(stdin_default$e);
  const [name$d, bem$d] = createNamespace("tabs");
  var stdin_default$d = vue.defineComponent({
    name: name$d,
    props: {
      count: makeRequiredProp(Number),
      inited: Boolean,
      animated: Boolean,
      duration: makeRequiredProp(numericProp),
      swipeable: Boolean,
      lazyRender: Boolean,
      currentIndex: makeRequiredProp(Number)
    },
    emits: ["change"],
    setup(props, {
      emit,
      slots
    }) {
      const swipeRef = vue.ref();
      const onChange = (index) => emit("change", index);
      const renderChildren = () => {
        var _a;
        const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
        if (props.animated || props.swipeable) {
          return vue.createVNode(Swipe, {
            "ref": swipeRef,
            "loop": false,
            "class": bem$d("track"),
            "duration": +props.duration * 1e3,
            "touchable": props.swipeable,
            "lazyRender": props.lazyRender,
            "showIndicators": false,
            "onChange": onChange
          }, {
            default: () => [Content]
          });
        }
        return Content;
      };
      const swipeToCurrentTab = (index) => {
        const swipe = swipeRef.value;
        if (swipe && swipe.state.active !== index) {
          swipe.swipeTo(index, {
            immediate: !props.inited
          });
        }
      };
      vue.watch(() => props.currentIndex, swipeToCurrentTab);
      vue.onMounted(() => {
        swipeToCurrentTab(props.currentIndex);
      });
      useExpose({
        swipeRef
      });
      return () => vue.createVNode("div", {
        "class": bem$d("content", {
          animated: props.animated || props.swipeable
        })
      }, [renderChildren()]);
    }
  });
  const [name$c, bem$c] = createNamespace("tabs");
  const tabsProps = {
    type: makeStringProp("line"),
    color: String,
    border: Boolean,
    sticky: Boolean,
    shrink: Boolean,
    active: makeNumericProp(0),
    duration: makeNumericProp(0.3),
    animated: Boolean,
    ellipsis: truthProp,
    swipeable: Boolean,
    scrollspy: Boolean,
    offsetTop: makeNumericProp(0),
    background: String,
    lazyRender: truthProp,
    showHeader: truthProp,
    lineWidth: numericProp,
    lineHeight: numericProp,
    beforeChange: Function,
    swipeThreshold: makeNumericProp(5),
    titleActiveColor: String,
    titleInactiveColor: String
  };
  const TABS_KEY = Symbol(name$c);
  var stdin_default$c = vue.defineComponent({
    name: name$c,
    props: tabsProps,
    emits: ["change", "scroll", "rendered", "clickTab", "update:active"],
    setup(props, {
      emit,
      slots
    }) {
      let tabHeight;
      let lockScroll;
      let stickyFixed;
      let cancelScrollLeftToRaf;
      let cancelScrollTopToRaf;
      const root = vue.ref();
      const navRef = vue.ref();
      const wrapRef = vue.ref();
      const contentRef = vue.ref();
      const id = useId();
      const scroller = useScrollParent(root);
      const [titleRefs, setTitleRefs] = useRefs();
      const {
        children,
        linkChildren
      } = useChildren(TABS_KEY);
      const state = vue.reactive({
        inited: false,
        position: "",
        lineStyle: {},
        currentIndex: -1
      });
      const scrollable = vue.computed(() => children.length > +props.swipeThreshold || !props.ellipsis || props.shrink);
      const navStyle = vue.computed(() => ({
        borderColor: props.color,
        background: props.background
      }));
      const getTabName = (tab, index) => {
        var _a;
        return (_a = tab.name) != null ? _a : index;
      };
      const currentName = vue.computed(() => {
        const activeTab = children[state.currentIndex];
        if (activeTab) {
          return getTabName(activeTab, state.currentIndex);
        }
      });
      const offsetTopPx = vue.computed(() => unitToPx(props.offsetTop));
      const scrollOffset = vue.computed(() => {
        if (props.sticky) {
          return offsetTopPx.value + tabHeight;
        }
        return 0;
      });
      const scrollIntoView = (immediate) => {
        const nav = navRef.value;
        const titles = titleRefs.value;
        if (!scrollable.value || !nav || !titles || !titles[state.currentIndex]) {
          return;
        }
        const title = titles[state.currentIndex].$el;
        const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
        if (cancelScrollLeftToRaf)
          cancelScrollLeftToRaf();
        cancelScrollLeftToRaf = scrollLeftTo(nav, to, immediate ? 0 : +props.duration);
      };
      const setLine = () => {
        const shouldAnimate = state.inited;
        vue.nextTick(() => {
          const titles = titleRefs.value;
          if (!titles || !titles[state.currentIndex] || props.type !== "line" || isHidden(root.value)) {
            return;
          }
          const title = titles[state.currentIndex].$el;
          const {
            lineWidth,
            lineHeight
          } = props;
          const left = title.offsetLeft + title.offsetWidth / 2;
          const lineStyle = {
            width: addUnit(lineWidth),
            backgroundColor: props.color,
            transform: `translateX(${left}px) translateX(-50%)`
          };
          if (shouldAnimate) {
            lineStyle.transitionDuration = `${props.duration}s`;
          }
          if (isDef(lineHeight)) {
            const height2 = addUnit(lineHeight);
            lineStyle.height = height2;
            lineStyle.borderRadius = height2;
          }
          state.lineStyle = lineStyle;
        });
      };
      const findAvailableTab = (index) => {
        const diff = index < state.currentIndex ? -1 : 1;
        while (index >= 0 && index < children.length) {
          if (!children[index].disabled) {
            return index;
          }
          index += diff;
        }
      };
      const setCurrentIndex = (currentIndex, skipScrollIntoView) => {
        const newIndex = findAvailableTab(currentIndex);
        if (!isDef(newIndex)) {
          return;
        }
        const newTab = children[newIndex];
        const newName = getTabName(newTab, newIndex);
        const shouldEmitChange = state.currentIndex !== null;
        if (state.currentIndex !== newIndex) {
          state.currentIndex = newIndex;
          if (!skipScrollIntoView) {
            scrollIntoView();
          }
          setLine();
        }
        if (newName !== props.active) {
          emit("update:active", newName);
          if (shouldEmitChange) {
            emit("change", newName, newTab.title);
          }
        }
        if (stickyFixed && !props.scrollspy) {
          setRootScrollTop(Math.ceil(getElementTop(root.value) - offsetTopPx.value));
        }
      };
      const setCurrentIndexByName = (name2, skipScrollIntoView) => {
        const matched = children.find((tab, index2) => getTabName(tab, index2) === name2);
        const index = matched ? children.indexOf(matched) : 0;
        setCurrentIndex(index, skipScrollIntoView);
      };
      const scrollToCurrentContent = (immediate = false) => {
        if (props.scrollspy) {
          const target = children[state.currentIndex].$el;
          if (target && scroller.value) {
            const to = getElementTop(target, scroller.value) - scrollOffset.value;
            lockScroll = true;
            if (cancelScrollTopToRaf)
              cancelScrollTopToRaf();
            cancelScrollTopToRaf = scrollTopTo(scroller.value, to, immediate ? 0 : +props.duration, () => {
              lockScroll = false;
            });
          }
        }
      };
      const onClickTab = (item, index, event) => {
        const {
          title,
          disabled
        } = children[index];
        const name2 = getTabName(children[index], index);
        if (!disabled) {
          callInterceptor(props.beforeChange, {
            args: [name2],
            done: () => {
              setCurrentIndex(index);
              scrollToCurrentContent();
            }
          });
          route(item);
        }
        emit("clickTab", {
          name: name2,
          title,
          event,
          disabled
        });
      };
      const onStickyScroll = (params) => {
        stickyFixed = params.isFixed;
        emit("scroll", params);
      };
      const scrollTo = (name2) => {
        vue.nextTick(() => {
          setCurrentIndexByName(name2);
          scrollToCurrentContent(true);
        });
      };
      const getCurrentIndexOnScroll = () => {
        for (let index = 0; index < children.length; index++) {
          const {
            top
          } = useRect(children[index].$el);
          if (top > scrollOffset.value) {
            return index === 0 ? 0 : index - 1;
          }
        }
        return children.length - 1;
      };
      const onScroll = () => {
        if (props.scrollspy && !lockScroll) {
          const index = getCurrentIndexOnScroll();
          setCurrentIndex(index);
        }
      };
      const renderLine = () => {
        if (props.type === "line" && children.length) {
          return vue.createVNode("div", {
            "class": bem$c("line"),
            "style": state.lineStyle
          }, null);
        }
      };
      const renderHeader = () => {
        var _a, _b, _c;
        const {
          type,
          border,
          sticky
        } = props;
        const Header = [vue.createVNode("div", {
          "ref": sticky ? void 0 : wrapRef,
          "class": [bem$c("wrap"), {
            [BORDER_TOP_BOTTOM]: type === "line" && border
          }]
        }, [vue.createVNode("div", {
          "ref": navRef,
          "role": "tablist",
          "class": bem$c("nav", [type, {
            shrink: props.shrink,
            complete: scrollable.value
          }]),
          "style": navStyle.value,
          "aria-orientation": "horizontal"
        }, [(_a = slots["nav-left"]) == null ? void 0 : _a.call(slots), children.map((item) => item.renderTitle(onClickTab)), renderLine(), (_b = slots["nav-right"]) == null ? void 0 : _b.call(slots)])]), (_c = slots["nav-bottom"]) == null ? void 0 : _c.call(slots)];
        if (sticky) {
          return vue.createVNode("div", {
            "ref": wrapRef
          }, [Header]);
        }
        return Header;
      };
      const resize = () => {
        setLine();
        vue.nextTick(() => {
          var _a, _b;
          scrollIntoView(true);
          (_b = (_a = contentRef.value) == null ? void 0 : _a.swipeRef.value) == null ? void 0 : _b.resize();
        });
      };
      vue.watch(() => [props.color, props.duration, props.lineWidth, props.lineHeight], setLine);
      vue.watch(windowWidth, resize);
      vue.watch(() => props.active, (value) => {
        if (value !== currentName.value) {
          setCurrentIndexByName(value);
        }
      });
      vue.watch(() => children.length, () => {
        if (state.inited) {
          setCurrentIndexByName(props.active);
          setLine();
          vue.nextTick(() => {
            scrollIntoView(true);
          });
        }
      });
      const init = () => {
        setCurrentIndexByName(props.active, true);
        vue.nextTick(() => {
          state.inited = true;
          if (wrapRef.value) {
            tabHeight = useRect(wrapRef.value).height;
          }
          scrollIntoView(true);
        });
      };
      const onRendered = (name2, title) => emit("rendered", name2, title);
      useExpose({
        resize,
        scrollTo
      });
      vue.onActivated(setLine);
      onPopupReopen(setLine);
      onMountedOrActivated(init);
      useVisibilityChange(root, setLine);
      useEventListener$1("scroll", onScroll, {
        target: scroller,
        passive: true
      });
      linkChildren({
        id,
        props,
        setLine,
        scrollable,
        onRendered,
        currentName,
        setTitleRefs,
        scrollIntoView
      });
      return () => vue.createVNode("div", {
        "ref": root,
        "class": bem$c([props.type])
      }, [props.showHeader ? props.sticky ? vue.createVNode(Sticky, {
        "container": root.value,
        "offsetTop": offsetTopPx.value,
        "onScroll": onStickyScroll
      }, {
        default: () => [renderHeader()]
      }) : renderHeader() : null, vue.createVNode(stdin_default$d, {
        "ref": contentRef,
        "count": children.length,
        "inited": state.inited,
        "animated": props.animated,
        "duration": props.duration,
        "swipeable": props.swipeable,
        "lazyRender": props.lazyRender,
        "currentIndex": state.currentIndex,
        "onChange": setCurrentIndex
      }, {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      })]);
    }
  });
  const TAB_STATUS_KEY = Symbol();
  const [name$b, bem$b] = createNamespace("tab");
  const TabTitle = vue.defineComponent({
    name: name$b,
    props: {
      id: String,
      dot: Boolean,
      type: String,
      color: String,
      title: String,
      badge: numericProp,
      shrink: Boolean,
      isActive: Boolean,
      disabled: Boolean,
      controls: String,
      scrollable: Boolean,
      activeColor: String,
      inactiveColor: String,
      showZeroBadge: truthProp
    },
    setup(props, {
      slots
    }) {
      const style = vue.computed(() => {
        const style2 = {};
        const {
          type,
          color,
          disabled,
          isActive,
          activeColor,
          inactiveColor
        } = props;
        const isCard = type === "card";
        if (color && isCard) {
          style2.borderColor = color;
          if (!disabled) {
            if (isActive) {
              style2.backgroundColor = color;
            } else {
              style2.color = color;
            }
          }
        }
        const titleColor = isActive ? activeColor : inactiveColor;
        if (titleColor) {
          style2.color = titleColor;
        }
        return style2;
      });
      const renderText = () => {
        const Text = vue.createVNode("span", {
          "class": bem$b("text", {
            ellipsis: !props.scrollable
          })
        }, [slots.title ? slots.title() : props.title]);
        if (props.dot || isDef(props.badge) && props.badge !== "") {
          return vue.createVNode(Badge, {
            "dot": props.dot,
            "content": props.badge,
            "showZero": props.showZeroBadge
          }, {
            default: () => [Text]
          });
        }
        return Text;
      };
      return () => vue.createVNode("div", {
        "id": props.id,
        "role": "tab",
        "class": [bem$b([props.type, {
          grow: props.scrollable && !props.shrink,
          shrink: props.shrink,
          active: props.isActive,
          disabled: props.disabled
        }])],
        "style": style.value,
        "tabindex": props.disabled ? void 0 : props.isActive ? 0 : -1,
        "aria-selected": props.isActive,
        "aria-disabled": props.disabled || void 0,
        "aria-controls": props.controls
      }, [renderText()]);
    }
  });
  const [name$a, bem$a] = createNamespace("swipe-item");
  var stdin_default$b = vue.defineComponent({
    name: name$a,
    setup(props, {
      slots
    }) {
      let rendered;
      const state = vue.reactive({
        offset: 0,
        inited: false,
        mounted: false
      });
      const {
        parent,
        index
      } = useParent(SWIPE_KEY);
      if (!parent) {
        return;
      }
      const style = vue.computed(() => {
        const style2 = {};
        const {
          vertical
        } = parent.props;
        if (parent.size.value) {
          style2[vertical ? "height" : "width"] = `${parent.size.value}px`;
        }
        if (state.offset) {
          style2.transform = `translate${vertical ? "Y" : "X"}(${state.offset}px)`;
        }
        return style2;
      });
      const shouldRender = vue.computed(() => {
        const {
          loop,
          lazyRender
        } = parent.props;
        if (!lazyRender || rendered) {
          return true;
        }
        if (!state.mounted) {
          return false;
        }
        const active = parent.activeIndicator.value;
        const maxActive = parent.count.value - 1;
        const prevActive = active === 0 && loop ? maxActive : active - 1;
        const nextActive = active === maxActive && loop ? 0 : active + 1;
        rendered = index.value === active || index.value === prevActive || index.value === nextActive;
        return rendered;
      });
      const setOffset = (offset) => {
        state.offset = offset;
      };
      vue.onMounted(() => {
        vue.nextTick(() => {
          state.mounted = true;
        });
      });
      useExpose({
        setOffset
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$a(),
          "style": style.value
        }, [shouldRender.value ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null]);
      };
    }
  });
  const SwipeItem = withInstall(stdin_default$b);
  const [name$9, bem$9] = createNamespace("tab");
  const tabProps = extend({}, routeProps, {
    dot: Boolean,
    name: numericProp,
    badge: numericProp,
    title: String,
    disabled: Boolean,
    titleClass: unknownProp,
    titleStyle: [String, Object],
    showZeroBadge: truthProp
  });
  var stdin_default$a = vue.defineComponent({
    name: name$9,
    props: tabProps,
    setup(props, {
      slots
    }) {
      const id = useId();
      const inited = vue.ref(false);
      const instance = vue.getCurrentInstance();
      const {
        parent,
        index
      } = useParent(TABS_KEY);
      if (!parent) {
        return;
      }
      const getName = () => {
        var _a;
        return (_a = props.name) != null ? _a : index.value;
      };
      const init = () => {
        inited.value = true;
        if (parent.props.lazyRender) {
          vue.nextTick(() => {
            parent.onRendered(getName(), props.title);
          });
        }
      };
      const active = vue.computed(() => {
        const isActive = getName() === parent.currentName.value;
        if (isActive && !inited.value) {
          init();
        }
        return isActive;
      });
      const parsedClass = vue.ref("");
      const parsedStyle = vue.ref("");
      vue.watchEffect(() => {
        const {
          titleClass,
          titleStyle
        } = props;
        parsedClass.value = titleClass ? normalizeClass(titleClass) : "";
        parsedStyle.value = titleStyle && typeof titleStyle !== "string" ? stringifyStyle(normalizeStyle(titleStyle)) : titleStyle;
      });
      const renderTitle = (onClickTab) => vue.createVNode(TabTitle, vue.mergeProps({
        "key": id,
        "id": `${parent.id}-${index.value}`,
        "ref": parent.setTitleRefs(index.value),
        "style": parsedStyle.value,
        "class": parsedClass.value,
        "isActive": active.value,
        "controls": id,
        "scrollable": parent.scrollable.value,
        "activeColor": parent.props.titleActiveColor,
        "inactiveColor": parent.props.titleInactiveColor,
        "onClick": (event) => onClickTab(instance.proxy, index.value, event)
      }, pick(parent.props, ["type", "color", "shrink"]), pick(props, ["dot", "badge", "title", "disabled", "showZeroBadge"])), {
        title: slots.title
      });
      const hasInactiveClass = vue.ref(!active.value);
      vue.watch(active, (val) => {
        if (val) {
          hasInactiveClass.value = false;
        } else {
          doubleRaf(() => {
            hasInactiveClass.value = true;
          });
        }
      });
      vue.watch(() => props.title, () => {
        parent.setLine();
        parent.scrollIntoView();
      });
      vue.provide(TAB_STATUS_KEY, active);
      useExpose({
        id,
        renderTitle
      });
      return () => {
        var _a;
        const label = `${parent.id}-${index.value}`;
        const {
          animated,
          swipeable,
          scrollspy,
          lazyRender
        } = parent.props;
        if (!slots.default && !animated) {
          return;
        }
        const show = scrollspy || active.value;
        if (animated || swipeable) {
          return vue.createVNode(SwipeItem, {
            "id": id,
            "role": "tabpanel",
            "class": bem$9("panel-wrapper", {
              inactive: hasInactiveClass.value
            }),
            "tabindex": active.value ? 0 : -1,
            "aria-hidden": !active.value,
            "aria-labelledby": label
          }, {
            default: () => {
              var _a2;
              return [vue.createVNode("div", {
                "class": bem$9("panel")
              }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)])];
            }
          });
        }
        const shouldRender = inited.value || scrollspy || !lazyRender;
        const Content = shouldRender ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null;
        return vue.withDirectives(vue.createVNode("div", {
          "id": id,
          "role": "tabpanel",
          "class": bem$9("panel"),
          "tabindex": show ? 0 : -1,
          "aria-labelledby": label
        }, [Content]), [[vue.vShow, show]]);
      };
    }
  });
  const Tab = withInstall(stdin_default$a);
  const Tabs = withInstall(stdin_default$c);
  const [name$8, bem$8] = createNamespace("cell");
  const cellSharedProps = {
    tag: makeStringProp("div"),
    icon: String,
    size: String,
    title: numericProp,
    value: numericProp,
    label: numericProp,
    center: Boolean,
    isLink: Boolean,
    border: truthProp,
    iconPrefix: String,
    valueClass: unknownProp,
    labelClass: unknownProp,
    titleClass: unknownProp,
    titleStyle: null,
    arrowDirection: String,
    required: {
      type: [Boolean, String],
      default: null
    },
    clickable: {
      type: Boolean,
      default: null
    }
  };
  const cellProps = extend({}, cellSharedProps, routeProps);
  var stdin_default$9 = vue.defineComponent({
    name: name$8,
    props: cellProps,
    setup(props, {
      slots
    }) {
      const route2 = useRoute();
      const renderLabel = () => {
        const showLabel = slots.label || isDef(props.label);
        if (showLabel) {
          return vue.createVNode("div", {
            "class": [bem$8("label"), props.labelClass]
          }, [slots.label ? slots.label() : props.label]);
        }
      };
      const renderTitle = () => {
        var _a;
        if (slots.title || isDef(props.title)) {
          const titleSlot = (_a = slots.title) == null ? void 0 : _a.call(slots);
          if (Array.isArray(titleSlot) && titleSlot.length === 0) {
            return;
          }
          return vue.createVNode("div", {
            "class": [bem$8("title"), props.titleClass],
            "style": props.titleStyle
          }, [titleSlot || vue.createVNode("span", null, [props.title]), renderLabel()]);
        }
      };
      const renderValue = () => {
        const slot = slots.value || slots.default;
        const hasValue = slot || isDef(props.value);
        if (hasValue) {
          return vue.createVNode("div", {
            "class": [bem$8("value"), props.valueClass]
          }, [slot ? slot() : vue.createVNode("span", null, [props.value])]);
        }
      };
      const renderLeftIcon = () => {
        if (slots.icon) {
          return slots.icon();
        }
        if (props.icon) {
          return vue.createVNode(Icon, {
            "name": props.icon,
            "class": bem$8("left-icon"),
            "classPrefix": props.iconPrefix
          }, null);
        }
      };
      const renderRightIcon = () => {
        if (slots["right-icon"]) {
          return slots["right-icon"]();
        }
        if (props.isLink) {
          const name2 = props.arrowDirection && props.arrowDirection !== "right" ? `arrow-${props.arrowDirection}` : "arrow";
          return vue.createVNode(Icon, {
            "name": name2,
            "class": bem$8("right-icon")
          }, null);
        }
      };
      return () => {
        var _a;
        const {
          tag,
          size,
          center,
          border,
          isLink,
          required
        } = props;
        const clickable = (_a = props.clickable) != null ? _a : isLink;
        const classes = {
          center,
          required: !!required,
          clickable,
          borderless: !border
        };
        if (size) {
          classes[size] = !!size;
        }
        return vue.createVNode(tag, {
          "class": bem$8(classes),
          "role": clickable ? "button" : void 0,
          "tabindex": clickable ? 0 : void 0,
          "onClick": route2
        }, {
          default: () => {
            var _a2;
            return [renderLeftIcon(), renderTitle(), renderValue(), renderRightIcon(), (_a2 = slots.extra) == null ? void 0 : _a2.call(slots)];
          }
        });
      };
    }
  });
  const Cell = withInstall(stdin_default$9);
  function isEmptyValue(value) {
    if (Array.isArray(value)) {
      return !value.length;
    }
    if (value === 0) {
      return false;
    }
    return !value;
  }
  function runSyncRule(value, rule) {
    if (isEmptyValue(value)) {
      if (rule.required) {
        return false;
      }
      if (rule.validateEmpty === false) {
        return true;
      }
    }
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return false;
    }
    return true;
  }
  function runRuleValidator(value, rule) {
    return new Promise((resolve) => {
      const returnVal = rule.validator(value, rule);
      if (isPromise(returnVal)) {
        returnVal.then(resolve);
        return;
      }
      resolve(returnVal);
    });
  }
  function getRuleMessage(value, rule) {
    const { message } = rule;
    if (isFunction(message)) {
      return message(value, rule);
    }
    return message || "";
  }
  function startComposing({ target }) {
    target.composing = true;
  }
  function endComposing({ target }) {
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  function resizeTextarea(input, autosize) {
    const scrollTop = getRootScrollTop();
    input.style.height = "auto";
    let height2 = input.scrollHeight;
    if (isObject$2(autosize)) {
      const { maxHeight, minHeight } = autosize;
      if (maxHeight !== void 0) {
        height2 = Math.min(height2, maxHeight);
      }
      if (minHeight !== void 0) {
        height2 = Math.max(height2, minHeight);
      }
    }
    if (height2) {
      input.style.height = `${height2}px`;
      setRootScrollTop(scrollTop);
    }
  }
  function mapInputType(type) {
    if (type === "number") {
      return {
        type: "text",
        inputmode: "decimal"
      };
    }
    if (type === "digit") {
      return {
        type: "tel",
        inputmode: "numeric"
      };
    }
    return { type };
  }
  function getStringLength(str) {
    return [...str].length;
  }
  function cutString(str, maxlength) {
    return [...str].slice(0, maxlength).join("");
  }
  const [name$7, bem$7] = createNamespace("field");
  const fieldSharedProps = {
    id: String,
    name: String,
    leftIcon: String,
    rightIcon: String,
    autofocus: Boolean,
    clearable: Boolean,
    maxlength: numericProp,
    formatter: Function,
    clearIcon: makeStringProp("clear"),
    modelValue: makeNumericProp(""),
    inputAlign: String,
    placeholder: String,
    autocomplete: String,
    autocapitalize: String,
    autocorrect: String,
    errorMessage: String,
    enterkeyhint: String,
    clearTrigger: makeStringProp("focus"),
    formatTrigger: makeStringProp("onChange"),
    spellcheck: {
      type: Boolean,
      default: null
    },
    error: {
      type: Boolean,
      default: null
    },
    disabled: {
      type: Boolean,
      default: null
    },
    readonly: {
      type: Boolean,
      default: null
    }
  };
  const fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
    rows: numericProp,
    type: makeStringProp("text"),
    rules: Array,
    autosize: [Boolean, Object],
    labelWidth: numericProp,
    labelClass: unknownProp,
    labelAlign: String,
    showWordLimit: Boolean,
    errorMessageAlign: String,
    colon: {
      type: Boolean,
      default: null
    }
  });
  var stdin_default$8 = vue.defineComponent({
    name: name$7,
    props: fieldProps,
    emits: ["blur", "focus", "clear", "keypress", "clickInput", "endValidate", "startValidate", "clickLeftIcon", "clickRightIcon", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const id = useId();
      const state = vue.reactive({
        status: "unvalidated",
        focused: false,
        validateMessage: ""
      });
      const inputRef = vue.ref();
      const clearIconRef = vue.ref();
      const customValue = vue.ref();
      const {
        parent: form
      } = useParent(FORM_KEY);
      const getModelValue = () => {
        var _a;
        return String((_a = props.modelValue) != null ? _a : "");
      };
      const getProp = (key) => {
        if (isDef(props[key])) {
          return props[key];
        }
        if (form && isDef(form.props[key])) {
          return form.props[key];
        }
      };
      const showClear = vue.computed(() => {
        const readonly2 = getProp("readonly");
        if (props.clearable && !readonly2) {
          const hasValue = getModelValue() !== "";
          const trigger = props.clearTrigger === "always" || props.clearTrigger === "focus" && state.focused;
          return hasValue && trigger;
        }
        return false;
      });
      const formValue = vue.computed(() => {
        if (customValue.value && slots.input) {
          return customValue.value();
        }
        return props.modelValue;
      });
      const showRequiredMark = vue.computed(() => {
        var _a;
        const required = getProp("required");
        if (required === "auto") {
          return (_a = props.rules) == null ? void 0 : _a.some((rule) => rule.required);
        }
        return required;
      });
      const runRules = (rules) => rules.reduce((promise, rule) => promise.then(() => {
        if (state.status === "failed") {
          return;
        }
        let {
          value
        } = formValue;
        if (rule.formatter) {
          value = rule.formatter(value, rule);
        }
        if (!runSyncRule(value, rule)) {
          state.status = "failed";
          state.validateMessage = getRuleMessage(value, rule);
          return;
        }
        if (rule.validator) {
          if (isEmptyValue(value) && rule.validateEmpty === false) {
            return;
          }
          return runRuleValidator(value, rule).then((result) => {
            if (result && typeof result === "string") {
              state.status = "failed";
              state.validateMessage = result;
            } else if (result === false) {
              state.status = "failed";
              state.validateMessage = getRuleMessage(value, rule);
            }
          });
        }
      }), Promise.resolve());
      const resetValidation = () => {
        state.status = "unvalidated";
        state.validateMessage = "";
      };
      const endValidate = () => emit("endValidate", {
        status: state.status,
        message: state.validateMessage
      });
      const validate = (rules = props.rules) => new Promise((resolve) => {
        resetValidation();
        if (rules) {
          emit("startValidate");
          runRules(rules).then(() => {
            if (state.status === "failed") {
              resolve({
                name: props.name,
                message: state.validateMessage
              });
              endValidate();
            } else {
              state.status = "passed";
              resolve();
              endValidate();
            }
          });
        } else {
          resolve();
        }
      });
      const validateWithTrigger = (trigger) => {
        if (form && props.rules) {
          const {
            validateTrigger
          } = form.props;
          const defaultTrigger = toArray(validateTrigger).includes(trigger);
          const rules = props.rules.filter((rule) => {
            if (rule.trigger) {
              return toArray(rule.trigger).includes(trigger);
            }
            return defaultTrigger;
          });
          if (rules.length) {
            validate(rules);
          }
        }
      };
      const limitValueLength = (value) => {
        var _a;
        const {
          maxlength
        } = props;
        if (isDef(maxlength) && getStringLength(value) > +maxlength) {
          const modelValue = getModelValue();
          if (modelValue && getStringLength(modelValue) === +maxlength) {
            return modelValue;
          }
          const selectionEnd = (_a = inputRef.value) == null ? void 0 : _a.selectionEnd;
          if (state.focused && selectionEnd) {
            const valueArr = [...value];
            const exceededLength = valueArr.length - +maxlength;
            valueArr.splice(selectionEnd - exceededLength, exceededLength);
            return valueArr.join("");
          }
          return cutString(value, +maxlength);
        }
        return value;
      };
      const updateValue = (value, trigger = "onChange") => {
        const originalValue = value;
        value = limitValueLength(value);
        const limitDiffLen = getStringLength(originalValue) - getStringLength(value);
        if (props.type === "number" || props.type === "digit") {
          const isNumber = props.type === "number";
          value = formatNumber(value, isNumber, isNumber);
        }
        let formatterDiffLen = 0;
        if (props.formatter && trigger === props.formatTrigger) {
          const {
            formatter,
            maxlength
          } = props;
          value = formatter(value);
          if (isDef(maxlength) && getStringLength(value) > +maxlength) {
            value = cutString(value, +maxlength);
          }
          if (inputRef.value && state.focused) {
            const {
              selectionEnd
            } = inputRef.value;
            const bcoVal = cutString(originalValue, selectionEnd);
            formatterDiffLen = getStringLength(formatter(bcoVal)) - getStringLength(bcoVal);
          }
        }
        if (inputRef.value && inputRef.value.value !== value) {
          if (state.focused) {
            let {
              selectionStart,
              selectionEnd
            } = inputRef.value;
            inputRef.value.value = value;
            if (isDef(selectionStart) && isDef(selectionEnd)) {
              const valueLen = getStringLength(value);
              if (limitDiffLen) {
                selectionStart -= limitDiffLen;
                selectionEnd -= limitDiffLen;
              } else if (formatterDiffLen) {
                selectionStart += formatterDiffLen;
                selectionEnd += formatterDiffLen;
              }
              inputRef.value.setSelectionRange(Math.min(selectionStart, valueLen), Math.min(selectionEnd, valueLen));
            }
          } else {
            inputRef.value.value = value;
          }
        }
        if (value !== props.modelValue) {
          emit("update:modelValue", value);
        }
      };
      const onInput = (event) => {
        if (!event.target.composing) {
          updateValue(event.target.value);
        }
      };
      const blur = () => {
        var _a;
        return (_a = inputRef.value) == null ? void 0 : _a.blur();
      };
      const focus = () => {
        var _a;
        return (_a = inputRef.value) == null ? void 0 : _a.focus();
      };
      const adjustTextareaSize = () => {
        const input = inputRef.value;
        if (props.type === "textarea" && props.autosize && input) {
          resizeTextarea(input, props.autosize);
        }
      };
      const onFocus = (event) => {
        state.focused = true;
        emit("focus", event);
        vue.nextTick(adjustTextareaSize);
        if (getProp("readonly")) {
          blur();
        }
      };
      const onBlur = (event) => {
        state.focused = false;
        updateValue(getModelValue(), "onBlur");
        emit("blur", event);
        if (getProp("readonly")) {
          return;
        }
        validateWithTrigger("onBlur");
        vue.nextTick(adjustTextareaSize);
        resetScroll();
      };
      const onClickInput = (event) => emit("clickInput", event);
      const onClickLeftIcon = (event) => emit("clickLeftIcon", event);
      const onClickRightIcon = (event) => emit("clickRightIcon", event);
      const onClear = (event) => {
        preventDefault(event);
        emit("update:modelValue", "");
        emit("clear", event);
      };
      const showError = vue.computed(() => {
        if (typeof props.error === "boolean") {
          return props.error;
        }
        if (form && form.props.showError && state.status === "failed") {
          return true;
        }
      });
      const labelStyle = vue.computed(() => {
        const labelWidth = getProp("labelWidth");
        const labelAlign = getProp("labelAlign");
        if (labelWidth && labelAlign !== "top") {
          return {
            width: addUnit(labelWidth)
          };
        }
      });
      const onKeypress = (event) => {
        const ENTER_CODE = 13;
        if (event.keyCode === ENTER_CODE) {
          const submitOnEnter = form && form.props.submitOnEnter;
          if (!submitOnEnter && props.type !== "textarea") {
            preventDefault(event);
          }
          if (props.type === "search") {
            blur();
          }
        }
        emit("keypress", event);
      };
      const getInputId = () => props.id || `${id}-input`;
      const getValidationStatus = () => state.status;
      const renderInput = () => {
        const controlClass = bem$7("control", [getProp("inputAlign"), {
          error: showError.value,
          custom: !!slots.input,
          "min-height": props.type === "textarea" && !props.autosize
        }]);
        if (slots.input) {
          return vue.createVNode("div", {
            "class": controlClass,
            "onClick": onClickInput
          }, [slots.input()]);
        }
        const inputAttrs = {
          id: getInputId(),
          ref: inputRef,
          name: props.name,
          rows: props.rows !== void 0 ? +props.rows : void 0,
          class: controlClass,
          disabled: getProp("disabled"),
          readonly: getProp("readonly"),
          autofocus: props.autofocus,
          placeholder: props.placeholder,
          autocomplete: props.autocomplete,
          autocapitalize: props.autocapitalize,
          autocorrect: props.autocorrect,
          enterkeyhint: props.enterkeyhint,
          spellcheck: props.spellcheck,
          "aria-labelledby": props.label ? `${id}-label` : void 0,
          onBlur,
          onFocus,
          onInput,
          onClick: onClickInput,
          onChange: endComposing,
          onKeypress,
          onCompositionend: endComposing,
          onCompositionstart: startComposing
        };
        if (props.type === "textarea") {
          return vue.createVNode("textarea", inputAttrs, null);
        }
        return vue.createVNode("input", vue.mergeProps(mapInputType(props.type), inputAttrs), null);
      };
      const renderLeftIcon = () => {
        const leftIconSlot = slots["left-icon"];
        if (props.leftIcon || leftIconSlot) {
          return vue.createVNode("div", {
            "class": bem$7("left-icon"),
            "onClick": onClickLeftIcon
          }, [leftIconSlot ? leftIconSlot() : vue.createVNode(Icon, {
            "name": props.leftIcon,
            "classPrefix": props.iconPrefix
          }, null)]);
        }
      };
      const renderRightIcon = () => {
        const rightIconSlot = slots["right-icon"];
        if (props.rightIcon || rightIconSlot) {
          return vue.createVNode("div", {
            "class": bem$7("right-icon"),
            "onClick": onClickRightIcon
          }, [rightIconSlot ? rightIconSlot() : vue.createVNode(Icon, {
            "name": props.rightIcon,
            "classPrefix": props.iconPrefix
          }, null)]);
        }
      };
      const renderWordLimit = () => {
        if (props.showWordLimit && props.maxlength) {
          const count = getStringLength(getModelValue());
          return vue.createVNode("div", {
            "class": bem$7("word-limit")
          }, [vue.createVNode("span", {
            "class": bem$7("word-num")
          }, [count]), vue.createTextVNode("/"), props.maxlength]);
        }
      };
      const renderMessage = () => {
        if (form && form.props.showErrorMessage === false) {
          return;
        }
        const message = props.errorMessage || state.validateMessage;
        if (message) {
          const slot = slots["error-message"];
          const errorMessageAlign = getProp("errorMessageAlign");
          return vue.createVNode("div", {
            "class": bem$7("error-message", errorMessageAlign)
          }, [slot ? slot({
            message
          }) : message]);
        }
      };
      const renderLabel = () => {
        const labelWidth = getProp("labelWidth");
        const labelAlign = getProp("labelAlign");
        const colon = getProp("colon") ? ":" : "";
        if (slots.label) {
          return [slots.label(), colon];
        }
        if (props.label) {
          return vue.createVNode("label", {
            "id": `${id}-label`,
            "for": slots.input ? void 0 : getInputId(),
            "onClick": (event) => {
              preventDefault(event);
              focus();
            },
            "style": labelAlign === "top" && labelWidth ? {
              width: addUnit(labelWidth)
            } : void 0
          }, [props.label + colon]);
        }
      };
      const renderFieldBody = () => [vue.createVNode("div", {
        "class": bem$7("body")
      }, [renderInput(), showClear.value && vue.createVNode(Icon, {
        "ref": clearIconRef,
        "name": props.clearIcon,
        "class": bem$7("clear")
      }, null), renderRightIcon(), slots.button && vue.createVNode("div", {
        "class": bem$7("button")
      }, [slots.button()])]), renderWordLimit(), renderMessage()];
      useExpose({
        blur,
        focus,
        validate,
        formValue,
        resetValidation,
        getValidationStatus
      });
      vue.provide(CUSTOM_FIELD_INJECTION_KEY, {
        customValue,
        resetValidation,
        validateWithTrigger
      });
      vue.watch(() => props.modelValue, () => {
        updateValue(getModelValue());
        resetValidation();
        validateWithTrigger("onChange");
        vue.nextTick(adjustTextareaSize);
      });
      vue.onMounted(() => {
        updateValue(getModelValue(), props.formatTrigger);
        vue.nextTick(adjustTextareaSize);
      });
      useEventListener$1("touchstart", onClear, {
        target: vue.computed(() => {
          var _a;
          return (_a = clearIconRef.value) == null ? void 0 : _a.$el;
        })
      });
      return () => {
        const disabled = getProp("disabled");
        const labelAlign = getProp("labelAlign");
        const LeftIcon = renderLeftIcon();
        const renderTitle = () => {
          const Label = renderLabel();
          if (labelAlign === "top") {
            return [LeftIcon, Label].filter(Boolean);
          }
          return Label || [];
        };
        return vue.createVNode(Cell, {
          "size": props.size,
          "class": bem$7({
            error: showError.value,
            disabled,
            [`label-${labelAlign}`]: labelAlign
          }),
          "center": props.center,
          "border": props.border,
          "isLink": props.isLink,
          "clickable": props.clickable,
          "titleStyle": labelStyle.value,
          "valueClass": bem$7("value"),
          "titleClass": [bem$7("label", [labelAlign, {
            required: showRequiredMark.value
          }]), props.labelClass],
          "arrowDirection": props.arrowDirection
        }, {
          icon: LeftIcon && labelAlign !== "top" ? () => LeftIcon : null,
          title: renderTitle,
          value: renderFieldBody,
          extra: slots.extra
        });
      };
    }
  });
  const Field = withInstall(stdin_default$8);
  const [name$6, bem$6] = createNamespace("switch");
  const switchProps = {
    size: numericProp,
    loading: Boolean,
    disabled: Boolean,
    modelValue: unknownProp,
    activeColor: String,
    inactiveColor: String,
    activeValue: {
      type: unknownProp,
      default: true
    },
    inactiveValue: {
      type: unknownProp,
      default: false
    }
  };
  var stdin_default$7 = vue.defineComponent({
    name: name$6,
    props: switchProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const isChecked = () => props.modelValue === props.activeValue;
      const onClick = () => {
        if (!props.disabled && !props.loading) {
          const newValue = isChecked() ? props.inactiveValue : props.activeValue;
          emit("update:modelValue", newValue);
          emit("change", newValue);
        }
      };
      const renderLoading = () => {
        if (props.loading) {
          const color = isChecked() ? props.activeColor : props.inactiveColor;
          return vue.createVNode(Loading, {
            "class": bem$6("loading"),
            "color": color
          }, null);
        }
        if (slots.node) {
          return slots.node();
        }
      };
      useCustomFieldValue(() => props.modelValue);
      return () => {
        var _a;
        const {
          size,
          loading,
          disabled,
          activeColor,
          inactiveColor
        } = props;
        const checked = isChecked();
        const style = {
          fontSize: addUnit(size),
          backgroundColor: checked ? activeColor : inactiveColor
        };
        return vue.createVNode("div", {
          "role": "switch",
          "class": bem$6({
            on: checked,
            loading,
            disabled
          }),
          "style": style,
          "tabindex": disabled ? void 0 : 0,
          "aria-checked": checked,
          "onClick": onClick
        }, [vue.createVNode("div", {
          "class": bem$6("node")
        }, [renderLoading()]), (_a = slots.background) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Switch = withInstall(stdin_default$7);
  const [name$5, bem$5] = createNamespace("radio-group");
  const radioGroupProps = {
    shape: String,
    disabled: Boolean,
    iconSize: numericProp,
    direction: String,
    modelValue: unknownProp,
    checkedColor: String
  };
  const RADIO_KEY = Symbol(name$5);
  var stdin_default$6 = vue.defineComponent({
    name: name$5,
    props: radioGroupProps,
    emits: ["change", "update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        linkChildren
      } = useChildren(RADIO_KEY);
      const updateValue = (value) => emit("update:modelValue", value);
      vue.watch(() => props.modelValue, (value) => emit("change", value));
      linkChildren({
        props,
        updateValue
      });
      useCustomFieldValue(() => props.modelValue);
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$5([props.direction]),
          "role": "radiogroup"
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const RadioGroup = withInstall(stdin_default$6);
  const checkerProps = {
    name: unknownProp,
    disabled: Boolean,
    iconSize: numericProp,
    modelValue: unknownProp,
    checkedColor: String,
    labelPosition: String,
    labelDisabled: Boolean
  };
  var stdin_default$5 = vue.defineComponent({
    props: extend({}, checkerProps, {
      bem: makeRequiredProp(Function),
      role: String,
      shape: String,
      parent: Object,
      checked: Boolean,
      bindGroup: truthProp,
      indeterminate: {
        type: Boolean,
        default: null
      }
    }),
    emits: ["click", "toggle"],
    setup(props, {
      emit,
      slots
    }) {
      const iconRef = vue.ref();
      const getParentProp = (name2) => {
        if (props.parent && props.bindGroup) {
          return props.parent.props[name2];
        }
      };
      const disabled = vue.computed(() => {
        if (props.parent && props.bindGroup) {
          const disabled2 = getParentProp("disabled") || props.disabled;
          if (props.role === "checkbox") {
            const checkedCount = getParentProp("modelValue").length;
            const max = getParentProp("max");
            const overlimit = max && checkedCount >= +max;
            return disabled2 || overlimit && !props.checked;
          }
          return disabled2;
        }
        return props.disabled;
      });
      const direction = vue.computed(() => getParentProp("direction"));
      const iconStyle = vue.computed(() => {
        const checkedColor = props.checkedColor || getParentProp("checkedColor");
        if (checkedColor && props.checked && !disabled.value) {
          return {
            borderColor: checkedColor,
            backgroundColor: checkedColor
          };
        }
      });
      const shape = vue.computed(() => {
        return props.shape || getParentProp("shape") || "round";
      });
      const onClick = (event) => {
        const {
          target
        } = event;
        const icon = iconRef.value;
        const iconClicked = icon === target || (icon == null ? void 0 : icon.contains(target));
        if (!disabled.value && (iconClicked || !props.labelDisabled)) {
          emit("toggle");
        }
        emit("click", event);
      };
      const renderIcon = () => {
        var _a, _b;
        const {
          bem: bem2,
          checked,
          indeterminate
        } = props;
        const iconSize = props.iconSize || getParentProp("iconSize");
        return vue.createVNode("div", {
          "ref": iconRef,
          "class": bem2("icon", [shape.value, {
            disabled: disabled.value,
            checked,
            indeterminate
          }]),
          "style": shape.value !== "dot" ? {
            fontSize: addUnit(iconSize)
          } : {
            width: addUnit(iconSize),
            height: addUnit(iconSize),
            borderColor: (_a = iconStyle.value) == null ? void 0 : _a.borderColor
          }
        }, [slots.icon ? slots.icon({
          checked,
          disabled: disabled.value
        }) : shape.value !== "dot" ? vue.createVNode(Icon, {
          "name": indeterminate ? "minus" : "success",
          "style": iconStyle.value
        }, null) : vue.createVNode("div", {
          "class": bem2("icon--dot__icon"),
          "style": {
            backgroundColor: (_b = iconStyle.value) == null ? void 0 : _b.backgroundColor
          }
        }, null)]);
      };
      const renderLabel = () => {
        const {
          checked
        } = props;
        if (slots.default) {
          return vue.createVNode("span", {
            "class": props.bem("label", [props.labelPosition, {
              disabled: disabled.value
            }])
          }, [slots.default({
            checked,
            disabled: disabled.value
          })]);
        }
      };
      return () => {
        const nodes = props.labelPosition === "left" ? [renderLabel(), renderIcon()] : [renderIcon(), renderLabel()];
        return vue.createVNode("div", {
          "role": props.role,
          "class": props.bem([{
            disabled: disabled.value,
            "label-disabled": props.labelDisabled
          }, direction.value]),
          "tabindex": disabled.value ? void 0 : 0,
          "aria-checked": props.checked,
          "onClick": onClick
        }, [nodes]);
      };
    }
  });
  const radioProps = extend({}, checkerProps, {
    shape: String
  });
  const [name$4, bem$4] = createNamespace("radio");
  var stdin_default$4 = vue.defineComponent({
    name: name$4,
    props: radioProps,
    emits: ["update:modelValue"],
    setup(props, {
      emit,
      slots
    }) {
      const {
        parent
      } = useParent(RADIO_KEY);
      const checked = () => {
        const value = parent ? parent.props.modelValue : props.modelValue;
        return value === props.name;
      };
      const toggle = () => {
        if (parent) {
          parent.updateValue(props.name);
        } else {
          emit("update:modelValue", props.name);
        }
      };
      return () => vue.createVNode(stdin_default$5, vue.mergeProps({
        "bem": bem$4,
        "role": "radio",
        "parent": parent,
        "checked": checked(),
        "onToggle": toggle
      }, props), pick(slots, ["default", "icon"]));
    }
  });
  const Radio = withInstall(stdin_default$4);
  const [name$3, bem$3] = createNamespace("image");
  const imageProps = {
    src: String,
    alt: String,
    fit: String,
    position: String,
    round: Boolean,
    block: Boolean,
    width: numericProp,
    height: numericProp,
    radius: numericProp,
    lazyLoad: Boolean,
    iconSize: numericProp,
    showError: truthProp,
    errorIcon: makeStringProp("photo-fail"),
    iconPrefix: String,
    showLoading: truthProp,
    loadingIcon: makeStringProp("photo")
  };
  var stdin_default$3 = vue.defineComponent({
    name: name$3,
    props: imageProps,
    emits: ["load", "error"],
    setup(props, {
      emit,
      slots
    }) {
      const error = vue.ref(false);
      const loading = vue.ref(true);
      const imageRef = vue.ref();
      const {
        $Lazyload
      } = vue.getCurrentInstance().proxy;
      const style = vue.computed(() => {
        const style2 = {
          width: addUnit(props.width),
          height: addUnit(props.height)
        };
        if (isDef(props.radius)) {
          style2.overflow = "hidden";
          style2.borderRadius = addUnit(props.radius);
        }
        return style2;
      });
      vue.watch(() => props.src, () => {
        error.value = false;
        loading.value = true;
      });
      const onLoad = (event) => {
        if (loading.value) {
          loading.value = false;
          emit("load", event);
        }
      };
      const triggerLoad = () => {
        const loadEvent = new Event("load");
        Object.defineProperty(loadEvent, "target", {
          value: imageRef.value,
          enumerable: true
        });
        onLoad(loadEvent);
      };
      const onError = (event) => {
        error.value = true;
        loading.value = false;
        emit("error", event);
      };
      const renderIcon = (name2, className, slot) => {
        if (slot) {
          return slot();
        }
        return vue.createVNode(Icon, {
          "name": name2,
          "size": props.iconSize,
          "class": className,
          "classPrefix": props.iconPrefix
        }, null);
      };
      const renderPlaceholder = () => {
        if (loading.value && props.showLoading) {
          return vue.createVNode("div", {
            "class": bem$3("loading")
          }, [renderIcon(props.loadingIcon, bem$3("loading-icon"), slots.loading)]);
        }
        if (error.value && props.showError) {
          return vue.createVNode("div", {
            "class": bem$3("error")
          }, [renderIcon(props.errorIcon, bem$3("error-icon"), slots.error)]);
        }
      };
      const renderImage = () => {
        if (error.value || !props.src) {
          return;
        }
        const attrs = {
          alt: props.alt,
          class: bem$3("img"),
          style: {
            objectFit: props.fit,
            objectPosition: props.position
          }
        };
        if (props.lazyLoad) {
          return vue.withDirectives(vue.createVNode("img", vue.mergeProps({
            "ref": imageRef
          }, attrs), null), [[vue.resolveDirective("lazy"), props.src]]);
        }
        return vue.createVNode("img", vue.mergeProps({
          "ref": imageRef,
          "src": props.src,
          "onLoad": onLoad,
          "onError": onError
        }, attrs), null);
      };
      const onLazyLoaded = ({
        el
      }) => {
        const check = () => {
          if (el === imageRef.value && loading.value) {
            triggerLoad();
          }
        };
        if (imageRef.value) {
          check();
        } else {
          vue.nextTick(check);
        }
      };
      const onLazyLoadError = ({
        el
      }) => {
        if (el === imageRef.value && !error.value) {
          onError();
        }
      };
      if ($Lazyload && inBrowser$1) {
        $Lazyload.$on("loaded", onLazyLoaded);
        $Lazyload.$on("error", onLazyLoadError);
        vue.onBeforeUnmount(() => {
          $Lazyload.$off("loaded", onLazyLoaded);
          $Lazyload.$off("error", onLazyLoadError);
        });
      }
      vue.onMounted(() => {
        vue.nextTick(() => {
          var _a;
          if (((_a = imageRef.value) == null ? void 0 : _a.complete) && !props.lazyLoad) {
            triggerLoad();
          }
        });
      });
      return () => {
        var _a;
        return vue.createVNode("div", {
          "class": bem$3({
            round: props.round,
            block: props.block
          }),
          "style": style.value
        }, [renderImage(), renderPlaceholder(), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
    }
  });
  const Image = withInstall(stdin_default$3);
  const [name$2, bem$2] = createNamespace("cell-group");
  const cellGroupProps = {
    title: String,
    inset: Boolean,
    border: truthProp
  };
  var stdin_default$2 = vue.defineComponent({
    name: name$2,
    inheritAttrs: false,
    props: cellGroupProps,
    setup(props, {
      slots,
      attrs
    }) {
      const renderGroup = () => {
        var _a;
        return vue.createVNode("div", vue.mergeProps({
          "class": [bem$2({
            inset: props.inset
          }), {
            [BORDER_TOP_BOTTOM]: props.border && !props.inset
          }]
        }, attrs, useScopeId()), [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
      };
      const renderTitle = () => vue.createVNode("div", {
        "class": bem$2("title", {
          inset: props.inset
        })
      }, [slots.title ? slots.title() : props.title]);
      return () => {
        if (props.title || slots.title) {
          return vue.createVNode(vue.Fragment, null, [renderTitle(), renderGroup()]);
        }
        return renderGroup();
      };
    }
  });
  const CellGroup = withInstall(stdin_default$2);
  const [name$1, bem$1] = createNamespace("nav-bar");
  const navBarProps = {
    title: String,
    fixed: Boolean,
    zIndex: numericProp,
    border: truthProp,
    leftText: String,
    rightText: String,
    leftDisabled: Boolean,
    rightDisabled: Boolean,
    leftArrow: Boolean,
    placeholder: Boolean,
    safeAreaInsetTop: Boolean,
    clickable: truthProp
  };
  var stdin_default$1 = vue.defineComponent({
    name: name$1,
    props: navBarProps,
    emits: ["clickLeft", "clickRight"],
    setup(props, {
      emit,
      slots
    }) {
      const navBarRef = vue.ref();
      const renderPlaceholder = usePlaceholder(navBarRef, bem$1);
      const onClickLeft = (event) => {
        if (!props.leftDisabled) {
          emit("clickLeft", event);
        }
      };
      const onClickRight = (event) => {
        if (!props.rightDisabled) {
          emit("clickRight", event);
        }
      };
      const renderLeft = () => {
        if (slots.left) {
          return slots.left();
        }
        return [props.leftArrow && vue.createVNode(Icon, {
          "class": bem$1("arrow"),
          "name": "arrow-left"
        }, null), props.leftText && vue.createVNode("span", {
          "class": bem$1("text")
        }, [props.leftText])];
      };
      const renderRight = () => {
        if (slots.right) {
          return slots.right();
        }
        return vue.createVNode("span", {
          "class": bem$1("text")
        }, [props.rightText]);
      };
      const renderNavBar = () => {
        const {
          title,
          fixed,
          border,
          zIndex
        } = props;
        const style = getZIndexStyle(zIndex);
        const hasLeft = props.leftArrow || props.leftText || slots.left;
        const hasRight = props.rightText || slots.right;
        return vue.createVNode("div", {
          "ref": navBarRef,
          "style": style,
          "class": [bem$1({
            fixed
          }), {
            [BORDER_BOTTOM]: border,
            "van-safe-area-top": props.safeAreaInsetTop
          }]
        }, [vue.createVNode("div", {
          "class": bem$1("content")
        }, [hasLeft && vue.createVNode("div", {
          "class": [bem$1("left", {
            disabled: props.leftDisabled
          }), props.clickable && !props.leftDisabled ? HAPTICS_FEEDBACK : ""],
          "onClick": onClickLeft
        }, [renderLeft()]), vue.createVNode("div", {
          "class": [bem$1("title"), "van-ellipsis"]
        }, [slots.title ? slots.title() : title]), hasRight && vue.createVNode("div", {
          "class": [bem$1("right", {
            disabled: props.rightDisabled
          }), props.clickable && !props.rightDisabled ? HAPTICS_FEEDBACK : ""],
          "onClick": onClickRight
        }, [renderRight()])])]);
      };
      return () => {
        if (props.fixed && props.placeholder) {
          return renderPlaceholder(renderNavBar);
        }
        return renderNavBar();
      };
    }
  });
  const NavBar = withInstall(stdin_default$1);
  const [name, bem] = createNamespace("stepper");
  const LONG_PRESS_INTERVAL = 200;
  const isEqual = (value1, value2) => String(value1) === String(value2);
  const stepperProps = {
    min: makeNumericProp(1),
    max: makeNumericProp(Infinity),
    name: makeNumericProp(""),
    step: makeNumericProp(1),
    theme: String,
    integer: Boolean,
    disabled: Boolean,
    showPlus: truthProp,
    showMinus: truthProp,
    showInput: truthProp,
    longPress: truthProp,
    autoFixed: truthProp,
    allowEmpty: Boolean,
    modelValue: numericProp,
    inputWidth: numericProp,
    buttonSize: numericProp,
    placeholder: String,
    disablePlus: Boolean,
    disableMinus: Boolean,
    disableInput: Boolean,
    beforeChange: Function,
    defaultValue: makeNumericProp(1),
    decimalLength: numericProp
  };
  var stdin_default = vue.defineComponent({
    name,
    props: stepperProps,
    emits: ["plus", "blur", "minus", "focus", "change", "overlimit", "update:modelValue"],
    setup(props, {
      emit
    }) {
      const format = (value, autoFixed = true) => {
        const {
          min,
          max,
          allowEmpty,
          decimalLength
        } = props;
        if (allowEmpty && value === "") {
          return value;
        }
        value = formatNumber(String(value), !props.integer);
        value = value === "" ? 0 : +value;
        value = Number.isNaN(value) ? +min : value;
        value = autoFixed ? Math.max(Math.min(+max, value), +min) : value;
        if (isDef(decimalLength)) {
          value = value.toFixed(+decimalLength);
        }
        return value;
      };
      const getInitialValue = () => {
        var _a;
        const defaultValue = (_a = props.modelValue) != null ? _a : props.defaultValue;
        const value = format(defaultValue);
        if (!isEqual(value, props.modelValue)) {
          emit("update:modelValue", value);
        }
        return value;
      };
      let actionType;
      const inputRef = vue.ref();
      const current2 = vue.ref(getInitialValue());
      const minusDisabled = vue.computed(() => props.disabled || props.disableMinus || +current2.value <= +props.min);
      const plusDisabled = vue.computed(() => props.disabled || props.disablePlus || +current2.value >= +props.max);
      const inputStyle = vue.computed(() => ({
        width: addUnit(props.inputWidth),
        height: addUnit(props.buttonSize)
      }));
      const buttonStyle = vue.computed(() => getSizeStyle(props.buttonSize));
      const check = () => {
        const value = format(current2.value);
        if (!isEqual(value, current2.value)) {
          current2.value = value;
        }
      };
      const setValue = (value) => {
        if (props.beforeChange) {
          callInterceptor(props.beforeChange, {
            args: [value],
            done() {
              current2.value = value;
            }
          });
        } else {
          current2.value = value;
        }
      };
      const onChange = () => {
        if (actionType === "plus" && plusDisabled.value || actionType === "minus" && minusDisabled.value) {
          emit("overlimit", actionType);
          return;
        }
        const diff = actionType === "minus" ? -props.step : +props.step;
        const value = format(addNumber(+current2.value, diff));
        setValue(value);
        emit(actionType);
      };
      const onInput = (event) => {
        const input = event.target;
        const {
          value
        } = input;
        const {
          decimalLength
        } = props;
        let formatted = formatNumber(String(value), !props.integer);
        if (isDef(decimalLength) && formatted.includes(".")) {
          const pair = formatted.split(".");
          formatted = `${pair[0]}.${pair[1].slice(0, +decimalLength)}`;
        }
        if (props.beforeChange) {
          input.value = String(current2.value);
        } else if (!isEqual(value, formatted)) {
          input.value = formatted;
        }
        const isNumeric2 = formatted === String(+formatted);
        setValue(isNumeric2 ? +formatted : formatted);
      };
      const onFocus = (event) => {
        var _a;
        if (props.disableInput) {
          (_a = inputRef.value) == null ? void 0 : _a.blur();
        } else {
          emit("focus", event);
        }
      };
      const onBlur = (event) => {
        const input = event.target;
        const value = format(input.value, props.autoFixed);
        input.value = String(value);
        current2.value = value;
        vue.nextTick(() => {
          emit("blur", event);
          resetScroll();
        });
      };
      let isLongPress;
      let longPressTimer;
      const longPressStep = () => {
        longPressTimer = setTimeout(() => {
          onChange();
          longPressStep();
        }, LONG_PRESS_INTERVAL);
      };
      const onTouchStart = () => {
        if (props.longPress) {
          isLongPress = false;
          clearTimeout(longPressTimer);
          longPressTimer = setTimeout(() => {
            isLongPress = true;
            onChange();
            longPressStep();
          }, LONG_PRESS_START_TIME);
        }
      };
      const onTouchEnd = (event) => {
        if (props.longPress) {
          clearTimeout(longPressTimer);
          if (isLongPress) {
            preventDefault(event);
          }
        }
      };
      const onMousedown = (event) => {
        if (props.disableInput) {
          preventDefault(event);
        }
      };
      const createListeners = (type) => ({
        onClick: (event) => {
          preventDefault(event);
          actionType = type;
          onChange();
        },
        onTouchstartPassive: () => {
          actionType = type;
          onTouchStart();
        },
        onTouchend: onTouchEnd,
        onTouchcancel: onTouchEnd
      });
      vue.watch(() => [props.max, props.min, props.integer, props.decimalLength], check);
      vue.watch(() => props.modelValue, (value) => {
        if (!isEqual(value, current2.value)) {
          current2.value = format(value);
        }
      });
      vue.watch(current2, (value) => {
        emit("update:modelValue", value);
        emit("change", value, {
          name: props.name
        });
      });
      useCustomFieldValue(() => props.modelValue);
      return () => vue.createVNode("div", {
        "role": "group",
        "class": bem([props.theme])
      }, [vue.withDirectives(vue.createVNode("button", vue.mergeProps({
        "type": "button",
        "style": buttonStyle.value,
        "class": [bem("minus", {
          disabled: minusDisabled.value
        }), {
          [HAPTICS_FEEDBACK]: !minusDisabled.value
        }],
        "aria-disabled": minusDisabled.value || void 0
      }, createListeners("minus")), null), [[vue.vShow, props.showMinus]]), vue.withDirectives(vue.createVNode("input", {
        "ref": inputRef,
        "type": props.integer ? "tel" : "text",
        "role": "spinbutton",
        "class": bem("input"),
        "value": current2.value,
        "style": inputStyle.value,
        "disabled": props.disabled,
        "readonly": props.disableInput,
        "inputmode": props.integer ? "numeric" : "decimal",
        "placeholder": props.placeholder,
        "aria-valuemax": props.max,
        "aria-valuemin": props.min,
        "aria-valuenow": current2.value,
        "onBlur": onBlur,
        "onInput": onInput,
        "onFocus": onFocus,
        "onMousedown": onMousedown
      }, null), [[vue.vShow, props.showInput]]), vue.withDirectives(vue.createVNode("button", vue.mergeProps({
        "type": "button",
        "style": buttonStyle.value,
        "class": [bem("plus", {
          disabled: plusDisabled.value
        }), {
          [HAPTICS_FEEDBACK]: !plusDisabled.value
        }],
        "aria-disabled": plusDisabled.value || void 0
      }, createListeners("plus")), null), [[vue.vShow, props.showPlus]])]);
    }
  });
  const Stepper = withInstall(stdin_default);
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function toValue(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  const bypassFilter = (invoke2) => {
    return invoke2();
  };
  function pausableFilter(extendFilter = bypassFilter) {
    const isActive = vue.ref(true);
    function pause() {
      isActive.value = false;
    }
    function resume() {
      isActive.value = true;
    }
    const eventFilter = (...args) => {
      if (isActive.value)
        extendFilter(...args);
    };
    return { isActive: vue.readonly(isActive), pause, resume, eventFilter };
  }
  function getLifeCycleTarget(target) {
    return target || vue.getCurrentInstance();
  }
  function watchWithFilter(source, cb, options = {}) {
    const {
      eventFilter = bypassFilter,
      ...watchOptions
    } = options;
    return vue.watch(
      source,
      createFilterWrapper(
        eventFilter,
        cb
      ),
      watchOptions
    );
  }
  function watchPausable(source, cb, options = {}) {
    const {
      eventFilter: filter,
      ...watchOptions
    } = options;
    const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
    const stop = watchWithFilter(
      source,
      cb,
      {
        ...watchOptions,
        eventFilter
      }
    );
    return { stop, pause, resume, isActive };
  }
  function tryOnMounted(fn, sync = true, target) {
    const instance = getLifeCycleTarget();
    if (instance)
      vue.onMounted(fn, target);
    else if (sync)
      fn();
    else
      vue.nextTick(fn);
  }
  function unrefElement(elRef) {
    var _a;
    const plain = toValue(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  function useEventListener(...args) {
    let target;
    let events2;
    let listeners;
    let options;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      [events2, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events2, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events2))
      events2 = [events2];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(
      () => [unrefElement(target), toValue(options)],
      ([el, options2]) => {
        cleanup();
        if (!el)
          return;
        const optionsClone = isObject(options2) ? { ...options2 } : options2;
        cleanups.push(
          ...events2.flatMap((event) => {
            return listeners.map((listener) => register(el, event, listener, optionsClone));
          })
        );
      },
      { immediate: true, flush: "post" }
    );
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  const handlers = /* @__PURE__ */ getHandlers();
  function getHandlers() {
    if (!(globalKey in _global))
      _global[globalKey] = _global[globalKey] || {};
    return _global[globalKey];
  }
  function getSSRHandler(key, fallback) {
    return handlers[key] || fallback;
  }
  function guessSerializerType(rawInit) {
    return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
  }
  const StorageSerializers = {
    boolean: {
      read: (v) => v === "true",
      write: (v) => String(v)
    },
    object: {
      read: (v) => JSON.parse(v),
      write: (v) => JSON.stringify(v)
    },
    number: {
      read: (v) => Number.parseFloat(v),
      write: (v) => String(v)
    },
    any: {
      read: (v) => v,
      write: (v) => String(v)
    },
    string: {
      read: (v) => v,
      write: (v) => String(v)
    },
    map: {
      read: (v) => new Map(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v.entries()))
    },
    set: {
      read: (v) => new Set(JSON.parse(v)),
      write: (v) => JSON.stringify(Array.from(v))
    },
    date: {
      read: (v) => new Date(v),
      write: (v) => v.toISOString()
    }
  };
  const customStorageEventName = "vueuse-storage";
  function useStorage(key, defaults2, storage, options = {}) {
    var _a;
    const {
      flush = "pre",
      deep = true,
      listenToStorageChanges = true,
      writeDefaults = true,
      mergeDefaults = false,
      shallow,
      window: window2 = defaultWindow,
      eventFilter,
      onError = (e) => {
        console.error(e);
      },
      initOnMounted
    } = options;
    const data = (shallow ? vue.shallowRef : vue.ref)(typeof defaults2 === "function" ? defaults2() : defaults2);
    if (!storage) {
      try {
        storage = getSSRHandler("getDefaultStorage", () => {
          var _a2;
          return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
        })();
      } catch (e) {
        onError(e);
      }
    }
    if (!storage)
      return data;
    const rawInit = toValue(defaults2);
    const type = guessSerializerType(rawInit);
    const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
    const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
      data,
      () => write(data.value),
      { flush, deep, eventFilter }
    );
    if (window2 && listenToStorageChanges) {
      tryOnMounted(() => {
        useEventListener(window2, "storage", update);
        useEventListener(window2, customStorageEventName, updateFromCustomEvent);
        if (initOnMounted)
          update();
      });
    }
    if (!initOnMounted)
      update();
    return data;
    function write(v) {
      try {
        if (v == null) {
          storage.removeItem(key);
        } else {
          const serialized = serializer.write(v);
          const oldValue = storage.getItem(key);
          if (oldValue !== serialized) {
            storage.setItem(key, serialized);
            if (window2) {
              window2.dispatchEvent(new CustomEvent(customStorageEventName, {
                detail: {
                  key,
                  oldValue,
                  newValue: serialized,
                  storageArea: storage
                }
              }));
            }
          }
        }
      } catch (e) {
        onError(e);
      }
    }
    function read(event) {
      const rawValue = event ? event.newValue : storage.getItem(key);
      if (rawValue == null) {
        if (writeDefaults && rawInit != null)
          storage.setItem(key, serializer.write(rawInit));
        return rawInit;
      } else if (!event && mergeDefaults) {
        const value = serializer.read(rawValue);
        if (typeof mergeDefaults === "function")
          return mergeDefaults(value, rawInit);
        else if (type === "object" && !Array.isArray(value))
          return { ...rawInit, ...value };
        return value;
      } else if (typeof rawValue !== "string") {
        return rawValue;
      } else {
        return serializer.read(rawValue);
      }
    }
    function updateFromCustomEvent(event) {
      update(event.detail);
    }
    function update(event) {
      if (event && event.storageArea !== storage)
        return;
      if (event && event.key == null) {
        data.value = rawInit;
        return;
      }
      if (event && event.key !== key)
        return;
      pauseWatch();
      try {
        if ((event == null ? void 0 : event.newValue) !== serializer.write(data.value))
          data.value = read(event);
      } catch (e) {
        onError(e);
      } finally {
        if (event)
          vue.nextTick(resumeWatch);
        else
          resumeWatch();
      }
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-b5ca6ba1"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", null, "助手", -1));
  const _hoisted_2 = { id: "app" };
  const _hoisted_3 = { class: "tab-content" };
  const _hoisted_4 = { class: "tab-content" };
  const _hoisted_5 = { class: "tab-content" };
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("span", { style: { "color": "var(--van-cell-text-color)", "font-size": "var(--van-cell-font-size)" } }, " 分钟", -1));
  const _hoisted_7 = { class: "tab-content" };
  const _hoisted_8 = { class: "tab-content" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const config = useStorage("config", {
        tabActive: 0,
        consoleShow: false,
        keepActive: true,
        reloadPageHourly: true,
        welcomeMessage: {
          enable: true,
          message: "点歌状态 ➡️ {musicswitchstatus}\n点歌命令 ➡️ {command}\n正在播放 ➡️ {nowplaying}\n进入用户 ➡️ {username}\n当前日期 ➡️ {date}\n当前时间 ➡️ {time}\n房间名称 ➡️ {roomname}\n在线人数 ➡️ {onlinenum}\nBot 名字 ➡️ {me}"
        },
        sendRegularly: {
          enable: false,
          interval: 5,
          message: "点歌状态 ➡️ {musicswitchstatus}\n点歌命令 ➡️ {command}\n正在播放 ➡️ {nowplaying}\n进入用户 ➡️ {username}\n当前日期 ➡️ {date}\n当前时间 ➡️ {time}\n房间名称 ➡️ {roomname}\n在线人数 ➡️ {onlinenum}\nBot 名字 ➡️ {me}"
        },
        selfServiceSongRequest: {
          enable: false,
          promptsNotEnabled: true,
          promptMessage: "暂未开启自助点歌功能",
          showPopup: false,
          history: [],
          command: "点歌|播放"
        },
        aiChat: {
          enable: false,
          atDialogue: true,
          modelName: "gpt-3.5-turbo-16k",
          chatHistory: [],
          enableLoading: false,
          token: ""
        }
      });
      const toggleConsolePopup = () => config.value.consoleShow = !config.value.consoleShow;
      const openNewWindow = (url) => {
        window.open(url, "_blank");
      };
      const generateDate = () => {
        const date = /* @__PURE__ */ new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const generateTime = () => {
        const date = /* @__PURE__ */ new Date();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      };
      const replaceVariables = (message, user) => {
        var _a, _b, _c;
        return message.replace("{date}", generateDate()).replace("{time}", generateTime()).replace("{me}", profile.name).replace("{roomname}", ((_a = window.room) == null ? void 0 : _a.name) || profile.name + "的房间").replace("{username}", user ? user.name : "N/A").replace("{onlinenum}", user_list.children.length !== 0 ? user_list.children.length : "N/A").replace("{nowplaying}", ((_c = (_b = window.Player) == null ? void 0 : _b.nowPlaying) == null ? void 0 : _c.name) ?? "N/A").replace("{musicswitchstatus}", config.value.selfServiceSongRequest.enable ? "启用" : "禁用").replace("{command}", config.value.selfServiceSongRequest.command.split("|").filter(Boolean).map((item, index) => `${item}歌曲名`).join("、"));
      };
      const keepAliveHandler = () => {
        const uid = profile.id;
        const keepAliveInterval = 5;
        let { lastSendMessageTime, dev } = DRRR.globals;
        setInterval(function() {
          if (config.value.keepActive) {
            const currentTime = (/* @__PURE__ */ new Date()).getTime();
            if (currentTime - lastSendMessageTime > keepAliveInterval * 60 * 1e3) {
              console.log("上次发送消息时间：", lastSendMessageTime);
              console.log("当前时间：", currentTime);
              DRRR.utils.sendMessage({ message: generateTime(), to: uid });
              lastSendMessageTime = currentTime;
            } else {
              dev && console.log(`距离上一次发送空消息时间不足${keepAliveInterval}分钟,忽略本次发送`);
            }
          } else {
            dev && console.log("房间保活功能未开启");
          }
        }, 60 * 1100);
      };
      const reloadPageHourly = () => {
        setInterval(function() {
          if (config.value.reloadPageHourly) {
            location.reload();
          }
        }, 60 * 60 * 1e3);
      };
      const welcomeMessageHandler = () => {
        DRRR.events.addEventListener("join", (from) => {
          console.log(from.user.name);
          if (config.value.welcomeMessage.enable && config.value.welcomeMessage.message) {
            console.log("发送欢迎消息");
            DRRR.utils.sendMessage({ message: replaceVariables(config.value.welcomeMessage.message, from.user) });
          }
        });
      };
      const sendRegularlyHandler = () => {
        let timerId;
        function sendRegularly() {
          if (config.value.sendRegularly.enable) {
            console.log("执行定时发送的任务");
            DRRR.utils.sendMessage({ message: replaceVariables(config.value.sendRegularly.message) });
          }
        }
        function updateTimer() {
          clearInterval(timerId);
          timerId = setInterval(sendRegularly, (config.value.sendRegularly.interval ?? 5) * 60 * 1e3);
        }
        updateTimer();
      };
      const selfServiceSongRequestHandler = () => {
        const commands = config.value.selfServiceSongRequest.command.split("|").filter(Boolean);
        console.log("点歌命令：", commands);
        const getSongInfo = async (keyword) => {
          const songRequestApi = "//43.142.80.6/music/api.php";
          const searchResponse = await fetch(`${songRequestApi}?type=search&keyword=${keyword}`);
          const searchData = await searchResponse.json();
          if (searchData.code !== 200 || searchData.data.length === 0) {
            DRRR.utils.sendMessage({ message: `没有找到与“${keyword}”相关的歌曲` });
            throw new Error("没有找到歌曲");
          }
          const songName = `${searchData.data[0].songname} - ${searchData.data[0].singer}`;
          const urlResponse = await fetch(`${songRequestApi}?type=url&songid=${btoa(searchData.data[0].songid)}`);
          const urlData = await urlResponse.json();
          console.log(urlData);
          if (urlData.code !== 200) {
            DRRR.utils.sendMessage({ message: `获取歌曲地址失败` });
            throw new Error("获取歌曲地址失败");
          }
          return { music: "music", url: urlData.data, name: songName };
        };
        commands.forEach((command) => {
          console.log("监听点歌命令：", command);
          DRRR.commands.push({ command });
          DRRR.events.addEventListener(`message(${command})`, async (data) => {
            if (config.value.selfServiceSongRequest.enable) {
              try {
                const songInfo = await getSongInfo(data.message);
                console.log(songInfo);
                await DRRR.utils.sendMessage(songInfo);
                if (config.value.selfServiceSongRequest.history.length >= 50) {
                  config.value.selfServiceSongRequest.history.pop();
                }
                config.value.selfServiceSongRequest.history.unshift({
                  username: data.from.name,
                  musicName: songInfo.name,
                  time: generateTime()
                });
              } catch (error) {
                console.error(error);
              }
            } else {
              console.log(data);
              if (config.value.selfServiceSongRequest.promptsNotEnabled && config.value.selfServiceSongRequest.promptMessage) {
                await DRRR.utils.sendMessage({ message: replaceVariables(config.value.selfServiceSongRequest.promptMessage, data.from) });
              }
            }
          });
        });
      };
      const commandsChange = () => {
        config.value.selfServiceSongRequest.command;
        if (confirm("检测到的点歌已修改,需要刷新才能生效,是否刷新?")) {
          location.reload();
        }
      };
      const aiChatHandler = async (message) => {
        let replying = false;
        let isSendingMessage = false;
        let lastSendMessageTime = 0;
        const splitAndSendMessages = async (messageText, maxSendCount = 3) => {
          const sendMessageInterval = 1e4;
          isSendingMessage = true;
          const sendMessage = async (message2, callback) => {
            try {
              const currentTime = Date.now();
              if (currentTime - lastSendMessageTime < sendMessageInterval) {
                await new Promise((resolve) => setTimeout(resolve, sendMessageInterval));
              }
              lastSendMessageTime = Date.now();
              const response = await fetch("?ajax=1", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  // 使用表单格式发送数据
                  "X-Requested-With": "XMLHttpRequest"
                  // 设置 X-Requested-With 请求头
                },
                body: `message=${message2}`
                // 将消息作为字符串发送
              });
              if (response.ok) {
                const responseData = await response.text();
                if (responseData === "") {
                  console.log("AI发送消息成功");
                  DRRR.utils.insertLocalMessage(message2);
                  callback == null ? void 0 : callback();
                } else {
                  console.error("AI发送请求成功，但响应不正确");
                }
              } else {
                throw new Error("AI发送消息失败: " + response.statusText);
              }
            } catch (error) {
              console.error("AI发送消息出错：", error);
            }
          };
          const chunkSize = 134;
          const totalPages = Math.ceil(messageText.length / chunkSize);
          if (messageText.length > chunkSize) {
            for (let page = 1; page <= totalPages; page++) {
              const start = (page - 1) * chunkSize;
              const end = page * chunkSize;
              const messageChunk = messageText.slice(start, end);
              const pageNumberInfo = `
【${page}/${totalPages > maxSendCount ? maxSendCount : totalPages}】`;
              const messageWithPageInfo = `${messageChunk}${pageNumberInfo}`;
              if (page <= maxSendCount) {
                await sendMessage(messageWithPageInfo, () => {
                  if (page === totalPages) {
                    console.log("所有消息发送完成");
                    isSendingMessage = false;
                  }
                });
              } else {
                console.log("达到最大发送次数，忽略后面消息");
                setTimeout(() => {
                  DRRR_HELPER_API.sendMessage({ message: "本次回复过长,后面信息已被省略。" });
                  isSendingMessage = false;
                }, sendMessageInterval);
                break;
              }
            }
          } else {
            await sendMessage(messageText, () => {
              console.log("消息发送完成");
              isSendingMessage = false;
            });
          }
        };
        const getAiChatReply = async (message2) => {
          if (replying || isSendingMessage)
            return;
          replying = true;
          const newMessage = {
            "role": "user",
            "content": message2
          };
          try {
            const response = await Promise.race([
              fetch("https://api.b3n.fun/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": config.value.aiChat.token
                },
                body: JSON.stringify({
                  "model": config.value.aiChat.modelName || "gpt-3.5-turbo-16k",
                  "stream": false,
                  "temperature": 0.6,
                  "top_p": 1,
                  "max_tokens": 2500,
                  "messages": [...config.value.aiChat.chatHistory, newMessage]
                })
              }),
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  reject(new Error("请求超时"));
                }, 1e4);
              })
            ]);
            const data = await response.json();
            if (data.error) {
              throw new Error(data.error.message);
            }
            config.value.aiChat.chatHistory.push(newMessage);
            config.value.aiChat.chatHistory.push(data.choices[0].message);
            if (config.value.aiChat.chatHistory.length > 6) {
              config.value.aiChat.chatHistory.splice(0, config.value.aiChat.chatHistory.length - 6);
            }
            await splitAndSendMessages(data.choices[0].message.content, 5);
          } catch (error) {
            console.error(error.message);
          } finally {
            replying = false;
          }
        };
        DRRR.events.addEventListener("message(@)", async (data) => {
          if (config.value.aiChat.enable && config.value.aiChat.atDialogue) {
            console.log("回复艾特ai消息");
            await getAiChatReply(data.message);
          }
        });
        DRRR.events.addEventListener("message(*)", async (data) => {
          if (config.value.aiChat.enable && !config.value.aiChat.atDialogue) {
            console.log("回复艾特普通消息");
            await getAiChatReply(data.message);
          }
        });
      };
      const toggleAiChat = async (newValue) => {
        config.value.aiChat.enableLoading = true;
        try {
          if (!newValue) {
            config.value.aiChat.enable = newValue;
            return;
          }
          if (!config.value.aiChat.token) {
            alert("请先填写接口令牌,没有就先获取");
            throw new Error("接口令牌不能为空");
          }
          const response = await fetch("https://api.b3n.fun/v1/models", {
            headers: {
              "Authorization": config.value.aiChat.token,
              "Content-Type": "application/json"
            }
          });
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error.message);
          }
          config.value.aiChat.enable = newValue;
        } catch (error) {
          console.error(error.message);
        } finally {
          config.value.aiChat.enableLoading = false;
        }
      };
      vue.onMounted(() => {
        keepAliveHandler();
        reloadPageHourly();
        welcomeMessageHandler();
        sendRegularlyHandler();
        selfServiceSongRequestHandler();
        aiChatHandler();
        config.value.aiChat.chatHistory.length = 0;
      });
      return (_ctx, _cache) => {
        const _component_van_image = Image;
        const _component_van_icon = Icon;
        const _component_van_nav_bar = NavBar;
        const _component_van_switch = Switch;
        const _component_van_cell = Cell;
        const _component_van_cell_group = CellGroup;
        const _component_van_tab = Tab;
        const _component_van_field = Field;
        const _component_van_stepper = Stepper;
        const _component_van_radio = Radio;
        const _component_van_radio_group = RadioGroup;
        const _component_van_tabs = Tabs;
        const _component_van_popup = Popup;
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.withDirectives(vue.createElementVNode("div", {
            class: "console-switch",
            onClick: toggleConsolePopup
          }, [
            vue.createVNode(_component_van_image, {
              src: "https://drrr.com/favicon.svg",
              width: "20"
            }),
            _hoisted_1
          ], 512), [
            [vue.vShow, !vue.unref(config).consoleShow]
          ]),
          vue.createVNode(_component_van_popup, {
            show: vue.unref(config).consoleShow,
            "onUpdate:show": _cache[17] || (_cache[17] = ($event) => vue.unref(config).consoleShow = $event),
            style: { "width": "100vw" }
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2, [
                vue.createVNode(_component_van_nav_bar, {
                  title: "DOLLARS助手 控制台",
                  onClickRight: toggleConsolePopup
                }, {
                  right: vue.withCtx(() => [
                    vue.createVNode(_component_van_icon, {
                      name: "cross",
                      size: "18"
                    })
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_van_tabs, {
                  active: vue.unref(config).tabActive,
                  "onUpdate:active": _cache[16] || (_cache[16] = ($event) => vue.unref(config).tabActive = $event)
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_van_tab, { title: "通用设置" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_3, [
                          vue.createVNode(_component_van_cell_group, {
                            class: "cell-group",
                            inset: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "房间保活"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    modelValue: vue.unref(config).keepActive,
                                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).keepActive = $event)
                                  }, null, 8, ["modelValue"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_cell, {
                                title: "功能说明",
                                value: "定时发送私信给自己,保证房间不被释放"
                              })
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_van_cell_group, {
                            class: "cell-group",
                            inset: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "定时重载"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    modelValue: vue.unref(config).reloadPageHourly,
                                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).reloadPageHourly = $event)
                                  }, null, 8, ["modelValue"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_cell, {
                                title: "功能说明",
                                value: "每小时重新加载页面,释放内存,脚本运行更稳定"
                              })
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_van_tab, { title: "欢迎消息" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_4, [
                          vue.createVNode(_component_van_cell_group, {
                            class: "cell-group",
                            inset: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "功能开关"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    modelValue: vue.unref(config).welcomeMessage.enable,
                                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).welcomeMessage.enable = $event)
                                  }, null, 8, ["modelValue"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_field, {
                                modelValue: vue.unref(config).welcomeMessage.message,
                                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).welcomeMessage.message = $event),
                                rows: "9",
                                label: "欢迎内容",
                                type: "textarea",
                                placeholder: "设置欢迎消息内容"
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_van_tab, { title: "定时发送" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_5, [
                          vue.createVNode(_component_van_cell_group, {
                            class: "cell-group",
                            inset: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "功能开关"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    modelValue: vue.unref(config).sendRegularly.enable,
                                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => vue.unref(config).sendRegularly.enable = $event)
                                  }, null, 8, ["modelValue"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_cell, { title: "间隔时间" }, {
                                default: vue.withCtx(() => [
                                  vue.createVNode(_component_van_stepper, {
                                    modelValue: vue.unref(config).sendRegularly.interval,
                                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.unref(config).sendRegularly.interval = $event),
                                    "button-size": "22",
                                    min: "1",
                                    max: "20",
                                    "disable-input": ""
                                  }, null, 8, ["modelValue"]),
                                  _hoisted_6
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_field, {
                                modelValue: vue.unref(config).sendRegularly.message,
                                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => vue.unref(config).sendRegularly.message = $event),
                                rows: "7",
                                label: "发送内容",
                                type: "textarea",
                                placeholder: "设置定时发送内容"
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_van_tab, { title: "自助点歌" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_7, [
                          vue.createVNode(_component_van_cell_group, {
                            class: "cell-group",
                            inset: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "功能开关"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    modelValue: vue.unref(config).selfServiceSongRequest.enable,
                                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => vue.unref(config).selfServiceSongRequest.enable = $event)
                                  }, null, 8, ["modelValue"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_field, {
                                modelValue: vue.unref(config).selfServiceSongRequest.command,
                                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.unref(config).selfServiceSongRequest.command = $event),
                                label: "点歌命令",
                                placeholder: "点歌",
                                onChange: commandsChange
                              }, null, 8, ["modelValue"]),
                              vue.createVNode(_component_van_cell, {
                                title: "点歌记录",
                                "is-link": ""
                              }),
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "未开提示"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    modelValue: vue.unref(config).selfServiceSongRequest.promptsNotEnabled,
                                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => vue.unref(config).selfServiceSongRequest.promptsNotEnabled = $event)
                                  }, null, 8, ["modelValue"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_field, {
                                modelValue: vue.unref(config).selfServiceSongRequest.promptMessage,
                                "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => vue.unref(config).selfServiceSongRequest.promptMessage = $event),
                                rows: "3",
                                label: "提示内容",
                                type: "textarea",
                                placeholder: "设置未打开点歌功能提示内容"
                              }, null, 8, ["modelValue"])
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    }),
                    vue.createVNode(_component_van_tab, { title: "AI 聊天" }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("div", _hoisted_8, [
                          vue.createVNode(_component_van_cell_group, {
                            class: "cell-group",
                            inset: ""
                          }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "功能开关"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    "model-value": vue.unref(config).aiChat.enable,
                                    "onUpdate:modelValue": toggleAiChat,
                                    loading: vue.unref(config).aiChat.enableLoading
                                  }, null, 8, ["model-value", "loading"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "艾特对话"
                              }, {
                                "right-icon": vue.withCtx(() => [
                                  vue.createVNode(_component_van_switch, {
                                    modelValue: vue.unref(config).aiChat.atDialogue,
                                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => vue.unref(config).aiChat.atDialogue = $event)
                                  }, null, 8, ["modelValue"])
                                ]),
                                _: 1
                              }),
                              vue.createVNode(_component_van_field, {
                                modelValue: vue.unref(config).aiChat.token,
                                "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => vue.unref(config).aiChat.token = $event),
                                label: "接口令牌",
                                placeholder: "sk-xxx",
                                clearable: ""
                              }, null, 8, ["modelValue"]),
                              vue.createVNode(_component_van_cell, {
                                center: "",
                                title: "获取令牌",
                                onClick: _cache[13] || (_cache[13] = ($event) => openNewWindow("https://api.b3n.fun/register")),
                                "is-link": ""
                              }),
                              vue.createVNode(_component_van_field, {
                                name: "radio",
                                label: "选择模型"
                              }, {
                                input: vue.withCtx(() => [
                                  vue.createVNode(_component_van_radio_group, {
                                    modelValue: vue.unref(config).aiChat.modelName,
                                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => vue.unref(config).aiChat.modelName = $event),
                                    direction: "horizontal"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_van_radio, { name: "gpt-3.5-turbo-16k" }, {
                                        default: vue.withCtx(() => [
                                          vue.createTextVNode("gpt-3.5-turbo-16k")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue"]),
                                  vue.createVNode(_component_van_radio_group, {
                                    modelValue: vue.unref(config).aiChat.modelName,
                                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => vue.unref(config).aiChat.modelName = $event),
                                    direction: "horizontal"
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createVNode(_component_van_radio, { name: "gemini-pro" }, {
                                        default: vue.withCtx(() => [
                                          vue.createTextVNode("gemini-pro")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["active"])
              ])
            ]),
            _: 1
          }, 8, ["show"])
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b5ca6ba1"]]);
  (function() {
    if (typeof window === "undefined") {
      return;
    }
    var eventTarget;
    var supportTouch = "ontouchstart" in window;
    if (!document.createTouch) {
      document.createTouch = function(view, target, identifier, pageX, pageY, screenX, screenY) {
        return new Touch(
          target,
          identifier,
          {
            pageX,
            pageY,
            screenX,
            screenY,
            clientX: pageX - window.pageXOffset,
            clientY: pageY - window.pageYOffset
          },
          0,
          0
        );
      };
    }
    if (!document.createTouchList) {
      document.createTouchList = function() {
        var touchList = TouchList();
        for (var i = 0; i < arguments.length; i++) {
          touchList[i] = arguments[i];
        }
        touchList.length = arguments.length;
        return touchList;
      };
    }
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
        var el = this;
        do {
          if (el.matches(s))
            return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
    var Touch = function Touch2(target, identifier, pos, deltaX, deltaY) {
      deltaX = deltaX || 0;
      deltaY = deltaY || 0;
      this.identifier = identifier;
      this.target = target;
      this.clientX = pos.clientX + deltaX;
      this.clientY = pos.clientY + deltaY;
      this.screenX = pos.screenX + deltaX;
      this.screenY = pos.screenY + deltaY;
      this.pageX = pos.pageX + deltaX;
      this.pageY = pos.pageY + deltaY;
    };
    function TouchList() {
      var touchList = [];
      touchList["item"] = function(index) {
        return this[index] || null;
      };
      touchList["identifiedTouch"] = function(id) {
        return this[id + 1] || null;
      };
      return touchList;
    }
    var initiated = false;
    function onMouse(touchType) {
      return function(ev) {
        if (ev.type === "mousedown") {
          initiated = true;
        }
        if (ev.type === "mouseup") {
          initiated = false;
        }
        if (ev.type === "mousemove" && !initiated) {
          return;
        }
        if (ev.type === "mousedown" || !eventTarget || eventTarget && !eventTarget.dispatchEvent) {
          eventTarget = ev.target;
        }
        if (eventTarget.closest("[data-no-touch-simulate]") == null) {
          triggerTouch(touchType, ev);
        }
        if (ev.type === "mouseup") {
          eventTarget = null;
        }
      };
    }
    function triggerTouch(eventName, mouseEv) {
      var touchEvent = document.createEvent("Event");
      touchEvent.initEvent(eventName, true, true);
      touchEvent.altKey = mouseEv.altKey;
      touchEvent.ctrlKey = mouseEv.ctrlKey;
      touchEvent.metaKey = mouseEv.metaKey;
      touchEvent.shiftKey = mouseEv.shiftKey;
      touchEvent.touches = getActiveTouches(mouseEv);
      touchEvent.targetTouches = getActiveTouches(mouseEv);
      touchEvent.changedTouches = createTouchList(mouseEv);
      eventTarget.dispatchEvent(touchEvent);
    }
    function createTouchList(mouseEv) {
      var touchList = TouchList();
      touchList.push(new Touch(eventTarget, 1, mouseEv, 0, 0));
      return touchList;
    }
    function getActiveTouches(mouseEv) {
      if (mouseEv.type === "mouseup") {
        return TouchList();
      }
      return createTouchList(mouseEv);
    }
    function TouchEmulator() {
      window.addEventListener("mousedown", onMouse("touchstart"), true);
      window.addEventListener("mousemove", onMouse("touchmove"), true);
      window.addEventListener("mouseup", onMouse("touchend"), true);
    }
    TouchEmulator["multiTouchOffset"] = 75;
    if (!supportTouch) {
      new TouchEmulator();
    }
  })();
  const unsafeWindow = window || unsafeWindow;
  (function(jquery, unsafeWindow2) {
    const $ = jquery;
    const dev = localStorage.getItem("dev") || false;
    let globals = {
      isSending: false,
      //   是否正在发送消息
      lastSendMessageTime: null,
      //  最后发送消息的时间
      throttleTime: 2e3,
      //  发送消息的节流时间
      lastSendMessageContent: null,
      //  最后发送的消息内容
      dev
      //    开发模式
    };
    const events = /* @__PURE__ */ (() => {
      const listeners = {};
      const addEventListener = (eventName, callback) => {
        if (!listeners[eventName]) {
          listeners[eventName] = [];
        }
        listeners[eventName].push(callback);
      };
      const triggerEvent = (eventName, data) => {
        const eventListeners = listeners[eventName];
        if (eventListeners) {
          eventListeners.forEach((callback) => callback(data));
        }
      };
      return {
        addEventListener,
        triggerEvent
      };
    })();
    const utils = {
      //   发送信息
      sendMessage: async (message, callback) => {
        const currentTime = Date.now();
        if (globals.lastSendMessageTime && currentTime - globals.lastSendMessageTime < 2e3) {
          dev && console.error(`触发节流机制(${globals.throttleTime / 1e3}秒)，本次消息不发送`);
          return;
        }
        globals.lastSendMessageTime = currentTime;
        if (globals.isSending) {
          dev && console.log("消息正在发送中,本次消息不发送");
          return;
        }
        if (typeof message !== "object" || message === null) {
          if (typeof callback === "function") {
            callback(new Error("发送的信息必须为对象"), null);
          } else {
            dev && console.error("发送的信息必须为对象");
          }
          return;
        }
        globals.isSending = true;
        try {
          const formData = new FormData();
          for (const key in message) {
            formData.append(key, message[key]);
          }
          const response = await fetch("?ajax=1", {
            method: "POST",
            headers: {
              "X-Requested-With": "XMLHttpRequest"
            },
            body: formData
            // 发送消息
          });
          if (!response.ok) {
            throw new Error(`发送消息失败: ${response.status}`);
          }
          const data = await response.text();
          if (typeof callback === "function") {
            callback(null, data);
          } else {
            if (data === "") {
              dev && console.log("发送消息成功: ", message);
              if (message.message && !message.to) {
                utils.insertLocalMessage(message.message);
              }
            } else {
              dev && console.error("发送请求成功，但响应不正确");
            }
          }
        } catch (error) {
          if (typeof callback === "function") {
            callback(error, null);
          } else {
            dev && console.error("发送消息失败: ", error);
          }
        } finally {
          globals.isSending = false;
        }
      },
      // 插入消息到页面
      insertLocalMessage: (message) => {
        message = message.toString();
        if (message.startsWith("/me"))
          return;
        const dl = document.createElement("dl");
        dl.className = `talk ${profile.icon}`;
        const dt = document.createElement("dt");
        dt.className = "dropdown user";
        const avatarDiv = document.createElement("div");
        avatarDiv.className = `avatar avatar-${profile.icon}`;
        const nameDiv = document.createElement("div");
        nameDiv.className = "name";
        nameDiv.setAttribute("data-toggle", "dropdown");
        const selectTextSpan = document.createElement("span");
        selectTextSpan.className = "select-text";
        selectTextSpan.textContent = profile.name;
        const ul = document.createElement("ul");
        ul.className = "dropdown-menu";
        ul.setAttribute("role", "menu");
        const dd = document.createElement("dd");
        dd.className = "bounce";
        const bubbleDiv = document.createElement("div");
        bubbleDiv.className = "bubble";
        const tailWrapDiv = document.createElement("div");
        tailWrapDiv.className = "tail-wrap center";
        tailWrapDiv.style.backgroundSize = "65px";
        const tailMaskDiv = document.createElement("div");
        tailMaskDiv.className = "tail-mask";
        const p = document.createElement("p");
        p.className = "body select-text";
        p.innerHTML = message.replace(/\n/g, "<br>");
        tailWrapDiv.appendChild(tailMaskDiv);
        bubbleDiv.appendChild(tailWrapDiv);
        bubbleDiv.appendChild(p);
        dt.appendChild(avatarDiv);
        nameDiv.appendChild(selectTextSpan);
        dt.appendChild(nameDiv);
        dt.appendChild(ul);
        dl.appendChild(dt);
        dd.appendChild(bubbleDiv);
        dl.appendChild(dd);
        const talks = document.querySelector("#talks");
        setTimeout(function() {
          talks.insertAdjacentElement("afterbegin", dl);
        }, 1500);
      },
      //  引入脚本
      loadScript: (src, onloadCallback, onErrorCallback) => {
        const scriptElement = document.createElement("script");
        scriptElement.src = `${src}?v=${Date.now()}`;
        scriptElement.onload = () => {
          if (typeof onloadCallback === "function") {
            onloadCallback();
          } else {
            dev && console.log("引入脚本成功: " + src);
          }
        };
        scriptElement.onerror = () => {
          if (typeof onErrorCallback === "function") {
            onErrorCallback();
          } else {
            dev && console.log("引入脚本失败" + src);
          }
        };
        document.head.appendChild(scriptElement);
      },
      //  引入样式
      loadStyle: (href, onloadCallback, onErrorCallback) => {
        const linkElement = document.createElement("link");
        linkElement.href = href;
        linkElement.rel = "stylesheet";
        linkElement.onload = () => {
          if (typeof onloadCallback === "function") {
            onloadCallback();
          } else {
            dev && console.error("引入脚样式功: " + href);
          }
        };
        linkElement.onerror = () => {
          if (typeof onErrorCallback === "function") {
            onErrorCallback();
          } else {
            dev && console.error("引入脚样式失败: " + href);
          }
        };
        document.head.appendChild(linkElement);
      }
    };
    const commands = [];
    unsafeWindow2.DRRR = { globals, events, utils, commands, ...unsafeWindow2.DRRR };
    $(document).ajaxSuccess(function(event, xhr, settings) {
      if (!settings.url.includes("update"))
        return;
      const talks = xhr.responseJSON.talks || [];
      if (talks.length === 0)
        return;
      talks.forEach(function(data) {
        if (data.is_me)
          return;
        const { message = "", from = "", user = "", music = "", to = "" } = data;
        const eventData = { message, from, user, music, to };
        if (data.type === "message") {
          const message2 = eventData.message;
          const profileName = profile.name ?? "";
          const atRegex = new RegExp(`^@${profileName}\\s*`);
          const isAt = atRegex.test(message2);
          if (isAt) {
            const atMessage = message2.replace(atRegex, "").trim();
            if (atMessage) {
              dev && console.log("艾特消息：" + atMessage);
              eventData.message = atMessage;
              events.triggerEvent("message(@)", eventData);
            } else {
              dev && console.error("艾特消息内容为空，不处理空消息");
            }
            return;
          }
          const matchedCommand = commands.find(({ command }) => message2.startsWith(command));
          if (matchedCommand) {
            const commandLength = matchedCommand.command.length;
            const commandIndex = message2.indexOf(matchedCommand.command);
            const param = message2.substring(commandIndex + commandLength).trim();
            if (param) {
              dev && console.log("命令消息: " + message2);
              dev && console.log("命令: " + matchedCommand.command);
              dev && console.log("消息: " + param);
              eventData.command = matchedCommand.command;
              eventData.message = param;
              events.triggerEvent(`message(${matchedCommand.command})`, eventData);
            } else {
              dev && console.error(`[${matchedCommand.command}]命令消息没有消息内容，不处理空消息`);
            }
          } else {
            dev && console.log("普通消息: " + message2);
            events.triggerEvent(`message(*)`, eventData);
          }
          return;
        }
        events.triggerEvent(data.type, eventData);
      });
    });
    unsafeWindow2.MusicItem = function() {
      function e(n) {
        var r = this;
        _classCallCheck(this, e), this.music = n, this.name = DRRRClientBehavior.literalMusicTitle(n), this.url = n.playURL, this.schedule = null;
        var o = function() {
          events.triggerEvent("music(end)", r.music);
          r._unschedule_progress_update(100), visualizerEnabled && visualizer.stop(), Player.isPausing = true, $(document).trigger("music-end", r);
        }, i = function() {
          events.triggerEvent("music(pause)", r.music);
          r._unschedule_progress_update(100 * r.percent());
        }, a = function() {
          events.triggerEvent("music(start)", r.music);
          r._schedule_progress_update();
        }, s = function() {
          events.triggerEvent("music(stop)", r.music);
          r._unschedule_progress_update();
        };
        "apple_music" == n.source ? this.howl = new AppleMusicBackend(n, {
          autoplay: false,
          onend: o,
          onpause: i,
          onplay: a,
          onstop: s
        }) : this.howl = new Howl({
          autoplay: false,
          src: [this.url],
          html5: true,
          volume: visualizerEnabled ? 1 : Player.volume,
          onload: function() {
            visualizerEnabled && visualizer.play(r._sounds[0]._node);
          },
          onend: o,
          onpause: i,
          onplay: a,
          onstop: s,
          onloaderror: function(e2, n2) {
            events.triggerEvent("music(error)", n2);
            if (r._unschedule_progress_update(), "不支持该音频格式" != n2 && ("不支持所选音频源的编解码器。" != n2 || -1 === r.url.indexOf(visualizerUrlPrefix))) {
              switch (n2 = n2 || "Unknown") {
                case 1:
                  n2 = "获取过程被用户中止";
                  break;
                case 2:
                  n2 = "下载时发生错误";
                  break;
                case 3:
                  n2 = "解码时发生错误";
                  break;
                case 4:
                  n2 = "URL不正确或不支持音频";
              }
              visualizerEnabled && visualizer.stop(), swal(t("Music: "), t("音频无法加载: {1}", r.name) + "\n\n" + t("错误信息: {1}", n2), "warning");
              setTimeout(() => swal.close(), 2e3);
            }
          },
          onplayerror: function() {
            r.howl.once("unlock", function() {
              r.howl.play();
            });
          }
        });
      }
      return _createClass(e, [{
        key: "volume",
        value: function(e2) {
          this.howl.volume(e2);
        }
      }, {
        key: "_schedule_progress_update",
        value: function() {
          var e2 = this;
          $(document).trigger("music-start", this), $(document).trigger("music-update-percent", 100 * this.percent()), this.schedule = setInterval(function() {
            $(document).trigger("music-update-percent", 100 * e2.percent());
          }, 950);
        }
      }, {
        key: "_unschedule_progress_update",
        value: function() {
          var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
          $(document).trigger("music-stop"), clearInterval(this.schedule), false !== e2 && $(document).trigger("music-update-percent", e2);
        }
      }, {
        key: "now",
        value: function() {
          return this.howl.seek();
        }
      }, {
        key: "setTime",
        value: function(e2) {
          var t2 = this, n = /* @__PURE__ */ new Date();
          0 == this.duration() ? this.howl.once("play", function() {
            var r = (/* @__PURE__ */ new Date() - n) / 1e3;
            t2.howl.seek(e2 + r);
          }) : e2 <= this.duration() ? this.howl.seek(e2) : this.howl.stop();
        }
      }, {
        key: "duration",
        value: function() {
          return this.howl.duration();
        }
      }, {
        key: "percent",
        value: function() {
          return this.now() / this.duration();
        }
      }, {
        key: "play",
        value: function() {
          $(document).trigger("music-play", this), Player.nowPlaying = this, this instanceof Howl && this.stopOthers(), this.howl.play(), Player.isPausing = false, visualizerEnabled && visualizer.resume();
        }
      }, {
        key: "stopOthers",
        value: function() {
          var e2 = this;
          Player.playList.forEach(function(t2) {
            t2 !== e2 && null != t2 && null != t2.howl && t2.stop();
          });
        }
      }, {
        key: "pause",
        value: function() {
          this.howl.pause(), visualizerEnabled && visualizer.pause(), Player.isPausing = true;
        }
      }, {
        key: "stop",
        value: function() {
          Player.isPausing = true, this.howl.stop();
        }
      }, {
        key: "unload",
        value: function() {
          clearInterval(this.schedule), this.howl.unload();
        }
      }, {
        key: "previewOnly",
        get: function() {
          return "apple_music" == this.music.source && this.howl.previewOnly;
        }
      }, {
        key: "time",
        get: function() {
          return this.now();
        }
      }, {
        key: "music_object",
        get: function() {
          return this.music;
        }
      }]), e;
    }();
  })(jQuery, unsafeWindow);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);
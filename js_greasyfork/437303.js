// ==UserScript==
// @name				维基百科自动切到偏好中文
// @version				1.0
// @author				edr1412
// @namespace            https://greasyfork.org/zh-TW/scripts/437303
// @license          MIT
// @match       https://*.m.wikipedia.org/*
// @match				https://zh.wikipedia.org/zh/*
// @match				https://zh.wikipedia.org/zh-cn/*
// @match				https://zh.wikipedia.org/zh-hk/*
// @match				https://zh.wikipedia.org/zh-mo/*
// @match				https://zh.wikipedia.org/zh-tw/*
// @match				https://zh.wikipedia.org/zh-sg/*
// @match				https://zh.wikipedia.org/zh-my/*
// @match				https://zh.wikipedia.org/zh-hans/*
// @match				https://zh.wikipedia.org/zh-hant/*
// @match       https://mzh.moegirl.org.cn/*
// @match       https://zh.moegirl.org.cn/index.php?*
// @match       https://zh.moegirl.org.cn/zh/*
// @match       https://zh.moegirl.org.cn/zh-tw/*
// @match       https://zh.moegirl.org.cn/zh-hk/*
// @match       https://zh.moegirl.org.cn/zh-hans/*
// @match       https://zh.moegirl.org.cn/zh-hant/*
// @match       https://zh.moegirl.org.cn/zh-cn/*
// @icon				https://zh.wikipedia.org/static/favicon/wikipedia.ico
// @description force redirect https://zh.wikipedia.org/zh-??/* to https://zh.wikipedia.org/wiki/* ; force using desktop view instead of mobile; work for zh.moegirl.org.cn too
// @description:zh-cn 强制维基百科使用本机偏好转换
// @description:zh-tw 強制Wikipedia採用本裝置的設定來轉換
// @downloadURL https://update.greasyfork.org/scripts/437303/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E5%88%87%E5%88%B0%E5%81%8F%E5%A5%BD%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/437303/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E5%88%87%E5%88%B0%E5%81%8F%E5%A5%BD%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let replacedUrl = document.URL;
  /* https://en.m.wikipedia.org/wiki/Example.com => https://en.wikipedia.org/w/index.php?title=Example.com&mobileaction=toggle_view_desktop => https://en.wikipedia.org/wiki/Example.com*/
  replacedUrl = replacedUrl.replace(/([^\/]+\/\/[^\.]+\.)m\.(wikipedia\.org\/)wiki\/(.*)/,'$1$2w/index.php?title=$3&mobileaction=toggle_view_desktop');
  /* https://zh.m.wikipedia.org/zh-tw/Example.com => https://zh.wikipedia.org/w/index.php?title=Example.com&variant=zh-tw&mobileaction=toggle_view_desktop => https://zh.wikipedia.org/zh-tw/Example.com*/
  replacedUrl = replacedUrl.replace(/([^\/]+\/\/zh\.)m\.(wikipedia\.org\/)(zh|zh-cn|zh-tw|zh-hk|zh-mo|zh-my|zh-sg|zh-hans|zh-hant)\/(.*)/,'$1$2w/index.php?title=$4&variant=$3&mobileaction=toggle_view_desktop');
  /* https://zh.wikipedia.org/zh-tw/Example.com => https://zh.wikipedia.org/wiki/Example.com */
  replacedUrl = replacedUrl.replace(/([^\/]+\/\/zh\.wikipedia\.org\/)(?:zh|zh-cn|zh-tw|zh-hk|zh-mo|zh-my|zh-sg|zh-hans|zh-hant)\/(.*)/,'$1wiki/$2');
  /* https://mzh.moegirl.org.cn/zh-tw/Galgame => https://zh.moegirl.org.cn/index.php?title=Galgame&variant=zh-tw&mobileaction=toggle_view_desktop */
  replacedUrl = replacedUrl.replace(/([^\/]+\/\/)m(zh\.moegirl\.org\.cn\/)(zh|zh-tw|zh-hk|zh-hans|zh-hant|zh-cn)\/(.*)/,'$1$2index.php?title=$4&variant=$3&mobileaction=toggle_view_desktop');
  /* https://zh.moegirl.org.cn/index.php?title=Galgame&variant=zh-tw&mobileaction=toggle_view_desktop => https://zh.moegirl.org.cn/zh-tw/Galgame */
  replacedUrl = replacedUrl.replace(/([^\/]+\/\/zh\.moegirl\.org\.cn\/)index\.php\?title=([^\&]+)\&variant=(zh|zh-tw|zh-hk|zh-hans|zh-hant|zh-cn)\&mobileaction=toggle_view_desktop/,'$1$3/$2');
  /* https://mzh.moegirl.org.cn/Galgame => https://zh.moegirl.org.cn/index.php?title=Galgame&mobileaction=toggle_view_desktop */
  replacedUrl = replacedUrl.replace(/([^\/]+\/\/)m(zh\.moegirl.org\.cn\/)(.*)/,'$1$2index.php?title=$3&mobileaction=toggle_view_desktop');
  /* https://zh.moegirl.org.cn/index.php?title=Galgame&mobileaction=toggle_view_desktop => https://zh.moegirl.org.cn/Galgame */
  replacedUrl = replacedUrl.replace(/([^\/]+\/\/zh\.moegirl\.org\.cn\/)index\.php\?title=([^\&]+)\&mobileaction=toggle_view_desktop/,'$1$2');
  /* https://zh.moegirl.org.cn/zh-tw/Galgame => https://zh.moegirl.org.cn/Galgame */
  /*replacedUrl = replacedUrl.replace(/([^\/]+\/\/zh\.moegirl\.org\.cn\/)(?:zh\/|zh-tw\/|zh-hk\/|zh-hans\/|zh-hant\/|zh-cn\/)?(.*)/,'$1$2');*/
  /* moegirl.org's default used language is unstable and confusing , so I just commented the line above. */
  if (replacedUrl !== document.URL) {
        window.location = replacedUrl;
    }
})();
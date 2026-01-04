// ==UserScript==
// @name             掘金阅读模式
// @name:zh-CN       掘金阅读模式
// @name:en          Juejin Reading Mode
// @name:zh-TW       掘金閱讀模式
// @version          0.2.7
// @description      去除顶部banner广告，文章内顶部广告广告，去除首页信息流的作者推荐，去除右侧乱七八糟的广告图片展示，去除首页的卖课、活动、会员菜单，去除文章页多余的按钮，只保留点赞、评论、收藏，右下角只保留返回返回顶部的按钮
// @description:zh-CN 去除顶部banner广告，文章内顶部广告广告，去除首页信息流的作者推荐，去除右侧乱七八糟的广告图片展示，去除首页的卖课、活动、会员菜单，去除文章页多余的按钮，只保留点赞、评论、收藏，右下角只保留返回返回顶部的按钮
// @description:en   Hides the top banner ad, ads within articles, author recommendations in the homepage feed, and miscellaneous ad images on the right sidebar. Removes course-selling, event, and membership menu items from the homepage. On article pages, hides superfluous buttons, keeping only like, comment, and favorite. In the bottom-right corner, retains only the 'back to top' button.
// @description:zh-TW 移除頂部橫幅廣告，移除文章內頂部廣告，移除首頁資訊流的作者推薦，移除右側雜七雜八的廣告圖片展示，移除首頁的販售課程、活動、會員選單，移除文章頁多餘的按鈕，僅保留按讚、評論、收藏按鈕，右下角僅保留返回頂部按鈕
// @author       Femoon
// @match        *://*.juejin.cn/*
// @match        *://juejin.cn/*
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADYUlEQVRYhe3XS6ydUxQH8N85t/rIraQeUQZuNOIRCRWTeiWEmqkUCRUG0islKZ24fQRtT71SaUukYdB4RYggHgkzdCJNyoR2ICSS6mWApL3ERd26PQZrfe4+xzm395zEiDX5vm/tvdf6r8f+7/3xX5davwuHGs2W79FGf6b6WpXOZ+NWHMMbONoPiJ5WFFEvwDqsQRNPYxt+prdszHhm4fwcPI4bMZC6SbyFB/F1LyDqMwVQyPW4oXAu35djWa/G+gGwCw/gUKE7lLpdvRrrmqci5bNEox0bbdQqfV1kYpvogXV4v8OcOv6ke0k6agvni9L4J3hVdnoxfkE+v6ic5NgJuANL8AQOdAPxD01h/ArsSCPj2JkRj3UyVqw7CetxLwYT/P3Y02ldtx6o42pcnN/zRSaeE7ughYiK93PxAkbSubRxVTdf05VgLlZiExYWw59hLXaL+ld2looMLS7mfo+H8SKOdCxBgX4+fsdkUcvpDG9JwzDcAejnIhO70SxszsrgxplKyxJBp/dh3lCjWdWqiQ9wC94VhAOn40nRI09he+F8Em/nmo/anM8T7PkmLq0yMCwYbBH+yKi2ZJSltDdXBbDKFB2atZAzsBl3Yo7YGY/VRVOdmpPm4G68YqoBq2yMYWMC+K5wXDn/FqvTyVhbvS9Jm6vSB5yCs+tp9B58Uxi9VpTkJgwUJTmKl3Cb2F6V7E3dy1q5YgA343VcU4A9kIFurg01mmpoRh9sx5WF4TGRzp0YryamnIVHBUtuxEGtcqKo94g4PSv5OHWfVtGW+/hMsW1uF2xWRf0aHhJpLmUwIf3Wph9KcCsKOxOCTTfJEo42aq08kEAGRZ3Xi8arZA9GTNhr9rRMeLnI5GXF8GFsxbP4tVzbjYoHxNG6FecVwwfFjmm5ARX8vyIjHyrWfIkNeE8eVqUc7zBaLHpgaTH3F3ED2oGfUrdAsOMaQWhMccha7GeGh1EHEAtFkw0LBiPI5p2MrCYytdzUJeWIODcewY/dnE8LoA3IXNyVQE4rhvenjQsL3Q/p+Hld+L8nAAWIGq4TJbmoy9R9IuUfSgo+nvRzKT1fpHyZqbNkUjTZBnzFzC+l/V7LT05nq0WzPSNuPod7cd4zgDYg1Y8JQbUT//qPSQcQf0u/v2b/y19HIxicGFbXrAAAAABJRU5ErkJggg==
// @license      MIT
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/384092
// @downloadURL https://update.greasyfork.org/scripts/535094/%E6%8E%98%E9%87%91%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535094/%E6%8E%98%E9%87%91%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        .top-banners-container,
        .main-area.article-area > article > img {
          display: none !important;
        }

        .entry-list .jj-recommend-users {
          display:none !important;
        }

        .article-suspended-panel > .author,
        .article-suspended-panel > span.tooltip,
        .article-suspended-panel > .share-btn,
        .article-suspended-panel > div:nth-last-child(2) {
          display:none !important;
        }

        .sidebar-block.wechat-sidebar-block,
        .wechat-ad,
        #sidebar-container > div:nth-child(2) > div,
        .sticky-block-box > div:nth-last-child(1),
        .sticky-block-box > div:nth-last-child(2)
        {
          display:none !important;
        }

        .main-area.recommended-area.entry-list-container {
          display:none !important;
        }

        .main-nav-list .new-font,
        .main-nav-list .book,
        .main-nav-list .link-item:has(> a[href="/live"]),
        .main-nav-list .link-item:has(> a[href="/events/all"]),
        .main-nav-list .download-icon,
        .main-nav-list .extension-icon,
        .main-nav .vip-entry {
          display:none !important;
        }

        .index-aside > *:not(.signin-tip.signin):not(.hot-list-container) {
          display:none !important;
        }

        .suspension-panel .btn-ai,
        .suspension-panel button[title="建议反馈"],
        .suspension-panel .more-btn {
          display:none !important;
        }

        .view-container .with-global-banner .index-nav-before,
        .view-container .with-global-banner .team-content .list-header.sticky,
        .view-container .with-global-banner .user-view .list-header.sticky,
        .view-container .with-global-banner .view-nav {
          top: 5rem !important;
        }
        .view-container .with-global-banner .hot-side-nav, .view-container .with-global-banner .index-nav, .view-container .with-global-banner .inner-container .home-container .right, .view-container .with-global-banner .inner-container .sidebar {
          top: 80px !important;
        }

        .header-with-banner,
        .view-container .with-global-banner .index-nav-before.top,
        .view-container .with-global-banner .team-content .list-header.sticky.top,
        .view-container .with-global-banner .user-view .list-header.sticky.top,
        .view-container .with-global-banner .view-nav.top {
          top: 0 !important;
        }

        .side > .new-sidebar > *:not(.bg) {
          display:none !important
        }

        .side-navigator-wrap {
          height:auto !important
        }

        .code-block-extension-headerRight .code-tips,
        .code-block-extension-headerRight .render {
          display:none !important
        }
    `;

    GM_addStyle(css);

})();
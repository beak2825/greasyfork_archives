// ==UserScript==
// @name        网页优化修改
// @namespace   Violentmonkey Scripts
// @match       https://www.toutiao.com/*
// @match       https://fanyi.baidu.com/*
// @match       https://www.bimiacg*/bangumi/*
// @match       https://www.mikudm.com/index.php/vod/*
// @match       https://hanime1.me/comic/*
// @match       https://www.twmanga.com/comic/chapter/*
// @match       https://www.kuaikanmanhua.com/webs/comic-next/*
// @match       https://www.colamanga.com/manga-*/*
// @match       https://v.qq.com/*
// @match       https://www.thanju.com/detail/*
// @match       https://greasyfork.org/zh-CN/scripts*
// @match       https://sleazyfork.org/zh-CN/scripts*
// @match       https://www.taobao.com/*
// @match       https://item.jd.com/*
// @match       https://weili.ooopic.com/weili_*
// @match       https://www.yrxitong.com/*
// @match       https://www.cgfxw.com/*
// @match       https://*.chaoxing.com/ananas/modules/work/index.html
// @match       https://*.chaoxing.com/ananas/modules/video/index.html
// @match       https://copilot.microsoft.com/*
// @match       https://laowang.vip/forum.php?mod=viewthread&tid=*
// @match       https://*.justeasy.cn/*
// @match       https://fanqienovel.com/library*
// @version     0.0.85
// @author      YeSilin
// @license     GPL-3.0-or-later
// @icon        data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgdmlld0JveD0iMCAwIDI1NiAyNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTIyOSA5NC41NmMxOC0zMS0xMC43Ni01Ni40Mi0xNC42OS01NS40NC0zLjE5Ljc5IDkuMjUgMzMuMjktMTMgMjguMjEtNTIuNDctMTEuOTktMTA4LjU4LTYuNzYtMTQ0LjUtMS4zMy0yNi4xMiA1LjI2LTEwLjI5LTI2LTEzLjA3LTI3LjkzLTQtMS0zNC4xMSAyNC43Ny0xNC4xIDU1LjE4YTIxLjM0IDIxLjM0IDAgMCAxIDMuOTIgMTEuNzVjLTUuMjIgMzgtNi43OSA5MS45MSAyLjM1IDk5Ljc2IDIwLjkgMTcgMTc2LjMzIDEwLjQ3IDE4OS40LTMuOTMgNy44NC02LjU1IDUtNTYuNTYtLjI2LTkzLjIyLS4wNS01LjIgMS41NC04Ljk3IDMuOTUtMTMuMDV6IiBmaWxsPSIjMTkxOTE5Ii8+PHBhdGggZD0ibTExMi40NiAyMjIuOTRjLTI5LjI1IDAtNjkuMzItMS45NC04MS42LTExLjk0bC0uMTYtLjEzYy00LjI3LTMuNjctOS4xOC0xMi05LjM1LTQ0LjYyYTQ2OS4wNyA0NjkuMDcgMCAwIDEgNC4yLTYxLjY4IDEzLjk0IDEzLjk0IDAgMCAwIC0yLjU1LTYuOTJjLTExLjEzLTE2LjkyLTEwLjc4LTM2LjE2IDEtNTIuNzkgMS4xMy0xLjc0IDEyLjE0LTE2Ljg2IDIxLjY0LTE0LjU2YTggOCAwIDAgMSAyLjYxIDEuMTZjNS4yIDMuNTQgMy44OSA5LjU0IDIuNzUgMTQuNzYtLjU1IDIuNTEtMi4yMSAxMC0xLjIgMTIuMTkuNDIuMTMgMS45NS40NyA1LjQ1LS4yM2wuMzctLjA3YzU2LjM1LTguNTQgMTA2LTguMDcgMTQ3LjQ1IDEuNDJhOC43NiA4Ljc2IDAgMCAwIDMuMjEuMjljMS4zLTIuMTkuMjktMTAuMzYgMC0xMy4xLS4yNS0yLjA2LS40Ny0zLjgzLS41MS01LjM5LS4xOS03LjY4IDUtOS41NyA2LjYyLTEwIDguMjUtMiAxNy40NyA5LjIyIDIwLjEgMTIuNzIgNiA3LjkyIDE4LjIgMjkuMSAzLjQ1IDU0LjUtMiAzLjQ1LTIuNzUgNS42OC0yLjgzIDguNTZhNTI3LjQgNTI3LjQgMCAwIDEgNSA1OC4yNGMuNjUgMjkuNDYtMyAzNy40OC03LjIyIDQxLjI3LTMuMjkgMy4zNS0xMC43NiA3LjU2LTM2LjU5IDExLjIyYTU3NS41OCA1NzUuNTggMCAwIDEgLTYwLjQ3IDQuNzRjLTUuNy4yLTEzLjEuMzYtMjEuMzcuMzZ6bS03MS4xOS0yNC4xMmM1LjggNC4wOSAzNCA5LjQgOTAuMSA3Ljg1IDUwLTEuMzggODMuMjEtNy40NCA4OC4xMy0xMS4zMWwuMjUtLjI1YzMuNjctNi41NCAzLjM0LTQ0LjQ5LTIuNjItODYuMzRhOCA4IDAgMCAxIC0uMDgtMS4xMyAzMi41OCAzMi41OCAwIDAgMSAgNS0xNy4xMWM0LjkyLTguNDcgNi4wNi0xNy4xMiAzLjM5LTI1LjdhMzUuNDkgMzUuNDkgMCAwIDAgLTIuNjYtNi4yOGMtLjQ0IDQuOTQtMiA5Ljc1LTUuODMgMTMuMjMtMyAyLjY3LTguMzggNS40MS0xNy40NSAzLjM0LTM5LjQ4LTktODctOS40NC0xNDEuMzEtMS4yMy04LjcyIDEuNzEtMTUuMzkuMjktMTkuODEtNC4yM2ExNy4xNiAxNy4xNiAwIDAgMSAtNC42NS0xMCAzMS45MiAzMS45MiAwIDAgMCAtMS43MyA0LjY1Yy0yLjQgOC4yNC0uOTMgMTYuNSA0LjM2IDI0LjU0YTI5LjI4IDI5LjI4IDAgMCAxIDUuMiAxNi4xNSA4IDggMCAwIDEgLS4wNyAxLjA5IDQ1Ny42MyA0NTcuNjMgMCAwIDAgLTQuMTQgNTguMThjLS4wMyAyNi44IDMuMzQgMzMuNTkgMy45MiAzNC41NXoiIGZpbGw9IiMxOTE5MTkiLz48cGF0aCBkPSJtMjI5IDk0LjU2YzE4LTMxLTEwLjc2LTU2LjQyLTE0LjY5LTU1LjQ0LTMuMTkuNzkgOS4yNSAzMy4yOS0xMyAyOC4yMS01Mi40Ny0xMS45OS0xMDguNTgtNi43Ni0xNDQuNS0xLjMzLTI2LjEyIDUuMjYtMTAuMjktMjYtMTMuMDctMjcuOTMtNC0xLTM0LjExIDI0Ljc3LTE0LjEgNTUuMThhMjEuMzQgMjEuMzQgMCAwIDEgMy45MiAxMS43NWMtNS4yMiAzOC02Ljc5IDkxLjkxIDIuMzUgOTkuNzYgMjAuOSAxNyAxNzYuMzMgMTAuNDcgMTg5LjQtMy45MyA3Ljg0LTYuNTUgNS01Ni41Ni0uMjYtOTMuMjItLjA1LTUuMiAxLjU0LTguOTcgMy45NS0xMy4wNXoiIGZpbGw9IiNlODNhMmEiLz48cGF0aCBkPSJtNjguNTcgMTAwLjg1YzkuMTQgMi42MiAzNi41NyAxNC40IDM5LjE5IDE4LjMzcy0xOC4yOSAyMy41Ny0zMi42NSAxNC40Yy0xNS42OS05LjE3LTE1LjY5LTM1LjM1LTYuNTQtMzIuNzN6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTE4Mi4yIDEzMy41OGMtMTUuNjcgOS4xNi0zNS4yNy0xMC40Ny0zMi42NS0xNC40czMwLTE1LjcxIDM5LjE5LTE4LjMzIDkuMTQgMjMuNTYtNi41NCAzMi43M3oiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMTI3LjM0IDE4MC43MWMtNDUuNzIgMC02Ny45Mi0yNC44Ny02NC0zMS40MnMzNS4yNyAxMy4wOSA2NS4zMSAxMy4wOSA2Mi43LTE3IDY1LjMxLTEwLjQ3YzIuNjEgNS4yMy0yMC45IDI4LjgtNjYuNjIgMjguOHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @description 对部分网页进行广告屏蔽与布局优化并使兼容 DarkReader 深色主题
// @downloadURL https://update.greasyfork.org/scripts/488505/%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/488505/%E7%BD%91%E9%A1%B5%E4%BC%98%E5%8C%96%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_registerMenuCommand("视频小窗口播放", () => {
    // 先暂停当前视频
    const video = document.querySelector("video");
    if (video) {
      video.pause();
    }

    // 然后新建 popup 小窗口
    open(document.URL, "", "popup, location=no");
  });

  GM_registerMenuCommand("谷歌搜索此网站", () => {
    const url = `https://www.google.com/search?q=site%3A${window.location.host}`;
    // 然后新标签打开
    open(url, "");
  });

  GM_registerMenuCommand("搜索此网站脚本", () => {
    let host = window.location.host.toLowerCase();
    host = host.replace(/^www\./, "");
    const url = `https://greasyfork.org/zh-CN/scripts?filter_locale=0&q=${host}`;
    // 然后新标签打开
    open(url, "");
  });

  // 今日头条优化
  if (window.location.host === "www.toutiao.com") {
    let css = `
        /* 屏蔽今日头条置顶文章 */
        .feed-card-wrapper.feed-card-article-wrapper.sticky-cell{
            display: none;
        }
        
        /* 优化页眉为毛玻璃效果 */
        .search-wrapper.red .search input{
            background: rgb(235, 235, 235);
            border: 0px;
        }
        .home-container .fix-header>div {
            background: unset;
        }
        .home-container.new-style .fix-header {
            border-bottom: 1px solid rgba(0,0,0,.05);
            background: rgba(245, 245, 245, .80);
            backdrop-filter: blur(10px);
        }
        `;
    GM_addStyle(css);

    // 修复今日头条个人主页兼容 DarkReader
    if (window.location.pathname.indexOf("/c/user/token/") > -1) {
      // 删掉默认的白色背景
      // document.getElementsByClassName('profile-container')[0].style.background = "none";
      document.querySelector(".profile-container").style.background = "none";
      // 修改搜索框的背景颜色，即使改了也会被 DarkReader 修改成其他值以符合他的主题
      document.querySelector(".search>input").style.backgroundColor = "#eee";
    }
    return;
  }

  // 百度翻译优化
  if (window.location.host === "fanyi.baidu.com") {
    const css = `
/* 清除全部最小宽度限制，但排除右侧机器人小图标 */
*:not(.qphmPPyw *) {
  min-width: 0 !important;
}

/* 屏蔽底部广告 */
.Hu5qsRSB {
  display: none !important;
}

/* 屏蔽输入框内多余文档翻译入口 */
.rfhEM3lg.bxgG6w8l {
  display: none !important;
}

/* 屏蔽多余的左边距 */
.L0kERzJV {
  padding: 0 0 0 0 !important;
}

/* 屏蔽多余的下边距 */
.Hu5qsRSB+div {
  display: none !important;
}
.qphmPPyw {
  height: 100% !important;
}

/* 屏蔽多余的右边距 */
.qphmPPyw {
  right: 0 !important;
  margin-left: 1px !important;
}

/* 屏蔽导航栏广告 */
.MMqloUXF>div:nth-child(1),
.MMqloUXF>div:nth-child(5),
.ZqJhu4sT,
.UzOvH9bK,
.operation-pos-new {
  display: none !important;
}

/* 导航栏布局优化 */
.lTKZuXrx:after {
  margin-right: 0 !important;
}

`;
    GM_addStyle(css);
    return;
  }

  // 哔咪动漫优化
  if (window.location.host.indexOf(".bimiacg") > -1) {
    // 显示完整的剧情介绍
    if (window.location.pathname.indexOf("/bangumi/bi/") > -1) {
      let synopsis = document.querySelector("#synopsis_txt+p");
      let jianjie = document.querySelector(".vod-jianjie>p");
      if (synopsis.innerText != jianjie.innerText) {
        synopsis.innerText = jianjie.innerText;
      }
      return;
    }

    let css = `
        /* 屏蔽移动字幕广告 */
        body > section > div.main > marquee{
            display: none !important;
        }`;
    GM_addStyle(css);

    // 自动跳过推荐下载安卓客户端
    // document.querySelector("#video>div>div>p>a").click()
    $("#bkcl").remove();

    return;
  }

  // 异世界动漫优化
  if (window.location.host === "www.mikudm.com") {
    let css = `
        /* 屏蔽二维码广告 */
        a[href="https://www.mikudm.com/index.php/vod/detail/id/2187.html"] {
            display: none !important;
        }`;
    GM_addStyle(css);

    // 详情页
    if (location.pathname.indexOf("/index.php/vod/detail/id/") > -1) {
      let css = `
            /* 屏蔽保存到浏览器 */
            .text_muted.pull_right.hidden_xs {
                display: none !important;
            }
            /* 屏蔽分享按钮 */
            .playbtn.o_share.hidden_xs {
                display: none !important;
            }
            /* 屏蔽支援网站 */
            li[title="支援网站"] {
                display: none !important;
            }`;
      GM_addStyle(css);

      // 优化简介直接显示完整的剧情介绍
      document.querySelector(".desc.hidden_xs").innerHTML =
        '<span class="left text_muted">简介：</span>' +
        document.querySelector(".content_desc.full_text.clearfix > span").innerText;
      return;
    }
    // 播放页
    if (location.pathname.indexOf("/index.php/vod/play/id/") > -1) {
      return;
    }
    return;
  }

  // Hanime1 优化
  if (window.location.href.indexOf("https://hanime1.me/comic/") > -1) {
    let css = `
        /*删除漫画广告*/
        .comics-banner-ads {
            display: none !important;
        }
        
        /*漫画显示原始大小*/
        #current-page-image {
            max-height: 100%;
        }`;
    GM_addStyle(css);
    return;
  }

  // 包子漫画优化
  if (window.location.href.indexOf("https://www.twmanga.com/comic/chapter/") > -1) {
    // 监听方向盘上下两键增加滚动距离
    document.addEventListener("keydown", function (event) {
      // 浏览器内部界面的高度
      const innerHeight = window.innerHeight;
      if (event.key == "ArrowDown") {
        event.preventDefault();
        scrollBy({
          top: innerHeight / 2,
          left: 0,
          behavior: "smooth",
        });
      } else if (event.key == "ArrowUp") {
        event.preventDefault();
        window.scrollBy({
          top: -(innerHeight / 2),
          left: 0,
          behavior: "smooth",
        });
      } else {
        return;
      }
    });
    return;
  }

  // 快看漫画优化
  if (window.location.host === "www.kuaikanmanhua.com") {
    const css = `
      .comic-next {
          min-width: 500px !important;
      }
      .comic-next .contentBox {
          width: 100% !important;
      }
      .comic-next .contentBox .comicDetails .imgList {
        width: 100% !important;
        /* 预测原图最大宽度 */
        max-width: 1280px !important;
      } `;
    GM_addStyle(css);
    return;
  }

  // ColaManga 漫画优化
  if (window.location.host === "www.colamanga.com") {
    const css = `
    body {
      /* 去掉右侧多余的右填充 */
      overflow-y: initial;
    }
    .mh_wrap {
      /* 去掉最小宽度限制 */
      min-width: initial;
    }`;
    GM_addStyle(css);
    return;
  }

  // 腾讯视频优化
  if (window.location.host === "v.qq.com") {
    let css = `
        /* 屏蔽左侧栏 NBA */
        a[href="/channel/nba"] {
            display: none !important;
        }
        /* 屏蔽左侧栏体育 */
        a[href="/channel/sports_new"] {
            display: none !important;
        }
        /* 屏蔽左侧栏游戏中心 */
        a[href="https://iwan.video.qq.com/game-community/game-center/home?ztid=km53eytfwg&iwankey=iwan_pc_channel-10029421_rpk"] {
            display: none !important;
        }
        /* 屏蔽左侧栏游戏 */
        a[href="/channel/game_new"] {
            display: none !important;
        }
        /* 屏蔽左侧栏传奇游戏库 */
        a[href="https://iwan.video.qq.com/game-community/game-center/home?ztid=p7hq7qfq2m&iwankey=iwan_pc_channel-10086082_rpk"] {
            display: none !important;
        }
        /* 屏蔽左侧栏 F1 */
        a[href="https://v.qq.com/s/topic/v_sports/render/uX0ceyb1.html"] {
            display: none !important;
        }
        /* 屏蔽左侧栏艺术 */
        a[href="/channel/art"] {
            display: none !important;
        }
        /* 屏蔽左侧栏财经 */
        a[href="/channel/finance"] {
            display: none !important;
        }
        /* 屏蔽左侧栏棋牌游戏库 */
        a[href="https://iwan.video.qq.com/game-community/game-center/home?ztid=r9b76oy3p4&iwankey=iwan_channel-10357146_rpk"] {
            display: none !important;
        }
        `;
    GM_addStyle(css);
    return;
  }

  // 看韩剧优化
  if (window.location.href.indexOf("https://www.thanju.com/detail/") > -1) {
    // 优化简介直接显示完整的剧情介绍
    document.querySelector(".desc.hidden-xs").innerHTML =
      `\<span class="left text-muted">简介：</span>` +
      document.querySelector(".sketch.content").innerText.replace("剧情：", "");
    return;
  }

  // GreasyFork 优化
  if (
    document.URL.indexOf("https://greasyfork.org/zh-CN/scripts") > -1 ||
    document.URL.indexOf("https://sleazyfork.org/zh-CN/scripts") > -1
  ) {
    // 优化脚本列表中链接以新标签方式打开
    document.querySelectorAll("#browse-script-list > li > article > h2 > a").forEach((element) => {
      element.target = "_blank";
    });
    document
      .querySelectorAll("#browse-script-list > li > article > div > dl > dd.script-list-author > span > a")
      .forEach((element) => {
        element.target = "_blank";
      });
    return;
  }

  // 淘宝优化
  if (window.location.host === "www.taobao.com") {
    let css = `
        /* 优化首页背景兼容 DarkReader */
        body {
            background-image: none !important;
        }`;
    GM_addStyle(css);
    return;
  }

  // 京东优化
  if (location.href.indexOf("https://item.jd.com/") > -1) {
    let css = `
      /* 优化商品评价关闭按钮 兼容 DarkReader */
      ._rateListBox_1ygkr_1 ._title_1ygkr_22 ._closeIcon_1ygkr_39 {
        width: 20px !important;
        height: 20px !important;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSIjZmYwZjIzIj48bGluZSB4MT0iMyIgeTE9IjMiIHgyPSIxNyIgeTI9IjE3IiBzdHJva2U9IiNmZjBmMjMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjE3IiB5MT0iMyIgeDI9IjMiIHkyPSIxNyIgc3Ryb2tlPSIjZmYwZjIzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==") !important;
      }`;
    GM_addStyle(css);
    return;
  }

  // 我图网优化
  if (location.href.indexOf("https://weili.ooopic.com/weili_") > -1) {
    let css = `
        /* 屏蔽详情页广告 */
        .wt-activeTopBanner {
            display: none !important;
        }
        div.wt-detailsHd > div.wt-detailsRight.v1 {
            display: none !important;
        }
        
        div.wt-detailsPack-hd > div.wt-pk-titWrap {
          display: none !important;
        }

        /* 屏蔽剪切蒙版字体兼容 DarkReader */
        .wt-detailsPack-hd .wt-pk-colList .wt-pk-colItem.on .wt-pk-price b{
            color: var(--red-color) !important;
            background :  unset !important;
            -webkit-background-clip:  unset !important;
            -webkit-text-fill-color: unset !important;
        }
        .wt-detailsPack-hd .wt-pk-colList .wt-pk-price b{
            background :  unset !important;
            -webkit-background-clip:  unset !important;
            -webkit-text-fill-color: unset !important;
        }
         `;
    GM_addStyle(css);
    return;
  }

  // 小鱼儿系统优化
  if (window.location.host === "www.yrxitong.com") {
    let css = `
        /* 屏蔽详情页广告 */
        #web {
            background: none !important;
        }
        `;
    GM_addStyle(css);
    return;
  }

  // CG分享网优化 width: 120px; font-size: 16px;
  if (window.location.host === "www.cgfxw.com") {
    const css = `
      #btn-search{
        height: 28px;
        border: 0;
        margin-left: 10px;
        border-radius: 3px;
        color: #fff;
        background-color: #429296;
        /* 修改鼠标指针样式 */
        cursor: pointer;
      }
      `;
    GM_addStyle(css);
    // 加一个谷歌搜索按钮
    const newButton = `<td><button id='btn-search' >用谷歌搜索</button></td>`;
    document
      .querySelector("#scbar_form > table > tbody > tr > td.scbar_btn_td")
      .insertAdjacentHTML("afterend", newButton);

    // 监听点击事件
    document.querySelector("#btn-search").addEventListener("click", (event) => {
      event.preventDefault();
      // console.log('按钮被点击了，但不会提交表单');
      // 在这里添加你的自定义逻辑

      const url = `https://www.google.com/search?q=site%3Awww.cgfxw.com+${document.querySelector("#scbar_txt").value}`;
      // 然后新标签打开
      open(url, "");
    });

    return;
  }

  // 超星泛雅优化
  if (window.location.host === "mooc1.chaoxing.com") {
    setTimeout(
      () =>
        document.querySelectorAll("video").forEach((video) => {
          // 清空暂停视频函数
          video.pause = () => {};
        }),
      3000
    );
    return;
  }

  // Microsoft Copilot 优化
  if (window.location.host === "copilot.microsoft.com") {
    const css = `
    /* 修改对话框的宽度，默认 46.5rem  */
    .max-w-chat {
      max-width: min(100%,55rem) !important;
    }
    
    /* 修改输入框的宽度 */
    .w-expanded-composer {
      width: min(calc(100vw - 1.5rem),55rem) !important;
    }  
    `;
    GM_addStyle(css);

    // 移除所有的复制事件
    document.addEventListener(
      "copy",
      function (event) {
        event.stopPropagation();
      },
      true
    );

    // // 可选：移除所有的上下文菜单事件
    // document.addEventListener(
    //   "contextmenu",
    //   function (event) {
    //     event.stopPropagation();
    //   },
    //   true
    // );
    // // 可选：移除所有的选择事件
    // document.addEventListener(
    //   "selectstart",
    //   function (event) {
    //     event.stopPropagation();
    //   },
    //   true
    // );
    // // 可选：移除所有的剪切事件
    // document.addEventListener(
    //   "cut",
    //   function (event) {
    //     event.stopPropagation();
    //   },
    //   true
    // );
    // // 可选：移除所有的粘贴事件
    // document.addEventListener(
    //   "paste",
    //   function (event) {
    //     event.stopPropagation();
    //   },
    //   true
    // );
    // // 可选：移除所有可能的 oncontextmenu 属性
    // document.querySelectorAll("*").forEach(function (element) {
    //   element.oncontextmenu = null;
    // });

    return;
  }

  // 老王论坛优化
  if (location.href.indexOf("https://laowang.vip/forum.php?mod=viewthread&tid=") > -1) {
    const css = `
    .pcb .jammer {
      display: none;
    }
    `;
    GM_addStyle(css);
    return;
  }

  // 建E网优化
  if (window.location.host.indexOf(".justeasy.cn") > -1) {
    const css = `
    /* 以便兼容 DarkReader */
    body {
      background: none !important;
    }

    /* 屏蔽搜索框广告 */
    .HeaderNav_activityIconEntry__0_BDK {
      display: none !important;
    }
    `;
    GM_addStyle(css);
    return;
  }

  // 番茄小说优化
  if (location.href.indexOf("https://fanqienovel.com/library") > -1) {
    const css = `
    /* 强制显示完整书名 */
    .book-item-text .book-item-title {
      overflow: visible !important;
      font-size: 17px !important;
    }
    `;
    GM_addStyle(css);
    return;
  }
})();

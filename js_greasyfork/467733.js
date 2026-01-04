// ==UserScript==
// @name         JAVBUS助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  JAVBUS网站增加自动翻页，论坛页面精简
// @author       A9
// @match        https://www.javbus.com/
// @include      /^https?:\/\/(?:[A-Za-z0-9]+\.)*(?:javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)(?:\.[A-Za-z0-9]+)(?:[\S]*)$/
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABFElEQVQ4ja2TMU4CQRSGvzfuKkQ2bqORRpKNV6CjIaGgovQK1LRs7R24AoECbrAHWE7glhQkJO4SEgt1GQsCBhmG1fjKee//8v/zZiSGJ+AZeOR3lQChxPDyB/EeIjFo28SuKSf6jk0sjoPXaHDh+6yjiDzLjmaUDaDKZe77fR4GAy5rNaNVK2DnQlwXEXOIs4Bz9f8AU85TG4CfW1AKv93mul7ndTjkfT4HETSgN5sCAK256XS47XZRlQrrKOIqCMjTlDxNjU7UoV6TTSZ8Lpfc9XoEoxFutUo6HvOxWBgdHL1EcRy8ZhOv1UKVSrzNZmTTKflqVQwA2wOBbX6trZeo2P6qQ+p3JqsYSBQQmiAFKgHCL3I+UIXeDJynAAAAAElFTkSuQmCC
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467733/JAVBUS%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/467733/JAVBUS%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //脚本设置项
  let settings = {
    enable_forum_style_override: 1, // 是否开启论坛排版样式优化，0 关闭；1 开启。开启后页面间距更紧凑，可使浏览更加高效
    enable_forum_auto_pager: 1, // 是否开启论坛自动翻页功能，0 关闭；1 开启
    enable_main_auto_pager: 1, // 是否开启主站自动翻页功能，0 关闭；1 开启
    enable_hide_sign_image: 0, // 是否开启隐藏签名图
    enable_debug_mode: 0,
  };

  /**
   * 当前页面的浏览模式 forumdisplay 板块列表页 ｜ viewthread 帖子详情页 | default 默认适用于其他所有页面 ｜ actresses 演员页 | favorite 收藏页（论坛） ｜ forum 论坛搜索结果 | thread 个人主题/回复页 ｜ guide 新帖导读页 ｜ friend 好友页 | notice 我的通知
   * @type { "forumdisplay" | "viewthread" | "default" | "actresses" | "favorite" | "forum" | "thread" | "guide" | "friend" | "notice"}
   */
  let PAGE_MOD = "default";
  let CURRENT_SETTING = null; //当前页翻页规则
  let isForum = false; //当前页是否是论坛页面
  let authorLink = null; //楼主个人空间链接（用于判断用户是否为楼主）
  let loadedURLSet = null; //已加载过的页面URL（防止重复加载）
  const PAGE_SETTINGS = {
    default: {
      listDomSelector: "#waterfall.masonry",
      itemDomSelector: "#waterfall > .item:has(.movie-box)",
      pagerDomSelector: ".pagination.pagination-lg",
      nextPageDomSelector: "#next",
      nodeAfterAddCall: () => {
        //重新计算瀑布流的布局
        jQuery("#waterfall").masonry("reload");
      },
    },
    actresses: {
      listDomSelector: "#waterfall.masonry",
      itemDomSelector: "#waterfall > .item:has(.avatar-box)",
      pagerDomSelector: ".pagination.pagination-lg",
      nextPageDomSelector: "#next",
      nodeAfterAddCall: () => {
        //重新计算瀑布流的布局
        jQuery("#waterfall").masonry("reload");
      },
    },
    viewthread: {
      listDomSelector: "#postlist",
      itemDomSelector: "#postlist > .nthread_postbox:not(.nthread_firstpostbox)",
      pagerDomSelector: ".mn > .pgs.mtm.mbm.cl > .pg",
      nextPageDomSelector: ".nxt",
      nodeBeforeAddCall: (node) => {
        node.querySelector(".imicn a[title='查看個人網站']")?.remove(); //删除多余的元素
        node.querySelector(".showmenu").style.display = "none"; //隐藏‘使用道具’菜单
        //标记楼主
        markAuthor(node);
        //删除签名图
        if (settings.enable_hide_sign_image) {
          removeSignImage(node);
        }
        //移动‘举报’按钮
        moveReportButton(node);
      },
    },
    forumdisplay: {
      listDomSelector: "#threadlisttableid",
      itemDomSelector: "#threadlisttableid > tbody",
      pagerDomSelector: "#fd_page_bottom > .pg",
      nextPageDomSelector: ".nxt",
    },
    forum: {
      listDomSelector: "#threadlist ul",
      itemDomSelector: "#threadlist ul > li",
      pagerDomSelector: "div.pgs.cl.mbm > .pg",
      nextPageDomSelector: ".nxt",
    },
    guide: {
      listDomSelector: "#threadlist table",
      itemDomSelector: "#threadlist table > tbody",
      pagerDomSelector: ".pg:has(.nxt)",
      nextPageDomSelector: ".nxt",
    },
    favorite: {
      listDomSelector: "#favorite_ul",
      itemDomSelector: "#favorite_ul > li",
      pagerDomSelector: "div.pgs.cl.mtm > .pg",
      nextPageDomSelector: ".nxt",
    },
    thread: {
      listDomSelector: ".tl table tbody",
      itemDomSelector: ".tl table tbody > tr:not(.th)",
      pagerDomSelector: "div.pgs.cl.mtm > .pg",
      nextPageDomSelector: ".nxt",
    },
    friend: {
      listDomSelector: "ul.buddy.cl",
      itemDomSelector: "ul.buddy.cl > li",
      pagerDomSelector: "div.mtm.pgs.cl > .pg",
      nextPageDomSelector: ".nxt",
    },
    notice: {
      listDomSelector: "div.nts",
      itemDomSelector: "div.nts > dl",
      pagerDomSelector: "div.pgs.cl > .pg",
      nextPageDomSelector: ".nxt",
    },
  };

  //脚本入口点，排除frame或iframe
  if (window !== window.top) return;

  initialized();
  overrideForumStyle();
  autoPager();

  function initialized() {
    let url = new URL(window.location.href);
    //根据 url 中的 mod 参数来判断当前页面类型
    let mod = url.searchParams.get("mod");
    if (mod) {
      isForum = true;
      //论坛中的二级页面
      let doType = url.searchParams.get("do");
      if (doType) {
        PAGE_MOD = doType;
      } else {
        PAGE_MOD = mod;
      }
    } else if (
      url.pathname.includes("actresses") ||
      url.pathname.includes("searchstar")
    ) {
      PAGE_MOD = "actresses";
    }
    //根据不同的页面，使用不同的翻页规则
    CURRENT_SETTING = PAGE_SETTINGS[PAGE_MOD];

    //帖子查看模式
    if (PAGE_MOD === "viewthread") {
      //读取楼主个人空间链接
      authorLink = document.querySelector(".authi.mb5 .au")?.href;
    }

    //将当前页面添加到已加载过的页面集合中
    loadedURLSet = new Set([window.location.href]);
  }

  function autoPager() {
    if (!CURRENT_SETTING) return;

    //翻页dom
    const obTarget = document.querySelector(CURRENT_SETTING.pagerDomSelector);
    //当前页面只有一页或已经是最后一页，无需翻页
    if (!obTarget || !obTarget.querySelector(CURRENT_SETTING.nextPageDomSelector)) {
      log("当前页面只有一页或已经是最后一页，无需翻页");
      return;
    }

    //观察器配置
    const observerOptions = {
      root: null,
      rootMargin: "0px",
    };
    //观察器回调
    const intersectionCallback = function (entries) {
      if (entries[0].intersectionRatio <= 0) return;
      //下一页的链接
      let nextPageLink = obTarget.querySelector(
        CURRENT_SETTING.nextPageDomSelector
      )?.href;
      //到尾页，停止观察器
      if (!nextPageLink) {
        autoPagerOB.disconnect();
        log("停止观察器");
      } else {
        //加载下一页的内容
        loadNextPage(nextPageLink);
      }
    };
    //创建交叉观察器
    let autoPagerOB = new IntersectionObserver(intersectionCallback, observerOptions);

    //在顶部导航栏的右侧增加控制按钮
    let navBar = document.querySelector(isForum ? "#toptb" : "#navbar");
    let toggleAutoPager = document.createElement("a");
    toggleAutoPager.href = "javascript:void(0)";
    toggleAutoPager.innerText = `${
      settings.enable_main_auto_pager ? "关闭" : "开启"
    }自动翻页`;
    toggleAutoPager.className = "nav navbar-nav navbar-right";
    toggleAutoPager.style.cssText = `
      display: block;
      padding: ${isForum ? "11" : "15"}px;
      color: rgb(119, 119, 119);
      float: right;
      font-size: 14px;
    `;

    toggleAutoPager.addEventListener("click", () => {
      if (settings.enable_main_auto_pager) {
        autoPagerOB?.unobserve(obTarget); //停止观察
        settings.enable_main_auto_pager = 0;
      } else {
        autoPagerOB?.observe(obTarget); //继续观察
        settings.enable_main_auto_pager = 1;
      }
      toggleAutoPager.innerText = `${
        settings.enable_main_auto_pager ? "关闭" : "开启"
      }自动翻页`;
    });
    navBar?.append(toggleAutoPager);
    if (
      (settings.enable_main_auto_pager && !isForum) ||
      (settings.enable_forum_auto_pager && isForum)
    )
      autoPagerOB.observe(obTarget);
  }

  function loadNextPage(nextPageURL, retryTime = 2, isRetry = false) {
    log(
      "nextPageURL:" +
        nextPageURL +
        "\t此次是否为重试请求：" +
        isRetry +
        "\t重试次数: " +
        retryTime
    );
    //忽略掉已加载过的页面地址，和当前正在加载的URL
    if (loadedURLSet.has(nextPageURL) && isRetry === false) {
      log("已加载过此页面的数据或正在加载此页面的数据，忽略本次请求");
      return;
    }
    if (isRetry === false) {
      //将第一次发起的请求页面添加到已访问页面集合中（非重试请求）
      loadedURLSet.add(nextPageURL);
    }
    fetch(nextPageURL)
      .then((resp) => {
        if (resp.redirected) {
          //服务器有一定概率会在访问时出现重定向
          log("请求被重定向\r\n目标链接: " + nextPageURL + "\r\n重定向地址: " + resp.url);
          if (loadedURLSet.has(resp.url) && retryTime > 0) {
            //重试
            return loadNextPage(nextPageURL, --retryTime, true);
          }
        }
        return resp.text();
      })
      .then((text) => {
        if (!text) return;
        let nextPageDocument = convertTextToDOM(text);
        log(
          "title:" + nextPageDocument?.head.getElementsByTagName("title")[0]?.innerText
        );
        const comments = nextPageDocument.querySelectorAll(
          CURRENT_SETTING.itemDomSelector
        );
        //追加内容之前对每个item的预处理回调
        if (CURRENT_SETTING.nodeBeforeAddCall) {
          comments.forEach(CURRENT_SETTING.nodeBeforeAddCall);
        }
        let postlist = document.querySelector(CURRENT_SETTING.listDomSelector);
        //用新页面的分页DOM元素来替换上一页的分页DOM
        document.querySelector(CURRENT_SETTING.pagerDomSelector).innerHTML =
          nextPageDocument.querySelector(CURRENT_SETTING.pagerDomSelector).innerHTML;
        postlist?.append(...Array.from(comments));
        //追加内容之后的处理回调
        if (CURRENT_SETTING.nodeAfterAddCall) {
          CURRENT_SETTING.nodeAfterAddCall.call();
        }
      })
      .catch((e) => {
        log("加载内容出错");
        //从集合中删除请求地址
        loadedURLSet.delete(nextPageURL);
        return;
      });
  }

  function convertTextToDOM(text) {
    const parser = new DOMParser();
    return parser.parseFromString(text, "text/html");
  }

  /**
   * 标记楼主
   * @param {HTMLElement} node 回复消息元素
   */
  function markAuthor(node) {
    const authorDom = node.querySelector(".authi .xw1");
    //如果与作者的个人空间链接相同，则说明当前回复内容是由楼主发布的
    if (authorDom?.href === authorLink) {
      authorDom.insertAdjacentElement("afterend", _createOPTag());
    }
    //点评区域的内容也同样进行楼主标记
    node.querySelectorAll(".pstl.xs1.cl a:is(.xi2.xw1)").forEach((commentAuthorDom) => {
      if (commentAuthorDom?.href === authorLink) {
        commentAuthorDom.insertAdjacentElement(
          "afterend",
          _createOPTag("margin:0 0 0 4px")
        );
      }
    });
    //创建一个标识楼主的Tag元素
    function _createOPTag(tagStyle = "") {
      //楼主标识元素，用于在帖子中显示楼主
      let authorTagDOM = document.createElement("span");
      authorTagDOM.style.cssText = `
        color: #55b624;
        border: 1px solid #55b624;
        padding: 1px 3px;
        border-radius: 2px;
        margin: 0 6px;
      `;
      if (tagStyle) {
        authorTagDOM.style.cssText += tagStyle;
      }
      authorTagDOM.textContent = "楼主";
      return authorTagDOM;
    }
  }

  /**
   * 在新位置添加举报按钮，并将原始位置的容器元素隐藏，从而使页面布局更加紧凑
   * @param {HTMLElement} node 回复消息元素
   */
  function moveReportButton(node) {
    //如果当前回复没有‘点评’和‘回复’按钮，也没有‘管理’按钮；则表明帖子已经被归档，无法修改，此时可以移动举报按钮到右上角来节省空间
    if (
      node.querySelector(".fastre") ||
      node.querySelector(".cmmnt") ||
      node.querySelector(".po.hin")?.innerText.includes("管理")
    )
      return;
    //移动‘举报’按钮的位置
    const report = node.querySelector("td.plc p > a:nth-child(2)");
    if (report?.innerText === "舉報") {
      report.style.marginTop = "-2px";
      report.style.color = "#ccc";
      node.querySelector("td.plc > div.pi strong")?.appendChild(report);
      node.querySelector(".po.hin")?.style.setProperty("display", "none");
    }
  }

  /**
   * 删除签名图
   * @param {HTMLElement} node 回复消息元素
   */
  function removeSignImage(node) {
    node.querySelector(".sign")?.remove();
  }

  function overrideForumStyle() {
    //只对论坛页面生效
    if (!isForum) return;

    if (PAGE_MOD === "viewthread") {
      //将上传图片和发表评论组合到一起
      //#Form1.parentElement 表示的是上传图片附件的DOM元素
      let f_pst = document.querySelector("#f_pst");
      f_pst?.append(document.querySelector("#Form1").parentElement);
      let firstPost = document.querySelector(".nthread_firstpost"); //#1楼的帖子
      //将回复帖子的Form移动到1楼下面
      firstPost?.insertAdjacentElement("afterend", f_pst);

      //增加一个快速定位回复框的按钮
      let goReply = document.createElement("a");
      goReply.id = "goReply";
      goReply.href = "javascript:void(0)";
      goReply.addEventListener("click", () => {
        f_pst.scrollIntoView();
      });
      goReply.style.cssText = `
        display: block;
        position: fixed;
        bottom: 370px;
        width: 50px;
        height: 50px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAD1BMVEUAAADvSETxSETySEPxSEOfb+sGAAAABHRSTlMAQIC/o1TdDAAAAGJJREFUeNrty4EGgEAQBuFp/3v/Zw4r54rVL6LuBgx8tDsFvQW+DiLT8BUgi+EfgdypQd0CPwKKou0KRN0ZCA8IDwgPiKNodQmEB4QHhAl4D9TJBcgFhAW6wBW4AlfgClyxA0shFWNNOTW7AAAAAElFTkSuQmCC) no-repeat 50% 50%;
        background-color: #fff;
        background-size: 28px 28px;
      `;
      document.querySelector(".biaoqi-fix-area").appendChild(goReply);

      //遍历第一页的所有帖子消息
      const nodes = document.querySelectorAll("#postlist > .nthread_postbox");
      for (const node of nodes) {
        if (settings.enable_hide_sign_image) {
          //删除签名图
          removeSignImage(node);
        }
        //标记楼主
        markAuthor(node);
        //移动‘举报’按钮
        moveReportButton(node);
      }
    }

    let styleRules = `
      #goReply:hover{background-blend-mode: screen;background-color: #F14843 !important;}
      #toptb{position: sticky; top: 0; z-index: 99;}
    `;

    if (settings.enable_forum_style_override) {
      styleRules += `
        .psth {margin:1em 0 1em 0px}
        .pls .avatar img { border-radius:50%; height: 50px; }
        tr .plm { padding-top: 10px !important }        
        .hin .pob { padding-bottom: 4px; padding-top: 4px;}
        .nthread_postbox .pi strong a { margin-top: -6px; }
        .t_fsz { min-height: auto; }
        .pct { padding-bottom: 0em; }
        #postlist .ad .pls, #postlist .ad .plc { display: none; }
        .pcb .cm .psth { margin-top: 0px; }
        .pcb .cm .psth { margin-bottom: 10px; }
        .t_f, .t_f td { line-height: 1.6; }
        .pcb .psth { font-size: 14px !important; font-weight: 500; }
        #p_btn { padding:0 0 10px 0; }
        .jav-footer { display: none; }        
        #postlist { padding: 0 20px 0px 20px; }
        a[rel="nofollow"]{display:none;}        
        .ct2 .mn {margin-bottom: 0;}
        .authi em { color:#ccc; }
        .pob { line-height: 32px; }
      `;
    }
    GM_addStyle(styleRules);
  }

  function log(msg) {
    if (settings.enable_debug_mode == true) {
      if (typeof msg === "object") {
        console.dir(msg);
      } else {
        console.log(msg);
      }
    }
  }
})();

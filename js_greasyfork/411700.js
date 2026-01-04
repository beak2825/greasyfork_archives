// ==UserScript==
// @name         zijiyong
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  zijiyong+
// @author       zkytech
// @grant        none
// @include         *://m.baidu.com/*
// @include         *://3g.baidu.com/*
// @include         *://tieba.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/411700/zijiyong.user.js
// @updateURL https://update.greasyfork.org/scripts/411700/zijiyong.meta.js
// ==/UserScript==

(function() {
  /* 防抖函数 */
  const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  };

  let target = -1;
  if (
    window.location.href.indexOf("m.baidu.com") !== -1 ||
    window.location.href.indexOf("3g.baidu.com") !== -1
  ) {
    target = 0; /* 百度 */
  }
  if (window.location.href.indexOf("tieba.baidu.com") !== -1) {
    target = 1; /* 贴吧 */
  }
  const mo_device = /mo_device=(\d)/.exec(window.location.href);
  function remove_fixed_ad() {
    /* 移除浮动广告 */

    switch (target) {
      case 0:
        $("div")
          .filter(function() {
            return (
              $(this).parents("#page-copyright").length === 1 &&
              $(this).css("position") === "fixed"
            );
          })
          .hide();
        return;
      case 1:
        $(".appPromote_wrapper").remove();

        $(".appBottomPromote").remove();
        return;
    }
  }
  let main_task;
  if (target === 0) {
    /* 手机百度*/
    main_task = () => {
      /* 隐藏广告 */
      $(".results>div").each(function(index) {
        if ($(this).find(".ec-tuiguang").length !== 0) {
          $(this).hide();
        }
      });
      /* 展开折叠项 */
      $(".hint-fold-results-wrapper>.c-result")
        .filter(function() {
          return $(this).find(".ec-tuiguang").length === 0;
        })
        .each(function(index) {
          $(".results").append($(this));
        });
      /* 隐藏折叠按钮 */
      $(".hint-fold-results-wrapper").hide();
      /* 显示翻页 */
      $(".se-page-controller").css("display", "block");
      /* 隐藏推荐 */
      $(".na-like-container").each(function() {
        $(this).hide();
      });
      /* 移除浮动广告 */
      remove_fixed_ad();
    };
    main_task();
    setInterval(main_task, 200);
  }
  if (target === 1) {
    /* 百度贴吧 */
    main_task = () => {
      if (window.location.href.indexOf("tieba.baidu.com/index/tbwise") !== -1) {
        /* 个人中心 */
        function hide_ad() {
          let temp;
          temp = document.getElementsByClassName("top-guide");
          if (temp.length !== 0) {
            temp[0].style.display = "none";
          }
          temp = document.getElementsByClassName("footer-wrap");
          if (temp.length !== 0) {
            temp[0].style.display = "none";
          }
          temp = document.getElementsByClassName("tb-footer-wrap");
          if (temp.length !== 0) {
            temp[0].style.display = "none";
          }
        }
        setTimeout(hide_ad, 100);
        document.body.addEventListener("click", () => {
          setTimeout(hide_ad, 10);
        });
      } else {
        /* 贴吧 */
        /* 隐藏帖子列表中的广告 */
        $("#frslistcontent > li")
          .filter(function() {
            return $(this).attr("data-tid") == null;
          })
          .remove();
        /* 将app专属的帖子转为网页链接 */
        $(".tl_shadow_for_app").each(function() {
          const tid = $(this).attr("data-tid");
          $(this)
            .find("div")
            .unbind("click");
          $(this).bind("click", function(e) {
            e.stopPropagation();
            window.location.href = `/p/${tid}?mo_device=${mo_device}`;
          });
          $(this)
            .find("a")
            .attr("href", `/p/${tid}?mo_device=${mo_device}`);
          const reply_num = $(this)
            .find(".reply_num")
            .text();
          $(this)
            .find("a")
            .append(
              `<div class="ti_zan_reply clearfix"><div class="ti_func_btn btn_reply"><span class="btn_icon">${reply_num}</span></div></div>`
            );
        });
        $(".tl_shadow_for_app").removeClass("tl_shadow_for_app");
        $(".tl_shadow_for_app_modle").remove();
        $(".frs_daoliu_for_app").remove();
        $(".for_app_label_text_tag").remove();

        /* 移除底部下载按钮 */
        $(".j_footer").remove();
        /* 主题帖 */
        /* 显示全部评论 */
        $("#pblist>li").removeClass("class_hide_flag");
        /* 移除折叠按钮 */
        $(".father-cut-daoliu-normal-box").hide();
        /* 显示翻页按钮 */
        $("#list_pager").css({
          visibility: "visible !important",
          height: "50px !important",
          "padding-bottom": "50px"
        });
        /* 点击主楼图片不下载APP */
        $(".pb_imgs").unbind("click");
        $(".pb_imgs").bind("click", function(e) {
          window.location.href = e.target.src;
        });
        /* 隐藏主楼中的app下载链接 */
        $("#diversBanner").hide();
        /* 删除广告楼层 */
        $("#pblist > li")
          .filter(function() {
            return $(this).attr("tid") == null;
          })
          .hide();
        /* 替换评论展开按钮 */
        $("#pblist > li").each(function() {
          const tid = $(this).attr("tid");
          $(this)
            .find(".j_floor_panel")
            .each(function() {
              const data_count = $(this).attr("data-list-count");
              $(this)
                .children(".pb_floow_load")
                .replaceWith(
                  `<div style='text-align:right'><a href='/t/p/${tid}'>查看${data_count}条评论</a>&emsp;</div>`
                );
            });
        });
        /* 将推荐列表指向网页 */
        $(".father-cut-recommend-normal-box").hide();
        /* 隐藏主楼中的下载按钮 */
        $(".img_desc").hide();
        /* 隐藏底部下载按钮 */

        $(".j_pb_footer").hide();
        /* 移除浮动广告 */
        remove_fixed_ad();
        /* 隐藏查看图片时顶部贴吧app下载 */
        $(".ui_image_header_bottom").remove();
      }
    };
    main_task();
    document.body.addEventListener("DOMSubtreeModified", function() {
      debounce(main_task, 10)();
    });
  }
})();

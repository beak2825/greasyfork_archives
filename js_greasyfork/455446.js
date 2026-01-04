// ==UserScript==
// @name         91porn视频显示完整标题
// @namespace    https://github.com/dadaewqq/fun
// @version      2.3
// @description  (🤩最近更新，添加视频按热度、收藏数、留言数排序功能🤩)显示完整标题, 去除广告, 精简部分冗余内容, 点击视频从新标签页打开
// @author       dadaewqq
// @match        *://91porn.com/*
// @match        *://www.91porn.com/*
// @icon         http://91porn.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455446/91porn%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/455446/91porn%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==
(function () {
  var order = function (test) {
    // 获取所有包含<div>元素的祖父元素
    const grandparents = Array.from(document.querySelectorAll(".col-xs-12.col-sm-4.col-md-3.col-lg-3"));

    // 将每个祖父元素和其包含的<div>元素的收藏值存储在一个对象数组中
    const objects = grandparents.map((grandparent) => {
      const favoriteSpan = Array.from(grandparent.querySelectorAll("span.info")).find((span) => span.textContent.trim() === test);
      const favorite = parseInt(favoriteSpan.nextSibling.textContent.trim());
      return { grandparent, favorite };
    });

    // 将对象数组按收藏值从高到低排序
    objects.sort((a, b) => b.favorite - a.favorite);

    // 为每个排序后的对象重构HTML，然后插入到文档中
    const container = document.createElement("div");
    objects.forEach((object) => container.appendChild(object.grandparent));
    $(".row:eq(1)").append(container);
  };

  //主页自动跳转
  if (window.location.pathname == "/") {
    location.href = "/index.php";
  }

  //修改样式
  $(".well.well-sm").css({ "min-height": "330px", "margin-bottom": "30px" });
  $(".title-truncate").css({ "white-space": "normal" });

  // 新标签页打开
  $('[href*="viewkey"]').attr("target", "_blank");

  //去除广告
  $(".ad_img").parents("[align=center]").hide();
  $(".ad_img").parent().parent().hide();
  $("iframe").hide();

  //精简部分内容
  $("#videodetails-content").hide();
  $(".more.title").hide();
  $(".more.title").prev().hide();
  $('#linkForm2').hide();

  //添加按钮

  if (window.location.pathname == "/index.php" || window.location.pathname == "/v.php" || window.location.pathname == "/uvideos.php") {
    var buttonHtml = '<button class="order-btn" data-order="redu">按热度排序</button>' + '<button class="order-btn" data-order="shoucang">按收藏数排序</button>' + '<button class="order-btn" data-order="liuyan">按留言数排序</button>' + "<br><br>";

    $(".row:first").before(buttonHtml);

    $('.order-btn').css({'color':'black','background':'','border-radius':'10px','border':'5px solid','font-weight':'bold'});

    $(".order-btn").click(function () {
      $('.order-btn').css('background','');
      this.style.background='#ff8800';
      var orderType = $(this).data("order");
      order(getOrderText(orderType));
    });

    function getOrderText(orderType) {
      switch (orderType) {
        case "redu":
          return "热度:";
        case "shoucang":
          return "收藏:";
        case "liuyan":
          return "留言:";
        default:
          return "";
      }
    }
  }
})();

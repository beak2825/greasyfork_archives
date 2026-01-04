// ==UserScript==
// @name         Yande.re 浏览隐藏图片,放大预览,添加翻页按键
// @namespace    none
// @version      0.3
// @description  浏览一些隐藏图片,放大预览,添加了翻页按键
// @author       Joker
// @match        https://yande.re/post*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/387984/Yandere%20%E6%B5%8F%E8%A7%88%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87%2C%E6%94%BE%E5%A4%A7%E9%A2%84%E8%A7%88%2C%E6%B7%BB%E5%8A%A0%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/387984/Yandere%20%E6%B5%8F%E8%A7%88%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87%2C%E6%94%BE%E5%A4%A7%E9%A2%84%E8%A7%88%2C%E6%B7%BB%E5%8A%A0%E7%BF%BB%E9%A1%B5%E6%8C%89%E9%94%AE.meta.js
// ==/UserScript==

jQuery.noConflict();

jQuery(function () {
  var $ = jQuery;

  var zoombox = '<div id="zoombox" style="position: fixed; top:0; left:0; width:300px; height:100%;"></div>';
  var $zoombox = $(zoombox);
  $zoombox.hide();
  $("body").append($zoombox);

  addGlobalStyle('#zoombox img{width:100%; height:auto} .boxShadow{box-shadow:0px 0px 20px 3px #c1de4c;}');

  //显示隐藏图片
  showHiddenImage();
  //左右翻页
  addKey();
  // 添加鼠标放大预览
  addMouseZoomPreview();


  //添加全局css
  function addGlobalStyle(css) {
    var $head, $style;
    $head = $('head');
    $style = $("<style></style>");
    $style.html(css);
    $head.append($style);
  }
  //添加按键
  function addKey() {

    // 添加双击翻页
    $(document).dblclick(function (e) {
      var w = document.documentElement.offsetWidth || document.body.offsetWidth;
      // console.log("w:"+w)
      var clickX = e.clientX;
      if (clickX > w / 2) { //向后翻页
        nextPage();
      } else if (clickX < w / 2) { //向前翻页
        previousPage();
      }
    });

    //添加左右按键翻页
    $(document).keydown(function (e) {
      //console.log("keydown")
      if (e.keyCode == 37) {
        previousPage();
      } else if (e.keyCode == 39) {
        nextPage();
      }
    });

    //下页
    function nextPage() {
      var $nextBtn = $('a.next_page');
      if ($nextBtn.length > 0) {
        $nextBtn[0].click();
      }
    }
    //上页
    function previousPage() {
      var $preBtn = $('a.previous_page');
      if ($preBtn.length > 0) {
        $preBtn[0].click();
      }
    }
  }
  //显示隐藏图片
  function showHiddenImage() {
    var hideClassName = "javascript-hide";

    var $allPostLi = $("#post-list-posts > li");

    $.each($allPostLi, function (index, item) {
      var $item = $(item);

      if ($item.hasClass(hideClassName)) {
        //console.log($item)
        // 加上阴影标识
        $item.removeClass(hideClassName);
        var $inner = $item.children(".inner");
        $inner.addClass("boxShadow")
        // $inner.css({
        //   boxShadow:boxShadow
        // });

        // 调整顺序到最开始
        $item.prependTo($("#post-list-posts"));
      }
    });
  }

  // 添加鼠标放大预览
  function addMouseZoomPreview() {

    var $allPostLi = $("#post-list-posts > li");
    $.each($allPostLi, function (index, item) {
      var $item = $(item);
      $item.hover(function (e) {
        var $self = $(this);

        var s = $self.find(".inner>a");
        //console.log(s.html())
        $zoombox.show();
        $zoombox.append(s.html());


      }, function (e) {
        var $self = $(this);
        $zoombox.hide();
        $zoombox.html("");
      })
    });
  }
});
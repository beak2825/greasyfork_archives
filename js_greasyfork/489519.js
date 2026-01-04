// ==UserScript==
// @name         微信读书 VIP会员版
// @version      2.2.3
// @license MIT
// @namespace    https://greasyfork.org/zh-CN/users/1272865
// @description  可视化面板，轻松修改宽度、字体、字体颜色、背景颜色、背景图片，另有自动滚动(加速/减速/暂停/继续)，自动翻页，隐藏头部标题。字体、背景颜色非常方便拓展增加
// @author       brewin
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      pixabay.com
// @connect      w3school.com.cn
// @downloadURL https://update.greasyfork.org/scripts/489519/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20VIP%E4%BC%9A%E5%91%98%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/489519/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20VIP%E4%BC%9A%E5%91%98%E7%89%88.meta.js
// ==/UserScript==

//GM_addStyle("*{font-family: TsangerJinKai05 !important;}");
//GM_addStyle(".renderTargetContainer .wr_canvasContainer{position:inherit}");
GM_addStyle(
  ".readerControls{margin-left: calc(50% - 200px) !important;margin-bottom: -28px !important;}"
);
GM_addStyle(
  ".dialog {  display: none;  position: fixed;  top: 50%;  left: 50%;  transform: translate(-50%, -50%);  width: 400px;  height: 600px;  background-color: #f9f9f9;  padding: 2px;  border: 1px solid #ffffff;  border-radius: 10px;   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  z-index: 1000;   }.dialog-header {  cursor: move;  user-select: none;  padding: 5px;  height: 60px;   background-color: #007bff;  color: #fff;  position: relative;   border-top-left-radius: 10px;   border-top-right-radius: 10px;   font-size: 45px;   font-weight: bold; }.dialog-content {  padding: 10px;  height: 500px;  color: #000;  background-color: #f0f0f0;  border-bottom-left-radius: 10px;   border-bottom-right-radius: 10px; }.close {  font-size: 20px;  font-weight: bold;  cursor: pointer;  color: #fff;  position: absolute;  top: 5px;   right: 5px; }"
);
GM_addStyle(
  ".next-page-tip {  display: none;  position: fixed;  bottom: 0%;  right: 10%;   width: 120px;  height: 40px;  font-size: 25px;color:#000;  background-color: #fff;  padding: 2px;  border: 1px solid grey;  border-radius: 10px;   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  z-index: 1000;    }"
);
GM_addStyle(
  ".next-page-tip-progress {    width: 80px; background-color: #d8e2c8;  }"
);
GM_addStyle("#dialog_content {  overflow-y: auto; }");
GM_addStyle(
  ".font-show-area-btn {font-size: 25px;color:#A52A2A;  border:2px #c4c4c4 solid ;margin:5px}"
);
GM_addStyle(".font-show-area-font-absence {color:grey;}");
GM_addStyle(
  ".font-color-show-area-btn{font-size: 20px;  border:2px #c4c4c4 solid ;margin:5px}"
);
GM_addStyle(".font-color-show-area-label{font-size: 30px;margin:5px}");

GM_addStyle(
  ".background-color-show-area-btn{font-size: 20px;  border:2px #c4c4c4 solid ;margin:5px}"
);
GM_addStyle(
  ".custom-background-color-show-area-btn{font-size: 12px;  border:1px #c4c4c4 solid ;padding:5px}"
);
GM_addStyle(
  ".width-show-area-btn{font-size: 12px;  border:1px #c4c4c4 solid ;margin:5px}"
);
GM_addStyle(".background-color-show-area-label{font-size: 30px;margin:5px}");
GM_addStyle(
  ".auto-scroll-show-area-btn{ border:1px #c4c4c4 solid ;margin:5px}"
);

$(window).on("load", async function () {
  "use strict";
  ///////////////////////////////////////////////////// 全局变量和菜单指令 /////////////////////////////////////////////////////
  //可选字体
  var myfonts = [
    {
      name: "默认",
      font: "PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif"
    },
    { name: "楷体", font: "楷体" },
    { name: "宋体", font: "宋体" },
    { name: "黑体", font: "黑体" },
    { name: "苍耳今楷", font: "TsangerJinKai05" },
    { name: "字魂白鸽天行体", font: "字魂白鸽天行体" },
    { name: "霞鹜文楷", font: "霞鹜文楷" },
    { name: "汉仪空山楷", font: "汉仪空山楷" },
    { name: "寒蝉正楷体", font: "ChillKai" },
    { name: "三极行楷简体", font: "三极行楷简体-粗" },
    { name: "演示悠然小楷", font: "演示悠然小楷" }
  ];
  //可选背景图片
  var background_image_urls = [
    "https://www.w3school.com.cn/i/eg_bg_02.gif",
    "https://www.w3school.com.cn/i/eg_bg_03.gif",
    "https://www.w3school.com.cn/i/eg_bg_04.gif",
    "https://cdn.pixabay.com/photo/2016/12/18/02/35/paper-1914901_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/09/06/11/41/vintage-2721099_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/04/15/21/39/paper-1332019_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/12/18/02/41/background-1914910_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/06/02/15/31/watercolor-795162_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/09/06/11/41/vintage-2721100_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/04/15/21/34/paper-1332008_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/04/15/21/37/paper-1332013_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/11/07/10/22/paper-2926300_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/02/16/20/46/pattern-3158572_1280.jpg",
    "https://cdn.pixabay.com/photo/2014/11/20/20/30/paper-539779_1280.jpg",
    "https://cdn.pixabay.com/photo/2019/11/02/15/21/map-4596619_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/02/04/11/33/background-2037176_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/09/13/11/00/vintage-937977_1280.jpg",
    "https://www.w3school.com.cn/i/eg_bg_01.gif"
  ];
  //自定义常驻背景颜色
  var mybackground_colors = [
    { name: "浅绿", color: "#d8e2c8" },
    { name: "茶色", color: "#d2b48c" },
    { name: "淡绿", color: "#eefaee" },
    { name: "明黄", color: "#ffffed" },
    { name: "灰绿", color: "#d8e7eb" },
    { name: "浅蓝", color: "#e9faff" },
    { name: "草绿", color: "#cce8cf" },
    { name: "红粉", color: "#fcefff" },
    { name: "米黄", color: "#f5f5dc" },
    { name: "暗银", color: "#c0c0c0" },
    { name: "黑绿", color: "#00b800" },
    { name: "浅黄", color: "#f5f1e8" },
    { name: "浅灰", color: "#d9e0e8" },
    { name: "深灰", color: "#555555" },
    { name: "漆黑", color: "#111111" },
    { name: "淡青", color: "#839496" },
    { name: "深青", color: "#002b36" }
  ];

  ///////////////////////////////////////////////////// 对话框 /////////////////////////////////////////////////////
  $("body").append(`
<div id="dialog" class="dialog">
  <div class="dialog-header">
    <span>功能</span>
      <span class="close" id="close_dialog">&times;</span>
  </div>
  <div id="dialog_content" class="dialog-content">
  <div class="font-style">
  <h3>宽度:</h3>
  <div id="width_show_area">
  </div>

    <h3>字体:</h3>
    <div id="font_show_area">
    </div>

    <h3>字体颜色:</h3>
    <div id="font_color_show_area">
    </div>

    <h3>背景颜色:</h3>
    <div id="background_color_show_area">
    </div>

    <h3>背景图片:</h3>
    <div id="background_image_show_area">
    </div>

    <h3>自动滚动:</h3>
    <div id="auto_scroll_show_area">
    </div>
  </div>
  </div>
</div>
    `);
  $("body").append(`
    <div id="next_page_tip" class="next-page-tip">

     <div class="next-page-tip-progress">
即将翻页
    </div>
    </div>
        `);

  var control_function_btn_div =
    "<button id='open_dialog' class='readerControls_item' style='color:#6a6c6c;cursor:pointer;'>功能</button>";
  $(".readerControls").append(control_function_btn_div);

  $("#open_dialog").click(function () {
    $("#dialog").fadeIn();
  });

  $("#close_dialog").click(function () {
    $("#dialog").fadeOut();
  });

  let is_dragging = false;
  let offset_x, offset_y;

  $(".dialog-header").mousedown(function (e) {
    is_dragging = true;
    offset_x = e.clientX - $("#dialog").offset().left;
    offset_y = e.clientY - $("#dialog").offset().top;
  });

  $(document).mousemove(function (e) {
    if (is_dragging) {
      $("#dialog").offset({
        top: e.clientY - offset_y,
        left: e.clientX - offset_x
      });
    }
  });

  $(document).mouseup(function () {
    is_dragging = false;
  });

  ///////////////////////////////////////////////////// 字体 背景 /////////////////////////////////////////////////////

  ///////////////////////////////////////////////////// 字体
  //初始化对话框全部字体缩图
  function initDialogFontShowArea() {
    for (let i = 0; i < myfonts.length; i++) {
      var font_btn = document.createElement("button");
      font_btn.textContent = myfonts[i].name;
      font_btn.style.fontFamily = myfonts[i].font;
      font_btn.classList.add("font-show-area-btn");
      if (!isSupportFontFamily(myfonts[i].font)) {
        font_btn.classList.add("font-show-area-font-absence");
      }

      font_btn.addEventListener("click", function () {
        changeFont(i);
      });
      $("#font_show_area").append(font_btn);
    }
    var bak = GM_getValue("font_index", -1);
    changeFontSelectedBorder(bak);
  }

  /* 改变字体
    index：使用字体序号
    */
  function changeFont(index) {
    var font = myfonts[index].font;
    var font_style_str = `*{font-family: ${font} ;}`;
    console.log("切换字体-> " + index + " font:" + font);
    GM_addStyle(font_style_str);
    GM_setValue("font_index", index);
    changeFontSelectedBorder(index);
    afterFontSelected();
    // location.reload();
  }
  //改变选中字体边框
  function changeFontSelectedBorder(index) {
    var buttons = $("#font_show_area button");
    for (var i = 0; i < buttons.length; i++) {
      if (i == index) {
        buttons[i].style.border = "2px solid silver";
      } else {
        buttons[i].style.border = "none";
      }
    }
  }
  //改变选中字体后对话框字体保持原字体
  function afterFontSelected() {
    var buttons = $("#font_show_area button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.fontFamily = `${myfonts[i].font} !important`;
    }
  }

  /* 判断用户操作系统是否安装某字体
  https://www.zhangxinxu.com/wordpress/2018/02/js-detect-suppot-font-family/
  */
  var isSupportFontFamily = function (f) {
    if (typeof f != "string") {
      return false;
    }
    var h = "Arial";
    if (f.toLowerCase() == h.toLowerCase()) {
      return true;
    }
    var e = "a";
    var d = 100;
    var a = 100,
      i = 100;
    var c = document.createElement("canvas");
    var b = c.getContext("2d");
    c.width = a;
    c.height = i;
    b.textAlign = "center";
    b.fillStyle = "black";
    b.textBaseline = "middle";
    var g = function (j) {
      b.clearRect(0, 0, a, i);
      b.font = d + "px " + j + ", " + h;
      b.fillText(e, a / 2, i / 2);
      var k = b.getImageData(0, 0, a, i).data;
      return [].slice.call(k).filter(function (l) {
        return l != 0;
      });
    };
    return g(h).join("") !== g(f).join("");
  };

  ///////////////////////////////////////////////////// 字体颜色
  $("#font_color_show_area").append(`
  <input type="color" id="font_color" name="font_color" value="#ffffff" />
  <label for="font_color" class="font-color-show-area-label"></label>
  <button class="font-color-show-area-btn" id="font_color_open_btn">开启</button><button class="font-color-show-area-btn" id="font_color_close_btn">关闭</button>
    `);
  $("#font_color").on("input", function () {
    console.log("触发了input");
    var color = $(this).val();
    changeFontColor(true, color);
  });

  $("#font_color").change(function () {
    console.log("触发了change");
    var color = $(this).val();
    GM_setValue("font_color", color);
    changeFontColor();
  });

  //初始化对话框字体颜色展示区域
  function initDialogFontColorShowArea() {
    var font_color = GM_getValue("font_color", "#000000");
    var font_color_open = GM_getValue("font_color_open", false);
    if (font_color_open) {
      $("#font_color_open_btn").css("border", "2px solid fuchsia");
      $("#font_color_close_btn").css("border", "none");
    } else {
      $("#font_color_close_btn").css("border", "2px solid fuchsia");
      $("#font_color_open_btn").css("border", "none");
    }
  }
  /*改变字体颜色
temp: 动态变换字体，方便看效果
*/
  function changeFontColor(temp = false, color = "#000000") {
    var color_str = `.readerChapterContent {color: ${color} !important;}`;
    //动态查看效果使用
    if (temp) {
      GM_addStyle(color_str);
      $('label[for="font_color"]').text(color);
      return;
    }
    var font_color = GM_getValue("font_color", "#000000");
    var font_color_open = GM_getValue("font_color_open", false);
    if (font_color_open) {
      color_str = `.readerChapterContent {color: ${font_color} !important;}`;
      GM_addStyle(color_str);
      $('label[for="font_color"]').text(font_color);
    } else {
      color_str = `.readerChapterContent  {color: #000000 !important;}`;
      GM_addStyle(color_str);
      $('label[for="font_color"]').text("");
    }
  }

  $("#font_color_open_btn").click(function () {
    GM_setValue("font_color_open", true);
    $("#font_color_open_btn").css("border", "2px solid aqua");
    $("#font_color_close_btn").css("border", "none");
    changeFontColor();
  });
  $("#font_color_close_btn").click(function () {
    GM_setValue("font_color_open", false);
    $("#font_color_close_btn").css("border", "2px solid aqua");
    $("#font_color_open_btn").css("border", "none");
    changeFontColor();
  });

  ///////////////////////////////////////////////////// 背景图片

  //初始化对话框全部背景图片缩图
  function initDialogBackgroundImageShowArea() {
    for (let i = 0; i < background_image_urls.length; i++) {
      //GM_xmlhttpRequest存在异步问题导致图片和序号不对应，暂时使用setTimeout解决
      setTimeout(() => {
        addDialogBackgroundImageShow(i);
      }, i * 100);
    }
    setTimeout(() => {
      var bak = GM_getValue("background_image_index", -1);
      changeBackgroundImageSelectedBorder(bak);
    }, (background_image_urls.length + 2) * 100);
  }
  //对话框追加背景图片缩图
  function addDialogBackgroundImageShow(index) {
    var url2 = background_image_urls[index];
    GM_xmlhttpRequest({
      method: "GET",
      url: url2,
      responseType: "blob",
      synchronous: true,
      onload: function (response) {
        var blobUrl = URL.createObjectURL(response.response);
        var img = document.createElement("img");
        img.src = blobUrl;
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.margin = "3px";
        img.style.padding = "3px";
        img.addEventListener("click", function () {
          changeBackgroundImage(index);
        });
        $("#background_image_show_area").append(img);
      }
    });
  }

  /* 改变背景图片
    index：使用背景图片序号
    dbClickCancel：是否双击取消背景图片
    当$background_image_index和index相同时取消背景图片，也就是点击同一个背景图片两次时取消背景图片
    */
  function changeBackgroundImage(index, dbClickCancel = true) {
    var bak = GM_getValue("background_image_index", -1);
    // 又被点击了一次，取消背景图片
    if (bak == index && dbClickCancel) {
      index = -1;
    }
    var background_image_style_str =
      ".readerContent .app_content {background-image: none;}";
    if (index > -1) {
      background_image_style_str =
        ".readerContent .app_content {background-image: url('" +
        background_image_urls[index] +
        "');}";
    }
    console.log(
      "切换背景图片-> " + index + " url:" + background_image_urls[index]
    );
    GM_addStyle(background_image_style_str);
    GM_setValue("background_image_index", index);
    changeBackgroundImageSelectedBorder(index);
  }
  function changeBackgroundImageSelectedBorder(index) {
    var images = $("#background_image_show_area img");
    for (var i = 0; i < images.length; i++) {
      if (i == index) {
        images[i].style.border = "2px solid green";
      } else {
        images[i].style.border = "none";
      }
    }
  }

  ///////////////////////////////////////////////////// 背景颜色
  $("#background_color_show_area").append(`
  <input type="color" id="background_color" name="background_color" value="#ffffff" />
  <label for="background_color" class="background-color-show-area-label"></label>
  <button class="background-color-show-area-btn" id="background_color_open_btn">开启</button><button class="background-color-show-area-btn" id="background_color_close_btn">关闭</button>
    `);
  $("#background_color").on("input", function () {
    var color = $(this).val();
    changeBackgroundColor(true, color);
  });

  $("#background_color").change(function () {
    var color = $(this).val();
    GM_setValue("background_color", color);
    changeBackgroundColor();
  });

  //初始化对话框背景颜色展示区域
  function initDialogBackgroundColorShowArea() {
    var background_color = GM_getValue("background_color", "#d8e2c8");
    var background_color_open = GM_getValue("background_color_open", false);
    if (background_color_open) {
      $("#background_color_open_btn").css("border", "2px solid maroon");
      $("#background_color_close_btn").css("border", "none");
    } else {
      $("#background_color_close_btn").css("border", "2px solid maroon");
      $("#background_color_open_btn").css("border", "none");
    }
    //自定义背景颜色按钮
    $("#background_color_show_area").append("<br>");
    for (let i = 0; i < mybackground_colors.length; i++) {
      var item = mybackground_colors[i];
      var background_color_btn = document.createElement("button");
      background_color_btn.textContent = item.name;
      background_color_btn.style.backgroundColor = item.color;
      background_color_btn.classList.add(
        "custom-background-color-show-area-btn"
      );
      $("#background_color_show_area").append(background_color_btn);
    }
  }

  function changeBackgroundColor(temp = false, color = "none") {
    var color_str = `.readerContent .app_content{background-color: ${color} !important;}`;
    //动态查看效果使用
    if (temp) {
      GM_addStyle(color_str);
      $('label[for="background_color"]').text(color);
      return;
    }
    var background_color = GM_getValue("background_color", "#d8e2c8");
    var background_color_open = GM_getValue("background_color_open", false);
    if (background_color_open) {
      color_str = `.readerContent .app_content{background-color: ${background_color} !important;}`;
      GM_addStyle(color_str);
      $('label[for="background_color"]').text(background_color);
    } else {
      color_str = `.readerContent .app_content{background-color: transparent !important;}`;
      GM_addStyle(color_str);
      $('label[for="background_color"]').text("");
    }
  }

  $("#background_color_open_btn").click(function () {
    GM_setValue("background_color_open", true);
    $("#background_color_open_btn").css("border", "2px solid maroon");
    $("#background_color_close_btn").css("border", "none");
    changeBackgroundColor();
  });
  $("#background_color_close_btn").click(function () {
    GM_setValue("background_color_open", false);
    $("#background_color_close_btn").css("border", "2px solid maroon");
    $("#background_color_open_btn").css("border", "none");
    changeBackgroundColor();
  });
  $("#background_color_show_area").on(
    "click",
    ".custom-background-color-show-area-btn",
    function () {
      var selectedColorName = $(this).text();
      var selectedColor = getColorByName(selectedColorName);
      GM_setValue("background_color", selectedColor);
      $("#background_color").val(selectedColor);
      changeBackgroundColor();
    }
  );

  function getColorByName(colorName) {
    for (let i = 0; i < mybackground_colors.length; i++) {
      if (mybackground_colors[i].name === colorName) {
        return mybackground_colors[i].color;
      }
    }
    return "transparent"; // 如果未找到对应颜色，可以返回null或者其他自定义值
  }

  ///////////////////////////////////////////////////// 宽度 /////////////////////////////////////////////////////

  $("#width_show_area").append(`
  <input type="range" min="30" max="100" value="60" style="width:300px" id="width_control">
  <span id="width_control_text"></span>%<button class="width-show-area-btn"  id="default_width_btn">默认</button>
    `);
  $("#width_control").on("input", function () {
    var width_radio = $(this).val();
    $("#width_control_text").text(width_radio);
    var new_width = Math.floor((window.innerWidth * width_radio) / 100);
    GM_setValue("width_radio", width_radio);
    changeWidth(new_width);
  });

  //改变文章宽度
  function changeWidth(new_width) {
    const item1 = document.querySelector(".readerContent .app_content");
    const item2 = document.querySelector(".readerTopBar");
    item1.style["max-width"] = new_width + "px";
    item2.style["max-width"] = new_width + "px";
    const myEvent = new Event("resize");
    window.dispatchEvent(myEvent);
  }
  //初始化宽度
  function initWidth() {
    const item1 = document.querySelector(".readerContent .app_content");
    const defaultOriginWidth = getElementMaxWidth(item1);
    GM_setValue("default_origin_width", defaultOriginWidth);
    var width_radio = GM_getValue("width_radio", 60);
    $("#width_control").val(width_radio);
    $("#width_control_text").text(width_radio);
    var new_width = Math.floor((window.innerWidth * width_radio) / 100);
    changeWidth(new_width);
  }

  //获取元素最大宽度
  function getElementMaxWidth(element) {
    let currentValue = window.getComputedStyle(element).maxWidth;
    currentValue = currentValue.substring(0, currentValue.indexOf("px"));
    currentValue = parseInt(currentValue);
    return currentValue;
  }
  $("#default_width_btn").click(function () {
    var default_origin_width = GM_getValue("default_origin_width", 600);
    changeWidth(default_origin_width);
    var width_radio = Math.floor(
      (default_origin_width * 100) / window.innerWidth
    );
    GM_setValue("width_radio", width_radio);
    $("#width_control").val(width_radio);
    $("#width_control_text").text(width_radio);
  });
  ///////////////////////////////////////////////////// 自动滚动 /////////////////////////////////////////////////////
  $("#auto_scroll_show_area").append(`
 <label for="scroll_interval">滚动间隔:</label>
<input type="number" id="scroll_interval" name="scroll_interval">ms
<br>
<label for="scroll_speed">滚动距离:</label>
<input type="number" id="scroll_speed" name="scroll_speed" >px
<br>
<label for="scroll_speed">翻页等待:</label>
<input type="number" id="next_page_wait_threshold" name="next_page_wait_threshold" >ms
  `);

  $(".readerControls").append(
    "<button id='auto_scroll_speed_acc' class='readerControls_item' style='color:#6a6c6c;cursor:pointer;'>滚动加速</button><button id='auto_scroll_speed_dec' class='readerControls_item' style='color:#6a6c6c;cursor:pointer;'>滚动减速</button><button id='auto_scroll_pause' class='readerControls_item' style='color:#6a6c6c;cursor:pointer;'>开始滚动</button>"
  );

  // 初始滚动状态
  let is_scrolling = false;
  //滚动间隔
  let scroll_interval = GM_getValue("scroll_interval", 20);
  // 初始滚动速度
  let scroll_speed = GM_getValue("scroll_speed", 1);
  // 等待翻页阈值
  let next_page_wait_threshold = GM_getValue("next_page_wait_threshold", 1000);
  //滚动事件标识
  let interval_event_id;
  //上次滚动位置
  let last_scroll_pos = -1;
  //已等待时间
  let next_page_wait = 0;
  //最小滚动间隔
  let min_scroll_interval = 20;
  // 最小初始滚动速度
  let min_scroll_speed = 1;
  // 最小等待翻页阈值
  let min_next_page_wait_threshold = 500;
  $("#auto_scroll_speed_acc").click(function () {
    scroll_speed++;
    GM_setValue("scroll_speed", scroll_speed);
    var text = $("#auto_scroll_pause").text().substring(0, 2);
    $("#auto_scroll_pause").html(text + scroll_speed);
    $("#scroll_speed").val(scroll_speed);
  });

  $("#auto_scroll_speed_dec").click(function () {
    scroll_speed--;
    if (scroll_speed < min_scroll_speed) {
      scroll_speed = 1;
    }
    GM_setValue("scroll_speed", scroll_speed);
    var text = $("#auto_scroll_pause").text().substring(0, 2);
    $("#auto_scroll_pause").html(text + scroll_speed);
    $("#scroll_speed").val(scroll_speed);
  });

  $("#auto_scroll_pause").click(function () {
    is_scrolling = !is_scrolling;
    if (is_scrolling) {
      interval_event_id = setInterval(autoScroll, scroll_interval);
      $("#auto_scroll_pause").html("暂停" + scroll_speed);
    } else {
      clearInterval(interval_event_id);
      $("#auto_scroll_pause").html("继续" + scroll_speed);
    }
  });

  $("#scroll_interval").on("change", function () {
    var new_scroll_interval = $(this).val();
    scroll_interval = new_scroll_interval;
    if (scroll_interval < min_scroll_interval) {
      scroll_interval = min_scroll_interval;
      $("#scroll_interval").val(scroll_interval);
    }
    GM_setValue("scroll_interval", scroll_interval);
  });
  $("#scroll_speed").on("change", function () {
    var new_scroll_speed = $(this).val();
    scroll_speed = new_scroll_speed;
    if (scroll_speed < min_scroll_speed) {
      scroll_speed = min_scroll_speed;
      $("#scroll_speed").val(scroll_speed);
    }
    GM_setValue("scroll_speed", scroll_speed);
    var text = $("#auto_scroll_pause").text().substring(0, 2);
    $("#auto_scroll_pause").html(text + scroll_speed);
  });
  $("#next_page_wait_threshold").on("change", function () {
    var new_next_page_wait_threshold = $(this).val();
    next_page_wait_threshold = new_next_page_wait_threshold;
    if (next_page_wait_threshold < min_next_page_wait_threshold) {
      next_page_wait_threshold = min_next_page_wait_threshold;
      $("#next_page_wait_threshold").val(next_page_wait_threshold);
    }
    GM_setValue("next_page_wait_threshold", next_page_wait_threshold);
  });
  function autoScroll() {
    var distance = scroll_speed;
    window.scrollBy(0, distance);
    let scroll_pos = $(this).scrollTop();

    // 到底后会一直一样，累加等待时间
    if (last_scroll_pos == scroll_pos) {
      next_page_wait = parseInt(next_page_wait) + parseInt(scroll_interval);
      let progress = Math.floor(
        (next_page_wait * 100) / next_page_wait_threshold
      );
      GM_addStyle(
        `.next-page-tip-progress {    width: ${progress}px; background-color: #d8e2c8;  }`
      );
    } else {
      next_page_wait = 0;
    }
    last_scroll_pos = scroll_pos;
    // 开始显示翻页条
    if (next_page_wait > 200) {
      console.log(
        "next_page_wait:" +
          next_page_wait +
          ",next_page_wait_threshold:" +
          next_page_wait_threshold
      );
      $("#next_page_tip").fadeIn();
    } else {
      $("#next_page_tip").fadeOut();
    }
    // 到达阈值，翻页
    if (next_page_wait > next_page_wait_threshold) {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          keyCode: 39
        })
      );
    }
  }
  //初始化对话框自动滚动配置区域
  function initDialogAutoScrollShowArea() {
    $("#scroll_interval").val(scroll_interval);
    $("#scroll_speed").val(scroll_speed);
    $("#next_page_wait_threshold").val(next_page_wait_threshold);
  }
  ///////////////////////////////////////////////////// 隐藏显示工具栏 /////////////////////////////////////////////////////
  let reader_controls = $(".readerControls");
  $(document).mousemove(function (event) {
    // 获取鼠标指针相对于文档的位置
    let mouse_x = event.pageX;
    // 获取屏幕宽度
    let screen_width = $(window).width();
    // 如果鼠标指针距离屏幕最右侧200px内，则显示reader_controls，否则隐藏
    if (screen_width - mouse_x <= 200) {
      reader_controls.css("opacity", "1");
    } else {
      reader_controls.css("opacity", "0");
    }
  });

  ///////////////////////////////////////////////////// 下滑不显示标题栏 /////////////////////////////////////////////////////
  var window_top = 0;
  $(window).scroll(function () {
    let scroll_dis = $(this).scrollTop();
    let reader_top_bar = $(".readerTopBar");
    if (scroll_dis > window_top) {
      // 下滑隐藏
      reader_top_bar.css("opacity", "0");
    } else {
      // 上滑到最顶端显示
      reader_top_bar.css("opacity", "1");
    }
  });
  ///////////////////////////////////////////////////// 启动初始化 /////////////////////////////////////////////////////
  //页面加载时初始化
  function pageLoad() {
    console.log("pageLoad");
    //打开对话框时渲染已选中的字体、背景图片缩图
    initDialog();
    //初始化字体
    initFont();
    //初始化字体颜色
    initFontColor();
    //初始化背景图片
    initBackgroundImage();
    //初始化背景颜色
    initBackgroundColor();
    //初始化宽度
    initWidth();
  }
  //初始化背景图片
  function initBackgroundImage() {
    var bak = GM_getValue("background_image_index", -1);
    changeBackgroundImage(bak, false);
  }
  //初始化背景颜色
  function initBackgroundColor() {
    var background_color = GM_getValue("background_color", "#d8e2c8");
    $("#background_color").val(background_color);
    changeBackgroundColor();
  }
  //初始化字体颜色
  function initFontColor() {
    var font_color = GM_getValue("font_color", "#000000");
    $("#font_color").val(font_color);
    changeFontColor();
  }
  //初始化字体
  function initFont() {
    var bak = GM_getValue("font_index", 0);
    changeFont(bak);
  }
  //打开对话框时渲染已选中的字体、背景图片缩图
  function initDialog() {
    //初始化对话框字体颜色展示区域
    initDialogFontColorShowArea();
    //初始化对话框背景颜色展示区域
    initDialogBackgroundColorShowArea();
    //初始化对话框全部背景图片缩图
    initDialogBackgroundImageShowArea();
    //初始化对话框全部字体缩图
    initDialogFontShowArea();
    //初始化对话框自动滚动配置区域
    initDialogAutoScrollShowArea();
  }
  pageLoad();
})();
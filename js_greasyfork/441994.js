// ==UserScript==
// @name         24fa全量图片加載
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  24fa网页美女页面图片加载,啦啦啦
// @author       LARA_SSR
// @exclude      https://www.24faw.com/c49.aspx
// @exclude      https://www.112w.cc/c49.aspx
// @exclude      https://www.117.life/mc49.aspx
// @exclude      /https?\:\/\/(www\.)?[0-9]*(m|w|faw|fa)\.(cc|link)/(m)?[0-9]*c(49|71)(p\d*)?\.aspx/
// @include      /https?\:\/\/(www\.)?[0-9]{2,3}(m|w|faw|fa|aa)?\.(cc|link|life)\/(m)?n[0-9]*c(49|71)/
// @license      MIT
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/viewerjs/1.10.4/viewer.min.js
// @downloadURL https://update.greasyfork.org/scripts/441994/24fa%E5%85%A8%E9%87%8F%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/441994/24fa%E5%85%A8%E9%87%8F%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BC%89.meta.js
// ==/UserScript==

console.clear();

(function () {
  "use strict";
  let isDebugMain = false;
  function log() {
    if (isDebugMain) {
      console.log.apply(this, arguments);
    }
  }
  let id = setInterval(async function () {
    if (Fancybox4) {
      //打印开关
      log("Fancybox4 --- isActive!\n");
      clearInterval(id);
      if (os.isAndroid || os.isPhone) {
        //判断是否Android或Phone
        $("script").empty();
        addStyle(fancyBoxCss);

        // 观察者 MutationObserver事件
        function type(param) {
          // es6中null的类型为object
          if (param === null) {
            return param + "";
          }
          if (typeof param === "object") {
            let val = Object.prototype.toString.call(param).split(" ")[1];
            let type = val.substr(0, val.length - 1).toLowerCase();
            return type;
          } else {
            return typeof param;
          }
        }
        let slideIndex = null;
        const ContentContainer = document.querySelector("body");
        const configObserver = {
          childList: true,
          subtree: true,
          attributeFilter: ["class"],
        };
        // 当观察到突变时执行的回调函数
        const callbacks = function (mutationsList) {
          mutationsList.forEach(function (item, index) {
            // log(' # ',type(item.type) + " " + item.type);
            if ("attributes" === item.type) {
              if (
                item.target.className ===
                "fancybox__carousel is-draggable"
              ) {
                log(' # ', item);
                openEvent(item);
              } else if (
                item.target.className ===
                "fancybox__container is-animated is-closing"
              ) {
                log(' # ', item);
                closeEvent();
              }
            }
          });
        };
        // 创建一个链接到回调函数的观察者实例
        const Observer = new MutationObserver(callbacks);
        ContentContainer && Observer.observe(ContentContainer, configObserver);
        function openEvent(item) {
          slideIndex =
            item.target.offsetParent.childNodes[1].firstChild.firstChild
              .childNodes[0].innerText - 1;
          if (slideIndex) {
            log("open - # " + slideIndex + " slide is open!");
          }
        }
        function closeEvent() {
          log("close - # " + slideIndex + " slide is closed!");
          let elementById = document.getElementById("imgLocation" + slideIndex);
          if (elementById) {
            elementById.scrollIntoView({
              block: "center",
              behavior: "smooth",
              inline: "center",
            });
          } else {
            console.error(" # ", "未定位id！");
          }
        }

        let open = "Default";
        switch (open) {
          case "Fullscreen":
            addStyle(fancyBoxCssAdditon);
            // addScript(fancyboxFullJsLocate);
            Fancybox4.bind("[data-fancybox='images']", {
              Toolbar: false,
              animated: false,
              dragToClose: false,
              showClass: false,
              hideClass: false,
              closeButton: "top",
              Image: { click: "close", wheel: "slide", zoom: false, fit: "cover" },
              Thumbs: { minScreenHeight: 0 }
            });
            break;
          case "Default":
            addStyle(`a[data-fancybox] img{cursor:zoom-in;}`);
            // addScript(fancyboxDefaultJsLocate);
            Fancybox4.bind("[data-fancybox='images']", {
              Thumbs: { Carousel: { fill: false, center: true } }
            });
            break;
        }

        // 标题
        let script2 = $(
          '<script type="text/javascript">let pager=null;</script>'
        );
        $("head").append(script2);
        addStyle("#titleHrefs{display: inline-block;color:#e9d7df;}");
        let titleHrefs = $("<div id =titleHrefs></div>");

        if (os.isPc) {
          if ($(".title2").length <= 0) {
            titleHrefs.append($("header h1").text());
            log("header h1 属性存在");
          } else {
            titleHrefs.append($(".title2").text());
            log(".title2 属性存在");
          }
          log("PC");
        } else if (os.isPhone) {
          if ($(".title2").length <= 0) {
            titleHrefs.append($("header h1").text());
            log("header h1 属性存在");
          } else {
            titleHrefs.append($(".title2").text());
            log(".title2 属性存在");
          }
          log("iPhone");
        } else if (os.isAndroid) {
          if ($(".title2").length <= 0) {
            titleHrefs.append($("header h1").text());
            log("header h1 属性存在");
          } else {
            titleHrefs.append($(".title2").text());
            log(".title2 属性存在");
          }
          log("Android");
        } else if (os.isTablet) {
          if ($(".title2").length <= 0) {
            titleHrefs.append($("header h1").text());
            log("header h1 属性存在");
          } else {
            titleHrefs.append($(".title2").text());
            log(".title2 属性存在");
          }
          log("Tablet");
        }

        //获取页数
        let paginationClass = $(".pager a");
        let myLength = paginationClass.length;

        let viewerCssLink =
          "https://cdn.staticfile.org/viewerjs/1.10.4/viewer.min.css";
        let viewerCssData = await Get(viewerCssLink);
        addStyle(viewerCssData);
        addStyle(`ul li{list-style-type:none;line-height:100%}
                body{display:block;margin:8px;background:#27282d;-webkit-text-size-adjust:unset;font-size:unset}
                #viewer{padding:0;margin:0}
                .imgbox{position:relative;overflow:hidden;margin-bottom:1px}
                .imgnum{position:absolute;font-size:90%;left:5px;top:5px;background:#17a1ff;background:rgba(23,161,255,.5);z-index:100;padding:0 5px;color:#f9f9f9;border-radius:2px}
                `);

        $("body").empty();
        let i = 1;
        let num = 0;
        let str3 = self.location.href;
        let newStr = str3.replace(/.aspx/g, "");
        let flag = /c49(p)?\d*/g.test(newStr);
        if (flag) {
          newStr = newStr.replace(/c49(p)?\d*/g, "");
        } else {
          newStr = newStr.replace(/c71(p)?\d*/g, "");
        }
        let viewer2 = $('<ul id ="viewer"></ul>');
        $("body").append(viewer2);
        viewer2.append(titleHrefs);
        let imgNumbers = 0;
        do {
          let url2 = "";
          if (flag) {
            url2 = newStr + "c49p" + i + ".aspx";
          } else {
            url2 = newStr + "c71p" + i + ".aspx";
          }
          log(url2);
          let data = await Get(url2);

          let image;
          if (str3.indexOf("www") > 0) {
            image = $("#content img", data);
          } else {
            image = $("#content img", data);
          }
          image.each(function (index, item) {
            imgNumbers++;
            let imgli = $('<li class = "imgbox"></li>');
            if ($(this)[0].hasAttribute("src")) {
              $(this).attr("data-original", $(this).attr("src"));
            } else {
              $(this).attr("src", $(this).attr("data-original"));
            }
            let src = $(this).attr("src");
            $(this).attr("width", "100%");
            $(this).attr("style", "float: left;margin: 0px;");
            $(this).attr("id", `imgLocation${imgNumbers - 1}`);
            let imageItem =
              "<a data-fancybox='images' href='" +
              src +
              "'>" +
              $(this)[0].outerHTML +
              "</img></a>";
            let stringNum = "<div class = 'imgnum'>{imgnum}</div>";
            let newStringNum = stringNum.replace("{imgnum}", `${imgNumbers}`);
            imgli = imgli.prepend($(newStringNum));

            imgli = imgli.append(imageItem);
            viewer2.append(imgli);
          });
          i = i + 1;
        } while (i <= myLength);
        num = $(".imgbox img").length;
        $(".imgnum").each(function (index, value) {
          if (index < num) {
            $(this).text(`[${index + 1}/${num}]`);
          } else {
            return false;
          }
        });
        function Get(link) {
          return new Promise(function (resolve) {
            $.get(link, (data) => {
              resolve(data);
            });
          });
        }
      }
    }
  }, 100);
})();

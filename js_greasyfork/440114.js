// ==UserScript==
// @name         MrCong全量加載
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  mrCong全量加載，啦啦啦
// @author       LARA_SSR
// @match        https://mrcong.com/*/
// @exclude      https://mrcong.com/tag/*
// @exclude      https://mrcong.com/category/*
// @exclude      https://mrcong.com/sets/*
// @exclude      https://mrcong.com/top*/*
// @exclude      https://mrcong.com/tim-kiem/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440114/MrCong%E5%85%A8%E9%87%8F%E5%8A%A0%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/440114/MrCong%E5%85%A8%E9%87%8F%E5%8A%A0%E8%BC%89.meta.js
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
        //获取页数
        let paginationClass = "div .page-link";
        let length = 0;
        let paginationExist = false;
        $(paginationClass).each(function () {
          if (paginationExist == true) {
            return false;
          }
          length = $(this).find("a").length;
          paginationExist = true;
          //log(linkArr);
          log("页数：" + length);
        });

        //标题
        addStyle(
          `.postTagHrefs{padding-bottom:10px}.postTagHrefs,.titleHrefs{color:#fffaf0;word-break:break-all}#title_info{color:pink;border:1px solid transparent;border-bottom-color:pink}#separate{color:#fff}#downHref>a{color:pink;border:1px solid transparent;border-bottom-color:#815c94}.postTagHrefs>div,.titleHrefs>div{display:inline-block}#spanitem,#spanitemdiv{color:#fffaf0}`
        );
        let header = $("<div class = titleHrefs></div>");
        let footer = $("<div class = postTagHrefs></div>");

        await new Promise(function (resolve) {
          $("#crumbs a").each(function () {
            let title = $(this).attr("id", "title_info");
            header.append(title);
            let p3 = $("<div id = separate>\xa0/\xa0</div>");
            header.append(p3);
          });
          $(".post-tag a").each(function () {
            let hrefDiv = $("<div class = hrefDiv></div>");
            let title = $(this).attr("id", "title_info");
            hrefDiv.append(title);
            footer.append(hrefDiv);
            let p3 = $("<div id = separate>\xa0/\xa0</div>");
            footer.append(p3);
          });
          resolve();
        });

        let password = $("strong+input[value]").attr("value");
        log("Password: " + password);

        let patt = /(?<=Dung lượng: )(\d+|([1-9]\d*\.?\d+))[A-Za-z]*(B|b)/g;
        let inerBoxStr = $(".box-inner-block").text();
        let imgSize = inerBoxStr.match(patt)[0];
        log(imgSize);
        let p3;
        $("p[style] a").each(function (index, value) {
          let download = $("<a>图片下载</a>")
            .attr("href", $(this)[0].href)
            .text(`图片下载链接[ ${index + 1} ]`);
          download.css({
            "color": "pink",
            "border": "1px solid transparent",
            "border-bottom-color": "#815c94"
          });
          header.append(download);
          p3 = $("<div id = separate>\xa0/\xa0</div>");
          download.after(p3);
        });
        let spanItem = $("span[itemprop]").text();
        let divTR = `解压密码:(${password})<div id = separate>\xa0/\xa0</div>图片大小:(${imgSize})<div id = separate>\xa0/\xa0</div>${spanItem}`;

        header.append(divTR);

        /* font-family: -apple-system,BlinkMacSystemFont,Tahoma,Arial,"Hiragino Sans GB","Microsoft YaHei",sans-serif; */
        addStyle(
          `ul li{list-style-type:none}body{display:block;margin:8px;background:#27282d;font-family:fantasy,sans-serif}#viewer{margin:0;padding:0}.imgbox{position:relative;overflow:hidden;box-sizing:border-box;width:100%}.imgnum{position:absolute;top:6px;left:6px;z-index:100;padding:0 6px;border-radius:2px;background:#17a1ff;background:rgba(23,161,255,.5);color:#f9f9f9}.imgs{float:left;width:100%}`
        );
        addStyle('.titleHrefs>*{margin:3px 0;}')
        //remove ad
        setInterval(function () {
          $("#viewer").prevAll().remove();
          $("#Autopage_number").remove();
        }, 100);

        $("body").empty();
        let i = 1;
        let str3 = self.location.href;
        let newStr = str3.replace(/-anh.+/g, "");
        let link = "";
        let viewer2 = $('<ul id ="viewer"></ul>');
        $("body").append(viewer2);
        viewer2.append(header);
        let n = 0;
        do {
          link = newStr + "-anh/" + i;
          let data = await Get(link);

          let image = $(".content img", data);
          image.each(function (index, item) {
            n++;
            let imgli = $('<li class = "imgbox"></li>');
            let imageItem =
              '<a data-fancybox="images" href="' +
              $(this)[0].src +
              '"><img class="imgs" src="' +
              $(this)[0].src +
              `"id="imgLocation${n - 1}` +
              '" ></a>';

            //序号
            let stringNum = "<div class = 'imgnum'>{imgnum}</div>";
            let newStringNum = stringNum.replace("{imgnum}", `${n}`);
            imgli = imgli.prepend($(newStringNum));

            imgli = imgli.append(imageItem);
            viewer2.append(imgli);
          });

          i = i + 1;
          if (i === length + 2) {
            $(document).ready(function () {
              $("#viewer").after(footer);
            });
          }
        } while (i < length + 2);

        let imgCount = $("#viewer img").length;
        log("imgCount: " + imgCount);

        $(".imgnum").each(function (index, value) {
          if (index < imgCount) {
            // log($(this));
            $(this).text(`[${index + 1}/${imgCount}]`);
          } else {
            return false;
          }
        });

        //删除标题最后一个"/"
        $(document).ready(function () {
          // $(".titleHrefs div").eq(-1).remove();
          $(".postTagHrefs #separate").eq(-1).remove();
        });
      }
    }
  }, 100);
})();
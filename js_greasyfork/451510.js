// ==UserScript==
// @name         4K集全量加載
// @namespace    https://scriptcat.org/script-show-page/442
// @version      2.4
// @description  4K集图片全量加載，可滑动和点击阅览。
// @author       LARA_SSR
// @include      /^http(s)?:\/\/pic\.netbian\.com\/4k[a-z]+\/(index_\d+.html)?$/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.staticfile.org/viewerjs/1.10.4/viewer.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/451510/4K%E9%9B%86%E5%85%A8%E9%87%8F%E5%8A%A0%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451510/4K%E9%9B%86%E5%85%A8%E9%87%8F%E5%8A%A0%E8%BC%89.meta.js
// ==/UserScript==
// Alt+F8弹窗阅览

// 匹配不含that的this这一列
// ^((?<!that).)*this((?<!that).)*$
// 或
// ^(.(?!that))*this(.(?!that))*$

// this is runoob test
// this and that is runoob test

// ^(.(?<!that))*this(.(?<!that))*$
// ^(.(?<!that))*this((?!that).)*$
// ^((?!that).)*this(.(?<!that))*$
// ^((?!that).)*this((?!that).)*$

// this is the case, not that
// runoob thatthis is the case

// 排除proxy这一列
// ^(?!.*proxy).*$

//清屏
console.clear();
let isDebugMain = true;

(async function () {
  "use strict";
  async function startMain_() {
    function addScript_(statement = null, src = null, isModule = false) {
      let mountElement = document.getElementsByTagName("head")[0];
      if (mountElement) {
        let script = document.createElement("script");
        if (src !== null) {
          script.src = src;
        } else if (statement !== null) {
          script.textContent = statement;
          if (isModule) script.type = "module";
        }
        return new Promise((resolve, reject) => {
          try {
            mountElement.appendChild(script);
            script.onerror = (e) => reject(e);
            script.onload = () => {
              resolve();
            };
          } catch (error) {
            reject(error);
          }
        });
      }
      return null;
    }

    function Get_(link) {
      return new Promise(function (resolve) {
        $.get(link, (data) => {
          resolve(data);
        });
      });
    }

    function delayPromise(ms) {
      return new Promise(function (resolve) {
        setTimeout(resolve, ms);
      });
    }

    function timeoutPromise(name, promise, ms = 1000) {
      let timeout = delayPromise(ms).then(function () {
        throw new Error(name + ": Operation timed out after " + ms + " ms");
      });
      return Promise.race([promise, timeout]);
    }
    let mainArr = [
      "https://cdn.jsdelivr.net/gh/LARASPY/hello@master/main.js",
      "https://greasyfork.org/scripts/447371-commonlymainfunctions/code/CommonlyMainFunctions.js?version=1066681",
    ];

    let fancyboxCssArrr = [
      "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0.31/dist/fancybox.css",
    ];

    let initialArrFunction = async function (arr, type) {
      for (let index in arr) {
        let data = null;
        try {
          data = await timeoutPromise(arr[index], Get_(arr[index]), 500);
          if (data) {
            console.log(`Data: ${arr[index]} finished!\n`);
          }
        } catch (error) {
          // debugger;
          console.log(error);
          if (type == "script") {
            timeoutPromise(arr[index], addScript_(null, arr[index]), 500);
          } else if (type == "css") {
            timeoutPromise(arr[index], addStyle(null, arr[index]), 500);
          }
        }
        if (data) {
          if (type == "script") {
            addScript_(data);
          } else if (type == "css") {
            GM_addStyle(data);
          }
          break;
        }
      }
    };
    await initialArrFunction(mainArr, "script");
    await initialArrFunction(fancyboxCssArrr, "css");

    addScript(
      null,
      "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0.31/dist/fancybox.umd.js"
    );
    addScript(
      null,
      "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0.31/dist/carousel.umd.js"
    );
    debugger;
    await new Promise(function (resolve) {
      let id = setInterval(() => {
        if (Fancybox && Carousel) {
          clearInterval(id);
          console.log("Fancybox JS:\n", Fancybox);
          console.log("Carousel JS:\n", Carousel);
          resolve();
        }
      }, 100);
    }).then(() => {
      let fancyBoxCssAdditon = `
      a[data-fancybox] img{cursor:zoom-in}
      .fancybox__container{--carousel-button-bg:rgb(0 0 0 / 44%);--carousel-button-svg-width:24px;--carousel-button-svg-height:24px;--carousel-button-svg-stroke-width:2.5;--carousel-button-svg-filter:none}
      .fancybox__nav{--carousel-button-svg-width:22px;--carousel-button-svg-height:22px;--carousel-button-svg-stroke-width:3}
      .fancybox__nav .carousel__button.is-prev{left:30px}
      .fancybox__nav .carousel__button.is-next{right:30px}
      .carousel__button.is-close{top:30px;right:30px}
      .fancybox__slide{padding:0}
      .fancybox__thumbs{position:absolute;bottom:0;left:0;right:0;z-index:10}
      .fancybox__thumbs .carousel__slide{padding:20px 10px;overflow:visible}
      .fancybox__thumb{border-radius:6px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.3),0 2px 4px -1px rgba(0,0,0,0.26)}
      .is-nav-selected .fancybox__thumb{transform:scale(1.25)}
      .is-nav-selected .fancybox__thumb::after{display:none}`;
      let fancyboxFullJs = `Fancybox.bind('[data-fancybox="images"]',{Toolbar:false,animated:false,dragToClose:false,showClass:false,hideClass:false,closeButton:"top",Image:{click:"close",wheel:"slide",zoom:false,fit:"cover",},Thumbs:{minScreenHeight:0,},});`;
      let fancyboxDefaultJs = `Fancybox.bind('[data-fancybox="images"]',{Thumbs:{Carousel:{fill:false,center:true,},},});`;
      let fancyboxDefaultAutoStartFalseJs = `Fancybox.bind('[data-fancybox="images"]',{Thumbs:{autoStart:false,Carousel:{fill:false,center:true,},},});`;

      // 记得修改Fancybox4 ！！！
      let fancyboxFullJsLocate = `let slideIndex=0;Fancybox.bind("[data-fancybox='images']",{Toolbar:false,animated:false,dragToClose:false,showClass:false,hideClass:false,closeButton:"top",Image:{click:"close",wheel:"slide",zoom:false,fit:"cover"},Thumbs:{minScreenHeight:0},on:{done:(fancybox,slide)=>{slideIndex=fancybox.getSlide().index;console.log("#"+fancybox.getSlide().index+"slide is loaded!")},destroy:(fancybox,slide)=>{console.log("#"+slideIndex+"slide is closed!");document.getElementById("imgLocation"+slideIndex).scrollIntoView({block:"center",behavior:"smooth",inline:"center"})}}});`;
      let fancyboxDefaultJsLocate = `let slideIndex=0;Fancybox.bind("[data-fancybox='images']",{Thumbs:{Carousel:{fill:false,center:true}},on:{done:(fancybox,slide)=>{slideIndex=fancybox.getSlide().index;console.log("#"+fancybox.getSlide().index+"slide is loaded!")},destroy:(fancybox,slide)=>{console.log("#"+slideIndex+"slide is closed!");document.getElementById("imgLocation"+slideIndex).scrollIntoView({block:"center",behavior:"smooth",inline:"center"})}}});`;
      let fancyboxDefaultAutoStartFalseJsLocate = `let slideIndex=0;Fancybox.bind("[data-fancybox='images']",{Thumbs:{autoStart:false,Carousel:{fill:false,center:true}},on:{done:(fancybox,slide)=>{slideIndex=fancybox.getSlide().index;console.log("#"+fancybox.getSlide().index+"slide is loaded!")},destroy:(fancybox,slide)=>{console.log("#"+slideIndex+"slide is closed!");document.getElementById("imgLocation"+slideIndex).scrollIntoView({block:"center",behavior:"smooth",inline:"center"})}}});`;
      if (os.isPc) {
        log("<---------Pc--------->\n");
        addStyle(fancyBoxCssAdditon);
      }
      addScript(fancyboxFullJsLocate);
    });
  }

  if (isDebugMain) console.groupCollapsed("StartMain");
  await startMain_();
  if (isDebugMain) console.groupEnd("StartMain");

  /*--------------------------body------------------------------*/
  let imgArr = [];
  let navigationBar = $("div .classify a"); //导航栏
  $("body").empty();
  $("body").append($('<ul id ="viewer" ></ul>'));
  //导航栏Css
  addStyle(
    "#titleHrefs{display:inline-block;border:1px solid;border-radius:4px;background-color:#27282d}#title_info{color:pink}#separate{display:inline-block;color:#fff}#title_count{display:inline;color:pink}"
  );
  let titleHref = async function () {
    // titleHrefs.append($("<div id = separate></div>").text(`${n}`))
    // $("#titleHrefs div").eq(-1).remove();
    let webMain = $("<div id = title_count></div>");
    webMain.append($("<a id = title_info>网站首页</a>").attr("href", "/"));
    await new Promise(function (resolve) {
      let titleHrefs = $("<div id =titleHrefs></div>");
      navigationBar.each(function (index, value) {
        let title = $(this).attr("id", "title_info");
        titleHrefs.append(title);
        // log(title);
        let p3 = $("<div id = separate>\xa0/\xa0</div>");
        titleHrefs.append(p3);
        if (1 + index == navigationBar.length) {
          $("#viewer").prepend(titleHrefs);
          resolve();
        }
      });
    }).then(() => {
      $("#titleHrefs").append(webMain);
      console.debug("imgArrLen_1: " + imgArr.length);
    });
  };
  await titleHref();

  //BodyCss
  addStyle(
    "ul li{list-style-type:none}body{background:#000}.imgbox{position:relative;overflow:hidden}.imgnum{position:absolute;font-size:75%;left:5px;top:5px;background:#17a1ff;background:rgba(23,161,255,.5);z-index:100;padding:0 5px;color:#f9f9f9;color:hsla(0,0%,97.6%,.8);border-radius:2px}"
  );

  let config = {
    sites: [
      {
        name: "琉璃神社",
        url: "https://www.liuli.uk/wp/",
        regex: /hacg\.|llss\.|liuli\./,
        commArea: "comments-area",
      },
      {
        name: "灵梦御所",
        url: "https://blog.reimu.net/",
        regex: /blog\.reimu\./,
      },
    ],
  };
  let popUpstr = (function () {
    let popUpStr =
      '<div id="popUpContent" style="display: none;"><div style="height:100%; width:100%; position:fixed; _position:absolute; top:0; z-index:99999; opacity:0.3; filter: alpha(opacity=30); background-color:#000"></div><div style="width:300px;height:300px;position:fixed;left:50%;top:50%;margin-top:-150px;margin-left:-150px;z-index:100000;background-color:#ffffff;border:1px solid #afb3b6;border-radius:10px;opacity:0.95;filter:alpha(opacity=95);box-shadow:5px 5px 20px 0px #000;"><div id="popUpLinks" style="position:absolute;left:20px;top:20px;height:260px;width:260px;overflow:auto;word-wrap:break-word;"></div><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAA5FBMVEUAAAD+/v7////9/f7////////+/v7+/v7////+/v7+/v7////+/v7+/v7////+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7////////////+/v7+/v7+/v7+/v7+/v4uje3///82ke7s9P3N5PtQoPDI4fqCu/Tu9v5Im+/6/P+VxfZgqPFNnvDp8/3f7fq42Pmnz/d1tPNvsfNkq/JCmO/4+/7X6fz19/rn8PqYx/aNwfV8uPRqrvJZpfFUovAzkO3Q5vu92/mr0fieyva92fWx0vQ6lO5pygFTAAAAJHRSTlMAmfD+RMGwgj2mknlIKR/36+XGnIyHfnJfVDk2My8S4E1CJBvTatKDAAABY0lEQVQoz4WSZ1fCMBRA05ahLPfemkspBUFwgGz3+P//x/hK6ZBzvB/ak96+kZeoGCtFK5eziitqCSfWOnM2CuWUrOyQYPc0bjM2htHXh+/ffQ4lQ6zEPoZ6TwdUp10M56EtAe5MR7y0HGAeX7Ghe6MTzIZwFtTfBrepUzw4UFSGY8CUTTMGLo3eglv58By21pRnB7aNBqTwPfWq/OVey9sH22wZXiWo6Yr3GtRl/f0IRyoPYy14v97YWjVY12BPrcK9XvhaZPUdWCoLbR35yOoW5P7R8eQ3JrmbSp6HVmSrXuTrmNYyUAs2JkL6D6YjG1PgNGXK87F4nWAsUxmL2gyH6oVD7cuhdqFg9CE4T/oPE6CsgvBOP21715AP7ugaDFK+3YD1KyUcAG47bn0TSylxFd8WDTwMMByoBSUHw+jd9/3JbQODnVExygUS7FRUksPVtdDZW8dqCZm8lc1auxcq4gc02GVGTUchmgAAAABJRU5ErkJggg==" id="popUpQuit" style="position:absolute;right:0px;top:0px;cursor: pointer;"/></div></div>';
    let siteListHtml;
    var popUpContent = document.createElement("div");
    document.body.appendChild(popUpContent);
    popUpContent.outerHTML = popUpStr;
    popUpContent = document.querySelector("#popUpContent");
    document.querySelector("#popUpQuit").onclick = function () {
      popUpContent.style.display = "none";
    };
    document.querySelector("#popUpContent>div").onclick = function () {
      popUpContent.style.display = "none";
    };
    document.addEventListener("keydown", function (e) {
      if (e.keyCode == 27) {
        popUpContent.style.display = "none";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.keyCode == 119) {
        if (e.altKey) {
          popUpContent.style.display = "block";
          var popUpLinks = document.querySelector("div#popUpLinks");
          if (!siteListHtml) {
            siteListHtml = "";
            for (var i = 0; i < config.sites.length; i++) {
              var site = config.sites[i];
              siteListHtml +=
                "<span style='font-weight:bold;color:red;'>" +
                (i + 1) +
                ":\t</span>" +
                "<a href=" +
                site.url +
                ">" +
                site.name +
                "</a><br/>";
            }
          }
          popUpLinks.innerHTML = siteListHtml;
        }
      }
    });
  })();

  console.group("group1");
  let pageStartNum = 1;
  do {
    let link = "";
    let str3 = self.location.href;
    log("str3: " + str3);
    let newStr = str3.replace(/_\d*/g, "");
    if (pageStartNum == 1) {
      link = newStr;
    } else {
      link = newStr + "index_" + pageStartNum + ".html";
    }
    log("Link: " + link);

    let data = Get(link); //这里有个返回的Promise(resolve)
    let imgSrc = $(".slist .clearfix li", await data);
    imgSrc = imgSrc.children();

    imgSrc.each(async function () {
      let LinkImgBest = "https://pic.netbian.com" + $(this).attr("href");
      let dataImgBest = await Get(LinkImgBest); //这里有个返回的Promise(resolve)
      // debugger
      let imgBest = $(".photo-pic img", dataImgBest);

      imgBest.each(function () {
        imgArr.push($(this)[0].src);
      });
    });

    log("imgArrLen_2: " + imgArr.length);

    pageStartNum = pageStartNum + 1;
  } while (pageStartNum < 4);
  console.groupEnd("group1");

  log("imgArrLen_last: " + imgArr.length);

  imgArr.forEach((item, index) => {
    let imgli = $('<li class = "imgbox"></li>');
    let imageItem =
      '<a data-fancybox="images" href="' +
      item +
      '"><img tabindex=-1 width= "100%" style="float: left;border-radius: 8px; margin: 1px" src="' +
      item +
      `"id="imgLocation${index}` +
      '" ></a>';

    //序号
    let stringNum = "<div class = 'imgnum'>{imgnum}</div>";
    let newStringNum = stringNum.replace(
      "{imgnum}",
      `[${index + 1}/${imgArr.length}]`
    );
    imgli = imgli.prepend($(newStringNum));

    imgli = imgli.append(imageItem);
    $("#viewer").append(imgli);
  });
})();

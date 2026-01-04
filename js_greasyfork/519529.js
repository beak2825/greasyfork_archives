// ==UserScript==
// @name         highlightWord
// @namespace    http://tampermonkey.net/
// @version      0.8.0
// @description  高亮关键词
// @author       DuJian
// @license      GNU GPLv3
// @match        *://*.taobao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        GM_addStyle

// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/519529/highlightWord.user.js
// @updateURL https://update.greasyfork.org/scripts/519529/highlightWord.meta.js
// ==/UserScript==

// 添加 css 样式
function addStyle() {
  let css = `
    .myClass{
      background-color: #759bf3de;
      width: 19%;
      min-height: 250px;
      display:flex;
      flex-direction: column;
      justify-content:center;align-items:center;
      position:fixed;
      top:7%;
      right:5%;
      z-index:999999999;
      padding:20px;
    }
    .myClass2{
      position: relative;
      height: 100%;
      width: 100%;
    }
    #span {
      width: 30px;
      position: absolute;
      right: -40px;
      top: 90px;
      padding: 20px 6px;
      background-color: #477effd6;
      color:#fff;
      cursor:pointer;
      text-align: center;
      display: flex;
      flex-direction: column;
    }
    #loadinbox{
      border: 10px solid #f3f3f3;
      border-top: 10px solid #3498db;
      border-radius: 50%;
      width: 8px;
      height: 8px;
      animation: spin 2s linear infinite;
      position: absolute;
      right: -27px;
      top: 0px;
      margin-top: 25px;
      display: none;
  }
    .search-wrapper{
      display:flex;
      align-items: center;
    }
    #title1{
      font-size:12px;
      color:#eaecef;
    }
    #myButton,#getdata,#turnpage,#gaoliang1,#tiaozhuan,#req1,#imggjc{
      background:#477eff;
      border:0;
      color: #ffffff; 
      padding: 10px;
      margin-top:15px;
      cursor:pointer;
    }
    #gaoliang1{
      margin-right:8px
    }
    #turnpage{
      margin-right:5px;
    }
    #stopturnpage{
      margin-right:10px;
    }
    #myButton:hover,#getdata:hover,#turnpage:hover,#download1:hover,#getopera:hover,#stopturnpage:hover,.search-button1:hover{
      color:orange
    }
      #currentkeyword{
        display: block;
        font-weight: bold;
        color: red;
        margin-top: 10px;
        text-align: left;
        padding-left: 15px;
        position: absolute;
        top: 66%;
        right: -100%;
        width: 110px;
  }
    #usetime{
      position: absolute;
      top: 50%;
      color: #11192d;
      left: -100%;
    }
    .search-input1{
      width: 130px;
      height: 25px;
      outline: none;
      margin-top: 1px;
      text-indent: 1em;
    }
    .search-button1{
      cursor:pointer;
      background: #477eff;
      color: #fff;
      width: 50px;
      height: 29px;
      outline: none;
      border: navajowhite;
      line-height: 25px;
      text-align: center;
    }
    .second-wrapper{
      text-align:center;
      position: relative;
    }
    .imghighlighttext{
      display:inline-block;
      width: 3px;
      height: 3px;
      background: #ff000042;
      position:absolute;
      z-index:9999999;
      margin-top:100px;
    }
     .highlighttheWord {
            background-color: red;
            color: black;
        }
    @keyframes spin {  
    0% { transform: rotate(0deg); }  
    100% { transform: rotate(360deg); }  
  }
    `;
  GM_addStyle(css);
}

// function createHTML() {}
//画控制面板
function drawdivbig() {
  var mydiv = document.createElement("div");
  // 设置属性
  mydiv.setAttribute("id", "myDiv");
  mydiv.setAttribute("class", "myClass");
  document.body.appendChild(mydiv);
}
function drawdiv() {
  var mydiv2 = document.createElement("div");
  // 设置属性
  mydiv2.setAttribute("id", "myDiv2");
  mydiv2.setAttribute("class", "myClass2");
  var Paneldiv = document.getElementById("myDiv");
  // 将新创建的按钮添加到div中
  Paneldiv.appendChild(mydiv2);
}
//标题
function Titile() {
  var tit = document.createElement("div");
  tit.setAttribute("id", "title1");
  tit.innerHTML =
    "<span style='text-align: center;display: inline-block;'>控制面板<br/>输入关键词后确定进行网页关键词高亮<span>";
  var Paneldiv = document.getElementById("myDiv");
  // 将新创建的按钮添加到div中
  Paneldiv.appendChild(tit);
}

//批量输入关键词
function drawbatchinputbox() {
  // 创建一个新的input元素作为搜索框
  var batchInput = document.createElement("input");
  batchInput.id = "batchinput";
  batchInput.type = "text";
  batchInput.placeholder = "输入关键词";
  batchInput.className = "search-input1";
  var batchButton = document.createElement("button");
  batchButton.textContent = "确定";
  batchButton.id = "batchButtons";
  batchButton.className = "search-button1";

  var batchButtonReset = document.createElement("button");
  batchButtonReset.textContent = "重置";
  batchButtonReset.id = "batchButtonResets";
  batchButtonReset.className = "search-button1";

  // 创建一个包裹元素来容纳输入框和按钮
  var batchWrapper = document.createElement("div");
  batchWrapper.className = "search-wrapper";
  // 将搜索框和按钮添加到包裹元素中
  batchWrapper.appendChild(batchInput);
  batchWrapper.appendChild(batchButton);
  batchWrapper.appendChild(batchButtonReset);
  var Paneldiv = document.getElementById("myDiv");
  Paneldiv.appendChild(batchWrapper);
}

//画输入关键词
function drawsecondbox() {
  // 创建一个新的按钮元素
  var newButton2 = document.createElement("button");
  newButton2.setAttribute("id", "gaoliang1");
  newButton2.innerHTML = "跳转文字关键词";

  // 创建一个新的按钮元素
  var newButton3 = document.createElement("button");
  newButton3.setAttribute("id", "req1");
  newButton3.style.display = "none";
  newButton3.innerHTML = "开始图片识别";
  // 创建一个新的按钮元素
  var newButton4 = document.createElement("button");
  newButton4.setAttribute("id", "imggjc");
  newButton4.style.display = "none";
  newButton4.innerHTML = "跳转图片关键词";

  var secondWrapper = document.createElement("div");
  secondWrapper.className = "second-wrapper";
  secondWrapper.id = "secondwrapper";
  secondWrapper.innerHTML =
    '<label id="currentkeyword"></label><label id="usetime"></label>';
  // 将搜索框和按钮添加到包裹元素中
  secondWrapper.appendChild(newButton2);
  secondWrapper.appendChild(newButton3);
  secondWrapper.appendChild(newButton4);
  var Paneldiv = document.getElementById("myDiv");
  Paneldiv.appendChild(secondWrapper);
}
function drawloading() {
  var loadinbox = document.createElement("button");
  loadinbox.setAttribute("id", "loadinbox");
  var secondWrapper = document.getElementById("secondwrapper");
  secondWrapper.appendChild(loadinbox);
}
// 显示loading
function showLoading() {
  var loadinbox = document.getElementById("loadinbox");
  console.log(loadinbox, "loadinbox");
  loadinbox.style.display = "flex";
}

// 隐藏loading
function hideLoading() {
  var loading = document.getElementById("loadinbox");
  loading.classList.add("fade-out");
  setTimeout(function () {
    loading.style.display = "none";
    loading.classList.remove("fade-out");
  }, 300); // 等待淡出效果完成后移除元素
}
/**
 * 请求loading
 */
function httpLoading() {
  var httpLoadingbox = document.createElement("div");
  httpLoadingbox.setAttribute("id", "loading");
  httpLoadingbox.setAttribute("class", "loading-overlay");
  httpLoadingbox.innerHTML = `<div class="loading-content">loading...</div>`;
  var Paneldiv = document.getElementById("myDiv2");
  // 将新创建的按钮添加到div中
  Paneldiv.appendChild(httpLoadingbox);
}
(function () {
  "use strict";
  //先导入jq
  // var script = document.createElement("script");
  // (script.src = "https://code.jquery.com/jquery-3.0.0.min.js"),
  //   document.head.appendChild(script);
  // document.head.appendChild(script)
  //画一个控制面板 里面加按钮
  /***全局变量*****/
  var dataarr = [];
  var dataarr2 = [];
  var currentIndexText = 0;
  var currentIndexImg = 0;
  var scrollHeight = 2000;
  var timerInterval = null;
  localStorage.setItem("batchval", "");
  localStorage.setItem("batchvalindex", "");
  /***全局变量*****/
  drawdivbig();
  drawdiv();
  Titile(); //标题
  drawbatchinputbox();
  drawsecondbox();
  addStyle(); //添加样式
  drawloading();
  // 监听滚动事件 大于1800高度 出现图片识别按钮
  window.addEventListener("scroll", function () {
    // 获取滚动条垂直滚动的距离
    var scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    // console.log('滚动条高度（垂直滚动距离）: ' + scrollTop + 'px');
    if (scrollTop >= 1800) {
      this.document.getElementById("req1").style.display = "block";
    }
  });
  // 高亮网页关键词
  var batchButtons = document.getElementById("batchButtons");
  batchButtons.addEventListener("click", function () {
    highlighttheWordKeywords();
  });
  //重置网页
  var batchButtonResets = document.getElementById("batchButtonResets");
  batchButtonResets.addEventListener("click", function () {
    document.getElementById("batchinput").value = "";
    /*  // 获取所有具有指定类名的元素
    const elements = document.querySelectorAll(`.highlighttheWord`);

    // 遍历所有找到的元素并移除指定的类名
    elements.forEach((element) => {
      element.classList.remove("highlighttheWord");
    }); */
    removeHighlights();
  });
  //跳转网页高亮关键词
  var gaoliang1 = document.getElementById("gaoliang1");
  gaoliang1.addEventListener("click", function () {
    scrollToHighlighttheWord();
  });
  var req1 = document.getElementById("req1");
  req1.addEventListener("click", function () {
    let searchKeyword = document.getElementById("batchinput").value;
    if (!searchKeyword) {
      alert("请先输入关键词！");
    } else {
      document.getElementById("currentkeyword").style.display = "none";
      var imgHtml =
        document.querySelector(".descV8-richtext") ||
        document.querySelector(".descV8-container");
      // var imgArr = imgHtml.querySelectorAll(".lazyload");
      var imgArr = imgHtml.querySelectorAll("img");
      var charityHtml = document.querySelector(".descV8-charity"); //tb-宝贝公益
      var charityHeight = charityHtml ? charityHtml.offsetHeight : 0;
      console.log(charityHeight, "charityHeight");
      // 获取所有p标签
      const pTags = imgHtml.querySelectorAll("p");
      // 过滤出不包含img的p标签
      const pTagsWithoutImg = [...pTags].filter(
        (pTag) => !pTag.querySelector("img")
      );
      // 输出不包含img的p标签
      console.log(pTagsWithoutImg,'pTagsWithoutImg')
      var ptotalHeight = 0; 
      if(pTagsWithoutImg.length>0){
        for (let i = 0; i < pTagsWithoutImg.length; i++) {
          ptotalHeight += pTagsWithoutImg[i].offsetHeight;
        }
      }
      console.log(ptotalHeight, 'ptotalHeight')
      var itemsArr = [];
      var itemsHeightArr = []; //高度偏移值 直接赋值
      var scaleArr = []; //图片缩放比例值
      var totalHeight = 0; // 初始化总高度
      // console.log(imgHtml);
      var obj = {};
      showLoading();
      var seconds = 0;
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      timerInterval = setInterval(() => {
        // console.log(`当前秒数: ${seconds}`);
        seconds++;
        var usetime = document.getElementById("usetime");
        usetime.innerHTML = "识别图片用时" + seconds + "s";
      }, 1000);
      console.log(imgArr, "imgArr");
      if (imgArr.length > 0) {
        for (var i = 0; i < imgArr.length; i++) {
          let imgSingleSrc = imgArr[i].currentSrc;
          let rules = ["https://g.alicdn.com/s.gif"].includes(imgSingleSrc); //排除某些规格图片
          //如果有这个 <div class="descV8-richtext"> 说明有offsetTop
          if(document.querySelector(".descV8-richtext") && !rules){
              itemsArr.push({
                currentSrc: imgArr[i].currentSrc,
                width: imgArr[i].offsetWidth,
                height: imgArr[i].offsetHeight,
                offsetTop: imgArr[i].offsetTop, //Top偏移量
                scale: Number(
                  (imgArr[i].naturalWidth / imgArr[i].offsetWidth).toFixed(2)
                ), //比例
              });
          }
          else if (charityHtml) {
            //公益宝贝
            if (i == 0 && !rules) {
              itemsArr.push({
                currentSrc: imgArr[i].currentSrc,
                width: imgArr[i].offsetWidth,
                height: imgArr[i].offsetHeight,
                offsetTop: 0 + charityHeight - imgArr[0].offsetHeight, //Top偏移量
                scale: Number(
                  (imgArr[i].naturalWidth / imgArr[i].offsetWidth).toFixed(2)
                ), //比例
              });
            } else if (i > 0 && !rules) {
              totalHeight += imgArr[i - 1].offsetHeight;
              itemsArr.push({
                currentSrc: imgArr[i].currentSrc,
                width: imgArr[i].offsetWidth,
                height: imgArr[i].offsetHeight,
                offsetTop: totalHeight + charityHeight - imgArr[0].offsetHeight, //Top偏移量
                scale: Number(
                  (imgArr[i].naturalWidth / imgArr[i].offsetWidth).toFixed(2)
                ), //比例
              });
            }
          } else {
            if (i == 0 && !rules) {
              itemsArr.push({
                currentSrc: imgArr[i].currentSrc,
                width: imgArr[i].offsetWidth,
                height: imgArr[i].offsetHeight,
                offsetTop: 0 + charityHeight, //Top偏移量
                scale: Number(
                  (imgArr[i].naturalWidth / imgArr[i].offsetWidth).toFixed(2)
                ), //比例
              });
            } else if (i > 0 && !rules) {
              totalHeight += imgArr[i - 1].offsetHeight;
              itemsArr.push({
                currentSrc: imgArr[i].currentSrc,
                width: imgArr[i].offsetWidth,
                height: imgArr[i].offsetHeight,
                offsetTop: totalHeight + charityHeight, //Top偏移量
                scale: Number(
                  (imgArr[i].naturalWidth / imgArr[i].offsetWidth).toFixed(2)
                ), //比例
              });
            }
          }
        }
        console.log(itemsArr, "itemsArritemsArr");
        if (itemsArr.length > 0) {
          // 比如50个图片url，创建5个并发队列，每个队列10个url（这10个url排队请求，一个结束后再发起另一个）
          // 示例使用
          processURLsInConcurrency(itemsArr, 5).then(() => {
            console.log("All links have been finished.");
            var imggjc = document.getElementById("imggjc");
            const imgtextarr = document.querySelectorAll(".imghighlighttext");
            imggjc.style.display = "block";
            hideLoading();
            clearInterval(timerInterval);
            var labelkeyword = document.getElementById("currentkeyword");
            labelkeyword.innerHTML = `所有图片关键词识别完成,共${imgtextarr.length}处.`;
            document.getElementById("currentkeyword").style.display = "block";
          });

          /* //直接并发执行
          for (let index in itemsArr) {
            asyncOperation2(itemsArr[index], index);
            if(index+1 == itemsArr.length){
              console.log(index,'indexindex')
              console.log("All links have been finished.");
              //识别出来以后出现跳转图片关键词按钮
              var imggjc = document.getElementById("imggjc");
              imggjc.style.display = "block";
              hideLoading();
              clearInterval(timerInterval);
              var labelkeyword = document.getElementById("currentkeyword");
              labelkeyword.innerHTML = "所有图片关键词识别完成.";
              document.getElementById("currentkeyword").style.display = "block";
            }
          } */
          //单线程排队执行
          /* processItems(itemsArr).then(() => {
            console.log("All links have been finished.");
            //识别出来以后出现跳转图片关键词按钮
            var imggjc = document.getElementById("imggjc");
            imggjc.style.display = "block";
            hideLoading();
            clearInterval(timerInterval);
            var labelkeyword = document.getElementById("currentkeyword");
            labelkeyword.innerHTML = "所有图片关键词识别完成.";
            document.getElementById("currentkeyword").style.display = "block";
          }); */
        }
      }
    }
  });
  //跳转图片关键词
  var imggjcbtn = document.getElementById("imggjc");
  imggjcbtn.addEventListener("click", function () {
    highlighttheWordKeywordsImg();
  });

  async function processURLsInConcurrency(urls, concurrency) {
    const queueSize = 20; // 每个队列的大小
    const numQueues = Math.ceil(urls.length / queueSize); // 计算所需队列数量
    const queues = Array.from({ length: numQueues }, () => []);

    // 将URL分配到各个队列中
    for (let i = 0; i < urls.length; i++) {
      const queueIndex = Math.floor(i / queueSize);
      queues[queueIndex].push(urls[i]);
    }
    console.log(queues, "queuesqueues");
    const results = [];
    for (let i = 0; i < queues.length; i++) {
      results.push(processQueue(queues[i], concurrency));
    }
    // 等待所有队列处理完成
    await Promise.all(results);
  }

  async function processQueue(queue, concurrency) {
    // console.log(queue,'processQueueprocessQueueprocessQueue')
    const limit = concurrency;
    let index = 0;

    async function processNext() {
      if (index >= queue.length) return;
      const item = queue[index++];
      try {
        await asyncOperation(item, index); // 假设这是一个处理URL的异步函数
        await processNext(); // 递归调用以处理下一个URL
      } catch (error) {
        console.error(`Error processing ${item.currentSrc}:`, error);
      }
    }

    const promises = [];
    for (let i = 0; i < limit; i++) {
      promises.push(processNext());
    }

    await Promise.all(promises);
  }

  // 假设这是一个处理单个URL的异步函数
  async function processURL(url) {
    return new Promise((resolve, reject) => {
      // 模拟异步操作，例如网络请求
      setTimeout(() => {
        console.log(`Processed ${url}`);
        resolve();
      }, Math.random() * 1000); // 随机延迟以模拟不同的处理时间
    });
  }

  //异步处理
  async function processItems(items) {
    for (let index in items) {
      await asyncOperation(items[index], index);
    }
  }
  async function asyncOperation(item, aindex) {
    // console.log(item, "iiiiiiii");
    let bindex = Number(aindex) + 1;
    console.log(`请求第${bindex} 张图片`);
    // 这是一个异步操作，比如网络请求或其他异步任务
    return new Promise((resolve) => {
      /*  let ocr_text = [
        "宽松版型",
        "休闲随性感",
        "宽松版型让你活动自在不设限",
        "UNBLIEVIBLE",
        "OUNLLSAN",
        "SWLLHUPPO",
      ];

      let ocr_pos = [
        [
            [
                161.0,
                204.0
            ],
            [
                671.0,
                204.0
            ],
            [
                671.0,
                316.0
            ],
            [
                161.0,
                316.0
            ]
        ],
        [
            [
                701.0,
                208.0
            ],
            [
                1339.0,
                208.0
            ],
            [
                1339.0,
                312.0
            ],
            [
                701.0,
                312.0
            ]
        ],
        [
            [
                326.0,
                364.0
            ],
            [
                1162.0,
                364.0
            ],
            [
                1162.0,
                418.0
            ],
            [
                326.0,
                418.0
            ]
        ],
        [
            [
                528.0,
                1116.0
            ],
            [
                966.0,
                1116.0
            ],
            [
                966.0,
                1158.0
            ],
            [
                528.0,
                1158.0
            ]
        ],
        [
            [
                864.0,
                1166.0
            ],
            [
                925.0,
                1166.0
            ],
            [
                925.0,
                1186.0
            ],
            [
                864.0,
                1186.0
            ]
        ],
        [
            [
                874.0,
                1182.0
            ],
            [
                962.0,
                1182.0
            ],
            [
                962.0,
                1202.0
            ],
            [
                874.0,
                1202.0
            ]
        ]
    ]
      */
      setTimeout(() => {
        // 构建form-data对象
        var formData = {
          imgURL: item.currentSrc,
        };

        // 将form-data对象转换为查询字符串
        var queryString = Object.keys(formData)
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(formData[key])
          )
          .join("&");
        // 发送POST请求
        console.log("send httpRequest");
        GM_xmlhttpRequest({
          method: "POST",
          url: "http://saicjg.com:5090/ocr_from_url",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: queryString,
          onload: function (response) {
            if (response.status === 200) {
              console.log("请求成功!");
              let responseText = JSON.parse(response.responseText);
              console.log(responseText);
              let ocr_text = responseText.ocr_text;
              let ocr_pos = responseText.ocr_pos;
              /*  console.log(ocr_text, "ocr_text");
              console.log(ocr_pos, "ocr_pos"); */
              if (ocr_text && ocr_text.length > 0) {
                var keywordIndex;
                let searchKeyword = document.getElementById("batchinput").value;
                console.log(searchKeyword, "searchKeyword");
                //返回包含文字位置 数组
                var indices = findIndicesOfElementsContainingText(
                  ocr_text,
                  searchKeyword
                ); // 输出: [2, 5]

                // console.log(indices, "返回包含文字位置 数组");
                var posarr = [];
                if (indices.length > 0) {
                  indices.forEach((element) => {
                    posarr.push(ocr_pos[element]);
                  });
                }
                // console.log(posarr, "文在图片的坐标集合");
                //将二维数组转化为一维
                var drawpos = [];
                if (posarr.length > 0) {
                  posarr.forEach((element) => {
                    drawpos.push(element[0].concat(element[2]));
                  });
                }
                console.log(drawpos, "文字在图片的坐标集合---转换后的一维数组");
                if (drawpos.length > 0) {
                  // 画图
                  //坐标数据
                  // var canvas = document.getElementById('drawcanvas') //写死了画布id
                  var canvas = document.createElement("canvas");
                  var context = canvas.getContext("2d"); //getContext() 方法可返回一个对象
                  canvas.width = item.width; // 注意：没有单位 设置画布大小与回显图片一致
                  canvas.height = item.height; // 注意：没有单位
                  canvas.className = "canvasEle";
                  canvas.style.position = "absolute";
                  //1 0开始 2 前面2个屏幕
                  canvas.style.top = item.offsetTop + "px"; //960*第几个图
                  canvas.style.zIndex = "99999";
                  context.strokeStyle = "#72041b"; //图形边框的填充颜色
                  context.lineWidth = 4; //用宽度为 5 像素的线条来绘制矩形：
                  context.textAlign = "center";
                  let scale = item.scale;
                  if (drawpos.length > 0) {
                    drawpos.forEach((el, index) => {
                      var span1 = document.createElement("span");
                      span1.setAttribute("class", "imghighlighttext");
                      span1.style.left = parseInt(el[0] / scale) + "px";
                      span1.style.top =
                        parseInt(el[1] / scale) +
                        parseInt((el[3] - el[1]) / scale) +
                        item.offsetTop +
                        "px";
                      document
                        .querySelector(".descV8-container")
                        .appendChild(
                          span1,
                          document.querySelector(".descV8-container").firstChild
                        ); // 将canvas元素添加到body中
                      context.strokeRect(
                        parseInt(el[0] / scale),
                        parseInt(el[1] / scale),
                        parseInt((el[2] - el[0]) / scale),
                        parseInt((el[3] - el[1]) / scale)
                      ); //绘制矩形（无填充）参数分别代表下x,y，长，宽 要几个就画几次
                    });
                    var imggjc = document.getElementById("imggjc");
                    imggjc.style.display = "block";
                  }
                  if (document.querySelector(".descV8-richtext")) {
                    document
                      .querySelector(".descV8-richtext")
                      .appendChild(
                        canvas,
                        document.querySelector(".descV8-richtext").firstChild
                      ); // 将canvas元素添加到body中
                  }
                  if (document.querySelector(".descV8-container")) {
                    document
                      .querySelector(".descV8-container")
                      .appendChild(
                        canvas,
                        document.querySelector(".descV8-container").firstChild
                      ); // 将canvas元素添加到body中
                  }
                }
                if (!indices.length) {
                  setTimeout(() => {
                    console.log(`Processing item: ${item.currentSrc}`);
                    resolve();
                  }, 200); // 假设每个操作需要15秒钟
                } else {
                  resolve();
                }
              } else {
                resolve();
              }
            } else {
              console.error("Error:", response.statusText);
              // 在数据加载完成后调用
              clearInterval(timerInterval);
              hideLoading();
              alert("图片识别接口加载报错!");
            }
          },
          onerror: function (error) {
            console.error("Error:", error.statusText);
            // 在数据加载完成后调用
            clearInterval(timerInterval);
            hideLoading();
          },
        });
      }, 100); // 假设每个操作需要1秒钟
    });
  }
  function asyncOperation2(item, aindex) {
    let bindex = Number(aindex) + 1;
    console.log(`请求第${bindex} 张图片`);
    // 这是一个异步操作，比如网络请求或其他异步任务
    return new Promise((resolve) => {
      // 构建form-data对象
      var formData = {
        imgURL: item.currentSrc,
      };

      // 将form-data对象转换为查询字符串
      var queryString = Object.keys(formData)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(formData[key])
        )
        .join("&");
      // 发送POST请求
      console.log("send httpRequest");
      GM_xmlhttpRequest({
        method: "POST",
        url: "http://saicjg.com:5090/ocr_from_url",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: queryString,
        onload: function (response) {
          if (response.status === 200) {
            console.log("请求成功!");
            let responseText = JSON.parse(response.responseText);
            console.log(responseText);
            let ocr_text = responseText.ocr_text;
            let ocr_pos = responseText.ocr_pos;
            /*  console.log(ocr_text, "ocr_text");
            console.log(ocr_pos, "ocr_pos"); */
            if (ocr_text && ocr_text.length > 0) {
              var keywordIndex;
              let searchKeyword = document.getElementById("batchinput").value;
              console.log(searchKeyword, "searchKeyword");
              //返回包含文字位置 数组
              var indices = findIndicesOfElementsContainingText(
                ocr_text,
                searchKeyword
              ); // 输出: [2, 5]

              console.log(indices, "返回包含文字位置 数组");
              var posarr = [];
              if (indices.length > 0) {
                indices.forEach((element) => {
                  posarr.push(ocr_pos[element]);
                });
              }
              console.log(posarr, "文在图片的坐标集合");
              //将二维数组转化为一维
              var drawpos = [];
              if (posarr.length > 0) {
                posarr.forEach((element) => {
                  drawpos.push(element[0].concat(element[2]));
                });
              }
              console.log(drawpos, "文字在图片的坐标集合---转换后的一维数组");
              if (drawpos.length > 0) {
                // 画图
                //坐标数据
                // var canvas = document.getElementById('drawcanvas') //写死了画布id
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d"); //getContext() 方法可返回一个对象
                canvas.width = item.width; // 注意：没有单位 设置画布大小与回显图片一致
                canvas.height = item.height; // 注意：没有单位
                canvas.className = "canvasEle";
                canvas.style.position = "absolute";
                //1 0开始 2 前面2个屏幕
                canvas.style.top = item.offsetTop + "px"; //960*第几个图
                canvas.style.zIndex = "99999";
                context.strokeStyle = "#72041b"; //图形边框的填充颜色
                context.lineWidth = 4; //用宽度为 5 像素的线条来绘制矩形：
                context.textAlign = "center";
                let scale = item.scale;
                if (drawpos.length > 0) {
                  drawpos.forEach((el, index) => {
                    var span1 = document.createElement("span");
                    span1.setAttribute("class", "imghighlighttext");
                    span1.style.left = parseInt(el[0] / scale) + "px";
                    span1.style.top =
                      parseInt(el[1] / scale) +
                      parseInt((el[3] - el[1]) / scale) +
                      item.offsetTop +
                      "px";
                    document
                      .querySelector(".descV8-container")
                      .appendChild(
                        span1,
                        document.querySelector(".descV8-container").firstChild
                      ); // 将canvas元素添加到body中
                    context.strokeRect(
                      parseInt(el[0] / scale),
                      parseInt(el[1] / scale),
                      parseInt((el[2] - el[0]) / scale),
                      parseInt((el[3] - el[1]) / scale)
                    ); //绘制矩形（无填充）参数分别代表下x,y，长，宽 要几个就画几次
                  });
                  var imggjc = document.getElementById("imggjc");
                  imggjc.style.display = "block";
                }
                if (document.querySelector(".descV8-richtext")) {
                  document
                    .querySelector(".descV8-richtext")
                    .appendChild(
                      canvas,
                      document.querySelector(".descV8-richtext").firstChild
                    ); // 将canvas元素添加到body中
                }
                if (document.querySelector(".descV8-container")) {
                  document
                    .querySelector(".descV8-container")
                    .appendChild(
                      canvas,
                      document.querySelector(".descV8-container").firstChild
                    ); // 将canvas元素添加到body中
                }
              }
              if (!indices.length) {
                setTimeout(() => {
                  console.log(`Processing item: ${item.currentSrc}`);
                  resolve();
                }, 500); // 假设每个操作需要15秒钟
              } else {
                resolve();
              }
            } else {
              resolve();
            }
          } else {
            console.error("Error:", response.statusText);
            // 在数据加载完成后调用
            clearInterval(timerInterval);
            hideLoading();
            alert("图片识别接口加载报错!");
          }
        },
        onerror: function (error) {
          console.error("Error:", error.statusText);
          // 在数据加载完成后调用
          clearInterval(timerInterval);
          hideLoading();
        },
      });
    });
  }
  function highlighttheWordKeywords() {
    console.log("glglgl");
    // 获取用户输入的关键词
    const containerText = document.getElementsByClassName("main--XyozDD28")[0];
    const keyword = document.getElementById("batchinput").value.trim();
    if (!keyword) {
      alert("请输入关键词！");
      return;
    }
    // 获取页面内容并清除之前的高亮
    // 获取所有具有指定类名的元素
    const elements = document.querySelectorAll(`.highlighttheWord`);
    // 遍历所有找到的元素并移除指定的类名
    elements.forEach((element) => {
      element.classList.remove("highlighttheWord");
    });
    // 创建正则表达式，忽略大小写
    const regex = new RegExp(keyword, "gi");

    // 替换匹配的关键词为带有高亮的HTML
    containerText.innerHTML = containerText.innerHTML.replace(
      regex,
      (match) => `<em class="highlighttheWord">${match}</em>`
    );
    containerText.innerHTML = containerText.innerHTML.replace(
      regex,
      (match) => `<em class="highlighttheWord">${match}</em>`
    );
  }
  function scrollToHighlighttheWord() {
    const keyword = document.getElementById("batchinput").value.trim();
    if (!keyword) {
      alert("请输入关键词后按确定！");
      return;
    }
    // 获取第一个高亮的元素
    const highlighttheWorded = document.querySelectorAll(".highlighttheWord");
    console.log(highlighttheWorded, "highlighttheWorded");
    if (highlighttheWorded.length > 0) {
      if (currentIndexText < highlighttheWorded.length) {
        // 滚动到该元素
        highlighttheWorded[currentIndexText].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // 更新索引，以便下一次点击时遍历下一项
        currentIndexText++;
      } else {
        alert("已经到了最后一个关键词了！");
      }
    } else {
      alert("在网页文字中没有找到高亮关键词或输入关键词后按确定重新查询！");
    }
  }
  function highlighttheWordKeywordsImg() {
    console.log("glImg");
    var imgtextarr = document.querySelectorAll(".imghighlighttext");
    console.log(currentIndexImg, "currentIndexImg");
    if (imgtextarr.length > 0) {
      if (currentIndexImg < imgtextarr.length) {
        // 滚动到该元素
        imgtextarr[currentIndexImg].scrollIntoView({ block: "end" });
        /* scrollIntoView({
          behavior: "smooth",
          block: "center",
        }); */
        // 更新索引，以便下一次点击时遍历下一项
        currentIndexImg++;
      } else {
        alert("已经到了最后一个关键词了！");
        // 滚动到该元素
        currentIndexImg = 0;
        // imgtextarr[currentIndexImg].scrollIntoView({block: "end"});
      }
    }
  }

  function findIndicesOfElementsContainingText(array, searchText) {
    // 使用map遍历数组，返回匹配的索引
    return array.reduce((indices, element, index) => {
      // 检查当前元素是否包含搜索文本
      if (element.includes(searchText)) {
        // 如果包含，将索引添加到结果数组中
        indices.push(index);
      }
      return indices;
    }, []); // 初始化一个空数组来收集索引
  }

  function removeHighlights() {
    const highlights = document.querySelectorAll(".highlighttheWord");
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      const textNode = document.createTextNode(highlight.textContent);
      parent.replaceChild(textNode, highlight);
    });
  }
})();

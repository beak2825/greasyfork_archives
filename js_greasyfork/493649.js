// ==UserScript==
// @name         PinganGetData
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  获取业务数据
// @author       DuJian
// @license      GNU GPLv3
// @match        *://*.taobao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/pako/2.0.4/pako.es5.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/493649/PinganGetData.user.js
// @updateURL https://update.greasyfork.org/scripts/493649/PinganGetData.meta.js
// ==/UserScript==

// 添加 css 样式
function addStyle() {
  let css = `
  .myClass{
    background-color: #759bf3de;
    width: 250px;
     min-height: 250px;
      display:flex;
      flex-direction: column;
      justify-content:center;align-items:center;
      position:fixed;
      top:7%;
      /*right:8%; */
      left: -260px;
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
  .search-wrapper{
    display:flex;
    align-items: center;
  }
  #title1{
    font-size:12px;
    color:#eaecef;
  }
  #myButton,#getdata,#turnpage,#stopturnpage,#download1,#getopera{
    background:#477eff;
    border:0;
    color: #ffffff; 
    padding: 10px;
    margin-top:15px;
    cursor:pointer;
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
  .search-input1{
    width: 130px;
    height: 25px;
    outline: none;
    margin-top: 1px;
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
  #loadinbox{
    border: 10px solid #f3f3f3;
    border-top: 10px solid #3498db;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    animation: spin 2s linear infinite;
    position: absolute;
    right: 20px;
    top: 20px;
    margin-top: 25px;
    display:none;
  }
  #currentkeyword{
    display: block;
    font-weight: bold;
    color: red;
    margin-top: 10px;
    text-align: left;
    padding-left: 15px;
  }
  @keyframes spin {  
    0% { transform: rotate(0deg); }  
    100% { transform: rotate(360deg); }  
  }
  .loading-overlay {
    display: none; /* 默认隐藏遮罩层 */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 270px;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000; /* 确保遮罩层在其他内容之上 */
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease-out;
  }
   
  .loading-content {
    color: white;
    font-size: 20px;
    padding: 20px;
    display:flex;
    justify-content:center;
    align-items:center;
  }
   
  .fade-out {
    opacity: 0;
    pointer-events: none; /* 防止在透明度为0时触发点击事件 */
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
  mydiv.innerHTML = "<span id='span'>展开 <em>·</em> 收缩<span>";
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
    "<span style='text-align: center;display: inline-block;'>控制面板<br/>输入关键词后请按确定<span>";
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
  batchInput.placeholder = "关键词,英文逗号,分隔,";
  batchInput.className = "search-input1";
  var batchButton = document.createElement("button");
  batchButton.textContent = "确定";
  batchButton.id = "batchButtons";
  batchButton.className = "search-button1";
  batchButton.addEventListener("click", function () {
    var webUrl = window.location.href;
    var tbsinputbox = document.getElementById("J_Search");
    var tbsinput = tbsinputbox.getElementsByTagName("input")[0];
    var tbsbutton = tbsinputbox.getElementsByTagName("button")[0];
    var batchInput2Value = document.getElementById("batchinput").value; //批量关键词
    if (webUrl.indexOf("s.taobao.com/search") < 0) {
      //-1 网站不匹配
      alert("即刻跳转淘宝列表页搜索！");
      window.location.replace("https://s.taobao.com/search?");
    } else {
      if (batchInput2Value) {
        batchInput.setAttribute("disabled", true);
        batchValueArr = batchInput2Value.split(",");
        localStorage.setItem("batchval", JSON.stringify(batchValueArr));
        localStorage.setItem("batchvalindex", JSON.stringify(0));
        console.log(batchValueArr, "batchValueArr");
        // 在这里处理搜索事件，比如发送请求到服务器
        tbsinput.value = batchValueArr[0];
        tbsbutton.click();
      } else {
        document.getElementById("batchinput").focus();
        alert("请先输入关键词");
      }
    }
  });
  var batchButtonReset = document.createElement("button");
  batchButtonReset.textContent = "重置";
  batchButtonReset.id = "batchButtonResets";
  batchButtonReset.className = "search-button1";
  batchButtonReset.addEventListener("click", function () {
    document.getElementById("batchinput").value = ""; //批量关键词
    batchInput.setAttribute("disabled", false);
    batchInput.disabled = false;
    batchValueArr = batchInput2Value.split(",");
    localStorage.setItem("batchval", "");
    localStorage.setItem("batchvalindex", "");
    console.log(batchValueArr, "batchValueArr");
  });
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
  newButton2.setAttribute("id", "turnpage");
  newButton2.innerHTML = "自动翻页";
  var tit = document.createElement("div");
  tit.setAttribute("id", "pagesLocation");
  // 创建一个新的按钮元素
  var newButton3 = document.createElement("button");
  newButton3.setAttribute("id", "stopturnpage");
  newButton3.innerHTML = "关闭自动翻页";
  var newButton4 = document.createElement("button");
  newButton4.setAttribute("id", "download1");
  newButton4.innerHTML = "导出数据文件";

  //
  var secondWrapper = document.createElement("div");
  secondWrapper.className = "second-wrapper";
  secondWrapper.id = "secondwrapper";
  secondWrapper.innerHTML = '<label id="currentkeyword"></label>';
  // 将搜索框和按钮添加到包裹元素中
  secondWrapper.appendChild(newButton2);
  secondWrapper.appendChild(tit);
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
function draggable() {
  var mybox1 = document.getElementById("myDiv"); //获取元素
  var x, y; //鼠标相对与div左边，上边的偏移
  var isDrop = false; //移动状态的判断鼠标按下才能移动
  mybox1.onmousedown = function (e) {
    var e1 = e || window.event; //要用event这个对象来获取鼠标的位置
    x = e1.clientX - mybox1.offsetLeft;
    y = e1.clientY - mybox1.offsetTop;
    isDrop = true; //设为true表示可以移动
  };

  document.onmousemove = function (e) {
    //是否为可移动状态
    if (isDrop) {
      var e2 = e || window.event;
      var moveX = e2.clientX - x; //得到距离左边移动距离
      var moveY = e2.clientY - y; //得到距离上边移动距离
      //可移动最大距离
      var maxX = document.documentElement.clientWidth - mybox1.offsetWidth;
      var maxY = document.documentElement.clientHeight - mybox1.offsetHeight;
      //范围限定  当移动的距离最小时取最大  移动的距离最大时取最小
      //范围限定方法二
      moveX = Math.min(maxX, Math.max(0, moveX));
      moveY = Math.min(maxY, Math.max(0, moveY));
      mybox1.style.left = moveX + "px";
      mybox1.style.top = moveY + "px";
    } else {
      return;
    }
  };

  document.onmouseup = function () {
    isDrop = false; //设置为false不可移动
  };
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
  var autopageData = []; //自动翻页储存数据数组
  var senthttpdata = []; //自动翻页储存发送给后端的数据数组
  var batchValueArr = []; //全局关键词
  var witchSearKey = 0;
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
  // draggable(); //拖拽功能取消注释

  var oDiv = document.getElementById("myDiv");
  var span = document.getElementById("span");
  var a = 0;
  //定义变量a，点击开启或关闭后a加一，用奇偶数的变换来判断是改开还是改关。
  span.onclick = function () {
    if (a % 2 == 0) {
      open();
      a++;
    } else {
      close();
      a++;
    }
  };
  var timer = null;
  function open() {
    clearInterval(timer);
    timer = setInterval(function () {
      if (oDiv.offsetLeft == 0) {
        clearInterval(timer);
      } else {
        oDiv.style.left = oDiv.offsetLeft + 10 + "px";
      }
    }, 30);
  }
  function close() {
    clearInterval(timer);
    timer = setInterval(function () {
      if (oDiv.offsetLeft == -260) {
        clearInterval(timer);
      } else {
        oDiv.style.left = oDiv.offsetLeft - 10 + "px";
      }
    }, 30);
  }
  var thehttpurl = window.location.href;
  var searchurlOff = false;
  if (thehttpurl.indexOf("s.taobao.com/search")) {
    //匹配s.taobao
    searchurlOff = true;
    if (searchurlOff) {
      setTimeout(() => {
        //给框赋值
        let topsearchbox = document.getElementById("J_Search");
        if (topsearchbox) {
          var tbsearchipt = topsearchbox.getElementsByTagName("input");
          document.getElementById("smyinput").value = tbsearchipt[0].value;
        }
      }, 800);
    }
  }
  // console.log(thehttpurl, "thehttpurl");
  //监听页面按钮的点击 赋值
  setTimeout(() => {
    // 获取tb按钮元素
    var tbsearchbutton = document
      .getElementById("J_Search")
      .getElementsByTagName("button")[0];
    var tbsearchipt = document
      .getElementById("J_Search")
      .getElementsByTagName("input");
    // 添加点击事件监听器
    tbsearchbutton.addEventListener("click", function () {
      document.getElementById("smyinput").value = tbsearchipt[0].value;
    });
  }, 800);
  // 获取数据按钮元素
  // var getdataButton = document.getElementById("getdata");
  // getdataButton.addEventListener("click", function () {
  //   handlegetData();
  // });

  //自动翻页的时候获取页面商品的html数据
  let randomNumberTopFirst = getRandomInt(6211, 6680); //生成5300, 7296的随机数
  function handleAutogetData(isNeedScroll) {
    console.log("获取shuju!");
    senthttpdata = [];
    //s.taobao
    if (searchurlOff) {
      //如果是获取当前的数据先
      if (isNeedScroll) {
        //先开始滑动到底部使当前页面数据都加载显示出来(处理图片的数据！)
        window.scrollTo({
          top: randomNumberTopFirst,
          left: 0,
          behavior: "smooth",
        });
      }
      let parentElement = document.getElementsByClassName(
        "Content--contentInner--QVTcU0M"
      )[0];
      // 将HTMLCollection转换为数组
      let childElements = parentElement.children; //父元素获取子元素
      // console.log(childElements, "childElements");
      for (var i = 0; i < childElements.length; i++) {
        var childElement = childElements[i];
        //获取店铺url
        var childElementShopInfo = childElements[i].getElementsByClassName(
          "ShopInfo--shopName--rg6mGmy"
        );
        var childElementShopInfourl = childElementShopInfo[0]
          ? childElementShopInfo[0].href
          : "";
        //获取图片url
        var childElementImgPar = childElements[i].getElementsByClassName(
          "Card--mainPicAndDesc--wvcDXaK"
        );
        var childElementImg = childElementImgPar
          ? childElementImgPar[0].getElementsByClassName(
              "MainPic--mainPic--rcLNaCv"
            )[0]
          : "";
        var childElementShopImgurl = childElementImg ? childElementImg.src : "";
        //根据图片判断是否是淘宝天猫平台-根据图标图片src判断
        var childElementPlatFormImgPar = childElements[
          i
        ].getElementsByClassName("Title--title--jCOPvpf");
        var childElementPlatFormImg = childElementPlatFormImgPar
          ? childElementPlatFormImgPar[0].getElementsByClassName(
              "Title--iconPic--kYJcAc0"
            )[0]
          : "";
        var childElementPlatFormImgSrc = childElementPlatFormImg
          ? childElementPlatFormImg.src
          : "";
        // console.log(childElementPlatFormImgPar,'childElementPlatFormImgPar'); // 打印或处理每个子元素
        console.log(childElementPlatFormImgSrc);
        //字典
        /* 
            天猫-618：https://img.alicdn.com/imgextra/i4/O1CN01yJlQix1n4zwEU6IpQ_!!6000000005037-2-tps-168-42.png
            天猫：https://gw.alicdn.com/tfs/TB10a5neaL7gK0jSZFBXXXZZpXa-78-42.png
            618：https://img.alicdn.com/imgextra/i2/O1CN01eknpws1ZiTSFD5PWd_!!6000000003228-2-tps-78-42.png
        */
        var ptype;
        if(['https://img.alicdn.com/imgextra/i4/O1CN01yJlQix1n4zwEU6IpQ_!!6000000005037-2-tps-168-42.png','https://gw.alicdn.com/tfs/TB10a5neaL7gK0jSZFBXXXZZpXa-78-42.png'].includes(childElementPlatFormImgSrc)){
          ptype = '天猫'
        }else{
          ptype = '淘宝'
        }
        let obj = {
          baseURI: childElement.baseURI,
          innerText: childElement.innerText,
          innerHTML: childElement.innerHTML,
          textContent: childElement.textContent,
          detail_href: childElement.children[0]
            ? childElement.children[0].href
            : "",
          store_href: childElementShopInfourl,
          img_href: childElementShopImgurl,
          platform_type: ptype,
          // children: childElement.children,
        };
        autopageData.push(obj);
        senthttpdata.push(obj);
      }
    } else {
      let elements = document.getElementsByClassName("pc-items-item");
      dataarr = elements;
      for (let index = 0; index < elements.length; index++) {
        const item = elements[index];
        let obj = {
          baseURI: item.baseURI,
          innerText: item.innerText,
          innerHTML: item.innerHTML,
        };
        autopageData.push(obj);
        senthttpdata.push(obj);
      }
    }
    //每次翻页自动把当前页面数据发送给后台
    const compressData = zip(senthttpdata);
    const uncompressData = senthttpdata;
    httpLoading(); //画一个请求的loading
    // 发送POST请求
    console.log("fshttp");
    // 在需要显示loading时调用
    showLoading();
    //type:product_list product_detail store_list store_detail  是商品还是店铺 是列表还是详情
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://ds.saicjg.com/plugin/rtsd",
      dataType: "json",
      data: JSON.stringify({
        plat: "淘宝",
        type: "product_list",
        body: uncompressData,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      contentType: "application/json",
      onload: function (resp) {
        console.log(resp.response);
        if (resp.status === 200) {
          console.log("发送成功!");
          // 在数据加载完成后调用
          hideLoading();
        }
      },
      onerror: function (response) {
        console.log("请求失败");
        // 在数据加载完成后调用
        hideLoading();
      },
    });
    /*  console.log(autopageData);
    console.log(senthttpdata); */
  }

  // 自动翻页按钮
  var turnpageButton = document.getElementById("turnpage");
  turnpageButton.addEventListener("click", function () {
    var keywordInput = document.getElementById("batchinput");
    if (!keywordInput.hasAttribute("disabled")) {
      alert("请输入批量关键词并确定!");
      document.getElementById("batchinput").focus();
    } else {
      autoturnpage();
    }
  });
  // 停止翻页按钮
  var stopturnpageButton = document.getElementById("stopturnpage");
  stopturnpageButton.addEventListener("click", function () {
    stopTimer();
  });
  // 下载
  var downloadButton = document.getElementById("download1");
  downloadButton.addEventListener("click", function () {
    downloadCsv();
  });

  //实现自动翻页 - 下一页
  //因为会出现验证码固定时间翻页-生成随机数 翻页
  // 自动翻页随机数
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  let randomInt1 = getRandomInt(20 * 1000, 55 * 1000);
  function autoturnpage() {
    if (searchurlOff) {
      console.log("开启自动翻页!");
      showNowkeywordFn(); //展示当前关键词
      handleAutogetData(true); //把当前数据获取到
      var theloadinbox = document.getElementById("loadinbox");
      if (theloadinbox) {
        theloadinbox.style.display = "block";
      }
      setTimeout(() => {
        timeAutoturnpage();
      }, 1200);
    } else {
      var mynextpagediv = document.getElementById("J_pc-search-page-nav");
      var mynextpage = mynextpagediv.getElementsByTagName("span");
      if (mynextpage) {
        setInterval(() => {
          mynextpage[2].click();
          setInterval(() => {
            // 滚动到指定位置
            // window.scrollTo(100, randomInt1 * 5 + 2); // 滚动到(x:100, y:500)位置
            window.scrollTo({
              top: randomInt1 * 5 + 2,
              left: 0,
              behavior: "smooth",
            });
          }, 5500);
        }, randomInt1);
      }
    }
  }

  var randomInt2 = getRandomInt(13 * 1000, 46 * 1000); //生成13-46的随机数
  var randomNumber = getRandomInt(3 * 1000, 11 * 1000); //生成4-11的随机数
  var randomNumber2 = getRandomInt(7 * 1000, 13 * 1000); //生成7-13的随机数
  //test
  /* var randomInt2 = getRandomInt(1 * 1000, 3 * 1000); //生成13-46的随机数
  var randomNumber = getRandomInt(4 * 1000, 11 * 1000); //生成4-11的随机数
  var randomNumber2 = getRandomInt(7 * 1000, 13 * 1000); //生成7-13的随机数 */
  let randomNumberTop = getRandomInt(188, 4850); //生成188, 820的随机数
  let randomNumberTop2 = getRandomInt(4356, 7596); //生成5300, 7296的随机数
  var timer1 = null;
  var timer2 = null; // 滚动条第一次滚动位置
  var timer3 = null; // 滚动条第二次滚动位置
  var index = 1;
  /* y值：7300 最底部 6800 翻页这 3600 中间 800 /第一小步 */
  function timeAutoturnpage() {
    timer1 = setInterval(() => {
      var Slidingblock1 = document.getElementsByClassName(
        "J_MIDDLEWARE_FRAME_WIDGET"
      )[0]; //滑块--风控
      var nocontent = document.getElementsByClassName(
        "UnusualStatus--wrap--kbi8ePx"
      )[0]; //没数据--风控
      /* console.log(nocontent);
      console.log(Slidingblock1); */
      var snextpagediv = document.getElementsByClassName(
        "next-pagination-pages"
      )[1];
      /* 风控出现
        1、先判断是否出现滑块
        2、再判断是否还能下一页或者有 没返回数据的元素代码
      */
      if (Slidingblock1) {
        alert("出现了滑块！请人工出现");
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
        //移除滑块后 接着爬取
        autoturnpage();
        /* setTimeout(() => {
          window.location.reload(); //刷新页面
        }, 10000); */
      } else {
        //可以下一页
        if (!nocontent) {
          //如果有内容
          var nextpage = snextpagediv.getElementsByClassName("next-next");
          randomInt2 = getRandomInt(13 * 1000, 46 * 1000); //生成13-46的随机数
          randomNumber = getRandomInt(3 * 1000, 11 * 1000); //生成3-11的随机数
          randomNumber2 = getRandomInt(7 * 1000, 13 * 1000); //生成7-13的随机数
          //test
          /* randomInt2 = getRandomInt(1 * 1000, 3 * 1000); //生成13-46的随机数
          randomNumber = getRandomInt(4 * 1000, 11 * 1000); //生成4-11的随机数
          randomNumber2 = getRandomInt(7 * 1000, 13 * 1000); //生成7-13的随机数 */
          randomNumberTop = getRandomInt(800, 4966); //高度
          randomNumberTop2 = getRandomInt(4120, 7596);
          index++;
          var titdiv = document.getElementById("pagesLocation");
          if (titdiv) {
            titdiv.innerHTML = `<span style='color: rgba(0,0,0,.6);font-weight: bold;' id='nowpage'>当前所在第<em style='color:red'>${index}<em>页<span>`;
          }
          console.log("翻", index);
          if (nextpage[0] && nextpage[0].hasAttribute("disabled")) {
            //被禁止下一页说明不能再自动翻页了
            console.log("翻页到头了", index);
            index = 1;
            console.log(
              JSON.parse(localStorage.getItem("batchval")).length,
              'JSON.parse(localStorage.getItem("batchval")).length'
            );
            //如果关键词只有一个的情况-停止并导出数据
            if (JSON.parse(localStorage.getItem("batchval")).length == 1) {
              stopTimer();
              clearInterval(timer1);
              clearInterval(timer2);
              clearInterval(timer3);
              downloadCsv(); //自动导出
              //关键词多个的情况 ↓
            } else if (
              JSON.parse(localStorage.getItem("batchval")).length > 1
            ) {
              setTimeout(() => {
                //切换关键词-接着搜索
                changeSearchValue();
              }, 800);
            }
          } else {
            clearInterval(timer2);
            clearInterval(timer3);
            timer2 = setInterval(() => {
              // 滚动到指定位置
              // window.scrollTo(0, 1 + randomNumberTop ); // 滚动到(x:100, y:500)位置
              window.scrollTo({
                top: 1 + randomNumberTop,
                left: 0,
                behavior: "smooth",
              });
              console.log("获取页面数据");
              handleAutogetData(false);
              nextpage[0].click();
            }, randomNumber);
            timer3 = setInterval(() => {
              // 滚动到指定位置
              // window.scrollTo(0, 25 + randomNumberTop2);
              window.scrollTo({
                top: 25 + randomNumberTop2,
                left: 0,
                behavior: "smooth",
              });
            }, randomNumber2);
          }
        } else {
          console.log("关键词被风控了！！！");
          alert("被风控了！！！！！！试试换关键词！");
          stopTimer();
          clearInterval(timer1);
          clearInterval(timer2);
          clearInterval(timer3);
          index = 1;
          console.log(
            JSON.parse(localStorage.getItem("batchval")).length,
            'JSON.parse(localStorage.getItem("batchval")).length'
          );
          if (JSON.parse(localStorage.getItem("batchval")).length > 0) {
            setTimeout(() => {
              //切换关键词-接着搜索
              console.log("切换关键词-接着搜索");
              changeSearchValue();
            }, 800);
          }
        }
      }
    }, randomInt2);
  }
  //显示当前关键词
  function showNowkeywordFn() {
    var labelkeyword = document.getElementById("currentkeyword");
    var tbsinputbox = document.getElementById("J_Search");
    var tbsinput = tbsinputbox.getElementsByTagName("input")[0];
    labelkeyword.innerHTML = "当前关键词：" + tbsinput.value;
  }
  //下载文件
  function downloadCsv() {
    if (autopageData.length > 0) {
      //下载json文件
      /* let jsonString = JSON.stringify(autopageData);
      let blob = new Blob([jsonString], { type: "application/json" });
      let url = URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = url;
      link.download = "文件名.json";
      document.body.appendChild(link);
      // 触发下载
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); */
      //下载csv文件
      var handlearr = [];
      autopageData.forEach((item) => {
        let testdrep1 = JSON.stringify(item.innerText).replace(/\\n/g, ",");
        let dataarr1 = testdrep1.split(",");
        const uniqueArr = Array.from(new Set(dataarr1));
        var perfectarr = uniqueArr.map(function (item) {
          //去除空格
          return item.replace(/['"]/g, "");
        });
        // console.log(perfectarr, "perfectarr");
        var obj = {};
        let lens = perfectarr.length;
        perfectarr.forEach(function (element, index) {
          if (element) {
            obj["商品名称"] = perfectarr[0];
            obj["平台类型"] = item.platform_type;
            obj["店铺链接"] = item.store_href;
            obj["商品链接"] = item.detail_href;
            obj["图片链接"] = item.img_href;
            //固定数据写在发货地上面↑
            obj["发货地"] =
              lens == 6
                ? perfectarr[4]
                : lens == 7
                ? perfectarr[4]
                : lens == 8
                ? perfectarr[4]
                : lens == 9
                ? perfectarr[4]
                : lens == 10
                ? perfectarr[5]
                : lens == 13
                ? perfectarr[9]
                : lens == 14
                ? perfectarr[9]
                : lens == 15
                ? perfectarr[9]
                : lens == 16
                ? perfectarr[11]
                : lens == 17
                ? perfectarr[11]
                : "";
            if (element == "¥") {
              obj["价格"] = perfectarr[index + 1] || "";
            }
            if (element.includes("付款")) {
              obj["付款人数"] = perfectarr[index] || "";
            }
            if (index == perfectarr.length - 1) {
              obj[element] = perfectarr[perfectarr.length - 1] || "";
            }
          }
        });
        // console.log(obj, "obj");
        handlearr.push(obj);
      });
      console.log(handlearr, "handlearr");
      //列标题，逗号隔开，每一个逗号就是隔开一个单元格
      var str = `商品名称,平台类型,店铺链接,商品链接,图片链接,发货地,价格,付款人数,旗舰店名称\n`;
      //增加\t为了不让表格显示科学计数法或者其他格式
      for (let i = 0; i < handlearr.length; i++) {
        // str += `${handlearr[i] + "\t"},`;
        for (let item in handlearr[i]) {
          str += `${handlearr[i][item] + "\t"},`;
        }
        str += "\n";
      }
      //encodeURIComponent解决中文乱码
      var uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
      //通过创建a标签实现
      var link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download = "商品数据表.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("请先获取数据!");
    }
    // 由于json.stringify嵌套循环导致报错的解决函数，obj是要stringify的对象
    const circularSafeStringify = (obj) => {
      const cache = new Set();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (cache.has(value)) {
            // 当前对象已经存在于缓存中，说明存在循环引用，返回占位符或其他处理方式
            return "[Circular Reference]";
          }
          cache.add(value);
        }
        return value;
      });
    };
  }
  function stopTimer() {
    var theloadinbox = document.getElementById("loadinbox");
    if (theloadinbox) {
      theloadinbox.style.display = "none";
      // theloadinbox.innerHTML = ``;
    }
    var titdiv = document.getElementById("pagesLocation");
    if (titdiv) {
      titdiv.innerHTML = ``;
    }
    clearInterval(timer1);
    clearInterval(timer2);
    clearInterval(timer3);
    console.log("已停止自动翻页!");
  }
  function changeSearchValue() {
    console.log("接着下一个关键词。");
    let kval = JSON.parse(localStorage.getItem("batchval")); //关键词数组
    let bcindex = JSON.parse(localStorage.getItem("batchvalindex")); //关键词下标
    // console.log(kval, "kval");
    let bclens = kval.length;
    if (kval[bcindex]) {
      //设置第二个、后续关键词
      document.getElementById("smyinput").value = kval[bcindex];
      let serbtn = document.getElementById("searchButtons");
      serbtn.click(); //搜索
      autoturnpage();
      let leindex = JSON.parse(localStorage.getItem("batchvalindex")); //获取当前是数组的第几个关键词下标
      let addindex = leindex + 1; //下标加一
      localStorage.setItem("batchvalindex", JSON.stringify(addindex));
    } else {
      console.log("没有关键词了");
      stopTimer();
    }
  }
  // 显示loading
  function showLoading() {
    var loading = document.getElementById("loading");
    loading.style.display = "flex";
  }

  // 隐藏loading
  function hideLoading() {
    var loading = document.getElementById("loading");
    loading.classList.add("fade-out");
    setTimeout(function () {
      loading.style.display = "none";
      loading.classList.remove("fade-out");
    }, 300); // 等待淡出效果完成后移除元素
  }
  // 压缩
  const zip = (data) => {
    if (!data) return data;
    // 判断数据是否需要转为JSON
    const dataJson =
      typeof data !== "string" && typeof data !== "number"
        ? JSON.stringify(data)
        : data;

    // 使用Base64.encode处理字符编码，兼容中文
    const str = Base64.encode(dataJson);
    let binaryString = pako.gzip(dataJson);
    let arr = Array.from(binaryString);
    let s = "";
    arr.forEach((item, index) => {
      s += String.fromCharCode(item);
    });
    return btoa(s);
  };
  /* // 获取请求按钮元素
  var myButton = document.getElementById("myButton");
  // 添加点击事件监听器
  myButton.onclick = function () {
    // 准备要发送的数据
    const data = zip(senthttpdata); //压缩
    console.log(data, "data+++++++++++");
    httpLoading();
    // 发送POST请求
    console.log("fshttp");
    // 在需要显示loading时调用
    showLoading();
    //type:product_list product_detail store_list store_detail  是商品还是店铺 是列表还是详情
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://ds.saicjg.com/plugin/rtsd",
      dataType: "json",
      data: JSON.stringify({
        plat: "淘宝",
        type: "product_list",
        body: data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      contentType: "application/json",
      onload: function (resp) {
        console.log(resp.response);
        if (resp.status === 200) {
          console.log("发送成功!");
          // 在数据加载完成后调用
          hideLoading();
        }
      },
      onerror: function (response) {
        console.log("请求失败");
        // 在数据加载完成后调用
        hideLoading();
      },
    });
  }; */
})();

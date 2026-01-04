// ==UserScript==
// @name         ACGN股票系統每股營利外掛
// @namespace    http://tampermonkey.net/
// @version      2.702
// @description  try to take over the world!
// @author       papago & Ming & frozenmouse
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @grant        none
// @require https://greasyfork.org/scripts/33945-acgn-stock%E8%82%A1%E7%A5%A8%E4%BA%8B%E4%BB%B6%E7%9B%A3%E8%81%BD/code/ACGN-Stock%E8%82%A1%E7%A5%A8%E4%BA%8B%E4%BB%B6%E7%9B%A3%E8%81%BD.js?version=222901
// @downloadURL https://update.greasyfork.org/scripts/33781/ACGN%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/33781/ACGN%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==

//版本號為'主要版本號 + "." + 次要版本號 + 錯誤修正版本號(兩位)，ex 1.801
//修復導致功能失效的錯誤或更新重大功能提升主要或次要版本號
//優化UI，優化效能，優化小錯誤更新錯誤版本號
//一旦主要版本號或次要版本號更動，就會跳UI提是使用者更新腳本
//兩個錯誤修正版本號防止迫不得已進位到次要版本號
//版本更新會每十分鐘確認一次

let jsonObj = null;

const jsonUrl = "https://jsonbin.org/abcd1357/ACGNstock-company";

// 程式進入點
(function mainfunction() {
  //全域事件
  setTimeout(addNavItem, 500); // 新增上方按鈕
  setTimeout(checkScriptEvent, 500); // 版本確認
  setTimeout(checkMingsScriptEvent, 500); // 版本確認
  addEvent(); // 監聽main的變化並呼叫對應事件
  //setTimeout(blockAD, 500);;
})();


//Header新增按鈕並監聽
function addNavItem() {
  /*
  // 我的訂閱按鈕
  $('<div class="note"><li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="" data-toggle="dropdown" id="subMenu">' + Dict[lan].showMySubscribes + '</a><div class="dropdown-menu px-3" aria-labelledby="navbarDropdownMenuLink" style="display: none;" id="subMenuList"></div></li></div>').insertAfter($('.note')[2]);
  $('#subMenu')[0].addEventListener("click", ShowSubscribesNavItem);
  */
  // 選擇語言按鈕
  $("<div class=\"note\"><li class=\"nav-item dropdown\"><a class=\"nav-link dropdown-toggle\" href=\"\" data-toggle=\"dropdown\">" + Dict[lan].language + "</a><div class=\"dropdown-menu px-3\" aria-labelledby=\"navbarDropdownMenuLink\" style=\"display: none;\" id=\"lanmenu\"></div></li></div>").insertAfter($(".note")[2]);
  $("#lanmenu").append($("<li class=\"nav-item\"><a class=\"nav-link\" href=\"\" id=\"lantw\">台灣話</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"\" id=\"lanmarstw\">ㄏㄒㄨ</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"\" id=\"lanen\">English</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"\" id=\"lanjp\">日本語</a></li>"));
  $("#lantw")[0].addEventListener("click", () => { ChangeLanguage("tw"); });
  $("#lanmarstw")[0].addEventListener("click", () => { ChangeLanguage("marstw"); });
  $("#lanen")[0].addEventListener("click", () => { ChangeLanguage("en"); });
  $("#lanjp")[0].addEventListener("click", () => { ChangeLanguage("jp"); });

  // 關閉廣告按鈕
  $("<li class=\"nav-item\"><a class=\"nav-link\" href=\"\" id=\"adsBlock\">" + Dict[lan].adBlock + "</a></li>").insertAfter($(".note")[2]);
  $("#adsBlock")[0].addEventListener("click", blockAD);

  // 關於插件按鈕
  $("<li class=\"nav-item\"><a class=\"nav-link\" href=\"\" id=\"aboutmebtn\">" + Dict[lan].aboutScript + "</a></li>").insertAfter($(".note").last());
  $("#aboutmebtn")[0].addEventListener("click", GotoAboutMe);
}

// 監測main的變化並判斷當前屬於哪個頁面加入正確的事件監聽
function addEvent() {
    ACGNListener.AddCompanyListener(addCompanyClickListener); // 數據資訊
    ACGNListener.AddAccountInfoListener( AddTaxListener); // 稅率資料夾
    ACGNListener.AddAccountInfoListener(detectHoldStockInfo); // 持股資訊資料夾
    ACGNListener.AddStockSummaryListener(addStockSummaryListener); //
}

function getJsonObj() {
  const request = new XMLHttpRequest();
  request.open("GET", jsonUrl, false); // 同步連線 POST到該連線位址
  request.send();
  jsonObj = JSON.parse(request.responseText);
}

//---------------擋廣告---------------//
function blockAD() {
  if ($(".fixed-bottom").length === 1) {
    // 自動對所有廣告點擊關閉
    $(".media.bg-info.text.px-2.py-1.my-2.rounded .d-flex a").click();
    console.log("Triggered BlockAD");
  } else {
    setTimeout(blockAD, 500);
  }
}

/*************************************/
/************UpdateScript*************/

function checkScriptEvent() {
  // var myVersion = GM_info.script.version;
  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", checkScriptVersion);
  oReq.open("GET", "https://greasyfork.org/zh-TW/scripts/33359-acgn%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B.json");
  oReq.send();
}

function checkMingsScriptEvent() {
  const oReq2 = new XMLHttpRequest();
  oReq2.addEventListener("load", checkMingsScriptVersion);
  oReq2.open("GET", "https://greasyfork.org/zh-TW/scripts/33781-acgn%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B.json");
  oReq2.send();
}

function checkScriptVersion() {
  const obj = JSON.parse(this.responseText);
  const myVersion = GM_info.script.version;
  //console.log(obj.version.substr(0, 3) + "," + myVersion.substr(0, 3) + "," + (obj.version.substr(0, 3) > myVersion.substr(0, 3)));
  if (obj.version.substr(0, 3) > myVersion.substr(0, 3))
    $("<li class=\"nav-item\"><a class=\"nav-link btn btn-primary\" href=\"https://greasyfork.org/zh-TW/scripts/33359-acgn%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B\" id=\"UpdateScript\" target=\"Blank\">" + Dict[lan].updateScript + "</a></li>").insertAfter($(".nav-item")[$(".nav-item").length - 1]);
  else
    setTimeout(checkScriptEvent, 600000);
}

function checkMingsScriptVersion() {
  const obj = JSON.parse(this.responseText);
  const myVersion = GM_info.script.version;
  //console.log(obj.version.substr(0, 3) + "," + myVersion.substr(0, 3) + "," + (obj.version.substr(0, 3) > myVersion.substr(0, 3)));
  if (obj.version.substr(0, 3) > myVersion.substr(0, 3))
    $("<li class=\"nav-item\"><a class=\"nav-link btn btn-primary\" href=\"https://greasyfork.org/zh-TW/scripts/33781-acgn%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B\" id=\"UpdateScript\" target=\"Blank\">" + Dict[lan].updateScript + "</a></li>").insertAfter($(".nav-item")[$(".nav-item").length - 1]);
  else
    setTimeout(checkMingsScriptEvent, 600000);
}

/************UpdateScript*************/
/*************************************/
/************stockSummary*************/

function addStockSummaryListener() {
  computeAssets();
  // $(".btn.btn-secondary.mr-1").each((i, e) => e.addEventListener("click", addComputeEvent));
  // $(".page-item").each((i, e) => e.addEventListener("click", addComputeEvent));
  console.log("Triggered StockSummary");
}
//
// function addComputeEvent() {
//   setTimeout(addStockSummaryListener, 2000);
// }

function computeAssets() {
  let assets = 0;
  // var tag;
  let price;
  let hold;
  let classAssets;

  //方格模式
  if ($(".col-12.col-md-6.col-lg-4.col-xl-3").length > 0) {
    for (let i = 0; i < $(".company-card").length; ++i) {
      price = Number($(".company-card")[i].innerText.match(/\$ [0-9]+\(([0-9]+)\)/)[1]);
      hold = Number($(".company-card")[i].innerText.match(/([0-9]+).+%.+/)[1]);
      assets += price * hold;
      console.log("price = " + price + ",hold = " + hold);
    }
    console.log("本頁持股價值: " + assets);
    classAssets = $("#totalAssetsNumber");
    if (classAssets.length === 0) {
      $("<div class=\"media company-summary-item border-grid-body\" id = \"totalAssets\"><div class=\"col-6 text-right border-grid\" id = \"totalAssetsTitle\"><h2>" + Dict[lan].totalAssetsInThisPage + "</h2></div></div>").insertAfter($(".card-title.mb-1")[0]);
      $("<div class=\"col-6 text-right border-grid\" id = \"totalAssetsNumber\"><h2>$ " + assets + "</h2></div>").insertAfter($("#totalAssetsTitle")[0]);
    } else {
      $("#totalAssetsNumber")[0].innerHTML = "<h2>$ " + assets + "</h2>";
    }
  } else { //列表模式
    //console.log($(".col-8.col-lg-3.text-right.border-grid"));
    for (let j = 0; j < $(".media-body.row.border-grid-body").length; ++j) {
      price = Number($(".media-body.row.border-grid-body")[j].innerText.match(/\$ [0-9]+\(([0-9]+)\)/)[1]);
      hold = Number($(".media-body.row.border-grid-body")[j].innerText.match(/您在該公司持有([0-9]+)數量的股份/)[1]); // 找出持股量
      console.log("價= " + price + ",持= " + hold + ",總= " + (price * hold));
      assets += price * hold;
    }
    console.log("本頁持股價值: " + assets);
    classAssets = $("#totalAssetsNumber");
    if (classAssets.length === 0) {
      $("<div class=\"media company-summary-item border-grid-body\" id = \"totalAssets\"><div class=\"col-6 text-right border-grid\" id = \"totalAssetsTitle\"><h2>" + Dict[lan].totalAssetsInThisPage + "</h2></div></div>").insertAfter($(".card-title.mb-1")[0]);
      $("<div class=\"col-6 text-right border-grid\" id = \"totalAssetsNumber\"><h2>$ " + assets + "</h2></div>").insertAfter($("#totalAssetsTitle")[0]);
    } else {
      $("#totalAssetsNumber")[0].innerHTML = "<h2>$ " + assets + "</h2>";
    }
  }
  //setTimeout(computeAssets, 1000);
}

/************stockSummary*************/
/*************************************/
/**************company****************/
//---------------按鍵區---------------//
function addCompanyClickListener() {
  if ($(".d-block.h4").length === 6) {
    // 初始化 先看使用者有沒有預設打開資料夾
    folderOpenString = "fa-folder-open";
    folderCloseString = "12345678";
    chartEvent();
    numbersEvent();
    orderEvent();
    productEvent();
    directorEvent();
    logEvent();
    folderOpenString = "fa-folder";
    folderCloseString = "fa-folder-open";

    // 註冊事件
    $(".d-block.h4")[0].addEventListener("click", chartEvent); //股價趨勢
    $(".d-block.h4")[1].addEventListener("click", numbersEvent); //數據資訊
    $(".d-block.h4")[2].addEventListener("click", orderEvent); //交易訂單
    $(".d-block.h4")[3].addEventListener("click", productEvent); //產品中心
    $(".d-block.h4")[4].addEventListener("click", directorEvent); //董事會
    $(".d-block.h4")[5].addEventListener("click", logEvent); //所有紀錄
    console.log("OnclickListener Registered");
  } else {
    setTimeout(addCompanyClickListener, 500);
  }
  console.log("Triggered Company");
}

let folderOpenString;
let folderCloseString;
// 股價趨勢
function chartEvent() {
  const folderstate = $(".d-block.h4 i")[0].classList[1];
  if (folderstate === folderOpenString) {
    //console.log("Open");
    //Open Event
  } else if (folderstate === folderCloseString) {
    //Close Event
  }
}
// 數據資訊
function numbersEvent() {
  const folderstate = $(".d-block.h4 i")[1].classList[1];
  if (folderstate === folderOpenString) {
    //Open Event
    console.log("Open numbersfolder");
    setTimeout(addSomeInfo, 1000);

  } else if (folderstate === folderCloseString) {
    //Close Event
    console.log("close numbersfolder");
    deleteSomeInfo();
  }
}
// 交易訂單
function orderEvent() {
  const folderstate = $(".d-block.h4 i")[2].classList[1];
  if (folderstate === folderOpenString) {
    //console.log("Open");
    //Open Event
  } else if (folderstate === folderCloseString) {
    //Close Event
  }
}
// 產品中心
function productEvent() {
  const folderstate = $(".d-block.h4 i")[3].classList[1];
  if (folderstate === folderOpenString) {
    //console.log("Open");
    //Open Event
  } else if (folderstate === folderCloseString) {
    //Close Event
  }
}
// 董事會
function directorEvent() {
  const folderstate = $(".d-block.h4 i")[4].classList[1];
  if (folderstate === folderOpenString) {
    //console.log("Open");
    //Open Event
  } else if (folderstate === folderCloseString) {
    //Close Event
  }
}
// 所有紀錄
function logEvent() {
  const folderstate = $(".d-block.h4 i")[5].classList[1];
  if (folderstate === folderOpenString) {
    //console.log("Open");
    //Open Event
  } else if (folderstate === folderCloseString) {
    //Close Event
  }
}
// 計算每股盈餘、本益比、益本比並顯示
function addSomeInfo() {
  const stockPrice = $(".col-8.col-md-4.col-lg-2.text-right.border-grid")[0].innerHTML.match(/[0-9]+/);
  const revenue = $(".col-8.col-md-4.col-lg-2.text-right.border-grid")[3].innerHTML.match(/[0-9]+/);
  const totalStock = $(".col-8.col-md-4.col-lg-2.text-right.border-grid")[4].innerHTML.match(/[0-9]+/);
  const earnPerShare = 0.8075 * revenue / totalStock;

  if ($("#someInfo1").length !== 1) { // 防止雞巴人的雞巴操作:快速連續開關資料夾導致出現多組每股盈餘
    $("<div class=\"col-8 col-md-4 col-lg-2 text-right border-grid\" id = \"someInfo5\">" + (earnPerShare / stockPrice).toFixed(2) + "</div>").insertAfter($(".row.border-grid-body")[0].children[14 + $("canvas").length]);
    $("<div class=\"col-4 col-md-2 col-lg-2 text-right border-grid\" id = \"someInfo6\">" + Dict[lan].benefitRatio + "</div>").insertAfter($(".row.border-grid-body")[0].children[14 + $("canvas").length]);

    $("<div class=\"col-8 col-md-4 col-lg-2 text-right border-grid\" id = \"someInfo1\">" + ((earnPerShare === 0) ? "∞" : (stockPrice / earnPerShare).toFixed(2)) + "</div>").insertAfter($(".row.border-grid-body")[0].children[14 + $("canvas").length]);
    $("<div class=\"col-4 col-md-2 col-lg-2 text-right border-grid\" id = \"someInfo2\">" + Dict[lan].PERatio + "</div>").insertAfter($(".row.border-grid-body")[0].children[14 + $("canvas").length]);

    $("<div class=\"col-8 col-md-4 col-lg-2 text-right border-grid\" id = \"someInfo3\">" + earnPerShare.toFixed(2) + "</div>").insertAfter($(".row.border-grid-body")[0].children[14 + $("canvas").length]);
    $("<div class=\"col-4 col-md-2 col-lg-2 text-right border-grid\" id = \"someInfo4\">" + Dict[lan].earnPerShare + "</div>").insertAfter($(".row.border-grid-body")[0].children[14 + $("canvas").length]);

    console.log("addSomeInfo!!");
  }
}
// 清出額外新增的資訊
function deleteSomeInfo() {
  if ($("#someInfo1").length !== 1) // 無資料不須清除
    return;
  let element = document.getElementById("someInfo1");
  element.parentNode.removeChild(element);
  element = document.getElementById("someInfo2");
  element.parentNode.removeChild(element);
  element = document.getElementById("someInfo3");
  element.parentNode.removeChild(element);
  element = document.getElementById("someInfo4");
  element.parentNode.removeChild(element);
  element = document.getElementById("someInfo5");
  element.parentNode.removeChild(element);
  element = document.getElementById("someInfo6");
  element.parentNode.removeChild(element);

}

/**************company****************/
/*************************************/
/************accountInfo**************/

/*************accountInfoStockPrice***/

function detectHoldStockInfo() {
  if (jsonObj === null)
    getJsonObj();
  else {
    let i;
    let holdStockElement;
    let companyLink;
    let price;
    let hold;
    let index;
    let total = 0;
    let pageNum = 1;

    for (i = 0; i < 4 && i < $(".col-12.border-grid").length; ++i) {
      // 持股資訊只有可能在前四個col-12 border-grid中 先找出來
      if ($(".col-12.border-grid")[i].innerText.match(/擁有.+公司的.+股票/) !== null)
        break;
    }
    if (i !== 4 && i !== $(".col-12.border-grid").length && $(".col-12.border-grid")[i].innerText.match(/參考股價/) === null) { // 持股資訊未開啟  或已插入資料
      holdStockElement = $(".col-12.border-grid")[i];
      for (i = 0; i < holdStockElement.children.length; ++i) {
        if (holdStockElement.children[i].innerHTML.match(/href="(\/company[^"]+)/) !== null) {
          companyLink = holdStockElement.children[i].innerHTML.match(/href="([^"]+)/)[1];
          index = jsonObj.companys.findIndex(e => e.companyLink === companyLink);
          if (index === -1) {
            price = 0;
            hold = 0;
          } else {
            price = Number(jsonObj.companys[index].companyPrice);
            hold = Number(holdStockElement.children[i].innerText.match(/擁有.+公司的([0-9]+)股股票/)[1]);
          }
          total += price * hold;
          holdStockElement.children[i].innerHTML += "參考股價" + price + "元，有" + price * hold + "元資產。";
        }
      }
      if ($("#assetDisplayDiv").length === 0)
        $("<div id=\"assetDisplayDiv\"><p>公司股價更新時間為" + jsonObj.updateTime + "</p><p>目前共有<span id=\"totalAsset\">0</span>元資產</p></div>").insertAfter(holdStockElement.children[i - 1]);
      if ($(".page-item.active").length !== 0) // 看看是否能找出頁碼
        pageNum = $(".page-item.active")[0].innerText;
      $("#assetDisplayDiv")[0].innerHTML += "<p>第" + pageNum + "頁共有" + total + "元資產</p>";
      $("#totalAsset")[0].innerText = (Number($("#totalAsset")[0].innerText) + total);

      if ($("#clearAssetMessageBtn").length === 0) {
        $("<button class=\"btn btn-danger btn-sm\" type=\"button\" id=\"clearAssetMessageBtn\">清除總資產訊息</button>").insertAfter(holdStockElement.children[i - 1]);
        $("#clearAssetMessageBtn")[0].addEventListener("click", function() {
          $("#assetDisplayDiv").remove();
        });
      }
      if ($("#computeBtn").length === 0) {
        $("<button class=\"btn btn-danger btn-sm\" type=\"button\" id=\"computeBtn\">計算此頁資產</button>").insertAfter(holdStockElement.children[i - 1]);
        $("#computeBtn")[0].addEventListener("click", detectHoldStockInfo);
      }
    }
    // console.log("Triggered ShowSubscribesListener");
  }
  if ($("#computeBtn").length === 0)
    setTimeout(detectHoldStockInfo, 500);
}

/*************accountInfoStockPrice***/

/*************Tax*********************/
function AddTaxListener() {
  $("<div class=\"row border-grid-body\" style=\"margin-top: 15px;\"><div class=\"col-12 border-grid\" id=\"customtax\"><a class=\"d-block h4\" href=\"\" data-toggle-panel=\"customTax\">" + Dict[lan].taxCalculation + "<i class=\"fa fa-folder\" aria-hidden=\"true\"></i></a></div></div>").insertAfter($(".row.border-grid-body")[0]);
  if ($("#customtax").length > 0) {
    $("#customtax")[0].addEventListener("click", taxfolderevent);
    taxfoldericon = $("#customtax .fa")[0];
  } else {
    setTimeout(AddTaxListener, 500);
  }
  console.log("Triggered Tax");

}

let taxfoldericon;
let taxtxt;
let taxinpt;
let taxvalue;

function taxfolderevent() {

  if (taxfoldericon.classList[1] === "fa-folder") {
    taxfoldericon.classList.remove("fa-folder");
    taxfoldericon.classList.add("fa-folder-open");
    taxtxt = $("<div class=\"col-6 text-right border-grid\" id = \"taxtext\"><h5>" + Dict[lan].enterTotalAssets + "</h5></div>");
    taxtxt.insertAfter($("#customtax")[0]);
    taxinpt = $("<div class=\"col-6 text-right border-grid\" id = \"taxinputrect\"><input id=\"input-text\" class=\"form-control\" type=\"text\"></div>");
    taxinpt.insertAfter($("#taxtext")[0]);
    taxvalue = $("<div class=\"col-6 text-right border-grid\" id = \"outputtext\"><h5>" + Dict[lan].yourTax + "</h5></div><div class=\"col-6 text-right border-grid\" id = \"outputdiv\"><h5 id=\"output\">$ " + 0 + "</h5></div>");
    taxvalue.insertAfter($("#taxinputrect")[0]);
    $("#input-text").bind("input", computeTax);
  } else {
    taxfoldericon.classList.add("fa-folder");
    taxfoldericon.classList.remove("fa-folder-open");
    taxtxt.remove();
    taxinpt.remove();
    taxvalue.remove();
  }
}

const taxlimit = [10000, 100000, 500000, 1000000];
const taxalllimit = 1000000;
const taxpecent = 0.03;

function computeTax() {
  let input = $("#input-text").val().match(/[0-9]+/);
  console.log(input);
  if (!input || 0 === input.length) {
    console.log("N");
    return;
  }
  let output = 0;
  let lastlimit = 0;

  for (let i = 0;; i++) {
    let limit = taxalllimit;
    let tax = taxpecent * i;
    if (i < taxlimit.length) {
      limit = taxlimit[i] - lastlimit;
    }
    if (tax > 0.6) {
      tax = 0.6;
      output += input * tax;
      break;
    } else {
      if (input < limit) {
        output += input * tax;
        break;
      } else {
        output += limit * tax;
        input -= limit;
        lastlimit += limit;
      }
    }
  }
  $("#output").text("$ " + Math.ceil(output));

}
/*************Tax*********************/

/************accountInfo**************/
/*************************************/
/************foundationPlan***********/

/***********foundationPlanInformation*/

function getStockPrice(i, cardmode = true) {
  let intervalUp = 1;
  let temp;

  if (cardmode) {
    temp = $(".company-card-mask")[i].children[5].innerText.match(/[0-9]+/)[0];
  } else {
    temp = $(".media-body.row.border-grid-body:eq(" + i + ") .col-8.col-lg-3.text-right.border-grid:eq(3)")[0].innerText.match(/[0-9]+/)[0];
  }
  temp /= 1000;

  while (temp > intervalUp)
    intervalUp *= 2;
  return intervalUp / 2;
}

function getPersonalStockAmount(i, stockPrice, cardmode = true) {
  if (cardmode) {
    return ($(".company-card-mask")[i].children[6].innerText.match(/[0-9]+/)[0]) / stockPrice;
  } else {
    if ($(".media-body.row.border-grid-body:eq(" + i + ") .mb-1")[0].innerText.search("您尚未對此計劃進行過投資。") !== -1) {
      return 0;
    } else return $(".media-body.row.border-grid-body:eq(" + i + ") .mb-1")[0].innerText.match(/[0-9]+/)[0] / stockPrice;

  }
}
// 股權
function getStockRight(i, stockPrice, cardmode = true) {
  // (個人投資額/預估股價) / (總投資/預估股價)
  if (cardmode) {
    if ($(".company-card-mask")[i].children[6].innerText.match(/[0-9]+/)[0] === 0)
      return 0;
    return 1.0 * ($(".company-card-mask")[i].children[6].innerText.match(/[0-9]+/)[0] / stockPrice) / ($(".company-card-mask")[i].children[5].innerText.match(/[0-9]+/)[0] / stockPrice);
  } else {
    if ($(".media-body.row.border-grid-body:eq(" + i + ") .mb-1")[0].innerText.search("您尚未對此計劃進行過投資。") !== -1) {
      return 0;
    }
    return $(".media-body.row.border-grid-body:eq(" + i + ") .mb-1")[0].innerText.match(/[0-9]+/)[0] / stockPrice / ($(".media-body.row.border-grid-body:eq(" + i + ") .col-8.col-lg-3.text-right.border-grid:eq(3)")[0].innerText.match(/[0-9]+/)[0] / stockPrice);
  }
}
// 卡片版
function addInfoToCompanyCardVersion(i) {
  const stockPrice = getStockPrice(i);
  const stockAmount = getPersonalStockAmount(i, stockPrice);
  const stockRight = getStockRight(i, stockPrice);
  $("<div name=\"foundationPlanNewInfo\" class=\"row row-info d-flex justify-content-between\"><p>" + Dict[lan].foundationPlanStock + "</p><p>" + (stockRight * 100).toFixed(2) + "%" + "</p></div>").insertAfter($(".company-card-mask")[i].children[5]);
  $("<div name=\"foundationPlanNewInfo\" class=\"row row-info d-flex justify-content-between\"><p>" + Dict[lan].foundationPlanShare + "</p><p>" + Math.floor(stockAmount) + "股" + "</p></div>").insertAfter($(".company-card-mask")[i].children[5]);
  $("<div name=\"foundationPlanNewInfo\" class=\"row row-info d-flex justify-content-between\"><p>" + Dict[lan].foundationPlanStockPrice + "</p><p>$" + stockPrice + "</p></div>").insertAfter($(".company-card-mask")[i].children[5]);
}

function addInfoToCompanyListVersion(i) {
  const stockPrice = getStockPrice(i, false);
  const stockAmount = getPersonalStockAmount(i, stockPrice, false);
  const stockRight = getStockRight(i, stockPrice, false);
  $("<div name=\"foundationPlanNewInfo\" class=\"col-4 col-lg-6 text-right border-grid\"></div>").insertAfter($(".media-body.row.border-grid-body:eq(" + i + ") .col-8.col-lg-3.text-right.border-grid:eq(3)")[0]);
  $("<div name=\"foundationPlanNewInfo\" class=\"col-4 col-lg-3 text-right border-grid\">" + Dict[lan].foundationPlanStock + "</div><div class=\"col-8 col-lg-3 text-right border-grid\" id=\"customStockRight" + i + "\">" + (stockRight * 100).toFixed(2) + "%</div>").insertAfter($(".media-body.row.border-grid-body:eq(" + i + ") .col-8.col-lg-3.text-right.border-grid:eq(3)")[0]);
  $("<div name=\"foundationPlanNewInfo\" class=\"col-4 col-lg-3 text-right border-grid\">" + Dict[lan].foundationPlanShare + "</div><div class=\"col-8 col-lg-3 text-right border-grid\" id=\"customStockAmount" + i + "\">" + Math.floor(stockAmount) + "股</div>").insertAfter($(".media-body.row.border-grid-body:eq(" + i + ") .col-8.col-lg-3.text-right.border-grid:eq(3)")[0]);
  $("<div name=\"foundationPlanNewInfo\" class=\"col-4 col-lg-3 text-right border-grid\">" + Dict[lan].foundationPlanStockPrice + "</div><div class=\"col-8 col-lg-3 text-right border-grid\" id=\"customStockPrice" + i + "\">$ " + stockPrice + "</div>").insertAfter($(".media-body.row.border-grid-body:eq(" + i + ") .col-8.col-lg-3.text-right.border-grid:eq(3)")[0]);
}

const FPModeCard = "fa-th";
const FPModeList = "fa-th-list";

function addFPEvent() {
  setTimeout(checkFPInfo, 500);
  setTimeout(addFormControlEvent, 500); // 新創既有公司搜尋提示

  $(".btn.btn-secondary.mr-1")[0].addEventListener("click", () => {
    setTimeout(addFPEvent, 1000);
  }, {
    once: true
  });
  const linkitem = $(".pagination.pagination-sm.justify-content-center.mt-1 a");
  const count = linkitem.length;
  for (let i = 0; i < count; i++) {
    linkitem[i].addEventListener("click", () => {
      setTimeout(addFPEvent, 1000);
    }, {
      once: true
    });
  }
  console.log("Triggered PFEvent");
}

function checkFPInfo() {
  if ($("div[name=\"foundationPlanNewInfo\"]").length !== 0)
    return;
  if ($(".btn.btn-secondary.mr-1 i")[0].classList[1] === FPModeCard) {
    if ($(".company-card-mask").length > 0) {
      showFPCard();
    } else setTimeout(checkFPInfo, 500);
  } else if ($(".btn.btn-secondary.mr-1 i")[0].classList[1] === FPModeList) {
    if ($(".media-body.row.border-grid-body").length > 0) {
      showFPList();
    } else setTimeout(checkFPInfo, 500);
  }
}

function showFPCard() {
  const companyAmount = $(".company-card-mask").length;
  for (let i = 0; i < companyAmount; ++i)
    addInfoToCompanyCardVersion(i);
}

function showFPList() {
  const companyAmount = $(".media-body.row.border-grid-body").length;
  for (let i = 0; i < companyAmount; ++i)
    addInfoToCompanyListVersion(i);

}
/***********foundationPlanInformation*/

/***********foundationPlanSearCompany*/

function displayCompanyName(companys) {
  let displayDiv = "<div id=\"displayResult\">";
  if (companys.length !== 0) {
    displayDiv += "<a href=\"" + companys[0].companyLink + "\">" + companys[0].companyName + "</a>";
    for (let i = 1; i < companys.length; ++i)
      displayDiv += ", <a href=\"" + companys[i].companyLink + "\">" + companys[i].companyName + "</a>";
  } else {
    displayDiv += "於" + jsonObj.updateTime + "更新公司名冊";
  }
  displayDiv += "</div>";
  if ($("#displayResult").length !== 0)
    $("#displayResult").remove();
  console.log(displayDiv);
  $(displayDiv).insertAfter($(".input-group-btn"));
  $("#displayResult").css("width", "60%");
  $("#displayResult").css("height", "30px");
  $("#displayResult").css("overflow", "scroll");
  $("#displayResult").css("overflow-x", "hidden");
}

function autoCheck() {
  const searchString = $(".form-control")[0].value;
  const searchRegExp = new RegExp(searchString, "i"); // 'i' makes the RegExp ignore case

  // var companyName = [];
  let result;

  if (searchString.length !== 0) {
    result = jsonObj.companys.filter(function(e) { // Filter out any items that don't pass the
      return searchRegExp.test(e.companyName) || searchRegExp.test(e.companyTags); //  RegExp test.
    });
    /*
		companyName = result.map(function(e){
			return e.companyName;
		});
        */
  }
  displayCompanyName(result);
}

function addFormControlEvent() {
  $(".form-control").keyup(autoCheck);
  // 考慮資料更新週期極長，已有資料就不用再拿了
  if (jsonObj === null) {
    getJsonObj();
  }
}


/***********foundationPlanSearCompany*/

/************foundationPlan***********/
/*************************************/
/**************aboutMe****************/

function GotoAboutMe() {
  $(".card-block").remove();
  SetAboutMeString();
  console.log("Triggered AboutMe");

}



let aboutmestr;

function SetAboutMeString() {
  aboutmestr = "<div class=\"card-block\"><div class=\"col-5\"><h1 class=\"card-title mb-1\">關於插件</h1></div><div class=\"col-5\">by papago89 and Ming</div><hr>";

  aboutmestr += div("要離開本頁面記得點進來的那一頁以外的其他頁面<hr>");
  aboutmestr += div("本插件功能不定時增加中，目前功能有以下幾個：");
  aboutmestr += div("");
  aboutmestr += div("。在頁面<span class=\"text-info\">股市總覽</span>可以查看本頁股票總值，建議開啟<span class=\"text-info\">只列出我所持有的股票</span>。");
  aboutmestr += div("。在頁面<span class=\"text-info\">新創計畫</span>可以查看推測股價、推測股權、推測應得股數。");
  aboutmestr += div("。在頁面<span class=\"text-info\">新創計畫</span>搜尋欄鍵入文字時會提示股市總覽中是否已存在相同名稱或標籤之公司。");
  aboutmestr += div("。在各公司頁面數據資訊處增加每股盈餘、本益比、益本比。");
  aboutmestr += div("。在頁面<span class=\"text-info\">帳號資訊</span>增加稅金試算，輸入總資產後就會算出你應該繳的稅金。");
  aboutmestr += div("。在頁面<span class=\"text-info\">帳號資訊</span>增加資產換算。");
  aboutmestr += div("。按鈕<span class=\"text-info\">廣告關閉</span>隱藏所有廣告讓你什麼都看不到。");
  aboutmestr += div("。在頁面<span class=\"text-info\">關於插件</span>增加插件功能介紹，版本更新紀錄，還有廢話。");
  aboutmestr += div("。按鈕<span class=\"text-info\">點我更新插件</span>在greasyfork有新版本時會自動跳出提示大家更新。");
  aboutmestr += div("。按鈕<span class=\"text-info\">選擇語言</span>可以更改語言，不過要重新整理頁面才會生效。");
  // aboutmestr += div('。各公司頁面可以透過按鈕<span class="text-info">訂閱公司</span>訂閱，在頁面<span class="text-info">帳號資訊</span>可以直接前往已訂閱的公司。');

  aboutmestr += div("<hr>");
  aboutmestr += div("有任何問題或建議請到Discord:ACGN Stock留言");
  aboutmestr += div("<a href=\"https://greasyfork.org/zh-TW/scripts/33359-acgn%E8%82%A1%E7%A5%A8%E7%B3%BB%E7%B5%B1%E6%AF%8F%E8%82%A1%E7%87%9F%E5%88%A9%E5%A4%96%E6%8E%9B\" target=\"_blank\">更新插件</a>");

  aboutmestr += "</div>";
  aboutmestr += "<div class=\"card-block\"><div class=\"row border-grid-body\" style=\"margin-top: 15px;\"><div class=\"col-12 border-grid\" id=\"customupdate\"><a class=\"d-block h4\" href=\"\" data-toggle-panel=\"update\">更新紀錄<i class=\"fa fa-folder\" aria-hidden=\"true\"></i></a></div></div></div>";
  $(".card").append($(aboutmestr));
  $("#customupdate")[0].addEventListener("click", UpdateEvent);
  updatefoldericon = $("#customupdate .fa")[0];
}
const totaldivcount = 0;

function div(str) {
  return "<div id=\"customdiv" + totaldivcount + "\">" + str + "</div>";
}


let updatefoldericon;

function UpdateEvent() {

  if (updatefoldericon.classList[1] === "fa-folder") {
    updatefoldericon.classList.remove("fa-folder");
    updatefoldericon.classList.add("fa-folder-open");
    V_2_500();
    V_2_300();
    V_2_200();
    V_2_000();
    V_1_900();
    V_1_900();
    V_1_800();
    V_1_73();
    V_1_72();
    V_1_70();
    V_1_63();
    V_1_62();
    V_1_61before();
  } else {
    updatefoldericon.classList.add("fa-folder");
    updatefoldericon.classList.remove("fa-folder-open");
    $(".col-12.border-grid:gt(0)").remove();
  }
  console.log("Triggered UpdateInfo");

}

function V_2_500() {
  const vid = addversion(2, 500);
  const vtext = div("<span class=\"text-info\">更新腳本</span>連動到Ming，現在Ming也可以自己發布新版腳本讓大家更新了。");

  $("#" + vid).append($(vtext));
}

function V_2_300() {
  const vid = addversion(2, 300);
  const vtext = div("移除<span class=\"text-info\">訂閱</span>功能");


  $("#" + vid).append($(vtext));
}

function V_2_200() {
  const vid = addversion(2, 200);
  let vtext = div("新增<span class=\"text-info\">新創搜尋提示</span>功能");
  vtext += div("新增<span class=\"text-info\">帳號頁面持股換算資產</span>功能");


  $("#" + vid).append($(vtext));
}

function V_2_000() {
  const vid = addversion(2, 0);
  const vtext = div("新增<span class=\"text-info\">訂閱</span>功能");


  $("#" + vid).append($(vtext));
}

function V_1_900() {
  const vid = addversion(1, 900);
  const vtext = div("新增<span class=\"text-info\">選擇語言</span>");


  $("#" + vid).append($(vtext));
}

function V_1_800() {
  const vid = addversion(1, 800);
  const vtext = div("新增<span class=\"text-info\">點我更新插件</span>按鈕");


  $("#" + vid).append($(vtext));
}

function V_1_73() {
  const vid = addversion(1, 73);
  let vtext = div("<span class=\"text-info\">更新插件</span>連結現在會在新分頁開啟連結，讓原本的頁面可以繼續看股票。");
  vtext += div("修正<span class=\"text-info\">關於插件</span>中，更新紀錄排序錯亂的問題。");
  vtext += div("新增<span class=\"text-info\">新創計畫</span>下，列表模式的推測股價、推測股權、推測應得股數。");
  vtext += div("優化一些日誌顯示，讓開發人員在除錯更方便一些。");


  $("#" + vid).append($(vtext));
}

function V_1_72() {
  const vid = addversion(1, 72);
  let vtext = div("優化<span class=\"text-info\">廣告關閉</span>功能。");
  vtext += div("好像還有新增一些功能什麼的。");
  $("#" + vid).append($(vtext));
}

function V_1_70() {
  const vid = addversion(1, 70);
  const vtext = div("新增功能<span class=\"text-info\">廣告關閉</span>將會隱藏所有廣告，按過後只要不關閉頁面你就再也看不到任何廣告了，包含公告以及新發布的廣告。");
  $("#" + vid).append($(vtext));

}

function V_1_63() {
  const vid = addversion(1, 63);
  const vtext = div("修正<span class=\"text-info\">股市總覽</span>中列表模式如果出現有交易尚未完成會造成計算錯誤");
  $("#" + vid).append($(vtext));

}

function V_1_62() {
  const vid = addversion(1, 62);
  const vtext = div("新增頁面<span class=\"text-info\">關於插件</span>");
  //vtext += div('隨便一些字');
  $("#" + vid).append($(vtext));

}

function V_1_61before() {
  $("<div class=\"col-12 border-grid\" id=\"V1_61before\"><h4>版本1.61以前：</h4><div id=\"customdiv0\">新增了一些功能，不過不是很重要</div></div>").insertAfter($(".col-12.border-grid")[$(".col-12.border-grid").length - 1]);
}

function addversion(majorV, minorV) {
  const vtext = "<div class=\"col-12 border-grid\" id = \"V" + majorV + "_" + minorV + "\"><h4>版本" + majorV + "." + minorV + "：</h4></div>";
  if ($(".col-12.border-grid").length > 0) {
    $(vtext).insertAfter($(".col-12.border-grid")[$(".col-12.border-grid").length - 1]);
  } else {
    $(vtext).insertAfter($("#customupdate")[0]);
  }
  return "V" + majorV + "_" + minorV;
}

/**************aboutMe****************/
/*************Language****************/

let lan = window.localStorage.getItem("PM_language") !== null ? window.localStorage.getItem("PM_language") : "tw";

function ChangeLanguage(l) {
  if (lan === l) return;
  lan = l;
  window.localStorage.setItem("PM_language", l);
  window.location.reload();
}

const Dict = {
  tw: {
    language: "選擇語言",
    adBlock: "關閉廣告",
    aboutScript: "關於插件",
    updateScript: "更新腳本",
    totalAssetsInThisPage: "本頁股票總值：",
    benefitRatio: "益本比：",
    PERatio: "本益比：",
    earnPerShare: "每股盈餘：",
    taxCalculation: "稅金試算",
    enterTotalAssets: "輸入你的總資產：",
    yourTax: "你應繳的稅金：",
    foundationPlanStock: "當前股權應為：",
    foundationPlanShare: "當前投資應得：",
    foundationPlanStockPrice: "當前股價應為：",
    subscribe: "訂閱公司",
    unsubscribe: "取消訂閱",
    showMySubscribes: "我的訂閱",
    goToCompany: "前往",

  },
  en: {
    language: "language",
    adBlock: "Block Ad",
    aboutScript: "About Script",
    updateScript: "Update Script",
    totalAssetsInThisPage: "Total assets in this page :",
    benefitRatio: "benefit ratio :",
    PERatio: "P/E ratio :",
    earnPerShare: "Earning per share :",
    taxCalculation: "Tax calculation",
    enterTotalAssets: "Enter your total assets :",
    yourTax: "your tax :",
    foundationPlanStock: "Your stock :",
    foundationPlanShare: "your investment will get",
    foundationPlanStockPrice: "Stock price :",
    subscribe: "Subscribe",
    unsubscribe: "Unsubscribe",
    showMySubscribes: "My Subscription",
    goToCompany: "Go to company ",
  },
  jp: {
    language: "言語を選択",
    adBlock: "広告を閉じる",
    aboutScript: "プラグインについて",
    updateScript: "スクリプトを更新する",
    totalAssetsInThisPage: "このページの株式時価総額：",
    benefitRatio: "株式益回り：",
    PERatio: "株価収益率：",
    earnPerShare: "一株利益：",
    taxCalculation: "税金計算",
    enterTotalAssets: "総資産を入力する：",
    yourTax: "あなたの税金：",
    foundationPlanStock: "予想の持株比率：",
    foundationPlanShare: "予想の株式持分：",
    foundationPlanStockPrice: "予想の株価：",
    subscribe: "訂閱公司",
    unsubscribe: "取消訂閱",
    showMySubscribes: "我的訂閱",
    goToCompany: "前往",
  },
  marstw: {
    language: "顯4ㄉ語言",
    adBlock: "關ㄅ廣告",
    aboutScript: "我做ㄌ什麼",
    updateScript: "有☆版",
    totalAssetsInThisPage: "這一ya的股票一共ㄉ錢：",
    benefitRatio: "yee本比：",
    PERatio: "本yee比：",
    earnPerShare: "每ㄍ股票ㄉ或立：",
    taxCalculation: "歲金計算",
    enterTotalAssets: "你ㄉ錢：",
    yourTax: "要交ㄉ稅金：",
    foundationPlanStock: "你占多少趴：",
    foundationPlanShare: "你有多少股：",
    foundationPlanStockPrice: "股價因該4：",
    subscribe: "訂閱這ㄍ工ㄙ",
    unsubscribe: "不訂閱這ㄍ工ㄙ",
    showMySubscribes: "窩ㄉ訂閱",
    goToCompany: "窩要ㄑ找",
  }
};
/*************Language****************/

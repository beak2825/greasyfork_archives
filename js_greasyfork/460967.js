// ==UserScript==
// @name         HKUST-ESHOPPING
// @namespace    https://hkust-gz.edu.cn/
// @version      0.9.9
// @description  Eshopping for HKUST-GZ MDMF
// @author       Colinfluo
// @license      MIT
// @match        https://item.taobao.com/item.htm*
// @match        https://detail.tmall.com/item.htm*
// @match        https://trade.taobao.com/trade/itemlist/list_bought_items.htm*
// @match        https://buyertrade.taobao.com/trade/itemlist/*
// @match        https://item.jd.com/*
// @match        https://order.jd.com/center/*
// @iconURL      https://hkust-gz.edu.cn/profiles/ust/themes/custom/hkust_style_a/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layui/2.7.6/layui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @grant       GM_cookie
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/460967/HKUST-ESHOPPING.user.js
// @updateURL https://update.greasyfork.org/scripts/460967/HKUST-ESHOPPING.meta.js
// ==/UserScript==

(function () {
  "use strict";
  //============================================================================
  //#region 初始化
  const Page_Taobao = 1;
  const Page_Tmall = 2;
  const Page_JD = 10;

  const Page_Taobao_Detail = 1000;
  const Page_JD_Detail = 1001;

  const Msg_Info = 1;
  const Msg_Error = 2;
  const Msg_Success = 3;
  const Msg_Confirm = 4;

  // GM_addStyle(GM_getResourceText("css"))
  //$.getScript("https://cdnjs.cloudflare.com/ajax/libs/layui/2.7.6/layui.min.js");

  const menu_updateChat_id = GM_registerMenuCommand(
    "Update",
    function (event) {
      GM_openInTab(
        "https://greasyfork.org/zh-CN/scripts/460967-hkust-eshopping"
      );
      console.log("Click Update......");
    },
    "Update"
  );

  const script = document.createElement("link");
  script.setAttribute("rel", "stylesheet");
  script.setAttribute("type", "text/css");
  script.href =
    "https://cdnjs.cloudflare.com/ajax/libs/layui/2.7.6/css/layui.css";
  document.documentElement.appendChild(script);

  const script2 = document.createElement("link");
  script2.setAttribute("rel", "stylesheet");
  script2.setAttribute("type", "text/css");
  script2.href =
    "https://cdnjs.cloudflare.com/ajax/libs/layui/2.7.6/css/modules/layer/default/layer.min.css";
  document.documentElement.appendChild(script2);
  //css
  GM_addStyle(`
    body {
      font: 12px/1.5 tahoma,arial,Hiragino Sans GB,sans-serif !important;
    }
  `);

  let gCurrentURL = window.location.href;
  let gCurPageType = 0;
  const url = new URL(gCurrentURL);

  const gLogined = GM_getValue("loginInfo", null);
  let gServer = GM_getValue("server", null);
  let gLocalProInfo = GM_getValue("selections", null);

  //console.log("login info", gLogined, gServer, gLocalProInfo)

  let gCurPrdIDs = {};

  // let gPrdSkuID = "";
  let gShopName = "";

  const popMenus = [];
  //console.log("gCurrentURL", gCurrentURL);

  if (gCurrentURL.indexOf("//item.taobao.com/item.htm") > 0) {
    gCurPageType = Page_Taobao;
  } else if (gCurrentURL.indexOf("//detail.tmall.com/item") > 0) {
    gCurPageType = Page_Tmall;
  } else if (gCurrentURL.indexOf("//trade.taobao.com/") > 0) {
    gCurPageType = Page_Taobao_Detail;
  } else if (gCurrentURL.indexOf("//buyertrade.taobao.com/") > 0) {
    gCurPageType = Page_Taobao_Detail;
  } else if (gCurrentURL.indexOf("//item.jd.com/") > 0) {
    gCurPageType = Page_JD;
  } else if (gCurrentURL.indexOf("//order.jd.com/center/") > 0) {
    gCurPageType = Page_JD_Detail;
  }

  console.log("current page", gCurPageType);
  //#endregion
  //============================================================================
  //#region 公共函数
  function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement("div");
    m.innerHTML = msg;
    m.style.cssText =
      "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function () {
      var d = 0.5;
      m.style.webkitTransition =
        "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
      m.style.opacity = "0";
      setTimeout(function () {
        document.body.removeChild(m);
      }, d * 1000);
    }, duration);
  }

  function stringBetween(aStr, aStartStr, aEndStr) {
    const tStartPos = aStr.indexOf(aStartStr);
    const tEndPos = aStr.indexOf(aEndStr, tStartPos);
    return aStr.substring(tStartPos + aStartStr.length, tEndPos);
  }

  function downLoadFile(fileName, canvasImg) {
    const a = document.createElement("a");
    a.href = canvasImg;
    a.download = fileName;
    const e = new MouseEvent("click");
    a.dispatchEvent(e);
  }

  function pushAMenuItem(aID, aTitle = "", aCb = null) {
    popMenus.push({
      id: aID,
      title: aTitle,
      cb: aCb,
    });
  }

  function FetchData(aPath, aMethod, aDat, aCB) {
    let tURL = gServer + "/ustbuy/" + aPath;
    if (aMethod === "get") {
      if (aDat) {
        let paramsArray = [];
        //拼接参数
        Object.keys(aDat).forEach((key) =>
          paramsArray.push(key + "=" + aDat[key])
        );

        if (tURL.search(/\?/) === -1) {
          tURL += "?" + paramsArray.join("&");
        } else {
          tURL += "&" + paramsArray.join("&");
        }
      }
    }

    // console.log("send fetch", tURL);
    fetch(tURL, {
      method: aMethod,
      body: aMethod === "get" ? undefined : JSON.stringify(aDat),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((rst) => {
        // console.log("接收数据", rst);
        if (aCB) aCB(rst);
      })
      .catch((err) => {
        console.log("网络错误", err);
        ShowMessage("网络错误:" + err);
      });
  }

  function ShowMessage(aMsg, aType = Msg_Info, cb = null) {
    let title = "";
    switch (aType) {
      case Msg_Info:
        title = "提示";
        break;
      case Msg_Error:
        title = "错误";
        break;
      case Msg_Success:
        title = "成功";
        break;
      case Msg_Confirm:
        title = "确认";
        break;
      default:
        break;
    }

    if (aType === Msg_Confirm) {
      if (gCurPageType !== Page_Taobao) {
        layui.use("layer", function () {
          const layer = layui.layer;
          layer.confirm(aMsg, function (indx) {
            if (!!cb) cb();
            layer.closeAll();
          });
        });
      } else {
        const rst = confirm(aMsg);
        if (rst && cb) {
          cb();
        }
      }
    } else {
      Toast(aMsg, 2000);
    }

    console.log(title + ":" + aMsg);
  }
  //#endregion
  //============================================================================
  //#region 商品信息
  const gInfoTxt = $(`<div>
      <div id="chsInfo"></div>
      <div id="buyProcing"></div>
      <div id="buyDone"></div>
      </div>`);
  let gSelectItemsInfo = [];
  let gChoiceGroup = null;
  let gProjNo = "";

  function getSelectionTypes(aSelDom) {
    if (gCurPageType === Page_Taobao) {
      return aSelDom.getElementsByTagName("span")[0]?.innerText;
    } else if (gCurPageType === Page_Tmall) {
      ///return aSelDom.children[0].getAttribute("title");
      return aSelDom.getElementsByTagName("span")[0]?.innerText;
    } else if (gCurPageType === Page_JD) {
      return aSelDom.getElementsByTagName("a")[0]?.innerText;
    }
  }

  function setChoice(aChoice, acnt) {
    if (!aChoice) return;
    let tChoice = aChoice.toString();
    const grpIdx = tChoice.split("-");
    //console.log("aChoice", aChoice, "tChoice", tChoice);
    if (grpIdx.length !== gChoiceGroup?.children.length) {
      if (grpIdx[0] !== "0") {
        //console.log("aChoice", tChoice, "gChoiceGroup", gChoiceGroup);
        //console.log("len1:", grpIdx.length, "len2:", gChoiceGroup.children.length);
        ShowMessage("当前项面产品信息已经发生变化，请重新选择。");
        return;
      } else {
        if (gCurPageType === Page_Taobao || gCurPageType === Page_Tmall) {
          $("input[class^='countValue--']")[0].value = acnt;
        }
      }
    }

    for (let i = 0; i < gChoiceGroup?.children.length; i++) {
      let items = null;
      let idx = 0;
      if (gCurPageType === Page_Taobao || gCurPageType === Page_Tmall) {
        items = gChoiceGroup.children[i].children[1];
        idx = grpIdx[i] - 1;
        for (let j = 0; j < items?.children.length; j++) {
          if (idx === j) {
            items.children[j].classList.add("isSelected--YrA6x4Yj");
          } else {
            items.children[j].classList.remove("isSelected--YrA6x4Yj");
          }
        }
        //$("input.countValueForPC")[0].value = acnt;
        $("input[class^='countValue--']")[0].value = acnt;
      }
    }
  }

  function UpdateChoiceInfo() {
    const chosInfoDom = $("#chsInfo").empty()[0];
    let ptypes = "";
    const selectItemInfo = $(
      "<p style='font-size: 12px;color:green;'>已选择：(双击本行输入项目编号，双击单项输入备注。)</p>"
    );
    selectItemInfo.on("dblclick", (el) => {
      let comm = prompt("输入项目编号", gProjNo);
      if (comm == null || comm.trim().length < 1) return;
      gProjNo = comm.substring(0, 15);
      console.log("project num:" + gProjNo);
    });
    selectItemInfo.appendTo(chosInfoDom);
    //chosInfoDom;
    for (let i = 0; i < gSelectItemsInfo.length; i++) {
      gSelectItemsInfo[i].uebuyr_idx = i + 1;
      ptypes = gSelectItemsInfo[i].uebuyr_type;
      if (!ptypes) {
        ptypes = "当前商品";
      }
      //console.log("gSelectItemsInfo[i]", gSelectItemsInfo[i]);
      let lst = null;

      //console.log("uebuyr_comm", gSelectItemsInfo[i].uebuyr_comm);
      if (
        gSelectItemsInfo[i].uebuyr_comm &&
        gSelectItemsInfo[i].uebuyr_comm.length > 1
      ) {
        lst = $(
          `<p class="layui-badge layui-bg-green" style="display: block;margin: 1px 5px;text-align: left !important;"  idx="${i}">
          ${i + 1}.[ ${ptypes} ] x ${
            gSelectItemsInfo[i].uebuyr_count
          } ---****</p>`
        );
      } else {
        lst = $(
          `<p class="layui-badge layui-bg-green" style="display: block;margin: 1px 5px;text-align: left !important;"  idx="${i}">
          ${i + 1}.[ ${ptypes} ] x ${gSelectItemsInfo[i].uebuyr_count} </p>`
        );
      }

      lst.on("click", (el) => {
        const idx = parseInt(el.target.getAttribute("idx"));
        const chscld = chosInfoDom.getElementsByClassName("layui-badge");
        for (let i = 0; i < chscld.length; i++) {
          if (chscld[i].getAttribute("idx") == idx) {
            chscld[i].classList.remove("layui-bg-green");
            chscld[i].classList.remove("layui-bg-red");
            chscld[i].classList.add("layui-bg-cyan");
          } else {
            chscld[i].classList.remove("layui-bg-cyan");
            chscld[i].classList.remove("layui-bg-green");
            chscld[i].classList.remove("layui-bg-red");
            if (
              gSelectItemsInfo[i].uebuyr_comm &&
              gSelectItemsInfo[i].uebuyr_comm.length > 1
            ) {
              chscld[i].classList.remove("layui-bg-red");
            } else {
              chscld[i].classList.add("layui-bg-green");
            }
          }
        }
        setChoice(
          gSelectItemsInfo[idx].uebuyr_choice,
          gSelectItemsInfo[idx].uebuyr_count
        );
      });

      lst.on("dblclick", (el) => {
        const idx = parseInt(el.target.getAttribute("idx"));
        let comm = prompt("输入备注", gSelectItemsInfo[idx].uebuyr_comm);
        if (comm == null || comm.trim().length < 1) return;

        gSelectItemsInfo[idx].uebuyr_comm = comm.substring(0, 250);

        const chscld = chosInfoDom.getElementsByClassName("layui-badge");
        for (let i = 0; i < chscld.length; i++) {
          if (chscld[i].getAttribute("idx") == idx) {
            chscld[i].classList.remove("layui-bg-green");
            chscld[i].classList.remove("layui-bg-cyan");
            chscld[i].classList.remove("layui-bg-red");
            chscld[i].classList.add("layui-bg-red");
            chscld[i].setAttribute("title", comm);
            break;
          }
        }
      });
      lst.appendTo(chosInfoDom);
    }
  }

  function pushToPurchasePlan(aPlan) {
    if (!aPlan) return;
    let bfindSame = false;
    for (let i = 0; i < gSelectItemsInfo.length; i++) {
      if (gSelectItemsInfo[i].uebuyr_choice === aPlan.uebuyr_choice) {
        gSelectItemsInfo[i].uebuyr_count += aPlan.uebuyr_count;

        if (gSelectItemsInfo[i].uebuyr_price > 0) {
          gSelectItemsInfo[i].uebuyr_cost =
            gSelectItemsInfo[i].uebuyr_count * gSelectItemsInfo[i].uebuyr_price;
        }
        bfindSame = true;
        break;
      }
    }

    if (!bfindSame) {
      aPlan.uebuyr_idx = gSelectItemsInfo.length + 1;
      gSelectItemsInfo.push(aPlan);
    }

    UpdateChoiceInfo();
  }

  function getCurSelectionChoiceValue(aGroupDoms) {
    let selectFlag = "";

    if (gCurPageType === Page_Taobao) {
      selectFlag = "tb-selected";
    } else if (gCurPageType === Page_Tmall) {
      selectFlag = "current";
    } else {
    }

    for (let i = 0; i < aGroupDoms.length; i++) {
      if (aGroupDoms[i].getElementsByClassName(selectFlag).length < 1) {
        ShowMessage("请先完成选择。");
        return "";
      }
    }

    let uebuyr_choice = "0";
    gCurPrdIDs = getCurrentIDs();
    if (aGroupDoms.length) {
      for (let i = 0; i < aGroupDoms.length; i++) {
        const selDom = aGroupDoms[i].getElementsByClassName(selectFlag)[0];
        if (!selDom) continue;
        if (i === 0) {
          uebuyr_choice = getSelectionIdx(aGroupDoms[i]);
        } else {
          uebuyr_choice = uebuyr_choice + "-" + getSelectionIdx(aGroupDoms[i]);
        }
      }
    } else {
      uebuyr_choice = "0";
    }
    return uebuyr_choice;
  }

  function onAddtoPlan(aGroupDoms, aCheckTypes = "") {
    let prdTitle = "";
    let selCount = 0;
    let imgbig = "";
    let selectFlag = "";
    let tstr = "";
    const seli = {};
    if (gCurPageType === Page_Taobao || gCurPageType === Page_Tmall) {
      if ($("h1[class^='mainTitle--']").length > 0) {
        prdTitle = $("h1[class^='mainTitle--']")[0].innerText;
      } else ShowMessage("无法找到标题信息");

      selectFlag = "isSelected";

      if ($("input[class^='countValue--']").length > 0) {
        selCount = parseInt($("input[class^='countValue--']")[0].value); //@20240528
      } else ShowMessage("无法确定数量信息");

      imgbig = $('img[class^="thumbnailPic--"]')[0]?.getAttribute("src");
      if ($('img[class^="mainPic--"]').length > 0)
        imgbig = $('img[class^="mainPic--"]')[0].getAttribute("src");
      else console.log("找不到主图2。");
      //console.log("imgbig", imgbig);

      tstr = $("span[class^='priceText--']")[0]?.innerText;
      if (tstr && parseFloat(tstr)) {
        seli.uebuyr_price = parseFloat(tstr);
      } else {
        ShowMessage("无法确定价格");
      }
    } else if (gCurPageType === Page_Tmall) {
      /*
      if ($('h1[class^="mainTitle--"]').length > 0) prdTitle = $('h1[class^="mainTitle--"]')[0].innerText;
      else ShowMessage("无法找到标题信息");

      selectFlag = "isSelected";

      if ($("input.countValueForPC").length > 0) selCount = parseInt($("input.countValueForPC")[0].value);
      else if ($("input[class^='Operation--countValue--']").length > 0) {
        selCount = parseInt($("input[class^='Operation--countValue--']")[0].value); //@20240528
        selectFlag = "isSelected";
      } else ShowMessage("无法确定数量信息");

      //selCount = parseInt($(".countValueForPC")[0].value);
      imgbig = $('img[class^="PicGallery--mainPic"]')[0]?.getAttribute("src");
      if (!imgbig || imgbig.length < 1) {
        imgbig = $('li[class^="thumbnail--"]')[0]?.getAttribute("src");
      }

      tstr = $('span[class^="Price--priceText"]')[0]?.innerText?.replace("¥", "");

      if (tstr && parseFloat(tstr)) {
        seli.uebuyr_price = parseFloat(tstr);
      }
    } else if (gCurPageType === Page_JD) {
      prdTitle = $("div.sku-name")[0].innerText;
      //selCount = parseInt($("#buy-num")[0].value);
      selCount = parseInt($('input[class^="countValue--"]')[0].value);
      imgbig = $("#spec-img")[0]?.getAttribute("src");
      selectFlag = "selected";

      tstr = $("span.p-price>span.price")[0]?.innerText?.replace("¥", "");

      if (tstr && parseFloat(tstr)) {
        seli.uebuyr_price = parseFloat(tstr);
      }

      console.log("onAddtoPlan", seli, prdTitle, selCount, imgbig, selectFlag, tstr);
      */
    } else if (gCurPageType === Page_JD) {
      prdTitle = $("div.sku-name")[0].innerText;
      selCount = parseInt($("#buy-num")[0].value);
      imgbig = $("#spec-img")[0]?.getAttribute("src");
      selectFlag = "selected";

      tstr = $("span.p-price>span.price")[0]?.innerText?.replace("¥", "");

      if (tstr && parseFloat(tstr)) {
        seli.uebuyr_price = parseFloat(tstr);
      }

      console.log(
        "onAddtoPlan",
        seli,
        prdTitle,
        selCount,
        imgbig,
        selectFlag,
        tstr
      );
    } else {
      //
    }

    if (selCount < 1) {
      ShowMessage("采购数量需大于0。");
      return false;
    }

    console.log("aGroupDoms", aGroupDoms);
    //检查选择项
    if (gCurPageType === Page_JD) {
      //aGroupDoms = aGroupDoms[0];
      let selindx = -1;

      if (aGroupDoms.length < 1) {
        selindx = 0;
      }
      for (let i = 0; i < aGroupDoms[0]?.children.length; i++) {
        let valueItm = aGroupDoms[0].children[i];
        //console.log("valueItm", valueItm);
        const classInfo = valueItm?.getAttribute("class");
        if (classInfo?.indexOf(selectFlag) > 0) {
          selindx = 1;
          break;
        }
      }
      if (selindx === -1) {
        ShowMessage("请完成选择后再添加-2。");
        return false;
      }
    } else {
      for (let i = 0; i < aGroupDoms?.children.length; i++) {
        let selindx = -1;
        let valueItm = aGroupDoms.children[i].children[1];
        for (let j = 0; j < valueItm?.children.length; j++) {
          console.log("children", valueItm.children[j]);
          const classInfo = valueItm.children[j]?.getAttribute("class");
          if (classInfo?.indexOf(selectFlag) > 0) selindx = 1;
        }
        if (selindx === -1) {
          ShowMessage("请完成选择后再添加-1。");
          return false;
        }
      }
    }

    if (gCurPageType === Page_Taobao || gCurPageType === Page_Tmall) {
      gCurPrdIDs = getCurrentIDs();
      seli.uebuyr_pid = gCurPrdIDs.id;
      if (gCurPrdIDs.skuId) seli.uebuyr_sid = gCurPrdIDs.skuId;
    } else if (gCurPageType === Page_JD) {
      gCurPrdIDs = getCurrentIDs();
      seli.uebuyr_pid = gCurPrdIDs.id;
    }

    seli.uebuyr_crtBy = gLogined.username;
    seli.uebuyr_platform = gCurPageType;
    seli.uebuyr_shop = gShopName;

    seli.uebuyr_count = selCount;
    if (seli.uebuyr_price && seli.uebuyr_price >= 0) {
      seli.uebuyr_cost = seli.uebuyr_price * selCount;
    }
    seli.uebuyr_title = prdTitle;

    if (Page_JD === gCurPageType) {
      if (aGroupDoms.length < 1) {
        seli.uebuyr_choice = "1";
        seli.uebuyr_type = "当前商品";
      } else {
        let k = 0;
        for (let i = 0; i < aGroupDoms[0].children.length; i++) {
          let valueItm = aGroupDoms[0].children[i];
          if (valueItm.getAttribute("class").indexOf(selectFlag) < 0) continue;
          const selDom = valueItm;
          //console.log("selDom", selDom, selDom.innerText);
          seli.uebuyr_pid = selDom.getAttribute("data-sku");
          if (k === 0) {
            seli.uebuyr_choice = (k + 1).toString();
            seli.uebuyr_type = selDom.innerText;
          } else {
            seli.uebuyr_choice = seli.uebuyr_choice + "-" + (k + 1).toString();
            seli.uebuyr_type = seli.uebuyr_type + "→" + selDom.innerText;
          }
          k++;
        }
      }
    } else {
      if (aGroupDoms?.children.length) {
        for (let i = 0; i < aGroupDoms.children.length; i++) {
          let valueItm = aGroupDoms.children[i].children[1];
          for (let j = 0; j < valueItm.children.length; j++) {
            const selDom = valueItm.children[j];
            if (selDom.getAttribute("class").indexOf(selectFlag) < 0) continue;

            if (gCurPageType === Page_JD) {
              seli.uebuyr_pid = selDom.getAttribute("data-sku");
            }
            if (i === 0) {
              seli.uebuyr_choice = (j + 1).toString();
              seli.uebuyr_type = selDom.innerText;
            } else {
              seli.uebuyr_choice =
                seli.uebuyr_choice + "-" + (j + 1).toString();
              seli.uebuyr_type = seli.uebuyr_type + "→" + selDom.innerText;
            }
          }
        }
      } else {
        seli.uebuyr_choice = 0;
        seli.uebuyr_type = "";
      }
    }
    seli.uebuyr_img = imgbig;
    console.log(seli);

    //console.log("seli", seli, seli.uebuyr_type, seli.uebuyr_sid, aCheckTypes)
    if (!!aCheckTypes) {
      if (aCheckTypes !== seli.uebuyr_type) {
        ShowMessage("类型不匹配，可能商品信息已更新。" + aCheckTypes);
        return false;
      }
    }

    pushToPurchasePlan(seli);
    return true;
  }

  function AttachChoiceInput(aAttachToDom, aGroupDoms) {
    let btnHTML = "";
    if (gCurPageType === Page_Taobao) {
      btnHTML = `<button type="button" class="layui-btn layui-btn-normal" style="margin-left: 10px; margin-top: 1px;">添加到计划</button>`;
    } else if (gCurPageType === Page_Tmall) {
      btnHTML = `<button type="button" class="layui-btn layui-btn-normal layui-btn-radius" style="margin-left: 10px; height:48px;">添加到计划</button>`;
    } else if (gCurPageType === Page_JD) {
      btnHTML = `<button type="button" class="layui-btn layui-btn-normal" style="margin-left: 10px; height:46px;">添加到计划</button>`;
    }

    const btItem = $(btnHTML);
    btItem.on("click", () => onAddtoPlan(aGroupDoms));
    btItem.appendTo(aAttachToDom);
  }

  function getSelectionIdx(aGroupDom) {
    if (gCurPageType === Page_Taobao || gCurPageType === Page_Tmall) {
      const doms = aGroupDom.getElementsByTagName("div");
      for (let i = 0; i < doms.length; i++) {
        const classInfo = doms[i].getAttribute("class");
        //console.log("classinfo", classInfo);
        if (classInfo?.indexOf("current") >= 0) return i + 1;
        else if (classInfo?.indexOf("isSelected") > 0) return i + 1;
      }
    } else if (gCurPageType === Page_JD) {
      const doms = aGroupDom.getElementsByClassName("item");
      for (let i = 0; i < doms.length; i++) {
        if (doms[i].getAttribute("class")?.indexOf("selected") >= 0)
          return i + 1;
      }
    }
    return -1;
  }

  function getCurrentIDs() {
    const curURL = window.location.href;
    const turl = new URL(curURL);
    const ids = { id: "", skuId: "" };
    ids.id = turl.searchParams.get("id");
    if (gCurPageType === Page_Tmall) ids.skuId = turl.searchParams.get("skuId");
    if (gCurPageType == Page_JD) {
      ids.id = stringBetween(curURL, ".jd.com/", ".html");
    }
    return ids;
  }

  function onCommitSelections() {
    if (gSelectItemsInfo.length < 1) {
      ShowMessage("请先添加计划采购项后再试。");
      return;
    }
    gSelectItemsInfo.forEach((item) => {
      item.uebuyr_projno = gProjNo;
    });
    FetchData("commitbuyreq", "post", { reqData: gSelectItemsInfo }, (rst) => {
      ShowMessage(rst.message);
    });
  }

  function onCommitAllLocal() {
    const tlocalInfo = GM_getValue("selections", null);
    const platfroms = Object.keys(tlocalInfo);
    for (let i = 0; i < platfroms.length; i++) {
      const pt = platfroms[i];
      const prodIDs = Object.keys(tlocalInfo[pt]);
      for (let j = 0; j < prodIDs.length; j++) {
        const pid = prodIDs[j];
        if (tlocalInfo[pt][pid] && tlocalInfo[pt][pid].length > 0) {
          FetchData(
            "commitbuyreq",
            "post",
            { reqData: tlocalInfo[pt][pid] },
            (rst) => {
              if (rst.status === 0) {
                if (i === platfroms.length - 1 && j === prodIDs.length - 1) {
                  gLocalProInfo = null;
                  GM_setValue("selections", gLocalProInfo);
                  ShowMessage("提交并清理完成。");
                }
              } else {
                ShowMessage(pid + "提交失败", Msg_Error);
                return;
              }
            }
          );
        }
      }
    }
  }

  function onDeleteRecs() {
    FetchData(
      "commitbuyreq",
      "delete",
      {
        uebuyr_platform: gCurPageType,
        uebuyr_crtBy: gLogined.username,
        uebuyr_pid: gCurPrdIDs.id,
      },
      (rst) => {
        ShowMessage(rst.message);
        window.location.reload();
      }
    );
  }

  function onGetebuyReqInfo() {
    FetchData(
      "getebuyr",
      "get",
      { pid: gCurPrdIDs.id, platform: gCurPageType },
      (rst) => {
        console.log("getebuyr", rst);
        if (rst.status === 0) {
          //buyHistory
          const lstUnProc = [];
          const lstProcing = [];
          const lstDone = [];
          const reqList = rst.data;
          for (let i = 0; i < reqList.length; i++) {
            if (reqList[i].uebuyr_st === 0) {
              lstUnProc.push(reqList[i]);
            } else if (reqList[i].uebuyr_st === 10) {
              lstProcing.push(reqList[i]);
            } else if (reqList[i].uebuyr_st === 20) {
              lstDone.push(reqList[i]);
            }
          }
          lstUnProc.forEach((lst) => {
            if (lst.uebuyr_choice) {
              setChoice(lst.uebuyr_choice, lst.uebuyr_count);
              onAddtoPlan(gChoiceGroup, lst.uebuyr_type);
            }
          });
          lstUnProc.forEach((lst, indx) => {
            gSelectItemsInfo[indx].uebuyr_comm = lst.uebuyr_comm;
            gProjNo = lst.uebuyr_projno;
          });
          //处理中
          const inprocDom = $("#buyProcing").empty()[0];
          $("<p style='font-size: 12px;color:orange;'>处理中：</p>").appendTo(
            inprocDom
          );
          lstProcing.forEach((lst) => {
            const lstitem = $(
              `<p class="layui-badge layui-bg-orange" style="display: block;margin: 1px 5px;text-align: left !important;">[ ${lst.uebuyr_type} ] x ${lst.uebuyr_count}</p>`
            );
            lstitem.appendTo(inprocDom);
          });

          const buyDoneDom = $("#buyDone").empty()[0];
          $("<p style='font-size: 12px;color:blue;'>已完成：</p>").appendTo(
            buyDoneDom
          );

          lstDone.forEach((lst) => {
            $(
              `<p class="layui-badge layui-bg-blue" style="display: block;margin: 1px 5px;text-align: left !important;">[ ${lst.uebuyr_type} ] x ${lst.uebuyr_count}</p>`
            ).appendTo(buyDoneDom);
          });
        }
      }
    );
  }

  function onSaveInfoInLocal() {
    if (gSelectItemsInfo.length < 1) {
      ShowMessage("当前还没有选择数据。");
      return;
    }

    if (!gLocalProInfo) {
      gLocalProInfo = {};
    }
    if (!gLocalProInfo[gCurPageType]) {
      gLocalProInfo[gCurPageType] = {};
    }

    //console.log("gSelectItemsInfo1", gSelectItemsInfo);

    gLocalProInfo[gCurPageType][gCurPrdIDs.id] = gSelectItemsInfo;
    GM_setValue("selections", gLocalProInfo);

    console.log("save local", gLocalProInfo);

    ShowMessage("保存成功。");
  }

  function onClearInfoInLocal() {
    ShowMessage("请确认是否删除所有采购信息记录？", Msg_Confirm, () => {
      gLocalProInfo = null;
      GM_setValue("selections", gLocalProInfo);
      ShowMessage("清除成功。");
    });
  }

  function onOpenAllLocalPage() {
    let theNextID = "";
    let theFirstID = "";
    let isInTheList = false;
    let pgType = 0;
    gLocalProInfo = GM_getValue("selections", null);
    if (!gLocalProInfo) {
      ShowMessage("已经没有更多的记录。");
      return;
    }
    Object.keys(gLocalProInfo).forEach((pt) => {
      Object.keys(gLocalProInfo[pt]).forEach((pid) => {
        if (theFirstID == "") {
          theFirstID = pid;
          pgType = pt;
        }
        if (isInTheList && theNextID === "") {
          theNextID = pid;
          pgType = pt;
        }
        if (pt == gCurPageType && pid == gCurPrdIDs.id) {
          isInTheList = true;
        }
      });
    });

    if (isInTheList && theNextID == "") {
      ShowMessage("已经没有更多的记录。");
      return;
    }

    if (pgType == Page_Taobao) {
      window.open(
        `//item.taobao.com/item.htm?id=${isInTheList ? theNextID : theFirstID}`
      );
    } else if (pgType == Page_Tmall) {
      window.open(
        `//detail.tmall.com/item.htm?id=${isInTheList ? theNextID : theFirstID}`
      );
    }
  }

  function onLoadLocalInfo() {
    gLocalProInfo = GM_getValue("selections", null);
    if (
      gLocalProInfo &&
      gLocalProInfo[gCurPageType] &&
      gLocalProInfo[gCurPageType][gCurPrdIDs.id] &&
      gLocalProInfo[gCurPageType][gCurPrdIDs.id].length > 0
    ) {
      gSelectItemsInfo = gLocalProInfo[gCurPageType][gCurPrdIDs.id];
      console.log("onLoadLocalInfo", gSelectItemsInfo, gLocalProInfo);
      UpdateChoiceInfo();

      ShowMessage("加载完成。");
    } else {
      ShowMessage("未找到本地保存的数据。");
    }
  }

  function onReselect() {
    gSelectItemsInfo.length = 0;
    UpdateChoiceInfo();
  }

  function onDeleteCurSel() {
    if (gSelectItemsInfo.length < 1) {
      ShowMessage("当前没有可删除项。");
      return;
    }
    const tchoice = getCurSelectionChoiceValue(gChoiceGroup);
    for (let i = 0; i < gSelectItemsInfo.length; i++) {
      if (gSelectItemsInfo[i].uebuyr_choice === tchoice) {
        gSelectItemsInfo.splice(i, 1);
        UpdateChoiceInfo();
        ShowMessage("删除成功。");
        return;
      }
    }
  }

  if (gCurPageType < Page_Taobao_Detail) {
    gCurPrdIDs = getCurrentIDs();
    pushAMenuItem("commitRec0", "提交采购信息", onCommitSelections);
    pushAMenuItem("commitDelete0", "删除已提交采购信息", onDeleteRecs);
    pushAMenuItem("sp");
    pushAMenuItem("commitDeleteSel0", "删除当前选中项", onDeleteCurSel);
    pushAMenuItem("commitReselect0", "清除并重新选择", onReselect);
    pushAMenuItem("sp");
    pushAMenuItem("LoadOnLocal0", "加载本地数据", onLoadLocalInfo);
    pushAMenuItem("saveOnLocal0", "保存到本地", onSaveInfoInLocal);
    pushAMenuItem("OpenAllLocal0", "打开下一个保存页面", onOpenAllLocalPage);
    pushAMenuItem("sp");
    pushAMenuItem(
      "CommitAndClearLocal0",
      "提交并清理本地数据",
      onCommitAllLocal
    );
    pushAMenuItem("ClearOnLocal0", "清理本地数据", onClearInfoInLocal);
  }
  //#endregion
  //============================================================================
  //#region Taobao采购列表
  let gTaobaoListOrderData = null;
  let gTaobaoListCurPage = "0";
  let gTaobaoListebuyRecItems = null;

  function TaobaoListCheckOrderValid(aData) {
    if (
      aData.statusInfo.text === "交易关闭" ||
      aData.statusInfo.text === "等待买家付款"
    ) {
      ShowMessage("当前订单非有效订单：" + aData.statusInfo.text);
      return false;
    }
    return true;
  }

  function GetTaobaoPoDatas(aData) {
    let po = {};
    po.uebuy_op = gLogined ? gLogined.username : "";
    if (aData.orderInfo.b2C) po.uebuy_platform = Page_Tmall;
    else po.uebuy_platform = Page_Taobao;
    po.uebuy_orderNum = aData.orderInfo.id;
    po.uebuy_date = aData.orderInfo.createTime;
    po.uebuy_shop = aData.seller.shopName;
    po.uebuy_freight = aData.payInfo.postFees[0]?.value;
    po.uebuy_freight = po.uebuy_freight.replace("￥", "");
    //po.discount = 0;
    po.uebuy_totalCost = aData.payInfo.actualFee;
    return po;
  }

  function GetTaoBaoPoiDatas(aData) {
    let poi = [];
    let cnt = 1;
    for (let i = 0; i < aData.subOrders.length; i++) {
      let poitem = {};
      poitem.uebuyd_platID = aData.subOrders[i].itemInfo.id;
      poitem.uebuyd_platID2 = aData.subOrders[i].itemInfo.skuId;
      if (!poitem.uebuyd_platID || poitem.uebuyd_platID2 === 0) {
        continue;
      }
      poitem.uebuyd_title = aData.subOrders[i].itemInfo.title;

      if (!!aData.subOrders[i].itemInfo.skuText[0])
        poitem.uebuyd_type = aData.subOrders[i].itemInfo.skuText[0].value;
      else poitem.uebuyd_type = "";
      poitem.uebuyd_price = aData.subOrders[i].priceInfo.realTotal;
      if (poitem.uebuyd_price < 500) {
        poitem.uebuyd_asset = 1;
      } else if (poitem.uebuyd_price < 1000) {
        poitem.uebuyd_asset = 10;
      } else {
        poitem.uebuyd_asset = 20;
      }
      poitem.uebuyd_count = aData.subOrders[i].quantity;
      poitem.uebuyd_cost = poitem.uebuyd_price * poitem.uebuyd_count;
      poitem.uebuyd_itempic = aData.subOrders[i].itemInfo.pic;

      if (poitem.uebuyd_price <= 0) continue;

      poitem.uebuyd_idx = cnt++;
      poi.push(poitem);
    }

    return poi;
  }

  function SetTaobaoBillListExpInfo(aOrders, aExpInfos) {
    //$('div[data-id="3239985747210850230"]>table>tbody>tr>td:nth-child(7)>div')
    const expInfoDoms = $(
      "div[data-id]>table>tbody:nth-child(3)>tr:nth-child(1)>td:nth-child(7)>div"
    );
    let tstr, tspec;
    for (let i = 0; i < aOrders.length; i++) {
      tstr = "";
      tspec = "";
      for (let j = 0; j < aExpInfos.length; j++) {
        if (aExpInfos[j].uexpei_orderNum === aOrders[i].id) {
          switch (aExpInfos[j].uexpe_st) {
            case 0:
              tspec = "未处理<br />";
              break;
            case 10:
              tspec = "审批中<br />";
              break;
            case 20:
              tspec = "已完成<br />";
              break;
            case 100:
              tspec = "已删除<br />";
              break;
          }
          if (
            aExpInfos[j].uexpei_invoiceCode ||
            aExpInfos[j].uexpei_invoiceNum
          ) {
            tspec =
              tspec + "发票号码:" + aExpInfos[j].uexpei_invoiceNum ??
              aExpInfos[j].uexpei_invoiceCode;
          }
        }
      }

      if (tspec === "") {
        tspec = "未添加到库";
      }
      tstr = `
        <p style="margin-bottom:3px; color:red">
          ${tspec}
        </p>
      `;
      $(tstr).appendTo(expInfoDoms[i]);
    }
  }
  function GetTaobaoBillExpInfo(aOrders) {
    const ordNums = [];
    aOrders.forEach((ord) => {
      ordNums.push(ord.id);
    });

    //查询发票信息
    FetchData("getordersinfo", "get", { orderNums: ordNums }, (rst) => {
      SetTaobaoBillListExpInfo(aOrders, rst.data);
    });
  }

  function TaobaoListDomChangeCallback(_mutationsList, _observer) {
    // if (mutationsList.length < 2) return;
    const tPage = $("li.pagination-item-active")[0].getAttribute("title");
    if (gTaobaoListCurPage !== tPage) {
      gTaobaoListCurPage = tPage;

      addDropDownBtnGroup("td[colspan='3']", popMenus);
      gTaobaoListebuyRecItems = $('div[class^="index-mod__order-container"]');

      fetch(
        "https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8",
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body:
            "pageNum=" +
            gTaobaoListCurPage +
            "&pageSize=50&queryOrder=desc&prePageNo=1",
          method: "POST",
        }
      )
        .then((res) => {
          return res.arrayBuffer();
        })
        .then((dat) => {
          const decoder = new TextDecoder("gbk");
          const text = decoder.decode(dat);
          gTaobaoListOrderData = JSON.parse(text);
          console.log(gTaobaoListOrderData);
          const tmsg =
            "请核对第一条店铺名称为：" +
            gTaobaoListOrderData.mainOrders[0].seller.shopName;
          ShowMessage(tmsg, Msg_Info);

          GetTaobaoBillExpInfo(gTaobaoListOrderData.mainOrders);
        })
        .catch((ex) => {
          ShowMessage(ex + ",请稍后刷新再试。");
          console.log("error", ex);
        });
    }
    // console.log("mutationsList", gTaobaoListCurPage, mutationsList);
  }

  function onCopyTaobaoListDatas(aData) {
    if (!TaobaoListCheckOrderValid(aData)) return;
    const po = GetTaobaoPoDatas(aData);
    const poi = GetTaoBaoPoiDatas(aData);
    let tstr = "";
    for (let i = 0; i < poi.length; i++) {
      if (tstr !== "") tstr += "\r\n";
      tstr +=
        po.uebuy_platform +
        "\t" +
        po.uebuy_date +
        "\t" +
        po.uebuy_orderNum +
        "\t" +
        po.uebuy_shop +
        "\t" +
        poi[i].uebuyd_title +
        "\t" +
        poi[i].uebuyd_type +
        "\t" +
        poi[i].uebuyd_price +
        "\t" +
        poi[i].uebuyd_count +
        "\t";
      if (i === 0) {
        tstr += po.uebuy_freight + "\t" + "\t" + po.uebuy_totalCost; //discount= ""
      } else {
        //
      }
    }
    GM_setClipboard(tstr, "text");
    ShowMessage("数据已经复制到剪切板。");
  }

  function onTaobaoCopyToDB(aData) {
    if (!TaobaoListCheckOrderValid(aData)) return;
    if (!gLogined) return;
    const tpoinfo = { elogin: gLogined };
    tpoinfo.po = GetTaobaoPoDatas(aData);
    tpoinfo.poi = GetTaoBaoPoiDatas(aData);
    FetchData("taobaopo", "post", tpoinfo, (rst) => {
      ShowMessage(rst.message);
    });
  }

  function onTaobaoDeletFromDB(aData) {
    if (!TaobaoListCheckOrderValid(aData)) return;
    if (!gLogined) return;
    const tpoinfo = {
      uebuy_op: gLogined.username,
      uebuy_platform: aData.orderInfo.b2C ? Page_Tmall : Page_Taobao,
      uebuy_orderNum: aData.id,
    };
    FetchData(
      "taobaopo",
      "delete",
      { elogin: gLogined, po: tpoinfo },
      (rst) => {
        ShowMessage(rst.message);
      }
    );
  }

  function onAddPurchaseDescription(aData) {
    if (!TaobaoListCheckOrderValid(aData)) return;
    if (!gLogined) return;
    console.log("onAddPurchaseDescription", aData);

    const tdes = prompt("描述", aData?.subOrders[0]?.itemInfo?.title);
    if (!tdes) return;
    console.log("tdes", tdes);
    console.log("orderid", aData?.id);

    FetchData(
      "updateexpdes",
      "post",
      { elogin: gLogined, orderinfo: { des: tdes, orderNum: aData?.id } },
      (rst) => {
        ShowMessage(rst.message);
      }
    );
  }

  if (gCurPageType === Page_Taobao_Detail) {
    pushAMenuItem("capturePic0", "截图到页尾", (aidx) =>
      onCapturePicToEnd(gTaobaoListebuyRecItems[aidx])
    );
    pushAMenuItem("saveRecPic0", "保存截图", (aidx) =>
      onSaveRecPic(gTaobaoListebuyRecItems[aidx], "test")
    );
    pushAMenuItem("sp");
    pushAMenuItem("copydata0", "复制数据", (aidx) =>
      onCopyTaobaoListDatas(gTaobaoListOrderData.mainOrders[aidx])
    );
    if (!!gLogined) {
      pushAMenuItem("copytoDB0", "保存到数据库", (aidx) =>
        onTaobaoCopyToDB(gTaobaoListOrderData.mainOrders[aidx])
      );
      pushAMenuItem("deleteFromDB0", "从数据库删除", (aidx) =>
        onTaobaoDeletFromDB(gTaobaoListOrderData.mainOrders[aidx])
      );
      pushAMenuItem("addDes", "添加采购描述", (aidx) =>
        onAddPurchaseDescription(gTaobaoListOrderData.mainOrders[aidx])
      );
    }
  }
  //#endregion
  //============================================================================
  //#region JD采购列表
  // let gTaobaoListOrderData = null;
  // let gTaobaoListCurPage = "0";
  let gBuyRecItemsList = null;
  function JDListDomChangeCallback(_mutationsList, _observer) {
    addDropDownBtnGroup("div.tr-operate", popMenus);
  }

  function getJDDetailsDatas(aTableDom) {
    const detailLinkDom = aTableDom
      .getElementsByClassName("number")[0]
      .getElementsByTagName("a")[0];
    const pid = detailLinkDom.innerText;
    const detailURL = detailLinkDom.getAttribute("href");
    console.log("detailURL", detailURL, pid);
    GM_xmlhttpRequest({
      method: "GET",
      url: detailURL,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
      },
      onload: function (response) {
        const respDoms = $.parseHTML(response.responseText);
        console.log("respDoms", response, respDoms);
        respDoms.forEach((nd) => {
          if (nd.id === "container") {
            console.log("first", nd);
            const shopname = nd.getelem("shop-name")[0];
            nd.getAll;
            console.log("shopname", nd.getElementsByClassName("shop-name")[0]);
          }
          // console.log('doms', nd.id);
        });
        // const shopname = respDoms.getElementsByClassName("shop-name")[0].text();
        // console.log("shopname", shopname);
      },
      onerror: function (err) {
        console.log("error", err);
      },
    });
  }

  if (gCurPageType === Page_JD_Detail) {
    gBuyRecItemsList = $("tbody[id^='tb']");
    pushAMenuItem("capturePic0", "截图到页尾", (aidx) =>
      onCapturePicToEnd(gBuyRecItemsList[aidx])
    );
    pushAMenuItem("saveRecPic0", "保存截图", (aidx) =>
      onSaveRecPic(gBuyRecItemsList[aidx], "test")
    );
    pushAMenuItem("sp");
    pushAMenuItem("copydata0", "复制数据", (aidx) =>
      getJDDetailsDatas(gBuyRecItemsList[aidx])
    );
    if (!!gLogined) {
      pushAMenuItem("copytoDB0", "保存到数据库", (aidx) =>
        onTaobaoCopyToDB(gTaobaoListOrderData.mainOrders[aidx])
      );
      pushAMenuItem("deleteFromDB0", "从数据库删除", (aidx) =>
        onTaobaoDeletFromDB(gTaobaoListOrderData.mainOrders[aidx])
      );
    }
  }
  //============================================================================
  //#region 系统
  const html2CanvasOpts = {
    useCORS: true,
  };
  function onCapturePicToEnd(aDOM) {
    setTimeout(() => {
      if (gCurPageType === Page_Taobao_Detail) {
        html2canvas(aDOM, html2CanvasOpts).then((canvas) => {
          $("body").append(canvas);
          ShowMessage("截取成功。");
        });
      } else if (gCurPageType === Page_JD_Detail) {
        html2canvas(aDOM, html2CanvasOpts).then((canvas) => {
          $("body").append(canvas);
          ShowMessage("截取成功。");
        });
      }
    }, 500);
  }

  function onSaveRecPic(aDOM, aFileName) {
    setTimeout(() => {
      html2canvas(aDOM, html2CanvasOpts).then((canvas) => {
        const canvasImg = canvas.toDataURL("image/png");
        downLoadFile(aFileName, canvasImg);
      });
    }, 500);
  }

  function addDropDownBtn(aDomsStr, cmdList, isChildNode = true) {
    /**
     * cmdList:[{id, title, cb}]
     */
    if (cmdList.length < 1) return;
    let menuItems = "";
    cmdList.forEach((cmd) => {
      if (cmd.id === "sp") menuItems += `<hr />`;
      else
        menuItems += `<dd><a href="javascript:;" id="${cmd.id}">${cmd.title}</a></dd>`;
    });
    // console.log(menuItems);
    const dropDown = $(`
    <div>
      <ul class="layui-nav" style="display:inline;width:50px; background:#fffcea; padding:0; margin:0px 10px" lay-filter="menuFun">
        <li class="layui-nav-item" lay-unselect="" style="line-height: 32px">
          <a href="javascript:;">
          <div style="
            width: 26px;
            height: 32px;
            border: 2px;
            color: white;
            cursor: pointer;
            background-repeat: no-repeat;
            background-position: 0px 1px;
            background-clip: padding-box;
            background-size: 150px;
            background-image: url(https://hkust.edu.hk/sites/default/files/images/c_UST_L.svg);
              "/>
          </a>
          <dl class="layui-nav-child" style="top: 32px">
            ${menuItems}
          </dl>
        </li>
      </ul>
    </div>
    `);

    GM_addStyle(`
        .layui-icon {
          color: red !important;
        }
      `);

    if (isChildNode) dropDown.appendTo($(aDomsStr)[0]);
    else dropDown.insertAfter($(aDomsStr)[0]);
    //dropDown.appendTo($('div[class^="PicGallery--root"]')[0])

    layui.use(["element", "layer"], function () {
      const element = layui.element,
        layer = layui.layer;
      element.init();
      element.on("nav(menuFun)", function (elem) {
        for (let i = 0; i < cmdList.length; i++) {
          if (cmdList[i].id === this.id) {
            if (!!cmdList[i].cb) cmdList[i].cb(this.id);
          }
        }
        // console.log(this.id, elem.text());
      });
    });
  }
  function addDropDownBtnGroup(aDomsStr, cmdList) {
    /**
     * cmdList:[{id, title, cb}]
     */
    if (cmdList.length < 1) return;

    GM_addStyle(`
        .layui-icon {
          color: red !important;
        }
      `);

    const RowDoms = $(aDomsStr);
    for (let i = 0; i < RowDoms.length; i++) {
      RowDoms[i].setAttribute("style", "padding:3px 0px;");
    }
    for (let idx = 0; idx < RowDoms.length; idx++) {
      let menuItems = "";
      cmdList.forEach((cmd) => {
        if (cmd.id === "sp") menuItems += `<hr />`;
        else
          menuItems += `<dd><a href="javascript:;" style="text-align: left;" id="${cmd.id}" value="${idx}">${cmd.title}</a></dd>`;
      });
      // console.log(menuItems);
      const dropDown = $(`
        <ul class="layui-nav" style="display:inline;width:50px; background:#fffcea; padding:0; margin:0px 10px" lay-filter="menuFun">
          <li class="layui-nav-item" lay-unselect="" style="line-height: 32px">
            <a href="javascript:;">
            <div style="
              width: 26px;
              height: 32px;
              border: 2px;
              color: white;
              cursor: pointer;
              background-repeat: no-repeat;
              background-position: 0px 1px;
              background-clip: padding-box;
              background-size: 150px;
              background-image: url(https://hkust.edu.hk/sites/default/files/images/c_UST_L.svg);
                "/>
            </a>
            <dl class="layui-nav-child" style="top: 32px">
              ${menuItems}
            </dl>
          </li>
        </ul>
      `);

      dropDown.prependTo(RowDoms[idx]);
    }

    layui.use(["element", "layer"], function () {
      const element = layui.element,
        layer = layui.layer;
      element.init();
      element.on("nav(menuFun)", function (elem) {
        for (let i = 0; i < cmdList.length; i++) {
          if (cmdList[i].id === this.id) {
            if (!!cmdList[i].cb) cmdList[i].cb(this.getAttribute("value"));
          }
        }
        // console.log("click item", this.id, this, this.getAttribute("value"), elem.text());
        // layer.msg(elem.text());
      });
    });
  }
  function onLogin() {
    const loginUI = `
    <form class="layui-form" action="" style="padding:10px 20px; width:380px;" id="popLogin" lay-filter="loginfrom">
      <div class="layui-form-item">
        <label class="layui-form-label">用户名</label>
        <div class="layui-input-block">
          <input type="text" name="username" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input">
        </div>
      </div>
      <div class="layui-form-item">
        <label class="layui-form-label">密码</label>
        <div class="layui-input-block">
          <input type="password" name="userPwd" placeholder="请输入密码" autocomplete="off" class="layui-input">
        </div>
      </div>
    </form>
    `;
    if ($("#popLogin").length < 1) $(loginUI).appendTo($("body"));
    layui.use(["layer", "form"], function () {
      const layer = layui.layer;
      const form = layui.form;
      layer.open({
        type: 1,
        title: "登录",
        offset: "auto",
        id: "popLogin" + "auto", //防止重复弹出
        content: $("#popLogin"),
        btn: ["确定", "取消"],
        btnAlign: "c", //按钮居中
        shade: 0.3, //显示遮罩
        shadeClose: true,
        yes: function () {
          const data = form.val("loginfrom");
          // console.log("user info", JSON.stringify(data));
          const loginfo = {
            username: data.username,
            pwd: CryptoJS.MD5(data.userPwd).toString(),
          };
          FetchData("elogin", "post", loginfo, (rst) => {
            if (rst.status === 0) {
              GM_setValue("loginInfo", {
                username: data.username,
                encoder: rst.data,
              });
              window.location.reload();
            }
          });
          layer.closeAll();
        },
      });
    });
  }
  function onLogOut() {
    ShowMessage("确认是否退出?", Msg_Confirm, () => {
      console.log("退出 成功。");
      GM_setValue("loginInfo", null);
      window.location.reload();
    });
  }
  function onSetting() {
    console.log("Login....");
    const dlgSetting = `
    <form class="layui-form" action="" style="padding:10px 20px; width:380px;" id="dlgSetting" lay-filter="settingFrom">
      <div class="layui-form-item">
        <label class="layui-form-label">服务器</label>
        <div class="layui-input-block">
          <input type="text" name="server" lay-verify="title" autocomplete="off" placeholder="请输入" class="layui-input" value="${gServer}">
        </div>
      </div>
    </form>
    `;
    if ($("#dlgSetting").length < 1) $(dlgSetting).appendTo($("body"));
    layui.use(["layer", "form"], function () {
      const layer = layui.layer;
      const form = layui.form;
      layer.open({
        type: 1,
        title: "设置",
        offset: "auto",
        id: "setting" + "auto", //防止重复弹出
        content: $("#dlgSetting"),
        btn: ["确定", "取消"],
        btnAlign: "c", //按钮居中
        shade: 0.3, //显示遮罩
        shadeClose: true,
        yes: function () {
          const data = form.val("settingFrom");
          gServer = data.server;
          console.log("setting", JSON.stringify(data));
          GM_setValue("server", data.server);
          layer.closeAll();
        },
      });
    });
  }
  //#endregion
  //============================================================================
  //#region 添加菜单
  if (gCurPageType === Page_Taobao_Detail || gCurPageType === Page_JD_Detail) {
    pushAMenuItem("sp");
    if (!gLogined)
      //未登录
      pushAMenuItem("login0", "登录", onLogin);
    else pushAMenuItem("login1", "退出", onLogOut);

    pushAMenuItem("setting0", "设置", onSetting);
  }

  //#endregion
  //============================================================================
  //#region 后处理
  function ListenPageChange(aDom, aCB) {
    // console.log(" ListenPageChange");
    var mo = new MutationObserver(aCB);
    mo.observe(aDom, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  setTimeout(() => {
    if (gCurPageType === Page_Taobao || gCurPageType === Page_Tmall) {
      //淘宝
      if ($(".tb-shop-name").length > 0)
        gShopName = $(".tb-shop-name")[0].innerText; //历史版本
      if ($('span[class^="shopName--"]').length > 0)
        gShopName = $('span[class^="shopName--"]')[0].innerText;
      //历史版本 20240902
      else {
        ShowMessage(
          "#1001: 未知的页面，可能是因为淘宝改版导致，请联系管理员。"
        );
        return;
      }
      //addDropDownBtn(".tb-item-info-l", popMenus);
      //console.log("gShopName", gShopName)
      if ($('div[class^="summaryInfoWrap--"]').length > 0) {
        //历史版本 20240902
        gInfoTxt.insertAfter($('div[class^="summaryInfoWrap--"]')[0]);
        addDropDownBtn('div[class^="summaryInfoWrap--"]', popMenus, false);
      } else {
        ShowMessage(
          "#1002: 未知的页面，可能是因为淘宝改版导致，请联系管理员。"
        );
        return;
      }

      if ($('div[class^="SkuContent--Hm"]').length > 0)
        gChoiceGroup = $('div[class^="SkuContent--Hm"]')[0]; //历史版本 20240902
      else {
        console.log("无选择项信息");
        gChoiceGroup = null;
      }

      if ($("div[class^='Actions--leftButtons']").length > 0)
        AttachChoiceInput(
          $("div[class^='Actions--leftButtons']"),
          gChoiceGroup
        );
      else if ($("div[class^='LeftButtonList--']").length > 0)
        ///历史版本 20241012
        AttachChoiceInput($("div[class^='LeftButtonList--']"), gChoiceGroup);
      else if ($("div[class^='LeftButtonListForEmphasize']").length > 0)
        AttachChoiceInput(
          $("div[class^='LeftButtonListForEmphasize']"),
          gChoiceGroup
        );
      else {
        ShowMessage(
          "#1003: 未知的页面，可能是因为淘宝改版导致，请联系管理员。"
        );
        return;
      }

      //https://item.taobao.com/item.htm?spm=a1z0d.6639537/tb.1997196601.58.2e6b7484CvPHNV&id=622910076860

      onGetebuyReqInfo();
    } else if (gCurPageType === Page_Tmall) {
      /*
      //天猫
      if ($('div[class^="ShopHeader--title"]').length > 0)
        gShopName = $('div[class^="ShopHeader--title"]')[0].innerText; //历史版本 2024-05-10
      else if ($('span[class^="ShopHeaderNew--shopName"]').length > 0)
        gShopName = $('span[class^="ShopHeaderNew--shopName"]')[0].innerText; //历史版本 20240509
      else if ($('span[class^="ShopHeader--shopName"]').length > 0)
        gShopName = $('span[class^="ShopHeader--shopName"]')[0].innerText; //历史版本 20240509
      else {
        ShowMessage("#1001: 未知的页面，可能是因为天猫改版导致，请联系管理员。");
        return;
      }

      if ($("#purchasePanel").length > 0) {
        addDropDownBtn("#purchasePanel", popMenus);
        gInfoTxt.appendTo($("#purchasePanel")[0]);
      } else if ($('div[class^="PicGallery--mainPicWrap"]').length > 0) {
        addDropDownBtn('div[class^="PicGallery--mainPicWrap"]', popMenus);
        gInfoTxt.insertAfter($('div[class^="PicGallery--mainPicWrap"]')[0]);
      } else {
        ShowMessage("#1002: 未知的页面，可能是因为淘宝改版导致，请联系管理员。");
        return;
      }

      gInfoTxt.appendTo($("div[class^='BasicContent--mainPic']")[0]);

      //gChoiceGroup = $("div.skuCate");
      gChoiceGroup = $("div[class^='SkuContent--content']");
      AttachChoiceInput($("div[class^='Actions--leftButtons']"), gChoiceGroup);

      onGetebuyReqInfo();
      */
    } else if (gCurPageType === Page_JD) {
      gShopName = $("div.name>a")[0].innerText;
      addDropDownBtn("#preview", popMenus);

      gInfoTxt.appendTo($("#preview")[0]);

      //gChoiceGroup = $("#choose-attrs>div[id^='choose-attr']>div.dd");
      gChoiceGroup = $("#choose-attrs>div[id^='choose-attr']>div.dd");
      AttachChoiceInput($("#choose-btns"), gChoiceGroup);

      onGetebuyReqInfo();
    } else if (gCurPageType === Page_Taobao_Detail) {
      // addDropDownBtnGroup("td[colspan='3']", popMenus);
      // console.log("Page_Taobao_Detail ", gCurPageType);
      ListenPageChange($("ul.pagination")[0], TaobaoListDomChangeCallback);
      TaobaoListDomChangeCallback(null, null);
    } else if (gCurPageType === Page_JD_Detail) {
      ListenPageChange($("div.pagin")[0], JDListDomChangeCallback);
      // TaobaoListDomChangeCallback(null, null);
      JDListDomChangeCallback(null, null);
    }
  }, 1000);

  //#endregion
  //============================================================================
})();

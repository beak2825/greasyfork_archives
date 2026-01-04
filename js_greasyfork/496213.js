// ==UserScript==
// @name         UST-京东订单
// @namespace    https://hkust-gz.edu.cn/
// @version      0.6.1
// @description  eshopping for HKUST-GZ MDMF
// @author       Colinfluo
// @match        https://details.jd.com/normal/item.action*
// @iconURL      https://hkust-gz.edu.cn/profiles/ust/themes/custom/hkust_style_a/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.7.2/dist/sweetalert2.all.min.js
// @resource css https://cdn.jsdelivr.net/npm/sweetalert2@11.7.2/dist/sweetalert2.min.css
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @grant       GM_cookie
// @grant       GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496213/UST-%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/496213/UST-%E4%BA%AC%E4%B8%9C%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const currentURL = window.location.href;
  function parseSearchParams(searchParamsString) {
    return searchParamsString.split("&").reduce((searchParams, curKV) => {
      const [k, v] = curKV.split("=").map(decodeURIComponent);
      searchParams[k] = v;
      return searchParams;
    }, {});
  }

  let gPoData = null;
  let gPoiData = null;

  let curPageType = 0;
  let gPassKey = "";
  if (currentURL.indexOf("//details.jd.com") > 0) {
    curPageType = 1;
    const { PassKey } = parseSearchParams(currentURL);
    gPassKey = PassKey.replace("¥", "").replace(/\s*/g, "");
    console.log("get jd pass key", gPassKey);
  }
  const JD = 10; //京东
  let gNetWorkErr = false;

  const gLogined = GM_getValue("loginInfo", null);
  let gServer = GM_getValue("server", null);

  const css = `
    .buttonClass {
      font-size:15px;
      font-family:Arial;
      width:138px;
      height:32px;
      border-width:1px;
      color:#fff;
      border-color:#4b8f29;
      font-weight:bold;
      border-top-left-radius:4px;
      border-top-right-radius:4px;
      border-bottom-left-radius:4px;
      border-bottom-right-radius:4px;
      box-shadow: 0px 10px 14px -7px #3e7327;
      text-shadow: 0px 1px 0px #5b8a3c;
      background:linear-gradient(#77b55a, #72b352);
    }

    .buttonClass:hover {
      background: linear-gradient(#72b352, #77b55a);
    }


    /* 下拉按钮样式 */
    .dropbtn {
      background-color: #4CAF50;
      color: white;
      margin: 5px;
      width: 22px;
      height: 32px;
      padding: 3px;
      font-size: 16px;
      border: none;
      cursor: pointer;
      background: url(https://hkust.edu.hk/sites/default/files/images/c_UST_L.svg);
      background-repeat: no-repeat;
      background-size: cover;
    }

    /* 容器 <div> - 需要定位下拉内容 */
    .dropdown {
      position: relative;
      display: inline-block;
    }

    /* 下拉内容 (默认隐藏) */
    .dropdown-content {
      display: none;
      position: absolute;
      left: 32px;
      top: 0px;
      background-color: #f9f9f9;
      min-width: 150px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    /* 下拉菜单的链接 */
    .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      cursor: pointer;
    }

    .dropdown-content .spv {
      content: '';
      width:94%;
      height:1px;
      margin-left: 3%;
      margin-right: 3%;
      background: #ccc;
    }

    /* 鼠标移上去后修改下拉菜单链接颜色 */
    .dropdown-content a:hover {background-color: #f1f1f1}

    /* 在鼠标移上去后显示下拉菜单 */
    .dropdown:hover .dropdown-content {
      display: block;
    }

    /* 当下拉内容显示后修改下拉按钮的背景颜色 */

    .dropdown:hover .dropbtn {
      background-color: #3e8e41;
    }

    .specinfo {
      display: inline-block;
      vertical-align: middle;
      position: relative;
      color: #ff6a00;
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
  var style = document.createElement("style");
  style.type = "text/css";
  var text = document.createTextNode(css);
  style.appendChild(text);
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);

  const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
  });

  const message = {
    success: text => {
      toast.fire({ title: text, icon: "success" });
    },
    error: text => {
      toast.fire({ title: text, icon: "error" });
    },
    warning: text => {
      toast.fire({ title: text, icon: "warning" });
    },
    info: text => {
      toast.fire({ title: text, icon: "info" });
    },
    question: text => {
      toast.fire({ title: text, icon: "question" });
    }
  };

  function CommitMessage(arst) {
    if (!!arst) {
      if (arst.status) {
        message.error(arst.message);
      } else {
        message.success(arst.message);
      }
    }
  }

  function downLoadFile(fileName, canvasImg) {
    const a = document.createElement("a");
    a.href = canvasImg;
    a.download = fileName;
    const e = new MouseEvent("click");
    a.dispatchEvent(e);
  }

  function GetStringNumber(astr) {
    let tval = parseFloat(astr).toString();
    if (tval == "NaN") {
      return "0";
    } else {
      return tval;
    }
  }

  async function commitData(aPath, aMethod, aDat) {
    if (!gServer) {
      return;
    }
    const tURL = gServer + "/ustbuy/" + aPath;
    console.log("send fetch", tURL, aDat);
    let rstdat = null;

    await fetch(tURL, {
      method: aMethod,
      body: JSON.stringify(aDat),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(rst => rst.json())
      .then(dat => {
        rstdat = dat;
      })
      .catch(err => {
        gNetWorkErr = true;
        console.log("send fetch error ", err);
        message.error("与服务器通信失败，请联系管理员或稍后再试。");
      });

    console.log("send fetch done ", rstdat);
    return rstdat;
  }

  async function login() {
    const { value: formValues } = await Swal.fire({
      title: "登录",
      html:
        '<input id="u_userName" class="swal2-input" placeholder="用户名" />' +
        '<input id="u_password" type="password" class="swal2-input" placeholder="密码" />',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return [document.getElementById("u_userName").value, document.getElementById("u_password").value];
      }
    });

    if (!!formValues) {
      const loginfo = { username: formValues[0], pwd: CryptoJS.MD5(formValues[1]).toString() };
      const rst = await commitData("elogin", "post", loginfo);
      if (rst.status === 0) {
        GM_setValue("loginInfo", { username: formValues[0], encoder: rst.data });
        location.reload();
      } else {
        console.log("login failed");
      }
    }
    return formValues;
  }

  async function SetServer() {
    const { value: formValues } = await Swal.fire({
      title: "设置",
      html: '<input id="u_server" class="swal2-input" placeholder="服务器地址" value="' + gServer + '"/>',
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return [document.getElementById("u_server").value];
      }
    });

    if (formValues) {
      GM_setValue("server", formValues[0]);
      gServer = formValues[0];
      message.success("设置成功。");
    }
    return formValues;
  }

  function CreatMenuSp() {
    const tMenu = document.createElement("div");
    tMenu.className = "spv";
    return tMenu;
  }

  function CreatMenuItem(aTitle, aClickFun) {
    const tMenu = document.createElement("a");
    tMenu.innerText = aTitle;
    tMenu.onclick = aClickFun;
    return tMenu;
  }

  function CheckOrderValid() {
    const st = $("div.state-lcol>h3")[0].innerText;
    //if (st.indexOf("完成") < 0) {
    //  message.info("当前订单非有效订单：" + st);
    //  return false;
    //}
    return true;
  }

  function GetPoDatas() {
    let po = {};
    po.uebuy_op = gLogined.username;
    po.uebuy_platform = JD;

    po.uebuy_orderNum = $("#orderid")[0].getAttribute("value");
    po.uebuy_orderKey = gPassKey;

    po.uebuy_date = po.uebuy_date = $("#datesubmit-" + po.uebuy_orderNum)[0].getAttribute("value");
    // console.log("get shop name");
    po.uebuy_shop = $(".shop-name")[0].innerText;
    // console.log("get shop name", po.uebuy_shop);
    const lst = $("div.goods-total ul li");
    let tstr = "";
    let valstr = "";
    let discount = 0;
    for (let i = 0; i < lst.length; i++) {
      tstr = lst[i].children[0].innerText;
      valstr = lst[i].children[1].innerText;
      if (tstr.indexOf("实付款") >= 0) {
        po.uebuy_totalCost = valstr.replace("¥", "").replace(/\s*/g, "");
      } else if (tstr.indexOf("运费") >= 0) {
        po.uebuy_freight = valstr.replace("¥", "").replace("+", "").replace(/\s*/g, "");
      } else if (tstr.indexOf("+") >= 0) {
        valstr = valstr.replace("¥", "").replace("+", "").replace(/\s*/g, "");
        discount += parseFloat(valstr);
      } else if (tstr.indexOf("-") >= 0) {
        valstr = valstr.replace("¥", "").replace("-", "").replace(/\s*/g, "");
        discount -= parseFloat(valstr);
      }
    }

    po.uebuy_discount = discount;
    //po.uebuy_realpic = $("div.track-lcol>.p-item>.p-img>a>img")[0]?.getAttribute("src");
    console.log("po", po);
    return po;
  }

  function GetPoiDatas() {
    let poi = [];
    let cnt = 1;
    let tstr = "";
    const fi = {};
    const tbh = $("div.goods-list>table>thead>tr>th");
    for (let i = 0; i < tbh.length; i++) {
      tstr = tbh[i].innerText;
      if (tstr.indexOf("商品编号") >= 0) {
        fi.uebuyd_platID = i;
      } else if (tstr.indexOf("商品数量") >= 0) {
        fi.uebuyd_count = i;
      } else if (tstr.indexOf("商品") >= 0) {
        fi.uebuyd_title = i;
      } else if (tstr.indexOf("京东价") >= 0) {
        fi.uebuyd_price = i;
      }
    }
    // console.log("field index", fi);
    const tbb = $("div.goods-list>table>tbody>tr");
    const tTitles = tbb.find("div.p-name>a");
    const tTypes = tbb.find("div.p-extra>span");
    const tImgs = tbb.find("div.p-img>a>img");
    for (let i = 0; i < tbb.length; i++) {
      const poitem = {};
      //title & type & pic
      poitem.uebuyd_title = tTitles[i].innerText;
      poitem.uebuyd_type = tTypes[i]?.innerText;
      poitem.uebuyd_itempic = tImgs[i].getAttribute("src");

      poitem.uebuyd_platID = tbb[i].children[fi.uebuyd_platID]?.innerText.replace(/\s*/g, "");
      if (!poitem.uebuyd_platID) continue;
      poitem.uebuyd_platID2 = gPassKey;

      poitem.uebuyd_price = tbb[i].children[fi.uebuyd_price]?.innerText.replace("¥", "").replace(/\s*/g, "");
      if (isNaN(poitem.uebuyd_price)) poitem.uebuyd_price = 0;
      poitem.uebuyd_count = tbb[i].children[fi.uebuyd_count]?.innerText;
      poitem.uebuyd_cost = poitem.uebuyd_price * poitem.uebuyd_count;

      poitem.uebuyd_idx = cnt++;
      poi.push(poitem);
    }
    console.log("poi", poi);
    return poi;
  }

  function getDatas() {
    try {
      if (!gPoData) gPoData = GetPoDatas();
      if (!gPoiData) gPoiData = GetPoiDatas();
    } catch (err) {
      console.log("get data error", err);
    }
  }
  //添加按钮
  function addButtons() {
    const divGoods = $("div.order-goods")[0];
    //const pupoMenuPos = $("#pay-info-nozero")[0];
    const pupoMenuPos = $("div.ui-switchable-panel>div")[1];
    const opts = {
      useCORS: true
    };

    const tpupo = document.createElement("div");
    tpupo.className = "dropdown";
    //pupoMenuPos.append(tpupo);
    pupoMenuPos.prepend(tpupo);

    const tDis = document.createElement("button");
    tDis.className = "dropbtn";
    tpupo.appendChild(tDis);

    const tSubMenu = document.createElement("div");
    tSubMenu.className = "dropdown-content";
    tpupo.appendChild(tSubMenu);

    tSubMenu.appendChild(
      CreatMenuItem("截图到页尾", () => {
        html2canvas(divGoods, opts).then(canvas => {
          $("body").append(canvas);
        });
        message.success("截取成功。");
      })
    );

    tSubMenu.appendChild(
      CreatMenuItem("保存截图", () => {
        html2canvas(divGoods, opts).then(canvas => {
          const canvasImg = canvas.toDataURL("image/png");
          downLoadFile(gPoData.uebuy_shop + gPoData.uebuy_orderNum, canvasImg);
        });
      })
    );

    tSubMenu.appendChild(CreatMenuSp());

    tSubMenu.appendChild(
      CreatMenuItem("复制数据", () => {
        if (!CheckOrderValid()) return;
        getDatas();
        if (!gPoData || !gPoiData) return;
        let po = gPoData;
        let poi = gPoiData;
        let tstr = "";
        for (let i = 0; i < poi.length; i++) {
          if (tstr !== "") tstr += "\r\n";
          tstr +=
            "京东" +
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
            "\t" +
            poi[i].uebuyd_cost +
            "\t";
          if (i === 0) {
            tstr += po.uebuy_freight + "\t" + po.uebuy_discount + "\t" + po.uebuy_totalCost; //discount= ""
          } else {
            //
          }
        }
        GM_setClipboard(tstr, "text");
        message.info("数据已经复制到剪切板。");
      })
    );

    if (!!gLogined) {
      tSubMenu.appendChild(
        CreatMenuItem("保存到数据库", () => {
          if (!CheckOrderValid()) return;
          if (!gLogined) return;
          getDatas();
          if (!gPoData || !gPoiData) return;
          let tpoinfo = { elogin: gLogined };
          tpoinfo.po = gPoData;
          tpoinfo.poi = gPoiData;

          commitData("taobaopo", "POST", tpoinfo).then(rst => {
            CommitMessage(rst);
          });
        })
      );

      tSubMenu.appendChild(
        CreatMenuItem("从数据库删除", () => {
          if (!CheckOrderValid()) return;
          if (!gLogined) return;
          getDatas();
          if (!gPoData || !gPoiData) return;
          const tpoinfo = {
            uebuy_op: gLogined.username,
            uebuy_platform: JD,
            uebuy_orderNum: gPoData.uebuy_orderNum
          };
          commitData("taobaopo", "DELETE", { elogin: gLogined, po: tpoinfo }).then(rst => {
            CommitMessage(rst);
          }); //delete
        })
      );

      tSubMenu.appendChild(
        CreatMenuItem("添加采购描述", () => {
          if (!CheckOrderValid()) return;
          if (!gLogined) return;
          getDatas();
          if (!gPoData || !gPoiData) return;
          console.log("getDatas", gPoData, gPoiData);

          const tdes = prompt("描述", gPoiData[0]?.uebuyd_title);
          if (!tdes) return;

          commitData(
            "updateexpdes",
            "post",
            { elogin: gLogined, orderinfo: { des: tdes, orderNum: gPoData?.uebuy_orderNum } },
            rst => {
              CommitMessage(rst);
            }
          );
        })
      );
    }

    tSubMenu.appendChild(CreatMenuSp());

    tSubMenu.appendChild(
      CreatMenuItem(!!gLogined ? "退出" : "登录", () => {
        if (gLogined) {
          GM_deleteValue("loginInfo");
          location.reload();
        } else {
          login();
        }
      })
    );
    tSubMenu.appendChild(CreatMenuItem("设置", () => SetServer()));
  }

  addButtons();
})();

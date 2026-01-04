// ==UserScript==
// @name         华都集采系统脚本
// @version      3.3.0
// @description  简化操作步骤
// @author       金辉
// @license MIT
// @require      https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require      https://unpkg.com/toastr@2.1.4/build/toastr.min.js
// @resource css https://unpkg.com/toastr@2.1.4/build/toastr.min.css
// @match        *://fw.ybj.beijing.gov.cn/tps-local-bd/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant   GM_openInTab
// @namespace https://greasyfork.org/users/1357115
// @downloadURL https://update.greasyfork.org/scripts/505055/%E5%8D%8E%E9%83%BD%E9%9B%86%E9%87%87%E7%B3%BB%E7%BB%9F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/505055/%E5%8D%8E%E9%83%BD%E9%9B%86%E9%87%87%E7%B3%BB%E7%BB%9F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    console.log('华都脚本');
  GM_addStyle(GM_getResourceText("css"));
  var params = { current: 1, size: 500, carType: 0 };
  var jsonData = JSON.stringify(params); //转为json字符串
  var mt = {};
  mt.cookie = {};
  mt.cookie.get = function (e) {
    return (e = RegExp("(^| )" + e + "=([^;]*)(;|$)").exec(document.cookie))
      ? e[2]
      : "";
  };
  var sleep = async (duration) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration);
    });
  };
  let newdiv = document.createElement("div");
  newdiv.style =
    "position:fixed;right:680px;top:10px;font-size:24px;z-index: 999;";
  newdiv.innerHTML =
    '<button id="demo" class="el-button el-button--primary">下载购物车</button><button id="demo1" class="el-button el-button--primary">同步购物车</button><button id="demo2" class="el-button el-button--primary">查看同步情况</button><button id="demo9" class="el-button el-button--primary">检查购物车完整性</button><button id="demo3" class="el-button el-button--primary">清空购物车</button><button id="demo4" class="el-button el-button--primary">入库药品</button><button id="demo6" class="el-button el-button--primary">下载药品目录</button><button id="demo5" class="el-button el-button--primary">同步本院药品目录</button><button id="demo7" class="el-button el-button--primary">清空未同步药品</button><button id="demo8" class="el-button el-button--primary">同步待确认订单</button>';
  document.body.append(newdiv);

  let nonediv = document.createElement("div");
  nonediv.style = "display:none";
  nonediv.innerHTML =
    '<button id="demogaijia" class="el-button el-button--primary">同步维护目录</button><button id="demokais" class="el-button el-button--primary">同步维护目录</button><button id="demoquerenk" class="el-button el-button--primary">全部确认价格</button>';
  document.body.append(nonediv);
  //下载购物车
  $("#demo").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    $.ajax({
      url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/list",
      method: "post",
      // 通过headers对象设置请求头
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
        accountType: 2,
        refreshToken: localStorage.getItem("refreshToken"),
      },
      data: jsonData,
      dataType: "json",
      //async: true,
      success: function (res) {
        if (res.code !== 0) {
          toastr.success("请先登陆后再下载");
        }
        GM_xmlhttpRequest({
          method: "post",
          url: "http://www.huadu1.com/api/index/export",
          data: JSON.stringify(res),
          responseType: "arraybuffer",
          headers: { "Content-Type": "application/json" },
          onload: function (res) {
            const url = window.URL.createObjectURL(
              new Blob([res.response], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              })
            );
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "export.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          },
          onerror: function (err) {
            console.log(err);
          },
        });
      },
      error: function (e) {
        console.log("ajax请求异常，异常信息如下：", e);
      },
    });
  });
  //同步药品目录
  $("#demo5").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    let lsc = 0;
    for (let i = 1; i < 5; i++) {
      let params = {
        current: i,
        size: 500,
        carType: 0,
      };
      let jsonData = JSON.stringify(params);
      $.ajax({
        url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/listDrugs",
        method: "post",
        // 通过headers对象设置请求头
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
          accountType: 2,
          refreshToken: localStorage.getItem("refreshToken"),
        },
        data: jsonData,
        dataType: "json",
        //async: true,
        success: function (res) {
          if (res.code !== 0) {
            toastr.success("请先登陆后再下载");
          }
          GM_xmlhttpRequest({
            method: "post",
            url: "http://www.huadu1.com/api/index/export1",
            data: JSON.stringify(res),
            headers: { "Content-Type": "application/json" },
            onload: function (res) {
              lsc += 1;
              if (lsc >= 4) {
                toastr.success("同步成功！");
              }
              console.log(res);
            },
            onerror: function (err) {
              console.log(err);
            },
          });
        },
        error: function (e) {
          console.log("ajax请求异常，异常信息如下：", e);
        },
      });
    }
  });
  $("#demokais").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    GM_xmlhttpRequest({
      method: "post",
      url: "http://www.huadu1.com/api/index/tbjiage",
      headers: { "Content-Type": "application/json" },
      onload: async function (res) {
        let one = JSON.parse(res.response);
        for (let i = 0; i < one.length; i++) {
          $.ajax({
            url: "/tps-local-bd/web/bdc/zTender/cccdTrnsAdvPric",
            method: "post",
            // 通过headers对象设置请求头
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
              accountType: 2,
              refreshToken: localStorage.getItem("refreshToken"),
            },
            data: JSON.stringify(one[i]),
            dataType: "json",
            //async: true,
            success: function (res) {
              console.log(res);
            },
          });
          await sleep(200);
        }
      },
      onerror: function (err) {
        console.log(err);
      },
    });
  });

  $("#demoquerenk").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    GM_xmlhttpRequest({
      method: "post",
      url: "http://www.huadu1.com/api/index/querentong",
      headers: { "Content-Type": "application/json" },
      onload: async function (res) {
        let one = JSON.parse(res.response);
        for (let i = 0; i < one.length; i++) {
          $.ajax({
            url: "/tps-local-bd/web/bdc/zTender/cccdTrnsAdvPric/modifyTrnsAdvPricTohospById",
            method: "PUT",
            // 通过headers对象设置请求头
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
              accountType: 2,
              refreshToken: localStorage.getItem("refreshToken"),
            },
            data: JSON.stringify(one[i]),
            dataType: "json",
            //async: true,
            success: function (res) {
              console.log(res);
            },
          });
          let postdata = {
            menuName: "中药饮片管理--合同管理--议价管理--确认",
            reqtCont:
              "该机构（北京华都中医医院）下的朱军华在2025-06-17 14:37:35时,对挂网ID：" +
              one[i]["pubonlnId"] +
              "进行了选择议价操作。议价价格:" +
              one[i]["prodentpAdvPric"],
            reqtType: "6",
            reqtUrl:
              "/web/bdc/zTender/cccdTrnsAdvPric/modifyTrnsAdvPricTohospById",
            uACT: "",
          };
          $.ajax({
            url: "/tps-local-bd/web/bdc/zTender/log/saveTrnsAdjOprtLog",
            method: "post",
            // 通过headers对象设置请求头
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
              accountType: 2,
              refreshToken: localStorage.getItem("refreshToken"),
            },
            data: "[" + JSON.stringify(postdata) + "]",
            dataType: "json",
            //async: true,
            success: function (res) {
              console.log(res);
            },
          });
          await sleep(200);
        }
      },
      onerror: function (err) {
        console.log(err);
      },
    });
  });
  // 同步改价确认记录
  $("#demoqueren").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    for (let i = 1; i < 5; i++) {
      let params = {
        current: i,
        size: 500,
      };
      let jsonData = JSON.stringify(params);
      $.ajax({
        url: "/tps-local-bd/web/bdc/zTender/cccdTrnsAdvPric/getTrnsAdvPriceList",
        method: "post",
        // 通过headers对象设置请求头
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
          accountType: 2,
          refreshToken: localStorage.getItem("refreshToken"),
        },
        data: jsonData,
        dataType: "json",
        //async: true,
        success: async function (res) {
          if (res.code !== 0) {
            toastr.success("请先登陆后再下载");
          }
          GM_xmlhttpRequest({
            method: "post",
            url: "http://www.huadu1.com/api/index/export7",
            data: JSON.stringify(res),
            headers: { "Content-Type": "application/json" },
            onload: function (res) {
              toastr.success("同步成功！");
            },
            onerror: function (err) {
              console.log(err);
            },
          });
          await sleep(10000);
        },
        error: function (e) {
          console.log("ajax请求异常，异常信息如下：", e);
        },
      });
    }
  });
  // 同步改价记录
  $("#demogaijia").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    for (let i = 1; i < 7; i++) {
      let params = {
        current: i,
        size: 500,
      };
      let jsonData = JSON.stringify(params);
      $.ajax({
        url: "/tps-local-bd/web/bdc/zTender/cccdHospList/page",
        method: "post",
        // 通过headers对象设置请求头
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
          accountType: 2,
          refreshToken: localStorage.getItem("refreshToken"),
        },
        data: jsonData,
        dataType: "json",
        //async: true,
        success: function (res) {
          if (res.code !== 0) {
            toastr.success("请先登陆后再下载");
          }
          GM_xmlhttpRequest({
            method: "post",
            url: "http://www.huadu1.com/api/index/export5",
            data: JSON.stringify(res),
            headers: { "Content-Type": "application/json" },
            onload: function (res) {
              toastr.success("同步成功！");
            },
            onerror: function (err) {
              console.log(err);
            },
          });
        },
        error: function (e) {
          console.log("ajax请求异常，异常信息如下：", e);
        },
      });
    }
  });
  //下载本院药品目录
  $("#demo6").click(function () {
    GM_openInTab("http://www.huadu1.com/api/index/getmulu", {
      active: true,
      setParent: true,
    });
  });
  //同步购物车
  $("#demo1").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    // 先将本地购物车同步到服务端
    $.ajax({
      url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/list",
      method: "post",
      // 通过headers对象设置请求头
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
        accountType: 2,
        refreshToken: localStorage.getItem("refreshToken"),
      },
      data: jsonData,
      dataType: "json",
      //async: true,
      success: function (res) {
        if (res.code !== 0) {
          toastr.success("请先登陆后再下载");
        }
        GM_xmlhttpRequest({
          method: "post",
          url: "http://www.huadu1.com/api/index/tcar",
          data: JSON.stringify(res),
          headers: { "Content-Type": "application/json" },
          onload: function (res) {
            // 同步成功后后续操作
            let tarr = JSON.parse(res.response);
            $("#demo3").click();
            if (tarr.length > 0) {
              // 搜索药品
              let tbc = 0;
              for (let i = 0; i < tarr.length; i++) {
                let params = {
                  current: 1,
                  size: 20,
                  carType: 0,
                  tmdpName: tarr[i]["medicine"],
                };
                let jsonData = JSON.stringify(params);
                $.ajax({
                  url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/listDrugs",
                  method: "post",
                  // 通过headers对象设置请求头
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                    accountType: 2,
                    refreshToken: localStorage.getItem("refreshToken"),
                  },
                  data: jsonData,
                  dataType: "json",
                  success: function (res1) {
                    // 搜索出来有结果的
                    if (res1.code === 0 && res1.data.total > 0) {
                      for (let j = 0; j < res1.data.total; j++) {
                        try {
                          // 药品名称一样，并且厂家一样  进行加入购物车  根据商品ID
                          if (
                            res1.data.records[j]["tmdpName"] ==
                              tarr[i]["medicine"] &&
                            res1.data.records[j]["delventpName"] ==
                              tarr[i]["jobname"]
                          ) {
                            let params = {
                              delventpId: res1.data.records[j]["delventpId"],
                              carType: 0,
                              pubonlnId: res1.data.records[j]["pubonlnId"],
                              purcCnt: tarr[i]["quantity"],
                              purcpric: res1.data.records[j]["purcPric"],
                              shopDetlId: "",
                            };
                            let jsonData = JSON.stringify(params);
                            $.ajax({
                              url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/add",
                              method: "post",
                              // 通过headers对象设置请求头
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: localStorage.getItem("token"),
                                accountType: 2,
                                refreshToken: localStorage.getItem("refreshToken"),
                              },
                              data: jsonData,
                              dataType: "json",
                              success: function (res2) {
                                // 加入购物车成功的话进行同步
                                if (res2.code == 0) {
                                  tbc += 1;
                                  let params = {
                                    id: tarr[i]["id"],
                                    other: JSON.stringify(res2),
                                  };
                                  let jsonData = JSON.stringify(params);
                                  GM_xmlhttpRequest({
                                    method: "post",
                                    url: "http://www.huadu1.com/api/index/ustatus",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    data: jsonData,
                                    onload: function (res) {
                                      console.log(res);
                                      toastr.success(
                                        res1.data.records[j]["tmdpName"] +
                                          "同步成功"
                                      );
                                    },
                                  });
                                }
                              },
                              error: function (e) {
                                console.log("ajax请求异常，异常信息如下：", e);
                              },
                            });
                          }
                        } catch (error) {
                          let error_msg = JSON.stringify(res1) + error;
                          let postdata = {
                            errmsg: error_msg,
                          };
                          GM_xmlhttpRequest({
                            method: "post",
                            url: "http://www.huadu1.com/api/index/postmsg",
                            data: JSON.stringify(postdata),
                            headers: { "Content-Type": "application/json" },
                            onload: function (res) {
                              console.log(res);
                            },
                            onerror: function (err) {
                              console.log(err);
                            },
                          });
                          return true;
                        } finally {                          
                          if (tbc == tarr.length) {
                            toastr.success("同步成功，可以点击查看同步情况");
                          }
                        }
                      }
                    } else {
                      if (typeof res1.data == "string") {
                        toastr.success(res1.data);
                      } else {
                        toastr.success(JSON.stringify(res1.data));
                      }
                    }
                  },
                  error: function (e) {
                    console.log("ajax请求异常，异常信息如下：", e);
                  },
                });
              }
            } else {
              toastr.success("插件内未发现数据");
            }
          },
          onerror: function (err) {
            console.log(err);
          },
        });
      },
      error: function (e) {
        console.log("ajax请求异常，异常信息如下：", e);
      },
    });
  });
  //查看同步情况
  $("#demo2").click(function () {
    GM_xmlhttpRequest({
      method: "get",
      url: "http://www.huadu1.com/api/index/tcar",
      headers: { "Content-Type": "application/json" },
      onload: function (res) {
        let tarr = JSON.parse(res.response);
        let str = "";
        if (tarr.length > 0) {
          str = "未同步成功的记录有(您可以再点击同步购物车进行同步)：\n";
          for (let k = 0; k < tarr.length; k++) {
            str +=
              tarr[k]["medicine"] +
              " " +
              tarr[k]["jobname"] +
              " " +
              tarr[k]["quantity"] +
              "\n";
          }
        } else {
          str = "已完全同步购物车";
        }
        toastr.success(str);
      },
      onerror: function (err) {
        console.log(err);
      },
    });
  });
  //清空购物车
  $("#demo3").click(function () {
    // 先进行获取购物车的所有信息
    let params = {
      current: 1,
      size: 500,
      carType: 0,
    };
    let jsonData = JSON.stringify(params);
    $.ajax({
      url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/list",
      method: "post",
      // 通过headers对象设置请求头
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
        accountType: 2,
        refreshToken: localStorage.getItem("refreshToken"),
      },
      data: jsonData,
      dataType: "json",
      success: function (res) {
        // 进行删除购物车记录
        if (res.code == 0) {
          if (res.data.length > 0) {
            let qkc = 0;
            for (let j = 0; j < res.data.length; j++) {
              let params = {
                pubonlnId: res.data[j]["pubonlnId"],
                shopDetlId: res.data[j]["shopDetlId"],
                shopId: res.data[j]["shopDetlId"],
                carType: 0,
              };
              let jsonData = JSON.stringify(params);
              $.ajax({
                url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/delete",
                method: "post",
                // 通过headers对象设置请求头
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                  accountType: 2,
                  refreshToken: localStorage.getItem("refreshToken"),
                },
                data: jsonData,
                dataType: "json",
                success: function (res1) {
                  //   删除成功
                  if (res1.code == 0) {
                    console.log("删除成功");
                  } else {
                    console.log(res1);
                  }
                  qkc += 1;
                  if (qkc == res.data.length) {
                    toastr.success("已清空购物车！");
                  }
                },
                error: function (e) {
                  console.log("ajax请求异常，异常信息如下：", e);
                },
              });
            }
          } else {
            toastr.success("已清空购物车！");
          }
        } else {
          toastr.success("请先进行登陆");
        }
      },
      error: function (e) {
        console.log("ajax请求异常，异常信息如下：", e);
      },
    });
  });
  //入库购物车
  $("#demo4").click(function () {
    GM_openInTab("http://www.huadu4.com/pure.html", {
      active: true,
      setParent: true,
    });
  });
  //清空未同步药品
  $("#demo7").click(function () {
    GM_xmlhttpRequest({
      method: "get",
      url: "http://www.huadu1.com/api/index/qwcar",
      headers: { "Content-Type": "application/json" },
      onload: function (res) {
        toastr.success("清空未同步药品成功");
      },
      onerror: function (err) {
        console.log(err);
      },
    });
  });
  //检查购物车完整性
  $("#demo9").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    $.ajax({
      url: "/tps-local-bd/web/bdc/zTender/cccdDrug/shoporder/list",
      method: "post",
      // 通过headers对象设置请求头
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
        accountType: 2,
        refreshToken: localStorage.getItem("refreshToken"),
      },
      data: jsonData,
      dataType: "json",
      //async: true,
      success: function (res) {
        if (res.code !== 0) {
          toastr.success("请先登陆后再下载");
        }
        GM_xmlhttpRequest({
          method: "post",
          url: "http://www.huadu1.com/api/index/checkcar",
          data: JSON.stringify(res),
          headers: { "Content-Type": "application/json" },
          onload: function (res) {
            toastr.success(res.responseText);
          },
          onerror: function (err) {
            console.log(err);
          },
        });
      },
      error: function (e) {
        console.log("ajax请求异常，异常信息如下：", e);
      },
    });
  });
  // 下载所有处理中订单
  $("#demo8").click(function () {
    if (localStorage.getItem("token").length == 0) {
      toastr.success("请先登陆后再下载");
      return;
    }
    var currentDate = new Date();
    var entTime = currentDate.toISOString().substring(0, 10) + " 23:59:59";
    currentDate.setDate(currentDate.getDate() - 7);
    var startTime = currentDate.toISOString().substring(0, 10) + " 00:00:00";
    var params = {
      current: 1,
      size: 100,
      isFwz: 1,
      entTime: entTime,
      startTime: startTime,
    };
    var jsonData = JSON.stringify(params); //转为json字符串
    $.ajax({
      url: "/tps-local-bd/web/bdc/zTender/orderMgt/queryTrnsOrderList",
      method: "post",
      // 通过headers对象设置请求头
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
        accountType: 2,
        refreshToken: localStorage.getItem("refreshToken"),
      },
      data: jsonData,
      dataType: "json",
      success: function (res) {
        if (res.code !== 0) {
          toastr.success("请先登陆后再下载");
        }
        if (res.data.records.length > 0) {
          GM_xmlhttpRequest({
            method: "post",
            url: "http://www.huadu1.com/api/index/checkdif",
            data: JSON.stringify(res),
            headers: { "Content-Type": "application/json" },
            onload: function (res11) {
              let tobj = JSON.parse(res11.responseText);
              for (let i = 0; i < tobj.length; i++) {
                var params = { current: 1, size: 100, purcDocno: tobj[i] };
                var jsonData = JSON.stringify(params);
                $.ajax({
                  url: "/tps-local-bd/web/bdc/zTender/orderMgt/getTrnsOrderDetlInfo",
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                    accountType: 2,
                    refreshToken: localStorage.getItem("refreshToken"),
                  },
                  dataType: "json",
                  data: jsonData,
                  success: function (res1) {
                    res1.purcStas = res.data.records[i]["purcStas"];
                    GM_xmlhttpRequest({
                      method: "post",
                      url: "http://www.huadu1.com/api/index/export2",
                      data: JSON.stringify(res1),
                      headers: { "Content-Type": "application/json" },
                      onload: function (res3) {
                        toastr.success(res3);
                      },
                      onerror: function (err) {
                        console.log(err);
                      },
                    });
                  },
                  error: function (e) {
                    console.log("ajax请求异常，异常信息如下：", e);
                  },
                });
              }
              toastr.success("同步完成");
            },
            onerror: function (err) {
              console.log(err);
            },
          });
        }
      },
      error: function (e) {
        console.log("ajax请求异常，异常信息如下：", e);
      },
    });
  });
})();

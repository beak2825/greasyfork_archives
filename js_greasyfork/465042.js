// ==UserScript==
// @name         投后结案(人群分析_画像分析)
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/evaluation_brand/report/audience/portrait?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        GM.xmlHttpRequest
// @license      MIT
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/465042/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90_%E7%94%BB%E5%83%8F%E5%88%86%E6%9E%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465042/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E4%BA%BA%E7%BE%A4%E5%88%86%E6%9E%90_%E7%94%BB%E5%83%8F%E5%88%86%E6%9E%90%29.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var new_element = document.createElement("link");
    new_element.setAttribute("rel", "stylesheet");
    new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
    document.body.appendChild(new_element);

    const button = document.createElement("div");
    button.textContent = "导出画像";
    Object.assign(button.style, {
        height: "34px",
        lineHeight: "var(--line-height, 34px)",
        alignItems: "center",
        color: "white",
        background: "linear-gradient(60deg, rgb(95, 240, 225), rgb(47, 132, 254))",
        borderRadius: "5px",
        marginLeft: "10px",
        fontSize: "13px",
        padding: "0 10px",
        cursor: "pointer",
        fontWeight: "500"
    });
    button.addEventListener("click", urlClick); //监听按钮点击事件

    const getRequestOptions = {
        method: "GET",
        redirect: "follow",
    };

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }

    //message.js
    let loadingMsg = null;

    let xhrList = [];

    (function listen() {
      var origin = {
        open: XMLHttpRequest.prototype.open,
        send: XMLHttpRequest.prototype.send
      }
      XMLHttpRequest.prototype.open = function(a, b) {
        this.addEventListener('load', replaceFn)
        origin.open.apply(this, arguments)
      }
      XMLHttpRequest.prototype.send = function(a, b) {
        origin.send.apply(this, arguments)
      }
      function replaceFn(obj) {
        if (this?._url?.slice(0, 53) == '/measurement/api/eva/get_evaluation_audience_portrait') {
          xhrList.push(obj?.target?._data);
        }
      }
    })()

    function appendDoc() {
        setTimeout(() => {
            var like_comment =
                document.getElementsByClassName("index__extra--tCgrA")[0];
            if (like_comment) {
                like_comment.append(button); //把按钮加入到 x 的子节点中
                return;
            }
            appendDoc();
        }, 1000);
    }
    appendDoc();

    function fetchFun(url, data, requestOptions = getRequestOptions) {
        const urlData = Object.keys(data)
            .map((v) => `${v}=${data[v]}`)
            .join("&");
        return fetch(`${url}?${urlData}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                return JSON.parse(result);
            })
            .catch((error) => console.log("error", error));
    }

    async function getRaw(e,arr){
        let data = JSON.parse(e)
        let task_id = getQueryVariable("task_id")
        let raw = arr.map(v=>{
            return {...data,task_id,"card_type": v}
        })
        return raw
    }

    function formatPortrait(data) {
        const portrait = data.portrait || [];
        const result = [];
        portrait.forEach((category) => {
          category.label_list.forEach((label) => {
            const formattedData = {
              name: category.name_zh,
              label_id: label.label_id,
              name_zh: label.name_zh,
              value: label.value,
              tgi: label.tgi,
              label_all_cnt: label.label_all_cnt,
            };
            result.push(formattedData);
          });
        });
        return result;
      }
      

    async function task_list() {
        let myHeaders = new Headers();
        myHeaders.append("authority", "yuntu.oceanengine.com");
        myHeaders.append("accept", "application/json, text/plain, */*");
        myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
        myHeaders.append("content-type", "application/json");

        // let element = document.querySelector('.index__name--cRoDQ');
        // let content = element.firstChild.innerText;

        let data = {
            aadvid: getQueryVariable("aadvid"),
        };

        let raw = await getRaw(xhrList[xhrList.length - 1],[6,7,8,9,10]);

        let resData = await Promise.all(
            raw.map(async v=>{
                let raws = JSON.stringify(v)
                const postRequestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raws,
                    redirect: "follow",
                };
                let res = await fetchFun(
                    "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_audience_portrait",
                    data,
                    postRequestOptions
                );
                return res
            })
        )

        const formatRes = (res) => {
            return res?.map((v) => {
                return formatPortrait(v?.data);
            })
        };
        expExcel(formatRes(resData))
    }
//提交数据到服务器
function submitData(option) {
    //从localStorage获取statBaseUrl
    let statBaseUrl = localStorage.getItem("statBaseUrl");
    if (!statBaseUrl) {
      Qmsg.error("statBaseUrl获取失败，请联系管理员！");
      loadingMsg.close();
      return;
    }
    //获取当前脚本名称
    const scriptName = GM_info.script.name;
    //使用GM.xmlHttpRequest将数据提交到后端服务器
    GM.xmlHttpRequest({
      method: "POST",
      url: statBaseUrl,
      data: JSON.stringify({
        ...option,
        plugins_name: scriptName,
        advertiser_id: getQueryVariable("aadvid"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        let res = JSON.parse(response.responseText);
        if (res.code == "990") {
          Qmsg.success("数据已上传");
          var toExcel = new ExportJsonExcel(option);
          toExcel.saveExcel();
          setTimeout(() => {
            loadingMsg.close();
          }, 1000);
        } else {
          loadingMsg.close();
          Qmsg.error("数据上传失败，请联系管理员！");
        }
      },
      onerror: function (response) {
        Qmsg.error("数据上传失败，请联系管理员！");
        loadingMsg.close();
      },
    });
  }

    function expExcel(transformData_target) {
        let contrast = {
            标签类型: "name",
            标签: "name_zh",
            tgi: "tgi",
            占比: "value",
          };
          let element = document.querySelectorAll(".evaluation-input.evaluation-input-size-md")
        let fileName = `推广类型：${element[8]?.value}-触点：${element[9]?.value}`;
        let sheelName = [
            '全部触达',
            '点击',
            '互动',
            '转化',
            '仅触达无交互'
        ]

        let option = {};
        option.fileName = fileName; //文件名
        option.datas = transformData_target.map((v,i)=>{
            return {
                sheetName:sheelName[i],
                sheetData: v.length?v:[{}],
                sheetHeader: Object.keys(contrast),
                sheetFilter: Object.values(contrast),
                columnWidths: [], // 列宽
            }});
        
            submitData(option);
        
    }
    function urlClick() {
        if (xhrList.length) {
            loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
            task_list();
          } else {
            loadingMsg = Qmsg.error("数据加载失败，请重试");
          }
    }
})();
// ==UserScript==
// @name         投后结案(定时生成报告)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_ng/evaluation_brand/task_list?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/463728-lodash-js/code/lodashjs.js?version=1174104
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/486672/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E5%AE%9A%E6%97%B6%E7%94%9F%E6%88%90%E6%8A%A5%E5%91%8A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486672/%E6%8A%95%E5%90%8E%E7%BB%93%E6%A1%88%28%E5%AE%9A%E6%97%B6%E7%94%9F%E6%88%90%E6%8A%A5%E5%91%8A%29.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var new_element = document.createElement('link');
    new_element.setAttribute('rel', 'stylesheet');
    new_element.setAttribute('href', 'https://qmsg.refrain.xyz/message.min.css');
    document.body.appendChild(new_element);

    const button = document.createElement("div");
    button.textContent = "生成报告";
    Object.assign(button.style, {
        height: "34px",
        lineHeight: "var(--line-height, 34px)",
        alignItems: "center",
        color: "white",
        background: "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
        borderRadius: "5px",
        marginLeft: "10px",
        fontSize: "13px",
        padding: "0 10px",
        cursor: "pointer",
        fontWeight: "500",
    });
    button.addEventListener("click", urlClick); //监听按钮点击事件
    const getRequestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    //message.js
    let loadingMsg = null

    function appendDoc() {
        setTimeout(() => {
        var like_comment = document.querySelector('.index__btnWrapper--gvaIn');
            if (like_comment) {
                like_comment.append(button); //把按钮加入到 x 的子节点中
                return
            }
            appendDoc()
        }, 1000);
    }
    appendDoc()

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
        
      //获取aadvid
      const aadvid = getQueryVariable("aadvid");
    
    
    async function fetchFun(url, data, requestOptions = getRequestOptions()) {
        const params = new URLSearchParams(data).toString();
        try {
          const response = await fetch(`${url}?${params}`, requestOptions);
          if (response.ok) {
            const result = await response.json();
            return result;
          } else {
            throw new Error(`Fetch failed: ${response.status}`);
          }
        } catch (error) {
          loadingMsg.close();
          Qmsg.error({
            content: `网络请求错误: ${error.message}`,
            timeout: 5000
          });
          throw error;
        }
      }

    let myHeaders = new Headers();
    myHeaders.append("authority", "yuntu.oceanengine.com");
    myHeaders.append("accept", "application/json, text/plain, */*");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("origin", "https://yuntu.oceanengine.com");
    myHeaders.append("referer", "https://yuntu.oceanengine.com/yuntu_ng/evaluation_brand/task_create?task_id=677363&mode=2&aadvid=1672744301182989");

    async function getList(){
        let raw = JSON.stringify({
            "main_brand_id": "1094484",
            "level_1_industry_id": 13,
            "offset": 0,
            "count": 10,
            "order_type": 1,
            "task_statuses": [
                2,
                1
            ]
        });
        let data = {
            aadvid
        }
        const postRequestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        let total = await fetchFun(
            "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_task_list_v2",
            data,
            postRequestOptions
        );

        return total
    }

    async function getNotList(){
        let raw = JSON.stringify({
            "main_brand_id": "1094484",
            "level_1_industry_id": 13,
            "offset": 0,
            "count": 10,
            "order_type": 1,
            "task_statuses": [
                0
            ]
        });
        let data = {
            aadvid
        }
        const postRequestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        let total = await fetchFun(
            "https://yuntu.oceanengine.com/measurement/api/eva/get_evaluation_task_list_v2",
            data,
            postRequestOptions
        );

        return total
    }

    async function createdTask(task_id){
        let raw = JSON.stringify({
            "main_brand_id": "1094484",
            "level_1_industry_id": 13,
            "user_id": "99406591190",
            "staff_id": "",
            "task_id": task_id
        });
        let data = {
            aadvid
        }
        const postRequestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        let total = await fetchFun(
            "https://yuntu.oceanengine.com/measurement/api/eva/start_calculate_evaluation_task",
            data,
            postRequestOptions
        );

        return total
    }

    async function urlClick() {
        loadingMsg = Qmsg.loading("任务开启成功～");
        let interval = setInterval(async () => {
            let notList = await getNotList()
            if (notList?.data?.task_list?.length > 1) {
                let res = await getList()
                if (res?.code===0 && res?.data?.task_list?.length<=5) {
                    createdTask(notList?.data?.task_list[1]?.task_id)
                }
            }else{
                clearInterval(interval)
            }
        }, 60000);
    }
})();

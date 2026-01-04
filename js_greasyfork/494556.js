// ==UserScript==
// @name         iWhaleCloudGit
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  git 批量操作
// @author       HolmesZhao
// @match        *://globaltech-code.alipay.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alipay.com
// @require https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @resource customCSS https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494556/iWhaleCloudGit.user.js
// @updateURL https://update.greasyfork.org/scripts/494556/iWhaleCloudGit.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 吕廷元,4913
    // 林伟,4896
    // 赵五一,4940

    const beProjectUrl =
          "https://globaltech-code.alipay.com/webapi/groups/Banco/overview?types=&page=1&per_page=15&events_page=1&_output_charset=utf-8&_input_charset=utf-8&ctoken=VXzCenNuvtS5YEzN";
    const beProjectReferrerUrl =
          "https://globaltech-code.alipay.com/groups/Banco";
    const qiProjectUrl =
          "https://globaltech-code.alipay.com/webapi/groups/qicard/overview?types=&page=1&per_page=15&events_page=1&_output_charset=utf-8&_input_charset=utf-8&ctoken=VXzCenNuvtS5YEzN";
    const qiProjectReferrerUrl =
          "https://globaltech-code.alipay.com/groups/qicard";
    // Your code here...
    async function getProjects(url, referrer) {
        const source = await fetch(url, {
            headers: {
                accept: "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "antcode-request-type": "ANTCODE_WEB_REQUEST",
                "linkc-request-type": "LINKC_WEB_REQUEST",
                priority: "u=1, i",
                "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"macOS"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-request-lib": "@alipay/bigfish/sdk/fetch",
            },
            referrer: referrer,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include",
        });
        return source.json();
    }

    function createList(datas, top, left) {
        var myDiv = document.getElementById("myDiv");
        if (myDiv == null) {
            myDiv = document.createElement("div");
            myDiv.setAttribute("id", "myDiv");
            myDiv.setAttribute(
                "style",
                `position: fixed;top: ${top}px;left: ${left}px;background-color: #ddd;border: 1px solid #000;padding: 10px;z-index:1000`
      );
        document.body.appendChild(myDiv);
    } else {
        myDiv.innerHTML = "";
    }

      var selectList = document.createElement("select");
      selectList.setAttribute("multiple", "");
      selectList.setAttribute(
          "style",
          "background-color: white; padding-right: 9px; height:" +
          datas.length * 22 +
          "px;" // 22 = 18(字号) + 4(间隙)
      );

      const selectedValues = [];
      selectList.addEventListener("change", () => {
          selectedValues.length = 0;
          for (let i = 0; i < selectList.options.length; i++) {
              const option = selectList.options[i];
              if (option.selected) {
                  selectedValues.push(option.value);
              }
          }
      });

      const inputHTML = `
    <div style="padding: 10px;">
        <div style="display: flex;">
            <span style="width: 80px;">标题</span>
            <textarea id="iwc_title" placeholder="请输入标题" style="margin-left: 5px;"></textarea>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <span style="width: 80px;">描述</span>
            <textarea id="iwc_desc" placeholder="请输入描述" style="margin-left: 5px;"></textarea>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <span style="width: 80px;">源分支</span>
            <textarea id="iwc_source" placeholder="请输入源分支, eg: develop-4b-xxxxx" style="margin-left: 5px;"></textarea>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <span style="width: 80px;">目标分支</span>
            <textarea id="iwc_target" placeholder="请输入目标分支, eg: develop-4b" style="margin-left: 5px;"></textarea>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <span style="width: 80px;">合并后删除来源分支</span>
            <textarea
            id="iwc_delete"
            placeholder="默认不删除 0 也可以代码为默认删除 1"
            style="margin-left: 5px;"
            >0</textarea>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <span style="width: 80px;">合并指派给</span>
            <textarea id="iwc_assignee" placeholder="请输入合并人" style="margin-left: 5px;"></textarea>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <span style="width: 80px;">审核人</span>
            <textarea
            id="iwc_reviewer_ids"
            placeholder="请输入审核人, 用英文逗号链接"
            style="margin-left: 5px;"
            ></textarea>
        </div>
        <div style="display: flex;margin-top: 10px;">
            <span style="width: 80px;">审核票数</span>
            <textarea
            id="iwc_threshold"
            placeholder="请输入审核票数"
            style="margin-left: 5px;"
            ></textarea>
        </div>
    </div>
    `;
      const inputDiv = document.createElement("div");
      inputDiv.innerHTML = inputHTML;

      var contentDiv = document.createElement("div");
      contentDiv.style.display = "flex";
      myDiv.appendChild(contentDiv);
      contentDiv.appendChild(selectList);
      contentDiv.appendChild(inputDiv);

      var buttonDiv = document.createElement("div");
      myDiv.appendChild(buttonDiv);

      var buttonClose = document.createElement("button");
      buttonClose.textContent = "关闭";
      buttonClose.style.marginLeft = "10px";
      buttonClose.style.marginTop = "10px";
      buttonClose.onclick = () => {
          myDiv.style.display = "none";
      };
      buttonDiv.appendChild(buttonClose);

      var buttonRefresh = document.createElement("button");
      buttonRefresh.textContent = "刷新列表";
      buttonRefresh.style.marginLeft = "10px";
      buttonRefresh.style.marginTop = "10px";
      buttonRefresh.onclick = async () => {
          // selectList 移除所有子节点
          while (selectList.firstChild) {
              selectList.removeChild(selectList.firstChild);
          }
          const result = await getProjects(beProjectUrl, beProjectReferrerUrl);
          let options = result.projects;

          for (var i = 0; i < options.length; i++) {
              var option = document.createElement("option");
              option.setAttribute("value", options[i].id);
              option.text = options[i].path_with_namespace;
              option.style.fontSize = "18px";
              selectList.appendChild(option);
          }
      };
      buttonDiv.appendChild(buttonRefresh);

      var button = document.createElement("button");
      button.textContent = "批量 MR";
      button.style.marginTop = "10px";
      button.style.marginLeft = "10px";
      button.onclick = () => {
          var textArr = [];
          datas.forEach((e) => {
              if (selectedValues.indexOf(e.id + "") === -1) return;

              const id = e.id;
              const title = e.path_with_namespace;
              const json = { id: id, title: title };
              textArr.push(json);
          });

          console.log(textArr);
          batchMR(textArr);
      };
      buttonDiv.appendChild(button);

      var options = datas;

      for (var i = 0; i < options.length; i++) {
          var option = document.createElement("option");
          option.setAttribute("value", options[i].id);
          option.text = options[i].path_with_namespace;
          option.style.fontSize = "18px";
          selectList.appendChild(option);
      }
  }

    function batchMR(datas) {
        if (datas.length === 0) {
            alert("请选择项目");
            return false;
        }

        const iwc_title = document.getElementById("iwc_title");
        const iwc_desc = document.getElementById("iwc_desc");
        const iwc_source = document.getElementById("iwc_source");
        const iwc_target = document.getElementById("iwc_target");
        const iwc_delete = document.getElementById("iwc_delete");
        const iwc_assignee = document.getElementById("iwc_assignee");
        const iwc_reviewer_ids = document.getElementById("iwc_reviewer_ids");
        const iwc_threshold = document.getElementById("iwc_threshold");
        // 校验是否存在并且字符串长度是否满足要求
        if (!iwc_title || iwc_title.value.trim().length === 0) {
            alert("Title is required");
            return false;
        }

        if (!iwc_desc || iwc_desc.value.trim().length === 0) {
            alert("Description is required");
            return false;
        }

        if (!iwc_source || iwc_source.value.trim().length === 0) {
            alert("Source is required");
            return false;
        }

        if (!iwc_target || iwc_target.value.trim().length === 0) {
            alert("Target is required");
            return false;
        }

        if (!iwc_delete || iwc_delete.value.trim().length === 0) {
            alert("Delete is required");
            return false;
        }

        if (!iwc_assignee || iwc_assignee.value.trim().length === 0) {
            alert("Assignee is required");
            return false;
        }

        if (!iwc_reviewer_ids || iwc_reviewer_ids.value.trim().length === 0) {
            alert("Reviewer IDs is required");
            return false;
        }

        if (!iwc_threshold || iwc_threshold.value.trim().length === 0) {
            alert("Threshold is required");
            return false;
        }
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("accept-language", "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7");
        myHeaders.append("antcode-request-type", "ANTCODE_WEB_REQUEST");
        myHeaders.append("content-type", "application/json");
        myHeaders.append("dnt", "1");
        myHeaders.append("linkc-request-type", "LINKC_WEB_REQUEST");
        myHeaders.append("origin", "https://globaltech-code.alipay.com");
        myHeaders.append("priority", "u=1, i");
        myHeaders.append("sec-ch-ua", "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
        myHeaders.append("sec-fetch-dest", "empty");
        myHeaders.append("sec-fetch-mode", "cors");
        myHeaders.append("sec-fetch-site", "same-origin");
        myHeaders.append("x-request-lib", "@alipay/bigfish/sdk/fetch");

        const raw = JSON.stringify({
            "title": iwc_title.value,
            "source_branch": iwc_source.value,
            "target_branch": iwc_target.value,
            "description": iwc_desc.value,
            "labels": "",
            "should_remove_source_branch": iwc_delete.value === "1",
            "squash_merge": false,
            "assignee_id": iwc_assignee.value,
            "review_required": true,
            "reviewer_ids": iwc_reviewer_ids.value,
            "threshold": iwc_threshold.value
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        datas.forEach((e) => {
            fetch(`https://globaltech-code.alipay.com/api/v3/projects/${e.id}/pull_requests?_output_charset=utf-8&_input_charset=utf-8`, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));
        });
    }

    async function startLoad(title) {
        const myDiv = document.getElementById("myDiv");
        if (myDiv) {
            myDiv.style.display = "block";
            return;
        }
        const buttons = document.getElementsByClassName("mmbutton");
        let button = null;
        for (let index = 0; index < buttons.length; index++) {
            const element = buttons[index];
            if (element.innerText == title) {
                button = element;
            }
        }
        if (button == null) {
            alert(`没有找到 ${title} 按钮`);
            return;
        }
        const result = await getProjects(beProjectUrl, beProjectReferrerUrl);
        createList(result.projects, button.offsetHeight, button.offsetLeft);
    }

    function addButton(name, marginLeft, top, fun) {
        var txt = document.createTextNode(name);
        var btn = document.createElement("button");
        btn.className = "mmbutton";
        btn.style =
            "z-index: 9999; font-size: large; position: fixed; top: " +
            top +
            "px; left: " +
            marginLeft +
            "px;border:1px solid black; padding: 0 10px;";
        btn.onclick = () => {
            fun(name);
        };
        btn.appendChild(txt);
        document.body.appendChild(btn);
        return btn.offsetWidth + btn.offsetLeft;
    }

    async function review() {
        try {
            const result = await getProjects(qiProjectUrl, qiProjectReferrerUrl);
            let options = result.projects;
            let project = ""
            options.forEach(e => {
                if (window.location.href.includes(e.path)) {
                    project = e.id
                }
            })
            if (project == "") {
                console.log("project", project)
                return;
            }
            const pullId = parseInt(window.location.href.split('pull_requests/')[1])
            if (pullId == undefined || pullId == 0) {
                console.log("pullId", pullId)
                return;
            }
            const pullReqs = await fetch("https://globaltech-code.alipay.com/webapi/projects/"+project+"/get_pull_request_by_iid?iid="+pullId+"&_output_charset=utf-8&_input_charset=utf-8&ctoken=ElGV8J1MmfmUFbun", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "antcode-request-type": "ANTCODE_WEB_REQUEST",
                    "linkc-request-type": "LINKC_WEB_REQUEST",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-request-lib": "@alipay/bigfish/sdk/fetch"
                },
                "referrer": "https://globaltech-code.alipay.com/qicard/standard-wallet-ios/pull_requests/551",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            const pullReqsJson = await pullReqs.json()
            const noteId = pullReqsJson.id
            if (noteId == undefined) {
                console.log("noteId", pullReqsJson.json())
                return;
            }
            await fetch("https://globaltech-code.alipay.com/webapi/projects/"+project+"/pull_requests/"+noteId+"/comments?type=Comment&note=%23codeReviewResult%23success&_output_charset=utf-8&_input_charset=utf-8&ctoken=ElGV8J1MmfmUFbun", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "antcode-request-type": "ANTCODE_WEB_REQUEST",
                    "linkc-request-type": "LINKC_WEB_REQUEST",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-request-lib": "@alipay/bigfish/sdk/fetch"
                },
                "referrer": "https://globaltech-code.alipay.com/qicard/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            $.toast({
                heading: 'Success',
                text: '请求成功',
                showHideTransition: 'slide',
                icon: 'success'
            })
        } catch(e) {
            $.toast({
                heading: 'Error',
                text: e,
                showHideTransition: 'fade',
                icon: 'error'
            })
        }
    }

    // onload
    const isFunction = (variable) => {
        return typeof variable === "function";
    };
    const bakOnload = window.onload;
    window.onload = async () => {
        const css = GM_getResourceText("customCSS");
        GM_addStyle(css);
        if (isFunction(bakOnload)) {
            bakOnload();
        }
    };

    console.log('执行了');

    var btnLeft = screen.width / 8;
    var marginLeft = 30;
    btnLeft += marginLeft;
    btnLeft = addButton("批量 MR", btnLeft, 0, startLoad);
    btnLeft = addButton("通过Review(只有 Xone 合并才能用)", btnLeft, 0, review);
    //   addButton('批量 MR', btnLeft, 40, copyImagesJSON2);
})();

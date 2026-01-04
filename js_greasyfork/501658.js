// ==UserScript==
// @name         Boss直聘AI投递助手[推荐工作页面专用]
// @namespace    http://ta11.net/
// @version      1.2.0
// @description  在推荐工作页面，通过AI自动给Boss打招呼，支持AI个性化招呼语，可设定最低薪资，可设定公司、岗位、地点、介绍黑名单
// @author       You
// @match        https://www.zhipin.com/web/geek/job-recommend*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// @require      https://update.greasyfork.org/scripts/449444/1081400/Hook%20Vue3%20app.js
// @require      https://unpkg.com/protobufjs@7.2.6/dist/protobuf.js
// @run-at       document-start
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/501658/Boss%E7%9B%B4%E8%81%98AI%E6%8A%95%E9%80%92%E5%8A%A9%E6%89%8B%5B%E6%8E%A8%E8%8D%90%E5%B7%A5%E4%BD%9C%E9%A1%B5%E9%9D%A2%E4%B8%93%E7%94%A8%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/501658/Boss%E7%9B%B4%E8%81%98AI%E6%8A%95%E9%80%92%E5%8A%A9%E6%89%8B%5B%E6%8E%A8%E8%8D%90%E5%B7%A5%E4%BD%9C%E9%A1%B5%E9%9D%A2%E4%B8%93%E7%94%A8%5D.meta.js
// ==/UserScript==

(function () {
  "use strict";
  //暴露变量到全局
  window._vueUnhooked_ = vueUnhooked;
  window._vueHooked_ = vueHooked;

  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 1000);
    }
  }

  waitForElement("#wrap > div.job-recommend-main", (element) => {
    loadSystem();
  });

  async function requestBossData(jobDetail, errorMsg = "", retries = 3) {
    let jobTitle =
      jobDetail.jobName +
      "-" +
      jobDetail.cityName +
      jobDetail.areaDistrict +
      jobDetail.businessDistrict;

    if (retries === 0) {
      throw new Error(jobTitle, errorMsg || "获取boss数据重试多次失败");
    }
    const url = "https://www.zhipin.com/wapi/zpchat/geek/getBossData";
    const token = _PAGE?.token;
    if (!token) {
      throw new Error(jobTitle, "未获取到zp-token");
    }

    const data = new FormData();
    data.append("bossId", jobDetail.encryptBossId);
    data.append("securityId", jobDetail.securityId);
    data.append("bossSrc", "0");

    let resp;
    try {
      resp = await fetch(url, {
        method: "POST",
        headers: { Zp_token: token },
        body: data,
      });
      resp = await resp.json();
    } catch (e) {
      return this.requestBossData(jobDetail, e.message, retries - 1);
    }

    if (resp.code !== 0) {
      throw new Error(jobTitle, resp.message);
    }
    return resp.zpData;
  }

  class Message {
    static AwesomeMessage;
    static {
      let Type = protobuf.Type,
        Field = protobuf.Field;
      const root = new protobuf.Root()
        .define("cn.techwolf.boss.chat")
        .add(
          new Type("TechwolfUser")
            .add(new Field("uid", 1, "int64"))
            .add(new Field("name", 2, "string", "optional"))
            .add(new Field("source", 7, "int32", "optional"))
        )
        .add(
          new Type("TechwolfMessageBody")
            .add(new Field("type", 1, "int32"))
            .add(new Field("templateId", 2, "int32", "optional"))
            .add(new Field("headTitle", 11, "string"))
            .add(new Field("text", 3, "string"))
        )
        .add(
          new Type("TechwolfMessage")
            .add(new Field("from", 1, "TechwolfUser"))
            .add(new Field("to", 2, "TechwolfUser"))
            .add(new Field("type", 3, "int32"))
            .add(new Field("mid", 4, "int64", "optional"))
            .add(new Field("time", 5, "int64", "optional"))
            .add(new Field("body", 6, "TechwolfMessageBody"))
            .add(new Field("cmid", 11, "int64", "optional"))
        )
        .add(
          new Type("TechwolfChatProtocol")
            .add(new Field("type", 1, "int32"))
            .add(new Field("messages", 3, "TechwolfMessage", "repeated"))
        );
      Message.AwesomeMessage = root.lookupType("TechwolfChatProtocol");
    }

    constructor({ form_uid, to_uid, to_name, content }) {
      const r = new Date().getTime();
      const d = r + 68256432452609;
      const data = {
        messages: [
          {
            from: {
              uid: form_uid,
              source: 0,
            },
            to: {
              uid: to_uid,
              name: to_name,
              source: 0,
            },
            type: 1,
            mid: d.toString(),
            time: r.toString(),
            body: {
              type: 1,
              templateId: 1,
              text: content,
            },
            cmid: d.toString(),
          },
        ],
        type: 1,
      };
      this.msg = Message.AwesomeMessage.encode(data).finish().slice();
      this.hex = [...this.msg]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    toArrayBuffer() {
      return this.msg.buffer.slice(0, this.msg.byteLength);
    }

    send() {
      ChatWebsocket.send(this);
    }
  }

  function loadSystem() {
    console.log("开始自动打招呼模块加载");
    // 初始化app
    let app = document.querySelector("#wrap > div.job-recommend-main").__vue__;

    // 创建悬浮面板
    const panel = document.createElement("div");
    Object.assign(panel.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      zIndex: "10000",
      backgroundColor: "white",
      border: "1px solid black",
      padding: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
    });
    const style = document.createElement("style");
    style.innerHTML = `
      #startAutoApply:disabled, #stopAutoApply:disabled {
        background-color: #ccc !important; /* 灰色背景 */
        cursor: not-allowed;
      }
      #panelContent {
        display: none;
      }
      #togglePanel {
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    panel.innerHTML = `
        <div id="togglePanel" style="margin-bottom: 10px; padding: 8px 16px; background-color: blue; color: white; border: none; border-radius: 4px;">展开/收起面板</div>
        <div id="panelContent">
          <button id="startAutoApply" style="margin-bottom: 10px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">开始自动投递</button>
          <button id="stopAutoApply" style="margin-bottom: 20px; padding: 8px 16px; background-color: red; color: white; border: none; border-radius: 4px;" disabled="true">停止自动投递</button>
          <br>
          <label for="blacklist" style="display: block; margin-bottom: 5px; font-weight: bold;">黑名单工作信息（逗号分隔，可以是公司名，可以是岗位名，可以是地点，会检测工作信息是否包含）:</label>
          <input type="text" id="blacklist" value="字节跳动,北京,猎头,老师,信息安全" style="width: 100%; margin-bottom: 20px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <br>
          <label for="minSalary" style="display: block; margin-bottom: 5px; font-weight: bold;">最低薪资（k）:</label>
          <input type="number" id="minSalary" value="10" style="width: 100%; margin-bottom: 20px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <br>
          <label for="skipInactiveBoss" style="display: block; margin-bottom: 5px; font-weight: bold;">跳过不活跃Boss（一周以上未活跃）:</label>
          <input type="checkbox" id="skipInactiveBoss" checked style="margin-left: 5px;">
          <br>
          <label for="customGreeting" style="display: block; margin-bottom: 5px; font-weight: bold;">自定义打招呼语:</label>
          <input type="text" id="customGreeting" value="您好，岗位还在招人吗" style="width: 100%; margin-bottom: 20px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <br>
          <label for="useGPT" style="display: block; margin-bottom: 5px; font-weight: bold;">使用GPT个性化招呼:</label>
          <input type="checkbox" id="useGPT" style="margin-left: 5px;">
          <br>
          <label for="gptBaseUrl" style="display: block; margin-bottom: 5px; font-weight: bold;">GPT Base URL:</label>
          <input type="text" id="gptBaseUrl" value="https://xxxx/v1/chat/completions" style="width: 100%; margin-bottom: 20px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <br>
          <label for="gptApiKey" style="display: block; margin-bottom: 5px; font-weight: bold;">GPT API Key:</label>
          <input type="text" id="gptApiKey" value="sk-xxx" style="width: 100%; margin-bottom: 20px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          <br>
          <label for="whitelist" style="display: block; margin-bottom: 5px; font-weight: bold;">白名单工作信息（逗号分隔，可以是公司名，可以是岗位名，可以是地点，会检测工作信息是否包含）:</label>
          <input type="text" id="whitelist" value="开发" style="width: 100%; margin-bottom: 20px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
        </div>
    `;
    document.body.appendChild(panel);

    document.getElementById("togglePanel").addEventListener("click", () => {
      const panelContent = document.getElementById("panelContent");
      panelContent.style.display =
        panelContent.style.display === "none" ? "block" : "none";
    });

    let currentJobIndex = 0;

    function closeGreetBossDialog() {
      console.log("关闭打招呼弹窗");
      setTimeout(() => {
        try {
          document
            .querySelector("body > div.greet-boss-dialog")
            .__vue__.closeAction();
          console.log("关闭打招呼弹窗成功");
        } catch (error) {
          console.log("关闭打招呼弹窗失败", error);
        }
      }, 500);
    }

    function startAutoApply() {
      console.log("开始自动投递");
      document.getElementById("startAutoApply").disabled = true;
      document.getElementById("stopAutoApply").disabled = false;

      ApplyNextJob();
    }

    async function ApplyNextJob() {
      // 停止自动投递
      if (!document.getElementById("startAutoApply").disabled) {
        return;
      }
      // 获取配置
      const blacklist = document.getElementById("blacklist").value.split(",");
      const minSalary = parseInt(
        document.getElementById("minSalary").value,
        10
      );
      const skipInactiveBoss =
        document.getElementById("skipInactiveBoss").checked;
      const customGreeting = document.getElementById("customGreeting").value;
      const useGPT = document.getElementById("useGPT").checked;
      const gptBaseUrl = document.getElementById("gptBaseUrl").value;
      const gptApiKey = document.getElementById("gptApiKey").value;
      const whitelist = document.getElementById("whitelist").value.split(",");

      // 获取工作列表
      let jobList = app.jobList;
      if (jobList.length < currentJobIndex + 1) {
        // 加载更多工作
        console.log("加载更多工作");
        app.next = 5;
        app.searchJobAction(app.pageVo.page + 1, { loadMore: true });
        // 自动投递下一个工作
        setTimeout(() => {
          ApplyNextJob();
        }, 5000);
      } else {
        // 指定要加载的工作
        app.currentJob = jobList[currentJobIndex];
        console.log(
          `加载第${currentJobIndex + 1}个工作，工作名称：${
            app.currentJob.jobName
          }，工作薪水：${app.currentJob.salaryDesc}，公司名称：${
            app.currentJob.brandName
          }`
        );

        // 黑名单工作
        if (
          blacklist.some((company) =>
            JSON.stringify(app.currentJob).includes(company)
          )
        ) {
          console.log("黑名单工作，跳过");
          currentJobIndex++;
          // 自动投递下一个工作
          setTimeout(() => {
            ApplyNextJob();
          }, 1000);
          return;
        }

        // 白名单工作
        if (whitelist.length > 0) {
          if (
            whitelist.every((company) =>
              JSON.stringify(app.currentJob).includes(company)
            )
          ) {
            console.log("白名单工作，优先处理");
          } else {
            console.log("不在白名单中，跳过");
            currentJobIndex++;
            // 自动投递下一个工作
            setTimeout(() => {
              ApplyNextJob();
            }, 1000);
            return;
          }
        } else {
          console.log("未开启白名单机制");
        }

        // 最低薪资
        if (parseInt(app.currentJob.salaryDesc.split("-")[0], 10) < minSalary) {
          console.log(`最低薪资低于${minSalary}k，跳过`);
          currentJobIndex++;
          // 自动投递下一个工作
          setTimeout(() => {
            ApplyNextJob();
          }, 1000);
          return;
        }

        await app.loadJobDetail();

        let bossInfo = document.querySelector(
          "#wrap > div.job-recommend-main > div.job-recommend-result > div > div > div.job-detail-container > div"
        ).__vue__.bossInfo;
        if (!bossInfo.activeTimeDesc) {
          bossInfo.activeTimeDesc = "未知";
        }
        console.log(`Boss活跃度：${bossInfo.activeTimeDesc}`);
        if (
          skipInactiveBoss &&
          ["周", "月", "年"].some((time) =>
            bossInfo.activeTimeDesc.includes(time)
          )
        ) {
          console.log(`Boss不活跃：${bossInfo.activeTimeDesc}，跳过`);
          currentJobIndex++;
          // 自动投递下一个工作
          setTimeout(() => {
            ApplyNextJob();
          }, 1000);
          return;
        }

        console.log("开始打招呼");
        document
          .querySelector(
            "#wrap > div.job-recommend-main > div.job-recommend-result > div > div > div.job-detail-container > div"
          )
          .__vue__.startChatAction(
            "cpc_job_list_chat_" + app.currentJob.encryptId
          );
        // 等待2秒
        await new Promise((resolve) => setTimeout(resolve, 2000));
        closeGreetBossDialog();
        requestBossData(app.jobDetail)
          .then(async (bossData) => {
            let greeting = customGreeting;
            if (useGPT) {
              console.log("使用GPT打招呼");
              greeting = await getGPTGreeting(
                gptBaseUrl,
                gptApiKey,
                app.currentJob
              );
            }
            console.log({
              form_uid: _PAGE.uid.toString(),
              to_uid: bossData.data.bossId.toString(),
              to_name: app.currentJob.encryptBossId,
              content: greeting
                .replaceAll("\\n", "\n")
                .replace(/<br[^>]*>/g, "\n"),
            });
            new Message({
              form_uid: _PAGE.uid.toString(),
              to_uid: bossData.data.bossId.toString(),
              to_name: app.currentJob.encryptBossId,
              content: greeting
                .replaceAll("\\n", "\n")
                .replace(/<br[^>]*>/g, "\n"),
            }).send();
          })
          .catch((error) => {
            console.log("请求Boss数据失败", error);
          })
          .finally(() => {
            currentJobIndex++;
            // 自动投递下一个工作
            setTimeout(() => {
              ApplyNextJob();
            }, 1000);
          });
      }
    }

    async function getGPTGreeting(baseUrl, apiKey, currentJob) {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `你是求职者，你在给Boss打招呼，表达你符合这个岗位要求，希望面试这个岗位。请你仅回复打招呼语，不要回复其他内容，不要出现XX这样的未知字符: 岗位名：${currentJob.jobName}，公司名：${currentJob.brandName}，Boss名：${currentJob.bossName}`,
            },
          ],
          max_tokens: 90,
        }),
      });
      const data = await response.json();
      console.log("GPT打招呼语：", data.choices[0].message.content);
      return data.choices[0].message.content;
    }

    function stopAutoApply() {
      console.log("停止自动投递");
      document.getElementById("startAutoApply").disabled = false;
      document.getElementById("stopAutoApply").disabled = true;
    }

    document
      .getElementById("startAutoApply")
      .addEventListener("click", startAutoApply);
    document
      .getElementById("stopAutoApply")
      .addEventListener("click", stopAutoApply);
  }
})();

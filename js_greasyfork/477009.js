// ==UserScript==
// @name         Midjourney Autopic(放大专用版)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Discord自动点击Midjourney的U1、U2、U3、U4，自动下载所有图片，满80张会自动下载zip包，不到80张点关闭即可自动下载。
// @author       老陆(vx:laolu2045)
// @match        https://discord.com/channels/*/*
// @icon         https://www.midjourney.com/favicon.ico
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.8/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/477009/Midjourney%20Autopic%28%E6%94%BE%E5%A4%A7%E4%B8%93%E7%94%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477009/Midjourney%20Autopic%28%E6%94%BE%E5%A4%A7%E4%B8%93%E7%94%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const sessionId = "ea8816d857ba9ae2f74c59ae1a953afe";
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  let arr = [];
  for (let i = 1; i <= 9999; i++) {
    // 将数字格式化为4位字符串，例如"0001", "0002"等
    let formattedNum = String(i).padStart(4, "0");
    arr.push({
      num: formattedNum,
      count: 0,
      download: 0,
    });
  }
  async function clickButtons(lastMsg) {
    const promptsText = Array.from(
      lastMsg.querySelector("div[id^=message-content-]>strong")?.childNodes ??
        []
    )
      .map((node) => node.textContent)
      .join(" ")
      .slice(0, 4); // 取前4个字符

    const buttonArr = Array.from(lastMsg.querySelectorAll("button")).filter(
      (button) =>
        ["U1", "U2", "U3", "U4"].some(
          (text) => button.textContent.trim() === text
        )
    );
    const buttonZoomArr = Array.from(lastMsg.querySelectorAll("button")).filter(
      (button) =>
        ["Zoom Out 2x", "Zoom Out 1.5x"].some(
          (text) => button.textContent.trim() === text
        )
    );
    if (buttonArr.length >= 4) {
      buttonArr[0].click();
      console.log("点击1下U1按钮");
    }
    let obj = arr.find((item) => item.num === promptsText);
    if (buttonZoomArr.length == 2 && obj.count < 2) {
      buttonZoomArr[1].click();
      if (obj) {
        obj.count += 1;
      }
      console.log("点击1下zoom1.5按钮");
    }
  }
  //midjourney机器人
  function sendMessage(token, channelId, guildId, sessionId, content) {
    const url = `https://discord.com/api/v9/interactions`;
    const payload = {
      type: 2,
      application_id: "936929561302675456",
      guild_id: guildId,
      channel_id: channelId,
      session_id: sessionId,
      data: {
        version: "1118961510123847772",
        id: "938956540159881230",
        name: "imagine",
        type: 1,
        options: [
          {
            type: 3,
            name: "prompt",
            value: content,
          },
        ],
        application_command: {
          id: "938956540159881230",
          application_id: "936929561302675456",
          version: "1118961510123847772",
          default_member_permissions: null,
          type: 1,
          nsfw: false,
          name: "imagine",
          description: "Create images with Midjourney",
          dm_permission: true,
          contexts: [0, 1, 2],
          options: [
            {
              type: 3,
              name: "prompt",
              description: "The prompt to imagine",
              required: true,
            },
          ],
        },
        attachments: [],
      },
      nonce: Date.now().toString(),
    };
    console.log(payload);
    const request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Authorization", token);
    request.send(JSON.stringify(payload));
  }
  //niji机器人
  function sendMessageNiji(token, channelId, guildId, sessionId, content) {
    const url = `https://discord.com/api/v9/interactions`;
    const payload = {
      type: 2,
      application_id: "1022952195194359889",
      guild_id: guildId,
      channel_id: channelId,
      session_id: sessionId,
      data: {
        version: "1121575453916942378",
        id: "1023054140580057099",
        name: "imagine",
        type: 1,
        options: [
          {
            type: 3,
            name: "prompt",
            value: content,
          },
        ],
        application_command: {
          id: "1023054140580057099",
          application_id: "1022952195194359889",
          version: "1121575453916942378",
          default_member_permissions: null,
          type: 1,
          nsfw: false,
          name: "imagine",
          description: "Create images with Niji journey",
          dm_permission: true,
          contexts: [0, 1, 2],
          options: [
            {
              type: 3,
              name: "prompt",
              description: "The prompt to imagine",
              required: true,
            },
          ],
        },
        attachments: [],
      },
      nonce: Date.now().toString(),
    };
    console.log(payload);
    const request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Authorization", token);
    request.send(JSON.stringify(payload));
  }

  function getToken() {
    const webpackChunkdiscord_app = unsafeWindow.webpackChunkdiscord_app;
    const m = [];
    webpackChunkdiscord_app.push([
      [""],
      {},
      (e) => {
        for (let c in e.c) m.push(e.c[c]);
      },
    ]);

    const tokenModule = m.find((m) => m?.exports?.default?.getToken !== void 0);
    const token = tokenModule.exports.default.getToken();
    return token;
  }
  const token = getToken();
  let messages = [];
  let commandInterval = [];
  let roundInterval = [];
  let commandsPerRound = 0;

  async function paotu() {
    createModal();
  }
  let downloads = "all";
  let bot = "mj";
  let paotuisRunning = false;
  async function createModal() {
    // 创建一个半透明的背景
    const overlay = document.createElement("div");
    overlay.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    `;

    // 创建一个带有毛玻璃效果的窗口
    const modal = document.createElement("div");
    modal.style = `
        width: 50%;
        padding: 40px;
        background: rgba(225, 225, 225, 0.7);
        border-radius: 10px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
        text-align: center;
    `;
    const label1 = document.createElement("label");
    label1.textContent = "顺序读取表格第1列的数据";
    label1.style = `margin-right: 10px;`;
    // 创建选择命令表格的按钮
    const commandTableButton = document.createElement("button");
    commandTableButton.textContent = "选择MJ命令xlsx表格";
    commandTableButton.style = `
        margin: 10px;
        padding: 10px;
        font-size: 18px;
        border-radius: 5px;
        background: linear-gradient(90deg, rgba(0, 121, 191, 0.8) 0%, rgba(0, 212, 255, 0.8) 100%);
        color: white;
        cursor: pointer;
        border: none;
        transition: background 0.5s;
    `;

    // 创建单选框组
    const radioGroupDiv = document.createElement("div");

    // MJ机器人选项
    const mjRobotRadio = document.createElement("input");
    mjRobotRadio.type = "radio";
    mjRobotRadio.name = "robotSelection";
    mjRobotRadio.id = "mjRobot";
    mjRobotRadio.value = "MJ机器人";
    mjRobotRadio.checked = true; // 默认选择MJ机器人
    const mjRobotLabel = document.createElement("label");
    mjRobotLabel.htmlFor = "mjRobot";
    mjRobotLabel.textContent = "MJ机器人";
    mjRobotRadio.addEventListener("change", function () {
      if (this.checked) {
        bot = "mj";
      }
    });

    // Niji机器人选项
    const nijiRobotRadio = document.createElement("input");
    nijiRobotRadio.type = "radio";
    nijiRobotRadio.name = "robotSelection";
    nijiRobotRadio.id = "nijiRobot";
    nijiRobotRadio.value = "Niji机器人";
    const nijiRobotLabel = document.createElement("label");
    nijiRobotLabel.htmlFor = "nijiRobot";
    nijiRobotLabel.textContent = "Niji机器人";
    nijiRobotRadio.addEventListener("change", function () {
      if (this.checked) {
        bot = "niji";
      }
    });

    if (bot === "mj") {
      mjRobotRadio.checked = true;
    } else if (bot === "niji") {
      nijiRobotRadio.checked = true;
    }
    // 将单选框和对应的标签添加到单选框组中
    radioGroupDiv.appendChild(mjRobotRadio);
    radioGroupDiv.appendChild(mjRobotLabel);
    radioGroupDiv.appendChild(nijiRobotRadio);
    radioGroupDiv.appendChild(nijiRobotLabel);

    // 创建下载单选框组
    const downloadGroupDiv = document.createElement("div");

    // 全部下载
    const downloadAllRadio = document.createElement("input");
    downloadAllRadio.type = "radio";
    downloadAllRadio.name = "downloadSelection";
    downloadAllRadio.id = "downloadAll";
    downloadAllRadio.value = "全部下载";
    downloadAllRadio.checked = true; // 默认选择
    const downloadAllLabel = document.createElement("label");
    downloadAllLabel.htmlFor = "downloadAll";
    downloadAllLabel.textContent = "全部下载";
    downloadAllRadio.addEventListener("change", function () {
      if (this.checked) {
        downloads = "all";
        console.log("downloads", downloads);
      }
    });

    // 跳过4宫格下载
    const downloadSkipRadio = document.createElement("input");
    downloadSkipRadio.type = "radio";
    downloadSkipRadio.name = "downloadSelection";
    downloadSkipRadio.id = "downloadSkip";
    downloadSkipRadio.value = "跳过4宫格下载";
    const downloadSkipLabel = document.createElement("label");
    downloadSkipLabel.htmlFor = "downloadSkip";
    downloadSkipLabel.textContent = "跳过4宫格下载";
    downloadSkipRadio.addEventListener("change", function () {
      if (this.checked) {
        downloads = "skip";
        console.log("downloads", downloads);
      }
    });

    if (downloads === "all") {
      downloadAllRadio.checked = true;
    } else if (downloads === "skip") {
      downloadSkipRadio.checked = true;
    }
    // 将单选框和对应的标签添加到单选框组中
    downloadGroupDiv.appendChild(downloadAllRadio);
    downloadGroupDiv.appendChild(downloadAllLabel);
    downloadGroupDiv.appendChild(downloadSkipRadio);
    downloadGroupDiv.appendChild(downloadSkipLabel);

    modal.appendChild(radioGroupDiv);
    const brElement = document.createElement("br");
    modal.appendChild(brElement);
    modal.appendChild(downloadGroupDiv);
    modal.appendChild(label1);
    modal.appendChild(commandTableButton);

    // 创建输入字段
    const fields = [
      {
        label: "命令发送间隔时间（秒）【推荐6-10】",
        id: "command-interval",
        isRange: true,
      },
      {
        label: "每轮间隔时间（秒）【推荐800-1000】",
        id: "round-interval",
        isRange: true,
      },
      { label: "每轮命令数", id: "round-command-count", isRange: false },
    ];
    fields.forEach((field) => {
      const fieldContainer = document.createElement("div");
      fieldContainer.style = `display: flex; justify-content: center; align-items: center; margin: 20px;`;

      const label = document.createElement("label");
      label.textContent = field.label;
      label.style = `margin-right: 10px;`;

      if (field.isRange) {
        const labelDash = document.createElement("label");
        labelDash.textContent = "-";
        labelDash.style = `margin: 0 10px;`;
        const input = document.createElement("input");
        input.id = `${field.id}-1`; // 添加 ID
        input.style = `
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid rgba(0, 0, 0, 0.3);
        `;
        const input2 = document.createElement("input");
        input2.id = `${field.id}-2`; // 添加 ID
        input2.style = `
                padding: 10px;
                font-size: 16px;
                border-radius: 5px;
                border: 1px solid rgba(0, 0, 0, 0.3);
            `;

        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        fieldContainer.appendChild(labelDash);
        fieldContainer.appendChild(input2);
      } else {
        const input = document.createElement("input");
        input.style = `
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid rgba(0, 0, 0, 0.3);
        `;
        input.id = field.id;
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
      }

      modal.appendChild(fieldContainer);
    });

    // 创建开始按钮
    const startButton = document.createElement("button");
    if (paotuisRunning) {
      startButton.textContent = "停止跑图";
      startButton.style = `
        display: block;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px 20px;
        font-size: 18px;
        border: none;
        border-radius: 5px;
        background: linear-gradient(90deg, rgba(235, 52, 52, 1) 0%, rgba(236, 116, 116, 1) 100%);
        box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
        color: white;
        cursor: pointer;
        transition: background 0.5s;
    `;
    } else {
      startButton.textContent = "开始跑图";
      startButton.style = `
        display: block;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px 20px;
        font-size: 18px;
        border: none;
        border-radius: 5px;
        background: linear-gradient(90deg, rgba(39, 174, 96, 0.8) 0%, rgba(0, 230, 64, 0.8) 100%);
        box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
        color: white;
        cursor: pointer;
        transition: background 0.5s;
    `;
    }

    modal.appendChild(startButton);

    // 创建关闭按钮
    const closeButton = document.createElement("button");
    closeButton.textContent = "关闭";
    closeButton.style = `
        display: block;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background: linear-gradient(90deg, rgba(235, 52, 52, 1) 0%, rgba(236, 116, 116, 1) 100%);
        box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
        color: white;
        cursor: pointer;
        transition: background 0.5s;
    `;

    closeButton.addEventListener("mouseover", () => {
      closeButton.style.background = "rgba(236, 116, 116, 1)";
    });

    closeButton.addEventListener("mouseout", () => {
      closeButton.style.background =
        "linear-gradient(90deg, rgba(235, 52, 52, 1) 0%, rgba(236, 116, 116, 1) 100%)";
    });

    closeButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    modal.appendChild(closeButton);

    // 将窗口添加到背景上，然后将背景添加到文档上
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xlsx";
    fileInput.style.display = "none";
    modal.appendChild(fileInput);

    commandTableButton.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", handleFileSelect, false);

    function handleFileSelect(evt) {
      var files = evt.target.files;
      var f = files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        messages = jsonData.map((row) => row[0]);
      };

      reader.readAsArrayBuffer(f);
    }

    startButton.addEventListener("click", () => {
      const { commandInterval, roundInterval, roundCommandCount } =
        getFieldValues();
      arr.forEach((item) => {
        item.count = 0;
        item.download = 0;
      });
      if (!paotuisRunning) {
        // Start running
        paotuisRunning = true;
        startButton.textContent = "停止跑图";
        startButton.style = `
        display: block;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px 20px;
        font-size: 18px;
        border: none;
        border-radius: 5px;
        background: linear-gradient(90deg, rgba(235, 52, 52, 1) 0%, rgba(236, 116, 116, 1) 100%);
        box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
        color: white;
        cursor: pointer;
        transition: background 0.5s;
    `;
        sendCommands(commandInterval, roundInterval, roundCommandCount);
      } else {
        // Stop running
        paotuisRunning = false;
        startButton.textContent = "开始跑图";
        startButton.style = `
        display: block;
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        padding: 10px 20px;
        font-size: 18px;
        border: none;
        border-radius: 5px;
        background: linear-gradient(90deg, rgba(39, 174, 96, 0.8) 0%, rgba(0, 230, 64, 0.8) 100%);
        box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
        color: white;
        cursor: pointer;
        transition: background 0.5s;
    `;
      }
    });

    async function sendCommands(
      commandInterval,
      roundInterval,
      commandsPerRound
    ) {
      let counter = 0;
      let channelId = window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1,
        window.location.href.length
      );
      let urlParts = window.location.href.split("/");
      let guildId = urlParts[urlParts.length - 2];
      for (let i = 0; i < messages.length; i++) {
        if (!paotuisRunning) {
          // Stop sending commands if the running state is set to false
          break;
        }
        if (bot === "mj") {
          sendMessage(token, channelId, guildId, sessionId, messages[i]);
        } else if (bot === "niji") {
          sendMessageNiji(token, channelId, guildId, sessionId, messages[i]);
        }
        await sleeps(getRandom(commandInterval[0], commandInterval[1]));

        counter++;
        if (counter >= commandsPerRound) {
          counter = 0;
          await sleeps(getRandom(roundInterval[0], roundInterval[1]));
        }
      }
    }

    function sleeps(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms * 1000));
    }

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    function getFieldValues() {
      let commandInterval = [
        Number(document.querySelector("#command-interval-1").value),
        Number(document.querySelector("#command-interval-2").value),
      ];
      let roundInterval = [
        Number(document.querySelector("#round-interval-1").value),
        Number(document.querySelector("#round-interval-2").value),
      ];
      let roundCommandCount = Number(
        document.querySelector("#round-command-count").value
      );
      return { commandInterval, roundInterval, roundCommandCount };
    }
  }

  //自动下载
  // utils.ts 的内容
  function saveFile(content, fileName) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.download = fileName;
    link.href = URL.createObjectURL(content);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function getUrlBlob(url) {
    try {
      const res = await fetch(url);
      return res.blob();
    } catch {
      return null;
    }
  }

  // 主要的代码
  function checkIsMidjourneyBot(li) {
    if (!li) {
      return false;
    }
    var userName = li.querySelector(
      "h3[class^=header] span[class^=username]"
    )?.textContent;
    if (userName === "Midjourney Bot" || userName === "niji・journey Bot") {
      return true;
    }
    if (!userName) {
      return checkIsMidjourneyBot(li.previousElementSibling);
    }
  }

  function matchMidjourneyLis(li) {
    if (checkIsMidjourneyBot(li)) {
      const id = li.id.substring(14);
      const prompts = Array.from(
        li.querySelector("div[id^=message-content-]>strong")?.childNodes ?? []
      )
        .map((node) => node.textContent)
        .join(" ");
      console.log("prompts:", prompts);
      const url = li.querySelector(
        "div[class^=messageAttachment] div[class^=imageWrapper] a[data-role=img]"
      )?.href;

      const isFourGrid =
        Array.from(li.querySelectorAll("button"))
          ?.map((_) => _.textContent)
          ?.join("") === "U1U2U3U4V1V2V3V4";
      console.log("downloads", downloads);
      if (downloads === "all") {
        return {
          id,
          prompts,
          url,
        };
      } else if (downloads === "skip") {
        if (!isFourGrid) {
          return {
            id,
            prompts,
            url,
          };
        }
      }
    }
  }

  let currentZip = new JSZip();
  let zipCount = 0;
  let zipBatch = new Set();
  const flushThreshold = 80;
  let mutationObserver;

  function parseLiNode(node) {
    const data = matchMidjourneyLis(node);
    if (data?.url) {
      const matchResult = data.url.match(/^.+\/(.+?)\.png.*$/);
      const fileName = matchResult ? matchResult[1] : null;
      let updatedFileName = fileName;
      const text = data.prompts.slice(0, 4);
      let obj = arr.find((item) => item.num === text);
      //如果改图片名字
      if (fileName && obj) {
        // 使用正则表达式来查找与text相匹配的部分
        const regex = new RegExp(text);
        if (regex.test(fileName)) {
          // 替换与text匹配的部分，添加"_obj.download"
          updatedFileName = fileName.replace(regex, `${text}_${obj.download}`);
        }
      }
      if (fileName && !zipBatch.has(fileName)) {
        zipBatch.add(fileName);
        if (data.url && fileName) {
          getUrlBlob(data.url).then((binaryBlob) => {
            if (binaryBlob && currentZip && obj.download <= 2) {
              currentZip.file(`${updatedFileName}.png`, binaryBlob, {
                binary: true,
              });
              obj.download += 1;
            }
            zipCount++;
            console.log("11111", updatedFileName);
            console.log(
              `[NEW ARTWORK] ${data.url}`,
              `[ZIP COUNT] ${zipCount} / ${flushThreshold}`
            );
            if (zipCount >= flushThreshold) {
              flush();
            }
          });
        }
      }
    }
  }

  function startObserve() {
    mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        const addNodes = record.addedNodes;
        if (
          record.type === "childList" &&
          addNodes &&
          addNodes?.length &&
          record.target.tagName === "OL"
        ) {
          addNodes.forEach((node) => {
            const li = node;
            if (li.tagName === "LI" && li.id.startsWith("chat-messages-")) {
              parseLiNode(li);
            }
          });
        } else if (
          record.type === "attributes" &&
          record.attributeName === "class" &&
          record.target.tagName === "DIV" &&
          record.target.className.includes("imageWrapper")
        ) {
          let li = record.target;
          while (li && li.tagName !== "LI") {
            li = li.parentElement;
          }
          if (li) {
            parseLiNode(li);
          }
        }
      });
    });
    const contentList = document.querySelector('ol[class^="scrollerInner-"]');
    if (contentList) {
      mutationObserver.observe(contentList, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
  }

  async function flush() {
    if (zipCount) {
      const prevZip = currentZip;
      currentZip = new JSZip();
      zipCount = 0;
      zipBatch.clear();
      const zipContent = await prevZip.generateAsync({ type: "blob" });
      saveFile(zipContent, `midjourney-${Date.now()}.zip`);
    }
  }

  unsafeWindow.xiazai = flush;
  unsafeWindow.stopObserveAndDownload = function () {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
    currentZip = new JSZip();
    zipBatch = new Set();
  };

  function addButtons() {
    let style = document.createElement("style");
    let style_on = document.createElement("style");
    style.innerText = `.Btn{display:flex;width:90%;height:35px;margin:10px;justify-content: center;align-items: center;background-color: #2b2d31;color: white;font-weight: bolder;border-radius: 20px;box-shadow: 1px 1px 8px #e7ec1acf;}`;
    style_on.innerText = `.Btn_on{display:flex;width:90%;height:35px;margin:10px;justify-content: center;align-items: center;background-color: #2b2d31;color: white;font-weight: bolder;border-radius: 20px;box-shadow: 1px 1px 8px #1aec3fcf;}`;

    document.head.appendChild(style);
    document.head.appendChild(style_on);

    let btn2 = document.createElement("button");
    btn2.innerText = "自动下载图片";
    btn2.setAttribute("class", "Btn");
    document.querySelector(".scroller-1ox3I2").prepend(btn2);

    let btn2isRunning = false; // 初始状态为未运行

    document.querySelector(".Btn").addEventListener("click", function () {
      if (btn2isRunning) {
        // 如果已经在运行，那么停止它
        xiazai();
        sleep(500);
        stopObserveAndDownload();
        btn2.innerText = "自动下载图片"; // 按钮文字变回原样
        btn2.setAttribute("class", "Btn");
      } else {
        // 否则，开始运行
        startObserve();
        btn2.innerText = "停止（下载剩余图片）"; // 按钮文字变成：停止
        btn2.setAttribute("class", "Btn_on");
      }
      btn2isRunning = !btn2isRunning; // 切换运行状态
    });

    let btn3 = document.createElement("button");
    btn3.innerText = "自动选大图";
    btn3.setAttribute("class", "Btn");
    document.querySelector(".scroller-1ox3I2").prepend(btn3);

    let isRunning = false; // 初始状态为未运行
    let intervalId = null; // 保存setInterval的ID

    document.querySelector(".Btn").addEventListener("click", function () {
      if (isRunning) {
        // 如果已经在运行，那么停止它
        clearInterval(intervalId);
        btn3.innerText = "自动选大图"; // 按钮文字变回原样
        btn3.setAttribute("class", "Btn");
      } else {
        // 否则，开始运行
        let lastCheckedMessage = null;
        intervalId = setInterval(async function () {
          const allMsg = document.getElementsByClassName(
            "messageListItem-ZZ7v6g"
          ); //获取消息列表
          const lastMsg = allMsg[allMsg.length - 1]; //获取最后一条消息的元素
          if (lastMsg !== lastCheckedMessage) {
            lastCheckedMessage = lastMsg;
            await clickButtons(lastMsg);
          }
        }, 100); // 每100毫秒检查一次
        btn3.innerText = "自动选大图（已开启）"; // 按钮文字变成：已开启
        btn3.setAttribute("class", "Btn_on");
      }
      isRunning = !isRunning; // 切换运行状态
    });
    let btn4isRunning = false; // 初始状态为未运行
    let btn4 = document.createElement("button");
    btn4.innerText = "开始跑图";
    btn4.setAttribute("class", "Btn");
    document.querySelector(".scroller-1ox3I2").prepend(btn4);
    document.querySelector(".Btn").addEventListener("click", function () {
      console.log("开始跑图");
      paotu();
    });
  }

  function setupObserver() {
    const targetNode = document.getElementById("app-mount");
    const config = { childList: true, subtree: true };
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          if (
            document.querySelector(".scroller-1ox3I2") &&
            !document.querySelector(".Btn")
          ) {
            console.log("Adding buttons...");
            addButtons();
          }
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  setupObserver();
})();

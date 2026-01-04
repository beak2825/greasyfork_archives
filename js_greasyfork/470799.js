// ==UserScript==
// @name         Midjourney Autopic
// @namespace    http://tampermonkey.net/
// @version      1.4.9
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
// @downloadURL https://update.greasyfork.org/scripts/470799/Midjourney%20Autopic.user.js
// @updateURL https://update.greasyfork.org/scripts/470799/Midjourney%20Autopic.meta.js
// ==/UserScript==


(function () {
  ("use strict");
  const sessionId = "ea8816d857ba9ae2f74c59ae1a953afe";
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function clickButtons(lastMsg) {
    console.log(lastMsg);
    const buttonArr = Array.from(lastMsg.querySelectorAll("button")).filter(
      (button) =>
        ["U1", "U2", "U3", "U4"].some(
          (text) => button.textContent.trim() === text
        )
    );
    if (buttonArr.length >= 4) {
      for (let i = 0; i < 4; i++) {
        buttonArr[i].click();
        console.log("点击1下U按钮");
        await sleep(3000); // 在每次点击后等待3秒，1秒=1000
      }
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
        version: "1237876415471554623",
        // version: "1166847114203123795",
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
          version: "1237876415471554623",
          // version: "1166847114203123795",
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
        version: "1248805223892254774",
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
          version: "1248805223892254774",
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


function cleanToken(str) {
  // 去掉最外层可能存在的引号、空格、换行
  return str ? str.replace(/^"+|"+$/g, "").trim() : "";
}

function getToken() {
  /* ---------- 方法 1：webpack 内部 API ---------- */
  try {
    const chunk = window.webpackChunkdiscord_app;
    if (chunk) {
      const mods = [];
      chunk.push([
        [""],
        {},
        (e) => {
          if (e?.c) mods.push(...Object.values(e.c));
        }
      ]);
      const tokenModule = mods.find(
        (m) => m?.exports?.default?.getToken !== undefined
      );
      if (tokenModule) {
        return cleanToken(tokenModule.exports.default.getToken());
      }
    }
  } catch (err) {
    console.warn("webpack 获取 token 失败:", err);
  }

  /* ---------- 方法 2：localStorage 直接键 ---------- */
  try {
    const raw =
      localStorage.getItem("token") ||
      localStorage.getItem("discord_token");
    if (raw) {
      // localStorage.token 的值往往是 "\"mfa.xxxx\"" 这一类，需要 JSON.parse 去掉包裹引号
      const parsed = raw.startsWith('"') ? JSON.parse(raw) : raw;
      return cleanToken(parsed);
    }
  } catch (err) {
    // ignore
  }

  /* ---------- 方法 3：遍历 localStorage 兜底 ---------- */
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const val = localStorage.getItem(localStorage.key(i));
      if (!val) continue;

      // (3-1) 尝试解析 JSON，常见结构 {token: "..."}
      try {
        const obj = JSON.parse(val);
        if (obj?.token) return cleanToken(obj.token);
      } catch {
        /* 不是 JSON，继续正则判断 */
      }

      // (3-2) 直接正则匹配用户 token 形态
      if (
        /^(mfa\.[\w-]{80,})|([\w-]{24}\.[\w-]{6}\.[\w-]{27})$/.test(val.trim())
      ) {
        return cleanToken(val);
      }
    }
  } catch (err) {
    // ignore
  }

  console.error("getToken: 未找到有效的 Discord token");
  return null;
}



  const token = getToken();
  if (token) {
    console.log("成功获取 token！长度:", token.length);
    // 不要打印完整 token，这可能有安全风险
    console.log("Token 前10位:", token.substring(0, 10) + "...");
  } else {
    console.log("获取 token 失败");
  }

  let messages = [];
  let urls = [];
  let prompt = [];
  let promptUrl = [];
  let commandInterval = [];
  let roundInterval = [];
  let commandsPerRound = 0;

  async function paotu() {
    createModal();
  }
  let downloads = "cut";
  let bot = "mj";
  let paotuisRunning = false;
  // 此变量用于控制下载模式，可为 'zip' 或 'direct'
  let downloadMode = "direct";

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

    // 自动切割并下载
    const downloadCutRadio = document.createElement("input");
    downloadCutRadio.type = "radio";
    downloadCutRadio.name = "downloadSelection";
    downloadCutRadio.id = "downloadCut";
    downloadCutRadio.value = "自动切割并下载大图";
    const downloadCutLabel = document.createElement("label");
    downloadCutLabel.htmlFor = "downloadCut";
    downloadCutLabel.textContent = "自动切割并下载大图";
    downloadCutRadio.addEventListener("change", function () {
      if (this.checked) {
        downloads = "cut";
        console.log("downloads", downloads);
      }
    });

    if (downloads === "all") {
      downloadAllRadio.checked = true;
    } else if (downloads === "skip") {
      downloadSkipRadio.checked = true;
    } else if (downloads === "cut") {
      downloadCutRadio.checked = true;
    }

    // 将单选框和对应的标签添加到单选框组中
    downloadGroupDiv.appendChild(downloadAllRadio);
    downloadGroupDiv.appendChild(downloadAllLabel);
    downloadGroupDiv.appendChild(downloadSkipRadio);
    downloadGroupDiv.appendChild(downloadSkipLabel);
    downloadGroupDiv.appendChild(downloadCutRadio);
    downloadGroupDiv.appendChild(downloadCutLabel);

    // 创建下载模式单选框组
    const downloadModeGroupDiv = document.createElement("div");

    // zip打包图片下载
    const downloadZipRadio = document.createElement("input");
    downloadZipRadio.type = "radio";
    downloadZipRadio.name = "downloadModeSelection";
    downloadZipRadio.id = "downloadZip";
    downloadZipRadio.value = "下载图片zip包（80张）";
    downloadZipRadio.checked = true; // 默认选择
    const downloadZipLabel = document.createElement("label");
    downloadZipLabel.htmlFor = "downloadZip";
    downloadZipLabel.textContent = "下载图片zip包（80张）";
    downloadZipRadio.addEventListener("change", function () {
      if (this.checked) {
        downloadMode = "zip";
        console.log("downloadMode", downloadMode);
      }
    });

    // 单张图片下载
    const downloadDirectRadio = document.createElement("input");
    downloadDirectRadio.type = "radio";
    downloadDirectRadio.name = "downloadModeSelection";
    downloadDirectRadio.id = "downloadDirect";
    downloadDirectRadio.value = "下载单张图片";
    const downloadDirectLabel = document.createElement("label");
    downloadDirectLabel.htmlFor = "downloadDirect";
    downloadDirectLabel.textContent = "下载单张图片";
    downloadDirectRadio.addEventListener("change", function () {
      if (this.checked) {
        downloadMode = "direct";
        console.log("downloadMode", downloadMode);
      }
    });

    if (downloadMode === "zip") {
      downloadZipRadio.checked = true;
    } else if (downloadMode === "direct") {
      downloadDirectRadio.checked = true;
    }
    // 将单选框和对应的标签添加到单选框组中
    downloadModeGroupDiv.appendChild(downloadZipRadio);
    downloadModeGroupDiv.appendChild(downloadZipLabel);
    downloadModeGroupDiv.appendChild(downloadDirectRadio);
    downloadModeGroupDiv.appendChild(downloadDirectLabel);

    const brElement = document.createElement("br");
    modal.appendChild(radioGroupDiv);
    modal.appendChild(downloadGroupDiv);
    modal.appendChild(downloadModeGroupDiv);
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
      {
        label: "每轮命令数（个）【推荐5-8】",
        id: "round-command-count",
        isRange: true,
      },
      {
        label: "每条命令输出次数（默认1次）",
        id: "command-num",
        isRange: false,
      },
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
        if (field.id === "command-num") {
          input.type = "number";
          input.min = "1";
          input.max = "100";
          input.value = "1"; // 设置默认值
          input.style.width = "50px"; // 固定宽度以适应按钮
          const incrementButton = document.createElement("button");
          incrementButton.textContent = "+";
          incrementButton.onclick = function () {
            if (input.value < 100) input.value++;
          };

          const decrementButton = document.createElement("button");
          decrementButton.textContent = "-";
          decrementButton.onclick = function () {
            if (input.value > 1) input.value--;
          };

          fieldContainer.appendChild(label);
          fieldContainer.appendChild(decrementButton);
          fieldContainer.appendChild(input);
          fieldContainer.appendChild(incrementButton);
        } else {
          // 非 command-num 输入框的处理
          fieldContainer.appendChild(label);
          fieldContainer.appendChild(input);
        }
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
      const { commandInterval, roundInterval, roundCommandCount, commandNum } =
        getFieldValues();

      if (!paotuisRunning) {
        // Start running
        paotuisRunning = true;
        urls = [];
        prompt = [];
        promptUrl = [];
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
        sendCommands(
          commandInterval,
          roundInterval,
          roundCommandCount,
          commandNum
        );
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
      roundCommandCount,
      commandNum
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
          // 停止发送命令，如果运行状态被设置为 false
          break;
        }
        // 在每轮开始时，随机选择本轮的命令数
        let currentRoundCommandCount = Math.floor(
          Math.random() * (roundCommandCount[1] - roundCommandCount[0] + 1) +
            roundCommandCount[0]
        );
        for (let j = 0; j < commandNum; j++) {
          if (bot === "mj") {
            sendMessage(token, channelId, guildId, sessionId, messages[i]);
          } else if (bot === "niji") {
            sendMessageNiji(token, channelId, guildId, sessionId, messages[i]);
          }

          counter++;

          // 每次发送后检查是否达到每轮命令数
          if (counter >= currentRoundCommandCount) {
            counter = 0;
            await sleeps(getRandom(roundInterval[0], roundInterval[1]));
          } else if (j < commandNum - 1) {
            // 如果还未到达每轮命令数但命令需要重复发送，则等待命令间隔时间
            await sleeps(getRandom(commandInterval[0], commandInterval[1]));
          }
        }

        // 如果最后一条命令后未触发等待，这里需要额外的等待
        if (counter !== 0) {
          await sleeps(getRandom(commandInterval[0], commandInterval[1]));
        }
      }
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
      let roundCommandCount = [
        Number(document.querySelector("#round-command-count-1").value),
        Number(document.querySelector("#round-command-count-2").value),
      ];
      let commandNum = Number(document.querySelector("#command-num").value);
      return { commandInterval, roundInterval, roundCommandCount, commandNum };
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
      let bs = 0;
      const prompts = Array.from(
        li.querySelector("div[id^=message-content-]>strong")?.childNodes ?? []
      )
        .map((node) => node.textContent)
        .join(" ");
      //修改 div[class^=messageAttachment]
      const url = li.querySelector(
        "div[id^=message-accessories-] div[class^=imageWrapper] a[data-role=img]"
      )?.href;
      const isFourGrid =
        Array.from(li.querySelectorAll("button"))
          .map((_) => _.textContent.trim())
          .filter((text) => text !== "")
          .join("")
          .replace(/[\u200B-\u200D\uFEFF]/g, "") === "U1U2U3U4V1V2V3V4";
      if (isFourGrid) {
        bs = 0;
      } else {
        bs = 1;
      }
      if (downloads === "all") {
        return {
          id,
          prompts,
          url,
          bs,
        };
      } else if (downloads === "skip") {
        if (!isFourGrid) {
          return {
            id,
            prompts,
            url,
            bs,
          };
        }
      } else if (downloads === "cut") {
        if (isFourGrid) {
          return {
            id,
            prompts,
            url,
            bs,
          };
        }
      }
    }
  }

  let currentZip = new JSZip();
  let zipCount = 0;
  let zipBatch = new Set();
  //图片打包数量
  const flushThreshold = 80;
  let mutationObserver;

  //分割图片
  async function splitImageIntoFour(url) {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    const loadPromise = new Promise((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
    });
    image.src = url;
    await loadPromise;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;
    const midWidth = Math.floor(width / 2);
    const midHeight = Math.floor(height / 2);

    canvas.width = midWidth;
    canvas.height = midHeight;

    const blobs = [];
    const coordinates = [
      [0, 0, midWidth - 1, midHeight - 1], // Upper Left
      [midWidth, 0, width, midHeight - 1], // Upper Right
      [0, midHeight, midWidth - 1, height], // Lower Left
      [midWidth, midHeight, width, height], // Lower Right
    ];

    for (let i = 0; i < 4; i++) {
      ctx.clearRect(0, 0, midWidth, midHeight);
      const [sourceX1, sourceY1, sourceX2, sourceY2] = coordinates[i];
      ctx.drawImage(
        image,
        sourceX1,
        sourceY1,
        sourceX2 - sourceX1,
        sourceY2 - sourceY1,
        0,
        0,
        midWidth,
        midHeight
      );

      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      blobs.push(blob);
    }
    return blobs;
  }

  function processImage(data) {
    const regexFilename = /^.+\/(.+?)\.png.*$/;
    const matchResult = data.url.match(regexFilename);
    const fileName = matchResult ? matchResult[1] : null;
    const regexDigits = /_(\d{4})_/;

    if (fileName) {
      splitImageIntoFour(data.url).then((blobs) => {
        blobs.forEach((blob, index) => {
          let newFileName;
          if (regexDigits.test(fileName)) {
            newFileName = fileName.replace(
              regexDigits,
              `_${RegExp.$1}_U${index + 1}_`
            );
          } else {
            newFileName = fileName + "_" + "U" + (index + 1);
          }
          if (downloadMode === "zip") {
            currentZip.file(`${newFileName}.png`, blob, { binary: true });
            console.log(`[添加到ZIP] ${newFileName}`);
          } else if (downloadMode === "direct") {
            downloadImage(blob, `${newFileName}.png`);
            console.log(`[直接下载] ${newFileName}`);
          }
          zipCount++;
          // 添加对应的url
          if (data.bs === 0) {
            // 修改的部分开始
            const matchResults = data.prompts.match(/\d{4}/);
            const numberInPrompt = matchResults ? matchResults[0] : null;
            if (numberInPrompt) {
              for (let i = 0; i < messages.length; i++) {
                if (messages[i].includes(numberInPrompt)) {
                  const indexInUrls = urls.findIndex(
                    (entry) => entry.index === i
                  );

                  if (indexInUrls !== -1) {
                    urls.splice(indexInUrls, 1);
                  }
                  urls.push({ url: data.url, index: i });
                  console.log(urls);
                  break;
                }
              }
            }
            // 修改的部分结束
          }

          console.log(
            `[新的图片] ${newFileName}`,
            `[ZIP 计数] ${zipCount} / ${flushThreshold}`
          );
          if (zipCount >= flushThreshold && downloadMode === "zip") {
            flush();
          }
        });
      });
    }
  }

  // 直接下载图片的函数
  function downloadImage(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  function parseLiNode(node) {
    const data = matchMidjourneyLis(node);
    if (data?.url) {
      const matchResult = data.url.match(/^.+\/(.+?)\.png.*$/);
      const fileName = matchResult ? matchResult[1] : null;
      if (fileName && !zipBatch.has(fileName)) {
        zipBatch.add(fileName);
        // 如果 downloads 为 "cut"，则处理和切割图片
        if (downloads === "cut") {
          processImage(data);
        } else {
          getUrlBlob(data.url).then((binaryBlob) => {
            if (binaryBlob && currentZip && downloadMode === "zip") {
              currentZip.file(`${fileName}.png`, binaryBlob, {
                binary: true,
              });
            } else if (downloadMode === "direct") {
              downloadImage(binaryBlob, `${fileName}.png`);
            }
            zipCount++;
            if (downloads === "skip") {
              prompt.push(data.prompts);
              promptUrl.push(data.url);
            }
            // 添加对应的url
            if (data.bs === 0) {
              // 修改的部分开始
              const matchResults = data.prompts.match(/\d{4}/);
              const numberInPrompt = matchResults ? matchResults[0] : null;
              if (numberInPrompt) {
                for (let i = 0; i < messages.length; i++) {
                  if (messages[i].includes(numberInPrompt)) {
                    const indexInUrls = urls.findIndex(
                      (entry) => entry.index === i
                    );

                    if (indexInUrls !== -1) {
                      urls.splice(indexInUrls, 1);
                    }
                    urls.push({ url: data.url, index: i });
                    console.log(urls);
                    break;
                  }
                }
              }
              // 修改的部分结束
            }
            console.log(
              `[新的图片] ${data.url}`,
              `[ZIP 计数] ${zipCount} / ${flushThreshold}`
            );
            if (zipCount >= flushThreshold && downloadMode === "zip") {
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
    const contentList = document.querySelector('ol[class^="scrollerInner"]');
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

  //分割功能导出excel
  function exportToExcel() {
    // 1. 创建数据数组
    let data = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const urlObj = urls.find((u) => u.index === i);
      const url = urlObj ? urlObj.url : ""; // 如果找到与索引匹配的URL，则使用它，否则为空字符串
      data.push([message, url]);
    }

    // 2. 使用xlsx库生成工作表
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 3. 创建工作簿并将工作表添加到工作簿中
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 4. 导出工作簿到Excel文件
    XLSX.writeFile(wb, "data.xlsx");
  }

  //跳过4宫格图导出excel
  function exportToExcelSkip() {
    // 1. 创建数据数组
    let data = [];
    for (let i = 0; i < prompt.length; i++) {
      // 直接使用prompt和promptUrl数组的内容
      data.push([prompt[i], promptUrl[i]]);
    }

    // 2. 使用xlsx库生成工作表
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 3. 创建工作簿并将工作表添加到工作簿中
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 4. 导出工作簿到Excel文件
    XLSX.writeFile(wb, "data.xlsx");
  }

  unsafeWindow.xiazai = flush;
  unsafeWindow.stopObserveAndDownload = function () {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
    currentZip = new JSZip();
    zipBatch = new Set();
    if (downloads === "cut" && messages.length > 0 && urls.length > 0) {
      exportToExcel();
    } else if (
      downloads === "skip" &&
      prompt.length > 0 &&
      promptUrl.length > 0
    ) {
      exportToExcelSkip();
    }
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
    document.querySelector("._629e4c86564a4ee7-scroller").prepend(btn2);

    let btn2isRunning = false; // 初始状态为未运行

    document.querySelector(".Btn").addEventListener("click", function () {
      if (btn2isRunning) {
        // 如果已经在运行，那么停止它
        if (downloadMode === "zip") {
          xiazai();
        }
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
    document.querySelector("._629e4c86564a4ee7-scroller").prepend(btn3);

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
            "messageListItem_d5deea"
          ); //获取消息列表
          const lastMsg = allMsg[allMsg.length - 1]; //获取最后一条消息的元素
          if (lastMsg !== lastCheckedMessage) {
            lastCheckedMessage = lastMsg;
            await clickButtons(lastMsg);
          }
        }, 5); // 每5毫秒检查一次
        btn3.innerText = "自动选大图（已开启）"; // 按钮文字变成：已开启
        btn3.setAttribute("class", "Btn_on");
      }
      isRunning = !isRunning; // 切换运行状态
    });
    let btn4isRunning = false; // 初始状态为未运行
    let btn4 = document.createElement("button");
    btn4.innerText = "开始跑图";
    btn4.setAttribute("class", "Btn");
    document.querySelector("._629e4c86564a4ee7-scroller").prepend(btn4);
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
            document.querySelector("._629e4c86564a4ee7-scroller") &&
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

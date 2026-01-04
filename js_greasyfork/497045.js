// ==UserScript==
// @name         ip-checker
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  显示当前使用的公网IP地址，并带有折叠展开功能和刷新功能，以及IP风险查询功能
// @author       https://linux.do/u/snaily
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.ipify.org
// @connect      api64.ipify.org
// @connect      ip-api.com
// @connect      scamalytics.com
// @connect      ping0.cc
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497045/ip-checker.user.js
// @updateURL https://update.greasyfork.org/scripts/497045/ip-checker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 检查是否为顶级窗口
  if (window !== top) {
    console.log("Not in top window, exiting script.");
    return;
  }

  function fetchCurrentIP() {
    console.log("Fetching current IP...");
    const refreshButton = document.getElementById("refreshIpInfo");
    if (refreshButton) {
      refreshButton.disabled = true;
      refreshButton.innerHTML = "正在刷新...";
    }

    let ipv6 = null;
    // Fetch IPv6
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://api64.ipify.org?format=json",
      onload: function (response) {
        console.log("IPv6 fetched:", response.responseText);
        const ipInfo = JSON.parse(response.responseText);
        ipv6 = isIPv6(ipInfo.ip) ? ipInfo.ip : null;
        console.log(ipv6);
      },
      onerror: function (error) {
        console.log("Error fetching IPv6:", error);
        if (refreshButton) {
          refreshButton.disabled = false;
          refreshButton.innerHTML = "刷新IP信息";
        }
      },
    });

    // Fetch IPv4
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://api.ipify.org?format=json",
      onload: function (response) {
        console.log("IPv4 fetched:", response.responseText);
        const ipInfo = JSON.parse(response.responseText);
        fetchIPDetails(ipInfo.ip, ipv6);
      },
      onerror: function (error) {
        console.log("Error fetching IPv4:", error);
        if (refreshButton) {
          refreshButton.disabled = false;
          refreshButton.innerHTML = "刷新IP信息";
        }
      },
    });
  }

  function isIPv6(ip) {
    // IPv6正则表达式
    const ipv6Pattern = new RegExp(
      "^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$|^fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}$|^::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])$|^([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])$"
    );
    return ipv6Pattern.test(ip);
  }

  function fetchIPDetails(ip, ipv6, callback) {
    console.log("Fetching IP details for:", ip);
    console.log(ipv6);
    GM_xmlhttpRequest({
      method: "GET",
      url: "http://ip-api.com/json/" + ip,
      onload: function (response) {
        console.log("IP details fetched:", response.responseText);
        const ipDetails = JSON.parse(response.responseText);
        fetchIPRisk(ip, ipv6, ipDetails, callback);
      },
      onerror: function (error) {
        console.log("Error fetching IP details:", error);
        const refreshButton = document.getElementById("refreshIpInfo");
        if (refreshButton) {
          refreshButton.disabled = false;
          refreshButton.innerHTML = "刷新IP信息";
        }
        if (callback) {
          callback(); // 查询失败后恢复按钮状态
        }
      },
    });
  }

  function fetchIPRisk(ip, ipv6, details, callback) {
    console.log("Fetching IP risk for:", ip);
    console.log(ipv6);
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://scamalytics.com/ip/${ip}`,
      onload: function (response) {
        console.log("IP risk fetched:", response.responseText);
        const riskData = parseIPRisk(response.responseText);
        fetchPing0Risk(ip, ipv6, details, riskData);
        if (callback) {
          callback(); // 查询成功后恢复按钮状态
        }
      },
      onerror: function (error) {
        console.log("Error fetching IP risk:", error);
        displayIPDetails(ipv6, details, null, null);
        const refreshButton = document.getElementById("refreshIpInfo");
        if (refreshButton) {
          refreshButton.disabled = false;
          refreshButton.innerHTML = "刷新IP信息";
        }
      },
    });
  }

  function fetchPing0Risk(ip, ipv6, details, riskData) {
    console.log("Fetching Ping0 risk for:", ip);
    console.log(ipv6);
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://ping0.cc/ip/${ip}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
      },
      onload: function (response) {
        console.log("Initial Ping0 response:", response.responseText);
        const windowX = parseWindowX(response.responseText);
        if (windowX) {
          console.log("Parsed window.x value:", windowX);
          GM_xmlhttpRequest({
            method: "GET",
            url: `https://ping0.cc/ip/${ip}`,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
              Cookie: `jskey=${windowX}`,
            },
            onload: function (response) {
              console.log("Final Ping0 response:", response.responseText);
              const ping0Data = parsePing0Risk(response.responseText);
              displayIPDetails(ipv6, details, riskData, ping0Data);
              const refreshButton = document.getElementById("refreshIpInfo");
              if (refreshButton) {
                refreshButton.disabled = false;
                refreshButton.innerHTML = "刷新IP信息";
              }
            },
            onerror: function (error) {
              console.log("Error fetching final Ping0 risk:", error);
              displayIPDetails(ipv6, details, riskData, null);
              const refreshButton = document.getElementById("refreshIpInfo");
              if (refreshButton) {
                refreshButton.disabled = false;
                refreshButton.innerHTML = "刷新IP信息";
              }
            },
          });
        } else {
          console.log("Failed to retrieve window.x value.");
          displayIPDetails(ipv6, details, riskData, null);
          const refreshButton = document.getElementById("refreshIpInfo");
          if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.innerHTML = "刷新IP信息";
          }
        }
      },
      onerror: function (error) {
        console.log("Error fetching initial Ping0 page:", error);
        displayIPDetails(ipv6, details, riskData, null);
        const refreshButton = document.getElementById("refreshIpInfo");
        if (refreshButton) {
          refreshButton.disabled = false;
          refreshButton.innerHTML = "刷新IP信息";
        }
      },
    });
  }

  function parseIPRisk(html) {
    console.log("Parsing IP risk data...");
    const scoreMatch = html.match(/"score":"(.*?)"/);
    const riskMatch = html.match(/"risk":"(.*?)"/);
    if (riskMatch) {
      const riskData = {
        score: scoreMatch[1],
        risk: riskMatch[1],
      };
      console.log("Parsed risk data:", riskData);
      return riskData;
    }
    console.log("Failed to parse risk data.");
    return null;
  }

  function parseWindowX(html) {
    console.log("Parsing window.x value...");
    const match = html.match(/window\.x\s*=\s*'([^']+)'/);
    const windowX = match ? match[1] : null;
    console.log("Parsed window.x:", windowX);
    return windowX;
  }

  function parsePing0Risk(html) {
    console.log("Parsing Ping0 risk data...");
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const ipType = doc.evaluate(
      "/html/body/div[2]/div[2]/div[1]/div[2]/div[8]/div[2]/span",
      doc,
      null,
      XPathResult.STRING_TYPE,
      null
    ).stringValue;
    const nativeIP = doc.evaluate(
      "/html/body/div[2]/div[2]/div[1]/div[2]/div[10]/div[2]/span",
      doc,
      null,
      XPathResult.STRING_TYPE,
      null
    ).stringValue;
    const element = doc.querySelector(
      "#check > div.container > div.info > div.content > div.line.line-risk > div.content > div > div.riskitem.riskcurrent > span.value"
    );
    const riskValue = element.textContent;

    const ping0Data = {
      riskValue: riskValue.trim(),
      ipType: ipType.trim(),
      nativeIP: nativeIP.trim(),
    };
    console.log("Parsed Ping0 data:", ping0Data);
    return ping0Data;
  }

  function displayIPDetails(ipv6, details, riskData, ping0Data) {
    console.log("Displaying IP details...");
    let ipElement = document.getElementById("ipInfo");
    if (!ipElement) {
      ipElement = document.createElement("div");
      ipElement.id = "ipInfo";
      ipElement.style.position = "fixed";
      ipElement.style.top = GM_getValue("ipInfoTop", "10px");
      ipElement.style.right = "-1000px";
      ipElement.style.backgroundColor = "#0a0a0a";
      ipElement.style.padding = "15px";
      ipElement.style.borderRadius = "0 0 0 10px";
      ipElement.style.boxShadow = "0 0 20px rgba(0,255,255,0.3)";
      ipElement.style.fontSize = "14px";
      ipElement.style.color = "#00ffff";
      ipElement.style.zIndex = "9999";
      ipElement.style.transition = "right 0.3s ease, box-shadow 0.3s ease";
      ipElement.style.fontFamily = "'Orbitron', sans-serif";
      ipElement.style.border = "1px solid #00ffff";
      const title = document.createElement("div");
      title.style.fontWeight = "bold";
      title.style.marginBottom = "10px";
      title.style.fontSize = "18px";
      title.style.textShadow = "0 0 5px #00ffff";
      title.innerText = "IP检测信息";

      const refreshButton = createButton("刷新IP信息", fetchCurrentIP);
      refreshButton.id = "refreshIpInfo";
      const toggleButton = createButton("展开信息", toggleIpInfo);
      toggleButton.id = "toggleIpInfo";
      toggleButton.style.display = "none";
      const inputContainer = document.createElement("div");
      inputContainer.style.marginTop = "10px";
      const ipInput = document.createElement("input");
      ipInput.id = "queryIpInput";
      ipInput.type = "text";
      ipInput.placeholder = "输入IP地址";
      ipInput.style.marginRight = "5px";
      ipInput.style.marginRight = "5px";
      ipInput.style.width = "auto";
      ipInput.style.color = "#00ffff";
      ipInput.style.border = "1px solid #00ffff";
      ipInput.style.padding = "5px";
      const queryButton = createButton("查询IP", queryIpInfo);

      queryButton.id = "queryIpButton";
      queryButton.innerHTML = "查询IP";
      queryButton.style.width = "auto";
      queryButton.style.backgroundColor = "#1a1a1a";
      queryButton.style.color = "#00ffff";
      queryButton.style.border = "1px solid #00ffff";
      queryButton.style.borderRadius = "0";
      queryButton.style.padding = "5px 10px";
      queryButton.style.cursor = "pointer";
      queryButton.style.fontSize = "12px";
      queryButton.style.transition = "background-color 0.3s, box-shadow 0.3s";
      queryButton.onclick = queryIpInfo;

      const dragHandle = document.createElement("div");
      dragHandle.style.width = "100%";
      dragHandle.style.height = "10px";
      dragHandle.style.backgroundColor = "#00ffff";
      dragHandle.style.cursor = "move";
      dragHandle.style.marginBottom = "10px";
      dragHandle.onmousedown = startDragging;
      const content = document.createElement("div");
      content.id = "ipInfoContent";
      title.appendChild(refreshButton);
      title.appendChild(toggleButton);
      inputContainer.appendChild(ipInput);
      inputContainer.appendChild(queryButton);
      title.appendChild(inputContainer);
      ipElement.appendChild(title);
      ipElement.appendChild(dragHandle);
      ipElement.appendChild(content);
      document.body.appendChild(ipElement);

      // 创建展开按钮
      const expandButton = createButton("展开信息", toggleIpInfo);
      expandButton.id = "expandIpInfo";
      expandButton.style.position = "fixed";

      expandButton.style.top = GM_getValue("ipInfoTop", "10px");
      expandButton.style.right = "0";
      expandButton.style.display = "block";
      document.body.appendChild(expandButton);
      expandButton.style.zIndex = "999999999";
    }

    let contentElement = document.getElementById("ipInfoContent");
    if (!contentElement) {
      contentElement = document.createElement("div");
      contentElement.id = "ipInfoContent";
      ipElement.appendChild(contentElement);
    }

    const content = `
              <div>
                  <strong>IPv4:</strong> ${
                    details.query
                  } <span id="copyButtonContainer1"></span>
              </div>
              <div>
                  <strong>IPv6:</strong> ${
                    ipv6 ? ipv6 : "N/A"
                  } <span id="copyButtonContainer2"></span>
              </div>
              <div style="word-wrap: break-word; max-width: 300px;">
                  <strong>城市:</strong> ${details.city}, ${details.regionName}
              </div>
              <div>
                  <strong>zip:</strong> ${details.zip ? details.zip : "N/A"}
              </div>
              <div>
                  <strong>国家:</strong> ${details.country}
              </div>
              <div style="word-wrap: break-word; max-width: 300px;">
                  <strong>ISP:</strong> ${details.isp}
              </div>
              <div style="word-wrap: break-word; max-width: 300px;">
                  <strong>AS:</strong> ${details.as}
              </div>
              <div>
                  <strong>风险评分:</strong> ${
                    riskData ? riskData.score : "N/A"
                  }
              </div>
              <div>
                  <strong>风险类型:</strong> ${riskData ? riskData.risk : "N/A"}
              </div>
              <div>
                  <strong>Ping0风险值:</strong> ${
                    ping0Data ? ping0Data.riskValue : "N/A"
                  }
              </div>
              <div>
                  <strong>IP类型:</strong> ${
                    ping0Data ? ping0Data.ipType : "N/A"
                  }
              </div>
              <div>
                  <strong>原生IP:</strong> ${
                    ping0Data ? ping0Data.nativeIP : "N/A"
                  }
              </div>
              <hr>
          `;
    contentElement.innerHTML = content; // Use innerHTML instead of insertAdjacentHTML to replace old content
    // 添加复制按钮到 copyButtonContainer
    const copyButtonContainer1 = document.getElementById(
      "copyButtonContainer1"
    );
    copyButtonContainer1.appendChild(createCopyButton(details.query));
    const copyButtonContainer2 = document.getElementById(
      "copyButtonContainer2"
    );
    copyButtonContainer2.appendChild(createCopyButton(ipv6));
  }

  function isValidIPv4(ip) {
    const ipv4Pattern =
      /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    return ipv4Pattern.test(ip);
  }

  function queryIpInfo() {
    const queryIp = document.getElementById("queryIpInput").value.trim();
    const queryButton = document.getElementById("queryIpButton");

    if (!queryIp) {
      alert("请输入一个有效的IP地址");
      return;
    }

    if (!isValidIPv4(queryIp)) {
      alert("请输入一个有效的IPv4地址");
      return;
    }

    console.log("Querying IP info for:", queryIp);

    // 禁用查询按钮并显示“正在查询”
    queryButton.disabled = true;
    queryButton.innerHTML = "正在查询...";

    // 调用 fetchIPDetails 并传递回调函数以恢复按钮状态
    fetchIPDetails(queryIp, null, function () {
      // 查询完成后恢复按钮状态
      queryButton.disabled = false;
      queryButton.innerHTML = "查询IP";
    });
  }
  function createButton(text, onClick) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.style.backgroundColor = "#1a1a1a";
    button.style.width = "auto";
    button.style.color = "#00ffff";
    button.style.border = "1px solid #00ffff";
    button.style.borderRadius = "0";
    button.style.padding = "5px 10px";
    button.style.cursor = "pointer";
    button.style.fontSize = "12px";
    button.style.marginLeft = "5px";
    button.style.transition = "background-color 0.3s, box-shadow 0.3s";
    button.style.fontFamily = "'Orbitron', sans-serif";
    button.onclick = onClick;
    button.onmouseover = function () {
      this.style.backgroundColor = "#00ffff";
      this.style.color = "#1a1a1a";
      this.style.boxShadow = "0 0 10px rgba(0,255,255,0.5)";
    };
    button.onmouseout = function () {
      this.style.backgroundColor = "#1a1a1a";
      this.style.color = "#00ffff";
      this.style.boxShadow = "none";
    };
    return button;
  }
  function createCopyButton(text) {
    const button = document.createElement("button");
    button.innerHTML = "复制";
    button.style.width = "auto";
    button.style.backgroundColor = "#1a1a1a";
    button.style.color = "#00ffff";
    button.style.border = "1px solid #00ffff";
    button.style.borderRadius = "0";
    button.style.padding = "2px 5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "12px";
    button.style.marginLeft = "5px";
    button.style.transition = "background-color 0.3s, box-shadow 0.3s";
    button.style.fontFamily = "'Orbitron', sans-serif";
    button.onclick = (event) => {
      event.stopPropagation();
      navigator.clipboard
        .writeText(text)
        .then(() => {
          button.innerHTML = "已复制";
          setTimeout(() => {
            button.innerHTML = "复制";
          }, 500);
        })
        .catch((err) => {
          console.error("复制失败: ", err);
        });
    };
    button.onmouseover = function () {
      this.style.backgroundColor = "#00ffff";
      this.style.color = "#1a1a1a";
      this.style.boxShadow = "0 0 10px rgba(0,255,255,0.5)";
    };
    button.onmouseout = function () {
      this.style.backgroundColor = "#1a1a1a";
      this.style.color = "#00ffff";
      this.style.boxShadow = "none";
    };
    return button;
  }

  function showQueryButton(ip, event) {
    let queryButton = document.getElementById("floatingQueryButton");
    if (!queryButton) {
      queryButton = document.createElement("button");
      queryButton.id = "floatingQueryButton";
      queryButton.innerHTML = "查询IP";
      queryButton.style.position = "fixed";
      queryButton.style.width = "auto";
      queryButton.style.zIndex = "10000";
      queryButton.style.padding = "5px 10px";
      queryButton.style.backgroundColor = "#1a1a1a";
      queryButton.style.color = "#00ffff";
      queryButton.style.border = "1px solid #00ffff";
      queryButton.style.borderRadius = "0";
      queryButton.style.cursor = "pointer";
      queryButton.style.fontSize = "12px";
      queryButton.style.fontFamily = "'Orbitron', sans-serif";
      queryButton.style.transition = "background-color 0.3s, box-shadow 0.3s";
      document.body.appendChild(queryButton);
    }
    queryButton.style.left = `${event.clientX + 10}px`;
    queryButton.style.top = `${event.clientY + 10}px`;
    queryButton.style.display = "block";
    queryButton.onclick = function () {
      document.getElementById("queryIpInput").value = ip;
      const ipElement = document.getElementById("ipInfo");
      if (ipElement.style.right !== "0px") {
        toggleIpInfo();
      }
      queryIpInfo();
      this.style.display = "none";
    };
    queryButton.onmouseover = function () {
      this.style.backgroundColor = "#00ffff";
      this.style.color = "#1a1a1a";
      this.style.boxShadow = "0 0 10px rgba(0,255,255,0.5)";
    };
    queryButton.onmouseout = function () {
      this.style.backgroundColor = "#1a1a1a";
      this.style.color = "#00ffff";
      this.style.boxShadow = "none";
    };
  }
  // 添加选择文本和显示查询按钮的功能
  document.addEventListener("mouseup", handleTextSelection);

  function handleTextSelection(event) {
    // 检查点击是否发生在 IP 信息面板内
    const ipElement = document.getElementById("ipInfo");
    const expandIpButton = document.getElementById("expandIpInfo");
    if (
      (ipElement && ipElement.contains(event.target)) ||
      (expandIpButton && expandIpButton.contains(event.target))
    ) {
      return; // 如果点击在 IP 信息面板内，不执行后续操作
    }

    const selectedText = window.getSelection().toString().trim();
    if (isValidIPv4(selectedText)) {
      showQueryButton(selectedText, event);
    }
  }

  // 修改 toggleIpInfo 函数
  function toggleIpInfo() {
    const ipElement = document.getElementById("ipInfo");
    const expandButton = document.getElementById("expandIpInfo");
    const toggleButton = document.getElementById("toggleIpInfo");
    if (ipElement.style.right === "0px") {
      ipElement.style.right = "-1000px";
      toggleButton.innerHTML = "展开信息";
      toggleButton.style.display = "none";
      expandButton.style.display = "block";
    } else {
      ipElement.style.right = "0px";
      toggleButton.innerHTML = "隐藏信息";
      toggleButton.style.display = "inline-block";
      expandButton.style.display = "none";
    }
  }

  let initialTop = 10;
  let initialY = 0;
  let dragging = false;

  function startDragging(e) {
    console.log("Start dragging...");
    dragging = true;
    initialY = e.clientY;
    const ipElement = document.getElementById("ipInfo");
    const expandButton = document.getElementById("expandIpInfo");
    initialTop = parseInt(ipElement.style.top, 10);
    expandButton.style.top = ipElement.style.top; // 同步expandButton的位置
    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", stopDragging);
  }

  function handleDragging(e) {
    if (dragging) {
      console.log("Dragging...");
      const deltaY = e.clientY - initialY;
      const newTop = initialTop + deltaY;
      const ipElement = document.getElementById("ipInfo");
      const expandButton = document.getElementById("expandIpInfo");
      ipElement.style.top = newTop + "px";
      expandButton.style.top = newTop + "px"; // 同步expandButton的位置
    }
  }

  function stopDragging() {
    console.log("Stop dragging...");
    dragging = false;
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", stopDragging);

    const ipElement = document.getElementById("ipInfo");
    GM_setValue("ipInfoTop", ipElement.style.top);

    const expandButton = document.getElementById("expandIpInfo");
    GM_setValue("expandButtonTop", expandButton.style.top); // 同步保存expandButton的位置
  }

  // 添加全局样式
  const style = document.createElement("style");
  style.textContent = `
      // @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
      #ipInfo, #expandIpInfo, #floatingQueryButton, #queryIpInput, #queryIpButton {
          font-family: 'Arial', sans-serif;
      }
      #ipInfo:hover {
          box-shadow: 0 0 30px rgba(0,255,255,0.5);
      }
      #queryIpInput {
          background-color: #1a1a1a;
          color: #00ffff;
          border: 1px solid #00ffff;
          padding: 5px;
          font-size: 12px;
      }
      #queryIpButton {
          background-color: #1a1a1a;
          color: #00ffff;
          border: 1px solid #00ffff;
          border-radius: 0;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s, box-shadow 0.3s;
      }
      #queryIpButton:hover {
          background-color: #00ffff;
          color: #1a1a1a;
          box-shadow: 0 0 10px rgba(0,255,255,0.5);
      }
  `;
  document.head.appendChild(style);
  // 初始创建ipElement，但不触发数据获取
  displayIPDetails(null, null, null, null);
})();

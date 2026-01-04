// ==UserScript==
// @name         SOOP - 외부장치 방송 OBS 연동 제어
// @namespace    https://www.afreecatv.com/
// @version      2.0.1
// @description  외부장치 방송 대시보드에 OBS 방송 시작 및 종료, 대기 후 종료 버튼을 추가합니다.
// @author       Jebibot
// @match        https://dashboard.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507336/SOOP%20-%20%EC%99%B8%EB%B6%80%EC%9E%A5%EC%B9%98%20%EB%B0%A9%EC%86%A1%20OBS%20%EC%97%B0%EB%8F%99%20%EC%A0%9C%EC%96%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/507336/SOOP%20-%20%EC%99%B8%EB%B6%80%EC%9E%A5%EC%B9%98%20%EB%B0%A9%EC%86%A1%20OBS%20%EC%97%B0%EB%8F%99%20%EC%A0%9C%EC%96%B4.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let obs;

  const broadcastInfo = document.querySelector(".broadcast_info");
  if (broadcastInfo == null) {
    return;
  }

  GM_addStyle(`
    .obs_status {
      font-size: 16px;
    }

    .obs_status::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 4px;
      border-radius: 50%;
      background-color: gray;
    }

    .obs_status.error::before {
      background-color: red;
    }

    .obs_status.connected::before {
      background-color: green;
    }

    .obs_controls {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    .obs_controls button {
      display: block;
      background: #f7f7f7;
      flex: 1;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 16px;
      font-weight: normal
    }

    .obs_controls button:disabled {
      background: #e3e3e3;
      color: #888;
    }

    body.thema_dark .obs_controls button {
      background: #2e2e2f;
      color: #ccc
    }

    body.thema_dark .obs_controls button:disabled {
      background: #3f3f46;
      color: #888;
    }
    `);

  GM_registerMenuCommand("== 도구 > WebSocket 서버 설정 > 서버 정보 표시 ==");

  let address = GM_getValue("address", "127.0.0.1");
  const promptAddress = () => {
    address = prompt("서버 IP", address);
    if (!address) {
      return;
    }
    GM_setValue("address", address);
    GM_registerMenuCommand(`서버 IP: ${address}`, promptAddress, {
      id: addressMenu,
    });
    reconnect();
  };
  const addressMenu = GM_registerMenuCommand(
    `서버 IP: ${address}`,
    promptAddress
  );

  let port = GM_getValue("port", "4455");
  const promptPort = () => {
    const newPort = prompt("서버 포트", port);
    if (!newPort || isNaN(newPort)) {
      alert("유효한 포트를 입력해주세요");
      return;
    }
    port = newPort;
    GM_setValue("port", port);
    GM_registerMenuCommand(`서버 포트: ${port}`, promptPort, { id: portMenu });
    reconnect();
  };
  const portMenu = GM_registerMenuCommand(`서버 포트: ${port}`, promptPort);

  let password = GM_getValue("password");
  GM_registerMenuCommand(`서버 비밀번호`, () => {
    password = prompt("서버 비밀번호 (방송 노출 주의)", password);
    if (!password) {
      return;
    }
    GM_setValue("password", password);
    reconnect();
  });

  const control = document.createElement("div");
  control.classList.add("broadcast_info");
  broadcastInfo.insertAdjacentElement("beforebegin", control);

  const title = document.createElement("h5");
  title.textContent = "OBS 제어";
  control.appendChild(title);

  const status = document.createElement("span");
  status.classList.add("obs_status");
  status.textContent = "연결되지 않음";
  title.appendChild(status);

  const content = document.createElement("div");
  content.classList.add("broadcast_info_content", "obs_controls");
  control.appendChild(content);

  const onClick = async (e) => {
    if (obs == null) {
      return;
    }
    const frm = document.getElementById("dashboardFrm");
    if (frm == null) {
      return;
    }
    const shouldWait = e.target.textContent !== "방송 종료";
    const shouldWaitYN = shouldWait ? "Y" : "N";
    if (frm.is_wait.value !== shouldWaitYN) {
      frm.is_wait.value = shouldWaitYN;
      frm.frmWait.checked = shouldWait;
      const check = document.querySelector('label[for="check4"]');
      if (shouldWait) {
        check?.classList.add("on");
      } else {
        check?.classList.remove("on");
      }

      try {
        const res = await fetch(
          "https://dashboard.sooplive.co.kr/api/app_dashboard.php",
          { method: "POST", body: new FormData(frm) }
        );
        const result = await res.json();
        if (!result.channel.remsg.includes("정상적")) {
          throw new Error(result.channel.remsg);
        }
      } catch (e) {
        alert(e.message);
        return;
      }
    }
    await obs.call(
      e.target.textContent === "방송 시작" ? "StartStream" : "StopStream"
    );
  };

  const streamButton = document.createElement("button");
  streamButton.disabled = true;
  streamButton.textContent = "방송 시작";
  streamButton.addEventListener("click", onClick);
  content.appendChild(streamButton);

  const standbyButton = document.createElement("button");
  standbyButton.style.display = "none";
  standbyButton.textContent = "대기 후 종료";
  standbyButton.addEventListener("click", onClick);
  content.appendChild(standbyButton);

  const setStatus = (statusText, error) => {
    status.textContent = statusText;
    if (error) {
      status.classList.remove("connected");
      status.classList.add("error");
      streamButton.disabled = true;
      standbyButton.disabled = true;
    } else {
      status.classList.remove("error");
      status.classList.add("connected");
      streamButton.disabled = false;
      standbyButton.disabled = false;
    }
  };

  const setState = (state) => {
    switch (state) {
      case "OBS_WEBSOCKET_OUTPUT_STARTING":
        streamButton.disabled = true;
        streamButton.textContent = "연결 중...";
        break;
      case "OBS_WEBSOCKET_OUTPUT_STARTED":
        streamButton.disabled = false;
        standbyButton.style.display = "";
        streamButton.textContent = "방송 종료";
        break;
      case "OBS_WEBSOCKET_OUTPUT_STOPPING":
        streamButton.disabled = true;
        standbyButton.style.display = "none";
        streamButton.textContent = "방송 중단 중...";
        break;
      case "OBS_WEBSOCKET_OUTPUT_STOPPED":
        streamButton.disabled = false;
        standbyButton.style.display = "none";
        streamButton.textContent = "방송 시작";
        break;
    }
  };

  let retry = 0;
  const connect = async () => {
    try {
      obs = new OBSWebSocket();
      obs.on("ConnectionClosed", () => {
        setStatus(`연결 끊김`, true);
        setTimeout(connect, Math.min(100 * Math.pow(2, retry++), 3000));
      });
      obs.on("StreamStateChanged", ({ outputState }) => {
        setState(outputState);
      });
      await obs.connect(`ws://${address}:${port}`, password, {
        eventSubscriptions: OBSWebSocket.EventSubscription.Outputs,
      });
      setStatus(`연결됨`);
      retry = 0;

      const { outputActive } = await obs.call("GetStreamStatus");
      setState(
        outputActive
          ? "OBS_WEBSOCKET_OUTPUT_STARTED"
          : "OBS_WEBSOCKET_OUTPUT_STOPPED"
      );
    } catch (e) {
      console.error(e);
      setStatus(`오류`, true);
    }
  };

  const reconnect = async () => {
    if (obs == null) {
      return;
    }
    try {
      await obs.disconnect();
    } catch {}
    return connect();
  };

  const s = document.createElement("script");
  s.type = "text/javascript";
  s.src =
    "https://cdn.jsdelivr.net/npm/obs-websocket-js@5.0.6/dist/obs-ws.global.js";
  s.onload = connect;
  document.body.appendChild(s);
})();

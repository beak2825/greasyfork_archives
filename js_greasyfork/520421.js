// ==UserScript==
// @name         SOOP(숲) - VOD 다운로더
// @namespace    https://www.sooplive.co.kr/
// @version      2024-12-11
// @description  숲 VOD를 다운로드하는 FFmpeg 스크립트를 생성합니다.
// @author       minibox
// @match        https://vod.sooplive.co.kr/*/*
// @icon         https://www.sooplive.co.kr/favicon.ico
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520421/SOOP%28%EC%88%B2%29%20-%20VOD%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/520421/SOOP%28%EC%88%B2%29%20-%20VOD%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.meta.js
// ==/UserScript==

function makeCommands(startSec, endSec, useTempDir = false) {
  const bjId = vodCore.config.bjId;
  const fileItems = vodCore.fileItems;
  const randomHash = Math.random().toString(36).substring(7);

  const ffmpegCommands = [];
  const mergeCommands = [];

  let accumulatedDuration = 0;
  const concatList = [];

  let firstFile;

  fileItems.forEach((item, index) => {
    const { duration, orgFileResolution, levels } = item;

    const itemStart = accumulatedDuration;
    const itemEnd = accumulatedDuration + duration;

    if (itemEnd > startSec && itemStart < endSec) {
      const matchingLevel = levels.find(
        (level) => level.resolution === orgFileResolution
      );

      if (matchingLevel) {
        const clipStart = Math.max(startSec, itemStart) - itemStart;
        const clipEnd = Math.min(endSec, itemEnd) - itemStart;

        const clipStartFixed = clipStart.toFixed(2);
        const clipEndFixed = clipEnd.toFixed(2);

        let outputFilename = `${randomHash}__part_${index + 1}.ts`;

        if (useTempDir) {
          outputFilename = `${randomHash}__temp/${outputFilename}`;
        }

        if (!firstFile) {
          console.log("firstFile", outputFilename);
          firstFile = outputFilename;
        }

        let ffmpegCommand = `ffmpeg -i "${matchingLevel.file}" -c copy "${outputFilename}"`;

        if (clipStart > 0) {
          ffmpegCommand = `ffmpeg -ss "${clipStartFixed}" -i "${matchingLevel.file}" -c copy "${outputFilename}"`;
        }

        if (clipEnd < duration) {
          ffmpegCommand = `ffmpeg -ss "${clipStartFixed}" -to "${clipEndFixed}" -i "${matchingLevel.file}" -c copy "${outputFilename}"`;
        }

        ffmpegCommands.push(ffmpegCommand);
        concatList.push(`file '${outputFilename}'`);
      }
    }

    accumulatedDuration += duration;
  });

  let concatFile = `${randomHash}__concat.txt`;

  if (useTempDir) {
    concatFile = `${randomHash}__temp/${concatFile}`;
  }

  const echoCommands = concatList
    .map((c) => `echo ${c.replace(`${randomHash}__temp/`, "")}`)
    .join(" && ");

  const mergeFileCommand = `(${echoCommands}) > ${concatFile}`;
  mergeCommands.push(mergeFileCommand);

  const mergeCommand = `ffmpeg -f concat -safe 0 -i ${concatFile} -c copy "${randomHash}__${bjId}.ts"`;
  mergeCommands.push(mergeCommand);

  return {
    ffmpegCommands,
    mergeCommands,
    randomHash,
    concatList,
    firstFile,
  };
}

function makeBatUrl(startSec, endSec) {
  const { ffmpegCommands, mergeCommands, randomHash, concatList, firstFile } =
    makeCommands(startSec, endSec, true);

  let batCommands = ffmpegCommands;
  if (concatList.length > 1) {
    batCommands = batCommands.concat(mergeCommands);
  }

  const batHeader = [
    "@echo off",
    "chcp 65001 >nul",
    "title SOOP VOD 다운로더",
    "where ffmpeg >nul 2>nul",
    "if %errorlevel% neq 0 (",
    "   echo 영상 다운로드를 위해서는 FFmpeg가 필요합니다.",
    "   echo 설치 후 다시 시도해주세요.",
    "   echo.",
    "   echo 설치 방법: https://wikidocs.net/228271#windows-ffmpeg",
    "   echo.",
    "   pause",
    "   exit /b",
    ")",
    `mkdir ${randomHash}__temp`,
  ];

  batCommands.unshift(...batHeader);

  if (concatList.length === 1) {
    const bjId = vodCore.config.bjId;
    const firstFilePath = firstFile.replace("/", "\\");

    batCommands.push(
      `ren ".\\${firstFilePath}" "../${randomHash}__${bjId}.ts"`
    );
  }

  batCommands.push(`rmdir /s /q ${randomHash}__temp`);

  batCommands.push("echo.");
  batCommands.push("echo.");
  batCommands.push("echo.");
  batCommands.push("echo 영상 다운이 완료되었습니다!");
  batCommands.push("echo.");
  batCommands.push("pause");

  const batContent = batCommands.join("\r\n");
  const blob = new Blob([batContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  return url;
}

function formatTime(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}

function confirmButtonCallback(startSec, interval) {
  const endSec = vodCore.playerController._playingTime;

  if (startSec >= endSec) {
    alert("시작 시간은 종료 시간보다 전에 있어야 합니다.");
    return;
  }

  const el = document.getElementById("downloader-confirm-button");

  if (el) {
    el.remove();
    clearInterval(interval);
  }

  const batUrl = makeBatUrl(startSec, endSec);

  const a = document.createElement("a");
  a.href = batUrl;
  a.download = "download.bat";
  a.click();
}

function getCurrentPlayingTime() {
  const sec = vodCore.playerController._playingTime;
  return formatTime(sec);
}

function getTotalDuration() {
  const sec = vodCore.fileItems.reduce((acc, item) => acc + item.duration, 0);
  return sec;
}

function downloadButtonCallback(shiftKey) {
  const el = document.getElementById("downloader-confirm-button");
  if (el) {
    if (el.dataset.interval) {
      clearInterval(el.dataset.interval);
    }

    el.remove();
  }

  const startSec = vodCore.playerController._playingTime;
  const startSecStr = formatTime(startSec);

  if (shiftKey) {
    confirmButtonCallback(0, getTotalDuration());
    return;
  }

  const confirmButton = document.createElement("button");
  confirmButton.id = "downloader-confirm-button";
  confirmButton.textContent = `여기를 눌러 [${startSecStr}] 부터 [${getCurrentPlayingTime()}] 까지 다운로드 하기`;

  confirmButton.style.position = "fixed";
  confirmButton.style.top = "0";
  confirmButton.style.left = "0";
  confirmButton.style.right = "0";
  confirmButton.style.zIndex = "9999";

  confirmButton.style.padding = "12px";

  confirmButton.style.backgroundColor = "#455a52";
  confirmButton.style.color = "#fff";
  confirmButton.style.fontSize = "16px";
  confirmButton.style.textAlign = "center";

  const interval = setInterval(() => {
    confirmButton.textContent = `여기를 눌러 [${startSecStr}] 부터 [${getCurrentPlayingTime()}] 까지 다운로드 하기`;
  }, 100);

  confirmButton.dataset.interval = interval;

  confirmButton.onclick = () => confirmButtonCallback(startSec, interval);

  document.body.appendChild(confirmButton);
}

function main() {
  if (!vodCore) {
    console.error("vodCore 객체를 찾을 수 없습니다.");
    return false;
  }

  const downloadButton = document.createElement("button");
  downloadButton.className = "play";
  downloadButton.style.background =
    'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2224%22%20viewBox%3D%220%20-960%20960%20960%22%20width%3D%2224%22%20fill%3D%22%23FFF%22%3E%3Cpath%20d%3D%22M480-320%20280-520l56-58%20104%20104v-326h80v326l104-104%2056%2058zM240-160q-33%200-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0%2033-23.5%2056.5T720-160z%22%2F%3E%3C%2Fsvg%3E") 50% 50% no-repeat';

  downloadButton.onclick = (e) => downloadButtonCallback(e.shiftKey);

  const ctrlContainer = document.querySelector(
    "#player > div.player_ctrlBox > div.ctrlBox > div.ctrl"
  );
  ctrlContainer.insertBefore(downloadButton, ctrlContainer.children[0]);

  return true;
}

const mainInterval = setInterval(() => {
  if (main()) {
    clearInterval(mainInterval);
  }
}, 100);

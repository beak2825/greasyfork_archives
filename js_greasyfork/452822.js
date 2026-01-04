// ==UserScript==
// @name        AI 이미지 EXIF 뷰어
// @namespace   https://greasyfork.org/users/815641
// @match       https://www.pixiv.net/*
// @match       https://arca.live/b/aiart*
// @match       https://arca.live/b/hypernetworks*
// @match       https://arca.live/b/aiartreal*
// @match       https://arca.live/b/aireal*
// @version     1.9.4
// @author      우흐
// @require     https://greasyfork.org/scripts/452821-upng-js/code/UPNGjs.js?version=1103227
// @require     https://cdn.jsdelivr.net/npm/casestry-exif-library@2.0.3/dist/exif-library.min.js
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require     https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require     https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant 	    GM_addStyle
// @grant 	    GM_download

// @description AI 이미지 메타데이터 보기
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452822/AI%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20EXIF%20%EB%B7%B0%EC%96%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/452822/AI%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20EXIF%20%EB%B7%B0%EC%96%B4.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  const modalCSS = /* css */ `
  .swal2-popup {
    font-size: 15px;
  }

  .swal2-actions {
    margin: .4em auto 0;
  }

  .swal2-footer{
    margin: 1em 1.6em .3em;
    padding: 1em 0 0;
    overflow: auto;
    font-size: 1.125em;
  }

  #dropzone {
    z-index: 100000000;
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  
  .md-grid {
    display: grid;
    grid-template-rows: repeat(3, auto);
    text-align: left;
  }
  
  .md-grid-item {
    border-bottom: 1px solid #b3b3b3;
    padding: .6em;
  }
  
  .md-grid-item:last-child {
    border-bottom: 0px;
  }
  
  .md-nested-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, auto);
    gap: .5em;
  }
  
  .md-title {
    line-height: 1em;
    font-weight: bold;
    font-size: .9em;
    padding-bottom: .2em;
    display: flex;
    color: #1A1A1A;
  }
  
  .md-info {
    line-height: 1.5em;
    font-size: .8em;
    word-break: break-word;
    color: #444444;
  }
  
  .md-hidden {
    overflow: hidden;
    position: relative;
    max-height: 5em;
  }
  
  .md-hidden:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2em;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, white 100%);
  }

  .md-info > a{
    text-decoration: none;
  }

  .md-info > a:hover{
    text-decoration: underline !important; 
  }

  pre.md-show-and-hide{
    font-family: monospace;
    margin: 0px;
    white-space: pre-line;
  }
  
  .md-visible {
    height: auto;
    overflow: auto;
  }
  
  .md-model {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  
  .md-show-more {
    text-align: center;
    cursor: pointer;
  }
  
  #md-tags {
    width: 100%;
    height: 20em;
    padding-top: .5em;
    text-align: left;
    font-size: 0.9em;
  }

  span.md-button {
    margin-left: .15em;
    cursor: pointer;
  }
  
  span.md-copy {
    content: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Crect width='16' height='16' stroke='none' fill='%23000000' opacity='0'/%3E%3Cg transform='matrix(0.6 0 0 0.6 8 8)' %3E%3Cpath style='stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;' transform=' translate(-12, -12)' d='M 4 2 C 2.895 2 2 2.895 2 4 L 2 18 L 4 18 L 4 4 L 18 4 L 18 2 L 4 2 z M 8 6 C 6.895 6 6 6.895 6 8 L 6 20 C 6 21.105 6.895 22 8 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 8 C 22 6.895 21.105 6 20 6 L 8 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z' stroke-linecap='round' /%3E%3C/g%3E%3C/svg%3E");
  }
  
  span.md-civitai {
    content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAllBMVEVHcEwORtARe/UMPdYPY+gOUuAKKc0RdvENT94LKc0LJMcLMM8LMc8SgPUSffIRePERcu4MN9EQbewQauoLKswLKswUIo0PZ+gWDmT///8LLtMPLKwQcvESA00LF4UiGWgKB2wNSuAMNM8LOtgPRb2XlLxDQY7Fw9kOW+cMO9NBNHG7utXR0OLv7vTc2+fe3utNSIs7N4PzUc8zAAAAFnRSTlMABvvJy9Kz18fsI9hVphtuSzKwKn11Da4jUwAAALdJREFUeNpNz8eWwjAMBVDZCQk9VMndTiGFPv//c3NimIG3ku5CRw8gZr1areETVuSc84L97ZvccCJu8k1c9ztjqHGuIWN2ewBIiRoX2ja4hiiNoAOepDxh0JQygLRHcZWXi3x47CcMYNqjv3Uh/LTiDeUIQrRPgeUbxFV2nbx7FyEp0frxqLdYJiMMgxb2fLZCD/UI26yqK7TWVXWVbOOvy4VSWiu1WP6XO86Umh3YV995ls1f0y8RAhFlMPQmQwAAAABJRU5ErkJggg==");
  }
  `;

  function registerMenu() {
    try {
      if (typeof GM_registerMenuCommand == undefined) {
        return;
      } else {
        GM_registerMenuCommand("(로그인 필수) Pixiv 뷰어 사용 토글", () => {
          if (GM_getValue("usePixiv", false)) {
            GM_setValue("usePixiv", false);
            Swal.fire({
              toast: true,
              position: "bottom",
              showConfirmButton: false,
              timer: 2000,
              icon: "error",
              title: `Pixiv 비활성화
                      창이 닫힌 후 새로고침 됩니다`,
              timerProgressBar: true,
              didDestroy: () => {
                location.reload();
              },
            });
          } else {
            GM_setValue("usePixiv", true);
            Swal.fire({
              toast: true,
              position: "bottom",
              showConfirmButton: false,
              timer: 2000,
              icon: "success",
              title: `Pixiv 활성화
                      창이 닫힌 후 새로고침 됩니다`,
              timerProgressBar: true,
              didDestroy: () => {
                location.reload();
              },
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  class DropZone {
    constructor() {
      const dropZone = document.createElement("div");
      dropZone.setAttribute("id", "dropzone");
      document.body.appendChild(dropZone);
      this.dropZone = document.getElementById("dropzone");
      this.setupEventListeners();
    }

    showDropZone() {
      this.dropZone.style.display = "block";
    }

    hideDropZone() {
      this.dropZone.style.display = "none";
    }

    allowDrag(e) {
      e.preventDefault();
    }

    async handleDrop(e) {
      e.preventDefault();
      this.hideDropZone();

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const blob = await fileToBlob(file);
      const type = blob.type;
      if (!isSupportedImageFormat(blob.type)) {
        notSupportedFormat();
        return;
      }
      const metadata = await extractImageMetadata(blob, type);
      metadata ? showMetadataModal(metadata) : showTagExtractionModal();
    }

    setupEventListeners() {
      window.addEventListener("dragenter", () => this.showDropZone());
      this.dropZone.addEventListener("dragenter", (e) => this.allowDrag(e));
      this.dropZone.addEventListener("dragover", (e) => this.allowDrag(e));
      this.dropZone.addEventListener("dragleave", () => this.hideDropZone());
      this.dropZone.addEventListener("drop", (e) => this.handleDrop(e));
    }
  }

  function getMetadataPNGChunk(chunk) {
    const isValidPNG = chunk
      .slice(0, 8)
      .every((byte, index) => [137, 80, 78, 71, 13, 10, 26, 10][index] === byte);
    if (!isValidPNG) {
      console.error("Invalid PNG");
      return null;
    }

    const textDecoder = new TextDecoder("utf-8");
    let metadata = {};

    function checkForChunks() {
      let position = 8;
      while (true) {
        const chunkLength = getUint32(position);

        if (chunk.byteLength < position + chunkLength + 12) {
          return;
        }
        const name = String.fromCharCode(...chunk.subarray(position + 4, position + 8));
        const data = chunk.subarray(position + 8, position + chunkLength + 8);
        const dataString = textDecoder.decode(data);

        if (name === "tEXt") {
          const [key, value] = dataString.split("\0");
          metadata[key] = value;
        } else if (name === "iTXt") {
          const [key, value] = dataString.split("\0\0\0\0\0");
          metadata[key] = value;
        } else if (name === "IDAT") {
          metadata[name] = true;
          return;
        }
        position += chunkLength + 12;
      }
    }

    function getUint32(offset) {
      return (
        (chunk[offset] << 24) |
        (chunk[offset + 1] << 16) |
        (chunk[offset + 2] << 8) |
        chunk[offset + 3]
      );
    }
    checkForChunks();
    return metadata;
  }

  function getMetadataJPEGChunk(chunk) {
    if (chunk[0] !== 255 || chunk[1] !== 216) {
      console.error("Invalid JPEG");
      return null;
    }
    const textDecoder = new TextDecoder();
    let offset = 2;
    if (chunk[offset] === 0xff && chunk[offset + 1] === 0xe1) {
      const length = (chunk[offset + 2] << 8) | chunk[offset + 3];
      const data = chunk.subarray(offset + 4, offset + 2 + length);
      if (
        data[0] === 69 &&
        data[1] === 120 &&
        data[2] === 105 &&
        data[3] === 102 &&
        data[4] === 0 &&
        data[5] === 0
      ) {
        const userCommentData = data.subarray(46, offset + 2 + length);
        const parameters = textDecoder
          .decode(userCommentData)
          .replace("UNICODE", "")
          .replaceAll("\u0000", "");
        return { parameters };
      } else {
        return null;
      }
    }
    return null;
  }

  function getFileName(url) {
    if (url === "/") return;
    const fileName = url.substring(url.lastIndexOf("/") + 1).replace("?type=orig", "");
    return fileName;
  }

  function parseMetadata(exif) {
    try {
      let metadata = {};
      if (exif.parameters) {
        let parameters = exif.parameters.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        metadata.rawMetadata = parameters;

        if (!parameters.includes("Negative prompt")) {
          parameters = parameters.replace("Steps", "\nNegative prompt: 정보 없음\nSteps");
        }

        parameters = parameters.split("Steps: ");
        parameters = `${parameters[0]
          .replaceAll(": ", ":")
          .replace("Negative prompt:", "Negative prompt: ")}Steps: ${parameters[1]}`;

        const metadataStr = parameters.substring(parameters.indexOf("Steps"), parameters.length);
        const keyValuePairs = metadataStr.split(", ");

        for (const pair of keyValuePairs) {
          const [key, value] = pair.split(": ");
          metadata[key] = value;
        }

        metadata.prompt =
          parameters.indexOf("Negative prompt") === 0
            ? "정보 없음"
            : parameters.substring(0, parameters.indexOf("Negative prompt:"));
        metadata.negativePrompt = parameters.includes("Negative prompt:")
          ? parameters
              .substring(parameters.indexOf("Negative prompt:"), parameters.indexOf("Steps:"))
              .replace("Negative prompt:", "")
          : null;

        return metadata;
      } else if (exif.Description) {
        metadata.rawMetadata = `${exif.Description}\n${exif.Comment}`;
        const comment = JSON.parse(exif.Comment);

        metadata.prompt = exif.Description;
        metadata.negativePrompt = comment.uc;
        metadata["Steps"] = comment.steps;
        metadata["Sampler"] = comment.sampler;
        metadata["CFG scale"] = comment.scale;
        metadata["Seed"] = comment.seed;
        metadata["Software"] = "NovelAI";

        return metadata;
      } else if (exif["sd-metadata"]) {
        metadata.rawMetadata = exif["sd-metadata"];
        const parameters = JSON.parse(exif["sd-metadata"]);
        const rowPrompt = parameters.image.prompt[0].prompt;
        const PromptRegex = /[^[\]]+(?=\[|$)/g;
        const negativePromptRegex = /\[.*?\]/g;
        const promptArray = rowPrompt.match(PromptRegex);
        const negativePromptArray = rowPrompt.match(negativePromptRegex);
        const prompt = promptArray.map((prompt) => prompt.replace(/^\,|\,$/g, ""));
        const negativePrompt = negativePromptArray.map((prompt) =>
          prompt.replace(/^\[|\]$/g, "").replace(/^\,|\,$/g, "")
        );

        metadata.prompt = prompt.join(", ");
        metadata.negativePrompt = negativePrompt.join(", ");
        metadata["Steps"] = parameters?.image.steps;
        metadata["Model"] = parameters?.model;
        metadata["Model hash"] = parameters?.model_hash;
        metadata["Sampler"] = parameters?.image.sampler;
        metadata["CFG scale"] = parameters?.image.cfg_scale;
        metadata["Seed"] = parameters?.image.seed;
        metadata["Size"] = `${parameters?.image.width}x${parameters?.image.height}`;
        metadata["Software"] = "InvokeAI";

        return metadata;
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "분석 오류",
        html: `
        ${error}<br>
        오류내용과 이미지를 댓글로 알려주세요`,
      });
    }
  }

  function infer(metadata) {
    if (metadata?.Software) return [metadata.Software];
    const inferList = [];
    const denoising = metadata?.["Denoising strength"];
    const hires = metadata?.["Hires upscaler"];

    inferList.push("T2I");
    if (denoising && !hires) {
      inferList[0] = "I2I";
    } else if (hires) {
      inferList.push("Hires. fix");
    }
    (metadata?.["AddNet Enabled"] ||
      metadata?.prompt?.includes("lora:") ||
      metadata?.negativePrompt?.includes("lora:")) &&
      inferList.push("LoRa");
    (metadata?.["Hypernet"] ||
      metadata?.prompt?.includes("hypernet:") ||
      metadata?.negativePrompt?.includes("hypernet:")) &&
      inferList.push("Hypernet");

    const contorlNetRegex = /ControlNet-?\d? Enabled/;
    for (const key in metadata) {
      if (contorlNetRegex.test(key)) {
        inferList.push("ControlNet");
        break;
      }
    }
    metadata?.["SD upscale upscaler"] && inferList.push("SD upscale");
    metadata?.["Ultimate SD upscale upscaler"] && inferList.push("Ultimate SD upscale");
    metadata?.["Latent Couple"] && inferList.push("Latent Couple");
    metadata?.["Dynamic thresholding enabled"] && inferList.push("Dynamic thresholding");

    return inferList;
  }

  function showAndHide(elementSelector) {
    const contentEls = document.querySelectorAll(elementSelector);

    contentEls.forEach((contentEl) => {
      const containerEl = contentEl.parentElement;
      const showMoreEl = containerEl.nextElementSibling;

      if (contentEl.offsetHeight > containerEl.offsetHeight) {
        showMoreEl.style.display = "block";
        containerEl.classList.add("md-hidden");
      } else {
        showMoreEl.style.display = "none";
        containerEl.classList.remove("md-hidden");
        containerEl.classList.add("md-visible");
      }

      showMoreEl.addEventListener("click", () => {
        const isMore = showMoreEl.textContent === "더 보기";
        showMoreEl.textContent = isMore ? "숨기기" : "더 보기";
        containerEl.classList.toggle("md-hidden", !isMore);
        containerEl.classList.toggle("md-visible", isMore);
      });
    });
  }

  function showMetadataModal(metadata, url) {
    metadata = parseMetadata(metadata);
    const inferList = infer(metadata);
    if (url === undefined) url = "/";
    Swal.fire({
      title: "메타데이터 요약",
      html: /*html*/ `
    <div class="md-grid">
      <div class="md-grid-item">
        <div class="md-title">Prompt <span class="md-copy md-button" data-clipboard-target="#prompt"></span></div>
        <div class="md-info" id="prompt">
          ${metadata.prompt ?? "정보 없음"}
        </div>
      </div>
      <div class="md-grid-item">
        <div class="md-title">Negative Prompt
          <span class="md-copy md-button" data-clipboard-target="#negative-prompt"></span>
        </div>
        <div class="md-info">
          <div class="md-hidden">
            <div class="md-show-and-hide" id="negative-prompt">
              ${metadata.negativePrompt ?? "정보 없음"}
            </div>
          </div>
          <div class="md-show-more">더 보기</div>
        </div>
      </div>
      <div class="md-grid-item">
        <div class="md-nested-grid">
          <div>
            <div class="md-title">Sampler <span class="md-copy md-button" data-clipboard-target="#sampler"></span></div>
            <div class="md-info" id="sampler">${metadata["Sampler"] ?? "정보 없음"}</div>
          </div>
          <div>
            <div class="md-title">Seed <span class="md-copy md-button" data-clipboard-target="#seed"></span></div>
            <div class="md-info" id="seed">${metadata["Seed"] ?? "정보 없음"}</div>
          </div>
          <div>
            <div class="md-title">Steps <span class="md-copy md-button" data-clipboard-target="#steps"></span></div>
            <div class="md-info" id="steps">${metadata["Steps"] ?? "정보 없음"}</div>
          </div>
          <div>
            <div class="md-title">Size <span class="md-copy md-button" data-clipboard-target="#size"></span></div>
            <div class="md-info" id="size">${metadata["Size"] ?? "정보 없음"}</div>
          </div>
          <div>
            <div class="md-title">CFG scale <span class="md-copy md-button" data-clipboard-target="#cfg-scale"></span>
            </div>
            <div class="md-info" id="cfg-scale">${metadata["CFG scale"] ?? "정보 없음"}</div>
          </div>
          <div>
            <div class="md-title">Image</div>
            <div class="md-info">
              <a href="${url}" target="_blank">Open</a> |
              <a id="md-download">Save</a>
            </div>
          </div>
          <div class="md-model">
            <div class="md-title">Model
              <span class="md-copy md-button" data-clipboard-target="#model"></span>
              <a href='https://civitai.com/?query=${metadata["Model hash"]}' target='_blank'><span
                  class="md-civitai md-button"></span></a>
            </div>
            <div class="md-info" id="model">${
              metadata["Model"]
                ? `${metadata["Model"]} [${metadata["Model hash"]}]`
                : metadata["Model hash"] ?? "정보 없음"
            }</div>
          </div>
          <div>
            <div class="md-title">Infer...</div>
            <div class="md-info">${inferList.join(", ")}</div>
          </div>
        </div>
      </div>
    </div>
      `,
      footer: /*html*/ `
      <div class="md-grid-item">
      <div class="md-title">Raw Metadata <span class="md-copy md-button" data-clipboard-target="#raw-metadata"></span>
      </div>
      <div class="md-info">
        <div class="md-hidden">
          <pre class="md-show-and-hide" id="raw-metadata">
          ${metadata.rawMetadata ?? "정보 없음"}
        </pre>
        </div>
        <div class="md-show-more">더 보기</div>
      </div>
      </div>
      `,
      width: "50em",
      confirmButtonText: "닫기",
    });
    showAndHide(".md-show-and-hide");
    document.querySelector("#md-download").addEventListener("click", () => {
      GM_download(url, getFileName(url));
    });
  }

  function showTagExtractionModal(url) {
    function getOptimizedImageURL(url) {
      if (isArca) {
        return url.replace("ac.namu.la", "ac-o.namu.la").replace("?type=orig", "");
      }
      if (isPixiv) {
        const extension = url.substring(url.lastIndexOf(".") + 1);
        return url
          .replace("/img-original/", "/c/600x1200_90_webp/img-master/")
          .replace(`.${extension}`, "_master1200.jpg");
      }
    }

    if (url === undefined) url = "/";

    Swal.fire({
      icon: "error",
      title: "메타데이터 없음!",
      text: "찾아볼까요?",
      footer: `
      <div class="md-info">
        <a href="${url}" target="_blank">Image Open</a>
      </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "DeepDanbooru",
      denyButtonText: "WD 1.4 Tagger",
      cancelButtonText: "아니오",
      showLoaderOnConfirm: true,
      denyButtonColor: "#ff9d0b",
      backdrop: true,
      preConfirm: async () => {
        if (url === "/") {
          Swal.fire({
            icon: "error",
            html: `
            드래그 앤 드롭으로 분석한 파일은 사용 할 수 없습니다.`,
          });
          return new Promise(reject);
        }
        return GM_fetch(`https://deepdanbooru.donmai.us/?url=${url}&min_score=0.4`)
          .then((res) => {
            if (!res.status === 200) {
              Swal.showValidationMessage(`https://deepdanbooru.donmai.us 접속되는지 확인!`);
            }
            return res.json();
          })
          .catch((error) => {
            console.log(error);
            Swal.showValidationMessage(`https://deepdanbooru.donmai.us 접속되는지 확인!`);
          });
      },
      preDeny: async () => {
        if (url === "/") {
          Swal.fire({
            icon: "error",
            html: `
            드래그 앤드 드롭으로 분석한 파일은 사용할 수 없습니다.`,
          });
          return new Promise(reject);
        }
        const res = await GM_fetch(getOptimizedImageURL(url), {
          headers: { Referer: `${location.protocol}//${location.hostname}` },
        });
        const blob = await res.blob();
        const optimizedBase64 = await blobToBase64(blob);

        return fetch("https://smilingwolf-wd-v1-4-tags.hf.space/run/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [optimizedBase64, "SwinV2", 0.35, 0.85],
          }),
        })
          .then((res) => res.json())
          .catch((error) => {
            Swal.showValidationMessage(error);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isDismissed) return;
      let tags;
      if (result.isConfirmed) {
        tags = result.value.map((el) => el[0]).join(", ");
      } else if (result.isDenied) {
        tags = result.value.data[3]?.label
          ? `${result.value.data[3]?.label}, ${result.value.data[0]}`
          : result.value.data[0];
      }

      Swal.fire({
        confirmButtonText: "닫기",
        html: /*html*/ `
          <div class="md-title">Output 
            <span class="md-copy md-button" data-clipboard-target="#md-tags"></span>
          </div>
          <div class="md-info" id="md-tags">${tags}</div>
          `,
      });
    });
  }

  function fileToBlob(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Blob([reader.result], { type: file.type }));
      reader.readAsArrayBuffer(file);
    });
  }

  function blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function notSupportedFormat() {
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      icon: "error",
      title: "지원하지 않는 파일 형식입니다.",
    });
  }

  function isSupportedImageFormat(url) {
    const supportedExtensions = /\.(png|jpe?g|webp)|image\/(jpeg|webp|png)/;
    return supportedExtensions.test(url);
  }

  async function extractImageMetadata(blob, type) {
    try {
      switch (type) {
        case "image/jpeg":
        case "image/webp": {
          const exif = exifLib.load(await blobToBase64(blob));
          const parameters = exif.Exif[37510].replace("UNICODE", "").replaceAll("\u0000", "");
          return { parameters };
        }
        case "image/png": {
          const chunks = UPNG.decode(await blob.arrayBuffer());
          let parameters = chunks.tabs.tEXt?.parameters || chunks.tabs.iTXt?.parameters;
          const description = chunks.tabs.tEXt?.Description || chunks.tabs.iTXt?.Description;
          if (parameters) {
            return { parameters };
          } else if (description) {
            return chunks.tabs?.tEXt || chunks.tabs?.iTXt;
          } else {
            return null;
          }
        }
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function fetchAndDecode(url) {
    try {
      let response, contentType, reader;
      const Referer = `${location.protocol}//${location.hostname}`;
      if (isArca) {
        response = await fetch(url.replace("ac.namu.la", "ac-o.namu.la"));
        contentType = response.headers.get("content-type");
        reader = response.body.getReader();
      } else if (useTampermonkey) {
        response = await new Promise((resolve) => {
          GM_xmlhttpRequest({
            url,
            responseType: "stream",
            headers: { Referer },
            onreadystatechange: (data) => {
              resolve(data);
            },
          });
        });
        const headers = Object.fromEntries(
          response.responseHeaders.split("\n").map((line) => {
            const [key, value] = line.split(":").map((part) => part.trim());
            return [key, value];
          })
        );
        contentType = headers["content-type"];
        reader = response.response.getReader();
      } else {
        response = await GM_fetch(url, {
          headers: { Referer },
        });
        contentType = response.headers.get("content-type");
        reader = response.body.getReader();
      }
      if (
        (isPixiv && !url.includes(".jpg") && contentType === "text/html") ||
        (isPixiv && url.includes(".jpg"))
      ) {
        url = url.replace(".png", ".jpg");
        showTagExtractionModal(url);
        return;
      }

      let metadata;
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done || metadata || metadata === null) {
          reader.cancel();
          break;
        }
        switch (contentType) {
          case "image/jpeg":
            metadata = getMetadataJPEGChunk(value);
            break;
          case "image/png":
            metadata = getMetadataPNGChunk(value);
            metadata?.IDAT && reader.cancel();
            break;
          case "image/webp":
            chunks.push(value);
            break;
          default:
            notSupportedFormat();
            reader.cancel();
            break;
        }
      }
      if (contentType === "image/webp") {
        const blob = new Blob(chunks, { type: "image/webp" });
        const base64 = await blobToBase64(blob);
        const exif = exifLib.load(base64);
        const parameters = exif.Exif[37510].replace("UNICODE", "").replaceAll("\u0000", "");
        metadata = { parameters };
      }
      return metadata;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function extract(url) {
    if (!isSupportedImageFormat(url)) {
      notSupportedFormat();
      return;
    }

    Swal.fire({
      title: "로드 중!",
      width: "15rem",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    console.time("modal open");
    console.time("fetch");
    const metadata = await fetchAndDecode(url);
    console.timeEnd("fetch");
    console.log(metadata);

    if (metadata?.Description || metadata?.parameters || metadata?.["sd-metadata"]) {
      showMetadataModal(metadata, url);
    } else {
      showTagExtractionModal(url);
    }
    console.timeEnd("modal open");
  }

  const { hostname, href, pathname } = location;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isPixiv = hostname === "www.pixiv.net";
  const isArca = hostname === "arca.live";
  const isArcaViwer = /(arca.live)(\/)(b\/.*)(\/)(\d*)/.test(href);
  const isArcaWrite = /(arca.live\/b\/.*\/\write)/.test(href);
  const useTampermonkey = GM_xmlhttpRequest?.RESPONSE_TYPE_STREAM && true;
  const isPixivDragUpload = pathname === "/illustration/create" || pathname === "/upload.php";

  //TODO: 언젠가는 픽시브 비로그인 지원
  if (GM_getValue("usePixiv", false) && isPixiv) {
    function getOriginalUrl(url) {
      const extension = url.substring(url.lastIndexOf(".") + 1);
      const originalUrl = url
        .replace("/c/600x1200_90_webp/img-master/", "/img-original/")
        .replace("/c/100x100/img-master/", "/img-original/")
        .replace("_master1200", "")
        .replace(`.${extension}`, ".png");
      return originalUrl;
    }

    let isAi = false;
    if (!isMobile) {
      document.arrive("footer > ul > li > span > a", function () {
        if (this.href === "https://www.pixiv.help/hc/articles/11866167926809") isAi = true;
      });
      document.arrive("div[role=presentation]:last-child > div > div", function () {
        isAi && this.click();
      });
    } else {
      document.arrive("a.ai-generated", () => {
        isAi = true;
      });
      document.arrive("button.nav-back", function () {
        isAi && this.click();
      });
    }

    document.arrive("a > img", function () {
      if (this.alt === "pixiv") return;

      if (isAi) {
        let src;
        if (!isMobile) {
          src = this.parentNode.href;
        } else {
          src = getOriginalUrl(this.src);
        }

        this.onclick = function () {
          extract(src);
        };
      }
    });
  }

  if (isArcaViwer) {
    document.arrive('a[href$="type=orig"] > img', { existing: true }, function () {
      if (this.classList.contains("channel-icon")) return;

      this.parentNode.onclick = (event) => {
        if (event.button === 0) {
          event.preventDefault();
        }
      };
      this.onclick = function () {
        const src = `${this.src}?type=orig`;
        extract(src);
      };
    });
  }

  if (isArcaWrite) {
    document.arrive(".images-multi-upload", { onceOnly: true }, () => {
      document.getElementById("saveExif").checked = true;
    });
  }

  !isMobile && !isPixivDragUpload && !isArcaWrite && new DropZone();
  GM_addStyle(modalCSS);
  new ClipboardJS(".md-copy");
  registerMenu();
})();

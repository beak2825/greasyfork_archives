// ==UserScript==
// @name         YTdl
// @namespace    https://tampermonkey.net/
// @version      0.2.1
// @description  download YouTube video
// @author       Shiroikoi
// @run-at       document-idle
// @match        https://www.youtube.com/watch*
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://unpkg.com/@ffmpeg/ffmpeg@0.9.5/dist/ffmpeg.min.js
// @grant        none
// @compatible   firefox >=79
// @compatible   chrome >=68
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412895/YTdl.user.js
// @updateURL https://update.greasyfork.org/scripts/412895/YTdl.meta.js
// ==/UserScript==
(function () {
  const ffmpeg = FFmpeg.createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js",
    log: true,
  });
  let vidseleVm,
    audseleVm,
    infoVm,
    buttVm,
    dataArray,
    controller,
    fileName,
    decryptFun,
    progressText = { totalLength: 0, receivedLength: 0, text: "" },
    videoList = {
      options: [],
    },
    audioList = {
      options: [],
    },
    style = document.createElement("style"),
    optionVideo = document.createElement("option"),
    optionAudio = document.createElement("option"),
    row1 = document.createElement("div"),
    row2 = document.createElement("div"),
    selectVideo = document.createElement("select"),
    selectAudio = document.createElement("select"),
    button = document.createElement("button"),
    spanInfo = document.createElement("span");

  style.innerText =
    "@font-face {\
      font-family: 'Quicksand';\
      font-style: normal;\
      font-weight: 400;\
      font-display: swap;\
      src: url(https://fonts.gstatic.com/s/quicksand/v21/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58a-wg.woff2) format('woff2');\
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\
    }";
  document.head.append(style);
  button.setAttribute("v-on:click", "click");
  button.textContent = "{{text}}";
  button.style.width = "110px";
  button.style.height = "35px";
  button.style.fontSize = "20px";
  button.style.fontFamily = "Quicksand";
  button.style.marginLeft = "20px";
  button.style.position = "absolute";
  selectVideo.style.fontSize = "20px";
  selectVideo.style.fontFamily = "Quicksand";
  selectVideo.style.height = "35px";
  selectVideo.style.width = "280px";
  selectAudio.style.fontSize = "20px";
  selectAudio.style.fontFamily = "Quicksand";
  selectAudio.style.height = "35px";
  selectAudio.style.width = "280px";
  optionVideo.setAttribute("v-for", "i in options");
  optionVideo.textContent = "{{ i }}";
  optionAudio.setAttribute("v-for", "i in options");
  optionAudio.textContent = "{{ i }}";
  spanInfo.style.fontSize = "20px";
  spanInfo.style.fontFamily = "Quicksand";
  spanInfo.textContent = "{{text}}";

  infoVm = new Vue({
    data: progressText,
  });
  vidseleVm = new Vue({
    data: videoList,
  });
  audseleVm = new Vue({
    data: audioList,
  });
  buttVm = new Vue({
    data: {
      text: "download",
      signal: false,
    },
    methods: {
      click: function () {
        if (this.signal == false) {
          infoVm.text = " parsing...";
          controller = new AbortController();
          this.stat2();
          vidseleVm.$el.selectedIndex == videoList.options.length - 1 ? this.taskAud() : this.taskVidnAud();
        } else {
          controller.abort();
          this.stat1();
          infoVm.text = " canceled!";
        }
      },
      taskVidnAud: async function () {
        let indexA = videoList.options.length - 1 + audseleVm.$el.selectedIndex,
          indexV = vidseleVm.$el.selectedIndex,
          videoUrl,
          audioUrl;
        if (dataArray[indexV].url == undefined) {
          if (decryptFun == undefined) decryptFun = await fetchCode().then(getDecryptFun);
          videoUrl = decryptUrls(decryptFun, indexV);
          audioUrl = decryptUrls(decryptFun, indexA);
        } else {
          videoUrl = dataArray[indexV].url;
          audioUrl = dataArray[indexA].url;
        }
        console.log(videoUrl) || console.log(audioUrl);
        let mediaArray = await Promise.all([
          fetchMedia(videoUrl, controller, progressText, this.errcb),
          fetchMedia(audioUrl, controller, progressText, this.errcb),
        ]);
        if (mediaArray[0] == null) {
          return;
        } else if (mediaArray[0] == null) {
          return;
        }
        ffmpeg.isLoaded() ? null : await ffmpeg.load();
        await blobToUint8Array(mediaArray[0])
          .then((result) => {
            ffmpeg.FS("writeFile", "video", result);
          })
          .catch((error) => {
            this.errcb(error);
          });
        await blobToUint8Array(mediaArray[1])
          .then((result) => {
            ffmpeg.FS("writeFile", "audio", result);
          })
          .catch((error) => {
            this.errcb(error);
          });
        await ffmpeg.run("-i", "video", "-i", "audio", "-c", "copy", "output.mp4");
        let outPut = ffmpeg.FS("readFile", "output.mp4");
        ffmpeg.FS("unlink", "output.mp4");
        blobLink(new Blob([outPut]), fileName + ".mp4");
        infoVm.text = " merged! total:" + progressText.totalLength + "MiB";
        this.stat1();
      },
      taskAud: async function () {
        let indexA = videoList.options.length - 1 + audseleVm.$el.selectedIndex,
          audioUrl,
          suff;
        if (dataArray[indexA].url == undefined) {
          if (decryptFun == undefined) decryptFun = await fetchCode().then(getDecryptFun);
          audioUrl = decryptUrls(decryptFun, indexA);
        } else {
          audioUrl = dataArray[indexA].url;
        }
        console.log(audioUrl);
        let audio = await fetchMedia(audioUrl, controller, progressText, this.errcb);
        if (audio == null) return;
        if (dataArray[indexA].mimeType.match("mp4")) {
          suff = ".m4a";
        } else if (dataArray[indexA].mimeType.match("webm")) {
          suff = ".weba";
        }
        blobLink(audio, fileName + suff);
        infoVm.text = " merged! total:" + progressText.totalLength + "MiB";
        this.stat1();
      },
      stat1: function () {
        this.signal = false;
        this.text = "download";
        this.$el.style.backgroundColor = "";
      },
      stat2: function () {
        this.signal = true;
        this.text = "cancel";
        this.$el.style.backgroundColor = "#99ccff";
      },
      errcb: function (error) {
        console.log(error.name);
        switch (error.name) {
          case "AbortError":
            this.stat1();
            break;
          default:
            infoVm.text = " error! try refresh the page";
            this.stat1();
            break;
        }
      },
    },
  });
  mountFun();

  function mountFun() {
    if (document.querySelector("#meta") == null) {
      setTimeout(mountFun, 500);
    } else {
      document.querySelector("#meta").append(row1);
      document.querySelector("#meta").append(row2);
      row1.append(selectVideo);
      row1.append(button);
      row2.append(selectAudio);
      row2.append(spanInfo);
      selectVideo.prepend(optionVideo);
      selectAudio.prepend(optionAudio);
      buttVm.$mount(button);
      audseleVm.$mount(selectAudio);
      vidseleVm.$mount(selectVideo);
      infoVm.$mount(spanInfo);
      try {
        dataArray = ytInitialPlayerResponse.streamingData.adaptiveFormats;
        fileName = ytInitialPlayerResponse.videoDetails.title;
        dataArray.forEach((item) => {
          if (item.mimeType.match(/video/)) {
            videoList.options.push(item.qualityLabel + "-" + item.mimeType);
          } else if (item.mimeType.match(/audio/)) {
            audioList.options.push(item.audioQuality + "-" + item.mimeType);
          }
        });
        videoList.options.push("none");
      } catch (error) {
        console.log(error.name);
        infoVm.text = "script currently not available";
        buttVm.$el.disabled = true;
      }
    }
  }
  async function fetchCode(errcb) {
    let code,
      script = document.querySelectorAll("script");
    try {
      for (let i = 0; i < script.length; i++) {
        if (script[i].src.match(/base\.js/)) {
          const res = await fetch(script[i].src);
          code = await res.text();
          break;
        }
      }
      return code;
    } catch (error) {
      errcb(error);
      console.log("fetchCode failed" + error.name);
      return null;
    }
  }
  function getDecryptFun(code) {
    let funName = code.match(/(?<==)[\w]+(?=\(decodeURIC)/)[0],
      funString = code
        .match(new RegExp(`(?<=${funName}=)function\\([\\s\\S]+?}`))[0]
        .replace(/^/, "(")
        .replace(/$/, ")"),
      fun = eval(funString),
      objName = funString.match(/(?<=;).+?./)[0],
      objSting = `var ${objName} =` + code.match(new RegExp(`(?<=var ${objName}=)[\\s\\S]+?}}`))[0];
    eval(objSting);
    console.log(fun) || console.log(objSting);
    return fun;
  }
  function decryptUrls(fun, index) {
    let url = dataArray[index].signatureCipher,
      sig = fun(decodeURIComponent(url.match(/(?<=s=).+?(?=&sp)/)));
    url = decodeURIComponent(url.match(/https.+/)[0].replace(/\%25/g, "%"));
    return url + "&sig=" + encodeURIComponent(sig);
  }
  async function fetchMedia(url, controller, progressText, errcb) {
    try {
      let res = await fetch(url, {
        signal: controller.signal,
      });
      const reader = res.body.getReader();
      const contentLength = res.headers.get("Content-Length");
      progressText.totalLength += parseFloat((parseInt(contentLength) / 1024 / 1024).toFixed(2));
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        progressText.receivedLength += value.length;
        progressText.text =
          "downloaded:" + (parseFloat(progressText.receivedLength) / 1024 / 1024).toFixed(2) + "MiB total:" + progressText.totalLength + "MiB";
      }
      return new Blob(chunks);
    } catch (error) {
      errcb(error);
      return null;
    }
  }
  function blobToUint8Array(blob) {
    return new Promise((rs, rj) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        rs(new Uint8Array(fileReader.result));
      };
      fileReader.onerror = () => {
        rj({ name: "b28 failed" });
      };
      fileReader.readAsArrayBuffer(blob);
    });
  }
  function blobLink(blob, fileName) {
    let dl = document.createElement("a");
    dl.download = fileName;
    dl.href = URL.createObjectURL(blob);
    dl.click();
    URL.revokeObjectURL(dl.href);
    dl.remove();
  }
})();

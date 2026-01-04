// ==UserScript==
// @name         JAVBUS影片预告
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  JAVBUS自动显示预告片
// @author       A9
// @supportURL   https://sleazyfork.org/zh-CN/scripts/450740/feedback
// @source       https://github.com/bigwolf9987/JavBusTrailer
// @match        https://www.javbus.com/
// @include      /^https?:\/\/(?:[A-Za-z0-9]+\.)*(?:javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav){1}(?:\.[A-Za-z0-9]+)?\/[\w_-]{1,}\/?$/
// @exclude      /^https?:\/\/(?:[A-Za-z0-9]+\.)*(?:javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav){1}(?:\.[A-Za-z0-9]+)?\/(?:forum|actresses|uncensored|genre|series|studio|page){1,}\/?\S*$/
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      r18.com
// @connect      dmm.co.jp
// @connect      javdb.com
// @connect      mgstage.com
// @connect      prestige-av.com
// @connect      javspyl.eu.org
// @connect      heyzo.com
// @connect      avfantasy.com
// @connect      tokyo-hot.com
// @connect      caribbeancom.com
// @connect      aventertainments.com
// @connect      10musume.com
// @connect      pacopacomama.com
// @connect      1pondo.tv
// @connect      cloudfront.net
// @connect      workers.dev
// @connect      supabase.co
// @connect      xcity.jp
// @connect      obox.jp
// @connect      cdn.faleno.net
// @connect      faleno.jp
// @connect      falenogroup.com
// @connect      dahlia-av.jp
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABFElEQVQ4ja2TMU4CQRSGvzfuKkQ2bqORRpKNV6CjIaGgovQK1LRs7R24AoECbrAHWE7glhQkJO4SEgt1GQsCBhmG1fjKee//8v/zZiSGJ+AZeOR3lQChxPDyB/EeIjFo28SuKSf6jk0sjoPXaHDh+6yjiDzLjmaUDaDKZe77fR4GAy5rNaNVK2DnQlwXEXOIs4Bz9f8AU85TG4CfW1AKv93mul7ndTjkfT4HETSgN5sCAK256XS47XZRlQrrKOIqCMjTlDxNjU7UoV6TTSZ8Lpfc9XoEoxFutUo6HvOxWBgdHL1EcRy8ZhOv1UKVSrzNZmTTKflqVQwA2wOBbX6trZeo2P6qQ+p3JqsYSBQQmiAFKgHCL3I+UIXeDJynAAAAAElFTkSuQmCC
// @require      https://fastly.jsdelivr.net/npm/video.js@8.22.0/dist/video.min.js
// @require      https://fastly.jsdelivr.net/npm/videojs-vr@1.10.1/dist/videojs-vr.min.js
// @require      https://fastly.jsdelivr.net/npm/videojs-contrib-quality-menu@1.0.3/dist/videojs-contrib-quality-menu.min.js
// @resource     video-js-css https://fastly.jsdelivr.net/npm/video.js@8.22.0/dist/video-js.min.css
// @resource     video-vr-js-css https://fastly.jsdelivr.net/npm/videojs-vr@1.10.1/dist/videojs-vr.css
// @resource     video-js-quality-menu-css https://fastly.jsdelivr.net/npm/videojs-contrib-quality-menu@1.0.3/dist/videojs-contrib-quality-menu.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450740/JAVBUS%E5%BD%B1%E7%89%87%E9%A2%84%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/450740/JAVBUS%E5%BD%B1%E7%89%87%E9%A2%84%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let player = null;
  //脚本设置项
  const settings = {
    enable_vr_mode: 1, //是否使用VR模式，0 关闭；1 开启
    enable_mute_play: 0, //是否开启静音播放，0 关闭；1 开启 （注：跨域页面无效，需手动控制播放与音量）
    video_playback_speed: 1.0, //视频默认播放速度，建议设置范围 0.25～2.0（注：数值越大播放速度越快）
    enable_debug_mode: 0,
    video_quality: 576, //视频默认清晰度，仅可设置为下列值之一：2160；1080；720；576；432；288；144；（注：数值越大越清晰，加载时间越长，流量消耗越高）
  };
  const corporations = {
    stars: ["1"],
    star: ["1"],
    svdvd: ["1"],
    sdde: ["1"],
    mogi: ["1"],
    dvdes: ["1"],
    fset: ["1"],
    rct: ["1"],
    abp: ["118"],
    ppt: ["118"],
    dv: ["53"],
    mds: ["84"],
    gvg: ["13"],
    haru: ["h_687"],
    sdnm: ["1"],
    scpx: ["84"],
    dldss: ["1"],
    spro: ["h_1594", "00"],
    silkc: ["1", "00"],
    hzgb: ["h_1100"],
    awd: [""],
    drpt: ["1"],
    hz: ["h_113"],
    pym: ["h_283"],
    fone: ["h_491"],
    stcv: ["h_1616", "00"],
    ftht: ["1", "00"],
    apns: [""],
    dvaj: [""],
    t28: ["55"],
    lol: ["12", "00"],
    vema: [""],
    venx: [""],
    skmj: ["h_1324"],
    fsvr: ["h_955", "00"],
    dtvr: ["24", "00"],
    pydvr: ["h_1321", "00"],
    hoks: [""],
    sqis: [""],
    real: [""],
    urkk: [""],
    bazx: [""],
    mdbk: [""],
    mdtm: [""],
    mkmp: [""],
    saba: [""],
    scop: [""],
    spz: ["h_254"],
    udak: ["h_254"],
    jukf: ["h_227"],
    shind: ["h_1560", "00"],
    ovg: [""],
    shh: ["1", "00"],
    shn: ["1", "00"],
    dandy: ["1"],
    sw: ["1"],
    meko: ["h_1160", "00"],
    apaa: [""],
    ekdv: [""],
    nhdtb: ["1"],
    umd: ["125"],
    sdab: ["1"],
    sdjs: ["1"],
    sdmf: ["1"],
    sdmm: ["1"],
    sdmua: ["1"],
    rebd: ["h_346"],
    sdth: ["1"],
    aran: [""],
    aed: [""],
    anb: [""],
    cmv: [""],
    piyo: ["1"],
    rctd: ["1"],
    fgan: ["h_1440", "00"],
    zex: ["h_720"],
    fera: ["h_086", "00"],
    fuga: ["h_086", "00"],
    mtall: ["1", "00"],
    fsdss: ["1"],
    ofku: ["h_254"],
    nsfs: ["", "00"],
    sdmu: ["1"],
    sinn: [""],
    hkd: [""],
    rvg: [""],
    scd: [""],
    ktra: ["h_094", "00"],
    jrze: ["h_086", "00"],
    mesu: ["h_086", "00"],
    akdl: ["1", "00"],
    wo: ["1"],
    sun: ["1"],
    gvh: [""],
    vec: [""],
    gma: [""],
    supa: ["h_244"],
    bobb: [""],
    focs: [""],
    tppn: [""],
    abw: ["118"],
    pkpd: [""],
    adn: ["", "00"],
    wkd: ["2", "00"],
    aarm: [""],
    sqte: [""],
    flav: [""],
    jsop: [""],
    bda: [""],
    tki: ["h_286"],
    nacr: ["h_237"],
    kire: ["1"],
    docp: ["118"],
    jksr: ["57"],
    hgot: ["84"],
    mcsr: ["57"],
  };
  const need_cors_domain = new Set(["smovie.1pondo.tv", "dy43ylo5q3vt8.cloudfront.net"]);

  //Start running from here
  const movieInfo = getMovieInfo();
  if (movieInfo?.movieId && !movieInfo?.isEuropeOrAmerica) {
    addPreviewVideoStyle();
    log(JSON.stringify(movieInfo));
    getVideoURL(movieInfo).then((videoURL) => {
      if (!videoURL) return;
      movieInfo.videoURL = videoURL;
      //Save video url to local storage cache.
      GM_setValue(movieInfo.movieId, videoURL);
      addVideoPlayerElement(movieInfo);
    });
  }

  /**
   * get movie info object
   * @returns {object}
   */
  function getMovieInfo() {
    const infoDom = document.querySelector(".container .info");
    if (!infoDom) return;
    let movieId = infoDom.innerText
      .match(/(?<=(?:識別碼|识别码|ID|品番):.)[\w\-\.]+/)
      ?.at(0);
    let corpName = infoDom.innerText
      .match(/(?<=(?:製作商|Studio|메이커|メーカー):.)[\x20\S]+/)
      ?.at(0)
      ?.trim();
    let isVR =
      infoDom
        .querySelector("#genre-toggle")
        ?.parentElement?.nextElementSibling.innerText.search(
          /ハイクオリティVR|VR専用|カリVR|VR/
        ) > -1;
    let isUncensored =
      document
        .querySelector("#navbar li.active")
        ?.innerText.search(/無碼|Uncensored|無修正|무수정/) > -1;
    let isEuropeOrAmerica =
      document
        .querySelector("#navbar li.active")
        ?.innerText.search(/歐美|Western|外国人|서양의/) > -1;
    let title = document.querySelector(".bigImage img")?.title;
    let thumbnailURL = document.querySelector(".sample-box")?.href;
    let titleKeyPhrase = getKeyPhrase(title);
    //remove unnecessary characters
    titleKeyPhrase = getKeyPhrase(titleKeyPhrase, "●");
    //retry extract
    if (titleKeyPhrase === title) titleKeyPhrase = getKeyPhrase(title, "！！");

    log({
      title,
      movieId,
      corpName,
      isVR,
      isUncensored,
      isEuropeOrAmerica,
      thumbnailURL,
      titleKeyPhrase,
    });
    return {
      title,
      movieId,
      corpName,
      isVR,
      isUncensored,
      isEuropeOrAmerica,
      thumbnailURL,
      titleKeyPhrase,
    };
  }

  /**
   * Append player style
   */
  function addPreviewVideoStyle() {
    let containerStyle = `
        #preview-video-container{
            position: fixed;
            height: 100%;
            width: 100%;
            background-color: rgba(0,0,0,0.8);
            top: 0px;
            z-index: 999;
            display: none;
            align-items: center;
            justify-content: center;
        }
        #preview-video-container:before {
            content: '\\2715';
            font-size: 28px;
            color: white;
            opacity: 0.7;
            right: 18px;
            top: 8px;
            position: absolute;
            cursor: pointer;
            pointer-events:none;
        }
        #preview-video-player{
            height: 80%;
            min-width: 70%;
            max-width: 80%;
            background-color: #000;
            border-radius: 8px;
            outline: none;
            overflow: hidden;
        }
        .preview-video-img-container{
            position: relative;
            cursor:pointer;
        }
        .preview-video-img-container img{
            max-width: 100%;
            object-fit: cover;
            width: 120px;
        }
        .preview-video-img-container:after {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'  viewBox='0 0 512 512'%3E%3Cpath d='M448 255c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z' fill='gold'  fill-opacity='0.8' stroke='none'/%3E%3Cpath fill='white' d='M216.32  334.44l114.45-69.14a10.89 10.89 0 000-18.6l-114.45-69.14a10.78 10.78 0 00-16.32 9.31v138.26a10.78 10.78 0 0016.32 9.31z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: 50%;
            background-color: #0000005e;
            background-size: 48px 48px;
            bottom: 0;
            content: "";
            display: block;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
        }
        `;
    GM_addStyle(containerStyle);
    GM_addStyle(GM_getResourceText("video-js-css"));
    GM_addStyle(GM_getResourceText("video-vr-js-css"));
    GM_addStyle(GM_getResourceText("video-js-quality-menu-css"));
  }

  /**
   * Append Video Player Element to Page
   * @param {object} movieInfo movieInfo
   * @returns
   */
  function addVideoPlayerElement(movieInfo) {
    if (!movieInfo.videoURL) return;
    let video;
    let muted = settings.enable_mute_play == true ? "muted" : "";
    //target video url need use iframe
    if (needCORS(movieInfo.videoURL)) {
      video = `
      <iframe id="preview-video-iframe" name="preview-video-iframe" width="60%" height="80%" style="border:none;border-radius:8px;" srcdoc="<html><head><style>*{width:100%;height:100%;padding:0;margin:0;overflow:hidden;} video{background: #000;}</style></head><body><video controls><source src='${movieInfo.videoURL}' type='video/mp4'></video></body></html>">
      </iframe>`;
    } else {
      video = `
        <video id="preview-video-player" playsinline controls preload="none" ${muted} poster="${
        document.querySelector("a.bigImage img")?.src
      }">
            <source src="${movieInfo.videoURL}" type="video/mp4" />
        </video>`;
      if (
        videojs &&
        ((settings.enable_vr_mode == true && movieInfo.isVR) ||
          isM3U8(movieInfo.videoURL))
      ) {
        video = `
              <video id="preview-video-player" class="video-js" playsinline controls preload="none" 
              ${muted} poster="${
          document.querySelector("a.bigImage img")?.src
        }" crossorigin="anonymous">
              </video>`;
      }
    }
    let vContainer = document.createElement("div");
    vContainer.id = "preview-video-container";
    vContainer.innerHTML = video;

    //onclick event -- hide and pause player
    vContainer.addEventListener("click", (event) => {
      if (event?.target != vContainer) return;
      vContainer.style.display = "none";
      if (player) {
        player.pause();
      } else {
        //reset iframe to pause video
        if (needCORS(movieInfo.videoURL)) {
          const iframe = document.querySelector("#preview-video-iframe");
          let originIframe = iframe.cloneNode(true);
          iframe.parentElement.append(originIframe);
          iframe.remove();
        }
      }
      document.body.style.overflow = "auto";
    });
    document.body.append(vContainer);
    initVideoPlayer(movieInfo);
    addVideoPreviewImage();
  }

  function initVideoPlayer(movieInfo) {
    if (needCORS(movieInfo.videoURL)) {
      return;
    }
    if (
      videojs &&
      ((settings.enable_vr_mode == true && movieInfo.isVR) || isM3U8(movieInfo.videoURL))
    ) {
      player = videojs("preview-video-player", {
        playbackRates: [0.5, 1, 1.5, 2],
      });
      player.mediainfo = player.mediainfo || {};
      if (isM3U8(movieInfo.videoURL)) {
        player.src({
          type: "application/x-mpegURL",
          src: movieInfo.videoURL,
        });
      }
      //enabled vr plugin
      if (movieInfo.isVR) {
        player.src({
          type: "video/mp4",
          src: movieInfo.videoURL,
        });
        player.mediainfo.projection = "360";
        player.vr({ projection: "AUTO" });
        player.vr().on("initialized", () => {
          player.vr().camera.position.x = -1.3981591081738982;
          player.vr().camera.position.y = 0.035304011118944253;
          player.vr().camera.position.z = -0.7904654323761686;
        });
        player.tech(false); //tech() will log warning without any argument
      }
      player.defaultPlaybackRate(settings.video_playback_speed);
      player.qualityMenu({ defaultResolution: settings.video_quality });
    } else {
      player = document.querySelector("#preview-video-player");
      player.playbackRate = settings.video_playback_speed;
    }
  }

  /**
   * Append video preview image to movie gallery
   * @returns
   */
  function addVideoPreviewImage() {
    let imgWaterFall = document.querySelector("#sample-waterfall");
    if (!imgWaterFall) {
      imgWaterFall = document.createElement("div");
      imgWaterFall.id = "sample-waterfall";
      let heading = document.createElement("h4");
      heading.innerText = "樣品圖像";
      const clearfix = document.getElementsByClassName("clearfix")[0];
      clearfix?.before(heading, imgWaterFall);
    }
    let previewImgSpan = document.createElement("span");
    previewImgSpan.classList.add("sample-box");
    let photoFrame = document.createElement("div");
    photoFrame.classList.add("photo-frame", "preview-video-img-container");
    let posterImg = document.querySelector("a.bigImage img");
    if (posterImg) {
      let img = document.createElement("img");
      img.src = posterImg.src;
      photoFrame.append(img);
    }
    previewImgSpan.append(photoFrame);
    imgWaterFall.prepend(previewImgSpan);

    //onclick event
    previewImgSpan.addEventListener("click", () => {
      let vContainer = document.querySelector("#preview-video-container");
      if (vContainer) {
        document.body.style.overflow = "hidden";
        vContainer.style.display = "flex";
        if (player) {
          player.play();
          player.focus();
        }
      }
    });
  }

  async function getVideoURL(movieInfo) {
    const queryFunctions = [
      (info) => queryLocalCacheDB(info),
      (info) => querySupaBase(info),
      (info) => queryCF(info),
      (info) => queryDMMVideoURL(info, undefined, false, "mhb"),
      (info) => queryDMMVideoURL(info),
      (info) => queryDMMVideoURL(info, undefined, true),
      (info) => queryPrestigeVideoURL(info),
      (info) => queryMGStageVideoURL(info),
      (info) => queryMGStageVideoURL(info, false, true),
      (info) => queryMGStageVideoURL(info, true), // retry with movie title
      (info) => queryFalenoVideoURL(info),
      (info) => queryXCityVideoURL(info),
      (info) => queryBasicUncensoredVideoURL(info),
      (info) => queryTokyoHotVideoURL(info),
      (info) => queryAVFantasyVideoURL(info),
      (info) => queryAVFantasyVideoURL(info, true),
      (info) => queryJavSpylVideoURL(info),
      // (info) => queryJavDBVideoURL(info),
    ];
    let videoURL = null;

    for (const queryFn of queryFunctions) {
      try {
        videoURL = await queryFn(movieInfo);
        if (videoURL) break;
      } catch (e) {
        log(e);
      }
    }
    return replaceDMMHost(convertHTTPToHTTPS(videoURL));
  }

  async function queryBasicUncensoredVideoURL(movieInfo) {
    if (!movieInfo.isUncensored)
      return Promise.reject("Query basic uncensored only support uncensored movie.");
    let videoURLs;
    const qualityArr = ["720p.mp4", "1080p.mp4", "480p.mp4", "360p.mp4", "240p.mp4"];
    if (
      movieInfo.corpName === "カリビアンコム" ||
      movieInfo.corpName.toUpperCase() === "CARIBBEANCOM"
    ) {
      //create different quality video urls.
      videoURLs = qualityArr.map(
        (quality) =>
          `https://smovie.caribbeancom.com/sample/movies/${movieInfo.movieId}/${quality}`
      );
    } else if (
      movieInfo.corpName === "東京熱" ||
      movieInfo.corpName.toUpperCase() === "TOKYOHOT"
    ) {
      videoURLs = [`https://my.cdn.tokyo-hot.com/media/samples/${movieInfo.movieId}.mp4`];
    } else if (
      movieInfo.corpName === "天然むすめ" ||
      movieInfo.corpName.toUpperCase() === "10MUSUME"
    ) {
      videoURLs = qualityArr.map(
        (quality) =>
          `https://smovie.10musume.com/sample/movies/${movieInfo.movieId}/${quality}`
      );
    } else if (
      movieInfo.corpName === "一本道" ||
      movieInfo.corpName.toUpperCase() === "1PONDO"
    ) {
      videoURLs = qualityArr.map(
        (quality) =>
          `https://smovie.1pondo.tv/sample/movies/${movieInfo.movieId}/${quality}`
      );
      videoURLs.push(
        `https://ppvclips02.aventertainments.com/01m3u8/1pon_${movieInfo.movieId}/1pon_${movieInfo.movieId}.m3u8`
      );
    } else if (
      movieInfo.corpName === "ワンピース" ||
      movieInfo.corpName === "オリエンタルドリーム" ||
      movieInfo.corpName.toUpperCase() === "ONEPIECEENTERTAINMENT" ||
      movieInfo.corpName.toUpperCase() === "ORIENTALDREAM"
    ) {
      videoURLs = [
        `https://ppvclips02.aventertainments.com/${movieInfo.movieId}/ts/${movieInfo.movieId}-m3u8-aapl.ism/manifest(format=m3u8-aapl).m3u8`,
      ];
    } else if (
      movieInfo.corpName === "パコパコママ" ||
      movieInfo.corpName.toUpperCase() === "PACOPACOMAMA"
    ) {
      videoURLs = qualityArr.map(
        (quality) =>
          `https://fms.pacopacomama.com/hls/sample/pacopacomama.com/${movieInfo.movieId}/${quality}`
      );
    } else {
      return Promise.reject(
        "Query basic uncensored: This function not support this corporation movie."
      );
    }
    for (const videoURL of videoURLs) {
      log("Query basic uncensored:\r\n" + videoURL);
      const validatedURL = await xFetch(videoURL, { method: "head" })
        .then((resp) => {
          if (resp?.status === 200) {
            log("Query basic uncensored: server result video url: " + videoURL);
            return videoURL;
          }
          return null;
        })
        .catch((e) => {
          log(e);
          return null;
        });
      if (validatedURL) {
        return Promise.resolve(validatedURL);
      }
    }
    return Promise.reject("Query basic uncensored Not found movie.");
  }

  async function queryJavSpylVideoURL(movieInfo) {
    //Video links for these companies require cors, so ignore it.
    // if (
    //   movieInfo.corpName === "HEYZO" ||
    //   movieInfo.corpName === "一本道" ||
    //   movieInfo.corpName === "1pondo"
    // ) {
    //   return Promise.reject("JavSpyl server not support this corporation movie.");
    // }
    //see https://bit.ly/3RkgqSo
    let serverURL = "https://javspyl.eu.org/api";
    return await xFetch(serverURL, {
      headers: {
        origin: "https://javspyl.eu.org",
        "Content-Type": "application/json",
      },
      data: `{ "_id": "${movieInfo.movieId}" }`,
      method: "POST",
    })
      .then((resp) => {
        if (resp?.status !== 200 || !resp.responseText)
          return Promise.reject("JavSpyl server not found movie.");
        return JSON.parse(resp.responseText);
      })
      .then((video) => {
        if (video?.info?.url?.length > 0) {
          log("JavSpyl server result video url: https://" + video.info.url);
          return "https://" + video.info.url;
        } else {
          return Promise.reject("JavSpyl server not found movie.");
        }
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryAVFantasyVideoURL(movieInfo, isStandbyServer = false) {
    if (!movieInfo.isUncensored)
      return Promise.reject("AVFantasyDMM server only support uncensored movie.");
    let notFound = () => Promise.reject("AVFantasy server not found movie.");
    let keyword = movieInfo.movieId;
    //Movie codes for these companies are not supported, so use movie titles to search.
    if (movieInfo.corpName.toUpperCase() === "HEYZO") {
      keyword = movieInfo.titleKeyPhrase;
    }
    let serverURL = `https://www.avfantasy.com/ppv/ppv_searchproducts.aspx?keyword=${keyword}`;
    if (isStandbyServer) {
      serverURL = `https://www.avfantasy.com/search_Products.aspx?keyword=${keyword}`;
    }
    log("AVFantasyDMM server query:\r\n" + serverURL);
    return await xFetch(serverURL)
      .then((response) => {
        //AVFantasy search result, may contain multiple movies.
        let resultMovies = extractAVFantasyMovieItem(response.responseText);
        if (!resultMovies) return notFound();
        let targetMovieEle = null;
        for (const element of resultMovies) {
          if (matchMovieByKeyword(element, movieInfo)) {
            targetMovieEle = element;
            break;
          }
        }
        if (!targetMovieEle) return notFound();
        let avDetailURL = targetMovieEle.match(/<a href="(\S*?)"/s)?.at(1);
        if (!avDetailURL) return notFound();
        return xFetch(avDetailURL);
      })
      .then((response) => {
        //AVFantasy movie detail page result.
        let videoSource = response.responseText?.match(/<source.*?src="(\S*?)"/s)?.at(1);
        if (videoSource) {
          log("AVFantasy server result video url: " + videoSource);
          return videoSource;
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryJavDBVideoURL(movieInfo) {
    let serverURL = `https://javdb.com/search?q=${movieInfo.movieId}&f=all`;
    let notFound = () => Promise.reject("JavDB server not found movie.");
    log("JavDB server query:\r\n" + serverURL);
    return await fetch(serverURL)
      .then((resp) => {
        return resp.text();
      })
      .then((text) => {
        //JavDB search result, may contain multiple movies.
        //TODO
        let doc = convertTextToDOM(text);
        let resultMovies = doc.querySelectorAll(".item");
        let targetMovieEle = null;
        for (const element of resultMovies.values()) {
          if (matchMovieByKeyword(element.innerHTML, movieInfo)) {
            targetMovieEle = element;
            break;
          }
        }
        if (!targetMovieEle) return notFound();
        let avDetailPathName = targetMovieEle.querySelector("a")?.pathname;
        if (!avDetailPathName) return notFound();
        return fetch("https://javdb.com" + avDetailPathName);
      })
      .then((avDetailResp) => {
        return avDetailResp.text();
      })
      .then((text) => {
        //JavDB movie detail page result.
        let doc = convertTextToDOM(text);
        let videoSource = doc.querySelector("#preview-video source");
        if (videoSource && videoSource?.src && videoSource.src != location.href) {
          log("JavDB server result video url: " + videoSource.src);
          return videoSource.src;
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryDMMVideoURL(
    movieInfo,
    host = "cc3001.dmm.co.jp",
    hasPrefix = false,
    postfix = "_dmb_w"
  ) {
    if (movieInfo.isUncensored)
      return Promise.reject("DMM server not support uncensored movie.");
    // if (movieInfo.thumbnailURL?.includes("mgstage.com"))
    //   return Promise.reject("DMM server not support MGStage movie.");
    //see https://www.javbus.com/forum/forum.php?mod=viewthread&tid=63374
    //see https://bit.ly/3wXLj6T
    let infix = "litevideo/freepv";
    //1500kbps = _dmb_w || 3000kbps = _mhb_w || vrlite || _sm_w.mp4 || _dm_w.mp4 || _dmb_s.mp4!!
    // let postfix = "_dmb_w";
    if (movieInfo.isVR) {
      postfix = "vrlite";
      infix = "vrsample";
    }
    let movieIdSplit = movieInfo.movieId.toLowerCase().split("-");
    let corp = movieIdSplit[0];
    let idNum = movieIdSplit[1];
    let videoURL = `https://${host}/${infix}/${corp[0]}/${corp.substring(
      0,
      3
    )}/${corp}${idNum}/${corp}${idNum}${postfix}.mp4`;

    if (hasPrefix === false && movieInfo.thumbnailURL?.includes("pics.dmm.co.jp")) {
      //extract keyword from thumbnail
      //example: https://pics.dmm.co.jp/digital/video/mkmp00497/mkmp00497jp-2.jpg
      //result keyword: mkmp00497
      let keywordFromThumbnail = movieInfo.thumbnailURL
        ?.split("video/")[1]
        ?.split("/")[0];
      //validation
      if (keywordFromThumbnail?.includes(corp) && keywordFromThumbnail?.includes(idNum)) {
        videoURL = `https://${host}/${infix}/${
          keywordFromThumbnail[0]
        }/${keywordFromThumbnail.substring(
          0,
          3
        )}/${keywordFromThumbnail}/${keywordFromThumbnail}${postfix}.mp4`;
      }
    }

    if (hasPrefix === true) {
      if (corporations[corp]) {
        //There must first get the idNum, and then get corp. Because corp will change.
        idNum = corporations[corp][1] ? corporations[corp][1] + idNum : idNum;
        corp = corporations[corp][0] + corp;
      } else {
        //if last time query is fail, this time try to add '00' prefix
        if (!movieInfo.thumbnailURL?.includes("pics.dmm.co.jp")) {
          idNum = "00" + idNum;
        }
      }
      videoURL = `https://${host}/${infix}/${corp[0]}/${corp.substring(
        0,
        3
      )}/${corp}${idNum}/${corp}${idNum}${postfix}.mp4`;
    }

    log("DMM server query:\r\n" + videoURL);

    return await xFetch(videoURL, {
      method: "head",
      headers: {
        "accept-language": "ja-JP",
        cookie: "age_check_done=1;",
        "referrer-policy": "no-referrer",
      },
    })
      .then((resp) => {
        if (resp.ok || resp.status === 200) {
          log("DMM server result video url: " + videoURL);
          return videoURL;
        } else {
          return Promise.reject("DMM server not found movie.");
        }
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryDMMOfficialVideoURL(movieInfo, isUseTitle = false) {
    if (movieInfo.isUncensored)
      return Promise.reject("DMM Official server not support uncensored movie.");

    let notFound = () => Promise.reject("DMM Official server not found movie.");
    //Need ladder
    let keyword = isUseTitle
      ? movieInfo.titleKeyPhrase
      : movieInfo.movieId.replaceAll("-", "%20");
    const host = "https://www.dmm.co.jp";
    let serverURL = `${host}/search/=/searchstr=${keyword}/limit=3/sort=rankprofile/`;
    log("DMM Official query:\r\n" + serverURL);
    const headers = {
      "accept-language": "ja-JP",
      cookie: "age_check_done=1;",
      "referrer-policy": "no-referrer",
    };
    return await xFetch(serverURL, {
      headers: headers,
    })
      .then((resp) => {
        //DMM Official search result, may contain multiple movies.
        let resultMovies = extractDMMMovieItem(resp.responseText);
        if (!resultMovies) return notFound();
        let targetMovieEle = null;

        for (const element of resultMovies) {
          if (element.match(/dlsoft\.dmm\.co\.jp/)) continue;
          if (matchMovieByKeyword(element, movieInfo)) {
            targetMovieEle = element;
            break;
          }
        }

        if (!targetMovieEle) return notFound();
        let avDetailURL = targetMovieEle.match(/tmb.*?href="(\S*?)"/s)?.at(1);
        if (!avDetailURL) return notFound();
        //remove unuse params
        return xFetch(avDetailURL.split("?")[0], {
          headers: headers,
        });
      })
      .then((avDetailResp) => {
        //Different link format, get twice.
        let videoIframeURL = avDetailResp.responseText
          ?.match(/data-video-url="(\S*?)"/s)
          ?.at(1);
        if (!videoIframeURL) {
          //try again
          videoIframeURL = avDetailResp.responseText
            ?.match(/sampleplay\('(\S*?)'\)/s)
            ?.at(1);
        }
        if (!videoIframeURL) return notFound();
        return xFetch(host + videoIframeURL, {
          headers: headers,
        });
      })
      .then((videoFrameResp) => {
        let iframeURL = videoFrameResp.responseText?.match(/src="(\S*?)"/s)?.at(1);
        if (!iframeURL) return notFound();
        return xFetch(iframeURL, {
          headers: headers,
        });
      })
      .then((videoResp) => {
        let videoURL = videoResp.responseText?.match(/args.*?src":"(\S*?)"/s)?.at(1);
        //TODO get different quality
        // bitrate.*?720.*?src":"(.*?)"
        if (videoURL) {
          videoURL = "https:" + videoURL.replaceAll("\\", "");
          log("DMM Official server result video url: " + videoURL);
          return videoURL;
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryMGStageVideoURL(
    movieInfo,
    isUseTitle = false,
    isUseThumbnail = false
  ) {
    if (
      movieInfo.isUncensored ||
      (movieInfo.corpName.includes("プレステージ") === false &&
        movieInfo.corpName.includes("ラグジュTV") === false &&
        movieInfo.corpName.toUpperCase().includes("PRESTIGE") === false &&
        !movieInfo.thumbnailURL?.includes("mgstage.com") &&
        !movieInfo.thumbnailURL?.includes("prestige-av.com"))
    )
      return Promise.reject(
        `MGStage server not support movieId: ${movieInfo.movieId}, CorpName: ${movieInfo.corpName}`
      );
    let notFound = () => Promise.reject("MGStage server not found movie.");

    let keyword = isUseTitle ? movieInfo.titleKeyPhrase : movieInfo.movieId;

    if (isUseThumbnail && movieInfo.thumbnailURL?.includes("image.mgstage.com")) {
      //extract keyword from thumbnail
      //example: https://image.mgstage.com/images/hmp/002aidv/0003/cap_e_1_002aidv-0003.jpg
      //result keyword: 002aidv-0003
      let keywordFromThumbnail = movieInfo.thumbnailURL
        .match(new RegExp(`([\\da-zA-Z]*?${movieInfo.movieId})`, "i"))
        ?.at(1);

      if (keywordFromThumbnail?.toUpperCase() === movieInfo.movieId.toUpperCase()) {
        return Promise.reject("MGStage server : keywordFromThumbnail equals movieId.");
      }
      if (keywordFromThumbnail) {
        keyword = keywordFromThumbnail;
      }
    }

    //Need ladder
    let serverURL = `https://www.mgstage.com/search/cSearch.php?search_word=${keyword}&list_cnt=30`;
    log("MGStage server query:\r\n" + serverURL);
    const headers = {
      "accept-language": "ja-JP",
      cookie: "coc=1;adc=1",
      "referrer-policy": "no-referrer",
    };
    return await xFetch(serverURL, {
      headers: headers,
    })
      .then((resp) => {
        //MGStage search result, may contain multiple movies.
        let resultMovies = extractMGStageMovieItem(resp.responseText);
        if (!resultMovies) return notFound();
        let targetMovieEle = null;
        for (const element of resultMovies) {
          if (matchMovieByKeyword(element, movieInfo)) {
            targetMovieEle = element;
            break;
          }
        }
        if (!targetMovieEle) return notFound();
        let avDetailURL = targetMovieEle
          .match(/<a href="(\S*?)"\s*?class="button_sample">/s)
          ?.at(1);
        if (!avDetailURL) return notFound();
        let pid = avDetailURL.split("/").at(-1);
        return xFetch(
          "https://www.mgstage.com/sampleplayer/sampleRespons.php?pid=" + pid,
          {
            headers: headers,
          }
        );
      })
      .then((avDetailResp) => {
        //MGStage movie detail page result.
        let videoURL = JSON.parse(avDetailResp.response)?.url?.split(".ism")[0] + ".mp4";
        if (videoURL) {
          log("MGStage server result video url: " + videoURL);
          return videoURL;
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryPrestigeVideoURL(movieInfo, isUseTitle = false) {
    if (
      movieInfo.isUncensored ||
      (movieInfo.corpName.includes("プレステージ") === false &&
        movieInfo.corpName.toUpperCase().includes("PRESTIGE") === false &&
        !movieInfo.thumbnailURL?.includes("mgstage.com") &&
        !movieInfo.thumbnailURL?.includes("prestige-av.com"))
    )
      return Promise.reject(
        `Prestige server not support movieId: ${movieInfo.movieId}, CorpName: ${movieInfo.corpName}`
      );
    let notFound = () => Promise.reject("Prestige server not found movie.");
    //Need ladder
    let keyword = isUseTitle ? movieInfo.titleKeyPhrase : movieInfo.movieId;
    let serverURL = `https://www.prestige-av.com/api/search?isEnabledQuery=true&searchText=${keyword}&isEnableAggregation=false&release=false&reservation=false&soldOut=false&from=0&aggregationTermsSize=0&size=20`;
    log("Prestige server query:\r\n" + serverURL);
    return await xFetch(serverURL)
      .then((avDetailResp) => {
        let resultMovies = JSON.parse(avDetailResp.response)?.hits?.hits;
        if (!resultMovies) return notFound();
        for (const movieDetail of resultMovies) {
          let { deliveryItemId, productTitle, productMovie } = movieDetail["_source"];
          if (
            matchMovieByKeyword(deliveryItemId + productTitle, movieInfo) &&
            productMovie?.path
          ) {
            let videoURL = "https://www.prestige-av.com/api/media/" + productMovie.path;
            log("Prestige server result video url: " + videoURL);
            return videoURL;
          }
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryFalenoVideoURL(movieInfo, isUseTitle = false) {
    const falenoCorpNames = new Set([
      "MAGNOLIA",
      "FALENOGROUP",
      "素人CLOVER",
      "VERONICA",
      "BOTAN",
      "ノースキンズ",
      "BONキュンBON",
      "カミパイ",
      "FALENO TUBE",
      "即席シロウト",
      "FALENO",
      "DAHLIA",
    ]);
    if (
      movieInfo.isUncensored ||
      falenoCorpNames.has(movieInfo.corpName.toUpperCase()) === false
    )
      return Promise.reject(
        `Faleno server not support movieId: ${movieInfo.movieId}, CorpName: ${movieInfo.corpName}`
      );
    let notFound = () => Promise.reject("Faleno server not found movie.");
    //Need ladder
    let serverURL;
    if (movieInfo.corpName.toUpperCase() === "FALENO") {
      serverURL = `https://faleno.jp/top/`;
    } else if (movieInfo.corpName.toUpperCase() === "DAHLIA") {
      serverURL = `https://dahlia-av.jp/`;
    } else {
      serverURL = `https://falenogroup.com/`;
      isUseTitle = true;
    }

    let keyword = isUseTitle
      ? movieInfo.titleKeyPhrase
      : movieInfo.movieId.replaceAll("-", "").toLowerCase();

    serverURL += `?s=${keyword}&post_type=作品`;

    log("Faleno server query:\r\n" + serverURL);
    const headers = {
      "accept-language": "ja-JP",
      cookie: "modal=off",
      "referrer-policy": "no-referrer",
    };
    return await xFetch(serverURL, {
      headers: headers,
    })
      .then((resp) => {
        //Faleno search result, may contain multiple movies.
        let resultMovies = extractFalenoMovieItem(resp.responseText);
        if (!resultMovies) return notFound();
        let targetMovieEle = null;
        for (const element of resultMovies) {
          if (matchMovieByKeyword(element, movieInfo)) {
            targetMovieEle = element;
            break;
          }
        }
        if (!targetMovieEle) return notFound();
        let videoURL = targetMovieEle
          .match(/<a class="pop_sample" href="(\S*?)">/s)
          ?.at(1);
        if (videoURL) {
          log("Faleno server result video url: " + videoURL);
          return videoURL;
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryTokyoHotVideoURL(movieInfo) {
    if (
      !movieInfo.isUncensored ||
      (movieInfo.corpName != "東京熱" && movieInfo.corpName.toUpperCase() != "TOKYOHOT")
    )
      return Promise.reject(
        `TokyoHot server not support movieId: ${movieInfo.movieId}, CorpName: ${movieInfo.corpName}`
      );
    let notFound = () => Promise.reject("TokyoHot server not found movie.");
    //Need ladder
    let serverURL = `https://my.cdn.tokyo-hot.com/product/?q=${movieInfo.movieId}`;
    log("TokyoHot server query:\r\n" + serverURL);
    return await xFetch(serverURL)
      .then((resp) => {
        //search result, may contain multiple movies.
        let resultMovies = extractTokyoHotMovieItem(resp.responseText);
        if (!resultMovies) return notFound();
        let targetMovieEle = null;
        for (const element of resultMovies) {
          if (matchMovieByKeyword(element, movieInfo)) {
            targetMovieEle = element;
            break;
          }
        }
        if (!targetMovieEle) return notFound();
        let avDetailURL = targetMovieEle.match(/<a href="(\S*?)" class="rm">/s)?.at(1);
        if (!avDetailURL) return notFound();
        return xFetch("https://my.cdn.tokyo-hot.com/" + avDetailURL);
      })
      .then((resp) => {
        //detail page result
        let videoSource = resp.responseText?.match(/<source.*?src="(\S*?)"/s)?.at(1);
        // if (videoSource && videoSource?.src && videoSource.src != location.href)
        if (videoSource) {
          log("Tokyo server result video url: " + videoSource);
          return videoSource;
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryLocalCacheDB(movieInfo) {
    let videoSource = GM_getValue(movieInfo.movieId, null);
    if (!videoSource) {
      return Promise.reject("Local cache storage not found movie.");
    }
    return await xFetch(videoSource, { method: "head" })
      .then((resp) => {
        if (resp?.status === 200) {
          log(
            "The video source URL in local cache validate successful. Video source: " +
              videoSource
          );
          return Promise.resolve(videoSource);
        }
        //If validation fails,remove the url from the local cache.
        GM_deleteValue(movieInfo.movieId);
        return Promise.reject("The video source URL validate failed. Not found movie.");
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryCF(movieInfo) {
    if (movieInfo.isUncensored)
      return Promise.reject("CF server not support uncensored movie.");

    let notFound = () => Promise.reject("CF server not found movie.");
    let serverURL = `https://jav-trailer.breakwall9987.workers.dev/`;

    return await xFetch(serverURL, {
      data: JSON.stringify({
        movieId: movieInfo.movieId,
        title: movieInfo.title,
        corpName: movieInfo.corpName,
        isVR: movieInfo.isVR,
        isUncensored: movieInfo.isUncensored,
        thumbnailURL: movieInfo.thumbnailURL,
      }),
      method: "POST",
    })
      .then((resp) => {
        if (resp?.status !== 200) return notFound();
        let videoURL = resp.responseText;
        if (!videoURL) return notFound();
        log("CF server result video url: " + videoURL);
        return videoURL;
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function querySupaBase(movieInfo) {
    let notFound = () => Promise.reject("Supabase server not found movie.");
    let serverURL = `https://pfragrqdbelauwiavsme.supabase.co/functions/v1/jav-trailer`;
    return await xFetch(serverURL, {
      data: JSON.stringify({
        movieId: movieInfo.movieId,
        title: movieInfo.title,
        corpName: movieInfo.corpName,
        isVR: movieInfo.isVR,
        isUncensored: movieInfo.isUncensored,
        thumbnailURL: movieInfo.thumbnailURL,
      }),
      method: "POST",
      headers: {
        "x-region": `ap-northeast-${Date.now() % 2 ? "1" : "2"}`,
      },
    })
      .then((resp) => {
        if (resp?.status !== 200) return notFound();
        let videoURL = resp.responseText;
        if (!videoURL) return notFound();
        log("Supabase server result video url: " + videoURL);
        return videoURL;
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  async function queryXCityVideoURL(movieInfo, isUseTitle = false) {
    if (movieInfo.isUncensored)
      return Promise.reject(
        `XCity server not support movieId: ${movieInfo.movieId}, CorpName: ${movieInfo.corpName}`
      );
    let notFound = () => Promise.reject("XCity server not found movie.");

    let keyword = isUseTitle
      ? movieInfo.titleKeyPhrase
      : movieInfo.movieId.replaceAll("-", "");
    //Need ladder
    let serverURL = `https://xcity.jp/result_published/?genre=%2Fresult_published%2F&q=${keyword}&sg=main&num=30`;
    log("XCity server query:\r\n" + serverURL);
    const headers = {
      "accept-language": "ja-JP",
      cookie: "pagenum=30;",
      Referer:
        "https://xcity.jp/result_published/?genre=%2Fresult_published%2F&q=XCITY%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB&sg=main&num=30",
      "Sec-Fetch-Site": "same-origin",
    };
    return await xFetch(serverURL, {
      headers: headers,
    })
      .then((resp) => {
        //XCity search result, may contain multiple movies.
        let resultMovies = resp.responseText?.match(
          /<td>\s*?(<a href="\S*?id=\S*?">.*?<\/a>)\s*?<\/td>/gs
        );
        if (!resultMovies) return notFound();
        let targetMovieEle = null;
        for (const element of resultMovies) {
          const innerText = element.match(/">(.*?)<\/a>/s)?.at(1);
          if (matchMovieByKeyword(innerText, movieInfo)) {
            targetMovieEle = element;
            break;
          }
        }
        if (!targetMovieEle) return notFound();
        let avDetailURL = targetMovieEle.match(/href="(\S*?)"/s)?.at(1);
        if (!avDetailURL) return notFound();
        return xFetch(`https://xcity.jp${avDetailURL}`, {
          headers: headers,
        });
      })
      .then((avDetailResp) => {
        //XCity movie detail page result.
        let videoURL = avDetailResp.responseText
          ?.match(/name="src" value="(\S*?)"/s)
          ?.at(1);
        if (videoURL) {
          log("XCity server result video url: " + videoURL);
          return videoURL;
        }
        return notFound();
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  //#region utility functions

  async function xFetch(url, fetchInit = {}) {
    const defaultFetchInit = { method: "get" };
    const { headers, method, data, referrerPolicy } = {
      ...defaultFetchInit,
      ...fetchInit,
    };
    return new Promise((resolve, reject) => {
      void GM_xmlhttpRequest({
        url,
        method,
        headers,
        referrerPolicy,
        data,
        onerror: reject,
        onload: async (response) => resolve(response),
      });
    });
  }

  function log(msg) {
    if (settings.enable_debug_mode == true) {
      if (typeof msg === "object") {
        console.dir(msg);
      } else {
        console.log(msg);
      }
    }
  }

  function isM3U8(url) {
    return url?.endsWith("m3u8");
  }

  function needCORS(url) {
    return need_cors_domain.has(new URL(url)?.host);
  }

  /**
   * Convert HTTP protocol to HTTPS protocol
   * @param {string} url
   * @returns {string} url
   */
  function convertHTTPToHTTPS(url) {
    if (url?.startsWith("http:")) {
      return url.replace("http:", "https:");
    }
    return url;
  }

  function replaceDMMHost(url) {
    return url?.replace("pv3001.dmm.com", "cc3001.dmm.co.jp");
  }

  function extractDMMMovieItem(text) {
    const matches = text.match(/<ul id="list">(.*?)<\/ul>/s);
    if (!matches) return [];
    return matches.at(1).match(/<li>(.*?)<\/li>/gs);
  }

  function extractMGStageMovieItem(text) {
    const matches = text.match(/<div class="rank_list">\s*<ul>(.*?)<\/ul>/s);
    if (!matches) return [];
    return matches.at(1).match(/<li>(.*?)<\/li>/gs);
  }

  function extractTokyoHotMovieItem(text) {
    return text.match(/<li class="detail">(.*?)<\/li>/gs);
  }

  function extractAVFantasyMovieItem(text) {
    return text.match(/<div class="single-slider-product.*?>(.*?)<\/div>\s*?<\/div>/gs);
  }

  function extractFalenoMovieItem(text) {
    const matches = text.match(
      /<div class="box_kanren01">.*?<ul class="clearfix">(.*?)<\/ul>/s
    );
    if (!matches) return [];
    return matches.at(1).match(/<li>(.*?)<\/li>/gs);
  }

  function matchMovieByKeyword(str, movieInfo) {
    const st1 = str.toLowerCase();
    const titleKeyPhrase = movieInfo.titleKeyPhrase.toLowerCase();
    const movieId = movieInfo.movieId.toLowerCase();
    const title = movieInfo.title.toLowerCase();
    const regex = new RegExp(`${movieId}|${movieId.replaceAll("-", "")}`);
    if (regex.test(st1) || st1.indexOf(title) != -1) {
      return true;
    }
    if (jaroWinklerDistance(title, st1) >= 0.86) {
      return true;
    }
    if (st1.indexOf(titleKeyPhrase) != -1) {
      return true;
    }
    if (findDifference(titleKeyPhrase, removeWhitespace(st1)).length < 4) {
      return true;
    }
    return false;
  }

  function getKeyPhrase(str, splitChar = " ") {
    return str
      .split(splitChar)
      .reduce((pre, cur) => (cur?.length > pre.length ? cur : pre), "");
  }

  function findDifference(str1, str2) {
    const len = Math.min(str1.length, str2.length);
    const result = [];
    for (let i = 0; i < len; i++) {
      if (str1[i] !== str2[i]) {
        result.push(str1[i]);
        str1 = replaceChar(str1, i, str2[i]);
      }
    }
    return result;
  }

  function replaceChar(str, index, newChar) {
    const leftPart = str.slice(0, index);
    const rightPart = str.slice(index + 1);
    return leftPart + newChar + rightPart;
  }

  function removeWhitespace(str) {
    return str.replace(/\s/g, "");
  }

  //Jaro-Winkler算法是一种专门用于计算短字符串相似度的算法,对于拼写错误更加容忍
  //返回值在0到1之间,值越大表示两个字符串越相似。
  function jaroWinklerDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;

    if (m === 0 || n === 0) {
      return 0;
    }

    const maxDistance = Math.floor(Math.max(m, n) / 2) - 1;
    let match = 0;
    const str1Matched = Array(m).fill(false);
    const str2Matched = Array(n).fill(false);

    // 计算匹配字符数
    for (let i = 0; i < m; i++) {
      const start = Math.max(0, i - maxDistance);
      const end = Math.min(i + maxDistance + 1, n);

      for (let j = start; j < end; j++) {
        if (str2Matched[j] === false && str1[i] === str2[j]) {
          str1Matched[i] = true;
          str2Matched[j] = true;
          match++;
          break;
        }
      }
    }

    if (match === 0) {
      return 0;
    }

    // 计算字符串的传输
    let t = 0;
    let point = 0;
    for (let i = 0; i < m; i++) {
      if (str1Matched[i]) {
        while (str2Matched[point] === false) {
          point++;
        }
        if (str1[i] !== str2[point]) {
          t++;
        }
        point++;
      }
    }

    t /= 2;

    // 计算Jaro-Winkler距离
    const jaroDistance = (match / m + match / n + (match - t) / match) / 3;

    // 如果两个字符串前缀相同,增加前缀分数
    let prefixLength = 0;
    for (let i = 0; i < Math.min(m, n); i++) {
      if (str1[i] === str2[i]) {
        prefixLength++;
      } else {
        break;
      }
    }
    prefixLength = Math.min(4, prefixLength);

    const jaro_winkler = jaroDistance + 0.1 * prefixLength * (1 - jaroDistance);

    return jaro_winkler;
  }
  //#endregion
})();

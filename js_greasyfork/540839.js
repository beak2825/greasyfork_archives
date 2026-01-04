// ==UserScript==
// @name         agsvpt_playlet_fill
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  AGSVPT短剧WEB-DL自动填充，智能识别分辨率/制作组，适配旧站/新站，短剧/WEB-DL/AAC/匿名/标签自动勾选
// @match        https://old.agsvpt.cn/upload.php
// @match        https://www.agsvpt.com/upload.php
// @match        https://new.agsvpt.cn/upload.php
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540839/agsvpt_playlet_fill.user.js
// @updateURL https://update.greasyfork.org/scripts/540839/agsvpt_playlet_fill.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (
    (location.hostname !== "old.agsvpt.cn" && location.hostname !== "www.agsvpt.com" && location.hostname !== "new.agsvpt.cn") ||
    !/upload\.php/.test(location.pathname)
  ) return;

  const defaultData = {
    name: "",
    small_descr: "",
    url: "",
    pt_gen: "",
    descr: "",
    technical_info: "",
    price: 0,
    type: "419", // 短剧
    "medium_sel[4]": "10", // WEB-DL
    "codec_sel[4]": "1", // H.264/AVC
    "audiocodec_sel[4]": "6", // AAC
    "standard_sel[4]": "", // 智能推断
    "team_sel[4]": "",     // 智能推断
    "hr[4]": "0",
    "tags[4][]": [],
    pos_state: "normal",
    pos_state_until: "",
    uplver: true
  };

  const keyMap = {
    name: "name",
    small_descr: "small_descr",
    url: "url",
    descr: "descr",
    technical_info: "technical_info",
    price: "price",
    type: "type",
    medium_sel: "medium_sel[4]",
    codec_sel: "codec_sel[4]",
    audiocodec_sel: "audiocodec_sel[4]",
    standard_sel: "standard_sel[4]",
    team_sel: "team_sel[4]",
    hr: "hr[4]",
    tags: "tags[4][]",
    pos_state: "pos_state",
    pos_state_until: "pos_state_until",
    uplver: "uplver"
  };

  // 默认标签
  const defaultTags = ["3", "5", "6", "19", "34"]; // 官方、国语、中字、完结、冰种
  const combineExtraTags = ["1", "51"]; // 禁转、合并

  function parseHashData() {
    const hash = location.hash;
    if (!hash.startsWith("#separator#")) return null;
    const base64 = hash.replace("#separator#", "");
    let decoded = "";
    try {
      decoded = decodeURIComponent(Array.prototype.map.call(atob(base64), c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
    } catch (e) {
      return null;
    }
    const arr = decoded.split("#linkstr#").filter(Boolean);
    const data = {};
    for (let i = 0; i < arr.length - 1; i += 2) {
      let key = arr[i].trim();
      let value = arr[i + 1].trim();
      try { value = decodeURIComponent(value); } catch(e){}
      data[key] = value;
    }
    return data;
  }

  function multiFillTechnicalInfo(val, times = 8, interval = 800) {
    let count = 0;
    let timer = setInterval(() => {
      var techFields = document.querySelectorAll('textarea[name="technical_info"]');
      techFields.forEach(function(field) {
        if (field.offsetParent !== null) {
          field.value = val;
        }
      });
      count++;
      if (count >= times) clearInterval(timer);
    }, interval);
  }

  function get_mediainfo_picture_from_descr(str) {
    let mediainfo = '';
    let pic_info = '';
    let descr = str;
    const quoteMatch = str.match(/\[quote\]([\s\S]*?)\[\/quote\]/);
    if (quoteMatch) {
      mediainfo = quoteMatch[1].trim();
      descr = descr.replace(quoteMatch[0], '');
    }
    const imgMatches = str.match(/(\[img\][^\[]+\[\/img\])/g);
    if (imgMatches) {
      pic_info = imgMatches.join('\n');
      descr = descr.replace(pic_info, '');
    }
    return {
      descr: descr.trim(),
      pic_info: pic_info.trim(),
      mediainfo: mediainfo.trim()
    };
  }

  function removeQuoteBlock(str) {
    return str.replace(/\[quote\][\s\S]*?\[\/quote\]/gi, '').trim();
  }

  // 智能推断分辨率
  function guessStandardFromName(name) {
    if (!name) return "";
    name = name.toLowerCase();
    if (name.includes("4320")) return "6";
    if (name.includes("2160") || name.includes("4k")) return "5";
    if (name.includes("1080")) return "1";
    if (name.includes("720")) return "3";
    if (name.includes("480")) return "4";
    return "";
  }

  // 智能推断制作组
  function guessTeamFromName(name) {
    if (!name) return "";
    name = name.toUpperCase();
    if (name.includes("AGSVWEB")) return "21";
    if (name.includes("AGSVPT")) return "6";
    if (name.includes("AGSVMUS")) return "20";
    if (name.includes("GODDRAMAS")) return "23";
    if (name.includes("RL")) return "31";
    if (name.includes("BEITAI")) return "30";
    if (name.includes("DYZ")) return "28";
    if (name.includes("HARES")) return "29";
    if (name.includes("CATEDU")) return "24";
    if (name.includes("PACK")) return "16";
    return "";
  }

  function fillForm() {
    var $ = window.jQuery;
    if (!$) return;

    let data = { ...defaultData };
    const hashData = parseHashData();
    if (hashData) {
      for (const k in hashData) {
        if (keyMap[k]) {
          data[keyMap[k]] = hashData[k];
        } else if (keyMap[k.replace(/\[4\]$/, '')]) {
          data[keyMap[k.replace(/\[4\]$/, '')]] = hashData[k];
        }
      }
    }

    // 五个下拉框 value 兼容映射
    const mediumMap = {
      "0": "0", "11": "11", "1": "1", "3": "3", "7": "7", "10": "10", "5": "5", "2": "2", "8": "8", "12": "12", "13": "13",
      "bluray": "1", "uhd": "11", "remux": "3", "encode": "7", "webdl": "10", "hdtv": "5", "dvd": "2", "cd": "8", "track": "12", "other": "13"
    };
    if (data["medium_sel[4]"]) data["medium_sel[4]"] = mediumMap[(data["medium_sel[4]"]+"").toLowerCase()] || "10";

    const codecMap = {
      "0": "0", "1": "1", "6": "6", "2": "2", "4": "4", "12": "12", "5": "5",
      "h264": "1", "avc": "1", "h265": "6", "hevc": "6", "vc1": "2", "mpeg2": "4", "av1": "12", "other": "5"
    };
    if (data["codec_sel[4]"]) data["codec_sel[4]"] = codecMap[(data["codec_sel[4]"]+"").toLowerCase()] || "1";

    const audiocodecMap = {
      "0": "0", "1": "1", "4": "4", "15": "15", "16": "16", "3": "3", "8": "8", "18": "18", "9": "9", "10": "10", "11": "11", "19": "19", "17": "17", "2": "2", "6": "6", "20": "20", "7": "7",
      "flac": "1", "mp3": "4", "wav": "15", "m4a": "16", "dts": "3", "dtsma": "8", "dtsx": "18", "truehd": "9", "lpcm": "10", "ac3": "11", "dd": "11", "eac3": "19", "ddp": "19", "truehdatmos": "17", "ape": "2", "aac": "6", "alac": "20", "other": "7"
    };
    if (data["audiocodec_sel[4]"]) data["audiocodec_sel[4]"] = audiocodecMap[(data["audiocodec_sel[4]"]+"").toLowerCase()] || "6";

    const standardMap = {
      "0": "0", "4": "4", "3": "3", "2": "3", "1": "1", "5": "5", "6": "6", "8": "8", "7": "8",
      "2160": "5", "4320": "6", "1080": "1", "720": "3", "480": "4", "other": "8",
      "720p": "3", "1080p": "1", "2160p": "5", "4320p": "6", "480p": "4"
    };
    if (data["standard_sel[4]"]) data["standard_sel[4]"] = standardMap[(data["standard_sel[4]"]+"").toLowerCase()] || "";

    const teamMap = {
      "0": "0", "6": "6", "21": "21", "20": "20", "23": "23", "31": "31", "30": "30", "28": "28", "29": "29", "24": "24", "16": "16", "22": "22",
      "agsvpt": "6", "agsweb": "21", "agsvmus": "20", "goddramas": "23", "rl": "31", "beitai": "30", "dyz": "28", "hares": "29", "catedu": "24", "pack": "16", "other": "22",
      "AGSVWEB": "21", "AGSVPT": "6"
    };
    if (data["team_sel[4]"]) data["team_sel[4]"] = teamMap[(data["team_sel[4]"]+"").toLowerCase()] || "";

    // 智能推断分辨率和制作组（仅当为空或为默认值时）
    if (!data["standard_sel[4]"] || data["standard_sel[4]"] === "1") {
      const std = guessStandardFromName(data.name);
      if (std) data["standard_sel[4]"] = std;
    }
    if (!data["team_sel[4]"] || data["team_sel[4]"] === "6") {
      const team = guessTeamFromName(data.name);
      if (team) data["team_sel[4]"] = team;
    }

    // 挂到 window，方便调试
    window._agsvpt_fill_data = data;

    document.getElementById('descr').value = removeQuoteBlock(data.descr || '');

    let mediainfo = data.technical_info;
    if (!mediainfo) {
      const info = get_mediainfo_picture_from_descr(data.descr || '');
      mediainfo = info.mediainfo;
    }
    multiFillTechnicalInfo(mediainfo, 8, 800);

    if (!data.url || data.url === "dburl" || data.url === "http://") data.url = "";
    data.uplver = true;

    // 标签处理
    let tags = [...defaultTags];
    let combineFlag = false;
    if (data.name && data.name.toUpperCase().includes("COMBINE@AGSVWEB")) {
      tags = tags.concat(combineExtraTags);
      combineFlag = true;
    }
    data["tags[4][]"] = tags;

    window.jQuery("#name").val(data.name);
    window.jQuery("[name='small_descr']").val(data.small_descr);
    window.jQuery("[name='url']").val(data.url);
    window.jQuery("[name='pt_gen']").val(data.pt_gen);
    window.jQuery("[name='price']").val(data.price);

    window.jQuery("#browsecat").val(data.type).trigger("change");
    window.jQuery("#specialcat").val("0");

    // 严格顺序依次赋值五个 select
    function setSelectValue(name, value, cb) {
      let count = 0;
      let timer = setInterval(() => {
        let sel = document.querySelector(`[name='${name}']`);
        if (sel && sel.querySelector(`option[value='${value}']`)) {
          sel.value = value;
          sel.dispatchEvent(new Event('input', { bubbles: true }));
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          window.jQuery(sel).val(value).trigger("change");
          // 兜底：延迟再赋值一次
          setTimeout(() => {
            sel.value = value;
            sel.dispatchEvent(new Event('input', { bubbles: true }));
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            window.jQuery(sel).val(value).trigger("change");
            if (cb) setTimeout(cb, 200);
          }, 300);
          clearInterval(timer);
        }
        if (++count > 30) clearInterval(timer);
      }, 100);
    }

    setTimeout(() => {
      setSelectValue('medium_sel[4]', data["medium_sel[4]"], () => {
        setSelectValue('codec_sel[4]', data["codec_sel[4]"], () => {
          setSelectValue('audiocodec_sel[4]', data["audiocodec_sel[4]"], () => {
            setSelectValue('standard_sel[4]', data["standard_sel[4]"], () => {
              setSelectValue('team_sel[4]', data["team_sel[4]"], () => {
                window.jQuery(`[name='hr[4]'][value='${String(data["hr[4]"])}']`).prop("checked", true);
              });
            });
          });
        });
      });
    }, 500);

    window.jQuery("[name='tags[4][]']").prop("checked", false);
    data["tags[4][]"].forEach(function (val) {
      window.jQuery("[name='tags[4][]'][value='" + val + "']").prop("checked", true);
    });

    window.jQuery("[name='pos_state']").val(data.pos_state);
    window.jQuery("[name='pos_state_until']").val(data.pos_state_until);
    window.jQuery("[name='uplver']").prop("checked", true);

    const nameBak = data.name;
    const fileInput = document.querySelector('input[type="file"][name="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        setTimeout(function () {
          window.jQuery("#name").val(nameBak);
        }, 500);
      });
    }
  }

  function waitReady() {
    if (
      window.jQuery &&
      document.querySelector("#compose") &&
      window.jQuery("#compose").is(":visible")
    ) {
      fillForm();
    } else {
      setTimeout(waitReady, 300);
    }
  }

  waitReady();
})();
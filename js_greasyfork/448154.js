console.log("=======FROM SWD WITH CODE=======")
const version = '0.2.8.5';
const env = 'dev';

// ==UserScript==
// @name         Smarter Base.vn - DEV
// @description  Make base.vn smarter
// @namespace    http://tampermonkey.net/
// @version      0.2.8.5
// @author       duclh - SWD
// @include      /https:\/\/(.*).base.vn/(.*)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=base.vn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448154/Smarter%20Basevn%20-%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/448154/Smarter%20Basevn%20-%20DEV.meta.js
// ==/UserScript==

let currentUrl = window.location.href;
let CONFIG = {
  CURRENT_SELECT_NOTI_SERVICE: "",
  SERVICE: {
    "all": {
      BG_COLOR: "#ccc7c7"
    },
    "+5": {
      BG_COLOR: "rgb(66 184 20 / 80%)"
    },
    "wework": {
      TITLE_SELECTOR: "#js-task-display > div.main-body > div.section.js-task-main > div.task-main > div.edit-box.compact.edit-task-name > div.edit-display > h1",
      BG_COLOR: "rgb(88 159 201 / 44%)",
      LINK_SELECTOR: ".tasklist .tasks div"
    },
    "meeting": {
      TITLE_SELECTOR: "#js-meeting-cover > div.main > div > div.text > div.name > span",
      BG_COLOR: "#ed6334b0"
    },
    "request": {
      TITLE_SELECTOR: "#obj-main > h1",
      BG_COLOR: "rgb(66 184 20 / 57%)"
    },
    "workflow": {
      TITLE_SELECTOR: "",
      BG_COLOR: "rgb(66 152 244 / 67%)"
    },
    "office": {
      TITLE_SELECTOR: "",
      BG_COLOR: "rgb(66 184 20 / 80%)"
    },
    "hiring": {
      TITLE_SELECTOR: "",
      BG_COLOR: "rgb(88 159 201 / 40%)"
    },
  },
  HIDE_NOTI: [],
  NOTI: {
    LOAD_MORE_NUMBER: 2,
    OPEN_NOTI_SELECTOR: {
      "wework": "#navigator > div.header > div.icon",
      "meeting": "#base-panel > div > div.item.url.item-followup.item-notis",
      "request": "#base-panel-hoz > div.items > div.item.item-notis",
      "workflow": "#navigator > div.icons.clear-fix > div:nth-child(3)",
      "office": "#header > div > div.header-side > div.header-item.item-notis.url",
      "inside": "#header > div > div.header-side > div.header-item.item-notis.-std.url > div.icon",
      "hiring": "",
      "booking": ".base-notis"
    },
    LOAD_MORE_SELECTOR: ".-more"
  },
  THEME: {
    MASK_SELECTOR: "#apdialogs"
  },
  ENABLE_SERVICES: {
    "disableAll": false,
    "smarterTitle": false,
    "smarterUrl": false,

    "smarterNoti": false,
    "smarterNoti_faster_like_it_gone": false,
    "smarterNoti_hide_noti": false,

    "wwHyperlink": false,
    "smarterTaskTime": false,

    "bonkSound": false,
    "bonkSoundUrl": ""
  }
};
let THEME_CONFIG = {
  TIP_INIT: false
};
let notiCountIntial = {
  "all": 0,
  "wework": 0,
  "meeting": 0,
  "request": 0,
  "workflow": 0,
  "office": 0,
  "hiring": 0
};
let notiCount = { ...notiCountIntial };
let notiOpened = false;
let firstTimeOpenNoti = true;

let noti_grid_1 = document.createElement("div");
noti_grid_1.style.display = "inline-block";
noti_grid_1.style.borderRight = "2px ridge grey";
noti_grid_1.style.paddingRight = "5px";

let noti_grid_2 = document.createElement("div");
noti_grid_2.style.display = "inline-block";
noti_grid_2.style.marginLeft = "5px";

const main_styling = () => {
  // let loadingDiv = document.querySelector('#base-xs');
  // let noNeedLoading = setInterval(() => {
  //   if (loadingDiv.style.display === '') loadingDiv.style.display = "none";
  //   clearInterval(noNeedLoading);
  // }, 50)

};

const main_makeWwCanHyperlink = () => {
  let taskUrl = "https://wework.base.vn" + window.location.pathname + "?task=";
  let links = document.querySelectorAll(CONFIG.SERVICE.wework.LINK_SELECTOR);
  if (!THEME_CONFIG.TIP_INIT) {
    wwHyperlink_tips();
    THEME_CONFIG.TIP_INIT = true;
  }

  if (links.length) {
    for (let link of links) {
      let linkDiv = link.querySelector(".mn .url");
      if (!linkDiv) continue;

      let isDone = link.querySelector(".check.url") && link.querySelector(".check.url").innerHTML.includes("-done");
      let taskId = linkDiv.getAttribute("data-url");
      if (!taskId || taskId === "") continue;
      taskId = taskId.split("/")[1];

      let newATag = linkDiv.outerHTML;
      newATag = newATag.replace("</span>", "</a>");
      newATag = newATag.replace("<span", `<a href="${taskUrl + taskId}" onClick="return false;" style="font-weight: 400; ${!isDone && "color: #111"}"  `);
      linkDiv.outerHTML = newATag;
    }
  };

  let subtaskLinks = document.querySelectorAll('.etask-detail'); //Lười viết config quá
  if (subtaskLinks.length) {
    for (let subtask of subtaskLinks) {
      let isDone = subtask.getAttribute("data-status") === '1';;

      let linkDiv = subtask.querySelector(".etask-name");
      let taskId = subtask.getAttribute("data-id");

      let newATag = linkDiv.outerHTML;
      newATag = newATag.replace("</div>", "</a>");
      newATag = newATag.replace("<div", `<a href="${taskUrl + taskId}"  onclick='Base.task._showID("${taskId}", "", "undefined");return false;' style="font-weight: 400; ${!isDone && "color: #111"}"  `);
      linkDiv.outerHTML = newATag;
    };
  };

}

const wwHyperlink_tips = () => {
  let clickedTip = true;
  let iconTip = document.createElement("img");
  iconTip.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/551/551080.png");
  iconTip.style.width = '20px';
  iconTip.style.paddingBottom = '10px';
  iconTip.style.paddingLeft = '30px';

  let tipTextDiv = document.createElement("span");
  tipTextDiv.innerText = "Mẹo vặt cuộc sống: Link task giờ đây có thể \nbấm chuột phải (mở menu) \nhoặc chuột giữa (để nhảy tab mới)";
  tipTextDiv.style.display = 'none'
  tipTextDiv.style.position = 'absolute';
  tipTextDiv.style.backgroundColor = '#71e1ff';
  tipTextDiv.style.zIndex = '9009';


  iconTip.onclick = () => {
    tipTextDiv.style.display = clickedTip ? 'block' : 'none';
    clickedTip = !clickedTip;
  }
  if (document.querySelector('#header > div.title > div.name')) document.querySelector('#header > div.title > div.name').appendChild(iconTip);
  if (document.querySelector('#header > div.title > div.name')) document.querySelector('#header > div.title > div.name').appendChild(tipTextDiv);
}

const main_smarterNoti = (options) => {
  addAction_onClickNoti(options);
  utils_stylingFilterBar();

  const all = () => utils_showNotiByService("all");
  const ww = () => utils_showNotiByService("wework");
  const rq = () => utils_showNotiByService("request");
  const wf = () => utils_showNotiByService("workflow");
  const off = () => utils_showNotiByService("office");
  const hir = () => utils_showNotiByService("hiring");
  const mt = () => utils_showNotiByService("meeting");

  const plus5 = () => utils_loadMoreNoti({ num: 5, isFirstTime: false });
  const selectSound = () => utils_loadMoreNoti();

  const grid_1_items = [
    ["all", all],
    ["wework", ww],
    ["request", rq],
    ["workflow", wf],
    ["office", off],
    ["hiring", hir],
    ["meeting", mt],
  ];

  const grid_2_items = [
    ["+5", plus5],
  ];

  let titleDiv = document.querySelector("#base-notis > div.list.list-notis > div.-title");
  if (!titleDiv) return;
  titleDiv.innerHTML = "";
  titleDiv.appendChild(noti_grid_1);
  titleDiv.appendChild(noti_grid_2);

  for (let service of grid_1_items) {
    let filterServiceButton = document.createElement("button");
    filterServiceButton.classList.add("filter-service");
    filterServiceButton.classList.add(`s-${service[0]}`);
    filterServiceButton.innerText = `0 - ${service[0]}`;
    filterServiceButton.onclick = service[1];
    filterServiceButton.style.backgroundColor = CONFIG.SERVICE[service[0]].BG_COLOR;
    utils_stylingFilterButton(filterServiceButton);
    if (titleDiv) { noti_grid_1.appendChild(filterServiceButton); }
  }

  for (let service_2 of grid_2_items) {
    let btn = document.createElement("button");
    btn.innerText = `+5 trang`;
    btn.classList.add("load-more-noti");
    btn.onclick = service_2[1];
    btn.style.backgroundColor = CONFIG.SERVICE[service_2[0]].BG_COLOR;
    utils_stylingFilterButton(btn);
    if (titleDiv) noti_grid_2.appendChild(btn);
  }

  let soundDivDiv = document.createElement("div");
  soundDivDiv.innerHTML = "<label>Âm thanh thông báo</label>";
  let soundDiv = noti_genSelectSoundDiv();
  soundDivDiv.appendChild(soundDiv);
  soundDivDiv.style.display = "inline";
  soundDivDiv.style.fontSize = "16px";
  soundDivDiv.style.marginLeft = "5px";
  noti_grid_2.appendChild(soundDivDiv);

  let checkHasNoti = setInterval(() => { // Count noti
    if (document.querySelectorAll(".notis").length) {
      clearInterval(checkHasNoti);
      noti_recountNoti();
    }
  }, 200);

};

const noti_selectNotiSound = () => {

}

const noti_genSelectSoundDiv = () => {
  let notiSoundList = localStorage.getItem("noti_sound_list");
  if (!notiSoundList || !notiSoundList.length) return;
  notiSoundList = JSON.parse(notiSoundList);
  let userInfo = JSON.parse(localStorage.getItem('ajs_user_traits'));
  let sb_config = JSON.parse(localStorage.getItem('sb_config'));
  let email = userInfo.email;
  let userNotiSoundKey = sb_config.noti_sound_key;
  /*
  <select name="cars" id="cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
  </select>
  */

  // <label for="noti_sound_list">Âm thanh thông báo</label>
  let selectDiv = document.createElement("select");
  selectDiv.name = "noti_sound_list";
  selectDiv.id = "noti_sound_list";
  selectDiv.onchange = (soundKey) => {
    noti_onSelectSound(email, soundKey.target.value)
  }
  // let selectDiv = `<select name="noti_sound_list" id="noti_sound_list" selected="${userNotiSound}">  `
  for (let sound of notiSoundList) {
    let key = sound[0];
    let value = sound[1];
    let optionDiv = document.createElement("option");
    optionDiv.value = key;
    optionDiv.innerText = value;
    optionDiv.selected = key === userNotiSoundKey ? "selected" : "";
    // optionDiv.addEventListener("select", () => { noti_onSelectSound(username, key) });

    selectDiv.appendChild(optionDiv);
    // let optionDiv = `<option value="${key}" onselect={noti_onSelectSound("${username}","${key}")}>${value}</option>`;
  }
  return selectDiv;
}

const noti_onSelectSound = (email, soundKey) => {
  let notiSoundObj = JSON.parse(localStorage.getItem("noti_sound_obj"));
  var audio = new Audio(notiSoundObj[soundKey].link);
  audio.play();
  // Write local
  let sb_config = JSON.parse(localStorage.getItem('sb_config'));
  sb_config.noti_sound_key = soundKey;
  localStorage.setItem("sb_config", JSON.stringify(sb_config))
  //Write API
  callAPI("changeNotiSound",
    {
      email,
      config: {
        noti_sound_key:
          soundKey
      }
    })
}

const noti_changeSound = () => {
  let sb_config = JSON.parse(localStorage.getItem('sb_config'));

  let notiSoundObj = localStorage.getItem("noti_sound_obj");
  if (!notiSoundObj || !notiSoundObj.length) return;
  notiSoundObj = JSON.parse(notiSoundObj);
  let userSoundKey = sb_config["noti_sound_key"];
  if (!userSoundKey) return;

  let link = notiSoundObj[userSoundKey]["link"];

  if (link === "default") return;
  if (document.querySelector("#audios")) {
    if (link === "silent") {
      document.querySelector('#audios').outerHTML = "";
    } else {
      document.querySelector('#audio3').setAttribute("src", link);
    }

  }
}
noti_changeSound();


const main_smarterTitle = () => {
  let oldTitle = "";
  let hostName = utils_getCurrentService();

  let hasServiceCfg = CONFIG.SERVICE[hostName];
  if (!hasServiceCfg) return;

  let newTitle = document.querySelector(CONFIG.SERVICE[hostName].TITLE_SELECTOR);
  if (newTitle && newTitle !== oldTitle) {
    oldTitle = newTitle;
    document.title = newTitle.innerHTML;
  }
}


const main_smarterUrl = () => {
  let hostName = utils_getCurrentService();
  let hasServiceCfg = CONFIG.SERVICE[hostName];
  if (!hasServiceCfg) return;

  let taskId = document.querySelector("#js-task-display").getAttribute("data-id");
  let title = document.querySelector(CONFIG.SERVICE[hostName].TITLE_SELECTOR);
  title = title.innerHTML.replace(/ /g, '-');
  title = utils_removeVietnameseTones(title);

  let checkHasSearch = setInterval(() => {
    if (window.location.search && window.location.search.includes("task=")) {
      clearInterval(checkHasSearch);
      let newUrl = "/?n=" + title + "&task=" + taskId
      // +  window.location.pathname.replace("/");
      history.replaceState(null, '', newUrl);
    };
  }, 200);

}

const utils_removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  return str;
}

const utils_getCurrentService = () => {
  let hostName = window.location.hostname;
  hostName = hostName.split(".")[0];
  return hostName;
}

const utils_showNotiByService = (selectedService, filter = {}) => {
  CONFIG.CURRENT_SELECT_NOTI_SERVICE = selectedService;
  let notis = document.getElementsByClassName("notis");
  for (let noti of notis) {
    noti.classList.remove("hidden");
    if (selectedService === "all") continue;
    let currentService = utils_getCurrentService();
    if (!noti) continue;
    let notiService = currentService;
    let url = noti.getAttributeNode("data-url").value;
    if (url.includes("https")) {
      url = url.split(".");
      notiService = url[0].replace("https://", "")
    }
    if (
      (notiService !== selectedService)
      || noti.getElementsByClassName("-title")[0].innerHTML.includes("sinh nhật")
    ) {
      noti = noti.classList.add("hidden");
    };
  }
}
const addAction_onClickNoti = (options) => {
  let currentService = utils_getCurrentService();
  if (!CONFIG.NOTI.OPEN_NOTI_SELECTOR[currentService]) return;
  let openNotiButton = document.querySelector(CONFIG.NOTI.OPEN_NOTI_SELECTOR[currentService]);

  let intervalCheckNotiAppear = setInterval(() => {
    if (openNotiButton) {
      openNotiButton.addEventListener('click', () => {

        if (options.smarterNoti_faster_like_it_gone && currentService !== "inside") {
          document.querySelector("#base-notis").style.display = notiOpened ? "none" : "block";
          notiOpened = !notiOpened;
        }

        if (firstTimeOpenNoti) {
          // setTimeout(() => { noti_recountNoti(); }, 500);
          let checkHasNoti = setInterval(() => {
            if (document.querySelectorAll(".notis").length) {
              clearInterval(checkHasNoti);
              noti_recountNoti();
            }
          }, 200);
          firstTimeOpenNoti = false;
          document.querySelector("#base-notis > div.full-mask").addEventListener("click", () => notiOpened = false);
        }



      });

      clearInterval(intervalCheckNotiAppear);
    }
  }, 200);
}

const noti_openNow = () => {
  let openStatus = notiOpened;
  let currentService = utils_getCurrentService();
  if (!CONFIG.NOTI.OPEN_NOTI_SELECTOR[currentService]) return;
  let openNotiButton = document.querySelector(CONFIG.NOTI.OPEN_NOTI_SELECTOR[currentService]);
  openNotiButton.onclick = 'Base.toggle("notis");';

};
// noti_openNow();

const noti_recountNoti = (reclickService = false) => {
  notiCount = { ...notiCountIntial };
  let notis = document.getElementsByClassName("notis");
  let currentService = utils_getCurrentService();
  for (let noti of notis) {
    notiCount['all'] += 1;
    let notiService = currentService;
    let url = noti.getAttributeNode("data-url").value;
    if (url.includes("https")) {
      url = url.split(".");
      notiService = url[0].replace("https://", "")
    };
    if (!CONFIG.SERVICE[notiService]) continue;
    notiCount[notiService] += 1;
  };
  utils_rewriteNotiCountToButton();
}

const utils_rewriteNotiCountToButton = () => {
  let openNotiButton = document.querySelectorAll(".filter-service");
  for (let btn of openNotiButton) {
    let serviceName = btn.classList[1];
    if (serviceName) serviceName = serviceName.split('s-')[1];
    let serviceNotiCount = notiCount[serviceName] || 0;
    btn.innerText = `${serviceNotiCount} - ${serviceName}`;
    if (serviceNotiCount === 0) btn.setAttribute("disabled", true)
    else btn.removeAttribute("disabled");
  }
}

const utils_stylingFilterBar = () => {
  let titleNoti = document.querySelector(".-title");
  let listNoti = document.querySelector(".list-notis");
  if (listNoti) listNoti.style.width = "60%";
  if (titleNoti) {
    titleNoti.style.width = "300%";
    titleNoti.style.height = "55px";
    titleNoti.style.background = "white";
    document.querySelector("#notis-items-w").style.top = "55pxpx";
  }
}

const utils_stylingFilterButton = (filterServiceButton) => {
  filterServiceButton.style.borderRadius = "5px";
  filterServiceButton.style.marginRight = "3px";
  filterServiceButton.style.marginLeft = "3px";
  filterServiceButton.style.paddingRight = "3px";
  filterServiceButton.style.paddingLeft = "3px";
  filterServiceButton.style.fontSize = "16px";
}

const utils_loadMoreNoti = ({ num = 10, isFirstTime = false }) => {
  let loadMoreButton = document.querySelector(CONFIG.NOTI.LOAD_MORE_SELECTOR);
  utils_toogleElemByClass({ classname: ".load-more-noti", isDisable: true });
  let count = 0;
  let intervalClickLoadMore = setInterval(() => {
    if (count === num) {
      clearInterval(intervalClickLoadMore);
      setTimeout(() => { noti_recountNoti(); }, 500);
      utils_toogleElemByClass({ classname: ".load-more-noti", isDisable: false });

    }
    loadMoreButton.click();
    count += 1;
  }, 200);

}

const utils_toogleElemByClass = ({ classname = "", isDisable = false }) => {
  let divs = document.querySelectorAll(classname);
  if (isDisable) divs.forEach(e => e.setAttribute("disabled", true));
  else divs.forEach(e => e.removeAttribute("disabled"));
}


const utils_getUserConfig = async () => {
  try {
    const pingUrl = 'https://script.google.com/macros/s/AKfycbwq3EpWpIY4zpebj3svXRsenyr_2kSTZvNuArOj5plyQE0Mp4EXVoGa4v4fmhwU4QkAkg/exec';
    let userInfo = JSON.parse(localStorage.getItem('ajs_user_traits'));
    let data = {
      route: "getUserConfig",
      name: userInfo.name,
      email: userInfo.email,
      version,
      env
    };

    let cfg = await fetch(pingUrl, {
      method: 'POST',
      redirect: "follow",
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
    cfg = await cfg.json();

    let notiSoundArr = cfg.data.notiSoundList;

    let notiSoundObj = {};
    notiSoundArr.forEach(e => {
      notiSoundObj[e[0]] = {
        value: e[1],
        link: e[2]
      }
    });

    localStorage.setItem("noti_sound_list", JSON.stringify(notiSoundArr));
    localStorage.setItem("noti_sound_obj", JSON.stringify(notiSoundObj));
    localStorage.setItem("sb_config", JSON.stringify(cfg.data.config));

    console.log("🚀 Live config", cfg);
    return cfg;
  } catch (error) {
    sendErrorLog(error)
  }
}


const config_load = async () => {
  let cfg = CONFIG.ENABLE_SERVICES; // Default
  await utils_getUserConfig();
  let localCfg = localStorage.getItem("sb_config");

  if (!localCfg || localCfg.disableAll === null) { // If no, call API get cfg
    let liveCfg = await utils_getUserConfig();
    cfg = liveCfg.data.config;
    localStorage.setItem("sb_config", JSON.stringify(cfg));
  } else {
    cfg = { ...JSON.parse(localCfg) };
  }

  CONFIG.ENABLE_SERVICES = cfg;
  if (cfg.disableAll) return;

  if (cfg.smarterNoti) {
    main_smarterNoti({
      smarterNoti_faster_like_it_gone: cfg.smarterNoti_faster_like_it_gone
    })
  };
  if (cfg.smarterTitle) main_smarterTitle();
  if (currentUrl.includes("wework")) {
    if (cfg.wwHyperlink) main_makeWwCanHyperlink();
  };
  if (cfg.bonkSound) {
    if (document.querySelector("#audios")) {
      document
        .querySelector('#audio3')
        .setAttribute("src",
          (cfg.bonkSoundUrl !== "" && cfg.bonkSoundUrl)
          || "https://www.freesoundslibrary.com/wp-content/uploads/2021/03/bonk-sound-effect.mp3");
    }
  }
}

const utils_hookApi = () => {
  let proxied = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function () {
    let cfg = CONFIG.ENABLE_SERVICES;
    if (cfg.disableAll) return;

    let xhrUrl = arguments[1];
    // console.log("==============CATCH API ", arguments);
    console.log(cfg)

    if (xhrUrl.includes("/ajax/api/comment/load")) {
      if (cfg.smarterTitle) main_smarterTitle();
      if (cfg.smarterUrl) main_smarterUrl();
    };

    if (xhrUrl.includes("/ajax/api/activity")) {
      //  main_hyperlinkTask();
    };

    if (xhrUrl.includes("wework.base.vn")) {
      setTimeout(() => { if (cfg.wwHyperlink) main_makeWwCanHyperlink() }, 2000);
    };
    if (xhrUrl.includes("/ajax/task/display")) { // Page task WW

    };
    return proxied.apply(this, [].slice.call(arguments));
  };
}

const callAPI = async (route, data) => {
  console.log("🚀 ~ file: dev.js ~ line 645 ~ callAPI ~ data", data);
  const url = 'https://script.google.com/macros/s/AKfycbwq3EpWpIY4zpebj3svXRsenyr_2kSTZvNuArOj5plyQE0Mp4EXVoGa4v4fmhwU4QkAkg/exec';

  let req = await fetch(url, {
    method: 'POST',
    redirect: "follow",
    body: JSON.stringify({
      route,
      ...data
    }),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  })
  return req.json();
}

const sendErrorLog = async (error) => {
  const pingUrl = 'https://script.google.com/macros/s/AKfycbwq3EpWpIY4zpebj3svXRsenyr_2kSTZvNuArOj5plyQE0Mp4EXVoGa4v4fmhwU4QkAkg/exec';

  let sendErr = await fetch(pingUrl, {
    method: 'POST',
    redirect: "follow",
    body: JSON.stringify({
      route: "sendError",
      error: error.message
    }),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  })
  console.log("🚀 ~ file: dev.js ~ line 546 ~ sendErrorLog ~ sendErr", sendErr);
};

try {
  config_load();
  utils_hookApi();
} catch (error) {
  console.log(error)
  sendErrorLog(error)
}

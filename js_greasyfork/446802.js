console.log("=======FROM SWD WITH CODE=======")
const version = '0.3.1.90';
const env = 'prod';

// ==UserScript==
// @name         Smarter Base.vn - PROD
// @description  Make base.vn smarter
// @namespace    http://tampermonkey.net/
// @version      0.3.1.90
// @author       duclh - SWD
// @include      /https:\/\/(.*).base.vn/(.*)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=base.vn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446802/Smarter%20Basevn%20-%20PROD.user.js
// @updateURL https://update.greasyfork.org/scripts/446802/Smarter%20Basevn%20-%20PROD.meta.js
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
    "booking_time": false,
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
  // const selectSound = () => utils_loadMoreNoti();

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

  let titleDiv = document.querySelector("#base-notis > div.list.notis-canvas > div.nc-header > div.base-title.-size-df");
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


  if (options.changeNotiSound) {
    let soundDivDiv = document.createElement("div");
    soundDivDiv.innerHTML = "<label style ='margin-right: 3px'>Âm thông báo(beta)</label>";
    let soundDiv = noti_genSelectSoundDiv();
    soundDivDiv.appendChild(soundDiv);
    soundDivDiv.style.display = "inline";
    soundDivDiv.style.fontSize = "16px";
    soundDivDiv.style.marginLeft = "5px";

    let btnConfirmSound = document.createElement("button");
    btnConfirmSound.innerText = "Lưu";
    btnConfirmSound.id = "btn-select-sound";
    btnConfirmSound.style.display = "none";
    btnConfirmSound.onclick = () => noti_confirmSelectSound();;

    let tipTextDiv = document.createElement("label");
    tipTextDiv.innerText = "Lưu xong nhớ F5";
    tipTextDiv.id = "select-sound";
    tipTextDiv.style.display = "none";

    soundDivDiv.appendChild(btnConfirmSound);
    soundDivDiv.appendChild(tipTextDiv);
    noti_grid_2.appendChild(soundDivDiv);

  }

  let checkHasNoti = setInterval(() => { // Count noti
    if (document.querySelectorAll(".notis").length) {
      clearInterval(checkHasNoti);
      noti_recountNoti();
    }
  }, 200);

};

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

  document.querySelector("#select-sound").style.display = "inline";
  document.querySelector("#btn-select-sound").style.display = "inline";

  // Write local
  let sb_config = JSON.parse(localStorage.getItem('sb_config'));
  sb_config.noti_sound_key = soundKey;
  localStorage.setItem("sb_config", JSON.stringify(sb_config))
  //Write API

}

const noti_confirmSelectSound = () => {
  let userInfo = JSON.parse(localStorage.getItem('ajs_user_traits'));
  let sb_config = JSON.parse(localStorage.getItem('sb_config'));
  let email = userInfo.email;
  let userNotiSoundKey = sb_config.noti_sound_key;

  callAPI("changeNotiSound",
    {
      email,
      config: {
        noti_sound_key:
          userNotiSoundKey
      }
    })
}

const noti_changeSound = () => {
  let sb_config = JSON.parse(localStorage.getItem('sb_config'));

  let notiSoundObj = localStorage.getItem("noti_sound_obj");
  if (!notiSoundObj || !notiSoundObj.length) return;
  notiSoundObj = JSON.parse(notiSoundObj);
  let userSoundKey = sb_config["noti_sound_key"];
  if (!userSoundKey || userSoundKey === "default") return;

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
    let url = noti.getAttributeNode("data-nurl").value;
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
    let url = noti.getAttributeNode("data-nurl").value;
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
  let titleNoti = document.querySelector("#base-notis > div.list.notis-canvas > div.nc-header > div.base-title.-size-df");
  let listNoti = document.querySelector("#base-notis > div.list.notis-canvas");
  if (listNoti) listNoti.style.width = "60%";
  if (titleNoti) {
    titleNoti.style.width = "300%";
    titleNoti.style.height = "55px";
    titleNoti.style.background = "white";
    titleNoti.style.top = "-12px";
    titleNoti.style.paddingTop = "5px";
    titleNoti.style.left = "-5px";
    document.querySelector("#notis-items-w").style.top = "55pxpx";
  }

  let newBaseTabDiv = document.querySelector(".base-tabs");
  if (newBaseTabDiv) {
    newBaseTabDiv.style.zIndex = 999;
    newBaseTabDiv.style.top = "-32px"
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

  if (cfg.change_noti_sound) noti_changeSound();

  if (cfg.smarterNoti) {
    main_smarterNoti({
      smarterNoti_faster_like_it_gone: cfg.smarterNoti_faster_like_it_gone,
      changeNotiSound: cfg.change_noti_sound
    })
  };
  if (cfg.smarterTitle) main_smarterTitle();
  if (currentUrl.includes("wework")) {
    if (cfg.wwHyperlink) main_makeWwCanHyperlink();
  };
  if (currentUrl.includes("booking")) {
    if (cfg.booking_time) booking_time();
    utils_stylingBooking();
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
    if (xhrUrl.includes("booking.base.vn")) { // Page task WW
      setTimeout(() => {
        if (cfg.booking_time && !booking_time_loaded) booking_time();
        utils_stylingBooking();
        filters = {
          room: [],
          BOD: [],
          manager: []
        }
      }, 2000);

      //showBtnBooking()
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
  console.log("🚀 ~ req:", req);
  console.log("API OK")
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

const parser = new DOMParser();

let clientData = {};
let timeListByDay = []
let resourceThatDay = {};
let resourceList = {};
let booking_time_loaded = false;
let pickedDate = moment();
moment.updateLocale('en', {
  week: {
    dow: 1, // Monday is the first day of the week.
  }
});
let filters = {
  room: [],
  BOD: [],
  manager: []
}
const showBtnBooking = () => {
  let btnHTML = `<div style="display:inline-block;" class="button ok -success -rounded bold url" id="myBtn">So sánh lịch</div>`
  let btnMatch = document.createElement('div');
  btnMatch.innerHTML = btnHTML
  btnMatch.style.display = "inline-block";
  btnMatch.style.width = "18%"
  if (!document.querySelector("#myBtn")) document.querySelector(".master-header  > div.base-title.-size-df").appendChild(btnMatch)
}

let booking_match_times = [];

const getBooking = async () => {
  document.querySelector("#booking-tip").style.display = "block";
  let userInfo = JSON.parse(localStorage.getItem('ajs_user_traits'));
  callAPI("lookTimeBooking", { name: userInfo.name, email: userInfo.email, version, env })

  document.querySelector("#find-match").style.background = "gray"
  genTimeListByDay();
  let pickedLinks = ["https://booking.base.vn/flash-room-206",
    "https://booking.base.vn/qvt-loki-room-419",
    //"https://booking.base.vn/ceo-nguyen-the-anh-208", "https://booking.base.vn/dungnq-557", "https://booking.base.vn/thanhlh-564", "https://booking.base.vn/namth-543", "https://booking.base.vn/hulk-room-203"
  ]
  pickedLinks = filters.room.concat(filters.BOD).concat(filters.manager)
  let selectedDate = "";
  let resourceTimes = {};

  let firstDayOfWeekUnix = pickedDate.clone().weekday(1).unix();
  //for (let link of pickedLinks){
  let countDone = 0;
  pickedLinks.forEach(async (link) => { // forEach để bất đồng bộ
    console.log("link", link)
    let pageHTML = await callAPI_booking(link + "?ts=" + firstDayOfWeekUnix); // Loop by dropdown list
    let idSplit = link.split("/");
    let id = idSplit[3].split("-")[0];
    console.log("id", id)
    pageHTML = pageHTML.replace(/Client/g, id)
    let parsePageHTML = parser.parseFromString(pageHTML, "text/html");

    let scripts = parsePageHTML.querySelectorAll("head script");
    for (let script of scripts) {
      console.log("has id====================", script.innerHTML.includes("var"))
      if (script.innerHTML.includes("var " + id)) { // Fix var text
        script.innerHTML += `return ${id};`
        // console.log(script.innerHTML)
        let fnc = Function(script.innerHTML)
        clientData[id] = fnc();
      }
    }
    // console.log(clientData)
    countDone++;
    if (clientData[id].pageData.resource) {
      console.log(clientData[id].pageData.resource)
      let currentResource = clientData[id].pageData.title;
      resourceTimes[currentResource] = {};
      let currentPageBookings = clientData[id].pageData.bookings;


      let bookedTimes = [];
      resourceTimes[currentResource].name = currentResource;
      resourceTimes[currentResource].key = clientData[id].pageData.resource.path;
      resourceTimes[currentResource].url = "https://booking.base.vn/" + clientData[id].pageData.resource.path + "?ts=" + firstDayOfWeekUnix;
      resourceTimes[currentResource].data = [];
      resourceTimes[currentResource].groupId = "0";
      for (let booking of currentPageBookings) {
        resourceTimes[currentResource].groupId = booking.group_id;
        if (pickedDate.isSame(moment.unix(booking.stime), 'day')) {
          resourceTimes[currentResource].data.push([booking.stime, booking.etime, booking.name]);
        };
      }
    }
    if (countDone === pickedLinks.length) {
      let tempArr = [];
      for (let key of Object.keys(resourceTimes)) {
        if (key.includes("Home")) continue;
        tempArr.push(resourceTimes[key])
      }
      tempArr.sort((a, b) => Number(a.groupId) - Number(b.groupId));
      let newObj = {};
      tempArr.forEach(i => {
        newObj[i.name] = i
      })
      document.querySelector("#find-match").style.background = "#42b814"

      //Khúc này phải loop nhiều cồng kềnh vãi, nhưng mà kệ

      resourceThatDay = newObj;
      genTable();
      return resourceTimes;
    }
    // }

  })// End loop
  //}


}

const genTimeListByDay = () => {
  let unixDateTimeList = [];
  let minuteList = ["00", "15", "30", "45"]

  let startHour = 6;
  for (let i = startHour; i < startHour + 14; i++) {
    let hourString = `${i >= 9 ? "" : "0"}${i + 1}`;
    for (let minute = 0; minute < 4; minute++) {
      let currentDate = moment(moment(pickedDate).format("DD/MM/YYYY") + " " + hourString + ":" + minuteList[minute], "DD/MM/YYYY HH:mm")
      unixDateTimeList.push({ time: currentDate, is_match_free: null });
    };

  };
  timeListByDay = unixDateTimeList;
  return unixDateTimeList;

}

const popupFindBooking = () => {
  var d = document,
    someThingStyles = d.createElement('style');
  d.getElementsByTagName('head')[0].appendChild(someThingStyles);

  someThingStyles.setAttribute('type', 'text/css');
  let styles = ".modal{display:none;position:fixed;z-index:999;padding-top:100px;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,.4)}.modal-content{position:relative;background-color:#fefefe;margin:auto;padding:0;border:1px solid #888;width:80%;box-shadow:0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);-webkit-animation-name:animatetop;-webkit-animation-duration:.4s;animation-name:animatetop;animation-duration:.4s}@-webkit-keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}@keyframes animatetop{from{top:-300px;opacity:0}to{top:0;opacity:1}}.close-modal{color:#fff;float:right;font-size:28px;font-weight:700}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer}.modal-footer,.modal-header{padding:2px 16px;background-color:#5cb85c;color:#fff}.modal-body{padding:2px 16px}"

  var styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
  let btnHTML = `<div style="display:inline-block;" class="button ok -success -rounded bold url" id="myBtn">So sánh lịch</div>`
  let btnMatch = document.createElement('div');
  btnMatch.innerHTML = btnHTML
  btnMatch.style.display = "inline-block";
  btnMatch.style.width = "18%"
  if (!document.querySelector("#myBtn")) document.querySelector(".master-header  > div.base-title.-size-df").appendChild(btnMatch)

  let checkBookingTimeAppear = setInterval(() => {
    if (!document.querySelector("#myBtn")) document.querySelector(".master-header  > div.base-title.-size-df").appendChild(btnMatch)
  }, 500);



  let modalHTML = `<div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <div class="modal-header">
      <span class="close-modal">&times;</span>
      <h2>Booking Matcher (Beta)</h2>
    </div>
    <div class="modal-body">
    <div id="modal-filter" style="margin-bottom: 10px;"> </div>
    </div>

  </div>

</div>`
  let md = document.createElement('div');
  md.innerHTML = modalHTML
  document.getElementsByTagName("body")[0].appendChild(md)
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close-modal")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    //console.log(event)
    if (event.target === document.querySelector(".modal-body")
      || event.target === document.querySelector(".modal-filter")
      || event.target === document.querySelector("div#find-match.button.ok.-success.-rounded.bold.url")

    ) {
      let sltMap = {
        "room": "#modal-filter .select-room",
        "BOD": "#modal-filter .select-BOD",
        "manager": "#modal-filter .select-manager",

      }
      document.querySelector(sltMap.room).classList.remove('active')
      document.querySelector(sltMap.BOD).classList.remove('active')
      document.querySelector(sltMap.manager).classList.remove('active')
    }
    if (event.target == modal) {

      modal.style.display = "none";
    }
  }


};

const genTable = async () => {
  document.querySelectorAll("#myModal table").forEach(i => i.innerHTML = "")

  let template = `
   <tr>
  <td class="booking-hour" rowspan="4">hour-minute</td> timeSlot
</tr>
<tr> timeSlot </tr>
<tr> timeSlot </tr>
<tr> timeSlot </tr>
  `
  let timeSlotTemplate = `<td class="booking-hour-resource"></td>`
  let timeSlotString = "";
  let timeString = "";
  let stepMinuteIndex = 1;

  for (let i = 0; i < timeListByDay.length; i++) {
    let timeSlot = timeListByDay[i].time;
    for (let key of Object.keys(resourceThatDay)) {
      timeSlotTemplate = `<td class="booking-hour-resource-${resourceThatDay[key].key} tooltip"><span class="tooltiptext"></span></td>`
      timeSlotString += timeSlotTemplate;
    }
    timeString = timeString.replace(/timeSlot/g, timeSlotString);
    timeSlotString = "";

    if (stepMinuteIndex === 1) {
      let fourPairRow = template.replace("hour-minute", timeSlot.format("HH:mm"));
      if (timeSlot.hour() === moment().hour()) fourPairRow = fourPairRow.replace("booking-hour", "booking-hour is-now")
      timeString += fourPairRow;
    }
    if (stepMinuteIndex === 4) stepMinuteIndex = 0;
    stepMinuteIndex++;
  }

  let styleTable = `
    <style>
   .modal-body table {
     font-family: arial, sans-serif;
     border-collapse: collapse;
     width: 100%;
   }

   .modal-body td,
   .modal-body th {
     border: 1px solid #dddddd;
     text-align: left;
     padding: 4px;
   }

   .bb-none {
     border-bottom-color: #0000 !important;
   }

   .bt-none {
     border-top-color: #0000 !important;
   }

   .booking-hour {
     text-align: center !important;
   }

   /* Tooltip container */
   .tooltip {
     //position: relative;
     //display: inline-block;
     //border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
   }

   /* Tooltip text */
   .tooltip .tooltiptext {
     margin-left: 100px;
     visibility: hidden;
     width: 200px;
     background-color: black;
     color: #fff;
     text-align: center;
     padding: 5px 0;
     border-radius: 6px;
     /* Position the tooltip text - see examples below! */
     position: absolute;
     z-index: 1;
   }

   /* Show the tooltip text when you mouse over the tooltip container */
   .tooltip:hover .tooltiptext {
     visibility: visible;
   }

   .is-now {
     background: #7dbdd5 !important;
   }
 </style>`

  var styleSheet = document.createElement("style")
  styleSheet.innerText = styleTable
  document.head.appendChild(styleSheet)

  let text = `
    <table class="find-booking">
  <tr>
    <th style="padding: 8px">Thời gian</th> resourceNames
  </tr> ${timeString}
</table>
`
  let resourceNamesTemplate, resourceNames = ""
  for (let key of Object.keys(resourceThatDay)) {
    resourceNamesTemplate = `<th style="padding: 8px"> <a href=${resourceThatDay[key].url}>${key}</a> </th>`
    resourceNames += resourceNamesTemplate;
  }
  text = text.replace("resourceNames", resourceNames)
  text = text.replace(/ - Base Booking/g, "")

  let tableDiv = document.createElement("table");
  tableDiv.innerHTML = text;
  document.querySelector(".modal-body").appendChild(tableDiv)


  fillDataToTable();
  fill_match_free();

};

const fillDataToTable = () => {
  for (let key of Object.keys(resourceThatDay)) {
    let resourceKey = resourceThatDay[key].key;
    let resourceData = resourceThatDay[key].data;
    let tds = document.querySelectorAll(`.modal-body tr .booking-hour-resource-${resourceKey}`);

    for (let i = 0; i < timeListByDay.length; i++) {
      let time = timeListByDay[i].time;
      tds[i].querySelector(".tooltiptext").innerHTML = moment(time).format("HH:mm")
      for (let timeData of resourceData) {
        if (moment(time).isBetween(moment.unix(timeData[0]).subtract(1, "minutes"), moment.unix(timeData[1]))) {
          if (resourceThatDay[key].groupId && (resourceThatDay[key].groupId !== "83" && resourceThatDay[key].groupId !== "0")) timeListByDay[i].is_match_free = false;
          tds[i].querySelector(".tooltiptext").innerHTML = `[${moment.unix(timeData[0]).format("DD/MM")}] ${moment.unix(timeData[0]).format("HH:mm")}-${moment.unix(timeData[1]).format("HH:mm")}<br/>${timeData[2]} `
          tds[i].style.background = "red";
        }
      }
    };

  }



};

const fill_match_free = () => {
  // console.log("🚀 ~ file: prod.js:1111 ~ resourceThatDay:", resourceThatDay)
  // console.log("🚀 ~ file: prod.js:1111 ~ resourceThatDay:", timeListByDay)
  for (let key of Object.keys(resourceThatDay)) {
    if (resourceThatDay[key].groupId && (resourceThatDay[key].groupId === "83" || resourceThatDay[key].groupId === "0")) continue; //Bỏ qua phòng, chỉ lấy người
    let resourceKey = resourceThatDay[key].key;
    let tds = document.querySelectorAll(`.modal-body tr .booking-hour-resource-${resourceKey}`);

    for (let i = 0; i < timeListByDay.length; i++) {
      let is_match_free = timeListByDay[i].is_match_free;
      if (is_match_free === false) continue;
      tds[i].style.background = "#46bcd7";
    }
  }

}

const getResourceList = () => {
  let groups = Client.groups; // []
  let resources = {
    "room": {
      label: "Phòng họp",
      items: []
    },
    "BOD": {
      label: "BOD",
      items: []
    },
    "manager": {
      label: "manager",
      items: []
    }
  };

  groups[0].items.forEach(i => {
    resources.room.items.push({
      url: "https://booking.base.vn/" + i.path,
      name: i.name,
      id: i.id
    })
  })
  groups[1].items.forEach(i => {
    if (!i.name.contains("Ánh Nguyệt") && !i.name.contains("Việt Hà") && !i.name.contains("Minh Khôi")) {
      resources.BOD.items.push({
        url: "https://booking.base.vn/" + i.path,
        name: i.name,
        id: i.id
      })
    }
  })
  groups[4].items.forEach(i => {
    resources.manager.items.push({
      url: "https://booking.base.vn/" + i.path,
      name: i.name,
      id: i.id
    })
  })
  resourceList = resources;
}

const onSelectDate = (e) => {
  pickedDate = moment(e.target.value, "YYYY-MM-DD")
}

const onClickFilterList = (type) => {
  let sltMap = {
    "room": "#modal-filter .select-room",
    "BOD": "#modal-filter .select-BOD",
    "manager": "#modal-filter .select-manager",

  }
  let currentHasActive = document.querySelector(sltMap[type]).classList.contains("active");
  document.querySelector(sltMap.room).classList.remove('active')
  document.querySelector(sltMap.BOD).classList.remove('active')
  document.querySelector(sltMap.manager).classList.remove('active')

  if (currentHasActive) document.querySelector(sltMap[type]).classList.add('active');
  else document.querySelector(sltMap[type]).classList.remove('active');
}

const filter = () => {

  document.querySelector('#modal-filter').innerHTML = "";
  let style = `.dropdown-check-list {
  display: inline-block;
}

.dropdown-check-list .anchor {
  position: relative;
  cursor: pointer;
  display: inline-block;
  padding: 5px 50px 5px 10px;
  border: 1px solid #ccc;
}

.dropdown-check-list .anchor:after {
  position: absolute;
  content: "";
  border-left: 2px solid black;
  border-top: 2px solid black;
  padding: 5px;
  right: 10px;
  top: 20%;
  -moz-transform: rotate(-135deg);
  -ms-transform: rotate(-135deg);
  -o-transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
}

.dropdown-check-list .anchor:active:after {
  right: 8px;
  top: 21%;
}

.dropdown-check-list ul.items {
  padding: 2px;
  display: none;
  margin: 0;
  border: 1px solid #ccc;
  border-top: none;
}

.dropdown-check-list ul.items li {
  list-style: none;
}

.dropdown-check-list.visible .anchor {
  color: #0094ff;
}

.dropdown-check-list.visible .items {
  display: block;
}
.improve-select .is-scroll{
max-height: 500px !important;
}
`

  let listRoom = `<div class="improve-select unselectable select-room" style="" >

  <div class="is-display url" data-url="" onclick="document.querySelector('#modal-filter .select-room').classList.toggle('active')">
    <div class="room-count">Phòng họp: 0</div>
  </div>
  <div class="is-box">
    <div class="is-scroll scroll-y url" style="">
      <div class="is-items .select-room">
      </div>
    </div>
    <div class="is-close" onclick="document.querySelector('#modal-filter .select-room').classList.remove('active')">Done</div>
  </div>
</div>`


  let listBOD = `<div class="improve-select unselectable select-BOD" style="" >
  <div class="is-display url" data-url=""  onclick="document.querySelector('#modal-filter .select-BOD').classList.toggle('active')">
    <div class="BOD-count">BOD: 0</div>
  </div>
  <div class="is-box">
    <div class="is-scroll scroll-y url">
      <div class="is-items select-BOD">
      </div>
    </div>
    <div class="is-close" onclick="document.querySelector('#modal-filter .select-BOD').classList.remove('active')">Done</div>
  </div>
</div>`


  let listManager = `<div class="improve-select unselectable select-manager" style=""  >
  <div class="is-display url" data-url="" onclick="document.querySelector('#modal-filter .select-manager').classList.toggle('active')">
    <div class="manager-count">Quản lý: 0</div>
  </div>
  <div class="is-box">
    <div class="is-scroll scroll-y url">
      <div class="is-items select-manager">
      </div>
    </div>
    <div class="is-close" onclick="document.querySelector('#modal-filter .select-manager').classList.remove('active')">Done</div>
  </div>
</div>`


  let datePickerDiv = document.createElement("div");
  let pickedDatePicker = moment().format("YYYY-MM-DD")
  datePickerDiv.innerHTML = `<input type="date" id="filter-date" name="filter-date" style="width: 100%; height: 30px;" value="${pickedDatePicker}">`;
  datePickerDiv.style.display = "inline-block";
  datePickerDiv.style.marginRight = "10px";
  datePickerDiv.style.top = "-1px";
  datePickerDiv.style.height = "25px";
  datePickerDiv.style.width = "235px";
  datePickerDiv.style.position = "relative";
  datePickerDiv.onchange = (e) => onSelectDate(e)


  let listDiv = document.createElement("div");
  listDiv.innerHTML = listRoom;
  listDiv.style.display = "inline-block";
  listDiv.style.marginRight = "10px";
  listDiv.style.marginTop = "10px";
  listDiv.style.width = "230px";
  listDiv.onclick = () => onClickFilterList('room')

  let listBODDiv = document.createElement("div");
  listBODDiv.innerHTML = listBOD;
  listBODDiv.style.display = "inline-block";
  listBODDiv.style.marginTop = "10px";
  listBODDiv.style.marginRight = "10px";
  listBODDiv.style.width = "230px";
  listBODDiv.onclick = () => onClickFilterList('BOD')

  let listManagerDiv = document.createElement("div");
  listManagerDiv.innerHTML = listManager;
  listManagerDiv.style.display = "inline-block";
  listManagerDiv.style.marginTop = "10px";
  listManagerDiv.style.width = "230px";
  listManagerDiv.onclick = () => onClickFilterList('manager')


  var styleSheet = document.createElement("style")
  styleSheet.innerText = style
  document.head.appendChild(styleSheet)

  let btnConfirmHTML = `<div class="button ok -success -rounded bold url" id="find-match">Tìm trận</div>`;
  let btnConfirm = document.createElement("div")
  btnConfirm.style.display = "inline-block";
  btnConfirm.style.marginTop = "5px";
  btnConfirm.style.marginRight = "10px";
  btnConfirm.style.width = "20%";
  btnConfirm.innerHTML = btnConfirmHTML;
  btnConfirm.onclick = () => { getBooking() };

  let btnHHTHTML = `<div class="button ok -success -rounded bold url" id="find-match">Phòng HHT</div>`;
  let btnHHT = document.createElement("div")
  btnHHT.style.display = "inline-block";
  btnHHT.style.marginTop = "5px";
  btnHHT.style.width = "20%";
  btnHHT.innerHTML = btnHHTHTML;
  btnHHT.onclick = () => { selectHHT() };

  let tipHTML = `<h3>Note 1: Beta: Các ô tô màu xanh ở dưới là thời gian mà TẤT CẢ những NGƯỜI được chọn cùng trống thời gian.</h3>
  `;
  let tipDiv = document.createElement("div")
  tipDiv.style.display = "none";
  tipDiv.style.marginTop = "5px";
  tipDiv.id = "booking-tip";
  // tipDiv.style.width = "20%";
  tipDiv.innerHTML = tipHTML;

  /*
for (let sound of notiSoundList) {
let key = sound[0];
let value = sound[1];
let optionDiv = document.createElement("option");
optionDiv.value = key;
optionDiv.innerText = value;
optionDiv.selected = key === userNotiSoundKey ? "selected" : "";
// optionDiv.addEventListener("select", () => { noti_onSelectSound(username, key) });

selectResourceDiv.appendChild(optionDiv);
// let optionDiv = `<option value="${key}" onselect={noti_onSelectSound("${username}","${key}")}>${value}</option>`;
}
*/

  document.querySelector('#modal-filter').appendChild(datePickerDiv);
  document.querySelector('#modal-filter').appendChild(listDiv);
  document.querySelector('#modal-filter').appendChild(listBODDiv);
  document.querySelector('#modal-filter').appendChild(listManagerDiv);
  document.querySelector('#modal-filter').appendChild(btnConfirm);
  document.querySelector('#modal-filter').appendChild(btnHHT);
  document.querySelector('#modal-filter').appendChild(tipDiv);
  genFilterDropdown();
};

const selectHHT = () => {
  onClickFilterList('room')
  let HHT_list = [
    { url: "https://booking.base.vn/captain-room-205", id: "205" },
    { url: "https://booking.base.vn/flash-room-206", id: "206" },
    { url: "https://booking.base.vn/hulk-room-203", id: "203" },
    { url: "https://booking.base.vn/iron-man-room-207", id: "207" },
    // { url: "https://booking.base.vn/thanos-room-284", id: "284" },
    { url: "https://booking.base.vn/thor-room-204", id: "204" },
    { url: "https://booking.base.vn/spider-man-room-777", id: "777" },
    { url: "https://booking.base.vn/star-lord-room-582", id: "582" },
    { url: "https://booking.base.vn/vision-room-778", id: "778" },
  ]
  for (let hht of HHT_list) {
    onSelectFilter("room", hht.id, hht.url)
  }
}

const onSelectFilter = (type, id, value) => {
  if (!type) return;
  let currentSelected = filters[type];

  let currentIdSelected = document.querySelector(`#select-${type}-${id}`) && document.querySelector(`#select-${type}-${id}`).classList.contains("active")
  if (currentIdSelected) {
    const index = currentSelected.indexOf(value);
    if (index > -1) currentSelected.splice(index, 1);
  } else currentSelected.push(value);
  if (currentSelected.length > 0) document.querySelector(".select-" + type).style.background = "#b9f1a2";
  let mapName = {
    room: "Phòng họp",
    BOD: "BOD",
    manager: "Quản lý",

  }
  document.querySelector(`.${type}-count`).innerHTML = `${mapName[type]}: ${currentSelected.length}`
  document.querySelector(`#select-${type}-${id}`).classList.toggle("active");

}

const genFilterDropdown = () => {
  let temp = `        <div class="is-item" onclick="Form.improveSelectHelper.pickup(this);" data-value="664">AnhLQ</div>
        <div class="is-item" onclick="Form.improveSelectHelper.pickup(this);" data-value="663">TrucNT</div>
        <div class="is-item active" onclick="Form.improveSelectHelper.pickup(this);" data-value="662">QuangNVD</div>
        <div class="is-item" onclick="Form.improveSelectHelper.pickup(this);" data-value="661">TriND</div>`

  if (resourceList.room.items.length) {
    resourceList.room.items.forEach(i => {
      let selectTemplate = `<div class="is-item" id="select-room-${i.id}" url="${i.url}">${i.name}</div>`
      let selectDiv = document.createElement("div");
      selectDiv.onclick = () => {
        onSelectFilter("room", i.id, i.url)
      }
      selectDiv.innerHTML = selectTemplate
      document.querySelector(".is-scroll .is-items").appendChild(selectDiv)
    })
  }

  if (resourceList.BOD.items.length) {
    resourceList.BOD.items.forEach(i => {
      let selectTemplate = `<div class="is-item" id="select-BOD-${i.id}" url="${i.url}">${i.name}</div>`
      let selectDiv = document.createElement("div");
      selectDiv.onclick = () => {
        onSelectFilter("BOD", i.id, i.url)
      }
      selectDiv.innerHTML = selectTemplate
      document.querySelector(".is-scroll .select-BOD").appendChild(selectDiv)
    })
  }

  if (resourceList.manager.items.length) {
    resourceList.manager.items.forEach(i => {
      let selectTemplate = `<div class="is-item" id="select-manager-${i.id}" url="${i.url}">${i.name}</div>`
      let selectDiv = document.createElement("div");
      selectDiv.onclick = () => {
        onSelectFilter("manager", i.id, i.url)
      }
      selectDiv.innerHTML = selectTemplate
      document.querySelector(".is-scroll .select-manager").appendChild(selectDiv)
    })
  }



}

const utils_stylingBooking = () => {
  if (currentUrl.includes("booking")) {
    let items = document.querySelectorAll(".bitem");
    items.forEach(i => {
      let title = i.getAttribute("title");

      // if (title.trim().toLowerCase().includes("task")) i.style.background = "orange";
      // if (title.trim().toLowerCase().includes("meeting")) i.style.background = "#20bb20";
    })
  }

}

const callAPI_booking = async (url, data) => {
  let res = await fetch(url, {
    method: 'GET',
  });
  let htmlRes = await res.text();
  return htmlRes;
};

const booking_time = async () => {
  booking_time_loaded = true;
  popupFindBooking();
  genTimeListByDay();
  genTable();
  //await getBooking();
  getResourceList();
  filter();


}

try {
  config_load();
  utils_hookApi();
} catch (error) {
  console.log(error)
  sendErrorLog(error)
}

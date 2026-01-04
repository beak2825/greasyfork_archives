// ==UserScript==
// @name               Get Instance
// @name:zh-CN         Get Instance
// @name:en            Get Instance
// @description        获取服务的实例。仅供SAP内部使用。
// @description:zh-CN  获取服务的实例。仅供SAP内部使用。
// @description:en     Get instance of services. Only for SAP internal using.
// @namespace          https://github.com/HaleShaw
// @version            1.0.0
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-GetInstance
// @supportURL         https://github.com/HaleShaw/TM-GetInstance/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://amalthea-cloud.cfapps.eu10.hana.ondemand.com/favicon-32.png
// @match              https://amalthea-cloud.cfapps.eu10.hana.ondemand.com/org/SelfBilling/stage/*
// @compatible	       Chrome
// @run-at             document-start
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_notification
// @grant              GM_info
// @downloadURL https://update.greasyfork.org/scripts/416827/Get%20Instance.user.js
// @updateURL https://update.greasyfork.org/scripts/416827/Get%20Instance.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  const title = GM_info.script.name;
  const deploymentsApi = "https://amalthea-cloud.cfapps.eu10.hana.ondemand.com/api/org/selfbilling/projects/v1/DeliverREL/stage/%s/artifactDeployments";
  const projects = ["core", "customizing", "retriever", "transmission", "confirmation"];

  const mainStyle = `
    .instance {
      cursor: pointer;
    }

    #pop {
      position: fixed;
      z-index: 9999;
      bottom: 20px;
      right: 20px;
      background-color: #faf1d0;
      padding: 0 5px;
      border: #333 solid 1px;
      border-radius: 5px;
      transition: opacity .5s;
      opacity: 0;
    }
    `;

  main();

  // Every 5 minutes reload.
  setInterval(main, 5 * 60 * 1000);

  function main() {
    clearElements();
    logInfo(title, GM_info.script.version);
    GM_addStyle(mainStyle);
    addPopElement();
    setTimeout(initData, 3000);
  }

  /**
   * Remove the elements that have been added.
   */
  function clearElements() {
    let popEle = document.getElementById("pop");
    if (popEle) {
      popEle.remove();
    }
    let aEles = document.getElementsByClassName("instance");
    for (let i = 0; i < aEles.length; i++) {
      aEles[i].remove();
      i--;
    }
    let brEles = document.getElementsByTagName("br");
    for (let i = 0; i < brEles.length; i++) {
      brEles[i].remove();
      i--;
    }
  }

  /**
   * Append the pop message element to body.
   */
  function addPopElement() {
    let popEle = document.createElement('div');
    popEle.setAttribute("id", "pop");
    popEle.innerHTML = "<a>Copied</a>";
    document.getElementsByTagName('body')[0].appendChild(popEle);
  }

  async function initData() {
    const deploymentsData = await getDeploymentsData();
    let serviceTBodies = document.querySelectorAll("tbody.position-relative");
    if (deploymentsData && serviceTBodies && serviceTBodies[2] != undefined) {
      let trs = serviceTBodies[2].children;
      if (trs) {
        for (let i = 0; i < trs.length; i++) {
          let tdEle = trs[i].children[0];
          if (tdEle) {
            let spanEle = tdEle.children[1];
            if (spanEle) {
              let aEle = spanEle.children[0];
              if (aEle) {
                let projectName = aEle.textContent;
                let nameArr = projectName.split("/");
                if (nameArr.length == 4) {
                  projectName = nameArr[2];
                  aEle.textContent = projectName;
                }
                let instance = "";
                for (let j = 0; j < projects.length; j++) {
                  if (projectName.indexOf(projects[j]) != -1) {
                    instance = deploymentsData[projects[i]];
                    instance ? instance : "";
                    break;
                  }
                }
                let btn = document.createElement('a');
                btn.setAttribute("class", "instance");
                btn.setAttribute("title", "Click to copy");
                btn.innerText = instance;
                const brEle = document.createElement('br');
                spanEle.appendChild(brEle);
                spanEle.appendChild(btn);
              }
            }
          }
        }
        addListeners();
      }
    }
  }

  /**
   * Add listener for elements.
   */
  function addListeners() {
    const instanceEles = document.getElementsByClassName("instance");
    if (instanceEles) {
      for (let i = 0; i < instanceEles.length; i++) {
        instanceEles[i].onclick = function (e) {
          let value = this.textContent;
          copyText(value);
        }
      }
    }
  }

  /**
   * Copy text.
   * @param {String} text text.
   */
  function copyText(text) {
    var tag = document.createElement('input');
    tag.setAttribute('id', 'autoCopyInput');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('autoCopyInput').select();
    document.execCommand('copy');
    document.getElementById('autoCopyInput').remove();
    showPop();
  }

  /**
   * Show the message: 'Copied'.
   */
  function showPop() {
    document.getElementById("pop").style.opacity = 1;
    var st = setTimeout(function () {
      document.getElementById("pop").style.opacity = 0;
    }, 1000)
  }

  async function getDeploymentsData() {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    };
    const url = getUrl();
    const deploymentsRes = await doGet(url, headers);
    let deploymentsData = {};
    if (isJSON(deploymentsRes)) {
      const data = JSON.parse(deploymentsRes);
      for (let i = 0; i < data.length; i++) {
        const type = data[i]["landscapePartition"]["name"];
        if ("CF" === type) {
          const metaData = data[i]["metadata"]["cfApp"];
          if (metaData) {
            const instance = metaData["name"];
            for (let j = 0; j < projects.length; j++) {
              if (instance.indexOf(projects[j]) != -1) {
                deploymentsData[projects[j]] = instance;
                break;
              }
            }
          }
        }
      }
      console.debug("Deployments Data: ", deploymentsData);
    }
    return deploymentsData;
  }

  function getUrl() {
    let urlArr = location.href.split("/");
    const stage = urlArr[urlArr.length - 1];
    return deploymentsApi.replace("%s", stage);
  }


  /**
   * call the API and return the response.
   * @param {String} url url.
   * @param {Object} headers headers.
   */
  function doGet(url, headers) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "get",
        url: url,
        headers: headers,
        onload: function (res) {
          if (res.status === 200) {
            resolve(res.response);
          } else {
            console.warn('Get ' + url + ' Failed! Status: ' + res.status);
            console.debug(res);
          }
        },
        onerror: function (err) {
          console.error('Get ' + url + ' Failed! Status: ' + err.status);
          console.debug(err);
          GM_notification("Get " + url + " Failed!", "Error - " + title);
        }
      });
    });
  }

  /**
   * Check whether the string is a JSON object.
   * @param {String} str json string.
   */
  function isJSON(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      console.error("Parse JSON error" + e);
      return false;
    }
    return true;
  }

  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    console.clear();
    const titleStyle = "color:white;background-color:#606060";
    const versionStyle = "color:white;background-color:#1475b2";
    const logTitle = " " + title + " ";
    const logVersion = " " + version + " ";
    console.log("%c" + logTitle + "%c" + logVersion, titleStyle, versionStyle);
  }
})();

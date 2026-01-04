// ==UserScript==
// @name         NL显示能量
// @namespace    http://tampermonkey.net/
// @version      2025-08-15 001
// @description  https://www.nodeloc.com 论坛在首页显示能量的脚本
// @author       IWLZ
// @match        https://www.nodeloc.com/*
// @match        https://linux.do/*
// @match        https://clochat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodeloc.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545924/NL%E6%98%BE%E7%A4%BA%E8%83%BD%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/545924/NL%E6%98%BE%E7%A4%BA%E8%83%BD%E9%87%8F.meta.js
// ==/UserScript==



(function () {

    'use strict';
    console.log("NL能量显示脚本")
    let ifShowUpgradeProgress = false
    let userID = null
    if (window.location.origin == "https://www.nodeloc.com") {
        ifShowUpgradeProgress = true
    }
    function insertPowerEL() {
        let headerUL = document.getElementsByClassName("icons d-header-icons")[0]
        let newEle = document.createElement('li');
        newEle.setAttribute('id', 'nodeScoreHeader_score_id');
        newEle.setAttribute('style', `margin-left:12px;display: flex; align-items: center; justify-content: center;`)
        newEle.setAttribute('class', 'icon-header icon-header-small icon-header-link');
        newEle.innerHTML = `
        <button  style='    color: green;
            width: auto;' id="nodeScoreHeader_id_val" class="btn no-text btn-icon ai-bot-button icon btn-flat" title="当前能量" type="button">

                </button>

       `
        newEle.addEventListener("mouseenter", () => {
            //   console.log("鼠标移入 div");
            getPower(userID)
        });
        let upgradeIcon = null
        if (ifShowUpgradeProgress == true) {
            upgradeIcon = document.createElement('div');
            upgradeIcon.setAttribute('style', ' width: 42px;')
            upgradeIcon.id = `upgradeIcon_id`
            upgradeIcon.innerHTML = `
            <a role="tab" class="btn btn-flat btn-icon no-text user-menu-tab" id="home-user-menu-button-upgrade-progress" tabindex="-1" title="升级进度" aria-label="升级进度" aria-selected="false" aria-controls="quick-access-upgrade-progress" data-tab-number="6">
                    <svg class="fa d-icon d-icon-arrow-up svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <use href="#arrow-up"></use></svg>
                <!---->      
            </a>
       `
            upgradeIcon.addEventListener("mouseenter", () => {
                //   console.log("鼠标移入 div");
                showUpgradeDetail()
            });
            upgradeIcon.addEventListener("mouseleave", () => {
                //   console.log("鼠标移出 div");
                hideUpgradeDetail()
            });
        }


        if (headerUL) {
            if (ifShowUpgradeProgress == true) {
                headerUL.insertBefore(upgradeIcon, headerUL.firstChild);
            }

            headerUL.insertBefore(newEle, headerUL.firstChild);
        }


        if (ifShowUpgradeProgress == true) {
            insertUpgradeDetailEL()
        }


    }

    insertPowerEL()

    function getUserID() {
        let retryCount = 0;
        const maxRetries = 60; // 1分钟（60次）
        const retryInterval = setInterval(() => {
            try {
                let userImgBTN = document.getElementById("toggle-current-user");
                if (userImgBTN) {
                    let srcURL = userImgBTN.getElementsByTagName("img")[0].src;
                    let srcArr = srcURL.split('/');
                    userID = srcArr[srcArr.length - 3];
                    clearInterval(retryInterval);
                    if (typeof getPower === 'function') {
                        getPower(userID);
                    }
                } else if (retryCount >= maxRetries) {
                    clearInterval(retryInterval);
                    console.error("未找到userImgBTN元素，重试超时");
                }
                retryCount++;
            } catch (err) {
                console.error(err);
                if (retryCount >= maxRetries) {
                    clearInterval(retryInterval);
                }
            }
        }, 1000); // 每秒重试一次
    }
    getUserID()
    getPower(userID)

    function getPower(userID) {
        if (userID == null) {
            //  console.log("userID 为空")
            return
        }
        let url = `${window.location.origin}/u/${userID}.json`
        fetch(url) // 替换为实际的 URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络请求失败');
                }
                return response.json(); // 或 response.text() 等
            })
            .then(data => {
                console.log(data.user.gamification_score);
                let score = data.user.gamification_score
                if (score) {
                    if (document.getElementById("nodeScoreHeader_id_val")) {
                        document.getElementById("nodeScoreHeader_id_val").innerText = score;
                    }


                }

            })
            .catch(error => {
                console.error('发生错误:', error);
            });
    }


    function getUpgradeProgress(userID) {
        let url = `${window.location.origin}/u/${userID}/upgrade-progress.json`
        let divEL = document.getElementById('home-quick-access-upgrade-progress')
        divEL.innerHTML=`Loading...`
        fetch(url) // 替换为实际的 URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络请求失败');
                }
                return response.json(); // 或 response.text() 等
            })
            .then(data => {

                //  console.log(data);


                
                let unmet_conditionsEL = `
                `
                let met_conditionsEL = `
                `
                for (let i = 0; i < data.unmet_conditions.length; i++) {
                    //  console.log(i);
                    unmet_conditionsEL += `
                     <li>${data.unmet_conditions[i]}</li>
                    `
                }
                for (let i = 0; i < data.met_conditions.length; i++) {
                    met_conditionsEL += `
                     <li>${data.met_conditions[i]}</li>
                    `
                }
                divEL.innerHTML = `
                <div class="upgrade-progress-panel">
                <h3>下一等级：${data.next_level_name}</h3>
                
                <div class="upgrade-progress-bar">
                    <div class="progress" style="width: 86%;"></div>
                </div>
                
                    <h4>未满足条件</h4>
                    <ul>
                         ${unmet_conditionsEL}
                    </ul>
                
                    <h4>已满足条件</h4>
                    <ul>
                       ${met_conditionsEL}
                    </ul>
                    </div>

                
                `

            })
            .catch(error => {
                console.error('发生错误:', error);
            });

    }



    function insertUpgradeDetailEL() {
        let div = document.createElement("div");
        div.id = `showUpgradeDetail_div`
        div.innerHTML = `
            <div id="home-quick-access-upgrade-progress" class="quick-access-panel">
            
                    </div>

            `
        div.setAttribute('style', `
            position: absolute;
            background-color: #fafafa;
            box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 16px;
            display:none;
            
            `)
        let upgradeIconEL = document.getElementById(`upgradeIcon_id`)
        upgradeIconEL.appendChild(div)

    }
    function showUpgradeDetail() {
        getUpgradeProgress(userID)
        //  console.log(`showUpgradeDetail`)
        document.getElementById('showUpgradeDetail_div').style.display = 'flex'
    }
    function hideUpgradeDetail() {
        document.getElementById('showUpgradeDetail_div').style.display = 'none'
    }

    // Your code here...
})();
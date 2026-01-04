// ==UserScript==
// @name         mmorpghelper
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  more easier to play the game
// @author       dot
// @match        https://mmorpg.wordgame.tw/MW/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502277/mmorpghelper.user.js
// @updateURL https://update.greasyfork.org/scripts/502277/mmorpghelper.meta.js
// ==/UserScript==
(function() {
    'use strict';

//--------------------------------------------------------
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            checkbackpack();
            checkButton();
            findbutton();
        }
    }
});

observer.observe(document.body, {
    childList: true, 
    subtree: true,  
});
// 在页面加载完成后，确保初始检查
document.addEventListener('DOMContentLoaded', () => {
    checkbackpack();
    checkButton();
    findbutton();
});
function checkButton(){
    const now = new Date();
    const hours = now.getHours(); // 獲取當前小時
    const elements = document.querySelectorAll('div, span, p, button'); 
    let foundarena = false;
    elements.forEach(element => {
        if (element.innerText.includes('競技場')) {
            foundarena = true;
        }
    });
    
    if (foundarena) {
        let find = false;
        elements.forEach(element => {
            if (element.innerText.includes('城鎮')) {
                find = true;
            }
        });
        if(!find){
            // 找到當前具有 link_btn_active class 的按鈕
            const activeButton = document.querySelector('.link_btn_active');
            // 判斷當前的頁面
            if (activeButton) {
                const page = activeButton.textContent.trim();
                if (page === '戰場') {
                    const pointValue = 2;
                    const nameValue = '戰鬥'; 
                    const currentHours = new Date().getHours(); 
                    arena(pointValue, nameValue, currentHours);
                } else if (page === '領地') {
                } else if (page === '寵物競技') {
                    const pointValue = 6; 
                    const nameValue = '競技';
                    const currentHours = new Date().getHours();
                    arena(pointValue, nameValue, currentHours);
                } else if(page ==='陣營戰'){
                    
                }else if(page ==='寵物賽跑'){
                    const pointValue = 8; 
                    const nameValue = '賽跑'; 
                    const currentHours = new Date().getHours(); 
                    arena(pointValue, nameValue, currentHours);            
                }else {
                }
            } else {
            }
        }
        else{
        }
    } else {
    }

}

})();
function arena(point, name, hours) {
    const targetButtonSelector = `button.btn.set_btn.btn-primary.btn-block.f_12.radius0.shadow2.border-0[onclick="SetDataClick('13',[${point}],'')"]`;
    const targetButton = document.querySelector(targetButtonSelector);

    // 检查是否找到目标按钮
    if (targetButton) {
        const buttons = document.querySelectorAll('button'); // 获取所有按钮
        let existingButton = null;

        // 遍历所有按钮，查找 "快速.." 按钮
        buttons.forEach(button => {
            if (button.textContent.trim() === '快速' + name) {
                existingButton = button; // 找到按钮后赋值
            }
        });

        if (existingButton) {
        } else if (hours >= 0 && hours < 2) {
        } else {
            const newButton = document.createElement('button');
            newButton.className = 'btn set_btn btn-secondary btn-block f_12 radius0 shadow2 border-0';
            newButton.style = '';
            let number = 0;
            newButton.onclick = async function() {
                const targetButton = document.querySelector(targetButtonSelector);
                const buttonText = targetButton.textContent.trim(); 
                const match = buttonText.match(/\d+/);
                if (match) {
                    number = parseInt(match[0], 10); 

                }
                for (let i = 0; i < number; i++) {
                    SetDataClick('13', [point], '');
                    await delay(1000); 
                    await checkAndCloseAsync(); 
                }
            };

            newButton.textContent = '快速' + name;
            targetButton.parentNode.insertBefore(newButton, targetButton);
        }
    } else {
    }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function checkAndCloseAsync() {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            const button = document.querySelector('button.swal2-close');
            if (button) {
                button.click();
                clearInterval(intervalId);
                resolve();
            }
        }, 100);
    });
}
const postURL = async (doValue, idValues) => {
    const uri = 'https://mmorpg.wordgame.tw/MW/server.php';
    const params = new URLSearchParams();
    params.append('do', doValue);
    if (!Array.isArray(idValues)) {
        idValues = [idValues];
    }
    idValues.forEach(id => params.append('id[]', id));
    try {
        const response = await fetch(uri, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });
        const responseData = await response.text();
        return { doValue, idValues, responseData };
    } catch (error) {
        console.error('錯誤:', error);
        return null;
    }
};
const daily = async () => {
    const response = await fetch("https://mmorpg.wordgame.tw/MW/data.php", {
        headers: {
            accept: "text/html, */*; q=0.01",
            "accept-language": "zh-TW,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            priority: "u=1, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            cookie: "mw_acc=000001; mw_pass=123456; PHPSESSID=7pm6k4kg9jnca1revkreqkelp5",
            Referer: "https://mmorpg.wordgame.tw/MW/index.php",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: "do=24&id=2",
        method: "POST"
    });
    const responseData = await response.text();
    return responseData;
};

const parseHTML = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc;
};
const main = async () => {
    const result2 = await daily();
    const now = new Date();
    const hours = now.getHours(); // 獲取當前小時
    const doc = parseHTML(result2);
    const regex1 = /魔物\((\d+)\/80\)/;
    const regex2 = /魔物\((\d+)\/160\)/;
    const regex3 = /魔物\((\d+)\/250\)/;
    const buttons = doc.querySelectorAll("button[onclick^='SetDataClick']");
    for (const button of buttons) {
        const spanText = button.querySelector("span").textContent.trim();
        const signText = button.childNodes[1].textContent.trim();
        
        if (spanText === "點選領取" || spanText === "已完成") {
            let response;
            if (signText === "12時~14時" && (hours >= 12 && hours < 14)) {
                response = await postURL(27, 6);
            } else if (signText === "18時~20時" && (hours >= 18 && hours < 20)) {
                response = await postURL(27, 7);
            } else if (signText === "簽到") {
                response = await postURL(27, 1);
            } else if (signText === "連續登入") {
                response = await postURL(27, 9);
            } else if (regex1.test(signText)) {
                response = await postURL(27, 3);
            } else if (regex2.test(signText)) {
                response = await postURL(27, 4);
            } else if (regex3.test(signText)) {
                response = await postURL(27, 5);
            }

            if (response) {
                console.log('Response from postURL:', response); // 打印响应
            } else {
                console.log('Failed to get a valid response from postURL.'); // 错误处理
            }
        }
    }
};
const findbutton = () => {
    // 查找按钮元素
    const buttons = document.querySelectorAll("button.set_btn.btn-primary.btn-block.f_14.pt-2.pb-2.shadow2.border-0");

    // 遍历所有按钮
    buttons.forEach(button => {
        // 获取按钮的文本内容
        const buttonText = button.textContent.trim();
        
        // 判断类名和文本内容
        if (buttonText.includes("冒險")) {
        // 检查是否已经有事件监听器
        const hasClickHandler = button.hasAttribute('data-click-handler');
        if (!hasClickHandler) {
            // 添加点击事件监听器
            const clickHandler = async (event) => {
                // 确保原始 onclick 函数仍然被调用
                const originalOnClick = button.getAttribute("onclick");
                if (originalOnClick) {
                    eval(originalOnClick); // 执行原始 onclick 内容
                }
                console.log("Calling main function"); // 调试信息
                await main();
                mainExecuted = true; // 设置标志变量为 true
                console.log("Main function executed."); // 调试信息
            };
            button.addEventListener("click", clickHandler);
            button.setAttribute('data-click-handler', 'true'); // 标记按钮已经添加过事件监听器
        } else {
        }
        }
    });
};

function checkbackpack(){
    const now = new Date();
    const hours = now.getHours(); // 獲取當前小時
    const elements = document.querySelectorAll('div, span, p, button'); // 選擇你想要檢查的元素標籤
    let foundback = false;
    elements.forEach(element => {
        if (element.innerText.includes('背包')) {
            foundback = true;
        }
    });
    if (foundback) {
        const activeButton = document.querySelector('.link_btn_active');
            // 判斷當前的頁面
            if (activeButton) {
                const page = activeButton.textContent.trim();
                if (page === '裝備'){
                    equi(page);
                }
                else if(page==='道具'){
                    equi(page);
                }
            } else {
            }
    }
}
function equi(page) {
    let targetButtonSelector=null;
    if(page === '裝備'){
        targetButtonSelector = "[onclick=\"SetDataClick('7',[6,0,7,2],'確定將所有裝備解除鎖定?')\"]";
    }
    else if(page==='道具'){
        targetButtonSelector = "[onclick=\"SetDataClick('6',[-1,1],'確定學習所有技能書?(單次上限5種技能書)')\"]";
    }
    const targetButton = document.querySelector(targetButtonSelector);
    // 检查是否找到目标按钮
    if (targetButton) {
        const getbtn = document.querySelectorAll('button'); // 获取所有按钮
        let exitbtn = null;
        getbtn.forEach(button => {
            if (button.textContent.trim() === '+10防具卷軸' ) {
                exitbtn = button; // 找到按钮后赋值
            }
        });
        if (exitbtn) {
        }  else {
            const newButton = document.createElement('button');
            newButton.className = 'btn set_btn float-left btn-primary p-1 ml-1 f_12 shadow2 border-0';
            newButton.style = '';
            let number = 0;
            newButton.onclick = async function() {
                const result = await postURL(11, [1, 2, 10, 2]);
            };
            newButton.textContent ='+10防具卷軸';
            targetButton.parentNode.insertBefore(newButton, targetButton.nextSibling);
        }
        const buttons = document.querySelectorAll('button'); // 获取所有按钮
        let existingButton = null;
        buttons.forEach(button => {
            if (button.textContent.trim() === '+10武器卷軸' ) {
                existingButton = button; // 找到按钮后赋值
            }
        });
        if (existingButton) {
        }  else {
            const newButton = document.createElement('button');
            newButton.className = 'btn set_btn float-left btn-primary p-1 ml-1 f_12 shadow2 border-0';
            newButton.style = '';
            let number = 0;
            newButton.onclick = async function() {
                const result = await postURL(11, [1, 1, 10, 2]);
            };
            newButton.textContent ='+10武器卷軸';
            targetButton.parentNode.insertBefore(newButton, targetButton.nextSibling);
        }
    } else {
    }
}
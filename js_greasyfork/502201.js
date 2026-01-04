// ==UserScript==
// @name         我的文字修仙全靠刷 脚本
// @namespace    http://tampermonkey.net/
// @version      4.3.1
// @description  修仙小游戏脚本
// @author       mj
// @match        https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502201/%E6%88%91%E7%9A%84%E6%96%87%E5%AD%97%E4%BF%AE%E4%BB%99%E5%85%A8%E9%9D%A0%E5%88%B7%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/502201/%E6%88%91%E7%9A%84%E6%96%87%E5%AD%97%E4%BF%AE%E4%BB%99%E5%85%A8%E9%9D%A0%E5%88%B7%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


// 获取当前玩家对象player
const myPlayer = document.querySelector('.game-container-wrapper').__vue__.$store.state.player
// 获取当前路由对象
let currentRoutingObject = document.querySelector('.game-container-wrapper').__vue__.$router.currentRoute.matched[0].instances.default
// 提示框
let myTips = currentRoutingObject.$notify
// 定义多个用于存储定时器ID的变量
var intervalId1 = null;
var intervalId2 = null;
var intervalId3 = null;
var intervalId5 = false;
var attackInterval = null;
var fightIntervalId = null;
var restInterval = null;
var restartIntervalId = null;
var automaticSaleOfEquipmentId = null;
var petIntervalId = null;
var boosIntervalId = null;
var boosStart = true;
var buttonStatus1 = true ;
var buttonStatus2 = true ;
var buttonStatus3 = true ;

let allPets = [];

// 更新 allPets 数组的方法
const updateAllPets = () => {
    allPets = [
      ...myPlayer.pets,
      myPlayer.pet
    ];
  };
  
  

// 初始化 allPets
updateAllPets();

// 监听 myPlayer.pets 的变化
document.querySelector('.game-container-wrapper').__vue__.$watch(
  () => myPlayer.pets,
  (newPets, oldPets) => {
    updateAllPets();
  },
  { deep: true }
);

// 监听 myPlayer.pet 的变化
document.querySelector('.game-container-wrapper').__vue__.$watch(
  () => myPlayer.pet,
  (newPet, oldPet) => {
    updateAllPets();
  },
  { deep: true }
);



// 定时将boosStart设置为true
setInterval(() => {
    boosStart = true;  
}, 2 * 60 * 1000);  

// 清除所有定时器的函数
(function() {
    // 保存原始的 setInterval 方法
    const originalSetInterval = window.setInterval;

    // 存储所有 setInterval ID 的数组
    const intervalIds = [];

    // 重写 setInterval 方法
    window.setInterval = function(callback, delay) {
        const id = originalSetInterval(callback, delay);
        intervalIds.push(id);
        return id;
    };

    // 清除所有 setInterval 定时器的函数
    function clearAllIntervals() {
        intervalIds.forEach(id => clearInterval(id));
        intervalIds.length = 0; // 清空 intervalIds 数组
    }

    // 将 clearAllIntervals 方法暴露到全局作用域
    window.clearAllIntervals = clearAllIntervals;
})();

// 获取指定路由对象返回组件实例
function specifyRoutingObject(path) {
    const routerOptions = document.querySelector('.game-container-wrapper').__vue__.$router.options.routes
    return routerOptions.find(route => route.path === path).component
}


// 根据文字点击按钮
function clickButton(buttonText) {
    let buttons = document.querySelectorAll("button");
    for (let button of buttons) {
        if (button.innerText === buttonText) {
            button.click();
            return true;
        }
    }
    return false;
}

// 通用的点击按钮并等待DOM结构更新的函数
function clickButtonAndWaitForDOMUpdate(buttonName, callback) {
    // 点击按钮
    if (!clickButton(buttonName)) {
        console.error(`按钮 "${buttonName}" 未找到`);
        return;
    }

    // 创建一个MutationObserver实例来监听DOM变化
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 执行回调函数
                callback();

                // 停止观察
                observer.disconnect();
                break;
            }
        }
    });

    // 开始观察目标节点的变化
    observer.observe(document.body, { childList: true, subtree: true });

}

// 路由监听函数
function createRouteListener(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
  
    (function(history) {
      var pushState = history.pushState;
      var replaceState = history.replaceState;
  
      history.pushState = function(state, title, url) {
        var result = pushState.apply(history, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return result;
      };
  
      history.replaceState = function(state, title, url) {
        var result = replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return result;
      };
  
      window.addEventListener('popstate', function(event) {
        window.dispatchEvent(new Event('locationchange'));
      });
    })(window.history);
  
    window.addEventListener('locationchange', function() {
      // Adding a delay to ensure the Vue instance is fully updated
      setTimeout(function() {
        callback(window.location.pathname);
      }, 0);
    });
  }
createRouteListener(function() {
    var wrapper = document.querySelector('.game-container-wrapper');
    if (wrapper && wrapper.__vue__) {
        currentRoutingObject = wrapper.__vue__.$router.currentRoute.matched[0].instances.default;
    } else {
        console.log('当前路由对象未定义');
    }
});
  

// 修炼函数
function cultivateUntilMax() {
        currentRoutingObject.startCultivate();
        currentRoutingObject.startCultivate();
        currentRoutingObject.startCultivate();
        if(document.body.innerText.includes("当前境界修为已满")) {  
            if (currentRoutingObject.stopCultivate) {
                currentRoutingObject.stopCultivate();
                clearAllIntervals();
            }
            clickButtonAndWaitForDOMUpdate("返回家里", () => {
                cultivateExplore();
            }); 
            
        }
    
}

// 修炼专用探索
function cultivateExplore() {
    clickButton("探索秘境");

    function checkFightStatus() {
        if (document.body.innerText.includes("恭喜你突破了")) {
            clearAllIntervals();
            document.querySelector('.game-container-wrapper').__vue__.$router.push('/')
            // 等待一段时间后查找最新按钮
            setTimeout(() => {
                clickButtonAndWaitForDOMUpdate("开始修炼", () => {
                    intervalId1 = setInterval(() => {
                        cultivateUntilMax();
                    }, 1000);  // 每隔0.1秒检查一次弹窗状态
            }, 500)}); // 这里等待1秒，你可以根据实际情况调整时间
            return;
        }
        if (document.body.innerText.includes("被击败")) {
            clickButtonAndWaitForDOMUpdate("回家疗伤", () => {
                clearInterval(fightIntervalId);  // 停止定时器
                clearInterval(automaticSaleOfEquipmentId);  // 停止定时器
                cultivateExplore();
            }
            );
        } else if (document.body.innerText.includes("你击败") || document.body.innerText.includes("你输了")) {
            clickButton("继续探索");
        } else {
            if (currentRoutingObject.startFight) {
                currentRoutingObject.startFight();
            }
        }
    }

    automaticSaleOfEquipmentId = setInterval(() => {
        myAutoSellEquipment();
        console.log("自动出售装备功能已运行");
    }, 5000);  // 每隔5秒检查一次弹窗状态

    fightIntervalId = setInterval(checkFightStatus, 100);  // 每隔0.1秒检查一次状态
}

// 自动出售装备函数
function myAutoSellEquipment() {
    // 获取玩家背包装备
    const inventory = myPlayer.inventory;
    // 获取玩家装备出售设置
    const sellingEquipmen = myPlayer.sellingEquipmentData;
    // 过滤出可以出售的装备
    const selling = inventory.filter(item => sellingEquipmen.includes(item.quality) && !item.lock);
    // 检查是否有可售卖的装备
    if (!selling.length) {
        return;
    }
    // 计算未锁定装备与选中出售品阶的等级总和
    const strengtheningStoneTotal = selling.reduce((total, i) => {
        let level = i.level + i.level * myPlayer.reincarnation / 10;
        level = Number(level) || 0;
        return total + Math.floor(level);
    }, 0);
    // 增加炼器石数量
    myPlayer.strengtheningStone += strengtheningStoneTotal;
    // 清空背包内所有未锁定装备与选中出售的品阶
    myPlayer.inventory = inventory.filter(item => !sellingEquipmen.includes(item.quality) || item.lock);
    document.querySelector('.game-container-wrapper').__vue__.$store.commit('setPlayer', myPlayer);
    myTips({ title: '背包装备出售提示', message: `背包内所有非锁定装备已成功出售, 你获得了${strengtheningStoneTotal}个炼器石` });
}

// 探索函数
function autoExplore() {
    
    function fightLoop() {

        clickButton("探索秘境");

        function checkFightStatus() {


            if(myPlayer.level===40 && boosStart === true) {
                document.querySelector('.game-container-wrapper').__vue__.$router.push('/')
                clickButton("世界BOSS");
                boosIntervalId = setInterval(fightBossAndCheck, 100);
                waitForIntervalToFinish();
                return;
            }

            if (document.body.innerText.includes("被击败")) {
                clickButton("回家疗伤");
                clearInterval(fightIntervalId);  // 停止定时器
                if (!restartIntervalId) {
                    restartIntervalId = setInterval(() => {
                        fightLoop();
                        clearInterval(restartIntervalId);
                        restartIntervalId = null;
                    }, 100);  // 0.5秒后重新启动战斗
                }
            } else if (document.body.innerText.includes("你击败")||document.body.innerText.includes("你输了")) {
                clickButton("继续探索");
            } else {
                currentRoutingObject.startFight();
            }
        }

        automaticSaleOfEquipmentId = setInterval(() => {
            myAutoSellEquipment();
        }, 5000);  // 每隔5秒检查一次弹窗状态

        fightIntervalId = setInterval(checkFightStatus, 10);  // 每隔0.1秒检查一次状态
    }

    fightLoop();  // 启动战斗循环
}

function waitForIntervalToFinish() {
    const checkInterval = setInterval(() => {
        if (boosStart === false) {
            clearInterval(checkInterval); // 清除监视器
            autoExplore(); // 继续往下执行的函数
        }
    }, 100); // 每隔100毫秒检查一次
}

// 世界boss
function fightBossAndCheck() {
    // 执行 fightBoss 操作
    if (!currentRoutingObject.fightBoss){
        return;
    }
    currentRoutingObject.fightBoss();

    // 获取页面文本
    let pageText = document.body.innerText;
    
    // 检查页面文本是否包含特定的字符串
    if (pageText.includes("太弱被击败了") || pageText.includes("你击败") 
        || pageText.includes("你输了") || pageText.includes("BOSS还未刷新") || boosStart === false) {
        // 如果包含，则点击回家疗伤按钮
        clickButton("回家疗伤");
        // 停止定时器
        clearInterval(boosIntervalId);
        // 如果 boosStart 为 true，设置为 false
        boosStart = false;
        
    }
}


// 定义 autoPet() 函数
function autoPet() {
    // 检查玩家健康状态
    if (myPlayer.health === 0) {
        document.querySelector('.game-container-wrapper').__vue__.$router.push('/');
        return; // 返回首页后不再继续执行
    }

    // 点击“探索秘境”按钮
    clickButton("探索秘境")

    // 点击“收服对方”按钮
    clickButton("收服对方")
    // 检查是否出现“失败”文字
    if (document.body.innerText.includes("失败") ) {
        clickButton("发起战斗")
    }

    if (document.body.innerText.includes("你输了")) {
        clickButton("继续探索")
    }

    // 检查是否出现“成功”文字
    const successText = document.body.innerText.includes("成功");
    if (successText) {
        clickButton("继续探索")
    }

    // 检查是否出现“击败”文字
    const defeatText = document.body.innerText.includes("击败");
    if (defeatText) {
        clickButton("继续探索")
    }
}

// 定义一个函数来启动循环执行 autoPet()
function startAutoPet() {
    // 使用 setInterval() 函数来循环执行 autoPet()，这里设定每隔 1000 毫秒（即1秒）执行一次
    intervalId3 = setInterval(autoPet, 100);
}



// 初始化按钮的函数
function initializeButtons() {
    var gameContainer = document.querySelector('.game-container');

    if (gameContainer) {
        gameContainer.style.position = "relative";

        var buttonContainer = document.createElement("div");
        buttonContainer.style.position = "absolute";
        buttonContainer.style.top = "0px";
        buttonContainer.style.left = "50%";
        buttonContainer.style.transform = "translateX(-50%)";
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.zIndex = "9900";
        buttonContainer.style.borderRadius = "10px";

        var button1 = document.createElement("button");
        button1.innerHTML = "修炼";
        styleButton(button1);

        button1.onclick = function () {
            if (buttonStatus1 === true) {
                if (myPlayer.level === 40) {
                    myTips({title:'修炼提示',message:"已经修炼到最高级，无法继续自动修炼！"});
                    return;
                }
                clickButton("开始修炼");
                button1.innerHTML = "修炼";
                disableOtherButtons(button2);
                disableOtherButtons(button3);
                disableOtherButtons(button4);
                disableOtherButtons(button5);
                buttonStatus1 = false;
                console.log("自动修炼功能正在运行");
                myTips({title:'修炼提示',message:"自动修炼过程中会自动出售装备，请调整出售装备设置！"});
                intervalId1 = setInterval(() => {
                    cultivateUntilMax();
                }, 100);  // 每隔0.1秒检查一次弹窗状态  
            } else {
                intervalId1 = null;
                clearAllIntervals();
                button1.innerHTML = "修炼";
                enableAllButtons(button2);
                enableAllButtons(button3);
                enableAllButtons(button4);
                enableAllButtons(button5);
                buttonStatus1 = true;
                console.log("自动修炼功能已停止");
            }
        };

        var button2 = document.createElement("button");
        button2.innerHTML = "探索";
        styleButton(button2);

        button2.onclick = function () {
            if (buttonStatus2 === true) {
                intervalId2 = true;
                button2.innerHTML = "探索";
                disableOtherButtons(button1);
                disableOtherButtons(button3);
                disableOtherButtons(button4);
                disableOtherButtons(button5);
                buttonStatus2 = false;
                console.log("自动探索功能正在运行");
                myTips({title:'探索提示',message:"自动探索将自动出售装备，请调整出售装备设置！"});
                currentRoutingObject.sellingEquipmentShow=true;
                const checkPopupInterval = setInterval(() => {
                    if (!currentRoutingObject.sellingEquipmentShow) {
                        autoExplore();
                        clearInterval(checkPopupInterval); // 停止检查弹窗状态
                    }
                }, 100);  // 每隔0.1秒检查一次弹窗状态
            } else {
                intervalId2 = null;
                clearAllIntervals();
                button2.innerHTML = "探索";
                document.querySelector('.game-container-wrapper').__vue__.$router.push('/')
                enableAllButtons(button1);
                enableAllButtons(button3);
                enableAllButtons(button4);
                enableAllButtons(button5);
                buttonStatus2 = true;
                console.log("自动探索功能已停止");
            }
        };

        var button3 = document.createElement("button");
        button3.innerHTML = "收宠";
        styleButton(button3);

        button3.onclick = function () {
            if (buttonStatus3 === true) {
                button3.innerHTML = "收宠";
                disableOtherButtons(button1);
                disableOtherButtons(button2);
                disableOtherButtons(button4);
                disableOtherButtons(button5);
                buttonStatus3 = false;
                console.log("自动收宠功能正在运行");
                myTips({title:'收宠提示',message:"自动收宠将自动出售装备，请调整出售装备设置！"});
                currentRoutingObject.sellingEquipmentShow=true;
                const checkPopupInterval = setInterval(() => {
                    if (!currentRoutingObject.sellingEquipmentShow ) {
                        startAutoPet();
                        clearInterval(checkPopupInterval); // 停止检查弹窗状态
                    }
                }, 100);  // 每隔0.1秒检查一次弹窗状态
            } else {
                clearAllIntervals();
                intervalId3 = null;
                button3.innerHTML = "收宠";
                enableAllButtons(button1);
                enableAllButtons(button2);
                enableAllButtons(button4);
                enableAllButtons(button5);
                buttonStatus3 = true;
                console.log("自动收宠功能已停止");
            }
        }

        // 增加自动放宠按钮
        var button4 = document.createElement("button");
        button4.innerHTML = "放宠";
        styleButton(button4);

        button4.onclick = function () {
            let confirmRelease = confirm("确定要放生所有未出战灵宠吗？");
            if (confirmRelease) {
                myPlayer.pets = [];
                document.querySelector('.game-container-wrapper').__vue__.$store.commit('setPlayer', myPlayer);
                myTips({title:'放宠提示',message:"已成功放生所有未出战灵宠！"});
                return;
            }
        }

        // 增加灵宠榜按钮
        var button5 = document.createElement("button");
        button5.innerHTML = "灵宠榜";
        styleButton(button5);

        var overlay = document.createElement("div");
        overlay.style.display = "none"; // 默认隐藏遮罩层
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.zIndex = "9998"; // 确保在最上层

        // 创建弹框
        var dialog = document.createElement("div");
        dialog.style.position = "fixed";
        dialog.style.top = "50%";
        dialog.style.left = "50%";
        dialog.style.transform = "translate(-50%, -50%)";
        dialog.style.width = "300px";
        dialog.style.maxHeight = "600px"; // 设置最大高度
        dialog.style.padding = "20px";
        dialog.style.backgroundColor = "white";
        dialog.style.boxShadow = "0px 0px 15px rgba(0, 0, 0, 0.2)";
        dialog.style.borderRadius = "5px";
        dialog.style.zIndex = "10000"; // 在遮罩层之上
        dialog.style.overflowY = "auto"; // 启用垂直滚动条

        // 添加“灵宠榜”文字
        var title = document.createElement("h4");
        title.innerText = "灵宠榜";
        title.style.textAlign = "center"; // 居中显示文字
        title.style.marginBottom = "10px"; // 下方留出一定的空间
        dialog.appendChild(title);

        // 创建排序按钮容器
        var sortContainer = document.createElement("div");
        sortContainer.style.display = "flex";
        sortContainer.style.justifyContent = "space-around";
        sortContainer.style.marginBottom = "10px";

        // 创建排序按钮
        function createStyledButton(text, onClickHandler) {
            var button = document.createElement("button");
            button.innerText = text;
            button.style.padding = "5px 10px";
            button.style.margin = "2px";
            button.style.fontSize = "15px";
            button.style.color = "#fff";
            button.style.backgroundColor = "#007BFF";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.transition = "background-color 0.3s ease";

            button.onmouseover = function() {
                button.style.backgroundColor = "#0056b3";
            };

            button.onmouseout = function() {
                button.style.backgroundColor = "#007BFF";
            };

            button.onclick = onClickHandler;

            return button;
        }

        var sortByTotal = createStyledButton("综合", function () {
            sortPets('total');
        });

        var sortByHealth = createStyledButton("生命值", function () {
            sortPets('health');
        });

        var sortByAttack = createStyledButton("攻击力", function () {
            sortPets('attack');
        });

        var sortByDefense = createStyledButton("防御力", function () {
            sortPets('defense');
        });

        // 将排序按钮添加到容器
        sortContainer.appendChild(sortByTotal);
        sortContainer.appendChild(sortByHealth);
        sortContainer.appendChild(sortByAttack);
        sortContainer.appendChild(sortByDefense);

        // 将排序按钮容器添加到弹框
        dialog.appendChild(sortContainer);

        // 宠物列表容器
        var petListContainer = document.createElement("div");
        dialog.appendChild(petListContainer);

        // 排序并显示宠物列表的函数
        function sortPets(criteria) {

            // 排序逻辑
            if (Array.isArray(allPets)) {
                allPets.sort(function (a, b) {
                    if (criteria === 'total') {
                        return (b.health + b.attack + b.defense) - (a.health + a.attack + a.defense);
                    } else {
                        return b[criteria] - a[criteria];
                    }
                });
            } else {
                console.error("allPets is not an array.");
            }

            // 清空现有的宠物列表
            petListContainer.innerHTML = '';

            // 遍历排序后的allPets数组并显示元素
            if (allPets.length > 0) {
                allPets.forEach(function(pet, index) {
                    // 创建宠物信息容器
                    var petContainer = document.createElement("div");
                    petContainer.style.display = "flex";
                    petContainer.style.justifyContent = "space-between";
                    petContainer.style.alignItems = "center";
                    petContainer.style.marginBottom = "10px";
                    petContainer.style.padding = "5px";
                    petContainer.style.border = "1px solid #ccc";
                    petContainer.style.borderRadius = "5px";

                    // 宠物信息容器左侧
                    var petInfoContainer = document.createElement("div");

                    // 显示宠物名称
                    var petName = document.createElement("p");
                    petName.innerText = (index + 1) + ". " + pet.name;
                    petName.style.fontWeight = "bold";
                    petInfoContainer.appendChild(petName);

                    // 显示宠物属性
                    var petAttributes = document.createElement("p");
                    petAttributes.innerText = 
                    "生命值: " + pet.health + "\n" +
                    "攻击力: " + pet.attack + "\n" +
                    "防御力: " + pet.defense + "\n" +
                    "闪避率: " + `${(pet.dodge * 100).toFixed(2)}%` + "\n" +
                    "暴击率: " + `${(pet.critical * 100).toFixed(2)}%`;
                    if(petAttributes.innerText.includes("NaN") || petAttributes.innerText.includes("undefined")) {
                        return;
                    }
                    petAttributes.style.whiteSpace = "pre-line"; // 保持换行
                    petInfoContainer.appendChild(petAttributes);

                    // 显示出战状态
                    if (pet === myPlayer.pet) {
                        var battleStatus = document.createElement("p");
                        battleStatus.innerText = "状态: 已出战";
                        battleStatus.style.color = "green";
                        petInfoContainer.appendChild(battleStatus);
                    }

                    // 将宠物信息容器左侧添加到宠物信息容器
                    petContainer.appendChild(petInfoContainer);

                    // 宠物信息容器右侧
                    var buttonsContainer = document.createElement("div");

                    // 创建放生按钮
                    var releaseButton = document.createElement("button");
                    releaseButton.innerText = "放生";
                    releaseButton.style.marginLeft = "10px";
                    releaseButton.style.padding = "5px 10px";
                    releaseButton.style.marginLeft = "10px";
                    releaseButton.style.padding = "5px 10px";
                    releaseButton.style.backgroundColor = "#dc3545";
                    releaseButton.style.color = "white";
                    releaseButton.style.border = "none";
                    releaseButton.style.borderRadius = "5px";
                    releaseButton.style.cursor = "pointer";

                    releaseButton.onmouseover = function() {
                        releaseButton.style.backgroundColor = "#c82333";
                    };

                    releaseButton.onmouseout = function() {
                        releaseButton.style.backgroundColor = "#dc3545";
                    };

                    releaseButton.onclick = function() {
                        releasePet(pet);
                    };

                    buttonsContainer.appendChild(releaseButton);

                    // 创建出战按钮
                    var battleButton = document.createElement("button");
                    if (pet === myPlayer.pet) {
                        battleButton.innerText = "已出战";
                        battleButton.disabled = true;
                        battleButton.style.backgroundColor = "darkgray";
                    } else {
                        battleButton.innerText = "未出战";
                        battleButton.style.backgroundColor = "#28a745";
                        battleButton.onclick = function() {
                            switchBattlePet(pet);
                        };
                    }

                    battleButton.style.marginLeft = "10px";
                    battleButton.style.padding = "5px 10px";
                    battleButton.style.color = "white";
                    battleButton.style.border = "none";
                    battleButton.style.borderRadius = "5px";
                    battleButton.style.cursor = pet === myPlayer.pet ? "not-allowed" : "pointer";

                    battleButton.onmouseover = function() {
                        if (!battleButton.disabled) {
                            battleButton.style.backgroundColor = "#218838";
                        }
                    };

                    battleButton.onmouseout = function() {
                        if (!battleButton.disabled) {
                            battleButton.style.backgroundColor = "#28a745";
                        }
                    };

                    buttonsContainer.appendChild(battleButton);

                    // 将按钮容器添加到宠物信息容器
                    petContainer.appendChild(buttonsContainer);

                    // 将宠物信息容器添加到弹框
                    petListContainer.appendChild(petContainer);
                });
            } else {
                var noPets = document.createElement("p");
                noPets.innerText = "当前没有灵宠。";
                noPets.style.textAlign = "center";
                noPets.style.color = "gray";
                petListContainer.appendChild(noPets);
            }
        }
        function releasePet(pet) {
            if (pet === myPlayer.pet) {
                myPlayer.pet = {};
            } else {
                var index = myPlayer.pets.indexOf(pet);
                if (index !== -1) {
                    myPlayer.pets.splice(index, 1);
                }
            }
            sortPets('total');
        }
        
        function switchBattlePet(newPet) {
            var oldPet = myPlayer.pet;
            myPlayer.pet = newPet;
        
            if (oldPet && Object.keys(oldPet).length > 0) {
                myPlayer.pets.push(oldPet);
            }
        
            var index = myPlayer.pets.indexOf(newPet);
            if (index !== -1) {
                myPlayer.pets.splice(index, 1);
            }
            sortPets('total');
        }

        // 默认按综合排序
        sortPets('total');

        // 创建关闭按钮
        var closeButton = document.createElement("span");
        closeButton.innerHTML = "&times;";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "20px";
        // 将关闭按钮添加到弹框
        dialog.appendChild(closeButton);

        // 将弹框和遮罩层添加到body
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        button5.onclick = function () {
            sortPets('total');
            if (overlay.style.display === "block") {
                overlay.style.display = "none";
                enableAllButtons(button1);
                enableAllButtons(button2);
                enableAllButtons(button3);
                enableAllButtons(button4);
            } else {
            overlay.style.display = "block";
            disableOtherButtons(button1);
            disableOtherButtons(button2);
            disableOtherButtons(button3);
            disableOtherButtons(button4);
            }
        }
        overlay.onclick = function (event) {
            if (event.target === overlay || event.target === closeButton) {
                overlay.style.display = "none";
                enableAllButtons(button1);
                enableAllButtons(button2);
                enableAllButtons(button3);
                enableAllButtons(button4);
            }
        }


        buttonContainer.appendChild(button1);
        buttonContainer.appendChild(button2);
        buttonContainer.appendChild(button3);
        buttonContainer.appendChild(button4);
        buttonContainer.appendChild(button5);
        gameContainer.appendChild(buttonContainer);
        myTips({title:'脚本初始化',message:"脚本初始化成功！",type:"success"});



    } else {
        myTips({title:'脚本初始化',message:"脚本初始化失败，请刷新页面后重试！",type:"error"});
    }
}

function styleButton(button) {
    button.style.padding = "5px 10px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "white";
    button.style.fontSize = "16px";
    // button.style.cursor = "pointer";
    // button.style.transition = "background-color 0.3s, transform 0.3s";

    // button.onmouseover = function() {
    //     if (!button.disabled) {
    //         button.style.backgroundColor = "#0056b3";
    //     }
    // };

    // button.onmouseout = function() {
    //     if (!button.disabled) {
    //         button.style.backgroundColor = "#007bff";
    //     }
    // };

    // button.onmousedown = function() {
    //     if (!button.disabled) {
    //         button.style.backgroundColor = "#004494";
    //     }
    // };

    // button.onmouseup = function() {
    //     if (!button.disabled) {
    //         button.style.backgroundColor = "#0056b3";
    //     }
    // };
}

function disableOtherButtons(activeButton) {
    activeButton.disabled = true;
    activeButton.style.backgroundColor = "darkgray";
    activeButton.style.cursor = "not-allowed";
}

function enableAllButtons(activeButton) {
    activeButton.disabled = false;
    activeButton.style.backgroundColor = "#007bff";
    activeButton.style.cursor = "pointer";
}

initializeButtons();
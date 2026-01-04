// ==UserScript==
// @name         猫国科学家简易版
// @namespace    http://example.com/
// @version      2.0
// @description  设置猫国建设者，最小化和移动功能，修改所有道具的数量
// @author       Your Name
// @license      MIT
// @match        https://lolitalibrary.com/maomao/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517860/%E7%8C%AB%E5%9B%BD%E7%A7%91%E5%AD%A6%E5%AE%B6%E7%AE%80%E6%98%93%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/517860/%E7%8C%AB%E5%9B%BD%E7%A7%91%E5%AD%A6%E5%AE%B6%E7%AE%80%E6%98%93%E7%89%88.meta.js
// ==/UserScript==

(function waitForGamePage() {
    if (typeof gamePage !== "undefined" && gamePage.resPool && gamePage.resPool.get) {
        initializeUI(); // 初始化UI
    } else {
        setTimeout(waitForGamePage, 100); // 每100ms检查一次，确保gamePage对象已加载
    }
})();

function initializeUI() {
    if (!document.getElementById("resourceDisplay")) {
        const resourceContainer = document.createElement("div");
        resourceContainer.id = "resourceDisplay";
        resourceContainer.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            width: 200px;
            cursor: move;
        `;

        // 定义所有资源类型
        const resources = {
            "catnip": "猫薄荷",
            "wood": "木材",
            "minerals": "矿物",
            "coal": "煤",
            "iron": "铁",
            "titanium": "钛",
            "gold": "黄金",
            "oil": "石油",
            "unobtainium": "难得素",
            "antimatter": "反物质",
            "manpower": "喵力",
            "science": "科学",
            "culture": "文化",
            "faith": "信仰",
            "starchart": "星图",
            "furs": "毛皮",
            "ivory": "象牙",
            "spice": "香料",
            "unicorns": "独角兽",
            "alicorn": "天角兽",
            "tears": "眼泪",
            "paragon": "领导力",
            "timeCrystal": "时间水晶",
            "relic": "遗物",
            "void": "虚空",
            "beam": "木梁",
            "slab": "石板",
            "late": "金属板",
            "steel": "钢",
            "concrate": "混凝土",
            "gear": "齿轮",
            "alloy": "合金",
            "eludium": "E合金",
            "scaffold": "脚手架",
            "ship": "船",
            "tanker": "游轮",
            "kerosene": "煤油",
            "parchment": "羊皮纸",
            "manuscript": "手稿",
            "compedium": "概要",
            "blueprint": "蓝图",
            "thorium": "钍",
            "megalith": "巨石",
            "temporalFlux": "时间流量",
            "uranium": "铀"
        };

        // 创建下拉菜单
        const selectElement = document.createElement("select");
        selectElement.id = "resourceSelect";
        Object.keys(resources).forEach(resourceKey => {
            const option = document.createElement("option");
            option.value = resourceKey;
            option.textContent = resources[resourceKey];
            selectElement.appendChild(option);
        });

        // 创建数量输入框
        const inputElement = document.createElement("input");
        inputElement.type = "number";
        inputElement.id = "resourceAmount";
        inputElement.value = 100;
        inputElement.style = "width: 60px; margin-top: 10px;";

        // 创建修改单个按钮
        const buttonElement = document.createElement("button");
        buttonElement.id = "setResourceButton";
        buttonElement.textContent = "设置数量";
        buttonElement.style = "margin-top: 10px; padding: 5px 10px;";

        // 创建修改所有道具按钮
        const setAllButton = document.createElement("button");
        setAllButton.id = "setAllButton";
        setAllButton.textContent = "修改所有道具";
        setAllButton.style = "margin-top: 10px; padding: 5px 10px;";

        // 创建最小化按钮
        const minimizeButton = document.createElement("button");
        minimizeButton.id = "minimizeButton";
        minimizeButton.textContent = "最小化";
        minimizeButton.style = "margin-top: 10px; padding: 5px 10px;";

        // 将所有元素添加到容器中
        resourceContainer.appendChild(selectElement);
        resourceContainer.appendChild(inputElement);
        resourceContainer.appendChild(buttonElement);
        resourceContainer.appendChild(setAllButton);
        resourceContainer.appendChild(minimizeButton);

        document.body.appendChild(resourceContainer);

        // 绑定设置单个资源按钮点击事件
        document.getElementById("setResourceButton").addEventListener("click", function() {
            const resourceName = document.getElementById("resourceSelect").value;
            const resourceAmount = parseInt(document.getElementById("resourceAmount").value);
            
            if (isNaN(resourceAmount) || resourceAmount <= 0) {
                alert("请输入一个正整数!");
                return;
            }

            const resource = gamePage.resPool.get(resourceName);
            if (resource) {
                resource.value = resourceAmount; // 设置选中资源的数量
            }
        });

        // 绑定修改所有道具按钮点击事件
        document.getElementById("setAllButton").addEventListener("click", function() {
            const resourceAmount = parseInt(document.getElementById("resourceAmount").value);
            
            if (isNaN(resourceAmount) || resourceAmount <= 0) {
                alert("请输入一个正整数!");
                return;
            }

            // 按顺序修改所有资源
            Object.keys(resources).forEach(resourceKey => {
                const resource = gamePage.resPool.get(resourceKey);
                if (resource) {
                    resource.value = resourceAmount;
                }
            });

            alert("所有道具数量已更新！");
        });

        // 绑定最小化按钮点击事件
        let isMinimized = false;
        document.getElementById("minimizeButton").addEventListener("click", function() {
            if (isMinimized) {
                resourceContainer.innerHTML = "";
                resourceContainer.appendChild(selectElement);
                resourceContainer.appendChild(inputElement);
                resourceContainer.appendChild(buttonElement);
                resourceContainer.appendChild(setAllButton);
                resourceContainer.appendChild(minimizeButton);
                resourceContainer.style.width = "200px";
                resourceContainer.style.height = "auto";
                resourceContainer.style.opacity = "1";
                minimizeButton.textContent = "最小化";
                enableDrag(); // 启用拖动功能
            } else {
                resourceContainer.innerHTML = "";
                const minimizedButton = document.createElement("button");
                minimizedButton.textContent = "恢复";
                minimizedButton.style = "padding: 5px 10px;";
                minimizedButton.addEventListener("click", function() {
                    resourceContainer.innerHTML = "";
                    resourceContainer.appendChild(selectElement);
                    resourceContainer.appendChild(inputElement);
                    resourceContainer.appendChild(buttonElement);
                    resourceContainer.appendChild(setAllButton);
                    resourceContainer.appendChild(minimizeButton);
                    resourceContainer.style.width = "200px";
                    resourceContainer.style.height = "auto";
                    resourceContainer.style.opacity = "1";
                    minimizeButton.textContent = "最小化";
                    isMinimized = false;
                    enableDrag(); // 启用拖动功能
                });
                resourceContainer.appendChild(minimizedButton);
                resourceContainer.style.width = "60px";
                resourceContainer.style.height = "30px";
                resourceContainer.style.opacity = "0.5";
                minimizeButton.textContent = "最小化";
                isMinimized = true;
                disableDrag(); // 禁用拖动功能
            }
        });

        // 拖动相关函数
        let offsetX, offsetY;
        function enableDrag() {
            resourceContainer.addEventListener("mousedown", function(e) {
                offsetX = e.clientX - resourceContainer.getBoundingClientRect().left;
                offsetY = e.clientY - resourceContainer.getBoundingClientRect().top;
                document.addEventListener("mousemove", moveElement);
                document.addEventListener("mouseup", function() {
                    document.removeEventListener("mousemove", moveElement);
                });
            });
        }

        function disableDrag() {
            resourceContainer.removeEventListener("mousedown", function() {});
        }

        function moveElement(e) {
            resourceContainer.style.left = e.clientX - offsetX + "px";
            resourceContainer.style.top = e.clientY - offsetY + "px";
        }

        // 初始化时禁用拖动
        disableDrag();
    }
}

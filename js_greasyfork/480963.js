// ==UserScript==
// @name         头歌助手低调版
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  题库仅仅针对uva题目 可复制粘贴
// @author       SunSeaLucky&&Jser
// @match        https://trustie.educoder.net/*
// @icon         none
// @grant        none
// @run-at       document-start
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.5/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/480963/%E5%A4%B4%E6%AD%8C%E5%8A%A9%E6%89%8B%E4%BD%8E%E8%B0%83%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/480963/%E5%A4%B4%E6%AD%8C%E5%8A%A9%E6%89%8B%E4%BD%8E%E8%B0%83%E7%89%88.meta.js
// ==/UserScript==

//设置随机测试时间区间上限
const max = 30000;
//设置随机测试时间区间下限
const min = 5000;
// 目前设置随机时间的方法出现严重Bug，请谨慎使用！若仍想快速刷时间，请进入微信头歌小程序，在对应的实例界面左右滑动，可快速刷到int最大值
const setRandomTime = false;

(function () {

    //响应劫持 破解复制粘贴
    let oldFetch = fetch;
    function hookFetch(...args) {
        return new Promise((resolve, reject) => {
            oldFetch.apply(this, arguments).then((response) => {
                //匹配响应对应的请求
                if (arguments[0].indexOf('homework_common_id') !== -1) {
                    const oldJson = response.json;
                    response.json = function () {
                        return new Promise((resolve, reject) => {
                            oldJson.apply(this, arguments).then((result) => {
                                //修改响应部分
                                if (setRandomTime) result.game.cost_time = Math.floor(Math.random() * (max - min + 1)) + min;
                                result.shixun.forbid_copy = false;
                                result.shixun.vip = true;
                                //修改响应部分
                                resolve(result);
                            });
                        });
                    };
                }
                resolve(response);
            });
        });
    }
    // 劫持fetch
    window.fetch = hookFetch;

    //加载完毕 响应窗口
    window.onload = function () {
        // 创建 link 元素
        var linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://cdn.jsdelivr.net/npm/picnic';
        // 将 link 元素添加到 head 元素中
        document.head.appendChild(linkElement);

        // 创建一个 <div> 元素
        var div = document.createElement("div");
        div.classList.add('JSer_Mian');
        // 添加窗口样式
        div.style.position = "fixed";
        div.style.top = "25%";
        div.style.left = "25%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.width = "400px";
        div.style.maxHeight = "400px";
        div.style.height = "200x";
        div.style.overflowY = "scroll";
        div.style.backgroundColor = "lightgray";
        div.style.border = "1px solid gray";
        div.style.borderRadius = "5px";
        div.style.padding = "20px";
        div.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.3)";
        div.style.zIndex = "9999";
        div.style.transition = "transform 0.3s ease-in-out"; // 添加过渡效果
        div.style.display = "block";

        // 添加内容
        // 将 <div> 元素插入到页面中
        document.body.appendChild(div);

        // 添加按下 F2 键隐藏/显示功能
        let isview = true;
        document.addEventListener("keydown", function (event) {
            if (event.key === "F2") {
                if (isview) {
                    div.style.display = "block";
                }
                else {
                    div.style.display = "none";
                }
                isview = !isview;
            }
        });

        // 设置容器
        let con = document.createElement("div");
        con.style.width = "350px";
        con.style.height = "auto";
        con.style.display = "flex";
        con.style.flexDirection = "column";
        // con.style.justifyContent = "center";
        div.appendChild(con);

        // 创建元素
        let code = document.createElement("div");
        code.classList.add('code');
        let bt_select = document.createElement("button");
        let bt_find = document.createElement("button");
        let codenum = document.createElement("input");
        

        // 元素样式
        codenum.style.width = "100px";
        codenum.style.height = "30px";
        codenum.placeholder = "序号即可"

        bt_select.style.width = "100px";
        bt_select.style.height = "30px";
        bt_select.textContent = "全选";
        bt_select.style.fontSize = "12px";
        bt_select.classList.add('success');

        bt_find.style.width = "100px";
        bt_find.style.height = "30px";
        bt_find.textContent = "查找";
        bt_find.style.fontSize = "12px";

        // 转义pre标签内容
        function filterString(str) {
            const filteredStr = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return filteredStr;
        };

        let msg = document.createElement("span");
        msg.style.textAlign = "center";
        con.appendChild(msg).textContent = "F2切换 隐藏/显示 可复制粘贴";
        con.appendChild(codenum);
        con.appendChild(bt_find);
        con.appendChild(bt_select);

        // 按钮点击事件监听  发出请求
        bt_find.addEventListener('click', () => {
            // console.log(`https://6k7f936939.yicp.fun/index.php?codeNumber=${codenum.value}`);//老接口 测试接口
            fetch(`https://service-q3vdttin-1301163996.bj.apigw.tencentcs.com/release/FuckEducoder?question=${codenum.value}&vertification=DLloIbnmoTpobbpg6gKdm9pZCBwaWxlX29udG8oaW50IHAsIG`, {
                method: "POST",
            }).then(Response => {
                if (Response.ok) {
                    return Response.text();
                }
                else {
                    throw new Error('请求失败');
                }
            }).then(data => {
                // console.log(typeof(data));
                data = Base64.decode(data);
                let Htstr = filterString(data);
                code.innerHTML = `<pre>${Htstr}</pre>`;
                con.appendChild(code);
            }).catch(error => {
                console.log("NONO", error);
            })

        });

        // 按钮点击事件监听 全选
        bt_select.addEventListener('click', () => {
            const codeElement = code.querySelector('pre');
            const range = document.createRange();
            range.selectNodeContents(codeElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            codeElement.focus();
        });
    }
})();
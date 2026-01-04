// ==UserScript==
// @name         破产版微博抽奖小助手
// @version      0.1
// @description  在微博转发键之前添加抽奖按钮，加载转发用户并随机抽奖，允许多次抽奖不重复
// @author       ✌
// @license      MIT
// @match        https://weibo.com/*/*
// @namespace    https://greasyfork.org/users/1384897
// @downloadURL https://update.greasyfork.org/scripts/519693/%E7%A0%B4%E4%BA%A7%E7%89%88%E5%BE%AE%E5%8D%9A%E6%8A%BD%E5%A5%96%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519693/%E7%A0%B4%E4%BA%A7%E7%89%88%E5%BE%AE%E5%8D%9A%E6%8A%BD%E5%A5%96%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var retweet_button = document.querySelector(".toolbar_retweet_1L_U5");
        if (!retweet_button) {
            console.error("未找到转发按钮，请检查选择器是否正确！");
            return;
        }

        var lottery_button = document.createElement("div");
        lottery_button.className = "woo-box-flex woo-box-alignCenter woo-box-justifyCenter toolbar_lottery_1ky_D toolbar_wrap_np6Ug toolbar_cursor_34j5V";
        lottery_button.innerHTML = `
            <span class="toolbar_num_JXZul">抽奖</span>
        `;

        var parentContainer = retweet_button.parentNode.parentNode;
        parentContainer.insertBefore(lottery_button, retweet_button.parentNode);
        parentContainer.style.display = "flex";
        parentContainer.style.flexWrap = "nowrap";
        parentContainer.style.justifyContent = "space-around";

        var documentData = {
            ready_shuffle: false,
            users: {},
            winners: new Set()
        };

        function get_post() {
            var post_id = document.URL.split(/[#,/?]/g)[4];
            if (!post_id) {
                alert("无法获取帖子 ID，请确保在正确的微博帖子页面！");
                return;
            }
            return fetch(`https://weibo.com/ajax/statuses/show?id=${post_id}`)
                .then(response => response.json());
        }

        function get_next_page(arg_data) {
            if (arg_data.page <= arg_data.max_page || arg_data.page === 1) {
                return fetch(`https://weibo.com/ajax/statuses/repostTimeline?id=${arg_data.id}&page=${arg_data.page}&count=20`)
                    .then(response => response.json())
                    .then(data => {
                        data.data.forEach(user => {
                            arg_data.users[user.user.id] = {
                                name: user.user.screen_name,
                                time: new Date(user.created_at)
                            };
                        });
                        arg_data.page++;
                        arg_data.max_page = data.max_page || arg_data.page;
                    })
                    .then(() => get_next_page(arg_data));
            } else {
                return arg_data.users;
            }
        }

        function load_users() {
            if (documentData.ready_shuffle) {
                alert("用户列表已经加载完成！");
                return;
            }
            alert("正在加载转发用户，请稍等...");
            get_post()
                .then(post_data => {
                    return {
                        id: post_data.id,
                        page: 1,
                        max_page: -1,
                        users: {}
                    };
                })
                .then(arg_data => get_next_page(arg_data))
                .then(users => {
                    documentData.ready_shuffle = true;
                    documentData.users = users;
                    alert(`加载完成，共 ${Object.keys(users).length} 个转发用户！`);
                })
                .catch(error => {
                    console.error("加载用户出错：", error);
                    alert("加载用户失败，请重试！");
                });
        }

        function formatDateToLocalString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function draw_award() {
            if (!documentData.ready_shuffle) {
                alert("请先加载用户列表！");
                return;
            }

            var now = new Date();
            now.setHours(now.getHours() + 8);
            var default_date = now.toISOString().slice(0, 19).replace('T', ' ');
            var cutoff_date_input = prompt("请输入抽奖截止时间（格式：2024-12-05 23:59:59）：", default_date);

            if (cutoff_date_input === null) {
                return;
            }
            var cutoff_date = new Date(cutoff_date_input);
            if (isNaN(cutoff_date)) {
                alert("无效的时间格式，请重新输入！");
                return;
            }

            var count_input = prompt("请输入抽奖人数：", "1");
            if (count_input === null) {
                return;
            }
            var count = parseInt(count_input);
            if (isNaN(count) || count <= 0) {
                alert("无效的抽奖人数，请重新输入！");
                return;
            }

            var users = Object.keys(documentData.users).filter(uid => {
                return (
                    documentData.users[uid].time < cutoff_date &&
                    !documentData.winners.has(uid)
                );
            });

            if (users.length === 0) {
                alert("没有符合条件的用户！");
                return;
            }

            if (users.length < count) {
                alert(`符合条件的用户只有 ${users.length} 人，无法抽取 ${count} 个中奖者！`);
                count = users.length;
            }

            shuffleArray(users);

            var winners = users.slice(0, count);
            var result = `共 ${count} 名中奖者：\n\n`;

            winners.forEach((uid, index) => {
                var user = documentData.users[uid];
                documentData.winners.add(uid);
                result += `第 ${index + 1} 位中奖者：\n`;
                result += `微博 ID: ${uid}\n`;
                result += `昵称: ${user.name}\n`;
                result += `转发时间: ${formatDateToLocalString(user.time)}\n\n`;
            });

            displayResultInCenter(result, winners);
            console.log("抽奖结果：", result);
        }

        function displayResultInCenter(result, winners) {
            var resultDiv = document.createElement("div");
            resultDiv.style.position = "fixed";
            resultDiv.style.top = "50%";
            resultDiv.style.left = "50%";
            resultDiv.style.transform = "translate(-50%, -50%)";
            resultDiv.style.backgroundColor = "#ffffff";
            resultDiv.style.border = "1px solid #ccc";
            resultDiv.style.borderRadius = "10px";
            resultDiv.style.padding = "20px";
            resultDiv.style.zIndex = 10000;
            resultDiv.style.width = "450px";
            resultDiv.style.maxHeight = "80%";
            resultDiv.style.overflowY = "auto";
            resultDiv.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.2)";
            resultDiv.style.fontFamily = "Arial, sans-serif";
            resultDiv.style.textAlign = "center";

            var mentions = winners.map(uid => `@${documentData.users[uid].name}`).join(" ");

            resultDiv.innerHTML = `
        <h3 style="margin: 0 0 15px; font-size: 24px; color: #333;">🎉 抽奖结果 🎉</h3>
        <pre style="text-align: left; font-size: 16px; line-height: 1.5; color: #555; background-color: #f9f9f9; border: 1px solid #eee; padding: 10px; border-radius: 5px; overflow-x: auto;">${result}</pre>
        <div style="margin-top: 10px; font-size: 16px; color: #333; text-align: left;">
            <strong>艾特中奖人：</strong><br>
            ${mentions}
        </div>
        <button id="closeResult" style="
            margin-top: 15px;
            padding: 10px 20px;
            background: linear-gradient(45deg, #6ab7ff, #4caf50);
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        ">关闭</button>
    `;

            document.body.appendChild(resultDiv);

            var closeButton = document.getElementById("closeResult");

            closeButton.addEventListener("mouseover", function () {
                closeButton.style.background = "linear-gradient(45deg, #4caf50, #6ab7ff)";
                closeButton.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
            });

            closeButton.addEventListener("mouseout", function () {
                closeButton.style.background = "linear-gradient(45deg, #6ab7ff, #4caf50)";
                closeButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            });

            closeButton.addEventListener("click", function () {
                document.body.removeChild(resultDiv);
            });
        }

        lottery_button.addEventListener('click', function() {
            if (!documentData.ready_shuffle) {
                load_users();
            } else {
                draw_award();
            }
        });

        console.log("抽奖按钮已成功添加！");
    }, 1000);
})();
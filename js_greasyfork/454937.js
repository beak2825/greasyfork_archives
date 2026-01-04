// ==UserScript==
// @name         微博抽奖小助手（非官方）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  打开微博帖子页面，按L载入转发用户，按S抽奖。
// @author       Kasei
// @match        https://weibo.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454937/%E5%BE%AE%E5%8D%9A%E6%8A%BD%E5%A5%96%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9D%9E%E5%AE%98%E6%96%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/454937/%E5%BE%AE%E5%8D%9A%E6%8A%BD%E5%A5%96%E5%B0%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E9%9D%9E%E5%AE%98%E6%96%B9%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(function() {
        // Get infromation based on URL
        var url_component = document.URL.split(/[#,/?]/g);
        document.uid = url_component[3];
        document.post_id = url_component[4];
        if (!/^[0-9]+$/.test(document.uid) || !/^[A-Za-z0-9]+$/.test(document.post_id)) {
            console.log("Not a post page");
            return;
        }
        // GUI
        var button_container = document.querySelector("footer>div.woo-box-flex.woo-box-alignCenter");
        var button_element = button_container.children[0].cloneNode(true);
        button_container.appendChild(button_element);
        var button_text = button_element.querySelector(".woo-box-alignCenter>span");
        button_text.innerHTML = ' 抽奖 ';
        // button_element.querySelector(".woo-pop-ctrl").setAttribute("id", "shuffle");
        // Load post information
        function get_post() {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            return fetch(`https://weibo.com/ajax/statuses/show?id=${document.post_id}`, requestOptions);
        }
        // Load re-post page
        function get_next_page() {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            if (document.arg_data.page == 1 || document.arg_data.page <= document.arg_data.max_page) {
                console.log(`Loading Page ${document.arg_data.page}`);
                if (button_text) {
                    var percentage = document.arg_data.page / document.arg_data.max_page * 100;
                    button_text.innerHTML = `${percentage > 0?percentage.toFixed(2):0}%`;
                }
                return fetch(`https://weibo.com/ajax/statuses/repostTimeline?id=${document.arg_data.id}&page=${document.arg_data.page}&moduleID=feed&count=${document.arg_data.page==1?10:20}`, requestOptions)
                    .then((response) => {
                        return response.json();
                    }).then((repost_data) => {
                        repost_data.data.forEach((dat) => {
                            document.arg_data.users[dat.user.id] = {
                                "name": dat.user.screen_name,
                                "time": new Date(dat.created_at)
                            }
                        })
                        document.arg_data.page = document.arg_data.page + 1;
                        document.arg_data.max_page = repost_data.max_page;
                    }).then(get_next_page);
            } else {
                return document.arg_data.users;
            }
        }
        // Load users into document.usr
        function load_users() {
			if (document.arg_data != undefined) {
				window.alert("正在载入转发人，请等待读条完毕");
				return;
			}
            window.alert("载入转发人，请稍后");
            return get_post().then((response) => {
                return response.json();
            }).then((post_data) => {
                document.arg_data = {
                    "id": post_data.id,
                    "reposts_count": post_data.reposts_count,
                    "page": 1,
                    "max_page": -1,
                    "users": {}
                };
            }).then(get_next_page).then((usr) => {
                document.ready_shuffle = true;
                document.usr = usr;
				document.arg_data = undefined;
            }).catch((error) => {
				document.arg_data = undefined;
				window.alert("载入错误，请重试。");
                console.error('Error:', error);
            }).then(() => {
                var uid_list = Object.keys(document.usr);
                window.alert(`载入转发列表成功：总计${Object.keys(uid_list).length}个抽选者`);
                button_text.innerHTML = ' 开抽 ';
            });
        }
		// Durstenfeld shuffle
		function shuffleArray(array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		}
        // Shuffle for award winner
        function check_award() {
			// Const for text
			const cutoff_prompt = "请输入抽奖截止时间：";
			const count_prompt = "请输入中奖人个数：";
			// Get cut off date
            var cutoff_date = new Date(prompt(cutoff_prompt, "" + Date()));
			while (cutoff_date instanceof Date && isNaN(cutoff_date)) { // Is invalid date
				cutoff_date = new Date(prompt(cutoff_prompt, "" + Date()));
			}
			// Construct array for uid list
            var uid_list = Object.keys(document.usr);
			shuffleArray(uid_list);
			// Get count of awards
			var count = Number(prompt(count_prompt, "1"));
			while (!Number.isInteger(count) || count <= 0) { // Is invalid count
				count = Number(prompt(count_prompt, "1"));
			}
			// Generate Results
			var got = 0;
			for (var i=0; i<uid_list.length && got < count; ++i) {
				if (document.usr[uid_list[i]].time < cutoff_date) {
					var usr = document.usr[uid_list[i]];
					window.alert(`中奖人${got+1}/${count}：` +
							`\n    微博ID：${uid_list[i]}` +
							`\n    微博名称：${usr.name}` +
							`\n    发博时间：${usr.time}` +
							`\n    ${Date()}`);
					got++;
				}
			}
        }

        // Add key listener
        function keydownHandler(e) {
            // [S]huffle users
            if (e.keyCode == 83 && document.ready_shuffle) {
                check_award();
            }
            // [L]oad user list
            if (e.keyCode == 76) {
                load_users();
            }
            // [P]rint users into console
            if (e.keyCode == 80 && document.ready_shuffle) {
                window.alert("中奖人名单已打印至控制台，请按F12点击控制台查看");
                console.log(document.usr);
            }
        }
        // register your handler method for the keydown event
        if (document.addEventListener) {
            document.addEventListener('keydown', keydownHandler, false);
        } else if (document.attachEvent) {
            document.attachEvent('onkeydown', keydownHandler);
        }
        // Load GUI handler
        button_element.addEventListener('click', (event) => {
            if (document.ready_shuffle) {
                check_award();
            } else {
                load_users();
            }
        });
    }, 1000);
})();
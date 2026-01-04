// ==UserScript==
// @name  活动助手
// @namespace Violentmonkey Scripts
// @match https://event-2507i7iw30.playbattlegrounds.com.cn/index.html*
// @grant none
// @version 1.0
// @author flsho@qq.com
// @description 2025/7/23 00:26:23
// @downloadURL https://update.greasyfork.org/scripts/543395/%E6%B4%BB%E5%8A%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543395/%E6%B4%BB%E5%8A%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var page = 1;

var status = true;

// var mapData = {}

function fetchData() {

    status = false;

    $('.fevms')[0].textContent = '正在获取数据...'; // 显示正在获取数据

    const url = `https://event-2507i7iw30.playbattlegrounds.com.cn/api/july7554dfd/activity/list2?uid=${userId}&token=${ticket}&page=${page}`;

    fetch(url, {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'

        }

    }).then(response => response.json())

        .then(data => {

            if (data.code === "00") {

                const activities = data.res.data;

                activities.forEach((item, i) => {

                    if (item.fnick) {

                        for (let j = 0; j < $('.widts1').length; j++) {

                            $('.widts1')[j].textContent

                            if (item.fnick === $('.widts1')[j].textContent) {

                                var parentDiv = $('.widts1')[j].parentElement; // 获取父元素

                                var existingSpan = parentDiv.querySelector('span'); // 查找是否存在 span 元素

                                if (!existingSpan) {

                                    // 如果不存在，则创建一个新的 span 元素

                                    var span = document.createElement('span');

                                    // 设置左边距

                                    span.style.marginLeft = 'auto'; // 设置左边距

                                    span.style.color = '#FF6402'; // 设置左边距

                                    span.textContent = '2'; // 设置文本内容为 2

                                    parentDiv.appendChild(span); // 将 span 添加到父元素中

                                } else {

                                    // 如果存在，则更新文本内容

                                    existingSpan.textContent = parseInt(existingSpan.textContent) + 2; // 更新为现有值加2

                                }

                            }

                        }

                        // $('.widts1') 遍历 10个 text

                    }

                });

                // 检查是否有下一页

                if (data.res.next_page_url) {

                    page++;

                    setTimeout(() => {

                        fetchData(); // 递归调用获取下一页数据

                    }, 1000);

                } else {

                    // 结束时间 cdate: "2025-08-11"

                    // 一天基础35分 10个好友一天最多40

                    // 判断够不够2000分

                    // 当前时间

                    var curTime = new Date();

                    var endTime = new Date("2025-08-11"); // 结束时间

                    var timeDiff = endTime - curTime; // 毫秒差

                    var daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 剩余天数

                    // 当前分数  获取class 为.cnums 的文本值

                    var currentScore = parseInt(document.querySelector('.cnums').textContent.trim());

                    // 每天基础分数

                    var dailyBaseScore = 35;

                    //

                    // 计算每天基础分数总数

                    var totalDailyBaseScore = dailyBaseScore * daysLeft; // 剩余天数的基础分数

                    // 每天最多能获取的好友分数40   1个好友4分  最多10个好友

                    // 好友每日分数必须要达到多少才够2000分

                    var requiredFriendScore = 2000 - currentScore - totalDailyBaseScore; // 需要的好友分数

                    // 每日需要的好友分数

                    var dailyFriendScore = requiredFriendScore / daysLeft; // 每天需要的好友

                    // 每天需要的好友数量

                    var dailyFriendCount = Math.ceil(dailyFriendScore / 4); // 每天

                    // 预计结果分数

                    var expectedScore = currentScore + totalDailyBaseScore + (dailyFriendCount * 4 * daysLeft); // 预计结果分数

                    // var alertMessage = Object.entries(mapData).map(([key, value]) => `${key}：${value}`).join('\n');

                    var alertMessage = ''

                    alertMessage += `\n剩余天数:${daysLeft};\n每天需要的好友分数:${dailyFriendScore.toFixed(2)};每天最少需要${dailyFriendCount}个好友可以达到${expectedScore}分`;

                    // alert(alertMessage); // 弹窗显示结果

                    $('.fevms')[0].textContent = alertMessage; // 将结果显示在页面上

                    $('.fevms')[0].style.fontSize = '12px'; // 设置字体大小

                    console.log(alertMessage);

                }

            } else {

                console.error("Error fetching data:", data);

            }

        })

        .catch(error => console.error("Fetch error:", error));

}

// fetchData()

if(ticket && userId) {

$('.fevms')[0].textContent = '点此获取数据';

$('.fevms')[0].addEventListener('click', function () {

    if(status){

      page = 1; // 重置页码

      fetchData(); // 开始获取数据

    }

});

}else{

$('.fevms')[0].textContent = '请先登录游戏重新打开此网页'; // 显示请先登录游戏

}
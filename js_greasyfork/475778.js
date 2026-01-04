// ==UserScript==
// @name         新华智慧校园一键批改作业
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加一键帮学生提交作业和一键批改作业
// @author       果氢
// @license MIT
// @match        http://zhxy.xhe.cn/static/pc/homeworklist.html**
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nys3Nzc3Nzc3LTc3Nzc4Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACAAIAMBIgACEQEDEQH/xAAYAAADAQEAAAAAAAAAAAAAAAAFBgcDBP/EAC8QAAEDAgQEBQIHAAAAAAAAAAECAwQFEQAGITESQVGBBxMUYXFCciIjMjOCobH/xAAWAQEBAQAAAAAAAAAAAAAAAAAGBAP/xAAkEQABAgUCBwAAAAAAAAAAAAABAAMCBBESITFRIjNBgaHw8f/aAAwDAQACEQMRAD8AnHpHlvoZYbW44tQShCE3KieQGKd51OyfkR+k5jLM+sSgpTUE2cMXiTYXP023+Tp1wpIky6eF+hX5DyxYvNizlugVunta+CNHyjEg8NXzxL9FCP40RFEmRK/juAev+b4QPgYu08lQSz4chwi8Dw0plUyW3XWZsyE6qOt4oklK0DhvzABsbXv0OJdh9zh4gzsxhukUOOuFTrpQ2w0PzHbfpBtsNrJH94qFQpNJZyQ07nKNGceYhp9Q+UDzOPh+lW/FfTTc4wDzjPMzU4HUKugOim4eegErhobbf5PlPEtP230HyNffAhqiVTMdRLcZt6XJWbrcWom3upR274am2ogAVLK3ejTRtf5UduwPbHNVqtNciGFE4YUPmxGHCFfcd1dzi+OE14BndEZOaspfF29+reAcreG6S++4ms5hAsEs/tsHoFbD51PsMJGa83VbNMkOVF6zCDdqM3o2jtzPucZzIt76a4EOtltWMYWBDFccndI2ZkOjC//Z
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/axios/1.3.6/axios.js
// @require https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/475778/%E6%96%B0%E5%8D%8E%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD%E4%B8%80%E9%94%AE%E6%89%B9%E6%94%B9%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/475778/%E6%96%B0%E5%8D%8E%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD%E4%B8%80%E9%94%AE%E6%89%B9%E6%94%B9%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

// function escapeHTML(html) {
//     return html.replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/&/g, "&amp;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#39;");
// }

// 常量提取
const STYLE_BUTTON = 'height: 39px;background:#FFC0CB';


// 使用事件委托来处理一键批改和一键提交按钮的点击事件
function handleButtonClick(event) {
    const target = event.target;
    if (target.classList.contains('item-correct')) {
        // 处理一键批改或一键提交
        const itemDelElement = target.closest('.item-td-6').querySelector('.item-del');
        const itemId = itemDelElement.getAttribute('id');

        if (target.innerText === '一键批改') {
            $.ajax({
                url: common.data.addhost + `/app/teacher/homework/userHomeWorkList?homework_id=${itemId}&pageSize=999`
            }).then(function (res) {
                if (res.entity.page.totalPageSize >= 1) {
                    const home_work_submit_list = res.entity.userHomeWorkList;
                    let userInput = prompt(`请输入需要随机的评语的评语(使用|隔开评语)： `);
                    userInput = userInput.split('|');
                    home_work_submit_list.forEach(submit => {
                        if (submit.status == 0) {
                            const randomScore = Math.floor(Math.random() * (100 - 80 + 1)) + 80;
                            if (userInput !== null) {
                                if (userInput.length >= 1) {
                                    $.ajax({
                                        url: common.data.addhost + '/app/teacher/homework/userHomeWorkSubmit',
                                        data: {
                                            id: submit.id,
                                            auditor: common.data.userinfo.id,
                                            home_work_id: submit.home_work_id,
                                            correction: userInput[Math.floor(Math.random() * userInput.length)],
                                            score: randomScore
                                        }
                                    }).then(function (res) {
                                        if (res.success) {
                                            swal(`批改完成!等待10秒后点击确认查看`).then(function () {
                                                // 在用户点击"确定"按钮后刷新页面
                                                window.location.reload();
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    });
                } else {
                    alert("没有需要批改");
                }
            });
        } else if (target.innerText === '一键提交') {
            $.ajax({
                url: common.data.addhost + `/app/homework/submitDetail?id=${itemId}&pageSize=999&type=1`
            }).then(function (res) {
                const home_work = res.entity.homeWork;
                const hmList = res.entity.userHomeWorkList;
                const submitText = prompt(`作业提交内容:`);
                if (submitText !== null) {
                    if (submitText.trim() !== "") {
                        hmList.forEach(e => {
                            axios.post(`${common.data.addhost}/app/student/homework/submit`, null, {
                                headers: {
                                    digest: "bfd2c63496c61b359e39348c26b5d285",
                                    random: "793057",
                                    time: "1693584038230",
                                    userId: "0"
                                },
                                params: {
                                    user_id: e.user_id,
                                    home_work_id: e.home_work_id,
                                    answer: submitText
                                }
                            }).then(submited => {
                                swal(`一键提交成功!等待10秒后点击确认查看`).then(function () {
                                    // 在用户点击"确定"按钮后刷新页面
                                    window.location.reload();
                                });
                            });
                        });
                    }
                }
            });
        }
    }
}

const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode instanceof Element && addedNode.classList.contains('item-tr')) {
                    const itemTd6Element = addedNode.querySelector('.item-td-6');
                    if (itemTd6Element) {
                        const spanElement = document.createElement('span');
                        spanElement.className = 'item-correct';
                        spanElement.style = STYLE_BUTTON;
                        spanElement.innerText = '一键批改';

                        const spanElementSubmit = document.createElement('span');
                        spanElementSubmit.className = 'item-correct';
                        spanElementSubmit.style = `${STYLE_BUTTON}; margin-left: 1px`;
                        spanElementSubmit.innerText = '一键提交';

                        itemTd6Element.appendChild(spanElement);
                        itemTd6Element.appendChild(spanElementSubmit);
                    }
                }
            });
        }
    }
});

const config = {childList: true, subtree: true};

const targetNode = document.querySelector('.tablebox');

// 添加事件委托，监听按钮点击事件
if (targetNode) {
    targetNode.addEventListener('click', handleButtonClick);
    observer.observe(targetNode, config);
}
// ==UserScript==
// @name         TronClass 線上點名
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  躺在床上點名是我每天的日常。
// @author       Ryan Lee
// @match        https://eclass.yuntech.edu.tw/*
// @match        https://www.tronclass.com.tw/*
// @icon         https://eclass.yuntech.edu.tw/static/assets/images/favicon-b420ac72.ico
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/444295/TronClass%20%E7%B7%9A%E4%B8%8A%E9%BB%9E%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/444295/TronClass%20%E7%B7%9A%E4%B8%8A%E9%BB%9E%E5%90%8D.meta.js
// ==/UserScript==

// 取得點名列表
async function getRollcalls() {
    return fetch('/api/radar/rollcalls?api_version=1.1.0')
        .then((response) => {
            return response.json();
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
}

// 送出點名碼
async function makeRollcall(rollcall_id, answer) {
    return fetch(`/api/rollcall/${rollcall_id}/answer_number_rollcall`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "numberCode": answer
        }),
    }).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(`Error: ${error}`);
    })
}

async function getRollcallNumber(rollcalcl_id) {
    return fetch(`/api/courses/rollcall_status/${rollcalcl_id}/result`, {
    }).then((response) => {
        return response.json();
    }).catch((error) => {
        console.log(`Error: ${error}`);
    })

}

// 輸入點名代碼框
// 下周測試後再完整它，目前不確定他輸錯後回傳的response
async function enterRollcallNumber(rollcall_id) {
    number = await getRollcallNumber(rollcall_id)
    var answer = prompt("輸入點名代碼:", number.number_code);
    if (answer != null && answer.length >= 4) {
        res = await makeRollcall(rollcall_id, answer);
        location.reload();
    } else {
        alert("點名碼輸入錯誤或未輸入!")
    }
}

window.enterRollcallNumber = enterRollcallNumber


async function initUI() {
    // 暫時的data
    data = {
        "rollcalls": [
            {
                "avatar_big_url": "https://eclass.yuntech.edu.tw:443/api/uploads/1143996/modified-image?thumbnail=200x200&crop_box=0,508,768,1276",
                "class_name": "X",
                "course_id": 56614,
                "course_title": "(110_2)\uff30\uff59\uff54\uff48\uff4f\uff4e\u5728\u8cc7\u6599\u79d1\u5b78\u4e0a\u7684\u904b\u7528",
                "created_by": 33421,
                "created_by_name": "\u5f35\u69ae\u6607",
                "department_name": "\u901a\u8b58\u6559\u80b2\u4e2d\u5fc3",
                "grade_name": "0",
                "is_number": true,
                "is_radar": false,
                "rollcall_id": 29560,
                "status": "absent",
                "student_rollcall_id": 1430566,
                "type": "another"
            },
        ]
    }
    data = await getRollcalls();
    html = ""
    data['rollcalls'].filter(ele => ele.is_number && ele.status != "on_call_fine").forEach(ele => {
        html += `
            <div class="user-index row collapse">
                <div class="user-courses card">
                    <div class="semester-list row">
                        <li class="semester">
                            <ol class="courses" style="margin: 0px">
                                <li class="course">
                                    <div class="item">
                                        <div class="course-cover">
                                            <img src="/static/assets/images/large/course-cover-default-74db89b7.png">
                                        </div>
                                        <div class="course-content">
                                            <div class="course-info">
                                                <div class="course-title" style="margin-bottom: 10px">
                                                    <span class="course-name">
                                                        <a href="/course/${ele.course_id}/content">${ele.course_title}</a>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="right">
                                                <div>
                                                    <a class="course-introduction" href="javascript:window.enterRollcallNumber(${ele.rollcall_id})">前往點名</a>
                                                </div>
                                            </div>
                                            <div class="course-code-row truncate-text">
                                                <span>課程代碼: </span>
                                                <span>${ele.course_id}</span>
                                            </div>
                                            <div class="course-summarize">
                                                <div class="course-summarize-item truncate-text">
                                                    ${ele.department_name}
                                                </div>
                                            </div>
                                            <div class="course-detail">
                                                <div class="detail-row">
                                                    <div>授課教師:</div>
                                                    <div class="instructor">
                                                        <div class="user-avatar">
                                                            <div class="avatar16">
                                                                <avatar>
                                                                    <img src="${ele.avatar_big_url}">
                                                                </avatar>
                                                            </div>
                                                        </div>
                                                        ${ele.created_by_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ol>
                        </li>
                    </div>
                </div>
            </div>
        `
    });

    return html
}

// Basic Function
var oldHref = null;
async function main(changes, observer) {

    // Fix run multiple time
    if (oldHref == document.location.href) {
        return
    }
    oldHref = document.location.href;


    if (document.URL.indexOf("/rollcalls") != -1) {

        html = await initUI();

        if (html == "") {
            document.querySelector('.error-message').innerText = "目前無點名"
        } else {
            document.querySelector('.main-content').innerHTML = html
        }

    }

    if (document.querySelector('.gtm-category > ul > li:last-child').innerText != "點名") {
        document.querySelector('.gtm-category > ul').innerHTML += '<li><a href="/rollcalls">點名</a></li>'
    }

}

new MutationObserver((main)).observe(document, { childList: true, subtree: true });




// Fix SPA
// let utilityFunc = ()=> {
//     var run = (url)=> {
//         alert(13)
//     };

//     var pS = window.history.pushState;
//     var rS = window.history.replaceState;

//     window.history.pushState = function(a, b, url) {
//         run(url);
//         pS.apply(this, arguments);
//     };

//     window.history.replaceState = function(a, b, url) {
//         run(url);
//         rS.apply(this, arguments);
//     };
// }
// utilityFunc();
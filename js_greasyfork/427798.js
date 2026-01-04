// ==UserScript==
// @name         Acfun ThrowBanana
// @namespace    http://tampermonkey.net/
// @icon         https://tx-free-imgs.acfun.cn/content/2020_4_5/1.5860178587515075E9.png
// @version      1.3.1
// @description  一键5蕉
// @author       zyl315
// @match        *://www.acfun.cn/u/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427798/Acfun%20ThrowBanana.user.js
// @updateURL https://update.greasyfork.org/scripts/427798/Acfun%20ThrowBanana.meta.js
// ==/UserScript==

(function () {
    'use strict';
    addView();
})();

async function addView() {
    let button = '<button id="throw-button" value="0" style="display:none;position: absolute;top: 22px;left: 245px;border: 1px solid #fd4c5d;border-radius: 5px;background: #fff;color: #fd4c5d;;">一键5蕉</button>'
    $('.ac-space-contribute-list').css('position', 'relative');
    $('.ac-space-contribute-list').append(button);
    $('#throw-button').click(function () {
        throwBanana();
    });
    let currentBananaNum = await getCurrentBananaNum();
    setButtonStatus('show', '', currentBananaNum);
}

async function throwBanana() {
    let lastBananaNum = $('#throw-button').val();
    await beginThrowBanana();
    let currentBananaNum = await getCurrentBananaNum();
    setButtonStatus('show', '', currentBananaNum);
    alert(`投蕉完毕!\n总共消费${lastBananaNum - currentBananaNum}根香蕉`)
}

function hint(bananaNum) {
    alert(`投蕉完毕!\n总共消费${bananaNum}根香蕉`)
}

function setButtonStatus(type, info = "", bananaNum = 0) {
    switch (type) {
        case 'show':
            $('#throw-button').show();
            $('#throw-button').val(bananaNum);
            $('#throw-button').html(`一键5蕉(${bananaNum})`);
            $('#throw-button').removeAttr("disabled");
            $('#throw-button').css("cursor", "pointer");
            break;
        case 'hide':
            $('#throw-button').hide();
            break
        case 'throw':
            $('#throw-button').html(info);
            $('#throw-button').attr("disabled", 'disabled');
            $('#throw-button').css("cursor", "wait");
            break;
    }
}

// 获取当前页面所有视频或文章的链接，AC号
function getUrllList() {
    let urlList = [];
    $('.tag-content.active a').each(function () {
        let url = $(this).attr("href");
        if (url != null) {
            urlList.push(url);
        }
    })
    return urlList;
}

// 获取用户的香蕉数
async function getCurrentBananaNum() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://www.acfun.cn/rest/pc-direct/user/personalInfo",
            success: function (data) {
                let bananaNum = data.info['banana'];
                resolve(bananaNum);
            },
            error: function () {
                reject("error")
            }
        })
    });
}

// 投香蕉
async function beginThrowBanana() {
    let urlList = getUrllList();
    let count = 0;
    for (let i = 0; i < urlList.length; i++) {
        setButtonStatus('throw', `努力投蕉中 ${i}/${urlList.length}`);
        let data = {
            resourceId: '',
            count: 5,
            resourceType: ''
        };
        let item = urlList[i].split("/");
        data['resourceId'] = item[2].substring(2);
        switch (item[1]) {
            case 'v':
                data['resourceType'] = 2;
                break;
            case 'a':
                data['resourceType'] = 3;
                break;
        }
        let result = await new Promise((resolve, reject) => {
            setTimeout(function () {
                $.ajax({
                    url: "https://www.acfun.cn/rest/pc-direct/banana/throwBanana",
                    data: data,
                    type: 'post',
                    async: false,
                    success: function (response) {
                        if (response['result'] == 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    },
                    error: function () {
                        reject(false);
                    }
                })
            })
        });
        if (result) count++;
        // 投蕉频率太快就会失败，因此延迟0.9s,0.9几乎是最小时间间隔了
        await sleep(900);
    };
    return count;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
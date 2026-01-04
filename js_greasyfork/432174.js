// ==UserScript==
// @name         郑州大学远程教育
// @version      2.12
// @description  郑州大学远程教育自动播放
// @author       壹局QQ639446649
// @match        http://ols.v.zzu.edu.cn/*
// @icon         http://tm.yjgame.top/tampermonkey/zzdxycjy/logo.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @namespace 好好学习天天向上
// @downloadURL https://update.greasyfork.org/scripts/432174/%E9%83%91%E5%B7%9E%E5%A4%A7%E5%AD%A6%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/432174/%E9%83%91%E5%B7%9E%E5%A4%A7%E5%AD%A6%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
(function () {
    let coursePage = "http://ols.v.zzu.edu.cn/xsd/#/index/dibble";
    setInterval(() => {
        let left = $($('#root > div > div > div > div:nth-child(2) > div')[0]);
        let right = $($('#root > div > div > div > div:nth-child(2) > div')[1]);
        if (left.find('ul').length === 2) {
            let selected = $(left.find('ul:nth-child(2) > li:nth-child(2)')).attr('class').includes('ant-menu-item-selected');
            if (!selected) {
                window.location.href = coursePage;
            }
        }
        let studyList = right.find('ul li');
        if (window.location.href == coursePage) {
            if (studyList.length != 0) {
                for (let index = 0; index < studyList.length; index++) {
                    const study = studyList[index];
                    let p = $(study).find('p');
                    if (p.length == 4) {
                        let studyState = $($(p[1]).find('span')[0]).text();
                        if (studyState == '学习中' || studyState == '未学习') {
                            let lowScore = $($(p[2]).find('span')[1]).text().split('/')[0];
                            if (Number(lowScore) < 10) {
                                $(study).children().click();
                            }
                        }
                    } else {
                        continue;
                    }
                }
            }
        }
        if (window.location.href.includes('video')) {
            let courseNameList = right.children('div').children('section').children('div').children('div:nth-child(3)').children('div:nth-child(1)').children('ul').children('li');
            if (courseNameList.length > 0) {
                for (let index = 0; index < courseNameList.length; index++) {
                    let liSpan = $(courseNameList[index]).children('span:first');
                    if (liSpan.attr('class').includes('ant-tree-switcher_close')) {
                        liSpan.click();
                    }
                }
            }
            let videoList = courseNameList.find('li');
            if (document.querySelector("video")) {
                if (document.querySelector("video").paused) {
                    document.querySelector("video").play();
                } else {
                    document.querySelector("video").muted = true;
                }
                for (let index = 0; index < videoList.length; index++) {
                    let videoContent = $(videoList[index]);
                    if (videoContent.attr('class').includes('ant-tree-treenode-selected')) {
                        let videoP = videoContent.children('span:nth-child(2)').children('span:nth-child(2)').children('p');
                        let couresState = $(videoP.find('span')[1]);
                        let schedule = parseInt(document.querySelector("video").currentTime / document.querySelector("video").duration * 100);
                        if (couresState.text() == '已完成' || schedule >= 85 || document.querySelector("video").ended) {
                            window.location.href = coursePage;
                        }
                    }
                }
            } else {
                for (let index = 0; index < videoList.length; index++) {
                    let videoContent = $(videoList[index]);
                    let videoP = videoContent.children('span:nth-child(2)').children('span:nth-child(2)').children('p');
                    let couresType = $(videoP.find('span')[0]);
                    if (videoP.find('span').length == 2 && couresType.text() == '视频') {
                        let couresState = $(videoP.find('span')[1]);
                        if (couresState.text() != '已完成') {
                            videoP[0].click();
                            break;
                        }
                    }
                    if (videoP.find('span').length == 1 && couresType.text() == '视频') {
                        videoP[0].click();
                        break;
                    }
                }

            }
        }
    }, 2000);
    setInterval(() => {
        let quxiao = $('span:contains("取 消")');
        if (quxiao.length == 1) {
            quxiao.click();
        }
        let rcDialogTitle1 = $('.ant-modal-title:contains("公告")');
        if (rcDialogTitle1.length == 1) {
            rcDialogTitle1.parent().prev().click();
        }
        let errMsg = $('.prism-error-content p');
        if (errMsg.length == 1 && errMsg.text() == '播放出错啦，请尝试退出重试或刷新') {
            window.location.href = coursePage;
        }
    }, 500);
})();



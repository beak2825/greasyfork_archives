// ==UserScript==
// @name         前台跳转后台
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.2.4
// @description  一件跳转，提升内容查询效率
// @author       Veg
// @include    *.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38971/%E5%89%8D%E5%8F%B0%E8%B7%B3%E8%BD%AC%E5%90%8E%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/38971/%E5%89%8D%E5%8F%B0%E8%B7%B3%E8%BD%AC%E5%90%8E%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    const url = window.location.href;
    let urlSlice = url.substring(20);
    let tokens = urlSlice.split('?');
    let token = tokens[0].split('/');
    let a = new Array();
    for (var i = 0; i < 7; i++) {
        a[i] = document.createElement('a');
        a[i].setAttribute('style', 'bparentkground: #00BFFF;color : #000000;margin-left: 50px;');
    }
    setTimeout(function () {
        //问答和主页
        let link = document.querySelector('div.PageHeader'); {
            if (link) {
                let parent = link.parentNode;
                if (token[1] == 'people' || token[1] == 'org') {
                    let div = document.createElement('div');
                    parent.insertBefore(div, link);
                    let memberManagement = a[0];
                    memberManagement.innerHTML = "工单会员管理";
                    memberManagement.href = 'https://zticket.in.zhihu.com/contents?object_type=member&member_url_token=' + token[2];
                    div.appendChild(memberManagement);
                    let gdReportLog = a[1];
                    gdReportLog.innerHTML = "工单日志";
                    gdReportLog.href = 'https://zticket.in.zhihu.com/auditlog?user_url_token=' + token[2] + '&page=1&per_page=20';
                    div.appendChild(gdReportLog);
                    let gdReportLogs = a[2];
                    gdReportLogs.innerHTML = "工单举报人日志";
                    gdReportLogs.href = 'https://zticket.in.zhihu.com/auditlog?source_id=3&reporter_url_token=' + token[2] + '&page=1&per_page=20';
                    div.appendChild(gdReportLogs);
                }
                if (token[1] == 'question') {
                    let div = document.createElement('div');
                    parent.insertBefore(div, link);
                    let gdQuestionManagement = a[0];
                    gdQuestionManagement.innerHTML = "工单问题管理";
                    gdQuestionManagement.href = 'https://zticket.in.zhihu.com/contents?object_type=question&object_url_token=' + token[2];
                    div.appendChild(gdQuestionManagement);
                    let questionLog = a[1];
                    questionLog.innerHTML = "问题日志";
                    questionLog.href = 'https://www.zhihu.com/question/' + token[2] + "/log";
                    div.appendChild(questionLog);
                    if (token[3] == 'answer') {
                        let gdAnswerLog = a[3];
                        gdAnswerLog.innerHTML = "回答工单日志";
                        gdAnswerLog.href = "https://zticket.in.zhihu.com/auditlog?object_type=answer&obj_url_token=" + token[4];
                        div.appendChild(gdAnswerLog);
                        let answerManagement = a[4];
                        answerManagement.innerHTML = "工单回答管理";
                        answerManagement.href = "https://zticket.in.zhihu.com/contents?object_type=answer&object_url_token=" + token[4];
                        div.appendChild(answerManagement);
                    }
                }
            }
        }
        //想法
        if (token[1] == 'pin') {
            let link = document.querySelector('div.Layout-main'); {
                if (link) {
                    let parent = link.parentNode;
                    var div = document.createElement('div');
                    parent.insertBefore(div, link);
                    let pinManagement = a[0];
                    pinManagement.innerHTML = '工单想法管理';
                    pinManagement.href = 'https://zticket.in.zhihu.com/contents?object_type=pin&object_url_token=' + token[2];
                    div.appendChild(pinManagement);
                    let pinGdLog = a[1];
                    pinGdLog.innerHTML = '工单日志';
                    pinGdLog.href = 'https://zticket.in.zhihu.com/auditlog?object_type=pin&obj_url_token=' + token[2];
                    div.appendChild(pinGdLog);
                }
            }
        }
        //文章
        if (token[1] == 'p') {
            let link = document.querySelector('article.Post-Main');
            if (link) {
                let parent = link.parentNode;
                let div = document.createElement('div');
                parent.insertBefore(div, link);
                let articleManagement = a[0];
                articleManagement.innerHTML = '工单文章管理';
                articleManagement.href = 'https://zticket.in.zhihu.com/contents?object_type=article&object_url_token=' + token[2];
                div.appendChild(articleManagement);
                let articleGdLog = a[1];
                articleGdLog.innerHTML = '工单日志';
                articleGdLog.href = 'https://zticket.in.zhihu.com/auditlog?object_type=article&obj_url_token=' + token[2];
                div.appendChild(articleGdLog);
            }
        }
        if (token[1] == 'zvideo') {
            let link = document.querySelector('article.ZVideo');
            if (link) {
                let parent = link.parentNode;
                let div = document.createElement('div');
                parent.insertBefore(div, link);
                let videoManagement = a[0];
                videoManagement.innerHTML = '工单视频管理';
                videoManagement.href = 'https://zticket.in.zhihu.com/contents?object_type=zvideo&offset=0&limit=10&object_url_token=' + token[2];
                div.appendChild(videoManagement);
                let videoGdLog = a[1];
                videoGdLog.innerHTML = '工单日志';
                videoGdLog.href = 'https://zticket.in.zhihu.com/auditlog?object_type=zvideo&obj_url_token=' + token[2];
                div.appendChild(videoGdLog);
            }
        }
    }, 10);
})();
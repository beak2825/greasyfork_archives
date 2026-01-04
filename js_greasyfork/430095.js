// ==UserScript==
// @name         Acfun_抽奖检查助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CHECK！
// @author       幽想
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
// @icon         https://www.google.com/s2/favicons?domain=acfun.cn
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.0.18/dist/sweetalert2.all.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430095/Acfun_%E6%8A%BD%E5%A5%96%E6%A3%80%E6%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/430095/Acfun_%E6%8A%BD%E5%A5%96%E6%A3%80%E6%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function addCheckIsFollowedText () {
        document.querySelector("div.ac-comment-root-list").childNodes.forEach(//刷啦啦的添加
            function(now){
                let mdiv = now.childNodes[0].children[0].children[1].children[2].children[4];
                if (!mdiv) {
                    return;
                }
                if (mdiv.className != 'area-comm-more') {
                    return;
                }
                let sth = document.createElement('span');
                sth.textContent = '查关注';
                mdiv.appendChild(sth);
                mdiv = now.childNodes[0].children[0].children[1].children[0];
                let uid = mdiv.children[0].dataset.userid;
                let name = mdiv.children[0].textContent;
                let floor = mdiv.parentElement.nextElementSibling.textContent;
                sth.onclick = function () {
                    checkIsFollowed(uid,name,floor);
                }
            }
        )
    }

    async function checkIsFollowed (u,n,f) {
        Swal.fire({
            icon:'info',
            text:`正在获取数据`,
            showConfirmButton: false,
            toast: true
        })
        let res = await isFollowed(u);
        Swal.closeToast();//完成抓取后关闭提示框
        let text = '';
        if (!!res.error) {
            Swal.fire({
                title:'出错',
                icon:'error',
                text:`${f}楼用户 ${n} 检查关注获取失败\n错误信息：${res.error}`,
                confirmButtonText:'了解'
            })
            return;
        };
        if (res) {
            text = `${f}楼用户 ${n} 关注您了`
        } else {
            text = `${f}楼用户 ${n} 还没关注您`
        }
        Swal.fire({
            icon:'info',
            text:text,
            confirmButtonText:'了解'
        })
        return;

    }

    async function isFollowed (uid) {//发送请求与处理
        let res = await fetch(`https://www.acfun.cn/rest/pc-direct/user/userInfo?userId=${uid}`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Microsoft Edge\";v=\"91\", \"Chromium\";v=\"91\"",
                "sec-ch-ua-mobile": "?0",
                "upgrade-insecure-requests": "1"
            },
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        res = await res.text();
        try {
            var j = JSON.parse(res);
        }
        catch (e) {
            return {'error':e};
        };
        return j.profile.isFollowed;
    }

    //分割

    function addCheckIsCommentMutiText () {
        document.querySelector("div.ac-comment-root-list").childNodes.forEach(//刷啦啦的添加
            function(now){
                let mdiv = now.childNodes[0].children[0].children[1].children[2].children[4];
                if (!mdiv) {
                    return;
                }
                if (mdiv.className != 'area-comm-more') {
                    return;
                }
                let sth = document.createElement('span');
                sth.textContent = '查重复';
                mdiv.appendChild(sth);
                mdiv = now.childNodes[0].children[0].children[1].children[0];
                let uid = mdiv.children[0].dataset.userid;
                let name = mdiv.children[0].textContent;
                sth.onclick = function () {
                    isCommentMuti(uid,name);
                }
            }
        )
    }
    async function getAllComment (sid,uid,name) {//发送请求与处理
        let newJ = {};
        let i = 0;
        do {
            i++;
            let res = await fetch(`https://www.acfun.cn/rest/pc-direct/comment/list?sourceId=${sid}&sourceType=3&page=${i}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Microsoft Edge\";v=\"91\", \"Chromium\";v=\"91\"",
                },
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            res = await res.text();
            try {
                var j = JSON.parse(res);
            }
            catch (e) {
                return { 'error': e };
            };
            var total = j.totalPage;
            for (let k in j.rootComments) {
                let floor = j.rootComments[k]['floor'];
                let uid = j.rootComments[k]['userId'];
                newJ[floor] = uid;
            }
            if (Swal.isVisible()) {//更新状态
                Swal.update({
                    text:`获取进度:(${i}/${total})`
                })
            } else {
                Swal.fire({
                    icon:'info',
                    text:`获取进度:(${i}/${total})`,
                    showConfirmButton: false,
                    toast: true
                });
            }
        }
        while (i < total);
        window.commentList_yx = newJ;
        Swal.closeToast();
        if (!!uid) {//含传入
            isCommentMuti(uid,name);
        }
    }
    function isCommentMuti(uid,name) {
        if (!window.commentList_yx) {
            Swal.fire({
                icon:'info',
                text:`准备获取评论区列表，请稍等`,
                showConfirmButton: false,
                toast: true
            });
            let acid = '';
            if (document.URL.indexOf('acfun.cn/v/ac') != -1) {
                acid = pageInfo.dougaId;
                
            }
            if (document.URL.indexOf('acfun.cn/a/ac') != -1) {
                acid = articleInfo.articleId;
            }
            getAllComment(acid,uid,name);
            return;
        }
        uid = parseInt(uid);
        const list = window.commentList_yx;
        let nArr = [];
        let nArrT = '';
        for (let k in list) {
            if (list[k] === uid) {
                if (nArr.length === 0) {
                    nArrT = `${k}楼`
                } else {
                    nArrT += `、${k}楼`
                }
                nArr.push(k);
            }
        }
        let text = '';
        if (nArr.length > 1) {
            text = `用户「${name}」有多个评论，在「` + nArrT + '」';
        } else {
            text = `用户「${name}」仅有当前这一个评论`;
        }
        Swal.fire({
            icon:'info',
            text:text,
            confirmButtonText:'了解'
        })
        return;
    }
    //分割

    var timer1 = null;
    if (document.URL.indexOf('acfun.cn/v/ac') != -1 || document.URL.indexOf('acfun.cn/a/ac') != -1) {
        let uid = 0;
        let nowuid = document.cookie.match(/auth_key=(.*?);/);
        if (!nowuid) {//未登录
            return;
        } else {
            nowuid = nowuid[1];
        }
        if (!!document.URL.match('acfun.cn/a/ac')) {
            uid = articleInfo.user.id;
        } else {
            uid = videoInfo.user.id;
        }
        if (!uid) {
            console.log('Acfun_抽奖检查助手：用户uid获取失败，程序退出。');
            return;
        };
        if (uid != nowuid) {
            return;
        }
        timer1 = setInterval(
            function () {//等待加载
                let cRLDiv = document.querySelector("div.ac-comment-root-list");
                if (!!cRLDiv && cRLDiv.childElementCount != 0) {
                    clearInterval(timer1);
                    addCheckIsFollowedText();
                    addCheckIsCommentMutiText();
                    console.log('Acfun_抽奖检查助手：程序初始化完毕。');
                    var mo = new MutationObserver(
                        function (records) {
                            if (records[0].type === 'childList') {
                                addCheckIsFollowedText();//子节点发生了变动，重新增加按钮
                                addCheckIsCommentMutiText();
                            }
                        }
                    );
                    mo.observe(document.querySelector("div.ac-comment-root-list"), { 'childList': true });//监听列表变动
                }
            }
            , 1000)
    }

    window.onload = function (){//页面加载完毕但无评论则不需要再循环等待
        if (!!document.querySelector("div.ac-comment-root-list") && document.querySelector("span.area-comm-number").textContent === '0' && !!timer1) {
            clearInterval(timer1);
        }
    }
})();
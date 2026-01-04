// ==UserScript==
// @name         HDUOJ增强
// @namespace    YinTianliang_i
// @version      0.2.7
// @description  自动登录HDUOJ，提供历史contests选项
// @author       Yin Tianliang
// @include      *//hdu.hustoj.com/*
// @include      *//acm.hdu.edu.cn/*
// @include      *//acm.split.hdu.edu.cn/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/34674/HDUOJ%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/34674/HDUOJ%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// TODO:判断当前登录状态

/*jshint esversion: 6 */

let getKey = (key) => { return localStorage[key]; };
let setKey = (key, value) => { localStorage[key] = value; };

function getInput(mes) {
    let input;
    do {
        input = prompt(mes);
    } while (input === null);
    return input;
}

function setUserInfo() {
    let username = getInput("请输入用户名:");
    let userpass = getInput("请输入密码：");
    setKey("username", username);
    setKey("userpass", userpass);
    return [username, userpass];
}

function contestLogin(contestID, contestPSW) {
    $.post(`http://${location.host}/diy/contest_login.php?cid=${contestID}&action=login`,
        { password: contestPSW });
}


// 如果跳转到了登录界面，则开始执行逻辑
// 提取url中的contestID 判断是否在storage中
let reg = new RegExp("userloginex|contest_login.php.cid=(\\d+)");
let matches = location.toString().match(reg);
if (matches) {

    // 用户登录
    let username = getKey("username");
    let userpass = getKey("userpass");
    let contestID = getKey("contestID");
    let contestPSW = getKey("contestPSW");
    if (username === undefined || userpass === undefined) {
        [username, userpass] = setUserInfo();
    }

    $.post(`http://${location.host}/userloginex.php?action=login`,
        { username: username, userpass: userpass, login: "Sign In" });

    // 单项测试登录
    if (matches[1]) {
        if (!new RegExp(matches[1]).test(contestID)) {
            let psw = getInput("该测试的口令未被记录，请输入该测试的口令");
            if (contestID === undefined) {
                contestID = matches[1];
                contestPSW = psw;
            } else {
                contestID += '|' + matches[1];
                contestPSW += '|' + psw;
            }
            setKey("contestID", contestID);
            setKey("contestPSW", contestPSW);
        }
        contestID = contestID.split('|');
        contestPSW = contestPSW.split('|');
        for (let i = 0; i < contestID.length; i++) {
            contestLogin(contestID[i], contestPSW[i]);
        }


        // 跳转到题目页面
        location.href = `http://${location.host}/diy/contest_show.php?cid=${matches[1]}`;
    } else {
        history.back();
        // TODO:返回上一层后用户又要重新点击进入 重点是判断当前状态
    }
}

// 在页面顶端增加历史contests
let contestID = getKey("contestID").split('|');
let divObj = document.createElement("div");
divObj.style = 'text-align:center';
divObj.innerHTML = '历史contests:';
for (let i in contestID) {
    divObj.innerHTML += `<a href="/diy/contest_show.php?cid=${contestID[i]}">${contestID[i]} </a>`;
}
divObj.innerHTML += `<a href="javascript:confirm('确定要清空吗?')&&localStorage.clear()&&location.reload()">清空数据</a>`;
document.body.insertBefore(divObj, document.body.firstChild);

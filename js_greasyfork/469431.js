// ==UserScript==
// @name         必应Rewards按钮+搜索热词版
// @version      1.0.3
// @description  必应Rewards自动完成当日搜索任务工具，按钮直接显示在网页上，更好操作，远程获取抖音或微博热词进行搜索
// @author       APP.KOLO.RUN
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @run-at document-end
// @namespace https://greasyfork.org/users/1109344
// @downloadURL https://update.greasyfork.org/scripts/469431/%E5%BF%85%E5%BA%94Rewards%E6%8C%89%E9%92%AE%2B%E6%90%9C%E7%B4%A2%E7%83%AD%E8%AF%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/469431/%E5%BF%85%E5%BA%94Rewards%E6%8C%89%E9%92%AE%2B%E6%90%9C%E7%B4%A2%E7%83%AD%E8%AF%8D%E7%89%88.meta.js
// ==/UserScript==
//PC需要执行35-40 手机需要执行 30-35
const max_rewards = 40; /*每次重复执行的次数*/
const api_host = "https://tenapi.cn/v2/";
const douyin = "douyinhot";
const weibo = "weibohot";
var search_dic = ["观沧海", "闻王昌龄左迁龙标遥有此寄", "次北固山下", "天净沙·秋思", "咏雪", "陈太丘与友期行", "诫子书", "狼", "穿井得一人", "杞人忧天", "峨眉山月歌", "江南逢李龟年", "行军九日思长安故园", "夜上受降城闻笛", "秋词·其一", "夜雨寄北", "十一月四日风雨大作·其二", "潼关", "孙权劝学", "木兰诗", "卖油翁", "陋室铭", "爱莲说", "登幽州台歌", "望岳", "登飞来峰", "游山西村", "己亥杂诗·其五", "活板", "竹里馆", "春夜洛城闻笛", "逢入京使", "晚春", "泊秦淮", "贾生", "过松源晨炊漆公店", "约客", "三峡", "答谢中书书", "记承天寺夜游", "与朱元思书", "野望", "黄鹤楼", "使至塞上", "渡荆门送别", "钱塘湖春行", "得道多助，失道寡助", "富贵不能淫", "生于忧患，死于安乐", "愚公移山", "周亚夫军细柳", "饮酒·其五", "春望", "雁门太守行", "赤壁", "渔家傲·天接云涛连晓雾", "白夜行", "静夜思", "将进酒·君不见", "黄鹤楼送孟浩然之广陵", "赠汪伦", "望天门山", "送友人", "峨眉山月歌"]; /*搜索字典*/

function AutoStrTrans(st) {
    // alert(sessionStorage.getItem('Cnt'));
    console.log(st)
    let yStr = st; /*原字符串*/
    let rStr = "试验"; /*插入的字符*/
    let zStr = ""; /*结果*/
    let prePo = 0;
    for (let i = 0; i < yStr.length;) {
        let step = parseInt(Math.random() * 6) + 1;
        if (i > 0) {
            zStr = zStr + yStr.substr(prePo, i - prePo) + rStr;
            prePo = i;
        }
        i = i + step;
    }
    if (prePo < yStr.length) {
        zStr = zStr + yStr.substr(prePo, yStr.length - prePo)
    }
    return zStr;
}

function SetSearchDic() {
    var api_type = localStorage.getItem('api_type');
    if (api_type == null) {
        setLocalStorageWithExpiration('api_type', douyin, 3);
        api_type = douyin;
    } else {
        const item = JSON.parse(api_type);
        const now = new Date().getTime();
        if (now > item.expiration) {
            if (item.value === douyin) {
                setLocalStorageWithExpiration('api_type', weibo, 3);
                api_type = weibo;
            } else {
                setLocalStorageWithExpiration('api_type', douyin, 3);
                api_type = douyin;
            }
        } else {
            api_type = item.value;
        }
    }
    var data = sessionStorage.getItem('hot_word');
    if (data == null) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', api_host + api_type, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                console.log(result);
                if (result.code == 200) {
                    var data = result.data;
                    var new_data = [];
                    for (let i = 0; i < data.length; i++) {
                        new_data.push(data[i].name);
                    }
                    console.log(new_data);
                    sessionStorage.setItem('hot_word', JSON.stringify(new_data));
                    search_dic = new_data;
                }
            } else {
                console.error('请求失败，状态码为：', xhr.status);
            }
        };
        xhr.onerror = function () {
            console.error('请求出错');
        };
        xhr.send();
    } else {
        search_dic = JSON.parse(data);
    }
}

function setLocalStorageWithExpiration(key, value, expirationInMinutes) {
    const expirationDate = new Date(new Date().getTime() + expirationInMinutes * 60000);
    const item = {
        value: value, expiration: expirationDate.getTime()
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getLocalStorageWithExpiration(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now > item.expiration) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

(async function () {
    'use strict';
    const d = document.createElement('div');
    d.innerHTML = '<div id="reward-begin" style="background-color: #ffffff;padding:5px 10px;border-radius: 5px;box-shadow: 0px 0px 20px 0px #e3e3e3;">开始</div><div id="reward-stop" style="margin-top:18px;background-color: #ffffff;padding:5px 10px;border-radius: 5px;box-shadow: 0px 0px 20px 0px #e3e3e3;">停止</div>';
    d.style = 'position:fixed;right:15px;bottom:20%;z-index:999999;color:#0078d4;user-select:none;';
    document.body.append(d);
    document.getElementById('reward-begin').onclick = () => {
        sessionStorage.setItem('Cnt', 0);
        location.href = "https://www.bing.com/?br_msg=Please-Wait";
    };
    document.getElementById('reward-stop').onclick = () => {
        sessionStorage.setItem('Cnt', parseInt(max_rewards) + 20);
        location.href = "https://rewards.bing.com/";
    };
    // localStorage.removeItem('api_type');
    await SetSearchDic();
    console.log(search_dic);

    if (sessionStorage.getItem('Cnt') == null) {
        sessionStorage.setItem('Cnt', parseInt(max_rewards) + 20);
    }

    const now_times = parseInt(sessionStorage.getItem('Cnt'));
    const randomNumber = Math.floor(Math.random() * (10000 - 3000 + 1)) + 1000;
    //alert(sessionStorage.getItem('Cnt'));
    if (now_times <= max_rewards / 2) {
        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + now_times + " / " + max_rewards + "] " + tt.innerHTML;

        setTimeout(function () {
            sessionStorage.setItem('Cnt', now_times + 1);
            let nowtxt = search_dic[now_times];
            //nowtxt = AutoStrTrans(nowtxt);
            location.href = "https://www.bing.com/search?q=" + encodeURI(nowtxt);
        }, randomNumber);
    }
    if (now_times > max_rewards / 2 && now_times < max_rewards) {

        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + now_times + " / " + max_rewards + "] " + tt.innerHTML;

        setTimeout(function () {
            sessionStorage.setItem('Cnt', now_times + 1);
            let nowtxt = search_dic[now_times];
            //nowtxt = AutoStrTrans(nowtxt);
            location.href = "https://cn.bing.com/search?q=" + encodeURI(nowtxt);
        }, randomNumber);
    }
})();
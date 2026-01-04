// ==UserScript==
// @name         积分记录
// @namespace    http://tampermonkey.net/
// @version      0.2.4.1
// @description  记录积分变化
// @author       You
// @match        https://www.gamemale.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/465493/%E7%A7%AF%E5%88%86%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/465493/%E7%A7%AF%E5%88%86%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    'use strict';
    //进入帖子时更新
    let counted = false;
    var button = document.querySelector("#fastpostsubmit")
    // if (window.location.href.slice(25, 31) == "thread") {
    if (button != null && button != undefined) {
        // console.log("脚本已生效");
        checkCredits()
        showReply()
        showCredits()
        button.addEventListener("click", function () {
            setTimeout(() => {
                replycount(counted)
                updateShow()
                counted = true
            }, 3000);
        });
    }
})();
//已回贴
function replycount(counted) {
    let reply = JSON.parse(localStorage.getItem("reply"))
    if (checkReply() == true && counted == false) {
        reply.count++;
        localStorage.setItem("reply", JSON.stringify(reply));
    }
}

//未回帖
//已回贴

//未回帖
function checkReply() {
    let len = document.querySelector("#postlistreply").childNodes.length;
    if (len == 1) {
        return false;
    } else {
        return true;
    }
}

function showReply() {
    let reply = JSON.parse(localStorage.getItem("reply"))
    let today = new Date().toLocaleDateString()
    if (reply == null || reply == undefined || reply.date != today) {
        reply = {
            "date": today,
            "count": 0
        }
        console.log("reply init");
    }
    localStorage.setItem("reply", JSON.stringify(reply));

    if (document.getElementsByClassName("showReply")[0] != null || document.getElementsByClassName("showReply")[0] != undefined) {
        document.getElementsByClassName("showReply")[0].remove()
    }

    let e = document.querySelector(`#fastpostform > table > tbody > tr > td.plc`)


    if(e!=null&&e!=undefined){
        let div = document.createElement("div")
        div.setAttribute('class', 'showReply')
        div.innerHTML = "【累计回帖】：" + reply.count
        e.appendChild(div)



    }

}

function updateShow() {
    document.getElementsByClassName("showCredits")[0].remove()
    document.getElementsByClassName("showCredits")[0].remove()
    document.getElementsByClassName("showReply")[0].remove()
    document.getElementsByClassName("resetbutton")[0].remove()
    
    checkCredits()
    showReply()
    showCredits()

}
function showCredits() {
    let change = JSON.parse(localStorage.getItem("change"))
    let sum = JSON.parse(localStorage.getItem("sum"))
    delete change.日期
    delete sum.日期

    let e = document.querySelector(`#fastpostform > table > tbody > tr > td.plc`)
    if (e != null && e != undefined) {
        let div1 = document.createElement("div")
        div1.innerHTML = "【积分变动】：" + getHtmlText(change)
        div1.setAttribute('class', 'showCredits')
        e.appendChild(div1)
        let div2 = document.createElement("div")
        div2.innerHTML = "【当日累积】：" + getHtmlText(sum)
        div2.setAttribute('class', 'showCredits')
        e.appendChild(div2)

        let a1 = document.createElement("a")
        a1.innerHTML = "【记录重置】"
        a1.setAttribute('class', 'resetbutton')
        a1.style.cursor="pointer"
        a1.addEventListener("click", function () {
            localStorage.removeItem("latest")
            localStorage.removeItem("change")
            localStorage.removeItem("sum")
            localStorage.removeItem("reply")
            updateShow()
        });
        e.appendChild(a1)

    }

}

function getHtmlText(credit){
    return `<a class="bbda mbn pbn"><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023041d2ow7j3gifb55ifo.jpg" /> 旅程: <span id="hcredit_1">${credit["旅程"]}</span></a><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023039r465s6wuz65a5sx4.jpg" /> 金币: <span id="hcredit_2">${credit["金币"]}</span></a><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023033uxlbvypbeqlzjyy5.jpg" /> 血液: <span id="hcredit_3">${credit["血液"]}</span></a><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023043vji23ad4jinid9jn.jpg" /> 追随: <span id="hcredit_4">${credit["追随"]}</span></a><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023035iqtc01s1kmcth4rn.jpg" /> 咒术: <span id="hcredit_5">${credit["咒术"]}</span></a><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023037obuzvrurwdtlcsnr.jpg" /> 知识: <span id="hcredit_6">${credit["知识"]}</span></a><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023047w6n62fn6mm4k3mpk.jpg" /> 灵魂: <span id="hcredit_7">${credit["灵魂"]}</span></a><a style="margin:2px"><img style="vertical-align:middle" src="https://img.gamemale.com/album/201404/12/023045jmv454mfvzo2fmpm.jpg" /> 堕落: <span id="hcredit_8">${credit["堕落"]}</span></a></a>`
}


//上一次积分变动：change-{}
function checkCredits() {
    let old = JSON.parse(localStorage.getItem("latest"))
    let today = new Date().toLocaleDateString()
    if (old == null || old == undefined || old["日期"] != today) {
        console.log("初始化积分信息");
        creditsDataInit();
    } else {
        let latest = getRecord()
        //遍历对象属性
        let change = shallowEqual(old, latest)
        if (change == true) {
            console.log("积分未发生变动");
            //清空change?
        } else {
            localStorage.setItem("change", JSON.stringify(change))
            let sum = sumCredits()//需要用到change
            localStorage.setItem("sum", JSON.stringify(sum))
            console.log("积分存在变动，change：", change, "累积变动：", sum);

            localStorage.setItem("latest", JSON.stringify(latest))
            console.log("更新当前积分:", latest);
        }
    }

}
function creditsDataInit() {
    let latest = getRecord()
    localStorage.setItem("latest", JSON.stringify(latest))
    let change = latest
    let keys = Object.keys(change);
    for (let index = 0; index < keys.length; index++) {
        if (keys[index] != "日期") {
            change[keys[index]] = 0
        }
    }
    localStorage.setItem("change", JSON.stringify(change))
    localStorage.setItem("sum", JSON.stringify(change))
}

//累积积分变动
function sumCredits() {
    let sum = JSON.parse(localStorage.getItem("sum"));
    let change = JSON.parse(localStorage.getItem("change"));
    let keys = Object.keys(change);
    //sum的日期(sum["日期"])与今天不同时，初始化
    let dateStr = new Date().toLocaleDateString()
    if (sum["日期"] != dateStr) {
        sum = getRecord()
        for (let index = 0; index < keys.length; index++) {
            if (keys[index] != "日期") {
                sum[keys[index]] = 0
            }
        }
        console.log("变化累积不是当日的，初始化：", sum);
    }
    //change累加到sum
    for (let index = 0; index < keys.length; index++) {
        if (keys[index] != "日期") {
            sum[keys[index]] = sum[keys[index]] + change[keys[index]]
        }
    }
    console.log("sum:", sum);
    return sum;
}

function shallowEqual(old, latest) {
    let equal = true;
    const keys1 = Object.keys(old);
    const keys2 = Object.keys(latest);
    if (keys1.length !== keys2.length) {
        equal = false;
    } else {
        for (let index = 0; index < keys1.length; index++) {
            const val1 = old[keys1[index]];
            const val2 = latest[keys2[index]];
            if (val1 !== val2) {
                equal = false;
                break;
            }
        }
    }
    if (equal == true) {
        return true;
    } else {
        let result = old
        for (let index = 0; index < keys1.length; index++) {
            if (keys1[index] != "日期") {
                result[keys1[index]] = latest[keys2[index]] - old[keys1[index]]
            } else {
                result[keys1[index]] = latest[keys2[index]]
            }
        }
        return result;
    }
}

//【同步】网络请求并本地存储
function getRecord() {
    let result = null;
    let re = /\d+/g//g：查询多次，而不是查询第一个符合
    $.ajax({
        type: "get",
        url: "https://www.gamemale.com/home.php?mod=spacecp&ac=credit&showcredit=1&inajax=1&ajaxtarget=extcreditmenu_menu",
        cache: false,
        async: false,//同步请求
        dataType: "text",
        success: function (data) {   // data是形参名，代表返回的数据
            var dom = document.createElement('div');
            dom.innerHTML = data;
            let lis = dom.firstElementChild.firstElementChild.children;
            let credits = {};
            let dateString = new Date().toLocaleDateString()// =>2023/5/4.
            credits["日期"] = dateString;
            for (let i = 0; i < lis.length; i++) {
                let credit = Number(lis[i].children[1].innerHTML.match(re)[0])
                switch (i) {
                    case 0:
                        credits["旅程"] = credit
                        break;
                    case 1:
                        credits["金币"] = credit
                        break;
                    case 2:
                        credits["血液"] = credit
                        break;
                    case 3:
                        credits["追随"] = credit
                        break;
                    case 4:
                        credits["咒术"] = credit
                        break;
                    case 5:
                        credits["知识"] = credit
                        break;
                    case 6:
                        credits["灵魂"] = credit
                        break;
                    case 7:
                        credits["堕落"] = credit
                        break;
                    default:
                        break;
                }
            }
            result = credits;
            // window.localStorage.setItem("record", data)
        },
        error: function (error) {
            console.log(error);
            result = error
        }
    });
    return result;
}
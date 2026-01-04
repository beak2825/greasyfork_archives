// ==UserScript==
// @name         点赞小工具
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  点赞or顶帖点赞收藏三连
// @author       You
// @match        https://www.gamemale.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemale.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470021/%E7%82%B9%E8%B5%9E%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/470021/%E7%82%B9%E8%B5%9E%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
    'use strict';
    var e = document.querySelector("#ak_rate > i")
    if (e != null && e != undefined) {
        var btnLike = document.createElement("button")
        btnLike.textContent = '点赞';
        btnLike.addEventListener('click', () => {
            like()
        });
        document.querySelector("#p_btn").appendChild(btnLike)

        var btnTriple = document.createElement("button")
        btnTriple.textContent = '三连';
        btnTriple.addEventListener('click', () => {
            Triple()
        });
        document.querySelector("#p_btn").appendChild(btnTriple)
    }

})();



function like() {
    let re = /\d+/g//g：查询多次，而不是查询第一个符合
    let level = document.querySelector("#g_upmine > font").innerHTML.match(re)[0];
    if (level < 2) {
        alert("等级<2,无法追随")
    }
    else if (level < 5) {
        if (follow(1) == false) {
            alert("评分次数已达到今日最大值")
        }
    }
    else if (level < 7) {
        if (follow(1) == false) {
            if (degenerate(1) == false) {
                alert("评分次数已达到今日最大值")
            }
        }
    }
    else {
        if (follow(1) == false) {
            if (blood(1) == false) {
                if (degenerate(1) == false) {
                    alert("评分次数已达到今日最大值")
                }
            }
        }
    }
}


function follow(num) {
    document.querySelector("#ak_rate > i").click()
    setTimeout(() => {
        var rest = document.querySelector("#rateform > div > table > tbody > tr:nth-child(3) > td:nth-child(4)").innerHTML
        if (rest >= 1) {
            document.querySelector("#score4").value = num
            document.querySelector("#sendreasonpm").click()
            document.querySelector("#rateform > p > button").click()
            return true
        } else {
            return false
        }
    }, 300);

}
function degenerate(num) {
    document.querySelector("#ak_rate > i").click()
    setTimeout(() => {
        var rest = document.querySelector("#rateform > div > table > tbody > tr:nth-child(4) > td:nth-child(4)").innerHTML
        if (rest >= 1) {
            document.querySelector("#score8").value = num
            document.querySelector("#sendreasonpm").click()
            document.querySelector("#rateform > p > button").click()
            return true
        } else {
            return false
        }
    }, 300);
    
}


function blood(num) {
    document.querySelector("#ak_rate > i").click()
    setTimeout(() => {
        var rest = document.querySelector("#rateform > div > table > tbody > tr:nth-child(2) > td:nth-child(4)").innerHTML
        if (rest >= 1) {
            document.querySelector("#score3").value = num
            document.querySelector("#sendreasonpm").click()
            document.querySelector("#rateform > p > button").click()
            return true
        } else {
            return false
        }
    }, 300);
    
}

function Triple() {
    document.querySelector("#recommend_add > i").click()
    document.querySelector("#k_favorite > i").click()
    document.querySelector("#ak_rate > i").click()
    setTimeout(() => {
        var follow = document.querySelector("#rateform > div > table > tbody > tr:nth-child(3) > td:nth-child(4)").innerHTML
        var degenerate = document.querySelector("#rateform > div > table > tbody > tr:nth-child(4) > td:nth-child(4)").innerHTML
        var blood = document.querySelector("#rateform > div > table > tbody > tr:nth-child(2) > td:nth-child(4)").innerHTML
        if (follow < 1 && degenerate < 1 && blood < 1) {
            alert("评分次数已达到今日最大值")
        }
        else {
            document.querySelector("#score4").value = follow >= 1 ? 1 : 0
            document.querySelector("#score8").value = degenerate >= 1 ? 1 : 0
            if (blood >= 3) {
                document.querySelector("#score3").value = 3
            } else if (blood >= 1) {
                document.querySelector("#score3").value = 1
            } else {
                document.querySelector("#score3").value = 0
            }
            document.querySelector("#sendreasonpm").click()
            document.querySelector("#rateform > p > button").click()
        }
    }, 300);
}

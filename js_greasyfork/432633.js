// ==UserScript==
// @name         小黑屋文字游戏辅助脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  小黑屋游戏的辅助脚本，实现了快速收集木材和皮毛，快速击杀，无视探险冷却，无视飞船出发冷却。
// @author       lty123
// @match        http://lab.mkblog.cn/adarkroom/index.html
// @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2Fcceda1359f01555d2c64e2f8dc03ecfaae9fd71b.png&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634615646&t=7cf941a9e15deab04430774d5db68209
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432633/%E5%B0%8F%E9%BB%91%E5%B1%8B%E6%96%87%E5%AD%97%E6%B8%B8%E6%88%8F%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/432633/%E5%B0%8F%E9%BB%91%E5%B1%8B%E6%96%87%E5%AD%97%E6%B8%B8%E6%88%8F%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    //添加元素
    let buttonDiv = document.createElement("div");
    document.body.appendChild(buttonDiv);
    buttonDiv.innerHTML = `<button class="divButton">快速收集木头</button>
                           <button class="divButton">结束收集木头</button>
                           <button class="divButton">快速查看陷阱</button>
                           <button class="divButton">结束查看陷阱</button>
                           <button class="divButton" id="attackButton">关闭自动击杀</button>`;
    buttonDiv.style.display = "flex";
    buttonDiv.style.position = "absolute";
    buttonDiv.style.width = "100px";
    buttonDiv.style.top = "20%";

    let mood = document.querySelectorAll(".divButton");
    //点击事件
    var d;
    mood[0].addEventListener("click", function () {
        console.log("start");
        clearInterval(d);
        d = setInterval(() => {
            $('#gatherButton').removeClass('disabled');
            $('#gatherButton').click();

        }, 100);
    });

    mood[1].addEventListener("click", function () {
        console.log("end");
        clearInterval(d);

    });
    mood[2].addEventListener("click", function () {
        clearInterval(d);
        d = setInterval(() => {
            $('#trapsButton').removeClass('disabled');
            $('#trapsButton').click();

        }, 100);

    });
    mood[3].addEventListener("click", function () {
        console.log("end");
        clearInterval(d);

    });
    //直接出发
    //$('#embarkButton').removeClass('disabled');
    setInterval(() => {
        let embarkButton = document.querySelector("#embarkButton");
        if (embarkButton !== null) {
            embarkButton.classList.remove("disabled");
        }
        //直接起飞
        $('#liftoffButton').removeClass('disabled');
    }, 500);

    let attackFlag = true;
    mood[4].addEventListener("click", function () {
        if (attackFlag === true) {
            //console.log("关闭自动击杀");
            $("#attackButton").text("开启自动击杀");
            attackFlag = false;
        } else {
            attackFlag = true;
            $("#attackButton").text("关闭自动击杀");
            //console.log("开启自动击杀");
        }
    });
    //快速击杀
    let attack = setInterval(() => {
        if (attackFlag === true) {
            //挥拳
            $('#attack_fists').removeClass('disabled');
            $('#attack_fists').click();
            //劈砍
            $('#attack_steel-sword').removeClass('disabled');
            $('#attack_steel-sword').click();
        } else {

        }
    }, 100);

})();
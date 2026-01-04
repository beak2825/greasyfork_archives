// ==UserScript==
// @name         猫国资源修改
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  修改资源属性
// @author       Senynce
// @match        https://likexia.gitee.io/cat-zh/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382036/%E7%8C%AB%E5%9B%BD%E8%B5%84%E6%BA%90%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/382036/%E7%8C%AB%E5%9B%BD%E8%B5%84%E6%BA%90%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    var autoTick = 0;
    var Common = {
        CnItem: (text) => {
            for (var i in cnItems) {
                if (i.toLowerCase() == text) {
                    return cnItems[i];
                }
            };
            return text;
        },
    };

    var Ui = {
        InitDiv: () => {
            var html =
                `<div id="senResourcesDiv" style="height: 680px;margin-top: -480px; display: none;overflow-y:scroll;" class="dialog help">` +
                `<a href="#" id="senResourcesDivClose" class="close" onClick='$("#senResourcesDiv").hide();' style="position: absolute; top: 10px; right: 15px;">取消</a>` +
                `<div id="senResourcesDiv1"></div>` +
                `</div>`;
            $("#gameContainerId").after(html);
            $("#senResourcesDiv").prepend(`<input type = "button" id="btnSen" value="提交">`);
        },

        InitSen: () => {
            $("#senResourcesDiv1").empty();
            var html = ``;
            var x = JSON.parse(localStorage.getItem("com.nuclearunicorn.kittengame.savedata")).resources;
            for (var i = 0; i < x.length; i++) {
                var text = Common.CnItem(x[i].name.toLowerCase());
                var value = Math.ceil(x[i].value);
                var name = x[i].name.toLowerCase();
                html += `<div><span>${text}</span><input type="text" id =${name} name =${name} value = ${value}></div>`;
            }
            $("#senResourcesDiv1").append(html);
        },

        InitTurbo: () => {
            var html =
                `<div class="btn nosel modern btnSenTurboOn" style="position: relative; display: block;"  > <div class="btnContent" title=""><span>开启</span></div></div>` +
                `<div class="btn nosel modern btnSenTurboOff" style="position: relative; display: block;"  > <div class="btnContent" title=""><span>关闭</span></div></div>`;
            $("#gameContainerId").after(html);
            $(".btnSenTurboOn").on("click", () => {
                autoTick = setInterval(function () {
                    game.tick();
                }, 10);
            });
            $(".btnSenTurboOff").on("click", () => {
                clearInterval(autoTick);
                autoTick = 0;
            });
        },

    };

    $(document).ready(function () {
        var temp = document.querySelector('#headerLinks > div.links-block');
        var html = temp.innerHTML;
        html = `<a href="#" id ="senInitAchievements"> 解锁成就 </a>|` + html;
        html = `<a href="#" id ="senInitChallenges"> 解锁挑战 </a>|` + html;
        html = `<a href="#" id ="senInitResources"> 修改资源 </a>|` + html;
        html = `<a href="#" id ="senInitTurbo"> 涡轮引擎 </a>|` + html;
        temp.innerHTML = html;
        Ui.InitDiv();
    });

    $("#btnSen").click(function () {
        var x = JSON.parse(localStorage.getItem("com.nuclearunicorn.kittengame.savedata"))
        for (var i = 0; i < x.resources.length; i++) {
            var name = x.resources[i].name.toLowerCase();
            var _ = $('#senResourcesDiv1 input[id=' + name + ']');
            if (_.length > 0) {
                x.resources[i].value = _[0].value * 1.0;
            }
        }
        localStorage.setItem("com.nuclearunicorn.kittengame.savedata", JSON.stringify(x));
        window.location.reload();
    });

    $("#senInitResources").click(function () {
        $('#senResourcesDiv').toggle();
        gamePage.saveUI();
        Ui.InitSen();
    });

    $("#senInitAchievements").click(function () {
        try {
            game.achievements.unlockAll();
            gamePage.saveUI();
            game.msg("Sen：解锁成就完成");
        } catch (e) {
            game.msg("Sen：解锁成就失败，请先继续玩会！");
        }
    });

    $("#senInitChallenges").click(function () {
        try {
            if (game.challenges.meta.length > 0) {
                for (var i = 0; i < game.challenges.meta[0].meta.length; i++) {
                    game.challenges.meta[0].meta[i].researched = true;
                }
                game.msg("Sen：解锁挑战完成");
            }
            gamePage.saveUI();
        } catch (e) {
            game.msg("Sen：解锁挑战失败，请先继续玩会！");
        }
    });

    $("#senInitTurbo").click(function () {
        Ui.InitTurbo();
    });

    $("#kxj2").click();
})();
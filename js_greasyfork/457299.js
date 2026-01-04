// ==UserScript==
// @author              Hunlongyu
// @name               『游戏助手』dusays.com
// @namespace           https://github.com/Hunlongyu
// @icon                https://i.loli.net/2019/04/22/5cbd720718fdb.png
// @description         修改 等级，金币，属性值，转生点数。
// @version             0.1.0
// @match               https://game.dusays.com/*
// @grant               GM_addStyle
// @grant               GM_getResourceText
// @run-at              document-end
// @require             https://cdn.jsdelivr.net/npm/js-base64@3.7.3/base64.min.js
// @resource            PURE https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css
// @supportURL          https://gist.github.com/Hunlongyu/743151a1480751ca54b5e93da76cf6ee
// @downloadURL https://update.greasyfork.org/scripts/457299/%E3%80%8E%E6%B8%B8%E6%88%8F%E5%8A%A9%E6%89%8B%E3%80%8Fdusayscom.user.js
// @updateURL https://update.greasyfork.org/scripts/457299/%E3%80%8E%E6%B8%B8%E6%88%8F%E5%8A%A9%E6%89%8B%E3%80%8Fdusayscom.meta.js
// ==/UserScript==

(function() {
    'use strict'

    function getLocalStorageSD() {
        const sd = localStorage.getItem("_sd");
        if (sd) return sd;
        const data = `
        ZXlKd2JHRjVaWEpGY1hWcGNHMWxiblFpT25zaWNHeGhlV1Z5VjJWaGNHOXVJanA3SW14Mklqb3hMQ0pwZEdWdFZIbHdaU0k2SW5kbFlYQnZiaUlzSW5GMVlXeHBkSGtpT25zaWJ
        tRnRaU0k2SXVlZ3RPYVhweUlzSW5GMVlXeHBkSGxEYjJWbVptbGphV1Z1ZENJNk1DNDNMQ0p3Y205aVlXSnBiR2wwZVNJNklqQXVNalVpTENKamIyeHZjaUk2SWlOaE1XRXhZVEVpTENKbGVIUnlZVVZ1
        ZEhKNVRuVnRJam94ZlN3aWRIbHdaU0k2ZXlKdVlXMWxJam9pNXBhdzVvbUw1NSt0NVltUklpd2laR1Z6SWpvaTVwYXc1b21MNkkrYzZiaWg1TDIvNTVTbzU1cUU1NSt0NVltUklpd2lhV052YmxOeVl5S
        TZJaTR2YVdOdmJuTXZWMTlUZDI5eVpEQXdNUzV3Ym1jaUxDSmxiblJ5ZVNJNlczc2lkbUZzUTI5bFptWnBZMmxsYm5RaU9qQXVPU3dpZG1Gc2RXVWlPakVzSW5Ob2IzZFdZV3dpT2lJck1TSXNJblI1Y0d
        VaU9pSkJWRXNpTENKdVlXMWxJam9pNXBTNzVZZTc1WXFiSW4xZGZTd2laWGgwY21GRmJuUnllU0k2VzNzaWRtRnNkV1VpT2pFc0luTm9iM2RXWVd3aU9pSXJNU0lzSW5SNWNHVWlPaUpCVkVzaUxDSnVZ
        VzFsSWpvaTVwUzc1WWU3NVlxYkluMWRmU3dpY0d4aGVXVnlRWEp0YjNJaU9uc2liSFlpT2pFc0ltbDBaVzFVZVhCbElqb2lZWEp0YjNJaUxDSnhkV0ZzYVhSNUlqcDdJbTVoYldVaU9pTG5vTFRtbDZja
        UxDSnhkV0ZzYVhSNVEyOWxabVpwWTJsbGJuUWlPakF1Tnl3aWNISnZZbUZpYVd4cGRIa2lPaUl3TGpJMUlpd2lZMjlzYjNJaU9pSWpZVEZoTVdFeElpd2laWGgwY21GRmJuUnllVTUxYlNJNk1YMHNJblI
        1Y0dVaU9uc2libUZ0WlNJNkl1YVdzT2FKaStXNGcraWhveUlzSW1SbGN5STZJdWFXc09hSmkraVBuT200b2VlcHYrZWFoT2FacnVtQW11aWhvK2VKcVNJc0ltbGpiMjVUY21NaU9pSXVMMmxqYjI1ekwwR
        mZRVE11Y0c1bklpd2laVzUwY25raU9sdDdJblpoYkVOdlpXWm1hV05wWlc1MElqb3dMamtzSW5aaGJIVmxJam94TENKemFHOTNWbUZzSWpvaUt6RWlMQ0owZVhCbElqb2lSRVZHSWl3aWJtRnRaU0k2SX
        VtWXN1VytvZVdLbXlKOVhYMHNJbVY0ZEhKaFJXNTBjbmtpT2x0N0luUjVjR1VpT2lKSVVDSXNJblpoYkhWbElqb3hNQ3dpYzJodmQxWmhiQ0k2SWlzeE1DSXNJbTVoYldVaU9pTG5sSi9sa2IzbGdMd2l
        mVjE5TENKd2JHRjVaWEpTYVc1bklqcDdJbXgySWpveExDSnBkR1Z0Vkhsd1pTSTZJbkpwYm1jaUxDSnhkV0ZzYVhSNUlqcDdJbTVoYldVaU9pTG5vTFRtbDZjaUxDSnhkV0ZzYVhSNVEyOWxabVpwWTJs
        bGJuUWlPakF1Tnl3aWNISnZZbUZpYVd4cGRIa2lPaUl3TGpJMUlpd2lZMjlzYjNJaU9pSWpZVEZoTVdFeElpd2laWGgwY21GRmJuUnllVTUxYlNJNk1YMHNJblI1Y0dVaU9uc2libUZ0WlNJNkl1YVdzT
        2FKaSthTWgrZU9yeUlzSW1SbGN5STZJdVM0Z09TNHF1YVpydW1BbXVlYWhPYU1oK2VPcnlJc0ltbGpiMjVUY21NaU9pSXVMMmxqYjI1ekwwRmpYekV3TG5CdVp5SXNJbVZ1ZEhKNUlqcGJleUoyWVd4RG
        IyVm1abWxqYVdWdWRDSTZNQzQ1TENKMllXeDFaU0k2TWpBc0luTm9iM2RXWVd3aU9pSXJNakFpTENKMGVYQmxJam9pU0ZBaUxDSnVZVzFsSWpvaTU1U2Y1Wkc5NVlDOEluMWRmU3dpWlhoMGNtRkZiblJ
        5ZVNJNlczc2lkSGx3WlNJNklrTlNTVlFpTENKMllXeDFaU0k2TVRBc0luTm9iM2RXWVd3aU9pSXJNVEFsSWl3aWJtRnRaU0k2SXVhYXRPV0h1K2VPaHlKOVhYMHNJbkJzWVhsbGNrNWxZMnNpT25zaWJI
        WWlPakVzSW1sMFpXMVVlWEJsSWpvaWJtVmpheUlzSW5GMVlXeHBkSGtpT25zaWJtRnRaU0k2SXVlZ3RPYVhweUlzSW5GMVlXeHBkSGxEYjJWbVptbGphV1Z1ZENJNk1DNDNMQ0p3Y205aVlXSnBiR2wwZ
        VNJNklqQXVNalVpTENKamIyeHZjaUk2SWlOaE1XRXhZVEVpTENKbGVIUnlZVVZ1ZEhKNVRuVnRJam94ZlN3aWRIbHdaU0k2ZXlKdVlXMWxJam9pNXBhdzVvbUw2YUc1NVoyZ0lpd2laR1Z6SWpvaTVMaU
        E1TGlxNXBtdTZZQ2E1NXFFNW95SDU0NnZJaXdpYVdOdmJsTnlZeUk2SWk0dmFXTnZibk12UVdOZk15NXdibWNpTENKbGJuUnllU0k2VzNzaWRtRnNRMjlsWm1acFkybGxiblFpT2pBdU9Td2lkbUZzZFd
        VaU9qSXdMQ0p6YUc5M1ZtRnNJam9pS3pJd0lpd2lkSGx3WlNJNklraFFJaXdpYm1GdFpTSTZJdWVVbitXUnZlV0F2Q0o5WFgwc0ltVjRkSEpoUlc1MGNua2lPbHQ3SW5SNWNHVWlPaUpEVWtsVUlpd2lk
        bUZzZFdVaU9qRXdMQ0p6YUc5M1ZtRnNJam9pS3pFd0pTSXNJbTVoYldVaU9pTG1tclRsaDd2bmpvY2lmVjE5ZlN3aVltRmphM0JoWTJ0RmNYVnBjRzFsYm5RaU9sdDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N
        2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlN4N2ZTeDdmU3g3ZlYwc0lteDJJam
        94TENKbmIyeGtJam93TENKbGJtUnNaWE56VEhZaU9qQXNJbkpCSWpwN0lraFFJam93TENKQlZFc2lPakFzSWtOU1NWUWlPakFzSWtOU1NWUkVUVWNpT2pBc0lrUkZSaUk2TUN3aVFreFBReUk2TUN3aVR
        VOVdSVk5RUlVWRUlqb3dMQ0pDUVZSVVRFVlRVRVZGUkNJNk1IMHNJbklpT25zaVkyOTFiblFpT2pBc0luQnZhVzUwSWpvd2ZYMD0=`;
        return data;
    }

    function setLocalStorageSD(str) {
        localStorage.removeItem("_sd");
        localStorage.setItem("_sd", str);
    }

    function decoded(sd) {
        const base = Base64.decode(sd);
        const str = Base64.decode(base);
        return JSON.parse(str);
    }

    function encoded(config) {
        const str = JSON.stringify(config);
        const base = Base64.encode(str);
        return Base64.encode(base);
    }

    function closeConfigDom() {
        document.querySelector("#hly-save").removeEventListener("click", saveConfig);
        document.querySelector("#hly-close").removeEventListener("click", closeConfigDom);
        const dom = document.getElementById("hly-box");
        document.body.removeChild(dom);
    }

    function showConfigDom() {
        const sd = getLocalStorageSD();
        const config = decoded(sd);
        createDom(config);
    }

    function createDom(config) {
        const dom = document.getElementById("hly-box");
        if (dom) return false;
        const template = `
            <div id="hly-box">
                <form class="pure-form pure-form-aligned">
                    <fieldset>
                        <div class="pure-control-group">
                            <label for="aligned-lv">等级</label>
                            <input type="text" id="aligned-lv" placeholder="${config.lv}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-gold">金币</label>
                            <input type="text" id="aligned-gold" placeholder="${config.gold}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-HP">生命值</label>
                            <input type="text" id="aligned-HP" placeholder="${config.rA.HP}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-ATK">攻击力</label>
                            <input type="text" id="aligned-ATK" placeholder="${config.rA.ATK}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-CRIT">暴击率</label>
                            <input type="text" id="aligned-CRIT" placeholder="${config.rA.CRIT}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-CRITDMG">暴击伤害</label>
                            <input type="text" id="aligned-CRITDMG" placeholder="${config.rA.CRITDMG}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-DEF">护甲</label>
                            <input type="text" id="aligned-DEF" placeholder="${config.rA.DEF}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-BLOC">格挡</label>
                            <input type="text" id="aligned-BLOC" placeholder="${config.rA.BLOC}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-MOVESPEED">副本行进速度</label>
                            <input type="text" id="aligned-MOVESPEED" placeholder="${config.rA.MOVESPEED}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-BATTLESPEED">副本战斗速度</label>
                            <input type="text" id="aligned-BATTLESPEED" placeholder="${config.rA.BATTLESPEED}" />
                        </div>
                        <div class="pure-control-group">
                            <label for="aligned-point">转生点数</label>
                            <input type="text" id="aligned-point" placeholder="${config.r.point}" />
                        </div>
                        <div class="pure-controls">
                            <button class="pure-button pure-button-primary" id="hly-save">保存</button>
                            <button class="pure-button pure-button-primary" id="hly-close">关闭</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        `;
        const doc = new DOMParser().parseFromString(template, "text/html");
        const div = doc.querySelector('#hly-box');
        document.body.appendChild(div);
        document.querySelector("#hly-save").addEventListener("click", saveConfig, false);
        document.querySelector("#hly-close").addEventListener("click", closeConfigDom, false);
        const css = `
            #hly-box{
                background-color: #fff;
                position: absolute;
                right: 0;
                padding: 10px;
            }
        `;
        GM_addStyle(css);
    }

    function saveConfig() {
        const sd = getLocalStorageSD();
        const config = decoded(sd);

        const lv = document.getElementById("aligned-lv").value;
        const lv2 = document.getElementById("aligned-lv").placeholder;
        config.lv = Number(lv) || Number(lv2);

        const gold = document.getElementById("aligned-gold").value;
        const gold2 = document.getElementById("aligned-gold").placeholder;
        config.gold = Number(gold) || Number(gold2);

        const HP = document.getElementById("aligned-HP").value;
        const HP2 = document.getElementById("aligned-HP").placeholder;
        config.rA.HP = Number(HP) || Number(HP2);

        const ATK = document.getElementById("aligned-ATK").value;
        const ATK2 = document.getElementById("aligned-ATK").placeholder;
        config.rA.ATK = Number(ATK) || Number(ATK2);

        const CRIT = document.getElementById("aligned-CRIT").value;
        const CRIT2 = document.getElementById("aligned-CRIT").placeholder;
        config.rA.CRIT = Number(CRIT) || Number(CRIT2);

        const CRITDMG = document.getElementById("aligned-CRITDMG").value;
        const CRITDMG2 = document.getElementById("aligned-CRITDMG").placeholder;
        config.rA.CRITDMG = Number(CRITDMG) || Number(CRITDMG2);

        const DEF = document.getElementById("aligned-DEF").value;
        const DEF2 = document.getElementById("aligned-DEF").placeholder;
        config.rA.DEF = Number(DEF) || Number(DEF2);

        const BLOC = document.getElementById("aligned-BLOC").value;
        const BLOC2 = document.getElementById("aligned-BLOC").placeholder;
        config.rA.BLOC = Number(BLOC) || Number(BLOC2);

        const MOVESPEED = document.getElementById("aligned-MOVESPEED").value;
        const MOVESPEED2 = document.getElementById("aligned-MOVESPEED").placeholder;
        config.rA.MOVESPEED = Number(MOVESPEED) || Number(MOVESPEED2);

        const BATTLESPEED = document.getElementById("aligned-BATTLESPEED").value;
        const BATTLESPEED2 = document.getElementById("aligned-BATTLESPEED").placeholder;
        config.rA.BATTLESPEED = Number(BATTLESPEED) || Number(BATTLESPEED2);

        const point = document.getElementById("aligned-point").value;
        const point2 = document.getElementById("aligned-point").placeholder;
        config.r.point = Number(point) || Number(point2);

        const str = encoded(config);
        setLocalStorageSD(str);
        setTimeout(() => {
            window.location.reload(true);
        });
    }

    function createBtn() {
        const dom = document.querySelector("#hly-helper");
        if (dom) return;
        const template = `
            <div class="c-tooltip" id="hly-helper" style="cursor: pointer;">
                <div class="c-tooltip-content">
                    <div class="Backpack">
                        <img width="34" height="34" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFCElEQVR4nO2bX2wURRjAv7srR+D651qhkqNoDU1s0VjU1geBUK2KqQQsRmtMOEtCYqOtsQ88SGKL9YGHJmKkGkxIqCUYidEKaiNBpATtQ61aDKFFIEBoL6RAe7S9Ate7Ht83l0nvZne7d204drPzS3Zud7Z9mN9833yz254NLI4UgIelkQLwsDRSAB6qVH+wo2wqPLUvApAPJsYGcMnusG9p/WxHJ6iA99Xx1jVcNPvgOTaU0La76RE8VWDDQ5XNdQ04foC2zz/G1rx432/EFmD/7iYbfihQ7SSkAClACojghxQgBaRYwGhwCo5dmYDK5el4paT9wjiUL1sImU47XuljGgE08La+UWjrH2Xn/ZvzQY3C/ZfY4L2FmeAtymTnM5EyAX+2bsNWn1XVzdjGMzgegtrOIegbCeJVlJkEcIqyndBSlgtL09PwSh3DC6DZfqF9gH0+mpUGZ2+GsFdfAP9ZioDfKvPYpxopF/D0m59gq+Tvbz/CVimg8mcfm3ka0N6yHFhzaAh79QWc3JgLWzuHmQSKhPb1HuxVYmgBLaf80PKfHzwLHXDwxQcgA2dx5XdX8Y6+gN7Xl8AYRk3V0RvgmwhD7RNuqC124514DCuAQp6H/t61OVCS68ReSEoAcXzwNtR3+VkKqKWCYQV8jSv+zp5hFvoHX1qEPVG4gO6qhxSDocWyHKURXABBqdBzLQg7n12kKJ+GFfAervpU75tKs2BD/gLsicIHoxbSPGWe88yHXauysSfKgf8D0HxqjO0PvsCqEIthBZT/MACDgVBc+BM8pIntJTlsUARtgGjwhPg7Z/2TbC1Y6kqDY5vysGcawwoQczmW5t5ROHBuAs+U1KxIh5rH4sOc4Kkjrh2mFED0DAVhz5lxlg5EyWInG3zszMdiOgE8BToqFoPH5cCe2eMLhKGi45q5UkBrEZwNplwEeRmk0KYd4FyoOnodF8KQucogbYAoDcYm4zdCycKrRsY8Owt/ce9gWAEEr+uxW+FkoK0w5f7YZER130AYWgDxKj4M9dPDkBsfhjASEpVAg996Ah+GMPQL8WHox/Ue7FWScgF6iAJiU4EkbCvO1E0HKpH1XSP4OxHN0OcYXgBBe3yqChQJBC2MVBloy8sjgmb8uO8ObpACbNYJmnla9e/pC5GN657HdprXXlmLrT5ciNqA1aBIoFdiVB0oGjh8o8Q3OkTGPDu8ja/D1HJexDQCOCSC9gcfdl3HK6UAKnVU77VCXmTOAhJNAZHZCuCIW2UuQNzq6iEFSAGN2EoB1hHw/S8nsJ3m0JHfsZUCZi9ALIMiWmXxfgkQmXMKWF6A2VJARAqQAhqxlQJSI8B35iQMne+BwLAPr6Zx5XjAs2IN5BaU4FViJCpALHsicy6DiQgIBW/B6V/3KAYuQiIef7kG0pz6b4FNJaD38C42eKfLDcuerIAF2Utgviv6t7s7gRG4NXIVrvzbAcGAn0lYuaEe78xMogL0uOcpQGF/sfswG3zRunc1Z5eipO/Il0xCweo34MGCUuzVxjQC+OwvX/0WuPOKsEcb/0AfXPjjm4SiwDQC+GpfvGm75uxzKB1O//QpnulXB9MJ0HodLqL1elxECrjfArx1Df4IQBaezsg7T01gmzxf/RP9xwctuku3YKvkmb/2YZs0l1FAPqhgw0MV+spMODzVCgAP46GJCQRcdjjs1Ul/ZcYqSAF4WBopAA9LY3kBdwHTMkJ9+9ggtQAAAABJRU5ErkJggg==">
                    </div>
                </div>
            </div>
        `;
        const doc = new DOMParser().parseFromString(template, "text/html");
        const div = doc.querySelector('#hly-helper');
        div.addEventListener('click', showConfigDom, false)
        const menu = document.querySelector(".menu");
        menu.appendChild(div);
        return true;
    }

    window.addEventListener("load", () => {
        const pure = GM_getResourceText("PURE");
        GM_addStyle(pure);
        createBtn();
    });

})()
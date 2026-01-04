// ==UserScript==
// @name         BOS打卡提醒
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  医为BOS打卡提醒
// @author       JustFig
// @match        https://xt.mediway.com.cn/ylxt/UIMainNew.aspx
// @match        https://xt.mediway.com.cn/ylxt/uimainnew.aspx
// @match        https://xt.imedway.com/ylxt/UIMainNew.aspx
// @match        https://xt.imedway.com/ylxt/uimainnew.aspx
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAyVBMVEVHcEwecroecroecroecroecroecroecroecroecroecroecroecroecroecroecroecroecroecroecroecroecroecbkecroecroecroecroecroecroecroecroecroecbgecrsecLcecroecroecroecroecroecroecroecroecroecroecbkecroecroecroecroecroecroecroecLYfZqMfaqsgYpshWo0hVYIhV4Yecroec7wedL8hWIkgW44gYZkebK8a02z+AAAAPHRSTlMAAQqamBSnBP0HwFH59YKh6U4wRhDcudjm7jVWJkvhiRk6Kg1jXMXRQGtyeY7LqiIes/KTrub/+PT2euQl05zGAAAG+UlEQVR42u1a23aiShAFAgKioIKIgiKKoqjxujJz5pCZJP//UUcQ+kKXncuct5n9kpVQuHt3VVdVlxH+4v+DqEvz2di2A0lXqQfzaGxXWE0lSf0NEnXuKCPf6PYURxIpkpXRLWGM94qjf5lCmi4u/axAa3ceK8Ry9UtGQEvCkSN+ScVe1jISg4WDn/rtjEZiOJ/nmK87GY3nt6aNt8XK6nB7nxUzZT9E+/b2cyNVBiuPMWj5+u9y/Pz2PXvOTMTykLHYfCbKFJYj055ef15/mHolZQKwLD6+Y3qYAUL+ecpJWovKKtRYq1b0URZxnAF4ennLSbJdUJrNEsDKnX7UIS4o5PXqkhzbauNNDWCJxY8JiTMGz63vv/LdytGPeFIG+w+R7AegkHK3KCktWMrXhRS7VWBSSVGaX5VygIX8en2uSLJGFcYpJMVU3xeyhoXkLqlw6vKkDGfvksyGAMm3Xy8vb0gIIWX9JSmqCQspXIKlGFU1OEJSgi8I0a5Cit3CaFZ53WgDLFuVLySEhby80CRZWgUqJCUbcUlGGkDydBXyWrgkaVZA+94t/7DrtxifwdAbAMfEzUlyl2gx592eSSSAHk8IpP1h9m/lkkmPe8IsJOYyv985NACOTiT8QC7ZClxYaLfHogBDtEEhgjj7N3dJjn6Pn/b6RPjBcJYAh5dHyg+UUxoSl8XEUj5Tq+SiwuxQAIdzbo+zq+yWsBQJEtK/JaLFM2aNeA1Wd8gt96IPcGhhWSyJBbSt2LgBldrIN0r4E7Q8BepQ+rzi4EPp46wynR6/eokxKIQb3V5URRVUiLEUvpDkgJ6PISmWxEv5a4ZkDVi1UiJuICltu4r+HfD0tK+nhA5gtSPD1T7xpKQaVL1E2iMhLISALkNSxpVQsBAfaCFDwGY5p7MnZOM61QGBfBbS6QBapV+Lv20GALXGLrQXM7joYrhMxfAAqyZXSkPAACOny6Y/SIov8ArxDAuBHh+BTA5cSXAmjIaQFNRTPEK1CmoGYo135sIMwKpaApRQFmAPcIbSRxWoigv57CZFXQIcawGE0uRJmUHFwr4dZfg9GPsLIGWPWFxASiGEXdxgwemazCGn+T3IrNeM/BbLuFzmN4DjR+YNor1YNBmhkjD16NOxDO13ByILa1DLk0RFnq4btaqxEYJjA2O76R6Ej2AUmw+PxHtTKv9E8cZqYISCSuJzQyT0mg7Mu3T81BH+4i/+JKij8VbOsR5NYQulV1rIqx6ZI2QA6wC8FR4HnbIUDJZWDOTosFlZZJPBZbPHE14IydGvr3FbS1itSz1Zm7t6d5iWJA9aBmJoCiRWQLk6nXX+cDTTQkwCg2SxJ6DJxYFvtRjpOyQtG2ddL4PxiFjSOxsS8EkyF5yBwaPg/T2Ts8ojwbMB6ZzdxTDCbT1s4PBJOkbpkDZBvPH9NRmRslTrH5ux76dEO2mLBMkwNXIsmgQJ022FhTilO8ArHRXHDUWvdShCDQ9BQ5Ug8Q5Vx4HuhN3bIezg8YSEhuh0rzJNarMbdXATfrykOibBPYePWqNb7ljgvlfBB48eajuIxKjyQzdHbzpVRFJJmY4MrPy2W1ui70AIBtR+iUvsNLajwiStpVvAq80SD26GB8IYMn15sPDx6rsNw2ZIYLT8Ujda85JMvSmtb3Gi4tJrnrvq+ySP48rHbeKygWEMUfiI4M20s5NXfJL2cYXSFj0xEpj4spx7d6BJI+CRaF5yLkOpi0exVBM5QJpvhn4LGs4YiATGMrq9DJP0ErSLSikZGkt4PiaBWQIOSdSvkwiH1ANYenyS7FxcFchfMWyP2K4SYrBmK5elkrlrMSoQY9WDGeX4BwGMLrI+ik7PP9OBdpqRaSWodhsZaZvcwx084wBvwpv6IHLai0lBazZ3lWvHiSVAynZkD3MmJh8snFWCPwQkCTRyYuA0kHCD+BSXvN8q3YVvxG6SJGMUfWg7XZAkoq6uYgqFV4TOYnLVFyyHVxQOQoPjJUzCfr9xpMPrNMb5Eam15ijTUzMudFgvgON7D216yrPH4dav0rjZpr/vvTDDPJQxtS1Bok0GBTytNrtTU+JoydeViqsj5lgWveimhSLyGOcFetNBf4jhw0gWkCq+0FL6/X6HDFCxkN8nDsbVYoJXMVT4JEeVHX7D3yirbP/INBIwOl0yFGCTVZWUJ/d2I+C3qRsVngpjtA1RwF8EgzBEbvk1JfJ/DUAdxBc+0kMGIVaLVH8vz3d1av6wPrH+mImkBaDFM9R7RatjhmlQ/28Xdbalp+CJPact9KjRpinCqXiLnLnCQtdVaJii2KE11HJ4shk5ImCxNi9trYBljhUd8Uss4FmOKkUb2Wvn6G/TnsRa6FK8sTrtAvJmNVeFL0AU/nD8B0NFKpIk6JwlAAAAAElFTkSuQmCC
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471573/BOS%E6%89%93%E5%8D%A1%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/471573/BOS%E6%89%93%E5%8D%A1%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function () {
        Date.prototype.mkformat = function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                S: this.getMilliseconds(), //millisecond
            };
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        };
        GM_registerMenuCommand("打开设置", showSetting, "s");
        var mkSettingType = GM_getValue("MK_Type");
        function showSetting() {
            if (document.querySelector("#bos-monkey-form-dialog") === null) {
                var container = document.createElement("dialog");
                container.id = "bos-monkey-form-dialog";
                container.innerHTML = `<form>
                                            <div class="bos-monkey-form-element">
                                                <label>判断方式</label>
                                                <select name="bos-monkey-form-type" id="bos-monkey-form-type" style="height:50px;">
                                                    <option value="api" ${mkSettingType=='api'?'selected':''}>API</option>
                                                    <option value="element" ${mkSettingType=='api'?'':'selected'}>界面元素</option>
                                                </select>
                                            </div>
                                            <button type="button" id="mk-submit-button">确定</button>
                                            <button type="button" id="mk-close-button">关闭</button>
                                        </form>`;
                try {
                    document.body.appendChild(container);
                } catch (e) {
                    console.log(e);
                }
                GM_addStyle("#bos-monkey-form-dialog {width: 500px;border: 1px solid #555555;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);}");
                GM_addStyle("#bos-monkey-form-dialog::backdrop {background: rgba(0,0,0,0.5);}");
                GM_addStyle(".bos-monkey-form-element {margin: 0 0 30px 0;}");
                GM_addStyle(".bos-monkey-form-element label {display: block;width: 100%;margin: 0 0 5px 0;}");
                GM_addStyle(".bos-monkey-form-element select {display: block;width: 100%;font-size: inherit;font-family: inherit;padding: 10px;border: 1px solid #cccccc;background-color: white;outline: none;box-sizing: border-box;}");
                GM_addStyle("#mk-submit-button {background-color: #336699;color: white;cursor: pointer;padding: 10px 15px;font-family: inherit;font-size: inherit;border: none;font-weight: 700;display: inline-block;vertical-align: middle;margin: 0 30px 0 0;}");
                GM_addStyle("#mk-close-button {background-color: white;cursor: pointer;font-family: inherit;font-size: inherit;border: none;display: inline-block;vertical-align: middle;}");
                document.querySelector("#mk-submit-button").addEventListener("click", function () {
                    saveMkSetting();
                });
                document.querySelector("#mk-close-button").addEventListener("click", function () {
                    closeMkSetting();
                });
            }
            document.querySelector("#bos-monkey-form-dialog").showModal();
        }
        function saveMkSetting() {
            var mkType = $("#bos-monkey-form-type option:selected").val();
            if (mkType == "api" || mkType == "element") {
                GM_setValue("MK_Type", mkType);
            }
            closeMkSetting();
        }
        function closeMkSetting() {
            document.querySelector("#bos-monkey-form-dialog").close();
        }
        if (mkSettingType == "api") {
            // 方式一：API
            var today = new Date();
            $.post("/ylxt/HR/UILeaderOverTMApply.ashx?OperationType=wxkq&idList=" + $("#userid")[0].value + ",&datestr=" + today.mkformat("yyyy-MM-dd"), "", function (data) {
                data = JSON.parse(data);
                if (data instanceof Object && data.IsSuccess) {
                    if (data.Param == "00:00" || !data.Param) {
                        alert("今天没有有效打卡记录");
                        $(".dhcc-oa-ad").next().children().css("color", "red").text("今日未打卡").css("font-size", "20px").css("opacity", "1");
                    } else {
                        //alert('今天存在有效打卡记录：'+data.Param)
                        //$('.dhcc-oa-ad').next().children().css('color','red').text('今天存在有效打卡记录：'+data.Param).css('font-size','20px').css('opacity','1')
                    }
                } else {
                    console.log(data);
                    alert("加载失败");
                }
            });
        } else {
            // 方式二：界面元素
            function bosDayCheck(count) {
                if (count > 10) {
                    alert("超过最大次数，加载失败");
                    return;
                }
                var container = $(".fc-view-month .fc-event-container");
                var contentDiv = $(".fc-today .fc-day-content div");
                if (container.length > 0 && contentDiv.length > 0) {
                    var containerBound = container[0].getBoundingClientRect();
                    var contentDivBound = contentDiv[0].getBoundingClientRect();
                    var eventLeft = contentDivBound.left - containerBound.left;
                    var eventTop = contentDivBound.top - containerBound.top + 1;
                    var target = $(".fc-view-month .fc-event-container").children("div[style*='left: " + eventLeft + "px'][style*='top: " + eventTop + "px']");
                    if (target.length <= 0 || !target[0].innerText) {
                        alert("今天没有有效打卡记录");
                        $(".dhcc-oa-ad").next().children().css("color", "red").text("今日未打卡").css("font-size", "20px").css("opacity", "1");
                    } else {
                        //alert("今天存在有效打卡记录：" + target[0].innerText);
                        //$(".dhcc-oa-ad").next().children().css("color", "red").text("今天存在有效打卡记录：" + target[0].innerText).css("font-size", "20px").css("opacity", "1");
                    }
                } else {
                    setTimeout(function () {
                        bosDayCheck(count + 1);
                    }, 500);
                }
            }
            setTimeout(function () {
                bosDayCheck(0);
            }, 3000);
        }
    });
})();
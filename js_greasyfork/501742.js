// ==UserScript==
// @name         bset-supervise
// @namespace    dagu
// @version      2025-08-26-1
// @description  cacl timer
// @author       dagu
// @match        https://jiangxi.ggjtfw.com:8800/web/bussRecPeriodList/toPeriod*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ggjtfw.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501742/bset-supervise.user.js
// @updateURL https://update.greasyfork.org/scripts/501742/bset-supervise.meta.js
// ==/UserScript==

(async function() {
    'use strict';


    var code = async function cacl(){
        var stageMap = {
            '第一部分': 1,
            '第二部分': 2,
            '第三部分': 3,
            '第四部分': 4,
        }

        var typeTimer = {
            '模拟器Ⅱ型教学' : 0,
            '实操': 0,
            '远程教学' : 0
        }
        var typeMileage = {
            '模拟器Ⅱ型教学' : 0,
            '实操': 0
        }

        var stage = 0;

        function caclTimer(stage) {
            switch(stage){
                case 1:
                case 4:
                    return '总学时：' + typeTimer['远程教学'];
                case 2:
                    return '总学时：' + typeTimer['实操'];
                case 3:
                    var simTime = typeTimer['模拟器Ⅱ型教学']
                    var trueSimTime = simTime > 90 ? 90 : simTime
                    return '总有效学时：' + (trueSimTime + typeTimer['实操']) + '<br>模拟器学时：' + simTime + ', 有效：' + trueSimTime + '<br>实操学时：' + typeTimer['实操']
            }
        }

        function caclMileage(stage) {
            switch(stage){
                case 1:
                case 4:
                    return '总里程：0';
                case 2:
                    return '总里程：0';
                case 3:
                    var simTime = typeTimer['模拟器Ⅱ型教学']
                    var trueSimTime = simTime > 90 ? 90 : simTime;

                    // 模拟器里程比例
                    var trueMaleage = Math.floor(trueSimTime / 22.5) * 5;
                    trueMaleage = trueMaleage.toFixed(2)
                    var allMileage = parseFloat(trueMaleage) + parseFloat(typeMileage['实操'].toFixed(2))
                    return '总有效里程：' + allMileage + '<br>模拟器里程：' + typeMileage['模拟器Ⅱ型教学'].toFixed(2) + ', 有效：' + trueMaleage + '<br>实操里程：' + parseFloat(typeMileage['实操'].toFixed(2))
            }
            var simTime1 = typeMileage['模拟器Ⅱ型教学']
            var trueSimTime1 = simTime1 > 20 ? 20 : simTime
            return trueSimTime1 + typeMileage['实操']
        }

        var list = await document.querySelectorAll('.dataTables_scrollBody > table > tbody > tr')

        list.forEach(e => {
            console.log(e.children[14].innerText, parseInt(e.children[13].outerText.replaceAll('分钟', '').replaceAll('未终审', '0')))

            stage = stageMap[e.children[6].innerText]

            typeTimer[e.children[17].innerText] += parseInt(e.children[13].outerText.replaceAll('分钟', '').replaceAll('未终审', '0'))
            typeMileage[e.children[17].innerText] += parseFloat(e.children[14].outerText)
        })

        var msg = caclTimer(stage) + "<br><br>" + caclMileage(stage)

        layer.alert(msg)
        console.log(typeTimer, typeMileage)
    }

    var script = document.createElement('script');
    script.textContent = code.toString();
    // 将script元素添加到DOM中
    document.body.appendChild(script);
    queryPageCount(50)
    function addCaclButton(){
        var div = document.getElementsByClassName("tablebtn")[0]
        console.log(div)
        div.innerHTML += '<a id="cacl" style="" class="layui-btn" onclick="cacl()">计算学时</a>';
    }

    addCaclButton()


    async function modifyRows(){
        var list = await document.querySelectorAll('.dataTables_scrollBody > table > tbody > tr')
        list.forEach(e => {
            // 高亮显示照片问题学时
            var errorTypeList = e.children[14].innerText.split(",")
            if (errorTypeList.includes('8') || errorTypeList.includes('14')) {
                e.style.backgroundColor = 'lightgray';
            }
        })
    }

    // 高亮显示照片问题行
    const targetDiv = document.querySelector('#list'); // 假设要监听的div有id为myDiv
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                modifyRows()
            }
        }
    });
    observer.observe(targetDiv, { childList: true });
})();
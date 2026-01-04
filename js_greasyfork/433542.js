// ==UserScript==
// @name         飞常准航线图下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  飞常准over
// @author       You
// @match        https://map.variflight.com/
// @icon         https://www.google.com/s2/favicons?domain=variflight.com
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433542/%E9%A3%9E%E5%B8%B8%E5%87%86%E8%88%AA%E7%BA%BF%E5%9B%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/433542/%E9%A3%9E%E5%B8%B8%E5%87%86%E8%88%AA%E7%BA%BF%E5%9B%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 导出文档
     * @constructor
     */
    function htlmExportDocument(data, name) {
        data = "\ufeff" + data;
        let blob = new Blob([data], {type: 'text/csv,charset=UTF-8'});
        let uri = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = uri;
        downloadLink.download = (name + ".csv") || "temp.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }


    /**
     * 整理文档
     */
    function htlmHandleDocument(resultData) {
        console.log("整理文档");
        if (resultData.code !== 200 || resultData.msg !== "success") {
            alert("导出失败,请重新点击导出文件");
            return
        }

        let transferFlightLine = [];
        let directFlightLine = [];
        //
        let firstLoad = true;
        for (let data of resultData.data) {
            let dataInfo = [];

            if (data.length === 7) {
                if(firstLoad){
                    // 中转航线
                    transferFlightLine.push(
                        ["出发", "抵达", "中转地", "航班数量", "运营航司个数", "运营航司", "\n"]
                    );
                    // 直达航线
                    directFlightLine.push(
                        ["出发", "抵达", "中转地", "航班数量", "运营航司个数", "运营航司", "\n"]
                    );
                    firstLoad = false
                }

                // eg: ['PEK', 'CAN', [], [1, 0, 0], [1662, 2], 'CA,HU', Array(34)]
                // 出发
                let depAirport = data[0];
                // 抵达
                let arrAirport = data[1];
                // 中转地
                let transferAirports = data[2].join("-");
                // 航班数量
                let flightNumbers = data[4][0];
                // 运营航司个数
                let operationalAviationCount = data[4][1];
                // 运营航司
                let operationalAviation = data[5].replace(new RegExp(",", "g"), "/");
                //
                dataInfo = [
                    depAirport, arrAirport, transferAirports, flightNumbers,
                    operationalAviationCount, operationalAviation, "\n"
                ];
                if(transferAirports){
                    transferFlightLine.push(dataInfo);
                }else{
                    directFlightLine.push(dataInfo);
                }
            }else if(data.length === 5) {
                // eg: ['PEK', 'HFE', Array(0), Array(3), Array(18)]
                if(firstLoad){
                    // 中转航线
                    transferFlightLine.push(
                        ["出发", "抵达", "中转地", "\n"]
                    );
                    // 直达航线
                    directFlightLine.push(
                        ["出发", "抵达", "中转地", "\n"]
                    );
                    firstLoad = false
                }
                // eg: ['PEK', 'CAN', [], [1, 0, 0], [1662, 2], 'CA,HU', Array(34)]
                // 出发
                let depAirport = data[0];
                // 抵达
                let arrAirport = data[1];
                // 中转地
                let transferAirports = data[2].join("-");
                //
                dataInfo = [
                    depAirport, arrAirport, transferAirports,  "\n"
                ];
                if(transferAirports){
                    transferFlightLine.push(dataInfo);
                }else{
                    directFlightLine.push(dataInfo);
                }
            }
        }

        debugger;
        if (directFlightLine.length > 1) {
            htlmExportDocument(directFlightLine.join(""), "直达航线");
        }
        if (transferFlightLine.length > 1) {
            htlmExportDocument(transferFlightLine.join(""), "中转(经停)航线");
        }
    }


    /**
     * 发送请求
     */
    function htlmSendUrl() {
        $.ajax({
            type: "POST",
            url: "https://adsbapi.variflight.com/adsb/map/drx?" + window.htlmFlightUrl,
            dataType: "json",
            headers:{
                "Authorization":'PHPSESSID='+ getcookie('PHPSESSID') || sessionStorage.getItem('PHPSESSID')
            },
            data: {},
            success: function (d) {
                console.log("获取到数据", d);
                htlmHandleDocument(d);
            },
            error: function () {
                alert("转换失败,请联系技术人员");
            },
            complete: function () {
            }
        })
    }


    /**
     * hook ajax 方法, 拦截响应值
     */
    function hookHtlmFun(func) {
        console.log("hook dataStr_n function");
        const origin = func;
        return function (a, b, c) {
            let result = origin(a, b, c);
            if (b.indexOf("drx") !== -1) {
                window.htlmFlightUrl = result.replace(new RegExp(":", "g"), "=").replace(new RegExp(",", "g"), "&");
            }
            return result
        }
    }

    dataStr_n = hookHtlmFun(dataStr_n);

    /**
     * 初始化加载 按钮
     */
    function htlmLoadStart() {
        console.log('开始创建按钮~~');
        // 创建一个input对象（提示框按钮）
        var button = document.createElement("button");
        button.id = "htlm_id001";
        button.textContent = "导出文件";
        let cssAttrMap = {
            "width": "100px",
            "height": "40px",
            "position": "absolute",
            "top": "100px",
            "right": "50px",
            // "color": "#444",
            "z-index": "999",
            // "background-color": "#f00",
            "font-size": "18px",
            "border": "1px solid #f00000",
        };
        let cssStrLis = [];
        for (let cssAttr in cssAttrMap) {
            cssStrLis.push(cssAttr + ":" + cssAttrMap[cssAttr])
        }

        button.setAttribute("style", cssStrLis.join(";"));
        //绑定按键点击功能
        button.onclick = function () {
            console.log('点击了按键');
            //为所欲为 功能实现处
            htlmSendUrl();
            return;
        };
        document.getElementsByTagName("body")[0].appendChild(button);
        console.log('按钮创建结束~~');
    }

    htlmLoadStart();
})();

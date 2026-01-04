// ==UserScript==
// @name         测算一类基金的平均增长幅度
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @author       You
// @match        http://fund.eastmoney.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/421432/%E6%B5%8B%E7%AE%97%E4%B8%80%E7%B1%BB%E5%9F%BA%E9%87%91%E7%9A%84%E5%B9%B3%E5%9D%87%E5%A2%9E%E9%95%BF%E5%B9%85%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/421432/%E6%B5%8B%E7%AE%97%E4%B8%80%E7%B1%BB%E5%9F%BA%E9%87%91%E7%9A%84%E5%B9%B3%E5%9D%87%E5%A2%9E%E9%95%BF%E5%B9%85%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery;
    $('head').append(`<style>
::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 3px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}
::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: #012d3e;
    background-image: -webkit-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
    );
}
::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
}</style>`)
    var dom = $(`<div style="position: fixed;height: 100vh;width: 500px;top: 0;
            transition: left 1s ease;left: -450px;z-index: 10000000000;">
        <div style="float:left;width: 450px;height: 100%;background: aliceblue;">
            <div>
                <input placeholder="搜索内容" value="医疗" style="border: none;
                    line-height: 20px;width: 320px;height: 20px;" tar="search-input">
                <button style="width: 50px;line-height: 20px;
                    margin-left: 5px;" tar="search-btn">搜索</button>
                <button style="width: 50px;line-height: 20px;
                    margin-left: 5px;" tar="calc-btn">计算</button>
            </div>
            <div style="line-height: 20px;font-size: initial;height: 40px;padding: 3px 6px;" tar="result"></div>
            <div tar="content" style="height: calc(100vh - 90px);overflow-y: scroll;">
                <div>
                    <input type="checkbox" style="line-height: 30px;">
                    <div code="003095" style="display: inline-block;font-size: large;color: red;">+12.111</div>
                    <div style="line-height: 30px;height: 30px;font-size: large;display: inline-block;">01696&nbsp;&nbsp;复锐医疗科技</div>
                </div>
            </div>
        </div>
        <div style="float:left;width: 50px;height: 50px;margin-top: calc(50vh - 50px);cursor: pointer;
            line-height: 46px;font-size: 36px;text-align: center;background: aliceblue;" tar="toggle">开</div>
    </div>`);
    var ifr = $(`<iframe></iframe>`);
    ifr.css({ display: 'none' });
    $('body').append(dom);
    $('body').append(ifr);
    var inp = dom.find('[tar="search-input"]');
    var content = dom.find('[tar="content"]');
    var result = dom.find('[tar="result"]');
    let closePanel = true;
    let toggle = dom.find('[tar="toggle"]');
    toggle.on('click',function () {
        closePanel = !closePanel;
        if (closePanel) {
            dom.css({left: '-450px'});
            toggle.text("开");
        } else {
            dom.css({left: '0'});
            toggle.text("关");
        }
    });
    content.html('');
    var currentKey = "";
    dom.find('[tar="search-btn"]').on('click',function () {
        let html = "";
        initSearchPage.JsLoader(`http://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx`,`m=1&key=${inp.val()}&pageindex=0&pagesize=85&_=1612791079815`,res => {
            res.Datas.forEach(ds => {
                html += `<div>
                    <input type="checkbox" style="line-height: 30px;" value="${ds.CODE}" checked>
                    <div code="${ds.CODE}" style="display: inline-block;font-size: large;color: red;">未知</div>
                    <div style="line-height: 30px;height: 30px;font-size: large;display: inline-block;">${ds.CODE}&nbsp;&nbsp;${ds.NAME}</div>
                </div>`;
            });
            result.html(`未计算，共有${res.Datas.length}个搜索结果`);
            content.html(html);
        });
    });
    dom.find('[tar="calc-btn"]').on("click",function () {
        let codes = [];
        content.find('input[type="checkbox"]').each((ind,ele) => {
            if (ele.checked) {
                codes.push(ele.value);
            }
        });
        result.html(`计算中，请稍等，共选中${codes.length}个进行计算<br/>当前进度 0/${codes.length}`);
        getAvgGZ(codes,obj => {
            result.html(`平均收益为${obj.avg.toFixed(3)}，有效基金数${obj.total}<br/>最高收益为${obj.max.toFixed(3)}，最低收益为${obj.min.toFixed(3)}`);
        },index => {
            result.html(`计算中，请稍等，共选中${codes.length}个进行计算<br/>当前进度 ${index}/${codes.length}`);
        });
    });
    function oxFetch(url) {
        return new Promise(s => {
            GM_xmlhttpRequest({
                method: "get",
                url,
                onload: function(res){
                    s(res.responseText);
                    // code
                }
            });
        });
    }
    function getAvgGZ(codes,callback,step) {
        var total = 0;
        var index = -1;
        let max = -100;
        let min = 100;
        var GZ = 0;
        function getGZ(code,cb) {
            if (code) {
                oxFetch(`http://fundgz.1234567.com.cn/js/${code}.js?rt=${new Date().getTime()}`)
                    .then(ret => {
                        let codeDom = $(`[code="${code}"]`);
                        if (ret.startsWith('jsonpgz({"fundcode":')) {
                            total++;
                            let cval = + JSON.parse(ret.substring(8,ret.length - 2)).gszzl;
                            max = max > cval ? max : cval;
                            min = min > cval ? cval : min;
                            GZ += cval;
                            codeDom.text(cval.toFixed(2));
                            if (cval >= 0) {
                                codeDom.css({color: 'red'});
                            } else {
                                codeDom.css({color: 'green'});
                            }
                        } else {
                            dom.find(`input[value="${code}"]`)[0].checked = false;
                            codeDom.text("无法获取");
                            codeDom.css({color: 'gray'});
                        }
                        step(index);
                        cb();
                    });
            } else {
                cb();
            }
        }
        var cb = function() {
            index++;
            if (codes.length > index) {
                getGZ(codes[index],cb);
            } else {
                callback({
                    total,
                    GZ,max,min,
                    avg: GZ / total
                });
            }
        }
        cb();
    }
    // Your code here...
})();
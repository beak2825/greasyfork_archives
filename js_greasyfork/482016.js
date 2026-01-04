// ==UserScript==
// @name         浙江中医药大学学评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  针对浙江中医药大学学教一体华的学评教的插件，可以省去重复的操作。本插件主要是简化评价操作，对于特殊的评价仍然需要手动评价，也不麻烦。
// @author       Lock
// @match        http://jwmk.zcmu.edu.cn/jwglxt/xspjgl/kcgcpj_cxKcgcpjxxIndex.html*
// @grant        none
// @require      https://cdn.staticfile.org/layui/2.9.0/layui.js
// @resource css https://cdn.staticfile.org/layui/2.9.0/css/layui.min.css
// @downloadURL https://update.greasyfork.org/scripts/482016/%E6%B5%99%E6%B1%9F%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E5%AD%A6%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482016/%E6%B5%99%E6%B1%9F%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E5%AD%A6%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
// 是否发送过请求
var isSended = false;
// 发送的数据
var sendData = {};
// 现在发送的请求
var nowRequest = {};
// 评价是否完成
var isFinished = false;
var urlParams = '';

(function () {
    includeUI();
    // 获取Url参数,参数名为gnmkdm
    var url = window.location.href;
    urlParams = url.split('?')[1].split('&')[0].split('=')[1];
    console.log(urlParams);
    // 获取评价列表
    var commentList = getCommentList();
    console.log(commentList);
    createUI(commentList);
})();

// 引用UI
function includeUI() {

    var link = document.createElement('link');
    link.href = 'https://cdn.staticfile.org/layui/2.9.0/css/layui.min.css';
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}
// 在页面底部创建一个UI
function createUI(lis) {
    layui.use(function () {
        var util = layui.util;
        var layer = layui.layer;

        // 自定义固定条
        util.fixbar({
            bars: [{
                type: 'manu',
                content: '自动',
                style: 'font-size: 21px;'
            }],
            // bar1: true,
            // bar2: true,
            // default: false, // 是否显示默认的 bar 列表 --  v2.8.0 新增
            // bgcolor: '#393D52', // bar 的默认背景色
            // css: {right: 100, bottom: 100},
            // target: '#target-test', // 插入 fixbar 节点的目标元素选择器
            // duration: 300, // top bar 等动画时长（毫秒）
            on: { // 任意事件 --  v2.8.0 新增
                mouseenter: function (type) {
                    layer.tips(type, this, {
                        tips: 4,
                        fixed: true
                    });
                },
                mouseleave: function (type) {
                    layer.closeAll('tips');
                }
            },
            // 点击事件
            click: function (type) {
                if (type == "manu") {
                    if (lis.length == 0) {
                        layer.msg("没有需要评价的课程！", { time: 2000, btn: ["知道了"] });
                        return;
                    }
                    if (!isSended) {
                        layer.msg("请先自行评价一个", { time: 2000, btn: ["知道了"] });
                        return;
                    }
                    // 好评判断
                    function confirmNext(index) {
                        if (index < lis.length) {
                            var kcmc = lis[index].kcmc; // 注意这里 lis 应该是一个数组，所以应该使用 lis[index] 来访问元素

                            layer.confirm("点击确定提交课程为：" + kcmc + "，点击取消跳过", { btn: ["确定", "取消"] }, function () {
                                sendSingleData(lis[index]);
                                console.log("提交完成");
                                confirmNext(index + 1); // 递归调用，处理下一个项目
                            }, function () {
                                console.log("取消");
                                confirmNext(index + 1); // 即使取消也要处理下一个项目
                            });
                        } else {
                            layer.msg("已完成所有评价", { time: 2000, btn: ["知道了"] });
                        }
                    }

                    layer.confirm("你确定要进行自动好评吗？将会提交对每一个老师的评价，如有特殊操作请自行评价。", {
                        btn: ["确定", "取消"]
                    }, function () {
                        confirmNext(0); // 从第一个项目开始
                    });
                };



            }
        });


    });
}

// 获取当前页面的待评价的列表
function getCommentList() {
    var list = [];
    var item = document.getElementById("item1mobile");
    // 得到item 下面所有类名为mui-table-view-cell的li
    var listDom = item.getElementsByClassName("mui-table-view");
    // 得到所有的li
    var liDom = listDom[0].getElementsByTagName("li");
    // 循环li
    for (var i = 0; i < liDom.length; i++) {
        var jgh_id = liDom[i].getElementsByClassName("hidden_jgh_id")[0].value;
        var jxb_id = liDom[i].getElementsByClassName("hidden_jxb_id")[0].value;
        var pjmbmcb_id = liDom[i].getElementsByClassName("hidden_pjmbmcb_id")[0].value;
        var gcpjszlcb_id = liDom[i].getElementsByClassName("hidden_gcpjszlcb_id")[0].value;
        var kch_id = liDom[i].getElementsByClassName("hidden_kch_id")[0].value;
        // 课程名
        var kcmc = liDom[i].getElementsByClassName("subject")[0].innerText + liDom[i].getElementsByClassName("teacher")[0].innerText;
        var py = ""
        var res = {
            "kcmc": kcmc,
            "jgh_id": jgh_id,
            "jxb_id": jxb_id,
            "pjmbmcb_id": pjmbmcb_id,
            "gcpjszlcb_id": gcpjszlcb_id,
            "kch_id": kch_id,
            "py": py,
            "isFinished": false,

        }

        list.push(res)
    }

    return list;
}


//监听ajax请求
(function () {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

(function () {
    function ajaxEventTrigger(event) {
        var ajaxEvent = new CustomEvent(event, { detail: this });
        window.dispatchEvent(ajaxEvent);
    }

    var oldXHR = window.XMLHttpRequest;

    function newXHR() {
        var realXHR = new oldXHR();
        var oldSend = realXHR.send;
        // ... (其他事件监听器)
        realXHR.send = function () {
            if (arguments[0]) {
                // 查看发送的链接

                sendData = arguments[0];
                // 转换成Dict
                var dict = {};
                var list = decodeURIComponent(sendData).split('&');
                for (var i = 0; i < list.length; i++) {
                    var kv = list[i].split('=');
                    dict[kv[0]] = kv[1];
                }
                nowRequest = dict;
            }
            return oldSend.apply(this, arguments);
        }
        realXHR.addEventListener('readystatechange', function () {
            if(isSended) return;
            ajaxEventTrigger.call(this, 'ajaxReadyStateChange');
            if (this.readyState === 4 && this.status === 200) {
                // 检查URL是否包含特定的字符串
                var url = this.responseURL;
                if (url.includes('http://jwmk.zcmu.edu.cn/jwglxt/xspjgl/kcgcpj_tjKcgcpjxx.html?')) {
                    // 获取URL参数
                    isSended = true;
                    sendData = nowRequest;
                    // 保存sendData数据和isSended状态保存数据到LocalStorage
                    localStorage.setItem('sendData', JSON.stringify(sendData));
                    console.log(sendData);
                }
            }
        }, false);

        return realXHR;
    }

    window.XMLHttpRequest = newXHR;
})();

function getLocalStorageData() {

    // 获取LocalStorage中的数据

    var data = localStorage.getItem('sendData');


    if (data) {
        sendData = JSON.parse(decodeURIComponent(data));
        // jgh_id=2017A526&jxb_id=FD59EF796BDCAC9FE0539C63A8C0F3A4&pjmbmcb_id=075598BFB60E9845E0639C63A8C0530F&gcpjszlcb_id=0757B0E465EA1FB6E0639C63A8C09BDB&lx=0&py=&gcpjxspfmxList[0].pjzbxm_id=075598BFB6119845E0639C63A8C0530F&gcpjxspfmxList[0].pfdjdmb_id=E9C720E1846E1EFCE0539C63A8C0A134&gcpjxspfmxList[0].zgpj=~zgbj~&gcpjxspfmxList[0].pjf=85&gcpjxspfmxList[0].bfzpf=85&gcpjxspfmxList[0].qzbfzpf=85&gcpjxspfmxList[0].zbbc=~zbbc~&gcpjxspfmxList[1].pjzbxm_id=075598BFB6129845E0639C63A8C0530F&gcpjxspfmxList[1].pfdjdmb_id=E9C8201C2497E741E0539C63A8C0CA96&gcpjxspfmxList[1].zgpj=~zgbj~&gcpjxspfmxList[1].pjf=5&gcpjxspfmxList[1].bfzpf=5&gcpjxspfmxList[1].qzbfzpf=5&gcpjxspfmxList[1].zbbc=~zbbc~&gcpjxspfmxList[2].pjzbxm_id=075598BFB6139845E0639C63A8C0530F&gcpjxspfmxList[2].pfdjdmb_id=E9C8201C2497E741E0539C63A8C0CA96&gcpjxspfmxList[2].zgpj=~zgbj~&gcpjxspfmxList[2].pjf=5&gcpjxspfmxList[2].bfzpf=5&gcpjxspfmxList[2].qzbfzpf=5&gcpjxspfmxList[2].zbbc=~zbbc~&gcpjxspfmxList[3].pjzbxm_id=075598BFB6149845E0639C63A8C0530F&gcpjxspfmxList[3].pfdjdmb_id=E9C8201C2497E741E0539C63A8C0CA96&gcpjxspfmxList[3].zgpj=~zgbj~&gcpjxspfmxList[3].pjf=5&gcpjxspfmxList[3].bfzpf=5&gcpjxspfmxList[3].qzbfzpf=5&gcpjxspfmxList[3].zbbc=~zbbc~&gcpjxspfmxList[4].pjzbxm_id=075598BFB6159845E0639C63A8C0530F&gcpjxspfmxList[4].pfdjdmb_id=E9C8201C2497E741E0539C63A8C0CA96&gcpjxspfmxList[4].zgpj=~zgbj~&gcpjxspfmxList[4].pjf=5&gcpjxspfmxList[4].bfzpf=5&gcpjxspfmxList[4].qzbfzpf=5&gcpjxspfmxList[4].zbbc=~zbbc~&gcpjxspfmxList[5].pjzbxm_id=075598BFB6169845E0639C63A8C0530F&gcpjxspfmxList[5].pfdjdmb_id=E9C8201C2497E741E0539C63A8C0CA96&gcpjxspfmxList[5].zgpj=~zgbj~&gcpjxspfmxList[5].pjf=5&gcpjxspfmxList[5].bfzpf=5&gcpjxspfmxList[5].qzbfzpf=5&gcpjxspfmxList[5].zbbc=~zbbc~&gcpjxspfmxList[6].pjzbxm_id=075598BFB6179845E0639C63A8C0530F&gcpjxspfmxList[6].pfdjdmb_id=E9C823F48C84F4BEE0539C63A8C00E60&gcpjxspfmxList[6].zgpj=~zgbj~&gcpjxspfmxList[6].pjf=10&gcpjxspfmxList[6].bfzpf=10&gcpjxspfmxList[6].qzbfzpf=10&gcpjxspfmxList[6].zbbc=~zbbc~&bfzpf=100&kch_id=FBW01069
        // 将其转换成dict
        // var dict = {};
        // var list = decodeURIComponent(sendData).split('&');

        // for (var i = 0; i < list.length; i++) {
        //     var kv = list[i].split('=');
        //     dict[kv[0]] = kv[1];
        // }
        // sendData = dict;
        console.log(sendData);
        isSended = true;


    }
}
// 页面刷新或者加载时加载数据
window.onload = getLocalStorageData;
// 发送数据
function sendPostData(lis, functionName) {
    getLocalStorageData();
    if (!isSended) {
        return;
    }
    var layer = layui.layer;
    // 每隔1秒发送一个请求
    var i = 0;
    var timer = setInterval(function () {
        if (i >= lis.length) {
            clearInterval(timer);
            return;
        }
        var s = lis[i];
        sendData["jgh_id"] = s["jgh_id"];
        sendData["jxb_id"] = s["jxb_id"];
        sendData["pjmbmcb_id"] = s["pjmbmcb_id"];
        sendData["gcpjszlcb_id"] = s["gcpjszlcb_id"];
        sendData["kch_id"] = s["kch_id"];
        sendData["py"] = s["py"];
        console.log();
        $.ajax({
            url: 'http://jwmk.zcmu.edu.cn/jwglxt/xspjgl/kcgcpj_tjKcgcpjxx.html?gnmkdm='+urlParams,
            type: 'POST',
            data: sendData,
            success: function (data) {
                // 每次完成一个在右下角提示
                layer.msg("已提交"+(i+1)+"/"+lis.length,{time:2000,btn:["知道了"]});
            },});
        //测试时直接提示

        i++;
        functionName(s["kcmc"]);

    }, 1000);

    var isFinite = true;




}

// 提交单条数据的函数
function sendSingleData(s) {
    getLocalStorageData();
    if (!isSended) {
        return;
    }
    var isok = true;
    console.log(s);
    sendData["jgh_id"] = s["jgh_id"];
    sendData["jxb_id"] = s["jxb_id"];
    sendData["pjmbmcb_id"] = s["pjmbmcb_id"];
    sendData["gcpjszlcb_id"] = s["gcpjszlcb_id"];
    sendData["kch_id"] = s["kch_id"];
    sendData["py"] = s["py"];
    console.log(sendData);
    $.ajax({
        url: 'http://jwmk.zcmu.edu.cn/jwglxt/xspjgl/kcgcpj_tjKcgcpjxx.html?gnmkdm='+urlParams,
        type: 'POST',
        data: sendData,
        success: function (data) {
            // 每次完成一个在右下角提示
            isok = true;

        },});
    s.isFinished = true;
    return isok;
    
}
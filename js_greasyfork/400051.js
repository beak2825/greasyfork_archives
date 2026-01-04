// ==UserScript==
// @name         水质自动综合监管平台下载辅助
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Asakun
// @match       http://106.37.208.243:8068/GJZ/Main.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400051/%E6%B0%B4%E8%B4%A8%E8%87%AA%E5%8A%A8%E7%BB%BC%E5%90%88%E7%9B%91%E7%AE%A1%E5%B9%B3%E5%8F%B0%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/400051/%E6%B0%B4%E8%B4%A8%E8%87%AA%E5%8A%A8%E7%BB%BC%E5%90%88%E7%9B%91%E7%AE%A1%E5%B9%B3%E5%8F%B0%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    console.log('水质自动综合监管平台下载辅助启动！');
    window.setTimeout("addButton()",5000);
    // Your code here...

})();

window.addButton = function(){
    var menuBar = $("#J_common_header_menu");
    menuBar.width(1200);
    let now = new Date();
    now.setDate(now.getDate()-1);
    now.setHours(0);
    let startTime = window.dateFtt("yyyy-MM-dd HH",now);
    now.setHours(23);
    let endTime = window.dateFtt("yyyy-MM-dd HH",now);
    menuBar.append('<li class="top-menu-item" data-index="7" has-dropdown="true" menu-type="solution" data-spm-click="gostr=/aliyun;locaid=">\n' +
        '        <span class="menu-hd" onclick="downloadAll()" style="color: rgb(255, 255, 255);">\n' +
        '        <i style="background-image:url(\'/GJZ/Images/Menu/icoM1.png\');" class="top-menu-arrows-down">&nbsp;</i>一键下载重庆断面数据</span></li>');
    menuBar.append('<div id="divFind" class="containerbox" style="margin-left: 4px;height: -webkit-fill-available;padding-top: 13px;background-color: transparent;">\n' +
        '            <div class="grid_4 lbl">\n' +
        '                开始时间:\n' +
        '            </div>\n' +
        '            <div class="grid_9 val">\n' +
        '                <input type="text" id="startTime" readonly="readonly" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd HH时\'});" class="z-txt  easyui-validatebox grid_8 val Wdate validatebox-text" value="'+startTime+'时">\n' +
        '            </div>\n' +
        '            <div class="grid_4 lbl">\n' +
        '                结束时间:\n' +
        '            </div>\n' +
        '            <div class="grid_9 val">\n' +
        '                <input type="text" id="endTime" readonly="readonly" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd HH时\'});" class="z-txt  easyui-validatebox grid_8 val Wdate validatebox-text" value="'+endTime+'时">\n' +
        '            </div>')
};

window.siteMap = [{"mn":"A500104_0001","name":"丰收坝","urlCode":"%u4E30%u6536%u575D"},{"mn":"A500000_0002","name":"寸滩","urlCode":"%u5BF8%u6EE9"},{"mn":"A500107_0001","name":"和尚山","urlCode":"%u548C%u5C1A%u5C71"},{"mn":"A500000_0001","name":"北温泉","urlCode":"%u5317%u6E29%u6CC9"},{"mn":"A500112_0001","name":"御临镇","urlCode":"%u5FA1%u4E34%u9547"},{"mn":"A500115_0003","name":"运输桥","urlCode":"%u8FD0%u8F93%u6865"},{"mn":"A500116_0001","name":"江津大桥","urlCode":"%u6C5F%u6D25%u5927%u6865"},{"mn":"A500116_0003","name":"朱杨溪","urlCode":"%u6731%u6768%u6EAA"},{"mn":"A500117_0002","name":"官渡","urlCode":"%u5B98%u6E21"},{"mn":"A500117_0003","name":"临渡","urlCode":"%u4E34%u6E21"},{"mn":"A500117_0001","name":"太和","urlCode":"%u592A%u548C"},{"mn":"A500110_0001","name":"寨溪大桥","urlCode":"%u5BE8%u6EAA%u5927%u6865"},{"mn":"A500116_0004","name":"北渡","urlCode":"%u5317%u6E21"},{"mn":"A500162_0001","name":"红岩","urlCode":"%u7EA2%u5CA9"},{"mn":"A500000_2013","name":"玉滩水库库心","urlCode":"%u7389%u6EE9%u6C34%u5E93%u5E93%u5FC3"},{"mn":"A500227_0001","name":"两河口","urlCode":"%u4E24%u6CB3%u53E3"},{"mn":"A500224_0001","name":"中和","urlCode":"%u4E2D%u548C"},{"mn":"A500226_0002","name":"高洞电站","urlCode":"%u9AD8%u6D1E%u7535%u7AD9"},{"mn":"A500102_0001","name":"清溪场","urlCode":"%u6E05%u6EAA%u573A"},{"mn":"A500101_0001","name":"晒网坝","urlCode":"%u6652%u7F51%u575D"},{"mn":"A500101_0002","name":"向家","urlCode":"%u5411%u5BB6"},{"mn":"A511700_2006","name":"联盟桥","urlCode":"%u8054%u76DF%u6865"},{"mn":"A500229_0002","name":"土堡寨","urlCode":"%u571F%u5821%u5BE8"},{"mn":"A500229_0003","name":"水寨子","urlCode":"%u6C34%u5BE8%u5B50"},{"mn":"A500102_0004","name":"木瓜洞","urlCode":"%u6728%u74DC%u6D1E"},{"mn":"A500115_0004","name":"六剑滩","urlCode":"%u516D%u5251%u6EE9"},{"mn":"A500233_0003","name":"苏家","urlCode":"%u82CF%u5BB6"},{"mn":"A500233_0001","name":"卫星桥","urlCode":"%u536B%u661F%u6865"},{"mn":"A500233_0002","name":"高洞梁","urlCode":"%u9AD8%u6D1E%u6881"},{"mn":"A500235_0002","name":"高阳渡口","urlCode":"%u9AD8%u9633%u6E21%u53E3"},{"mn":"A500235_0003","name":"汤溪河江口","urlCode":"%u6C64%u6EAA%u6CB3%u6C5F%u53E3"},{"mn":"A500236_0002","name":"白帝城","urlCode":"%u767D%u5E1D%u57CE"},{"mn":"A500236_0001","name":"罗汉大桥","urlCode":"%u7F57%u6C49%u5927%u6865"},{"mn":"A422800_0001","name":"巫峡口","urlCode":"%u5DEB%u5CE1%u53E3"},{"mn":"A500237_0002","name":"花台","urlCode":"%u82B1%u53F0"},{"mn":"A500232_0004","name":"白马","urlCode":"%u767D%u9A6C"},{"mn":"A500232_0002","name":"鸭江镇","urlCode":"%u9E2D%u6C5F%u9547"},{"mn":"A500230_0001","name":"湖海场","urlCode":"%u6E56%u6D77%u573A"},{"mn":"A433100_0003","name":"里耶镇","urlCode":"%u91CC%u8036%u9547"},{"mn":"A500242_0001","name":"红花村","urlCode":"%u7EA2%u82B1%u6751"},{"mn":"A500232_0001","name":"锣鹰","urlCode":"%u9523%u9E70"},{"mn":"A500243_0001","name":"郁江桥","urlCode":"%u90C1%u6C5F%u6865"},{"mn":"A500382_0002","name":"码头","urlCode":"%u7801%u5934"},{"mn":"A520300_2004","name":"长脚","urlCode":"%u957F%u811A"},{"mn":"A422800_2007","name":"长顺乡","urlCode":"%u957F%u987A%u4E61"},{"mn":"A500115_0002","name":"黎家乡崔家岩村","urlCode":"%u9ECE%u5BB6%u4E61%u5D14%u5BB6%u5CA9%u6751"},{"mn":"25001020049A1","name":"李渡","urlCode":"%u674E%u6E21"},{"mn":"250011700500A1","name":"金子(老)","urlCode":"%u91D1%u5B50%28%u8001%29"},{"mn":"A500223_0001","name":"玉溪","urlCode":"%u7389%u6EAA"},{"mn":"A500232_0003","name":"江口镇","urlCode":"%u6C5F%u53E3%u9547"},{"mn":"A520300_2008","name":"坡渡","urlCode":"%u5761%u6E21"},{"mn":"A500114_0001","name":"万木","urlCode":"%u4E07%u6728"},{"mn":"A500110_0002","name":"石门坎","urlCode":"%u77F3%u95E8%u574E"},{"mn":"A500382_0001","name":"金子","urlCode":"%u91D1%u5B50"},{"mn":"A500383_0001","name":"朱沱","urlCode":"%u6731%u6CB1"},{"mn":"A511600_2003","name":"幺滩","urlCode":"%u5E7A%u6EE9"},{"mn":"A500223_0002","name":"光辉","urlCode":"%u5149%u8F89"},{"mn":"A422800_2006","name":"百福司镇","urlCode":"%u767E%u798F%u53F8%u9547"},{"mn":"A422800_2005","name":"周家坝","urlCode":"%u5468%u5BB6%u575D"}]

window.downloadAll = async function(){
    console.log("downloadAll");
    let startTime = $("#startTime").val().replace("时","");
    let endTime = $("#endTime").val().replace("时","");
    console.log("startTime:"+startTime);
    console.log("endTime:"+endTime);
    for (let item of window.siteMap){
        $.cookie("checkedNode",item.mn,{path:'/',});
        $.cookie("checkedNodeName",item.urlCode,{path:'/',});
        window.dataDownload(item,startTime,endTime);
        await window.sleep(2000);
    }
};

window.delayDownload = function(arg, delay) {
    setTimeout(function () {
        window.dataDownload(item);
    }, delay);
};

window.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

window.dataDownload = function(item,startTime,endTime) {
    let param = {
        "action":"export",
        "dtFrom":startTime,
        "dtTo":endTime,
        "params":"w01010|w01001|w01009|w01014|w01003|w01019|w21003|w21011|w21001",
        "flag":"1",
        "type":"0",
    };
    if (item.mn === "A500000_2013"){
        param.params = "w01010|w01001|w01009|w01014|w01003|w01019|w21003|w21011|w21001|w01016|w01022"
    }
    console.log("开始下载"+item.name);
    // $.ajax({
    //     url : "http://106.37.208.243:8068/AutoData/Business/CycleData/OriginalData_List.aspx",
    //     type : "GET",
    //     data : param,
    //     success : function(data) {
    //         console.log("文件开始下载");
    //         window.createDownload(data,'application/ms-excel','test.xls')
    //     },
    //     error : function() {
    //         console.log("文件下载失败")
    //     }
    // });
    let url = 'http://106.37.208.243:8068/AutoData/Business/CycleData/OriginalData_List.aspx?';
    for (let variable in param){
        url += variable + "=" + param[variable] + "&"
    }
    window.open(url);
};

window.createDownload = function(content,type,title) {
    var data = new Blob([content],{type:type});
    var downloadUrl = window.URL.createObjectURL(data);
    var anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = title;
    anchor.click();
    window.URL.revokeObjectURL(data);
};

/**************************************时间格式化处理************************************/
window.dateFtt = function(fmt,date) { //author: meizz
    var o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "H+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
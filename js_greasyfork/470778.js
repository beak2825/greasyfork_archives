// ==UserScript==
// @name         咪咕视频审核快速筛选工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  咪咕视频审核全量快速筛选工具
// @author       AI数据标注猿
// @match        https://oes-coss.miguvideo.com:1443/oes-csas-web/*
// @grant        GM_xmlhttpRequest
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/470778/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%AE%A1%E6%A0%B8%E5%BF%AB%E9%80%9F%E7%AD%9B%E9%80%89%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/470778/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E5%AE%A1%E6%A0%B8%E5%BF%AB%E9%80%9F%E7%AD%9B%E9%80%89%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //查询全量的URL
    var  queryContentListUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/content/queryList';
    //存放待查询人员名单(每行10个账号)
    var auditorList = ['zbs003yaomingwei','zbs003yangenrui','zbs003liwenhui','zbs002wangtingting','zbs003hunaiyang','zbs003langshanshan','zbs002wangxue','zbs003gengyan','zbs003liutianmeng','zbs003wenlili',
                      'zbs003liuhao','zbs003zhanganqi','zbs003jianglichun','zbs003tangruomeng','zbs003baiyuezhou','zbs003lichuang','zbs003tiansong','zbs003wangwenwen','zbs003caixu','zbs003caoqun',
                       'zbs003liuji','zbs003zhangsuya','zbs003dengyanhui','zbs003guoshiyang','zbs003wangxiaotong','zbs002liyan','zbs003zhangwenbo','zbs003hewei',
                      'zbs003jiangbowen','zbs003jianglianghan','zbs003jinlong','zbs003liping','zbs003wangli','zbs003lizhuo','zbs004liuyang','zbs003zhouxinyu','zhuhuayue','zbs003zhaozhenyang',
                       'zbs003zhaohaibo','zbs001zhangyu','zbs003zhanxinxin','zbs003jiangnan','zbs003zangtianyu','zbs003xuxiaoying','zbs003xinjunda','zbs003xiaochangsheng','zbs003wangkai','zbs003shice',
                      'zbs003lvwentao','zbs002jiangnan','zbs003shangdongmei','zbs003liruomeng','zbs002zhangying','zbs003chenshuai','zbs002wangyu','zbs003zhuqianhe'];
    //存放待查询的内容
    //账号
    var searchAuditor ;
    var searchTitleKeyword ;
    //用于记录查询结果数量
    var num = 0;

    // 创建搜索框元素
    var searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.id = 'customSearchBox';
    searchBox.placeholder = '输入关键词进行搜索';

    // 创建下拉框元素
    var selectBox = document.createElement('select');
    selectBox.id = 'customSelectBox';
    selectBox.innerHTML = `
        <option value="1">审核通过</option>
        <option value="3">审核中</option>
        <option value="2">待审核</option>
        <option value="0">审核不通过</option>
    `;

    // 创建搜索按钮
    var searchButton = document.createElement('button');
    searchButton.innerHTML = '搜索';

    // 创建结果列表
    var resultList = document.createElement('ul');
    resultList.id = 'customSearchResultList';

    // 创建容器元素
    var container = document.createElement('div');
    container.id = 'customSearchContainer';

    // 将搜索框、下拉框和按钮添加到容器中
    container.appendChild(searchBox);
    container.appendChild(selectBox);
    container.appendChild(searchButton);

    // 创建浮动页面
    var floatingPage = document.createElement('div');
    floatingPage.id = 'customFloatingPage';

    // 将容器和结果列表添加到浮动页面中
    floatingPage.appendChild(container);
    floatingPage.appendChild(resultList);

    // 添加样式
    var styles = `
        #customFloatingPage {
            position: fixed;
            top: 50px;
            left: 50px;
            border: none;
            z-index: 9999;
            background-color: #ffffff;
            padding: 10px;
        }

        #customSearchResultList {
            margin-top: 20px;
            list-style-type: none;
        }
    `;
    var styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.body.appendChild(styleElement);

    document.body.appendChild(floatingPage);

    // 让浮动页面可拖动
    var isDragging = false;
    var startPosX, startPosY;

    floatingPage.addEventListener('mousedown', function(e) {
        isDragging = true;
        startPosX = e.clientX - floatingPage.offsetLeft;
        startPosY = e.clientY - floatingPage.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            floatingPage.style.left = (e.clientX - startPosX) + 'px';
            floatingPage.style.top = (e.clientY - startPosY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // 监听搜索按钮点击事件
    searchButton.addEventListener('click', function() {
        var keyword = searchBox.value;
        var selectedValue = selectBox.value;

        // 在这里编写你的搜索逻辑
        // 可以同时使用关键词和下拉框选项进行搜索并生成结果列表
        // 下面是一个简单的示例，将搜索关键词和选项值添加到结果列表中

        //var listItem = document.createElement('li');
        //listItem.textContent = '';
        //resultList.appendChild(listItem);
        // 清空结果列表
        resultList.innerHTML = '';

        searchAuditorContent(keyword,selectedValue);
    });


    //逐个对人员进行查询
    function searchAuditorContent(keyword,selectedValue){
        for (var i = 0; i < auditorList.length; i++) {
            var auditor = auditorList[i];
            //拼接Post查询的JSON
           var jsonData = {
               "aiAuditStatus": "",
               "aisleEndTime": "",
               "aisleId": "",
               "aisleStartTime": "",
               "assetId": "",
               "auditor": auditor,
               "auditStatus": selectedValue,
               "auditType": "",
               "author": "",
               "collectEndTime": "",
               "collectStartTime": "",
               "costTime": "",
               "createTimeEndTime": "",
               "createTimeStartTime": "",
               "displayName": "",
               "endTime": "",
               "exclusiveKeyword": "",
               "keywords": "",
               "labelId": "",
               "location": "2",
               "MD5": "",
               "mediumStatus": "",
               "occurred": "",
               "otherKeyword": "",
               "pageNum": 1,
               "pageSize": 100,
               "riskList": [],
               "secondClassCode": "",
               "startTime": "",
               "thirdClassCode": "",
               "titleKeyword": keyword,
               "userId": "",
               "userRiskList": [],
               "videoType": ""
           };

            searchData(jsonData);

        }

        if(num === 0){
            //显示一条无数据即可
            var listItem;
            listItem = document.createElement('li');
            listItem.textContent ='无查询结果！';

            resultList.appendChild(listItem);
        }
    }

     // 查询数据
    function searchData(jsonData) {

            // 将 JSON 数据转换为字符串
            var jsonString = JSON.stringify(jsonData);
            // 创建 XMLHttpRequest 对象
            var xhr = new XMLHttpRequest();
            // 设置请求信息
            // 替换为目标服务器的URL
            xhr.open('POST',queryContentListUrl , true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            // 设置回调函数
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    //alert('提交成功！');

                    var listItem;

                    if(response.data.total > 0 ){

                        listItem = document.createElement('li');
                        listItem.textContent ='账号：'+jsonData.auditor+ '查询结果总量数量：' + response.data.total;

                        resultList.appendChild(listItem);
                        // 在控制台输出响应数据
                        console.log(response);
                        num += 1;
                    }else{
                        num = 0;
                    }



                } else {
                  //alert('提交失败，请手动提交！');
                }
            };

            // 发送请求
            xhr.send(jsonString);
    }




})();
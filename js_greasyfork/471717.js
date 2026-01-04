// ==UserScript==
// @name         咪咕自动巡检脚本工具
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  咪咕视频自动巡检脚本工具
// @author       AI数据标注猿
// @match        https://oes-coss.miguvideo.com:1443/oes-csas-web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=firefoxchina.cn
// @grant         GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471717/%E5%92%AA%E5%92%95%E8%87%AA%E5%8A%A8%E5%B7%A1%E6%A3%80%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/471717/%E5%92%AA%E5%92%95%E8%87%AA%E5%8A%A8%E5%B7%A1%E6%A3%80%E8%84%9A%E6%9C%AC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function() {
    'use strict';
     //存放通道连接地址
     var authenticationAisleList = [];
     //媒资ID
     var assetId;
    //账号ID
    var author;
    //通道地址
     var aisleId;
    //存储全量查询AI
    var url = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/content/queryList';
    //存储判断是否有违规词
    var titleContainsChineseWordResult = false;
     //存放待查询人员名单(每行10个账号)
    var auditorList = ['zbs003yaomingwei'];

    //开始查询时间
    var startTime = '';
    //查询结束时间
    var endTime = '';

    //查询结果记录在csv中的表头,violationDescription(违规说明)
    const queryData = [
            ['auditor1', 'assetId1', 'assetName1','auditStatusStr1','labelName1','auditRemark1','aisleTime1','violationDescription1'], // 表头行
        ];
    //记录当前查询数据
    var auditor = '';
    var searchWordLibrary = ['随刻','腾讯视频','好看视频','优酷','土豆','搜狐','乐视','西瓜视频','秒拍','抖音','快手','火山','最右','微博','梨视频','皮皮虾','爱奇艺','小红书','直播吧','今日头条','百度视频','网易视频','哔哩哔哩','bilibili',
                             '我的英雄学院','逃学威龙','头文字','大时代','地球停转之日','罪恶之城','巫师3','隐入尘烟','死亡笔记','暗杀教室','恶搞之家','辛普森一家','瑞奇和莫迪','一九四二','猫汤','我推的孩子','伊拉克恶狼谷','娜珍之交','禁忌女孩',
                             '黑白校园','疾速追杀','天龙八部','宁安如梦','人体蜈蚣','进击巨人','刃艾伦','阿尔敏','少林足球','我叫刘金凤','奇幻潮','终极一班','全民目击','山河令','叶问大战约翰威克','澳门风云','相爱十年','剑雨','风云','隐如尘烟','情深深雨蒙蒙','康斯坦丁','大盗','疾速追杀','黑客帝国','小时代','上海滩','欢乐今宵',
                             '陈羽凡','炎亚纶','徐濠萦','王全安','谭小环','罗志祥','翟天临','吴启明','林建明','叶德娴','李易峰','毛宁','张默','林夕','胡瓜','陈冠希','黄秋生','赵薇','张耀扬','薇娅','李云迪','李铁','范冰冰','炎亚纶','赵立新','孙兴','李易峰','柯震东','张元','高虎','邓伦','唐诗咏','张哲瀚','黄海波','高晓松','周峻纬','朴明秀',
                             '钙片','烟酰胺','鱼油','维生素','益生菌','护肝片','叶黄素','保健品推广','上海养老金', '康士坦丁', '泰剧', '泰国', '抖in','大佛普拉斯', '好物分享','基努·里维斯','乐火团队','维尼熊','综合格斗','谢文东','绣春刀','特警新人类',
                             '虚竹','乔峰','段誉','鸠摩智','撒旦','段誉','夜神月',
                             '特朗普','俄乌','美俄',
                             '缅北','鸭脖','网恋','小萝莉'];



    // 创建悬浮窗口
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '50%';
    floatingWindow.style.left = '50%';
    floatingWindow.style.transform = 'translate(-50%, -50%)';
    floatingWindow.style.backgroundColor = 'white';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.border = '1px solid black';
    floatingWindow.style.zIndex = '9999';
    floatingWindow.style.cursor = 'move'; // 添加拖拽光标样式

    // 添加开始日期和时间输入框
    const startTimeInput = document.createElement('input');
    startTimeInput.type = 'datetime-local';
    startTimeInput.id = 'start-time';
    startTimeInput.style.marginRight = '10px';
    floatingWindow.appendChild(startTimeInput);

    // 添加结束日期和时间输入框
    const endTimeInput = document.createElement('input');
    endTimeInput.type = 'datetime-local';
    endTimeInput.id = 'end-time';
    endTimeInput.style.marginRight = '10px';
    floatingWindow.appendChild(endTimeInput);

     // 添加查询类型下拉框
    const queryTypeSelect = document.createElement('select');
    queryTypeSelect.id = 'query-type';
    queryTypeSelect.style.marginRight = '10px';

    // 添加人名选项
    const peopleNames = ['zbs003yaomingwei','zbs003yangenrui','zbs003liwenhui','zbs002wangtingting','zbs003hunaiyang','zbs003langshanshan','zbs002wangxue','zbs003gengyan','zbs003liutianmeng','zbs003wenlili',
                      'zbs003liuhao','zbs003zhanganqi','zbs003jianglichun','zbs003tangruomeng','zbs003baiyuezhou','zbs003lichuang','zbs003tiansong','zbs003wangwenwen','zbs003caixu','zbs003caoqun',
                       'zbs003hanqitong','zbs003hongjiaxin','zbs003liuji','zbs003zhangsuya','zbs003dengyanhui','zbs003guoshiyang','zbs003wangxiaotong','zbs002liyan','zbs003zhangwenbo','zbs003hewei',
                      'zbs003jiangbowen','zbs003jianglianghan','zbs003jinlong','zbs003liping','zbs003wangli','zbs003lizhuo','zbs004liuyang','zbs003zhouxinyu','zhuhuayue','zbs003zhaozhenyang',
                       'zbs003zhaohaibo','zbs001zhangyu','zbs003zhanxinxin','zbs003jiangnan','zbs003zangtianyu','zbs003xuxiaoying','zbs003xinjunda','zbs003xiaochangsheng','zbs003wangkai','zbs003shice',
                      'zbs003lvwentao','zbs002jiangnan','zbs003shangdongmei','zbs003liruomeng','zbs002zhangying','zbs003chenshuai','zbs002wangyu','zbs003zhuqianhe'];

    for (const name of peopleNames) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        queryTypeSelect.appendChild(option);
    }

    floatingWindow.appendChild(queryTypeSelect);

    // 添加“自动巡检”按钮
    const inspectButton = document.createElement('button');
    inspectButton.textContent = '自动巡检';
    floatingWindow.appendChild(inspectButton);

    // 添加悬浮窗口到页面
    document.body.appendChild(floatingWindow);

    let offsetX, offsetY; // 鼠标位置和悬浮窗口位置的差值

    // 鼠标按下时记录差值
    floatingWindow.addEventListener('mousedown', (event) => {
        offsetX = event.clientX - floatingWindow.offsetLeft;
        offsetY = event.clientY - floatingWindow.offsetTop;
    });

    // 鼠标移动时更新悬浮窗口位置
    document.addEventListener('mousemove', (event) => {
        if (offsetX !== undefined && offsetY !== undefined) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;
            floatingWindow.style.left = x + 'px';
            floatingWindow.style.top = y + 'px';
        }
    });

    // 鼠标释放时重置差值
    document.addEventListener('mouseup', () => {
        offsetX = undefined;
        offsetY = undefined;
    });

      // 设置开始时间输入框默认值为当天
    const today = new Date();
    const startYear = today.getFullYear();
    const startMonth = String(today.getMonth() + 1).padStart(2, '0');
    const startDay = String(today.getDate()).padStart(2, '0');
    const defaultStartTime = `${startYear}-${startMonth}-${startDay} 00:00:00`;
    startTimeInput.value = defaultStartTime;

    // 设置结束时间输入框默认值为当天的23:59:59
    const defaultEndTime = `${startYear}-${startMonth}-${startDay} 23:59:59`;
    endTimeInput.value = defaultEndTime;

    // 点击“自动巡检”按钮的事件处理程序
    inspectButton.addEventListener('click', () => {
        // 获取选择的开始时间和结束时间
        startTime = formatDateTime(startTimeInput.value).replace('T', ' ');;
        endTime = formatDateTime(endTimeInput.value).replace('T', ' ');;
        // 获取选择的人名
        const selectedName = queryTypeSelect.value;

        // 在这里执行查询操作，根据实际需求自行处理
        console.log('开始时间:', startTime);
        console.log('结束时间:', endTime);
        console.log('账号ID:', selectedName);

        // 在这里调用查询函数进行数据查询
       performQuery(startTime, endTime,selectedName);
    });

    // 在这里定义查询函数
    async function performQuery(startTime, endTime,selectedName) {
        await searchAllData(startTime, endTime,selectedName);
        // 在这里执行查询操作，根据实际需求自行处理
        console.log('执行查询操作，开始时间:', startTime, '结束时间:', endTime);
        // 在这里根据查询结果进行相应的处理
    }


    async function searchAllData(startTime, endTime,selectedName){
            //赋值当前数据
            auditor = selectedName;
            // 拼接JSON对象
            var jsonData = {
                "aiAuditStatus": "",
                "aisleEndTime": "",
                "aisleId": "",
                "aisleStartTime": "",
                "assetId": "",
                "auditor":auditor,
                "auditStatus": "",
                "auditType": "",
                "author": "",
                "collectEndTime": "",
                "collectStartTime": "",
                "costTime": "",
                "createTimeEndTime": "",
                "createTimeStartTime": "",
                "displayName": "",
                "endTime": endTime,
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
                "startTime": startTime,
                "thirdClassCode": "",
                "titleKeyword": "",
                "userId": "",
                "userRiskList": [],
                "videoType": ""
            };
            //查询一个人的查询数据
            await postData(jsonData);

    }


    // 提交数据
    async function postData(jsonData) {

            // 将 JSON 数据转换为字符串
            var jsonString = JSON.stringify(jsonData);
            // 创建 XMLHttpRequest 对象
            var xhr = new XMLHttpRequest();
            // 设置请求信息
            // 替换为目标服务器的URL
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            // 设置回调函数
            xhr.onreadystatechange =async function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);

                    await checkData(response);

                } else {
                  //alert('提交失败，请手动提交！');

                }
            };

            // 发送请求
            xhr.send(jsonString);
    }

    //查询解析数据
   async function checkData(response){
        var searchResultData = response.data;
        var pageSize = searchResultData.pageSize;
        var pages = searchResultData.pages;
       //存放违禁词
       var prohibitedWord = '';
       //判断视频内容是否违规
       var result = '';

        //页循环
        for(var i = 1; i < pages + 1; i++){

            if(i === 1){
                //每一页数据循环查询
                for(var j = 0; j < searchResultData.dataList.length; j++){
                    var data = searchResultData.dataList[j];
                    //媒资ID
                    var assetId = data.assetId;
                    //标题
                    var assetName = data.assetName;
                    //审核结果
                    var auditStatusStr = data.auditStatusStr;
                    //违规处置标签
                    var labelName = data.labelName;
                    //备注
                    var auditRemark = data.auditRemark;
                    //进入通道时间
                    var aisleTime = data.aisleTime;


                    //标题敏感词审核
                    //判断标题和简介是否有违禁词
                    //存放违禁词
                    prohibitedWord = await titleContainsChineseWord(assetName);
                    //判断视频内容是否违规
                    result = await searchInferiorArtistOrProhibitedWord(assetId);
                    console.log('，AI提示视频内容文字部分存在违禁词:'+prohibitedWord + result);

                    //写入csv
                    const auditor1 = auditor;
                    const assetId1 = assetId;
                    const assetName1 = assetName.replace(/,/g, '，');
                    const auditStatusStr1 = auditStatusStr;
                    const labelName1= labelName;
                    const auditRemark1 = auditRemark.replace(/,/g, '，');
                    const aisleTime1 = aisleTime;
                    const violationDescription1 = prohibitedWord + result;
                    await queryData.push([auditor1, assetId1, assetName1,auditStatusStr1,labelName1,auditRemark1,aisleTime1,violationDescription1]);
                    console.log('成功写入第'+i+'页，第' + j + '条数据');
                }
            }else{
                //从第二页起需要重新请求数据
                // 拼接JSON对象
                var jsonData1 = {
                    "aiAuditStatus": "",
                    "aisleEndTime": "",
                    "aisleId": "",
                    "aisleStartTime": "",
                    "assetId": "",
                    "auditor":auditor,
                    "auditStatus": "",
                    "auditType": "",
                    "author": "",
                    "collectEndTime": "",
                    "collectStartTime": "",
                    "costTime": "",
                    "createTimeEndTime": "",
                    "createTimeStartTime": "",
                    "displayName": "",
                    "endTime": endTime,
                    "exclusiveKeyword": "",
                    "keywords": "",
                    "labelId": "",
                    "location": "2",
                    "MD5": "",
                    "mediumStatus": "",
                    "occurred": "",
                    "otherKeyword": "",
                    "pageNum": i,
                    "pageSize": 100,
                    "riskList": [],
                    "secondClassCode": "",
                    "startTime": startTime,
                    "thirdClassCode": "",
                    "titleKeyword": "",
                    "userId": "",
                    "userRiskList": [],
                    "videoType": ""
                };



                  // 调用发送POST请求的函数，并使用then()处理结果
                await sendPostRequest(jsonData1).then((response) => {
                    // 在这里处理请求成功后的result数据
                    console.log('处理请求成功的数据:', response);
                    // 在这里执行后续代码
                    var responseData = response.data;
                    console.log('POST请求成功:', responseData);
                    //处理每页数据
                    makeData(responseData);

                }).catch((error) => {
                    // 在这里处理请求失败或错误
                    console.error('处理请求失败或错误:', error);
                    // 在这里执行后续代码
                });
                console.log('成功写入第'+i+'页，第');
            }
        }
       //写入csv中
       await saveDataAsCSV(queryData);
       //查询结果记录在csv中的表头,violationDescription(违规说明)
       // 清空 queryData 数组，只保留表头行
       queryData.length = 1; // 或 queryData.splice(1);
    }

    //处理第二页后的每页数据
   async function makeData(responseData){
        //存放违禁词
        var prohibitedWord = '';
        //判断视频内容是否违规
        var result = '';
        // 在这里处理返回的数据
        //每一页数据循环查询
        for(let j = 0; j < responseData.dataList.length; j++){

            var data = responseData.dataList[j];

            //标题敏感词审核
            //判断标题和简介是否有违禁词
            //存放违禁词
            prohibitedWord = await titleContainsChineseWord(data.assetName);
            //判断视频内容是否违规
            result = await searchInferiorArtistOrProhibitedWord(data.assetId);
            //写入csv
            const auditor1 = auditor;
            //媒资ID
            const assetId1 = data.assetId;
            //标题
            const assetName1 = data.assetName.replace(/,/g, '，');
            //审核结果
            const auditStatusStr1 = data.auditStatusStr;
            //违规处置标签
            const labelName1= data.labelName;
            //备注
            const auditRemark1 = data.auditRemark.replace(/,/g, '，');
            //进入通道时间
            const aisleTime1 = data.aisleTime;
            const violationDescription1 = prohibitedWord + result;
            queryData.push([auditor1, assetId1, assetName1,auditStatusStr1,labelName1,auditRemark1,aisleTime1,violationDescription1]);

            console.log('成功写入第' + j + '条数据');
        }
    }

    // 发送POST请求，并返回一个Promise对象
    function sendPostRequest(jsonData1) {

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(jsonData1),
                onload: function(response) {
                    if (response.status === 200) {
                        const responseData = JSON.parse(response.responseText);
                        console.log('POST请求成功:', responseData);
                        resolve(responseData); // 请求成功，将返回的数据传递给resolve
                    } else {
                        console.error('POST请求失败:', response.status, response.statusText);
                        reject(new Error('POST请求失败')); // 请求失败，传递错误对象给reject
                    }
                },
                onerror: function(error) {
                    console.error('发生错误:', error);
                    reject(error); // 请求发生错误，传递错误对象给reject
                }
            });
        });
    }
     //判断标题和介绍中是否存在违纪词语
    function titleContainsChineseWord(mySentence){
        var searchReturnWord = '';
        for (var i = 0; i < searchWordLibrary.length; i++) {
            var searchWord = searchWordLibrary[i];
            if(containsChineseWord(mySentence, searchWord)){
                searchReturnWord += searchWord;
            }
            //console.log(searchWord + ": " + containsChineseWord(mySentence, searchWord)+'-'+titleContainsChineseWordResult);
        }
        console.log(searchReturnWord);
        return searchReturnWord;
    }

    //查询劣迹艺人或许内容有违禁词
   async function searchInferiorArtistOrProhibitedWord(assetId){
        //存放返回结果
        var result = '';
         //存放链接
        var aiUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/aia-record/video/result?assetId='+assetId;
        var aiResult = await getContent2(aiUrl);
        // 人脸名称
        console.log(aiResult);
        //AI质检结果及文本结果
       // 访问其中的属性
       if(aiResult.data !== null){
           var dataAI = JSON.parse(aiResult.data);
           var auditReason = dataAI.auditReason;
           var dataList = dataAI.dataList;
           var faceNameSet = 'faceNameSet';
           var textSet = 'textSet';
           //使用前清空set
           localStorage.removeItem(faceNameSet);
           localStorage.removeItem(textSet);

           if(auditReason !== '通过'){
               for(var i = 0; i < dataList.length; i++){
                   var dataListValue = dataList[i];

                   addToSet(dataListValue.text,textSet);
                   if('faces' in dataListValue ){
                       for(var j = 0; j < dataListValue.faces.length; j++){
                           var name = dataListValue.faces[j].name;
                           if (name === null || name === undefined || name === '') {
                               continue; // 不允许存储空值
                           }else{
                               addToSet(dataListValue.faces[j].name,faceNameSet);
                           }
                       }
                   }
               }
               //判断视频内文字是否存在违禁词
               var prohibitedWord = await titleContainsChineseWord(getSet(textSet));

               //存放违禁词
               if(prohibitedWord !== ''){
                   result = '，AI提示视频字幕存在违禁词:'+prohibitedWord;
                   console.log('，AI提示视频内容文字部分存在违禁词:'+prohibitedWord);
               }

               //判断人名是否是劣迹艺人https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=程峰&formerName=&country=&genre=&badProblem=&bak1=&bak2
               var searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
               //违禁艺人名称
               var searchInferiorArtistName;
               var faceSet = getSet(faceNameSet);
               if(faceSet.length !== 0){
                   for(var item of faceSet){
                       searchInferiorArtistUrl = searchInferiorArtistUrl + item + '&formerName=&country=&genre=&badProblem=&bak1=&bak2=';
                       var searchInferiorArtisResult = await getContent(searchInferiorArtistUrl);
                       var total = searchInferiorArtisResult.data.total;
                       if(total !== 0){
                           searchInferiorArtistName = item;
                           var records = searchInferiorArtisResult.data.records;
                           var searchResult = '';
                           for(var g = 0; g < records.length; g++){
                               var artistName = records[g].name;
                               var artistGenre = records[g].genre;
                               var artistControlDescription = records[g].controlDescription;
                               searchResult = searchResult + '，人物库查询结果:劣迹艺人名称：'+ artistName +'，劣迹类型：' + artistGenre + '，管控描述：'+ artistControlDescription;
                           }
                           result += '，AI提示视频内容出现违禁艺人:'+searchInferiorArtistName + searchResult;
                           console.log('AI提示视频内容出现违禁艺人:'+searchInferiorArtistName + searchResult);
                       }
                       searchInferiorArtistUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?current=1&size=20&name=';
                   }
               }
           }
       }

        return result;

    }

        // 判断中文语句中是否包含特定中文词语
    function containsChineseWord(sentence, word) {
        // 使用 "u" 标志启用 Unicode 正则匹配
        var regex = new RegExp(word, 'u');
        return regex.test(sentence);
    }

    // 发起 GET 请求获取通用方法
    async function getContent(url) {
        return new Promise(await function(resolve, reject) {
            fetch(url)
                .then(function(response) {
                return response.json();
            })
                .then(function(data) {
                resolve(data);
            })
                .catch(function(error) {
                reject(error);
            });
        });
    }
    // 发起 GET 请求获取腾讯文档内容
    async function getContent2(url) {
        return await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const responseData = JSON.parse(response.responseText);
                        console.log('GET请求成功:', responseData);
                        resolve(responseData); // 请求成功，将返回的数据传递给resolve
                    } else {
                        console.error('GET请求失败:', response.status, response.statusText);
                        reject(new Error('GET请求失败')); // 请求失败，传递错误对象给reject
                    }
                },
                onerror: function(error) {
                    console.error('发生错误:', error);
                    reject(error); // 请求发生错误，传递错误对象给reject
                }
            });
        });
    }

     // 函数：添加元素到Set
    function addToSet(value,setName) {
         if (value === null || value === undefined || value === '') {
            return; // 不允许存储空值
        }
        var set = getSet(setName);
        if (!set.includes(value)) {
            set.push(value);
            saveSet(set,setName);
        }
    }

        // 函数：从Set中移除元素
    function removeFromSet(value,setName) {
        var set = getSet(setName);
        var index = set.indexOf(value);
        if (index !== -1) {
            set.splice(index, 1);
            saveSet(set,setName);
        }
    }

    // 函数：获取Set
    function getSet(setName) {
        var setString = localStorage.getItem(setName);
        if (setString) {
            return JSON.parse(setString);
        } else {
            return [];
        }
    }

    // 函数：保存Set
    function saveSet(set,setName) {
        localStorage.setItem(setName, JSON.stringify(set));
    }


    // 示例数据
    //const dynamicData = [
    //    ['Name', 'Age', 'Email'], // 表头行
    //    ['John', 30, 'john@example.com'],
    //    ['Jane', 25, 'jane@example.com']
    //];

    // 生成CSV格式数据
    function convertToCSV(data) {
        const csv = data.map(row => row.join(',')).join('\n');
        return csv;
    }

    // 创建并下载CSV文件
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 保存数据为CSV文件
    function saveDataAsCSV(data) {
        const csvContent = convertToCSV(data);
        const filename = 'data.csv';
        downloadCSV(csvContent, filename);
    }

    // 在需要的时候调用 saveDataAsCSV 函数来保存数据为CSV文件
    // 替换为实际的动态数据
    //saveDataAsCSV(dynamicData);


    // 格式化时间函数
    function formatDateTime(dateTimeStr) {
        const dateTime = new Date(dateTimeStr);
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const day = String(dateTime.getDate()).padStart(2, '0');
        const hours = String(dateTime.getHours()).padStart(2, '0');
        const minutes = String(dateTime.getMinutes()).padStart(2, '0');
        const seconds = String(dateTime.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
})();
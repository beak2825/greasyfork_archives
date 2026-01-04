// ==UserScript==
// @name         下载数据
// @namespace    http://your-namespace.com
// @version      1.0
// @description  人物库信息/敏感词/公告台账
// @author       AI数据标注猿
// @match        https://oes-coss.miguvideo.com:1443/oes-csas-web/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478403/%E4%B8%8B%E8%BD%BD%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/478403/%E4%B8%8B%E8%BD%BD%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //人物库链接Get 1
    var renWuKuUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/figure/learn/findByPage?size=500&name=&formerName=&country=&genre=&badProblem=&bak1=&bak2=&current=';

    //敏感词POST 2
    var minGanWordUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-words/word/learn';

    //公告台账Get 3
    var gongGaoUrl = 'https://oes-coss.miguvideo.com:1443/oes-csas-manage/announcement/list?current=1&size=10';

    document.addEventListener('keydown', function(event) {
        // 按下空格键（键码为32）
        if (event.key === '1') {

            getRenWuKu();

        }
    });


    //获取人物库信息
    async function getRenWuKu(){

         var renWuKuResult = await getContent(renWuKuUrl+'1');

         var renWuKuData = renWuKuResult.data;
         var pageSize = renWuKuData.pageSize;
         var pages = renWuKuData.pages;

         console.log(pageSize+'页数'+pages);

        //查询结果记录在csv中的表头,violationDescription(违规说明)
        const queryData = [
            ['intro_id', 'name', 'alias','country_region','type','violations','control_description','notable_works','control_date'], // 表头行
        ];

        // 判断AI质检结果及文本结果是否存在
        if (renWuKuData) { // 添加判断条件进行数据有效性检查
            //页循环
            for(var i = 1; i < pages + 1; i++){
                var renWuKuResultAll = await getContent(renWuKuUrl+'1')
                var renWuKuDataAll = renWuKuResultAll.data;
                var records = renWuKuDataAll.records;
                for(var j = 0; j < records.length; j++){
                    var data = records[i];
                    //劣迹艺人ID
                    const intro_id = data.id;
                    //人物名称
                    const name = data.name;
                    //人物曾用名
                    const alias = data.formerName;
                    //国籍
                    const country_region = data.country;
                    //类型
                    const type = data.genre;
                    //劣迹问题
                    const violations = data.badProblem;
                    //管控描述
                    const control_description = data.controlDescription;
                    //代表节目
                    const notable_works = data.worksAndProgrammes;
                    //创建时间
                    const control_date = data.created;

                    //写入csv

                    await queryData.push([intro_id, name, alias,country_region,type,violations,control_description,notable_works,control_date]);
                    console.log('成功写入第'+i+'页，第' + j + '条数据');

                }
            }
            //写入csv中
            await saveDataAsCSV(queryData);
            //查询结果记录在csv中的表头,violationDescription(违规说明)
            // 清空 queryData 数组，只保留表头行
            queryData.length = 1; // 或 queryData.splice(1);

        }

     }

   // 发起 GET 请求获取腾讯文档内容
    async function getContent(url) {
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

})();
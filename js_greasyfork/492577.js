// ==UserScript==
// @license MIT
// @name         同方课程自动签到系统
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  课程自动签到系统
// @author       You
// @match        https://dekt.xjufe.edu.cn/xjcjdxh5/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.1.4/jquery.min.js
// @require      https://unpkg.com/axios@1.6.2/dist/axios.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492577/%E5%90%8C%E6%96%B9%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/492577/%E5%90%8C%E6%96%B9%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
            let token = localStorage.getItem("token");
            function post(url, data, op) {
                let res = axios.post(url, data, op)
                    .then(function (response) {
                        return response;
                    })
                    .catch(function (error) {
                        return error;
                    });
                return res;
            }
            async function getInfo() {
                let data =  {
                    "deptIds": [],
                    "modules": [],
                    "itemName": "",
                    "itemType": "",
                    "itemRange": "",
                    "itemEvaluation": ""
                };
                let header= {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Access-Token': `${token}`
                        },
                    };
                //请求所有课程
                let res = await post('https://dekt.xjufe.edu.cn/xjcjdxApi/api/wx/applyingItem/enrolmentList/1/50',data,header);
                //获取所有课程
                let allCourse = res.data.result.records;
                let total = res.data.result.total;
                console.log(allCourse);
                $(allCourse).each(async (i, v)=>{
                    //判断是否符合要求
                    if (v.sponsor_dictText == "信息管理学院") {
                        //拼接报名api
                        let applyUrl = `https://dekt.xjufe.edu.cn/xjcjdxApi/api/wx/applyingItem/enter/${v.id}`;
                        //请求报名api
                        let applyRes = await post(applyUrl,data,header);
                        //判断是否报名成功
                        if(applyRes.data.code == 200){//成功返回课程信息
                               console.log(等待中);
                        }else{//失败返回错误信息
                            console.log(系统维护中);
                        }
                    }
                });
            }













/*
setInterval(() => {
  getInfo();
},10000);*/
    


    // Your code here...
})();
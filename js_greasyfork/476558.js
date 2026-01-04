// ==UserScript==
// @name         信誉加分系统
// @namespace    浙江交工金筑交通建设有限公司
// @version      1.5
// @description  网页数据采集
// @author       无
// @match        https://xyfw.jtyst.zj.gov.cn/credit/*
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @grant        none
// @license      JingYiKeJI
// @downloadURL https://update.greasyfork.org/scripts/476558/%E4%BF%A1%E8%AA%89%E5%8A%A0%E5%88%86%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/476558/%E4%BF%A1%E8%AA%89%E5%8A%A0%E5%88%86%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var oldHref = window.location.href;

    async function asyncFetch(url, options) {
        return new Promise((resolve, reject) => {
          fetch(url, options)
            .then(response => {
              if (response.ok) {
                resolve(response.json());
              } else {
                reject(new Error('请求失败'));
              }
            })
            .catch(error => {
              reject(error);
            });
        });
      };

    function CheckUrl(){
        if (oldHref !== window.location.href){
            console.log('网址已更换');
            MainEntry();
            oldHref = window.location.href;
        };
    };

    $(document).ready(function() {
        console.log('i am coming');
        MainEntry();
        window.setInterval(CheckUrl,1000);
    });

    function GetDocumentContentUrl(){
        //用户选择内容
        var ComType = document.querySelector("#resultAudit > div.header.ant-row > div:nth-child(1) > div > div").textContent;
        var ProType = document.querySelector("#resultAudit > div.header.ant-row > div:nth-child(3) > div > div").textContent;
        var Year = document.querySelector("#resultAudit > div.header.ant-row > div:nth-child(4) > div > span.position.ant-input-affix-wrapper > input").value

        ComType = ComType.replace('请选择单位类型', '');
        ProType = ProType.replace('请选择项目类型', '');

        if(ComType == '施工企业'){
            ComType = 'build_company';
        }else if(ComType == '设计企业'){
            ComType = 'design_company';
        };

        if(ProType == '公路工程'){
            ProType = 'road_course';
        }else if(ProType == '水运工程'){
            ProType = 'water_course';
        };

        Year = Year.replace('上半年', '1');
        Year = Year.replace('下半年', '2');

        console.log(Year);
        console.log(ProType);
        console.log(ComType);

        return "https://xyfw.jtyst.zj.gov.cn/gcapi/creditResult/creditLevelApplyPage?companyName=&companyType=" + ComType + "&evaluationYear=" + Year + "&projectType=" + ProType + "&pageNum=1&pageSize=10";
    };

    function ToExcel(downData){
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(downData);
        worksheet['!cols'] = [
            { wch: 8 }, // 列1宽度为10个字符
            { wch: 37 }, // 列2宽度为15个字符
            { wch: 10 }, // 列3宽度为20个字符
            { wch: 22 },
            { wch: 8 },
            { wch: 10 },
            { wch: 8 },
            { wch: 8 },
            { wch: 8 },
            { wch: 110 }
        ];
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        let currentDate = new Date();
        let SheetName = "信誉加分 " + currentDate.toString() + ".xlsx"
        XLSX.writeFile(workbook, SheetName);
    };

    function MainEntry(){
        if(location.href.includes('xy2-gc/creditmanagement/levequery')){
            var lpT = window.setInterval(function(){
                    if($('.ant-table-body table tbody tr').length){
                        var div = $('<div></div>');
                        div.css({
                            width: '20px',
                            //height: '200px',
                            background: '#f0f0f0'
                        });
                        var button = $('<button>').text('获 取');
                        button.css({
                            //position:'fixed',
                            //top:'150px',
                            //right:'150px',
                            //zIndex:'9999',
                            'line-height': '1.499',
                            'font-weight': '450',
                            'text-align': 'center',
                            'border': '1px solid transparent',
                            'cursor': 'pointer',
                            'width': '72px',
                            'height': '32px',
                            'padding': '0 18px',
                            'font-size': '13px',
                            'border-radius': '4px',
                            'color': '#FAFAFA',
                            'background-color': '#1890FF',
                            'border-color': '#1890FF',
                            'writing-mode': 'horizontal-tb',
                            'text-orientation': 'mixed',
                            'text-combine-upright': 'all'
                        });
                        var textarea  = $('<textarea></textarea>');
                        textarea.css({
                            width: '500px',
                        });
                        $('#resultAudit > div.header.ant-row').append(div.clone());
                        $('#resultAudit > div.header.ant-row').append(button);
                        $('#resultAudit > div.header.ant-row').append(div);
                        $('#resultAudit > div.header.ant-row').append(textarea);
                        //按钮点击事件
                        button.on("click",async function(){
                            button.prop("disabled", true);;
                            button.text("....");
                            const requestOption = {
                                method: 'GET',
                                headers: {
                                    'X-Access-Token' : JSON.parse(localStorage.getItem('pro_xy__Access-Token')).value
                                }
                            };
                            var url = GetDocumentContentUrl();
                            let TextAreaContent = textarea.val();
                            TextAreaContent = TextAreaContent.replace(/ /g, '');
                            //console.log(TextAreaContent);
                            if (TextAreaContent !== ""){
                                let regex = /[\u4e00-\u9fa5\(\)（）]*?公司/g;
                                let CompanyNameArea = TextAreaContent.match(regex);
                                let preName = '';
                                let Jsondata = [];
                                console.log(CompanyNameArea);
                                for(let ele of CompanyNameArea){
                                    try{
                                        url = url.replace('companyName=' + encodeURIComponent(preName), 'companyName=' + encodeURIComponent(ele));
                                        preName = ele;
                                        const retContent = await asyncFetch(url,requestOption);
                                        if(retContent.result.records.length == 0){
                                            Jsondata.push({
                                                "companyCode": '',
                                                'companyName': ele,
                                                'companyType': '',
                                                'companyTypeName': '施工企业',
                                                'evaluationYear': '','leftTimes': '','level': '','projectType': '','projectTypeName': '','qualificationLevel': '','qualificationLevelName': '','times': ''
                                            });
                                        };
                                        if(retContent.result.records.length == 1){
                                            if(!retContent.result.records[0].qualificationLevelName.includes('公路工程')){
                                                retContent.result.records[0].companyCode = '';
                                            };
                                        };
                                        Jsondata = Jsondata.concat(retContent.result.records);
                                    }catch(err){
                                        console.log(err);
                                    };
                                };

                                let downData = [];
                                for(let i = 0; i < Jsondata.length; i++){
                                    let IsPrint = "";
                                    let sign = "";
                                    let DetailContent = "";
                                    let DetailCount = 0;
                                    if(Jsondata[i].companyCode !== ''){
                                        let DetailUrl = "https://xyfw.jtyst.zj.gov.cn/gcapi/letterInfoCommit/creditLevelApplyPrintDetail?companyCode=" + Jsondata[i].companyCode + "&projectType="+ Jsondata[i].projectType +"&qualificationLevel=" + Jsondata[i].qualificationLevel + "&evaluationYear="+ Jsondata[i].evaluationYear;
                                        let DetailResponse = await asyncFetch(DetailUrl,requestOption);

                                        for(let j = 0; j < DetailResponse.result.length; j++){
                                            if(DetailResponse.result[j].year === Jsondata[i].evaluationYear){DetailCount = DetailCount + 1;};
                                        };
                                        if(Jsondata[i].times > DetailCount){
                                            IsPrint = "是";
                                        };
                                        let sign = "";
                                        //let DetailContent = "";
                                        for(let k = 0;k < DetailResponse.result.length; k++){
                                            if(k+1 === DetailResponse.result.length){sign = ""}else{sign = '\n'};
                                            if(DetailResponse.result[k].year === Jsondata[i].evaluationYear){
                                                DetailContent = DetailContent + (k+1) + "__" + DetailResponse.result[k].createTime + "__" + DetailResponse.result[k].projectName + "__" + DetailResponse.result[k].sectionName + "__" + DetailResponse.result[k].tenderee + "__" + DetailResponse.result[k].beginTime + sign;
                                            };
                                        };
                                    };

                                  //可以在这里加一个筛选
                                    if((!Jsondata[i].qualificationLevelName.includes('公路工程')) && Jsondata[i].companyCode!==""){continue;};
                                    downData.push({"序号": i+1 ,
                                    "单位名称":Jsondata[i].companyName,
                                    "项目类型":Jsondata[i].projectTypeName,
                                    "单位资质":Jsondata[i].qualificationLevelName,
                                    "信用等级":Jsondata[i].level,
                                    "信用年份":Jsondata[i].evaluationYear.slice(-1) === "1" ? Jsondata[i].evaluationYear.slice(0,-1) + "上半年" : Jsondata[i].evaluationYear.slice(0,-1) + "下半年",
                                    "最近打印":IsPrint,
                                    "打印次数":Jsondata[i].times,
                                    "剩余次数":Jsondata[i].leftTimes,
                                    "详细情况":DetailContent
                                    });
                                };
                                ToExcel(downData);
                                button.text("获取");
                                button.prop("disabled", false);

                                return;
                            };

                            asyncFetch(url,requestOption)
                            .then(async data => {
                                var Jsondata = data.result.records;

                                for(let i = 2;i <= data.result.pages; i++){
                                    try{
                                        let page = 1;
                                        url = url.replace('pageNum=' + (i - 1),'pageNum=' + i);
                                        console.log(url);
                                        const response = await asyncFetch(url,requestOption);
                                        console.log(await response.result.records);
                                        //const responsedata = await response.json();
                                        Jsondata = Jsondata.concat(await response.result.records);
                                    }catch(err){
                                        console.log(err);
                                    };
                                };
                                console.log(Jsondata);
                                let downData = [];

                                for(let i = 0; i < Jsondata.length; i++){
                                    let DetailUrl = "https://xyfw.jtyst.zj.gov.cn/gcapi/letterInfoCommit/creditLevelApplyPrintDetail?companyCode=" + Jsondata[i].companyCode + "&projectType="+ Jsondata[i].projectType +"&qualificationLevel=" + Jsondata[i].qualificationLevel + "&evaluationYear="+ Jsondata[i].evaluationYear;
                                    let DetailResponse = await asyncFetch(DetailUrl,requestOption);
                                    let IsPrint = "";
                                    let DetailCount = 0;
                                    for(let j = 0; j < DetailResponse.result.length; j++){
                                        if(DetailResponse.result[j].year === Jsondata[i].evaluationYear){DetailCount = DetailCount + 1;};
                                    };
                                    if(Jsondata[i].times > DetailCount){
                                        IsPrint = "是";
                                    };
                                    let sign = "";
                                    let DetailContent = "";
                                    for(let k = 0;k < DetailResponse.result.length; k++){
                                        if(k+1 === DetailResponse.result.length){sign = ""}else{sign = '\n'};
                                        if(DetailResponse.result[k].year === Jsondata[i].evaluationYear){
                                            DetailContent = DetailContent + (k+1) + "__" + DetailResponse.result[k].createTime + "__" + DetailResponse.result[k].projectName + "__" + DetailResponse.result[k].sectionName + "__" + DetailResponse.result[k].tenderee + "__" + DetailResponse.result[k].beginTime + sign;
                                        };
                                    };

                                    downData.push({"序号": i+1 ,
                                    "单位名称":Jsondata[i].companyName,
                                    "项目类型":Jsondata[i].projectTypeName,
                                    "单位资质":Jsondata[i].qualificationLevelName,
                                    "信用等级":Jsondata[i].level,
                                    "信用年份":Jsondata[i].evaluationYear.slice(-1) === "1" ? Jsondata[i].evaluationYear.slice(0,-1) + "上半年" : Jsondata[i].evaluationYear.slice(0,-1) + "下半年",
                                    "最近打印":IsPrint,
                                    "打印次数":Jsondata[i].times,
                                    "剩余次数":Jsondata[i].leftTimes,
                                    "详细情况":DetailContent
                                    });
                                };
                                ToExcel(downData);
                                button.text("获取");
                                button.prop("disabled", false);
                            })
                            .catch(err => {
                                console.log('请求出错:',err);
                            });
                        });
                        window.clearInterval(lpT);
                    };
                    },1000);
        };
    };
})();
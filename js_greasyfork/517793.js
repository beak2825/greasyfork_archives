// ==UserScript==
// @name         iris_extend
// @namespace    https://yc.dazd.cn/
// @version      0.0.17
// @description  A script for iris website.
// @author       dall
// @match        https://*.dalabs.cn/*
// @match        https://*.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517793/iris_extend.user.js
// @updateURL https://update.greasyfork.org/scripts/517793/iris_extend.meta.js
// ==/UserScript==

(function () {
    'use strict';
    down_cell_xls();
    //init_gui();

    // Your code here...
    function init_gui() {
        let list_data = get_by_data();
        let added_items = [];
        let item_tags = ``;
        for (let i = 0; i < list_data.length; i++) {
            if (i > 20) continue;
            let detail_data = get_detail_by_f_num(list_data[i].flowNum);
            if (added_items.includes(list_data[i].pathologyNo)) continue;
            let img_span = `<td>`
            for (let j = 0; j < detail_data.pictureFid.length; j++) {
                img_span += `<span><img class="show_img" src="https://iris.dalabs.cn/api/v1/file/file/showImg?tfsId=${detail_data.pictureFid[j].url}"></span>`;
            }
            item_tags += `<tr>
<td>${list_data[i].patientName}</td>
<td>${list_data[i].age} ${list_data[i].ageUnit}</td>
<td>${list_data[i].pathologyNo}</td>
<td>${detail_data.brefingText}</td>
<td>${detail_data.detail.length}</td>
<td>${detail_data.tissueNum}</td>
<td>${list_data[i].testItemName}</td>
${img_span}</td>
</tr>`
            added_items.push(list_data[i].pathologyNo);
        }
        let tb = `<table>
<thead>
<tr>
<th>姓名</th>
<th>年龄</th>
<th>病理号</th>
<th style="width: 300px">大体描述</th>
<th>组织部位</th>
<th>部位描述</th>
<th>检测项目</th>
<th>大体图</th>
</tr>
</thead>
<tbody>
${item_tags}
</tbody>
</table>`
        let s = `<style>
table {
        border-right: 1px solid #000000;
        border-bottom: 1px solid #000000;
        text-align: center;
    }
    
    table th {
        border-left: 1px solid #000000;
        border-top: 1px solid #000000;
    }
    
    table td {
        border-left: 1px solid #000000;
        border-top: 1px solid #000000;
    }
    .show_img{
        width: 100px;
    }
    .show_img:hover{
        width: 500px;
        height: 500px;
    }
</style>`
        document.head.insertAdjacentHTML('afterbegin', s);
        let root = `<div style="background: ghostwhite;width: 100%;position: relative;x;margin-top: 100px;margin-left: 100px">${tb}</div>`
        document.body.insertAdjacentHTML('afterbegin', root);
    }


    function get_by_data() {
        let data = {
            "branchCode": "BRAN_637233680047652864",
            "startDate": "2024-11-16 00:00:00",
            "endDate": "2024-11-16 00:00:00",
            "tagCodes": [
                "TAG_637792832629235712",
                "TAG_637793207499354112",
                "TAG_637793915904716800",
                "TAG_680474311142133760",
                "TAG_680480869792075776",
                "TAG_680481807583928320",
                "TAG_680482848819892224",
                "TAG_680482923394621440",
                "TAG_680483204803055616",
                "TAG_680483304925290496",
                "TAG_680483528968228864"
            ],
            "pageNumber": 1,
            "pageSize": 10000
        };
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/v1/pathology/q/test/getWBCDataInProcess", false);
        xhr.setRequestHeader("accept","application/json, text/plain, */*");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(window.sessionStorage._token).token);
        xhr.send(JSON.stringify(data));
        let res = JSON.parse(xhr.responseText);
        if (res.code !== 0) {
            alert("错误！");
            return null;
        } else {
            return res.data.dataList;
        }
    }

    function get_detail_by_f_num(f_num) {
        let data = {"flowNum": f_num};
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/v1/pathology/q/test/getWBCDataDetail", false);
        xhr.setRequestHeader("accept","application/json, text/plain, */*");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(window.sessionStorage._token).token);
        xhr.send(JSON.stringify(data));
        let res = JSON.parse(xhr.responseText);
        if (res.code !== 0) {
            return null
        } else {
            return res.data;
        }
    }
    
    function down_cell_xls(){
        let xhr=new XMLHttpRequest();
        xhr.open("GET","/api/v1/archive/q/dm/container/getBoxDetail?boxId=847132930376888320",false);
        xhr.setRequestHeader("accept","application/json, text/plain, */*");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + JSON.parse(window.sessionStorage._token).token);
        xhr.send();
        let data=JSON.parse(xhr.responseText).data;
        let res=['位置,姓名,医码通,样本条码,,位置,姓名,医码通,样本条码'];
        let x=1;
        let y=1;
        for(let i=0;i<data.sampleList.length;i++){
            if (i+1<=80){
                res.push(x+'_'+y+','+data.sampleList[i].patientName+','+data.sampleList[i].barcode+','+data.sampleList[i].barcode);
            }else{
                res[i-79]=res[i-79]+','+x+'_'+y+',,'+data.sampleList[i].patientName+','+data.sampleList[i].barcode+','+data.sampleList[i].barcode
            }
            if((i+1)%20==0){x+=1;y=1;}else{y+=1;}

        }
        let a=document.createElement('a');
        a.download='1.csv';
        let url=window.URL.createObjectURL(new Blob([res.join('\r\n')]));
        a.href=url;
        a.click();
    }

})();
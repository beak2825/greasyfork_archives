// ==UserScript==
// @name           重庆网上房地产-房源信息查询助手
// @name:en        CQ315House - Housing Info Query Assistant
// @name:zh        重庆网上房地产-房源信息查询助手
// @namespace      glasscp@163.com
// @version        0.1.9
// @description    重庆网上房地产-房源信息查询助手(仅供个人学习研究使用,任何公司或个人不得利用其从事违法经营活动)
// @description:en CQ315House - Housing information query assistant
// @author         Kerry
// @match          *://*.cq315house.com/HtmlPage/ShowRooms.html*
// @match          *://218.70.88.119/HtmlPage/ShowRooms.html*
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyODAyM2RjZC1jZjM3LTYyNDAtYTdjOC1hNTdlNjc0MWYxYzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjVBQTk2NTdCNEFBMTFFN0E2QzNFNDBFQUJDODVBNjgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjVBQTk2NTZCNEFBMTFFN0E2QzNFNDBFQUJDODVBNjgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTU0Y2E5ZjctZGNlOS0zMDRmLWE1YjAtZGY1ZGI1YTM2YmFjIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MmI5ZjY0N2EtNzViMi0xMWU3LTkzN2QtYzZiYTEwYjI0Y2VlIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+5kXnggAABLBJREFUeNrsm39oVlUYx9/pVGyZMGVhitofooaIrjBXSyV/QP5MmbJwGmItckIalflr4kjRIoomlUNR0CidpCIuN5UITeYP1kqEmq2NNNZWuaWzEvWd34d9Fw+H9937vtu9772vOwc+3N1z7z33PN/7nPOc87wsqaWlJdCVS5IVwApgBbACOFnSpn0SzW2jQRF4HPwMVoBSJ97fUPZqTPd380D0meBb8CRIBiNACVjuhQfEW4DXwGHwYIh+FIJtoPv9KIAY9TH40HjnHnBLneeBI+Ch+0mAvnRxPTj/A9lgMXgW/KGuPcchMsRoZzDYrXjBic4lu2z8UHAUPKbnKTAHlPP8DOcDuW8k60aBs7zvLOvSwYuGsJ/72QMy2Hlt/CUaW27cW8P7j6u6h8HXYEG4CObnIZDNzqepOglzT4HaMM/8DaaDT1Vdb7APrE2IOQBrAPkq6+mavdQlmQBngOsRmrjDueJ1EFT17zCC+FcAGN+Ls3qBqg6y4zK7342huQ/A8+CmqpvkWwFgfH8cToKFqroZzAIfdbBZCYfPgKu+DoMwXlZy58DTqvoKz0s62fx3YByoCHGtv+cCwPgpnNEfVdXn2ekfHPpIdfSEgyGizFLPBIDxuTh8xXjcVg5wrP7usKf+A7LAu0bfd4CtnbEjuQOGy7J2C3jDuCR1a4Bb+2uZUFeBKrBd7RneAsNADoVyzwNgfAoOXxrG3wZLsA1dDeKRXNgJpoImVTcXnAIDXBMAxg/kS2ar6mvSGRi+O867SllkjWcuIaCWyufQz7GOC4BG0zmp6cbFFTNg/DceJXN+oginVN0gmZTR31mOCYDG5vAlqar6expf5XFG6y8gkWi/qusJDqHfK6NpoN2UGBp5k5ObKZS4/Ykwz3ghxFBuqMwik+Vy9PVOTB4AI3qAIoadbmHW7PEs/cA0kMkNUrTlFVmMwZa+sQ6BveBldf6vh26ew3VFKYdiNRgexdD431uZa4hJgEKVqpKXT/BQAIk+m5k52slQtyLCM4vARbV+KIhJAIyZ02ykUhIYOL/goQDvgw0MfYWsi5QzrONwkZXq2+h/WcxRAA8V4/AEjr96PNPr+WYej8ciPYR+S+5hJo7vdXgpjIej3sNzSzxKVdUSSW3N50xdLyEKXFb3yY8jk+nav3HTUx3iFbIAW0dP+CyaPqH/Qcf3Au2UTGPHthH8SRfuqeo3BVqzwcXMFOUa7Wzm9S8M42WjdYHL3qBTnXYzKzzbWDm2lR7cxclXfynM9SLO+o3K+NP8u9mXKbEQRYz/BeQHWvP4uqTQ+AbO0EXGV+0TaP0JTcouijKO2aEmeo7vPaCRSYsGnkt+L8/YRU4EP/JcfhzR2d/RPEpW+AGj7YpEEOCwMr5t5tYClCnjA1ysrA2R8lrmZohxcwhcMc7NLJG5dq839ynxiLFuChCMsH+4G+H+QKILkBDFCmAFsAJYAbp0cWwhhJ2X7PKS2skJVkaI7bXxiv3WA6wAVgArgBXACtC5MJiFcDfGR3akxluAPJ9/2KAbQ6AqQbxaftGqccMDJH0ty7xHfGy8JEzzsSq9Ee0D9l9mrABWACuAFcAKYAWwAnTZck+AAQAW0kT67b3FTwAAAABJRU5ErkJggg==
// @require        https://cdn.staticfile.org/xlsx/0.18.5/xlsx.full.min.js
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_log
// @grant          GM_xmlhttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/444147/%E9%87%8D%E5%BA%86%E7%BD%91%E4%B8%8A%E6%88%BF%E5%9C%B0%E4%BA%A7-%E6%88%BF%E6%BA%90%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444147/%E9%87%8D%E5%BA%86%E7%BD%91%E4%B8%8A%E6%88%BF%E5%9C%B0%E4%BA%A7-%E6%88%BF%E6%BA%90%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
    'use strict';
    var websiteHost = window.location.host;//URL的主机部分:www.home.com
    var windowHref = window.location.href; //整个URL字符串(查询参数部分)
    var currentUrl = window.location.origin + window.location.pathname;
    var currentPath = window.location.pathname;//URL的路径部分(即文件地址)
    const RouteDataParas = {
        roomListPath: '/HtmlPage/ShowRooms.html',
        roomInfoWebSrvUrl: '../WebService/Handler.ashx?ac=fwxx1&fid=',//返回户室信息img
        projInfoWebSrvUrl: '../WebService/Handler.ashx?ac=xmxx&text=',//返回项目信息img
        projNameWebSrvUrl: '../WebService/Handler.ashx?ac=xmmc&text=',//返回项目名称img
        webSrvUrl: '../WebService/WebFormService.aspx',
        buildInfoXhr: '/GetBuildingInfo', //获取楼盘信息 {"buildingid":""}
        roomListXhr: '/GetRoomJson', //获取楼盘户室详细信息 {"buildingid":""}
        roomInfoXhr: '/GetRoomInfo', //获取指定户室Id的户室详细信息{"roomId":""}
    };
    const displayDataTypes = [
        {Key:'ROOMNO', Value:'房号'},
        {Key:'BAREA', Value:'建筑面积(㎡)'},
        {Key:'IAREA', Value:'套内面积(㎡)'},
        {Key:'NSJMJG', Value:'建面单价(元/㎡)'},
        {Key:'NSJG', Value:'套内单价(元/㎡)'},
        {Key:'TOTALPRC', Value:'总价(万元)'},
        {Key:'ROOMSTATUS', Value:'房屋状态'}
    ];
    var SELECTED_DATA_TYPE=displayDataTypes[0].Key;
    var vfObj = {
        totalCap: '房源共计：',
        unitCap: ' 套',
        utitlCap: '单元',
        rrmnoCap: '房      号：',
        rpurpCap: '用      途：',
        rstruCap: '结      构：',
        rTypeCap: '户      型：',
        rbareCap: '建筑面积：',
        riareCap: '套内面积：',
        runitCap: ' ㎡',
        ipricCap: '套内单价：',
        bpricCap: '建面单价：',
        punitCap: ' 元/㎡',
        tpricCap: '房屋总价：',
        tunitCap: ' 万元',
        tbId: '_mybuilding'
    };
    var statsObj = {
        totalCnt: 0, //楼幢房源总数量
        sellCnt: 0, //已销售(含已网签/或已交易完成不可售)数量
        subsCnt: 0, //已认购数量
        allowCnt: 0, //可销售数量
        rbareMin: 0, //建面Min
        rbareMax: 0, //建面Max
        riareMin: 0, //套内Min
        riareMax: 0, //套内Max
        ipricMin: 0, //套内单价Min
        ipricMax: 0, //套内单价Max
        bpricMin: 0, //建面单价Min
        bpricMax: 0, //建面单价Max
        tpricMin: 0, //总价Min
        tpricMax: 0, //总价Max
        apiMsg: '' //[GetRoomInfo]API返回的错误信息
    };
    //因项目信息img不显示需特别处理的个别楼盘的楼幢ID
    var resetProjectList = [
        {
            builIds: [
                '_Nvdyi0aqwdrr4_vEE1yEA','zNcayCnXbHNbZFjuqABcmQ','osf07q_u1SlnW2mnzzGvUA',
                'DXKShHLSXjcfVfRtR58JxQ','BMs2W/DG9tT0r87oOEcYgg','NpUcbqvhs_ww3ZtTIbA91g',
                'vGyPYgMczivXTpUVXkfrKQ','4ie6/iv0q5WuI3l2lXRkBw',
                'ILq22rFreTB0yhSAJX3p6Q','NpgsupKMSejJ3rnXbNE58A',
            ],
            emptyTxt: '和光尘樾 ',
        },
        {
            builIds: [
                'H85THYxtxAPc0_IJxfNfVg','dyEUO5of8VbFj_VWfAtYyA','_cn7Zrwf1VoQ57_h9BMCSQ',
                'X65zOBuwW7e4PPahVwf_cw','ooWKOieb/0QPEQUB_QHfSg','Et2mdSVordxUBVz56TPzyQ',
                '_iz10xgVDfQScg18sFJGnw','9nzRVN1z0Dl_coiB93SJhQ','0NvQtPMid86oWa4qysCj1Q',
                'ZNbLVyGZ1/XgjmaOSccJtA','sfJ7Me/eqY8MTuOk_kOEmw','HQRUsNsjeUld/Gd_PcSUcQ',
                'iexozwEMpb3jRZzLfoO00w','AdcGyoSzNKNQnF/7U9uTIA','ylFKWS5jiE54R0wXtCxzaQ',
                'LfR1GSc93ds44LsEP5Bw7w','Vwr/_Y2DptBHndpRXKMYVw','ow5QDChnWAKQS_9VR_kteQ',
                'ICAH7OA9N56h4FsqmJ2hvg',
            ],
            emptyTxt: ' 中粮·天悦壹号',
        },
    ];
    let cssText = `
        .spanRoomUse,.spanRoomStru,.spanRoomType,.spanRoombArea,
        .spanRoomiArea,.spanKfsNsjg,.spanKfsNsjmjg,.spanRoomState,
        .spanZxsp,.spanRoomNo,.spanRoomStatus,.spanRoomTotalPrice{display:none;}
        .tbtop1{cursor:pointer;}
        .tbtop2-td1{vertical-align:bottom;font-weight:600;}
        .tbtop2-td2{padding-left:20px;vertical-align:bottom;}
        .tbtop2-td3{padding-left:20px;vertical-align:top;}
        .div-open-title{margin-left:5px;margin-top:5px;height:40px;line-height:40px;cursor:pointer;padding-left:10px;}
        .project-name{margin-bottom:-5px;}
        .fold-project-name{padding:0 20px;}
        .div-lpsm{padding:10px 0 0 10px;}
        .div-datatype{margin:-1px 0 10px 5px;padding-left:10px;text-align:left;height:40px;line-height:40px;}
        .radio-inline:not(:first-child){margin-left:20px;}
        .radio-item{vertical-align:middle;margin-top:-2px;}
        .btn-excel:first-of-type{margin-left:30px;}
        .btn-excel:not(:first-of-type){margin-left:10px;}
        .btn-excel{height:25px;cursor:pointer;background-color:#fff;border:1px solid #fff;border-radius:4px;}
        .btn-excel:hover{background-color:#eee;border:1px solid #999;}
        .bg-orange{background-color:#ffa500!important;}/*[认购]状态橙色背景*/
        .color-black{color:#000;}
        .legend{display:inline-block;width:50px;margin-right:15px;}
        .legend-allow{background-color:#00ff00;}
        .legend-sell{background-color:#ff00ff;}
        .legend-subs{background-color:#ffa500;}
        .legend-unallow{background-color:#ffff00;}
        .fold-legend{margin-left:10px;padding:2px 10px;}
    `
    GM_addStyle(cssText);

    // cq315house[楼盘表]解析开始
    var cq315houseAnalysis={};

    //仅解析[楼盘表]页面:/HtmlPage/ShowRooms.html
    cq315houseAnalysis.judgeWebUrl=function(){
        if (currentUrl.indexOf(RouteDataParas.roomListPath)!=-1){
            return true;
        }
        return false;
    };
    //[楼盘表]页面相关元素初始化处理：
    // 1.增加[spanRoomNo]元素记录各cell的房屋房号信息
    // 2.增加[spanRoomStatus]元素记录各cell的房屋状态信息
    // 3.增加[spanRoomTotalPrice]元素记录各cell的房屋总价信息
    // 4.房号cell中a标签绑定[data-roomid]属性
    // 5.房号cell中a标签绑定[data-unitno]属性
    // 6.房号cell中a标签绑定[data-floorno]属性
    // 7.房号cell中a标签重置onclick事件
    // 8.头部增加相关统计信息元素
    cq315houseAnalysis.initShowRoomsPage=function(){
        //各房号cell设置
        let tb = document.getElementById(vfObj.tbId);
        if (tb == undefined) return;
        let tbRows = tb.tBodies[0].rows;
        let roomStatus = 'None';
        for (let i = tbRows.length - 1; i >= 0; i--) {
            let tbCells = tbRows[i].cells;
            let floorNo = tbRows[i].cells[1].getAttribute('value');//名义层
            for (let x = 0, len = tbCells.length; x < len; x++) {
                let objt = tbCells[x].getAttribute('objt');//房源Cell
                if (objt != 'tdclass') continue; //objt='tdclass'的cell是房源
                //房号信息span元素设置(新增)
                if (!tbCells[x].getElementsByClassName('spanRoomNo')[0]){
                    let spanRoomNo = document.createElement('span');
                    spanRoomNo.className='spanRoomNo';
                    spanRoomNo.innerText = `房号：${tbCells[x].getElementsByTagName("a")[0].innerText.trim()}`;
                    tbCells[x].appendChild(spanRoomNo);
                }
                //房屋状态信息span元素设置(新增)
                if (!tbCells[x].getElementsByClassName('spanRoomStatus')[0]){
                    let spanRoomStatus = document.createElement('span');
                    spanRoomStatus.className='spanRoomStatus';
                    spanRoomStatus.innerText = `房屋状态：${roomStatus}`;
                    tbCells[x].appendChild(spanRoomStatus);
                }
                //房屋总价信息span元素设置(新增)
                if (!tbCells[x].getElementsByClassName('spanRoomTotalPrice')[0]){
                    let spanRoomTotalPrice = document.createElement('span');
                    spanRoomTotalPrice.className='spanRoomTotalPrice';
                    let roomIarea = tbCells[x].getElementsByClassName('spanRoomiArea')[0].innerText.split('：')[1].toString().trim();//套内面积
                    let roomNsjg = tbCells[x].getElementsByClassName('spanKfsNsjg')[0].innerText.split('：')[1].toString().trim();//套内单价
                    let totalPrice = (Math.floor(((roomIarea * 1) * (roomNsjg * 1)/10000) * 100) / 100).toFixed(2);
                    spanRoomTotalPrice.innerText = `房屋总价：${totalPrice}`;
                    tbCells[x].appendChild(spanRoomTotalPrice);
                }
                //旧有的[状态]span元素初始化设置
                tbCells[x].getElementsByClassName('spanRoomState')[0].innerText = '详细状态：None';
                //旧有建面单价/套内单价信息span元素设置(格式化2位小数)
                let roomNsjg = tbCells[x].getElementsByClassName('spanKfsNsjg')[0].innerText.split('：')[1].toString().trim();//套内单价
                let roomNsjmjg = tbCells[x].getElementsByClassName('spanKfsNsjmjg')[0].innerText.split('：')[1].toString().trim();//建面单价
                tbCells[x].getElementsByClassName('spanKfsNsjg')[0].innerText = `套内拟售价格：${parseFloat(roomNsjg).toFixed(2)}`;
                tbCells[x].getElementsByClassName('spanKfsNsjmjg')[0].innerText = `建面拟售价格：${parseFloat(roomNsjmjg).toFixed(2)}`;
                //房号cell中alink重置
                let onclickValueParas = tbCells[x].getElementsByTagName('input')[0].getAttributeNode('onclick').nodeValue.match(/\{.*?\}/g);//获取input中onclick的传参
                let unitNo = onclickValueParas[0].match(/(?<=uid:\s).*?(?=,)/gi); //获取传参中的(uid)单元No
                let roomId = tbCells[x].getElementsByTagName('input')[0].value;//房号ID,记录在checkbox的value中
                let curAlink = tbCells[x].getElementsByTagName('a')[0];
                curAlink.setAttribute('data-roomid',roomId);//把房号ID绑定给自定义data-roomid属性
                curAlink.setAttribute('data-unitno',unitNo);//把单元No绑定给自定义data-unitno属性
                curAlink.setAttribute('data-floorno',floorNo);//把名义层No绑定给自定义data-floorno属性
                curAlink.className = 'color-black';
                curAlink.removeAttribute('onclick');//移除原始onclick事件
                curAlink.onclick=function(){cq315houseAnalysis.ShowRoomInfoByPass(this);};//alink重置onclick事件
                curAlink.removeAttribute('onmouseover');//移除原始onmouseover事件
                //初始化Title内容(和cq315原始保持一致)
                curAlink.title = '用      途：' + tbCells[x].getElementsByClassName('spanRoomUse')[0].innerText.split('：')[1].toString().trim() +
                                '\n结      构：' + tbCells[x].getElementsByClassName('spanRoomStru')[0].innerText.split('：')[1].toString().trim() +
                                '\n户      型：' + tbCells[x].getElementsByClassName('spanRoomType')[0].innerText.split('：')[1].toString().trim() +
                                '\n建筑面积：' + tbCells[x].getElementsByClassName('spanRoombArea')[0].innerText.split('：')[1].toString().trim() +
                                '\n套内面积：' + tbCells[x].getElementsByClassName('spanRoomiArea')[0].innerText.split('：')[1].toString().trim() +
                                '\n<a href=\"javascript:void(0);\">户室信息刷新</a>';
                curAlink.onmouseover = function() {cq315houseAnalysis.titleMouseOver(this);}//重新绑定onmouseover事件
                curAlink.onmouseout = function() {cq315houseAnalysis.titleMouseOut(this);}//重新绑定onmouseout事件
            }
        }
        // 头部增加相关统计信息元素
        // 1.1.[楼幢房源总数]元素设置
        let divTotalCntText = document.createElement('div');
        divTotalCntText.innerHTML=`【${getQueryString('block')}】${vfObj.totalCap}<span id="spanTotalCnt">${statsObj.totalCnt}</span>${vfObj.unitCap}`;
        let tbTop2FirstRow = document.getElementById('tbTop2').tBodies[0].rows[0];
        if (!tbTop2FirstRow.cells[1]) {
            let objTd = document.createElement('td');
            objTd.className = 'tbtop2-td1';
            objTd.appendChild(divTotalCntText);
            tbTop2FirstRow.appendChild(objTd);
        } else {
            tbTop2FirstRow.cells[1].innerHTML = '';
            tbTop2FirstRow.cells[1].appendChild(divTotalCntText);
        }
        // 1.2.楼幢单价，面积等区间数据元素设置
        let divDataRangeText = document.createElement('div');
        let bpricRange=`${vfObj.bpricCap}<span id="spanBpricMin">${statsObj.bpricMin}</span> ~ <span id="spanBpricMax">${statsObj.bpricMax}</span> ${vfObj.punitCap}`;
        let ipricRange=`${vfObj.ipricCap}<span id="spanIpricMin">${statsObj.ipricMin}</span> ~ <span id="spanIpricMax">${statsObj.ipricMax}</span> ${vfObj.punitCap}`;
        divDataRangeText.innerHTML = `${bpricRange}<br/>${ipricRange}`;
        if (!tbTop2FirstRow.cells[2]) {
            let objTd = document.createElement('td');
            objTd.className = 'tbtop2-td2';
            objTd.appendChild(divDataRangeText);
            tbTop2FirstRow.appendChild(objTd);
        } else {
            tbTop2FirstRow.cells[2].innerHTML = '';
            tbTop2FirstRow.cells[2].appendChild(divDataRangeText);
        }
        // 1.3.暂定显示API返回的错误信息
        let spanApiMsg = document.createElement('span');
        spanApiMsg.id='spanApiMsg';
        if (!tbTop2FirstRow.cells[3]) {
            let objTd = document.createElement('td');
            objTd.className = 'tbtop2-td3';
            objTd.appendChild(spanApiMsg);
            tbTop2FirstRow.appendChild(objTd);
        } else {
            tbTop2FirstRow.cells[3].innerHTML = '';
            tbTop2FirstRow.cells[3].appendChild(spanApiMsg);
        }
        // 2.[图例]table重置: 追加[认购]状态,追加各状态下的房源合计
        let tbTuliFirstRow = document.getElementById('tbTuli').tBodies[0].rows[0];
        tbTuliFirstRow.cells.innerHTML='';
        tbTuliFirstRow.cells[1].innerHTML=`<span class="legend legend-allow">&nbsp;</span>可销售: <span id="spanAllowCnt">${statsObj.allowCnt}</span>${vfObj.unitCap}`;
        tbTuliFirstRow.cells[2].innerHTML=`<span class="legend legend-sell">&nbsp;</span>已销售: <span id="spanSellCnt">${statsObj.sellCnt}</span>${vfObj.unitCap}`;
        tbTuliFirstRow.cells[3].innerHTML=`<span class="legend legend-subs">&nbsp;</span>已认购: <span id="spanSubsCnt">${statsObj.subsCnt}</span>${vfObj.unitCap}`;
        if (!tbTuliFirstRow.cells[4]) {
            let tdPlus = document.createElement('td');
            tbTuliFirstRow.appendChild(tdPlus);
        }
        tbTuliFirstRow.cells[4].innerHTML='<span class="legend legend-unallow">&nbsp;</span>不可售';
        // 3.[收起]div标签重置
        let tbTop1FirstRow = document.getElementById('tbTop1').tBodies[0].rows[0];
        tbTop1FirstRow.className = 'tbtop1';
        tbTop1FirstRow.onclick=function(){
            document.getElementById('titlesPan').style.display='none';
            document.getElementById('OpenTitleSpanDiv').style.display='block';
        };
        // 4.[展开]div标签重置
        let divOpenTitle = document.getElementById('OpenTitleSpanDiv');
        let spanFoldText=document.createElement('span');
        let spanFoldProjectName=document.createElement('span');
        let imgProjectName=document.createElement('img');
        let spanFoldCntInfo1=document.createElement('span');
        let spanFoldCntInfo2=document.createElement('span');
        let spanFoldTotalCnt=document.createElement('span');
        let spanFoldSellCnt=document.createElement('span');
        let spanFoldSubsCnt=document.createElement('span');
        let spanFoldAllowCnt=document.createElement('span');
        spanFoldTotalCnt.id='spanFoldTotalCnt';
        spanFoldAllowCnt.id='spanFoldAllowCnt';
        spanFoldSellCnt.id='spanFoldSellCnt';
        spanFoldSubsCnt.id='spanFoldSubsCnt';
        spanFoldAllowCnt.className='fold-legend legend-allow';
        spanFoldSellCnt.className='fold-legend legend-sell';
        spanFoldSubsCnt.className='fold-legend legend-subs';
        spanFoldAllowCnt.title='可销售';
        spanFoldSellCnt.title='已销售';
        spanFoldSubsCnt.title='已认购';
        divOpenTitle.innerHTML='';
        divOpenTitle.classList.add('div-open-title');
        divOpenTitle.removeAttribute('style');
        spanFoldText.innerText='展开';
        imgProjectName.setAttribute('src',document.getElementById('projectName_img').getAttribute('src'));
        imgProjectName.className = 'project-name';
        spanFoldProjectName.appendChild(imgProjectName);
        spanFoldProjectName.className = 'fold-project-name';
        spanFoldCntInfo1.innerText=`【${getQueryString('block')}】${vfObj.totalCap}`;
        spanFoldCntInfo2.innerText=`${vfObj.unitCap}`;
        spanFoldTotalCnt.innerText=`${statsObj.totalCnt}`;
        divOpenTitle.appendChild(spanFoldText);
        divOpenTitle.appendChild(spanFoldProjectName);
        divOpenTitle.appendChild(spanFoldCntInfo1);
        divOpenTitle.appendChild(spanFoldTotalCnt);
        divOpenTitle.appendChild(spanFoldCntInfo2);
        divOpenTitle.appendChild(spanFoldAllowCnt);
        divOpenTitle.appendChild(spanFoldSellCnt);
        divOpenTitle.appendChild(spanFoldSubsCnt);
        divOpenTitle.onclick=function(){
            document.getElementById('titlesPan').style.display='block';
            document.getElementById('OpenTitleSpanDiv').style.display='none';
        };
        divOpenTitle.click();
        //[楼盘说明]div标签CSS重置
        document.getElementById('lpsm').className = 'div-lpsm';
    };
    /**
     * 鼠标悬停显示TITLE
     * @params    obj        当前须生成悬停的标签
     */
    cq315houseAnalysis.titleMouseOver=function(obj) {
        //无TITLE悬停，直接返回
        if (typeof obj.title == 'undefined' || obj.title == '') return false;
        //不存在title_show标签则自动新建
        let titleShow = document.getElementById("title_show");
        if (titleShow == null) {
            titleShow = document.createElement("div"); //新建Element
            document.getElementsByTagName('body')[0].appendChild(titleShow); //加入body中
            let attrId = document.createAttribute('id'); //新建Element的id属性
            attrId.nodeValue = 'title_show'; //为id属性赋值
            titleShow.setAttributeNode(attrId); //为Element设置id属性
            let attrStyle = document.createAttribute('style'); //新建Element的style属性
            attrStyle.nodeValue = 'position:absolute;' //绝对定位
                + 'border:solid 1px #999; background:#fff;' //边框、背景颜色
                + 'border-radius:2px;box-shadow:0 0 2px #999;' //圆角、阴影
                + 'line-height:18px;' //行间距
                + 'font-size:12px; padding:2px 5px;' //字体大小、内间距
                + 'text-align:left;'//左对齐
                + 'white-space: pre;';//保持空格及折行
            try {
                titleShow.setAttributeNode(attrStyle); //为Element设置style属性
            } catch (e) {
                //IE Fix
                titleShow.style.position = 'absolute';
                titleShow.style.border = 'solid 1px #999';
                titleShow.style.background = '#fff';
                titleShow.style.lineHeight = '18px';
                titleShow.style.fontSize = '12px';
                titleShow.style.padding = '2px 5px';
                titleShow.style.textAlign = 'left';
                titleShow.style.whiteSpace = 'pre';
            }
        }
        //存储TITLE内容并清空原TITLE
        document.titleValue = obj.title;
        obj.title = '';
        //在title_show中显示TITEL内容，模拟TITLE悬停效果
        titleShow.innerHTML = document.titleValue;
        //针对批量获取楼盘表户室信息失败的房号
        //titleShow里绑定a链接标签,用户自行点击链接刷新当前房号户室信息
        let objAlink = titleShow.getElementsByTagName('a')[0];
        if (objAlink != undefined) {
            objAlink.onclick = function () {
                cq315houseAnalysis.getRoomStatus(obj.parentNode);
            };
        }
        //显示悬停效果DIV
        titleShow.style.display = 'block';
        //根据鼠标位置设定title_show标签悬停位置
        let e = window.event || arguments.callee.caller.arguments[0];
        let clientx = e.clientX;
        let clienty = e.clientY;
        let pagex = e.pageX;
        let pagey = e.pageY;
        if (!pagex) {
            pagex = clientx + (document.documentElement.scrollLeft || document.body.scrollLeft);
        }
        if (!pagey) {
            pagey = clienty + (document.documentElement.scrollTop || document.body.scrollTop);
        }
        //最左值为当前鼠标位置 与 body宽度减去悬停效果DIV宽度的最小值，否则将导致右端遮盖
        let left = Math.min(pagex, document.body.clientWidth - titleShow.clientWidth);
        //Top位置设定
        let topDown = 15; //下移15px避免遮盖当前标签
        let titelHeight = titleShow.offsetHeight;//TITEL div元素的高度
        let bodyHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);//body可视窗口高度
        let minHeight = Math.min(pagey + topDown + titelHeight, bodyHeight);
        let top = (minHeight >= bodyHeight) ? pagey - topDown - titelHeight : minHeight - titelHeight;
        // console.log('e.PageY:',pagey,'TitleTop:',top, 'TitleH:',titelHeight, 'BodyH:',bodyHeight, 'BrowserH:',window.innerHeight);
        titleShow.style.left = left + "px"; //设置title_show在页面中的X轴位置。
        titleShow.style.top = top + "px"; //设置title_show在页面中的Y轴位置。
    };
    /**
     * 鼠标离开隐藏TITLE
     * @params    obj        当前须生成悬停的标签
     */
    cq315houseAnalysis.titleMouseOut=function(obj) {
        let titleShow = document.getElementById("title_show");
        //不存在悬停标签则直接返回
        if (titleShow == null) return false;
        //存在悬停标签，则将TITLE内容还原给原[obj]标签
        obj.title = document.titleValue;
        //隐藏悬停标签DIV
        let e = window.event || arguments.callee.caller.arguments[0];//鼠标、键盘事件
        let clientx = e.clientX;
        let clienty = e.clientY;
        let pagex = e.pageX;
        let pagey = e.pageY;
        if (!pagex) {
            pagex = clientx + (document.documentElement.scrollLeft || document.body.scrollLeft);
        }
        if (!pagey) {
            pagey = clienty + (document.documentElement.scrollTop || document.body.scrollTop);
        }
        let x = pagex;
        let y = pagey;
        let divx1 = titleShow.offsetLeft;//左
        let divy1 = titleShow.offsetTop; //上
        let divx2 = titleShow.offsetLeft + titleShow.offsetWidth;//右
        let divy2 = titleShow.offsetTop + titleShow.offsetHeight;//下
        if (x < divx1 || x > divx2 || y < divy1 || y > divy2) {
            titleShow.style.display = "none";
        }
        titleShow.onmouseleave = function () {
            titleShow.style.display = "none";
        };
    };
    // [楼盘表]页面生成房源显示信息类别的Radio组
    cq315houseAnalysis.createRoomDataTypeContentBox=function(){
        let targentElement = document.getElementById('DivInfo');
        let parent = targentElement.parentNode;
        if (document.getElementById('datatype-text-box')) {
            document.getElementById('datatype-text-box').remove();
        }
        let divObj = document.createElement('div');
        divObj.id = 'datatype-text-box';
        divObj.className = 'modal-content';
        divObj.classList.add('div-datatype');
        let radios = '';
        for (let y = 0, len = displayDataTypes.length; y < len; y++) {
            let displayDataType = displayDataTypes[y];
            radios += '<label class="radio-inline">';
            if (y == 0) {
                radios += `<input type="radio" name="dataTypeRadioOptions" value="${displayDataType.Key}" class="radio-item" checked="true"> ${displayDataType.Value}`;
            } else {
                radios += `<input type="radio" name="dataTypeRadioOptions" value="${displayDataType.Key}" class="radio-item"> ${displayDataType.Value}`;
            }
            radios += '</label>';
        }
        radios += '<input type="button" name="btnExportExcel" value="导出Excel(简)" class="btn-excel">';
        radios += '<input type="button" name="btnExportExcelFull" value="导出Excel(详细)" class="btn-excel">';
        divObj.innerHTML = radios;
        parent.insertBefore(divObj, targentElement.nextSibling);
        //绑定事件
        let objRadio = document.getElementsByName('dataTypeRadioOptions');
        for (let i = 0, len = objRadio.length; i < len; i++) {
            objRadio[i].onchange = function(){cq315houseAnalysis.displaySeleTypeDatas();};
        }
        //绑定导出Excel按钮事件
        let objBtn = document.getElementsByName('btnExportExcel')[0];
        objBtn.onclick = function(){cq315houseAnalysis.exportExcel();};
        let objBtnFull = document.getElementsByName('btnExportExcelFull')[0];
        objBtnFull.onclick = function(){cq315houseAnalysis.exportExcelFull();};
    };
    //用户反映315house个别楼盘项目信息img不显示,单独修正之
    cq315houseAnalysis.resetProjectInfoImg=function(){
        let emptyTxt = '';
        let isResetProjectId = -1;
        for (let y = 0, len = resetProjectList.length; y < len; y++) {
            isResetProjectId = resetProjectList[y].builIds.indexOf(getQueryString('buildingid'));
            if (isResetProjectId > -1){
                emptyTxt = resetProjectList[y].emptyTxt;
                break;
            }
        }
        if (isResetProjectId <= -1) { console.log('Not need to reset project img.'); return; }
        //
        let buildId = getQueryString('buildingid');
        let ldNoTxt = getQueryString('block');
        let buildInfoUrl = `${RouteDataParas.webSrvUrl}${RouteDataParas.buildInfoXhr}`;
        let payload_data = {'buildingid': buildId}; //参数:楼幢ID
        let xhr = new XMLHttpRequest();
        xhr.open('POST', buildInfoUrl); //异步调用
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function (e) {
            if (xhr.status === 200) {
                // 返回的json数据结构: {"d":"{\"enterpriseName\":\"\",\"enterpriseOrgCode\":\"\",\"enterpriseDelegate\":\"\",\"projectName\":\"\",\"location\":\"\",\"presaleCert\":\"\"}"}
                let json = JSON.parse(xhr.responseText);
                let obj = JSON.parse(json.d);
                let projectNameText = json.d.match(/(?<=projectName\":\").*?(?=\")/gi);
                obj.projectName = projectNameText[0].replace(emptyTxt, '');//用户反映个别楼盘不显示项目信息img的修正
                obj.ldNo = ldNoTxt || ''; //追加[ldNo]属性(参数)
                let urlParams = JSON.stringify(obj);
                urlParams = escape(urlParams);
                // 项目信息相关img显示刷新
                document.getElementById('OpenTitleSpanDiv').getElementsByTagName("span")[1].getElementsByTagName("img")[0].setAttribute('src',`${RouteDataParas.projNameWebSrvUrl}${urlParams}`);
                document.getElementById('projectName_img').setAttribute('src',`${RouteDataParas.projNameWebSrvUrl}${urlParams}`);
                document.getElementById('projectInfo_img').setAttribute('src',`${RouteDataParas.projInfoWebSrvUrl}${urlParams}`);
            }
            else {
                console.log('Status Code:', xhr.status, buildId);
            }
        };
        xhr.onerror = function (e) {
            console.log('Status Code:', xhr.status, buildId);
        };
        //发送数据
        xhr.send(JSON.stringify(payload_data));
    };
    //重置各房号cell相关信息
    cq315houseAnalysis.resetRoomCellsInfo=function(){
        let tb = document.getElementById(vfObj.tbId);
        if (tb == undefined) return;
        let tbRows = tb.tBodies[0].rows;
        // 先列后行遍历 - 叠拼类房源统计要注意
        statsObj.totalCnt=0;
        statsObj.sellCnt=0;
        statsObj.subsCnt=0;
        statsObj.allowCnt=0;
        statsObj.apiMsg='';
        let tbCellCnt = tb.tBodies[0].rows[0].cells.length;
        let tbRowsCnt = tb.tBodies[0].rows.length;
        for (let x = 0; x < tbCellCnt; x++) {
            for (let i = 0; i < tbRowsCnt; i++) {
                let tbCell = tbRows[i].cells[x];
                let objt = tbCell.getAttribute('objt');//房源Cell
                if (objt != 'tdclass') {continue; } //objt='tdclass'的cell是房源
                //重新通过API获取房屋状态(异步)
                cq315houseAnalysis.getRoomStatus(tbCell);
                // 叠拼类房源的判定
                let isRowspan = tbCell.getAttribute('rowspan');
                if (isRowspan) i = i + isRowspan*1 - 1; //叠拼类房源1套会有多行,防止重复统计
            }
        }
    };
    //API异步获取指定roomid的户室详细信息
    cq315houseAnalysis.getRoomStatus = function (pTbCell) {
        let objRoomStatus = pTbCell.getElementsByClassName('spanRoomStatus')[0];
        let objRoomState = pTbCell.getElementsByClassName('spanRoomState')[0];
        let roomInfos = {
            roomId: pTbCell.getElementsByTagName('a')[0].getAttribute('data-roomid'),
            unitNo: pTbCell.getElementsByTagName('a')[0].getAttribute('data-unitno'),//单元No
            floorNo: pTbCell.getElementsByTagName('a')[0].getAttribute('data-floorno'),//名义层No
            roomNo: pTbCell.getElementsByClassName('spanRoomNo')[0].innerText.split('：')[1].toString().trim(),//房号
            roomUse: pTbCell.getElementsByClassName('spanRoomUse')[0].innerText.split('：')[1].toString().trim(),//用途
            roomStru: pTbCell.getElementsByClassName('spanRoomStru')[0].innerText.split('：')[1].toString().trim(),//结构
            roomType: pTbCell.getElementsByClassName('spanRoomType')[0].innerText.split('：')[1].toString().trim(),//户型
            roomBarea: pTbCell.getElementsByClassName('spanRoombArea')[0].innerText.split('：')[1].toString().trim(),//建面
            roomIarea: pTbCell.getElementsByClassName('spanRoomiArea')[0].innerText.split('：')[1].toString().trim(),//套内
            roomNsjg: pTbCell.getElementsByClassName('spanKfsNsjg')[0].innerText.split('：')[1].toString().trim(),//套内单价
            roomNsjmjg: pTbCell.getElementsByClassName('spanKfsNsjmjg')[0].innerText.split('：')[1].toString().trim(),//建面单价
            roomTotalPrice: pTbCell.getElementsByClassName('spanRoomTotalPrice')[0].innerText.split('：')[1].toString().trim(),//房屋总价
            roomStatus: pTbCell.getElementsByClassName('spanRoomStatus')[0].innerText.split('：')[1].toString().trim(),//房屋状态
            roomState: pTbCell.getElementsByClassName('spanRoomState')[0].innerText.split('：')[1].toString().trim(),//房屋详细状态
        };
        //
        let roomInfoUrl = `${RouteDataParas.webSrvUrl}${RouteDataParas.roomInfoXhr}`;
        let payload_data = {'roomId': roomInfos.roomId}; //参数:户室ID
        let xhr = new XMLHttpRequest();
        xhr.open('POST', roomInfoUrl); //异步调用
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function (e) {
            if (xhr.status === 200) {
                // 返回的json数据结构: {"d":"{\"dataType\":0,\"id\":\"28048786\",...,\"roomstatus\":\"已认购\"}"}
                let json = JSON.parse(xhr.responseText);
                let obj = JSON.parse(json.d);
                // 房屋状态信息保存至定义的[spanRoomStatus]元素中
                objRoomStatus.innerText = `房屋状态：${obj.roomstatus}`;
                objRoomState.innerText = `详细状态：${obj.S_ISONLINESIGN}/${obj.S_ISCONTRACT}/${obj.S_ISOTHERRIGHT}`;
                //API错误提示信息刷新清理
                let spanApiMsg = document.getElementById('spanApiMsg');
                if (spanApiMsg != undefined && spanApiMsg.innerText.trim() != '') {
                    let reg = new RegExp(`${roomInfos.unitNo}单元 ${roomInfos.roomNo}: 房源信息获取失败:\\s[\\d]{3};(\\n|\\r\\n)`);
                    let replMsg = spanApiMsg.innerText.replace(reg, '');
                    spanApiMsg.innerText = replMsg;
                }
                //
                // 异步时处理页面相关信息
                //
                let curStyle = window.getComputedStyle ? window.getComputedStyle(pTbCell, null) : pTbCell.currentStyle;
                let bgColor = curStyle.backgroundColor;//原始已销售#ff00ff rgb(255, 0, 255)
                let roomStatus = obj.roomstatus;//objRoomStatus.innerText.split('：')[1].toString().trim();//房屋状态
                if (roomStatus.indexOf('网签')!=-1) { statsObj.sellCnt++; statsObj.totalCnt++; }//已销售(网签)
                if (roomStatus.indexOf('不可售')!=-1 && bgColor=='rgb(255, 0, 255)') { statsObj.sellCnt++; statsObj.totalCnt++; }//已销售(不可售)
                if (roomStatus.indexOf('可售')!=-1 && roomStatus.indexOf('不可售')==-1) { statsObj.allowCnt++; statsObj.totalCnt++; }//可销售
                if (roomStatus.indexOf('认购')!=-1) { statsObj.subsCnt++; statsObj.totalCnt++; }//认购数量
                roomInfos.roomStatus = roomStatus;
                roomInfos.roomState = `${obj.S_ISONLINESIGN}/${obj.S_ISCONTRACT}/${obj.S_ISOTHERRIGHT}`;
                // 相关统计量显示刷新
                document.getElementById('spanTotalCnt').innerText = statsObj.totalCnt;
                document.getElementById('spanSellCnt').innerText = statsObj.sellCnt;
                document.getElementById('spanSubsCnt').innerText = statsObj.subsCnt;
                document.getElementById('spanAllowCnt').innerText = statsObj.allowCnt;
                document.getElementById('spanFoldTotalCnt').innerText = statsObj.totalCnt;
                document.getElementById('spanFoldSellCnt').innerText = statsObj.sellCnt;
                document.getElementById('spanFoldSubsCnt').innerText = statsObj.subsCnt;
                document.getElementById('spanFoldAllowCnt').innerText = statsObj.allowCnt;
                // 原始已销售#ff00ff,但其实是含有[认购]状态的
                // [认购]状态下房号Cell背景色重置
                if (roomStatus.indexOf('认购') != -1) {
                    pTbCell.classList.add('bg-orange'); //[认购]状态单独用橙色背景区分
                }
                // 房号cell中alink重新绑定title信息
                let curAlink = pTbCell.getElementsByTagName('a')[0];
                curAlink.title = cq315houseAnalysis.__bindTitle(roomInfos);
                curAlink.removeAttribute('onmouseover');//移除原始onmouseover事件
                curAlink.onmouseover = function() {cq315houseAnalysis.titleMouseOver(this);};//重新绑定onmouseover事件
                // 建面单价区间范围显示
                if (statsObj.bpricMin == 0) {
                    statsObj.bpricMin = roomInfos.roomNsjmjg * 1;
                } else if (parseFloat(roomInfos.roomNsjmjg * 1) > 0 && parseFloat(statsObj.bpricMin) > parseFloat(roomInfos.roomNsjmjg * 1)) {
                    statsObj.bpricMin = roomInfos.roomNsjmjg * 1;
                }
                if (parseFloat(statsObj.bpricMax) < parseFloat(roomInfos.roomNsjmjg * 1)) {
                    statsObj.bpricMax = roomInfos.roomNsjmjg * 1;
                }
                document.getElementById('spanBpricMin').innerText = statsObj.bpricMin.toFixed(2);
                document.getElementById('spanBpricMax').innerText = statsObj.bpricMax.toFixed(2);
                // 套内单价区间范围显示
                if (statsObj.ipricMin == 0) {
                    statsObj.ipricMin = roomInfos.roomNsjg * 1;
                } else if (parseFloat(roomInfos.roomNsjg * 1) > 0 && parseFloat(statsObj.ipricMin) > parseFloat(roomInfos.roomNsjg * 1)) {
                    statsObj.ipricMin = roomInfos.roomNsjg * 1;
                }
                if (parseFloat(statsObj.ipricMax) < parseFloat(roomInfos.roomNsjg * 1)) {
                    statsObj.ipricMax = roomInfos.roomNsjg * 1;
                }
                document.getElementById('spanIpricMin').innerText = statsObj.ipricMin.toFixed(2);
                document.getElementById('spanIpricMax').innerText = statsObj.ipricMax.toFixed(2);
            }
            else {
                console.log('Status Code:', xhr.status, roomInfos.roomId);
                let spanApiMsg = document.getElementById('spanApiMsg');
                spanApiMsg.innerText += `${roomInfos.unitNo}单元 ${roomInfos.roomNo}: 房源信息获取失败: ${xhr.status};\n`;
            }
        };
        xhr.onerror = function (e) {
            console.log('Status Code:', xhr.status, roomInfos.roomId);
            let spanApiMsg = document.getElementById('spanApiMsg');
            spanApiMsg.innerText += `${roomInfos.unitNo}单元 ${roomInfos.roomNo}: 房源信息获取失败: ${xhr.status};\n`;
        };
        //发送数据
        xhr.send(JSON.stringify(payload_data));
    };
    //依据选择的数据类别显示房源信息
    cq315houseAnalysis.displaySeleTypeDatas=function(){
        let checkedRadio = document.querySelector('input[name="dataTypeRadioOptions"]:checked');
        let dataType = checkedRadio.value;
        if (dataType==SELECTED_DATA_TYPE) return;
        SELECTED_DATA_TYPE = dataType;
        cq315houseAnalysis.refreshTableDatas();
    };
    //切换页面房源列表table的显示数据
    cq315houseAnalysis.refreshTableDatas=function(){
        let tb = document.getElementById(vfObj.tbId);
        if (tb == undefined) return;
        let tbRows = tb.tBodies[0].rows;
        for (let i = tbRows.length - 1; i >= 0; i--) {
            let tbCells = tbRows[i].cells;
            for (let x = 0, len = tbCells.length; x < len; x++) {
                let objt = tbCells[x].getAttribute('objt');//房源Cell
                if (objt != 'tdclass') continue; //objt='tdclass'的cell是房源
                let tdStyle = String(tbCells[x].getAttribute("style")).toLowerCase();//房源Cell的style内容
                if (tdStyle.indexOf("display:")!=-1 && tdStyle.indexOf("none")!=-1) continue; //隐藏的td不作处理
                let roomInfos = {
                    roomId: tbCells[x].getElementsByTagName('a')[0].getAttribute('data-roomid'),
                    unitNo: tbCells[x].getElementsByTagName('a')[0].getAttribute('data-unitno'),//单元No
                    floorNo: tbCells[x].getElementsByTagName('a')[0].getAttribute('data-floorno'),//名义层No
                    roomNo: tbCells[x].getElementsByClassName('spanRoomNo')[0].innerText.split('：')[1].toString().trim(),//房号
                    roomUse: tbCells[x].getElementsByClassName('spanRoomUse')[0].innerText.split('：')[1].toString().trim(),//用途
                    roomStru: tbCells[x].getElementsByClassName('spanRoomStru')[0].innerText.split('：')[1].toString().trim(),//结构
                    roomType: tbCells[x].getElementsByClassName('spanRoomType')[0].innerText.split('：')[1].toString().trim(),//户型
                    roomBarea: tbCells[x].getElementsByClassName('spanRoombArea')[0].innerText.split('：')[1].toString().trim(),//建面
                    roomIarea: tbCells[x].getElementsByClassName('spanRoomiArea')[0].innerText.split('：')[1].toString().trim(),//套内
                    roomNsjg: tbCells[x].getElementsByClassName('spanKfsNsjg')[0].innerText.split('：')[1].toString().trim(),//套内单价
                    roomNsjmjg: tbCells[x].getElementsByClassName('spanKfsNsjmjg')[0].innerText.split('：')[1].toString().trim(),//建面单价
                    roomTotalPrice: tbCells[x].getElementsByClassName('spanRoomTotalPrice')[0].innerText.split('：')[1].toString().trim(),//房屋总价
                    roomStatus: tbCells[x].getElementsByClassName('spanRoomStatus')[0].innerText.split('：')[1].toString().trim(),//房屋状态
                    roomState: tbCells[x].getElementsByClassName('spanRoomState')[0].innerText.split('：')[1].toString().trim(),//房屋详细状态
                };
                let curAlink = tbCells[x].getElementsByTagName('a')[0];
                switch (SELECTED_DATA_TYPE) {
                    case displayDataTypes[0].Key:
                        curAlink.innerText = roomInfos.roomNo;
                        break;
                    case displayDataTypes[1].Key:
                        curAlink.innerText = roomInfos.roomBarea;
                        break;
                    case displayDataTypes[2].Key:
                        curAlink.innerText = roomInfos.roomIarea;
                        break;
                    case displayDataTypes[3].Key:
                        curAlink.innerText = roomInfos.roomNsjmjg;
                        break;
                    case displayDataTypes[4].Key:
                        curAlink.innerText = roomInfos.roomNsjg;
                        break;
                    case displayDataTypes[5].Key:
                        curAlink.innerText = roomInfos.roomTotalPrice;
                        break;
                    case displayDataTypes[6].Key:
                        curAlink.innerText = roomInfos.roomStatus;
                        break;
                    default:
                        break;
                }
            }
        }
    };
    //绑定alink的tips(title显示文本)
    cq315houseAnalysis.__bindTitle=function(roomInfos) {
        let str = '房      号：' + roomInfos.unitNo + '单元 ' + roomInfos.roomNo +
            '\n用      途：' + roomInfos.roomUse +
            '\n结      构：' + roomInfos.roomStru +
            '\n户      型：' + roomInfos.roomType +
            '\n建筑面积：' + roomInfos.roomBarea + ' ㎡' +
            '\n套内面积：' + roomInfos.roomIarea + ' ㎡' +
            '\n建面单价：' + roomInfos.roomNsjmjg + ' 元/㎡' +
            '\n套内单价：' + roomInfos.roomNsjg + ' 元/㎡' +
            '\n房屋总价：' + roomInfos.roomTotalPrice + ' 万元' +
            '\n房屋状态：' + roomInfos.roomStatus +
            '\n详细状态：' + roomInfos.roomState;
            // '\n<a href=\"javascript:void(0);\">户室信息刷新</a>';
        return str;
    };
    //弹窗显示所点击房号的房源详细信息
    cq315houseAnalysis.ShowRoomInfoByPass=function(obj){
        let roomId = obj.getAttribute('data-roomid');
        if (document.getElementById('fRoomInfo')){
            document.getElementById('fRoomInfo').remove();
        }
        if (!document.getElementById('img-roominfo')){
            let imgObj = document.createElement('img');
            imgObj.id = 'img-roominfo';
            document.getElementById('myModalContent').appendChild(imgObj);
        }
        document.getElementById('img-roominfo').setAttribute('src',`${RouteDataParas.roomInfoWebSrvUrl}${roomId}`);
        document.getElementById('showDialog').click();
    };
    //将查询数据导出Excel
    cq315houseAnalysis.exportExcel=function(){
        //
        // use SheetJS js-xlsx: https://github.com/SheetJS/sheetjs
        //
        // 1.克隆[楼盘表]table的DOM元素,并进行删除span/input子元素处理(便于后续Excel导出)
        let tb = document.getElementById(vfObj.tbId).cloneNode(true);
        if (tb == undefined) return;
        const elemSpan = tb.querySelectorAll('td span');
        const elemInput = tb.querySelectorAll('td input');
        elemSpan.forEach(e => e.remove());
        elemInput.forEach(e => e.remove());

        let str=SELECTED_DATA_TYPE.slice(0,1).toUpperCase()+SELECTED_DATA_TYPE.slice(1).toLowerCase();
        let fileName = `ShowRooms-${str}.xlsx`;
        let dataTypeText=document.querySelector('input[name="dataTypeRadioOptions"]:checked').parentNode.innerText;

        // 2.创建新的workbook
        let wb = XLSX.utils.book_new();
        if(!wb.Props) wb.Props = {};
        wb.Props.Title = fileName;
        wb.Props.Subject = 'Export from web browser';
        wb.Props.Author = '房源信息查询助手';

        // 3.提取数据(通过table数据创建ws)
        let ws = XLSX.utils.table_to_sheet(tb, {raw:true, display:true});

        // 3.1.数据处理, 追加一个新行记录Excel创建日期(非必须)
        let dateTime = new Date(+new Date()+8*3600*1000);
        XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date(dateTime).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')]], {origin:-1});

        // 4.将创建的worksheet追加到workbook
        let wsName = 'ShowRooms';
        XLSX.utils.book_append_sheet(wb, ws, wsName);

        // 5.通过`writeFile`保存并下载 XLSX 文件
        XLSX.writeFile(wb, fileName);
    };

    //将查询楼幢所有户室详细数据导出Excel
    cq315houseAnalysis.exportExcelFull=function(){
        //
        // use SheetJS js-xlsx: https://github.com/SheetJS/sheetjs
        //
        let fileName = 'ShowRooms-Detail-Infos.xlsx';

        // 1.创建新的workbook
        let wb = XLSX.utils.book_new();
        if(!wb.Props) wb.Props = {};
        wb.Props.Title = fileName;
        wb.Props.Subject = 'Export from web browser';
        wb.Props.Author = '房源信息查询助手';

        // 2.提取楼幢户室详细数据(通过table详细数据创建ws)
        let blockTxt = getQueryString('block');
        let datas=[];
        datas.push(['楼幢号','名义层','单元','房号','户型','建面','套内','套内单价(元)','建面单价(元)','房屋总价(万元)','房屋状态','房屋详细状态']);
        let tb = document.getElementById(vfObj.tbId);
        if (tb == undefined) return;
        let tbRows = tb.tBodies[0].rows;
        let tbCellCnt = tb.tBodies[0].rows[0].cells.length;
        let tbRowsCnt = tb.tBodies[0].rows.length;
        // 先列后行遍历(先排楼层再排单元房号)
        for (let x = 0; x < tbCellCnt; x++) {
            for (let y = 0; y < tbRowsCnt; y++) {
                let tbCell = tbRows[y].cells[x];
                let objt = tbCell.getAttribute('objt');//房源Cell
                if (objt != 'tdclass') {continue; } //objt='tdclass'的cell是房源
                let tdStyle = String(tbCell.getAttribute("style")).toLowerCase();//房源Cell的style内容
                if (tdStyle.indexOf("display:")!=-1 && tdStyle.indexOf("none")!=-1) continue; //隐藏的td不作处理
                let roomInfos = {
                    roomId: tbCell.getElementsByTagName('a')[0].getAttribute('data-roomid'),
                    unitNo: tbCell.getElementsByTagName('a')[0].getAttribute('data-unitno'),//单元No
                    floorNo: tbCell.getElementsByTagName('a')[0].getAttribute('data-floorno'),//名义层No
                    roomNo: tbCell.getElementsByClassName('spanRoomNo')[0].innerText.split('：')[1].toString().trim(),//房号
                    roomUse: tbCell.getElementsByClassName('spanRoomUse')[0].innerText.split('：')[1].toString().trim(),//用途
                    roomStru: tbCell.getElementsByClassName('spanRoomStru')[0].innerText.split('：')[1].toString().trim(),//结构
                    roomType: tbCell.getElementsByClassName('spanRoomType')[0].innerText.split('：')[1].toString().trim(),//户型
                    roomBarea: tbCell.getElementsByClassName('spanRoombArea')[0].innerText.split('：')[1].toString().trim(),//建面
                    roomIarea: tbCell.getElementsByClassName('spanRoomiArea')[0].innerText.split('：')[1].toString().trim(),//套内
                    roomNsjg: tbCell.getElementsByClassName('spanKfsNsjg')[0].innerText.split('：')[1].toString().trim(),//套内单价
                    roomNsjmjg: tbCell.getElementsByClassName('spanKfsNsjmjg')[0].innerText.split('：')[1].toString().trim(),//建面单价
                    roomTotalPrice: tbCell.getElementsByClassName('spanRoomTotalPrice')[0].innerText.split('：')[1].toString().trim(),//房屋总价
                    roomStatus: tbCell.getElementsByClassName('spanRoomStatus')[0].innerText.split('：')[1].toString().trim(),//房屋状态
                    roomState: tbCell.getElementsByClassName('spanRoomState')[0].innerText.split('：')[1].toString().trim(),//房屋详细状态
                };
                //楼幢, 名义层, 单元, 房号, 户型, 建面, 套内, 套内单价, 建面单价, 房屋总价, 房屋状态, 房屋详细状态
                datas.push([blockTxt, roomInfos.floorNo, roomInfos.unitNo, roomInfos.roomNo, roomInfos.roomType, 
                    roomInfos.roomBarea, roomInfos.roomIarea, roomInfos.roomNsjg, roomInfos.roomNsjmjg, roomInfos.roomTotalPrice, 
                    roomInfos.roomStatus, roomInfos.roomState]);
            }
        }
        let ws = XLSX.utils.aoa_to_sheet(datas, {cellDates:true});

        // 2.1.数据处理, 追加一个新行记录Excel创建日期(非必须)
        let dateTime = new Date(+new Date()+8*3600*1000);
        XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date(dateTime).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')]], {origin:-1});

        // 3.将创建的worksheet追加到workbook
        let wsName = 'ShowRooms';
        XLSX.utils.book_append_sheet(wb, ws, wsName);

        // 4.通过`writeFile`保存并下载 XLSX 文件
        XLSX.writeFile(wb, fileName);
    };

    cq315houseAnalysis.start=function(){
        if (cq315houseAnalysis.judgeWebUrl()){
            cq315houseAnalysis.initShowRoomsPage();
            cq315houseAnalysis.createRoomDataTypeContentBox();
            cq315houseAnalysis.resetProjectInfoImg();
            cq315houseAnalysis.resetRoomCellsInfo();
        }
        // Easter Egg
        try {
            window.console && window.console.log && (
                console.log('%c\n当你挤地铁时，阿拉斯加的鳕鱼正跃出水面。\n当你看设计书时，大洋彼岸的海鸥正振翅掠过城市上方。\n当你被产品经理完虐时，极图的夜空散满了五彩斑斓。\n但是啊，别着急，\n当你为自己的未来努力奋斗时，\n那些你感觉从来不会看到的风景，\n那些你觉得终身不会遇到的人，\n你要的一切，\n正一步步向你走来。\n\n', 'color:green'),
                console.log(`%c${GM_info.script.name} Ver.${GM_info.script.version}:\n增加楼幢所有户室详细信息导出Excel功能;\n\n`, 'color:purple'),
                console.log('%c寻Python开发志同道合者\n油猴脚本地址：https://greasyfork.org/scripts/444147', 'color:red'))
        } catch (e) {}
    };

    cq315houseAnalysis.start();
})();
/**
 * 获取URL中指定名称的参数
 */
function getQueryString(key) {
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    let result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}
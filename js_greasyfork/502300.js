// ==UserScript==
// @name         Yearning-扩展面板
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  sellfox Yearning
// @author       WQL & LP
// @match        https://sql.meiyunji.net/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/502300/Yearning-%E6%89%A9%E5%B1%95%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/502300/Yearning-%E6%89%A9%E5%B1%95%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.username = '你的账号';
    window.password = '你的密码';
    setTimeout(function(){
        addPuidDIV();
    }, 100);
    async function eventDispatch(dom, event = 'input', value = null,time=1) {
        if (typeof dom === 'string') {
            dom = document.querySelector(dom);
        }
        if (dom) {
            if (event === 'input') {
                dom.value = value;
            }
            dom.dispatchEvent(new Event(event));
            await new Promise(resolve => setTimeout(resolve, 50*time));

        }

    };


    async function clickDom(dom,time=1) {
        if (typeof dom === 'string') {
            dom = document.querySelector(dom);

        }
        if (dom) {
            dom.click();
            await new Promise(resolve => setTimeout(resolve, 100*time));
        }

    };


    // 等待网页完成加载
    window.addEventListener('load', async function() {
        const URL = this.location.origin;
        if (location.href === `${URL}/#/login`) {
            let request;
            let response;

            request = await fetch(`${URL}/ldap`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json;charset=UTF-8",
                    "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\""
                },
                "referrer": `${URL}/`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": JSON.stringify({
                    "username": window.username,
                    "password": window.password
                }),
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            });

            response = await request.json();

            const token = response.token;

            // 要存储的数据对象
            const userData = {
                "hasGreet": "1",
                "real_name": "请重置你的真实姓名",
                "access": "1",
                "jwt": `Bearer ${token}`,
                "auth": "guest",
                "user": window.username
            };

            // 将对象的每个属性逐个存储到 sessionStorage 中
            for (const key in userData) {
                if (userData.hasOwnProperty(key)) {
                    sessionStorage.setItem(key, userData[key]);
                }
            }
            // this.location.href=`${URL}/#/home`
            history.replaceState(null, '', '/#/view/query');
            history.back();

            // 3. 前进到下一条记录
            history.forward();
            await new Promise(resolve => setTimeout(resolve, 1000));

        }

        if (window.location.href.endsWith('view/query')) {
            await clickDom(document.querySelector("div > div > div > div > ul > li:nth-child(3)"), 3);
            await clickDom(document.querySelector("div:nth-child(2) > div > div > div > ul.ivu-select-dropdown-list > li:nth-child(1)"), 2);
            eventDispatch(document.querySelector("form > div:nth-child(3) > div > div > textarea"), 'input', '1');
            await clickDom(document.querySelector("div:nth-child(4) > div > button"), 10);
        }
    }, false);
})();

// 设置分库数量
window.puidDbTotal=16;

function addPuidDIV() {
    var my = document.createElement("div");
    my.id='puid_div';
    my.style.position="fixed";
    my.style.top='14px';
    my.style.left= '40%';
    my.style['min-width']='30px';
    my.style['min-height']='10px';
    my.style['backgroundColor']="#fff";
    my.style['z-index']=10000;
    my.style['marge-top']='10px';
    my.style['padding']='4px';
    my.style['border-radius']='4px';
    my.style['display']='none';
    // 设置面板内容
    my.innerHTML= 'PUID:<input id="puid_text" style="width: 60px;" > <button onclick="showPuidDb();">转换</button> <span id="puid_db">共' + window.puidDbTotal + '个分库</span>   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        + ' 导出结果为<button onclick="exportPageResult(\'json\');">JSON</button> <button onclick="exportPageResult(\'xls\');">EXCEL</button> <button onclick="exportPageResult(\'csv\');">CSV</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        + ' <a onclick="javascript:document.getElementById(\'puid_div\').style.display=\'none\';document.getElementById(\'puid_div\').status=\'close\';" title="关闭面板" style="color: #979797;padding: 3px;">✕</a> ';
    document.body.appendChild(my);

    // 按下回车处理
    my.onkeydown = function(e) {
        e = e || event;
        if(e.keyCode == 13) {
            return showPuidDb();
        }
    }
    // 定时检查当前所处的页面，判断是否需要显示/隐藏面板
    setInterval(function () {
        var puidDiv = document.getElementById('puid_div');
        if(!puidDiv) {
            return;
        }
        if(puidDiv.status === 'close') {
            // 面板已关闭
            if(puidDiv.style.display !== 'none') {
                puidDiv.style.display = 'none';
            }
            return;
        }
        if(window.location.href.indexOf('/query_page') <= 0) {
            puidDiv.style.display='none';
        } else {
            puidDiv.style.display='block';
        }
    }, 100);
    // 定时处理代码框输入文字光标错乱问题(解决偶尔出现的问题)
    // setInterval(function(){var aceLines=document.getElementsByClassName('ace_line');for(let i=0;i<aceLines.length;i++){let a=aceLines[i];a.style.position='static';}},1000);
}

async function clickDom(dom,time = 1) {
    if (typeof dom === 'string') {
        dom = document.querySelector(dom);

    }
    if (dom) {
        dom.click();
        await new Promise(resolve => setTimeout(resolve, 100 * time));
    }

};
// 显示puid的所处分库的函数
window.showPuidDb = async function() {
    var puid = document.getElementById('puid_text').value;
    document.getElementById('puid_text').value = '';
    if(!puid) {
        document.getElementById('puid_db').innerHTML = 'puid不能为空!';
        return;
    }
    // trim
    puid = puid.replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
    // 验证正整数
    var r = /^\+?[1-9][0-9]*$/;
    if(!r.test(puid)) {
        document.getElementById('puid_db').innerHTML = 'puid必须为正整数!';
        return;
    }
    var dbNo = parseInt(window.md5(puid,32).substr(28,4), 16) % window.puidDbTotal;

    const sourceName = `sellfox_shard${dbNo}`
    await clickDom(document.querySelector("div > ul > li > ul > li > span"),6);

    const allSource = document.querySelectorAll("#test > div > div > div > div > div > div > div > div > div > div.ivu-cell-main > div.ivu-cell-title");

    for (const item of allSource) {
        // console.log(item.innerText + ': ' + sourceName);
        if (item.innerText === sourceName) {
           await clickDom(item, 3);
            const xiala = document.querySelector("li > ul:nth-child(4) > li > span.ivu-tree-arrow > i");
            await clickDom(xiala);
            const search = document.querySelector("div > div > ul > li > ul:nth-child(4) > li > span.ivu-tree-title");
            console.log(search);
            await clickDom(search);
        }
    }
    document.getElementById('puid_db').innerHTML = 'PUID[' + puid + ']在' + dbNo + '号库';
}

window.exportNowTime=0;
// 导出分页查询结果的网页数据, 可选导出格式：json、csv
window.exportPageResult = function (exportFormat) {
    if(!getTabQueryElement()) {
        myToast('请查询后再导出！');
        return;
    }
    if(new Date().getTime() - window.exportNowTime <= 3000) {
        myToast('有任务正在导出中，请稍后重试！');
        return;
    }
    window.exportNowTime=new Date().getTime();
    var dataList = new Array();
    var pageIndex = 0;
    var totalStr = getTabQueryElement().getElementsByClassName('ivu-page-total')[0].innerHTML;
    var totalNum = totalStr.length > 4 ? parseInt(totalStr.substring(2, totalStr.length-2)) : 0;
    if(!totalNum || totalNum <= 0) {console.log('无查询结果数据，请查询后再导出'); myToast('无查询结果数据，请查询有数据后再导出！');return;} else {console.log('总数量:' + totalNum);}
    var heads = getTableHeader();
    var pageItems = getTabQueryElement().getElementsByClassName('ivu-page-item');
    if(!pageItems || pageItems.length <= 0) { console.log('无分页数据，请先查询数据'); myToast('无查询分页数据，请查询有数据后再导出！');return; }
    myToast('开始导出，请暂时不要操作页面...', 3500)
    var len = parseInt(pageItems[pageItems.length-1].getAttribute('title'));
    var maxTime = 0;
    for(var i=0; i < len; i++) { // 将所有分页数据合并成一个数组
        var time = i * 500; maxTime = time;
        setTimeout(function() {
            var curIndex = ++pageIndex;
            var pageItems = getTabQueryElement().getElementsByClassName('ivu-page-item');
            var pageItem = false;
            for(var j=0; j < pageItems.length; j++) {
                var title = parseInt(pageItems[j].getAttribute('title'));
                if(title == curIndex) { pageItem = pageItems[j]; break; }
            }
            if(!pageItem) { console.log("错误！找不到页码："+ curIndex); return; }
            pageItem.click();
            setTimeout(function(){
                var datas = getTableData(heads);
                dataList = dataList.concat(datas);
                console.log("获取到" + (curIndex==len ? "结尾" : "") + "页码：" + curIndex + "，分页数据量：" + datas.length + "，总数据量：" + dataList.length);
                window.exportNowTime=new Date().getTime();
            }, 200);
            window.exportNowTime=new Date().getTime();
        }, time);
    }
    setTimeout(function () {
        window.exportNowTime=new Date().getTime();
        // 获取所有分页数据完成
        console.log('获取数据完成，结果共' + dataList.length + '条：');
        console.log(dataList);
        if(totalNum != dataList.length) {console.log('获取数据错误，请尝试重新导出'); return;}
        var exportName = 'query-' + getTabPaneElement().getElementsByClassName('ivu-tree-title')[0].innerText + "-"
        + (getTabPaneElement().getElementsByClassName('ivu-tree-title-selected').length>0 ? getTabPaneElement().getElementsByClassName('ivu-tree-title-selected')[0].innerText : "unkown") + "-"
        + Date.now();
        if(exportFormat == 'json') {
            // 下载为JSON文件
            downloadFile(JSON.stringify(dataList), exportName +'.json');
        } else {
            // 下载为csv文件
            var sep = ','; // CSV分隔符
            var content = '';
            for(var j=0; j<heads.length; j++) {
                if(j > 0) { content += sep; }
                content += toCsvText(heads[j]);
            }
            content += '\n';
            for(var i=0; i<dataList.length; i++) {
                for(var y=0; y<heads.length; y++) {
                    if(y > 0) { content += sep; }
                    content += toCsvText(dataList[i][heads[y]]);
                }
                content += '\n';
            }
            if(exportFormat == 'csv') {
                downloadFile(content, exportName +'.csv');
            } else {
                // 导出Excel操作 encodeURIComponent解决中文乱码
                const uri = "data:text/xls;charset=utf-8,\ufeff" + encodeURIComponent(content);
                // 通过创建a标签实现
                let link = document.createElement("a");
                link.href = uri;
                link.download = exportName + ".xls";
                link.click();
            }
        }
        window.exportNowTime=0;
        myToast('导出完成！');
        function toCsvText(str) {
            if(!str) {
                return str;
            }
            var k = (str.indexOf(",") >= 0 || str.indexOf("\n") >= 0);
            if(str.indexOf('"') >= 0) {
                str = str.replace(/"/g, '""');
                k = true;
            }
            if(k) {
                return '"' + str + '"';
            }
            return str;
        }
    }, maxTime + 2000);
    function getTableHeader() {
        var headers = new Array();
        var ths = getTabQueryElement().getElementsByClassName('ivu-table-fixed-header')[0].getElementsByTagName('tr')[0].getElementsByTagName('th');
        for(var i=0; i < ths.length; i++) {
            headers.push(ths[i].getElementsByTagName('span')[0].innerHTML);
        }
        return headers;
    }
    function getTableData(heads) {
        var datas = new Array();
        var trs = getTabQueryElement().getElementsByClassName('ivu-table-fixed-body')[0].getElementsByTagName('tr');
        for(var i=0; i < trs.length; i++) {
            var data = new Object();
            var tds = trs[i].getElementsByTagName('td');
            for(var j=0; j < tds.length; j++) {
                data[heads[j]] = tds[j].getElementsByTagName('div')[0].getElementsByTagName('span')[0].innerHTML;
            }
            datas.push(data)
        }
        return datas;
    }
    function getTabPaneElement() {
        var tabpanes = document.getElementsByClassName('ivu-tabs-tabpane');
        for(var i=0; i < tabpanes.length; i++) {
            if(tabpanes[i].style.visibility == 'visible' && tabpanes[i].getElementsByClassName('ivu-row').length>0) {
                return tabpanes[i];
            }
        }
        return null;
    }
    function getTabQueryElement() {
        var tabpane = getTabPaneElement();
        if(!tabpane) return null;
        var tabquerys = tabpane.getElementsByClassName('ivu-tabs-tabpane');
        for(var i=0; i < tabquerys.length; i++) {
            if(tabquerys[i].style.visibility == 'visible') {
                return tabquerys[i];
            }
        }
        return null;
    }
    function downloadFile(content, filename) {
        if(!filename) {filename = 'file_' + Date.now() + '.txt';}
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// toast提示
window.myToast=function(msg,duration){duration=isNaN(duration)?2000:duration;var m=document.createElement('div');m.innerHTML=msg;m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";document.body.appendChild(m);setTimeout(function(){var d=0.5;m.style.webkitTransition='-webkit-transform '+d+'s ease-in, opacity '+d+'s ease-in';m.style.opacity='0';setTimeout(function(){document.body.removeChild(m)},d*1000);},duration);}

// 计算md5
window.md5=function(string,bit){function md5_RotateLeft(lValue,iShiftBits){return(lValue<<iShiftBits)|(lValue>>>(32-iShiftBits));}
                                function md5_AddUnsigned(lX,lY){var lX4,lY4,lX8,lY8,lResult;lX8=(lX&0x80000000);lY8=(lY&0x80000000);lX4=(lX&0x40000000);lY4=(lY&0x40000000);lResult=(lX&0x3FFFFFFF)+(lY&0x3FFFFFFF);if(lX4&lY4){return(lResult^0x80000000^lX8^lY8);}
                                                                if(lX4|lY4){if(lResult&0x40000000){return(lResult^0xC0000000^lX8^lY8);}else{return(lResult^0x40000000^lX8^lY8);}}else{return(lResult^lX8^lY8);}}
                                function md5_F(x,y,z){return(x&y)|((~x)&z);}
                                function md5_G(x,y,z){return(x&z)|(y&(~z));}
                                function md5_H(x,y,z){return(x^y^z);}
                                function md5_I(x,y,z){return(y^(x|(~z)));}
                                function md5_FF(a,b,c,d,x,s,ac){a=md5_AddUnsigned(a,md5_AddUnsigned(md5_AddUnsigned(md5_F(b,c,d),x),ac));return md5_AddUnsigned(md5_RotateLeft(a,s),b);};function md5_GG(a,b,c,d,x,s,ac){a=md5_AddUnsigned(a,md5_AddUnsigned(md5_AddUnsigned(md5_G(b,c,d),x),ac));return md5_AddUnsigned(md5_RotateLeft(a,s),b);};function md5_HH(a,b,c,d,x,s,ac){a=md5_AddUnsigned(a,md5_AddUnsigned(md5_AddUnsigned(md5_H(b,c,d),x),ac));return md5_AddUnsigned(md5_RotateLeft(a,s),b);};function md5_II(a,b,c,d,x,s,ac){a=md5_AddUnsigned(a,md5_AddUnsigned(md5_AddUnsigned(md5_I(b,c,d),x),ac));return md5_AddUnsigned(md5_RotateLeft(a,s),b);};function md5_ConvertToWordArray(string){var lWordCount;var lMessageLength=string.length;var lNumberOfWords_temp1=lMessageLength+8;var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1%64))/64;var lNumberOfWords=(lNumberOfWords_temp2+1)*16;var lWordArray=Array(lNumberOfWords-1);var lBytePosition=0;var lByteCount=0;while(lByteCount<lMessageLength){lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=(lWordArray[lWordCount]|(string.charCodeAt(lByteCount)<<lBytePosition));lByteCount++;}
lWordCount=(lByteCount-(lByteCount%4))/4;lBytePosition=(lByteCount%4)*8;lWordArray[lWordCount]=lWordArray[lWordCount]|(0x80<<lBytePosition);lWordArray[lNumberOfWords-2]=lMessageLength<<3;lWordArray[lNumberOfWords-1]=lMessageLength>>>29;return lWordArray;};function md5_WordToHex(lValue){var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;for(lCount=0;lCount<=3;lCount++){lByte=(lValue>>>(lCount*8))&255;WordToHexValue_temp="0"+lByte.toString(16);WordToHexValue=WordToHexValue+WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);}
return WordToHexValue;};function md5_Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
                                                        return utftext;};var x=Array();var k,AA,BB,CC,DD,a,b,c,d;var S11=7,S12=12,S13=17,S14=22;var S21=5,S22=9,S23=14,S24=20;var S31=4,S32=11,S33=16,S34=23;var S41=6,S42=10,S43=15,S44=21;string=md5_Utf8Encode(string);x=md5_ConvertToWordArray(string);a=0x67452301;b=0xEFCDAB89;c=0x98BADCFE;d=0x10325476;for(k=0;k<x.length;k+=16){AA=a;BB=b;CC=c;DD=d;a=md5_FF(a,b,c,d,x[k+0],S11,0xD76AA478);d=md5_FF(d,a,b,c,x[k+1],S12,0xE8C7B756);c=md5_FF(c,d,a,b,x[k+2],S13,0x242070DB);b=md5_FF(b,c,d,a,x[k+3],S14,0xC1BDCEEE);a=md5_FF(a,b,c,d,x[k+4],S11,0xF57C0FAF);d=md5_FF(d,a,b,c,x[k+5],S12,0x4787C62A);c=md5_FF(c,d,a,b,x[k+6],S13,0xA8304613);b=md5_FF(b,c,d,a,x[k+7],S14,0xFD469501);a=md5_FF(a,b,c,d,x[k+8],S11,0x698098D8);d=md5_FF(d,a,b,c,x[k+9],S12,0x8B44F7AF);c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);a=md5_GG(a,b,c,d,x[k+1],S21,0xF61E2562);d=md5_GG(d,a,b,c,x[k+6],S22,0xC040B340);c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);b=md5_GG(b,c,d,a,x[k+0],S24,0xE9B6C7AA);a=md5_GG(a,b,c,d,x[k+5],S21,0xD62F105D);d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);b=md5_GG(b,c,d,a,x[k+4],S24,0xE7D3FBC8);a=md5_GG(a,b,c,d,x[k+9],S21,0x21E1CDE6);d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);c=md5_GG(c,d,a,b,x[k+3],S23,0xF4D50D87);b=md5_GG(b,c,d,a,x[k+8],S24,0x455A14ED);a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);d=md5_GG(d,a,b,c,x[k+2],S22,0xFCEFA3F8);c=md5_GG(c,d,a,b,x[k+7],S23,0x676F02D9);b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);a=md5_HH(a,b,c,d,x[k+5],S31,0xFFFA3942);d=md5_HH(d,a,b,c,x[k+8],S32,0x8771F681);c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);a=md5_HH(a,b,c,d,x[k+1],S31,0xA4BEEA44);d=md5_HH(d,a,b,c,x[k+4],S32,0x4BDECFA9);c=md5_HH(c,d,a,b,x[k+7],S33,0xF6BB4B60);b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);d=md5_HH(d,a,b,c,x[k+0],S32,0xEAA127FA);c=md5_HH(c,d,a,b,x[k+3],S33,0xD4EF3085);b=md5_HH(b,c,d,a,x[k+6],S34,0x4881D05);a=md5_HH(a,b,c,d,x[k+9],S31,0xD9D4D039);d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);b=md5_HH(b,c,d,a,x[k+2],S34,0xC4AC5665);a=md5_II(a,b,c,d,x[k+0],S41,0xF4292244);d=md5_II(d,a,b,c,x[k+7],S42,0x432AFF97);c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);b=md5_II(b,c,d,a,x[k+5],S44,0xFC93A039);a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);d=md5_II(d,a,b,c,x[k+3],S42,0x8F0CCC92);c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);b=md5_II(b,c,d,a,x[k+1],S44,0x85845DD1);a=md5_II(a,b,c,d,x[k+8],S41,0x6FA87E4F);d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);c=md5_II(c,d,a,b,x[k+6],S43,0xA3014314);b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);a=md5_II(a,b,c,d,x[k+4],S41,0xF7537E82);d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);c=md5_II(c,d,a,b,x[k+2],S43,0x2AD7D2BB);b=md5_II(b,c,d,a,x[k+9],S44,0xEB86D391);a=md5_AddUnsigned(a,AA);b=md5_AddUnsigned(b,BB);c=md5_AddUnsigned(c,CC);d=md5_AddUnsigned(d,DD);}
                                if(bit==32){return(md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();}
                                return(md5_WordToHex(b)+md5_WordToHex(c)).toLowerCase();}


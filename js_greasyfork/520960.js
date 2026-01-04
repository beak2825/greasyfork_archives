// ==UserScript==
// @name         慢病监测和死亡监测审卡
// @version      1.0.31
// @namespace    http://tampermonkey.net/
// @description  用于台州慢病监测和死亡辅助审核
// @author       hxsfb
// @match        http://172.16.8.7:82/tzmb*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8.7
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/520960/%E6%85%A2%E7%97%85%E7%9B%91%E6%B5%8B%E5%92%8C%E6%AD%BB%E4%BA%A1%E7%9B%91%E6%B5%8B%E5%AE%A1%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/520960/%E6%85%A2%E7%97%85%E7%9B%91%E6%B5%8B%E5%92%8C%E6%AD%BB%E4%BA%A1%E7%9B%91%E6%B5%8B%E5%AE%A1%E5%8D%A1.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 创建显示区域
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 100px;
      right: 0px;
      z-index: 9999;
      background-color: #f0f0f0;
      border-radius: 2px;
      padding: 2px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      cursor: move;
  `;
    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = `
      margin-top: 0px;
      max-width: 400px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;

    //姓名
    const name = document.createElement('div');
    name.style.cssText = `
      margin-top: 0px;
      max-width: 400px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;

    //身份证校验结果
    const sfjyjg = document.createElement('div');
    sfjyjg.style.cssText = `
      margin-top: 0px;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;

    //报卡原现地址结果
    const bkyxdz = document.createElement('div');
    bkyxdz.style.cssText = `
      margin-top: 0px;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;

    //提交
    const tj=document.createElement('button');
    tj.innerText = "保 存";
    tj.addEventListener("click",function(){document.forms[0].submit()});
    tj.style.cssText = `
    width:160;
    height:30;
  `;
    container.appendChild(resultDiv);
    container.appendChild(name);
    container.appendChild(bkyxdz);
    container.appendChild(sfjyjg);

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝通用函数区域＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //身份证逻辑校验
    function checkid(sfzh){
        var arr2=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
        var arr3=[1,0,'X',9,8,7,6,5,4,3,2];
        var t=sfzh;
        if(t.length==18){
            var arr=t.split('');
            var s;
            var reg = /^\d+$/;
            var pd=0;
            for(var i=0;i<17;i++){
                if(reg.test(arr[i])){
                    s=true;
                    pd=arr[i]*arr2[i]+pd;
                }else{
                    s=false;
                    break;
                }
            }
            if(s=true){
                var r=pd%11;
                if(arr[17]==arr3[r]){
                    return true;
                }else{
                    return false;
                }
            }

        }else{
            document.getElementById("show").innerHTML="非合法身份证号";
        }
    }
    //身份校验信息，获取公安地址函数
    let sfjyxx;
    function queryIdcardInfo(path,cardId,vcxm,dom) {
        $.ajax({
            url: path +"?formOp=queryIdcardInfo",
            type: "post",
            dataType: "json",
            async: false,
            data: $(document.forms[0]).serialize(),//setDataParm(xm,zjhm)
            success:function (data) {
                sfjyjg.textContent=data.replace("匹配成功，此人","公安");
                console.log("校验信息："+data);
                alert("校验信息："+data);
                sfjyxx=data;
            }
        });
    }


    //身份信息检验2,获取公安地址
    function queryIdcardInfo2(path,cardId,vcxm,dom,domxm,domdz) {
        $.ajax({
            url: path +"?formOp=queryIdcardInfo",
            type: "post",
            dataType: "json",
            async: false,
            data: $(document.forms[0]).serialize(),//setDataParm(xm,zjhm)
            success:function (data) {
                sfjyjg.textContent=data.replace("匹配成功，此人","公安");
                //console.log("校验信息："+data);
                sfjyxx=data;
                console.log("校验信息："+sfjyxx)
                //校验信息：身份证和姓名不匹配，此人姓名：李宗仙
                if (sfjyxx.includes('身份证和姓名不匹配')){
                    document.getElementsByName(domxm)[0].value=sfjyxx.slice(15);
                    name.textContent=name.textContent+"，有误,已更正为:"+sfjyxx.slice(15);
                    //更正后再次查询
                    queryIdcardInfo2(path,cardId,vcxm,dom,domxm,domdz);
                }else if(sfjyxx.includes('临海市')){
                    document.getElementsByName(domdz)[0].value=sfjyxx.slice(13);
                }else{
                    name.textContent=name.textContent+"，与公安一致";
                }
            }
        });
    }


    //肿瘤公安地址获取
    function dygafu(){
        var carid=document.all("model.zjjkZlHzxx.vcSfzh").value;
        var vcxm=document.all("model.zjjkZlHzxx.vcHzxm").value;
        var vcBgkid=document.all("model.vcBgkid").value;
        ZjjkTnbBgkManager.queryIdcardInfo(vcBgkid,carid,vcxm,'331082006',{
            callback: function (data){
                queryIdcardInfoS(data);
                alert("校验信息："+data);
            },
            async: false
        });
    }
    function dygafu2(){
        var carid=document.all("model.zjjkZlHzxx.vcSfzh").value;
        var vcxm=document.all("model.zjjkZlHzxx.vcHzxm").value;
        var vcBgkid=document.all("model.vcBgkid").value;
        ZjjkTnbBgkManager.queryIdcardInfo(vcBgkid,carid,vcxm,'331082006',{
            callback: function (data){
                queryIdcardInfoS(data);
            },
            async: false
        });
    }
    function queryIdcardInfoS(data) {
        // document.all('model.dtSfzjyxx').value = data;
        //  var input = document .getElementById("model.dtSfzjyxx");
        //  input.select();//选中文本
        //  document.execCommand("copy");
        //  alert("校验信息："+data);
        sfjyjg.textContent=data.replace("匹配成功，此人","公安");
        //console.log("校验信息："+data);
        sfjyxx=data;
        //校验信息：身份证和姓名不匹配，此人姓名：李宗仙
        if (sfjyxx.includes('身份证和姓名不匹配')){
            document.getElementsByName('model.zjjkZlHzxx.vcHzxm')[0].value=sfjyxx.slice(20);
            name.textContent=name.textContent+"姓名不匹配,姓名已更正为:"+sfjyxx.slice(20);
        }else if(sfjyxx.includes('临海市')){
            document.getElementsByName('model.zjjkZlHzxx.vcHkxxdz')[0].value=sfjyxx.slice(13);
        }else{
            name.textContent=name.textContent+"，与公安一致";
        }
    }

    //判定地址数字开始的地方  65296 65305
    function isCharInRange(char, startRange, endRange) {
        for(i=0;i<char.length;i++){
            const charCode = char[i].charCodeAt(0);
            if( startRange <= charCode && charCode <= endRange){
                return i;
                break;
            }
        }
    }

    //日期选择函数
    function rq(data){
        document.all(data).type="date";
        document.all(data).style="width:120px";
    }

    //====================通用变量区域====================
    //当时时间和年份
    const now=new Date();
    const currentYear=now.getFullYear();
    //临海市19镇街道对应编码
    var zjbm=['33108201','33108202','33108203','33108204','33108205',"33108231","33108232","33108234","33108235","33108236","33108237","33108238","33108239","33108240","33108241","33108242","33108243","33108244","33108245"]
    //临海市19个镇街道名称
    var jdmc=['古城街道','大洋街道','江南街道','大田街道','邵家渡街道','汛桥镇','东塍镇','汇溪镇','小芝镇','河头镇','白水洋镇','括苍镇','永丰镇','尤溪镇','涌泉镇','沿江镇','杜桥镇','上盘镇','桃渚镇']
    //管理单位编码
    var gldwbm=['331082034','331082031','331082028','331082012','331082027','331082000','331082033','331082010','331082025','331082023','331082007','331082014','331082016','331082020','331082015','331082017','331082019','331082036','331082021']
    //获取网页址
    var urlInfos = window.location.href.split("/");



    //====================起始页面，报告卡查询按====================
    if(urlInfos[4].includes('loginValidateAction.do')){

        const container = document.createElement('tr');
        container.bgcolor="#E0E0E0";
        //空格
        const kg1 = document.createElement('td');
        kg1.width="17";
        const kg2 = document.createElement('td');
        kg2.width="17";
        const kg3 = document.createElement('td');
        kg3.width="17";

        // 创建糖尿病
        var tnb = document.createElement("a");
        tnb.href = "http://172.16.8.7:82/tzmb/ZjjkTnbBgkAction.do?formOp=pageForward&pageName=bgkglqs";
        tnb.innerText = "糖尿病";
        tnb.target="_blank";
        tnb.style.cssText = ` font-size: 24px;`;
        // 创建肿瘤
        var zl = document.createElement("a");
        zl.href = "http://172.16.8.7:82/tzmb/ZjjkZlBgkqxAction.do?formOp=query";
        zl.innerText = "肿瘤";
        zl.target="_blank";
        zl.style.cssText = ` font-size: 24px;`;

        // 创建心脑血管
        var xnxg = document.createElement("a");
        xnxg.href = "http://172.16.8.7:82/tzmb/ZjjkXnxgBgkAction.do?formOp=query";
        xnxg.innerText = "心脑血管";
        xnxg.target="_blank";
        xnxg.style.cssText = ` font-size: 24px;`;

        // 创建生命统计
        var sw = document.createElement("a");
        sw.href = "http://172.16.8.7:82/tzmb/ZjmbSwBgkqxAction.do?formOp=query";
        sw.innerText = "生命统计";
        sw.target="_blank";
        sw.style.cssText = ` font-size: 24px;`;

        container.appendChild(tnb);
        container.appendChild(kg1);
        container.appendChild(zl);
        container.appendChild(kg2);
        container.appendChild(xnxg);
        container.appendChild(kg3);
        container.appendChild(sw);
        document.getElementsByTagName('td')[26].append(container);



        // ====================批量修改 ====================
        const container1 = document.createElement('tr');
        container1.style.cssText = `
      position: fixed;
      top: 310px;
      right: 20px;
      z-index: 9999;
      background-color: #f0f0f0;
      border-radius: 2px;
      padding: 2px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      cursor: move;
  `;

        const resultDiv1 = document.createElement('div');
        resultDiv1.style.cssText = `
      margin-top: 0px;
      max-width: 400px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;
        const tj1=document.createElement('button');
        tj1.innerText = "开始批量修改";
        tj1.style.cssText = `
    width:160;
    height:30;
  `;

        const qk1=document.createElement('button');
        qk1.innerText = "重 置";
        qk1.style.cssText = `
    width:160;
    height:30;
  `;

        const dk=document.createElement('button');
        dk.innerText = "批量打开审卡";
        dk.style.cssText = `
    width:160;
    height:30;
  `;

        function addRadioButton(name, value, labelText) {
            // 创建一个input元素
            var radio = document.createElement('input');
            // 设置type为radio
            radio.type = 'radio';
            // 设置name属性，使其属于同一组
            radio.name = name;
            // 设置value，用于提交表单时的值
            radio.value = value;
            // 设置id，可以用于CSS或JavaScript的引用
            radio.id = 'radio_' + value;

            // 将单选按钮添加到页面的某个部分
            container1.appendChild(document.createElement('tr'));
            container1.appendChild(radio);
            // 创建一个标签并添加到按钮后面
            container1.appendChild(document.createTextNode(labelText));
            container1.appendChild(document.createElement('tr'));
        }

        container1.appendChild(resultDiv1);
        // 添加心脑血管、肿瘤、糖尿病按钮
        //addRadioButton('plxg', '1', '心脑血管');
        // addRadioButton('plxg', '2', '肿瘤');
        // addRadioButton('plxg', '3', '糖尿病');


        const bkzl = document.createElement('select');
        var option1 = document.createElement('option');
        option1.value =1;
        option1.textContent = '糖尿病';
        bkzl.appendChild(option1);
        var option2 = document.createElement('option');
        option2.value =2;
        option2.textContent = '肿瘤';
        bkzl.appendChild(option2);
        var option3 = document.createElement('option');
        option3.value =3;
        option3.textContent = '心脑血管';
        bkzl.appendChild(option3);
        container1.appendChild(bkzl);
        container1.appendChild(document.createElement('tr'));

        const tzid = document.createElement('div');
        tzid.textContent ="台州市平台ID";
        tzid.style.cssText = `
      margin-top: 0px;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;
        container1.appendChild(tzid);
        container1.appendChild(document.createElement('tr'));
        const bkid = document.createElement('textarea');
        bkid.id=bkid;
        container1.appendChild(bkid);
        container1.appendChild(document.createElement('tr'));

        const qyear1 = document.createElement('div');
        qyear1.textContent ="原始年份";
        qyear1.style.cssText = `
      margin-top: 0px;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;

        const qyear2 = document.createElement('div');
        qyear2.textContent ="更改后年份";
        qyear2.style.cssText = `
      margin-top: 0px;
      max-width: 300px;
      max-height: 200px;
      overflow-y: auto;
      background-color: white;
      padding: 0px;
      border-radius: 0px;
      font-size: 18px;
      line-height: 1.4;
      cursor: default;
  `;
        //年份选择
        const year1 = document.createElement('select');
        const year2 = document.createElement('select');
        const currentYear = new Date().getFullYear();
        for (var i = currentYear; i >= currentYear - 4; i--) {
            var option = document.createElement('option');
            option.value = option.textContent = i;
            year1.appendChild(option);
        }
        for ( i = currentYear; i >= currentYear - 4; i--) {
            option = document.createElement('option');
            option.value = option.textContent = i;
            year2.appendChild(option);
        }
        container1.appendChild(qyear1);
        container1.appendChild(year1);
        container1.appendChild(qyear2);
        container1.appendChild(year2);
        container1.appendChild(document.createElement('tr'));
        container1.appendChild(tj1);
        container1.appendChild(document.createElement('tr'));
        container1.appendChild(qk1);
        container1.appendChild(document.createElement('tr'));
        container1.appendChild(dk);
        document.body.appendChild(container1);
        resultDiv1.textContent ="报告卡批量更改";

        //批量修改标志
        GM_setValue('plbz', 0);
        GM_setValue('xgyear', 0);
        let id;
        let wz;

        function xnxgbkgx(){
            console.log(id[0]);
            console.log(id[1]);
            if(c<id.length ){
                if(id[c].length>0){
                    window.open(wz+id[c]);
                }
                c=c+1;
                console.log(c);
            }else{
                clearInterval(gx);
            }
        }

        //批量提交函数
        function pltj(){
            console.log(year1.value);
            GM_setValue('ysyear', year1.value);
            GM_setValue('xghyear', year2.value);

            //bkzl：报卡种类 1.糖尿病 2.肿瘤  3.心脑
            GM_setValue('bkzl', bkzl.value);
            //plbz 批量标志 1为批量修改
            GM_setValue('plbz', 1);


            //设置网址
            if(bkzl.value=='1'){
                wz='http://172.16.8.7:82/tzmb/ZjjkTnbBgkAction.do?formOp=viewDisp&tagValue=qs&pageName=bgkbj&model.vcBgkid=';
            }else if(bkzl.value=='2'){
                wz='http://172.16.8.7:82/tzmb/ZjjkZlBgkqxAction.do?formOp=updateDisp&op=bgkUpdateQuery&model.vcBgkid=';
            }else if(bkzl.value=='3'){
                wz='http://172.16.8.7:82/tzmb/ZjjkXnxgBgkAction.do?formOp=updateDisp&model.vcBgkid=';
            }
            console.log(wz);
            //提取TEXTAREA中的报告卡ID号
            id=bkid.value.replace(/'/g, "").split("\n");

            //保存到全域
            unsafeWindow.id = id;
            unsafeWindow.wz=wz;
            unsafeWindow.c=0;
            unsafeWindow.xnxgbkgx=xnxgbkgx;
            let gx=setInterval("xnxgbkgx()",3000);
        }

        //批量提交函数
        function pldk(){
            //bkzl：报卡种类 1.糖尿病 2.肿瘤  3.心脑
            GM_setValue('bkzl', bkzl.value);
            //plbz 批量标志 1为批量修改
            GM_setValue('plbz', 0);
            //设置网址
            if(bkzl.value=='1'){
                wz='http://172.16.8.7:82/tzmb/ZjjkTnbBgkAction.do?formOp=viewDisp&tagValue=qs&pageName=bgkbj&model.vcBgkid=';
            }else if(bkzl.value=='2'){
                wz='http://172.16.8.7:82/tzmb/ZjjkZlBgkqxAction.do?formOp=updateDisp&op=bgkUpdateQuery&model.vcBgkid=';
            }else if(bkzl.value=='3'){
                wz='http://172.16.8.7:82/tzmb/ZjjkXnxgBgkAction.do?formOp=updateDisp&model.vcBgkid=';
            }
            //提取TEXTAREA中的报告卡ID号
            id=bkid.value.replace(/'/g, "").split("\n");
            for(var i=0;i<id.length;i++ ){
                if(id[i].length>0){
                    window.open(wz+id[i]);
                }
                console.log(i);
            }
        }

        function qk(){
            bkid.value='';
            GM_setValue('plbz', 0);
            year1.value=currentYear;
            year2.value=currentYear;
            clearInterval(gx);
        }
        tj1.addEventListener('click',pltj);
        qk1.addEventListener('click',qk);
        dk.addEventListener('click',pldk);
    }

    //==================================心脑卡查询页面==================================
    if(window.location.href=="http://172.16.8.7:82/tzmb/ZjjkXnxgBgkAction.do"||window.location.href=="http://172.16.8.7:82/tzmb/ZjjkXnxgBgkAction.do?formOp=query"){
        document.title='心脑报告卡查询';

        //户籍临海
        const hjlh=document.createElement('button');
        hjlh.innerText = "户籍临海";
        hjlh.style.cssText = `
    width:100;
    height:20;
    font-size: 14px;
  `;
        //报卡医院临海
        const bkyy=document.createElement('button');
        bkyy.innerText = "报卡医院临海";
        bkyy.style.cssText = `
    width:100;
    height:20;
    font-size: 14px;
  `;
        //心脑血管
        rq('model.beginDtBkrq');
        rq('model.endDtBkrq');
        rq('model.beginDtFbrq');
        rq('model.endDtFbrq');
        rq('model.beginDtQxshsj');
        rq('model.endDtQxshsj');

        rq('model.beginDtSwrq');
        rq('model.endDtSwrq');
        rq('model.beginDtYyshsj');
        rq('model.endDtYyshsj');
        rq('model.beginDtLrsj');
        rq('model.endDtLrsj');

        document.getElementsByClassName("inputStyle")[0].append(hjlh);
        function hjlh1(){
            if(document.all("model.queryVcCzhkqx").value=='33108200'){
                document.all("model.queryVcCzhks").value="";
                document.all("model.queryVcCzhksi").value="";
                document.all("model.queryVcCzhkqx").value="";
            }else{
                document.all("model.queryVcCzhks").value=0;
                document.all("model.queryVcCzhksi").value=33100000;
                streetChange('model.queryVcCzhksi', 'model.queryVcCzhkqx', dc, '');
                checkSelect('model.queryVcCzhkjd');
                document.all("model.queryVcCzhkqx").value=33108200;
                streetChange('model.queryVcCzhkqx', 'model.queryVcCzhkjd', ef, '');
            }
        }
        hjlh.addEventListener('click',hjlh1);

        //报卡医院临海
        document.getElementsByClassName("inputStyle")[1].append(bkyy);
        function bkyy1(){
            if(document.all("model.queryVcBkdwqx").value=='33108200'){
                document.all("model.queryVcBkdw").value="";
                document.all("model.queryVcBkdwqx").value="";
            }else{
                document.all("model.queryVcBkdw").value=33100000;
                set_bgkBh();
                streetChange('model.queryVcBkdw', 'model.queryVcBkdwqx', dc, '');
                checkSelect('model.queryVcBkdwyy');
                document.all("model.queryVcBkdwqx").value=33108200;
                set_bgkBh();
                streetChange('model.queryVcBkdwqx', 'model.queryVcBkdwyy', yy, '');
            }
        }
        bkyy.addEventListener('click',bkyy1);
    }

    //==================================肿瘤卡查询页面==================================
    if(window.location.href=="http://172.16.8.7:82/tzmb/ZjjkZlBgkqxAction.do"||window.location.href=="http://172.16.8.7:82/tzmb/ZjjkZlBgkqxAction.do?formOp=query"||window.location.href=="http://172.16.8.7:82/tzmb/ZjjkZlBgkqxAction.do?formOp=query&op=bgkQuery"){
        document.title='肿瘤报告卡查询';

        //户籍临海
        const hjlh=document.createElement('button');
        hjlh.innerText = "户籍临海";
        hjlh.style.cssText = `
    width:100;
    height:20;
    font-size: 14px;
  `;
        //报卡医院临海
        const bkyy=document.createElement('button');
        bkyy.innerText = "报卡医院临海";
        bkyy.style.cssText = `
    width:100;
    height:20;
    font-size: 14px;
  `;
        //肿瘤
        rq('model.beginDtZdrq');
        rq('model.endDtZdrq');
        rq('model.beginDtBgrq');
        rq('model.endDtBgrq');
        rq('model.beginDtYyshsj');
        rq('model.endDtYyshsj');

        rq('model.beginDtQxshsj');
        rq('model.endDtQxshsj');
        rq('model.beginDtLrsj');
        rq('model.endDtLrsj');


        document.getElementsByClassName("inputStyle")[11].append(hjlh);
        function hjlh1(){
            if(document.all("model.zjjkZlHzxx.queryVcHkqxdm").value=='33108200'){
                document.all("model.zjjkZlHzxx.queryVcHksfdm").value="";
                document.all("model.zjjkZlHzxx.queryVcHksdm").value="";
                document.all("model.zjjkZlHzxx.queryVcHkqxdm").value="";
            }else{
                document.all("model.zjjkZlHzxx.queryVcHksfdm").value=0;
                document.all("model.zjjkZlHzxx.queryVcHksdm").value=33100000;
                streetChange('model.zjjkZlHzxx.queryVcHksdm', 'model.zjjkZlHzxx.queryVcHkqxdm', dc, '');
                document.all("model.zjjkZlHzxx.queryVcHkqxdm").value=33108200;
                streetChange('model.zjjkZlHzxx.queryVcHkqxdm', 'model.zjjkZlHzxx.queryVcHkjddm', ef, '');
            }
        }
        hjlh.addEventListener('click',hjlh1);

        //报卡医院临海
        document.getElementsByClassName("inputStyle")[9].append(bkyy);
        function bkyy1(){
            if(document.all("model.queryVcKhqx").value=='33108200'){
                document.all("model.queryVcKhs").value="";
                document.all("model.queryVcKhqx").value="";
            }else{
                document.all("model.queryVcKhs").value=33100000;
                set_bgkBh();
                streetChange('model.queryVcKhs', 'model.queryVcKhqx', dc, '');
                document.all("model.queryVcKhqx").value=33108200;
                streetChange('model.queryVcKhqx', 'model.queryVcBgdw', gh, '');
            }
        }
        bkyy.addEventListener('click',bkyy1);
    }

    //===============================肿瘤报告卡编辑============================
    if(urlInfos[urlInfos.length - 1].split("?")[1].includes('formOp=updateDisp') &&
       urlInfos[urlInfos.length - 1].split("?")[0].includes('ZjjkZlBgkqxAction.do')) {

        document.title='肿瘤报告卡编辑';
        /**
         * showModalDialog兼容处理
         * 该特性已从Web标准中删除
        */
        if(! unsafeWindow.showModalDialog){
            unsafeWindow.showModalDialog = function(uri, args, opts){
                opts = opts.replace(/:/g, '=')
                    .replace(/;/g, ',')
                    .replace('dialogWidth', 'width')
                    .replace('dialogHeight', 'height')
                    .replace('dialogtop', 'top')
                    .replace('dialogleft', 'left')
                    .replace('scroll', 'scrollbars');
                window.open(uri, '', opts).dialogArguments = args;
            };
        }

        unsafeWindow.dygafu = dygafu; // 替换公安地址查询函数

        //修改肿瘤首次诊断日期
        if(GM_getValue('plbz')==1){
            document.all('model.dtZdrq').value=document.all('model.dtZdrq').value.replace(GM_getValue('ysyear'),GM_getValue('xghyear'));
        }

        //相关信息显示
        container.appendChild(tj);
        document.body.appendChild(container);
        resultDiv.textContent ="相关信息校验及处理";
        console.log("肿瘤报卡审卡");
        //原始姓名
        name.textContent="姓名："+document.getElementsByName('model.zjjkZlHzxx.vcHzxm')[0].value;

        //报卡原地址
        bkyxdz.textContent="报卡原现住址："+document.getElementsByName('model.zjjkZlHzxx.vcSjxxdz')[0].value;
        //出生日期、性别、发病年龄、当前年龄根据身份证号自动更新
        if(checkid(document.getElementsByName('model.zjjkZlHzxx.vcSfzh')[0].value)){
            certId=document.getElementsByName('model.zjjkZlHzxx.vcSfzh')[0].value
            year = certId.substring(6, 10);
            month = certId.substring(10, 12);
            day = certId.substring(12, 14);
            document.getElementsByName('model.zjjkZlHzxx.dtHzcsrq')[0].value= year + "-" + month + "-" + day;
            if (certId.charAt(16) % 2 == 1) {
                document.getElementsByName('model.zjjkZlHzxx.vcHzxb')[0].value=1;
            } else {
                document.getElementsByName('model.zjjkZlHzxx.vcHzxb')[0].value=2;
            }
            //发病年龄
            document.getElementsByName('model.vcSznl')[0].value=document.getElementsByName('model.dtZdrq')[0].value.slice(0,4)-year;
            //实足年龄
            document.getElementsByName('model.vcBksznl')[0].value=currentYear-year;

        } else{
            name.textContent=name.textContent+"身份证号码逻辑错误";
        }

        //婚姻
        if(document.getElementsByName('model.vcHyzk')[0].value==""){
            if(document.getElementsByName('model.vcBksznl')[0].value>29){
                document.all('model.vcHyzk').value=2;
            }else{
                document.all('model.vcHyzk').value=1;
            }
        }

        //学历
        if(document.all('model.vcXl').value==""){
            document.all('model.vcXl').value=9;
        }

        //公安地址查询
        dygafu2();

        //户籍地址
        for( i=0;i<jdmc.length;i++){
            if(sfjyxx.includes(jdmc[i])){
                //设置街道
                document.getElementsByName('model.zjjkZlHzxx.vcHkjddm')[0].value=zjbm[i];
                //设置户口村居委会
                document.getElementsByName('model.zjjkZlHzxx.vcHkjwdm')[0].value=sfjyxx.slice(sfjyxx.indexOf(jdmc[i])+jdmc[i].length,isCharInRange(sfjyxx,65296,65305));
                break;
            }
        }
        document.getElementsByName('model.zjjkZlHzxx.vcHkxxdz')[0].value=document.getElementsByName('model.zjjkZlHzxx.vcHkxxdz')[0].value.replace("匹配成功，此人户籍地址为：","");
        document.getElementsByName('model.zjjkZlHzxx.vcHkxxdz')[0].value=document.getElementsByName('model.zjjkZlHzxx.vcHkxxdz')[0].value.replace("浙江省临海市","浙江省台州市临海市");


        //日期选择
        //出生日期
        document.all('model.zjjkZlHzxx.dtHzcsrq').type="date"
        //首次诊断日期
        document.all('model.dtZdrq').type="date"
        //原首次诊断日期
        document.all('model.dtYzdrq').type="date"
        //报卡日期
        document.all('model.dtBgrq').type="date"
        //报卡日期设置为可修改
        document.all('model.dtBgrq').readOnly=false
        //发病日期
        document.all('model.dtFbrq').type="date"

        //首次诊断日期如果为空设为首次诊断日期
        if(document.all('model.dtFbrq').value==""&&document.all('model.dtZdrq').value!=""){
            document.all('model.dtFbrq').value=document.all('model.dtZdrq').value;
        }


        //地址显示宽度
        document.all('model.zjjkZlHzxx.vcHkxxdz').style="width:380px"
        document.all('model.zjjkZlHzxx.vcSjxxdz').style="width:380px"

        //在本辖区连续居住6个月以上：
        if(document.getElementsByName('model.vcSflxjzbn')[0].value==""){
            document.getElementsByName('model.vcSflxjzbn')[0].value="1";
        }

        //ICD查询
        GM_setValue("vcicd10",document.all('model.vcIcd10').value);
        GM_setValue("vcicd9",document.all('model.vcIcd9').value);

        GM_addValueChangeListener(
            "vcicd10",
            function(name,old_value,new_value,remote){
                if( GM_getValue("vcicd10")==null){return};
                document.all('model.vcIcd10').value=GM_getValue("vcicd10");
                document.all('model.vcIcd10s').value=GM_getValue("vcicd10");
                document.getElementsByClassName('select2-choice')[0].innerText=document.all('model.vcIcd10s').options[document.all('model.vcIcd10s').selectedIndex].innerHTML;
            }
        );
        GM_addValueChangeListener(
            "vcicd9",
            function(name,old_value,new_value,remote){
                if( GM_getValue("vcicd9")==null){return};
                document.all('model.vcIcd9').value=GM_getValue("vcicd9");
            }
        );

        function changeVcicd10(){
            document.getElementsByClassName('select2-choice')[0].innerText=document.all('model.vcIcd10s').options[document.all('model.vcIcd10s').selectedIndex].innerHTML;
            document.all('model.vcIcd10').value=document.all('model.vcIcd10s').value;
        }
        unsafeWindow.changeVcicd10 = changeVcicd10;

        //icd03查询
        GM_setValue("X0",document.all('model.vcIcdos').value);
        GM_setValue("X1",document.all('model.vcIcdm').value);
        GM_setValue("X2",document.all('model.vcDlw').value);
        GM_setValue("X3",document.all('model.vcIcdo').value);

        //ICD0监听
        GM_addValueChangeListener(
            "X0",
            function(name,old_value,new_value,remote){
                if( GM_getValue("X0")==null){return};
                document.all('model.vcIcdos').value=GM_getValue("X0");
                document.getElementsByClassName('select2-choice')[1].innerText=document.all('model.vcIcdos').options[document.all('model.vcIcdos').selectedIndex].innerHTML;
            }
        );
        function changeTypeIcdo(){
            document.getElementsByClassName('select2-choice')[1].innerText=document.all('model.vcIcdos').options[document.all('model.vcIcdos').selectedIndex].innerHTML;
            document.getElementsByClassName('select2-choice')[2].innerText=document.all('model.vcIcdm').options[document.all('model.vcIcdm').selectedIndex].innerHTML;
            document.all('model.vcIcdo').value=document.all('model.vcIcdos').value+",M-"+document.all('model.vcIcdm').value+document.all('model.vcDlw').value;
        };
        unsafeWindow.changeTypeIcdo = changeTypeIcdo;

        //ICDM监听
        GM_addValueChangeListener(
            "X1",
            function(name,old_value,new_value,remote){
                if( GM_getValue("X1")==null){return};
                document.all('model.vcIcdm').value=GM_getValue("X1");
                document.getElementsByClassName('select2-choice')[2].innerText=document.all('model.vcIcdm').options[document.all('model.vcIcdm').selectedIndex].innerHTML;
            }
        );

        //第六位监听
        GM_addValueChangeListener(
            "X2",
            function(name,old_value,new_value,remote){
                if( GM_getValue("X2")==null){return};
                document.all('model.vcDlw').value=GM_getValue("X2");
            }
        );
        //ICD-O-3编码
        GM_addValueChangeListener(
            "X3",
            function(name,old_value,new_value,remote){
                if( GM_getValue("X3")==null){return};
                document.all('model.vcIcdo').value=GM_getValue("X0")+",M-"+GM_getValue("X3");
            }
        );

        //页面提交
        if(GM_getValue('plbz')==1){
            document.forms[0].submit();
        }
    }

    //==================================肿瘤卡ICD10查询页面==================================
    if(window.location.href=="http://172.16.8.7:82/tzmb/ZjjkZlBgkAction.do?formOp=showIcd"){
        document.title = 'ICD-10查询';
        function sub(){
            if( document.getElementsByName('vcicd10')[0].value!=""){
                GM_setValue("vcicd10", document.getElementsByName('vcicd10')[0].value);
            };
            if(document.getElementsByName('vcicd9')[0].value!=""){
                GM_setValue("vcicd9",document.getElementsByName('vcicd9')[0].value);
            }
        }
        unsafeWindow.sub = sub;
    }

    //==================================肿瘤卡ICD03查询页面==================================
    if(window.location.href=="http://172.16.8.7:82/tzmb/ZjjkZlBgkAction.do?formOp=showIcdo"){
        document.title = 'ICD-0-3查询';
        function sub(){
            if( document.getElementsByName('vcicd10')[0].value!=""){
                GM_setValue("X0", document.getElementsByName('vcicd10')[0].value);
            };
            if(document.getElementsByName('vcDrj')[0].value!=""){
                GM_setValue("X1",document.getElementsByName('vcDrj')[0].value);
            }
            if( document.getElementsByName('vcDlw')[0].value!=""){
                GM_setValue("X2", document.getElementsByName('vcDlw')[0].value);
            };
            if( document.getElementsByName('vcicdm')[0].value!=""){
                GM_setValue("X3", document.getElementsByName('vcicdm')[0].value);
            };
        }
        unsafeWindow.sub = sub;
    }



    //======================心脑血管报告卡编辑==================================
    if(urlInfos[urlInfos.length - 1].split("?")[1].includes('formOp=updateDisp&model.vcBgkid=') &&
       urlInfos[urlInfos.length - 1].split("?")[0].includes('ZjjkXnxgBgkAction.do')) {
        document.title = '心脑报告卡编辑';
        //修改心脑发病和确诊日期
        if(GM_getValue('plbz')==1){
            //发病时间
            document.all('model.dtFbrq').value=document.all('model.dtFbrq').value.replace(GM_getValue('ysyear'),GM_getValue('xghyear'));
            //model.dtQzrq 修改确诊日期
            document.all('model.dtQzrq').value=document.all('model.dtQzrq').value.replace(GM_getValue('ysyear'),GM_getValue('xghyear'));
        }

        // var oldFunction = unsafeWindow.queryIdcardInfo; // 获取需要替换的函数
        unsafeWindow.queryIdcardInfo = queryIdcardInfo; // 替换函数

        //相关信息显示
        container.appendChild(tj);
        document.body.appendChild(container);
        resultDiv.textContent ="相关信息校验及处理";
        console.log("心脑血管报卡审卡");
        //原始姓名
        name.textContent="姓名："+document.getElementsByName('model.vcHzxm')[0].value;

        //报卡原地址
        bkyxdz.textContent="报卡原现住址："+document.getElementsByName('model.vcMqxxdz')[0].value;

        //出生日期、性别根据身份证号自动更新
        if(checkid(document.getElementsByName('model.vcHzsfzh')[0].value)){
            var certId=document.getElementsByName('model.vcHzsfzh')[0].value
            var year = certId.substring(6, 10);
            var month = certId.substring(10, 12);
            var day = certId.substring(12, 14);
            document.getElementsByName('model.dtHzcsrq')[0].value= year + "-" + month + "-" + day;
            if (certId.charAt(16) % 2 == 1) {
                document.getElementsByName('model.vcHzxb')[0].value=1;
            } else {
                document.getElementsByName('model.vcHzxb')[0].value=2;
            }
            //发病年龄
            document.getElementsByName('model.vcSznl')[0].value=document.getElementsByName('model.dtFbrq')[0].value.slice(0,4)-year;
            //实足年龄
            document.getElementsByName('model.vcBksznl')[0].value=currentYear-year;

        } else{
            name.textContent=name.textContent+"身份证号码逻辑错误";
        }

        //身份信息检验
        queryIdcardInfo2('/tzmb/ZjjkXnxgBgkAction.do', '', '', document.getElementsByName('model.dtSfzjyxx'),'model.vcHzxm','model.vcCzhkxxdz')

        //户籍地址
        for( i=0;i<jdmc.length;i++){
            if(sfjyxx.includes(jdmc[i])){
                //设置街道
                document.getElementsByName('model.vcCzhkjd')[0].value=zjbm[i];
                //管理单位编码
                document.getElementsByName('model.vcGldwdm')[0].value=gldwbm[i];
                //设置户口村居委会
                document.getElementsByName('model.vcCzhkjw')[0].value=sfjyxx.slice(sfjyxx.indexOf(jdmc[i])+jdmc[i].length,isCharInRange(sfjyxx,65296,65305));
                break;
            }
        }
        document.getElementsByName('model.vcCzhkxxdz')[0].value=document.getElementsByName('model.vcCzhkxxdz')[0].value.replace("匹配成功，此人户籍地址为：","");
        document.getElementsByName('model.vcCzhkxxdz')[0].value=document.getElementsByName('model.vcCzhkxxdz')[0].value.replace("浙江省临海市","浙江省台州市临海市");

        //目前地址
        document.getElementsByName('model.vcMqxxdz')[0].value=document.getElementsByName('model.vcMqxxdz')[0].value.replace("匹配成功，此人户籍地址为：","");
        document.getElementsByName('model.vcMqxxdz')[0].value=document.getElementsByName('model.vcMqxxdz')[0].value.replace("浙江省临海市","浙江省台州市临海市");

        //联系人证件类型 ：
        document.getElementsByName('model.vcZjlx')[0].value="1"

        //联系人姓名
        if(document.getElementsByName('model.vcLxr')[0].value==""){
            document.getElementsByName('model.vcLxr')[0].value=document.getElementsByName('model.vcHzxm')[0].value;
        }

        //联系人电话
        if(document.getElementsByName('model.vcLxrdh')[0].value==""){
            document.getElementsByName('model.vcLxrdh')[0].value=document.getElementsByName('model.vcHzjtdh')[0].value;
        }

        //在本辖区连续居住6个月以上：
        if(document.getElementsByName('model.vcSflxjzbn')[0].value==""){
            document.getElementsByName('model.vcSflxjzbn')[0].value="1";
        }


        //诊断
        //分类不明
        const flbm=['I64'];
        //急性心肌梗塞
        const jxxjgs=["I21","I21.0","I21.1","I21.2","I21.3","I21.4","I21.9","I22","I22.0","I22.1","I22.8","I22.9","I23"];
        //脑出血
        const ncx=["I61","I61.0","I61.1","I61.2","I61.3","I61.4","I61.5","I61.6","I61.8","I61.9"];
        //脑梗塞
        const ngs=["I63","I63.2","I63.5","I63.8","I63.9","I63.1","I63.4"]
        //脑血栓形成
        const nxsxc=["I63.0","I63.3","I63.6"]
        //其他冠心病死亡
        const qtgxbsw=["I20.0","I20.1","I20.8","I20.9","I23.0","I23.1","I23.2","I23.3","I23.4","I23.5","I23.6","I23.8","I24","I24.0","I24.1","I24.8","I24.9","I25","I25.0","I25.1","I25.2","I25.3","I25.4","I25.5","I25.6","I25.8","I25.9"]
        //心性猝死
        const xxcs=["I46","I46.0","I46.1","I46.9"]
        //蛛网膜下腔出血
        const zwmxqcx=["I60","I60.0","I60.1","I60.2","I60.3","I60.4","I60.5","I60.6","I60.7","I60.8","I60.9"]




        //诊断依据:超声心动图
        if(document.getElementsByName('model.vcCsxdt')[0].value==""){
            document.getElementsByName('model.vcCsxdt')[0].value="4";
        }

        //诊断依据:腰穿
        if(document.getElementsByName('model.vcYc')[0].value==""){
            document.getElementsByName('model.vcYc')[0].value="4";
        }

        //诊断依据:手术
        if(document.getElementsByName('model.vcSs')[0].value==""){
            document.getElementsByName('model.vcSs')[0].value="4";
        }

        //诊断依据:死后推断
        if(document.getElementsByName('model.vcShtd')[0].value==""){
            document.getElementsByName('model.vcShtd')[0].value="2";
        }

        //诊断单位级别
        if(document.getElementsByName('model.vcZddwjb')[0].value==""){
            document.getElementsByName('model.vcZddwjb')[0].value="2";
        }

        //如果是台州医院，诊断医院级别选成三级
        if(document.getElementsByName('model.vcBkdwyy')[0].value=="331082001"){
            document.getElementsByName('model.vcZddwjb')[0].value="3";
        }

        //报告科室：
        if(document.getElementsByName('model.vcBgks')[0].value==""){
            document.getElementsByName('model.vcBgks')[0].value="内科";
        }

        // 转归:0生存，1死亡
        if(document.getElementsByName('model.vcShtd')[0].value=="1"){
            document.getElementsByName('model.vcZg')[0].value="1";
        }else{
            document.getElementsByName('model.vcZg')[0].value="0";
        }

        //本次卒中发病时间与CT/磁共振检查时间间隔
        if(document.getElementsByName('model.arrCgzsjjg')[0].checked==false
           && document.getElementsByName('model.arrCgzsjjg')[1].checked==false
           && document.getElementsByName('model.arrCgzsjjg')[2].checked==false
           && document.getElementsByName('model.arrCgzsjjg')[3].checked==false
           && document.getElementsByName('model.arrCgzsjjg')[4].checked==false){
            document.getElementsByName('model.arrCgzsjjg')[0].checked = true
        }

        //首要症状(脑卒中),根据病史描述修改  document.getElementsByTagName('textarea')[0].innerHTML
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('意识')){
            document.getElementsByName('model.arrSyzz')[0].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('肢体')){
            document.getElementsByName('model.arrSyzz')[1].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('上肢')){
            document.getElementsByName('model.arrSyzz')[1].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('下肢')){
            document.getElementsByName('model.arrSyzz')[1].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('语言')){
            document.getElementsByName('model.arrSyzz')[2].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('言语')){
            document.getElementsByName('model.arrSyzz')[2].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('失语')){
            document.getElementsByName('model.arrSyzz')[2].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('口吃')){
            document.getElementsByName('model.arrSyzz')[2].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('口齿含糊')){
            document.getElementsByName('model.arrSyzz')[2].checked = true
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('无意识')){
            document.getElementsByName('model.arrSyzz')[0].checked = false
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('无肢体')){
            document.getElementsByName('model.arrSyzz')[1].checked = false
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('无语言')){
            document.getElementsByName('model.arrSyzz')[2].checked = false
        }
        if(document.getElementsByTagName('textarea')[0].innerHTML.includes('言语清楚')){
            document.getElementsByName('model.arrSyzz')[2].checked = false
        }
        if(document.getElementsByName('model.arrSyzz')[0].checked ==false &&
           document.getElementsByName('model.arrSyzz')[1].checked ==false &&
           document.getElementsByName('model.arrSyzz')[2].checked ==false){
            document.getElementsByName('model.arrSyzz')[3].checked = true;
        }else{
            document.getElementsByName('model.arrSyzz')[3].checked = false;
        }


        //日期选择
        //出生日期
        document.all('model.dtHzcsrq').type="date"
        //确诊日期
        document.all('model.dtQzrq').type="date"
        //报卡日期
        document.all('model.dtBkrq').type="date"
        //报卡日期设置为可修改
        document.all('model.dtBkrq').readOnly=false
        //发病日期
        document.all('model.dtFbrq').type="date"
        //死亡日期
        document.all('model.dtSwrq').type="date"

        //地址显示宽度
        document.all('model.vcCzhkxxdz').style="width:380px"
        document.all('model.vcMqxxdz').style="width:380px"

        //页面提交
        if(GM_getValue('plbz')==1){
            document.forms[0].submit();
        }
    }



    //==================================糖尿病报告卡编辑==================================
    if(urlInfos[urlInfos.length - 1].split("?")[1].includes('formOp=viewDisp&tagValue=qs&pageName=bgkbj&model.vcBgkid') &&
       urlInfos[urlInfos.length - 1].split("?")[0].includes('ZjjkTnbBgkAction.do')) {

        //unsafeWindow.queryIdcardInfo = queryIdcardInfo; // 替换函数 // 替换函数
        document.title = '糖尿病报告卡编辑';
        //修改首诊诊断日期
        if(GM_getValue('plbz')==1){
            document.all('model.dtSczdrq').value=document.all('model.dtSczdrq').value.replace(GM_getValue('ysyear'),GM_getValue('xghyear'));
        }

        //相关信息显示
        document.body.appendChild(container);
        resultDiv.textContent ="相关信息校验及处理";
        console.log("糖尿病报卡审卡");
        //原始姓名
        name.textContent="姓名："+document.getElementsByName('zjjkTnbHzxx.vcHzxm')[0].value;

        //报卡原地址
        bkyxdz.textContent="报卡原现住址："+document.getElementsByName('zjjkTnbHzxx.vcJzxxdz')[0].value;
        //出生日期、性别、发病年龄、当前年龄根据身份证号自动更新
        if(checkid(document.getElementsByName('zjjkTnbHzxx.vcSfzh')[0].value)){
            certId=document.getElementsByName('zjjkTnbHzxx.vcSfzh')[0].value
            year = certId.substring(6, 10);
            month = certId.substring(10, 12);
            day = certId.substring(12, 14);
            document.getElementsByName('zjjkTnbHzxx.dtHzcsrq')[0].value= year + "-" + month + "-" + day;
            if (certId.charAt(16) % 2 == 1) {
                document.getElementsByName('zjjkTnbHzxx.vcHzxb')[0].value=1;
            } else {
                document.getElementsByName('zjjkTnbHzxx.vcHzxb')[0].value=2;
            }
            //发病年龄
            document.getElementsByName('zjjkTnbHzxx.vcSznl')[0].value=document.getElementsByName('model.dtSczdrq')[0].value.slice(0,4)-year;
            //实足年龄
            document.getElementsByName('model.vcBksznl')[0].value=currentYear-year;
        } else{
            name.textContent=name.textContent+"身份证号码逻辑错误";
        }

        //身份信息检验      
        queryIdcardInfo2('/tzmb/ZjjkTnbBgkAction.do', '', '', document.getElementsByName('model.dtSfzjyxx'),'zjjkTnbHzxx.vcHzxm','zjjkTnbHzxx.vcHkxxdz');

        //户籍地址
        for(i=0;i<jdmc.length;i++){
            if(sfjyxx.includes(jdmc[i])){
                //街道编码
                document.getElementsByName('zjjkTnbHzxx.vcHkjd')[0].value=zjbm[i];
                //管理单位编码
                document.getElementsByName('model.vcGldw')[0].value=gldwbm[i];
                //户籍居委会
                document.getElementsByName('zjjkTnbHzxx.vcHkjw')[0].value=sfjyxx.slice(sfjyxx.indexOf(jdmc[i])+jdmc[i].length,isCharInRange(sfjyxx,65296,65305));
                break;
            }
        }
        document.getElementsByName('zjjkTnbHzxx.vcHkxxdz')[0].value=document.getElementsByName('zjjkTnbHzxx.vcHkxxdz')[0].value.replace("匹配成功，此人户籍地址为：","");
        document.getElementsByName('zjjkTnbHzxx.vcHkxxdz')[0].value=document.getElementsByName('zjjkTnbHzxx.vcHkxxdz')[0].value.replace("浙江省临海市","浙江省台州市临海市");

        //目前地址
        document.getElementsByName('zjjkTnbHzxx.vcJzxxdz')[0].value=document.getElementsByName('zjjkTnbHzxx.vcJzxxdz')[0].value.replace("匹配成功，此人户籍地址为：","");
        document.getElementsByName('zjjkTnbHzxx.vcJzxxdz')[0].value=document.getElementsByName('zjjkTnbHzxx.vcJzxxdz')[0].value.replace("浙江省临海市","浙江省台州市临海市");

        //糖尿病ICD10与糖尿病类型
        function checkTnbType(obj){
            var tnbicd=obj;
            for(var i=0;i<tnbicd.length;i++)
            {
                if(tnbicd[i].selected==true)
                {
                    var icd = tnbicd[i].value;
                    var icd10 = icd.substring(0,3);
                    if(icd10=='E10' || icd=='O24.0'){
                        var tnblx=document.all('model.vcTnblx');
                        for(var a=0;a<tnblx.length;a++)
                        {
                            if(tnblx[a].value=="1")
                            {
                                tnblx[a].checked=true;
                                break;
                            }
                        }
                    }else if(icd10=='E11' || icd=='O24.1' || icd=='O24.3')
                    {
                        tnblx=document.all('model.vcTnblx');
                        for(let a=0;a<tnblx.length;a++)
                        {
                            if(tnblx[a].value=="2")
                            {
                                tnblx[a].checked=true;
                                break;
                            }
                        }
                    }else if(icd=='O24.4' || icd=='O24.9' || icd=='O24')
                    {
                        tnblx=document.all('model.vcTnblx');
                        for(let a=0;a<tnblx.length;a++)
                        {
                            if(tnblx[a].value=="3")
                            {
                                tnblx[a].checked=true;
                                break;
                            }
                        }
                    }else
                    {
                        tnblx=document.all('model.vcTnblx');
                        for(let a=0;a<tnblx.length;a++)
                        {
                            if(tnblx[a].value=="4")
                            {
                                tnblx[a].checked=true;
                                break;
                            }
                        }

                    }
                }
            }
        }
        checkTnbType(document.all('model.vcIcd10'));


        //在本辖区连续居住6个月以上：
        if(document.getElementsByName('model.vcSflxjzbn')[0].value==""){
            document.getElementsByName('model.vcSflxjzbn')[0].value="1";
        }

        //日期选择
        //出生日期
        document.all('zjjkTnbHzxx.dtHzcsrq').type="date"
        //首次诊断日期
        document.all('model.dtSczdrq').type="date";
        document.all('model.dtSczdrq').style="width:120px"
        //报卡日期
        document.all('model.dtBgrq').type="date"
        document.all('model.dtBgrq').style="width:120px"
        //报卡日期设置为可修改
        document.all('model.dtBgrq').readOnly=false
        //录入日期
        document.all('model.dtCjsj').type="date"
        document.all('model.dtCjsj').style="width:120px"
        //死亡日期
        document.all('model.dtSwrq').type="date"
        document.all('model.dtSwrq').style="width:120px"

        //地址显示宽度
        document.all('zjjkTnbHzxx.vcHkxxdz').style="width:380px"
        document.all('zjjkTnbHzxx.vcJzxxdz').style="width:380px"


        //页面提交
        if(GM_getValue('plbz')==1){
            document.forms[0].submit();
        }
    }

    //==================================查询页面==================================
    if (urlInfos[urlInfos.length - 1].split("?")[1].includes("formOp=query")||urlInfos[urlInfos.length - 1].split("?")[1].includes("formOp=pageForward") ){
        //户籍临海
        const hjlh=document.createElement('button');
        hjlh.innerText = "户籍临海";
        hjlh.style.cssText = `
    width:100;
    height:20;
    font-size: 14px;
  `;
        //报卡医院临海
        const bkyy=document.createElement('button');
        bkyy.innerText = "报卡医院临海";
        bkyy.style.cssText = `
    width:100;
    height:20;
    font-size: 14px;
  `;


        if(GM_getValue('plbz')==1){
            window.location.href="about:blank";
            window.close();
        }else if(urlInfos[urlInfos.length - 1].split("?")[0].includes("ZjjkTnbBgkAction.do") ){
            //糖尿病查询页面 设置日期
            document.title = '糖尿病报告卡查询';
            rq('model.beginDtSczdrq');
            rq('model.endDtSczdrq');
            rq('model.beginDtBgrq');
            rq('model.endDtBgrq');
            rq('model.beginDtYyshsj');
            rq('model.endDtYyshsj');
            rq('model.beginDtQxshsj');
            rq('model.endDtQxshsj');
            rq('model.beginDtSwrq');
            rq('model.endDtSwrq');
            rq('model.beginDtLrsj');
            rq('model.endDtLrsj');

            //户籍临海
            document.getElementsByClassName("inputStyle")[14].append(hjlh);
            function hjlh1(){
                if(document.all("zjjkTnbHzxx.queryVcHkqx").value=='33108200'){
                    document.all("zjjkTnbHzxx.queryVcHkshen").value="";
                    document.all("zjjkTnbHzxx.queryVcHks").value="";
                    document.all("zjjkTnbHzxx.queryVcHkqx").value="";
                }else{
                    document.all("zjjkTnbHzxx.queryVcHkshen").value=0;
                    document.all("zjjkTnbHzxx.queryVcHks").value=33100000;
                    streetChange('zjjkTnbHzxx.queryVcHks', 'zjjkTnbHzxx.queryVcHkqx', qx, '');
                    checkSelect('zjjkTnbHzxx.queryVcHkjd');
                    document.all("zjjkTnbHzxx.queryVcHkqx").value=33108200;
                    streetChange('zjjkTnbHzxx.queryVcHkqx', 'zjjkTnbHzxx.queryVcHkjd', jd, '');
                }
            }
            hjlh.addEventListener('click',hjlh1);

            //报卡医院临海
            document.getElementsByClassName("inputStyle")[15].append(bkyy);
            function bkyy1(){
                if(document.all("model.queryVcBkq").value=='33108200'){
                    document.all("model.queryVcBks").value="";
                    document.all("model.queryVcBkq").value="";
                }else{
                    document.all("model.queryVcBks").value=33100000;
                    streetChange('model.queryVcBks', 'model.queryVcBkq', qx, '');
                    checkSelect('model.queryVcBgdw');
                    document.all("model.queryVcBkq").value=33108200;
                    set_bgkBh();
                    streetChange('model.queryVcBkq', 'model.queryVcBgdw', yy, '');
                }
            }
            bkyy.addEventListener('click',bkyy1);
        }
    }


})();


//==================================替换原模糊查询函数,解决非IE兼肿瘤模糊查询兼容问题==================================
unsafeWindow.DWRUtil = DWRUtil;
function DWRUtil() { }

/**
 * Enables you to react to return being pressed in an input
 * @see http://getahead.ltd.uk/dwr/browser/util/selectrange
 */
DWRUtil.onReturn = function(event, action) {
    if (!event) {
        event = window.event;
    }
    if (event && event.keyCode && event.keyCode == 13) {
        action();
    }
};

/**
 * Select a specific range in a text box. Useful for 'google suggest' type functions.
 * @see http://getahead.ltd.uk/dwr/browser/util/selectrange
 */
DWRUtil.selectRange = function(ele, start, end) {
    var orig = ele;
    ele=document.all(ele);
    if (ele == null) {
        DWRUtil.debug("selectRange() can't find an element with id: " + orig + ".");
        return;
    }
    if (ele.setSelectionRange) {
        ele.setSelectionRange(start, end);
    }
    else if (ele.createTextRange) {
        var range = ele.createTextRange();
        range.moveStart("character", start);
        range.moveEnd("character", end - ele.value.length);
        range.select();
    }
    ele.focus();
};

/**
 * @private Experimental for getting the selected text
 */
DWRUtil._getSelection = function(ele) {
    var orig = ele;
    ele=document.all(ele);
    if (ele == null) {
        DWRUtil.debug("selectRange() can't find an element with id: " + orig + ".");
        return;
    }
    return ele.value.substring(ele.selectionStart, ele.selectionEnd);

    // if (window.getSelection) return window.getSelection().getRangeAt(0);
    // else if (document.getSelection) return document.getSelection();
    // else if (document.selection) return document.selection.createRange().text;
    // return "";
}



/**
 * Like toString but aimed at debugging
 * @see http://getahead.ltd.uk/dwr/browser/util/todescriptivestring
 */
DWRUtil.toDescriptiveString = function(data, level, depth) {
    var reply = "";
    var i = 0;
    var value;
    var obj;
    if (level == null) level = 0;
    if (depth == null) depth = 0;
    if (data == null) return "null";
    if (DWRUtil._isArray(data)) {
        if (data.length == 0) reply += "[]";
        else {
            if (level != 0) reply += "[\n";
            else reply = "[";
            for (i = 0; i < data.length; i++) {
                try {
                    obj = data[i];
                    if (obj == null || typeof obj == "function") {
                        continue;
                    }
                    else if (typeof obj == "object") {
                        if (level > 0) value = DWRUtil.toDescriptiveString(obj, level - 1, depth + 1);
                        else value = DWRUtil._detailedTypeOf(obj);
                    }
                    else {
                        value = "" + obj;
                        value = value.replace(/\/n/g, "\\n");
                        value = value.replace(/\/t/g, "\\t");
                    }
                }
                catch (ex) {
                    value = "" + ex;
                }
                if (level != 0)  {
                    reply += DWRUtil._indent(level, depth + 2) + value + ", \n";
                }
                else {
                    if (value.length > 13) value = value.substring(0, 10) + "...";
                    reply += value + ", ";
                    if (i > 5) {
                        reply += "...";
                        break;
                    }
                }
            }
            if (level != 0) reply += DWRUtil._indent(level, depth) + "]";
            else reply += "]";
        }
        return reply;
    }
    if (typeof data == "string" || typeof data == "number" || DWRUtil._isDate(data)) {
        return data.toString();
    }
    if (typeof data == "object") {
        var typename = DWRUtil._detailedTypeOf(data);
        if (typename != "Object")  reply = typename + " ";
        if (level != 0) reply += "{\n";
        else reply = "{";
        var isHtml = DWRUtil._isHTMLElement(data);
        for (var prop in data) {
            if (isHtml) {
                // HTML nodes have far too much stuff. Chop out the constants
                if (prop.toUpperCase() == prop || prop == "title" ||
                    prop == "lang" || prop == "dir" || prop == "className" ||
                    prop == "form" || prop == "name" || prop == "prefix" ||
                    prop == "namespaceURI" || prop == "nodeType" ||
                    prop == "firstChild" || prop == "lastChild" ||
                    prop.match(/^offset/)) {
                    continue;
                }
            }
            value = "";
            try {
                obj = data[prop];
                if (obj == null || typeof obj == "function") {
                    continue;
                }
                else if (typeof obj == "object") {
                    if (level > 0) {
                        value = "\n";
                        value += DWRUtil._indent(level, depth + 2);
                        value = DWRUtil.toDescriptiveString(obj, level - 1, depth + 1);
                    }
                    else {
                        value = DWRUtil._detailedTypeOf(obj);
                    }
                }
                else {
                    value = "" + obj;
                    value = value.replace(/\/n/g, "\\n");
                    value = value.replace(/\/t/g, "\\t");
                }
            }
            catch (ex) {
                value = "" + ex;
            }
            if (level == 0 && value.length > 13) value = value.substring(0, 10) + "...";
            var propStr = prop;
            if (propStr.length > 30) propStr = propStr.substring(0, 27) + "...";
            if (level != 0) reply += DWRUtil._indent(level, depth + 1);
            reply += prop + ":" + value + ", ";
            if (level != 0) reply += "\n";
            i++;
            if (level == 0 && i > 5) {
                reply += "...";
                break;
            }
        }
        reply += DWRUtil._indent(level, depth);
        reply += "}";
        return reply;
    }
    return data.toString();
};

/**
 * @private Indenting for DWRUtil.toDescriptiveString
 */
DWRUtil._indent = function(level, depth) {
    var reply = "";
    if (level != 0) {
        for (var j = 0; j < depth; j++) {
            reply += "\u00A0\u00A0";
        }
        reply += " ";
    }
    return reply;
};

/**
 * Setup a GMail style loading message.
 * @see http://getahead.ltd.uk/dwr/browser/util/useloadingmessage
 */
DWRUtil.useLoadingMessage = function(message) {
    var loadingMessage;
    if (message) loadingMessage = message;
    else loadingMessage = "Loading";
    DWREngine.setPreHook(function() {
        var disabledZone = document.all('disabledZone');
        if (!disabledZone) {
            disabledZone = document.createElement('div');
            disabledZone.setAttribute('id', 'disabledZone');
            disabledZone.style.position = "absolute";
            disabledZone.style.zIndex = "1000";
            disabledZone.style.left = "0px";
            disabledZone.style.top = "0px";
            disabledZone.style.width = "100%";
            disabledZone.style.height = "100%";
            document.body.appendChild(disabledZone);
            var messageZone = document.createElement('div');
            messageZone.setAttribute('id', 'messageZone');
            messageZone.style.position = "absolute";
            messageZone.style.top = "0px";
            messageZone.style.right = "0px";
            messageZone.style.background = "red";
            messageZone.style.color = "white";
            messageZone.style.fontFamily = "Arial,Helvetica,sans-serif";
            messageZone.style.padding = "4px";
            disabledZone.appendChild(messageZone);
            var text = document.createTextNode(loadingMessage);
            messageZone.appendChild(text);
        }
        else {
            document.all('messageZone').innerHTML = loadingMessage;
            disabledZone.style.visibility = 'visible';
        }
    });
    DWREngine.setPostHook(function() {
        document.all('disabledZone').style.visibility = 'hidden';
    });
}

/**
 * Set the value an HTML element to the specified value.
 * @see http://getahead.ltd.uk/dwr/browser/util/setvalue
 */
DWRUtil.setValue = function(ele, val, options) {
    if (val == null) val = "";
    if (options != null) {
        if (options.escapeHtml) {
            val = val.replace(/&/, "&amp;");
            val = val.replace(/'/, "&apos;");
            val = val.replace(/</, "&lt;");
            val = val.replace(/>/, "&gt;");
        }
    }

    var orig = ele;
    var nodes, node, i;

    ele = document.all(ele);
    // We can work with names and need to sometimes for radio buttons
    if (ele == null) {
        nodes = document.getElementsByName(orig);
        if (nodes.length >= 1) {
            ele = nodes.item(0);
        }
    }
    if (ele == null) {
        DWRUtil.debug("setValue() can't find an element with id/name: " + orig + ".");
        return;
    }

    if (DWRUtil._isHTMLElement(ele, "select")) {
        if (ele.type == "select-multiple" && DWRUtil._isArray(val)) {
            DWRUtil._selectListItems(ele, val);
        }
        else {
            DWRUtil._selectListItem(ele, val);
        }
        return;
    }

    if (DWRUtil._isHTMLElement(ele, "input")) {
        if (ele.type == "radio") {
            // Some browsers match names when looking for ids, so check names anyway.
            if (nodes == null) nodes = document.getElementsByName(orig);
            if (nodes != null && nodes.length > 1) {
                for (i = 0; i < nodes.length; i++) {
                    node = nodes.item(i);
                    if (node.type == "radio") {
                        node.checked = (node.value == val);
                    }
                }
            }
            else {
                ele.checked = (val == true);
            }
        }
        else if (ele.type == "checkbox") {
            ele.checked = val;
        }
        else {
            ele.value = val;
        }
        return;
    }

    if (DWRUtil._isHTMLElement(ele, "textarea")) {
        ele.value = val;
        return;
    }

    // If the value to be set is a DOM object then we try importing the node
    // rather than serializing it out
    if (val.nodeType) {
        if (val.nodeType == 9 /*Node.DOCUMENT_NODE*/) {
            val = val.documentElement;
        }

        val = DWRUtil._importNode(ele.ownerDocument, val, true);
        ele.appendChild(val);
        return;
    }

    // Fall back to innerHTML
    ele.innerHTML = val;
};

/**
 * @private Find multiple items in a select list and select them. Used by setValue()
 * @param ele The select list item
 * @param val The array of values to select
 */
DWRUtil._selectListItems = function(ele, val) {
    // We deal with select list elements by selecting the matching option
    // Begin by searching through the values
    var found  = false;
    var i;
    var j;
    for (i = 0; i < ele.options.length; i++) {
        ele.options[i].selected = false;
        for (j = 0; j < val.length; j++) {
            if (ele.options[i].value == val[j]) {
                ele.options[i].selected = true;
            }
        }
    }
    // If that fails then try searching through the visible text
    if (found) return;

    for (i = 0; i < ele.options.length; i++) {
        for (j = 0; j < val.length; j++) {
            if (ele.options[i].text == val[j]) {
                ele.options[i].selected = true;
            }
        }
    }
};

/**
 * @private Find an item in a select list and select it. Used by setValue()
 * @param ele The select list item
 * @param val The value to select
 */
DWRUtil._selectListItem = function(ele, val) {
    // We deal with select list elements by selecting the matching option
    // Begin by searching through the values
    var found  = false;
    var i;
    for (i = 0; i < ele.options.length; i++) {
        if (ele.options[i].value == val) {
            ele.options[i].selected = true;
            found = true;
        }
        else {
            ele.options[i].selected = false;
        }
    }

    // If that fails then try searching through the visible text
    if (found) return;

    for (i = 0; i < ele.options.length; i++) {
        if (ele.options[i].text == val) {
            ele.options[i].selected = true;
        }
        else {
            ele.options[i].selected = false;
        }
    }
}

/**
 * Read the current value for a given HTML element.
 * @see http://getahead.ltd.uk/dwr/browser/util/getvalue
 */
DWRUtil.getValue = function(ele, options) {
    if (options == null) {
        options = {};
    }
    var orig = ele;
    ele = document.all(ele);
    // We can work with names and need to sometimes for radio buttons, and IE has
    // an annoying bug where
    var nodes = document.getElementsByName(orig);
    if (ele == null && nodes.length >= 1) {
        ele = nodes.item(0);
    }
    if (ele == null) {
        DWRUtil.debug("getValue() can't find an element with id/name: " + orig + ".");
        return "";
    }

    if (DWRUtil._isHTMLElement(ele, "select")) {
        // This is a bit of a scam because it assumes single select
        // but I'm not sure how we should treat multi-select.
        var sel = ele.selectedIndex;
        if (sel != -1) {
            var reply = ele.options[sel].value;
            if (reply == null || reply == "") {
                reply = ele.options[sel].text;
            }

            return reply;
        }
        else {
            return "";
        }
    }

    if (DWRUtil._isHTMLElement(ele, "input")) {
        if (ele.type == "radio") {
            var node;
            for (var i = 0; i < nodes.length; i++) {
                node = nodes.item(i);
                if (node.type == "radio") {
                    if (node.checked) {
                        if (nodes.length > 1) return node.value;
                        else return true;
                    }
                }
            }
        }
        switch (ele.type) {
            case "checkbox":
            case "check-box":
            case "radio":
                return ele.checked;
            default:
                return ele.value;
        }
    }

    if (DWRUtil._isHTMLElement(ele, "textarea")) {
        return ele.value;
    }

    if (options.textContent) {
        if (ele.textContent) return ele.textContent;
        else if (ele.innerText) return ele.innerText;
    }
    return ele.innerHTML;
};

/**
 * getText() is like getValue() except that it reads the text (and not the value) from select elements
 * @see http://getahead.ltd.uk/dwr/browser/util/gettext
 */
DWRUtil.getText = function(ele) {
    var orig = ele;
    ele = document.all(ele);
    if (ele == null) {
        DWRUtil.debug("getText() can't find an element with id: " + orig + ".");
        return "";
    }

    if (!DWRUtil._isHTMLElement(ele, "select")) {
        DWRUtil.debug("getText() can only be used with select elements. Attempt to use: " + DWRUtil._detailedTypeOf(ele) + " from  id: " + orig + ".");
        return "";
    }

    // This is a bit of a scam because it assumes single select
    // but I'm not sure how we should treat multi-select.
    var sel = ele.selectedIndex;
    if (sel != -1) {
        return ele.options[sel].text;
    }
    else {
        return "";
    }
};

/**
 * Given a map, call setValue() for all the entries in the map using the entry key as an element id
 * @see http://getahead.ltd.uk/dwr/browser/util/setvalues
 */
DWRUtil.setValues = function(map) {
    for (var property in map) {
        // Are there any elements with that id or name
        if (document.all(property) != null || document.getElementsByName(property).length >= 1) {
            DWRUtil.setValue(property, map[property]);
        }
    }
};

/**
 * Given a map, call getValue() for all the entries in the map using the entry key as an element id.
 * Given a string or element that refers to a form, create an object from the elements of the form.
 * @see http://getahead.ltd.uk/dwr/browser/util/getvalues
 */
DWRUtil.getValues = function(data) {
    var ele;
    if (typeof data == "string") ele = document.all(data);
    if (DWRUtil._isHTMLElement(data)) ele = data;
    if (ele != null) {
        if (ele.elements == null) {
            alert("getValues() requires an object or reference to a form element.");
            return null;
        }
        var reply = {};
        var value;
        for (var i = 0; i < ele.elements.length; i++) {
            if (ele[i].id != null) value = ele[i].id;
            else if (ele[i].value != null) value = ele[i].value;
            else value = "element" + i;
            reply[value] = DWRUtil.getValue(ele[i]);
        }
        return reply;
    }
    else {
        for (var property in data) {
            // Are there any elements with that id or name
            if (document.all(property) != null || document.getElementsByName(property).length >= 1) {
                data[property] = DWRUtil.getValue(property);
            }
        }
        return data;
    }
};

/**
 * Add options to a list from an array or map.
 * @see http://getahead.ltd.uk/dwr/browser/lists
 */
DWRUtil.addOptions = function(ele, data) {
    var orig = ele;
    ele =  document.all(ele);
    if (ele == null) {
        DWRUtil.debug("addOptions() can't find an element with id: " + orig + ".");
        return;
    }
    var useOptions = DWRUtil._isHTMLElement(ele, "select");
    var useLi = DWRUtil._isHTMLElement(ele, ["ul", "ol"]);
    if (!useOptions && !useLi) {
        DWRUtil.debug("addOptions() can only be used with select/ul/ol elements. Attempt to use: " + DWRUtil._detailedTypeOf(ele));
        return;
    }
    if (data == null) return;

    var text;
    var value;
    var opt;
    var li;
    if (DWRUtil._isArray(data)) {
        // Loop through the data that we do have
        for (var i = 0; i < data.length; i++) {
            if (useOptions) {
                if (arguments[2] != null) {
                    if (arguments[3] != null) {
                        text = DWRUtil._getValueFrom(data[i], arguments[3]);
                        value = DWRUtil._getValueFrom(data[i], arguments[2]);
                    }
                    else {
                        value = DWRUtil._getValueFrom(data[i], arguments[2]);
                        text = value;
                    }
                }
                else
                {
                    text = DWRUtil._getValueFrom(data[i], arguments[3]);
                    value = text;
                }
                if (text || value) {
                    opt = new Option(text, value);
                    ele.options[ele.options.length] = opt;
                }
            }
            else {
                li = document.createElement("li");
                value = DWRUtil._getValueFrom(data[i], arguments[2]);
                if (value != null) {
                    li.innerHTML = value;
                    ele.appendChild(li);
                }
            }
        }
    }
    else if (arguments[3] != null) {
        for (var prop in data) {
            if (!useOptions) {
                alert("DWRUtil.addOptions can only create select lists from objects.");
                return;
            }
            value = DWRUtil._getValueFrom(data[prop], arguments[2]);
            text = DWRUtil._getValueFrom(data[prop], arguments[3]);
            if (text || value) {
                opt = new Option(text, value);
                ele.options[ele.options.length] = opt;
            }
        }
    }
    else {
        for ( prop in data) {
            if (!useOptions) {
                DWRUtil.debug("DWRUtil.addOptions can only create select lists from objects.");
                return;
            }
            if (typeof data[prop] == "function") {
                // Skip this one it's a function.
                text = null;
                value = null;
            }
            else if (arguments[2]) {
                text = prop;
                value = data[prop];
            }
            else {
                text = data[prop];
                value = prop;
            }
            if (text || value) {
                opt = new Option(text, value);
                ele.options[ele.options.length] = opt;
            }
        }
    }
};

/**
 * @private Get the data from an array function for DWRUtil.addOptions
 */
DWRUtil._getValueFrom = function(data, method) {
    if (method == null) return data;
    else if (typeof method == 'function') return method(data);
    else return data[method];
}

/**
 * Remove all the options from a select list (specified by id)
 * @see http://getahead.ltd.uk/dwr/browser/lists
 */
DWRUtil.removeAllOptions = function(ele) {
    var orig = ele;
    ele =  document.all(ele);
    if (ele == null) {
        DWRUtil.debug("removeAllOptions() can't find an element with id: " + orig + ".");
        return;
    }
    var useOptions = DWRUtil._isHTMLElement(ele, "select");
    var useLi = DWRUtil._isHTMLElement(ele, ["ul", "ol"]);
    if (!useOptions && !useLi) {
        DWRUtil.debug("removeAllOptions() can only be used with select, ol and ul elements. Attempt to use: " + DWRUtil._detailedTypeOf(ele));
        return;
    }
    if (useOptions) {
        ele.options.length = 0;
    }
    else {
        while (ele.childNodes.length > 0) {
            ele.removeChild(ele.firstChild);
        }
    }
};

/**
 * Create rows inside a the table, tbody, thead or tfoot element (given by id).
 * @see http://getahead.ltd.uk/dwr/browser/tables
 */
DWRUtil.addRows = function(ele, data, cellFuncs, options) {
    var orig = ele;
    ele = document.all(ele);
    if (ele == null) {
        DWRUtil.debug("addRows() can't find an element with id: " + orig + ".");
        return;
    }
    if (!DWRUtil._isHTMLElement(ele, ["table", "tbody", "thead", "tfoot"])) {
        DWRUtil.debug("addRows() can only be used with table, tbody, thead and tfoot elements. Attempt to use: " + DWRUtil._detailedTypeOf(ele));
        return;
    }
    if (!options) options = {};
    if (!options.rowCreator) options.rowCreator = DWRUtil._defaultRowCreator;
    if (!options.cellCreator) options.cellCreator = DWRUtil._defaultCellCreator;
    var tr, rowNum;
    if (DWRUtil._isArray(data)) {
        for (rowNum = 0; rowNum < data.length; rowNum++) {
            options.rowData = data[rowNum];
            options.rowIndex = rowNum;
            options.rowNum = rowNum;
            options.data = null;
            options.cellNum = -1;
            tr = DWRUtil._addRowInner(cellFuncs, options);
            if (tr != null) ele.appendChild(tr);
        }
    }
    else if (typeof data == "object") {
        rowNum = 0;
        for (var rowIndex in data) {
            options.rowData = data[rowIndex];
            options.rowIndex = rowIndex;
            options.rowNum = rowNum;
            options.data = null;
            options.cellNum = -1;
            tr = DWRUtil._addRowInner(cellFuncs, options);
            if (tr != null) ele.appendChild(tr);
            rowNum++;
        }
    }
};

/**
 * @private Internal function to draw a single row of a table.
 */
DWRUtil._addRowInner = function(cellFuncs, options) {
    var tr = options.rowCreator(options);
    if (tr == null) return null;
    for (var cellNum = 0; cellNum < cellFuncs.length; cellNum++) {
        var func = cellFuncs[cellNum];
        var reply = func(options.rowData, options);
        options.data = reply;
        options.cellNum = cellNum;
        var td = options.cellCreator(options);
        if (td != null) {
            if (reply != null) {
                if (DWRUtil._isHTMLElement(reply)) td.appendChild(reply);
                else td.innerHTML = reply;
            }
            tr.appendChild(td);
        }
    }
    return tr;
};

/**
 * @private Default row creation function
 */
DWRUtil._defaultRowCreator = function(options) {
    return document.createElement("tr");
};

/**
 * @private Default cell creation function
 */
DWRUtil._defaultCellCreator = function(options) {
    return document.createElement("td");
};

/**
 * Remove all the children of a given node.
 * @see http://getahead.ltd.uk/dwr/browser/tables
 */
DWRUtil.removeAllRows = function(ele) {
    var orig = ele;
    ele = document.all(ele);
    if (ele == null) {
        DWRUtil.debug("removeAllRows() can't find an element with id: " + orig + ".");
        return;
    }
    if (!DWRUtil._isHTMLElement(ele, ["table", "tbody", "thead", "tfoot"])) {
        DWRUtil.debug("removeAllRows() can only be used with table, tbody, thead and tfoot elements. Attempt to use: " + DWRUtil._detailedTypeOf(ele));
        return;
    }
    while (ele.childNodes.length > 0) {
        ele.removeChild(ele.firstChild);
    }
};

/**
 * @private Is the given node an HTML element (optionally of a given type)?
 * @param ele The element to test
 * @param nodeName eg "input", "textarea" - check for node name (optional)
 *         if nodeName is an array then check all for a match.
 */
DWRUtil._isHTMLElement = function(ele, nodeName) {
    if (ele == null || typeof ele != "object" || ele.nodeName == null) {
        return false;
    }

    if (nodeName != null) {
        var test = ele.nodeName.toLowerCase();

        if (typeof nodeName == "string") {
            return test == nodeName.toLowerCase();
        }

        if (DWRUtil._isArray(nodeName)) {
            var match = false;
            for (var i = 0; i < nodeName.length && !match; i++) {
                if (test == nodeName[i].toLowerCase()) {
                    match = true;
                }
            }
            return match;
        }

        DWRUtil.debug("DWRUtil._isHTMLElement was passed test node name that is neither a string or array of strings");
        return false;
    }

    return true;
};

/**
 * @private Like typeOf except that more information for an object is returned other than "object"
 */
DWRUtil._detailedTypeOf = function(x) {
    var reply = typeof x;
    if (reply == "object") {
        reply = Object.prototype.toString.apply(x);  // Returns "[object class]"
        reply = reply.substring(8, reply.length-1);  // Just get the class bit
    }
    return reply;
};

/**
 * @private Array detector. Work around the lack of instanceof in some browsers.
 */
DWRUtil._isArray = function(data) {
    return (data && data.join) ? true : false;
};

/**
 * @private Date detector. Work around the lack of instanceof in some browsers.
 */
DWRUtil._isDate = function(data) {
    return (data && data.toUTCString) ? true : false;
};

/**
 * @private Used by setValue. Gets around the missing functionallity in IE.
 */
DWRUtil._importNode = function(doc, importedNode, deep) {
    var newNode;

    if (importedNode.nodeType == 1 /*Node.ELEMENT_NODE*/) {
        newNode = doc.createElement(importedNode.nodeName);

        for (var i = 0; i < importedNode.attributes.length; i++) {
            var attr = importedNode.attributes[i];
            if (attr.nodeValue != null && attr.nodeValue != '') {
                newNode.setAttribute(attr.name, attr.nodeValue);
            }
        }

        if (typeof importedNode.style != "undefined") {
            newNode.style.cssText = importedNode.style.cssText;
        }
    }
    else if (importedNode.nodeType == 3 /*Node.TEXT_NODE*/) {
        newNode = doc.createTextNode(importedNode.nodeValue);
    }

    if (deep && importedNode.hasChildNodes()) {
        for (i = 0; i < importedNode.childNodes.length; i++) {
            newNode.appendChild(DWRUtil._importNode(doc, importedNode.childNodes[i], true));
        }
    }

    return newNode;
}

/**
 * Used internally when some message needs to get to the programmer
 */
DWRUtil.debug = function(message) {
    alert(message);
}
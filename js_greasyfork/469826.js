// ==UserScript==
// @name         预审助手
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  预审小助手
// @author       You
// @match        http://172.20.233.155:7016/iaic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469826/%E9%A2%84%E5%AE%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469826/%E9%A2%84%E5%AE%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //v0.18 优化fetch请求相关函数
    //预审Preliminary
    Preliminary();
    let updateUrl = 'https://greasyfork.org/zh-CN/scripts/469826-%E9%A2%84%E5%AE%A1%E5%8A%A9%E6%89%8B';
    let sotpArr = ['天同食品','泰鲁','群盈','国尧','访惠汽车','东进中小','汇智信','风清气正（临沂）产业发展有限公司'];//限制办理业务企业名单，可写部分名称，也可写全称
    let findArr = ['实业', '发展', '建设', '传媒', '科技', '工程', '实业发展', '集团','资本投资'];
    //let recoArr = ['山东','临沂','河东','兰山','罗庄','沂河新区','高新','保税区','兰陵','沂南','沂水','莒南','临沭','郯城','费县','平邑','蒙阴县'];
    let findArray = ['制造','生产','加工','危险','化工','化学','投资','金融','融资','破产清算','0'];//禁用的关键字，可增加
    let queryAllListData;
    function Preliminary(){//预审主函数
        let intervalId = setInterval(function(){
            let url = window.location.pathname;
            if(url==='/iaic/jsp/iaic/wsdj/qydj/qydjywsbsq_list.jsp'){
                //复制预审列表公司名称
                let p = document.querySelector('#L5-gen40').value;
                copyNameList(p);
                clearInterval(intervalId);
            }
            let flage = getTabs();
            if(flage==1){//设立
                console.log('设立');
                addCopyInput();
                let copyInput = document.querySelector('#copyInput');
                getBusiness();
                let entName = document.querySelector('#if0').contentDocument.querySelector('#ENTNAME');
                queryMc(entName.value);
                clearInterval(intervalId);

            }else if(flage == 2){
                console.log('变更');
                clearInterval(intervalId);
                bgCompanyName();



            }
            else if(flage == 3){
                console.log('一般注销');
                clearInterval(intervalId);
                zxCompanyName();
            }
        } ,800);

    }

    let pl= 0;
    function copyNameList(p){//个性化预审列表，逻辑判断
        setTimeout(function(){

            let newP = document.querySelector('#L5-gen40');
            let to = document.querySelectorAll('tbody')[13];
            //to = document.querySelector('#L5-comp-1016').querySelectorAll('tr td[id]');
            if("?ENTCLASS=6" == window.location.search){
                to = document.querySelectorAll('tbody')[4];//合作社界面的to 工具栏不是13号位
            }
            if("?ENTCLASS=1" == window.location.search){
                to = document.querySelectorAll('tbody')[3];//内资界面的to 工具栏不是13号位
            }
            let num = 0;
            let btnlist = document.querySelectorAll('button');
            for(let i = 0;i<btnlist.length;i++){
                btnlist[i].addEventListener('click',clickTbody);
            }

            to.addEventListener('click',function(){
                document.querySelector('#entname').value=''
            });
            newP.addEventListener('focusin',isChangeNum1);
            newP.addEventListener('focusout',isChangeNum2);//数字框失去焦点，说明改动数字（不严谨）
            function isChangeNum1(){
                //console.log('获得焦点');
                num =document.querySelector('#L5-gen40').value;
                //console.log('原页数:',num);
            }
            function isChangeNum2(){
                //console.log('失去焦点');
                let newNum =document.querySelector('#L5-gen40').value;
                //console.log('新页数:',newNum);
                //console.log('num=',num,'newNum=',newNum);
                if(num!=newNum&&num!=0){
                    num=newNum;
                    clickTbody();
                }
                num=newNum;
            }
            function clickTbody(){
                pl++;
                //copyNameList(newP);
                console.log('检测到翻页');
                getCount();
                setTimeout(function(){getNameList();},300);

            }
            if(pl===0){
                console.log('界面初始化');
                getCount();
                getNameList();
            }


        },800);

    }
    function getNameList(){//个性化预审列表


        if(!document.querySelector('#zsUpdate')){
            //更新按钮
            let update = document.createElement('button');
            update.textContent = '助手更新';
            update.id = 'zsUpdate';
            update.style="cursor:pointer;";
            update.onclick = function(){
                window.open(updateUrl,'_blank');
            }
            document.querySelector('#L5-comp-1054 table td').append(update);

            //切换按钮，切换 【公司】、【内资】、【合作社】
            let gsButton = document.createElement('button');
            gsButton.textContent = '公司';
            gsButton.id = 'gsButton';
            gsButton.style="margin-left: 33%;cursor:pointer;";
            gsButton.onclick = function(){
                window.location.href='http://172.20.233.155:7016/iaic/jsp/iaic/wsdj/qydj/qydjywsbsq_list.jsp?ENTCLASS=2';
            }
            document.querySelector('#L5-comp-1054 table td').append(gsButton);

            let nzButton = document.createElement('button');
            nzButton.textContent = '内资';
            nzButton.id = 'nzButton';
            nzButton.style="margin: 0 0 0 1%;cursor:pointer;";
            nzButton.onclick = function(){
                window.location.href='http://172.20.233.155:7016/iaic/jsp/iaic/wsdj/qydj/qydjywsbsq_list.jsp?ENTCLASS=1';
            }
            document.querySelector('#L5-comp-1054 table td').append(nzButton);

            let hzsButton = document.createElement('button');
            hzsButton.textContent = '合作社';
            hzsButton.id = 'hzsButton';
            hzsButton.style="margin: 0 0 0 1%;cursor:pointer;";
            hzsButton.onclick = function(){
                window.location.href='http://172.20.233.155:7016/iaic/jsp/iaic/wsdj/qydj/qydjywsbsq_list.jsp?ENTCLASS=6';
            }
            document.querySelector('#L5-comp-1054 table td').append(hzsButton);
            let disBtn='';
            if('?ENTCLASS=2' == window.location.search){
                disBtn = gsButton;
            }
            if('?ENTCLASS=6' == window.location.search){
                disBtn = hzsButton;
            }
            if('?ENTCLASS=1' == window.location.search){
                disBtn = nzButton;
            }

            disBtn.disabled = true;//当前界面禁用跳转

            //数据统计
            let countSpan = document.createElement('span');
            countSpan.id = 'countSpan';
            countSpan.style = "margin: 0 0 0 1%;cursor:pointer;";
            countSpan.title = '点击可刷新数据';
            countSpan.textContent = '数据统计： 总数，退回重报，我退回的，今日新报 ';

            document.querySelector('#L5-comp-1054 table td').append(countSpan);

            countSpan.onclick = function(){
                getCount();
            };


        }


        let list = document.querySelectorAll('.l-grid3-col-ENTNAME');// l-grid3-col-3 l-grid3-td-OPETYPENAME 公司名称
        let clist = document.querySelectorAll('.l-grid3-col-3');//民营企业快速通道
        let olist = document.querySelectorAll('.l-grid3-td-OPETYPENAME');//业务类型
        let copyInp = document.querySelector('#entname');
        //let appDate = document.querySelectorAll('.l-grid3-col-APPDATE')//申请时间
        //let opper = document.querySelectorAll('.l-grid3-col-OPPER');//退回人
        let otype;
        //*******************
        document.querySelector('.l-grid3-hd-APPDATE').textContent='申请日期/代理人';
        document.querySelector('.l-grid3-td-OPPER').textContent='退回人/在看人';
        document.querySelector('.l-grid3-hd-3').textContent = '业务类型';

        //*******************
        for(let i = 0 ;i<list.length;i++){
            list[i].addEventListener('click',copylist);
            let otype = olist[i+1].textContent;
            if(otype=="设立登记"){
                list[i].style = 'color: rgb(102 185 111);';
            }

            if(otype=="注销登记"||otype=="一般注销"||otype=="简易注销"){
                list[i].style = 'color: #b5b1b1;';
            }
            if(otype=="备案"){
                list[i].style = 'color: rgb(255 129 0);';
            }
            if(otype=="增补换照"){
                list[i].style = 'color: #0400ff;';
            }
            clist[i].textContent = olist[i+1].textContent;
            function copylist(){
                copyInp.value = this.textContent;
                copyInp.select();
                document.execCommand('copy');
            }


        }
    }

    function getCount(){

        queryAllList().then(data=>{
            //console.log(data.total,data.rows); // 这里你可以处理你的数据
            //退回时间 BACKDATE  申请日期 APPDATE   退回人  OPPER
            let total = data.total;
            //总数
            let backCount = 0;
            //退回重报数
            let myBackCount = 0;
            //我退回的
            let newDayCount = 0;
            //今日新报

            let backDateArray = new Array();
            //退回时间
            let opperArray = new Array();
            //退回人
            let newDay = getCurrentDateFormatted();//今天日期，格式"2024-09-03"
            for (let i = 0; i < data.rows.length; i++) {
                if (data.rows[i].BACKDATE) {
                    backDateArray[i] = data.rows[i].BACKDATE;
                }
                //console.log(data.rows[i].OPPER,data.rows[i].OPPER==null);
                if (data.rows[i].APPDATE) {
                    if(data.rows[i].APPDATE == newDay && data.rows[i].OPPER==null){//今日申报,需去掉退回的
                        newDayCount++;
                    }
                }
                if (data.rows[i].OPPER) {
                    if (data.rows[i].OPPER == window.userName) {//我退回的
                        myBackCount++;//我退回的第一种统计方法
                    }
                    opperArray[i] = data.rows[i].OPPER;
                }
            }
            backCount = opperArray.length;
            let backMap = countOccurrencesWithMap(opperArray);
            //console.log('aaa',backMap);
            let strr = '';

            backMap.forEach((value, key) => {
                //console.log(key, value);
                strr +=`${key}, ${value}\n`;
                if(key===window.userName){
                    myBackCount = value;//我退回的第二种统计方法
                }

            });
            document.querySelector('#countSpan').title = `点击可刷新数据\n${strr}`




            //****
            let str = `数据统计： 总数:${total}，退回重报:${backCount}，我退回的:${myBackCount}，未审核：${total-backCount}，往日未审:${total-backCount-newDayCount}，今日新报:${newDayCount}`;
            document.querySelector('#countSpan').textContent = str;;
            console.log(str);
            // console.log(1);

            //*****列表优化开始***简易/一般注销，退回/再看，代理****
            setTimeout(function(){
                let list = document.querySelectorAll('.l-grid3-col-ENTNAME');// l-grid3-col-3 l-grid3-td-OPETYPENAME 公司名称
                let appDate = document.querySelectorAll('.l-grid3-col-APPDATE')//申请时间
                let opper = document.querySelectorAll('.l-grid3-col-OPPER');//退回人
                let num = document.querySelector('#L5-gen40').value;//当前页数
                if(!list[0])return;
                console.log('当前页数',num,list[0].textContent);

                for(let j=(num-1)*10;j<(num-1)*10+list.length;j++){
                    if(data.rows[j].OPETYPE==50){//注销类型分类
                        //console.log('j=',j,data.rows[j].ENTNAME);
                        getPubDate(data.rows[j].PRIPID,j);
                    }

                    for(let p=0;p<list.length;p++){
                        //console.log(`【${data.rows[j].ENTNAME}】；【${list[p].textContent}】`);
                        if(data.rows[j].ENTNAME==list[p].textContent){//公司名称相同的话，提取代理名字
                            //console.log(`提取【${list[p].textContent}】代理${data.rows[j].APPLY_USER_NAME}`);
                            if(appDate[p].textContent.length<=11){//申请日期字符长度小于等于10，在添加，防止添加多次重复名字

                                if(data.rows[j].APPLY_USER_NAME.length>5){//手机端申报时，代理名字为乱码，如：ac5d0c3d2ac7416a8fa625fdd8b34c7d
                                    appDate[p].textContent += ` 手机端申报`;
                                }else{
                                    appDate[p].textContent += ` `+ data.rows[j].APPLY_USER_NAME;
                                }

                            }
                            //XX正在预审APPRPER、退回人OPPER
                            if(data.rows[j].OPPER!=data.rows[j].APPRPER||data.rows[j].OPPER==''){
                                if(opper[p].textContent.split('/').length==1){//不重复添加
                                    opper[p].textContent+= `/` + data.rows[j].APPRPER;
                                }

                            }



                        }
                    }
                }
            },250);



            //*******列表优化结束*****


        }
                           ).catch(error=>{
            console.error('There was a problem with your fetch operation:', error);
        }
                                  );
    }
    //***
    function countOccurrencesWithMap(arr) {  //统计数组各个元素出现的次数,实现各个人退回业务数量 ，用于getCount()
        const countMap = new Map();
        arr.forEach(item => {
            if (countMap.has(item)) {
                countMap.set(item, countMap.get(item) + 1);
            } else {
                countMap.set(item, 1);
            }
        });
        return countMap;
    }

    function getCurrentDateFormatted() {//用于getCount()
        const now = new Date();
        const year = now.getFullYear();
        // 获取完整的年份
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // 月份是从0开始的，所以要加1，并使用padStart来确保是两位数
        const day = String(now.getDate()).padStart(2, '0');
        // 使用padStart来确保是两位数
        return `${year}-${month}-${day}`;
    }

    function getTabs(){
        let etabArray = document.querySelectorAll('li em');
        if(etabArray.length ==0){return false;}
        let farenJobCreate,pnum,flage;
        if(etabArray[0].textContent =='基本信息'){
            flage = 1;//设立
            for(let i = 0 ;i<etabArray.length;i++){
                //console.log(i,etabArray[i].textContent);
                if(etabArray[i].textContent =='董监事会成员'){
                    etabArray[i].addEventListener('click',getDongJanshi);
                }else if(etabArray[i].textContent =='股东(发起人)'){
                    etabArray[i].addEventListener('click',getGudong);
                }else if(etabArray[i].textContent =='法定代表人'){
                    etabArray[i].addEventListener('click',getFaren);
                }else if(etabArray[i].textContent =='授权委托'){
                    etabArray[i].addEventListener('click',getWeituo);
                }
            }
        }else if(etabArray[0].textContent == '变更事项'){
            flage = 2;//变更
        }
        else if(etabArray[0].textContent == '注销信息'){
            flage = 3;//一般注销
        }


        function getWeituo(){
            setTimeout(function(){
                document.querySelector('#if6').contentDocument.querySelector('#CONSIGNER').addEventListener('click',copyWt);
                document.querySelector('#if6').contentDocument.querySelector('#CERNO').addEventListener('click',copyWt);
                document.querySelector('#if6').contentDocument.querySelector('#MOBTEL').addEventListener('click',copyWt);

            },500);

            function copyWt(){
                inputCopy(this.value);
            }
        }
        function getGudong(){
            setTimeout(function(){
                if(pnum==undefined){
                    pnum = document.querySelector('#if3').contentDocument.querySelectorAll('.l-grid3-col-INV').length;
                    console.log('方式',farenJobCreate,'人数',pnum);
                    opinion();
                }
            },500);
        }
        function getFaren(){
            setTimeout(function(){//03选举  01任命
                if(farenJobCreate==undefined){
                    farenJobCreate = parseInt(document.querySelector('#if1').contentDocument.querySelectorAll('#POSBRFORM')[0].value);
                    console.log(farenJobCreate);
                    opinion();
                }

            },500);

        }
        function opinion(){//意见：法定代表人产生方式是否正确
            if(farenJobCreate!=undefined &&pnum!=undefined){
                //比较
                if(pnum == 1 && farenJobCreate == 1){
                    console.log('任命');
                }else if(pnum>1&&farenJobCreate==3){
                    console.log('选举');
                }else{
                    alert(`法定代表人产生方式应修改为：${farenJobCreate==1?'选举':'任命'}`);
                    inputCopy(`法定代表人信息中，职务产生方式应修改为：${farenJobCreate==1?'选举':'任命'}`);
                }
            }

        }


        return flage;
    }

    function getDongJanshi(){
        setTimeout(function(){


            //获取董事经理iframe  姓名l-grid3-col-NAME  职务l-grid3-col-VIEW_POSITION
            //if(document.querySelector('#if2')){return false;}
            let if2Doc = document.querySelector('#if2').contentDocument;
            let personnelArray = if2Doc.querySelectorAll('.l-grid3-col-NAME');
            let copyFlag = if2Doc.querySelector('.l-grid3-hd-NAME').textContent;
            if(copyFlag == '姓名'){
                if2Doc.querySelector('.l-grid3-hd-NAME').textContent += 'copy';
            }
            //console.log(personnelArray);
            //给获取到的人员姓名绑定点击复制到剪贴板事件
            for(let i = 0 ;i<personnelArray.length;i++){
                personnelArray[i].addEventListener('click',myCopy);

            }
            return true;
        },500);


    }
    function myCopy(){
        //console.log("copy",event.target.textContent);
        //console.log(this.parentNode.nextElementSibling.textContent);
        //         let copyInput = document.querySelector('#copyInput');
        let oldName = event.target.textContent;
        let copyName = oldName;
        let office = this.parentNode.nextElementSibling.textContent;
        if( office=='财务负责人'){
            copyName += 'c';
        }else if(office == '监事'){
            copyName += 'j';
        }else if(office == '董事'||office == '执行董事'){
            copyName += 'd';
        }else if(office == '经理'){
            copyName += 'x';
        }else if(office == '总经理'){
            copyName += 'X';
        }else if(office == '董事长'){
            copyName += 'D';
        }else if(office == '监事长'){
            copyName += 'J';
        }
        /*         copyInput.value = copyName+' ';
        //copyInput.setAttribute("value",copyName+' ')
        copyInput.select();
        document.execCommand('copy'); */
        inputCopy(copyName+' ');
        let ele = this;
        event.target.textContent += ' copy';
        setTimeout(setOldName,1000);
        function setOldName(){
            ele.textContent = oldName;
        }

    }
    function getBusiness(){//判断经营范围中是否有禁止使用的经营范围
        let ENTNAME = document.querySelector('#if0').contentDocument.querySelector('#ENTNAME');
        //         ENTNAME.select();
        //         document.execCommand('copy');
        ENTNAME.addEventListener('click',copyEntname);
        function copyEntname(){
            //检查名称有没有陷阱
            let entName = document.querySelector('#if0').contentDocument.querySelector('#ENTNAME');
            let entType = document.querySelector('#if0').contentDocument.querySelector('#VIEW_ENTTYPE');
            //parseCompanyName(entName.value,entType.value);
            queryMc(entName.value)
            inputCopy(this.value);
        }
        let busscope1 = document.querySelector('#if0').contentDocument.querySelector('#busscope');
        let busscope = busscope1.value;

        busscope = busscope.replace("。","；");//先将句号替换为分号，便于后续分割
        //将一些固定语句替换为分号，起到删减无用语句与分割的作用
        busscope = busscope.replace("（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）","；");
        busscope = busscope.replace("（依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以相关部门批准文件或许可证件为准）","；");
        busscope = busscope.replace("（依法须经批准的项目，经相关部门批准后方可开展经营活动，具体经营项目以审批结果为准）","；");
        busscope = busscope.replace("一般项目：","");
        busscope = busscope.replace("许可项目：","");
        busscope = busscope.replace("园林绿化工程施工","");
        let busscopeArray = busscope.split('；')


        let outArray = new Array();
        let p=0;
        let msg=``;
        //console.log(busscopeArray);
        busscope1.addEventListener('click',busscopeWarn);
        function busscopeWarn(){
            for(let i=0;i<busscopeArray.length;i++){
                for(let j=0;j<findArray.length;j++){
                    if((busscopeArray[i].indexOf(findArray[j]))>=0){
                        console.log(`匹配到关键字【${findArray[j]}】相关范围：i=${i},j=${j},【${busscopeArray[i]}】`);
                        outArray[p++] = busscopeArray[i];
                        break;
                    }
                }
            }

            //过滤少数情况，同一条经营范围匹配多个关键词的情况，如：低温仓储（不含危险化学品等需许可审批的项目）同时匹配【危险】【化学】
            function noRepeat(arr){
                var newArr = [...new Set(arr)]; //利用了Set结构不能接收重复数据的特点
                return newArr;
            }

            outArray = noRepeat(outArray);
            let outStr =``;
            for(let i=0;i<outArray.length;i++){
                outStr +=outArray[i]+'\n';
            }
            //console.log(outArray);
            if(outArray.length>0){
                msg =`以下${outArray.length}个经营范围禁止经营，请修改相关经营范围：\n  `+outStr;
                console.log(msg);
                alert(msg);
                //自动复制到剪切板
                inputCopy(msg);
                msg='';
                outArray = [];
                p=0;
            }else{
                copyInput.value = "经营范围符合规范";
            }
        }
    }
    function inputCopy(str){//复制传入的字符串
        copyInput.value = str;
        copyInput.select();
        document.execCommand('copy');
    }
    function addCopyInput(){
        //复制到剪切板，document.execCommand API，参考链接https://juejin.cn/post/7124148497917411335
        //原理是复制Input中的值，所以需要新建一个input，把需要复制的值赋值过去，再复制
        if(document.querySelector('#copyInput')==null){
            let copyInput = document.createElement('input');
            copyInput.id = 'copyInput';
            copyInput.style = 'position:fixed;right: 78%;bottom: 93%;';
            let parentEle = document.querySelector('body');
            parentEle.append(copyInput);
            copyInput.addEventListener('click',showMenu);
            let textarea = document.createElement('div');
            textarea.id = 'textarea';
            //textarea.style = 'position:fixed;right: 50%;bottom: 40%;display:none;height: 40%;width: 40%;background:#f5f5f9 /*radial-gradient(#a19d9d, transparent)*/;';
            textarea.style ='position:fixed;right: 39%;bottom: 25%;display:none;height: 60%;width: 40%;background:radial-gradient(rgb(245 245 245), transparent);';
            parentEle.append(textarea);
            function showMenu(){
                let elem = document.querySelector('#textarea');
                if(elem!=null){
                    elem.style.display = (elem.style.display=='none')?'block':'none';
                    //console.log(elem);
                    elem.addEventListener('click',renderData);
                    renderData();
                }
            }
            let gudongArray = new Array();;
            function renderData(){
                //动态渲染数据
                let doc0 =document.querySelector('#if0').contentDocument;
                console.log(entname.indexOf('有限公司'),entname.length);
                if(entname.indexOf('山东')>=0&&doc0.querySelector('#regcap').value<300){//判断山东开头注册资本大于300万元
                    if(entname.length-entname.indexOf('有限公司')>=4){//排除分公司
                        alert("山东 开头，注册资本必须大于300万元");
                        inputCopy('山东 开头，注册资本必须大于300万元');
                    }
                }
                let doc1,doc2,doc3,doc4,doc6,jianshiArray,jingli,caiwu,dongshiArray;
                jianshiArray = new Array();
                dongshiArray= new Array();
                //gudongArray = new Array();
                let d = 1,j=1,g=0,p=0;
                if(document.querySelector('#if1')){
                    doc1 = document.querySelector('#if1').contentDocument;
                }
                if(document.querySelector('#if2')){
                    doc2 = document.querySelector('#if2').contentDocument;
                    let personnelArray = doc2.querySelectorAll('.l-grid3-col-NAME');
                    for(let i=0;i<personnelArray.length;i++){
                        let brothersNode = personnelArray[i].parentNode.nextElementSibling.textContent;

                        if(brothersNode.indexOf('监事')>=0){
                            //console.log('find jianshi ',brothersNode,personnelArray[i].textContent);
                            if(brothersNode.indexOf('监事长')>=0){
                                jianshiArray[0] = personnelArray[i].textContent;
                            }else{
                                jianshiArray[j++] = personnelArray[i].textContent;
                            }
                        }
                        if(brothersNode.indexOf('经理')>=0){
                            jingli = personnelArray[i].textContent;

                        }
                        if(brothersNode=='财务负责人'){
                            caiwu = personnelArray[i].textContent;
                        }
                        if(brothersNode.indexOf('董事')>=0){
                            if(brothersNode.indexOf('董事长')>=0){
                                dongshiArray[0] = personnelArray[i].textContent;
                            }else{
                                dongshiArray[d++] = personnelArray[i].textContent;
                            }
                        }
                        //console.log(personnelArray[i].textContent,brothersNode);
                    }
                    d = 1;
                    j=1;
                    g=0;
                }

                if (document.querySelector('#if3')) {
                    //股东列表
                    let gudong = document.querySelector('#if3').contentDocument.querySelectorAll('.l-grid3-col-INV');

                    doc3 = document.querySelector('#if3').contentDocument;
                    // gudong = doc3.querySelectorAll('.l-grid3-col-INV');
                    // console.log('111',gudongArray);

                    if(gudongArray.length<1){
                        for(let i=0;i< gudong.length;i++){
                            gudongArray[i] = gudong[i].textContent;
                        }
                    }

                    let check = document.querySelector('#if3').contentDocument.querySelector('#L5-comp-1009');//查看按钮
                    check.addEventListener('click', function() {
                        //监听查看按钮，获取股东名称、出资额、出资时间

                        let name = document.querySelector('#if3').contentDocument.querySelector('#INV').value;
                        let money = document.querySelector('#if3').contentDocument.querySelector('#SUBCONAM').value;
                        let time = document.querySelector('#if3').contentDocument.querySelector('#CONDATE').value;
                        let count = gudongArray.length;
                        for(let i=0;i<gudongArray.length;i++){
                            if(typeof gudongArray == 'string'){
                                if(name == gudongArray){
                                    gudongArray += ` ${money}万${time}`;
                                }
                            }else if(name == gudongArray[i]){
                                gudongArray[i] += ` ${money}万${time}`;
                            }

                        }
                        console.log('click',name);
                        console.log(gudongArray);
                    });

                }

                if(document.querySelector('#if4')){
                    doc4 = document.querySelector('#if4').contentDocument;
                }
                if(document.querySelector('#if6')){
                    doc6 = document.querySelector('#if6').contentDocument;
                }
                if(!jianshiArray[0]){//如果数组第一个为空，即无监事长
                    let jianshi = jianshiArray[1];
                    jianshiArray = null;
                    jianshiArray = jianshi;
                }
                if(!dongshiArray[0]){//如果数组第一个为空，即无董事长
                    let dongshi = dongshiArray[1];
                    dongshiArray = null;
                    dongshiArray = dongshi;

                }
                if(gudongArray.length ==1){
                    let gudong = gudongArray[0];
                    gudongArray = null;
                    gudongArray = gudong;
                }

                let firmInfo={
                    '公司名称':`${entname}`
                    ,'经营范围':`${doc0.querySelector('#busscope')}`
                    ,'注册资本':`${doc0.querySelector('#regcap').value}`
                    ,'经营地址':`${doc0.querySelector('#dom').value}`
                    ,'股东':`${doc3==undefined?'':gudongArray}`
                    ,'法人':`${doc0.querySelector('#lerep').value}`
                    ,'任职':`${doc1==undefined?'':parseInt(document.querySelector('#if1').contentDocument.querySelectorAll('#POSBRFORM')[0].value)==3?'选举':'任命'}`
                    ,'董事':`${doc2==undefined?'':dongshiArray}`
                    ,'经理':`${doc2==undefined?'':(!jingli)?'':jingli}`
                    ,'监事':`${doc2==undefined?'':(!jianshiArray)?'':jianshiArray}`
                    ,'联络员':`${doc4==undefined?'':doc4.querySelector('#name').value}`
                    ,'委托代理人':`${doc6==undefined?'':doc6.querySelector('#CONSIGNER').value}`
                    ,'财务':`${doc2==undefined?'':caiwu}`
                };
                let str = '';
                let namelist = new Array();
                namelist[0]=firmInfo['法人'];

                //console.log(namelist);
                let bglist = ['#ffffff','#deecfd','#fdeede','#ed6666','#4cf380','#e1fdbd','','#8d95ef','#fbc500'];
                for(let i in firmInfo){
                    //console.log(i,firmInfo[i]);
                    if(!firmInfo[i]){
                        firmInfo[i]=`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
                    }

                    if(firmInfo[i].indexOf(',')>0){//字符串中有逗号，多股东、董事、监事情况
                        if(i=='法人'||i=='财务'||i=='监事'||i=='董事'||i=='股东'||i=='联络员'||i=='委托代理人'||i=='经理'){
                            let array = firmInfo[i].split(',');
                            str +=`<button>${i}:</button>&nbsp;`;
                            for(let j=0;j<array.length;j++){
                                for(p = 0;p<namelist.length;p++){
                                    let gd = array[j].split(' ')[0];
                                    let gd_str = array[j].split(' ')[1];
                                    if(gd_str==undefined||gd_str=='undefined'){
                                        gd_str = `&nbsp;`;
                                    }
                                    if(p==0&&j==0){
                                        str += `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
                                    }else if(p==0){
                                        str += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
                                    }
                                    /*                                     if(i=='股东'){
                                        array[j] = gd;
                                    } */
                                    if(namelist[p]==array[j]){
                                        if(i=='股东'){
                                            str += `<button name = ${p} style='background : ${bglist[p]}'>${gd}</button>\n`;
                                            str += `<button name = ${p} style='background : '>${gd_str}</button>\n<br>`;

                                        }else{
                                            str += `<button name = ${p} style='background : ${bglist[p]}'>${array[j]}</button>\n`;
                                        }
                                        break;
                                    }else{
                                        if(p == namelist.length-1){
                                            //namelist[++p]=array[j];
                                            if(i=='股东'){
                                                str += `<button name = ${p} style='background : ${bglist[p]}'>${gd}</button>\n`;
                                                str += `<button name = ${p} style='background : '>${gd_str}</button>\n<br>`;
                                            }else{
                                                str += `<button name = ${p} style='background : ${bglist[p]}'>${array[j]}</button>\n`;
                                            }
                                        }
                                    }
                                }

                            }
                            str += `\n<br>`;

                        }
                    }else{//字符串firmInfo[i]中无逗号，只有一人
                        if(i=='法人'||i=='财务'||i=='监事'||i=='董事'||i=='股东'||i=='联络员'||i=='委托代理人'||i=='经理'){
                            let array = firmInfo[i];
                            if(i=='股东'){
                                array = firmInfo[i].split(' ')[0];
                            }

                            for(p = 0;p<namelist.length;p++){
                                let gd = firmInfo[i].split(' ')[0];
                                let gd_str = firmInfo[i].split(' ')[1];
                                if(gd_str==undefined||gd_str=='undefined'){
                                    gd_str = `&nbsp;`;
                                }

                                if(namelist[p]==array){
                                    if(i=='股东'){
                                        //console.log('同色');
                                        ///***************
                                        str += `<button>${i}<button name = ${p} style='background : ${bglist[p]}'>${gd}</button>\n`;
                                        str += `<button name = ${p} style='background : ${bglist[p]}'>${gd_str}</button>\n<br>`;
                                    }else{
                                        str+= `<button>${i}:</button>&nbsp;<button name = ${p} style='background : ${bglist[p]}'>${firmInfo[i]}</button>\n<br>`;
                                    }


                                    break;
                                }else{
                                    if(p==namelist.length-1){
                                        //console.log('新色');
                                        namelist[++p] = firmInfo[i];
                                        str+= `<button>${i}:</button>&nbsp;<button name = ${p} style='background : ${bglist[p]}'>${firmInfo[i]}</button>\n<br>`;
                                    }

                                    //namelist[++p]=firmInfo[i];

                                }
                            }
                        }else{
                            str+= `<button>${i}:</button>&nbsp;<button >${firmInfo[i]}</button>\n<br>`;
                        }

                        //str+= `${i}:${firmInfo[i]}\n\n`;
                    }
                }
                //console.log('namelist',namelist);
                // console.log(str);
                this.innerHTML = str;
                //this.textContent  = str;
            }

        }
    }

    function bgCompanyName(){//变更业务中公司名称检查
        let ComName = document.querySelector('#if0').contentDocument.querySelector('#ALTAF').value;
        if(ComName==''){
            ComName = document.querySelector('#if0').contentDocument.querySelector('#ALTBE').value;
        }
        //分公司需额外判断获取
        let fenGS = document.querySelector('#if0').contentDocument.querySelector('#ALTAFIMG1');
        if(fenGS){
            ComName = fenGS.parentElement.previousElementSibling.children[1].value;
        }
        if(!ComName){
            ComName = fenGS.parentElement.children[1].value;
        }
        queryMc(ComName);

    }
    function zxCompanyName(){//注销业务中公司名称检查
        let ComName = document.querySelector('#if0').contentDocument.querySelector('#ENTNAME').textContent;
        queryMc(ComName);
    }
    function getRegcap() {//变更业务获取注册资本，用于后续判断名称中区划与注册资本是否匹配
        let xm = document.querySelector('#if0').contentDocument.querySelectorAll('.FieldLabel');
        let regcap;
        for (let i = 0; i < xm.length; i++) {
            if ('注册资本' === xm[i].textContent||'认缴出资额'=== xm[i].textContent) {
                //console.log(i);
                regcap = xm[i];
                break;
            }
        }
        //console.log(regcap);
        let oldRegcap = regcap.nextElementSibling.children[1].value;
        let newRegcap = regcap.nextElementSibling.nextElementSibling.children[1].value;
        //console.log(oldRegcap,!newRegcap);
        regcap = oldRegcap;
        if (newRegcap) {
            regcap = newRegcap;
        }
        console.log('注册资本', regcap);
        return regcap;
    }
    function queryMc(entname){//名称检查
        let nameDistrict, enttra, nameind, orgform;//区划 字号 行业 组织形式

        queryMcjbxxZs(entname).then(data=>{
            // 处理成功获取到的数据
            console.log('数据获取成功:', data);
            enttra = data.enttra;
            nameind = data.nameind;
            orgform = data.orgform;
            const entName = entname;

            entname = entname.replace('（有限合伙）','');
            //entname = entname.replace('（个人独资）','');
            entname = entname.replace(data.enttra,'');
            entname = entname.replace(data.nameind,'');
            entname = entname.replace(data.orgform,'');//个人独资的组织形式特殊，必须在去括号前
            entname = entname.replace('（','');
            entname = entname.replace('）','');            
            nameDistrict = entname;
            if(!enttra){//获取不到字号，说明是分公司，处理不了区划
                nameDistrict = '';
            }
            console.log(`获取区划【${nameDistrict}】`);
            //检查名称注册资本是否匹配 山东/300
            if('专业合作社'!=orgform && nameDistrict && document.querySelectorAll('li em')[0].textContent === '变更事项'){//排除分公司 and 合作社 ，必须是变更业务
                let regcap =getRegcap();//
                if(nameDistrict.indexOf('山东')>=0 && regcap<300){
                    alert('区划为【山东】，公司注册资本需300万以上！！');
                }else{
                    console.log(`区划【${nameDistrict}】，注册资本【${regcap}】万，名称与注册资本匹配`);
                }
            }
            //console.log(`${nameDistrict}, ${enttra}, ${nameind}, ${orgform}`);
            parseCompanyName(entName,nameDistrict, enttra, nameind, orgform);//检查名称
            if(document.querySelector('li em').textContent ==='基本信息'){//设立时复制字号
                let mcly = document.querySelector('#if0').contentDocument.querySelector('#mcly');
                if(enttra.length<=5){//字号应不超过5个汉字

                    mcly.textContent += '   单击复制字号：'+enttra;
                    mcly.addEventListener('click',copyEnttra);
                    function copyEnttra(){
                        inputCopy(enttra);
                    }
                }
            }


        }).catch(error=>{
            // 处理错误
            console.error('数据获取失败:', error);
        }
                );
    }
    function parseCompanyName(entname, nameDistrict, enttra, nameind, enttype) {//全称、区划、字号、行业、组织形式
        //将传入的企业名称，同时传入公司类型  进行检查0、是否为限制做业务的企业 1、集团2、五大行业3、无区划
        //解析名字：区划、字号、行业、组织形式

        let str = '警惕名称中的陷阱！！！';
        let flage = false;
        let reco = -1;
        //名称有陷阱，则true
        console.log(`${entname}=>\n区划【${nameDistrict}】,字号【 ${enttra}】, 行业【${nameind}】,组织形式【${enttype}】`);
        //是否是限制做业务的企业sotpArr
        for(let i=0;i<sotpArr.length;i++){
            if(entname.indexOf(sotpArr[i]) >= 0){//找到限制企业
                alert("该企业为限制名单中禁止做业务的企业，禁止预审！！！");
                return;
            }
        }

        if(enttype){//组织形式为分公司，或者queryMcjbxxZs()获取不到字号信息
            if(enttype.indexOf('分公司')>=0||!enttra){
                console.log('分公司，不做判断');
                return;//*********************分公司不限制区划***
            }
        }else{
            if(!enttra){
                console.log('分公司，不做判断');
                return;//*********************分公司不限制区划***
            }
        }
        //若是 查询不到 山东、临沂、河东字样，怀疑为无字号。除了分公司
        for (let i = 0; i < findArr.length; i++) {
            if(!nameind){
                str +=`【无行业】`;
                flage = true;
                break;
            }
            if (nameind == findArr[i]) {//找到行业
                str += `【${findArr[i]}】`;
                flage = true;
            }

        }
        if(enttype){//集团在组织形式中，单独判断
            if(enttype.indexOf('集团')>=0){
                str += `【集团】`;
                flage = true;
            }
        }
        if(!nameDistrict){//无区划
            str +=`【无区划】`;
            flage = true;
        }
        if (flage) {
            console.log(str);
            alert(str);
            flage = false;
        }


    }
    //**********************根据公司名称，获取企业：区划、字号、行业、组织形式

    //****queryFetch begin***
    let fetchUrl, body;
    async function queryAllList() {
        //获取预审列表
        try {
            fetchUrl = "http://172.20.233.155:7016/iaic/command/ajax/com.inspur.iaic.qcdzh.wsdj.common.cmd.QcdzhComQueryCmd";
            body = JSON.stringify({
                "params": {
                    "javaClass": "org.loushang.next.data.ParameterSet",
                    "map": {
                        "ENTNAME": document.querySelector('#entname').value,
                        "ENTCLASS": window.location.href.split('=')[1],
                        "start": 0,
                        "limit": !document.querySelector('#L5-gen41') ? 200 : (document.querySelector('#L5-gen41').textContent.replace('页 共 ', '').replace(' 页', '') * 1 + 1) * 10,
                    }
                }
            });
            // 在这里处理data
            const data = await queryFetch(fetchUrl, body);
            console.log('queryAllList成功获取数据:', data);

            return data;
        } catch (error) {
            console.error('在queryAllList中捕获到错误:', error);
            // 在这里处理错误，比如显示错误消息给用户
        }
    }
    async function getPubDate(PRIPID,j) {
        //根据PRIPID查询简易注销日期queryMcjbxxZs(entname) data.rows[j].PRIPID ;type data.map.ifpubflag==1 简易注销
        try {
            fetchUrl = "http://172.20.233.155:7016/iaic/command/ajax/com.inspur.iaic.qydj.cmd.QydjZsCmd/getPubDate";
            body = JSON.stringify({
                "params": {
                    "javaClass": "ParameterSet",
                    "map": {
                        "id": PRIPID
                    }
                }
            });

            const data = await queryFetch(fetchUrl, body);
            console.log('getPubDate成功获取数据:', data.map);
            // 在这里处理data
            let clist = document.querySelectorAll('.l-grid3-col-3');
            //业务类型
            let list = document.querySelectorAll('.l-grid3-col-ENTNAME');

            // l-grid3-col-3 l-grid3-td-OPETYPENAME 公司名称
            j = j%10;
            //console.log(clist[j],j);
            if (data.map.ifpubflag == 1) {
                console.log(`【${list[j].textContent}】简易注销`);
                clist[j].textContent = "简易注销";
            } else {
                console.log(`【${list[j].textContent}】一般注销`);
                clist[j].textContent = "一般注销";
                list[j].style = 'color: #b5b1b1;font-style: italic;';
            }
            return data.map;
        } catch (error) {
            console.error('在getPubDate中捕获到错误:', error);
            // 在这里处理错误，比如显示错误消息给用户
        }
    }
    async function queryGuDong() {
        //根据主键window.OPENO获取股东信息
        try {
            fetchUrl = "http://172.20.233.155:7016/iaic/command/ajax/com.inspur.iaic.wsdj.comm.cmd.ComQueryCmd/query";
            body = JSON.stringify({
                "params": {
                    "map": {
                        "args": {
                            "javaClass": "HashMap",
                            "map": {
                                "jspCode": "QYDJ_CZXX_EDIT",
                                "tblName": "QYDJ_CZXX_LC",
                                "OPENO": window.OPENO
                            }
                        }
                    }
                }
            });

            const data = await queryFetch(fetchUrl, body);
            console.log('queryGuDong成功获取数据:', data.rows);
            // 在这里处理data
            return data.rows;
        } catch (error) {
            console.error('在queryGuDong中捕获到错误:', error);
            // 在这里处理错误，比如显示错误消息给用户
        }
    }

    async function queryMcjbxxZs(entname) {
        //根据公司名称获取核名信息
        if (!entname)
            return;
        try {
            fetchUrl = "http://172.20.233.155:7016/iaic/command/ajax/com.inspur.iaic.common.dj.cmd.ComDmCmd/queryMcjbxxZs";
            body = JSON.stringify({
                "params": {
                    "javaClass": "ParameterSet",
                    "map": {
                        "entname": entname
                    }
                }
            });
            const data = await queryFetch(fetchUrl, body);
            console.log('queryMcjbxxZs成功获取数据:', data.map.mcMsg.map);
            // 在这里处理data
            return data.map.mcMsg.map;
        } catch (error) {
            console.error('在queryMcjbxxZs中捕获到错误:', error);
            // 在这里处理错误，比如显示错误消息给用户
        }
    }
    async function queryFetch(fetchUrl, body) {
        try {
            const response = await fetch(fetchUrl, {
                method: "POST",
                'body': body
            });
            if (!response.ok) {
                throw new Error('网络相应不正常！');
            }
            const data = await response.json();
            return data;

        } catch (error) {
            console.error('请求出错:', error);
            throw error;
        }
    }


    //****queryFetch end***




})();
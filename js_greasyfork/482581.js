// ==UserScript==
// @name         选课插件2.0
// @namespace    http://tampermonkey.net/
// @version      2.9.5
// @description  面向暨南大学选课系统
// @author       Schilings
// @match        *://jwxk.jnu.edu.cn/xsxkapp/sys/xsxkapp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      AGPL-3.0-or-later
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/482581/%E9%80%89%E8%AF%BE%E6%8F%92%E4%BB%B620.user.js
// @updateURL https://update.greasyfork.org/scripts/482581/%E9%80%89%E8%AF%BE%E6%8F%92%E4%BB%B620.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //'refreshPage','refreshToken','None'
    unsafeWindow.autoRefresh = 'None';

    if (!window.location.href.includes('token')){
        if(autoRefresh === 'refreshPage' && window.location.href === BaseUrl + '/sys/xsxkapp/*default/index.do'){
            $.bhTip({content: "autoRefresh : " + autoRefresh,state: 'success'});
            var onreadystatechange = function () {
                $("#courseBtn").click();
            }
            window.onload = onreadystatechange;
            setTimeout(onreadystatechange,3000);
        }

        return;
    }



    var GlobalParam = {};
    function initGlobal(){
        GlobalParam.studentInfo=JSON.parse(sessionStorage.getItem('studentInfo'));
        GlobalParam.index = -1;
        GlobalParam.menu=[
            //state:'stopped','running','interrupted'
            {input0 :null,input1:null,input2:null,input3:null,input4:null,msg:null,button0:null,button1:null,button2:null,teacherName1:null,teacherName2:null,state:'stopped',stop:null},
            {input0 :null,input1:null,input2:null,input3:null,input4:null,msg:null,button0:null,button1:null,button2:null,teacherName1:null,teacherName2:null,state:'stopped',stop:null},
            {input0 :null,input1:null,input2:null,input3:null,input4:null,msg:null,button0:null,button1:null,button2:null,teacherName1:null,teacherName2:null,state:'stopped',stop:null},
            {input0 :null,input1:null,input2:null,input3:null,input4:null,msg:null,button0:null,button1:null,button2:null,teacherName1:null,teacherName2:null,state:'stopped',stop:null},
            {input0 :null,input1:null,input2:null,input3:null,input4:null,msg:null,button0:null,button1:null,button2:null,teacherName1:null,teacherName2:null,state:'stopped',stop:null},
        ];

        var store = sessionStorage.getItem('GlobalParam.store');
        store = store != null?JSON.parse(store): null;
        if (store != null && Array.isArray(store) && store.length > 0){
            GlobalParam.store = store;
        }else{
            GlobalParam.store=[
                {tid :null,tcn:null,ttn:null,did:null,dcn:null,dtn:null,state:'stopped'},
                {tid :null,tcn:null,ttn:null,did:null,dcn:null,dtn:null,state:'stopped'},
                {tid :null,tcn:null,ttn:null,did:null,dcn:null,dtn:null,state:'stopped'},
                {tid :null,tcn:null,ttn:null,did:null,dcn:null,dtn:null,state:'stopped'},
                {tid :null,tcn:null,ttn:null,did:null,dcn:null,dtn:null,state:'stopped'},
            ];
        }
    }


    function initConsole(){
        // 添加样式
        GM_addStyle(`
        #floating-console-viewer {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 50%;
            height: 300px;
            overflow-y: auto;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px;
            font-family: Monaco, Consolas, "Lucida Console", monospace;
            z-index: 9999;
            resize:both;
            cursor: move;
        }

        #floating-console-viewer p {
            margin: 0;
            padding: 5px 0;
        }
        `);

        // 创建展示框元素
        var viewerDiv = $('<div>').attr('id', 'floating-console-viewer');
        viewerDiv.on('contextmenu', function(e) {
            e.preventDefault(); // 阻止默认右键菜单的弹出
            var contextMenu = $('<div>').addClass('context-menu');
            var hideOption = $('<span style="color:red">').text('隐藏');
            hideOption.on('click', function() {
                viewerDiv.hide();
                contextMenu.remove(); // 隐藏时同时移除右键菜单
            });
            contextMenu.append(hideOption);
            $('body').append(contextMenu);
            contextMenu.offset({left: e.pageX, top: e.pageY});
            viewerDiv.css('z-index', '9999'); // 设置viewerDiv的z-index为较高值
            contextMenu.css('z-index', '10000'); // 设置右键菜单的z-index更高，显示在viewerDiv之上
            $(document).one('click', function() {
                contextMenu.remove(); // 点击除右键菜单外的任何地方将菜单移除
            });
        });
        $('body').append(viewerDiv);
        // 使展示框可拖动
        viewerDiv.draggable();
        viewerDiv.hide();


        unsafeWindow.lineCount = 0; // 已输出行数
        unsafeWindow.viewerDiv = viewerDiv;
        unsafeWindow.log = (message)=>{
            if(lineCount > 100){
                clear()
            }
            lineCount++;
            $('<p>').text(message).appendTo(viewerDiv);
            // 滚动显示框，保持最新的几行可见
            viewerDiv.scrollTop(viewerDiv[0].scrollHeight);
        }
        unsafeWindow.clear =() =>{
            viewerDiv.empty();
            lineCount = 0;
        }

    }






    function refreshToken(callback){
        if (uid != null && uid.length > 0 && uid != 'null') {
            sessionStorage.removeItem("token");
			// cas途径登录成功
			loginInUserRegister(uid).done(function(resp){
				var code = resp.code;
				var data = resp.data;
				if (code != null && code == "1") {
					var number = data.number;// 学号
					var token = data.token;// 登录凭证
					// 保存登录凭证在本地缓存中
                    $.bhTip({content: "<p style='color:blue;'>刷新令牌成功</p>",state: 'danger'});
					sessionStorage.setItem("token", token);
                    if(callback)
                        callback(resp);
                }
            });
        }
    }


    function checkToken(){
        let event = new Event('click');
        setInterval(()=>{
            if(sessionStorage.getItem('token') == null){
                for(let i = 0; i < GlobalParam.store.length; i++){
                    if(GlobalParam.store[i].stare == 'running'){
                        GlobalParam.menu[i].stop(true);
                    }
                }
                if(autoRefresh === 'refreshToken'){
                    CVDialog.showDanger({title:'令牌失效',content:'等待刷新令牌，请勿刷新页面'});
                }else{
                    CVDialog.showDanger({title:'令牌失效',content:'请手动刷新页面'});
                }
                setTimeout(()=>{
                    if(sessionStorage.getItem('token') == null){
                        if(autoRefresh === 'refreshPage'){
                            //$('#goHome').click();
                            //sessionStorage.removeItem('token');
                            //sessionStorage.removeItem('studentInfo');
                            window.location.href = BaseUrl + '/sys/xsxkapp/*default/index.do';
                        }else if(autoRefresh === 'refreshToken'){
                            refreshToken(resp=>{
                                for(let i = 0; i < GlobalParam.store.length; i++){
                                    if(GlobalParam.store[i].state == 'interrupted'){
                                        GlobalParam.menu[i].button1.dispatchEvent(event);
                                    }
                                }
                                $('#cvDialog').remove();
                            });
                        }
                    }
                },5000);
            }
        }, 10000);

    }

    function searchCourse(queryContent,callback){
        if(!callback){
            callback = res=>console.log(res);
        }
        var queryParam = buildQueryTCParam(queryContent);
        queryPublicCourse(queryParam).done(res=>callback(res));
    }

    async function chooseCourse(teachingClassId,callback) {
        if(!callback){
            callback = res=>console.log(res);
        }
        var grade = null;//'1';
        var addParam = buildAddVolunteerParam(teachingClassId);
        addVolunteer(addParam).done(res=>callback(res))
    }


    function deleteCourse(teachingClassID,callback) {
        if(!callback){
            callback = res=>console.log(res);
        }
        var studentCode = GlobalParam.studentInfo.code; // 学号
        var electiveBatch = GlobalParam.studentInfo.electiveBatch;
        var electiveBatchCode = electiveBatch.code;
        var delData = '{"operationType":"2"' + ',"studentCode":"' + studentCode + '"' + ',"electiveBatchCode":"' + electiveBatchCode + '"' + ',"teachingClassId":"' + teachingClassID + '"' + ',"isMajor":"1"}';
        var delStr = '{"data":' + delData + '}';
        var deleteParam = {
            'deleteParam': delStr
        };
        deleteVolunteerResult(deleteParam).done(res=>callback(res));
    }


    function multiChooseCourse(teachingClassID,courseName,k,run,stop){
        if(sessionStorage.getItem('token') == null){
            return;
        }
        for (let i = 0,terrupted = false; i < k && !terrupted; i++) {
            chooseCourse(teachingClassID, function(response) {
                //console.log(response);
                var code = response.code;
                if (code != null && code != '302' && response.msg != '提供的token为空' ) {
                    log("尝试第 " + (i+1) + " 次选课操作: "+courseName+"=====>code[ "+response.code +" ], msg[ "+response.msg+" ]");
                }else{
                    terrupted = true;
                    sessionStorage.removeItem('token');
                    stop(terrupted);
                    log('=============令牌失效，等待刷新令牌，请勿刷新页面===============');
                }
            });
        }
    }


    // 封装 POST 请求
    function getCourse(index,queryContent,deleteCourseId,run,stop) {
        // 调用 postRequest 函数发送请求
        searchCourse(queryContent, function(response) {
            if(deleteCourseId){
                if(response && response.hasOwnProperty("dataList") && response.dataList !=null){
                    var course = response.dataList[0];
                    if(course){
                        GlobalParam.menu[index].input0.value = course.courseName;
                    }else{
                        $.bhTip({content: "<p style='color:blue;'>code[ "+response.code +" ], msg[ "+response.msg+" ]</p>",state: 'danger'});
                        stop();
                    }
                }else{
                    $.bhTip({content: "<p style='color:blue;'>code[ "+response.code +" ], msg[ "+response.msg+" ]</p>",state: 'danger'});
                    stop();
                }


                log(course.courseName+"=====>code[ "+response.code +" ], msg[ "+response.msg+" ]");

                //暂时只能抢指定课程
                if(response.totalCount != 1){
                    return;
                }
                if(response.code != "1"){
                    console.log("查询错误,结果不止一条")
                    log("查询错误,结果不止一条")
                }
                if(parseInt(course.numberOfSelected) < parseInt(course.classCapacity)){
                    console.log(course.teachingClassID+'课容量未满！')
                    log(course.teachingClassID+'课容量未满！')
                    //如果要退课就退
                    console.log("退选操作:"+deleteCourseId)
                    log("退选操作:"+deleteCourseId)
                    deleteCourse(deleteCourseId,function(response) {
                        console.log("退选结果：")
                        console.log(response)
                        log("退选结果=====>code[ "+response.code +" ], msg[ "+response.msg+" ]");
                        multiChooseCourse(course.teachingClassID,course.courseName,5,run,stop);
                    });
                }
            }
            else{
                multiChooseCourse(queryContent,GlobalParam.menu[index].input0.value,5,run,stop);
            }

        });
    }

    function addMenu(val1,val2){
        var index = ++GlobalParam.index;
        val1 = val1.trim().length > 0 ? val1:(GlobalParam.store[index].tid != null?GlobalParam.store[index].tid:'');
        val2 = val2.trim().length > 0 ? val2:(GlobalParam.store[index].tid != null?GlobalParam.store[index].did:'');
        var running = GlobalParam.store[index].state != null? GlobalParam.store[index].state:'stopped';

        // 创建输入框和按钮
        GlobalParam.menu[index].teacherName1 = document.createElement("input");
        GlobalParam.menu[index].teacherName2 = document.createElement("input");
        GlobalParam.menu[index].msg = document.createElement('div');
        GlobalParam.menu[index].input0 = document.createElement("input");
        GlobalParam.menu[index].input1 = document.createElement("input");
        GlobalParam.menu[index].input2 = document.createElement("input");
        GlobalParam.menu[index].input3 = document.createElement("input");
        GlobalParam.menu[index].button0 = document.createElement("button");
        GlobalParam.menu[index].button1 = document.createElement("button");
        GlobalParam.menu[index].button2 = document.createElement("button");



        GlobalParam.menu[index].teacherName1.classList.add("bordered-input");
        GlobalParam.menu[index].teacherName2.classList.add("bordered-input");
        GlobalParam.menu[index].input0.classList.add("bordered-input");
        GlobalParam.menu[index].input1.classList.add("bordered-input");
        GlobalParam.menu[index].input2.classList.add("bordered-input");
        GlobalParam.menu[index].input3.classList.add("bordered-input");
        // 设置输入框属性
        GlobalParam.menu[index].teacherName1.type = "text";
        GlobalParam.menu[index].teacherName2.type = "text";
        GlobalParam.menu[index].input0.type = "text";
        GlobalParam.menu[index].input1.type = "text";
        GlobalParam.menu[index].input2.type = "text";
        GlobalParam.menu[index].input3.type = "text";
        GlobalParam.menu[index].teacherName1.placeholder = "老师";
        GlobalParam.menu[index].teacherName1.readOnly = true;
        GlobalParam.menu[index].teacherName1.value = GlobalParam.store[index].ttn != null ? GlobalParam.store[index].ttn : '';
        GlobalParam.menu[index].teacherName2.placeholder = "老师";
        GlobalParam.menu[index].teacherName2.readOnly = true;
        GlobalParam.menu[index].teacherName2.value = GlobalParam.store[index].dtn != null ? GlobalParam.store[index].dtn : '';
        GlobalParam.menu[index].input0.placeholder = "要抢的课程名称（不用填）";
        GlobalParam.menu[index].input0.readOnly = true;
        GlobalParam.menu[index].input0.value = GlobalParam.store[index].tcn != null ? GlobalParam.store[index].tcn : '';
        GlobalParam.menu[index].input1.placeholder = "要抢的课的班号";
        GlobalParam.menu[index].input2.placeholder = "要退的课程名称（不用填）";
        GlobalParam.menu[index].input2.readOnly = true;
        GlobalParam.menu[index].input2.value = GlobalParam.store[index].dcn != null ? GlobalParam.store[index].dcn : '';
        GlobalParam.menu[index].input3.placeholder = "要退的课的班号";
        GlobalParam.menu[index].input1.value = val1;
        GlobalParam.menu[index].input3.value = val2;
        GlobalParam.menu[index].msg.style.textAlign = 'center';
        GlobalParam.menu[index].msg.style.padding = '10px';
        GlobalParam.menu[index].msg.style.fontWeight = 'bold';
        GlobalParam.menu[index].msg.style.color = 'black';
        GlobalParam.menu[index].msg.innerText = '暂停中'
        // 设置按钮属性
        GlobalParam.menu[index].button0.textContent = "获取课程名称";
        GlobalParam.menu[index].button1.textContent = "抢课";
        GlobalParam.menu[index].button2.textContent = "暂停";

        var intervalID,checkSuccess;
        var stopRunning = (interrupted)=>{
            if(interrupted == null ||!interrupted ){
                GlobalParam.store[index].state = 'stopped';
                GlobalParam.menu[index].state = 'stopped';
            }else{
                GlobalParam.store[index].state = 'interrupted';
                GlobalParam.menu[index].state = 'interrupted';
            }
            GlobalParam.menu[index].msg.innerText = '暂停中';
            GlobalParam.menu[index].msg.style.color = 'black';
            clearInterval(intervalID);
            clearInterval(checkSuccess);
            sessionStorage.setItem('GlobalParam.store',JSON.stringify(GlobalParam.store));
            for (let i = 0; i < GlobalParam.index; i++){
                if(GlobalParam.menu[i].state == 'running'){
                    return;
                }
            }
            //if(interrupted == null ||!interrupted )
                //viewerDiv.hide();
            
        }

        GlobalParam.menu[index].stop = stopRunning;

        GlobalParam.menu[index].button0.onclick=function() {
            var teachingClassID = GlobalParam.menu[index].input1.value;
            var deleteCourseId = GlobalParam.menu[index].input3.value;
            GlobalParam.store[index].tid = teachingClassID
            GlobalParam.store[index].did = deleteCourseId
            GlobalParam.store[index].tcn = '';
            GlobalParam.store[index].ttn = '';
            GlobalParam.store[index].dcn = '';
            GlobalParam.store[index].dtn = '';
            if(teachingClassID){
                searchCourse(teachingClassID,function(response) {
                    if(response && response.hasOwnProperty("dataList") && response.dataList !=null){
                        var course = response.dataList[0];
                        if(course != null){
                            GlobalParam.store[index].tcn = course.courseName;
                            GlobalParam.store[index].ttn = course.teacherName;
                            GlobalParam.menu[index].input0.value = course.courseName;
                            GlobalParam.menu[index].teacherName1.value = course.teacherName;
                            $.bhTip({content: "<p style='color:blue;'>获取课程名称成功！</p>",state: 'success'});
                            sessionStorage.setItem('GlobalParam.store',JSON.stringify(GlobalParam.store));
                        }else{
                            $.bhTip({content: "<p style='color:blue;'>code[ "+response.code +" ], msg[ "+response.msg+" ]</p>",state: 'danger'});
                            stopRunning();
                        }
                    }else{
                        $.bhTip({content: "<p style='color:blue;'>code[ "+response.code +" ], msg[ "+response.msg+" ]</p>",state: 'danger'});
                        stopRunning();
                    }
                });

            }
            if(deleteCourseId){
                searchCourse(deleteCourseId,function(response) {
                    if(response!=null && response.hasOwnProperty("dataList") && response.dataList !=null){
                        var course = response.dataList[0];
                        if(course != null){
                            GlobalParam.store[index].dcn = course.courseName;
                            GlobalParam.store[index].dtn = course.teacherName;
                            GlobalParam.menu[index].input2.value = course.courseName;
                            GlobalParam.menu[index].teacherName2.value = course.teacherName;
                            $.bhTip({content: "<p style='color:blue;'>获取课程名称成功！</p>",state: 'success'});
                            sessionStorage.setItem('GlobalParam.store',JSON.stringify(GlobalParam.store));
                        }else{
                            $.bhTip({content: "<p style='color:blue;'>code[ "+response.code +" ], msg[ "+response.msg+" ]</p>",state: 'danger'});
                            stopRunning();
                        }
                    }else{
                        $.bhTip({content: "<p style='color:blue;'>code[ "+response.code +" ], msg[ "+response.msg+" ]</p>",state: 'danger'});
                        stopRunning();
                    }
                });
            }
        }



        GlobalParam.menu[index].button1.onclick = function() {
            if (GlobalParam.menu[index].state == 'running'){
                $.bhTip({content: "<p style='color:blue;'>请勿重复操作！！</p>",state: 'danger'});
                return;
            }
            var teachingClassID = GlobalParam.menu[index].input1.value;
            var deleteCourseId = GlobalParam.menu[index].input3.value;
            if(!teachingClassID){
                $.bhTip({content: "<p style='color:blue;'>请输入抢课班级号！！</p>",state: 'danger'});
                return;
            }
            // 在这里编写发送 POST 请求的代码
            GlobalParam.menu[index].msg.innerText = "抢课中";
            GlobalParam.menu[index].msg.style.color = 'blue';
            GlobalParam.menu[index].state = 'running';
            GlobalParam.store[index].state = 'running';


            $.bhTip({content: "<p style='color:blue;'>"+GlobalParam.menu[index].input0.value+"--开始抢课！！！</p>",state: 'success'});
            viewerDiv.show();
            //每0.5秒扫一次课
            intervalID = setInterval(function() {
                getCourse(index,teachingClassID,deleteCourseId,null,stopRunning);
            }, 333);


            //每3秒检查是否已经选中，然后停止
            checkSuccess = setInterval(function() {
                searchCourse(teachingClassID,function(response) {
                    if(response && response.hasOwnProperty("dataList") && response.dataList !=null){
                        var course = response.dataList[0];
                        if(course){
                            var b = course.isChoose != null && parseInt(course.isChoose) === 1;
                            log(GlobalParam.menu[index].input0.value+"--检查是否选中："+ b);
                            //$.bhTip({content: GlobalParam.menu[index].input0.value+"--检查是否选中："+ b,state: 'warning'});
                            if(b){
                                GlobalParam.menu[index].msg.innerText = '已抢中';
                                GlobalParam.menu[index].msg.style.color = 'red';
                                var dialogData = new Object();
                                dialogData.title = '抢课成功';
                                dialogData.content = "<p>"+course.courseName + "</p><p>" + course.teacherName + "</p>" + '已抢中';
                                CVDialog.showSuccess(dialogData);
                                stopRunning();
                            }
                        }
                    }else{
                        $.bhTip({content: "<p style='color:blue;'>code[ "+response.code +" ], msg[ "+response.msg+" ]</p>",state: 'danger'});
                    }
                });
            }, 3000);
            sessionStorage.setItem('GlobalParam.store',JSON.stringify(GlobalParam.store));
        };

         //停止定时任务
        GlobalParam.menu[index].button2.onclick=function() {
            if (GlobalParam.menu[index].state != 'running'){
                $.bhTip({content: "<p style='color:blue;'>抢课未开始！！</p>",state: 'danger'});
                return;
            }
            stopRunning();
            $.bhTip({content: "<p style='color:blue;'>"+GlobalParam.menu[index].input0.value+"-暂停抢课！！！</p>",state: 'success'});

        }

        // 添加元素到页面
        var container = document.createElement("div");
        container.classList.add('centered');
        container.appendChild(GlobalParam.menu[index].input0);
        container.appendChild(GlobalParam.menu[index].teacherName1);
        container.appendChild(GlobalParam.menu[index].input1);
        container.appendChild(GlobalParam.menu[index].input2);
        container.appendChild(GlobalParam.menu[index].teacherName2);
        container.appendChild(GlobalParam.menu[index].input3);
        container.appendChild(GlobalParam.menu[index].msg);
        container.appendChild(GlobalParam.menu[index].button0);
        container.appendChild(GlobalParam.menu[index].button1);
        container.appendChild(GlobalParam.menu[index].button2);
        document.body.insertBefore(container, document.body.firstChild);

    }

    function initMenu(){
        for(let i = 0; i < GlobalParam.store.length; i++){
            addMenu("","");
        }
        let event = new Event('click');
        for(let i = 0; i < GlobalParam.store.length; i++){
            if(GlobalParam.store[i].state == 'running'){
                setTimeout(()=>GlobalParam.menu[i].button1.dispatchEvent(event),1000*(i+1));
            }
        }
    }


    function initScript(){
        //export
        unsafeWindow.searchCourse = searchCourse;
        unsafeWindow.chooseCourse = chooseCourse;
        unsafeWindow.deleteCourse = deleteCourse;
        unsafeWindow.refreshToken = refreshToken;
        unsafeWindow.GlobalParam = GlobalParam;

        // 添加对应的CSS样式
        var style = document.createElement("style");
        style.textContent = `
        .bordered-input {
             border: 1px solid #ccc;
             padding: 5px;
        }
        .centered {
             display: flex;
             justify-content: center;
             align-items: center;
        }

        `;
        document.head.appendChild(style);
        console.log(GlobalParam);
        log("===============================================================================================================");
        log("选课插件加载成功...         右键点击“隐藏”可隐藏输出窗口...");
        log("作者：Schilings   [Github: https://github.com/Schilings]");
        log("===============================================================================================================");
        var dialogData = new Object();
        dialogData.title = '选课插件加载成功';
        dialogData.content = `<h4 style='color:white'>Schilings[Github: https://github.com/Schilings]</h4>`;
        CVDialog.showSuccess(dialogData);
        if(autoRefresh != 'None'){
            $.bhTip({content: "autoRefresh : " + autoRefresh,state: 'success'});
            setTimeout(()=>$('#cvDialog').remove(),2000);
        }
    }



    // 当页面加载完成后再执行脚本，避免脚本重复执行
    window.onload = function () {
        initConsole();
        initGlobal();
        initScript();
        initMenu();
        checkToken();
    }




})()
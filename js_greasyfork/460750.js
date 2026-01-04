// ==UserScript==
// @name         picture_collector
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Collect pictures of paginated structure picture website
// @author       petitepluie
// @match        http://pic.netbian.com/*
// @match        http://www.gaoimg.com/*
// @match        *://desk.zol.com.cn/*
// @match        https://588ku.com/*
// @match        https://www.pixivacg.com/*
// @match        https://www.10wallpaper.com/*
// @match        http://www.netbian.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460750/picture_collector.user.js
// @updateURL https://update.greasyfork.org/scripts/460750/picture_collector.meta.js
// ==/UserScript==


(function(){
    //获取本页地址
    var selfUrl=window.location.href;
    
    //添加界面css
    var mystyle=document.createElement("style");
    mystyle.innerHTML=`#popUpBox {
            position:fixed;
            top:0;
            right:-618px;
            z-index:10000;
            width:650px;
            height:20px;
            overflow-y:scroll;
            border:1px solid blue;
            background:#fff;
        }
        #boxCont {
            display:none;
        }
        #showAllConfig {
            width:100%;
        }
        #boxTitle {
            width:100%;
            height:22px;
            color:#fff;
            background:#0451ad;
        }
        #show_hid {
            width:32px;
            height:18px;
            line-height:15px;
            color:#0451ad;
            font-size:15px;
            font-weight:bold;
        }
        #baseOptionPlace {
            width:100%;
            height:50px;
        }
        #baseOptionCont {
            float:left;
            width:90%;
            height:100%;
        }
        #baseOptionCont span {
            font-size:12px;
        }
        #baseOptionCont input {
            height:10px;
        }
        .baseOption {
            width:100%;
            height:50%;
        }
        .reqLinkTitle {
            float:left;
            width:15%;
            height:100%;
            text-indent:5px;
            background:#c5dcfb;
        }
        .reqLinkCont {
            float:left;
            width:85%;
            height:100%;
        }
        #baseOptionTitle {
            float:right;
            width:10%;
            height:100%;
            
            background:#438dec;
        }
        #boxOptionPlace {
            width:100%;
        }
        .boxOption {
            width:100%;
            height:100px;
            margin-top:6px;
            border-top:2px solid blue;
            border-bottom:2px solid blue;
        }
        .boxOptionCont {
            float:left;
            width:90%;
            height:100%;
        }
        .options {
            width:100%;
            height:33%;
            border-bottom:0.5px solid blue;
        }
        .optionsTitle {
            float:left;
            width:15%;
            height:100%;
            line-height:30px;
            text-indent:5px;
            background:#c5dcfb;
        }
        .optionsCont {
            float:right;
            width:85%;
            height:100%;
        }
        .options span {
            font-size:12px;
        }
        .options input {
            height:10px;
        }
        .optionsContCube {
            float:left;
            width:50%;
            height:100%;
        }
        .optionsContName {
            width:100%;
            height:40%;
            line-height:10px;
            text-align:center;
            border-left:2px solid #fff;
            background:#deebf3;
        }
        .optionsContInput {
            width:100%;
            height:60%;
            line-height:15px;
        }
        .inputName {
            width:28%;
        }
        .inputNumb {
            width:12%;
        }
        .inputLink {
            width:56%;
        }
        .boxOptionTitle {
            float:right;
            width:10%;
            height:100%;
            background:#438dec;
        }
        .boxOptionTitle span {
            font-size:18px;
            color:#fff;
        }
        #dealOptionPlace {
            width:100%;
            height:36px;
        }
        .dealBtn {
            float:left;
            width:14%;
            height:25px;
            line-height:25px;
            margin:5px 10px;
            font-size:12px;
            text-align:center;
            border-radius:3px;
            background:rgba(0,0,0,0.5);
            transition:all 0.1s linear;
            cursor: pointer;
        }
        #start {
            background:#438dec;
            color:#fff;
        }
        #add {
            background:#c9defb;
        }
        #redu {
            background:#c9defb;
        }
        #add:hover {
            background:#438dec;
            color:#fff;
        }
        #redu:hover {
            background:#438dec;
            color:#fff;
        }
        #showCollectState {
            width:100%;
            height:40px;
            border-top:1px solid blue;
        }
        #sCsTitle {
            float:left;
            width:13%;
            height:100%;
            line-height:40px;
            font-size:14px;
            font-weight:bold;
            text-align:center;
            color:#0451ad;
        }
        #sCsCont {
            float:left;
            width:87%;
            height:100%;
            line-height:40px;
        }
        #showAllPicture {
            width:100%;
            height:490px;
            background:#438dec;
            overflow-y:scroll;
        }
        .cubeBox {
            float:left;
            width:85px;
            height:50px;
            margin:1px;
            background:rgba(0,0,0,0.5);
            overflow:hidden;
        }
        .cubeBox img {
            width:100%;
        }`;
    document.head.append(mystyle);
    
    //创建界面html
    var interFace=document.createElement('div');
    interFace.id='popUpBox';
    interFace.innerHTML=`
        <div id="boxTitle">
            <button id="show_hid">&lt;&lt;</button>
            <span>图片采集器（v.1.0.5）</span>
        </div>
        <div id="boxCont">
            <div id="showAllConfig">
                <div id="baseOptionPlace">
                    <div id="baseOptionCont">
                        <div class="baseOption">
                            <div class="reqLinkTitle"><span>分页链接拆分</span></div>
                            <div class="reqLinkCont">
                                <span>索引前：</span><input class="inputLink" type="text">
                                <span>索引后：</span><input class="inputNumb" type="text">
                            </div>
                        </div>
                        <div class="baseOption">
                            <div class="reqLinkTitle"><span>采集分页范围</span></div>
                            <div class="reqLinkCont">
                                <span>开始索引：</span><input class="inputNumb" type="number" min="2">
                                <span>结束索引：</span><input class="inputNumb" type="number" min="2">
                            </div>
                        </div>
                    </div>
                    <div id="baseOptionTitle">基础信息配置</div>
                </div>
                <div id="boxOptionPlace"></div>
                <div id="dealOptionPlace">
                    <div id="start" class="dealBtn">开始采集</div>
                    <div id="add" class="dealBtn">选择器+</div>
                    <div id="redu" class="dealBtn">选择器-</div>
                </div>
            </div>
            <div id="showCollectState">
                <div id="sCsTitle">采集状态：</div>
                <div id="sCsCont">null</div>
            </div>
            <div id="showAllPicture">
                <div class="cubeBox"></div>
                <div class="cubeBox"></div>
                <div class="cubeBox"></div>
                <div class="cubeBox"></div>
                <div class="cubeBox"></div>
                <div class="cubeBox"></div>
                <div class="cubeBox"></div>
            </div>
        </div>`;
    document.body.append(interFace);
    
    //添加界面逻辑
    var popUpBox=document.getElementById("popUpBox");
    var boxCont=document.getElementById("boxCont");
    var show_hid=document.getElementById("show_hid");
    var display=false;
    show_hid.onclick=function(){
        if(display){
            startMove(popUpBox,{
                "height":20,
                "right":-618
            },function(){
                display=false;
                show_hid.innerHTML="&lt;&lt;";
            })
        } else {
            boxCont.style.display="block";
            startMove(popUpBox,{
                "height":750,
                "right":0
            },function(){
                display=true;
                show_hid.innerHTML="&gt;&gt;";
            })
        }
    }
    
    var boxOptionPlace=document.getElementById('boxOptionPlace');
    boxOptionPlace.n=0;
    var boxOption=document.getElementsByClassName("boxOption");
    var add=document.getElementById("add");
    var redu=document.getElementById("redu");
    add.onclick=function(){
        var boxOptionTemp=document.createElement('div');
        boxOptionTemp.className='boxOption';
        boxOptionTemp.innerHTML=`
        <div class="boxOptionCont">
            <div class="options">
                <div class="optionsTitle"><span>父级节点</span></div>
                <div class="optionsCont parent">
                    <div class="optionsContCube">
                        <div class="optionsContName"><span>id</span></div>
                        <div class="optionsContInput">
                            <span>名称：</span><input class="inputName" type="text">
                        </div>
                    </div>
                    <div class="optionsContCube">
                        <div class="optionsContName"><span>class</span></div>
                        <div class="optionsContInput">
                            <span>名称：</span><input class="inputName" type="text">
                            <span>索引：</span><input class="inputNumb" type="number" min="0">
                        </div>
                    </div>
                </div>
            </div>
         
            <div class="options">
                <div class="optionsTitle"><span>子级节点集</span></div>
                <div class="optionsCont children">
                    <div class="optionsContCube">
                        <div class="optionsContName"><span>tag</span></div>
                        <div class="optionsContInput">
                            <span>名称：</span><input class="inputName" type="text">
                        </div>
                    </div>
                    <div class="optionsContCube">
                        <div class="optionsContName"><span>class</span></div>
                        <div class="optionsContInput">
                            <span>名称：</span><input class="inputName" type="text">
                        </div>
                    </div>
                </div>
            </div>
         
            <div class="options">
                <div class="optionsTitle"><span>目标元素位置</span></div>
                <div class="optionsCont flower">
                    <div class="optionsContCube">
                        <div class="optionsContName"><span>tag</span></div>
                        <div class="optionsContInput">
                            <span>名称：</span><input class="inputNumb" type="text">
                            <span>索引：</span><input class="inputNumb" type="number" min="0">
                            <span>属性：</span><input class="inputNumb" type="text" min="0">
                        </div>
                    </div>
                    <div class="optionsContCube">
                        <div class="optionsContName"><span>class</span></div>
                        <div class="optionsContInput">
                            <span>名称：</span><input class="inputNumb" type="text">
                            <span>索引：</span><input class="inputNumb" type="number" min="0">
                            <span>属性：</span><input class="inputNumb" type="text" min="0">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="boxOptionTitle"><span>${++boxOptionPlace.n}级</span>页面元素选择器</div>`;
        boxOptionPlace.appendChild(boxOptionTemp);
        
    }
        
    redu.onclick=function(){
        if(boxOptionPlace.n==0) return;
        boxOptionPlace.removeChild(boxOption[--boxOptionPlace.n]);
    }
    add.click();
        
    /**
     * 输入数据处理
     */
    //基础数据获取
    var baseOptionCont=document.getElementById('baseOptionCont');
    var baseOptionData=baseOptionCont.getElementsByTagName('input');
    var arrUrlFirst=[];
    
    var start=document.getElementById('start');
    //父级选择器获取
    var parent=document.getElementsByClassName('parent');
    //子级选择器获取
    var children=document.getElementsByClassName('children');
    //flower选择器获取
    var flower=document.getElementsByClassName('flower');
    
    //存放临时选择器数据的容器
    var arrPCFselect=[[],[],[]];
    
    //存放最终选择器数据的容器
    var arrSelector=[];
    
    //显示提示的容器
    var sCsCont=document.getElementById('sCsCont');
    
    start.onclick=function(){
        arrUrlFirst=[];
        if(baseOptionData[0].value!=''&&baseOptionData[1].value!=''&&baseOptionData[2].value!=''&&baseOptionData[3].value!=''){
            if(parseInt(baseOptionData[2].value)>parseInt(baseOptionData[3].value)){
                sCsCont.innerHTML='<span style="color:red">开始索引勿大于结束索引！</span>';
                return;
            }
            for(let i=parseInt(baseOptionData[2].value);i<=parseInt(baseOptionData[3].value);i++){
                arrUrlFirst.push(baseOptionData[0].value+i+baseOptionData[1].value);
            }
        } else {
            sCsCont.innerHTML='<span style="color:red">基础数据需填写完全，请检查！</span>';
            return;
        }
        
        //清空容器
        arrPCFselect=[[],[],[]];
        arrSelector=[];
        
        //存放临时选择器数据
        for(let i=0;i<boxOptionPlace.n;i++){
            //父级选择器
            var prtInput=parent[i].getElementsByTagName('input');
            if(prtInput[0].value!=''){
                arrPCFselect[0].push('id___'+prtInput[0].value);
            } else if(prtInput[1].value!=''&&prtInput[2].value!='') {
                arrPCFselect[0].push('class___'+prtInput[1].value+'___'+prtInput[2].value);
            } else {
                sCsCont.innerHTML='<span style="color:red">'+(i+1)+'级页面的父级节点选择器配置不能为空，请检查！</span>';
                return;
            }
            
            //子级选择器
            var cldInput=children[i].getElementsByTagName('input');
            if(cldInput[0].value!=''){
                arrPCFselect[1].push('tag___'+cldInput[0].value);
            } else if(cldInput[1].value!='') {
                arrPCFselect[1].push('class___'+cldInput[1].value);
            } else {
                sCsCont.innerHTML='<span style="color:red">'+(i+1)+'级页面的子级节点集选择器配置不能为空，请检查！</span>';
                return;
            }
            
            //flower选择器
            var flrInput=flower[i].getElementsByTagName('input');
            if(flrInput[0].value!=''&&flrInput[1].value!=''&&flrInput[2].value!=''){
                arrPCFselect[2].push('tag___'+flrInput[0].value+'___'+flrInput[1].value+'___'+flrInput[2].value);
            } else if(flrInput[3].value!=''&&flrInput[4].value!=''&&flrInput[5].value!='') {
                arrPCFselect[2].push('class___'+flrInput[3].value+'___'+flrInput[4].value+'___'+flrInput[5].value);
            } else {
                sCsCont.innerHTML='<span style="color:red">'+(i+1)+'级页面的目标元素选择器配置不能为空，请检查！</span>';
                return;
            }
            
        }
        //console.log("临时选择器数据如下：");
        //console.log(JSON.stringify(arrPCFselect));
        
        //获取最终选择器数据
        for(let i=0;i<boxOptionPlace.n;i++){
            var timerObj={
                parent:`${arrPCFselect[0][i]}`,
                children:`${arrPCFselect[1][i]}`,
                flower:`${arrPCFselect[2][i]}`
            }
            arrSelector.push(timerObj);
        }
        
        console.log("基础配置数据如下：");
        console.log(arrUrlFirst);
        console.log("最终选择器结果如下：");
        console.log(arrSelector);
        
        
        //清空待请求队列
        watingRequest=[];
        //设置清秋层级
        intDiving=arrSelector.length;
        //放入待请求队列集合
        watingRequest.push(arrUrlFirst);
        //记录队列长度
        watingLength.push(arrUrlFirst.length);
        
        console.log("队列结果如下：");
        console.log(watingRequest);
        
        if("当前没有其他采集任务"){
            console.log("执行采集任务");
            sCsCont.innerHTML='<span style="color:purple">采集中,请稍等...</span>';
            //开启采集程序
            spider();
        }
    }
    
    /*******************采集核心代码**************************/
    //存放各级待请求队列集合
    var watingRequest=[];
    
    var watingLength=[];
    
    var intDiving=0;
    
    var j=0;
    
    var finalResult=[];
    
    function spider(){
        ajax({
            url:watingRequest[j][0],
            type:"GET",
            sync:true,
            responseType:"document",
            success:function(xhr){
                var _document=xhr.responseXML.documentElement;
                var nowSelector=arrSelector[j];
                var parent=null;
                var children=null;
                var flower=null;

                var ArrUrl=[];
                var parentMegs=nowSelector.parent.split("___");

                switch(parentMegs[0]){
                    case "id":parent=_document.getElementById(parentMegs[1]);break;
                    case "class":parent=_document.getElementsByClassName(parentMegs[1])[parentMegs[2]];break;
                    default: alert("parent空缺！");
                }
                
                var childrenMegs=nowSelector.children.split("___");
                switch(childrenMegs[0]){
                    case "class":children=parent.getElementsByClassName(childrenMegs[1]);break;
                    case "tag":children=parent.getElementsByTagName(childrenMegs[1]);break;
                    default: alert("children空缺！");
                }
                
                var flowerMegs=nowSelector.flower.split("___");
                switch(flowerMegs[0]){
                    case "class":getArrUrlByClass();break;
                    case "tag":getArrUrlByTag();break;
                    default: alert("flower空缺！");
                }
                
                function getArrUrlByClass(){
                    for(let i=0;i<children.length;i++){
                        flower=children[i].getElementsByClassName(flowerMegs[1])[flowerMegs[2]];
                        var url=flower.getAttribute(flowerMegs[3]);
                        if(url!=null){
                            ArrUrl.push(url);
                        }
                    }
                }
                
                function getArrUrlByTag(){
                    for(let i=0;i<children.length;i++){
                        flower=children[i].getElementsByTagName(flowerMegs[1])[flowerMegs[2]];
                        var url=flower.getAttribute(flowerMegs[3]);
                        if(url!=null){
                            ArrUrl.push(url);
                        }
                    }
                }
                
                if(ArrUrl.length==0){
                    alert("队列为空！");   
                    console.log(xhr);
                    console.log(_document);
                    console.log(arrSelector[j]);
                    console.log(ArrUrl);
                } else {
                    //console.log("成功获取队列！");
                    //console.log(_document);
                    //console.log(arrSelector[j]);
                    //console.log(ArrUrl);
                }
                
                watingRequest[j].shift();
                
                if((j+1)==intDiving){
                    var strName="_";
                    for(let i=0;i<=j;i++){
                        strName += (watingLength[i]-watingRequest[i].length)+"_";
                    }
                    
                    /**
                     * 获取到图片链接
                     */
                    //1.直接下载
                    /*
                    for(var i=0;i<ArrUrl.length;i++){
                        var imgName=strName+(i+1)+".jpg";
                        var imgUrl=ArrUrl[i];
                        //downloadPicture(imgName,imgUrl);
                        console.log("下载了: "+strName+(i+1)+".jpg"+" :"+ArrUrl[i]);  //后缀动态生成
                    }
                    */
                    
                    //2.添加到最终下载集合（推荐）
                    /*
                    for(var i=0;i<ArrUrl.length;i++){
                        finalResult.push(ArrUrl[i]);
                    }
                    */
                    
                    //3.添加到页面显示 showAllPicture
                    for(let i=0;i<ArrUrl.length;i++){
                        var imgName=strName+(i+1)+".jpg";
                        var imgUrl=ArrUrl[i];
                        var elem=document.createElement('div');
                        elem.className='cubeBox';
                        elem.innerHTML=`<img src="${imgUrl}" title="${imgName}">`;
                        showAllPicture.appendChild(elem);
                    }
                    
                    if(watingRequest[j].length!=0){
                        spider();
                    } else {
                        
                        console.log("判断是否完成前的j和队列:");
                        console.log(j);
                        console.log(JSON.stringify(watingRequest));
                        
                        //判断是否完成
                        function isEnd(){
                            for(var i=j;i>=0;i--){
                                if(watingRequest[i].length!=0){
                                    j=i;
                                    return false;
                                } else {
                                    watingRequest.pop();
                                }
                            }
                            return true;
                        }
                        var end=isEnd();
                        
                        console.log("判断是否完成后的j和队列:");
                        console.log(j);
                        console.log(JSON.stringify(watingRequest));
                        
                        if(end){
                            console.log("程序结束，任务队列如下");
                            var allImgLoaded=checkImgLoaded();
                            var startCheckTime=Date.now();
                            var timer=setInterval(function(){
                                if(allImgLoaded){
                                    clearInterval(timer);
                                    console.log('图片加载完，改变页面形态');

                                    var showAllConfig=document.getElementById('showAllConfig');
                                    
                                    boxCont.removeChild(showAllConfig);
                                    
                                    while(mystyle.previousElementSibling){
                                        document.head.removeChild(document.head.firstChild);
                                    }
                                    var title=document.createElement('title');
                                    title.innerHTML='采集图片——文件夹';
                                    document.head.appendChild(title);
                                    
                                    while(popUpBox.previousElementSibling){
                                        document.body.removeChild(document.body.firstChild);
                                    }
                                    
                                    sCsCont.innerHTML='<span style="color:green">完成，请按组合键"Ctrl+S"选择一个位置保存采集的图片</span>&nbsp;&nbsp;&nbsp;&nbsp;'+
                                        `<a href="${selfUrl}" alt="返回">否则返回</a>`;
                                } else {
                                    if(Date.now()-startCheckTime>10000){
                                        sCsCont.innerHTML='<span style="color:yellowgreen">图片大部分加载完...可以按组合键"Ctrl+S"选择一个位置保存采集的图片</span>';
                                        allImgLoaded='true';
                                    }
                                    sCsCont.innerHTML='<span style="color:red">图片还未加载完,请稍等...</span>';
                                }
                            },200);
                            return;
                        } else {
                            spider();
                        }
                    }
                } else {
                    watingRequest.push(ArrUrl);
                    watingLength.push(ArrUrl.length);
                    j++;
                    spider();
                }
            },
            error:function(xhr){
                alert(xhr.status+":ajax请求"+this.url+"失败！");
                console.log(xhr);
            }
        })
    }
    
    //ajax工具函数
    function ajax(obj){
        var xhr=null;
        if(window.XMLHttpRequest){
            xhr=new window.XMLHttpRequest();
        } else {
            xhr=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.responseType=obj.responseType;
        xhr.onreadystatechange=function(){
            if (xhr.readyState!=4) return;
            if(xhr.status==200){
                obj.success(xhr);
            } else {
                obj.error(xhr);
            }
        }
        xhr.open(obj.type,obj.url,obj.sync);
        xhr.send();
    }
    
    
    //工具函数4 下载图片(待完善)
    function downloadPicture(imgName,imgUrl){
        //return new Promise(function(resolve,reject){
            var anchor=document.createElement("A");
            anchor.href=imgUrl;
            anchor.download=imgName;
            anchor.target="_blank";
            document.body.appendChild(anchor);
            anchor.click();
            //给单个图片下载任务分配0.5s
        //    setTimeout(function(){
        //        resolve();
        //    },500)
        //})
    }
    
    
    //动画工具函数
    function startMove(obj,json,fn){
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            var now='';
            var onStop=true;
            for(var attr in json){
                if(attr=='opacity'){
                    now=parseInt(parseFloat(getStyle(obj,attr))*100);
                } else {
                    now=parseInt(getStyle(obj,attr));
                }
                var speed=(json[attr]-now)/5; 
                speed=speed>0?Math.ceil(speed):Math.floor(speed);
                if(now!=json[attr]){
                    onStop=false;
                }
                if(attr=='opacity'){
                    obj.style[attr]=(now+speed)/100;
                } else {
                    obj.style[attr]=now+speed+'px';
                }
            }
            if(onStop){
                clearInterval(obj.timer);
                if(fn){
                    fn();
                }
            }
        },50);
    }
    function getStyle(obj,attr){
        if(obj.currentStyle){
            return obj.currentStyle(attr);
        } else {
            return getComputedStyle(obj,false)[attr];
        }
    }
    
    var showAllPicture=document.getElementById('showAllPicture');
    var allImg=showAllPicture.getElementsByTagName('img');
    //检查所有图片是否加载完全(待优化：不一定是所有图片都加载);
    function checkImgLoaded(){
        for(let i=0;i<allImg.length;i++){
            if(allImg[i].complete==false){
                return false;
            }
        }
        return true;
    }
    
})()
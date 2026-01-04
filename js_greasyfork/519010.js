// ==UserScript==
// @name        BHB聊天室背景图片更换（已全局兼容）
// @namespace   Violentmonkey Scripts
// @match       https://*boyshelpboys.com/*
// @description BHB界面背景图片修改，长期更新中（大概
// @grant       none
// @version     3.2.4.6
// @author      M27IAR
// @license     GPL-3.0-or-later
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/519010/BHB%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E6%9B%B4%E6%8D%A2%EF%BC%88%E5%B7%B2%E5%85%A8%E5%B1%80%E5%85%BC%E5%AE%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519010/BHB%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E6%9B%B4%E6%8D%A2%EF%BC%88%E5%B7%B2%E5%85%A8%E5%B1%80%E5%85%BC%E5%AE%B9%EF%BC%89.meta.js
// ==/UserScript==
(function(){
    let FirstTime=false
    let webWidth = window.innerWidth;
    let webHeight = window.innerHeight;//获取页面宽高|用于特效效果加载使用
    //本地数据检测|若无相关数据则填充相关默认值
    if (!localStorage.EmoDBlist){//表情数据库计数
        localStorage.setItem("EmoDBlist",0)
    }
    if(!localStorage.M27NewBBGPrint){//是否启用自定义聊天室
        localStorage.setItem("M27NewBBGPrint","false")
    }
    if(!localStorage.BackGroundColor){//背景颜色
        localStorage.setItem("BackGroundColor","#000000")
    }

    if(!localStorage.MsgLightCheckX){
        localStorage.setItem("MsgLightCheckX",'true')
    }
    if(!localStorage.MsgSet){
        localStorage.setItem("MsgSet","false");
    }
    if(!localStorage.MsgSetVisable){
        localStorage.setItem("MsgSetVisable","false");
    }
    if(!localStorage.TransparencySet){//透明度模块是否显示
        localStorage.setItem("TransparencySet","false");
    }
    if(!localStorage.PrintVisabel){
        localStorage.setItem("PrintVisabe","false")
    }
    if(!localStorage.PrintPicOpen){
        localStorage.setItem("PrintPicOpen","true")
    }
    if(!localStorage.PrintPlanCheck){
        localStorage.setItem("PrintPlanCheck","false")
    }
    if(!localStorage.IdPrintCheck){
        localStorage.setItem("IdPrintCheck","false");
    }
    if(!localStorage.PrintPicplanChk){
        localStorage.setItem("PrintPicplanChk","true")
    }
    if(!localStorage.BoxColor){//特效方格颜色
        localStorage.setItem("BoxColor","#000000");
    }
    if(!localStorage.BoxBorderColor){//特效方格描边色
        localStorage.setItem("BoxBorderColor","#000000");
    }
    if(!localStorage.MsgBoxTra){
        localStorage.setItem("MsgBoxTra",'0.2');
    }
    if(!localStorage.MsgBoxColor){//消息框背景色
        localStorage.setItem("MsgBoxColor","#000000");
    }
    if(!localStorage.BoxBorderCansee){
        localStorage.setItem("BoxBorderCansee","99");
    }
    if(!localStorage.BoxPrint){//是否启动特效方格渲染
        localStorage.setItem("BoxPrint","no");
    }
    if(!localStorage.BoxSize){//特效方格大小
        localStorage.setItem("BoxSize","50");
    }
    if(!localStorage.BackgroundPrint){//图像背景尺寸设置
        localStorage.setItem("BackgroundPrint","cover");
    }
    if(!localStorage.centerPosition){//居中渲染设定
        localStorage.setItem("centerPosition","center");
    }
    if(!localStorage.heightsize){//宽度默认值
        localStorage.setItem("heightsize",'100');
    }
    if(!localStorage.widthsize){//高度默认值
        localStorage.setItem("widthsize",'100');
    }
    if(!localStorage.left){//左侧偏转角度
        localStorage.setItem("left",'0');
    }
    if(!localStorage.top){//顶部偏转角度
        localStorage.setItem("top",'0');
    }
    if(!localStorage.webpiclod){//加载线上图片
        localStorage.setItem("webpiclod",1);
    }
    if(!localStorage.localpiclod){//加载本地图片
        localStorage.setItem("localpiclod",0);
    }
        localStorage.removeItem("leaderhide");
    if(!localStorage.canseenunber){//透明度数字
        localStorage.setItem("canseenunber",0.50);
    }
    if(!localStorage.printToBack){//渲染到背景
        localStorage.setItem("printToBack",1);
    }
    if(!localStorage.NameFontSize){//聊天室ID|其他页面部分字体的尺寸
        localStorage.setItem("NameFontSize",12);
    }
    if(!localStorage.LocalFontColor){//聊天室ID|其他页面部分字体的颜色
        localStorage.setItem("LocalFontColor","#ffffff")
    }
    if(!localStorage.LocalFontColorsec){//聊天室ID|其他页面部分字体的描边
        localStorage.setItem("LocalFontColorsec","#7071a4")
    }
    if(!localStorage.BorderTextSize){//聊天室ID|其他页面部分字体的描边粗细
        localStorage.setItem("BorderTextSize",1);
    }
    if(!localStorage.scrollstyle){//滚动条状态
        localStorage.setItem("scrollstyle","1")
    }
    localStorage.removeItem("CantSeeset3")
    localStorage.removeItem("CantSeeset4")
    localStorage.removeItem("CantSeeset6")
    localStorage.removeItem("CantSeeset9")
    if(!localStorage.CantSeeset1){//聊天历史记录1
        localStorage.setItem("CantSeeset1","00");
    }
    if(!localStorage.CantSeeset5){
        localStorage.setItem("CantSeeset5","20");
    }
    if(!localStorage.CantSeeset7){
        localStorage.setItem("CantSeeset7","20");
    }
    if(!localStorage.CantSeeset8){
        localStorage.setItem("CantSeeset8","50");
    }
    if(!localStorage.CantSeesetBBSMsgList){
        localStorage.setItem("CantSeesetBBSMsgList","50");
    }
    localStorage.removeItem("CantSeeColor3")
    localStorage.removeItem("CantSeeColor4")
    localStorage.removeItem("CantSeeColor6")
    localStorage.removeItem("CantSeeColor9")
    if(!localStorage.CantSeeColor1){
        localStorage.setItem("CantSeeColor1","#2b2c40");
    }
    if(!localStorage.CantSeeColor5){
        localStorage.setItem("CantSeeColor5","#2b2c40");
    }
    if(!localStorage.CantSeeColor7){
        localStorage.setItem("CantSeeColor7","#2b2c40");
    }
    if(!localStorage.CantSeeColor8){
        localStorage.setItem("CantSeeColor8","#66ccff");
    }
    if(!localStorage.CantSeesetBBSMsgListColor){
        localStorage.setItem("CantSeesetBBSMsgListColor","#272727");
    }
    if(!localStorage.webimgsrc){//线上图片链接
        localStorage.setItem("webimgsrc",'https://file.uhsea.com/2501/dcf32737963071eb748593c038add7cdP3.png');
    }
    if(!localStorage.version||localStorage.version!== "3.2.4.6"){//安装后的更新检测覆盖
        FirstTime=true
        localStorage.setItem("version","3.2.4.6");localStorage.removeItem("CantSeeColor2");localStorage.removeItem("CantSeeset2");
         if(localStorage.webimgsrc==="https://file.uhsea.com/2501/c8859f9cfcefe1b9fd658301aa1c70af5P.jpg"
             ||localStorage.webimgsrc==="https://file.uhsea.com/2501/54d2c95d4f41d80cec435c63cd50dd24RG.jpg"
             ||localStorage.webimgsrc==="https://file.uhsea.com/2501/dcf32737963071eb748593c038add7cdP3.png"
             ||localStorage.webimgsrc==="https://t1-img.233213.xyz/2024/11/29/674922c38c1df.png"
             ||localStorage.webimgsrc==="https://file.uhsea.com/2501/8298cc1941d4d5173d32e8a78bf67e6a6K.jpg") {
            if(webWidth<webHeight){
                localStorage.setItem("webimgsrc", 'https://m27iarsite.cc/20250225232321_67bde069e2d11.jpg');
            }else{
                localStorage.setItem("webimgsrc", 'https://m27iarsite.cc/20250225232331_67bde0730536d.jpg');
            }
        }
    }else {FirstTime=false}

    /*
    这里是历史使用过的默认在线URL，需要自取：
    https://t1-img.233213.xyz/2024/11/25/67447535ec930.jpg
    https://t1-img.233213.xyz/2024/11/29/674922c38c1df.png
    https://file.uhsea.com/2501/8298cc1941d4d5173d32e8a78bf67e6a6K.jpg
    https://file.uhsea.com/2501/dcf32737963071eb748593c038add7cdP3.png
    https://file.uhsea.com/2501/c8859f9cfcefe1b9fd658301aa1c70af5P.jpg
    https://file.uhsea.com/2501/54d2c95d4f41d80cec435c63cd50dd24RG.jpg
    https://m27iarsite.cc/20250225232331_67bde0730536d.jpg
    https://m27iarsite.cc/20250225232321_67bde069e2d11.jpg
    */
    //本地数值设定结束

    //通过读取本地存储数据进行选择值设定
    let webpiclod="";
    let localpiclod="";

    let PrintToBackground="";
    let PrintToBBSGround="";
    let Scrollstylex;
    let BackPrintSelectBox="";
    let Backleft;//是顶部距离的数据
    let BackTop;//是左侧距离的数据
    if (localStorage.centerPosition==="none"){//是否启用居中渲染
        Backleft=localStorage.left+"px";
        BackTop=localStorage.top+"px";
    }else{
        Backleft=BackTop="";
    }
    if (localStorage.localpiclod==="1"){//读取本地图片还是线上图片
        localpiclod="checked";
    }else{
        webpiclod="checked";
    }
    if (localStorage.printToBack==="1"){//背景的填充位置
        PrintToBackground="checked"
    }else{
        PrintToBBSGround="checked"
    }
    if (localStorage.scrollstyle==="1"){//滚动条渲染
        Scrollstylex="checked"
    }else{
        Scrollstylex=""
    }
    if(localStorage.BackgroundPrint==="none"){
        BackPrintSelectBox="default"
    }else if(localStorage.BackgroundPrint==="cover"){
        BackPrintSelectBox="PicFirst"
    }else if(localStorage.BackgroundPrint==="contain"){
        BackPrintSelectBox="WebFirst"
    }
    //通过读取本地存储数据进行选择值设定结束

    //移除顶栏的磨砂效果
    document.querySelector("#header").setAttribute("style","background-color:#0000 !important;width: 80%;")

    let ContentColor//自定义颜色储存

    let localHightSize="";
    let localWidthSize="";
    let addHTML='<div id="backread">'    //背景特效需要的div插入
    document.querySelector("body").insertAdjacentHTML("afterbegin",addHTML);
    let addtarge=document.querySelector("#backread");
    let bac=document.querySelector("body")//网页本体
    document.querySelector("#header > div > a.navbar-brand.text-truncate.hidden-md.hidden-sm").innerHTML=""//删除手机模式下顶部的图标
    let UserId=document.querySelector("#myDropdown > div.card-header.my_jifen").innerText.slice(document.querySelector("#myDropdown > div.card-header.my_jifen").innerText.indexOf(">"),document.querySelector("#myDropdown > div.card-header.my_jifen").innerText.indexOf("<"))//用户id记录

    //方片特效准备
    let DIVboxsize=localStorage.BoxSize;
    let printNunber
    let arr=[];
    let addBoxinputlocal=document.querySelector("#backread")
    let addDIVmax=`<div id='Maxdiv' style='width:120%;pointer-events: none; position: fixed;top:0;left:-5%;right:-5%;bottom: 0;display: flex;flex-direction: row;flex-wrap:wrap;justify-content:left;align-items: flex-start;'></div>`
    addBoxinputlocal.insertAdjacentHTML("afterend",addDIVmax);
    let DIVmax=document.querySelector("#Maxdiv");
    rePrint(webWidth,webHeight);

    let tiner=setInterval(changeBackground,3000);//设置方片波动效果
    if(localStorage.BoxPrint==="no"){
        clearInterval(tiner)
    }

    window.addEventListener('resize', function(){//背景特效|在界面尺寸变更时重新填充背景方块
        clearInterval(tiner);
        webWidth=window.innerWidth;
        webHeight=window.innerHeight;
        setTimeout(function () {
            rePrint(webWidth,webHeight);
        },100)
        tiner=setInterval(changeBackground,3000);
        if(localStorage.BoxPrint==="no"){
            clearInterval(tiner)
        }
    })
    //window.alert = function() {};
    window.history.replaceState(null, null, window.location.href);

    function getColorSet(){//获取用户的个性化颜色设置
        ContentColor=localStorage.getItem("statelyThemeColor")
        if(ContentColor==="default"){
            ContentColor="#FF8FA2"
        }
    }
    getColorSet()

    function leftANDtop() {
        let MsgBoxRed=Number("0x"+localStorage.MsgBoxColor.substring(1,3)),MsgBoxGreen=Number("0x"+localStorage.MsgBoxColor.substring(3,5)),MsgBoxBlue=Number("0x"+localStorage.MsgBoxColor.substring(5))
        let NeedFixStyle=document.querySelector("head");//插入样式表修改左侧与顶栏样式
        NeedFixStyle.insertAdjacentHTML("afterbegin",'<style id="style1"></style>');//杂，但是为多页面内共有项目
        let nedAddStyle=document.createTextNode(`
        .RangeSetting{height:0.5rem;width:7.8125rem;} 
        .ColorSettinr{width:2.75rem;} 
        .SettiingInput{padding:2px 1px;border:0.125rem 0rem;} 
        border:0 !important;margin:0 !important; transition: 0.3s;} 
        hr{margin: 0.125rem 0 !important;color:#f0f5f9;} 
        small{text-shadow: 1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},-1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 -1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},-1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 -1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},-1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 -1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},-1px 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor},0 -1px ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor} ;font-size:${localStorage.NameFontSize}px !important; color:${localStorage.LocalFontColorsec} } 
        .fuckyou2{
        background-color:rgba(40,64,120,0.4); 
        color: aqua; 
        margin:0px;
        padding: 2px 7px;
        border: 1px aqua solid;
        cursor: pointer;
        transition: background-color 0.3s;
        border-radius: 10px;}
        .fuckyou2:hover{
        background-color: #FFFFFF; 
        color:#66ccff; 
        -webkit-text-stroke:0px;} 
        .fuckyou3{background-color: rgba(40,64,120,0.4); 
        color: aqua; 
        margin:0px;
        padding: 2px 7px;
        border: 1px aqua solid;
        cursor: pointer;
        transition: background-color 0.3s;
        border-radius: 0px;}
        .fuckyou3:hover{background-color: #FFFFFF;
        color:#66ccff;
        -webkit-text-stroke:0px;}  
        .fuckyou{background-color: #2b2c4030; 
        color: white; 
        margin:0.3125rem;
        padding: 0.3125rem;
        border: 0.125rem gray solid;
        font-size:1rem; 
        cursor: pointer;
        transition: background-color 0.3s;
        border-radius: 10px;} 
        .fuckyou:hover{background-color: #FFFFFF; 
        color:#66ccff;} 
        @media (max-width:426px){
        .fuckyou{background-color: #2b2c4030; 
        color: white; 
        padding: 0.5rem 0.5rem;
        border: 0.125rem gray solid;
        font-size:0.625rem;
        cursor: pointer;
        transition: background-color 0.3s;border-radius: 10px;}} 
        `)
        let FixStyle=document.querySelector("#style1");
        FixStyle.appendChild(nedAddStyle);
        //方片动态背景的相关css
        let BorderRGBRed=Number("0x"+localStorage.BoxBorderColor.substring(1,3)),BorderRGBGreen=Number("0x"+localStorage.BoxBorderColor.substring(3,5)),BorderRGBBlue=Number("0x"+localStorage.BoxBorderColor.substring(5))
        NeedFixStyle.insertAdjacentHTML("afterbegin",'<style id="style3"></style>');
        let nedAddStyleSec=document.createTextNode(`
    .M27MojPackImg{
    width:100px; height:100px;background-size:cover;background-color:#000000;margin:10px} 
    .M27flexDivSet{
    pointer-events: none; 
    transition: background-color 2s;
    width:${localStorage.BoxSize}px;height:${localStorage.BoxSize}px;
    flex-basis:${localStorage.BoxSize}px;
    border:1px solid rgba(${BorderRGBRed},${BorderRGBGreen},${BorderRGBBlue},0.${localStorage.BoxBorderCansee});margin;0px;
    }`)
        let FixStyleSec=document.querySelector("#style3");
        FixStyleSec.appendChild(nedAddStyleSec);
        //修改站长加的消息时间|添加指示灯的相关css动画样式
        let NeedFixStyleThee=document.querySelector("head");
        NeedFixStyleThee.insertAdjacentHTML("beforeend",'<style id="style4"></style>');//聊天室使用的css样式表（应该
        let FixStyleThee=document.querySelector("#style4")
        let nedAddStyleThee=document.createTextNode(`
        .card{
        --bs-card-bg: rgba(45, 45, 45, 0.7) !important;}
        .M27-chat-history-body {
        flex: 0 1 auto;height: calc(100vh - 19.5rem);
        padding: 1.25rem 1.25rem;
        overflow-x: hidden;
        overflow-y: auto;}
        .M27-list-unstyled {list-style: none;
        padding-left: 0;}
        .M27-online-users-list {overflow:auto;padding: 5px;
        max-height:200px;
        scrollbar-width:thin !important;}
        .M27-online-users-btn {border: none;
        background: none;padding: 8px;display: flex;
        align-items: center;cursor: pointer;
        color: var(--bs-body-color);
        transition: all 0.2s;position: relative;
        width:36px;height:36px;}
        .M27-online-users-btn:hover {
        color: var(--bs-primary);}
        .text-muted {
        --bs-text-opacity: 1;text-shadow: 0 0 ${localStorage.BorderTextSize}px ${localStorage.LocalFontColor};
        font-size:${localStorage.NameFontSize}px; color:${localStorage.LocalFontColorsec} !important;}
        .message-quote{
        backdrop-filter: blur(5px) !important;
        background-color: rgba(${MsgBoxRed},${MsgBoxGreen},${MsgBoxBlue},${localStorage.MsgBoxTra/2}) !important;
        box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .25) !important;
        }
        .bubble{
        backdrop-filter: blur(5px) !important;
        background-color: rgba(${MsgBoxRed},${MsgBoxGreen},${MsgBoxBlue},${localStorage.MsgBoxTra}) !important;
        box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .25) !important;}
        .dropdown-item {line-height: 1.54;backdrop-filter: blur(5px);}
        .offcanvas {background-color: rgba(43,44,64,0.5); }
        @keyframes M27shineGreen{0%{opacity:0.5;background-color:green;}100%{opacity:1;background-color:#77F602;}} @keyframes M27shineYellow{0%{opacity:0.5;background-color:yellow;}100%{opacity:1;background-color:#F6D603;}} @keyframes M27shineRed{0%{opacity:0.5;background-color:red;}100%{opacity:1;background-color:#F60303;}} .linkOpen{animation:M27shineGreen 5s ease-in infinite alternate} .linkBadWeb{animation:M27shineRed 2s ease-in infinite alternate} .linkOutTime{animation:M27shineYellow 4s ease-in infinite alternate} .loading-more {text-align: center;padding: 10px;color: #666;font-size: 12px;background-color: #66CCFF00; }`)
        FixStyleThee.appendChild(nedAddStyleThee);
    }

    function  handleFileSelect(){//图片转base64存储在indexedDB
        let addlocalupdate=document.querySelector("#webimgsrc")
        let imgFile = new FileReader();
        imgFile.readAsDataURL(addlocalupdate.files[0]);
        imgFile.onload = function () {
            console.log(this)
            let imgDataBase64 = this.result; //base64数据
            // 打开或创建一个数据库
            let request = indexedDB.open('databaseName', 13);
            request.onsuccess = function(event) {// 数据库打开成功时的回调
                let db = event.target.result;
                // 进行事务操作
                let transaction = db.transaction('storeName', 'readwrite');
                let objectStore = transaction.objectStore('storeName');
                // 插入数据
                objectStore.put({ id: 1, name:imgDataBase64});
                transaction.oncomplete = function() {
                    console.log('数据插入DBD成功');
                };
                transaction.onerror = function(event) {
                };//准备写入图片的BASE64数据
                let queryTransaction = db.transaction(['storeName']);
                let queryObjectStore = queryTransaction.objectStore('storeName');
                let query = queryObjectStore.get(1);
                query.onsuccess = function(event) {
                };
                db.close();
            };// 错误处理
            request.onerror = function(event) {
                console.error('Database error:', event.target.error);
            };
        }

    }//图片转base64存储在localstorage部分结束

    function WidthHeightSet(){//背景宽高设定
        if(localStorage.BackgroundPrint==="none"){
            if (localStorage.heightsize==="auto"||localStorage.heightsize==="NaN"){
            localHightSize="auto";
            }else{
            localHightSize=localStorage.heightsize+'%';
            }
            if (localStorage.widthsize==="auto"||localStorage.widthsize==="NaN"){
            localWidthSize="auto";
            }else{
            localWidthSize=localStorage.widthsize+'%';
            }
        }else if(localStorage.BackgroundPrint==="cover"){
            localHightSize="";localWidthSize="cover";
        }else if(localStorage.BackgroundPrint==="contain"){
            localHightSize="";localWidthSize="contain";
        }
    }

    function backPrint(BBSmsgBack,Fromer,NowURL='defaut'){//背景渲染设定
        let FromerAddStyle;
        if(NowURL.includes("bhb_chat")){
            FromerAddStyle=""
        }else{
            FromerAddStyle=`background-attachment:fixed;display: flex;align-items: center;justify-content: center;position: fixed;pointer-events: none;z-index:0;height:100%;width:100%;`

        }
        let openpic = indexedDB.open('databaseName', 13);//调用数据库读取本地存储的base64图片数据
        openpic.onsuccess = function(event) {
            let db = event.target.result;
            // 查询数据
            let queryTransaction = db.transaction(['storeName']);
            let queryObjectStore = queryTransaction.objectStore('storeName');
            let query = queryObjectStore.get(1);
            query.onsuccess = function(event) {
                //转换透明度的数值
                let BackimagePrintPlanNum=(Math.round(Number(100-(localStorage.canseenunber*100))*255/100).toString(16))
                if(BackimagePrintPlanNum==="0"&&localStorage.canseenunber==="0"){BackimagePrintPlanNum=""}
                if (localStorage.PrintPicOpen==="false"){//如果用户选择不渲染图片背景
                    bac.setAttribute("style",`background-color:${localStorage.BackGroundColor};`)
                }else{
                    if(event.target.result.name==="空"&&localStorage.localpiclod === "1"){//如果数据库没有本地图片数据
                        if(localStorage.printToBack==="1"){
                            alert('数据库无图片相关内容存储，将加载在线图片，请在设置添加本地图片')//如果数据库没有本地图片数据且选择渲染本地图片
                            bac.setAttribute('style', `background-color:${localStorage.BackGroundColor};background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-image: url(${localStorage.webimgsrc}); background-repeat: no-repeat; background-size:${localHightSize} ${localWidthSize}`);
                            addtarge.setAttribute('style', `background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-color: ${localStorage.BackGroundColor}${BackimagePrintPlanNum};background-repeat: no-repeat;background-size:cover;display: flex;align-items: center;justify-content: center;position: fixed;pointer-events: none;z-index:0;height:100%;width:100%;`);
                        }else if(localStorage.printToBack==="0"){
                            alert('数据库无图片相关内容存储，将加载在线图片，请在设置添加本地图片')//如果数据库没有本地图片数据且选择渲染本地图片
                            BBSmsgBack.setAttribute('style', `background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-image: url(${localStorage.webimgsrc}); background-repeat: no-repeat; background-size:${localHightSize} ${localWidthSize}`);
                            Fromer.setAttribute('style', `background-color: ${localStorage.BackGroundColor}${BackimagePrintPlanNum};${FromerAddStyle}`);
                        }
                    }else if(localStorage.localpiclod === "0"){
                        if(localStorage.printToBack==="1"){
                            //通过section写入项目留下的标签实现颜色覆盖
                            bac.setAttribute('style', `background-color:${localStorage.BackGroundColor};background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-image: url(${localStorage.webimgsrc}); background-repeat: no-repeat; background-size:${localHightSize} ${localWidthSize}`);
                            addtarge.setAttribute('style', `background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-color: ${localStorage.BackGroundColor}${BackimagePrintPlanNum};background-repeat: no-repeat;background-size:cover;display: flex;align-items: center;justify-content: center;position: fixed;pointer-events: none;z-index:0;height:100%;width:100%;`);
                        }else if(localStorage.printToBack==="0"){
                            BBSmsgBack.setAttribute('style', `background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-image: url(${localStorage.webimgsrc}); background-repeat: no-repeat; background-size:${localHightSize} ${localWidthSize}`);
                            Fromer.setAttribute('style', `background-color: ${localStorage.BackGroundColor}${BackimagePrintPlanNum};${FromerAddStyle}`);
                        }
                    }else if(localStorage.localpiclod === "1"){
                        if(localStorage.printToBack==="1"){
                            bac.setAttribute('style', `background-color:${localStorage.BackGroundColor};background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-image: url(${event.target.result.name});background-repeat: no-repeat; background-size:${localHightSize} ${localWidthSize};`)
                            addtarge.setAttribute('style', `background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-color: ${localStorage.BackGroundColor}${BackimagePrintPlanNum};background-repeat: no-repeat;background-size:cover;display: flex;align-items: center;justify-content: center;position: fixed;pointer-events: none;z-index:0;height:100%;width:100%; `);
                        }else if(localStorage.printToBack==="0"){
                            BBSmsgBack.setAttribute('style', `background-position:${(()=>{if(localStorage.centerPosition==="none"){return ""}else{return "center"}})()}${Backleft} ${BackTop} ;  background-attachment:fixed; background-image: url(${event.target.result.name});background-repeat: no-repeat; background-size:${localHightSize} ${localWidthSize}`)
                            Fromer.setAttribute('style', `background-color: ${localStorage.BackGroundColor}${BackimagePrintPlanNum};${FromerAddStyle}`);
                        }
                    }
                }
            }
            db.close();
        }
    }
    function SetScroll() {//滚动条样式调整
        if (localStorage.scrollstyle==="1"){
            localStorage.setItem("scrollstyle","0");
            document.querySelector("#custom-scrollbar").style.display="";
        }else{
            localStorage.setItem("scrollstyle","1");
            document.querySelector("#custom-scrollbar").style.display="none";
        }
    }
    function NewAddSeet() {//脚本设置按钮|设置页面添加
        let BoxPrintCheckOn;
        if(localStorage.BoxPrint!=="no"){BoxPrintCheckOn='checked'}else{BoxPrintCheckOn=''}
        let newaddbott="<button class='fuckyou' id='newtype'>插件设置</button>";
        if(NowURL.includes("bhb_chat")&&webWidth<=768){
            document.querySelector(".sidebar-user").insertAdjacentHTML("afterend",newaddbott);
        }else{
            document.querySelector(".container").insertAdjacentHTML("beforeend",newaddbott);
        }
        document.querySelector("#newtype").addEventListener("click",()=>{
            if (document.querySelector("#SettingBox").style.display==="none"){
                document.querySelector("#SettingBox").style.display="flex";
            }else {
                document.querySelector("#SettingBox").style.display="none";
                //location.reload();
            }
        })
        document.querySelector("head").insertAdjacentHTML("afterbegin",'<style id="style7"></style>');
        let nedAddStyleSec=document.createTextNode(`
        #SettingBox{
            position: fixed;
            left: 50%;
            top: 50%;
            overflow: auto;
            transform: translate(-50%, -50%);
            z-index: 10000000;
            display: flex;
            font-family: "微软雅黑", sans-serif;
            background-color: #e3fdfd;
            transition: 0.5s;
            color: black !important;
        }
        .SettSelectChange{
            width: 65%;
            height: 550px;
            border: #71c9ce 1px solid;
        }
        #SettingSelect{
            position: fixed;
            overflow: auto;
            left: 0;
            top: 0;
            bottom:0;
            background-color: #71c9ce;
            width:30%;
            transition: 0.2s ease-in-out;
        }
        .SettingBoxShow{
            overflow: auto;
            appearance:none;
            margin: 0;
            padding: 0;
            border: 0;
        }
        .SettingBoxShow:checked+label{
            background-color: #cbf1f5;
            color: #71c9ce;
        }
        .SettingBoxClickShow:first-of-type{
            margin:0.375rem 0 0.375rem 0;
        }
        .SettingBoxClickShow{
            overflow: auto;
            width: 100%;
            display: inline-block;
            text-align: center;
            margin:0 0 0.375rem 0;
            padding: 0.5rem 0;
            transition: ease-out 0.1s;
            border: 1px solid #e3fdfd;
            border-left: 0;
            border-right: 0;
            user-select: none;
        }
        .JsName{
            width: 80%;
            font-size: 24px;
            margin:0 0 0.375rem 0;
            padding: 0.375rem;
            color: #e3fdfd;
            display: flex;
            align-items: center;
            font-family: "微软雅黑", sans-serif;
        }
        .JsName a{
            text-align: center;
            text-decoration: none;
            color: #e3fdfd;
        }
        .SettingShow{
            overflow: auto;
            right: 0;
            top: 0;
            bottom:0;
            width:70%;
            background-color: #e3fdfd;
            display: none;
            position: fixed;
            flex-wrap: wrap;
            flex-direction: column;
            transition: all 0.2s ease-in-out;
        }
        .SettingShow hr{
            margin: 0;
            padding: 0;
            border: 1px solid #71c9ce;
        }
        .SettingShow p{
            margin-left: 0.375rem;
        }
        .RangeSetting{height:0.5rem;width:7.8125rem;}
        .ColorSettinr{width:2.75rem;}
        .SettiingInput{padding:2px 1px;border:0.125rem;}
        .itemBox{
            border: 1px solid #71c9ce;
            width:40%;
            margin: 0.5rem auto auto;
            flex-direction: column;
            flex-flow: row wrap;
            min-height: 160px;
        }
        .itemBox *{
            margin: 0 auto;
            color: black !important;
        }
        .itemBox label{
            margin: 0.5rem 0.5rem 0.5rem 0;
            display: flex;
            font-size: 14px;
        }
        .itemBox span,h1{
            user-select: none;
        }
        .itemBox input{
            width:80%;
        }
        .ShowInputText{
            background-color: #cbf1f5;
            border:0;
            border-bottom: 3px solid rgba(113, 201, 206, 0.38);
            transition: 0.1s;
            height:24px;
            color:black;
        }
        .ShowInputText:focus-visible{
            outline: none;
            border-bottom: 3px solid #00b3b4;
        }
        .ShowButton{
            width:36px;
            height:36px;
            margin:2px;
            display: none;
            border-radius: 30px;
            position: absolute;
            background-color: #00b3b4;
            font-size: 26px;
        }
        @media screen and (max-width: 678px) {
            .SettSelectChange{
                width: 300px;
                height: 550px;
            }
            .itemBox label{
                flex:0 0 100%
            }
            #SettingSelect{
                left: 0;
            }
            .ShowButton{
                display: block;
            }
            .SettingShow{
                width:300px;overflow: auto;height: 550px;flex-wrap: nowrap;
            }
            .SettingShow h1{
                padding-left: 50px;
            }
            .SettingShow a{
                color:blue;
            }
            .itemBox{
                width:80%;
            }
        }`)
        let FixStyleSec=document.querySelector("#style7");
        FixStyleSec.appendChild(nedAddStyleSec);
        let AddSettingBox=`
<div id="SettingBox" class="SettSelectChange" style="display: none;">
    <div style="position: absolute;z-index: 100000000;right:0;padding: 5px 10px;margin: 3px;background-color: #00b3b4;border:1px solid #71c9ce;border-radius: 5px;user-select: none;" id="quit" onclick="if (document.querySelector('#SettingBox').style.display==='none'){document.querySelector('#SettingBox').style.display='flex';}else {document.querySelector('#SettingBox').style.display='none';}"><span>X</span></div>
    <div id="SettingSelect" style="order:1;overflow: hidden;">
        <div class="JsName"><img src="https://boyshelpboys.com//view/img/logo.png" alt="BHB社区" style="width: 48px"><a href="https://boyshelpboys.com/thread-2012.htm">设置</a></div><input type="radio" name="SettingBoxShow" id="one" class="SettingBoxShow" value="all"><label for="one" class="SettingBoxClickShow">通&nbsp&nbsp&nbsp用</label><input type="radio" name="SettingBoxShow" id="two" class="SettingBoxShow" value="Background"><label for="two" class="SettingBoxClickShow">背&nbsp&nbsp&nbsp景</label><input type="radio" name="SettingBoxShow" id="three" class="SettingBoxShow" value="Fort"><label for="three" class="SettingBoxClickShow">字&nbsp&nbsp&nbsp体</label><input type="radio" name="SettingBoxShow" id="fore" class="SettingBoxShow" value="Location"><label for="fore" class="SettingBoxClickShow">定&nbsp&nbsp&nbsp位</label><input type="radio" name="SettingBoxShow" id="five" class="SettingBoxShow" value="Mage"><label for="five" class="SettingBoxClickShow">特&nbsp&nbsp&nbsp效</label><input type="radio" name="SettingBoxShow" id="six" class="SettingBoxShow" value="Item"><label for="six" class="SettingBoxClickShow">部&nbsp&nbsp&nbsp件</label><input type="radio" name="SettingBoxShow" id="seven" class="SettingBoxShow" value="About" id="AboutSelect"><label for="seven" class="SettingBoxClickShow" >关&nbsp&nbsp&nbsp于</label>
    </div>
    <div class="SettingShow" style="order:3;" id="all">
    <input type="button" value="┄" class="ShowButton">
            <h1 style="font-family: '微软雅黑', sans-serif;margin: 0.25rem;">通用设置</h1>
            <hr>
            <div class="itemBox">
            <span>杂项</span><hr>
        <label for="MsgLightCheck">
            <span>启用指示灯</span>
            <input type="checkbox" style="user-select:none;-moz-user-select: none; " name="MsgLightCheck" id="MsgLightCheck" ${(()=>{if(localStorage.MsgLightCheckX==="true"){return "checked"}else{return ""}})()}>
        </label>
        <label for="ScrollSett">
            <span>隐藏滚动条</span>
            <input style="user-select:none;-moz-user-select: none;" class="SettiingInput" type="checkbox" ${Scrollstylex} name="ScrollSett" id="ScrollSett">
        </label>
        </div>
    </div>
    <div class="SettingShow" style="order:3;" id="Background">
    <input type="button" value="┄" class="ShowButton">
            <h1 style="font-family: '微软雅黑', sans-serif;margin: 0.25rem;">背景设置</h1>
            <hr>
            <p>透明度限制为0-100；颜色为16进制RGB格式，不限制大小写（例：#66ccFF）。</p>
            <label id="PrintPicplanLabel" for="PrintPic" style="margin:0;user-select:none;-moz-user-select:none;width: auto;">
                <span>启用图像背景</span>
                <input type="checkbox" class="SettiingInput" name="PrintPic" id="PrintPic" value="PrintPicplan" onchange="localStorage.PrintPicOpen==='false'?localStorage.PrintPicOpen='true':localStorage.PrintPicOpen='false'" ${(()=>{if (localStorage.PrintPicOpen!=='false'){return 'checked';}else{return '';}})()}>
            </label>
            <label for="BackGroundColor">
                <span>&nbsp网站背景色</span>
                <input type="text" class="ShowInputText" maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#BackGroundColor').value=this.value;localStorage.BackGroundColor=this.value}else {document.querySelector('#BackGroundColor').value=this.value;localStorage.BackGroundColor=this.value}}" id="BackGroundColorText" value="${localStorage.CantSeeColor5}">
                <input class="SettiingInput ColorSettinr" type="color" id="BackGroundColor" onchange="document.querySelector('#BackGroundColorText').value=this.value;localStorage.BackGroundColor=this.value" value="${localStorage.BackGroundColor}">
            </label>
            <div id="LoadImgCheck">
            <label style="user-select:none;-moz-user-select:none;" for="localpicon">
                <span>本地图片</span>
                <input class="SettiingInput" type='radio'  name='picloadsele' ${localpiclod} id='localpicon' value="localpicon"  width='100px'>
                <input class="SettiingInput" type='file' id='webimgsrc' accept='image/*' style='width:50%;'>
            </label>
            <br>
            <label style="user-select:none;-moz-user-select:none;" for="webpicon" >
                <span>在线图片</span>
                <input class="SettiingInput" type='radio' ${webpiclod} name='picloadsele' id='webpicon'  width='100px' value="webpicon">
                <input class="SettiingInput ShowInputText" type='text'  value='${localStorage.webimgsrc}' name='' id='localimgsrc' style="width:50%;color: black;" onchange="localStorage.webimgsrc=this.value">
            </label>
            </div>
            <div id="LocalImgCheck">
            <label style="user-select:none;-moz-user-select:none;" for="printToWebback">
                <input class="SettiingInput" type='radio' value='printToWebback' ${PrintToBackground} name='baklocal' id='printToWebback' value="printToWebback"  width='100px'>
                <span>渲染到网页背景</span>
            </label>
            <br>
            <label style="user-select:none;-moz-user-select:none;" for="printToBBS">
                <input class="SettiingInput" type='radio' value='printToBBS' name='baklocal' ${PrintToBBSGround} id='printToBBS'  width='100px'>
                <span>渲染到聊天室背景（仅限聊天室界面生效）</span>
            </label>
            </div>
            <label for="notseenumber">
                <span>背景图片透明度</span>
                <input type="text" class="ShowInputText" id="notseenumberText" style="width:15%;" maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=100&&Number(this.value)>=0){document.querySelector('#notseenumber').value=this.value;localStorage.canseenunber=this.value;}else{this.value=50;document.querySelector('#notseenumber').value=this.value;localStorage.canseenunber=this.value;}" value="${localStorage.canseenunber}">
                <input class="SettiingInput RangeSetting" type="range" min="0" max="1" step="0.01" value="${localStorage.canseenunber}" id="notseenumber" onchange="localStorage.canseenunber=this.value;document.querySelector('#notseenumberText').value=this.value"><br>
            </label>
    </div>
    <div class="SettingShow" style="order:3;" id="Fort">
    <input type="button" value="┄" class="ShowButton">
            <h1 style="font-family: '微软雅黑', sans-serif;margin: 0.25rem;">字体设置</h1>
            <hr>
            <span>淡色字体大小</span>
        <label for='size'>
        <input class="SettiingInput ShowInputText" type='text' onblur='if(!((/[(0-9)]/).test(value)))value=18' value='${localStorage.NameFontSize}' onchange="localStorage.NameFontSize=this.value" name='size' id='size' size="5"><span>px</span><br>
        </label>
        <span>淡色字描边/字体颜色</span>
        <label for="fontcolor">
            <input type="text" class="ShowInputText" style='width:70px' maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#fontcolor').value=this.value;localStorage.LocalFontColor=this.value}else {document.querySelector('#fontcolor').value=this.value;localStorage.LocalFontColor=this.value}}" id="fontcolorText" value="${localStorage.LocalFontColor}">
            <input class="SettiingInput ColorSettinr" type="color" id="fontcolor" value="${localStorage.LocalFontColor}" onchange="document.querySelector('#fontcolorText').value=this.value;localStorage.LocalFontColor=this.value">
            <input type="text" class="ShowInputText" style='width:70px' maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#fontcolorsec').value=this.value;localStorage.LocalFontColorsec=this.value}else {document.querySelector('#fontcolorses').value=this.value;localStorage.LocalFontColorsec=this.value}}" id="fontcolorsecText" value="${localStorage.LocalFontColorsec}">
            <input class="SettiingInput ColorSettinr" type="color" id="fontcolorsec" value="${localStorage.LocalFontColorsec}" onchange="localStorage.LocalFontColorsec=this.value;document.querySelector('#fontcolorsecText').value=this.value;"><br>
        </label>
            <span>淡色字描边大小</span>
        <label for="BorderText">
            <input class="SettiingInput ShowInputText" type="text" onblur='if(!((/[(0-9)]/).test(value)))value=1' size="5" value="${localStorage.BorderTextSize}" onchange="localStorage.BorderTextSize=this.value;" name="BorderText" id="BorderText"><span>px</span><br>
        </label>
    </div>
    <div class="SettingShow" style="order:3;" id="Location">
    <input type="button" value="┄" class="ShowButton">
            <h1 style="font-family: '微软雅黑', sans-serif;margin: 0.25rem;">定位设置</h1>
            <hr>
        <div class="itemBox">
        <span>定位调整</span><hr>
            <span>图像渲染方式</span>
            <label for="selectBox">
            <select style="padding:0;border: 3px solid rgba(113, 201, 206, 0.38);margin-left: 10px" name="selectBox" class="ShowInputText" id="selectBox" onchange="localStorage.BackgroundPrint=this.value;"><option value="default" ${(()=>{if(BackPrintSelectBox==='default'){return 'selected';}else{return ''}})()}>自定义</option><option value="PicFirst" ${(function(){if(BackPrintSelectBox==="PicFirst"){return "selected";}else{return ""}})()}>图像尺寸优先</option><option value="WebFirst" ${(function(){if(BackPrintSelectBox==="WebFirst"){return "selected";}else{return ""}})()}>网站尺寸优先</option></select>
            </label>
            <label for="center">居中渲染<input class="SettiingInput" style="width: auto;margin: 0.125rem 0 0 0;" type="checkbox" id="center" ${(()=>{if(localStorage.centerPosition!=="none"){return "checked";}else{return "";}})()} onchange="if(this.checked){localStorage.setItem('centerPosition',this.value);}else{localStorage.setItem('centerPosition','none');}"  value="center"></label>
        <span>顶部</span>
        <label for='topp'>
        <input class="SettiingInput ShowInputText"  type='text' oninput='if(!((/[(0-9)/-]/).test(value)))value=0' value='${localStorage.top}' onchange="localStorage.top=this.value;" name='topp' id='topp' size="5"><span>px</span>
        </label>
        <span>左部</span>
        <label for='leftt'>
        <input class="SettiingInput ShowInputText" type='text' oninput='if(!((/[(0-9)/-]/).test(value)))value=0' value='${localStorage.left}' onchange="localStorage.left=this.value;" name='leftt' id='leftt' size="5"><span>px</span>
        </label>
        <span>背景高度比例(填写0即为auto)</span>
        <label for='widthsize'>
        <input class="SettiingInput ShowInputText" type='text' onblur='if(!((/[(0-9)]/).test(value))&&value!=="auto")value=100' min='0' value='${localStorage.widthsize}' name='' onchange="localStorage.widthsize=this.value;"  id='widthsize' size='5'><span>%</span>
        </label>
        <span>背景宽度比例(填写0即为auto)</span><label for='heightsize'>
        <input class="SettiingInput ShowInputText" type='text' onblur='if(!((/[(0-9)]/).test(value))&&value!=="auto")value=100' min='0' value=${localStorage.heightsize} name='' onchange="localStorage.heightsize=this.value;"  id='heightsize' size="5"><span>%</span>
        </label>
        </div>
        </div>
    <div class="SettingShow" style="order:3;" id="Mage">
    <input type="button" value="┄" class="ShowButton">
            <h1 style="font-family: '微软雅黑', sans-serif;margin: 0.25rem;">特效设置</h1>
            <hr>
        <div class="itemBox">
        <span>方片背景特效</span><hr>
            <label for="BoxPrintEn">
                <span style="user-select: none;margin: 0;">启用方片特效</span>
                <input class="SettiingInput" type="checkbox" name="BoxPrintEn" id="BoxPrintEn" value="BoxPrintEn" ${BoxPrintCheckOn} onchange="if(this.checked){localStorage.setItem('BoxPrint','yes');}else{localStorage.setItem('BoxPrint','no');}" >
            </label>
            <span>背景方格大小</span>
            <label>
                <input type="text" class="ShowInputText"  maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=150&&Number(this.value)>=50){document.querySelector('#BoxSizeNum').value=this.value;localStorage.BoxSize=this.value;}else{this.value=50;document.querySelector('#BoxSizeNum').value=this.value;localStorage.BoxSize=this.value;}" value="${localStorage.BoxSize}" id="BoxSizeNumText">
                <input class="SettiingInput RangeSetting" type="range" min="50" max="150" step="1" onchange='localStorage.BoxSize=this.value;document.querySelector("#BoxSizeNumText").value=this.value;' value="${localStorage.BoxSize}" id="BoxSizeNum">
            </label>
            <span>边框线颜色/透明度设置</span>
            <label for="BoxBorderColor">
                <input type="text" class="ShowInputText"  maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#BoxBorderColor').value=this.value}else {document.querySelector('#BoxBorderColor').value=this.value}}" value="${localStorage.BoxBorderColor}" id="BoxBorderColorText">
                <input class="SettiingInput ColorSettinr" type="color" id="BoxBorderColor" onchange="localStorage.BoxBorderColor=this.value;document.querySelector('#BoxBorderColorText').value=this.value" value="${localStorage.BoxBorderColor}">
            </label>
            <label for="BoxPrintCansee">
                <input type="text" class="ShowInputText"  maxlength="2" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=99&&Number(this.value)>=0){document.querySelector('#BoxPrintCansee').value=this.value;localStorage.BoxSize=this.value;}else{this.value=33;document.querySelector('#BoxPrintCansee').value=this.value;localStorage.BoxBorderCansee=this.value;}" value="${localStorage.BoxBorderCansee}" id="BoxBorderCanseeText">
                <input class="SettiingInput RangeSetting" type="range" min="0" max="99" step="1" onchange='localStorage.BoxBorderCansee=this.value;document.querySelector("#BoxBorderCanseeText").value=this.value;' value="${localStorage.BoxBorderCansee}" id="BoxPrintCansee">
            </label>
            <span>方片颜色</span>
            <label for="BoxColor">
                <input type="text" class="ShowInputText" maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#BoxColor').value=this.value}else {document.querySelector('#BoxColor').value=this.value}}" value="${localStorage.BoxColor}" id="BoxColorText">
                <input class="SettiingInput ColorSettinr" type="color" id="BoxColor" onchange="localStorage.BoxColor=this.value;document.querySelector('#BoxColorText').value=this.value;" value="${localStorage.BoxColor}">
            </label>
        </div>
    </div>
    <div class="SettingShow" style="order:3;flex-wrap: revert;" id="Item">
    <input type="button" value="┄" class="ShowButton">
            <div>
            <h1 style="font-family: '微软雅黑', sans-serif;margin: 0.25rem;">部件设置</h1>
            <hr>
            <p>透明度限制为0-100；颜色为16进制RGB格式，不限制大小写（例：#66ccFF）。</p>
            </div>
        <div  style="display: flex;flex-wrap: wrap; justify-content: space-between; align-items: flex-start;margin-top: 5px;" >
            <div class="itemBox"><span>文本框边框线</span><hr>
                <span>边框线透明度</span>
                <label>
                <input type="text" class="ShowInputText" id="MsgSeeNum8Text" maxlength="3" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=100&&Number(this.value)>=0){document.querySelector('#MsgSeeNum8').value=this.value;}else{this.value=50;}localStorage.setItem('CantSeeset8',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))" value="${Math.ceil((Number('0x'+localStorage.CantSeeset8).toString(10))*100/255)}">
                <input class="SettiingInput RangeSetting" type="range" id="MsgSeeNum8" value="${Math.ceil((Number('0x'+localStorage.CantSeeset8).toString(10))*100/255)}" onchange="document.querySelector('#MsgSeeNum8Text').value=value;localStorage.setItem('CantSeeset8',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))">
                </label>
                <span>边框线颜色</span>
                <label>
                <input type="text" class="ShowInputText" id="Msgcolor8Text" maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#Msgcolor8').value=this.value}else {document.querySelector('#Msgcolor8').value=this.value}localStorage.setItem('CanSeeColor8',this.value)}" value="${localStorage.CantSeeColor8}">
                <input class="SettiingInput ColorSettinr" type="color" id="Msgcolor8" value="${localStorage.CantSeeColor8}" onchange="document.querySelector('#Msgcolor8Text').value=value;localStorage.setItem('CanSeeColor8',value)}"></label>
            </div>
            <div class="itemBox"><span>文本框</span><hr>
                <span>文本框透明度</span>
                <label>
                <input type="text" class="ShowInputText" maxlength="3" id="MsgSeeNum7Text" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=100&&Number(this.value)>=0){document.querySelector('#MsgSeeNum7').value=this.value}else{this.value=50;}localStorage.setItem('CantSeeset7',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))" value="${Math.ceil((Number('0x'+localStorage.CantSeeset7).toString(10))*100/255)}">
                <input class="SettiingInput RangeSetting" type="range" id="MsgSeeNum7" value="${Math.ceil((Number('0x'+localStorage.CantSeeset7).toString(10))*100/255)}" onchange="document.querySelector('#MsgSeeNum7Text').value=value;localStorage.setItem('CantSeeset7',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))">
                </label>
                <span>文本框背景颜色</span>
                <label>
                <input type="text" class="ShowInputText" id="Msgcolor7Text" maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#Msgcolor7').value=this.value}else {document.querySelector('#Msgcolor7').value=this.value}localStorage.setItem('CantSeeColor7',value)}" value="${localStorage.CantSeeColor7}">
                <input class="SettiingInput ColorSettinr" type="color" id="Msgcolor7" value="${localStorage.CantSeeColor7}" onchange="document.querySelector('#Msgcolor7Text').value=value;localStorage.setItem('CantSeeColor7',value)"></label>
            </div>
            <div class="itemBox"><span>内容区</span><hr>
                <span>内容区透明度</span>
                <label>
                <input type="text" class="ShowInputText" maxlength="3" id="MsgSeeNum1Text" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=100&&Number(this.value)>=0){document.querySelector('#MsgSeeNum1').value=this.value}else{this.value=50;}localStorage.setItem('CantSeeset1',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))" value="${Math.ceil((Number('0x'+localStorage.CantSeeset1).toString(10))*100/255)}">
                <input class="SettiingInput RangeSetting" type="range" id="MsgSeeNum1" value="${Math.ceil((Number('0x'+localStorage.CantSeeset1).toString(10))*100/255)}" onchange="document.querySelector('#MsgSeeNum1Text').value=value;localStorage.setItem('CantSeeset1',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))">
                </label>
                <span>内容区背景颜色</span>
                <label>
                <input type="text" class="ShowInputText" maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#Msgcolor1').value=this.value}else {document.querySelector('#Msgcolor1').value=this.value}localStorage.setItem('CantSeeColor1',value)}" id="Msgcolor1Text" value="${localStorage.CantSeeColor1}">
                <input class="SettiingInput ColorSettinr" type="color" id="Msgcolor1" value="${localStorage.CantSeeColor1}" onchange="document.querySelector('#Msgcolor1Text').value=value;localStorage.setItem('CantSeeColor1',value)"></label>
            </div>
            <div class="itemBox"><span>顶栏</span><hr>
                <span>顶栏透明度</span>
                <label>
                <input type="text" class="ShowInputText" maxlength="3" id="MsgSeeNum5Text" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=100&&Number(this.value)>=0){document.querySelector('#MsgSeeNum5').value=this.value}else{this.value=50;}localStorage.setItem('CantSeeset5',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))" value="${Math.ceil((Number('0x'+localStorage.CantSeeset5).toString(10))*100/255)}">
                <input class="SettiingInput RangeSetting" type="range" id="MsgSeeNum5" value="${Math.ceil((Number('0x'+localStorage.CantSeeset5).toString(10))*100/255)}" onchange="document.querySelector('#MsgSeeNum5Text').value=value;localStorage.setItem('CantSeeset5',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))">
                </label>
                <span>顶栏背景颜色</span>
                <label>
                <input type="text" class="ShowInputText" maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#Msgcolor5').value=this.value}else {document.querySelector('#Msgcolor5').value=this.value}localStorage.setItem('CantSeeColor5',value)}" id="Msgcolor5Text" value="${localStorage.CantSeeColor5}">
                <input class="SettiingInput ColorSettinr" type="color" id="Msgcolor5" value="${localStorage.CantSeeColor5}" onchange="document.querySelector('#Msgcolor5Text').value=value;localStorage.setItem('CantSeesetBBSMsgListColor',value)"></label>
            </div>
        </div>
    </div>
    <div class="SettingShow" style="order:3;flex-wrap: nowrap" id="About">
    <input type="button" value="┄" class="ShowButton">
        <h1 style="font-family: '微软雅黑', sans-serif;margin: 0.25rem;">关于</h1>
        <hr>
        <p>
        使用指南<a href="https://boyshelpboys.com/thread-2012.htm#tutorial">点此进入</a><br>
        更新日志<a href="https://boyshelpboys.com/thread-2012.htm#updatelog">点此进入</a>
        </p>
        <p>
            可以通过以下方式向我反馈：<br>
            在此链接下面回复BUG（推荐）：<a href="https://boyshelpboys.com/thread-2012.htm">BHB聊天室背景更换</a>
            <br>前往GitHub仓库提交issue：<a href="https://github.com/M27-IAR/BHB_BbsBackGroundSetting/issues">GitHub仓库</a>
            <br>私信我修改（不推荐）<a href="https://boyshelpboys.com/user-139020.htm">点击我进入后点击“发私信按钮”</a>
        </p>
        <p>
        </p>
        <p> 
            <i>脚本作者：M27IAR</i>
        </p>
        <hr>
        <div>
            <strong>当前版本为v${localStorage.version}</strong>
            <br>
            <span id="WebV">服务器端最新版本为：v </span>
            <div id="UpdateLog">
            </div>
        </div>
    </div>
</div>`;
        bac.insertAdjacentHTML("afterbegin",AddSettingBox);
        document.querySelector("#LoadImgCheck").addEventListener("click",(e)=>{//图片本地|在线加载选项
            if(e.target.value==="localpicon"){
                localStorage.localpiclod="1";
                document.querySelector("#localpicon").checked=true;
            }else if (e.target.value==="webpicon"){
                localStorage.localpiclod="0";
                document.querySelector("#webpicon").checked=true;
            }
        });
        document.querySelector("#LocalImgCheck").addEventListener("click",(e)=>{//图片加载于网站背景|聊天室背景选项
            if (e.target.value==="printToWebback"){
                localStorage.printToBack="1";
                document.querySelector("#printToWebback").checked=true;
            }else if (e.target.value==="printToBBS"){
                localStorage.printToBack="0";
                document.querySelector("#printToBBS").checked=true;
            }
        });
        document.querySelector("#webimgsrc").addEventListener("change",handleFileSelect)//本体提交图片时向DBD保存base64
        document.querySelector("#ScrollSett").addEventListener("change",SetScroll)//调整滚动条状态
        let lastClick="";
        document.querySelector("#SettingSelect").addEventListener("click",(e)=>{//点击左侧菜单对应选项转换对应界面
            if(lastClick!==""&&e.target.checked){
                document.querySelector(`#${lastClick}`).style.display = "none";
                if (webWidth<=678) {
                    document.querySelector(`#${e.target.value}`).style.left = "0";
                }
            }
            if(e.target.checked) {
                document.querySelector(`#${e.target.value}`).style.display = "flex";
                if (webWidth<=678) {
                    document.querySelector(`#${e.target.value}`).style.left = "0";
                }
                lastClick=e.target.value;
            }
            console.log(webWidth);
            if (webWidth<=678) {
                document.querySelector("#SettingSelect").style.left = "-30%" 
                console.log(document.querySelector("#SettingSelect").style.left);

            }
        })
        document.querySelector("#quit").addEventListener("click",()=>{
            if (lastClick!=="About"){location.reload()}

        })
        document.querySelectorAll(".ShowButton").forEach(element=>{element.addEventListener("click",()=>{
            document.querySelector("#SettingSelect").style.left="0";
            console.log(document.querySelector("#SettingSelect").style.left);
            element.parentElement.style.left="30%"
        })})
        let timestamp = new Date().getTime();
        $.ajax({//更新日志弹出判断|在线服务器版本号比对提醒
            type:"GET",
            url:`https://m27iarsite.cc/package.json?timestamp=${timestamp}`,
            dataType:"json",
            cache:false,
            success:function(data){
                document.querySelector("#UpdateLog").innerHTML=data.description;
                if(!localStorage.version||localStorage.version!== data.version.toString()){//更新后修改部分选项，理论上不会影响用户
                    document.querySelector("#WebV").innerHTML=`服务器端最新版本为：v${data.version.toString()}，Greayfork请前往以下站点下载更新：<a href="https://greasyfork.dpdns.org/zh-CN/scripts/519010-bhb%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E6%9B%B4%E6%8D%A2-%E5%B7%B2%E5%85%A8%E5%B1%80%E5%85%BC%E5%AE%B9">链接1</a><a href="https://greasyfork.org/zh-CN/scripts/519010-bhb%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E6%9B%B4%E6%8D%A2-%E5%B7%B2%E5%85%A8%E5%B1%80%E5%85%BC%E5%AE%B9">链接2</a><br>OpenUserJS请前往以下站点更新：<a href="https://openuserjs.org/scripts/M27IAR/BHB%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E6%9B%B4%E6%8D%A2%EF%BC%88%E5%B7%B2%E5%85%A8%E5%B1%80%E5%85%BC%E5%AE%B9%EF%BC%89">OpenUserJS链接</a>`
                    document.querySelector("#SettingBox").style.display="flex";
                    document.querySelector(`#About`).style.display = "flex";
                    document.querySelector("#seven").checked=true;
                }else{document.querySelector("#WebV").innerHTML=`服务器端最新版本为：v${data.version.toString()}`
                    if(FirstTime){
                        document.querySelector("#SettingBox").style.display="flex";
                        document.querySelector(`#About`).style.display = "flex";
                    }else{
                    document.querySelector(`#About`).style.display = "none";}
                }
                },
            error:function(){document.querySelector("#WebV").innerHTML="获取服务器数据失败"}
        })
    }

    function ScrollHidden() {//启动时滚动条调整
       //修改滚动条状态
        if (localStorage.scrollstyle==="1"){
            document.querySelector("#custom-scrollbar").style.display="none";
        }else{
            document.querySelector("#custom-scrollbar").style.display="";
        }
    }
    function rePrint(webWidth,webHeight) {//绘制启用方格特效时所需方格
        if(localStorage.BoxPrint==="yes"){//如果勾选渲染
            let RGBRed=Number("0x"+localStorage.BoxColor.substring(1,3)),RGBGreen=Number("0x"+localStorage.BoxColor.substring(3,5)),RGBBlue=Number("0x"+localStorage.BoxColor.substring(5))
            //转换颜色为16进制
            printNunber=(Math.ceil((webHeight*1.2)/DIVboxsize))*(Math.ceil(webWidth/DIVboxsize));//计算填充数量
            DIVmax.innerHTML="";//清空渲染区域
            for(let i=0;i<=printNunber;i++){
                let addDIV=`<div id="PrintDIV${i}" class="M27flexDivSet"></div>`
                DIVmax.insertAdjacentHTML("beforeend",addDIV);//填充对应方块
                let strDIV=document.querySelector(`#PrintDIV${i}`);
                strDIV.setAttribute("style",`background-color: rgba(${RGBRed},${RGBGreen},${RGBBlue},0.${Math.floor((Math.random()*60+1))});order: ${i};`);

            }
        }else{
            //啥也不干
        }
    }
    function changeBackground(){//设置方格定时刷新效果
        let jnumb=0,x=100;//jnumb：渲染个数统计，x：渲染延迟
        let RGBRed=Number("0x"+localStorage.BoxColor.substring(1,3)),RGBGreen=Number("0x"+localStorage.BoxColor.substring(3,5)),RGBBlue=Number("0x"+localStorage.BoxColor.substring(5))
        //转换颜色为16进制
        for(let i=0;i<=Math.ceil(printNunber*0.8);i++){//为80%的方块设定随机变色效果
            arr=Array.from(new Set(arr))//去重
            setTimeout(function(){
                let id=Math.floor((Math.random()*printNunber+1))//随机需要设定的方块ID
                if(typeof (arr[i])=="undefined"){//记录变换方块ID 若记录为空
                    arr[i]=id;
                }else{
                    for (let j=0;j<arr[i].length;j++){//记录非空，轮询查重
                        if(arr[j]===id){//若查询成功
                            while(arr[j]!==id){//重新循环直到不再重复
                                id=Math.floor((Math.random()*(printNunber+1)))
                            }
                            arr[j]=id;
                        }else{
                            arr[j]=id;
                        }
                    }
                }
                document.querySelector(`#PrintDIV${id}`).setAttribute("style",`background-color: rgba(${RGBRed},${RGBGreen},${RGBBlue},0.${Math.floor((Math.random()*60+1))});order: ${id};`)
            },x)
            jnumb++//渲染次数累计
            if(jnumb===10){//渲染满十次
                x=x+100//下一轮方块渲染延迟增加
                jnumb=0
            }

        }
    }
    //数据库创建|初始化数据库
    let request = indexedDB.open('databaseName', 13);
    // 处理数据库升级
    request.onupgradeneeded = function(event) {
        let db = event.target.result;
        let upgradeTran=event.target.transaction;
        // 创建对象存储（表）并设置主键
        if (!db.objectStoreNames.contains("storeName")) {
            // 数据库不存在，可以在此处创建对象存储空间
            let objectStore = db.createObjectStore("storeName", { keyPath: "id" });
            objectStore.createIndex('fieldName', 'fieldName', { unique: false });
        }
        if (!db.objectStoreNames.contains("EmoDB")) {
            // 数据库不存在，可以在此处创建对象存储空间
            let objectStoreSec = db.createObjectStore('EmoDB', { keyPath: 'id' });
            // 创建索引
            objectStoreSec.createIndex('picNAME', 'picNAME', { unique: false });
        } else{
            let objectStoreSec =upgradeTran.objectStore("EmoDB") ;
            if (!objectStoreSec.indexNames.contains("picNAME")) {//添加新索引方便新功能
                objectStoreSec.createIndex('picNAME', 'picNAME', { unique: false });
            }
            if (objectStoreSec.indexNames.contains("fieldName")) {//删除旧的无用索引
                objectStoreSec.deleteIndex('fieldName');
                console.log("work")
            }
        }

    };
    // 数据库打开成功时的回调
    request.onsuccess = function(event) {
        let db= event.target.result;
        // 进行事务操作
        let transaction = db.transaction('storeName', 'readwrite');
        let objectStore = transaction.objectStore('storeName');
        // 插入数据
        objectStore.add({ id: 1, name:'空'});
        transaction.oncomplete = function() {
            console.log('空数据插入DBD成功');
        };
    };
    // 错误处理
    request.onerror = function(event) {
        console.error('Database error:', event.target.error);
    };
    //初始值部分结束

    let PicUrl=[]
    let message;//站长的特殊链接处理
    function renderImage(url, alt = '') {//图片处理
        return `<img src="${url}" alt="${alt}" referrerpolicy="no-referrer" class="chat-image" style="width: 7.5rem;object-fit: contain;">`;
    }
    const mediaPatterns = [
        // 图片
        {
            regex: /https?:\/\/[^\s<>"']+?\.(?:jpg|jpeg|gif|png|webp|avif)(?:@[^@\s<>"']*)?/gi,
            handler: url => {
                if (!message.includes(`[img]${url}[/img]`)) {
                    // 清理B站图片链接中的参数
                    url = url.replace(/@.*$/, '');
                    return renderImage(url);
                }
                return url;
            }
        },
        // 视频
        {
            regex: /https?:\/\/[^\s<>"']+?\.(?:mp4|webm|ogg)(?:\?[^\s<>"']*)?/gi,
            handler: url => {return `<video controls src="${url}" preload="none" style="max-width:18.75rem; border-radius:5px; margin:5px 0;"></video>`;
            }
        },
        // 音频
        {
            regex: /https?:\/\/[^\s<>"']+?\.(?:mp3|wav|m4a)(?:\?[^\s<>"']*)?/gi,
            handler: url => {return `<audio controls src="${url}" preload="none" style="width:15.625rem; margin:5px 0;"></audio>`}

        },
        // B站视频
        {
            regex: /https?:\/\/(?:www\.)?bilibili\.com\/video\/(BV[\w]+)[^\s<>"']*/g,
            handler: (match, bvid) => {return `<iframe src="//player.bilibili.com/player.html?&bvid=${bvid}&high_quality=1&autoplay=0" allowfullscreen="allowfullscreen" style="width:18.75rem; height:12.5rem; border-radius:5px; margin:5px 0;"></iframe>`}
        },
        // 网易云音乐
        {
            regex: /https?:\/\/music\.163\.com\/song\?id=(\d+)(?:&[^&\s<>"']*)?/g,
            handler: (match, songId)=>{return `<iframe src="//music.163.com/outchain/player?type=2&id=${songId}&auto=0&height=66" style="width:22.5rem; height:5.375rem; margin: 0;"></iframe>`}

        }
    ];
    function renderExternalLink(url, title = '') {//聊天室链接处理
        const displayTitle = title || url;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="M27-link">${displayTitle}</a>`;
    }
    let firoffsetX,firoffsetY,changoffsetX,changoffsetY,allchangeX=0,allchangeY=0;//图片移动相关变量
    function ImgDragFunction(e){//图片展示部分需要的拖动方法
        changoffsetX=e.offsetX;
        changoffsetY=e.offsetY;
        console.log(firoffsetX,changoffsetX,firoffsetY,changoffsetY)
        console.log(firoffsetX-changoffsetX,firoffsetY-changoffsetY)
        console.log(allchangeX,allchangeY)
        document.querySelector("#ZoomSet").style.translate=`${(allchangeX+(changoffsetX-firoffsetX)*scale)}px ${(allchangeY+(changoffsetY-firoffsetY)*scale)}px`;
        e.stopPropagation();
    }
    let scale = 1;//缩放比率
    let rotatevalue=0;//旋转比率
    const scaleStep = 0.1; // 每次滚动的缩放步长
    const minScale = 0.1; // 最小缩放比例
    const maxScale = 10; // 最大缩放比例
    function ImgShowBoxLoad(State,Url){//图片展示方法
        if (State==="load"){
            bac.insertAdjacentHTML("afterbegin",`
        <div id="ImgBoxM" style="justify-content:center;align-items:center;background-color: rgba(0,0,0);z-index: 100000000;position: fixed;display: none;left: 0;right: 0;top: 0;bottom: 0;width: 100%;height: 100%;">
        <div id="ZoomSet" draggable="true" style="display:flex;justify-content:center;align-items:center;height: ${Math.ceil(webHeight*0.9)}px;position: fixed;transition: all  0.2s ease;">
        <img style="flex:0 0 auto;max-width:100%;max-height: 100%;object-fit: contain;justify-content:center;" src="" id="PicImgPrint" alt="" draggable="false">
        </div>
        <div id="SetBox" style="position: absolute;width: 250px;height: 70px;bottom: 10%;background-color: #aaaaaaaa;display: flex;z-index: 1000000000;">
        <input type="button" value="放大" id="PicMax">
        <input type="button" value="缩小" id="PicMin">
        <input type="button" value="向左翻转90°" id="PicLeftTurn">
        <input type="button" value="向右翻转90°" id="PicRightTurn">
        </div>
        </div>
        `);//图片容纳框
            let ImgShow=document.querySelector("#PicImgPrint");//图片
            let ImgBoxM=document.querySelector("#ImgBoxM");//灰色背景
            let ZoomSet=document.querySelector("#ZoomSet");//缩放框
            ImgBoxM.addEventListener("wheel",(e)=>{
                e.preventDefault();
                if(e.deltaY<0){
                    scale+=scaleStep*scale;
                }else{
                    scale-=scaleStep*scale;
                    console.log(scaleStep*scale);
                }
                scale = Math.min(Math.max(scale, minScale), maxScale);
                ZoomSet.style.transform=`scale(${scale})`;
            })//部分代码来自https://www.cnblogs.com/ai888/p/18613761
            ImgBoxM.addEventListener("click",()=>{//重置图片框状态
                ImgShow.src="";
                ImgBoxM.style.display="none";
                ZoomSet.style.transform=`scale(1)`;
                scale=1;
                ZoomSet.style.translate="0 0";
                ZoomSet.click();
                allchangeX=0;
                allchangeY=0
            });
            ImgShow.addEventListener("click",(e)=>{
                e.stopPropagation();
            });
            ZoomSet.ondragstart = e => {e.preventDefault();}
            ZoomSet.ondragend = e => {e.preventDefault();}
            ZoomSet.addEventListener("mousedown",(e)=>{
                firoffsetX=e.offsetX
                firoffsetY=e.offsetY
                e.stopPropagation();
                ZoomSet.addEventListener("mousemove",ImgDragFunction);
            });
            ImgBoxM.addEventListener("mouseup",(e)=>{
                ZoomSet.removeEventListener("mousemove",ImgDragFunction);
                allchangeX=Number(ZoomSet.style.translate.substring(0,ZoomSet.style.translate.indexOf("px")));
                allchangeY=Number(ZoomSet.style.translate.substring(ZoomSet.style.translate.indexOf("px")+3,ZoomSet.style.translate.lastIndexOf("px")));
                document.querySelector("#ZoomSet").style.translate=`${allchangeX}px ${allchangeY}px`;
                console.log(allchangeY,allchangeX)
                e.stopPropagation();})
            document.querySelector("#SetBox").addEventListener("click",(e)=>{
                 console.log(e.target.value);
                if(e.target.id==="PicMax"){
                    scale+=scaleStep*scale;
                    scale = Math.min(Math.max(scale, minScale), maxScale);
                    ZoomSet.style.transform=`scale(${scale})`;
                }else if(e.target.id==="PicMin"){
                    scale-=scaleStep*scale;
                    scale = Math.min(Math.max(scale, minScale), maxScale);
                    ZoomSet.style.transform=`scale(${scale})`;
                }else if(e.target.id==="PicLeftTurn"){
                    rotatevalue+=90;
                    if (rotatevalue>=360) {
                        rotatevalue = 0;
                        ZoomSet.style.rotate = `${rotatevalue}deg`;
                    }else{ZoomSet.style.rotate=`${rotatevalue}deg`;}
                }else if(e.target.id==="PicRightTurn"){
                    rotatevalue-=90;
                    if (rotatevalue<=-360){
                        rotatevalue=0;
                        ZoomSet.style.rotate=`${rotatevalue}deg`;
                    }else{ZoomSet.style.rotate=`${rotatevalue}deg`;}
                }
                 e.stopPropagation();
            })
        }else if(State==="show"){
            let ImgShow=document.querySelector("#PicImgPrint");//灰色背景
            let ImgBoxM=document.querySelector("#ImgBoxM");//图片
            ImgShow.src=Url;
            ImgBoxM.style.display="flex";
        }
    }
    function PicList(State,message,IMGlist){
        if(State==="push"){//图片列表实现
            let Num1=message.indexOf("=");
            let Num2=message.indexOf("alt");
            let InputLink
            if(message.slice(Num1+2,Num2-2).includes("http")){
                InputLink=message.slice(Num1+2,Num2-2)
            }else{
                InputLink="https://boyshelpboys.com/"+message.slice(Num1+2,Num2-2)
            }
            PicUrl.splice(0,0,InputLink);
            IMGlist.insertAdjacentHTML("afterbegin",`<div class="DIVIMGshow"><img class="ListImgSet" src="${InputLink}" alt="${InputLink}"></div>`)
            return InputLink;
        }
    }
    let NoteSte=false;
    if (typeof Notification !== 'undefined' && typeof window.Notification !== 'undefined'){
        Notification.requestPermission().then(function(result) {//请求通知权限（哭啦什么都要权限啊
        if (result === 'granted') {
            console.log('允许显示系统通知');
            NoteSte=true;
        } else if (result === 'denied') {
            console.log('拒绝显示系统通知');
        } else {
            console.log('默认');
        }
    })
    }else{
        console.log("浏览器不支持Notification")
    }

    let NowURL = window.location.href;//读取当前所在网页

    if (NowURL.includes('boyshelpboys.com/bhb_chat.htm')) {//如果当前网页为聊天室页面
        let histor=document.querySelector("#body > div > div.chat-wrapper > div.chat-container")//聊天页面外层边框
        histor.setAttribute('style', `background-color: ${localStorage.CantSeeColor1}${localStorage.CantSeeset1} !important;`)//聊天页面外层边框

        backPrint(document.querySelector("#top > div > div"),document.querySelector("#top > div > div > main > div"),NowURL);
        WidthHeightSet();
        leftANDtop();
        ScrollHidden();
        NewAddSeet();
        //聊天室页面的独占设置内容
        let AddSetter=`
    <div class="itemBox">
    <span>聊天室界面设置</span><hr>
    <div id="MsgSetSet">
    <label for="BBSprintCheck" style="margin:0;user-select:none;-moz-user-select:none;width: auto;">
    <span>启用新的聊天室界面（无效中）</span>
    <input  ${(()=>{if (localStorage.M27NewBBGPrint!=="false"){return "checked";}else{return "";}})()} type="checkbox" class="SettiingInput" name="BBSprintCheck" id="BBSprintCheck" value="PrintPicplan">
    </label>
    <span>消息气泡透明度调整</span>
    <label for="MsgBoxTra">
    <input class="SettiingInput RangeSetting" type="range" min="0" max="1" step="0.01" value="${localStorage.MsgBoxTra}"onchange="localStorage.MsgBoxTra=value" id="MsgBoxTra" >
    </label>
    <span>消息气泡背景色调整</span>
    <label for="MsgBoxColor">
    <input class="SettiingInput ColorSettinr" type="color" id="MsgBoxColor" onchange="localStorage.MsgBoxColor=value" value="${localStorage.MsgBoxColor}">
    </label>
    </div>`//杂项页面|聊天室气泡&自定义聊天室开关
        document.querySelector("#all > div:nth-child(4)").insertAdjacentHTML("afterend",AddSetter);
        document.querySelector("#BBSprintCheck").addEventListener("click",(e)=>{
            if(e.target.checked){
                localStorage.setItem("M27NewBBGPrint","true");
            }else{
                localStorage.setItem("M27NewBBGPrint","false");
            }
        })
        let AddSetterSec=`
        <div class="itemBox"><span>聊天室界面|消息列表区</span><hr>
                <span>透明度</span>
                <label>
                <input type="text" class="ShowInputText" maxlength="3" id="CantSeesetBBSMsgListText" oninput="this.value = this.value.replace(/[^0-9]/g, '')" onchange="if (Number(this.value)<=100&&Number(this.value)>=0){document.querySelector('#CantSeesetBBSMsgList').value=this.value}else{this.value=50;}localStorage.setItem('CantSeesetBBSMsgList',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))" value="${Math.ceil((Number('0x'+localStorage.CantSeesetBBSMsgList).toString(10))*100/255)}">
                <input class="SettiingInput RangeSetting" type="range" id="CantSeesetBBSMsgList" value="${Math.ceil((Number('0x'+localStorage.CantSeesetBBSMsgList).toString(10))*100/255)}" onchange="document.querySelector('#CantSeesetBBSMsgListText').value=value;localStorage.setItem('CantSeesetBBSMsgList',((~~(value*255/100))!==0?(~~(value*255/100)).toString(16):(~~(value*255/100)).toString(16)+'0'))">
                </label>
                <span>背景颜色</span>
                <label>
                <input type="text" class="ShowInputText" maxlength="7" oninput="this.value = this.value.replace(/[^a-f0-9#]/gi, '0');if(this.value.length>7){this.value='#'+this.value.substring(1,6)}" onchange="if (this.value.indexOf('#')===0){let VaLeng=this.value.length;if (VaLeng<7){for (let i=0;i<7-VaLeng;i++){this.value+='0';}document.querySelector('#CantSeesetBBSMsgListColor').value=this.value}else {document.querySelector('#CantSeesetBBSMsgListColor').value=this.value}localStorage.setItem('CantSeesetBBSMsgListColor',value)}" id="CantSeesetBBSMsgListColorText" value="${localStorage.CantSeesetBBSMsgListColor}">
                <input class="SettiingInput ColorSettinr" type="color" id="CantSeesetBBSMsgListColor" value="${localStorage.CantSeesetBBSMsgListColor}" onchange="document.querySelector('#CantSeesetBBSMsgListColorText').value=value;localStorage.setItem('CantSeesetBBSMsgListColor',value)"></label>
            </div>
        `
        console.log(document.querySelector("#Item > div"))
        document.querySelector("#Item > div:nth-last-child(1)").insertAdjacentHTML("beforeend",AddSetterSec);
        document.querySelector("#BBSprintCheck").addEventListener("click",(e)=>{
            if(e.target.checked){
                localStorage.setItem("M27NewBBGPrint","true");
            }else{
                localStorage.setItem("M27NewBBGPrint","false");
            }
        })

        //聊天室界面修改所用CSS
        let NeedFixStyle=document.querySelector("body");
        NeedFixStyle.insertAdjacentHTML("afterend",'<style id="ChatStyle"></style>');
        let ChatAddStyle=document.createTextNode(`
        .chat-sidebar{
        width: 260px !important;
        display: flex !important;
        flex-direction: column !important;
        background: ${localStorage.CantSeesetBBSMsgListColor}${localStorage.CantSeesetBBSMsgList} !important;
        border-right: 1px solid #444444 !important;
        }
        @media screen and (max-width: 768px){
        .chat-wrapper{
        position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    padding: 0 !important;
    margin: 0 !important;
    z-index: 99999 !important;
    background: ${localStorage.CantSeesetBBSMsgListColor}${localStorage.CantSeesetBBSMsgList} !important;
    }
    .chat-sidebar {
    width: 100% !important;
    flex: none !important;
        }
        #layout-navbar{
        display:none;}
        }
       
        .input-area{
        border-top: 1px solid #444444 !important;
        background: ${localStorage.CantSeeColor7}${localStorage.CantSeeset7} !important;
        }
        }
        `)
        document.querySelector("#ChatStyle").appendChild(ChatAddStyle)

        let baca=document.querySelector("#body > div > div.chat-wrapper > div.chat-container > div.chat-main")//聊天历史记录1
        let ul=document.querySelector("#messages")//聊天历史记录2（位置更靠里）
        let msginputbox=document.querySelector("#input")//输入框自己
        let LiuYanTop=document.querySelector("#body > div > div.chat-wrapper > div.chat-container > div.chat-main > div.chat-header")

        let addlocalupdate=document.querySelector("#webimgsrc");

        bac.setAttribute('style',`background-color:${localStorage.BackGroundColor};`)//网页背景部分
        LiuYanTop.setAttribute("style",`background-color:${localStorage.CantSeeColor5}${localStorage.CantSeeset5};border:0px !important;`);
        baca.setAttribute('style', `background-color: ${localStorage.CantSeeColor1}${localStorage.CantSeeset1} !important;`)//聊天历史记录1
        ul.setAttribute('style', `background-color: ${localStorage.CantSeeColor1}${localStorage.CantSeeset1} !important;`)//聊天历史记录2（位置更靠里）
        msginputbox.setAttribute('style', `background-color: ${localStorage.CantSeeColor7}${localStorage.CantSeeset7} !important;border:1px solid ${localStorage.CantSeeColor8}${localStorage.CantSeeset8} !important;height:2.5rem !important;`)//输入框部分

        addlocalupdate.addEventListener("change",handleFileSelect,false)//本体提交图片时向DBD保存base64

        //表情功能 暂时搁置
        let MojPack=`<button id="MojPack" class="toolbar-btn">😀</button>`
        let ToolBar=document.querySelector("#inputToolbar");
        ToolBar.insertAdjacentHTML("beforeend",MojPack)
        let MojPackOut=document.querySelector("#MojPack");
        let adddiv4=`<div id="MojPackBack" ></div>`
        bac.insertAdjacentHTML("beforeend",adddiv4)
        let adddiv4Out=document.querySelector("#MojPackBack");
        adddiv4Out.setAttribute('style','overflow:auto; border-radius: 5px;position: absolute;top: 40%;left: 20%;transform: translate(0%, -45%);width: 70%;height: 65%;border: 1px solid gray;z-index:1;display:none;background-color:rgba(30, 32, 34, 0.70);color:#f0f5f9;flex-wrap:wrap;flex-direction:row;justify-content:space-around;align-items:center;z-index:1000000;')
        MojPackOut.addEventListener('click',()=>{if(adddiv4Out.style.display==="none" ){adddiv4Out.style.display="flex"}else{adddiv4Out.style.display="none"}})
        let MojPackAdd=`
        <div class="M27MojPackImg las la-minus-circle" title="点击删除图片" style="text-align: center;line-height: 100px; font-size: 80px;" id="MojPackDeleteImg" ></div>
        <div class="M27MojPackImg la la-plus-circle" title="点击添加图片" style="text-align: center;line-height: 100px; font-size: 80px;" id="MojPackAddImg" ></div>`
        adddiv4Out.insertAdjacentHTML("afterbegin",MojPackAdd);
        let MojPackAddGet=document.querySelector("#MojPackAddImg");
        let MojPackDeleteGet=document.querySelector("#MojPackDeleteImg");
        let request = indexedDB.open('databaseName', 13);
        request.onsuccess=(e)=>{//启动数据库，准备填充表情包界面
            let db=e.target.result
            let objectStore =  db.transaction('EmoDB').objectStore('EmoDB');
            objectStore.openCursor().onsuccess=(e)=>{
                let cursor=e.target.result
                if (cursor){//遍历中|读取到一个填充一个
                    let binaryString=atob(cursor.value.picBASE64.slice(cursor.value.picBASE64.indexOf(",")+1))
                    const byteArray=new Uint8Array(binaryString.length)
                    for(let i=0;i<byteArray.length;i++){
                        byteArray[i]=binaryString.charCodeAt(i);
                    }
                    const blobIMG=new Blob([byteArray],{type:`${cursor.value.picBASE64.slice(cursor.value.picBASE64.indexOf(":")+1,cursor.value.picBASE64.indexOf(";"))}`});
                    const imageUrl = URL.createObjectURL(blobIMG);
                    let MojIMGAdd=`<div class="M27MojPackImg la M27Mojuse" title='${cursor.value.picNAME}' style="text-align: center;line-height: 100px; font-size: 80px;background-image:url(${imageUrl});background-position: center" ></div>`
                    MojPackAddGet.insertAdjacentHTML("afterend",MojIMGAdd);
                    cursor.continue();
                }else{//遍历完成|为之前填充的表情包添加点击发送事件
                    console.log("数据库遍历完毕");
                    document.querySelectorAll('.M27Mojuse').forEach((e)=>{
                        e.addEventListener('click',function Send(e){
                            let SearchTitle=e.target.title;
                            let request = indexedDB.open('databaseName', 13);
                            request.onsuccess=(e)=>{
                            let db=e.target.result
                            let objectStore =  db.transaction('EmoDB','readonly').objectStore('EmoDB');
                            let SearchReport=objectStore.index('picNAME').get(`${SearchTitle}`)
                            SearchReport.onsuccess=(e)=>{//读取数据库并重编码为File类型
                                console.log(e.target.result);
                                if (e.target.result!==undefined){
                                let binaryString=atob(e.target.result.picBASE64.slice(e.target.result.picBASE64.indexOf(",")+1))
                                const byteArray=new Uint8Array(binaryString.length)
                                for(let i=0;i<byteArray.length;i++){
                                    byteArray[i]=binaryString.charCodeAt(i);
                                }
                                const blobIMG=new Blob([byteArray],{type:`${e.target.result.picBASE64.slice(e.target.result.picBASE64.indexOf(":")+1,e.target.result.picBASE64.indexOf(";"))}`});
                                console.log(blobIMG)
                                const formData=new FormData();
                                formData.append('file',blobIMG,e.target.result.picNAME);
                                let fileReader=new FileReader()
                                fileReader.addEventListener("loadend",()=>{
                                    console.log(fileReader.result)
                                })
                                fileReader.readAsText(blobIMG);
                                console.log(`${e.target.result.picBASE64.slice(e.target.result.picBASE64.indexOf(":")+1,e.target.result.picBASE64.indexOf(";",e.target.result.picBASE64.indexOf("/")+1))}`);
                                $.ajax({//上传并发送
                                    url:'https://boyshelpboys.com/plugin/msto_chat/route/app/ajax.php?c=upload_image',
                                    type: 'POST',
                                    data: formData,
                                    contentType:false,
                                    processData: false,
                                    success: function(response) {
                                        try {
                                            if (typeof response === 'string') {
                                                response = JSON.parse(response);
                                                console.log(response);
                                            }
                                            if (response.code === 0 && response.data) {
                                                console.log(response.data);
                                                document.querySelector("#input").value=response.data;
                                                document.querySelector("#sendBtn").click()
                                            } else {
                                                alert('上传失败：' + (response.message || '未知错误'));
                                            }
                                        } catch (e) {
                                            console.error('Response parse error:', e, response);
                                            alert('上传失败：服务器响应解析错误');
                                        }
                                    },
                                    error: function(xhr, status, error) {
                                        console.error('Upload error:', {xhr, status, error});
                                        alert('上传失败：' + error);
                                    }
                                });
                                }
                            }
                            }
                        })
                    })
                }
            }
        }
        MojPackAddGet.addEventListener("click",()=>{//表情包添加事件
            console.log("work")
            const $input = $('<input type="file" accept="image/*" multiple style="display:none" id="AddMoj">');//添加文件选择框并激活点击事件
            $('body').append($input);
            $input.trigger('click');
            document.querySelector("#AddMoj").addEventListener('change',(e)=>{//选中后填充到数据库
                console.table(e.target.files);
                Array.from(e.target.files).forEach((file,index)=>{
                    let imgFile = new FileReader();
                    let EmoInputList=e.target.files[index]
                    imgFile.readAsDataURL(EmoInputList)
                    imgFile.onload=()=>{
                        let inputBASE64=imgFile.result
                        let request = indexedDB.open('databaseName', 13);
                        console.log(inputBASE64)
                        request.onsuccess=(e)=>{
                            let db=e.target.result
                            let transaction = db.transaction('EmoDB', 'readwrite');
                            let objectStore = transaction.objectStore('EmoDB');
                            objectStore.put({id:localStorage.EmoDBlist,picNAME:EmoInputList.name,picBASE64:inputBASE64})//保存图片计数|图片名|图片BASE64数据
                            localStorage.EmoDBlist++
                            let binaryString=atob(inputBASE64.slice(inputBASE64.indexOf(",")+1))
                            const byteArray=new Uint8Array(binaryString.length)
                            for(let i=0;i<byteArray.length;i++){
                                byteArray[i]=binaryString.charCodeAt(i);
                            }
                            const blobIMG=new Blob([byteArray],{type:`${inputBASE64.slice(inputBASE64.indexOf(":")+1,inputBASE64.indexOf(";"))}`});
                            const imageUrl = URL.createObjectURL(blobIMG);
                            let MojIMGAdd=`<div class="M27MojPackImg la M27Mojuse" title='${EmoInputList.name}' style="text-align: center;line-height: 100px; font-size: 80px;background-image:url(${imageUrl});background-position: center" ></div>`
                            MojPackAddGet.insertAdjacentHTML("afterend",MojIMGAdd);
                            console.log(MojPackAddGet.nextElementSibling);
                            MojPackAddGet.nextElementSibling.addEventListener('click',function Send(e){
                                let SearchTitle=e.target.title;
                                let request = indexedDB.open('databaseName', 13);
                                request.onsuccess=(e)=>{
                                    let db=e.target.result
                                    let objectStore =  db.transaction('EmoDB','readonly').objectStore('EmoDB');
                                    let SearchReport=objectStore.index('picNAME').get(`${SearchTitle}`)
                                    SearchReport.onsuccess=(e)=>{//读取数据库并重编码为File类型
                                        console.log(e.target.result);
                                        if (e.target.result!==undefined){
                                            let binaryString=atob(e.target.result.picBASE64.slice(e.target.result.picBASE64.indexOf(",")+1))
                                            const byteArray=new Uint8Array(binaryString.length)
                                            for(let i=0;i<byteArray.length;i++){
                                                byteArray[i]=binaryString.charCodeAt(i);
                                            }
                                            const blobIMG=new Blob([byteArray],{type:`${e.target.result.picBASE64.slice(e.target.result.picBASE64.indexOf(":")+1,e.target.result.picBASE64.indexOf(";"))}`});
                                            console.log(blobIMG)
                                            const formData=new FormData();
                                            formData.append('file',blobIMG,e.target.result.picNAME);
                                            let fileReader=new FileReader()
                                            fileReader.addEventListener("loadend",()=>{
                                                console.log(fileReader.result)
                                            })
                                            fileReader.readAsText(blobIMG);
                                            console.log(`${e.target.result.picBASE64.slice(e.target.result.picBASE64.indexOf(":")+1,e.target.result.picBASE64.indexOf(";",e.target.result.picBASE64.indexOf("/")+1))}`);
                                            $.ajax({//上传并发送
                                                url:'https://boyshelpboys.com/plugin/msto_chat/route/app/ajax.php?c=upload_image',
                                                type: 'POST',
                                                data: formData,
                                                contentType:false,
                                                processData: false,
                                                success: function(response) {
                                                    try {
                                                        if (typeof response === 'string') {
                                                            response = JSON.parse(response);
                                                            console.log(response);
                                                        }
                                                        if (response.code === 0 && response.data) {
                                                            console.log(response.data);
                                                            document.querySelector("#input").value=response.data;
                                                            document.querySelector("#sendBtn").click()
                                                        } else {
                                                            alert('上传失败：' + (response.message || '未知错误'));
                                                        }
                                                    } catch (e) {
                                                        console.error('Response parse error:', e, response);
                                                        alert('上传失败：服务器响应解析错误');
                                                    }
                                                },
                                                error: function(xhr, status, error) {
                                                    console.error('Upload error:', {xhr, status, error});
                                                    alert('上传失败：' + error);
                                                }
                                            });
                                        }
                                    }
                                }
                            })
                        }
                        request.onerror = (event)=> {
                            console.error('Database error:', event.target.error);
                        };
                    }
                })
            });
            $input.remove()
        })
        let StartRemove=false;//判断是否为删除模式
        MojPackDeleteGet.addEventListener("click",()=>{//表情包删除事件
            if(!StartRemove){
                document.querySelectorAll('.M27Mojuse').forEach(e=>{
                    let ReadyRemove=e;
                    let Title=e.title;
                    let AddDeleteButton=`<input type="button" class="DeleteButton" title="${Title}"  style="display: none" id="M27Moj${Title}"><label class="DeleteButtonLabel" for="M27Moj${Title}" style="width: 30px;height:30px;background-color: rgba(0,0,0,0.3);line-height: 28px;font-size: 19px;text-align: center;position: relative;top: -55%;left: -33%;">X</label>`;
                    e.insertAdjacentHTML('afterbegin',AddDeleteButton)
                    e.querySelector('.DeleteButton').addEventListener('click', (e)=>{
                        e.stopPropagation();
                        let request = indexedDB.open('databaseName', 13);
                        request.onsuccess=(e)=>{
                            let db=e.target.result
                            let objectStore =  db.transaction('EmoDB','readwrite').objectStore('EmoDB');
                            let SearchReport=objectStore.index('picNAME').get(`${Title}`)
                            SearchReport.onsuccess=(e)=>{
                                console.log(e.target.result)
                                let DeleteWorker=objectStore.delete(e.target.result.id);
                                DeleteWorker.onsuccess=()=>{
                                    ReadyRemove.remove();
                                    localStorage.EmoDBlist--
                                    console.log("删除完成")
                                }
                            }
                        }
                    })
                    StartRemove=true;
                })
            }else{
                document.querySelectorAll('.M27Mojuse').forEach(e=>{
                    console.log(e.querySelector('.DeleteButton'))
                    e.querySelector('.DeleteButton').remove()
                    e.querySelector('.DeleteButtonLabel').remove()
                })
                StartRemove=false;
            }
        })

        //在线人数重写
        // document.querySelector("div.chat-history-header.border-bottom > div > div").nextElementSibling.remove();
        // document.querySelector("div.chat-history-header.border-bottom > div > div").insertAdjacentHTML('afterend',`<button id="M27ChangeUserList" class="M27-online-users-btn" title="在线用户"><i class="la la-users" style="font-size: 20px;"></i><span style="font-size: 12px;color: ${localStorage.statelyThemeColor};min-width: 20px;text-align: center;position: absolute;top: 2px;right: 2px;padding: 0 2px;"  id="M27UserNun">0</span></button>`)
        // document.querySelector("#M27ChangeUserList").addEventListener("click",()=>{
        //     if (document.querySelector("div.chat-history-header.border-bottom").nextElementSibling.style.display==="none"||document.querySelector("div.chat-history-header.border-bottom").nextElementSibling.style===""){
        //         document.querySelector("div.chat-history-header.border-bottom").nextElementSibling.setAttribute("style","display: block;")
        //     }else{
        //         document.querySelector("div.chat-history-header.border-bottom").nextElementSibling.setAttribute("style","display: none;")
        //     }
        // })
        // document.querySelector("#M27CHANGE").addEventListener("click",(e)=>{
        //     console.log(e.target)
        //     if (e.target.className==="username"){
        //         document.querySelector("#msg").value+="@"+e.target.innerHTML+" ";
        //     }else if(e.target.src!==undefined){
        //         window.open(`https://boyshelpboys.com/user-${e.target.getAttribute("data-UID")}.htm`)
        //     }
        // })

        //自定义消息页面
        if(localStorage.M27NewBBGPrint==="true"){
            ImgShowBoxLoad("load")//加载图像展示框
            setInterval(()=>{if(typeof c === 'undefined' ){}else{clearInterval(c);}},1);//删除站长原本的消息获取
        //添加样式表
        let NeedFixStyleSix=document.querySelector("head");
        NeedFixStyleSix.insertAdjacentHTML("beforeend",'<style id="style6"></style>');
        let FixStyleSix=document.querySelector("#style6")
        let MsgBoxRed=Number("0x"+localStorage.MsgBoxColor.substring(1,3)),MsgBoxGreen=Number("0x"+localStorage.MsgBoxColor.substring(3,5)),MsgBoxBlue=Number("0x"+localStorage.MsgBoxColor.substring(5))
        let InnetStyle=document.createTextNode(`
        #M27-OnliceUser{display:flex;position: fixed;right: -48%;top:0;bottom: 0;background-color: #66ccff50;width: 50%;height:100%;backdrop-filter:  blur(5px);z-index: 100001;transition:all 0.3s ease 0.1s;}
        #M27-OnliceUser:hover{right: 0%;}
        .ListImgSet{max-height:100px;max-width:100%;}
        .DIVIMGshow{border:3px solid gray;margin:3px;}
        #SelectList{width:3%;flex-direction:row;flex-wrap:wrap;display:flex;position: sticky;height:100%}
        #MsgIMGShowLocal{width:97%;flex-direction:row;flex-wrap:wrap;display:flex;position: relative;overflow:scroll;}
        @media(max-width:600px){
        #M27-OnliceUser{position: fixed;right: -63%;top:0;bottom: 0;background-color: #66ccff50;width: 70%;backdrop-filter:  blur(5px);z-index: 100001;transition:all 0.3s ease 0.1s;}
        #M27-OnliceUser:hover{right: 0%;}
        #SelectList{width:10%;flex-direction:row;flex-wrap:wrap;display:flex;position: sticky;height:100%}
        #MsgIMGShowLocal{width:90%;flex-direction:row;flex-wrap:wrap;display:flex;position: relative;overflow:scroll;}
        }
        .M27-MsgBox{
        list-style:none;
        padding: 0;
        margin: 0;
        display: flex;
        width: 99%;
        height: auto;
        font-size: 1rem;
        justify-content: space-around;
        }
        .M27-MsgAvatar{
        margin: 0.375rem;
        width: 2.25rem;
        height: 2.25rem; 
        align-items: center;
        justify-items: center;
        display: flex;
        top: 0.125rem;
        left: 0.125rem;
        }
        .M27-MsgAvatarImg{
        font-size: 6px;
        overflow: hidden;
        width: 2.25rem;
        height: 2.25rem;
        }
        .M27-MsgContent{
        width: 95%;
        align-items: flex-start;
        justify-items: center;
        display: flex;
        flex-direction: column;
        }
        .M27-userName{
        font-size: 12px;
        }
        .M27-ChatMssageText{
        background-color: orange;
        padding: 0.375rem;
        margin:0.375rem 0 0 0.375rem;
        max-width:80% ;
        height: auto; 
        white-space: normal;
        color:#FFFFFF;
        position: relative;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        border-radius:0rem .375rem .375rem .375rem;
        padding: .75rem 1rem;
        backdrop-filter: blur(5px) !important;
        background-color: rgba(${MsgBoxRed},${MsgBoxGreen},${MsgBoxBlue},${localStorage.MsgBoxTra}) !important;
        box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .25) !important;
        }
        .M27-link{
        display:block;
        margin:5px 0; 
        word-break:break-all;
        }
        `)
        FixStyleSix.appendChild(InnetStyle);
        bac.insertAdjacentHTML('afterbegin',`
        <div id="M27-OnliceUser"> 
        <div id="SelectList"><button style="width: 100%;" id="SelectButton"></button><button style="width: 100%;" id="ImgListButton"></button></div>
        <div id="MsgIMGShowLocal"></div>
        </div>`)

        let MsgPageNum=0;//消息页数
        let MsgNum=0//消息条数
        let MsgId;//最新消息id
        let MsgIdcheck=true;//消息id重复性验证
        let MgsList=[];//处理后的消息记录
        let LoadMsgList=[];//服务器端获取的消息记录
        let PrintNumCunt=0;//累计渲染消息计数
        let IMGlist=document.querySelector("#MsgIMGShowLocal");//右侧图片展示列表
            let LoadMsgListProxy=new Proxy(LoadMsgList,{//历史消息排列|填充
            set(target, p, newValue) {
                target[p]=newValue;
                let SlotCheck=false;//验证数组空槽
                let SlotCheckArray=Array.from(target)
                for (let i=0;i<=target.length-1;i++){
                    if(SlotCheckArray[i]===null || SlotCheckArray[i]===undefined || SlotCheckArray[i]===""){
                        SlotCheck=false;
                        break;
                    }else{
                        SlotCheck=true;
                    }
                }//验证数组空槽结束
                if (SlotCheck && target.length===MsgPageNum){//当确认数据获取完备时，调整数据格式并填充
                    for (let i=0;i<=target.length-1;i++){
                        target[i].forEach(item=>{
                            let InputJSON={msg:`${JSON.parse(item).msg}`,name:`${JSON.parse(item).name}`,pic:`${JSON.parse(item).pic}`,time:`${JSON.parse(item).time}`,id:`${JSON.parse(item).id}`,msgboxID:`${i}`}
                            if (typeof JSON.parse(item).quote!=="undefined"){//若有引用消息，额外添加
                                InputJSON.quote=JSON.parse(item).quote;
                            }
                            MsgListProxy.push(InputJSON);
                        });
                    }
                }
                return null;
            }
        })
        let MsgListProxy=new Proxy(MgsList,{//列表加载完成后的渲染部分
            set(target, p, newValue) {
                if (p!=="length"){
                target.push(newValue)
                    if (target.length>=MsgNum){
                        document.querySelector(".chat-history-body > ul").style.display="none"//隐藏原来的消息列表
                        document.querySelector(".chat-history-body").insertAdjacentHTML("beforeend",`<ul class="M27-list-unstyled chat-history talk" data-base-href="../plugin/msto_chat/route/" id="M27-MsgList"></ul>`);//添加新的消息列表
                        ul=document.querySelector('#M27-MsgList')//重新对ul赋值使其对应新消息列表
                        ul.setAttribute('style', `background-color: ${localStorage.CantSeeColor1}${localStorage.CantSeeset1};`)
                        ul.innerHTML=""
                        ul.addEventListener("click",function(e){
                            if (e.target.className.includes("M27-userName")){//点击名字@对方
                                document.querySelector("#msg").value+="@"+e.target.getAttribute('data-username')+" ";
                            }else if (e.target.className.includes("chat-image")){//点击图片进入图片展示页面
                                let ImgLoadTest=new Image()
                                if (e.target.src!=null){//图片加载检测
                                    ImgLoadTest.src=e.target.src
                                    ImgLoadTest.onload=()=>{
                                        ImgShowBoxLoad("show",e.target.src)
                                    }
                                    ImgLoadTest.onerror=()=>{
                                        console.log("链接无法加载")
                                    }
                                }
                            }
                        })
                        //渲染全部消息
                            for (let y=0;y<MgsList.length;y++){
                                if(MgsList[y].name){
                                    message=MgsList[y].msg//修正特殊消息内容
                                    message = message.replace(/\[img](.*?)\[\/img]/g, (match, url) => {
                                        // 清理B站图片链接中的参数
                                        url = url.replace(/@.*$/, '');
                                        return renderImage(url);
                                    });
                                    mediaPatterns.forEach(pattern => {
                                        message = message.replace(pattern.regex, pattern.handler);
                                    });
                                    message = message.replace(/https?:\/\/[^\s<>"']+/g, url => {
                                        // 检查是否是已处理过的媒体链接
                                        if (url.match(/\.(jpg|jpeg|gif|png|webp|avif|mp4|webm|ogg|mp3|wav|m4a)(?:@[^@\s<>"']*)?$/i) || url.includes('bilibili.com/video') || url.includes('douyin.com/video') || url.includes('music.163.com/#/song')) {
                                            return url;
                                        }
                                        // 检查URL是否已经被转换为HTML标签
                                        if (/<(?:img|video|audio|iframe)[^>]*>/.test(url)) {
                                            return url;
                                        }
                                        return renderExternalLink(url);
                                    });
                                    if(message.includes("<img src=")){//图片列表实现
                                        PicList("push",message,IMGlist);
                                    }
                                    //点击头像跳转实现
                                    let UID=MgsList[y].pic.substring(MgsList[y].pic.lastIndexOf("/")+1,MgsList[y].pic.lastIndexOf("."))
                                    if (UID.includes('avatar')||UID===""){
                                        UID="https://boyshelpboys.com/chat.htm"
                                    }else{
                                        UID=`https://boyshelpboys.com/user-${UID}.htm`
                                    }
                                    //消息内容填充
                                    ul.insertAdjacentHTML("beforeend",`<li data-index="${MgsList[y].id}" id="M27-${MgsList[y].id}" class="M27-MsgBox">
                                        <div class="M27-MsgAvatar" style="box-shadow: 0 1px 5px ${(()=>{if (MgsList[y].name===UserId){return "red";}else{return "blue";}})()},0 -1px 5px ${(()=>{if (MgsList[y].name===UserId){return "red";}else{return "blue";}})()},1px 0 5px ${(()=>{if (MgsList[y].name===UserId){return "red";}else{return "blue";}})()},-1px 0 5px ${(()=>{if (MgsList[y].name===UserId){return "red";}else{return "blue";}})()};">
                                            <a href="${UID}" target="_blank"><img src='${MgsList[y].pic}' alt="${MgsList[y].name}" class="M27-MsgAvatarImg"></a>
                                        </div>
                                        <div class="M27-MsgContent">
                                            <div style="width: 100%;height: auto;"><small class="M27-userName" data-username="${MgsList[y].name}" id="M27-${MgsList[y].name}-${MgsList[y].id}">${MgsList[y].name}</small>&emsp;<small style="font-size: small">${new Date(MgsList[y].time*1000).toLocaleString()}</small></div>
                                            <div class="M27-ChatMssageText">
                                            <span style="word-break: break-all;">
                                            ${(()=>{if(typeof (MgsList[y].quote)!=='undefined'){return `
                                            <a href='#M27-${MgsList[y].quote.id}'>
                                            <div style="opacity: 0.8;background-color: rgba(66,66,66,0.2);min-height: 50px;border-radius: 5px;border-left: 1px solid gray;display: flex;margin-bottom: 10px;flex-wrap: wrap;">
                                            <div style="margin-left: 5px;color:darkgray;font-size: 12px;font-weight: bold;flex: 1 1 100%"><span>${MgsList[y].quote.name}</span></div><br>
                                            <div style="margin-left: 5px;color:lightgray;font-size: 16px;flex: 1 1 100%"><span>${MgsList[y].quote.msg}</span></div>
                                            </div>
                                            </a>
                                            `
                                            ;}else{return '';}})()}
                                            ${message}
                                            </span>
                                            </div>
                                        </div></li>`)
                                    //添加点击id@对方的效果
                                    PrintNumCunt+=1;
                                }
                                do {
                                    MsgId = MgsList[y].id
                                }while(typeof MsgId==="undefined")//设定最新消息的id
                                document.querySelector(".chat-history-body").scrollTop = document.querySelector(".chat-history-body").scrollHeight;//滚动至底部
                            }
                            let MsgLoadCheck=true
                            setInterval(()=>{
                                let NoteMsgGet;
                                let CheckScroll;
                                if (MsgLoadCheck){
                                    MsgLoadCheck=false;
                                    $.ajax({
                                        url:`https://boyshelpboys.com/plugin/msto_chat/route/app/ajax.php?c=msg&type=new&last_id=${MsgId}`,
                                        type:"GET",
                                        dataType:"json",
                                        async:true,
                                        timeout:5000,
                                        success:function(data){
                                            NoteMsgGet=CheckScroll=data.list.length
                                            MsgIdcheck=true
                                            let MsgImgURL;
                                            for (let x=0;x<data.list.length;x++){
                                                for (let y=MgsList.length-1;y>=0;y--){//去重
                                                    if (JSON.parse(data.list[x]).id===MgsList[y].id){
                                                        MsgIdcheck=false
                                                        break;
                                                    }
                                                }
                                                if (JSON.parse(data.list[x]).name===UserId){
                                                    NoteMsgGet--
                                                }
                                                if(JSON.parse(data.list[x]).name&&MsgIdcheck){
                                                    message=JSON.parse(data.list[x]).msg
                                                    message = message.replace(/\[img](.*?)\[\/img]/g, (match, url) => {
                                                        // 清理B站图片链接中的参数
                                                        url = url.replace(/@.*$/, '');
                                                        return renderImage(url);
                                                    });
                                                    mediaPatterns.forEach(pattern => {//处理媒体链接
                                                        message = message.replace(pattern.regex, pattern.handler);
                                                    });
                                                    message = message.replace(/https?:\/\/[^\s<>"']+/g, url => {
                                                        // 检查是否是已处理过的媒体链接
                                                        if (url.match(/\.(jpg|jpeg|gif|png|webp|avif|mp4|webm|ogg|mp3|wav|m4a)(?:@[^@\s<>"']*)?$/i) || url.includes('bilibili.com/video') || url.includes('douyin.com/video') || url.includes('music.163.com/#/song')) {
                                                            return url;
                                                        }
                                                        // 检查URL是否已经被转换为HTML标签
                                                        if (/<(?:img|video|audio|iframe)[^>]*>/.test(url)) {
                                                            return url;
                                                        }
                                                        return renderExternalLink(url);
                                                    });
                                                    if(message.includes("<img src=")){//图片列表实现
                                                        MsgImgURL=PicList("push",message,IMGlist)
                                                        console.log(MsgImgURL)
                                                    }
                                                    let UID=JSON.parse(data.list[x]).pic.substring(JSON.parse(data.list[x]).pic.lastIndexOf("/")+1,JSON.parse(data.list[x]).pic.lastIndexOf("."))
                                                    if (UID.includes('avatar')||UID===""){
                                                        UID="https://boyshelpboys.com/chat.htm"
                                                    }else{
                                                        UID=`https://boyshelpboys.com/user-${UID}.htm`
                                                    }
                                                    ul.insertAdjacentHTML("beforeend",`<li data-index="${JSON.parse(data.list[x]).id}" id="M27-${JSON.parse(data.list[x]).id}" class="M27-MsgBox">
                                                    <div class="M27-MsgAvatar" style="box-shadow: 0 1px 5px ${(()=>{if (JSON.parse(data.list[x]).name===UserId){return "red";}else{return "blue";}})()},0 -1px 5px ${(()=>{if (JSON.parse(data.list[x]).name===UserId){return "red";}else{return "blue";}})()},1px 0 5px ${(()=>{if (JSON.parse(data.list[x]).name===UserId){return "red";}else{return "blue";}})()},-1px 0 5px ${(()=>{if (JSON.parse(data.list[x]).name===UserId){return "red";}else{return "blue";}})()};">
                                                        <a href="${UID}" target="_blank"><img src='${JSON.parse(data.list[x]).pic}' alt="${JSON.parse(data.list[x]).name}" class="M27-MsgAvatarImg"></a>
                                                    </div>
                                                    <div class="M27-MsgContent">
                                                        <div style="width: 100%;height: auto;"><small class="M27-userName" data-username="${JSON.parse(data.list[x]).name}" id="M27-${JSON.parse(data.list[x]).name}-${JSON.parse(data.list[x]).id}">${JSON.parse(data.list[x]).name}</small>&emsp;<small style="font-size: small">${new Date(JSON.parse(data.list[x]).time*1000).toLocaleString()}</small></div>
                                                        <div class="M27-ChatMssageText">
                                                        <span style="word-break: break-all;">
                                                        ${(()=>{if(typeof (JSON.parse(data.list[x]).quote)!=='undefined'){return `
                                                            <a href='#M27-${JSON.parse(data.list[x]).quote.id}'>
                                                            <div style="opacity: 0.8;background-color: rgba(66,66,66,0.2);min-height: 50px;border-radius: 5px;border-left: 1px solid gray;display: flex;margin-bottom: 10px;flex-wrap: wrap;">
                                                            <div style="margin-left: 5px;color:darkgray;font-size: 12px;font-weight: bold;flex: 1 1 100%"><span>${JSON.parse(data.list[x]).quote.name}</span></div><br>
                                                            <div style="margin-left: 5px;color:lightgray;font-size: 16px;flex: 1 1 100%"><span>${JSON.parse(data.list[x]).quote.msg}</span></div>
                                                            </div>
                                                            </a>
                                                            `
                                                        ;}else{return '';}})()}
                                                        ${message}
                                                        </span></div>
                                                    </div></li>`)
                                                    PrintNumCunt+=1;
                                                    MgsList.push(data.list[x])
                                                    do {
                                                        MsgId=JSON.parse(data.list[x]).id
                                                    }while(typeof MsgId==="undefined")

                                                }else{do {
                                                    MsgId=JSON.parse(data.list[x]).id
                                                }while(typeof MsgId==="undefined")}
                                                if(CheckScroll>0){
                                                    document.querySelector(".chat-history-body").scrollTop =document.querySelector(".chat-history-body").clientHeight+ document.querySelector(".chat-history-body").scrollHeight;
                                                }
                                            }
                                            if (NoteSte&&NoteMsgGet===1&&!document.hasFocus()){
                                                let msgNoteJSON={"body":JSON.parse(data.list[0]).name+":"+JSON.parse(data.list[0]).msg,"icon":JSON.parse(data.list[0]).pic}
                                                if(MsgImgURL!==""&&MsgImgURL!==0&&MsgImgURL!==undefined){
                                                    msgNoteJSON.image=MsgImgURL
                                                }
                                                console.log(msgNoteJSON)
                                                let msgpushbox=new Notification("新消息来袭",msgNoteJSON);
                                                setTimeout(()=>{msgpushbox.close()},3000);
                                            }else if(NoteSte&&NoteMsgGet>1){
                                                let msgpushbox=new Notification("新消息来袭",{"body":`多个新消息等待接收`});
                                                setTimeout(()=>{msgpushbox.close()},3000);
                                            }
                                            MsgLoadCheck=true
                                        },
                                        error:function (){console.error("新消息列表获取失败，正在重新获取。");MsgLoadCheck=true;}
                                    })
                                }
                            },1000)
                    }
                }
                return true;
            }
        })
            let MsgPageCount=[]//消息列表序号计数
            $.ajax({
                url:'https://boyshelpboys.com/plugin/msto_chat/route/app/ajax.php?c=msg&type=histary',
                type:"GET",
                dataType:"json",
                async:false,
                success:function(data){
                    data.total>=10?MsgPageNum=Math.ceil(data.total/10):MsgPageNum=1;
                    for (let i=1;i<=Number(MsgPageNum);i++){
                        MsgPageCount.push(i)
                        console.log(MsgPageCount);
                    }
                    MsgNum=Math.ceil(data.total)
                    //LoadMsgList.length=MsgPageNum
                },
                error:function(){console.error('服务器数据获取失败')}
            })
            let testNum=0
            do{
                MsgPageCount.forEach((element,index)=>{
                    testNum++
                    $.ajax({
                        url:`https://boyshelpboys.com/plugin/msto_chat/route/app/ajax.php?c=msg&type=histary&page=${element}`,
                        type:"GET",
                        dataType:"json",
                        async:true,
                        success:function(data){
                            LoadMsgListProxy[element-1]=data.list.reverse();
                            MsgPageCount.splice(index,1);
                        },
                        error:function(){
                            console.error(`消息组${element}获取失败！`)
                        }
                    });
                })
            } while (MsgPageCount>0&&(MsgPageCount<=5?testNum<MsgPageCount:testNum<=5))
        }
    }else if(NowURL.includes('boyshelpboys.com/plugin')){
            return "";
    }else if(NowURL.includes('boyshelpboys.com/my')){
        bac.setAttribute("style",`background-color:${localStorage.BackGroundColor};`)
        backPrint(bac,addtarge,NowURL);
        leftANDtop();
        WidthHeightSet();
        ScrollHidden();
        NewAddSeet();
    }else if(NowURL ==="https://www.boyshelpboys.com/"||NowURL ==="https://boyshelpboys.com/"||NowURL.includes("boyshelpboys.com/#")||NowURL.includes("boyshelpboys.com/index")){
        backPrint(bac,addtarge,NowURL);
        bac.setAttribute("style",`background-color:${localStorage.BackGroundColor};`)
        ScrollHidden()
        leftANDtop();
        WidthHeightSet();


        let Tiezi6=document.querySelector("#body > div > div:nth-child(2) > div.col-lg-3.d-none.d-lg-block.aside > div.card")
        let Tiezi7=document.querySelector("#search_form > div > input")
        document.querySelector("head").insertAdjacentHTML("beforeend",`<style id="M27IndexStyle"></style>`)
        let AddStyle=`
        .threadlist .thread{
        border: 1px solid var(--border);
        padding: 15px;
        border-radius: 6px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        background-color:${localStorage.CantSeeColor1}${localStorage.CantSeeset1}!important;
        }
        .threadlist .thread:hover{
        background-color:${localStorage.CantSeeColor1}!important;
        }`
        document.querySelector("#M27IndexStyle").insertAdjacentHTML("afterbegin",AddStyle)//帖子部分外框颜色|透明度
        document.querySelector("#body > div > div:nth-child(2) > div.col-lg-9.main > div.card.card-threadlist > div.card-header").setAttribute("style",`background-color:${localStorage.CantSeeColor1}${localStorage.CantSeeset1}!important;`);//上面的字符部分
        Tiezi6.setAttribute('style', `background-color: ${localStorage.CantSeeColor5}${localStorage.CantSeeset5} !important;`)//搜索栏背景||边框
        Tiezi7.setAttribute('style', `background-color: ${localStorage.CantSeeColor7}${localStorage.CantSeeset7} !important;border:1px solid ${localStorage.CantSeeColor8}${localStorage.CantSeeset8} !important;height:2.5rem !important;`)//搜索栏输入框背景||描边

        NewAddSeet();

        let addlocalupdate=document.querySelector("#webimgsrc");
        addlocalupdate.addEventListener("change",handleFileSelect,false)//本体提交图片时向DBD保存base64
        if(document.querySelector("#body > div > div:nth-child(2) > div.col-lg-3.d-none.d-lg-block.aside > div.card-html-ad")!=null && typeof document.querySelector("#body > div > div:nth-child(2) > div.col-lg-3.d-none.d-lg-block.aside > div.card-html-ad")!=="undefined"){
            document.querySelector("#body > div > div:nth-child(2) > div.col-lg-3.d-none.d-lg-block.aside > div.card-html-ad").innerHTML=""//搜索栏下广告
        }
        if(document.querySelector("#body > div > div:nth-child(1)")!=null && typeof document.querySelector("#body > div > div:nth-child(1)")!=="undefined"){
            document.querySelector("#body > div > div:nth-child(1)").innerHTML=""//顶部广告
        }
    }else if(NowURL.includes("boyshelpboys.com/thread-")){
        let printCheckForDefuleBackPrint=true;//帖子背景图片检测
        console.log(document.querySelector("#body > div > div > div.col-lg-9.main > ol+div"))
        if(document.querySelector("#body > div > div > div.col-lg-9.main > ol+div")!==null){
            ImgShowBoxLoad("load")//图片显示模块加载
            document.querySelector("div.col-lg-9.main").addEventListener("click",(e)=>{
                let ImgLoadTest=new Image()//检测图片是否可加载辅助模块
                    if (e.target.src!=null && !e.target.className.includes("avatar")){
                    ImgLoadTest.src=e.target.src
                    ImgLoadTest.onload=()=>{
                        ImgShowBoxLoad("show",e.target.src)
                    }
                    ImgLoadTest.onerror=()=>{
                        console.log("链接无法加载")
                    }
                }//帖子界面图片放大观看功能
            });
            document.querySelector("#body > div > div > div.col-lg-9.main > ol+div").childNodes.forEach((item)=>{//背景校验
                if (typeof(item.style)!=="undefined"){
                    if (parseFloat (item.style.opacity)===parseFloat (item.style.opacity)&&parseFloat (item.style.opacity)>=0){
                        printCheckForDefuleBackPrint=false
                    }
                }
            })
        }
        let preList=document.querySelectorAll("pre");
        if (preList.length>0){
            preList.forEach(item=>{
                if (item.classList.contains('language-javascript')===true){
                    item.insertAdjacentHTML('beforebegin',`
                    <div id="M27jsAdd" style="vertical-align: center;text-align: center;width: 150px;height: 60px;background-color: rgba(0,0,0,0);border: 2px solid #66ccff;border-radius: 5px;">
                    <span style="text-align: center;line-height: 55px;font-size: 16px;user-select: none;">运行下列脚本</span>
                    </div>
                    `);
                }
            })
            document.querySelectorAll("#M27jsAdd").forEach(item=>{
                item.addEventListener("click",()=>{
                        let preloadJS=item.nextElementSibling.children[0].innerText;
                        bac.insertAdjacentHTML('afterbegin',`
                        <div id="loadCheckBG" style="width: 100%;height: ${webHeight}px;background-color: rgba(102,205,255,0.3);z-index: 10000000;position: fixed;display: flex;">
                        <div id="loadCheck" style="width: 250px;height: 150px;background-color:rgb(153,239,178);border: 1px solid #b7f1a0;border-radius: 5px;position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%); ">
                        <div style="color:black;margin: 2px;font-size: 12px">
                        <span>您正在尝试加载一串未知后果javascript代码 </span> <br>
                        <span>请确认代码是否<span style="color:red">安全可靠</span></span> <br>
                        <span>不安全的代码可能导致您的<span style="color:red;font-size: 14px;">个人信息泄漏未知的等严重后果</span>且<span style="color:red;font-size: 14px;">无法挽回</span></span><br>
                        <span>运行此代码导致的所有后果由您<span style="color:red;font-size: 14px;">个人承担</span></span>
                        </div>
                        <button style="background-color: red;border: 1px solid rgba(33,255,77,0.68);border-radius:5px;margin: 0 5px;" id="Yes">我已知晓，继续加载</button>
                        <button style="color: black;background-color: rgba(162,224,129,0.81);border: 1px solid rgba(33,255,77,0.68);border-radius:5px;margin: 0 5px;" id="No">取消加载</button>
                        </div>
                        </div>
                        `)
                    document.querySelector("#loadCheckBG").addEventListener("click",(e)=>{
                        e.target.remove()
                    })
                    document.querySelector("#loadCheck").addEventListener("click",(e)=>{
                        e.stopPropagation()
                        if (e.target.id==='Yes'){
                            let UserLoadFunc=new Function(preloadJS);
                            let reportVal=UserLoadFunc()
                            console.log(reportVal);
                            document.querySelector("#loadCheckBG").remove()
                        }else if(e.target.id==='No'){
                            document.querySelector("#loadCheckBG").remove()
                        }
                    })
                })
            })
        }
        if (!printCheckForDefuleBackPrint){
            bac.setAttribute("style",`background-color:${localStorage.BackGroundColor};background-image:url()`)
        }else{
            backPrint(bac,addtarge,NowURL);
            document.querySelector("#body > div > div > div.col-lg-9.main > ol+div").setAttribute("style",`background-color:${localStorage.CantSeeColor1}${localStorage.CantSeeset1}!important;`);
        }
        document.querySelector("#body > div > div > div.col-lg-9.main > ol").setAttribute("style",`background-color:${localStorage.CantSeeColor1}${localStorage.CantSeeset1}!important;`);
        document.querySelector("#body > div > div > div.col-lg-9.main > ol").setAttribute("style",`background-color:${localStorage.CantSeeColor1}${localStorage.CantSeeset1}!important;`);
        document.querySelector("#body > div > div > div.col-lg-9.main > ol+div> div.card-footer").setAttribute("style",`background-color:${localStorage.CantSeeColor1}${localStorage.CantSeeset1}!important;`);

        leftANDtop();
        WidthHeightSet();
        ScrollHidden();
        rePrint(webWidth,webHeight);
        NewAddSeet();
        let addlocalupdate=document.querySelector("#webimgsrc");
        addlocalupdate.addEventListener("change",handleFileSelect,false)//本体提交图片时向DBD保存base64
    }
    else{
        backPrint(bac,addtarge,NowURL);
        leftANDtop();
        WidthHeightSet();
        ScrollHidden();
        rePrint(webWidth,webHeight);

        NewAddSeet();
        let addlocalupdate=document.querySelector("#webimgsrc");
        addlocalupdate.addEventListener("change",handleFileSelect,false)//本体提交图片时向DBD保存base64
    }
})();
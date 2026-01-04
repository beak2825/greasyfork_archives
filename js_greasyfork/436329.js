// ==UserScript==
// @name     中移网大辅助工具
// @version  2.0
// @grant    none
// @include   *://wangda.chinamobile.com/*
// @description:zh-cn   中国移动网上大学刷课
// @description 中国移动网上大学刷课，防暂停，2.5倍数，解除右键限制
// @namespace https://greasyfork.org/users/685833
// @downloadURL https://update.greasyfork.org/scripts/436329/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/436329/%E4%B8%AD%E7%A7%BB%E7%BD%91%E5%A4%A7%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
var myStart=function(){
    //解除右键限制
    function avoiderr() {
        return true;
    }
    let old_onerror = onerror;
    onerror = avoiderr;

    function enableDefault(evt) {
        evt.stopPropagation();
    }

    function addEvt(obj, type) {
        obj.addEventListener(type, enableDefault, true);
    }

    function apply(events, node) {
        let length = events.length;
        for (let i = 0; i < length; i++) {
            addEvt(node, events[i]);
        }
    }

    function noMouseRestrict(events) {
        apply(events, window);
        apply(events, document);
    }

    noMouseRestrict(['contextmenu', 'selectstart', 'select', 'copy', 'beforecopy', 'cut', 'beforecut', 'paste', 'beforepaste', 'dragstart', 'dragend', 'drag', 'mousedown', 'mouseup', 'mousemove']);
    //解除右键限制结束

    var VideoPlay=function(){
        var myVideo=document.getElementsByTagName("video");
        if(myVideo.length > 0){
            myVideo[0].play();
        }
    }
    var VideoPlayX2=function(){
        var myVideo=document.getElementsByTagName("video");
        if(myVideo.length > 0){
            myVideo[0].play();
			var spd=myVideo[0].playbackRate
            if(spd==3){spd=1}else{spd+=0.5};
			myVideo[0].playbackRate=spd;
            alert("播放速度：x"+spd);
        }else{
            alert("未找到播放器");
        }
    }
    var sleep=function(time){
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    var CopyQuestion= async function(){
        alert("点击“确定”开始复制试题，期间请暂时不要操作本页面");
        var tempStr=document.getElementsByClassName("border right")[0].innerText;
        var QuestionNumber=parseInt(tempStr.substring(3,tempStr.indexOf("题")));
        var myStr="";
        for(var i=0;i<QuestionNumber+10;i++){
            await sleep(500);
            //alert(i);
            if (document.getElementById("D76next-0")){
                myStr+=document.getElementsByClassName("question-type-item")[0].innerText+"\n";
                document.getElementById("D76next-0").click();
                //console.log(i+":a");
                //alert("a" + myStr);
            }else if (document.getElementById("D76next-1")){
                myStr+=document.getElementsByClassName("question-type-item")[0].innerText+"\n";
                document.getElementById("D76next-1").click();
                //console.log(i+":b");
            } else if (document.getElementById("D76next-2")){
                myStr+=document.getElementsByClassName("question-type-item")[0].innerText+"\n";
                document.getElementById("D76next-2").click();
                //console.log(i+":c");
                //alert("a" + myStr);
            }else if (document.getElementById("D76next-3")){
                myStr+=document.getElementsByClassName("question-type-item")[0].innerText+"\n";
                document.getElementById("D76next-3").click();
                //console.log(i+":d");
                //alert("a" + myStr);
            } else if (document.getElementById("D76next-4")){
                myStr+=document.getElementsByClassName("question-type-item")[0].innerText+"\n";
                document.getElementById("D76next-4").click();
                //console.log(i+":e");
                //alert("a" + myStr);
            }else{
                myStr+=document.getElementsByClassName("question-type-item")[0].innerText+"\n";
                //alert(myStr);
                //console.log(i+":f");
                //document.getElementById("WangdaToolsBarDiv").innerText=myStr;

                break;
            }
            //alert("b" + myStr);
        }
        //alert(myStr);
        var newTextArea=document.createElement("DIV");
        newTextArea.style="white-space: pre-line;background-color:#FEFEFE;height:200px;width:500px;float:left;position:fixed;top:35px;left:5px;border-radius:5px;border: 1px solid black;opacity:0.9;overflow:auto;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2);z-index:9999;";
        newTextArea.id="WangdaToolsBar-TextArea";
        newTextArea.innerText=myStr;
        document.body.appendChild(newTextArea);
        var btn=document.createElement("DIV");
        btn.style="background-color:#FFD700;height:26px;width:300px;float:left;position:fixed;top:235px;left:5px;border-radius:3px;padding: 1px;border: 1px solid green;text-align: center;";
        btn.innerText="点击此按钮，将试题复制到剪切板";
        btn.onclick=function(){
            navigator.clipboard.writeText(myStr).then(function() {
                /* clipboard successfully set */
                alert("试题已复制到剪切板");
            }, function() {
                alert("剪贴板访问错误");
                /* clipboard write failed */
            });
            document.body.removeChild(document.getElementById("WangdaToolsBar-TextArea"));
            document.body.removeChild(this);
        }
        document.body.appendChild(btn);

    }

    var myDiv=document.createElement("DIV");//容器
    myDiv.style="background-color:#FFD700;height:30px;width:175px;float:left;position:fixed;top:5px;left:4px;border-radius:5px;opacity:0.8;box-shadow:0 4px 8px 0 rgba(0, 0, 0, 0.2);z-index:9999;";
    myDiv.id="WangdaToolsBarDiv";

    var btn0=document.createElement("DIV");
    btn0.style="background-color:#FFFFFF;height:26px;width:80px;float:left;position:relative;top:1px;left:5px;border-radius:3px;padding: 1px;border: 1px solid green;text-align: center;";
    //btn1.id="WangdaToolsBtn1"
    btn0.innerText="考试防切屏";
    btn0.onclick=function(){
        document.body.onblur=null;
        alert("已解除网大考试切屏限制");};
    //myDiv.appendChild(btn0);

    var btn1=document.createElement("DIV");
    btn1.style="background-color:#FFFFFF;height:26px;width:80px;float:left;position:relative;top:1px;left:5px;border-radius:3px;padding: 1px;border: 1px solid green;text-align: center;";
    //btn1.id="WangdaToolsBtn1"
    btn1.innerText="复制试题";
    btn1.onclick=function(){
        CopyQuestion();
        //alert("试题已复制到剪切板");
    };
    //myDiv.appendChild(btn1);

    var btn2=document.createElement("DIV");
    btn2.style="background-color:#FFFFFF;height:26px;width:80px;float:left;position:relative;top:1px;left:5px;border-radius:3px;padding: 1px;border: 1px solid green;text-align: center;";
    //btn1.id="WangdaToolsBtn1"
    btn2.innerText="刷课防暂停";
    //btn2.onclick=function(){window.setInterval(VideoPlay(),5000);alert("已解除视频自动暂停")};
    btn2.onclick=function(){setInterval(function(){ document.getElementsByTagName("video")[0].play(); }, 5000);alert("解除自动暂停")};
    myDiv.appendChild(btn2);

    var btn3=document.createElement("DIV");
    btn3.style="background-color:#FFFFFF;height:26px;width:80px;float:left;position:relative;top:1px;left:5px;border-radius:3px;padding: 1px;border: 1px solid green;text-align: center;";
    //btn1.id="WangdaToolsBtn1"
    btn3.innerText="视频加速";
    btn3.onclick=function(){VideoPlayX2();};
    myDiv.appendChild(btn3);
    document.body.appendChild(myDiv);
}
myStart();







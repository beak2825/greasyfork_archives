// ==UserScript==
// @name         讯飞AI考试助手
// @version      0.31
// @description  none
// @author       xxx
// @match        https://assess.fifedu.com/*
// @grant        none
// @namespace https://greasyfork.org/users/582426
// @downloadURL https://update.greasyfork.org/scripts/404916/%E8%AE%AF%E9%A3%9EAI%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404916/%E8%AE%AF%E9%A3%9EAI%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


    var hookface = 0;//是否开启拍照拦截

    window.onblur = ()=>{};
    window.getAbnormal = ()=>{};

    let pass = $("<div class=\"btn_start ok\" id=\"btn_fuck\">直接进入（正式考试时请至少认证一次！)</div>")
    if ($("#btn_start")[0]&&GetQueryString("exmaBatchResulId")){
        pass.insertAfter($("#btn_start")[0])
        pass.on("click",()=>{location.href = "https://assess.fifedu.com/testcenter/examPaper/toExamMain?studentResultId="+GetQueryString("exmaBatchResulId")})
    }
    if($(".exam_left-info")[0]){
        add.insertAfter($(".exam_left-info")[0])
    }
    if(top.time1&&hookface==1&&$(".exam_left-time-tip")[0]){//hook人脸拍照
        window.takePhotoComplete = (fuck)=>{}
        window.takePhoto = ()=>{if(confirm("点击确认5s后开始例行拍照，点击取消跳过本次拍照（不推荐）")==true){setTimeout("swfObj.takePhoto();alert(\"拍照完成，请继续做题\")",5000)};top.time1 = setTimeout("takePhoto()",600000);}
        setTimeout('alert("讯飞的人像采集规则：\\n刷新页面后80s第一次（后续10分钟一次）\\n因此不建议频繁刷新页面，会导致后台照片变多（如果刷新了，请记得跳过80s的那次拍照）\\n在弹窗提示准备拍照时，请端正坐姿目视屏幕，双手及作弊工具不要出现在摄像头视线中，待拍照完成弹出时再恢复\\n切记：左侧视频采集框无人像或不正常时不要拍照，请刷新后再次尝试")',5000);
        clearTimeout(top.time1)
        top.time1 = setTimeout("takePhoto()",80000)
    }
    function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = r[2];
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
    window.add_switch = (times)=>{
        let param = {};
        param.switchPageNum = switchPageNum;
        param.examPaperId = examPaperId;
        param.resultId = studentExamResultId;
        param.batchId = batchId;
        param.studentId = studentId;
        window.switchPageNum = times;
        param.switchPageNum = times;
        $.ajax({
            type : "POST",
            url : "https://assess.fifedu.com/testcenter/examPaper/updateSwitchPageNum",
            data : param,
            success: function(msg){
                console.log("switchPageNum: "+switchPageNum)
            }
        });
    }
    if(switchPageNum<5){
        add_switch(10);
    }


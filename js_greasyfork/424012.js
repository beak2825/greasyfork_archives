// ==UserScript==
// @name         英语四级爷来了
// @namespace    keyroesTools
// @version      0.3
// @description  个人使用
// @author       keyroes
// @compatible   Chrome
// @match        *://cet-bm.neea.cn/Student*
// @match        *://cet-bm.neea.edu.cn/Student*
// @exclude      *://cet-bm.neea.cn/Index*
// @exclude      *://cet-bm.neea.edu.cn/Index*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424012/%E8%8B%B1%E8%AF%AD%E5%9B%9B%E7%BA%A7%E7%88%B7%E6%9D%A5%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/424012/%E8%8B%B1%E8%AF%AD%E5%9B%9B%E7%BA%A7%E7%88%B7%E6%9D%A5%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //参数配置
    var div_Type = true;//是否默认展开窗口





//勿动，请勿二次开发
    var mainUrl = "http://cet-bm.neea.edu.cn/";
    var nowUrl = window.location.pathname;
    var url1 = 'Details';
    var url2 = 'DetailsRW';
    var div1 = '<div style="position: fixed; top:2px; right:20px; z-index: 9999999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv">\n    <input type="button" value="隐藏" id="allBtn">\n</div>\n<div style="border: 2px dashed rgb(0, 85, 68); width: 330px;height: 90%; position: fixed; top: 0; right: 0; z-index: 9999998; background-color: rgba(70, 196, 38, 0.8); overflow-x: auto;" id="keyroes">\n    <div style="height: 100px;margin:0 10px;display: flex;flex-direction: column;">\n        <span style="font-size: 17px;margin-bottom: 5px">功能区</span>\n        <div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >\n            <input type="button" style="margin-right: 10px;margin-top: 10px" value="去报名" onclick="editWrittenSubjectRegister()">\n        </div>\n    </div>\n    <div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>\n    <div style="margin:0 10px;display: flex;flex-direction: column;">\n        <span style="font-size: 17px;margin-bottom: 5px">说明</span>\n        <div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >\n            <span style="font-size: 14px">1.玩玩就好<br>2.禁止二次开发<br>3.本脚本禁止发给任何人，一切责任由转发者负责<br>4.本脚本仅供娱乐使用，请勿用于其他用途，一切责任由使用者负责</span>\n        </div>\n    </div>\n</div>';
    var div2 = '<div style="position: fixed; top:2px; right:20px; z-index: 9999999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv"><input type="button" value="隐藏" id="allBtn"></div><div style="border: 2px dashed rgb(0, 85, 68); width: 330px;height: 90%; position: fixed; top: 0; right: 0; z-index: 9999998; background-color: rgba(70, 196, 38, 0.8); overflow-x: auto;" id="keyroes"><span style="font-size: medium;"></span> <div style="font-size: medium;width:70%;display: inline-block;"><input type="button" id="refreshKey" style="margin-right: 10px;" value="刷新"><input type="button" id="selectAll" style="margin-right: 10px;" value="全选"></div><div style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="height: 200px;margin:0 10px;display: flex;flex-direction: column;"><span style="font-size: 17px;margin-bottom: 5px">可选课程</span><div id="divCheckbox" style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ></div></div><div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="margin:0 10px;display: flex;flex-direction: column;"><span style="font-size: 17px;margin-bottom: 5px">配置</span><div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ><span>循环次数*：<input id="repeatNum" type="text" placeholder="1-50000" value="10000"></span><span>延迟(ms)*：<input id="rdelay" type="text" placeholder="0-2000" value="0"></span></div></div><div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="margin:0 10px;display: flex;flex-direction: column;"><span style="font-size: 17px;margin-bottom: 5px">开始</span><div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ><input id="getClassTool" type="button" style="margin-right: 10px;margin-top: 5px" value="开始"></div></div><div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="height: 350px; margin:0 10px;display: flex;flex-direction: column;"><div style="display:flex;flex-direction: row"><span style="font-size: 17px;margin-bottom: 5px;margin-right: 10px">日志</span><div style="display: flex;justify-content : flex-end;margin-right: 5px"><span style="margin-left: 5px">已选：<span id="checkNum">0</span></span><span style="margin-left: 5px">未选：<span id="noCheckNum">0</span></span><span style="margin-left: 5px">次数：<span id="ordNums">0</span></span></div><input type="button" style="margin:0;" value="清空" onclick="$(\'#postLog\').empty()"></div><div id="postLog" style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ></div></div></div>';
    if (nowUrl.indexOf(url2) != -1) {
        $(div2).appendTo('body');
        getCalssData()
    } else if (nowUrl.indexOf(url1) != -1) {
        $(div1).appendTo('body')
    } else {
        return
    }

    function getCalssData() {
        var htmlCalssData = '';
        $("[name='ckbSubject']").each(function() {
            htmlCalssData += '<span><span><input type="checkbox" name="category" value="' + $(this).attr('id') + '" checked/>' + $(this).attr('id') + '</span></span>'
        });
        $("#divCheckbox").append(htmlCalssData)
    }
    var userRepeatNum = 0;
    var userRdelay = 0;
    var classData = [];
    var postType = true;
    var checkNum = 0;
    var noCheckNum = 0;
    var ordNums = 0;
    var nowUserRepeatNum = 1;
    var nowDataNum = 0;

    function getClassTool() {
        userRepeatNum = $('#repeatNum').val();
        userRdelay = $('#rdelay').val();
        classData = [];
        if (!($.isNumeric(userRepeatNum) && $.isNumeric(userRdelay))) {
            $.messager.alert("循环次数和延迟时间必须是数字");
            $("#getClassTool").val("开始");
            $('#repeatNum').val(1000);
            $('#rdelay').val(0);
            return
        } else if (!(userRepeatNum > 0 && userRepeatNum <= 50000 && userRdelay >= 0 && userRdelay <= 2000)) {
            $.messager.alert("循环次数或延迟时间不在可选范围内");
            $("#getClassTool").val("开始");
            $('#repeatNum').val(10000);
            $('#rdelay').val(0);
            return
        }
        var oneClassData = [];
        $("input[name='category']:checked").each(function() {
            classData.push($(this).val())
        });
        if (classData.length <= 0) {
            $.messager.alert("请选择抢课课程");
            $("#getClassTool").val("开始");
            return
        }
        $('#checkNum').text(0);
        $('#noCheckNum').text(classData.length);
        $('#ordNums').text(0);
        checkNum = 0;
        noCheckNum = classData.length;
        ordNums = 0;
        postType = true;
        nowUserRepeatNum = 1;
        nowDataNum = 0;
        getOneClass()
    }

    function getOneClass() {
        if (nowUserRepeatNum > userRepeatNum || !postType || classData.length <= 0) {
            playSound();
            $("#postLog").prepend('<span>报名结束</spam>');
            $("#getClassTool").val("开始");
            nowUserRepeatNum = 1;
            nowDataNum = 0;
            return
        }
        var postJsonOneClassData = "";
        window.setTimeout(function() {
            postJsonOneClassData = classData[nowDataNum];
            var sidStr = $('#hiddenSID').val();
            $.ajax({
                type: "post",
                url: '../Student/SaveRW',
                data: {
                    sid: sidStr,
                    c_sStr: postJsonOneClassData,
                    __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()
                },
                success: function(data) {
                    switch (data.ExceuteResultType) {
                        case -1:
                            if (data.Message.indexOf("容量已满或其他原因") != -1) {
                                $("#postLog").prepend('<span>报名失败：容量已满或其他原因&nbsp;&nbsp;' + postJsonOneClassData + '</spam>')
                            } else {
                                $("#postLog").prepend('<span>' + data.Message + '&nbsp;&nbsp;' + postJsonOneClassData + '</spam>')
                            }
                            nowDataNum = (nowDataNum + 1) % classData.length;
                            break;
                        case 0:
                            toastr.error('保存失败，执行无结果！', '错误');
                            $("#postLog").prepend('<span>1报名失败，执行无结果！&nbsp;&nbsp;' + postJsonOneClassData + '</spam>');
                            nowDataNum = (nowDataNum + 1) % classData.length;
                            break;
                        case 1:
                            playSound();
                            $("#postLog").prepend('<span>报名成功&nbsp;&nbsp;' + postJsonOneClassData + '</spam>');
                            classData.splice(nowDataNum, 1);
                            nowDataNum = nowDataNum % classData.length;
                            $('#checkNum').text(++checkNum);
                            $('#noCheckNum').text(--noCheckNum);
                            $("#postLog").prepend('<span>报名中止-去支付</spam>');
                            $("#getClassTool").val("开始");
                            postType = false;
                            setTimeout(function() {
                                $("#zcForm").attr('action', '../Student/Details?r=' + Math.random());
                                $("#zcForm").submit()
                            }, 1000);
                            break;
                            return
                    };
                    nowUserRepeatNum = nowDataNum == 0 ? nowUserRepeatNum + 1 : nowUserRepeatNum;
                    $('#ordNums').text(++ordNums);
                    getOneClass()
                },
                error: function(XMLHttpRequest) {
                    playSound();
                    $.messager.alert("出错了:nowUserRepeatNum:" + nowUserRepeatNum + ",nowDataNum:" + nowDataNum + ",info:" + data.responseJSON.Message);return
                }
            })
        }, userRdelay)
    }

    function stopGetClass() {
        $("#postLog").prepend('<span>报名终止</spam>');
        $("#getClassTool").val("开始");
        postType = false
    }
    $("#refreshKey").on("click", function() {
        getCalssData()
    });
    $("#getClassTool").on("click", function() {
        console.log(getCS());
        if ("开始" == $("#getClassTool").val().toString()) {
            $("#getClassTool").val("终止");
            getClassTool()
        } else {
            $("#getClassTool").val("开始");
            stopGetClass()
        }
    });
    $("#selectAll").on("click", function() {
        if ("全选" == $("#selectAll").val().toString()) {
            $("#selectAll").val("全不选");
            $(":checkbox[name='category']").prop("checked", true)
        } else {
            $("#selectAll").val("全选");
            $(":checkbox[name='category']").prop("checked", false)
        }
    });
    $("#allBtn").on("click", function() {
        if ("隐藏" == $("#allBtn").val().toString()) {
            $("#allBtn").val("显示");
            $("#allBtn").css("background-color", "rgba(70, 196, 38, 0.8)");
            $("#keyroes").css("display", "none")
        } else {
            $("#allBtn").val("隐藏");
            $("#allBtn").css("background-color", "snow");
            $("#keyroes").css("display", "block");
            getCalssData()
        }
    });
    if (!div_Type) {
        $("#allBtn").val("显示");
        $("#allBtn").css("background-color", "rgba(70, 196, 38, 0.8)");
        $("#keyroes").css("display", "none")
    }

    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true
            } catch (e) {
                console.log(e);
                return false
            }
        }
        console.log('It is not a string!')
    }

    function playSound() {
        var borswer = window.navigator.userAgent.toLowerCase();
        if (borswer.indexOf("ie") >= 0) {
            var strEmbed = '<embed name="embedPlay" src="https://yzalliance.top/wyuGrabCourse/music.wav" autostart="true" hidden="true" loop="false"></embed>';
            if ($("body").find("embed").length <= 0) $("body").append(strEmbed);
            var embed = document.embedPlay;
            embed.volume = 100
        } else {
            var strAudio = "<audio id='audioPlay' src='https://yzalliance.top/wyuGrabCourse/music.wav' hidden='true'>";
            if ($("body").find("audio").length <= 0) $("body").append(strAudio);
            var audio = document.getElementById("audioPlay");
            audio.play()
        }
    }
})();
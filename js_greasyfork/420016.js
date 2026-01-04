// ==UserScript==
// @name         求求你别抢了
// @namespace    keyroesTools
// @version      0.4
// @description  个人使用
// @author       keyroes
// @compatible   Chrome
// @match        *://jxgl.wyu.edu.cn/*
// @exclude     *://jxgl.wyu.edu.cn/
// @exclude     *://jxgl.wyu.edu.cn/new/logout
// @exclude     *://jxgl.wyu.edu.cn/waf_verify.htm*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/420016/%E6%B1%82%E6%B1%82%E4%BD%A0%E5%88%AB%E6%8A%A2%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/420016/%E6%B1%82%E6%B1%82%E4%BD%A0%E5%88%AB%E6%8A%A2%E4%BA%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var rootType = false;
    var class_Type = false;
    var div_Type = true;
    var testJson = {
        "total": 5,
        "rows": [{
            "kcrwdm": "1085547",
            "kcdm": "101",
            "jxbdm": "111",
            "kcmc": "日常生活与社会心理学",
            "xf": "学分",
            "teaxm": "教师1",
            "kcflmc": "课程分类"
        }, {
            "kcrwdm": "1085644",
            "kcdm": "102",
            "jxbdm": "112",
            "kcmc": "影视艺术概论",
            "xf": "学分",
            "teaxm": "教师2",
            "kcflmc": "课程分类"
        }, {
            "kcrwdm": "1085562",
            "kcdm": "103",
            "jxbdm": "113",
            "kcmc": "中华文明简史",
            "xf": "学分",
            "teaxm": "教师3",
            "kcflmc": "课程分类"
        }, {
            "kcrwdm": "1085561",
            "kcdm": "104",
            "jxbdm": "114",
            "kcmc": "中国古代历史8讲",
            "xf": "学分",
            "teaxm": "教师4",
            "kcflmc": "课程分类"
        }, {
            "kcrwdm": "1085557",
            "kcdm": "105",
            "jxbdm": "115",
            "kcmc": "西方文明的源与流",
            "xf": "学分",
            "teaxm": "教师5",
            "kcflmc": "课程分类"
        }]
    };
    var mainUrl = "https://yzalliance.top/wyuGrabCourse/";
    var webappToken;
    var nowUrl = window.location.pathname;
    var url1 = 'xsxklist!xsmhxsxk.action';
    var url2 = 'xskktzd!xskktzdFind.action';
    var div1 = '<div style="position: fixed; top:2px; right:20px; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv">\n    <input type="button" value="隐藏" id="allBtn">\n</div>\n<div style="border: 2px dashed rgb(0, 85, 68); width: 330px;height: 90%; position: fixed; top: 0; right: 0; z-index: 99998; background-color: rgba(70, 196, 38, 0.8); overflow-x: auto;" id="keyroes">\n    <div style="height: 100px;margin:0 10px;display: flex;flex-direction: column;">\n        <span style="font-size: 17px;margin-bottom: 5px">功能区</span>\n        <div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >\n            <input type="button" style="margin-right: 10px;" value="个人选课" onclick="window.open(\'https://jxgl.wyu.edu.cn/xsxklist!xsmhxsxk.action\');">\n            <input type="button" style="margin-right: 10px;margin-top: 10px" value="专业限选选课" onclick="window.open(\'https://jxgl.wyu.edu.cn/xskktzd!xskktzdFind.action\');">\n        </div>\n    </div>\n    <div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div>\n    <div style="margin:0 10px;display: flex;flex-direction: column;">\n        <span style="font-size: 17px;margin-bottom: 5px">说明</span>\n        <div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" >\n            <span style="font-size: 14px">1.个人选课：通识课，第二外语，英语选修，公共选修（创新）<br>2.专业限选选课：专业选修课<br>3.自动抢课300次左右会要求输入验证码<br>4.本脚本禁止私自发给任何人，一切责任由转发者负责<br>5.本脚本仅供测试使用，请勿用于其他用途，一切责任由使用者负责</span>\n        </div>\n    </div>\n</div>';
    var div2 = '<div style="position: fixed; top:2px; right:20px; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;" id="allDiv"><input type="button" value="隐藏" id="allBtn"></div><div style="border: 2px dashed rgb(0, 85, 68); width: 330px;height: 90%; position: fixed; top: 0; right: 0; z-index: 99998; background-color: rgba(70, 196, 38, 0.8); overflow-x: auto;" id="keyroes"><span style="font-size: medium;"></span> <div style="font-size: medium;width:70%;display: inline-block;"><input type="button" id="refreshKey" style="margin-right: 10px;" value="刷新"><input type="button" id="selectAll" style="margin-right: 10px;" value="全选"></div><div style="border-top: 1px solid #000;border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="height: 200px;margin:0 10px;display: flex;flex-direction: column;"><span style="font-size: 17px;margin-bottom: 5px">可选课程</span><div id="divCheckbox" style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ></div></div><div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="margin:0 10px;display: flex;flex-direction: column;"><span style="font-size: 17px;margin-bottom: 5px">配置</span><div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ><span>循环次数*：<input id="repeatNum" type="text" placeholder="1-5000" value="1000"></span><span>延迟(ms)*：<input id="rdelay" type="text" placeholder="0-2000" value="20"></span><span>高级配置：<input id="senior" type="text" placeholder="json" value=\'\' style="display: none"></span><span><input type="radio" name="radio1" value="radio1">自动去除时间冲突课程</span></div></div><div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="margin:0 10px;display: flex;flex-direction: column;"><span style="font-size: 17px;margin-bottom: 5px">开始</span><div style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ><input id="getClassTool" type="button" style="margin-right: 10px;margin-top: 5px" value="开始"></div></div><div style="border-bottom: 1px solid #000;margin: 4px 0px;overflow: hidden;"></div><div style="height: 350px; margin:0 10px;display: flex;flex-direction: column;"><div style="display:flex;flex-direction: row"><span style="font-size: 17px;margin-bottom: 5px;margin-right: 10px">日志</span><div style="display: flex;justify-content : flex-end;margin-right: 5px"><span style="margin-left: 5px">已选：<span id="checkNum">0</span></span><span style="margin-left: 5px">未选：<span id="noCheckNum">0</span></span><span style="margin-left: 5px">次数：<span id="ordNums">0</span></span></div><input type="button" style="margin:0;" value="清空" onclick="$(\'#postLog\').empty()"></div><div id="postLog" style="overflow-x:auto;height: 100%;padding-bottom: 5px;display: flex;flex-direction: column" ></div></div></div>';
    var div3 = '';

    function conflictAndCalendar(kcrwdm, kcmc) {
        var conflictKcmc = hasConflict(kcrwdm);
        if (conflictKcmc != '') {
            layer.alert(kcmc + kcrwdm + "与" + conflictKcmc + "上课时间冲突")
        } else {
            layer.alert("没有与" + kcmc + kcrwdm + "上课时间冲突的课程")
        }
        viewJxrl(kcrwdm)
    }
    if (nowUrl.indexOf(url1) != -1) {
        getToken();
        $(div2).appendTo('body');
        getCalssData()
    } else if (nowUrl.indexOf(url2) != -1) {
        $(div3).appendTo('body')
    } else {
        $(div1).appendTo('body')
    }

    function getCalssData() {
        var classJson = {};
        var classRows = [];
        var classTotal = 0;
        var values;
        $.ajax({
            type: "GET",
            url: "/xsxklist!getDataList.action",
            data: {
                "page": 1,
                "rows": 500,
                "sort": "kcrwdm",
                "order": "asc"
            },
            async: false,
            beforeSend: function() {},
            success: function(data) {
                values = data.valueOf().toString();
                if (values.indexOf("<html>") != -1) {
                    $("#divCheckbox").append(values);
                    return
                }
            },
            complete: function(data) {},
            error: function(XMLHttpRequest) {
                layer.alert("出错了")
            }
        });
        if (values != null) {
            if (localStorage.getItem("wyuGrabCourse_token") == null) {
                getToken();
                layer.alert(1113);
                return
            }
            var nowToken = localStorage.getItem("wyuGrabCourse_token");
            $.ajax({
                type: "POST",
                url: mainUrl + "getCurriculumData",
                data: {
                    "data": values,
                    "token": nowToken
                },
                async: false,
                dataType: "json",
                beforeSend: function() {},
                success: function(datas) {
                    if (datas.code == -4) {
                        getToken();
                        layer.alert(1112);
                        return
                    } else if (datas.code != 0) {
                        layer.alert(datas.msg);
                        return
                    }
                    var data = datas.data;
                    if (rootType) {
                        classJson = testJson;
                        classRows = testJson.rows;
                        classTotal = testJson.total
                    } else {
                        classJson = data;
                        classRows = data.rows;
                        classTotal = data.total
                    }
                    var htmlCalssData = '';
                    $("#divCheckbox").empty();
                    if (classJson.total == 0) {
                        htmlCalssData += '<span style="margin: 0 auto">暂无可选课程</span>'
                    } else {
                        for (var i = 0; i < classRows.length; i++) {
                            htmlCalssData += '<span><span><input id="classId' + i + '" type="checkbox" name="category" value="' + classRows[i].kcrwdm + ',' + classRows[i].kcmc + '" />' + classRows[i].kcmc + '&nbsp;' + classRows[i].kcrwdm + '</span><a href="javascript:;" title="' + classRows[i].kcmc + '" onclick="layer.alert(hasConflict(' + classRows[i].kcrwdm + '));viewJxrl(' + classRows[i].kcrwdm + ')">&nbsp;&nbsp;&nbsp;&nbsp;' + classRows[i].teaxm + '</a></span>'
                        }
                    }
                    $("#divCheckbox").append(htmlCalssData)
                },
                complete: function(data) {},
                error: function(XMLHttpRequest) {
                    layer.alert("出错了")
                }
            })
        }
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
            layer.alert("循环次数和延迟时间必须是数字");
            $("#getClassTool").val("开始");
            $('#repeatNum').val(500);
            $('#rdelay').val(0);
            return
        } else if (!(userRepeatNum > 0 && userRepeatNum <= 5000 && userRdelay >= 0 && userRdelay <= 2000)) {
            layer.alert("循环次数或延迟时间不在可选范围内");
            $("#getClassTool").val("开始");
            $('#repeatNum').val(1000);
            $('#rdelay').val(20);
            return
        }
        var oneClassData = [];
        $("input[name='category']:checked").each(function() {
            var jsonOneClassData = {};
            oneClassData = $(this).val().split(",");
            jsonOneClassData.kcrwdm = oneClassData[0];
            jsonOneClassData.kcmc = oneClassData[1];
            classData.push(jsonOneClassData)
        });
        if (classData.length <= 0) {
            layer.alert("请选择抢课课程");
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
        if ($('input:radio[name="radio1"]:checked').val() != null) {
            conflicts()
        }
        if (!(webappCheck())) {
            layer.alert("出错了，请刷新/重新登录");
            return
        }
        getOneClass()
    }

    function conflicts() {
        for (var j = 0; j < classData.length; j++) {
            var conflictKcmc = hasConflict(classData[j].kcrwdm);
            if (conflictKcmc != '') {
                $("#postLog").prepend('<span>' + classData[j].kcrwdm + classData[j].kcmc + '与' + conflictKcmc + '上课时间冲突</spam>');
                classData.splice(j, 1);
                $('#checkNum').text(++checkNum);
                $('#noCheckNum').text(--noCheckNum)
            }
        }
    }

    function getOneClass() {
        if (nowUserRepeatNum > userRepeatNum || !postType || classData.length <= 0) {
            $("#postLog").prepend('<span>抢课结束</spam>');
            $("#getClassTool").val("开始");
            nowUserRepeatNum = 1;
            nowDataNum = 0;
            return
        }
        var postJsonOneClassData = {};
        window.setTimeout(function() {
            postJsonOneClassData = classData[nowDataNum];
            $.ajax({
                type: "GET",
                url: "/xsxklist!getAdd.action",
                data: {
                    "kcrwdm": postJsonOneClassData.kcrwdm,
                    "kcmc": postJsonOneClassData.kcmc
                },
                async: false,
                beforeSend: function() {},
                success: function(data) {
                    if (data.valueOf().toString().indexOf("<html>") != -1) {
                        playSound();
                        $("#postLog").prepend('<span>请求被拦截，请完成人机检测</spam>');
                        $("#getClassTool").val("开始");
                        window.open("https://jxgl.wyu.edu.cn/waf_verify.htm");
                        postType = false;
                        return
                    } else if (rootType ? (!class_Type && nowUserRepeatNum == 5 && nowDataNum == 0) : ("1" == data.valueOf().toString())) {
                        playSound();
                        $("#postLog").prepend('<span>抢课成功&nbsp;&nbsp;' + postJsonOneClassData.kcrwdm + postJsonOneClassData.kcmc + '</spam>');
                        classData.splice(nowDataNum, 1);
                        nowDataNum = nowDataNum % classData.length;
                        $('#checkNum').text(++checkNum);
                        $('#noCheckNum').text(--noCheckNum)
                    } else if ("您已经选了该门课程" == data.valueOf().toString()) {
                        $("#postLog").prepend('<span>重复抢课&nbsp;&nbsp;' + postJsonOneClassData.kcrwdm + postJsonOneClassData.kcmc + '</spam>');
                        classData.splice(nowDataNum, 1);
                        nowDataNum = nowDataNum % classData.length;
                        $('#checkNum').text(++checkNum);
                        $('#noCheckNum').text(--noCheckNum)
                    } else {
                        $("#postLog").prepend('<span>' + data.valueOf().toString() + '&nbsp;&nbsp;' + postJsonOneClassData.kcrwdm + postJsonOneClassData.kcmc + '</spam>');
                        nowDataNum = (nowDataNum + 1) % classData.length
                    }
                    nowUserRepeatNum = nowDataNum == 0 ? nowUserRepeatNum + 1 : nowUserRepeatNum;
                    $('#ordNums').text(++ordNums);
                    getOneClass()
                },
                complete: function(data) {},
                error: function(XMLHttpRequest) {
                    layer.alert("出错了");
                    console.log("nowUserRepeatNum:" + nowUserRepeatNum + ",nowDataNum:" + nowDataNum);
                    return
                }
            })
        }, userRdelay)
    }

    function stopGetClass() {
        $("#postLog").prepend('<span>抢课终止</spam>');
        $("#getClassTool").val("开始");
        postType = false
    }
    $("#refreshKey").on("click", function() {
        getCalssData()
    });
    $("#getClassTool").on("click", function() {
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

    function getToken() {
        var values;
        $.ajax({
            type: "GET",
            url: "/xjkpxx!xjkpxx.action",
            data: {},
            async: false,
            beforeSend: function() {},
            success: function(data) {
                if (data.toString().indexOf("<label style=\"width: 90px\">") != -1) {
                    values = data.toString()
                } else {
                    layer.alert("获取数据失败，请重新登录/刷新");
                    return
                }
            },
            complete: function(data) {},
            error: function(XMLHttpRequest) {
                layer.alert("出错了")
            }
        });
        if (values != null) {
            var ordSchoolId = localStorage.getItem("wyuGrabCourse_ordSchoolid");
            $.ajax({
                type: "POST",
                url: mainUrl + "getToken",
                data: {
                    "data": values,
                    "ordSchoolId": ordSchoolId
                },
                async: false,
                dataType: "json",
                beforeSend: function() {},
                success: function(data) {
                    if (data.code != 0) {
                        layer.alert(data.msg);
                        return
                    }
                    webappToken = data.data;
                    localStorage.setItem("wyuGrabCourse_token", webappToken)
                },
                complete: function(data) {},
                error: function(XMLHttpRequest) {
                    layer.alert("出错了")
                }
            })
        }
    }

    function webappCheck() {
        if (localStorage.getItem("wyuGrabCourse_token") == null) {
            return false
        }
        var nowToken = localStorage.getItem("wyuGrabCourse_token");
        var type;
        $.ajax({
            type: "GET",
            url: mainUrl + "check",
            data: {
                "token": nowToken
            },
            async: false,
            dataType: "json",
            beforeSend: function() {},
            success: function(data) {
                if (data.code != 0) {
                    type = false
                } else {
                    type = true
                }
            },
            complete: function(data) {},
            error: function(XMLHttpRequest) {
                type = false
            }
        });
        return type
    }
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
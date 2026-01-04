// ==UserScript==
// @name         FUCKSCU
// @namespace    http://tampermonkey.net/
// @version      2025-07-01
// @description  try to FUCK the teaching evaluation!
// @match        http://zhjw.scu.edu.cn/student/teachingEvaluation/newEvaluation/evaluation/*
// @match        http://zhjw.scu.edu.cn/student/teachingEvaluation/newEvaluation/index
// @author       ChatGPT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541378/FUCKSCU.user.js
// @updateURL https://update.greasyfork.org/scripts/541378/FUCKSCU.meta.js
// ==/UserScript==

//川大评教要强迫学生等100秒。十门课就是一刻钟。因此有了这个自动评教脚本。
//使用方法：打开http://zhjw.scu.edu.cn/student/teachingEvaluation/newEvaluation/index这个评教页面就会自动运行
//因为不能多开评教窗口，这个脚本不能克服的一点是教务系统过十几分钟就会自动掉登录（这是最的一点），所以说不定评到一半登录就掉了。随便吧。

(function() {
    'use strict';

    var currentUrl = window.location.href;

    if (currentUrl.includes("index")) {
        console.log("FUCK");

        //下面这个注入函数作废。它的作用是同时开多个评教窗口，但经过测试川大显然禁止了这么做，一次只能提交一个评教，提交第二个要再等100秒。
        /*
        window.evaluation3 = function(id, jkkg, jkts, jkrq, obj) {
            var jksj = dealDate(jkrq);
            if(checkIsCanbeForJspj()){
                //                window.location.href="/student/teachingEvaluation/newEvaluation/evaluation/"+id;

                if(!checkIsTeachEvaluationed(id)){//检查是否已经评估过
                    if(jkkg == "1"){
                        if(jkts != "0" && jkts != null && jkts != ""){//为空的话，就认为没有截至时间限制
                            var curDate = new Date(getNowFormatDate());
                            if(!checkIsCanbePj(jksj,new Date(jksj),jkts,curDate)){
                                urp.alert("当前时间不在结课时间和系统设置天数范围内进行，不能进行评估！");
                                return;
                            }
                        }
                    }

                    // window.location.href="/student/teachingEvaluation/newEvaluation/evaluation/"+id;
                    var url = "/student/teachingEvaluation/newEvaluation/evaluation/" + id;
                    window.open(url, '_blank');
                }else{
                    urp.alert("当前问卷您已经评估过，不能重复评估！");
                    return;
                }
            }
        }*/

        //下面这个函数会自动点击评教*列表*页面上的评教按钮。已经评过的不会点。点完后页面自动转到评教页面。因为上面那个多开的函数用不了，相当于只会点一次。但是没关系，评完教页面会跳转回来。
        setTimeout(function() {
            var buttons = document.querySelectorAll('button, input[type="button"], a');
            buttons.forEach(function(button) {
                var onclick = button.getAttribute('onclick');
                if (onclick && onclick.includes('evaluation3')) {
                    button.click();
                    console.log('自动点击了包含 evaluation3 的按钮');
                }
            });
        }, 1000);//这个1000毫秒是保险用的，你也可以把它改得更短。
    }

    else {
        //下面这个函数作废。我开始以为这个等100秒是前端设定，后来发现川大写这个教务系统的人虽然脑残好像还没脑残到这种程度，后端也做了限制。所以没用。
        /*
        Object.defineProperty(window, 'maxtime', {
            value: parseInt("-1"),
            writable: false,
            configurable: false,
            enumerable: true
        });*/

        //等这个傻逼倒计时结束后，自动点提交按钮。
        setTimeout(function() {
            var saveButton = document.getElementById('savebutton');
            if (saveButton && !saveButton.disabled) {
                saveButton.click();
                console.log("按钮已点击");
            } else {
                console.log("按钮不存在或被禁用");
            }
        }, 105000);

        //点完提交自动回去。这个等待时间可以改短一点。
        setTimeout(function() {
            var buttons = document.querySelectorAll('button, input[type="button"], a');
            buttons.forEach(function(button) {
                var onclick = button.getAttribute('onclick');
                if (onclick && onclick.includes('goBack')) {
                    button.click();
                    console.log('自动点击了包含 goBack 的按钮');
                }
            });
        }, 106000);

        //自动填充表单，点提交的时候调用。
        if (typeof window.save === 'function') {
            // const originalSave = window.save;

            window.save = function() {
                console.log("FUCK");
                // originalSave.apply(this, arguments);
                tjcs++;
                $("#tjcs").val(tjcs);
                var c = 0;
                var j = 0;
                for (i = 0; i < document.saveEvaluation.elements.length; i++) {
                    if (document.saveEvaluation.elements[i].getAttribute("data-name") == 'szt') {

                        if (document.saveEvaluation.elements[i].value.length != 0 && document.saveEvaluation.elements[i].value != 0) {
                            c = 1;
                        }
                        j++;
                        if (c == 0) {
                            document.saveEvaluation.elements[i].value = "100";
                            urp.alert("请回答第" + j + "题!");
                            // this.preventDefault();
                        }
                        c = 0;
                    }
                    if (document.saveEvaluation.elements[i].type == 'radio') {
                        if(c == 0)
                        {
                            document.saveEvaluation.elements[i].checked = true;
                            c = 1;
                        }

                        if (document.saveEvaluation.elements[i].name != document.saveEvaluation.elements[i + 1].name) {
                            j++;
                            if (c == 0) {
                                urp.alert("请回答第" + j + "题!");
                                this.preventDefault();
                            }
                            c = 0;
                        }
                    }
                    if (document.saveEvaluation.elements[i].type == 'checkbox') {
                        if(c == 0)
                        {
                            document.saveEvaluation.elements[i].checked = true;
                            c = 1;
                        }

                        if (document.saveEvaluation.elements[i].name != document.saveEvaluation.elements[i + 1].name) {
                            j++;
                            if (c == 0) {
                                urp.alert("请回答第" + j + "题!");
                                this.preventDefault();
                            }
                            c = 0;
                        }
                    }
                    if (document.saveEvaluation.elements[i].type == 'textarea') {
                        j++;
                        if (document.saveEvaluation.elements[i].value.length == 0) {
                            if (c == 0) {
                                document.saveEvaluation.elements[i].value = "无";
                                //请删去下面这一行
                                //document.saveEvaluation.elements[i].value = "本评教内容使用脚本自动生成。川大的教务系统使用无意义的100秒限制浪费所有学生的时间，这是比单纯的网站做得烂更令人无法忍受的。";
                                urp.alert("请回答第" + j + "题!");
                                // this.preventDefault();
                            }
                            c = 0;
                        }
                    }
                }
                //必选题答题校验
                var tmwjjbdm = "04";
                var node = $("input[name='C00F87D7BEB57F5CE053832F73CA62A9']")[0];
                var bxtfs = $(node).val();

                var zzfs = "";//必选题最终分数

                if(bxtdffs == "01"){//星星打分需要根据星星个数换算
                    zzfs = dealFztxxdffs(bxtfs,"5",bxtfz);
                }else{
                    zzfs = bxtfs;
                }

                if(parseFloat(zzfs) < parseFloat(dflyd)){
                    //填写打分理由
                    var rad = "<div class='row' ><div class='col-xs-12'> <div class='alert alert-warning'>您给当前问卷中的必选题（红色标注）打的分数低于"+dflyd+",请说明理由！</div>"
                    + '<div class="profile-info-row"><div class="profile-info-name">打分理由：</div><div class="profile-info-value">'
                    + '<textarea name="dfly" id="dfly" maxlength="200"></textarea>&nbsp;&nbsp;<label style="color:red;" id="tsxx"></label></div></div></div></div>';

                    layer.confirm(rad,{title: '打分理由',
                                       btn: ['<i class="ace-icon fa fa-reply bigger-120"></i> 确定', '<i class="ace-icon fa fa-ban bigger-120"></i> 取消'] //按钮
                                      }, function () {
                        var dfly = $("#dfly").val();
                        if(dfly == "" || dfly == null || dfly == undefined){
                            $("#tsxx").text("打分理由必填");
                        }else{
                            var form = new FormData($('#saveEvaluation')[0]);
                            form.append("dfly",dfly);
                            /* urp.alert("保存成功");
						 return; */
                            var index;
                            $.ajax({
                                url: "/student/teachingAssessment/baseInformation/questionsAdd/doSave?tokenValue=" + $("#tokenValue").val(),
                                type: "post",
                                data: form,
                                dataType: "json",
                                processData: false,
                                contentType: false,
                                beforeSend: function () {
                                    index = layer.load(0, {
                                        shade: [0.2, "#000"] //0.1透明度的白色背景
                                    });

                                    $("#save").attr("disabled",true);
                                    $("#save2").attr("disabled",true);
                                },
                                success: function (data) {
                                    if (data.result.indexOf("/") != -1) {
                                        window.location.href = data.result;
                                    } else {
                                        /* if (data.result == "ok") {
									 urp.alert("保存成功！");
									 setTimeout("layer.closeAll();", 1000 );
									 window.location.href = "/student/teachingEvaluation/newEvaluation/index";
									 } else if (data.result == "no") {
									 urp.alert("保存失败！");
									 window.location.href = "/student/teachingEvaluation/newEvaluation/index";
									 } */

                                        if (data.result == "ok") {
                                            urp.alert("评教成功！");
                                            setTimeout(function(){window.location.href = "/student/teachingEvaluation/newEvaluation/index";}, 1500 );
                                        }else if (data.result == "no") {
                                            urp.alert("评教失败，请刷新页面重新尝试！");
                                        }else if (data.result == "error") {
                                            urp.alert("附件保存失败，请刷新页面后重新尝试！");
                                        }else if(data.result == "typeerr"){
                                            urp.alert("附件只能上传jpg/jpeg/png格式的图片，请确认！");
                                        }else if(data.result == "timeout"){
                                            urp.alert("超出了问卷所规定的的评估期限，评教失败，请联系管理员！");
                                        }else{
                                            urp.alert(data.result);
                                        }
                                    }
                                },
                                error: function (xhr) {
                                    layer.close(index);
                                    urp.alert("错误代码[" + xhr.readyState + "-" + xhr.status + "]:获取数据失败！");
                                },
                                complete: function () {
                                    layer.close(index);
                                    $("#save").attr("disabled",false);
                                    $("#save2").attr("disabled",false);
                                }
                            });
                        }


                    });
                }else{
                    if(parseFloat(zzfs) > parseFloat(dflyg)){
                        var rad = ""
                        rad += "<div class='profile-info-row'>";
                        if(dfxx != null && dfxx.length > 0){
                            for(var i=0;i<dfxx.length;i++){
                                var tpdfxx = dfxx[i];
                                rad +=  "<label><input name='dfxx' type='radio' class='ace' value='"+tpdfxx+"'>";
                                rad +=  "<span class='lbl'> "+tpdfxx+"</span>";
                                rad +=  "</label><br/>";
                            }
                        }

                        rad +=  "<label id='tsxx' style='color:red;'></label></div>";

                        layer.confirm(rad,{title: '打分选项',
                                           btn: ['<i class="ace-icon fa fa-reply bigger-120"></i> 确定', '<i class="ace-icon fa fa-ban bigger-120"></i> 取消'] //按钮
                                          }, function () {
                            var dfxxval = $("input[name='dfxx']:checked").val();
                            if(dfxxval == "" || dfxxval == null || dfxxval == undefined){
                                $("#tsxx").text("打分选项必选");
                            }else{
                                var form = new FormData($('#saveEvaluation')[0]);
                                form.append("dfly",dfxxval);
                                /* urp.alert("保存成功");
							 return; */
                                var index;
                                $.ajax({
                                    url: "/student/teachingAssessment/baseInformation/questionsAdd/doSave?tokenValue=" + $("#tokenValue").val(),
                                    type: "post",
                                    data: form,
                                    dataType: "json",
                                    processData: false,
                                    contentType: false,
                                    beforeSend: function () {
                                        index = layer.load(0, {
                                            shade: [0.2, "#000"] //0.1透明度的白色背景
                                        });
                                    },
                                    success: function (data) {
                                        if (data.result.indexOf("/") != -1) {
                                            window.location.href = data.result;
                                        } else {
                                            /* if (data.result == "ok") {
										 urp.alert("保存成功！");
										 setTimeout("layer.closeAll();", 1000 );
										 window.location.href = "/student/teachingEvaluation/newEvaluation/index";
										 } else if (data.result == "no") {
										 urp.alert("保存失败！");
										 window.location.href = "/student/teachingEvaluation/newEvaluation/index";
										 } */

                                            if (data.result == "ok") {
                                                urp.alert("评教成功！");
                                                setTimeout(function(){window.location.href = "/student/teachingEvaluation/newEvaluation/index";}, 1500 );

                                            }else if (data.result == "no") {
                                                urp.alert("评教失败，请刷新页面重新尝试！");
                                            }else if (data.result == "error") {
                                                urp.alert("附件保存失败，请刷新页面后重新尝试！");
                                            }else if(data.result == "typeerr"){
                                                urp.alert("附件只能上传jpg/jpeg/png格式的图片，请确认！");
                                            }else if(data.result == "timeout"){
                                                urp.alert("超出了问卷所规定的的评估期限，评教失败，请联系管理员！");
                                            }else{
                                                urp.alert(data.result);
                                            }
                                        }

                                    },
                                    error: function (xhr) {
                                        layer.close(index);
                                        urp.alert("错误代码[" + xhr.readyState + "-" + xhr.status + "]:获取数据失败！");
                                    },
                                    complete: function () {
                                        layer.close(index);
                                    }
                                });
                            }


                        });
                    }else{
                        var form = new FormData($('#saveEvaluation')[0])
                        var isCanbesave = true;
                        if (yxdcpg != "1") {
                            if (checkIsTeachEvaluationed(document.querySelector('input[name="ktid"]').value)) {
                                isCanbesave = false;
                                urp.alert("当前问卷您已经评估过了，不能重复评估！");
                                return;
                            }
                        }

                        if (isCanbesave) {
                            var index;
                            $.ajax({
                                url: "/student/teachingAssessment/baseInformation/questionsAdd/doSave?tokenValue=" + $("#tokenValue").val(),
                                type: "post",
                                data: form,
                                dataType: "json",
                                processData: false,
                                contentType: false,
                                beforeSend: function () {
                                    index = layer.load(0, {
                                        shade: [0.2, "#000"] //0.1透明度的白色背景
                                    });
                                    $("#savebutton").attr("disabled", true);
                                },
                                success: function (data) {
                                    $("#tokenValue").val(data.token);
                                    if (data.result.indexOf("/") != -1) {
                                        window.location.href = data.result;
                                    } else {
                                        /*if (data.result == "ok") {
									 urp.alert("评教成功！");
									 setTimeout(goBack, 2000);
									 //window.location.href = "/student/teachingEvaluation/newEvaluation/index";
									 } else if (data.result == "no") {
									 urp.alert("评教失败！");
									 setTimeout(goBack, 2000);
									 //window.location.href = "/student/teachingEvaluation/newEvaluation/index";
									 }*/


                                        if (data.result == "ok") {
                                            if (data.msg != "") {
                                                urp.alert(data.msg);

                                                maxtime = parseInt("100") * tjcs;
                                            } else {
                                                urp.alert("评估成功！");
                                                setTimeout(goBack, 2000);
                                            }
                                        } else {
                                            if (data.result == "typeerr") {
                                                urp.alert(data.msg2);
                                            } else if (data.result == "no") {
                                                urp.alert(data.msg2);
                                            } else if (data.result == "error") {
                                                urp.alert(data.msg2);
                                            } else if (data.result == "alert") {
                                                urp.alert(data.msg2);
                                                $("#savebutton").attr("disabled", false);
                                            } else {
                                                urp.alert(data.result);
                                            }
                                        }
                                    }

                                },
                                error: function (xhr) {
                                    layer.close(index);
                                    urp.alert("错误代码[" + xhr.readyState + "-" + xhr.status + "]:获取数据失败！");
                                },
                                complete: function () {
                                    layer.close(index);
                                }
                            });
                        }
                    }
                }
            };
        } else {
            window.save = function() {
                console.log("Custom save function executed (no original function)");
            };
        }
    }
})();

// ==UserScript==
// @name         思特奇交付物关联&考试答案查看助手
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.19
// @description  蠢蛋系统拯救
// @author       colvv
// @match        http://auto.si-tech.com.cn/devasm/apps/svnClient/svnclient.html
// @include		 http://auto.si-tech.com.cn/devasm/apps/svnClient*
// @include		 http://auto.si-tech.com.cn/devasm/apps/gitlabClient*
// @include		 http://training.si-tech.com.cn/sitech2018/pub-page/*
// @include		 http://training.si-tech.com.cn/exam/*
// @include      http://training.si-tech.com.cn/*
// @include      http://elearning.teamshub.com/*
// @include      https://sso.teamshub.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/407899/%E6%80%9D%E7%89%B9%E5%A5%87%E4%BA%A4%E4%BB%98%E7%89%A9%E5%85%B3%E8%81%94%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E6%9F%A5%E7%9C%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/407899/%E6%80%9D%E7%89%B9%E5%A5%87%E4%BA%A4%E4%BB%98%E7%89%A9%E5%85%B3%E8%81%94%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E6%9F%A5%E7%9C%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.href.startsWith("http://auto.si-tech.com.cn/devasm/apps/svnClient")) {
        let btn = document.createElement("button"), $input = $("<textarea style='height:400px;width:500px;'>"), $wrapper = $("<div>");
        let $btn = $(btn).text("关联svn文件");
        $wrapper.css({
            position: "absolute",
            left: 20, top: 20, zIndex: 100
        });
        $("body").prepend($wrapper.html([$input, $btn]));
        $btn.click(function () {
            var fileList = $.grep($input.val().split("\n"), function (ele) {
                return !/^\s*$/.test(ele);
            });

            console.log(fileList);
            var config = {
                "action": "",
                "backend_action_id": "3013886",
                "confirmFlag": "false",
                "extC": "",
                "isServiceSyn": "false",
                "loadingFlag": false,
                "pageid": "6373",
                "returnMaps": [],
                "serviceType": 0,
                "serviceid": "2001940"
            };
            var params = {"createOp": "", "demandId": "", "fileList": "", "iteraId": "", "taskId": "", "workId": "", "workStartTime": ""};

            params.taskId = getPageParamVals("hiddenTaskId", "page", 0, 1);
            params.workStartTime = getPageParamVals("hiddenWorkStartTime", "page", 0, 1);
            params.fileList = $.map(fileList, function (ele) {
                var lastIndex = ele.lastIndexOf("/"), version = ele.substr(lastIndex + 4);
                ele = ele.substr(0, lastIndex);
                lastIndex = ele.lastIndexOf("/");
                var fileName = ele.substr(lastIndex + 1), path = ele.substr(0, lastIndex);
                return {
                    fileName: fileName, filePath: path,
                    version: version, fileType: "file"
                }
            });
            /**[
             {
    "fileName":"taskList.js",
    "filePath":"http://172.18.238.62:9001/svn/basd/ra/ras/Trunk/ra-web/ra-webapp/src/main/webapp/resources/viewJs/agileflow/taskList.js",
    "version":"361547",
    "fileType":"file"
    }
             ];*/
            params.iteraId = getPageParamVals("hiddenIteraId", "page", 0, 1);
            params.demandId = getPageParamVals("hiddenDemandId", "page", 0, 1);
            params.createOp = getPageParamVals("loginUser", "page", 0, 1);
            params.workId = getPageParamVals("hiddenWorkId", "page", 0, 1);
            require(["commonutil", "appmanage", "i18n"], function (ajaxUtil, app, i18n) {
                ajaxUtil.postrest('/wsg-webapp-1.0/rs/attach/create', function (data) {
                    var varObj = {};
                    $srcObj = $("#hiddenAttachCreate");
                    if (data.code == 0) {
                        alert("成功")
                    }
                }, params, false, false)
            });
        });
        setTimeout(function () {
            $("#doBack").click();
        }, 500);


    } else if (location.href.startsWith("http://auto.si-tech.com.cn/devasm/apps/gitlabClient")) {
        let btn = document.createElement("button"), $input = $("<input style='width:500px;'>"), $select = $("<select style='width:500px;'>"),
            $listFile = $("<ul/>"), $branch = $("<span/>"), $wrapper = $("<div>");
        let $btn = $(btn).text("关联git文件");
        $wrapper.css({
            position: "absolute",
            left: 20, top: 20, zIndex: 100, padding: 20, backgroundColor: "#fff"
        });

        let hash = {
            userId: null
        }, dom = {
            $user: $("<span/>").html("正在加载当前用户..."),
            $select: $("<select style='width:500px;'>"),
            $input: $("<input style='width:500px'>")


        }, api = {
            getCurrentLogin: function (callback) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://git.si-tech.com.cn:9002/profile",
                    onload: function (response) {
                        let $dom = $(response.responseText), $user = $("#js-projects-dropdown", $dom);
                        if ($user.length === 0 || !checkNecessaryStr($user.attr("data-user-name"))) {
                            alert("获取当前登陆用户失败");
                            return;
                        }
                        hash.userId = $("#user_id", $dom).val();
                        if (!checkNecessaryStr(hash.userId)) {
                            alert("获取当前用户信息为空");
                            return;
                        }
                        dom.$user.text($user.attr("data-user-name"));
                        callback();
                    },
                });
            },
            getCommitList: function (url) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (response) {
                        var $dom = $(response.responseText);
                        var $fileChanges = $(".dropdown-menu.diff-file-changes", $dom);
                        hash.projectId = $("#search_project_id", $dom).val();
                        if ($fileChanges.length === 0) {
                            alert("获取提交文件信息失败");
                            return;
                        }

                        $listFile.html($.map($fileChanges.find("li>a.diff-changed-file").toArray(), function (dom, idx) {
                            var $this = $(dom);
                            submitInfo.listFile.push($this.find(".diff-changed-file-name").text().replace(/\u21b5/g, '').replaceAll("\n", ""));
                            return $("<li/>").html([$this.find(".diff-changed-file-name").text(), "<br>", "新增：", $this.find(".cgreen").text(), " ,删除：", $this.find(".cred").text()]);
                        }));


                    }
                });
                $branch.empty();
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url + "/branches",
                    onload: function (response) {
                        var $branches = $(response.responseText);
                        submitInfo.branch = $branches.eq(0).text().trim();
                        $branch.html($branches.eq(0).text());
                    }
                });
            }
        };
        var submitInfo = {};
        $("body").prepend($wrapper.html(["<label style='margin-right: 20px;'>提交用户</label>", dom.$user, "<br>", "<label style='margin-right: 20px;'>提交地址选择</label>", dom.$input, "<p>从gitlab中获取，链接地址如：http://git.si-tech.com.cn:9002/SITECH-ibas/RasV3.0.0/RasV3.0.0/ra-web/-/commit/XXX</p>", "<br>", $listFile, "<br>", $btn]));
        api.getCurrentLogin(function () {
            dom.$input.change(function () {
                let value = dom.$input.val();
                if (checkNecessaryStr(value)) {
                    $listFile.html("<li>加载中...</li>");
                    submitInfo.listFile = [];
                    hash.projectUrl = value.split("/-/")[0];
                    api.getCommitList(value);
                } else {
                    $listFile.empty();
                }
            });
        });


        // var submitInfo = {};
        // $("body").prepend($wrapper.html(["<label>项目地址输入</label>", $input, "<br>", "<label>提交选择</label>", $select, "<br>", "<label>隶属分支 </label>", $branch, $listFile, "<br>", "<br>", $btn]));
        // $input.on("change", function () {
        //     GM_xmlhttpRequest({
        //         method: "GET",
        //         url: $input.val(),
        //         onload: function (response) {
        //             var matchResult;
        //             if (matchResult = response.responseText.match(/data-project-id="([\d]+)"/)) {
        //                 submitInfo.projectId = matchResult[1];
        //             }
        //             if (isNaN(submitInfo.projectId)) {
        //                 alert("请保证gitlab已登录,并正确填写项目地址");
        //             } else {
        //                 localStorage.localProjectUrl = $input.val();
        //                 console.log("获取提交记录：" + "http://git.si-tech.com.cn:9002/api/v4/projects/" + submitInfo.projectId + "/repository/commits/");
        //                 GM_xmlhttpRequest({
        //                     method: "GET",
        //                     url: "http://git.si-tech.com.cn:9002/api/v4/projects/" + submitInfo.projectId + "/repository/commits/",
        //                     onload: function (response) {
        //                         $select.html("<option value=''>请选择</option>" + $.map(eval(response.responseText), function (ele) {
        //                             var $option = $("<option/>");
        //                             $option.text(ele);
        //                             return "<option value='" + ele.id + "' data-url='" + ele.web_url + "'>(" + ele.author_name + ")(" + ele.committed_date.substr(0, 10) + ")" + ele.message + "</option>";
        //                         }).join("")).val("").change();
        //                         $select.off("change").on("change", function () {
        //                             submitInfo.listFile = [];
        //                             if (!$select.val()) {
        //                                 $listFile.empty();
        //                                 return;
        //                             }
        //                             $listFile.html("<li>加载中...</li>");
        //
        //                             var url = $select.find("option:checked").attr("data-url");
        //                             GM_xmlhttpRequest({
        //                                 method: "GET",
        //                                 url: url,
        //                                 onload: function (response) {
        //                                     var $dom = $(response.responseText);
        //                                     var $fileChanges = $(".dropdown-menu.diff-file-changes", $dom);
        //                                     if ($fileChanges.length === 0) {
        //                                         alert("获取提交文件信息失败");
        //                                         return;
        //                                     }
        //
        //                                     $listFile.html($.map($fileChanges.find("li>a.diff-changed-file").toArray(), function (dom, idx) {
        //                                         var $this = $(dom);
        //                                         submitInfo.listFile.push($this.find(".diff-changed-file-name").text().replace(/\u21b5/g, '').replaceAll("\n", ""));
        //                                         return $("<li/>").html([$this.find(".diff-changed-file-name").text(), "<br>", "新增：", $this.find(".cgreen").text(), " ,删除：", $this.find(".cred").text()]);
        //                                     }));
        //
        //
        //                                 }
        //                             });
        //                             $branch.empty();
        //                             GM_xmlhttpRequest({
        //                                 method: "GET",
        //                                 url: url + "/branches",
        //                                 onload: function (response) {
        //                                     var $branches = $(response.responseText);
        //                                     submitInfo.branch = $branches.eq(0).text().trim();
        //                                     $branch.html($branches.eq(0).text());
        //                                 }
        //                             });
        //
        //
        //                         });
        //                     }
        //                 });
        //             }
        //         }
        //     });
        // });
        //
        // if (localStorage.localProjectUrl) {
        //     $input.val(localStorage.localProjectUrl).change();
        // }
        //
        //
        $btn.click(function () {
            if (!submitInfo.listFile || submitInfo.listFile.length === 0) {
                alert("请等待加载文件清单完成后再进行操作");
                return;
            }
            if (!submitInfo.branch) {
                alert("请等待分支加载完毕");
                return;
            }
            var projectUrl = hash.projectUrl;

            var fileList = $.map(submitInfo.listFile, function (file) {
                return {
                    projectid: hash.projectId, type: "file",
                    breach: submitInfo.branch,
                    path: projectUrl + "/blob/" + submitInfo.branch + "/" + file,
                    name: file.substr(file.lastIndexOf("/") + 1)
                };
            });


            var config = {
                "action": "",
                "backend_action_id": "3013157",
                "confirmFlag": "false",
                "extC": "",
                "isServiceSyn": "false",
                "loadingFlag": false,
                "pageid": "6833",
                "returnMaps": [],
                "serviceType": 0,
                "serviceid": "2001850"
            };
            var params = {"dataList": "", "demandId": "", "itemType": "", "iteraId": "", "taskId": "", "token": "", "versionNo": "", "version_type": "", "workId": "", "work_start_time": ""};

            params.dataList = JSON.stringify(fileList);
            params.taskId = $("#taskId").val();
            params.iteraId = $("#iteraId").val();
            params.token = $("#GITLABAPIToken").val();
            params.demandId = $("#demandId").val();
            params.work_start_time = getPageParamVals("workStartTime", "page", 0, 1);
            params.workId = getPageParamVals("workId", "page", 0, 1);
            console.log(params);
            require(["commonutil", "appmanage", "i18n"], function (ajaxUtil, app, i18n) {
                ajaxUtil.postrest('/wsg-webapp-1.0/rs/gitlabClient/createAttachInfo', function (data) {
                    var varObj = {};
                    $srcObj = $("#hiddenSaveAttach");
                    if (data.code == 0) {
                        alert("成功")
                        setTimeout(function () {
                            $(".ui-dialog-button button", window.parent.document).click();
                        }, 500);
                    } else {
                        dialog({
                            id: 'infoId',
                            title: '提示',
                            content: document.getElementById('infoDiv'),
                            width: 400
                        }).showModal();
                        $("#yesBtn").removeClass("none");
                        $("#infoConfirm").text("保存失败！");
                    }
                }, params, false, false);
            });

        });


    }

    if (location.href.startsWith("http://elearning.teamshub.com/sitech2018/pub-page/")) {
        var bindFunction = function () {
            try {
                eval("getScoreList")
            } catch (e) {
                console.log("未绑定");
                setTimeout(bindFunction, 100);
                return;
            }

            console.log("已绑定");

            getScoreList = function (pageNoExam) {
                console.log("replace");
                $("#searchTag").attr("onclick", "getScoreList(1)");
                var v = $("#examName1").val();
                var examName = encodeURIComponent(v);
                require(['commonutil', 'uri', 'kmdI18n'], function (ajaxUtil, uri, kmdI18n) {
                    var i18n = kmdI18n.getKmdExamI18n();
                    ajaxUtil.callrest('/kmd_exam/myExam/scoreList?pageNo=' + pageNoExam + '&pageSize=' + pageSizeExam + '&examName=' + examName, function (data) {
                        require(['/sitech2018/pub-page/myExam/scoreList_1274a77.js'], function (myExamScoreList) {
                            if (0 == data.code) {
                                var total = data.totalCount;
                                if (0 == total) {//没有数据
                                    $("#scoreList").html('<div class="data-empty" style="display:;"><div class="img-empty"></div><div class="result-tip">没有已完成的考试哦：)</div></div>');
                                    $("#pageNumScore").css('display', 'none');
                                } else {
                                    data['i'] = (pageNoExam - 1) * 10;
                                    data['noTh'] = i18n.prop("portal_myExamList_noTh");
                                    data['examNameTh'] = i18n.prop("portal_myExamList_examNameTh");
                                    data['examTimeTh'] = i18n.prop("portal_myExamList_examTimeTh");
                                    data['scoreTh'] = i18n.prop("portal_myExamList_scoreTh");
                                    data['timeLongTh'] = i18n.prop("portal_myExamList_timeLongTh");
                                    data['passflagTh'] = i18n.prop("portal_myExamList_passflagTh");
                                    data['operateTh'] = i18n.prop("portal_myExamList_operateTh");
                                    data['passYes'] = i18n.prop("portal_myExamList_passFlag_yes");
                                    data['passNo'] = i18n.prop("portal_myExamList_passFlag_no");
                                    data['operateTh'] = i18n.prop("portal_myExamList_operateTh");
                                    data['userAnswerHref'] = i18n.prop("portal_myExamList_userAnswerHref");
                                    data['rightAnswerHref'] = i18n.prop("portal_myExamList_rightAnswerHref");
                                    data['statusTh'] = i18n.prop("portal_myExamList_statusTh");
                                    data['noMark'] = i18n.prop("portal_myExamList_noMark");
                                    data['marked'] = i18n.prop("portal_myExamList_marked");
                                    data['noPublicScore'] = i18n.prop("portal_myExamList_noPublicScore");
                                    $.each(data.dataList, function (i, val) {
                                        var timeLong = val.timeLong;
                                        if (timeLong >= 60) {
                                            var min = parseInt(timeLong / 60) + '';
                                            var sec = parseInt(timeLong % 60) + '';
                                            var str1 = i18n.prop("portal_scoreList_timeLongMin", min, sec);
                                            val.timeLong = str1;
                                        } else {
                                            var str1 = i18n.prop("portal_scoreList_timeLongSec", timeLong + '');
                                            val.timeLong = str1;
                                        }
                                    });
                                    $.each(data.dataList, function (idx, ele) {
                                        $.extend(ele, {publicUserAnswerFlag: 1});
                                    });
                                    $("#scoreList").html(myExamScoreList(data));
                                    $("#pageNumScore").css('display', '');
                                    getPageListExam(total, pageNoExam);
                                }
                            } else {//异常错误提示
                                kDialog_alert(data.message);
                            }
                        });
                    });


                });
            };

        };
        bindFunction();
    }

    if (location.href.startsWith("http://elearning.teamshub.com")||location.href.startsWith("http://training.si-tech.com.cn/")) {
        var origin = Array.prototype.slice;
        Array.prototype.slice = function(){
            if(this.length>0){
                if(this[0].examId){
                    this.forEach((item)=>{
                        item.publicUserAnswer = 1;
                    })
                }
            }
            return origin.apply(this,arguments);
        }
    }

    if(location.href.startsWith("https://sso.teamshub.com/")){
        if(unsafeWindow.verifyIp){
            unsafeWindow.verifyIp = function(enterId, orgNoTmp, username_plain, timer) {
                disableLogin();
                smsLogin(orgNoTmp);
                if ($('#psw').hasClass('active')) {
                    setCookie("username", username_plain, 7 * 24, "/");
                }
            }
        }

    }

    function checkNecessaryStr(str) {//保证boolean返回值 ,补充0也是合法内容
        return !!((str || 0 === str) && str !== "null" && $.trim(str) !== "");
    }

    Date.prototype.Format = function (fmt) { // author: meizz
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds()
            // 毫秒
        };
        fmt = nvl(fmt, "yyyy-MM-dd");
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    function nvl(target, replace) {
        return checkNecessaryStr(target) ? target : replace;
    }
})();
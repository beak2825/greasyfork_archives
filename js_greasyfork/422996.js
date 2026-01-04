// ==UserScript==
// @name         获取分支
// @namespace    ydr
// @version      1.8
// @description  创建bug、关闭bug等操作时，可以快速获取分支
// @author       ydr
// @match        https://jira.meitu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/422996/%E8%8E%B7%E5%8F%96%E5%88%86%E6%94%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/422996/%E8%8E%B7%E5%8F%96%E5%88%86%E6%94%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const refreshTime = 1000;
    //评论上的获取分支按钮
    function addCommentButton() {
        // 生成获取分支对应输入框和按钮UI
        let $branch_span_comment = $('<span style="font-size: 15px" id="comment_text">输入id：</span>');
        let $input_text = $('<input type="text" class="text medium-field" id="build_id_comment">');
        let $branch_btn_comment = $('<input class="aui-button" type="button" value="获取分支" id="get_branch_btn_comment">');
        let $last_branch_btn_comment = $('<input type="button" class="aui-button" value="上次分支" id="last_branch_btn_comment">');
        let $camera_template_btn_comment = $('<input type="button" class="aui-button" value="相机模板" id="get_camera_template_btn_comment">');
        let $camera_file_btn_comment = $('<input type="button" class="aui-button" value="相机附件" id="get_camera_file_btn_comment">');
        // 判断UI是否存在，存在则不再重复添加，不存在则添加到对应的位置
        var is_btn = document.getElementById('get_branch_btn_comment');
        if (!is_btn) {
            let $b = $branch_span_comment.append($input_text).append($branch_btn_comment).append($last_branch_btn_comment).append($camera_template_btn_comment).append($camera_file_btn_comment);
            $("#addcomment").after($b);
        }
    }
    //关闭jira时获取分支按钮
    function closeJiraButton() {
        // 因点击关闭按钮时，弹窗元素需要等一会才弹出，所以这边设置了展示延迟
        setTimeout(function () {
            // 生成获取分支对应输入框和按钮UI
            let $branch_span_close = $('<span id="close_text">输入id：</span>');
            let $input_text_close = $('<input type="text" class="text medium-field" id="build_id_close">');
            let $branch_btn_close = $('<input type="button" class="aui-button" value="获取分支" id="get_branch_btn_close">');
            let $last_branch_btn_close = $('<input type="button" class="aui-button" value="上次分支" id="last_branch_btn_close">');
            // 判断UI是否存在，存在则不再重复添加，不存在则添加到对应的位置
            var is_close_btn = document.getElementById('get_branch_btn_close');
            if (!is_close_btn) {
                let $c = $branch_span_close.append($input_text_close).append($branch_btn_close).append($last_branch_btn_close);
                $("#issue-workflow-transition-submit").before($c);
            }
        }, 800);
    }
    //重新打开jira时获取分支按钮
    function openJiraButton() {
        // 因点击重新打开按钮时，弹窗元素需要等一会才弹出，所以这边设置了展示延迟
        setTimeout(function () {
            // 生成获取分支对应输入框和按钮UI
            let $branch_span_open = $('<span id="open_text">输入id：</span>');
            let $input_text_open = $('<input type="text" class="text medium-field" id="build_id_open">');
            let $branch_btn_open = $('<input type="button" class="aui-button" value="获取分支" id="get_branch_btn_open"><br>');
            let $last_branch_btn_open = $('<input type="button" class="aui-button" value="上次分支" id="last_branch_btn_open">');
            // 判断UI是否存在，存在则不再重复添加，不存在则添加到对应的位置
            var is_open_btn = document.getElementById('get_branch_btn_open');
            if (!is_open_btn) {
                let $d = $branch_span_open.append($input_text_open).append($branch_btn_open).append($last_branch_btn_open);
                $("#issue-workflow-transition-submit").before($d);
            }
        }, 800);

    }

    // 创建jira时添加获取分支按钮
    function addJiraButton() {
        //创建jira上的获取分支按钮
        let $branch_span = $('<label for="customfield_10304"></label>');
        let $branch_btn = $('<input type="button" class="aui-button" value="获取分支" id="get_branch_btn">');
        let $a = $branch_span.append($branch_btn);
        $("#customfield_10303").after($a);
        let $last_branch_btn = $('<input type="button" class="aui-button" value="上次分支" id="last_branch_btn">');
        $branch_span.append($last_branch_btn);
    }

    // 通过平台+build id，获取对应分支，并回调到对应的函数上
    function get_branch(platform, build_id) {
        var url = '';
        var branch = '';
        var result = '';
        // 获取iOS的分支
        if (platform == 'iOS') {
            url = 'http://ios.meitu-int.com/ipa/mtxx/build/' + build_id;
            GM_xmlhttpRequest({
                url: url,
                method: 'GET',
                onload: function (res) {
                    if (res.status === 200) {
                        // 通过正则匹配获取分支名称
                        var r = '<span class="branch-name">(.*?)</span>';
                        try {
                            branch = res.responseText.match(r)[1];
                        } catch {
                            branch = '未找到该包的分支';
                        }
                    } else {
                        branch = '未找到该包的分支';
                    }
                        // 拼接成分支+build id并返回
                        result = branch + '#' + build_id;
                        GM_setValue('branch_value', result);
                },
                onerror: function (err) {
                    result = '接口请求失败，建议重新关闭开启脚本再试试';
                    GM_setValue('branch_value', result);
                }
            });
        }
        // 获取Android的分支
        else if (platform == 'Android') {
            url = 'https://api-ci-data.meitu.city/ci/api/v2/build?project=Meitu&build=' + build_id;
            GM_xmlhttpRequest({
                url: url,
                method: 'GET',
                onload: function (res) {
                    if (res.status === 200) {
                        // 通过正则匹配获取分支名称
                        var r = '"branch":"(.*?)"';
                        try {
                            branch = res.responseText.match(r)[1];
                        } catch {
                            branch = '未找到该包的分支';
                        }
                    } else {
                        console.log("失败");
                        branch = '未找到该包的分支';
                    }
                    // 拼接成分支+build id并返回
                        // 拼接成分支+build id并返回
                        result = branch + '#' + build_id;
                        console.log("Android分支：" + result);
                        GM_setValue('branch_value', result);
                        console.log("Android分支设置成功：" + result);
                },
                onerror: function (err) {
                    result = '接口请求失败，建议重新关闭开启脚本再试试';
                    GM_setValue('branch_value', result);
                    console.log("error");
                    console.log(err);
                }
            });
        }
    }

    // 当是jira域名时，才触发后续的操作，如果不是则不触发
    if (location.href.indexOf('jira.meitu.com') > 0) {
        clearInterval(refreshTime);
        setInterval(function () {
            // 因创建jira入口较多，这边默认1s刷新一次
            addJiraButton();
            // 点击【备注】时，进行插入UI相关操作
            $('#footer-comment-button').unbind("click").click(function () {
                addJiraButton(); // 评论位置加入icon
                var is_btn_comment = document.getElementById('get_branch_btn_comment');
                // 如果不存在则添加
                if (!is_btn_comment) {
                    addCommentButton();
                }
            });
            // 点击【重新打开】时，进行插入UI相关操作
            $('#action_id_31').unbind("click").click(function () {
                var is_btn_open = document.getElementById('get_branch_btn_open');
                // 如果不存在则添加
                if (!is_btn_open) {
                    openJiraButton();
                }
            });
            // 点击【关闭问题】时，进行插入UI相关操作
            $('#action_id_21').unbind("click").click(function () {
                console.log("点击几次");
                //var is_btn_close_dialog =  document.getElementById('workflow-transition-21-dialog');
                var is_btn_close = document.getElementById('get_branch_btn_close');
                // 如果不存在则添加
                if (!is_btn_close) {
                    closeJiraButton();
                }
            });
            // 评论入口，点击【获取分支】按钮时，获取对应分支
            $("#get_branch_btn_comment").unbind("click").click(function () {
                // 获取bug页面的平台
                var platform_text = $("#customfield_10301-val").text();
                var platform = platform_text.replace(/(^\s*)|(\s*$)/g, ""); //去掉前后的空格
                var input_build_id_comment = document.getElementById("build_id_comment").value;
                var build_id_comment = input_build_id_comment.replace(/[^0-9]/ig, ""); //只提取里面的数字，避免有空格之类的
                var comment_text = $("#addcomment textarea[id='comment']").val();
                // 判断平台是否正确，如果不正确则弹出弹窗提示，正确则调用回调函数
                if (platform == '' || platform == "Web") {
                    get_branch('Android', build_id_comment);
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_comment);
                        var default_value = '未找到该包的分支'+"#"+build_id_comment
                        if (value == default_value){
                            get_branch('iOS', build_id_comment);
                        }
                        setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_comment);
                        document.getElementById('build_id_comment').value = value;
                        var result_value = comment_text + value;
                        $("#addcomment textarea[id='comment']").val(result_value);
                        var e = document.getElementById("build_id_comment"); //对象是contents
                        e.select(); //选择对象 （全选）
                        document.execCommand("Copy"); //执行浏览器复制命令
                        $("#addcomment textarea[id='comment']").focus();
                    }, 500);
                    }, 500);
                }
                else {
                    get_branch(platform, build_id_comment);
                    // 支持直接复制分支操作，设置了300ms的延迟，避免接口没来得及返回
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_comment);
                        // 增加重试机制，等1s再重新取一次
                        if(value.indexOf(build_id_comment) != -1){
                            setTimeout(function () {
                                var value = GM_getValue('branch_value', build_id_comment);
                                }, 1000);
                        }
                        document.getElementById('build_id_comment').value = value;
                        var result_value = comment_text + value;
                        $("#addcomment textarea[id='comment']").val(result_value);
                        var e = document.getElementById("build_id_comment"); //对象是contents
                        e.select(); //选择对象 （全选）
                        document.execCommand("Copy"); //执行浏览器复制命令
                        $("#addcomment textarea[id='comment']").focus();
                    }, 500);
                }
            })
            // 重新打开jira入口，点击【获取分支】按钮时，获取对应分支
            $("#get_branch_btn_open").unbind("click").click(function () {
                // 获取bug页面的平台
                var platform_text = $("#customfield_10301-val").text();
                var platform = platform_text.replace(/(^\s*)|(\s*$)/g, ""); //去掉前后的空格
                var open_text = $("#workflow-transition-31-dialog textarea[id='comment']").val();
                console.log("jira上的平台：", platform);
                var input_build_id_open = document.getElementById("build_id_open").value;
                var build_id_open = input_build_id_open.replace(/[^0-9]/ig, ""); //只提取里面的数字，避免有空格之类的
                // 判断平台是否正确，如果不正确则弹出弹窗提示，正确则调用回调函数
                if (platform == '' || platform == "Web") {
                    get_branch('Android', build_id_open);
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_open);
                        var default_value = '未找到该包的分支'+"#"+build_id_open
                        if (value == default_value){
                            get_branch('iOS', build_id_open);
                        }
                        setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_open);
                        document.getElementById('build_id_open').value = value;
                        var result_value = open_text + value;
                        $("#workflow-transition-31-dialog textarea[id='comment']").val(result_value);
                        var e = document.getElementById("build_id_open"); //对象是contents
                        e.select(); //选择对象 （全选）
                        document.execCommand("Copy"); //执行浏览器复制命令
                        $("#workflow-transition-31-dialog textarea[id='comment']").focus();
                    }, 500);
                    }, 500);
                } else {
                    get_branch(platform, build_id_open);
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_open);
                        console.log("重新打开jira获取的分支：",value);
                        // 增加重试机制，等1s再重新取一次
                        if(value.indexOf(build_id_open) != -1){
                            setTimeout(function () {
                                var value = GM_getValue('branch_value', build_id_open);
                                }, 1000);
                        }
                        document.getElementById('build_id_open').value = value;
                        var result_value = open_text + value;
                        $("#workflow-transition-31-dialog textarea[id='comment']").val(result_value);
                        var e = document.getElementById("build_id_open"); //对象是contents
                        e.select(); //选择对象 （全选）
                        document.execCommand("Copy"); //执行浏览器复制命令
                        $("#workflow-transition-31-dialog textarea[id='comment']").focus();
                    }, 500);
                }
            })
            // 关闭jira入口，点击【获取分支】按钮时，获取对应分支
            $("#get_branch_btn_close").unbind("click").click(function () {
                // 获取bug页面的平台
                var platform_text = $("#customfield_10301-val").text();
                var platform = platform_text.replace(/(^\s*)|(\s*$)/g, ""); //去掉前后的空格
                console.log("jira上的平台：", platform);
                var close_text = $("#workflow-transition-21-dialog textarea[id='comment']").val();
                console.log("有获取到吗？",close_text);
                var input_build_id_close = document.getElementById("build_id_close").value;
                var build_id_close = input_build_id_close.replace(/[^0-9]/ig, ""); //只提取里面的数字，避免有空格之类的
                // 判断平台是否正确，如果不正确则弹出弹窗提示，正确则调用回调函数
                if (platform == '' || platform == "Web") {
                    get_branch('Android', build_id_close);
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_close);
                        var default_value = '未找到该包的分支'+"#"+build_id_close
                        if (value == default_value){
                            get_branch('iOS', build_id_close);
                        }
                        setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_close);
                        var result_value = close_text + value;
                        console.log("关闭jira获取的总文案：",result_value);
                        $("#workflow-transition-21-dialog textarea[id='comment']").val(result_value);
                        console.log("最终有执行到这边吗？",result_value);
                        document.getElementById('build_id_close').value = value;
                        var e = document.getElementById("build_id_close"); //对象是contents
                        e.select(); //选择对象 （全选）
                        document.execCommand("Copy"); //执行浏览器复制命令
                        $("#workflow-transition-21-dialog textarea[id='comment']").focus();
                    }, 500);
                    }, 500);
                } else {
                    get_branch(platform, build_id_close);
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id_close);
                        // 增加重试机制，等1s再重新取一次
                         if(value.indexOf(build_id_close) != -1){
                            setTimeout(function () {
                                var value = GM_getValue('branch_value', build_id_close);
                                }, 1000);
                        }
                        var result_value = close_text + value;
                        console.log("关闭jira获取的总文案：",result_value);
                        $("#workflow-transition-21-dialog textarea[id='comment']").val(result_value);
                        console.log("最终有执行到这边吗？",result_value);
                        document.getElementById('build_id_close').value = value;
                        var e = document.getElementById("build_id_close"); //对象是contents
                        e.select(); //选择对象 （全选）
                        document.execCommand("Copy"); //执行浏览器复制命令
                        $("#workflow-transition-21-dialog textarea[id='comment']").focus();
                    }, 500);
                }
            })
            // 创建jira入口，点击【获取分支】按钮时，获取对应分支
            $("#get_branch_btn").unbind("click").click(function () {
                //获取创建bug页面上的平台
                var create_platform = '';
                var platform_list = ['Android', 'iOS', 'Web'];
                let inputs = document.getElementsByName("customfield_10301");
                // 遍历获取哪个平台是被选中的，从而根据平台去获取分支
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].checked) { // 选中则代表指向该平台
                        create_platform = platform_list[i]
                    }
                };
                var input_build_id = document.getElementById("customfield_10303").value;
                var build_id = input_build_id.replace(/[^0-9]/ig, ""); //只提取里面的数字，避免有空格之类的
                if (create_platform == '' || create_platform == "Web") {
                    get_branch('Android', build_id);
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id);
                        var default_value = '未找到该包的分支'+"#"+build_id
                        if (value == default_value){
                            get_branch('iOS', build_id);
                        }
                        setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id);
                        console.log("创建jira获取的分支：",value);
                        // 创建jira时的分支展示的地方
                        document.getElementById('customfield_10303').value = value;
                    }, 500);
                    }, 500);
                    //alert("请选择Android或iOS平台");
                } else {
                    get_branch(create_platform, build_id);
                    setTimeout(function () {
                        var value = GM_getValue('branch_value', build_id);
                        console.log("创建jira获取的分支：",value);
                        // 增加重试机制，等1s再重新取一次
                        if(value.indexOf(build_id) != -1){
                            setTimeout(function () {
                                var value = GM_getValue('branch_value', build_id);
                                }, 1000);
                        }
                        // 创建jira时的分支展示的地方
                        document.getElementById('customfield_10303').value = value;
                    }, 500);
                }
            });
            // 创建bug获取上次分支按钮
            $("#last_branch_btn").unbind("click").click(function () {
                var value = GM_getValue('branch_value', '未找到记录');
                document.getElementById('customfield_10303').value = value;
            });
            // 重新打开bug获取上次分支按钮
            $("#last_branch_btn_open").unbind("click").click(function () {
                var value = GM_getValue('branch_value', '未找到记录');
                var open_text = $("#workflow-transition-31-dialog textarea[id='comment']").val();
                var result_value = open_text + value;
                $("#workflow-transition-31-dialog textarea[id='comment']").val(result_value);
                $("#workflow-transition-31-dialog textarea[id='comment']").focus();
            });
            // 关闭bug获取上次分支按钮
            $("#last_branch_btn_close").unbind("click").click(function () {
                var value = GM_getValue('branch_value', '未找到记录');
                var close_text = $("#workflow-transition-21-dialog textarea[id='comment']").val();
                var result_value = close_text + value;
                $("#workflow-transition-21-dialog textarea[id='comment']").val(result_value);
                $("#workflow-transition-21-dialog textarea[id='comment']").focus();
            });
            // 评论bug获取上次分支按钮
            $("#last_branch_btn_comment").unbind("click").click(function () {
                var value = GM_getValue('branch_value', '未找到记录');
                var comment_text = $("#addcomment textarea[id='comment']").val();
                var result_value = comment_text + value;
                $("#addcomment textarea[id='comment']").val(result_value);
                $("#addcomment textarea[id='comment']").focus();
            });
            // 评论入口，点击【相机模板】按钮时，获取对应分支
            $("#get_camera_template_btn_comment").unbind("click").click(function () {
                let camera_text = "h1. 模板示例 \n【效果引擎--前置check】{color:red}check结果备注{color}\n 1、AI引擎版本是否满足需求（引擎日志查看版本；确认是否引入期望的版本；排查maven/pod导致版本覆盖）\n 2、模型引擎正确设置（引擎日志确认模型是否下载；是否存在读取模型失败）\n 3、AI引擎相关功能是否正确开启（引擎日志确认是否存在依赖未开启 \n \n【效果引擎】\n 1、配置信息（Dump效果配置是否加载；效果参数值）：{color:red}xx{color} \n \n【AI引擎--前置check】{color:red}check结果备注{color}\n 1、相关配置是否加载（可在config信息中，查看加载的配置是否存在）\n 2、相关参数是否生效（可在config信息中，查看相关参数是否生效）\n 3、相关数据是否设置\n \n【AI引擎】\n 1、AI引擎模型内置or线上：{color:red}xx{color}\n 2、AI引擎日志（初始化时Debug模式，关键词 “mtai:”）：{color:red}附件{color}\n 3、素材配置的方式：{color:red}xx{color}\n \n 【LDS链接】\n https://techgit.meitu.com/MTLabEngines/libs/mtlablds/-/blob/0.9.0-support-mtxx-beta-51-beautyResource-7/mtlablds.txt\n {color:red}链接替换成当前{color}\n【LDS对比】\n http://mtat.meitu.com/TestManageProject/upload.jhtml?p=ldsTool&code=nxRmi8lQ-DSXKPUrrHh2o5Xp9lOtk57NeLtzDudltZI&state=undefined&appid=wxb7b291e71c4e8823 \n{color:#707070}使用上面👆地址，对比结果{color}，{color:red}结果粘贴在此处{color}\n【其他】\n 1、已经查到的信息\n 2、排查思路建议";
                $("#addcomment textarea[id='comment']").val(camera_text);
                //$("#addcomment textarea[id='comment']").focus();
            });
            // 评论入口，点击【相机附件】按钮时，获取对应分支
            $("#get_camera_file_btn_comment").unbind("click").click(function () {
                let camera_file = 'jira单要求一定有附件：\n 1、原图、结果图（保存出来的 不要截屏）\n 2、效果差异：提供原图、结果图、旧版本原图、旧版本的结果图（保存出来的 不要截屏）\n 3、单机/全机问题：手机系统写清楚\n 4、客户端版本：影响版本字段\n 5、分支信息：分支链接，如：https://ci.meitu.city/build/Meitu/number/45084\n 6、dump日志：查看方式 https://cf.meitu.com/confluence/pages/viewpage.action?pageId=294610610\n 7、log信息 \n \n默认指派给客户端开发，备注相关信息后可指给中台：\n 安卓：xxx\n iOS：xxx123';
                $("#addcomment textarea[id='comment']").val(camera_file);
            });
s

        }, refreshTime);
    }


    // Your code here...
})();
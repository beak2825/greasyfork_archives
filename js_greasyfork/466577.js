// ==UserScript==
// @name         自动填充子任务
// @namespace    https://www.yangshaofeng.com/
// @version      2.1
// @description  项目-任务-添加子任务-填充子任务
// @author       杨富贵
// @match        http://*/zentao/task-batchCreate*
// @match        http://*/zentao/project-task-*
// @match        http://*/zentao/productplan-view-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.251
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466577/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AD%90%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/466577/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AD%90%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 创建 script 元素
    var script = document.createElement('script');
    // 设置 script 的 src 属性为 jQuery 的路径
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    // 添加 script 元素到页面中
    document.getElementsByTagName('head')[0].appendChild(script);

    // 在 script 加载完成后执行代码
    script.onload = function () {
        /*逻辑开始*/
        //填充事件
        window.tianchong = function () {
            //获取主任务ID
            var currentUrl = window.location.href;
            var urlpage= window.location.pathname;
            const matches = urlpage.match(/\d+/g);
            var taskid = parseInt(matches[3], 10);
            var protocol = window.location.protocol;
            var host = window.location.host;

            var taskurl = protocol + "//" + host + "/zentao/task-view-" + taskid + ".html";
            $.get(taskurl).then(function (res) {
                let taskLv = $(res).find("tr:contains('优先级')").find("span:eq(0)").text().trim();
                let taskStartTime = $(res).find("tr:contains('预计开始')").find("td:eq(0)").text().trim();
                let taskEndTime = $(res).find("tr:contains('截止日期')").find("td:eq(0)").text().trim();
                var jobName = $(".main-header.clearfix").find("span.pull-left").text();
                jobName = jobName.replace(/-/g, "");
                for (var i = 0; i < 3; i++) {
                    var newjobName = "";
                    var jobtime = 3;
                    var jobremark = "";
                    if (i == 0) {
                        newjobName = "【后端基础】";
                        jobremark = "1、完成基础服务接口开发\r\n2、协助聚合服务完成相关接口开发";
                        jobtime = 3;
                    } else if (i == 1) {
                        newjobName = "【后端聚合】";
                        jobremark = "1、完成聚合服务接口开发\r\n2、协助前端完成接口对接工作\r\n3、完成功能自测";
                        jobtime = 4;
                    } else if (i == 2) {
                        newjobName = "【前端】";
                        jobremark = "1、完成UI绘制和多语言整理\r\n2、完成接口对接工作\r\n3、完成功能自测";
                        jobtime = 5;
                    }
                    newjobName = newjobName + jobName;
                    var dom = $(".table-responsive.scroll-none").find("tbody").find("tr:eq(" + i + ")");
                    dom.find("td:eq(3)").find("input[type='text']").val(newjobName);
                    dom.find("td:eq(6)").find("input[type='text']").val(jobtime);
                    dom.find("td:eq(7)").find("input[type='text']").val(taskStartTime);
                    dom.find("td:eq(8)").find("input[type='text']").val(taskEndTime);
                    dom.find("td:eq(9)").find("textarea").val(jobremark);
                    dom.find("td:eq(10)").find("select").val(taskLv);
                }
            });
            $(".table-responsive.scroll-none").find("tbody").find("tr:eq(0)").find("td:eq(4)").find(
                "select").val("devel");
        }

        //复制我的激活的需求
        window.copyActiveSelect = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            var strinfo = "";
            var username = $("#userMenu .user-name").text();
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var devname = $(item).find("td:eq(6)").text();
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(2)").find("span").text();
                    var xqStatus = $(item).find("td:eq(8)").find("span").text().trim();
                    var xqTit = $(item).find("td:eq(4)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    if (devname == username && xqGrade == i && xqStatus != "草稿") {
                        strinfo += "【" + xqId + "(" + xqGrade + ")" + devname + "组" + verstr + "】" + xqTit + "\r\n";
                        count += 1;
                    }
                });
            }
            // 创建一个隐藏的textarea元素
            const $textarea = $("<textarea>")
                .css({ position: "absolute", left: "-9999px" })
                .appendTo($("body"));
            // 设置textarea的值
            $textarea.val(strinfo);
            // 选择textarea中的文本
            $textarea[0].select();
            // 将文本复制到剪贴板中
            document.execCommand("copy");
            // 删除textarea元素
            $textarea.remove();
            alert("恭喜您，复制成功！共计" + count + "条");
        }

        //复制选中需求
        window.copySelect = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            var strinfo = "";
            // var username = $("#userMenu .user-name").text();
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var checked = $(item).find("td:eq(0)").find("input[type=checkbox]").prop("checked");
                    var devname = $(item).find("td:eq(6)").text();
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(2)").find("span").text();
                    var xqTit = $(item).find("td:eq(4)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    if (checked && xqGrade == i) {
                        strinfo += "【" + xqId + "(" + xqGrade + ")" + devname + "组" + verstr + "】" + xqTit + "\r\n";
                        count += 1;
                    }
                });
            }
            // 创建一个隐藏的textarea元素
            const $textarea = $("<textarea>")
                .css({ position: "absolute", left: "-9999px" })
                .appendTo($("body"));
            // 设置textarea的值
            $textarea.val(strinfo);
            // 选择textarea中的文本
            $textarea[0].select();
            // 将文本复制到剪贴板中
            document.execCommand("copy");
            // 删除textarea元素
            $textarea.remove();
            alert("恭喜您，复制成功！共计" + count + "条");
        }


        //复制需求
        window.copy = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            var strinfo = "";
            var username = $("#userMenu .user-name").text();
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var devname = $(item).find("td:eq(6)").text();
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(2)").find("span").text();
                    var xqTit = $(item).find("td:eq(4)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    if (devname == username && xqGrade == i) {
                        strinfo += "【" + xqId + "(" + xqGrade + ")" + devname + "组" + verstr + "】" + xqTit + "\r\n";
                        count += 1;
                    }
                });
            }
            // 创建一个隐藏的textarea元素
            const $textarea = $("<textarea>")
                .css({ position: "absolute", left: "-9999px" })
                .appendTo($("body"));
            // 设置textarea的值
            $textarea.val(strinfo);
            // 选择textarea中的文本
            $textarea[0].select();
            // 将文本复制到剪贴板中
            document.execCommand("copy");
            // 删除textarea元素
            $textarea.remove();
            alert("恭喜您，复制成功！共计" + count + "条");
        }


        //复制主任务
        window.copytasks = function () {
            var strinfo = "";
            var count = 0;
            $('.datatable.show-scroll-slide .c-name.text-left').each(function () {
                if ($(this).find('span').length === 0) {
                    console.log($(this).attr('title'));
                    strinfo += $(this).attr('title') + "\r\n";
                    count += 1;
                }
            });
            // 创建一个隐藏的textarea元素
            const $textarea = $("<textarea>")
                .css({ position: "absolute", left: "-9999px" })
                .appendTo($("body"));
            // 设置textarea的值
            $textarea.val(strinfo);
            // 选择textarea中的文本
            $textarea[0].select();
            // 将文本复制到剪贴板中
            document.execCommand("copy");
            // 删除textarea元素
            $textarea.remove();
            alert("恭喜您，复制成功！共计" + count + "条");
        }

        // 创建一个复制主任务按钮
        var copyTaskBtn =
            '<button onclick="copytasks()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">复制主任务</button>';
        if ($("a:contains('建任务')").length > 0) {
            $("a:contains('建任务')").parent().prepend(copyTaskBtn);
            $("#taskList th").eq(0).css({width:"110px"});
        }

        // 创建一个填充子任务按钮
        var btn =
            '<button onclick="tianchong()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">填充子任务</button>';
        if ($("h2:contains('批量建子任务')").length > 0) {
            $(".btn-toolbar.pull-right").prepend(btn);
        }

        // 创建一个获取需求按钮
        var btn2 =
            '<button onclick="copy()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">复制我的需求</button>';
        var btn3 =
            '<button onclick="copySelect()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">复制选中需求</button>';
        var btn4 =
            '<button onclick="copyActiveSelect()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">复制我激活需求</button>';
        if ($("a:contains('关联需求')").length > 0) {
            $("#stories .actions").prepend(btn2);
            $("#stories .actions").prepend(btn3);
            $("#stories .actions").prepend(btn4);
        }

        //加载计划是否有已经排了任务
        window.isJob = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            if ($("a:contains('关联需求')").length <= 0) {
                return;
            }
            var username = $("#userMenu .user-name").text();

            var strinfo = "";
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var devname = $(item).find("td:eq(6)").text();
                    if (devname != username) {
                        return;
                    }
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(2)").find("span").text();
                    var xqTit = $(item).find("td:eq(4)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    var xqUrl = $(item).find("td:eq(4)").find("a").attr("href").trim();
                    $(item).find("td:eq(4)").find("a").css('color', 'red');
                    if (xqGrade == i) {
                        $.get(xqUrl).then(function (res) {
                            let taskcount = $(res).find("div#legendProjectAndTask").find('ul').find("li");
                            if (taskcount.length > 0) {
                                var jobcount = false;
                                for (let i = 0; i < taskcount.length; i++) {
                                    if ($(taskcount[i]).find("a").length > 1) {
                                        jobcount = true;
                                    }
                                }
                                if (jobcount) {
                                    $(item).find("td:eq(4)").find("a").text("【已分配任务】" + xqTit);
                                }
                            }
                        });
                    }
                });
            }

        }

        isJob();
//新版禅道

        //复制我的激活的需求
        window.newcopyActiveSelect = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            var strinfo = "";
            var username = $("#userNav .user-profile-name").text();
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var devname = $(item).find("td:eq(7)").text();
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(4)").find("span").text();
                    var xqStatus = $(item).find("td:eq(5)").find("span").text().trim();
                    var xqTit = $(item).find("td:eq(2)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    if (devname == username && xqGrade == i && xqStatus != "草稿") {
                        strinfo += "【" + xqId + "(" + xqGrade + ")" + devname + "组" + verstr + "】" + xqTit + "\r\n";
                        count += 1;
                    }
                });
            }
            // 创建一个隐藏的textarea元素
            const $textarea = $("<textarea>")
                .css({ position: "absolute", left: "-9999px" })
                .appendTo($("body"));
            // 设置textarea的值
            $textarea.val(strinfo);
            // 选择textarea中的文本
            $textarea[0].select();
            // 将文本复制到剪贴板中
            document.execCommand("copy");
            // 删除textarea元素
            $textarea.remove();
            alert("恭喜您，复制成功！共计" + count + "条");
        }

        //复制选中需求
        window.newcopySelect = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            var strinfo = "";
            var username = $("#userNav .user-profile-name").text();
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var checked = $(item).find("td:eq(0)").find("input[type=checkbox]").prop("checked");
                    var devname = $(item).find("td:eq(7)").text();
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(4)").find("span").text();
                    var xqTit = $(item).find("td:eq(2)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    if (checked && xqGrade == i) {
                        strinfo += "【" + xqId + "(" + xqGrade + ")" + devname + "组" + verstr + "】" + xqTit + "\r\n";
                        count += 1;
                    }
                });
            }
            // 创建一个隐藏的textarea元素
            const $textarea = $("<textarea>")
                .css({ position: "absolute", left: "-9999px" })
                .appendTo($("body"));
            // 设置textarea的值
            $textarea.val(strinfo);
            // 选择textarea中的文本
            $textarea[0].select();
            // 将文本复制到剪贴板中
            document.execCommand("copy");
            // 删除textarea元素
            $textarea.remove();
            alert("恭喜您，复制成功！共计" + count + "条");
        }


        //复制需求
       window.newcopy = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            var strinfo = "";
            var username = $("#userNav .user-profile-name").text();
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var devname = $(item).find("td:eq(7)").text();
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(4)").find("span").text();
                    var xqTit = $(item).find("td:eq(2)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    if (devname == username && xqGrade == i) {
                        strinfo += "【" + xqId + "(" + xqGrade + ")" + devname + "组" + verstr + "】" + xqTit + "\r\n";
                        count += 1;
                    }
                });
            }
            // 创建一个隐藏的textarea元素
            const $textarea = $("<textarea>")
                .css({ position: "absolute", left: "-9999px" })
                .appendTo($("body"));
            // 设置textarea的值
            $textarea.val(strinfo);
            // 选择textarea中的文本
            $textarea[0].select();
            // 将文本复制到剪贴板中
            document.execCommand("copy");
            // 删除textarea元素
            $textarea.remove();
            alert("恭喜您，复制成功！共计" + count + "条");
        }

        // 创建一个获取需求按钮
        var newbtn2 =
            '<button onclick="newcopy()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">复制我的需求</button>';
        var newbtn3 =
            '<button onclick="newcopySelect()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">复制选中需求</button>';
        var newbtn4 =
            '<button onclick="newcopyActiveSelect()" style="background:#E80026;color: #fff;border: none;border-radius: 5px;padding: 7px 20px;margin-right:10px;float: left;">复制我激活需求</button>';
        if ($("a:contains('提研发需求')").length > 0) {
            $("#stories .actions").prepend(newbtn2);
            $("#stories .actions").prepend(newbtn3);
            $("#stories .actions").prepend(newbtn4);
        }

          window.newisJob = function () {
            if ($(".page-title .text").length <= 0 || $("tbody.sortable.text-center").find("tr").length <= 0) {
                return;
            }
            if ($("span:contains('提研发需求')").length <= 0) {
                return;
            }
            var username = $("#userNav .user-profile-name").text();

            var strinfo = "";
            var verstr = $(".page-title .text").text();
            var trdoms = $("tbody.sortable.text-center").find("tr");
            var count = 0;

            for (var i = 1; i <= 4; i++) {
                trdoms.each((index, item) => {
                    var devname = $(item).find("td:eq(7)").text();
                    if (devname != username) {
                        return;
                    }
                    var xqId = $(item).find("td:eq(0)").find("label").text();
                    var xqGrade = $(item).find("td:eq(4)").find("span").text();
                    var xqTit = $(item).find("td:eq(2)").find("a").text().replace(/【/g, " [").replace(/】/g, "] ").trim();
                    var xqUrl = $(item).find("td:eq(2)").find("a").attr("href").trim();

                    if (xqGrade == i) {
                        $.get(xqUrl).then(function (res) {
                            let taskcount = $(res).find("div#legendProjectAndTask").find('ul').find("li");
                            if (taskcount.length > 0) {
                                var jobcount = false;
                                for (let i = 0; i < taskcount.length; i++) {
                                    if ($(taskcount[i]).find("a").length > 1) {
                                        jobcount = true;
                                    }
                                }
                                if (jobcount) {
                                    $(item).find("td:eq(2)").find("a").text("【已分配任务】" + xqTit);
                                }
                            }
                        });
                    }
                });
            }

        }

        newisJob();
        /*逻辑结束*/

    };
})();
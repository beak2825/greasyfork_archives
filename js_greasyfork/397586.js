// ==UserScript==
// @name         刷课职教云
// @version      2.14.2
// @description  小巧强大的职教云刷课脚本,中文化自定义各项参数,解除作业区复制粘贴限制,一键提取题目,自动评论,智能讨论,软件定制
// @author        tuChanged
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @match       *.zjy2.icve.com.cn/common/*
// @match       *zjy2.icve.com.cn/common/*
// @match       *zjy2.icve.com.cn/study/homework*
// @match       *.zjy2.icve.com.cn/study/homework*
// @license      MIT
// @namespace https://greasyfork.org/users/449085
// @supportURL https://github.com/W-ChihC/SimpleIcveMoocHelper
// @contributionURL https://greasyfork.org/users/449085
// @downloadURL https://update.greasyfork.org/scripts/397586/%E5%88%B7%E8%AF%BE%E8%81%8C%E6%95%99%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/397586/%E5%88%B7%E8%AF%BE%E8%81%8C%E6%95%99%E4%BA%91.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const setting = {
        // 随机评论,自行扩充格式如     "你好",     (英文符号)
        随机评论词库: ["老师讲的非常好，我非常喜欢","听君一席话，胜读十年书",],
        //感谢@清酒不浊 提醒,策略改变,已只要求点击
        激活点即完: true,
        /*影响刷课速度关键选项,延时非最优解,过慢请自行谨慎调整*/
        最高延迟响应时间: 5000,//毫秒
        最低延迟响应时间: 3000,//毫秒
        //自行根据课件情况修改
        固定PPT页数: 10,//页
        //0-高清 1-清晰 2-流畅 3-原画
        //感谢tonylu00提供最新实测参数 --0-原画 1-高清 2-清晰 3-流畅
        视频清晰度: 3,
        //2倍速,允许开倍速则有效,请放心使用
        视频播放倍速: 2,
        //是否保持静音
        是否保持静音: true,
        //答题口令码/暗号
        口令码: "",
        //开启所有选项卡的评论,最高优先等级,打开该项会覆盖下面的细分设置,默认关闭(false),true为打开
        激活所有选项卡的评论: false,
        激活评论选项卡: true,
        激活问答选项卡: false,
        激活笔记选项卡: false,
        激活报错选项卡: false,
        //和以上设置保持同步
        未做兼容课件打开评论: false,
        //在完成课件之前打开评论,
        激活提前评论: false

        /*
        * 📣如果您有软件定制(管理系统,APP,小程序等),毕设困扰,又或者课程设计困扰等欢迎联系,
        *    价格从优,源码调试成功再付款💰,
        *     实力保证,包远程,包讲解 QQ:1801916171
        */

    }, _self = unsafeWindow,
        url = location.pathname,
        top = _self
    /** 等待获取jquery @油猴超星网课助手 wyn665817*/
    try {
        while (top != _self.top) top = top.parent.document ? top.parent : _self.top;
    } catch (err) {
        console.log(err);
        top = _self;
    }
    let $ = _self.jQuery || top.jQuery;
    let commentDelay = 0

    /** */
    //产生区间随机数
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    //跳转下一页
    // let nextCourse = () => $(".next").click();
    const lessonID = getQueryValue("cellId")
    console.log(`当前课程ID: ${lessonID}`);
    //脚本处理入口函数,仅运行一次
    delayExec(async () => {
        //入口
        switch (url) {
            //课件区
            case "/common/directory/directory.html":
                openMenu()
                await delayExec(async () => {
                    await expandDir();
                    console.log("目录全展开.");

                })
                await delayExec(() => {
                    locateCurrentLocation()
                })
                handleCurrentLesson();
                break;
            //作业区
            case "/study/homework/preview.html":
            case "/study/homework/do.html":
                homeworkHandler()
                break;
            // default
        }
        console.log(`脚本已启动 当前位置:${url}`);
    })

    //当前页
    let current;

    //处理当前选中的课程
    async function handleCurrentLesson() {
        //打开课程列表
        openMenu()
        //main函数
        setTimeout(async () => {
            //当前小节
            current = $(".np-section-level-3.active");
            //跳到第一页
            if (current.length == 0) {
                console.log(current);
                current = $($(".np-section-level-3")[0])
            }
            // //当前已完成直接开始下一轮
            // if (isFinshed(current)) {
            //     check(current.next());
            //     return
            // }

            if (setting.激活点即完) {
                delayExec(commentHandler(current))
                return
            } else {
                //当前小节课程的类别
                let type = current.children(".np-section-type").text().trim()
                switch (type) {
                    case "图片":
                    case "文档":
                        docHandler(current)
                        break;
                    case "ppt":
                        pptHandler(current)
                        break;
                    case "swf":
                        swfHandler(current)
                        break;
                    case "视频":
                    case "音频":
                        mediaHandler(current)
                        break;
                    case "图文":
                    case "压缩包":
                        emptyHandler(current)
                        break;
                    case "":
                        check(current.next())
                        break;
                    default:
                        console.log(`课件 : ${type} 未提供兼容, ${setting.未做兼容课件打开评论 ? '已开启兼容评论,仅运行评论' : '已跳过处理'},请在github issue(https://github.com/W-ChihC/SimpleIcveMoocHelper)反馈该日志,与作者取得联系`);
                        check(current.next())
                        break
                }
                console.log(`当前 ${type} 安排完成,等待执行结果中`);
            }
        }, 5000);
    }

    /**
        * 递归遍历目录树
        */
    async function check(currentInner) {
        //多级跳转
        if (currentInner.length == 0) {
            // current.end();
            //往树根遍历
            //小章节
            let parent = current.closest(".np-section-level-2");
            if (parent.next().length == 0) {
                //大章
                let ancestor = parent.closest(".np-section-level-1")
                //检测是否到终章
                if (ancestor.next().length == 0) {
                    alert("任务完成");
                    //关闭当前窗口
                    // closeTab();
                } else {
                    // first 进来后 next后导致空出一个
                    check(ancestor.next().find(".np-section-level-3").first());
                }
            } else {
                check(parent.next().find(".np-section-level-3").first())
            }
            return;
        }
        //查询下一项所属类别
        switch (currentInner.children(".np-section-type").text().trim()) {
            case "swf":
            case "ppt":
            case "视频":
            case "文档":
            case "图片":
            case "图文":
            case "压缩包":
            case "音频":
                await delayExec(() => gotoUrl(currentInner))
                handleCurrentLesson()
                break
            case "":
                await delayExec(() => gotoUrl(currentInner.next()))
                handleCurrentLesson()
                break
            default:
                await delayExec(() => gotoUrl(currentInner.next()))
                handleCurrentLesson()
        }
    }



    /**
     * 使用异步实现
     *
     *  随机延迟执行方法
     * @param {需委托执行的函数} func
     */
    //评论限制时间
    function delayExec(func) {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    await func()
                } catch (error) {
                    console.log(func, error);
                }
                resolve();
            }, rnd(commentDelay || setting.最低延迟响应时间, commentDelay || setting.最高延迟响应时间));
        })
    }
    //手动加锁 防止递归失败请求数太多导致封禁
    let block = false;
    //跳转到某小节 通过顶栏
    function gotoUrl(page) {
        if (block) {
            alert('异步处理异常')
            while (true) console.log("程序运行异常");
        }
        block = true
        page.click()
        block = false
        // resovle()
    }
    //打开菜单
    const openMenu = () => {
        //关闭窗口
        if ($('.popBox').length !== 0) {
            $($('.popBox a')[1]).click()
        }
        $(".sildeDirectory").click();
    }
    /**
     * 获取url查询字段
     * @param {查询字段} query
     */
    function getQueryValue(query) {
        let url = window.location.search; //获取url中"?"符后的字串
        let theRequest = new Object();
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for (let i = 0; i < strs.length; i++)
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
        return theRequest[query];
    }
    /**
     * 找到从课程列表进来点击的位置
     * @param {*} id
     */
    function locateCurrentLocation() {

        $('.np-section-level-3.cellClick').each((i, e) => {
            let x = $(e)
            if (x.data().cellid === lessonID) {
                console.log(lessonID, e);
                x.click()
                return false
            }
        })
        // console.log($('.np-section-level-3.cellClick').length);

    }


    /**
     * 异步展开全目录
     */
    function expandDir() {
        return new Promise((resolve, reject) => {
            let root = $(".np-section-level-1 .np-section-title");
            let endFlag = 0
            root.each(async (i1, e1) => {
                $(e1).click()
                //fix 空大章节
                if ($(e1).children().length == 0) {
                    endFlag++
                }
                await delayExec(async () => {
                    $(e1).next("ol").find(".np-section-level-2 a").each(async (i2, e2) => {
                        await delayExec(async () => {
                            $(e2).click()
                            //执行完成
                            if (i1 === endFlag) {
                                resolve()
                            }
                        })
                    })
                })
            })
        })
    }



    /**
     * 仅仅评论的处理器
     * @param {*} current
     */
    async function emptyHandler(current) {
        if (setting.激活提前评论) {
            delayExec(commentHandler(current));
            return
        }
        await delayExec(commentHandler(current))
    }

    async function swfHandler(current) {
        if (setting.激活提前评论) {
            delayExec(commentHandler(current));
            return
        }
        //当不支持flash时执行
        if ($('.popBox').length !== 0) {
            $($('.popBox a')[1]).click()
        }
        await delayExec(commentHandler(current))
    }

    /**
     * 视频/音频类处理
     */
    function mediaHandler(current) {
        if (setting.激活提前评论) {
            delayExec(commentHandler(current));
            return
        }

        let player = top.jwplayer($(".jwplayer").attr("id"));

        //视频暂停状态
        if (player.getState() == "paused") {
            console.log("媒体已暂停,恢复播放");
            player.play()
        }

        //播放回调
        if (player.getState() == "complete") {
            console.log("媒体已播放完毕\n");
            delayExec(commentHandler(current));
            return;
        }
        //配置
        player.setMute(setting.是否保持静音)//静音
        player.setCurrentQuality(setting.视频清晰度)
        try {
            player.setPlaybackRate(setting.视频播放倍速)
        } catch (error) {
            console.log('倍速开启失败');
        }
        //播放回调
        player.on("playlistComplete", () => {
            console.log("媒体播放完成\n");
            delayExec(commentHandler(current));
        });
    }
    /**
     * 文档处理
     * @param {*} current
     */
    async function docHandler(current) {

        if (!setting.激活提前评论) {
            //随机秒后执行,避免不正常操作加载时间

            //根据按钮状态判断是否还有下一页
            while ($(".MPreview-pageNext").hasClass('current')) {
                console.log("文档翻页了");

                //ppt翻页 异步方式
                await delayExec(() => {
                    $(".MPreview-pageNext").click()
                })
            }
        }
        //提交评论?
        //随机延迟提交评论
        delayExec(commentHandler(current));
    }


    /**
     * PPT类别处理
     * 指定PPT点击次数(无法获取iframe无法判定是否完成)
     *  TODO 无法跨域获取iframe,暂未解决
     */
    async function pptHandler(current) {
        if (setting.激活提前评论) {
            delayExec(commentHandler(current));
            return
        }
        // 异步处理
        await new Promise(async (resolve, reject) => {
            for (let i = 1; i <= setting.固定PPT页数; i++) {
                //点击下一页
                await delayExec(() => {
                    $(".stage-next").click()
                    console.log(`ppt第${i}页`);
                    //达到次数解除阻塞
                    if (i == setting.固定PPT页数)
                        resolve()

                })
            }
        })

        //提交评论?
        //随机延迟提交评论
        delayExec(commentHandler(current));
    }


    /**
    * 处理评论
    *    并准备换页
    */
    async function commentHandler(current) {
        if (setting.激活评论选项卡 || setting.激活所有选项卡的评论)
            await submitComment(current)
        if (setting.激活笔记选项卡 || setting.激活所有选项卡的评论)
            await submitNote(current)
        if (setting.激活问答选项卡 || setting.激活所有选项卡的评论) {
            commentDelay = 60000
            await submitQuestion(current)

        }
        if (setting.激活报错选项卡 || setting.激活所有选项卡的评论) {
            commentDelay = 60000
            await submitReport(current)

        }
        console.log("完成评论环节");
        check(current.next())
    }
    /**
     * 评论
     */
    async function submitComment() {

        return new Promise(async (resolve, reject) => {
            if (isFinshed(".np-question-remove.commentDel")) {
                resolve()
                return
            }
            //评5星
            $("#star #starImg4").click();
            //随机从词库填写评论
            $(".commentContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
            //提交
            await delayExec(async () => {
                $("#btnComment").click();
                await delayExec(async () => {
                    $(".sgBtn.ok").click();
                    console.log("评论成功\n");
                    resolve()
                });
            });
        })

    }
    /**
     * 问答
     */
    async function submitQuestion() {
        await delayExec(() => {
            $($(".am-tabs-nav>li a")[1]).click()
        })
        commentDelay = 0
        return new Promise(async (resolve, reject) => {

            if (isFinshed(".np-question-remove.questionDel")) {
                resolve()
                return
            }


            //随机从词库填写评论
            $(".questionContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
            //提交
            await delayExec(async () => {
                $("#btnQuestion").click();
                await delayExec(async () => {
                    $(".sgBtn.ok").click();
                    console.log("评论成功\n");
                    resolve()
                });
            });

        })


    }
    /**
     * 笔记
     * @param  current
     */
    async function submitNote() {
        await delayExec(() => {
            $($(".am-tabs-nav>li a")[2]).click()
        })
        return new Promise(async (resolve, reject) => {
            if (isFinshed(".np-question-remove.noteDel")) {
                resolve()
                return
            }
            //随机从词库填写评论
            $(".noteContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
            //提交
            await delayExec(async () => {
                $("#btnNote").click();
                await delayExec(async () => {
                    $(".sgBtn.ok").click();
                    console.log("评论成功\n");
                    resolve()
                });
            });
        })
    }
    /**
     * 报错
     */
    async function submitReport() {
        await delayExec(() => {
            $($(".am-tabs-nav>li a")[3]).click()
        })
        commentDelay = 0
        return new Promise(async (resolve, reject) => {
            if (isFinshed(".np-question-remove.cellErrorDel")) {
                resolve()
                return
            }
            //随机从词库填写评论
            $(".cellErrorContent").text(setting.随机评论词库[rnd(0, setting.随机评论词库.length - 1)])
            //提交
            await delayExec(async () => {
                $("#btnCellError").click();
                await delayExec(async () => {
                    $(".sgBtn.ok").click();
                    console.log("评论成功\n");
                    resolve()
                });
            });
        })
    }


    /**
     * 判断当前页是否已经完成
     * @param {string} currentFlag
     */
    function isFinshed(currentFlag) {
        //防止对话框遮盖
        if ($('.popBox').length !== 0) {
            $($('.popBox a')[1]).click()
        }
        //在当前评论页已发现自己的评论,取消评论
        if ($(currentFlag).length !== 0) {
            console.log("已评论过了");
            return true
        }
        return false
    }
    /**
    * 提交讨论
    */
    function discussHandler() {
        setTimeout(() => {
            //获取上一位的评论  隔两个索引为评论  字数太少往下查找,避免太水
            let vaildComment = findVaildDiscuss();
            // //开启HTML输入模式
            // $EDITORUI["edui945"]._onClick();
            //填充评论
            $("iframe#ueditor_0").contents().find("body.view")[0].innerText = vaildComment;
            //提交
            delayExec(() => {
                $(".btn_replyTopic").click();
                console.log("讨论成功\n");
            }
            );
        }, 10000);
        /*  //返回上一页
        delayExec(() => window.history.go(-1)); */
    }

    /**
     * 简单地找出一个有效的讨论
     */
    function findVaildDiscuss() {
        let arr = $(".mc-learning-table  tbody tr div[id^='istext_']"), element;
        for (let i = 0; i < arr.length; i++) {
            element = arr[i].innerText;
            if (element.length > 10)
                return element;
        }
        return element;
    }
    /**
    * 提取当前页内容
    */
    function exactProblem() {
        const arr = $(".e-q-body");
        let text = "";

        for (let x = 0; x < arr.length; x++)
            text += arr[x].innerText;
        $("#_content").val(text);

    }
    /**
     * 提取题目
     */
    function floatHandler() {
        const div = `<div style="border:#42b983 solid 2px;width: 330px; position: fixed; top: 0; right: 10px;  z-index: 9999">
                            <button id="extract_btn">提取</button>
                            <hr/>
                            <textarea id="_content" style="width: 100%;height: 300px;border: #B3C0D1 solid 2px;overflow: auto;font-size: x-small" />
                        </div>`;
        $(div).appendTo('body')
        $("#extract_btn").bind('click', () => exactProblem())
    }

    /*
    *  解除文本限制
    */
    function uncageCopyLimit() {
        let arr = ["oncontextmenu", "ondragstart", "onselectstart", "onselect", "oncopy", "onbeforecopy"]
        for (let i of arr)
            $(".hasNoLeft").attr(i, "return true")
        console.log("已成功复制解除限制,📣如果您有软件定制(管理系统,APP,小程序等),毕设困扰,又或者课程设计困扰等欢迎联系,价格从优,源码调试成功再付款💰,实力保证,包远程,包讲解 QQ:1801916171")
    }
    /**
    * 作业处理
    */
    function homeworkHandler() {
        uncageCopyLimit()
        bindBtnToQuestion()
    }

})();
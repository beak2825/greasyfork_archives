// ==UserScript==
// @name        学习考试 - gzmtr.cc
// @namespace   Violentmonkey Scripts
// @match       http://edu.gzmtr.cc/*
// @grant       none
// @version     1.6
// @author      -
// @description 2019/11/22 下午10:11:01
// // @webRequest [{"selector":"http://*.gzmtr.cc/web/script/ocs/*","action":"cancel"}]
// @downloadURL https://update.greasyfork.org/scripts/392884/%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95%20-%20gzmtrcc.user.js
// @updateURL https://update.greasyfork.org/scripts/392884/%E5%AD%A6%E4%B9%A0%E8%80%83%E8%AF%95%20-%20gzmtrcc.meta.js
// ==/UserScript==
if (location.href.indexOf("trainProjectDetail") >= 0) {

    unsafeWindow.trainProjectDetailController = (function () {
        pageview = {
            "pageName": "pc-page-trainProject",
            "className": "trainProjectDetail",
            "trainProjectId": GetQueryString("trainProjectId"),
            "coursewareList": [],
            "projectMust": null,
            "projectSelect": null,
            "sewise_player": null,
            "limitRecords": true //限制添加学习记录请求次数
        }
        var _ocsServer = null;
        var _examServer = null;
        var _voteServer = null;

        function initSize(box) { //重置高度
            $(box || '.scroll-box').niceScroll().resize();
        };

        /*
         *加载数据
         */
        pageview.loadData = function () {
            var _self = pageview;
            logUtil.logMethodCalled("loadData", _self.className);
            _self.loadTrainProjectDetail();

        }

        /*
         *加载详情数据
         */
        pageview.loadTrainProjectDetail = function () {
            var _self = pageview;
            logUtil.logMethodCalled("loadTrainProjectDetail", _self.className);
            _self.loadProjectDetailData(); //加载详情数据
            _self.loadQuestionListData(); //加载调查问卷
            _self.loadProjectExamData(); //加载考试数据
            _self.loadCommentList(); //加载评论数据
        }

        //加载详情
        pageview.loadProjectDetailData = function () {
            var _self = pageview;
            logUtil.logMethodCalled("loadTrainProjectDetail", _self.className);
            var payLoadData = {};
            payLoadData.trainProjectId = _self.trainProjectId;
            _ocsServer.queryTrainProjectDetail(payLoadData,
                function (ret) {
                    _self.pagedata = ret;
                    $("#trainProjectName").html(ret.projectName);
                    _self.mergeWare(ret); //合并所有课程下的课件
                    _self.drawProjectInfo(ret); //渲染项目信息
                    _self.drawCourseInfo(ret); //渲染课程信息
                    _self.drawCourseWareInfo(ret); //渲染课程与课件信息
                    echo.init();
                });
        }

        //加载调查问卷
        pageview.loadQuestionListData = function () {
            var _self = pageview;
            logUtil.logMethodCalled("loadTrainProjectDetail", _self.className);
            var payLoadData = {};
            payLoadData.businessObjectId = _self.trainProjectId;
            _voteServer.getTrainVote(payLoadData,
                function (ret) {
                    var ret = ret || [];
                    $("#question-list").html(template("question-list-temp", {
                        rows: ret
                    }));
                },
                function (ret) {

                })

        }

        //加载考核要求
        pageview.loadProjectExamData = function () {
            var _self = pageview;
            logUtil.logMethodCalled("loadProjectExamData", _self.className);
            var payLoadData = {};
            payLoadData.trainProjectId = _self.trainProjectId;
            _examServer.getProjectExamData(payLoadData,
                function (ret) {
                    for (var i = 0; i < ret.length; i++) {
                        ret[i].trainProjectId = _self.trainProjectId;
                    }
                    $("#projectExam").html(template("projectExam-temp", {
                        rows: ret
                    }))
                })
        }

        /*
         *加载评论列表
         */

        pageview.loadCommentList = function (page, renderType) {
            var _self = pageview;
            logUtil.logMethodCalled("loadCommentList", _self.className);
            var payLoadData = {};
            var renderType = renderType || "html";
            payLoadData.courseId = _self.trainProjectId;
            payLoadData.page = page || 1;
            payLoadData.page_size = 6;
            _ocsServer.queryProjectComment(payLoadData,
                function (ret) {

                    _self.drawProjectComment(ret, renderType); //渲染评论列表
                })
        }

        /*
         *渲染项目信息
         */

        pageview.drawProjectInfo = function (ret) {
            var _self = pageview;
            logUtil.logMethodCalled("drawProjectInfo", _self.className);
            $("#project-info").html(template("project-info-temp", ret));

        }

        pageview.drawCourseInfo = function (ret) {
            var _self = pageview;
            logUtil.logMethodCalled("drawCourseInfo", _self.className);
            var learncount = 0;
            var mustCourseList = ret.tptTrainMustCourseRefForms || [];

            for (var i = 0; i < mustCourseList.length; i++) {
                var mi = mustCourseList[i];
                if (mi.isFinished == true) {
                    learncount++;
                }
            }

            var obj = {
                mustCourse: ret.tptTrainMustCourseRefForms || [],
                selectCourse: ret.tptTrainSelectCourseRefForms || [],
                mustNum: ret.tptTrainMustCourseRefForms.length,
                selectNum: ret.electiveDemandNum,
                allSelectNum: ret.tptTrainSelectCourseRefForms.length,
                learncount: learncount
            }
            $("#project-courseInfo").html(template("project-courseInfo-temp", obj));
        }

        pageview.drawCourseWareInfo = function (ret) {
            var _self = pageview;
            logUtil.logMethodCalled("drawCourseWareInfo", _self.className);
            var obj = {
                mustCourse: ret.tptTrainMustCourseRefForms || [],
                selectCourse: ret.tptTrainSelectCourseRefForms || [],
                mustNum: ret.requiredCourseTotal,
                selectNum: ret.electiveDemandNum,
                allSelectNum: ret.electiveCourseTotal
            }
            $("#project-courseware-list").html(template("project-courseware-temp", obj));

            if (ret && (obj.mustCourse.length != 0 || obj.selectCourse.length != 0)) {
                var coursewareList = _self.coursewareList;
                _self.coursewareId = coursewareList[0].coursewareId;
                _self.playType = coursewareList[0].playType;
                _self.courseware = coursewareList[0];
                _self.playCourseware(coursewareList[0]);
            } else {
                $("#" + _self.pageName + " [_ctrId='img-ctr']").show();
                var myImg = document.createElement("img");
                myImg.style.width = "100%";
                myImg.style.height = "100%";
                myImg.src = ret.trainThumbnailUrl;
                $("#" + _self.pageName + " [_ctrId='img-ctr']").html(myImg);
            }
        }

        /*
         *渲染评论列表
         */
        pageview.drawProjectComment = function (ret, renderType) {
            var _self = pageview;
            $("#project-comment-list")[renderType](template("project-comment-temp", ret));
            $("#" + _self.pageName + ' [_ctrId="commentCount"]').html("评论(" + ret.records + ")"); //更改评论数量
            $("#" + _self.pageName + ' [_action="loadMore"]').attr("page", ret.page);

            AppCommon.getUserPictureUrl("#" + _self.pageName + " [_ctrId='userImg']");

            $('.scroll-box').niceScroll().resize();
            if (ret.records == 0) {
                $(".notComment").show();
                $(".loading").hide();
                $(".noMore").hide();
            } else if (ret.page != 1 && ret.rows.length < 6) {
                $(".noMore").show();
                $(".loading").hide();
                $(".notComment").hide();

            } else if (ret.records != 0 && ret.records < 6) {
                $(".noMore").show();
                $(".loading").hide();
                $(".notComment").hide();
            } else {
                $(".loading").show();
                $(".notComment").hide();
                $(".noMore").hide();
            }
        }

        /*
         *合并所有课程下的课件
         */
        pageview.mergeWare = function (ret) {
            var _self = pageview;
            logUtil.logMethodCalled("mergeWare", _self.className);

            var pagedata = ret || {};
            var courseMustList = pagedata.tptTrainMustCourseRefForms || []; //必修课程
            var courseSelectList = pagedata.tptTrainSelectCourseRefForms || []; //选修课程
            var courseList = courseMustList.concat(courseSelectList);
            _self.coursewareList = [];

            for (var i = 0; i < courseList.length; i++) {
                _self.coursewareList = _self.coursewareList.concat(courseList[i].ocsCoursewareForms);
            }
        }

        /*
         *播放课件
         */
        pageview.playCourseware = function (courseware) {
            var _self = pageview;
            logUtil.logMethodCalled("playCourseware", _self.className);
            if (courseware) {
                // _self.startLearnTime(courseware);//开始计时
                _self.coursewareCountDown(courseware); //切换,开始倒计时
                _self.coursewareId = courseware.coursewareId;
                _self.playType = courseware.playType;
                _self.courseware = courseware; //保存当前课件,_self.courseware为切换之后的上一个课件
                $("#" + _self.pageName + " [coursewareId='" + courseware.coursewareId + "']").addClass("clickF6").siblings().removeClass("clickF6");
                $("#" + _self.pageName + " [_ctrId='video-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='docImg-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='longImg-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='html5-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='scrom-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='url-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='flash-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='error-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='img-ctr']").hide();

                switch (_self.playType) {
                case "vedio":
                    {
                        if (_self.hasFlash()) {
                            $("#" + _self.pageName + " [_ctrId='video-ctr']").show();
                            _self.playVideo(courseware)
                        } else {
                            $("#" + _self.pageName + " [_ctrId='flash-ctr']").show();
                        }
                        break;
                    }
                case "docImg":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'docImg-ctr']").show();
                        _self.playDocImg(courseware);
                        break;
                    }

                case "longImg":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'longImg-ctr']").show();
                        _self.playLongImg(courseware);
                        break;
                    }
                case "h5":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'html5-ctr']").show();
                        _self.playH5(courseware);
                        break;
                    }
                case "scorm":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'scorm-ctr']").show();
                        _self.playScorm(courseware);
                        break;
                    }
                case "url":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'url-ctr']").show();
                        _self.playUrl(courseware);
                        break;
                    }
                case "liveurl":
                    {
                        $("#" + _self.pageName + " [_ctrId='liveurl-ctr']").show();
                        _self.playLiveUrl(courseware);
                    }
                }
            }
        }

        /*
         *初始化播放器
         */
        pageview.initVideo = function () {
            var _self = pageview;
            var config = {
                elid: 'video-ctr',
                // 展现视频的div
                autostart: true,
                type: 'm3u8',
                logo: '/',
                url: "http://edu.gzmtr.cc/vupload/data/userdata/vod/transcode/201804/_zb.flv.m3u8",
                // 当前视频资源
                skin: 'vodWhite'
            };
            _self.sewise_player = new Sewise.SewisePlayer(config);
            _self.sewise_player.startup(); //启动播放器
        }

        /*
         *播放视频
         */
        pageview.playVideo = function (courseware) {
            var _self = pageview;
            $(".play-content").css("height", "");
            if (_self.sewise_player == null) {
                _self.initVideo();
            }

            var time = 1 * 1000;
            var idx = setInterval(function () {
                    if (typeof (Sewise) != 'undefined') {
                        clearInterval(idx);
                        var url = courseware.hlsUrl;

                        _self.sewise_player.toPlay(url, courseware.coursewareName, 0, true);
                        _self.sewise_player.on('start',
                            function () {
                                _self.beginTime = new Date();
                            });
                        _self.sewise_player.on('pause',
                            function () {
                                _self.addLearningRecords();
                                _self.beginTime = null;
                            });
                    }
                },
                time);

            var interval = setInterval(function () {
                    if (typeof _self.sewise_player != 'undefined') {
                        var PlayTime = _self.sewise_player.playTime();
                        var allTime = _self.sewise_player.duration();
                        var leftover = allTime - PlayTime; //还剩下多少秒
                        if (leftover <= 0.5) {
                            PlayTime = allTime;
                            clearInterval(interval);
                            //播放结束添加学习记录
                            _self.addLearningRecords();
                        }
                    }
                    var d = new Date();
                    $('.sewise-player-ui .topbar-clock').html(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
                },
                1000)
        }

        /*
         *播放docImg
         */

        pageview.playDocImg = function (courseware) {
            var _self = pageview;
            var imgHtml = "";
            var docImg = [];
            var html = '<div class="tn3-my-gallery">' + '<div class="tn3 album">' + '<ol _ctrId = "docImg-temp"></ol>' + '</div>' + '</div>';
            $("#" + _self.pageName + " [_ctrId='docImg-ctr']").html(html);
            for (var i = 0; i < courseware.docPictureNumber; i++) {
                docImg.push(courseware.docPictureUrl.replace("@", i));
                imgHtml += "<li><a href='" + docImg[i] + "'><img src='" + docImg[i] + "'/></a></li>"
            }
            $("#" + _self.pageName + " [_ctrId='docImg-temp']").html(imgHtml);
            _self.initDocImg();
        }

        /*
         *播放长图
         */

        pageview.playLongImg = function (courseware) {
            // $(".play-content").css("height","auto");
            var myImg = document.createElement("img");
            myImg.style.width = "100%";
            myImg.src = courseware.longPictureUrl;
            $("#longImg-ctr").html(myImg);

        }

        /*
         *播放html
         */
        pageview.playH5 = function (courseware) {
            $(".play-content").css("height", "auto");
            var h5Iframe = document.createElement("iframe");
            h5Iframe.src = courseware.h5Url;
            h5Iframe.style.width = "100%";
            h5Iframe.style.height = "530px";
            $("#html5-ctr").html(h5Iframe);
        }

        /*
         *播放scrom类型
         */
        pageview.playScorm = function (courseware) {
            $(".play-con").css("height", "auto");
            var scormIframe = document.createElement("iframe");

            scormIframe.src = courseware.scormUrl;
            scormIframe.style.width = "100%";
            scormIframe.style.height = "530px";

            $("#scorm-ctr").html(scormIframe);
        }

        /*
         * 播放外链课件
         * */
        pageview.playUrl = function (courseware) {
            $(".play-content").css("height", "auto");
            var urlIframe = document.createElement("iframe");

            urlIframe.src = courseware.fileUrl;
            urlIframe.style.width = "100%";
            urlIframe.style.height = "530px";

            $("#url-ctr").html(urlIframe);
        }

        /*
         *初始化多张图片控件
         */
        pageview.initDocImg = function () {
            $('.tn3-my-gallery').tn3({
                skinDir: "skins",
                imageClick: "fullscreen",
                width: 847,
                height: 477,
                image: {
                    maxZoom: 1.5,
                    crop: true,
                    clickEvent: "dblclick",
                    transitions: [{
                        type: "blinds"
                    }, {
                        type: "grid"
                    }, {
                        type: "grid",
                        duration: 460,
                        easing: "easeInQuad",
                        gridX: 1,
                        gridY: 8,
                        sort: "random",
                        sortReverse: false,
                        diagonalStart: "bl",
                        method: "scale",
                        partDuration: 360,
                        partEasing: "easeOutSine",
                        partDirection: "left"
                    }]
                }
            });
        }

        /*
         *根据课件id获取课件
         */

        pageview.getCourseware = function (coursewareId) {
                var _self = pageview;
                var courseware = null;
                var coursewareList = _self.coursewareList;
                $(coursewareList).each(function (index, value) {
                    if (value.coursewareId == coursewareId) {
                        courseware = value;
                    }
                });
                return courseware;
            }
            /*
             *初始化事件
             */
        pageview.initEvent = function () {
            var _self = pageview;
            logUtil.logMethodCalled("initEvent", _self.className);

            $("#" + _self.pageName).on("click", "[_action]",
                function (e) {
                    var action = $(this).attr("_action");
                    switch (action) {
                    case "playCourseWare":
                        {

                            var coursewareId = $(this).attr("_coursewareId");
                            var courseware = _self.getCourseware(coursewareId);

                            if (_self.coursewareId == courseware.coursewareId) {

                                return;
                            }
                            if (_self.timer && _self.courseware.isFinished == false) {
                                if (window.confirm("当前课件未学完，是否更换课件学习？")) {
                                    var learnSecond = _self.courseware.learnSecond; //标准学时
                                    var learningSecond = (learnSecond * 1 - _self.time * 1); //当前课件已学学时
                                    var data = {};
                                    var beginTime = new Date(); //当前时间
                                    var endTime = new Date(beginTime.getTime() + learningSecond * 1000); //当前时间往后
                                    data.coursewareId = _self.coursewareId;
                                    data.beginTime = beginTime;
                                    data.endTime = endTime;
                                    _self.addLearningRecords(data);
                                    _self.playCourseware(courseware);
                                }
                            } else {
                                _self.playCourseware(courseware);
                            }

                            break;
                        }
                    case "submitComment":
                        { //提交评论或者回复
                            var commentId = $(this).attr("commentId");
                            if (commentId) {
                                var data = {};
                                data.parentCommentId = $(this).attr("commentId");
                                data.courseId = _self.trainProjectId;
                                data.content = $(this).siblings("textarea").val();
                                if (data.content == "") {
                                    alert("评论内容不能为空!");
                                    return;
                                }
                                _self.submitCommentReply(data);
                            } else {
                                var data = {};
                                data.courseId = _self.trainProjectId;
                                data.content = $("#" + _self.pageName + ' [_action="content"]').val();
                                if (data.content == "") {
                                    alert("评论内容不能为空!");
                                    return;
                                }
                                _self.submitComment(data);
                            }
                            break;
                        }
                    case "deleteComment":
                        { //删除评论
                            var data = {};
                            data.commentId = $(this).attr("commentId");
                            _self.deleteCourseComment(data);
                            break;
                        }
                    case "showReplyDraw":
                        { //显示回复框
                            $(this).parent().parent().next().show();
                            break;
                        }
                    case "hideReplyDraw":
                        { //隐藏回复框
                            $(this).parent().hide();
                            break;
                        }
                    case "loadMore":
                        { //查看更多评论
                            var page = $(this).attr("page") ? $(this).attr("page") * 1 + 1 : 2;
                            _self.loadCommentList(page, 'append');
                            $(this).attr("page", page);
                            break;
                        }
                    case "toVote":
                        {
                            var jqId = $(this).attr("_jqId");
                            var payLoadData = {
                                jqId: jqId
                            }
                            _voteServer.postVoteCheck(payLoadData,
                                function (ret) {
                                    window.location.href = Global.pcContextPath + "/vote/vote.html?jqId=" + jqId;
                                },
                                function (ret) {
                                    var res = JSON.parse(ret.responseText);
                                    if (res.code == 'BAD_REQUEST') {
                                        alert(res.message);
                                    }
                                });
                            break;
                        }
                    case "leave":
                        {
                            if (_self.timer) {
                                if (window.confirm("当前课件未学完,是否离开？")) {
                                    var href = $(this).attr("href");
                                    var learnSecond = _self.courseware.learnSecond; //标准学时
                                    var learningSecond = (learnSecond * 1 - _self.time * 1); //当前课件已学学时
                                    var data = {};
                                    var beginTime = new Date(); //当前时间
                                    var endTime = new Date(beginTime.getTime() + learningSecond * 1000); //当前时间往后
                                    data.coursewareId = _self.coursewareId;
                                    data.beginTime = beginTime;
                                    data.endTime = endTime;
                                    _self.addLearningRecords(data, href);
                                    return false;
                                } else {
                                    return false;
                                }
                            } else {
                                return true;
                            }
                            break;
                        }
                    }
                })

            // $("#"+_self.pageName+" .navs a").click(function(){
            //     _self.startLearnTime(_self.courseware);
            //     return true;
            // });
        }

        /*
         *提交评论
         */
        pageview.submitComment = function (data) {
            var _self = pageview;
            data.commentCourseType = 'trainProject';
            _ocsServer.submitComment(data,
                function (ret) {
                    $("#" + _self.pageName + ' [_action="content"]').val(""); //制空文本框
                    alert("评论成功!");
                    _self.loadCommentList();
                })
        }

        /*
         *删除评论
         */
        pageview.deleteCourseComment = function (data) {
            var _self = pageview;
            _ocsServer.deleteCourseComment(data,
                function (ret) {
                    _self.loadCommentList();
                })
        }

        /*
         *提交回复
         */
        pageview.submitCommentReply = function (data) {
            var _self = pageview;
            _ocsServer.submitCommentReply(data,
                function (ret) {
                    alert("评论成功!");
                    _self.loadCommentList();
                })

        }

        //1.已学完则不倒计时
        //2.未学完开始倒计时
        // 开始多图或者长图课件学时倒计时
        pageview.coursewareCountDown = function (courseware) {
            var _self = pageview;
            var type = courseware.playType;
            var isFinished = courseware.isFinished; //是否学完
            var learncount = courseware.learnSecond; //标准学时
            _self.time = learncount; //当前课件已学学时
            $("#" + _self.pageName + " [_ctrId='countDown']").html("");
            if (type == 'docImg' || type == 'longImg') {
                if (isFinished) {
                    //已学完
                    $("#" + _self.pageName + " [_ctrId='countDown']").html("当前课件:<b>已学完</b>(注：若未学完直接关闭浏览器将不记录学时)");
                    clearInterval(_self.timer);
                    _self.timer = null;
                } else {
                    //未学完，开启倒计时
                    if (_self.timer) {
                        clearInterval(_self.timer);
                        _self.timer = null;
                    }
                    _self.timer = setInterval(function () {
                            if (_self.time == 0) {
                                clearInterval(_self.timer);
                                _self.timer = null;
                                var beginTime = new Date();
                                var endTime = new Date(beginTime.getTime() + (learncount * 1000));
                                var data = {};
                                data.coursewareId = courseware.coursewareId;
                                data.beginTime = beginTime;
                                data.endTime = endTime;
                                _self.addLearningRecords(data);
                                $("#" + _self.pageName + " [_ctrId='countDown']").html("当前课件:<b>已学完</b>(注：若未学完直接关闭浏览器将不记录学时)");
                                alert("当前课件已学完!")
                            } else {
                                _self.time--;
                                $("#" + _self.pageName + " [_ctrId='countDown']").html("剩余学时:<b>" + _self.time + "秒</b>(注：若未学完直接关闭浏览器将不记录学时)");
                            }
                        },
                        1000);
                }
            } else if (type == "h5" || type == "url") {
                var beginTime = new Date();
                var endTime = new Date(beginTime.getTime() + (learncount * 1000));
                var data = {};
                data.coursewareId = courseware.coursewareId;
                data.beginTime = beginTime;
                data.endTime = endTime;
                _self.addLearningRecords(data);
            } else {
                clearInterval(_self.timer);
                _self.timer = null;
            }
        }

        /*
         *开始计时添加学习记录
         */
        /*
            pageview.startLearnTime = function(courseware){
                var _self = pageview;
                var type = courseware.playType;
                var intervalTime = (type == 'docImg' || type == 'h5') ? 20000 : 10000;
                var oldIntervalTime = (_self.playType == "docImg" || _self.playType == "h5") ? 20000 : 10000;//上一条课件类型
                var data = {};
        
                if(_self.timer && _self.playType != "vedio"){
                    //清除上一个定时器，并添加上一个课件的学习记录
                    clearInterval(_self.timer);
                    var beginTime = new Date();//当前时间
                    var endTime = new Date(beginTime.getTime() + oldIntervalTime);//当前时间往后
                    data.coursewareId = _self.coursewareId;
                    data.beginTime = beginTime;
                    data.endTime = endTime;
                    _self.addLearningRecords(data);
                }
        
                if(type == "vedio" || type == "url" || type == "scorm") {
                    if(type == "url"){
                        //如果是外链课件，点击则表示已学完
                        var beginTime = new Date();//当前时间
                        var endTime = new Date(beginTime.getTime() + courseware.learnSecond * 1000);//当前时间往后
                        data.coursewareId = courseware.coursewareId;
                        data.beginTime = beginTime;
                        data.endTime = endTime;
                        _self.addLearningRecords(data);
                    }
                    return;//视频类型不需要定时
                }
                _self.timer = setInterval(function(){
                    var beginTime = new Date();//当前时间
                    var endTime = new Date(beginTime.getTime() + intervalTime);//当前时间往后
        
                    data.coursewareId = courseware.coursewareId;
                    data.beginTime = beginTime;
                    data.endTime = endTime;
        
                    _self.addLearningRecords(data);
                },intervalTime);
            }
        */

        /*
         *添加学习记录
         */
        pageview.addLearningRecords = function (ndata, href) {
            logUtil.logMethodCalled("_addLearningRecords", "courseDetail");
            var _self = pageview;
            var data = ndata || {
                coursewareId: pageview.coursewareId,
                beginTime: new Date(new Date() - (pageview.courseware.playType == "docImg" ? pageview.courseware.learnSecond : pageview.sewise_player.duration()) * 1000),
                endTime: new Date()
            }
            if (data.coursewareId && data.beginTime && data.endTime && _self.limitRecords == true) {
                _self.limitRecords = true;
                _ocsServer.addLearningRecords(data,
                    function (ret) {
                        _examServer.patchExamResult({
                                id: _self.trainProjectId
                            },
                            function (ret) {
                                if (href) {
                                    setTimeout(function () {
                                            location.href = href;
                                        },
                                        1000)
                                }
                            });
                        setTimeout(function () {
                                _self.limitRecords = true;
                            },
                            3000)
                    },
                    function (ret) {
                        setTimeout(function () {
                                _self.limitRecords = true;
                            },
                            3000)
                    });
            }
        }
        pageview.addLearningRecords1 = function (ndata, href) {


            var ret = pageview.coursewareList[i]
                // var ret = pageview.coursewareList
            var data = {
                coursewareId: ret.coursewareId,
                beginTime: new Date(new Date() - (ret.learnSecond) * 1000),
                endTime: new Date()
            };


            logUtil.logMethodCalled("_addLearningRecords", "courseDetail");
            var _self = pageview;
            var ret = pageview.coursewareList[_self.success]
            var data = ndata || {
                coursewareId: ret.coursewareId,
                beginTime: new Date(new Date() - (ret.learnSecond + 0.5) * 1000),
                endTime: new Date()
            }
            if (data.coursewareId && data.beginTime && data.endTime && _self.limitRecords == true) {
                _self.limitRecords = true;
                _ocsServer.addLearningRecords(data,
                    function (ret) {
                        _examServer.patchExamResult({
                                id: _self.trainProjectId
                            },
                            function (ret) {
                                if (href) {
                                    setTimeout(function () {
                                            location.href = href;
                                        },
                                        1000)
                                }
                            });
                        setTimeout(function () {
                                _self.limitRecords = true;
                                _self.success += 1;
                                $(".count").text(_self.success + "/" + _self.count);
                                if (_self.success < _self.count) {
                                    _self.addLearningRecords1();
                                }
                            },
                            10)
                    },
                    function (ret) {
                        setTimeout(function () {
                                _self.limitRecords = true;
                            },
                            10)
                    });
            }
        }

        /*
         *初始化templateHelper
         */
        pageview.initTemplateHelper = function () {
            var _self = pageview;
            logUtil.logMethodCalled("initTemplateHelper", _self.className);
            template.helper('filterNum',
                function (num) {
                    var array = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', "十七", "十八", "十九", "二十", "二十一"];
                    return array[num];
                });
            template.helper('fileFormat',
                function (value) {
                    switch (value) {
                    case 'mp4':
                        return "iconfont-shipin font-color-blue01";
                    case 'pdf':
                        return "iconfont-pdf font-color-red01";
                    case 'doc':
                        return "iconfont-doc1 font-color-blue01";
                    case 'txt':
                        return "iconfont-txt font-color-blue01";
                    case 'ppt':
                        return "iconfont-ppt font-color-red01";
                    case 'docx':
                        return "iconfont-docx font-color-red01";
                    case 'zip':
                        return "iconfont-zip font-color-red01";
                    case 'xls':
                        return "iconfont-xls font-color-red01";
                    case 'xlsx':
                        return "iconfont-xlsx font-color-red01";
                    case 'pptx':
                        return "iconfont-pptx font-color-red01";
                    case 'png':
                        return "iconfont-png font-color-red01";
                    case 'exl':
                        return "iconfont-exl1 font-color-red01";
                    case 'jpg':
                        return "iconfont-jpg font-color-red01";
                    case 'mov':
                        return "iconfont-mov font-color-red01";
                    case 'avi':
                        return "iconfont-avi font-color-red01";
                    }
                });

            template.helper('timeFormat',
                function (time) {
                    if (time >= 3600) {
                        return dateUtil.secondToTimeFormat(time, "hh时mm分ss秒");
                    } else if (time >= 60) {
                        return dateUtil.secondToTimeFormat(time, "mm分ss秒");
                    } else {
                        return dateUtil.secondToTimeFormat(time, "ss秒");
                    }
                })

            template.helper("replaceStr",
                function (str) {
                    var newStr = str || "";

                    return newStr.replace(/<.+?>/g, '');
                })

            template.helper("dateFormat",
                function (time) {
                    return dateUtil.dateFormat(time, "YYYY-MM-DD");
                })

            template.helper("learnTimeFormat",
                function (value) {
                    return dateUtil.secondToTimeFormat(value, "mm:ss");
                })
        }

        /*
         *检测是否安装或者启用flash插件。
         */
        pageview.hasFlash = function () {
            var hasFlash = 0; //是否安装了flash
            var flashVersion = 0; //flash版本
            //IE浏览器
            if ("ActiveXObject" in window) {
                try {
                    var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    hasFlash = 1;
                    VSwf = swf.GetVariable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                } catch (e) {

                }

                //非IE浏览器
            } else {
                try {
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        var swf = navigator.plugins["Shockwave Flash"];
                        if (swf) {
                            hasFlash = 1;
                            var words = swf.description.split(" ");
                            for (var i = 0; i < words.length; ++i) {
                                if (isNaN(parseInt(words[i]))) continue;
                                flashVersion = parseInt(words[i]);
                            }
                        }
                    }
                } catch (e) {

                }
            }

            return hasFlash;

        }

        /*
         *初始化
         */
        pageview.init = function (ocsServer, examServer, voteServer) {
            var _self = pageview;
            logUtil.logMethodCalled("init", _self.className);

            try {
                _ocsServer = ocsServer;
                _examServer = examServer;
                _voteServer = voteServer;
                _self.loadData();
                _self.initEvent();
                _self.initTemplateHelper();
            } catch (ex) {

            }
        }

        return {
            init: pageview.init
        };

    })();
    console.log(1)
}
if (location.href.indexOf("courseDetail") >= 0) {
    unsafeWindow.CourseDetailController = (function () {
        pageview = {
            pageName: "pc-page-courseDetail",
            courseId: GetQueryString("courseId"),
            trainProjectId: GetQueryString("trainProjectId") || '',
            pageData: null,
            firstInitDocImg: true,
            sewise_player: null,
            coursewareId: null,
            beginTime: null,
            endTime: null,
            timer: null,
            playType: null,
            courseware: null,
            limitRecords: true //限制添加学习记录请求次数
        }

        function initSize(box) { //重置高度
            $(box || '.scroll-box').niceScroll().resize();
        };

        /**
         * 绑定事件
         */
        pageview.bindEvent = function () {
            var _self = pageview;
            $("#" + _self.pageName).on("click", "[_action]",
                function (e) {

                    var action = $(this).attr("_action");
                    switch (action) {
                    case "playCourseWare":
                        {
                            var coursewareId = $(this).attr("coursewareId");
                            var courseware = _self.getCourseware(coursewareId);
                            if (courseware.playType == 'liveurl') {
                                var time = new Date();
                                var beginTime = new Date((courseware.liveBeginTime || "").replace(/\-/g, '/'));
                                var endTime = new Date((courseware.liveEndTime || "").replace(/\-/g, '/'));
                                if (time < beginTime) {
                                    alert("直播还未开始!开始时间为:" + courseware.liveBeginTime);
                                } else if (time > endTime) {
                                    alert("直播已经结束!");
                                } else if (time > beginTime && time < endTime) {
                                    window.open(_self.liveurl);
                                }
                            } else {
                                if (_self.coursewareId == courseware.coursewareId) {
                                    return;
                                }
                                if (_self.timer) {
                                    if (window.confirm("当前课件未学完，是否更换课件学习？")) {
                                        var learnSecond = _self.courseware.learnSecond; //标准学时
                                        var learningSecond = (learnSecond * 1 - _self.time * 1); //当前课件已学学时
                                        var data = {};
                                        var beginTime = new Date(); //当前时间
                                        var endTime = new Date(beginTime.getTime() + learningSecond * 1000); //当前时间往后
                                        data.coursewareId = _self.coursewareId;
                                        data.beginTime = beginTime;
                                        data.endTime = endTime;
                                        _self.addLearningRecords(data);
                                        _self.playCourseware(courseware);
                                    }
                                } else {
                                    _self.playCourseware(courseware);
                                }
                            }
                            break;
                        }

                    case "praise":
                        {
                            var isPraise = $(this).attr('data-type') == "true" ? 1 : 0;
                            if (isPraise) {
                                _self.cencelCoursePraise();
                            } else {
                                _self.coursePraise();
                            }
                            break;
                        }
                    case "collection":
                        {
                            var isCollection = $(this).attr("data-type") == "true" ? 1 : 0;
                            if (isCollection) {
                                _self.cencelCourseCollection();
                            } else {
                                _self.courseCollection();
                            }
                            break;
                        }

                    case "submitComment":
                        { //提交评论或者回复
                            var commentId = $(this).attr("commentId");
                            if (commentId) {
                                var data = {};
                                data.parentCommentId = $(this).attr("commentId");
                                data.courseId = _self.courseId;
                                data.content = $(this).siblings("textarea").val();
                                if (data.content == "") {
                                    alert("评论内容不能为空!");
                                    return;
                                }
                                _self.submitCommentReply(data);
                            } else {
                                var data = {};
                                data.courseId = _self.courseId;
                                data.content = $("#" + _self.pageName + ' [_action="content"]').val();
                                if (data.content == "") {
                                    alert("评论内容不能为空!");
                                    return;
                                }
                                _self.submitComment(data);
                            }
                            break;
                        }

                    case "deleteComment":
                        { //删除评论
                            var data = {};
                            data.commentId = $(this).attr("commentId");
                            _self.deleteCourseComment(data);
                            break;
                        }
                    case "showReplyDraw":
                        { //显示回复框
                            $(this).parent().parent().next().show();
                            break;
                        }
                    case "hideReplyDraw":
                        { //隐藏回复框
                            $(this).parent().hide();
                            break;
                        }

                    case "loadMore":
                        { //查看更多评论
                            var page = $(this).attr("page") ? $(this).attr("page") * 1 + 1 : 2;
                            _self.renderCourseComment(page, 'append');
                            $(this).attr("page", page);
                            break;
                        }
                    case "openMoreTarget":
                        { //简介收起与展开事件
                            if ($(this).hasClass("icon-down")) {
                                $(this).removeClass("icon-down").addClass("icon-up");
                                $(this).siblings(".jianjie").addClass("line3");
                                initSize();
                            } else {
                                $(this).addClass("icon-down").removeClass("icon-up");
                                $(this).siblings(".jianjie").removeClass("line3");
                                initSize();
                            }
                            break;
                        }

                    case "tabChange":
                        { //简介与评论切换
                            $(this).addClass("active").siblings().removeClass("active");
                            var $index = $(this).index();
                            $(".tab-content-d>div").eq($index).show().siblings().hide();
                            break;
                        }

                    case "playLiveUrl":
                        {
                            if (_self.liveurl) {
                                var time = new Date();
                                var beginTime = new Date($(this).attr("data-beginTime").replace(/\-/g, '/'));
                                var endTime = new Date($(this).attr("data-endTime").replace(/\-/g, '/'));
                                if (time < beginTime) {
                                    alert("直播还未开始!开始时间为:" + $(this).attr("data-beginTime"));
                                } else if (time > endTime) {
                                    alert("直播已经结束!");
                                } else if (time > beginTime && time < endTime) {
                                    window.open(_self.liveurl);
                                }
                            } else {
                                alert("该地址不存在!");
                            }
                            break;
                        }
                    case "leave":
                        {
                            if (_self.timer) {
                                if (window.confirm("当前课件未学完,是否离开？")) {
                                    var href = $(this).attr("href");
                                    var learnSecond = _self.courseware.learnSecond; //标准学时
                                    var learningSecond = (learnSecond * 1 - _self.time * 1); //当前课件已学学时
                                    var data = {};
                                    var beginTime = new Date(); //当前时间
                                    var endTime = new Date(beginTime.getTime() + learningSecond * 1000); //当前时间往后
                                    data.coursewareId = _self.coursewareId;
                                    data.beginTime = beginTime;
                                    data.endTime = endTime;
                                    _self.addLearningRecords(data, href);

                                    return false;
                                } else {
                                    return false;
                                }
                            } else {
                                return true;
                            }

                            break;
                        }
                    }
                });

        }

        /**
         * 页面数据渲染初始化
         */
        pageview.pagesInit = function () {
            var _self = pageview;
            logUtil.logMethodCalled("_pagesInit", "courseDetail");
            _self.loadCourseDetailData();
            _self.renderCourseComment();
        };

        /*
         *获取详情数据
         */
        pageview.loadCourseDetailData = function () {
            var _self = pageview;
            logUtil.logMethodCalled("_loadCourseDetailData", "courseDetail");
            var payLoadData = {};
            payLoadData.courseId = _self.courseId;
            _server.queryCourseDetail(payLoadData,
                function (ret) {

                    //渲染课程详情
                    _self.pageData = ret;
                    _self.drawCourseInfo(ret); //渲染详情
                    // _self.drawCourseComment(ret);//渲染评论列表
                    _self.drawCourseWare(ret); //渲染课件列表
                },
                function (ret) {
                    $("#" + _self.pageName + " [_ctrId='video-ctr']").hide();
                    $("#" + _self.pageName + " [_ctrId='error-ctr']").show();
                    $(".more-target").hide();
                })
        }

        /*
         *渲染课程详情
         */

        pageview.drawCourseInfo = function (ret) {

            $("#courseDetailTitle").html(template("courseDetailTitleTplt", ret));
            $(".jianjie").html(ret.description || "");
            /*判断是否需要显示下拉框*/
        }

        /*
         *渲染课件列表
         */
        pageview.drawCourseWare = function (ret) {
            var _self = pageview;
            $("#CoursewareList").html(template("CoursewareListTplt", ret));

            if (ret) {
                var coursewareList = ret.coursewareList || [];
                _self.coursewareId = coursewareList[0].coursewareId;
                _self.courseware = ret.coursewareList[0];
                _self.playType = ret.coursewareList[0].playType;
                _self.playCourseware(coursewareList[0]);
            }
        }

        /*
         *播放课件
         */
        pageview.playCourseware = function (courseware) {
            var _self = pageview;
            logUtil.logMethodCalled("_playCourseware", "courseDetail");

            if (courseware) {
                if (_self.playType != 'live' && _self.playType != 'liveurl') {
                    // _self.startLearnTime(courseware);//开始计时
                    _self.coursewareCountDown(courseware); //切换,开始倒计时
                } else {
                    $("#" + _self.pageName + " [_ctrId='countDown']").hide();
                }
                _self.coursewareId = courseware.coursewareId;
                _self.playType = courseware.playType;
                _self.courseware = courseware;
                $("#" + _self.pageName + " [coursewareId='" + courseware.coursewareId + "']").addClass("clickF6").siblings().removeClass("clickF6");
                $("#" + _self.pageName + " [_ctrId='video-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='docImg-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='longImg-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='html5-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='scrom-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='error-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='url-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='flash-ctr']").hide();
                $("#" + _self.pageName + " [_ctrId='liveurl-ctr']").hide();
                switch (_self.playType) {
                case "vedio":
                    {
                        _self.playVideoOrLive(courseware, _self.playType);
                        break;
                    }
                case "live":
                    {
                        _self.playVideoOrLive(courseware, _self.playType);
                        break;
                    }
                case "docImg":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'docImg-ctr']").show();
                        _self.playDocImg(courseware);
                        break;
                    }

                case "longImg":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'longImg-ctr']").show();
                        _self.playLongImg(courseware);
                        break;
                    }
                case "h5":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'html5-ctr']").show();
                        _self.playH5(courseware);
                        break;
                    }
                case "scorm":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'scorm-ctr']").show();
                        _self.playScorm(courseware);
                        break;
                    }
                case "url":
                    {
                        $("#" + _self.pageName + " [_ctrId = 'url-ctr']").show();
                        _self.playUrl(courseware);
                        break;
                    }
                case "liveurl":
                    {
                        $("#" + _self.pageName + " [_ctrId='liveurl-ctr']").show();
                        _self.playLiveUrl(courseware);
                        break;
                    }
                }
            }
        }

        /*
         *获取课件
         */
        pageview.getCourseware = function (coursewareId) {
            var _self = pageview;
            logUtil.logMethodCalled("getCourseware", "courseDetail");
            var courseware = null;
            var pageData = _self.pageData || {};

            var coursewareList = pageData["coursewareList"] || [];

            $(coursewareList).each(function (index, value) {
                if (value.coursewareId == coursewareId) {
                    courseware = value;
                }
            });
            return courseware;
        }

        /*
         *初始化视频
         */
        pageview.initVideo = function (type) {
            var _self = pageview;
            var config = {
                elid: 'video-ctr',
                // 展现视频的div
                autostart: false,
                type: 'm3u8',
                logo: '/',
                url: Global.fileRootPath + "/vupload/data/userdata/vod/transcode/201804/_zb.flv.m3u8",
                // 当前视频资源
                skin: 'vodWhite'
            };
            if (type == 'live') {
                config.server = 'live'
            }
            _self.sewise_player = new Sewise.SewisePlayer(config);
            _self.sewise_player.startup(); //启动播放器
        }

        /*
         *播放直播
         */
        pageview.playVideoOrLive = function (courseware, type) {
            var _self = pageview;
            if (_self.hasFlash()) {
                $("#" + _self.pageName + " [_ctrId='video-ctr']").show();
                _self.playVideo(courseware, type);
            } else {
                $("#" + _self.pageName + " [_ctrId='flash-ctr']").show();
            }

        }

        /*
         *播放外链直播
         */
        pageview.playLiveUrl = function (courseware) {
            var _self = pageview;
            _self.liveurl = courseware.liveUrl;
            $("#" + _self.pageName + " [_action='playLiveUrl']").attr("data-beginTime", courseware.liveBeginTime);
            $("#" + _self.pageName + " [_action='playLiveUrl']").attr("data-endTime", courseware.liveEndTime);
            var imgurl = _self.pageData.courseThumbnailUrl;
            $("#liveurl-ctr").css({
                "background": "url('" + imgurl + "') no-repeat center top",
                "background-size": "160%",
                "height": "530px"
            });
        }

        /*
         *播放视频
         */
        pageview.playVideo = function (courseware, type) {
            var _self = pageview;
            $(".play-con").css("height", "");
            if (_self.sewise_player == null) {
                _self.initVideo(type);
            }

            var time = 1 * 1000;
            var idx = setInterval(function () {
                    if (typeof (Sewise) != 'undefined') {
                        clearInterval(idx);

                        var url;
                        if (type == 'live') {
                            url = courseware.liveUrl;
                        } else {
                            url = courseware.hlsUrl;
                        }
                        _self.sewise_player.toPlay(url, courseware.coursewareName, 0, true);
                        _self.sewise_player.on('start',
                            function () {
                                _self.beginTime = new Date();
                            });
                        _self.sewise_player.on('pause',
                            function () {
                                _self.addLearningRecords();
                                _self.beginTime = null;
                            });
                    }
                },
                time);

            var interval = setInterval(function () {
                    if (typeof _self.sewise_player != 'undefined') {
                        var PlayTime = _self.sewise_player.playTime();
                        var allTime = _self.sewise_player.duration();
                        var leftover = allTime - PlayTime; //还剩下多少秒
                        if (leftover <= 0.5) {
                            PlayTime = allTime;
                            clearInterval(interval);
                            //播放结束添加学习记录
                            _self.addLearningRecords();
                        }
                    }
                    var d = new Date();
                    $('.sewise-player-ui .topbar-clock').html(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
                },
                1000)
        }

        /*
         *播放docImg
         */

        pageview.playDocImg = function (courseware) {
            var _self = pageview;
            var imgHtml = "";
            var docImg = [];
            var html = '<div class="tn3-my-gallery">' + '<div class="tn3 album">' + '<ol _ctrId = "docImg-temp"></ol>' + '</div>' + '</div>';
            $("#" + _self.pageName + " [_ctrId='docImg-ctr']").html(html);
            for (var i = 0; i < courseware.docPictureNumber; i++) {
                docImg.push(courseware.docPictureUrl.replace("@", i));
                imgHtml += "<li><a href='" + docImg[i] + "'><img src='" + docImg[i] + "'/></a></li>"
            }

            $("#" + _self.pageName + " [_ctrId='docImg-temp']").html(imgHtml);
            _self.initDocImg();
        }

        pageview.playLongImg = function (courseware) {
            $(".play-con").css("height", "auto");
            var myImg = document.createElement("img");
            myImg.style.width = "100%";
            myImg.src = courseware.longPictureUrl;
            $("#longImg-ctr").html(myImg);
        }

        /*
         *播放html
         */
        pageview.playH5 = function (courseware) {
            $(".play-con").css("height", "auto");
            var h5Iframe = document.createElement("iframe");
            h5Iframe.src = courseware.h5Url;
            h5Iframe.style.width = "100%";
            h5Iframe.style.height = "530px";
            $("#html5-ctr").html(h5Iframe);
        }

        /*
         *播放scrom类型
         */
        pageview.playScorm = function (courseware) {
            $(".play-con").css("height", "auto");
            var scormIframe = document.createElement("iframe");

            scormIframe.src = courseware.scormUrl;
            scormIframe.style.width = "100%";
            scormIframe.style.height = "530px";

            $("#scorm-ctr").html(scormIframe);
        }

        /*
         * 播放外链课件
         * */
        pageview.playUrl = function (courseware) {
            $(".play-con").css("height", "auto");
            var urlIframe = document.createElement("iframe");

            urlIframe.src = courseware.fileUrl;
            urlIframe.style.width = "100%";
            urlIframe.style.height = "530px";

            $("#url-ctr").html(urlIframe);
        }

        /*
         *初始化多张图片控件
         */
        pageview.initDocImg = function () {
            $('.tn3-my-gallery').tn3({
                skinDir: "skins",
                imageClick: "fullscreen",
                width: 847,
                height: 540,
                image: {
                    maxZoom: 1.5,
                    crop: true,
                    clickEvent: "dblclick",
                    transitions: [{
                        type: "blinds"
                    }, {
                        type: "grid"
                    }, {
                        type: "grid",
                        duration: 460,
                        easing: "easeInQuad",
                        gridX: 1,
                        gridY: 8,
                        sort: "random",
                        sortReverse: false,
                        diagonalStart: "bl",
                        method: "scale",
                        partDuration: 360,
                        partEasing: "easeOutSine",
                        partDirection: "left"
                    }]
                }
            });
        }

        /*
         *收藏
         */
        pageview.courseCollection = function () {
            logUtil.logMethodCalled("_courseCollection", "courseDetail");
            var _self = pageview;
            var payLoadData = {};
            payLoadData.courseId = _self.courseId;
            _server.courseCollection(payLoadData,
                function (ret) {
                    $('#' + _self.pageName + ' [_action="collection"]').attr("data-type", "true").removeClass('c-icon2').addClass('icon-shoucang');
                })
        }

        /*
         *取消收藏
         */
        pageview.cencelCourseCollection = function () {
            logUtil.logMethodCalled("_cencelCourseCollection", "courseDetail");
            var _self = pageview;
            var payLoadData = {};
            payLoadData.courseId = _self.courseId;
            _server.cencelCourseCollection(payLoadData,
                function (ret) {
                    $('#' + _self.pageName + ' [_action="collection"]').attr("data-type", "false").removeClass('icon-shoucang').addClass('c-icon2');
                })
        }

        /*
         *点赞
         */
        pageview.coursePraise = function () {
            var _self = pageview;
            logUtil.logMethodCalled("_coursePraise", "courseDetail");
            var payLoadData = {};
            payLoadData.courseId = _self.courseId;

            _server.coursePraise(payLoadData,
                function (ret) {
                    var praiseNumber = $("#" + _self.pageName + ' .praiseCount').html();
                    var praiseCount = praiseNumber * 1 + 1;
                    $('#' + _self.pageName + ' [_action="praise"]').attr("data-type", "true").removeClass('icon-dianzan').addClass('icon-zaned');
                    $("#" + _self.pageName + ' .praiseCount').html(praiseCount);
                })
        }

        /*
         *取消点赞
         */

        pageview.cencelCoursePraise = function () {
            logUtil.logMethodCalled("_cencelCoursePraise", "courseDetail");
            var _self = pageview;
            var payLoadData = {};
            payLoadData.courseId = _self.courseId;

            _server.cencelCoursePraise(payLoadData,
                function (ret) {
                    var praiseNumber = $("#" + _self.pageName + ' .praiseCount').html();
                    var praiseCount = praiseNumber - 1;
                    $('#' + _self.pageName + ' [_action="praise"]').attr("data-type", "false").removeClass('icon-zaned').addClass('icon-dianzan');
                    $("#" + _self.pageName + ' .praiseCount').html(praiseCount);

                })
        }

        /*
         *提交评论
         */
        pageview.submitComment = function (data) {
            logUtil.logMethodCalled("_submitComment", "courseDetail");
            var _self = pageview;
            data.commentCourseType = 'online';
            _server.submitComment(data,
                function (ret) {
                    $("#" + _self.pageName + ' [_action="content"]').val(""); //制空文本框
                    alert("评论成功!");
                    _self.renderCourseComment();
                })

        }

        /*
         *删除评论
         */
        pageview.deleteCourseComment = function (data) {
            logUtil.logMethodCalled("_deleteCourseComment", "courseDetail");
            var _self = pageview;
            _server.deleteCourseComment(data,
                function (ret) {
                    _self.renderCourseComment();
                })
        }

        /*
         *渲染课程评论
         */

        pageview.renderCourseComment = function (page, renderType) {
            logUtil.logMethodCalled("_renderCourseComment", "courseDetail");
            var _self = pageview;
            var payLoadData = {};
            var renderType = renderType || "html";
            payLoadData.courseId = _self.courseId;
            payLoadData.page = page || 1;
            payLoadData.page_size = 6;
            _server.queryCourseCommentData(payLoadData,
                function (ret) {

                    $("#componentList")[renderType](template("componentListTplt", ret));
                    $("#" + _self.pageName + ' [_ctrId="commentCount"]').html("评论(" + ret.records + ")"); //更改评论数量
                    $("#" + _self.pageName + ' [_action="loadMore"]').attr("page", ret.page);

                    AppCommon.getUserPictureUrl("#" + _self.pageName + " [_ctrId='userImg']");

                    if (ret.records == 0) {
                        $(".notComment").show();
                        $(".loading").hide();
                        $(".noMore").hide();
                    } else if (ret.page != 1 && ret.rows.length < 6) {
                        $(".noMore").show();
                        $(".loading").hide();
                        $(".notComment").hide();

                    } else if (ret.records != 0 && ret.records < 6) {
                        $(".noMore").show();
                        $(".loading").hide();
                        $(".notComment").hide();
                    } else {
                        $(".loading").show();
                        $(".notComment").hide();
                        $(".noMore").hide();
                    }
                })
        }

        /*
         *提交回复
         */
        pageview.submitCommentReply = function (data) {
            logUtil.logMethodCalled("_submitCommentReply", "courseDetail");
            var _self = pageview;
            _server.submitCommentReply(data,
                function (ret) {
                    alert("评论成功!");
                    _self.renderCourseComment();
                })

        }

        /*
         *添加学习记录
         */
        pageview.addLearningRecords = function (newData, href) {
            logUtil.logMethodCalled("_addLearningRecords", "courseDetail");
            var _self = pageview;
            var data = newData || {
                coursewareId: _self.coursewareId,
                beginTime: new Date(new Date() - ((pageview.courseware.playType == "docImg" ? pageview.courseware.learnSecond : pageview.sewise_player.duration()) + 2) * 1000),
                endTime: new Date()
            }
            if (data.coursewareId && data.beginTime && data.endTime && _self.limitRecords == true) {
                _self.limitRecords = true;
                _server.addLearningRecords(data,
                    function (ret) {
                        if (href) {
                            if (_self.trainProjectId) {
                                _examServer.patchExamResult({
                                        id: _self.trainProjectId
                                    },
                                    function (ret) {
                                        setTimeout(function () {
                                                location.href = href;
                                            },
                                            1000)
                                    })
                            } else {
                                location.href = href;
                            }
                        } else {
                            if (_self.trainProjectId) {
                                _examServer.patchExamResult({
                                        id: _self.trainProjectId
                                    },
                                    function (ret) {})
                            }
                        }
                        setTimeout(function () {
                                _self.limitRecords = true;
                            },
                            3000);
                    },
                    function () {
                        setTimeout(function () {
                                _self.limitRecords = true;
                            },
                            3000);
                    });
            }

        }
        pageview.addLearningRecords1 = function (newData, href, count) {
            logUtil.logMethodCalled("_addLearningRecords", "courseDetail");
            var _self = pageview;
            var data = newData || {
                coursewareId: _self.coursewareId,
                beginTime: new Date(new Date() - ((pageview.courseware.playType == "docImg" ? pageview.courseware.learnSecond : pageview.sewise_player.duration()) + 2) * 1000),
                endTime: new Date()
            }
            if (data.coursewareId && data.beginTime && data.endTime && _self.limitRecords == true) {
                _self.limitRecords = true;
                _server.addLearningRecords(data,
                    function (ret) {
                        if (href) {
                            if (_self.trainProjectId) {
                                _examServer.patchExamResult({
                                        id: _self.trainProjectId
                                    },
                                    function (ret) {
                                        setTimeout(function () {
                                                location.href = href;
                                            },
                                            10)
                                    })
                            } else {
                                location.href = href;
                            }
                        } else {
                            if (_self.trainProjectId) {
                                _examServer.patchExamResult({
                                        id: _self.trainProjectId
                                    },
                                    function (ret) {})
                            }
                        }
                        setTimeout(function () {
                                _self.limitRecords = true;
                                _self.success += 1;
                                $(".count").text(pageview.success + "/" + pageview.count);
                                if (_self.success < _self.count) {
                                    _self.addLearningRecords1();
                                }
                            },
                            10);
                    },
                    function () {
                        setTimeout(function () {
                                _self.limitRecords = true;
                            },
                            10);
                    });
            }
        }

        //1.已学完则不倒计时
        //2.未学完开始倒计时
        // 开始多图或者长图课件学时倒计时
        pageview.coursewareCountDown = function (courseware) {
            var _self = pageview;
            var type = courseware.playType;
            var isFinished = courseware.isFinished; //是否学完
            var learncount = courseware.learnSecond; //标准学时
            _self.time = learncount; //当前课件已学学时
            $("#" + _self.pageName + " [_ctrId='countDown']").html("");
            if (type == 'docImg' || type == 'longImg') {
                //开启定时器
                if (_self.timer) {
                    clearInterval(_self.timer);
                    _self.timer = null;
                }
                _self.timer = setInterval(function () {
                        if (_self.time == 0) {
                            clearInterval(_self.timer);
                            _self.timer = null;
                            var beginTime = new Date();
                            var endTime = new Date(beginTime.getTime() + (learncount * 1000));
                            var data = {};
                            data.coursewareId = courseware.coursewareId;
                            data.beginTime = beginTime;
                            data.endTime = endTime;
                            _self.addLearningRecords(data);
                            $("#" + _self.pageName + " [_ctrId='countDown']").html("当前课件剩余学时：已学完（注：若未学完直接关闭浏览器将不记录学时）");
                            alert("当前课件已学完!");
                        } else {
                            _self.time--;
                            $("#" + _self.pageName + " [_ctrId='countDown']").html("当前课件剩余学时：" + _self.time + "秒（注：若未学完直接关闭浏览器将不记录学时）");
                        }
                    },
                    1000)
            } else if (type == "h5" || type == "url") {
                var beginTime = new Date();
                var endTime = new Date(beginTime.getTime() + (learncount * 1000));
                var data = {};
                data.coursewareId = courseware.coursewareId;
                data.beginTime = beginTime;
                data.endTime = endTime;
                _self.addLearningRecords(data);
            }
        }

        /*
         *开始计时添加学习记录
         */
        /* 
        pageview.startLearnTime = function(courseware){
            var _self = pageview;
            var type = courseware.playType;
            var intervalTime = (type == 'docImg' || type == 'h5') ? 20000 : 10000;
            var oldIntervalTime = (_self.playType == "docImg" || _self.playType == "h5") ? 20000 : 10000;//上一条课件类型
            var data = {};


            if(_self.timer && _self.playType != "vedio"){
                //清除上一个定时器，并添加上一个课件的学习记录
                clearInterval(_self.timer);
                var beginTime = new Date();//当前时间
                var endTime = new Date(beginTime.getTime() + oldIntervalTime);//当前时间往后
                data.coursewareId = _self.coursewareId;
                data.beginTime = beginTime;
                data.endTime = endTime;

                _self.addLearningRecords(data);
            }

            if(type == "vedio" || type == "url" || type == "scorm") {
                if(type == "url"){
                    //如果是外链课件，点击则表示已学完
                    var beginTime = new Date();//当前时间
                    var endTime = new Date(beginTime.getTime() + courseware.learnSecond * 1000);//当前时间往后
                    data.coursewareId = courseware.coursewareId;
                    data.beginTime = beginTime;
                    data.endTime = endTime;
                    _self.addLearningRecords(data);
                }
                return;//视频类型不需要定时
            }
            _self.timer = setInterval(function(){
                var beginTime = new Date();//当前时间
                var endTime = new Date(beginTime.getTime() + intervalTime);//当前时间往后

                data.coursewareId = courseware.coursewareId;
                data.beginTime = beginTime;
                data.endTime = endTime;

                _self.addLearningRecords(data);
            },intervalTime);
        }
        */

        /*
         *初始化tempale.helper
         */

        pageview.initTempalteHelper = function () {
            logUtil.logMethodCalled("_initTempalteHelper", "courseDetail");
            template.helper("initFiltType",
                function (value) {

                    switch (value) {
                    case 'mp4':
                        return "iconfont-shipin font-color-blue01";
                    case 'pdf':
                        return "iconfont-pdf font-color-red01";
                    case 'doc':
                        return "iconfont-doc1 font-color-blue01";
                    case 'txt':
                        return "iconfont-txt font-color-blue01";
                    case 'ppt':
                        return "iconfont-ppt font-color-red01";
                    case 'docx':
                        return "iconfont-docx font-color-red01";
                    case 'zip':
                        return "iconfont-zip font-color-red01";
                    case 'xls':
                        return "iconfont-xls font-color-red01";
                    case 'xlsx':
                        return "iconfont-xlsx font-color-red01";
                    case 'pptx':
                        return "iconfont-pptx font-color-red01";
                    case 'png':
                        return "iconfont-png font-color-red01";
                    case 'exl':
                        return "iconfont-exl1 font-color-red01";
                    case 'jpg':
                        return "iconfont-jpg font-color-red01";
                    case 'mov':
                        return "iconfont-mov font-color-red01";
                    case 'avi':
                        return "iconfont-avi font-color-red01";
                    default:
                        return "";
                        break;
                    }
                });

            template.helper("fileUrlFormat",
                function (url) {

                    return '/learnFile' + url;
                })

        }

        /**
         * 初始化方法
         */
        pageview.init = function (server, examServer) {
            var _self = pageview;
            try {
                logUtil.logMethodCalled("_init", "courseDetail");
                _server = server;
                _examServer = examServer;
                _self.pagesInit();
                _self.bindEvent();
                _self.initTempalteHelper();

            } catch (ex) {
                alert(ex)
            }
        };

        /*
         *检测是否安装或者启用flash插件。
         */
        pageview.hasFlash = function () {
            var hasFlash = 0; //是否安装了flash
            var flashVersion = 0; //flash版本
            //IE浏览器
            if ("ActiveXObject" in window) {
                try {
                    var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    hasFlash = 1;
                    VSwf = swf.GetVariable("$version");
                    flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                } catch (e) {

                }

                //非IE浏览器
            } else {
                try {
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        var swf = navigator.plugins["Shockwave Flash"];
                        if (swf) {
                            hasFlash = 1;
                            var words = swf.description.split(" ");
                            for (var i = 0; i < words.length; ++i) {
                                if (isNaN(parseInt(words[i]))) continue;
                                flashVersion = parseInt(words[i]);
                            }
                        }
                    }
                } catch (e) {

                }
            }

            return hasFlash;

        }

        return {
            init: pageview.init
        };

    })();
    console.log(2)
}
// unsafeWindow.CourseDetailController = trainProjectDetailController;
if (location.href.indexOf("testPaper") >= 0) {
    unsafeWindow.testPaperController = (function () {
        var _server = null;
        pageview = {
            examPaperId: "",
            answerPaper: null,
            examTime: 0,
            $editHandle: null,
            $examQuestionDetails: null,
            examRule: null,
            isAutoPublish: null,
            //是否允许答题后查看考卷
            answerPaperId: GetQueryString("answerPaperId"),
            examType: GetQueryString("examType") || '',
            trainProjectId: GetQueryString("trainProjectId") || '',
            commitSurplusTime: 0,
            screenfullCount: 1 //防切屏默认1次
        };

        String.prototype.trimfixed = function () {
            return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        // 
        pageview.loadData = function () {
            var _self = pageview;
            _self.$editHandle = $("#editHandle");
            _self.$examQuestionDetails = $("#examQuestionDetails");
            _self.$examQuestionForm = $("#examQuestion-form");
            _self.examPaperId = AppCommon.funGetQueryString().examPaperId;
            var payLoadData = {
                examPaperId: _self.examPaperId
            }
            if (_self.answerPaperId) {
                payLoadData.answerPaperId = _self.answerPaperId;
            }
            _server.getExamPaperDetail(payLoadData,
                function (res) {
                    _self.initData(res);
                    _self.initView(res);
                    _self.isAutoPublish = res.evalAnswerRuleForm.isAutoPublish;
                });
        };

        pageview.initData = function (res) {
            var _self = pageview;
            _self.examTime = (res.paperPreviewForm.examTime || 0) * 60; //以秒存
            _self.examRule = res.evalAnswerRuleForm;
            if (res.surplusTime) {
                _self.surplusTime = res.surplusTime;
            } else {
                _self.surplusTime = (res.paperPreviewForm.examTime || 0) * 60;
            }
            _self.answerPaper = {
                examPaperId: _self.examPaperId,
                answerPaperId: res.answerPaperId,
                answerBeginTime: new Date().getTime(),
                evalAnswerQuestionForms: [],
                examPaperScore: res.paperPreviewForm.examPaperScore
            };
            $.each(res.paperPreviewForm.questionSetList,
                function (i, questionSet) {
                    $.each(questionSet.questionList,
                        function (j, question) {
                            _self.answerPaper.evalAnswerQuestionForms.push({
                                questionTypeCode: question.questionTypeCode,
                                questionTypeName: question.questionTypeName,
                                questionId: question.questionId,
                                examQuestionId: question.questionId,
                                answerContent: ""
                            });
                        });
                });
        };

        pageview.initTempHelper = function () {
            template.helper("fromCharCode",
                function (n) {
                    return String.fromCharCode(n);
                });
            var numberFormat = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
            template.helper("formatNumber",
                function (i) {
                    return numberFormat[i];
                });
            template.helper("eachAnswer",
                function (allAnswer, answer) {
                    return allAnswer.indexOf(answer) == -1 ? false : true;
                });
        };

        pageview.initView = function (res) {
            var _self = pageview;
            _self.initTempHelper();

            _self.initScreenfull(res); //初始化防切屏
            // _self.initInterValSave();
            $("#examInfo").html(template("examInfoTemp", {
                isOpenExam: res.evalAnswerRuleForm.isOpenExam ? "开卷考试" : "闭卷考试",
                examBeginTime: res.paperPreviewForm.examBeginTime,
                examEndTime: res.paperPreviewForm.examEndTime,
                examPaperScore: res.paperPreviewForm.examPaperScore,
                examTime: res.paperPreviewForm.examTime,
                paperName: res.paperPreviewForm.paperName
            }));
            var questionDetails = template("examQuestionDetailsTemp", res.paperPreviewForm);
            if (questionDetails.trimfixed()) {
                _self.$editHandle.html(template("editHandleTemp", res.paperPreviewForm));
                _self.$examQuestionDetails.html(questionDetails);
            } else {
                _self.$examQuestionDetails.html("该试卷没有试题！");
            }
            if (_self.surplusTime > 0) {
                _self.countdown();
            } else {
                _self.$editHandle.find(".timer").html("");
            }
        };

        //防切屏
        pageview.initScreenfull = function (res) {
            var _self = pageview;
            if (false) {
                _self.startScreenfull();
            }
        }

        // 开启防切屏,防作弊
        pageview.startScreenfull = function () {
            var _self = pageview;

            var count = 0; //已经切屏次数，初始化为0
            //禁止复制粘贴
            document.oncontextmenu = new Function("event.returnValue=false");
            document.oncopy = new Function("event.returnValue=false");
            document.onpaste = new Function("event.returnValue=false");

            // 屏蔽刷新键
            $(document).keydown(function (event) {
                if ((event.keyCode == 116) || //屏蔽   F5   刷新键  
                    (event.keyCode == 112) || //屏蔽   F1   刷新键  
                    (event.ctrlKey && event.keyCode == 82)) { //Ctrl   +   R  
                    return false;
                }

            });

            $("body").css({
                "overflow": "hidden"
            });
            layer.alert("本场考试为闭卷考试，已开启防切屏限制，请勿退出全屏，退出全屏之后将强制交卷，请知悉！", {
                title: ['提示', 'background: #1c96dd;color: #fff;'],
                yes: function (index, layero) {
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                        screenfull.request();
                        $("body").css({
                            "overflow": "auto"
                        });
                    },
                    cancel: function () {
                        screenfull.request();
                    }

            });

            // //退出全屏记一次切屏
            if (screenfull.enabled) {

                document.addEventListener(screenfull.raw.fullscreenchange,
                    function () {
                        if (!screenfull.isFullscreen) {
                            // count ++;
                            // if(count  == _self.screenfullCount){
                            _self.sendData('no', 'submit');
                            // }else{
                            // var str = "您已切屏"+count+"次，"+_self.screenfullCount+"次之后将会自动交卷！"
                            // layer.alert(str,{
                            //     title:['提示','background: #1c96dd;color: #fff;'],
                            //     yes:function(index, layero){
                            //         screenfull.request();
                            //         layer.close(index);
                            //     },
                            //     cancel:function(){
                            //         screenfull.request();
                            //     }
                            // });
                            // }
                        }
                    });
            } else {
                $("body").css({
                    "overflow": "auto"
                });
            }

            //页面不可见，最小化或者切换计一次切屏 ,todo
            // document.addEventListener("visibilitychange", function(){
            //     if(document.visibilityState === 'hidden'){
            // count ++;
            // if(count  == _self.screenfullCount){
            //     layer.alert("正在进行交卷！",{title :['提示','background: #1c96dd;color: #fff;']});
            //     _self.sendData('no','submit');
            // }else{
            //     var str = "您已切屏"+count+"次，"+_self.screenfullCount+"次之后将会自动交卷！"
            //     layer.alert(str,{
            //         title:['提示','background: #1c96dd;color: #fff;'],
            //         yes:function(index, layero){
            //             screenfull.request();
            //             layer.close(index);
            //         },
            //         cancel:function(){
            //             screenfull.request();
            //         }
            //     });
            // }
            // layer.alert("正在进行交卷！",{title :['提示','background: #1c96dd;color: #fff;']});
            // _self.sendData('no','submit');       
            //     }
            // }, false);
            // // alt+tab切换触发
            window.addEventListener('focus',
                function () {
                    // layer.alert("正在进行交卷！",{title :['提示','background: #1c96dd;color: #fff;']});
                    _self.sendData('no', 'submit');
                },
                false);

        }

        // // 定时保存
        // pageview.initInterValSave = function(){
        //     var _self = pageview;
        //     _self.timerSave = setInterval(function(){
        //         _self.sendData('no','save','interval');
        //     },300000);
        // }
        //转换时间
        pageview.formatTime = function (examTime) {
            var _self = pageview;
            var time = {
                hour: parseInt(examTime / 3600),
                minute: parseInt(examTime % 3600 / 60),
                second: examTime % 60
            };
            _self.$editHandle.find("[data-bind]").each(function () {
                $(this).html(time[$(this).attr("data-bind")]);
            });
        };

        //定时提交试卷
        pageview.countdown = function () {
            var _self = pageview;
            _self.timer = setInterval(function () {
                    _self.formatTime(_self.surplusTime);
                    if (--_self.surplusTime < 0) {
                        clearInterval(_self.timer);
                        // clearInterval(_self.timerSave);
                        _self.sendData('no', 'submit');
                        _self.timer = null;
                    }
                    pageview.commitSurplusTime = _self.surplusTime;
                },
                1000);
        };

        //提交或者暂存试卷
        pageview.sendData = function (status, type) {
            var _self = pageview;
            var status = status || 'yes';
            var tips = (type == 'save' ? '确认保存试卷？' : '确认提交试卷？');
            if (status == 'yes') {
                layer.confirm(tips, {
                        title: ['提示', 'background: #1c96dd;color: #fff;'],
                    },
                    function () {
                        $('.layui-layer-btn0').hide();
                        _self.submitData(type);
                    });
            } else {
                _self.submitData(type);
            }

        };

        pageview.submitData = function (type) {
            var _self = pageview;
            var data = [];
            $.each(_self.$examQuestionForm.serializeArray(),
                function () {
                    var key = this.name;
                    data[key] = data[key] ? (data[key] + ";" + this.value) : this.value;
                });
            $.each(_self.answerPaper.evalAnswerQuestionForms,
                function (i, question) {
                    question.answerContent = data[question.questionId] || "";
                });
            _self.answerPaper.actionOpt = type || 'submit'; //若type不传则为提交
            _self.answerPaper.surplusTime = pageview.commitSurplusTime; //剩余考试时间
            AppCommon.loadding.show();
            _server.postAnswerPaper(_self.answerPaper,
                function (res) {
                    var indexUrl = Global.pcContextPath + "/index.html";
                    var trainProjectId = _self.trainProjectId || res.businessObject.businessObjectId;
                    var examType = _self.examType || res.businessObject.businessObjectType;
                    var viewMethodType = res.businessObject.viewMethodType || '4';
                    var isEval = res.businessObject.isEval;
                    AppCommon.loadding.hide();
                    if (type == 'submit') {
                        if (res.businessObject.isPass && examType == "trainProject") {
                            _server.patchExamResult({
                                id: trainProjectId,
                                result: true
                            });
                        }
                        var content = null;
                        var btn = null;
                        var success = null;
                        if (isEval) {
                            content = "恭喜您完成考试，预祝您获得好成绩!";
                            btn = ['确定'];
                            success = function (elem) {
                                $(elem).find(".layui-layer-content").css("height", "55px");
                                $(elem).find(".layui-layer-btn0").attr("href", indexUrl);
                            };
                        } else {
                            switch (viewMethodType) {
                            case '1':
                                {
                                    content = "恭喜您完成考试，预祝您获得好成绩!";
                                    btn = ['确定'];
                                    success = function (elem) {
                                        $(elem).find(".layui-layer-content").css("height", "55px");
                                        $(elem).find(".layui-layer-btn0").attr("href", indexUrl);
                                    };
                                    break;
                                }
                            case '2':
                                {
                                    content = "成绩为 " + res.businessObject.answerPaperScore + " 分，" + (res.businessObject.isPass ? "通过考试！" : "未通过考试！");
                                    btn = ['确定'];
                                    success = function (elem) {
                                        $(elem).find(".layui-layer-content").css("height", "55px");
                                        $(elem).find(".layui-layer-btn0").attr("href", indexUrl);
                                    };
                                    break;
                                }
                            case '3':
                                {
                                    _self.see = 'false';
                                    var answerPaperUrl = Global.pcContextPath + "/eval/testPaper-student.html?answerPaperId=" + _self.answerPaper.answerPaperId + "&see=" + _self.see;
                                    content = "成绩为 " + res.businessObject.answerPaperScore + " 分，" + (res.businessObject.isPass ? "通过考试！" : "未通过考试！") + "是否查看答卷？";
                                    btn = ['确定', '取消'];
                                    success = function (elem) {
                                        $(elem).find(".layui-layer-content").css("height", "55px");
                                        $(elem).find(".layui-layer-btn0").attr("href", answerPaperUrl).attr("target", "_blank");
                                        $(elem).find(".layui-layer-btn1").attr("href", indexUrl);
                                    };
                                    break;
                                }
                            case '4':
                                {
                                    _self.see = 'true';
                                    var answerPaperUrl = Global.pcContextPath + "/eval/testPaper-student.html?answerPaperId=" + _self.answerPaper.answerPaperId + "&see=" + _self.see;
                                    content = "成绩为 " + res.businessObject.answerPaperScore + " 分，" + (res.businessObject.isPass ? "通过考试！" : "未通过考试！") + "是否查看答卷？";
                                    btn = ['确定', '取消'];
                                    success = function (elem) {
                                        $(elem).find(".layui-layer-content").css("height", "55px");
                                        $(elem).find(".layui-layer-btn0").attr("href", answerPaperUrl).attr("target", "_blank");
                                        $(elem).find(".layui-layer-btn1").attr("href", indexUrl);
                                    };
                                    break;
                                }
                            }
                        }
                    } else {
                        var content = "保存试卷成功!"
                        var btn = null;
                        var success = null;
                        btn = ['确定'];
                        success = function (elem) {
                            $(elem).find(".layui-layer-content").css("height", "55px");
                            $(elem).find(".layui-layer-btn0").attr("href", indexUrl);
                        };
                    }

                    clearInterval(_self.timer);
                    layer.open({
                        type: 0,
                        title: '提示',
                        content: content,
                        area: ['360px', '180px'],
                        offset: '100px',
                        btn: btn,
                        closeBtn: 0,
                        shadeClose: false,
                        resize: false,
                        yes: function () {
                                // window.location.href = indexUrl;
                            },
                            success: success
                    });
                });
        }

        pageview.initWidget = function () {
            var _self = pageview;
        };

        pageview.initEvent = function () {
            var _self = pageview;
            _self.positionFixed(_self.$editHandle);
            _self.$examQuestionDetails.on("click", "[data-action='anchor']",
                function (e) {

                    // if (e.target.nodeName === "LABEL") {return;}
                    $("html,body").stop(true).animate({
                            scrollTop: $(this).parents(".item-one").offset().top
                        },
                        200);
                    if (this.nodeName !== "TEXTAREA") {
                        var questionId = $(this).parent().children("input").attr("name");
                        var anchor = _self.$editHandle.find("[data-questionId='" + questionId + "']");
                        var done = _self.$examQuestionDetails.find("[name='" + questionId + "']:checked").length > 0;
                        done ? anchor.addClass("done") : anchor.removeClass("done");
                    }
                }).on("blur", "textarea[data-action='anchor']",
                function () {
                    var anchor = _self.$editHandle.find("[data-questionId='" + $(this).attr("name") + "']");
                    $(this).val().trimfixed() ? anchor.addClass("done") : anchor.removeClass("done");
                });
            _self.$editHandle.on("click", "[data-action]",
                function () {
                    var action = $(this).attr("data-action");
                    switch (action) {
                    case "anchor":
                        {
                            var anchor = _self.$examQuestionDetails.find("[name='" + $(this).attr("data-questionId") + "']:first");
                            $("html,body").stop(true).animate({
                                    scrollTop: anchor.parents(".item-one").offset().top
                                },
                                200);
                            break;
                        }
                    case "submitExam":
                        {
                            _self.sendData('yes', 'submit');
                            break;
                        }
                    case "saveExam":
                        {
                            _self.sendData('yes', 'save');
                            break;
                        }
                    }
                });
        };

        pageview.positionFixed = function ($element) {
            var top = $element.offset().top,
                pos = $element.css("position");
            $(window).scroll(function () {
                var scrolls = $(this).scrollTop();
                if (scrolls > top) { //如果滚动到页面超出了当前元素相对页面顶部的高度
                    if (window.XMLHttpRequest) { //如果不是ie6
                        $element.css({
                            position: "fixed",
                            top: 0
                        }).addClass("smfixed");
                    } else {
                        $element.css({
                            top: scrolls
                        });
                    }
                } else {
                    $element.css({
                        position: pos,
                        top: top
                    }).removeClass("smfixed");
                }
            });
        };

        pageview.init = function (server) {
            var _self = pageview;
            _server = server;
            _self.loadData();
            _self.initEvent();
        };

        return {
            init: pageview.init
        };

    })();

}

// $('body')[0].innerHTML = '<title></title><style>.point{position:absolute;left:50%;top:50%}.pop{width:500px;height:500px;position:absolute;left:-250px;top:-250px;border:2px solid red}</style><div class="point"><div class="pop"></div></div>' + $('body')[0].innerHTML;
if (location.href.indexOf("Detail") >= 0) {
    // $(".container.clearfix")[0].innerHTML += "<a  href=# style=color:red class=finish>完成</a>";
    // addhtml = "<li class=finishli><a  href=# style=color:write class=finish active>完成</a></li>"
    //     + "<li class=autoli><a href=# style=color:write class=auto active>自动</a></li>"
    //     + "<li class=autoli><a href=# style=color:write class=count active>进度:0/0</a></li>";
    // $(".navs>.container")[0].innerHTML += addhtml;
    // $(".auto").text("asdasd");
    addhtml = "<div><ul class=\"container clearfix\"><li class=finishli><a  href=# style=color:write class=finish active>完成</a></li>" + "<li class=autoli><a href=# style=color:write class=auto active>自动</a></li>" + "<li class=countli><a href=# style=color:write class=count active>0/0</a></li></ul></div>"

    $(".navs")[0].innerHTML += addhtml;


    setTimeout(function () {
        pageview.coursewareList = pageview.coursewareList || pageview.pageData["coursewareList"];
        $(".count").text(0 + "/" + pageview.coursewareList.length);
    }, 2000);
    $(".auto").click(function () {
        function r() {
            for (var i = 0; i < pageview.coursewareList.length; i++) {
                var ret = pageview.coursewareList[i]
                    // var ret = pageview.coursewareList
                var data = {
                    coursewareId: ret.coursewareId,
                    beginTime: new Date(new Date() - (ret.learnSecond) * 1000),
                    endTime: new Date()
                };
                pageview.addLearningRecords1(pageview.coursewareList);
            }
            return;
        }

        // var it = r();
        pageview.count = pageview.coursewareList.length;
        pageview.success = 0;
        pageview.addLearningRecords1();
        // r();
        // for (var i = 0; i < pageview.coursewareList.length; i++) {
        //     it.next();
        // }

        return;

        //           var r = confirm("自动完成" + pageview.coursewareList.length + "个课程");
        //           if (r == true) {
        //               if (pageview.coursewareList.length > 0) {
        //                   // pageview.coursewareList.forEach(element => console.log(element));
        //                   for (var i = 0; i < pageview.coursewareList.length; i++) {
        //                       // aa = function (ret) {
        //                       if (pageview.limitRecords == true) {
        //                           var ret = pageview.coursewareList[i]
        //                           var data = {
        //                               coursewareId: ret.coursewareId,
        //                               beginTime: new Date(new Date() - ((pageview.courseware.playType == "docImg" ? pageview.courseware.learnSecond : pageview.sewise_player.duration()) + 0.5) * 1000),
        //                               endTime: new Date()
        //                           };
        //                           pageview.addLearningRecords(data);
        //                           // setTimeout("aa(pageview.coursewareList[i])",300*i)
        //                           // alert("已完成:" + ret.coursewareName);
        //                           // while(1){
        //                           // }
        //                       }
        //                       // }(pageview.coursewareList[i]);
        //                       // setTimeout("aa(pageview.coursewareList[i])",300*i)
        //                       // pageview.loadData();
        //                       // }(element)
        //                       // )
        //                   }
        //                   // alert("已完成");
        //               }
        //           }
    });

    $(".finish").click(function () {
        var data = {
            coursewareId : pageview.coursewareId,
            beginTime : new Date(new Date() - (pageview.courseware.learnSecond)*1000),
            endTime : new Date()
        };
        //pageview.courseware.learnSecond
        if (pageview.coursewareId) {

            if (!pageview.courseware.isFinished) {
                pageview.addLearningRecords();
                // pageview.loadData();
            } else {
                var r = confirm("已完成,是否再次学习?");
                if (r == true) {
                    pageview.addLearningRecords(data);
                    // pageview.loadData();
                } else {
                    return;
                }
            }

            alert("已完成");
        }
    });
}
// ==UserScript==
// @name         国家开放大学刷课脚本 - 全自动 - 焕新版🚀！
// @namespace    http://blog.arthur.lvvv.cc/
// @version      1.3.7
// @description  国家开放大学 国开  国开实验  广东开放大学 上海开放大学 四川开放大学 成都开放大学 .全自动.全能型.大作业.终考.直播.视频.自动，作业辅导，全能型，能直接使用，请自行尝试使用，专业视频加速解决方案
// @author       arthur
// @match        http://www.wenku8.net/*
// @resource     customCSS https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/545150/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20-%20%E5%85%A8%E8%87%AA%E5%8A%A8%20-%20%E7%84%95%E6%96%B0%E7%89%88%F0%9F%9A%80%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/545150/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20-%20%E5%85%A8%E8%87%AA%E5%8A%A8%20-%20%E7%84%95%E6%96%B0%E7%89%88%F0%9F%9A%80%EF%BC%81.meta.js
// ==/UserScript==

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-common"],
  {
    "05ba": function (e, t, i) {
      "use strict";
      i("cdbb");
    },
    "0913": function (e, t, i) {
      "use strict";
      i("1c4b");
    },
    "09d7": function (e, t, i) {
      e.exports = i.p + "img/course_cover_demo.537eb965.png";
    },
    "0b06": function (e, t, i) {
      "use strict";
      i("6569");
    },
    1: function (e, t) {},
    1501: function (e, t, i) {},
    "1c4b": function (e, t, i) {},
    20: function (e, t, i) {
      e.exports = i("925b");
    },
    2610: function (e, t, i) {
      "use strict";
      i.d(t, "d", function () {
        return u;
      }),
        i.d(t, "c", function () {
          return p;
        }),
        i.d(t, "b", function () {
          return h;
        }),
        i.d(t, "a", function () {
          return f;
        });
      i("e17f");
      var o = i("2241"),
        s = (i("e7e5"), i("d399")),
        a = (i("ac1f"), i("5319"), i("99af"), i("365c")),
        n = i("f3df"),
        r = i("db49"),
        c = i("72fe"),
        l = i.n(c),
        u = function () {
          "java_api" === r["a"].apiPrefix
            ? (window.location.href = "/login/index.html")
            : (window.location.href =
                "https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww52a69ddb92d96dc2&redirect_uri=https%3A%2F%2Fcoursework.shou.org.cn%2F&response_type=code&scope=snsapi_base&state=wxlogin#wechat_redirect");
        },
        d = function (e) {
          return {
            realName: e.realname,
            employeeNum: e.username,
            userId: e.username,
            wxUserId: e.openid,
            subName: e.subName,
            major: "",
            teachCourseNumber: "",
            counsellingNumber: "",
            token: e.token,
            avatar: "",
            roleFlags: e.roleFlags,
          };
        },
        p = function (e, t) {
          s["a"].loading({
            message: "微信登录中...",
            forbidClick: !0,
            loadingType: "spinner",
            duration: 0,
          }),
            Object(a["a"])("loginByWX", { code: e })
              .then(function (e) {
                if ("0" === e.code) {
                  var i = e.data || {},
                    a =
                      "java_api" === r["a"].apiPrefix
                        ? d(i)
                        : {
                            realName: i.realName,
                            employeeNum: i.employeeNum,
                            userId: i.userInfoId
                              ? i.userInfoId.replace("310_", "")
                              : i.employeeNum,
                            wxUserId: i.wxUserId,
                            subName: i.subName,
                            major: i.major,
                            teachCourseNumber: i.teachCourseNumber,
                            counsellingNumber: i.counsellingNumber,
                            token: i.accessToken,
                            avatar: i.avatar,
                            roleFlags:
                              0 === i.userType
                                ? "ROLE_MASTER_TEACH"
                                : "ROLE_STUDENT",
                          };
                  Object(n["f"])("userInfo", a), s["a"].clear(), t();
                } else
                  s["a"].clear(),
                    o["a"]
                      .alert({
                        message: "微信登录失败, 即将通过用户名密码登录",
                      })
                      .then(function () {
                        window.location.href = "/login/index.html";
                      });
              })
              .catch(function () {
                s["a"].clear(),
                  o["a"]
                    .alert({ message: "微信登录失败, 即将通过用户名密码登录" })
                    .then(function () {
                      window.location.href = "/login/index.html";
                    });
              });
        },
        h = function () {
          return "https://mp.shou.org.cn/qyzhibo/securitydev";
        },
        f = function () {
          var e =
              "AAAAB3NzaC1yc2EAAAABJQAAAQEAqydlIuYoJxVUmSRoMY8phb3+NEb65bt8Ngc30sLpRgNW+g7x/1D+T26UhhfRFg17SzwGBrCsgkZNAyNZz2HOdeRAbqJ3WZ5YC0KG",
            t = (Object(n["d"])("userInfo") || {}).userId || "",
            i = Math.floor(new Date().getTime() / 1e3),
            o = 86827924,
            s = l()("".concat(e).concat(t).concat(i).concat(o));
          return "https://graduation.sou.edu.cn/Account/Learning?userName="
            .concat(t, "&timeStamp=")
            .concat(i, "&randNum=")
            .concat(o, "&sign=")
            .concat(s, "&type=0");
        };
    },
    2613: function (e, t, i) {
      "use strict";
      var o = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i("div", { staticClass: "audio-wrapper" }, [
            e.audioTitle
              ? i("div", { staticClass: "audio-title" }, [
                  e._v(" " + e._s(e.audioTitle) + " "),
                ])
              : e._e(),
            e.isLoading
              ? i(
                  "div",
                  { staticStyle: { "text-align": "center", padding: "20px" } },
                  [
                    i("Loading", {
                      attrs: { type: "spinner", color: "#1989fa" },
                    }),
                  ],
                  1
                )
              : i("div", { staticClass: "audio-control" }, [
                  i(
                    "div",
                    {
                      staticClass: "play-btn",
                      on: { click: e.playStateChange },
                    },
                    [
                      e.isPlaying
                        ? i("Icon", { attrs: { name: "pause-circle-o" } })
                        : i("Icon", { attrs: { name: "play-circle-o" } }),
                    ],
                    1
                  ),
                  i("div", { staticClass: "audio-time" }, [
                    e._v(e._s(e.currentTimeStr)),
                  ]),
                  i(
                    "div",
                    { staticClass: "process-wrapper" },
                    [
                      i("Slider", {
                        staticClass: "audio-progress",
                        attrs: { min: 0, max: e.totalTime, "button-size": 14 },
                        on: { change: e.currentTimeChange },
                        model: {
                          value: e.currentTime,
                          callback: function (t) {
                            e.currentTime = t;
                          },
                          expression: "currentTime",
                        },
                      }),
                    ],
                    1
                  ),
                  i("div", { staticClass: "audio-time" }, [
                    e._v(e._s(e.totalTimeStr)),
                  ]),
                ]),
          ]);
        },
        s = [],
        a = (i("e7e5"), i("d399")),
        n = (i("ac1e"), i("543e")),
        r = (i("c3a6"), i("ad06")),
        c = (i("5fe4"), i("8ad4")),
        l = (i("a9e3"), i("99af"), i("d3b7"), i("25f0"), i("1e5c")),
        u = {
          name: "AudioPlayer",
          components: { Slider: c["a"], Icon: r["a"], Loading: n["a"] },
          props: {
            source: { type: String, default: "" },
            audioTitle: { type: String, default: "" },
            lastPlayTime: { type: Number, default: 0 },
          },
          data: function () {
            return {
              isLoading: !1,
              totalTime: 0,
              currentTime: 0,
              totalTimeStr: "00:00",
              currentTimeStr: "00:00",
              isPlaying: !1,
              volumeOn: !0,
              audioPlayer: null,
              timer: null,
              timeInfo: {
                startSecond: 0,
                endSecond: 0,
                startTimestamp: 0,
                endTimestamp: 0,
              },
            };
          },
          watch: {
            totalTime: function (e) {
              if (e <= 0) this.totalTimeStr = "00:00";
              else {
                var t = Math.floor(e / 60),
                  i = Math.floor(e % 60);
                this.totalTimeStr = ""
                  .concat(t > 10 ? t : "0" + t.toString(), ":")
                  .concat(i > 10 ? i : "0" + i.toString());
              }
            },
            currentTime: function (e) {
              if (e <= 0) this.currentTimeStr = "00:00";
              else {
                var t = Math.floor(e / 60),
                  i = Math.floor(e % 60);
                this.currentTimeStr = ""
                  .concat(t > 10 ? t : "0" + t.toString(), ":")
                  .concat(i > 10 ? i : "0" + i.toString());
              }
            },
            source: function () {
              this.initAudio();
            },
            isPlaying: function (e) {
              e ? this.timeCount() : this.clearTimer();
            },
          },
          mounted: function () {
            this.initAudio();
          },
          beforeDestroy: function () {
            this.audioPlayer && this.audioPlayer.unload(), this.clearTimer();
          },
          methods: {
            initAudio: function () {
              var e = this;
              this.source &&
                ((this.isLoading = !0),
                this.audioPlayer && this.audioPlayer.unload(),
                (this.audioPlayer = new l["Howl"]({
                  src: [this.source],
                  volume: 1,
                  html5: !1,
                  onload: function () {
                    var t = Math.floor(e.audioPlayer.duration());
                    (e.totalTime = t),
                      e.lastPlayTime &&
                        e.lastPlayTime > 0 &&
                        ((e.currentTime = e.lastPlayTime),
                        e.currentTimeChange(e.currentTime)),
                      (e.isLoading = !1);
                  },
                  onplay: function () {
                    (e.isPlaying = !0),
                      (e.currentTime = e.getCurrentTime()),
                      (e.timeInfo.startTimestamp = new Date().getTime()),
                      (e.timeInfo.startSecond = e.currentTime),
                      e.$emit("play", e.currentTime);
                  },
                  onpause: function () {
                    (e.isPlaying = !1),
                      (e.timeInfo.endSecond = e.getCurrentTime()),
                      e.savePlayInfo(),
                      e.$emit("pause", e.getCurrentTime());
                  },
                  onseek: function () {
                    e.isPlaying && e.savePlayInfo();
                  },
                  onend: function () {
                    (e.isPlaying = !1),
                      (e.timeInfo.endSecond = e.totalTime),
                      e.savePlayInfo(),
                      e.$emit("pause", e.getCurrentTime());
                  },
                  onloaderror: function () {
                    (e.isLoading = !1), a["a"].fail("加载音频失败");
                  },
                })));
            },
            clearTimer: function () {
              this.timer && clearInterval(this.timer);
            },
            timeCount: function () {
              var e = this;
              if ((this.clearTimer(), this.audioPlayer && this.isPlaying)) {
                var t = this.getCurrentTime();
                this.timer = setInterval(function () {
                  (e.currentTime = e.getCurrentTime()),
                    (e.timeInfo.endSecond = e.currentTime),
                    e.currentTime - t >= 60 &&
                      (e.savePlayInfo(), (t = e.currentTime));
                }, 100);
              }
            },
            currentTimeChange: function (e) {
              this.audioPlayer && this.audioPlayer.seek(e), this.timeCount();
            },
            playStateChange: function () {
              this.audioPlayer &&
                ((this.isPlaying = !this.isPlaying),
                this.isPlaying
                  ? this.audioPlayer.play()
                  : this.audioPlayer.pause());
            },
            volumeStateChange: function () {
              (this.volumeOn = !this.volumeOn),
                this.audioPlayer && this.audioPlayer.mute(!this.volumeOn);
            },
            getCurrentTime: function () {
              var e = this.audioPlayer ? this.audioPlayer.seek() : 0;
              return Math.floor(e);
            },
            savePlayInfo: function () {
              var e = new Date().getTime(),
                t = {
                  startTimestamp: this.timeInfo.startTimestamp,
                  endTimestamp: e,
                  startSecond: this.timeInfo.startSecond,
                  endSecond: this.timeInfo.endSecond,
                  Speed: 1,
                };
              this.$emit("playTimeUpdate", t),
                (this.timeInfo.startTimestamp = e),
                (this.timeInfo.startSecond = this.getCurrentTime()),
                (this.timeInfo.endSecond = 0);
            },
          },
        },
        d = u,
        p = (i("3e02"), i("2877")),
        h = Object(p["a"])(d, o, s, !1, null, "81769eae", null);
      t["a"] = h.exports;
    },
    "2b4a": function (e, t, i) {
      "use strict";
      i("d819");
    },
    "2f01": function (e, t, i) {
      "use strict";
      i("e688");
    },
    "365c": function (e, t, i) {
      "use strict";
      var o = i("5530"),
        s =
          (i("d3b7"),
          i("4d63"),
          i("ac1f"),
          i("25f0"),
          i("466d"),
          i("5319"),
          i("bc3a")),
        a = i.n(s),
        n = i("f3df"),
        r = i("db49"),
        c = {
          login: { url: "/api/TokenAuth/Authenticate", method: "post" },
          getStuInfoByToken: {
            url: "/api/services/app/BaseStuInfo/GetBaseStuInfoAsync",
            method: "get",
          },
          getTeacherInfoByToken: {
            url: "/api/services/app/BaseTeacherInfo/GetTeacherInfoAsync",
            method: "get",
          },
          loginByWX: {
            url: "/api/TokenAuth/AuthenticateByCode",
            method: "post",
          },
        },
        l = {
          getAllCourseList: {
            url: "/api/services/app/TeacherCourseInfo/GetCourseListAsync",
            method: "get",
          },
          getHostList: {
            url: "/api/services/app/TeacherCourseInfo/GetPresideCourseListAsync",
            method: "get",
          },
          getFaceTeachList: {
            url: "/api/services/app/TeacherCourseInfo/GetTeachingCourseListAsync",
            method: "get",
          },
        },
        u = {
          getStuCourseList: {
            url: "/api/services/app/CourseInfo/GetSelectiveCourseListAsync",
            method: "get",
          },
          getHistoryCourseList: {
            url: "/api/services/app/CourseInfo/GetAllHistoryAsync",
            method: "get",
          },
          getCourseCalendar: {
            url: "/api/services/app/CourseInfo/GetWeekInfoAsync?CourseOpenId={courseId}",
            method: "get",
          },
          getCollectedCourse: {
            url: "/api/services/app/CourseCollect/GetCourseCollectJsonAsync",
            method: "get",
          },
          doCollectCourse: {
            url: "/api/services/app/CourseCollect/Collect",
            method: "post",
          },
          cancelCollectCourse: {
            url: "/api/services/app/CourseCollect/Cancel",
            method: "post",
          },
          doCollectRes: {
            url: "/api/services/app/CourseCellCollect/doCollect",
            method: "post",
          },
          getCollectResList: {
            url: "/api/services/app/CourseCellCollect/GetCourseCellCollectJsonAsync",
            method: "get",
          },
          cancelCollectRes: {
            url: "/api/services/app/CourseCellCollect/cancelCollect",
            method: "post",
          },
          getCourseResourceList: {
            url: "/api/services/app/CourseCell/GetDocJsonAsync?courseId={courseId}&fromType={fromType}",
            method: "get",
          },
          getCourseScore: {
            url: "/api/services/app/CourseStudentScore/GetCourseStudentScoreJsonAsync?couserId={courseId}",
            method: "get",
          },
          refreshCourseScore: {
            url: "/api/services/app/HomeWorkStudent/UpdateStuScoreAsync",
            method: "put",
          },
          getCourseScoreDetail: {
            url: "/api/services/app/CourseStudentScore/GetCourseStudentScoreDetailJsonAsync?couserId={courseId}&scoreType={scoreType}",
            method: "get",
          },
          getPerformaceDetail: {
            url: "/api/services/app/CourseHomeWork/GetPerformaceJsonAsync?courseOpenId={courseId}",
            method: "get",
          },
          getResourceRules: {
            url: "/api/services/app/CourseHomeWork/GetResourceRuleJsonAsync?courseOpenId={courseId}",
            method: "get",
          },
          getShouldLearnRes: {
            url: "/api/services/app/CourseCell/GetCourseCellshouldLearnJsonAsync?couserId={courseId}",
            method: "get",
          },
          getLearningPoints: {
            url: "/api/services/app/CourseStuPoint/GetCourseStuPointJsonAsync",
            method: "get",
          },
        },
        d = {
          getCourseDetail: {
            url: "/api/services/app/CourseInfo/GetSelectiveCourseDetailAsync?courseOpenId={courseId}",
            method: "get",
          },
          getStuCourseCatalog: {
            url: "/api/services/app/CourseInfo/GetCatalogAsync?courseOpenId={courseId}",
            method: "get",
          },
          getCourseDocInfo: {
            url: "/api/services/app/CourseInfo/GetSelectiveCourseInfoAsync?courseOpenId={courseId}",
            method: "get",
          },
          getCourseRemindList: {
            url: "/api/services/app/CourseInfo/GetTaskListAsync",
            method: "get",
          },
          doSearchCourse: {
            url: "/api/services/app/TeachCourseInfo/Search",
            method: "post",
          },
          doCollectCourse: {
            url: "/api/services/app/CourseCollect/Collect",
            method: "post",
          },
          cancelCollectCourse: {
            url: "/api/services/app/CourseCollect/Cancel",
            method: "post",
          },
          getCollectedCourseList: {
            url: "/api/services/app/CourseCollect/GetCourseCollectJsonAsync",
            method: "get",
          },
          getCourseStudyWeek: {
            url: "/api/services/app/CourseInfo/GetWeekInfoAsync?CourseOpenId={courseId}",
            method: "get",
          },
          getResPreviewInfo: {
            url: "/api/services/app/DFS/GetPreviewExtendAsync?resource={filekey}",
            method: "get",
          },
          getCourseFileDetail: {
            url: "/api/services/app/CourseCell/GetCourseCellDetailJsonAsync?CourseOpenId={courseId}&CellId={resId}",
            method: "get",
          },
          addRestag: {
            url: "/api/services/app/CourseCell/LabelJsonAsync",
            method: "post",
          },
          addResComment: {
            url: "/api/services/app/CourseCell/CommentJsonAsync",
            method: "post",
          },
          addResStudyTime: {
            url: "/api/services/app/CourseInfo/CellLogAsync",
            method: "post",
          },
          getCourseQAList: {
            url: "/api/services/app/BBSTopic/GetBBSTopic?courseOpenID={courseId}",
            method: "get",
          },
          addCourseQA: {
            url: "/api/services/app/BBSTopic/UpdateBBSTopicJsonAsync",
            method: "put",
          },
          deleteQA: {
            url: "/api/services/app/BBSTopic/DeleteBBSTopicJsonAsync",
            method: "delete",
          },
          getQAReplyList: {
            url: "/api/services/app/BBSReply/GetBBSReply",
            method: "get",
          },
          addQAReply: {
            url: "/api/services/app/BBSReply/UpdateBBSReplyJsonAsync",
            method: "put",
          },
          doLikeQA: {
            url: "/api/services/app/BBSReply/BBSReplyPraseJsonAsync",
            method: "post",
          },
          getCourseWorkList: {
            url: "/api/services/app/HomeWorkStudent/GetHomeWorkListJsonAsync?courseId={courseId}",
            method: "get",
          },
          getCoursePracticeList: {
            url: "/api/services/app/CourseHomeWork/GetCourseHomeWorkListJsonAsync?homeWorkType={workType}&courseOpenId={courseId}",
            method: "get",
          },
          getCoursePracticeDetail: {
            url: "/api/services/app/CourseLaboratory/GetCourseLabAsync?courseOpenId={courseId}&CourseLaboratoryId={workId}",
            method: "get",
          },
          uploadPracticeFile: {
            url: "/api/services/app/CourseLaboratory/SubmitJsonAsync",
            method: "post",
          },
          getWorkInfo: {
            url: "/api/services/app/HomeWorkStudent/GetHomeWorkDetailListJsonAsync?id={workId}",
            method: "get",
          },
          getWorkRecordList: {
            url: "/api/services/app/HomeWorkStudent/GetAnswerHistoryListJsonAsync?id={workId}",
            method: "get",
          },
          getRecordQuestions: {
            url: "/api/services/app/HomeWorkStudent/GetAnswerDeatilJsonAsync",
            method: "get",
          },
          getWorkQuestions: {
            url: "/api/services/app/HomeWorkStudent/GetQuestionListJsonAsync?id={workId}",
            method: "get",
          },
          submitAnswer: {
            url: "/api/services/app/HomeWorkStudent/SubmitJsonAsync",
            method: "post",
          },
          submitAnswerAll: {
            url: "/api/services/app/HomeWorkStudent/SubmitAllJsonAsync",
            method: "post",
          },
          submitPaper: {
            url: "api/services/app/HomeWorkStudent/FinishJsonAsync",
            method: "post",
          },
          uploadFile: {
            url: "/api/services/app/NetDisk/UploadFile?fileName={fileName}",
            method: "post",
          },
          getCourseEvaluation: {
            url: "/api/services/app/CourseEvaluation/GetCourseEvaluationJsonAsync",
            method: "get",
          },
          submitEvaluationAnswer: {
            url: "/api/services/app/CourseEvaluation/SaveCourseEvaluationJsonAsync",
            method: "post",
          },
          finishEvaluation: {
            url: "/api/services/app/CourseEvaluation/FinishCourseEvaluationJsonAsync",
            method: "post",
          },
          getTeamActivityList: {
            url: "/api/services/app/CourseGroupActivity/GetCourseGroupActivityJsonAsync",
            method: "get",
          },
          getTeamActivityDetail: {
            url: "/api/services/app/CourseGroupActivity/GetDetailJsonAsync",
            method: "get",
          },
          getTeamFiles: {
            url: "/api/services/app/CourseGroupActivity/GetUploadFileJsonAsync",
            method: "get",
          },
          deleteTeamFiles: {
            url: "/api/services/app/CourseGroupActivity/DeleteUploadFileJsonAsync",
            method: "delete",
          },
          uploadTeamFile: {
            url: "/api/services/app/CourseGroupActivity/UpdateUploadFileJsonAsync",
            method: "put",
          },
          getTeamBBS: {
            url: "/api/services/app/CourseGroupActivity/GetBbsJsonAsync",
            method: "get",
          },
          addTeamBBS: {
            url: "/api/services/app/CourseGroupActivity/UpdateBbsJsonAsync",
            method: "put",
          },
          deleteTeamBBS: {
            url: "/api/services/app/CourseGroupActivity/DeleteBbsJsonAsync",
            method: "delete",
          },
          getTeamBBSReplys: {
            url: "/api/services/app/CourseGroupActivity/GetBbsReplyJsonAsync",
            method: "get",
          },
          addBBSReply: {
            url: "/api/services/app/CourseGroupActivity/UpdateBbsReplyJsonAsync",
            method: "put",
          },
          getTeamMembers: {
            url: "/api/services/app/CourseGroupActivity/GetMembersJsonAsync",
            method: "get",
          },
          getTeamComment: {
            url: "/api/services/app/CourseGroupActivity/GetAppJsonAsync",
            method: "get",
          },
        },
        p = i("04ac"),
        h = i.n(p),
        f = Object(o["a"])(
          Object(o["a"])(Object(o["a"])(Object(o["a"])({}, c), l), u),
          d
        );
      function m(e, t) {
        var i = e || "",
          s = t || {},
          a = Object.prototype.toString.call(s),
          n = new RegExp("{.*?}", "g"),
          r = i.match(n);
        if (r) {
          if ("[object Object]" !== a && "[object FormData]" !== a)
            throw new Error("paramsData should be a object");
          var c = {};
          c = "[object FormData]" === a ? t : Object(o["a"])({}, s);
          for (var l = 0; l < r.length; l++) {
            var u = r[l].replace(/\{|\}/g, "");
            if ("[object FormData]" === a) {
              if ("" === c.get(u) || void 0 === c.get(u))
                throw new Error(
                  "error url params: " + u + " not in paramsData"
                );
              var d = new RegExp(r[l], "g");
              (i = i.replace(d, c.get(u))), c.delete(u);
            } else {
              if ("" === c[u] || void 0 === c[u])
                throw new Error(
                  "error url params: " + u + " not in paramsData"
                );
              var p = new RegExp(r[l], "g");
              (i = i.replace(p, c[u])), delete c[u];
            }
          }
          return { baseUrl: i, data: c };
        }
        return { baseUrl: i, data: s };
      }
      var g = a.a.create({ baseURL: "/".concat(r["a"].apiPrefix) });
      function v(e, t, i) {
        if (!f[e]) throw new Error("no these api: " + e + " resouce");
        var o = f[e].url,
          s = m(o, t),
          a = f[e].method.toLocaleLowerCase(),
          r = { url: s.baseUrl, method: a },
          c = Object(n["d"])("userInfo") || {},
          l = { "Abp.TenantId": "1" };
        c.token && (l.Authorization = "Bearer ".concat(c.token) || !1);
        var u = {};
        if (
          (i && (u = Object.assign(u, i)),
          i &&
            i.headers &&
            ((l = Object.assign(l, u.headers)), delete u.headers),
          i &&
            i.responseType &&
            ((r.responseType = u.responseType), delete u.responseType),
          "post" === a || "put" === a || "patch" === a)
        )
          s.data && s.data._dataArr
            ? (r.data = s.data._dataArr)
            : s.data && (r.data = s.data);
        else {
          var d = s.data;
          "get" === a && (d._timeTag = new Date().valueOf()), (r.params = d);
        }
        return (r.headers = l), Object.assign(r, u), g.request(r);
      }
      h()(g, {
        retries: 3,
        retryDelay: function (e) {
          return 2e3 * e;
        },
        shouldResetTimeout: !0,
        retryCondition: function (e) {
          return "/api/services/app/CourseInfo/CellLogAsync" === e.config.url;
        },
      }),
        g.interceptors.response.use(
          function (e) {
            var t,
              i = e.data || {},
              o = {};
            if (((o.code = i.success ? "0" : "1"), i.unAuthorizedRequest))
              return Promise.resolve({
                code: "1",
                message: "登录凭证过期,请重新登陆应用",
              });
            var s = i.result || {};
            return (
              s && s.items
                ? (o.data = s.items)
                : s && s.data
                ? (o.data = s.data)
                : (o.data = s),
              (o.total =
                (i.result || {}).total ||
                (i.result || {}).totalCount ||
                i.total ||
                null),
              (o.message = i.success
                ? ""
                : (null === (t = i.error) || void 0 === t
                    ? void 0
                    : t.message) || i.error.toString()),
              Promise.resolve(o)
            );
          },
          function (e) {
            var t = e.response,
              i = t.data || {},
              o = i.status,
              s = i.statusText,
              a = {};
            return (
              (a.code = i.success ? "0" : o),
              (a.data = i.result || {}),
              (a.message = (i.error && i.error.message) || s),
              Promise.resolve(a)
            );
          }
        );
      var y = v,
        I = {
          login: { url: "/auth/login/local", method: "post" },
          getDataDictionary: {
            url: "/auth/dict/dictInfo/alllist",
            method: "get",
          },
          getRoleInfoList: { url: "/auth/system/roleInfo/list", method: "get" },
          getCurrentTermCode: {
            url: "/basic/api/termInfo/currentTerm",
            method: "get",
          },
          loginByWX: {
            url: "/auth/appApi/login/getUserInfoByWeChatCode",
            method: "get",
          },
          getStuInfoByToken: {
            url: "/auth/appApi/login/getUserByLoginToken",
            method: "get",
          },
          getTeacherInfoByToken: {
            url: "/auth/appApi/login/getUserByLoginToken",
            method: "get",
          },
        },
        C = {
          treeCourse: {
            url: "/course/course/{courseId}/courseChapterInfo/treeCourseChapterInfoForStu",
            method: "get",
          },
          getMyCourse: {
            url: "/course/api/courseInfo/detail/{courseId}",
            method: "get",
          },
          getCourseRemindList: {
            url: "/msg/api/remindInfo/list",
            method: "get",
          },
          getCourseInfoList: {
            url: "/course/courseDetailInfo/list",
            method: "get",
          },
          getComments: {
            url: "/bbs/api/bbsPostInfo/resourceCommentInfoList",
            method: "get",
          },
          addComment: {
            url: "/bbs/api/bbsPostInfo/addResourcePostComment",
            method: "post",
          },
          addCommentReply: { url: "/bbs/api/bbsPostInfo/add", method: "post" },
          addBBsLike: {
            url: "/bbs/api/bbsPostInfo/like/{commentId}",
            method: "post",
          },
          getResTagList: {
            url: "/study/api/studyResTagInfo/list",
            method: "get",
          },
          addRestag: { url: "/study/api/studyResTagInfo/add", method: "post" },
          deleteResTag: {
            url: "/study/api/studyResTagInfo/delete/{id}",
            method: "post",
          },
          studyList: {
            url: "/course/user/myCourseInfo/studyList?isApp=1",
            method: "get",
          },
          fileDetail: {
            url: "/file/api/fileCourseMid/detail/{courseId}",
            method: "get",
          },
          getAllPosts: { url: "/bbs/api/bbsPostInfo/list", method: "get" },
          addPosts: { url: "/bbs/api/bbsPostInfo/add", method: "post" },
          updatePosts: {
            url: "/bbs/api/bbsPostInfo/update/{uid}",
            method: "post",
          },
          deletePosts: {
            url: "/bbs/api/bbsPostInfo/delete/{uid}",
            method: "post",
          },
          setEssence: {
            url: "/bbs/api/bbsPostInfo/isEssencePostInfo?uid={uid}&isEssence={isEssence}",
            method: "post",
          },
          courseInformation: {
            url: "/course/courseDetailInfo/courseItemInfoPhone",
            method: "get",
          },
          doSearchCourse: {
            url: "/basic/api/basicCourseInfoIndex/searchList",
            method: "get",
          },
          getCollectedCourseList: {
            url: "/course/user/myCourseInfo/collectionList?isApp=1",
            method: "get",
          },
          doCollectCourse: {
            url: "/course/user/myCourseInfo/collectionCourse/{courseId}",
            method: "post",
          },
          getCourseDetail: {
            url: "/course/api/courseInfo/detail/{courseId}",
            method: "get",
          },
          cancelCollectCourse: {
            url: "/course/user/myCourseInfo/cancelCollection/{courseId}",
            method: "post",
          },
          getCollectResList: {
            url: "/study/api/studyResCollectInfo/list",
            method: "get",
          },
          doCollectRes: {
            url: "/study/api/studyResCollectInfo/collectionRes",
            method: "post",
          },
          cancelCollectRes: {
            url: "/study/api/studyResCollectInfo/cancelCollectionRes/{resActId}",
            method: "post",
          },
          checkHasCollectedRes: {
            url: "/study/api/studyResCollectInfo/ifCollect?resActId={resActId}",
            method: "get",
          },
          studList: {
            url: "/course/courseTutorResInfo/studList",
            method: "get",
          },
          courseInfoList: {
            url: "/course/user/myCourseInfo/studyList?isApp=1",
            method: "get",
          },
          myStudyHistoryList: {
            url: "/course/user/myCourseInfo/myStudyHistoryList",
            method: "get",
          },
          getStuOnlineWorklist: {
            url: "/course/course/{courseId}/courseHomeworkInfo/homeworkInfoListForStu",
            method: "get",
          },
          getCourseExamSettingList: {
            url: "/course/api/checkOptionInfo/detail",
            method: "get",
          },
          detailForStud: {
            url: "/course/api/checkOptionInfo/detailForStud",
            method: "get",
          },
          selectContentInfoListForStu: {
            url: "/course/api/checkContentInfo/selectContentInfoListForStu",
            method: "get",
          },
          practiceForStu: {
            url: "/course/course/{courseId}/courseHomeworkInfo/homeworkInfoListForStu",
            method: "get",
          },
          onlinePracticeDetail: {
            url: "/course/course/{courseId}/courseHomeworkInfo/homeworkInfoForStu/{uid}",
            method: "get",
          },
          getMessageList: { url: "/msg/api/remindInfo/list", method: "get" },
          examinateScore: {
            url: "/study/api/studyCheckResultInfo/studList",
            method: "get",
          },
          getFinalExamStuStatus: {
            url: "/exam/api/finalExamCourseInfo/recordForStud",
            method: "get",
          },
          getPracticeInfo: {
            url: "/course/course/{courseId}/courseHomeworkInfo/homeworkInfoForStu/{uid}",
            method: "get",
          },
          getWorkInfo: {
            url: "/course/api/checkContentInfo/detailForStu",
            method: "get",
          },
          onlinePractice: {
            url: "/course/course/{courseId}/courseHomeworkInfo/homeworkInfoListForStu",
            method: "get",
          },
          getExamAnswerRecords: {
            url: "/exam/api/studyPaperInfo/detailList",
            method: "get",
          },
          getPapaerQuestions: {
            url: "/exam/api/hasAnswerDetail",
            method: "get",
          },
          addAnswer: { url: "/exam/api/studyPaperInfo/add", method: "post" },
          submitPaper: {
            url: "/exam/api/studyPaperInfo/submitPaper",
            method: "post",
          },
          uploadExamFile: {
            url: "/file/api/fileStudMid/upload/questionAnswer",
            method: "post",
          },
          getUploadExamFile: {
            url: "/file/api/fileStudMid/detail",
            method: "get",
          },
          getCourseFileDetail: {
            url: "/file/api/fileCourseMid/detail/{courseId}",
            method: "get",
          },
          lastDetail: {
            url: "/exam/api/studyPaperInfo/lastDetail",
            method: "get",
          },
          sendSMS: { url: "/msg/innerApi/sendSmsCode", method: "post" },
          getTeachActivityDetail: {
            url: "/course/api/courseActInfo/detail/{id}",
            method: "get",
          },
          addTeachActivity: {
            url: "/course/api/courseActInfo/add",
            method: "post",
          },
          updateTeachActivity: {
            url: "/course/api/courseActInfo/update/{id}",
            method: "post",
          },
          getCourseStudyWeek: {
            url: "/course/course/{courseId}/courseChapterInfo/selectCourseChapterListForWeek",
            method: "get",
          },
          getAllTerm: { url: "/basic/api/termInfo/list", method: "get" },
          getCourseAppriseTotal: {
            url: "/exam/api/appraiseUserInfo/appraiseDetail",
            method: "get",
          },
          getCourseAppriseQuestions: {
            url: "/exam/api/appraiseInfo/detailContent/{uid}",
            method: "get",
          },
          getCourseAppriseSummary: {
            url: "/exam/api/appraiseUserInfo/appraiseSummary",
            method: "get",
          },
          getCourseAppriseAnsDetail: {
            url: "/exam/api/appraiseUserInfo/appraiseSummaryQuery",
            method: "get",
          },
          getTeacherApprises: {
            url: "/exam/api/appraiseInfo/list",
            method: "get",
          },
        },
        A = {
          getAllCourseList: {
            url: "/course/user/myCourseInfo/myCourseInfoList?isApp=1",
            method: "get",
          },
          getHostList: {
            url: "/course/user/myCourseInfo/hostList?isApp=1",
            method: "get",
          },
          getFaceTeachList: {
            url: "/course/user/myCourseInfo/faceTeachList?isApp=1",
            method: "get",
          },
          getCourseChapterInfo: {
            url: "/course/course/{courseId}/courseChapterInfo/treeCourseChapterInfo",
            method: "get",
          },
          getTeachActivityList: {
            url: "/course/api/courseActInfo/listForCourse",
            method: "get",
          },
          getCourseQAList: { url: "/bbs/api/bbsPostInfo/list", method: "get" },
          getPostCommentInfoList: {
            url: "/bbs/api/bbsPostInfo/postCommentInfoList",
            method: "get",
          },
          getCourseWorkList: {
            url: "/course/api/checkContentInfo/list",
            method: "get",
          },
          getOnlinePracticeList: {
            url: "/course/course/{courseId}/courseHomeworkInfo/list",
            method: "get",
          },
          addOnlinePractice: {
            url: "/course/api/checkContentInfo/add",
            method: "post",
          },
          getOnlinePracticeDetail: {
            url: "/course/api/checkContentInfo/detail/{id}",
            method: "get",
          },
          getPracticeQuestionDetail: {
            url: "/exam/course/{courseId}/paperInfo/questionUseStat/{paperId}",
            method: "get",
          },
          getTeachResearchActivity: {
            url: "/course/api/courseTeachActInfo/list",
            method: "get",
          },
          saveTeachResearchActivity: {
            url: "/course/api/courseTeachActInfo/save",
            method: "post",
          },
          getTeachResearchActivityDetail: {
            url: "/course/api/courseTeachActInfo/detail/{uid}",
            method: "get",
          },
          getCourseClasses: {
            url: "/edumanage/api/classInfo/classList?courseId={courseId}",
            method: "get",
          },
          getSubSchools: {
            url: "/auth/dict/dictInfo/subSchoolList?courseId={courseId}",
            method: "get",
          },
          getStuScore: {
            url: "/study/api/studyCheckResultInfo/teachList",
            method: "get",
          },
        },
        w = {
          getStuCourseList: {
            url: "/course/user/myCourseInfo/studyList?isApp=1",
            method: "get",
          },
          getHistoryCourseList: {
            url: "/course/user/myCourseInfo/myStudyHistoryList",
            method: "get",
          },
          getCourseCalendar: {
            url: "/courseChapterInfo/selectCourseChapterListForWeek",
            method: "get",
          },
          getCourseResourceList: {
            url: "/course/courseTutorResInfo/studList?isSelf={isSelf}",
            method: "get",
          },
          addResStudyTime: {
            url: "/study/api/studyResInfo/add",
            method: "post",
          },
          getStuCourseCatalog: {
            url: "/course/course/{courseId}/courseChapterInfo/treeCourseChapterInfoForStu",
            method: "get",
          },
          getStuCourseResDetail: {
            url: "/study/api/studyResInfo/perview",
            method: "get",
          },
          getStuExamList: {
            url: "/course/api/checkContentInfo/checkContentInfoListForStu",
            method: "get",
          },
          getStuExamDetail: {
            url: "/course/api/checkContentInfo/detailForStu",
            method: "get",
          },
          stuUploadPracticeFile: {
            url: "/file/api/fileStudMid/upload/bizFile",
            method: "post",
          },
          stuUploadTeamWorkFile: {
            url: "/file/api/fileStudMid/upload/bizFile",
            method: "post",
          },
          getStuPracticeFile: {
            url: "/file/api/fileStudMid/detailCheckFile",
            method: "get",
          },
          getTeamWorkGroupList: {
            url: "/edumanage/api/classGroupInfo/listForStud",
            method: "get",
          },
          getTeamWorkFileList: {
            url: "/file/api/fileStudMid/upload/bizFileList",
            method: "get",
          },
          downLoadStuFile: {
            url: "/file/api/fileStudMid/download",
            method: "get",
          },
          deleteStuFile: {
            url: "/file/api/fileStudMid/deleteFile?filekey={filekey}",
            method: "post",
          },
          getTeamGroupMembers: {
            url: "/edumanage/api/classGroupInfo/groupStudList",
            method: "get",
          },
          getTeamWorkBBSList: {
            url: "/bbs/api/bbsPostInfo/list",
            method: "get",
          },
          getTeamWorkScoreList: {
            url: "/study/api/manageScore/groupScoreList",
            method: "get",
          },
          getCourseScore: {
            url: "/study/api/studyCheckResultInfo/studList",
            method: "get",
          },
          getCourseScoreWithSetting: {
            url: "/study/api/studyCheckResultInfo/detailStudyCheckResult",
            method: "get",
          },
          refreshCourseScore: {
            url: "/study/api/studyCheckResultInfo/refreshNewScore",
            method: "get",
          },
          getCourseScoreDetail: {
            url: "/study/api/resultDetail/detailListForApp",
            method: "get",
          },
          getShouldLearnRes: {
            url: "/study/api/studyResInfo/detailResBrowse",
            method: "get",
          },
          getLearningPoints: {
            url: "/auth/api/integralUserInfo/todayIntegral",
            method: "get",
          },
          getTotalLearningPoints: {
            url: "/auth/api/integralUserInfo/myIntegral",
            method: "get",
          },
          getStuAppraiseList: {
            url: "/exam/api/appraiseInfo/listForStud",
            method: "get",
          },
          getStuAppraiseData: {
            url: "/exam/api/appraiseUserInfo/userData",
            method: "get",
          },
          submitEvaluationAnswer: {
            url: "/exam/api/appraiseUserInfo/add",
            method: "post",
          },
        },
        b = Object(o["a"])(
          Object(o["a"])(Object(o["a"])(Object(o["a"])({}, I), C), A),
          w
        );
      function T(e, t) {
        var i = e || "",
          s = t || {},
          a = Object.prototype.toString.call(s),
          n = new RegExp("{.*?}", "g"),
          r = i.match(n);
        if (r) {
          if ("[object Object]" !== a && "[object FormData]" !== a)
            throw new Error("paramsData should be a object");
          var c = {};
          c = "[object FormData]" === a ? t : Object(o["a"])({}, s);
          for (var l = 0; l < r.length; l++) {
            var u = r[l].replace(/\{|\}/g, "");
            if ("[object FormData]" === a) {
              if ("" === c.get(u) || void 0 === c.get(u))
                throw new Error(
                  "error url params: " + u + " not in paramsData"
                );
              var d = new RegExp(r[l], "g");
              (i = i.replace(d, c.get(u))), c.delete(u);
            } else {
              if ("" === c[u] || void 0 === c[u])
                throw new Error(
                  "error url params: " + u + " not in paramsData"
                );
              var p = new RegExp(r[l], "g");
              (i = i.replace(p, c[u])), delete c[u];
            }
          }
          return { baseUrl: i, data: c };
        }
        return { baseUrl: i, data: s };
      }
      var S = a.a.create({
        baseURL:
          "java_api" === r["a"].apiPrefix && r["a"].isProduction
            ? "https://newlearning-back.shou.org.cn"
            : "/".concat(r["a"].apiPrefix),
      });
      function x(e, t, i) {
        if (!b[e]) throw new Error("no these api: " + e + " resouce");
        var o = b[e].url,
          s = T(o, t),
          a = b[e].method.toLocaleLowerCase(),
          r = { url: s.baseUrl, method: a },
          c = Object(n["d"])("userInfo") || {},
          l = Object(n["d"])("currentRole") || "",
          u = Object(n["d"])("lang") || "zh",
          d = { "x-current-lang": "en" === u ? "en-US" : "zh-CN" };
        c.token && (d["x-accept-token"] = c.token),
          l && (d["x-current-role"] = l);
        var p = {};
        if (
          (i && (p = Object.assign(p, i)),
          i &&
            i.headers &&
            ((d = Object.assign(d, p.headers)), delete p.headers),
          i &&
            i.responseType &&
            ((r.responseType = p.responseType), delete p.responseType),
          "post" === a || "put" === a || "patch" === a)
        )
          s.data && s.data._dataArr
            ? (r.data = s.data._dataArr)
            : s.data && (r.data = s.data);
        else {
          var h = s.data;
          "get" === a && (h._timeTag = new Date().valueOf()), (r.params = h);
        }
        return (r.headers = d), Object.assign(r, p), S.request(r);
      }
      S.interceptors.response.use(
        function (e) {
          var t = e.data || {};
          if ("100402" !== t.code) return Promise.resolve(t);
          window.location.href = "/login/index.html";
        },
        function (e) {
          var t = { code: "1", data: null, message: e.toString() };
          return Promise.resolve(t);
        }
      );
      var P = "dotNet_api" === r["a"].apiPrefix ? y : x;
      t["a"] = P;
    },
    "3e02": function (e, t, i) {
      "use strict";
      i("9238");
    },
    "3e98": function (e, t, i) {
      "use strict";
      i("b0d0");
      var o = i("3c69"),
        s = (i("4d63"), i("ac1f"), i("25f0"), i("5319"), i("2b0e")),
        a = i("8c4f"),
        n = i("a925"),
        r = i("365c"),
        c = i("f3df"),
        l = i("aa6a"),
        u = i("2610"),
        d =
          (i("7db0"),
          function (e) {
            var t = katex.renderToString(e, { throwOnError: !1 });
            return t;
          }),
        p = function () {
          window.mathTxtLoad = function (e) {
            var t = $("img.latex-text-img-".concat(e));
            if (t.length >= 1)
              for (var i = t.length, o = 0; o < i; o++) {
                var s = $(t[o]),
                  a = s.parent(),
                  n = a.data("math");
                if (n && a.find(".katex").length <= 0) {
                  var r = d(n);
                  r && a.append(r);
                }
              }
          };
        },
        h = i("d4b0"),
        f = i("8c18"),
        m = {
          homeTitle: "中文首页",
          bottomNav: {
            courseLearning: "课程学习",
            courseCatalog: "学习目录",
            courseResource: "补充资源",
            home: "首页",
            courseInfo: "课程信息",
            courseQA: "课程问答",
            teachActivity: "教学活动",
            courseWork: "课程作业",
            personal: "个人中心",
            course: "课程",
            researchActivity: "教研活动",
          },
          teacherHome: {
            settingBtn: "设置",
            courseList: "主持课程",
            faceCourse: "面授课程",
            courseHomeWork: "课程作业",
            courseSearch: "课程搜索",
            collectCourse: "收藏课程",
            teachActivity: "教研活动",
            bysj: "毕业设计",
            zxkf: "在线客服",
            xkcj: "形考成绩",
          },
        },
        g = {
          homeTitle: "English Title",
          bottomNav: {
            courseLearning: "CourseLearning",
            courseCatalog: "CourseCatalog",
            courseResource: "Resource",
            home: "Home",
            courseInfo: "CourseInfo",
            courseQA: "CourseQA",
            teachActivity: "TeachActivity",
            courseWork: "CourseWork",
            personal: "Personal",
            course: "Course",
            researchActivity: "ResearchActivity",
          },
          teacherHome: {
            settingBtn: "Setting",
            courseList: "HostCourse",
            faceCourse: "InPersonCourse",
            courseHomeWork: "CourseWork",
            courseSearch: "CourseSearch",
            collectCourse: "FavoriteCourse",
            teachActivity: "T&R Activities",
            bysj: "Graduation Project",
            zxkf: "Online Service",
            xkcj: "FormTest Score",
          },
        },
        v = { "zh-CN": m, "en-US": g };
      (s["a"].config.productionTip = !1),
        s["a"].use(a["a"]),
        s["a"].use(n["a"]);
      var y = Object(c["d"])("lang") || "zh";
      Object(c["f"])("lang", y);
      var I = { zh: "zh-CN", en: "en-US" },
        C = { zh: f["a"], en: h["a"] },
        A = new n["a"]({ locale: I[y], messages: v });
      o["a"].use(I[y], C[y]),
        (s["a"].prototype.$changeLanguage = function (e) {
          e in I &&
            (o["a"].use(I[e], C[e]),
            (A.locale = I[e]),
            Object(c["f"])("lang", e));
        }),
        (s["a"].prototype.$API = r["a"]),
        (s["a"].prototype.$getItem = c["d"]),
        (s["a"].prototype.$setItem = c["f"]);
      var w = function (e, t) {
          var i = Object(c["d"])("userInfo");
          if (
            i &&
            i.userId &&
            13 === i.userId.length &&
            i.userId.indexOf("223100120") >= 0
          )
            return (window.location.href = "/notice_info.html"), null;
          new s["a"]({
            router: t,
            i18n: A,
            created: function () {
              p();
            },
            render: function (t) {
              return t(e);
            },
          }).$mount("#app");
        },
        b = function (e, t) {
          var i = Object(c["d"])("userInfo");
          if (i && i.token) w(e, t);
          else {
            var o = Object(l["d"])();
            o && o.code && "wxlogin" === o.state
              ? Object(u["c"])(o.code, function () {
                  var i = window.location.href,
                    s = new RegExp("&?code=".concat(o.code, "&?")),
                    a = new RegExp("&?state=".concat(o.state, "&?"));
                  (i = i.replace(s, "")),
                    (i = i.replace(a, "")),
                    window.location.replace(i),
                    w(e, t);
                })
              : -1 === window.location.href.indexOf("login")
              ? Object(u["d"])()
              : w(e, t);
          }
        };
      t["a"] = b;
    },
    4257: function (e, t, i) {},
    "45ee": function (e, t, i) {
      e.exports = i.p + "img/course_qa_activity.f4991224.png";
    },
    "498b": function (e, t, i) {},
    "4c0f": function (e, t, i) {
      "use strict";
      var o = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i("div", { ref: "videoContainer", staticClass: "video-item" });
        },
        s = [],
        a = i("b85c"),
        n = (i("4e82"), i("4de4"), i("159b"), i("fb6a"), i("f7a5")),
        r = i.n(n),
        c = {
          name: "VideoPlayer",
          props: ["source", "cover", "subtitle", "lastPlayTime", "highlight"],
          data: function () {
            return {
              dpPlayer: null,
              highlightPause: [],
              timeInfo: {
                startSecond: 0,
                endSecond: 0,
                startTimestamp: 0,
                endTimestamp: 0,
              },
              continuePlay: 0,
            };
          },
          watch: {
            source: function () {
              this.dpPlayer
                ? (this.dpPlayer.destroy(), this.initPlayer())
                : this.initPlayer();
            },
            highlight: function () {
              this.initHighLight();
            },
          },
          beforeDestroy: function () {
            this.dpPlayer && this.dpPlayer.destroy();
          },
          mounted: function () {
            this.initPlayer();
          },
          methods: {
            initPlayer: function () {
              var e = this;
              if (this.source) {
                var t = {
                  container: this.$refs.videoContainer,
                  lang: "en" === this.$getItem("lang") ? "en" : "zh-cn",
                  contextmenu: [],
                };
                this.source && (t.video = { url: this.source }),
                  this.cover &&
                    (t.video = Object.assign(
                      { pic: this.cover },
                      t.video || {}
                    )),
                  this.subtitle && (t.subtitle = { url: this.subtitle }),
                  (this.dpPlayer = new r.a(t)),
                  this.dpPlayer.on("play", function () {
                    var t = e.currentTime();
                    (e.timeInfo.startSecond = t),
                      (e.timeInfo.startTimestamp = new Date().getTime()),
                      (e.continuePlay = 0),
                      e.$emit("play", t);
                  }),
                  this.dpPlayer.on("pause", function () {
                    var t = e.currentTime();
                    e.$emit("pause", t), e.savePlayInfo();
                  }),
                  this.dpPlayer.on("loadedmetadata", function () {
                    e.highlight && e.initHighLight(),
                      e.lastPlayTime &&
                        e.lastPlayTime <
                          Math.floor(e.dpPlayer.video.duration) &&
                        e.jumpToTime(e.lastPlayTime),
                      e.lastPlayTime &&
                        e.lastPlayTime ==
                          Math.floor(e.dpPlayer.video.duration) &&
                        e.jumpToTime(0),
                      e.initPlayEvent();
                  });
              }
            },
            initHighLight: function () {
              var e = this,
                t = this.highlight;
              if (
                ((this.highlightPause = (this.highlight || [])
                  .filter(function (e) {
                    return e.needPause && e.time;
                  })
                  .sort(function (e, t) {
                    return e.time - t.time;
                  })),
                this.dpPlayer && ((this.dpPlayer.options.highlight = t), t))
              ) {
                var i =
                  this.$refs.videoContainer.querySelectorAll(
                    ".dplayer-highlight"
                  );
                [].slice.call(i, 0).forEach(function (t) {
                  e.dpPlayer.template.playedBarWrap.removeChild(t);
                });
                for (var o = 0; o < t.length; o++)
                  if (t[o].text && t[o].time) {
                    var s = document.createElement("div");
                    s.classList.add("dplayer-highlight"),
                      (s.style.left =
                        (t[o].time / this.dpPlayer.video.duration) * 100 + "%"),
                      (s.innerHTML =
                        '<span class="dplayer-highlight-text">' +
                        t[o].text +
                        "</span>"),
                      this.dpPlayer.template.playedBarWrap.insertBefore(
                        s,
                        this.dpPlayer.template.playedBarTime
                      );
                  }
              }
            },
            initPlayEvent: function () {
              var e = this,
                t = this.timeInfo.startSecond || 0;
              this.dpPlayer.on("timeupdate", function () {
                var i = e.currentTime();
                if (i < t)
                  return (
                    (t = i),
                    (e.continuePlay = 0),
                    !e.dpPlayer.video.paused && e.savePlayInfo(),
                    !1
                  );
                if (i - t < 1) return !1;
                e.continuePlay += 1;
                var o = !1,
                  s = e.highlightPause;
                if (s.length > 0) {
                  var n,
                    r = Object(a["a"])(s);
                  try {
                    for (r.s(); !(n = r.n()).done; ) {
                      var c = n.value;
                      if (t < c.time && i >= c.time) {
                        e.$emit("pauseAtHighlight", c),
                          (o = !0),
                          (t = c.time),
                          (e.continuePlay = 0),
                          e.jumpToTime(c.time),
                          e.dpPlayer.pause();
                        break;
                      }
                    }
                  } catch (l) {
                    r.e(l);
                  } finally {
                    r.f();
                  }
                }
                o ||
                  (i - t >= 2
                    ? (!e.dpPlayer.video.paused && e.savePlayInfo(),
                      (e.continuePlay = 0),
                      (t = i))
                    : ((t = i), (e.timeInfo.endSecond = t))),
                  e.continuePlay >= 60 &&
                    !e.dpPlayer.video.paused &&
                    ((e.continuePlay = 0), e.savePlayInfo());
              });
            },
            jumpToTime: function (e) {
              this.dpPlayer.seek(e);
            },
            currentTime: function () {
              return this.dpPlayer
                ? Math.floor(this.dpPlayer.video.currentTime)
                : 0;
            },
            savePlayInfo: function () {
              var e = new Date().getTime(),
                t = {
                  startTimestamp: this.timeInfo.startTimestamp,
                  endTimestamp: e,
                  startSecond: this.timeInfo.startSecond,
                  endSecond: this.timeInfo.endSecond,
                  Speed: this.getSpeed(),
                };
              this.$emit("playTimeUpdate", t),
                (this.timeInfo.startTimestamp = e),
                (this.timeInfo.startSecond = this.currentTime()),
                (this.timeInfo.endSecond = 0),
                (this.continuePlay = 0);
            },
            goOnPlay: function () {
              this.dpPlayer && this.dpPlayer.play();
            },
            getSpeed: function () {
              var e = document.querySelector("video");
              return e ? e.playbackRate : null;
            },
          },
        },
        l = c,
        u = (i("b505"), i("2877")),
        d = Object(u["a"])(l, o, s, !1, null, "6d0ceb52", null);
      t["a"] = d.exports;
    },
    "519e": function (e, t, i) {
      e.exports = i.p + "img/course_qa.af2e3e51.png";
    },
    "523f": function (e, t, i) {},
    "532f": function (e, t, i) {},
    "55d6": function (e, t, i) {
      e.exports = i.p + "img/home_icon.56a7f49c.png";
    },
    "595a": function (e, t) {
      e.exports =
        "data:image/png;base64,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";
    },
    "59d2": function (e, t, i) {
      "use strict";
      i("498b");
    },
    "5af1": function (e, t, i) {
      "use strict";
      i("c0f0");
    },
    "5e49": function (e, t) {
      e.exports =
        "data:image/png;base64,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";
    },
    "5f15": function (e, t, i) {},
    6569: function (e, t, i) {},
    "6a24": function (e, t, i) {},
    "6cd1": function (e, t, i) {
      "use strict";
      i("5f15");
    },
    7429: function (e, t, i) {
      "use strict";
      i("532f");
    },
    7950: function (e, t, i) {
      "use strict";
      i("f797");
    },
    "7c30": function (e, t, i) {
      "use strict";
      i("523f");
    },
    "7dca": function (e, t, i) {},
    8700: function (e, t, i) {
      "use strict";
      i("fd27");
    },
    "89d4": function (e, t, i) {},
    "8b3e": function (e, t, i) {
      "use strict";
      i("e275");
    },
    "8d27": function (e, t, i) {
      "use strict";
      var o = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "div",
            { staticClass: "question-options" },
            [
              "1" === e.questionType || "3" === e.questionType
                ? [
                    i(
                      "RadioGroup",
                      {
                        model: {
                          value: e.singleSelect,
                          callback: function (t) {
                            e.singleSelect = t;
                          },
                          expression: "singleSelect",
                        },
                      },
                      e._l(e.optionsArr, function (t, o) {
                        return i(
                          "Radio",
                          {
                            key: "" + t.optionId,
                            staticClass: "option-item",
                            attrs: {
                              name: t.optionId,
                              disabled: e.closeAnswer,
                            },
                          },
                          [
                            e._v(
                              " " +
                                e._s(
                                  String.fromCharCode(97 + o).toUpperCase() +
                                    ". " +
                                    t.optionText
                                ) +
                                " "
                            ),
                          ]
                        );
                      }),
                      1
                    ),
                  ]
                : "2" === e.questionType
                ? [
                    i(
                      "CheckboxGroup",
                      {
                        model: {
                          value: e.userAnswer,
                          callback: function (t) {
                            e.userAnswer = t;
                          },
                          expression: "userAnswer",
                        },
                      },
                      e._l(e.optionsArr, function (t, o) {
                        return i(
                          "Checkbox",
                          {
                            key: "" + t.optionId,
                            staticClass: "option-item",
                            attrs: {
                              shape: "square",
                              name: t.optionId,
                              disabled: e.closeAnswer,
                            },
                          },
                          [
                            e._v(
                              " " +
                                e._s(
                                  String.fromCharCode(97 + o).toUpperCase() +
                                    ". " +
                                    t.optionText
                                ) +
                                " "
                            ),
                          ]
                        );
                      }),
                      1
                    ),
                  ]
                : "4" === e.questionType || "5" === e.questionType
                ? i(
                    "CellGroup",
                    e._l(e.optionsArr, function (t, o) {
                      return i("Field", {
                        key: "" + t.optionId,
                        attrs: {
                          label: "第(" + (o + 1) + ")空回答",
                          disabled: e.closeAnswer,
                          placeholder: "请输入内容",
                        },
                        model: {
                          value: e.userAnswer[o],
                          callback: function (t) {
                            e.$set(e.userAnswer, o, t);
                          },
                          expression: "userAnswer[index]",
                        },
                      });
                    }),
                    1
                  )
                : "6" === e.questionType
                ? i(
                    "CellGroup",
                    [
                      i("Field", {
                        attrs: {
                          type: "textarea",
                          rows: "8",
                          autosize: "",
                          label: "回答: ",
                          "label-width": "60",
                          disabled: e.closeAnswer,
                          placeholder: "请输入内容",
                        },
                        model: {
                          value: e.singleSelect,
                          callback: function (t) {
                            e.singleSelect = t;
                          },
                          expression: "singleSelect",
                        },
                      }),
                    ],
                    1
                  )
                : "7" === e.questionType
                ? i(
                    "CellGroup",
                    [
                      e._l(e.optionsArr, function (t, o) {
                        return i("Field", {
                          key: "" + t.optionId,
                          attrs: {
                            readonly: "",
                            clickable: "",
                            name: "picker",
                            value: e.userAnswer[o],
                            label: t.optionText,
                            disabled: e.closeAnswer,
                            placeholder: "请选择",
                          },
                          on: {
                            click: function (t) {
                              return e.openSelectPop(o);
                            },
                          },
                        });
                      }),
                      i(
                        "Popup",
                        {
                          attrs: { position: "bottom" },
                          model: {
                            value: e.showSelectPop,
                            callback: function (t) {
                              e.showSelectPop = t;
                            },
                            expression: "showSelectPop",
                          },
                        },
                        [
                          i("Picker", {
                            attrs: {
                              "show-toolbar": "",
                              columns: e.selectColumns,
                            },
                            on: {
                              confirm: e.onConfirm,
                              cancel: function (t) {
                                return e.closeSelectPop();
                              },
                            },
                          }),
                        ],
                        1
                      ),
                    ],
                    2
                  )
                : "10" === e.questionType
                ? i("Field", {
                    attrs: { name: "uploader", label: "选择上传文件" },
                    scopedSlots: e._u([
                      {
                        key: "input",
                        fn: function () {
                          return [
                            i("Uploader", {
                              attrs: {
                                accept: "*",
                                "after-read": e.afterSelectFile,
                                "max-count": 1,
                                disabled: e.closeAnswer,
                                "before-delete": e.beforeDelete,
                              },
                              model: {
                                value: e.uploaderFiles,
                                callback: function (t) {
                                  e.uploaderFiles = t;
                                },
                                expression: "uploaderFiles",
                              },
                            }),
                          ];
                        },
                        proxy: !0,
                      },
                    ]),
                  })
                : e._e(),
            ],
            2
          );
        },
        s = [],
        a = (i("e930"), i("8f80")),
        n = (i("5f5f"), i("f253")),
        r = (i("8a58"), i("e41f")),
        c = (i("3c32"), i("417e")),
        l = (i("a909"), i("3acc")),
        u = (i("4ddd"), i("9f14")),
        d = (i("a44c"), i("e27c")),
        p = (i("be7f"), i("565f")),
        h = (i("0653"), i("34e9")),
        f = i("b85c"),
        m =
          (i("ac1f"),
          i("1276"),
          i("cb29"),
          i("99af"),
          i("a15b"),
          i("d3b7"),
          i("a434"),
          i("b0c0"),
          i("5cc6"),
          i("9a8c"),
          i("a975"),
          i("735e"),
          i("c1ac"),
          i("d139"),
          i("3a7b"),
          i("d5d6"),
          i("82f8"),
          i("e91f"),
          i("60bd"),
          i("5f96"),
          i("3280"),
          i("3fcc"),
          i("ca91"),
          i("25a1"),
          i("cd26"),
          i("3c5d"),
          i("2954"),
          i("649e"),
          i("219c"),
          i("170b"),
          i("b39a"),
          i("72f7"),
          i("a630"),
          i("3ca3"),
          i("d81d"),
          i("db49")),
        g = {
          methods: {
            echoFn: function (e) {
              var t = this.inputAnswer.split(","),
                i = t.length;
              if (i == e) return t;
              var o = e - i,
                s = Array(o).fill("");
              return t.concat(s);
            },
            setUserAnswer: function () {
              if (
                (this.resetData(),
                "1" === this.questionType ||
                  "3" === this.questionType ||
                  "6" === this.questionType ||
                  "10" === this.questionType)
              )
                "10" === this.questionType &&
                this.inputAnswer.indexOf("doc/a") >= 0
                  ? this.getFileInfo()
                  : (this.singleSelect = this.inputAnswer);
              else if (
                "2" === this.questionType ||
                "4" === this.questionType ||
                "5" === this.questionType
              )
                this.userAnswer =
                  "" === this.inputAnswer ? [] : this.inputAnswer.split(",");
              else if ("7" === this.questionType) {
                var e = this.optionsArr[0].selectArr.length;
                this.userAnswer =
                  "" === this.inputAnswer ? Array(e).fill("") : this.echoFn(e);
              }
            },
            getUserAnswer: function () {
              return "1" === this.questionType ||
                "3" === this.questionType ||
                "6" === this.questionType ||
                "10" === this.questionType
                ? "" !== this.singleSelect
                  ? this.singleSelect
                  : ""
                : "2" === this.questionType ||
                  "4" === this.questionType ||
                  "5" === this.questionType ||
                  "7" === this.questionType
                ? this.userAnswer.join(",")
                : void 0;
            },
            getFileInfo: function () {
              var e = this;
              this.$API("getResPreviewInfo", { filekey: this.inputAnswer })
                .then(function (t) {
                  if ("0" === t.code) {
                    var i,
                      o = t.data || {};
                    e.uploaderFiles.splice(0, 1, {
                      url:
                        (null === o ||
                        void 0 === o ||
                        null === (i = o.urls) ||
                        void 0 === i
                          ? void 0
                          : i.preview) ||
                        "https://ldoc.shou.org.cn/".concat(e.inputAnswer),
                    });
                  }
                })
                .finally(function () {
                  e.singleSelect = e.inputAnswer;
                });
            },
            onConfirm: function (e) {
              var t = this;
              this.userAnswer.splice(this.popSelectIndex, 1, e),
                this.$nextTick(function () {
                  (t.popSelectIndex = 0),
                    (t.selectColumns = []),
                    (t.showSelectPop = !1);
                });
            },
            afterSelectFile: function (e) {
              var t = this,
                i = e.file,
                o = i.name;
              (e.status = "uploading"), (e.message = "上传中...");
              var s = new FileReader();
              (s.onload = function (i) {
                var s = i.target.result,
                  a = new Uint8Array(s);
                t.$API("uploadFile", {
                  fileName: o,
                  _dataArr: Array.from(a),
                }).then(function (i) {
                  if ("0" === i.code) {
                    var o = i.data.url;
                    (e.status = "done"),
                      (e.message = "上传成功"),
                      (e.url = "https://ldoc.shou.org.cn/".concat(o)),
                      (t.singleSelect = o);
                  } else (e.status = "failed"), (e.message = i.message || "上传失败");
                });
              }),
                s.readAsArrayBuffer(i);
            },
          },
        },
        v = {
          methods: {
            setUserAnswer: function () {
              var e;
              if (
                (this.resetData(),
                "1" === this.questionType || "3" === this.questionType)
              )
                this.singleSelect =
                  (null === (e = this.inputAnswer[0]) || void 0 === e
                    ? void 0
                    : e.optionId) || "";
              else if ("2" === this.questionType)
                this.userAnswer = this.inputAnswer
                  ? this.inputAnswer.map(function (e) {
                      return e.optionId;
                    })
                  : [];
              else if ("4" === this.questionType || "5" === this.questionType) {
                var t = {};
                this.inputAnswer &&
                  this.inputAnswer.map(function (e) {
                    t[e.optionId] = e.answerContent || "";
                  }),
                  (this.userAnswer = this.optionsArr.map(function (e) {
                    var i = e.optionId;
                    return t[i] || "";
                  }));
              } else if ("6" === this.questionType) {
                var i;
                this.singleSelect =
                  (null === (i = this.inputAnswer[0]) || void 0 === i
                    ? void 0
                    : i.answerContent) || "";
              } else if ("10" === this.questionType) {
                var o,
                  s =
                    null === (o = this.inputAnswer[0]) || void 0 === o
                      ? void 0
                      : o.answerContent;
                s && this.getFileInfo(s);
              } else {
                if ("7" !== this.questionType) return "";
                var a,
                  n,
                  r =
                    (null === (a = this.optionsArr[0]) || void 0 === a
                      ? void 0
                      : a.selectArr) || [],
                  c = Object(f["a"])(r);
                try {
                  for (c.s(); !(n = c.n()).done; ) {
                    var l,
                      u = n.value;
                    if (
                      u.optionId ===
                      (null === (l = this.inputAnswer[0]) || void 0 === l
                        ? void 0
                        : l.optionId)
                    ) {
                      this.userAnswer[0] = u.text;
                      break;
                    }
                  }
                } catch (d) {
                  c.e(d);
                } finally {
                  c.f();
                }
              }
            },
            getUserAnswer: function () {
              var e = this;
              if ("1" === this.questionType || "3" === this.questionType)
                return [{ answerContent: "", optionId: this.singleSelect }];
              if ("2" === this.questionType)
                return this.userAnswer.map(function (e) {
                  return { answerContent: "", optionId: e };
                });
              if ("4" === this.questionType || "5" === this.questionType) {
                var t = [];
                return (
                  this.userAnswer.map(function (i, o) {
                    i &&
                      t.push({
                        answerContent: i,
                        optionId: e.optionsArr[o].optionId,
                      });
                  }),
                  t
                );
              }
              if ("6" === this.questionType || "10" === this.questionType)
                return [{ answerContent: this.singleSelect, optionId: "" }];
              if ("7" === this.questionType) {
                var i = "";
                if (this.userAnswer.length > 0) {
                  var o,
                    s,
                    a =
                      (null === (o = this.optionsArr[0]) || void 0 === o
                        ? void 0
                        : o.selectArr) || [],
                    n = Object(f["a"])(a);
                  try {
                    for (n.s(); !(s = n.n()).done; ) {
                      var r = s.value;
                      r.text === this.userAnswer[0] && (i = r.optionId);
                    }
                  } catch (c) {
                    n.e(c);
                  } finally {
                    n.f();
                  }
                }
                return [{ answerContent: "", optionId: i }];
              }
              return [];
            },
            getFileInfo: function (e) {
              var t = this;
              this.$API("getUploadExamFile", { filekey: e })
                .then(function (e) {
                  if ("0" === e.code) {
                    var i = e.data || {};
                    t.uploaderFiles.splice(0, 1, { url: i.viewPath });
                  }
                })
                .finally(function () {
                  t.singleSelect = e;
                });
            },
            onConfirm: function (e) {
              var t = this;
              this.userAnswer.splice(this.popSelectIndex, 1, e.optionText),
                this.$nextTick(function () {
                  (t.popSelectIndex = 0),
                    (t.selectColumns = []),
                    (t.showSelectPop = !1);
                });
            },
            afterSelectFile: function (e) {
              var t = this,
                i = e.file;
              (e.status = "uploading"), (e.message = "上传中...");
              var o = new FormData();
              o.append("upfile_attachment", i),
                o.append("modtype", "question"),
                this.$API("uploadExamFile", o).then(function (i) {
                  if ("0" === i.code) {
                    (e.status = "done"), (e.message = "上传成功");
                    var o = i.data;
                    t.singleSelect = o;
                  } else (e.status = "failed"), (e.message = i.message || "上传失败");
                });
            },
          },
        },
        y = "dotNet_api" === m["a"].apiPrefix ? g : v,
        I = y,
        C = {
          name: "QuestionOptions",
          components: {
            CellGroup: h["a"],
            Field: p["a"],
            RadioGroup: d["a"],
            Radio: u["a"],
            CheckboxGroup: l["a"],
            Checkbox: c["a"],
            Popup: r["a"],
            Picker: n["a"],
            Uploader: a["a"],
          },
          props: {
            questionType: { type: String, default: "" },
            optionsArr: {
              type: Array,
              default: function () {
                return [];
              },
            },
            inputAnswer: { type: [String, Array], default: "" },
            closeAnswer: { type: Boolean, default: !1 },
          },
          data: function () {
            return {
              singleSelect: "",
              userAnswer: [],
              uploaderFiles: [],
              popSelectIndex: 0,
              showSelectPop: !1,
              selectColumns: [],
            };
          },
          mixins: [I],
          watch: {
            inputAnswer: function () {
              this.setUserAnswer();
            },
          },
          mounted: function () {
            this.setUserAnswer();
          },
          methods: {
            resetData: function () {
              (this.singleSelect = ""),
                (this.userAnswer = []),
                (this.uploaderFiles = []),
                (this.popSelectIndex = 0),
                (this.showSelectPop = !1),
                (this.selectColumns = []);
            },
            beforeDelete: function () {
              return !this.closeAnswer;
            },
            openSelectPop: function (e) {
              var t;
              if (this.closeAnswer) return !1;
              (this.popSelectIndex = e),
                (this.selectColumns =
                  (null === (t = this.optionsArr[e]) || void 0 === t
                    ? void 0
                    : t.selectArr) || []),
                (this.showSelectPop = !0);
            },
            closeSelectPop: function () {
              (this.popSelectIndex = 0),
                (this.selectColumns = []),
                (this.showSelectPop = !1);
            },
          },
        },
        A = C,
        w = (i("2b4a"), i("2877")),
        b = Object(w["a"])(A, o, s, !1, null, "0cf14458", null);
      t["a"] = b.exports;
    },
    9167: function (e, t, i) {
      "use strict";
      var o = function () {
          var e = this,
            t = e.$createElement,
            o = e._self._c || t;
          return o(
            "div",
            { attrs: { id: "app" } },
            [
              e.showTop
                ? o("TopNav", {
                    attrs: {
                      cb: e.cb,
                      navName: e.navName,
                      title: e.title,
                      "activity-id": e.activityId,
                    },
                    on: { doSearch: e.doSearch },
                  })
                : e._e(),
              o(
                "div",
                {
                  staticClass: "content-area",
                  class: e.$slots.bottom ? "" : "hide-bottom",
                },
                [e._t("default")],
                2
              ),
              e._t("bottom"),
              o(
                "span",
                {
                  ref: "serviceBtn",
                  staticClass: "online-service",
                  on: { click: e.showOnlineService },
                },
                [o("img", { attrs: { src: i("917e"), alt: "" } })]
              ),
            ],
            2
          );
        },
        s = [],
        a = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return "searchPage" === e.navName
            ? i("NavBar", {
                staticClass: "top-nav",
                attrs: { "safe-area-inset-top": "" },
                on: { "click-left": e.leftClick },
                scopedSlots: e._u(
                  [
                    {
                      key: "left",
                      fn: function () {
                        return [
                          i("Icon", {
                            attrs: { name: "arrow-left", size: "24" },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                    {
                      key: "title",
                      fn: function () {
                        return [
                          i("Search", {
                            staticClass: "top-search search-page-input",
                            attrs: { shape: "round" },
                            on: { search: e.doSearchCourse, clear: e.doSearch },
                            model: {
                              value: e.searchValue,
                              callback: function (t) {
                                e.searchValue = t;
                              },
                              expression: "searchValue",
                            },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                    {
                      key: "right",
                      fn: function () {
                        return [
                          i("span", { on: { click: e.doSearch } }, [
                            e._v("搜索"),
                          ]),
                        ];
                      },
                      proxy: !0,
                    },
                  ],
                  null,
                  !1,
                  786759981
                ),
              })
            : "changeLanguage" === e.navName
            ? i("NavBar", {
                staticClass: "top-nav",
                attrs: { "safe-area-inset-top": "" },
                on: { "click-left": e.leftClick },
                scopedSlots: e._u(
                  [
                    {
                      key: "left",
                      fn: function () {
                        return [
                          i("Icon", {
                            attrs: { name: "arrow-left", size: "24" },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                    {
                      key: "title",
                      fn: function () {
                        return [
                          i("span", { staticClass: "nav-title" }, [
                            e._v(e._s(e.title || e.$t("homeTitle"))),
                          ]),
                        ];
                      },
                      proxy: !0,
                    },
                    {
                      key: "right",
                      fn: function () {
                        return [
                          e._t("nav-right", function () {
                            return [
                              i("Popover", {
                                attrs: {
                                  trigger: "click",
                                  placement: "bottom-end",
                                  actions: e.actionsData,
                                },
                                on: { select: e.onSelectMenuItem },
                                scopedSlots: e._u([
                                  {
                                    key: "reference",
                                    fn: function () {
                                      return [
                                        i("Icon", {
                                          staticClass: "nav-btn",
                                          attrs: {
                                            name: "wap-nav",
                                            size: "24",
                                          },
                                        }),
                                      ];
                                    },
                                    proxy: !0,
                                  },
                                ]),
                                model: {
                                  value: e.showPopover,
                                  callback: function (t) {
                                    e.showPopover = t;
                                  },
                                  expression: "showPopover",
                                },
                              }),
                            ];
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                  ],
                  null,
                  !0
                ),
              })
            : "changeCourse" === e.navName
            ? i("NavBar", {
                staticClass: "top-nav",
                attrs: { "safe-area-inset-top": "" },
                on: { "click-left": e.leftClick },
                scopedSlots: e._u(
                  [
                    {
                      key: "left",
                      fn: function () {
                        return [
                          i("Icon", {
                            attrs: { name: "arrow-left", size: "24" },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                    {
                      key: "title",
                      fn: function () {
                        return [
                          i("span", { staticClass: "nav-title" }, [
                            e._v(e._s(e.title || e.$t("homeTitle"))),
                          ]),
                        ];
                      },
                      proxy: !0,
                    },
                    {
                      key: "right",
                      fn: function () {
                        return [
                          e._t("nav-right", function () {
                            return [
                              i("Popover", {
                                attrs: {
                                  trigger: "click",
                                  placement: "bottom-end",
                                  actions: e.actions,
                                },
                                on: { select: e.onSelectMenuItem },
                                scopedSlots: e._u([
                                  {
                                    key: "reference",
                                    fn: function () {
                                      return [
                                        i("Icon", {
                                          staticClass: "nav-btn",
                                          attrs: {
                                            name: "wap-nav",
                                            size: "24",
                                          },
                                        }),
                                      ];
                                    },
                                    proxy: !0,
                                  },
                                ]),
                                model: {
                                  value: e.showPopover,
                                  callback: function (t) {
                                    e.showPopover = t;
                                  },
                                  expression: "showPopover",
                                },
                              }),
                            ];
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                  ],
                  null,
                  !0
                ),
              })
            : i("NavBar", {
                staticClass: "top-nav",
                attrs: { "safe-area-inset-top": "" },
                on: { "click-left": e.leftClick },
                scopedSlots: e._u([
                  {
                    key: "left",
                    fn: function () {
                      return [
                        i("Icon", {
                          attrs: { name: "arrow-left", size: "24" },
                        }),
                      ];
                    },
                    proxy: !0,
                  },
                  {
                    key: "title",
                    fn: function () {
                      return [
                        i("span", { staticClass: "nav-title" }, [
                          e._v(e._s(e.title || e.$t("homeTitle"))),
                        ]),
                      ];
                    },
                    proxy: !0,
                  },
                ]),
              });
        },
        n = [],
        r = i("1da1"),
        c = (i("d82d"), i("7278")),
        l = (i("5852"), i("d961")),
        u = (i("c3a6"), i("ad06")),
        d = (i("5246"), i("6b41")),
        p = (i("96cf"), i("d81d"), i("a434"), i("99af"), i("aa6a")),
        h = i("f3df"),
        f = {
          name: "TopNav",
          components: {
            NavBar: d["a"],
            Icon: u["a"],
            Search: l["a"],
            Popover: c["a"],
          },
          inject: {
            showSelectHistoryCourse: { default: !1 },
            triggerSelectHistory: { default: null },
          },
          props: {
            navName: { type: String, default: "" },
            title: { type: String, default: "标题" },
            activityId: { type: String, default: "" },
            cb: {
              type: Function,
              default: function () {
                return !0;
              },
            },
          },
          data: function () {
            return {
              showPopover: !1,
              searchValue: "",
              actions: [
                { text: "中文", actionType: "zh", className: "top-pop-item" },
                {
                  text: "English",
                  actionType: "en",
                  className: "top-pop-item",
                },
                { text: "切换课程", disabled: !0, className: "top-pop-item" },
              ],
              actionsData: [
                { text: "中文", actionType: "zh" },
                { text: "English", actionType: "en" },
              ],
              activityCourseId: "",
            };
          },
          watch: {
            activityId: function (e) {
              e &&
                "changeCourse" === this.navName &&
                (this.actions = this.actions.map(function (t) {
                  return (
                    t.courseId && t.courseId === e
                      ? (t.className = "top-pop-item top-pop-active")
                      : null !== t.courseId && (t.className = "top-pop-item"),
                    t
                  );
                }));
            },
          },
          mounted: function () {
            var e = Object(p["d"])();
            (this.activityCourseId = e.courseId || this.activityId || ""),
              "searchPage" === this.navName &&
                e.query &&
                ((this.searchValue = e.query),
                this.$emit("doSearch", this.searchValue)),
              "changeCourse" === this.navName && this.initCourseList();
          },
          methods: {
            leftClick: function () {
              var e = this;
              return Object(r["a"])(
                regeneratorRuntime.mark(function t() {
                  var i;
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (t.next = 2), e.cb();
                        case 2:
                          if (((i = t.sent), i)) {
                            t.next = 5;
                            break;
                          }
                          return t.abrupt("return");
                        case 5:
                          e.$router ? e.$router.go(-1) : history.go(-1);
                        case 6:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            initCourseList: function () {
              var e = this;
              Object(h["e"])(function (t) {
                t.map(function (t) {
                  var i = {
                    courseId: t.id,
                    text: t.courseName,
                    className:
                      t.id === e.activityCourseId
                        ? "top-pop-item top-pop-active"
                        : "top-pop-item",
                  };
                  e.actions.splice(e.actions.length, 0, i);
                }),
                  e.showSelectHistoryCourse &&
                    e.actions.splice(e.actions.length, 0, {
                      courseId: null,
                      showHistory: !0,
                      text: "历史课程查分",
                      className: "top-pop-item top-pop-history",
                    });
              });
            },
            doSearchCourse: function () {
              this.$emit("doSearch", this.searchValue);
            },
            doSearch: function () {
              this.$emit("doSearch", this.searchValue);
            },
            onSelectMenuItem: function (e) {
              if ("zh" === e.actionType || "en" === e.actionType)
                this.$changeLanguage(e.actionType);
              else if (e.courseId && e.courseId !== this.activityCourseId) {
                var t = window.location.pathname,
                  i = "?courseId=".concat(e.courseId);
                window.location.href = "".concat(t).concat(i);
              } else
                e.showHistory &&
                  this.showSelectHistoryCourse &&
                  this.triggerSelectHistory &&
                  this.triggerSelectHistory();
              this.showPopover = !1;
            },
          },
        },
        m = f,
        g = (i("8700"), i("2877")),
        v = Object(g["a"])(m, a, n, !1, null, "55a96ba9", null),
        y = v.exports,
        I = {
          name: "PageLayout",
          components: { TopNav: y },
          props: {
            navName: { type: String, default: "" },
            title: { type: String, default: "标题" },
            showTop: { type: Boolean, default: !0 },
            activityId: { type: String, default: "" },
            cb: {
              type: Function,
              default: function () {
                return !0;
              },
            },
          },
          methods: {
            doSearch: function (e) {
              this.$emit("doSearch", e);
            },
            showOnlineService: function () {
              window.location.href =
                "https://admin.shou.org.cn/webim/h5.html?linkType=1&env=private&kfuin=2852200400&fid=1488502&key=a09ad278b4da2726f2541a41c10a835e&cate=7&source=&isLBS=&isCustomEntry=&type=10&ftype=1&_type=wpa&qidian=true&_pid=rqy5b6.rtu3vc.le3lyrev";
            },
          },
        },
        C = I,
        A = (i("7c30"), Object(g["a"])(C, o, s, !1, null, "2070fc6b", null));
      t["a"] = A.exports;
    },
    "917e": function (e, t) {
      e.exports =
        "data:image/png;base64,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";
    },
    9238: function (e, t, i) {},
    "925b": function (e, t, i) {
      "use strict";
      i.r(t);
      i("e260"), i("e6cf"), i("cca6"), i("a79d");
      var o = i("3e98"),
        s = i("8c4f"),
        a = i("db49"),
        n = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "keep-alive",
            { attrs: { include: "CourseDetail" } },
            [i("router-view")],
            1
          );
        },
        r = [],
        c = { name: "CourseDetailIndex" },
        l = c,
        u = i("2877"),
        d = Object(u["a"])(l, n, r, !1, null, null, null),
        p = d.exports,
        h = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "PageLayout",
            { attrs: { title: e.courseName, navName: "changeCourse" } },
            [
              i(
                "Tabs",
                {
                  attrs: { background: "#fff", color: "#559BFF" },
                  model: {
                    value: e.active,
                    callback: function (t) {
                      e.active = t;
                    },
                    expression: "active",
                  },
                },
                [
                  i(
                    "Tab",
                    { attrs: { title: "课程目录" } },
                    [
                      e.courseVideo
                        ? i(
                            "div",
                            { staticClass: "player-wrapper" },
                            [
                              i("VideoPlayer", {
                                attrs: { source: e.courseVideo },
                              }),
                            ],
                            1
                          )
                        : e.courseCover
                        ? i("div", { staticClass: "img-wrapper" }, [
                            i("img", { attrs: { src: e.courseCover } }),
                          ])
                        : e._e(),
                      i("CourseCatalog", {
                        on: { isEnableAIStatus: e.isEnableAIStatus },
                      }),
                    ],
                    1
                  ),
                  e.isEnableAI
                    ? i(
                        "Tab",
                        { attrs: { title: "AI助教" } },
                        [i("AiAssistant")],
                        1
                      )
                    : e._e(),
                  e.isEnableAI
                    ? i(
                        "Tab",
                        { attrs: { title: "学习规划" } },
                        [i("LearnPlan")],
                        1
                      )
                    : e._e(),
                  e.isEnableAI
                    ? i(
                        "Tab",
                        { attrs: { title: "知识梳理" } },
                        [i("KnowledgeOrganization")],
                        1
                      )
                    : e._e(),
                ],
                1
              ),
              i("CourseDetailBottomNav", {
                attrs: { slot: "bottom" },
                slot: "bottom",
              }),
            ],
            1
          );
        },
        f = [],
        m = (i("bda7"), i("5e46")),
        g = (i("da3c"), i("0b33")),
        v = i("f3df"),
        y = i("9167"),
        I = i("4c0f"),
        C = function () {
          var e = this,
            t = e.$createElement,
            o = e._self._c || t;
          return o(
            "Tabbar",
            {
              staticStyle: { "z-index": "10" },
              attrs: { "safe-area-inset-bottom": "" },
              model: {
                value: e.activeMenu,
                callback: function (t) {
                  e.activeMenu = t;
                },
                expression: "activeMenu",
              },
            },
            [
              o(
                "TabbarItem",
                {
                  attrs: { name: "courseCatalog" },
                  on: {
                    click: function (t) {
                      return e.navChange("courseCatalog");
                    },
                  },
                  scopedSlots: e._u([
                    {
                      key: "icon",
                      fn: function () {
                        return [
                          o("img", {
                            staticStyle: { width: "28px" },
                            attrs: {
                              src:
                                "courseCatalog" === e.activeMenu
                                  ? i("c8b7")
                                  : i("a1df"),
                            },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                  ]),
                },
                [
                  o(
                    "span",
                    {
                      class:
                        "courseCatalog" === e.activeMenu ? "activity-item" : "",
                    },
                    [e._v(e._s(e.$t("bottomNav.courseCatalog")))]
                  ),
                ]
              ),
              o(
                "TabbarItem",
                {
                  attrs: { name: "courseResource" },
                  on: {
                    click: function (t) {
                      return e.navChange("courseResource");
                    },
                  },
                  scopedSlots: e._u([
                    {
                      key: "icon",
                      fn: function () {
                        return [
                          o("img", {
                            attrs: {
                              src:
                                "courseResource" === e.activeMenu
                                  ? i("5e49")
                                  : i("595a"),
                            },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                  ]),
                },
                [
                  o(
                    "span",
                    {
                      class:
                        "courseResource" === e.activeMenu
                          ? "activity-item"
                          : "",
                    },
                    [e._v(e._s(e.$t("bottomNav.courseResource")))]
                  ),
                ]
              ),
              o(
                "TabbarItem",
                {
                  attrs: { name: "home" },
                  on: {
                    click: function (t) {
                      return e.navChange("home");
                    },
                  },
                },
                [
                  o("span", { staticStyle: { position: "relative" } }, [
                    o("span", { staticClass: "home-bg" }),
                    o("span", { staticClass: "home-icon" }, [
                      o("img", {
                        staticStyle: {
                          width: "18px",
                          height: "18px",
                          "margin-top": "8px",
                        },
                        attrs: { src: i("55d6") },
                      }),
                      o("br"),
                      o(
                        "span",
                        {
                          staticStyle: {
                            display: "inline-block",
                            "margin-top": "2px",
                          },
                        },
                        [e._v(e._s(e.$t("bottomNav.home")))]
                      ),
                    ]),
                  ]),
                ]
              ),
              o(
                "TabbarItem",
                {
                  attrs: { name: "courseInfo" },
                  on: {
                    click: function (t) {
                      return e.navChange("courseInfo");
                    },
                  },
                  scopedSlots: e._u([
                    {
                      key: "icon",
                      fn: function () {
                        return [
                          o("img", {
                            attrs: {
                              src:
                                "courseInfo" === e.activeMenu
                                  ? i("ec32")
                                  : i("fd3a"),
                            },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                  ]),
                },
                [
                  o(
                    "span",
                    {
                      class:
                        "courseInfo" === e.activeMenu ? "activity-item" : "",
                    },
                    [e._v(e._s(e.$t("bottomNav.courseInfo")))]
                  ),
                ]
              ),
              o(
                "TabbarItem",
                {
                  attrs: { name: "courseQA" },
                  on: {
                    click: function (t) {
                      return e.navChange("courseQA");
                    },
                  },
                  scopedSlots: e._u([
                    {
                      key: "icon",
                      fn: function () {
                        return [
                          o("img", {
                            attrs: {
                              src:
                                "courseQA" === e.activeMenu
                                  ? i("45ee")
                                  : i("519e"),
                            },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                  ]),
                },
                [
                  o(
                    "span",
                    {
                      class: "courseQA" === e.activeMenu ? "activity-item" : "",
                    },
                    [e._v(e._s(e.$t("bottomNav.courseQA")))]
                  ),
                ]
              ),
            ],
            1
          );
        },
        A = [],
        w = (i("a52c"), i("2ed4")),
        b = (i("537a"), i("ac28")),
        T =
          (i("b0c0"),
          {
            name: "CourseDetailBottomNav",
            components: { Tabbar: b["a"], TabbarItem: w["a"] },
            data: function () {
              return { activeMenu: "courseCatalog" };
            },
            activated: function () {
              this.activeMenu = this.$route.name || "courseCatalog";
            },
            mounted: function () {
              this.activeMenu = this.$route.name || "courseCatalog";
            },
            methods: {
              navChange: function (e) {
                var t = this.$route.name,
                  i = this.$route.query || {};
                if ("home" === e) return (window.location.href = "/"), !1;
                t !== e && this.$router.push({ name: e, query: i });
              },
            },
          }),
        S = T,
        x = (i("a430"), Object(u["a"])(S, C, A, !1, null, "6f75e65e", null)),
        P = x.exports,
        L = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return e.initLoading
            ? i("Skeleton", {
                staticClass: "skeleton-area",
                attrs: { row: 3, loading: e.initLoading },
              })
            : e.modules.length > 0
            ? i(
                "div",
                { staticClass: "course-catalog" },
                e._l(e.modules, function (t) {
                  return i(
                    "div",
                    { key: t.moduleId, staticClass: "course-module" },
                    [
                      i("div", { staticClass: "module-title" }, [
                        e._v(e._s(t.moduleName)),
                      ]),
                      e._l(e.chapters[t.moduleId], function (t) {
                        return i(
                          "Collapse",
                          {
                            key: t.chapterId,
                            model: {
                              value: e.activeChapters,
                              callback: function (t) {
                                e.activeChapters = t;
                              },
                              expression: "activeChapters",
                            },
                          },
                          [
                            i(
                              "CollapseItem",
                              {
                                staticClass: "chapter-wrapper",
                                attrs: {
                                  title: t.chapterName,
                                  name: t.chapterId,
                                },
                              },
                              e._l(e.resources[t.chapterId], function (t) {
                                return i(
                                  "div",
                                  {
                                    key: t.resourceId,
                                    staticClass: "res-item",
                                    on: {
                                      click: function (i) {
                                        return e.showRes(t);
                                      },
                                    },
                                  },
                                  [
                                    t._fileIcon
                                      ? i("span", {
                                          staticClass: "res-icon",
                                          class: t._fileIcon,
                                        })
                                      : e._e(),
                                    i("span", { staticClass: "res-info" }, [
                                      e._v(" " + e._s(t.resourceName) + " "),
                                      t.mustStudy
                                        ? i(
                                            "span",
                                            { staticClass: "res-must-study" },
                                            [e._v("(必看)")]
                                          )
                                        : e._e(),
                                    ]),
                                    i("span", {
                                      staticClass: "res-status",
                                      class:
                                        "res-status-" + (t.studyStatus || 0),
                                    }),
                                  ]
                                );
                              }),
                              0
                            ),
                          ],
                          1
                        );
                      }),
                    ],
                    2
                  );
                }),
                0
              )
            : i(
                "div",
                [i("Empty", { attrs: { description: "暂无学习目录信息" } })],
                1
              );
        },
        k = [],
        O = (i("0209"), i("7d5e")),
        D = (i("91d5"), i("f0ca")),
        E = (i("342a"), i("1437")),
        R = (i("5d17"), i("f9bd")),
        F = (i("e7e5"), i("d399")),
        N = (i("e17f"), i("2241")),
        M = i("b85c"),
        B =
          (i("d3b7"),
          i("4e82"),
          i("4de4"),
          i("a434"),
          i("ac1f"),
          i("5319"),
          i("99af"),
          i("4d90"),
          {
            methods: {
              getStuCourseCatalog: function () {
                var e = this;
                (this.initLoading = !0),
                  this.$API("getStuCourseCatalog", { courseId: this.courseId })
                    .then(function (t) {
                      if ("0" === t.code) {
                        var i = t.data || {};
                        e.$emit("isEnableAIStatus", i.isEnableAI);
                        var o = i.courseModules || [];
                        e.parseCourseModules(o);
                      }
                    })
                    .finally(function () {
                      e.initLoading = !1;
                    });
              },
              parseCourseModules: function (e) {
                var t,
                  i = e.sort(function (e, t) {
                    return e.sortOrder - t.sortOrder;
                  }),
                  o = [],
                  s = Object(M["a"])(i);
                try {
                  for (s.s(); !(t = s.n()).done; ) {
                    var a = t.value;
                    o.push({
                      moduleId: a.id,
                      moduleName: a.name,
                      index: a.sortOrder,
                      isHide: 1 === a.isHide || "1" === a.isHide,
                      withControl: !!a.controlValue,
                    }),
                      a.courseTopics &&
                        this.parseChapters(a.id, a.courseTopics);
                  }
                } catch (n) {
                  s.e(n);
                } finally {
                  s.f();
                }
                this.modules = o.filter(function (e) {
                  return !e.isHide;
                });
              },
              parseChapters: function (e, t) {
                var i,
                  o = t.sort(function (e, t) {
                    return e.sortOrder - t.sortOrder;
                  }),
                  s = [],
                  a = Object(M["a"])(o);
                try {
                  for (a.s(); !(i = a.n()).done; ) {
                    var n = i.value;
                    s.push({
                      chapterId: n.id,
                      chapterName: n.name,
                      index: n.sortOrder,
                      studyProgress: n.studyProgress,
                    }),
                      n.courseCells && this.parseResources(n.id, n.courseCells),
                      this.activeChapters.splice(
                        this.activeChapters.length,
                        0,
                        n.id
                      );
                  }
                } catch (r) {
                  a.e(r);
                } finally {
                  a.f();
                }
                this.chapters[e] = s;
              },
              parseResources: function (e, t) {
                var i,
                  o = t.sort(function (e, t) {
                    return e.sortOrder - t.sortOrder;
                  }),
                  s = [],
                  a = Object(M["a"])(o);
                try {
                  for (a.s(); !(i = a.n()).done; ) {
                    var n = i.value;
                    s.push({
                      resourceId: n.id,
                      resourceName: n.name,
                      index: n.sortOrder,
                      resourceType: n.cellType,
                      studyStatus: n.type,
                      hasRecords: n.isLearnt,
                      mustStudy: "1" === n.isCanView || 1 === n.isCanView,
                      canComment:
                        "1" === n.isCanComment || 1 === n.isCanComment,
                      canDownload:
                        "1" === n.isCanDownload || 1 === n.isCanDownload,
                      videoTime: n.videoTime,
                      workType: n.workType,
                      fileUuid: n.resourceUrl,
                      _fileIcon: this.guessFileIcon(n.resourceUrl),
                      outLink: n.externalLinkUrl,
                      relativeId:
                        n.assignmentId ||
                        n.activityId ||
                        n.laboratoryId ||
                        n.faceTeachingId ||
                        n.middleExamId ||
                        n.paperAssignmentId,
                    });
                  }
                } catch (r) {
                  a.e(r);
                } finally {
                  a.f();
                }
                this.resources[e] = s;
              },
              guessFileIcon: function (e) {
                if (e && e.indexOf("doc/a@") >= 0) {
                  var t = e.replace("doc/a@", "");
                  return t.indexOf(".doc") >= 0
                    ? "word-icon"
                    : t.indexOf(".ppt") >= 0 || t.indexOf(".pps") >= 0
                    ? "ppt-icon"
                    : t.indexOf(".xls") >= 0
                    ? "excel-icon"
                    : t.indexOf(".pdf") >= 0
                    ? "pdf-icon"
                    : t.indexOf(".mp4") >= 0
                    ? "mp4-icon"
                    : t.indexOf(".mp3") >= 0 || t.indexOf(".m4a") >= 0
                    ? "mp3-icon"
                    : t.indexOf(".zip") >= 0
                    ? "zip-icon"
                    : "";
                }
                return "";
              },
              showRes: function (e) {
                var t = this;
                if (
                  ("1" !== e.resourceType && "11" !== e.resourceType) ||
                  !e.fileUuid
                )
                  "4" === e.resourceType && e.outLink
                    ? N["a"]
                        .confirm({
                          title: "即将打开外部链接",
                          message: "点击确认将打开外部链接",
                        })
                        .then(function () {
                          var i = {
                            cellID: e.resourceId,
                            sourceType: 4,
                            videoEndTime: 0,
                            videoStartTime: 0,
                            viewEndTime: t.getFormattedDate(),
                            viewStartTime: t.getFormattedDate(),
                          };
                          t.$API("addResStudyTime", i).then(function () {
                            window.location.href = e.outLink;
                          });
                        })
                        .catch(function () {})
                    : "9" === e.resourceType && e.relativeId
                    ? (window.location.href = "/online_work/index.html?workId="
                        .concat(e.relativeId, "&courseId=")
                        .concat(this.courseId))
                    : "2" === e.resourceType
                    ? "1" === e.workType && e.relativeId
                      ? (window.location.href =
                          "/course_work/index.html?workId="
                            .concat(
                              e.relativeId,
                              "&workType=assignment&courseId="
                            )
                            .concat(this.courseId))
                      : Object(F["a"])("暂不支持该作业类型")
                    : Object(F["a"])("暂不支持该作业/活动类型");
                else {
                  var i = e.fileUuid,
                    o = e.resourceId;
                  this.$router.push({
                    name: "resourceDetail",
                    query: { courseId: this.courseId, resId: o, filekey: i },
                  });
                }
              },
              getFormattedDate: function () {
                var e = new Date(),
                  t = e.getFullYear(),
                  i = String(e.getMonth() + 1).padStart(2, "0"),
                  o = String(e.getDate()).padStart(2, "0"),
                  s = String(e.getHours()).padStart(2, "0"),
                  a = String(e.getMinutes()).padStart(2, "0"),
                  n = String(e.getSeconds()).padStart(2, "0");
                return ""
                  .concat(t, "-")
                  .concat(i, "-")
                  .concat(o, " ")
                  .concat(s, ":")
                  .concat(a, ":")
                  .concat(n);
              },
            },
          }),
        U = {
          methods: {
            getStuCourseCatalog: function () {
              var e = this;
              (this.initLoading = !0),
                this.$API("getStuCourseCatalog", { courseId: this.courseId })
                  .then(function (t) {
                    if ("0" === t.code) {
                      var i = t.data || [];
                      e.parseCourseModules(i);
                    }
                  })
                  .finally(function () {
                    e.initLoading = !1;
                  });
            },
            parseCourseModules: function (e) {
              var t,
                i = [],
                o = Object(M["a"])(e);
              try {
                for (o.s(); !(t = o.n()).done; ) {
                  var s = t.value;
                  i.push({
                    moduleId: s.uid,
                    moduleName: s.titleName,
                    index: s.orderIndex,
                    isHide: 2 === s.isShow || "2" === s.isShow,
                    isDisabled:
                      "0" === s.learningState || 0 === s.learningState,
                  });
                  var a = "0" === s.learningState || 0 === s.learningState;
                  s.courseChapterChild &&
                    s.courseChapterChild.length > 0 &&
                    this.parseChapters(s.uid, s.courseChapterChild, a);
                }
              } catch (n) {
                o.e(n);
              } finally {
                o.f();
              }
              this.modules = i.filter(function (e) {
                return !e.isHide;
              });
            },
            parseChapters: function (e, t, i) {
              var o,
                s = [],
                a = Object(M["a"])(t);
              try {
                for (a.s(); !(o = a.n()).done; ) {
                  var n = o.value;
                  s.push({
                    chapterId: n.uid,
                    chapterName: n.titleName,
                    index: n.orderIndex,
                    isHide: 2 === n.isShow || "2" === n.isShow,
                    isDisabled: i,
                  }),
                    n.courseResActList &&
                      n.courseResActList.length > 0 &&
                      this.parseResources(n.uid, n.courseResActList, i),
                    this.activeChapters.splice(
                      this.activeChapters.length,
                      0,
                      n.uid
                    );
                }
              } catch (r) {
                a.e(r);
              } finally {
                a.f();
              }
              this.chapters[e] = s;
            },
            parseResources: function (e, t, i) {
              var o,
                s = [],
                a = Object(M["a"])(t);
              try {
                for (a.s(); !(o = a.n()).done; ) {
                  var n = o.value;
                  s.push({
                    resourceId: n.id,
                    resourceName: n.resActName,
                    index: n.orderIndex,
                    resourceType: n.bizType,
                    studyStatus: this.translateStudyStatus(n.learningState),
                    hasRecords: "0" !== n.learningState,
                    mustStudy: "1" === n.isSee || 1 === n.isSee,
                    canComment: "1" === n.isEvaluation || 1 === n.isEvaluation,
                    canDownload: "1" === n.isDownload || 1 === n.isDownload,
                    workType: n.bizSubType,
                    _fileIcon: this.guessFileIcon(n.ext1),
                    outLink: n.resActDesc,
                    relativeId: n.bizId,
                    isHide: 1 !== n.visible && "1" !== n.visible,
                    isDisabled: i,
                  });
                }
              } catch (r) {
                a.e(r);
              } finally {
                a.f();
              }
              this.resources[e] = s;
            },
            translateStudyStatus: function (e) {
              return "0" === e ? "2" : "1" === e ? "1" : "0";
            },
            guessFileIcon: function (e) {
              return e
                ? e.indexOf("doc") >= 0
                  ? "word-icon"
                  : e.indexOf("ppt") >= 0 || e.indexOf("pps") >= 0
                  ? "ppt-icon"
                  : e.indexOf("xls") >= 0
                  ? "excel-icon"
                  : e.indexOf("pdf") >= 0
                  ? "pdf-icon"
                  : e.indexOf("mp4") >= 0
                  ? "mp4-icon"
                  : e.indexOf("mp3") >= 0 || e.indexOf("m4a") >= 0
                  ? "mp3-icon"
                  : e.indexOf("zip") >= 0
                  ? "zip-icon"
                  : ""
                : "";
            },
            showRes: function (e) {
              "link" === e.resourceType
                ? e.resActDesc &&
                  N["a"]
                    .confirm({
                      title: "提示",
                      message: "即将打开外部链接".concat(e.outLink),
                    })
                    .then(function () {
                      window.location.href = e.outLink;
                    })
                    .catch(function () {})
                : "resource" === e.resourceType
                ? this.$router.push({
                    name: "resourceDetail",
                    query: {
                      courseId: this.courseId,
                      resId: e.resourceId,
                      filekey: e.relativeId,
                    },
                  })
                : "practice" === e.resourceType
                ? e.relativeId &&
                  (window.location.href = "/online_work/index.html?workId="
                    .concat(e.relativeId, "&courseId=")
                    .concat(this.courseId))
                : "assignment" === e.resourceType
                ? e.relativeId &&
                  (window.location.href = "/course_work/index.html?workId="
                    .concat(e.relativeId, "&workType=")
                    .concat(e.resourceType, "&courseId=")
                    .concat(this.courseId))
                : "activity" === e.resourceType
                ? console.log(e.resourceType, e)
                : console.log(e);
            },
          },
        },
        Q = "dotNet_api" === a["a"].apiPrefix ? B : U,
        j = Q,
        q = {
          name: "CourseCatalog",
          components: {
            Collapse: R["a"],
            CollapseItem: E["a"],
            Empty: D["a"],
            Skeleton: O["a"],
          },
          data: function () {
            return {
              courseId: "",
              initLoading: !0,
              activeChapters: [],
              modules: [],
              chapters: {},
              resources: {},
            };
          },
          mixins: [j],
          mounted: function () {
            this.$route.query.courseId &&
              (this.courseId = this.$route.query.courseId),
              this.courseId && this.getStuCourseCatalog();
          },
          activated: function () {
            this.courseId && this.getStuCourseCatalog();
          },
        },
        z = q,
        H = (i("0b06"), Object(u["a"])(z, L, k, !1, null, "63ca1672", null)),
        W = H.exports,
        V = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i("div", { staticClass: "aiAssistantWrap" }, [
            i("iframe", {
              staticStyle: { width: "100%", height: "72vh" },
              attrs: { src: e.src, frameborder: "0" },
            }),
          ]);
        },
        G = [],
        J = (i("7db0"), i("aa6a")),
        K = {
          name: "AiAssistant",
          data: function () {
            return { src: "" };
          },
          mounted: function () {
            this.srcFn();
          },
          methods: {
            srcFn: function () {
              var e =
                  "https://kd.chatedu.jiaxutech.com/chat_open_edu/#/app?courseopenid=q0f-avmwwztlwkv9txlarw",
                t = Object(J["d"])(),
                i = this.idToCode(t.courseId),
                o = "310_" + this.$getItem("userInfo").employeeNum,
                s = ""
                  .concat(e, "&student_no=")
                  .concat(o, "&role=student&course_id=")
                  .concat(i);
              this.src = s;
            },
            idToCode: function (e) {
              var t = this.$getItem("studyCourseList"),
                i = t.find(function (t) {
                  return t.id == e;
                });
              return i ? i.courseCode : "";
            },
          },
        },
        Z = K,
        Y = Object(u["a"])(Z, V, G, !1, null, null, null),
        _ = Y.exports,
        X = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i("div", { staticClass: "learnPlanWrap" }, [
            0 == e.list.length
              ? i("span", [e._v("暂无数据...")])
              : i("pre", [e._v(e._s(e.list[0].learning_planning))]),
          ]);
        },
        $ = [],
        ee = i("1da1"),
        te = (i("96cf"), i("bc3a")),
        ie = i.n(te),
        oe = {
          name: "LearnPlan",
          data: function () {
            return { list: [] };
          },
          mounted: function () {
            this.getData();
          },
          methods: {
            getData: function () {
              var e = this;
              return Object(ee["a"])(
                regeneratorRuntime.mark(function t() {
                  var i, o, s, a, n, r;
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (i =
                              "https://kd.chatedu.jiaxutech.com/service/query?t=aigc_course&w[courseOpenId]"),
                            (o = Object(J["d"])()),
                            (s = o.courseId),
                            (a = e.idToCode(o.courseId)),
                            (n = ""
                              .concat(i, "=")
                              .concat(
                                s,
                                "&x-token=n1iqagkwuo1lvm0iqy2s4g&limit=1&order=asc&course_id="
                              )
                              .concat(a)),
                            (t.next = 7),
                            ie.a.get(n)
                          );
                        case 7:
                          (r = t.sent),
                            200 == r.status &&
                              200 == r.data.code &&
                              (e.list = r.data.data.list || []);
                        case 9:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            idToCode: function (e) {
              var t = this.$getItem("studyCourseList"),
                i = t.find(function (t) {
                  return t.id == e;
                });
              return i ? i.courseCode : "";
            },
          },
        },
        se = oe,
        ae = (i("e411"), Object(u["a"])(se, X, $, !1, null, "268773bc", null)),
        ne = ae.exports,
        re = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i("div", { staticClass: "knowledgeOrganizationWrap" }, [
            0 == e.list.length
              ? i("span", [e._v("暂无数据...")])
              : i("pre", [e._v(e._s(e.list[0].knowledge_agenda))]),
          ]);
        },
        ce = [],
        le = {
          name: "KnowledgeOrganization",
          data: function () {
            return { list: [] };
          },
          mounted: function () {
            this.getData();
          },
          methods: {
            getData: function () {
              var e = this;
              return Object(ee["a"])(
                regeneratorRuntime.mark(function t() {
                  var i, o, s, a, n, r;
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          return (
                            (i =
                              "https://kd.chatedu.jiaxutech.com/service/query?t=aigc_course&w[courseOpenId]"),
                            (o = Object(J["d"])()),
                            (s = o.courseId),
                            (a = e.idToCode(o.courseId)),
                            (n = ""
                              .concat(i, "=")
                              .concat(
                                s,
                                "&x-token=n1iqagkwuo1lvm0iqy2s4g&limit=1&order=asc&course_id="
                              )
                              .concat(a)),
                            (t.next = 7),
                            ie.a.get(n)
                          );
                        case 7:
                          (r = t.sent),
                            200 == r.status &&
                              200 == r.data.code &&
                              (e.list = r.data.data.list || []);
                        case 9:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            idToCode: function (e) {
              var t = this.$getItem("studyCourseList"),
                i = t.find(function (t) {
                  return t.id == e;
                });
              return i ? i.courseCode : "";
            },
          },
        },
        ue = le,
        de =
          (i("e067"), Object(u["a"])(ue, re, ce, !1, null, "3abb409f", null)),
        pe = de.exports,
        he = {
          name: "CourseDetail",
          components: {
            PageLayout: y["a"],
            VideoPlayer: I["a"],
            CourseDetailBottomNav: P,
            CourseCatalog: W,
            Tab: g["a"],
            Tabs: m["a"],
            AiAssistant: _,
            LearnPlan: ne,
            KnowledgeOrganization: pe,
          },
          data: function () {
            return {
              courseId: "",
              courseName: "",
              courseVideo: "",
              courseCover: i("09d7"),
              active: 0,
              isEnableAI: !1,
            };
          },
          created: function () {
            var e = this.$route.query || {};
            (this.courseId = e.courseId || ""),
              this.courseId && this.getCourseName();
          },
          methods: {
            getCourseName: function () {
              var e = this;
              Object(v["b"])(this.courseId, function (t) {
                (e.courseName = t.courseName),
                  t.courseVideo && (e.courseVideo = t.courseVideo),
                  t.previewVideo && (e.courseVideo = t.previewVideo),
                  t.courseCover && (e.courseCover = t.courseCover);
              });
            },
            isEnableAIStatus: function (e) {
              this.isEnableAI = e;
            },
          },
        },
        fe = he,
        me = (i("7950"), Object(u["a"])(fe, h, f, !1, null, "1731081b", null)),
        ge = me.exports,
        ve = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "PageLayout",
            { attrs: { title: e.courseName } },
            [
              e.initLoading
                ? i("Skeleton", {
                    staticClass: "skeleton-area",
                    staticStyle: { padding: "20px" },
                    attrs: { row: 3, loading: e.initLoading },
                  })
                : i(
                    "div",
                    {
                      staticStyle: {
                        "background-color": "#fff",
                        margin: "0px 10px",
                      },
                    },
                    [
                      i(
                        "Tabs",
                        {
                          staticStyle: { "margin-top": "10px" },
                          attrs: { color: "#4f44d1" },
                          model: {
                            value: e.activeTab,
                            callback: function (t) {
                              e.activeTab = t;
                            },
                            expression: "activeTab",
                          },
                        },
                        [
                          i("Tab", {
                            attrs: { title: "本校教师补充资源", name: "local" },
                          }),
                          i("Tab", {
                            attrs: {
                              title: "分校教师补充资源",
                              name: "others",
                            },
                          }),
                        ],
                        1
                      ),
                      "local" === e.activeTab
                        ? i(
                            "div",
                            [
                              e.localDataList.length > 0
                                ? i(
                                    "CellGroup",
                                    e._l(e.localDataList, function (t) {
                                      return i("Cell", {
                                        key: t.id,
                                        staticClass: "cell-item",
                                        attrs: {
                                          title: t.resourceName,
                                          value: t._docType,
                                          label: t.teacher + " " + t.school,
                                        },
                                        on: {
                                          click: function (i) {
                                            return e.showResInfo(t);
                                          },
                                        },
                                      });
                                    }),
                                    1
                                  )
                                : i("div", { staticClass: "no-data" }, [
                                    e._v(" 暂无相关资源 "),
                                  ]),
                            ],
                            1
                          )
                        : e._e(),
                      "others" === e.activeTab
                        ? i(
                            "div",
                            [
                              e.othersDataList.length > 0
                                ? i(
                                    "CellGroup",
                                    e._l(e.othersDataList, function (t) {
                                      return i("Cell", {
                                        key: t.id,
                                        staticClass: "cell-item",
                                        attrs: {
                                          title: t.resourceName,
                                          value: t._docType,
                                          label: t.teacher + " " + t.school,
                                        },
                                        on: {
                                          click: function (i) {
                                            return e.showResInfo(t);
                                          },
                                        },
                                      });
                                    }),
                                    1
                                  )
                                : i("div", { staticClass: "no-data" }, [
                                    e._v(" 暂无相关资源 "),
                                  ]),
                            ],
                            1
                          )
                        : e._e(),
                    ],
                    1
                  ),
              i("CourseDetailBottomNav", {
                attrs: { slot: "bottom" },
                slot: "bottom",
              }),
              i(
                "Popup",
                {
                  staticStyle: { height: "100%" },
                  attrs: { position: "bottom", "get-container": "#app" },
                  model: {
                    value: e.showDetail,
                    callback: function (t) {
                      e.showDetail = t;
                    },
                    expression: "showDetail",
                  },
                },
                [
                  i("div", { staticClass: "top-nav" }, [
                    i(
                      "span",
                      { staticClass: "back-icon", on: { click: e.closeModel } },
                      [
                        i("Icon", {
                          attrs: { name: "arrow-left", size: "24" },
                        }),
                      ],
                      1
                    ),
                    i("span", [e._v("资源详情")]),
                  ]),
                  "word" === e.previewType ||
                  "ppt" === e.previewType ||
                  "excel" === e.previewType ||
                  "pdf" === e.previewType
                    ? i("div", [
                        i("iframe", {
                          staticStyle: { width: "100%", height: "100vh" },
                          attrs: { src: e.viewPath, frameborder: "0" },
                        }),
                      ])
                    : "video" === e.previewType
                    ? i(
                        "div",
                        { staticClass: "player-wrapper" },
                        [i("VideoPlayer", { attrs: { source: e.viewPath } })],
                        1
                      )
                    : i(
                        "div",
                        [
                          i("Empty", {
                            attrs: {
                              description: "不支持该资源预览, 请至PC端下载学习",
                            },
                          }),
                        ],
                        1
                      ),
                ]
              ),
            ],
            1
          );
        },
        ye = [],
        Ie = (i("c3a6"), i("ad06")),
        Ce = (i("8a58"), i("e41f")),
        Ae = (i("c194"), i("7744")),
        we = (i("0653"), i("34e9")),
        be =
          (i("d81d"),
          i("1276"),
          {
            methods: {
              getCourseName: function () {
                var e = this;
                Object(v["b"])(this.courseId, function (t) {
                  (e.courseName = t.courseName),
                    (e.mergeCourseMainId = t.mergeCourseMainId),
                    e.getAllData();
                });
              },
              getAllData: function () {
                var e = this;
                this.$API("getCourseResourceList", {
                  courseId: this.courseId,
                  fromType: "local",
                  mincourseId: this.mergeCourseMainId || this.courseId,
                })
                  .then(function (t) {
                    if ("0" === t.code) {
                      var i = t.data || [];
                      "[object Array]" === Object.prototype.toString.call(i) &&
                        (e.localDataList = e.parseData(i));
                    }
                  })
                  .finally(function () {
                    e.initLoading = !1;
                  }),
                  this.$API("getCourseResourceList", {
                    courseId: this.courseId,
                    fromType: "others",
                    mincourseId: this.mergeCourseMainId || this.courseId,
                  }).then(function (t) {
                    if ("0" === t.code) {
                      var i = t.data || [];
                      "[object Array]" === Object.prototype.toString.call(i) &&
                        (e.othersDataList = e.parseData(i));
                    }
                  });
              },
              parseData: function (e) {
                return e.map(function (e) {
                  var t;
                  return {
                    id: e.id,
                    courseName: e.courseName,
                    resourceName: e.resouceName,
                    cover: e.cover,
                    school: e.school,
                    teacher: e.teacher,
                    resourceType: e.resourceType,
                    resourceUrl: e.resourceUrl,
                    _docType:
                      (null === (t = e.resourceUrl) || void 0 === t
                        ? void 0
                        : t.split(".")[1]) || "附件",
                  };
                });
              },
              showResInfo: function (e) {
                var t = e.resourceUrl;
                (this.previewType = this.getPerviewDocType(t)),
                  this.getWordPreview(t),
                  (this.showDetail = !0);
              },
              getPerviewDocType: function (e) {
                var t = "other",
                  i = e.replace("doc/a@", "");
                return (
                  (t =
                    i.indexOf("doc") >= 0
                      ? "word"
                      : i.indexOf("ppt") >= 0 || i.indexOf("pps") >= 0
                      ? "ppt"
                      : i.indexOf("xls") >= 0
                      ? "excel"
                      : i.indexOf("pdf") >= 0
                      ? "pdf"
                      : i.indexOf("mp4") >= 0
                      ? "video"
                      : i.indexOf("mp3") >= 0 || i.indexOf("m4a") >= 0
                      ? "audio"
                      : i.indexOf("jpg") >= 0 ||
                        i.indexOf("jpeg") >= 0 ||
                        i.indexOf("png") >= 0 ||
                        i.indexOf("gif") >= 0 ||
                        i.indexOf("bmp") >= 0
                      ? "img"
                      : "other"),
                  t
                );
              },
              getWordPreview: function (e) {
                var t = e.replace("doc/a@", "");
                "word" === this.previewType
                  ? (this.viewPath =
                      "//aia.shou.org.cn/wv/wordviewerframe.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                        t
                      ))
                  : "ppt" === this.previewType
                  ? (this.viewPath =
                      "//aia.shou.org.cn/p/PowerPointFrame.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                        t
                      ))
                  : "excel" === this.previewType
                  ? (this.viewPath =
                      "//aia.shou.org.cn/x/_layouts/xlviewerinternal.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                        t
                      ))
                  : "pdf" === this.previewType
                  ? (this.viewPath =
                      "/pdfview/web/viewer.html?pdfLink=https://ldoc.shou.org.cn/".concat(
                        e
                      ))
                  : "video" === this.previewType &&
                    (this.viewPath = "//ldoc.shou.org.cn/".concat(e));
              },
            },
          }),
        Te = {
          methods: {
            getCourseName: function () {
              var e = this;
              Object(v["b"])(this.courseId, function (t) {
                e.courseName = t.courseName;
              }),
                this.getAllData();
            },
            getAllData: function () {
              var e = this;
              this.$API("getCourseResourceList", {
                courseId: this.courseId,
                isSelf: "1",
              })
                .then(function (t) {
                  if ("0" === t.code) {
                    var i = t.data || [];
                    "[object Array]" === Object.prototype.toString.call(i) &&
                      (e.localDataList = e.parseData(i));
                  }
                })
                .finally(function () {
                  e.initLoading = !1;
                }),
                this.$API("getCourseResourceList", {
                  courseId: this.courseId,
                  isSelf: "0",
                }).then(function (t) {
                  if ("0" === t.code) {
                    var i = t.data || [];
                    "[object Array]" === Object.prototype.toString.call(i) &&
                      (e.othersDataList = e.parseData(i));
                  }
                });
            },
            parseData: function (e) {
              return e.map(function (e) {
                return {
                  id: e.uid,
                  courseName: e.courseName,
                  resourceName: e.resourceName,
                  cover: e.cover,
                  school: e.subSchoolName,
                  teacher: e.teacherName,
                  resourceType: e.resType,
                  resourceUrl: e.fileUuid,
                  _docType: e.resType,
                };
              });
            },
            showResInfo: function (e) {
              var t = e.resourceUrl,
                i = e.resourceType;
              (this.previewType = this.getPerviewDocType(i)),
                this.getWordPreview(t),
                (this.showDetail = !0);
            },
            getPerviewDocType: function (e) {
              var t = "other",
                i = e.replace("doc/a@", "");
              return (
                (t =
                  i.indexOf("doc") >= 0
                    ? "word"
                    : i.indexOf("ppt") >= 0 || i.indexOf("pps") >= 0
                    ? "ppt"
                    : i.indexOf("xls") >= 0
                    ? "excel"
                    : i.indexOf("pdf") >= 0
                    ? "pdf"
                    : i.indexOf("mp4") >= 0
                    ? "video"
                    : i.indexOf("mp3") >= 0 || i.indexOf("m4a") >= 0
                    ? "audio"
                    : i.indexOf("jpg") >= 0 ||
                      i.indexOf("jpeg") >= 0 ||
                      i.indexOf("png") >= 0 ||
                      i.indexOf("gif") >= 0 ||
                      i.indexOf("bmp") >= 0
                    ? "img"
                    : "other"),
                t
              );
            },
            getWordPreview: function (e) {
              var t = this;
              this.$API("getCourseFileDetail", {
                courseId: this.courseId,
                fileUuid: e,
              }).then(function (e) {
                if ("0" === e.code) {
                  var i = e.data || {};
                  if (i.viewPath) {
                    var o = (i.filePath || "").indexOf("doc/a@") >= 0;
                    "word" === t.previewType ||
                    "ppt" === t.previewType ||
                    "excel" === t.previewType
                      ? (t.viewPath = o
                          ? i.viewPath
                          : "//view.officeapps.live.com/op/view.aspx?src=".concat(
                              i.viewPath
                            ))
                      : "pdf" === t.previewType && i.filePath
                      ? (t.viewPath = o
                          ? "/pdfview/web/viewer.html?pdfLink=https://ldoc.shou.org.cn/".concat(
                              i.filePath
                            )
                          : "/pdfview/web/viewer.html?pdfLink=".concat(
                              i.viewPath
                            ))
                      : (t.viewPath = i.viewPath);
                  } else t.viewPath = "";
                } else F["a"].fail(e.message || "获取资源信息异常");
              });
            },
          },
        },
        Se = "dotNet_api" === a["a"].apiPrefix ? be : Te,
        xe = Se,
        Pe = {
          name: "Resources",
          components: {
            Tabs: m["a"],
            Tab: g["a"],
            CellGroup: we["a"],
            Cell: Ae["a"],
            Skeleton: O["a"],
            PageLayout: y["a"],
            Popup: Ce["a"],
            Empty: D["a"],
            Icon: Ie["a"],
            VideoPlayer: I["a"],
            CourseDetailBottomNav: P,
          },
          data: function () {
            return {
              initLoading: !0,
              showDetail: !1,
              courseId: "",
              courseName: "",
              activeTab: "local",
              previewType: "",
              viewPath: "",
              localDataList: [],
              othersDataList: [],
            };
          },
          mixins: [xe],
          created: function () {
            var e = this.$route.query || {};
            (this.courseId = e.courseId || ""),
              this.courseId && this.getCourseName();
          },
          methods: {
            closeModel: function () {
              (this.showDetail = !1),
                (this.previewType = ""),
                (this.viewPath = "");
            },
          },
        },
        Le = Pe,
        ke =
          (i("6cd1"), Object(u["a"])(Le, ve, ye, !1, null, "0249c606", null)),
        Oe = ke.exports,
        De = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i("PageLayout", { attrs: { cb: e.cb, title: e.resName } }, [
            e.isLoading
              ? i(
                  "div",
                  { staticStyle: { "text-align": "center", padding: "20px" } },
                  [
                    i("Loading", {
                      attrs: { type: "spinner", color: "#1989fa" },
                    }),
                  ],
                  1
                )
              : e.noResource
              ? i(
                  "div",
                  [i("Empty", { attrs: { description: "未找到对应的资源" } })],
                  1
                )
              : e.previewType
              ? i(
                  "div",
                  [
                    "video" === e.previewType
                      ? i(
                          "div",
                          { staticClass: "player-wrapper" },
                          [
                            i("VideoPlayer", {
                              ref: "player",
                              attrs: {
                                source: e.viewPath,
                                "last-play-time": e.lastVideoEndTime,
                                highlight: e.highlights,
                              },
                              on: {
                                pauseAtHighlight: e.pauseAtHighlight,
                                playTimeUpdate: e.playTimeUpdate,
                              },
                            }),
                          ],
                          1
                        )
                      : "audio" === e.previewType
                      ? i(
                          "div",
                          [
                            i("AudioPlayer", {
                              attrs: {
                                source: e.viewPath,
                                "audio-title": e.resName,
                              },
                              on: { playTimeUpdate: e.playTimeUpdate },
                            }),
                          ],
                          1
                        )
                      : "img" === e.previewType
                      ? i("div", { staticClass: "img-wrapper" }, [
                          i("img", {
                            attrs: { src: e.viewPath },
                            on: { click: e.showImg },
                          }),
                        ])
                      : "word" === e.previewType ||
                        "ppt" === e.previewType ||
                        "excel" === e.previewType ||
                        "html" === e.previewType ||
                        "pdf" === e.previewType
                      ? i("div", [
                          i("iframe", {
                            staticStyle: { width: "100%", height: "60vh" },
                            attrs: { src: e.viewPath, frameborder: "0" },
                          }),
                        ])
                      : i(
                          "div",
                          [
                            i("Empty", {
                              attrs: {
                                description: "不支持该资源预览, 请至PC端学习",
                              },
                            }),
                          ],
                          1
                        ),
                    e.previewType && "other" !== e.previewType
                      ? i("CommentList", {
                          attrs: {
                            "course-id": e.courseId,
                            "res-id": e.resId,
                            "prop-comment-list": e.comments,
                            "prop-tag-list": e.tags,
                            "is-collect": e.isCollect,
                          },
                          on: { doRefresh: e.refreshItems },
                        })
                      : e._e(),
                    e.showQuestion
                      ? i("PopupQuestion", {
                          attrs: {
                            "show-modal": e.showQuestion,
                            "question-info": e.questionInfo,
                          },
                          on: { closeQuestion: e.closeQuestion },
                        })
                      : e._e(),
                  ],
                  1
                )
              : e._e(),
          ]);
        },
        Ee = [],
        Re = (i("4662"), i("28a2")),
        Fe = (i("ac1e"), i("543e")),
        Ne = (i("25f0"), i("2613")),
        Me = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "div",
            { staticClass: "comment-area" },
            [
              i(
                "span",
                {
                  staticClass: "collect-icon",
                  on: {
                    click: function (t) {
                      return (
                        t.stopPropagation(),
                        e.doCollectRes.apply(null, arguments)
                      );
                    },
                  },
                },
                [
                  e.hasCollected
                    ? i("Icon", { attrs: { name: "star", color: "#ffd21e" } })
                    : i("Icon", {
                        attrs: { name: "star-o", color: "#323233" },
                      }),
                ],
                1
              ),
              i(
                "Tabs",
                {
                  staticStyle: { "margin-top": "10px" },
                  attrs: { color: "#4f44d1" },
                  model: {
                    value: e.activeTab,
                    callback: function (t) {
                      e.activeTab = t;
                    },
                    expression: "activeTab",
                  },
                },
                [
                  i("Tab", { attrs: { title: "评论", name: "comments" } }),
                  i("Tab", { attrs: { title: "标签", name: "tags" } }),
                ],
                1
              ),
              "comments" === e.activeTab
                ? i(
                    "List",
                    {
                      attrs: {
                        finished: e.isCommentEnd,
                        "immediate-check": !1,
                        "finished-text": "没有更多评论",
                      },
                      on: { load: e.onLoadComment },
                      model: {
                        value: e.isLoadingMore,
                        callback: function (t) {
                          e.isLoadingMore = t;
                        },
                        expression: "isLoadingMore",
                      },
                    },
                    e._l(e.commentList, function (t, o) {
                      return i("Cell", {
                        key: t.uid,
                        staticClass: "card-cell",
                        scopedSlots: e._u(
                          [
                            {
                              key: "title",
                              fn: function () {
                                return [
                                  i("div", { staticClass: "card-title" }, [
                                    i("span", { staticClass: "user-info" }, [
                                      i("span", { staticClass: "user-name" }, [
                                        e._v(e._s(t.userName)),
                                      ]),
                                      i("br"),
                                      i(
                                        "span",
                                        { staticStyle: { color: "#969799" } },
                                        [e._v("(" + e._s(t.userId) + ")")]
                                      ),
                                    ]),
                                    i(
                                      "span",
                                      { staticClass: "time-info" },
                                      [
                                        e._v(" " + e._s(t.createTime) + " "),
                                        i("br"),
                                        i("Rate", {
                                          attrs: {
                                            value: t.startLevel
                                              ? t.startLevel
                                              : 0,
                                            size: 12,
                                            readonly: !0,
                                            color: "#ffd21e",
                                            "void-icon": "star",
                                            "void-color": "#eee",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                  ]),
                                ];
                              },
                              proxy: !0,
                            },
                            {
                              key: "label",
                              fn: function () {
                                return [
                                  i("div", { staticClass: "comment-detail" }, [
                                    i(
                                      "div",
                                      { staticClass: "comment-content" },
                                      [
                                        i("span", {
                                          domProps: {
                                            innerHTML: e._s(t.content),
                                          },
                                        }),
                                      ]
                                    ),
                                    e.showReply
                                      ? i(
                                          "div",
                                          { staticClass: "reply-btns" },
                                          [
                                            i("span", {
                                              staticClass:
                                                "comment-icon icon-btn",
                                              on: {
                                                click: function (i) {
                                                  return e.doReply(t);
                                                },
                                              },
                                            }),
                                            i(
                                              "Badge",
                                              {
                                                attrs: {
                                                  content: t.likedCount,
                                                  max: "99",
                                                },
                                              },
                                              [
                                                t.likedStatus
                                                  ? i("span", {
                                                      staticClass:
                                                        "liked-icon icon-btn",
                                                      on: {
                                                        click: function (i) {
                                                          return e.doLike(t, o);
                                                        },
                                                      },
                                                    })
                                                  : i("span", {
                                                      staticClass:
                                                        "like-icon icon-btn",
                                                      on: {
                                                        click: function (i) {
                                                          return e.doLike(t, o);
                                                        },
                                                      },
                                                    }),
                                              ]
                                            ),
                                          ],
                                          1
                                        )
                                      : e._e(),
                                    t.childComment && t.childComment.length > 0
                                      ? i(
                                          "div",
                                          { staticClass: "reply-area" },
                                          e._l(t.childComment, function (t) {
                                            return i("ReplyItem", {
                                              key: t.uid,
                                              attrs: {
                                                "reply-item": t,
                                                "show-reply": e.showReply,
                                              },
                                              on: {
                                                doReply: function (i) {
                                                  return e.doReply(t);
                                                },
                                              },
                                            });
                                          }),
                                          1
                                        )
                                      : e._e(),
                                  ]),
                                ];
                              },
                              proxy: !0,
                            },
                          ],
                          null,
                          !0
                        ),
                      });
                    }),
                    1
                  )
                : "tags" === e.activeTab
                ? i(
                    "div",
                    { staticClass: "tag-area" },
                    [
                      e.tagList.length <= 0
                        ? i(
                            "div",
                            {
                              staticStyle: {
                                color: "#969799",
                                "font-size": "14px",
                                "line-height": "50px",
                                "text-align": "center",
                              },
                            },
                            [e._v("点击+添加标签")]
                          )
                        : e._l(e.tagList, function (t, o) {
                            return i(
                              "Tag",
                              {
                                key: o,
                                staticStyle: {
                                  "margin-bottom": "8px",
                                  "margin-right": "8px",
                                  "font-size": "14px",
                                },
                                attrs: { size: "medium", color: "#7c7f84a1" },
                                on: {
                                  click: function (i) {
                                    return e.addSameTag(t, o);
                                  },
                                },
                              },
                              [e._v(" " + e._s(t) + " ")]
                            );
                          }),
                      i(
                        "DialogItem",
                        {
                          attrs: {
                            title: "标签",
                            "show-cancel-button": "",
                            confirmButtonText: "确定",
                            confirmButtonColor: "#5682d4",
                            beforeClose: e.tagClose,
                          },
                          model: {
                            value: e.tagDialog,
                            callback: function (t) {
                              e.tagDialog = t;
                            },
                            expression: "tagDialog",
                          },
                        },
                        [
                          i(
                            "div",
                            { staticStyle: { padding: "0 10px" } },
                            [
                              i("Field", {
                                staticClass: "field-input",
                                model: {
                                  value: e.tagInfo.content,
                                  callback: function (t) {
                                    e.$set(
                                      e.tagInfo,
                                      "content",
                                      "string" === typeof t ? t.trim() : t
                                    );
                                  },
                                  expression: "tagInfo.content",
                                },
                              }),
                            ],
                            1
                          ),
                        ]
                      ),
                    ],
                    2
                  )
                : e._e(),
              i(
                "span",
                { staticClass: "add-btn", on: { click: e.doAddNew } },
                [i("Icon", { attrs: { name: "plus", size: "24" } })],
                1
              ),
              i(
                "Popup",
                {
                  staticStyle: { height: "90%", "padding-top": "4px" },
                  attrs: {
                    round: "",
                    position: "bottom",
                    "get-container": "#app",
                  },
                  model: {
                    value: e.showModal,
                    callback: function (t) {
                      e.showModal = t;
                    },
                    expression: "showModal",
                  },
                },
                [
                  i(
                    "div",
                    { staticClass: "popup-content" },
                    [
                      i("p", { staticClass: "popup-title" }, [
                        e._v(e._s(e.editForm.title)),
                      ]),
                      "reply" !== e.editType
                        ? i(
                            "div",
                            { staticClass: "input-item" },
                            [
                              i(
                                "span",
                                {
                                  staticClass: "input-label",
                                  staticStyle: { "margin-right": "10px" },
                                },
                                [e._v("资源评分:")]
                              ),
                              i("Rate", {
                                attrs: {
                                  size: 24,
                                  color: "#ffd21e",
                                  "void-icon": "star",
                                  "void-color": "#eee",
                                },
                                model: {
                                  value: e.editForm.startLevel,
                                  callback: function (t) {
                                    e.$set(e.editForm, "startLevel", t);
                                  },
                                  expression: "editForm.startLevel",
                                },
                              }),
                            ],
                            1
                          )
                        : e._e(),
                      i(
                        "div",
                        { staticClass: "input-item" },
                        [
                          i("Field", {
                            staticClass: "field-input",
                            attrs: {
                              rows: "3",
                              autosize: "",
                              type: "textarea",
                              placeholder: "评价内容",
                            },
                            model: {
                              value: e.editForm.content,
                              callback: function (t) {
                                e.$set(
                                  e.editForm,
                                  "content",
                                  "string" === typeof t ? t.trim() : t
                                );
                              },
                              expression: "editForm.content",
                            },
                          }),
                        ],
                        1
                      ),
                      i(
                        "Button",
                        {
                          staticStyle: { "margin-top": "20px" },
                          attrs: {
                            round: "",
                            block: "",
                            type: "info",
                            loading: e.isSendData,
                            "loading-text": "提交中...",
                          },
                          on: { click: e.submitComment },
                        },
                        [e._v("提交")]
                      ),
                      i(
                        "Button",
                        {
                          staticStyle: { "margin-top": "20px" },
                          attrs: { round: "", block: "" },
                          on: { click: e.cancelPopup },
                        },
                        [e._v("取消")]
                      ),
                    ],
                    1
                  ),
                ]
              ),
            ],
            1
          );
        },
        Be = [],
        Ue = (i("5f1a"), i("a3e2")),
        Qe = (i("18e9"), i("471a")),
        je = (i("66b9"), i("b650")),
        qe = (i("be7f"), i("565f")),
        ze = (i("4142"), i("39d1")),
        He = (i("2994"), i("2bdd")),
        We = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "div",
            [
              i("div", { staticClass: "reply-item" }, [
                i("div", { staticClass: "reply-title" }, [
                  i("span", { staticClass: "user-info" }, [
                    i("span", { staticClass: "user-name" }, [
                      e._v(e._s(e.replyItem.userName)),
                    ]),
                    i(
                      "span",
                      {
                        staticStyle: { color: "#969799", "margin-left": "6px" },
                      },
                      [e._v("(" + e._s(e.replyItem.userId) + ")")]
                    ),
                  ]),
                  i(
                    "span",
                    {
                      staticStyle: { float: "right", "vertical-align": "top" },
                    },
                    [e._v(e._s(e.replyItem.createTime))]
                  ),
                ]),
                i("div", { staticClass: "reply-content" }, [
                  i("span", {
                    domProps: { innerHTML: e._s(e.replyItem.content) },
                  }),
                ]),
                e.showReply
                  ? i("div", { staticClass: "reply-btns" }, [
                      i("span", {
                        staticClass: "comment-icon icon-btn",
                        on: {
                          click: function (t) {
                            return e.doReply(e.replyItem);
                          },
                        },
                      }),
                    ])
                  : e._e(),
              ]),
              e._l(e.replyItem.childComment, function (t) {
                return i("reply-item", {
                  key: t.uid,
                  attrs: { "reply-item": t, "show-reply": e.showReply },
                  on: {
                    doReply: function (i) {
                      return e.doReply(t);
                    },
                  },
                });
              }),
            ],
            2
          );
        },
        Ve = [],
        Ge = {
          name: "ReplyItem",
          props: {
            replyItem: { type: Object, default: function () {} },
            showReply: { type: Boolean, default: !1 },
          },
          methods: {
            doReply: function (e) {
              this.$emit("doReply", e);
            },
          },
        },
        Je = Ge,
        Ke =
          (i("0913"), Object(u["a"])(Je, We, Ve, !1, null, "60caf30d", null)),
        Ze = Ke.exports,
        Ye = i("5530"),
        _e = i("2909"),
        Xe =
          (i("466d"),
          {
            mounted: function () {
              this.propCommentList
                ? this.translateComment()
                : this.courseId && this.resId && (this.isCommentEnd = !0),
                (this.hasCollected = this.isCollect),
                this.propTagList &&
                  (this.tagList = this.propTagList.map(function (e) {
                    return e;
                  }));
            },
            watch: {
              propCommentList: function () {
                this.translateComment();
              },
              propTagList: function () {
                this.tagList = this.propTagList.map(function (e) {
                  return e;
                });
              },
            },
            methods: {
              translateComment: function () {
                (this.commentList = this.propCommentList.map(function (e) {
                  return {
                    uid: e.id,
                    userName: e.commentUser,
                    userId: e.commentUserId,
                    startLevel: e.rate,
                    createTime: e.dateTime,
                    content: e.content,
                    likedCount: 0,
                    likedStatus: !1,
                    childComment: [],
                  };
                })),
                  (this.isCommentEnd = !0);
              },
              getResComment: function () {
                var e = this,
                  t = {
                    courseId: this.courseId,
                    resId: this.resId,
                    offset: this.pageIndex,
                    limit: this.pageSize,
                  };
                this.$API("getComments", t)
                  .then(function (t) {
                    var i = t.data || {};
                    if ("0" === i.code) {
                      var o = (i.data || []).map(function (e) {
                        return (
                          (e.startLevel = e.startLevel
                            ? parseInt(e.startLevel, 10)
                            : 0),
                          e
                        );
                      });
                      e.commentList = [].concat(
                        Object(_e["a"])(e.commentList),
                        Object(_e["a"])(o)
                      );
                      var s = i.total || e.commentList.length;
                      s <= e.pageSize * e.pageIndex && (e.isCommentEnd = !0);
                    }
                  })
                  .finally(function () {
                    e.isLoadingMore = !1;
                  });
              },
              onLoadComment: function () {
                (this.isLoadingMore = !0),
                  this.pageIndex++,
                  this.getResComment();
              },
              addSameTag: function (e, t) {
                var i = this;
                if (e) {
                  F["a"].loading({
                    message: "提交数据中...",
                    forbidClick: !0,
                    loadingType: "spinner",
                    duration: 0,
                  });
                  var o = e.match(/\(\d+\)/);
                  if (o && o.length > 0) {
                    var s = o[0].replace(/\(|\)/g, ""),
                      a = e.replace(/\s+\(\d+\)$/, "");
                    this.$API("addRestag", {
                      courseId: this.courseId,
                      cellId: this.resId,
                      tag: a,
                    })
                      .then(function (e) {
                        if ("0" === e.code) {
                          var o = parseInt(s) + 1,
                            n = "".concat(a, " (").concat(o, ")");
                          i.tagList.splice(t, 1, n);
                        }
                      })
                      .finally(function () {
                        F["a"].clear();
                      });
                  }
                }
              },
              tagClose: function (e, t) {
                var i = this;
                if ("confirm" === e && this.tagInfo.content) {
                  var o = this.tagInfo.content;
                  this.$API("addRestag", {
                    courseId: this.courseId,
                    cellId: this.resId,
                    tag: o,
                  })
                    .then(function (e) {
                      "0" === e.code &&
                        (i.tagList.splice(0, 0, o),
                        F["a"].success("标签已添加"));
                    })
                    .finally(function () {
                      t();
                    });
                } else t();
                this.$nextTick(function () {
                  (i.tagInfo.id = ""), (i.tagInfo.content = "");
                });
              },
              submitComment: function () {
                var e = this;
                if (!this.editForm.content)
                  return F["a"].fail("评论内容不能为空"), !1;
                var t = { courseId: this.courseId, cellId: this.resId };
                "reply" === this.editType
                  ? ((t.puid = this.editForm.puid),
                    (t.content = ""
                      .concat(this.editForm.title, " ")
                      .concat(this.editForm.content)))
                  : ((t.rate = this.editForm.startLevel),
                    (t.content = this.editForm.content)),
                  (this.isSendData = !0),
                  this.$API("addResComment", t)
                    .then(function (t) {
                      if ("0" === t.code) {
                        F["a"].success("评论成功"), e.cancelPopup();
                        var i = (t.data || {}).usercomments || [],
                          o = i.map(function (e) {
                            return e.id;
                          }),
                          s = e.commentList.filter(function (e) {
                            return o.indexOf(e.uid) < 0;
                          });
                        i.map(function (e) {
                          s.splice(0, 0, {
                            uid: e.id,
                            userName: e.commentUser,
                            userId: e.commentUserId,
                            startLevel: e.rate,
                            createTime: e.dateTime,
                            content: e.content,
                            likedCount: 0,
                            likedStatus: !1,
                            childComment: [],
                          });
                        }),
                          (e.commentList = s);
                      } else F["a"].fail(t.message);
                    })
                    .catch(function (e) {
                      F["a"].fail(e.toString() || "unknown error");
                    })
                    .finally(function () {
                      e.isSendData = !1;
                    });
              },
              doCollectRes: function () {
                var e = this,
                  t = this.hasCollected ? "cancelCollectRes" : "doCollectRes",
                  i = this.hasCollected ? "取消收藏" : "收藏";
                this.$API(t, { id: this.resId })
                  .then(function (t) {
                    "0" === t.code
                      ? (F["a"].success("".concat(i, "成功")),
                        (e.hasCollected = !e.hasCollected))
                      : F["a"].fail(t.message || "".concat(i, "失败"));
                  })
                  .catch(function (e) {
                    F["a"].fail(e.toString() || "".concat(i, "失败"));
                  });
              },
              doLike: function (e) {
                if (e.likedStatus) return F["a"].fail("您已经点赞了"), !1;
              },
            },
          }),
        $e = {
          watch: {
            propCommentList: function () {
              this.translateComment();
            },
            propTagList: function () {
              this.tagList = this.propTagList.map(function (e) {
                return e;
              });
            },
          },
          mounted: function () {
            this.propCommentList
              ? this.translateComment()
              : this.courseId && this.resId && (this.isCommentEnd = !0),
              this.checkHasCollectedRes(),
              this.propTagList &&
                (this.tagList = this.propTagList.map(function (e) {
                  return e;
                }));
          },
          methods: {
            translateComment: function () {
              (this.commentList = this.propCommentList.map(function (e) {
                return Object(Ye["a"])({}, e);
              })),
                (this.isCommentEnd = !0),
                (this.showReply = !0);
            },
            getResComment: function () {},
            onLoadComment: function () {},
            addSameTag: function (e, t) {
              console.log(e, t);
            },
            tagClose: function (e, t) {
              var i = this;
              if ("confirm" === e && this.tagInfo.content) {
                var o = this.tagInfo.content;
                this.$API("addRestag", {
                  courseId: this.courseId,
                  resId: this.resId,
                  tagContent: o,
                })
                  .then(function (e) {
                    "0" === e.code &&
                      (i.$emit("doRefresh", "resTag"),
                      F["a"].success("标签已添加"));
                  })
                  .finally(function () {
                    t();
                  });
              } else t();
              this.$nextTick(function () {
                (i.tagInfo.id = ""), (i.tagInfo.content = "");
              });
            },
            submitComment: function () {
              var e = this;
              if (!this.editForm.content)
                return F["a"].fail("评论内容不能为空"), !1;
              this.isSendData = !0;
              var t = {
                courseId: this.courseId,
                resourceId: this.resId,
                plateTag: "3",
              };
              "reply" === this.editType
                ? ((t.postName = ""
                    .concat(this.editForm.title, " ")
                    .concat(this.editForm.content)),
                  (t.puid = this.editForm.puid))
                : ((t.postName = this.editForm.content),
                  (t.startLevel = this.editForm.startLevel));
              var i =
                "reply" === this.editType ? "addCommentReply" : "addComment";
              this.$API(i, t)
                .then(function (t) {
                  "0" === t.code
                    ? (F["a"].success("评论成功"),
                      e.cancelPopup(),
                      e.$emit("doRefresh", "comment"))
                    : F["a"].fail(t.message);
                })
                .finally(function () {
                  e.isSendData = !1;
                });
            },
            checkHasCollectedRes: function () {
              var e = this;
              this.$API("checkHasCollectedRes", { resActId: this.resId }).then(
                function (t) {
                  "0" === t.code && !0 === t.data
                    ? (e.hasCollected = !0)
                    : (e.hasCollected = !1);
                }
              );
            },
            doCollectRes: function () {
              var e = this,
                t = this.hasCollected ? "cancelCollectRes" : "doCollectRes",
                i = this.hasCollected ? "取消收藏" : "收藏";
              this.$API(t, { resActId: this.resId, courseId: this.courseId })
                .then(function (t) {
                  "0" === t.code
                    ? (F["a"].success("".concat(i, "成功")),
                      (e.hasCollected = !e.hasCollected))
                    : F["a"].fail(t.message || "".concat(i, "失败"));
                })
                .catch(function (e) {
                  F["a"].fail(e.toString() || "".concat(i, "失败"));
                });
            },
            doLike: function (e, t) {
              var i = this;
              if (e.likedStatus) return F["a"].fail("您已经点赞了"), !1;
              this.$API("addBBsLike", { commentId: e.uid })
                .then(function (o) {
                  "0" === o.code
                    ? (F["a"].success("点赞成功"),
                      (e.likedStatus = !0),
                      (e.likedCount += 1),
                      i.commentList.splice(t, 1, e))
                    : F["a"].fail(o.message || "点赞失败");
                })
                .catch(function (e) {
                  F["a"].fail(e.toString() || "unknown error");
                });
            },
          },
        },
        et = "dotNet_api" === a["a"].apiPrefix ? Xe : $e,
        tt = et,
        it = N["a"].Component,
        ot = {
          name: "CommentList",
          components: {
            List: He["a"],
            Cell: Ae["a"],
            Rate: ze["a"],
            Icon: Ie["a"],
            Popup: Ce["a"],
            Field: qe["a"],
            Button: je["a"],
            Badge: Qe["a"],
            Tabs: m["a"],
            Tab: g["a"],
            Tag: Ue["a"],
            DialogItem: it,
            ReplyItem: Ze,
          },
          props: {
            courseId: { type: String, default: "" },
            propCommentList: {
              type: Array,
              default: function () {
                return [];
              },
            },
            propTagList: {
              type: Array,
              default: function () {
                return [];
              },
            },
            resId: { type: String, default: "" },
            isCollect: { type: Boolean, default: !1 },
          },
          data: function () {
            return {
              isLoadingMore: !1,
              isCommentEnd: !1,
              hasCollected: !1,
              showModal: !1,
              showReply: !1,
              commentList: [],
              tagList: [],
              pageIndex: 1,
              pageSize: 10,
              activeTab: "comments",
              editType: "new",
              editForm: {
                startLevel: 0,
                content: "",
                puid: "",
                title: "新增评论",
              },
              isSendData: !1,
              tagDialog: !1,
              tagInfo: { id: "", content: "" },
            };
          },
          mixins: [tt],
          methods: {
            doAddNew: function () {
              "comments" === this.activeTab
                ? ((this.editType = "new"), (this.showModal = !0))
                : "tags" === this.activeTab && (this.tagDialog = !0);
            },
            cancelPopup: function () {
              (this.showModal = !1),
                (this.editForm = {
                  startLevel: 0,
                  content: "",
                  puid: "",
                  title: "新增评论",
                }),
                (this.editType = "");
            },
            doReply: function (e) {
              var t = e.uid;
              (this.editForm.puid = t),
                (this.editForm.title = "回复: " + e.userName),
                (this.editType = "reply"),
                (this.showModal = !0);
            },
          },
        },
        st = ot,
        at =
          (i("05ba"), Object(u["a"])(st, Me, Be, !1, null, "050ca55c", null)),
        nt = at.exports,
        rt = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "Popup",
            {
              staticStyle: { height: "90%", "padding-top": "4px" },
              attrs: {
                round: "",
                position: "bottom",
                "get-container": "#app",
                "close-on-click-overlay": !1,
              },
              model: {
                value: e.isOPen,
                callback: function (t) {
                  e.isOPen = t;
                },
                expression: "isOPen",
              },
            },
            [
              i(
                "div",
                { staticClass: "popup-content" },
                [
                  i("QuestionTitle", {
                    attrs: { title: e.questionInfo.questionTitle },
                  }),
                  i("QuestionOptions", {
                    ref: "questionOption",
                    attrs: {
                      "question-type": e.questionInfo.questionType,
                      optionsArr: e.questionInfo.options,
                    },
                  }),
                  i(
                    "Button",
                    {
                      staticStyle: { "margin-top": "20px" },
                      attrs: { round: "", block: "", type: "info" },
                      on: { click: e.doSaveQA },
                    },
                    [e._v("提交")]
                  ),
                ],
                1
              ),
            ]
          );
        },
        ct = [],
        lt = i("d23f"),
        ut = i("8d27"),
        dt = {
          name: "PopupQuestion",
          components: {
            Popup: Ce["a"],
            Button: je["a"],
            QuestionTitle: lt["a"],
            QuestionOptions: ut["a"],
          },
          props: {
            showModal: { type: Boolean, default: !1 },
            questionInfo: {
              type: Object,
              default: function () {
                return {
                  options: [],
                  is_replay: !1,
                  questionId: "",
                  questionTitle: "",
                  questionType: "",
                  rightAnswer: "",
                  showAtSeconds: 0,
                };
              },
            },
          },
          data: function () {
            return { isOPen: !1 };
          },
          mounted: function () {
            this.isOPen = this.showModal;
          },
          methods: {
            doSaveQA: function () {
              var e = this;
              if (this.$refs.questionOption) {
                var t = this.$refs.questionOption.getUserAnswer();
                t
                  ? this.questionInfo.rightAnswer
                    ? this.questionInfo.rightAnswer === t
                      ? (Object(F["a"])("回答正确"),
                        this.$emit("closeQuestion"))
                      : this.questionInfo.is_replay
                      ? Object(F["a"])({
                          message: "回答错误, 即将回放视频",
                          onClose: function () {
                            e.$emit("closeQuestion", !0);
                          },
                        })
                      : (Object(F["a"])("回答错误"),
                        this.$emit("closeQuestion"))
                    : this.$emit("closeQuestion")
                  : Object(F["a"])("请完成答题");
              } else this.$emit("closeQuestion");
            },
          },
        },
        pt = dt,
        ht =
          (i("bcf8"), Object(u["a"])(pt, rt, ct, !1, null, "8fdf6970", null)),
        ft = ht.exports,
        mt = {
          methods: {
            getResDetail: function () {
              var e = this;
              this.$API("getCourseFileDetail", {
                courseId: this.courseId,
                resId: this.resId,
              })
                .then(function (t) {
                  if ("0" === t.code) {
                    var i = t.data || {};
                    i.resouceName && (e.resName = i.resouceName),
                      i.topicId && (e.topicId = i.topicId),
                      i.lastVideoEndTime &&
                        (e.lastVideoEndTime = i.lastVideoEndTime),
                      i.cellQuestions && e.setVideoQuestion(i.cellQuestions),
                      (e.comments = i.comments || []),
                      (e.tags = i.tags || []),
                      (e.isCollect = i.isCollect || !1),
                      !e.filekey &&
                        i.resourceUrl &&
                        ((e.filekey = i.resourceUrl), e.getResPreviewInfo());
                  } else (e.noResource = !0), (e.isLoading = !1), F["a"].fail(t.message || "获取资源信息异常");
                })
                .catch(function (t) {
                  (e.noResource = !0),
                    (e.isLoading = !1),
                    F["a"].fail(t.toString() || "unknown error");
                });
            },
            getResPreviewInfo: function () {
              var e = this;
              this.$API("getResPreviewInfo", { filekey: this.filekey })
                .then(function (t) {
                  if ("0" === t.code) {
                    var i = t.data || {},
                      o = i.extension,
                      s = i.category;
                    if ("office" === s)
                      (e.previewType = e.getPerviewDocType(o)),
                        e.getWordPreview(i);
                    else if ("img" === s) {
                      var a;
                      (e.previewType = "img"),
                        (e.viewPath =
                          null === (a = i.urls) || void 0 === a
                            ? void 0
                            : a.preview);
                    } else if ("mp3" === s) {
                      var n;
                      (e.previewType = "audio"),
                        (e.viewPath =
                          null === (n = i.urls) || void 0 === n
                            ? void 0
                            : n.preview);
                    } else if ("video" === s) {
                      var r;
                      (e.previewType = "video"),
                        (e.viewPath =
                          null === (r = i.urls) || void 0 === r
                            ? void 0
                            : r.preview);
                    } else if ("ziph" === s) {
                      var c;
                      e.previewType,
                        (e.viewPath =
                          null === (c = i.urls) || void 0 === c
                            ? void 0
                            : c.preview);
                    } else e.previewType = "other";
                    "audio" !== e.previewType &&
                      "video" !== e.previewType &&
                      "other" !== e.previewType &&
                      e.addResourceViewTime();
                  }
                })
                .finally(function () {
                  e.isLoading = !1;
                });
            },
            getWordPreview: function (e) {
              var t = this.filekey.replace("doc/a@", "");
              if ("word" === this.previewType)
                this.viewPath =
                  "//aia.shou.org.cn/wv/wordviewerframe.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    t
                  );
              else if ("ppt" === this.previewType)
                this.viewPath =
                  "//aia.shou.org.cn/p/PowerPointFrame.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    t
                  );
              else if ("excel" === this.previewType)
                this.viewPath =
                  "//aia.shou.org.cn/x/_layouts/xlviewerinternal.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    t
                  );
              else if ("pdf" === this.previewType) {
                var i,
                  o =
                    null === (i = e.urls) || void 0 === i ? void 0 : i.preview;
                o &&
                  (this.viewPath = "/pdfview/web/viewer.html?pdfLink=".concat(
                    o
                  ));
              }
            },
            addResourceViewTime: function () {
              var e = this,
                t = Object(J["c"])(),
                i = {
                  viewStartTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                  videoStartTime: 0,
                  cellID: this.resId,
                  sourceType: "IOS" === t ? 3 : 2,
                };
              this.timeCount = setTimeout(function () {
                (i.viewEndTime = dayjs().format("YYYY-MM-DD HH:mm:ss")),
                  (i.videoEndTime = 0),
                  e.submitViewTime(i),
                  e.addResourceViewTime();
              }, 6e4);
            },
            submitViewTime: function (e) {
              this.$API("addResStudyTime", e)
                .then(function (e) {
                  "0" != e.code &&
                    F["a"].fail(
                      e.message || "资源学习记录错误，请刷新页面重试"
                    );
                })
                .catch(function (e) {
                  F["a"].fail(
                    e.toString() || "资源学习记录错误，请刷新页面重试"
                  );
                });
            },
            refreshItems: function () {},
          },
        },
        gt = {
          methods: {
            getResDetail: function () {
              this.getComments(),
                this.getResTagList(),
                this.filekey || this.getResPreviewInfo();
            },
            getComments: function () {
              var e = this;
              this.$API("getComments", {
                courseId: this.courseId,
                resId: this.resId,
              }).then(function (t) {
                if ("0" === t.code) {
                  var i = t.data || [];
                  e.comments = e.parseComments(i);
                }
              });
            },
            parseComments: function (e) {
              var t = this;
              return e.length > 0
                ? e.map(function (e) {
                    var i = (e.createUser || "").replace("310_", ""),
                      o = (e.userName || "").replace(/\(.*\)/, "");
                    return {
                      uid: e.uid,
                      userName: o,
                      userId: i,
                      startLevel: parseInt(e.startLevel),
                      createTime: e.createTime,
                      content: e.postName,
                      likedCount: e.likedCount,
                      likedStatus: 1 === e.likedStatus || "1" === e.likedStatus,
                      childComment: t.parseComments(e.childComment || []),
                    };
                  })
                : [];
            },
            getResTagList: function () {
              var e = this;
              this.$API("getResTagList", {
                courseId: this.courseId,
                resId: this.resId,
              }).then(function (t) {
                "0" === t.code &&
                  (e.tags = (t.data || []).map(function (e) {
                    return e.tagContent;
                  }));
              });
            },
            refreshItems: function (e) {
              "comment" === e
                ? this.getComments()
                : "resTag" === e && this.getResTagList();
            },
            getResPreviewInfo: function () {
              var e = this,
                t = { courseId: this.courseId, resActId: this.resId };
              this.filekey && (t.resId = this.filekey),
                this.$API("getStuCourseResDetail", t)
                  .then(function (t) {
                    if ("0" === t.code) {
                      var i = t.data || {};
                      !e.filekey && (e.filekey = i.fileUuid),
                        i.fileName && (e.resName = i.fileName);
                      var o = i.filePath || "",
                        s = i.fileType;
                      (e.previewType = e.getPerviewDocType(s)),
                        (e.viewPath = e.getPreviewPath(i.viewPath, o)),
                        "audio" !== e.previewType &&
                          "video" !== e.previewType &&
                          "other" !== e.previewType &&
                          e.addResourceViewTime();
                    } else (e.noResource = !0), F["a"].fail(t.message || "获取资源信息异常");
                  })
                  .finally(function () {
                    e.isLoading = !1;
                  });
            },
            getPreviewPath: function (e, t) {
              var i = t.indexOf("doc/a@") >= 0;
              return "word" === this.previewType ||
                "ppt" === this.previewType ||
                "excel" === this.previewType
                ? i
                  ? e
                  : "//view.officeapps.live.com/op/view.aspx?src=".concat(e)
                : "pdf" === this.previewType
                ? i
                  ? "/pdfview/web/viewer.html?pdfLink=https://ldoc.shou.org.cn/".concat(
                      t
                    )
                  : "/pdfview/web/viewer.html?pdfLink=".concat(e)
                : e;
            },
            addResourceViewTime: function () {
              var e = this,
                t = Object(J["c"])(),
                i = {
                  viewStartTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                  videoStartTime: 0,
                  cellID: this.resId,
                  sourceType: "IOS" === t ? 3 : 2,
                };
              this.timeCount = setTimeout(function () {
                (i.viewEndTime = dayjs().format("YYYY-MM-DD HH:mm:ss")),
                  (i.videoEndTime = 0),
                  e.submitViewTime(i),
                  e.addResourceViewTime();
              }, 3e4);
            },
            submitViewTime: function (e) {
              var t = e.viewStartTime,
                i = e.viewEndTime,
                o = e.videoStartTime,
                s = e.videoEndTime,
                a = t ? dayjs(t).valueOf() : dayjs().valueOf(),
                n = i ? dayjs(i).valueOf() : dayjs().valueOf(),
                r = o || 0,
                c = s || 0,
                l = "";
              l =
                "video" === this.previewType || "audio" === this.previewType
                  ? this.previewType
                  : "document";
              var u = {
                resType: l,
                resActId: this.resId,
                resId: this.filekey,
                courseId: this.courseId,
                startSecond: r,
                endSecond: c,
                startTimestamp: a,
                endTimestamp: n,
              };
              this.$API("addResStudyTime", u).then(function () {});
            },
          },
        },
        vt = "dotNet_api" === a["a"].apiPrefix ? mt : gt,
        yt = vt,
        It = {
          name: "ResourceView",
          components: {
            Loading: Fe["a"],
            Empty: D["a"],
            PageLayout: y["a"],
            VideoPlayer: I["a"],
            AudioPlayer: Ne["a"],
            CommentList: nt,
            PopupQuestion: ft,
          },
          data: function () {
            return {
              isLoading: !0,
              noResource: !1,
              resName: "资源详情页",
              filekey: "",
              courseId: "",
              resId: "",
              topicId: "",
              previewType: "",
              viewPath: "",
              comments: [],
              tags: [],
              isCollect: !1,
              lastVideoEndTime: 0,
              questions: [],
              highlights: [],
              showQuestion: !1,
              questionInfo: {},
              timeCount: null,
            };
          },
          mixins: [yt],
          mounted: function () {
            var e = Object(J["d"])();
            e && e.courseId && e.resId
              ? ((this.courseId = e.courseId),
                (this.filekey = e.filekey),
                (this.resId = e.resId),
                this.resId && this.getResDetail(),
                this.filekey && this.getResPreviewInfo())
              : ((this.isLoading = !1), (this.noResource = !0));
          },
          beforeDestroy: function () {
            this.timeCount && clearTimeout(this.timeCount);
          },
          methods: {
            cb: function () {
              var e,
                t,
                i = this;
              null !== (e = this.$refs.player) &&
              void 0 !== e &&
              e.dpPlayer.video.paused
                ? console.log("暂停状态退出不发请求，播放状态退出才发请求")
                : null === (t = this.$refs.player) ||
                  void 0 === t ||
                  t.savePlayInfo();
              return new Promise(function (e) {
                i.$nextTick(function () {
                  e(!0);
                });
              });
            },
            getPerviewDocType: function (e) {
              if (!e) return "other";
              var t = "other";
              return (
                (t =
                  e.indexOf("doc") >= 0
                    ? "word"
                    : e.indexOf("ppt") >= 0 || e.indexOf("pps") >= 0
                    ? "ppt"
                    : e.indexOf("xls") >= 0
                    ? "excel"
                    : e.indexOf("pdf") >= 0
                    ? "pdf"
                    : e.indexOf("mp4") >= 0
                    ? "video"
                    : e.indexOf("mp3") >= 0 || e.indexOf("m4a") >= 0
                    ? "audio"
                    : e.indexOf("jpg") >= 0 ||
                      e.indexOf("jpeg") >= 0 ||
                      e.indexOf("png") >= 0 ||
                      e.indexOf("gif") >= 0 ||
                      e.indexOf("bmp") >= 0
                    ? "img"
                    : "other"),
                t
              );
            },
            playTimeUpdate: function (e) {
              if (0 !== e.startSecond || 0 !== e.endSecond) {
                var t = Object(J["c"])(),
                  i = {
                    viewStartTime: dayjs(e.startTimestamp).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    viewEndTime: dayjs(e.endTimestamp).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    videoStartTime: e.startSecond,
                    videoEndTime: e.endSecond,
                    cellID: this.resId,
                    sourceType: "IOS" === t ? 3 : 2,
                    Speed: e.Speed,
                  };
                this.submitViewTime(i);
              } else console.log("未播放不记录");
            },
            setVideoQuestion: function (e) {
              var t = this;
              (this.questions = e.map(function (e) {
                return {
                  options: t.parseOptions(e.options),
                  is_replay: 1 === e.is_replay || "1" === e.is_replay,
                  questionId: e.questionId,
                  questionTitle: e.questionTitle,
                  questionType: e.questionType,
                  rightAnswer: e.rightAnswer,
                  showAtSeconds: parseFloat(e.shoutime),
                };
              })),
                this.questions.length > 0 && this.setHighlight();
            },
            parseOptions: function (e) {
              var t = [];
              try {
                var i = JSON.parse(e);
                return (
                  "[object Array]" === Object.prototype.toString.call(i) &&
                    i.length > 0 &&
                    (t = i.map(function (e) {
                      return {
                        optionId: e.SortOrder.toString(),
                        optionText: e.Content || e.content,
                      };
                    })),
                  t
                );
              } catch (o) {
                return console.log(o.toString()), t;
              }
            },
            setHighlight: function () {
              this.highlights = this.questions.map(function (e, t) {
                return {
                  time: e.showAtSeconds,
                  text: e.questionTitle,
                  needPause: !0,
                  _index: t,
                };
              });
            },
            pauseAtHighlight: function (e) {
              if (e && e._index >= 0) {
                var t = Object.assign({}, this.questions[e._index]);
                (t._index = e._index),
                  (this.questionInfo = t),
                  (this.showQuestion = !0);
              }
            },
            closeQuestion: function (e) {
              var t = this;
              if (e) {
                var i = 0;
                (i =
                  0 === this.questionInfo._index
                    ? 0
                    : this.questions[this.questionInfo._index - 1]
                        .showAtSeconds),
                  this.$refs.player &&
                    (this.$refs.player.jumpToTime(i),
                    this.$nextTick(function () {
                      t.$refs.player.goOnPlay();
                    }));
              } else this.$refs.player && this.$refs.player.goOnPlay();
              (this.showQuestion = !1), (this.questionInfo = {});
            },
            showImg: function () {
              Object(Re["a"])([this.viewPath]);
            },
          },
        },
        Ct = It,
        At =
          (i("ba53"), Object(u["a"])(Ct, De, Ee, !1, null, "45b55266", null)),
        wt = At.exports,
        bt = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "PageLayout",
            { attrs: { title: e.courseName } },
            [
              e.initLoading
                ? i("Skeleton", {
                    staticClass: "skeleton-area",
                    staticStyle: { padding: "20px" },
                    attrs: { row: 3, loading: e.initLoading },
                  })
                : i(
                    "div",
                    { staticClass: "content-wrapper" },
                    [
                      e._l(e.infoData, function (t) {
                        return i(
                          "div",
                          { key: t.id, staticClass: "info-area" },
                          [
                            i("div", { staticClass: "info-title" }, [
                              i("p", [e._v(e._s(t.title))]),
                            ]),
                            i("div", { staticClass: "preview-area" }, [
                              "img" === t.previewType
                                ? i("div", { staticClass: "img-wrapper" }, [
                                    i("img", { attrs: { src: t.viewPath } }),
                                  ])
                                : "word" === t.previewType ||
                                  "ppt" === t.previewType ||
                                  "excel" === t.previewType ||
                                  "pdf" === t.previewType
                                ? i("div", [
                                    i("iframe", {
                                      staticStyle: {
                                        width: "100%",
                                        height: "90vh",
                                      },
                                      attrs: {
                                        src: t.viewPath,
                                        frameborder: "0",
                                      },
                                    }),
                                  ])
                                : i("div", [e._v(" 该栏目暂不支持预览 ")]),
                            ]),
                          ]
                        );
                      }),
                      e.infoData.length <= 0
                        ? i(
                            "div",
                            {
                              staticClass: "info-area",
                              staticStyle: {
                                padding: "20px",
                                "background-color": "#fff",
                                "text-align": "center",
                                color: "#919191",
                              },
                            },
                            [e._v(" 暂无相关信息 ")]
                          )
                        : e._e(),
                    ],
                    2
                  ),
              i("CourseDetailBottomNav", {
                attrs: { slot: "bottom" },
                slot: "bottom",
              }),
            ],
            1
          );
        },
        Tt = [],
        St =
          (i("a4d3"),
          i("e01a"),
          {
            DESCRIPTION: "课程描述",
            DESCRIPTIONDOC: "课程描述",
            SYLLABUS: "教学大纲",
            SYLLABUSDOC: "教学大纲",
            TEXTBOOKINFORMATION: "教学材料",
            TEXTBOOKINFORMATIONDOC: "教学材料",
            REFERENCEMATERIAL: "参考材料",
            REFERENCEMATERIALDOC: "参考材料",
            FAQ: "常见问题",
            FAQDOC: "常见问题",
            CONTACTWAY: "联系方式",
            CONTACTWAYDOC: "联系方式",
            TEACHINGIMPLEMENTINGRULES: "教学实施细则",
            TEACHINGIMPLEMENTINGRULESDOC: "教学实施细则",
            PRACTICETEACHINGRULES: "实践教学实施细则",
            PRACTICETEACHINGRULESDOC: "实践教学实施细则",
            SHAPEDTESTDETAILS: "形考实施细则",
            SHAPEDTESTDETAILSDOC: "形考实施细则",
          }),
        xt = {
          methods: {
            getCourseDocInfo: function () {
              var e = this;
              this.$API("getCourseDocInfo", { courseId: this.courseId })
                .then(function (t) {
                  if ("0" === t.code) {
                    var i = t.data || [];
                    e.infoData = i.map(function (t, i) {
                      var o = e.getPreviewType(t.previewUrl || t.description);
                      return {
                        id: i,
                        title: t.title
                          ? St[t.title.toUpperCase()] || t.title
                          : "课程栏目",
                        previewType: o,
                        viewPath: e.getViewPath(
                          o,
                          t.previewUrl || t.description
                        ),
                      };
                    });
                  }
                })
                .finally(function () {
                  e.initLoading = !1;
                });
            },
            getPreviewType: function (e) {
              var t = e.replace("doc/a@", "");
              return t.indexOf("jpg") >= 0 ||
                t.indexOf("jpeg") >= 0 ||
                t.indexOf("png") >= 0 ||
                t.indexOf("gif") >= 0 ||
                t.indexOf("bmp") >= 0
                ? "img"
                : t.indexOf("doc") >= 0
                ? "word"
                : t.indexOf("ppt") >= 0 || t.indexOf("pps") >= 0
                ? "ppt"
                : t.indexOf("xls") >= 0
                ? "excel"
                : t.indexOf("pdf") >= 0
                ? "pdf"
                : "others";
            },
            getViewPath: function (e, t) {
              if ("img" === e) return t;
              var i = t.replace("doc/a@", "");
              return "word" === e
                ? "//aia.shou.org.cn/wv/wordviewerframe.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    i
                  )
                : "ppt" === e
                ? "//aia.shou.org.cn/p/PowerPointFrame.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    i
                  )
                : "excel" === e
                ? "//aia.shou.org.cn/x/_layouts/xlviewerinternal.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    i
                  )
                : "pdf" === e
                ? "/pdfview/web/viewer.html?pdfLink=https://ldoc.shou.org.cn/".concat(
                    t
                  )
                : void 0;
            },
          },
        },
        Pt = {
          methods: {
            getCourseDocInfo: function () {
              var e = this;
              this.$API("getCourseInfoList", { courseId: this.courseId })
                .then(function (t) {
                  if ("0" === t.code) {
                    var i = t.data || [];
                    e.infoData = i.map(function (t, i) {
                      return (
                        t.fileUuid && e.getCourseFileDetail(t.fileUuid, i),
                        {
                          id: t.id,
                          columnId: t.columnId,
                          title: t.columnName,
                          fileUuid: t.fileUuid,
                          previewType: "",
                          viewPath: "",
                        }
                      );
                    });
                  }
                })
                .finally(function () {
                  e.initLoading = !1;
                });
            },
            getCourseFileDetail: function (e, t) {
              var i = this;
              this.$API("getCourseFileDetail", {
                courseId: this.courseId,
                fileUuid: e,
              }).then(function (e) {
                if ("0" === e.code) {
                  var o = e.data || {},
                    s = o.filePath,
                    a = o.fileType,
                    n = o.viewPath,
                    r = i.getPreviewType(a),
                    c = "",
                    l = s.indexOf("doc/a@") >= 0;
                  c =
                    "word" === r || "ppt" === r || "excel" === r
                      ? l
                        ? n
                        : "//view.officeapps.live.com/op/view.aspx?src=".concat(
                            n
                          )
                      : "pdf" === r
                      ? l
                        ? "/pdfview/web/viewer.html?pdfLink=https://ldoc.shou.org.cn/".concat(
                            s
                          )
                        : "/pdfview/web/viewer.html?pdfLink=".concat(n)
                      : n;
                  var u = i.infoData[t];
                  (u.previewType = r), (u.viewPath = c);
                }
              });
            },
            getPreviewType: function (e) {
              return e.indexOf("jpg") >= 0 ||
                e.indexOf("jpeg") >= 0 ||
                e.indexOf("png") >= 0 ||
                e.indexOf("gif") >= 0 ||
                e.indexOf("bmp") >= 0
                ? "img"
                : e.indexOf("doc") >= 0
                ? "word"
                : e.indexOf("ppt") >= 0 || e.indexOf("pps") >= 0
                ? "ppt"
                : e.indexOf("xls") >= 0
                ? "excel"
                : e.indexOf("pdf") >= 0
                ? "pdf"
                : "others";
            },
          },
        },
        Lt = "dotNet_api" === a["a"].apiPrefix ? xt : Pt,
        kt = Lt,
        Ot = {
          name: "CourseInfo",
          components: {
            PageLayout: y["a"],
            CourseDetailBottomNav: P,
            Skeleton: O["a"],
          },
          data: function () {
            return {
              courseId: "",
              initLoading: !0,
              courseName: "测试课程名称",
              infoData: [],
            };
          },
          mixins: [kt],
          created: function () {
            var e = this.$route.query || {};
            (this.courseId = e.courseId || ""),
              this.courseId && this.getCourseName();
          },
          mounted: function () {
            this.courseId && this.getCourseDocInfo();
          },
          methods: {
            getCourseName: function () {
              var e = this;
              Object(v["b"])(this.courseId, function (t) {
                (e.courseName = t.courseName),
                  t.courseVideo && (e.courseVideo = t.courseVideo),
                  t.courseCover && (e.courseCover = t.courseCover);
              });
            },
          },
        },
        Dt = Ot,
        Et =
          (i("2f01"), Object(u["a"])(Dt, bt, Tt, !1, null, "17a6c65d", null)),
        Rt = Et.exports,
        Ft = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "PageLayout",
            { attrs: { title: e.courseName } },
            [
              i(
                "Tabs",
                {
                  staticStyle: { "margin-top": "10px" },
                  attrs: { color: "#4f44d1" },
                  model: {
                    value: e.activeTab,
                    callback: function (t) {
                      e.activeTab = t;
                    },
                    expression: "activeTab",
                  },
                },
                [
                  i("Tab", { attrs: { title: "全部帖子", name: "all" } }),
                  i("Tab", { attrs: { title: "精华帖子", name: "isEssence" } }),
                ],
                1
              ),
              i("Skeleton", {
                staticClass: "skeleton-area",
                attrs: { row: 3, loading: e.initLoading },
              }),
              e.initLoading
                ? e._e()
                : i(
                    "List",
                    {
                      staticClass: "list-items",
                      attrs: {
                        finished: e.isEnd,
                        "immediate-check": !1,
                        "finished-text": "没有更多了",
                      },
                      on: { load: e.onLoad },
                      model: {
                        value: e.isLoadingMore,
                        callback: function (t) {
                          e.isLoadingMore = t;
                        },
                        expression: "isLoadingMore",
                      },
                    },
                    e._l(e.dataList, function (t) {
                      return i(
                        "div",
                        { key: t.topicId, staticClass: "card-item" },
                        [
                          i("Cell", {
                            staticClass: "card-cell",
                            attrs: { border: !1 },
                            on: {
                              click: function (i) {
                                return e.showQADetail(t);
                              },
                            },
                            scopedSlots: e._u(
                              [
                                {
                                  key: "title",
                                  fn: function () {
                                    return [
                                      i("h3", { staticClass: "card-title" }, [
                                        e._v(e._s(t.title)),
                                      ]),
                                    ];
                                  },
                                  proxy: !0,
                                },
                                {
                                  key: "label",
                                  fn: function () {
                                    return [
                                      i("p", { staticClass: "card-info" }, [
                                        e._v(e._s(t.createTime || "-")),
                                      ]),
                                      i("p", { staticClass: "card-info" }, [
                                        e._v(
                                          "浏览: " +
                                            e._s(t.viewCount || 0) +
                                            " "
                                        ),
                                        i("span", [
                                          e._v(
                                            "回复: " + e._s(t.commentCount || 0)
                                          ),
                                        ]),
                                      ]),
                                    ];
                                  },
                                  proxy: !0,
                                },
                              ],
                              null,
                              !0
                            ),
                          }),
                          t._canEdit
                            ? i(
                                "Grid",
                                { attrs: { clickable: "", "column-num": 2 } },
                                [
                                  i("GridItem", {
                                    staticClass: "grid-item",
                                    attrs: { text: "编辑" },
                                    on: {
                                      click: function (i) {
                                        return e.doEdit(t);
                                      },
                                    },
                                  }),
                                  i("GridItem", {
                                    staticClass: "grid-item",
                                    attrs: { text: "删除" },
                                    on: {
                                      click: function (i) {
                                        return e.doDelete(t);
                                      },
                                    },
                                  }),
                                ],
                                1
                              )
                            : e._e(),
                        ],
                        1
                      );
                    }),
                    0
                  ),
              e.courseId
                ? i(
                    "span",
                    { staticClass: "add-btn", on: { click: e.doAddNew } },
                    [i("Icon", { attrs: { name: "plus" } })],
                    1
                  )
                : e._e(),
              i(
                "Popup",
                {
                  staticStyle: { height: "90%", "padding-top": "4px" },
                  attrs: {
                    round: "",
                    position: "bottom",
                    "get-container": "#app",
                  },
                  model: {
                    value: e.showModal,
                    callback: function (t) {
                      e.showModal = t;
                    },
                    expression: "showModal",
                  },
                },
                [
                  i(
                    "div",
                    { staticClass: "popup-content" },
                    [
                      i("Field", {
                        attrs: { label: "标题", placeholder: "请输入标题" },
                        model: {
                          value: e.editForm.title,
                          callback: function (t) {
                            e.$set(
                              e.editForm,
                              "title",
                              "string" === typeof t ? t.trim() : t
                            );
                          },
                          expression: "editForm.title",
                        },
                      }),
                      i("Field", {
                        attrs: {
                          label: "内容",
                          rows: "3",
                          autosize: "",
                          type: "textarea",
                          placeholder: "请输入内容",
                        },
                        model: {
                          value: e.editForm.content,
                          callback: function (t) {
                            e.$set(
                              e.editForm,
                              "content",
                              "string" === typeof t ? t.trim() : t
                            );
                          },
                          expression: "editForm.content",
                        },
                      }),
                      i(
                        "Button",
                        {
                          staticStyle: { "margin-top": "20px" },
                          attrs: { round: "", block: "", type: "info" },
                          on: { click: e.doSaveQA },
                        },
                        [e._v("提交")]
                      ),
                      i(
                        "Button",
                        {
                          staticStyle: { "margin-top": "20px" },
                          attrs: { round: "", block: "" },
                          on: { click: e.cancelPopup },
                        },
                        [e._v("取消")]
                      ),
                    ],
                    1
                  ),
                ]
              ),
              e.QADetailModel
                ? i("CourseQADetail", {
                    attrs: {
                      "show-detail": e.QADetailModel,
                      "detail-info": e.QAInfo,
                    },
                    on: { closeModel: e.closeModel },
                  })
                : e._e(),
              i("CourseDetailBottomNav", {
                attrs: { slot: "bottom" },
                slot: "bottom",
              }),
            ],
            1
          );
        },
        Nt = [],
        Mt = (i("0ec5"), i("21ab")),
        Bt = (i("3df5"), i("2830")),
        Ut = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "Popup",
            {
              staticStyle: { height: "100%" },
              attrs: { position: "bottom", "get-container": "#app" },
              model: {
                value: e.showDetail,
                callback: function (t) {
                  e.showDetail = t;
                },
                expression: "showDetail",
              },
            },
            [
              i("div", { staticClass: "top-nav" }, [
                i(
                  "span",
                  { staticClass: "back-icon", on: { click: e.closeModel } },
                  [i("Icon", { attrs: { name: "arrow-left", size: "24" } })],
                  1
                ),
                i("span", [e._v("帖子详情")]),
              ]),
              i("div", [
                i("div", { staticClass: "post-title" }, [
                  e._v(e._s(e.detailInfo.title)),
                ]),
                i("div", {
                  staticClass: "post-content",
                  domProps: { innerHTML: e._s(e.detailInfo.content) },
                }),
                i("div", { staticClass: "post-user" }, [
                  e._v(" " + e._s(e.detailInfo.userName)),
                  i("br"),
                  i("span", { staticClass: "post-time" }, [
                    e._v(e._s(e.detailInfo.createTime)),
                  ]),
                ]),
                i(
                  "div",
                  { staticClass: "comment-area" },
                  [
                    i(
                      "List",
                      {
                        attrs: {
                          finished: e.isCommentEnd,
                          "immediate-check": !1,
                          "finished-text": "没有更多评论",
                        },
                        on: { load: e.onLoadComment },
                        model: {
                          value: e.isLoadingMore,
                          callback: function (t) {
                            e.isLoadingMore = t;
                          },
                          expression: "isLoadingMore",
                        },
                      },
                      e._l(e.commentList, function (t, o) {
                        return i("Cell", {
                          key: t.replyId,
                          staticClass: "card-cell",
                          scopedSlots: e._u(
                            [
                              {
                                key: "title",
                                fn: function () {
                                  return [
                                    i("div", { staticClass: "card-title" }, [
                                      i(
                                        "span",
                                        {
                                          staticStyle: {
                                            display: "inline-block",
                                            "line-height": "1.2",
                                            "font-weight": "bolder",
                                            color: "#1E1D1D",
                                          },
                                        },
                                        [e._v(" " + e._s(t.userName) + " ")]
                                      ),
                                      i(
                                        "span",
                                        {
                                          staticStyle: {
                                            color: "#969799",
                                            "margin-left": "6px",
                                          },
                                        },
                                        [e._v("(" + e._s(t.userId) + ")")]
                                      ),
                                      i(
                                        "span",
                                        {
                                          staticStyle: {
                                            float: "right",
                                            "vertical-align": "top",
                                            color: "#969799",
                                            "line-height": "1.2",
                                          },
                                        },
                                        [e._v(e._s(t.createTime))]
                                      ),
                                    ]),
                                  ];
                                },
                                proxy: !0,
                              },
                              {
                                key: "label",
                                fn: function () {
                                  return [
                                    i(
                                      "div",
                                      { staticClass: "comment-detail" },
                                      [
                                        i("div", [
                                          i("span", {
                                            staticStyle: {
                                              "font-size": "14px",
                                              color: "#555555",
                                            },
                                            domProps: {
                                              innerHTML: e._s(t.content),
                                            },
                                          }),
                                        ]),
                                        i(
                                          "div",
                                          { staticClass: "reply-btns" },
                                          [
                                            i("span", {
                                              staticClass:
                                                "comment-icon icon-btn",
                                              on: {
                                                click: function (i) {
                                                  return e.doReply(t);
                                                },
                                              },
                                            }),
                                            i(
                                              "Badge",
                                              {
                                                attrs: {
                                                  content: t.likedCount,
                                                  max: "99",
                                                },
                                              },
                                              [
                                                t.likedStatus
                                                  ? i("span", {
                                                      staticClass:
                                                        "liked-icon icon-btn",
                                                      on: {
                                                        click: function (i) {
                                                          return e.doLike(t, o);
                                                        },
                                                      },
                                                    })
                                                  : i("span", {
                                                      staticClass:
                                                        "like-icon icon-btn",
                                                      on: {
                                                        click: function (i) {
                                                          return e.doLike(t, o);
                                                        },
                                                      },
                                                    }),
                                              ]
                                            ),
                                          ],
                                          1
                                        ),
                                        t.childComment &&
                                        t.childComment.length > 0
                                          ? i(
                                              "div",
                                              { staticClass: "reply-area" },
                                              e._l(
                                                t.childComment,
                                                function (t) {
                                                  return i("ReplyItem", {
                                                    key: t.replyId,
                                                    attrs: { "reply-item": t },
                                                    on: {
                                                      doReply: function (i) {
                                                        return e.doReply(t);
                                                      },
                                                    },
                                                  });
                                                }
                                              ),
                                              1
                                            )
                                          : e._e(),
                                      ]
                                    ),
                                  ];
                                },
                                proxy: !0,
                              },
                            ],
                            null,
                            !0
                          ),
                        });
                      }),
                      1
                    ),
                    i(
                      "span",
                      { staticClass: "add-btn", on: { click: e.doAddNew } },
                      [i("Icon", { attrs: { name: "plus", size: "24" } })],
                      1
                    ),
                    i(
                      "Popup",
                      {
                        staticStyle: { height: "90%", "padding-top": "4px" },
                        attrs: {
                          round: "",
                          position: "bottom",
                          "get-container": "#app",
                        },
                        model: {
                          value: e.showModal,
                          callback: function (t) {
                            e.showModal = t;
                          },
                          expression: "showModal",
                        },
                      },
                      [
                        i(
                          "div",
                          { staticClass: "popup-content" },
                          [
                            i("p", { staticClass: "popup-title" }, [
                              e._v(e._s(e.editForm.title)),
                            ]),
                            i(
                              "div",
                              { staticClass: "input-item" },
                              [
                                i("Field", {
                                  staticClass: "field-input",
                                  attrs: {
                                    rows: "3",
                                    autosize: "",
                                    type: "textarea",
                                    placeholder: "评价内容",
                                  },
                                  model: {
                                    value: e.editForm.content,
                                    callback: function (t) {
                                      e.$set(
                                        e.editForm,
                                        "content",
                                        "string" === typeof t ? t.trim() : t
                                      );
                                    },
                                    expression: "editForm.content",
                                  },
                                }),
                              ],
                              1
                            ),
                            i(
                              "Button",
                              {
                                staticStyle: { "margin-top": "20px" },
                                attrs: { round: "", block: "", type: "info" },
                                on: { click: e.submitComment },
                              },
                              [e._v("提交")]
                            ),
                            i(
                              "Button",
                              {
                                staticStyle: { "margin-top": "20px" },
                                attrs: { round: "", block: "" },
                                on: { click: e.cancelPopup },
                              },
                              [e._v("取消")]
                            ),
                          ],
                          1
                        ),
                      ]
                    ),
                  ],
                  1
                ),
              ]),
            ]
          );
        },
        Qt = [],
        jt = {
          name: "CourseQADetail",
          components: {
            List: He["a"],
            Cell: Ae["a"],
            Icon: Ie["a"],
            Popup: Ce["a"],
            Field: qe["a"],
            Button: je["a"],
            ReplyItem: Ze,
            Badge: Qe["a"],
          },
          props: {
            detailInfo: {
              type: Object,
              default: function () {
                return {
                  courseId: "",
                  categoryId: "",
                  topicId: "",
                  title: "",
                  content: "",
                  userName: "",
                  createTime: "",
                };
              },
            },
            showDetail: { type: Boolean, default: !1 },
          },
          data: function () {
            return {
              isLoadingMore: !1,
              isCommentEnd: !1,
              showModal: !1,
              commentList: [],
              pageIndex: 1,
              pageSize: 10,
              editType: "new",
              editForm: {
                title: "新增评论",
                courseOpenID: "",
                categoryId: "",
                topicId: "",
                replyId: "",
                parentId: "",
                content: "",
              },
            };
          },
          mounted: function () {
            this.getQAReplyList();
          },
          methods: {
            getQAReplyList: function () {
              var e = this,
                t = {
                  courseOpenID: this.detailInfo.courseId,
                  categoryId: this.detailInfo.categoryId,
                  topicId: this.detailInfo.topicId,
                };
              this.$API("getQAReplyList", t)
                .then(function (t) {
                  if ("0" === t.code) {
                    var i = t.data || {},
                      o = i.bbsReplyList || [];
                    e.commentList = e.parseDataList(o);
                  }
                })
                .finally(function () {
                  (e.isCommentEnd = !0), (e.isLoadingMore = !1);
                });
            },
            parseDataList: function (e) {
              var t = this;
              return e.map(function (e) {
                var i = [];
                return (
                  e.bbsReplySonList &&
                    e.bbsReplySonList.length > 0 &&
                    (i = t.parseDataList(e.bbsReplySonList) || []),
                  {
                    courseId: t.detailInfo.courseId,
                    topicId: e.topicId,
                    categoryId: e.categoryId,
                    replyId: e.replyId,
                    uid: e.replyId,
                    content: e.content,
                    userName: e.userName,
                    userId: e.userId,
                    createTime: e.dateCreated,
                    likedCount: Math.floor(e.praseCount || 0),
                    likedStatus: 1 === e.isprase || "1" === e.isprase ? 1 : 0,
                    childComment: i,
                  }
                );
              });
            },
            onLoadComment: function () {
              (this.isLoadingMore = !0),
                this.pageIndex++,
                this.getQAReplyList();
            },
            closeModel: function () {
              this.$emit("closeModel");
            },
            doAddNew: function () {
              (this.editType = "new"), (this.showModal = !0);
            },
            submitComment: function () {
              var e = this;
              if (!this.editForm.content)
                return F["a"].fail("评论内容不能为空"), !1;
              var t = {
                courseOpenID: this.detailInfo.courseId,
                categoryId: this.detailInfo.categoryId,
                topicId: this.detailInfo.topicId,
                content: this.editForm.content,
              };
              "reply" === this.editType &&
                (t.parentId = this.editForm.parentId),
                this.$API("addQAReply", t)
                  .then(function (t) {
                    "0" === t.code
                      ? (F["a"].success("评论成功"),
                        e.cancelPopup(),
                        (e.isLoadingMore = !1),
                        (e.isCommentEnd = !0),
                        (e.commentList = []),
                        e.getQAReplyList())
                      : F["a"].fail(t.message);
                  })
                  .catch(function (e) {
                    F["a"].fail(e.toString() || "unknown error");
                  });
            },
            cancelPopup: function () {
              for (var e in ((this.showModal = !1), this.editForm))
                this.editForm[e] = "";
              (this.editForm.title = "新增评论"), (this.editType = "");
            },
            doReply: function (e) {
              var t = e.replyId;
              (this.editForm.title = "回复: " + e.userName),
                (this.editForm.courseOpenID = e.courseId),
                (this.editForm.categoryId = e.categoryId),
                (this.editForm.topicId = e.topicId),
                (this.editForm.parentId = t),
                (this.editType = "reply"),
                (this.showModal = !0);
            },
            doLike: function (e, t) {
              var i = this,
                o = e.replyId;
              if (e.likedStatus) return F["a"].fail("您已经点赞了"), !1;
              this.$API("doLikeQA", { replyId: o })
                .then(function (o) {
                  "0" === o.code
                    ? (F["a"].success("点赞成功"),
                      (e.likedStatus = 1),
                      (e.likedCount += 1),
                      i.commentList.splice(t, 1, e))
                    : F["a"].fail(o.message || "点赞失败");
                })
                .catch(function (e) {
                  F["a"].fail(e.toString() || "unknown error");
                });
            },
          },
        },
        qt = jt,
        zt =
          (i("5af1"), Object(u["a"])(qt, Ut, Qt, !1, null, "2741170c", null)),
        Ht = zt.exports,
        Wt = {
          name: "CourseQA",
          components: {
            Tabs: m["a"],
            Tab: g["a"],
            List: He["a"],
            Cell: Ae["a"],
            Grid: Bt["a"],
            GridItem: Mt["a"],
            Skeleton: O["a"],
            Icon: Ie["a"],
            Popup: Ce["a"],
            Field: qe["a"],
            Button: je["a"],
            CourseQADetail: Ht,
            PageLayout: y["a"],
            CourseDetailBottomNav: P,
          },
          data: function () {
            return {
              courseId: "",
              courseName: "",
              activeTab: "all",
              initLoading: !0,
              isLoadingMore: !1,
              isEnd: !1,
              pageIndex: 1,
              pageSize: 10,
              dataList: [],
              showModal: !1,
              editForm: { categoryId: "", topicId: "", title: "", content: "" },
              QADetailModel: !1,
              QAInfo: {
                courseId: "",
                categoryId: "",
                topicId: "",
                title: "",
                content: "",
                userName: "",
                createTime: "",
              },
            };
          },
          watch: {
            activeTab: function () {
              this.resetDataList(), (this.isLoadingMore = !0), this.getData();
            },
          },
          created: function () {
            var e = this.$route.query || {};
            this.courseId = e.courseId || "";
          },
          mounted: function () {
            this.resetDataList(),
              this.getData(),
              this.courseId && this.getCourseName();
          },
          methods: {
            getCourseName: function () {
              var e = this;
              Object(v["b"])(this.courseId, function (t) {
                e.courseName = t.courseName;
              });
            },
            resetDataList: function () {
              (this.isLoadingMore = !1),
                (this.isEnd = !1),
                (this.pageIndex = 1),
                (this.pageSize = 10),
                (this.dataList = []);
            },
            getData: function () {
              var e = this;
              if (this.courseId) {
                var t = {
                  courseId: this.courseId,
                  categoryId: "bbskcwd-".concat(this.courseId),
                };
                "isEssence" === this.activeTab &&
                  (t.categoryType = "IsEssence"),
                  this.isLoadingMore || (this.initLoading = !0),
                  this.$API("getCourseQAList", t)
                    .then(function (t) {
                      if ("0" === t.code) {
                        var i = t.data || {},
                          o = i.topicList || [],
                          s = i.isEssenceList || [];
                        e.parseDataList(o, s);
                      }
                    })
                    .catch(function (e) {
                      F["a"].fail(e.toString() || "unknown error");
                    })
                    .finally(function () {
                      (e.isEnd = !0),
                        (e.initLoading = !1),
                        (e.isLoadingMore = !1);
                    });
              }
            },
            parseDataList: function (e, t) {
              var i = this,
                o = this.$getItem("userInfo"),
                s =
                  "isEssence" === this.activeTab
                    ? Object(_e["a"])(t)
                    : Object(_e["a"])(e);
              this.dataList = s.map(function (e) {
                return {
                  courseId: i.courseId,
                  categoryId: e.categoryId,
                  topicId: e.topicId,
                  title: e.title,
                  content: e.content,
                  viewCount: e.viewcount,
                  userId: e.userId,
                  userName: e.displayName,
                  commentCount: e.replyCount,
                  createTime: e.dateCreated,
                  _canEdit: e.userId.indexOf(o.userId) >= 0,
                };
              });
            },
            onLoad: function () {
              (this.isLoadingMore = !0), this.pageIndex++, this.getData();
            },
            doAddNew: function () {
              this.showModal = !0;
            },
            doSaveQA: function () {
              var e = this;
              if (!this.editForm.title) return F["a"].fail("请输入标题"), !1;
              if (!this.editForm.content) return F["a"].fail("请输入内容"), !1;
              var t = {
                courseOpenID: this.courseId,
                categoryId: "bbskcwd-".concat(this.courseId),
                topicTitle: this.editForm.title,
                topicContent: this.editForm.content,
              };
              this.editForm.topicId && (t.topicId = this.editForm.topicId),
                this.$API("addCourseQA", t)
                  .then(function (t) {
                    "0" === t.code
                      ? (F["a"].success("提交成功"),
                        e.cancelPopup(),
                        e.resetDataList(),
                        e.getData())
                      : F["a"].fail(t.message || "提交失败");
                  })
                  .catch(function (e) {
                    F["a"].fail(e.toString() || "unknown error");
                  });
            },
            cancelPopup: function () {
              for (var e in ((this.showModal = !1), this.editForm))
                this.editForm[e] = "";
            },
            showQADetail: function (e) {
              for (var t in this.QAInfo) this.QAInfo[t] = e[t] || "";
              this.QADetailModel = !0;
            },
            closeModel: function () {
              for (var e in ((this.QADetailModel = !1), this.QAInfo))
                this.QAInfo[e] = "";
            },
            doEdit: function (e) {
              for (var t in this.editForm) this.editForm[t] = e[t];
              this.showModal = !0;
            },
            doDelete: function (e) {
              var t = this,
                i = e.topicId;
              i
                ? N["a"]
                    .confirm({
                      title: "提示",
                      message: "删除后无法恢复，确定删除？",
                    })
                    .then(function () {
                      t.$API("deleteQA", { topicId: i })
                        .then(function (e) {
                          "0" === e.code
                            ? (F["a"].success("删除成功"),
                              t.resetDataList(),
                              t.getData())
                            : F["a"].fail(e.message || "删除失败");
                        })
                        .catch(function (e) {
                          F["a"].fail(e.toString() || "unknown error");
                        });
                    })
                    .catch(function () {})
                : F["a"].fail("删除失败:topicId");
            },
          },
        },
        Vt = Wt,
        Gt =
          (i("f650"), Object(u["a"])(Vt, Ft, Nt, !1, null, "59afc312", null)),
        Jt = Gt.exports,
        Kt = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "PageLayout",
            { attrs: { title: e.courseName } },
            [
              i(
                "Tabs",
                {
                  staticStyle: { "margin-top": "10px" },
                  attrs: { color: "#4f44d1" },
                  model: {
                    value: e.activeTab,
                    callback: function (t) {
                      e.activeTab = t;
                    },
                    expression: "activeTab",
                  },
                },
                [
                  i("Tab", { attrs: { title: "全部帖子", name: "all" } }),
                  i("Tab", { attrs: { title: "精华帖子", name: "isEssence" } }),
                ],
                1
              ),
              i("Skeleton", {
                staticClass: "skeleton-area",
                attrs: { row: 3, loading: e.initLoading },
              }),
              e.initLoading
                ? e._e()
                : i(
                    "List",
                    {
                      staticClass: "list-items",
                      attrs: {
                        finished: e.isEnd,
                        "immediate-check": !1,
                        "finished-text": "没有更多了",
                      },
                      on: { load: e.onLoad },
                      model: {
                        value: e.isLoadingMore,
                        callback: function (t) {
                          e.isLoadingMore = t;
                        },
                        expression: "isLoadingMore",
                      },
                    },
                    e._l(e.dataList, function (t) {
                      return i(
                        "div",
                        { key: t.uid, staticClass: "card-item" },
                        [
                          i("Cell", {
                            staticClass: "card-cell",
                            attrs: { border: !1 },
                            on: {
                              click: function (i) {
                                return e.showQADetail(t);
                              },
                            },
                            scopedSlots: e._u(
                              [
                                {
                                  key: "title",
                                  fn: function () {
                                    return [
                                      i("h3", { staticClass: "card-title" }, [
                                        e._v(e._s(t.postName)),
                                      ]),
                                    ];
                                  },
                                  proxy: !0,
                                },
                                {
                                  key: "label",
                                  fn: function () {
                                    return [
                                      i("p", { staticClass: "card-info" }, [
                                        e._v(e._s(t.createTime || "-")),
                                      ]),
                                      i("p", { staticClass: "card-info" }, [
                                        e._v(
                                          "浏览: " +
                                            e._s(t.viewCount || 0) +
                                            " "
                                        ),
                                        i("span", [
                                          e._v(
                                            "回复: " + e._s(t.commentCount || 0)
                                          ),
                                        ]),
                                      ]),
                                    ];
                                  },
                                  proxy: !0,
                                },
                              ],
                              null,
                              !0
                            ),
                          }),
                          t._canEdit
                            ? i(
                                "Grid",
                                { attrs: { clickable: "", "column-num": 2 } },
                                [
                                  i("GridItem", {
                                    staticClass: "grid-item",
                                    attrs: { text: "编辑" },
                                    on: {
                                      click: function (i) {
                                        return e.doEdit(t);
                                      },
                                    },
                                  }),
                                  i("GridItem", {
                                    staticClass: "grid-item",
                                    attrs: { text: "删除" },
                                    on: {
                                      click: function (i) {
                                        return e.doDelete(t);
                                      },
                                    },
                                  }),
                                ],
                                1
                              )
                            : e._e(),
                        ],
                        1
                      );
                    }),
                    0
                  ),
              e.courseId
                ? i(
                    "span",
                    { staticClass: "add-btn", on: { click: e.doAddNew } },
                    [i("Icon", { attrs: { name: "plus" } })],
                    1
                  )
                : e._e(),
              i(
                "Popup",
                {
                  staticStyle: { height: "90%", "padding-top": "4px" },
                  attrs: {
                    round: "",
                    position: "bottom",
                    "get-container": "#app",
                  },
                  model: {
                    value: e.showModal,
                    callback: function (t) {
                      e.showModal = t;
                    },
                    expression: "showModal",
                  },
                },
                [
                  i(
                    "div",
                    { staticClass: "popup-content" },
                    [
                      i("Field", {
                        attrs: { label: "标题", placeholder: "请输入标题" },
                        model: {
                          value: e.editForm.postName,
                          callback: function (t) {
                            e.$set(
                              e.editForm,
                              "postName",
                              "string" === typeof t ? t.trim() : t
                            );
                          },
                          expression: "editForm.postName",
                        },
                      }),
                      i("Field", {
                        attrs: {
                          label: "内容",
                          rows: "3",
                          autosize: "",
                          type: "textarea",
                          placeholder: "请输入内容",
                        },
                        model: {
                          value: e.editForm.postContent,
                          callback: function (t) {
                            e.$set(
                              e.editForm,
                              "postContent",
                              "string" === typeof t ? t.trim() : t
                            );
                          },
                          expression: "editForm.postContent",
                        },
                      }),
                      i(
                        "Button",
                        {
                          staticStyle: { "margin-top": "20px" },
                          attrs: { round: "", block: "", type: "info" },
                          on: { click: e.doSaveQA },
                        },
                        [e._v("提交")]
                      ),
                      i(
                        "Button",
                        {
                          staticStyle: { "margin-top": "20px" },
                          attrs: { round: "", block: "" },
                          on: { click: e.cancelPopup },
                        },
                        [e._v("取消")]
                      ),
                    ],
                    1
                  ),
                ]
              ),
              e.QADetailModel
                ? i("CourseQADetailMixin", {
                    attrs: {
                      "show-detail": e.QADetailModel,
                      "detail-info": e.QAInfo,
                    },
                    on: { closeModel: e.closeModel },
                  })
                : e._e(),
              i("CourseDetailBottomNav", {
                attrs: { slot: "bottom" },
                slot: "bottom",
              }),
            ],
            1
          );
        },
        Zt = [],
        Yt = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "Popup",
            {
              staticStyle: { height: "100%" },
              attrs: { position: "bottom", "get-container": "#app" },
              model: {
                value: e.showDetail,
                callback: function (t) {
                  e.showDetail = t;
                },
                expression: "showDetail",
              },
            },
            [
              i("div", { staticClass: "top-nav" }, [
                i(
                  "span",
                  { staticClass: "back-icon", on: { click: e.closeModel } },
                  [i("Icon", { attrs: { name: "arrow-left", size: "24" } })],
                  1
                ),
                i("span", [e._v("帖子详情")]),
              ]),
              i("div", [
                i("div", { staticClass: "post-title" }, [
                  e._v(e._s(e.detailInfo.postName)),
                ]),
                i("div", {
                  staticClass: "post-content",
                  domProps: { innerHTML: e._s(e.detailInfo.postContent) },
                }),
                i("div", { staticClass: "post-user" }, [
                  e._v(" " + e._s(e.detailInfo.userName)),
                  i("br"),
                  i("span", { staticClass: "post-time" }, [
                    e._v(e._s(e.detailInfo.createTime)),
                  ]),
                ]),
                i(
                  "div",
                  { staticClass: "comment-area" },
                  [
                    i(
                      "List",
                      {
                        attrs: {
                          finished: e.isCommentEnd,
                          "immediate-check": !1,
                          "finished-text": "没有更多评论",
                        },
                        on: { load: e.onLoadComment },
                        model: {
                          value: e.isLoadingMore,
                          callback: function (t) {
                            e.isLoadingMore = t;
                          },
                          expression: "isLoadingMore",
                        },
                      },
                      e._l(e.commentList, function (t, o) {
                        return i("Cell", {
                          key: t.uid,
                          staticClass: "card-cell",
                          scopedSlots: e._u(
                            [
                              {
                                key: "title",
                                fn: function () {
                                  return [
                                    i("div", { staticClass: "card-title" }, [
                                      i(
                                        "span",
                                        {
                                          staticStyle: {
                                            display: "inline-block",
                                            "line-height": "1.2",
                                            "font-weight": "bolder",
                                            color: "#1E1D1D",
                                          },
                                        },
                                        [e._v(" " + e._s(t.userName) + " ")]
                                      ),
                                      i(
                                        "span",
                                        {
                                          staticStyle: {
                                            color: "#969799",
                                            "margin-left": "6px",
                                          },
                                        },
                                        [e._v("(" + e._s(t.userId) + ")")]
                                      ),
                                      i(
                                        "span",
                                        {
                                          staticStyle: {
                                            float: "right",
                                            "vertical-align": "top",
                                            color: "#969799",
                                            "line-height": "1.2",
                                          },
                                        },
                                        [e._v(e._s(t.createTime))]
                                      ),
                                    ]),
                                  ];
                                },
                                proxy: !0,
                              },
                              {
                                key: "label",
                                fn: function () {
                                  return [
                                    i(
                                      "div",
                                      { staticClass: "comment-detail" },
                                      [
                                        i("div", [
                                          i("span", {
                                            staticStyle: {
                                              "font-size": "14px",
                                              color: "#555555",
                                            },
                                            domProps: {
                                              innerHTML: e._s(t.postName),
                                            },
                                          }),
                                        ]),
                                        i(
                                          "div",
                                          { staticClass: "reply-btns" },
                                          [
                                            i("span", {
                                              staticClass:
                                                "comment-icon icon-btn",
                                              on: {
                                                click: function (i) {
                                                  return e.doReply(t);
                                                },
                                              },
                                            }),
                                            i(
                                              "Badge",
                                              {
                                                attrs: {
                                                  content: t.likedCount,
                                                  max: "99",
                                                },
                                              },
                                              [
                                                t.likedStatus
                                                  ? i("span", {
                                                      staticClass:
                                                        "liked-icon icon-btn",
                                                      on: {
                                                        click: function (i) {
                                                          return e.doLike(t, o);
                                                        },
                                                      },
                                                    })
                                                  : i("span", {
                                                      staticClass:
                                                        "like-icon icon-btn",
                                                      on: {
                                                        click: function (i) {
                                                          return e.doLike(t, o);
                                                        },
                                                      },
                                                    }),
                                              ]
                                            ),
                                          ],
                                          1
                                        ),
                                        t.childComment &&
                                        t.childComment.length > 0
                                          ? i(
                                              "div",
                                              { staticClass: "reply-area" },
                                              e._l(
                                                t.childComment,
                                                function (t) {
                                                  return i("ReplyItem", {
                                                    key: t.uid,
                                                    attrs: {
                                                      "show-reply": !0,
                                                      "reply-item": t,
                                                    },
                                                    on: {
                                                      doReply: function (i) {
                                                        return e.doReply(t);
                                                      },
                                                    },
                                                  });
                                                }
                                              ),
                                              1
                                            )
                                          : e._e(),
                                      ]
                                    ),
                                  ];
                                },
                                proxy: !0,
                              },
                            ],
                            null,
                            !0
                          ),
                        });
                      }),
                      1
                    ),
                    i(
                      "span",
                      { staticClass: "add-btn", on: { click: e.doAddNew } },
                      [i("Icon", { attrs: { name: "plus", size: "24" } })],
                      1
                    ),
                    i(
                      "Popup",
                      {
                        staticStyle: { height: "90%", "padding-top": "4px" },
                        attrs: {
                          round: "",
                          position: "bottom",
                          "get-container": "#app",
                        },
                        model: {
                          value: e.showModal,
                          callback: function (t) {
                            e.showModal = t;
                          },
                          expression: "showModal",
                        },
                      },
                      [
                        i(
                          "div",
                          { staticClass: "popup-content" },
                          [
                            i("p", { staticClass: "popup-title" }, [
                              e._v(e._s(e.editForm.title)),
                            ]),
                            i(
                              "div",
                              { staticClass: "input-item" },
                              [
                                i("Field", {
                                  staticClass: "field-input",
                                  attrs: {
                                    rows: "3",
                                    autosize: "",
                                    type: "textarea",
                                    placeholder: "评价内容",
                                  },
                                  model: {
                                    value: e.editForm.postName,
                                    callback: function (t) {
                                      e.$set(
                                        e.editForm,
                                        "postName",
                                        "string" === typeof t ? t.trim() : t
                                      );
                                    },
                                    expression: "editForm.postName",
                                  },
                                }),
                              ],
                              1
                            ),
                            i(
                              "Button",
                              {
                                staticStyle: { "margin-top": "20px" },
                                attrs: { round: "", block: "", type: "info" },
                                on: { click: e.submitComment },
                              },
                              [e._v("提交")]
                            ),
                            i(
                              "Button",
                              {
                                staticStyle: { "margin-top": "20px" },
                                attrs: { round: "", block: "" },
                                on: { click: e.cancelPopup },
                              },
                              [e._v("取消")]
                            ),
                          ],
                          1
                        ),
                      ]
                    ),
                  ],
                  1
                ),
              ]),
            ]
          );
        },
        _t = [],
        Xt = {
          name: "CourseQADetailMixin",
          components: {
            List: He["a"],
            Cell: Ae["a"],
            Icon: Ie["a"],
            Popup: Ce["a"],
            Field: qe["a"],
            Button: je["a"],
            ReplyItem: Ze,
            Badge: Qe["a"],
          },
          props: {
            detailInfo: {
              type: Object,
              default: function () {
                return {
                  courseId: "",
                  uid: "",
                  postName: "",
                  postContent: "",
                  userName: "",
                  createTime: "",
                };
              },
            },
            showDetail: { type: Boolean, default: !1 },
          },
          data: function () {
            return {
              isLoadingMore: !1,
              isCommentEnd: !1,
              showModal: !1,
              commentList: [],
              pageIndex: 1,
              pageSize: 10,
              editType: "new",
              editForm: { postName: "", puid: "", title: "新增评论" },
            };
          },
          mounted: function () {
            this.getQAReplyList();
          },
          methods: {
            getQAReplyList: function () {
              var e = this,
                t = {
                  courseId: this.detailInfo.courseId,
                  postId: this.detailInfo.uid,
                  plateTag: 2,
                  offset: this.pageIndex,
                  limit: this.pageSize,
                };
              this.$API("getPostCommentInfoList", t)
                .then(function (t) {
                  if ("0" === t.code) {
                    var i = (t.data || []).map(function (t) {
                      var i = (t.createUser || "").replace("310_", ""),
                        o = (t.userName || "").replace(/\(.*\)/, "");
                      return {
                        uid: t.uid,
                        userName: o,
                        userId: i,
                        createTime: t.createTime,
                        postName: t.postName,
                        likedCount: t.likedCount,
                        likedStatus: t.likedStatus,
                        childComment: e.translateComment(t.childComment || []),
                      };
                    });
                    e.commentList = [].concat(
                      Object(_e["a"])(e.commentList),
                      Object(_e["a"])(i)
                    );
                    var o = t.total || e.commentList.length;
                    o <= e.pageSize * e.pageIndex && (e.isCommentEnd = !0);
                  }
                })
                .finally(function () {
                  e.isLoadingMore = !1;
                });
            },
            translateComment: function (e) {
              var t = this;
              return e.map(function (e) {
                var i = (e.createUser || "").replace("310_", ""),
                  o = (e.userName || "").replace(/\(.*\)/, "");
                return {
                  uid: e.uid,
                  userName: o,
                  userId: i,
                  createTime: e.createTime,
                  content: e.postName,
                  likedCount: e.likedCount,
                  likedStatus: e.likedStatus,
                  childComment: t.translateComment(e.childComment || []),
                };
              });
            },
            onLoadComment: function () {
              (this.isLoadingMore = !0),
                this.pageIndex++,
                this.getQAReplyList();
            },
            closeModel: function () {
              this.$emit("closeModel");
            },
            doAddNew: function () {
              (this.editType = "new"), (this.showModal = !0);
            },
            submitComment: function () {
              var e = this;
              if (!this.editForm.postName)
                return F["a"].fail("评论内容不能为空"), !1;
              var t = { courseId: this.detailInfo.courseId, plateTag: "2" };
              "reply" === this.editType
                ? ((t.puid = this.editForm.puid),
                  (t.postName = ""
                    .concat(this.editForm.title, " ")
                    .concat(this.editForm.postName)))
                : ((t.puid = this.detailInfo.uid),
                  (t.postName = this.editForm.postName)),
                this.$API("addPosts", t)
                  .then(function (t) {
                    "0" === t.code
                      ? (F["a"].success("评论成功"),
                        e.cancelPopup(),
                        (e.isLoadingMore = !1),
                        (e.isCommentEnd = !1),
                        (e.commentList = []),
                        (e.pageIndex = 1),
                        (e.pageSize = 10),
                        e.getQAReplyList())
                      : F["a"].fail(t.message);
                  })
                  .catch(function (e) {
                    F["a"].fail(e.toString() || "unknown error");
                  });
            },
            cancelPopup: function () {
              (this.showModal = !1),
                (this.editForm = { postName: "", puid: "", title: "新增评论" }),
                (this.editType = "");
            },
            doReply: function (e) {
              var t = e.uid;
              (this.editForm.puid = t),
                (this.editForm.title = "回复: " + e.userName),
                (this.editType = "reply"),
                (this.showModal = !0);
            },
            doLike: function (e, t) {
              var i = this,
                o = e.uid;
              if (e.likedStatus) return F["a"].fail("您已经点赞了"), !1;
              this.$API("addBBsLike", { commentId: o })
                .then(function (o) {
                  "0" === o.code
                    ? (F["a"].success("点赞成功"),
                      (e.likedStatus = 1),
                      (e.likedCount += 1),
                      i.commentList.splice(t, 1, e))
                    : F["a"].fail(o.message || "点赞失败");
                })
                .catch(function (e) {
                  F["a"].fail(e.toString() || "unknown error");
                });
            },
          },
        },
        $t = Xt,
        ei =
          (i("8b3e"), Object(u["a"])($t, Yt, _t, !1, null, "48ad26d2", null)),
        ti = ei.exports,
        ii = {
          name: "CourseQAMixin",
          components: {
            Tabs: m["a"],
            Tab: g["a"],
            List: He["a"],
            Cell: Ae["a"],
            Grid: Bt["a"],
            GridItem: Mt["a"],
            Skeleton: O["a"],
            Icon: Ie["a"],
            Popup: Ce["a"],
            Field: qe["a"],
            Button: je["a"],
            CourseQADetailMixin: ti,
            PageLayout: y["a"],
            CourseDetailBottomNav: P,
          },
          data: function () {
            return {
              courseId: "",
              courseName: "",
              activeTab: "all",
              initLoading: !0,
              isLoadingMore: !1,
              isEnd: !1,
              pageIndex: 1,
              pageSize: 10,
              dataList: [],
              showModal: !1,
              editForm: { uid: "", postName: "", postContent: "" },
              QADetailModel: !1,
              QAInfo: {
                courseId: "",
                uid: "",
                postName: "",
                postContent: "",
                userName: "",
                createTime: "",
              },
            };
          },
          watch: {
            activeTab: function () {
              this.resetDataList(), (this.isLoadingMore = !0), this.getData();
            },
          },
          created: function () {
            var e = this.$route.query || {};
            this.courseId = e.courseId || "";
          },
          mounted: function () {
            this.resetDataList(),
              this.getData(),
              this.courseId && this.getCourseName();
          },
          methods: {
            getCourseName: function () {
              var e = this;
              Object(v["b"])(this.courseId, function (t) {
                e.courseName = t.courseName;
              });
            },
            resetDataList: function () {
              (this.isLoadingMore = !1),
                (this.isEnd = !1),
                (this.pageIndex = 1),
                (this.pageSize = 10),
                (this.dataList = []);
            },
            getData: function () {
              var e = this;
              if (this.courseId) {
                var t = {
                  limit: this.pageSize,
                  offset: this.pageIndex,
                  courseId: this.courseId,
                  plateTag: "2",
                };
                "isEssence" === this.activeTab && (t.postType = "isEssence"),
                  this.isLoadingMore || (this.initLoading = !0),
                  this.$API("getCourseQAList", t)
                    .then(function (t) {
                      if ("0" === t.code) {
                        var i = (t.data || []).map(function (t) {
                          var i = t.createUser || "",
                            o = (e.$getItem("userInfo") || {}).userId;
                          return (
                            i && i.indexOf(o) >= 0
                              ? (t._canEdit = !0)
                              : (t._canEdit = !1),
                            Object(Ye["a"])({}, t)
                          );
                        });
                        e.dataList = [].concat(
                          Object(_e["a"])(e.dataList),
                          Object(_e["a"])(i)
                        );
                        var o = t.total || e.dataList.length;
                        o <= e.pageSize * e.pageIndex && (e.isEnd = !0);
                      } else F["a"].fail(t.message);
                    })
                    .catch(function (e) {
                      F["a"].fail(e.toString() || "unknown error");
                    })
                    .finally(function () {
                      (e.initLoading = !1), (e.isLoadingMore = !1);
                    });
              }
            },
            onLoad: function () {
              (this.isLoadingMore = !0), this.pageIndex++, this.getData();
            },
            doAddNew: function () {
              this.showModal = !0;
            },
            doSaveQA: function () {
              var e = this;
              if (!this.editForm.postName) return F["a"].fail("请输入标题"), !1;
              if (!this.editForm.postContent)
                return F["a"].fail("请输入内容"), !1;
              var t = Object(Ye["a"])({}, this.editForm),
                i = t.uid ? "updatePosts" : "addPosts";
              !t.uid && delete t.uid,
                (t.courseId = this.courseId),
                (t.plateTag = "2"),
                (t.puid = -1),
                this.$API(i, t)
                  .then(function (t) {
                    "0" === t.code
                      ? (F["a"].success("提交成功"),
                        e.cancelPopup(),
                        e.resetDataList(),
                        e.getData())
                      : F["a"].fail(t.message || "提交失败");
                  })
                  .catch(function (e) {
                    F["a"].fail(e.toString() || "unknown error");
                  });
            },
            cancelPopup: function () {
              for (var e in ((this.showModal = !1), this.editForm))
                this.editForm[e] = "";
            },
            showQADetail: function (e) {
              for (var t in this.QAInfo) this.QAInfo[t] = e[t] || "";
              this.QADetailModel = !0;
            },
            closeModel: function () {
              for (var e in ((this.QADetailModel = !1), this.QAInfo))
                this.QAInfo[e] = "";
            },
            doEdit: function (e) {
              for (var t in this.editForm) this.editForm[t] = e[t];
              this.showModal = !0;
            },
            doDelete: function (e) {
              var t = this,
                i = e.uid;
              i
                ? N["a"]
                    .confirm({
                      title: "提示",
                      message: "删除后无法恢复，确定删除？",
                    })
                    .then(function () {
                      t.$API("deletePosts", { uid: i })
                        .then(function (e) {
                          "0" === e.code
                            ? (F["a"].success("删除成功"),
                              t.resetDataList(),
                              t.getData())
                            : F["a"].fail(e.message || "删除失败");
                        })
                        .catch(function (e) {
                          F["a"].fail(e.toString() || "unknown error");
                        });
                    })
                    .catch(function () {})
                : F["a"].fail("删除失败:uid");
            },
          },
        },
        oi = ii,
        si =
          (i("7429"), Object(u["a"])(oi, Kt, Zt, !1, null, "3d9f90a1", null)),
        ai = si.exports,
        ni = "dotNet_api" === a["a"].apiPrefix ? Jt : ai,
        ri = [
          { path: "/index.html", component: ge, name: "courseCatalog" },
          { path: "/resources.html", component: Oe, name: "courseResource" },
          {
            path: "/resource_detail.html",
            component: wt,
            name: "resourceDetail",
          },
          { path: "/course_info.html", component: Rt, name: "courseInfo" },
          { path: "/course_qa.html", component: ni, name: "courseQA" },
        ],
        ci = new s["a"]({
          mode: "history",
          base: "/course_detail",
          routes: ri,
          scrollBehavior: function (e, t, i) {
            return i || { x: 0, y: 0 };
          },
        });
      Object(o["a"])(p, ci);
    },
    "98a0": function (e, t, i) {},
    a1df: function (e, t) {
      e.exports =
        "data:image/png;base64,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";
    },
    a430: function (e, t, i) {
      "use strict";
      i("89d4");
    },
    aa6a: function (e, t, i) {
      "use strict";
      i.d(t, "d", function () {
        return r;
      }),
        i.d(t, "c", function () {
          return c;
        }),
        i.d(t, "a", function () {
          return l;
        }),
        i.d(t, "b", function () {
          return u;
        }),
        i.d(t, "e", function () {
          return d;
        });
      var o = i("b85c"),
        s =
          (i("ac1f"),
          i("5319"),
          i("841c"),
          i("1276"),
          i("d3b7"),
          i("3ca3"),
          i("ddb0"),
          i("2b3d"),
          i("9861"),
          i("25f0"),
          i("b0c0"),
          i("5cc6"),
          i("9a8c"),
          i("a975"),
          i("735e"),
          i("c1ac"),
          i("d139"),
          i("3a7b"),
          i("d5d6"),
          i("82f8"),
          i("e91f"),
          i("60bd"),
          i("5f96"),
          i("3280"),
          i("3fcc"),
          i("ca91"),
          i("25a1"),
          i("cd26"),
          i("3c5d"),
          i("2954"),
          i("649e"),
          i("219c"),
          i("170b"),
          i("b39a"),
          i("72f7"),
          i("a630"),
          i("bc3a")),
        a = i.n(s),
        n = i("365c");
      function r() {
        var e,
          t = {},
          i = decodeURIComponent(window.location.search.replace(/^\?/g, "")),
          s = i.split("&"),
          a = Object(o["a"])(s);
        try {
          for (a.s(); !(e = a.n()).done; ) {
            var n = e.value;
            if (n.indexOf("=") > 1) {
              var r = n.split("=");
              2 === r.length &&
                "" !== r[0] &&
                null !== r[0] &&
                void 0 !== r[0] &&
                (t[r[0]] = r[1] || "");
            }
          }
        } catch (c) {
          a.e(c);
        } finally {
          a.f();
        }
        return t;
      }
      var c = function () {
          var e = navigator.userAgent || navigator.vendor || window.opera;
          return /android/i.test(e)
            ? "Android"
            : /iPad|iPhone|iPod/.test(e) && !window.MSStream
            ? "IOS"
            : "Android";
        },
        l = function (e, t, i, o) {
          a()("".concat(e), { headers: i || {}, responseType: "blob" })
            .then(function (e) {
              if (200 === e.status) {
                var i = new Blob([e.data]),
                  s = "";
                !s &&
                  e.headers["content-disposition"] &&
                  ((s = e.headers["content-disposition"]
                    .split(";")[1]
                    .split("=")[1]),
                  (s = decodeURIComponent(s)));
                var a = document.createElement("a");
                (a.style.display = "none"),
                  (a.href = URL.createObjectURL(i)),
                  a.setAttribute("download", s || "附件.".concat(t)),
                  document.body.appendChild(a),
                  a.click(),
                  setTimeout(function () {
                    document.body.removeChild(a);
                  }, 100),
                  o();
              } else o("下载文件失败");
            })
            .catch(function (e) {
              o(e.toString() || "下载文件失败");
            });
        },
        u = function (e, t, i, o) {
          a()("".concat(e), { headers: i || {}, responseType: "blob" })
            .then(function (e) {
              if (200 === e.status) {
                var i = new Blob([e.data]),
                  s = t;
                !s &&
                  e.headers["content-disposition"] &&
                  ((s = e.headers["content-disposition"]
                    .split(";")[1]
                    .split("=")[1]),
                  (s = decodeURIComponent(s)));
                var a = document.createElement("a");
                (a.style.display = "none"),
                  (a.href = URL.createObjectURL(i)),
                  a.setAttribute("download", s || "附件.${fileSuffix"),
                  document.body.appendChild(a),
                  a.click(),
                  setTimeout(function () {
                    document.body.removeChild(a);
                  }, 100),
                  o();
              } else o("下载文件失败");
            })
            .catch(function (e) {
              o(e.toString() || "下载文件失败");
            });
        },
        d = function (e, t) {
          var i = e.name,
            o = new FileReader();
          (o.onload = function (e) {
            var o = e.target.result,
              s = new Uint8Array(o);
            Object(n["a"])("uploadFile", {
              fileName: i,
              _dataArr: Array.from(s),
            }).then(function (e) {
              if ("0" === e.code) {
                var i = e.data.url;
                t(null, i);
              } else t(e.message || "上传失败");
            });
          }),
            o.readAsArrayBuffer(e);
        };
    },
    b505: function (e, t, i) {
      "use strict";
      i("1501");
    },
    ba53: function (e, t, i) {
      "use strict";
      i("ea61");
    },
    bcf8: function (e, t, i) {
      "use strict";
      i("6a24");
    },
    c0f0: function (e, t, i) {},
    c5e9: function (e, t, i) {},
    c8b7: function (e, t) {
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAqEAIAAADc9Bb2AAABaWlDQ1BEaXNwbGF5IFAzAAAokXWQvUvDUBTFT6tS0DqIDh0cMolD1NIKdnFoKxRFMFQFq1P6+iU0MSQpUnETVyn4H1jBWXCwiFRwcXAQRAcR3Zw6Kbhoed6XVNoi3sfl/Ticc7lcwBsoMs3qBaDptplMxKS11Lrke4OHnlMqs4yooiwK/v276/PR9d5PiFmNZvUgsp+41s4ul3aeAlN//V3Vn8lajP5v6iAzTBvwyMTKtm0I3iUeMWkp4orgvMvHgtMunzuelWSc+JZYYgU1Q9wgltMder6DtWKJtXYQ2/uz+uqymEM9ijlswoKBIlSUIUFB+B//tOOPY4vcZZiUy6MAmzJRUsSELPE8dDBMQiYOIUgdEndu3e+hdT+5re29ArN1zvlFW1uoA6czdLJaWxuPAEMDwE3NUE3VkXqovbkc8H4CDKaA4TvKbFi5cMjd3h8D+l44/xgDfIdAs8L51xHnzSqFn4Er/Qce3WrASs9Z0QAAAAlwSFlzAAALEwAACxMBAJqcGAAABjtJREFUaIHtm3lsFFUcxz+zu72AcrhYQuk25Qq9kIZSDpE7QLlvooCKgAYBDRJQAygRQdEKRBIhHmBAKEdo5IgIjQcghcqRWqAcgiAt0HL0gNJju7vz/GO661C6TCHQXdj5/DGZvOP7fvO+M53p7+2ThBBCCFuJ4wdIjcjcC6eWX54IFVn2HLAkmQOgW0pUODQfFpKAziNGqsi3rxZikUgZC3lzi5LdN511a3AptNkUOvNBBtg369Q6uPpt4RsgO+TNQIaUBAgEYEQCHAhAQnJ1c1erlGtck6qlN+iXYwdhEGMh8Be/SIjOD7sD0QvDxoK0LfJwmhC7umecdHU2YABk5LvHDT4UtBg+2zQ+DYzRhjCtOFea9+yGzNGXsjUvySeZ+l1fMxiOp2Yfd5UpU6/4ppwH4Oc8L+5SNg8uZF3voiV9/vu836tMvaKmHP0wVqdfWX7/WrWOu6M366vYGpTuDyb7BEceEEkozrtefedbqz4HJQnlx7QMKDpf0h2Ac64i9fPkTr/KSJq17nhC9EvaWNPA8Gyd+v6uMsUlxTflvC4Bd3eL+DUkSivCNqtC94A0Q7qt1dKXaV/UfCCYho1LyIUTB7IbAzYcAJVHVCVAYkycBRpOrpOvJR1cEDQQ5pwcegY2RP4RCvmxd2aDlM4iwIgR5zOh2KyMojyqCu5q73kzVYO6pffo51MMfMUeiLWG22D8om5mkJTP0DNjruTAxmlptyBvU9FB11gnpE6Q2DSuEQxLSQjXDM4NZe9XJINklTZw99eC73CVAhAfiM0QFONvcRZXGqBu+c9b1waAI1cuBHNFvWQw7whuUfsR+wbVGKBTmxi0m+g8TnQDPIxugIfRDfAwugEeRjfAw1RjQHma7WMobl92tPbD8T0q/w/In1JcANutR4fDCVu2A2x+9hRotvOZY9CnqO0g6EgrT0f7FCKVLrXuFGJeysZwKIm1prtvOmlQ7yXQaWirCzWTLt5SHgbbhx9Jgtz4wmMgdxBHQUplPs7soAkDzmyJUZWiUJY4lFyKHRnns1qTnKW6pTfol1MBIoypENDR9BfEbLe8C33znvsGpPWT998UYr/xdIqrs9JNLWHFBsYvDK/AssRX20Fgmt9Z9xE6JsurYGHpVivk1S+qU4OL8kFG9em8EAx/Z+QmValR/FTyeVZszmLHbHkdXAi6Nl5L+vSUKwX61GuReiCzLRikrlLmg3SzZzo6abWR/xSLHz4wX0FsF83BED6icdUJvXdRTUVEi5AZWtKRK0IngTkneNUji/YppPe52BUgFba8s0+Ij0xbX4LSHtYF7juM6/VCLPR4Mfr5mg1Q3KMsC7b8fKgV3IwqbgaSlY04X1be85KsFX2RSyEwj40Qty5iH/TPaZfv+gwt3FUyF7akHVwIWa9f/hrkD+XRYG4YvAuGSPFjocOXLevWIDydB6Ka9YDSQOs2cMTIFgg+FhTvqdB8A31BxsPouSAPoxvgYXQDPIxugIfRDfAwugEephoDbk8r6wcFyXcOgG2tY3rtB+VLOH+aGHnlIPz49pEBkNPo5k/g2CufguDYoHToviGqKQxN7/DQKTbrYrsR5AQ5A6Td0txHeQlejw0HCIt4E/zrmwLBONXQz1kpXR9za6kQ8xttqqelM3hkfDYM6R+/qGbjXlxyfRts7nowEq6tuTUV5OWiLkgrmYL3/Xj28emXYQMxiE/BP9zUGKKSmgXAxN4924K0ypRqFCJj0sWV3J0HVST8MQElWJ3Kn3ee0BoavFanl/sIS8dYc+C9+RscULHSnqp5ST5Jj8ToODBcHVOQ4ypTnFQWYZRz1dQrXEq+EaolfSbvaj996rU4HH6+MRj8/jX1dJXdfwsOAH7TTau1pOuVBVax7YnZQlQ7+gAEFvgPBENsjOUd1zQpf3aUXLZyrlqeDEj3+wRaVDS5z05KhdZrmzaB6Jth/++QcW5+qqJZ+bSpy+9fq9Zxd/R+fQBGZnVcBlLFPPsIIZJm7BgAlxbcqD4vmkgczNo5+Ci0WRM6TcsANamtMvfD9dW3fwMpRErFeRd4zzbS2tG/Qj4wXayGdvaIURB73pJXJR29dU76ejjZP+cs2CMdMyGkb4N2MOLljt3BMtesee/rPCj/AWDOO3/L3+qLAAAAAElFTkSuQmCC";
    },
    cdbb: function (e, t, i) {},
    d23f: function (e, t, i) {
      "use strict";
      var o = function () {
          var e = this,
            t = e.$createElement,
            i = e._self._c || t;
          return i(
            "span",
            [
              i("span", {
                domProps: { innerHTML: e._s(e.titleTxt) },
                on: { click: e.clickTitle },
              }),
              i(
                "Popup",
                {
                  style: { height: "80%" },
                  attrs: {
                    round: "",
                    position: "bottom",
                    closeable: "",
                    "get-container": "body",
                  },
                  on: { closed: e.closePreview },
                  model: {
                    value: e.showPreview,
                    callback: function (t) {
                      e.showPreview = t;
                    },
                    expression: "showPreview",
                  },
                },
                [
                  i("div", { staticClass: "preview-area" }, [
                    "video" === e.fileType
                      ? i(
                          "div",
                          { staticClass: "player-wrapper" },
                          [i("VideoPlayer", { attrs: { source: e.viewPath } })],
                          1
                        )
                      : "audio" === e.fileType
                      ? i(
                          "div",
                          [
                            i("AudioPlayer", {
                              attrs: {
                                source: e.viewPath,
                                "audio-title": "音频文件",
                              },
                            }),
                          ],
                          1
                        )
                      : "img" === e.fileType
                      ? i("div", { staticClass: "img-wrapper" }, [
                          i("img", {
                            attrs: { src: e.viewPath },
                            on: { click: e.showImg },
                          }),
                        ])
                      : "word" === e.fileType ||
                        "ppt" === e.fileType ||
                        "excel" === e.fileType ||
                        "pdf" === e.fileType
                      ? i("div", [
                          i("iframe", {
                            staticStyle: { width: "100%", height: "60vh" },
                            attrs: { src: e.viewPath, frameborder: "0" },
                          }),
                        ])
                      : i(
                          "div",
                          [
                            i("Empty", {
                              attrs: {
                                description: "不支持该资源预览, 请至PC端学习",
                              },
                            }),
                          ],
                          1
                        ),
                  ]),
                ]
              ),
            ],
            1
          );
        },
        s = [],
        a = i("b85c"),
        n = (i("91d5"), i("f0ca")),
        r = (i("8a58"), i("e41f")),
        c = (i("159b"), i("99af"), i("ac1f"), i("1276"), i("5319"), i("4c0f")),
        l = i("2613"),
        u = {
          name: "QuestionTitle",
          components: {
            VideoPlayer: c["a"],
            AudioPlayer: l["a"],
            Popup: r["a"],
            Empty: n["a"],
          },
          props: {
            title: { type: String, default: "" },
            previewUrl: { type: String, default: "" },
            downloadUrl: { type: String, default: "" },
          },
          data: function () {
            return {
              titleTxt: "",
              fileUrl: "",
              fileType: "",
              withPreviewFile: !1,
              showPreview: !1,
              viewPath: "",
            };
          },
          watch: {
            title: function () {
              this.initTitle();
            },
          },
          mounted: function () {
            this.initTitle();
          },
          methods: {
            initTitle: function () {
              (this.titleTxt = ""),
                (this.fileUrl = ""),
                (this.fileType = ""),
                (this.withPreviewFile = !1),
                (this.showPreview = !1),
                (this.viewPath = "");
              var e = this.title || "",
                t = document.createElement("span");
              t.innerHTML = e;
              var i = t.querySelectorAll("img.questionIndex");
              i.length > 0 &&
                i.forEach(function (e) {
                  var t = e.getAttribute("data-index"),
                    i =
                      '<span class="spaceIndex" contenteditable="false" index='
                        .concat(
                          t,
                          ' style="margin-left:6px;margin-right:6px;" >(填空 '
                        )
                        .concat(t, " )</span>");
                  e.insertAdjacentHTML("beforebegin", i);
                  var o = e.parentNode;
                  o.removeChild(e);
                });
              var o = t.querySelectorAll("a[data-preview_url_ueditor]");
              o.length > 0 && (this.withPreviewFile = !0);
              var s = t.querySelectorAll("span[data-fileuid]");
              s.length > 0 && (this.withPreviewFile = !0),
                (this.titleTxt = t.innerHTML);
            },
            clickTitle: function (e) {
              if (this.withPreviewFile) {
                var t = e.target;
                if (t.hasAttribute("data-preview_url_ueditor") && t.dataset.url)
                  (this.fileUrl = t.dataset.url),
                    (this.fileType = this.getPerviewDocType());
                else if (
                  t.hasAttribute("data-fileuid") &&
                  t.dataset.fileuid &&
                  t.className.indexOf("attachment") >= 0
                ) {
                  this.fileUrl = t.dataset.fileuid;
                  var i = "." + t.className.split(/\s/g).pop();
                  this.fileType = this.getPerviewDocType(i);
                }
                this.doPreviewFile(this.fileType, this.fileUrl);
              }
            },
            getPerviewDocType: function (e) {
              var t = e || this.fileUrl,
                i = "attachment";
              return (
                (i =
                  t.indexOf(".doc") >= 0
                    ? "word"
                    : t.indexOf(".ppt") >= 0 || t.indexOf(".pps") >= 0
                    ? "ppt"
                    : t.indexOf(".xls") >= 0
                    ? "excel"
                    : t.indexOf(".pdf") >= 0
                    ? "pdf"
                    : t.indexOf(".mp4") >= 0 ||
                      t.indexOf(".wmv") >= 0 ||
                      t.indexOf(".mov") >= 0 ||
                      t.indexOf(".avi") >= 0
                    ? "video"
                    : t.indexOf(".mp3") >= 0 ||
                      t.indexOf(".m4a") >= 0 ||
                      t.indexOf(".m4b") >= 0 ||
                      t.indexOf(".wav") >= 0 ||
                      t.indexOf(".webm") >= 0 ||
                      t.indexOf(".weba") >= 0 ||
                      t.indexOf(".mpeg") >= 0 ||
                      t.indexOf(".ogg") >= 0 ||
                      t.indexOf(".aac") >= 0 ||
                      t.indexOf(".flac") >= 0
                    ? "audio"
                    : t.indexOf(".jpg") >= 0 ||
                      t.indexOf(".jpeg") >= 0 ||
                      t.indexOf(".png") >= 0 ||
                      t.indexOf(".gif") >= 0 ||
                      t.indexOf(".bmp") >= 0
                    ? "img"
                    : "attachment"),
                i
              );
            },
            doPreviewFile: function (e, t) {
              if ("word" === e || "ppt" === e || "excel" === e || "pdf" === e)
                this.viewPath = this.getWordPreview(e, t);
              else if ("audio" === e || "video" === e || "img" === e) {
                var i = "https://ldoc.shou.org.cn/".concat(t);
                if (this.previewUrl && this.previewUrl.indexOf(t) >= 0) {
                  var o,
                    s = this.previewUrl.split(","),
                    n = Object(a["a"])(s);
                  try {
                    for (n.s(); !(o = n.n()).done; ) {
                      var r = o.value;
                      if (r.indexOf(t) >= 0) {
                        i = r;
                        break;
                      }
                    }
                  } catch (c) {
                    n.e(c);
                  } finally {
                    n.f();
                  }
                }
                this.viewPath = i;
              }
              this.showPreview = !0;
            },
            getWordPreview: function (e, t) {
              var i = t.replace("doc/a@", "");
              return "word" === e
                ? "//aia.shou.org.cn/wv/wordviewerframe.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    i
                  )
                : "ppt" === e
                ? "//aia.shou.org.cn/p/PowerPointFrame.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    i
                  )
                : "excel" === e
                ? "//aia.shou.org.cn/x/_layouts/xlviewerinternal.aspx?ui=zh-CN&WOPISrc=http://172.17.0.12:9999/wopi/files/".concat(
                    i
                  )
                : "pdf" === e
                ? "/pdfview/web/viewer.html?pdfLink=https://ldoc.shou.org.cn/".concat(
                    t
                  )
                : void 0;
            },
            closePreview: function () {
              (this.fileUrl = ""), (this.fileType = ""), (this.viewPath = "");
            },
          },
        },
        d = u,
        p = (i("59d2"), i("2877")),
        h = Object(p["a"])(d, o, s, !1, null, "1640fef7", null);
      t["a"] = h.exports;
    },
    d819: function (e, t, i) {},
    db49: function (e, t, i) {
      "use strict";
      t["a"] = { apiPrefix: "dotNet_api", isProduction: !0 };
    },
    dd69: function (e, t, i) {
      "use strict";
      i("c5e9");
    },
    e067: function (e, t, i) {
      "use strict";
      i("98a0");
    },
    e275: function (e, t, i) {},
    e411: function (e, t, i) {
      "use strict";
      i("4257");
    },
    e551: function (e, t, i) {
      "use strict";
      var o = function () {
          var e = this,
            t = e.$createElement,
            o = e._self._c || t;
          return o(
            "div",
            { staticClass: "course-card", on: { click: e.showCourseDetail } },
            [
              o(
                "Row",
                { staticClass: "course-row" },
                [
                  o("Col", { attrs: { span: "10" } }, [
                    o("div", { staticClass: "course-cover" }, [
                      o("img", {
                        attrs: {
                          src: e.courseData.courseCover
                            ? e.courseData.courseCover
                            : i("09d7"),
                        },
                      }),
                    ]),
                  ]),
                  o(
                    "Col",
                    { staticClass: "card-info", attrs: { span: "14" } },
                    [
                      o("h3", { staticClass: "course-title" }, [
                        e._v(e._s(e.courseData.courseName)),
                      ]),
                      o("p", { staticClass: "course-teacher" }, [
                        e._v("主持教师: " + e._s(e.courseData.teacherName)),
                      ]),
                      o(
                        "Row",
                        { staticClass: "card-sub-info" },
                        [
                          "search" === e.showType || "history" === e.showType
                            ? o("Col", { attrs: { span: "20" } }, [
                                e._v(
                                  "开设学期: " + e._s(e.courseData.term || "-")
                                ),
                              ])
                            : "collect" === e.showType
                            ? o("Col", { attrs: { span: "20" } }, [
                                e._v(
                                  "收藏时间: " +
                                    e._s(e.courseData.collectedTime || "-")
                                ),
                              ])
                            : e._e(),
                          "search" === e.showType || "collect" === e.showType
                            ? o(
                                "Col",
                                {
                                  staticStyle: { "text-align": "center" },
                                  attrs: { span: "4" },
                                  on: {
                                    click: function (t) {
                                      return (
                                        t.stopPropagation(),
                                        e.collectOrCancel.apply(null, arguments)
                                      );
                                    },
                                  },
                                },
                                [
                                  e.collectedStatus
                                    ? o("Icon", {
                                        attrs: {
                                          name: "like",
                                          size: "20",
                                          color: "#ff9800",
                                        },
                                      })
                                    : o("Icon", {
                                        attrs: {
                                          name: "like-o",
                                          size: "20",
                                          color: "#ff9800",
                                        },
                                      }),
                                ],
                                1
                              )
                            : e._e(),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          );
        },
        s = [],
        a = (i("e7e5"), i("d399")),
        n = (i("c3a6"), i("ad06")),
        r = (i("81e6"), i("9ffb")),
        c = (i("4d48"), i("d1e1")),
        l = i("db49"),
        u = {
          name: "CourseItem",
          components: { Row: c["a"], Col: r["a"], Icon: n["a"] },
          props: {
            courseData: {
              type: Object,
              default: function () {
                return {
                  courseId: "",
                  courseName: "",
                  courseCover: "",
                  teacherName: "",
                  term: "",
                  isCollected: "",
                  collectedTime: "",
                };
              },
            },
            showType: { type: String, default: "search" },
          },
          data: function () {
            return { collectedStatus: !1 };
          },
          mounted: function () {
            this.collectedStatus = this.courseData.isCollected;
          },
          methods: {
            showCourseDetail: function () {
              this.courseData.courseId &&
                (window.location.href =
                  "/course_detail/index.html?courseId=".concat(
                    this.courseData.courseId
                  ));
            },
            collectOrCancel: function () {
              var e = this,
                t = this.collectedStatus
                  ? "cancelCollectCourse"
                  : "doCollectCourse",
                i = this.collectedStatus ? "取消收藏" : "收藏",
                o = [this.courseData.courseId],
                s =
                  "dotNet_api" === l["a"].apiPrefix
                    ? { _dataArr: o }
                    : { courseId: this.courseData.courseId };
              this.$API(t, s)
                .then(function (t) {
                  "0" === t.code
                    ? ((e.collectedStatus = !e.collectedStatus),
                      a["a"].success("".concat(i, "成功!")),
                      "collect" === e.showType &&
                        e.$emit("cancelCollected", e.courseData.courseId))
                    : a["a"].fail("".concat(i, "失败!"));
                })
                .catch(function () {
                  a["a"].fail("".concat(i, "失败!"));
                });
            },
          },
        },
        d = u,
        p = (i("dd69"), i("2877")),
        h = Object(p["a"])(d, o, s, !1, null, "67790b12", null);
      t["a"] = h.exports;
    },
    e688: function (e, t, i) {},
    ea61: function (e, t, i) {},
    ec32: function (e, t) {
      e.exports =
        "data:image/png;base64,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";
    },
    f3df: function (e, t, i) {
      "use strict";
      i.d(t, "f", function () {
        return r;
      }),
        i.d(t, "d", function () {
          return c;
        }),
        i.d(t, "a", function () {
          return l;
        }),
        i.d(t, "c", function () {
          return p;
        }),
        i.d(t, "e", function () {
          return u;
        }),
        i.d(t, "b", function () {
          return d;
        });
      var o = i("b85c"),
        s = i("2909"),
        a = (i("ac1f"), i("1276"), i("d3b7"), i("d81d"), i("99af"), i("365c")),
        n = {
          userInfo: null,
          lang: null,
          currentRole: null,
          hostCourseList: null,
          faceCourseList: null,
          dictionaryData: null,
        },
        r = function (e, t) {
          n[e] = t;
          var i = JSON.stringify(t);
          if ((sessionStorage.setItem(e, i), "userInfo" === e)) {
            var o = t.roleFlags || "",
              s = o.split(","),
              a = s[0];
            s.indexOf("ROLE_MASTER_TEACH") >= 0
              ? (a = "ROLE_MASTER_TEACH")
              : s.indexOf("ROLE_FACE_TEACH") >= 0
              ? (a = "ROLE_FACE_TEACH")
              : s.indexOf("ROLE_TEACHER") >= 0
              ? (a = "ROLE_TEACHER")
              : s.indexOf("ROLE_STUDENT") >= 0 && (a = "ROLE_STUDENT"),
              sessionStorage.setItem("currentRole", JSON.stringify(a)),
              (n.currentRole = a);
          }
        },
        c = function (e) {
          return void 0 !== n[e] && null !== n[e]
            ? n[e]
            : JSON.parse(sessionStorage.getItem(e));
        },
        l = function () {
          for (var e in n) delete n[e];
          var t = sessionStorage;
          t.clear();
        },
        u = function (e) {
          var t = c("studyCourseList");
          null !== t &&
          void 0 !== t &&
          "[object Array]" === Object.prototype.toString.call(t)
            ? e && e(t)
            : Object(a["a"])("getStuCourseList")
                .then(function (e) {
                  "0" === e.code &&
                    ((t = (e.data || []).map(function (e) {
                      return e.courseId && !e.id && (e.id = e.courseId), e;
                    })),
                    r("studyCourseList", t));
                })
                .finally(function () {
                  return e && e(t || []);
                });
        },
        d = function (e, t) {
          var i,
            n = c("studyCourseList") || [],
            r = c("hostCourseList") || [],
            l = c("faceCourseList") || [],
            u = "",
            d = [].concat(
              Object(s["a"])(n),
              Object(s["a"])(r),
              Object(s["a"])(l)
            ),
            p = Object(o["a"])(d);
          try {
            for (p.s(); !(i = p.n()).done; ) {
              var h = i.value;
              if (h.id === e || h.courseId === e) {
                u = h;
                break;
              }
            }
          } catch (f) {
            p.e(f);
          } finally {
            p.f();
          }
          u
            ? t(u)
            : Object(a["a"])("getCourseDetail", { courseId: e })
                .then(function (e) {
                  "0" === e.code && (u = e.data || {});
                })
                .finally(function () {
                  return t && t(u);
                });
        },
        p = function (e) {
          var t = c("dictionaryData");
          null !== t &&
          void 0 !== t &&
          "[object Object]" === Object.prototype.toString.call(t)
            ? e && e(t)
            : Object(a["a"])("getDataDictionary")
                .then(function (e) {
                  if ("0" === e.code) {
                    var t = e.data || {};
                    r("dictionaryData", t);
                  }
                })
                .finally(function () {
                  return e && e(t || {});
                });
        };
    },
    f650: function (e, t, i) {
      "use strict";
      i("7dca");
    },
    f797: function (e, t, i) {},
    fd27: function (e, t, i) {},
    fd3a: function (e, t) {
      e.exports =
        "data:image/png;base64,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";
    },
  },
]);

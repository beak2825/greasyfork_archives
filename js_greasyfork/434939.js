// ==UserScript==
// @name         超星网课助手(全网最强题库版本)|支持90%以上图片题
// @namespace    Ruinous
// @version      5.6.0
// @description  【修复视频功能】【支持新版自动跳转】【完美倍速】开放优化收录系统,自动挂机看尔雅MOOC，支持视频自动完成，章节测验自动答题提交，支持自动切换任务点等，开放自定义参数
// @author       Ruinous
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @connect      api.gochati.cn
// @connect      up.gochati.cn
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @antifeature  ads
// @original-script https://greasyfork.org/scripts/369625
// @original-author wyn665817
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/434939/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%28%E5%85%A8%E7%BD%91%E6%9C%80%E5%BC%BA%E9%A2%98%E5%BA%93%E7%89%88%E6%9C%AC%29%7C%E6%94%AF%E6%8C%8190%25%E4%BB%A5%E4%B8%8A%E5%9B%BE%E7%89%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/434939/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%28%E5%85%A8%E7%BD%91%E6%9C%80%E5%BC%BA%E9%A2%98%E5%BA%93%E7%89%88%E6%9C%AC%29%7C%E6%94%AF%E6%8C%8190%25%E4%BB%A5%E4%B8%8A%E5%9B%BE%E7%89%87%E9%A2%98.meta.js
// ==/UserScript==


function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const api_array = [
  "https://api.gochati.cn/jsapi.php?token=cxmooc&q=",
];
const api_upload = [
    "https://up.gochati.cn/question2.php"
];
// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    api: getRandomInteger(0, api_array.length), // 答题接口编号，参考上方，默认随机
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5e3, // 默认响应速度为5秒，不建议小于3秒
    token: "", // 捐助用户可以使用定制功能，更精准的匹配答案，此处填写捐助后获取的识别码
    review: 0, // 复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频，默认关闭
    queue: 1, // 队列模式，开启后任务点逐一完成，关闭则单页面所有任务点同时进行，默认开启
    submit: 1, //答案收录，开启后可在作业完成界面自动收录题目，默认开启

    // 1代表开启，0代表关闭
    video: 1, // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    work: 1, // 自动答题功能(章节测验)，作业需要手动开启查询，高准确率，默认开启
    audio: 1, // 音频自动播放，与视频功能共享vol和rate参数，默认开启
    book: 1, // 图书阅读任务点，非课程阅读任务点，默认开启
    docs: 1, // 文档阅读任务点，PPT类任务点自动完成阅读任务，默认开启
    // 本区域参数，上方为任务点功能，下方为独立功能
    jump: 1, // 自动切换任务点、章节、课程(需要配置course参数)，默认开启
    read: "0", // 挂机课程阅读时间，单位是分钟，'65'代表挂机65分钟，请手动打开阅读页面，默认'0'分钟
    face: 0, // 解除面部识别(不支持二维码类面部采集)，此功能仅为临时解除，默认关闭
    total: 1, // 显示课程进度的统计数据，在学习进度页面的上方展示，默认开启

    // 仅开启video(audio)时，修改此处才会生效
    line: "公网1", // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    http: "标清", // 视频播放的默认清晰度，无效参数则使用系统默认清晰度，默认'标清'
    // 本区域参数，上方为video功能独享，下方为audio功能共享
    vol: "0", // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
    rate: "1", // 视频播放默认倍率，参数范围0∪[0.0625,16]，'0'为秒过，默认'1'倍，注意：在页面内开启永久秒过时，该选项失效

    // 仅开启work时，修改此处才会生效
    auto: 0, // 答题完成后自动提交，默认关闭，注意：在页面内开启永久自动提交时，该选项失效
    temp: 1, //答题完成后自动保存搜索到的答案，默认开启
    none: 0, // 无匹配答案时执行默认操作，关闭后若题目无匹配答案则会暂时保存已作答的题目，默认关闭
    scale: 0, // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭

    // 仅开启jump时，修改此处才会生效
    course: 1, // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，默认开启
    lock: 1, // 跳过未开放(图标是锁)的章节，即闯关模式或定时发放的任务点，默认开启
    jumptime: 3e3, //跳转至下个课程的延迟时间，不建议小于3秒

    // 自动登录功能配置区
    school: "账号为手机号可以不修改此参数", // 学校/单位/机构码，要求完整有效可查询，例如'清华大学'
    username: "", // 学号/工号/借书证号(邮箱/手机号/账号)，例如'2018010101'，默认''
    password: "", // 密码，例如'123456'，默认''

    //验证配置区
    ischeck: 0, //是否检测完毕，可手动更改为1避免全部检测(如果改为1可能会不能使用)
  },
  _self = unsafeWindow,
  url = location.pathname,
  top = _self,
  nowtime=new Date().getTime();
if (GM_getValue("auto_work_upload")==undefined||GM_getValue("timestamp")==undefined){
  GM_setValue("auto_work_upload",setting.auto);
  GM_setValue("timestamp",new Date().getTime())
}else{
   setting.auto=GM_getValue("auto_work_upload");
}
if (url != "/studyApp/studying" && top != _self.top)
  document.domain = location.host.replace(/.+?\./, "");

try {
  while (top != _self.top) {
    top = top.parent.document ? top.parent : _self.top;
    if (top.location.pathname == "/mycourse/studentstudy") break;
  }
} catch (err) {
  // console.log(err);
  top = _self;
}

var $ = _self.jQuery || top.jQuery,
  parent = _self == top ? self : _self.parent,
  Ext = _self.Ext || parent.Ext || {},
  UE = _self.UE,
  vjs = _self.videojs;

String.prototype.toCDB = function () {
  return this.replace(/\s/g, "")
    .replace(/[\uff01-\uff5e]/g, function (str) {
      return String.fromCharCode(str.charCodeAt(0) - 65248);
    })
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/。/g, ".");
};

setting.normal = ""; // ':visible'
// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
setting.job = [":not(*)"];

setting.video && setting.job.push('iframe[src*="/video/index.html"]');
setting.work && setting.job.push('iframe[src*="/work/index.html"]');
setting.audio && setting.job.push('iframe[src*="/audio/index.html"]');
setting.book && setting.job.push('iframe[src*="/innerbook/index.html"]');
setting.docs &&
  setting.job.push(
    'iframe[src*="/ppt/index.html"]',
    'iframe[src*="/pdf/index.html"]'
  );

setting.tip = !setting.queue || (top != _self && jobSort($ || Ext.query));

if (url == "/mycourse/studentstudy") {
  _self.checkMobileBrowerLearn = $.noop;
  var classId = location.search.match(/cla[zs]{2}id=(\d+)/i)[1] || 0,
    courseId =
      _self.courseId || location.search.match(/courseId=(\d+)/i)[1] || 0;
  setting.lock ||
    $("#coursetree").on("click", "[onclick*=void], [href*=void]", function () {
      _self.getTeacherAjax(
        courseId,
        classId,
        $(this).parent().attr("id").slice(3)
      );
    });
} else if (url == "/ananas/modules/video/index.html" && setting.video) {
  if (setting.review) _self.greenligth = Ext.emptyFn;
  checkPlayer(_self.supportH5Video());
} else if (
  url == "/work/doHomeWorkNew" ||
  url == "/api/work" ||
  url == "/work/addStudentWorkNewWeb"
) {
  if (!UE) {
    var len = ($ || Ext.query || Array)("font:contains(未登录)", document)
      .length;
    setTimeout(
      len == 1 ? top.location.reload : parent.greenligth,
      setting.time
    );
  } else if (setting.work) {
    setTimeout(relieveLimit, 0);
    beforeFind();
  }
} else if(url=="/mooc2/work/dowork"){
    alert("新版脚本作业功能仍在测试中，可能出现不稳定的情况，请谨慎使用！");
    $(
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">' +
      '<span style="font-size: medium;"></span>' +
      '<div style="font-size: medium;">正在搜索答案...</div>' +
      "<button>折叠面板</button>" +
      '<div style="max-height: 300px; overflow-y: auto;">' +
      '<table border="1" style="font-size: 12px;">' +
      "<thead>" +
      "<tr>" +
      '<th style="width: 25px; min-width: 25px;">题号</th>' +
      '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
      '<th style="min-width: 130px;">答案（点击可复制）</th>' +
      "</tr>" +
      "</thead>" +
      '<tfoot style="display: none;">' +
      "<tr>" +
      '<th colspan="3">答案提示框 已折叠</th>' +
      "</tr>" +
      "</tfoot>" +
      "<tbody>" +
      "<tr>" +
      '<td colspan="3" style="display: none;"></td>' +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>"
  )
    .appendTo("body").on("click","button",function(){
        $(this).find("tbody, tfoot").toggle();
    });
    let len=$(".questionLi").size();
    $(".questionLi").each(function(i){
        console.log($(this).children("h3").text().replace(/[0-9]?.*?\(.*?题\) /g,""));
    });
}
else if (url == "/ananas/modules/audio/index.html" && setting.audio) {
  if (setting.review) _self.greenligth = Ext.emptyFn;
  _self.videojs = hookAudio;
  hookAudio.xhr = vjs.xhr;
} else if (
  url == "/ananas/modules/innerbook/index.html" &&
  setting.book &&
  setting.tip
) {
  setTimeout(function () {
    _self.setting
      ? _self.top.onchangepage(_self.getFrameAttr("end"))
      : _self.greenligth();
  }, setting.time);
} else if (
  url.match(/^\/ananas\/modules\/(ppt|pdf)\/index\.html$/) &&
  setting.docs &&
  setting.tip
) {
  setTimeout(function () {
    _self.setting ? _self.finishJob() : _self.greenligth();
  }, setting.time);
  frameElement.setAttribute("download", 1);
} else if (url == "/knowledge/cards"||url=="/api/work") {
    console.log(parent.location.search)
    if(parent.location.search.indexOf("mooc2=1")!=-1){
        $ && checkToNextnew();
    }else{
        $ && checkToNext();
    }
} else if (url.match(/^\/(course|zt)\/\d+\.html$/)) {
  setTimeout(function () {
    +setting.read &&
      _self.sendLogs &&
      $(".course_section:eq(0) .chapterText").click();
  }, setting.time);
} else if (url == "/ztnodedetailcontroller/visitnodedetail") {
  setting.read *= 60 / $(".course_section").length;
  setting.read && _self.sendLogs && autoRead();
} else if (url == "/mycourse/studentcourse") {
  var gv = location.search.match(/d=\d+&/g);
  setting.total &&
    $("<a>", {
      href:
        "/moocAnalysis/chapterStatisticByUser?classI" +
        gv[1] +
        "courseI" +
        gv[0] +
        "userId=" +
        _self.getCookie("_uid") +
        "&ut=s",
      target: "_blank",
      title: "点击查看章节统计",
      style: "margin: 0 25px;",
      html:
        "本课程共" +
        $(".icon").length +
        "节，剩余" +
        $("em:not(.openlock)").length +
        "节未完成",
    })
      .appendTo(".zt_logo")
      .parent()
      .width("auto");
} else if (url.match(/^\/visit\/(courses|interaction)$/)) {
  setting.face &&
    $(".zmodel").on("click", "[onclick^=openFaceTip]", DisplayURL);
} else if (location.host.match(/^passport2/)) {
  setting.username && getSchoolId();
} else if (location.hostname == "i.mooc.chaoxing.com") {
    if(setting.ischeck==0){
        opencheckGUI();
    }

} else if (url == "/widget/pcvote/goStudentVotePage") {
  $(":checked").click();
  $(".StudentTimu").each(function (index) {
    var ans = _self.questionlist[index].answer;
    $(":radio, :checkbox", this).each(function (num) {
      ans[num].isanswer && this.click();
    });
    $(":text", this).val(function (num) {
      return $(ans[num].content).text().trim();
    });
  });
} else if (url == "/work/selectWorkQuestionYiPiYue") {
    if(setting.submit==1){
        dynamicLoadCss("https://cdn.bootcdn.net/ajax/libs/milligram/1.4.1/milligram.min.css");
        submitAnswer();
    }
}
function opencheckGUI(){
             _self.layui.use("layer", function () {
    this.layer.open({
      content: "拖动进度条、倍速播放、秒过会导致不良记录！</br>欢迎加入QQ群：646942172 共同讨论<br>等待下方加载完成出现404 not found即为完成人工验证</br><iframe src='https://api.gochati.cn'></iframe>",
      title: "超星网课助手人工验证",
      btn: "验证完毕",
      offset: "t",
      closeBtn: 0,
    });
  });
}
function dynamicLoadCss(url) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.type='text/css';
		link.rel = 'stylesheet';
		link.href = url;
		head.appendChild(link);
}
function getIframe(tip, win, job) {
  if (!$)
    return (
      Ext.get(frameElement || [])
        .parent()
        .child(".ans-job-icon") || Ext.get([])
    );
  do {
    win = win ? win.parent : _self;
    job = $(win.frameElement).prevAll(".ans-job-icon");
  } while (!job.length && win.parent.frameElement);
  return tip ? win : job;
}

function jobSort($) {
  var fn = $.fn ? [getIframe(1), "length"] : [self, "dom"],
    sel = setting.job.join(
      ", :not(.ans-job-finished) > .ans-job-icon" + setting.normal + " ~ "
    );
  if ($(sel, fn[0].parent.document)[0] == fn[0].frameElement) return true;
  if (!getIframe()[fn[1]] || getIframe().parent().is(".ans-job-finished"))
    return null;
  setInterval(function () {
    $(sel, fn[0].parent.document)[0] == fn[0].frameElement &&
      fn[0].location.reload();
  }, setting.time);
}

function checkPlayer(tip) {
    console.log(_self.videojs);
  _self.videojs = hookVideo;
  hookVideo.xhr = vjs.xhr;
  Ext.isSogou = Ext.isIos = Ext.isAndroid = false;
  var data = Ext.decode(_self.config("data")) || {};
  delete data.danmaku;
  data.doublespeed = 1;
  frameElement.setAttribute("data", Ext.encode(data));
  if (tip) return;
  _self.supportH5Video = function () {
    return true;
  };
  alert("此浏览器不支持html5播放器，请更换浏览器");
}

function hookVideo() {
  _self.alert = console.log;
    console.log(arguments);
  var config = arguments[1];
    if(config!=undefined){
   var line =
      Ext.Array.filter(
        Ext.Array.map(config.playlines, function (value, index) {
          return value.label == setting.line && index;
        }),
        function (value) {
          return Ext.isNumber(value);
        }
      )[0] || 0,
    http = Ext.Array.filter(config.sources, function (value) {
      return value.label == setting.http;
    })[0];
  config.playlines.unshift(config.playlines[line]);
  config.playlines.splice(line + 1, 1);
  config.plugins.videoJsResolutionSwitcher.default = http ? http.res : 360;
  config.plugins.studyControl.enableSwitchWindow = 1;
  config.plugins.timelineObjects.url = "/richvideo/initdatawithviewer?";
  config.plugins.seekBarControl.enableFastForward = 1;
  if (!setting.queue) delete config.plugins.studyControl;
    arguments[1]["playbackRates"]=[0.5,1,1.5,2,4,8,16];
  // config.preload = setting.tip ? 'auto' : 'none';
   // console.log(arguments);

  var player = vjs.apply(this, arguments),
    a =
      '<a href="https://s1.ananas.chaoxing.com/download/' +
      _self.config("objectid") +
      '" target="_blank">',
    img =
      '<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
    player.playbackRate=function (t){if(void 0===t)return;this.tech_&&this.tech_.featuresPlaybackRate?this.cache_.lastPlaybackRate||this.techGet_("playbackRate"):setting.rate;this.techCall_("setPlaybackRate",t)};
  player.volume(Math.round(setting.vol) / 100 || 0);
 /* Ext.get(player.controlBar.addChild("Button").el_).setHTML(
    a + img + "</a>"
  ).dom.title = "下载视频";*/
    let fastbutton=$(player.controlBar.addChild("Button").el_);
    let fastbutton_always=$(player.controlBar.addChild("Button").el_);
    fastbutton.html("<span>一键秒过</span>");
    fastbutton.prop("title","点击后即可单独秒过该视频");
    fastbutton.on("click",()=>{
       config.plugins.seekBarControl.sendLog(
        player.children_[0],
        "ended",
        Math.floor(player.cache_.duration)
      );
    });
    GM_getValue("fast")==undefined? GM_setValue("fast",setting.rate==0):"";
    fastbutton_always.html("<span>"+(GM_getValue("fast")==1?"关闭永久秒过":"开启永久秒过")+"</span>");
    fastbutton_always.prop("title","点击后即可开启或关闭永久秒过所有视频");
    fastbutton_always.on("click",()=>{
        if(GM_getValue("fast")==0){
            GM_setValue("fast",1);
            fastbutton_always.html("<span>"+(GM_getValue("fast")==1?"关闭永久秒过":"开启永久秒过")+"</span>");
            var Timer=setTimeout(
               config.plugins.seekBarControl.sendLog(
        player.children_[0],
        "ended",
        Math.floor(player.cache_.duration)
      ),3000);
        }else{
            GM_setValue("fast",0);
            fastbutton_always.html("<span>"+(GM_getValue("fast")==1?"关闭永久秒过":"开启永久秒过")+"</span>");
            Timer.cancel();
        }
    });
  player.on("loadstart", function () {
    setting.tip && this.play().catch(Ext.emptyFn);
    this.playbackRate(
      setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate
    );
      //console.log(this.playbackRate)
  });
  player.one(["loadedmetadata", "firstplay"], function () {
    setting.two = (setting.rate === "0" || GM_getValue("fast")==1)&& setting.two < 1;
    setting.two &&
      config.plugins.seekBarControl.sendLog(
        this.children_[0],
        "ended",
        Math.floor(this.cache_.duration)
      );
  });
  player.on("ended", function () {
    Ext.fly(frameElement).parent().addCls("ans-job-finished");
  });
    }
  return player;
}

function hookAudio() {
  _self.alert = console.log;
  var config = arguments[1];
  config.plugins.studyControl.enableSwitchWindow = 1;
  config.plugins.seekBarControl.enableFastForward = 1;
  if (!setting.queue) delete config.plugins.studyControl;
  var player = vjs.apply(this, arguments),
    a =
      '<a href="https://d0.ananas.chaoxing.com/download/' +
      _self.config("objectid") +
      '" target="_blank">',
    img =
      '<img src="https://d0.ananas.chaoxing.com/download/e363b256c0e9bc5bd8266bf99dd6d6bb" style="margin: 6px 0 0 6px;">';
  player.volume(Math.round(setting.vol) / 100 || 0);
  player.playbackRate(
    setting.rate > 16 || setting.rate < 0.0625 ? 1 : setting.rate
  );
  Ext.get(player.controlBar.addChild("Button").el_).setHTML(
    a + img + "</a>"
  ).dom.title = "下载音频";
  player.on("loadeddata", function () {
    setting.tip && this.play().catch(Ext.emptyFn);
  });
  player.one("firstplay", function () {
    setting.rate === "0" &&
      config.plugins.seekBarControl.sendLog(
        this.children_[0],
        "ended",
        Math.floor(this.cache_.duration)
      );
  });
  player.on("ended", function () {
    Ext.fly(frameElement).parent().addCls("ans-job-finished");
  });
  return player;
}

function relieveLimit() {
  if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
  $.each(UE.instants, function () {
    var key = this.key;
    this.ready(function () {
      this.destroy();
      UE.getEditor(key);
    });
  });
}

function beforeFind() {
  setting.regl = parent.greenligth || $.noop;
  if ($.type(parent._data) == "array") return setting.regl();
  setting.div = $(
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">' +
      '<span style="font-size: medium;"></span>' +
      '<div style="font-size: medium;">正在搜索答案...</div>' +
      '<button style="margin-right: 10px;">暂停答题</button>' +
      '<button style="margin-right: 10px;">' +
      (setting.auto ? "取消本次自动提交" : "开启本次自动提交") +
      "</button>" +
      '<button style="margin-right: 10px;">重新查询</button>' +
      '<button style="margin-right: 10px;">'+(GM_getValue("auto_work_upload")==1? "关闭永久自动提交":"开启永久自动提交")+'</button>' +
      "<button>折叠面板</button>" +
      '<div style="max-height: 300px; overflow-y: auto;">' +
      '<table border="1" style="font-size: 12px;">' +
      "<thead>" +
      "<tr>" +
      '<th style="width: 25px; min-width: 25px;">题号</th>' +
      '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
      '<th style="min-width: 130px;">答案（点击可复制）</th>' +
      "</tr>" +
      "</thead>" +
      '<tfoot style="display: none;">' +
      "<tr>" +
      '<th colspan="3">答案提示框 已折叠</th>' +
      "</tr>" +
      "</tfoot>" +
      "<tbody>" +
      "<tr>" +
      '<td colspan="3" style="display: none;"></td>' +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>"
  )
    .appendTo("body")
    .on("click", "button, td", function () {
      var len = $(this).prevAll("button").length;
      if (this.nodeName == "TD") {
        $(this).prev().length && GM_setClipboard($(this).text());
      } else if (!$(this).siblings().length) {
        $(this).parent().text("正在搜索答案...");
        setting.num++;
      } else if (len === 0) {
        if (setting.loop) {
          clearInterval(setting.loop);
          delete setting.loop;
          len = ["已暂停搜索", "继续答题"];
        } else {
          setting.loop = setInterval(findAnswer, setting.time);
          len = ["正在搜索答案...", "暂停答题"];
        }
        setting.div
          .children("div:eq(0)")
          .html(function () {
            return $(this).data("html") || len[0];
          })
          .removeData("html");
        $(this).html(len[1]);
      } else if (len == 1) {
        setting.auto = !setting.auto;
        $(this).html(setting.auto ? "取消本次自动提交" : "开启本次自动提交");
      } else if (len == 2) {
        parent.location.reload();
      } else if (len == 3) {
          if(GM_getValue("auto_work_upload")==1){
              setting.auto=0;
              GM_setValue("auto_work_upload",0);
          }else{
              setting.auto=1;
              GM_setValue("auto_work_upload",1);
          }
        $(this).html(GM_getValue("auto_work_upload")==1? "关闭永久自动提交":"开启永久自动提交");
      } else if (len == 4) {
        setting.div.find("tbody, tfoot").toggle();
      }
    })
    .find("table, td, th")
    .css("border", "1px solid")
    .end();
  setting.lose = setting.num = 0;
  setting.data = parent._data = [];
  setting.over = '<button style="margin-right: 10px;">跳过此题</button>';
  setting.curs =
    $("script:contains(courseName)", top.document)
      .text()
      .match(/courseName:\'(.+?)\'|$/)[1] ||
    $("h1").text().trim() ||
    "无";
  setting.loop = setInterval(findAnswer, setting.time);
  var tip = { undefined: "任务点排队中", null: "等待切换中" }[setting.tip];
  tip &&
    setting.div
      .children("div:eq(0)")
      .data("html", tip)
      .siblings("button:eq(0)")
      .click();
}

function findAnswer() {
  if (setting.num >= $(".TiMu").length) {
    var arr = setting.lose
      ? [
          '共有 <font color="red">' +
            setting.lose +
            "</font> 道题目待完善（已深色标注）",
          saveThis,
        ]
      : ["答题已完成", submitThis];
    setting.div
      .children("div:eq(0)")
      .data("html", arr[0])
      .siblings("button:eq(0)")
      .hide()
      .click();
    return setTimeout(arr[1], setting.time);
  }
  var $TiMu = $(".TiMu").eq(setting.num),
    question = filterImg($TiMu.find(".Zy_TItle:eq(0) .clearfix"))
      .replace(/^【.*?】\s*/, "")
      .replace(/\s*（\d+\.\d+分）$/, ""),
    type = $TiMu.find("input[name^=answertype]:eq(0)").val() || "-1";
  GM_xmlhttpRequest({
    method: "GET",
    url: api_array[setting.api] + encodeURIComponent(question),
    timeout: setting.time,
    onload: function (xhr) {
      if (!setting.loop) {
      } else if (xhr.status == 200) {
        let response = xhr.responseText;
        if (response.startsWith("null")) {
          response = response.slice(4);
        }
        var obj = $.parseJSON(response) || {};
        obj.data = obj.da || obj.answer;
        obj.code = obj.hasOwnProperty("code")
          ? obj.code
          : obj.hasOwnProperty("data")
          ? obj.data == ""
            ? 0
            : 1
          : 0;
        if (obj.code!=undefined) {
          setting.div.children("div:eq(0)").text("正在搜索答案...");
          var td = '<td style="border: 1px solid;',
            data = String(obj.data)
              .replace(/&/g, "&amp;")
              .replace(/<(?!img)/g, "&lt;");
          obj.data = /^http/.test(data)
            ? '<img src="' + obj.data + '">'
            : obj.data;
          $(
            "<tr>" +
              td +
              ' text-align: center;">' +
              $TiMu.find(".Zy_TItle:eq(0) i").text().trim() +
              "</td>" +
              td +
              '" title="点击可复制">' +
              (question.match("<img")
                ? question
                : question.replace(/&/g, "&amp;").replace(/</g, "&lt")) +
              "</td>" +
              td +
              '" title="点击可复制">' +
              (/^http/.test(data) ? obj.data : "") +
              data +
              "</td>" +
              "</tr>"
          )
            .appendTo(setting.div.find("tbody"))
            .css(
              "background-color",
              fillAnswer($TiMu.find("ul:eq(0)").find("li"), obj, type)
                ? ""
                : "rgba(0, 150, 136, 0.6)"
            );
          setting.data[setting.num++] = {
            code: obj.code > 0 ? 1 : 0,
            question: question,
            option: obj.data,
            type: Number(type),
          };
        } else {
          setting.div
            .children("div:eq(0)")
            .html(obj.data || setting.over + "服务器繁忙，正在重试...");
        }
        setting.div.children("span").html(obj.msg || obj || "");
      } else if (xhr.status == 403) {
        var html = xhr.responseText.indexOf("{")
          ? "请求过于频繁，建议稍后再试"
          : $.parseJSON(xhr.responseText).data;
        setting.div
          .children("div:eq(0)")
          .data("html", html)
          .siblings("button:eq(0)")
          .click();
      } else {
        setting.div
          .children("div:eq(0)")
          .html(setting.over + "服务器异常，正在重试..."+"<br><a href='https://i.mooc.chaoxing.com' target='_blank'>如未进行验证，请点击前往验证页面</a></br>");
      }
    },
    ontimeout: function () {
      setting.loop &&
        setting.div
          .children("div:eq(0)")
          .html(setting.over + "服务器超时，正在重试..."+"<br><a href='https://i.mooc.chaoxing.com' target='_blank'>如未进行验证，请点击前往验证页面</a></br>");
    },
  });
}

function fillAnswer($li, obj, type) {
  var $input = $li.find(":radio, :checkbox"),
    str = String(obj.data).toCDB() || new Date().toString(),
    data = str.split(/#|\x01|\|/),
    opt = obj.opt || str,
    state = setting.lose;
  // $li.find(':radio:checked').prop('checked', false);
  obj.code > 0 &&
    $input
      .each(function (index) {
        if (this.value == "true") {
          data.join().match(/(^|,)(正确|是|对|√|T|ri|right)(,|$)/) &&
            this.click();
        } else if (this.value == "false") {
          data.join().match(/(^|,)(错误|否|错|×|F|wr|false)(,|$)/) &&
            this.click();
        } else {
          var tip =
            filterImg($li.eq(index).find(".after")).toCDB() ||
            new Date().toString();
          Boolean(
            $.inArray(tip, data) + 1 || (type == "1" && str.indexOf(tip) + 1)
          ) == this.checked || this.click();
        }
      })
      .each(function () {
        if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
        Boolean(opt.match(this.value)) == this.checked || this.click();
      });
  if (type.match(/^[013]$/)) {
    $input.is(":checked") ||
      (setting.none
        ? ($input[Math.floor(Math.random() * $input.length)] || $()).click()
        : setting.lose++);
  } else if (type.match(/^(2|[4-9]|1[08])$/)) {
    data = String(obj.data).split(/#|\x01|\|/);
    str = $li
      .end()
      .find("textarea")
      .each(function (index) {
        index = (obj.code > 0 && data[index]) || "";
        UE.getEditor(this.name).setContent(index.trim());
      }).length;
    (obj.code > 0 && data.length == str) || setting.none || setting.lose++;
  } else {
    setting.none || setting.lose++;
  }
  return state == setting.lose;
}

function saveThis() {
  //if (!setting.auto) return setTimeout(saveThis, setting.time);
   if(!setting.temp) return;
  setting.div.children("button:lt(3)").hide().eq(1).click();
  _self.alert = console.log;
  $("#tempsave").click();
    console.log("保存答案");
  setting.regl();
}

function submitThis() {
  if (!setting.auto) {
  } else if (!$(".Btn_blue_1:visible").length) {
    setting.div.children("button:lt(3)").hide().eq(1).click();
    return setting.regl();
  } else if ($("#confirmSubWin:visible").length) {
    var btn = $("#tipContent + * > a").offset() || { top: 0, left: 0 },
      mouse = document.createEvent("MouseEvents");
    btn = [
      btn.left + Math.ceil(Math.random() * 46),
      btn.top + Math.ceil(Math.random() * 26),
    ];
    mouse.initMouseEvent(
      "click",
      true,
      true,
      document.defaultView,
      0,
      0,
      0,
      btn[0],
      btn[1],
      false,
      false,
      false,
      false,
      0,
      null
    );
    _self.event = $.extend(true, {}, mouse);
    delete _self.event.isTrusted;
    _self.form1submit();
  } else {
    $(".Btn_blue_1")[0].click();
  }
  setTimeout(submitThis, Math.ceil(setting.time * Math.random()) * 2);
}

function checkToNext() {
  var $tip = $(setting.job.join(", "), document).prevAll(
    ".ans-job-icon" + setting.normal
  );
  setInterval(function () {
    $tip.parent(":not(.ans-job-finished)").length || (setting.jump && toNext());
  }, setting.time);
}
function checkToNextnew() {
/*  setInterval(function () {
    $(".posCatalog_select").not($(".icon_Completed").parent()).filter($("[id*=cur]")).length || (setting.jump && toNextnew());
  }, setting.time);*/
    setInterval(function(){
        //console.log("检查跳转");
        //console.log($(".ans-job-icon",document).parent(":not(.ans-job-finished)").length)
    if($(".ans-job-icon",document).parent(":not(.ans-job-finished)").length){
        return;
    }
    setTimeout(function () {
    $(".jobUnfinishCount").parent().find("span:eq(0)").length && (setting.jump && toNextnew());
  }, setting.jumptime);
    },setting.jumptime);

}
function toNext() {
  var $cur = $("#cur" + $("#chapterIdid").val()),
    $tip = $("span.currents ~ span"),
    sel = setting.review ? "html" : ".blue";
  if (!$cur.has(sel).length && $tip.length) return $tip.eq(0).click();
  $tip = $(".roundpointStudent, .roundpoint").parent();
  $tip = $tip.slice($tip.index($cur) + 1).not(":has(" + sel + ")");
  $tip
    .not(setting.lock ? ":has(.lock)" : "html")
    .find("span")
    .eq(0)
    .click();
  $tip.length || (setting.course && switchCourse());
}
function toNextnew(){
    /*var nextlist=
    $(".posCatalog_select").not($(".icon_Completed").parent()).filter($("[id*=cur]")).children(".posCatalog_name");
    nextlist[0].click()*/
    console.log("跳转至下一节")
      var $tip = $(setting.job.join(", "), document);
    var nextlist=$(".jobUnfinishCount",parent.document).parent().filter($(":not(.posCatalog_active)")).find("span:eq(0)");
    var pos_index=$(".jobUnfinishCount",parent.document).parent().index($(".posCatalog_active"));
    nextlist.splice(0,pos_index);
    if($(".prev_ul > li.active").next().length){
        $(".prev_ul > li.active").next().click()
    }else{
        nextlist[0].click();
    }
}
function switchCourse() {
  GM_xmlhttpRequest({
    method: "GET",
    url: "/visit/courses/study?isAjax=true&fileId=0&debug=",
    headers: {
      Referer: location.origin + "/visit/courses",
      "X-Requested-With": "XMLHttpRequest",
    },
    onload: function (xhr) {
      var list = $("h3 a[target]", xhr.responseText).map(function () {
          return $(this).attr("href");
        }),
        index =
          list
            .map(function (index) {
              return this.match(top.courseId) && index;
            })
            .filter(function () {
              return $.isNumeric(this);
            })[0] + 1 || 0;
      setting.course = list[index] ? goCourse(list[index]) : 0;
    },
  });
}

function goCourse(url) {
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function (xhr) {
      $.globalEval(
        'location.href = "' +
          $(".articlename a[href]", xhr.responseText).attr("href") +
          '";'
      );
    },
  });
}

function autoRead() {
  $("html, body")
    .animate(
      {
        scrollTop: $(document).height() - $(window).height(),
      },
      Math.round(setting.read) * 1e3,
      function () {
        $(".nodeItem.r i").click();
      }
    )
    .one("click", "#top", function (event) {
      $(event.delegateTarget).stop();
    });
}

function DisplayURL() {
  _self.WAY.box.hide();
  var $li = $(this).closest("li");
  $.get(
    "/visit/goToCourseByFace",
    {
      courseId: $li.find("input[name=courseId]").val(),
      clazzId: $li.find("input[name=classId]").val(),
    },
    function (data) {
      $li
        .find("[onclick^=openFaceTip]")
        .removeAttr("onclick")
        .attr({
          target: "_blank",
          href: $(data)
            .filter("script:last")
            .text()
            .match(/n\("(.+?)"/)[1],
        });
      alert("本课程已临时解除面部识别");
    },
    "html"
  );
}

function getSchoolId() {
  var school = /^1\d{10}$/.test(setting.username) ? "" : setting.school;
  if (!isNaN(school)) return setTimeout(toLogin, setting.time, school);
  if (school == "账号为手机号可以不修改此参数")
    return alert("请修改school参数");
  $.getJSON(
    "/org/searchUnis?filter=" + encodeURI(school) + "&product=44",
    function (data) {
      if (!data.result) return alert("学校查询错误");
      var msg = $.grep(data.froms, function (value) {
        return value.name == school;
      })[0];
      msg
        ? setTimeout(toLogin, setting.time, msg.schoolid)
        : alert("学校名称不完整");
    }
  );
}

function toLogin(fid) {
  GM_xmlhttpRequest({
    method: "GET",
    url:
      "/api/login?name=" +
      setting.username +
      "&pwd=" +
      setting.password +
      "&schoolid=" +
      fid +
      "&verify=0",
    onload: function (xhr) {
      var obj = $.parseJSON(xhr.responseText) || {};
      obj.result
        ? (location.href = decodeURIComponent($("#ref, #refer_0x001").val()))
        : alert(obj.errorMsg || "Error");
    },
  });
}
function submitAnswer() {
    console.log("提交答案");
    var data=[]
    data = data.length ? $(data) : $('.TiMu').map(function() {
        var title = filterImg($('.Zy_TItle .clearfix', this));
        return {
            question: title.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' '),
            type: ({单选题: 0, 多选题: 1, 填空题: 2, 判断题: 3})[title.match(/^【(.*?)】|$/)[1]]
        };
    });
 if(data[0].type==null){
    var a=new Array();
    var f=$('.Cy_TItle1')
    for(var i = 0;i<f.length;i++){
        var s = f.eq(i).find('h2').text().match(/\..*?题/)[0].replace('.','');
        var e = f.eq(i).find('h2').text().match(/共.*?题/)[0].replace('共','').replace('题','');
        for(var j = 0;j<e;j++){
           a.push(s);
        }
    }
    for(var k= 0;k<data.length;k++){
        switch(a[k]){
        case '单选题': data[k].type=0; break;
        case '多选题': data[k].type=1; break;
        case '填空题': data[k].type=2; break;
        case '判断题': data[k].type=3; break;
        case '简答题': data[k].type=10; break;
        case '计算题': data[k].type=10; break;
        }
    }
 }
    data = $.grep(data.map(function(index) {
        var $TiMu = $('.TiMu').eq(index);
        if (this.type == 2) {
            var $ans = $TiMu.find('.Py_tk, .Py_answer').eq(0);
            if (!$TiMu.find('.cuo').length && this.code) {
                return false;
            } else if (!$ans.find('.cuo').length) {
                this.option = $ans.find('.clearfix').map(function() {
                    return $(this).text().trim();
                }).get().join('#') || '无';
            } else if (this.code) {
                this.code = -1;
            } else {
                return false;
            }
        } else if (this.type == 3) {
            var o = $TiMu.find('.font20:last').text();
            if ($TiMu.find('.cuo').length) {
                this.option = ({'√': '错误', '×': '正确'})[o] || '无';
            } else if (!this.code) {
                this.option = ({'√': '正确', '×': '错误'})[o] || '无';
            } else {
                return false;
            }
        } else if (this.type == 10){
             var t =filterImg($TiMu.find('.font14'), this).match(/正确答案：.*?我的答案/)[0].replace('正确答案：','').replace('我的答案','').replace(/(^\s*)|(\s*$)/g, "");
            var p =filterImg($TiMu.find('.pingyu'), this);
            if(t==''){
                return false;
            } else{
                this.answer=t;
                this.key=p;
            }
        }
        else {
            var text = $TiMu.find('.Py_answer > span:eq(0)').text();
            if ($TiMu.find('.dui').length && this.code && !/^A?B?C?D?E?F?G?$/.test(this.option)) {
                return false;
            } else if ($TiMu.find('.dui').length || text.match('正确答案')) {
                text = text.match(/[A-G]/gi) || [];
                this.answer = $.map(text, function(value) {
                    return filterImg($TiMu.find('.fl:contains(' + value + ') + a'));
                }).join('#') || '无';
                this.answersheet=$.map(['A','B','C','D','E','F','G'].slice(0,['A','B','C','D','E','F','G'].findIndex((n)=>n==$TiMu.find('.Zy_ulTop>li:last').text().match(/[A-G]/gi)[0])+1), function(value) {
                    return filterImg($TiMu.find('.fl:contains(' + value + ') + a'));
                }).join('#') || '无';
                this.key = text.join('');
            } else {
                return false;
            }
        }
        return this;
    }), function(value) {
        if(value.answer=='无'){
            value.answer='';
        }
        return value /*&& value.answer != '无'*/;
    });
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1>span:first').text().trim() || '无';
    console.log(setting.curs)
    data.length && submitbefore(setting.curs,JSON.stringify(data))
    console.log(data);
}
function submitbefore(course,data){
    GM_xmlhttpRequest({
        method: 'POST',
        url: api_upload[0],
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent(course) + '&data=' + encodeURIComponent(data),
        onerror: function(e) {console.log(e)},
        onload: function(xhr){
            console.log(xhr);
            if(xhr.status==200){
                let response = xhr.responseText;
                let respdata = $.parseJSON(response);
                let amount=respdata.amount;
                let total=respdata.total;
                let msg=respdata.msg?respdata.msg:"";
                $("body").append("<div class='container' style='border:1px;border-radius:4px;position: fixed;width: 330px;height:200px;top:20px;right:20px;background-color:rgba(70, 196, 38, 0.6);z-index:9999;font-size: medium;padding:20px;'>感谢您提供的"+total+"道题目。<br>当前题库收录数目:"+amount+"道<br>"+msg+"</div>");
            }
        },
    })
}
function filterImg(dom) {
  return $(dom)
    .clone()
    .find("img[src]")
    .replaceWith(function () {
      return $("<p></p>").text('<img src="' + $(this).attr("src") + '">');
    })
    .end()
    .find("iframe[src]")
    .replaceWith(function () {
      return $("<p></p>").text(
        '<iframe src="' + $(this).attr("src") + '"></irame>'
      );
    })
    .end()
    .text()
    .trim();
}
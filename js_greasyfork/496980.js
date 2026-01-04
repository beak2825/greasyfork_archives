// ==UserScript==
// @name         支持支持【智慧树、中国大学mooc、慕课、国开、学习通、知到、国家开放大学、职教云、继续教育类】
// @namespace    qhyzsc  
// @version      4.0.1.3
// @description  【💚已完美兼容、智慧树、中国大学mooc、慕课、雨课堂、新国开、超星、学习通、知到、国家开放大学、蓝墨云、职教云、智慧职教、云班课精品课、山东专技、西财在线剩余网站仅支持部分功能💚】【半兼容、绎通云、U校园、学堂在线】、【💚完美应付测试，全自动答题，一键完成所有资源学习（视频挨个刷时不存在滴）、视频倍速💚】 、【💚新增AI搜题、AI问答，定制化服务💚】、【💚破除网站不可复制文字💚】、【💚基于生成式AI(ChatGPT)的答案生成💚】、【💚新增背题模式（遮挡答案，更好的进行考试复习）💚】、【特别感谢MeTo题库免费提供题目搜索功能】【💚作者在此保证，脚本无任何诸如（手机号，学校信息，等隐私信息）收集💚】
// @author      qhyzsc  
// @match        *://*.zhihuishu.com/*
// @connect      api.902000.xyz
// @connect      report.902000.xyz
// @connect      mooc1.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      mooc2-ans.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      stat2-ans.chaoxing.com
// @connect      passport2.chaoxing.com
// @connect      zhibo.chaoxing.com
//----------------------------------------
// @connect      mooc1.hnust.edu.cn
// @connect      stat2-ans.hnust.edu.cn
// @connect      passport2.hnust.edu.cn
// @connect      zhibo.hnust.edu.cn
//----------------------------------------
// @connect      mooc1.hnsyu.net
// @connect      stat2-ans.hnsyu.net
// @connect      passport2.hnsyu.net
// @connect      zhibo.hnsyu.net
//----------------------------------------
// @connect      mooc1.gdhkmooc.com
// @connect      stat2-ans.gdhkmooc.com
// @connect      passport2.gdhkmooc.com
// @connect      zhibo.gdhkmooc.com
//----------------------------------------
// @connect      mooc1.zut.edu.cn
// @connect      stat2-ans.zut.edu.cn
// @connect      passport2.zut.edu.cn
// @connect      zhibo.zut.edu.cn
//----------------------------------------
// @connect      mooc1.wljx.hfut.edu.cn
// @connect      stat2-ans.wljx.hfut.edu.cn
// @connect      passport2.wljx.hfut.edu.cn
// @connect      zhibo.wljx.hfut.edu.cn
//----------------------------------------
// @connect      mooc1.hncj.edu.cn
// @connect      stat2-ans.hncj.edu.cn
// @connect      passport2.hncj.edu.cn
// @connect      zhibo.hncj.edu.cn
//----------------------------------------
// @connect      mooc1.qutjxjy.cn
// @connect      stat2-ans.qutjxjy.cn
// @connect      passport2.qutjxjy.cn
// @connect      zhibo.qutjxjy.cn
//----------------------------------------
// @connect      mooc1.jxjyzx.xust.edu.cn
// @connect      stat2-ans.jxjyzx.xust.edu.cn
// @connect      passport2.jxjyzx.xust.edu.cn
// @connect      zhibo.jxjyzx.xust.edu.cn
//----------------------------------------
// @connect      mooc1.xueyinonline.com
// @connect      stat2-ans.xueyinonline.com
// @connect      passport2.xueyinonline.com
// @connect      zhibo.xueyinonline.com
//----------------------------------------
// @connect      mooc1.cqrspx.cn
// @connect      stat2-ans.cqrspx.cn
// @connect      passport2.cqrspx.cn
// @connect      zhibo.cqrspx.cn
//----------------------------------------
// @connect      mooc1.ynny.cn
// @connect      stat2-ans.ynny.cn
// @connect      passport2.ynny.cn
// @connect      zhibo.ynny.cn
//----------------------------------------
// @connect      mooc1.cugbonline.cn
// @connect      stat2-ans.cugbonline.cn
// @connect      passport2.cugbonline.cn
// @connect      zhibo.cugbonline.cn
//----------------------------------------
// @connect      mooc1.xust.edu.cn
// @connect      stat2-ans.xust.edu.cn
// @connect      passport2.xust.edu.cn
// @connect      zhibo.xust.edu.cn
//----------------------------------------
// @connect      mooc1.xynu.edu.cn
// @connect      stat2-ans.xynu.edu.cn
// @connect      passport2.xynu.edu.cn
// @connect      zhibo.xynu.edu.cn
//----------------------------------------
// @connect      mooc1.hnvist.cn
// @connect      stat2-ans.hnvist.cn
// @connect      passport2.hnvist.cn
// @connect      zhibo.hnvist.cn
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @original-script https://greasyfork.org/en/scripts/380506
// @original-author wyn665817
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/496980/%E6%94%AF%E6%8C%81%E6%94%AF%E6%8C%81%E3%80%90%E6%99%BA%E6%85%A7%E6%A0%91%E3%80%81%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc%E3%80%81%E6%85%95%E8%AF%BE%E3%80%81%E5%9B%BD%E5%BC%80%E3%80%81%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%81%E7%9F%A5%E5%88%B0%E3%80%81%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%81%E8%81%8C%E6%95%99%E4%BA%91%E3%80%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B1%BB%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/496980/%E6%94%AF%E6%8C%81%E6%94%AF%E6%8C%81%E3%80%90%E6%99%BA%E6%85%A7%E6%A0%91%E3%80%81%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc%E3%80%81%E6%85%95%E8%AF%BE%E3%80%81%E5%9B%BD%E5%BC%80%E3%80%81%E5%AD%A6%E4%B9%A0%E9%80%9A%E3%80%81%E7%9F%A5%E5%88%B0%E3%80%81%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%81%E8%81%8C%E6%95%99%E4%BA%91%E3%80%81%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%B1%BB%E3%80%91.meta.js
// ==/UserScript==
 
// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 8E3 == 8000，科学记数法，表示毫秒数
    time: 8E3 // 默认响应速度为8秒，不建议小于5秒，减轻服务器响应压力
      // 1代表开启，0代表关闭
      ,video: 1 // 视频支持课程、见面课，默认开启
      ,work: 1 // 自动答题功能，支持章测试、考试，高准确率，默认开启
      ,jump: 1 // 自动切换视频，支持课程、见面课，默认开启
 
      // 仅开启video时，修改此处才会生效
      ,line: '流畅' // 视频播放的默认线路，可选参数：['高清', '流畅', '校内']，默认'流畅'
      ,vol: '0' // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
      ,speed: '1.5' // 进度统计速率，高倍率可以快速完成任务点，设定范围：(0,+∞)，默认'1.5'倍
      // 上方参数支持在页面改动，下方参数仅支持代码处修改
      ,que: 1 // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
      ,danmu: 0 // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭
      ,habit: '0' // 限制视频挂机时长，单位是分钟，如需挂机习惯分，可以修改参数为'30'，默认不限制
 
      // 仅开启work时，修改此处才会生效
      ,none: 0 // 无匹配答案时执行默认操作，默认关闭
      ,hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭
  },
  _self = unsafeWindow,
  url = location.pathname,
  $ = _self.jQuery,
  xhr = _self.XMLHttpRequest;
 
String.prototype.toCDB = function () {
  return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function (str) {
    return String.fromCharCode(str.charCodeAt(0) - 65248);
  }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};
 
// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
setting.queue = setting.curs = [];
 
if (!$) {}
else if (url.match('/videoList')) {
  $.tmDialog.alert({
    content: '2.X版本已取消支持旧版界面',
    title: '智慧树网课助手提示'
  });
}
else if (url == '/videoStudy.html') {
  setting.habit *= 6E4;
  setting.video && hookVideo(_self.vjsComponent, 1);
  setting.jump && setInterval(checkToNext, setting.time);
}
else if (url == '/portals_h5/2clearning.html') {
  setting.video && hookVideo(_self.vjsComponent, 2);
  setting.jump && setInterval(checkToNext, setting.time);
}
else if (url == '/live/vod_room.html') {
  setting.video && hookVideo(_self.vjsComponent);
  setting.jump && setInterval(checkToNext, setting.time, 1);
}
else if (location.hostname.match('examh5')) {
  setTimeout(relieveLimit, 100, document);
  if (location.hash.match(/dohomework|doexamination/) && setting.work) beforeFind();
  $(window).on('hashchange', function () {
    setting.work && location.reload();
  });
}
else if (url.match('/sourceLearning')) {
  var $tip = $('.source-file-item');
  setting.jump && setInterval(function () {
    if (!$('.settleOn .finish').length) return;
    $tip.slice($tip.index($('.settleOn')) + 1).not(':has(.finish)').eq(0).find('.file-name').click();
  }, setting.time);
}
else if (url == '/shareCourse/questionDetailPage') {
  setTimeout(relieveLimit, 100, document);
  $('textarea[oncut]').each(function () {
    setTimeout(relieveLimit, 100, this);
  });
}
 
function hookVideo(Hooks, tip) {
    // _self.PlayerUtil.debugMode = true;
    _self.vjsComponent = function() {
        var config = arguments[0],
            options = config.options,
            line = $.map(options.sourceSrc.lines, function(value) {
                return value.lineName.replace('标准', '高清');
            }),
            vol = setting.vol > 100 ? 100 : setting.vol,
            rate = tip == 3 ? [1, 1.25, 1.5, 2, 2.5, 3] : [1, 1.25, 1.5];
        vol = Math.round(vol) / 100;
        options.volume = vol > 0 ? vol : 0;
        options.autostart = true;
        setting.speed = setting.speed > 0 ? +setting.speed : 1;
        options.rate = $.inArray(setting.speed, rate) < 0 ? options.rate : setting.speed;
        tip && config.callback.playbackRate(setting.speed);
        options.chooseLine = $.inArray(setting.line, line) + 1 || options.chooseLine + 1;
        options.src = options.sourceSrc.lines[--options.chooseLine].lineUrl || options.src;
        if (!setting.danmu) {
            config.defOptions.control.danmuBtn = false;
            delete options.control.danmuBtn;
        }
        Hooks.apply(this, arguments);
        config.player.on('loadstart', function() {
            this.loop(true);
            this.play();
            $('.speedBox span').text('X ' + setting.speed);
        });
    };
    $(document).on('click', '.definiLines b', function() {
        setting.line = ({xiaonei: '校内', line1gq: '高清', line1bq: '流畅'})[this.classList[0]];
    }).on('mouseup click', function() {
        setting.vol = _self.PlayerStarter.playerArray[0].player.cache_.volume * 100;
    }).on('click', '.speedList div', function() {
        setting.speed = $(this).attr('rate');
    });
    if (tip != 1) return;
    setting.tip = setting.habit && setInterval(totalTime, setting.time);
    setInterval(doTest, 1E3);
    _self.XMLHttpRequest = setting.que ? function() {
        var ajax = new xhr(),
            open = ajax.open;
        ajax.open = function(method, url) {
            if (url.match('/loadVideoPointerInfo')) method = 'OPTIONS';
            return open.apply(this, arguments);
        };
        return ajax;
    } : xhr;
}
 
 
function totalTime() {
  var player = _self.PlayerStarter.playerArray[0].player;
  setting.habit -= player.paused() ? 0 : setting.time;
  if (setting.habit > 0) return;
  clearInterval(setting.tip);
  player.pause();
  $.getScript('//cdn.jsdelivr.net/gh/sentsin/layer/dist/layer.js', function () {
    _self.layer.open({
      content: '已达到挂机限制时间',
      title: '智慧树网课助手提示'
    });
  });
}
 
function checkToNext(tip) {
  var $tip = $('.video, .lessonItem');
  if ($('.current_play .time_icofinish').length) {
    $tip.slice($tip.index($('.current_play')) + 1).not(':has(.time_icofinish)').eq(0).click();
  }
  else if ($('.lessonItemActive .finish').length) {
    // _self.PlayerStarter.playerArray[0].callback.playerNext();
    $tip.slice($tip.index($('.lessonItemActive')) + 1).not(':has(.finish)').eq(0).click();
  }
  else if (tip) {
    $('.current_player:contains("100%") + li').click();
    // $('.finish_tishi').hasClass('disNo') || console.log('签到已完成');
  }
}
 
function doTest() {
  if (!$('.dialog-test').length) {}
  else if (setting.queue.length) {
    $(setting.queue.shift()).parent().click();
  }
  else if (!$('.answer').length) {
    $('.topic-item').eq(0).click();
  }
  else if ($('.right').length) {
    $('.dialog-test .btn').click();
    _self.PlayerStarter.playerArray[0].player.play();
  }
  else {
    var tip = $('.answer span').text().match(/[A-Z]/g) || [];
    if (tip.length == 1) return $('.topic-option-item:contains(' + tip[0] + ')').click();
    $('.topic-option-item').each(function () {
      $.inArray($(this).text().slice(0, 1), tip) < 0 == $(this).hasClass('active') && setting.queue.push(this);
    });
  }
}
 
function relieveLimit(doc) {
  if (!doc.oncut && !doc.onselectstart) return setTimeout(relieveLimit, 100, doc);
  doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;
}
 
function beforeFind() {
  _self.XMLHttpRequest = function () {
    var ajax = new xhr();
    ajax.onload = function (e) {
      if (this.status != 200 || !this.responseURL.match(/doHomework|doExam/)) return;
      var obj = JSON.parse(this.responseText);
      collectData(obj.rt.examBase);
    };
    return ajax;
  };
  setting.div = $(
    '<div style="border: 2px dashed rgba(181,216,251,0.7); width: 330px; position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgba(181,216,251,0.6); overflow-x: auto;">' +
    '<span style="font-size: medium;"></span>' +
    '<div style="font-size: medium;">正在搜索答案...</div>' +
    '<button style="margin-right: 10px;">暂停答题</button>' +
    '<button style="margin-right: 10px;">重新查询</button>' +
    '<button style="margin-right: 10px;">折叠面板</button>' +
    '<button style="display: none;">未作答题目</button>' +
    '<form style="margin: 2px 0;">' +
    '<label style="font-weight: bold; color: red;">自定义答题范围：</label>' +
    '<input name="num" type="number" min="1" placeholder="开始" style="width: 60px;" disabled>' +
    '<span> ~ </span>' +
    '<input name="max" type="number" min="1" placeholder="结束" style="width: 60px;" disabled>' +
    '</form>' +
    '<div style="max-height: 300px; overflow-y: auto;">' +
    '<table border="1" style="font-size: 12px;">' +
    '<thead>' +
    '<tr>' +
    '<th style="width: 30px; min-width: 30px; font-weight: bold; text-align: center;">题号</th>' +
    '<th style="width: 60%; min-width: 130px; font-weight: bold; text-align: center;">题目（点击可复制）</th>' +
    '<th style="min-width: 130px; font-weight: bold; text-align: center;">答案（点击可复制）</th>' +
    '</tr>' +
    '</thead>' +
    '<tfoot style="display: none;">' +
    '<tr>' +
    '<th colspan="3" style="font-weight: bold; text-align: center;">答案提示框 已折叠</th>' +
    '</tr>' +
    '</tfoot>' +
    '<tbody>' +
    '<tr>' +
    '<td colspan="3" style="display: none;"></td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>' +
    '</div>'
  ).appendTo('body').on('click', 'button, td', function () {
    var len = $(this).prevAll('button').length;
    if (this.nodeName == 'TD') {
      $(this).prev().length && GM_setClipboard($(this).text());
    }
    else if (len === 0) {
      if (setting.loop) {
        clearInterval(setting.loop);
        delete setting.loop;
        len = [false, '已暂停搜索', '继续答题'];
      }
      else {
        setting.loop = setInterval(findAnswer, setting.time);
        len = [true, '正在搜索答案...', '暂停答题'];
      }
      setting.div.find('input').attr('disabled', len[0]);
      setting.div.children('div:eq(0)').html(function () {
        return $(this).data('html') || len[1];
      }).removeData('html');
      $(this).html(len[2]);
    }
    else if (len == 1) {
      location.reload();
    }
    else if (len == 2) {
      setting.div.find('tbody, tfoot').toggle();
    }
    else if (len == 3) {
      var $li = $('.el-scrollbar__wrap li'),
        $tip = $li.filter('.white, .yellow').eq(0);
      $tip.click().length ? setting.div.children('div:last').scrollTop(function () {
        var $tr = $('tbody tr', this).has('td:nth-child(1):contains(' + $tip.text() + ')');
        if (!$tr.length) return arguments[1];
        return $tr.offset().top - $tr.parents('table').offset().top; // $tr[0].offsetTop
      }) : $(this).hide();
    }
  }).on('change', 'input', function () {
    setting[this.name] = this.value.match(/^\d+$/) ? parseInt(this.value) - 1 : -1;
    if (!this.value) setting[this.name] = this.name == 'num' ? 0 : undefined;
  }).detach(setting.hide ? '*' : 'html');
  setting.type = {
    单选题: 1,
    多选题: 2,
    填空题: 3,
    问答题: 4,
    '分析题/解答题/计算题/证明题': 5,
    '阅读理解（选择）/完型填空': 9,
    判断题: 14
  };
  setting.lose = setting.num = setting.small = 0;
  $(document).keydown(function (event) {
    if (event.keyCode == 38) {
      setting.div.detach();
    }
    else if (event.keyCode == 40) {
      setting.div.appendTo('body');
    }
  });
  setting.loop = setInterval(findAnswer, setting.time, true);
  setInterval(function () {
    $(setting.queue.shift()).parent().click();
  }, 1E3);
}
 
function findAnswer(tip) {
  if (setting.queue.length) {
    return;
  }
  else if (tip && !$('.answerCard').length) {
    return setting.div.children('div:eq(0)').data('html', '非自动答题页面').siblings('button:eq(0)').click();
  }
  else if (setting.max < 0 || setting.num < 0) {
    return setting.div.children('div:eq(0)').data('html', '范围参数应为 <font color="red">正整数</font>').siblings('button:eq(0)').click();
  }
  else if (setting.num >= $('.subject_stem').length || setting.num > setting.max) {
    // setting.div.children('button:eq(3)').toggle(!!setting.lose);
    tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）' : '答题已完成';
    return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(0), form').hide().click();
  }
  else if (!setting.curs.length) {
    setting.curs = $('.infoList span').map(function () {
      return $(this).text().trim();
    });
    if (!setting.curs.length) return;
  }
  var $TiMu = $('.subject_stem').eq(setting.num).parent(),
    $dom = $TiMu.find('.smallStem_describe').eq(setting.small).children('div').slice(1, -1),
    question = filterStyle($dom) || filterStyle($TiMu.find('.subject_describe')),
    type = $TiMu.find('.subject_type').text().match(/【(.+)】|$/)[1];
  type = type ? setting.type[type] || 0 : -1;
  GM_xmlhttpRequest({
    method: 'POST',
    url: 'http://api.902000.xyz:88/wkapi.php',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: 'course=' + encodeURIComponent(setting.curs[0]) + '&chapter=' + encodeURIComponent(setting.curs[1]) + '&q=' + encodeURIComponent(question) + '&type=' + type,
    timeout: setting.time,
    onload: function (xhr) {
      if (!setting.loop) {}
      else if (xhr.status == 200) {
        var obj = $.parseJSON(xhr.responseText) || {};
        if (obj.answer) {
          setting.div.children('div:eq(0)').text('正在搜索答案...');
          var data = obj.answer.replace(/&/g, '&amp;').replace(/<([^i])/g, '&lt;$1');
          obj.answer = /^http/.test(data) ? '<img src="' + obj.answer + '">' : obj.answer;
          $(
            '<tr>' +
            '<td style="text-align: center;">' + $TiMu.find('.subject_num').text().trim().replace('.', '') + '</td>' +
            '<td title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
            '<td title="点击可复制">' + (/^http/.test(data) ? obj.answer : '') + data + '</td>' +
            '</tr>'
          ).appendTo(setting.div.find('tbody')).css('background-color', function () {
            $dom = $dom.length ? $dom.closest('.examPaper_subject') : $TiMu;
            if (fillAnswer($dom, obj, type)) return '';
            setting.div.children('button:eq(3)').show();
            return 'rgba(0,134,139, 0.6)';
          });
          setting.small = ++setting.small < $TiMu.find('.smallStem_describe').length ? setting.small : (setting.num++, 0);
        }
        else {
          setting.div.children('div:eq(0)').html(obj.data || '服务器繁忙，正在重试...');
        }
        setting.div.children('span').html(obj.msg || '');
      }
      else if (xhr.status == 403) {
        setting.div.children('div:eq(0)').data('html', '请求过于频繁，建议稍后再试').siblings('button:eq(0)').click();
      }
      else {
        setting.div.children('div:eq(0)').text('服务器异常，正在重试...');
      }
    },
    ontimeout: function () {
      setting.loop && setting.div.children('div:eq(0)').text('服务器超时，正在重试...');
    }
  });
}
 
function fillAnswer($TiMu, obj, type) {
  var $div = $TiMu.find('.nodeLab'),
    str = String(obj.answer).toCDB() || new Date().toString(),
    data = str.split(/#|\x01|\|/),
    state = setting.lose;
  // $div.find(':radio:checked').prop('checked', false);
  obj.code > 0 && $div.each(function () {
    var $input = $('input', this)[0],
      tip = filterStyle('.node_detail', this).toCDB() || new Date().toString();
    if (tip.match(/^(正确|是|对|√|T|ri)$/)) {
      data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push($input);
    }
    else if (tip.match(/^(错误|否|错|×|F|wr)$/)) {
      data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push($input);
    }
    else if (type == 2) {
      Boolean($.inArray(tip, data) + 1 || str.indexOf(tip) + 1) == $input.checked || setting.queue.push($input);
    }
    else {
      $.inArray(tip, data) + 1 && setting.queue.push($input);
    }
  });
  if (setting.queue.length) {}
  else if (/^(1|2|14)$/.test(type)) {
    var $input = $div.find('input');
    $input.is(':checked') || (setting.none ? setting.queue.push($input[Math.floor(Math.random() * $input.length)]) : setting.lose++);
  }
  else if (/^[3-5]$/.test(type)) {
    var $text = $TiMu.find('textarea');
    data = String(obj.data).split(/#|\x01|\|/);
    (obj.code > 0 && data.length == $text.length) || setting.none || setting.lose++;
    state == setting.lose && $text.each(function (index) {
      this.value = (obj.code > 0 && (data[index] || '').trim()) || '不会';
      // if (this.value == this._value) return true;
      this.dispatchEvent(new Event('input'));
      this.dispatchEvent(new Event('blur'));
    });
  }
  else {
    setting.none || setting.lose++;
  }
  return state == setting.lose;
}
 
function collectData(obj, data) {
  setting.data = data = {};
  data.id = obj.id;
  data.name = obj.name;
  data.course = obj.courseName;
  data.chapter = obj.toChapter || obj.explain;
  data.timu = [];
  $.each(obj.workExamParts, function () {
    $.each(this.questionDtos, function () {
      if (this.questionOptions) return pushData(this, data.timu);
      $.each(this.questionChildrens, function () {
        pushData(this, data.timu);
      });
    });
  });
  GM_xmlhttpRequest({
    method: 'POST',
    url: 'http://report.902000.xyz:88/report/zhs',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    data: 'data=' + encodeURIComponent(JSON.stringify(data))
  });
}
 
function pushData(obj, arr) {
  arr.push({
    id: obj.id,
    question: filterStyle('<p>' + obj.name + '</p>'),
    option: $.map(obj.questionOptions, function (val) {
      return filterStyle('<p>' + val.content + '</p>');
    }),
    key: $.map(obj.questionOptions, function (val) {
      return val.id;
    }).join(),
    type: obj.questionType.id
  });
}
 
  var $dom = $(dom, that).clone().find('style').remove().end();
  return $dom.find('img[src]').replaceWith(function () {
    return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
  }).end().text().trim();
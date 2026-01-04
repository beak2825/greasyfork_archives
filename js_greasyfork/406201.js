// ==UserScript==
// @name         (个人收录题库)cx考试
// @namespace    冷月长空
// @version      4.1.9
// @description  自动搜索尔雅MOOC考试答案，支持自动答题、自动切换题目、隐藏答案搜索提示框等，解除各类功能限制，开放自定义参数
// @author       冷月长空
// @match        *://*.chaoxing.com/exam/test*
// @match        *://*.edu.cn/exam/test*
// @run-at       document-end
// @connect      tk.lyck6.cn
// @connect      cx.lyck6.cn
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406201/%28%E4%B8%AA%E4%BA%BA%E6%94%B6%E5%BD%95%E9%A2%98%E5%BA%93%29cx%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/406201/%28%E4%B8%AA%E4%BA%BA%E6%94%B6%E5%BD%95%E9%A2%98%E5%BA%93%29cx%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 6E3 == 6000，科学记数法，表示毫秒数
    time: 6E3 // 默认响应速度为6秒，不建议小于6秒|后台检测机制，请求频繁会被封ip
    ,option: 1 //token用户是否使用token答题，1为开启，0为关闭，默认开启
    ,token: ''//捐助用户可以使用定制功能，更精准的匹配答案，此处填写捐助后获取的识别码

    // 1代表开启，0代表关闭
    ,none: 0 // 未找到答案或无匹配答案时执行默认操作，默认关闭
    ,jump: 0 // 答题完成后自动切换，默认开启
    ,copy: 0 // 自动复制答案到剪贴板，也可以通过手动点击按钮或答案进行复制，默认关闭

    // 非自动化操作
    ,hide: 1 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭
},
_self = unsafeWindow,
$ = _self.jQuery,
url = location.pathname,
UE = _self.UE;

if (url == '/exam/test/reVersionTestStartNew'){
String.prototype.toCDB = function() {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};
setting.TiMu = [
    filterImg('.Cy_TItle .clearfix').replace(/\s*（\d+\.\d+分）$/, ''),
    $('[name^=type]:not([id])').val() || '-1',
    $('.cur a').text().trim() || '无',
    $('li .clearfix').map(function() {
        return filterImg(this);
    })
];
setting.div = $(
    '<div style=" width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(0, 85, 68,0); overflow-x: auto;">' +
        '<span style="font-size: medium;"></span>' +
        '<div style="background: rgba(0, 85, 68,0);color: rgba(205, 205, 205,0);font-size: 15px;margin-bottom: 1%;">正在搜索</div>' +
       '<button  style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0.8);width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">暂停答题</button> ' +
     '<button style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0);width: 110px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;' + (setting.jump ? '' : ' display: none;') + '">点击停止本次切换</button>' +
        '<button  style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0);width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">重新查询</button> ' +
       '<button  style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0);width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">复制答案</button> ' +
       '<button  style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0);width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">答题详情</button> ' +
      '<button  style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0);width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">申请token</button> ' +
       '<button  style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0);width: 70px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">查询token</button> ' +
       '<button  style="background-color: rgba(0, 85, 68,0);/* Green */border: none;margin: 1%;color: rgba(205, 205, 205,0);width: 60px;height: 30px;text-align: center;text-decoration: none;display: inline-block;font-size: 10px;">收录脚本</button> ' +
        '<div style="max-height: 200px; overflow-y: auto;">' +
            '<table border="0" style="font-size: 16px;color: rgba(205, 205, 205,0.8)">' +
                '<thead>' +
                    '<tr>' +
                        '<th colspan="2">' + ($('#randomOptions').val() == 'false' ? '' : '<font color="rgba(205, 205, 205,0.4)">本次考试的选项为乱序 脚本会选择正确的选项</font>') + '</th>' +
                    '</tr>' +
                    '<tr>' +
                       // '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
                       // '<th style="min-width: 130px;">答案（点击可复制）</th>' +
                       //'<th style="min-width: 130px;">积分明细（剩余）</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="' + (setting.jump ? ' display: none;' : '') + '">' +
                    '<tr>' +
                        '<th colspan="0"></th>' +
                    '</tr>' +
                '</tfoot>' +
                '<tbody>' +
                    '<tr>' +
                        '<td colspan="2" style="display: none;"></td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
        '</div>' +
    '</div>'
).appendTo('body').on('click', 'button, td', function() {
    var num = setting.$btn.index(this);
    if (num == -1) {
        GM_setClipboard($(this).text());
    } else if (num === 0) {
        if (setting.loop) {
            clearInterval(setting.loop);
            delete setting.loop;
            num = ['已暂停搜索', '继续答题'];
        } else {
            setting.loop = setInterval(findTiMu, setting.time);
            num = ['正在搜索|防止失联建议加群1102188986' ,'暂停答题'];
        }
        setting.$div.html(function() {
            return $(this).data('html') || num[0];
        }).removeData('html');
        $(this).html(num[1]);
    } else if (num == 1) {
        setting.jump = 0;
        setting.$div.html(function() {
            return arguments[1].replace('即将切换下一题', '未开启自动切换');
        });
        setting.div.find('tfoot').add(this).toggle();
    } else if (num == 2) {
        location.reload();
    } else if (num == 3) {
        GM_setClipboard(setting.div.find('td:last').text());
    } else if (num == 4) {
        ($('.leftCard .saveYl')[0] || $()).click();
    } else if (num == 5) {
        window.open("http://lyck6.cn/zc");
    } else if (num == 6) {
        window.open("http://lyck6.cn/chaxun");
    }else if (num == 7) {
        window.open("http://sl.lyck6.cn");
    }
}).detach(setting.hide ? '*' : 'html');
setting.$btn = setting.div.children('button');
setting.$div = setting.div.children('div:eq(0)');
$(document).keydown(function(event) {
    if (event.keyCode == 38) {
        setting.div.detach();
    } else if (event.keyCode == 40) {
        setting.div.appendTo('body');
    }
});
if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
$.each(UE.instants, function() {
    var key = this.key;
    this.ready(function() {
        this.destroy();
        UE.getEditor(key);
    });
});
setting.loop = setInterval(findTiMu, setting.time);
}else if (url=='/exam/test/reVersionPaperMarkContentNew'){
   SubmitAnswer();
}
function findTiMu() {
    GM_xmlhttpRequest({
        method: 'POST',
        url: urloption(setting.token,setting.option),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data:'question=' + encodeURIComponent(setting.TiMu[0])+'&token='+(setting.token||0)+'&course=' + encodeURIComponent(setting.TiMu[2]) + '&type=' + setting.TiMu[1] + '&id=' + $('#paperId').val(),
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                if (obj.code) {
                   // setting.option && setting.token!=''?setting.div.children('div:eq(0)').text('正在搜索. . .当前积分剩余'+obj.num):setting.div.children('div:eq(0)').text('正在搜索|防止失联建议加群'+obj.qun);
                    var answer = String(obj.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;'),
                    que = setting.TiMu[0].match('<img') ? setting.TiMu[0] : setting.TiMu[0].replace(/&/g, '&amp;').replace(/</g, '&lt');
                    obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
                    setting.div.find('tbody').append(
                        '<tr>' +
                          //  '<td title="点击可复制">' + que + '</td>' +
                            '<td title="点击可复制">' + obj.answer + '</td>' +
                           //'<td title="积分剩余">' +obj.num + '</td>' +
                        '</tr>'
                    );
                    setting.copy && GM_setClipboard(obj.answer);
                    setting.$btn.eq(3).show();
                    fillAnswer(obj);
                } else {
                    setting.$div.html(obj.answer || '当前使用人数过多，服务器繁忙，正在重试...');
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                var html = xhr.responseText.indexOf('{') ? '由于你的请求过于频繁，您的ip已被封<br>如果你是本人操作建议加群1102188986<br>联系群主核实加白解封！' : $.parseJSON(xhr.responseText).data;
                setting.$div.data('html', html).siblings('button:eq(0)').click();
            }else if (xhr.status == 404) {
                var html5 = xhr.responseText.indexOf('{') ? '最新版本已发布！请点击油猴按钮【用户脚本检测更新】完成更新。' : $.parseJSON(xhr.responseText).data;
                setting.$div.data('html', html5).siblings('button:eq(0)').click();
            } else {
                setting.$div.text('服务器异常，正在重试...');
            }
        },
        ontimeout: function() {
            setting.loop && setting.$div.text('服务器超时，正在重试...');
        }
    });
}

function filterImg(dom) {
  return $(dom).clone().find("img[src]").replaceWith(function () {
      return $("<p></p>").text('<img src="' + $(this).attr("src") + '">');
    }).end().find("iframe[src]").replaceWith(function () {
      return $("<p></p>").text('<iframe src="' + $(this).attr("src") + '"></irame>');
    }).end().text().trim();
}

function SubmitAnswer(){
    var data=[]
    data = $('.TiMu').map(function() {
        var title = filterImg($('.Cy_TItle .clearfix', this));
        return {
            question: title.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/\s+/g, ' '),
            type: 0
        };
    });
    var list=new Array();
    var typelist =$('.Cy_TItle1')
    for(var i = 0;i<typelist.length;i++){
        var typechar = typelist.eq(i).find('h2').text().match(/(?<=、).*?题/)[0]
        var questionnum= typelist.eq(i).find('h2').text().match(/(?<=：).*?，/)[0].replace('，','')
        for(var j = 0;j<questionnum;j++){
           list.push(typechar)
        }
    }
    for(var k= 0;k<list.length;k++){
        switch(list[k]){
        case '单选题': data[k].type=0; break;
        case '多选题': data[k].type=1; break;
        case '填空题': data[k].type=2; break;
        case '判断题': data[k].type=3; break;
        case '简答题': data[k].type=10; break;
        case '计算题': data[k].type=10; break;
        }
    }
    data = $.grep(data.map(function(index) {
       var $TiMu = $('.TiMu').eq(index);
       if($('.CyTop1').text().replace(/\s+/g, '').indexOf('待批阅')!= -1){
           return false;
       }else if (this.type == 2) {
            var $ans = $TiMu.find('.Py_tk, .Py_answer').eq(0);
            if (($TiMu.find('.cuo').length || filterImg($TiMu.find('.font18'), this) == '0.0') && !filterImg($TiMu.find('.Py_tk'),this).match('正确答案')) {
                return false;
            } else if (filterImg($TiMu.find('.fl'),this).match(/\s*（\d+\.\d+分）/)[0].replace('分','').replace('（','').replace('）','') == filterImg($TiMu.find('.font18'), this) || $ans.find('.dui').length || filterImg($TiMu.find('.Py_tk'),this).match('正确答案')) {
                this.option = $ans.find('.font14').map(function() {
                    return filterImg($(this))
                }).get().join('#').replace(/(?<=#).*?空：\s/g,"").replace('正确答案#','').replace(/\s+/g, ' ').replace(/(^\s*)|(\s*$)/g, "").replace(/我的答案:#\s/g, '').replace(/#\s/g, '#').trim()
            } else {
                return false;
            }
        } else if (this.type == 3) {
            var an = $TiMu.find('.Py_answer > span:eq(0)').text().replace(/\s+/g,'');
            if (an.match('正确答案')) {
                this.option = ({'×': '错误', '√': '正确'})[an.replace('正确答案：','')];
            } else if (an.match('我的答案') && ($TiMu.find('.dui').length || filterImg($TiMu.find('.fl'),this).match(/\s*（\d+\.\d+分）$/)[0].replace('分','').replace('（','').replace('）','') == filterImg($TiMu.find('.font18'), this))) {
                this.option = ({'√': '正确', '×': '错误'})[an.replace('我的答案：','')];
            } else if (an.match('我的答案') && ($TiMu.find('.cuo').length || filterImg($TiMu.find('.font18'), this) == '0.0')) {
                this.option = ({'√': '错误', '×': '正确'})[an.replace('我的答案：','')];
            } else {
                return false;
            }
        } else if (this.type == 10){
            var da =filterImg($TiMu.find('.font14'), this).replace(/\s+/g, ' ').match(/(?<=正确答案).*?我的答案/)[0].replace('我的答案','').replace(/(^\s*)|(\s*$)/g, "")
            var jiexi =filterImg($TiMu.find('.pingyu'), this)
            if(da==''){
                return false
            } else{
                this.option=da
                this.key=jiexi
            }
        }else {
            var text = $TiMu.find('.Py_answer > span:eq(0)').text();
            if ($TiMu.find('.dui').length && this.code && !/^A?B?C?D?E?F?G?$/.test(this.option)) {
                return false;
            } else if ($TiMu.find('.dui').length || text.match('正确答案') || filterImg($TiMu.find('.fl'),this).match(/\s*（\d+\.\d+分）/)[0].replace('分','').replace('（','').replace('）','') == filterImg($TiMu.find('.font18'), this)) {
                text = text.match(/[A-G]/gi) || [];
                this.option = $.map(text, function(value) {
                    return filterImg($TiMu.find('.clearfix > a:eq('+({'A': '0', 'B': '1','C': '2','D': '3','E': '4','F': '5','G': '6'})[value]+')'));
                }).join('#') || '无';
                this.key = text.join('');
            }else {
                return false;
            }
        }
        return this;
    }), function(value) {
        return value
    });
    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://tk.lyck6.cn/token/api2.php' ,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent($('.cur a').text().trim() || '无')+ '&data=' + encodeURIComponent(JSON.stringify(data))+'&token='+setting.token
    });
}

function fillAnswer(obj, tip) {
    var $input = $(':radio, :checkbox', '.Cy_ulBottom'),
    str = String(obj.answer).toCDB() || new Date().toString(),
    data = str.split(/#|\x01|\|/),
    opt = obj.opt || str,
    btn = $('.saveYl:contains(下一题)').offset();
    obj.code > 0 && $input.each(function(index) {
        if (this.value == 'true') {
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/); //&& this.click();
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/);// && this.click();
        } else {
            index = setting.TiMu[3][index].toCDB() || new Date().toString();
            index = $.inArray(index, data) + 1 || (setting.TiMu[1] == '1' && str.indexOf(index) + 1);
            Boolean(index) == this.checked ;//|| this.click();
        }
    }).each(function() {
        if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
        Boolean(opt.match(this.value)) == this.checked;// || this.click();
    });
    if (setting.TiMu[1].match(/^[013]$/)) {
        tip = $input.is(':checked') || setting.none && (($input[Math.floor(Math.random() * $input.length)] || $()));//.click(), ' ');
    } else if (setting.TiMu[1].match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.answer).split(/#|\x01|\|/);
        tip = $('.Cy_ulTk textarea').each(function(index) {
            index = (obj.code > 0 && data[index]) || '';
            //UE.getEditor(this.name).setContent(index.trim());
        }).length;
        tip = (obj.code > 0 && data.length == tip) || setting.none && ' ';
        setting.len = str.length * setting.time / 10;
    }
    if (tip == ' ') {
        tip = '已执行默认操作';
    } else if (tip) {
        tip = '自动答题已完成';
    } else if (tip === undefined) {
        tip = '该题型不支持自动答题';
    } else {
        tip = '未找到有效答案';
    }
    if (btn) {
        tip += setting.jump ? '，即将切换下一题' : '，未开启自动切换';
        setInterval(function() {
            if (!setting.jump) return;
            var mouse = document.createEvent('MouseEvents'),
            arr = [btn.left + Math.ceil(Math.random() * 80), btn.top + Math.ceil(Math.random() * 26)];
            mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, arr[0], arr[1], false, false, false, false, 0, null);
            _self.event = $.extend(true, {}, mouse);
            delete _self.event.isTrusted;
            _self.getTheNextQuestion(1);
        }, setting.len || Math.ceil(setting.time * Math.random()) * 2);
    } else {
        setting.$btn.eq(1).hide();
        tip = '答题已完成，请自行查看答题详情';
    }
    setting.$div.data('html', tip).siblings('button:eq(0)').hide().click();
}

function urloption(token,option){
	if(option && token!='' ){
		var urlkey='http://tk.lyck6.cn/token/newapi1.php';
	}else{
		urlkey='http://cx.lyck6.cn/api/newapi1.php';
	}
	return urlkey;
}
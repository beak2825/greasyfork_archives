// ==UserScript==
// @name         华医网自动进入答题，下一集
// @author        浩浩逆天
// @namespace      https://greasyfork.org/users/3128
// @version       2.1.3
// @description    打开视频播放页面后，自动播放视频，自动答题，自动下一个课程。切勿使用任何支持跳过视频的脚本，避免记录违规作弊，否则可能会记录不良诚信档案。
// @include        http://*.91huayi.com/course_ware/course_ware_cc.aspx?*
// @include        http://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @include        http://*.91huayi.com/pages/exam.aspx?*
// @include        http://*.91huayi.com/pages/exam_result.aspx?*
// @require      https://lib.baomitu.com/layer/2.3/layer.js
// @resource layerCSS https://lib.baomitu.com/layer/3.1.1/theme/default/layer.css
// @homepage      https://greasyfork.org/zh-CN/scripts/403208
// @supportURL    https://greasyfork.org/zh-CN/scripts/403208/feedback
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_getResourceURL
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/423554/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E7%AD%94%E9%A2%98%EF%BC%8C%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/423554/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E7%AD%94%E9%A2%98%EF%BC%8C%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    //GM_deleteValue('setting')
    'use strict';
var updatenote='1、增加了设置功能，支持了【视频静音】、【跳过视频】（对公需课禁用）、【自动考试】等功能。可以按照自身的需要选择。<br>详细见设置按钮的内容。<br><b>跳过视频功能使用建议</b>：建议尽可能不使用该功能，该功能虽然能够完成学习，但是无法改变学习时长的记录。学习时长的记录在后台可查询，如果在一些严格审查的课程中使用，可能会遭到“记录不良诚信档案”的处罚，可能影响职称评定。';
    (function() {
        var s = document.createElement("link");
        s.href = GM_getResourceURL("layerCSS");
        s.rel = "stylesheet";
        document.body.appendChild(s);
    })();
    var u=unsafeWindow, $=u.$;
    var path = location.pathname;

    var UJS_Config=UJS_Setting();
    console.log(UJS_Config);

    var huayi={
        polyv : function(){
            var t=setInterval(function(){
                var oVideo = document.querySelector('video');
                if(oVideo) {
                    //console.warn('获取到视频对象：', oVideo);
                    clearInterval(t);
                    if(UJS_Config.VideoMute) document.querySelector('video').volume=0; //静音
                    if(UJS_Config.VideoNext) {
                        u.s2j_onPlayOver(); //完成学习
                        countDown('10', '秒后进入考试', '', function () {//进入考试
                            if($('#jrks').attr('href')!=='#') location.href=$('#jrks').attr('href');
                        });
                    }
                }
            }, 3000);
        },
        ccVideo: function () {
            var myid = u.prefix + u.vid;
            if(UJS_Config.cc.isStrict) isStrict=1; //进度条拖动控制， = 1 时可可拖动，= 0 不可拖动

            var myinter = setInterval(function () {
                var oVideo = getSWF(myid);
                if(oVideo) {
                    //console.warn('获取到视频对象：', oVideo);
                    window.clearInterval(myinter);
                    var old_custom_player_start = u.custom_player_start; //克隆开始事件
                    u.custom_player_start=function(){ //播放结束事件，自动跳到下一个视频
                        //old_custom_player_start();
                        if(UJS_Config.VideoMute) oVideo.setVolume(0);//静音视频
                        //if(UJS_Config.cc.VideoQuality) oVideo.setQuality(0); //切换低清晰度视频（节约资源）

                        if(UJS_Config.VideoSeek) {
                            if(!/2020年公需课/.test(document.title)) {
                                countDown(10, '秒后跳过视频，进入考试','', function(){
                                    getSWF(myid).seek(getSWF(myid).getDuration()-10);
                                })
                            }
                        }

                    }
                    var old_custom_player_stop = u.custom_player_stop; //克隆结束事件
                    u.custom_player_stop=function(){ //播放结束事件，自动进入考试
                        old_custom_player_stop();
                        if(UJS_Config.VideoNext) {
                            setTimeout(function () {
                                u.check_next_click();
                            }, 3000);
                        }
                    }
                }
            }, 3000);
        },
        doTest: function () {
            if(UJS_Config.Exam) {
                $('.five-stars').click(); //五星好评
                $('[id^="gvQuestion_result_"]').each(function(){ //#gvQuestion_result_0 隐藏 input 存放着正确答案，提取答案自动回答
                    var Question_result=$(this).val();
                    $('input[type="radio"][value="'+ Question_result +'"]').click();
                });
                var delay=parseInt(Math.random()*10+10); //生成随机作答时间，模拟作答
                countDown(delay, '\n秒后自动提交回答', '模拟作答过程', function(){
                    $('#btn_submit').click();
                });
            }
        },
        doResult: function () {
            if(UJS_Config.Exam) {
                var result = $("b").text(),
                    ExamBtn = document.querySelector('input[value="重新考试"]');
                if (result == "考试通过！") {
                    var next = document.querySelector(".two");
                    if (next) {
                        next.click();
                    }
                } else if(ExamBtn){ //考试没过
                    ExamBtn.click(); //重新考试
                }
            }
        }
    }

    switch(path){
        case '/course_ware/course_ware_polyv.aspx':
            huayi.polyv();
            break;
        case '/course_ware/course_ware_cc.aspx':
            huayi.ccVideo();
            break;
        case '/pages/exam.aspx': //考试
            huayi.doTest();
            break;
        case '/pages/exam_result.aspx': //考试结束，自动下一个课程
            huayi.doResult();
            break;
    }


    // Your code here...
    function countDown(second, content, title, delayFn, layerFn){
        layer.msg(content, {
            time : 0,
            title : title||'',
            //shade: 0.6,
            success: function(layero, index){
                var msg = layero.text();
                var msgbody = layero.find(".layui-layer-content");
                var i = second;
                var timer = null;
                var msgfn = function() {
                    msgbody.text(' ' + i + ' ' + content);
                    if(!i) {
                        layer.close(index);
                        clearInterval(timer);
                        delayFn();
                    }
                    i--;
                };
                timer = setInterval(msgfn, 1000);
                msgfn();
            },
        }, layerFn);
    }



    function UJS_Setting(){
        var Config={polyv:{}, cc:{isStrict:false}, Exam:true, VideoSeek:false, VideoMute:true, VideoNext:true, changyan:false, extension:{settingtips:false, updataTips:true, version: GM_info.script.version}},
            setting=GM_getValue('setting')||Config;
        if(typeof(GM_getValue('setting'))=='undefined') GM_setValue('setting', Config);

        $('<div id="UJS_Setting" style="text-align:center;">').attr({}).css({'font-size':'18px','width':'80px','height':'80px','line-height':'80px','position':'fixed','right':'18px','bottom':'18px','background':'#ccc','cursor':'pointer'}).text('设置').click(function(){
            settingUI(true);
        }).appendTo('body');

        GM_addStyle(`#OptionConfigUI>input[type="button"] {padding:5px 10px;font-size:18px;} #OptionConfigUI>input{margin:5px 0;}
#OptionConfigUI>fieldset {padding:5px 10px;}
`);

        if(!setting.extension.settingtips) {
            layer.tips('看看这里，华医网辅助脚本现在可以自行按需要设置功能', '#UJS_Setting', {time:30*1000, tipsMore: true});
        }
        if(setting.extension.version!==GM_info.script.version) {
            var l=layer.open({
                title:'华医网辅助工具 更新日志',
                area: '600px',
                content:'<style>.layui-layer-content{text-align:left;}</style><h2>脚本已更新到：'+GM_info.script.version+'</h2><br><h2>更新内容</h2><hr>'+updatenote,
                yes : function(index, layero){
                    layer.close(index);
                    setting.extension.version=GM_info.script.version;
                    GM_setValue('setting', setting);
                }
            });
        }

        var com={
            init : function(e){
                if(setting.changyan) $('.evaluation').hide();
                if(setting.lybox) $('.ly_box').hide();
            }
        }

        var settingUI=function(ConfigChange){ //创建设置界面
            if(!document.querySelector('#OptionConfigUI')) {
                setting=GM_getValue('setting')||Config;
                var mainUI=$('<div style="border:solid #033fff 3px;width:550px;height:400px;position:fixed;left:25%;top:25%;padding:20px;background:#eeeeee;z-index:9;font-size:16px;line-height:24px;text-align:justify;z-index:999">').attr({'id':'OptionConfigUI'}).append(`
欢迎首次使用“华医网”辅助学习脚本，脚本程序为了提高学习速度而制作，在使用之前请先了解使用方法，如担忧加速学习的功能会影响职称考核，建议不要启用“自动跳过视频”功能。<p></p><style>#OptionConfigUI>input{padding:0 5px;}</style>
两种播放器对应两种学习网址：course_ware_cc 与 course_ware_polyv
<fieldset id="UI_polyv"><legend> polyv 播放器 </legend>暂无专用功能</fieldset>
<fieldset id="UI_cc"><legend> cc 播放器 </legend></fieldset>
`);
                var UIBox={
                    cc : {
                        isStrict:'<input type="checkbox" id="UI_cc_isStrict"><label for="UI_cc_isStrict">解除视频进度条拖动限制</label>',
                    },
                    VideoMute:'<input type="checkbox" id="UI_VideoMute"><label for="UI_VideoMute">自动静音播放视频</label>',
                    VideoSeek:'<input type="checkbox" id="UI_VideoSeek"><label for="UI_VideoSeek">自动跳过视频（秒看功能，默认不对2020年公需课生效）</label>',
                    VideoNext:'<input type="checkbox" id="UI_VideoNext"><label for="UI_VideoNext">自动进入考试/自动进入下一个视频</label>',
                    Exam:'<input type="checkbox" id="UI_Exam"><label for="UI_Exam">自动考试</label>',
                    changyan:'<input type="checkbox" id="UI_changyan"><label for="UI_changyan">屏蔽畅言评论区</label>',
                    lybox:'<input type="checkbox" id="UI_lybox"><label for="UI_lybox">屏蔽评论区（常见问题）</label>',
                }
                var UI_SaveBtn=$('<input type="button" id="UI_SaveBtn" value="保存">'),
                    UI_RecoveryBtn=$('<input type="button" id="UI_RecoveryBtn" value="恢复设置">'),
                    UI_CloseBtn=$('<input type="button" id="UI_CloseBtn" value="关闭">');

                var Event={
                    SaveBtn : function(){
                        if(setting.extension.settingtips==false) setting.extension.settingtips=true;

                        //配置回写
                        $('input[type="checkbox"][id^="UI_"]').each(function(e) {
                            var obj_id=this.id, setting_id=obj_id.replace(/^UI_/,'');

                            if(setting_id.indexOf('_')>-1) {
                                var setting_id_arr=setting_id.split('_');
                                setting[setting_id_arr[0]][setting_id_arr[1]]=this.checked;
                            } else {
                                setting[setting_id]=this.checked;
                            }
                        });

                        GM_setValue('setting', setting);
                        com.init();
                        Event.CloseBtn();
                    },
                    CloseBtn : function(){
                        mainUI.remove();
                    },
                    RecoveryBtn : function(){
                        GM_setValue('setting', Config);
                        com.init();
                        location.reload();
                    },
                    VideoSeekTips : function(e, s){
                        layer.confirm('视频跳过功能可以快速完成学习，但是无法改变学习时长的记录，如果单位审查学习时长，有可能会“记录诚信不良档案”，严重情况下可能会影响职称评定，你确定要开启该功能吗？',{icon: 7,title:'视频跳过功能警告！'}, function(index, layero){
                            layer.close(index);
                            console.log(e.target.checked=true);
                        });
                        e.preventDefault();
                    }
                }
                UI_SaveBtn.on('click', Event.SaveBtn);
                UI_RecoveryBtn.on('click', Event.RecoveryBtn);
                UI_CloseBtn.on('click', Event.CloseBtn);
                //$('body').append(mainUI.append(UI_VideoMute, '<br>', UI_VideoSeek, '<br>', UI_Exam, '<br>', UI_SaveBtn, UI_RecoveryBtn));
                //$('#UI_cc').append(UI_cc_isStrict);

                //创建界面选项
                $('body').append(mainUI);
                console.log(UIBox);
                for(var UIBox_e in UIBox){
                    //console.log(UIBox_e, UIBox[UIBox_e]);
                    if(typeof(UIBox[UIBox_e])=='object') {
                        for(var UIBox_f in UIBox[UIBox_e]){
                            console.log(UIBox[UIBox_e], UIBox_f, UIBox[UIBox_e][UIBox_f]);
                            $('#UI_'+UIBox_e).append(UIBox[UIBox_e][UIBox_f], '<br>');
                        }
                    } else {
                        mainUI.append(UIBox[UIBox_e], '<br>');
                    }
                }
                mainUI.append(UI_SaveBtn, UI_CloseBtn, UI_RecoveryBtn, '部分设置修改需要<span color="red">刷新</span>页面才会起作用');
                $('#UI_VideoSeek').on('click', Event.VideoSeekTips)

                //载入配置数据到界面
                for(var e in setting){
                    if(e=='extension') continue;
                    if(typeof(setting[e])=='object') {
                        for(var f in setting[e]) {
                            //console.log(e, f, setting[e][f]);
                            $('#UI_'+e+"_"+f).prop('checked', setting[e][f]);
                        }
                    } else {
                        //console.log(e, setting[e]);
                        $('#UI_'+e).prop('checked', setting[e]);
                        //console.log($('#UI_'+e));
                    }
                }
            }
        }

        com.init();
        UJS_Config=setting;

        return UJS_Config;
    }
})();
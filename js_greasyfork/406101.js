// ==UserScript==
// @name         墨灵音乐(自由音乐)播放器美化
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  隐藏赞赏提示、当前歌词显示为绿色、已播放歌词显示为灰色、快捷键显示更整洁、播放音乐时背景更换为对应封面、修改搜索源的文本、增加填写网易云ID时的提示并删除默认值
// @author       AN drew
// @match        https://music.qugeek.com/app/player
// @match        https://yinyue.qugeek.com/app/player
// @match        https://ziyouyinyue.com/app/player
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406101/%E5%A2%A8%E7%81%B5%E9%9F%B3%E4%B9%90%28%E8%87%AA%E7%94%B1%E9%9F%B3%E4%B9%90%29%E6%92%AD%E6%94%BE%E5%99%A8%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406101/%E5%A2%A8%E7%81%B5%E9%9F%B3%E4%B9%90%28%E8%87%AA%E7%94%B1%E9%9F%B3%E4%B9%90%29%E6%92%AD%E6%94%BE%E5%99%A8%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#layui-layer1").hide();
    $(".js_dialog").hide();

    $(".btn-desktop-shortcut-keys").click(function(){
        $(".layui-layer-content").html('<i class="fas fa-keyboard"></i><br> '+
                                               '<span>Ctrl+D：收藏墨灵音乐</span><br> '+
                                               '<span>Ctrl+Q：静音</span><br> '+
                                               '<span>Ctrl+M：下载歌词/歌曲</span><br> '+
                                               '<span>Ctrl+Z：切换播放顺序</span><br> '+
                                               '<span>Ctrl+X：搜索</span><br> '+
                                               '<span>Ctrl+<i class="fas fa-arrow-left"></i>：上一首</span><br> '+
                                               '<span>Ctrl+<i class="fas fa-arrow-right"></i>：下一首</span><br> '+
                                               '<span>Ctrl+B：设置</span><br>'+
                                               '<span>空格键：暂停</span><br> '+
                                               '<i class="layui-layer-TipsG layui-layer-TipsR"></i>');
    })

    setInterval(function(){

        $("#downloadDonate").hide();

        if( $("#music-cover").attr("src").indexOf("blob:")== -1)
        {
            $("body").removeAttr("style");
            $("#blur-img").attr("style","background-image:url('"+$("#music-cover").attr("src")+"');"+
                                'background-repeat: no-repeat;'+
                                'background-size: cover;'+
                                'background-position: 50%;'+
                                '-webkit-filter: blur(65px);'+
                                'filter: blur(65px);'+
                                'opacity: .6;'+
                                '-webkit-transform: translateZ(0);'+
                                'transform: translateZ(0);')
        }

        if($(".weui-half-screen-dialog__title").text().indexOf("选择来源") > -1)
        {
            $(".weui-picker__content").html('<div class="weui-picker__item">* → 咪咕</div>'+
                                            '<div class="weui-picker__item">@ → QQ音乐</div>'+
                                            '<div class="weui-picker__item">! → 网易云</div>'+
                                            '<div class="weui-picker__item"># → 酷狗/酷我</div>'+
                                            '<div class="weui-picker__item">$ → 虾米</div>')
        }

        if($(".layui-layer.layui-layer-page.layui-layer-prompt .layui-layer-input").length>0 && $(".layui-layer.layui-layer-page.layui-layer-prompt .layui-layer-input").attr("placeholder")==undefined)
        {
            if($("body").attr("data-weui-theme")=="light")
            {
                $(".layui-layer.layui-layer-page.layui-layer-prompt .layui-layer-input").attr("style","color:black");
            }
            else
            {
               $(".layui-layer.layui-layer-page.layui-layer-prompt .layui-layer-input").attr("style","color:white");
               $(".layui-layer-btn0").attr("style","border:1px solid #e6e6e6");
            }

            $(".layui-layer.layui-layer-page.layui-layer-prompt .layui-layer-input").removeAttr("value");
            $(".layui-layer.layui-layer-page.layui-layer-prompt .layui-layer-input").attr("placeholder","请输入您的网易云ID");
        }

        $(".lrc-item.lplaying").prevAll().attr("style","color:rgba(225, 225, 225, .4)");
        $(".lrc-item.lplaying").attr("style","color:#31c27c!important");
        $(".lrc-item.lplaying").nextAll().attr("style","color:rgba(225, 225, 225, .8)");
    },10);

})();
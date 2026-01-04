// ==UserScript==
// @name         U校园测试助手(听说无限播放音频+读写强力翻译)
// @namespace    http://tampermonkey.net/
// @version      3.1.8
// @description  U校园视听说测试中无限次数播放音频，读写测试中各种翻译。
// @author       Priate
// @match        *://uexercise.unipus.cn/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery.md5@1.0.2/index.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/401489/U%E6%A0%A1%E5%9B%AD%E6%B5%8B%E8%AF%95%E5%8A%A9%E6%89%8B%28%E5%90%AC%E8%AF%B4%E6%97%A0%E9%99%90%E6%92%AD%E6%94%BE%E9%9F%B3%E9%A2%91%2B%E8%AF%BB%E5%86%99%E5%BC%BA%E5%8A%9B%E7%BF%BB%E8%AF%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401489/U%E6%A0%A1%E5%9B%AD%E6%B5%8B%E8%AF%95%E5%8A%A9%E6%89%8B%28%E5%90%AC%E8%AF%B4%E6%97%A0%E9%99%90%E6%92%AD%E6%94%BE%E9%9F%B3%E9%A2%91%2B%E8%AF%BB%E5%86%99%E5%BC%BA%E5%8A%9B%E7%BF%BB%E8%AF%91%29.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const trans_appid = '20200420000425147'; //百度翻译开放平台上申请的APPID
    const trans_key = '3gAE6Z7ol4xHEm3fuHWp'; //百度翻译开放平台上申请的密钥

    //自定义设置，将参数设为0（或false）代表关闭该功能，1（或true）代表开启该功能
    const setting = {
        allow_multiple_play : 1,        //听力允许多次播放

        translate_option : 1,           //听力选项翻译

        composite_dictation : 1,        //复合式听写翻译段落

        long_reading : 1,               //长篇阅读翻译段落及选项

        reading_comprehension : 1,      //阅读理解翻译选项及段落

        select_word : 1,                //选词填空翻译选项及段落

        paragraph_translate : 1,        //段落翻译（中翻英）

        writing : 1,                    //写作翻译（中翻英）
    }

    setTimeout(function(){
        //听力允许多次播放
        setting.allow_multiple_play ? allow_multiple_play() : false;
        //听力选项翻译
        setting.translate_option ? translate_option() : false;
        //复合式听写功能辅助
        setting.composite_dictation ? composite_dictation() : false;
        //长篇阅读功能辅助
        setting.long_reading ? long_reading() : false;
        //阅读理解功能辅助
        setting.reading_comprehension ? reading_comprehension() : false;
        //选词填空功能辅助
        setting.select_word ? select_word() : false;
        //段落翻译功能辅助
        setting.paragraph_translate ? paragraph_translate() : false;
        //写作功能辅助
        setting.writing ? writing() : false;
        //设置样式
        set_style();
    }, 2000)


    //允许多次播放
    function allow_multiple_play(){

        $(".itest-hear-reslist").each(function () {
            $(this).mouseover(function (param) {
                $(this).removeClass('disabled-active');
            })
        });
        //添加音频audio标签
        $(".itest-hear-reslist").each(function () {
            var option_musics = $(this).children('span').text().match(/(http.*?\.mp3)/g);
            if(option_musics){
                var new_option_musics = []
                option_musics.forEach((item)=>{
                    if(new_option_musics.indexOf(item) === -1 && !item.match(/(http.*?question\.mp3)/g)){
                        new_option_musics.unshift(item);
                    }
                })
                var option_ques = $(this).parent().children('.itest-ques')[0];
                for(var option_music in new_option_musics){
                    option_ques.innerHTML = "<audio controls='controls' src='" + new_option_musics[option_music] + "'>您的浏览器不支持 audio 标签。</audio>" + option_ques.innerHTML;
                }
            }
        });


    }
    //复合式听写功能辅助
    function composite_dictation(){
        //为复合式听写添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "复合式听写"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.itest-ques').prepend("</br><button class='composite_dictation_btn'>翻译</br>内容</button>");
                })
            }
        })

        //为翻译内容按钮注册功能
        $(document).on("click",".composite_dictation_btn",function(){
            $(this).removeClass('composite_dictation_btn').addClass('composite_dictation_hide_btn').html("清空</br>翻译");
            var context_list = "";
            var re = new RegExp("[0-9][0-9]\\)","g");
            var re2 = new RegExp("\n","g");
            var re3 = new RegExp("<.*?>","g");
            $(this).next().next().find('span').children('div').each(function(){
                //将偶数的br替换为hr
                $(this).children('br:even').replaceWith('<hr>')
                context_list = $(this).html().split('<br>');
                $.each(context_list,function(index, value){
                    context_list[index] = value.replace(re, "（XXX）").replace(re2, " ").replace(re3, "") + '\n';
                })
            });
            for (var contents in context_list) {
                (function (contents, btn) {
                    setTimeout(function () {
                        var trans_salt = (new Date).getTime();
                        var trans_from = 'en';
                        var trans_to = 'zh';
                        var trans_str = trans_appid + context_list[contents] + trans_salt + trans_key;
                        var trans_sign = $.md5(trans_str);
                        $.ajax({
                            type: "post",
                            async: false,
                            url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                            dataType: "jsonp",
                            data: {
                                q: context_list[contents],
                                from: trans_from,
                                to: trans_to,
                                appid: trans_appid,
                                salt: trans_salt,
                                sign: trans_sign
                            },
                            success: function (data) {
                                var res_word = "";
                                if (data.error_code == "54003") {
                                    res_word = "<div style='color:red'>请求频率过快，请重试</div>";
                                }else if(data.error_code == "52003"){
                                    res_word = "<div style='color:red'>请检查您的appid是否正确，或服务是否开通</div>";
                                }else if(data.trans_result) {
                                    res_word = "<div style='color:blue'>" + data.trans_result[0].dst + "</div>";
                                }else if(data.error_code == "52001"){
                                    res_word = "<div style='color:red'>错误码：" + data.error_code + "</div>";
                                }else if(data.error_code){
                                    res_word = "<div style='color:red'>错误码：" + data.error_code + "</div>";
                                }

                                btn.next().next().find("span").children('div').each(function () {
                                    $($(this).children('br')[contents]).before(res_word);
                                });

                            },
                            error: function () {
                                alert('百度翻译接口测试失败，请检测appid和key！');
                            }
                        });
                    }, 1500 * contents);
                })(contents, $(this))
            }
        })

        //为翻译内容隐藏按钮注册功能
        $(document).on("click",".composite_dictation_hide_btn",function(){
            $(this).removeClass('composite_dictation_hide_btn').addClass('composite_dictation_btn').html("翻译<br>全文");
            $(this).next().next().find("div[style='text-align:justify']").each(function () {
                $.each($(this).children('hr'), function(index, value){
                    $(value).replaceWith('<br>');
                })
                $.each($(this).children('div'), function(index, value){
                    $(value).remove();
                })
            });
        })
    }

    //单选题选项翻译
    function translate_option(){

        //为短对话添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "短对话"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.nu').append("</br><button class='option_translate_btn'>翻译</br>选项</button>");
                })
            }
        })

        //为长对话添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "长对话"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.nu').append("</br><button class='option_translate_btn'>翻译</br>选项</button>");
                })
            }
        })
        //为短文理解添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "短文理解"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.nu').append("</br><button class='option_translate_btn'>翻译</br>选项</button>");
                })
            }
        })
        //为长文章添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "长文章"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.nu').append("</br><button class='option_translate_btn'>翻译</br>选项</button>");
                })
            }
        })

        //为听力选项翻译注册功能
        $(document).on("click",".option_translate_btn",function(){
            $(this).removeClass('option_translate_btn').addClass('option_hide_btn').html("清空</br>翻译")

            var context_list = "";
            $(this).parent().parent().parent().find('label').each(function () {
                context_list += $(this).text() + '\n';
            });

            var trans_salt = (new Date).getTime();
            var trans_from = 'en';
            var trans_to = 'zh';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var options = $(this).parent().parent().parent().children('.option')
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {
                    var res_word = [];
                    var str = "";
                    if (data.error_code == "54003") {
                        str = "</br><label style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求频率过快，请重试</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.error_code == "52003"){
                        str = "</br><label style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请检查您的appid是否正确，或服务是否开通</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.trans_result) {
                        data.trans_result.forEach(function(e){
                            res_word.push("</br><label style='color: blue;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + e.dst + "</label>")
                        })
                    }else if(data.error_code){
                        str = "</br><label style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;错误码：" + data.error_code + "，请于http://api.fanyi.baidu.com/doc/21核对。</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }

                    $.each(options, function(index, value){
                        $(value).append(res_word[index])
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        });

        //为听力选项隐藏按钮注册功能
        $(document).on("click",".option_hide_btn",function(){
            $(this).removeClass('option_hide_btn').addClass('option_translate_btn').html("翻译</br>选项")
            $(this).parent().parent().parent().children('.option').each(function () {
                $.each($(this).children('label'), function(index, value){
                    if(index != 0){
                        $(value).remove();
                    }
                })
                $.each($(this).children('br'), function(index, value){
                    $(value).remove();
                })
            });
        });

    }

    //长篇阅读功能辅助
    function long_reading(){
        //为长篇阅读添加翻译按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "长篇阅读"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).prepend("<br><button class='long_reading_translate_btn'>翻译<br>全文</button>");
                    $(value).find('.con-right').before("<br><button class='long_reading_option_btn'>翻译<br>选项</button>");
                })
            }
        })

        //为长篇阅读翻译按钮注册功能
        $(document).on("click",".long_reading_translate_btn",function(){
            $(this).removeClass('long_reading_translate_btn').addClass('long_reading_hide_btn').html("清空<br>翻译");
            var context_list = [];
            $(this).next().find("div[style='text-align:justify']").each(function () {
                //将偶数的br替换为hr
                $(this).children('br:even').replaceWith('<hr>')
                context_list = $(this).html().split('<br>');
                var re = new RegExp("\n","g");
                $.each(context_list,function(index, value){
                    context_list[index] = value.replace(re, " ");
                })

            });
            for (var contents in context_list) {
                (function (contents, btn) {
                    setTimeout(function () {
                        var trans_salt = (new Date).getTime();
                        var trans_from = 'en';
                        var trans_to = 'zh';
                        var trans_str = trans_appid + context_list[contents] + trans_salt + trans_key;
                        var trans_sign = $.md5(trans_str);
                        $.ajax({
                            type: "post",
                            async: false,
                            url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                            dataType: "jsonp",
                            data: {
                                q: context_list[contents],
                                from: trans_from,
                                to: trans_to,
                                appid: trans_appid,
                                salt: trans_salt,
                                sign: trans_sign
                            },
                            success: function (data) {
                                var res_word = "";
                                if (data.error_code == "54003") {
                                    res_word = "<div style='color:red'>请求频率过快，请重试</div>";
                                }else if(data.error_code == "52003"){
                                    res_word = "<div style='color:red'>请检查您的appid是否正确，或服务是否开通</div>";
                                }else if(data.trans_result) {
                                    res_word = "<div style='color:blue'>" + data.trans_result[0].dst + "</div>";
                                }else if(data.error_code == "52001"){
                                    res_word = "<div style='color:red'>错误码：" + data.error_code + "</div>";
                                }else if(data.error_code){
                                    res_word = "<div style='color:red'>错误码：" + data.error_code + "</div>";
                                }
                                btn.next().find("div[style='text-align:justify']").each(function () {
                                    $($(this).children('br')[contents]).after(res_word);
                                    //解决最后一个的问题
                                    if($(this).children('br')[contents] == undefined){
                                        $(this).append(res_word);
                                    }
                                });

                            },
                            error: function () {
                                alert('百度翻译接口测试失败，请检测appid和key！');
                            }
                        });
                    }, 1500 * contents);
                })(contents, $(this))
            }
        })
        //为长篇阅读隐藏翻译按钮注册功能
        $(document).on("click",".long_reading_hide_btn",function(){
            $(this).removeClass('long_reading_hide_btn').addClass('long_reading_translate_btn').html("翻译<br>全文");
            $(this).next().find("div[style='text-align:justify']").each(function () {
                $.each($(this).children('hr'), function(index, value){
                    $(value).replaceWith('<br>');
                })
                $.each($(this).children('div'), function(index, value){
                    $(value).remove();
                })
            });
        })

        //为长篇阅读选项翻译注册功能
        $(document).on("click",".long_reading_option_btn",function(){
            $(this).removeClass('long_reading_option_btn').addClass('long_reading_option_hide_btn').html("清空</br>翻译")
            var context_list = "";
            $(this).next().find('span').each(function () {
                context_list += $(this).context.innerText + '\n';
            });

            var trans_salt = (new Date).getTime();
            var trans_from = 'en';
            var trans_to = 'zh';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var options = $(this).next().find('.option-head');
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {
                    var res_word = [];
                    var str = "";
                    if (data.error_code == "54003") {
                        str = "</br><label style='color: red;'>请求频率过快，请重试</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.error_code == "52003"){
                        str = "</br><label style='color: red;'>请检查您的appid是否正确，或服务是否开通</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.trans_result) {
                        data.trans_result.forEach(function(e){
                            res_word.push("</br><label style='color: blue;'>" + e.dst + "</label>")
                        })
                    }else if(data.error_code){
                        str = "</br><label style='color: red;'>错误码：" + data.error_code + "，请于http://api.fanyi.baidu.com/doc/21核对。</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }

                    $.each(options, function(index, value){
                        $(value).append(res_word[index])
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        });

        //为长篇阅读选项翻译隐藏按钮注册功能
        $(document).on("click",".long_reading_option_hide_btn",function(){
            $(this).removeClass('long_reading_option_hide_btn').addClass('long_reading_option_btn').html("翻译</br>选项")
            $(this).next().find(".option-head").each(function () {
                $.each($(this).find('label'), function(index, value){
                    $(value).remove();
                })
                $.each($(this).children('br:even'), function(index, value){
                    $(value).remove();
                })
            });
        });
    }

    //阅读理解功能辅助
    function reading_comprehension(){
        //为阅读理解添加翻译按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "阅读理解"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).prepend("<br><button class='reading_comprehension_translate_btn'>翻译<br>全文</button>");
                    $(value).find('.nu').append("</br><button class='reading_comprehension_option_btn'>翻译</br>选项</button>");
                })
            }
        })

        //为阅读理解翻译按钮注册功能
        $(document).on("click",".reading_comprehension_translate_btn",function(){
            $(this).removeClass('reading_comprehension_translate_btn').addClass('reading_comprehension_hide_btn').html("清空<br>翻译");
            var context_list = "";
            $(this).next().find(".article").each(function () {
                $(this).children('p').each(function(){
                    var re = new RegExp("\n","g");
                    var str = $(this).text().replace(re, "") + '\n';
                    context_list += str;
                })
            });

            var trans_salt = (new Date).getTime();
            var trans_from = 'en';
            var trans_to = 'zh';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var options = $(this).next().find('p[style="text-align:justify"]');
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {

                    var res_word = [];
                    var str = "";
                    if (data.error_code == "54003") {
                        str = "<label style='color: red;'>请求频率过快，请重试</label></br>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.error_code == "52003"){
                        str = "<label style='color: red;'>请检查您的appid是否正确，或服务是否开通</label></br>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.trans_result) {
                        data.trans_result.forEach(function(e){
                            res_word.push("<label style='color: blue;'>" + e.dst + "</label></br>")
                        })
                    }else if(data.error_code){
                        str = "<label style='color: red;'>错误码：" + data.error_code + "，请于http://api.fanyi.baidu.com/doc/21核对。</label></br>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }

                    $.each(options, function(index, value){
                        $(value).append(res_word[index])
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        })

        //为阅读理解隐藏按钮注册功能
        $(document).on("click",".reading_comprehension_hide_btn",function(){
            $(this).removeClass('reading_comprehension_hide_btn').addClass('reading_comprehension_translate_btn').html("翻译</br>选项")
            $(this).next().find('p[style="text-align:justify"]').each(function () {
                $.each($(this).find('label'), function(index, value){
                    $(value).remove();
                })
                $.each($(this).children('br:odd'), function(index, value){
                    $(value).remove();
                })
            });
        });

        //为阅读理解选项翻译注册功能
        $(document).on("click",".reading_comprehension_option_btn",function(){
            $(this).removeClass('reading_comprehension_option_btn').addClass('reading_comprehension_option_hide_btn').html("清空</br>翻译")
            var context_list = "";
            $(this).parent().parent().parent().find('label').each(function () {
                context_list += $(this).text() + '\n';
            });

            var trans_salt = (new Date).getTime();
            var trans_from = 'en';
            var trans_to = 'zh';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var options = $(this).parent().parent().parent().children('.option')
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {
                    var res_word = [];
                    var str = "";
                    if (data.error_code == "54003") {
                        str = "</br><label style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请求频率过快，请重试</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.error_code == "52003"){
                        str = "</br><label style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请检查您的appid是否正确，或服务是否开通</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.trans_result) {
                        data.trans_result.forEach(function(e){
                            res_word.push("</br><label style='color: blue;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + e.dst + "</label>")
                        })
                    }else if(data.error_code){
                        str = "</br><label style='color: red;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;错误码：" + data.error_code + "，请于http://api.fanyi.baidu.com/doc/21核对。</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }

                    $.each(options, function(index, value){
                        $(value).append(res_word[index])
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        });

        //为听力选项隐藏按钮注册功能
        $(document).on("click",".reading_comprehension_option_hide_btn",function(){
            $(this).removeClass('reading_comprehension_option_hide_btn').addClass('reading_comprehension_option_btn').html("翻译</br>选项")
            $(this).parent().parent().parent().children('.option').each(function () {
                $.each($(this).children('label'), function(index, value){
                    if(index != 0){
                        $(value).remove();
                    }
                })
                $.each($(this).children('br'), function(index, value){
                    $(value).remove();
                })
            });
        });
    }

    function set_style(){
        //设置样式
        $('.option_translate_btn').css({
            "background": "#FFCCCC",
            "cursor": "pointer",
        })
        $('.long_reading_translate_btn').css({
            "color": "#fff",
            "background": "#FFCCCC",
            "cursor": "pointer",
        })
        $('.long_reading_option_btn').css({
            "color": "#fff",
            "background": "#0066CC",
            "cursor": "pointer",
        })
        $('.reading_comprehension_translate_btn').css({
            "color": "#fff",
            "background": "#FF6666",
            "cursor": "pointer",
        })
        $('.reading_comprehension_option_btn').css({
            "color": "#fff",
            "background": "#003333",
            "cursor": "pointer",
        })
        $('.paragraph_translate_btn').css({
            "background": "#CCCCCC",
            "cursor": "pointer",
        })
        $('.select_word_content_btn').css({
            "background": "#66FF99",
            "cursor": "pointer",
        })
        $('.select_word_translate_btn').css({
            "background": "#CCFF00",
            "cursor": "pointer",
        })
        $('audio').css({
            "margin-left": "50px",
        })
    }

    //选词填空功能辅助
    function select_word(){
        //为选词填空添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "选词填空（15选10）"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.itest-15xuan10').prepend("<br><button class='select_word_translate_btn'>翻译单词</button>");
                    $(value).find('.xx').after("</br><button class='select_word_content_btn'>翻译内容</button>");
                })
            }
        })
        //为单词翻译注册功能
        $(document).on("click",".select_word_translate_btn",function(){
            $(this).removeClass('select_word_translate_btn').addClass('select_word_hide_btn').html("清空翻译")
            var context_list = "";
            $(this).next().find('a').each(function () {
                context_list += $(this).text() + '\n';
            });

            var trans_salt = (new Date).getTime();
            var trans_from = 'en';
            var trans_to = 'zh';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var options = $(this).next().find('li')
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {
                    var res_word = [];
                    var str = "";
                    if (data.error_code == "54003") {
                        str = "</br><label style='color: red;'>频率过快</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.error_code == "52003"){
                        str = "</br><label style='color: red;'>检查appid</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.trans_result) {
                        data.trans_result.forEach(function(e){
                            res_word.push("</br><label style='color: blue;'>" + e.dst + "</label>")
                        })
                    }else if(data.error_code){
                        str = "</br><label style='color: red;'>错误码：" + data.error_code + "</label>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }
                    $.each(options, function(index, value){
                        $(value).append(res_word[index])
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        });

        //为单词翻译隐藏按钮注册功能
        $(document).on("click",".select_word_hide_btn",function(){
            $(this).removeClass('select_word_hide_btn').addClass('select_word_translate_btn').html("翻译单词")
            $(this).next().find('li').each(function () {
                $.each($(this).children('label'), function(index, value){
                    $(value).remove();
                })
                $.each($(this).children('br'), function(index, value){
                    $(value).remove();
                })
            });
        });

        //为翻译内容按钮注册功能
        $(document).on("click",".select_word_content_btn",function(){
            $(this).removeClass('select_word_content_btn').addClass('select_word_content_hide_btn').html("清空翻译");
            var context_list = "";
            var re = new RegExp("[0-9][0-9]\\)","g");
            var re2 = new RegExp("\n","g");
            $(this).next().children('p[style="text-align:justify"]').each(function(){
                var str = $(this).text().replace(re, "（XXX）").replace(re2, " ") + '\n';
                context_list += str;
            });


            var trans_salt = (new Date).getTime();
            var trans_from = 'en';
            var trans_to = 'zh';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var options = $(this).next().find('p[style="text-align:justify"]');
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {
                    var res_word = [];
                    var str = "";
                    if (data.error_code == "54003") {
                        str = "<label style='color: red;'>请求频率过快，请重试</label></br>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.error_code == "52003"){
                        str = "<label style='color: red;'>请检查您的appid是否正确，或服务是否开通</label></br>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }else if(data.trans_result) {
                        data.trans_result.forEach(function(e){
                            res_word.push("<label style='color: blue;'>" + e.dst + "</label></br>")
                        })
                    }else if(data.error_code){
                        str = "<label style='color: red;'>错误码：" + data.error_code + "，请于http://api.fanyi.baidu.com/doc/21核对。</label></br>";
                        options.each(function(){
                            res_word.push(str);
                        })
                    }

                    $.each(options, function(index, value){
                        $(value).append(res_word[index])
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        })


        //为翻译内容隐藏按钮注册功能
        $(document).on("click",".select_word_content_hide_btn",function(){
            $(this).removeClass('select_word_content_hide_btn').addClass('select_word_content_btn').html("翻译内容")
            $(this).next().find('p[style="text-align:justify"]').each(function () {
                $.each($(this).children('label'), function(index, value){
                    $(value).remove();
                })
                $.each($(this).children('br:odd'), function(index, value){
                    $(value).remove();
                })
            });
        });

    }
    //段落翻译功能辅助
    function paragraph_translate(){
        //为段落翻译添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "段落翻译"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.nu').append("</br><button class='paragraph_translate_btn'>翻译</br>全文</button>");
                })
            }
        })

        //为翻译全文按钮注册功能
        $(document).on("click",".paragraph_translate_btn",function(){
            $(this).removeClass('paragraph_translate_btn').addClass('paragraph_translate_hide_btn').html("清空</br>翻译");
            var context_list = "";
            var re = new RegExp("\\(.*?\\)","g");
            var re2 = new RegExp("（.*?）","g");
            var re3 = new RegExp("\n","g");
            $(this).parent().next().find('div[style="text-align:justify"]').each(function(){
                var str = $(this).text().replace(re, "").replace(re2, "").replace(re3, "") + '\n';
                context_list += str;
            });

            var trans_salt = (new Date).getTime();
            var trans_from = 'zh';
            var trans_to = 'en';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var textarea_trans = $(this).parent().parent().find('textarea');
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {
                    var res_word = "";
                    if (data.error_code == "54003") {
                        res_word = "请求频率过快，请重试";
                    }else if(data.error_code == "52003"){
                        res_word = "请检查您的appid是否正确，或服务是否开通";
                    }else if(data.trans_result) {
                        res_word = data.trans_result[0].dst;
                    }else if(data.error_code){
                        res_word = "错误码：" + data.error_code + "，请于http://api.fanyi.baidu.com/doc/21核对。";

                    }
                    $.each(textarea_trans, function(index, value){
                        $(value).val(res_word);
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        })
        //为清空翻译内容按钮注册功能
        $(document).on("click",".paragraph_translate_hide_btn",function(){
            $(this).removeClass('paragraph_translate_hide_btn').addClass('paragraph_translate_btn').html("翻译</br>全文")
            $(this).parent().parent().find('textarea').each(function () {
                $(this).val("");
            });
        });
    }

    //写作功能辅助
    function writing(){
        //为写作翻译添加按钮
        $.each($('.itest-section'), function(index, value){
            if($(value).attr('part1') == "写作"){
                $.each($(value).children('.itest-ques-set'), function(index, value){
                    $(value).find('.nu').append("<br><button class='writing_translate_btn'>中翻英</button>");
                    $(value).find('textarea').val("清空该行，在此处输入中文后点击「中翻英」按钮即可翻译");
                })
            }
        })

        //为写作翻译按钮注册功能
        $(document).on("click",".writing_translate_btn",function(){
            var context_list = "";
            var re = new RegExp("\n","g");
            $(this).parent().parent().find('textarea').each(function(){
                var str = $(this).val() + '\n';
                context_list += str;
            });

            var trans_salt = (new Date).getTime();
            var trans_from = 'zh';
            var trans_to = 'en';
            var trans_str = trans_appid + context_list + trans_salt + trans_key;
            var trans_sign = $.md5(trans_str);
            var textarea_trans = $(this).parent().parent().find('textarea');
            $.ajax({
                type: "post",
                async: false,
                url: "https://api.fanyi.baidu.com/api/trans/vip/translate",
                dataType: "jsonp",
                data: {
                    q: context_list,
                    from: trans_from,
                    to: trans_to,
                    appid: trans_appid,
                    salt: trans_salt,
                    sign: trans_sign
                },
                success: function (data) {
                    var res_word = [];
                    if (data.error_code == "54003") {
                        res_word.push("请求频率过快，请重试");
                    }else if(data.error_code == "52003"){
                        res_word.push("请检查您的appid是否正确，或服务是否开通");
                    }else if(data.trans_result) {
                        data.trans_result.forEach(function(e){
                            res_word.push(e.dst);
                        })
                    }else if(data.error_code){
                        res_word.push("错误码：" + data.error_code + "，请于http://api.fanyi.baidu.com/doc/21核对。");
                    }
                    $.each(textarea_trans, function(index, value){
                        $(value).val('');
                        res_word.forEach(function(e){
                            var str = $(value).val() + '\n' + e;
                            $(value).val(str)
                        })
                    })
                },
                error: function () {
                    alert('百度翻译接口测试失败，请检测appid和key！');
                }
            });
        })

    }

})();
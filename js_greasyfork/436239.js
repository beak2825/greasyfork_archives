// ==UserScript==
// @name         M2O Plus Enhancer
// @namespace    https://imewchen.com/
// @version      0.1.0
// @description  Enhance M2O Plus For JGJT.
// @author       MewChen
// @match        http*://m2o.m2o-demo.hoge.cn/main/app/content/news?*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      BSD
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436239/M2O%20Plus%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/436239/M2O%20Plus%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // style
    var htmlStyle = '<style>';
    //滚动条
    htmlStyle += '::-webkit-scrollbar{display: none;}';
    // 边框
    htmlStyle += '.m2oenh-btn_container{position: fixed;right: 60px;top: 120px;width: 260px;height: auto;min-height: 200px;box-shadow: 0 0 0.18rem 0 rgb(133 141 154 / 21%);background-color: #fff;padding: 18px;border-radius: 5px;display: flex;align-items: center;text-align: center;flex-wrap: wrap;justify-content: space-between;}';
    //按钮
    htmlStyle += '.m2oenh-btn{color: #fff;text-align: center;box-shadow: 0 0.1rem 0.3rem 0 rgb(0 165 235 / 30%);padding: 8px 16px;border: none;outline: none;width: 96px;}.m2oenh-btn_main{background: -webkit-linear-gradient(310deg, rgba(77, 169, 249, 1) 0, rgba(35, 122, 237, 1) 100%);background: linear-gradient(140deg, rgba(77, 169, 249, 1) 0, rgba(35, 122, 237, 1) 100%);}.m2oenh-btn_white{background-color: #fff;color: #000}.m2oenh-btn_close{background-color: #ff4545;color: #000;width: 60px;height: 40px;font-size: 18px;color: #fff;float: right;border-radius: 0;padding: 0;}';
    // 预览外框
    htmlStyle += '.m2oenh-preview_container{position: fixed;z-index: 99999;top: 0;right: 0;left: 0;bottom: 0;width: 100%;background: rgba(0,0,0,0.6);overflow: hidden;}.m2oenh-preview_container *{box-sizing: border-box;}';
    // 预览主体
    htmlStyle += '.m2oenh-preview_news{width: 375px;height: 812px;background-color: #fff;overflow: hidden;top: 50%;position: absolute;left: 50%;margin-top: -406px;margin-left: -187.5px;}.m2oenh-preview_news__head{height: 40px;line-height: 40px;font-size: 18px;box-shadow: 0 0 0.18rem 0 rgb(133 141 154 / 21%);}.m2oenh-preview_news__head p{margin-left: 15px;float: left;}.m2oenh-preview_news__body{width: 100%;height: 100%;overflow-x: hidden;overflow-y: auto;font-size: 16px;font-family: \'Noto Serif SC\', -apple-system-font, sans-serif;line-height: 1.8;letter-spacing: 1px;padding: 15px;margin-bottom: 15px;}.m2oenh-preview_news__body img{width: 100%;text-align: center;}';
    // sweetalert2
    htmlStyle += '.swal2-title{font-size: 20px !important;}'
    htmlStyle += '</style>';
    $('head').append(htmlStyle);

    // add button
    var htmlM2OEnhancedContainer = '<div class="m2oenh-btn_container">%code%</div>';
    var btnCheck = '<button id="checkHtml" class="m2oenh-btn m2oenh-btn_main">检查</button>';
    var btnPreview = '<button id="previewHtml" class="m2oenh-btn m2oenh-btn_main" style="margin-left:8px">预览</button>';
    //
    var btnClearStyle = '<button id="clearStyle" class="m2oenh-btn m2oenh-btn_main">清除格式</button>';

    htmlM2OEnhancedContainer = htmlM2OEnhancedContainer.replace('%code%', btnCheck + btnPreview + '<br/>' + btnClearStyle);

    $('body').append(htmlM2OEnhancedContainer);

    // functions
    //检查中文内容
    $('body').on('click', '#checkHtml', function () {
        var content = $("#ueditor_0").contents().find("body").text();
        var content_html = $("#ueditor_0").contents().find("body").html();

        var has_error = false;

        // 党史学习活动
        var regexp_1 = /党史.*?活动/i;
        var chk_1 = content.match(regexp_1);

        if (chk_1) {
            has_error = true;
            var result_text = chk_1[0];
            if (result_text.length > 14) {
                swalert('党史学习后面不应该有<span style="color:red">活动</span>两个字。有检测到关键字，但“党史”和“活动”中间间隔超过10个字符。请自行检查是否正确。', 'info');
            } else {
                content_html = content_html.replace(result_text, '<span style="color:red">' + result_text + '</span>');
                $("#ueditor_0").contents().find("body").html(content_html);
                //
                swalert('党史学习后面不应该有<span style="color:red">活动</span>两个字。', 'error');
                return false;
            }
        }

        // 习近平通知为核心
        var regexp_2 = /以习近平.*?为核心/i;
        var chk_2 = content.match(regexp_2);

        if (chk_2) {
            has_error = true;
            var result_text = chk_2[0];
            if (result_text != '以习近平同志为核心') {
                content_html = content_html.replace(result_text, '<span style="color:red">' + result_text + '</span>');
                $("#ueditor_0").contents().find("body").html(content_html);
                //
                swalert('以习近平同志为核心，必须使用<b>同志</b>一词。当前表述为：<span style="color:red">' + result_text + '</span>', 'error');
                return false;
            }
        }

        // 隆重召开
        var regexp_3 = /隆重召开/i;
        var chk_3 = content.match(regexp_3);

        if (chk_3) {
            has_error = true;
            var result_text = chk_3[0];
            swalert('除了党中央国务院召开的重要会议外，一般性会议不用<span style="color:red">隆重召开</span>字眼。请自行检查是否正确。', 'info');
        }

        // 八荣八耻
        var regexp_4 = /践行.*?八荣八耻/i;
        var chk_4 = content.match(regexp_4);

        if (chk_4) {
            has_error = true;
            var result_text = chk_4[0];
            if (result_text.length > 14) {
                swalert('不使用<span style="color:red">践行“八荣八耻”</span>的讲法，应该表述为<b>践行社会主义荣辱观</b>。有检测到关键字，但“践行”和“八荣八耻”中间间隔超过10个字符。请自行检查是否正确。', 'info');
            } else {
                content_html = content_html.replace(result_text, '<span style="color:red">' + result_text + '</span>');
                $("#ueditor_0").contents().find("body").html(content_html);
                //
                swalert('不使用<span style="color:red">践行“八荣八耻”</span>的讲法，应该表述为<b>践行社会主义荣辱观</b>。', 'error');
                return false;
            }
        }

        // 中共xx省委书记
        var regexp_5 = /省省委书记|市市委书记|区区委|县县委/i;
        var chk_5 = content.match(regexp_5);

        if (chk_5) {
            has_error = true;
            var result_text = chk_5[0];
            content_html = content_html.replace(result_text, '<span style="color:red">' + result_text + '</span>');
            $("#ueditor_0").contents().find("body").html(content_html);
            //
            swalert('不宜称<span style="color:red">中共XX省省委书记</span>，应称<b>中共XX省委书记</b>。', 'error');
            return false;
        }

        // 中共xx省委书记
        var regexp_6 = /检察院院长/i;
        var chk_6 = content.match(regexp_6);

        if (chk_6) {
            has_error = true;
            var result_text = chk_6[0];
            content_html = content_html.replace(result_text, '<span style="color:red">' + result_text + '</span>');
            $("#ueditor_0").contents().find("body").html(content_html);
            //
            swalert('各级检察院的<b>检察长</b>不要写成<span style="color:red">检察院院长</span>。', 'error');
            return false;
        }

        // 中华人民共和国成立前(后)
        var regexp_7 = /解放前|解放后|新中国成立前|新中国成立后/i;
        var chk_7 = content.match(regexp_7);

        if (chk_7) {
            has_error = true;
            var result_text = chk_7[0];
            content_html = content_html.replace(result_text, '<span style="color:red">' + result_text + '</span>');
            $("#ueditor_0").contents().find("body").html(content_html);
            //
            swalert('一般不用<span style="color:red">解放前(后)</span>或<span style="color:red">新中国成立前(后)</span>提法，使用<b>中华人民共和国成立前(后)</b>或<b>一九四九年前(后)</b>提法。', 'error');
            return false;
        }

        // 一带一路 倡议
        var regexp_8 = /一带一路.*?战略/i;
        var chk_8 = content.match(regexp_8);

        if (chk_8) {
            has_error = true;
            var result_text = chk_8[0];
            if (result_text.length > 14) {
                swalert('不使用<span style="color:red">“一带一路”战略</span>的提法，应该表述为<b>“一带一路”倡议</b>。有检测到关键字，但“一带一路”和“战略”中间间隔超过10个字符。请自行检查是否正确。', 'info');
            } else {
                content_html = content_html.replace(result_text, '<span style="color:red">' + result_text + '</span>');
                $("#ueditor_0").contents().find("body").html(content_html);
                //
                swalert('不使用<span style="color:red">“一带一路”战略</span>的提法，应该表述为<b>“一带一路”倡议</b>。', 'error');
                return false;
            }
        }

        // 内地
        var regexp_9 = /内地/i;
        var chk_9 = content.match(regexp_9);

        if (chk_9) {
            has_error = true;
            var result_text = chk_9[0];
            swalert('涉疆涉藏的报道，不得使用<span style="color:red">内地</span>的表述。请自行检查是否正确。', 'info');
        }

        // 习近平总书记
        var regexp_10 = /习近平/i;
        var chk_10 = content.match(regexp_10);

        if (chk_10) {
            has_error = true;

            var tmp_content = content_html;

            var regexp_10_1 = /习近平同志/i;
            var regexp_10_2 = /习近平总书记/i;
            var regexp_10_3 = /总书记习近平/i;

            while (tmp_content.match(regexp_10)) {
                var s0 = tmp_content.search(regexp_10);
                console.log('s0: ', s0);
                var s1 = tmp_content.search(regexp_10_1);
                var s2 = tmp_content.search(regexp_10_2);
                var s3 = tmp_content.search(regexp_10_3);
                s3 += 3;    //补3个字的距离
                console.log('s3: ', s3);
                if (s0 != s1 && s0 != s2 && s0 != s3) {
                    content_html = content_html.replace2('习近平', '<span style="color:red">习近平</span>', s0);
                    $("#ueditor_0").contents().find("body").html(content_html);
                    swalert('文章中有出现<b>习近平</b>，但是没有检测到<b>习近平总书记</b>，<b>习近平同志</b>等表述，请仔细检查。', 'error');
                    return false;
                } else {
                    tmp_content = tmp_content.replace(/习近平/i, '');
                }
            }
            swalert('文章中有出现<b>习近平</b>。请自行检查是否正确。', 'info');
        }

        // 完成提示
        if (has_error === false) {
            swalert('没有检查到错误', 'success');
        }
    });

    // 预览
    $('body').on('click', '#previewHtml', function () {
        var strPreviewHtml = '<div class="m2oenh-preview_container"><div class="m2oenh-preview_news"><div class="m2oenh-preview_news__head"><p>%title%</p><button class="m2oenh-btn m2oenh-btn_close" title="关闭预览">&times;</button></div><div class="m2oenh-preview_news__body">%code%</div></div></div>';
        var title = $('.title-box textarea').val();
        var content = $("#ueditor_0").contents().find("body").html();
        strPreviewHtml = strPreviewHtml.replace('%title%', '预览');
        strPreviewHtml = strPreviewHtml.replace('%code%', '<p style="font-size:18px;text-align:left;margin-bottom:0;">' + title + '</p><p style="font-size:14px;color:#666;padding: 10px 0;margin-bottom:0;">禾点点&nbsp;&nbsp;阅读8888&nbsp;&nbsp;' + new Date().format('yyyy-MM-dd hh:mm') + '</p>' + content + '<p>&nbsp;</p><p>&nbsp;</p>');
        $('body').append(strPreviewHtml);
    });

    // 预览窗口关闭
    $('body').on('click', '.m2oenh-btn_close', function () {
        $(this).parents('.m2oenh-preview_container').remove();
    });

    // 清除格式
    $('body').on('click', '#clearStyle', function () {
        var content_html = $("#ueditor_0").contents().find("body").html();
        //
        var preg_style = /\s+style=\"[^\"]*\"/gi;
        var preg_class = /\s+class=\"[^\"]*\"/gi;
        content_html = content_html.replace(preg_style,'');
        content_html = content_html.replace(preg_class,'');
        //删除width和height
        var preg_width = /\s+width=\"[^\"]*\"/gi;
        var preg_height = /\s+height=\"[^\"]*\"/gi;
        content_html = content_html.replace(preg_width,'');
        content_html = content_html.replace(preg_height,'');
        //
        $("#ueditor_0").contents().find("body").html(content_html);

        // 是否自动给p标签添加text-indent属性
        Swal.fire({
            title: '清除格式',
            icon: 'question',
            text: '是否自动给段落标记添加“缩进两个字符”？',
            showCancelButton: true,
            cancelButtonText: '否(不需要)',
            confirmButtonText: '是(添加)',
            confirmButtonColor: '#33cabb',
        }).then((result) => {
            if (result.isConfirmed) {
                var preg_p = /<p/gi;
                content_html = content_html.replace(preg_p,'<p style="text-indent:2em"');
                $("#ueditor_0").contents().find("body").html(content_html);
            }
        });
    })

    //弹窗
    function swalert(msg, icon, title) {
        var icon = arguments[1] ? arguments[1] : 'info';
        var title = arguments[2] ? arguments[2] : '文稿检查';
        if (icon == 'error') {
            msg += '<div style="margin-top:16px;font-size:16px;">特别提示：错误部分将自动标注为<span style="color:red;">红色</span>，注意修改。</div>';
        }

        switch (icon) {
            case 'success':
                var confirmButtonColor = '#15c377';
                break;
            case 'error':
                var confirmButtonColor = '#f96868';
                break;
            case 'warning':
                var confirmButtonColor = '#faa64b';
                break;
            case 'info':
                var confirmButtonColor = '#48b0f7';
                break;
            case 'question':
            default:
                var confirmButtonColor = '#33cabb';
        }

        Swal.fire({
            icon: icon,
            title: title,
            html: msg,
            confirmButtonText: "确定",
            confirmButtonColor: confirmButtonColor
        });
    }

    String.prototype.replace2 = function(searchValue, replaceValue, startValue) {
        var startValue = arguments[2] ? arguments[2] : 0;
        var strLeft = this.substr(0, startValue);
        var strRight = this.substr(startValue, this.length - startValue);
        strRight = strRight.replace(searchValue, replaceValue);
        return strLeft + strRight;
    }

    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})();
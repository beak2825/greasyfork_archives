// ==UserScript==
// @name         百度文库（wenku）| 免费下载BX修复版
// @version       1.45
// @description    (暂时失效，欢迎fix)//部分问题解决方法在安装脚本页面下方，请仔细阅读//基于《百度文库（wenku）在线下载PDF格式文件》修改部分代码，修复了打印页面空白问题。可将大部分文档打印成pdf/脚本仅供学习交流，请勿用于商业用途。
// @author       ChaorenLong
// @namespace    https://gitee.com/Bgz666/bdwenku-download-tampermonkey-script
// @require      https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js
// @match        *://wenku.baidu.com/view/*
// @match        *://wenku.baidu.com/share/*
// @match        *://wenku.baidu.com/tfview*
// @match        *://wenku.baidu.com/share/*
// @grant        unsafeWindow
// @grant       GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-2.0
// @icon         https://wkstatic.bdimg.com/static/wkview/widget/common_toc_reader/common/doc_bottom/compAsync/btns/image/icon-svip.svg
// @downloadURL https://update.greasyfork.org/scripts/439850/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BC%88wenku%EF%BC%89%7C%20%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BDBX%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/439850/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BC%88wenku%EF%BC%89%7C%20%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BDBX%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==
//感谢原作者 eko.zhan, HelloCodeMing 的脚本支持；脚本仅供学习交流使用，请勿用于商业用途。
; (function () {
    'use strict'
    //tfview-->view
    if(window.location.href.indexOf('tfview')!=-1){window.location.href = window.location.href.replace('tfview','view')}
    window.onload = function(){
        if(document.getElementsByClassName("goBtn")[0]){
            const moreBtn = document.getElementsByClassName("goBtn")[0];
            if(moreBtn){
                moreBtn.click();
            }
        }
        insert();
    };

    //insert print btn
    var d = true;
    var e = true;
    var pp = true;
    var yyy = true;
    //获得每页高度后再赋值给sh2，下面判断要用全局变量，而直接这里获取页面高度数值不对
    var sh2 = 0;
    //display标志符
    var ds = true;
    //是否无边距
    var wbj = false

    function insert() {
        /*         //自动打开50页后标志
        GM_setValue('asign',false) */
        //添加菜单
        if(window.location.pathname.indexOf('share')!= -1){
            //非ppt，暂不支持ppt自定义，请期待后续版本更新
            if($('[data-render]').length!=1){

                GM_registerMenuCommand('自定义文库文档每页高度',function(){
                    $('#hein')[0].style.display = 'block';
                })
                //无边距打印
                GM_registerMenuCommand('(测试)无边距打印,建议调整好高度再使用，点击后点下载',function(){
                    wbj = true;
                })

                GM_registerMenuCommand('取消<文档高度大于1/2打印时，每页必在不同页>',function(){
                    pp = false
                    alert('OK')
                })

                GM_registerMenuCommand('恢复/取消标题',function(){
                    if(d){
                        if($('.reader_ab_test')){
                            d = false;
                            $('.reader_ab_test')[0].style.cssText+='display:block'
                        }
                        if($('.page')[0]){
                            $('.page')[0].setAttribute('style','padding-top: 0px;')
                        }
                    }
                    else{
                        if($('.reader_ab_test')){
                            d = true;
                            $('.reader_ab_test')[0].style.display = 'none';
                        }
                    }
                }
                                      )

                GM_registerMenuCommand('恢复/取消边框',function(){
                    if(e){
                        if($('.reader-page')){
                            e = false;
                            for(var i=0;i<$('.reader-page').length;i++){
                                $('.reader-page')[i].style.cssText+='border:0'
                            }
                        }
                    }
                    else{
                        if($('.reader-page')){
                            e = true;
                            for(i=0;i<$('.reader-page').length;i++){
                                $('.reader-page')[i].style.cssText+='border:1px solid #D3D3D3'
                            }
                        }
                    }
                })


            }
            else{

                GM_registerMenuCommand('暂不支持ppt自定义高度，请期待后续版本更新',function(){})
                GM_registerMenuCommand('恢复/取消标题',function(){
                    if(d){
                        if($('.reader_ab_test')){
                            d = false;
                            $('.reader_ab_test')[0].style.cssText+='display:block'
                        }
                        if($('.page')[0]){
                            $('.page')[0].setAttribute('style','padding-top: 0px;')
                        }
                    }
                    else{
                        if($('.reader_ab_test')){
                            d = true;
                            $('.reader_ab_test')[0].style.display = 'none';
                        }
                    }
                })
                GM_registerMenuCommand('恢复/取消边框',function(){
                    if(e){
                        if($('.ppt-page-item')){
                            e = false;
                            for(i=0;i<$('.ppt-page-item').length;i++){
                                $('.ppt-page-item')[i].style.cssText+='border:1px solid #D3D3D3'
                            }

                            //console.log($('.ppt-page-item')[i].style.cssText)
                            /*                                 //如果无style
                                if(!$('.ppt-page-item')[i].style){
                                    $('.ppt-page-item')[i].setAttribute('style','border:0');
                                }else{
                                    $('.ppt-page-item')[i].style.cssText += 'border:0'
                                } */


                        }
                    }
                    else{
                        for(var i=0;i<$('.ppt-page-item').length;i++){
                            if($('.ppt-page-item')){
                                e = true;
                                if(!$('.ppt-page-item')[i].style){
                                    $('.ppt-page-item')[i].setAttribute('style','border:0');
                                }else{
                                    $('.ppt-page-item')[i].style.cssText += 'border:0'
                                }
                            }}
                        /*                         if($('.ppt-page-item')){
                            e = true;
                            for(i=0;i<$('.ppt-page-item').length;i++){
                                $('.ppt-page-item')[i].style.cssText+='border:1px solid #D3D3D3'
                            }
                        } */
                    }
                })
                //无边距打印
                GM_registerMenuCommand('PPT暂不支持无边距打印,点击查看替代方法',function(){window.open('https://greasyfork.org/zh-CN/scripts/439850/discussions/120120')})
            }
        }



        if ($('#btnPrintStyle').length == 0) {
            $('head').append(
                [
                    '<style id="btnPrintStyle">',
                    '.ez-btn{background-color: rgb(68,178,158);border-radius: 6px;color: #fff;border: 0;height: 30px;line-height: 30px;width: 92px;margin-top: 2px;display: block;position: relative;left: 9px;float: left;font-size: 16px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align: left;padding-left: 15px;transition: opacity .3s;}',
                    '.ez-btn:hover{background-color:#ff4e26;}',
                    '.ez-btn[title]:hover:after {content: attr(_title);position: absolute;top: -4px;left: 105%;min-width: 100px;max-width: 300px; padding: 4px 10px;background: #000000;color: #ffffff;border-radius: 4px;text-align:left;z-index:2021;}',
                    '.ez-panel{z-index:2021;display:none;position: absolute;width: 300px;font-size:14px;background: #ffffff;color: blue;  border-radius: 4px;  border: 1px solid #ff4e26;  padding: 6px;  margin: 2px;}',
                    '#doc-header-test .doc-value{margin-right: 10px !important;padding-right: 10px;}',
                    '@media print {body {display: block !important;}}',
                    '#hein{display:none; border:1px solid black;font-size:15px;padding:0 0 10px 10px;position: fixed; right: 0%; top: 30%; width:240px;height:145px;opacity: 1; z-index: 9999;}',
                    '.heightInput{display:block; width:240px;height:30px;opacity: 1; z-index: 9999;}',
                    '.currentH{width:40px;}',
                    '</style>'
                ].join(' ')
            )
        }
        $('body').append(
            [
                '<div class="ez-panel">',
                '<i><h3 style = "font-weight:600;color:black;font-size: 15px;">若点击后无反应，请允许弹出窗口</h3></i>',
                '<h3 style = "font-weight:600;color:black;font-size: 15px;"><i>跳转到新页面请耐心等待页面加载完成</i></h3>',
                '<h2 style = "font-weight:600;color:black;font-size: 15px;"><i>反馈请到  <a href ="https://gitee.com/Bgz666/bdwenku-download-tampermonkey-script" target="_blank" style ="color:orange">NameSpace</a>或  </i><a href ="https://greasyfork.org/zh-CN/scripts/439850/feedback" target="_blank" style = "color:rgb(58,158,178)">这里</a></h3>',
                '<hr/>常见问题：<br/>',
                '1、<a href="https://gitee.com/Bgz666/bdwenku-download-tampermonkey-script#%E4%B8%89%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95" target="_blank">点击免费下载后，如何打印成pdf文件？</a>',
                '<br/>2、<a href="https://gitee.com/Bgz666/bdwenku-download-tampermonkey-script/issues/I4V4ZO" target="_blank">文字重叠重影该如何解决？</a>',
                '<br/>3、<a href="https://gitee.com/Bgz666/bdwenku-download-tampermonkey-script#issue" target="_blank">图片空白，或者图片只有一半的情况如何处理？</a>',
                '<br/>4、页面超过50页的文档可以点击菜单<a href="https://gitee.com/Bgz666/bdwenku-download-tampermonkey-script/issues/I4TW6G"> 菜单在哪打开？</a>，一键展开其余页面，分别下载',
                '<br/>5、<a href="https://gitee.com/Bgz666/bdwenku-download-tampermonkey-script#issue" target="_blank">打印出来的pdf文件里文字断裂，或者图片表格上下页分开如何处理？</a>',
                '</div>',
                '<div id = "hein">','<button id="closep" style="opacity: 0.5;font-size:10px;display:block;width: 226px;margin-bottom: 10px;">关闭</button>','<span>','当前每页高度：','</span>',
                '<input class = currentH>','<span>',' px','</span>','<button id="cbtn" style="font-size:13px;margin-left: 10px;">重置</button>',
                '<input type="range" class = "heightInput" max="1536" value="100" step="1">',
                '<span style="font-size:13px;font-weight:600"><i>拖动范围条或输入值后回车调整，调整会默认关闭《打印时文档每页必在不同页》建议每页空白太多时调整</i></span>',
                '</div>'
            ].join('')
        )

        if(window.location.pathname.indexOf('share')!= -1){
            //取消标题
            if($('.reader_ab_test')){
                $('.reader_ab_test')[0].style.cssText+='display:none'
            }
            if($('.page')[0]){
                $('.page')[0].setAttribute('style','padding-top: 0px;')
            }
            //取消边框
            //非ppt
            if($('.reader-page')){
                for(var i=0;i<$('.reader-page').length;i++){
                    $('.reader-page')[i].style.cssText+='border:0'
                }
            }
            //ppt
            for(i=0;i<$('.ppt-page-item').length;i++){
                if($('.ppt-page-item')){
                    e = true;
                    if(!$('.ppt-page-item')[i].style){
                        $('.ppt-page-item')[i].setAttribute('style','border:0');
                    }else{
                        $('.ppt-page-item')[i].style.cssText += 'border:0'
                    }
                }}

            //22.3.10 文档大于50页自动打开其余页面
            //非ppt
            if($('[data-render]').length!=1){

                var inputPage = Number($('.page-input')[0].value)
                var pageCount = Number($('.page-count')[0].innerHTML.slice('1'))
                var numm = Math.floor(pageCount/50)
                var Remain = pageCount%50
                var link = window.location.href
                //只在第一个页面执行
                if(inputPage<50){
                    //if(GM_getValue('asign')==false){
                    //提示当前文档页数>50
                    if(pageCount>50){
                        GM_registerMenuCommand('文档超过50页，一键打开剩余页面',function(){
                            alert(`
                    文档页数大于50，将打开多个页面。
                    请每个页面都点击下载。
                    `)
                            if(numm){
                                //整除
                                if(!Remain){
                                    for(var nn = 1;nn<numm;nn++){window.open(link+'?pn='+(nn+1)*50,'_blank')}
                                }else{
                                    for(var nn = 1;nn<numm+1;nn++){window.open(link+'?pn='+(nn+1)*50,'_blank')}
                                }

                            }

                        })
                    }
                    //链接有pn去掉
                    if(link.indexOf('pn')!=-1){link = link.slice('',link.indexOf('?pn'))}
                    //不为0，不小于50页

                }
                //}
            }

            $('h3').remove();
            //非ppt才显示
            if($('[data-page-no]')[0]){
                $('#hein')[0].style.display = 'block';
            }
            if($('.center')){
                $('.center').append('<button class="ez-btn">免费下载</button>')//链接为share按钮位置，此处修改
            }}else if(window.location.pathname.indexOf('share')== -1){if($('.topbar-container')){
                $('.topbar-container').append('<button class="ez-btn">免费下载</button>')//链接为view按钮位置，此处修改
            }}

        //调整高度
        if($('[data-page-no]')[0]){
            if($('.heightInput')[0]){
                var sh = $('[data-page-no]')[0].style.height;
                //赋值给全局变量sh2
                sh2 = sh;
                //获取当前页面高度
                $('.heightInput')[0].value = sh.substr(0,sh.indexOf('p'));
                $('.currentH')[0].value = $('.heightInput')[0].value;

                $('.heightInput')[0].oninput = function(){
                    //高度被调整
                    pp=false;
                    yyy=false;
                    for(var f = 0;f<$('[data-page-no]').length;f++){
                        $('[data-page-no]')[f].style.height = $('.heightInput')[0].value + 'px'
                        $('.currentH')[0].value = $('.heightInput')[0].value;
                        //取消必分页
                        $('[data-page-no]')[f].style.cssText+='page-break-after: auto;'
                    }
                }
                $('#cbtn').click(function(){
                    //重置后恢复标志
                    yyy=true;
                    //触发oninput事件
                    $('.heightInput').val(sh.substr(0,sh.indexOf('p'))).trigger('oninput');

                })
                //回车执行
                $('.currentH').keydown(function(event){
                    if (event.keyCode == 13){
                        //设置值也触发oninput事件
                        $('.heightInput').val($('.currentH')[0].value).trigger('oninput');
                    }
                })
            }
        }
        //删除多余元素，或者使其隐藏

        if($('.top-right-fullScreen')[0]){
            $('.top-right-fullScreen')[0].remove();
        }
        if($('#doc_bottom_wrap')[0]){
            $('#doc_bottom_wrap')[0].remove();
        }
        if($('#html-reader-go-more')[0]){
            $('#html-reader-go-more')[0].setAttribute('style','display:none');
        }
        if($('.owner-desc-wrap')[0]){
            $('.owner-desc-wrap')[0].setAttribute('style','display:none');
        }
        if($('.header-wrap')[0]){
            $('.header-wrap')[0].setAttribute('style','display:none');
        }
        if($('.aside')[0]){
            $('.aside')[0].setAttribute('style','display:none');
        }
        if($('.tag-tips')[0]){
            $('.tag-tips')[0].setAttribute('style','display:none');
        }
        if($('.fix-searchbar-wrap')[0]){
            $('.fix-searchbar-wrap')[0].remove();
        }
        if($('.top-ads-banner-wrap')[0]){
            $('.top-ads-banner-wrap')[0].remove();
        }
        if($('#activity-tg')[0]){
            $('#activity-tg')[0].remove();
        }
        if($('.crubms-wrap')[0]){
            $('.crubms-wrap')[0].setAttribute('style','display:none');
        }
        if($('.doc-tag-wrap')[0]){
            $('.doc-tag-wrap')[0].setAttribute('style','display:none');
        }
        if($('.doc-value')[0]){
            $('.doc-value')[0].setAttribute('style','display:none');
        }
        if($('.doc-bottom-wrap')[0]){
            $('.doc-bottom-wrap')[0].setAttribute('style','display:none');
        }
        if($('#next_doc_box')[0]){
            $('#next_doc_box')[0].setAttribute('style','display:none');
        }
        if($('.left')[0]){
            $('.left')[0].setAttribute('style','display:none');
        }
        if($('.centerRight')[0]){
            $('.centerRight')[0].setAttribute('style','display:none');
        }
        if($('.ft')[0]){
            $('.ft')[0].setAttribute('style','display:none');
        }
        if($('#ft')[0]){
            $('#ft')[0].setAttribute('style','display:none');
        }
        //使主要内容居中
        if($('.page')[0]){
            $('.page')[0].setAttribute('style','padding-top: 10px;')
        }
        if($('.reader_ab_test')[0]){
            $('.reader_ab_test')[0].style.cssText +='text-align: center; margin-right: 0px;width:966px;margin-bottom:10px'
        }
        if($('#doc-main')[0]){
            if($('[data-render]')[0]){
                $('#doc-main')[0].setAttribute('style','margin-left:116px');
            }
        }
        if($('.reader-tools-bar-center')[0]){
            $('.reader-tools-bar-center')[0].setAttribute('style','margin-right:0px');
        }


        //去除边框
        /*
        if($('.reader-page')){
            for(var i=0;i<$('.reader-page').length;i++){
                $('.reader-page')[i].style.cssText+='border:0'
            }
        }

*/

        var t = null

        $('.ez-btn').hover(
            function () {
                $('.ez-panel')
                    .css({
                    top: $('.ez-btn').offset().top - 160 + 'px',
                    left: $('.ez-btn').offset().left + 70 + 'px'
                })
                    .show()
            },
            function () {
                //链接上经过，保持5秒
                $('a').mouseover(
                    function(){
                        if (t) window.clearTimeout(t)
                        t = window.setTimeout(function () {
                            $('.ez-panel').hide()
                        },5*1000)
                    }
                )
                //移出panel
                $('.ez-panel').mouseout(function(){
                    if (t) window.clearTimeout(t)
                    t = window.setTimeout(function () {
                        $('.ez-panel').hide()
                    },500)
                })
                //其余情况
                if (t) window.clearTimeout(t)
                t = window.setTimeout(function () {
                    $('.ez-panel').hide()
                },1000)

            }
        )
        $('#closep').click(function(){
            $('#hein')[0].setAttribute('style','display:none')
        })
        $('.ez-btn').click(function () {
            //?pn=50每次从view等页面打开share都是在前50页
            //没有share
            if(window.location.pathname.indexOf('share')== -1){
                //link链接
                if(window.location.href.indexOf('link')!= -1){
                    if(document.querySelector("body > script:nth-child(4)")){
                        var scriptHtml = document.querySelector("body > script:nth-child(4)").innerHTML
                        var start = scriptHtml.indexOf('showDocId')+12
                        var end = scriptHtml.indexOf('showStoreId')-3
                        var docId = scriptHtml.slice(start,end)
                        window.open('/share/' + docId+'?pn=50','_blank');
                    }
                }
                else{
                    window.open('/share/' + window.location.pathname.slice(6)+'?pn=50','_blank');
                }
            }
            //有share
            else{

                if($('.tools-bar-small')[0]){
                    $('.tools-bar-small')[0].setAttribute('style','display:none');
                }
                prePrint()
                if($('#hein')[0].style.display=='block'){
                    ds = false;
                    $('#hein')[0].style.display = 'none';
                }
            }})
        $('body').mousedown(function (e) {
            if (e.button == 2) {
                //imgHandle()
            }
            return true
        })
    }
    var old = '';
    var a = [];
    //滤网b
    var b = [];
    var kong = [];
    var c = [];
    function saveRecover(){
        if($('.prev-pageList')[0]){
            $('.prev-pageList')[0].remove();
        }
        if($('.next-pageList')[0]){

            $('.next-pageList')[0].setAttribute('style','display:none');
        }

        b = $('[data-render="1"]');
        if($('#next_doc_box')[0]){$('#next_doc_box')[0].remove()}


        for(var i = 0;i<b.length;i++){
            if (a.indexOf(b[i].innerHTML) == -1){
                a.push(b[i].innerHTML);
                /*                 if(b[i].style.cssText.indexOf('height') != -1){
                    ////页面小于打印时页面1/2，就调整为1/2
                    if (parseFloat(b[i].style.height) < 750) {
                        //第一第二页减去标题
                        //有标题
                        //没有手动调整过页面高度
                        if(yyy){
                            if(d){
                                if(i<2){
                                    b[i].style.height = '750px';

                                }
                                else{
                                    b[i].style.height = '777px';
                                }
                            }
                            //无标题
                            else{
                                b[i].style.height = '777px';
                            }
                        }

                    }
                    //添加style，打印时不在同一页
                    //菜单没取消设置
                    //没手动修改过高度
                    else if(pp&&yyy){
                        b[i].style.cssText+='page-break-after: always;'
                    }
                } */
                //console.log(a.length);
            }

            if (c.indexOf(b[i]) == -1){
                c.push(b[i]);
                //console.log(c);
            }

        }

    }
    //2022.3.1调整小于一半页面高度函数
    function halfTake(){
        console.log(c)
        for(var i = 0;i<c.length;i++){
            if(c[i].style.cssText.indexOf('height') != -1){
                ////页面小于打印时页面1/2，就调整为1/2
                if (parseFloat(c[i].style.height) < 750) {
                    //第一第二页减去标题
                    //有标题
                    //没有手动调整过页面高度
                    if(yyy){
                        if(d){
                            if(i<2){
                                c[i].style.height = '750px';

                            }
                            else{
                                c[i].style.height = '777px';
                            }
                        }
                        //无标题
                        else{
                            c[i].style.height = '777px';
                        }
                    }

                }
                //添加style，打印时不在同一页
                //菜单没取消设置
                //没手动修改过高度
                else if(pp&&yyy){
                    c[i].style.cssText+='page-break-after: always;'
                }
            }
            console.log(c[i].style.height)
        }
    }
    //main function
    function prePrint() {

        $('.ez-panel').remove()
        $('#bottom-download').remove();
        // add by eko.zhan at 2019-12-14 17:35
        //遍历css文件，将main的样式取消
        $('head')
            .find('link')
            .each((index, item) => {
            if (
                $(item)
                .attr('href')
                .indexOf('/common_toc/common/style/main') != -1
            ) {
                $(item).remove()
            }
        })


        $('.read-all').click()
        $('.header-wrapper').remove()
        $('.no-full-screen').remove()
        $('.lazy-load').remove()
        $('.reader-topbar').remove()
        //使打印出来页面居中
        //非ppt
        if($('[data-render]')[0]){
            $('.main')[0].setAttribute('style','margin-left:-70px')
        }
        //重新定义remove方法
        jQuery.fn.extend({
            remove: function () {
                return false
            }
        })
        $(window).scrollTop(10);
        window.setTimeout(function () {
            saveRecover();
        }, 1000)

        var _h = document.body.scrollHeight,
            _tmp = 1000
        var _t = window.setInterval(function () {
            $(window).scrollTop(_tmp)
            saveRecover();
            _tmp = _tmp + 1000
            _h = document.body.scrollHeight
            if (_tmp > _h) {
                window.clearInterval(_t)
                window.setTimeout(function () {
                    saveRecover();
                    kong = $("[data-render='']");
                    for (var i = 0; i < kong.length; i++) {
                        kong[i].innerHTML = a[i];
                        //console.log(kong[i])
                    }
                    doPrint();
                }, 1000)
            }
        }, 300)
        }
    /**
   * 调用浏览器打印
   */
    function doPrint() {
        window.setTimeout(function () {
            halfTake()
            //2022.2.28无边距打印，有bug
            if(wbj){
                var newl = document.querySelector("#doc-main > div").innerHTML
                document.body.innerHTML = newl
                window.print()
                alert('目前《无边距打印功能》尚有BUG，如需《调整页面高度》请刷新后进行高度调整或下一次打印/下载')
            }
            else{
                window.print()
            }
            //打印完后
            /*             if(!pp){
                debugger
                for(var i = 0;i<$('[data-page-no]').length;i++){
                    $('[data-page-no]')[i].style.cssText+='page-break-after: auto;'
                }
            } */
            if(ds==false){
                $('#hein')[0].style.display = 'block';
            }
            a=[];
            if($('.tools-bar-small')[0]){
                if(!$('.next-pageList')[0]){
                    $('.tools-bar-small')[0].setAttribute('style','display:block');//显示下边栏
                }else{
                    $('.next-pageList')[0].setAttribute('style','display:block');
                }
            }
            if($('.main')[0]){
                $('.main')[0].setAttribute('style','margin-left:120px')//页面居中
            }
        }, 2000)
    }
})()
// ==UserScript==
// @name LOFTER屏蔽插件
// @namespace lofterCleaner
// @include http://www.lofter.com/*
// @author  http://weibo.com/zaiziw
// @version 1.0
// @description 屏蔽含指定关键字的LOFTER的TAG，文章内容，标题
// @require  https://code.jquery.com/jquery-2.2.4.min.js
// @grant  GM_addStyle
// @grant  GM_getValue
// @grant  GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/28414/LOFTER%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/28414/LOFTER%E5%B1%8F%E8%94%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
//todo：
//1.把分隔关键字的改一改；
//2.把猜你喜欢之类的广告删掉，不过可能有人想留着。做个用户界面；


GM_addStyle('.input_blacklist{overflow:hidden; border: 1px solid #ccc;  line-height: 18px; margin: 10px 0; padding: 0 5px;  width: 50%; min-width: 100px; outline-style:none } .add_blacklist{float: none;font-size: 90%;line-height: 18px; height: 18px; cursor: pointer;margin: 10px 5px; padding: 0 10px; background: #24292C;  color: #fff; display: inline-block;}');

(function($, undefined){
    $(function(){
        //设置监听器，载入更多内容的时候执行脚本
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        
        DO = new MutationObserver(function() {
            removeAd();
            blockLOF();
        });

        DO.observe(document.body, {
            childList:true,
            characterData:true,
            subtree:true
        });



        //在右上角的“更多”下拉框里面添加设置黑名单的选项
                $('.selcc:first').append('<div class = seli><a class="block_setting" href="#block_pop" title="设置黑名单">设置黑名单</a></div>');
        
        //毫无卵用的去除广告        
        function removeAd() {
             $('#flight3535_adbid').remove();
        }


        //用remove的方式去除包含关键字的div
        function blockLOF(){
            //blockbytitle
            $('.tit').each(function(){
                var tit = $(this).text();
                if(findword(tit,'tit')){
                    $(this).parents(".m-mlist").remove();
                }
            });
            //blockbytxt
            $('.txt').each(function(){
                var txt = $(this).text();
                if(findword(txt,'txt')){
                    $(this).parents(".m-mlist").remove();
                }
            });
            //blockbytag
            $('.opti').each(function(){
                var tag = $(this).text();
                if(findword(tag,'tag')){
                    $(this).parents(".m-mlist").remove();
                }
            });
        }


        //屏蔽关键字的时候在这里查找是否包含关键字
        function findword(texts,mode){
            if (mode === 'tag'&&keytags){
                for(var i=0;i<=keytags.length;i++)
                    if(texts.indexOf(keytags[i])!=-1)
                        return true;
            }
            else if (mode === 'txt'&&keytxts) {
                for(var i=0;i<=keytxts.length;i++)
                    if(texts.indexOf(keytxts[i])!=-1)
                        return true;
            }
            else if (mode === 'tit'&&keytits) {
                for(var i=0;i<=keytits.length;i++)
                    if(texts.indexOf(keytits[i])!=-1)
                        return true;
            }
        }


        //获得通过GM_setvalue保存的关键字列表
        var keytxts = getkeyword('txt');
        var keytags = getkeyword('tag');
        var keytits = getkeyword('tit');
        function getkeyword(mode){
            var keytxts = GM_getValue('keytxts');
            var keytags = GM_getValue('keytags');
            var keytits = GM_getValue('keytits');
        //用逗号分隔关键词，容易产生歧义....以后改成别的字符好了
            if (mode === 'tag'&&keytags)
                return keytags.split(",");
            else if(mode === 'txt'&&keytxts)
                return keytxts.split(",");
            else if(mode === 'tit'&&keytits)
                return keytits.split(",");
        }


        //这一段是交互界面
        $.fn.blockPop = function(opt) {
            return this.each(function(){
                $(this).click(function(e){
                    var keytxts=GM_getValue('keytxts','');
                    var keytits=GM_getValue('keytits','');
                    var keytags=GM_getValue('keytags','');

                    var pop = $('<div id="block_pop">'+
                                '<h1>设置黑名单</h1>'+
                                '<p style="color:#888888">请用半角“,”分隔，末尾不要加逗号<</p><br>'+
                                '<h2>屏蔽文章内容列表</p>'+
                                '<textarea id="inputkeytxts" class="input_blacklist"/>'+
                                '<h2>屏蔽tag列表</p>'+
                                '<textarea id="inputkeytags" class="input_blacklist"/>'+
                                '<h2>屏蔽文章标题列表</p>'+
                                '<textarea id="inputkeytits" class="input_blacklist"/>'+
                                '<p><a id="savekeyword" class="add_blacklist">保存黑名单</a></p>'+
                                '</div>');
                    //这是外面那个半透明的黑色遮罩，点一下就关掉交互界面
                    var overlay = $('<div class="block_overlay"></div>');
                    
                    if ($('#block_pop').length < 1)
                        $('body').append(pop);
                    if ($('.block_overlay').length < 1)
                        $('body').append(overlay);
                    //在输入框里面填好已经加入的关键词
                    $("#inputkeytxts").val(keytxts);
                    $('#inputkeytits').val(keytits);
                    $('#inputkeytags').val(keytags);

                    //进入这个交互界面的时候禁止滚动    
                    document.documentElement.style.overflow='hidden';

                    //我可能是脑子被炮打了才把css写到这里....应该放到最上面那个GM_style里面
                    $('.block_overlay').css({
                        'z-index':99998,
                        'position':'absolute',
                        'opacity':0.8,
                        'background':'#000',
                        display:'block',
                        'top': 0,
                        'left': 0,
                        //'height': '100%',
                        'width': '100%',
                         'height':$('body').height()
                        });

                    $('#block_pop').css({
                        'background':'#fff',
                        'padding':30,
                        'z-index':99999,
                        'position':'fixed',
                        'border':'1',
                        padding:30,
                        'border-radius':7,
                        'width':'20%'
                    });
                    $('#block_pop').css({
                        top :($(window).height() - $('#block_pop').outerHeight()) / 3,
                        left:($(window).width()- $('#block_pop').outerWidth()) / 2
                    });
                    $('#block_pop').fadeTo(300, 1);
                    $('.block_overlay').fadeTo(300,0.8);


                    //这一段是为了让textarea（就是输入文字的那个框框）能够根据输入文字长度适应高度
                    var inputblacklist = document.getElementsByClassName("input_blacklist");

                    for(var i = 0;i < inputblacklist.length;i++){
                        inputblacklist[i].style.cssText = 'height:' + inputblacklist[i].scrollHeight + 'px';
                        inputblacklist[i].addEventListener('keydown', autosize);
                    }

                    function autosize(){
                      var el = this;
                      setTimeout(function(){
                        el.style.cssText = 'height:auto; padding:0';
                        el.style.cssText = 'height:' + el.scrollHeight + 'px';
                      },0);
                    }

                    //关键词全部在这里保存啦
                    $('#savekeyword').click(function(){
                        var tag = $('#inputkeytags').val();
                        var tit = $('#inputkeytits').val();
                        var txt = $('#inputkeytxts').val();
                        GM_setValue('keytags',tag);
                        GM_setValue('keytxts',txt);
                        GM_setValue('keytits',tit);
                        alert("设置成功,请刷新lofter页面...");
                    });

                    //关闭界面用的
                    $(overlay).click(function(){
                        $(this).fadeOut(300);
                        //恢复屏幕滚动
                        document.documentElement.style.overflow = "scroll";
                        $('#block_pop').css('display','none');
                    });
                    e.preventDefault();
                });
            });
        };

        $('.block_setting').blockPop();

    });
})(window.jQuery.noConflict(true));


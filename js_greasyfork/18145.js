// ==UserScript==
// @name         Topic
// @namespace    http://gushaoting.com/
// @version      0.2
// @description  给话题页加上索引
// @author       gst
// @match        https://*.zhihu.com/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18145/Topic.user.js
// @updateURL https://update.greasyfork.org/scripts/18145/Topic.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var topicToken = new Array();
var spreadtableID = new Array();

var spreadsheetID = "1GDe8IQOHMK5nlNt49DYTZ_lX69IEK_jEb_ve99ztZE8";
var tokenURL = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/o2tvsyg/public/values?alt=json";

$.getJSON(tokenURL, function(data) {
    var feed = data.feed.entry;

    $(feed).each(function() {
        topicToken.push(this.gsx$token.$t);
        spreadtableID.push(this.gsx$worksheetid.$t);
    });
    
    // 拿 json 

    for(var i=0;i<topicToken.length;i++)
        if(window.location.pathname.slice(7,15) === topicToken[i])
        {
            var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/"+spreadtableID[i]+"/public/values?alt=json";

            // 添加索引字样
            $('.zm-topic-topbar-nav-list').prepend('<li class="zm-topic-topbar-nav-list-item"><span>索引</span></li>');
            $('.zm-topic-topbar-nav-list .current').html('<a class="zg-link-litblue-normal" href="/topic/'+topicToken[i]+'/hot">动态</a>')

            $.getJSON(url, function(data) {
                var entry = data.feed.entry;

                // 清空 default 页
                $('.feed-switcher').hide();
                $('.zu-top-feed-list').empty();

                // 目录字样
                $('.zu-top-feed-list').append('<div class="catalog"><h2 class="block-title">目录</h2>');
                $('.catalog').append('<div class="level1"><ol></ol></div>');

                // 侧边目录
                $('.zu-main-sidebar').append('<div class="zm-side-section" id="zh-topic-catalog"><div class="zm-side-section-inner" id="zh-topic-catalog-inner"><h3>目录</h3>');
                $(entry).each(function() {
                    var reg=/[^\u4e00-\u9fa5]/gi;
                    var urlName = this.gsx$title.$t.replace(reg,'');
                    var urlContent = ""

                    // 目录内容    
                    if(this.gsx$catagory.$t != ""){
                        $('.level1 ol').append('<li><span class="text"><a href=#'+ this.gsx$catagory.$t+'><p>'+this.gsx$catagory.$t+'</p></a></span></li>');  
                        $('.zu-top-feed-list').append('<h3 id='+this.gsx$catagory.$t+'>'+this.gsx$catagory.$t+'</h3>');
                        $('#zh-topic-catalog-inner').append('<li id='+ this.gsx$catagory.$t+'><div class="round"></div><span class="text"><a href=#'+ this.gsx$catagory.$t+'><p>'+this.gsx$catagory.$t+'</p></a></span></li>');
                    }
                    
                    if(this.gsx$description.$t != ""){
                        $('.zu-top-feed-list').append('<div class="description"><p>'+this.gsx$description.$t+'</p></div>');
                    }
                    
                    if(this.gsx$subtopic.$t != ""){
                        $('.zu-top-feed-list').append('<p class="subtopic">相关子话题：</p>'); 
                        var partsOfStr = this.gsx$subtopic.$t.split('，');
                        console.log(partsOfStr);
                        for(i=0;i<partsOfStr.length;i++){
                            $('.zu-top-feed-list').append('<div class="subtopic"><a class="zm-item-tag" href="/topic/'+partsOfStr[i]+'" >'+partsOfStr[i]+'</a></div>');
                        }
                    }
                    
                    // 问题内容
                    $('.zu-top-feed-list').append('<div id="'+ urlName +'"class="feed-item feed-item-hook question-item" itemprop="question" itemscope="" itemtype="http://schema.org/Question" data-score="1" data-type="q"><meta itemprop="answerCount" content="3"><meta itemprop="isTopQuestion" content="false"><h2 class="question-item-title"><a target="_blank" class="question_link" href="'+this.gsx$content.$t+'">'+this.gsx$title.$t+'</a></h2><div class="question-item-meta"><a class="follow-link zg-follow meta-item zu-autohide" >展开</a></div><div class="answer-content"></div></div>');
                    $.get(this.gsx$content.$t, function(data) {
                        var data = $(data);
                        urlContent = $(data).find('div[itemprop="topAnswer"]').first();
                        $('#'+ urlName +'').click(function(){
                            $('#'+ urlName +' .answer-content').html(urlContent);
                            $('img.zm-list-avatar.avatar').hide();
                            $('#'+ urlName +' .question-item-meta').empty();
                            $('#'+ urlName +' .answer-content img').each(function() {
                                this.src = $(this).data('actualsrc');
                            });

                        });
                    });
                });

                // css 
                $('.feed-item').css({"border-top":"1px solid #eee","border-bottom":"0px solid #eee", "cursor":"pointer"});
                $('.block-title').css({"padding":"0"});
                $('.subtopic').css({"padding":"10px 0", "display":"inline-block"});
                $('.subtopic .zm-item-tag').css({"float":"none"});
                $('.zu-top-feed-list h3').css({ "padding":"65px 0 20px 0", "margin":"-30px 0 0 0"});
                $('.block-title').css({"float":"left", "width": "40px","display":"block" });
                $('.level1').css({"float":"left", "display":"block" });
                $('.level1 a, #zh-topic-catalog a').css({"color": "#333"});          
                $('.catalog').css({"display":"block","height":"140px", "width":"100%", "padding":"20px 0 ", "margin":"10px 0px","border-bottom":"1px solid #eee",  });
                $('.catalog h2').css({"font-size":"16px"});
                $('ul, ol, li').css({"list-style": "none", "line-height":"200%"});
                $('.level1 li').css({"border-left":"1px solid #eee","margin":"0px", "padding": "0px 0px 0px 30px"});
                $('#zh-topic-catalog').css({ "padding": "15px 0 0","border-top": "1px solid #eee", "bottom":"110px", "width":"100%"});
                $('#zh-topic-catalog li').css({"border-left":"1px solid #eee","margin":"0px 10px", "padding": "0px 0px 0px 30px"});
                $('#zh-topic-catalog .round').css({"border-radius": "5px","background-color":"#eee", "width":"7px", "height":"7px", "display":"inline-block", "margin-left":"-34px"});
                $('.text').css({"display":"inline-block","margin-left":"20px"});
                $('.level1 ol').css({"width": "150px", "padding":"0px 10px 0 20px", "height":"140px","webkit-columns":"140px",});
                $('.question-item-title').css({"display":"inline-block","width":"90%"});
                $('.question-item-meta').css({"display":"inline-block","float":"right", "cursor":"pointer"});
                $('.answer-content').css({"display":"block","width":"100%", "cursor":"initial"});

                // 滚动固定
                $(function() { 
                    var elm = $('#zh-topic-catalog'); 
                    var startPos = $(elm).offset().top; 
                    $.event.add(window, "scroll", function() { 
                        var p = $(window).scrollTop(); 
                        $(elm).css('position',((p) > startPos) ? 'fixed' : 'static'); 
                        $(elm).css('top',((p) > startPos) ? '200px' : ''); 
                        $(elm).css('border-top',((p) > startPos) ? '0':'1px solid #eee'); 
                    }); 
                }); 

                // 侧边栏目录显示定位
                $(window).scroll(function() {
                    var position = $(this).scrollTop();

                    $('h3').each(function() {
                        var target = $(this).offset().top;
                        var id = $(this).attr('id');
                        $(' #zh-topic-catalog a').css({"color": "#333", "font-weight":"300"});          
                        $(' #zh-topic-catalog .round').css({"background-color": "#eee"});          
                        $('.active a').css({"color": "#0794E9", "font-weight":"600"});
                        $('.active .round').css({"background-color": "#00BFFF"});

                        if (position >= target-200) {
                            $('li#' + id + '').prevAll().removeClass('active');
                            $('li#' + id + '').addClass('active');
                        }
                        else if(position < target-200) {
                            $('li#' + id + '').removeClass('active');
                        }
                    });
                });

            });
        }
});





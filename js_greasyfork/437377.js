// ==UserScript==
// @name         阿里小站帖子展开
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  try to take over the world!
// @author       Sky
// @match        https://pan.wuenci.com/*

// @icon         https://pan.wuenci.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437377/%E9%98%BF%E9%87%8C%E5%B0%8F%E7%AB%99%E5%B8%96%E5%AD%90%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/437377/%E9%98%BF%E9%87%8C%E5%B0%8F%E7%AB%99%E5%B8%96%E5%AD%90%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var domain='https://pan.wuenci.com/'
    var styleStr = '';
    var str=window.location.search;
    var _order=str.split('=')[1];
    var wordStr=['', 'top', 'newest', 'oldest'];
    styleStr += '<style>';
    styleStr += 'a.open_but{display:block;text-align:center;line-height:30px;background:#e8ecf3;text-decoration:none;border-radius:30px;margin:1rem 0}';
    styleStr += '.tx{background:#f3f6f9;margin-bottom:1rem;position:relative;}'
    styleStr += '.tx img{max-width:100%!important}'
    styleStr += '.tx .final{transition: all .2s;height:0px;overflow:hidden;transform-origin:0 0;}'
    styleStr += '.tx .show{height:auto;padding:2rem;}'
    styleStr += '.ButtonGroup{margin-right:5px;}';
    styleStr += '.ButtonOn{background:#4d698e!important;color:#fff!important}';
    styleStr += '.Flagrow-Ads-under-header{display:none}';
    styleStr += '.loading{ width: 30px;height: 30px;border-radius: 50%;display: inline-block;border-top: 3px solid #ccc;border-right: 3px solid transparent;animation: rotation 1s linear infinite;margin:auto;position:absolute;top:50%;left:50%;margin-left:-15px;margin-top:-15px;}';
    styleStr += '@keyframes rotation {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}';
    styleStr += 'li[class^="item-tag"] {visibility: visible;}';
    styleStr += '</style>'
    var btn_dom='';
    btn_dom += '<div class="ButtonGroup" data-ref="'+wordStr[0]+'"><button class="Button" onclick="javascript:location.href=\''+domain+'\'">最新回复</button></div>';
    btn_dom += '<div class="ButtonGroup" data-ref="'+wordStr[1]+'"><button class="Button" onclick="javascript:location.href=\''+domain+'/?sort='+wordStr[1]+'\'">热门主题</button></div>';
    btn_dom += '<div class="ButtonGroup" data-ref="'+wordStr[2]+'"><button class="Button" onclick="javascript:location.href=\''+domain+'/?sort='+wordStr[2]+'\'">新鲜出炉</button></div>';
    btn_dom += '<div class="ButtonGroup" data-ref="'+wordStr[3]+'"><button class="Button" onclick="javascript:location.href=\''+domain+'/?sort='+wordStr[3]+'\'">陈年旧帖</button></div>';
    $('.item-sort').html('').append(btn_dom);
    $('.item-sort .ButtonGroup').each(function(){
        var _word=$(this).attr('data-ref');
        if(_order){
            if(_order==_word){
             $(this).find('button').addClass('ButtonOn');
            }
        }else{
            $('.item-sort .ButtonGroup').eq(0).find('button').addClass('ButtonOn');
        }
    })


    $('body').append(styleStr);
    $('.DiscussionListItem').addClass('yet');
    $('.yet').after('<a href="javascript:;" class="open_but">展开帖子内容</a><div class="tx" style="width:100%;height:auto;"><div class="show_con" style="display:none"></div><div class="final"></div></div>');
    // Your code here...

    $('.item-refresh Button[aria-label="刷新"]').click(function(){
        location.reload();
    });

    $('a.DiscussionListItem-main').attr('target', '_blank');

 $('.sideNav a').click(function(){
        location.reload();
    });

    $('.DiscussionList-discussions').on('click', '.open_but', function () {
        var url = $(this).parent().find('a.DiscussionListItem-main').attr('href');
        var query_url = domain + url;
        var _that = $(this).parent().find('.tx');
        var id = $(this).parent().attr('data-id');
        $(this).parent().attr('id', id);
        $(this).attr('href','#'+id);

        $(document).ajaxStart(function () {
            _that.prepend('<span class="loading" style="display:none;"></span>');
            _that.find('.loading').show();
        });
        $(document).ajaxSuccess(function () {
            _that.find('.loading').remove();
            var _position=_parent.offset().top;
            $('html,body').animate({scrollTop:_position-75}, 0);
        });
        $.ajax({
            type: 'get',
            url: query_url,
            success: function (body, heads, status) {
                if(body){
                var t_str = body.replace(/script/g, "b");
                var box1 = _that.find('.show_con');
                var box2 = _that.find('.final');
                box1.html(t_str);
                var con = box1.find('#flarum-content .container .Post-body').html();
                box2.html(con);
                $('.final .container').css('width', '100%');
                $('.final p img').css('width', '100%!important')
                }else{
                box2.html('加载失败...');
                }
            },
            error:function(body, heads, status){

            }
        })
        var _parent = $(this).parent();
        var _tar = _parent.find('.tx .final');
        if (_tar.hasClass('show')) {
            _tar.removeClass('show');

        } else {
            _tar.addClass('show');
            _parent.siblings().find('.tx .final').removeClass('show');
            _parent.siblings().find('.loading').remove();
        }
    })
    $(document).keyup(function(e){
        var key =  e.which || e.keyCode;;
        if(key == 27){
            $('.final').removeClass('show')
        }
    });
     $('.DiscussionList-loadMore').click(function(){
        setTimeout(function(){
            $('.DiscussionListItem:not(.yet)').after('<a href="javascript:;" class="open_but">展开帖子内容</a><div class="tx" style="width:100%;height:auto;"><div class="show_con" style="display:none"></div><div class="final"></div></div>');
            $('.DiscussionListItem:not(.yet)').addClass('yet');
$('a.DiscussionListItem-main').attr('target', '_blank');
        }, 3000);
    })
})();

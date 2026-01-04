// ==UserScript==
// @name         remove ADs of 3g.renren.com
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove all the annoying ads in 3g.renren.com
// @author       Ray Lee raylee.stu<>gmail.com
// @match        http://3g.renren.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38861/remove%20ADs%20of%203grenrencom.user.js
// @updateURL https://update.greasyfork.org/scripts/38861/remove%20ADs%20of%203grenrencom.meta.js
// ==/UserScript==
(function(M) {
    var del_doms_of_class = function(b) {
        var a = document.getElementsByClassName(b);
        for (var j = 0, l = a.length; j < l; j++) {
            if (a[j] !== null) {
                a[j].parentNode.removeChild(a[j]);
            }
        }
    };
    var del_dom_of_id = function(b) {
        var a = document.getElementById(b);
        if (a !== null) {
            a.parentNode.removeChild(a);
        }
    };
    del_dom_of_id('fh_top_item');
    del_dom_of_id('fh_top_itemtab1');
    del_dom_of_id('BanAd');
    del_dom_of_id('baiduAd-moveCard');
    del_doms_of_class('fubiao-dialog');
    del_dom_of_id('ft_n_9106');
    del_dom_of_id('Z49');
    del_dom_of_id('F241H7');
    // del_doms_of_class('adsbygoogle');
    del_doms_of_class('fubiao-dialog');
    var head = document.getElementsByTagName('head')[0];
    var o = head.getElementsByTagName('script');
    var tom = [];
    for (var i = o.length - 1; i >= 0; i--) {
        var p = o[i].getAttribute('src') ;
        if (/baidu/.test(p) || /google/.test(p) || /addAd3gwap/.test(p)) {
            tom.push(o[i]);
            head.removeChild(o[i]);
        }
    }
    M();
})(function() {
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');
    script.onload = function() {
        $('#ft_n_9106, .fubiao-dialog, #Z49, .FZ4, #F241H7, .adsbygoogle, #3gwapAD02').remove();
        $('body').css({
            padding: 0
        });
    };
    script.type = 'text/javascript';
    script.src = 'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js';
    head.appendChild(script);
});
if ($(".sec.stat")[0] !== undefined)
    if ($(".sec.stat > .moment")[0] === undefined) {
        var iii = $(".sec.stat").html();
        if (iii.match(/<b>([^<]+)<\/b>([^<>]+)(<span class="time">[^<]+<\/span>)/)) var new_content = iii.replace(/<b>([^<]+)<\/b>([^<>]+)(<span class="time">[^<]+<\/span>)/, '<div class="moment"><b class="who">$1</b><p class="content">$2$3</p></div>');
        if (iii.match(/([^<>]+)(<span class="time">[^<]+<\/span>)/)) var new_content = iii.replace(/([^<>]+)(<span class="time">[^<]+<\/span>)/, '<div class="moment"><p class="content">$1$2</p></div>');
        $(".sec.stat").html(new_content);
    }
$(".list > div:nth-child(n+2)").each(function() {
    if ($(this).find('.content')[0] === undefined) {
        var a = $(this).html(),
            b = a.replace(/([^><]+)<\/a>(.*)<p class="gs">/, '$1</a><p class="content">$2</p><p class="gs">');
        $(this).html(b);
        var em = $(this).find('em');
        if (em !== null) em.remove();
    }
    var cur = $(this).find('.content'),
        content = cur.html();
    if (content !== null) {
        var new_content = content.replace(/#([^#]+)#\(([^)]+)\)/g, '<a href="$2">#$1#</a>').replace(/:&nbsp;/, '');
        cur.html(new_content);
    }
});
$('.content').on('click touchend', function() {
    $(this).siblings().toggle();
});

$('<style>.input_b, .input_b_wrapper, textarea {width: 95%; margin: 0 auto; display: block; border-radius: 6px; border: 1px solid purple; } .input_b_wrapper:hover:focus:active, textarea:hover:focus:active {border: 1px solid darkpurple; transition: 700ms all ease-in-out; } .list > div {margin: 6px; border: 1px solid #ececec; border-radius: .25rem; background: #ffffff; box-shadow: 1px 1px 13px #DEDEDE;} .list > div:nth-child(n+2) > a:nth-child(2) {margin: 0; color: #00AC26; text-decoration: none; display: inline-block; font-size: 10px; border: 1px solid #36B926; margin-right: 6px; padding: 2px 6px; border-radius: 4px; background: #defbdf; } .gs {margin-top: 0 !important; display: inline-block; color: #0A1A94 !important; font-size: 10px; padding: 3px 6px !important; border: 1px solid #5F85F1; border-radius: 4px; background: #E7EBF7; float: right; } .gs:hover {background: #a9befd; transition: 700ms all ease-in-out; } .gs a {font-size: inherit; color: inherit; display: inline-block; margin-left: 5px; text-decoration: none; } .content:hover {background: #ffc27a; border-color: #ffd098; transition: 700ms all ease-in-out; } .content ~ a {margin: 0; display: inline-block; text-decoration: none; font-size: 10px; color: #E65555; border: 1px solid #F98585; border-radius: 4px; padding: 0px 6px; background: #FBF5F5; transition: 700ms all ease-in-out; float: right; margin-right: 6px; } .content ~ a:hover {background: #FFCCCC; transition: 700ms all ease-in-out; color: #D64E4E; } p.content {margin: 6px; font-size: 0.9rem; color: black; border: 1px solid #FFE689; width: 90%; padding: 3px 12px; border-radius: 2px; background: #F8F9D5; line-height: 1.3rem; } .moment .time {display: inherit; border: 1px solid #a3a9ec; padding: 1px 3px; border-radius: 3px; background: #f2f4ff; float: right; font-size: 10px; color: #5f5596; }</style>').insertAfter($(".list"));
if ($('input.input_b').next('textarea')[0] === undefined) {
    $('<textarea class="input_b_wrapper" rows="5" placeholder="说点什么呗"></textarea>').insertAfter($('.input_b[name=status]'));
    $('.input_b[name=status]').hide();
    $("input ~ textarea").on('keyup', function() {
        $(this).prev('input').val($(this).val());
    });

}
$(function(){
    var style_has = 0;
    function tmp_aaaa() {
        var chars = [].concat.apply([], Array(26)).map(function(_, i) {
            return String.fromCharCode(i + 65);
        }), times = 0;
        var strstr = '';
        for (var i in chars) {
            var iv = chars[i];
            for (var j in [].concat.apply([], Array(10)).map(function(_, i) {return i;})) {
                var idid = '#' + iv + '' + j;
                if ($(idid).length > 0){
                    $(idid).remove();
                    times += 1;
                }
                strstr += idid+',';
            }
        }
        // remove
        $('[id^=baiduAd]').remove();
        $('[id^=ft_]').remove();
        $('*').contents().each(function() {
            if(this.nodeType === Node.COMMENT_NODE) {
                $(this).remove();
            }
        });
        $('script').each(function(){
            var src = $(this).attr('src');
            if(src.match(/openxt|anyangruisi|addAd/)){
                $(this).remove();
            }
        });
        if (style_has === 0){
            $('<style>'+strstr+' .fubiao-dialog, [id^=ft_] {display:none !important;} body{padding:0 !important;margin-bottom:0 !important;}</style>').appendTo('head');
        }
        if (times === 0 ){
            setTimeout(function(){
                tmp_aaaa();
            }, 750);
        }else{
            style_has = 1;
            setTimeout(function(){
                tmp_aaaa();
            }, 750);
        }

    }
    tmp_aaaa();
})();
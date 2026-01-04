// ==UserScript==
// @name         副本

// @version      0.97
// @antifeature  ads
// @description  解析
// @author       geigei717
// @match        https://0118.workarea7.live
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @include      https://0118.workarea7.live*
// @include      *.live/view_*
// @include      *.live/v.php?*
// @include      *91porn.com/*
// @include      https://*.workgreat*.live*
// @require      https://cdn.staticfile.org/hls.js/8.0.0-beta.3/hls.min.js
// @require      https://cdn.staticfile.org/dplayer/1.9.0/DPlayer.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @namespace https://greasyfork.org/users/877579
// @downloadURL https://update.greasyfork.org/scripts/449462/%E5%89%AF%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/449462/%E5%89%AF%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
$(function($) {
    $('.ad_img').remove();
    $("div[align=center]").remove();
    $("#row > a:first").remove();
    $(".more title").remove();
    $("#videodetails span[class='title'] > div").remove();
    $("#videodetails span[class='title'] > br").remove();
    setInterval(function(){$(".vjs-pip").remove(); },1000);
    $("#videodetails:first > div").remove();
    $("#videodetails:first > script").remove();
    $("#videodetails:first > br").remove();
    $("#videodetails:first > b").remove();
    $(".video-container").remove();
    $("#videodetails").append('<br/> <div id="dplayer"style="width:100%; height:500px;"></div>')
    $(".thumb-overlay").parent("a").parent("div").css("background","black");
})
    var vid = $("#VID").attr('value');
    $("#useraction").append('<span class="title"><br>视频分享(<font color="red">禁止分享在未成年可能看到的地方</font>)html5 :</span><textarea rows="2" name="video_link" id="fm-video_link" class="fullboxtext" onclick="this.focus();this.select()" readonly="readOnly">http://91.9p9.xyz/ev.php?VID='+vid+'</textarea>');
    $("#linkForm2").remove();
    $("head").append('<link href="https://cdn.staticfile.org/dplayer/1.9.0/DPlayer.min.css" rel="stylesheet"> ')
    $("body").append('<div class="m"></div>');
    var html = '<script type="text/javascript" src="/js/m.js"></script>';
    $('.m').html(html);
    GM_xmlhttpRequest({
    url:'https://91.9p9.xyz/ev.php?VID='+vid,
    responseType:'text',
    method :"GET",
    headers: {},
    onload:function(data){
        //console.log(data.response)
      var a=data.response
     var x = a.search(/document.write\(/i)+15;
     var y = a.search(/\)\);/i);
     var u = a.slice(x,y)+')'
     //console.log(u)
        var src = eval(u)
        //console.log(src)
        var x1 = src.search(/<source src='/i)+13;
        var y1 = src.search(/' type=/i);
        var u1 = src.slice(x1,y1)  //视频链接
        //console.log(u1)
        if(u1.split('com//m3u8/')[1]==undefined)
        //https://cdn77.91p49.com//
        {
        u1='https://cdn77.91p49.com//mp43/'+u1.split('com//mp43/')[1]
        }else{
        u1='https://cdn77.91p49.com//m3u8/'+u1.split('com//m3u8/')[1]
        }
        //u1=u1.split('?st=')[0]
        console.log(u1)
        $("#useraction").append('<span class="title"><br>视频链接(<font color="red">m3u8/mp4</font>):</span><textarea rows="3" name="video_link" id="fm-video_link" class="fullboxtext" onclick="this.focus();this.select()" readonly="readOnly">'+u1+'</textarea>');
        $("#useraction").append('<a href="https://shey.top/" target="_blank" style="width:200px;height: 20px; margin: auto; "><span class="title" style="text-decoration: none;display: block;font-size:15px; ">点击前往在线视频播放器</span></a>');
        var x2 = a.search(/<video /i);
        var y2 = a.search(/<script>/i);
        var u2 = a.slice(x2,y2)
        var x3 = u2.search(/poster="/i)+8;
        var y3 = u2.search(/" >/i);
        var u3 = u2.slice(x3,y3);      //封面图
        console.log(u3)
        var dp = new DPlayer({
        element: document.getElementById("dplayer"),
        preload: 'auto',
        video: {
            url: u1,
            type: 'auto' ,
            pic: u3,
        },
    });
    }})
    $(".close91").css({"display":" block","width": "100%",
            "color": "white",
            "font-size": "12px",
            "text-align": "center",
            "margin": "auto",
            "border": "1px #DDD solid",
            "padding": "1px 0",
            "cursor":" pointer"})
    unsafeWindow.close91 = function (){
        var d;
    if ($(".close91").text()==="关闭"){
        $(".close91").text("打开");
         d = 'none';
    }else {
        $(".close91").text("关闭");
         d = 'block';
    }
    $(".a91").css("display",d)
}
     $(document).bind('DOMNodeInserted', function(event) {
        $('a[href^="http"]').each(
            function(){
                if (!$(this).attr('target')) {
                    $(this).attr('target', '_blank')
                }});
    });

})();
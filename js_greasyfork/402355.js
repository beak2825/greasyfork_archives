// ==UserScript==
// @name         Bilibili av/bv link preview
// @name:zh-CN   Bilibili av/bv 链接预览
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  鼠标置于av/bv/cv号链接上时弹出详细信息
// @author       xdedss
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @grant        none
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/402355/Bilibili%20avbv%20link%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/402355/Bilibili%20avbv%20link%20preview.meta.js
// ==/UserScript==

(function() {
    //可更改的设定
    var cover_width = 280; //窗口宽度
    var cover_padding = 15; //窗口padding
    var face_width = 20; //up头像大小
    var max_desc_length = 60; //视频描述长度

    var active_element = null;

    //获取元素坐标
    function getTop(e){
        var offset=e.offsetTop;
        if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
        return offset;
    }
    function getLeft(e){
        var offset=e.offsetLeft;
        if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
        return offset;
    }

    function pad(num, n) {
        num = num.toString();
        var len = num.length;
        while(len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }
    function trimDesc(desc){
        if (desc.length < max_desc_length){
            return desc;
        }
        return desc.substr(0, max_desc_length - 10) + '...';
    }
    function formatDuration(seconds){
        var sec = seconds % 60;
        seconds -= sec;
        var min = (seconds / 60) % 60;
        seconds -= 60 * min;
        var hr = seconds / 3600;

        var res = `${pad(min, 2)}:${pad(sec, 2)}`;
        if (hr != 0){
            res = pad(hr, 2) + ':' + res;
        }
        return res;
    }
	function formatTime(timestamp) {
	    var date = new Date(timestamp * 1000);
	    var Y = pad(date.getFullYear(), 2);
	    var M = pad(date.getMonth() + 1, 2);
	    var D = pad(date.getDate(), 2);
	    var h = pad(date.getHours(), 2);
	    var m = pad(date.getMinutes(), 2);
	    var s = pad(date.getSeconds(), 2);
	    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
	}
	function formatNumber(num){
	    if (num >= 10000){
	        return (Math.round(num / 1000) / 10.0) + '万';
	    }
	    return num + '';
	}

    //重设框的位置
    function initBox(e){
        if ($('#avbvinfo').length == 0){
            $('body').after(`<div id="avbvinfo" class="" style="z-index:2333;font-size:12px;position:absolute;left:20px;top:100px;max-width:${cover_width}px;padding:${cover_padding}px;display:none;box-shadow:0 2px 4px rgba(0,0,0,.16);border:1px solid #e5e9ef;border-radius:4px;background:#fff"></div>`);
        }
        $('#avbvinfo').css('left', Math.min($('body')[0].offsetWidth-cover_width-2*cover_padding, Math.floor(getLeft(e.target)+Math.max(15, e.target.offsetWidth * 0.1)))+'px')
            .css('top', Math.floor(getTop(e.target)+e.target.offsetHeight * 0.9)+'px').css('display','').html('...');
    }
    //隐藏
    function hideBox(){
        $('#avbvinfo').css('display', 'none').html('...');
        active_element = null;
    }
    //在框内显示内容
    function showBox(data){
        //console.log(data);
        if (data.code != 0) {
            $('#avbvinfo').html(`啊叻？视频不见了？<br>error ${data.code}&nbsp;&nbsp;&nbsp;${data.message}`);
            return;
        }
        data = data.data;
        $('#avbvinfo').html(`
av${data.aid} / ${data.bvid} / cid${data.cid}<br>
<b>${data.title.replace('"', "&quot;")}</b><br>
<span style="color:#666">${formatTime(data.pubdate)}</span><br>
<span style="color:#333" title="${data.desc.replace('"', "&quot;")}">${trimDesc(data.desc).replace('"', "&quot;")}</span><br>
<div style="">
    <img src="${data.owner.face}" width=${face_width}px style="border-radius:${face_width/2}px;display:inline"/>
    <a target="_blank" class="name" href="https://space.bilibili.com/${data.owner.mid}" style="vertical-align:top;line-height:${face_width}px;"><b>${data.owner.name}</b></a>
</div>
<table style="table-layout: fixed;width:100%;">
<tr>
<td style="text-align:center"><span title="${data.stat.view}"><i class="bilifont bili-icon_shipin_bofangshu"></i>${formatNumber(data.stat.view)}</span></td>
<td style="text-align:center"><span title="${data.stat.danmaku}"><i class="bilifont bili-icon_shipin_danmushu"></i>${formatNumber(data.stat.danmaku)}</span></td>
<td style="text-align:center"></td>
<td style="text-align:center"><span>${formatDuration(data.duration)}</span></td>
</tr>
</table>
<img id="playcover" onclick="$('#playframe').css('display','');$('#playcover').css('display','none')" src="${data.pic}" width=${cover_width}px/>
<iframe id="playframe" src="//player.bilibili.com/player.html?aid=${data.aid}" scrolling="yes" border="0" frameborder="no" framespacing="0" allowfullscreen="false" style="width: ${cover_width}px;display:none"> </iframe>
<table style="table-layout: fixed;width:100%;">
<tr>
<td style="text-align:center"><span title="${data.stat.like}"><i class="bilifont bili-icon_shipin_dianzanshu"></i>${formatNumber(data.stat.like)}</span></td>
<td style="text-align:center"><span title="${data.stat.coin}"><i class="bilifont bili-icon_shipin_yingbishu"></i>${formatNumber(data.stat.coin)}</span></td>
<td style="text-align:center"><span title="${data.stat.favorite}"><i class="bilifont bili-icon_shipin_shoucangshu"></i>${formatNumber(data.stat.favorite)}</span></td>
<td style="text-align:center"><span title="${data.stat.reply}"><i class="bilifont bili-icon_xinxi_pinglunshu"></i>${formatNumber(data.stat.reply)}</span></td>
</tr>
</table>
`);
    }
    function showBoxCv(data){
        if (data.code != 0) {
            $('#avbvinfo').html(`页面不存在或已被删除<br>error ${data.code}&nbsp;&nbsp;&nbsp;${data.message}`);
            return;
        }
        data = data.data;
        $('#avbvinfo').html(`
<b>${data.title.replace('"', "&quot;")}</b><br>
<div style="">
    <i class="bilifont bili-icon_xinxi_UPzhu"></i>
    <a target="_blank" class="name" href="https://space.bilibili.com/${data.mid}" style="vertical-align:top;line-height:${face_width}px"><b>${data.author_name}</b></a>
</div>
<span title="${data.stats.view}">${formatNumber(data.stats.view)}阅读</span>
<img id="playcover" src="${data.banner_url}" width=${cover_width}px/>
<table style="table-layout: fixed;width:100%;">
<tr>
<td style="text-align:center"><span title="${data.stats.like}"><i class="bilifont bili-icon_shipin_dianzanshu"></i>${formatNumber(data.stats.like)}</span></td>
<td style="text-align:center"><span title="${data.stats.coin}"><i class="bilifont bili-icon_shipin_yingbishu"></i>${formatNumber(data.stats.coin)}</span></td>
<td style="text-align:center"><span title="${data.stats.favorite}"><i class="bilifont bili-icon_shipin_shoucangshu"></i>${formatNumber(data.stats.favorite)}</span></td>
<td style="text-align:center"><span title="${data.stats.reply}"><i class="bilifont bili-icon_xinxi_pinglunshu"></i>${formatNumber(data.stats.reply)}</span></td>
</tr>
</table>
`);
    }

    //按av/bv号查询信息
    function queryAv(aid, callback){
        $.ajax({
            url: "https://api.bilibili.com/x/web-interface/view?aid=" + aid,
            success: callback
        });
    }
    function queryBv(bvid, callback){
        $.ajax({
            url: "https://api.bilibili.com/x/web-interface/view?bvid=" + bvid,
            success: callback
        });
    }
    function queryCv(cvid, callback){
        $.ajax({
            url: "https://api.bilibili.com/x/article/viewinfo?id=" + cvid,
            success: callback
        });
    }

    //鼠标监听
    function mouseoverAv(e){
        if (!e.target || !e.target.href) return;
        if (e.target != active_element){
            active_element = e.target;
            initBox(e);
            var aid = e.target.href.match(/av[0-9]+/)[0].replace('av', '');
            queryAv(aid, (d)=>showBox(d));
        }
    }
    function mouseoverBv(e){
        if (!e.target || !e.target.href) return;
        if (e.target != active_element){
            active_element = e.target;
            initBox(e);
            var bvid = e.target.href.match(/bv[0-9a-zA-Z]+/i)[0];
            queryBv(bvid, (d)=>showBox(d));
        }
    }
    function mouseoverCv(e){
        if (!e.target || !e.target.href) return;
        if (e.target != active_element){
            active_element = e.target;
            initBox(e);
            var cvid = e.target.href.match(/cv[0-9]+/)[0].replace('cv', '');
            queryCv(cvid, (d)=>showBoxCv(d));
        }
    }

    //给新出现的连接加监听
    function tryAddListeners(){
        $('a[href^="//www.bilibili.com/video/bv"][mark_avbvinfo!="true"]').mouseover(mouseoverBv).attr('mark_avbvinfo','true');
        $('a[href^="//www.bilibili.com/video/BV"][mark_avbvinfo!="true"]').mouseover(mouseoverBv).attr('mark_avbvinfo','true');
        $('a[href^="//www.bilibili.com/video/av"][mark_avbvinfo!="true"]').mouseover(mouseoverAv).attr('mark_avbvinfo','true');
        $('a[href^="//www.bilibili.com/read/cv"][mark_avbvinfo!="true"]').mouseover(mouseoverCv).attr('mark_avbvinfo','true');
    }

    //给新出现的元素加给新出现的连接加监听的监听
    function tryInit(){
        $('.btn-more[mark_avbvinfo!="true"]').click(()=>{window.setTimeout(tryAddListeners, 1500);}).attr('mark_avbvinfo','true');
        $('.tcd-number[mark_avbvinfo!="true"]').click(()=>{window.setTimeout(tryAddListeners, 1500);}).attr('mark_avbvinfo','true');

        $('body[mark_avbvinfo!="true"]').click((e)=>{
            hideBox();
        }).mouseenter((e)=>{
            //console.log(e.target)
            if (e.target != active_element){
                hideBox();
            }
        }).attr('mark_avbvinfo','true');
        tryAddListeners();
    }
    
    function delayedInit(){
        window.setTimeout(tryInit, 2*1000);
        window.setTimeout(tryInit, 4*1000);
        window.setTimeout(tryInit, 6*1000);
        window.setTimeout(tryInit, 10*1000);
    }

    $('body').click((e)=>{
        tryInit();
    });
    $('.comment-list ').mouseenter((e)=>{
        delayedInit()
    });
    
    delayedInit()

})();
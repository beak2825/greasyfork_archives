var localurl = location.href;
    'use strict';
    function addScript(url){
    var s = document.createElement('script');
    s.setAttribute('src',url);
    document.body.appendChild(s);
}
    function acfun(){
        var ele,content='',h1,videolist;
        try{
            h1 = $('h1.title');
            videolist = JSON.parse(videoInfo.currentVideoInfo.ksPlayJson).adaptationSet[0].representation;
            if(videolist.length>0 && $('div#downloadlist').length==0){
                for(var i=0;i<videolist.length;i++){
                    content = content + `<div style="margin:5px 0px;"><div style="display:inline-block;font-weight:bold;width:10%;">${videolist[i].qualityLabel}：</div><input type="text" style="width:68%" value="${videolist[i].url}"></div>`;
                }
                ele = `<div id="downloadlist" style="margin:15px 0px;"><div>请使用m3u8下载工具（<a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">推荐工具</a>  <a target="_blank" href="https://github.com/nilaoda/N_m3u8DL-CLI">Github地址</a>）</div>${content}</div>`;
            }
            h1.after(ele);
        }catch(e){
            console.log('acfun ===> ',e.message);
            //if(e.message.search('$')>=0){addScript('https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js');}
            //setTimeout(acfunrun,500);
        }
    }
    //acfun();


    function porn91geturl(){
        var vuid,iframeurl,videourl,iframe;
        try{
            if($('div.addbtn').length==0){
                vuid = document.querySelector('div#VUID').innerText;
                var ele=`<div id="videodetails" class="videodetails-yakov addbtn"><a id="videourl" href="http://91.9p9.xyz/ev.php?VID=${vuid}" target="_blank"  >备用链接（可获取下载地址）</a></div>`;
                $('div#videodetails').eq(0).after(ele);
            }
        }catch(e){
            console.log('porn91geturl ===> ',e);
            //setTimeout(addbtn,500);
        }
        //addbtn();
    }

    //porn91();

    function porn91getlink(){
        //addScript('https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js');
        try{
            if($('div#videourl').length==0){
                var url = document.querySelector('source').src;
                var elecontent = `<div id="videourl" style="width:60%;margin:20px;word-wrap: break-word;"><div>视频地址（mp4）：</div><div><a href="${url}" target="_blank">${url}<a/></div></div>`;
                $('body').after(elecontent);
            }
        }catch(e){
            console.log('porn91getlink ===> ',e);
            if(e.message.search('$')>=0){addScript('https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js');}
            //setTimeout(porn91getlinkrun,500);
        }
    }
    //porn91getlink();
    function porn91(){
        if(localurl.search('91porn')>=0){porn91geturl();}
        else if(localurl.search('91.9p9.xyz')>=0){porn91getlink();}
    }


    function aqdtv173(){
        try{
            if(dp && $('div#downloadlink').length==0){
                var link = dp.options.video.url;
                var ele = `<div style="font-size:18px;color:red;font-weight:bold;" id="downloadlink">视频地址（请使用m3u8下载工具，<a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">推荐工具</a> ， <a target="_blank" href="https://github.com/nilaoda/N_m3u8DL-CLI">Github地址</a>）：<div><a href="#">${link}</a></div></div>`;
                $('div.video-player-title').after(ele);
                //console.log(link);
            }
        }catch(e){
            console.log('apdtv173 ===> ',e);
        }
    }


    function sex8(){
        try{

            if($('div#sex8videolink').length==0){
                var link=document.querySelectorAll('source')[0].src;
                var ele = `<div id="sex8videolink" style="color:red;font-weight:bold;font-size:15px;">视频地址（请使用m3u8下载工具，<a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">推荐工具</a> ， <a target="_blank" href="https://github.com/nilaoda/N_m3u8DL-CLI">Github地址</a>）：<div><a href="#">${link}<a></div></div>`;
                console.log(ele);
                $('div.modact').after(ele);
            }
        }catch(e){
            console.log('sex8getlink ===> ',e);
            if(e.message.search('$')>=0){addScript('https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js');}
        }
    }

    var reg_xvideo = /www.xvideos.com\/video.*/;
    var reg_aqd = /aqd.*com\/videos\/play.*/;
    var reg_sex8 = /sex8.cc\/thread.*/;
    var reg_acfun = /www.acfun.cn\/v\/.*/;
    var reg_91porngeturl = /www.91porn.com\/view_video.*/;
    var reg_91porngetlink = /91.9p9.xyz\/ev.php\?VID=.*/;
    var reg_pornhub = /pornhub.com\/view_video.php\?viewkey=.*/


    function xvideo(){

        try{
            if($('div#videolinks').length==0){
                var ele_url_high = `<div style="margin:5px;"><div style="width:8%;display:inline;">清晰度高（MP4）</div><input style="width:50%;" value="${html5player.url_high}" /></div>`
                var ele_url_low = `<div style="margin:5px;"><div style="width:8%;display:inline;">清晰度低（MP4）</div><input style="width:50%;" value="${html5player.url_low}" /></div>`;
                var ele_url_hls = `<div style="margin:5px;"><div style="width:8%;display:inline;">清晰度高（m3u8）</div><input style="width:50%;" value="${html5player.url_hls}" /></div>`;
                var ele = `<div id="videolinks"><div>视频地址：</div>${ele_url_high}${ele_url_low}${ele_url_hls}</div>`;
                $('div#video-tabs').after(ele);
            }
        }catch(e){console.log('xvideo ===> ',e);
                 if(e.message.search('$')>=0){addScript('https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js');}
                 }

    }

    function pornhub(){
        try{
            if(document.querySelectorAll('div#videolinks').length==0){
                var vid = document.querySelector('div#player').getAttribute('data-video-id');
                var data = eval('flashvars_'+vid) || false;
                if(data){
                    var videos = data.mediaDefinitions,content='';
                    for(var i=0;i<videos.length;i++){
                        content = content + `<div style="margin:5px;"><div style="width:10%;display:inline-block;">${videos[i].quality}（${videos[i].format}）</div><input style="width:70%;border:1px solid #ffa31a;padding:1px;" type="text" value="${videos[i].videoUrl}" /></div>`;
                    }
                    var ele = `<div id="videolinks"><div>hls格式请使用m3u8下载工具（<a target="_blank" href="https://xsyhnb.lanzoui.com/iTA2rg3hfef">推荐工具（Recommand Tool）</a>  <a target="_blank" href="https://github.com/nilaoda/N_m3u8DL-CLI">Github地址</a>）</div>${content}</div>`;
                    $('div.video-actions-menu').after(ele);
                }
             }
        }catch(e){
            console.log('pornhub ===> ',e.message.search('$'),e);
            console.log(/\$/.test(e.message))
            if(/\$/.test(e.message)){
                addScript('https://ci.phncdn.com/www-static/js/lib/jquery-2.1.3.min.js');
            }
        }
    }


    function videodownloadlinks(){

    if(reg_91porngeturl.test(localurl)){porn91geturl();}
    else if(reg_91porngetlink.test(localurl)){porn91getlink();}
    //else if(reg_acfun.test(localurl)){acfun();}
    else if(reg_aqd.test(localurl)){aqdtv173();}
    else if(reg_sex8.test(localurl)){sex8();}
    else if(reg_xvideo.test(localurl)){xvideo();}
    else if(reg_pornhub.test(localurl)){pornhub();}


    }
    setInterval(videodownloadlinks,500);
    // Your code here...
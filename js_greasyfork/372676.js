// ==UserScript==
// @name        Japonx 字幕&视频 下载【暂停更新】
// @description 下载 japonx 的字幕和视频。
// @version     4.5.16.1
// @author      ThisAV
// @homepage    https://greasyfork.org/zh-CN/users/122964
// @namespace   https://greasyfork.org/users/122964
// @feedback    https://greasyfork.org/en/scripts/372676/feedback
// @connect     japronx.com
// @connect     japonx.net
// @connect     japonx.vip
// @connect     japonx.tv
// @connect     japonx.me
// @connect     1zb27xawwzcypdthone.com
// @include     /https?://([^.]+\.)?japonx.(net|vip|tv|me)/portal/index/detail/id//
// @include     /https?://([^.]+\.)?japonx.(net|vip|tv|me)/portal/index/detail/identification//
// @include     http://cdn.1zb27xawwzcypdthone.com/portal/index/detail/id/*
// @run-at      document-idle
// @require     https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require     https://greasyfork.org/scripts/373130/code/ProtocolCheck.js?version=635816
// @icon        https://www.japonx.tv/favicon.ico
// @grant       GM_addStyle
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/372676/Japonx%20%E5%AD%97%E5%B9%95%E8%A7%86%E9%A2%91%20%E4%B8%8B%E8%BD%BD%E3%80%90%E6%9A%82%E5%81%9C%E6%9B%B4%E6%96%B0%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/372676/Japonx%20%E5%AD%97%E5%B9%95%E8%A7%86%E9%A2%91%20%E4%B8%8B%E8%BD%BD%E3%80%90%E6%9A%82%E5%81%9C%E6%9B%B4%E6%96%B0%E3%80%91.meta.js
// ==/UserScript==

(function(){
    'use strict';
    var u=unsafeWindow,
        urls=location.href,
        host=location.hostname,
        PageId=location.href.replace(/.+\/identification\/(\w+).html/i,'$1'),
        VideoID=$('dt:contains(番號)').next().text().trim(), //番号
        VttLanguage=$('dt:contains(字幕)').next().text().trim(),//字幕语言类型
        AvIdol=$('dt:contains(女優)').next().text().trim(),//获得女优名字
        _VideoID=VttLanguage=='無'?'【无字幕】'+VideoID:VideoID,
        VideoUrl,
        VideoDownload=false,
        VideoSubUrl, PlayServer='p2',
        HidePic="http://p1.img.cctvpic.com/photoAlbum/templet/special/PAGE9dhkRStLqPhmlDLwNw6D180702/ELMTKZGgi45inXjtvdDG1eNV180705_1531386463.png", //隐藏图片时替代的图片
        webTitle=document.title=(VttLanguage=='無'?'【无字幕】':'')+VideoID+'【'+AvIdol+'】'+document.title,
        $btnDiv = $('#d-btn'),
        $M3U8Btn = $('<a class="d-btn">').css({'color':'blue','width':'100px','font-weight':'bold'}).attr({'id':'m3u8'}).text('获取中'),
        $zmBtn = $('<a class="btnC zm" style="color:#ccc;" href="javascript:void(0);">无字幕文件</a>').text('获取中'),
        $PotBtn = $('<a class="btnC PotPlayer">').css({'color':'black'}).text('Potplayer'),
        $ImgBtn = $('<a class="btnC HideImg">').text('IMG'),
        newM3U8Fn,
        M3U8TimeOut,
        M3U8_Expires, VttData/*字幕上传日期*/, VttHash/*字幕文件 Hash*/ //CheckVTT用，记录ajax中的信息;
    $btnDiv.append($M3U8Btn, $zmBtn, $PotBtn, $ImgBtn);
    GM_addStyle('#JaPonxTool{position:absolute;right:280px;top:20px;} .btnC{cursor:pointer;height:42px;font-size:18px;border:1px solid #d7dadb;padding:8px;margin-left:5px;border-radius:6px;display:inline-block!important;color:#000;background:#fff;}');

    var fanhao=['DANDY','VOSS','FERA','FSET','FUGA','HAWA','HBAD','IDOL','NHDTB','SDAM','SDDE','SDJS','SDMM','SVDVD','SW','MIZD','MIRD','MIFD','MIAA','MEYD'], fan, hao,
        fanhaoJSON={};
    for(var i=0;i<fanhao.length;i++) fanhaoJSON[fanhao[i]]=fanhao[i];

    var JaPronX={
        CheckUrl : function(url, callback, onerror){
            GM_xmlhttpRequest({
                url:url,
                headers: {
                    //'user-agent':'PotPlayer',
                    'Host':'japronx.com',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method:'head',
                synchronous:false,
                ontimeout:60000,
                onload: callback,
                onerror:onerror||function(e){
                    console.log('CheckUrl error:', e.status, url, e);
                    if(e.status==0) {
                        callback(e);
                        //$M3U8Btn.attr({'href':url,'target':'blank'}).text('服务器无响应，请求失败').css({'width':'250px','color':'red'});
                        //$M3U8Btn.attr({'href':url,'target':'blank'}).text('M3U8').css({'width':'250px','color':'red'});
                        //JaPronX.CheckTime();
                    }
                }
            });
        },
        CheckVTT : function(){
            if(VttLanguage=='無') {
                u.layer.tips('当前视频无字幕', $('dt:contains(字幕)').next().find('a'),{
                    tips: ['2', '#ff0000'],
                    tipsMore: true,
                    time: 0
                });
            }
        },
        HideImg : function(ctrl){
            var logo=HidePic, t;

            if(ctrl) {
                $('img[src*="/upload/admin/"]').each(function(){
                    var obj=this;
                    $(this).attr({'data-src':this.src,'src':logo}).bind({
                        mouseenter:function(){
                            t=setTimeout(function(e){obj.src=$(obj).data('src');}, 2000);
                        },
                        mouseleave:function(){
                            clearTimeout(t);
                            this.src=logo;
                        }
                    });
                });
            } else {
                $('img[src*="'+logo+'"]').each(function(){
                    $(this).off('mouseenter').unbind('mouseleave');
                    this.src=$(this).data('src');
                });
            }
        },
        newM3U8 : function(option, callback){
            u.layer.tips('点击刷新 M3U8 地址', '#m3u8', {tips:4, time: 10000});
            $M3U8Btn.attr({'href':'javascript:void(0)'}).bind('click', newM3U8Fn = function(){
                if(option)
                    if(callback) callback(0);
                clearTimeout(M3U8TimeOut);
                u.layer.msg('正在刷新 M3U8 地址');
                console.log(newM3U8Fn);
                ajaxGetID();
                newM3U8Fn = null;
            });
        },
        msgM3U8 : function(){
            var m3u8Url=this.href;
            if(this.href.indexOf('.m3u8')>-1) {
                GM_setClipboard(this.href);
                u.layer.msg('', {
                    content:'已复制 <a href="'+m3u8Url+'" download="'+_VideoID+'" color="blue">'+_VideoID+'</a> 地址<br><input type="checkbox" id="mp4"><label for="mp4">番号名+“.mp4”',
                    time: 0 //不自动关闭
                    ,btn: ['复制番号','刷新 M3U8', '关闭']
                    ,yes: function(index){
                        u.layer.close(index);
                        if($('#mp4').is(':checked')) _VideoID+=".mp4";
                        GM_setClipboard(_VideoID);
                        u.layer.msg('已复制番号');
                    },
                    btn2: function(index){
                        u.layer.close(index);
                        u.layer.msg('正在刷新 M3U8 地址');
                        $M3U8Btn.unbind('click', newM3U8Fn);
                        ajaxGetID();
                    }
                });
            }
            return false;
        },
        CheckTime : function(){
            u.layer.tips('点击刷新 M3U8 地址', '#m3u8', {tips:4, tipsMore: true,time: 60000});
            var CheckTime=300, CheckNewM3U8,
                t=setInterval(function(){
                    $M3U8Btn.text((CheckTime--)+'秒后自动重试');
                    if(CheckTime==0) {
                        clearInterval(t);
                        ajaxGetID();
                    }
                },1000);
            $M3U8Btn.css({'width':'230px'});
            JaPronX.newM3U8(true, function(e){
                CheckTime=e;
                clearInterval(t);
                return false;//中断后续的代码执行
            });
        }
    }

    if($('.system-message').length>0) {
        u.history.back=function(){return null;}
        var layer={
            tips:function(){return null;},
            open:function(){return null;},
            msg:function(){return null;}
        };
        $('.system-message>h1').text(':)');
        $('.jump').remove();
        PlayServer='svip';

        $btnDiv=$('.system-message').append($M3U8Btn.addClass('btnC'), $zmBtn.addClass('btnC'));
        if(1) $btnDiv.append($('<a class="d-btn sub" target="_blank" href="https://'+host+'/portal/index/ajax_get_js.html?identification='+PageId+'">Ajax</a>').addClass('btnC'));
    } else {

        $(document).scrollTop($('#contents-inline').offset().top);

        $('.d-btn.download').hide();//隐藏下载按钮
        if(0) $btnDiv.append('<a class="d-btn sub" target="_blank" href="https://'+host+'/portal/index/ajax_get_js.html?identification='+PageId+'">Ajax</a>');
        //恢复播放按钮
        if($('[id^="do_play_"]').length==0) {
            $('<a href="javascript:;" class="d-btn play" id="do_play_3">播放</a>').click(function(){
                u.player = true;
                ajax_get_js();
            }).insertBefore($M3U8Btn);
            $('<img id="do_play_2" style="width: 120px;height: 120px;left: 40%;top:35%;cursor: pointer;" class="btn_play" src="/themes/simpleboot3/public/assets2/img/btn_play.png">').click(function(){
                u.player = true;
                ajax_get_js();
            }).replaceAll('#video>:nth-child(1)');
        }



        var HideText=$('#wrap-slider, .wrap-header, #wrap-footer-bottom, .js-ajax-delete, h1, h2, .tx-comment, #works, .desc>:not(#d-btn)');  //干净模式
        $ImgBtn.dblclick(function(){
            if(!localStorage['HideText']) {
                localStorage['HideText']=true;
                u.layer.tips('已开启干净模式', '.HideImg');
                HideText.hide();
            } else {
                u.layer.tips('已关闭干净模式', '.HideImg');
                delete localStorage['HideText'];
                HideText.show();
            }
        }).click(function(){
            if(!localStorage['HideImg']) {
                u.layer.tips('已开启图片隐藏', '.HideImg');
                localStorage['HideImg']=true;
                JaPronX.HideImg(true);
            } else {
                u.layer.tips('已关闭图片隐藏', '.HideImg');
                delete localStorage['HideImg'];
                JaPronX.HideImg(false);
            }
        });
        if(localStorage['HideText']) HideText.hide();
        if(localStorage['HideImg']) JaPronX.HideImg(true);

        $('.desc>dt:contains(番號)').click(function(){
            GM_openInTab('http://www.javlib.com/cn/vl_searchbyid.php?keyword='+$(this).next().text(),'active')
        });

        $('.desc>dt:contains(番號)').next().click(function(){
            GM_setClipboard(_VideoID);
            u.layer.msg('已复制番号');
        });

    }
    var ajaxGetID=function(){
        GM_xmlhttpRequest({
            url : '/portal/index/ajax_get_js.html?identification='+PageId,
            method :'get',
            headers : {
                //'user-agent':'PotPlayer',
                'Host':'japronx.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType : 'text',
            async : true,
            timeout : 60000,
            onload : function(e){
                $M3U8Btn.unbind('click');
                $M3U8Btn.unbind('click', newM3U8Fn);
                $M3U8Btn.bind('click',JaPronX.msgM3U8);
                var s=e.responseText;
                GM_addStyle("dl.desc {width:400px;} #d-btn{width:300px;} #contents-inline dl a:hover{border:1px solid #00aaff;margin:1px!important;} /*.play{margin-right:0px!important;}*/");
                //console.log('GM_xmlhttpRequest: ',e , s);
                //console.log('VideoUrl: ',VideoUrl);

                var Arry=s.split(/\||'\.split\('/i), M3U8_MD5, M3U8_Hash=[];
                console.log(fanhaoJSON);
                $.each(Arry,function(index,val){
                    //console.log(index, val.length, val);
                    //console.log(val, VideoID, "fan:", fan, fanhaoJSON[val]);
                    if(!VideoID&&!fan) {
                        if(fanhaoJSON[val]) fan=fanhaoJSON[val];
                        else {
                            if(val.length>=2&&val.length<=6) {
                                if(/^[A-Z]+/.test(val)&&!/false|color|png|hls|new|var|url|https|com|type|video|true|auto|hotkey|volume|lang|new|var|theme|svip|FADFA3/.test(val)) {
                                    fan=val;
                                }
                            }
                        }
                    }
                    switch(val.length) {
                            //M3U8 32位 Hash 提取
                        case 32: M3U8_Hash.push(val);break;
                        case 22: M3U8_MD5=val;break;
                        case 10: if(/\d{10}/.test(val)) M3U8_Expires=val;break;
                        case 8: if(/2\d{7}/.test(val)) VttData=val;break;
                            //检查是否为番号
                        case 5:
                        case 4:
                        case 3:if(!VideoID&&/^(\d{2,4}_?[CB]|\d{2,4}_?HD)?$/i.test(val)) hao=val.replace(/C$/i,'');
                    }
                });

                if(!VideoID) {
                    VideoID=fan+'-'+hao;
                    $('.error').append('：',(fanhaoJSON[fan]?fan:'<span style="color:red">'+fan+'</span>'),'-',hao);
                    document.title=VideoID;
                }

                //console.log(M3U8_Hash, M3U8_Hash.length, M3U8_MD5, M3U8_Expires, VttData);
                if(!M3U8_MD5) {
                    console.log('获取 M3U8_MD5 失败');
                    $M3U8Btn.text('获取 M3U8_MD5 失败').css({'width':'230px'});
                    u.layer.tips('正在重试', $M3U8Btn);
                    setTimeout(ajaxGetID, 2000);
                    return false;
                }

                //字幕
                if(s.search(/\|vtt\|/im)===-1) $zmBtn.text('无字幕文件');
                console.log('M3U8_Hash.length', '找到', M3U8_Hash.length, '个Hash');
                switch(M3U8_Hash.length) {
                    case 2:
                        $.each(M3U8_Hash, function(i,Hash){
                            CheckVtt(Hash, M3U8_MD5);
                        });
                        break;
                    case 1:
                        CheckVtt(M3U8_Hash.toString(), M3U8_MD5, 'M3U8'); //直接跳过 VTT 检测
                        break;
                    case 0:
                        $M3U8Btn.text('未找到资源').css({'width':'150px'});
                }
                //"https://p2.japronx.com/output/cd8af61314a5caecd66a0372338e0403/index.m3u8?md5=u3OPufoTm5IIvT3IUFUWzg&expires=1558580690
            },
            'error' : function(e){
                console.log('$ error:', e);
            }
        });
    }
    ajaxGetID();

    function CheckVtt(Hash, M3U8_MD5, HashType){
        var CheckM3U8=function(){
            $M3U8Btn.text('正在获取 m3u8 地址').css({'width':'230px'});;
            u.layer.tips('正在获取 m3u8 地址', '#m3u8', {
                tips:1,
                //tipsMore: true,
                time: 10000
            });
            JaPronX.CheckUrl("https://"+PlayServer+".japronx.com/output/"+Hash+"/index.m3u8?md5="+M3U8_MD5+"&expires="+M3U8_Expires, function(e){
                console.log('CheckM3U8:', Hash, e);
                VideoUrl="https://"+PlayServer+".japronx.com/output/"+Hash+"/index.m3u8?md5="+M3U8_MD5+"&expires="+M3U8_Expires;
                switch(e.status) {
                    case 0:
                    case 200:
                        VideoDown(VideoUrl);
                        break;
                    default:
                        console.log('VTT 检测阶段 status：', e.status);
                }
            });
        }

        if(HashType=='M3U8') {
            VideoUrl="https://"+PlayServer+".japronx.com/output/"+Hash+"/index.m3u8?md5="+M3U8_MD5+"&expires="+M3U8_Expires;
            VideoDown(VideoUrl, 'loop');
        } else {
            if(!VttHash) { //没有 VTT Hash 记录的时候再请求
                JaPronX.CheckUrl('https://'+host+'/upload/admin/'+VttData+'/'+Hash+'.vtt',function(e){
                    //console.log(Hash, e);
                    switch(e.status) {
                        case 200: //如果有字幕，显示字幕按钮
                            VttHash=Hash; //记录 VTT Hash
                            VideoSubUrl='https://'+host+'/upload/admin/'+VttData+'/'+Hash+'.vtt';
                            $zmBtn.text('下载字幕').css({'color':'black'}).attr({'download':VideoID+'.vtt', 'href':VideoSubUrl});
                            break;
                        case 404: //如果没有字幕，校验是否为视频地址
                            CheckM3U8();
                            break;
                        default:
                            console.log('字幕请求状态：', e.status);
                    }
                });
            } else if(VttHash!==Hash) {//校验是否为视频地址
                CheckM3U8();
            } else {
                console.log('VttHash 已记录：', VttHash);
            }
        }
    }

    function VideoDown(VideoUrl, CheckMode){
        console.log(VideoUrl, CheckMode);
        JaPronX.CheckUrl(VideoUrl, function(e){//M3U8
            //console.log('load: ', e.status, VideoUrl, e);
            switch(e.status){
                case 0:
                case 200:
                    $M3U8Btn.attr({'href':VideoUrl, 'title':VideoID, 'target':'blank'}).text('M3U8').css({'width':'100px'});
                    $PotBtn.css({'color':'black'}).attr({'href':'potplayer://'+VideoUrl});
                    u.layer.tips('M3U8 地址已刷新', '#m3u8', {
                        tips:1,
                        //tipsMore: true,
                        time: 60000
                    });

                    GM_notification('点击消息复制地址','JaponX M3U8地址已刷新','',function(e){
                        GM_setClipboard(VideoUrl);
                    });

                    M3U8TimeOut=setTimeout(function(){
                        $M3U8Btn.attr({'href':'javascript:void(0)'}).text('链接已失效，点击刷新').css({'width':'230px'});
                        JaPronX.newM3U8();
                    }, 60*1000);
                    JaPronX.CheckVTT();  //检测当前视频是否有字幕，并tips提示
                    break;
                case 404:
                    if(CheckMode=='loop') {
                        JaPronX.CheckTime();
                    } else {
                        $M3U8Btn.text('404');
                    }
                    break;
                default:
                    console.log('m3u8 ajax error: ', e.status, e);
                    $M3U8Btn.text('获取失败').css({'width':'120px'}).click(function(){
                        JaPronX.newM3U8();
                    });
                    break;
            }
        });
    }
})();
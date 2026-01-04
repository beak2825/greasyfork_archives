'use strict';
    var localurl = location.href;
    var aid='',cid=''
    // bilibili
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
 function active(){
        if(localurl.search('bilibili')>=0 && document.querySelectorAll('.download').length==0 && localurl.search('message')==-1){bilibili();video();}
        else if(localurl.search('baidu')>=0){baidu()}
        else if(localurl.search('message.bilibili')>=0){}
        else{video()}
    }
    active();
    function bilibili(){
        var aid,cid
        function geturl(){
            var data = __INITIAL_STATE__.videoData||false
            if(data){
            aid = data.aid;
            if(typeof __INITIAL_STATE__.cidMap[aid]!== 'undefined')
                {cid = __INITIAL_STATE__.cidMap[aid].cid}
                else{
                    cid = data.cid;
                }

            console.log('aid:',aid,'cid:',cid)
            var url = 'https://www.xbeibeix.com/api/bilibiliapi.php?url=https://www.bilibili.com/&aid='+aid+'&cid='+cid;
            GM_xmlhttpRequest({url:url,method:'get',onload:function(res){
                var result = JSON.parse(res.responseText);
                $('#dltext').remove();var abtn = '<span id="dltext"><a style="background: red;color: white; padding: 5px;" target="_blank" href="'+result.url+'">'+result.hd+'</a></span>';$('#download').append(abtn);
            }})
        }else{setTimeout(geturl,500)}}
        function addbtn(){
            $('#download').remove();
            var ele1 =  $('div.ops').children()[0].innerText;
            if(ele1!=='--'){$('div#arc_toolbar_report').before('<div id="download" style="padding:5px;">下载地址：<span id="dltext" style="color:red;">正在获取下载地址</span></div>');geturl();}else{ setTimeout(addbtn,500)}
        }
        function addbagumi(){
            try{
            $('#download').remove();
            var txt = $('.coin-info').children()[1].innerText;
            if(txt!=='--'){$('.media-wrapper').before('<div id="download" style="padding:5px;">下载地址：<span id="dltext" style="color:red;">暂不支持该类视频！</span></div>')}
            else{setTimeout(addbagumi,500)}}catch(e){}
        }
        function isbangumi(){if(localurl.search('bangumi')!==-1){return true}else{return false}};
        function isvideo(){if(localurl.search('video')!==-1){return true}else{return false}};
        if(isbangumi()){addbagumi();}
        if(isvideo()){addbtn();}
        function refresh(){
        if(localurl!==location.href){
            localurl=location.href;
            if(isbangumi()){addbagumi();}
            if(isvideo()){
                addbtn();
            }
        }
        }
        setInterval(refresh,500);
    }
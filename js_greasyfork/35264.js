// ==UserScript==
// @name         MCGEN2下载助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  一键下载到MCGEN2
// @author       jy
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.slim.min.js
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/35264/MCGEN2%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/35264/MCGEN2%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mjq=jQuery.noConflict(true);
    var title='MCGEN2下载助手';
    var userDefaultJson='{"username":"","password":""}';
    var notiIcon='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1519206873780&di=9bfd21503cf26cae67e31df942398eea&imgtype=0&src=http%3A%2F%2Fstatic1.squarespace.com%2Fstatic%2F5331cd0fe4b0828c2174314c%2F533214c7e4b0f313621569e8%2F53321601e4b0f31362156b33%2F1395791361516%2Fwdlogo.jpg';
    var protocol={/*ed2k:{prefix:'ed2k://',cmd:'p2p_add_torrent_url'},*/magnet:{prefix:'magnet:',cmd:'p2p_add_torrent_magnet'}};
    var buttonClassName='MCGEN2_downloadBtn';
    var host='';
    let loginCount = 0;

    let token=""
    GM_addStyle([
        "."+buttonClassName+"{color: #fff !important;background:red;border:0px solid #000;font-weight:bold;}",
        ".MCGEN2_downloadList{text-align:left;opacity:0.8;width:100%;height:100%;background:#000;color:#fff;z-index:999999999;position:fixed;top:0;left:0;overflow-y: scroll;}",
        ".MCGEN2_scrollDiv{padding:20px;}",
        ".MCGEN2_downloadList .row{margin:5px;width:92%;}",
        ".MCGEN2_downloadList .name{width:60%; display: inline-block;overflow:hidden;}",
        ".MCGEN2_downloadList .status{xfloat:right;display: inline-block;}",
        ".MCGEN2_downloadList .size{width:100px;display: inline-block;}",
        ".MCGEN2_header{padding-left:20px;height:40px;width:100%;background:red;line-height:40px;}",
        ".MCGEN2_downloadList .btns{background:red;color:#fff;font-weight:bold;padding:10px;border:0;display:block;margin:10px;}",
        ".MCGEN2_downloadList .logo{position:fixed;bottom:30px;left:40px;color:#fff;font-weight:bold;padding:10px;border:0;}",
        ".MCGEN2_btnsDiv{position:fixed;top:50px;right:40px;padding:10px;}"
    ].join(""));

    function getToken(s){
        try{
            let ss = s.split("\r\n")
            let items=ss.filter(function(item){
                //console.log(item,item.indexOf("set-cookie")>=0)
                if(item.indexOf("set-cookie")>=0){
                    return item
                }
            })
            //console.log("ss2",ss2)
            token=items[0].match(/WD-CSRF-TOKEN=(\S*); path/)[1];

        }catch(e){
            console.error(e)
        }
        //console.log(token)
    }
    function requestLogin(c){
        GM_xmlhttpRequest({
            url: c.url,
            method: c.method || 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With":"XMLHttpRequest",
                "Referer":c.url+'/'
            },
            data:c.data,
            onload: function(response) {
                //console.log('login',response);
                //console.log(response.responseHeaders)
                getToken(response.responseHeaders)
                loginCount++;
                if(response.status!=200){

                    GM_notification({image:notiIcon,title:title,text:"网页状态为 "+response.status+',请检查服务器地址配置。'});
                }else{
                    if(response.responseText.indexOf('<logd_eula>')<0){

                        GM_notification({image:notiIcon,title:title,text:"用户名或密码出错,请检查用户名密码配置。"});
                        if(typeof(c.onerror)=='function'){
                            c.onerror();
                        }
                        return;
                    }
                }
                if(typeof(c.onload)=='function'){
                    c.onload(response);
                }
            },
            onprogress: function(e) {
                console.log('gm_xhr onprogress lengthComputable: ', e.lengthComputable);
                console.log('gm_xhr onprogress loaded: ', e.loaded);
                console.log('gm_xhr onprogress total: ', e.total);
            },
            onerror:function(err){
                alert('出错了!');
                console.log(err);

                if(typeof(c.onerror)=='function'){
                    c.onerror(err);
                }
            }
        });

    }

    function request(c){
        //console.log(c)
        GM_xmlhttpRequest({
            url: c.url,
            method: c.method || 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With":"XMLHttpRequest",
                "Accept":"application/json, text/javascript, */*; q=0.01",
                "X-CSRF-Token":token,
                "Cookie":"local_login=1; isAdmin=1; WD-CSRF-TOKEN="+token
            },
            timeout:2000,
            data:c.data,
            onload: function(response) {
                console.log(token,response);

                if(response.status!=200){

                    var user=GM_getValue("mc_user",userDefaultJson);
                    //console.log(JSON.parse(user));
                    user=JSON.parse(user);

                    //var r=confirm("网页状态为 "+response.status+',可能是未登录的原因，点击确定跳转到MC登录！登录完成请刷新页面重试。');
                    if (user.username!='' && user.password!='')
                    {
                        //var window = unsafeWindow.location.href=GM_getValue("mc_server","");
                        //GM_openInTab(GM_getValue("mc_server",""),false);
                        GM_notification({image:notiIcon,title:title,text:'自动登录中'});
                        var url=host+'/cgi-bin/login_mgr.cgi';


                        //console.log(btoa(user.password));
                        var data='cmd=wd_login&username='+user.username+'&pwd='+btoa(user.password)+'&port=';
                        requestLogin({url:url,data:data,onload:function(){
                            if(loginCount<3){
                                request(c);
                            }

                        },onerror:c.onerror});

                    }else{
                        GM_notification({image:notiIcon,title:title,text:"网页状态为 "+response.status+',可能是未登录的原因，将跳转到MC登录！登录完成请刷新页面重试。'});
                        GM_openInTab(GM_getValue("mc_server",""),false);
                        if(typeof(c.onerror)=='function'){
                            c.onerror();
                        }
                    }
                    return;
                }
                if(typeof(c.onload)=='function'){
                    c.onload(response);
                }
            },
            onprogress: function(e) {
                console.log('gm_xhr onprogress lengthComputable: ', e.lengthComputable);
                console.log('gm_xhr onprogress loaded: ', e.loaded);
                console.log('gm_xhr onprogress total: ', e.total);
            },
            onabort:function(e){
                console.log(e);
            },
            onerror:function(err){
                alert('出错了!');
                console.log(err);

                if(typeof(c.onerror)=='function'){
                    c.onerror(err);
                }
            }
        });

    }


    mjq(function(){
        //alert(123);
        mjq( 'body' ).on( "click", "."+buttonClassName, function() {
            var btn=mjq(this);

            var href=mjq(this).data('href');
            var name=mjq(this).data('name');
            host=GM_getValue("mc_server","");
            if(host=="" || !host.startsWith('http')){
                alert('请先填写服务器地址');
                return;
            }

            mjq(this).prop('disabled', true);
            var url=host+'/cgi-bin/p2p.cgi';
            var data='cmd='+protocol[name].cmd+'&f_torrent_url='+encodeURIComponent(href);
            //alert(url);

            /*
            case 0:	//Success
				case 1:	//Success
					_html = _T('_p2p','desc9'); //Text:Successfully added.
				break;

				case 101://Failed to add this torrent file. The torrent file is invalid or duplicate.
				case 104:
					_html = _T('_p2p','msg21');
				break;

				case 102://Failed to add this torrent file. The My Cloud system does not have enough free space.
				case 103:
					_html = _T('_p2p','msg22');
				break;

				default://Upload Torrent Error(Error Code:xxx).
					_html = _T('_p2p','msg24')+"("+_T('_format','error_code')+":"+my_res+")";
				break;
            */

            request({
                url:url,
                data:data,
                onload: function(response) {
                    if(response.responseText.indexOf('<res>101</res>')>0){
                        alert('任务已存在！');
                    }else if(response.responseText.indexOf('<res>0</res>')>0){
                        alert('添加任务成功！');
                    }else if(response.responseText.indexOf('<res>1</res>')>0){
                        alert('下载失败！');
                    }else if(response.responseText.indexOf('<res>106</res>')>0){
                        alert('无法添加此 torrent 文件。torrent 文件无效或重复。');
                    }else{
                        alert(url+'  出错了');
                        alert(response.responseText);
                    }
                    btn.removeAttr('disabled');
                    //console.log(response.responseText,data);
                },
                onerror:function(err){
                    btn.removeAttr('disabled');
                }});


        });
        function findLink(){
            var isShowConfig=false;
            mjq('a[href]').each(function(){
                var href=mjq(this).attr('href');
                //console.log(href);
                var addDownloadFlag=false;
                var pName='';
                for(var p in protocol){
                    //console.log(p);
                    if(href.startsWith(protocol[p].prefix)){
                        addDownloadFlag=true;
                        pName=p;
                        isShowConfig=true;
                    }
                }
                if(addDownloadFlag){
                    var dbtn=mjq('<button/>').html('下载到MCGEN2').addClass(buttonClassName).attr('type','button').attr('data-href',href).attr('data-name',pName);

                    mjq(this).before(dbtn);
                    //console.log($(this).attr('href'));
                }

            });
        }

        function delCom(){
            host=GM_getValue("mc_server","");
            var url=host+'/cgi-bin/p2p.cgi';
            var data='cmd=p2p_del_all_completed';
            request({
                url:url,
                data:data,
                onload: function(response) {
                    getDownloadList();
                }});

        }


        function getDownloadList(){
            host=GM_getValue("mc_server","");
            if(host=="" || !host.startsWith('http')){
                alert('请先填写服务器地址');
                return;
            }

            var url=host+'/cgi-bin/p2p.cgi';
            var data='page=1&rp=30&sortname=&sortorder=&query=&qtype=&f_field=0&cmd=p2p_get_list_by_priority&user=';
            //console.log(GM_info
            request({
                url:url,
                data:data,
                onload: function(response) {
                    var o=JSON.parse(response.responseText);

                    if(o['rows']){
                        var alertText='<div class="row"><span class="name">名称</span><span class="size">大小</span><span class="status">状态</span></div>';
                        for(var i in o['rows']){
                            //console.log(i,o.rows);
                            var row=o['rows'][i];
                            var id=row['id'];
                            var name=row['cell'][0];
                            name=mjq(name).html();
                            var size=row['cell'][1];
                            var status=row['cell'][2];
                            alertText+='<div class="row"><span class="name">  ['+id+']  '+name+'</span><span class="size">'+size+ '</span><span class="status">'+status+'</span></div>';
                            //console.log(row);
                        }

                        if (mjq(".MCGEN2_scrollDiv").length > 0){
                            mjq(".MCGEN2_scrollDiv").html(alertText);
                        }else{
                            var scrollDiv=mjq('<div/>').addClass('MCGEN2_scrollDiv').html(alertText);
                            var headDiv=mjq('<div/>').addClass('MCGEN2_header').html('MCGEN2下载助手 '+GM_info.script.version+' by jy');
                            var listDiv=mjq('<div/>').addClass('MCGEN2_downloadList').append(headDiv).append(scrollDiv);
                            var btnsDiv=mjq('<div/>').addClass('MCGEN2_btnsDiv');
                            var closeBtn=mjq('<button/>').html('关闭').addClass('btns').click(function(){
                                mjq('.MCGEN2_downloadList').remove();
                            });
                            var delComBtn=mjq('<button/>').html('删除已完成的项').addClass('btns').click(function(){
                                delCom();
                            });
                            btnsDiv.append(closeBtn).append(delComBtn);
                            listDiv.append(btnsDiv);
                            mjq('body').append(listDiv);


                        }




                    }
                }
            }) ;



        }
        function setServerAddress()
        {
            var url=prompt("请填写服务器地址",GM_getValue("mc_server","http://192.168.2.222"));
            if (url!=null && url!="")
            {

                GM_setValue("mc_server",url);
                alert(GM_getValue("mc_server","")+' 设置成功!');
            }
        }

        function openServer(){
            if(url.indexOf(host)>=0){
                //alert(1);
                setTimeout(openP2pHtml,500);
            }else{

                GM_openInTab(GM_getValue("mc_server","")+"?toP2P",false);
            }
        }

        function setUserAddress()
        {
            var user=prompt("请填写用户名密码",GM_getValue("mc_user",userDefaultJson));
            if(user!=null){
                console.log(JSON.parse(user));
                GM_setValue("mc_user",user);
                alert('设置成功!');
            }
        }


        function run(){
            //initConfig();
            findLink();
            GM_registerMenuCommand('【MCGEN2下载助手】服务器地址设置',setServerAddress,"a");
            GM_registerMenuCommand('【MCGEN2下载助手】用户名密码设置',setUserAddress,"u");
            GM_registerMenuCommand('【MCGEN2下载助手】获取下载列表',getDownloadList,"b");
            GM_registerMenuCommand('【MCGEN2下载助手】打开p2p下载页面',openServer,"c");
            //getDownloadList();

        }




        function openP2pHtml(){
            var t=setTimeout(checkApp,2000);
            var time=0;
            function checkApp(){
                if(time<50){
                    if(typeof(unsafeWindow.go_page)=='function'){
                        unsafeWindow.go_page('/web/addons/app.php', 'nav_addons');
                        clearTimeout(t);
                        time=0;
                        t=setTimeout(checkP2p,2000);
                    }
                    time++;
                    //console.log(time);
                }
            }

            function checkP2p(){
                if(time<50){
                    if(typeof(unsafeWindow.go_sub_page)=='function'){
                        unsafeWindow.go_sub_page('/web/addons/p2p.html', 'p2p');
                        clearTimeout(t);
                        time=0;
                    }
                    time++;
                    //console.log(time);
                }
            }
        }

        var url   = document.URL;
        host=GM_getValue("mc_server"," ");
        if(url.indexOf(host+"/?toP2P")>=0){
            setTimeout(openP2pHtml,500);
        }else if(!url.startsWith(host)){

        }
        setTimeout(run,500);
        //console.log(url);




    });
})();
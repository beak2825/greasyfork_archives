// ==UserScript==
// @name          51NB Asst
// @description  51助手，黑名单，自动签到
// @namespace  by 51nb.com-FlyToSky
// @version        3.1.3
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @include      *forum.51nb.com/*
// @include      *.51nb.com/forum/*
// @downloadURL https://update.greasyfork.org/scripts/3510/51NB%20Asst.user.js
// @updateURL https://update.greasyfork.org/scripts/3510/51NB%20Asst.meta.js
// ==/UserScript==

// 3.1.3 -- 修复提交BUG--重要
// 3.1.2 -- 修复小尾巴BUG
// 3.1.1 -- 修复回复引用帖子时添加小尾巴（需要Greasemonkey3.0以上支持）功能；调整界面。
// 3.1.0 -- 支持论坛新改版，修复一些BUG
// 3.0.0 -- 增加支持GreaseMonkey2.0以上，Firefox30以上

var bid_Settings;
var bid_BlackLists;
var bid_blacklistStr;
var bid_signed;
var bid_formhash;
var bid_uid;
var bid_fid;
var bid_keywords;
var bid_Key_lastTid;
var bid_VIEWTHREAD = window.location.href.indexOf('/thread-') >= 0 || (window.location.href.indexOf('/forum.php?') >= 0 && window.location.href.indexOf('mod=viewthread') >= 0);
var bid_FORUMDISPLAY = window.location.href.indexOf('/forum-') >= 0 || (window.location.href.indexOf('/forum.php?') >= 0 && window.location.href.indexOf('mod=forumdisplay') >= 0);

if (!this.GM_getValue) {
    this.GM_getValue = function (key,def) {
        return localStorage.getItem(key) || def;
    }
    this.GM_setValue = function (key,value) {
        return localStorage.setItem(key, value);
    }
    this.GM_deleteValue = function (key) {
        return localStorage.removeItem(key);
    }
}

if (!this.GM_addStyle) {
    this.GM_addStyle = function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
}

function bid_xpath(q) {
    return document.evaluate(q, document, null,    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

//读取设置
function bid_readConfig(){
    var s=GM_getValue('51Asst_Settings_' + bid_uid,'');
    if (s) {
        bid_Settings = JSON.parse(s);
        bid_signed = (bid_Settings.lastSignDate == (new Date()).toDateString()) ? true : false;
    } else {
        bid_Settings = new Object();
    }
    
    s=GM_getValue('51Asst_BlackLists_' + bid_uid,'');
    bid_blacklistStr = ',';
    if (s) {
        bid_BlackLists = JSON.parse(s);
        for (i=0;i<bid_BlackLists.blacklist.length;i++) {
            bid_blacklistStr += bid_BlackLists.blacklist[i].id + '=' + bid_BlackLists.blacklist[i].name + ',';
        }
    } else {
        bid_BlackLists= new Object();
        bid_BlackLists.blacklist = new Array();
    }

    s=GM_getValue('51Asst_keywords_' + bid_uid,'');
    if (s) {
        bid_keywords = JSON.parse(s);
    } else {
        bid_keywords = new Object();
        bid_keywords.key = new Array();
    }
}

var bid_BtnID;    
function bid_AddBlockBtn(){        // 添加屏蔽按钮
    s = bid_xpath('//div[starts-with(@id,"favatar")]/div[@class="pi"]/div/a');
    for (i = 0; i < s.snapshotLength; ++i) {
        var a = s.snapshotItem(i);
        if( a != undefined){
            a.addEventListener('mouseenter', function(e){clearTimeout(bid_BtnID);var p=bid_GetPos(e.target);var d=document.getElementById('_51nbbl_div');e.target.parentNode.parentNode.appendChild(d);d.style.left=parseInt(p.left)+'px';d.style.top=parseInt(p.top)+24+'px';d.style.display='';},false);
            a.addEventListener('mouseleave', function(e){bid_BtnID=setTimeout("document.getElementById('_51nbbl_div').style.display='none';",500)},false);
        }
    }
}

function bid_GetPos(obj) {        //获取元素的绝对坐标
    var curleft=0;
    var curtop=0;
    var curwidth=0;
    var curheight=0;

    if (obj.offsetParent) {        //返回父元素
        curwidth = obj.offsetWidth;
        curheight = obj.offsetHeight;
        while (obj.offsetParent) {        //遍历所有父元素
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            obj = obj.offsetParent;        
        }
    } else if (obj.x) {
        curleft += obj.x;
        curtop += obj.y;
    }
    return {left:curleft,top:curtop,right:curleft+curwidth,bottom:curtop+curheight};
}

function bid_BlockUser(e){      //点击屏蔽按钮
    var a = e.target.parentNode.parentNode.getElementsByClassName('authi')[0].getElementsByTagName('a')[0];
    var nm= a.text.replace(/[\r\n]/g,'');
    var id= a.href.substring(a.href.indexOf('uid-')+4,a.href.indexOf('.html'));
    bid_readConfig();                    //先读取一下，解决多窗口情况下的同步问题
    if (bid_blacklistStr.indexOf(','+id+'=') < 0) {    //检查黑名单是否已存在
        bid_blacklistStr += id + '=' + nm;
        bid_addBidlist(id,nm);
        bid_SaveConfig(2)
    }
    bid_BlockList();
}

function bid_BlockList(){      // 屏蔽黑名单
    switch (bid_fid) {
        case '88':
            if (!bid_Settings.blockForum88) return;
            break;
        case '41':
            if (!bid_Settings.blockForum41) return;
            break;
        default:
            if (!bid_Settings.blockForumother) return;
    }
    if(bid_VIEWTHREAD){   // 帖子
        //屏蔽回复
        var s = bid_xpath('//div[starts-with(@id,"favatar")]/div[@class="pi"]/div/a');
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            if( a != undefined){
                var id= a.href.substring(a.href.indexOf('uid-')+4,a.href.indexOf('.html'));
                if (bid_blacklistStr.indexOf(','+id+'=')>=0)
                    a.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display='none';
            }
        }
        // 屏蔽被引用内容
        var s = bid_xpath('//div[@class="msgbody"]/div[@class="msgborder"]/font[1]');
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            var n = a.textContent.substring(0,a.textContent.indexOf(' '));
            if (bid_blacklistStr.indexOf('='+n+',')>=0)
                a.parentNode.parentNode.style.display = 'none';
        }

        // 屏蔽点评内容
        var s = bid_xpath('//div[starts-with(@id,"comment_")]/div[@class="pstl xs1 cl"]/div[@class="psta vm"]/a[starts-with(@href,"space-uid")]');
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            var id = a.href.substring(a.href.indexOf('-uid-')+5,a.href.indexOf('.html'));
            if (bid_blacklistStr.indexOf(','+id+'=')>=0)
                a.parentNode.parentNode.style.display = 'none';
        }
        
        //重新设置背景色
        var s = bid_xpath('//div["postlist"]/div[starts-with(@id,"post_") and starts-with(@class,"bbs")]');
        var j=0;
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            if( a != undefined){
                if (a.style.display != 'none') {
                    a.className = (j%2)==0?"bbs2":"bbs1";
                    ++j;
                }
            }
        }

    } else if(bid_FORUMDISPLAY){ // 论坛列表
        // 屏蔽主题帖
        var s = bid_xpath('//table["threadlisttableid"]/tbody/tr/td[@class="author"]/cite/a[starts-with(@href,"space-uid")]');
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            if( a != undefined){
                var id= a.href.substring(a.href.indexOf('uid-')+4,a.href.indexOf('.html'));
                if (bid_blacklistStr.indexOf(','+id+'=')>=0)
                    a.parentNode.parentNode.parentNode.parentNode.style.display='none';
            }
        }

        //重新设置背景色
        var s = bid_xpath('//table["threadlisttableid"]/tbody[starts-with(@id,"normalthread_")]');
        var j=0;
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            if( a != undefined){
                if (a.style.display != 'none') {
                    if (a.id == 'forumnewshow') {
                        j=0;
                    } else {
                        a.childNodes[1].bgColor = (j % 2)==0?"#E3E3E3":"#F7F7F7";
                    }
                    ++j;
                }
            }
        }
    
        // 隐藏最后回复位置的显示
        var s = bid_xpath('//table["threadlisttableid"]/tbody/tr/td[@class="by"]/cite/a[starts-with(@href,"space-username-")]');
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            if(a != undefined) {
                var n = a.text.replace(/[\r\n]/g,'');
                if (bid_blacklistStr.indexOf(('='+n+','))>=0) a.innerHTML='anonymous';
            }
        }
    }
}

function bid_menu(m) {
    var cur_menu=document.getElementById(m).parentNode;
    for (i=0;i<cur_menu.parentNode.childNodes.length;i++) {
        if (cur_menu.parentNode.childNodes[i].className=="_c_menu")
            cur_menu.parentNode.childNodes[i].className="";
    }
    cur_menu.className="_c_menu";
    document.getElementById("_51nb_setting1").style.display="none";
    document.getElementById("_51nb_setting2").style.display="none";
    document.getElementById("_51nb_setting3").style.display="none";
    switch(m) {
        case "_bid_m1":
            document.getElementById("_51nb_setting1").style.display="";
            break;
        case "_bid_m2":
            document.getElementById("_51nb_setting2").style.display="";
            break;
        case "_bid_m3":
            document.getElementById("_51nb_setting3").style.display="";
            break;
    }
}

function bid_CreatConfigPanel(){    //创建面板
    GM_addStyle(
        '#_51nbccp_div {position: fixed;left:50%;bottom:50px;padding:0px 15px;margin-left:-115px; margin-top:-135px;align:center;width:220px;z-index:99;background:#d3d3d3;border:1px solid #bfbfbf;opacity:0.95;text-align:center;font-size:12px}'+
        '#_51nbccp_div table,#_51nbccp_div input,#_51nbccp_div select {font-size: 12px;}'+
        '#_51nbccp_div input {height: 20px;}'+
        '#_51nbccp_div input[type="text"] {height:16px !important;}'+
        '#_51nbccp_div input[type="checkbox"] {height:16px !important;}'+
        '#_51nbccp_div input[type="button"] {height: 22px  !important;}'+
        '#_51nb_setting1,#_51nb_setting2,#_51nb_setting3 {padding:5px 0px;border-width: 1px 0px 0px;border-color:#a3a3a3;border-style:solid;height:180px;text-align:left}'+
        '#_bid_kw_up,#_bid_kw_down,#_bid_kw_modi,#_bid_kw_del {margin-top:-2px !important;height:18px !important;}'+
        '#_bid_menu li {list-style: none outside none;display:inline;}'+
        '#_bid_menu li {background:#b3b3b3;margin-left: 2px;}'+
        '#_bid_menu li._c_menu a {border-color:#a3a3a3;background:#d3d3d3;font-weight:bold;}'+
        '#_bid_menu a {border-width: 1px 1px 0px;border-color:#a3a3a3;border-style:solid;padding:1px 8px;height:25px;line-height:24px;text-decoration:none;color:#000;background:#b3b3b3;outline:none}'+
        '#_51nbgdb_div {position: fixed;top:180px;left:50%;margin-left:-75px; align:center;width:150px;padding: 7px;text-align:center;color:#fff;background:#66c;z-index:100;border-radius:5px;font-size:14px;box-shadow: 0px 0px 9px #999999;}'+
        '#_51nbsr_div {position: fixed;right:5px;bottom:5px;align:center;padding: 0px;z-index:98;background:#f7f7f7;border:1px solid #b6b6b6;opacity:0.90;text-align:left;}'+
        '#_51nbsr_div td{border-bottom:1px solid #c6c6c6;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;padding:2px 2px 2px 5px}'+
        '#_51nbbl_div {position:absolute;width:50px;padding:3px 5px;background:#f3f3f3;border:1px solid #e3e3e3;z-index:101;text-align:center;opacity:0.90;}'  //background:#b3b3b3;border:1px solid #b6b6b6;
    );
    if (bid_Settings.autoSign && (!bid_signed) && (bid_formhash)) {
        var bid_gdb = document.createElement("div");        //签到提示面板
        bid_gdb.id = '_51nbgdb_div';
        bid_gdb.style.display = "none";
        document.getElementsByTagName('body')[0].appendChild(bid_gdb);
    }

    var bid_sresult = document.createElement("div");        //关键字提示面板
    bid_sresult.id = '_51nbsr_div';
    bid_sresult.style.display = "none";
    bid_sresult.innerHTML='<div style="padding:2px;color:#fff;background:#6666cc;font-weight:bold;text-align:center">感兴趣主题'+
        '<a href="javascript:void(0)" id="_bid_close" style="float:right;color:#fff;font-weight:normal;font-size: 10px;">关闭</a></div>'+
        '<div style="height:94px;overflow-y:scroll">'+
        '<table id="_bid_tbl_sresult" cellspacing="0" style="width:200px;table-layout:fixed"></table>'+
        '</div>';
    document.getElementsByTagName('body')[0].appendChild(bid_sresult);
    document.getElementById('_bid_close').addEventListener('click', function(){document.getElementById('_51nbsr_div').style.display='none';}, false);

    var bid_div_block = document.createElement("div");        //屏蔽提示面板
    bid_div_block.id = '_51nbbl_div';
    bid_div_block.style.display = "none";
    var a=document.createElement("a");
    a.innerHTML='屏蔽';
    a.href='javascript:void(0)';
    a.addEventListener('click', bid_BlockUser,false);
    bid_div_block.appendChild(a);
    bid_div_block.addEventListener('mouseenter', function(e){clearTimeout(bid_BtnID);},false);
    bid_div_block.addEventListener('mouseleave', function(e){bid_BtnID=setTimeout("document.getElementById('_51nbbl_div').style.display='none';",500)},false);
    document.getElementsByTagName('body')[0].appendChild(bid_div_block);
    
    var bid_ccp = document.createElement("div");        //设置面板
    bid_ccp.id = "_51nbccp_div";
    bid_ccp.style.display = "none";
    bid_ccp.innerHTML = 
        '<div style="position:relative;margin:0px auto;width:90%;height:55px;padding:10px 0px 0px;"><font size=3>51助手'+/*<sub><font color=#e7e7e7>&nbsp;&nbsp;ver 2.0</font></sub>*/'</font>'+
        '<div id="_bid_menu" style="position:absolute;bottom:0px;padding:10px 0px 0px;height:20px"><ul>'+
        '<li class="_c_menu"><a id="_bid_m1" hidefocus="true" href="javascript:void(0)">黑名单</a></li>'+
        '<li><a id="_bid_m2" hidefocus="true" href="javascript:void(0)">关键字</a></li>'+
        '<li><a id="_bid_m3" hidefocus="true" href="javascript:void(0)">其它</a></li>'+
        '</ul></div></div>'+
        '<div id="_51nb_setting1">'+
        '<table id="_bid_cc1">'+
        '<tr><td>屏蔽版块：</td></tr>'+
        '<tr><td>'+
            '<input id="_bid_blockForum88" type="checkbox" />联谊区'+
            '<input id="_bid_blockForum41" type="checkbox" />交易区'+
            '<input id="_bid_blockForumother" type="checkbox" />其它版块'+
        '</td></tr>'+
        '<tr><td>黑名单：</td></tr>'+
        '<tr><td>'+
            '<select size="4" id="_bid_blacklist" multiple style="width:155px">'+
            '</select>'+
            '<div style="float:right;padding-left:2px;">'+
                '<input type="button" id="_bid_del" value="删除" onclick="javascript:void(0)"/>'+
            '</div>'+
        '</td></tr>'+
        '</table></div>'+
        '<div id="_51nb_setting2">'+
        '<table id="_bid_cc2">'+
        '<tr><td>版块：</td>'+
        '<td>'+
            '<select id="_bid_forum_list" style="height:17px;width:100px;padding:0px 0px">'+
            '<option value="1">技术区</option>'+
            '<option value="2">智能手机</option>'+
            '<option value="41">交易区</option>'+
            '<option value="88">联谊区</option>'+
            '<option value="113">推荐区</option>'+
            '</select>'+
        '</td></tr>'+
        '<tr><td>关键字：</td>'+
        '<td>'+
            '<input type="text" id="_bid_key" value="" style="width:100px;background:#fff"/>'+
            '&nbsp;<input type="button" id="_bid_kw_add" value="添加" onclick="javascript:void(0)"/>'+
        '</td></tr>'+
        '<tr><td></td><td>(多个关键字用"|"隔开)</td></tr>'+
        '<tr><td colspan="2">关键字列表：</td></tr>'+
        '<tr><td colspan="2">'+
            '<select size="4" id="_bid_keyslist" multiple style="width:155px"></select>'+
            '<div style="float:right;padding-left:2px;">'+
                '<input type="button" id="_bid_kw_up" value="上移" onclick="javascript:void(0)"/></br>'+
                '<input type="button" id="_bid_kw_down" value="下移" onclick="javascript:void(0)"/></br>'+
                '<input type="button" id="_bid_kw_modi" value="编辑" onclick="javascript:void(0)"/></br>'+
                '<input type="button" id="_bid_kw_del" value="删除" onclick="javascript:void(0)"/>'+
            '</div>'+
        '</td></tr>'+
        '</table></div>'+
        '<div id="_51nb_setting3">'+
        '<table id="_bid_cc3">'+
        '<tr><td>'+'发贴小尾巴:'+'</td></tr>'+
        '<tr><td>'+'&nbsp;&nbsp;&nbsp;文字&nbsp;&nbsp;'+'<input type="text" id="_bid_wb_text" value="" style="width:120px;background:#fff"/>'+'</td></tr>'+
        '<tr><td>'+'&nbsp;&nbsp;&nbsp;链接&nbsp;&nbsp;'+'<input type="text" id="_bid_wb_link" value="" style="width:120px;background:#fff"/>'+'</td></tr>'+
        '<tr><td>'+'<input id="_bid_autoSign" type="checkbox" />自动签到'+'</td></tr>'+
        '</table></div>'+
        '<div style="padding:0px 0px 15px;">'+
            '<input type="button" id="_bid_ok" value="确 定" onclick="javascript:void(0)"/>'+
            '&nbsp;&nbsp;&nbsp;'+
            '<input type="button" id="_bid_cancel" value="取 消" onclick="javascript:void(0)"/>'+
        '</div>'
        ;
        
    document.getElementsByTagName('body')[0].appendChild(bid_ccp);
    document.getElementById('_51nb_setting2').style.display='none';
    document.getElementById('_51nb_setting3').style.display='none';
    document.getElementById('_bid_ok').addEventListener('click', function(){bid_SaveConfig(99);bid_SaveConfig(0);}, false);
    document.getElementById('_bid_cancel').addEventListener('click', function(){bid_SaveConfig(0);}, false);
    document.getElementById('_bid_del').addEventListener('click', function(){bid_delBidlist();}, false);
    document.getElementById('_bid_m1').addEventListener('click', function(){bid_menu(this.id);}, false);
    document.getElementById('_bid_m2').addEventListener('click', function(){bid_menu(this.id);}, false);
    document.getElementById('_bid_m3').addEventListener('click', function(){bid_menu(this.id);}, false);
    document.getElementById('_bid_kw_add').addEventListener('click', function(){bid_key_add();}, false);
    document.getElementById('_bid_kw_del').addEventListener('click', function(){bid_key_del();}, false);
    document.getElementById('_bid_kw_modi').addEventListener('click', function(){bid_key_modi();}, false);
    document.getElementById('_bid_kw_up').addEventListener('click', function(){bid_key_move(-1);}, false);
    document.getElementById('_bid_kw_down').addEventListener('click', function(){bid_key_move(1);}, false);
    document.addEventListener('keydown', bid_keyHandle, false);
    bid_refreshCfgdiv();
}

function bid_key_add() {
    var key=document.getElementById("_bid_key");
    if (key.value) {
        var fl = document.getElementById("_bid_forum_list");
        var kl = document.getElementById("_bid_keyslist");
        for (i=0;i<kl.options.length;i++){
            if (kl[i].value==fl[fl.selectedIndex].value) {
                kl[i].text='['+fl[fl.selectedIndex].text+']'+key.value;
                document.getElementById("_bid_kw_add").value='添加';
                key.value='';
                return;
            }
        }
        var o = document.createElement('option');
        o.value = fl[fl.selectedIndex].value;
        o.text = '['+fl[fl.selectedIndex].text+']'+key.value;
        o.title=o.text;
        kl.options[kl.options.length] = o;
        key.value='';
    }
}

function bid_key_modi() {
    var kl = document.getElementById("_bid_keyslist");
    if (kl.selectedIndex<0) return;
    var key=document.getElementById("_bid_key");
    var fl = document.getElementById("_bid_forum_list");
    for (i=0;i<fl.options.length;i++){
        if (fl[i].value==kl[kl.selectedIndex].value) {
            fl.selectedIndex=i;
            key.value=kl[kl.selectedIndex].text.substring(kl[kl.selectedIndex].text.indexOf(']')+1);
            document.getElementById("_bid_kw_add").value='修改';
            break;
        }
    }
}

function bid_key_del() {
    var kl = document.getElementById("_bid_keyslist"); 
    for (i=0;i<kl.options.length;i++) {
        if (kl.options[i].selected) {
            kl.options.remove(i--);
        }
    }
}

function bid_key_move(d) {
    function moveitem(k,d){
        var o=k.options[k.selectedIndex];
        k.add(o,k.options[k.selectedIndex+d]);
    }
    
    var kl = document.getElementById("_bid_keyslist"); 
    if (kl.selectedIndex<0) return;
    if ((d == -1) && (kl.selectedIndex>0)) {
        moveitem(kl,d);
    } else if ((d == 1) && (kl.selectedIndex>-1 && kl.selectedIndex<kl.length-1)) {
        moveitem(kl,d+1);
    }
}

function bid_SaveConfig(s) {        //保存
    if (s>0) {
        if (s==1 || s==99) {        //保存设置
            bid_Settings.blockForum88 = document.getElementById('_bid_blockForum88').checked;
            bid_Settings.blockForum41 = document.getElementById('_bid_blockForum41').checked;
            bid_Settings.blockForumother = document.getElementById('_bid_blockForumother').checked;

            bid_Settings.autoSign = document.getElementById('_bid_autoSign').checked;
            
            bid_Settings.wb_text = document.getElementById('_bid_wb_text').value;
            bid_Settings.wb_link = document.getElementById('_bid_wb_link').value;

            
            GM_setValue('51Asst_Settings_' + bid_uid, JSON.stringify(bid_Settings));
        }
        
        if (s==2 || s==99) {        //保存黑名单
            bid_BlackLists.blacklist.length = 0;
            var bl = document.getElementById("_bid_blacklist"); 
            for ( i = 0; i<bl.options.length; i++) {
                bid_BlackLists.blacklist[i]=new Object();
                bid_BlackLists.blacklist[i].id=bl.options[i].value;
                bid_BlackLists.blacklist[i].name=bl.options[i].text;
            }
            GM_setValue('51Asst_BlackLists_' + bid_uid,JSON.stringify(bid_BlackLists));
        }
        
        if (s==3 || s==99) {        //保存关键字
            var bl = document.getElementById("_bid_keyslist"); 
            for (j=0;j<bid_keywords.key.length;j++) {
                var keyexist=false;
                for (i = 0; i<bl.options.length; i++) {
                    if (bid_keywords.key[j].fid==bl.options[i].value) {
                        keyexist=true;
                        break;
                    }
                }
                if (!keyexist) {
                    bid_keywords.key.splice(j--,1);
                }
            }
            for (i = 0; i<bl.options.length; i++) {
                var keyexist=false;
                for (j=0;j<bid_keywords.key.length;j++) {
                    if (bid_keywords.key[j].fid==bl.options[i].value) {
                        bid_keywords.key[j].keyword=bl.options[i].text;
                        keyexist=true;
                        if (i!=j) {
                            var o=bid_keywords.key[i];
                            bid_keywords.key[i]=bid_keywords.key[j];
                            bid_keywords.key[j]=o;
                        }
                        break;
                    }
                }
                if (!keyexist) {
                    bid_keywords.key[bid_keywords.key.length]=new Object();
                    bid_keywords.key[bid_keywords.key.length-1].fid=parseInt(bl.options[i].value);
                    bid_keywords.key[bid_keywords.key.length-1].keyword=bl.options[i].text;
                    bid_keywords.key[bid_keywords.key.length-1].chktime=0;
                    bid_keywords.key[bid_keywords.key.length-1].lastTid=0;
                }
            }
            GM_setValue('51Asst_keywords_' + bid_uid,JSON.stringify(bid_keywords));
        }
        
        if (s==1 || s==2) {
            bid_BlockList();
        }
    } else {
        document.getElementById('_51nbccp_div').style.display = (document.getElementById('_51nbccp_div').style.display == '')?'none':'';
        if (document.getElementById('_51nbccp_div').style.display == 'none') bid_refreshCfgdiv();        //刷新设置界面
    }
}

function bid_refreshCfgdiv() {        //刷新设置界面
    if (document.getElementById("_bid_blacklist").options.length != bid_BlackLists.blacklist.length) bid_addBidlist();

    document.getElementById('_bid_blockForum88').checked = bid_Settings.blockForum88;
    document.getElementById('_bid_blockForum41').checked = bid_Settings.blockForum41;
    document.getElementById('_bid_blockForumother').checked = bid_Settings.blockForumother;
    document.getElementById('_bid_wb_text').value = bid_Settings.wb_text?bid_Settings.wb_text:'';
    document.getElementById('_bid_wb_link').value = bid_Settings.wb_link!=undefined?bid_Settings.wb_link:'http://forum.51nb.com/thread-1459523-1-1.html';
    if (bid_uid) {
        document.getElementById('_bid_autoSign').checked = bid_Settings.autoSign;
        document.getElementById('_bid_autoSign').disabled = false;
    } else {
        document.getElementById('_bid_autoSign').checked = false;
        document.getElementById('_bid_autoSign').disabled = true;
    }
    var kl = document.getElementById("_bid_keyslist");
    for (i=0;i<bid_keywords.key.length;i++) {
        var o=document.createElement('option');
        o.value=bid_keywords.key[i].fid;
        o.text=bid_keywords.key[i].keyword;
        o.title=o.text;
        kl.options[i]=o;
    }
}

function bid_addBidlist(id,nm) {        //刷新新黑名单列表
    var bl = document.getElementById("_bid_blacklist");
    if (id !=undefined) {        //id非空时增加一个名单
        var o = document.createElement('option');
        o.value = id;
        o.text = nm;
        bl.options[bl.options.length] = o;
    } else {        //id为空时刷新列表
        bl.options.length = 0;
        for ( i = 0; i<bid_BlackLists.blacklist.length; i++) {
            var o = document.createElement('option');
            o.value = bid_BlackLists.blacklist[i].id;
            o.text = bid_BlackLists.blacklist[i].name;
            bl.options[bl.options.length] = o;
        }
    }
}

function bid_delBidlist() {        //删除黑名单列表选中的名单
    var bl = document.getElementById("_bid_blacklist"); 
    for (i=0;i<bl.options.length;i++) {
        if (bl.options[i].selected) {
            bl.options.remove(i--);
        }
    }
}

function bid_keyHandle(e) {        //热键回调函数
    if (/^(?:input|textarea)$/i.test(e.target.localName)) return;
    var keycom = e.ctrlKey? '1':'0';
    keycom += (e.metaKey || e.altKey)? '1':'0';
    keycom += e.shiftKey? '1':'0';
    keycom += String.fromCharCode(e.which);
    if (keycom=='010N') {
        e.preventDefault();e.stopPropagation();bid_SaveConfig(0); 
    }
}

function bid_sign() {
    if (bid_Settings.autoSign && (!bid_signed) && (bid_formhash)) {
        var d = new Date();
        if ((d.getHours()*60 + d.getMinutes()) < 10) return;        //0点10分以后才开始签到
        var http = new XMLHttpRequest();
        var url = 'plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&&referer=http%3A//forum.51nb.com/forum.php&inajax=1';
        var data = 'formhash=' + bid_formhash + '&qdxq=kx';
        http.onreadystatechange=function() {
            if (http.readyState==4 && http.status==200) {        // 200 = http OK
                bid_signed = true;
                bid_Settings.lastSignDate = d.toDateString();
                bid_SaveConfig(1);
                var reg=/^<div class="c">[\s\S]* (\d+) nb\. <\/div>.*/gm;
                if (reg.test(http.responseText)) {
                    document.getElementById('_51nbgdb_div').innerHTML = '今日签到：+'+RegExp.$1+' NB';
                    document.getElementById('_51nbgdb_div').style.display = '';
                    setTimeout(function(){document.getElementById('_51nbgdb_div').style.display = 'none';}, 3000);
                }
            }
        }
        http.open('POST', url, true);
        http.setRequestHeader("Referer","http://forum.51nb.com/forum.php");
        http.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=gbk");
        http.overrideMimeType("text/html;charset=gbk");
        http.send(data);
    }
}

function bid_search(i,p) {
    if (i >= bid_keywords.key.length) return;
    var gt=parseInt((new Date()).getTime()/1000);
    var dt=gt - bid_keywords.key[i].chktime;
    dt=dt>259200?259200:dt;        //只检测最近三天内的新主题
    if (dt > 30*60) {        //两次检测间隔30分钟
        dt += 60;
        var http = new XMLHttpRequest();
        var url = 'forum.php?mod=forumdisplay&fid='+bid_keywords.key[i].fid+'&orderby=dateline&filter=dateline&dateline='+dt+'&page='+p;
        http.onreadystatechange=function() {
            if (http.readyState==4 && http.status==200) {        // 200 = http OK
                var regstr='<input type="text" name="custompage"[^>]*><span [^>]*> \\/ ([\\d])+ .*';
                var reg=RegExp(regstr,'mi');
                var MaxPage=reg.test(http.responseText)?parseInt(RegExp.$1):0;
                MaxPage=MaxPage>3?3:MaxPage;        //最大读取3页

                if (bid_keywords.key[i].fid==113)        //处理推荐区
                    var regstr='<div[^>]* class="[^"]* noBg"><a.*href="forum\\.php\\?mod=viewthread&amp;tid=(\\d+)&[^>]*>([^<]*(?:' + bid_keywords.key[i].keyword.substring(bid_keywords.key[i].keyword.indexOf(']')+1) + ')[^<]*)<[\\s\\S]*?<span>发布者：\\s*(.*?)\\s*<\\/span>';
                else
                    var regstr='<a[^>]*href="forum\\.php\\?mod=viewthread&amp;tid=(\\d+)&[^>]*>([^<]*(?:'+bid_keywords.key[i].keyword.substring(bid_keywords.key[i].keyword.indexOf(']')+1)+')[^<]*)</a>[\\s\\S]*?<a.*href="space-uid-\\d+\\.html"[^>]*>([^<]*)</a>';
                var reg=RegExp(regstr,'gi');
                if (p==1) bid_Key_lastTid=bid_keywords.key[i].lastTid;
                while ((reg.exec(http.responseText)) != null) {
                    //RegExp.$1  TID
                    //RegExp.$2  标题
                    //RegExp.$3  作者
                    //console.log(RegExp.$1,RegExp.$2,RegExp.$3);
                    if (bid_Key_lastTid < parseInt(RegExp.$1)) {
                        if  (bid_blacklistStr.indexOf('='+RegExp.$3+',')<0) {
                            var tr=document.createElement('tr');
                            var td=document.createElement('td');
                            var a=document.createElement('a');
                            a.title='〖'+bid_keywords.key[i].keyword.substring(1,bid_keywords.key[i].keyword.indexOf(']'))+'〗'+RegExp.$2+'『'+RegExp.$3+'』';
                            a.href='thread-' + RegExp.$1 + '-1-1.html';
                            a.target='_blank';
                            a.innerHTML=RegExp.$2;
                            td.appendChild(a);
                            tr.appendChild(td);
                            document.getElementById('_bid_tbl_sresult').appendChild(tr);
                            document.getElementById('_51nbsr_div').style.display='';
                        }
                        if (bid_keywords.key[i].lastTid < parseInt(RegExp.$1))
                            bid_keywords.key[i].lastTid=parseInt(RegExp.$1);
                    }
                }
                if (p<MaxPage) {
                    setTimeout(function(){bid_search(i,++p);},0);
                } else {
                    bid_keywords.key[i].chktime=gt;
                    if (i==bid_keywords.key.length-1) {
                        GM_setValue('51Asst_keywords_' + bid_uid,JSON.stringify(bid_keywords));
                    }
                    setTimeout(function(){bid_search(++i,1);},0);
                }
            }
        }
        http.open('GET', url, true);
        http.setRequestHeader("Referer","http://forum.51nb.com/index.php");
        http.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=gbk");
        http.overrideMimeType("text/html;charset=gbk");
        http.send(null);
    } else {
        setTimeout(function(){bid_search(++i,1);},0);
    }
}

function bid_getFormhash() {
    var s = bid_xpath('//a[starts-with(@href,"member.php?")]');
    for (i = 0; i < s.snapshotLength; ++i) {
        var a = s.snapshotItem(i);
        if( a != undefined && a.href.indexOf('action=logout') >= 0) {
            bid_formhash = a.href.substring(a.href.indexOf('formhash')+9, a.href.indexOf('formhash')+9+8);
        }
    }
    if (bid_formhash) {
        var s = bid_xpath('//div[@id="hd"]/div[@class="wp"]/div/div[@id="um"]/p/strong/a[starts-with(@href,"space-uid-")]');
        for (i = 0; i < s.snapshotLength; ++i) {
            var a = s.snapshotItem(i);
            if( a != undefined) {
                bid_uid = a.href.substring(a.href.indexOf('uid')+4,a.href.indexOf('.html'));
            }
        }
    }
    if (!bid_uid) bid_uid = '';
    
    var s = bid_xpath('//div[@id="wp"]/div[@id="pt"]/div/a[starts-with(@href,"forum-")]');
    for (i = 0; i < s.snapshotLength; ++i) {
        var a = s.snapshotItem(i);
        if( a != undefined) {
            bid_fid = a.href.substring(a.href.indexOf('forum-')+6,a.href.indexOf('.html'));
            bid_fid = bid_fid.substring(0,bid_fid.indexOf('-'));
        }
    }
}

function bid_addMessage() {
    var m='';
    if (bid_Settings.wb_text) {
        m='[size=1]'+bid_Settings.wb_text+'[/size]';
        m=/^(?:https{0,1}:\/\/|www\.).+/i.test(bid_Settings.wb_link)?'[url='+bid_Settings.wb_link+']'+m+'[/url]':m;
    }
    return m;
}

function bid_addCustom_post() {
    var f = document.forms['postform'];
    var v = f.message.value;
    var m=bid_addMessage();
    if (m && v.indexOf(m)<0)
        f.message.value = v + "\n\n" + m;
        
    f._submit();
}

function bid_addCustom_fastpost() {
    var f = document.forms['fastpostform'];
    var v = f.message.value;
    var m=bid_addMessage();
    if (m && v.indexOf(m)<0)
        f.message.value = v + "\n\n" + m;
        
    f._submit();
}

function bid_addCustom_vfastpost() {
    var f = document.forms['vfastpostform'];
    var v = f.message.value;
    var m=bid_addMessage();
    if (m && v.indexOf(m)<0)
        f.message.value = v + '    ' + m;
        
    f._submit();
}

function bid_addCustom() {
    if (this.id && (this.id=='postform' || this.id=='fastpostform' || this.id=='vfastpostform')) {
        var v = this.message.value;
        var m=bid_addMessage();
        if (m && v.indexOf(m)<0) {
            if (this.id=='vfastpostform')
                this.message.value = v + '    ' + m;
            else
                this.message.value = v + "\n\n" + m;
        }
    }
    this._submit();
}

bid_getFormhash();
bid_readConfig();        //读取设置参数
if (window.self === window.top)
    bid_CreatConfigPanel();        //生成设置面板

if (bid_VIEWTHREAD) {
    bid_AddBlockBtn();       //添加屏蔽按钮
}

if(bid_FORUMDISPLAY || bid_VIEWTHREAD) {
    bid_BlockList();        //屏蔽黑名单
}
if (bid_Settings.autoSign) {
    window.onload = setTimeout(function(){bid_sign();},500);        //自动签到
}

bid_search(0,1);        //关键字提醒

if (bid_Settings.wb_text) {        //添加发贴小尾巴
    ver = parseFloat(GM_info.version);
    if (ver >= 2 && ver < 3) {
        if (document.forms['postform']) {
            var f = document.forms['postform'];
            f._submit = f.submit;
            unsafeWindow.document.forms['postform'].submit = this.exportFunction?exportFunction(bid_addCustom_post, unsafeWindow):bid_addCustom_post;
        }
        if (document.forms['fastpostform']) {
            var f = document.forms['fastpostform'];
            f._submit = f.submit;
            unsafeWindow.document.forms['fastpostform'].submit = this.exportFunction?exportFunction(bid_addCustom_fastpost, unsafeWindow):bid_addCustom_fastpost;
        }
        if (document.forms['vfastpostform']) {
            var f = document.forms['vfastpostform'];
            f._submit = f.submit;
            unsafeWindow.document.forms['vfastpostform'].submit = this.exportFunction?exportFunction(bid_addCustom_vfastpost, unsafeWindow):bid_addCustom_vfastpost;
        }
    } else {
        HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
        unsafeWindow.HTMLFormElement.prototype.submit = this.exportFunction?exportFunction(bid_addCustom, unsafeWindow):bid_addCustom;
    }
}

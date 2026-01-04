// ==UserScript==
// @name              狼之乐园辅助
// @namespace         https://greasyfork.org/users/159546
// @version           1.0.4
// @description       包含功能有：聊天室辅助。
// @author            LEORChn
// @include           *://wolfbbs.net/*
// @run-at            document-start
// @grant             GM_xmlHttpRequest
// @grant             GM_notification
// @connect           translate.google.cn
// @downloadURL https://update.greasyfork.org/scripts/397557/%E7%8B%BC%E4%B9%8B%E4%B9%90%E5%9B%AD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/397557/%E7%8B%BC%E4%B9%8B%E4%B9%90%E5%9B%AD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
registerPrototype();

setTimeout(function(){
    GM_notification({
        title: '通知已打开',
        text: '此消息在60秒后过期。\n'+new Date().getTime(),
        timeout: 60000,
        image: 'http://wolfbbs.net/favicon.ico'
    });
}, 2000);
var IntervalTimeout = 1000;
function onInterval(){ // daemon
    ChatRoom();
}
var chatwindow = null,
    ChatWindowWH = [770, 530],
    ID_LEORCHN_WOLFBBS_CHATROOM_CSS = 'leorchn_chatroom_css',
    ID_LEORCHN_WOLFBBS_CHATROOM_CSS_MORE_FUNCTION = 'leorchn_chatroom_css_more_function',
    ID_LEORCHN_WOLFBBS_CHATROOM_MORE_FUNCTION = 'leorchn_chatroom_more_function';
function ChatRoom(){
    Notification_init();
    var lpn = location.pathname;
    if(lpn == '/' || lpn.startsWith('/forum.php')){
        var a = $('#wgo_chat a');
        if(!a) return;
        a.onclick = function(){
            if(chatwindow){
                if(!chatwindow.closed && !confirm('您已经打开了一个聊天窗口！\n\n要重新打开吗？')) return false;
                if(!chatwindow.closed) chatwindow.close();
            }
            chatwindow = window.open('/chat.php', '_blank', 'location=no,resizable=no,width='+ChatWindowWH[0]+',height='+ChatWindowWH[1]+',left='+window.screenX+',top='+window.screenY);
            window.cwin = chatwindow;
            return false;
        };
    }else if(lpn.startsWith('/chat.php')){
        ChatRoomImpl_injectCss();
        ChatRoomImpl_injectMoreFunction();
        ChatRoomImpl_testNewMessage();
    }
}
function ChatRoomImpl_injectCss(){
    if(fv(ID_LEORCHN_WOLFBBS_CHATROOM_CSS)) return;
    var cssdiv = ct('style#'+ID_LEORCHN_WOLFBBS_CHATROOM_CSS),
        css = 'html body{ width:100vw; min-width:770px; overflow:hidden; background-position-x:-20px; background:rgb(247,246,228) }' +
        'body>div.body_wrapper{ width:100vw; padding:0; margin:0 }' +
        'body>.above_body,' +
        '#breadcrumb, form#notices, #pagetitle, #pfc_minmax, #pfc_title, #wgo, #footer, .below_body{ display:none }' + // 隐藏元素
        'div.body_wrapper>#pfc_container{ position:absolute; top:0; padding:0; z-index:-9 }' + // 外边框：去除padding
        '#pfc_channels_content .pfc_online{ width:170px }' + // 在线列表：最小宽度
        '#pfc_channels_content .pfc_chat{ width:calc(100% - 170px) }' + // 聊天窗：由在线列表减去的宽度
        '#pfc_input_container{ position:relative }' + // 调整输入框及其之后的布局方法
        '#pfc_input_container>table:first-child{ max-width:calc(100% - 175px) }' + // 限制聊天输入框大小
        '#pfc_input_container #pfc_words{ width:calc(100% - 20px); height:100%; padding:0 10px; border-radius:20px }' + // 美化聊天输入框
        '#pfc_input_container>#pfc_cmd_container{ position:absolute; width:170px; height:40px; right:2px; top:0 }' + // 表情等功能按钮设置位置
        '#pfc_input_container #pfc_logo{ position:absolute; bottom:0 }' + // 调整聊天组件（PFC）的LOGO位置
        '#pfc_input_container #pfc_ping{ position:absolute; bottom:0; right:0; margin:0; padding:0 5px; background:rgb(251,244,225) }' + // 调整延迟值显示位置
        '#pfc_container #pfc_errors:not(:empty){ position:fixed; left:0; top:0; width:100vw; line-height:100vh; background:rgba(0,0,0,0.5);font-weight:bold; font-style:normal; text-align:center; font-size:24px; z-index:999}' + // 错误信息样式
        "#pfc_errors:after{ content:' '; position:absolute; width:60vw; height:40vh; left:20vw; top:30vh; background:#fec; z-index:-9999 }" + // 错误信息样式：新对话框界面
        '#pfc_content_expandable>#pfc_smileys{ position:absolute; bottom:0px; right:0px; width:166px; padding:0 0 3px; margin-bottom:55px; z-index:99 }' + // 表情选择栏
        "#pfc_smileys:after{ content:' '; position:absolute; display:block; width:10px; height:10px; right:74px; bottom:-5px; transform:rotate(45deg); z-index:-1; background:#fff }"; // 表情选择栏的小箭头
    cssdiv.innerText = css;
    document.head.appendChild(cssdiv);
}
function ChatRoomImpl_injectMoreFunction(){
    var root = fv('pfc_bbcode_container');
    if(fv(ID_LEORCHN_WOLFBBS_CHATROOM_MORE_FUNCTION)) return;
    if(!root) return;
    var divid = '#' + ID_LEORCHN_WOLFBBS_CHATROOM_MORE_FUNCTION,
        cssdiv = ct('style#' + ID_LEORCHN_WOLFBBS_CHATROOM_CSS_MORE_FUNCTION),
        css = divid + '{ position:relative }' + // 按钮样式
        divid + '>div{ position:absolute; bottom:calc(100% + 10px); width:100px; padding:5px; transform:translateX(-25%); background:#fff; border:#000 solid 1px; z-index:99 }' + // 扩展界面样式
        divid + ">div:after{ content:' '; position:absolute; display:block; width:10px; height:10px; left:50%; bottom:-6px; transform:translateX(-50%) rotate(45deg); z-index:-2; background:#fff; border:#000 solid 1px; border-top:none; border-left:none }" + // 扩展界面的对话框小箭头
        divid + ':not(:hover)>div{ display:none }' + // 鼠标离开按钮和扩展界面后，扩展界面消失
        divid + ":hover:after{ content:' '; position:absolute; display:block; width:100%; height:100%; bottom:100% }" + // 在按钮和扩展界面之间搭建一个隐形界面，使用户在将鼠标从按钮移动到扩展界面的过程中，不被判定为“离开按钮和扩展界面”，从而防止扩展界面消失
        divid + ' a{ cursor:pointer }'; // 由于 a标签 没有 href属性 会使用默认指针样式，变为手形
    cssdiv.innerText = css;
    document.head.appendChild(cssdiv);
    var ChatRoomTest_base = function(e){
        var root = $('#pfc_channels_content .pfc_chat'),
            pack = ct('div'),
            msg = ct('div.pfc_cmd_send pfc_message pfc_evenmsg'),
            date = ct('span.pfc_date', '13/03/2020'),
            time = ct('span.pfc_heure', '20:40:39'),
            nick = ct('span.pfc_nick', '<'),
            nick_marker = ct('span.pfc_nickmarker', '其他人');
        pack.appendChild(msg);
        e.className = 'pfc_words';
        [date, time, nick, e].forEach(function(e){
            msg.appendChild(e);
        });
        nick.appendChild(nick_marker);
        nick.appendChild(document.createTextNode('>'));
        root.appendChild(pack);
    },
    ChatRoomTest_addImgText = function(){
        var span = ct('span'),
            a = ct('a'),
            img = ct('img');
        img.src = 'http://wolfbbs.net/phpfreechat/showimage.php?image=1583985191.png&t=1';
        span.appendChild(a);
        a.appendChild(img);
        span.appendChild(document.createTextNode('我这边可以打开'));
        ChatRoomTest_base(span);
    },
    ChatRoomTest_addText = function(){
        var span = ct('span');
        span.appendChild(document.createTextNode('@狼王白牙, 推特改造的话。。做过类似的，但是改得没那么好。你详细说说看你想怎么改？关闭显示 “你可能会喜欢” “趋势” 应该会挺简单的我觉得'));
        ChatRoomTest_base(span);
    },
    ChatRoomTest_addTextEmoticonText = function(){
        var span = ct('span'),
            txt1 = document.createTextNode('不知道 › @LEORChn 的推特使用习惯如何'),
            emo1 = ct('img'),
            txt2 = document.createTextNode('偶尔发一次图的反而会留在我的关注名单，太多嘴的反而会解除关注，真不适合交太多朋友，没传统论坛好用'),
            emo2 = ct('img');
        emo1.src = 'phpfreechat/data/public/themes/wolfbbs/smileys/jcdragon-tail-faster.gif';
        emo1.alt = emo1.title = '(tail)';
        emo2.src = 'phpfreechat/data/public/themes/wolfbbs/smileys/jcdragon-tea.gif';
        emo2.alt = emo2.title = '(tea)';
        [txt1, emo1, txt2, emo2].forEach(function(e){
            span.appendChild(e);
        });
        ChatRoomTest_base(span);
    };
    var rootbtn = ct('button' + divid, '更多功能'),
        listdiv = ct('div'),
        functions = {
            '复位窗口大小': ChatRoomImpl_resizeWindow
            //,'添加记录：图片+文字': ChatRoomTest_addImgText
            //,'添加记录：文字': ChatRoomTest_addText
            //,'添加记录：文字+表情+文字': ChatRoomTest_addTextEmoticonText
        };
    var funarr = [];
    for(var f in functions){
        funarr.push({
            name: f,
            fun: functions[f]
        });
    }
    funarr.forEach(function(e){
        var a = ct('a', e.name);
        a.onclick = function(){
            e.fun();
            return false;
        };
        listdiv.appendChild(a);
    });
    rootbtn.appendChild(listdiv);
    root.appendChild(rootbtn);
}
function ChatRoomImpl_resizeWindow( DO_NOT_ADD_PARAM ){
    var windowW = window.outerWidth - window.innerWidth + ChatWindowWH[0],
        windowH = window.outerHeight - window.innerHeight + ChatWindowWH[1];
    window.resizeTo(windowW, windowH);
    if(arguments.length == 0){ // 在200毫秒后重复调用一次，因为如果此前窗口是最大化的，那么边框将会无法正确计算
        setTimeout(function(){
            ChatRoomImpl_resizeWindow(0);
        }, 200);
    }
}
var ChatRoom_lastMsg = null,
    ChatRoom_initTime = 0; // 算了
function ChatRoomImpl_testNewMessage(){
    var pfc_chat = $('.pfc_chat');
    if(!pfc_chat) return;
    var all_msg = $$('.pfc_chat>div>div'),
        last_msg = $('.pfc_chat>div:last-child>div:last-child'),
        last_msg_sender = last_msg.querySelector('.pfc_nick>span'), // 空白即为系统消息（上线或者下线）
        last_msg_content = last_msg, //
        self_name = $('#pfc_handle').innerText,
        need_scroll_to_bottom = false,
        need_notify_message = false,
        need_notify_online = false,
        need_notify_offline = false;
    last_msg_sender = last_msg_sender? last_msg_sender.innerText: ''; // 将元素转换为发送者名称，null转换为空白发送者（判定为系统消息）
    if(ChatRoom_lastMsg == null){
        var login = new Audio();
        login.src = 'http://downsc.chinaz.net/Files/DownLoad/sound1/201301/2554.mp3'; // WindowsXP 开机 http://sc.chinaz.com/yinxiao/130108438723.htm
        login.volume = 0.20;
        login.play();
        ChatRoom_lastMsg = 0;
        //ChatRoom_initTime = new Date().getTime();
    }else{
        if(ChatRoom_lastMsg != last_msg){ // 判断是否需要滚动到最底部，仅首次检测到时有效
            //if(new Date().getTime() - ChatRoom_initTime < 60000) need_scroll_to_bottom = true; // 刚初始化时还没有加载图片，图片加载后会顶起来导致最新的几条消息没有显示
            if(last_msg_sender == self_name) need_scroll_to_bottom = true; // 因为自己发送了新消息所以滚动到最底下
            if(pfc_chat.scrollHeight - pfc_chat.scrollTop - pfc_chat.clientHeight < 250) need_scroll_to_bottom = true; // 因为之前就是滚动到最底下，但新消息的高度可能会有点问题所以这里判定为需要滚动到最底下
            // 滚动到底部：
            if(need_scroll_to_bottom) pfc_chat.scrollTop = pfc_chat.scrollHeight;
        }
        pl('lastmsg: ' + last_msg_sender + ': ' + last_msg_content.innerText);
        if(ChatRoom_lastMsg == last_msg) return;

        ChatRoomImpl_notification({
            type: 'msg',
            title: last_msg_sender,
            desc: last_msg_content
        });
    }
    if(last_msg != null) ChatRoom_lastMsg = last_msg;
}
function ChatRoomImpl_notification(detail){
    var title, raw, text, sound;
    switch(detail.type){
        case 'msg':
            title = detail.title;
            raw = detail.desc.querySelector('.pfc_words'); // 自己发的就会多套一层span 但是别人发的不会
            text = [];
            for(var i=0, a=raw.childNodes, len=a.length; i<len; i++){
                var e = a[i];
                text[text.length] = 'innerText' in e? // 如果不是文本节点
                    e.innerText == ''? // 如果元素节点内（A标签内）是空文本
                        ' [图片] ': // 用“图片”文本代替之
                        e.innerText: // 显示元素节点内的链接文本
                    e.textContent; // 显示文本节点的文本
            };
            text = text.join('');
            sound = WAV_MSG;
            break;
        case 'online':
            sound = WAV_ONLINE;
            break;
        case 'offline':
            break;
        case 'err':
            sound = WAV_ALERT;
            break;
        default:
    }
    GM_notification({
        title: title,
        text: text,
        timeout: 86400000, // 超时时间为1天
        image: 'http://wolfbbs.net/favicon.ico'
    });
    if(sound){
        sound.currentTime = 0;
        sound.play();
    }
}

var WAV_ONLINE = null,
    WAV_MSG = null,
    WAV_ALERT = null;
function Notification_init(){ // 可以无限制调用，但必须先调用这个才能播放声音
    var creating = function(url){
        var player = new Audio();
        player.src = url;
        //document.body.appendChild(player);
        return player;
    };
    if(WAV_ONLINE == null) WAV_ONLINE = creating('http://downsc.chinaz.net/Files/DownLoad/sound1/201308/3426.mp3'); // 狼叫 http://sc.chinaz.com/yinxiao/130824455512.htm
    if(WAV_MSG    == null) WAV_MSG    = creating('http://downsc.chinaz.net/Files/DownLoad/sound1/201703/8407.mp3'); // 接收消息 http://sc.chinaz.com/yinxiao/170304583990.htm
    if(WAV_ALERT  == null) WAV_ALERT  = creating('http://downsc.chinaz.net/Files/DownLoad/sound1/201904/11441.mp3'); // 喇叭错误 http://sc.chinaz.com/yinxiao/190428481530.htm
}

(function(){
    setInterval(onInterval, IntervalTimeout);
})();
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function ct(tag, t){
	if(arguments.length > 2) pl(new Error('Somewhere might using old version to create Elements. PLEASE UPDATE YOUR CODE.'));
	tag = {
		entity: null,
		raw: tag,
		data: tag.split(/[#\.\s]/g)
	};
	var nextStart = 0;
	tag.data.forEach(function(e){
		nextStart ++;
		if(e.length == 0) return; // continue
		nextStart --;
		switch(tag.raw.charAt(nextStart)){
			case ' ': case '.':
				addClass(tag.entity, e); break;
			case '#':
				tag.entity.id = e; break;
			default:
				tag.entity = document.createElement(e);
				nextStart --;
		}
		nextStart += e.length + 1;
	});
	if(t) tag.entity.innerText = t;
	return tag.entity;
}
function hasClass(e,n){ return new RegExp("(\\s|^)"+n+"(\\s|$)").test(e.className); }
function addClass(e,n){ if(!hasClass(e,n)) e.className=(e.className+' '+n).trim(); }
function registerPrototype(){
    Array.prototype.forEach = function(func){ for(var i=0; i<this.length; i++) try{ if(func(this[i], i, this)) return true; }catch(e){ pl(e); } };
    pl('UserScript is hooked: Array.forEach');
}
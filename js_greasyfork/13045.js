// ==UserScript==
// @name         Klep
// @namespace    Naoko
// @version      0.9
// @description  eso
// @author       @Naoko
// @match        http://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13045/Klep.user.js
// @updateURL https://update.greasyfork.org/scripts/13045/Klep.meta.js
// ==/UserScript==

//Compat


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {

        if (this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) {
                n = 0;
            } else if (n !== 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}


//Templating

var FTemplate={
    
    addStyleSheet:function(){
    
    var stylesheet ='script,style{display: none!important;}#page ~ *:not(.ui-widget-overlay), footer.contentinfo ~ *:not(.ui-widget-overlay){display: inherit}.actions-tip .col-1-3{float:left;width: 32.3%!important;margin-right:3px;text-align:center}.chat-header.alerting{background: #d35400;}.alerting{background: #d35400!important;color:#f0f0f0!important;}.notification-board.right{left: 5px!important;}.chat-content{word-break: break-word;}.chat-window{border-radius:1px}.chat-window{position: fixed;bottom: 0;z-index:9999;right: 3px;width: 230px;background-color: #fff;height:300px;border:solid 1px #A5A5A5;box-shadow:0 1px 0 2px rgba(51,51,51,0.05);float:right;margin-right:5px}.chat-header{width:100%;height:30px;border-bottom:solid 1px #A5A5A5;background:#497799;color:#f0f0f0}.chat-header span{margin-left:8px;display:inline-block;margin-top:5px;font-size:14px}.chat-body{    overflow-y: scroll;border-bottom:solid 1px #A5A5A5;height:230px;background:url(http://www.pinsho.com/wp-content/uploads/2013/11/telegram01.jpg)}.chat-body .chat-message{margin-top:5px;margin-left:5px}.chat-body .chat-message .chat-avatar img{width:24px;height:24px;margin-top:4px}.chat-body .chat-message .chat-avatar,.chat-body .chat-message .chat-content{float:left;margin-left:1px}.chat-body .chat-message .chat-content{margin-left:5px;background:#fff;padding:6px 10px;width: 145px;font-size:14px;box-shadow:0 1px 0 2px rgba(51,51,51,0.05);border-radius:1px}.chat-textarea{border:none;width:190px;height:20px;outline:none;resize:none;font-size:14px;margin-top:3px;padding-left:4px}.chat-close{z-index:999;float:right;position:absolute;right:15px;top:5px;cursor:pointer;color:#f0f0f0}#check-minimize{position:absolute;display:none}.chat-window label{padding:0!important} .chat-content img{max-width: 148px;;}.chat-state{display:inline-block;width:10px;height:10px;margin:0 2px;border-radius:30px;background:#b3bab6;position:relative;top:1px}.chat-state.online{background:#01db59}';
    var customstylesheet='.chat-window{box-shadow:0 0 5px rgba(0,0,0,0.38);border-radius:11px 11px 0 0;border:none}.chat-header{height:35px;margin-left:-1px;margin-right:-1px;border-radius:10px 10px 0 0;background:#2c3e50;width:auto;font-weight:700}.chat-header span.userName{line-height:26px}.chat-content{background-image:none;box-shadow:0 2px 3px rgba(51,51,51,0.42)!important;width:153px;margin-bottom:7px}.chat-close{z-index:9999;float:right;position:absolute;right:12px;top:8px;cursor:pointer;color:#f0f0f0;font-weight:700;width:20px;line-height:20px;height:20px;text-align:center;border-radius:50%;background-color:#1E262D;font-size:10px}.chat-body{background-color:#CCD6E0;background-image:none}.chat-body::-webkit-scrollbar{width:8px;height:8px}.chat-body::-webkit-scrollbar-button{width:24px;height:24px}.chat-body::-webkit-scrollbar-thumb{background:#e1e1e1;border:0 none #fff;border-radius:100px}.chat-body::-webkit-scrollbar-thumb:hover{background:#fff}.chat-body::-webkit-scrollbar-thumb:active{background:#000}.chat-body::-webkit-scrollbar-track{background:#676767;border:0 none #fff;border-radius:100px}.chat-body::-webkit-scrollbar-track:hover{background:#666}.chat-body::-webkit-scrollbar-track:active{background:#333}.chat-body::-webkit-scrollbar-corner{background:transparent}';
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.appendChild(document.createTextNode(stylesheet));
    document.getElementsByTagName('head')[0].appendChild(s);
    //custom
    s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.appendChild(document.createTextNode(customstylesheet));
    document.getElementsByTagName('head')[0].appendChild(s);
},
              buildMessage:function(text,avatar,lastId,msgid){
                  var tT='<div class="chat-message clearfix" lastId="" msgid="">  <div class="chat-avatar"><img src="" alt="" class="hovercard" data-uid=""></div>  <div class="chat-content"></div>  </div>';
                  var obj=$(tT);
                  $(obj).attr('lastId',lastId);
                  $(obj).attr('lastId',msgid);
                  $(obj).children(".chat-avatar").children('img').attr("src",avatar);
                  $(obj).children(".chat-content").html(text);
                  return obj;
              },
              buildNewWindow:function(userName,dataId){
                  var tT='<div class="chat-window" usrid=""><div class="chat-header"><span class="chat-state"></span><span class="userName"></span></div><span class="chat-close">X</span><div class="chat-body clearfix"></div><div class="chat-textarea"><textarea class="chat-textarea"></textarea></div></div>';
                  var obj=$(tT);
                  $(obj).children(".chat-header").children(".userName").html(userName);
                  $(obj).attr("usrid",dataId);
                  
                  return obj;
              },
    replaceHover:function(){
        Hovercard.template='<div class="tooltip-v6 compact{{#selfTooltip}} self{{/selfTooltip}}">\
	<span class="pick"></span>\
	<div class="clearfix data-tip">\
		<div class="user-tip">\
			<a href="{{user_url}}" class="avatar-tip"><img src="{{avatar}}" /></a>\
			<a class="nick" href="{{user_url}}">{{nick}}</a>\
			<div class="user-fullname">{{full_name}}</div>\
			<div class="user-status">\
				<span class="state {{userStatus}}"></span>\
				{{#rewards}}\
				<span class="icon-recompensado"></span>\
				{{/rewards}}\
				<span class="icon-{{genderClass}} sexo"></span>\
			</div>\
			<div class="stats-tip">\
				<div class="col-1-3 stats-posts">\
					<strong>{{countPosts}}</strong>\
					<a href="{{posts_url}}" class="stat-link">Posts</a>\
				</div>\
				<div class="col-1-3 stats-posts">\
					<strong>{{points}}</strong>\
					<span>Puntos</span>\
				</div>\
				<div class="col-1-3 stats-shouts">\
					<strong>{{countShouts}}</strong>\
					<a href="{{mi_url}}" class="stat-link">Shouts</a>\
				</div>\
				<div class="col-1-3 stats-shouts">\
					<strong>{{following}}</strong>\
					<a href="{{following_url}}" class="stat-link">Siguiendo</a>\
				</div>\
				<div class="col-1-3">\
					<strong>{{followers}}</strong>\
					<a href="{{followers_url}}" class="stat-link">Seguidores</a>\
				</div>\
			</div>\
			<div class="actions-tip">\
			{{^selfTooltip}}\
				<div class="col-1-3">\
					<a class="btn mensaje require-login" {{^isLogged}}disabled="true"{{/isLogged}} href="{{message_url}}">Enviar mensaje</a>\
				</div>\
				<div class="col-1-3">\
					{{#isLogged}}\
					{{{followButton}}}\
					{{/isLogged}}\
					{{^isLogged}}\
					<div class="follow-buttons">\
						<a disabled="true" class="btn g not-following require-login">\
							<div class="btn-text follow-text"><i class="follow"></i>Seguir</div>\
						</a>\
					</div>\
					{{/isLogged}}\
				</div>\
               {{#isLogged}}\
<div class="col-1-3">\
<a class="btn mensaje alerting floatR" style="width: 100%;" onclick="openChatTo(\'{{nick}}\')">Chat</a>\
</div>\
 {{/isLogged}}\
			{{/selfTooltip}}\
			</div>\
		</div>\
	</div>\
</div>'; 
    }

             };


var getSocketDir = function(){
  
    var rData;
    $.ajax({
        url: '/protocolo',
        data:"",
        async:false, //Wait for request
        beforeSend: function(xhr, settings) {settings.url="/protocolo"; xhr.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});},
        success: function(r) {
            var re = /new Realtime\({"host":"(.*)","port":(\d+),"useSSL":(.*)}\)/ig; 
            var m;

            while ((m = re.exec(r)) !== null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
                rData={error:false,host:m[1],port:m[2],ssl:m[3]};
            }
        },
        error: function() {
            console.log('fail');
            rData={error:true};
        }
    });
    return rData;
};
var onMsg=function(msg){

    //console.log(msg.data);	//Awesome!
    var pM=$.parseJSON(msg.data);
    if(pM.text.event.actionName=='new-message' || pM.text.event.actionName=='message-new-reply'){
        var ooj=checkIsInArray(pM.text.event.object.owner);
        if(typeof ooj == 'object'){
           addMP(ooj);
        }
        else{
             var newWin= new MpChat();
            newWin.BuildNew(pM.text.event.image.href.replace('/',''),pM.text.event.object.owner,pM.text.event.image.src);
            addMP(newWin);
            
        }
    }
};

function removeChat(obj){
    var lenght= activeList.length;
    var index;
    for(a=0;a<lenght;a++){
        if(typeof activeList[a] !== 'undefined'){
            if(activeList[a].uid==obj.uid){
              //get index
                index=a;
                break;
            }
        }
    }
    
    if(index===undefined){ return;}
    
    //remove and re-order
    clearInterval(obj.onlineTimer);
    $(obj.window).remove();
    
    var pos = activeList.indexOf(obj);
            
    if(pos>-1){activeList.splice(pos,1);}
    
    lenght= activeList.length;
    for(a=index;a<lenght;a++){
        if(a==0){
            $(activeList[a].window).css("right","3px");
        }
        else{
            $(activeList[a].window).css("right",parseInt($(activeList[a].window).css("right"))-250+"px");
        }
    }
        if(!isLoading){ChatGestor.saveChats();}
    
}

function addMP(obj){
    $.post('/ajax/mp/last',function(ooooo){
        var TaringaDeMierda="/mensajes/leer/"+ooooo.data[0].id;
        $.ajax({url:TaringaDeMierda,beforeSend:function(xhr, settings){settings.url=TaringaDeMierda;},
                success:function(res){
                    var frId=/msgid_fastreply='(\d+)'/ig;
                    var r=frId.exec(res);
                    var rplyId=r[1];
                    var reg = /<\/span>\s*<div class="comment-content">\s*(.*?)\s*<\/div>\s*/ig;
                    var mpar= reg.exec(res);
                    var MPS = mpar[1];
                    obj.newMessage(MPS,false,0,rplyId);
                    if(!$(obj.window).children('.chat-header').hasClass('alerting')){
                        $(obj.window).children('.chat-header').addClass('alerting');
                    }
                }});
    });
}

function checkIsInArray(uId){
    var length= activeList.length;
    for(a=0;a<length;a++){
        if(typeof activeList[a] !== 'undefined'){
            if(activeList[a].uid==uId){
                return activeList[a];
            }
        }
    }
    return false;
}

var onclose = function(){
    console.log("Ws closed, reconnecting");
    setTimeout(function(){openWs(ioi);},1000);
};
function openWs(ioi){
    var chnn=localStorage.Realtime_channels.split(':')[0].replace('{','').replace('"','').replace('"','');
    
    coco = new WebSocket(((ioi.ssl=='false')?'ws://':'wss://') + ioi.host + ':' + ioi.port + '/ws/' + chnn);
    coco.onmessage = onMsg;
    coco.onopen = function(){
        console.log("Ws open");
    };
    coco.onclose = onclose;
    
}
var ioi;
if(localStorage.wsChat==undefined){
    localStorage.setItem('wsChat','false');
}
activeList=[];
    var isLoading=false;
var ChatGestor={

    //[{
    //   uid:int,
    //   userName:str,
    //   avatar:str,
    //   minimized:bool,
    //    lasts:[{
    //       id:int,
    //       text:str,
    //       isMe:bool
    //     }]    
    //}]
    addEvent:function(){

           //ok
            window.addEventListener("storage", function (e) {
                
               
                if (event.key == 'TFCHTabs') {
                     if(isLoading){return;}
                    console.log("New Message");
                    var datat=JSON.parse(localStorage.TFCHTabs);
                   // if(!datat.update){return;}
                    var udata= JSON.parse(getUserDataByNickName(datat.to).responseText);
                    var ooj =checkIsInArray(udata.id);
                    //if(ImParent && datat.isMe){return;}
                    if(typeof ooj !== 'object'){

                        var newWin= new MpChat();
                        newWin.BuildNew(udata.nick, udata.id,udata.avatar.medium);
                        newWin.newMessage(datat.text,datat.isMe,0,datat.id);
                        if(!$(newWin.window).children('.chat-header').hasClass('alerting') && !datat.isMe){
                            $(newWin.window).children('.chat-header').addClass('alerting');
                        }
                    }
                    else{
                        ooj.newMessage(datat.text,datat.isMe,0,datat.id);
                        if(!$(ooj.window).children('.chat-header').hasClass('alerting') && !datat.isMe){
                            $(ooj.window).children('.chat-header').addClass('alerting');
                        }
                    }
                    //localStorage.TFCHTabs=JSON.stringify({"update":false,"to":"","id":0,"text":""});
                }
                else if (event.key == 'TFCH') {
                    //ToDo: Change chats states
                }
            }, false);

    },
    createChats:function(){
        isLoading=true;
        var chts=JSON.parse(localStorage.TFCH);
        for(a=0;a<chts.length;a++){
            var ooj=checkIsInArray(chts[a].uid);
            if(typeof ooj !== 'object'){
                var newChat= new MpChat();
                newChat.BuildNew(chts[a].userName,chts[a].uid,chts[a].avatar);
                //add last msgs
                for(b=chts[a].lasts.length-1;b>-1;b--){
                    newChat.newMessage(chts[a].lasts[b].text, chts[a].lasts[b].isMe ,0 ,chts[a].lasts[b].id);
                }
                newChat.minimize(chts[a].minimized);
            }
        }
        isLoading=false;
    },
    saveChats:function(){
        
        var compos=[];
        for(a=0;a<activeList.length;a++){
            var tP={
                uid:0,
                userName:'',
                avatar:'',
                minimized:false,
                lasts:[],
            };
            tP.uid = activeList[a].uid;
            tP.userName=activeList[a].nickName;
            tP.avatar=activeList[a].avatar;
            tP.minimized=activeList[a].minimized;
            var length=activeList[a].msgs.length;
            if(length>5){length=5;}
            
            for(b=0;b<length;b++){
                var ccn=activeList[a].msgs.length - 1 - b;
                var opbj=activeList[a].msgs[ccn];
                
                tP.lasts.push(opbj);
            }
            compos.push(tP);
        }
        localStorage.TFCH= JSON.stringify(compos);
    }
    
};
var MpChat= function(){
    var th = this;
    var window;
    var avatar;
    var uid;
    var nickName;
    var msgs;
    var minimized;
    var onlineTimer;
    this.minimize=function(mbool){
        var checked=$(th.window).hasClass('Chat-Minimized');
         
        if(checked && mbool) {return;}
        if(!checked && !mbool) {return;}
            if(!checked){
                $(th.window).css("height","36px");
                $(th.window).addClass('Chat-Minimized');
                this.minimized=true;
            }
            else{
                $(th.window).css("height","300px");
                $(th.window).removeClass('Chat-Minimized');
                this.minimized=false;
            }
       if(!isLoading){ChatGestor.saveChats();}
    };
    this.BuildNew=function(useName, userId,avatar){
        //Create new window
        this.uid=userId;
        this.window=FTemplate.buildNewWindow(useName,userId);
        //Add to container
        $('body').append(this.window);
        this.avatar=avatar;
        this.nickName=useName;
        //Add events
        //$(this.window).children('"#check-minimize"').toggle(this.checked);
        $(this.window).on('click','.chat-close',function(){
            //Remove from array
           /* 
            var pos = activeList.indexOf(th.window);
            
            if(pos>-1){activeList.splice(pos,1);}
            */
           removeChat(th);
        });
        $(this.window).on('click','.chat-header',function(){
            var checked=$(th.window).hasClass('Chat-Minimized');
            if(!checked){
                $(th.window).css("height","36px");
                $(th.window).addClass('Chat-Minimized');
                th.minimized=true;
            }
            else{
                $(th.window).css("height","300px");
                $(th.window).removeClass('Chat-Minimized');
                if($(th.window).children('.chat-header').hasClass('alerting')){
                    $(th.window).children('.chat-header').removeClass('alerting');
                }            
                th.minimized=false;
            }
             if(!isLoading){ChatGestor.saveChats();}
        });
        $(this.window).on('click','.chat-textarea',function(ev){
            if($(th.window).children('.chat-header').hasClass('alerting')){
                $(th.window).children('.chat-header').removeClass('alerting');
            }            
        });
        $(this.window).on('keypress','.chat-textarea',function(ev){
            if($(th.window).children('.chat-header').hasClass('alerting')){
                $(th.window).children('.chat-header').removeClass('alerting');
            }
            if($(this).val() ==='' && ev.which  ==13){ return;}

            if(ev.which  ==13 && !ev.shiftKey){
                    ev.preventDefault();
                    var lidd=$(th.window).children('.chat-body').children('.chat-message').last().attr('lastid');
                    var that=this;

                    var toSnd={
                        "fastreply":$(that).val(),
                        "user_from_id":$(th.window).attr('usrid'),
                        "msg_id":lidd
                    };

                    if(typeof lidd ==='undefined'){
                        toSnd={
                            msgSubject:"",
                            msgText:$(that).val(),
                            msgTo:th.nickName
                        };
                        th.newMessage($(that).val(),true,1,lidd);
                        $(that).val("");
                        //Send New MP
                        $.post('/ajax/mp/compose',toSnd,function(){


                        }).error(function(){
                            //ToDo: show error
                        });
                    }
                    else{                
                        //Send Fast reply
                        th.newMessage($(that).val(),true,1,lidd);
                        $(that).val("");
                        $.post('/ajax/mensajes/responder',toSnd,function(){

                        }).error(function(){
                            //ToDo: show error
                        });
                    }
                
            }
        });

            //Add to Array
        
        activeList.push(this);
        this.msgs=[];
        if(activeList.length>1){       
            $(th.window).css("right",(250*(activeList.length-1))+"px");
        }
        this.minimized=false;
        this.onlineTimer=setInterval(function(){
            $.post('/ajax/mentions/user',{uid:th.uid},function(ev){
                var hasOnline=$(th.window).children('.chat-header').children('.chat-state').hasClass('.online');
                var isOnline=(ev.data.userStatus=="online")?true:false;
                if(hasOnline && isOnline){return;}
                if(!hasOnline && !isOnline){return;}
                if(!hasOnline && isOnline){
                    $(th.window).children('.chat-header').children('.chat-state').addClass('online');
                }
                if(hasOnline && !isOnline){
                    $(th.window).children('.chat-header').children('.chat-state').removeClass('online');
                }
                });            
                   },30000);
        $.post('/ajax/mentions/user',{uid:th.uid},function(ev){
            var hasOnline=$(th.window).children('.chat-header').children('.chat-state').hasClass('.online');
            var isOnline=(ev.data.userStatus=="online")?true:false;
            if(hasOnline && isOnline){return;}
            if(!hasOnline && !isOnline){return;}
            if(!hasOnline && isOnline){
                $(th.window).children('.chat-header').children('.chat-state').addClass('online');
            }
            if(hasOnline && !isOnline){
                $(th.window).children('.chat-header').children('.chat-state').removeClass('online');
            }
        });   
        if(!isLoading){ChatGestor.saveChats();}
    };
    
    this.newMessage=function(Message,isMy,lastId,rid){
        var tmpl=FTemplate.buildMessage(Message,(isMy)?$('.user-picture').attr('src'):this.avatar,lastId,rid);
        $(this.window).children(".chat-body").append(tmpl);
        var oasd=$(this.window).children(".chat-body");
        if(!isMy){  $(oasd).children('.chat-message').last().children(".chat-avatar").children('img').attr('data-uid',th.uid);}
        oasd.scrollTop(oasd.prop("scrollHeight"));
        this.msgs.push({id:rid,text:Message,isMe:isMy});
        if(!isLoading){ChatGestor.saveChats();localStorage.TFCHTabs=JSON.stringify({"isMe":isMy,"update":true,"to":this.nickName,"id":rid,"text":Message});}
    };
    
};
openChatTo=function(userName){
    
    //newWin.BuildNew
    var uData= JSON.parse(getUserDataByNickName(userName).responseText);
    if(typeof uData.nick ==="undefined"){
        alert('El usuario no existe');
        return;
        
    }
    var ooj=checkIsInArray(uData.id);
        if(typeof ooj !== 'object'){
            var newWin= new MpChat();
            newWin.BuildNew(uData.nick,uData.id,uData.avatar.medium);
            
        }
    else{
        ooj.minimize(false);
    }
}
var getUserDataByNickName=function(NickName){
        return $.ajax({
            url:"http://api.taringa.net/user/nick/view/"+NickName,
            async: !1,
        });
       
};
function modifySide(){
    var avList=$('#sideSeguidos').children('.avatar-list').children('.hovercard');
    $(avList).on('click',function(ev){
        ev.preventDefault();ev.stopPropagation();
        var ooj=checkIsInArray($(this).attr('data-uid'));
        if(typeof ooj == 'object'){
            ooj.minimize(false);
        }
        else{
            var newWin= new MpChat();
            newWin.BuildNew($(this).children('a').attr('href').replace('/',''),$(this).attr('data-uid'),$(this).children('a').children('img').attr('src'));
        }
    });
}
TaringaChatWindowClosing=false;
window.onbeforeunload = function (e) {
//Set off
    TaringaChatWindowClosing=true;
    if(localStorage.wsChat=="true"){
        localStorage.wsChat="false";
    }
 }
//Set Event LocalStorage
window.addEventListener('storage', function (event) {
  if (event.key == 'wsChat' && !TaringaChatWindowClosing ) {
      if(localStorage.wsChat!="true"){
          //event.newValue;
          oi= getSocketDir();

          openWs(ioi);
          localStorage.wsChat="true";
          ImParent=true;
      }
  }
});
var ImParent=false;
$(document).ready(function(){
    //Build chat
    FTemplate.addStyleSheet();
   FTemplate.replaceHover();
    //Open Websocket.
    if(localStorage.wsChat!="true"){
        ioi=getSocketDir();
        openWs(ioi);
        ImParent=true;
        //And set parent
        localStorage.wsChat="true";
    }
    $('.perfil-info').append('<a class="btn g floatL startChat"><div class="btn-text">Chat</div></a>');
    
    //$('span.nickntame').html().replace(/@/,'')
    if(localStorage.TFCH == undefined){
        localStorage.setItem('TFCH','[]');
    }
    if(localStorage.TFCHTabs == undefined){
        localStorage.setItem('TFCHTabs','{"update":false,"to":"","id":0,"text":""}');
    }
    ChatGestor.createChats();
    ChatGestor.addEvent();
    modifySide();
    $('body').on('click','.startChat',function(ev){
        ev.preventDefault();
        openChatTo($('span.nickname').html().replace(/@/,''));
    });
});
//Nice

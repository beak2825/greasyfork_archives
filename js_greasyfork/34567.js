// ==UserScript==
// @name        WEX.nz (Btc-e) Chat Filter
// @name:en     WEX.nz (Btc-e) Chat Filter
// @name:ru     WEX.nz (Btc-e) Chat Filter (Фильтр сообщений для чата WEX.nz (Btc-e))
// @namespace   WexChatFilter
// @description (Btc-e) Chat Filter. Show message only select users. 
// @description:en WEX.nz (Btc-e) Chat Filter. Show message only select users. 
// @description:ru Расширение-фильтр для чата wex.nz. Отображает сообщения только выбраных пользователей.
// @include     https://wex.nz/*
// @version     0.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34567/WEXnz%20%28Btc-e%29%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/34567/WEXnz%20%28Btc-e%29%20Chat%20Filter.meta.js
// ==/UserScript==
'use strict'
var lists={};
var WCFActive = 1;
lists['whiteList'] = ['admin', 'admin1', 'support', 'system','QWERTAS'];
lists['readList'] = [ 'aclon','tar730'];
lists['blackList'] = [ 'ddr3','tar729'];
// имя пользователя для которого открыто дополнительное меню
var cMenuUsername='';
/*список всех ников пользователей, от которых есть сообщения в чате*/
var usersInChat = {};
$( document ).ready(function() {
    console.log('Wex chat filter script load!');
    restoreLocal();
    if(!auth)nChatEnableRefresh();
    if(auth_login && !checkUserInList(auth_login, 'whiteList'))
        changeList(auth_login, 'whiteList');
    setInterval(function(){
        userActive();
    }, 300000);
    chatChannel.unbind("msg", nChatPutMsg);
	chatChannel.bind("msg", (x)=>{
        auth ? nChatPutMsg(x):nChatPutMsg_unlogin(x);
        parseChatMessage($( ".chatmessage").last());
        checkRealTarget($( ".chatmessage").last());
        check();
    })
    createAdditionButtons();
    firstStart();
    check();
});
function restoreLocal(){
    WCFActive = localStorage.getItem('WCFActive');
    if(WCFActive == undefined){
        WCFActive = 1;
	    localStorage.setItem('WCFActive', WCFActive);
    }
    loadFromlocalStorage("whiteList");
    loadFromlocalStorage("readList");
    loadFromlocalStorage("blackList");
}    
function createUserMenuButton(bName, bText, bTextDel){
    $('#cMenuIgnore-text').parent().append($('#cMenuIgnore-text').clone().attr('id', bName+'-text').text(bText));
    $('#cMenuIgnore-text').parent().append($('#cMenuIgnore-text').clone().attr('id', bName+'-text-del').text(bTextDel));
    let $cMenu = $('#cMenu');
    let $newButton = $('#cMenuProfile').clone();
    $newButton.attr("id",bName);
    $cMenu.append($newButton);
    $("#nChat").on("click", ".chatmessage > a", function(){
        cMenuUsername = $(this).text();
        let user = $(this).parent().data('userdata');
        onClickUser(user);
    });
    $("#nChat").on("click", ".chatmessage > span >a", function(){
        cMenuUsername = $(this).text();
        let user = $(this).parent().parent().data('userdata');
        onClickUser(user);
    });
    function onClickUser(user){
        if(user){
            if(user.Name == cMenuUsername){
                //menu open for main user
            }else{
                //menu open for user message target
                if(user.realTarget && user.Target){
                    cMenuUsername = user.Target;
                    //hide unusable options
                    $('#cMenuProfile').hide();
                    $('#cMenuInChat').hide();
                    $('#cMenuPM').hide();
                    $('#cMenuIgnore').hide();
                }
            }
        }
        let additionText = '';
        if(checkUserInList(cMenuUsername, bName))
            additionText = '-del';
        $("#"+bName).show().html("<a href='javascript:void(0)' class='profileBtn'>"+$("#"+bName+"-text"+additionText).html()+"</a>");
    }

    $("#"+bName).on("click", "a.profileBtn", function(){
        changeList(cMenuUsername, bName);
    });
}
function createAdditionButtons(){
    createUserMenuButton('whiteList', 'To whitelist', 'Drop from whitelist');
    createUserMenuButton('readList', 'To readable', 'Drop from readable');
    createUserMenuButton('blackList', 'To blacklist', 'Drop from blacklist');
    let $nChatSettings = $('#nChatSettings');
    let $newUl = $('<ul></ul>');
    $nChatSettings.css("height","14%")
                  .css( "padding-left", "+=15")
                  .find('a').wrap('<li>');
    $nChatSettings.find('li').each(function(i,elem) {
        $newUl.append($(elem));
    })
    $nChatSettings.empty()
                  .append($newUl);
    $newUl.css("width","100%");
    function createChatMenuButton(bElemId, bText, bTitle, bFunc){
        let $newLi = $("<li><a href='javascript:void(0)' title = '"+bTitle+"' id = '"+bElemId+"'>"+bText+"</a></li>");
        $newUl.append($newLi);
        $newLi.click(bFunc);
    }
    $newUl.append($("<a><span style='color:red'>W</span>ex <span style='color:red'>C</span>hat <span style='color:red'>F</span>ilter options:</a>"));
    createChatMenuButton('cTurnOnOffWCF-text', 'Turn on/off WCF','', turnOnOffWCF);
    //createChatMenuButton('cClearAllIgnored', 'Clear ignore list','Attention! Clear you ignore list!', clearIgnoreList);
    setTurnOnOffText();
}
function setTurnOnOffText(){
    let textDescribe = (WCFActive == 1)?'Turn Off WCF ':'Turn On WCF ';
    $('#cTurnOnOffWCF-text').text(textDescribe);  
}
function clearIgnoreList(){
    //chat_ignored = {"900828":"makewebuy","923838":"vors"};
    nChatSettingsToggle(1);
    if(WCFActive != 1)return;
    for(let ignor in chat_ignored){
        nChatIgnoreDel(ignor);
        setTimeout(clearIgnoreList, 250);
        break;
    }
}
function turnOnOffWCF(){
    console.log("Change WCFActive call");
    nChatSettingsToggle(1);
    if(WCFActive == 1){
        WCFActive = 0;
        $('.chatmessage').each(function(i,elem) {
            $(elem).show();
        });
    }else{
        WCFActive =1;
        check();
    }
    localStorage.setItem('WCFActive', WCFActive);
    setTurnOnOffText();
}
function changeList(username, listname){
    for(let l in lists){
        let i=lists[l].indexOf(username);
        if(i==-1){
            if(l == listname)
                lists[listname].push(username);
        }else{
            //пользователь уже в списке -> удаляем
            lists[l].splice(i,1);
        }
        saveTolocalStorage(l);
    }
    check();
}
function loadFromlocalStorage(listname){
    let loc = localStorage.getItem(listname);
	(!loc) ? localStorage.setItem(listname, lists[listname]):lists[listname] = loc.split(',');
}
function saveTolocalStorage(listname){
	localStorage.setItem(listname, lists[listname]);
}
function checkUserInList(username, listname){
    return lists[listname].some((x) => x == username);
}
function nChatPutMsg_unlogin(a){
    a=JSON.parse(a);
    if(nChatCheckForIgnore(a.uid))
        return!0;
    var b=new RegExp("\\b"+auth_login+"\\b","ig");
    let u_style=a.login==auth_login?
    "color: #193477 !important;":
    "color: "+a.usr_clr;
    let m_style = "";
    b="<p id='msg"+a.msg_id+"' class='chatmessage uid"+a.uid+"' style='"+m_style+"display:none'>"+("<a title='"+a.date+"' style='"+u_style+" !important; font-weight: bold;' href='javascript:void(0)' onclick='nChatMenu("+a.uid+', "'+a.login+'", '+a.msg_id+", event)'>"+a.login+"</a>")+": <span>"+a.msg+"</span></p>";
    $("#nChat").append(b);
    let old_msg_size=0;
    512<$("#nChat p").length&&(old_msg_size=$("#nChat p").first().outerHeight(!0),$("#nChat p").first().remove());
    $("#msg"+a.msg_id).fadeIn(100);
    let new_msg_size=$("#msg"+a.msg_id).outerHeight(!0);
    nChatScroll(new_msg_size,old_msg_size)
}
function firstStart(){
    console.log('firstStart() call');
    $('.chatmessage').each(function(i,elem) {
        parseChatMessage($(elem));
    })
    $('.chatmessage').each(function(i,elem) {
        checkRealTarget($(elem));
    })
    //console.log('usersInChat: '+JSON.stringify(usersInChat));    
}
function parseChatMessage($elem){
    if($elem.data('userdata'))return;
    let text = $elem.text();
    let html = $elem.html();
    let splitText = text.split(':');

    let user = {
        'Id': html.match(/(nChatMenu\()(\d{1,8})/)[2],
        'Name': splitText[0],
        'Target': getTagretUserFromMessage(splitText[1]),
        'realTarget': 0
    }
    usersInChat[user.Name] = user.Id;
    $elem.data('userdata', user);
    //console.log(JSON.stringify(user));
}
function checkRealTarget($elem){
    let user = $elem.data('userdata');
    if(!user)return;
    /*флаг того, что ответ-цитирование обращено к реальному пользователю*/
    if(usersInChat[user.Target]){
        user.realTarget = 1;
        $elem.find('span').html('<a style="color: #524949" href="javascript:void(0)" onclick="nChatMenu(206642, \''+user.Target+'\', 345345, event)">'+user.Target+'</a><span>'+$elem.text().slice(user.Name.length+2+user.Target.length))+'</span>';
    }
}
function check(){
    if(WCFActive != 1)return;
    console.log('check() call');
    //массив юзеров, для которых есть ответы цитированием от юзеров с whitelist
    let targetList = [];
    $('.chatmessage').each(function(i,elem) {
        let user = $(elem).data('userdata');
        if(!user)return;
       // console.log(JSON.stringify(user));
        /*Отображаются все сообщения пользователей с белого списка, кроме тех, которые
        адрессованы пользователям с черного списка*/
        if(checkUserInList(user.Name,'whiteList')){
            if(!user.realTarget ){
                $(elem).show();
            }else{         
                if(!checkUserInList(user.Target,'blackList')){
                    targetList.push(user.Target);
                    $(elem).show();
                }else{
                    $(elem).hide();
                }
            }
            return;
        }else{
            /*Отображаются только сообщения никому не адрессованные или
            адресованные юзерам с белого списка*/
            if(checkUserInList(user.Name,'readList')){
                if(!user.realTarget ){
                    $(elem).show();
                }else{         
                    if(checkUserInList(user.Target,'whiteList')){
                        $(elem).show();
                    }else{
                        $(elem).hide();
                    }
                }
                return;
            }
            $(elem).hide();        
        }
    });
    /*не все сообщения от юзеров, которые цитируются пользователями
     с whitelist отображаются в чате. Не отображаются сообщения
     таргет юзера, которые адресованы людям не из whitelist*/
    targetList.forEach((val)=>$("#nChat .uid"+usersInChat[val]).each(function(i, elem){
        let quotes = getTagretUserFromMessage($(elem).text().split(':')[1]);
        if(lists['whiteList'].some((x) => x == quotes) 
           || usersInChat[quotes]==='undefined' 
           || quotes =='' ){
            $(elem).show();
            //console.log(quotes+'**'+usersInChat[quotes])
        }
    })); 
    console.log('End check()');
}
function getTagretUserFromMessage(message){
    if(!message)return '';
    let target = message.split(',')[0];
    if(target.length<=1)return '';
    target = target.slice(1);
    if(target && target.split(' ').length === 1)return target;
    return '';
}
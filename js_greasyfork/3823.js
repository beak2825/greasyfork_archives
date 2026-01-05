// ==UserScript==
// @name		   DRRR Keep Alive
// @namespace	   us.drrr.keep-alive
// @description		 保持DRRR在线
// @version				   1.3
// @include		   http://drrr.us/room/*
// @include		   http://drrr.us/room/
// @require					http://cdn.staticfile.org/jquery/1.11.0/jquery.min.js
// @run-at					document-end
// @downloadURL https://update.greasyfork.org/scripts/3823/DRRR%20Keep%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/3823/DRRR%20Keep%20Alive.meta.js
// ==/UserScript==
/*
* =====================設置=====================
*/
// ======這裡修改間隔======
//格式：var popInterval = 分鐘數
//注意：請不要設置過小或過大
var popInterval = 4.9;


/*
* =====================程序=====================
*/

Date.prototype.format = function (fmt) {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var date = this.getDate();
    var hour = this.getHours();
    var minute = this.getMinutes();
    var second = this.getSeconds();

    fmt = fmt.replace("yyyy", year);
    fmt = fmt.replace("yy", year % 100);
    fmt = fmt.replace("MM", fix(month));
    fmt = fmt.replace("dd", fix(this.getDate()));
    fmt = fmt.replace("hh", fix(this.getHours()));
    fmt = fmt.replace("mm", fix(this.getMinutes()));
    fmt = fmt.replace("ss", fix(this.getSeconds()));
    return fmt;

    function fix(n) {
        return n < 10 ? "0" + n : n;
    }
}

var aliveKeeper = function(){
    var userName = null;
    var userIcon = null;
    var userId =null;
    var talksElement = null;
    var popMessage = null;

    var init = function(){
        userId   = trim($("#user_id").text());
        userName = trim($("#user_name").text());
        userIcon = trim($("#user_icon").text());
        talksElement	  = $("#talks");
        popMessage = '「Pop」&「冒泡」&「ポップ」';

        if(popInterval<1){
            popInterval = 1;
        }
    }
    var addTail = function()
    {

        var height = $(this).find(".body").height() + 30 + 8;
        var outerHeight = $(this).find(".body").outerHeight();
        var top = (Math.round((180 - height) / 2) + 24) * -1;
        var bgimg	 = $(this).find(".body").css("background-image");
        var rand = Math.floor(Math.random()*3);
        var tailClass = null;

        if ( rand == 2 ) {
            tailClass = "top";
        } else if ( rand == 1 ) {
            tailClass = "center";
        } else {
            tailClass = "bottom";
        }

        top = top + 1;

        $(this).find(".body");

        $(this).prepend('<div class=tail-wrap><div class=tail-mask></div></div>');
        $(this).children(".tail-wrap").addClass(tailClass).css({
            "background-size":outerHeight+"px"
        });
    }
    var trim = function(string)
    {
        string = string.replace(/^\s+|\s+$/g, '');
        return string;
    }
    var effectBaloon = function()
    {
        var thisBobble = $(".bubble .body:first");
        var thisBobbleWrap = $(".bubble").parent();
        var thisBobblePrent = thisBobble.parent();

        ringSound();

        $.each(thisBobblePrent, addTail);

        //if ( isUseAnime ) {
        thisBobblePrent.parent().addClass("bounce");
        //}
    }

    var ringSound = function(){
        /*
        if ( !isUseSound ) {
        return;
    }
    */
    try  {
        messageSound.play();
    } catch(e) {

    }
}

var escapeHTML = function(ch)
{
    ch = ch.replace(/&/g,"&amp;");
    ch = ch.replace(/"/g,"&quot;");
    ch = ch.replace(/'/g,"&#039;");
    ch = ch.replace(/</g,"&lt;");
    ch = ch.replace(/>/g,"&gt;");
    return ch;
}
var writeSelfMessage = function(message){
    var name		 = escapeHTML(userName);
    var message = escapeHTML(message);

    if(message == '/roll'){
        return;
    }

    var content = '<dl class="talk '+userIcon+'" id="'+userId+'">';
    content += '<dt class="dropdown">';
    content += '	<div class="avatar avatar-'+userIcon+'"><span>'+name+'</span></div>';
    content += '	<div data-toggle="dropdown" class="name"><span>'+name+'</span></div>';
    content += '	<ul class="dropdown-menu" role="menu">';
    content += '	  <li><a tabindex="-1" class="dropdown-item-reply">@<span>'+name+'</span></a></li>';
    content += '	</ul>';
    content += '</dt>';
    content += '<dd><div class="bubble">';
    content += '<p class="body">'+message+'</p>';
    content += '</div></dd></dl>';
    talksElement.prepend(content);
    effectBaloon();
}
var showFirstRun = function(){
    popMessage = prompt("自動消息內容：",'「Pop」&「冒泡」&「ポップ」');
    localStorage["drrr-keep-alive-message"] = popMessage;
    localStorage["drrr-keep-alive-set"] = 'true';
}
var loadSettings =function(){
    popMessage = localStorage["drrr-keep-alive-message"];
}
var keepOnce = function(){
    var timeStamp = new Date().format(" 今日MM月dd日 現在hh時mm分 ");
    var keepMsg =	 popMessage + timeStamp;
    jQuery.post('', {
        message:keepMsg
    });
    writeSelfMessage(keepMsg);
}
this.activate = function(){
    if(localStorage){
        if(localStorage["drrr-keep-alive-set"]==null || localStorage["drrr-keep-alive-set"]==''){
            showFirstRun();
        }else{
            loadSettings();
        }
    }
    setInterval(keepOnce, 60000 * popInterval);
}
this.writeSelfMessage = writeSelfMessage;
init();
return this;
}



var alive = aliveKeeper();
alive.activate();

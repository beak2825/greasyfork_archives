// ==UserScript==
// @name         Region filter
// @namespace    mod.amateri.com
// @version      0.4
// @description  Prida filtr podle regionu do chatu na Amaterech
// @author       pe2pi
// @match        https://www.amateri.com/chat-ws/?*
// @match        https://www.amateri.com/chat-ws/right*
// @match        https://www.amateri.com/chat-ws/bottom*
// @downloadURL https://update.greasyfork.org/scripts/36626/Region%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/36626/Region%20filter.meta.js
// ==/UserScript==

var chat_dir = "/chat-ws";

//////////// insert select box
if(location.pathname == chat_dir + "/right.php" || location.pathname == chat_dir + "/bottom.php")
{
    var regionSelectUsers = document.createElement ('select');
    var regionSelectChat = document.createElement ('select');

    /*jshint multistr: true */
    regionSelectChat.innerHTML = regionSelectUsers.innerHTML   = '\
    <select>\
      <option value="all">všechny</option> \
      <option value="Hlavni Mesto Praha" >Hlavni Mesto Praha</option> \
      <option value="Jihomoravsky Kraj" >Jihomoravsky Kraj</option>\
      <option value="Jihocesky Kraj" >Jihocesky Kraj</option>\
      <option value="Vysocina" >Vysocina</option>\
      <option value="Karlovarsky Kraj" >Karlovarsky Kraj</option>\
      <option value="Kralovehradecky Kraj" >Kralovehradecky Kraj</option>\
      <option value="Liberecky Kraj" >Liberecky Kraj</option>\
      <option value="Olomoucky Kraj" >Olomoucky Kraj</option>\
      <option value="Moravskoslezsky Kraj" >Moravskoslezsky Kraj</option>\
      <option value="Pardubicky Kraj" >Pardubicky Kraj</option>\
      <option value="Plzensky Kraj" >Plzensky Kraj</option>\
      <option value="Stredocesky Kraj" >Stredocesky Kraj</option>\
      <option value="Ustecky Kraj" >Ustecky Kraj</option>\
      <option value="Zlinsky Kraj" >Zlinsky Kraj</option>\
    </select>\
    ';

    // User region filter
    if(location.pathname == chat_dir + "/right.php"){
        regionSelectUsers.setAttribute("id", "reSelectUser");
        regionSelectUsers.setAttribute("onchange", "top.setCookie('region_users', this.value);parent.userListRegenerate();");
        var online_talk = document.getElementById("online_talk");
        regionSelectUsers.value = decodeURI(readCookie("region_users", "all"));
        online_talk.parentNode.insertBefore(regionSelectUsers, online_talk);
    }

    // Chat region filter
    if(location.pathname == chat_dir + "/bottom.php"){
        regionSelectChat.setAttribute("id", "reSelectChat");
        regionSelectChat.setAttribute("onchange", "top.setCookie('region_chat', this.value);parent.chat_reset_f(parent.smer)");
        var filter_bar = document.getElementById("p4").parentNode;
        regionSelectChat.value = decodeURI(readCookie("region_chat", "all"));
        filter_bar.appendChild(regionSelectChat);
    }
}

function readCookie(name, def) {
        match = document.cookie.match(new RegExp(name + '=([^;]+)'));
        if (match)
            return match[1];
        else
            return def;
  }


/////////// Fixed user adding
function newUserAddProcess(u)
{
    u.a=u.a | 0;
    u.w=(u.w!=undefined) ? u.w : 0;
    u.w=u.w.toString();
    var pole6a=u.w.substring(0,1);
    var pole6b=u.w.substring(1,2);
    if(u.i==uid)
	my_webcam=pole6a;
    var mymsg;
    var is_watcher=my_webcam>1 ? search_sorted_array(watching_user,u.i) : 0;
    var is_kecalek=u.lasttalk>=(srvTime-kecalekTime);
    var is_pritel=fav.length-1>0 && search_array(fav,u.i);
    var has_webcam=(pole6a>1 && (pole6b!=4 || (fav_reverse.length-1>0 && search_array(fav_reverse,u.i)) || u.i==uid)) ? 2 : 0;
    var canKick = (spravce > (u.a | 0) && uid!=u.i) || (parent.room_spr==uid && u.a==0 && uid!=u.i) ? true : false;
    var html_tmp='<li class="online'+u.p+'" '+(is_watcher ? 'style="list-style-image: url(img/kouka.jpg)"' : '')+'><span '+(my_webcam>1 ? '' : '')+'>'+(has_webcam ? '<a href="#" onclick="return false" onmouseover="parent.show_menu('+u.i+',parent.getY(this),parent.getX(this),\''+u.n+'\',\''+sess+'\',\''+roomid+'\',\''+volume+'\',\''+(pole6a==3 ? 1 : 0)+'\',\''+pole6b+'\')" onmouseout="setTimeout(\'parent.hide_menu()\',500)"><img src="img/'+(pole6a==3 ? "sluchatka" : "webka")+'.gif" width="'+(pole6a==3 ? "16" : "20")+'" height="11" border="0" style="position:relative;top:2px;margin-right:2px;"></a>' : '')+'<a href="/user/'+u.i+'/'+u.n+'" class="online'+u.p+'" onmouseover="parent.showInfo('+u.i+',parent.getY(this)-parent.getScrollXY(window)[1])" onmouseout="parent.hideInfo()" target="_blank" id="nick'+u.i+'">'+u.n+'</a>'+(is_kecalek ? " [<a href='#' title='"+msg52+"' class=\"online"+u.p+"\" onclick='parent.removeLastTalk("+u.i+");return false'>x</a>]" : "")+(septani ? '&nbsp;<a href="#" onclick="parent.chatsm(\''+u.n+'\',\''+u.i+'\');return false" title="'+msg51+'"><img style="position:relative;top:4px;margin-right:1px" src="img/chat_new2.gif" width="14" height="14" border="0"></a>' : '')+(u.c>0 ? '<img style="position:relative;top:1px;" src="img/certifikace.gif" width="16" height="11" border="0" alt="'+msg50+'">' : '')+(u.r>0 ? '<a href="/vip" target="_blank" title="'+msg49+'"><img style="position:relative;top:1px;" src="img/vip_chat.gif" width="16" height="11" border="0"></a>' : '')+(u.g>0 ? '<a href="/user/album/'+u.i+'" target="_blank"><img style="position:relative;top:1px;" src="img/galerie.gif" width="16" height="11" border="0" alt="'+msg48+'"></a>' : '')+(canKick ? '<a href="#" onclick="parent.kick_dialog('+u.i+',\''+u.n+'\')" style="text-decoration:none" title="'+sprintf(msg47,u.n)+'"><img style="position:relative;top:1px;" src="img/odejit.gif" width="16" height="11" border="0"></a>' : '')+'</span>';
    
    var e = right.document.getElementById("reSelectUser");
    var reSelected = "all";
    if(e != undefined)
        reSelected = e.options[e.selectedIndex].value;
    userDeleteProcess(u.i);

    if (is_kecalek) {
        u.list = 1;
        mymsg = msg53;
    }
    else if (is_pritel) {
        u.list = 2;
        if (!search_sorted_array(friends, u.i)) {
            friends.push(u.i);
            friends.sort();
            if (!userRoomEnterFirstRead)
                nKamarad(u.i, u.n, u.p, u.pf);
        }
        mymsg = msg54;
    }
    else if (is_watcher) {
        u.list = 0;
        mymsg = msg57;
    }
    else {
        u.list = 3;
        mymsg = msg56;
    }

    if (right_loaded) {
	    if (kateg[u.p - 1] == 1 && webcam_kateg[has_webcam] == 1 && (u.re==reSelected || reSelected=="all")){
            var node_div = right.document.createElement("UL");
            node_div.id = 'usr' + u.i;
            node_div.className = 'chat__list';
            node_div.innerHTML = html_tmp;
            var el = right.document.getElementById(listName[u.list]);
            if (el!=undefined && el != null) {
                var div_arr = el.getElementsByTagName('UL');
                if (div_arr.length != users_order[u.list].length) {
                    var old = checkAllowed;
                    checkAllowed = 1;
                    checkUserList(u.list);
                    checkAllowed = old;
                    div_arr = el.getElementsByTagName('UL');
                }
                var pos = search_users(u.i) + 1;
                users_order[u.list].splice(pos, 0, [u[order_param], u.i]);
                var div_cnt = div_arr.length;
                if (div_cnt == 0 || div_cnt == pos) {
                    el.appendChild(node_div);
                } else {
                    try {
                        el.insertBefore(node_div, div_arr[pos]);
                    } catch (e) {
                        el.appendChild(node_div);
                    }
                }
                if (animate_users && !userRoomEnterFirstRead)
                    animate('nick' + u.i, animation_color[u.p - 1]);

                el.style.display = 'inline';
                right.document.getElementById('cnt' + u.list).innerHTML = '(' + users_order[u.list].length + ')';
            }
        }
    }
}

//var origUserAddProcess = unsafeWindow.userAddProcess;
userAddProcess = function(u) {
     return newUserAddProcess(u);
     //return origUserAddProcess(u);
};


///////////////// Chat Filter - fix isPrintable
var newIsPrintable = function(type, userId, fromNick, messageObject){
    var e = bottom.document.getElementById("reSelectChat");
    var reSelected = "all";
    if(e != undefined)
        reSelected = e.options[e.selectedIndex].value;

    var skip_text = false;
    if (type=='system' && (syst_mess == 0 || jen_o_me)){
		skip_text = true;
	}
    if (userId!=self.uid && (jen_kamaradi || (type=='system' && syst_mess > 0))) {
        if (!search_array(fav, userId)) {
            skip_text = true;
        }
    }
    if (type=='message'){
    	if (fromNick && search_sorted_array(ignore_user, fromNick.toString().toLowerCase())){
    		return false;
		}
		if (jen_o_me){
            skip_text = true;
            if (messageObject.from_id == self.uid || messageObject.to_id == self.uid){
            	skip_text = false;
			}
			else if (messageObject.text.slice(0, self.user.toString().length+1).toLowerCase() == self.user.toString().toLowerCase()+':'){
    			skip_text = false;
			}
		}
        if(reSelected != "all"){
            if(users[userId].re != reSelected){
                skip_text = true;
            }
            if (messageObject.from_id == uid || messageObject.to_id == uid){
                skip_text = false;
            }
            else if (messageObject.text.slice(0, user.toString().length+1).toLowerCase() == user.toString().toLowerCase()+':'){
                skip_text = false;
            }
        }
	}
    return !skip_text;
};

isPrintable = function(type, userId, fromNick, messageObject) {
    return newIsPrintable(type, userId, fromNick, messageObject);
};

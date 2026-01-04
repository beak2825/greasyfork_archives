// ==UserScript==
// @name         PON Userlist Clan Sort
// @namespace    1
// @version      0.11
// @description  Some chat frame improvements for pathofninja.ru
// @author       http:/pathofninja.ru/info_pl.php?pl=Нет
// @match        *://pathofninja.ru/game/chat.php
// @match        *://www.pathofninja.ru/game/chat.php
// @match        *://148.251.233.231/game/chat.php
// @match        *://178.63.14.254/game/chat.php
// @match        *://pon.fun/game/chat.php
// @match        *://www.pon.fun/game/chat.php
// @icon         http://mrshex.narod.ru/pon/qw.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393118/PON%20Userlist%20Clan%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/393118/PON%20Userlist%20Clan%20Sort.meta.js
// ==/UserScript==

//Кроссбраузерность и всеобезьянность.
var bGreasemonkeyServiceDefined     = false;
try {
    if (typeof Components.interfaces.gmIGreasemonkeyService === "object") {
        bGreasemonkeyServiceDefined = true;
    }
}
catch (err) {
    //Ignore.
}
if ( typeof unsafeWindow === "undefined"  ||  ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
}

//Это отключает подтирание старых сообщений чата (и вызывает тормоза, при его захламлении)
//Раскомментируйте следующие 4 строки, чтобы включить.
//unsafeWindow.chat_msg_old = function()
//{
//	return;
//};

//сортировка с учётом сокланов
unsafeWindow.view_user = function (u_list)
{

	var u_list_str='', pl, nick, clan, land, kage, anbu;
    var list_first='';
    var list_second='';
	var land_a={0:'Шиноби Отступник',1:'Страна Огня (Деревня Скрытого Листа)',2:'Страна Ветра (Деревня Скрытого Песка)',3:'Страна Молнии (Деревня Скрытого Облака)',4:'Страна Земли (Деревня Скрытого Камня)',5:'Страна Воды (Деревня Скрытого Тумана)'};
	var kage_a={1:'Хокаге',2:'Пожизненный Казекаге',3:'Райкаге',4:'Цучикаге',5:'Мизукаге'};
    var clan_sort = top.getLS("Clan_sort", unsafeWindow.org['clan'][0]);

	for(var k in u_list)
  {
 		pl=u_list[k]; clan=''; land=''; kage=''; anbu=''; nick=(pl[0][2]==1)? "<i>"+pl[0][0]+"</i>" : pl[0][0];

		land='<img src="/img/map/land_'+pl[2][0][0]+'.png" title="'+land_a[pl[2][0][0]]+'" style="margin-right: 4px;">';
		if(pl[1][0]!='') clan='<img src="/img/clan/'+pl[1][0]+'.gif" title="Клан «'+pl[1][1]+'»" onclick="set_sort('+pl[1][0]+')" style="margin-right: 4px;">';
		if(pl[2][0][1])  land='<img src="/img/map/kage_'+pl[2][0][0]+'.png" title="'+kage_a[pl[2][0][0]]+' #'+pl[2][0][1]+'" style="margin-right: 4px;">';
		if(pl[2][0][2])  anbu='<img src="/img/map/anbu.gif" title="Сотрудник АНБУ (Помощь и вопросы по игре)" style="margin-right: 4px;">';

   	u_list_str='<tr>'+
			'<td>'+
				'<div data-center><img style="height: 14px; margin-top: 4px; cursor: pointer;" src="/img/privat.svg" onclick="say_prv(\''+pl[0][0]+'\')" title="Написать в приват"></div>'+
			'<td><div data-center>'+
				'&nbsp;&nbsp;&nbsp;'+kage+land+clan+anbu+
					'<div class="user_nick" onclick="say_all(\''+pl[0][0]+'\')"><b>'+nick+'</b></div>'+top.lvl(pl[0][1])+'&nbsp;'+
					'<a href="/info/pl='+pl[0][0]+'" target="_blank"><img style="height: 13px;" src="/img/info2.svg" title="Информация"></a>'+
                    (pl[3][0]!=0? '&nbsp;&nbsp;<small>(<a class="lnk5" href="#" onclick="chat_cell_to_map('+pl[3][0]+','+pl[3][1]+', 0)" ondblclick="chat_cell_to_map('+pl[3][0]+','+pl[3][1]+', 1)">'+pl[3][0]+'-'+pl[3][1]+'</a>)</small>' : '');

		if(pl[2][1]==1) u_list_str+='<img src="/img/medit.svg" title="Медитация" style="height: 13px; margin-left: 3px">';
  	if(pl[2][2]>0)  u_list_str+='<img title="Техника Тишины.<br>Еще '+mk_time2(pl[2][2])+'" src="/img/silence.svg" style="height: 12px; margin-left: 3px">';
		if(pl[2][3]>0)  u_list_str+='<img title="Отпуск на остров Забытых.<br>Еще '+mk_time2(pl[2][3])+'" src="/img/prison.svg" style="height: 14px; margin-left: 3px">';

		u_list_str+='</div>';

      if (pl[1][0]!=clan_sort) list_second+=u_list_str; else list_first+=u_list_str;
  }

	$('#user').html("<table class='user_tbl' style='border-spacing:0px'>"+list_first+list_second+"</table>");
};
unsafeWindow.set_sort = function (param)
    {
        if (param == top.getLS("Clan_sort", unsafeWindow.org['clan'][0]))
            top.setLS('Clan_sort',0)
        else
            top.setLS('Clan_sort',param);
    };

//Здесь убирается мусор в чат при лечении и пр.
unsafeWindow.say_chat = function (e)
{
 	var html=$(e.target).html();
	var id=$(e.target).attr('id');
    var $dn=$('[data-nick="1"]:visible', top.frames['game'].document);

  		 if(id=="ch_nick") { say_all(html); }
	else if(id=="ch_nick_prv") { say_prv(html); }
	else if(id=="ch_nick_team") { say_all(html); if($dn[0]===undefined) say_org(2); }
	else if(id=="ch_nick_org") { say_all(html); if($dn[0]===undefined) say_org(3); }
	else if(id=="ch_nick_union") { say_all(html); if($dn[0]===undefined) say_org(4); }
	else if(id=="ch_nick_work") { say_all(html); if($dn[0]===undefined) say_org(5); }
	else if(id=="ch_nick_help") { say_all(html); if($dn[0]===undefined) say_org(6); }
	else if(id=="ch_nick_combat") { say_all(html); if($dn[0]===undefined) say_org(11); }
	else chat_msg_menu_close();
};
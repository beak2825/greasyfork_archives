// ==UserScript==
// @name        NorbiKJ
// @namespace   NorbiKJ
// @description Fasza kis kalkulátor :D
// @include     https://hu17.the-west.hu/game.php#
// @include     https://hu*.the-west.hu/game.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23572/NorbiKJ.user.js
// @updateURL https://update.greasyfork.org/scripts/23572/NorbiKJ.meta.js
// ==/UserScript==

var iDiv = document.createElement('div');
iDiv.id = 'ui_enyem';
iDiv.className = 'ui_menucontainer';
var innerDiv = document.createElement('div');
innerDiv.className = 'menulink hasMousePopup';
innerDiv.onclick=function () 
{
var tomb=['build','punch','tough','endurance','health','ride','reflex','dodge','hide','swim','aim','shot','pitfall','finger_dexterity','repair','leadership','tactic','trade','animal','appearance'];
var tbl = $('<table border="0" cellpadding="0" cellspacing="0" id="myTable" style="border-spacing: 20px;">');
for(var i=0;i<4;i++)
{
	var tr= $('<tr style="height: 50px;">)');
	for(var g=0;g<5;g++)
	{
		var td1 = $('<td style="font-size:30px;vertical-align:middle; width:85px;text-align:center;background-repeat:no-repeat"></td>').attr('id',tomb[i*5+g]).css('background-image', 'url(https://westhus.innogamescdn.com/images/window/skills/skillicon_' + tomb[i*5+g] + '.png)').bind('contextmenu', function(ev){ev.preventDefault();this.innerHTML--;}).bind('click',function(){this.innerHTML++;});
		tr.append(td1);
		tbl.append(tr);
	}
}
var tr2= $('<tr style="height: 50px;">)');
var td2=$('<td style="vertical-align: middle;"></td>');
td2.append(new west.gui.Button('Munkaruha').click(ButtonClicked).getMainDiv());
tr2.append(td2);
tbl.append(tr2);
var ablak=wman.open("foAblak",null,"noreload").setTitle("NorbiKJ").setMiniTitle("NorbiKJ");		 
ablak.appendToContentPane(tbl);	

function ButtonClicked()
{
	var skill=[];
	var id=[];
	var g=0;
	var table = document.getElementById("myTable");
	for (var i = 0, row; row = table.rows[i]; i++) 
	{
		for (var j = 0, col; col = row.cells[j]; j++) 
		{
			if(col.innerHTML!=""&&col.innerHTML!="0")
			{
				id[g]=col.id;
				skill[g]=col.innerHTML;
				g++;
			}
		}
	}
var cb = function () {
		Bag.searchBest({[id[0]]:skill[0],[id[1]]:skill[1],[id[2]]:skill[2],[id[3]]:skill[3],[id[4]]:skill[4],[id[5]]:skill[5],[id[6]]:skill[6]}, {id:72});
		return EventHandler.ONE_TIME_EVENT;
		}.bind(this);
	if (wman.getById(Inventory.uid)) {
		cb();
		if (!wman.getById(Wear.uid)) Wear.open();
	} 
	else {
		EventHandler.listen('inventory_ready', cb);
		Wear.open();
	}	
}
};
iDiv.appendChild(innerDiv);
document.getElementById('ui_menubar').appendChild(iDiv);
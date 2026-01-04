// ==UserScript==
// @name       HV 论坛用装备汉化
// @icon      http://e-hentai.org/favicon.ico
// @match     *://*.forums.e-hentai.org/*
// @match     *://*.hentaiverse.org/*
// @match     *://*forums.e-hentai.org/index.php/*
// @exclude   *://*.hentaiverse.org/?s=Forge&ss=re*
// @exclude   *://*.hentaiverse.org/?s=Forge&ss=up*
// @exclude   *://*.hentaiverse.org/?s=Forge&ss=fo*
// @exclude   *://forums.e-hentai.org/index.php?act*
// @exclude   *://*hentaiverse.org/?s=Character&ss=it
// @author    ggxxsol(ggxxhy);mbbdzz;hc br
// @description zh-tw
// @version   2017.09.07
// @namespace https://greasyfork.org/users/965243
// @downloadURL https://update.greasyfork.org/scripts/460199/HV%20%E8%AE%BA%E5%9D%9B%E7%94%A8%E8%A3%85%E5%A4%87%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460199/HV%20%E8%AE%BA%E5%9D%9B%E7%94%A8%E8%A3%85%E5%A4%87%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

if (document.location.href.match(/ss=iw/)&&!document.getElementById('item_pane'))return
var hanhua=true;
closeH=0
var mhtml = document.body.innerHTML;
var html = document.body.innerHTML;
mainhh();
var xuanfu = document.createElement('div');

function mainhh(){
	if (document.location.href.match("https://hentaiverse.org/equip/")){
		var torep = new Array();
		var repby = new Array();
		html=eqmthh(document.body)
		document.body.innerHTML= html;
		return
	}
	var lklist = new Array();
lklist = lklist.concat('Character&ss=in')   //背包0
lklist = lklist.concat('Bazaar&ss=is')      //道具店1
lklist = lklist.concat('Character&ss=eq')  //装备2
lklist = lklist.concat('Bazaar&ss=es')    //装备店3
lklist = lklist.concat('Bazaar&ss=ss')    //祭坛4
lklist = lklist.concat('Character&ss=it') //战斗道具5
lklist = lklist.concat('ss=iw') //iw汉化6
lklist = lklist.concat('forums') //论坛汉化7
lklist = lklist.concat('Bazaar&ss=lt')    //武器彩卷8
lklist = lklist.concat('Bazaar&ss=la')    //武器彩卷9
lklist = lklist.concat('Forge&ss=up&*') //强化10
lklist = lklist.concat('Forge&ss=en&*') //附魔11
lklist = lklist.concat('Forge') //锻造12
	for(i=0;i<lklist.length;i++){
		if(document.location.href.match(lklist[i])){
			temp=i;
			break;
		}
	}
	switch (temp){
		case 0:  //背包0
		var torep = new Array();
		var repby = new Array();
		try{
		itemdiv=document.querySelector("#inv_equip.cspp");
		equipdiv=document.querySelector("#inv_eqstor.cspp");
		equipdiv=eqmthh(equipdiv)
		itemdiv=eqmthh(itemdiv)
		document.querySelector("#inv_equip.cspp").innerHTML = itemdiv;
		document.querySelector("#inv_eqstor.cspp").innerHTML = equipdiv;
		}
		catch(e){}
		break;

		case 1: //道具店1
        var torep = new Array();
		var repby = new Array();
		itemdiv=document.querySelector("#mainpane").innerHTML;
		item()
		itemdiv=yhanhua(torep,repby,itemdiv)
		document.querySelector("#mainpane").innerHTML = itemdiv;
		break;

		case 2: //装备2
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.querySelector("#eqsb");
		equipdiv=eqmthh(equipdiv)
		document.querySelector("#eqsb").innerHTML = equipdiv;
		break;

		case 3: //装备店3
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.querySelectorAll(".equiplist");
		temp=eqmthh(equipdiv[0])
		equipdiv[0].innerHTML=temp
		temp=eqmthh(equipdiv[1])
		equipdiv[1].innerHTML=temp
		var equhide = document.createElement('a');
		equhide.style.cssText = "font-size:15px;color:red; position:absolute;top:660px; left:2px  ;text-align:left";
		try{

		if(!localStorage.hideflag){localStorage.hideflag=="隐藏锁定装备"}
		if(localStorage.hideflag=="显示锁定装备"){
		}
		else{
			equipdiv=document.querySelectorAll(".il")
			for(i = 0 ;i <equipdiv.length;i++) {
				equipdiv[i].parentNode.style.cssText = "display:none;"
			}
		}

			equhide.innerHTML="当前"+localStorage.hideflag
		}
		catch(e){alert(e)}
			equhide.onclick=function(){

			equipdiv=document.querySelectorAll(".il")
			if(localStorage.hideflag=="隐藏锁定装备"){
			localStorage.hideflag="显示锁定装备"
			for(i = 0 ;i <equipdiv.length;i++) {
				equipdiv[i].parentNode.style.cssText = "display:block;"
			}

			}
			else{
				localStorage.hideflag="隐藏锁定装备"
				for(i = 0 ;i <equipdiv.length;i++) {
					equipdiv[i].parentNode.style.cssText = "display:none;"
				}
			}
			this.innerHTML="当前"+localStorage.hideflag
		}

		document.body.appendChild(equhide);

		break;

		case 4: // 祭坛4
		var torep = new Array();
		var repby = new Array();
		itemdiv=document.querySelector("#mainpane").innerHTML;
		item()
		itemdiv=yhanhua(torep,repby,itemdiv)
		document.querySelector("#mainpane").innerHTML = itemdiv;
		break;

		case 5: //战斗道具5
		var torep = new Array();
		var repby = new Array();
		itemdiv=document.querySelector("#mainpane").innerHTML;
		item()
		itemdiv=yhanhua(torep,repby,itemdiv)
		document.querySelector("#mainpane").innerHTML = itemdiv;
		break;

		case 6: //iw
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.querySelector("#item_pane");
		equipdiv=eqmthh(equipdiv)
		document.querySelector("#item_pane").innerHTML = equipdiv;
		break;
		case 7: //论坛
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.getElementsByClassName('postcolor');
		for (var ii=0; ii<equipdiv.length ; ii++ ){

			tempequipment=equipdiv[ii]
			//tempequipment.innerHTML=tempequipment.innerHTML.replace(/<span [^>]+>[^>]+>/g,"")
			tempequipment.innerHTML=tempequipment.innerHTML.replace(/<!--[/]?color[^>]+>/g,"")
			tempequipment.innerHTML=tempequipment.innerHTML.replace(/<[/]*b>/g,"")
			tempequipment=eqmthh(tempequipment)
			//item()
			//tempequipment=yhanhua(torep,repby,tempequipment);
			document.getElementsByClassName('postcolor')[ii].innerHTML = tempequipment;
		}
		break;
		case 8: //武器彩卷
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.querySelector("#leftpane");
		equipdiv=eqmthh(equipdiv)
		document.querySelector("#leftpane").innerHTML = equipdiv;
		break;
		case 9: //防具彩卷
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.querySelector("#leftpane");
		equipdiv=eqmthh(equipdiv)
		document.querySelector("#leftpane").innerHTML = equipdiv;
		break;
		case 10: //强化
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.querySelector("#leftpane");
		equipdiv=eqmthh(equipdiv)
		document.querySelector("#leftpane").innerHTML = equipdiv;
		break;
		case 11: //附魔
		var torep = new Array();
		var repby = new Array();
		equipdiv=document.querySelector("#leftpane");
		equipdiv=eqmthh(equipdiv)
		document.querySelector("#leftpane").innerHTML = equipdiv;
		break;
		case 12: //锻造
		var torep = new Array();
		var repby = new Array();
		if(equipdiv= document.getElementById("upgrade_button"))equipdiv.style.cssText ="position:relative; top:20px; ";
		equipdiv=document.querySelector("#item_pane");
		equipdiv=eqmthh(equipdiv)
		document.querySelector("#item_pane").innerHTML = equipdiv;
		break;
        default:
	}


	function yhanhua(torep,repby,temp){    //源语句，汉化后语句，汉化变量
		for (var i=0; i<torep.length; i++){
			var regex = new RegExp(torep[i],'g');
			temp = temp.replace(regex, repby[i]);
		}
		return temp
	}
	function item(){

//药水
/*
torep = torep.concat('Health Draught')
repby = repby.concat('体力药水')
torep = torep.concat('Health Potion')
repby = repby.concat('体力药剂')
torep = torep.concat('Health Elixir')
repby = repby.concat('体力万能药')
torep = torep.concat('Mana Draught')
repby = repby.concat('魔力药水')
torep = torep.concat('Mana Potion')
repby = repby.concat('魔力药剂')
torep = torep.concat('Mana Elixir')
repby = repby.concat('魔力万能药')
torep = torep.concat('Spirit Draught')
repby = repby.concat('灵力药水')
torep = torep.concat('Spirit Potion')
repby = repby.concat('灵力药剂')
torep = torep.concat('Spirit Elixir')
repby = repby.concat('灵力万能药')
torep = torep.concat('Energy Drink')
repby = repby.concat('能量饮料')
torep = torep.concat('Last Elixir')
repby = repby.concat('终极万能药')
*/
torep = torep.concat('Infusion of Darkness')
repby = repby.concat('暗属性魔药')
torep = torep.concat('Infusion of Divinity')
repby = repby.concat('圣属性魔药')
torep = torep.concat('Infusion of Storms')
repby = repby.concat('风属性魔药')
torep = torep.concat('Infusion of Lightning')
repby = repby.concat('雷属性魔药')
torep = torep.concat('Infusion of Frost')
repby = repby.concat('冰属性魔药')
torep = torep.concat('Infusion of Flames')
repby = repby.concat('火属性魔药')
torep = torep.concat('Scroll of Swiftness')
repby = repby.concat('迅捷卷轴')
torep = torep.concat('Scroll of the Avatar')
repby = repby.concat('化身卷轴')
torep = torep.concat('Scroll of Shadows')
repby = repby.concat('幻影卷轴')
torep = torep.concat('Scroll of Absorption')
repby = repby.concat('吸收卷轴')
torep = torep.concat('Scroll of Life')
repby = repby.concat('生命卷轴')
torep = torep.concat('Scroll of Protection')
repby = repby.concat('防护卷轴')
torep = torep.concat('Scroll of the Gods')
repby = repby.concat('神之卷轴')
torep = torep.concat('Bubble-Gum')
repby = repby.concat('泡泡糖')
torep = torep.concat('Flower Vase')
repby = repby.concat('花瓶')
//道具翻译
/*
torep = torep.concat('Crystallized Phazon')
repby = repby.concat('相位素材(布)')
torep = torep.concat('Shade Fragment')
repby = repby.concat('暗影素材(轻)')
torep = torep.concat('Repurposed Actuator')
repby = repby.concat('动力素材(重)')
torep = torep.concat('Defense Matrix Modulator')
repby = repby.concat('力场素材(盾)')
torep = torep.concat('Soul Fragment')
repby = repby.concat('灵魂断片')
torep = torep.concat('Featherweight Shard')
repby = repby.concat('羽毛碎片(装备)')
torep = torep.concat('Voidseeker Shard')
repby = repby.concat('虚空碎片(武器)')
torep = torep.concat('Aether Shard')
repby = repby.concat('以太碎片(魔法)')
torep = torep.concat('Amnesia Shard')
repby = repby.concat('失忆碎片(锻造)')
*/
//道具说明
torep = torep.concat('Provides a long-lasting health restoration effect.')
repby = repby.concat('持续50回合恢复2%基础体力值。')
torep = torep.concat('Instantly restores a large amount of health.')
repby = repby.concat('使用当下恢复100%基础体力值。')
torep = torep.concat('Fully restores health, and grants a long-lasting health restoration effect.')
repby = repby.concat('使用当下体力值全满并持续100回合恢复2%基础体力值。')
torep = torep.concat('Provides a long-lasting mana restoration effect.')
repby = repby.concat('持续50回合恢复1%基础魔力值。')
torep = torep.concat('Instantly restores a moderate amount of mana.')
repby = repby.concat('使用当下恢复50%基础魔力值。')
torep = torep.concat('Fully restores mana, and grants a long-lasting mana restoration effect.')
repby = repby.concat('使用当下魔力值全满并持续100回合恢复1%基础魔力值。')
torep = torep.concat('Provides a long-lasting spirit restoration effect.')
repby = repby.concat('持续50回合恢复1%基础灵力值。')
torep = torep.concat('Instantly restores a moderate amount of spirit.')
repby = repby.concat('使用当下恢复50%基础灵力值。')
torep = torep.concat('Fully restores spirit, and grants a long-lasting spirit restoration effect.')
repby = repby.concat('使用当下灵力值全满并持续100回合恢复1%基础灵力值。')
torep = torep.concat('Restores 10 points of Stamina, up to the maximum of 99.')
repby = repby.concat('恢复10点精力，但不超过99。')
torep = torep.concat(' When used in battle, also boosts Overcharge and Spirit by 10% for ten turns.')
repby = repby.concat('当在战斗中使用，同时回复怒气值和灵力值10%持续十回合。')
torep = torep.concat('Fully restores all vitals, and grants long-lasting restoration effects.')
repby = repby.concat('状态全满并持续100回合恢复基础体力2%.魔力1%.灵力1%。')
torep = torep.concat('You gain ')
repby = repby.concat('你获得')
torep = torep.concat(' resistance to Fire elemental attacks and do 25% more damage with Fire magicks.')
repby = repby.concat('的火焰抗性且火焰魔法伤害增加25%。')
torep = torep.concat(' resistance to Cold elemental attacks and do 25% more damage with Cold magicks.')
repby = repby.concat('的冰霜抗性且冰霜魔法伤害增加25%。')
torep = torep.concat(' resistance to Elec elemental attacks and do 25% more damage with Elec magicks.')
repby = repby.concat('的闪电抗性且闪电魔法伤害增加25%。')
torep = torep.concat(' resistance to Wind elemental attacks and do 25% more damage with Wind magicks.')
repby = repby.concat('的狂风抗性且狂风魔法伤害增加25%。')
torep = torep.concat(' resistance to Holy elemental attacks and do 25% more damage with Holy magicks.')
repby = repby.concat('的神圣抗性且神圣魔法伤害增加25%。')
torep = torep.concat(' resistance to Dark elemental attacks and do 25% more damage with Dark magicks.')
repby = repby.concat('的黑暗抗性且黑暗魔法伤害增加25%。')

torep = torep.concat('Grants the Haste effect.')
repby = repby.concat('使用产生100回合加速效果(增加行动速度60%)。')
torep = torep.concat('Grants the Protection effect.')
repby = repby.concat('使用产生100回合保护效果(吸收50%伤害值)。')
torep = torep.concat('Grants the Haste and Protection effects.')
repby = repby.concat('产生加速和保护的效果。')
torep = torep.concat('with twice the normal duration.')
repby = repby.concat('(200回合)')
torep = torep.concat('Grants the Absorb effect.')
repby = repby.concat('使用后获得吸收效果(吸收机率为100%)。')
torep = torep.concat('Grants the Shadow Veil effect.')
repby = repby.concat('使用产生100回合闪避效果(增加回避率30%)。')
torep = torep.concat('Grants the Spark of Life effect.')
repby = repby.concat('使用产生100回生命火花效果(触发消耗25%基础灵力值残血50%)。')
torep = torep.concat('Grants the Absorb, Shadow Veil and Spark of Life effects.')
repby = repby.concat('同时产生吸收，闪避，以及生命花火效果。')
torep = torep.concat('There are three flowers in a vase. The third flower is green.')
repby = repby.concat('物理/魔法的伤害.命中.暴击率提升，回避/抵抗率提升。(+25%伤害持续50回合)')
torep = torep.concat('It is time to kick ass and chew bubble-gum... and here is some gum.')
repby = repby.concat('物理/魔法伤害大幅提升，必定命中且必定暴击。同时每回合补充基础体力.魔力值的20%。(+100%伤害持续50回合)')

//物品说明
torep = torep.concat('Various bits and pieces of scrap cloth. These can be used to mend the condition of an equipment piece.')
repby = repby.concat('各种零碎的布料，用于修复装备')
torep = torep.concat('Various bits and pieces of scrap leather. These can be used to mend the condition of an equipment piece.')
repby = repby.concat('各种零碎的皮革，用于修复装备')
torep = torep.concat('Various bits and pieces of scrap metal. These can be used to mend the condition of an equipment piece.')
repby = repby.concat('各种零碎的金属，用于修复装备')
torep = torep.concat('Various bits and pieces of scrap wood. These can be used to mend the condition of an equipment piece.')
repby = repby.concat('各种零碎的木材，用于修复装备')
torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade cloth armor.')
repby = repby.concat('一些从怪物身上收集到的材料，用于升级布甲')
torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade staffs and shields.')
repby = repby.concat('一些从怪物身上收集到的材料，用于升级法杖和盾牌')
torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade heavy armor and weapons')
repby = repby.concat('一些从怪物身上收集到的材料，用于升级重甲和武器')
torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to reforge and upgrade light armor')
repby = repby.concat('一些从怪物身上收集到的材料，用于升级轻甲')
torep = torep.concat('A cylindrical object filled to the brim with arcano-technological energy. Required to restore advanced armor and shields to full condition.')
repby = repby.concat('一个边缘充斥着神秘科技能量的圆柱形物体，用于修复高级护甲和盾牌')
torep = torep.concat('Some materials scavenged from fallen adventurers by a monster. Required to upgrade equipment bonuses to')
repby = repby.concat('从怪物身上收集的材料，用于升级装备的')
torep = torep.concat('A small vial filled with a catalytic substance necessary for upgrading and repairing equipment in the forge. This is permanently consumed on use.')
repby = repby.concat('一个装着升级与修复装备必须的催化剂的小瓶子，每使用一次就会消耗一个')
torep = torep.concat('When used with a weapon, this shard will temporarily imbue it with the')
repby = repby.concat('当用在一件武器上时，会临时给予')
torep = torep.concat('When used with an equipment piece, this shard will temporarily imbue it with the')
repby = repby.concat('当用在一件装备上时，会临时给予')
torep = torep.concat('Can be used to reset the unlocked potencies and experience of an equipment piece.')
repby = repby.concat('可以用于重置装备的潜能等级')
torep = torep.concat('Suffused Aether enchantment')
repby = repby.concat('弥漫的以太的附魔效果')
torep = torep.concat('Featherweight Charm enchantment')
repby = repby.concat('轻如鸿毛的附魔效果')
torep = torep.concat('Voidseeker')
repby = repby.concat('虚空探索者')
torep = torep.concat('s Blessing enchantment')
repby = repby.concat('的祝福的附魔效果')
torep = torep.concat('These fragments can be used in the forge to permanently soulfuse an equipment piece to you, which will make it level as you do.')
repby = repby.concat('这个碎片可以将一件装备与你灵魂绑定，灵魂绑定的装备会随着你的等级一同成长。')
torep = torep.concat('You can fuse this crystal with a monster in the monster tab to increase its')
repby = repby.concat('你可以用这种水晶在怪物实验室里面为一个怪物提升它的')

torep = torep.concat('Fire Resistance')
repby = repby.concat('火属性抗性')
torep = torep.concat('Cold Resistance')
repby = repby.concat('冰属性抗性')
torep = torep.concat('Electrical Resistance')
repby = repby.concat('电属性抗性')
torep = torep.concat('Wind Resistance')
repby = repby.concat('风属性抗性')
torep = torep.concat('Holy Resistance')
repby = repby.concat('圣属性抗性')
torep = torep.concat('Dark Resistance')
repby = repby.concat('暗属性抗性')

torep = torep.concat('Non-discerning monsters like to munch on this chow.')
repby = repby.concat('不挑食的初级怪物喜欢吃这种食物')
torep = torep.concat('Mid-level monsters like to feed on something slightly more palatable, like these scrumptious edibles.')
repby = repby.concat('中级怪物喜欢吃更好吃的食物，比如这种')
torep = torep.concat('High-level monsters would very much prefer this highly refined level of dining if you wish to parlay their favor.')
repby = repby.concat('如果你想受高等级怪物的青睐的话，请喂牠们吃这种精炼的食物吧')
torep = torep.concat('Tiny pills filled with delicious artificial happiness. Use on monsters to restore morale if you cannot keep them happy. It beats leaving them sad and miserable.')
repby = repby.concat('美味的人造药丸，满溢着的幸福，没法让怪物开心的话，就用它来恢复怪物的士气，赶走怪物的悲伤和沮丧吧')
torep = torep.concat('An advanced technological artifact from an ancient and long-lost civilization. Handing these in at the Shrine of Snowflake will grant you a reward.')
repby = repby.concat('一个发达古文明的技术结晶，把它交给雪花神殿的雪花女神来获得你的奖励')
torep = torep.concat('You can exchange this token for the chance to face a legendary monster by itself in the Ring of Blood.')
repby = repby.concat('你可以用这些令牌在浴血擂台里面换取与传奇怪物对阵的机会')
torep = torep.concat('You can use this token to unlock monster slots in the Monster Lab, as well as to upgrade your monsters.')
repby = repby.concat('你可以用这些令牌开启额外的怪物实验室槽位，也可以升级你的怪物')
torep = torep.concat('A sapling from Yggdrasil, the World Tree')
repby = repby.concat('一棵来自世界树的树苗')
torep = torep.concat('A plain black 100% cotton T-Shirt. On the front, an inscription in white letters reads')
repby = repby.concat('一件平凡无奇的100%纯棉T恤衫，在前面用白色的字母写着')
torep = torep.concat('I defeated Real Life, and all I got was this lousy T-Shirt.')
repby = repby.concat('战胜了现实后，我就得到了这么一件恶心的T恤衫')
torep = torep.concat('No longer will MBP spread havoc, destruction, and melted polar ice caps.')
repby = repby.concat('不会再有人熊猪扩散浩劫、破坏、和融化的极地冰帽了。')
torep = torep.concat('You found this item in the lair of a White Bunneh. It appears to be a dud.')
repby = repby.concat('这似乎是你在一只杀人兔的巢穴里发现的一颗未爆弹。')
torep = torep.concat('A Lilac flower given to you by a Mithra when you defeated her. Apparently, this type was her favorite.')
repby = repby.concat('击败小猫女后她送你的紫丁香。很显然这品种是她的最爱。')
torep = torep.concat('Taken from the destroyed remains of a Dalek shell.')
repby = repby.concat('从戴立克的残骸里取出来的音箱。')
torep = torep.concat('Given to you by Konata when you defeated her. It smells of Timotei.')
repby = repby.concat('击败泉此方后获得的蓝发。闻起来有 Timotei 洗发精的味道')
torep = torep.concat('Given to you by Mikuru when you defeated her. If you wear it, keep it to yourself.')
repby = repby.concat('击败朝比奈实玖瑠后获得的兔女郎装。不要告诉别人你有穿过。')
torep = torep.concat('Given to you by Ryouko when you defeated her. You decided to name it Achakura, for no particular reason.')
repby = repby.concat('击败朝仓凉子后获得的人形。你决定取名叫朝仓，这没什么特别的理由。')
torep = torep.concat('Given to you by Yuki when you defeated her. She looked better without them anyway.')
repby = repby.concat('击败长门有希后获得的眼镜。她不戴眼镜时看起来好多了。')
torep = torep.concat('An Invisible Pink')
repby = repby.concat('从隐形粉红独角兽头上取下来的')
torep = torep.concat('taken from the Invisible Pink Unicorn.')
repby = repby.concat('一只角')
torep = torep.concat('It doesn')
repby = repby.concat('它')
torep = torep.concat('t weigh anything and has the consistency of air, but you')
repby = repby.concat('很像空气一样轻，几乎没有重量')
torep = torep.concat('re quite sure it')
repby = repby.concat('但是你很确定它是真实存在的')
torep = torep.concat('A nutritious pasta-based appendage from the Flying Spaghetti Monster.')
repby = repby.concat('一条用飞行意大利面怪物身上的面团做成的营养附肢。')
torep = torep.concat('You found these in your Xmas stocking when you woke up. Maybe Snowflake will give you something for them.')
repby = repby.concat('你醒来时,在你的圣诞袜里发现这些东西。说不定用它可以和雪花女神交换礼物。')
torep = torep.concat('This box is said to contain an item of immense power. You should get Snowflake to open it.')
repby = repby.concat('传说此盒子封印了一件拥有巨大力量的装备。你应该找雪花女神去打开它。')

torep = torep.concat('A 1/10th scale figurine of Twilight Sparkle, the cutest, smartest, all-around best pony. According to Pinkie Pie, anyway.')
repby = repby.concat('NO.1 暮光闪闪的 1/10 比例缩放公仔。最可爱、最聪明，最全能的小马。(根据萍琪的说法，嗯…) ')
torep = torep.concat('A 1/10th scale figurine of Rainbow Dash, flier extraordinaire. Owning this will make you about 20% cooler, but it probably took more than 10 seconds to get one.')
repby = repby.concat('NO.2 云宝黛西的 1/10 比例缩放公仔。杰出的飞行员。拥有这个公仔可以让你多酷大约 20%，但为了得到她你得多花 10 秒！ ')
torep = torep.concat('A 1/10th scale figurine of Applejack, the loyalest of friends and most dependable of ponies. Equestria&amp;#039;s best applebucker, and founder of Appleholics Anonymous.')
repby = repby.concat('NO.3 苹果杰克的 1/10 比例缩放公仔。最忠诚的朋友，最可靠的小马。阿奎斯陲亚最好的苹果采收员，同时也是苹果农庄的创始马。 ')
torep = torep.concat('A 1/10th scale figurine of Fluttershy, resident animal caretaker. You&amp;#039;re going to love her. Likes baby dragons; Hates grown up could-eat-a-pony-in-one-bite dragons.')
repby = repby.concat('NO.4 小蝶的 1/10 比例缩放公仔。小马镇动物的褓姆，大家都喜爱她。喜欢幼龙；讨厌能一口吞掉小马的大龙。 ')
torep = torep.concat('A 1/10th scale figurine of Pinkie Pie, a celebrated connoisseur of cupcakes and confectioneries. She just wants to keep smiling forever.')
repby = repby.concat('NO.5 萍琪的 1/10 比例缩放公仔。一位着名的杯子蛋糕与各式饼干糖果的行家。她只想让大家永远保持笑容。 ')
torep = torep.concat('A 1/10th scale figurine of Rarity, the mistress of fashion and elegance. Even though she&amp;#039;s prim and proper, she could make it in a pillow fight.')
repby = repby.concat('NO.6 瑞瑞的 1/10 比例缩放公仔。时尚与品味的的女主宰。她总是能在枕头大战中保持拘谨矜持。 ')
torep = torep.concat('A 1/10th scale figurine of The Great and Powerful Trixie. After losing her wagon, she now secretly lives in the Ponyville library with her girlfriend, Twilight Sparkle.')
repby = repby.concat('NO.7 崔克茜的 1/10 比例缩放公仔。伟大的、法力无边的崔克茜。失去她的篷车后，她现在偷偷的与她的女友暮光闪闪住在小马镇的图书馆中。 ')
torep = torep.concat('A 1/10th scale figurine of Princess Celestia, co-supreme ruler of Equestria. Bored of the daily squabble of the Royal Court, she has recently taken up sock swapping.')
repby = repby.concat('NO.8 塞拉斯提娅公主的 1/10 比例缩放公仔。阿奎斯陲亚大陆的最高统治者。对每日的皇家争吵感到无聊，她近日开始穿上不成对的袜子。 ')
torep = torep.concat('A 1/10th scale figurine of Princess Luna, aka Nightmare Moon. After escaping her 1000 year banishment to the moon, she was grounded for stealing Celestia&amp;#039;s socks.')
repby = repby.concat('NO.9 露娜公主的 1/10 比例缩放公仔。又名梦靥之月。在结束了一千年的放逐后，她从月球回到阿奎斯陲亚偷走了塞拉斯提娅的袜子。 ')
torep = torep.concat('A 1/10th scale figurine of Apple Bloom, Applejack&amp;#039;s little sister. Comes complete with a &amp;quot;Draw Your Own Cutie Mark&amp;quot; colored pencil and permanent tattoo applicator set.')
repby = repby.concat('NO.10 小萍花的 1/10 比例缩放公仔。苹果杰克的小妹。使用了“画出妳自己的可爱标志”彩色铅笔与永久纹身组后，生命更加的完整了。 ')
torep = torep.concat('A 1/10th scale figurine of Scootaloo. Die-hard Dashie fanfilly, best pony of the Cutie Mark Crusaders, and inventor of the Wingboner Propulsion Drive. 1/64th chicken.')
repby = repby.concat('NO.11 飞板露的 1/10 比例缩放公仔。云宝黛西的铁杆年轻迷妹，可爱标志十字军中最棒的小马，以及蠢翅动力推进系统的发明者。有 1/64 的组成成分是鲁莽。 ')
torep = torep.concat('A 1/10th scale figurine of Sweetie Belle, Rarity&amp;#039;s little sister. Comes complete with evening gown and cocktail dress accessories made of 100% Dumb Fabric.')
repby = repby.concat('NO.12 甜贝儿的 1/10 比例缩放公仔。瑞瑞的小妹。在穿上 100% 蠢布料制成的晚礼服与宴会短裙后更加完美了。 ')
torep = torep.concat('A 1/10th scale figurine of Big Macintosh, Applejack&amp;#039;s older brother. Famed applebucker and draft pony, and an expert in applied mathematics.')
repby = repby.concat('NO.13 大麦克的 1/10 比例缩放公仔。苹果杰克的大哥。有名的苹果采收员和大力马，同时也是实用数学的专家。 ')
torep = torep.concat('A 1/10th scale figurine of Spitfire, team leader of the Wonderbolts. Dashie&amp;#039;s idol and occasional shipping partner. Doesn&amp;#039;t actually spit fire.')
repby = repby.concat('NO.14 爆火的 1/10 比例缩放公仔。惊奇闪电的领导者。云宝黛西的偶像和临时飞行搭档。实际上不会吐火。 ')
torep = torep.concat('A 1/10th scale figurine of Derpy Hooves, Ponyville&amp;#039;s leading mailmare. Outspoken proponent of economic stimulus through excessive muffin consumption.')
repby = repby.concat('NO.15 小呆的 1/10 比例缩放公仔。小马镇上重要的邮差马。直言不讳的主张以大量食用马芬的方式来刺激经济。 ')
torep = torep.concat('A 1/10th scale figurine of Lyra Heartstrings. Features twenty-six points of articulation, replaceable pegasus hoofs, and a detachable unicorn horn.')
repby = repby.concat('NO.16 天琴心弦的 1/10 比例缩放公仔。拥有 26 个可动关节，可更换的飞马蹄与一个可拆卸的独角兽角是其特色。 ')
torep = torep.concat('A 1/10th scale figurine of Octavia. Famous cello musician; believed to have created the Octatonic scale, the Octahedron, and the Octopus.')
repby = repby.concat('NO.17 奥塔维亚的 1/10 比例缩放公仔。着名的大提琴家；据信创造了八度空间、八面体以及章鱼。 ')
torep = torep.concat('A 1/10th scale figurine of Zecora, a mysterious zebra from a distant land. She&amp;#039;ll never hesitate to mix her brews or lend you a hand. Err, hoof.')
repby = repby.concat('NO.18 泽科拉的 1/10 比例缩放公仔。一位来自远方的神秘斑马。她会毫不迟疑的搅拌她的魔药或助你一臂之力。呃，我是说一蹄之力… ')
torep = torep.concat('A 1/10th scale figurine of Cheerilee, Ponyville&amp;#039;s most beloved educational institution. Your teachers will never be as cool as Cheerilee.')
repby = repby.concat('NO.19 车厘子的 1/10 比例缩放公仔。小马镇最有爱心的教育家。你的老师绝对不会像车厘子这么酷的！ ')
torep = torep.concat('A 1/10th scale bobblehead figurine of Vinyl Scratch, the original DJ P0n-3. Octavia&amp;#039;s musical rival and wub wub wub interest.')
repby = repby.concat('NO.20 维尼尔的 1/10 比例缩放摇头公仔。是 DJ P0n-3 的本名。为奥塔维亚在音乐上的对手，喜欢重低音喇叭。 ')
torep = torep.concat('A 1/10th scale figurine of Daring Do, the thrill-seeking, action-taking mare starring numerous best-selling books. Dashie&amp;#039;s recolor and favorite literary character.')
repby = repby.concat('NO.21 天马无畏的 1/10 比例缩放公仔。追寻刺激，有如动作片主角一般的小马，为一系列畅销小说的主角。是云宝黛西最喜欢的角色，也是带领她进入阅读世界的原因。 ')
torep = torep.concat('A 1/10th scale figurine of Doctor Whooves. Not a medical doctor. Once got into a hoof fight with Applejack over a derogatory remark about apples.')
repby = repby.concat('NO.22 神秘博士的 1/10 比例缩放公仔。不是医生。曾经与苹果杰克陷入一场因贬低苹果的不当发言而产生的蹄斗。 ')
torep = torep.concat('A 1/10th scale figurine of Berry Punch. Overly protective parent pony and Ponyville&amp;#039;s resident lush. It smells faintly of fruit wine.')
repby = repby.concat('NO.23 酸梅酒的 1/10 比例缩放公仔。有过度保护倾向的小马，也是小马镇的万年酒鬼。闻起来有淡淡水果酒的气味。 ')
torep = torep.concat('A 1/10th scale figurine of Bon-Bon. Usually seen in the company of Lyra. Suffers from various throat ailments that make her sound different every time you see her.')
repby = repby.concat('NO.24 糖糖的 1/10 比例缩放公仔。常常被目击与天琴心弦在一起。患有许多呼吸道相关的疾病，使你每次遇到她的时候她的声音都不同。 ')
torep = torep.concat('A 1/10th scale fluffy figurine of Fluffle Puff. Best Bed Forever.')
repby = repby.concat('NO.25 毛毛小马 1/10 比例缩放的毛茸茸玩偶。让你想要永远躺在上面。 ')
torep = torep.concat('A lifesize figurine of Angel Bunny, Fluttershy&amp;#039;s faithful yet easily vexed pet and life partner. All-purpose assistant, time keeper, and personal attack alarm.')
repby = repby.concat('NO.26 天使兔的等身大玩偶。为小蝶忠实且易怒的宠物及伴侣。万能助理、报时器、受到人身攻击时的警报器。 ')
torep = torep.concat('A lifesize figurine of Gummy, Pinkie Pie&amp;#039;s faithful pet. Usually found lurking in your bathtub. While technically an alligator, he is still arguably the best pony.')
repby = repby.concat('NO.27 甘米的等身大玩偶。是萍琪的忠实宠物。经常被发现潜伏在你的浴缸里。虽然技术上是只短吻鳄，但牠仍然可以称得上是最棒的小马。 ')
//文物奖杯
torep = torep.concat('Precursor Artifact')
repby = repby.concat('旧世界文物')
torep = torep.concat('Iridium Sprinkler')
repby = repby.concat('铱合金洒水器')
torep = torep.concat('ManBearPig Tail')
repby = repby.concat('人熊猪的尾巴(层级2)')
torep = torep.concat('Holy Hand Grenade of Antioch')
repby = repby.concat('安提阿的神圣手榴弹(层级2)')
torep = torep.concat('Mithra\'s Flower')
repby = repby.concat('猫人族的花(层级2)')
torep = torep.concat('Dalek Voicebox')
repby = repby.concat('戴立克音箱(层级2)')
torep = torep.concat('Lock of Blue Hair')
repby = repby.concat('一绺蓝发(层级3)')
torep = torep.concat('Bunny-Girl Costume')
repby = repby.concat('兔女郎装(层级2)')
torep = torep.concat('Hinamatsuri Doll')
repby = repby.concat('雏人形(层级3)')
torep = torep.concat('Broken Glasses')
repby = repby.concat('破碎的眼镜(层级3)')
torep = torep.concat('Sapling')
repby = repby.concat('树苗(层级4)')
torep = torep.concat('Black T-Shirt')
repby = repby.concat('黑色Ｔ恤(层级4)')
torep = torep.concat('Unicorn Horn')
repby = repby.concat('独角兽的角(层级5)')
torep = torep.concat('Noodly Appendage')
repby = repby.concat('面条般的附肢(层级6)')
torep = torep.concat('Stocking Stuffers')
repby = repby.concat('圣诞袜小礼物(层级7)')
torep = torep.concat('Dinosaur Egg')
repby = repby.concat('恐龙蛋(层级7)')
torep = torep.concat('Precursor Smoothie Blender')
repby = repby.concat('旧世界冰沙机(层级8)')
torep = torep.concat('Rainbow Smoothie')
repby = repby.concat('彩虹冰沙(层级7)')
torep = torep.concat('Tenbora\'s Box')
repby = repby.concat('天菠拉的盒子(层级9)')
torep = torep.concat('Figurine')
repby = repby.concat('塑像')

torep = torep.concat('Monster Chow')
repby = repby.concat('怪物口粮|低|')
torep = torep.concat('Monster Edibles')
repby = repby.concat('怪物食品|中|')
torep = torep.concat('Monster Cuisine')
repby = repby.concat('怪物料理|高|')
torep = torep.concat('Happy Pills')
repby = repby.concat('快乐药丸')
torep = torep.concat('Token of Blood')
repby = repby.concat('血之令牌')
torep = torep.concat('Chaos Token')
repby = repby.concat('混沌令牌')
torep = torep.concat('Crystal of Vigor')
repby = repby.concat('力量水晶')
torep = torep.concat('Crystal of Finesse')
repby = repby.concat('灵巧水晶')
torep = torep.concat('Crystal of Swiftness')
repby = repby.concat('敏捷水晶')
torep = torep.concat('Crystal of Fortitude')
repby = repby.concat('体质水晶')
torep = torep.concat('Crystal of Cunning')
repby = repby.concat('智力水晶')
torep = torep.concat('Crystal of Knowledge')
repby = repby.concat('知识水晶')
torep = torep.concat('Crystal of Flames')
repby = repby.concat('火之水晶')
torep = torep.concat('Crystal of Frost')
repby = repby.concat('冰之水晶')
torep = torep.concat('Crystal of Lightning')
repby = repby.concat('雷之水晶')
torep = torep.concat('Crystal of Tempest')
repby = repby.concat('风之水晶')
torep = torep.concat('Crystal of Devotion')
repby = repby.concat('神圣水晶')
torep = torep.concat('Crystal of Corruption')
repby = repby.concat('暗黑水晶')
torep = torep.concat('Crystal of Quintessence')
repby = repby.concat('灵魂水晶')
//物品类型
torep = torep.concat('Consumable')
repby = repby.concat('消费品')
torep = torep.concat('Artifacts and Trophies')
repby = repby.concat('文物和奖杯')
torep = torep.concat('Artifact')
repby = repby.concat('文物')
torep = torep.concat('Trophy')
repby = repby.concat('战利品')
torep = torep.concat('Token')
repby = repby.concat('代币')
torep = torep.concat('Crystal')
repby = repby.concat('水晶')
torep = torep.concat('Monster Food')
repby = repby.concat('怪物食物')
torep = torep.concat('Material')
repby = repby.concat('素材')
torep = torep.concat('Collectable')
repby = repby.concat('珍藏品')
//材料
/*
torep = torep.concat('Catalyst')
repby = repby.concat('修复剂')
torep = torep.concat('Low-Grade')
repby = repby.concat('低阶')
torep = torep.concat('Mid-Grade')
repby = repby.concat('中阶')
torep = torep.concat('High-Grade')
repby = repby.concat('高阶')
torep = torep.concat('Cloth');
repby = repby.concat('布料');
torep = torep.concat('Leather')
repby = repby.concat('皮革')
torep = torep.concat('Wood')
repby = repby.concat('木材')
torep = torep.concat('Metals')
repby = repby.concat('金属')
torep = torep.concat('Metal')
repby = repby.concat('金属')
torep = torep.concat('Scrap')
repby = repby.concat('废弃')
repby = repby.concat('Materials')
torep = torep.concat('材料')
*/
//素材说明
torep = torep.concat('Some materials scavenged from fallen adventurers by a monster')
repby = repby.concat('从被击倒的冒险者身上收集来的材料')
torep = torep.concat('Required to upgrade equipment bonuses to')
repby = repby.concat('装备强化之材料')
torep = torep.concat('Physical Base Damage')
repby = repby.concat('(物理伤害)')
torep = torep.concat('Physical Hit Chance')
repby = repby.concat('(物理命中率)')
torep = torep.concat('Magical Base Damage')
repby = repby.concat('(魔法伤害)')
torep = torep.concat('Magical Hit Chance')
repby = repby.concat('(魔法命中率)')
torep = torep.concat('Physical Defense')
repby = repby.concat('(物理缓伤)')
torep = torep.concat('Evade Chance')
repby = repby.concat('(回避率)')
torep = torep.concat('Block Chance')
repby = repby.concat('(格挡率)')
torep = torep.concat('Parry Chance')
repby = repby.concat('(招架率)')
torep = torep.concat('Elemental Magic Proficiency')
repby = repby.concat('(元素熟练)')
torep = torep.concat('Divine Magic Proficiency')
repby = repby.concat('(圣熟练)')
torep = torep.concat('Forbidden Magic Proficiency')
repby = repby.concat('(暗熟练)')
torep = torep.concat('Deprecating Magic Proficiency')
repby = repby.concat('(贬抑熟练)')
torep = torep.concat('Supportive Magic Proficiency')
repby = repby.concat('(辅助熟练)')
torep = torep.concat('Fire Spell Damage')
repby = repby.concat('(火焰魔伤)')
torep = torep.concat('Cold Spell Damage')
repby = repby.concat('(冰霜魔伤)')
torep = torep.concat('Elec Spell Damage')
repby = repby.concat('(闪电魔伤)')
torep = torep.concat('Wind Spell Damage')
repby = repby.concat('(狂风魔伤)')
torep = torep.concat('Holy Spell Damage')
repby = repby.concat('(神圣魔伤)')
torep = torep.concat('Dark Spell Damage')
repby = repby.concat('(黑暗魔伤)')
torep = torep.concat('Crushing Mitigation')
repby = repby.concat('(敲击缓伤)')
torep = torep.concat('Slashing Mitigation')
repby = repby.concat('(砍击缓伤)')
torep = torep.concat('Piercing Mitigation')
repby = repby.concat('(刺击缓伤)')
torep = torep.concat('Fire Mitigation')
repby = repby.concat('(火焰缓伤)')
torep = torep.concat('Cold Mitigation')
repby = repby.concat('(冰霜缓伤)')
torep = torep.concat('Elec Mitigation')
repby = repby.concat('(闪电缓伤)')
torep = torep.concat('Wind Mitigation')
repby = repby.concat('(狂风缓伤)')
torep = torep.concat('Holy Mitigation')
repby = repby.concat('(神圣缓伤)')
torep = torep.concat('Dark Mitigation')
repby = repby.concat('(黑暗缓伤)')
torep = torep.concat('Strength')
repby = repby.concat('(力量)')
torep = torep.concat('Dexterity')
repby = repby.concat('(灵巧)')
torep = torep.concat('Agility')
repby = repby.concat('(敏捷)')
torep = torep.concat('Endurance')
repby = repby.concat('(体质)')
torep = torep.concat('Intelligence')
repby = repby.concat('(智力)')
torep = torep.concat('Wisdom')
repby = repby.concat('(感知)')
torep = torep.concat('Magical Defense')
repby = repby.concat('(魔法缓伤)')
torep = torep.concat('Resist Chance')
repby = repby.concat('(抵抗率)')
torep = torep.concat('Physical Crit Chance')
repby = repby.concat('(物理暴击率)')
torep = torep.concat('Magical Crit Chance')
repby = repby.concat('(魔法暴击率)')
}

function eqmthh(eminn){
	try{
		if(document.location.href.match("https://hentaiverse.org/equip/"))
		{

			temp=document.querySelectorAll(".fcb")

			if(temp.length==2)em=temp[0].textContent+" "+temp[1].textContent.replace("The","the")
				else em=temp[0].textContent
			}
		else em=eminn.innerHTML.match(/([>]|[>\[\]0-9A-Z]+)(Fine|Super|Exquisite|Average|Crude|Fair|Magnificent|Legendary|Peerless)[a-zA-Z- ]*/g)
	}
catch(e){}
if(em==null)return eminn.innerHTML
	var eqc1 = new Array();
var eqc2 = new Array();
var eqc3 = new Array();
var eqc4 = new Array();
var eqac = new Array();
var eqe1 = new Array();
var eqe2 = new Array();
var eqe3 = new Array();
var eqe4 = new Array();
var eqae = new Array();
var emc = new Array();
var eqe5 = new Array();
var eqc5 = new Array();
eq1()
eq2()
eq3()
eq4()
eq5()

if(document.location.href.match("https://hentaiverse.org/equip/"))
{

	try{
		e1=eqc(em,eqe1)
		e2=eqc(em,eqe2)
		e3=eqc(em,eqe3)
		e4=eqc(em,eqe4)
		e5=eqc(em,eqe5)
		emc[0]=eqc1[e1]+' '+eqc2[e2]+' '+eqc3[e3]+' '+eqc4[e4]+' '+eqc5[e5]+'</span>'
		tempeq=eminn.innerHTML
		if(temp.length==2){
			tempeq=tempeq.replace(temp[0].textContent,"")
			tempeq=tempeq.replace(temp[1].textContent,emc[0])
		}
		else tempeq=tempeq.replace(temp[0].textContent,emc[0])
	}catch(e){}
}
else
{
	for (var i=0;i<em.length;i++){
		emtemp=em[i].replace("The","the")
		e1=eqc(emtemp,eqe1)
		e2=eqc(emtemp,eqe2)
		e3=eqc(emtemp,eqe3)
		e4=eqc(emtemp,eqe4)
		e5=eqc(emtemp,eqe5)
		emc[i]=eqc1[e1]+' '+eqc2[e2]+' '+eqc3[e3]+' '+eqc4[e4]+' '+eqc5[e5]+'</span>'
	}
	tempeq=eminn.innerHTML
	for(i=0;i<emc.length; i++)	{
		tempeq=tempeq.replace(em[i],'>'+emc[i])
	}
}

	eqa()  //道具装载
	for(i=0;i<eqae.length; i++){
		var regex = new RegExp(eqae[i],'g');
		tempeq = tempeq.replace(regex, eqac[i]);
	}
	return tempeq

function eqc(temp,eqeq){   //temp 输入装备名称，eqeq列表英文
	temps=temp
	for(j=0;j<eqeq.length;j++){
		aaa=temps.match(eqeq[j])
		if(aaa!=null) return j;
	}
	return 0
}

function eqa(){

    //装备属性
    /*eqae = eqae.concat('Potency Tier')
    eqac = eqac.concat('潜力等级')*/
   /* eqae = eqae.concat('One-handed Weapon')
    eqac = eqac.concat('单手武器')
    eqae = eqae.concat('Two-handed Weapon')
    eqac = eqac.concat('双手武器')
    eqae = eqae.concat('Heavy Armor')
    eqac = eqac.concat('重甲')
	eqae = eqae.concat('Staff')
    eqac = eqac.concat('法杖')
    eqae = eqae.concat('Cloth Armor')
    eqac = eqac.concat('布甲')*/
//装备属性//
eqae = eqae.concat('Level')
eqac = eqac.concat('装备等级')
eqae = eqae.concat('Unassigned')
eqac = eqac.concat('未定')
eqae = eqae.concat('One-handed Weapon')
eqac = eqac.concat('单手武器')
eqae = eqae.concat('Two-handed Weapon')
eqac = eqac.concat('双手武器')
eqae = eqae.concat(' Staff')
eqac = eqac.concat(' 法杖')
eqae = eqae.concat('Staff ')
eqac = eqac.concat(' 法杖')
eqae = eqae.concat(' 法杖 ')
eqac = eqac.concat(' Staff')
eqae = eqae.concat('Shield')
eqac = eqac.concat('盾牌')
eqae = eqae.concat('Cloth Armor')
eqac = eqac.concat('布甲')
eqae = eqae.concat('Light Armor')
eqac = eqac.concat('轻甲')
eqae = eqae.concat('Heavy Armor')
eqac = eqac.concat('重甲')
eqae = eqae.concat('Tradeable')
eqac = eqac.concat('可交易')
eqae = eqae.concat('Untradeable')
eqac = eqac.concat('不可交易')
eqae = eqae.concat('Soulbound')
eqac = eqac.concat('灵魂连结')
eqae = eqae.concat('Potency Tier');
eqac = eqac.concat('潜能层级');
eqae = eqae.concat('Condition');
eqac = eqac.concat('耐久度');
eqae = eqae.concat('Attack Accuracy')
eqac = eqac.concat('物理命中')
eqae = eqae.concat('Attack Crit Chance')
eqac = eqac.concat('物理爆击率')
eqae = eqae.concat('Attack Crit Damage')
eqac = eqac.concat('物理爆击伤害')
eqae = eqae.concat('Physical Damage')
eqac = eqac.concat('物理伤害')
eqae = eqae.concat('Physical Hit Chance')
eqac = eqac.concat('物理命中')
eqae = eqae.concat('Physical Crit Chance')
eqac = eqac.concat('物理暴击')
eqae = eqae.concat('Attack Damage')
eqac = eqac.concat('攻击伤害')
eqae = eqae.concat('Damage Mitigations')
eqac = eqac.concat('伤害减免')
eqae = eqae.concat('Parry Chance')
eqac = eqac.concat('招架概率')
eqae = eqae.concat('Magic Accuracy')
eqac = eqac.concat('魔法命中')
eqae = eqae.concat('Magic Damage')
eqac = eqac.concat('魔法伤害')
eqae = eqae.concat('Magic Crit Chance')
eqac = eqac.concat('魔法暴击率')
eqae = eqae.concat('Magic Critical')
eqac = eqac.concat('魔法暴击')
eqae = eqae.concat('Spell Crit Damage')
eqac = eqac.concat('魔法暴击伤害')
eqae = eqae.concat('Mana Conservation')
eqac = eqac.concat('魔法节省')
eqae = eqae.concat('Counter-Resist')
eqac = eqac.concat('反魔法抵抗')
eqae = eqae.concat('Physical Mitigation')
eqac = eqac.concat('物理缓伤')
eqae = eqae.concat('Magical Mitigation')
eqac = eqac.concat('魔法减伤')
eqae = eqae.concat('Block Chance')
eqac = eqac.concat('格挡概率')
eqae = eqae.concat('Upgrades and Enchantments');
eqac = eqac.concat('升级与附魔');
eqae = eqae.concat('Primary Attributes')
eqac = eqac.concat('属性(PAB)')
eqae = eqae.concat('Evade Chance')
eqac = eqac.concat('回避概率')
eqae = eqae.concat('Casting Speed')
eqac = eqac.concat('咏唱速度')
eqae = eqae.concat('Resist Chance')
eqac = eqac.concat('魔免概率')
eqae = eqae.concat(' Spell Damage')
eqac = eqac.concat('伤害加成(EDB)')
eqae = eqae.concat('Spell Damage')
eqac = eqac.concat('伤害加成(EDB)')
eqae = eqae.concat('Siphon Spirit')
eqac = eqac.concat('灵力吸取')
eqae = eqae.concat('Siphon Magic');
eqac = eqac.concat('魔力吸取');
eqae = eqae.concat('Siphon Health')
eqac = eqac.concat('生命吸取')
eqae = eqae.concat('Ether Theft')
eqac = eqac.concat('魔力回流')
eqae = eqae.concat('Penetrated Armor');
eqac = eqac.concat('破甲');
eqae = eqae.concat('Attack Speed')
eqac = eqac.concat('物理攻击速度')
eqae = eqae.concat('Current Owner')
eqac = eqac.concat('持有者')
eqae = eqae.concat('Ether Tap')
eqac = eqac.concat('魔力回流')
eqae = eqae.concat('Elemental Strike')
eqac = eqac.concat('属性攻击')
eqae = eqae.concat('Bleeding Wound')
eqac = eqac.concat('流血')
eqae = eqae.concat('Lasts for')
eqac = eqac.concat('持续')
eqae = eqae.concat('Stunned')
eqac = eqac.concat('眩晕')
eqae = eqae.concat('turns')
eqac = eqac.concat('回合')
eqae = eqae.concat('Interference')
eqac = eqac.concat('干涉')
eqae = eqae.concat('Burden');
eqac = eqac.concat('负重');
eqae = eqae.concat('Strength');
eqac = eqac.concat('力量');
eqae = eqae.concat('Dexterity');
eqac = eqac.concat('灵巧');
eqae = eqae.concat('Agility');
eqac = eqac.concat('敏捷');
eqae = eqae.concat('Endurance');
eqac = eqac.concat('体质');
eqae = eqae.concat('Intelligence');
eqac = eqac.concat('智力');
eqae = eqae.concat('Wisdom');
eqac = eqac.concat('感知');
eqae = eqae.concat(' chance');
eqac = eqac.concat('机率');
eqae = eqae.concat('Crushing');
eqac = eqac.concat('破碎');
eqae = eqae.concat('Piercing');
eqac = eqac.concat('穿刺');
eqae = eqae.concat('Slashing');
eqac = eqac.concat('斩击');
eqae = eqae.concat(' Damage');
eqac = eqac.concat('伤害');
eqae = eqae.concat(' Hit Chance');
eqac = eqac.concat('命中');
eqae = eqae.concat(' Crit Chance');
eqac = eqac.concat('暴击率');
eqae = eqae.concat(' Defense');
eqac = eqac.concat('防御');
eqae = eqae.concat(' Mitigation');
eqac = eqac.concat('缓伤');
eqae = eqae.concat(' DOT');
eqac = eqac.concat('持续性伤害');
eqae = eqae.concat(' Proficiency');
eqac = eqac.concat('熟练度(Pro)');
eqae = eqae.concat('Proficiency');
eqac = eqac.concat('熟练度(Pro)');
eqae = eqae.concat('>Elemental');
eqac = eqac.concat('>元素');
eqae = eqae.concat('Divine');
eqac = eqac.concat('圣');
eqae = eqae.concat('Forbidden');
eqac = eqac.concat('暗');
eqae = eqae.concat('Deprecating');
eqac = eqac.concat('减益');
eqae = eqae.concat('Supportive');
eqac = eqac.concat('辅助');

eqae = eqae.concat('>Fire');
eqac = eqac.concat('>火焰');
eqae = eqae.concat('>Cold');
eqac = eqac.concat('>冰霜');
eqae = eqae.concat('>Elec');
eqac = eqac.concat('>闪电');
eqae = eqae.concat('>Wind');
eqac = eqac.concat('>狂风');
eqae = eqae.concat('>Holy');
eqac = eqac.concat('>神圣');
eqae = eqae.concat('>Dark');
eqac = eqac.concat('>黑暗');
eqae = eqae.concat('Void ');
eqac = eqac.concat('虚空');
eqae = eqae.concat('Void');
eqac = eqac.concat('虚空');
eqae = eqae.concat('points');
eqac = eqac.concat('点');
eqae = eqae.concat(' Strike');
eqac = eqac.concat('冲击');
eqae = eqae.concat('Strike');
eqac = eqac.concat('冲击');
eqae = eqae.concat('None');
eqac = eqac.concat('无');
//道具界属性
eqae = eqae.concat('Physical');
eqac = eqac.concat('物理');
eqae = eqae.concat('Magical');
eqac = eqac.concat('魔法');
eqae = eqae.concat('Hollowforged');
eqac = eqac.concat('虚空化');
eqae = eqae.concat(' Bonus');
eqac = eqac.concat('加成');
eqae = eqae.concat('Counter-Parry');
eqac = eqac.concat('反制招架');
eqae = eqae.concat('proof');
eqac = eqac.concat('抵御');
eqae = eqae.concat('Annihilator');
eqac = eqac.concat('魔法暴伤');
eqae = eqae.concat('Archmage');
eqac = eqac.concat('魔法伤害');
eqae = eqae.concat('Butcher');
eqac = eqac.concat('武器伤害');
eqae = eqae.concat('Capacitor');
eqac = eqac.concat('增加魔力');
eqae = eqae.concat('Economizer');
eqac = eqac.concat('魔力节省');
eqae = eqae.concat('Fatality');
eqac = eqac.concat('武器暴伤');
eqae = eqae.concat('Juggernaut');
eqac = eqac.concat('增加体力');
eqae = eqae.concat('Overpower');
eqac = eqac.concat('反制招架');
eqae = eqae.concat('Penetrator');
eqac = eqac.concat('反制抵抗');
eqae = eqae.concat('Spellweaver');
eqac = eqac.concat('咏唱速度');
eqae = eqae.concat('Swift冲击');
eqac = eqac.concat('物理攻速');
//论坛修正
eqae = eqae.concat('虚空seeker');
eqac = eqac.concat('Voidseeker');
eqae = eqae.concat('防御 Matrix Modulator');
eqac = eqac.concat(' Defense Matrix Modulator');

}

function eq5(){
	eqe5 = eqe5.concat('ddsezxcwer')
    eqc5 = eqc5.concat('');  //如果出现问号绝对有问题
    //盾
    eqe5 = eqe5.concat('Buckler');
    eqc5 = eqc5.concat('');
    eqe5 = eqe5.concat('Kite Shield');
    eqc5 = eqc5.concat('');
    eqe5 = eqe5.concat('Tower Shield');
    eqc5 = eqc5.concat('');
    // 单手武器类
    eqe5 = eqe5.concat('Dagger');
    eqc5 = eqc5.concat('*匕首(单)');
    eqe5 = eqe5.concat('Shortsword');
    eqc5 = eqc5.concat('短剑(单)');
    eqe5 = eqe5.concat('Wakizashi');
    eqc5 = eqc5.concat('胁差(单)');
    eqe5 = eqe5.concat('Axe');
    eqc5 = eqc5.concat('斧(单)');
    eqe5 = eqe5.concat('Club');
    eqc5 = eqc5.concat('棍(单)');
    eqe5 = eqe5.concat('Rapier');
    eqc5 = eqc5.concat('西洋剑(单)');
    //双手
    eqe5 = eqe5.concat('Longsword');
    eqc5 = eqc5.concat('长剑(双)');
    eqe5 = eqe5.concat('Scythe');
    eqc5 = eqc5.concat('*镰刀(双)');
    eqe5 = eqe5.concat('Katana');
    eqc5 = eqc5.concat('太刀(双)');
    eqe5 = eqe5.concat('Mace');
    eqc5 = eqc5.concat('重槌(双)');
    eqe5 = eqe5.concat('Estoc');
    eqc5 = eqc5.concat('刺剑(双)');
    //法杖
    eqe5 = eqe5.concat('Staff');
    eqc5 = eqc5.concat('法杖');
    //布甲
    eqe5 = eqe5.concat('Cap');
    eqc5 = eqc5.concat('兜帽');
    eqe5 = eqe5.concat('Robe');
    eqc5 = eqc5.concat('长袍');
    eqe5 = eqe5.concat('Gloves');
    eqc5 = eqc5.concat('手套');
    eqe5 = eqe5.concat('Pants');
    eqc5 = eqc5.concat('短裤');
    eqe5 = eqe5.concat('Shoes');
    eqc5 = eqc5.concat('鞋');
    //轻甲
    eqe5 = eqe5.concat('Helmet');
    eqc5 = eqc5.concat('头盔');
    eqe5 = eqe5.concat('Breastplate');
    eqc5 = eqc5.concat('护胸');
    eqe5 = eqe5.concat('Gauntlets');
    eqc5 = eqc5.concat('手套');
    eqe5 = eqe5.concat('Leggings');
    eqc5 = eqc5.concat('护腿');
    //重甲
    eqe5 = eqe5.concat('Cuirass');
    eqc5 = eqc5.concat('胸甲');
    eqe5 = eqe5.concat('Armor');
    eqc5 = eqc5.concat('盔甲');
    eqe5 = eqe5.concat('Greaves');
    eqc5 = eqc5.concat('护胫');
    eqe5 = eqe5.concat('Sabatons');
    eqc5 = eqc5.concat('重靴');
    eqe5 = eqe5.concat('Boots');
    eqc5 = eqc5.concat('长靴');
    }
function eq4(){
//盾或者材料,武器不会出现这个
    eqe4 = eqe4.concat('ddsezxcwer');//防止空缺
    eqc4 = eqc4.concat('');
    //盾
    eqe4 = eqe4.concat('Buckler');
    eqc4 = eqc4.concat('圆盾');
    eqe4 = eqe4.concat('Kite Shield');
    eqc4 = eqc4.concat('鸢盾');
    eqe4 = eqe4.concat('Tower Shield');
    eqc4 = eqc4.concat('*塔盾');
    eqe4 = eqe4.concat('Force Shield');
    eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >力场盾</span>');
    //布甲
    eqe4 = eqe4.concat('Cotton ');
    eqc4 = eqc4.concat('棉质(布)');
    eqe4 = eqe4.concat('Gossamer');
    eqc4 = eqc4.concat('*薄纱(布)');
    eqe4 = eqe4.concat('Phase');
    eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >相位</span><span style=\"background:#FFFFFF;color:#000000\" >(布)</span>');
    //轻甲
    eqe4 = eqe4.concat('Leather');
    eqc4 = eqc4.concat('皮革<span style=\"background:#d498ff;color:#FFFFFF\" >(轻)</span>');
    eqe4 = eqe4.concat('Kevlar');
    eqc4 = eqc4.concat('*凯夫拉<span style=\"background:#d498ffe;color:#FFFFFF\" >(轻)</span>');
    eqe4 = eqe4.concat('Shade');
    eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >暗影</span><span style=\"background:#d498ff;color:#FFFFFF\" >(轻)</span>');
    //重甲
    eqe4 = eqe4.concat('Plate');
    eqc4 = eqc4.concat('板甲<span style=\"background:#6b06b4;color:#FFFFFF\" >(重)</span>');
    eqe4 = eqe4.concat('Power');
    eqc4 = eqc4.concat('<span style=\"background:#ffa500\" >动力</span><span style=\"background:#6b06b4;color:#FFFFFF\" >(重)</span>');

    //法杖
    eqe4 = eqe4.concat('Ebony');
    eqc4 = eqc4.concat('*乌木');
    eqe4 = eqe4.concat('Redwood');
    eqc4 = eqc4.concat('红木');
    eqe4 = eqe4.concat('Willow');
    eqc4 = eqc4.concat('柳木');
    eqe4 = eqe4.concat('Oak');
    eqc4 = eqc4.concat('橡木');
    eqe4 = eqe4.concat('Katalox');
    eqc4 = eqc4.concat('铁木');
}
function eq3(){
    eqe3 = eqe3.concat('adfouhasd')//防止空缺
    eqc3 = eqc3.concat('')
//防具后缀//
    eqe3 = eqe3.concat('of Negation')
    eqc3 = eqc3.concat('否定')
    eqe3 = eqe3.concat('of the Shadowdancer')
    eqc3 = eqc3.concat('<span style=\"color:red\" >影武</span>')
    eqe3 = eqe3.concat('of the Arcanist')
    eqc3 = eqc3.concat('奥术')
    eqe3 = eqe3.concat('of the Fleet')
    eqc3 = eqc3.concat('迅捷')
    eqe3 = eqe3.concat('of Dampening')
    eqc3 = eqc3.concat('防碎')
    eqe3 = eqe3.concat('of Stoneskin')
    eqc3 = eqc3.concat('防斩')
    eqe3 = eqe3.concat('of Deflection')
    eqc3 = eqc3.concat('防刺')
    eqe3 = eqe3.concat('of the Battlecaster');
    eqc3 = eqc3.concat('魔战');
    eqe3 = eqe3.concat('of the Nimble');
    eqc3 = eqc3.concat('招架');
    eqe3 = eqe3.concat('of the Barrier')
    eqc3 = eqc3.concat('格挡')
    eqe3 = eqe3.concat('of Protection')
    eqc3 = eqc3.concat('物防')
    eqe3 = eqe3.concat('of Warding')
    eqc3 = eqc3.concat('抗魔')
    eqe3 = eqe3.concat('of the Raccoon')
    eqc3 = eqc3.concat('招架')
//武器后缀//
    eqe3 = eqe3.concat('of Slaughter');
    eqc3 = eqc3.concat('<span style=\"background:#FF0000;color:#FFFFFF\" >杀戮</span>');
    eqe3 = eqe3.concat('of Swiftness');
    eqc3 = eqc3.concat('加速');
    eqe3 = eqe3.concat('of Balance');
    eqc3 = eqc3.concat('<span style=\"background:#c8c87c\;color:#000000\" >平衡</span>');
    eqe3 = eqe3.concat('of the Battlecaster');
    eqc3 = eqc3.concat('魔战');
    eqe3 = eqe3.concat('of the Banshee');
    eqc3 = eqc3.concat('吸魂');
    eqe3 = eqe3.concat('of the Illithid');
    eqc3 = eqc3.concat('吸魔');
    eqe3 = eqe3.concat('of the Vampire');
    eqc3 = eqc3.concat('吸血');
    eqe3 = eqe3.concat('of Destruction')
    eqc3 = eqc3.concat('<span style=\"background:#9400d3\;color:#FFFFFF" >毁灭之</span>')
    eqe3 = eqe3.concat('of Surtr')
    eqc3 = eqc3.concat('<span style=\"background:#f97c7c\;color:#000000" >苏尔特</span>')
    eqe3 = eqe3.concat('of Niflheim')
    eqc3 = eqc3.concat('<span style=\"background:#94c2f5\;color:#000000" >尼芙菲姆</span>')
    eqe3 = eqe3.concat('of Mjolnir')
    eqc3 = eqc3.concat('<span style=\"background:#fcff66\;color:#000000" >姆乔尔尼尔</span>')
    eqe3 = eqe3.concat('of Freyr')
    eqc3 = eqc3.concat('<span style=\"background:#7ff97c\;color:#000000" >弗瑞尔</span>')
    eqe3 = eqe3.concat('of Heimdall')
    eqc3 = eqc3.concat('<span style=\"background:#ffffff\;color:#000000" >海姆达</span>')
    eqe3 = eqe3.concat('of Fenrir')
    eqc3 = eqc3.concat('<span style=\"background:#000000\;color:#ffffff" >芬里尔</span>')
    eqe3 = eqe3.concat('of Focus')
    eqc3 = eqc3.concat('专注')
    eqe3 = eqe3.concat('of the Elementalist')
    eqc3 = eqc3.concat('元素使')
    eqe3 = eqe3.concat('of the Heaven-sent')
    eqc3 = eqc3.concat('天堂')
    eqe3 = eqe3.concat('of the Demon-fiend')
    eqc3 = eqc3.concat('恶魔')
    eqe3 = eqe3.concat('of the Earth-walker')
    eqc3 = eqc3.concat('地行者')
    eqe3 = eqe3.concat('of the Curse-weaver')
    eqc3 = eqc3.concat('咒术师')
}

function eq2(){

//武器或防具前缀//
    eqe2 = eqe2.concat('dfgdsfgsdge');//防止空缺
    eqc2 = eqc2.concat('');
    eqe2 = eqe2.concat('Radiant');
    eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:red" >魔光的</span>');
    eqe2 = eqe2.concat('Charged');
    eqc2 = eqc2.concat('<span style=\"color:red\" >充能的</span>');
    eqe2 = eqe2.concat('Mystic');
    eqc2 = eqc2.concat('神秘的');
    eqe2 = eqe2.concat('Amber');
    eqc2 = eqc2.concat('琥珀的');
    eqe2 = eqe2.concat('Mithril');
    eqc2 = eqc2.concat('<span style=\"color:red\" >秘银的</span>');
    eqe2 = eqe2.concat('Agile');
    eqc2 = eqc2.concat('<span style=\"color:red\" >俊敏的</span>');
    eqe2 = eqe2.concat('Zircon');
    eqc2 = eqc2.concat('锆石的');
    eqe2 = eqe2.concat('Frugal');
    eqc2 = eqc2.concat('节约的');
    eqe2 = eqe2.concat('Jade');
    eqc2 = eqc2.concat('翡翠的');
    eqe2 = eqe2.concat('Cobalt');
    eqc2 = eqc2.concat('钴石的');
    eqe2 = eqe2.concat('Ruby');
    eqc2 = eqc2.concat('红宝石');
    eqe2 = eqe2.concat('Onyx');
    eqc2 = eqc2.concat('缟玛瑙');
    eqe2 = eqe2.concat('Savage');
    eqc2 = eqc2.concat('<span style=\"color:red\" >残暴的</span>');
    eqe2 = eqe2.concat('Reinforced');
    eqc2 = eqc2.concat('强固的');
    eqe2 = eqe2.concat('Shielding');
    eqc2 = eqc2.concat('盾化的');
    eqe2 = eqe2.concat('Fiery')
    eqc2 = eqc2.concat('<span style=\"background:#f97c7c\;color:#000000" >红莲的</span>')
    eqe2 = eqe2.concat('Arctic')
    eqc2 = eqc2.concat('<span style=\"background:#94c2f5\;color:#000000" >北极的</span>')
    eqe2 = eqe2.concat('Shocking')
    eqc2 = eqc2.concat('<span style=\"background:#fcff66\;color:#000000" >雷鸣的</span>')
    eqe2 = eqe2.concat('Tempestuous')
    eqc2 = eqc2.concat('<span style=\"background:#a9f94f\;color:#000000" >风暴的</span>')
    eqe2 = eqe2.concat('Hallowed')
    eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:#000000" >圣光的</span>')
    eqe2 = eqe2.concat('Demonic')
    eqc2 = eqc2.concat('<span style=\"background:#000000\;color:#ffffff" >魔性的</span>')
    eqe2 = eqe2.concat('Ethereal')
    eqc2 = eqc2.concat('<span style=\"background:#ffffff\;color:#5c5a5a" >虚空的</span>')

}
function eq1()
{
//品质//
    eqe1 = eqe1.concat('Crude')
    eqc1 = eqc1.concat('粗糙')
    eqe1 = eqe1.concat('Fair');
    eqc1 = eqc1.concat('尚可');
    eqe1 = eqe1.concat('Average');
    eqc1 = eqc1.concat('普通');
    eqe1 = eqe1.concat('Fine')
    eqc1 = eqc1.concat('*优质')
    eqe1 = eqe1.concat('Superior');
    eqc1 = eqc1.concat('<span style=\"background:#44c554\;color:#ffffff" >优秀</span>');
    eqe1 = eqe1.concat('Exquisite');
    eqc1 = eqc1.concat('<span style=\"background:#6060f9\;color:#ffffff" >精致</span>');
    eqe1 = eqe1.concat('Magnificent');
    eqc1 = eqc1.concat('<span style=\"background:#0000ae\;color:#ffffff" >华丽</span>');
    eqe1 = eqe1.concat('Legendary');
    eqc1 = eqc1.concat('<span style=\"background:#f5b9cd\;color:#000000" >传奇</span>');
    eqe1 = eqe1.concat('Peerless');
    eqc1 = eqc1.concat('<span style=\"background:#fbc93e\;color:#000000" >无双</span>');
}
}
}
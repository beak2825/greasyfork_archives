// ==UserScript==
// @name        Hverse
// @match       http://hentaiverse.org/*
// @run-at      document-end
// @require     http://code.jquery.com/jquery-latest.js
// @require     https://cdn.jsdelivr.net/store.js/1.3.15/store.min.js
// @description Nope
// @version 0.0.1.20160110014659
// @namespace https://greasyfork.org/users/26703
// @downloadURL https://update.greasyfork.org/scripts/16078/Hverse.user.js
// @updateURL https://update.greasyfork.org/scripts/16078/Hverse.meta.js
// ==/UserScript==wwwindow.battle.lock_action);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CUSTOM FUNCTION DEFINITIONS - various functions whose operation is not specifically related to the content of the page //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
jQuery.fn.reverse = [].reverse;

function thresholdMath(x, y, o, k){
    var z = x-y;
    z = z < o ? o : z;
    return z+k;
}

function allFalse(obj){
    for(var o in obj)
        if(!!obj[o]) return false;
    return true;
}

function testAndStore(beingTested, testedAgainst){
    var x = store.get(beingTested);
    if ( (!(x)) || (x !== testedAgainst) ){
        store.set(beingTested, testedAgainst);
        return true;
    }else return false;

}

function testStoreAndGet(beingTested, testedAgainst){
    var x = store.get(beingTested);
    if ( (!(x)) || (x !== testedAgainst) ){
        store.set(beingTested, testedAgainst);
        return testedAgainst;
    }else return x;
}

/*
function testStoreAndGetArray(beingTested, testedAgainst){
    var x = store.get(beingTested);
    if ( (!(x)) || (x !== testedAgainst) ){
        store.set(beingTested, testedAgainst);
        return [true, testedAgainst];
    }else return [false, x];
}
*/

function testStoreOnlyNotNull(beingTested, testedAgainst){
    if ( (store.get(beingTested) !== testedAgainst) && (!!testedAgainst) ){ 
        store.set(beingTested, testedAgainst); 
        return true; 
    }else return false;
}

function testStoreOnlyNotNullAndGet(beingTested, testedAgainst){
    var x = store.get(beingTested);
    if ( (x !== testedAgainst) && (!!testedAgainst) ){ 
        store.set(beingTested, testedAgainst); 
        return testedAgainst; 
    }else return x;
}

function testStoreOnlyNotNullAndGetArray(beingTested, testedAgainst){
    var x = store.get(beingTested);
    if ( (x !== testedAgainst) && (!!testedAgainst) ){ 
        store.set(beingTested, testedAgainst); 
        return [true, testedAgainst]; 
    }else return [false, x];
}

function coordClickerOverlay(){
    $('html').append("<div id='divA' style='width:1903px;height:1903px;position:fixed;top:0px;left:0px;'></div>");
    $('#divA').click(function(event){
        var x = event.screenX;
        var y = event.screenY;
        console.log("("+x+", "+y+")");
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION FUNCTIONS - functions that primarily use store.js for creating stored values to be referenced when running //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function roundInfo(tAS, tSAG, tSONNAGA, sg, round, label){//returns 'round' (object)
    var storedText = tSONNAGA("round.text", $(".t3:contains('(Round')").text());
    //console.log("storedText = "+storedText);
    if (storedText[0]){
        round.current = tSAG("round.current", storedText[1].split('(Round ')[1].split(' / ')[0]);
        round.total = tSAG("round.total", storedText[1].split('(Round ')[1].split(' / ')[1].split(')')[0]);
		round.new = tSAG("round.new", true);
    }else round = {current: sg("round.current"), total: sg("round.total"), new: sg("round.new")};
    //console.log("inside roundInfo action end");
    if (label) document.body.insertAdjacentHTML("beforeEnd","<p id='roundLabel' style='position:fixed;top:704px;left:10px;'>Round "+round.current+" of "+round.total+"</p>");
    return round;
}

function monsterInfo(tAS, sg, round){//no return
    if (tAS("monster.current", round.current)){
        var SPAWN = $(".t3:contains('Spawned')").reverse().map(function(){ 
            return $(this).text(); 
        });
        //console.log(SPAWN, SPAWN.length);
        tAS("monster.SPAWN", SPAWN);
        tAS("monster.number", SPAWN.length);
        for (var i = 0; i <= SPAWN.length-1; i++){
            var x = i+1;
            if (tAS("monster."+x, SPAWN[i])){
                //console.log("STORED: monster."+x+"='"+store.get("monster."+x)+"'.");
            }     
            //console.log("From 'SPAWN': monsterNum"+i+": "+SPAWN[i]);
            //console.log("From store.get('monster."+i+"'): monsterNum"+i+": "+store.get("monster."+i));
            //console.log("From #mkey_"+i+": monsterNum"+i+": "+$("#mkey_"+i).attr('innerText'));
        }
    }
    for (var monsterIndex = 1; monsterIndex <= $("#monsterpane > div").length; monsterIndex++){
        $("#mkey_"+monsterIndex).attr('innerText', store.get("monster."+monsterIndex));
    }
}

function getSpell(livingMonsters){//returns spell name (string)
    var spell=store.get("magic.spell.COMBINED");
    var fakeMonsters=2;
    if (((livingMonsters+fakeMonsters)>=spell.a.size) && (document.getElementById(spell.LIST[spell.a.name]).hasAttribute("onclick"))){
        //console.log("getSpell() a: "+spell.a.name);
        return spell.a.name;
    }else if (((livingMonsters+fakeMonsters)>=spell.b.size) && (document.getElementById(spell.LIST[spell.b.name]).hasAttribute("onclick"))){
        //console.log("getSpell() b: "+spell.b.name);
        return spell.b.name;
    }else if ((livingMonsters>=1)){
        //console.log("getSpell() c: "+spell.c.name);
        return spell.c.name;
    }
}

function initMagic(tAS, sg){//no return
    if (!(sg('magic.spell.COMBINED'))){
        if (tAS("initMagic.internal", {
            rank: sg("magic.spell.size.rank"),
            SIZE: sg("magic.spell.size.SIZE"),
            element: sg("magic.element"),
            NAME: sg("magic.spell.NAME")})){
            var internal = sg("initMagic.internal");
            tAS('magic.spell.COMBINED', {
                LIST: sg("magic.spell.LIST"),
                a: {name: internal.NAME[internal.element].a, 
                    size: internal.SIZE[internal.rank].a}, 
                b: {name: internal.NAME[internal.element].b, 
                    size: internal.SIZE[internal.rank].b}, 
                c: {name: internal.NAME[internal.element].c, 
                    size: internal.SIZE[internal.rank].c}
            });
        }
    }
}

function setElementHelper(sg){//only for use in namesake function --> returns assembled object;
    return {"magic.element": sg("magic.element"),
            "magic.elementKey": sg("magic.elementKey"),
            "magic.spell.size.rank": sg("magic.spell.size.rank")};
}

function setElement(tAS, sg, ss){//no return
    if (tAS("setElement.internal", setElementHelper(sg))){
        var ELEMENTS = sg("magic.ELEMENTS");
        if (!setElementFromPage(tAS, sg, ss, ELEMENTS)){ if (!inBattle()) setElementAuto(sg, ELEMENTS); else setElementManual(tAS, sg, ELEMENTS); }
    }
}

function setElementFromPage(tAS, sg, ss, ELEMENTS){//return true if conditions permit function execution, otherwise return false
	if( ($("#abilitypane").length!==0) && (sg("style")==='mage') ){
		var activeAbilityIdentifyingProperties={
			1: 'h.png); background-position:0px 2px',
			2: 'i.png); background-position:-34px 2px',
			3: '9.png); background-position:0px 2px',
			4: 'i.png); background-position:-68px 2px'
		};
		var abilityTiers = [];
		for (var i in ELEMENTS){
			if($("div#toppane > div > div > div[style*='background-image:url(http://ehgt.org/v/t/"+activeAbilityIdentifyingProperties[i]+"']").length!==0){
				ss("magic.element", ELEMENTS[i]);
				ss("magic.elementKey", i);
			}
		}
		if (window.location.href==='http://hentaiverse.org/?s=Character&ss=ab&tree=elemental'){
			for (var o in ELEMENTS){
				if( ( $("div#botpane > div > div > div > div[style*='background-image:url(http://ehgt.org/v/t/"+activeAbilityIdentifyingProperties[o]+"']").length !== 0 ) ){
					abilityTiers = $("div#botpane > div > div > div > div[style*='background-image:url(http://ehgt.org/v/t/"+activeAbilityIdentifyingProperties[o]+"']").parent().next().children().not(".c").each(function(){return $(this).attr('style');});
				}
			}
			var currentTier=0;
			for (var x in abilityTiers){
				if (!!(abilityTiers[x].outerHTML)){
					if (abilityTiers[x].outerHTML.split('http://ehgt.org/v/ab/')[1].split('.png)"></div>')[0] == '7rf'){
						currentTier++;
					}
				}
			}
			tAS("magic.spell.size.rank", currentTier);
		}
		return true;
	}
	return false;
}

function setElementAuto(sg, ELEMENTS){//no return
	if (!(sg("magic.elementKey") in ELEMENTS)){
		var hiddenWindow = window.open('http://hentaiverse.org/?s=Character&ss=ab&tree=elemental');
		hiddenWindow.blur();
		window.focus();
		setTimeout(function(){ hiddenWindow.close(); }, 800);
		var anyFocusable = document.querySelector(
			"a[href]:not([tabindex='-1'])",
			"area[href]:not([tabindex='-1'])",
			"input:not([disabled]):not([tabindex='-1'])",
			"select:not([disabled]):not([tabindex='-1'])",
			"textarea:not([disabled]):not([tabindex='-1'])",
			"button:not([disabled]):not([tabindex='-1'])",
			"iframe:not([tabindex='-1'])",
			"[tabindex]:not([tabindex='-1'])",
			"[contentEditable=true]:not([tabindex='-1'])"
		);
		anyFocusable.focus();
		anyFocusable.blur();
	}
}

function setElementManual(tAS, sg, ELEMENTS){//no return
	if (!(sg("magic.elementKey") in ELEMENTS)){
		var arr = [];
		
		for (var k in ELEMENTS){
			arr[k]={val : k, text: ELEMENTS[k]};
		}
		
		arr[0]={val : 0, text: 'none'};
		$('body').append("<select id='manualSelectElement' style='position:fixed;top:706px;left:"+(10+$("#roundLabel").width()+5)+"px;'>");
		$(arr).each(function() {
			$('#manualSelectElement').append($("<option>").attr('value',this.val).text(this.text));
		});

		document.getElementById("manualSelectElement").addEventListener("change", function(){
			var x = document.getElementById("manualSelectElement");
			tAS("magic.element", ELEMENTS[x.value]);
			tAS("magic.elementKey", x.value);
		});

		var SIZE = sg("magic.spell.size.SIZE");

		var arr2 = [];
		for (var c in SIZE){
			arr2[c]={val : c, text: c};
		}
		arr2[0]={val : 0, text: 'none'};
		$('body').append("<select id='manualSelectRank' style='position:fixed;top:706px;left:"+(10+$("#roundLabel").width()+5+$('#manualSelectElement').width()+5)+"px;'>");
		$(arr2).each(function() {
			$('#manualSelectRank').append($("<option>").attr('value',this.val).text(this.text));
		});

		document.getElementById("manualSelectRank").addEventListener("change", function(){
			var x = document.getElementById("manualSelectRank");
			tAS("magic.spell.size.rank", x.value);
		});
	}
}

function inBattle(){//returns true if in battle, false if not.
    //if(!document.getElementById('battleform')) console.log(false); else console.log(true);
    if(!document.getElementById('battleform')) return false; else return true;
}

function difficultyThresholdReductionHelper(tSAG, LIST){//only for use in namesake function --> returns assembled object;
    return{'LIST': LIST,
           'current': tSAG('dtr.VALUE', {'normal': LIST.DIFFICULTY_VALUE[LIST.difficulty],'initial': 3})};
}

function difficultyThresholdReduction(tAS, tSAG, sg, af, round, maintain){//returns "dtr" value (int)
    if (tAS("difficultyThresholdReduction.internal", difficultyThresholdReductionHelper(tSAG, sg("dtr.LIST")))){
        //console.log(store.get("difficultyThresholdReduction.internal"));
        var internal = sg("difficultyThresholdReduction.internal");
        if (round.current==1) return round.total < 5 ? internal.current.normal : ((internal.current.initial*1)+(round.current*1));else if(inBattle()){
            var initCheck = {};
            var placeIndex=0;
            for (var checkBuffIndex in maintain.BUFFS){initCheck[checkBuffIndex] = checkForBuff(maintain.BUFFS[checkBuffIndex]);placeIndex++;}
            for (var checkItemIndex in maintain.ITEM){initCheck[checkItemIndex+placeIndex] = checkForBuff(maintain.ITEM[checkItemIndex].toLowerCase());}
            if (allFalse(initCheck))return internal.current.initial; else return internal.current.initial == internal.current.normal ? ((internal.current.initial*1)+(round.current*1)) : internal.current.normal;
        }else return 0;
    }
}

/*
function initItems(){
    var items = $("div[ID*='ikey_']").not("[ID='ikey_p']").map(function(i) {
        return $(this).text();
    });
    var key = {};
    var item = {};
    for (var x in items.length-1){
        var rexo = x+1;
        item[rexo]=items[rexo];
        key[items[rexo]]=rexo;
    }
    console.log('itemsByKeyAndName: '+items+'. key: '+key+'. item: '+item);
    return [testStoreAndGet("item.ITEM", item), testStoreAndGet("item.KEY", key)];
}
*/

function initItems(tAS, tSAG, sg, itemslots){//no return
    if (tAS("initItems.internal", {item: sg("item.ITEM"),
                                   key: sg("item.KEY")})){
        var item = {};
        var key = {};
        $("div[ID*='ikey_']").not("[ID='ikey_p']").each(function(index) {
            var itemIDNumber = $(this).attr('id').split('ikey_')[1];
            item[itemIDNumber]=$(this).text();
            key[$(this).text()]=itemIDNumber;
        });

        tAS('item.ITEM', item);
        tAS('item.KEY', key);
    }
}

//////////////////////////////////////////////////////////////////////////////
// STYLE BASED ACTIONS - different actions depeneding on which style is set //
//////////////////////////////////////////////////////////////////////////////
//select target based on style dependant targeting procedure
function chooseTarget(style) {
    var gMH = getMonHealth;
    var gMHN = getMonHealthNumeric;
    var gNM = getNumMonsters;
    var iMD = isMonDead;
    var Mf = Math.floor;
    if (style=='twohand') {
        // CHOOSE MONSTER IN LARGEST GROUP (all groups at or larger than 5 are treated the same)
        for (var i=5;i>=1;i--) {
            var n = 0;
            for (var j=1;j<=gNM();j++) {
                j=j%gNM();
                if (!iMD(j)) {
                    n++;
                }else{
                    n=0;
                }
                if (n==i) {
                    return j-Mf((n-1)/2);
                }
            }
        }

    }
    if (style=='dual'||style=='mage'){ 
        //CHOOSE MONSTER WITH LOWEST HP
        var m = Number.MAX_VALUE;
        var x = 0;

        for (var k=1;k<=gNM();k++) {
            k=k%10;
            if (!iMD(k)) {
                if (m > gMHN(k, gMH(k))) {
                    x = k;
                    m = gMHN(k, gMH(k));
                }
            }
        }
        //console.log("target: "+x);
        return x;
    }
}

//given we want to attack something, choose how we attack it and lock that action
function bAttack(sg, t) {
    var gSH = getSelfHealth;
    var gSM = getSelfMana;
    var gNM = getNumMonsters;
    var iMD = isMonDead;
    var lM = livingMonsters;
    var Mf = Math.floor;
    var style = sg("style");
    if (style=='twohand'||style=='dual') {
        //Sword style
        attack(chooseTarget(style));
        return;
    }
    if (style=='mage') {
        //Magic
        var spellSize = 0;
        spellSize = 4-Mf(((gSM()*2.00)+(gSH()*0.175))/66);
        for (var i=4;i>=spellSize;i--) {
            var n = 0;
            for (var j=1;j<=gNM();j++) {
                if (!iMD(j)) {
                    n++;
                }else{
                    n=0;
                }
                if (n==i) {
                    //console.log("attackspell");
                    castSpell(sg("magic.spell.LIST"),getSpell(lM()),j-Mf((n-1)/2));
                    return;
                }
            }
        }
        attack(chooseTarget(style));
        return;
    }
}

function initHandler(tAS, tSAG, tSONN, tSONNAG, tSONNAGA, sg, ss){
	initDataObjects(tAS, tSAG);
	setElement(tAS, sg, ss);
	initMagic(tAS, sg);
	initItems(tAS, tSAG, sg, tSAG("item.slots", 9));
	
	tAS("init.flag", true);
}

function perRound(tAS, tSAG, tSONN, tSONNAG, tSONNAGA, sg, ss, round){
	if (sg("init.flag")) initHandler(tAS, tSAG, tSONN, tSONNAG, tSONNAGA, sg, ss);
	monsterInfo(tAS, sg, round);
	tAS("dtr.dtr", difficultyThresholdReduction(tAS, tSAG, sg, af, round, maintain));
}

//  ╔═╗╦       ┌┬┐┬ ┬┌─┐  ┌─┐┌─┐┬─┐┌┬┐  ┌┬┐┬ ┬┌─┐┌┬┐  ┬─┐┬ ┬┌┐┌┌─┐  
//  ╠═╣║  ───   │ ├─┤├┤   ├─┘├─┤├┬┘ │    │ ├─┤├─┤ │   ├┬┘│ ││││└─┐  
//  ╩ ╩╩        ┴ ┴ ┴└─┘  ┴  ┴ ┴┴└─ ┴    ┴ ┴ ┴┴ ┴ ┴   ┴└─└─┘┘└┘└─┘

function mouseHover() {
    //document.head.insertAdjacentHTML("afterBegin","<style id='const_css_img_rule'>.cw {visibility: hidden;}</style>");
    //document.head.insertAdjacentHTML("afterBegin","<style id='css_img_rule'>.cw {visibility: hidden;}, *:not(.bte)>img:not(.cw):not([src*=riddlemaster]):not([src*=arena]):not([style*=pointer]):not([src*='/v/m/']), #infopane, #togpane_log {visibility: hidden;}*:hover>img:not(.cw), #leftpane:hover *, #monsterpane:hover * {visibility: visible !important; }</style>");
	
    //===FUNCTION=IMPORTS===
    //---store.js
    var sg = store.get;
    var ss = store.set;
    //---"test" functions
    var tAS = testAndStore;
    var tSAG = testStoreAndGet;
    var tSONN = testStoreOnlyNotNull;
    var tSONNAG = testStoreOnlyNotNullAndGet;
    var tSONNAGA = testStoreOnlyNotNullAndGetArray;
    //var tSAGA = testStoreAndGetArray;
    //---thresholdMath()
    var tm = thresholdMath;
    //---allFalse();
    var af = allFalse;
    //======================
    var round = {};
	var iB = inBattle();
	var lM = livingMonsters();
	var getSelfAll = document.getElementsByClassName("cwb2");
	var getSelfHealth = getSelfAll[0].width*5/6;
	var getSelfMana = getSelfAll[1].width*5/6;
	var getSelfSpirit= getSelfAll[2].width*5/6;
	var getSelfOvercharge= getSelfAll[3].width*5/6;
	
	ss("round.new", false);
	
    if(!inBattle){
        tAS("initDataObjects.hasRun", false);
        localStorage.removeItem('round.text');
		ss("init.flag", false);
    }
	
	round = roundInfo(tAS, tSAG, tSONNAGA, sg, round, true);//>true/false-->label on/off.
	if (round.new) perRound(tAS, tSAG, tSONN, tSONNAG, tSONNAGA, sg, ss, round);
    
    var style = tSAG('style', 'mage');
	
    var DTR = sg('dtr.dtr');
    var ITEM = sg('item.ITEM');
    var ITEM_KEY = sg('item.KEY');
    var maintain = {'ITEM': sg("buff.maintain.ITEM"),
                    'BUFFS': sg("buff.maintain")[style]};
    
    //coordClickerOverlay();
    ///////////////////////////////////////////////////////////////////////
    // DEFINITIONS POINT - should be filled in to tell the ai how to act //
    /////////////////////////////////////////////////////////////////////// 

    var BUFF_MAINTAIN_MONSTERS_DEAD_THRESHOLD = tm(10, DTR, 0, 2);
    var ITEM_MAINTAIN_MONSTERS_DEAD_THRESHOLD = tm(9, DTR, 0, 2);

    var HP_ITEM_CUTOFF = 60;
    var HP_ITEM_CHECKING_MONSTERS_DEAD_THRESHOLD = tm(10, DTR, 0, 2);

    var MP_ITEM_CUTOFF = ((2.6*DTR)+44);
    //console.log("MP_ITEM_CUTOFF: "+MP_ITEM_CUTOFF);
    var MP_ITEM_CHECKING_MONSTERS_DEAD_THRESHOLD = tm(9, DTR, 0, 1);

    var SP_ITEM_CUTOFF = 68;
    var SP_ITEM_CHECKING_MONSTERS_DEAD_THRESHOLD = tm(9, DTR, 0, 3);

    var CURE_HP_CUTOFF = (2.4*DTR)+48;
    //console.log("CURE_HP_CUTOFF: "+CURE_HP_CUTOFF);

    var FOCUS_FOR_MP = true;
    var MP_FOCUS_CUTOFF = 85;
    var MP_FOCUS_OC_THRESHOLD = 10;

    /////////////////////////////////////////////////////////
    // ACTIONS POINT - wherein the ai actually does things //
    /////////////////////////////////////////////////////////

    //make sure there's no pony to ban us
    //beep if there is
    if (checkPony()) {
        var a = new Audio('http://soundbible.com/mp3/Strange%20Noise-SoundBible.com-229408508.mp3');
        a.play();
        return;
    }else{
        if ((!iB) && (location.href !== 'http://hentaiverse.org/?s=Bazaar&ss=es&filter=acloth')){
            var b = new Audio('http://soundbible.com/mp3/A-Tone-His_Self-1266414414.mp3');
            b.play();
            return;
        }
    }

    //do we need to continue?
    if (checkContinue()) {
        cont();
        return;
    }

    //manage channeling buff efficently
    //will first see if anything is missing
    //then will check if there are any maintain buffs with under 20 left & cast the one with least time
    //otherwise will cast haste
    if (iB){
        if (checkForBuff('channeling')) {
            for (var s in maintain.BUFFS) {
                var t = maintain.BUFFS[s];
                if (!(checkForBuff(t))) {
                    console.log('decided to cast ' + t);
                    castSpell(sg("magic.spell.LIST"),t,0);
                    return;
                }
            }
            for (var sINDEX in getBuffs()) {
                var tINDEX = getBuffs()[sINDEX];
                if (getBuffDuration(sINDEX) > 20){
                    console.log('decided to cast haste');
                    castSpell(sg("magic.spell.LIST"),'haste',0);
                    return;
                }else{
                    if (maintain.BUFFS.indexOf(tINDEX)!=-1) {
                        console.log('decided to cast ' + tINDEX);
                        castSpell(sg("magic.spell.LIST"),tINDEX,0);
                        return;
                    }
                }
            }
        }
    }

    //CAST CURE
    if (getSelfHealth < CURE_HP_CUTOFF) {
        //if ($("div[ID='311']").attr('style').indexOf('opacity:0.5') == -1){ 
        if (document.getElementById("311").hasAttribute("onclick")){  
            //console.log('cure off cooldown; casting');
            castSpell(sg("magic.spell.LIST"),'cure',0);
            return;
        }
        console.log('but cure still on cooldown');
    }

    //DRINK SP POTION
    if (lM <= SP_ITEM_CHECKING_MONSTERS_DEAD_THRESHOLD){
        if (getSelfSpirit < SP_ITEM_CUTOFF) {        
            if (getGem()=='spirit') {
                useGem();
                return;
            }
            console.log('decided to drink Spirit pot');
            if ($(".fd2 > div:contains('Spirit Potion')").attr('style').indexOf('#8A8A8A') == -1){
                console.log("Item #"+ITEM_KEY['Spirit Potion']+" "+ITEM[ITEM_KEY['Spirit Potion']]+" off cooldown.");
                useItem(ITEM_KEY['Spirit Potion']);
                return;
            }
        }
    }

    //DRINK HP POTION
    if (lM <= HP_ITEM_CHECKING_MONSTERS_DEAD_THRESHOLD){
        if (getSelfHealth < HP_ITEM_CUTOFF) {
            if (getGem()=='health') {
                useGem();
                return;
            }
            console.log('decided to drink Health pot');
            if ($(".fd2 > div:contains('Health Potion')").attr('style').indexOf('#8A8A8A') == -1){
                console.log("Item #"+ITEM_KEY['Health Potion']+" "+ITEM[ITEM_KEY['Health Potion']]+" off cooldown.");
                useItem(ITEM_KEY['Health Potion']);
                return;
            }
        }
    }

    //DRINK MP POTION
    if (lM <= MP_ITEM_CHECKING_MONSTERS_DEAD_THRESHOLD){
        if (getSelfMana < MP_ITEM_CUTOFF) {
            if (getGem()=='mana') {
                useGem();
                return;
            }   
            console.log('decided to drink Mana pot');
            if ($(".fd2 > div:contains('Mana Potion')").attr('style').indexOf('#8A8A8A') == -1){
                console.log("Item #"+ITEM_KEY['Mana Potion']+" "+ITEM[ITEM_KEY['Mana Potion']]+" off cooldown.");
                useItem(ITEM_KEY['Mana Potion']);
                return;
            }
        }
    }

    //check overcharge conditions
    if ((lM == 1) && (getSelfOvercharge > 10)) {
        if ((FOCUS_FOR_MP) && (getSelfMana < MP_FOCUS_CUTOFF) && (getSelfOvercharge > MP_FOCUS_OC_THRESHOLD)) {
            console.log('decided to focus');
            focus();
            return;
        }
    }

    //make sure all asked for buffs are up and running
    if (lM <= BUFF_MAINTAIN_MONSTERS_DEAD_THRESHOLD){
        for (var maintainBuffIndex in maintain.BUFFS) {
            var thisBuff = maintain.BUFFS[maintainBuffIndex];
            if (!(checkForBuff(thisBuff))) {
                if (getGem() == 'mystic') {
                    useGem();
                    return;
                }else{
                    //console.log(document.getElementById(sg("magic.spell.LIST")[thisBuff]).hasAttribute("onclick"));
                    if (document.getElementById(sg("magic.spell.LIST")[thisBuff]).hasAttribute("onclick")){
                        castSpell(sg("magic.spell.LIST"),thisBuff,0);
                        return;
                    }
                }
            }
        }
    }

    if (sg('round.total') > 10){
        //make sure all asked for long duration item effects are up and running
        if (lM <= ITEM_MAINTAIN_MONSTERS_DEAD_THRESHOLD){
            //console.log("livingMonsters: "+lM+" <= ITEM_MAINTAIN_MONSTERS_DEAD_THRESHOLD: "+ITEM_MAINTAIN_MONSTERS_DEAD_THRESHOLD);
            for (var maintainItemIndex in maintain.ITEM) {
                var thisItem = maintain.ITEM[maintainItemIndex];
                //console.log("maintain items is error. thisItem: "+thisItem+". ITEM_KEY: "+ITEM_KEY[thisItem]+". selector: div[ID='ikey_"+ITEM_KEY[thisItem]+"']");
                if (!(checkForBuff(thisItem.toLowerCase()))) {
                    if ($(".fd2:contains('"+thisItem+"') > div").attr('style').indexOf('#8A8A8A') == -1){
                        useItem(ITEM_KEY[thisItem]);
                        return;
                    }
                }
            }
        }
    }
    //attack something
    bAttack(sg);
}

////////////////////////////////////////////////////////////
// BASE FUNCTIONS - that which talks to the page directly //
////////////////////////////////////////////////////////////

//Casts spell by name - case independent! ie castSpell('cure') would cast cure
//If hostile spell, needs to target(n) whichever monster you're attacking after
function fillForm(a,b,c,d) {
    document.getElementById('battleform').children[0].value = a;
    document.getElementById('battleform').children[1].value = b;
    document.getElementById('battleform').children[2].value = c;
    document.getElementById('battleform').children[3].value = d;
    //console.log('console 0:' +a);
    //console.log('console 1:' +b);
    //console.log('console 2:' +c);
    //console.log('console 3:' +d);
    document.getElementById('battleform').submit();
}

function castSpell(LIST, spellName, target) {
    console.log("decided to cast "+spellName);
    fillForm(1,'magic',target,LIST[spellName]);
}

function buffImgNametoActualName(imgName) {
    properName=store.get("buff.BUFFNAME");
    return properName[imgName.toLowerCase()];
}

//Will try to continue after beating a round, and will cause an error if not in a battle.
//If there is a battle but it's not over, will do absolutely nothing
function cont() {
    fillForm(1,0,0,0);
}

//turns spirit stance on or off
function toggleSpirit() {
    fillForm(1,'spirit',0,0);
}

//focuses for a turn
function focus() {
    fillForm(1,'focus',0,0);
}

//defends for a turn
function defend() {
    fillForm(1,'defend',0,0);
}

//locks attack, in case something else is locked but you need to switch back to normal attack
function attack(target) {
    console.log('decided to attack #'+target);
    fillForm(1,'attack',target,0);
}

//uses the item at position n
//will waste a turn if called with a bad n
function useItem(n) {
    console.log("useitem called at slot "+n);
    fillForm(1,'items',0,n);
}

//uses whatever gem is currently in inventory
//If no gem, wastes a turn
function useGem() {
    console.log("decided to attack use gem");
    fillForm(1,'items',0,999);
}

//returns a string of whatever gem is in the inventory, in the form of "health gem" or "mystic gem", etc
function getGem() {
    try {
        return document.getElementById('ikey_p').onmouseover.toString().split("'")[1].split(' ')[0].toLowerCase();
    }catch(e){
        return 'none';
    }
}

//gets the name of the buff at position n (starts at 0) in the buff bar
function getBuffAt(n) {
    try {
        var ret = $("div.bte > img:nth-child("+(1+n)).attr('src').split('ehgt.org/v/e/')[1].split('.png')[0];
        if (ret !=+ undefined){
            //console.log("ret: "+ret);
            //console.log("processed ret: "+buffImgNametoActualName(ret));
            return buffImgNametoActualName(ret);
        }else{
            return 'none';
        }
    }catch(e) {
        return 'undefined';
    }
}

//gets the number of buffs currently in the buff bar
function getBuffLength() {
    return document.getElementById('mainpane').children[1].children[0].children.length;
}

//gets the remaining duration (as displayed by the tooltip) of the buff at the given position
function getBuffDuration(n) {
    try {
        return document.getElementById('mainpane').children[1].children[0].children[n].attributes.item(1).firstChild.data.split(',')[2].split(' ')[1].split(')')[0];
    }catch(e) {
        return 0;
    }
}

//checks if there is a pony present, via checking if the box for monsters exists
//Will also trigger if the character dies, though only after a continue()
function checkPony() {
    if (!document.getElementById('riddleform'))return false;else return true;
    if($("#riddleform").length===0){
        return false;
    }else{
        return true;
    }
}

//checks if there is a continue box ready to be pushed
//this includes continue, victory, death, etc - anything that appears in the continue box area
function checkContinue() {
    try {
        document.getElementById('ckey_continue').toString();
        return true;
    }catch(e) {
        if (e.name=='ReferenceError') {
            return false;
        }
    }
}

//gets the number of monsters - alive or dead
function getNumMonsters() {
    return document.getElementById('monsterpane').querySelectorAll('[id*="mkey_"]').length;
}

//tells if monster at n is dead or not
function isMonDead(n) {
    if (!document.querySelector('#mkey_'+(n--)+'[style*="opacity:0.3"]')) return false; else return true;
}

function getMonAll(n, type){
    //console.log("getMonAll(): type = "+type+". n = "+n+". return = "+document.getElementById("mkey_"+n).getElementsByClassName("chb2")[type].width*5/6+".");
    return document.getElementById("mkey_"+n).getElementsByClassName("chb2")[type].width*5/6;
}

//estimates monster health as a percent - ie, 88.2, 12.3, etc
function getMonHealth(n) {
    //console.log("getMonHealth() going to call getMonAll(n: "+n+", 0)"); 
    //return document.getElementById('monsterpane').children[n+1].children[2].children[0].children[0].firstElementChild.width*5/6;
    return getMonAll(n, 0);
}

//estimates monster mana as a percent - same as health
function getMonMana(n) {
    //return document.getElementById('monsterpane').children[n+1].children[2].children[1].children[0].firstElementChild.width*5/6;
    return getMonAll(n, 1);
}

//estimates monster spirit as a percent - same as health
//error if the monster doesn't have spirit
function getMonSpirit(n) {
    //return document.getElementById('monsterpane').children[n+1].children[2].children[2].children[0].firstElementChild.width*5/6;
    return getMonAll(n, 2);
}

function getSelfAll(type){
    return document.getElementsByClassName("cwb2")[type].width*5/6;
}

//gets the character's current health as a rough percent
//not the specific number, just an estimate based on the green bar
function getSelfHealth() {
    //return document.body.children[4].children[0].children[2].children[0].width*5/6;
    return getSelfAll(0);
}

//gets the character's mana, same as health
function getSelfMana() {
    //return document.body.children[4].children[0].children[4].children[0].width*5/6;
    return getSelfAll(1);
}

//gets the character's spirit, same as health
function getSelfSpirit() {
    //return document.body.children[4].children[0].children[6].children[0].width*5/6;
    return getSelfAll(2);
}
//gets the character's overcharge as a percent of 250, same as health - ie, returning 50 would mean 125%
//should be accurate to about 2%
function getSelfOvercharge() {
    //return document.body.children[4].children[0].children[8].children[0].width*5/6;
    return getSelfAll(3);
}

/////////////////////////////////////////////////////////////////////////////
// META FUNCTIONS - that which combines base functions in interesting ways //
/////////////////////////////////////////////////////////////////////////////

//returns a list of all buffs on the bar
//normalizes to all lowercase, for consistency
function getBuffs() {
    var r = [];
    for (var i = 0; i < getBuffLength(); i++) {
        r[i]=getBuffAt(i);
        //console.log(r[i]);
    }
    return r;
}

//checks if a specific buff is in the list - needs to be the exact name given by getBuffAt()
function checkForBuff(n) {
    if (getBuffs().indexOf(n.toLowerCase()) != -1) {
        //console.log("getbuff TRUE: "+n);
        return true;
    }else{
        //console.log("getbuff FALSE: "+n);
        return false;
    }
}

//gets number of dead monsters
function getNumDead(){
    return document.getElementById('monsterpane').querySelectorAll('[style*="opacity:0.3"]').length;
}

//single function call to return number of living monsters as pseudo-variable
function livingMonsters(){
    //console.log("livingMonsters: "+((getNumMonsters()*1)-(getNumDead()*1)));
    return ((getNumMonsters()*1)-(getNumDead()*1));
}

//returns approximate numeric HP value by 
function getMonHealthNumeric(n, percent){
    return percent*(0.01*store.get("monster."+n).split('HP=')[1]);
}
//if (inBattle()) mouseHover();
mouseHover();

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA OBJECT DECLARATIONS - create data objects directly into localstorage instead of making variables //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function initDataObjects(tAS, tSAG, sg){
    if (tAS('initDataObjects.hasRun', true)){
        console.log("inside initDataObjects");

        /*===TEMPLATE===
    tAS(
        //------NAME----
        'category.subcategory.(e.t.c.e.t.e.r.a).(thing)' ,{ 
        //----CONTENTS----
        a: 1, 
        b: 2, 
        c: 3
    });
    ==============*/
        //NOTE: "thing" --> OBJECT/ARRAY or variable/value

        tAS(//------NAME----
            'buff.maintain.ITEM' ,{
                //----CONTENTS----
                0: 'Spirit Draught', 
                1: 'Mana Draught', 
                2: 'Health Draught'
            });

        tAS(//------NAME----
            'buff.maintain' ,{
                //----CONTENTS----
                'mage': {0: 'spark of life',
                         1: 'protection',
                         2: 'spirit shield',
                         3: 'absorb',
                         4: 'regen',
                         5: 'shadow veil',
                         6: 'haste',
                         7: 'arcane focus'},
                'melee': {0: 'spark of life',
                          1: 'protection',
                          2: 'spirit shield',
                          4: 'regen'}
            });


        tAS(//------NAME------
            'magic.spell.NAME' ,{
                //----CONTENTS----
                fire: {a: 'flames of loki',
                       b: 'inferno',
                       c: 'fiery blast'},
                wind: {a: 'storms of njord',
                       b: 'downburst',
                       c: 'gale'},
                elec: {a: 'wrath of thor',
                       b: 'chained lightning',
                       c: 'shockblast'},
                cold: {a: 'fimbulvetr',
                       b: 'blizzard',
                       c: 'freeze'}
            });

        var base = tSAG(
            //------NAME------
            'magic.spell.size.BASE' ,{
                //----CONTENTS----
                a: 7, 
                b: 5, 
                c: 3
            });

        tAS(//------NAME------
            'magic.spell.size.SIZE' ,{
                //----CONTENTS----
                0: {a: base.a,
                    b: base.b,
                    c: base.c},
                1: {a: base.a,
                    b: base.b,
                    c: base.c + 1},
                2: {a: base.a,
                    b: base.b + 1,
                    c: base.c + 1},
                3: {a: base.a,
                    b: base.b + 1,
                    c: base.c + 2},
                4: {a: base.a + 1,
                    b: base.b + 1,
                    c: base.c + 2},
                5: {a: base.a + 2,
                    b: base.b + 1,
                    c: base.c + 2},
                6: {a: base.a + 2,
                    b: base.b + 2,
                    c: base.c + 2},
                7: {a: base.a + 3,
                    b: base.b + 2,
                    c: base.c + 2},
            });

        //$("table.cit > tbody > tr > td > div.fd4 > div").contents().filter(function(){ return this.nodeType === 3;} )[2].nodeValue

        tAS(//------NAME----
            'dtr.LIST' ,{
                //----CONTENTS----
                'difficulty': $("table.cit > tbody > tr > td > div.fd4 > div").contents().filter(function(){ return this.nodeType === 3;})[2].nodeValue,
                'DIFFICULTY_VALUE': 
                {'Normal':     5,
                 'Hard':       6,
                 'Nightmare':  7,
                 'Hell':       8,
                 'Nintendo':   8,
                 'IWBTH':      8,
                 'PFUDOR':     9
                }
            });

        tAS(//------NAME------
            'magic.spell.LIST' ,{
                //----CONTENTS----
                'fiery blast':	      111,
                'inferno': 		      112,
                'flames of loki':     113,
                'freeze':		      121,
                'blizzard':           122,
                'fimbulvetr':         123,
                'shockblast':	      131,
                'chained lightning':  132,
                'wrath of thor':      133,
                'gale':			      141,
                'downburst': 		  142,
                'storms of njords':   143,
                'smite':		      151,
                'corruption':	      161,
                'drain':		      211,
                'weaken':		      212,
                'slow':			      221,
                'sleep':		      222,
                'cure':			      311,
                'regen':		      312,
                'protection':	      411,
                'haste':		      412,
                'shadow veil':	      413,
                'absorb':		      421,
                'spark of life':      422,
                'spirit shield':      423,
                'heartseeker':        431,
                'arcane focus':       432,
                'flee':			      1001,
                'scan':			      1011,
                'great cleave':       2301,
                'rending blow':	      2302
            });

        tAS(//------NAME------
            'magic.ELEMENTS' ,{
                //----CONTENTS----
                1: 'fire',
                2: 'cold',
                3: 'elec',
                4: 'wind'
            });

        tAS(//------NAME------
            'buff.BUFFNAME' ,{
                //----CONTENTS----
                'protection':       'protection',
                'regen': 	        'regen',
                'shadowveil':       'shadow veil',
                'haste':	        'haste',
                'absorb':	        'absorb',
                'healthpot':        'health draught',
                'manapot':          'mana draught',
                'spiritpot':        'spirit draught',
                'spiritshield':     'spirit shield',
                'sparklife':        'spark of life',
                'arcanemeditation': 'arcane focus',
                'heartseeker':      'heartseeker'
            });
    }
}

/*
FLUTTERSHY: 
http://hentaiverse.org/riddlemaster.php?uid=479103&v=c98dea0f45
http://hentaiverse.org/riddlemaster.php?uid=479103&v=4d5917519f
http://hentaiverse.org/riddlemaster.php?uid=479103&v=871a4bf4d6
http://hentaiverse.org/riddlemaster.php?uid=479103&v=0861085973
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3895b7cc13
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3c04e6463c
http://hentaiverse.org/riddlemaster.php?uid=479103&v=ac59e6efef
http://hentaiverse.org/riddlemaster.php?uid=479103&v=21d97a085d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=255d38d9fc
http://hentaiverse.org/riddlemaster.php?uid=479103&v=d793cf2fc5
http://hentaiverse.org/riddlemaster.php?uid=479103&v=68930aca68
http://hentaiverse.org/riddlemaster.php?uid=479103&v=bd6b6ce42d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8ff306ad9d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=a146e63ab1
http://hentaiverse.org/riddlemaster.php?uid=479103&v=39c13fcb05
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8379090473
http://hentaiverse.org/riddlemaster.php?uid=479103&v=7bb1f184b8
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8c73948368
http://hentaiverse.org/riddlemaster.php?uid=479103&v=fa2e4103eb
http://hentaiverse.org/riddlemaster.php?uid=479103&v=dac466f266
http://hentaiverse.org/riddlemaster.php?uid=479103&v=149e6f6afb
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8eb613b95a
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b09e78dd60
http://hentaiverse.org/riddlemaster.php?uid=479103&v=83f14d3f04
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b651ebb44f
http://hentaiverse.org/riddlemaster.php?uid=479103&v=bc4309e169
http://hentaiverse.org/riddlemaster.php?uid=479103&v=afb6043d05
http://hentaiverse.org/riddlemaster.php?uid=479103&v=ea69404335
http://hentaiverse.org/riddlemaster.php?uid=479103&v=88d2f18a66
http://hentaiverse.org/riddlemaster.php?uid=479103&v=2ffdddc599
http://hentaiverse.org/riddlemaster.php?uid=479103&v=0f8af37e80
http://hentaiverse.org/riddlemaster.php?uid=479103&v=f3c9c15439
http://hentaiverse.org/riddlemaster.php?uid=479103&v=25746dd843

PINKYPIE: 
http://hentaiverse.org/riddlemaster.php?uid=479103&v=59049b0da2
http://hentaiverse.org/riddlemaster.php?uid=479103&v=dd38fe320b
http://hentaiverse.org/riddlemaster.php?uid=479103&v=a5733d6c7b
http://hentaiverse.org/riddlemaster.php?uid=479103&v=4bbdef3476
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8d740b077e
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3af44d224c
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8b1dc36923
http://hentaiverse.org/riddlemaster.php?uid=479103&v=19222045dc
http://hentaiverse.org/riddlemaster.php?uid=479103&v=2e9e4032bf
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b124f63615
http://hentaiverse.org/riddlemaster.php?uid=479103&v=11eafc8054
http://hentaiverse.org/riddlemaster.php?uid=479103&v=a453768188
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3cbcaaf996
http://hentaiverse.org/riddlemaster.php?uid=479103&v=f492fc0e17
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b244fd3fb7
http://hentaiverse.org/riddlemaster.php?uid=479103&v=6cc2ed5a94
http://hentaiverse.org/riddlemaster.php?uid=479103&v=d997f3c6f9
http://hentaiverse.org/riddlemaster.php?uid=479103&v=88fa36aefa
http://hentaiverse.org/riddlemaster.php?uid=479103&v=26bd161ac1
http://hentaiverse.org/riddlemaster.php?uid=479103&v=30e6a49005
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8c94fb68e5
http://hentaiverse.org/riddlemaster.php?uid=479103&v=9fb395d0a3

RAINBOWDASH: 
http://hentaiverse.org/riddlemaster.php?uid=479103&v=2d4d17042e
http://hentaiverse.org/riddlemaster.php?uid=479103&v=ce74ae4e06
http://hentaiverse.org/riddlemaster.php?uid=479103&v=50c432115d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=f066e9e9b0
http://hentaiverse.org/riddlemaster.php?uid=479103&v=220c6f5c54
http://hentaiverse.org/riddlemaster.php?uid=479103&v=d0b82f1330
http://hentaiverse.org/riddlemaster.php?uid=479103&v=827f23909a
http://hentaiverse.org/riddlemaster.php?uid=479103&v=613e0beef4
http://hentaiverse.org/riddlemaster.php?uid=479103&v=54c54f9848
http://hentaiverse.org/riddlemaster.php?uid=479103&v=57d8008a4c
http://hentaiverse.org/riddlemaster.php?uid=479103&v=4e9a48ef05
http://hentaiverse.org/riddlemaster.php?uid=479103&v=a3b8479c82
http://hentaiverse.org/riddlemaster.php?uid=479103&v=69bfb8be44
http://hentaiverse.org/riddlemaster.php?uid=479103&v=6cd4efa1dd
http://hentaiverse.org/riddlemaster.php?uid=479103&v=4b7cefb1d1
http://hentaiverse.org/riddlemaster.php?uid=479103&v=0cfbb1909d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=460635d923
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8ac1684a65
http://hentaiverse.org/riddlemaster.php?uid=479103&v=7b8cacba9c
http://hentaiverse.org/riddlemaster.php?uid=479103&v=e7580c50d0
http://hentaiverse.org/riddlemaster.php?uid=479103&v=86aedb94f1
http://hentaiverse.org/riddlemaster.php?uid=479103&v=66f79b68fe
http://hentaiverse.org/riddlemaster.php?uid=479103&v=393b5e65b2
http://hentaiverse.org/riddlemaster.php?uid=479103&v=32e93b179b
http://hentaiverse.org/riddlemaster.php?uid=479103&v=0ed7123b45
http://hentaiverse.org/riddlemaster.php?uid=479103&v=0bf6f17b11
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3937bf4020

RARITY: 
http://hentaiverse.org/riddlemaster.php?uid=479103&v=388c2245b1
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b649973012
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3449fc0840
http://hentaiverse.org/riddlemaster.php?uid=479103&v=9a51db4567
http://hentaiverse.org/riddlemaster.php?uid=479103&v=a1e6657654
http://hentaiverse.org/riddlemaster.php?uid=479103&v=ecdf9ac173
http://hentaiverse.org/riddlemaster.php?uid=479103&v=f3efbc3515
http://hentaiverse.org/riddlemaster.php?uid=479103&v=6757ced97d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=064b025a69
http://hentaiverse.org/riddlemaster.php?uid=479103&v=87be2e2fe7
http://hentaiverse.org/riddlemaster.php?uid=479103&v=0110cc2759
http://hentaiverse.org/riddlemaster.php?uid=479103&v=18e858ed3d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=eaf8a522e1
http://hentaiverse.org/riddlemaster.php?uid=479103&v=dc428bdf5a
http://hentaiverse.org/riddlemaster.php?uid=479103&v=83418ff9b0
http://hentaiverse.org/riddlemaster.php?uid=479103&v=7cca01a4ba
http://hentaiverse.org/riddlemaster.php?uid=479103&v=84c34d3e0e
http://hentaiverse.org/riddlemaster.php?uid=479103&v=aabcbf30f7
http://hentaiverse.org/riddlemaster.php?uid=479103&v=d8eb1ff79d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=baffdb6b75
http://hentaiverse.org/riddlemaster.php?uid=479103&v=20a73fe344
http://hentaiverse.org/riddlemaster.php?uid=479103&v=11cc9b1a3c
http://hentaiverse.org/riddlemaster.php?uid=479103&v=8e2f1ec230
http://hentaiverse.org/riddlemaster.php?uid=479103&v=72395ab1c6

APPLEJACK: 
http://hentaiverse.org/riddlemaster.php?uid=479103&v=126437ee44 
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3e82d0ae06
http://hentaiverse.org/riddlemaster.php?uid=479103&v=618155720d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b947d863a7
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3f33364634
http://hentaiverse.org/riddlemaster.php?uid=479103&v=03b90e5d3b
http://hentaiverse.org/riddlemaster.php?uid=479103&v=cac0b93317
http://hentaiverse.org/riddlemaster.php?uid=479103&v=f9d2aa01e8
http://hentaiverse.org/riddlemaster.php?uid=479103&v=dabf4c7176
http://hentaiverse.org/riddlemaster.php?uid=479103&v=6729e6aa4d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=c92ec81796
http://hentaiverse.org/riddlemaster.php?uid=479103&v=60ab8ca1b3
http://hentaiverse.org/riddlemaster.php?uid=479103&v=96db6ad079
http://hentaiverse.org/riddlemaster.php?uid=479103&v=89d61a9b0c
http://hentaiverse.org/riddlemaster.php?uid=479103&v=70a9d4a5a7
http://hentaiverse.org/riddlemaster.php?uid=479103&v=90f2428f92
http://hentaiverse.org/riddlemaster.php?uid=479103&v=7ed848b641
http://hentaiverse.org/riddlemaster.php?uid=479103&v=1bf7eefb81

TWILIGHT:
http://hentaiverse.org/riddlemaster.php?uid=479103&v=1583034779
http://hentaiverse.org/riddlemaster.php?uid=479103&v=058da05398
http://hentaiverse.org/riddlemaster.php?uid=479103&v=f975e57f11
http://hentaiverse.org/riddlemaster.php?uid=479103&v=3eba80b005
http://hentaiverse.org/riddlemaster.php?uid=479103&v=cc59fb182f
http://hentaiverse.org/riddlemaster.php?uid=479103&v=eb16f882c6
http://hentaiverse.org/riddlemaster.php?uid=479103&v=31f27a5ced
http://hentaiverse.org/riddlemaster.php?uid=479103&v=7dec24ef7e
http://hentaiverse.org/riddlemaster.php?uid=479103&v=213be14732
http://hentaiverse.org/riddlemaster.php?uid=479103&v=da23d67a2d
http://hentaiverse.org/riddlemaster.php?uid=479103&v=5445413208
http://hentaiverse.org/riddlemaster.php?uid=479103&v=d85daace3f
http://hentaiverse.org/riddlemaster.php?uid=479103&v=45fec0b8ca
http://hentaiverse.org/riddlemaster.php?uid=479103&v=e4597ff78a
http://hentaiverse.org/riddlemaster.php?uid=479103&v=0539d84119
http://hentaiverse.org/riddlemaster.php?uid=479103&v=f2f555563a
http://hentaiverse.org/riddlemaster.php?uid=479103&v=e2473ca2ae
http://hentaiverse.org/riddlemaster.php?uid=479103&v=53cb0c2541
http://hentaiverse.org/riddlemaster.php?uid=479103&v=139e7fe513
http://hentaiverse.org/riddlemaster.php?uid=479103&v=2dfac134ca
http://hentaiverse.org/riddlemaster.php?uid=479103&v=286a2643c5
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b52bfe66f8
http://hentaiverse.org/riddlemaster.php?uid=479103&v=83e6a44b25
http://hentaiverse.org/riddlemaster.php?uid=479103&v=219d9adee4
http://hentaiverse.org/riddlemaster.php?uid=479103&v=b6be8f1f76
*/


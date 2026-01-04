// ==UserScript==
// @name			HWHhuntFragmentExt
// @name:en			HWHhuntFragmentExt
// @name:ru			HWHhuntFragmentExt
// @namespace		HWHhuntFragmentExt
// @version			0.131
// @description		HWH extension to farm item fragments
// @description:en	HWH extension to farm item fragments
// @description:ru	Расширение HWH для добычи фрагментов
// @author			dimaka1256
// @license 		Copyright dimaka1256
// @homepage		none
// @icon			https://zingery.ru/scripts/VaultBoyIco16.ico
// @icon64			https://zingery.ru/scripts/VaultBoyIco64.png
// @match			https://www.hero-wars.com/*
// @match			https://apps-1701433570146040.apps.fbsbx.com/*
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/537105/HWHhuntFragmentExt.user.js
// @updateURL https://update.greasyfork.org/scripts/537105/HWHhuntFragmentExt.meta.js
// ==/UserScript==

(function () {

    if (!this.HWHClasses) {
		console.log('%cObject for extension not found', 'color: red');
		return;
	}

	console.log('%cStart Extension ' + GM_info.script.name + ', v' + GM_info.script.version + ' by ' + GM_info.script.author, 'color: red');
	const { addExtentionName } = HWHFuncs;
	addExtentionName(GM_info.script.name, GM_info.script.version, GM_info.script.author);

	const {
		setProgress,
		hideProgress,
		getSaveVal,
		setSaveVal,
		popup,
        I18N,
		Events,
	} = HWHFuncs;

Events.on('startGame', (r) => {
    const style = document.createElement('style');
    style.innerText = `.scriptMenu_dmkMissionButton > .PopUp_btnPlate {display: unset; height: unset;}`;
    document.head.appendChild(style);
});

let {buttons,i18nLangData} = HWHData;

let ruLang ={
    FRAGMENT_HUNT: 'Слить энку',
    FRAGMENT_HUNT_TITLE: 'Добывать фрагменты шмоток/рецептов',
	FRAGMENT_HUNT_SETUP: '⚙️',
    FRAGMENT_HUNT_SETUP_TITLE: 'Выбор фрагмента/миссии',
	FRAGMENT_HUNT_ENERGY: '⚡️',
    FRAGMENT_HUNT_FR: '🧩',
    FRAGMENT_HUNT_MISSION: 'миссия',
	FRAGMENT_HUNT_WORLD: 'Глава',
	FRAGMENT_HUNT_SPENT: 'Потратили ',
    FRAGMENT_HUNT_GOTFRAGMENTS: ', получили такой лут:',
    FRAGMENT_HUNT_PCS: 'шт',
    FRAGMENT_HUNT_WEHUNT: 'Добываем предметы',
	FRAGMENT_HUNT_WERAID: 'Рейдим миссию',
    FRAGMENT_HUNT_ENOUGH1: ', хватит на ',
    FRAGMENT_HUNT_ENOUGH2: ' рейдов',
    FRAGMENT_HUNT_CHANGE: 'Выбрать',
    FRAGMENT_HUNT_PARTS1: 'Фиол шмот',
    FRAGMENT_HUNT_PARTS2: 'Фиол свитки А-О',
    FRAGMENT_HUNT_PARTS3: 'Фиол свитки П-Я',
    FRAGMENT_HUNT_PARTS4: 'Жёлтый шмот',
    FRAGMENT_HUNT_PARTS5: 'Жёлтые свитки А-К',
    FRAGMENT_HUNT_PARTS6: 'Жёлтые свитки Л-Я',
    FRAGMENT_HUNT_PARTS7: 'Красный шмот',
    FRAGMENT_HUNT_PARTS8: 'Красные свитки',
    FRAGMENT_HUNT_CHOOSEPART: 'Какую категорию шмотки ищём?',
    FRAGMENT_HUNT_CHOOSEITEM: 'Какую шмотку ищём?',
    FRAGMENT_HUNT_CHOOSEMISSION: 'В какой миссии? (см. ещё дроп)',
	FRAGMENT_HUNT_NOTENOUGH: 'Недостаточно энергии',
	FRAGMENT_HUNT_NOMISSION: 'Не выбрана миссия, нечего добывать',
	FRAGMENT_HUNT_DOALL: 'Слить энку на миссию',
	FRAGMENT_HUNT_NOVIP: 'Сорри, без VIP1 не работает',
	FRAGMENT_HUNT_SMALLVIP: 'Без VIP5 бьёт одиночными рейдами',
	FRAGMENT_HUNT_BYTEN: 'Бить по 10 миссий вместо одной',
	FRAGMENT_HUNT_NOLOOT: 'Ни-че-го!',
	FRAGMENT_HUNT_CLANENERGY: 'Забирать 200 энки из ежедневок клана',
	//FRAGMENT_HUNT_BUYSTAMINA: 'Покупать 240 энки ЗА 100 ИЗЮМА',
	FRAGMENT_HUNT_BUYSTAMINA: 'Покупать 240 энки <span style="color:red;"> за 100 изюма</span>',
	FRAGMENT_HUNT_USESMTH: 'Использовать энергию из предметов?',
	FRAGMENT_HUNT_LETTER: 'Письмо из почты',
	FRAGMENT_HUNT_SENDCALLS: 'Работаем: ',
}
let enLang ={
    FRAGMENT_HUNT: 'Spend Stamina',
    FRAGMENT_HUNT_TITLE: 'Hunt for Item/Scroll fragment',
	FRAGMENT_HUNT_SETUP: '⚙️',
    FRAGMENT_HUNT_SETUP_TITLE: 'Choose fragment/mission',
	FRAGMENT_HUNT_ENERGY: '⚡️',
	FRAGMENT_HUNT_SPENT: 'Spent ',
    FRAGMENT_HUNT_FR: '🧩',
    FRAGMENT_HUNT_MISSION: 'mission',
	FRAGMENT_HUNT_WORLD: 'World',
    FRAGMENT_HUNT_GOTFRAGMENTS: ', got this loot:',
    FRAGMENT_HUNT_PCS: 'pcs',
    FRAGMENT_HUNT_WEHUNT: 'We hunt for items',
	FRAGMENT_HUNT_WERAID: 'We raid mission',
    FRAGMENT_HUNT_ENOUGH1: ', enough for ',
    FRAGMENT_HUNT_ENOUGH2: ' raids',
    FRAGMENT_HUNT_CHANGE: 'Choose',
    FRAGMENT_HUNT_PARTS1: 'Purple gear',
    FRAGMENT_HUNT_PARTS2: 'Purple scrolls 1',
    FRAGMENT_HUNT_PARTS3: 'Purple scrolls 2',
    FRAGMENT_HUNT_PARTS4: 'Yellow gear',
    FRAGMENT_HUNT_PARTS5: 'Yellow scrolls 1',
    FRAGMENT_HUNT_PARTS6: 'Yellow scrolls 2',
    FRAGMENT_HUNT_PARTS7: 'Red gear',
    FRAGMENT_HUNT_PARTS8: 'Red scrolls',
    FRAGMENT_HUNT_CHOOSEPART: 'Choose fragment category:',
    FRAGMENT_HUNT_CHOOSEITEM: 'Choose fragment:',
    FRAGMENT_HUNT_CHOOSEMISSION: 'Choose mission(look at other drop)',
	FRAGMENT_HUNT_NOTENOUGH: 'Not enough stamina',
	FRAGMENT_HUNT_NOMISSION: 'Mission not chosen',
	FRAGMENT_HUNT_DOALL: 'Consume stamina to a mission',
	FRAGMENT_HUNT_NOVIP: 'This requires at least VIP1 to run',
	FRAGMENT_HUNT_SMALLVIP: 'Only single raids without VIP5',
	FRAGMENT_HUNT_BYTEN: 'Use x10 raids',
	FRAGMENT_HUNT_NOLOOT: 'Nothing',
	FRAGMENT_HUNT_CLANENERGY: 'Collect 200 stamina from clan dailies',
	//FRAGMENT_HUNT_BUYSTAMINA: 'Buy 240 stamina FOR 100 EMERALD',
	FRAGMENT_HUNT_BUYSTAMINA: 'Buy 240 stamina <span style="color:red;"> for 100 emerald</span>',
	FRAGMENT_HUNT_USESMTH: 'Get energy from items?',
	FRAGMENT_HUNT_LETTER: 'Letter from mail',
	FRAGMENT_HUNT_SENDCALLS: 'Working: ',
}
Object.assign(i18nLangData.ru, ruLang)
Object.assign(i18nLangData.en, enLang)
this.HWHData.i18nLangData = i18nLangData;

const fragmentHuntButton = {
    fragmentHuntButton: {
		isCombine: true,
		combineList: [
			{
				get name() { return I18N('FRAGMENT_HUNT'); }, 
				get title() { return I18N('FRAGMENT_HUNT_TITLE'); },
        		onClick: gohuntFragment,
				hide: false,
				color: 'red'
			},
			{
        		get name() { return I18N('FRAGMENT_HUNT_SETUP'); }, 
				get title() { return I18N('FRAGMENT_HUNT_SETUP_TITLE'); },
        		onClick: setuphuntFragment,
				hide: false,
				color: 'red'
			},
		]
}}

Object.assign(buttons,fragmentHuntButton)
this.HWHData.buttons = buttons;


function setuphuntFragment() {
		let fragment= new huntFragment();
		fragment.setup();
}

function gohuntFragment() {
		let fragment= new huntFragment();
		fragment.start();
}

//добавить галочку в "сделать всё"
const task = {
			name: 'gohuntFragment',
			label: I18N('FRAGMENT_HUNT_DOALL'),
			checked: false
		}
const functions2 = {
		gohuntFragment
}

const {doYourBest} = HWHClasses;
const doIt = new doYourBest();
	let myfuncList=doIt.funcList
	myfuncList.splice (-3,0,task);
	let myfunctions = doIt.functions
	Object.assign(myfunctions, functions2)

	class extdoYourBest extends doYourBest {
		funcList = myfuncList
		functions = myfunctions
	}
this.HWHClasses.doYourBest = extdoYourBest;


class huntFragment {

	inventoryGet = []
	droptable = []
	stamina = 0
	staminaboughtToday = 0
    raids = 0
    missionID = 0
    energyNeeded = 0
	vipLevel = 0
	raidByTen = false
	collectClan = false
	buyStamina = false


missionEnergy (id) {
		if (id == 0) {return 999999};
        if (id > 145) {return 10};
	    if (id  < 86) {return 6};
		return 8
}

isWithinRange(value, min, max) {
  return value >= min && value <= max;
}

generateArray(start, size) {
  return Array.from({length: size}, (_, index) => index + start);
}

getType(id){
	let type = "oops"
	if (this.isWithinRange (id, 21, 55) || this.isWithinRange (id, 56, 99) || this.isWithinRange (id, 167, 178) || this.isWithinRange (id, 221, 232)) {type="Gear"}
	if (this.isWithinRange (id, 141, 166) || this.isWithinRange (id, 190, 220) || this.isWithinRange (id, 244, 254)) {type="Scroll"}
	return type
}

getColor(id){
    if (this.isWithinRange (id, 21, 55)) {return "green"}
    if (this.isWithinRange (id, 141, 145)) {return "green"}
    if (this.isWithinRange (id, 56, 90)) {return "blue"}
	if (this.isWithinRange (id, 91, 166)) {return "violet"}
	if (this.isWithinRange (id, 167, 220)) {return "gold"}
	if (this.isWithinRange (id, 221, 254)) {return "red"}
	console.log ("getColor oops", id); return "white"
}

fragmentsNeeded(id){
    if (this.isWithinRange (id, 91, 98)) {return 20}
    if (this.isWithinRange (id, 152, 156)) {return 50}
    if (this.isWithinRange (id, 157, 166)) {return 20}
	if (this.isWithinRange (id, 167, 206)) {return 80}
	if (this.isWithinRange (id, 214, 220)) {return 150}
	if (this.isWithinRange (id, 221, 254)) {return 200}
	console.log ("fragmentsNeeded oops", id); return 0
}


getName(id,white){
	//this.updatemyData() //не дёргать инвентарь каждый раз!!!
	let itemAvailable = 0
	let fullitemAvailable = 0;
	switch (this.getType(id)) {
	 case "Gear": {
		itemAvailable = this.inventoryGet.fragmentGear[id] ?? 0;
		fullitemAvailable = this.inventoryGet.gear[id] ?? 0; break;
	}
	 case "Scroll": {
		itemAvailable = this.inventoryGet.fragmentScroll[id] ?? 0;
		fullitemAvailable = this.inventoryGet.scroll[id] ?? 0; break;
	}
	}
	let haveone = 0
	let haveonecolor = 'lightpink'
	//if (fullitemAvailable !=0 || (Math.floor((itemAvailable / this.fragmentsNeeded(id))) > 0)) {haveone = true}
	haveone = fullitemAvailable + Math.floor((itemAvailable / this.fragmentsNeeded(id)))

	if (haveone > 0) {haveonecolor='white'}
	if (haveone > 1) {haveonecolor='PaleGreen'}
	if (haveone > 3) {haveonecolor='SpringGreen'}

	let color = this.getColor(id)
		if (!!white) {color='white'}
	let name = cheats.translate(`LIB_${(this.getType(id)).toUpperCase()}_NAME_${id}`);
	let words = name.split(" ")
	for (let i in words) {if (words[i].length > 8){name=name.replace(words[i],(words[i]).substring(0,5)+".")}}
	name = name.replace(" - Рецепт","-р"); 
	name = name.replace(", уровень ","-"); 
	name = name.replace(" уровень ","-");//эти сокращения локалить впадлу, совсем
	let out =""
    //out+=id //если нужен ид шмотки
	out+=' <span style="color:'+color+';">'+name+'</span> ('
	//if (haveone) 
		{out+='<span style="color:'+haveonecolor+'">'}
	out+=fullitemAvailable+'+'+itemAvailable+"/"+this.fragmentsNeeded(id)+I18N('FRAGMENT_HUNT_FR')
	//if (haveone) 
		{out+='</span>'}
	out+=')';
	return out
}

generateitembuttons(itemids,color) {
	//await this.updatemyData()
	const buttons = [];
	for (let itemid in itemids) {
		let gearID = itemids[itemid]
		let name = this.getName(gearID,true);
		buttons.push({
					msg:  name,
					result: itemids[itemid],
					get title() { return name },
					color: color,
				});
	}
	buttons.push({msg: I18N('BTN_CANCEL'), result: false, isCancel: true})
	//buttons.push({result: false, isCancel: true})
	return buttons
}

generatemissionbuttons(missions, itemid) {
	//await this.updatemyData()
	const buttons = [];
	for (let mission in missions) {
		let missionID = missions[mission]
		let thismission = this.droptable.filter(m=>m.id===missionID)[0]
		let otheritems = thismission.drop.filter(d=>d != itemid) 
		let thisitem = thismission.drop2.filter(d=>d.id == itemid)
		//console.log("thisitem",thisitem)
		let name = "["+thisitem[0].chance+"%] "+I18N('FRAGMENT_HUNT_WORLD')+" "+thismission.world+" "+I18N('FRAGMENT_HUNT_MISSION')+" "+thismission.index+"   "+this.missionEnergy(thismission.id)+I18N('FRAGMENT_HUNT_ENERGY')+"<br>"
		for(let i in otheritems) {
			if (this.getType(otheritems[i]) === "oops"){continue;};
			let otheritem = thismission.drop2.filter(d=>d.id == otheritems[i])
			name+=this.getName(otheritems[i])+'['+otheritem[0].chance+'%]'+"<br>";
			} 
		buttons.push({
					msg:  name,
					result: missionID,
					get title() { return name },
					color: 'black',
					classes: ['scriptMenu_dmkMissionButton']
				});
	}
	buttons.push({msg: I18N('BTN_CANCEL'), result: false, isCancel: true})
	//buttons.push({result: false, isCancel: true})
	return buttons
}

async updatemyData(){
		let calls = [{
			name: "userGetInfo",
			args: {},
			ident: "userGetInfo"
		},{
			name: "inventoryGet",
			args: {},
			ident: "inventoryGet"
		}];
		let result = await Send(JSON.stringify({ calls }));
		let infos = result.results;
		this.stamina = (infos[0].result.response.refillable.find(n => n.id == 1)).amount;
		this.staminaboughtToday = (infos[0].result.response.refillable.find(n => n.id == 1)).boughtToday;
		this.inventoryGet = infos[1].result.response;

	    this.energyNeeded = this.missionEnergy(this.missionID)

	let currentVipPoints = infos[0].result.response.vipPoints;
	const goldTicket = !!this.inventoryGet.consumable[151];
	//const goldTicket = false
	this.vipLevel = 0
	if (currentVipPoints >9 ) {this.vipLevel = 1}
	if (currentVipPoints >999 || goldTicket) {this.vipLevel = 5}
		return "ok"
}







async makeMission(mission,count,refill){
	this.raidByTen = getSaveVal('huntFragmentByTen', false)
	//console.log ("byten",this.raidByTen,count)
	if (this.raidByTen) {count =  Math.floor(count/10)*10;}
	//count = count +2 //отлад-очка

	//console.log("makeMiss refill",refill)
	if (count == 0) {
		if (!!refill){
			//если true - вызвано из окна setup
			const bottles = this.inventoryGet.consumable[17] ?? 0;
			const platbox = this.inventoryGet.consumable[148] ?? 0;

			const mailGetAll = await Caller.send('mailGetAll');
			const letters = mailGetAll?.letters || [];
			const niceletters = [];

			for (let l in letters) {
				//console.log("letter",l,letters[l])
				const stamina = letters[l].reward?.stamina ? letters[l].reward.stamina : 0
				if (stamina != 0 && Object.values(letters[l].reward).length == 1) {
							let tmp = {
								id: letters[l].id,
								stamina:letters[l].reward.stamina
								}
							niceletters.push(tmp)
				}
			}
			console.log ("niceletters",niceletters)
			const letterscount = niceletters.length
			const letterstamina = niceletters[0].stamina
			const letterid = niceletters[0].id


			const message = I18N('FRAGMENT_HUNT_NOTENOUGH')+".<br> "+I18N('FRAGMENT_HUNT_USESMTH')
			let buttons=[];
			buttons.push({
					msg: I18N('FRAGMENT_HUNT_ENERGY')+'200'+' - '+cheats.translate('LIB_CONSUMABLE_NAME_17')+"("+bottles+")",
					result: 1,
					get title() { return "test" },
					color: 'blue'
				});
			buttons.push({
					msg: I18N('FRAGMENT_HUNT_ENERGY')+'250'+' - '+cheats.translate('LIB_CONSUMABLE_NAME_148')+"("+platbox+")",
					result: 2,
					get title() { return "test" },
					color: 'gold'
				});
			buttons.push({
					msg: I18N('FRAGMENT_HUNT_ENERGY')+letterstamina+' - '+I18N('FRAGMENT_HUNT_LETTER')+"("+letterscount+")",
					result: 3,
					get title() { return "test" },
					color: 'graphite'
				});
			buttons.push({msg: I18N('BTN_CANCEL'), result: false, isCancel: true})

			const useitem = await popup.confirm(message,buttons);
			console.log("useitem",useitem)
			if (!useitem) {return}
			switch (useitem) {
				case 1: {
					let calls = []
					calls.push({name: "consumableUseStamina",args: {amount: 1, libId: 17},ident: "group_1_body"})
					await Send({ calls })
					break
				}
				case 2: {
					console.log ("тут будем вскрывать шкутулки")
					for (let count = platbox; count > 0; count--) {
						const response = await Send('{"calls":[{"name":"consumableUseLootBox","args":{"libId":148,"amount":1},"ident":"body"}]}').then(
						(e) => e.results[0].result.response);
						const result = Object.values(response).pop();
						//console.log ("вскрываем шкутулку")
						if ('stamina' in result) {
							console.log("есть энка! заюзано шкутулок",platbox-count);
							break}
						break
					}
					//setProgress(I18N('BOXES_OVER'), true);
				}
				case 3: {
					//console.log("Вскрываем письмецо",letterid)
					const calls = [{ name: "mailFarm", args: { letterIds: [letterid] }, ident: "body" }];
					const result = await Send(JSON.stringify({ calls }));
					//console.log("получилось",result)
				}
			}
			this.start(); //получили энергию каким-то образом, жрём
			return;
			//
			}
			else {
				setProgress(I18N('FRAGMENT_HUNT_NOTENOUGH'),true); return 0;
			}
		}	
	let nrg = this.energyNeeded*count;
	let calls = []

			switch (this.vipLevel){
			case 5: {calls.push({name: "missionRaid",args: {id: mission.id,times: (count)},ident: "body"}); break;}
			case 1: {
					for (let i = 0; i < count; i++)
					{
						let idnt = "missionRaid_"+i
						calls.push({name: "missionRaid",args: {id: mission.id,times: 1},ident: idnt})
					}
					
				}
			}
			/*let result = await Send({ calls })
			console.log ("result",result)
			if (result?.error) {
					popup.confirm(result.error.description)
					return false;
				}
					*/

			
			//20251126 - GramKhan
   		//let result = await Send({ calls })
    	// helper: invia array di calls in chunk e concatena i risultati
    const sendInChunks = async (allCalls, chunkSize = 20) => {
        const combined = { results: [] };
        for (let i = 0; i < allCalls.length; i += chunkSize) {
			setProgress (I18N('FRAGMENT_HUNT_SENDCALLS')+(i + 1)+"/"+allCalls.length)
            const chunk = allCalls.slice(i, i + chunkSize);
            // Send normalmente riceve un oggetto/JSON string; uniformiamo con JSON.stringify
            let res = await Send(JSON.stringify({ calls: chunk }));

			if (res?.error) {
					popup.confirm(result.error.description)
					return false;
				}

            // in alcuni environ res può essere direttamente l'oggetto, in altri una promise risolta con .results
            if (res && res.results) {
                combined.results.push(...res.results);
            } else {
                // fallback: se l'API restituisce altro, prova a usare res
                combined.results.push(res);
            }
            // piccolo delay opzionale per evitare rate-limit aggressivi
            await new Promise(r => setTimeout(r, 100)); // 100 ms
        }
        return combined;
    };

    // invia i calls (se ce ne sono)
    let result = { results: [] };
    if (calls.length > 0) {
        result = await sendInChunks(calls, 20);
    } else {
        // nessun call da inviare: ritorna
        setProgress(I18N('FRAGMENT_HUNT_NOTENOUGH'));
        return;
    }


            //console.log(result)
			let loot2 = []
			for (let j in result.results)
			{
				let loot = result.results[j].result.response
				for (let i in loot){
					if (!!loot[i].fragmentScroll) {loot2.push(loot[i].fragmentScroll)}
					if (!!loot[i].fragmentGear) {loot2.push(loot[i].fragmentGear)}
				}
			}
				let loot3=[]
                //console.log("loot2",loot2)
				for (let i in loot2) {
                    for (let j in Object.keys(loot2[i])) {loot3.push(Object.keys(loot2[i])[j])}                    
			}
			await this.updatemyData()
            //console.log("loot3",loot3)
			let str = I18N('FRAGMENT_HUNT_SPENT')+nrg+I18N('FRAGMENT_HUNT_ENERGY')+ I18N('FRAGMENT_HUNT_GOTFRAGMENTS')+"<br>"
			let usedids = []
			let loot4=[]
			for (let i in loot3) {
				if (!usedids.includes(loot3[i])){loot4.push({id:loot3[i],qty:1}); usedids.push(loot3[i])}
				else {(loot4.find(e => e.id== loot3[i])).qty++}
			}
			for (let i in loot4){
				str+=this.getName(loot4[i].id)+": "+loot4[i].qty+ I18N('FRAGMENT_HUNT_PCS')+"<br>"
			}
			console.log("loot4count",loot4.length)
			if (loot4.length == 0) {str+=I18N('FRAGMENT_HUNT_NOLOOT')}
			setProgress(str,false,hideProgress)
}

updateDroptable(){
  const dropTable2 = ((types = ['gear', 'fragmentGear', 'scroll', 'fragmentScroll']) => {
  return Object.values(lib.data.mission).map(e => {
  const lastWave = e.normalMode?.waves?.at(-1);
  const lastEnemy = lastWave?.enemies?.at(-1);
  let dropList = lastEnemy?.drop ?? [];
  let heromissions = []
  for(const i of dropList) {
	const type = Object.keys(i.reward)[0]
	if (type == 'fragmentHero') {
		//console.log('heromission',e.id); 
		heromissions.push(e.id)
	}
  }
  const drop = [];
  const drop2 = [];
  for(const d of dropList) {
    const type = Object.keys(d.reward).pop()
    if (d.chance && types.includes(type) && !(heromissions.includes(e.id))) {
      const id = Object.keys(d.reward[type]).pop()
      if (id>90) {
		drop.push(+id)
		let dd = {
			id: id,
			chance:d.chance
			}
		drop2.push(dd)
	}
    }
  }
  return {id: e.id, world: e.world, index: e.index, drop, drop2}
}).filter(n => n.drop.length)
})()
//console.log("dropTable2",dropTable2)
this.droptable = dropTable2
}

async start(refill) {
	this.updateDroptable()
	this.collectClan = getSaveVal('huntFragmentCollectClan', false)
	if (this.collectClan) {
		//console.log ('вот тут будем собирать энку с клановых ежедневок')

		const questGetAll = await Caller.send(['questGetAll']);
		const questsFarm = questGetAll.filter((e) => e.state == 2);
		const staminaAvail = questsFarm.filter((e) => e.id == 20010002);
		//console.log("staminaAvail",staminaAvail)
		if (staminaAvail.length != 0){
			//console.log("хватаем 200 клановой энки")
		await Caller.send({
				name: 'quest_questsFarm',
				args: {
					questIds: [20010002]
				},
			});} //else console.log ('200 энки уже взято, хватит')
	}
	this.buyStamina = getSaveVal('huntFragmentBuyStamina', false)
	let toBuy = 0
	if (this.buyStamina){
		await this.updatemyData()
		toBuy = 2 - this.staminaboughtToday
		if (toBuy > 0) {
			console.log("Энки за изюм сегодня куплено",this.staminaboughtToday,"купим ещё",toBuy)
			for (let i = 0; i < toBuy; i++) {await Caller.send('refillableBuyStamina')}
		}
	}
	this.missionID = getSaveVal('huntFragmentMissiont', 999)
	let mission = this.droptable.filter(m=>m.id===this.missionID)[0]
	//console.log ("start missionID",this.missionID,mission)
    if (!mission) {console.log("nomission"); this.setup();} //если в конфиге кака сначала настройка
	await this.updatemyData()

	this.raids = Math.floor(this.stamina/(this.energyNeeded))
	//console.log("Энки у нас",this.stamina," рейдов доступно",this.raids)

	//if (this.raids >0) 
	//console.log("start refill",refill)
	if (!!refill) {this.makeMission(mission,this.raids,refill) }
	else {this.makeMission(mission,this.raids)}
	}


async setup() {
	this.updateDroptable()
	await this.updatemyData()
	//console.log("droptable2 updated",this.droptable)
	this.missionID = getSaveVal('huntFragmentMissiont', 999)
	this.raidByTen = getSaveVal('huntFragmentByTen', false)
	this.collectClan = getSaveVal('huntFragmentCollectClan', false)
	this.buyStamina = getSaveVal('huntFragmentBuyStamina', false)
	let mission = this.droptable.filter(m=>m.id===this.missionID)[0]
	//console.log ("setup missionID",this.missionID)
	let message = ""; let maxraid =""; let target="";
		await this.updatemyData()
		//console.log ("viplevel",this.vipLevel)
	if (this.vipLevel != 5) {message+=I18N('FRAGMENT_HUNT_SMALLVIP')}

	if (!mission) {
		//this.raids = 0; 
		message = I18N('FRAGMENT_HUNT_NOMISSION')} //костыль чтоб точно выбрали миссию
	else {
		for (let i in mission.drop){
			let id=mission.drop[i]; 
			let thismission = this.droptable.filter(m=>m.id===mission.id)[0]
			let thisitem = thismission.drop2.filter(d=>d.id == id)
			target+="["+thisitem[0].chance+"%] "+this.getName(id)+"<br>";
		}
		//maxraid = I18N('RAID')+" х"
		//if (this.checkvip()==5) {maxraid+=this.raids*10} else {maxraid+=this.raids}
		this.raids = Math.floor(this.stamina/(this.energyNeeded))
		//FRAGMENT_HUNT_WERAID
		message = I18N('FRAGMENT_HUNT_WERAID')+"<br>"+I18N('FRAGMENT_HUNT_WORLD')+" "+mission.world+" "+I18N('FRAGMENT_HUNT_MISSION')+" "+mission.index+"    "+this.energyNeeded+" "+I18N('FRAGMENT_HUNT_ENERGY')+"<br><br>"+I18N('FRAGMENT_HUNT_WEHUNT')+":<br>"+target+I18N('FRAGMENT_HUNT_ENERGY')+" "+this.stamina+I18N('FRAGMENT_HUNT_ENOUGH1')+this.raids+I18N('FRAGMENT_HUNT_ENOUGH2')
	}
	
	let buttons0 = []
	//if (this.raids > 0 && this.checkvip()==5) {buttons0.push({msg: I18N('RAID')+" х10", result: "1"})}
	//if (this.raids > 1) {buttons0.push({msg: maxraid, result: "2"})}
	//if (this.raids > 0)
		 {buttons0.push({msg: I18N('BTN_GO'), result: "1"})}
	buttons0.push({msg: I18N('FRAGMENT_HUNT_CHANGE'), result: "3"})
	buttons0.push({msg: I18N('BTN_CANCEL'), result: false})
	//buttons0.push({result: false, isCancel: true})
	let checkbox = [ 
		{
			name: 'collectClan',
			get label() {
					return I18N('FRAGMENT_HUNT_CLANENERGY');
				},
				checked: this.collectClan,
		},
		{
			name: 'buyStamina',
			get label() {
					return I18N('FRAGMENT_HUNT_BUYSTAMINA');
				},
				checked: this.buyStamina,
		},
	]
	if (this.vipLevel == 5) {checkbox.push(
							{
								name: 'byTen',
								get label() {
									return I18N('FRAGMENT_HUNT_BYTEN');
								},
								checked: this.raidByTen,
							},
						)}

	this.answerr = await popup.confirm(message, buttons0,checkbox);
	if (this.vipLevel == 5){
	const chkten = popup.getCheckBoxes().find((e) => e.name === 'byTen')?.checked
	this.raidByTen = chkten
	setSaveVal('huntFragmentByTen', this.raidByTen)} else {setSaveVal('huntFragmentByTen', false)}

	const chkclan = popup.getCheckBoxes().find((e) => e.name === 'collectClan')?.checked
	this.collectClan = chkclan
	setSaveVal('huntFragmentCollectClan', this.collectClan)

	const chkbuy = popup.getCheckBoxes().find((e) => e.name === 'buyStamina')?.checked
	this.buyStamina = chkbuy
	setSaveVal('huntFragmentBuyStamina', this.buyStamina)
	
	const parts = [I18N('FRAGMENT_HUNT_PARTS1'),I18N('FRAGMENT_HUNT_PARTS2'),I18N('FRAGMENT_HUNT_PARTS3'),I18N('FRAGMENT_HUNT_PARTS4'),I18N('FRAGMENT_HUNT_PARTS5'),I18N('FRAGMENT_HUNT_PARTS6'),I18N('FRAGMENT_HUNT_PARTS7'),I18N('FRAGMENT_HUNT_PARTS8')]
	const colors1 = ['violet','violet','violet','gold','gold','gold','red','red']
	const buttons = [];
	for (let i in parts ) {
		buttons.push({
					msg: parts[i],
					result: i,
					get title() { return "test" },
					color: colors1[i]
				});
	}
	buttons.push({msg: I18N('BTN_CANCEL'), result: false, isCancel: true})
	//buttons.push({result: false, isCancel: true})
	let answer=0;
	switch (this.answerr) { 
		case "1": {
			//console.log("тут будет рейд х10",mission.id);
			//this.makeMission(mission,10)
			this.start(true)
			break;
			}
		/*case "2": {
			//console.log("тут будет макс рейд",mission.id); 
			this.makeMission(mission,this.raids*10)
			break;}*/
		case "3": {answer = await popup.confirm(I18N('FRAGMENT_HUNT_CHOOSEPART'), buttons); break;}
		default: {return;}
	}
	if (!answer) {return}

	let array=[]
	switch (answer) { 
		case "0": { array=this.generateArray(91,8);break;}
		case "1": { array=[158,153,162,164,165,157,152,166]; break;} //(152,15)
		case "2": { array=[163,159,154,161,156,160,155]; break;}
		case "3": { array=this.generateArray(167,12);break;}
		case "4": { array=[190,194,197,205,204,215,214,196,218,193,219,217,206]; break;}
		case "5": { array=[198,220,195,192,216,191,199,200]; break;}
		case "6": { array=this.generateArray(221,12); break;}
		case "7": { array=this.generateArray(244,11); break;}
		default: {console.log("oops"); break;}
	}
	let buttons2 = this.generateitembuttons(array,this.getColor(array[0]))
	console.log("wut",array,buttons2)
	let answer2 = await popup.confirm(I18N('FRAGMENT_HUNT_CHOOSEITEM'), buttons2);
	if (!answer2) {return}

	let missions = this.droptable.filter(m=>m.drop.includes(answer2))
	let missarray = []
	for (let i in missions) {missarray.push(missions[i].id)}
	let answer3 = await popup.confirm(I18N('FRAGMENT_HUNT_CHOOSEMISSION')+"<br>"+this.getName(answer2), this.generatemissionbuttons(missarray,answer2));
	if (!answer3) {return}

	setSaveVal('huntFragmentMissiont', answer3)
	this.setup()
}
}
this.HWHClasses.huntFragment = huntFragment;
})();

//TODO:
// возврат к прошлому окошку как в CraftItems
// отправка запросов пачками по 20 с прогрессом
// лимит траты энки, не вся?
// трата, пока не соберётся полный итем

// ==UserScript==
// @name         QQOL
// @namespace    http://tampermonkey.net/
// @version      0.64
// @description  Quality of Quality of Life!
// @include *queslar.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411266/QQOL.user.js
// @updateURL https://update.greasyfork.org/scripts/411266/QQOL.meta.js
// ==/UserScript==

//mat-tab-label-0-1
//TODO HOOK INTO document.querySelector('app-gamecontent') observer


////
//var rootElement = getAllAngularRootElements()[0].children[1]["__ngContext__"][30];
//      storage = rootElement.playerGeneralService;
////


//0.64
// rootElement.playerCurrencyService.gem_fragments
//

//QQOL.gameData.marketService.serviceOrders
//

class FTGMod {
 constructor() {
   this.ver = '0.64';
   //OBSERVERS
   var modbody = this;
   this.serviceOrders = {};
   this.newActionObserver = new MutationObserver(function(mutations) {
     mutations.forEach(function(mutation) {
          modbody.OnNewAction();
     });
    });
    this.newActionObserver.observe(
      document.querySelector('head > title'),
      {subtree: true, characterData: true, childList: true }
    );
    this.onactionhooks = [];



    this.newTabObserver = new MutationObserver(function(mutations) {
      //APP-INVENTORY
      mutations.forEach(function(mutation) {
        if (mutation.target.nodeName.toLowerCase().includes('app-')) {
          if (mutation.addedNodes.length>0) {
            if (mutation.target.nodeName.toLowerCase().split('-').length==2) {
              if (mutation.target.nodeName.toLowerCase().split('-')[1]!='gamecontent') {
                let tab = mutation.target.nodeName.toLowerCase().split('-')[1];
                //crafting
                if (tab=='actions') {
                  let subtab = mutation.target.childNodes[2].nodeName.toLowerCase().split('-')[1];
                  if (subtab=='actions') {
                    subtab=='pets'; //Blah pls
                  }
                  modbody.currentTab = subtab;
                  modbody.OnNewTab(subtab);
                } else if (tab=='market') {
                  let subtab = mutation.target.childNodes[2].nodeName.toLowerCase().split('-')[2];
                  modbody.currentTab = subtab;
                  modbody.OnNewTab(subtab);
                } else {
                  modbody.currentTab = mutation.target.nodeName.toLowerCase().split('-')[1];
                  modbody.OnNewTab(mutation.target.nodeName.toLowerCase().split('-')[1]);
                }

            }
            }

          }
        }
      });
    });

   this.newTabObserver.observe(
     document.querySelector('app-gamecontent'),
     {subtree: true, childList: true }
   );
   this.ontabhooks = [];
   //I SUCK AT JS
   //document.onclick = function(){modbody.Update()} //im retarded, look up hooks later
                                                   //.clickable onclick?

   //NEW DOM
   var csselem = document.createElement("link");
   csselem.setAttribute("rel", "stylesheet");
   csselem.setAttribute("type", "text/css");
   csselem.setAttribute("href", "https://countto25.github.io/QueslarQQOL/cssfix.css");
   document.getElementsByTagName("head")[0].appendChild(csselem);

   let QQOLholder = document.createElement('div');
   QQOLholder.id = 'QQOL_holder';
   document.getElementById('profile-next-level').parentNode.insertBefore(QQOLholder,document.getElementById('profile-next-level').nextSibling);
   //document.getElementById('mat-tab-content-0-1').children[0].appendChild(QQOLholder);

   let QQOLinfo = document.createElement('div');
   QQOLinfo.style.marginTop = '10px';
   QQOLinfo.id='QQOL_info';
   QQOLinfo.innerHTML = '<mat-icon class="mat-icon material-icons" style="vertical-align: bottom: height: 16px; width: 16px; font-size: 16px">settings</mat-icon><span id="toSettings" class="QQOL-link-action">QQOL v'+this.ver+'</span>';

   let QQOLquests = document.createElement('div');
   QQOLquests.id='QQOL_quests';
   QQOLquests.innerHTML = 'Loading...';

   let QQOLkdexp = document.createElement('div');
   QQOLkdexp.id='QQOL_kingdomexploration';
   QQOLkdexp.innerHTML = '';


   let QQOLTimeToTargetLevel = document.createElement('div');
   QQOLTimeToTargetLevel.id='QQOL_TTTL';
   if (!localStorage.targetLevel || parseInt(localStorage.QQOL_tttl_show)!=1)
    QQOLTimeToTargetLevel.style.display = 'none';
   QQOLTimeToTargetLevel.innerHTML = '';

   let timetoleveluptooltip = document.createElement('div');
   timetoleveluptooltip.id = 'QQOL_time_to_levelup';
   let idletimeremainingtooltip = document.createElement('div');
   idletimeremainingtooltip.id='QQOL_remaining_time';
   document.getElementById('QQOL_holder').appendChild(QQOLinfo);
   document.getElementById('QQOL_holder').appendChild(idletimeremainingtooltip);
   document.getElementById('QQOL_holder').appendChild(timetoleveluptooltip);
   document.getElementById('QQOL_holder').appendChild(QQOLquests);
   document.getElementById('QQOL_holder').appendChild(QQOLTimeToTargetLevel);
   document.getElementById('QQOL_holder').appendChild(QQOLkdexp);


   //DECLARE SHIT
   this.rememberquest = null;
   this.activetab = null;
   this.updateInterval = null;

   //FINISH
   this.HookOnAction(() => {modbody.Update()});
   this.HookOnAction(() => {if (modbody.rememberquest!=null && document.title.split(' - ')[1]!='Party') modbody.rememberquest--;});
   this.HookOnAction(() => {if (modbody.updateInterval == null) {modbody.updateInterval = setInterval(() => {modbody.Update()}, 100)}});
   this.HookOnAction(() => this.IncomePerHour());

   this.HookOnTab((x) => {console.log(x)});
   this.HookOnTab((x) => {modbody.activetab = x});
   this.HookOnTab((x) => {if (x==='battle') this.BlockActionsOnOvercap()});

   setInterval(() => {modbody.CheckLatestVersion()}, 1000000);

   this.CheckLatestVersion();
   this.DoUI();
   this.SetupSettings();
   this.ReflectSettings();



   console.log('loaded Quality of Quality of Life mod v'+this.ver+'. Have a nice day!');
 }

 HookOnAction(func, exec=false) {
   if (exec) func();
   this.onactionhooks.push(func);
 }
 HookOnTab(func, exec=false) {
   if (exec) func();
   this.ontabhooks.push(func);
 }

 get gameData() {
   let rootElement = getAllAngularRootElements()[0].children[1]["__ngContext__"][30];
   return rootElement.playerGeneralService;

 }

 Update() {
   this.TimeRemaining();
   this.TimeToLevelUp();
   this.TimeToQuestComplete();
   this.ReflectTimeToTargetLevel();
   this.explorationTimer();
 }

 GetRemainingActions() {
   return this.gameData.playerActionService.actions.remaining;
 }

 OnNewAction() {
   for (let i=0; i<this.onactionhooks.length; i++) {
     this.onactionhooks[i]();
   }
 }

 OnNewTab(tname) {
   for (let i=0; i<this.ontabhooks.length; i++) {
     this.ontabhooks[i](tname);
   }
 }

 CreateTimerWindow() {
   if (document.querySelector('.h5.mt-1')) {
     let timerelement = document.createElement('span');
    timerelement.id = 'FTG_idle_timer';
    timerelement.classList.add('h5');
    timerelement.setAttribute('style','margin-top: .25rem !important;');
    document.querySelector('.h5.mt-1').parentNode.insertBefore(timerelement,document.querySelector('.h5.mt-1'))
  }
 }

 BlockActionsOnOvercap() {
   return '';
   //find smth to do with issue
   if (this.gameData.playerActionService.actions.remaining > this.gameData.playerActionService.actions.total &&
       this.gameData.playerActionService.currentSkill == "battling" &&
       !this.gameData.partyService.isFighting) {
     document.querySelector('[joyridestep="startingTutorialSix"]').style.pointerEvents = 'none';
     document.querySelector('[joyridestep="startingTutorialSix"]').innerHTML = 'Refreshing will reset action cap';
   } else {
     document.querySelector('[joyridestep="startingTutorialSix"]').style.pointerEvents = 'unset';
     document.querySelector('[joyridestep="startingTutorialSix"]').innerHTML = 'Fight';
   }
 }

 TimeRemaining() {
   let actionsRemaining = this.GetRemainingActions();
   let txt ='Idle time remaining: '+this.ActionsToTime(actionsRemaining);
   let playerId = this.gameData.gameService.playerData.id;
   if (this.gameData.partyService.hasParty) {
    let partyActionsRemaining = this.gameData.partyService.partyOverview.partyInformation[playerId].actions.daily_actions_remaining;
    actionsRemaining += partyActionsRemaining;
    //<span class="QQOL-tooltip">
    txt ='<span class="QQOL-tooltip"><span class="QQOL-tooltiptext">'
      +this.GetRemainingActions()+
      ' solo actions and '+partyActionsRemaining+' party actions</span>Idle time remaining</span>: '
      +this.ActionsToTime(actionsRemaining);
   }
   if (this.GetRemainingActions()<0) {
     txt ="<span style='color: red'>Restart your actions!</span>";
   }
   if (document.getElementById('QQOL_remaining_time'))
    document.getElementById('QQOL_remaining_time').innerHTML=txt;
 }

 explorationTimer()
 {
     //rootElement.playerGeneralService.playerKingdomService.kingdomData.selectedExploration

     if (!this.gameData.playerKingdomService.isInKingdom) {
         return;
     }

     if (!this.gameData.playerKingdomService.kingdomData) {
         return;
     }

     if (!this.gameData.playerKingdomService.kingdomData.selectedExploration) {
         return;
     }

     let exploration = this.gameData.playerKingdomService.kingdomData.selectedExploration;
     let timetoend = new Date(exploration.exploration_timer);
     timetoend = Math.floor(timetoend.getTime() / 1000);
     let now = new Date();
     now = Math.floor(now.getTime() / 1000);

     let diff = timetoend - now;
     let time = this.SecondsToString(diff);
     document.querySelector('#QQOL_kingdomexploration').innerHTML = 'KD exploration: '+time;
 }

 GetSeconds(actions) {
   return '';
 }

 IncomePerHour() {
  let infospan;
  let subname = (this.currentTab == 'party')?'p':'s'
  if (!document.querySelector('#QQOL_GEPH_'+subname)) {
    let appendTo = document.querySelector('.action-result-value-container');
    infospan = document.createElement('div');
    infospan.style.marginTop = '10px';
    infospan.id='QQOL_GEPH_'+subname;
    if (appendTo)
      appendTo.appendChild(infospan);
  } else {
    infospan = document.querySelector('#QQOL_GEPH_'+subname);
  }
  if (this.currentTab == 'party') {
    if (Object.keys(this.gameData.partyService.actionResult).length!=0) {
      let exp = this.gameData.partyService.actionResult.income.experience.amount;
      let gold = this.gameData.partyService.actionResult.income.gold.amount;
      infospan.innerHTML = `(<span class='QQOL-tooltip'>${(gold*600).toLocaleString()} gold and ${(exp*600).toLocaleString()} experience per hour<span class='QQOL-tooltiptext'>Unless you die</span></span>)`;
    }
  } else {
    if (Object.keys(this.gameData.playerActionService.actionResult).length!=0) {
      let exp = this.gameData.playerActionService.actionResult.income.experience.amount;
      let gold = this.gameData.playerActionService.actionResult.income.gold.amount;
      infospan.innerHTML = `(<span class='QQOL-tooltip'>${(gold*600).toLocaleString()} gold and ${(exp*600).toLocaleString()} experience per hour<span class='QQOL-tooltiptext'>Unless you die</span></span>)`;
    }
  }
 }


 TimeToQuestComplete() {
   let txt;
   let cQuest = this.gameData.playerQuestService.currentQuest[0];
   if (this.gameData.playerQuestService.currentQuestId!=0) {
     if (cQuest.objectiveType=='actions') {
       let remaining = cQuest.objectiveAmount - cQuest.currentProgress;
       txt = 'Time to quest completion: '+this.ActionsToTime(remaining);
    } else if (cQuest.objectiveType=='kills') {
      if (this.gameData.playerActionService.currentSkill=='battling') {
        txt = '<span class="QQOL-tooltip">Time to quest completion<span class="QQOL-tooltiptext">If you keep on fighting solo and avoiding death</span></span>: '
          +this.ActionsToTime(cQuest.objectiveAmount - cQuest.currentProgress)
      } else {
        txt = 'Kills quest active, not in battle';
      }
    } else if (cQuest.objectiveType=='gold') {
        if (this.gameData.playerActionService.currentSkill=='battling') {
          let gpt = 0;
          if (!this.gameData.partyService.isFighting) {
            gpt = this.gameData.playerActionService.actionResult.income.gold.amount;
            if (this.gameData.playerActionService.actionResult.income.gold.tax)
              gpt+=this.gameData.playerActionService.actionResult.income.gold.tax;
          } else {
              txt = 'Doing party actions';
              if (document.querySelector('#QQOL_quests'))
               document.querySelector('#QQOL_quests').innerHTML=txt;
              return false;
          }
          let actionsToCompletion = Math.ceil((cQuest.objectiveAmount - cQuest.currentProgress)/gpt);
          txt =
            '<span class="QQOL-tooltip">Time to quest completion<span class="QQOL-tooltiptext">At '
            +gpt+' gold per turn</span></span>: '+this.ActionsToTime(actionsToCompletion);
      } else {
        txt = 'Gold quest active, not in battle';
      }
    }
   } else {
     txt = '<span style="color:red">Grab a new quest!</span>';
   }
   if (document.querySelector('#QQOL_quests'))
    document.querySelector('#QQOL_quests').innerHTML=txt;
  }

 TimeToLevelUp() {
   if (document.getElementById('profile-next-level')) {
   let txt = document.getElementById('profile-next-level').innerHTML;
   let actionVal = parseInt(txt.replace(/\D/g,''));
   txt='Time to next level: '+this.ActionsToTime(actionVal);
   if (document.getElementById('QQOL_time_to_levelup'))
    document.getElementById('QQOL_time_to_levelup').innerHTML = txt;
    }

 }

 ExpToLevel() {
   let expBank = 0;
   let currentLevel = this.gameData.playerLevelsService.battling.level;
   if (!localStorage.getItem('targetLevel')) return false;
   let targetLevel = parseInt(localStorage.getItem('targetLevel'));
   let currentExp = this.gameData.playerLevelsService.battling.exp.have;
   if (targetLevel == 0) return false;
   for (let i=currentLevel; i<targetLevel; i++) {
     let expToLevel = Math.round(25000 * Math.pow(i, 0.5));
     let levelTemp = i;
     while (levelTemp > 1500) {
       expToLevel +=  250 * Math.pow((levelTemp - 1500), 1.25)
       levelTemp -= 1500;
     }
     expBank+=expToLevel;
   }
   return expBank-currentExp;
 }

 TimeToTargetLevel() {
   if (!localStorage.getItem('targetLevel')) {
     return 'Time to target level: check settings';
   }
   let actionVal;
   if (this.gameData.playerActionService.actionResult.income && this.gameData.playerActionService.actionResult.income.experience.amount) {
      actionVal = this.gameData.playerActionService.actionResult.income.experience.amount;
   } else {return '';}
   let totalExpReq = this.ExpToLevel();
   let actionsReq = Math.ceil(totalExpReq/actionVal);
   let tLevel = localStorage.targetLevel;
   return 'Time to level '+tLevel+': '+this.ActionsToTime(actionsReq);
 }

 ReflectTimeToTargetLevel() {
   let div = document.getElementById('QQOL_TTTL');
   if (!div) return;
   div.innerHTML = this.TimeToTargetLevel();
 }

 FindProvider() {
   let sTerm = document.getElementById('QQOL_service_search').value.toLowerCase();
   let users = document.querySelectorAll('td.cdk-column-username.mat-column-username > div');
   for (let i=0; i<users.length; i++) {
     if (users[i].innerHTML.toLowerCase().includes(sTerm)) {
       users[i].parentNode.parentNode.removeAttribute('style');
     } else {
       users[i].parentNode.parentNode.style.display='none'
     }
   }
 }
 ActionsToTime(actions) {
   if (actions<0) return '00:00';
   let minval = Math.floor(actions/10);
   let hourval = Math.floor(minval/60);
   let remMinutes = minval%60;
   let remSeconds = actions/10
   let subSeconds =  this.gameData.partyService.isFighting?this.gameData.partyService.countDown:this.gameData.playerActionService.countDown;
   if ((actions*6%60) - (6-subSeconds)  < 0)
    remMinutes--;

    let remSec = actions*6%60;
    let a = 6-subSeconds;
    if (remSec-a<0) {remSec=remSec+60-a} else {remSec = remSec-a;}
    if (remSec<10) remSec='.0'+remSec;
    else remSec='.'+remSec;

   let dayVal = Math.floor(hourval/24);
   return ((dayVal>0)?(dayVal+'d '):(''))+hourval%24+':'+(remMinutes<10?('0'+remMinutes):(remMinutes))+remSec;
 }



 SecondsToString(seconds)
{
  var numyears = Math.floor(seconds / 31536000);
  var numdays = Math.floor((seconds % 31536000) / 86400);
  var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
  return numhours.toString().padStart(2, '0') + ":" + numminutes.toString().padStart(2, '0') + "." + numseconds.toString().padStart(2, '0');
}




 get myEquipmentData() {
   let myID = this.gameData.gameService.playerData.id;
   return this.gameData.partyService.partyOverview.partyInformation[myID].equipment;
 }

  IsPlayerRelated(name) {
    if (this.playerRelatives.includes(name))
      return true;
    else
      return false;
 }



  CheckLatestVersion() {
    let modbody = this;
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.github.com/repos/countto25/queslarqqol/tags', true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        console.log(data);
        let latestVersion = data[1].name;
        console.log(parseFloat(latestVersion) + ' vs ' +parseFloat(modbody.ver));
        console.log(modbody.ver);
        console.log(parseFloat(latestVersion) > parseFloat(modbody.ver));
        if ((parseFloat(latestVersion) > parseFloat(modbody.ver))) {
          let txt = 'QQOL v'+modbody.ver+'. <a target="_blank" href="https://countto25.github.io/QueslarQQOL?update=true" class="QQOL-link-action" style="color:red; text-decoration: none">Please update</a>';
          document.querySelector('#toSettings').innerHTML=txt;
        } else if (parseFloat(latestVersion) < parseFloat(modbody.ver)) {
          let txt = 'QQOL v'+modbody.ver+'. <span style="color:green; text-decoration: none">Maybe do your actual job?</span>';
          document.querySelector('#toSettings').innerHTML=txt;
        }
      } else {console.log('error getting new version :')}
    }
    request.send();
  }

  fetchHTML(url) {
    if( 'undefined' == typeof(url) ) return false;
    let p;
    if( document.all ){
      p = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
    p = new XMLHttpRequest();
    }
    let rnd = Math.random().toString().substring(3);
    if( url.indexOf('?') > -1 )
    {
      url+='&rnd='+rnd;
    }
    else
    {
      url+='?rnd='+rnd;
    }
    p.open("GET",url,false);
    p.send(null);
    return p.responseText;
}

  DoUI() {
    let div = document.createElement("div");
    let settingsmenu = this.fetchHTML('https://countto25.github.io/QueslarQQOL/menu.html');
    div.classList.add("QQOLsettings");
    div.style.display = 'none';
    div.innerHTML = settingsmenu;
    let modbody = this;
    document.body.appendChild(div);
    document.querySelector('#exitSettings').onclick = function() {
      document.querySelector('.QQOLsettings').style.display='none';
      modbody.ReflectSettings();
    }
    document.querySelector('#contactme').onclick = function() {
      document.querySelector('.chat-input ').value='/w FiammaTheGreat';
      document.querySelector('.QQOLsettings').style.display='none';
      modbody.ReflectSettings();
    }
    document.querySelector('#toSettings').onclick = function() {
      document.querySelector('.QQOLsettings').style.display='block';
    }
    let checks = document.querySelectorAll('input[type=checkbox].QQOLCheck');
    checks.forEach(check => {
      check.oninput = function() {
        localStorage.setItem('QQOL_'+this.getAttribute('for'), this.checked?1:0);
        console.log(this.checked?1:0);
      }
    });
    document.querySelector('input[for=tttl_value]').oninput = function() {
      localStorage.setItem('targetLevel', this.value);
    }
  }
  SetupSettings() {
    if (localStorage.getItem('QQOL_itr_show')===null) {
      localStorage.setItem('QQOL_itr_show', 1);
    }
    if (localStorage.getItem('QQOL_nl_show')===null) {
      localStorage.setItem('QQOL_nl_show', 1);
    }
    if (localStorage.getItem('QQOL_ttqc_show')===null) {
      localStorage.setItem('QQOL_ttqc_show', 1);
    }

    if (localStorage.getItem('QQOL_tttl_show')===null) {
      localStorage.setItem('QQOL_tttl_show', 0);
    }
    if (localStorage.getItem('QQOL_ttke_show')===null) {
        localStorage.setItem('QQOL_ttke_show', 0);
    }

    if (localStorage.getItem('QQOL_itr_show') === '0') {
      document.querySelector('input[for=itr_show]').checked = false;
    } else {
      document.querySelector('input[for=itr_show]').checked = true;
    }
    if (localStorage.getItem('QQOL_nl_show') === '0') {
      document.querySelector('input[for=nl_show]').checked = false;
    } else {
      document.querySelector('input[for=nl_show]').checked = true;
    }

    if (localStorage.getItem('QQOL_ttqc_show') === '0') {
      document.querySelector('input[for=ttqc_show]').checked = false;
    } else {
      document.querySelector('input[for=ttqc_show]').checked = true;
    }

    if (localStorage.getItem('QQOL_tttl_show') === '0') {
      document.querySelector('input[for=tttl_show]').checked = false;
    } else {
      document.querySelector('input[for=tttl_show]').checked = true;
    }

    if (localStorage.getItem('QQOL_ttke_show') === '0') {
      document.querySelector('input[for=ttke_show]').checked = false;
    } else {
      document.querySelector('input[for=ttke_show]').checked = true;
    }

    let tl = (localStorage.getItem('targetLevel') || -1);
    if (tl != -1) {
      document.querySelector('input[for=tttl_value]').value = parseInt(tl);
    }
  }

  ReflectSettings() {
    if (localStorage.getItem('QQOL_itr_show') === '0') {
      document.querySelector('#QQOL_remaining_time').style.display = 'none';
    } else {
      document.querySelector('#QQOL_remaining_time').style.display = 'block';
    }

    if (localStorage.getItem('QQOL_nl_show') === '0') {
      document.querySelector('#QQOL_time_to_levelup').style.display = 'none';
    } else {
      document.querySelector('#QQOL_time_to_levelup').style.display = 'block';
    }

    if (localStorage.getItem('QQOL_ttqc_show') === '0') {
      document.querySelector('#QQOL_quests').style.display = 'none';
    } else {
      document.querySelector('#QQOL_quests').style.display = 'block';
    }

    if (localStorage.getItem('QQOL_ttke_show') === '0') {
      document.querySelector('#QQOL_kingdomexploration').style.display = 'none';
    } else {
      document.querySelector('#QQOL_kingdomexploration').style.display = 'block';
    }

    if (localStorage.getItem('QQOL_tttl_show') === '0') {
      document.querySelector('#QQOL_TTTL').style.display = 'none';
    } else {
      document.querySelector('#QQOL_TTTL').style.display = 'block';
    }

  }

  AdvanceFromCurrent(exp) {
    let projectedLevel = this.gameData.playerLevelsService.battling.level;
    while (exp > 0) {
      let expToLevel = Math.round(25000 * Math.pow(projectedLevel, 0.5));
      let levelTemp = projectedLevel;
      while (levelTemp > 1500) {
        expToLevel +=  250 * Math.pow((levelTemp - 1500), 1.25)
        levelTemp -= 1500;
      }
      projectedLevel++;
      exp-=expToLevel;
    }
    return projectedLevel;
  }
 }


//TY GREASEMONKEY
var QQOL = null;
console.log('init load');
var QQOLSetupInterval = setInterval(QQOLGMSetup, 1000);
function QQOLGMSetup() {
  if (document.getElementById('profile-next-level')&&QQOL===null) {
    console.log('load OK');
    clearInterval(QQOLSetupInterval);
    console.log(QQOLSetupInterval+'');
    QQOL = new FTGMod();

  } else {
    console.log('retry init...');
    console.log('next level?'+document.getElementById('profile-next-level'));
    console.log((document.getElementById('profile-next-level')&&QQOL===null));
  }
}

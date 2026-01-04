// ==UserScript==
// @name         splixHax Vbetter
// @namespace    http://tampermonkey.net/
// @version      15.2
// @description  better than other splix hacks
// @author       You
// @match        *://splix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381594/splixHax%20Vbetter.user.js
// @updateURL https://update.greasyfork.org/scripts/381594/splixHax%20Vbetter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.serverSel=null;
window.addEventListener('load',function(){
    window.MAX_ZOOM=10000;
    window.USERNAME_SIZE=6;
    var defzm=window.BLOCKS_ON_SCREEN,zm=1;
    window.addEventListener('wheel',function(e){
        if(window.document.activeElement.tagName=="input")return;
        zm+=e.deltaY/window.Math.abs(e.deltaY)*.5;
        if(defzm*zm>16000)zm-=.5;
        if(defzm*zm<100)zm+=.5;
        window.BLOCKS_ON_SCREEN=defzm*zm;
    });
    window.trackGameStart=function(){
      window.sendDir(4);
      window.setTimeout(()=>window.sendDir(4),0);
      window.setTimeout(()=>window.sendDir(4),125);
      window.setTimeout(()=>window.sendDir(4),250);
      window.setTimeout(()=>window.sendDir(4),375);
      window.setTimeout(()=>window.sendDir(4),500);
      window.myOldPlayer=window.myPlayer;
    };
    window.addEventListener("hashchange",function(){
if(window.serverSel!=null&&window.selectedGamemode.startsWith("N")&&"#"+window.serverSel.value!=window.location.hash)window.selUpd();
    },false);
    window.selUpd=()=>{
      if(window.serverSel==null)return;
      var sv=window.serverSel.selectedIndex;
      window.serverSel.outerHTML="";
      setTimeout(async ()=>{
        while(!serversRequestDone)await new window.Promise(r=>window.setTimeout(r,1));
        window.createServerSelectPls(true,sv);
      },100);
    };
    window.formElem.appendChild(document.createElement("BR"));
    window.createServerSelectPls=function(aa,bb){
      window.serverSel=document.createElement("SELECT");
      window.serverSel.className="fancyBox inputFancy";
      var tobesrvselectinnerhtml='<option value="" hidden disabled selected>'+(window.selectedGamemode.startsWith("N")?('Select a server... (Current: '+(window.location.hash.length<2?'auto':window.location.hash.slice(1))+')</option><option value="">auto'):'Possible Servers: ')+'</option>';
      window.serverSel.onchange=function(){if(window.serverSel.value==""){window.history.replaceState(null,null,' ');}else{window.location.hash=window.serverSel.value;}};
      window.formElem.appendChild(window.serverSel);
      window.servers.forEach((srv,indx)=>{
        tobesrvselectinnerhtml+='<option value="'+srv.gamemodes[window.selectedGamemode.startsWith("N")?0:1].versions[0].lobbies[0].hash+'"'+(window.selectedGamemode.startsWith("N")?"":" disabled")+'>'+srv.gamemodes[window.selectedGamemode.startsWith("N")?0:1].versions[0].lobbies[0].hash+' ('+srv.loc+')</option>';
        if(indx+1==window.servers.length){
          window.serverSel.innerHTML=tobesrvselectinnerhtml;
          if(aa&&[...window.serverSel.options].some(e=>e.value==window.location.hash.slice(1)))window.serverSel.value=window.location.hash.slice(1);
          if(bb==0)window.serverSel.selectedIndex=0;
         }
      });
    };
    (async ()=>{
      while(!serversRequestDone)await new window.Promise(r=>window.setTimeout(r,1));
      window.createServerSelectPls(false,0);
    })();
    window.tutorialPlayers[0].name="splixHax vBetter";
    window.tutorialPlayers[1].name="better than other splix hacks";
});
    window.myOldPlayer=null;
    window.macroMaker=function(k,s){
      if(typeof k=="undefined"||typeof s=="undefined")return "1st arg=array of nums (see desc. for more info), 2nd arg=milliseconds between presses";
      for(var i=0;i<k.length;i++){
        if(k[i]==5){
          window.setTimeout(()=>{window.honkStart();window.honkEnd();},s*i);
        }else if(k[i]==6){
          //do nothing
        }else{
          window.setTimeout(a=>window.sendDir(a),s*i,k[i]);
        }
      }
    };
    window.spectate=function(back){
      window.pressedKeys=[];
      if(typeof back!="undefined"&&back){
        if(window.myOldPlayer==window.myPlayer)return;
        window.myPlayer.isMyPlayer=false;
        window.myOldPlayer.isMyPlayer=true;
        window.myPlayer=window.myOldPlayer;
        lstPlyrIndx=window.players.indexOf(window.myPlayer);
        return;
      }
      if(lstPlyrIndx==-1)lstPlyrIndx=players.indexOf(window.myPlayer);
      if(players.length<2)return "error: there is nobody else nearby to spectate";
      players[lstPlyrIndx].isMyPlayer=false;
      lstPlyrIndx+=1;
      if(lstPlyrIndx>=players.length)lstPlyrIndx=0;
      players[lstPlyrIndx].isMyPlayer=true;
      window.myPlayer.trails=[];
      window.myPlayer=players[lstPlyrIndx];
      window.myPlayer.trails=[];
      return 'now spectating "'+window.myPlayer.name+'"';
    }
    var lstPlyrIndx=-1,high=false,spam=false,dark=false,keyHandler=function(e){
        if(e.keyCode>=112&&e.keyCode<=121&&e.keyCode!=116)return e.preventDefault();
        if(window.document.activeElement.tagName=="input")return;
        if(e.type.endsWith("n")){
            switch(e.key){
              case "y":
              if(window.myOldPlayer==window.myPlayer){
                window.document.title=window.spectate();
                window.sendDir(4);
              }
              break;
              case "e":
              window.myPlayer.addHitLine(window.myPlayer.pos,window.myColorId);
              window.sendDir(4);
              break;
            }
            if("y".split("").includes(e.key)){
              if(e.key=="y"?window.myOldPlayer==window.myPlayer:true)window.myPlayer.addHitLine(window.myPlayer.pos,window.myColorId);
              resetTitle();
            }
        };
        if(e.type.endsWith("p")){
            //window.wsSendMsg(window.sendAction.REQUEST_MY_TRAIL);
            switch(e.key){
                case "h":
                    high=!high;
                    window.document.title="high mode "+(high?"en":"dis")+"abled";
                    break;
                case "g":
                    spam=!spam;
                    window.document.title="spam mode "+(spam?"en":"dis")+"abled";
                    break;
                case "f":
                    window.GLOBAL_SPEED=.006+(+(GLOBAL_SPEED==.006))*.00075;
                    window.document.title="speed mode "+(window.GLOBAL_SPEED==.006?"dis":"en")+"abled";
                    break;
                case "t":
                    dark=!dark;
                    window.document.title="dark mode "+(dark?"en":"dis")+"abled";
                    break;
                case "y":
                    window.spectate(1);
                    window.myPlayer.addHitLine(window.myPlayer.pos,window.myColorId);
                    break;
                case "e":
                    if(window.confirm("are you sure you would like to eat the entire universe?"))window.myPlayer.doHonk(window.Infinity);
                    break;
            }
            if("hgft".split("").includes(e.key)){
                window.myPlayer.addHitLine(window.myPlayer.pos,window.myColorId);
                resetTitle();
            }
        }
    };
    var setTitleInterval=-1;
    function resetTitle(){
      window.clearInterval(setTitleInterval);
      setTitleInterval=window.setTimeout(()=>{
        window.document.title="splix.io";
        setTitleInterval=-1;
      },3000);
    }
    window.addEventListener('keydown',keyHandler);
    window.addEventListener('keyup',keyHandler);
    var tmpColId;
    window.setInterval(()=>{if(!window.isConnectingWithTransition&&window.myPlayer!=null&&window.myOldPlayer!=window.myPlayer)window.spectate();},3000);
    window.setInterval(()=>{
          var tmpSkinBlock=window.Math.floor(window.Math.random()*13);
          try{
          window.tutorialPlayers[0].skinBlock=tmpSkinBlock;
          window.tutorialPlayers[1].skinBlock=12-tmpSkinBlock;
          window.tutorialPlayers[0].doHonk(128);
          window.tutorialPlayers[1].doHonk(128);
          }catch(e){console.error(e);}
          if(window.myPlayer==null)return;
          if(window.myOldPlayer==null)window.myOldPlayer=window.myPlayer;
          tmpColId=window.myColorId;
          while(window.myColorId==tmpColId)window.myColorId=window.Math.floor(window.Math.random()*13);
          tmpColId=window.myColorId;
          window.myPlayer.skinBlock=(high|!dark)?window.myColorId:13;
          if(high)window.myColorId=13;
          window.colorUI();
          if(high){
            window.myColorId=tmpColId;
            //window.toggleUglyMode();
          }
          //make other players stoopid
          window.players.filter(v=>v!=window.myPlayer&&!v.name.startsWith('[stoopid] ')&&v!=window.myOldPlayer).forEach(v=>v.name="[stoopid] "+v.name);
          window.players.filter(v=>v!=window.myPlayer&&v!=window.myOldPlayer).forEach(v=>{v.skinBlock=high?13:window.myColorId;});
    },1000);
    var prevGameMode=null;
    window.setInterval(()=>{if(spam)window.wsSendMsg(window.sendAction.HONK,128);},10);
    window.setInterval(async ()=>{
        if(window.selectedGamemode==null)return;
        if(prevGameMode==null)prevGameMode=window.selectedGamemode;
        if(prevGameMode!=window.selectedGamemode){
          prevGameMode=window.selectedGamemode;
          window.selUpd();
        }
        if(window.myPlayer==null)return;
        if(window.myOldPlayer==null||(window.myPlayer!=window.myOldPlayer&&window.myPlayer.id==window.myOldPlayer.id))window.myOldPlayer=window.myPlayer;
        if(spam)window.myPlayer.doHonk(16);
        if(window.myPlayer.isDead){
          if(window.myPlayer==window.myOldPlayer){
            if(window.myPlayer.deathWasCertain)window.sendDir(4);
            window.myPlayer.undoDie();
            window.myPlayer.deathWasCertain=false;
            //window.doSkipDeathTransition();
          }else if(window.myOldPlayer.isDead){
            //window.myOldPlayer=window.myPlayer=null;
            window.setTimeout(()=>window.myOldPlayer=window.myPlayer=null,100);
            window.myPlayer.undoDie();
            //window.myPlayer.deathWasCertain=false;
            window.spectate(1);
            if(window.myPlayer.deathWasCertain)window.sendDir(4);
            window.myPlayer.deathWasCertain=false;
          }else{window.spectate();}
        }
        if(high)window.myPlayer.die();
        if(window.myPlayer!=window.myOldPlayer)window.pressedKeys=[];
        window.clearTimeout(window.deathTransitionTimeout);
        if(window.pressedKeys.includes(27))window.doTransition("Despacito",true,null,()=>{window.setTimeout(window.afterDeath,250);window.onClose();window.resetAll();},true);
    },0);
    window.document.head.innerHTML+="<style>#playUI>*{transition:all .5s linear;}#miniMap{transform-origin:top left;transform:scale(1.25,1.25);}select:not(#gamemodeSelect){padding-right:1.5em;background:url(/img/arrowD.svg) right center no-repeat #3bad48;color:#fff;background-size:30px;}</style>";
})();
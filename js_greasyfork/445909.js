// ==UserScript==
// @name        Match info - botwars.io
// @namespace   Violentmonkey Scripts
// @match       https://botwars.io/Match/Details/*
// @grant       none
// @version     1.0
// @author      Marcin Nowak
// @license MIT 
// @description Display more informations about the match
// @downloadURL https://update.greasyfork.org/scripts/445909/Match%20info%20-%20botwarsio.user.js
// @updateURL https://update.greasyfork.org/scripts/445909/Match%20info%20-%20botwarsio.meta.js
// ==/UserScript==


setTimeout(diplInfo, 1000);


function diplInfo(){
  
  if(document.getElementById('turnLogs')){
    debugger;
    cardBody = document.getElementsByClassName('card-body');
    cardBody = cardBody[0];
    const d = new Date();
    let ms = d.getMilliseconds();
    ms = ms % 10;
    document.getElementsByClassName('card-body')[0].children[0].innerHTML = ' '+ms+' '+document.getElementsByClassName('card-body')[0].children[0].innerHTML.substr(2);
    
    
    mnoInfo = document.getElementById('mnoInfo');
    if(mnoInfo)
      mnoInfo.remove();
    const nodeInfo = document.createElement("div");
    nodeInfo.id = 'mnoInfo';
    nodeInfo.innerHTML = "<strong>Press down arrow to see additional info</strong>";
    cardBody.appendChild(nodeInfo);

  }
  turnLogs = document.getElementById('turnLogs');

  if(turnLogs){
    turnLogText = turnLogs.innerHTML;
    
    reqPos = turnLogText.indexOf('Player 1');
    if(reqPos > 0){
      //Player 1 (ChGulo V2.1 Proto)
      playerStart = turnLogText.indexOf('Player 1');
      playerEnd = turnLogText.substr(playerStart).indexOf(')');
      player1Name = turnLogText.substr(playerStart+10,playerEnd-10);

      playerStart = turnLogText.indexOf('Player 2');
      playerEnd = turnLogText.substr(playerStart).indexOf(')');
      player2Name = turnLogText.substr(playerStart+10,playerEnd-10);

      
      //get turn number
     // debugger;
      reqPlayer = turnLogText.indexOf('Player 1');
      infoLog = turnLogText.substr(reqPlayer);
      reqReq = infoLog.indexOf('Bot Request'); //29
            
      botRequest = infoLog.substr(reqReq+13);
      
      
      reqHash = botRequest.indexOf('#');
      reqTurn = botRequest.substr(0,reqHash);


      botRequest = botRequest.substr(reqHash+1);
      reqHash = botRequest.indexOf('#');
      reqBot = botRequest.substr(0,reqHash);

    
      
      
      reqTurns = reqTurn.split(',');

      reqBots = reqBot.split(',');
      thisBot = Number(reqTurns[2]);
      
      //#####################################################################
      //            Reset borders
      //#####################################################################
      for(var i=0;i<document.getElementsByClassName('square').length;i++){
        document.getElementsByClassName('square')[i].style.borderColor = "#f4f6fa";
        document.getElementsByClassName('square')[i].style.borderWidth = "1.2px"
      }
      //#####################################################################
      
      //update tooltips with response - Player 1
      reqPlayer = turnLogText.indexOf('Player 1');
      infoLog = turnLogText.substr(reqPlayer);
      reqReq = infoLog.indexOf('Bot Response'); //171
      botResponse = infoLog.substr(reqReq+13);
      reqHash = botResponse.indexOf('#');
      reqResponse = botResponse.substr(1,reqHash);
      reqResp = reqResponse.split(',');
      //id="square_5_11"
      //F-3:4-99

            debugger;

      for(var i=0;i<reqResp.length;i++){
        var bot = reqResp[i].split('-');
        let coords = bot[0].split(':');
        var sqId = 'square_'+coords[0]+'_'+coords[1];

        var squere = document.getElementById(sqId);
        if (document.getElementById(sqId)){
          document.getElementById(sqId).title = 'X'+coords[0] + ' Y'+coords[1]+' '+bot[1]+'-'+bot[2];
          if(bot[1] == 'M')
            document.getElementById(sqId).style.borderColor = "#00FF00"
          else
            document.getElementById(sqId).style.borderColor = "#FF0000"
          document.getElementById(sqId).style.borderWidth = "2px";
        }
      }

      
      //update tooltips with response - Player 2
      reqPlayer = turnLogText.indexOf('Player 2');
      infoLog = turnLogText.substr(reqPlayer);
      reqReq = infoLog.indexOf('Bot Response'); //171
      botResponse = infoLog.substr(reqReq+13);
      reqHash = botResponse.indexOf('#');
      reqResponse = botResponse.substr(1,reqHash);
      reqResp = reqResponse.split(',');
      //id="square_5_11"
      //F-3:4-99

            debugger;
      if (reqResponse != ''){
        for(var i=0;i<reqResp.length;i++){
          var bot = reqResp[i].split('-');
          let coords = bot[0].split(':');
          var sqId = 'square_'+coords[0]+'_'+coords[1];
              debugger;
          var squere = document.getElementById(sqId);
          if (document.getElementById(sqId)){
            document.getElementById(sqId).title = 'X'+coords[0] + ' Y'+coords[1]+' '+bot[1]+'-'+bot[2];
            if(bot[1] == 'M')
              document.getElementById(sqId).style.borderColor = "#00FF00"
            else
              document.getElementById(sqId).style.borderColor = "#FF0000"
            document.getElementById(sqId).style.borderWidth = "2px";
          }
        }
      }
      
      //**********************************
      
      health1 = 0;
      count1 = 0;
      
      health2 = 0;
      count2 = 0;
      
      healthAf1 = 0;
      countAf1 = 0;
      
      healthAf2 = 0;
      countAf2 = 0;

      //before turn
      for(var i=0;i<reqBots.length;i++){
        //F-6:6-88
        let bot = reqBots[i].split('-');
        if(bot[0] == 'F'){
          health1 += Number(bot[2]);
          count1++;
        } else {
          health2 += Number(bot[2]);
          count2++;
        }
      }
      
      debugger;
      
      //after turn
      //var squares = document.getElementsByClassName('square').length;
      var squPlay1 = document.getElementsByClassName('playerOne');
      var squPlay2 = document.getElementsByClassName('playerTwo');
      
      countAf1 = squPlay1.length;
      for(var i=0;i<squPlay1.length;i++){
      //Number(document.getElementsByClassName('square')[34].textContent)
          healthAf1 += Number(squPlay1[i].textContent);
      }
      
      countAf2 = squPlay2.length;
      for(var i=0;i<squPlay2.length;i++){
      //Number(document.getElementsByClassName('square')[34].textContent)
          healthAf2 += Number(squPlay2[i].textContent);
      }
      
      
     // debugger;
      
      mnoInfo = document.getElementById('mnoInfo');
      mnoInfo.innerHTML = "<strong>Turn </strong>"+reqTurns[0]+'<br>'+player1Name+' health: '+health1+' -> '+healthAf1+' | '+(healthAf1-health1)+'<br>';
      mnoInfo.innerHTML += player1Name+' count: '+count1+' -> '+countAf1  +' | '+(countAf1 - count1)  +'<br><br>';
      mnoInfo.innerHTML += player2Name+' health: '+health2+' -> '+healthAf2+' | '+(healthAf2-health2)+'<br>';
      mnoInfo.innerHTML += player2Name+' count: '+count2+' -> '+countAf2+' | '+(countAf2 - count2);


      
      1==1;
    }
  }
  
  setTimeout(diplInfo, 300);
}

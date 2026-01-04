/*************** AUTODF Tab **********/
// @tabversion 20171109
Tabs.Barb = {
  tabLabel: unsafeWindow.g_js_strings.commonstr.darkForest,
	tabOrder: 8000,
	tabColor : 'brown',
  myDiv : null,
  MapAjax : new CMapAjax(),
  BlockList : [], 
  Blocks : [],
  popFirst : true,
  opt : {},
  nextattack : null,
  searchRunning : false,
  tilesSearched : 0,
  tilesFound : 0,
  curX : 0,
  curY : 0,
  lastX : 0,
  firstX : 0,
  firstY : 0,
  lastY : 0,
  rallypointlevel:0,
  knt:{},
  barbArray:{},
  lookup:1,
  city:1,
  deleting:false,
  maplag:0,
  troopDef : [],
  Options: {
	dfbtns:false,
	Method           : "distance",
  SendInterval       : 8,
  MaxDistance           : 20,
  RallyClip          : 0,
  Running            : false,
  BarbsFailedKnight     : 0,
  BarbsFailedRP      : 0,
  BarbsFailedTraffic    : 0,
  BarbsFailedVaria      : 0,
  BarbsFailedBog        : 0,
  BarbsTried         : 0,
  DeleteMsg             : true,
  DeleteMsgs0        : false,
  Foodstatus         : {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
  AetherStatus       : {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
  MsgLevel            : {1:true,2:true,3:true,4:true,5:true,6:true,7:true,8:true,9:true,10:true,11:true,12:true,13:true,14:true,15:true},
  BarbsDone          : {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
  BarbNumber         : {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0},
  Levels             : {1:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false},2:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false},3:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false},4:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false},5:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false},6:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false},7:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false},8:{0:false,1:false,2:false,3:false,4:false,5:false,6:false,7:false,8:false,9:false,10:false,11:false,12:false,13:false,14:false,15:false}},
  Troops             : {1:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},2:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},3:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},4:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},5:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},6:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},7:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},8:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},9:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},10:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},11:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},12:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},13:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},14:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0},15:{1:0,2:0,3:0,4:0,5:0,6:0,7:0, 8:0,9:0, 10:0, 11:0, 12:0}},
  MinDistance        : {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0},
  Distance              : {1:750,2:750,3:750,4:750,5:750,6:750,7:750,8:750,9:750,10:750,11:750,12:750,13:750,14:750,15:750},
  Update                : {1:[0,0],2:[0,0],3:[0,0],4:[0,0],5:[0,0],6:[0,0],7:[0,0],8:[0,0]},
  UpdateEnabled         : true,
  UpdateInterval      : 30,
  stopsearch            : 1,
  knightselector        : 0,
  barbMinKnight         : 50,
  barbMaxKnight         : 300,
  threshold          : 750000,
  },
    
  init : function (div){
    var t = Tabs.Barb;
	
	if (!Options.DFOptions) {
		Options.DFOptions = t.Options;
	}
	else {
		for (var y in t.Options) {
			if (!Options.DFOptions.hasOwnProperty(y)) {
				Options.DFOptions[y] = t.Options[y];
			}	
		}
	}
	
    if(Options.DFOptions.dfbtns)AddSubTabLink(unsafeWindow.g_js_strings.commonstr.darkForest,t.toggleBarbState, 'DFToggleTab');
    t.myDiv = div;
 
	for (var ui in unsafeWindow.cm.UNIT_TYPES){
		var i = unsafeWindow.cm.UNIT_TYPES[ui];
		var trp = [];
		trp.push(unsafeWindow.unitcost['unt'+i][0]);
		trp.push(i);
		t.troopDef.push(trp); 
	}
	
    var m = '<DIV id=pbTowrtDivF class=divHeader align=center>AUTOMATED FOREST FUNCTION</div><TABLE id=pbbarbingfunctions width=100% height=0% class=pbTab><TR align="center">';
     if (Options.DFOptions.Running == false) {
           m += '<TD><INPUT id=AttSearch type=submit value="Attack = OFF"></td>';
           if(document.getElementById('DFToggleTab'))document.getElementById('DFToggleTab').innerHTML = '<span style="color: #CCC">'+unsafeWindow.g_js_strings.commonstr.darkForest+': Off</span>';
       } else {
           m += '<TD><INPUT id=AttSearch type=submit value="Attack = ON"></td>';
            if(document.getElementById('DFToggleTab'))document.getElementById('DFToggleTab').innerHTML = '<span style="color: #FFFF00">'+unsafeWindow.g_js_strings.commonstr.darkForest+': On</span>';
       }
      m += '<TD><INPUT id=troopselect type=submit value="Select troops"></td>';
      m += '<TD><INPUT id=Options type=submit value="Options"></td>';
      m += '<TD><INPUT id=StopSearch type=submit value="Stop Current Search"></td>';
      m += '</tr></table></div>';
      
      m += '<DIV id=pbTraderDivD class=divHeader align=center>FOREST STATS</div>';
    
      m += '<TABLE id=pbbarbstats width=95% height=0% class=pbTab><TR align="left"><TR>';
      for(i=0;i<Seed.cities.length;i++){
              m += '<TD>' + Seed.cities[i][1] +'</td>';
      }
      m+='</tr><TR>';
      for(i=0;i<Seed.cities.length;i++){
              m += '<TD><DIV><span id='+ 'pdtotalcity' + i +'></span></div></td>';
      }
      m+='</tr><TR>';
      for(i=0;i<Seed.cities.length;i++){
              m += '<TD><DIV><span id='+ 'pddatacity' + i +'></span></div></td>';
      }
      m+='</tr><TR>'
       for(i=0;i<Seed.cities.length;i++){
              m += '<TD><DIV><span id='+ 'pddataarray' + i +'></span></div></td>';
     }
     m+='</tr></table><TABLE id=pbbarbstats width=95% height=0% class=pbTab><TR align="left"><TR>';
     for (i=0;i<=6;i++) {
         m+='<TD><DIV><span id='+ 'pberror' + i +'></span></div></td>';
     }
     m+='</tr></table>';
     m+='<div id="dferrorlog">&nbsp;</div>';
     m += '<DIV id=pbTraderDivD class=divHeader align=center>FOREST OPTIONS</div>';
     m += '<TABLE width=95% height=0% class=ptTab><TR align="left">';
     for(i=0;i<Seed.cities.length;i++){
        m += '<TR><TD>' + Seed.cities[i][1] +'</td>';
        for (w=1;w<=15;w++){
           m += '<TD class=pblevelopt><INPUT id=pbcity'+i+'level'+w+' type=checkbox unchecked=true>Lvl:'+w+'</td>';
        }
     }
     m+='</table><br>'
     t.myDiv.innerHTML = m;

     saveOptions();
     t.checkBarbData();

     for(i=0;i<Seed.cities.length;i++){
        var element = 'pdtotalcity'+i;
        if (t.barbArray[i+1] == undefined) document.getElementById(element).innerHTML = 'No Data';
        else document.getElementById(element).innerHTML =  'Forests:' + t.barbArray[i+1].length;
     }
    
    for(i=0;i<Seed.cities.length;i++){
        for (w=1;w<=15;w++){
            document.getElementById('pbcity'+i+'level'+w).checked = Options.DFOptions.Levels[i+1][w];
        }
    }
    
    document.getElementById('AttSearch').addEventListener('click', function(){t.toggleBarbState(this)} , false);
    document.getElementById('Options').addEventListener('click', t.barbOptions , false);
    document.getElementById('StopSearch').addEventListener('click', t.callStop , false);
    document.getElementById('troopselect').addEventListener('click', t.troopOptions , false);
    var element_class = document.getElementsByClassName('pblevelopt');
    for (k=0;k<element_class.length;k++){
        element_class[k].addEventListener('click', t.saveLevelOptions , false);
    }
   },
  
  saveLevelOptions : function(){
        for(i=0;i<Seed.cities.length;i++){
            Options.DFOptions.Levels[i+1][0]=false;
            for (w=1;w<=15;w++){
                var ele = document.getElementById('pbcity'+i+'level'+w);
                Options.DFOptions.Levels[i+1][w]=ele.checked;
                if (ele.checked)                    
                    Options.DFOptions.Levels[i+1][0]=true;
            }        
        }
        saveOptions();
   },
   
  troopOptions: function(){
  	 var t = Tabs.Barb;
         var troopDef = t.troopDef;
  	 if(t.troopselect == null)	
         t.troopselect = new CPopup ('pbtroopselect', 0, 0, 980, 650, true, function(){t.saveTroops();});
  	 t.troopselect.centerMe (mainPop.getMainDiv());  
  	 var z= '<DIV id=pbTraderDivD class=divHeader align=center>TROOP SELECTION</div><TABLE width=100%><TR>';
	 z+='<TD></td>';
	 for(var j=0; j<15; j++)
		z+='<TD>Level '+(j+1)+'</td>';
	 z+='</tr>';		 		

	 for(i=0;i<troopDef.length;i++){
	 	z += '<TR><TD align=center><img src="'+IMGURL+'units/unit_'+troopDef[i][1]+'_30.jpg" title="'+troopDef[i][0]+'"></td>';
	 	for(var j=0; j<15; j++){
			if (!Options.DFOptions.Troops[j+1]) Options.DFOptions.Troops[j+1] = {};
             z += '<TD><INPUT id="level'+j+'troop'+i+'" type=text size=5 maxlength=6 value="'+(Options.DFOptions.Troops[j+1][i+1]?Options.DFOptions.Troops[j+1][i+1]:0)+'" /></td>';
	 	}
	 	z+='</tr>';		 		
	 }

	 z+='<TR><TD>MIN dist</td>';		 		
	 for(var j=0; j<15; j++){
	 	z+='<TD><INPUT id=Mindist'+j+' type=text size=3 maxlength=3 value="'+Options.DFOptions.MinDistance[j+1]+'"</td>';
	 }
	 z+='</tr>';		 		
	 z+='<TR><TD>MAX dist</td>';		 		
	 for(var j=0; j<15; j++){
	 	z+='<TD><INPUT id=dist'+j+' type=text size=3 maxlength=3 value="'+Options.DFOptions.Distance[j+1]+'"</td>';
	 }
	 z+='</tr>';		 		
	 z+='</table>';
	 t.troopselect.getMainDiv().innerHTML = z;
	 t.troopselect.show(true);
  },  
  barbOptions: function(){
       var t = Tabs.Barb;
       if(t.barboptions == null)    
        t.barboptions = new CPopup ('pbbarboptions', 0,0, 400,400, true);
       t.barboptions.centerMe (mainPop.getMainDiv());  
     t.barboptions.getTopDiv().innerHTML = '<CENTER><b>Dark Forest Options for server '+getServerId()+'</b></CENTER>';
      var y = '<DIV style="max-height:400px; overflow-y:auto;"><DIV class=divHeader align=center>OPTIONS</div><TABLE width=100%>';
       y +='<TR><TD style="margin-top:5px; text-align:center;"><INPUT id=pbresetbarbs type=submit value="Reset Forests"></td>';
       y +='<TD style="margin-top:5px; text-align:center;"><INPUT id=pbpaintbarbs type=submit value="Show forests"></td>';
       y += '<TD><SELECT id=pbcity type=list></td></tr></table>';
       y +='<table width=100%><TD colspan=2 style="margin-top:5px; text-align:center;"><DIV class=pbStat> OPTIONS </div></td>';
     y +='<TR><TD>Attack interval: </td><td><INPUT id=pbsendint type=text size=4 maxlength=3 value='+ Options.DFOptions.SendInterval +' \> seconds</td></tr>';
     y +='<TR><TD>Max search distance: </td><td><INPUT id=pbmaxdist type=text size=4 maxlength=3 value='+ Options.DFOptions.MaxDistance +' \></td></tr>';
     y +='<TR><TD>Keep rallypoint slot(s) free: </td><Td><INPUT id=rallyclip type=text size=3 maxlength=2 value="'+Options.DFOptions.RallyClip+'" \> </td></tr>';
     y +='<TR><TD><INPUT id=pbreset type=checkbox '+(Options.DFOptions.UpdateEnabled?'CHECKED':'')+'\> Reset search every </td><td><INPUT id=pbresetint type=text size=4 maxlength=3 value='+Options.DFOptions.UpdateInterval+' \>minutes</td></tr>';
     y +='<TR><TD> Skip city search after </td><td><INPUT id=barbstopsearch type=text size=3 value='+Options.DFOptions.stopsearch+' \> tries.</td></tr>';
     y +='<TR><TD>Method : </td><Td> '+htmlSelector({distance:'Closest first', level:'Highest level first', lowlevel:'Lowest level first'}, Options.DFOptions.Method, 'id=pbmethod')+'</td></tr>';
     y +='<TR><TD>Knight priority : </td><td>'+htmlSelector({0:'Lowest combat skill', 1:'Highest combat skill'}, Options.DFOptions.knightselector, 'id=barbknight')+'</td></tr>';
     y +='<tr><td>Minimum knight Combat level to send: </td><td><input id=barbMinKnight type=text size=3 value='+Options.DFOptions.barbMinKnight+' \></td></tr>';
     y +='<tr><td>Maximum knight Combat level to send: </td><td><input id=barbMaxKnight type=text size=3 value='+Options.DFOptions.barbMaxKnight+' \></td></tr>';
     y +='<tr><td>Stop hitting Dark forests when Aetherstone in city is more than: </td><td><INPUT id=pbaothreshold type=text size=7 maxlength=8 value='+ Options.DFOptions.threshold +' \></td></tr>';
     y +='<tr><td>Add toggle button: </td><td><INPUT id=pbdftoggle type=checkbox '+(Options.DFOptions.dfbtns?'CHECKED':'')+' \></td></tr>';
     y+='</table></td></tr></table>';
       t.barboptions.getMainDiv().innerHTML = y;
       t.barboptions.show(true);
    
    document.getElementById('pbcity').options.length=0;
    for (i=0;i<Seed.cities.length;i++){
        var o = document.createElement("option");
        o.text = Seed.cities[i][1]
        o.value = i+1;
        document.getElementById("pbcity").options.add(o);
    }
       
    document.getElementById('pbdftoggle').addEventListener('click', function(){
        Options.DFOptions.dfbtns=document.getElementById('pbdftoggle').checked;
        saveOptions();
    },false);
    document.getElementById('pbpaintbarbs').addEventListener('click', function(){
            t.showBarbs(document.getElementById("pbcity").value,Seed.cities[document.getElementById("pbcity").value -1][1]);
            
    },false);
    document.getElementById('pbresetbarbs').addEventListener('click', t.deletebarbs,false);
    document.getElementById('pbmethod').addEventListener('change', function(){
        Options.DFOptions.Method=document.getElementById('pbmethod').value;
        saveOptions();
        t.checkBarbData();
    },false);
    document.getElementById('barbknight').addEventListener('change', function(){
        Options.DFOptions.knightselector=document.getElementById('barbknight').value;
        saveOptions();
    },false);
    document.getElementById('pbreset').addEventListener('change', function(){
        Options.DFOptions.UpdateEnabled=document.getElementById('pbreport').checked;
        saveOptions();
    },false);
    document.getElementById('pbresetint').addEventListener('change', function(){
        Options.DFOptions.UpdateInterval=parseInt(document.getElementById('pbresetint').value);
        saveOptions();
    },false);
    document.getElementById('pbsendint').addEventListener('change', function(){
        if(parseInt(document.getElementById('pbsendint').value) <5) 
            document.getElementById('pbsendint').value = 5; //Set minimum attack interval to 5 seconds
        Options.DFOptions.SendInterval=parseInt(document.getElementById('pbsendint').value);
        saveOptions();
    },false);
    document.getElementById('pbmaxdist').addEventListener('change', function(){
        if(parseInt(document.getElementById('pbmaxdist').value) > 75)
            document.getElementById('pbmaxdist').value = 75;
        Options.DFOptions.MaxDistance=parseInt(document.getElementById('pbmaxdist').value);
        saveOptions();
    },false);
    document.getElementById('rallyclip').addEventListener('change', function(){
        Options.DFOptions.RallyClip=parseInt(document.getElementById('rallyclip').value);
        saveOptions();
    },false);
    
    document.getElementById('barbMinKnight').addEventListener('change', function(){
        Options.DFOptions.barbMinKnight=parseInt(document.getElementById('barbMinKnight').value);
        saveOptions();
    },false);
    document.getElementById('barbMaxKnight').addEventListener('change', function(){
        Options.DFOptions.barbMaxKnight=parseInt(document.getElementById('barbMaxKnight').value);
        saveOptions();
    },false);
    document.getElementById('pbaothreshold').addEventListener('change', function(){
        Options.DFOptions.threshold=parseInt(document.getElementById('pbaothreshold').value);
        saveOptions();
    },false);
    document.getElementById('barbstopsearch').addEventListener('change', function(){
        document.getElementById('barbstopsearch').value = parseInt(document.getElementById('barbstopsearch').value)>0?document.getElementById('barbstopsearch').value:1
        Options.DFOptions.stopsearch=parseInt(document.getElementById('barbstopsearch').value);
        saveOptions();
    },false);  
  },
  
    showBarbs: function (citynumber,cityname) {
        var t = Tabs.Barb;
        var popTradeRoutes = null;
        t.popTradeRoutes = new CPopup('pbShowBarbs', 0, 0, 500, 500, true, function() {clearTimeout (1000);});
        var m = '<DIV style="max-height:460px; height:460px; overflow-y:auto"><TABLE align=center cellpadding=0 cellspacing=0 width=100% class="pbShowBarbs" id="pbBars">';       
        t.popTradeRoutes.getMainDiv().innerHTML = '</table></div>' + m;
        t.popTradeRoutes.getTopDiv().innerHTML = '<TD align=center><B>Dark Forests for city: '+cityname+'</td>';
        t.paintBarbs(citynumber,cityname);
        t._addTabHeader(citynumber,cityname);
        t.popTradeRoutes.show(true)    ;
     },
      paintBarbs: function(i,cityname){
            var t = Tabs.Barb;
		if (t.barbArray[i] == undefined) return;
                for (k=(t.barbArray[i].length-1);k>=0;k--){t._addTab(i,cityname,k+1,t.barbArray[i][k]['x'], t.barbArray[i][k]['y'],t.barbArray[i][k]['dist'], t.barbArray[i][k]['level']);}
        },
      
  _addTab: function(citynumber,cityname,queueId,X,Y,dist,level){
     var t = Tabs.Barb;
     var row = document.getElementById('pbBars').insertRow(0);
     row.vAlign = 'top';
     row.insertCell(0).innerHTML = queueId;
     row.insertCell(1).innerHTML = X;
     row.insertCell(2).innerHTML = Y;
     row.insertCell(3).innerHTML = dist;
     row.insertCell(4).innerHTML = level;
     row.insertCell(5).innerHTML = '<a class="button20" id="barbdel_' + queueId + '"><span>Delete</span></a>';
     document.getElementById('barbdel_' + queueId).addEventListener('click', function(){
        t.deleteBarbElement(citynumber,queueId,cityname, true);
     }, false);
  },
     
  _addTabHeader: function(citynumber,cityname) {
     var t = Tabs.Barb;
     var row = document.getElementById('pbBars').insertRow(0);
     row.vAlign = 'top';
     row.insertCell(0).innerHTML = "City";
     row.insertCell(1).innerHTML = "X";
     row.insertCell(2).innerHTML = "Y";
     row.insertCell(3).innerHTML = "Dist.";
     row.insertCell(4).innerHTML = "Level";
     row.insertCell(5).innerHTML = '<a class="button20" id="barbdelAll"><span>Delete ALL</span></a>';
     document.getElementById('barbdelAll').addEventListener('click', function(){
        t.deleteBarbsCity(citynumber,cityname);
     }, false);
  },   
       
  deleteBarbElement: function(citynumber,queueId,cityname,showFlag){
      var t = Tabs.Barb;
      var queueId = parseInt(queueId);
      var myarray = t.barbArray[citynumber];
      if (myarray) {
        myarray.splice((queueId-1), 1);
        GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + citynumber + '_' + getServerId(), JSON2.stringify(myarray));
        t.checkBarbData();
        if (showFlag) t.showBarbs(citynumber,cityname);
      }
      else
      {
          //logit("not found");
      }
  },
      
  deleteBarbsCity: function(citynumber,cityname){
      var t = Tabs.Barb;
      var queueId = parseInt(queueId);
      Options.DFOptions.Update[citynumber][1] = 0;
      GM_deleteValue('DF_' + unsafeWindow.tvuid + '_city_' + citynumber + '_' + getServerId())
      GM_deleteValue('DF_' + Seed.player['name'] + '_city_' + citynumber + '_' + getServerId())
      t.checkBarbData();
      t.showBarbs(citynumber,cityname);
      //reloadKOC();
  },  
  
  saveTroops: function(){
      var t = Tabs.Barb;
    for(i=0;i<15;i++){
           for (w=0;w<t.troopDef.length;w++){
               Options.DFOptions.Troops[i+1][w+1] = parseIntNan(document.getElementById('level'+i+'troop'+w).value);
           }
        if(parseIntNan(document.getElementById('dist'+i).value) > Options.DFOptions.MaxDistance)
            document.getElementById('dist'+i).value = Options.DFOptions.MaxDistance;
        Options.DFOptions.MinDistance[i+1] = parseIntNan(document.getElementById('Mindist'+i).value);
           Options.DFOptions.Distance[i+1] = parseIntNan(document.getElementById('dist'+i).value);             
     }
     saveOptions();
  },
  
   deletebarbs: function(){
    for (i=1;i<=Seed.cities.length;i++){
        Options.DFOptions.Update[i][1] = 0;
        GM_deleteValue('DF_' + unsafeWindow.tvuid + '_city_' + i + '_' + getServerId())
        GM_deleteValue('DF_' + Seed.player['name'] + '_city_' + i + '_' + getServerId())
    }
    //reloadKOC();
   },

  checkBarbData: function(){
      var t = Tabs.Barb;
    if(!Options.DFOptions.Running) return;
      for (var citynum=1;citynum<=Seed.cities.length;citynum++){
      
        // if(GM_getValue('Barbs_' + Seed.player['name'] + '_city_' + citynum + '_' + getServerId())) //Remove old auto barb data
            // GM_deleteValue('Barbs_' + Seed.player['name'] + '_city_' + citynum + '_' + getServerId());
      
        if (!Options.DFOptions.Levels[citynum][0]) continue; //Skip city if not selected
        
        t.barbArray[citynum] = [];
          var myarray = JSON2.parse(GM_getValue('DF_' + unsafeWindow.tvuid + '_city_' + citynum + '_' + getServerId(),"[]"));
          if (myarray == null) myarray = JSON2.parse(GM_getValue('DF_' + Seed.player['name'] + '_city_' + citynum + '_' + getServerId(),"[]"));
        
        if ((myarray == undefined || myarray.length == 0) && t.searchRunning==false) {
              t.lookup=citynum;
            if(parseInt(Options.DFOptions.Update[t.lookup][1]) >= parseInt(Options.DFOptions.stopsearch)) continue; //Skip if search results are empty more than X times
            t.searchRunning = true;
              t.opt.startX = parseInt(Seed.cities[(citynum-1)][2]);
              t.opt.startY = parseInt(Seed.cities[(citynum-1)][3]);  
              t.clickedSearch();
          }
        if (myarray){
            if(Options.DFOptions.Method == 'distance') t.barbArray[citynum] = myarray.sort(function sortBarbs(a,b) {a = a['dist'];b = b['dist'];return a == b ? 0 : (a < b ? -1 : 1);});
			if(Options.DFOptions.Method == 'level') t.barbArray[citynum] = myarray.sort(function sortBarbs(a,b) {a = a['level']+a['dist'];b = b['level']+b['dist'];return parseInt(a) == parseInt(b) ? 0 : (parseInt(a) > parseInt(b) ? -1 : 1);});
            if(Options.DFOptions.Method == 'lowlevel') t.barbArray[citynum] = myarray.sort(function sortBarbs(a,b) {a = a['level']+a['dist'];b = b['level']+b['dist'];return parseInt(a) == parseInt(b) ? 0 : (parseInt(a) < parseInt(b) ? -1 : 1);});
              GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + citynum + '_' + getServerId(), JSON2.stringify(t.barbArray[citynum]));
          }
        Options.DFOptions.Update[citynum][1] = 0;
        saveOptions();
      }
        t.nextattack = setTimeout(t.getnextCity, parseInt((1+Options.DFOptions.SendInterval)*1000));
  },
  
  toggleBarbState: function(obj){
     obj = document.getElementById('AttSearch');
    var t = Tabs.Barb;
    if (Options.DFOptions.Running == true) {
        Options.DFOptions.Running = false;
        obj.value = "Attack = OFF";
        if(document.getElementById('DFToggleTab'))document.getElementById('DFToggleTab').innerHTML = '<span style="color: #CCC">'+unsafeWindow.g_js_strings.commonstr.darkForest+': Off</span>';
        saveOptions();
        t.nextattack = null;
    } else {
        Options.DFOptions.Running = true;
        obj.value = "Attack = ON";
        if(document.getElementById('DFToggleTab'))document.getElementById('DFToggleTab').innerHTML = '<span style="color: #FFFF00">'+unsafeWindow.g_js_strings.commonstr.darkForest+': On</span>';
        saveOptions();
        t.checkBarbData();
        t.nextattack = setTimeout(t.getnextCity, parseInt((1+Options.DFOptions.SendInterval)*1000));
    }
  },
  
  barbing : function(){
       var t = Tabs.Barb;
       var city = t.city;
       citynumber = Seed.cities[city-1][0];
       cityID = 'city' + citynumber;
       t.getAtkKnight(cityID);
       var slots = March.getMarchSlots(citynumber);
      
      //Only send DF if city is not over 750K astone:: rewritten I want df's to farm items and level knights.. who cares about aetherstone?  -baos
      if (Seed.resources[cityID]["rec5"][0] > Number(Options.DFOptions.threshold)) {
         return;
      };
       var element1 = 'pddatacity'+(city-1);
       if (t.barbArray[city].length == 0) document.getElementById(element1).innerHTML = 'In search mode'; else
         document.getElementById(element1).innerHTML = 'Sent: ' + Options.DFOptions.BarbsDone[city];
       var element2 = 'pddataarray'+(city-1);
       document.getElementById(element2).innerHTML =  'RP: (' + slots + '/' + March.getTotalSlots(citynumber) +')';
       if (Number(Number(March.getTotalSlots(citynumber))-Number(slots)) <= Number(Options.DFOptions.RallyClip)) return;
       if (t.knt.toSource() == "[]") return;
       var kid = t.knt[0].ID;
       
       
       if(t.barbArray[city] && t.barbArray[city].length > 0){
        var barbinfo = t.barbArray[city].shift();
       }else if(parseInt(Options.DFOptions.Update[city][1])==0){
        if(!t.searchRunning)t.checkBarbData();
        return;
       } else {
        return;
       };
       var check=0;
       var barblevel = parseInt(barbinfo.level);
        
        if (Options.DFOptions.Levels[city][barbinfo.level])
            check=1;
        
        if (barbinfo.dist < Options.DFOptions.MinDistance[barblevel] || barbinfo.dist > Options.DFOptions.Distance[barblevel]){
            check=0;
            GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + city + '_' + getServerId(), JSON2.stringify(t.barbArray[city]));
            return;
        }
         // check troop levels in city
         var trps = Options.DFOptions.Troops[barblevel];
         var num_troops = 0;
         for (var ii=1; ii<t.troopDef.length+1; ii++) {
            if (parseInt(trps[ii]) > Seed.units[cityID]['unt'+t.troopDef[ii-1][1]]) check = 0;
            num_troops += trps[ii];
         }
         if (num_troops == 0) check = 0;
         
       if (check == 0){
        t.barbArray[city].push(barbinfo);
        GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + city + '_' + getServerId(), JSON2.stringify(t.barbArray[city]));
        return;
       }
       var element = 'pdtotalcity'+(city-1);
        if (t.barbArray[city] == undefined) document.getElementById(element).innerHTML = 'No Data';
        else document.getElementById(element).innerHTML =  'Forests:' + t.barbArray[city].length;
       var xcoord = barbinfo['x'];
       var ycoord = barbinfo['y'];
       t.doBarb(citynumber,city,xcoord,ycoord,barblevel,kid,trps);
       saveOptions();
  },

  getnextCity: function(){
    var t = Tabs.Barb;
    if(!Options.DFOptions.Running) return;
    
    var city = t.city+1;
    if (city>Seed.cities.length){
        city=1;
    }

    for (i=city; i<=Seed.cities.length; i++) {
	if (!Options.DFOptions.Levels[i][0]) continue; //Skip city if not selected
	else {
	  city=i;
	  break;
	}
    }

    t.city = city;
    if(Options.DFOptions.UpdateEnabled){
        var now = unixTime();
        if(now > parseInt(Options.DFOptions.Update[city][0] + (Options.DFOptions.UpdateInterval*60))){
            Options.DFOptions.Update[city][1]=0;
            t.barbArray[city] = []; //Clears data if last update was more than X minutes
            GM_deleteValue('DF_' + unsafeWindow.tvuid + '_city_' + city + '_' + getServerId())
            GM_deleteValue('DF_' + Seed.player['name'] + '_city_' + city + '_' + getServerId())
			
            GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + city + '_' + getServerId(), JSON2.stringify(t.barbArray[city]));
        }
    }
    
    if(Options.DFOptions.Levels[city][0]){
        t.barbing();
        t.nextattack = setTimeout(t.getnextCity, parseInt((1+Options.DFOptions.SendInterval)*1000));
    } else {
        t.getnextCity();
    }
        
  },
  
  getAtkKnight : function(cityID){
     var t = Tabs.Barb;
     t.knt = new Array();
     for (k in Seed.knights[cityID]){
             if (Seed.knights[cityID][k]["knightStatus"] == 1 && Seed.leaders[cityID]["resourcefulnessKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["politicsKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["combatKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["intelligenceKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.knights[cityID][k]["combat"] >= Options.DFOptions.barbMinKnight && Seed.knights[cityID][k]["combat"] <= Options.DFOptions.barbMaxKnight){
                 t.knt.push ({
                     Name:   Seed.knights[cityID][k]["knightName"],
                     Combat:    Seed.knights[cityID][k]["combat"],
                     ID:        Seed.knights[cityID][k]["knightId"],
                 });
             }
     }
     t.knt = t.knt.sort(function sort(a,b) {
                            a = parseInt(a['Combat']);
                            b = parseInt(b['Combat']);
                            if(parseInt(Options.DFOptions.knightselector) > 0)
                                return a == b ? 0 : (a > b ? -1 : 1);
                            else
                                return a == b ? 0 : (a < b ? -1 : 1);
                            });
  },
    
  doBarb: function(cityID,counter,xcoord,ycoord,level,kid,trps){
          var t = Tabs.Barb;
                   	var dtime = new Date()
          var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
          params.cid=cityID;
          params.type=4;
          params.kid=kid;
          params.xcoord = xcoord;
          params.ycoord = ycoord;
        for (ii=1; ii<parseInt(t.troopDef.length+1); ii++) {
			if(parseInt(trps[ii]) > Seed.units['city'+cityID]['unt'+t.troopDef[ii-1][1]]){
				document.getElementById('dferrorlog').innerHTML = '<FONT color=red>'+dtime.toLocaleString()+' '+Cities.byID[cityID].name+' dark forest failed: Not doing march, not enough units </FONT>';
				return;
			};
            if(parseInt(trps[ii]) > 0)
                params['u'+t.troopDef[ii-1][1]]=trps[ii];
        };

          Options.DFOptions.BarbsTried++;
          document.getElementById('pberror1').innerHTML = 'Tries:'+ Options.DFOptions.BarbsTried;
          
          March.addMarch(params, function(rslt){
           if(rslt.ok) {
                     Options.DFOptions.BarbsDone[counter]++;
                     var element1 = 'pddatacity'+(counter-1);
                     document.getElementById(element1).innerHTML = 'Sent: ' + Options.DFOptions.BarbsDone[counter];
                     var element2 = 'pddataarray'+(counter-1);
               document.getElementById(element2).innerHTML =  'RP: (' + March.getMarchSlots(cityID) + '/' + March.getTotalSlots(cityID) +')';
                     GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + counter + '_' + getServerId(), JSON2.stringify(t.barbArray[counter]));
                     saveOptions();
                   } else {
					   if(rslt.error_code && rslt.msg)document.getElementById('dferrorlog').innerHTML = '<FONT color=red>'+dtime.toLocaleString()+' '+Cities.byID[cityID].name+' dark forest failed: '+rslt.msg+'</FONT>';
                     //logit( inspect(rslt,3,1));
                     if (rslt.error_code != 8 && rslt.error_code != 213 && rslt.error_code == 210) Options.DFOptions.BarbsFailedVaria++;
                     if (rslt.error_code == 213)Options.DFOptions.BarbsFailedKnight++;
                     if (rslt.error_code == 210) Options.DFOptions.BarbsFailedRP++;
                     if (rslt.error_code == 4)document.getElementById('dferrorlog').innerHTML = '<FONT color=red>'+dtime.toLocaleString()+' '+Cities.byID[cityID].name+' dark forest failed: Not enough units</FONT>';
                     if (rslt.error_code == 8) {
						 Options.DFOptions.BarbsFailedTraffic++;
						 t.doBarb(cityID,counter,xcoord,ycoord,level,kid,trps);
						 return;
					 }
                     if (rslt.error_code == 104) {
                       Options.DFOptions.BarbsFailedBog++;
                       GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + counter + '_' + getServerId(), JSON2.stringify(t.barbArray[counter]));
                       new t.barbing();
                       saveOptions();
                     }
                     document.getElementById('pberror2').innerHTML = 'Excess Traffic errors:' + Options.DFOptions.BarbsFailedTraffic;
                     document.getElementById('pberror3').innerHTML = 'Rally Point errors: '+ Options.DFOptions.BarbsFailedRP;
                     document.getElementById('pberror4').innerHTML = 'Knight errors:' + Options.DFOptions.BarbsFailedKnight;
                     document.getElementById('pberror5').innerHTML = 'Other errors:' + Options.DFOptions.BarbsFailedVaria;
                     document.getElementById('pberror6').innerHTML = 'Bog errors:' + Options.DFOptions.BarbsFailedBog;
                     //unsafeWindow.Modal.showAlert(printLocalError((rslt.error_code || null), (rslt.msg || null), (rslt.feedback || null)))
                     }
           
           
           });
       //saveOptions();
  },
  
  clickedSearch : function (){
    var t = Tabs.Barb;
    
    t.opt.maxDistance = parseInt(Options.DFOptions.MaxDistance);
    t.opt.searchDistance = t.opt.maxDistance;
    t.opt.searchShape = 'circle';
    t.mapDat = [];
    t.firstX =  t.opt.startX - t.opt.maxDistance;
    t.firstY =  t.opt.startY - t.opt.maxDistance;
    t.tilesSearched = 0;
    t.tilesFound = 0;
    var element = 'pddatacity'+(t.lookup-1);
   var element2 = 'pddataarray'+(t.lookup-1);
   document.getElementById(element2).innerHTML == '';
   
	t.BlockList = t.MapAjax.generateBlockList(t.firstX,t.firstY,t.opt.maxDistance);
		
	var counter = t.BlockList.length;
	if (counter > MAX_BLOCKS) { counter = MAX_BLOCKS; }

	var curX = t.firstX;
	var curY = t.firstY;
    document.getElementById(element).innerHTML = 'Searching at '+ curX +','+ curY;
		
	t.Blocks = [];
	for (var i=1;i<=counter;i++) {
		t.Blocks.push(t.BlockList.shift());
		t.blocksSearched++;
	}
	var blockString = t.Blocks.join("%2C");
		
	setTimeout (function(){t.MapAjax.LookupMap (blockString, t.mapCallback)}, MAP_DELAY);
  },
  
  mapCallback : function (rslt){
    var t = Tabs.Barb;
    if (!t.searchRunning)
      return;
    if (rslt.ok){
		var cityID = 'city' + Seed.cities[t.lookup-1][0];
		map = rslt.data;
		var tiles = [];
		for(x in Seed.queue_atkp[cityID]) {
			tiles.push(Seed.queue_atkp[cityID][x].toTileId);
		}
	
		for (k in map){
			if (map[k].tileType==54 && Options.DFOptions.Levels[t.lookup][map[k].tileLevel]){
				var dist = distance (t.opt.startX, t.opt.startY, map[k].xCoord, map[k].yCoord);
				if(dist <= parseInt(Options.DFOptions.MaxDistance))
					if(dist <= parseInt(Options.DFOptions.Distance[map[k].tileLevel]))
						if(tiles.indexOf(map[k].tileId) == -1)
							t.mapDat.push ({time:0,x:map[k].xCoord,y:map[k].yCoord,dist:dist,level:map[k].tileLevel});
						//else logit('skipping '+map[k].xCoord+','+map[k].yCoord);
			}
		}
	}
	else {
		if (rslt.BotCode && rslt.BotCode==999) { // map captcha
			var dtime = new Date();
			document.getElementById('dferrorlog').innerHTML = '<FONT color=red>'+dtime.toLocaleString()+' '+Cities.byID[Seed.cities[t.lookup-1][0]].name+' Green Map detected! </FONT>';
		}	
	}
    
	t.tilesSearched += (t.opt.searchDistance*t.opt.searchDistance);

	var element0 = 'pdtotalcity'+(t.lookup-1);
   
	if (t.mapDat.length < 1) document.getElementById(element0).innerHTML = 'No Data';
		else document.getElementById(element0).innerHTML =  'Forests:' + t.mapDat.length;
	var element = 'pddatacity'+(t.lookup-1);
	
	var counter = t.BlockList.length;
	if (counter==0 || t.curY==999) {
		t.stopSearch('Found: ' + t.mapDat.length);
		return;
	}
	if (counter > MAX_BLOCKS) { counter = MAX_BLOCKS; }

	var nextblock = t.BlockList[0];
	var curX = nextblock.split("_")[1];
	var curY = nextblock.split("_")[3];
	document.getElementById(element).innerHTML = 'Searching at '+ curX +','+ curY;

	t.Blocks = [];
	for (var i=1;i<=counter;i++) {
		t.Blocks.push(t.BlockList.shift());
		t.blocksSearched++;
	}
	var blockString = t.Blocks.join("%2C");
	setTimeout (function(){t.MapAjax.LookupMap (blockString, t.mapCallback)}, MAP_DELAY);
  },
  
  callStop: function(){
    var t = Tabs.Barb;
    t.curY=999;
    t.stopSearch('Found: ' + t.mapDat.length);
  },
  
  stopSearch : function (msg){
    var t = Tabs.Barb;
    var element = 'pddatacity'+(t.lookup-1);
        document.getElementById(element).innerHTML = msg;
    GM_setValue('DF_' + unsafeWindow.tvuid + '_city_' + t.lookup + '_' + getServerId(), JSON2.stringify(t.mapDat));
    Options.DFOptions.Update[t.lookup][0] = unixTime();
    Options.DFOptions.Update[t.lookup][1]++;
    t.searchRunning = false;
    saveOptions();
    t.checkBarbData();
    return;
  },
  
  hide : function (){
  
  },

  show : function (){
  
  },

};
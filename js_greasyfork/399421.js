/******autofarm***********/

Tabs.farm = {
  tabLabel: 'Farm',
  tabOrder : 9999,
  tabColor : 'red',
  myDiv : null,
  MapAjax : new CMapAjax(),
  BlockList : [],
  Blocks : [],
  popFirst : true,
  opt : {},
  nextattack : null,
  updateSeedTimer: null,
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
  helpArray:{},
  FarmArray:{},
  marchArray:[],
  troopDef : [],
  lookup:1,
  city:0,
  deleting:false,
  DipArray: ["friendly","hostile","friendlyToThem","friendlyToYou","neutral","unallied"],
  interval: ["Continuously","1 Hour","2 Hours","3 Hours","6 Hours","12 Hours","24 Hours","29 Hours","36 Hours","2 Days","4 Days"],
	Options : {
		RallyClip: 0,
		Running: false,
		MinMight: 10000000000,
		MaxMight: 999999999999,
		Interval: 1,
		SendInterval: 5,
		MaxDistance: 50,
		Inactive:1,
		MinFarmRes:250,
		DeleteReports:true,
		Troops: {1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0,9: 0,10: 0,11: 0,12: 0,13: 0,14: 0,15: 0,16: 0,17: 0,18: 0,19: 0,20: 0,23: 0,24: 0,25: 0,26: 0,27: 0,28: 0,29: 0,30: 0,31: 0,32: 0,33: 0,34: 0,35: 0,36: 0,37: 0,38: 0,39: 0,40: 0,41: 0,42: 0,43: 0,44: 0,45: 0,46: 0,47: 0,48: 0},
		FarmNumber: {1: 0,2: 0,3: 0,4: 0,5: 0,6: 0,7: 0,8: 0},
		CityEnable: {1: true,2: false,3: false,4: false,5: false,6: false,7: false,8: false},
		CityLevel: {1: false,2: false,3: false,4: false,5: false,6: false,7: false,8: false,9: true,10: true,11: true,12: true,13: true,14: true,15: true},
		Diplomacy: {friendly: false,hostile: true,friendlyToThem: false,friendlyToYou: false,neutral:true,unallied:false},
		FarmMarches: [],
		farmMarches: {},
		Attacks:0,
		Checks:0,
		Farmbtns:false,
	},

	init : function (div){
		var t = Tabs.farm;
		t.myDiv = div;

		for (var ui in unsafeWindow.cm.UNIT_TYPES){
			var i = unsafeWindow.cm.UNIT_TYPES[ui];
			var trp = [];
			trp.push(unsafeWindow.unitcost['unt'+i][0]);
			trp.push(i);
			t.troopDef.push(trp);
		}

		if (!Options.FarmOptions) {
			Options.FarmOptions = t.Options;
		}
		else {
			for (var y in t.Options) {
				if (!Options.FarmOptions.hasOwnProperty(y)) {
					Options.FarmOptions[y] = t.Options[y];
				}
			}
		}

  if(Options.FarmOptions.Farmbtns)AddSubTabLink(unsafeWindow.g_js_strings.grove.farms,t.toggleBarbState, 'FarmToggleTab');
    var m = '<DIV id=pbTowrtDivF class=divHeader align=center>AUTOMATED FARMING FUNCTION</div><TABLE id=pbbarbingfunctions width=100% height=0% class=pbTab><TR align="center">';
     if (Options.FarmOptions.Running == false) {
           m += '<TD><INPUT id=FarmAttSearch type=submit value="Farming = OFF"></td>';
           if(document.getElementById('FarmToggleTab'))document.getElementById('FarmToggleTab').innerHTML = '<span style="color: #CCC">'+unsafeWindow.g_js_strings.grove.farms+': Off</span>';
       } else {
           m += '<TD><INPUT id=FarmAttSearch type=submit value="Farming = ON"></td>';
           if(document.getElementById('FarmToggleTab'))document.getElementById('FarmToggleTab').innerHTML = '<span style="color: #FFFF00">'+unsafeWindow.g_js_strings.grove.farms+': On</span>';
       }
      m +='<TD><INPUT id=pbpaintFarms type=submit value="Show Farms">';
      m += '<SELECT id=pbFarmcity type=list></td></tr></table>';
      m += '</tr></table></div>';

      m += '<DIV id=pbTraderDivD class=divHeader align=center>FARMING STATS</div>';

      m += '<TABLE id=pbfarmstats width=95% height=0% class=pbTab><TR align="left"><TR>';
      for(i=0;i<Seed.cities.length;i++){
              m += '<TD>' + Seed.cities[i][1] +'</td>';
      }
      m+='</tr><TR>';
      for(i=0;i<Seed.cities.length;i++){
              m += '<TD><DIV><span id='+ 'pdtotalFarm' + i +'></span></div></td>';
      }
      m+='</tr><TR>';
      for(i=0;i<Seed.cities.length;i++){
              m += '<TD><DIV><span id='+ 'pddataFarm' + i +'></span></div></td>';
      }
      m+='</tr><TR>'
       for(i=0;i<Seed.cities.length;i++){
              m += '<TD><DIV><span id='+ 'pddataFarmarray' + i +'></span></div></td>';
     }
     m+='</tr></table>';

    m+='<DIV id=FarmCheck></div>';

    m += '<DIV id=pbTraderDivD class=divHeader align=center>FARMING OPTIONS</div>';
    m += '<TABLE id=pbfarmstats width=90% height=0% class=pbTab>';
    m +='<tr><td>Add toggle button: </td><td><INPUT id=pbfarmtoggle type=checkbox '+(Options.FarmOptions.Farmbtns?'CHECKED':'')+' \></td></tr>';
    m += '<TR><TD>Keep rallypoint slot(s) free: </td><TD nowrap><INPUT id=FarmRallyClip type=text size=2 maxlength=2 value=' + Options.FarmOptions.RallyClip +' >';
    m += '  Attacks interval:<INPUT id=FarmAttacksInterval type=text size=2 maxlength=2 value=' + Options.FarmOptions.SendInterval +' sec.></td>';

    m += '<TD>Farm Interval:<SELECT id=FarmInterval type=list>';
    m += '  <INPUT id=FarmReports type=checkbox '+(Options.FarmOptions.DeleteReports?'CHECKED':'')+'> - Delete reports</td></tr>';

    m += '<TR><TD>Search distance(up to 75):</td><TD><INPUT type=text id=FarmRadius size=3 maxlength=3 value='+ Options.FarmOptions.MaxDistance +'>';
	m += '<INPUT id=FarmSearch type=submit value="Search ALL again" style="background-color:#DEDEDE;color:#fff">';
	m +='</td>';
	m +='<TD><INPUT id=pbcompactFarms1 type=submit value="Remove NOT Farms"></td>'
	m +='</tr>';
    m += '<TR><TD>Might:</td>';
    m += '<TD width=50>Min.:<INPUT type=text id=FarmMinMight size=10 maxlength=11 value='+ Options.FarmOptions.MinMight +'></td>';
    m += '<TD>Max.:<INPUT type=text id=FarmMaxMight size=10 maxlength=14 value='+ Options.FarmOptions.MaxMight +'></td></tr>';
    m += '<TR><TD>Farm if inactive for more then: </td>';
    m += '<TD><INPUT type=text id=FarmInactive size=2 value='+ Options.FarmOptions.Inactive +'>days(checked every 23 hours).</td>';
	m += '<TD> Farm is BAD if brought less then: ';
	m += '<INPUT type=text id=FarmBadRess size=2 value='+ Options.FarmOptions.MinFarmRes +'> millions of resources</td>'
	m += '</tr></table></tr>';
	m +='<TABLE id=pbfarmstats width=90% height=0% class=pbTabLined3>'
	m +='<TR><TD>Works only for DISABLED cities:</td>';
	m +='<TD><INPUT id=pbFarmSearch2 type=submit value="Search again"></td>';
    m +='<TD><INPUT id=pbcompactFarms2 type=submit value="Remove BAD Farms"></td>';
    m +='<TD><INPUT id=pbcompactFarms3 type=submit value="Reset collected resources info"></td>'
	m +='</tr></table>';
    m += '<TABLE id=pbfarmstats width=90% height=0% class=pbTab><TR align="left"><TR><TD width=100>City:</td>';
    for (i=1;i<=Seed.cities.length;i++) {
         m+='<TD class=pbCityEn><INPUT id=CityEnable'+ i +'  type=checkbox '+(Options.FarmOptions.CityEnable[i]?'CHECKED':'')+'>'+ Seed.cities[i-1][1] +'</td>';
     }
    m += '</tr></table><TABLE id=pbfarmstats width=90% height=0% class=pbTab><TR align="left"><TD width=100>City Level:</td>';
    for (i=1;i<=15;i++) {
         m+='<TD class=pbCityOpt><INPUT id=CityLevel'+ i +'  type=checkbox '+(Options.FarmOptions.CityLevel[i]?'CHECKED':'')+'>'+ i +'</td>';
     }
    m += '</tr></table><TABLE id=pbfarmstats width=90% height=0% class=pbTab><TR align="left"><TR><TD width=100>Diplomacy:</td>';
    for (i=0;i<t.DipArray.length;i++) {
         m+='<TD class=pbDipOpt><INPUT id=Diplomacy'+ t.DipArray[i] +'  type=checkbox '+(Options.FarmOptions.Diplomacy[t.DipArray[i]]?'CHECKED':'')+'>'+ t.DipArray[i] +'</td>';
     }
    m+='</tr></table>';

    var icon_link = 'units/';
	var dude = unsafeWindow.unitnamedesctranslated;
     m += '<DIV id=pbTraderDivD class=divHeader align=center>FARMING TROOPS</div>';
		var c = 0;
		var LineBreak = 6;
		if (GlobalOptions.btWinSize.x == 750) {LineBreak = 4;}
		if (GlobalOptions.btWinSize.x == 1250) {LineBreak = 8;}

		m += '<TABLE id=pbaddreasignroute width=100% height=0% class=pbTab><TR align="center">';
		for (i=1; i<parseInt(t.troopDef.length+1); i++) {
			var n = '<td><table class=xtab cellspacing=0 cellpadding=0><tr style="vertical-align:top;"><td rowspan=2 width="30px"><img src='+IMGURL+icon_link+'unit_'+t.troopDef[i-1][1]+'_50.jpg title='+dude['unt'+t.troopDef[i-1][1]][0]+'></td><td>'+dude['unt'+t.troopDef[i-1][1]][0]+'</td></tr>';
			n += '<tr><td><INPUT class=pbTroopOpt id="FarmTroop'+i+'" type=text size=5 maxlength=12 value="'+parseIntNan(Options.FarmOptions.Troops[i])+'" \></td></tr></table></td>';
			if (c%LineBreak==0) m+= '</tr><tr>';
			m+=n;
			c++;
		}

        m += '</tr></table><br>&nbsp;';

     t.myDiv.innerHTML = m;
      t.checkFarmData();
       if(t.nextattack == null) t.nextattack = setInterval(t.getnextCity, parseInt(Math.random()*3)+Options.FarmOptions.SendInterval*1000);
	 if (Options.FarmOptions.Running == true)  {
	 setInterval(t.startdeletereports,(120000));
     setInterval( t.checkMarches ,parseInt(Math.random()*3)+14*1000);
	 }
    document.getElementById('pbfarmtoggle').addEventListener('click', function(){
        Options.FarmOptions.Farmbtns=document.getElementById('pbfarmtoggle').checked;
        saveOptions();
    },false);
     document.getElementById('pbFarmcity').options.length=0;
        for (i=0;i<Seed.cities.length;i++){
            var o = document.createElement("option");
            o.text = Seed.cities[i][1]
            o.value = i+1;
            document.getElementById("pbFarmcity").options.add(o);
    }
    document.getElementById('FarmInterval').options.length=0;
        for (i=0;i<t.interval.length;i++){
            var o = document.createElement("option");
            o.text = t.interval[i];
            o.value = i;
            document.getElementById("FarmInterval").options.add(o);
    }
    document.getElementById('FarmInterval').value = Options.FarmOptions.Interval;
    for(i=0;i<Seed.cities.length;i++){
            var elem = 'pdtotalFarm'+i;
            if (t.FarmArray[i+1] == undefined) document.getElementById(elem).innerHTML = 'No Data';
            else {
					var l_ok_farms =0;
			                 for (a=0;a<t.helpArray[i+1].length;a++){
							 if ((t.helpArray[i+1][a]['DaysInactive']=='?') ||(t.helpArray[i+1][a]['DaysInactive']> Options.FarmOptions.Inactive)) l_ok_farms++;
							 }
			document.getElementById(elem).innerHTML =  '' + l_ok_farms+'/'+t.FarmArray[i+1].length +'/'+ t.helpArray[i+1].length+'';
			}
    }
    document.getElementById('FarmInterval').addEventListener('change', function(){
            Options.FarmOptions.Interval = document.getElementById('FarmInterval').value;
            saveOptions();
    } , false);
    document.getElementById('FarmRallyClip').addEventListener('change', function(){
            Options.FarmOptions.RallyClip = document.getElementById('FarmRallyClip').value;
            saveOptions();
    } , false);
    document.getElementById('FarmAttacksInterval').addEventListener('change', function(){
            Options.FarmOptions.SendInterval = document.getElementById('FarmAttacksInterval').value;
            saveOptions();
    } , false);


    document.getElementById('FarmReports').addEventListener('change', function(){
            Options.FarmOptions.DeleteReports = document.getElementById('FarmReports').checked;
            saveOptions();
    } , false);
    document.getElementById('FarmRadius').addEventListener('change', function(){
            Options.FarmOptions.MaxDistance = parseInt(document.getElementById('FarmRadius').value);
            saveOptions();
    } , false);
    document.getElementById('FarmAttSearch').addEventListener('click', function(){t.toggleBarbState(this)} , false);
    document.getElementById('FarmSearch').addEventListener('click', function(){
        for (i=1;i<=Seed.cities.length;i++) {
			GM_deleteValue('Farms_' + unsafeWindow.tvuid + '_city_' + i + '_' + getServerId());
			GM_deleteValue('Farms_' + Seed.player['name'] + '_city_' + i + '_' + getServerId());
		}
        for(i=0;i<Seed.cities.length;i++){
                var elem = 'pdtotalFarm'+i;
                document.getElementById(elem).innerHTML = 'No Data';
        }
        t.checkFarmData();
    } , false);

    document.getElementById('pbFarmSearch2').addEventListener('click', function(){
	        for (i=1;i<=Seed.cities.length;i++) {
				if (Options.FarmOptions.CityEnable[i] == false) {
					GM_deleteValue('Farms_' + unsafeWindow.tvuid + '_city_' + i + '_' + getServerId());
					GM_deleteValue('Farms_' + Seed.player['name'] + '_city_' + i + '_' + getServerId());
				}
			}
        for(i=0;i<Seed.cities.length;i++){
                var elem = 'pdtotalFarm'+i;
                	if (Options.FarmOptions.CityEnable[i+1] == false)document.getElementById(elem).innerHTML = 'No Data';
        }
        t.checkFarmData();
    } , false);
	    document.getElementById('pbcompactFarms1').addEventListener('click', function(){

        for(i=0;i<Seed.cities.length;i++){
                var elem = 'pdtotalFarm'+i;
               if (Options.FarmOptions.CityEnable[i] == false) document.getElementById(elem).innerHTML = 'No Data';
        }
        t.compactFarmData();
    } , false);
	    document.getElementById('pbcompactFarms2').addEventListener('click', function(){
        for(i=0;i<Seed.cities.length;i++){
                var elem = 'pdtotalFarm'+i;
                document.getElementById(elem).innerHTML = 'No Data';
        }
        t.compactFarmData2();
    } , false);
	    document.getElementById('pbcompactFarms3').addEventListener('click', function(){
        for(i=0;i<Seed.cities.length;i++){
                var elem = 'pdtotalFarm'+i;
                document.getElementById(elem).innerHTML = 'No Data';
        }
        t.compactFarmData3();
    } , false);
    document.getElementById('pbpaintFarms').addEventListener('click', function(){t.showFarms(document.getElementById("pbFarmcity").value,Seed.cities[document.getElementById("pbFarmcity").value -1][1]);},false);

    document.getElementById('FarmMinMight').addEventListener('change', function(){
            Options.FarmOptions.MinMight = parseInt(document.getElementById('FarmMinMight').value);
            t.FilterFarms();
            saveOptions();
    } , false);
    document.getElementById('FarmMaxMight').addEventListener('change', function(){
            Options.FarmOptions.MaxMight = parseInt(document.getElementById('FarmMaxMight').value);
            t.FilterFarms();
            saveOptions();
    } , false);
    document.getElementById('FarmInactive').addEventListener('change', function(){
            Options.FarmOptions.Inactive = parseInt(document.getElementById('FarmInactive').value);
            t.FilterFarms();
            saveOptions();
    } , false);
    document.getElementById('FarmBadRess').addEventListener('change', function(){
            Options.FarmOptions.MinFarmRes = parseInt(document.getElementById('FarmBadRess').value);
            t.FilterFarms();
            saveOptions();
    } , false);



    var element = document.getElementsByClassName('pbTroopOpt');
     for (k=0;k<element.length;k++){
            element[k].addEventListener('change', function(){
                    for (i=1; i<parseInt(t.troopDef.length+1); i++) {
                        Options.FarmOptions.Troops[i] = parseIntNan(document.getElementById('FarmTroop' + i).value);
                        saveOptions();
                    }
            }, false);
      }

    element = document.getElementsByClassName('pbCityOpt');
     for (k=0;k<element.length;k++){
            element[k].addEventListener('change', function(){
                    for (i=1;i<=15;i++){
                        Options.FarmOptions.CityLevel[i] = document.getElementById('CityLevel' + i).checked;
                        saveOptions();
                    }
                    t.FilterFarms();
            }, false);
      }

    element = document.getElementsByClassName('pbCityEn');
     for (k=0;k<element.length;k++){
            element[k].addEventListener('change', function(){
                    for (i=1;i<=Seed.cities.length;i++){
                        Options.FarmOptions.CityEnable[i] = document.getElementById('CityEnable' + i).checked;
                        saveOptions();
                    }
                    t.FilterFarms();
            }, false);
      }

    element = document.getElementsByClassName('pbDipOpt');
     for (k=0;k<element.length;k++){
            element[k].addEventListener('change', function(){
                    for (i=0;i<t.DipArray.length;i++){
                        Options.FarmOptions.Diplomacy[t.DipArray[i]] = document.getElementById('Diplomacy' + t.DipArray[i]).checked;
                        saveOptions();
                    }
                    t.FilterFarms();
            }, false);

      }

   },


    checkMarches: function () {
        var t = Tabs.farm;
        for (i=0;i<Options.FarmOptions.FarmMarches.length;i++){
                var cityId = "city"+ Options.FarmOptions.FarmMarches[i]["cityId"];
                var cityNo = Options.FarmOptions.FarmMarches[i]["city"];
				var marchID = Options.FarmOptions.FarmMarches[i]["marchId"];
				var farmNo  = Options.FarmOptions.FarmMarches[i]["number"]
				var marchId = "m" + marchID;
                if (Seed.queue_atkp[cityId][marchId] !=undefined){
					var l_marchStatus = Seed.queue_atkp[cityId][marchId].marchStatus;
				     if (Seed.queue_atkp[cityId][marchId].marchType==4) {
                            if ((l_marchStatus==8 &&Seed.queue_atkp[cityId][marchId].hasUpdated)||(l_marchStatus==5)){
			//actionLog('CityNo '+cityNo + '; i ='+i+'; farmNo'+farmNo+';marchID-'+marchID+';marchstatus'+l_marchStatus+'. '+Seed.queue_atkp[cityId][marchId].hasUpdated);

            Options.FarmOptions.Checks++;
            Options.FarmOptions.FarmMarches.splice(i,1);
			saveOptions();
            //document.getElementById('FarmCheck').innerHTML = "Attacks: " + Options.FarmOptions.Attacks + " - Checks:" +			Options.FarmOptions.Checks+' (Last city '+cityNo+')';

			t.getRetMarchInfo (marchID,cityNo,farmNo,
			parseInt(t.FarmArray[cityNo][farmNo]["Gold"]),
			parseInt(t.FarmArray[cityNo][farmNo]["Food"]),
			parseInt(t.FarmArray[cityNo][farmNo]["Wood"]),parseInt(t.FarmArray[cityNo][farmNo]["Stone"]),
			parseInt(t.FarmArray[cityNo][farmNo]["Ore"]),0,parseInt(t.helpArray[cityNo][farmNo]["empty"]));

            saveOptions();
                            }
						}
                } else {
                    Options.FarmOptions.FarmMarches.splice(i,1);
                    saveOptions();
                }
        }
     },

   checkInactives : function (citynumber,city,FarmNumber,xcoord,ycoord,kid,uid,trps){
        var t = Tabs.farm;
        var now = new Date().getTime()/1000.0;
        var hours = (now - t.FarmArray[city][FarmNumber]['LastCheck']) / 3600;
        if (t.FarmArray[city][FarmNumber]['DaysInactive'] == "?" || hours > 12){
                var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
                params.pid = uid;
                new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/viewCourt.php" + unsafeWindow.g_ajaxsuffix, {
                         method: "post",
                          parameters: params,
                          onSuccess: function (rslt) {
                                    var lastLogin = rslt.playerInfo.lastLogin;
                                    var fullDate = lastLogin.substr(0,4) +", "+ lastLogin.substr(5,2) +", "+ lastLogin.substr(8,2) ;
                                    var time = new Date (fullDate).getTime()/1000;
                                    var days = Math.floor((now - time) / 86400);
                                    t.FarmArray[city][FarmNumber]['DaysInactive'] = days;
			var AllianceName = rslt.playerInfo.allianceName;
           t.FarmArray[city][FarmNumber]["AllianceName"] = AllianceName;
		   if (!(!!AllianceName)) {t.FarmArray[city][FarmNumber]["Diplomacy"] = 'unallied';t.FarmArray[city][FarmNumber]["AllianceName"]="";}
		   else { if (t.FarmArray[city][FarmNumber]["Diplomacy"] == 'unallied') t.FarmArray[city][FarmNumber]["Diplomacy"]='neutral' };
	       t.FarmArray[city][FarmNumber]["might"] = rslt.playerInfo.might;
                                    for (i=0;i<t.helpArray[city].length;i++){
                                                 if (xcoord == parseInt(t.helpArray[city][i]['x']) && ycoord == parseInt(t.helpArray[city][i]['y'])){
                                                    t.helpArray[city][i]['DaysInactive'] = days;
                                                    t.helpArray[city][i]['LastCheck'] = now;
													t.helpArray[city][i] ["AllianceName"] = rslt.playerInfo.allianceName;
	                                                t.helpArray[city][i] ["might"] = rslt.playerInfo.might;
                                                   }

  //var not_hit_list = 'family pride';//"The Highlanders"
 // if (t.helpArray[city][i]["AllianceName"] == not_hit_list && t.helpArray[city][i]["enabled"]!='true'&&days>2) t.helpArray[city][i]["enabled"] = false;
	//if (parseInt(t.helpArray[city][i]["attacked"]) >1) t.helpArray[city][i]["attacked"] = 1;

                                    }
                                    GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + city + '_' + getServerId(), JSON2.stringify(t.helpArray[city]));

                                    if (days > Options.FarmOptions.Inactive) {
                                        t.doBarb(citynumber,city,FarmNumber,xcoord,ycoord,kid,trps);
                                    } else     {
                                                Options.FarmOptions.FarmNumber[city]++;
                                                saveOptions();
                                                t.barbing();
                                            }
                           },
                          onFailure: function () {
                                    notify ();
                          },
                },true);
        } else {
			var l_inactive_days_koef =1;
			var Diplomacy = t.FarmArray[city][FarmNumber]['Diplomacy'];
	        if (Diplomacy=='unallied') l_inactive_days_koef=0.2;
            if (t.FarmArray[city][FarmNumber]['DaysInactive'] >= Options.FarmOptions.Inactive*l_inactive_days_koef) {
                t.doBarb(citynumber,city,FarmNumber,xcoord,ycoord,kid,trps);
             }     else{
                    Options.FarmOptions.FarmNumber[city]++;
                    saveOptions();
                    t.barbing();
                }
        }
    },
 getRetMarchInfo: function (marchIDs,cityNum,farmNum,l_g,l_f,l_w,l_s,l_o,l_a,l_got_info_times) {
  var t = Tabs.farm;
  var ret = {};
  var l_lost = false;
  var l_enabled = true;
  var ll_got_info = l_got_info_times;
  ret.marchUnits = [];
  ret.returnUnits = [];
  ret.Coords = [];
  ret.reso = [];
 // ret.Coords[0]=-1;ret.Coords[0]=-1;
 // for (ik=0; ik<15; ik++){ ret.marchUnits[ik] = 0;ret.returnUnits[ik] = 0;}
 // for (il=0; il<=5; il++){ret.reso[il] = 0;}

   var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
   params.rid = marchIDs;
   new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/fetchMarch.php" + unsafeWindow.g_ajaxsuffix, {
                         method: "post",
                          parameters: params,
                          onSuccess: function (rslt) {

// rslt.march["knightName"]   parseInt(rslt.march["marchType"]) {1: transport;2: reinforce;3: scout;4: attack;5: reassign}
//switch (parseInt(rslt.march["marchStatus"])){1: marching;2: defending;8: returning;9: aborting; default:undefined}
 //rslt.march["unit" + i + "Return"]
 //for (i=0; i<15; i++){ ret.returnUnits[i] = parseInt(rslt.march["unit" + i + "Return"]);//ret.marchUnits[i] = parseInt(rslt.march["unit" + i + "Count"]);
// }
    var l_debug_on =0;
    var  marchStatus = rslt.march["marchStatus"];
     ret.Coords[0]= parseInt(rslt.march["xCoord"]);ret.Coords[1]=parseInt(rslt.march["yCoord"]);
    ret.reso[0] = parseInt(rslt.march["gold"]);
    for (var j = 1; j <= 5; j++) {ret.reso[j] = parseInt(rslt.march["resource" +j]);}

	                        for (a=0;a<t.helpArray[cityNum].length;a++){
							if (ret.Coords[0] == parseInt(t.helpArray[cityNum][a]['x']) && ret.Coords[1] == parseInt(t.helpArray[cityNum][a]['y'])){

	if (l_debug_on==1 &&(ll_got_info>0||marchStatus ==1)) actionLog('City-'+cityNum+' Farm('+farmNum+')'+marchIDs+'('+ ret.Coords[0]+','+ret.Coords[1]+')'+ '; Res-'+Math.round((ret.reso[0]+ret.reso[1]+ret.reso[2]+ret.reso[3]+ret.reso[4])/1000)+'!!!MARCH_STATUS=' + marchStatus+'. ll_got_info-'+ll_got_info,'FARM');
								if (marchStatus ==1) {myVar2 = setTimeout(function(){t.getRetMarchInfo(marchIDs,cityNum,farmNum,l_g,l_f,l_w,l_s,l_o,l_a,ll_got_info)},10*1000); return;}
                                    for(u=1;u<=15;u++) {
									  var l_ret_units = parseInt(rslt.march["unit"+u+"Return"]);
									  var l_sent_units = parseInt(rslt.march["unit"+u+"Count"]);
										if (l_ret_units < l_sent_units){
                                                l_lost = true;
												actionLog('City-'+cityNum+' Farm('+farmNum+')('+ ret.Coords[0]+','+ret.Coords[1]+')'+'.l_ret_units'+u+'+sent: '+l_ret_units+'/'+l_sent_units,'FARM');
												if (l_ret_units < (l_sent_units*75/100)) l_enabled = false;
										}
									}

if (l_debug_on==1) actionLog('City-'+cityNum+'||FOOD-'+  Math.round(ret.reso[1]/1000000)+ 'M; ORE-'+ Math.round(ret.reso[4]/1000000)+ 'M||;wood-'+ Math.round(ret.reso[2]/1000000)+'M;stone-'+ Math.round(ret.reso[3]/1000000)+'M.'+' Farm('+farmNum+',marchno'+marchIDs+')('+ ret.Coords[0]+','+ret.Coords[1]+')','FARM'); // Before food1-'+t.FarmArray[cityNum][farmNum]["Food"] );
	l_g += ret.reso[0]; l_f += ret.reso[1]; l_w += ret.reso[2]; l_s += ret.reso[3]; l_o += ret.reso[4];

  if (l_f+l_w+l_s+l_o < 1.5*1000*1000) l_enabled = false; // disable farm because it have only less then 1.5 mil res.
  if (ret.reso[5]>0) { actionLog('City-'+cityNum+' Farm have astone ['+ret.reso[5]+'] at ('+ ret.Coords[0]+','+ret.Coords[1]+') !!! :)','FARM');}
  if ((ret.reso[0]+ret.reso[1]+ret.reso[2]+ret.reso[3]+ret.reso[4])/1000000>=(Options.FarmOptions.MinFarmRes*2)) { //actionLog('City-'+cityNum+' Send wags to that FAT Farm ['+parseInt((ret.reso[0]+ret.reso[1]+ret.reso[2]+ret.reso[3]+ret.reso[4])/1000000)+' mil res ] at ('+ ret.Coords[0]+','+ret.Coords[1]+') !!! :)');
   var now = new Date().getTime()/1000.0;
   now = now.toFixed(0);
				     					t.helpArray[cityNum][a]['time'] = now-55*3600;
   }
  										t.helpArray[cityNum][a]['Ore'] = l_o;
										t.helpArray[cityNum][a]["Wood"] = l_w;
                                        t.helpArray[cityNum][a]['Stone'] = l_s;
										t.helpArray[cityNum][a]["Food"] = l_f;
                                        t.helpArray[cityNum][a]["Gold"] = l_g;
                                        t.helpArray[cityNum][a]['enabled'] = l_enabled;
                                        t.helpArray[cityNum][a]['lost'] = l_lost;
										t.helpArray[cityNum][a]['empty'] ++;
								GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + cityNum + '_' + getServerId(), JSON2.stringify(t.helpArray[cityNum]));
  }}

		   },
                          onFailure: function () { }
    },true)
	},
      showFarms: function (citynumber,cityname) {
        var t = Tabs.farm;
        var popTradeRoutes = null;
        t.popTradeRoutes = new CPopup('pbShowFarms', 0, 0, 1100, 485, true, function() {clearTimeout (1000);});
        var m = '<DIV style="max-height:460px; height:460px; overflow-y:auto"><TABLE align=center cellpadding=0 cellspacing=0 width=100% class="pbShowBarbs" id="pbBars">';
        t.popTradeRoutes.getMainDiv().innerHTML = '</table></div>' + m;
        t.popTradeRoutes.getTopDiv().innerHTML = '<TD><center><B>Farms for city: '+cityname+'</center></td>';
        t.paintFarms(citynumber,cityname);
        t._addTabHeader(citynumber,cityname);
        t.popTradeRoutes.show(true)    ;
     },


        ToggleFarms: function(citynumber) {
            var t = Tabs.farm;
            var id=0;
            var element_class = document.getElementsByClassName('Farm');
                   for (d = 1; d <= t.FarmArray[citynumber].length; d++) {
                        id = d-1;
                        var ele = document.getElementById('FarmToggle' + d);
                  if (ele.checked) {
                t.FarmArray[citynumber][id].enabled = true;
                t.FarmArray[citynumber][id].lost = false;
                //t.FarmArray[citynumber][id].empty = 0;
            }
                        else t.FarmArray[citynumber][id].enabled = false;
                }
            for (i=0;i<t.helpArray[citynumber].length;i++){
                    for (j=0;j<t.FarmArray[citynumber].length;j++){
                         if (parseInt(t.FarmArray[citynumber][j]['x']) == parseInt(t.helpArray[citynumber][i]['x']) && parseInt(t.FarmArray[citynumber][j]['y']) == parseInt(t.helpArray[citynumber][i]['y'])) t.helpArray[citynumber][i].enabled = t.FarmArray[citynumber][j].enabled;
                    }
            }
            GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + citynumber + '_' + getServerId(), JSON2.stringify(t.helpArray[citynumber]));
        },

     paintFarms: function(i,cityname){
            var t = Tabs.farm;
			var now = new Date().getTime()/1000.0;
			now = now.toFixed(0);
            for (k=(t.FarmArray[i].length-1);k>=0;k--)
			{
            var Hourss = 0;
			//if (t.FarmArray[i][k]['DaysInactive'] > 5 || t.FarmArray[i][k]['DaysInactive']=='?') {
			if (parseInt(t.FarmArray[i][k]['time'])>0)	Hourss = Math.round((now - parseInt(t.FarmArray[i][k]['time'])) / 3600);

			t._addTab(i,cityname,k+1,t.FarmArray[i][k]['enabled'], t.FarmArray[i][k]['x'], t.FarmArray[i][k]['y'],t.FarmArray[i][k]['dist'], t.FarmArray[i][k]['level'],t.FarmArray[i][k]['AllianceName'], t.FarmArray[i][k]['Diplomacy'], t.FarmArray[i][k]['PlayerName'], t.FarmArray[i][k]['cityName'],t.FarmArray[i][k]['might'], t.FarmArray[i][k]['cityNumber'], t.FarmArray[i][k]['attacked'],t.FarmArray[i][k]['DaysInactive'],t.FarmArray[i][k]['lost'],t.FarmArray[i][k]['empty'],t.FarmArray[i][k]['Ore'],t.FarmArray[i][k]['Wood'],t.FarmArray[i][k]['Stone'],t.FarmArray[i][k]['Food'],t.FarmArray[i][k]['Gold'],
			Hourss
			);
			//}
			}
        },


          _addTab: function(citynumber,cityname,queueId,status,X,Y,dist,level,AllianceName,diplomacy,playerName,cityName,might,cityNumber,attacked,DaysInactive,lost,empty,Ore,Wood,Stone,Food,Gold, last_hit_time){
             var t = Tabs.farm;
             var row = document.getElementById('pbBars').insertRow(0);
             row.vAlign = 'top';
              if (lost) {row.style.color = "red";
			  }else{
             if (!lost) {row.style.color = "brown"; row.style.background = "rgb(246,243,236)";

			 if  (Math.round(Ore /1000000,1) +Math.round(Food /1000000,1)+Math.round(Stone/1000000,1)+Math.round(Wood/1000000,1)+Math.round(Gold/1000000,1)<Options.FarmOptions.MinFarmRes) row.style.color = "black";
 			 if  (Math.round(Ore /1000000,1)+Math.round(Food /1000000,1)>Options.FarmOptions.MinFarmRes*0.70) {row.style.color = "darkgreen";row.style.backgroundColor = "#BDD1A7";}

			 }
			 var l_inactive_days_koef =1;
			 if (diplomacy=='unallied') l_inactive_days_koef=0.2;
             if (Options.FarmOptions.Inactive*l_inactive_days_koef > DaysInactive) row.style.color = "#E8C384"; //"orange";
			 if (!lost &&!status) row.style.color = "gray";}

             row.insertCell(0).innerHTML = queueId;
             row.insertCell(1).innerHTML = coordLink(X,Y);
             row.insertCell(2).innerHTML = dist;
                row.insertCell(3).innerHTML = level;
               row.insertCell(4).innerHTML = AllianceName;
               row.insertCell(5).innerHTML = diplomacy;
                row.insertCell(6).innerHTML = playerName;
               row.insertCell(7).innerHTML = cityName;
                   row.insertCell(8).innerHTML = addCommas(might);
                row.insertCell(9).innerHTML = DaysInactive;
                 row.insertCell(10).innerHTML = attacked;
             row.insertCell(11).innerHTML = '<INPUT class=Farm id="FarmToggle' + queueId + '" type=checkbox>';
                 row.insertCell(12).innerHTML = Math.round(Ore /1000000,1) +'|';
                 row.insertCell(13).innerHTML = Math.round(Food /1000000,1) +'|';
				 row.insertCell(14).innerHTML = Math.round(Stone/1000000,1)+'||';
                 row.insertCell(15).innerHTML = Math.round(Wood/1000000,1)+'|';
                row.insertCell(16).innerHTML = Math.round(Gold /1000000,1)+'|';
				row.insertCell(17).innerHTML = '('+empty +'-' +last_hit_time+'h)'; //Math.round(last_hit_time,2);

            var element_class = document.getElementsByClassName('Farm');
                   for (c = 0; c < element_class.length; c++) {
                        element_class[c].checked = t.FarmArray[citynumber][c].enabled;
                        element_class[c].addEventListener('click', function(){t.ToggleFarms(citynumber)}, false);
                    }
         },

         _addTabHeader: function(citynumber,cityname) {
         var t = Tabs.farm;
             var row = document.getElementById('pbBars').insertRow(0);
             row.vAlign = 'top';
             row.insertCell(0).innerHTML = "Id";
             row.insertCell(1).innerHTML = "Coords";
             row.insertCell(2).innerHTML = "Dist.";
             row.insertCell(3).innerHTML = "Level";
             row.insertCell(4).innerHTML = "Allaince Name";
            row.insertCell(5).innerHTML = "Diplomacy";
            row.insertCell(6).innerHTML = "Player Name";
            row.insertCell(7).innerHTML = "City Name";
            row.insertCell(8).innerHTML = "Might";
            row.insertCell(9).innerHTML = "Inactive";
              row.insertCell(10).innerHTML = "# Attacks";
                 row.insertCell(11).innerHTML = " [on/off] ";
                 row.insertCell(12).innerHTML = "Ore";
                row.insertCell(13).innerHTML = "Food";
                row.insertCell(14).innerHTML = "Stone";
                 row.insertCell(15).innerHTML = "Wood";
                row.insertCell(16).innerHTML = "Gold";
				row.insertCell(17).innerHTML = "Visited";

           },


  startdeletereports : function (){
    var t = Tabs.farm;
    if (!Options.FarmOptions.DeleteReports) return;
    if(!t.deleting){
        t.deleting = true;
        t.fetchbarbreports(0, t.checkbarbreports);
    }
  },
  fetchbarbreports : function (pageNo, callback){
    var t = Tabs.farm;
    var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
    if(pageNo > 0)
        params.pageNo = pageNo;
    new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/listReports.php" + unsafeWindow.g_ajaxsuffix, {
        method: "post",
        parameters: params,
        onSuccess: function (rslt) {
            callback(rslt);
        },
        onFailure: function () {
        },
    });
  },
  checkbarbreports : function (rslt){
    var t = Tabs.farm;
    if(!rslt.ok){
        return;
    }
    if(rslt.arReports.length < 1){
        return;
    }
    var reports = rslt.arReports;
	var now = new Date().getTime()/1000.0;
     now = now.toFixed(0);
// t.helpArray[cityNum][a]['time'] = now-55*3600;
    var totalPages = rslt.totalPages;
        var deletes1 = new Array();
        for(k in reports){
            for (i=1;i<=Seed.cities.length;i++){
                    var x=Seed.cities[i-1]["2"];
                    var y=Seed.cities[i-1]["3"];
                    for (j=0;j<t.FarmArray[i].length;j++){
                                if (reports[k].side1XCoord == x && reports[k].side1YCoord == y && reports[k].side0XCoord == t.FarmArray[i][j]["x"] && reports[k].side0YCoord == t.FarmArray[i][j]["y"]&&(!(t.FarmArray[i][j]['lost']))
								&&(t.FarmArray[i][j]['enabled']||(!(t.FarmArray[i][j]['enabled'])&&(now-t.FarmArray[i][j]['time']<25*60)))
								) {
								deletes1.push(k.substr(2));
								}
                    }
            }
        }
        if(deletes1.length > 0){
            t.deletereports(deletes1);
        } else {
            t.deleting = false;
            return;
        }
  },

  deletereports : function (deletes1){
    var t = Tabs.farm;
    var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
    params.s1rids = deletes1.join(",");
    params.s0rids = '';
    params.cityrids = '';
    new MyAjaxRequest(unsafeWindow.g_ajaxpath + "ajax/deleteCheckedReports.php" + unsafeWindow.g_ajaxsuffix, {
        method: "post",
        parameters: params,
        onSuccess: function (rslt) {
            Seed.newReportCount = parseInt(Seed.newReportCount) - parseInt(deletes1.length);
            t.fetchbarbreports(0, t.checkbarbreports);
        },
        onFailure: function () {
        },
    });
  },

  isMyself: function(userID){
    if(!Seed.players["u"+userID])
        return false;
    if(Seed.players["u"+userID].n == Seed.player.name)
        return true;
    else
        return false;
    return false;
  },

  checkFarmData: function(){
     if(!Options.FarmOptions.Running)return;
      var t = Tabs.farm;
      for (i=1;i<=Seed.cities.length;i++){
        t.helpArray[i] = [];
		  if(!Options.FarmOptions.CityEnable[i])continue;
          var myarray = (GM_getValue('Farms_' + unsafeWindow.tvuid + '_city_' + i + '_' + getServerId()));
          if (myarray == null) myarray = (GM_getValue('Farms_' + Seed.player['name'] + '_city_' + i + '_' + getServerId()));
        if (myarray == undefined && t.searchRunning==false) {
            t.searchRunning = true;
              t.lookup=i;
              t.opt.startX=parseInt(Seed.cities[(i-1)][2]);
              t.opt.startY=parseInt(Seed.cities[(i-1)][3]);
              t.clickedSearch();
          }
        if (myarray != undefined){
            myarray = JSON2.parse(myarray);
            //if(Method == 'distance')
            t.helpArray[i] = myarray.sort(function sortBarbs(a,b) {a = a['dist'];b = b['dist'];return a == b ? 0 : (a < b ? -1 : 1);});
              GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + i + '_' + getServerId(), JSON2.stringify(t.helpArray[i]));
              }
          }
    t.FilterFarms();
  },
 compactFarmData: function(){
      var t = Tabs.farm;
      for (cityNum=1;cityNum<=Seed.cities.length;cityNum++){
	  var n =0;
	  var max_attacks = 0;
	  t.FarmArray[cityNum] = [];

		for (a=0;a<t.helpArray[cityNum].length;a++){
			if ((t.helpArray[cityNum][a]['might']< Options.FarmOptions.MaxMight)&&(
            t.helpArray[cityNum][a]['DaysInactive']=='?'
			|| parseInt(t.helpArray[cityNum][a]['DaysInactive'])>2)) {
			 t.FarmArray[cityNum][n++] = t.helpArray[cityNum][a];
			 }
		}

              GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + cityNum + '_' + getServerId(), JSON2.stringify(t.FarmArray[cityNum]));
    }
    t.FilterFarms();
	reloadKOC();
  },
compactFarmData2: function(){
      var t = Tabs.farm;
	  var l_min_res = Options.FarmOptions.MinFarmRes * 1000000;
      for (cityNum=1;cityNum<=Seed.cities.length;cityNum++){
	   if (!(Options.FarmOptions.CityEnable[cityNum])){
	    var n =0;
	    var max_attacks = 0;
	  	for (a=0;a<t.helpArray[cityNum].length;a++){
			 if (max_attacks < t.helpArray[cityNum][a]['attacked'] ) max_attacks=t.helpArray[cityNum][a]['attacked'];
			}
		if (max_attacks>0) {
		 t.FarmArray[cityNum] = [];
		 for (a=0;a<t.helpArray[cityNum].length;a++){
			var l_o = parseInt(t.helpArray[cityNum][a]['Ore'])
			var l_w = parseInt(t.helpArray[cityNum][a]["Wood"]);
			var l_s = parseInt(t.helpArray[cityNum][a]['Stone']);
			var l_f = parseInt(t.helpArray[cityNum][a]["Food"]);
			var l_g = parseInt(t.helpArray[cityNum][a]["Gold"]);
			var l_attacked = parseInt(t.helpArray[cityNum][a]['empty']);
			if (t.helpArray[cityNum][a]['enabled']&&t.helpArray[cityNum][a]['DaysInactive']!='?' &&(l_attacked<1&&parseInt(t.helpArray[cityNum][a]['DaysInactive'])>3 || (l_attacked>0 && ((l_o+l_w+l_s+l_f+l_g)>l_min_res||(l_o+l_f)>l_min_res*0.70)) )) {
			 t.FarmArray[cityNum][n++] = t.helpArray[cityNum][a];
			}
		 }
              GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + cityNum + '_' + getServerId(), JSON2.stringify(t.FarmArray[cityNum]));
		}
	  }
     }
    t.FilterFarms();
	reloadKOC();
  },
compactFarmData3: function(){
    var t = Tabs.farm;
    for (cityNum=1;cityNum<=Seed.cities.length;cityNum++){
		if (!(Options.FarmOptions.CityEnable[cityNum])){
		 var n =0;
		 t.FarmArray[cityNum] = [];
			for (a=0;a<t.helpArray[cityNum].length;a++){
				if (t.helpArray[cityNum][a]['enabled']){
					t.helpArray[cityNum][a]['Ore']=0;
					t.helpArray[cityNum][a]["Wood"]=0;
					t.helpArray[cityNum][a]['Stone']=0;
					t.helpArray[cityNum][a]["Food"]=0;
					t.helpArray[cityNum][a]["Gold"]=0;
					t.helpArray[cityNum][a]['attacked']=0;
					t.helpArray[cityNum][a]['empty']=0;
				}
				t.FarmArray[cityNum][n++] = t.helpArray[cityNum][a];
			}
            GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + cityNum + '_' + getServerId(), JSON2.stringify(t.FarmArray[cityNum]));
		}
    }
    t.FilterFarms();
	reloadKOC();
  },

  FilterFarms: function() {
    var t = Tabs.farm;
    if (t.searchRunning) return;
    t.FarmArray = new Array();
    t.FarmArray["1"] = new Array();
    t.FarmArray["2"] = new Array();
    t.FarmArray["3"] = new Array();
    t.FarmArray["4"] = new Array();
    t.FarmArray["5"] = new Array();
    t.FarmArray["6"] = new Array();
    t.FarmArray["7"] = new Array();
    t.FarmArray["8"] = new Array();
    for (u=1;u<=Seed.cities.length;u++){
        for (i=0;i<t.helpArray[u].length;i++){
            var checkLvl = false;
            var checkMight = false;
            var checkDip = false;
            var checkAlliance = false;
            var AllianceName = "";
            for (j=1;j<=15;j++) if (Options.FarmOptions.CityLevel[j] && t.helpArray[u][i].level == j) checkLvl=true;
            if (Seed.allianceDiplomacies.allianceName != undefined) AllianceName = Seed.allianceDiplomacies.allianceName;
            if (t.helpArray[u][i].AllianceName != AllianceName) checkAlliance = true;
            if (t.helpArray[u][i].might >= Options.FarmOptions.MinMight && t.helpArray[u][i].might <= Options.FarmOptions.MaxMight) checkMight = true;
            for (j in Options.FarmOptions.Diplomacy) if (Options.FarmOptions.Diplomacy[j] && t.helpArray[u][i].Diplomacy == j) checkDip=true;
            if (checkLvl && checkMight && checkDip && checkAlliance) t.FarmArray[u].push (t.helpArray[u][i]);
        }
        var elem = 'pdtotalFarm'+(u-1);
        if (t.FarmArray[u] == undefined) document.getElementById(elem).innerHTML = 'No Data';
        else {
				var l_ok_farms =0;
			    for (a=0;a<t.helpArray[u].length;a++){
					 if (t.helpArray[u][a]['enabled']&&((t.helpArray[u][a]['DaysInactive']=='?') ||(t.helpArray[u][a]['DaysInactive']> Options.FarmOptions.Inactive))) l_ok_farms++;
				 }
			document.getElementById(elem).innerHTML =  '' + l_ok_farms+'/'+t.FarmArray[u].length +'/'+ t.helpArray[u].length+'';
			}

    }
  },


  SortDist: function(a,b) {
      a = parseFloat(a['dist']);
      b = parseFloat(b['dist']);
      return (a < b )? -1 : ((a > b ? 1 : 0));
  },

  toggleBarbState: function(obj){
    var t = Tabs.farm;
    obj = document.getElementById('FarmAttSearch');
    if (Options.FarmOptions.Running == true) {
        Options.FarmOptions.Running = false;
        obj.value = "Farm = OFF";
        if(document.getElementById('FarmToggleTab'))document.getElementById('FarmToggleTab').innerHTML = '<span style="color: #CCC">'+unsafeWindow.g_js_strings.grove.farms+': Off</span>';
        saveOptions();
        t.nextattack = null;
    t.updateSeedTimer = null;
    } else {
        Options.FarmOptions.Running = true;
		Options.FarmOptions.DeleteReports = true;
        obj.value = "Farm = ON";
		if(document.getElementById('FarmToggleTab'))document.getElementById('FarmToggleTab').innerHTML = '<span style="color: #FFFF00">'+unsafeWindow.g_js_strings.grove.farms+': On</span>';
        saveOptions();
        t.checkFarmData();
        t.nextattack = setInterval(t.getnextCity,(parseInt(Math.random()*3)*100+Options.FarmOptions.SendInterval*1000));
	//	ReloadKOC();
    }
  },

  barbing : function(){
         var t = Tabs.farm;
       var city = t.city;
	   var trps = Options.FarmOptions.Troops;
       var now = new Date().getTime()/1000.0;
       now = now.toFixed(0);
       citynumber = Seed.cities[city-1][0];
       cityID = 'city' + citynumber;

       t.getAtkKnight(cityID);
	   //t.rallypointlevel = March.getRallypointLevel(cityID);
       t.rallypointlevel = March.getTotalSlots(citynumber);
       numMarches = t.rallypointlevel;
       var slots= March.getMarchSlots(citynumber);

       var element2 = 'pddataFarmarray'+(city-1);
       document.getElementById(element2).innerHTML =  'RP: (' + slots + '/' + numMarches +')';

       if (!Options.FarmOptions.CityEnable[city]) { document.getElementById(element2).innerHTML ='Disabled';return;}
      if (Number(Number(numMarches)-Number(slots)) <= Number(Options.FarmOptions.RallyClip)) return;
	    var Farms_count=t.FarmArray[city].length;
	   if (Farms_count==0) {document.getElementById(element2).innerHTML = 'No Farms'; return;}
       if (t.knt.toSource() == "[]") return;
        for (ii=1; ii<parseInt(t.troopDef.length+1); ii++) {
            if(parseIntNan(trps[ii]) > parseInt(Seed.units[cityID]['unt'+t.troopDef[ii-1][1]])) return;
        };
        if (Options.FarmOptions.FarmNumber[city]>=Farms_count) Options.FarmOptions.FarmNumber[city]=0;
        var kid = t.knt[0].ID;

         var interval = 0;
         switch(Options.FarmOptions.Interval){
                case "1":interval = 1;break;
                case "2":interval = 2;break;
                case "3":interval = 3;break;
                case "4":interval = 6;break;
                case "5":interval = 12;break;
                case "6":interval = 24;break;
				case "7":interval = 29;break;
				case "8":interval = 36;break;
				case "9":interval = 48;break;
				case "10":interval = 94;break;
        }

         var checkas=0;
		 var tmp_loop =0;
		 var Hourss_max=0;
         while (checkas == 0){
		 var Hourss =0;
         checkas=1;
		 var gotsome = false;

        for (i=1; i<parseInt(t.troopDef.length+1); i++) {
            if (parseIntNan(Options.FarmOptions.Troops[i]) > parseInt(Seed.units[cityID]['unt'+i])) checkas=0;
            if (parseIntNan(Options.FarmOptions.Troops[i]) > 0) gotsome=true;
        };
        if (!gotsome) checkas=0;
        if (!t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['enabled']) checkas=0;
    var farmtime = parseInt(t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['time']);
	var AllianceName = t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['AllianceName'];
	var l_inactive_days_koef =1;
	 if (!(!!AllianceName)) l_inactive_days_koef=0.2;
        if (farmtime>0)	{Hourss = Math.round((now - farmtime) / 3600);} else{
		    if (t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['DaysInactive'] =="?"||(farmtime==0&&t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['DaysInactive']>=Options.FarmOptions.Inactive*l_inactive_days_koef) ) Hourss=interval+1;}

        if (Hourss < interval) {checkas=0;}

		 if (Hourss >= interval && t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['DaysInactive']<Options.FarmOptions.Inactive*l_inactive_days_koef)  {checkas=0;}

        if (farmtime>0&&Hourss > Hourss_max&&t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['enabled']&& t.FarmArray[city][Options.FarmOptions.FarmNumber[city]]['DaysInactive']>=Options.FarmOptions.Inactive*l_inactive_days_koef) {Hourss_max=Hourss;}

	  //if (checkas ==0)
        var l_farm_no = Options.FarmOptions.FarmNumber[city];
		if (checkas == 0) {Options.FarmOptions.FarmNumber[city]++; saveOptions();}
        if (Options.FarmOptions.FarmNumber[city]>=Farms_count) {
                   Options.FarmOptions.FarmNumber[city]=0;
				   saveOptions();
				   document.getElementById(element2).innerHTML =  'Checked all '+ (Farms_count) + ' farms';
                    //return; //
					break;
            }
       }
//if (t.FarmArray[city] == undefined) {document.getElementById(element2).innerHTML = 'No Data'; return;}
           if (checkas == 0) {
         //{actionLog(' Nothing to farm from city'+city+' next hit after:' + (interval-Hourss_max) +'hours.')};
		document.getElementById(element2).innerHTML =  'Wait.Next '+ (interval-Hourss_max) + 'h';
		   saveOptions();
		 return;} else{

        var xcoord = t.FarmArray[city][l_farm_no]['x'];
        var ycoord = t.FarmArray[city][l_farm_no]['y'];
        var uid = t.FarmArray[city][l_farm_no]['UserId'];
           if ((numMarches - Options.FarmOptions.RallyClip) > slots)
		   t.checkInactives(citynumber,city,l_farm_no,xcoord,ycoord,kid,uid,trps);
  }
  },

  getnextCity: function(){
    var t = Tabs.farm;
    if (!Options.FarmOptions.Running) return;
    if(t.searchRunning) return;
    var city = t.city+1;
    if (city>Seed.cities.length){
        city=1;
    }
    t.city = city;
    t.barbing();
  },

  getAtkKnight : function(cityID){
     var t = Tabs.farm;
     t.knt = new Array();

     for (k in Seed.knights[cityID]){
             if (Seed.knights[cityID][k]["knightStatus"] == 1 && Seed.leaders[cityID]["resourcefulnessKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["politicsKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["combatKnightId"] != Seed.knights[cityID][k]["knightId"] && Seed.leaders[cityID]["intelligenceKnightId"] != Seed.knights[cityID][k]["knightId"]){
                 t.knt.push ({
                     Name:   Seed.knights[cityID][k]["knightName"],
                     Combat:    Seed.knights[cityID][k]["combat"],
                     ID:        Seed.knights[cityID][k]["knightId"],
                 });
             }
     }
     t.knt = t.knt.sort(function sort(a,b) {a = a['Combat'];b = b['Combat'];return a == b ? 0 : (a > b ? -1 : 1);});
  },

  doBarb: function(cityID,counter,number,xcoord,ycoord,kid,trps){
        var t = Tabs.farm;
        var params = unsafeWindow.Object.clone(unsafeWindow.g_ajaxparams);
        params.cid=cityID;
        params.type=4;
		params.kid=kid;
        params.xcoord = xcoord;
        params.ycoord = ycoord;
        for (ii=1; ii<parseInt(t.troopDef.length+1); ii++) {
            if(parseIntNan(trps[ii]) > 0)
                params['u'+t.troopDef[ii-1][1]]=parseIntNan(trps[ii]);
        };
        params.gold =0;
      params.r1=0;
      params.r2=0;
      params.r3=0;
      params.r4=0;
      params.r5=0;

	           March.addMarch(params, function(rslt){
                  if (rslt.ok) {
					var slots=March.getMarchSlots(cityID);
					var element1 = 'pddataFarmarray'+(counter-1);
					document.getElementById(element1).innerHTML =  'RP: (' + slots + '/' + t.rallypointlevel +')';
					var now = new Date().getTime()/1000.0;
					now = now.toFixed(0);
					t.FarmArray[counter][number]['time'] = now;
					t.FarmArray[counter][number]['attacked']++;
					Options.FarmOptions.FarmMarches.push ({city:counter,cityId:cityID,marchId:rslt.marchId,number:number});
					Options.FarmOptions.FarmNumber[counter]++;
					Options.FarmOptions.Attacks++;
					saveOptions();
					document.getElementById('FarmCheck').innerHTML = "Attacks: " + Options.FarmOptions.Attacks + " - Checks:" + Options.FarmOptions.Checks + ' (Sent last march from city -' +counter+' Farm No.'+(number+1)+')';
                 for (i=0;i<t.helpArray[counter].length;i++){
                        for (j=0;j<t.FarmArray[counter].length;j++){
                             if (parseInt(t.FarmArray[counter][j]['x']) == parseInt(t.helpArray[counter][i]['x']) && parseInt(t.FarmArray[counter][j]['y']) == parseInt(t.helpArray[counter][i]['y'])){
                                       t.helpArray[counter][i]['time'] = t.FarmArray[counter][j]['time'];
                                       t.helpArray[counter][i]['attacked'] = t.FarmArray[counter][j]['attacked'];
                                   }
                        }
                }
                GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + counter + '_' + getServerId(), JSON2.stringify(t.helpArray[counter]));
				saveOptions();

				} else { //onFailure
                  actionLog('Send farm march FAIL :' + Seed.cities[counter-1][1] + "   To: (" + xcoord + ',' + ycoord +')'
				  +'    -> ' + rslt.error_code + ' -  ' + rslt.msg + ' -  ' + rslt.feedback,'FARM');
                  }
          });


  },

  clickedSearch : function (){
    var t = Tabs.farm;
    t.opt.searchType = 0;
    t.opt.maxDistance = Options.FarmOptions.MaxDistance;
    t.opt.searchShape = 'circle';
    t.mapDat = [];
    t.firstX =  t.opt.startX - t.opt.maxDistance;
    t.firstY =  t.opt.startY - t.opt.maxDistance;
    t.tilesSearched = 0;
    t.tilesFound = 0;
    var element = 'pddataFarm'+(t.lookup-1);

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
    var t = Tabs.farm;
    if (!t.searchRunning)
      return;
    if (rslt.ok){
		map = rslt.data;
		for (k in map){
			var dist = distance (t.opt.startX, t.opt.startY, map[k].xCoord, map[k].yCoord);
			var CityCheck = true;
			var who = "u" + map[k].tileUserId;
			var AllianceName = "";
			if (map[k].cityName == null && map[k].misted ==false) CityCheck = false;
			if (t.isMyself(map[k].tileUserId)) CityCheck = false;
			if (map[k].tileType== 51 && CityCheck) {
				var Diplomacy = "neutral";
				for (DipStatus in t.DipArray) {
					var AllianceId = 0;
					if (rslt.userInfo[who] != undefined) AllianceId = "a" + rslt.userInfo[who].a;
					for (alliance in Seed.allianceDiplomacies[t.DipArray[DipStatus]]) if (Seed.allianceDiplomacies[t.DipArray[DipStatus]][AllianceId] != undefined) Diplomacy = t.DipArray[DipStatus];
				}
				if (rslt.allianceNames[AllianceId] != undefined) AllianceName = rslt.allianceNames[AllianceId];
				if (Diplomacy == "neutral" && AllianceName =="") Diplomacy = "unallied";
				//AudriusPPP: have added it to avoid to big list/array witch slows down computer later
				if (map[k].tileLevel>8 && rslt.userInfo[who].m>Options.FarmOptions.MinMight && rslt.userInfo[who].m<Options.FarmOptions.MaxMight){
					t.mapDat.push ({time:0,empty:0,lost:false,enabled:'true',attacked:0,DaysInactive:"?",LastCheck:0,Diplomacy:Diplomacy,UserId:map[k].tileUserId,AllianceName:AllianceName,x:map[k].xCoord,y:map[k].yCoord,dist:dist,level:map[k].tileLevel,PlayerName:rslt.userInfo[who].n,cityName:map[k].cityName,might:rslt.userInfo[who].m,cityNumber:map[k].cityNum,Ore:0,Wood:0,Stone:0,Food:0,Gold:0});
				};
			}
		}
	}
	else {
		if (rslt.BotCode && rslt.BotCode==999) { // map captcha
			var dtime = new Date();
			actionLog('Map Captcha detected!','FARM');
		}
	}

    t.tilesSearched += (t.opt.searchDistance*t.opt.searchDistance);

	var counter = t.BlockList.length;
	if (counter==0) {
        var element = 'pdtotalFarm'+(t.lookup-1);
        document.getElementById(element).innerHTML = 'Found: ' + t.mapDat.length;
        var element = 'pddataFarm'+(t.lookup-1);
        document.getElementById(element).innerHTML = "";
        GM_setValue('Farms_' + unsafeWindow.tvuid + '_city_' + t.lookup + '_' + getServerId(), JSON2.stringify(t.mapDat));
        t.searchRunning = false;
        for (y=1;y<=8;y++) Options.FarmOptions.FarmNumber[y] = 0;
        t.checkFarmData();
		return;
	}
	if (counter > MAX_BLOCKS) { counter = MAX_BLOCKS; }

	var nextblock = t.BlockList[0];
	var curX = nextblock.split("_")[1];
	var curY = nextblock.split("_")[3];

    var element = 'pddataFarm'+(t.lookup-1);
	document.getElementById(element).innerHTML = 'Searching at '+ curX +','+ curY;

	t.Blocks = [];
	for (var i=1;i<=counter;i++) {
		t.Blocks.push(t.BlockList.shift());
		t.blocksSearched++;
	}
	var blockString = t.Blocks.join("%2C");
    setTimeout (function(){t.MapAjax.LookupMap (blockString, t.mapCallback)}, MAP_DELAY);
  },

  stopSearch : function (msg){
    var t = Tabs.farm;
    var element = 'pddataFarm'+(t.lookup-1);
        document.getElementById(element).innerHTML = msg;
    t.searchRunning = false;
  },

  hide : function (){

  },

  show : function (){

  },

};
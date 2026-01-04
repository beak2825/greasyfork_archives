// ==UserScript==
// @name        Outside Dump Calculator
// @namespace   -
// @description Outside Dump Calculator for FDTD
// @include     http://d2n.duskdawn.net/*
// @version     1.05
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403006/Outside%20Dump%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/403006/Outside%20Dump%20Calculator.meta.js
// ==/UserScript==


   var delimiter = "<hr></hr>";
  var end = "</form>";
  var allD = "<form><div><input type = \"checkbox\" id = \"allDumptypes\"> All types of Dump</input></div>";
  var animaldump = "<div style = \"font-size: 10px\">--<input type = \"checkbox\" id = \"animaldump\" > Animal Dump </input></div>";
  var defencedump = "<div style = \"font-size: 10px\">--<input type = \"checkbox\" id = \"defencedump\"> Defence Dump </input></div>";
  var fooddump = "<div style = \"font-size: 10px\">--<input type = \"checkbox\" id = \"fooddump\"> Food Dump </input></div>";
  var metaldump = "<div style = \"font-size: 10px\">--<input type = \"checkbox\" id = \"metalldump\"> Metal Dump </input></div>";
  var weaponsdump = "<div style = \"font-size: 10px\">--<input type = \"checkbox\" id = \"weaponsdump\"> Weapons Dump </input></div>";
  var wooddump = "<div style = \"font-size: 10px\">--<input type = \"checkbox\" id = \"wooddump\"> Wood Dump </input></div>";
  var dumpupgrade = "<div style = \"font-size: 10px ; color: #0FF\">--<input type = \"checkbox\" id = \"dumpupgrade\"> Dump Upgrade </input></div>";
  var plasticdump = "<div style = \"font-size: 10px\">---<input type = \"checkbox\" id = \"plasticdump\"> Count empty plastic bags? </input></div>";
  var launcherdump = "<div style = \"font-size: 10px\">---<input type = \"checkbox\" id = \"launcherdump\"> Count empty batt launchers? </input></div>";
  var button = "<a class=\"uact\" id=\"botcalc\"><img src=\"http://d2nwiki.com/images/f/f8/Item_radius_mk2.gif\" alt=\"\"> Calculate!</a>";

  $("head").append($('<link rel="stylesheet" type="text/css"><style type="text/css">.uact{margin:0px ;padding : 0px;display:block;margin-top:3px;padding-left:7px;padding-right:7px;width:250px;height:20px;padding-bottom:1px;color:#f0d79e;font-size:10pt;font-weight:bold;font-family:Arial;letter-spacing:0pt;text-align:left;font-variant:small-caps;text-decoration:none;background-image:url("http://www.die2nite.com/gfx/design/button.gif");background-color:#b37c4a;border:1px solid black;border-bottom-width:2px;outline:1px solid #784323;cursor:pointer;}.uactOff{margin:0px ;padding : 0px;display:block;margin-top:3px;padding-left:7px;padding-right:7px;width:250px;height:20px;padding-bottom:1px;color:#f0d79e;font-size:10pt;font-weight:bold;font-family:Arial;letter-spacing:0pt;text-align:left;font-variant:small-caps;text-decoration:none;background-image:url("http://www.die2nite.com/gfx/design/button_off.gif");background-color:#b37c4a;border:1px solid black;border-bottom-width:2px;outline:1px solid #784323;cursor:pointer;}</style>'));

 $("#information_panel").append($('<a id="test" ><img src="http://d2nwiki.com/images/f/f8/Item_radius_mk2.gif"> Outside Dump Calculator</a>'));
 $("#test").append($(delimiter+allD+animaldump+defencedump+fooddump+metaldump+weaponsdump+wooddump+dumpupgrade+plasticdump+launcherdump+end+delimiter+button));

    document.getElementById("allDumptypes").onclick = function() {
      if (!this.checked){
      document.getElementById('animaldump').checked = false;
        document.getElementById('defencedump').checked = false;
        document.getElementById('fooddump').checked = false;
        document.getElementById('metalldump').checked = false;
        document.getElementById('weaponsdump').checked = false;
        document.getElementById('wooddump').checked = false;
        document.getElementById('dumpupgrade').checked = false;
        document.getElementById('plasticdump').checked = false;
        document.getElementById('launcherdump').checked = false;
      } else {
      document.getElementById('animaldump').checked = true;
        document.getElementById('defencedump').checked = true;
        document.getElementById('fooddump').checked = true;
        document.getElementById('metalldump').checked = true;
        document.getElementById('weaponsdump').checked = true;
        document.getElementById('wooddump').checked = true;
        document.getElementById('dumpupgrade').checked = true;
        document.getElementById('plasticdump').checked = true;
        document.getElementById('launcherdump').checked = true;
      }

    };
  document.getElementById('animaldump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('defencedump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('fooddump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('metalldump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('weaponsdump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('wooddump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('dumpupgrade').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('plasticdump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};
  document.getElementById('launcherdump').onclick = function() {if ( this.checked ) {} else {document.getElementById('allDumptypes').checked = false;}};

  var animalid = [45,42,43,44,47,403];
  var defid = [31,64,107,169,179];
  var foodid = [4,52,53,74,108,140,141,142,143,144,145,146,147,148,150,157,172,197,198,224,230,236,260,261,262,281,311,312,391];
  var metalid = [60,161];
  var weaponsid = [233,46,128,186,187,188,242,373,5,7,8,9,10,11,13,14,15,16,17,18,19,20,23,62,70,76,77,78,111,112,113,114,115,116,117,118,122,123,127,158,196,205,206,207,208,209,212,213,234,286,313,340,357,358,366,374]
  var woodid = [59,162];
  var plasticid = 76;
  var battlauncherid = 117;
  //var fatsnakeid = 403;

  var allids = [45,42,43,44,47,403,31,64,107,169,179,4,52,53,74,108,140,141,142,143,144,145,146,147,148,150,157,172,197,198,224,230,236,260,261,262,281,311,312,391,60,161,233,46,128,186,187,188,242,373,5,7,8,9,10,11,13,14,15,16,17,18,19,20,23,62,70,76,77,78,111,112,113,114,115,116,117,118,122,123,127,158,196,205,206,207,208,209,212,213,234,286,313,340,357,358,366,374,59,162,403];

  var ids = [];
  var multidef =[];
  var subtotal= 0;

  document.getElementById('botcalc').onclick = function yo() {
      document.getElementById('botcalc').className = 'uactOff';
      $("#botcalc").removeAttr('onclick');
      document.getElementById('botcalc').onclick = function yo () {
          alert("Better refresh the FDTD page to get more accurate data!")};
      calculateDump();};


  function desirable_ids (){
    ids = [];
    if (document.getElementById('animaldump').checked) {ids = ids.concat(animalid);}
    if (document.getElementById('defencedump').checked) {ids = ids.concat(defid);}
    if (document.getElementById('fooddump').checked) {ids = ids.concat(foodid);}
    if (document.getElementById('metalldump').checked) {ids = ids.concat(metalid);}
    if (document.getElementById('wooddump').checked) {ids = ids.concat(woodid);}
    if (document.getElementById('weaponsdump').checked) {ids = ids.concat(weaponsid);}
    if (document.getElementById('plasticdump').checked) {ids.push(plasticid);}
    if (document.getElementById('launcherdump').checked) {ids.push(battlauncherid);}
    ids.sort();
      //todo: separate ids array into general dumps id and special ids from checkboxes

  };
  function calculateDump (){
  subtotal = 0;
  desirable_ids();
  var zonas = document.getElementsByClassName("zone");
  for(var i = 0;i<zonas.length;i++){
    var xey = coordenadas(zonas[i]);
    var xxx = xey[0];
    var yyy = xey[1];

    if (apFromHome(xxx,yyy)<12){ //AP RANGE defalt to 11AP zones
      var azona = zoneMap[xxx][yyy];
      if (azona.items.length == 0){
                                  }
      else {
        var tempdef = 0;
        for (var j = 0; j<azona.items.length;j++){
          if (allids.includes(azona.items[j].d2nItemId)){
            //definir tipo de dumpable
            subtotal = subtotal +( tipifyitem(azona.items[j].d2nItemId)*azona.items[j].amount);
            tempdef += ( tipifyitem(azona.items[j].d2nItemId)*azona.items[j].amount);
          }
        }
         var apdef;
          if (apFromHome(xxx,yyy)>3&&xxx==0||apFromHome(xxx,yyy)>3&&yyy==0){
              apdef = tempdef/Math.floor(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))+(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))-2));
          } else if (apFromHome(xxx,yyy)>3){
              apdef = tempdef/Math.floor(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))+(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))-3));
          }
          else {
             apdef = 0;
          }

          multidef.push([apdef.toFixed(2),tempdef,xxx+"/"+yyy]);
      }
    }else {
    }
  }

  alert("We can get a total of "+subtotal+" defense with dumpables from outside (11AP range).\n\n"+bestzones());

}
  function bestzones(){
    multidef.sort( function (a, b)  {return b[0] - a[0]});

    var thebestzones = "The closest zones with the most defenses are:\n\n";
    for (var k = 0; k<10;k++){
    thebestzones += "#"+(k+1)+"- There's "+multidef[k][1]+" defense points worth on "+multidef[k][2]+" ("+multidef[k][0]+" DF/AP).\n";
    }
    return thebestzones;

  }
  function coordenadas (zona){
    var coo = [];
    var matches = zona.id.match(/^zone_([\-0-9]+)_([\-0-9]+)$/);
    coo.push(parseInt(matches[1]));
    coo.push(parseInt(matches[2]));
    return coo;
  }
  function tipifyitem (itemid) {
    var nweapons = [];
      nweapons.concat(weaponsid);
      nweapons.push(plasticid);
          nweapons.push(battlauncherid);
    var valor = 1;

    if (animalid.includes(itemid)&&document.getElementById('animaldump').checked){
      valor +=6;
    }
    else if (defid.includes(itemid)&&document.getElementById('defencedump').checked){
      valor +=2;
    }
    else if (foodid.includes(itemid)&&document.getElementById('fooddump').checked){
      valor +=3;
    }
    else if (metalid.includes(itemid)&&document.getElementById('metalldump').checked){
     valor +=1;
    }
    else if (nweapons.includes(itemid)&&document.getElementById('weaponsdump').checked){
      valor +=5;
    }
    else if (woodid.includes(itemid)&&document.getElementById('wooddump').checked){
      valor +=1;
    }
       if(document.getElementById('dumpupgrade').checked) {
         valor +=1;
       }

    return valor;

  }
  function includes(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
  }

  //posTown
  //yPosTown
  //apFromHome (x,y)
  //calculateZoneId(1, 1)



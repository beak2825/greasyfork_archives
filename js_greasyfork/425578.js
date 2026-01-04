// ==UserScript==
// @name        Outside Dump Calculator (Fata)
// @namespace   -
// @description Outside Dump Calculator for Fata Morgana and MyHordes
// @include     https://fatamorgana.md26.eu/*
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/425578/Outside%20Dump%20Calculator%20%28Fata%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425578/Outside%20Dump%20Calculator%20%28Fata%29.meta.js
// ==/UserScript==
  var delimiter = "<hr></hr>";
  var end = "</form>";
  var allD = "<form><div style = \"background-color: #AEB7AF\"><input type = \"checkbox\" id = \"allDumptypes\"> All types of Dump</input></div>";
  var animaldump = "<div style = \"background-color: #BEB7AF\" ; \"font-size: 10px\" >--<input type = \"checkbox\" id = \"animaldump\" > Animal Dump </input></div>";
  var defencedump = "<div style = \"background-color: #BEB7AF\" ; \"font-size: 10px\">--<input type = \"checkbox\" id = \"defencedump\"> Defence Dump </input></div>";
  var fooddump = "<div style = \"background-color: #BEB7AF\" ; \"font-size: 10px\">--<input type = \"checkbox\" id = \"fooddump\"> Food Dump </input></div>";
  var metaldump = "<div style = \"background-color: #BEB7AF\" ; \"font-size: 10px\">--<input type = \"checkbox\" id = \"metalldump\"> Metal Dump </input></div>";
  var weaponsdump = "<div style = \"background-color: #BEB7AF\" ; \"font-size: 10px\">--<input type = \"checkbox\" id = \"weaponsdump\"> Weapons Dump </input></div>";
  var wooddump = "<div style = \"background-color: #BEB7AF\" ; \"font-size: 10px\">--<input type = \"checkbox\" id = \"wooddump\"> Wood Dump </input></div>";
  var dumpupgrade = "<div style = \"background-color: #BEB7AF\" ; \"font-size: 10px ; color: #0FF\">--<input type = \"checkbox\" id = \"dumpupgrade\"> Dump Upgrade </input></div>";
  var plasticdump = "<div style = \"background-color: #CEB7AF\" ; \"font-size: 8px\">---<input type = \"checkbox\" id = \"plasticdump\"> Count empty plastic bags? </input></div>";
  var launcherdump = "<div style = \"background-color: #CEB7AF\" ; \"font-size: 8px\">---<input type = \"checkbox\" id = \"launcherdump\"> Count empty batt launchers? </input></div>";
  var button = "<a class=\"uact\" id=\"botcalc\"><img src=\"https://zombvival.de/myhordes/build/images/item/item_radius_mk2.25c2c535.gif\" alt=\"\"> Calculate!</a>";

  $("head").append($('<link rel="stylesheet" type="text/css"><style type="text/css">.uact{margin:0px ;padding : 0px;display:block;margin-top:3px;padding-left:7px;padding-right:7px;width:250px;height:20px;padding-bottom:1px;color:#f0d79e;font-size:10pt;font-weight:bold;font-family:Arial;letter-spacing:0pt;text-align:left;font-variant:small-caps;text-decoration:none;background-image:url("https://www.zombvival.de/myhordes/build/images/assets/img/background/bg_button.dbfda3a1.gif");background-color:#b37c4a;border:1px solid black;border-bottom-width:2px;outline:1px solid #784323;cursor:pointer;}.uactOff{margin:0px ;padding : 0px;display:block;margin-top:3px;padding-left:7px;padding-right:7px;width:250px;height:20px;padding-bottom:1px;color:#f0d79e;font-size:10pt;font-weight:bold;font-family:Arial;letter-spacing:0pt;text-align:left;font-variant:small-caps;text-decoration:none;background-image:url("http://www.die2nite.com/gfx/design/button_off.gif");background-color:#b37c4a;border:1px solid black;border-bottom-width:2px;outline:1px solid #784323;cursor:pointer;}</style>'));

 $("#box").append($('<a id="test"><img src="https://zombvival.de/myhordes/build/images/item/item_radius_mk2.25c2c535.gif"> Outside Dump Calculator</a>'));
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

  var animalid = [39,36,37,38,41];//403 Fat Serpent]; ???
  var defid = [26,52,88,146,154];
  var foodid = [4,44,45,59,89,119,120,121,122,123,124,125,126,127,129,134,149,171,172,199,204,219,225,245,246,269,297];
  var metalid = [50,138];
  var weaponsid = [201,40,108,161,162,163,205,282,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,51,56,61,62,92,93,94,95,96,97,98,99,102,103,107,135,170,179,180,181,182,183,186,187,202,230,247,354,271,272,278,283];
  var woodid = [49,139];
  var plasticid = 60;
  var battlauncherid = 98;

  var allids = [39,36,37,38,41,26,52,88,146,154,4,44,45,59,89,119,120,121,122,123,124,125,126,127,129,134,149,171,172,199,204,219,225,245,246,269,297,50,138,201,40,108,161,162,163,205,282,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,51,56,61,62,92,93,94,95,96,97,98,99,102,103,107,135,170,179,180,181,182,183,186,187,202,230,247,354,271,272,278,283,49,139,60,98];

  var ids = [];
  var multidef =[];
  var subtotal= 0;

  document.getElementById('botcalc').onclick = function yo() {
      document.getElementById('botcalc').className = 'uactOff';
      $("#botcalc").removeAttr('onclick');
      document.getElementById('botcalc').onclick = function yo () {
          alert("Better refresh the Fata page to get more accurate data!")};
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
  var zonas = document.getElementsByClassName("mapzone");
  for(var i = 0;i<zonas.length;i++){
    //var xey = coordenadas(zonas[i]);
    var xxx = zonas[i].getAttribute("rx");
    var yyy = zonas[i].getAttribute("ry");
    var apfromhome = zonas[i].getAttribute("ap");

      var range = 16 //AP RANGE defalt to 15AP zones

    if (apfromhome<range){
      var azona = data.map["y"+zonas[i].getAttribute("ay")]["x"+zonas[i].getAttribute("ax")];//["items"];
      try {
          azona = azona["items"]
          //if (typeof (azona["items"]) == "undefined"){//azona["items"]===undefined){ //azona.length == 0||
          //      console.log('yada');                    }
          //else {
          //    azona = azona["items"];
          var tempdef = 0;
          for (var j = 0; j<azona.length;j++){
            if (allids.includes(azona[j].id)){
            //definir tipo de dumpable
            subtotal = subtotal +( tipifyitem(azona[j].id)*azona[j].count);
            tempdef += ( tipifyitem(azona[j].id)*azona[j].count);
            }
          }
          var apdef;
          if (apfromhome>3&&xxx==0||apfromhome>3&&yyy==0){
              apdef = tempdef/Math.floor(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))+(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))-2));
              } else if (apfromhome>3){
              apdef = tempdef/Math.floor(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))+(Math.sqrt(Math.pow(xxx,2)+Math.pow(yyy,2))-3));
              }
              else {
                apdef = 0;
              }
          multidef.push([apdef.toFixed(2),tempdef,xxx+"/"+yyy]);
         }
      catch { }

  } else {}
  }

  alert("We can get a total of "+subtotal+" defense with dumpables from outside ("+(range-1)+"AP range).\n\n"+bestzones());

}
  function bestzones(){
    multidef.sort( function (a, b)  {return b[0] - a[0]});

    var thebestzones = "The closest zones with the most defenses are:\n\n";
    for (var k = 0; k<10;k++){
    thebestzones += "#"+(k+1)+"- There's "+multidef[k][1]+" defense points worth on "+multidef[k][2]+" ("+multidef[k][0]+" DF/AP).\n";
    }
    return thebestzones;

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

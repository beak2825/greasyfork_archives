// ==UserScript==

// @name          erevolution tools

// @namespace     https://www.erevollution.coms

// @description  erevolution prof

// @include       https://www.erevollution.com/*

// @exclude     https://www.erevollution.com/en/special-items

// @version 0.0.1.20161218200915
// @downloadURL https://update.greasyfork.org/scripts/19534/erevolution%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/19534/erevolution%20tools.meta.js
// ==/UserScript==

//auto eat
setInterval(myMethod, 9720000);

function myMethod( )
{
  document.getElementById("energyButton").click()
}

//dmg calc prof
function wepon(wep,hit,gold,resta,restp,st) {
    this.st = st;

    this.idstring='#udarec'+st;

    this.wep = wep;

    this.hit =Math.ceil(hit);

    this.gold = gold;
    this.goldta= (2.5-(nextta*gold)).toFixed(2);
    this.goldtp= (5-(nexttp*gold)).toFixed(2)

    this.nextta=resta/hit;
    this.nextta=Math.ceil(this.nextta);

    this.nexttp=restp/hit;
    this.nexttp=Math.ceil(this.nexttp);

    this.changeWep = function (wep) {
      this.hit = this.hit/this.wep;
      console.log(hit);
      this.wep = wep;
      this.changeHit(this.hit*wep);
    }
    this.changeHit = function (hit) {
      this.hit =Math.ceil(hit);

      this.nextta=resta/hit;
      this.nextta=Math.ceil(this.nextta);

      this.nexttp=restp/hit;
      this.nexttp=Math.ceil(this.nexttp);
    }
    this.changeGold = function (gold) {
      this.gold = gold;
      this.goldta= ( (2.5 - (this.nextta*gold)).toFixed(2) );
      this.goldtp= ( (5 - (this.nexttp*gold)).toFixed(2));
    }

}


function spremeniWep(owep,wep,gold){
  if(wep=="n"){
    owep.changeGold(gold);
  }
  if (gold=="n"){
    owep.changeWep(wep);
  }

  $(owep.idstring).html("<b>"+owep.hit+"<br>  "+owep.nextta+"<br> "+owep.goldta+"  <br> "+owep.nexttp+"  <br> "+owep.goldtp);
  jquery();

}




function udarecEna(sprem){
    wepon1.changeHit(sprem);
    $(wepon1.idstring).html("<b>"+wepon1.hit+"<br> "+wepon1.nextta+"<br> 0 <br> "+wepon1.nexttp+" <br> 0 <br> - <br> - </b>");
    wepon2.changeHit(sprem);
    spremeniWep(wepon2);
    wepon3.changeHit(sprem);
    spremeniWep(wepon3);
    wepon4.changeHit(sprem);
    spremeniWep(wepon4);
    wepon5.changeHit(sprem);
    spremeniWep(wepon5);
    wepon6.changeHit(sprem);
    spremeniWep(wepon6);
}

function udarecWep(gold,st,wep) {
  switch(st) {
      case 2:
          spremeniWep(wepon2,wep,gold);
          break;
      case 3:
          spremeniWep(wepon3,wep,gold);
          break;
      case 4:
          spremeniWep(wepon4,wep,gold);
          break;
      case 5:
          spremeniWep(wepon5,wep,gold);
          break;
      case 6:
          spremeniWep(wepon6,wep,gold);
          break;
      }
}




var x = document.getElementsByClassName("vs164-2");
var moc = x[0].innerHTML;
var car="";
for(i=0;i<moc.length;i++)
{
  if(moc[i]==","){
    car=moc[i-1];
    break;
  }
}

moc=moc.replace(car+',',car);
moc = parseFloat(moc, 10) ;

var razmerje = document.getElementsByClassName("vs165-5");
var level = document.getElementsByClassName("vs164-6 vs164-13");
level=level[0].innerHTML;
achivment= $(".vs164-5").attr("src");
achivment=achivment[19]+achivment[20];
var list=[];
for (i=0; i<razmerje.length ; i++){
var thisseznam = razmerje[i].innerHTML;

thisseznam= thisseznam.replace(/<[^>]*>/g, ''); // Remove HTML tags
thisseznam = thisseznam.replace(/[[^]]*]/g, ''); // Remove anything within square brackets
list[i]=thisseznam;
}

var st=0;
var wep=1;
var tp= list[0];
tp= tp.replace(/,/g,'')
tp=tp.split("/")
var restp=tp[1]-tp[0];

var ta= list[1];
ta=ta.replace(/,/g,'')
ta=ta.split("/")
var resta=ta[1]-ta[0];

var lk=5;
var ak=0.05;
var l=level*lk+moc;
var a=1+achivment*ak;
var ne=1;
var k=l*a*ne;
k=Math.ceil(k);
var ene=1;
var boos=1;
var hit=k*ene*boos;
var nextta=resta/hit;
nextta=Math.ceil(nextta);
var nexttp=restp/hit;
nexttp=Math.ceil(nexttp);

var gold=0;
var idstring="";

var wepon1=new wepon(wep,hit,gold,resta,restp,1);
var wepon2=new wepon(wep,hit,gold,resta,restp,2);
var wepon3=new wepon(wep,hit,gold,resta,restp,3);
var wepon4=new wepon(wep,hit,gold,resta,restp,4);
var wepon5=new wepon(wep,hit,gold,resta,restp,5);
var wepon6=new wepon(wep,hit,gold,resta,restp,6);

var goldstring= "type='text'></input></label>";

var wepstring=  "<option value='1'>none</option>"+
  "<option value='1.2'>1.2</option>"+
  "<option value='1.4'>1.4</option>"+
  "<option value='1.6'>1.6</option>"+
  "<option value='1.8'>1.8</option>"+
  "<option value='2'>2</option>"+
  "<option value='2.2'>2.2</option>"+
  "<option value='2.4'>2.4</option>"+
  "<option value='2.6'>2.6</option>"+
  "<option value='2.8'>2.8</option>"+
  "<option value='3'>3</option>"+
  "<option value='3.2'>3.2</option>"+
  "<option value='3.4'>3.4</option>"+
  "<option value='3.6'>3.6</option>"+
  "<option value='3.8'>3.8</option>"+
  "<option value='4'>4</option>"+
  "<option value='5'>5</option>"+
"</select>";

var htmlStringdiv = "<div id='vse'><br></br> <h3 style='margin-top: 15px;clear: both;'>"+
"<span>Info Calc</span></h3>"+
"<div id='infCalc' class='vs165' >"+
  "<label >energy<input id='infCalc_energy' value='1' type='text'></input></label>"+
  "<label>Damege Booster </label> <select id='dmg'>"+
    "<option value='1'>none</option>"+
    "<option value='1.1'>1.1</option>"+
    "<option value='1.2'>1.2</option>"+
    "<option value='1.3'>1.3</option>"+
    "<option value='1.4'>1.4</option>"+
    "<option value='1.5'>1.5</option>"+
  "</select>"+

  "<table border='1'> "+
    "<tbody>"+
      "<tr>"+
       "<td><b>Influence:   <br> Next TA: <br>  gold TA <br> Next TP:  <br>  gold TP<br> Wep <br> gold/peac </b> <td>"+
        "<td> <b> <span id='udarec1'>"+hit+"<br> "+nextta+"<br> 0 <br> "+nexttp+" <br> 0  <br> - <br> 0 </b> </span></td>"+
        "<td> <b> <span id='udarec2'>"+hit+"<br>  "+nextta+"<br> cost g/m  <br> "+nexttp+"  <br> cost g/m  </span> <br> <select class='oroz' id='n2'>"+wepstring+" <br> <input class='zlat' id='infCalc_gold2'"+goldstring+" </b> </td>"+
        "<td> <b> <span id='udarec3'>"+hit+"<br>  "+nextta+"<br> cost g/m  <br> "+nexttp+"  <br> cost g/m  </span> <br> <select class='oroz' id='n3'>"+wepstring+" <br> <input class='zlat' id='infCalc_gold3'"+goldstring+" </b> </td>"+
        "<td> <b> <span id='udarec4'>"+hit+"<br>  "+nextta+"<br> cost g/m  <br> "+nexttp+"  <br> cost g/m  </span> <br> <select class='oroz' id='n4'>"+wepstring+" <br> <input class='zlat' id='infCalc_gold4'"+goldstring+" </b> </td>"+
        "<td> <b> <span id='udarec5'>"+hit+"<br>  "+nextta+"<br> cost g/m  <br> "+nexttp+"  <br> cost g/m  </span> <br> <select class='oroz' id='n5'>"+wepstring+" <br> <input class='zlat' id='infCalc_gold5'"+goldstring+" </b> </td>"+
        "<td> <b> <span id='udarec6'>"+hit+"<br>  "+nextta+"<br> cost g/m  <br> "+nexttp+"  <br> cost g/m  </span> <br> <select class='oroz' id='n6'>"+wepstring+" <br> <input class='zlat' id='infCalc_gold6'"+goldstring+" </b> </td>"+
       "</tr>"+
    "</tdbody>"+
  "</table>"+

"</div>"+
"<br></br>"+
"<div>";

    $(htmlStringdiv).insertAfter(".vs165:last");

jquery()

function jquery(){
  $(document).ready(function(){
    $("select").css("display","inline");
    $(".zlat").css("width", "50px");

    $('#infCalc_energy').on('input',function(e){
        ene=$("#infCalc_energy").val();
        hit=k*ene*boos;
        hitwone=hit*wep;
        console.log(hit);

        udarecEna(hit);
    });


    $('#dmg').on('change', function (e) {
        var optionSelected =$("option:selected", this);
        boos=this.value;
        hit=k*ene*boos;
        udarecEna(hit);
    });

      $('.oroz').on('change', function (e) {
      var oid=$(this).attr('id');
      st=parseFloat(oid[1]);
      wep = parseFloat($('#n'+st).find(":selected").text());
      console.log(wep, st);

      udarecWep("n",st,wep);
    });

    $('.zlat').on('input',function(e){
      var gid=$(this).attr('id');
      st=parseFloat(gid[12]);

      gold =parseFloat($("#infCalc_gold"+st).val());
      console.log(gold, st);

      udarecWep(gold,st,"n");
    });

      $("td").css("borderColor", "transparent");
      $("td").css("borderWidth", "3px");
  });
}

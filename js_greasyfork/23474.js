// ==UserScript==
// @name        SLDir
// @namespace   Srilanka
// @include     http://eservices.elections.gov.lk/myVoterRegistrationDraft.aspx
// @version     1.0.3
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_xmlhttpRequest

// @description read data
// @downloadURL https://update.greasyfork.org/scripts/23474/SLDir.user.js
// @updateURL https://update.greasyfork.org/scripts/23474/SLDir.meta.js
// ==/UserScript==

$(document).ready(function(){
 var NIC;
  
  //alert("fire");

//check result table
if(document.getElementById("ContentPlaceHolder1_DetailsView").children[0].children.length>1){

//some result,extract,post to myDB
  
  var person=[];
  var rows=document.getElementById("ContentPlaceHolder1_DetailsView").children[0].children;
  for(i=0;i<9;i++){
    
    person[i]=rows[i].children[1].innerHTML;
    
   
  }
  
  
 var postData={
   'name':person[0],
   'NIC': person[1].split("/").pop().trim(),
   'SLNIC':person[1].split("/")[0].trim(),
   'disNum':person[2].split("-")[0].trim(),
   'disName':person[2].split("-").pop().trim(),
   'gender':person[4],
   'pollingDiv':person[6],
   'pdNumber':person[7],
   'serialNo':0,
 }
  
  /*url="http://slelection.esy.es";
 $.post(url+'/election.php',postData,function(data){
	
	alert("Sent");
});*/
 
 
GM_xmlhttpRequest ( {
method: "POST",
url: "http://ca371a58.ngrok.io/election.php",
data: JSON.stringify(postData)

,
headers: {
"Content-Type": "application/x-www-form-urlencoded"
},
onload: function (response) { 
//console.log ( response.responseText);


//alert(response.responseText);


//alert("im here");
  
//current id is correct,divide/10 ,*10
  
  

  NIC=Number($("#ContentPlaceHolder1_txtNIC").val().split("V")[0]);
  var x=NIC/10;
  var rem=NIC%10;

  if(rem!=0){
    NIC=Math.ceil(x);
    
  }
  else{
    NIC=x+1;
  }
  
  NIC=NIC*10
  //alert(NIC);
  
//alert("done");
$("#ContentPlaceHolder1_txtNIC").val(NIC+"V");


//set code

var code="";
for(i=1;i<6;i++){
var charid= "ContentPlaceHolder1_imbC"+i;
code=code+document.getElementById(charid).src.split("/").pop().split(".")[0];

}


$("#ContentPlaceHolder1_txtCode").val(code);

$("#ContentPlaceHolder1_cmdDisplay").click();




}

} );
  
  

}else{

//no result
//current id is wrong,++1
  NIC=Number($("#ContentPlaceHolder1_txtNIC").val().split("V")[0]);
  NIC++;
//alert("not found");


$("#ContentPlaceHolder1_txtNIC").val(NIC+"V");


//set code

var code="";
for(i=1;i<6;i++){
var charid= "ContentPlaceHolder1_imbC"+i;
code=code+document.getElementById(charid).src.split("/").pop().split(".")[0];

}


$("#ContentPlaceHolder1_txtCode").val(code);

$("#ContentPlaceHolder1_cmdDisplay").click();



}


//nextCall

//set proper NIC

//just demo
//var NIC=Number($("#ContentPlaceHolder1_txtNIC").val().split("V")[0]);
//alert(NIC);
//NIC++;



});
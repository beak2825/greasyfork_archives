// ==UserScript==
// @name icds adhar
// @namespace adhar
// @description adhar fidding
// @match https://icdsup.com/admin/*
// @version 1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/397080/icds%20adhar.user.js
// @updateURL https://update.greasyfork.org/scripts/397080/icds%20adhar.meta.js
// ==/UserScript==
var clk = new Event("click");
var ipt = new Event("input");
var gname
var lkoda = setInterval(lkoicds, 1000);
document.getElementById("txt_projectname").value="SEORAHI";
document.getElementById("txt_center_name").value="SALEMGARH SIYARHA";
document.getElementById("txt_awc_unique_code").value="09189120718";
document.getElementById("txt_father_mother_husband_name").value=sessionStorage.fname;
document.getElementById("txt_G_bene_first_name").value=sessionStorage.gname;
document.getElementById("txt_G_bene_middle_name").value=sessionStorage.gmname;
document.getElementById("txt_G_bene_DOB").value=sessionStorage.gdob;
document.getElementById("txt_mobile").value=sessionStorage.gadh;
//document.getElementById("txt_bene_middle_name").value="";
//document.getElementById("txt_bene_surname").value="";
//document.getElementById("txt_G_bene_surname").value="";
//document.getElementById("txt_bene_middle_name").disabled = true;
//document.getElementById("txt_bene_surname").disabled = true;
//document.getElementById("txt_G_bene_middle_name").disabled = true;
//document.getElementById("txt_G_bene_surname").disabled = true;
//document.querySelectorAll('G_bene_gender')[0].value=sessionStorage.ggen;
document.getElementById("submit").addEventListener('click', function (){
localStorage.pname=document.getElementById("txt_projectname").value; 
localStorage.pname=document.getElementById("txt_center_name").value; 
localStorage.pname=document.getElementById("txt_awc_unique_code").value; 
sessionStorage.fname=document.getElementById("txt_father_mother_husband_name").value;
sessionStorage.gname=document.getElementById("txt_G_bene_first_name").value;
sessionStorage.gmname=document.getElementById("txt_G_bene_middle_name").value;
sessionStorage.gdob=document.getElementById("txt_G_bene_DOB").value;
sessionStorage.gadh=document.getElementById("txt_mobile").value;
//sessionStorage.ggen=document.querySelectorAll('G_bene_gender')[0].value;
 //var 
//sessionStorage.bdob=document.getElementById("txt_bene_dob").value;
//sessionStorage.badh=document.getElementById("txt_bene_aadhar_number").value;
//var bgup=document.getElementById("txt_bene_group").value;

//alert(); 
  
});
function lkoicds() {
  cur_url=document.location.href;
  if(cur_url.indexOf('addBeneficiary') > -1 ){  }}
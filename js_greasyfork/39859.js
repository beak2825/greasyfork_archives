// ==UserScript==
// @author https://greasyfork.org/en/scripts/30089/versions/new
// @name MPR
// @namespace AGNVADI FEEDING
// @grant none
// @include     http://icds-wcd.nic.in/*
// @description butter RESULT
// @version 3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/39859/MPR.user.js
// @updateURL https://update.greasyfork.org/scripts/39859/MPR.meta.js
// ==/UserScript==
if(document.getElementById("ctl00_ContentPlaceHolder1_btnSubmit")){
document.getElementById("ctl00_ContentPlaceHolder1_optAwcType_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optAwcArea_0").click(checked = true);
document.getElementById("ctl00_ContentPlaceHolder1_optAWWInPos_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optHelperInPos_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optAddWInPos_1").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optLinkWorkerInPos_1").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtNoDays_AWCFunc").value = "25";
document.getElementById("ctl00_ContentPlaceHolder1_txtNoDays_AWC_SN_MS").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtNoDays_AWC_SN_HCM").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtNoDays_AWC_Con_PSE").value = "25";
document.getElementById("ctl00_ContentPlaceHolder1_optDrinkWater_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optToiletAvail_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optWaterFacilityToilet_1").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optVHNDConDate_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optAwwPreVHND_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optVitaminAdmn_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optCheckupCound_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optVHSNCPar_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optAWCBuildCons_0").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_optEcceDay_1").checked = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtLati").value = "26.7220835";
document.getElementById("ctl00_ContentPlaceHolder1_txtLong").value = "84.2190215";
document.getElementById("ctl00_ContentPlaceHolder1_txtTPopu_LM").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtNo_Tablet_Admn").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtNo_Child_Tab").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtNoDays_AWC_SN_THR").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOPW_MIN").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOLW_MIN").value = "0";

document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotBoys_6m_36m").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotGirls_6m_36m").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotBoys_36m_72m").value = "0";
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotGirls_36m_72m").value = "0";
  document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_ST_6m_36m").value=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_ST_6m_36m").value=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_ST_36m_72m").value=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_ST_36m_72m").value=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOPW_ST").value=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOLW_ST").value=document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOBoys_ST_36m_72m").value=document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOGirls_ST_36m_72m").value='0';
  
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_ST_6m_36m").disabled = true; 
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_ST_6m_36m").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_ST_36m_72m").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_ST_36m_72m").disabled = true; 
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOPW_ST").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOLW_ST").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOBoys_ST_36m_72m").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOGirls_ST_36m_72m").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Boys_0y_3y").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Girls_0y_3y").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Boys_3y_5y").disabled = true;
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Girls_3y_5y").disabled = true;
clock();
}
function clock(){
document.getElementById("ctl00_ContentPlaceHolder1_optAwcBulid_0").click(checked = true);
document.getElementById("ctl00_ContentPlaceHolder1_optAwcBuildType_2").click(checked = true); 
  var dd1=document.getElementById("ctl00_ContentPlaceHolder1_lblSNB_TOTBoys_6m_36m").innerHTML;
  var dd2=document.getElementById("ctl00_ContentPlaceHolder1_lblSNB_TOTGirls_6m_36m").innerHTML;
  var dd3=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotBoys_6m_36m").value;
   var dd4=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotGirls_6m_36m").value;
  var dd5=Number(dd1)+Number(dd2)+Number(dd3)+Number(dd4); 
  
  var dd6=document.getElementById("ctl00_ContentPlaceHolder1_txtTPopu_6m_3y").value=dd5;
  var boy63=Number(dd1)+Number(dd3);
  var girl63=Number(dd2)+Number(dd4);  
  var ee1=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_ModMal_Boys_0y_3y").value;//कुपोषित बॉय 03
  var ee2=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_SevMal_Boys_0y_3y").value;//अतिकुपोषित बॉय 03
  var ee3=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_ModMal_Girls_0y_3y").value;//कुपोषित गर्ल 03
   var ee4=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_SevMal_Girls_0y_3y").value;//अतिकुपोषित गर्ल 03
  var ee7=boy63-(Number(ee1)+Number(ee2));
  var ee8=girl63-(Number(ee3)+Number(ee4));
 var ee5=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Boys_0y_3y").value=ee7;//narmal बॉय 03
 var ee6=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Girls_0y_3y").value=ee8;//narmal  गर्ल 03
  //
 var PW1=document.getElementById("ctl00_ContentPlaceHolder1_lblSNB_TOTPW").innerHTML;
  var LW1=document.getElementById("ctl00_ContentPlaceHolder1_lblSNB_TOTLW").innerHTML;
  var PW2=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOPW_MIN").value;
   var LW2=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOLW_MIN").value;
  var PW3=Number(PW1)+Number(PW2);
  var LW3=Number(LW1)+Number(LW2); 
  document.getElementById("ctl00_ContentPlaceHolder1_txtTPopu_LM").value =document.getElementById("ctl00_ContentPlaceHolder1_txtTPopu_0m_3m").value=LW3;
  document.getElementById("ctl00_ContentPlaceHolder1_txtTPopu_PW").value =PW3;
  var bb1=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_SC_36m_72m").value;
  var cc1=parseInt(bb1*.9);
var aa1= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOBoys_SC_36m_72m").value =cc1;
  var bb2=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_SC_36m_72m").value;
  var cc2=parseInt(bb2*.9);
var aa2= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOGirls_SC_36m_72m").value = cc2;
var bb3=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_OBC_36m_72m").value;
  var cc3=parseInt(bb3*.9);
var aa3= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOBoys_OBC_36m_72m").value = cc3;
var bb4=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_OBC_36m_72m").value;
  var cc4=parseInt(bb4*.9);
var aa4= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOGirls_OBC_36m_72m").value = cc4;
var bb5=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_GEN_36m_72m").value;
  var cc5=parseInt(bb5*.9);
var aa5= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOBoys_GEN_36m_72m").value = cc5;
var bb6=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_GEN_36m_72m").value;
  var cc6=parseInt(bb6*.9);
var aa6= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOGirls_GEN_36m_72m").value =cc6;
var bb7=document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotBoys_36m_72m").value;
  var cc7=parseInt(bb7*.9);
var aa7= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_Min_Out_TotBoys_36m_72m").value =cc7;
var bb8= document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_Min_Out_TotGirls_36m_72m").value;
  var cc8=parseInt(bb8*.9);
var aa8= document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_Min_Out_TotGirls_36m_72m").value =cc8;
var aa9=Number(aa1)+Number(aa2)+Number(aa3)+Number(aa4)+Number(aa5)+Number(aa6)+Number(aa7)+Number(aa8);//alert(a9);
var bb9=Number(bb1)+Number(bb2)+Number(bb3)+Number(bb4)+Number(bb5)+Number(bb6)+Number(bb7)+Number(bb8);
var b10=document.getElementById("ctl00_ContentPlaceHolder1_txtTPopu_3y_6y").value=bb9;
   var boy35=Number(bb1)+Number(bb3)+Number(bb5)+Number(bb7);
  var girl35=Number(bb2)+Number(bb4)+Number(bb6)+Number(bb8);  
  var eee1=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_ModMal_Boys_3y_5y").value;//कुपोषित बॉय 35
  var eee2=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_SevMal_Boys_3y_5y").value;//अतिकुपोषित बॉय 35
  var eee3=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_ModMal_Girls_3y_5y").value;//कुपोषित गर्ल 35
   var eee4=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_SevMal_Girls_3y_5y").value;//अतिकुपोषित गर्ल 35
  var eee7=boy35-(Number(eee1)+Number(eee2));
  var eee8=girl35-(Number(eee3)+Number(eee4));
 var eee5=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Boys_3y_5y").value=eee7;//narmal बॉय 35
 var eee6=document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Girls_3y_5y").value=eee8;//narmal  गर्ल 35
document.getElementById("ctl00_ContentPlaceHolder1_txtNoChildPreSchAwc").value=aa9;
document.getElementById("ctl00_ContentPlaceHolder1_txtNoChildPreSchPS").value ="0";
  if(document.getElementById("ctl00_ContentPlaceHolder1_txtNS_SevMal_Girls_3y_5y").value=="0" || document.getElementById("ctl00_ContentPlaceHolder1_txtNS_SevMal_Girls_3y_5y").value>="1"){
    document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_ST_6m_36m").disabled = false; 
    document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_ST_6m_36m").disabled =false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOBoys_ST_36m_72m").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOGirls_ST_36m_72m").disabled = false;  
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOPW_ST").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtSNB_NOLW_ST").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOBoys_ST_36m_72m").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtPSE_NOGirls_ST_36m_72m").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Boys_0y_3y").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Girls_0y_3y").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Boys_3y_5y").disabled = false; 
document.getElementById("ctl00_ContentPlaceHolder1_txtNS_Nor_Girls_3y_5y").disabled = false; 
 document.getElementById("ctl00_ContentPlaceHolder1_btnSubmit").click();
  }
window.setTimeout(clock, 1000);
 }
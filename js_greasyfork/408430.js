// ==UserScript==
// @name         Halos&Horns Advanced Search
// @namespace    https://torn.com/
// @version      1.1
// @description  Refine your Advanced Search
// @author       H1K3
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/408430/HalosHorns%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/408430/HalosHorns%20Advanced%20Search.meta.js
// ==/UserScript==
const user_list = document.getElementsByClassName("user-info-list-wrap bottom-round cont-gray")[0].children;var job_list = "";
if (localStorage.hhmenu) {} else {alert("NO");localStorage.hhmenu = 'at the Hospital';}
GM_registerMenuCommand ("Medical", medcall, "M");function medcall(){localStorage.hhmenu = 'at the Hospital';job_list = "";run_page();}
GM_registerMenuCommand ("Law", lawcall, "L");function lawcall(){localStorage.hhmenu = 'at a Law Firm';job_list = "";run_page();}
GM_registerMenuCommand ("Education", edcall, "E");function edcall(){localStorage.hhmenu = 'in the Education System';job_list = "";run_page();}
GM_registerMenuCommand ("Casino", cascall, "C");function cascall(){localStorage.hhmenu = 'in the Casino';job_list = "";run_page();}
GM_registerMenuCommand ("Army", armycall, "A");function armycall(){localStorage.hhmenu = 'in the Army';job_list = "";run_page();}
GM_registerMenuCommand ("Grocer", grocercall, "G");function grocercall(){localStorage.hhmenu = 'in a Grocery Shop';job_list = "";run_page();}
GM_registerMenuCommand ("Leader", leadercall, "L");function leadercall(){localStorage.hhmenu = 'eader of ';job_list = "";run_page();}
GM_registerMenuCommand ("Clear Clipboard", clearcall, "X");function clearcall(){job_list = "";run_page();}
$(document).ajaxComplete(function(e,v,r){if(r.url.includes("https://www.torn.com/page.php?")){run_page();}});
function run_page()
{
 var token = '';
 for (var i = 0; i < user_list.length; i++) {
 if(user_list[i].children[1].children[1].children[1].innerHTML.includes(localStorage.hhmenu)&&localStorage.hhmenu=='eader of ')
 {//https://www.torn.com/factions.php?step=profile&userID=2255286
  token=user_list[i].children[1].children[1].children[1].children[0].innerHTML.split('a href="factions.php?step=profile&amp;userID=')[1].split('"></a>')[0];
  //console.log(user_list[i].children[1].children[1].children[1].children[0].innerHTML.split('eader of ')[1].split('" ')[0]);
     job_list+='[url=https://www.torn.com/factions.php?step=profile&userID='+token+']'+user_list[i].children[1].children[1].children[1].children[0].innerHTML.split('eader of ')[1].split('" ')[0]+'[/url]\n';GM_setClipboard(job_list);
 }
 else if(user_list[i].children[1].children[1].children[1].innerHTML.includes(localStorage.hhmenu)){
 user_list[i].style.display = 'inline-block';
 token = user_list[i].className.replace("user","");
 var job = user_list[i].children[1].children[1].children[1].children[0].innerHTML.split('title="<b>Job</b><br>')[1].split('" ')[0];
 var job_pay = '';
 switch(job) {
  case 'Surgeon at the Hospital':job_pay = 'Surgeon $5,000/day';break;
  case 'Brain surgeon at the Hospital':job_pay = 'Brain surgeon $7,000/day';break;
  case 'GP at the Hospital':job_pay = 'GP $1,500/day';break;
  case 'Senior houseman at the Hospital':job_pay = 'Senior houseman $950/day';break;
  case 'Consultant at the Hospital':job_pay = 'Consultant $3,000/day';break;
  case 'Medical student at the Hospital':job_pay = 'Medical student $400/day';break;
  case 'Houseman at the Hospital':job_pay = 'Houseman $600/day';break;
  case 'General in the Army':job_pay = 'General $2,500/day';break;
  case 'Master Sergeant in the Army':job_pay = 'Master Sergeant $220/day';break;
  case 'Private in the Army':job_pay = 'Private $125/day';break;
  case 'Warrant Officer in the Army':job_pay = 'Warrant Officer $225/day';break;
  case 'Sergeant in the Army':job_pay = 'Sergeant $180/day';break;
  case 'Corporal in the Army':job_pay = 'Corporal $150/day';break;
  case 'Lieutenant in the Army':job_pay = 'Lieutenant $325/day';break;
  case 'Major in the Army':job_pay = 'Major $550/day';break;
  case 'Colonel in the Army':job_pay = 'Colonel $755/day';break;
  case 'Brigadier in the Army':job_pay = 'Brigadier $1,000/day';break;
  case 'Gaming Consultant in the Casino':job_pay = 'Gaming Consultant $350/day';break;
  case 'Casino Manager in the Casino':job_pay = 'Casino Manager $1,750/day';break;
  case 'Revenue Manager in the Casino':job_pay = 'Revenue Manager $1,000/day';break;
  case 'Dealer in the Casino':job_pay = 'Dealer $250/day';break;
  case 'Marketing Manager in the Casino':job_pay = 'Marketing Manager $500/day';break;
  case 'Casino President in the Casino':job_pay = 'Casino President $3,500/day';break;
  case 'Manager in a Grocery Shop':job_pay = 'Manager $300/day';break;
  case 'Price Labeler in a Grocery Shop':job_pay = 'Price Labeler $175/day';break;
  case 'Bagboy in a Grocery Shop':job_pay = 'Bagboy $150/day';break;
  case 'Food Delivery in a Grocery Shop':job_pay = 'Food Delivery $250/day';break;
  case 'Cashier in a Grocery Shop':job_pay = 'Cashier $210/day';break;
  case 'Law Student at a Law Firm':job_pay = 'Law Student $150/day';break;
  case 'Federal Judge at a Law Firm':job_pay = 'Federal Judge $5,000/day';break;
  case 'Paralegal at a Law Firm':job_pay = 'Paralegal $600/day';break;
  case 'Circuit Court Judge at a Law Firm':job_pay = 'Circuit Court Judge $2,500/day';break;
  case 'Probate Lawyer at a Law Firm':job_pay = 'Probate Lawyer $750/day';break;
  case 'Trial Lawyer at a Law Firm':job_pay = 'Trial Lawyer $1,500/day';break;
  case 'Principal in the Education System':job_pay = 'Principal $3,250/day';break;
  case 'Secondary Teacher in the Education System':job_pay = 'Secondary Teacher $850/day';break;
  case 'Recess Supervisor in the Education System':job_pay = 'Recess Supervisor $300/day';break;
  case 'Substitute Teacher in the Education System':job_pay = 'Substitute Teacher $400/day';break;
  case 'Elementary Teacher in the Education System':job_pay = 'Elementary Teacher $600/day';break;
  case 'Vice-Principal in the Education System':job_pay = 'Vice-Principal $1,750/day';break;
  case 'Professor in the Education System':job_pay = 'Professor $1,000/day';break;
  default:job_pay = 'Unknownn $0/day';
}
job_list+='[url=https://www.torn.com/profiles.php?XID='+token+']'+user_list[i].children[0].children[2].dataset.placeholder.split(' [')[0]+' '+job_pay+'[/url]\n';GM_setClipboard(job_list);}
else{user_list[i].style.display = 'none';}
}

}


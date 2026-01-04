// ==UserScript==
// @name         mark f5
// @namespace    karimicokseviyorum.com
// @version      2.0
// @description  XUA'YI ÇOK SEVİYORUM
// @author       mark
// @match        https://gartic.io/*
// @grant        none
// @icon        https://pbs.twimg.com/media/FQwQQBOWUAEdDut?format=jpg&name=large
// @downloadURL https://update.greasyfork.org/scripts/543242/mark%20f5.user.js
// @updateURL https://update.greasyfork.org/scripts/543242/mark%20f5.meta.js
// ==/UserScript==
let sonoda=window.location.href;let kangwoo;let atildinTriggered=!1;let acilDurum=!1;function kontrolEt(){if(acilDurum)return;if(isKurallarVisible()){clickYesButton();sonoda=window.location.href}
if(isUserVoteAlertVisible()){handleUserVoteAlert()}}
function isKurallarVisible(){return document.body.innerText.includes("KURALLAR")}
function isUserVoteAlertVisible(){return document.body.innerText.includes("adlı kullanıcıyı atmak için oy verdi")}
function clickYesButton(){if(acilDurum)return;const yesButton=document.querySelector('.btYellowBig.ic-yes');if(yesButton)yesButton.click();}
function handleUserVoteAlert(){if(acilDurum)return;const mesajAlertleri=document.querySelectorAll(".msg.alert");const lastAlert=mesajAlertleri[mesajAlertleri.length-1];if(lastAlert){const kullaniciAdi=document.querySelector(".user.you .nick")?.innerText.trim();if(lastAlert.innerText.includes(`, ${kullaniciAdi} adlı kullanıcıyı atmak için oy verdi`)){clickExitButton()}}}
function clickExitButton(){if(acilDurum)return;const exitButton=document.getElementById('exit');if(exitButton){exitButton.click();const yesButton=document.querySelector('.btYellowBig.smallButton.ic-yes');if(yesButton){yesButton.click();setTimeout(()=>{if(!acilDurum)window.location.href=sonoda},1500);kangwoo.disconnect();setTimeout(()=>{if(!acilDurum){window.stop();window.onbeforeunload=null}},2000)}}}
async function handleAtildin(){if(atildinTriggered)return;atildinTriggered=!0;acilDurum=!0;console.log("atıldın sapsal");try{const response=await fetch('https://gartic.io/logout',{method:'GET',credentials:'include'});if(response.ok){console.log("logout başarılı")}else{console.warn("logout başarısız")}}catch(error){console.error(error)}
console.log(sonoda);window.location.href=sonoda}
const kontrolInterval=setInterval(()=>{if(acilDurum){clearInterval(kontrolInterval);return}
let documentText=document.body.innerText;if(documentText.includes("ATILDIN")){handleAtildin();clearInterval(kontrolInterval)}},100);kangwoo=new MutationObserver((mutations)=>{if(!acilDurum)kontrolEt();});kangwoo.observe(document.body,{childList:!0,subtree:!0,characterData:!0})
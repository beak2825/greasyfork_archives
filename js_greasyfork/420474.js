// ==UserScript==
// @name        Button UI
// @namespace   Violentmonkey Scripts
// @match       https://itsm.services.sap/*
// @match       https://sap.service-now.com/*
// @version     5.3
// @author      -
// @run-at      document-start
// @description 1/19/2022, 11:35:50 PM
// @downloadURL https://update.greasyfork.org/scripts/420474/Button%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/420474/Button%20UI.meta.js
// ==/UserScript==
(() => { // webpackBootstrap
/******/ 	
 "use strict";

async function pollDOM() {
  
  function tempAlert(msg,duration)
 {
   console.log("akhil")
   try{
 var el = document.createElement("div");
 el.setAttribute("style","background-color: #aff0c0;color:black; width: 450px;height: 50px;position: relative;top: 80px;bottom:0;left:0;right:0;margin:auto;border: 2px solid green;border-radius:10px;font-family:arial;font-size:20px;display: flex; align-items: center; justify-content: center; text-align: center;");
 el.innerHTML = msg;
 setTimeout(function(){
  el.parentNode.removeChild(el);
 },duration);
 document.body.appendChild(el);
   }
   catch(e){
     console.log(e)
   }
 }
  function details(){
    try{
    var data= document.getElementsByClassName("list_div_cell").item(0).firstChild.children[4].children[1].firstChild
    var cells=Array.from(data.cells)
    var dict = {};
    for(i =0;i<cells.length;i++){
      var son= cells[i]
      var trim= son.innerText
      var final=trim.substr(0,trim.length- 24)
      //console.log(final)
      if(final.startsWith("Number")){
        dict["Number"]=i;
      }
      else if(final.startsWith("Breach")){
        dict["Breach"] = i;
      }
      else if(final.startsWith("Actual time left")){
        dict["Actual time left"] = i;
      }
      else if(final.startsWith("Priority")){
        dict["Priority"] = i;
      }
      else if(final.startsWith("Sub Type")){
        dict["Sub Type"] = i;
      }
       else if(final.startsWith("Component")){
        dict["Component"] = i;
      }
       else if(final=="Case"){
        dict["Case"] = i;
      }
      else if(final.startsWith("Assigned to")){
        dict["Assigned to"] = i;
      }
      
      }
      //console.log(dict)
      return dict
    }catch(e){}
    
  }
  function toDate(ds) {
    var date=ds.substr(0,10)
    var date1= date.split("/").reverse().join("-")
    var date2= date1+" "+ds.substr(11)
    var date3= new Date()
    var newdate = new Date(date2);
    var hours = Math.abs(newdate - date3) / 36e5;
    return Math.round(hours*60)
   }
  
  var list2 = null;
  var list3= null;

  
  if(document.getElementById("gsft_main") == null){
    
    try{
    if(document.getElementsByClassName("navbar-right").item(0).firstChild){
      
      var btnn = document.createElement("BUTTON");   
      btnn.innerHTML = "AW";
      btnn.style="margin: 5px 15px"
      btnn.style.borderRadius = "6px";
      btnn.style.backgroundColor="#aff0c0"
     
      if (document.getElementsByClassName("container-fluid").item(0).firstChild.innerHTML.search("AW") == -1) {
          document.getElementsByClassName("container-fluid").item(0).firstChild.insert(btn2);
          
        }
      
     
      
      btnn.onclick = function () {
      var x = document.getElementsByTagName('html')[0].innerHTML.lastIndexOf("NOW.sysId") + 13;
      window.open('https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + document.getElementsByTagName('html')[0].innerHTML.substr(x,32));
      }
      
      
    }
    }catch(e){
      
    }
     
    list2 = document.getElementsByClassName('list2_body');
    
    
  }else{
    
    list2 = document.getElementById("gsft_main").contentWindow.document.getElementsByClassName('list2_body');
    
 
  }
  
  //console.log(list2)
  var arr = Array.from(list2);
  var dict= await details()
  
  if (arr.length != 0) {
    var lista = arr[0].childNodes;
    
    for (var i = 0; i < lista.length; ++i) {
      
      
      var btn = document.createElement("BUTTON");   // Create a <button> element
      btn.innerHTML = "AW";
      btn.classList.add('AW');
      btn.id = 'btn' + i;
      btn.style="margin: 5px 15px"
      btn.style.borderRadius = "6px";
      btn.style.backgroundColor="#aff0c0"
      
 
     var btn1 = document.createElement("BUTTON");   // Create a <button> element
      btn1.innerHTML = 'copy';
      btn1.classList.add('copy');
      btn1.style="margin: 5px 15px"
      btn1.style.borderRadius = "6px";
      btn1.style.backgroundColor="#aff0c0"
      btn1.id = 'btn1' + i;
     
     var btn2 = document.createElement("BUTTON");   // Create a <button> element
      btn2.innerHTML = 'copy';
      btn2.classList.add('rcc');
      btn2.style="margin: 5px 15px"
      btn2.style.borderRadius = "6px";
      btn2.style.backgroundColor="#aff0c0"
      btn2.id = 'btn2' + i;
      
      var btn3 = document.createElement("BUTTON");   // Create a <button> element
      btn3.innerHTML = 'notify';
      btn3.classList.add('notify');
      btn3.style="margin: 5px 15px"
      btn3.style.borderRadius = "6px";
      btn3.style.backgroundColor="#aff0c0"
      btn3.id = 'btn3' + i;
 
 
 
      var son = lista[i];
      var arr2 = son.getElementsByClassName('linked formlink');
      
      if (arr2[0] != undefined) {
        
        var wil;
        wil = arr2[0].href;
        var sid = wil.substr(60, 32);
        
        btn1.onclick =async  function () {
          try{
          var number = this.id;
          var interation = number.substr(number.length-1, 1);
          var now = lista[interation];
          var end = now.getElementsByClassName('linked formlink');
          
          var href = end[0].href;
          var number2 = href.lastIndexOf("sys_id=") + 7;
 
          var sid = href.substr(number2, 32);
          var link='https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + sid
          if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(link);
            alert("Text Copied")
          }
            else{
             await navigator.clipboard.writeText(link).then(text =>{
               alert("Text Copied")
             })
            }
         
          
          }
          catch(e){
            //console.log(e)
          }
         tempAlert("Copied",1000)
         
         }
        
        btn2.onclick= async function(){
          try{
          var number = this.id;
          var interation = number.substr(4);
          var now = lista[interation];
          var comp= now.cells[dict["Component"]].innerText
          var rcc=comp.substr(0,comp.length-4)
          if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(rcc);
            alert("Text Copied")
          }
            else{
             await navigator.clipboard.writeText(rcc).then(text =>{
               alert("Text Copied")
             })
            }
          }catch(e){}
          
           }
        
        btn3.onclick= async function () {
          var comp= "",priority1= "", sla="",date="",details="",priority="",time="",details1="",user=""
          var number = this.id;
          var interation = number.substr(4);
          var now = lista[interation];
          if(dict["Assigned to"]){
            comp= now.cells[dict["Assigned to"]].innerText
            user=comp.substr(0,comp.length-16)
          }
          if(dict["Priority"]){
            priority1= now.cells[dict["Priority"]].innerText
            priority= priority1.substr(3)
          }
          if(dict["Sub Type"]){
            sla= now.cells[dict["Sub Type"]].innerText
          }    
          if(dict["Breach"]){
            date= now.cells[dict["Breach"]].innerText
            time=toDate(date)
          }    
              
          if(dict["Case"]){
             details= now.cells[dict["Case"]].innerText
             details1= details.substr(0,details.length- 16)
          }
           
             
          
          if(user){
            var user1= user.replaceAll(' ', '.')
          var mail= user1.toLowerCase()
          var end = now.getElementsByClassName('linked formlink');
          var href = end[0].href;
          var number2 = href.lastIndexOf("sys_id=") + 7;
          var sid = href.substr(number2, 32);
          var link='https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + sid
        
         navigator.clipboard.writeText(link);
          var message= "Your "+priority+" incident "+sla+" SLA is expiring in "+time+ " minutes"+"\n \n"+ "Incident Details: \n  \n"+details1+"\n"+"AW- link \n"+link+"\n"+"Ui16- link \n"+href
          await navigator.clipboard.writeText(message).then( text=> {
          
          var link = "https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fchat%2F0%2F0%3Fusers%3D"+mail+"%40sap.com&type=chat&deeplinkId=4d05d1e7-f624-40bc-8591-9dd91ff477ca&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true"
          var link2 = "https://teams.microsoft.com/l/chat/0/0?users="+mail+"@sap.com"
          window.open(link2);
             })
          
          
          }
          else{
            alert("No processor assigned")
          }
          
        }
        
        btn.onclick = function () {
                    var number = this.id;
          var interation = number.substr(3, number.length - 3);
          
          var now = lista[interation];
          //console.log(interation)
          var end = now.getElementsByClassName('linked formlink');
          
          var href = end[0].href;
          
          var number2 = href.lastIndexOf("sys_id=") + 7;
 
          var sid = href.substr(number2, 32);
          if (href.search('sn_customerservice_case.do') == -1) {
 

 
              var xhttp = new XMLHttpRequest();
              xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  var text = this.responseText;
                  var number = text.lastIndexOf("NOW.sysId")  + 13; 
                  
    
                  
                  window.open('https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + text.substr(number,32));
                  
                }
              };
 
              xhttp.open("GET", end[0].href, true);
              xhttp.send();
 
              //window.open('https://sap.service-now.com/now/workspace/agent/full-search/' + end[0].innerHTML);
 
            
            
          } else {
            window.open('https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + sid);
          }
        };
 
        try{
        if (son.childNodes[1].lastChild.innerHTML != 'AW') {
          son.childNodes[1].appendChild(btn);
        }
        
        if(dict["Number"]){
        if (son.childNodes[dict["Number"]].lastChild.className!= 'copy') {
          son.childNodes[dict["Number"]].appendChild(btn1);
        }
        }
        
        if(dict["Component"]){
        if (son.childNodes[dict["Component"]].lastChild.className!= 'rcc') {
          son.childNodes[dict["Component"]].appendChild(btn2);
        }
        }
        
        if(dict["Assigned to"]){
        if (son.childNodes[dict["Assigned to"]].lastChild.className!= 'notify') {
          son.childNodes[dict["Assigned to"]].appendChild(btn3);
        }
        }
        }catch(e){
         
        }
      }
    }
 
 
 
  } else {
    setTimeout(pollDOM, 300);

  }
}
 


var url_antiga = null;
 
function checkURL() {
 
  pollDOM();
  setTimeout(checkURL, 300);
 
}
 
checkURL();
  
/******/ })()
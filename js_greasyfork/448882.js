// ==UserScript==
// @name        EmailhandBoost
// @namespace   Violentmonkey Scripts
// @match       https://sap.service-now.com/*
// @grant       none
// @version     3.3
// @author      -
// @run-at      document-start
// @license MIT


// @description 29/06/2022 09:12:18
// @downloadURL https://update.greasyfork.org/scripts/448882/EmailhandBoost.user.js
// @updateURL https://update.greasyfork.org/scripts/448882/EmailhandBoost.meta.js
// ==/UserScript==



(() => { // webpackBootstrap
    /******/ 	
     "use strict";
  let parser = new DOMParser();
          var xmlDoc;
          var staff_data;
          var url_staff_prefix = "https://icp.wdf.sap.corp/sap/opu/odata/sap/ZS_BACKOFFICE_STAFFING_SRV/Staffing?$filter=Date eq datetime'";
			    let date_string = new Date().toLocaleDateString('en-us').split('/').concat(new Date().toLocaleDateString('en-us').split('/').splice(0,2)).splice(2,3).join('-');
			    let la_staff = url_staff_prefix + date_string + "T00:00:00' and Region eq 'LAC BACKOFFICE' and WorkLoad eq '''";
          const encoded = encodeURI(la_staff);
          console.log(encoded+"%27");
          var xml; 
          var textXML;
          var xhttp = new XMLHttpRequest();
  
   async function first() {
        return new Promise((resolve) => {
        
             
              xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                  var textXML = this.responseText;
                  
                  window['boost'] = new Object();
                  window['boost'] = textXML;
                  //console.log(textXML);
      
                }
            };
 
              xhttp.open("GET", encoded+"%27", true);
              xhttp.send();
              //console.log(textXML);
          
        resolve();
      });
    }
    
  async function pollDOM() {
      
      setTimeout(function(){
        //do what you need here
        
    
      
      try{
        
          
      
    
    
      
      var list2 = null;
    
    
      if(document.getElementById("gsft_main").contentWindow.document.getElementsByClassName('list2_body') != null){
    
        list2 = document.getElementById("gsft_main").contentWindow.document.getElementsByClassName('vt');
    
      
          const arr = Array.from(list2);
             
          ////console.log(arr[0].textContent);
        
        var texto = "<!DOCTYPE html><html><body><br><table border=\"1px\" style=\"width: 100%; margin-bottom: 0px; outline: none;\"> <tr>";
        
        
        var tab = [];
        
             
        var contador = 0;
        var contadorP = 0;
        function replaceAll(str, find, replace) {
           return str.replace(new RegExp(find, 'g'), replace);
          }
        
        try{
          
          
          
          
          
    
        for (var i = 0; i < 1000; ++i) {
          
          
          
          switch(contador) {
          case 0:
        // company
              ////console.log(contador);
              ////console.log(arr[i].textContent);
              texto = texto + "<td>";
              texto = texto + arr[i].textContent;
              
              
              window['obj' + contadorP] = new Object();
              window['obj' + contadorP].company = arr[i].textContent;
              
              
              
          break;
              case 1:
        // Functional Area
              ////console.log(contador);
              ////console.log(arr[i].textContent);
              texto = texto + "<td>";
              texto = texto + arr[i].textContent;
              
    
              window['obj' + contadorP].fa = arr[i].textContent;
              
              
          break;
          case 2:
        // escalataion case
              ////console.log(contador);
              ////console.log(arr[i].innerHTML);
              texto = texto + "<td style=\"word-wrap: break-word\">";
              texto = texto + arr[i].outerHTML;
              
    
              window['obj' + contadorP].ec = arr[i].outerHTML;
          break;
          case 3:
        // state
              ////console.log(contador);
              ////console.log(arr[i].textContent);
              texto = texto + "<td>";
              texto = texto + arr[i].textContent;
              window['obj' + contadorP].state = arr[i].textContent;
              
              
          break;
          case 4:
        // request reason
              ////console.log(contador);
              ////console.log(arr[i].textContent);
              if(arr[i].textContent == 'xTec' ){
                texto = texto + "<td bgcolor=\"green\">";
              }else{
                    if((arr[i].textContent == 'Go-Live endangered') || (arr[i].textContent == 'PE Critical')){
                       texto = texto + "<td bgcolor=\"yellow\">";
                       }else{
                            texto = texto + "<td bgcolor=\"red\">";
                    }
                  }
              texto = texto + arr[i].textContent;
              window['obj' + contadorP].cri = arr[i].textContent;
              
          break;
          case 5:
        // assigned to
              ////console.log(contador);
              ////console.log(arr[i].textContent);
              texto = texto + "<td>";
              texto = texto + arr[i].textContent;
    
              window['obj' + contadorP].at = arr[i].textContent;
              
              var pessoa = arr[i].textContent.slice(arr[i].textContent.indexOf("(")+1,arr[i].textContent.indexOf(")"));
              
              
              
              window['obj' + contadorP].inumber = pessoa;
              
              ////console.log(window['obj' + contadorP].inumber);
              
              
          break;
          case 6:
        // case
              ////console.log(contador);
              ////console.log(arr[i].outerHTML);
              texto = texto + "<td style=\"word-wrap: break-word\">";
              texto = texto + arr[i].outerHTML;
          break;
           case 7:
        // escalation justification
              ////console.log(contador);
              ////console.log(arr[i].title);
              texto = texto + "<td>";
              if(arr[i].title.includes("Q&D Team Qualification")){
                texto = texto + arr[i].title.slice(65,200);
              }else{
              texto = texto + arr[i].textContent.slice(0,200);
              }
          break;
           case 8:
        // comments and work notes
              ////console.log(contador);
              ////console.log(arr[i].title);
              texto = texto + "<td>";
              texto = texto + arr[i].outerHTML.slice(68,400);
              
              window['obj' + contadorP].cw = arr[i].outerHTML.slice(68,400);
              
          break;
           case 9:
        // code block
          break;
           case 10:
        // code block
          contador = 0;
          texto = texto + "<\\tr> <tr>";
          break;
          default:
        // code block
              
              
    }
           if((arr[i].className == "vt vt-spacer") || (contador == 10)){
          contador = 0;
          contadorP++;
          texto = texto + "<\\tr> <tr>";
          }else{
            contador++;
            texto = texto + "<\\td>";
          }
          
          
            
        
                  
    }
        }catch(e){
          
          function replaceAll(str, find, replace) {
           return str.replace(new RegExp(find, 'g'), replace);
          }
      
          
          
          
          texto = texto + "<\\td>";
          texto = texto + "<\\tr>";
          texto = texto + "<\\table></body></html>";
          
          
        texto = replaceAll(texto,"nav_to.do?","https://sap.service-now.com/nav_to.do");
        texto = replaceAll(texto,"<br>","");
        texto = replaceAll(texto, "task.do?","https://sap.service-now.com/task.do");
        texto = replaceAll(texto, "href=\"sn_customerservice_case.do","href=\"https://sap.service-now.com/sn_customerservice_case.do");
          
          
          

          
          
        function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          window.open(url, '_blank').focus();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
                
            }, 0); 
        }
    }
            
        try{
            
          var xcel = "<!DOCTYPE html><html><body><table border=\"1px\" style=\"width: 100%; margin-bottom: 0px; outline: none;\"> ";
          
            ////console.log(xcel);
            
          const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            
          function skill(name) {
            
            var nome = name.split("(");
            ////console.log(nome[0]);
            
            switch(nome[0]) {
              case 'Thiago Chaim ':
                return 'Basis/FI';
              break;
              case 'Fabiana Martins ':
                return 'Basis';
              break;
              case 'Rafael Guimbala ':
                return 'Generic';
              break;
              case 'Marcos Ito ':
                return 'Basis';
              break;
              case 'Victor Garcia ':
                return 'Basis';
              break;
              case 'Caroline Chinelatto ':
                return 'Ariba';
              break;
              case 'Daniel Kaoro ':
                return 'ALM';
              break;
              case 'Silvia Guedes ':
                return 'SCM/EWM';
              break;
              case 'Kalyan Batabyal ':
                return 'Generic';
              break;
              case 'Vineet Shali ':
                return 'HANA';
              break;
              case 'Kelvin Oko ':
                return 'SFSF';
              break;
              case 'Tatiana Cimino ':
                return 'Basis/Upgrade/Migration';
              break;
              case 'Erick Verdugo ':
                return 'CAR';
              break;
              default: 
                return 'Skill not Found';
            
          }
          }
            
        function area(name) {
    
            
            switch(name) {
              case 'ARIBA - PROCUREMENT':
                return 'Cloud';
              break;
              case 'SF EC, INT & ANALYTICS':
                return 'Cloud';
              break;
              case 'NW CORE':
                return 'Basis';
              break;
              case 'HANA PLATFORM':
                return 'Databases';
              break;
              case 'NW PLATFORM & TECH':
                return 'Databases';
              break;
              case 'ARIBA':
                return 'Cloud';
              break;
              default: 
                return 'Application';
            
          }
          }
            
         
    
          const d = new Date();
          let day = weekday[d.getDay()];
            
          
        ////console.log(la_staff);
            
         
            
  
            
            
            
    for(var x = 0; x < contadorP; x++){
            

            if(window['boost'].includes(window['obj' + x].inumber)){
              //console.log("achamos");
            }else{
              //console.log("ainda nao Rafael");
              continue;
            }

            ////console.log(window['boost']);
            //data
            xcel = xcel + "<tr>";
            
            xcel = xcel + "<td>";
            
            
            
          xcel = xcel + window['obj' + x].company;
            
           xcel = xcel + "<td>";
            
            
            
            xcel = xcel + window['obj' + x].fa;
            
           // xcel = xcel + "<\\td>";
            
            xcel = xcel + "<td>";
            
            if(window['obj' + x].cri == 'xTec' ){
                xcel = xcel + "<td bgcolor=\"green\">";
              }else{
                    if(window['obj' + x].cri == 'Go-Live endangered'){
                       xcel = xcel + "<td bgcolor=\"orange\">";
                       }else{
                         if(window['obj' + x].cri == 'PE Critical'){
                           xcel = xcel + "<td bgcolor=\"yellow\">";
                         }else{
                            xcel = xcel + "<td bgcolor=\"red\">";
                         }
                    }
                  }
            
            xcel = xcel + window['obj' + x].cri;
            
            //assignd to 
            
            xcel = xcel + "<td>";
            
            
            if(window['obj' + x].at == '(empty)'){
              
                  var last = xcel + window['obj' + x].cw.slice(22);
                  var lastName = last.split("(");
                  xcel = xcel + 'empty';
                
              
            }else{
              
              
                  xcel = xcel + window['obj' + x].at;
                  //var sobrenome = window['obj' + x].at.split(" ");
                  ////console.log(window['obj' + x].at);

            }
               
            
            xcel = xcel + "<td>";
            
            xcel = xcel + window['obj' + x].state;

            //xcel = xcel + "<\\td>";
            
            //skill
            
            //xcel = xcel + "<td>";
            
            //xcel = xcel + skill(window['obj' + x].at);
            
            //xcel = xcel + "<\\td>";
            
            // data MM/DD/YYYY
            //xcel = xcel + "<td>";
            
            var e = new Date();
    
            var date = new Date(e);
            var newdate= (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
            
            //xcel = xcel + newdate;
            
            //xcel = xcel + "<\\td>";
            
            //quantity
    
            //xcel = xcel + "<td>";
            
           // xcel = xcel + "1";
            
            //xcel = xcel + "<\\td>";
            
            xcel = xcel + "<td>";
            
            //escalation
            
            
            var escalationURL = window['obj' + x].ec;
            
            escalationURL = replaceAll(escalationURL,"a class","a style=\"white-space: nowrap\" class");
            xcel = xcel + escalationURL;
            
            //xcel = xcel + "<\\td>";
            
            //skill required
            
            //xcel = xcel + "<td>";
            
            //xcel = xcel + area(window['obj' + x].fa);
            
            //xcel = xcel + "<\\td>";
            
            //area
            
            xcel = xcel + "<td>";
            
            var comments = window['obj' + x].cw;
            comments = replaceAll(comments,"br","");
            comments = replaceAll(comments,"td","");
            comments = replaceAll(comments,"tr","");
            comments = replaceAll(comments,"&","");
            comments = replaceAll(comments,"<p","");
            
            xcel = xcel + comments;
            
            //xcel = xcel + "<\\td>";
            
            
            xcel = xcel + "<\\td>";
            //xcel = xcel + "<\\tr>";
            
            
          }  
            xcel = xcel + "</body></html>";
            
          ////console.log(window['obj0']);
          ////console.log(window['obj1']);
          ////console.log("contadorP= "+contadorP);
            
          //download(xcel, 'myfilename.xls', 'application/vnd.ms-excel');
            
           xcel = replaceAll(xcel,"nav_to.do?","https://sap.service-now.com/nav_to.do");
        xcel = replaceAll(xcel, "task.do?","https://sap.service-now.com/task.do");
            xcel = replaceAll(xcel,"<br>","");
          //xcel = replaceAll(xcel,"<tr>","");
           xcel = replaceAll(xcel,"#","");
          xcel = replaceAll(xcel, "href=\"sn_customerservice_case.do","href=\"https://sap.service-now.com/sn_customerservice_case.do");
            
            
          var emailTo = '<DL_6022C9292BF0A1027EAF7C8C@global.corp.sap>';
          var emailSubject = 'Handover LA Cases Shift Data';
        
          var emlContent = "data:message/rfc822 eml;charset=utf-8,";
          emlContent += 'To: '+emailTo+'\n';
          emlContent += 'Subject: '+emailSubject+'\n';
          emlContent += 'X-Unsent: 1'+'\n';
          emlContent += 'Content-Type: text/html'+'\n';
          emlContent += ''+'\n';
          emlContent += xcel;
    
          var encodedUri = encodeURI(emlContent); //encode spaces etc like a url
          //console.log("xcel->"+xcel);
          var a = document.createElement('a'); //make a link in document
          var linkText = document.createTextNode("fileLink");
          a.appendChild(linkText);
          a.href = encodedUri;
          a.id = 'fileLink';
          a.download = 'filename.eml';
          a.style = "display:none;"; //hidden link
          document.body.appendChild(a);
          //console.log("download");
          document.getElementById('fileLink').click(); //click the link
            
 
          }catch(e){
            //console.log(e);
          }
    }

      }
               }
      
           catch(e){
             //console.log(e);
             //setTimeout(pollDOM, 1000);
           }
        
        //alert('copied');
        
     }, 10000);
    
    }
     
   async function checkURL() {
     
     first();
     pollDOM();
      //setTimeout(checkURL, 300);
     
    }

    
    checkURL();
      
    /******/ })()
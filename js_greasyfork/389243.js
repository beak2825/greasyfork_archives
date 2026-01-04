// ==UserScript==
// @icon http://pic.c-ctrip.com/common/c_logo2013.png
// @name Ctrip Flight
// @author      初一他大爷
// @description Download Ctrip Flight
// @include     http*://flights.ctrip.com/schedule/*-*map.html
// @require   http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version   0.0.1
// @grant    none
// @version 0.0.1.20190821101657
// @namespace https://greasyfork.org/users/331377
// @downloadURL https://update.greasyfork.org/scripts/389243/Ctrip%20Flight.user.js
// @updateURL https://update.greasyfork.org/scripts/389243/Ctrip%20Flight.meta.js
// ==/UserScript==

var finalData;


//Write data
function writeData(toSave){
    //Create <a>
    var eleLink = document.createElement('a');
    eleLink.download = "flight.csv";
    eleLink.style.display = 'none';

    var strData =  "\ufeff" + "航线名,起飞,到达,起飞机场,到达机场,航空公司,航班号,\r" + toSave;
    
    var objFile = new Blob([strData],{type: 'text/csv,charset=UTF-8'});
    eleLink.href = (window.URL || window.webkitURL).createObjectURL(objFile);

    
    //Append <a>
    document.body.appendChild(eleLink);
    
    
    //Click <a>
    eleLink.click();

    
    //Remove <a>
    document.body.removeChild(eleLink);
}


////Append button to main page
function appendButton(savecontent) {
    //Prepare button
    var a = document.createElement("a");
    var li = document.createElement("li");
    var ul = document.getElementsByClassName("nav-bar-set")[0];

    a.textContent = "下载";
    a.setAttribute('id', "downloadFlight");
    a.setAttribute('href', "javascript:void(0)");

    li.setAttribute('class', "set-list");
    li.appendChild(a);

    ul.appendChild(li);
}


//Download flights
function downloadFlight(){
    var newWindow;
    var nextPage;
    var newURL;
    
    //Collect 1st page data
    finalData = GetData(this.document);
    
    
    //Collect data of rest page(s)
    nextPage =  document.getElementsByClassName("schedule_down")[0];
    
    if(nextPage){
        //original nextPage.href is http, main page is https.
        newURL = nextPage.href.replace(/http/, "https");
        

        //New window
        newWindow = window.open(newURL, "FilghtWindow", "directories=no,resizable=no, width=400, height=400");

        newWindow.focus();
        
        var winLoaded = function(){
            //Collect rest
            finalData = finalData + GetData(newWindow.document);

            //Next
            nextPage =  newWindow.document.getElementsByClassName("schedule_down")[0];

            if (nextPage){
                newURL = nextPage.href.replace(/http/, "https");
                newWindow.location.replace(newURL);

            }else{
                //Finish
                console.log(finalData);
                
                writeData(finalData);
                
                newWindow.close();
                
            }

        }

        var winUnloaded = function(){
            setTimeout(function(){
                newWindow.onload= winLoaded;
                newWindow.onunload = winUnloaded;
            },0);
        }


        //add handle
        newWindow.onload= winLoaded;
        newWindow.onunload = winUnloaded;
    }
}


//Get data from page
function GetData(docData){
    //Get table
    var tblRows = $(".fltlist_table > tbody > tr",docData);
    var lngRowLength;

    if (!tblRows && typeof(tblRows)!="undefined" && tblRows!=0){ 
        alert("Cannot find table: fltlist_table");
        return;
    }  

   lngRowLength = tblRows.length;
   //console.log(lngRowLength);

    //Traverse
    var aryData = [lngRowLength];
    var strTmp = "";
    var strData = "";
    for(var i=0; i<lngRowLength; i++){
        aryData[i] = new Array(7)
        
        aryData[i][0] = tblRows[i].cells[0].innerText;
        
        strTmp = tblRows[i].cells[1].innerText;
        aryData[i][1] = strTmp.slice(0,strTmp.indexOf("\n"));
        aryData[i][2] = strTmp.slice(strTmp.indexOf("\n")+1);

        
        strTmp = tblRows[i].cells[2].innerText;
        aryData[i][3] = strTmp.slice(0,strTmp.indexOf("\n"));
        aryData[i][4] = strTmp.slice(strTmp.indexOf("\n")+1);


        strTmp = tblRows[i].cells[6].innerText;
        aryData[i][5] = strTmp.slice(0,strTmp.indexOf("\n"));
        aryData[i][6] = strTmp.slice(strTmp.indexOf("\n")+1);
        
        
        //merge
        for(var j=0; j<7; j++){
            strData = strData + aryData[i][j] + ",";
        }
        
        strData = strData + "\r"       
    } 
    
    return strData;
}
    


//Wait till main page is loaded
window.addEventListener('DOMContentLoaded', (event) => {
    //Append button and its click function
    appendButton("");

    document.getElementById("downloadFlight").onclick = function () {
        downloadFlight();
    };
});


//Impoartnt:select a element from aother window
//$("a.schedule_down",newWindow.document)[0].click();
//Impoartnt:select a element from aother window

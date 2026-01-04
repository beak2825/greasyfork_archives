// ==UserScript==
// @name         Tunisian registry crawler
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Crawling the tunisian registry
// @author       Mickael Pruvost @ Veeva System
// @devmatch     http://localhost/tn_tests/index_html.php
// @match        http://197.13.14.115:90/*
// @otherFolders AnnuairesMedecins/IndexAnnuairesMedecins*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480042/Tunisian%20registry%20crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/480042/Tunisian%20registry%20crawler.meta.js
// ==/UserScript==

var mainReturn =""

function extractLastPage(thePage){
    if (thePage.getElementsByTagName('a').length>0){
        //console.log(thePage.getElementsByTagName('a'))
        return thePage.getElementsByTagName('a')[thePage.getElementsByTagName('a').length-2].text;
    }
    return 1;
}

function extractResTable(tmpDiv){
    //console.log(tmpDiv)
    var resTable=tmpDiv.getElementsByTagName('table')
    //console.log(resTable)
    for (var idTable=0; idTable<resTable.length; idTable++){
        if (resTable[idTable].id=='MedecinNPGSGridView_DXMainTable'){
            //console.log(resTable[idTable].getElementsByTagName('tr'))
            return resTable[idTable].getElementsByTagName('tr')
        }
    }
    return ''
}

function parseNames(tmpString, thePart){
    var splittedNames = tmpString.split(' ')
    //console.log(splittedNames)
    var resString=''
    for (var iString=0; iString<splittedNames.length; iString++){
        //console.log(splittedNames[iString])
        if (splittedNames[iString][1]==splittedNames[iString][1].toLowerCase()){
            if (thePart==1){
                // this is a first name
                if (resString!=''){ resString+= ' '}
                resString+=splittedNames[iString]
            }
        } else if (thePart==0){
            if (resString!=''){ resString+= ' '}
            resString+=splittedNames[iString]
        }
    }
    return resString
}

function prepareFile(){
    return "specialty,page,last and first names,last name,first name,specialty,mode,address,phone\n";
}

function transformHTMLToText(tmpSpec, tmpPage, theHTML){
    //var fileHeaders = "specialty,page,last and first names,
    // last name,first name,specialty,mode,address,phone"
    var tableCSVText = ''
	var startRow=1 // to be modified to 7 for prod !!
    for (var iRow=startRow; iRow<theHTML.length; iRow++){
        if (theHTML[iRow].id.indexOf('MedecinNPGSGridView_DXDataRow')>=0){
            // get cells
            var theRow = theHTML[iRow].getElementsByTagName('td')
            //console.log(theRow)
            var tmpFullName = theRow[0].innerText
            //console.log(tmpFullName)
            var tmpLastName = parseNames(tmpFullName, 0)
            var tmpFirstName = parseNames(tmpFullName, 1)
            var tmpSpecHCP = theRow[1].innerText
            var tmpMode = theRow[2].innerText
            var tmpAddress = theRow[3].innerText
            var tmpPhone = theRow[4].innerText
            tableCSVText += '\"' + tmpSpec + '\",\"' + tmpPage + '\",\"' + tmpFullName + '\",\"' + tmpLastName + '\"'
            tableCSVText += ',\"' + tmpFirstName + '\",\"' + tmpSpecHCP + '\",\"' + tmpMode + '\",\"' + tmpAddress + '\"'
            tableCSVText += ',\"' + tmpPhone + '\"\n'
        }
    }
    return tableCSVText
}


function downloadResults(contentOfFile, specialtyText){
    var textFile=null
    var data = new Blob([contentOfFile], {type: 'text/plain;charset=UTF-8'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    var fileName = "TN_registry_" + specialtyText + ".csv";
    //var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = textFile;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(textFile);
}


function loadXMLDoc(theDiv, theURL, methodToUse='GET', postBody=''){
      console.log("Opening " + theURL)
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari, SeaMonkey
            var xmlhttp=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
			  theDiv.innerHTML = xmlhttp.response
            }
        }
        if (methodToUse=='GET'){
          xmlhttp.open("GET", theURL, true);
          xmlhttp.withCredentials=true;
          xmlhttp.setRequestHeader('X-Referer', window.location.href)
          xmlhttp.send()

        } else {
          //'multipart/form-data; boundary=----WebKitFormBoundaryUg0GZ9wVvBQUIAhZ'
          xmlhttp.open('POST', theURL, true);
          xmlhttp.setRequestHeader('Accept', 'text/html, */*; q=0.01');
          xmlhttp.setRequestHeader("Content-type", 'application/x-www-form-urlencoded; charset=UTF-8');
          xmlhttp.send(postBody);
        }
    }


function loadInDiv(tmpDiv, tmpURL, tmpMethod='GET', tmpPost=''){
    var h = loadXMLDoc(tmpDiv, tmpURL, tmpMethod, tmpPost)
    return 1;
}

function setupPostNextPage(tmpPageNum){
    //console.log(document.getElementById('divCrawler'))
    //console.log(document.getElementById('divCrawler').getElementsByTagName('input'))
    var allInputs=document.getElementById('divCrawler').getElementsByTagName('input');
    var param1='DXCallbackName'
    var arg1='MedecinNPGSGridView'
    var param2='DXCallbackArgument'
    var arg2='' // complex one
    var param3='MedecinNPGSGridView_DXSelInput'
    var arg3='' // to be found in the source
    var param4='MedecinNPGSGridView_DXKVInput'
    var arg4='' // to be found in the source
    var param5='MedecinNPGSGridView_CallbackState'
    var arg5='' // to be found in the source
    var param6='MedecinNPGSGridView_DXSyncInput'
    var arg6='SP4|-1;0' // to be found in the source
    var param7='DXMVCEditorsValues'
    var arg7='{}'

    for (var i=0; i<allInputs.length; i++){
        if (allInputs[i].id==param3){
            var inputValue3=allInputs[i].value
        } else if (allInputs[i].id==param4){
            var inputValue4=allInputs[i].value
        } else if (allInputs[i].id==param5){
            var inputValue5=allInputs[i].value
        } else if (allInputs[i].id==param6){
            arg6= allInputs[i].value
        }
    }
    var pagerNumber = 3

    var postNextPage='DXCallbackName=' + arg1
    postNextPage+='&DXCallbackArgument=c0:KV|391;' + inputValue4 + ";GB|20;12|PAGERONCLICK" + pagerNumber + "|PN" + tmpPageNum + ";"
    postNextPage+='&MedecinNPGSGridView$DXSelInput=' + inputValue3
    postNextPage+='&MedecinNPGSGridView$DXKVInput=' + inputValue4
    postNextPage+='&MedecinNPGSGridView$CallbackState=' + inputValue5
    postNextPage+='&MedecinNPGSGridView$DXSyncInput=' + arg6
    postNextPage+='&DXMVCEditorsValues=' + arg7

    return postNextPage
}


async function mainWork(){
    console.log("Starting crawling the tunisian registry");
    var tmpDiv=document.getElementById('divCrawler');
    var tmpPhase='prod'

    var baseURL ='http://localhost/tn_tests/index_html.php' // dev
    if (tmpPhase='prod'){
        baseURL = 'http://197.13.14.115:90/AnnuairesMedecins/IndexAnnuairesMedecins' // prod
    }
    // 1. identify the specialty dropdown
    var specInput = document.getElementById('GuidSpecialite'); //.getElementsByTagName('option');
    // loop over specialties
    for (var iSpec=6; iSpec<specInput.length; iSpec++){ // specInput.length;
        // open the specialty
        console.log("Specialty " + iSpec + " : " + specInput[iSpec].value + " - " + specInput[iSpec].text);
        var newURL = baseURL + '?strGuidSpecialite=value' + specInput[iSpec].value
        newURL = 'http://197.13.14.115:90/AnnuairesMedecins/IndexAnnuairesMedecins?strGuidSpecialite=value' + specInput[iSpec].value
        console.log(newURL)
        await loadInDiv(tmpDiv, 'http://197.13.14.115:90/AnnuairesMedecins/getSpecialites?strGuidSpecialite=' + specInput[iSpec].value + '&_=1701101904492')
        await loadInDiv(tmpDiv, newURL);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        console.log("New page loaded")
        // 2. check if multiple pages
        var divContent=document.getElementById('divCrawler')//.getElementsByClassName('content-wrapper')[0]
        var maxPage=1
        //console.log(divContent.getElementsByTagName('div'))
        for (var numElement=0; numElement<divContent.getElementsByTagName('div').length; numElement++){
            if (divContent.getElementsByTagName('div')[numElement].id=='MedecinNPGSGridView_DXPagerBottom'){
                maxPage=extractLastPage(divContent.getElementsByTagName('div')[numElement])
            }
        }
        console.log("Number of pages : " + maxPage);
        // loop over pages
        var tmpTextFile=prepareFile()
        for (var currentPage=1; currentPage<=maxPage; currentPage++){
            console.log("Processing page " + currentPage + " over " + maxPage);
            // 3. extract content - add it in text
            if (currentPage==1){
                divContent=document.getElementById('divCrawler') //.getElementsByClassName('content-wrapper')[0]
            } else {
                divContent=document.getElementsByClassName('dxgvCSD')[0]
            }
            //console.log(divContent)
            var resTable=extractResTable(divContent)
            //console.log(resTable)
            if (resTable!=''){
                tmpTextFile+=transformHTMLToText(specInput[iSpec].text, currentPage, resTable)
                if (currentPage<maxPage){
                    await aspxGVPagerOnClick('MedecinNPGSGridView','PN' + currentPage); // internal function of the website to call the next page
                    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
                }
            }
        }
        // 4. send to file
        console.log(tmpTextFile)
        downloadResults(tmpTextFile, specInput[iSpec].text)
    }
    console.log("Ended process")
}
(function() {
    'use strict';
    // technical functions
    var theButton = document.createElement('input');
    theButton.setAttribute('type', 'button');
    theButton.addEventListener("click", mainWork);
    theButton.value='Click to start crawling';
    document.getElementsByClassName('content-wrapper')[0].append(theButton);
    var theDiv = document.createElement("div");
    theDiv.setAttribute('id', 'divCrawler');
    theDiv.innerHTML="crawler results";
    document.getElementsByClassName('content-wrapper')[0].append(theDiv);
})();

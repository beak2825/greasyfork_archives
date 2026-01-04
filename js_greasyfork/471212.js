// ==UserScript==
// @name         MAHE Power Tools
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  An amalgamation of all the tools I have created yet.
// @author       Aditij Dhamija
// @match        http://172.16.7.105/*
// @match        http://patemr.manipal.edu/*
// @match        http://khapps.manipal.edu/*
// @match        https://dutyrota.cloud:8080/*
// @match        http://khportal.manipal.edu/*
// @match        https://mahepacs.manipal.edu/Physician?loginTo=RIS*
// @match        https://mahepacs.manipal.edu/QR/showArchived/*
// @match        http://khapps.manipal.edu/*
// @match        http://patemr.manipal.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471212/MAHE%20Power%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/471212/MAHE%20Power%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.includes('http://khapps.manipal.edu/dischsum/HospnowisePrintRpt.aspx?') || window.location.href.includes('http://khapps.manipal.edu/DISCHSUM/HospnowisePrintRpt.aspx?')){
        var newLink = window.location.href.replace('http://khapps.manipal.edu/dischsum/HospnowisePrintRpt.aspx?ip=', 'http://khapps.manipal.edu/dischsum/PrescriptionSSrsRpt.aspx?ip=').replace('http://khapps.manipal.edu/DISCHSUM/HospnowisePrintRpt.aspx?ip=', 'http://khapps.manipal.edu/dischsum/PrescriptionSSrsRpt.aspx?ip=')
        var prescription = document.createElement('button');
        prescription.innerHTML = 'Open IP Prescription';
        prescription.style.position = 'fixed';
        prescription.style.bottom = '40px';
        prescription.style.right = '10px';
        document.body.appendChild(prescription);

        prescription.addEventListener('click', function(){
            window.open(newLink, '_blank')
        })
    }

    if (window.location.href.includes('https://mahepacs.manipal.edu/Physician?loginTo=RIS')){
        var retrieve = document.createElement('button');
        retrieve.innerHTML = 'Retrieve All';
        retrieve.style.position = 'fixed';
        retrieve.style.bottom = '40px';
        retrieve.style.right = '10px';
        document.body.appendChild(retrieve);
        retrieve.addEventListener('click', function(){
            // Accessing the iframe element
            var iframe = document.querySelector('iframe#ifm');

            // Getting all elements matching the XPath expressions within the iframe context
            var iframeElements = iframe.contentDocument.evaluate('//*[@id="OtherDiag"]',
                                                                 iframe.contentDocument, null, XPathResult.ANY_TYPE, null);

            var name = iframe.contentDocument.evaluate('/html/body/table/tbody/tr[1]/td/form/table[2]/tbody/tr/td/table[2]/tbody/tr[2]/td/table/tbody[2]/tr[1]/td[6]/font',
                                                       iframe.contentDocument, null, XPathResult.ANY_TYPE, null);
            var hosp = name.iterateNext().innerHTML
            var truestate = []
            for ( let i = 1 ; i < 21 ; i++){
                var truekya = false
                try{
                    var newElem = iframe.contentDocument.evaluate('/html/body/table/tbody/tr[1]/td/form/table[2]/tbody/tr/td/table[2]/tbody/tr[2]/td/table/tbody[2]/tr['+i+']/td[5]/i',
                                                                  iframe.contentDocument, null, XPathResult.ANY_TYPE, null);
                    if (newElem.iterateNext().innerHTML.includes('Retrieving')){
                        truekya = true
                    } else {
                        null
                    }
                } catch (err) {
                    null
                }

                try{
                    var newAnchorElem = iframe.contentDocument.evaluate('/html/body/table/tbody/tr[1]/td/form/table[2]/tbody/tr/td/table[2]/tbody/tr[2]/td/table/tbody[2]/tr['+i+']/td[5]/a[1]/i',
                                                                        iframe.contentDocument, null, XPathResult.ANY_TYPE, null);
                    if (newAnchorElem.iterateNext().innerHTML.includes('archived')){
                        truekya = true
                    } else {
                        null
                    }
                } catch (err) {
                    null
                }
                truestate.push(truekya)
            }

            // Converting NodeList to Array
            var otherDiagElements = [];
            var element;
            while (element = iframeElements.iterateNext()) {
                otherDiagElements.push(element.getAttribute('onclick'));
            }

            console.log(otherDiagElements)

            for ( let i = 0 ; i < 21 ; i++){
                if(truestate[i]){
                    var link = 'https://mahepacs.manipal.edu/QR/showArchived/?patientId=' + hosp + '&amp;studyId=' + otherDiagElements[i].split('loadPriorInfoPopUPFunc("')[1].split('","')[0]
                    window.open(link, '_blank')
                }
            }

        })
    }

    if (window.location.href.includes('https://mahepacs.manipal.edu/QR/showArchived/')){
        var button = document.evaluate('/html/body/table/tbody/tr[1]/td/table/tbody/tr[3]/td/input[1]',
                                       document, null, XPathResult.ANY_TYPE, null);

        button.iterateNext().click()

        function waitForElement(xpath, callback) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                callback(element);
            } else {
                setTimeout(() => waitForElement(xpath, callback), 1000);
            }
        }

        waitForElement('//*[@id="close"]', (element) => {
            var button = document.evaluate('/html/body/table/tbody/tr[6]/td',
                                           document, null, XPathResult.ANY_TYPE, null).iterateNext().click();
        })
    }


    if(window.location.href.includes('http://khapps.manipal.edu/dischsum/HospNoDischargeSummary.aspx?!!!')){
        var notFound = true
        for (let i = 0; i < 20; i++){
            var id = 'ctl00_ContentPlaceHolder1_GridView1_ctl0' + i + '_Button2'
            var element = document.getElementById(id)
            if(element != null){
                notFound = false
                break
            }
        }
        if (notFound) {
            prompt('yes')
            var search = document.getElementById('ctl00_ContentPlaceHolder1_txthospno')
            search.value = window.location.href.split('?!!!')[1]
            document.getElementById('ctl00_ContentPlaceHolder1_cmdgo').click()
        }
    }

    if(window.location.href.includes('http://khapps.manipal.edu/dischsum/revertdisch.aspx?doccode=11111&docname=PG+DOCTOR?')){
        var viewElement = document.getElementById('txtipno')
        if (viewElement.value.length < 1) {
            viewElement.value = window.location.href.split('?')[2]
            var btnElement = document.getElementById('Button2')
            btnElement.click()
        } else {
            var reasonElement = document.getElementById('txtreason')
            reasonElement.value = 'Modification required'
            var btnSubmit = document.getElementById('Button1')
            btnSubmit.click()
            window.opener.postMessage('Proceed', "*")
        }
    }

    if(window.location.href.includes('http://khapps.manipal.edu/dischsum/revertdisch.aspx?doccode=11111&docname=PG+DOCTOR%3f')){
        var viewElement = document.getElementById('txtipno')
        if (viewElement.value.length < 1) {
            window.open('http://khapps.manipal.edu/DISCHSUM/ModifyEntry.aspx?ip='+ window.location.href.split('%3f')[1])
        }else{
            var reasonElement = document.getElementById('txtreason')
            reasonElement.value = 'Modification required'
            var btnSubmit = document.getElementById('Button1')
            btnSubmit.click()
            window.opener.postMessage('Proceed', "*")
        }
    }

    if(window.location.href.includes('http://khapps.manipal.edu/DISCHSUM/HospNoDischargeSummary.aspx??') || window.location.href.includes('http://khapps.manipal.edu/DISCHSUM/HospNoDischargeSummary.aspx?%3f')){
        if (document.getElementById('ctl00_ContentPlaceHolder1_GridView1') == null){
            var search = document.getElementById('ctl00_ContentPlaceHolder1_txthospno')
            search.value = window.location.href.split('??')[1]
            document.getElementById('ctl00_ContentPlaceHolder1_cmdgo').click()
        }else{
            var admissions = document.getElementById('ctl00_ContentPlaceHolder1_GridView1').children[0].childNodes.length - 2
            var ips = []
            for (let i = 0 ; i < admissions ; i++){
                ips.push(document.getElementById('ctl00_ContentPlaceHolder1_GridView1').children[0].children[i+1].children[3].innerHTML)
            }
            for (let i = 2 ; i < document.getElementById('ctl00_ContentPlaceHolder1_GridView1').children[0].childNodes.length; i++) {
                if (window.location.href.split('%3f%3f')[1] == document.evaluate('/html/body/form/div[5]/div/div[2]/table/tbody/tr['+i+']/td[4]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML){
                    console.log(i)
                }
            }
        }
        window.opener.postMessage(ips, "*")
        window.close()
    }else if(window.location.href.includes('http://khapps.manipal.edu/dischsum/HospNoDischargeSummary.aspx?')){
        var unit = document.getElementById('ctl00_Label2');
        var unitnum = unit.textContent.replace('Unit : ','');
        if(unitnum == 'PED4IB' || unitnum == 'PED4OB' || unitnum == 'NEOI'){
            var notFound = true
            for (let i = 0; i < 20; i++){
                var id = 'ctl00_ContentPlaceHolder1_GridView1_ctl0' + i + '_Button2'
                var element = document.getElementById(id)
                if(element != null){
                    notFound = false
                    break
                }
            }
            if (notFound){
                var search = document.getElementById('ctl00_ContentPlaceHolder1_txthospno')
                search.value = window.location.href.split('?')[1]
                document.getElementById('ctl00_ContentPlaceHolder1_cmdgo').click()
            }else{
                var ip = element.parentElement.nextSibling.nextSibling.nextSibling.innerHTML
                window.open('http://khapps.manipal.edu/dischsum/ModifyEntry.aspx?ip=' + ip + '&userid=ANON', '_self')
            }
        }else{
            try{
                if (document.getElementById('ctl00_ContentPlaceHolder1_lblmsg').innerHTML.includes('Discharge Summary Not Found')){
                    alert('No Past Admissions Found')
                    window.close()
                }
            } catch (err) {
                null
            }
            if (document.getElementById('ctl00_ContentPlaceHolder1_GridView1') == null){
                var search = document.getElementById('ctl00_ContentPlaceHolder1_txthospno')
                search.value = window.location.href.split('?')[1]
                document.getElementById('ctl00_ContentPlaceHolder1_cmdgo').click()
            }else{
                if (window.location.href.includes('%3f')){
                    try{
                        for ( let i = 2 ; i < 50 ; i++ ){
                            var xpath = '/html/body/form/div[5]/div/div[2]/table/tbody/tr[' + i + ']/td[4]'
                            if (document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML == window.location.href.split('%3f')[1]){
                                document.getElementById('ctl00_ContentPlaceHolder1_GridView1_ctl0' + i + '_Button3').click()
                                break
                            }
                        }
                    } catch (err) {
                        window.open('http://khapps.manipal.edu/dischsum/HospnowisePrintRpt.aspx?ip='+window.location.href.split('%3f')[1])
                    }
                }else{
                    var admissions = document.getElementById('ctl00_ContentPlaceHolder1_GridView1').children[0].childNodes.length - 2
                    var ips = []
                    for (let i = 0 ; i < admissions ; i++){
                        ips.push(document.getElementById('ctl00_ContentPlaceHolder1_GridView1').children[0].children[i+1].children[3].innerHTML)
                    }
                    window.opener.postMessage(ips, "*")
                    window.close()
                }
            }
        }
    }
    if(window.location.href.includes('userid=ANON')){
        var hopi = document.getElementById('ctl00_ContentPlaceHolder1_txtillness').value
        var past = document.getElementById('ctl00_ContentPlaceHolder1_txthistory').value
        var dataSend = hopi + '!!!' + past
        window.opener.postMessage(dataSend, "*")
        window.close()
    }

    if(window.location.href.includes('userid=PAST')){
        var adm = document.getElementById('ctl00_ContentPlaceHolder1_txtadmdate').value
        var dis = document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value
        var finDig = document.getElementById('ctl00_ContentPlaceHolder1_txtfinal').value
        var ipNum = document.getElementById('ctl00_ContentPlaceHolder1_txtipno').value
        var pastProper = document.getElementById('ctl00_ContentPlaceHolder1_txthistory').value
        var dataSend = ipNum + '!?!\n' + adm + ' - ' + dis + ' was admitted for ' + finDig.replaceAll('\n', ', ').toLowerCase() + '!?!' + pastProper
        window.opener.postMessage(dataSend, "*")
        window.close()
    }

    if(window.location.href.includes('&&&entityrid=4')){
        function waitForElement(xpath, callback) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                callback(element);
            } else {
                setTimeout(() => waitForElement(xpath, callback), 1000);
            }
        }

        function waitForElementTwice(prevText, xpath, callback) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element.innerText == prevText) {
                setTimeout(() => waitForElement(xpath, callback), 1000);
            } else {
                callback(element);
            }
        }

        var sendData = []
        function dataToGo(id){
            var sendText = (document.evaluate(id, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText, '*')
            return sendText
        }
        waitForElement('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[1]/td/div/table/tbody/tr[2]/td[3]/div/img', (element) => {
            if(document.getElementById('MyReportViewer_ctl05_ctl00_TotalPages').innerText==1){
                var sendText = document.evaluate('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText
                var adm = sendText.trim().split('\n\t')[16].trim()
                var dis = sendText.trim().split('\n\t')[17].trim()
                var ipNum = sendText.trim().split('\n\t')[8].trim()
                var finSeqs = []
                var seqList = ['Final Diagnosis :---ctl00_ContentPlaceHolder1_txtfinal', 'Complaints on Reporting :---ctl00_ContentPlaceHolder1_txtcomplaints', 'Past History  :---ctl00_ContentPlaceHolder1_txthistory', 'History of Present Illness :---ctl00_ContentPlaceHolder1_txtillness', 'Physical  findings of Examination  :---ctl00_ContentPlaceHolder1_txtphysical', 'Laboratory Data  :---', 'Investigative Procedures    :---ctl00_ContentPlaceHolder1_txtinvestigate',  'Therapeutic Procedures  :---ctl00_ContentPlaceHolder1_txttherapetic', 'Courses of Treatment in the Hospital :---ctl00_ContentPlaceHolder1_txttreat', 'Summary of ICU Stay :---ctl00_ContentPlaceHolder1_txticustay', 'Condition on Discharge  :---ctl00_ContentPlaceHolder1_txtcondition', 'Drugs Advice on Discharge  :---DRUGS!', 'Further Advice on Discharge  :---ctl00_ContentPlaceHolder1_txtadvice', 'Dietry Advice :---ctl00_ContentPlaceHolder1_txtdiet', 'To contact if there are any symptoms  like :---ctl00_ContentPlaceHolder1_txtcontact', 'Prepared By  :---ctl00_ContentPlaceHolder1_txtprepare', 'Checked By :---ctl00_ContentPlaceHolder1_txtchecked', 'Assistant :---']
                for ( let i = 0 ; i < seqList.length ; i++ ){
                    var searchTerms = seqList[i].split('---')[0]
                    if ( sendText.includes(searchTerms) ){
                        finSeqs.push(searchTerms)
                    }
                }
                try {
                    var finDig = sendText.trim().split('Final Diagnosis :')[1].split(finSeqs[1])[0].trim()
                    }
                catch (err) {
                    var finDig = ' '
                    }
                try {
                    var pastProper = sendText.trim().split('Past History  :')[1].split(finSeqs[finSeqs.indexOf('Past History  :')+1])[0].trim()
                    }
                catch (err) {
                    var pastProper = ' '
                    }
                var dataSend = ipNum + '!?!\n' + adm + ' - ' + dis + ' was admitted for ' + finDig.replaceAll('\n', ', ').toLowerCase() + '!?!' + pastProper
                window.opener.postMessage(dataSend, "*")
                window.close()
            }else{
                var prevText = document.evaluate('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText
                document.getElementById('MyReportViewer_ctl05_ctl00_Next_ctl00_ctl00').click()
                waitForElementTwice(prevText, '/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', (element) => {
                    var sendText = prevText + document.evaluate('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText
                    var adm = sendText.trim().split('\n\t')[16].trim()
                    var dis = sendText.trim().split('\n\t')[17].trim()
                    var ipNum = sendText.trim().split('\n\t')[8].trim()
                    var finSeqs = []
                    var seqList = ['Final Diagnosis :---ctl00_ContentPlaceHolder1_txtfinal', 'Complaints on Reporting :---ctl00_ContentPlaceHolder1_txtcomplaints', 'Past History  :---ctl00_ContentPlaceHolder1_txthistory', 'History of Present Illness :---ctl00_ContentPlaceHolder1_txtillness', 'Physical  findings of Examination  :---ctl00_ContentPlaceHolder1_txtphysical', 'Laboratory Data  :---', 'Investigative Procedures    :---ctl00_ContentPlaceHolder1_txtinvestigate',  'Therapeutic Procedures  :---ctl00_ContentPlaceHolder1_txttherapetic', 'Courses of Treatment in the Hospital :---ctl00_ContentPlaceHolder1_txttreat', 'Summary of ICU Stay :---ctl00_ContentPlaceHolder1_txticustay', 'Condition on Discharge  :---ctl00_ContentPlaceHolder1_txtcondition', 'Drugs Advice on Discharge  :---DRUGS!', 'Further Advice on Discharge  :---ctl00_ContentPlaceHolder1_txtadvice', 'Dietry Advice :---ctl00_ContentPlaceHolder1_txtdiet', 'To contact if there are any symptoms  like :---ctl00_ContentPlaceHolder1_txtcontact', 'Prepared By  :---ctl00_ContentPlaceHolder1_txtprepare', 'Checked By :---ctl00_ContentPlaceHolder1_txtchecked', 'Assistant :---']
                    for ( let i = 0 ; i < seqList.length ; i++ ){
                        var searchTerms = seqList[i].split('---')[0]
                        if ( sendText.includes(searchTerms) ){
                            finSeqs.push(searchTerms)
                        }
                    }
                    try {
                        var finDig = sendText.trim().split('Final Diagnosis :')[1].split(finSeqs[1])[0].trim()
                        }
                    catch (err) {
                        var finDig = ' '
                        }
                    try {
                        var pastProper = sendText.trim().split('Past History  :')[1].split(finSeqs[finSeqs.indexOf('Past History  :')+1])[0].trim()
                        }
                    catch (err) {
                        var pastProper = ' '
                        }
                    var dataSend = ipNum + '!?!\n' + adm + ' - ' + dis + ' was admitted for ' + finDig.replaceAll('\n', ', ').toLowerCase() + '!?!' + pastProper
                    window.opener.postMessage(dataSend, "*")
                    window.close()
                })
            }
        });
    }else if(window.location.href.includes('&&entityrid=4')){
        function waitForElement(xpath, callback) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                callback(element);
            } else {
                setTimeout(() => waitForElement(xpath, callback), 1000);
            }
        }

        function waitForElementTwice(prevText, xpath, callback) {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element.innerText == prevText) {
                setTimeout(() => waitForElement(xpath, callback), 1000);
            } else {
                callback(element);
            }
        }

        var sendData = []
        function dataToGo(id){
            window.opener.postMessage(document.evaluate(id, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText, '*')
        }
        waitForElement('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[1]/td/div/table/tbody/tr[2]/td[3]/div/img', (element) => {
            if(document.getElementById('MyReportViewer_ctl05_ctl00_TotalPages').innerText==1){
                dataToGo('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', '*')
            }else{
                var prevText = document.evaluate('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText
                document.getElementById('MyReportViewer_ctl05_ctl00_Next_ctl00_ctl00').click()
                waitForElementTwice(prevText, '/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', (element) => {
                    var sendText = prevText + document.evaluate('/html/body/form/div[3]/span[2]/div/table/tbody/tr[5]/td[3]/div/div[1]/div/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText
                    window.opener.postMessage(sendText, '*')
                })
            }
        });
    }

    if(window.location.href.includes('userid=COPY')){
        function sendData(id) {
            return id + '?!?' + document.getElementById(id).value;
        }
        var dataList = []
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtfinal'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtcomplaints'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txthistory'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtillness'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtphysical'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txticustay'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtfinal'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtinvestigate'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txttreat'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtcondition'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtadvice'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtdiet'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtcontact'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtdocname'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtdesgn'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_txtunit'))
        dataList.push(sendData('ctl00_ContentPlaceHolder1_ddlAsst'))
        for ( let i = 1 ; i < 31 ; i++ ){
            dataList.push(sendData('ctl00_ContentPlaceHolder1_txtdrug'+i))
            dataList.push(sendData('ctl00_ContentPlaceHolder1_txtstr'+i))
            dataList.push(sendData('ctl00_ContentPlaceHolder1_txtfrq'+i))
            dataList.push(sendData('ctl00_ContentPlaceHolder1_txtdays'+i))
        }
        for ( let i = 1 ; i < 6 ; i++ ){
            dataList.push(sendData('ctl00_ContentPlaceHolder1_txtdoc'+i))
            dataList.push(sendData('ctl00_ContentPlaceHolder1_TxtUnit'+i))
            dataList.push(sendData('ctl00_ContentPlaceHolder1_TxtReason'+i))
            dataList.push(sendData('ctl00_ContentPlaceHolder1_TxtRemarks'+i))
        }
        window.opener.postMessage(dataList, "*")
        window.open('http://khapps.manipal.edu/dischsum/HospNoDischargeSummary.aspx!!!' + document.getElementById('ctl00_ContentPlaceHolder1_txthospno').value)
        window.close()
    }

    if(window.location.href.includes('http://patemr.manipal.edu/E-REGISTERS_EMR/flipbook')){
        var print = document.createElement('button');
        print.innerHTML = 'Print/Save as PDF';
        print.style.position = 'fixed';
        print.style.bottom = '40px';
        print.style.right = '10px';
        document.body.appendChild(print);

        print.addEventListener('click', function(){
            var ele = document.getElementsByTagName('div')
            console.log(ele[2].children[0].contentDocument.children[0].children[1].children[0].children[2].children[0].children[0].children[0].children[10].click())
        })
    }

    if(window.location.href == 'https://dutyrota.cloud:8080/OTschedulerAdmin/'){
        document.getElementsByClassName('form-group')[0].textContent.split(' ')
        if(document.getElementsByClassName('form-group')[0].textContent.split(' ')[7].replace('\t', '').replace('\n', '').slice(0, 4) == 'List'){
            document.getElementsByName('username')[0].value = document.getElementsByClassName('form-group')[0].textContent.split(' ')[16].replace('\t', '').replace('\n', '').slice(0, 2)
            document.getElementsByName('password')[0].value = document.getElementsByClassName('form-group')[0].textContent.split(' ')[16].replace('\t', '').replace('\n', '').slice(0, 2)
            document.getElementsByClassName('btn btn-primary')[0].click()
        }
    }

    if(window.location.href.includes('http://patemr.manipal.edu/E-REGISTERS_EMR/frmPrescription_medics')){
        /*         var drugsBtn = document.createElement('button');
        drugsBtn.innerHTML = 'Add Drugs From Draft Print Discharge Summary';
        drugsBtn.style.position = 'fixed';
        drugsBtn.style.bottom = '40px';
        drugsBtn.style.right = '10px';
        document.body.appendChild(drugsBtn); */

        var emr = document.createElement('button');
        emr.innerHTML = 'Add Drugs From Discharge Summary';
        emr.style.position = 'fixed';
        emr.style.bottom = '40px';
        emr.style.right = '10px';
        document.body.appendChild(emr);

        var drugsAdd = document.createElement('button');
        drugsAdd.innerHTML = 'Add Drugs To Discharge Summary';
        drugsAdd.style.position = 'fixed';
        drugsAdd.style.bottom = '70px';
        drugsAdd.style.right = '10px';
        document.body.appendChild(drugsAdd);

        drugsAdd.addEventListener('click', function(){
            try{
                var message = ''
                for ( let i = 0 ; i < 30 ; i++) {
                    message += document.getElementById('grvPrescription_hdfgeneric_name_' + i).value + ';;;' + document.getElementById('grvPrescription_txtdrug_' + i).value + ';;;' + document.getElementById('grvPrescription_txtunit_' + i).value + ' (' + document.getElementById('grvPrescription_txtinstruction_' + i).value.toUpperCase() + ');;;' + document.getElementById('grvPrescription_txtdosage_' + i).value + ';;;' + document.getElementById('grvPrescription_txtduration_' + i).value + '\n\n'
                }
            }catch (err) {
                window.opener.postMessage(message.replaceAll(' ()', ''), "*")
            }
        })

        if (document.getElementById('txtimpadvise').value.includes('$SCRIPTWORKING')){
            var drugsAlt = document.getElementById('txtimpadvise').value.replace('$SCRIPTWORKING', '')
            var drugsAll = drugsAlt.split('$')[1]
            var drugList = drugsAll.split('$EXTRAINFO$')
            if (drugList.length>1){
                var extra = true
                var extraInfo = drugList[1]
                var drugs = drugList[0]
                }else{
                    var drugs = drugsAll
                    }
            if (extra){
                var snips = extraInfo.split('$$$')
                document.getElementById('txtdiagnosis').value = snips[0]
                document.getElementById('txtnextvisit').value = snips[1]
                document.getElementById('txtdiet').value = snips[2]
            }
            var lines = drugs.split('!-!')
            var num = drugsAlt.split('$')[0]
            var idnum = num - 1
            var id = 'grvPrescription_txtdosage_' + idnum;
            var fin = document.getElementById(id);
            if (num > 1){
                num -= 1
                document.getElementById('txtimpadvise').value = '$SCRIPTWORKING' + num + '$' + drugsAll.replaceAll('\n', '!-!')
                document.getElementById('grvPrescription_ButtonAdd').click()
            }else{
                document.getElementById('txtimpadvise').value = ''
                var drugcounter = 0
                for ( let i = 0 ; i < lines.length ; i++ ){
                    var rem = i%5
                    if(rem==0){
                        var drugname = lines[i]
                        var used = false
                        var tabcomps = drugname.split(' ')
                        var unitID = 'grvPrescription_txtunit_' + drugcounter
                        if(tabcomps[0].toLowerCase() == 'tab'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 't.'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 't'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'tablet'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'cap'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'c.'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'c'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'capsule'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'syrup'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'syp'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 's.'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 's'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'inj.'){
                            document.getElementById(unitID).value = 'INJECTION'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'inj'){
                            document.getElementById(unitID).value = 'INJECTION'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'injection'){
                            document.getElementById(unitID).value = 'INJECTION'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'ivf'){
                            document.getElementById(unitID).value = 'IVF'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'iv'){
                            document.getElementById(unitID).value = 'IVF'
                            used = true
                        }

                        if (used){
                            drugname = drugname.toLowerCase().replaceAll(tabcomps[0].toLowerCase() + ' ', '')
                        }else{
                            null;
                        }
                    }
                    if(rem==1){
                        drugname += ' ' + lines[i]
                        document.getElementById('grvPrescription_txtdrug_' + drugcounter).value = drugname.toUpperCase().replaceAll('  ', ' ')
                    }
                    if(rem==2){
                        var freq = lines[i]
                        document.getElementById('grvPrescription_txtdosage_' + drugcounter).value = freq
                    }
                    if(rem==3){
                        var duration = lines[i]
                        document.getElementById('grvPrescription_txtduration_' + drugcounter).value = duration
                        drugcounter += 1
                    }
                }

            }
        }

        emr.addEventListener('click', function(){
            var drugsAll = prompt('Copy paste all the drugs from discharge summary EMR')
            var drugList = drugsAll.split('$EXTRAINFO$')
            if (drugList.length>1){
                var extra = true
                var extraInfo = drugList[1]
                var drugs = drugList[0]
                }else{
                    var drugs = drugsAll
                    }
            if (extra){
                var snips = extraInfo.split('$$$')
                document.getElementById('txtdiagnosis').value = snips[0]
                document.getElementById('txtnextvisit').value = snips[1]
                document.getElementById('txtdiet').value = snips[2]
            }
            var lines = drugs.split('\n')
            var num = Math.round(lines.length/5)
            var idnum = num - 1
            var id = 'grvPrescription_txtdosage_' + idnum;
            var fin = document.getElementById(id);
            if (fin == null){
                document.getElementById('txtimpadvise').value = '$SCRIPTWORKING' + num + '$' + drugsAll.replaceAll('\n', '!-!')
                document.getElementById('grvPrescription_ButtonAdd').click()
            }else{
                var drugcounter = 0
                for ( let i = 0 ; i < lines.length ; i++ ){
                    var rem = i%5
                    if(rem==0){
                        var drugname = lines[i]
                        var used = false
                        var tabcomps = drugname.split(' ')
                        var unitID = 'grvPrescription_txtunit_' + drugcounter
                        if(tabcomps[0].toLowerCase() == 'tab'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 't.'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 't'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'tablet'){
                            document.getElementById(unitID).value = 'TABLET'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'cap'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'c.'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'c'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'capsule'){
                            document.getElementById(unitID).value = 'CAPSULE'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'syrup'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'syp'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 's.'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 's'){
                            document.getElementById(unitID).value = 'SYRUP'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'inj.'){
                            document.getElementById(unitID).value = 'INJECTION'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'inj'){
                            document.getElementById(unitID).value = 'INJECTION'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'ivf'){
                            document.getElementById(unitID).value = 'IVF'
                            used = true
                        }else if(tabcomps[0].toLowerCase() == 'iv'){
                            document.getElementById(unitID).value = 'IVF'
                            used = true
                        }

                        if (used){
                            drugname = drugname.toLowerCase().replaceAll(tabcomps[0].toLowerCase() + ' ', '')
                        }else{
                            null;
                        }
                    }
                    if(rem==1){
                        drugname += ' ' + lines[i]
                        document.getElementById('grvPrescription_txtdrug_' + drugcounter).value = drugname.toUpperCase().replaceAll('  ', ' ')
                    }
                    if(rem==2){
                        var freq = lines[i]
                        document.getElementById('grvPrescription_txtdosage_' + drugcounter).value = freq
                    }
                    if(rem==3){
                        var duration = lines[i]
                        document.getElementById('grvPrescription_txtduration_' + drugcounter).value = duration
                        drugcounter += 1
                    }
                }

            }
        })

        /*         drugsBtn.addEventListener('click', function(){
            var drugs = prompt('Copy paste all the drugs from the discharge summary pdf')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 1', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 1', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 2', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 2', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 3', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 3', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 4', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 4', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 5', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 5', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 6', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 6', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 7', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 7', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 8', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 8', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 9', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 9', '')
            drugs = drugs.replace('\nIn Case of emergency please contact 2575555 / Casualty (2922246, 2922349) Page 10', '')
            drugs = drugs.replace('\nIN CASE OF EMERGENCY PLEASE CONTACT 2575555 / CASUALTY (2922246, 2922349) PAGE 10', '')
            drugs = drugs.replace('\n(3rd Saturday is a holiday except emergency)', '')
            drugs = drugs.replace('\nKASTURBA HOSPITAL, MANIPAL', '')
            drugs = drugs.replace('\n( ISO 9001:2008 certified )', '')
            drugs = drugs.replace('\nManipal - 576 104, Udupi District, Karnataka', '')
            drugs = drugs.replace('\nPhone : 0820-2571967 / 2922761 Fax : 0820-2571934 / 2574321, Email : helpdesk.kh@manipal.edu', '')
            drugs = drugs.replace('\n(Teaching hospital of KMC Manipal, a unit of MAHE)', '')
            var tabs = drugs.split('\n')
            var num = tabs.length - 1
            var id = 'grvPrescription_txtdosage_' + num;
            var fin = document.getElementById(id);
            if (fin == null){
                alert('Make sure the number of drug rows on the screen can accomodate the number of drugs to be pasted. ' + tabs.length + ' rows are required to proceed.')
            }else{
                for(let i = 0; i < tabs.length; i++){
                    var used = false
                    var tabcomps = tabs[i].split(' ')
                    var unitID = 'grvPrescription_txtunit_' + i
                    if(tabcomps[0].toLowerCase() == 'tab'){
                        document.getElementById(unitID).value = 'TABLET'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 't.'){
                        document.getElementById(unitID).value = 'TABLET'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 't'){
                        document.getElementById(unitID).value = 'TABLET'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'tablet'){
                        document.getElementById(unitID).value = 'TABLET'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'cap'){
                        document.getElementById(unitID).value = 'CAPSULE'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'c.'){
                        document.getElementById(unitID).value = 'CAPSULE'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'c'){
                        document.getElementById(unitID).value = 'CAPSULE'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'capsule'){
                        document.getElementById(unitID).value = 'CAPSULE'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'syrup'){
                        document.getElementById(unitID).value = 'SYRUP'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'syp'){
                        document.getElementById(unitID).value = 'SYRUP'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 's.'){
                        document.getElementById(unitID).value = 'SYRUP'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 's'){
                        document.getElementById(unitID).value = 'SYRUP'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'inj.'){
                        document.getElementById(unitID).value = 'INJECTION'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'inj'){
                        document.getElementById(unitID).value = 'INJECTION'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'ivf'){
                        document.getElementById(unitID).value = 'IVF'
                        used = true
                    }else if(tabcomps[0].toLowerCase() == 'iv'){
                        document.getElementById(unitID).value = 'IVF'
                        used = true
                    }

                    if (used){
                        var newtabcomps = tabs[i].toLowerCase().replace(tabcomps[0].toLowerCase() + ' ', '')
                        }else{
                            var newtabcomps = tabs[i].toLowerCase()
                            }
                    var regex = /\b(?:[vV\d]+(?:\/\d+)?-){2,}[vV\d]+(?:\/\d+)?\b/
                    var otherregex = /\b\S+?\/(?:wk|mo|week|month)\b/g
                    var freq = tabs[i].match(regex);
                    var otherfreq = tabs[i].toLowerCase().match(otherregex)
                    var id = 'grvPrescription_txtdosage_' + i
                    if(freq != null){
                        document.getElementById(id).value = freq[0]
                        var days = newtabcomps.split(freq[0].toLowerCase())[1]
                        var finaltab = newtabcomps.replace(freq[0].toLowerCase(), '').replace(days, '')
                        }else if (otherfreq != null){
                            var days = newtabcomps.split(otherfreq[0].toLowerCase())[1]
                            document.getElementById(id).value = otherfreq[0]
                            var finaltab = newtabcomps.replace(otherfreq[0].toLowerCase(), '').replace(days, '')
                            }else{
                                var finaltab = newtabcomps
                                }
                    var tabid = 'grvPrescription_txtdrug_' + i
                    document.getElementById(tabid).value = finaltab.toUpperCase()
                    var dayid = 'grvPrescription_txtduration_' + i
                    if (days !== undefined){
                        document.getElementById(dayid).value = days.trim().toUpperCase()
                    }
                }
            }

        }) */
    }


    if (window.location.href == "http://khapps.manipal.edu/dischsum/login.aspx" || window.location.href == "http://khapps.manipal.edu/DISCHSUM/login.aspx"){
        var number = (Math.floor(Math.random() * 1000))
        console.log(number)
        if (number == 7) {
            document.getElementsByTagName('style')[0].innerHTML = document.getElementsByTagName('style')[0].innerHTML.replace('img/2.jpg', 'https://m.media-amazon.com/images/M/MV5BM2ZjZGMyZTAtNTBhYi00ZDM4LWI4ZTEtYjliOWRiYWRhMGYzXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg')
        }

        var unit = document.getElementById('ddldeptcode')
        unit.addEventListener('change', function(){
            document.getElementById('txtpwd').value = unit.value
            document.getElementById('cmdlogin').click()
        }
                             )}

    if (window.location.href == "http://patemr.manipal.edu/E-REGISTERS_EMR/LOGIN_emr.ASPX" || window.location.href == "http://patemr.manipal.edu/E-REGISTERS_EMR/Login_EMR.aspx"){
        var unit = document.getElementById('txtdoctor')
        var login = document.getElementById('cmdLogin')
        var pass = document.getElementById('txtpwd')

        unit.addEventListener('click', function(){
            document.getElementById('txtpwd').value = unit.value
            if(document.getElementById('ddlentity').selectedIndex == 0){
                document.getElementById('ddlentity').selectedIndex = 1
            }
        }
                             )
        unit.addEventListener('keypress', function(){
            if (event.key === "Enter") {
                document.getElementById('txtpwd').value = unit.value
                if(document.getElementById('ddlentity').selectedIndex == 0){
                    document.getElementById('ddlentity').selectedIndex = 1
                }
            }}
                             )

        pass.addEventListener('click', function(){
            document.getElementById('txtpwd').value = unit.value
            if(document.getElementById('ddlentity').selectedIndex == 0){
                document.getElementById('ddlentity').selectedIndex = 1
            }
        }
                             )

        login.addEventListener('click', function(){
            document.getElementById('txtpwd').value = unit.value
            if(document.getElementById('ddlentity').selectedIndex == 0){
                document.getElementById('ddlentity').selectedIndex = 1
            }
        }
                              )
    }


    if (window.location.href == "http://khapps.manipal.edu/dischsum/dischpatlist.aspx" || window.location.href == "http://khapps.manipal.edu/DISCHSUM/dischpatlist.aspx" || window.location.href == "http://khapps.manipal.edu/dischsum/DischargeSSrsRpt.aspx" || window.location.href == "http://khapps.manipal.edu/DISCHSUM/DischargeSSrsRpt.aspx" || window.location.href == "http://khapps.manipal.edu/dischsum/view.aspx" || window.location.href == "http://khapps.manipal.edu/DISCHSUM/view.aspx" || window.location.href == "http://khapps.manipal.edu/dischsum/HospNoDischargeSummary.aspx" || window.location.href == "http://khapps.manipal.edu/DISCHSUM/HospNoDischargeSummary.aspx"){
        // Create the Discharge button
        var disapprove = document.createElement('button');
        disapprove.innerHTML = 'Change Approved Summary';
        disapprove.style.position = 'fixed';
        disapprove.style.top = '90px';
        disapprove.style.right = '10px';
        document.body.appendChild(disapprove);

        disapprove.addEventListener('click', function(){
            var ip = prompt('Enter IP Number');
            var unit = document.getElementById('ctl00_Label2').textContent.replace('Unit : ', '');
            if (ip.length<7){
                ip = '00' + ip
            }
            var link = "http://khapps.manipal.edu/dischsum/revertdisch.aspx?doccode=11111&docname=PG+DOCTOR?" + ip
            window.open(link, '_blank')
        })
    }

    if(window.location.href == "http://172.16.7.105/" || window.location.href == "http://172.16.7.105/home.aspx" || window.location.href == "http://khportal.manipal.edu/" || window.location.href == "http://khportal.manipal.edu/home.aspx"){
        var img = document.getElementsByTagName('img');
        img[7].src = "https://i.ibb.co/80j81N0/Picsart-23-07-02-11-12-54-421.jpg";
    }

    if(window.location.href == "http://172.16.7.105/admdetl.aspx" || window.location.href == "http://khportal.manipal.edu/admdetl.aspx"){
        // Regular expression to match 8-digit numbers starting with a single zero
        var regex = /(?<!hno=)0([1-9]\d{6})(?!\d|&)/g;

        // Get all table cells on the webpage
        var cells = document.querySelectorAll('td');

        // Function to create a radio button
        function createRadioButton(id, label) {
            var radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.id = id;
            radioButton.name = 'radioGroup';
            radioButton.value = label;

            var radioLabel = document.createElement('label');
            radioLabel.htmlFor = id;
            radioLabel.appendChild(document.createTextNode(label));

            var radioContainer = document.createElement('div');
            radioContainer.appendChild(radioButton);
            radioContainer.appendChild(radioLabel);

            return radioContainer;
        }

        // Create the radio buttons
        var radioContainer1 = createRadioButton('radioButton1', 'Link EMR');
        var radioContainer2 = createRadioButton('radioButton2', 'Link Investigations');
        var radioContainer3 = createRadioButton('radioButton3', 'PACS');

        // Add the radio buttons to the document
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.right = '10px';
        container.style.transform = 'translateY(-50%)';
        container.appendChild(radioContainer1);
        container.appendChild(radioContainer2);
        container.appendChild(radioContainer3);
        container.style.border = '1px solid black';
        container.style.backgroundColor = 'white';
        document.body.appendChild(container);

        // Store the original content of each cell
        var originalContent = Array.from(cells).map(function(cell) {
            return cell.innerHTML;
        });

        // Event listener for radio button change
        function onRadioButtonChange() {
            // Restore the original content of each cell
            cells.forEach(function(cell, index) {
                cell.innerHTML = originalContent[index];
            });

            var variable;
            if (this.value === 'Link EMR') {
                variable = 'http://patemr.manipal.edu/E-REGISTERS_EMR/MergedPage_EMR_expandondemand.aspx?hno=0{num}&typ=O';
            } else if (this.value === 'Link Investigations') {
                variable = 'http://patemr.manipal.edu/E-REGISTERS_EMR/frmLis_New.aspx?hno={num}&typ=I&IPNO={ipnum}';
            } else if (this.value === 'PACS') {
                variable = 'https://mahepacs.manipal.edu/HIS/viewImages?mrn={num}&user=ramsoft_phy&timestamp=2025-06-26%2012:27:34&siteUniqueId=KH';
            }

            // Loop through each table cell
            cells.forEach(function(cell) {
                var matches = cell.textContent.match(regex);
                // If matches are found, convert each match to a hyperlink
                if (matches) {
                    matches.forEach(function(match) {

                        var number = match.trim().substr(1); // Remove the first zero from the number

                        var link = document.createElement('a');
                        link.href = variable.replace(/{num}/g, number);
                        link.href = link.href.replace(/{ipnum}/g, originalContent[originalContent.indexOf(match)-1].substr(2))

                        link.textContent = match;
                        link.target = '_blank'; // Open the link in a new webpage
                        // Replace the original match with the hyperlink
                        cell.innerHTML = cell.innerHTML.replace(match, link.outerHTML);
                    });
                }
            });
        }

        // Add event listeners to the radio buttons
        var radioButton1 = document.getElementById('radioButton1');
        var radioButton2 = document.getElementById('radioButton2');
        var radioButton3 = document.getElementById('radioButton3');
        radioButton1.addEventListener('change', onRadioButtonChange);
        radioButton2.addEventListener('change', onRadioButtonChange);
        radioButton3.addEventListener('change', onRadioButtonChange);

        var tabs = document.getElementsByTagName("tr")
        var dict = {}
        for ( let i = 8; i < tabs.length ; i++){
            if ( tabs[i].children.item(7).textContent in dict ){
                dict[tabs[i].children.item(7).textContent] = dict[tabs[i].children.item(7).textContent] + 1
            }else{
                dict[tabs[i].children.item(7).textContent] = 1
            }
        }

        const element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.bottom = '10px';
        element.style.left = '10px';
        element.style.backgroundColor = 'white';
        element.style.padding = '10px';
        element.style.border = '1px solid #ccc';

        let content = '<center><h3>Ward wise</h3></center>'
        for(const [key,value] of Object.entries(dict)){
            content += '<strong>' + key + ':</strong>' + value + '<br>'
        }

        element.innerHTML = content;
        document.body.appendChild(element);

        var floors = {'MM8':'Fourth Floor',
                      'MM':'Fourth Floor',
                      'M1':'Ground Floor',
                      'ISO':'Ground Floor',
                      'MF3':'Third Floor',
                      'MF1':'Ground Floor',
                      'MF2':'Ground Floor',
                      'MM2':'Fourth Floor',
                      'MM3':'Third Floor',
                      'MM4':'Third Floor',
                      'MM5':'Third Floor',
                      'MM6':'Third Floor',
                      'MM7':'Ground Floor',
                      'IC1':'Ground Floor',
                      'IC2':'Ground Floor',
                      'IC3':'Ground Floor',
                      'MF3':'Ground Floor',
                      'SF3':'Ground Floor',
                      'MF2':'Ground Floor',
                      'CAS':'Basement',
                      'N5':'Fourth Floor',
                      'N4':'Fourth Floor',
                      'N3':'Third Floor',
                      'N2':'Second Floor',
                      'CH1':'Fourth Floor',
                      'CH2':'Second Floor',
                      'CH3':'Third Floor',
                      'CH4':'Fourth Floor',
                      'A2':'Third Floor',
                      'MM8':'Fourth Floor',
                      'SM1':'Second Floor',
                      'SM':'Second Floor',
                      'SM4':'Ground Floor',
                      'SF2':'First Floor',
                      'SF1':'Second Floor',
                      'WH1': 'Third Floor',
                      'WH2': 'Third Floor',
                      'WH3': 'Third Floor',
                      'WH4': 'Third Floor',
                      'WH5': 'Third Floor',
                      'R7': 'Shirdi Sai - Third Floor',
                      'R9': 'Shirdi Sai - Third Floor',
                      'NIC': 'First Floor',
                      'ENT' : 'Daycare',
                      'SUR' : 'Daycare'
                     }

        const newElement = document.createElement('div');
        newElement.style.position = 'fixed';
        newElement.style.bottom = '10px';
        newElement.style.left = '130px';
        newElement.style.backgroundColor = 'white';
        newElement.style.padding = '10px';
        newElement.style.border = '1px solid #ccc';
        var newDict = {}

        for (const [key, value] of Object.entries(dict)){
            if (floors[key.trim()] in newDict){
                newDict[floors[key.trim()]] += value
            }else{
                newDict[floors[key.trim()]] = value
            }
        }

        let newContent = '<center><h3>Floor wise</h3></center>'
        for(const [key,value] of Object.entries(newDict)){
            newContent += '<strong>' + key + ':</strong>' + value + '<br>'
        }

        newElement.innerHTML = newContent;
        document.body.appendChild(newElement);

        var selectUnit = document.getElementById('ContentPlaceHolder1_ddlDept').value

        try{
            var exists = document.getElementById('ContentPlaceHolder1_msg').textContent
            if(exists.includes('No Matches')){
                var noMatch = true
                }else{
                    var noMatch = false
                    }
        }catch(err){
            var noMatch = false
            }

        document.getElementById('ContentPlaceHolder1_TxtDate').addEventListener('change', function(){
            document.getElementById('ContentPlaceHolder1_Button1').click()
        })


        if(selectUnit == ''){
            null;
        }else{
            if (noMatch){
                null;
            }else{
                try{
                    var unitName = document.getElementsByTagName('td')[14].textContent
                    }catch(err){
                    }

                if(unitName == selectUnit.replaceAll(' ', '')){
                    null;
                }else{
                    if (noMatch){
                        null;
                    }else{
                        document.getElementById('ContentPlaceHolder1_Button1').click()
                    }
                }
            }
        }

        var tags = document.getElementsByTagName('tr');
        var IP = tags.length - 8
        if (IP>100){
            const img = document.createElement('img');
            var arr = ['https://i.imgur.com/56N7cIE.png', 'https://i.ibb.co/99K1qBb/Medical-Online-Doctor-Consultation-Instagram-Story.png', 'https://i.ibb.co/3dqq7Zz/Blue-Simple-Quiet-Please-Poster-2.png']
            img.src = arr[(Math.floor(Math.random() * arr.length))]
            img.style.position = 'absolute';
            img.style.right = '10px';
            img.style.transform = 'translateY(60%)'
            img.style.width = '460px'
            img.style.height = '800px'
            img.style.zIndex = '-1'
            document.body.appendChild(img);
        }

        if ((document.getElementById('ContentPlaceHolder1_ddlDept').value).includes('ORT')){
            const img = document.createElement('img');
            var arr = ['https://e1.pxfuel.com/desktop-wallpaper/614/599/desktop-wallpaper-kabir-singh-mobile-kabir-singh-thumbnail.jpg']
            img.src = arr[(Math.floor(Math.random() * arr.length))]
            img.style.position = 'absolute';
            img.style.right = '10px';
            img.style.transform = 'translateY(80%)'
            img.style.zIndex = '-1'
            document.body.appendChild(img);
        }
        if ((document.getElementById('ContentPlaceHolder1_ddlDept').value).includes('SKN')){
            const img = document.createElement('img');
            var arr = ['https://d1csarkz8obe9u.cloudfront.net/posterpreviews/barbie-poster%2C-barbie-movie-poster-design-template-eab6d816cb8da88d6f1d01c0918cf1f2_screen.jpg?ts=1694183704']
            img.src = arr[(Math.floor(Math.random() * arr.length))]
            img.style.position = 'absolute';
            img.style.right = '10px';
            img.style.transform = 'translateY(30%)'
            img.style.zIndex = '-1'
            document.body.appendChild(img);
        }
        if ((document.getElementById('ContentPlaceHolder1_ddlDept').value).includes('HSD')){
            const img = document.createElement('img');
            var arr = ['https://i.ibb.co/34GL6F3/Untitled.png']
            img.src = arr[(Math.floor(Math.random() * arr.length))]
            img.style.position = 'absolute';
            img.style.right = '10px';
            img.style.transform = 'translateY(80%)'
            img.style.zIndex = '-1'
            document.body.appendChild(img);
        }
    }

    if(window.location.href.includes("http://khapps.manipal.edu/dischsum/DayCareEntry") || window.location.href.includes("http://khapps.manipal.edu/DISCHSUM/DayCareEntry")){
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const d = new Date();
        let month = months[d.getMonth()];
        var date = d.getDate()
        var titleDate = month + " " + date

        if(document.getElementById('ctl00_ContentPlaceHolder1_txtchecked').value.includes('Adding Date')){
            setTimeout(function() {
                var search = '[title="DATE"]'.replace('DATE', titleDate)
                var node = document.querySelector(search);
                node.click()
                document.getElementById('ctl00_ContentPlaceHolder1_txtchecked').value = ''}, 100)
        }

        // Create the autofill button
        var button = document.createElement('button');
        button.id = 'autofill'
        button.innerHTML = 'Autofill';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        document.body.appendChild(button);

        button.addEventListener('click', function(){
            var people = `
AYU   --DR. BASAVARAJ S HADAPAD
CAR-R --DR. RANJAN SHETTY K
CAR001--DR. PADMAKUMAR R
CAR002--DR. TOM DEVASIA
CAR003--DR. ASHWAL AJ
CAREPC--DR MUKUND A PRABHU
CAS   --CASUALTY MEDICAL OFFICER
CMD001--DR. SHWETHAPRIYA R
CTS001--DR. GANESH KAMATH
CTS002--DR. ARAVIND KUMAR BISHNOI
EMD001--DR JAYARAJ MYMBILLY BALAKRISHNAN
ENC001--DR. SAHANA SHETTY
ENT001--DR. KAILESH PUJARY--9686675652
ENT002--DR. BALAKRISHNA R--9686675654
EYE001--DR. SULATHA BHANDARY--REVIEW ON MONDAY/THURSDAY IN EYE OPD/SOS IF THERE IS SUDDEN DECREASE IN VISION, REDNESS, PAIN OR WATERING OR CONTACT ON THE DUTY PHONE 9686675697, OPD NO: 0820-2922378
EYE002--DR. YOGISH S  KAMATH--REVIEW ON TUESDAY/FRIDAY IN EYE OPD/SOS IF THERE IS SUDDEN DECREASE IN VISION, REDNESS, PAIN OR WATERING OR CONTACT ON THE DUTY PHONE 9686675697, OPD NO: 0820-2922378
EYE003--DR. VIJAYA PAI H--REVIEW ON WEDNESDAY/SATURDAY IN EYE OPD/SOS IF THERE IS SUDDEN DECREASE IN VISION, REDNESS, PAIN OR WATERING OR CONTACT ON THE DUTY PHONE 9686675697, OPD NO: 0820-2922378
GEC001--DR. SHIRAN SHETTY
GEC002--DR. GANESH BHAT
GEC003--DR. GANESH PAI C
GEN001--DR. GIRISHA K M
GEN002--DR. ANJU SHUKLA
GIS001--DR. BHARAT KUMAR BHAT--To contact 9606758276 if there is pain abdomen, abdominal distension, vomiting.
GYN001--DR. JAYARAMAN NAMBIAR--To contact 08202922338
GYN002--DR. AKHILA VASUDEVA--To contact 08202922338
GYN003--DR. SHYAMALA G--To contact 08202922338
GYN004--DR. JYOTHI SHETTY--To contact 08202922338
GYN005--DR. SHRIPAD S. HEBBAR--To contact 08202922338
HNS001--DR. SURESH PILLAI--9686676675
HSD001--DR. ANIL K BHAT--9632082505
IFD001--DR. KAVITHA SARAVU
IFD002--DR. MURALIDHAR VARMA
MED001--DR. VASUDEVA ACHARYA--9686675658
MED002--DR. CHANDRASHEKAR UK--9686675660
MED003--DR. WEENA STANLEY--9686675662
MED004--DR. RAGHAVENDRA RAO--9686675667
MED005--DR. RAM BHAT--9686675670
MED006--DR. RAVIRAJ V ACHARYA--9686675678
MED007--DR. SHIVASHANKARA KN--9686675682
MED008--DR. MUKHYAPRANA PRABHU--9686675686
MED011--DR. SUDHA VIDYASAGAR
MED012--DR. SHUBHA SESHADRI
MED013--DR. B.A.SHASTRY
MED014--DR MANJUNATH HANDE
MEO001--DR. KARTHIK S UDUPA, MD, DM, DNB
MEO002--DR. ANANTH PAI, MD, DM--9686676599
NEO002--DR. LESLIE EDWARD S LEWIS--9686676599
NEOB  --Dr. SHEILA MATHAI
NEOI  --Dr. SHEILA MATHAI--To report if there is poor suck, vomiting, lethargy, hurried breathing and increasing clinical levels of jaundice.
NEU001--DR. APARNA R PAI
NEU002--DR. ARVIND N PRABHU
NMD001--DR. SUMEET SURESH M
NPH001--DR. RAVINDRA PRABHU
NPH002--DR. SHANKAR PRASAD
NUS001--DR. GIRISH MENON
NUS002--DR. RAGHAVENDRA NAYAK
OBG001--DR. JAYARAMAN NAMBIAR
OBG002--DR. AKHILA VASUDEVA
OBG003--DR. SHYAMALA G
OBG004--DR. JYOTHI SHETTY
OBG005--DR. SHRIPAD S. HEBBAR
OBS001--DR. JAYARAMAN NAMBIAR--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS002--DR. AKHILA VASUDEVA--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS003--DR. SHYAMALA G--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS004--DR. JYOTHI SHETTY--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS005--DR. SHRIPAD S. HEBBAR--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
ORT001--DR. SHYAMSUNDER BHAT N--9686692594NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
ORT002--DR. KIRAN KUMAR V ACHARYA--PAIN SWELLING FEVER (CALL 9686692596)NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*NEXTLINEDr. Kiran V Acharya    Dr .Dattatreya Sitaram      Dr. Sachin KumarNEXTLINEProf and HOU                 Assistant Prof                  Assistant Prof
ORT003--DR. MONAPPA NAIK--9686692598NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
ORT004--DR. VIVEK PANDEY--9686692600NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
ORT005--DR. SHARATH KUMAR RAO K--9686692602NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
OSUR  --DR. SRIKANTH G
PCR001--DR. GUNJAN BANGA
PCR002--DR. AKKATAI  SHRISHAIL TELI
PD    --DR. RASHMI NAYAK
PDO001--DR VASUDEVA BHAT K
PDS   --DR. VIJAYA KUMAR--08202922116/2922283 in case of bleeding/discharge from wound site, pain, fever
PED001--DR. RAMESH BHAT Y--9686692579
PED002--DR. SUNEEL MUNDKUR C--9686676577
PED003--DR. SHRIKIRAN A HEBBAR--9686692967
PED006--DR. KOUSHIK H
PED011--DR. PUSHPA G KINI
PED4IB--DR. LESLIE EDWARD S LEWIS--To report if there is poor suck, vomiting, lethargy, hurried breathing and increasing clinical levels of jaundice.
PED4OB--DR. LESLIE EDWARD S LEWIS--To report if there is poor suck, vomiting, lethargy, hurried breathing and increasing clinical levels of jaundice.
PLS   --DR. SREEKUMAR--968667656
PMD001--DR. NAVEEN SULAKSHAN SALINS
PMR001--DR MAITREYI PATIL
POR001--DR. HITESH H SHAH--9686676402NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
PSY001--DR. P.S.V.N.SHARMA
PSY002--DR. SAVITHA S
PSY003--DR. SAMIR KUMAR PRAHARAJ
PUL001--DR. ASWINI KUMAR MOHAPATRA
PUL002--DR. RAHUL MAGAZINE
RAD   --DR. PRAKASHINI
RADIVR--DR HARSHITH / DR MITHUN
RMS001--DR. PRATAP KUMAR NARAYAN
RTO001--DR. SHIRLEY SALINS
RTO002--DR. ANSHUL SINGH
SKN001--DR. SATHISH PAI B
SKN002--DR. RAGHAVENDRA RAO
SUO001  --DR. NAVEENA KUMAR A N
SUO002--DR. NAWAZ USMAN
SUR001--DR DINESH B.V--To call 9686676576 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR002--DR VEENA L KARANTH--To call 9686676578 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR003--DR RAJGOPAL SHENOY--To call 9686676580 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR004--DR ANNAPPA KUDVA--To call 9686676582 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR005--DR BADAREESH L--To call 9686676584 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR006--DR STANLEY MATHEW--To call 9686676586 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR007--DR BHARATH S V--To call 9686676588 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR008--DR SUNIL KRISHNA M--To call 9686676590 in case of severe pain, discharge or blackish discoloration at the surgical site.
URO001--DR. ARUN CHAWLA
URO002--DR. PADMARAJ HEGDE
`

            var unit = document.getElementById('ctl00_Label2');
            var unitnum = unit.textContent.replace('Unit : ','');
            var unitname = unitnum.substring(0, 3)

            function titleCase(str) {
                str = str.toLowerCase().split(' ');
                for (var i = 0; i < str.length; i++) {
                    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
                }
                return str.join(' ');
            }

            var peeps = people.split('\n');

            for ( let i = 0 ; i < peeps.length ; i++){
                if(peeps[i].includes(unitnum)){
                    var hod = peeps[i].split('--')[1]
                    var phonenum = peeps[i].split('--')[2]}
            }

            var hodName = titleCase(hod)
            var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
            var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
            var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
            var furtherAdvice = document.getElementById('ctl00_ContentPlaceHolder1_txtFurAdvice');
            furtherAdvice.value = 'To review in ' + unitnum + ' OPD'

            if (hodNameFin.value == '') {
                hodNameFin.value = hodName;
            }
            if (designationProper.value == '') {
                if (unitnum == 'EYE003') {
                    designationProper.value = 'Professor and Head of Department';
                }else {
                    designationProper.value = 'Head of Unit';
                }
            }
            if (unitNameFin.value == '') {
                unitNameFin.value = unitnum;
            }

            if(document.getElementById('ctl00_ContentPlaceHolder1_txtdate').value.length<1){
                document.getElementById('ctl00_ContentPlaceHolder1_txtchecked').value = 'Adding Date'
                document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
            }
        })

    }

    if(window.location.href.includes("http://khapps.manipal.edu/DISCHSUM/DischargeEntry") || window.location.href.includes("http://khapps.manipal.edu/dischsum/DischargeEntry") || window.location.href.includes("http://khapps.manipal.edu/DISCHSUM/ModifyEntry") || window.location.href.includes("http://khapps.manipal.edu/dischsum/ModifyEntry")){
        var calendar = '/html/body/form/div[5]/div/div[2]/div[1]/div[2]/table/tbody/tr[3]/td[4]/table/tbody/tr[1]/td/table/tbody/tr/td[2]'
        try{
            console.log(document.evaluate(calendar, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML)
        } catch (err) {
            function noClose (event){
                var confirmationMessage = "You are not allowed to close this window"
                event.returnValue = confirmationMessage
                if (typeof event.preventDefault === "function"){
                    event.preventDefault();
                }
                return confirmationMessage
            }

            function preventclose(){window.addEventListener("beforeunload", noClose);}

            preventclose()

            var allowedButtons = ['ctl00_ContentPlaceHolder1_radiodischarge', 'ctl00_ContentPlaceHolder1_radioDaycare', 'ctl00_ContentPlaceHolder1_radiodeath', 'ctl00_ContentPlaceHolder1_RadioPositive', 'ctl00_ContentPlaceHolder1_RadioNegative', 'ctl00_ContentPlaceHolder1_ImageButton1', 'ctl00_ContentPlaceHolder1_cmdreferdoctor', 'ctl00_ContentPlaceHolder1_cmdfnaldiagnosis', 'ctl00_ContentPlaceHolder1_cmdcomplaint',
                                  'ctl00_ContentPlaceHolder1_cmdpasthistorysave', 'ctl00_ContentPlaceHolder1_cmdpasthistorysave', 'ctl00_ContentPlaceHolder1_cmdhistory', 'ctl00_ContentPlaceHolder1_cmdphyfind', 'ctl00_ContentPlaceHolder1_txticustay', 'ctl00_ContentPlaceHolder1_cmdlab', 'ctl00_ContentPlaceHolder1_cmdinvest', 'ctl00_ContentPlaceHolder1_cmdtreatment', 'ctl00_ContentPlaceHolder1_BTN', 'ctl00_ContentPlaceHolder1_cmddiet',
                                  'ctl00_ContentPlaceHolder1_cmdcontact', 'ctl00_ContentPlaceHolder1_cmdsave', 'ctl00_ContentPlaceHolder1_cmdreferexit', 'ctl00_ContentPlaceHolder1_cmddiagnosisexit', 'ctl00_ContentPlaceHolder1_cmdcomplaintexit', 'ctl00_ContentPlaceHolder1_cmdpasthistoryexit', 'ctl00_ContentPlaceHolder1_cmdhistoryexit', 'ctl00_ContentPlaceHolder1_txtphysical', 'ctl00_ContentPlaceHolder1_cmdicu', 'ctl00_ContentPlaceHolder1_cmdicuexit', 'ctl00_ContentPlaceHolder1_cmdlabexit',
                                  'ctl00_ContentPlaceHolder1_cmdinvestexit', 'ctl00_ContentPlaceHolder1_cmdtreatmentexit', 'ctl00_ContentPlaceHolder1_cmdcourse', 'ctl00_ContentPlaceHolder1_cmdcourseexit', 'ctl00_ContentPlaceHolder1_cmdcondition', 'ctl00_ContentPlaceHolder1_cmdconditionexit', 'ctl00_ContentPlaceHolder1_cmdadvice', 'ctl00_ContentPlaceHolder1_cmdadviceexit', 'ctl00_ContentPlaceHolder1_cmddietexit', 'ctl00_ContentPlaceHolder1_cmdcontactexit']

            for ( let i = 0 ; i < allowedButtons.length ; i++) {
                document.getElementById(allowedButtons[i]).addEventListener('click', function(){
                    window.removeEventListener('beforeunload', noClose)
                })}
        }

        if(document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value.includes('Adding Date')){
            setTimeout(function() {
                var search = '[title="DATE"]'.replace('DATE', titleDate)
                var node = document.querySelector(search);
                node.click()
                document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = ''}, 100)
        }

        var people = `
AYU   --DR. BASAVARAJ S HADAPAD
CAR-R --DR. RANJAN SHETTY K
CAR001--DR. PADMAKUMAR R
CAR002--DR. TOM DEVASIA
CAR003--DR. ASHWAL AJ
CAREPC--DR MUKUND A PRABHU
CAS   --CASUALTY MEDICAL OFFICER
CMD001--DR. SHWETHAPRIYA R
CTS001--DR. GANESH KAMATH
CTS002--DR. ARAVIND KUMAR BISHNOI
EMD001--DR JAYARAJ MYMBILLY BALAKRISHNAN
ENC001--DR. SAHANA SHETTY
ENT001--DR. KAILESH PUJARY--9686675652
ENT002--DR. BALAKRISHNA R--9686675654
EYE001--DR. SULATHA BHANDARY--REVIEW ON MONDAY/THURSDAY IN EYE OPD/SOS IF THERE IS SUDDEN DECREASE IN VISION, REDNESS, PAIN OR WATERING OR CONTACT ON THE DUTY PHONE 9686675697, OPD NO: 0820-2922378
EYE002--DR. YOGISH S  KAMATH--REVIEW ON TUESDAY/FRIDAY IN EYE OPD/SOS IF THERE IS SUDDEN DECREASE IN VISION, REDNESS, PAIN OR WATERING OR CONTACT ON THE DUTY PHONE 9686675697, OPD NO: 0820-2922378
EYE003--DR. VIJAYA PAI H--REVIEW ON WEDNESDAY/SATURDAY IN EYE OPD/SOS IF THERE IS SUDDEN DECREASE IN VISION, REDNESS, PAIN OR WATERING OR CONTACT ON THE DUTY PHONE 9686675697, OPD NO: 0820-2922378
GEC001--DR. SHIRAN SHETTY
GEC002--DR. GANESH BHAT
GEC003--DR. GANESH PAI C
GEN001--DR. GIRISHA K M
GEN002--DR. ANJU SHUKLA
GIS001--DR. BHARAT KUMAR BHAT--To contact 9606758276 if there is pain abdomen, abdominal distension, vomiting.
GYN001--DR. JAYARAMAN NAMBIAR--To contact 08202922338
GYN002--DR. AKHILA VASUDEVA--To contact 08202922338
GYN003--DR. SHYAMALA G--To contact 08202922338
GYN004--DR. JYOTHI SHETTY--To contact 08202922338
GYN005--DR. SHRIPAD S. HEBBAR--To contact 08202922338
HNS001--DR. SURESH PILLAI--9686676675
HSD001--DR. ANIL K BHAT--9632082505
IFD001--DR. KAVITHA SARAVU
IFD002--DR. MURALIDHAR VARMA
MED001--DR. VASUDEVA ACHARYA--9686675658
MED002--DR. CHANDRASHEKAR UK--9686675660
MED003--DR. WEENA STANLEY--9686675662
MED004--DR. RAGHAVENDRA RAO--9686675667
MED005--DR. RAM BHAT--9686675670
MED006--DR. RAVIRAJ V ACHARYA--9686675678
MED007--DR. SHIVASHANKARA KN--9686675682
MED008--DR. MUKHYAPRANA PRABHU--9686675686
MED011--DR. SUDHA VIDYASAGAR
MED012--DR. SHUBHA SESHADRI
MED013--DR. B.A.SHASTRY
MED014--DR MANJUNATH HANDE
MEO001--DR. KARTHIK S UDUPA, MD, DM, DNB
MEO002--DR. ANANTH PAI, MD, DM--9686676599
NEO002--DR. LESLIE EDWARD S LEWIS--9686676599
NEOB  --Dr. SHEILA MATHAI
NEOI  --Dr. SHEILA MATHAI--To report if there is poor suck, vomiting, lethargy, hurried breathing and increasing clinical levels of jaundice.
NEU001--DR. APARNA R PAI
NEU002--DR. ARVIND N PRABHU
NMD001--DR. SUMEET SURESH M
NPH001--DR. RAVINDRA PRABHU
NPH002--DR. SHANKAR PRASAD
NUS001--DR. GIRISH MENON
NUS002--DR. RAGHAVENDRA NAYAK
OBG001--DR. JAYARAMAN NAMBIAR
OBG002--DR. AKHILA VASUDEVA
OBG003--DR. SHYAMALA G
OBG004--DR. JYOTHI SHETTY
OBG005--DR. SHRIPAD S. HEBBAR
OBS001--DR. JAYARAMAN NAMBIAR--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS002--DR. AKHILA VASUDEVA--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS003--DR. SHYAMALA G--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS004--DR. JYOTHI SHETTY--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
OBS005--DR. SHRIPAD S. HEBBAR--To contact 08202922338 if complaints of abdominal pain, excessive bleeding PV, breast engorgement, foul smelling lochia
ORT001--DR. SHYAMSUNDER BHAT N--9686692594NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
ORT002--DR. KIRAN KUMAR V ACHARYA--PAIN SWELLING FEVER (CALL 9686692596)NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*NEXTLINEDr. Kiran V Acharya    Dr .Dattatreya Sitaram      Dr. Sachin KumarNEXTLINEProf and HOU                 Assistant Prof                  Assistant Prof
ORT003--DR. MONAPPA NAIK--9686692598NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
ORT004--DR. VIVEK PANDEY--9686692600NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
ORT005--DR. SHARATH KUMAR RAO K--9686692602NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
OSUR  --DR. SRIKANTH G
PCR001--DR. GUNJAN BANGA
PCR002--DR. AKKATAI  SHRISHAIL TELI
PD    --DR. RASHMI NAYAK
PDO001--DR VASUDEVA BHAT K
PDS   --DR. VIJAYA KUMAR--08202922116/2922283 in case of bleeding/discharge from wound site, pain, fever
PED001--DR. RAMESH BHAT Y--9686692579
PED002--DR. SUNEEL MUNDKUR C--9686676577
PED003--DR. SHRIKIRAN A HEBBAR--9686692967
PED006--DR. KOUSHIK H
PED011--DR. PUSHPA G KINI
PED4IB--DR. LESLIE EDWARD S LEWIS--To report if there is poor suck, vomiting, lethargy, hurried breathing and increasing clinical levels of jaundice.
PED4OB--DR. LESLIE EDWARD S LEWIS--To report if there is poor suck, vomiting, lethargy, hurried breathing and increasing clinical levels of jaundice.
PLS   --DR. SREEKUMAR--968667656
PMD001--DR. NAVEEN SULAKSHAN SALINS
PMR001--DR MAITREYI PATIL
POR001--DR. HITESH H SHAH--9686676402NEXTLINE*THIS DOCUMENT IS NOT FOR MEDICOLEGAL PURPOSES*
PSY001--DR. P.S.V.N.SHARMA
PSY002--DR. SAVITHA S
PSY003--DR. SAMIR KUMAR PRAHARAJ
PUL001--DR. ASWINI KUMAR MOHAPATRA
PUL002--DR. RAHUL MAGAZINE
RAD   --DR. PRAKASHINI
RADIVR--DR HARSHITH / DR MITHUN
RMS001--DR. PRATAP KUMAR NARAYAN
RTO001--DR. SHIRLEY SALINS
RTO002--DR. ANSHUL SINGH
SKN001--DR. SATHISH PAI B
SKN002--DR. RAGHAVENDRA RAO
SUO001  --DR. NAVEENA KUMAR A N
SUO002--DR. NAWAZ USMAN
SUR001--DR DINESH B.V--To call 9686676576 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR002--DR VEENA L KARANTH--To call 9686676578 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR003--DR RAJGOPAL SHENOY--To call 9686676580 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR004--DR ANNAPPA KUDVA--To call 9686676582 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR005--DR BADAREESH L--To call 9686676584 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR006--DR STANLEY MATHEW--To call 9686676586 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR007--DR BHARATH S V--To call 9686676588 in case of severe pain, discharge or blackish discoloration at the surgical site.
SUR008--DR SUNIL KRISHNA M--To call 9686676590 in case of severe pain, discharge or blackish discoloration at the surgical site.
URO001--DR. ARUN CHAWLA
URO002--DR. PADMARAJ HEGDE
`
        var unit = document.getElementById('ctl00_Label2');
        var unitnum = unit.textContent.replace('Unit : ','');
        var unitname = unitnum.substring(0, 3)

        var peeps = people.split('\n');
        var ipnum = document.getElementById('ctl00_ContentPlaceHolder1_txtipno').value;
        var admdate = document.getElementById('ctl00_ContentPlaceHolder1_txtadmdate').value

        for ( let i = 0 ; i < peeps.length ; i++){
            if(peeps[i].includes(unitnum)){
                var hod = peeps[i].split('--')[1]
                var phonenum = peeps[i].split('--')[2]}
        }

        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const d = new Date();
        let month = months[d.getMonth()];
        var date = d.getDate()
        var titleDate = month + " " + date

        // Create the autofill button
        var button = document.createElement('button');
        button.id = 'autofill'
        button.innerHTML = 'Autofill';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        document.body.appendChild(button);

        // Create the scans button
        var linkbutton = document.createElement('button');
        linkbutton.innerHTML = 'Access Scans';
        linkbutton.style.position = 'fixed';
        linkbutton.style.top = '70px';
        linkbutton.style.right = '10px';
        document.body.appendChild(linkbutton);

        // Create the synth button
        var synth = document.createElement('button');
        synth.id = 'synth'
        synth.innerHTML = 'Synthesize HOPI';
        synth.style.position = 'fixed';
        synth.style.top = '100px';
        synth.style.right = '10px';
        document.body.appendChild(synth);

        // Create the echo button
        var echo = document.createElement('button');
        echo.innerHTML = 'Add Normal Echo Findings';
        echo.style.position = 'fixed';
        echo.style.top = '130px';
        echo.style.right = '10px';
        document.body.appendChild(echo);

        // Create the CNS button
        var cns = document.createElement('button');
        cns.innerHTML = 'Add Detailed CNS Findings';
        cns.style.position = 'fixed';
        cns.style.top = '160px';
        cns.style.right = '10px';
        document.body.appendChild(cns);

        // Create the IP button
        var ippres = document.createElement('button');
        ippres.innerHTML = 'Open IP Prescription';
        ippres.style.position = 'fixed';
        ippres.style.top = '190px';
        ippres.style.right = '10px';
        document.body.appendChild(ippres);

        // Create the emr button
        var linkemr = document.createElement('button');
        linkemr.innerHTML = 'Access EMR';
        linkemr.style.position = 'fixed';
        linkemr.style.top = '220px';
        linkemr.style.right = '10px';
        document.body.appendChild(linkemr);

        // Create the daycare button
        var daycare = document.createElement('button');
        daycare.innerHTML = 'Daycare Autofill';
        daycare.style.position = 'fixed';
        daycare.style.top = '250px';
        daycare.style.right = '10px';
        if (unitname == 'ENT' || unitname == 'HNS' || unitname == 'EYE' ){
            document.body.appendChild(daycare);
        }

        // Create the EMR drugs button
        var addDrugs = document.createElement('button');
        addDrugs.innerHTML = 'Add EMR Drugs (For Generic)';
        addDrugs.style.position = 'fixed';
        addDrugs.style.top = '280px';
        addDrugs.style.right = '10px';
        var hospno = document.getElementById('ctl00_ContentPlaceHolder1_txthospno').value
        var link = 'http://patemr.manipal.edu/E-REGISTERS_EMR/frmPrescription_medics_SOH_Token_IP.aspx?hno=' + hospno + '&vdate=' + admdate + '&team=' + unitnum
        addDrugs.addEventListener('click', function(){
            window.open(link, '_blank')
            window.addEventListener('message', function (event){
                var deets = event.data
                var drugs = deets.split('\n\n')
                var k = 1
                for (let i = 1 ; i < drugs.length ; i++) {
                    if (document.getElementById('ctl00_ContentPlaceHolder1_txtgeneric' + k).value.length > 1 || document.getElementById('ctl00_ContentPlaceHolder1_txtdrug' + k).value.length > 1){
                        k += 1
                    }
                }
                for (let i = 1 ; i < drugs.length ; i++) {
                    document.getElementById('ctl00_ContentPlaceHolder1_txtgeneric' + k).value = drugs[i-1].split(';;;')[0]
                    document.getElementById('ctl00_ContentPlaceHolder1_txtdrug' + k).value = drugs[i-1].split(';;;')[1]
                    document.getElementById('ctl00_ContentPlaceHolder1_txtstr' + k).value = drugs[i-1].split(';;;')[2]
                    document.getElementById('ctl00_ContentPlaceHolder1_txtfrq' + k).value = drugs[i-1].split(';;;')[3]
                    document.getElementById('ctl00_ContentPlaceHolder1_txtdays' + k).value = drugs[i-1].split(';;;')[4]
                    k += 1
                }
            })
        })

        if (unitname !== 'OBS'){
            document.body.appendChild(addDrugs);
        }

        // Create the past admission button
        var pastInvest = document.createElement('button');
        pastInvest.innerHTML = 'Add Past History';
        pastInvest.style.position = 'fixed';
        pastInvest.style.top = '40px';
        pastInvest.style.right = '10px';
        document.body.appendChild(pastInvest);

        // Create the copy discharge button
        var copyDischarge = document.createElement('button');
        copyDischarge.innerHTML = 'Copy From Previous Discharge';
        copyDischarge.style.position = 'fixed';
        copyDischarge.style.bottom = '40px';
        copyDischarge.style.right = '10px';
        document.body.appendChild(copyDischarge);

        // Create save and approve discharge button
        var approve = document.createElement('button');
        approve.innerHTML = 'Save and Approve Discharge';
        approve.style.position = 'fixed';
        approve.style.bottom = '70px';
        approve.style.right = '10px';
        document.body.appendChild(approve);

        approve.addEventListener('click', function(){
            window.open('http://khapps.manipal.edu/dischsum/HospNoDischargeSummary.aspx?' + document.getElementById('ctl00_ContentPlaceHolder1_txthospno').value + '?' + document.getElementById('ctl00_ContentPlaceHolder1_txtipno').value, '_blank')
            document.getElementById('ctl00_ContentPlaceHolder1_cmdsave').click()
        })

        var hospno = document.getElementById('ctl00_ContentPlaceHolder1_txthospno').value;

        var pastNum = 0
        var pasts = {}
        var ipNums = []

        daycare.addEventListener('click', function(){
            if(document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value.includes('Adding Date')){
                setTimeout(function() {
                    var search = '[title="DATE"]'.replace('DATE', titleDate)
                    var node = document.querySelector(search);
                    node.click()
                    document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = ''}, 100)
            }
            var diagnosis = document.getElementById('ctl00_ContentPlaceHolder1_txtfinal');
            var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
            var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
            var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
            var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
            var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
            var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
            var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
            var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
            var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
            var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
            var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
            var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
            var investigation = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate');
            radio.checked = true;
            var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
            select.selectedIndex = 1;
            var daycareOpt = document.getElementById('ctl00_ContentPlaceHolder1_radioDaycare');
            daycareOpt.checked = true;

            if (unitname == 'EYE'){
                if (diagnosis.value.length == 0) {
                    diagnosis.value = 'ROUTINE EYE CHECKUP'
                }
                if (investigation.value.length == 0) {
                    investigation.value = 'ROUTINE EYE EXAMINATION'
                }
            }

            if (unitname == 'EYE'){
                var diagnosisVal = prompt('Enter diagnosis\nShortcuts:\nDOV : DIMINUTION OF VISION\nGLS : GLAUCOMA SCREENING\nDRS : DIABETIC RETINOPATHY SCREENING\nDR : DIABETIC RETINOPATHY\nFBE : FOREIGN BODY IN EYE', diagnosis.value)
                diagnosis.value = diagnosisVal.replace('DOV', 'DIMINUTION OF VISION').replace('GLS', 'GLAUCOMA SCREENING').replace('DRS', 'DIABETIC RETINOPATHY SCREENING').replace('DR', 'DIABETIC RETINOPATHY').replace('FBE', 'FOREIGN BODY IN EYE')
            }else{
                var diagnosisVal = prompt('Enter diagnosis', diagnosis.value)
                if (diagnosisVal.length > 0) {
                    diagnosis.value = diagnosisVal
                }
            }

            if (unitname == 'EYE'){
                if (diagnosis.value == 'DIMINUTION OF VISION'){
                    investigation.value = 'VISUAL ACUITY TESTING'
                }
                if (diagnosis.value == 'GLAUCOMA SCREENING'){
                    investigation.value = 'NON-CONTACT TONOMETRY'
                }
                if (diagnosis.value == 'DIABETIC RETINOPATHY SCREENING'){
                    investigation.value = 'DILATED FUNDUS EXAMINATION'
                }
                if (diagnosis.value == 'DIABETIC RETINOPATHY'){
                    investigation.value = 'DILATED FUNDUS EXAMINATION'
                }
                var investigationVal = prompt('Enter investigations done\nShortcuts:\nVAT: VISUAL ACUITY TESTING\nNCT : NON-CONTACT TONOMETRY\nDFE : DILATED FUNDUS EXAMINATION\nUFE : UNDILATED FUNDUS EXAMINATION\nSLE : SLIT-LAMP EXAMINATION', investigation.value)
                investigation.value = investigationVal.replace('VAT', 'VISUAL ACUITY TESTING').replace('NCT', 'NON-CONTACT TONOMETRY').replace('DFE', 'DILATED FUNDUS EXAMINATION').replace('UFE', 'UNDILATED FUNDUS EXAMINATION').replace('SLE', 'SLIT-LAMP EXAMINATION')
            }else{
                var investigationVal = prompt('Enter investigations done', investigation.value)
                if (investigationVal.length > 0) {
                    investigation.value = investigationVal
                }
            }

            if (unitname == 'EYE'){
                if (diagnosis.value == 'DIMINUTION OF VISION'){
                    therapeutic.value = 'GLASSES PRESCRIBED'
                }
                if (diagnosis.value == 'FOREIGN BODY IN EYE'){
                    therapeutic.value = 'FOREIGN BODY REMOVAL, SALINE WASH'
                }
                var therapeuticVal = prompt('Enter therapeutic procedure done\nShortcuts:\nFBR : FOREIGN BODY REMOVAL\nSWA : SALINE WASH\nGLP : GLASSES PRESCRIBED', therapeutic.value)
                therapeutic.value = therapeuticVal.replace('FBR', 'FOREIGN BODY REMOVAL').replace('SWA', 'SALINE WASH').replace('GLP', 'GLASSES PRESCRIBED')
            }else{
                var therapeuticVal = prompt('Enter therapeutic procedure done', therapeutic.value)
                if (therapeuticVal.length > 0) {
                    therapeutic.value = therapeuticVal
                }
            }

            if (icuStay.value == '') {
                icuStay.value = 'NA';
            }
            if (contactDeets.value == '') {
                contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
            }
            if (hodNameFin.value == '') {
                hodNameFin.value = hodName;
            }
            if (designationProper.value == '') {
                if (unitnum == 'ENT001') {
                    designationProper.value = 'Professor and Head of Department';
                }else {
                    designationProper.value = 'Head of Unit';
                }
            }
            if (unitNameFin.value == '') {
                unitNameFin.value = unitnum;
            }
            if (diet.value == '') {
                diet.value = 'Normal diet.';
            }
            if (condition.value == ''){
                condition.value = 'Stable';
            }
            if(document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value.length<1){
                document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = 'Adding Date'
                document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
            }
        }
                                )

        pastInvest.addEventListener('click', function(){
            window.open('http://khapps.manipal.edu/dischsum/HospNoDischargeSummary.aspx?' + hospno, '_blank')
            window.addEventListener('message', function getDeets (event){
                var deets = event.data
                if(Array.isArray(deets)){
                    for ( let i = 0 ; i < deets.length ; i++ ){
                        pastNum += 1
                        ipNums.push(deets[i])
                        window.open('http://patemr.manipal.edu/E-REGISTERS_EMR/frmDischargesum.aspx?ipno=' + deets[i] + '&&&entityrid=4', '_blank')
                    }
                }else{
                    pastNum -= 1
                    pasts[event.data.split('!?!')[0]] = event.data.split('!?!')[1] + '?!?' + event.data.split('!?!')[2]
                    if (pastNum == 0){
                        var pastHist = document.getElementById('ctl00_ContentPlaceHolder1_txthistory')
                        var pastPropNotTaken = true
                        for ( let i = 0 ; i < ipNums.length ; i++ ){
                            var pastProp = pasts[ipNums[ipNums.length - i - 1]].split('?!?')[1]
                            if (pastProp.length > 1 && pastPropNotTaken) {
                                pastHist.value += pastProp
                                pastPropNotTaken = false
                            }
                            pastHist.value += pasts[ipNums[ipNums.length - i - 1]].split('?!?')[0]
                        }
                        window.removeEventListener('message', getDeets)
                    }
                }
            })
        })

        /*         copyDischarge.addEventListener('click', function(){
            ipnum = prompt('Enter IP number of previous discharge')
            window.open('http://khapps.manipal.edu/dischsum/revertdisch.aspx?doccode=11111&docname=PG+DOCTOR?' + ipnum, '_blank')
            window.addEventListener('message', function copyDischarge(event){
                function parseData(item){
                    var id = item.split('?!?')[0]
                    var content = item.split('?!?')[1]
                    if (document.getElementById(id).value == '') {
                        document.getElementById(id).value = content
                    }
                }
                var dataRec = event.data
                if (dataRec == 'Proceed'){
                    window.open('http://khapps.manipal.edu/dischsum/ModifyEntry.aspx?ip=' + ipnum + '&userid=COPY', '_blank')
                }else{
                    for ( let i = 0 ; i < dataRec.length ; i++ ){
                        parseData(dataRec[i])
                    }
                    window.removeEventListener('message', copyDischarge)

                }

        })
                                    })
 */

        copyDischarge.addEventListener('click', function(){
            ipnum = prompt('Enter IP number of previous discharge')
            window.open('http://patemr.manipal.edu/E-REGISTERS_EMR/frmDischargesum.aspx?ipno='+ipnum+'&&entityrid=4', '_blank')
            window.addEventListener('message', function (){
                function BasicParser(startphrase, endphrase, id){
                    var text = event.data
                    var splitPart = text.split(startphrase)[1]
                    var finSplit = splitPart.split(endphrase)[0]
                    if (document.getElementById(id).value == ''){
                        document.getElementById(id).value = finSplit.trim()
                    }
                }
                var text = event.data

                var finSeqs = []

                var seqList = ['Final Diagnosis :---ctl00_ContentPlaceHolder1_txtfinal', 'Complaints on Reporting :---ctl00_ContentPlaceHolder1_txtcomplaints', 'Past History  :---ctl00_ContentPlaceHolder1_txthistory', 'History of Present Illness :---ctl00_ContentPlaceHolder1_txtillness', 'Physical  findings of Examination  :---ctl00_ContentPlaceHolder1_txtphysical', 'Laboratory Data  :---', 'Investigative Procedures    :---ctl00_ContentPlaceHolder1_txtinvestigate', 'Therapeutic Procedures  :---ctl00_ContentPlaceHolder1_txttherapetic', 'Courses of Treatment in the Hospital :---ctl00_ContentPlaceHolder1_txttreat', 'Summary of ICU Stay :---ctl00_ContentPlaceHolder1_txticustay', 'Condition on Discharge  :---ctl00_ContentPlaceHolder1_txtcondition', 'Drugs Advice on Discharge  :---DRUGS!', 'Further Advice on Discharge  :---ctl00_ContentPlaceHolder1_txtadvice', 'Dietry Advice :---ctl00_ContentPlaceHolder1_txtdiet', 'To contact if there are any symptoms  like :---ctl00_ContentPlaceHolder1_txtcontact', 'Prepared By  :---ctl00_ContentPlaceHolder1_txtprepare', 'Checked By :---ctl00_ContentPlaceHolder1_txtchecked', 'Assistant :---']
                for ( let i = 0 ; i < seqList.length ; i++ ){
                    var searchTerms = seqList[i].split('---')[0]
                    if ( text.includes(searchTerms) ){
                        finSeqs.push(seqList[i])
                    }
                }
                for ( let i = 0 ; i < finSeqs.length - 1 ; i++ ){
                    var initSeg = finSeqs[i].split('---')[0]
                    var finSeg = finSeqs[i+1].split('---')[0]
                    var idName = finSeqs[i].split('---')[1]
                    if (idName == 'DRUGS!'){
                        var drugsProp = text.split(initSeg)[1].split(finSeg)[0].trim().split('\n\n\t\n').slice(1)
                        for ( let k = 0 ; k < drugsProp.length ; k++ ){
                            var drugComps = drugsProp[k].split('\n\t\n')
                            var l = k + 1
                            if (document.getElementById('ctl00_ContentPlaceHolder1_txtgeneric'+l).value.length < 1){
                                document.getElementById('ctl00_ContentPlaceHolder1_txtgeneric'+l).value = drugComps[0].split('\n')[1].replace('Generic: ', '')
                            }
                            if (document.getElementById('ctl00_ContentPlaceHolder1_txtdrug'+l).value.length < 1){
                                document.getElementById('ctl00_ContentPlaceHolder1_txtdrug'+l).value = drugComps[0].split('\n')[0]
                            }
                            if (document.getElementById('ctl00_ContentPlaceHolder1_txtstr'+l).value.length < 1){
                                document.getElementById('ctl00_ContentPlaceHolder1_txtstr'+l).value = drugComps[1]
                            }
                            if (document.getElementById('ctl00_ContentPlaceHolder1_txtfrq'+l).value.length < 1){
                                document.getElementById('ctl00_ContentPlaceHolder1_txtfrq'+l).value = drugComps[2]
                            }
                            if (document.getElementById('ctl00_ContentPlaceHolder1_txtdays'+l).value.length < 1){
                                document.getElementById('ctl00_ContentPlaceHolder1_txtdays'+l).value = drugComps[3]
                            }
                        }
                    } else if (idName.length>1){
                        if ( document.getElementById(idName).value < 1 ) {
                            document.getElementById(idName).value = text.split(initSeg)[1].split(finSeg)[0].trim()
                        }
                    }
                }
                var finFinSeg = (finSeqs[finSeqs.length-1].split('---')[0])
                var nameSegs = text.split(finFinSeg)[1].trim().split('\n\t')
                if (document.getElementById('ctl00_ContentPlaceHolder1_txtdocname').value.length < 1){
                    document.getElementById('ctl00_ContentPlaceHolder1_txtdocname').value = nameSegs[0].trim()
                }
                if (document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn').value.length < 1){
                    document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn').value = nameSegs[2].trim()
                }
                if (document.getElementById('ctl00_ContentPlaceHolder1_txtunit').value.length < 1){
                    document.getElementById('ctl00_ContentPlaceHolder1_txtunit').value = nameSegs[3].trim()
                }
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;
                if (nameSegs[0].trim() == 'Drugs') {
                    alert('Error in loading EMR. Please refresh page and try again.')
                    location.reload()
                }
            })
        })

        ippres.addEventListener('click', function(){
            var link = 'http://patemr.manipal.edu/E-REGISTERS_EMR/frmPrescription_medics_SOH_Token_IP.aspx?hno=' + hospno + '&vdate=' + admdate + '&team=' + unitnum
            var promptxt = ''
            for ( let i = 1 ; i < 31 ; i++ ){
                var drugname = 'ctl00_ContentPlaceHolder1_txtdrug' + i
                var strength = 'ctl00_ContentPlaceHolder1_txtstr' + i
                var freq = 'ctl00_ContentPlaceHolder1_txtfrq' + i
                var days = 'ctl00_ContentPlaceHolder1_txtdays' + i

                if (document.getElementById(drugname).value.length < 1){
                    null;
                }else{
                    var drugn = document.getElementById(drugname).value
                    var strengthn = document.getElementById(strength).value
                    var freqn = document.getElementById(freq).value
                    var daysn = document.getElementById(days).value

                    promptxt += drugn + '\n' + strengthn + '\n' + freqn + '\n' + daysn + '\n' + '\n'
                }
            }
            promptxt += '$EXTRAINFO$' + document.getElementById('ctl00_ContentPlaceHolder1_txtfinal').value.replaceAll('\n', ', ') + '$$$' + document.getElementById('ctl00_ContentPlaceHolder1_txtadvice').value + '$$$' + document.getElementById('ctl00_ContentPlaceHolder1_txtdiet').value
            prompt("Copy these drugs (Ctrl+C)\nOn the prescription page, click on 'Add Drugs From Discharge Summary' button and paste this in the prompt box.", promptxt)
            window.open(link, '_blank');
        })

        function titleCase(str) {
            str = str.toLowerCase().split(' ');
            for (var i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
            }
            return str.join(' ');
        }

        var hodName = titleCase(hod)

        var name = document.getElementById('ctl00_ContentPlaceHolder1_txtptname');
        button.addEventListener('click', function() {
            if (unitname == 'OBS' || unitname == 'GYN'){
                var LMP = prompt('Add LMP', 'dd/mm/yy')
                var LMPdate = new Date(LMP.substring(3,5) + '/' + LMP.substring(0,2) + '/20' + LMP.substring(6,8))
                while (LMPdate == 'Invalid Date'){
                    var LMP = prompt('LMP Date invalid, please ensure the date format is dd/mm/yy', 'dd/mm/yy')
                    var LMPdate = new Date(LMP.substring(3,5) + '/' + LMP.substring(0,2) + '/20' + LMP.substring(6,8))
                    }
                var obsScore = prompt('Enter obstetric score', 'G_P_L_A')
                if (unitname == 'OBS'){
                    var UPT = prompt('UPT positive DOA?')
                    var ANCloc = prompt('Initial ANC location?')

                    var DOA = document.getElementById('ctl00_ContentPlaceHolder1_txtadmdate').value

                    var G = obsScore.substring(1,2)
                    var P = obsScore.substring(3,4)
                    var L = obsScore.substring(5,6)
                    var A = obsScore.substring(7,8)

                    if (G == '1'){
                        var primi = true
                        }

                    var year = d.getYear() + 1900
                    const today = new Date(titleDate + " " + year);
                    var EDDdate = addDays (LMPdate, 280)
                    var reAdmit = addDays (today, 60)

                    var DOAproper = DOA.substring(3,5) + '/' + DOA.substring(0,2) + '/' + DOA.substring(6,10)
                    const DOAdate = new Date(DOAproper)

                    const diffTime = Math.abs(LMPdate - DOAdate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    var weeks = Math.floor(diffDays/7)
                    var days = diffDays - weeks * 7
                    var POGdate = weeks + 'W' + days + 'D'

                    }

                function addDays(date, days) {
                    const dateCopy = new Date(date);
                    dateCopy.setDate(date.getDate() + days);
                    return dateCopy;
                }

                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                var finalDiag = document.getElementById('ctl00_ContentPlaceHolder1_txtfinal');
                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;

                if (unitname == 'OBS'){
                    if (finalDiag.value == ''){
                        if (primi) {
                            finalDiag.value = 'Primi at ' + POGdate + ' of gestation'
                        } else {
                            finalDiag.value = obsScore + ' at ' + POGdate + ' of gestation'
                        }
                    }

                }

                if (physicalExam.value == '') {
                    if(unitname == 'OBS'){
                        physicalExam.value = `No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema
GC: Fair
BP: 110/70 mmHg
PR: 80/min
CVS: S1, S2 heard
RS: NVBS+ B/L
P/A: Size of uterus corresponds to ~term, lie - longitudinal, presentation - cephalic, FHS+`
                    }else{
                        physicalExam.value = `No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema
GC: Fair
BP: 110/70 mmHg
PR: 80/min
CVS: S1, S2 heard
RS: NVBS+ B/L`
                    }

                    if (pastHistoryFin.value == '') {
                        if (unitname == 'GYN') {
                            pastHistoryFin.value = `LMP: ADDLMP
Family History: Nil significant
Medical History: Nil history of gynaecological malignancies
Surgical History: Nil significant
Marital History: Married since _, NCM
Menstrual history: Regular Cycles
Obstetric History: GPLAscore`.replace('ADDLMP', LMPdate.toLocaleDateString('en-GB')).replace('GPLAscore', obsScore)
                        }else if (primi) {
                            pastHistoryFin.value = `LMP: ADDLMP
EDD: ADDEDD
POG: POGdate
Family History: Nil significant
Medical History: Nil significant
Surgical History: Nil significant
Marital History: Married since _, NCM
Menstrual history: Regular Cycles
Obstetric History: GPLAscore`.replace('ADDLMP', LMPdate.toLocaleDateString('en-GB')).replace('ADDEDD', EDDdate.toLocaleDateString('en-GB')).replace('POGdate', POGdate).replace('GPLAscore', obsScore);
                        }else{
                            pastHistoryFin.value = `LMP: ADDLMP
EDD: ADDEDD
POG: POGdate
Family History: Nil significant
Medical History: Nil significant
Surgical History: Nil significant
Marital History: Married since _ years, NCM
Menstrual history: Regular Cycles
Obstetric History: GPLAscore
Previous Pregnancy:
1st Pregnancy: __`.replace('ADDLMP', LMPdate.toLocaleDateString('en-GB')).replace('ADDEDD', EDDdate.toLocaleDateString('en-GB')).replace('POGdate', POGdate).replace('GPLAscore', obsScore);
                        }
                    }

                    var HOPI = document.getElementById('ctl00_ContentPlaceHolder1_txtillness');
                    if (HOPI.value == '' && unitname == 'OBS'){
                        HOPI.value = 'Natural conception, Initial ANC done at ANCLocation. UPT positive at UPTdate days of amenorrhea. '.replace('UPTdate', UPT).replace('ANCLocation', ANCloc)
                    }

                    if (icuStay.value == '') {
                        icuStay.value = 'NA';
                    }
                    if (contactDeets.value == '') {
                        contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
                    }
                    if (hodNameFin.value == '') {
                        hodNameFin.value = hodName;
                    }
                    if (designationProper.value == '') {
                        designationProper.value = 'Head of Unit';
                    }
                    if (unitNameFin.value == '') {
                        unitNameFin.value = unitnum;
                    }
                    if (diet.value == '') {
                        diet.value = 'Balanced diet'
                    }
                    if (adviceDischarge.value == '' && unitname == 'OBS') {
                        adviceDischarge.value = `To review in OBG 5 OPD after 2 months on _ for post natal check up.
Exclusive breast feeding for 6 months.
Immunisation as per schedule.
Contraception advise given`.replace('_', reAdmit.toLocaleDateString('en-GB'));
                    }
                    if (condition.value == ''){
                        condition.value = 'Stable';
                    }

                    if(document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value.length<1){
                        document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = 'Adding Date'
                        document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
                    }
                }
            }

            if(document.getElementById('ctl00_ContentPlaceHolder1_radioDaycare').checked == true){
                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                var investproced = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate');
                var course = document.getElementById('ctl00_ContentPlaceHolder1_txttreat');

                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;

                if (physicalExam.value == '') {
                    if (unitname == 'SUR') {
                        physicalExam.value = `Patient was conscious, cooperative, well oriented to time, place and person. Moderately built and well-nourished.
PR - 72BPM
BP - 120/70mmHg
RR - 16CPM
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema, koilonychia.
Afebrile
GCS - 15/15

RS:
Trachea central
Chest movements equal in all areas with respiration
Normal bilateral vesicular breath sounds heard
No added sounds.

CVS:
S1, S2 heard.
Apical impulse 5th ICS medial to left midclavicular line.
No added sounds
No murmurs.

Per Abdomen:
Soft, non-tender. No organomegaly.
No fluid thrill/shifting dullness
Bowel sounds present

CNS:
Higher mental functions normal.
No focal neurological deficits.`
                    }else{
                        physicalExam.value = `Patient was conscious, cooperative, well oriented to time, place and person. Moderately built and well-nourished.
PR - 72BPM
BP - 120/70mmHg
RR - 16CPM
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema, koilonychia.
Afebrile
GCS - 15/15

RS:
Trachea central
Chest movements equal in all areas with respiration
Normal bilateral vesicular breath sounds heard
No added sounds.

CVS:
S1, S2 heard.
Apical impulse 5th ICS medial to left midclavicular line.
No added sounds
No murmurs.

GI:
Soft, non-tender. No organomegaly.
No fluid thrill/shifting dullness
Bowel sounds present

CNS:
Higher mental functions normal.
No focal neurological deficits.`
                    }
                }

                if (pastHistoryFin.value == '') {
                    pastHistoryFin.value = 'Nil premorbid';
                }
                if (icuStay.value == '') {
                    icuStay.value = 'NA';
                }
                if (contactDeets.value == '') {
                    contactDeets.value = phonenum.replace('severe pain, discharge or blackish discoloration at the surgical site.', 'emergency').replaceAll('NEXTLINE', '\n');
                }
                if (hodNameFin.value == '') {
                    hodNameFin.value = hodName;
                }
                if (designationProper.value == '') {
                    designationProper.value = 'Head of Unit';
                }
                if (unitNameFin.value == '') {
                    unitNameFin.value = unitnum;
                }
                if (diet.value == '') {
                    if (unitname == 'SUR') {
                        diet.value = 'Normal diet.';
                    }else{
                        diet.value = 'Low salt, low fat, low cholesterol diet.';
                    }
                }
                if (adviceDischarge.value == '') {
                    adviceDischarge.value = 'Review after _ weeks with _.';
                }
                if (therapeutic.value == '') {
                    if (unitname == 'SUR') {
                        therapeutic.value = '';
                    }else{
                        therapeutic.value = 'Medical management.';
                    }
                }
                if (condition.value == ''){
                    condition.value = 'Stable';
                }
                if (course.value == ''){
                    if (investproced.value == ''){
                        null;
                    }else{
                        course.value = 'Patient came to the hospital with above mentioned complaints and ' + investproced.value + ' was done and the findings have been reported. Hence the patient is being discharged with the following advice.';
                        if (therapeutic.value == ''){
                            therapeutic.value = investproced.value
                        }
                    }
                }
                if (investproced.value == ''){
                    investproced.value = 'Please enter the procedure done and press autofill';
                }

                if(document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value.length<1){
                    document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = 'Adding Date'
                    document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
                }
            }else if(unitnum == 'PED4IB' || unitnum == 'PED4OB' || unitnum == 'NEOI'){
                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var invest = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                var HOPI = document.getElementById('ctl00_ContentPlaceHolder1_txtillness');
                var age = document.getElementById('ctl00_ContentPlaceHolder1_txtage');
                var cc = document.getElementById('ctl00_ContentPlaceHolder1_txtcomplaints');
                var gen = document.getElementById('ctl00_ContentPlaceHolder1_txtsex');
                var course = document.getElementById('ctl00_ContentPlaceHolder1_txttreat');
                var age = document.getElementById('ctl00_ContentPlaceHolder1_txtage');
                var drug = document.getElementById('ctl00_ContentPlaceHolder1_txtdrug1');
                var strength = document.getElementById('ctl00_ContentPlaceHolder1_txtstr1');
                var freq = document.getElementById('ctl00_ContentPlaceHolder1_txtfrq1');
                var noDays = document.getElementById('ctl00_ContentPlaceHolder1_txtdays1');
                var gen = document.getElementById('ctl00_ContentPlaceHolder1_txtsex').value;

                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;
                var DOA = document.getElementById('ctl00_ContentPlaceHolder1_txtadmdate').value
                var DOAproper = DOA.substring(3,5) + '/' + DOA.substring(0,2) + '/' + DOA.substring(6,10)
                const DOAdate = new Date(DOAproper)
                function addDays(date, days) {
                    const dateCopy = new Date(date);
                    dateCopy.setDate(date.getDate() + days);
                    return dateCopy;
                }
                var finDay = addDays(DOAdate, 0).toLocaleDateString('en-GB')

                if(cc.value == ''){
                    cc.value = 'Born to yrs primigravida / GPL on DATED at am by Normal vaginal delivery/emergency LSCS (Ind; Previous LSCS). Cried at birth, APGAR 1 min and 5 min 9, 9'.replace('DATED', finDay)
                }

                if (physicalExam.value == '') {
                    if (gen == 'F'){
                        physicalExam.value = `Birth Weight: gm, Length: cm, HC: cm. AF: 2x2cms,
HR: 140/min, RR: 46/min. CFT < 3 sec.
No congenital anomaly. B/L femoral pulses are well felt. No DDH/CTEV.
RS-bilateral air entry equal, no added sounds.
CVS- S1, S2 heard, No murmur
CNS- Good tone and activity.
PA- soft, no distension, no organomegaly
Normal female with female genitalia`
                    }else{
                        physicalExam.value = `Birth Weight: gm, Length: cm, HC: cm. AF: 2x2cms,
HR: 140/min, RR: 46/min. CFT < 3 sec.
No congenital anomaly. B/L femoral pulses are well felt. No DDH/CTEV.
RS-bilateral air entry equal, no added sounds.
CVS- S1, S2 heard, No murmur
CNS- Good tone and activity.
PA- soft, no distension, no organomegaly
Normal male with b/l descended testis`}
                }
                if (pastHistoryFin.value == '') {
                    pastHistoryFin.value = '';
                }
                if (icuStay.value == '') {
                    icuStay.value = 'NA';
                }
                if (contactDeets.value == '') {
                    contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
                }
                if (hodNameFin.value == '') {
                    hodNameFin.value = hodName;
                }
                if (designationProper.value == '') {
                    designationProper.value = 'Head of Unit';
                }
                if (unitNameFin.value == '') {
                    unitNameFin.value = unitnum;
                }
                if (diet.value == '') {
                    diet.value = 'Exclusive breastfeeding for 6 months';
                }
                if (adviceDischarge.value == '') {
                    adviceDischarge.value = `Exclusive breast feeding
Keep baby warm
Immunization as per schedule including Pneumococcal vaccine.
Review after 2 months for Immunization in Pediatrics OPD.`;
                }
                if (HOPI.value == '') {
                    HOPI.value = ''
                }
                if (invest.value == '') {
                    invest.value = ' Hearing: B/L suggestive of normal OHC functioning.';
                }
                if (condition.value == ''){
                    condition.value = ' Active and sucking well Discharge weight: grams, HC: cm. Discharge TcB:';
                }
                if (therapeutic.value == ''){
                    therapeutic.value = `Neonatal resuscitation care
Lactation support
`;
                }
                if (course.value == ''){
                    if (gen == 'F'){
                        course.value = `A term inborn female was born on DATE Baby had cried at birth & passed urine and meconium on day 1. Baby developed jaundice .....TCB monitored during hospital stay was normal. Breast feeding was established & baby was active and feeding well at discharge. Zero dose OPV and Inj. Hepatitis B & Inj. BCG given at discharge.
`.replace('DATE', finDay);
                    }else{
                        course.value = `A term inborn male baby was born on DATE Baby had cried at birth & passed urine and meconium on day 1. Baby developed jaundice .....TCB monitored during hospital stay was normal. Breast feeding was established & baby was active and feeding well at discharge. Zero dose OPV and Inj. Hepatitis B & Inj. BCG given at discharge.
`.replace('DATE', finDay);
                    }
                }
                if (drug.value == '') {
                    drug.value = 'ULTRA D3 DROPS';
                }
                if (strength.value == '') {
                    strength.value = '(1ML= 400IU)';
                }
                if (freq.value == '') {
                    freq.value = '1ML ONCE DAILY';
                }
                if (noDays.value == '') {
                    noDays.value = '6 MONTHS';
                }


                if(document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value.length<1){
                    document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = 'Adding Date'
                    document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
                }

            }
            else if(unitname == 'PED'){
                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                var HOPI = document.getElementById('ctl00_ContentPlaceHolder1_txtillness');
                var age = document.getElementById('ctl00_ContentPlaceHolder1_txtage');
                var cc = document.getElementById('ctl00_ContentPlaceHolder1_txtcomplaints');
                var gen = document.getElementById('ctl00_ContentPlaceHolder1_txtsex');
                var age = document.getElementById('ctl00_ContentPlaceHolder1_txtage');

                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;

                if (age.value.includes('M')){
                    var ageproper = parseInt(age.value.replace(' M'))
                    }else{
                        var ageproper = 12 * parseInt(age.value.replace(' Y'))
                        }

                if (ageproper<12){
                    var expectwt = (ageproper+9)/2
                    } else if (ageproper<48){
                        var expectwt = (2*ageproper/12)+8
                        } else if (ageproper<144){
                            var expectwt = (7 * ageproper/12 - 5)/2
                            }else{
                                var expectwt = '_'
                                }

                if (ageproper<3){
                    var expectht = 50
                    } else if (ageproper<9){
                        var expectht = 60
                        } else if (ageproper<12){
                            var expectht = 70
                            } else if (ageproper<24){
                                var expectht = 75
                                } else if (ageproper<144){
                                    var expectht = 6*ageproper/12 + 77
                                    }else{
                                        var expectht = '_'
                                        }

                if (physicalExam.value == '') {
                    physicalExam.value = `Height - _ | Expected - expectedHtcm
Weight - _ | Expected - expectedWtkg
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema
Head, eyes, ears - Normal
Mouth and throat normal
No fontanelle bulge

CVS:
PR - 80BPM
S1, S2 heard
No murmurs
No precordial bulge
Apex beat in 5th ICS in left MCL
JVP normal
No pulsations or thrills

Respiratory System:
Chest-Bony case: Normal shape and size
Trachea: Midline
RR - 18/min
Movement of chest bilaterally symmetrical
Bilateral air entry present
Bilateral normal vesicular breath sounds
Vocal fremitus present
Percussion bilateral resonant
Bilateral AE present and equal

Abdomen:
Soft, non-tender, non-distended
Liver, spleen, kidneys - No organomegaly
No mass or fluid present
Genitalia and anus normal

CNS:
Higher function - Conscious, alert, cooperative
Bilateral motor and sensory systems normal
Superficial, deep and visceral reflexes normal
`.replace('expectedWt', expectwt).replace('expectedHt', expectht)
                }
                if(age.value.substring(0,1) == 8){
                    var article = 'An '
                    }else if(age.value.substring(0,2) == 11){
                        var article = 'An '
                        }else{
                            var article = 'A '
                            }
                if(ageproper==3){
                    var development = 'Neck holding, recognizes mother, anticipates feeds, coos (musical vowel sounds)'
                    } else if (ageproper==4){
                        var development = 'Neck holding, bidextrous reach, recognizes mother, anticipates feeds, laugh loud'
                        }else if (ageproper==5){
                            var development = 'Rolls over, bidextrous reach, recognizes mother, anticipates feeds, laughs loud'
                            }else if (ageproper==6){
                                var development = 'Sits in tripod fashion, unidextrous reach, recognizes strangers, stranger anxiety, speaks monosyllables'
                                }else if (ageproper==8){
                                    var development = 'Sitting without support, unidextrous reach, recognizes strangers, stranger anxiety, speaks monosyllables'
                                    }else if (ageproper==9){
                                        var development = 'Stands with support, immmature pincer grasp, waves bye-bye, speaks bisyllables'
                                        }else if (ageproper==12){
                                            var development = 'Creeps, stands without support, mature pincer grasp, plays simple ball game, 1-2 words with meaning'
                                            }else if (ageproper==24){
                                                var development = 'Walks up and downstairs (2 feet per step), vertical and circular stroke; asks for food, drink, toilet; speaks 2-3 word sentences'
                                                }else if (ageproper==36){
                                                    var development = 'Rides tricycle, alternate feet going upstairs, copies circle; knows name, age, gender; asks questions'
                                                    }else if (ageproper==48){
                                                        var development = 'Hops on one foot, alternate feet going downstairs, copies cross, group play, sings songs or poems, tells stories'
                                                        }else if (ageproper==60){
                                                            var development = 'Hops on one foot, alternate feet going downstairs, copies triangle, dresses and undresses, asks meaning of words'
                                                            }else if (ageproper>60){
                                                                var grade = ageproper/12 - 5
                                                                var development = 'Currently studying in class ' + grade + '. Good scholastic performance. Interacts well with peers.'
                                                                }
                if (pastHistoryFin.value == '') {
                    pastHistoryFin.value = 'Nil premorbid';
                }
                if (icuStay.value == '') {
                    icuStay.value = 'NA';
                }
                if (contactDeets.value == '') {
                    contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
                }
                if (hodNameFin.value == '') {
                    hodNameFin.value = hodName;
                }
                if (designationProper.value == '') {
                    designationProper.value = 'Head of Unit';
                }
                if (unitNameFin.value == '') {
                    unitNameFin.value = unitnum;
                }
                if (diet.value == '') {
                    diet.value = 'Normal diet.';
                }
                if (HOPI.value == '') {
                    HOPI.value = article + age.value.replace('Y', 'year').replace('M', 'month') + ' old ' + gen.value.replace('M', 'male').replace('F', 'female') + ' child brought with c/o ' + cc.value ;
                    HOPI.value += `

Birth History: Prenatal uneventful, FTNVD, Birth weight: _kg, cried immediately after birth. Mo h/o NICU admission. No NNH.
Developmental History: developedBaby
Immunization History: Appropriate for age
Family History: Non-consanguineous marriage
`.replace('developedBaby', development)
                }
                if (therapeutic.value == '') {
                    therapeutic.value = 'Medical management.';
                }
                if (condition.value == ''){
                    condition.value = 'Stable';
                }

                if(document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value.length<1){
                    document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = 'Adding Date'
                    document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
                }

            }
            else if (unitname == 'EYE') {
                function drugAdder (idName, deets){
                    if (document.getElementById('ctl00_ContentPlaceHolder1_txt' + idName).value.length < 1){
                        document.getElementById('ctl00_ContentPlaceHolder1_txt' + idName).value = deets
                    }
                }
                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                var course = document.getElementById('ctl00_ContentPlaceHolder1_txttreat');
                var hopi = document.getElementById('ctl00_ContentPlaceHolder1_txtillness');
                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;
                if (physicalExam.value == '') {
                    physicalExam.value = `VISUAL ACUITY: DISTANCE: RE: 6/6; LE: 6/6
NEAR: RE: N6; LE: N6
VISUAL AXIS: PARALLEL; EOM: FULL AND NORMAL
RIGHT EYE: EYELIDS: NORMAL; DRAINAGE SYSTEM: FREE; CONJ: NORMAL; CORNEA: CLEAR; SCLERA: NORMAL; AC: ND, OE; IRIS: NC, NP; PUPIL: 3MM, RRR, D+, C+, NO RAPD; LENS: CLEAR; IOP: 15MMHG; FUNDUS: NORMAL VIEW; DISC AND VESSELS: NORMAL; FR: NORMAL
LEFT EYE: EYELIDS: NORMAL; DRAINAGE SYSTEM: FREE; CONJ: NORMAL; CORNEA: CLEAR; SCLERA: NORMAL; AC: ND, OE; IRIS: NC, NP; PUPIL: 3MM, RRR, D+, C+, NO RAPD; LENS: CLEAR; IOP: 15MMHG; FUNDUS: NORMAL VIEW; DISC AND VESSELS: NORMAL; FR: NORMAL`
                }
                if (hopi.value == '') {
                    hopi.value = `
NO H/O FLASHES, FLOATERS, PHOTOPHOBIA. NO REDNESS, WATERING.`;
                }
                if (pastHistoryFin.value == '') {
                    pastHistoryFin.value = `NIL PREMORBID
NO KNOWN ALLERGIES`;
                }
                if (icuStay.value == '') {
                    icuStay.value = 'NA';
                }
                if (contactDeets.value == '') {
                    contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
                }
                if (hodNameFin.value == '') {
                    hodNameFin.value = hodName;
                }
                if (designationProper.value == '') {
                    if (unitnum == 'EYE002') {
                        designationProper.value = 'Professor and Head of Department';
                    }else {
                        designationProper.value = 'Head of Unit';
                    }
                }
                if (unitNameFin.value == '') {
                    unitNameFin.value = unitnum;
                }
                if (diet.value == '') {
                    diet.value = 'NORMAL DIET.';
                }
                if (adviceDischarge.value == '') {
                    adviceDischarge.value = `CONTINUE SYSTEMIC MEDICATIONS IF ANY. DO NOT TOUCH OPERATED EYE. DO NOT SLEEP ON
OPERATED SIDE. DO NOT HAVE HEAD BATH FOR 2 WEEKS. DO NOT LET WATER ENTER OPERATED EYE`;
                }
                if (therapeutic.value == '') {
                    const dateFrags = new Date().toLocaleDateString('en-US').split('/');
                    therapeutic.value = 'SURGERY DONE BY ' + hodName.toUpperCase() + ' ON ' + dateFrags[1] + '/' + dateFrags[0] + '/' + dateFrags[2] + ' UNDER _ ANAESTHESIA';
                }
                if (condition.value == ''){
                    condition.value = 'STABLE';
                }
                if (course.value == ''){
                    course.value = `PATIENT ADMITTED FOR ABOVE COMPLAINTS. ABOVE PROCEDURE DONE. PATIENT STABLE POST OP.
PATIENT PLANNED FOR DISCHARGE`;
                }
                var camp = confirm('Click OK if camp patient')
                if (camp){
                    var eye = prompt('Drugs to be added in which eye?')
                    if (eye.toUpperCase().includes('L')){
                        var axiText = 'IN LEFT EYE'
                        }
                    if (eye.toUpperCase().includes('R')){
                        var axiText = 'IN RIGHT EYE'
                        }
                    if (eye.toUpperCase().includes('B')){
                        var axiText = 'IN BOTH EYES'
                        }
                    drugAdder('generic1', 'CIPROFLOXACIN 0.3% W/V | DEXAMETHASONE 1 %')
                    drugAdder('drug1', 'CIPLOX D EYE DROPS')
                    drugAdder('str1', 'DROPS ' + axiText)
                    drugAdder('frq1', '1 - 1 - 1 - 1 - 1 - 1 (6T)')
                    drugAdder('days1', '2 weeks then')
                    drugAdder('generic2', 'CIPROFLOXACIN 0.3% W/V | DEXAMETHASONE 1 %')
                    drugAdder('drug2', 'CIPLOX D EYE DROPS')
                    drugAdder('str2', 'DROPS ' + axiText)
                    drugAdder('frq2', '1 - 1 - 1 - 1 - 1 (5T)')
                    drugAdder('days2', '1 week')
                    drugAdder('generic3', 'CIPROFLOXACIN 0.3% W/V | DEXAMETHASONE 1 %')
                    drugAdder('drug3', 'CIPLOX D EYE DROPS')
                    drugAdder('str3', 'DROPS ' + axiText)
                    drugAdder('frq3', '1 - 1 - 1 - 1 (QID)')
                    drugAdder('days3', '1 week')
                    drugAdder('generic4', 'CIPROFLOXACIN 0.3% W/V | DEXAMETHASONE 1 %')
                    drugAdder('drug4', 'CIPLOX D EYE DROPS')
                    drugAdder('str4', 'DROPS ' + axiText)
                    drugAdder('frq4', '1 - 1 - 1 (TID)')
                    drugAdder('days4', '1 week')
                    drugAdder('generic5', 'CIPROFLOXACIN 0.3% W/V | DEXAMETHASONE 1 %')
                    drugAdder('drug5', 'CIPLOX D EYE DROPS')
                    drugAdder('str5', 'DROPS ' + axiText)
                    drugAdder('frq5', '1 - 0 - 1 (BD)')
                    drugAdder('days5', '1 week')
                    drugAdder('generic6', 'CIPROFLOXACIN 0.3% W/V | DEXAMETHASONE 1 %')
                    drugAdder('drug6', 'CIPLOX D EYE DROPS')
                    drugAdder('str6', 'DROPS ' + axiText)
                    drugAdder('frq6', '1 - 0 - 0 (OD)')
                    drugAdder('days6', '1 week and stop')
                    drugAdder('generic7', 'NEPAFENAC OPHTHALMIC SUSPENSION 0.1 W/V')
                    drugAdder('drug7', 'NEPALACT Z  OPHTHALMIC SUSPENSION 5ML')
                    drugAdder('str7', 'DROPS ' + axiText)
                    drugAdder('frq7', '1 - 1 - 1 (3T)')
                    drugAdder('days7', '1.5 months')
                    drugAdder('generic8', 'CARBOXY METHYL CELLULOSE 0.5%')
                    drugAdder('drug8', 'JUST TEARS EYE DROPS 10ML')
                    drugAdder('str8', 'SOLUTION')
                    drugAdder('frq8', '1 - 1 - 1 - 1 (QID)')
                    drugAdder('days8', '1.5 months')
                }
                else if (unitnum == 'EYE003'){
                    var eye = prompt('Drugs to be added in which eye?')
                    drugAdder('generic1', 'MOXIFLOXACIN HYDRO 5.MG/DEXAMETHASONE 1.MG')
                    drugAdder('drug1', 'MILFLODEX 5ML EYE DROPS')
                    drugAdder('str1', 'SOLUTION ' + axiText)
                    drugAdder('frq1', '1 - 1 - 1 - 1 - 1 - 1 (6T)')
                    drugAdder('days1', '2 WEEEKS TILL REVIEW')
                    drugAdder('generic2', 'NEPAFENAC OPHTHALMIC SUSPENSION 0.1 W/V')
                    drugAdder('drug2', 'NEPALACT Z  OPHTHALMIC SUSPENSION 5ML')
                    drugAdder('str2', 'DROPS ' + axiText)
                    drugAdder('frq2', '1 - 1 - 1 - 1 (QID)')
                    drugAdder('days2', '1.5 MONTH')
                }
            }

            else if (unitname == 'SKN'){
                function titleCase(str) {
                    str = str.toLowerCase().split(' ');
                    for (var i = 0; i < str.length; i++) {
                        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
                    }
                    return str.join(' ');
                }

                var name = document.getElementById('ctl00_ContentPlaceHolder1_txtptname');
                var icu = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contact = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var docname = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var desig = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitfull = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var discharge = document.getElementById('ctl00_ContentPlaceHolder1_radiodischarge');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                var daycare = document.getElementById('ctl00_ContentPlaceHolder1_radioDaycare');
                discharge.checked = false;
                daycare.checked = true;
                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                var unit = document.getElementById('ctl00_Label2').textContent.replace('Unit : ', '');
                var investigate = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate').value;
                var data = `SKIN BIOPSY
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, local anesthesia was given with lignocaine (with adrenaline) (after a test dose). A 3.5 mm punch biopsy was taken from the representative lesion. Bleeding at biopsy site was controlled.  Patient tolerated the procedure well. Post procedure instructions like wound care and topical antibiotics were provided.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
PAIN, BLEEDING, BLISTERING
SKIN OPD - 08202922276

INTRALESIONAL INJECTION
Procedural details were explained to the patient . written consent was taken . the rea of the procedure was cleaned under aseptic precautions. Intralesional injection of tricort (triamcinolone ) 40 mg/ml 1:1 dilution given.
patient tolerated procedure well and was observed for few hours for any discomfort or redness. patient is fit for discharge and is discharged with following advise : review sos bleeding , blistering.

PRP
Platelet rich plasma- Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, 4 ml of Platelet rich plasma was injected over scalp at equidistant points. Patient tolerated the procedure well. Patient was observed for few hours for any discomfort or redness. Patient is fit for discharge and is discharged with the following advice: Review after 1 month in Skin OPD
HEADACHE, SYNCOPE, BLEEDING, BLISTERING
SKIN OPD - 08202922276

CHEMICAL PEELING
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions ____ peel was applied to the face and neutralized after __ minutes. Patient tolerated well. Post procedure instructions like gentle face wash, avoidance of topical medications for next 2 days, sunscreens and sun protection advice were provided.
Patient was observed for few hours for any discomfort or redness. Patient is fit for discharge and is discharged with the following advice:
PHOTOPROTECTION WITH SUNSCREEN
REVIEW SOS
Burning sensation, erythema, itching
SKIN OPD - 08202922276

COMEDONE EXTRACTION
PRP
PHOTOPROTECTION WITH SUNSCREEN
REVIEW SOS
Pain, erythema, blister formation
skin opd – 08202922276

KOH SCRAPING
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and the take a skin scraping, which they then place in a potassium hydroxide (KOH) solution and analyze under a microscope .Patient tolerated the procedure well.
PAS

CHEMICAL CAUTERY
Chemical cautery with 35% TCA was done.
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned. Petroleum jelly was applied to the surrounding normal skin, and then 35% Tri-chloro acetic acid was applied over the lesion. The development of white frosting was observed over the treated area. The patient tolerated the procedure well. Post procedure instructions like gentle face wash, avoidance of topical medications for next 2 days, sunscreens and sun protection advice were provided.
Patient was observed for few hours for any discomfort or redness. Patient is fit for discharge and is discharged with the following advice:
PHOTOPROTECTION WITH SUNSCREEN
REVIEW SOS
Burning sensation, erythema, itching
skin opd - 08202922276

ELECTROCAUTERY
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, local anesthesia was given with lignocaine (with/without adrenaline) (after a test dose)/ topical anesthesia with eutectic mixture of lignocaine and prilocaine was used on the site. Hyfrecation of the lesion was started at the lowest settings and gradually increased till lesions were removed. Procedure site bleeding was controlled. Post procedure instructions like topical antibiotics and sun protection advice were provided.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
Burning sensation, erythema, itching
skin opd - 08202922276

RADIOFREQUENCY CAUTERY
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions, local anesthesia was given with lignocaine (with/without adrenaline) (after a test dose)/ topical anesthesia with eutectic mixture of lignocaine and prilocaine was used on the site. Radiofrequency was started at the lowest settings at the cut/ coagulate mode and gradually increased till lesions were removed. Post procedure instructions like topical antibiotics and sun protection advice were provided.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:

CRYOTHERAPY:
Procedure details were explained to the patient. Written informed consent was taken.
The  patient was seated in a room with fan off. The affected area was soaked in water at room temperature for 10-15 minutes. Paring of the lesion was done. Cryospray with liquid nitrogen at -196* Celsius was administered to the lesions with long nozzle of suitable diameter.  2 sprays of 15 secs were given. White frosting was achieved on and 2 mm around the lesion. The patient tolerated the procedure well. Patient was counselled about chance for blistering or erosion, and was prescribed topical antibiotic cream.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice

PODOPHYLLIN APPLICATION
Procedure details were explained to the patient. Written informed consent was taken.
Patient was made to lie in supine position with legs flexed and apart. Genitalia was exposed. With a cotton swab , Vaseline was applied around the lesions taking care not to cover the edges of the lesion. Podophyllotoxin/Podophyllin in tincture benzoin was applied with blunt end of a tooth pick, only to the lesions. The patient lay for 10 minutes after procedure . The area was cleaned with soap and water after   6 hours.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
To review after one week for re evaluation and repeat procedure.

LASER
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned and under aseptic precautions.
DIODE LASER TREATMENT GIVEN.
Patient was observed for few hours for any discomfort, erythema. Patient is fit for discharge and is discharged with the following advice:
PHOTOTOPROTECTION WITH SUNSCREEN
ERYTHEMA, ITCHING, CRUSTING, BLISTERING
SKIN OPD- 08202922276

PHOTOTHERAPY BATH PUVA:
Procedure details were explained to the patient. Written informed consent was taken.
To 133 litres of water in the tub 50 ml 8-methoxypsoralen was  added so as to obtain a concentration of 3.75 ml per litre. The patient was asked to immerse  himself/herself  in the tub for 10 minutes in supine and 10 minutes in prone position. The patient was asked to gently agitate the water while soaking. After 20 minutes of soaking patient was asked to pat dry the skin and  immediately exposed to UVA in whole body phototherapy chamber. The eyes were protected using photo-protective glasses and genitals with undergarments.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: Continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

PHOTOTHERAPY HAND AND FEET:
Procedure details were explained to the patient. Written informed consent was taken.
To 4 litres of water in the tub 1.5 ml 8-methoxypsoralen was  added so as to obtain a concentration of 3.75 ml per litre. The patient was asked to immerse  hands and feet in the  for 10 mins. The patient was asked to gently agitate the water while soaking. After 20 minutes of soaking patient was asked to pat dry the skin and  immediately exposed to UVA in hand and foot UVA  therapy machine.
Patient was observed for few hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

BATH PUVA- LOW DOSE LOW CONCENTRATION
Procedure details were explained to the patient. Written informed consent was taken.
To 100 liters of water in the tub 25 ml 8-methoxypsoralen was added so as to obtain a concentration of 2.5 ml per liter. . The patient immersed himself/herself  in the tub for 10 minutes in supine and 10 minutes in prone position. The patient was asked to gently agitate the water while soaking. After 20 minutes of soaking patient was asked to pat dry the skin and immediately exposed to UVA in whole body phototherapy chamber. The eyes were protected using photo-protective glasses and genitals with undergarments. After completion of treatment the patient was advised regarding avoiding excessive sun exposure for the rest of the day and the  next appointment was given.
Patient was observed for few hours for any discomfort or erythema.
Patient is fit for discharge and is discharged with the following advice:  : Continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

SOAK PUVA
Procedure details were explained to the patient. Written informed consent was taken.
To 4 liters water in a plastic tub 2 ml of 8-methoxypsoralen was added to obtain a concentration of 3.75 mg per liter. The hands/feet  were dipped for 20 minutes.  Then  pat dried and  exposed to UVA in the hand and foot unit. After completion the patient was advised regarding further treatment and the next appointment. Patient is fit for discharge and is discharged with the following advice:   continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

Turban PUVA
Patient was explained about the procedure. In 2 litres of water, 2ml melanocyl solution was added. Then a cloth was dipped in the solution and sqeezed and was tied around the head as turban for 5 mins, the cycle was repeated for 4 times. Then the affected area was exposed to UV light. Patient tolerated well and procedure was uneventful.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

NB UVB
Procedure details were explained to the patient. Written informed consent was taken.
The narrow band chamber was switched on for few minutes. The time for administering the   dose of NBUVB was  calculated using the chart and   entered in the chamber panel. The patient was asked to stand at the centre of the chamber on a wooden elevation. The required dose of NBUVB was administered. The eyes and genitals were protected. After completion of treatment the patient was advised regarding avoiding excessive sun exposure for the rest of the day and the  next appointment was given.
Patient was observed for few hours for any discomfort.
Patient is fit for discharge and is discharged with the following advice:
Continue topical and oral medications, avoid intense direct sun exposure, to come for next treatment after 2 days.
ERTYHEMA, ITCHING, BLISTERING
SKIN OPD - 08202922276

Patch Test:
Procedure details were explained to the patient. Written informed consent was taken.
The upper back is shaved and cleaned. Patch testing was done by application of Finn chamber using the Indian Standard Series (ISS) of 20 antigens on either side of the spine over the upper back.
The patient was advised to minimise movement , avoid dislodging the patch test applied and readings taken on day 24, day 48, day 72.
The result was conveyed to the patient and further instructions given.
Patient is fit for discharge and is discharged with the following advice: avoid contact with……………………, continue topical and oral medication

PHOTO PATCH TEST:
Procedure details were explained to the patient. Written informed consent was taken.
The upper back is shaved and cleaned. Patch testing was done by application of Finn chamber using the Indian Standard Series (ISS) of 20 antigens in duplicate on either side of the spine over the upper back.
The patient  was advised to keep the area dry and avoid wetting the back.
After 24 h, the tapes were carefully removed and squares representing each chamber were marked using a marker pen. Readings were recorded after a gap of half an hour.
One side was then closed with an opaque black cloth and the other side was irradiated with 5-15 J/cmsq of UVA (?14).
A distance of 15 cm was kept between the patient's back and irradiation source.
Readings were then recorded after 48 h and 72 h.
After the procedure the patient was counselled regarding the result obtained.
Patient is fit for discharge and is discharged with the following advice: avoid sun exposure, exposure to …………….

Mini punch grafting for vitiligo:
Procedure details were explained to the patient. Written informed consent was taken.
He/she was counselled regarding the expected improvement and need for subsequent phototherapy, and the possible complications expected.
Under aseptic precautions, the area was infiltrated with local anesthetic.
Using a 2mm punch, recipient chambers were made very close to the border of the lesion at a distance of 0.5mm from each other.
The donor area (upper lateral portion of thigh or gluteal area) was painted and draped and punch impression were taken at close proximity to each other.
The grafts were placed directly from donor to the recipient areas.
Hemostasis was achieved.
Bactigras skin opd done.
Patient was counselled regarding care of graft and donor site and follow up after a week for removal of r and visualizing for graft take up.
Patient was observed for 24 hours for any discomfort, pain,  bleeding etc. Patient is fit for discharge and is discharged with the following advice: keep the area dry and to review after 7 days for removal of dressing

Nail avulsion: complete
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
Spatula/septum elevator was introduced under the nail plate at the level of hyponychium and pushed toward lunula.
The instrument was withdrawn and reintroduced in the adjoining region till the entire area to be avulsed was separated.
The separated nail plate was grasped with a hemostat and avulsed by twisting the hemostat around its long axis.
Pressure was applied white untying the tourniquet and hemostasis is achieved.
Dressing was done.
Patient was observed for 24 hours for any discomfort, pain bleeding etc. Patient is fit for discharge and is discharged with the following advice:   keep the area dry and to review after 2 days for removal of dressing

Longitudinal partial nail plate avulsion:
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
The part to be avulsed was split with a nail splitter till the distal most part of proximal nail fold.
Stevens’ scissor was introduced under the PNF with its blades closed.
The blades were opened and the part of nail plate under the PNF is sectioned.
The separated part of nail plate was grasped with a hemostat and avulsed by twisting the hemostat around its long axis.
Pressure was applied white untying the tourniquet and hemostasis achieved.
Dressing was done.
Patient was advised to keep the area dry and to review after 2 days for removal of dressing.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: keep the area dry and to review after 2 days for removal of dressing

Nail Plate Biopsy:
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
3-4 mm punch biopsy is taken from the nail plate.
Pressure is applied white untying the tourniquet and hemostasis is achieved.
Dressing is done.
Patient was advised to keep the area dry and to review after 2 days for removal of dressing.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice: keep the area dry and to review after 2 days for removal of dressing

Nail Bed Biopsy:
Procedure details were explained to the patient. Written informed consent was taken.
The area was cleaned and draped.
Distal digital block given using plain lidocaine 2%
Digital tourniquet was applied at the base of finger/toe.
Partial nail plate avulsion was performed.
A 3 mm punch was used to take the sample from the nail bed.
Pressure is applied white untying the tourniquet and hemostasis is achieved.
Dressing is done.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
Patient was advised to keep the area dry and to review after 2 days for removal of dressing, and to review after 2 weeks for biopsy report and formulate further treatment plan

Nail Matrix Biopsy.
Procedure details were explained to the patient. Written informed consent was taken.
Under aseptic precautions, after administering digital block, exsanguination, and tourniquet, the proximal nail fold was cut through and retracted and held back with the help of skin hooks
A 3mm punch biopsy was taken.
The retracted proximal nail fold was sutured in place.
Hemostasis was achieved.
Dressing was done.
Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:
Patient was advised to keep the area dry and to review after 2 days for removal of dressing, and to review after 2 weeks for biopsy report and formulate further treatment plan

Chemical matrixectomy:
Procedure details were explained to the patient. Written informed consent was taken.
Under aseptic precautions, the nail matrix was exposed. 88% saturated liquid phenol was applied with help of cotton tipped tooth-pick for 1 minute over the nail matrix.
Patient tolerated the procedure well. Patient was observed for 24 hours for any discomfort, bleeding etc. Patient is fit for discharge and is discharged with the following advice:

SKIN SCRAPING AND KOH MOUNT
Procedure details were explained to the patient. Written informed consent was taken. The area of procedure was cleaned with alcohol swab and a 11 number blade was used to collect scales from the area and was transferred onto a glass slide. Around 2-3 drops of 10% KOH was poured over the scales and a cover slip was put on it. The slide was heated using a bunsen burner and then was viewed under the microscope to look for fungal hyphae. Patient tolerated the procedure well, no immediate post procedure complications seen and was advised to review in OPD with the report.

SLIT SKIN SMEAR
Procedure details were explained to the patient. Written informed consent was taken. The sites were first cleaned with ether. The site was pinched between thumb and forefinger to drive out blood, a slit of size 5mm long and 3mm depth was made using a 15 no. bard parker blade. The tissue fluid and pulp was collected and smeared onto the slide. The slide was covered with carbol fuchsin and heat was applied beneath it using bunsen burner so that steam rises from all parts of the slide and was left for 15 minutes without any further heating. Stain was tipped and slide was washed under gentle stream of water. Acid alcohol mixture was then applied, kept for 5 seconds and then was washed. This was followed by adding 1 % methylene blue on the slide for 30 seconds and then washing it. The slide was then viewed under the oil immersion microscope to look for any acid fast bacilli and bacteriological and morphological index was calculated accordingly. Patient tolerated the procedure well and was advised to review in OPD with the report.

PUS C/S
Procedure details were explained to the patient. Written informed consent was taken. The affected site was cleaned with normal saline first, then using 2 cotton swabs, 2 samples of pus were collected separately and was sent for culture. The patient was asked to review in skin OPD after the report.

SWAB FOR HSV PCR
Procedure details were explained to the patient. Written informed consent was taken. The affected site was cleaned with normal saline first, then using 2 cotton swabs, 2 samples were collected separately and was sent in appropriate medium (viral transport medium). The patient was asked to review in skin OPD after the report.

GRAM STAINING
Procedure details were explained to the patient. Written informed consent was taken. Sample was collected from the affected site and smeared onto a slide. Crystal violet stain was added over the slide and kept for 1 minute. Then gram’s iodine solution was added to the smear for 1 minute and washed off with water. A few drops of decolorizer was added and rinsed off with running water. Lastly the smear was counterstained with safranin solution for 1 minute, washed off with water, air dried and  viewed under oil immersion microscope. The patient was asked to review in skin OPD with the reports.

Tzanck smear
Procedure details were explained to the patient. Written informed consent was taken. The vesicle/bulla was gently deroofed and then the base of the lesion was scraped using a back of the scalpel blade. The sample was smeared onto a slide and air dried. Giemsa stain was poured over the slide. After 15 minutes, the slide was washed with sterile water and viewed under the microscope. The patient was asked to review in skin OPD with the reports.

Nail Clipping for KOH mount
Procedure details were explained to the patient. Written informed consent was taken. Affected nails were first cleaned with normal saline to remove contaminants and clipped short using standard nail clippers. Specimen was placed on a slide, and a drop of 20% KOH was added. A cover slip was applied with gentle pressure to drain away excess KOH and heated over a Bunsen burner. Incubation was done for 2 h or more (up to 48 h) until softening or digestion of the specimen occurred. Slides were microscopically evaluated to look for fungal elements. The patient was asked to review in skin OPD with the reports.

PRF Dressing
Procedure details were explained to the patient. Written informed consent was taken after which the lesion was cleaned with betadine and normal saline. PRF prepared under sterile condition using standard parameters was taken and made into smaller pieces which were laid over the wound. A dressing was done with gauze and a roller gauze. Patient tolerated the procedure well and was advised to come back for the next dressing after 1 week.

Cleaning and Betadine Dressing
Procedure details were explained to the patient. Written informed consent was taken after which the lesion was cleaned with normal saline followed by betadine. An antibiotic ointment was applied and a dressing using gauze and roller gauze was done. Patient tolerated the procedure well and was advised to come back for the next dressing.

Biologics injection
Procedure details were explained to the patient. Written informed consent was taken. The injection was taken out of the refrigerator and kept at room temperature for 30 min. The injection site was cleaned with alcohol swab and under aseptic precautions, Subcutaneous Injection of --------- was given.
Patient was observed for next 2 hours for any side effects. Patient tolerated the procedure well and vitals were stable following the injection. Patient is being discharged with the following advice.
    `
                const table = data.split('\n\n')
                function findMostMatches(inputString, stringArray) {
                    var lines = inputString.split("\n");
                    var bestMatch = "";

                    for (var k = 0; k < lines.length; k++) {
                        var line = lines[k];
                        var inputWords = line.split(" ");
                        var maxMatches = 0;
                        var output = ''
                        for (var i = 0; i < stringArray.length; i++) {
                            var matchCount = 0;
                            for (var j = 0; j < inputWords.length; j++) {
                                if (stringArray[i].toLowerCase().includes(inputWords[j].toLowerCase())) {
                                    matchCount++;
                                }
                            }
                            if (matchCount > maxMatches) {
                                maxMatches = matchCount;
                                bestMatch = stringArray[i];
                            }
                        }
                        output += bestMatch;

                    }
                    return output;
                }



                var therapy = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                if (therapy.value == ''){
                    if (investigate == ''){
                        var invest = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate')
                        invest.value = 'Please enter investigative procedures to obtain therapeutic procedure details directly. Make sure to put separate procedures in different lines to get details for both at once. Refresh the page and try it now!';
                    }else{
                        var investigations = investigate.split('\n');
                        for (var i = 0; i < investigations.length; i++) {
                            var result = findMostMatches(investigations[i], table);
                            therapy.value += result + '\n';
                        }
                    }
                }

                if (icu.value == '') {
                    icu.value = 'NA';
                }
                if (contact.value == '') {
                    contact.value = 'SKIN OPD - 08202922276';
                }
                if (unit == 'SKN001') {
                    docname.value = 'DR. SATHISH PAI';
                    desig.value = 'PROFESSOR AND HOU';
                    unitfull.value = 'DERMATOLOGY UNIT 1';
                    select.selectedIndex = 2;
                }
                if (unit == 'SKN002') {
                    docname.value = 'DR. RAGHAVENDRA RAO';
                    desig.value = 'PROFESSOR AND HOD';
                    unitfull.value = 'DERMATOLOGY UNIT 2';
                    select.selectedIndex = 1;
                }
                if (condition.value == ''){
                    condition.value = 'Stable';
                }
            }

            else if (unitname == 'ENT' || unitname == 'HNS') {
                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;

                if (physicalExam.value == '') {
                    physicalExam.value = `Patient was conscious, cooperative, well oriented to time, place and person. Well built and well nourished.
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema, koilonychia.
PR - 72bpm; BP - 120/80mmHg; RR - 16/min; GCS - 15/15; SpO2- 99% on RA, Afebrile.
EXAMINATION OF EAR :                RIGHT                                 LEFT
Pre-auricular region:                        Normal                               Normal
Pinna:                                              Normal                               Normal
Post auricular region:                      Normal                               Normal
Tragal tenderness:                          Normal                               Normal
Mastoid tenderness:                       Absent                                Absent
External auditory canal:                  Normal                               Normal
Tympanic membrane:                     Normal                               Normal
MEM:                                               Moist                                   Moist
Facial nerve:                            Clinically intact                    Clinically intact
Fistula sign:                                    Negative                           Negative
TUNING FORK TESTS :
Rinne's                                           RIGHT                                       LEFT
256 Hz                                                +                                               +
512 Hz                                                +                                               +
1024 Hz                                              +                                               +
Weber's: Bilaterally same
ABC: Bilaterally same as compared to examiner

EXAMINATION OF NOSE
Skin over nose: Normal
Ala, columella, vestibule: Normal
Cold Spatula test: Bilaterally equal fogging on both sides
ANTERIOR RHINOSCOPY :    RIGHT            LEFT
Septum: Central
Inferior Turbinate:                    Normal            Normal
Inferior Meatus:                       Normal            Normal
Middle Turbinate:                     Normal           Normal
Middle Meatus:                        Normal           Normal
PNS tenderness - Absent

EXAMINATION OF ORAL CAVITY/OROPHARYNX :
Adequate mouth opening
Orodental hygiene - Fair
Lips, tongue, teeth - Normal
Buccal mucosa - Normal
No crowding of teeth.
Gums, gingiva, retromolar trigone - Normal
Tonsils - Normal
Uvula, hard palate - Normal
PPW - Clear
ILS - Bilateral VC mobile

EXAMINATION OF NECK:
Skin intact, no swelling, scars or sinuses.
Trachea central.
External laryngeal framework normal.
Bilateral carotid pulsations present.

SYSTEMIC EXAMINATION:
RS: Chest movements equal in all areas with respiration. Normal bilateral vesicular breath sounds heard. No added sounds.
CVS:S1, S2 heard. No added sounds. No murmurs.
GI: Soft, non-tender. No organomegaly. Bowel sounds present
CNS: Higher mental functions normal. No focal neurological deficits`
                }

                if (pastHistoryFin.value == '') {
                    pastHistoryFin.value = 'No history of any comorbidities or previous surgeries';
                }
                if (icuStay.value == '') {
                    icuStay.value = 'NA';
                }
                if (contactDeets.value == '') {
                    contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
                }
                if (hodNameFin.value == '') {
                    hodNameFin.value = hodName;
                }
                if (designationProper.value == '') {
                    if (unitnum == 'ENT001') {
                        designationProper.value = 'Professor and Head of Department';
                    }else {
                        designationProper.value = 'Head of Unit';
                    }
                }
                if (unitNameFin.value == '') {
                    unitNameFin.value = unitnum;
                }
                if (diet.value == '') {
                    diet.value = 'Normal diet.';
                }
                if (adviceDischarge.value == '') {
                    if (adviceDischarge.value == '') {
                        if (unitnum == 'ENT001') {
                            adviceDischarge.value = 'To review in ENT 1 OPD on MONDAY/THURSDAY.';
                        }
                        if (unitnum == 'ENT002') {
                            adviceDischarge.value = 'To review in ENT 2 OPD on TUESDAY/FRIDAY.';
                        }
                        if (unitnum == 'HNS001') {
                            adviceDischarge.value = 'To review in HNS 1 OPD on WEDNESDAY/SATURDAY.';
                        }
                    }
                }
                if (therapeutic.value == '') {
                    therapeutic.value = 'Medical management.';
                }
                if (condition.value == ''){
                    condition.value = 'Stable';
                }
            }

            else if (unitname == 'ORT' || unitname == 'POR') {
                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                var finDig = document.getElementById('ctl00_ContentPlaceHolder1_txtfinal');
                var course = document.getElementById('ctl00_ContentPlaceHolder1_txttreat');
                var gen = document.getElementById('ctl00_ContentPlaceHolder1_txtsex');
                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;

                if (physicalExam.value == '') {
                    physicalExam.value = `Patient was conscious, cooperative, well oriented to time, place and person. Moderately built and well-nourished.
PR - 72BPM
BP - 120/70mmHg
RR - 16CPM
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema, koilonychia.
Afebrile
GCS - 15/15

RS:
Trachea central
Chest movements equal in all areas with respiration
Normal bilateral vesicular breath sounds heard
No added sounds.

CVS:
S1, S2 heard.
Apical impulse 5th ICS medial to left midclavicular line.
No added sounds
No murmurs.

Per Abdomen:
Soft, non-tender. No organomegaly.
No fluid thrill/shifting dullness
Bowel sounds present

CNS:
Higher mental functions normal.
No focal neurological deficits.

Local Examination:
`
                }

                if (pastHistoryFin.value == '') {
                    pastHistoryFin.value = 'Nil premorbid';
                }
                if (icuStay.value == '') {
                    icuStay.value = 'NA';
                }
                if (contactDeets.value == '') {
                    contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
                }
                if (hodNameFin.value == '') {
                    hodNameFin.value = hodName;
                }
                if (designationProper.value == '') {
                    designationProper.value = 'Professor and Head of Unit';
                }
                if (unitNameFin.value == '') {
                    unitNameFin.value = unitnum.replace('POR001', 'Pediatric Ortho');
                }
                if (course.value == ''){
                    if (gen.value == 'M'){
                        course.value = 'The patient presented with the above mentioned complaints and was evaluated. He was clinico-radiologically diagnosed as ' + finDig.value + '. He underwent ' + therapeutic.value + ' on _. Post-op period was uneventful. He is symptomatically better and is being discharged with the following advice.'
                    }else{
                        course.value = 'The patient presented with the above mentioned complaints and was evaluated. She was clinico-radiologically diagnosed as ' + finDig.value + '. She underwent ' + therapeutic.value + ' on _. Post-op period was uneventful. She is symptomatically better and is being discharged with the following advice.'
                    }
                }
                if (diet.value == '') {
                    diet.value = 'Balanced diet.';
                }
                if (adviceDischarge.value == '') {
                    if (adviceDischarge.value == '') {
                        adviceDischarge.value = 'Maintain personal hygiene\nDressing care\nReview in ' + unitnum.replace('POR001', 'Pediatric Ortho').replace('ORT00', 'Ortho ') + ' OPD on for follow up.';
                    }
                }
                if (therapeutic.value == '') {
                    therapeutic.value = 'Medical management.';
                }
                if (condition.value == ''){
                    condition.value = 'Stable and afebrile';
                }
            }

            else{
                var physicalExam = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
                var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
                var icuStay = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
                var contactDeets = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
                var hodNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
                var designationProper = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
                var unitNameFin = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
                var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
                var adviceDischarge = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
                var therapeutic = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
                var condition = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
                var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
                radio.checked = true;
                var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
                select.selectedIndex = 1;

                if (physicalExam.value == '') {
                    if (unitname == 'SUR') {
                        physicalExam.value = `Patient was conscious, cooperative, well oriented to time, place and person. Moderately built and well-nourished.
PR - 72BPM
BP - 120/70mmHg
RR - 16CPM
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema, koilonychia.
Afebrile
GCS - 15/15

RS:
Trachea central
Chest movements equal in all areas with respiration
Normal bilateral vesicular breath sounds heard
No added sounds.

CVS:
S1, S2 heard.
Apical impulse 5th ICS medial to left midclavicular line.
No added sounds
No murmurs.

Per Abdomen:
Soft, non-tender. No organomegaly.
No fluid thrill/shifting dullness
Bowel sounds present

CNS:
Higher mental functions normal.
No focal neurological deficits.`
                    }else{
                        physicalExam.value = `Patient was conscious, cooperative, well oriented to time, place and person. Moderately built and well-nourished.
PR - 72BPM
BP - 120/70mmHg
RR - 16CPM
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema, koilonychia.
Afebrile
GCS - 15/15

RS:
Trachea central
Chest movements equal in all areas with respiration
Normal bilateral vesicular breath sounds heard
No added sounds.

CVS:
S1, S2 heard.
Apical impulse 5th ICS medial to left midclavicular line.
No added sounds
No murmurs.

GI:
Soft, non-tender. No organomegaly.
No fluid thrill/shifting dullness
Bowel sounds present

CNS:
Higher mental functions normal.
No focal neurological deficits.`
                    }
                }

                if (pastHistoryFin.value == '') {
                    pastHistoryFin.value = 'Nil premorbid';
                }
                if (icuStay.value == '') {
                    icuStay.value = 'NA';
                }
                if (contactDeets.value == '') {
                    try{
                        contactDeets.value = phonenum.replaceAll('NEXTLINE', '\n');
                    }catch(err){
                        null;
                    }
                }
                if (hodNameFin.value == '') {
                    hodNameFin.value = hodName;
                }
                if (designationProper.value == '') {
                    designationProper.value = 'Head of Unit';
                }
                if (unitNameFin.value == '') {
                    unitNameFin.value = unitnum;
                }
                if (diet.value == '') {
                    if (unitname == 'SUR') {
                        diet.value = 'Normal diet.';
                    }else{
                        diet.value = 'Low salt, low fat, low cholesterol diet.';
                    }
                }
                if (adviceDischarge.value == '') {
                    adviceDischarge.value = 'Review after _ weeks with _.';
                }
                if (therapeutic.value == '') {
                    if (unitname == 'SUR') {
                        therapeutic.value = 'Surgical management.';
                    }else{
                        therapeutic.value = 'Medical management.';
                    }
                }
                if (condition.value == ''){
                    condition.value = 'Stable';
                }

            }
            if(document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value.length<1){
                document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = 'Adding Date'
                document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
            }});



        // Open a link when the button is clicked
        linkbutton.addEventListener('click', function() {
            var linkhtml = "https://mahepacs.manipal.edu/HIS/viewImages?mrn=MRDNUM&user=ramsoft_phy&timestamp=2025-06-26%2012:27:34&siteUniqueId=KH"
            var newlink = linkhtml.replace('MRDNUM', hospno.substr(1))
            window.open(newlink, '_blank');
        });

        // Add normal echo findings when the button is clicked
        echo.addEventListener('click', function() {
            var investigate = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate');
            var investigateecho = investigate.value + `

Echo done on _
Normal biventricular systolic function
No RWMA
No diastolic dysfunction
No SAM/LVOTO
Trivial MR
Aorta trileaflets, No AS/AR
No TR, pulmonary HTN
Left arch, no CoA
No visible clot/pericardial effusion/vegetation
`;
            investigate.value = investigateecho
        });

        // Add normal CNS findings when the button is clicked
        cns.addEventListener('click', function() {
            var physical = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
            var unit = document.getElementById('ctl00_Label2');
            var unitnum = unit.textContent.replace('Unit : ','');
            var unitname = unitnum.substring(0, 3)
            if(unitname == 'PED'){
                var physicalval = physical.value + `
Cranial nerves:
3, 4, 6 - Bilateral light reflex present
No squint
No nystagmus
EOM present
Normal facial sensations
No facial asymmetry
Normal hearing
9 - Gag present
10 - Uvula in midline
11 - Shrugging present
12 - No tongue deviation

Motor system:
                              Upper Limb                  Lower Limb
                                 R                  L                 R                  L
Nutrition                Normal        Normal        Normal         Normal
Tone                      Normal        Normal        Normal         Normal
Power                     5/5                5/5               5/5                5/5
Coordination            +                   +                  +                   +
Involuntary movements      -             -             -              -

Sensory system:
                              Upper Limb                  Lower Limb
                                  R                 L                 R                   L
Touch                    Normal        Normal        Normal         Normal
Temperature         Normal        Normal        Normal         Normal
Pain                      Normal        Normal        Normal         Normal
Vibration               Normal        Normal        Normal         Normal
Position                Normal        Normal        Normal         Normal

Reflexes:
                                   R                 L                  R                  L
Superficial              Normal        Normal        Normal         Normal
Corneal                  Normal        Normal        Normal         Normal
Conjunctival           Normal        Normal        Normal         Normal
Abdominal             Normal        Normal        Normal         Normal
Cremasteric          Normal        Normal        Normal         Normal
Plantar                  Normal        Normal        Normal         Normal

Deep Reflexes:
                           R              L              R             L
Biceps                2+            2+             2+            2+
Triceps               2+            2+             2+            2+
Supinator           2+            2+             2+            2+
Knee                  2+            2+             2+            2+
Ankle                 2+            2+             2+            2+

Visceral reflexes:
Bladder: Normal
Bowel: Normal
Gait: Normal
Skull and Spine: Normal
Meningeal Signs: Normal
Cerebellar Signs: Normal
`;

                physical.value = physicalval
            }
            else{
                var physicalval = physical.value + `
Cranial Nerves:
CN I - Sense of smell intact
CN II - Visual acuity and field intact
CN III, IV, VI - Pupillary reaction normal and extraocular movements are symmetric and normal
CN V - Sensation intact in face, patient can clench jaw
CN VII - No facial deviation.
CN VIII - Hearing intact. No issues in balance and coordination
CN IX, X - Patient can swallow and speak normally. No deviation of uvula. Gag reflex present.
CN XI - Normal shoulder shrug.
CN XII - Tongue appears midline. Normal movement of tongue.

Motor:
Tone:        R       L
Upper Limb   N       N
Lower Limb   N       N

Power:       R       L
Upper Limb  5/5     5/5
Lower Limb  5/5     5/5

Reflexes:    R       L
Biceps      +2      +2
Triceps     +2      +2
Supinator   +2      +2
Knee        +2      +2
Ankle       +2      +2
Plantar   Flexor  Flexor

Sensory:
Pain, Touch, Temperature - Intact
Cortical Sensations - Normal

Cerebellar Signs: No nystagmus or tremors

No signs of meningeal irritation`;

                physical.value = physicalval
            }});

        var LES = document.createElement('button');
        LES.innerHTML = 'Local Examination Synthesizer';

        if (unitname == 'SUR' || unitname == 'PLS'  || unitname == 'PDS'  || unitname == 'GIS' ) {
            LES.style.position = 'fixed';
            LES.style.bottom = '40px';
            LES.style.right = '10px';
            document.body.appendChild(LES);
        }

        if (unitnum == 'PED4IB' || unitnum == 'PED4OB' || unitnum == 'NEOI') {
            var motherDeets = document.createElement('button');
            motherDeets.innerHTML = 'Add Mother Details';
            motherDeets.style.position = 'fixed';
            motherDeets.style.top = '220px';
            motherDeets.style.right = '10px';
            document.body.appendChild(motherDeets);

            motherDeets.addEventListener('click', function(){
                var hosp = prompt("Enter mother's hospital number");
                window.open('http://khapps.manipal.edu/dischsum/HospNoDischargeSummary.aspx?' + hosp, '_blank')
            })

            window.addEventListener('message', function(event){
                var deets = event.data
                var hopi = document.getElementById('ctl00_ContentPlaceHolder1_txtillness')
                var past = document.getElementById('ctl00_ContentPlaceHolder1_txthistory')
                if(hopi.value == ''){
                    hopi.value = deets.split('!!!')[0]
                }
                if(past.value == ''){
                    past.value = deets.split('!!!')[1]
                }
            })
        }

        if (unitname == 'OBS') {
            var LMPdate = ''
            var LMPdateBtn = document.createElement('button');
            LMPdateBtn.innerHTML = 'LMP Date Not Added - Click to Add';
            LMPdateBtn.style.position = 'fixed';
            LMPdateBtn.style.top = '250px';
            LMPdateBtn.style.right = '10px';
            document.body.appendChild(LMPdateBtn);

            var confirmScan = document.createElement('button');
            confirmScan.innerHTML = 'Confirmatory Scan done';
            confirmScan.style.position = 'fixed';
            confirmScan.style.top = '280px';
            confirmScan.style.right = '10px';
            document.body.appendChild(confirmScan);

            var ntScan = document.createElement('button');
            ntScan.innerHTML = 'NT Scan done';
            ntScan.style.position = 'fixed';
            ntScan.style.top = '310px';
            ntScan.style.right = '10px';
            document.body.appendChild(ntScan);

            var folic = document.createElement('button');
            folic.innerHTML = 'Folic Acid taken';
            folic.style.position = 'fixed';
            folic.style.top = '340px';
            folic.style.right = '10px';
            document.body.appendChild(folic);

            var dualTest = document.createElement('button');
            dualTest.innerHTML = 'Dual Test done';
            dualTest.style.position = 'fixed';
            dualTest.style.top = '370px';
            dualTest.style.right = '10px';
            document.body.appendChild(dualTest);

            var ICT = document.createElement('button');
            ICT.innerHTML = 'Iron Calcium Tetanus taken';
            ICT.style.position = 'fixed';
            ICT.style.top = '400px';
            ICT.style.right = '10px';
            document.body.appendChild(ICT);

            var anomaly = document.createElement('button');
            anomaly.innerHTML = 'Anomaly scan done';
            anomaly.style.position = 'fixed';
            anomaly.style.top = '430px';
            anomaly.style.right = '10px';
            document.body.appendChild(anomaly);

            var KH = document.createElement('button');
            KH.innerHTML = 'First KH visit';
            KH.style.position = 'fixed';
            KH.style.top = '460px';
            KH.style.right = '10px';
            document.body.appendChild(KH);

            var growthScan = document.createElement('button');
            growthScan.innerHTML = 'Growth scan done';
            growthScan.style.position = 'fixed';
            growthScan.style.top = '490px';
            growthScan.style.right = '10px';
            document.body.appendChild(growthScan);

            var finGrowthScan = document.createElement('button');
            finGrowthScan.innerHTML = 'Final growth scan done';
            finGrowthScan.style.position = 'fixed';
            finGrowthScan.style.top = '520px';
            finGrowthScan.style.right = '10px';
            document.body.appendChild(finGrowthScan);

            var closingLines = document.createElement('button');
            closingLines.innerHTML = 'Closing Lines';
            closingLines.style.position = 'fixed';
            closingLines.style.top = '550px';
            closingLines.style.right = '10px';
            document.body.appendChild(closingLines);

            LMPdateBtn.addEventListener('click', function(){
                LMPdate = prompt('Add LMP date', 'dd/mm/yy')
                var LMPdateTrue = new Date(LMPdate.substring(3,5) + '/' + LMPdate.substring(0,2) + '/20' + LMPdate.substring(6,8))
                while (LMPdateTrue == 'Invalid Date'){
                    var LMPdate = prompt('LMP Date invalid, please ensure the date format is dd/mm/yy', 'dd/mm/yy')
                    var LMPdateTrue = new Date(LMPdate.substring(3,5) + '/' + LMPdate.substring(0,2) + '/20' + LMPdate.substring(6,8))
                    }
                LMPdateBtn.innerHTML = 'LMP Date - ' + LMPdate;
            })

            try {
                var pastHist = document.getElementById('ctl00_ContentPlaceHolder1_txthistory').value
                var LMP = pastHist.split('LMP: ')[1].split('\n')[0]
                if (LMP.length == 10){
                    LMPdate = LMP.substring(0, 6) + LMP.substring(8,10)
                    LMPdateBtn.innerHTML = 'LMP Date - ' + LMPdate;
                }
            }
            catch(err) {
                null;
            }

            function gestation(newDate){
                if(newDate == null || newDate == 'dd/mm/yy'){
                    var POGman = prompt('Enter POG', 'xWxD')
                    function addDays(date, days) {
                        const dateCopy = new Date(date);
                        dateCopy.setDate(date.getDate() + days);
                        return dateCopy;
                    }
                    var W = POGman.toLowerCase().split('w')[0]
                    if (POGman.length<3){
                        var D = 0
                        }else{
                            var D = POGman.toLowerCase().split('w')[1].split('d')[0]
                            }
                    var DOAproper = LMPdate.substring(3,5) + '/' + LMPdate.substring(0,2) + '/20' + LMPdate.substring(6,10)
                    var daysAdded = parseInt(W*7) + parseInt(D)
                    var testDate = addDays(new Date(DOAproper), daysAdded)
                    return [testDate.toLocaleDateString('en-GB'), POGman.toUpperCase()]
                }
                var DOAproper = LMPdate.substring(3,5) + '/' + LMPdate.substring(0,2) + '/' + LMPdate.substring(6,10)
                var DOAdate = new Date(DOAproper)
                var date = newDate.substring(3,5) + '/' + newDate.substring(0,2) + '/20' + newDate.substring(6,8)
                var dateProper = new Date(date)
                const diffTime = Math.abs(dateProper - DOAdate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                var weeks = Math.floor(diffDays/7)
                var days = diffDays - weeks * 7
                var POGdate = weeks + 'W' + days + 'D'
                return [newDate, POGdate.replace('0D', '')]
            }

            var HOPI = document.getElementById('ctl00_ContentPlaceHolder1_txtillness');

            confirmScan.addEventListener('click', function(){
                var when = prompt('When?', 'dd/mm/yy')
                var pogFin = gestation(when)
                var CRL = prompt('CRL (in mm)')
                var CRLcm = CRL/10
                var CRLdays = Math.exp(1.684969 + (0.315646 * CRLcm) - (0.049306 * Math.pow(CRLcm, 2)) + (0.004057 * Math.pow(CRLcm, 3)) - (0.000120456 * Math.pow(CRLcm, 4)))
                var CRLweeks = Math.floor(CRLdays)
                var remDays = Math.round((CRLdays - CRLweeks) * 7)
                var CRLPOG = CRLweeks + 'W' + remDays + 'D'
                HOPI.value += 'Confirmatory scan done on ' + pogFin[0] + ' at ' + pogFin[1] + ' of gestation, CRL = ' + CRL + 'mm corresponding to ~' + CRLPOG + ' of gestation. '
            })

            ntScan.addEventListener('click', function(){
                var when = prompt('When?', 'dd/mm/yy')
                var pogFin = gestation(when)
                var NT = prompt('NT')
                var placenta = prompt('Placenta position?', 'anterior')
                var finalText = 'NT scan done on ' + pogFin[0] + ' at ' + pogFin[1] + ' of gestation, NT = ' + NT + ', NB+, placenta - ' + placenta + '. '
                HOPI.value += finalText.replace(', NT = , ', ', ').replace(', placenta - .', '.')
            })

            folic.addEventListener('click', function(){
                HOPI.value += 'Started on tablet folic acid supplementation. '
            })

            dualTest.addEventListener('click', function(){
                HOPI.value += 'Dual test done - showed low risk. '
            })

            ICT.addEventListener('click', function(){
                HOPI.value += 'Started on tablet iron and calcium supplementation. 2 doses TT taken. '
            })

            anomaly.addEventListener('click', function(){
                var when = prompt('When?', 'dd/mm/yy')
                var pogFin = gestation(when)
                var placenta = prompt('Placenta position?', 'anterior')
                var AFI = prompt('AFI')
                var finalText = 'Anomaly scan done on ' + pogFin[0] + ' at ' + pogFin[1] + ' of gestation, placenta - ' + placenta + ', AFI - ' + AFI + '. No gross anomalies noted. '
                HOPI.value += finalText.replace(', placenta - , ', ', ').replace(', AFI - .', '.')
            })

            KH.addEventListener('click', function(){
                var when = prompt('When?', 'dd/mm/yy')
                var pogFin = gestation(when)
                HOPI.value += 'First KH visit on ' + pogFin[0] + ' at ' + pogFin[1] + ' of gestation. '
            })

            growthScan.addEventListener('click', function(){
                var when = prompt('When?', 'dd/mm/yy')
                var pogFin = gestation(when)
                var lie = prompt('Presentation?', 'cephalic')
                var placenta = prompt('Placenta position?', 'anterior')
                var AFI = prompt('AFI?')
                var EFW = prompt('EFW?', '')
                var EFWcorr = prompt('EFW corresponds to what ()%?', '')
                var finalText = 'Growth scan done on ' + pogFin[0] + ' at ' + pogFin[1] + ' of gestation, presentation - ' + lie + ', placenta - ' + placenta + ', AFI - ' + AFI + ', EFW - ' + EFW + 'g (' + EFWcorr +'%).'.replace(' ().', '.').replace(', presentation - , ', ',').replace(', placenta - , ', ', ').replace(', AFI - , ', ', ').replace(', EFW - g.', '.').replace('(%) .', '.')
                HOPI.value += finalText.replace(', presentation - , ', ', ').replace(', placenta - , ', ', ').replace(', AFI - , ', ', ').replace(', EFW - g.', '').replace(' (%).', '.')
            })

            finGrowthScan.addEventListener('click', function(){
                var when = prompt('When?', 'dd/mm/yy')
                var pogFin = gestation(when)
                var lie = prompt('Presentation?', 'cephalic')
                var placenta = prompt('Placenta position?', 'anterior')
                var AFI = prompt('AFI?')
                var EFW = prompt('EFW?', '')
                var EFWcorr = prompt('EFW corresponds to what ()%?', '')
                var finalText = 'Last growth scan done on ' + pogFin[0] + ' at ' + pogFin[1] + ' of gestation, presentation - ' + lie + ', placenta - ' + placenta + ', AFI - ' + AFI + ', EFW - ' + EFW + 'g (' + EFWcorr + '%).'
                HOPI.value += finalText.replace(', presentation - , ', ', ').replace(', placenta - , ', ', ').replace(', AFI - , ', ', ').replace(', EFW - g.', '').replace(' (%).', '.')
                var investigateVal = document.getElementById('ctl00_ContentPlaceHolder1_txtinvestigate')
                investigateVal.value += finalText.replace(', presentation - , ', ',').replace(', placenta - , ', ', ').replace(', AFI - , ', ', ').replace(', EFW - g.', '').replace(' (%).', '.')
            })

            closingLines.addEventListener('click', function(){
                HOPI.value += 'Appreciates fetal movements well. No h/o high BP recordings, deranged sugars. No c/o bleeding PV or leaking PV. No c/o pain abdomen or abdominal tightening. No c/o burning micturition.'
            })
        }


        // Open a link when the button is clicked
        linkemr.addEventListener('click', function() {
            var emrlink = "http://patemr.manipal.edu/E-REGISTERS_EMR/MergedPage_EMR_expandondemand.aspx?hno=0MRDNUM&typ=O"
            var openlink = emrlink.replace('MRDNUM', hospno.substr(1))
            window.open(openlink, '_blank');
        });

        // Dropdown menu HTML
        var dropdownMenu = document.createElement('div');
        dropdownMenu.style.position = 'fixed';
        dropdownMenu.style.bottom = '70px';
        dropdownMenu.style.right = '10px';
        dropdownMenu.style.display = 'none';
        dropdownMenu.innerHTML = `
<select id="dropdown">
<option value="option1">-- Select Option --</option>
<option value="Wound">Wound</option>
<option value="Swelling">Swelling</option>
</select>
<div id="questions" style="display: none;"></div>
<button id="generateBtn" style="display: none;">Generate</button>
`;
        document.body.appendChild(dropdownMenu);

        // Checkbox popup HTML
        var popup = document.createElement('div');
        popup.style.display = 'none';
        popup.style.position = 'fixed';
        popup.style.bottom = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, 50%)';
        popup.style.backgroundColor = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '10px';
        popup.innerHTML = `
<label><input type="checkbox" id="checkbox1"> Insidious onset</label><br>
<label><input type="checkbox" id="checkbox2"> Gradually progressive</label><br>
<label><input type="checkbox" id="temp"> Local rise of temperature</label><br>
<label><input type="checkbox" id="checkbox3"> Tenderness</label><br>
<label><input type="checkbox" id="checkbox4"> Cough impulse</label><br>
<label><input type="checkbox" id="checkbox5"> Positional variation</label><br>
<label><input type="checkbox" id="checkbox6"> Vomiting</label><br>
<label><input type="checkbox" id="checkbox7"> Constipation</label><br>
<label><input type="checkbox" id="checkbox8"> Obstipation</label><br>
<label><input type="checkbox" id="checkbox9"> Abdominal Distention</label><br>
<label><input type="checkbox" id="checkbox10"> Hypertension</label><br>
<label><input type="checkbox" id="checkbox11"> T2DM</label><br>
<button id="confirmBtn">Confirm</button>
`;
        document.body.appendChild(popup);

        // Create event listeners
        LES.addEventListener('click', function() {
            dropdownMenu.style.display = 'block';
        });

        var dropdown = document.getElementById('dropdown');
        var questionsDiv = document.getElementById('questions');
        var generateBtn = document.getElementById('generateBtn');
        var confirmBtn = document.getElementById('confirmBtn');
        var checkbox1 = document.getElementById('checkbox1');
        var checkbox2 = document.getElementById('checkbox2');
        var checkbox3 = document.getElementById('checkbox3');
        var temp = document.getElementById('temp');
        var checkbox4 = document.getElementById('checkbox4');
        var checkbox5 = document.getElementById('checkbox5');
        var checkbox6 = document.getElementById('checkbox6');
        var checkbox7 = document.getElementById('checkbox7');
        var checkbox8 = document.getElementById('checkbox8');
        var checkbox9 = document.getElementById('checkbox9');
        var checkbox10 = document.getElementById('checkbox10');
        var checkbox11 = document.getElementById('checkbox11');

        dropdown.addEventListener('change', function() {
            var selectedOption = dropdown.value;
            var questions = getQuestionsForOption(selectedOption);

            // Update questions and show Generate button
            questionsDiv.innerHTML = '';
            for (var i = 0; i < questions.length; i++) {
                var input = document.createElement('input');
                input.type = 'text';
                input.placeholder = questions[i];
                questionsDiv.appendChild(input);
            }
            generateBtn.style.display = 'block';
            questionsDiv.style.display = 'block';
        });

        generateBtn.addEventListener('click', function() {
            popup.style.display = 'block';
            questionsDiv.style.display = 'none';
            generateBtn.style.display = 'none';
        });

        confirmBtn.addEventListener('click', function() {
            var selectedOption = dropdown.value;
            var answers = [];
            var inputs = document.querySelectorAll('#questions input');
            for (var i = 0; i < inputs.length; i++) {
                answers.push(inputs[i].value);
            }

            var onset = ''
            var progression = ''
            var tenderness = ''
            var coughImpulse = ''
            var variance = ''
            var localTemp = ''
            var posSymp = []
            var negSymp = []
            var HTN = false
            var DM = false

            if (checkbox1.checked) {
                onset = 'insidious in onset'
            }else{
                onset = 'sudden in onset'
            }
            if (checkbox2.checked) {
                progression = 'gradually progressive'
            }else{
                progression = 'rapidly progressive'
            }
            if (checkbox3.checked) {
                tenderness = 'tender'
            }else{
                tenderness = 'non-tender'
            }
            if (temp.checked) {
                localTemp = 'Local rise of temperature present.'
            }else{
                localTemp = 'No local rise of temperature.'
            }
            if (checkbox4.checked) {
                coughImpulse = 'cough impulse present'
            }else{
                coughImpulse = 'cough impulse absent'
            }
            if (checkbox5.checked) {
                variance = 'A/w positional variation.'
            }else{
                variance = 'Not a/w positional variation.'
            }
            if (checkbox6.checked) {
                posSymp.push('H/o vomiting')
            }else{
                negSymp.push('No h/o vomiting')
            }
            if (checkbox7.checked) {
                posSymp.push('H/o consipation')
            }else{
                negSymp.push('No h/o consipation')
            }
            if (checkbox8.checked) {
                posSymp.push('H/o obstipation')
            }else{
                negSymp.push('No h/o obstipation')
            }
            if (checkbox9.checked) {
                posSymp.push('H/o abdominal distention')
            }else{
                negSymp.push('No h/o abdominal distention')
            }
            if (checkbox10.checked) {
                HTN = true
            }else{
                HTN = false
            }
            if (checkbox11.checked) {
                DM = true
            }else{
                DM = false
            }

            var physical = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical')
            var cc = document.getElementById('ctl00_ContentPlaceHolder1_txtcomplaints')
            var hopi = document.getElementById('ctl00_ContentPlaceHolder1_txtillness')
            var past = document.getElementById('ctl00_ContentPlaceHolder1_txthistory')
            var diet = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet')

            cc.value += 'Complaint of ' + selectedOption + ' present over ' + answers[0] + ' since ' + answers[3]

            if(DM){
                past.value = 'K/c/o T2DM'
                diet.value = 'Diabetic diet\n'
            }
            if(HTN){
                if(past.value.length > 1){
                    past.value += '\nK/c/o hypertension'
                }else{
                    past.value += 'K/c/o hypertension'
                }
                diet.value += 'Hypertensive diet'
            }
            if( !DM && !HTN ){
                past.value = 'Nil premorbid'
                diet.value = 'Normal diet'
            }

            document.getElementById('synth').click()

            hopi.value += ', ' + onset + ', ' + progression + ', ' + tenderness + ', ' + coughImpulse + ', ' + variance + '\n' + posSymp.join('\n') +'\n' + negSymp.join('\n')
            hopi.value = hopi.value.replaceAll('\n\n', '\n')

            if (physical.value.length < 1){
                physical.value = `Patient was conscious, cooperative, well oriented to time, place and person. Moderately built and well-nourished.
PR - 72BPM
BP - 120/70mmHg
RR - 16CPM
No pallor, icterus, clubbing, cyanosis, lymphadenopathy, edema, koilonychia.
Afebrile
GCS - 15/15

RS:
Trachea central
Chest movements equal in all areas with respiration
Normal bilateral vesicular breath sounds heard
No added sounds.

CVS:
S1, S2 heard.
Apical impulse 5th ICS medial to left midclavicular line.
No added sounds
No murmurs.

Per Abdomen:
Soft, non-tender. No organomegaly.
No fluid thrill/shifting dullness
Bowel sounds present

CNS:
Higher mental functions normal.
No focal neurological deficits.`
            }

            document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic').value = 'Surgical management.'

            physical.value += '\n\nLocal Examination:\n' + selectedOption + ' present over ' + answers[0] + ', ' + answers[1] + ' in size. ' + answers[2] + ' in shape, ' + tenderness + ', ' + coughImpulse + ', ' + variance + ', ' + localTemp

            popup.style.display = 'none';

            document.getElementById('autofill').click()
        });

        // Define your question and result logic here
        function getQuestionsForOption(option) {
            if (option === 'option1') {
                return ['What', 'Do', 'You', 'Expect'];
            } else if (option === 'Wound') {
                return ['Site', 'Size', 'Shape', 'Time'];
            } else if (option === 'Swelling') {
                return ['Site', 'Size', 'Shape', 'Time'];
            }
            return [];
        }

        // Synthesize HOPI when the button is clicked
        synth.addEventListener('click', function(){
            var age = document.getElementById('ctl00_ContentPlaceHolder1_txtage');
            var pastHistoryFin = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
            var sex = document.getElementById('ctl00_ContentPlaceHolder1_txtsex');
            var HOPI = document.getElementById('ctl00_ContentPlaceHolder1_txtillness');
            var chief = document.getElementById('ctl00_ContentPlaceHolder1_txtcomplaints');
            var sextxt = "female"
            var gen = 'she'
            if (sex.value == "M"){
                sextxt = "male";
                gen = 'he'
            }
            var nummatch = chief.value.match(/\d+\s+\w+/g);
            for (let i = 0; i < nummatch.length; i++) {
                var numarr = nummatch[i].toLowerCase().split(' ')
                }
            var num = chief.value.match(/\d+\s+/g);
            var chiefsplt = chief.value.split('\n')
            var resttxt = ''
            var numberArray = num.map(Number);
            var result = numberArray.indexOf(Math.max(...numberArray));
            if(result==1){
                for (let i = 1; i < chiefsplt.length; i++) {
                    var k = chiefsplt.length - i - 1
                    resttxt += '\nPatient also developed ' + chiefsplt[k].toLowerCase().replace(nummatch[k], '').replace(' x ', '').replace(' since ', '').replace('for', '').replace('  ', '') + ' ' + nummatch[k] + ' back'
                }
                if (HOPI.value == '') {
                    HOPI.value = age.value.toLowerCase() + 'ear old ' + sextxt + ' named ' + titleCase(name.value) + ' (' +pastHistoryFin.value.replace('\n', ',') + ') was apparently normal ' + nummatch[chiefsplt.length - 1] + ' back when ' + gen + ' developed ' + chiefsplt[chiefsplt.length - 1].toLowerCase().replace(nummatch[chiefsplt.length - 1], '').replace(' x ', '').replace(' since ', '') + resttxt;
                }
            }else{
                for (let i = 1; i < chiefsplt.length; i++) {
                    resttxt += '\nPatient also developed ' + chiefsplt[i].toLowerCase().replace(nummatch[i], '').replace(' x ', '').replace(' since ', '').replace('for', '').replace('  ', '') + ' ' + nummatch[i] + ' back'
                }
                if (HOPI.value == '') {
                    HOPI.value = age.value.toLowerCase() + 'ear old ' + sextxt + ' named ' + titleCase(name.value) + ' (' +pastHistoryFin.value.replace('\n', ',') + ') was apparently normal ' + nummatch[0] + ' back when ' + gen + ' developed ' + chiefsplt[0].toLowerCase().replace(nummatch[0], '').replace(' x ', '').replace(' since ', '') + resttxt;
                }
            }

        });

        function preventclose(){window.addEventListener("beforeunload", function(event){
            var confirmationMessage = "You are not allowed to close this window"
            event.returnValue = confirmationMessage
            if (typeof event.preventDefault === "function"){
                event.preventDefault();
            }
            return confirmationMessage
        });
                               }

        function createRadioButton(id, label) {
            var radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.id = id;
            radioButton.name = 'radioGroup';
            radioButton.value = label;

            var radioLabel = document.createElement('label');
            radioLabel.htmlFor = id;
            radioLabel.appendChild(document.createTextNode(label));

            var radioContainer = document.createElement('div');
            radioContainer.appendChild(radioButton);
            radioContainer.appendChild(radioLabel);

            return radioContainer;
        }
    }

    if (window.location.href.includes("http://patemr.manipal.edu/E-REGISTERS_EMR/frmLis_New.aspx")){
        var currentUrl = window.location.href;
        var dateobj = currentUrl.split('vdate=')[1];
        if (currentUrl.includes('graphermode')){
            var btns = document.getElementsByTagName('input');
            for ( var i = 0; i < btns.length; i++ ){
                if (btns[i].src.includes('right.png')){
                    btns[i].click()}
                if (btns[i].src.includes('right1.png')){
                    btns[i].click()}
            }
        }

        /*     // Create the visualise button
    var button = document.createElement('button');
    button.innerHTML = 'Visualise';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    document.body.appendChild(button); */

        // Create the ASCVD button
        var calculate = document.createElement('button');
        calculate.innerHTML = 'Get ASCVD Score';
        calculate.style.position = 'fixed';
        calculate.style.top = '40px';
        calculate.style.right = '10px';
        document.body.appendChild(calculate);

        // Create the Mentzer button
        var mentzer = document.createElement('button');
        mentzer.innerHTML = 'Get Mentzer Index';
        mentzer.style.position = 'fixed';
        mentzer.style.top = '70px';
        mentzer.style.right = '10px';
        document.body.appendChild(mentzer);

        // Create the Cockroft Gault button
        var cock = document.createElement('button');
        cock.innerHTML = 'Get Cockroft Gault Creatinine Clearance';
        cock.style.position = 'fixed';
        cock.style.top = '100px';
        cock.style.right = '10px';
        document.body.appendChild(cock);

        // Create the CKD-EPI Creatinine Equation button
        var ckdepi = document.createElement('button');
        ckdepi.innerHTML = 'Get eGFR using the CKD-EPI Creatinine Equation (2021)';
        ckdepi.style.position = 'fixed';
        ckdepi.style.top = '130px';
        ckdepi.style.right = '10px';
        document.body.appendChild(ckdepi);

        // Create the Child-Pugh Score button
        var cps = document.createElement('button');
        cps.innerHTML = 'Get Child-Pugh Score';
        cps.style.position = 'fixed';
        cps.style.top = '160px';
        cps.style.right = '10px';
        document.body.appendChild(cps);

        // Create the MELD Score button
        var meldbtn = document.createElement('button');
        meldbtn.innerHTML = 'Get MELD Score';
        meldbtn.style.position = 'fixed';
        meldbtn.style.top = '190px';
        meldbtn.style.right = '10px';
        document.body.appendChild(meldbtn);

        // Create the ABG Score button
        var interpretABG = document.createElement('button');
        interpretABG.innerHTML = 'Interpret ABG/VBG';
        interpretABG.style.position = 'fixed';
        interpretABG.style.top = '220px';
        interpretABG.style.right = '10px';
        document.body.appendChild(interpretABG);

        // Create the FIB4 Score button
        var fib4 = document.createElement('button');
        fib4.innerHTML = 'Get FIB-4 Score';
        fib4.style.position = 'fixed';
        fib4.style.top = '250px';
        fib4.style.right = '10px';
        document.body.appendChild(fib4);

        // Create the Access Old Investigations button
        var oldInvest = document.createElement('button');
        oldInvest.innerHTML = 'Access Old Investigations';
        oldInvest.style.position = 'fixed';
        oldInvest.style.bottom = '70px';
        oldInvest.style.right = '10px';
        document.body.appendChild(oldInvest);

        // Create the Simplify button
        var simplify = document.createElement('button');
        simplify.innerHTML = 'Make Yellow Sheet';
        simplify.style.position = 'fixed';
        simplify.style.bottom = '40px';
        simplify.style.right = '10px';
        document.body.appendChild(simplify);

        // Create the Contact button
        var contact = document.createElement('button');
        contact.innerHTML = 'Report Error';
        contact.style.position = 'fixed';
        contact.style.bottom = '10px';
        contact.style.right = '10px';
        document.body.appendChild(contact);

        contact.addEventListener('click', function(){
            alert('In case of any errors/unexpected behaviours/suggestions, please contact Dr. Aditij Dhamija (9873930095)')
        })

        oldInvest.addEventListener('click', function(){
            var hospno = document.getElementById('lblmrn').textContent
            var link = 'http://khapps.manipal.edu/DISCHSUM/Dissumbio1.aspx?hp=' + hospno + '&adate=01/06/2023'
            window.open(link, '_blank')
        })


        /*     // Create the what investigations button
    var formput = document.createElement('button');
    formput.innerHTML = 'What investigations should I put?';
    formput.style.position = 'fixed';
    formput.style.top = '70px';
    formput.style.right = '10px';
    document.body.appendChild(formput); */

        function convertDate(d){
            var year = d.getYear()
            var yeartrue = year + 1900
            var month = d.getMonth()
            var monthtrue = month + 1
            var dateday = d.getDate()

            if (monthtrue.length != 2){
                monthtrue = '0' + monthtrue
            }
            var titleDate = yeartrue + "-" + monthtrue + "-" + dateday

            return titleDate
        }

        const tod = new Date();
        var titleDate = convertDate(tod)
        const today = new Date(titleDate);

        var dict = {}
        var newDict = {}

        var vals = document.querySelectorAll('[style="color:Brown;font-size:18px;font-weight:bold;width:150px;"]');
        let cholTaken = false;
        let HDLTaken = false;
        let RBCTaken = false;
        let MCVTaken = false;
        let CreatTaken = false;
        let BiliTaken = false;
        let INRTaken = false;
        let naTaken = false;
        let albTaken = false;
        let astTaken = false;
        let altTaken = false;
        let pltTaken = false;
        let pHTaken = false;
        let pCO2Taken = false;
        let HCO3Taken = false;
        let potTaken = false;
        let lacTaken = false;
        let sodTaken = false;
        let clTaken = false;
        for ( var k = 0; k < vals.length; k++ ){
            try{
                var test = vals[k].previousElementSibling.textContent;
                var target = vals[k].previousElementSibling;
                /*             if (currentUrl.includes('graphermode')){
                var buttons = document.createElement('button');
                target.parentNode.replaceChild(buttons, target);
                buttons.textContent = test
            }
            buttons.addEventListener('click', function(){
                var obj = test
                })
 */
                var norm = vals[k].textContent;
                var date = vals[k].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                var ref = (vals[k].nextElementSibling.nextElementSibling.textContent).replace('%', '').replace('U/L', '');
                if (ref.toLowerCase().includes('upto')){
                    var UL = ref.toLowerCase().split('upto')[1].trim().split(' ')[0]
                    var LL = 0
                    }else if (ref.includes('up to')){
                        var UL = ref.split('up to')[1].trim().split(' ')[0]
                        var LL = 0
                        }else if (ref.includes('to')){
                            var UL = ref.split('to')[1].trim().split(' ')[0]
                            var LL = ref.split('to')[0].trim().split(' ')[0]
                            }else if (ref.includes('-')){
                                var UL = ref.split('-')[1].trim().split(' ')[0]
                                var LL = ref.split('-')[0].trim()
                                }else{
                                    var UL = ref.split(' ')[0]
                                    var LL = 0
                                    }
                console.log(UL)
                console.log(LL)
                if (clTaken){
                    null;
                } else {
                    if (test.includes('cl-')){
                        var cl = parseFloat(norm)
                        clTaken = true;
                    }
                }
                if (pHTaken){
                    null;
                } else {
                    if (test.includes('pH')){
                        var pH = parseFloat(norm)
                        pHTaken = true;
                    }
                }
                if (pCO2Taken){
                    null;
                } else {
                    if (test.includes('pCO2')){
                        var pCO2 = parseFloat(norm)
                        pCO2Taken = true;
                    }
                }
                if (astTaken){
                    null;
                } else {
                    if (test.includes('ASPARTATE TRANSAMINASE')){
                        var ast = parseFloat(norm)
                        astTaken = true;
                    }
                }
                if (altTaken){
                    null;
                } else {
                    if (test.includes('ALANINE TRANSAMINASE')){
                        var alt = parseFloat(norm)
                        altTaken = true;
                    }
                }
                if (pltTaken){
                    null;
                } else {
                    if (test.includes('PLATELET COUNT')){
                        var plt = parseFloat(norm)
                        pltTaken = true;
                    }
                }
                if (HCO3Taken){
                    null;
                } else {
                    if (test.includes('cHCO3 (P.st)c')){
                        var HCO3 = parseFloat(norm)
                        HCO3Taken = true;
                    }
                }
                if (potTaken){
                    null;
                } else {
                    if (test.includes('K+')){
                        var potassium = parseFloat(norm)
                        potTaken = true;
                    }
                }
                if (sodTaken){
                    null;
                } else {
                    if (test.includes('NA+')){
                        var sodium = parseFloat(norm)
                        sodTaken = true;
                    }
                }
                if (lacTaken){
                    null;
                } else {
                    if (test.includes('lac')){
                        var lactate = norm
                        lacTaken = true;
                    }
                }
                if (cholTaken){
                    null;
                } else {
                    if (test.includes('TOTAL CHOLESTEROL (Serum)')){
                        var totalCholesterol = norm
                        cholTaken = true;
                    }
                }
                if (HDLTaken){
                    null;
                } else {
                    if (test.includes('HIGH DENSITY LIPOPROTEIN CHOLESTEROL (Serum)')){
                        var HDL = norm
                        HDLTaken = true;
                    }
                }
                if (RBCTaken){
                    null;
                } else {
                    if (test.includes('RBC COUNT')){
                        var RBC = norm
                        RBCTaken = true;
                    }
                }
                if (MCVTaken){
                    null;
                } else {
                    if (test.includes('MCV')){
                        var MCV = norm
                        MCVTaken = true;
                    }
                }
                if (CreatTaken){
                    null;
                } else {
                    if (test.includes('CREATININE')){
                        var creat = norm
                        CreatTaken = true;
                    }
                }
                if (BiliTaken){
                    null;
                } else {
                    if (test.includes('TOTAL BILIRUBIN (Serum)')){
                        var bili = norm
                        BiliTaken = true;
                    }
                }
                if (INRTaken){
                    null;
                } else {
                    if (test.includes('INR')){
                        var INR = norm
                        INRTaken = true;
                    }
                }
                if (naTaken){
                    null;
                } else {
                    if (test.includes('SODIUM')){
                        var na = norm
                        naTaken = true;
                    }
                }
                if (albTaken){
                    null;
                } else {
                    if (test.includes('ALBUMIN')){
                        var albumin = norm
                        albTaken = true;
                    }
                }

                dict[test + ' ' + date.title] = norm
                if (parseFloat(UL)<parseFloat(norm)){
                    vals[k].style.color = 'red'
                    newDict[test + ' done on ' + date.title] = [norm, 'Abnormal']
                }else if (parseFloat(LL)>parseFloat(norm)){
                    vals[k].style.color = 'blue'
                    newDict[test + ' done on ' + date.title] = [norm, 'Abnormal']
                }else{
                    vals[k].style.color = 'green'
                    newDict[test + ' done on ' + date.title] = [norm, 'Normal']
                }
                if (norm.includes('+')){
                    vals[k].style.color = 'red'
                    newDict[test + ' done on ' + date.title] = [norm, 'Abnormal']
                }
                if (norm.includes('>')){
                    vals[k].style.color = 'red'
                    newDict[test + ' done on ' + date.title] = [norm, 'Abnormal']
                }
            }
            catch(err){null;}
        }

        fib4.addEventListener('click', function(){
            var age = document.getElementById('lblAge').textContent.replace('Y', '');
            var scoreFib = age * ast/(plt * (alt)^0.5)
            if (scoreFib < 1.45){
                var stage = '0-1'
            }
            else if (scoreFib < 3.25){
                var stage = '2-3'
            }
            else{
                var stage = '4-6'
            }
            alert('FIB4 score is ' + scoreFib + '\nApproximate fibrosis stage is ' + stage)
        })

        calculate.addEventListener('click', function(){
            var gen = document.getElementById('lblSex').textContent;
            var age = document.getElementById('lblAge').textContent.replace('Y', '');

            if(cholTaken){
                if(HDLTaken){
                    var SBP = prompt("Enter Systolic BP", "120")
                    var hypertensive = confirm("Press OK if patient is on treatment for hypertension")
                    var smoker = confirm("Press OK if patient is a current smoker");
                    var diabetic = confirm("Press OK if patient is diabetic");
                    var showsurvival = true
                    }else{
                        alert('HDL not available.')
                    }
            }else{
                alert('Total Cholestrol is not available.')
            }


            if (age < 40 || age > 79) { alert("ASCVD should not be used for patients of this age group") }
            const lnAge = Math.log(age);
            const lnTotalChol = Math.log(totalCholesterol);
            const lnHdl = Math.log(HDL);
            const trlnsbp = hypertensive ?
                  Math.log(parseFloat(SBP)) : 0;
            const ntlnsbp = hypertensive ?
                  0 : Math.log(parseFloat(SBP));
            const ageTotalChol = lnAge * lnTotalChol;
            const ageHdl = lnAge * lnHdl;
            const agetSbp = lnAge * trlnsbp;
            const agentSbp = lnAge * ntlnsbp;
            const ageSmoke = smoker ? lnAge : 0;

            let s010Ret = 0;
            let mnxbRet = 0;
            let predictRet = 0;

            if (gen == 'F') {
                s010Ret = 0.96652;
                mnxbRet = -29.1817;
                predictRet = (-29.799 * lnAge) + (4.884 * (lnAge ** 2)) + (13.54 * lnTotalChol) +
                    (-3.114 * ageTotalChol) + (-13.578 * lnHdl) + (3.149 * ageHdl) + (2.019 * trlnsbp) +
                    (1.957 * ntlnsbp) + (7.574 * Number(smoker)) +
                    (-1.665 * ageSmoke) + (0.661 * Number(diabetic))
            } else {
                s010Ret = 0.91436;
                mnxbRet = 61.1816;
                predictRet = (12.344 * lnAge) + (11.853 * lnTotalChol) + (-2.664 * ageTotalChol) +
                    (-7.99 * lnHdl) + (1.769 * ageHdl) + (1.797 * trlnsbp) + (1.764 * ntlnsbp) +
                    (7.837 * Number(smoker)) + (-1.795 * ageSmoke) +
                    (0.658 * Number(diabetic));
            };

            const pct = (1 - (s010Ret ** Math.exp(predictRet - mnxbRet)));
            var survival = Math.round((pct * 100) * 10) / 10;

            if(showsurvival){
                alert("10 year ASCVD risk is " + survival + "%")
            }
        })

        mentzer.addEventListener('click', function(){
            if(MCVTaken){
                if(RBCTaken){
                    alert("Mentzer's index is " + Math.round(MCV/RBC*100)/100)
                }else{
                    alert("RBC count not available")
                }
            }else{
                alert("MCV value is not available")
            }
        })

        cock.addEventListener('click', function(){
            var gen = document.getElementById('lblSex').textContent;
            var age = document.getElementById('lblAge').textContent.replace('Y', '');
            if(CreatTaken){
                var wt = prompt("Weight of the patient is (kg)", 60)
                if (gen == "M"){
                    var creatCl = Math.round((140 - age)*wt/(72*creat)*100)/100
                    alert("Calculated Creatinine Clearance is " + creatCl + " mL/min")
                }else{
                    var creatCl = Math.round(0.85*(140 - age)*wt/(72*creat)*100)/100
                    alert("Calculated Creatinine Clearance is " + creatCl + " mL/min")
                }
            }else{
                alert("Creatinine value is not available")
            }
        })

        ckdepi.addEventListener('click', function(){
            var gen = document.getElementById('lblSex').textContent;
            var age = document.getElementById('lblAge').textContent.replace('Y', '');
            if(CreatTaken){
                if (gen == "M"){
                    if(creat<=0.9){
                        var A = 0.9
                        var B = -0.302
                        }else{
                            var A = 0.9
                            var B = -1.2
                            }
                    alert("eGFR is " + Math.round(142*Math.pow(creat/A, B)*Math.pow(0.9938, age)) + "ml/min/1.73m²")
                }else{
                    if(creat<=0.7){
                        var A = 0.7
                        var B = -0.241
                        }else{
                            var A = 0.7
                            var B = -1.2
                            }
                    alert("eGFR is " + Math.round(142*Math.pow(creat/A, B)*Math.pow(0.9938, age)*1.012) + "ml/min/1.73m²")
                }
            }else{
                alert("Creatinine value is not available")
            }
        })

        meldbtn.addEventListener('click', function(){
            var gen = document.getElementById('lblSex').textContent;
            if(CreatTaken){
                if(BiliTaken){
                    if(INRTaken){
                        if(albTaken){
                            if(creat<1){
                                creat = 1
                            }
                            if(bili<1){
                                bili = 1
                            }
                            if(INR<1){
                                INR = 1
                            }
                            if(na<125){
                                na = 125
                            }else if(na>137){
                                na = 137
                            }
                            if(albumin<1.5){
                                albumin = 1.5
                            }else if(albumin>3.5){
                                albumin = 3.5
                            }
                            if(creat>3){
                                creat = 3
                            }
                            if(gen == 'M'){
                                var MELD3 = 4.56*Math.log(bili) + 0.82*(137 - na) - 0.24*(137 - na)*Math.log(bili) + 9.09*Math.log(INR) + 11.14*Math.log(creat) + 1.85*(3.5 - albumin) - 1.83*(3.5 - albumin)*Math.log(creat) + 6
                                }else{
                                    var MELD3 = 1.33 + 4.56*Math.log(bili) + 0.82*(137 - na) - 0.24*(137 - na)*Math.log(bili) + 9.09*Math.log(INR) + 11.14*Math.log(creat) + 1.85*(3.5 - albumin) - 1.83*(3.5 - albumin)*Math.log(creat) + 6
                                    }
                            var roundMELD = Math.round(MELD3)
                            var survival = Math.pow(0.946, Math.exp((0.17698*roundMELD)-3.56))*100
                            var survivalRound = Math.round(survival*10)/10
                            alert('MELD 3.0 score is ' + roundMELD + '\n90 day survival is ' + survivalRound + '%')
                        }else
                        {
                            if(creat<1){
                                creat = 1
                            }
                            if(bili<1){
                                bili = 1
                            }
                            if(INR<1){
                                INR = 1
                            }
                            var dialysis = confirm('Click OK if the patient has been on dialysis at least twice this past week')
                            if(dialysis){
                                var MELD2016 = Math.round((0.957 * Math.log(4) + 0.378 * Math.log(bili) + 1.120 * Math.log(INR) + 0.643) * 10)
                                }else{
                                    var MELD2016 = Math.round((0.957 * Math.log(creat) + 0.378 * Math.log(bili) + 1.120 * Math.log(INR) + 0.643) * 10)
                                    }
                            if (naTaken){
                                if (MELD2016 > 11){
                                    var MELDNa = MELD2016 + 1.32*(137-na)-(0.33*MELD2016)*(137-na)
                                    }else{
                                        var MELDNa = 0
                                        }
                            }else{
                                var MELDNa = 0
                                }

                            if(MELD2016 < 1){
                                MELD2016 = 1
                            }

                            function calculateMortality(MELD){
                                if (MELD <= 9){
                                    var mortality = '1.9%'
                                    }else if (MELD <= 19){
                                        var morality = '6%'
                                        }else if (MELD <= 29){
                                            var mortality = '19.6%'
                                            }else if (MELD <= 39){
                                                var mortality = '52.6%'
                                                }else if (MELD >= 40){
                                                    var mortality = '71.3%'
                                                    }
                                return mortality
                            }

                            if(MELDNa==0){
                                alert('MELD Score is ' + MELD2016 + '\n3 month mortality is ' + calculateMortality(MELD2016) + '%')
                            }else{
                                alert('MELD-Na Score is ' + MELD2016 + '\n3 month mortality is ' + calculateMortality(MELD2016) + '%')
                            }
                        }


                    }
                    else{
                        alert('INR value is not available')
                    }
                }else{
                    alert('Bilirubin value is not available')
                }
            }else{
                alert('Creatinine value is not available')
            }
        })

        interpretABG.addEventListener('click', function(){
            const normal_pH = [7.35, 7.46];
            const normal_pCO2 = [35, 48];
            const normal_HCO3 = [22, 26];
            const normal_lactate = [5, 14];
            const normal_sodium = [136, 146];
            const normal_potassium = [3.4, 4.5];
            const normal_chloride = [98, 106];
            // Initialize result string
            var result = '';

            // Variables to track various conditions
            var acidosis = false;
            var alkalosis = false;
            var metabolic = false;
            var respiratory = false;
            var compensated = false;
            var acute = false;
            var chronic = false;
            var AG = false;
            var concurrentNAGMA = false;
            var concurrentMA = false;
            var health = false;
            var racidmacid = false;
            var ralkamalka = false;

            // Check for acidosis or alkalosis
            if (pH < normal_pH[0]) {
                acidosis = true;
            } else if (pH > normal_pH[1]) {
                alkalosis = true;
            } else {
                health = true;
            }

            if (acidosis) {
                if (pCO2 > normal_pCO2[1]) {
                    respiratory = true;
                    if (HCO3 < normal_HCO3[0]){
                        racidmacid = true
                    }
                } else if (pCO2 < normal_pCO2[0]) {
                    metabolic = true;
                } else if (HCO3 < normal_HCO3[0]) {
                    metabolic = true
                }
            }

            if (alkalosis) {
                if (pCO2 < normal_pCO2[0]) {
                    respiratory = true;
                    if (HCO3 > normal_HCO3[1]){
                        ralkamalka = true
                    }
                } else if (pCO2 > normal_pCO2[1]) {
                    metabolic = true;
                } else if (HCO3 > normal_HCO3[1]) {
                    metabolic = true
                }
            }

            var AGval = sodium - (cl + HCO3);
            var delAG = AGval - 12;
            var decHCO3 = 24 - HCO3;
            var delHCO3 = HCO3 - 24;
            var delpCO2 = pCO2 - 40;

            var suspect = ''

            if (metabolic && acidosis) {
                if (AGval > 12) {
                    AG = true;
                    if (delAG / decHCO3 < 1) {
                        concurrentNAGMA = true;
                    } else if (delAG / decHCO3 > 2) {
                        concurrentMA = true;
                    }
                }
            }

            if (respiratory && acidosis) {
                if (delHCO3 > 3.5 * delpCO2 / 10) {
                    chronic = true;
                    compensated = true;
                } else if (delHCO3 > delpCO2 / 10) {
                    acute = true;
                    compensated = true;
                }
            }

            if (respiratory && alkalosis) {
                if (decHCO3 > 5 * delpCO2 / 10) {
                    chronic = true;
                    compensated = true;
                } else if (decHCO3 > 2 * delpCO2 / 10) {
                    acute = true;
                    compensated = true;
                }
            }

            if (compensated) {
                result += 'Compensated ';
            }
            if (acute) {
                result += 'Acute ';
            }
            if (chronic) {
                result += 'Chronic ';
            }
            if (!acidosis && !alkalosis){
                if (pCO2 > normal_pCO2[1] && HCO3 > normal_HCO3[1]){
                    result += 'Respiratory Acidosis with Metabolic Alkalosis '
                    suspect += '\nCOPD with diurectics, vomiting, NG suction \nSevere hypokalemia '
                    health = false
                }
            }
            if (!acidosis && !alkalosis){
                if (pCO2 < normal_pCO2[0] && HCO3 < normal_HCO3[0]){
                    result += 'Respiratory Alkalosis with Metabolic Acidosis '
                    suspect += '\nSepsis \nSalicylate toxicity \nRenal failure with CHF or pneumonia \nAdvanced liver disease '
                    health = false
                }
            }
            if (!acidosis && !alkalosis){
                if (HCO3 > normal_HCO3[0] && HCO3 < normal_HCO3[1]){
                    if (pCO2 < normal_pCO2[0]){
                        result += 'Compensated Respiratory Alkalosis '
                        suspect += '\nAnxiety \nFever \nHyperventilation \nPregnancy (Physiological) \nSevere Anemia \nLiver Disease \nTrauma \nCertain drugs '
                        health = false
                    }
                    if (pCO2 > normal_pCO2[1]){
                        result += 'Compensated Respiratory Acidosis '
                        suspect += '\nAsthma \nCOPD \nDrugs \nEmphysema \nPneumonia \nSleep Apnea \nAcute Pulmonary Edema \nALS \nMS/MD \nObesity \nPulmonary Fibrosis \nScoliosis '
                        health = false
                    }
                    if (pCO2 < normal_pCO2[0] || pCO2 > normal_pCO2[1]) {
                        result += '\nAlso consider Possible Metabolic Acidosis with Metabolic Alkalosis '
                        suspect += '\nCauses for Possible Metabolic Acidosis with Metabolic Alkalosis: \nUremia \nKetoacidosis \nVomiting \nNG suction \nDiuretics '
                        health = false
                    }
                }
            }
                if (AG) {
                result += 'High Anion Gap ';
                suspect += '\nMethanol \nUremia (chronic kidney failure) \nDiabetic ketoacidosis \nParacetamol, Propylene glycol \nInfection, Iron, Isoniazid (which can cause lactic acidosis in overdose), Inborn errors of metabolism \nLactic acidosis \nEthylene glycol, Ethanol \nSalicylates'
            }
            if (racidmacid) {
                result += 'Respiratory Acidosis with Metabolic Acidosis '
                suspect += '\nCardiac arrest \nIntoxications \nMulti-organ failure '
            }
            else if (ralkamalka) {
                result += 'Respiratory Alkalosis with Metabolic Alkalosis '
                suspect += '\nPregnancy with vomiting \nOver ventilation of COPD '
            }
            else {
                if (metabolic) {
                    result += 'Metabolic ';
                }
                if (respiratory) {
                    result += 'Respiratory ';
                }
                if (acidosis) {
                    result += 'Acidosis ';
                }
                if (alkalosis) {
                    result += 'Alkalosis ';
                }
            }
            if (metabolic && acidosis) {
                var lowCompensationpCO2 = (1.5 * HCO3) + 6;
                var highCompensationpCO2 = (1.5 * HCO3) + 10;
                if (pCO2 > lowCompensationpCO2) {
                    result += 'with Compensation ';
                }
            }

            if (metabolic && alkalosis) {
                var lowCompCO2 = (0.7 * HCO3) + 15;
                var highCompCO2 = (0.7 * HCO3) + 25;
                if (lowCompCO2 < pCO2) {
                    result += 'with Compensation ';
                }
            }
            if (concurrentNAGMA) {
                result += 'with Concurrent Non-Anion Gap Metabolic Acidosis '
                suspect += '\nNormal saline infusion \nResolving DKA \nGastrointestinal bicarbonate loss - Diarrhea (secretory), High output fistulas, pancreatic/biliary drainge \nUreteroileostomy or ureterosigmoidostomy \nRenal insufficiency (typically when GFR is between 20-50 ml/min) \nExogenous acid (e.g. total parenteral nutrition, calcium chloride) \nRenal tubular acidosis (RTA) \nChronic hyperventilation (extremely rare) ';
            }
            if (concurrentMA) {
                result += 'with Concurrent Metabolic Alkalosis '
                suspect += '\nChronic lung disease like COPD \nVomiting \nDiuretics';
            }
            if (lactate > normal_lactate[1]) {
                result += 'Lactic Acidosis present - ' + lactate + ' mg/dL'
            }else if (health) {
                result += 'no evidence of Acidosis/Alkalosis.';
            }
            if (sodium < normal_sodium[0]) {
                result += "\nHyponatremia present - " + sodium + ' mmol/L';
            } else if (sodium > normal_sodium[1]) {
                result += "\nHypernatremia present - " + sodium + ' mmol/L';
            }
            if (potassium < normal_potassium[0]) {
                result += "\nHypokalemia present - " + potassium + ' mmol/L';
            } else if (potassium > normal_potassium[1]) {
                result += "\nHyperkalemia present - " + potassium + ' mmol/L';
            }
            if (pHTaken) {
                if (health || suspect.length < 1) {
                    alert('The ABG/VBG shows ' + result + '\n\nKindly confirm results before prescribing treatment.')
                } else {
                    alert('The ABG/VBG shows ' + result + '\nSuspect: ' + suspect + '\n\nKindly confirm results before prescribing treatment.')
                }
            } else {
                alert('Kindly open the ABG/VBG and try again')
            }

        })

        cps.addEventListener('click', function(){
            if(BiliTaken){
                if(albTaken){
                    if(INRTaken){
                        var cpsScore = 0
                        if(bili<2){
                            cpsScore += 1
                        }else if(bili<=3){
                            cpsScore += 2
                        }else if(bili>3){
                            cpsScore += 3
                        }
                        if(albumin>3.5){
                            cpsScore += 1
                        }else if(albumin>=2.8){
                            cpsScore += 2
                        }else if(albumin<2.8){
                            cpsScore += 3
                        }
                        if(INR<1.7){
                            cpsScore += 1
                        }else if(INR<=2.3){
                            cpsScore += 2
                        }else if(INR>2.3){
                            cpsScore += 3
                        }

                        var encephalopathy = confirm('Click OK if patient has encephalopathy')
                        if(encephalopathy){
                            var sevEncephalopathy = confirm('Click OK if encephalopathy is severe (grade 3 or 4)')
                            if(sevEncephalopathy){
                                cpsScore += 3
                            }else if(encephalopathy){
                                cpsScore += 2
                            }else{
                                cpsScore += 1
                            }
                        }

                        var ascites = confirm('Click OK if patient has ascites')
                        if(ascites){
                            var sevAscites = confirm('Click OK if ascites is severe (diuretic refractory)')
                            if(sevAscites){
                                cpsScore += 3
                            }else if(ascites){
                                cpsScore += 2
                            }else{
                                cpsScore += 1
                            }
                        }
                        if(cpsScore<=6){
                            var grade = 'Class A (least severe liver disease)'
                            }else if(cpsScore<=9){
                                var grade = 'Class B (moderately severe liver disease)'
                                }else if(cpsScore<=15){
                                    var grade = 'Class C (most severe liver disease)'}
                        alert('Child-Pugh Score is ' + cpsScore + '\nPatient is Child-Turcotte-Pugh ' + grade)
                    }
                    else{
                        alert('INR value is not available')
                    }
                }
                else{
                    alert('Albumin value is not available')
                }
            }else{
                alert('Bilirubin value is not available')
            }
        })

        simplify.addEventListener('click', function(){
            var data = ''
            var text = ''
            for (let key in newDict){
                var keys = key.split('done on')
                if(newDict[key][1] == 'Normal'){
                    data += keys[0] +newDict[key][0] + ' DATE IS (' + keys[1].trim() + ')' + '<br>'
                }else{
                    data += keys[0] + '<span style = "color: red;">' + newDict[key][0] + '</span>' + ' DATE IS (' + keys[1].trim() + ')' + '<br>'
                }
            }


            // Function to create the pop-up
            function createPopUp(data) {
                const popupDiv = document.createElement('div');
                popupDiv.style.position = 'fixed';
                popupDiv.style.top = '50%';
                popupDiv.style.left = '50%';
                popupDiv.style.transform = 'translate(-50%, -50%)';
                popupDiv.style.padding = '20px';
                popupDiv.style.background = 'white';
                popupDiv.style.border = '2px solid #ccc';
                popupDiv.style.borderRadius = '5px';
                popupDiv.style.zIndex = '9999';
                popupDiv.innerHTML = '<h2>Make Yellow Sheet</h2>' + '<p>' + data + '</p>' + '<button id="closeBtn">Close</button>';

                document.body.appendChild(popupDiv);

                const closeBtn = document.getElementById('closeBtn');
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(popupDiv);
                })};


            // Call the createPopUp function with the data you provide
            var lines = data.split('<br>')

            function sequentialAppender(array, name){
                var output = ''
                for ( let i = 0 ; i<array.length ; i++ ){
                    if (array[i].includes(name)){
                        output += array[i] + '<br>'
                    }
                }
                return output
            }
            var names = ['HAEMOGLOBIN', 'TOTAL WBC', 'PLATELET COUNT', 'ESR', 'RANDOM', 'FASTING' , 'PRANDIAL', 'UREA', 'CREAT', 'SODIUM', 'POTASSIUM', 'TOTAL BILIRUBIN', 'DIRECT BILIRUBIN', 'ASPARTATE TRANSAMINASE', 'ALANINE TRANSAMINASE', 'ALKALINE PHOSPHATASE', 'TOTAL PROTEIN', 'ALBUMIN', 'GLOBULIN', 'PROTHROMBIN', 'INR', 'THROMBOPLASTIN']
            var outputdata = ''
            for ( let i = 0 ; i < names.length ; i++ ){
                outputdata += sequentialAppender(lines, names[i])
            }
            var simpler = outputdata.split('<br>')
            var dates = ''
            var finout = ''
            var date = []
            var dict = {}
            for ( let i = 0 ; i < simpler.length ; i++ ){
                var datapt = simpler[i].split(' DATE IS ')
                if(date.includes(datapt[1])){
                    null;
                }else{
                    date.push(datapt[1])
                }

                for ( let i = 0 ; i < date.length ; i++ ){
                    if(date[i] == datapt[1]){
                        dict[datapt[1]] += datapt[0] + '<br>'
                    }
                }

                if(dates.includes(datapt[1])){
                    null;}else{
                        if (datapt[1] !== undefined){
                            dates += datapt[1]
                            finout += '<h3>' + datapt[1].replace('(', '').replace(')', '') + '</h3>'
                        }
                    }
                finout += datapt[0] + '<br>'
            }

            finout = ''

            for ( let i = 0 ; i < date.length ; i++ ){
                if (date[i] !== undefined){
                    finout += '<h3>' + date[i].replace('(', '').replace(')', '') + '</h3>'
                }
                finout += dict[date[i]]
            }

            finout += '<i>Please note:<br>This tool only shows CBC, RFT and LFT.<br>For other investigations, please look through the page.</i>'

            createPopUp(finout.replaceAll('undefined', ''));
        })


        formput.addEventListener('click', function(){
            var datesRFT = ""
            var datesLFT = ""
            var prompttxt = ""

            for (let key in newDict) {
                test = key.split(' done on ')[0]
                date = key.split(' done on ')[1]
                var RFT = ["POTASSIUM", "CREATININE", "UREA", "SODIUM"]
                var LFT = ["ALBUMIN", "GLOBULIN", "ALANINE TRANSAMINASE", "ALKALINE PHOSPHATASE", "ASPARTATE TRANSAMINASE", "DIRECT BILIRUBIN", "TOTAL BILIRUBIN"]
                for (let i = 0 ; i < RFT.length ; i++){
                    if (key.includes(RFT[i])){

                        if (newDict[key][1] == "Abnormal"){
                            var RFTbad = true;
                            if (datesRFT.includes(date)){
                                null;
                            }else{
                                datesRFT += date + ", "
                            }
                        }
                    }
                }
                for (let i = 0 ; i < LFT.length ; i++){
                    if (key.includes(LFT[i])){
                        if (newDict[key][1] == "Abnormal"){
                            var LFTbad = true;
                            if (datesLFT.includes(date)){
                                null;
                            }else{
                                datesLFT += date + ", "
                            }
                        }
                    }
                }
                datesRFT = datesRFT
                datesLFT = datesLFT
            }

            if (RFTbad) {
                prompttxt += "Add RFT on account of deranged RFT on " + datesRFT.slice(0, -2) + "\n"
            }
            if (LFTbad) {
                prompttxt += "Add LFT on account of deranged LFT on " + datesLFT.slice(0, -2) +  "\n\n"
            }


            if (prompttxt == ""){
                prompttxt += "Nothing going on here, put routine investigations I guess?" + "\n"
            }

            prompttxt += "Note: Please run in visualise mode with all investigations opened"

            alert(prompttxt)
        })

        button.addEventListener('click', function() {
            if (currentUrl.includes('graphermode')){
                /*             if (obj == null){
                var obj = prompt("Please enter the test name to visualise", "");
            }
            console.log(obj) */
                try{
                    canvas.remove()
                }
                catch(err){
                    null;
                }
                var obj = prompt("Please enter the test name to visualise", "");

                // Create the canvas element for the chart
                var canvas = document.createElement('canvas');
                canvas.id = 'myChart';
                document.body.prepend(canvas);

                // Extract the keys and values from the dictionary
                var labels = Object.keys(dict);
                var data = Object.values(dict);

                var properlabels = []
                var properdata = []

                for ( let l = 0 ; l < labels.length ; l++){
                    if (labels[l].toLowerCase().includes(obj.toLowerCase())){
                        properlabels.push(labels[l])
                        properdata.push(dict[labels[l]])
                    }
                }
                // Generate random colors for the bars
                var colors = labels.map(function() {
                    return '#' + Math.floor(Math.random() * 16777215).toString(16);
                });

                // Create the chart data
                var chartData = {
                    labels: properlabels,
                    datasets: [
                        {
                            label: 'Data Series',
                            data: properdata,
                            backgroundColor: colors,
                            borderColor: 'blue',
                            fill: false
                        }
                    ]
                };

                // Configuration options for the chart
                var options = {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Tests'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value'
                            }
                        }
                    }
                };

                // Create the chart
                var ctx = document.getElementById('myChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: chartData,
                    options: options
                });
            }else if (dateobj != null){
                window.open(currentUrl.replace(dateobj, 'graphermode'), '_blank')
            }else{
                window.open(currentUrl+'&vdate=graphermode', '_blank')
            }

        });

    }
})();
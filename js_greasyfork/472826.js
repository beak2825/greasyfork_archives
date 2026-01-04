// ==UserScript==
// @name         MAHE Power Tools BETA
// @namespace    http://tampermonkey.net/
// @version      5
// @description  An amalgamation of all the tools I have created yet.
// @author       Aditij Dhamija
// @match        http://172.16.7.105/*
// @match        http://172.16.7.73/*
// @match        http://172.16.7.74/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472826/MAHE%20Power%20Tools%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/472826/MAHE%20Power%20Tools%20BETA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.includes('http://172.16.7.73/E-REGISTERS_EMR/flipbook')){
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

    if(window.location.href.includes('http://172.16.7.73/E-REGISTERS_EMR/frmPrescription_medics')){
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


    if (window.location.href == "http://172.16.7.74/dischsum/login.aspx" || window.location.href == "http://172.16.7.74/DISCHSUM/login.aspx"){
        var unit = document.getElementById('ddldeptcode')
        unit.addEventListener('change', function(){
            document.getElementById('txtpwd').value = unit.value
            document.getElementById('cmdlogin').click()
        }
                             )}

    if (window.location.href == "http://172.16.7.73/E-REGISTERS_EMR/LOGIN_emr.ASPX" || window.location.href == "http://172.16.7.73/E-REGISTERS_EMR/Login_EMR.aspx"){
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


    if (window.location.href == "http://172.16.7.74/dischsum/dischpatlist.aspx" || window.location.href == "http://172.16.7.74/DISCHSUM/dischpatlist.aspx" || window.location.href == "http://172.16.7.74/dischsum/DischargeSSrsRpt.aspx" || window.location.href == "http://172.16.7.74/DISCHSUM/DischargeSSrsRpt.aspx" || window.location.href == "http://172.16.7.74/dischsum/view.aspx" || window.location.href == "http://172.16.7.74/DISCHSUM/view.aspx" || window.location.href == "http://172.16.7.74/dischsum/HospNoDischargeSummary.aspx" || window.location.href == "http://172.16.7.74/DISCHSUM/HospNoDischargeSummary.aspx" ){
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
            var link = "http://172.16.7.74/DISCHSUM/ModifyEntry.aspx?ip=" + ip + "&userid=" + unit
            window.open(link, '_blank')
        })
    }

    if(window.location.href == "http://172.16.7.105/" || window.location.href == "http://172.16.7.105/home.aspx"){
        var img = document.getElementsByTagName('img');
        img[7].src = "https://i.ibb.co/80j81N0/Picsart-23-07-02-11-12-54-421.jpg";
    }

    if(window.location.href == "http://172.16.7.105/admdetl.aspx"){
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
                variable = 'http://172.16.7.73/E-REGISTERS_EMR/MergedPage_EMR_expandondemand.aspx?hno=0{num}&typ=O';
            } else if (this.value === 'Link Investigations') {
                variable = 'http://172.16.7.73/E-REGISTERS_EMR/frmLis_New.aspx?hno={num}&typ=I&IPNO={ipnum}';
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
                      'SF1':'Second Floor'
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

                if(unitName == selectUnit){
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
    }

    if(window.location.href.includes("http://172.16.7.74/DISCHSUM/DischargeEntry") || window.location.href.includes("http://172.16.7.74/dischsum/DischargeEntry") || window.location.href.includes("http://172.16.7.74/DISCHSUM/ModifyEntry") || window.location.href.includes("http://172.16.7.74/dischsum/ModifyEntry")){

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
EYE001--DR. SULATHA BHANDARY--9686675697
EYE002--DR. YOGISH S  KAMATH--9686675697
EYE003--DR. VIJAYA PAI H--9686675697
GEC001--DR. SHIRAN SHETTY
GEC002--DR. GANESH BHAT
GEC003--DR. GANESH PAI C
GEN001--DR. GIRISHA K M
GEN002--DR. ANJU SHUKLA
GIS001--DR. BHARAT KUMAR BHAT
GYN001--DR. JAYARAMAN NAMBIAR
GYN002--DR. AKHILA VASUDEVA
GYN003--DR. SHYAMALA G
GYN004--DR. JYOTHI SHETTY
GYN005--DR. SHRIPAD S. HEBBAR
HNS001--DR. SURESH PILLAI
HSD001--DR. ANIL K BHAT
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
NEOI  --Dr. SHEILA MATHAI
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
OBS001--DR. JAYARAMAN NAMBIAR
OBS002--DR. AKHILA VASUDEVA
OBS003--DR. SHYAMALA G
OBS004--DR. JYOTHI SHETTY
OBS005--DR. SHRIPAD S. HEBBAR
ORT001--DR. SHYAMSUNDER BHAT N--9686692594
ORT002--DR. KIRAN KUMAR V ACHARYA--9686692596
ORT003--DR. MONAPPA NAIK--9686692598
ORT004--DR. VIVEK PANDEY--9686692600
ORT005--DR. SHARATH KUMAR RAO K--9686692602
OSUR  --DR. SRIKANTH G
PCR001--DR. GUNJAN BANGA
PCR002--DR. AKKATAI  SHRISHAIL TELI
PD    --DR. RASHMI NAYAK
PDO001--DR VASUDEVA BHAT K
PDS   --DR. VIJAYA KUMAR
PED001--DR. RAMESH BHAT Y--9686675705
PED002--DR. SUNEEL MUNDKUR C--9686676577
PED003--DR. SHRIKIRAN A HEBBAR--9686692967
PED006--DR. KOUSHIK H
PED011--DR. PUSHPA G KINI
PED4IB--DR. LESLIE EDWARD S LEWIS
PED4OB--DR. LESLIE EDWARD S LEWIS
PLS   --DR. SREEKUMAR
PMD001--DR. NAVEEN SULAKSHAN SALINS
PMR001--DR MAITREYI PATIL
POR001--DR. HITESH H SHAH
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
        button.innerHTML = 'Autofill';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        document.body.appendChild(button);

        // Create the scans button
        var linkbutton = document.createElement('button');
        linkbutton.innerHTML = 'Access Scans';
        linkbutton.style.position = 'fixed';
        linkbutton.style.top = '40px';
        linkbutton.style.right = '10px';
        document.body.appendChild(linkbutton);

        // Create the synth button
        var synth = document.createElement('button');
        synth.id = 'synth'
        synth.innerHTML = 'Synthesize HOPI';
        synth.style.position = 'fixed';
        synth.style.top = '70px';
        synth.style.right = '10px';
        document.body.appendChild(synth);

        // Create the echo button
        var echo = document.createElement('button');
        echo.innerHTML = 'Add Normal Echo Findings';
        echo.style.position = 'fixed';
        echo.style.top = '100px';
        echo.style.right = '10px';
        document.body.appendChild(echo);

        // Create the echo button
        var cns = document.createElement('button');
        cns.innerHTML = 'Add Detailed CNS Findings';
        cns.style.position = 'fixed';
        cns.style.top = '130px';
        cns.style.right = '10px';
        document.body.appendChild(cns);

        // Create the IP button
        var ippres = document.createElement('button');
        ippres.innerHTML = 'Open IP Prescription';
        ippres.style.position = 'fixed';
        ippres.style.top = '160px';
        ippres.style.right = '10px';
        document.body.appendChild(ippres);

        var hospno = document.getElementById('ctl00_ContentPlaceHolder1_txthospno').value;

        ippres.addEventListener('click', function(){
            var link = 'http://172.16.7.73/E-REGISTERS_EMR/frmPrescription_medics_SOH_Token_IP.aspx?hno=' + hospno + '&vdate=' + admdate + '&team=' + unitnum
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
            var input1 = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical');
            var input2 = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
            var input3 = document.getElementById('ctl00_ContentPlaceHolder1_txticustay');
            var input4 = document.getElementById('ctl00_ContentPlaceHolder1_txtcontact');
            var input5 = document.getElementById('ctl00_ContentPlaceHolder1_txtdocname');
            var input6 = document.getElementById('ctl00_ContentPlaceHolder1_txtdesgn');
            var input7 = document.getElementById('ctl00_ContentPlaceHolder1_txtunit');
            var input8 = document.getElementById('ctl00_ContentPlaceHolder1_txtdiet');
            var input9 = document.getElementById('ctl00_ContentPlaceHolder1_txtadvice');
            var input10 = document.getElementById('ctl00_ContentPlaceHolder1_txttherapetic');
            var input11 = document.getElementById('ctl00_ContentPlaceHolder1_txtcondition');
            var radio = document.getElementById('ctl00_ContentPlaceHolder1_RadioNegative');
            radio.checked = true;
            var select = document.getElementById('ctl00_ContentPlaceHolder1_ddlAsst');
            select.selectedIndex = 1;

            if (input1.value == '') {
                input1.value = `Patient was conscious, cooperative, well oriented to time, place and person. Moderately built and well-nourished.
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
            if (input2.value == '') {
                input2.value = 'Nil premorbid';
            }
            if (input3.value == '') {
                input3.value = 'NA';
            }
            if (input4.value == '') {
                input4.value = phonenum;
            }
            if (input5.value == '') {
                input5.value = hodName;
            }
            if (input6.value == '') {
                input6.value = 'Head of Unit';
            }
            if (input7.value == '') {
                input7.value = unitnum;
            }
            if (input8.value == '') {
                input8.value = 'Low salt, low fat, low cholesterol diet.';
            }
            if (input9.value == '') {
                input9.value = 'Review after _ weeks with _.';
            }
            if (input10.value == '') {
                input10.value = 'Medical management.';
            }
            if (input11.value == ''){
                input11.value = 'Stable';
            }

            if(document.getElementById('ctl00_ContentPlaceHolder1_txtdisdate').value.length<1){
                document.getElementById('ctl00_ContentPlaceHolder1_txtrefdoc').value = 'Adding Date'
                document.getElementById('ctl00_ContentPlaceHolder1_ImageButton1').click()
            }
        });



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
        });

        var LES = document.createElement('button');
        LES.innerHTML = 'Local Examination Synthesizer';
        LES.style.position = 'fixed';
        LES.style.bottom = '40px';
        LES.style.right = '10px';
        document.body.appendChild(LES);

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
<label><input type="checkbox" id="checkbox3"> Tenderness</label><br>
<label><input type="checkbox" id="checkbox4"> Cough impulse</label><br>
<label><input type="checkbox" id="checkbox5"> No positional variation</label><br>
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
            if (checkbox4.checked) {
                coughImpulse = 'cough impulse present'
            }else{
                coughImpulse = 'cough impulse absent'
            }
            if (checkbox6.checked) {
                variance = 'a/w positional variation.'
            }else{
                variance = 'Not a/w positional variation.'
            }
            if (checkbox7.checked) {
                posSymp.push('vomiting')
            }else{
                negSymp.push('vomiting')
            }
            if (checkbox8.checked) {
                posSymp.push('consipation')
            }else{
                negSymp.push('consipation')
            }
            if (checkbox9.checked) {
                posSymp.push('obstipation')
            }else{
                negSymp.push('obstipation')
            }
            if (checkbox10.checked) {
                posSymp.push('abdominal distention')
            }else{
                negSymp.push('abdominal distention')
            }
            if (checkbox11.checked) {
                HTN = true
            }else{
                HTN = false
            }
            if (checkbox12.checked) {
                DM = true
            }else{
                DM = false
            }

            var hopi = document.getElementById('ctl00_ContentPlaceHolder1_txtphysical')
            var cc = document.getElementById('ctl00_ContentPlaceHolder1_txtcomplaints')

            cc.value += 'Complaint of ' + selectedOption + ' present over ' + answers[0] + ' since ' + answers[3]

            document.getElementById('synth').click()

            hopi.value += '\n\nLocal Examination:\n' + selectedOption + ' present over ' + answers[0] + ', ' + answers[1] + ' in size. ' + answers[2] + ' in shape.\n' + selectedOptions.join('\n') + '\n' + unselectedOptions.join('\n')

            popup.style.display = 'none';
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
            var input2 = document.getElementById('ctl00_ContentPlaceHolder1_txthistory');
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
                    HOPI.value = age.value.toLowerCase() + 'ear old ' + sextxt + ' named ' + titleCase(name.value) + ' (' +input2.value.replace('\n', ',') + ') was apparently normal ' + nummatch[chiefsplt.length - 1] + ' back when ' + gen + ' developed ' + chiefsplt[chiefsplt.length - 1].toLowerCase().replace(nummatch[chiefsplt.length - 1], '').replace(' x ', '').replace(' since ', '') + resttxt;
                }
            }else{
                for (let i = 1; i < chiefsplt.length; i++) {
                    resttxt += '\nPatient also developed ' + chiefsplt[i].toLowerCase().replace(nummatch[i], '').replace(' x ', '').replace(' since ', '').replace('for', '').replace('  ', '') + ' ' + nummatch[i] + ' back'
                }
                if (HOPI.value == '') {
                    HOPI.value = age.value.toLowerCase() + 'ear old ' + sextxt + ' named ' + titleCase(name.value) + ' (' +input2.value.replace('\n', ',') + ') was apparently normal ' + nummatch[0] + ' back when ' + gen + ' developed ' + chiefsplt[0].toLowerCase().replace(nummatch[0], '').replace(' x ', '').replace(' since ', '') + resttxt;
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

        // Create the radio buttons
        var radioContainer1 = createRadioButton('radioButton1', 'Show error when changing window');

        // Add the radio buttons to the document
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '98%';
        container.style.right = '10px';
        container.style.transform = 'translateY(-50%)';
        container.appendChild(radioContainer1);
        document.body.appendChild(container);
        radioContainer1.addEventListener('change', preventclose);
    }

    if (window.location.href.includes("http://172.16.7.73/E-REGISTERS_EMR/frmLis_New.aspx")){
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
            var link = 'http://172.16.7.74/DISCHSUM/Dissumbio1.aspx?hp=' + hospno + '&adate=01/06/2023'
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
        var albTaken = false;
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
                var ref = (vals[k].nextElementSibling.nextElementSibling.textContent);
                if (ref.includes('to')){
                    var UL = ref.split('to')[1].split(' ')[1]
                    var LL = 0
                    }else if (ref.includes('-')){
                        var UL = ref.split('-')[1].trim().split(' ')[0]
                        var LL = ref.split('-')[0].trim()
                        }else{
                            var UL = ref
                            var LL = 0
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
                    if (test.includes('HIGH DENSITY LIPOPROTEIN (Serum)')){
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
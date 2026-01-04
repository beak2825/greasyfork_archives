// ==UserScript==
// @name         OPMS Parser
// @namespace    http://tampermonkey.net/
// @version      0.6
// @license      MIT
// @description  Read OPMS data
// @author       ksmc
// @match        https://opms.emb.gov.ph/application/*
// @icon         https://www.google.com/s2/favicons?domain=emb.gov.ph
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447442/OPMS%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/447442/OPMS%20Parser.meta.js
// ==/UserScript==

(function() {
    'use strict'
    function copyToClipboard(text) {
        const elem = document.createElement('textarea')
        elem.value = text
        document.body.appendChild(elem)
        elem.select()
        document.execCommand('copy')
        document.body.removeChild(elem)
        window.document.title = "Copied!"
    }

    let callback = function(){
        let ecc = Array.from(document.getElementsByTagName("table")).map(a => Array.from(a.rows)).flat()
        ecc = ecc.filter(a => a?.children[1]?.innerText.indexOf("ECC") > -1)
        ecc = ecc.length == 1 ? ecc.map(a => a.children[0].children[0].href).join("\r\n") : "Multiple uploads"

        let apsi = Array.from(document.getElementsByClassName("box box-default"))
        apsi = apsi.filter(a => a.children[0].innerText.indexOf("Air Pollution Sources Installation (APSI)")>-1)
        apsi = apsi.map(a => Array.from(a.children[1].children[0].children).slice(1)).flat()
        apsi = apsi.map(a => Array.from(a.children)).flat().map(a => a.innerText.split("\t"))
        apsi = apsi.filter(a => a.length > 1).map(function(entry){
            let build = [entry[3],entry[4],entry[1] == "Fuel Burning" ? entry[6] : "-",entry[4],"-",entry[9],entry[7]]
            build = build.map(a => a == "" ? " " : a)
            return build.join("||")
        })
        apsi = Object.assign(Array(10).fill(" "),apsi)

        let contents = []
        let divs = []
        let divsInner = []
        let labels = []
        let sanitized = []
        let prodinfo = []

        switch(document.getElementsByClassName("breadcrumb")[0].children[2].innerText){
            case 'Discharge Permit':
                divs = Array.from(document.getElementsByTagName('div'))
                divsInner = divs.map(a => a.innerText)
                prodinfo = Array.from(divs[divsInner.indexOf('Product Information')-1].getElementsByTagName('td'))?.map(a => a?.innerText)
                contents = [
                    window.location.href,ecc,
                    ... Array.from(document.getElementsByClassName("dl-horizontal dl-compress")).map(a => a.children[1].innerText).slice(0,2),
                    ... Array.from(document.getElementsByClassName("col-md-6")).map(a => a.innerText),
                    ... Array.from(document.getElementsByClassName("col-sm-6")).map(a => a.innerText),
                    ... Array.from(document.getElementsByClassName("table table-bordered table-hover swswg")[0].getElementsByTagName("td")).map(a => a.innerText),
                    ... Array.from(document.getElementsByClassName("table table-striped table-hover")[2].getElementsByTagName("td")).map(a => a.innerText),
                    divs[divsInner.indexOf('Primary Treatment System')-1]?.getElementsByClassName('col-md-6')[0]?.innerText,
                    divs[divsInner.indexOf('Primary Treatment System')-1]?.getElementsByClassName('col-md-6')[1]?.innerText,
                    divs[divsInner.indexOf('Chemical Treatment System')-1]?.getElementsByClassName('col-md-6')[0]?.innerText,
                    divs[divsInner.indexOf('Chemical Treatment System')-1]?.getElementsByClassName('col-md-6')[1]?.innerText,
                    divs[divsInner.indexOf('Secondary Treatment System')-1]?.getElementsByClassName('col-md-6')[0]?.innerText,
                    divs[divsInner.indexOf('Secondary Treatment System')-1]?.getElementsByClassName('col-md-6')[1]?.innerText,
                    prodinfo.filter((a,i) => i%4 == 0).join("||"),
                    prodinfo.filter((a,i) => i%4 == 1).join("||"),
                    prodinfo.filter((a,i) => i%4 == 2).join("||"),
                    prodinfo.filter((a,i) => i%4 == 3).join("||"),
                ]
                labels = [
                    'URL','ECC Source',
                    ... Array.from(document.getElementsByClassName("dl-horizontal dl-compress")).map(a => a.children[0].innerText).slice(0,2),
                    ... Array.from(document.getElementsByClassName("col-md-4 col-md-offset-1")).map(a => a.innerText),
                    ... ["MWSS",
                         "Local Water District",
                         "Deep Well	","Surface Water (lake, river, creek, etc.)","Others","Others2","Total Water Consumption"]
                    .flatMap(a =>
                             Array.from(
                        document.getElementsByClassName("table table-bordered table-hover swswg")[0]
                        .getElementsByTagName("th"))
                             .map(b => a+" "+b.innerText)),
                    ... Array.from(document.getElementsByClassName("table table-striped table-hover")[2].getElementsByTagName("th")).map(a => a.innerText),
                    'Primary Installed On','Primary Composition','Chemical Installed On','Chemical Composition','Secondary Installed On','Secondary Composition',
                    'Product Name','Annual Production Capacity','Actual Production in the previous year','Type of Process'
                ]
                sanitized = [
                    'URL', 'ECC Source',
                    'Certificate number', 'Expiration Date',
                    'Application number', 'Reference Code','Previous Certificate',
                    'Application No.', 'Application Type', 'Type of Wastewater',
                    'Name of Owner', 'Plant No. & Street Name', 'Plant Barangay', 'Plant City', 'Plant Province', 'Plant Region',
                    'Name of Permittee','ECC', 'CNC', 'DENR No.', 'TIN', 'No. & Street Name', 'Barangay', 'City', 'Province', 'Region',
                    'Geolocation', 'PSIC', 'Year Est', 'Industry Category',
                    'Legal Classification', 'Private', 'Foreign', 'Government',
                    'Name of PCO', 'Accreditation No.', 'Accreditation Date','Tel. No. & Cel. No.', 'Fax No.',
                    'Production', 'Non-Production', 'No. of hours/day', 'No. of days/month', 'No. of months/year',
                    'No. of days with discharge/month', 'Discharging To', 'Water treatment system capacity',
                    'Value of capital investment in the wastewater treatment plant', 'Installed on', 'Composition',
                    'Load Based Assessment','Load Based OP Number', 'Load Based OR/Transaction/Reference Number', 'Load Based Paid thru', 'Load Based Date of Payment',
                    'Assessment', 'OP Number','OR/Transaction/Reference Number', 'Paid thru', 'Date of Payment',
                    'MWSS Sources of Water Supply', 'MWSS Monthly ave. vol. (m3)',
                    'MWSS Daily ave. vol. (m3)','MWSS Generating Process', 'MWSS Estimated Flow (m3/day)',
                    'Local Water District Sources of Water Supply', 'Local Water District Monthly ave. vol. (m3)',
                    'Local Water District Daily ave. vol. (m3)', 'Local Water District Generating Process', 'Local Water District Estimated Flow (m3/day)',
                    'Deep Well\t Sources of Water Supply', 'Deep Well\t Monthly ave. vol. (m3)',
                    'Deep Well\t Daily ave. vol. (m3)', 'Deep Well\t Generating Process', 'Deep Well\t Estimated Flow (m3/day)',
                    'Surface Water (lake, river, creek, etc.) Sources of Water Supply', 'Surface Water (lake, river, creek, etc.) Monthly ave. vol. (m3)',
                    'Surface Water (lake, river, creek, etc.) Daily ave. vol. (m3)', 'Surface Water (lake, river, creek, etc.) Generating Process', 'Surface Water (lake, river, creek, etc.) Estimated Flow (m3/day)',
                    'Others Sources of Water Supply', 'Others Monthly ave. vol. (m3)',
                    'Others Daily ave. vol. (m3)', 'Others Generating Process', 'Others Estimated Flow (m3/day)',
                    'Others2 Sources of Water Supply', 'Others2 Monthly ave. vol. (m3)',
                    'Others2 Daily ave. vol. (m3)', 'Others2 Generating Process', 'Others2 Estimated Flow (m3/day)',
                    'Total Water Consumption Sources of Water Supply', 'Total Water Consumption Monthly ave. vol. (m3)', 'Total Water Consumption Daily ave. vol. (m3)',
                    'Total Water Consumption Generating Process', 'Total Water Consumption Estimated Flow (m3/day)',
                    'Bank Branch',
                    'Location of the Outlet','Description of the Outlet','Name of the Receiving Body of Water','Ave. Concentration','Ave. Rate of Discharge','Ave. Load',
                    'Primary Installed On','Primary Composition','Chemical Installed On','Chemical Composition','Secondary Installed On','Secondary Composition',
                    'Product Name','Annual Production Capacity','Actual Production in the previous year','Type of Process'
                ]
                labels = labels.filter(a => a != "")
                labels[labels.indexOf('\n            Discharging To\n        ')] = 'Discharging To'
                labels[labels.indexOf('Office Operation')] = 'Office Operation (hrs)'
                labels[labels.indexOf('Production Operation')] = 'Production Operation (hrs)';
                ["No. & Street Name","Barangay","City","Province","Region"]
                    .map(a => labels[labels.indexOf(a)] = "Plant "+a);
                ["Assessment","OP Number","OR/Transaction/Reference Number","Paid thru","Date of Payment"]
                    .map(a => labels[labels.indexOf(a)] = "Load Based "+a);
                contents[labels.indexOf("Load Based Assessment")] = ""
                contents[labels.indexOf("Assessment")] = ""
                break

            case 'Permit to Operate':
                contents = [window.location.href,ecc,
                            document.getElementsByClassName("table table-bordered table-hover")[0].children[2].children[document.getElementsByClassName("table table-bordered table-hover")[0].children[2].children.length-2].children[1].innerText,
                            apsi.join("|||"),
                        ... Array.from(document.getElementsByClassName("dl-horizontal dl-compress")).map(a => a.children[1].innerText).slice(0,2),
                        ... Array.from(document.getElementsByClassName("col-md-6")).map(a => a.innerText),
                        ... Array.from(document.getElementsByClassName("col-sm-6")).map(a => a.innerText),
                        ... Array.from(document.getElementsByClassName("table table-bordered table-hover swswg")[0].getElementsByTagName("td")).map(a => a.innerText)]
                labels = ['URL','ECC Source',"Start of Application","APSI",
                          ... Array.from(document.getElementsByClassName("dl-horizontal dl-compress")).map(a => a.children[0].innerText).slice(0,2),
                          ... Array.from(document.getElementsByClassName("col-md-4 col-md-offset-1")).map(a => a.innerText),
                          ... Array.from(document.getElementsByClassName("table table-bordered table-hover swswg")[0].getElementsByTagName("th")).map(a => a.innerText)]
                sanitized = ['URL','ECC Source',"Start of Application",'APSI',
                         'Certificate number', 'Expiration Date',
                         'Application number', 'Reference Code',
                         'Application No.', 'Application Type', 'Region',
                         'Name of Establishment', 'Name of Owner', 'Mailing Address', 'Mailing Zip Code', 'Mailing Tel. No.', 'Mailing Fax No.',
                         'Plant Name', 'Plant Address', 'Plant Region', 'Plant Geolocation', 'Plant Zip Code', 'Plant Tel. No.', 'Plant Fax No.',
                         'TIN', 'EIA Classification', 'Nature of Business', 'Nature of Ownership', 'Authorized Capital', 'Paid up Capital',
                         'Total Employees', 'Operation Start Date', 'ECC Number', 'CNC Number', 'Managing Head', 'Managing Head Tel. No.',
                         'PCO Name', 'PCO Tel. No.', 'PCO Appointment', 'PCO Application Submission',"PCO Accreditation No.","PCO Accreditation Validity",
                         'Assessment', 'OP Number', 'OR/Transaction/Reference Number', 'Amount Paid', 'Paid thru', 'Bank Branch', 'Date of Payment',
                         'Office Operation (hrs)', 'Office Operation', 'Production Operation (hrs)', 'Production Operation', 'Land Area', 'Land Ownership',
                         'Third Party Stack Tester', 'Address', 'Email Address', 'Tel. No.', 'QA/QC Manager', 'Team Leader', 'SAT No.', 'Date Signed', 'Date Expiration',
                         'Name of Laboratory', 'Laboratory Address', 'Environmental Laboratory Number']
                labels = labels.filter(a => a != "")
                labels[labels.indexOf('Office Operation')] = 'Office Operation (hrs)'
                labels[labels.indexOf('Production Operation')] = 'Production Operation (hrs)'
                contents[labels.indexOf("Assessment")] = ""
                break
        }
        let unused = labels.filter(a => sanitized.indexOf(a) < 0)
        console.log(`Content length: ${contents.length}, label length: ${labels.length}`)
        console.log("Duplicates: "+sanitized.filter(a => sanitized.filter(b => b == a).length > 1))
        console.log("Sanitized: "+sanitized.join("	"))
        //console.log(sanitized.map(a => labels.indexOf(a) > -1 ? contents[labels.indexOf(a)] : " "))
        if(unused.length > 0){
            console.log(unused)
            console.log(unused.join("	"))
            alert(`The following entries are not recorded: \n${unused.join("\n")}`)
        }
        else{
            copyToClipboard(sanitized.map(a => labels.indexOf(a) > -1 ? contents[labels.indexOf(a)] : " ").join("	"))
            //window.close()
        }
    }

    let newcallback = function(){
        function parse(entry){
            if(Array.from(entry.children).length > 1){
                let obj = {}
                let arr = Array.from(entry.children).map(a => parse(a))
                for(let value of arr){
                    if(!Array.isArray(value[0])){
                        obj[value[0]] = value.slice(1)
                    }
                    else{
                        console.log(value)
                    }
                }
                return obj
            }
            else if(Array.from(entry.children).length == 1){
                return parse(entry.children[0])
            }
            else{
                return entry.innerText
            }
        }

        let main = parse(document.getElementsByClassName("tab-pane active")[0])

        console.log(main)
    }
    let targetNode = document.getElementsByClassName("box-body")[0]
    const observer = new MutationObserver(callback)
    const config = { attributes: true, childList: true, subtree: true }

    observer.observe(targetNode, config)
})();
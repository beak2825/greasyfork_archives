// ==UserScript==
// @name         IIS Quick Submit
// @version      0.14
// @author       ksmc
// @description  Quick submit monitoring reports
// @include      https://iis.emb.gov.ph/embis/dms/documents/migrate/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.ph
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/901070
// @downloadURL https://update.greasyfork.org/scripts/443216/IIS%20Quick%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/443216/IIS%20Quick%20Submit.meta.js
// ==/UserScript==

async function parse(){
    console.log("Parsing data.")
    function copyToClipboard(text) {
        const elem = document.createElement('textarea');
        elem.value = text;
        document.body.appendChild(elem);
        elem.select();
        document.execCommand('copy');
        document.body.removeChild(elem);
        console.log('copied')
    }

    let subject = ""
    try{
        subject = "Monitoring Report FY 2021 for "+(document.getElementsByClassName("file-row dz-image-preview row dz-processing dz-success dz-complete")[0]
                                            .children[0].children[0].innerText
                                            .replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
                                            .match(/# *[0-9]{3}[ -]*(.*)\.[a-zA-Z]+/)[1])
    }
    catch(e){
        subject = "Monitoring Report FY 2021 for "+(document.getElementById("prev-attachment-div")
                                            .children[2].children[0].children[0].children[0].children[0].innerText
                                            .replace(/\_/g," ")
                                            .replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
                                            .match(/# *[0-9]{3}[ -]*(.*)\.[a-zA-Z]+/)[1])
    }
    let contents = {
        trans_no: document.getElementsByName("trans_no")[0].value,
        system: "5",
        type: "23",
        report_fy: "2021",
        subject: subject,
        status: "5",
        due_date: "",
        qr_code: "",
        company: "R10141600060881",
        action: "Filed / Close.",
        remarks: "Additional MOV for FY 2021 accomplishment",
        records_location: ""
    }
    let confirmed = confirm(`Submitting ${contents.subject}`)
    if(confirmed){
        try{
            window.document.title = "Submitting data..."
            copyToClipboard(document.getElementsByClassName("form-control")[1].value)
            let res = await post(contents,"https://iis.emb.gov.ph/embis/index.php/Dms/migrate/migrate_submit")
            window.location.href = "https://iis.emb.gov.ph/embis/dms/documents/migrate"
        }
        catch(e){
            alert(e)
        }
    }
}

async function post(content,url) {
    return $.ajax({
        type: "POST",
        url: url,
        data: content
    })
}

function addBtn(){
    console.log("Quick send button added.")
    document.getElementsByClassName("card-header py-3 d-flex flex-row align-items-center justify-content-between")[0].onclick = parse
}

window.setInterval(function(){
    if(window.document.title != "Submitting data..."){
        if(document.getElementById("total-progress").style.opacity == "0"){
            window.document.title = "DONE"
        }
        else if(document.getElementById("total-progress").style.opacity == ""){
            window.document.title = "READY"
        }
        else if(document.getElementById("total-progress").style.opacity == "1"){
            window.document.title = "Uploading...."
        }
    }
},1000)

addBtn()
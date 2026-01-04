// ==UserScript==
// @name          PTC Download Multi CDs
// @description   Improve the PTC download web page to select multiple CDs and provides a script to download all of them
// @version       0.0.6
// @license       MIT License
// @grant         none
// @match         https://support.ptc.com/appserver/auth/it/esd/product.jsp?prodFamily=*
// @namespace     https://github.com/yl78/ptc-download
// @downloadURL https://update.greasyfork.org/scripts/454651/PTC%20Download%20Multi%20CDs.user.js
// @updateURL https://update.greasyfork.org/scripts/454651/PTC%20Download%20Multi%20CDs.meta.js
// ==/UserScript==


/*
 * Parse PTC Download page to get CD informations: name, path and SHA256 signature.
 *
 * Steps for using this script (tested on Firefox only):
 *  1. Save the PTC Download page locally using File -> Save as (COMPLETE HTML Page)
 *  2. Modify the local html file and add the following line between <head> tags:
 *         <script type="text/javascript" src="get-CD-list.js"></script>
 *  3. Open the local HTML file in the web browser
 *  4. Select the CDs you want to download
 *  5. Click on "Get List" and save the CSV file locally
 *  6. Execute the following command (from Unix bash):
 *       download-all.sh -f <local-CSV-file>
 */
function addSelectionUI() {
    var fileListElts = document.getElementsByClassName("fileList");
    var parseFileRE = /this.form.filepath.value\s*=\s*'([^']+)'/ ;
    var parseShaRE = /showSHA\s*\(\s*'([^']+)'\s*\)/ ;
    
    for (var i=0; i < fileListElts.length; i++) {
        var tableRowElts = fileListElts[i].getElementsByTagName("tr");
        
        if (tableRowElts && tableRowElts.length > 0) {
            
            var moduleName = getModuleName(fileListElts[i]);

            for (let rowElt of tableRowElts) {
                let firstCol = rowElt.firstElementChild;
                let buttons = rowElt.getElementsByTagName("input");
                
                try {
                    let fileInfos = {
                        name: moduleName,
                        filePath: getFilePath(rowElt),
                        shaSum: getSHAChecksum(rowElt)    
                    };

                    if (fileInfos.filePath && fileInfos.shaSum) {
                        let cbx = document.createElement("input");
                        cbx.type = "checkbox";
                        cbx.name = "selected-file";
                        cbx.value = JSON.stringify(fileInfos);
                        cbx.addEventListener('change', evt => toggleSelectedFiles(evt, fileInfos) );
                        
                        cbx = firstCol.appendChild(cbx);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
    addBasketUI();
}

function getModuleName(fileListElt) {
    const prodIdRE = /product_description_no\d+/ ;

    var cdName = "";

    // while parentElement check id match /product_description_no\d+/
    for (var curNode = fileListElt; curNode.parentElement; curNode = curNode.parentElement) {
        if (curNode.id && prodIdRE.test(curNode.id)) {
            cdName = curNode.previousElementSibling.textContent;
        }
        cdName = cdName.replace(/\s*\(.*\).*$/, "");
    }
    return cdName;
}

/**
 * Get the download path of the file.
 * @param {HTMLTableRowElement} fileRow HTML table row element
 * @returns Relative path to the file to download
 */
function getFilePath(fileRow) {
    const parseFileRE = /this.form.filepath.value\s*=\s*'([^']+)'/ ;
    const downloadBtn = fileRow.querySelector("input[onclick][value='HTTPS']");

    if (! downloadBtn) {
        throw "Download button not found";
    }

    let clickFct = downloadBtn.attributes['onclick'].value;
    console.debug(`Button onclick source: ${clickFct}`);
    
    let parseRes = parseFileRE.exec(clickFct);
    
    if (! parseRes) {
        throw "Unable to get file path from button click function";
    }

    let filePath = parseRes[1];
    console.debug(`Parsed file: ${filePath}`);
    
    return filePath;
}

/**
 * Get the SHA-256 checksum of the file.
 * @param {HTMLTableRowElement} fileRow HTML table row element
 * @returns SHA-256 checksum of the file to download
 */
function getSHAChecksum(fileRow) {
    const parseShaRE = /showSHA\s*\(\s*'([^']+)'\s*\)/ ;
    const shaBtn = fileRow.querySelector("button[onclick]");

    if (! shaBtn) {
        throw "SHA button not found";
    }

    var clickFct = btn.attributes['onclick'].value;
    console.debug("Button onclick source: " + clickFct);

    var parseRes = parseShaRE.exec(clickFct);

    if (!parseRes) {
        throw "Unable to SHA signature from button click function";
    }

    let shaSum = parseRes[1];
    console.debug(`Parsed SHA: ${shaSum}`);

    return shaSum;
}

function makeCSV() {
    var selectedFiles = document.getElementsByName("selected-file");
    
    var fileList = Array.from(selectedFiles)
        .filter(cbx => cbx.checked && cbx.value)
        .map(cbx => JSON.parse(cbx.value));

    if (fileList.length <= 0) {
        alert("No file selected !");
        return;
    }
    
    var csvList = fileList.map(infos => `${infos.name};${infos.filePath};${infos.shaSum}`).join('\n');
    

    // for (var i=0; selectedFiles && i < selectedFiles.length; i++) {
    //     if (selectedFiles[i].checked && selectedFiles[i].value) {
    //         //csvList += selectedFiles[i].value + "\n";
    //         fileList.push(JSON.parse(selectedFiles[i].value));
    //     }
    // }
    
    //let testFile = selectedFiles[0].value.split(';')[1];

    getDownloadLinkFetch(fileList[0].filePath);
    //getDownloadLinkXhr(testFile);

    download(csvList, "download-list.csv");
}

function getDownloadLinkFetch(testFile) {
    fetch(`https://support.ptc.com/appserver/auth/it/esd/getUrl.jsp?filepath=${testFile}`, {
        method: 'HEAD',
        mode: 'cors',
//        redirect: 'manual',
        credentials: 'include',
        referrer: "https://support.ptc.com/appserver/auth/it/esd/product.jsp",
        headers: {
            "Accept": "*/*",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "same-origin",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        }
    }).then(getAuthTokens).catch(err => console.error("Error while fetchind CD URL: "+ err));
  
}


// Function to download data to a file
function download(data, filename) {
    var file = new Blob([data], {type: "text/plain"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function addBasketUI() {

    const customStyles = document.createElement('style');

    customStyles.textContent = `
    .cust-basket {
        position: fixed;
        bottom: 0;
        right: 0;
        height: 200px;
        width: 500px;
        background-color: lightcyan;
        border: grey solid 1px;
        border-radius: 10px;
        padding: 5px;
        box-shadow: -5px -5px 5px lightgrey;
//        display: flex;
//        flex-direction: column;
//        align-items: salmon;
//        justify-content: end;
    }

    .cust-scroll {
        display: inline-block;
        height: 130px;
        width: 100%;
        overflow-y: auto;
    }

    #download-info {
        width: 100%;
    }

    #download-info tbody {
    //    display: block;
    //    width: 100%;
        font-size: 80%;
    }
    #download-info thead th {
        position: sticky;
        top: 0;
        font-size: 90%;
        background-color: lightgray;
        width: auto;
    }

    // #get-list-btn {
    //     position: absolute;
    //     right: 0;
    //     bottom: 0;
    //     margin 10px;
    // }
    `;
    
    document.head.appendChild(customStyles);
    
    //var containerDiv = document.getElementById("main_16");
    let containerDiv = document.getElementById("container");

    let basketDiv = document.createElement("div");
    basketDiv.className = 'cust-basket';

    basketDiv.appendChild(document.createElement("h2")).innerText = 'Basket';

    let tableDiv = basketDiv.appendChild(document.createElement("div"));
    tableDiv.className = 'cust-scroll';
    let infoTable = tableDiv.appendChild(document.createElement("table"));
    infoTable.id = 'download-info';

    let tHead = infoTable.appendChild(document.createElement("thead"));
    
    let headRow = tHead.appendChild(document.createElement("tr"));
    headRow.appendChild(document.createElement("th")).innerText = 'Module Name';
    headRow.appendChild(document.createElement("th")).innerText = 'Filename';

    infoTable.appendChild(document.createElement("tbody"));
    

    let buttonDiv = basketDiv.appendChild(document.createElement("div"));
    buttonDiv.style.direction = 'rtl';
    let extractButton = buttonDiv.appendChild(document.createElement("input"));
    extractButton.type = "submit";
    extractButton.value = "Get List";
    extractButton.id = "get-list-btn";
    extractButton.addEventListener('click', makeCSV);

    containerDiv.appendChild(basketDiv);
}

if (window.addEventListener) {
    window.addEventListener('load', addSelectionUI);
    //alert("load event added: addSelectionUI");
}
else if (window.attachEvent) {
    window.attachEvent('onload', addSelectionUI);
    //alert("load event attached: addSelectionUI");
}

function getAuthTokens(resp) {
    
    if (! resp.ok) {
        throw "Fail to request download URL: "+ resp.statusText
    }

    if (! resp.redirected) {
        throw "Redirection didn't occured, ignoring";
    }
    let redirectUrl = new URL(resp.url);
    let uname = redirectUrl.searchParams.get('uname');
    let uid = redirectUrl.searchParams.get('uid');
    let gdaToken = redirectUrl.searchParams.get('__gda__');

    // let infoTable = document.querySelector("#download-info tbody");
    // printInfo(infoTable, "Username:", uname);
    // printInfo(infoTable, "User ID:", uid);
    // printInfo(infoTable, "GDA Token:", gdaToken);
    
    console.debug(`Username: ${uname}, User ID: ${uid}, GDA Token: ${gdaToken}`)
}

function printInfo(table, label, value) {
    let infoRow = document.createElement("tr");
    let labelCol = document.createElement("td");
    labelCol.innerText = label;

    let valueCol = document.createElement("td");
    valueCol.innerText = value;

    infoRow.appendChild(labelCol);
    infoRow.appendChild(valueCol);
    table.appendChild(infoRow);
}

function toggleSelectedFiles(evt, fileInfos) {
    let rowId = `cust-id-${fileInfos.filePath}`;
    let tableList = document.querySelector('#download-info tbody');

    if (evt.target.checked) {    
        let newRow = tableList.appendChild(document.createElement('tr'));
        let idx = fileInfos.filePath.lastIndexOf('/');
        let fileName = idx++ > 0 ? fileInfos.filePath.substring(idx) : fileInfos.filePath;

        newRow.appendChild(document.createElement('td')).innerText = fileInfos.name;
        newRow.appendChild(document.createElement('td')).innerText = fileName;
        newRow.id = rowId;
    }
    else {
        let delRow = document.getElementById(rowId);
        delRow.remove();
    }

}
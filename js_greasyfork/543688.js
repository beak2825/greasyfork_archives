// ==UserScript==
// @name         CardtraderZero Order Displayer
// @namespace    https://www.cardtrader.com
// @version      2025-09-27
// @description  Display items in Cardtrader Zero orders grouped by processing/shipment status
// @author       Sibbob
// @match        https://www.cardtrader.com/orders/buyer_future_order
// @icon         https://www.cardtrader.com/assets/favicon/favicon-32x32-a5e0283790f269dc65e3d5d886d9ec2ac290bf407249b2c124e7baff5c10080d.png
// @grant        window.onurlchange
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543688/CardtraderZero%20Order%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/543688/CardtraderZero%20Order%20Displayer.meta.js
// ==/UserScript==
const TEXT_HEADER_CLASS = "bg-tertiary";
const TEXT_INFO_CLASS = "text-info";

function main() {
    const trs = document.getElementsByTagName('tr');
    let futureOrderLineIds = [];
    let textInfo;
    let textHeader;

    //get the list of all cards ordered, and the template for headers
    for (let tr of trs) {
        if (tr.classList.length > 0 ){
            if (tr.classList.contains(TEXT_HEADER_CLASS)) {
                textHeader = tr;
            } else if(tr.classList.contains(TEXT_INFO_CLASS)){
                textInfo = tr;
            }
        } else {
            if (tr.dataset.testId.endsWith("pending")){
                futureOrderLineIds.push(tr.dataset.futureOrderLineId);
            }
        }
    }
    console.debug('OriginalTextHeader',textHeader);
    console.debug('OriginalTextInfo',textInfo);

    // creating new sections of the table
    const tbody = document.getElementsByTagName('tbody')[0];
    const sec_ids = ["arrived-final","shipped-final","arrived-local","shipped-local","processed","purchased"];
    const sec_descs = ["arrived in main warehouse", "shipped to main warehouse", "arrived in local hub","shipped to local hub","processed", "purchased"];
    const sec_icon_classes = ["fa-truck-loading","fa-truck","fa-truck-loading","fa-truck","fa-cogs","fa-shopping-cart"]
    for (let i = 0; i < sec_ids.length; i++){
        //modify the header, including id to the text box to ease changing its text
        let textHeaderModified = textHeader.cloneNode(true);
        let textBox = textHeaderModified.children[0].children[0];
        let textIcon = textBox.children[0];
        setNewText(textBox,`0 cards ${sec_descs[i]}`);
        textBox.id = `header-${sec_ids[i]}`;
        // change icon
        textIcon.classList.remove("fa-truck");
        textIcon.classList.add(sec_icon_classes[i]);
        //add id to info - to ease append after it
        let textInfoModified = textInfo.cloneNode(true);
        textInfoModified.id = `info-${sec_ids[i]}`

        console.debug('ModifiedTextHeader',textHeaderModified);
        console.debug('ModifiedTextInfo',textInfoModified);
        tbody.insertAdjacentElement('beforeend', textHeaderModified);
        tbody.insertAdjacentElement('beforeend', textInfoModified);
    }

    // fetch status and move the line accordingly
    for (let lineId of futureOrderLineIds){
        fetch(`https://www.cardtrader.com/orders/${lineId}/where_is_my_card.json?state=pending`)
            .then(res => res.json())
            .then(data => {
            console.debug('FetchedData',lineId,data);
            let orderInfo = data[0].data;
            if (orderInfo.repurchase){
                orderInfo = orderInfo.repurchase;
            }
            console.debug('ProcessedData',lineId,orderInfo);
            let orderStatus = determineStatus(orderInfo);
            // Purchased
            insertRowInSection(lineId,orderStatus);
        })
    };

    //delete the original header and info
    textInfo.remove();
    textHeader.remove();
};

function setNewText(node, newText) {
    const children = Array.from(node.childNodes);

    children.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            child.textContent = newText;
            return;
        }
    });
}

function determineStatus(orderInfo) {
    if (orderInfo.has_mini_hub){
        if (orderInfo.last_delivered_at){
            // Arrived to final
            return "arrived-final";
        }
        if (orderInfo.mini_hub_shipped_at ){
            // Shipped to final
            return "shipped-final";
        }
        if (orderInfo.mini_hub_accepted_at){
            // Arrived to local
            return "arrived-local";
        }
        if (orderInfo.shipped_at) {
            // Shipped to local
            return "shipped-local";
        }
    }else{
        if (orderInfo.first_delivered_at){
            //Arrived to final
            return "arrived-final"
        }
        if (orderInfo.shipped_at) {
            // Shipped to final
            return "shipped-final";
        }
    }
    if (orderInfo.closed_at){
        // Processed
        return "processed";
    }
    return "purchased"
}

function insertRowInSection(lineId,sectionId){
    let info = document.getElementById(`info-${sectionId}`)
    let tableRow = document.querySelector(`tr[data-future-order-line-id="${lineId}"]`);
    info.parentNode.insertBefore(tableRow,info.nextSibling);
    increaseCardCount(document.getElementById(`header-${sectionId}`));
}

function increaseCardCount(node) {
    const children = Array.from(node.childNodes);
    children.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            let n = parseInt(child.textContent.split(" ")[0]);
            child.textContent=child.textContent.replace(/\d+/,n+1);
            return;
        }
    });
};

main();
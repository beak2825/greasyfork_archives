// ==UserScript==
// @name         GPG File Claim Auto Fill
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Auto fill a file claim in GPG bakcend for review.
// @author       Nech
// @match      https://admin.genuinepartsgiant.com/*/fileClaimList
// @match      https://admin.genuinepartsgiant.com/popup/*/invoice/*
// @match      https://admin.genuinepartsgiant.com/popup/*/verifyFileClaim/orders/*/fileClaims/*/invoices/*
// @match      https://onlineclaims.usps.com/*
// @match      https://www.fedex.com/apps/onlineclaims/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @require      https://code.jquery.com/jquery-2.2.0.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require      https://greasyfork.org/scripts/15924-jspdf/code/jsPDF.js?version=99137
// @require      https://greasyfork.org/scripts/388210-html2pdf-js/code/html2pdfjs.js?version=722443
// @grant GM_deleteValue
// @grant GM_openInTab
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_addValueChangeListener
// @grant GM_download
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/425951/GPG%20File%20Claim%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/425951/GPG%20File%20Claim%20Auto%20Fill.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, jsPDF */
function GetCarrierInfo(tracking_number, fedex_freight) {
// Distinguish Fedex and Fedex Freight
    var carrier = "";
    var carrier_no = 0;
    var usps_regex = /^(9)/g;
    var fedex_regex = /^[37]/g;
    var ups_regex= /^(1Z)/g;
    if (fedex_regex.test(tracking_number)) {
        if (fedex_freight == 1) carrier = "Fedex Freight";
        else carrier = "Fedex";
        carrier_no = "3";
    } else if (usps_regex.test(tracking_number)) {
        carrier = "USPS";
        carrier_no = "1";
    } else if (ups_regex.test(tracking_number)) {
        carrier = "UPS";
        carrier_no = "2";
    } else {
        alert("Unkown carrier for " + tracking_number);
    }
    var carrier_name = carrier;
    if (carrier == "Fedex Freight") carrier_name = "Fedex";

    var carrierInfo = {};
    carrierInfo.carrier = carrier;
    carrierInfo.carrier_name = carrier_name;
    carrierInfo.carrier_no = carrier_no;
    return carrierInfo;
}

function setNativeValue(element, value) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
}

if (location.pathname.includes ('verifyFileClaim')) {

    // TODO: Not sure if the button is always there, can be improved.
    waitForKeyElements ('button:contains("Deny")', getAllInfo);

    function getAllInfo (jNode) {
        var order_number = $('strong:contains("Sales Order")').text().trim().split(":")[1].trim();
        var invoice_number = $('strong:contains("Invoice No.")').text().trim().split(":")[1].trim();
        var tracking_number = $('label:contains("Tracking Number")').parent().find('a').text().trim();
        var brand = location.pathname.split("/")[2];
        var reason_textfield = $('label:contains("Reason For Claim")').attr("for");
        var reason = $("#" + reason_textfield + "-option").text();

        GM_deleteValue(order_number);
        GM_setValue(order_number, JSON.stringify({
            order_number: order_number,
            invoice_number: invoice_number,
            brand: brand,
            tracking_number: tracking_number,
            reason: reason
        }));

        // XXX: Get Invoice url, this assumes the invoice number is always in the following format XXXNNNNNN while the
        // last 6 digits are the same one used in the url.
        var invoice_url = "https://admin.genuinepartsgiant.com/popup/" + brand + "/invoice/" + invoice_number.substring(3);
        // Open the invoice window, this script should auto-run on that window and collect all essential information.
        GM_openInTab(invoice_url, {loadInBackground: true});

        var interval = setInterval(function(e) {
            // If invoice_visited is defined, that means we got everything we want from the invoice page.
            var claim_info = JSON.parse(GM_getValue(order_number, {}));
            if (typeof claim_info.invoice_visited == 'undefined') return;

            console.log(claim_info);

            var carrier_info = GetCarrierInfo(claim_info.tracking_number, claim_info.fedex_freight);
            var carrier_text_field = $('label:contains("File claim with")').attr("for");
            $("span#" + carrier_text_field + "-option").attr("aria-label", carrier_info.carrier_name);
            $("span#" + carrier_text_field + "-option").attr("aria-posinset", carrier_info.carrier_no);
            $("span#" + carrier_text_field + "-option").find('span').text(carrier_info.carrier_name);
            var carrier_txt = $('<div><p style="color:red;"> SELECT ' + carrier_info.carrier_name + ' Here!! </p></div>');
            $("span#" + carrier_text_field + "-option").parent().append(carrier_txt);

            var subtotal = claim_info.Subtotal;
            var subtotal_textfield = $('label:contains("Total Amonut for issue parts")').attr("for");
            setNativeValue(document.getElementById(subtotal_textfield), subtotal);
            document.getElementById(subtotal_textfield).dispatchEvent(new Event('input', { bubbles: true }));
            $("input#" + subtotal_textfield).parent().append($('<div>' + subtotal + '</div>'));


            var best_shipping = claim_info.shipping_total;
            var best_shipping_textfield = $('label:contains("Total shipping for issue parts")').attr("for");
            setNativeValue(document.getElementById(best_shipping_textfield), best_shipping);
            document.getElementById(best_shipping_textfield).dispatchEvent(new Event('input', { bubbles: true }));
            $("input#" + best_shipping_textfield).parent().append($('<div>' + best_shipping + '</div>'));

            // claimed_parts will contain same items only one times if partqty is > 1.
            var claimed_parts = []
            var claimed_price = 0;
            var claimed_items_number = 0;
            $('table > tbody  > tr').each(function(index, tr) {
                var PartNo = $(this).find("td:eq(0)").text().trim();
                var PartDesc = $(this).find("td:eq(1)").text().trim();
                var PartQty = $(this).find("td:eq(2)").text().trim();
                var claimed_part = {
                    PartNo: PartNo,
                    PartDesc: PartDesc,
                    PartQty: PartQty
                };

                var all_parts_info = JSON.parse(claim_info.all_parts_info);
                if (all_parts_info.hasOwnProperty(PartNo)) {
                    console.log(PartNo);
                    console.log(all_parts_info);
                    var price = all_parts_info[PartNo].unit_price;
                    claimed_part.PartPrice = price;
                    claimed_part.TotalPrice = (parseFloat(price) * parseFloat(PartQty)).toFixed(2);
                    claimed_price = claimed_price + claimed_part.TotalPrice;
                } else {
                    alert("Invoice does not contain part " + PartNo + ". Please retry or file this claim manually.");
                    return false;
                }

                claimed_parts[claimed_items_number] = JSON.stringify(claimed_part);
                claimed_items_number = claimed_items_number + 1;

            });

            claim_info.claimed_parts = claimed_parts;
            claim_info.claimed_items_number = claimed_items_number;

            if (carrier_info.carrier != "Fedex Freight" && claimed_price > 100) claimed_price = 100;
            claim_info.claimed_price = claimed_price.toFixed(2).toString();
            var claimed_price_textfield = $('label:contains("Claimed Amount for parts")').attr("for");
            setNativeValue(document.getElementById(claimed_price_textfield), claim_info.claimed_price);
            document.getElementById(claimed_price_textfield).dispatchEvent(new Event('input', { bubbles: true }));
            $("input#" + claimed_price_textfield).parent().append($('<div>' + claim_info.claimed_price + '</div>'));

            var claimed_shipping = parseFloat(best_shipping);
            if (carrier_info.carrier == "USPS" || carrier_info.carrier == "UPS") claimed_shipping = 0;
            claim_info.claimed_shipping = claimed_shipping.toFixed(2).toString();
            var claimed_shipping_textfield = $('label:contains("Claimed Amount for shipping")').attr("for");
            setNativeValue(document.getElementById(claimed_shipping_textfield), claim_info.claimed_shipping);
            document.getElementById(claimed_shipping_textfield).dispatchEvent(new Event('input', { bubbles: true }));
            $("input#" + claimed_shipping_textfield).parent().append($('<div>' + claim_info.claimed_shipping + '</div>'));

            var total_claimed = claimed_price + claimed_shipping;
            claim_info.total_claimed = total_claimed.toFixed(2).toString();
            var total_claimed_textfield = $('label:contains("Total requested Amount:")').attr("for");
            setNativeValue(document.getElementById(total_claimed_textfield), claim_info.total_claimed);
            document.getElementById(total_claimed_textfield).dispatchEvent(new Event('input', { bubbles: true }));
            $("input#" + total_claimed_textfield).parent().append($('<div>' + claim_info.total_claimed + '</div>'));

            var date_textfield = $('label:contains("Date filed")').attr("for");
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth() + 1;
            var date = today.getDate();
            var today_date = year + "-" + month + "-" + date;
            //setNativeValue(document.getElementById(date_textfield), today_date);
            //document.getElementById(date_textfield).dispatchEvent(new Event('input', { bubbles: true }));
            $('label:contains("Date filed")').append($('<div><p style="color:red;"> SELECT Date Here!! </p></div>'));

            GM_setValue(order_number, JSON.stringify(claim_info));

            var claim_button = $('<button type="button" class="ms-Button ms-Button--default root-87" style="margin-left: 10px;" id="claim_button">Claim</button>');
            $('button:contains("Deny")').parent().append(claim_button);

            // Download the invoice. Currently must be done manually.
            var invoice_download_url = "https://admin.genuinepartsgiant.com/popup/" + claim_info.brand + "/invoicePrint/" + invoice_number.substring(3) + "/1";
            // Unable to use jspdf, so must manually download here.
            //GM_openInTab(invoice_download_url, {active: true, setParent: true, insert: true});
/*
            $.get(invoice_download_url).success(function(invoice_doc){
                var local_path = order_number + '.pdf';
                var stringToHTML = function (str) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(str, 'text/html');
                    return doc.body;
                };
                var opt = {
                    margin:       1,
                    filename:     local_path,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                var element = stringToHTML(invoice_doc);
                console.log(element);
                html2pdf().set(opt).from(element).save();
            });
*/


            $('#claim_button').click(function() {
                GM_deleteValue("CurOrderNumber");
                GM_setValue("CurOrderNumber", order_number);

                GM_openInTab(invoice_download_url, {active: true, setParent: true, insert: true});

                if (carrier_info.carrier_name == "USPS") {
                    var USPS_Claim_URL = "https://onlineclaims.usps.com/OICWeb";
                    GM_openInTab(USPS_Claim_URL, {active: true, setParent: true, insert: true});
                } else if (carrier_info.carrier_name == "Fedex") {
                    var Fedex_Claim_URL = "https://www.fedex.com/apps/onlineclaims";;
                    GM_openInTab(Fedex_Claim_URL, {active: true, setParent: true, insert: true});
                }
            });

            console.log(claim_info);
            clearInterval(interval);
        }, 10);
    }


}
else if (location.pathname.includes ('invoice') && !location.pathname.includes ('fileClaims')) {
// If we are on the invoice page, we collect these shipping and parts information.
// Note that these are related to the different orders, so we update the claim_info stored in local storage.
// We need to check if the corresponding order exists, if not, there must be something wrong in the script
// so we rise an alarm.
// Should match url: https://admin.genuinepartsgiant.com/popup/<brand>/invoice/<invoice_number:6 digits>
    waitForKeyElements ("a.ms-Link", actionFunction);

    function actionFunction (jNode) {
        var order_number = $('strong:contains("Sales Order")').text().trim().split(":")[1].trim();
        var invoice_number = $('strong:contains("Invoice No")').not(":contains('Vendor')").text().trim().split(":")[1].trim();

        console.log(order_number);
        console.log(invoice_number);

        var claim_info = JSON.parse(GM_getValue(order_number, {}));

        var invoice_date = $('strong:contains("Invoice Date")').text().trim().split(":")[1].trim();
        claim_info.invoice_date = invoice_date;
        var order_date = $('strong:contains("Order Date")').text().trim().split(":")[1].trim();
        claim_info.order_date = order_date;

        var first_name = $('strong:contains("Shipping Information")').parent().parent().find('span:eq(1)').text().trim().split(" ")[0].trim();
        var last_name = $('strong:contains("Shipping Information")').parent().parent().find('span:eq(1)').text().trim().split(" ")[1].trim();
        var street_address = $('strong:contains("Shipping Information")').parent().parent().find('span:eq(2)').text().trim();
        var apt_suit = $('strong:contains("Shipping Information")').parent().parent().find('span:eq(3)').text().trim();
        var city = $('strong:contains("Shipping Information")').parent().parent().find('div:eq(0)').find('span:eq(0)').text().trim();
        var state = $('strong:contains("Shipping Information")').parent().parent().find('div:eq(0)').find('span.item-container:eq(0)').text().trim();
        var zipcode = $('strong:contains("Shipping Information")').parent().parent().find('div:eq(0)').find('span.item-container:eq(1)').text().trim();
        claim_info.first_name = first_name;
        claim_info.last_name = last_name;
        claim_info.street_address = street_address;
        claim_info.apt_suit = apt_suit;
        claim_info.city = city;
        claim_info.state = state;
        claim_info.zipcode = zipcode;

        var all_parts_info = {}

        var tmpcount = 0;
        $('table > tbody  > tr').each(function(index, tr) {
            var tmp = $(this).find("td:eq(0)").text().trim();

            if (tmp == "Subtotal" || tmpcount == 1) {
                var tmp_data = $(this).find("td:eq(1)").find('span:eq(0)').text().trim();
                // trim leading $
                if (tmp_data[0] == "$") {
                    tmp_data = tmp_data.substring(1);
                }
                if (tmpcount == 0) {
                    claim_info.Subtotal = tmp_data;
                    tmpcount = 1;
                } else if (tmpcount == 1) {
                    if (tmp == "FedEx Freight") claim_info.fedex_freight = 1;
                    else claim_info.fedex_freight = 0;
                    claim_info.shipping_total = tmp_data;
                    tmpcount = 2;
                }

            } else if (tmp == "Tax") {
            } else if (tmp == "Total") {
            } else {
                var parts_no = $(this).find("td:eq(1)").find('span:eq(0)').text().trim();
                // The descripton here could be empty!!! Some weird structure in the website design.
                var description = $(this).find("td:eq(2)").text();
                var quantity = $(this).find("td:eq(3)").text();
                var unit_price = $(this).find("td:eq(4)").text();
                var part_info = {
                    parts_no: parts_no,
                    description: description,
                    quantity: quantity,
                    unit_price: unit_price
                };
                all_parts_info[parts_no] = part_info;
                // console.log(all_parts_info[parts_no]);
            }
        });

        claim_info.all_parts_info = JSON.stringify(all_parts_info);
        // Set the flag to 1.
        claim_info.invoice_visited = 1;

        console.log(claim_info);
        GM_setValue(order_number, JSON.stringify(claim_info));
        // If you want to close the opened popup window, uncomment the following line.
        // Note: This may have a global effect that even if you open this window manually, it will be closed automatically.
        close();

    }
} else if (location.origin.includes("usps") && location.pathname == ("/OICWeb/")) {
    // TODO We enter tracking numebr and shipping date on this page, user press search to simply the script.
    waitForKeyElements ("#searchBtn", actionFunction);

    function actionFunction (jNode) {

        var order_number = GM_getValue("CurOrderNumber", "");

        var claim_info = JSON.parse(GM_getValue(order_number, {}));
        var invoice_number = claim_info.invoice_number;
        var tracking_number = claim_info.tracking_number;
        var invoice_date = claim_info.invoice_date;

        console.log(invoice_date);
        $('#tTrackingNumber').val(tracking_number);
        $('#shipping-date').val(invoice_date);
    }
} else if (location.origin.includes("usps") && location.pathname.includes("OICWeb/searchClaim")) {
    waitForKeyElements ("#tClaimNickname", actionFunction);

    function actionFunction (jNode) {

        var order_number = GM_getValue("CurOrderNumber", "");
        var claim_info = JSON.parse(GM_getValue(order_number, {}));
        var invoice_number = claim_info.invoice_number;
        var reason = claim_info.reason;

        var reason_select = {}
        reason_select["Loss Package"] = "AND";
        reason_select.Damaged = "DMG";
        reason_select.Missing = "MSG"

        $('#sReasonClaim').val(reason_select[reason]);
        $('#tInsuranceFees').val("0");
        $('#rMailer').prop("checked", true);
        $('#tNameFirstAddressee').val(claim_info.first_name);
        $('#tNameLastAddressee').val(claim_info.last_name);
        $('#tAddress1Addressee').val(claim_info.street_address);
        $('#tAddress2Addressee').val(claim_info.apt_suit);
        $('#tCityAddressee').val(claim_info.city);
        $('#stateAddressee option:contains(' + claim_info.state + ')').attr('selected', 'selected');
        $('#tZipAddressee').val(claim_info.zipcode);
        $('#tClaimNickname').val(order_number);

        var claimed_parts = claim_info.claimed_parts;
        console.log(claimed_parts);
        var claimed_items_number = claim_info.claimed_items_number;

        var i = 0;
        var item;
        item = JSON.parse(claimed_parts[i]);
        console.log(item);
        $('#tItemNickname').val(item.PartNo);
        $('#sItemType').val("15"); // Other
        $('#tOtherItem').val("Auto Parts");
        $('#tItemDescription').val(item.PartDesc);
        $('#tPurchaseDate').val(claim_info.order_date);
        $('#tAmountRequested').val(item.TotalPrice);

        $("#addAnotherItemBtn").click(function() {
            i = i + 1;
            item = JSON.parse(claimed_parts[i]);
            console.log(item);
            $('#tItemNickname').val(item.PartNo);
            $('#sItemType').val("15"); // Other
            $('#tOtherItem').val("Auto Parts");
            $('#tItemDescription').val(item.PartDesc);
            $('#tPurchaseDate').val(claim_info.order_date);
            $('#tAmountRequested').val(item.TotalPrice);
        });

    }
} else if (location.origin.includes("fedex") && location.pathname.includes("apps/onlineclaims")) {

    waitForKeyElements ("#tracking_nbr_cont_btn", actionFunction1);

    function actionFunction1 (jNode) {

        var order_number = GM_getValue("CurOrderNumber", "");

        var claim_info = JSON.parse(GM_getValue(order_number, {}));
        var invoice_number = claim_info.invoice_number;
        var tracking_number = claim_info.tracking_number;
        var reason = claim_info.reason;

        var reason_select = {}
        reason_select["Loss Package"] = 1;
        reason_select.Damaged = 3;
        reason_select.Missing = 2;

        console.log(tracking_number);
        $('#trackingNumber').val(tracking_number);
        $('#claimType').prop('selectedIndex', reason_select[reason]);
        $('#claimType').parent().append('<div><p style="color:red;"> ' + reason + ': ' + $('#claimType option').eq(reason_select[reason]).text() + ' </p></div>');
        waitForKeyElements ('#shipment_info_cont_btn', actionFunction2);
    }


    function actionFunction2 (jNode) {
        var order_number = GM_getValue("CurOrderNumber", "");
        var claim_info = JSON.parse(GM_getValue(order_number, {}));

        // We have four company names, which are "Genuine Parts Giant", "Genuine Parts Source", "Original Parts Giant" and "Auto Parts Prime".
        // According the brand info, we can determine which company name we should log.
        var brand = claim_info.brand;
        var company_name = "";
        var gpg = ["HPN", "APW", "MPG"];
        var gps = ["TPD", "TPP", "FPP", "GPP", "BPD"];
        var app = ["LPN", "KPN", "HPD", "NPD", "IPD"];
        var opg = ["GPG", "SPD", "FPG"];
        if (gpg.includes(brand)) {
            company_name = "Genuine Parts Giant";
        } else if (gps.includes(brand)) {
            company_name = "Genuine Parts Source";
        } else if (app.includes(brand)) {
            company_name = "Auto Parts Prime";
        } else if (opg.includes(brand)) {
            company_name = "Original Parts Giant";
        }
        console.log(brand, company_name);
        // Here only gives a hint about the company to use as it has a weird behavior on Fedex.
        // Also, chrome's auto-fill works pretty well here.
        var company_name_txt = $('<div><p style="color:red;"> COMPANY NAME: ' + company_name + ' </p></div>');
        $("#company_name_div").parent().append(company_name_txt);
//         $('#company_name_div').find('input').val(company_name);
//         $('#country_div select option[value="US"]').prop('selected', true);
//         $('#zip_div').find('input').val("91733");
//         $('#street_div').find('input:eq(0)').val("2500 Try Ave");
//         $('#city_div').find('input').val("SOUTH EL MONTE");
//         $('#state_div select option[value="CA"]').prop('selected', true);
//         $('#phone_div').find('input:eq(0)').val("626-636-8817");

        var claimed_parts = claim_info.claimed_parts;
        console.log(claimed_parts);
        var claimed_items_number = claim_info.claimed_items_number;

        var i = 0;
        for (i = $('#claimItems > div').length; i < claimed_items_number; i++) {
            $('#addAnotherItem').click();
        }
        for (i = 0; i < claimed_items_number; i++) {
            var item;
            item = JSON.parse(claimed_parts[i]);
            $('#claimItems').children('div').eq(i).find('textarea').val(item.PartDesc);

            var claimItems_desc_txt = $('<div><p style="color:red;"> Enter SPACE after text. </p></div>');
            $('#claimItems').children('div').eq(i).find('textarea').parent().append(claimItems_desc_txt);

            // $('#claimItems').children('div').eq(i).find('input').eq(0).val(item.PartPrice);
            var claimItems_unit_txt = $('<div><p style="color:red;"> ' + item.PartPrice + ' </p></div>');
            $('#claimItems').children('div').eq(i).find('input').eq(0).parent().append(claimItems_unit_txt);

            // $('#claimItems').children('div').eq(i).find('input').eq(1).val(item.PartQty);
            var claimItems_num_txt = $('<div><p style="color:red;"> ' + item.PartQty + ' </p></div>');
            $('#claimItems').children('div').eq(i).find('input').eq(1).parent().append(claimItems_num_txt);

            // setNativeValue( $('#claimItems').children('div').eq(i).find('input').eq(1)[0], item.PartQty);
            // document.getElementById($('#claimItems').children('div').eq(i).find('input').eq(1)[0]).dispatchEvent(new Event('input', { bubbles: true }));
        }
        $('#freightAmount').val(claim_info.claimed_shipping);

        // $('#customer_reference_number_inputBox').val(claim_info.order_number);
        $('#customer_reference_number_inputBox').parent().append('<div><p style="color:red;"> ' + claim_info.order_number + ' </p></div>');

        // $('#commodityInput').find('p[data-value="00"]').attr('class', "choosen");
        $('#commodityInput').find('p[data-value="00"]').parent().parent().append('<div><p style="color:red;"> MODIFY HERE!!! </p></div>');

        $('#additional_comments_textarea').val("Auto Parts");
        $('#additional_comments_textarea').parent().append('<div><p style="color:red;"> Enter SPACE after text. </p></div>');


    }

}
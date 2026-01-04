// ==UserScript==
// @name         Tesseract Print
// @namespace    https://k33k00.com/2022/09/07/tesseract-aslovi-a-quicker-way-to-print-out-labels/
// @version      0.1
// @description  Add a simpler, quicker print function to the Tesseract stock management system
// @author       Kieran Wynne
// @match        https://*.asolvi.io/ServiceCentre/SC_RepairJob/aspx/repairjob_modify.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asolvi.io
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.6.1/toastify.js
// @require      https://cdn.jsdelivr.net/npm/winbox@0.2.6/dist/winbox.bundle.min.js
// @run-at       document-idle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/450957/Tesseract%20Print.user.js
// @updateURL https://update.greasyfork.org/scripts/450957/Tesseract%20Print.meta.js
// ==/UserScript==

const job_ref6_element_id = "#scmaster_cplMainContent_txtJobRef6";
const viewstate_element_id = "#__VIEWSTATE";
const viewstateGen_element_id = "#__VIEWSTATEGENERATOR";
const CallSerNum_element_id = "#scmaster_cplMainContent_cboCallSerNum";
const CallNum_element_id = "#scmaster_cplMainContent_lblCallNumVal";
let printWindow = new WinBox("Print?", {}).minimize(true);
let job_ref6_elem = document.querySelector(job_ref6_element_id);
let viewstate_elem = document.querySelector(viewstate_element_id);
let viewstateGen_elem = document.querySelector(viewstateGen_element_id);
let CallSerNum_elem = document.querySelector(CallSerNum_element_id);
let CallNum_elem = document.querySelector(CallNum_element_id);
let domain = window.location.host.split('.')[0]



preEmptPrint();
function printTrigger(e) {
  printWindow.show();
}
function preEmptPrint() {
  fetch(`https://${domain}.asolvi.io/ServiceCentre/SC_Reporting/aspx/report_ssrs_selections.aspx?Report_Id=386&FromName=call&FromURL=SC_RepairJob%2faspx%2fRepairJob_query.aspx&StdInput=KeyValue%3d${CallNum_elem.innerText}&EmbedReport=Y&KEY_VALUE=SCCall%1eCall_Num%1f${CallNum_elem.innerText}%1flong&ORIGIN=PRINT&FROM=call`, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-GB,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": '"Microsoft Edge";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1"
    },
    "referrer": `https://${domain}.asolvi.io/ServiceCentre/SC_Reporting/aspx/report_ssrs_selections.aspx?Report_Id=386&FromName=call&FromURL=SC_RepairJob%2faspx%2fRepairJob_query.aspx&StdInput=KeyValue%3d${CallNum_elem.innerText}&EmbedReport=N&KEY_VALUE=SCCall%1eCall_Num%1f${CallNum_elem.innerText}%1flong&ORIGIN=PRINT&FROM=call`,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `txtXLControlId=&txtCustomMandatoryFields=&txtCustomMandatoryMsgs=&txtCustomMaskFields=&txtCustomMaskMsgs=&txtCustomMaskRegex=&__EVENTTARGET=&__EVENTARGUMENT=&scmaster_cplMainContent_rolParameters_state=0&__VIEWSTATE=&__VIEWSTATEGENERATOR=09BFEFC8&__VIEWSTATEENCRYPTED=&scmaster%24cplMainContent%24txtReport_Title=Workshop+Shipping+-+DYMO&scmaster%24cplMainContent%24txtQueryH_ID=&scmaster%24cplMainContent%24txtQueryH_Desc=&scmaster%24cplMainContent%24cboQueryHGroupCode=&scmaster%24cplMainContent%24grdResults%24ctl02%24txtParamValueSelect=${CallNum_elem.innerText}&scmaster%24cplMainContent%24grdResults%24ctl02%24lstParamMultiValueListField=&scmaster%24cplMainContent%24txtFormEvent=onSubmit&scmaster%24cplMainContent%24txtReturnMsg=&scmaster%24cplMainContent%24txtFunctionsDesc=reports+selection&scmaster%24cplMainContent%24txtSubmitEnabled=Y&scmaster%24cplMainContent%24txtClearEnabled=Y&scmaster%24cplMainContent%24txtPrintEnabled=N&scmaster%24cplMainContent%24txtHelpEnabled=Y&scmaster%24cplMainContent%24txtDeleteEnabled=N&scmaster%24cplMainContent%24txtRunReportFlag=&scmaster%24cplMainContent%24txtAltReportID=0&scmaster%24cplMainContent%24txtDropdownStandardWidth=600px&scmaster%24cplMainContent%24txtDropdownWideWidth=950px&scmaster%24cplMainContent%24txtReport_ID=386&scmaster%24cplMainContent%24txtReport_File_Name=WorkshopShippingLabel-DYMO&scmaster%24cplMainContent%24txtReport_Table_Name=SCCALL&scmaster%24cplMainContent%24txtCompanyName=&scmaster%24cplMainContent%24txtReportURL=&scmaster%24cplMainContent%24txtDirectFromInvoicing=&scmaster%24cplMainContent%24txtFromName=call&scmaster%24cplMainContent%24txtFromURL=SC_RepairJob%2Faspx%2FRepairJob_query.aspx&scmaster%24cplMainContent%24txtStdInput=KeyValue%3D${CallNum_elem.innerText}&scmaster%24cplMainContent%24txtOrigin=PRINT&scmaster%24cplMainContent%24txtEmbedReport=false&scmaster%24cplMainContent%24txtLoad_QueryH_ID=&scmaster%24cplMainContent%24txtAdvSelRowCount=1&scmaster%24cplMainContent%24txtPass_Group=ADMIN&scmaster%24cplMainContent%24txtAllowInvoicePrintedUpdate=&scmaster%24cplMainContent%24txtAllowPReqPrintedUpdate=&scmaster%24cplMainContent%24txtUpdateMsg1=Do+you+wish+to+update+these+Invoices+as+having+been+Printed%3F&scmaster%24cplMainContent%24txtUpdateMsg2=Do+you+wish+to+update+these+Parts+Requests+as+having+been+Printed%3F&scmaster%24cplMainContent%24txtInvType=&scmaster%24cplMainContent%24txtCreditPrinted=&scmaster%24cplMainContent%24txtAllowCreditPrintedUpdate=&scmaster%24cplMainContent%24txtUpdateMsg3=This+Credit+Note+has+already+been+updated+as+Printed.&scmaster%24cplMainContent%24txtUpdateMsg4=Do+you+wish+to+update+this+Credit+Note+as+having+been+Printed%3F&scmaster%24txtMenuBtnClickBgColor=&scmaster%24txtLayoutStyle=&scmaster%24txtShowPageListMenuAsDropdown=&scmaster%24txtClientDateFormat=dd%2FMM%2Fyyyy&scmaster%24txtClientTimeFormat=HH%3Amm&scmaster%24txtClientLongDateFormat=dd+MMMM+yyyy&scmaster%24txtClientLongTimeFormat=HH%3Amm%3Ass&scmaster%24txtClientDateSeparator=%2F&scmaster%24txtClientTimeSeparator=%3A&scmaster%24txtClientTimeAMDesignator=AM&scmaster%24txtClientTimePMDesignator=PM&scmaster%24txtClientDecimalSeparator=.&scmaster%24txtSiteRoot=%2FServiceCentre%2F&scmaster%24txtPageFunctionsNum=1640&scmaster%24txtInitialFocusControlId=&scmaster%24txtInitialScrollPosControlId=`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then((data) => {
    printWindow.setUrl(data.url);
  });
}
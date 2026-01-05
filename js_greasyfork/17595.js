// ==UserScript==
// @name         EOL update entry
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yan
// @include      http://dx-pvs-stage.juniper.net/eol/eolRecord/edit.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17595/EOL%20update%20entry.user.js
// @updateURL https://update.greasyfork.org/scripts/17595/EOL%20update%20entry.meta.js
// ==/UserScript==
/* jshint -W097 */


var input1 = document.createElement('input');
input1.id = 'xlsfile';
input1.type = 'file';
input1.name = 'file';
input1.accept = 'application/vnd.ms-excel';

(function injectJs() {
    var scr = document.createElement('script');
    scr.type = 'text/javascript';
    scr.src = 'https://cdn.rawgit.com/SheetJS/js-xls/master/xls.js';
    document.getElementsByTagName('head') [0].appendChild(scr);
})()


function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    return result;
}
prefix = 'http://dx-pvs-stage.juniper.net/eol/eolRecord/edit.htm?recordId='
tail = '&action=view';
mapping = {"EOL_MATRIX_ID":"record.matrixId",
"MODEL_ID":"record.model.modelId",
"ANNOUNCEMENT_TYPE":"record.announcementType",
"NOTE":"record.note",
"PRODUCT":"record.product",
"LAST_SOFTWARE_VERSION":"record.lastSoftwareVersion",
"TOP_LEVEL_ASSY_NUM":"record.topLevelAssyNum",
"CIRCUIT_ASSY_NUM":"record.circuitAssyNum",
"PSN_NUMBER":"record.psnNumber.id",
"PSN_NUMBER_URL":"record.psnNumber.url",
"MEMORY":"record.memory",
"IS_MEMORY_USED":"record.memoryUsed",
"STATUS":"record.status",
"REPLACEMENT_MODEL":"record.replacementModel",
"DESC_REPLACEMENT_MODEL":"record.descReplacementModel",
"MINIMUM_SOFTWARE_VERSION":"record.minimumSoftwareVersion",
"ANNOUNCED_DATE":"announcedDateStr",
"END_SALE_DATE":"endSaleDateStr",
"LAST_CUSTOMER_RECEIPT_DATE":"lastCustomerReceiptDateStr",
"END_WARRANTY_SVC_CNVRSN_DATE":"endWarrantyServiceConversionDateStr",
"FIRST_SERVICE_STEP_DOWN_DATE":"firstServiceStepDownDateStr",
"END_ENGINEERING_DATE":"endEngineeringDateStr",
"END_ENGINEERING_DATE_HW":"endEngineeringDateHardwareStr",
"SECOND_SERVICE_STEP_DOWN_DATE":"secondServiceStepDownDateStr",
"END_SERVICE_CONTRACT_RNWL_DATE":"endServiceContractRenewalDateStr",
"END_SERVICE_DATE":"endServiceDateStr"};

function handlefile(e) {
	var f = e.target.files[0];
	var reader = new FileReader();
	//var name = f.name;
	//console.log(name);
	reader.readAsBinaryString(f);
	reader.onload = function(e) {
		console.log('read file suc');
		var data = e.target.result;
		var X = XLS;
		var wb = X.read(data, {
			type: 'binary'
		});
		var xjson = to_json(wb);
		console.log(xjson);
		var rowall = xjson[Object.keys(xjson)[0]];
		for (var roww in rowall) {
			(function() {
				var contents = rowall[roww];
				var m_id = contents['EOL_MATRIX_ID'];
				var urll = prefix + m_id + tail;
				$.get(urll, function(data) {
					var form = $('#editRecordForm', data);
					for (var key in contents) {
						//form[mapping[key]] = contents[key];
						var map1 = mapping[key];
            	        $('#action', form).val('edit');
						$('[name='+map1+']',form[0]).val(contents[key]);
					}
					$.ajax({
						type: "POST",
						data: form.serialize(),
						traditional: true,
						url: "http://dx-pvs-stage.juniper.net/eol/eolRecord/edit.htm",
						success: function(data) {
							console.log(m_id + " success updated");
						}
					})
				})	
			})()
		}
	}
}

$(document).ready(function() {
    state = document.getElementById('left');
    state.appendChild(input1);
    $('#xlsfile')[0].addEventListener('change', handlefile, false);
})
// ==UserScript==
// @name         Rupashree QR Generate
// @namespace    http://tampermonkey.net/
// @version      1.1 (Beta)
// @description  Generate QR Code
// @author       Ashis Biswas
// @match 		 https://wbrupashree.gov.in/admin/dashboard
// @match 		 https://wbrupashree.gov.in/admin/dashboard/*
// @require		 https://code.jquery.com/jquery-3.4.1.min.js
// @require		 https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @grant        none
// @license      license MIT
// @downloadURL https://update.greasyfork.org/scripts/446618/Rupashree%20QR%20Generate.user.js
// @updateURL https://update.greasyfork.org/scripts/446618/Rupashree%20QR%20Generate.meta.js
// ==/UserScript==

$(document).ready(function(){

var root = `
<div class="row" id="qrSection">
	<div class="col-lg-6 col-xs-12">
		<div class="box box-warning">
			<div class="box-header with-border">
				<h3 class="box-title"><strong>Generate QR Code</strong></h3>
			</div>
			<div class="box-body">
				<div class="form-group">
					<div class="row">
						<div class="col-sm-6">
							<label>Applicant Name &nbsp;<font color="red">*</font></label>
						</div>
						<div class="col-sm-6">
							<input type="text" class="form-control" id="qr_applicant_name">
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6 mb-2">
							<label>Aadhaar No &nbsp;<font color="red">*</font></label>
						</div>
						<div class="col-sm-6">
							<input type="number" class="form-control" id="qr_applicant_aadhaar">
						</div>
					</div>
				</div>
			</div>
		</div>
        <div class="box">
	        <div class="box-body text-center">
		        <button type="button" id="btn_gen_qr" class="btn btn-info">Generate</button>
	        </div>
        </div>
	</div>
	<div class="col-lg-6 col-xs-12">
		<div class="box box-success">
	        <div class="box-body text-center">
				<div class="qr-code text-center"></div>
	        </div>
        </div>
	</div>
</div>`;
$(root).insertAfter(".content div.row:first-child");

$(document).on("click", "#btn_gen_qr", function() {
	var qr_applicant_name = $("#qr_applicant_name").val();
	var qr_applicant_aadhaar = $("#qr_applicant_aadhaar").val();

	var content =`<?xml version="1.0" encoding="UTF-8"?> <PrintLetterBarcodeData uid="${qr_applicant_aadhaar}" name="${qr_applicant_name}" gender="F"/>`;

	generate({
	  value: content
	});
});


function generate(data) {
	let qr_code_element = document.querySelector(".qr-code");
	qr_code_element.innerHTML = "";
	var qrcode = new QRCode(qr_code_element, {
		text: `${data.value}`,
		width: 250,
		height: 250,
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.H
	});

	let qr_code_img = document.querySelector("#qrPreview");
	let qr_code_canvas = document.querySelector("canvas");


	$(".qr-code img").css("margin", "auto");
}

});
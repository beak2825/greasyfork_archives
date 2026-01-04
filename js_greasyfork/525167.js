// ==UserScript==
// @name         OA
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  OLDAGE
// @author       AB
// @match		 https://jaibangla.wb.gov.in/*
// @match        https://jaibangla.wb.gov.in/findAadhaar
// @match        https://jaibangla.wb.gov.in/Viewmarkds*
// @match        https://jaibangla.wb.gov.in/application-list-common?scheme_id=10&type=V
// @match        https://ds.wb.gov.in/DDPS/Page/DDPS_Camp_Transaction_Entry*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525167/OA.user.js
// @updateURL https://update.greasyfork.org/scripts/525167/OA.meta.js
// ==/UserScript==

$(document).ready(function(){
	function fallbackCopyToClipboard(text) {
		// Create a temporary textarea element
		const textArea = document.createElement('textarea');
		textArea.value = text;
		
		// Make it invisible but keep it in the document
		textArea.style.position = 'fixed';
		textArea.style.opacity = '0';
		document.body.appendChild(textArea);
		
		// Select and copy the text
		textArea.select();
		try {
			document.execCommand('copy');
			console.log("Copied");
		} catch (err) {
			console.error('Failed to copy:', err);
		}
		
		// Clean up
		document.body.removeChild(textArea);
	}
	
	function fallbackReadFromClipboard() {
		const textArea = document.createElement('textarea');
		textArea.style.position = 'fixed';
		textArea.style.opacity = '0';
		document.body.appendChild(textArea);
		
		textArea.focus();
		document.execCommand('paste');
		const text = textArea.value;
		
		document.body.removeChild(textArea);
		return text;
	}
	
	if (window.location.href.indexOf("https://jaibangla.wb.gov.in/findAadhaar") !== -1) {

		let status = $('#bs-collapse .panel-body table tbody th:contains("Current Application Status")')
		.next('td').text().trim();

		if (status === "Verified but yet not Approved") {
			if ($('#bs-collapse').length > 0) {

				let idWithNumber = $('#bs-collapse .panel-heading[id^="heading_"]').attr('id');

				if (idWithNumber) {
					let match = idWithNumber.match(/heading_(\d+)/);
					if (match) {
						let idNumber = match[1]; // Extracted number

						let url = `http://jaibangla.wb.gov.in/Viewmarkds?ds_mark_phase=11&type=3&id=${idNumber}&scheme_id=10`;
						const tr_btn = `
						<tr>
							<th>Mark Beneficiary</th>
							<td colspan="2"><a href="${url}" target="_blank" class="btn btn-danger">Mark as DS</a><td>
						</tr>`;

						$("#bs-collapse .panel-body table tbody").append(tr_btn);
					}
				}


			}
		}


	}


	if (window.location.href.indexOf("https://jaibangla.wb.gov.in/Viewmarkds") !== -1) {
		
		let status1 = $("body > div.wrapper > div > section:nth-child(3) > div > div > div > div.modal-body > div.section1 > div:nth-child(3) > div:nth-child(1) > div").text().split(":")[1].trim();
		let status2 = $("body > div.wrapper > div > section:nth-child(3) > div > div > div > div.modal-body > div.section1 > div:nth-child(24) > div").text().replace("Mobile Number:", "").trim();
		const combinedText = status1 + ':' + status2;

		// Try modern clipboard API first
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(combinedText)
				.then(() => {
					console.log(combinedText)
				})
				.catch(() => {
					// If modern API fails, use fallback
					fallbackCopyToClipboard(combinedText);
				});
		} else {
			// Use fallback for older browsers
			fallbackCopyToClipboard(combinedText);
		}
		
		$("#ds_registration_no").focus();
	}

	const newMenu = `<li><a href="#" id="findById"><i class="fa fa-link"></i> <span>Mark DS BY ID</span></a></li>`;
	$(".sidebar-menu").append(newMenu);

	$("#findById").on("click", function(e){
		e.preventDefault();
		const uid = prompt("Please enter the UID:");

		// Check if the user provided a value
		if (uid) {
		  // Construct the URL with the entered UID
		  const dsUIDUrl = `http://jaibangla.wb.gov.in/Viewmarkds?ds_mark_phase=11&type=3&id=${uid}&scheme_id=10`;

		  // Navigate to the constructed URL
		  window.location.href = dsUIDUrl;
		}
	});


	if (window.location.href.indexOf("https://ds.wb.gov.in/DDPS/Page/DDPS_Camp_Transaction_Entry") !== -1) {
		
		window.addEventListener('message', function(event) {
			// Verify origin for security
			if (event.origin === "https://jaibangla.wb.gov.in/") {
				if (event.data.type === 'statusText') {
					console.log(event.data.text);
				}
			}
		});
		
		
		const btn_wrapper = `
			<div id="button_wrapper">
				<button type="button" class="btn btn-success" id="dsBtnMGO">Male/Gen/Old</button>
				<button type="button" class="btn btn-danger mr-3" id="dsBtnFGO">Fem/Gen/Old</button>
				
				<button type="button" class="btn btn-warning" id="dsBtnFGW">Fem/GEN/Widow</button>
				<button type="button" class="btn btn-info" id="dsBtnFSW">Fem/SC/Widow</button>
				<button type="button" class="btn btn-primary mr-3" id="dsBtnFSTW">Fem/ST/Widow</button>
				
				<button type="button" class="btn btn-warning" id="dsBtnCopy">Copy</button>
				<button type="button" class="btn btn-success" id="dsBtnGoBottom">Go To Bottom</button>
			</div>
		`;
		
		$(".sub-header").append(btn_wrapper);
		
		
		$("#dsBtnMGO").on("click", function(){
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_gender_0').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_caste_2').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl23_chk_Major_Scheme').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl36_chk_Major_Scheme').prop('checked', false);
			
			$('#ctl00_ContentPlaceHolder1_rdo_Beneficiary_Id_Document_Type_3').prop('checked', true);
		});
		
		$("#dsBtnFGO").on("click", function(){
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_gender_1').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_caste_2').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl23_chk_Major_Scheme').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl36_chk_Major_Scheme').prop('checked', false);
			
			$('#ctl00_ContentPlaceHolder1_rdo_Beneficiary_Id_Document_Type_3').prop('checked', true);
		});
		
		
		
		$("#dsBtnFGW").on("click", function(){
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_gender_1').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_caste_2').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl36_chk_Major_Scheme').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl23_chk_Major_Scheme').prop('checked', false);
			
			$('#ctl00_ContentPlaceHolder1_rdo_Beneficiary_Id_Document_Type_3').prop('checked', true);
		});
		
		$("#dsBtnFSW").on("click", function(){
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_gender_1').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_caste_0').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl36_chk_Major_Scheme').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl23_chk_Major_Scheme').prop('checked', false);
			
			$('#ctl00_ContentPlaceHolder1_rdo_Beneficiary_Id_Document_Type_3').prop('checked', true);
			
		});
		
		$("#dsBtnFSTW").on("click", function(){
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_gender_1').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rd_benficiary_caste_1').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl36_chk_Major_Scheme').prop('checked', true);
			$('#ctl00_ContentPlaceHolder1_rpt_Major_Scheme_ctl23_chk_Major_Scheme').prop('checked', false);
			
			$('#ctl00_ContentPlaceHolder1_rdo_Beneficiary_Id_Document_Type_3').prop('checked', true);
			
		});
		
		
		
		$("#dsBtnGoBottom").on("click", function(){
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
		});
		
		$("#dsBtnCopy").on("click", function(){
			if (navigator.clipboard && window.isSecureContext) {
				navigator.clipboard.readText()
					.then(text => {
						const [uname, mob] = text.split(':');
						console.log('Mob:', mob);
						console.log('Uname:', uname);
						
						$("#ctl00_ContentPlaceHolder1_txt_Mobile").val(mob);
						$("#ctl00_ContentPlaceHolder1_txt_Name").val(uname);
						
					})
					.catch(() => {
						// Use fallback if modern API fails
						const text = fallbackReadFromClipboard();
						const [uname, mob] = text.split(':');
						console.log('Mob:', mob);
						console.log('Uname:', uname);
						
						$("#ctl00_ContentPlaceHolder1_txt_Mobile").val(mob);
						$("#ctl00_ContentPlaceHolder1_txt_Name").val(uname);
					});
			}
		});
	}
});
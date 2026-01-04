// ==UserScript==
// @name         Rupashree Helper
// @namespace    http://tampermonkey.net/
// @version      2.9.5
// @description  Rupashree Helper helps you to make your life simple
// @author       Hopeless DEO
// @match        https://wbrupashree.gov.in/admin/*
// @require		 https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @require		 https://cdn.jsdelivr.net/npm/select2@4.0.8/dist/js/select2.full.min.js
// @require		 https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @require		 https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @require		 https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js
// @resource     select2CSS https://cdn.jsdelivr.net/npm/select2@4.0.8/dist/css/select2.min.css
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/398007/Rupashree%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/398007/Rupashree%20Helper.meta.js
// ==/UserScript==

GM_addStyle(`
	@import url("${GM_getResourceURL('select2CSS')}");
`);

$(document).ready(function(){

	let db;
	const request = indexedDB.open("rupashreeDB", 1);

	request.onerror = (event) => {
		console.error(`Database error: ${event.target.errorCode}`);
	};

	request.onsuccess = (event) => {
		db = event.target.result;


		/************************************************************************************************
		*										Section: Sync All Deo
		*************************************************************************************************/
		$('#syncDEOBtn').on('click', (e) => {

			e.preventDefault();

			let ajax_request = function(rup_link, el) {
				let deferred = $.Deferred();
				let parentTR = el;

				let finYear = $('#current_year').val();
				let userAppId = parentTR.find('td:eq(1)').text();
				let userMob = parentTR.find('td:eq(3)').text();
		        let uDOA = parentTR.find('td:eq(7)').text();
		        let uStatus = parentTR.find('td:eq(6)').text();

				// Start a transaction and get the object store
			    const transaction1 = db.transaction(['user'], 'readwrite');
			    const objectStore1 = transaction1.objectStore('user');

			    const searchReq = objectStore1.get(userAppId);

			    // Handle the results of the search
  				searchReq.onsuccess = (event) => {

  					const record = event.target.result;

					// Check if the record was found
					if (record) {

						if (record.status !== uStatus) {

							// Update the record
					        record.status = uStatus;
					        const updateRequest = objectStore1.put(record);

					        updateRequest.onsuccess = (event) => {
					        	$(el).removeClass('odd');
						    	$(el).removeClass('even');
						    	$(el).addClass('bg-aqua');

						    	deferred.resolve("ok");
					        };
						}else{
							deferred.resolve("ok");
						}

					}else{
						$(parentTR).css('position', 'relative');
						$(el).append('<div class="overlay" style="position:absolute; left:0; right:0; height:100%; width: 100%;"><i class="fa fa-refresh fa-spin"></i></div>');


						$.ajax({
							url : rup_link,
							type: "GET",
							dataType: "text",
							success: (data)=> {

								parentTR.find(".overlay").remove();

								//BASIC DETAILS
				                const uId = $(data).find("#app_basic_details table tr").eq(1);
				                let uIdTxt = uId.find('td:eq(1)').text();

				           		const uName = $(data).find("#app_basic_details table tr").eq(2);
				                let uNameTxt = uName.find('td:eq(1)').text();

				                const uMother = $(data).find("#app_basic_details table tr").eq(3);
				                let uMotherTxt = uMother.find('td:eq(1)').text();

				                const uFather = $(data).find("#app_basic_details table tr").eq(4);
				                let uFatherTxt = uFather.find('td:eq(1)').text();

				                const uDOB = $(data).find("#app_basic_details table tr").eq(5);
				                let uDOBTxt = uDOB.find('td:eq(1)').text();

				                const uPDM = $(data).find("#app_basic_details table tr").eq(6);
				                let uPDMTxt = uPDM.find('td:eq(1)').text();

				                const uMob = $(data).find("#app_basic_details table tr").eq(7);
				                let uMobTxt = uMob.find('td:eq(1)').text();

				                const uQual = $(data).find("#app_basic_details table tr").eq(8);
				                let uQualTxt = uQual.find('td:eq(1)').text();

				                const uCast = $(data).find("#app_basic_details table tr").eq(9);
				                let uCastTxt = uCast.find('td:eq(1)').text();

				                const uRelgn = $(data).find("#app_basic_details table tr").eq(10);
				                let uRelgnTxt = uRelgn.find('td:eq(1)').text();

				                //CONTACT DETAILS
				                const uPost = $(data).find("#app_contact_details table tr").eq(13);
				                let uPostTxt = uPost.find('td:eq(1)').text();

				                const uPolice = $(data).find("#app_contact_details table tr").eq(14);
				                let uPoliceTxt = uPolice.find('td:eq(1)').text();

				                const uGP = $(data).find("#app_contact_details table tr").eq(15);
				                let uGPTxt = uGP.find('td:eq(1)').text();

				                const uDist = $(data).find("#app_contact_details table tr").eq(16);
				                let uDistTxt = uDist.find('td:eq(1)').text();

				                const uBlock = $(data).find("#app_contact_details table tr").eq(17);
				                let uBlockTxt = uBlock.find('td:eq(1)').text();

				                const uPin = $(data).find("#app_contact_details table tr").eq(18);
				                let uPinTxt = uPin.find('td:eq(1)').text();

				                //BANK DETAILS EASY COPY
				                let uBank = $(data).find("#app_contact_details table tr").eq(21);
				                let uBankTxt = uBank.find('td:eq(1)').text();

				                let uAcc = $(data).find("#app_contact_details table tr").eq(22);
				                let uAccTxt = uAcc.find('td:eq(1)').text();

				                let uBranch = $(data).find("#app_contact_details table tr").eq(23);
				                let uBranchTxt = uBranch.find('td:eq(1)').text();

				                let uIfsc = $(data).find("#app_contact_details table tr").eq(24);
				                let uIfscTxt = uIfsc.find('td:eq(1)').text();

				                //GROOM DETAILS
				                const uGName = $(data).find("#groom_details table tr").eq(1);
				                let uGNameTxt = uGName.find('td:eq(1)').text();

				                const uGMother = $(data).find("#groom_details table tr").eq(2);
				                let uGMotherTxt = uGMother.find('td:eq(1)').text();

				                const uGFather = $(data).find("#groom_details table tr").eq(3);
				                let uGFatherTxt = uGFather.find('td:eq(1)').text();

				                const uGDOB = $(data).find("#groom_details table tr").eq(4);
				                let uGDOBTxt = uGDOB.find('td:eq(1)').text();

				                const uGState = $(data).find("#groom_details table tr").eq(10);
				                let uGStateTxt = uGState.find('td:eq(1)').text();

				                const uGPost = $(data).find("#groom_details table tr").eq(8);
				                let uGPostTxt = uGPost.find('td:eq(1)').text();

				                const uGPolice = $(data).find("#groom_details table tr").eq(9);
				                let uGPoliceTxt = uGPolice.find('td:eq(1)').text();

				                const uGGP = $(data).find("#groom_details table tr").eq(8);
				                let uGGPTxt = uGGP.find('td:eq(1)').text();

				                const uGDist = $(data).find("#groom_details table tr").eq(11);
				                let uGDistTxt = uGDist.find('td:eq(1)').text();

				                const uGBlock = $(data).find("#groom_details table tr").eq(12);
				                let uGBlockTxt = uGBlock.find('td:eq(1)').text();

				                const uGPIN = $(data).find("#groom_details table tr").eq(13);
				                let uGPINTxt = uGPIN.find('td:eq(1)').text();


				                const userData = {
				                	id: uIdTxt,
				                	name: uNameTxt.replace(/\s{2,}/g, ' '),
				                	mother: uMotherTxt.replace(/\s{2,}/g, ' '),
				                	father: uFatherTxt.replace(/\s{2,}/g, ' '),
				                	mobile: userMob,

									dob: uDOBTxt,
									pdm: uPDMTxt,
									qual: uQualTxt,
									cast: uCastTxt,
									relgn: uRelgnTxt,

									post: uPostTxt,
									police: uPoliceTxt,
									gp: uGPTxt,
									dist: uDistTxt.replace(/\s{2,}/g, ' '),
									block: uBlockTxt.replace(/\s{2,}/g, ' '),
									pin: uPinTxt,

									bank: uBankTxt.replace(/\s{2,}/g, ' '),
									acc: uAccTxt,
									ifsc: uIfscTxt,
									branch: uBranchTxt.replace(/\s{2,}/g, ' '),

									groom: uGNameTxt.replace(/\s{2,}/g, ' '),
									gMother: uGMotherTxt.replace(/\s{2,}/g, ' '),
									gFather: uGFatherTxt.replace(/\s{2,}/g, ' '),
									gDob: uGDOBTxt,
									gState: uGStateTxt.replace(/\s{2,}/g, ' '),
									gPost: uGPostTxt.replace(/\s{2,}/g, ' '),
									gPolic: uGPoliceTxt.replace(/\s{2,}/g, ' '),
									gGp: uGGPTxt.replace(/\s{2,}/g, ' '),
									gDist: uGDistTxt.replace(/\s{2,}/g, ' '),
									gBlock: uGBlockTxt.replace(/\s{2,}/g, ' '),
									gPin: uGPINTxt,

									status: uStatus.replace(/\s{2,}/g, ' '),
									doapp: '',
									doa: uDOA,
									dos: '',
									finYear: finYear,
				                };

				                const transaction2 = db.transaction(['user'], 'readwrite');
				                const objectStore2 = transaction2.objectStore('user');
							    const request = objectStore2.add(userData);

							    request.onsuccess = () => {
							    	$(el).removeClass('odd');
							    	$(el).removeClass('even');
							    	$(el).addClass('bg-green');
							    };

							    request.onerror = () => {
							    	$(el).removeClass('odd');
							    	$(el).removeClass('even');
							    	$(el).addClass('bg-red');
							    };

								deferred.resolve(data);
							},
							error: function(error) {
								deferred.reject(error);
							}
						});

					}

  				};

				return deferred.promise();
			};//end of ajax request


			let promises = [];

			$( "#example tbody tr" ).each(function( index ) {
				let rup_link = $( this ).find('td a.btn-success').attr('href');
			  	let pTR = $( this );

			  	let promise = ajax_request(rup_link, pTR);
			  	promises.push(promise);
			});

			$.when.apply($, promises).then(function() {
			  	alert("Data synchronization successfull");
			});
		});//end of all sync


		/************************************************************************************************
		*										Section: Export DB
		*************************************************************************************************/

		$('#menuExport').on('click', (e)=> {
			e.preventDefault();

			let tx = db.transaction(['user'], 'readonly');
  			let store = tx.objectStore('user');

  			let data = [];
			store.getAll().onsuccess = function(event) {
			    let data = event.target.result;
			    let jsonData = JSON.stringify(data);
			    let blob = new Blob([jsonData], { type: 'application/json' });
			    let currentDate = new Date().toISOString().slice(0, 10);
				let fileName = `myDB-${currentDate}.json`;
			    let url = URL.createObjectURL(blob);
			    let a = document.createElement('a');
			    a.href = url;
			    a.download = fileName;
			    document.body.appendChild(a);
			    a.click();
			    document.body.removeChild(a);
			    URL.revokeObjectURL(url);
			};
		});


		/************************************************************************************************
		*										Section: Import DB
		*************************************************************************************************/
		$('#menuImport').on('click', (e)=> {
			e.preventDefault();

			const importModalContent = `
				<div class="row" style="margin-top: 4rem;">
					<div class="col-sm-12">
						<div class="form-group">
							<label for="importDB">Select JSON File</label>
							<input type="file" id="importDB" accept=".json">
						</div>
					</div>
				</div>
				`;

			clearModalContent();

			$('#rpCommonModalTitle').text('Import Database');
			$('#rpCommonModalBody').append(importModalContent);

			$('#rpCommonModal').modal('show');
		});


		$(document).on("change", "#importDB", (e)=> {
			let file = e.target.files[0];
			let reader = new FileReader();
			reader.onload = function(event) {

				let jsonData = JSON.parse(event.target.result);

		  		let tx = db.transaction(['user'], 'readwrite');
		  		let store = tx.objectStore('user');

		  		store.clear();

		  		jsonData.forEach(obj => {
		    		store.add(obj);
		  		});

		  		tx.oncomplete = function() {
		    		//db.close();
		    		alert("Successfully Imported!!!");
		    		$('#rpCommonModal').modal('hide');
		  		};
			};

			reader.readAsText(file);
		});


		/************************************************************************************************
		*										Section: Export as excel
		*************************************************************************************************/

		$('#menuExcel').on('click', (e)=> {
			e.preventDefault();

			let xlsDefaultFields = ['id', 'name', 'acc'];
			let xlsFields = localStorage.getItem("xlsFields");

			if( !xlsFields ){
				localStorage.setItem("xlsFields", JSON.stringify(xlsDefaultFields));
				xlsFieldsObj = xlsDefaultFields;
			}else{
				xlsFieldsObj = JSON.parse(xlsFields);
			}

			//console.log( JSON.stringify(xlsFieldsObj) );

			const fieldModalContent = `
				<div class="row">
					<div class="col-sm-12">
						<label>Select the year:</label>
						<select class="form-control" id="yearFields" style="width:100%;">
							<option value="2019">2019-20</option>
							<option value="2020">2020-21</option>
							<option value="2021">2021-22</option>
							<option value="2022">2022-23</option>
							<option value="2023">2023-24</option>
							<option value="2024">2024-25</option>
							<option value="2025">2025-26</option>
						</select>
					</div>
					<div class="col-sm-12">
						<label>Select the export fields:</label>
						<select class="form-control select2" id="dbFields" multiple="multiple" data-placeholder="Select field" style="width:100%;">
						</select>
					</div>
				</div>
				`;

			clearModalContent();

			$('#rpCommonModalTitle').text('Export as excel');
			$('#rpCommonModalBody').append(fieldModalContent);
			$('#rpCommonModalFooter').append('<button type="button" id="btn_xls_export" class="btn btn-info">Export</button>');
			$('#rpCommonModal').modal('show');

			let xlsTx = db.transaction(['user'], 'readonly');
  			let xlsStore = xlsTx.objectStore('user');

  			$("#dbFields").append(`<option>${xlsStore.keyPath}</option>`);
  			for (let i = 0; i < xlsStore.indexNames.length; i++) {
				$("#dbFields").append(`<option>${xlsStore.indexNames[i]}</option>`);
			}

  			$('#dbFields').select2({
				theme: "classic"
			});

			// Set the default value
			$('#dbFields').val(xlsFieldsObj).trigger('change');
		});


		$(document).on("select2:select", function (evt) {

			let element = evt.params.data.element;
			let $element = $(element);

			$element.detach();
			$('#dbFields').append($element);
			$('#dbFields').trigger("change");
		});


		$(document).on("change", "#dbFields", function(evt){

			const selectedValues = $(this).val();
			//localStorage.setItem('xlsFields', JSON.stringify(selectedValues));
		});


		$(document).on("click", "#btn_xls_export", (e)=> {
			//alert($("#dbFields").val());

			let csv = $("#dbFields").val().toString();
			let yearFields = $("#yearFields").val();
			let fieldArray = csv.split(",");

			let objectStoreXLS = db.transaction(['user'], 'readonly').objectStore("user");
			let ind = objectStoreXLS.index("finYear");
			let kr = IDBKeyRange.only(yearFields);

			let xlsTable = '<table>';
			xlsTable += "<tr>";

			for (let i = 0; i < fieldArray.length; i++) {
		    	let fieldName = fieldArray[i];
		      	xlsTable += "<th>" + fieldName + "</th>";
		    }
		    xlsTable += "</tr>";

		    xlsTable += "<tr>";

			ind.openCursor(kr).onsuccess = function(event) {
				let cursor = event.target.result;
			  	if (cursor) {
			    	let user = cursor.value;
				    for (let i = 0; i < fieldArray.length; i++) {
				    	let fieldName = fieldArray[i];
				      	xlsTable += "<th>" + user[fieldName] + "</th>";
				    }
				    xlsTable += "</tr><tr>";
				    cursor.continue();
			  	}else {
			        xlsTable += "</tr></table>";

			        const parser = new DOMParser();
					const htmlDoc = parser.parseFromString(xlsTable, 'text/html');
			        export2Excel(htmlDoc);
			    }
			};
		});


		/************************************************************************************************
		*										Section: Applicant Search
		*************************************************************************************************/
		$('#menuSearch').on('click', (e)=> {
			e.preventDefault();

			const searchModalContent = `
				<div class="row">
					<div class="col-sm-6">
						<label>Search Criteria:</label>
						<select class="form-control" id="searchCriteria">
							<option value="name">Name</optiion>
							<option value="mobile">Mobile</optiion>
							<option value="acc">Bank Account</optiion>
						</select>
					</div>
					<div class="col-sm-6">
						<label>Search String:</label>
						<input type="text" class="form-control" id="searchStringInput">
					</div>
				</div>
				<div class="row" style="margin-top: 4rem;">
					<div class="col-sm-12" id="search_result">

					</div>
				</div>
				`;

			clearModalContent();

			$('#rpCommonModalTitle').text('Search Applicant');
			$('#rpCommonModalBody').append(searchModalContent);
			$('#modal-dlg').css('width', '90%');
			$('#rpCommonModalFooter').append('<button type="button" id="btn_rp_search" class="btn btn-info">Search</button>');

			$('#rpCommonModal').modal('show');

			$("#searchStringInput").focus();
		});

		$(document).on("click", "#btn_rp_search", (e)=> {

			let searchCriteria = $("#searchCriteria").val();
			let searchStringInput = $("#searchStringInput").val();

			if( searchStringInput  == ""){
				alert('Search string can\'t be blank', 'Rupashree Helper');
				$("#searchStringInput").focus();
				return false;
			}

			searchStringInput = searchStringInput.toUpperCase();

			const dataTableRoot = `
			<div class="box box-success">
				<div class="box-header">
			    	<h3 class="box-title text-center">Search Result</h3>
			  	</div>
			  	<div class="box-body table-responsive">
			    	<table id="dataTableRoot" class="table table-bordered table-striped" style="width: 100%;">
			      		<thead>
			        		<tr>
			          			<th>App. ID</th>
			          			<th>Session</th>
			          			<th>Status</th>
			          			<th>Applicant Name</th>
			          			<th>Father Name</th>
			          			<th>Mobile</th>
			          			<th>Marriage</th>
			          			<th>Bank</th>
			          			<th>IFSC</th>
			          			<th>Account</th>
			          			<th>GP/WARD</th>
			          			<th style='width: 15%;'>Action</th>
			          		</tr>
			      		</thead>
			      		<tbody id="dataTableBody">

			      		</tbody>
			    	</table>
				</div>
			</div>`;


			$("#search_result").html("");
			$("#search_result").append(dataTableRoot);

			// Retrieve data from IndexedDB
			const transactionSearch = db.transaction(['user'], 'readonly');
			const objectStoreSearch = transactionSearch.objectStore('user');

			// Open the index for the selected option
			let searchIndex = objectStoreSearch.index(searchCriteria);

			// Create a key range that includes only the user input
			//let keyRange = IDBKeyRange.only(searchStringInput);
			let keyRange = IDBKeyRange.bound(searchStringInput, searchStringInput + '\uffff', false, true);

			// Open a cursor to iterate over the results
			let cursorRequest = searchIndex.openCursor(keyRange);


			// When a result is found
			cursorRequest.onsuccess = function(event) {

				let cursor = event.target.result;

			  	// If there are more results to iterate over
			  	if (cursor) {

			    	let data = cursor.value;
			    	let trClass =data.status.indexOf('REJECTED') !== -1 ? 'class="bg-red"' : '';
			    	let appIdHash = md5(data.id);


					const applicantAction = `
					<div class="btn-group">
						<button type="button" class="btn btn-danger btn-xs">Action</button>
						<button type="button" class="btn btn-danger btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
							<span class="caret"></span><span class="sr-only">Toggle Dropdown</span>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li><a href="https://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list/beneficiary_details/${appIdHash}" target="_blank">View</a><li>
							<li><a href="#" class="actionStatusCheck" data-appId="${data.id}"">Status</a><li>
							<li><a href="https://wbrupashree.gov.in/admin/edit_beneficiary_app/Beneficiary_edit/applicant_edit/${appIdHash}" target="_blank">Edit Bride</a></li>
							<li><a href="https://wbrupashree.gov.in/admin/edit_beneficiary_app/Beneficiary_edit/applicant_photo_edit/${appIdHash}" target="_blank">Edit Bride Image</a></li>
							<li><a href="https://wbrupashree.gov.in/admin/edit_beneficiary_app/Beneficiary_edit/groom_edit/${appIdHash}" target="_blank">Edit Groom</a></li>
							<li><a href="https://wbrupashree.gov.in/admin/edit_beneficiary_app/Beneficiary_edit/groom_photo_edit/${appIdHash}" target="_blank">Edit Groom Image</a></li>
							<li><a href="https://wbrupashree.gov.in/admin/edit_beneficiary_app/Beneficiary_edit/edit_declaration/${appIdHash}" target="_blank">Edit Declaration Image</a></li>
							<li class="divider"></li>
						</ul>
					</div>`;

			    	// Add the data to the table using jQuery
			    	let row = $('<tr '+ trClass +'></tr>');
				    row.append($('<td></td>').text(data.id));
				    row.append($('<td></td>').text(data.finYear));
				    row.append($('<td></td>').text(data.status));
				    row.append($('<td></td>').text(data.name));
				    row.append($('<td></td>').text(data.father));
				    row.append($('<td></td>').text(data.mobile));
				    row.append($('<td></td>').text(data.pdm));
				    row.append($('<td></td>').text(data.bank));
				    row.append($('<td></td>').text(data.ifsc));
				    row.append($('<td></td>').text(data.acc));
				    row.append($('<td></td>').text(data.gp));
				    row.append($('<td></td>').html(applicantAction));
			    	$('#dataTableBody').append(row);

			    	// Continue iterating
			    	cursor.continue();
			  	}
			};
		});//end of btn search


		/************************************************************************************************
		*								Section: Check if account no is exist
		*************************************************************************************************/
		$('#txt_account').on( 'blur', (e)=>{
			let accNo = $('#txt_account').val();

			let txAcc = db.transaction(['user'], 'readonly');
  			let storeAcc = txAcc.objectStore('user');

  			const indx = storeAcc.index('acc');
  			const req = indx.get(accNo);

  			console.log(accNo);

  			req.onsuccess = function(event) {
    			const result = event.target.result;
    			if (result) {
      				alert('Account number already exists in database.');
    			}
  			};
		});

		/************************************************************************************************
		*						Section: Upcoming marriage
		*************************************************************************************************/
		if (window.location.href.indexOf("https://wbrupashree.gov.in/admin/dashboard") !== -1) {
			const upcomingMarriageTable =
			`<div class="row">
				<div class="col-xs-12">
					<div class="box box-success">
					<div class="box-header">
						<h3 class="box-title text-center">Upcoming Marriage</h3>
					</div>
					<div class="box-body table-responsive">
						<table id="upcomingMarriage" class="table table-bordered table-striped" style="width: 100%;">
							<thead>
								<tr>
									<th>#</th>
									<th>App. ID</th>
									<th>Applicant Name</th>
									<th>Father Name</th>
									<th>Mobile</th>
									<th>Marriage Date</th>
									<th>GP/WARD</th>
									<th>Status</th>
								</tr>
							</thead>

							<tbody>

							</tobody>
						</table>
					</div>
				</div>
			</div>`;

			$(".content").append(upcomingMarriageTable);

			// Retrieve data from IndexedDB
			const umSearch = db.transaction(['user'], 'readonly');
			const objStoreUM = umSearch.objectStore('user');

			// Get all records from the user collection
			const getAllRequest = objStoreUM.getAll();

			getAllRequest.onsuccess = function(event) {
				const users = event.target.result;
				const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

				// Iterate over the records and compare the PDM with the current date
				const validUsers = users.filter(user => {
					const pdm = user.pdm.split('/').reverse().join('-'); // Convert "dd/mm/yyyy" to "yyyy-mm-dd"
					const pdmDate = new Date(pdm);
					return pdmDate >= currentDate;
				});
				//console.log(validUsers);

				const tableBody = document.querySelector('#upcomingMarriage tbody');
				let slNo = 1;

				validUsers.forEach(user => {

					if( user.status != "SANCTIONED" ){
						const rowUM = document.createElement('tr');

                        // Parse and compare PDM date
                        const pdm1 = user.pdm.split('/').reverse().join('-'); // Convert "dd/mm/yyyy" to "yyyy-mm-dd"
                        const pdmDate1 = new Date(pdm1);
                        pdmDate1.setHours(0, 0, 0, 0); // Set PDM date time to 00:00:00

                        if (pdmDate1.getTime() === currentDate.getTime()) {
                            rowUM.classList.add('bg-aqua'); // Apply a class if PDM date is today
                        }

                        if( user.status == "REJECTED BY SANCTION OFFICER" ){
							rowUM.classList.add('bg-red');
						}


						const slCell = document.createElement('td');
						slCell.textContent = slNo;
						rowUM.appendChild(slCell);

						const idCell = document.createElement('td');
						idCell.textContent = user.id;
						rowUM.appendChild(idCell);

						const nameCell = document.createElement('td');
						nameCell.textContent = user.name;
						rowUM.appendChild(nameCell);

						const fatherCell = document.createElement('td');
						fatherCell.textContent = user.father;
						rowUM.appendChild(fatherCell);

						const mobileCell = document.createElement('td');
						mobileCell.textContent = user.mobile;
						rowUM.appendChild(mobileCell);

						const pdmCell = document.createElement('td');
						pdmCell.textContent = user.pdm;
						rowUM.appendChild(pdmCell);

						const gpCell = document.createElement('td');
						gpCell.textContent = user.gp;
						rowUM.appendChild(gpCell);

						const statusCell = document.createElement('td');
						statusCell.textContent = user.status;
						rowUM.appendChild(statusCell);

						// Append the row to the table body
						tableBody.appendChild(rowUM);

						slNo++;
					}

				});
			};
		}//end of upcomming marriage

	};//end of on success


	request.onupgradeneeded = (event) => {
		// Save the IDBDatabase interface
		const db = event.target.result;

		// Create an objectStore for this database
		const objectStore3 = db.createObjectStore("user", { keyPath: "id" });

		objectStore3.createIndex("name", "name", { unique: false });
		objectStore3.createIndex("mobile", "mobile", { unique: false });
		objectStore3.createIndex("father", "father", { unique: false });
		objectStore3.createIndex("mother", "mother", { unique: false });
		objectStore3.createIndex("dob", "dob", { unique: false });
		objectStore3.createIndex("pdm", "pdm", { unique: false });
		objectStore3.createIndex("qual", "qual", { unique: false });
		objectStore3.createIndex("cast", "cast", { unique: false });
		objectStore3.createIndex("relgn", "relgn", { unique: false });

		objectStore3.createIndex("post", "post", { unique: false });
		objectStore3.createIndex("police", "police", { unique: false });
		objectStore3.createIndex("gp", "gp", { unique: false });
		objectStore3.createIndex("dist", "dist", { unique: false });
		objectStore3.createIndex("block", "block", { unique: false });
		objectStore3.createIndex("pin", "pin", { unique: false });

		objectStore3.createIndex("bank", "bank", { unique: false });
		objectStore3.createIndex("acc", "acc", { unique: false });
		objectStore3.createIndex("ifsc", "ifsc", { unique: false });
		objectStore3.createIndex("branch", "branch", { unique: false });

		objectStore3.createIndex("groom", "groom", { unique: false });
		objectStore3.createIndex("gFather", "gFather", { unique: false });
		objectStore3.createIndex("gMother", "gMother", { unique: false });
		objectStore3.createIndex("gDob", "gDob", { unique: false });
		objectStore3.createIndex("gState", "gState", { unique: false });
		objectStore3.createIndex("gPost", "gPost", { unique: false });
		objectStore3.createIndex("gPolice", "gPolice", { unique: false });
		objectStore3.createIndex("gGp", "gGp", { unique: false });
		objectStore3.createIndex("gDist", "gDist", { unique: false });
		objectStore3.createIndex("gBlock", "gBlock", { unique: false });
		objectStore3.createIndex("gPin", "gPin", { unique: false });

		objectStore3.createIndex("status", "status", { unique: false });
		objectStore3.createIndex("doapp", "doapp", { unique: false });
		objectStore3.createIndex("doa", "doa", { unique: false });
		objectStore3.createIndex("dos", "dos", { unique: false });
		objectStore3.createIndex("session", "session", { unique: false });
		objectStore3.createIndex("finYear", "finYear", { unique: false });
		objectStore3.createIndex("remark", "remark", { unique: false });
	};


	/************************************************************************************************
	*										Section: General Section
	*************************************************************************************************/
	let rpConfigObj;
	const rpConfigDefault = {
		overridePDOM: true,
		enqAutofill: true,
		benList: true,
		steckHolders: "",
		policeStation: "",
		deoName: "",
		designation: "DEO",
	};

	let rpConfig = localStorage.getItem("rpConfig");
	if( !rpConfig ){
		localStorage.setItem("rpConfig", JSON.stringify(rpConfigDefault));
		rpConfigObj = rpConfigDefault;
	}else{
		rpConfigObj = JSON.parse(rpConfig);
	}

	//add modal
	const rpCommonModal = `<div class="modal fade" role="dialog" id="rpCommonModal">
		<div class="modal-dialog modal-lg" id="modal-dlg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title text-center" id="rpCommonModalTitle">Modal title</h4>
				</div>
				<div class="modal-body" id="rpCommonModalBody">

				</div>
				<div class="modal-footer" id="rpCommonModalFooter"></div>
			</div>
		</div>
	</div>`;

	$("body").append(rpCommonModal);

	//hide modal login screen modal
	if (window.location.href.indexOf('https://wbrupashree.gov.in/admin/login/') !== -1 || window.location.href.indexOf('https://wbrupashree.gov.in/admin/login') !== -1 || window.location.href.indexOf('https://wbrupashree.gov.in/admin/Login/') !== -1) {
		$('#myModal').modal('hide');
	}


	/************************************************************************************************
	*										Section: General Functions
	*************************************************************************************************/
	const clearModalContent = function(){
		$('#rpCommonModalTitle').text("");
		$('#rpCommonModalBody').html("");
		$('#rpCommonModalFooter').html("");
		$('#modal-dlg').css('width', '');
	};

    function export2Excel(htmlDoc) {
		var workbook = XLSX.utils.table_to_book(htmlDoc.querySelector('table'), { sheet: "Sheet1" });
		var wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

		function s2ab(s) {
			var buf = new ArrayBuffer(s.length);
			var view = new Uint8Array(buf);
			for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
			return buf;
		}

		var link = document.createElement("a");
		link.href = URL.createObjectURL(new Blob([s2ab(wbout)], { type: "application/octet-stream" }));
		link.download = "export.xlsx";
		link.click();
	}

	function formatDate(date) {
		let day = date.getDate();
		let month = date.getMonth() + 1;
		let year = date.getFullYear().toString();

		let formattedDate = day.toString().padStart(2, '0') + '/' + month.toString().padStart(2, '0') + '/' + year;

		return formattedDate;
	}


	/************************************************************************************************
	*										Section: Add menu item
	*************************************************************************************************/

	const rp_menu_item = `
		<li class="dropdown notifications-menu">
			<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
				<i class="fa fa-life-ring"></i> Rupashree Helper<span class="label label-danger">v2.9.5</span>
			</a>
			<ul class="dropdown-menu">
				<li class="header text-center">Select The tools below</li>
				<li>
					<ul class="rupHelperMenu menu">
						<li><a href="#" id="menuGeneral"><i class="fa fa-cog text-red"></i> General Settings</a></li>
						<li><a href="#" id="menuLogin"><i class="fa fa-key text-purple"></i> Login Settings</a></li>
						<li><a href="#" id="menuQR"><i class="fa fa-qrcode text-aqua"></i> Generate QR Code</a></li>
						<li><a href="#" id="menuSearch"><i class="fa fa-search text-green"></i> Search Applicant</a></li>
						<li><a href="#" id="menuImport"><i class="fa fa-upload text-maroon"></i> Import DB</a></li>
						<li><a href="#" id="menuExport"><i class="fa fa-download text-teal"></i> Export DB</a></li>
						<li><a href="#" id="menuExcel"><i class="fa fa-file-excel-o text-warning"></i> Export As Excel</a></li>
					</ul>
				</li>
			</ul>
		</li>
	`;

	$('.navbar-custom-menu .nav.navbar-nav').prepend(rp_menu_item);

	//add the fetch menu button
	if (window.location.href.indexOf('https://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list/') !== -1 || window.location.href.indexOf('https://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list') !== -1) {
		$('.rupHelperMenu').append('<li><a href="#" id="syncDEOBtn"><i class="glyphicon glyphicon-refresh text-red"></i> Sync Database</a></li>');
	}



	/************************************************************************************************
	*										Section: Qrcode generator
	*************************************************************************************************/
	$('#menuQR').on('click', (e)=> {
		e.preventDefault();

		const qrModalContent = `
			<div class="row">
				<div class="col-sm-12">
					<div class="box box-success">
						<div class="box-body">
							<div class="qr-code text-center"></div>
						</div>
					</div>
				</div>

				<div class="col-sm-12">
					<div class="box box-success">
						<div class="box-body">
							<div class="form-group">
								<div class="row">
									<div class="col-sm-12">
										<label>Applicant Name &nbsp;<font color="red">*</font></label>
									</div>
									<div class="col-sm-12">
										<input type="text" class="form-control" id="qr_applicant_name">
									</div>
								</div>
								<div class="row mb-2">
									<div class="col-sm-12 mb-2">
										<label>Aadhaar No &nbsp;<font color="red">*</font></label>
									</div>
									<div class="col-sm-12">
										<input type="number" class="form-control" id="qr_applicant_aadhaar">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;

		clearModalContent();

		$('#rpCommonModalTitle').text('Generate QR Code');
		$('#rpCommonModalBody').append(qrModalContent);
		$('#rpCommonModalFooter').append('<button type="button" id="btn_gen_qr" class="btn btn-info">Generate</button>');

		$('#rpCommonModal').modal('show');
	});


	$(document).on("click", "#btn_gen_qr", function() {
		let qr_applicant_name = $("#qr_applicant_name").val();
		let qr_applicant_aadhaar = $("#qr_applicant_aadhaar").val();

		if( qr_applicant_name == ""){
			alert('Applicant name can\'t be blank', 'Rupashree Helper');
			$("#qr_applicant_name").focus();

		}else if( qr_applicant_aadhaar != "" ){
			let content =`<?xml version="1.0" encoding="UTF-8"?> <PrintLetterBarcodeData uid="${qr_applicant_aadhaar}" name="${qr_applicant_name}" gender="F"/>`;

			generate({
				value: content
			});
		}else{

			alert('Aadhaar Number is not valid', 'Rupashree Helper');
			$("#qr_applicant_aadhaar").focus();
		}
	});


	function generate(data) {
		let qr_code_element = document.querySelector(".qr-code");
		qr_code_element.innerHTML = "";
		let qrcode = new QRCode(qr_code_element, {
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


	/************************************************************************************************
	*										Section: Login Settings
	*************************************************************************************************/
	$('#menuLogin').on('click', (e)=> {
		e.preventDefault();

		const loginModalContent = `
			<div class="row">
				<div class="col-sm-12" id="login-container">

				</div>
				<div class="col-sm-12 text-center">
					<a class="btn btn-success" id="addLoginItem">Add Login Item</a>
				</div>
			</div>
			`;

		clearModalContent();

		$('#rpCommonModalTitle').text('Set Login Details');
		$('#rpCommonModalBody').append(loginModalContent);
		$('#rpCommonModalFooter').append('<div class="checkbox"><label><input type="checkbox" class="loginCheck"> Show New LoginBox</label></div> <button type="button" id="setLoginDetails" class="btn btn-info">Set Login</button>');

		$('#rpCommonModal').modal('show');

		let loginDetails = JSON.parse(localStorage.getItem("loginDetails"));

		if(loginDetails){
			loginDetails.map(function(obj) {

	  			const loginItem = `
				<div class="box box-success box-solid">
					<div class="box-header with-border">
						<h3 class="box-title">Login Details</h3>
						<div class="box-tools pull-right">
							<button type="button" class="btn btn-box-tool loginBtnClose" data-widget="remove"><i class="fa fa-times"></i></button>
						</div>
					</div>
					<div class="box-body">
						<div class="form-group">
							<div class="row">
								<div class="col-xs-4">
									<label>Label &nbsp;<font color="red">*</font></label>
									<input type="text" class="form-control" name="loginLabel" value="${obj.label}">
								</div>
								<div class="col-xs-4">
									<label>Username &nbsp;<font color="red">*</font></label>
									<input type="text" class="form-control" name="loginUsername" value="${obj.username}">
								</div>
								<div class="col-xs-4">
									<label>Password &nbsp;<font color="red">*</font></label>
									<input type="password" class="form-control" name="loginPassword" value="${obj.password}">
								</div>
							</div>
						</div>
					</div>
				</div>
				`;

				$("#login-container").append(loginItem);
			});
		}

		// check if the value is stored in the local storage
  		if(localStorage.getItem("showLoginBox") == "true") {
    		$(".loginCheck").prop("checked", true);
  		}
	});

	$(document).on("click", "#addLoginItem", function() {
		const loginContainer = $("#login-container");

		const loginItem = `
		<div class="box box-success box-solid">
			<div class="box-header with-border">
				<h3 class="box-title">Login Details</h3>
				<div class="box-tools pull-right">
					<button type="button" class="btn btn-box-tool loginBtnClose" data-widget="remove"><i class="fa fa-times"></i></button>
				</div>
			</div>
			<div class="box-body">
				<div class="form-group">
					<div class="row">
						<div class="col-xs-4">
							<label>Label &nbsp;<font color="red">*</font></label>
							<input type="text" class="form-control" name="loginLabel">
						</div>
						<div class="col-xs-4">
							<label>Username &nbsp;<font color="red">*</font></label>
							<input type="text" class="form-control" name="loginUsername">
						</div>
						<div class="col-xs-4">
							<label>Password &nbsp;<font color="red">*</font></label>
							<input type="password" class="form-control" name="loginPassword">
						</div>
					</div>
				</div>
			</div>
		</div>
		`;

		loginContainer.append(loginItem);
	});

	$(document).on("click", ".loginBtnClose", function() {
		$(this).parent().parent().parent().remove();
	});

	$(document).on("click", "#setLoginDetails", function() {
		let logins = [];

		$('input[name^="loginLabel"]').each(function(index) {

			let label = $(this).val();
			let username = $('input[name="loginUsername"]').eq(index).val();
  			let password = $('input[name="loginPassword"]').eq(index).val();

  			let obj = {
			    label: label,
			    username: username,
			    password: password
			};

		  	logins.push(obj);
		});

		// Store the login details in the localStorage
		localStorage.setItem("loginDetails", JSON.stringify(logins));

  		if($('.loginCheck').prop("checked")) {
  			localStorage.setItem("showLoginBox", "true");
		} else {
  			localStorage.setItem("showLoginBox", "false");
		}

		alert("Login Details Successfully Saved!!!");
		$('#rpCommonModal').modal('hide');
	});


	//check if custom login true
	if(localStorage.getItem("showLoginBox") == "true") {

		//make login variable and iitilize first option
		let loginRP = '<select id="login_id" name="login_id" class="form-control" required><option value="0">Select user</option>';
		let loginDB = JSON.parse(localStorage.getItem("loginDetails"));

		if(loginDB){

			loginDB.map(function(obj) {
				loginRP += `<option value="${obj.username}">${obj.label}</option>`;
			});
		}

		loginRP += '</select>';

		const login_id_field = $('[name="login_id"]');
		login_id_field.parent().addClass("customFrmGrp");

		//remove the login field
		login_id_field.remove();

		//append dropdown
		$(".customFrmGrp").prepend(loginRP);

		//handle dropdown change
		$("#login_id").on('change', function(){

			let si = $(this).prop('selectedIndex');
			if(si != 0){
				si = si -1;
			}
			$('[name="password"]').val(loginDB[si]['password']);

		});
	}//end of login check

	/************************************************************************************************
	*						Section: Disable marriage date selection restriction
	*************************************************************************************************/
	if (window.location.href.indexOf("BasicFormEntry") !== -1) {
		let currentDate = new Date();
		let brideAge = new Date();
		let groomAge = new Date();

		brideAge.setFullYear(currentDate.getFullYear() - 18);
		groomAge.setFullYear(currentDate.getFullYear() - 21);

		const ageWarn =
		`
			<div class="box box-danger">
            	<div class="box-body">
                	<h3>Bride minimum DOB = <span class="label bg-yellow">${formatDate(brideAge)}</span></h3>
                	<h3>Groom minimum DOB = <span class="label bg-yellow">${formatDate(groomAge)}</span></h3>
            	</div>
        	</div>
		`;

		$( "section.content" ).prepend( ageWarn );

		if(rpConfigObj.overridePDOM ==  true){
			j('#datepicker_pdom_applicant').datepicker('destroy'); // destroy the existing datepicker instance
			j('#datepicker_pdom_applicant').datepicker({
			    autoclose: true,
			    format: 'dd/mm/yyyy',
			});
		}
	}


	/************************************************************************************************
	*						Section: Disable marriage date selection restriction for edit
	*************************************************************************************************/
	if (window.location.href.indexOf("Beneficiary_edit") !== -1) {

		j('#datepicker_pdom_applicant').datepicker('destroy'); // destroy the existing datepicker instance
		j('#datepicker_pdom_applicant').datepicker({
			autoclose: true,
			format: 'dd/mm/yyyy',
		});
	}


	/************************************************************************************************
	*  								Section: add predefined field
	*************************************************************************************************/

	let surname = $("#app_last_name").val();

	$("#app_mother_l_name").val(surname);
	$("#app_father_l_name").val(surname);


	//FOR police station
	$("#wv_police_station").val(rpConfigObj.policeStation);
	$("#applicant_police_station").val(rpConfigObj.policeStation);

	//REG NAME
	$("#reg_entry_name").val(rpConfigObj.deoName);
	$("#designation").val(rpConfigObj.designation);

	/************************************************************************************************
	*										Section: General Settings
	*************************************************************************************************/

	$('#menuGeneral').on('click', (e)=> {
		e.preventDefault();

		let settings = {
			pdom: rpConfigObj.overridePDOM ? 'checked' : '',
			enqForm: rpConfigObj.enqAutofill ? 'checked' : '',
			benList: rpConfigObj.benList ? 'checked' : '',
			deo: rpConfigObj.deoName,
			desg: rpConfigObj.designation,
			ps: rpConfigObj.policeStation,
			steck: rpConfigObj.steckHolders,
		};


		let genModalContent = `
			<div class="row">
				<div class="col-sm-12">
					<div class="checkbox input-lg">
						<label><input type="checkbox" id="rpOptionPDOM" ${settings.pdom}> Override Marriage Date</label>
					</div>
					<div class="checkbox input-lg">
						<label><input type="checkbox" id="rpOptionEnq" ${settings.enqForm}> Enquiry form autofill</label>
					</div>
					<div class="checkbox input-lg">
						<label><input type="checkbox" id="rpOptionBenList" ${settings.benList}> Hide Submitted Beneficiary List</label>
					</div>
				</div>
				<div class="col-sm-12">
					<div class="row">
						<div class="col-xs-4">
							<label>Police Station</label>
							<input type="text" class="form-control" id="rpOptionPolice" value="${settings.ps}">
						</div>
						<div class="col-xs-4">
							<label>DEO/ACC Name</label>
							<input type="text" class="form-control" id="rpOptionDAName" value="${settings.deo}">
						</div>
						<div class="col-xs-4">
							<label>Designation</label>
							<input type="text" class="form-control" id="rpOptionDesg" value="${settings.desg}">
						</div>
					</div>
				</div>
				<div class="col-sm-12">
					<label>Steck holders</label>
					<input type="text" class="form-control" id="rpOptionSteck" value="${settings.steck}">
					<span class="text-danger">Enter stack holders username in comma seperated value. Only this user will show in forward window.</span>
				</div>
			</div>
		`;

		clearModalContent();

		$('#rpCommonModalTitle').text('General Settings');
		$('#rpCommonModalBody').append(genModalContent);
		$('#rpCommonModalFooter').append('<button type="button" id="btn_gen_settings" class="btn btn-info">Save Settings</button>');

		$('#rpCommonModal').modal('show');

	});

	$(document).on("click", "#btn_gen_settings", function() {
		rpConfigObj.overridePDOM = $('#rpOptionPDOM').prop("checked") ? true : false;
		rpConfigObj.enqAutofill = $('#rpOptionEnq').prop("checked") ? true : false;
		rpConfigObj.benList = $('#rpOptionBenList').prop("checked") ? true : false;
		rpConfigObj.deoName = $('#rpOptionDAName').val();
		rpConfigObj.designation = $('#rpOptionDesg').val();
		rpConfigObj.policeStation = $('#rpOptionPolice').val();
		rpConfigObj.steckHolders = $('#rpOptionSteck').val();



		// Store the settings to localstorage
		localStorage.setItem("rpConfig", JSON.stringify(rpConfigObj));

		rpConfig = localStorage.getItem("rpConfig");
		rpConfigObj = JSON.parse(rpConfig);

		alert("Settings saved successfull");
		$('#rpCommonModal').modal('hide');
	});

	/************************************************************************************************
	*										Section: Face Detection
	*************************************************************************************************/
	$("#detect").parent().parent().append('<button class="btn btn-danger" style="display:none;" id="bypassFD">Bypass Detection</button>');
	$("#crop").on("click", function(){
		$("#bypassFD").show();
	});
	$("#bypassFD").on("click", function(){
		$("#upload").show();
	});


	/************************************************************************************************
	*			Section: Hide the steck holder if it is not present in general settings
	*************************************************************************************************/
	if (window.location.href.indexOf("https://wbrupashree.gov.in/admin/sanction_officer_verification") !== -1) {
		if(rpConfigObj.steckHolders){
			let steckHoldersArray = rpConfigObj.steckHolders.split(',');

			// get all the checkboxes within the div
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');

			// iterate over each checkbox using map and hide if value is not in the array
			checkboxes.forEach(checkbox => {
				if (!steckHoldersArray.includes(checkbox.value)) {
					let nextSibling = checkbox.nextSibling;
					if (nextSibling.nodeType === Node.TEXT_NODE) {
						nextSibling.nodeValue = "";
						let brElement = nextSibling.nextSibling;
						if (brElement && brElement.nodeName === "BR") {
							brElement.remove();
						}
					}
					checkbox.style.display = 'none';
				}
			});
		}
	}
	/************************************************************************************************
	*						Section: autofill enquery form
	*************************************************************************************************/
	if (window.location.href.indexOf("https://wbrupashree.gov.in/admin/physical_verification/PhysicalVerification/viewPhysicalVerificationForm") !== -1) {

		if(rpConfigObj.enqAutofill === true){
			let sCheck = confirm("Is this sanctioned form?");

			$("#attained_age_check").prop('checked', true);
		    $("#family_income_check").prop('checked', true);
		    $("#resident_check").prop('checked', true);
		    $("#photograph_check").prop('checked', true);

			if (sCheck === true) {

				$("#never_married_check").prop('checked', true);
			    $("#propose_married_check").prop('checked', true);
			    $("#marriage_date_check").prop('checked', true);
			    $("#sanction_check").prop('checked', true);

			    $("#remark").val("Sanctioned");

			}else{

		    	$('input[name=never_married_check][value=0]').prop('checked', true);
		    	$('input[name=propose_married_check][value=0]').prop('checked', true);
		    	$('input[name=marriage_date_check][value=0]').prop('checked', true);
		    	$('input[name=sanction_check][value=0]').prop('checked', true);

				$("#remark").val("Paruse the enquery report, this may be rejected.");
			}

			$("#w_name_1").keyup(function(){

				let uname = $(this).val();
				$("#w_name_2").val(uname);
				$("#w_name_3").val(uname);
		        $("#w_name_4").val(uname);
				$("#w_name_5").val(uname);
			});

		    $("#w_add_1").keyup(function(){

				let uname = $(this).val();
				$("#w_add_2").val(uname);
				$("#w_add_3").val(uname);
		        $("#w_add_4").val(uname);
				$("#w_add_5").val(uname);
			});

		    $("#w_contact_1").keyup(function(){

				let uname = $(this).val();
				$("#w_contact_2").val(uname);
				$("#w_contact_3").val(uname);
		        $("#w_contact_4").val(uname);
				$("#w_contact_5").val(uname);
			});
		}
	}

	/************************************************************************************************
	*						Section: hide benificiry list
	*************************************************************************************************/
	if(rpConfigObj.benList === true){
		$("#example tr:contains('Form Submitted')").hide();

	}
	/************************************************************************************************
	*						Section: payment status check
	*************************************************************************************************/
	$('#example tr td:last-child').append('<a class="chkStatushBtn btn bg-purple btn-xs"><span class="glyphicon glyphicon-refresh"></span> Status</a>');
	$('.chkStatushBtn').on('click', function(e){
        e.preventDefault();

		const parentTD = $(this).parent();
        const parentTR = parentTD.parent();

		let appId = parentTR.find('td:eq(1)').text();

		getStatus(appId);

	});

	$(document).on("click", '.actionStatusCheck', function(e){

		e.preventDefault();

		let applicantId = $(this).data('appid');
		getStatus(applicantId);
	});

	let getStatus = function(appId){

		$('#rpCommonModalTitle').text('Payment Status');
		$('#rpCommonModalBody').append('<div class="overlay text-center" style="position:relative;left:0;right:0;height:100%;width: 100%;font-size: 50px;"><i class="fa fa-refresh fa-spin"></i></div>');
		$('#rpCommonModal').modal('show');

		// Fetch data from the url
		$.get("https://wbrupashree.gov.in/admin/searchapplicant_public/Search_by_applicant_id/", (response) => {

			// Parse csrf_rupashree value from the fetched data
			let csrf_rupashree = $(response).find('input[name="csrf_rupashree"]').val();

			// Set the values of the form fields
			let applicant_id = appId;
			let applicant_year = "2021";

			// Submit the form using ajax
			$.ajax({
				type: "POST",
				url: "https://wbrupashree.gov.in/admin/searchapplicant_public/Search_by_applicant_id/searchData",
				data: {
					csrf_rupashree: csrf_rupashree,
					applicant_id: applicant_id,
					applicant_year: applicant_year
				},
				success: function(response) {
					let custTable = $(response).find('#customers');

					custTable.addClass('table table-bordered table-striped');

					custTable.find('tr').each(function() {
					    $(this).find('td:first, th:first, td:nth-child(2), th:nth-child(2), td:last, th:last').remove();
					});

					$('#rpCommonModalBody').html('');
					$('#modal-dlg').css('width', '90%');
					$('#rpCommonModalBody').append(custTable);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					// Handle any errors that occur during form submission
				}
			});
  		});
	};

	//last GROOM name automation
	$("#groom_last_name").keyup(function(){

		var lName = $(this).val();
		$("#groom_mother_l_name").val(lName);
		$("#groom_father_l_name").val(lName);
	});

	//auto post office
	$("#wv_post_office").keyup(function(){

		let pOffice = $(this).val();
		$("#applicant_post_office").val(pOffice);
	});

	//venu and village
	$("#wv_address").keyup(function(){

		let vill = $(this).val();
		$("#applicant_house_number").val(vill);
	});

	//gp
	$("#wv_gp_ward").keyup(function(){

		let gp = $(this).val();
		$("#applicant_grmp_ward").val(gp);
	});

	//pin
	$("#wv_pincode").keyup(function(){

		let pin = $(this).val();
		$("#applicant_pin_code").val(pin);
	});

	//no to duare sarkar
    $('#chkNo').prop('checked', true);



	/************************************************************************************************
	*									Section: report sync
	*************************************************************************************************/
	let blockName = $(document).find('.dropdown-toggle .hidden-xs').text().trim();
	let userRole = $('.user-header small').text().trim();

	if( userRole === 'SANCTIONING OFFICER' ){
		$("#menuGeneral").parent().after(`<li><a href="#" id="menuReport"><i class="fa fa-file-text text-blue"></i> Generate Report</a></li>`);
	}

	$(document).on("click", '#menuReport', function(e){
		e.preventDefault();
		const menuReportBody =`
		<div class="form-group">
			<label>Select Year</label>
			<select class="form-control" id="report_year">
				<option value="" selected="selected">---Please Select Year---</option>
				<option value="2019">2019 - 20</option>
				<option value="2020">2020 - 21</option>
				<option value="2021">2021 - 22</option>
				<option value="2022">2022 - 23</option>
				<option value="2023">2023 - 24</option>
				<option value="2024">2024 - 25</option>
				<option value="2025">2025 - 26</option>
			</select>

		</div>
		<div class="form-group text-right">
			<button id="screenshotButton" class="btn btn-danger btn-flat">Take Screenshot</button>
			<a href="#" class="btn btn-success btn-flat" id="btn_report_generate">Generate</a>
		</div>
		<div class="form-group" id="reportPreview">
			<div class="report-overlay text-center" style="display: none; position:relative;left:0;right:0;height:100%;width: 100%;font-size: 50px;"><i class="fa fa-refresh fa-spin"></i></div>
		</div>
		`;
		clearModalContent();

		$('#rpCommonModalTitle').text('Overall Report');
		$('#rpCommonModalBody').append(menuReportBody);
		$('#modal-dlg').css('width', '70vw');
		$('#rpCommonModal').modal('show');

	});

	function capitalizeWord(word) {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}

	$(document).on("click", '#btn_report_generate', function(e){
		e.preventDefault();
		$('#finYearReport').remove();

		let reportYear = $('#report_year').val();

		if(reportYear){
			$(".report-overlay").show();
			$.get(`https://wbrupashree.gov.in/admin/mis_report/Data_entry/mis_status_reports_block_state_v2/19/${reportYear}`, (resp) => {

				let matchingRow = $(resp).find('#table tbody tr').filter(function() {
					return $(this).find('td:eq(1)').text().trim() === blockName;
				});

				const misReport = {
					bmName : matchingRow.find('td:eq(1)').text().trim(),
					totalEntry: matchingRow.find('td:eq(2)').text().trim(),
					completeEntry: matchingRow.find('td:eq(3)').text().trim(),
					deoForwarded: matchingRow.find('td:eq(4)').text().trim(),
					deoRejected: matchingRow.find('td:eq(5)').text().trim(),
					rejectBeforeEnq: matchingRow.find('td:eq(7)').text().trim(),
					enqDone: matchingRow.find('td:eq(8)').text().trim(),
					sanctioned: matchingRow.find('td:eq(11)').text().trim(),
					reject: matchingRow.find('td:eq(12)').text().trim(),
					sanctionPending: matchingRow.find('td:eq(13)').text().trim(),
					sentPayment: ''
				}

				$.get("https://wbrupashree.gov.in/admin/mis_report/Data_entry/payment_status_block_wise_mis_dpmu", (response) => {

					// Parse csrf_rupashree value from the fetched data
					let csrf_rupashree = $(response).find('input[name="csrf_rupashree"]').val();

					// Set the values of the form fields
					let current_year = $('#report_year').val();

					// Submit the form using ajax
					$.ajax({
						type: "POST",
						url: "https://wbrupashree.gov.in/admin/mis_report/Data_entry/payment_status_block_wise_mis_dpmu/",
						data: {
							csrf_rupashree: csrf_rupashree,
							current_year: current_year
						},
						success: function(response) {
							misReport.sentPayment = $(response).find('#table tbody tr td:eq(2)').text().trim();

							let currentDate = new Date();
							let reportdate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
							let reportYearText = $("#report_year").find(":selected").text();

							const reportPreviewTable =
							`
							<table border=1 id="finYearReport" style="margin: 10px;">
								<thead>
									<tr>
										<th class="text-center" colspan="9" style="padding: 4px;font-size: 24px; background-color: #c5d9f1;">Rupashree Prakalpa</th>
									</tr>
									<tr>
										<th class="text-center" colspan="9" style="padding: 4px;font-size: 24px; background-color: #c5d9f1;">${capitalizeWord(misReport.bmName)} Performance report for the F.Y ${reportYearText} as on ${reportdate}</th>
									</tr>
									<tr>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Complete Entry</th>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Enquiry Done</th>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Pending Enquiry</th>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Sanctioned</th>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Pending Sanction</th>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Rejected (After Enquiry)</th>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Sent for Payment</th>
										<th style="text-align:center; padding: 10px 5px; background-color: #fce9da">Pending sent payment</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td style="text-align:center; padding: 10px 5px;">${misReport.completeEntry}</td>
										<td style="text-align:center; padding: 10px 5px;">${misReport.enqDone}</td>
										<td style="text-align:center; padding: 10px 5px;">${misReport.completeEntry - misReport.enqDone}</td>
										<td style="text-align:center; padding: 10px 5px;">${misReport.sanctioned}</td>
										<td style="text-align:center; padding: 10px 5px;">${misReport.sanctionPending}</td>
										<td style="text-align:center; padding: 10px 5px;">${misReport.reject}</td>
										<td style="text-align:center; padding: 10px 5px;">${misReport.sentPayment}</td>
										<td style="text-align:center; padding: 10px 5px;">${misReport.sanctioned - misReport.sentPayment}</td>
									</tr>
								</tbody>
							</table>`;

							$("#reportPreview").append(reportPreviewTable);
							$(".report-overlay").hide();
						},
						error: function(jqXHR, textStatus, errorThrown) {
							// Handle any errors that occur during form submission
						}
					});
				});
			});
		}else{
			$('#report_year').focus();
			alert("Please select year");
		}


	});

	$(document).on("click", '#screenshotButton', function(e){

		// Select the element to capture
		let finYearReport = document.getElementById("finYearReport");

		// Use html2canvas to take a screenshot of the element
		html2canvas(finYearReport).then(function(canvas) {

			// Convert the canvas to a data URL
			let screenshotDataUrl = canvas.toDataURL("image/png");

		  	// Create a temporary link element
		  	let link = document.createElement("a");
		  	link.href = screenshotDataUrl;

			  	let currentDate = new Date();
			  	let reportdate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
				let reportYearText = $("#report_year").find(":selected").text();
				link.download = `Report of F.Y. ${reportYearText} - (${reportdate}).png`;

		  	// Trigger a click event on the link element to start the download
		  	link.click();
		});
	});

});//end of doc ready
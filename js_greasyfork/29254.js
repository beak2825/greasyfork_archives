// ==UserScript==
// @name         OrgChartSalaryLookUp
// @namespace    EPS Developments
// @version      1.5
// @description  Look up and insert salaries for individuals on the INDOT Organization Chart
// @author       Edward Sluder
// @match        https://entapps.indot.in.gov/hrorg/Dashboard/OrgChart*
// @connect      in.gov
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/29254/OrgChartSalaryLookUp.user.js
// @updateURL https://update.greasyfork.org/scripts/29254/OrgChartSalaryLookUp.meta.js
// ==/UserScript==

(function() {
    'use strict';

	//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	//////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////       Global Variables      ///////////////////////////////////
	
	// Using these variables to keep track of xhr activity
	var firstEmployee = "",
		lastEmployee = "",
		
	// Using with mouseover activity on employee elements
		reserveName = [];
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	
	


	
	// Execute each time an Ajax request completes.
	$( document ).ajaxSuccess(function( data, xhr, settings ) {
	
		
		// Get a reference to the html returned by the xhr request.
		var xhrResponse = data.currentTarget,
			// Cache reference to all employees in an jQuery collection.
			employees = $( "#EmployeeList > div > div.km-scroll-container > div > svg > g > g:nth-child(1) > g[transform^='matrix']", xhrResponse );

		// Set Global Variable firstEmployee to our first result and lastEmployee to our last result for xhr.result comparisons.
		firstEmployee = employees[0].childNodes["0"].children[4].childNodes["0"].innerHTML;
		lastEmployee = employees[ employees.length - 1 ].childNodes["0"].children[4].childNodes["0"].innerHTML;

		// We will iterate through each employee and create an xhr request to pull their salary information.
		employees.each(function(i){

			var fullName = employees[i].childNodes["0"].children[4].childNodes["0"].innerHTML,
				indexOfSpace = fullName.indexOf(" "),
				firstName,
				lastName;
			
			if ( indexOfSpace != -1 ) {
				firstName = fullName.slice(0, indexOfSpace);
				lastName = fullName.slice(indexOfSpace).trim();
				
			}
			else {
			    lastName = null;
			}


			// if the employee has a last name, form the url to send to getSalary(). (No last name means Vacant)
			if (lastName) {
				var url = "http://www.in.gov/apps/gov/salaries/search?firstName=" + firstName + "&lastName=" +lastName + "&agency=TRANSPORTATION&searchPerformed=true";

				GM_xmlhttpRequest({		
					
					//dataType: 'html'
					method: "GET",
					// The url value is being passed into the function by the caller
					url: url,			
					// Process the results, inserting the salaries into the org chart
					onload: function(data) {			
						var source = $('' + data.responseText + ''),
							salary = source.find( "tr.odd td:nth-child(5)" ).text();
						

						// Add Salary to the Org Chart if value returned
						if (salary) {
					
							// Use closure to add eventLister to element that will allow us to 
							// replace the name with salary when hovering over employee.
							(function(element, index, salary){
								
								element.addEventListener( "mouseover", function() {
								
									// Add the name of the employee to our reserveName Global variable array so 
									// that we can retrieve it later.
                                    reserveName[index] = element.childNodes["0"].children[4].childNodes["0"].innerHTML;
									
									// Temporarily replace the employees name with their salary.
									element.childNodes["0"].children[4].childNodes["0"].innerHTML = salary;
									
								});
								
								element.addEventListener( "mouseout", function() {
								
									// Replace salary with the employee's name.
									element.childNodes["0"].children[4].childNodes["0"].innerHTML = reserveName[index];
								    
								
								});

								
							})(employees[i], i, salary);


						}
						// No salary was returned so the employee's firstName may not be the same as 
						// what is listed on transparency website.  (i.e. "Michael" instead of "Mike").
						// We will make a new xhr request using only the first letter of fisrtName.
						else {
							// Get first initial of firstName and change url to use firstInitial
							// instead of firstName.
							var firstInitial = firstName.substring(0, 1),
								url = "http://www.in.gov/apps/gov/salaries/search?firstName=" + firstInitial + "&lastName=" +lastName + "&agency=TRANSPORTATION&searchPerformed=true";
						    
							GM_xmlhttpRequest({									
														

								//dataType: 'html'
								method: "GET",
								// The url value is being passed into the function by the caller
								url: url,			
								// Process the results, inserting the salaries into the org chart
								onload: function(data) {			
									var source = $('' + data.responseText + ''),
										salary = source.find( "tr.odd td:nth-child(5)" ).text();

									// Add Salary to the Org Chart if value returned
									if (salary) {

										// Use closure to add eventLister to element that will allow us to 
										// replace the name with salary when hovering over employee.
										(function(element, index, salary){

											element.addEventListener( "mouseover", function() {

												// Add the name of the employee to our reserveName Global variable array so 
												// that we can retrieve it later.
												reserveName[index] = element.childNodes["0"].children[4].childNodes["0"].innerHTML;

												// Temporarily replace the employees name with their salary.
												element.childNodes["0"].children[4].childNodes["0"].innerHTML = salary;

											});

											element.addEventListener( "mouseout", function() {

												// Replace salary with the employee's name.
												element.childNodes["0"].children[4].childNodes["0"].innerHTML = reserveName[index];


											});


										})(employees[i], i, salary)


									}
									// No salary was returned so the employee's firstName may not be the same as 
									// what is listed on transparency website.  (i.e. "Michael" instead of "Mike")
									else {

										console.log("no salary info returned.  Index: " + fullName + " Going to request lastname only");
										
										// Change the url criteria no use lastName only.
										var url = "http://www.in.gov/apps/gov/salaries/search?firstName=&lastName=" +lastName + "&agency=TRANSPORTATION&searchPerformed=true"; 
										
										GM_xmlhttpRequest({									


											//dataType: 'html'
											method: "GET",
											// The url value is being passed into the function by the caller
											url: url,			
											// Process the results, inserting the salaries into the org chart
											onload: function(data) {			
												var source = $('' + data.responseText + ''),
													salary = source.find( "tr.odd td:nth-child(5)" ).text();
												
												console.log("Number of salaries returned: " + source.find( "tr.odd td:nth-child(5)" ).length);

												// Add Salary to the Org Chart if value returned
												if ( source.find( "tr.odd td:nth-child(5)" ).length === 1 ) {

													// Use closure to add eventLister to element that will allow us to 
													// replace the name with salary when hovering over employee.
													(function(element, index, salary){

														element.addEventListener( "mouseover", function() {

															// Add the name of the employee to our reserveName Global variable array so 
															// that we can retrieve it later.
															reserveName[index] = element.childNodes["0"].children[4].childNodes["0"].innerHTML;

															// Temporarily replace the employees name with their salary.
															element.childNodes["0"].children[4].childNodes["0"].innerHTML = salary;

														});

														element.addEventListener( "mouseout", function() {

															// Replace salary with the employee's name.
															element.childNodes["0"].children[4].childNodes["0"].innerHTML = reserveName[index];


														});


													})(employees[i], i, salary)


												}
												// No salary was returned so the employee's firstName may not be the same as 
												// what is listed on transparency website.  (i.e. "Michael" instead of "Mike")
												else {

													console.log("no salary info returned.  Index: " + fullName);						    	
												}


											}

										});	// End GM_xmlhttpRequest	
										
									}

									
								}

							});	// End GM_xmlhttpRequest						
							
													    	
						}

						
					}
					
				});	// End GM_xmlhttpRequest			


			}
			else {
				console.log(i + " is Vacant");
			}

		});

		
    }); // End ajaxSuccess()




})();
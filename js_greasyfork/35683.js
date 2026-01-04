// ==UserScript==
// @name        create room schedule
// @description automatically create a room schedule for the DTCC computer system.
// @namespace   Nav
// @include     https://banner.dtcc.edu/pls/dtcc/bwskfcls.P_GetCrse_Advanced
// @include     https://banner.dtcc.edu/dtcc/bwskfcls.P_GetCrse_Advanced
// @grant		GM_addStyle
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/35683/create%20room%20schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/35683/create%20room%20schedule.meta.js
// ==/UserScript==

//################################################################
// This script works with the course search results page, on
// DTCC BannerWeb, "Self-Service Banner." It allows you to
// create a room schedule based on the search results.
//################################################################

debug = false;
debug_shading = false;
debug_class_length = false;
debug_time = false;
debug_room = true;
debug_numbering = false;
debug_numbering_by_console = false;
debug_instructor = false;
debug_title_string = false;
debug_empty_classes = false;
debug_i = true;

if(debug) {
	console.log("script started -- create room schedule");
}

my_heading = document.getElementsByTagName("div")[4];

if(debug) {
	console.log("my_heading==" + my_heading);
}

//################################################################
// Creating the box at the top of the page, where you can
// input information.
//################################################################

input_div = document.createElement("div");

my_heading.appendChild(input_div);

input_div.style.border = "3px black solid";
input_div.style.width = "250px";
input_div.style.padding = "3px";

input_div.innerHTML = "Create Room Schedule<BR>";

my_room_number = document.createElement("input");
my_room_number.value = "C128";
input_div.appendChild(my_room_number);

my_button = document.createElement("input");
my_button.type = "button";
my_button.value = "Go";
my_button.addEventListener("click", create_schedule, false);
input_div.appendChild(my_button);

//Adding a break
my_break = document.createElement("br");
input_div.appendChild(my_break);

//Adding a checkbox
my_CRS_checkbox = document.createElement("input");
my_CRS_checkbox.type = "checkbox";
my_CRS_checkbox.id = "include_active_students";
input_div.appendChild(my_CRS_checkbox);

//Adding a span with info about the checkbox
my_CRS_span = document.createElement("span");
my_CRS_span.innerHTML = "Include classes with zero active students"
input_div.appendChild(my_CRS_span);


if(debug) {
	console.log("done with creating the box at the top of the page.");
}

//################################################################
// Done with creating the box at the top of the page.
//################################################################





//################################################################
// Creating the output div. This is where the schedule will end up.
//################################################################
output_div = document.createElement("div");
my_heading.appendChild(document.createElement("br"));
my_heading.appendChild(output_div);



//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################






function create_schedule(){
	
	if(debug) {
		console.log("create_schedule()");
	}
	
	output_div.innerHTML = "";
	
	GM_addStyle("table.room_schedule, table.room_schedule th, table.room_schedule td { border: 2px solid black; border-collapse:collapse; font-size:14px }");
	GM_addStyle("table.room_schedule td.weekday { width:170px; }");
	
	schedule_html_string = "<table class='room_schedule'>";
		
	schedule_html_string += "<tr><td></td><td>Mon</td><td>Tues</td><td>Wed</td><td>Thurs</td><td>Fri</td><td>Sat</td>";
	
	
	//Start time, 8:00 AM
	var d = new Date(79,5,24,8,0,0);
	//var d = new Date(year, month, day, hours, minutes, seconds, milliseconds); 
	
	//********************************************************************************************************************************************************************
	//********************************************************************************************************************************************************************
	//********************************************************************************************************************************************************************
	
	
	//-------------------------------------------------------------------------
	// Constructing the html string for the table, which will 
	// eventually become the schedule.
	//-------------------------------------------------------------------------
	for(i=0; i<28; i++) {
		schedule_html_string += "<tr>";
		
		//-------------------------------------------------------------------------
		//Headings for first column: 8:00 AM, 8:30 AM, 9:00 AM, 9:30 AM, etc
		//The variable "i" ranges from 0 to 28. Therefore the first time is
		//8:00 AM, and the last time is 9:30 PM.
		//-------------------------------------------------------------------------
		schedule_html_string += "<td>";
		time_string = d.toLocaleTimeString();
		schedule_html_string += time_string.slice(0,-6) + time_string.slice(-3);
		schedule_html_string += "</td>";
		
		d.setMinutes(d.getMinutes()+30); 
			
		for(j=0; j<6; j++) {
			//------------------------------------------------------------------------------------------
			// The IDs of the cells become an ordered pair, indicating row number and column number.
			// For example:
			// <td id="0_0"></td>
			//------------------------------------------------------------------------------------------
			schedule_html_string += "<td class='weekday' id='" + i + "_" + j + "'></td>";
		}
		schedule_html_string += "</tr>";
		
	}
	schedule_html_string += "</table>";
	//-------------------------------------------------------------------------
	// Done with constructing the html string for the table.
	//-------------------------------------------------------------------------

	//********************************************************************************************************************************************************************
	//********************************************************************************************************************************************************************
	//********************************************************************************************************************************************************************
	
	
	
	
	output_div.innerHTML = schedule_html_string;
	
	room_number = my_room_number.value.toUpperCase();
	
	//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
	/*Debug*/	if(debug_room) {
	/*Debug*/		console.log("room_number==" + room_number);
	/*Debug*/	}
	//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
	
	course_table = document.getElementsByTagName("table")[7];
	
	//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
	/*Debug*/	if(debug) {
	/*Debug*/		console.log("course_table==" + course_table);
	/*Debug*/		course_table.style.border = "1px red solid";
	/*Debug*/	}
	//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
	
	course_table.id = "super_course_table";
	
	course_cells = course_table.getElementsByTagName("td");
	
	
	//------------------------------------------------------------------------------
	// Going through all the cells in the existing table.
	//------------------------------------------------------------------------------
	j=-1;
	for(i in course_cells) {
		j++; //j starts out equal to i
		
		if(course_cells[i].colSpan) {
			if(course_cells[i].colSpan==2) {
				j++;
			}
		}
		
		if(debug_numbering) {
			course_cells[i].innerHTML += "<BR>";
			course_cells[i].innerHTML += "j==" + j;
			course_cells[i].innerHTML += "<BR>";
			course_cells[i].innerHTML += "j%23==" + j%23;
		}
		
		
		if(debug_numbering_by_console) {
			if(j<50) {
				console.log("********************************************");
				console.log("Cell Text: " + course_cells[i].innerHTML);
				console.log("j==" + j);
				console.log("j%23==" + j%23);
				console.log("********************************************");
			}
		}
		
		if(debug_i) {
			if(j<50) {
				console.log("********************************************");
				console.log("i==" + i);
				console.log("********************************************");
			}
		}
		
		

		
		
		
		if(j%23 == 21) {
			//-----------------------------------------------------------------
			// We are at the last box of the row (last column).
			// Heading of this column is "Location."
			// Contains the room number.
			//-----------------------------------------------------------------
			
			course_room_number = course_cells[i].innerHTML;
			
			course_cells[i].style.border = "none";
			
			//******************************************************************
			//******************************************************************
			//******************************************************************
			if(debug_room) {
				course_cells[i].style.border = "1px red solid";
				console.log("course_room_number==" + course_room_number);
			}
			//******************************************************************
			//******************************************************************
			//******************************************************************
			
			

			
			if(course_room_number.indexOf(room_number) != -1) {
			
				
				//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
				/*Debug*/ if(debug_empty_classes || debug_room) {
				/*Debug*/ 		console.log("********************************************");
				/*Debug*/ 		console.log("Found the specified room number.");
				/*Debug*/ }
				//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
							

			
				course_cells[i].style.border = "1px blue solid";
				
				title_string = course_cells[i-19].innerHTML;
				title_string += course_cells[i-18].innerHTML;
				
				//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
				/*Debug*/	if(debug_title_string || debug_empty_classes) {
				/*Debug*/		console.log("From [i-19] and [i-18], title_string==" + title_string);
				/*Debug*/	}
				//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
				
				
				if(title_string=="" || title_string.charAt(0)=="&") {
					//If it's blank, go back one row.
					title_string = course_cells[i-19-23].innerHTML;
					title_string += course_cells[i-18-23].innerHTML;
				}
				
				
				//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
				/*Debug*/	if(debug_instructor || debug_title_string || debug_empty_classes) {
				/*Debug*/		console.log("title_string==" + title_string);
				/*Debug*/	}
				//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
				
				if(title_string=="" || title_string.charAt(0)=="&") {
					//If it's STILL blank, go back two rows.
					title_string = course_cells[i-19-23-23].innerHTML;
					title_string += course_cells[i-18-23-23].innerHTML;
				}
				
				
				put_this_course_in_the_schedule = true; //assume true at first.
				
				//---------------------------------------------------------------------
				//If it's an NCS course, don't put it in the schedule.
				//---------------------------------------------------------------------
				if(title_string.indexOf("NCS")!=-1) {
					put_this_course_in_the_schedule = false;
				}
				
				
				//---------------------------------------------------------------------
				// Getting the instructor's name.
				//---------------------------------------------------------------------
				instructor_string = course_cells[i-2].innerHTML;
				last_name = extract_last_name(instructor_string);
				if(debug_instructor || debug_empty_classes) {
					console.log("last_name==" + last_name);
				}
				
				
				//---------------------------------------------------------------------
				// If the course has been canceled, don't put it in the schedule.
				//---------------------------------------------------------------------
				if(instructor_string.indexOf("Canceled")!=-1) {
					put_this_course_in_the_schedule = false;
				}
				
				//---------------------------------------------------------------------
				// Getting the time that the course meets.
				//---------------------------------------------------------------------
				time_string = course_cells[i-12].innerHTML;
				//---------------------------------------------------------------------
				// If the time for the course says "TBA," don't put it in the schedule.
				//---------------------------------------------------------------------
				if(time_string.indexOf("TBA")!=-1) {
					put_this_course_in_the_schedule = false;
				}
				
				
				
				if(!my_CRS_checkbox.checked) {
					//---------------------------------------------------------------------
					// If the course has no students in it, don't put it in the schedule.
					// This would mean that the number in the "Active" or "Act" column is
					// zero.
					//
					// On the other hand, if you're making a schedule for a future 
					// semester, then you might want to include the courses with no 
					// students. That's what the check box is for.
					//---------------------------------------------------------------------
					active_student_string = course_cells[i-10].innerHTML;
					
					
					if(active_student_string=="0") {
						put_this_course_in_the_schedule = false;
					}
				}
				
				
				
				
				if(put_this_course_in_the_schedule) {
					//---------------------------------------------------------------------
					// Getting the time that the course meets.
					//---------------------------------------------------------------------
					time_string = course_cells[i-12].innerHTML;
					
					time_index = get_time_index(time_string);
					
					
					if(debug_time) {
						console.log("time_string==" + time_string);
						console.log("time_index==" + time_index);
					}
					
					//---------------------------------------------------------------------
					// Getting the days of the week that the course meets.
					//---------------------------------------------------------------------
					day_string = course_cells[i-13].innerHTML;
					
					day_string = trim_breaks(day_string);
					
					if(debug_numbering) {
						console.log("day_string==" + day_string);
						console.log("day_string.length==" + day_string.length);
					}
					
					//-------------------------------------------------------------------
					// This "for" loop puts one course into the schedule.
					//-------------------------------------------------------------------
					for(k=0; k<day_string.length; k++) {
						day_index = get_day_index(day_string.charAt(k));
						//console.log("day_index==" + day_index);
						
						//-------------------------------------------------------------------
						//Putting the time string into the cell where the class starts
						//-------------------------------------------------------------------
						my_id = time_index + "_" + day_index;
						
						if(debug_numbering) {
							console.log("day; my_id==" + my_id);
						}
						
						abbrev_time_string = time_string.substring(0,5) + time_string.substring(8,16);
						if(abbrev_time_string.charAt(8)=="0") {
							abbrev_time_string = abbrev_time_string.substr(0,8) + abbrev_time_string.substr(9);
						}
						if(abbrev_time_string.charAt(0)=="0") {
							abbrev_time_string = abbrev_time_string.substr(1);
						}
						
						document.getElementById(my_id).innerHTML = abbrev_time_string;
						
						
						
						
						
						//-------------------------------------------------------------------
						// One cell AFTER where the class starts: 
						// Putting the course number and instructor.
						//-------------------------------------------------------------------
						my_id = (time_index+1) + "_" + day_index;
						//console.log("my_id==" + my_id);
						document.getElementById(my_id).innerHTML = title_string + " - " + last_name;
						
						
						
						
						//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
						/*Debug*/	if(debug_class_length) {
						/*Debug*/		console.log("time_string==" + time_string);
						/*Debug*/	}
						//DebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebugDebug
						
						ending_time = time_string.substr(11);
						
						if(debug_class_length) {
							console.log("ending_time==" + ending_time);
						}
						
						ending_time_index = get_time_index(ending_time);
						class_length = ending_time_index - time_index;
						
						if(debug_class_length) {
							console.log("class_length==" + class_length);
						}
						
						//-------------------------------------------------------------------
						// Shading
						//-------------------------------------------------------------------
						for(n=0; n<class_length; n++) {
							my_id = (time_index+n) + "_" + day_index;
							if(debug_shading) {
								console.log("class_length; my_id==" + my_id);
							}
							document.getElementById(my_id).style.borderBottom = "none";
							document.getElementById(my_id).style.borderTop = "none";
							document.getElementById(my_id).style.backgroundColor = "#b3dcff";
							if(debug_shading) {
								console.log("bg color was set to #b3dcff");
							}
						}
						
						my_id = time_index + "_" + day_index;
						document.getElementById(my_id).style.borderTop = "1px solid";
					}
					//end of "for" loop
				}
				//end of "if"
					
					
				
				
				if(debug) {
					console.log("********************************************");
				}
				
			} 
		}
		
	}
	//------------------------------------------------------------------------------
	// Done with going through all the cells in the existing table.
	//------------------------------------------------------------------------------
	
	if(debug) {
		console.log("create_schedule() finished");
	}
	
	
}

//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################




function get_time_index(str) {
	
	debug_get_time_index = true;
	
	time_string_array = str.split(/[: -]/);
	//console.log("time_string_array ==" + time_string_array);
	
	hour_string = time_string_array[0];
	if(hour_string.charAt(0)=="0") {
		hour_string = hour_string.charAt(1);
	}
	my_hour = parseInt(hour_string);
	//console.log("my_hour==" + my_hour);
	index = my_hour*2-16;
	
	
	if(time_string_array[1]=="30") index++;
	
	if(time_string_array[1]=="20") index++;
	
	if(time_string_array[1]=="50") index+=2;
	
	if(index<7) if(time_string_array[2]=="pm") index+=24;
	
	return index;
}

//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################



function get_day_index(str) {
	switch(str) {
		case "M": return 0;
		case "T": return 1;
		case "W": return 2;
		case "R": return 3;
		case "F": return 4;
		case "S": return 5;
	}
}


//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################



function extract_last_name(str) {

	if(str.charAt(0) == "<") {
		return "TBA";
	}

	instructor_array = str.split(" ");
	
	if(debug_instructor) {
		console.log("instructor_array==" + instructor_array);
	}

	if(instructor_array[1].indexOf(".")==-1) {
		//String has a middle initial
		return instructor_array[3];
	}
	else {
		return instructor_array[3];
	}
}


//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################




function trim_breaks(my_string) {
	//Removes all HTML breaks, "<BR>", from a string.
	my_string_array = my_string.split(/<br>/i);
	return my_string_array[0];
}



//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################
//######################################################################################################################














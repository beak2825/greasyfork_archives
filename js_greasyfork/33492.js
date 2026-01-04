									// ==UserScript==
									// @name         GoBlindH - Omdano
									// @namespace    http://tampermonkey.net/
									// @version      0.999
									// @description  Lazy af to do my course sections so im doing this
									// @author       You
									// @match        http://*/*
									// @grant        none
									//@author omdano

									//@updateURL https://openuserjs.org/meta/omdano/My_Script.meta.js
									//@run-at document-end
									// @include      http://mygju.gju.edu.jo*
									// @include      https://mygju.gju.edu.jo*
									// @include      file:///C:/Users/Troll_000/Desktop/My%20Study%20Plan%20Offered%20Courses.html
									// @include      file:///C:/Users/Troll_000/Desktop/Courseadd2.html
									//   x.setAttribute( "onclick", "javascript: PrimeFaces.ab({source:'j_idt26:std_menu_bar_id:j_idt30'});return false;" );
// @downloadURL https://update.greasyfork.org/scripts/33492/GoBlindH%20-%20Omdano.user.js
// @updateURL https://update.greasyfork.org/scripts/33492/GoBlindH%20-%20Omdano.meta.js
									// ==/UserScript==
									function inject(func) {
										var source = func.toString();
										var sr = document.getElementById("content");
										var script = document.createElement('script');
										script.innerHTML = source+"st();";
										sr.appendChild(script);
									}
									function st() {
									st.datx = datx;
									st.table_sw = table_sw;
									st.button_ani =button_ani;
									st.button_res = button_res;
									st.hxe = hxe;
									var jbl = false ;
									var blk = [];
									var finl = [];
									var i = 0;
									var subjects = [] ;
									var fav_teach = [];
									var avo_teach = ["Dia Zeidan"];
									var data = [] ;
									var possiblities = [];	
									var j = 0 ;
									var z = 0;
									var k = 0;
									function button_ani(num) {
										for(i=0;i<10;i++) {
											if(parseInt(document.getElementById("bar").getElementsByTagName("span")[i].innerHTML) === num) {
												document.getElementById("bar").getElementsByTagName("span")[i].className = "ui-paginator-page ui-state-default ui-corner-all ui-state-hover";
												break;
											}
									}
									}
									function button_res(){
									for(i=0;i<10;i++) {
								
												document.getElementById("bar").getElementsByTagName("span")[i].className = "ui-paginator-page ui-state-default ui-corner-all";
											
											}
									}
									function t_val(start,end) {
									var stz = 0 ;
									var enz = 0;
										if (start == "08:00 AM") {
											stz = 1;
										}
										else if (start == "09:30 AM") {
											stz = 2;
	
										}
										else if (start == "11:00 AM") {
											stz = 3;
	
										}
										else if (start == "12:30 PM") {
											stz = 4;
	
										}
										else if (start == "02:00 PM") {
											stz = 5;
	
										}
										else if (start == "03:30 PM") {
											stz = 6;
	
										}
										if (end == "09:30 AM") {
											enz = 2;
	
										}
										else if (end == "11:00 AM") {
											enz = 3;
	
										}
										else if (end == "12:30 PM") {
											enz = 4;
	
										}
										else if (end == "02:00 PM") {
											enz = 5;
	
										}
										else if (end == "03:30 PM") {
											enz = 6;
	
										}
										else if (end == "05:00 PM") {
											enz = 7;
	
										}
									return [stz,enz];
									}
		                                
									function plot(inf) {
									var ite = 0;
									var inf_table = document.getElementById("sch_table");
									inf_table.innerHTML = '<tbody id="sch_table" class="ui-datatable-data ui-widget-content" style="text-align:center;"></tbody></table></div></div>';
									var d = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
									console.log(inf);
										for(i=0;i<7;i++){
										var str = '<tr><td class="ui-state-default ui-selection-column">'+ d[i] +'</td>';
										for(ite=0;ite<6;ite++) {
										if(inf[i][1]) {
										 var fnd = 0;
											for(j=0;j<inf[i][1].length;j++) {
												console.log(inf[i][1][j][2]);
												for(z=0;z<inf[i][1][j][2].length;z++) {
													console.log(inf[i][1][j][2][z]);
													if(inf[i][1][j][2][z][0] == d[i]) {
													console.log("reach0");
													console.log(inf[i][1][j][2][z][1]);
														var span = 0;
														var tim = t_val(inf[i][1][j][2][z][1][0],inf[i][1][j][2][z][1][1]);
														 if(tim[0]-1 == ite) {
														 	console.log("reach1");
														 	console.log(tim);
														 	if((tim[1]-tim[0]) > 1) {
														 		console.log("reach2");
														 		str = str + '<td colspan="2">' + inf[i][1][j][0] + '<br>' + inf[i][1][j][1] + '</td>';
														 		ite++;
														 		fnd = 1;
														 	}
														 	else {
														 		str = str + '<td>' + inf[i][1][j][0] + '<br>' + inf[i][1][j][1] + '</td>';
														 		fnd = 1;
														 	}

														 }
													
													
														}

													}
												}
											}
											if(fnd == 0) {
											str = str+ '<td></td>'; }
										}
										inf_table.innerHTML = inf_table.innerHTML + str + '</tr>'
										}
								
								
								
								
									}
									function sched_ti(pa) {
										var px = [];
										var dayz = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
										var iterlen = 0;
										if (pa.length>10){
										iterlen = 10;
										} 
										else {
										iterlen = pa.length;
										}
										for(i=0;i<iterlen;i++){
											var tempo = [];
											for (day in dayz) {
												var sin_day =[];
												console.log(pa[i]);
												for(cl in pa[i][1]) {
													for(timez in pa[i][1][cl][2]) {
												 		if(pa[i][1][cl][2][timez][0] == dayz[day]) {
												 			sin_day.push(pa[i][1][cl]);
												 		}
													}
												}
												tempo.push([dayz[day],sin_day]);
											}
											px.push(tempo);
										}
										return px ; 
										}
									function table_sw(p) {
										plot(finl[p-1]);
									}
								
									function cvt_time(start,end) {
										var st = 0 ;
										var en = 0;
										if (start == "08:00 AM") {
											st = 800;
										}
										else if (start == "09:30 AM") {
											st = 930;
	
										}
										else if (start == "11:00 AM") {
											st = 1100;
	
										}
										else if (start == "12:30 PM") {
											st = 1230;
	
										}
										else if (start == "02:00 PM") {
											st = 1400;
	
										}
										else if (start == "03:30 PM") {
											st = 1530;
	
										}
										if (end == "09:30 AM") {
											en = 930;
	
										}
										else if (end == "11:00 AM") {
											en = 1100;
	
										}
										else if (end == "12:30 PM") {
											en = 1230;
	
										}
										else if (end == "02:00 PM") {
											en = 1400;
	
										}
										else if (end == "03:30 PM") {
											en = 1530;
	
										}
										else if (end == "05:00 PM") {
											en = 1700;
	
										}
									return [start,end];
									}

									function fu_fil(dat) {
										console.log(dat.length);
										var temp = dat;
										var len = Math.max.apply(Math, dat.map(function (el) { return el.length;}));
										console.log(len);
										var new_fil_array = [];
										for (i=0;i<dat.length;i++) {
											if (dat[i].length <len) {
												temp.splice(i,1);
												console.log("deleted");
				
											}

									}
									console.log(dat.length);
									return temp;
									}
									function s(x,y){
										var pre = ['string' , 'number' , 'bool'];
										if(typeof x!== typeof y ){return pre.indexOf(typeof y) - pre.indexOf(typeof x);}

										if(x === y){return 0;}
										else {return (x > y)?1:-1;}

							}
		
									function dupli(data_unfil) {
									xd = data_unfil;
									console.log(data_unfil);
									console.log("dupli start");
									console.log(data_unfil[0]);
									for(k=0;k<data_unfil.length;k++) {
										for(z=0;z<data_unfil.length;z++) {
											var counters = 0 ;
											if(k != z && (data_unfil[k] != [] || data_unfil[z] != [])) {
												for(i=0;i<data_unfil[z].length;i++) {
													if (data_unfil[k].indexOf(data_unfil[z][i]) > -1) {
														counters++;
					

											}
											else {
												continue;
											}	}
		
		
		
		
		
									}
									else {
									continue;
									}
									if(counters == xd[k].length) {
									data_unfil[z] = [] ;
									xd.splice(z,1);
									console.log("delete");
									}}}
		
		
									console.log(xd);
									console.log(xd.length);
									return xd;
									}


									function cartesian(arg) {
										var r = [], max = arg.length-1;
										function helper(arr, i) {
											for (var hj=0, l=arg[i].length; hj<l; hj++) {
												var a = arr.slice(0); // clone arr
												a.push(arg[i][hj]);
												if (i==max)
													r.push(a);
												else
													helper(a, i+1);
													}
												}
												helper([], 0);
										console.dir(r,"haxd");
										return r;
									}
									function data_ext(subj,num) {
										document.getElementById("progtext").textContent = "Extracting "+subj+" Data.";
										table = document.getElementById("manage_course_sections_form:sections_tbl_data") ;
										tr = table.getElementsByTagName("tr");
										var c = 0;
										var sectiondat = [];
										  function strt() {
										  				setTimeout(function(){
											for(i=0;i<tr.length;i++) {
												var timings = [];
												td = tr[i].getElementsByTagName("td");
												if (td[0]) {
													if (td[0].className == "ui-selection-column" ){

                                                    /*for(j=0;j<sectData;j++){
                                                        sectData[j] = sectData[j].split("\t");
                                                    }*/
                                                    //console.log(sectData);
                                                    console.log(td);
                                                    console.log(jbl);
                                                    console.log((td[td.length-6].textContent.indexOf("SI") == -1));
                                                    console.log(td[td.length-3].textContent);
                                                    console.log(td[td.length-4].textContent);
													if(parseInt(td[td.length-2].textContent,10) < parseInt(td[td.length-3].textContent,10) && (td[td.length-1].textContent != "Blocked" || blk[subjects.indexOf(subj)]) && ((((jbl && (!(td[td.length-5].textContent.indexOf("SI") == -1 && td[td.length-5].textContent.indexOf("SD") == -1)))|| ((!(jbl)) && (td[td.length-5].textContent.indexOf("SI") == -1 && td[td.length-5].textContent.indexOf("SD") == -1)))))) {
                                                    console.log("SECTION FOUND");
													console.log(td[td.length-6]);
													var section_num = td[3].textContent ;
													var times = tr[i].getElementsByTagName("tbody");
													var te = times[1].getElementsByTagName("td")[0].textContent;
													times = times[1].getElementsByTagName("tr");

													console.log(te);
													for (j=0;j<times.length;j++) {
														var days = times[j].getElementsByTagName("td");
														timings.push([days[0].textContent,cvt_time(days[1].textContent,days[3].textContent)]);
			
													} 
						
														console.log(subj);
														if (timings[0]) {
														sectiondat.push([subj,section_num,timings,te]);
														}
		
		
												}
												}}


	

										}
										console.log(sectiondat);
				
										if (c<(num.length-1)) {
										console.log(c);
										c++;
										num[c].click();
										strt();
										}
										},3000);
				
										}
										if(c==0) {
										strt();
										}
										setTimeout(function() {
										console.log((sectiondat[0] && c == (num.length-1)));
										if (sectiondat[0] && c == (num.length-1)) {
										console.log("data arch");
										document.getElementById("progtext").textContent = "Done Extracting "+subj+" Data.";
										data.push(sectiondat);}

										},3100*num.length);
									}
									function perf(datax) {
									var perfe = [];
										for(i=0;i<datax.length;i++) {
										var points = 0.0000 ;
											for(j=0;j<datax[i].length;j++) {
												console.log(datax[i][j][3]);
												if (fav_teach.indexOf(datax[i][j][3]) > -1){
												console.log("found");
												points = points + 0.2;
												}
												if(avo_teach.indexOf(datax[i][j][3])> -1) {
												points = points - 0.01;
						
												}
												for(k=0;k<datax[i][j][2].length;k++) {
													if(datax[i][j][2][k][1][0] == "08:00 AM") {
														points = points + 0.5;

													}
													if(datax[i][j][2][k][1][1] == "05:00 PM") {
														points = points - 0.33;

													}
													else if(datax[i][j][2][k][1][1] == "03:30 PM" || datax[i][j][2][k][1][1] == "03:00 PM") {
														points = points - 0.25;

													}
												    else if(datax[i][j][2][k][1][1] == "02:00 PM" || datax[i][j][2][k][1][1] == "01:30 PM") {
														points = points - 0.15;

													}
													else if(datax[i][j][2][k][1][1] == "12:30 PM" || datax[i][j][2][k][1][1] == "12:00 PM") {
														points = points - 0.09;

													}
													}
													}
											perfe.push([points,datax[i]]);
													}
											perfe.sort(function(a,b){return b[0] - a[0];});
											console.log("perf done");
										return perfe;
			
									}
			
									function filter(data) {
									var heh = 0 ;
									var kek = 0 ;
									var count = 0 ;
									var combi = [];
									for(count =0 ;count<data.length;count++){
										var found = 0;
										for(i=0;i<data[count].length;i++) {
											for(j=0;j<data[count].length;j++) {
												if (i != j) {
													for(heh=0;heh<data[count][i][2].length;heh++) {
														for(kek=0;kek<data[count][j][2].length;kek++) {
															if(data[count][i][2][heh][0] == data[count][j][2][kek][0] && (data[count][i][2][heh][1][0] == data[count][j][2][kek][1][0] || data[count][i][2][heh][1][1] == data[count][j][2][kek][1][1])){
															found = 1;
															break;
							
							
							
														}
														}
													}
												}

											}
				
											}
											if(found ==0) {
											combi.push(data[count]);
											}
											}
										return combi;
										}
									function sortArrayByLength(arr, ascYN) {
									arr.sort(function (a, b) {           // sort array by length of text
										if (ascYN) return a.length - b.length;              // ASC -> a - b
										else return b.length - a.length;                    // DESC -> b - a
									});
								}
		
									function datx() {
					
									possiblities = [];
									data = [];
									subjects = [];
									fav_teach = [];
									blk = [];
									var arrxd = [];
									var heh =[];
									arrxd = [document.getElementById("course1in:course").value,document.getElementById("course2in:course").value,document.getElementById("course3in:course").value,document.getElementById("course4in:course").value,document.getElementById("course5in:course").value,document.getElementById("course6in:course").value,document.getElementById("course7in:course").value,document.getElementById("course8in:course").value];
									for(i=0;i<arrxd.length;i++) {
										if(arrxd[i]!=="") {
											heh.push(arrxd[i].toUpperCase());
										}
									}
									subjects = heh;
									var a = [document.getElementById("te1:course"),document.getElementById("te2:course"),document.getElementById("te3:course")];
									var t = [];
									for(i=0;i<a.length;i++) {
										if(a[i]!=="") {
											t.push(arrxd[i]);
										}
									}
									fav_teach = t;
									break_time(document.getElementById("sun").value,"Sun");
									break_time(document.getElementById("mon").value,"Mon");
									break_time(document.getElementById("thu").value,"Thu");
									console.log(subjects);
									jbl = document.getElementById("SI").checked;
									blk = [document.getElementById("ck1").checked,document.getElementById("ck2").checked,document.getElementById("ck3").checked,document.getElementById("ck4").checked,document.getElementById("ck5").checked,document.getElementById("ck6").checked,document.getElementById("ck7").checked,document.getElementById("ck8").checked];
									document.getElementById("hehz").innerHTML = '<div id="prog" style="text-align:center;letter-spacing:2px;font-family: "Times New Roman", Times, serif;font-size:80px;font-weight:bold;"><div id="progtext" style="padding-top:100px;">Initializing Values</div></div>'+'<div id="myProgress style="margin-top:200px;margin-left:10%;width:80%;background-color:white;height:30px;""><div id="myBar" style="width:1%;height:30px;background-color:green;background-clip:padding-box;position:relative;margin-top:100px;margin-left:10%;"></div></div>'+'<div id="warn" style="text-align:center;letter-spacing:2px;font-family: "Times New Roman", Times, serif;font-size:80px;font-weight:bold;"><div id="progtext" style="padding-top:100px;">Please keep this tab open to avoid errors !!</div>';
									k=0;
									
									move();
									myLoop();	
									var x = 0 ;
									var h = 0;
									console.log(subjects.length);
									var o = 0;
									var y = 0 ;
									var cons = 0 ;
									var poss = [];
									var passec = [];
									var pog = [];
									setTimeout(function() {
									pog= sm_red();
									console.log("Hehe");
									console.log(data);
									document.getElementById("progtext").textContent = "Generating all possible permutations.";
									setTimeout(function() {
									document.getElementById("progtext").textContent = "Filtering and Scoring.";
									if(pog.length == 0) {
									alert("No Possibilities");
									console.log("NoPossiblities");
									}
									else{
									pog.sort(function() {
									sortArrayByLength(pog,true);
									});
									console.log(pog.length);
									pog = perf(pog);
									console.log(pog);
									console.log(pog.length);
									document.getElementById("progtext").textContent = "Done , Organizing data.";
									console.log("finished");
									finl = sched_ti(pog);
									console.log(finl);
									setTimeout(function() {
									document.getElementById("hehz").innerHTML = '<div id="who_elem" class="ui-datatable ui-widget dataTableClass" style="font-size:9.4pt;"><div class="ui-datatable-header ui-widget-header ui-corner-top">Possible Top 10 Schedules</div><div id="manage_course_sections_form:sections_tbl_paginator_top" class="ui-paginator ui-paginator-top ui-widget-header"> <span id="bar" class="ui-paginator-pages"><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(1)" onmouseover="st.button_ani(1)" onmouseout="st.button_res()">1</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(2)" onmouseover="st.button_ani(2)"onmouseout="st.button_res()">2</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(3)" onmouseover="st.button_ani(3)"onmouseout="st.button_res()">3</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(4)" onmouseover="st.button_ani(4)"onmouseout="st.button_res()">4</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(5)" onmouseover="st.button_ani(5)"onmouseout="st.button_res()">5</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(6)" onmouseover="st.button_ani(6)"onmouseout="st.button_res()">6</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(7)" onmouseover="st.button_ani(7)"onmouseout="st.button_res()">7</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(8)" onmouseover="st.button_ani(8)"onmouseout="st.button_res()" >8</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(9)"onmouseover="st.button_ani(9)"onmouseout="st.button_res()">9</span><span class="ui-paginator-page ui-state-default ui-corner-all" onclick="st.table_sw(10)"onmouseover="st.button_ani(10)"onmouseout="st.button_res()">10</span></span></div><div id="tab" class="ui-datatable-tablewrapper"><table id="xd" style="display:table;"><thead><tr><th id="manage_course_sections_form:sections_tbl:selection" class="ui-state-default ui-selection-column" style="width:16%"><span></span></th><th id="manage_course_sections_form:sections_tbl:selection" class="ui-state-default ui-selection-column" style="width:14%"><span>08:00 - 9:30</span></th><th id="manage_course_sections_form:sections_tbl:selection" class="ui-state-default ui-selection-column" style="width:14%"><span>9:30 - 11:00</span></th><th id="manage_course_sections_form:sections_tbl:selection" class="ui-state-default ui-selection-column" style="width:14%"><span>11:00 - 12:30</span></th><th id="manage_course_sections_form:sections_tbl:selection" class="ui-state-default ui-selection-column" style="width:14%"><span>12:30 - 02:00</span></th><th id="manage_course_sections_form:sections_tbl:selection" class="ui-state-default ui-selection-column" style="width:14%"><span>02:00 - 3:30</span></th><th id="manage_course_sections_form:sections_tbl:selection" class="ui-state-default ui-selection-column" style="width:16%"><span>03:30 - 5:00</span></th></tr></thead>'+
									'<tbody id="sch_table" class="ui-datatable-data ui-widget-content" style="text-align:center;">'+
									'</tbody></table></div></div>';
									plot(finl[0]);
									},2600);
									}
									},800+2600*subjects.length);

									},(subjects.length*	30000));
									}
					
									function sm_red() {
									var lenz = data.length;
									var combz = [data[0]];
									var jk = 1;
									var kr =0;
									var br=0;
									console.log(data.length,"Kappa");
									if(lenz>1) {
									for(jk=1;jk<data.length;jk++) {
							
										console.dir(combz);
										combz.push(data[jk]);
										console.dir(combz);
										var kra = cartesian(combz);
										if(jk>1){
										console.log(kra.length);
										for(kr = 0;kr<kra.length;kr++) {
											for(br = 0;br<kra[kr][0].length;br++) {
												kra[kr].push(kra[kr][0][br]);
											}
											kra[kr].splice(0,1);
										}}
										combz = [filter(kra)];
										console.log("yewankz");
									
									 }}
									 else{
									 var kz =0;
									 kra = [];
									 console.log("The length");
									 console.log(data[0].length);
									 for(kz=0;kz<data[0].length;kz++) {
									 	kra.push([data[0][kz]]);
									 }
									 combz = [kra];
									 }
									console.dir(combz[0]);
									console.log("haHAA");
									return combz[0];

									}
									function move() {
										var elem = document.getElementById("myBar"); 
										var width = 1;
										var id = setInterval(frame, ((30000*subjects.length)+(600+2000*subjects.length))/80);
										function frame() {
											if (width >= 80) {
												clearInterval(id);
											} else {
												width++; 
												elem.style.width = width + '%'; 
											}
										}
									}
									function break_time(num,day) {
									var break_arr =[];
										if(day == "Sun") {
											if(num == "1" ) {
											 break_arr = [["break","1",[["Sun",["08:00 AM","09:30 AM"]],["Tue",["08:00 AM","09:30 AM"]]],"godliketeacher"]];
											}
											else if(num == "2" ) {
											break_arr = [["break","1",[["Sun",["09:30 AM","11:00 AM"]],["Tue",["09:30 AM","11:00 AM"]]],"godliketeacher"]];
											}
											else if(num == "3") {
											break_arr = [["break","1",[["Sun",["11:00 AM","12:30 PM"]],["Tue",["11:00 AM","12:30 PM"]]],"godliketeacher"]];
											}
											else if(num == "4") {
											break_arr = [["break","1",[["Sun",["12:30 PM","02:00 PM"]],["Tue",["12:30 PM","02:00 PM"]]],"godliketeacher"]];
											}
											else if(num == "5") {
											break_arr = [["break","1",[["Sun",["02:00 PM","03:30 PM"]],["Tue",["02:00 PM","03:30 PM"]]],"godliketeacher"]];
											}
											else {
												return;
											}
										}
										else if(day == "Mon") {
										if(num == "1" ) {
											 break_arr = [["break","1",[["Mon",["08:00 AM","09:30 AM"]],["Wed",["08:00 AM","09:30 AM"]]],"godliketeacher"]];
											}
											else if(num == "2" ) {
											break_arr = [["break","1",[["Mon",["09:30 AM","11:00 AM"]],["Wed",["09:30 AM","11:00 AM"]]],"godliketeacher"]];
											}
											else if(num == "3") {
											break_arr = [["break","1",[["Mon",["11:00 AM","12:30 PM"]],["Wed",["11:00 AM","12:30 PM"]]],"godliketeacher"]];
											}
											else if(num == "4") {
											break_arr = [["break","1",[["Mon",["12:30 PM","02:00 PM"]],["Wed",["12:30 PM","02:00 PM"]]],"godliketeacher"]];
											}
											else if(num == "5") {
											break_arr = [["break","1",[["Mon",["02:00 PM","03:30 PM"]],["Wed",["02:00 PM","03:30 PM"]]],"godliketeacher"]];
											}
											else {
												return;
											}
				
										}
										else {
										if(num == "1" ) {
											 break_arr = [["break","1",[["Thu",["08:00 AM","09:30 AM"]]],"godliketeacher"]];
											}
											else if(num == "2" ) {
											break_arr = [["break","1",[["Thu",["09:30 AM","11:00 AM"]]],"godliketeacher"]];
											}
											else if(num == "3") {
											break_arr = [["break","1",[["Thu",["11:00 AM","12:30 PM"]]],"godliketeacher"]];
											}
											else if(num == "4") {
											break_arr = [["break","1",[["Thu",["12:30 PM","02:00 PM"]]],"godliketeacher"]];
											}
											else if(num == "5") {
											break_arr = [["break","1",[["Thu",["02:00 PM","03:30 PM"]]],"godliketeacher"]];
											}
											else {
												return;
											}
										}
										data.push(break_arr);
			
			
									}
						
									var xsum = 0;
									function myLoop () { 
										var hexx = 1;
										hexx = document.getElementById("manage_course_sections_form:sections_tbl_paginator_top").getElementsByTagName("span")[5].getElementsByTagName("span");
									//  create a loop function
									   setTimeout(function () {    
											var form = document.getElementById("manage_course_sections_form:course");
                                            var semester = document.getElementById("manage_course_sections_form:semester_input");
                                            semester.value = 3;
											form.value = subjects[k];
											document.getElementById("manage_course_sections_form:searchBtn").click();
											setTimeout(function() {hexx= document.getElementById("manage_course_sections_form:sections_tbl_paginator_top").getElementsByTagName("span")[5].getElementsByTagName("span");xsum +=hexx.length;console.log(k);c=0; data_ext(subjects[k],hexx);k++; 
										  if (k < subjects.length) {            
											 myLoop();             
										  }   //  ..  setTimeout()
									   },4000);  }, 16000);
				
									}
									function hxe() {	
									if (window.location.href == "https://mygju.gju.edu.jo/faces/course_sections/manage_course_sections.xhtml" || window.location.href == "https://mygju.gju.edu.jo/RegistrationSystem/faces/course_sections/manage_course_sections.xhtml"){
									var scr = document.getElementById("content");
									var hide = document.getElementById("manage_course_sections_form");
									hide.style.display = "none";
									hide.style.height = "0px";
									scr.style.border = "1px solid black";
									scr.style.overflow = "hidden";
									scr.innerHTML =scr.innerHTML + '<div style="overflow:hidden;border-bottom: solid dotted black;font-size: 22px;width:100%;height:100px;color: #2c2c2c;background-color: #d5d5d5;letter-spacing: .05em;text-shadow: 4px 4px 0px #d5d5d5, 7px 7px 0px rgba(0, 0, 0, 0.2);"><div style="font-size: 3em;line-height: 70px;padding-left:1em;">GJU Custom Courses</div><div style="text-align:right;padding-right:1em;line-height: 10px;dir=rtl;font-size: 1em;">by Omar A. Al-Tamimi</div></div>'+
									'<div id="hehexdz" style="height:500px;width:100%;background-color: #f1f1f1"><div id="hehz"><div id="var" style="width:49%;;float:left;height:500px;border-right:1px dotted black;text-align:left;font: 50px arial, sans-serif;"><table cellspacing="1px" dir="ltr" style="float: left;padding-left:1em;" width="100%"><tbody><tr><td><label id="course1" class="ui-outputlabel ui-widget">Course Code 1 :</label></td><td><input id="course1in:course" name="course1n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck1" value="1"><span style="font-size:12px">Blocked</span></td></tr><tr><td><label id="course2" class="ui-outputlabel ui-widget">Course Code 2 :</label></td><td><input id="course2in:course" name="course2n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck2" value="1"><span style="font-size:12px">Blocked</span></td></tr><tr><td><label id="course3" class="ui-outputlabel ui-widget">Course Code 3 :</label></td><td><input id="course3in:course" name="course3n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck3" value="1"><span style="font-size:12px">Blocked</span></td></tr><tr><td><label id="course4" class="ui-outputlabel ui-widget">Course Code 4 :</label></td><td><input id="course4in:course" name="course4n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck4" value="1"><span style="font-size:12px">Blocked</span></td></tr><tr><td><label id="course5" class="ui-outputlabel ui-widget">Course Code 5 :</label></td><td><input id="course5in:course" name="course5n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck5" value="1"><span style="font-size:12px">Blocked</span></td></tr><tr><td><label id="course6" class="ui-outputlabel ui-widget">Course Code 6 :</label></td><td><input id="course6in:course" name="course6n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck6" value="1"><span style="font-size:12px">Blocked</span></td></tr><tr><td><label id="course7" class="ui-outputlabel ui-widget">Course Code 7 :</label></td><td><input id="course7in:course" name="course7n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck7" value="1"><span style="font-size:12px">Blocked</span></td></tr><tr><td><label id="course8" class="ui-outputlabel ui-widget">Course Code 8 :</label></td><td><input id="course8in:course" name="course8n" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td><td><input type="checkbox" id="ck8" value="1"><span style="font-size:12px">Blocked</span></td></tr></tbody></table></div>'+
									'<div id="var2" style="width:50%;height:500px;text-align:left;font: 50px arial, sans-serif;float:left;"><table dir="ltr" style="float: left;border-spacing=10px 0;padding-left:1em;" width="100%"><tbody><tr><td><label id="fav_teach" class="ui-outputlabel ui-widget">Prefered Teachers:</label></td><td><table cellspacing="1px" dir="ltr" style="float: left;padding-left:1em;" width="100%"><tbody><tr><td><input id="te1:course" name="te1" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td></tr><tr><td><input id="te2:course" name="te2" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td></tr><tr><td><input id="te3:course" name="te3" type="text" class="ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all" role="textbox" aria-disabled="false" aria-readonly="false" aria-multiline="false"></td></tr></tbody></table></td></tr><tr><td><label id="xdee" class="ui-outputlabel ui-widget">Break Times: &nbsp &nbsp &nbsp &nbsp &nbsp</label></td><td><table dir="ltr" style="float:left;padding-right:1em;" width=100%><tbody><tr><td><label id="fav_teach" class="ui-outputlabel ui-widget">Sunday-Tuesday:</label></td><td><select id="sun" class="ui-selectonemenu ui-widget ui-state-default ui-corner-all ui-helper-clearfix" ><option value="x">None</option><option value="1">08:00-09:30</option><option value="2">09:30-11:00</option><option value="3">11:00-12:30</option><option value="4">12:30-02:00</option><option value="5">02:00-03:30</option></td></tr><tr><td><label id="fav_teach" class="ui-outputlabel ui-widget">Monday-Wednesday:</label></td><td><select id="mon" class="ui-selectonemenu ui-widget ui-state-default ui-corner-all ui-helper-clearfix" ><option value="x">None</option><option value="1">08:00-09:30</option><option value="2">09:30-11:00</option><option value="3">11:00-12:30</option><option value="4">12:30-02:00</option><option value="5">02:00-03:30</option></td></tr><tr><td><label id="fav_teach" class="ui-outputlabel ui-widget">Thursday:</label></td><td><select id="thu" class="ui-selectonemenu ui-widget ui-state-default ui-corner-all ui-helper-clearfix" ><option value="x">None</option><option value="1">08:00-09:30</option><option value="2">09:30-11:00</option><option value="3">11:00-12:30</option><option value="4">12:30-02:00</option><option value="5">02:00-03:30</option></td></tr></tbody></td></tr><tr><td><input type="checkbox" id="SI" value="1"><span style="font-size:14px">Jabal Amman</span></td><td><button id="sub" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left commandButton" onclick ="st.datx()">Start</button></td></tr></tbody></table></div></div></div>';
									 scr.style.borderRadius = "25px";
			
			
			
			
									// te1:course ,te2:course,te3:course 
			

									}}
			
									(function(){
										var butz =document.getElementsByTagName("center")[0];
										butz.innerHTML = butz.innerHTML + '<td><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left " onclick="st.hxe()" style="margin-top:10px;height:29.5px;width:150px" role="button" aria-disabled="false"><span class="ui-button-text ui-c">Custom Search</span></button></td>';
									})();
									}



									(function() {
										if(window.location.href == 'https://mygju.gju.edu.jo/faces/course_sections/manage_course_sections.xhtml' || window.location.href == 'https://mygju.gju.edu.jo/RegistrationSystem/faces/course_sections/manage_course_sections.xhtml') {
										'use strict';
										
										inject(st);
				}

									})();




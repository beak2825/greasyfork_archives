// ==UserScript==
// @name         TamperEmber Q2/3
// @description  reduces inquiry details for Q2/3 macro
// @version      0.0.46
// @author       Lucas A. Metzen
// @namespace    ALMdoc
// @match        https://www.betterdoc.org/backstage/new/inquiries*
// @match        https://staging.betterdoc.org/backstage/new/inquiries*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/36145/TamperEmber%20Q23.user.js
// @updateURL https://update.greasyfork.org/scripts/36145/TamperEmber%20Q23.meta.js
// ==/UserScript==


var j_appointments, recentQ3, textforME, dialog;

// click DOM element:
var clickEvent  = document.createEvent ("HTMLEvents");
clickEvent.initEvent ("click", true, true);
function clickElement(e) {
    e.dispatchEvent(clickEvent);
}

function date_isotogerman(i) {
    var t=/(\d{4})-(\d{2})-(\d{2})/.exec(i);
    return t[3]+'.'+t[2]+'.'+t[1];
}

function date_isototimestamp(i) {
    var t=/(\d{4})-(\d{2})-(\d{2})/.exec(i);
    return new Date(t[1], t[2]-1, t[3]);
}

function datetogerman(d) {
    day=d.getDate();
    if ((String(day)).length==1) day='0'+day;
    month=d.getMonth()+1;
    if ((String(month)).length==1) month='0'+month;
    return day+'.'+month+'.'+d.getFullYear();
}

function date_timestamptogerman(s) {
	d = new Date(s);
	day=d.getDate();
	if ((String(day)).length==1) day='0'+day;
	month=d.getMonth()+1;
	if ((String(month)).length==1) month='0'+month;
	return day+'.'+month+'.'+d.getFullYear();
}

function mostrecentdate(array) {
	// https://stackoverflow.com/questions/36577205/what-is-the-elegant-way-to-get-the-latest-date-from-array-of-objects-in-client-s
	// What this does is map each of the objects in the array to a date created with the value of MeasureDate. This mapped array is then applied to the Math.max function to get the latest date and the result is converted to a date.
	// By mapping the string dates to JS Date objects, you end up using a solution like Min/Max of dates in an array?
    return new Date(Math.max.apply(null, array.map(function(e) {
        return e;  // this returns e to "new Date(e);", then needs to be returned again
    })));
}


function setStatus(arg) {
    /*function setColor(el, c) {
        $(el).css("background-color", c);
    }*/
    if (!dialog) return;
    if (arg.field) {
        var field, color;
        switch(arg.field) {
            case "page":
                field = "#q23control_statusPage";
                switch(arg.state) {
                    case "no inquiry":
                        color = "red"; break;
                    case "loading":
                        color = "yellow"; break;
                    case "loaded":
                        color = "green"; break;
                    case "unknown":
                        color = "darkgray"; break;
                }
                break;
            case "id":
                field = "#q23control_statusId";
                /*if (arg.state) {
                    switch(arg.state) { ...
                } else*/ color=arg.color;
                break;
        }
        $(field).css("background-color", color);
        if (arg.state) $(field).val(arg.state);
        if (arg.text) $(field).val(arg.text);  // no "else" before this, arg.state seems to exist even if not set...?
    }
    //if (arg.text)  $("#q23control_statusId").val(arg.text);
    //if (arg.color) $("#q23control_statusId").css("background-color", arg.color);
}

function q23controldialog() {
    if (dialog) return;  // don't insert again

    $("body").append('<div id="almdialog_q23control">' +
        // '<textarea name="textinput" id="q23control_input" value="" class="text ui-widget-content ui-corner-all" rows="3" cols="40"></textarea>' +
        '<label for="statusPage">Page</label>' +
        '<input type="text" name="statusPage" id="q23control_statusPage" size="5" value="" class="text ui-widget-content ui-corner-all" tabindex="-1" disabled="disabled" style="margin-right:19px;">' +
        '<label for="status">ID [Q3]</label>' +
        '<input type="text" name="status" id="q23control_statusId" size="6" value="" class="text ui-widget-content ui-corner-all" tabindex="-1">' +
        /*'<input type="radio" name="diffq3" id="diffq3app3weeks" value="3weeks" tabindex="-1">' +
        '<label for="diffq3app3weeks">3 Wochen</label>' +
        '<input type="radio" name="diffq3" id="diffq3app6weeks" value="6weeks" tabindex="-1" style="margin-left:19px;">' +
        '<label for="diffq3app6weeks">6 Wochen</label> </br></br>' +*/
        '<textarea name="textforME" id="textforME" cols="37" style="height: 85px;"></textarea>' +
        '</div>');
    dialog = $("#almdialog_q23control").dialog ( {
        modal:      false,
        title:      "Q2/3 Controls",
        position:   {
            my: "right top",
            at: "right top",
            of: document,
            collision: "none"
        },
        draggable:  false,
        resizable:  false,
        buttons: [
            {
                text:  "01: change Q3",
                click: function() {
                    setStatus({field: "id", color: "white"});
                    //setStatus({color: "white"});
                    var em_appointmentsTable = $("table[class~='appointments']");
                    em_latestAppointment = em_appointmentsTable.find("tr:contains('"+date_isotogerman(recentQ3.scheduled_date)+"'):contains('call_patient')");
                    clickElement(em_latestAppointment.find("a:contains('Edit')")[0]);  // edit appointment

                    //var newq3 = new Date();  // +x from today  // var newq3 = new Date(date_isototimestamp(recentQ3.scheduled_date));  // x weeks from original Q3
                    //newq3.setDate(newq3.getDate()+(($('#diffq3app3weeks')[0].checked ? 3 : 6) * 7));

                    em_latestAppointment.find("input:first").focus(); //.val(datetogerman(newq3));  // focus + fill date field
                }
            }, {
                text: "02: focus Q3 note",
                click: function() {
                    em_latestAppointment.find("textarea[placeholder='Description']").focus();
                }
            }, {
                text: "03: save Q3",
                click: function() {
                    clickElement(em_latestAppointment.find("button:contains('Save')")[0]);  // save
                }
            }, {
                text: "04: add comment",
                click: function() {
                    var el_history = $("div[class~='history']");
                    clickElement($("button:contains('Add comment')")[0]);  // open "add comment" field
                    el_history.find("trix-editor").focus();
                }
            },
        ],
        close: function() {
            //form[ 0 ].reset();
        },
        width:      325,  // 220
        height:     303,
        zIndex:     2000 // 3666
    } ).dialog("widget");

    // equal size for buttons
    var maxWidth = Math.max.apply(null, $(".ui-button").map(function () {
        return $(this).outerWidth(true);
    }).get());
    $(".ui-button").not("[class~='ui-dialog-titlebar-close']").css({"width" : maxWidth});
    $(".label, label").css({"min-width" : 0, "margin-right" : "6px"});
}

(function() {
    'use strict';
    $("head").append('<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.min.css" rel="stylesheet" type="text/css">');  // inject CSS for jQueryUI

    unsafeWindow.$(document).ajaxSuccess (
        function (event, requestData) {
            var obj, ajaxwasjustupdate = false;
            try {
                obj = jQuery.parseJSON(requestData.responseText);
            }
            catch(e) {
                console.log('ERROR: '+requestData.responseText);
                return;
            }

            //if (requestData.responseText.indexOf('ANRUFEN und schauen')>-1) { console.log(requestData.responseText.indexOf('ANRUFEN und schauen') +': '); console.log(obj); }
            //console.log(obj);

            q23controldialog();

            if ('inquiry' in obj) {
                $(dialog).css("z-index", "2000");
				console.log(obj);
                if ($('#q23control_statusId').val() == (obj.inquiry.masked_id.length>=10 ? obj.inquiry.masked_id : obj.inquiry.id)) ajaxwasjustupdate = true;
				setStatus({field:"id", text:(obj.inquiry.masked_id.length>=10 ? obj.inquiry.masked_id : obj.inquiry.id) });  // display ID in status

                // open All tab in history
                var el_history = $("div[class~='history']");
                clickElement(el_history.find("a:contains('All')")[0]);

                // find Q3 app.
                j_appointments = obj.inquiry_appointments;
                recentQ3="";
                setStatus({field: "id", color: "yellow"});
                $.each(j_appointments, function(k, v) {
                    if ((v.appointment_type == "q3") && (v.state == "call_patient")) {
                        recentQ3 = v;
                        setStatus({field: "id", color: "green"});
						// shouldn't there be a stop after finding it?
                    }
                });
                if (recentQ3==="") setStatus({field: "id", color: "red"});

				if (recentQ3) {
					// find most recent Q2
					var mostrecentq2 = [];
					$.each(obj.inquiry_appointments, function(k, v) {
						if ((v.appointment_type=="q2") && (v.state=="completed")) mostrecentq2.push(date_isototimestamp(v.scheduled_date));  // add all Q2 dates to array
					});
					if (mostrecentq2.length===0) {
						$.each(obj.inquiry_appointments, function(k, v) {
							if ((v.appointment_type=="q1") && (v.state=="completed")) mostrecentq2.push(date_isototimestamp(v.scheduled_date));  // add all Q2 dates to array
						});
						console.log(mostrecentq2);
					}

					var today = new Date(), newq3plus2 = new Date(), newq3plus4 = new Date();  // +x from today  // var newq3 = new Date(date_isototimestamp(recentQ3.scheduled_date));  // x weeks from original Q3

					const ONE_MONTH = 30.436875 * 24 * 60 * 60 * 1000;  // check if Q3 is older than 6 month
					var q3_olderthan6month = ((new Date() - date_isototimestamp(recentQ3.scheduled_date)) > ONE_MONTH * 6);
					// console.log('older than 6 months? ' + q3_olderthan6month);

					var ABCinfo, recentQ3desc_original;
					var ABCregex = /\[Q2\/3:([ABCD])([mp]):(\d\d.\d\d.20\d\d)\]/;
					if (recentQ3.description.match(ABCregex)) {
						var ABCrun = /\[Q2\/3:([ABCD])([mp]):(\d\d.\d\d.20\d\d)\]/.exec(recentQ3.description);
						// console.log("index: "+ /20\d\d\]\)/.exec(recentQ3.description).index);
						recentQ3desc_original = recentQ3.description.substr(/20\d\d\]\)/.exec(recentQ3.description).index+8); // get position of "2017])" \[Q2\/3:[ABCD][mp]:\d\d.\d\d.20\d\d\]\)
						console.log(recentQ3desc_original);

						// last run was i.e. A therefore this run will be B
						ABCrun[1] = ABCrun[1]=="A" ? (ABCrun[2]=="p" ? "C" : "B") : (ABCrun[1]=="B" ? "C" : (ABCrun[1]=="C" ? "D" : ""));
						/* A => B reminder, except if last time was Post then it's C
						   B reminder => C
						   C => D */

						ABCinfo = "ABCrun°="+ ABCrun[1] +"°°;°°" +
							"ABCchannel°="+ (ABCrun[2]=='m' ? 'email' : 'post') +"°°;°°" +
							"ABCdate°="+ ABCrun[3] + "°°;°°";
					} else ABCinfo = q3_olderthan6month ? "ABCrun°=C°°;°°" : "ABCrun°=A°°;°°"; // if Q3 is older than 6 months then the first step is C, if there is no marker then the Q2/3 process has just started and it's A

					// find latest history entry & run A date
					var lastContact;
					let history_max = 0, h_ent = obj.inquiry_contact_entries;
					for (let i = 0; i < h_ent.length; i++ ) {
						if (h_ent[i].id > history_max) {
							history_max = h_ent[i].id;
							lastContact = h_ent[i]; // maybe not most elegant solution
						}

						// find run A date
						var Aregex = /\[Q2\/3:(A)([mp]):(\d\d.\d\d.20\d\d)\]/;
						if (h_ent[i].note.match(Aregex)) {
							//console.log(h_ent[i].note);
							var Adate = Aregex.exec(h_ent[i].note);
							console.log('found run A info: '+Adate[0]+';'+Adate[1]+';'+Adate[2]+';'+Adate[3]);
							ABCinfo += "Adate°="+ Adate[3] + "°°;°°";
						}
					}

					/*console.log( recentQ3.description.match(ABCregex) +';'+ lastContact.note.match(ABCregex));
					console.log(typeof recentQ3.description.match(ABCregex));*/
					//if (typeof recentQ3.description.match(ABCregex) !== 'undefined') console.log('first not undefined');

					/*if (recentQ3.description.match(ABCregex) !== null) {
						console.log('recentQ3 not null');
						if (lastContact.note.match(ABCregex) !== null) {
							console.log('lastContact not null');
							console.log('nested: '+recentQ3.description.match(ABCregex) +';'+ lastContact.note.match(ABCregex));
						}
					}*/

					//console.log( recentQ3.description.match(ABCregex) +';'+ lastContact.note.match(ABCregex) );
					//console.log(!((recentQ3.description.match(ABCregex) !== null) && (lastContact.note.match(ABCregex) !== null)));

					if (!ajaxwasjustupdate) {  // only check for history mismatch if ajaxSuccess was not just update of history or app.
						if ( ((recentQ3.description.match(ABCregex) === null) && (lastContact.note.match(ABCregex) === null)) ) {  // NULL && NULL = TRUE => no entries, then it's A
							// console.log('this is double NULL, so A');
						} else if ( recentQ3.description.match(ABCregex) && lastContact.note.match(ABCregex)) {  // 'ABC' && 'ABC' = TRUE => two entries, then it's B or C
							// console.log('this is double Q2/3 date, so B-D');
						} else {
							alert('Q3 and history mismatch!!!');
						}
					}
					//console.log(ajaxwasjustupdate);
					ajaxwasjustupdate = false; // reset

					//if ( (recentQ3.description.match(ABCregex)) && (lastContact.note.match(ABCregex)) )

//					if (!((recentQ3.description.match(ABCregex) !== null) && (lastContact.note.match(ABCregex) !== null))) {
/*						alert('Q3 and history mismatch!!!');
						console.log( recentQ3.description.match(ABCregex) +';'+ lastContact.note.match(ABCregex));
					} else console.log('Q3 and history match :)');*/


/*					console.log( !( !!(recentQ3.description.match(ABCregex)) && !!(lastContact.note.match(ABCregex)) ));

					if ( !(!!(recentQ3.description.match(ABCregex)) && !!(lastContact.note.match(ABCregex))) ) {
						alert('Q3 and history mismatch!!!');
					} else console.log('Q3 and history match :)');*/


					//var pat_housenr = obj.inquiry.patient_data_house_no||"";
					textforME = "inquiry_id°="+ (obj.inquiry.masked_id.length>=10 ? obj.inquiry.masked_id : obj.inquiry.id) +"°°;°°" +
//[Q2/3:Ap:20.10.2017]
						ABCinfo +
						"pat_Q2recent°="+ date_timestamptogerman(mostrecentdate(mostrecentq2)) +"°°;°°" +

						"pat_Q3recent_date°="+ date_isotogerman(recentQ3.scheduled_date) +"°°;°°" +
// TODO: REPLACE LINEBREAKS!!!
						"pat_Q3recent_text°="+ (recentQ3desc_original ? recentQ3desc_original : recentQ3.description) +"°°;°°" +

						"pat_inquirydate°="+ date_timestamptogerman(obj.inquiry.created_at) +"°°;°°" +
						"pat_email°="+ (obj.inquiry.patient_data_email ? obj.inquiry.patient_data_email : obj.inquiry.email) +"°°;°°" +
						"pat_postaladdress°="+ (obj.inquiry.patient_data_address_extra ? (obj.inquiry.patient_data_address_extra +"<br/>").trim() : "") +
						    obj.inquiry.patient_data_street.trim() +" "+ (obj.inquiry.patient_data_house_no||"").trim() + "<br/>"+ obj.inquiry.patient_data_zip.trim() +" "+ obj.inquiry.patient_data_city.trim() +"°°;°°" +

						"q3plus2weeks°="+ date_timestamptogerman(newq3plus2.setDate(today.getDate()+(2 * 7))) +"°°;°°" + // for email reminder
						"q3plus4weeks°="+ date_timestamptogerman(newq3plus4.setDate(today.getDate()+(4 * 7))) +"°°;°°" +  // for postal reminder
						"q3_olderthan6month°="+ q3_olderthan6month +"°°;°°";  // for postal reminder

					console.log(textforME);
					$("#textforME").val(textforME);
				}

                $('#inquiry-follow-up').parent().hide();
                $('button:contains("Inquiry details")').parent().parent().hide();
                $('button:contains("Summary for patient")').parent().parent().hide();
                $('button:contains("Recommendations")').parent().parent().hide();
                $('button:contains("Description")').parent().parent().hide();
            }
            if ('message' in obj) {
                if (obj.message == "Inquiry unlocked") {
                    //setStatus({text: "", color: "white"});

                }
            }
        }
    );

    var refreshIntervalId = setInterval(function() {
        if ($("div[class~='history']").length>0) {  // page loaded
            setStatus({field:"page", state:"loaded"});
        } else if (($("div[class='loading']").length>0) || ($("div[class='starting-word']").length>0)) {  // page is loading or Ember is starting
            setStatus({field:"page", state:"loading"});
            setStatus({field:"id", color:"white", text:""});
			$("#textforME").val("");
        } else if ($("div[class='no-inquiry-selected']").length>0) {  // no inquiry selected
            setStatus({field:"page", state:"no inquiry"});
            setStatus({field:"id", color:"white", text:""});
			$("#textforME").val("");
        } else {
            setStatus({field:"page", state:"unknown"});
            setStatus({field:"id", color:"white", text:""});
			$("#textforME").val("");
        }
    }, 100);

	var refreshIntervalId2 = setInterval(function() {
		if (location.hostname.indexOf("staging")>=0) $("div[class~='navbar-fixed'] nav").css("background", "red");  // mark navbar red on Staging
    }, 5000);

})();
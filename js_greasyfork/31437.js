// ==UserScript==
// @name         TamperEmber "QuickFacts"
// @description  Improves Borg's functionality to make it more user friendly.
// @version      0.6.31
// @author       Lucas A. Metzen
// @namespace    ALMdoc
// @icon         http://www.betterdoc.org/favicon.ico
// @match        https://*.betterdoc.org/admins/sign_in
// @match        https://*.betterdoc.org/backstage/calendar
// @match        https://*.betterdoc.org/backstage/new/inquiries*
// @match        https://*.betterdoc.org/backstage/new/offline-inquiry
// @match        http://localhost:4200/backstage/*
// @match        http://localhost:4200/inquiries/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/31437/TamperEmber%20%22QuickFacts%22.user.js
// @updateURL https://update.greasyfork.org/scripts/31437/TamperEmber%20%22QuickFacts%22.meta.js
// ==/UserScript==

// changelog:
// 0.6.31: improve empty phone number handling
// 0.6.30: make phone number in persistent information section clickable
// 0.6.28: remove a debug command
// 0.6.27: properly find "weitere Anfragen" in history entries if they include links to inquiries (e.g. A9M5-17RD-MX08, when they've been copy&pasted without removing the formatting)
// 0.6.26: update link URL for "weitere Anfragen" to handle new Case IDs (XXXX-XXXX-XXXX) properly
// 0.6.25: update RegEx of "weitere Anfragen" to find new Case IDs (XXXX-XXXX-XXXX) with letters
// 0.6.24: remove unneeded console logging
// 0.6.23: display new Case ID (e.g. XXXX-XXXX-XXXX) correctly
// 0.6.22: replace missing exclamation mark image with equivalent emoji
// 0.6.21: update Borg URLs
// 0.6.20: added "Entferne Navbar in Kalender" function to remove navbar for bug in calendar where navbar overlaps pagination arrows
// 0.6.13: changed handling of "Send Email modal window" so size change works for Q3 physician confirmation too
// 0.6.12: added add'l survey link for Q0 survey
// 0.6.11: added add'l survey link for Q0 survey
// 0.6.10: added info to QF section which Q0 survey has been sent
// 0.6.04: test for errors in email formatting function and show warnings and errors
// 0.6.03: improved "Befunde erhalten" RegEx
// 0.6.02: fixed bug in email formatting function
// 0.6.01: fixed bug in email formatting function
// 0.6.00: added "Email formatieren" function for documentation in Ember
// 0.5.92: error handling for "Cannot use ‘in’ operator to search for ‘inquiry’ in ok" caught by Development
// 0.5.91: reduced max modal window size
// 0.5.90: maximize height of Send Email modal window
// 0.5.89: adjusted clickelement() etc to work with German "Historie" and "Alle" instead of "History" and "All"
// 0.5.88: show phone_number_prefix in action column, increased margin width to preceding field
// 0.5.87: adjusted action column position in Consultation Paused
// 0.5.86: adjusted action column position in Triage
// 0.5.85: added option to alphabetically sort ambassadors in calendar
// 0.5.82: changed font of label in action column
// 0.5.81: adapted action column to new Körbchen layout released today
// 0.5.80: fixed "Cannot read property 'dispatchEvent' of undefined" error when History is collapsed (i.e. Initial Interview)
// 0.5.75: updates QuickFacts display when inquiry is updated
// 0.5.74: changed behaviour of "weitere Anfragen" search in history
// 0.5.73: added function to unfreeze OIM
// 0.5.72: change window title to "Kalender" instead of "[PRODUCTION] Backstage"
// 0.5.71: mark all staging domains red

// BUGS:
// 14-1330-541, 11-1224-237, 12-1033-001 falsche Darstellung der weiteren Anfragen
// 17-1431-23, 12-5235-01, 16-5242-22, 18-5041-11 wrong "last History entry"
// 17-5052-02 weitere Anfragen funktioniert für 4. nicht richtig :(
// 85-5253-42 findet Befunde nicht
// 91-1053-421 weitere Anfragen funktionieren nicht, wenn man sie mit Quick-Facts-Links kopiert hatte
// 95-1311-223 ", wenn nur Teile fett sind

// TO DO:
// latest app. und most recent history eintrag beides auf $.each umstellen!
// "Befunde erhalten", falls Standardemail versandt wurde
// in Prepare und Research Tel.nr. und Geb.datum anzeigen; QuickFacts weiter nach unten schieben hier.

// IDEAS:
// a "freigeben" button which navigates to id:99
// wenn man Amb. im Q1 ändert und keiner in Inq. steht => Hinweis
// red Ember favicon for Staging


var menuID_showAllHistory, setting_showAllHistory = GM_getValue("setting_showAllHistory") || false, setting_sortCalendar = GM_getValue("setting_sortCalendar") || false,
    setting_copyNextInquiry = GM_getValue("setting_copyNextInquiry") || false;

function registerMenu_setting_toggleShowAllHistory() {  // register menu entry
    //menuID_showAllHistory = GM_registerMenuCommand("Quick Facts - autom. zeige History All: "+ (setting_showAllHistory ? 'ausschalten' : 'einschalten'), setting_toggleShowAllHistory, "h");
    menuID_showAllHistory = GM_registerMenuCommand("QuickFacts: zeige History All", toggleSetting_ShowAllHistory, "h");
}
function toggleSetting_ShowAllHistory() {  // toggle setting and re-register menu entry with different setting
    setting_showAllHistory = !setting_showAllHistory;
    GM_setValue("setting_showAllHistory", setting_showAllHistory);
    alert('automatisches Zeigen von History All ist nun '+(setting_showAllHistory ? 'AN' : 'AUS'));
    //GM_unregisterMenuCommand(menuID_showAllHistory);  // gibt's nicht, obwohl es es geben sollte: https://tampermonkey.net/documentation.php#GM_unregisterMenuCommand
}
registerMenu_setting_toggleShowAllHistory();  // register menu entry for the first time


function registerMenu_setting_toggleSortCalendar() {  // register menu entry
    menuID_showAllHistory = GM_registerMenuCommand("QuickFacts: sortiere Kalender", toggleSetting_SortCalendar, "k");
}
function toggleSetting_SortCalendar() {  // toggle setting and re-register menu entry with different setting
    setting_sortCalendar = !setting_sortCalendar;
    GM_setValue("setting_sortCalendar", setting_sortCalendar);
    alert('alphabetische Sortierung im Kalender ist nun '+(setting_sortCalendar ? 'AN' : 'AUS'));
}
registerMenu_setting_toggleSortCalendar();  // register menu entry for the first time


// format emails for documentation:
function formatemail() {
    var $editor = $("div[class='content-box bordered history'] trix-editor");
    //var pattern = /<div>.*(&lt;.*&gt;| [a-zA-Z0-9.\-@]* über betterdoc.de ?)<br>.*?(\d{2}.\d{2}.\d{4}|\d{1,2}\. .* \d{4})?(, | um )?(\d{2}:\d{2}|\d{2}:\d{2})?<br>(Betreff: .*<br>)?([aA]n:?\s?([a-zA-Z0-9.\-@]*)(<br>)*)(.*)<\/div>/gi; // $1 = sender address; $2 = date; $4 = time; $7 = recipient; $9 = message
    const pattern = /<div>.*(&lt;.*&gt;| [a-zA-Z0-9.\-@]* über betterdoc.de.*?)<br>.*?(\d{2}.\d{2}.\d{4}|\d{1,2}\. .* \d{4})?(, | um )?(\d{2}:\d{2})? ?(\(.*\))?<br>(Betreff: .*<br>)?([aA]n:?\s?([a-zA-Z0-9.\-@]*)(<br>)*)(.*)<\/div>/gi;
    //const pattern = /<div>.*(&lt;.*&gt;| [a-zA-Z0-9.\-@]* über betterdoc.de.*?)<br>.*?(\d{2}.\d{2}.\d{4}|\d{1,2}\. .* \d{4})?(, | um )?(\d{2}:\d{2})? ?(\(.*\))?<br>(Betreff: .*<br>)?(([aA]n|[tT])o:?\s?(&lt;.*&gt;|[a-zA-Z0-9.\-@]*)(<br>)*)(.*)<\/div>/gi;
    var split = pattern.exec($editor.val()); // $1 = sender address; $2 = date; $4 = time; $8 = recipient; $10 = message

    if (!split) { alert('QuickFacts: Formatierung leider nicht möglich'); return; }
    if (!split[4]) { alert('QuickFacts: Uhrzeit nicht gefunden, bitte überprüfen'); } // no time (split[4]) often indicates the whole formatting is not working  || !split[4]
    if (split[1].match("über betterdoc.de")) { // re-format address for answers to Q2/3 emails (from betterdoc to betterdoc)
        split[1] = "&lt;"+split[1].replace("über betterdoc.de","").replace(/ /g,"").replace("&nbsp;","")+"&gt;";
    }
    if (/\d{1,2}\. .* \d{4}/i.test(split[2])) { // check for "DD. MMMM YYYY" and replace long month name by numeral
        var mapObj = {
            Januar:"01.",
            Februar:"02.",
            März:"03.",
            April:"04.",
            Mai:"05.",
            Juni:"06.",
            Juli:"07.",
            August:"08.",
            September:"09.",
            Oktober:"10.",
            November:"11.",
            Dezember:"12."
        };
        split[2] = split[2].replace(/Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember/gi, function(matched){
            return mapObj[matched];
        }).replace(/ /g,"");
    }
    if (!split[2]) { // if date is empty, the email arrived today and it's just "[time] (vor X Stunden)"
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        dd = (dd < 10 ? '0'+dd : dd);
        mm = (mm < 10 ? '0'+mm : mm);
        split[2] = dd +'.'+ mm +'.'+ yyyy;
        alert("QuickFacts: Bitte Datum kontrollieren.");
    }
    //console.log(split[10]);
    split[10]=split[10].replace(/&nbsp;/gi,"").replace(/<br> ?<br>/gi, "<br>").replace(/<br> ?<br>/gi, "<br>"); // run replace once, then run again to replace replaced "<br><br>" (4->2->1)
    //console.log(split[10]);
    $editor.val("<div><b>EMAIL:</b> "+ split[1] +" am "+ split[2] + (split[4]?" um "+split[4]+" Uhr ":" ") +" an "+ split[8] +":<br><br>"+ split[10] +"</div>");

    if (split[1].indexOf('@')<1) alert("QuickFacts: Vorsicht, bitte Emailadresse kontrollieren.");
}
GM_registerMenuCommand("QuickFacts: Formatiere Email", formatemail, "e");


// unfreeze frozen OIM:
GM_registerMenuCommand("QuickFacts: hack.unfreeze OIM", function() { $("#content-for__body-footer").remove(); } , "f");

// remove navbar for bug in calendar where navbar overlaps pagination arrows:
if (window.location.href.includes(".betterdoc.org/backstage/calendar")) {
    GM_registerMenuCommand("QuickFacts: hack.entferne Navbar in Kalender", function() { $("div.navbar-fixed").remove(); } , "n");
}


/*function copy() {
	GM_setValue("setting_copyNextInquiry", true);
	alert('bitte Anfrage neuladen');
}
GM_registerMenuCommand("copy2", copy, "c");*/



const EMPTY = '&empty;';
var array_admins = [], array_vouchers = [], array_insurances = [], array_advisorleads =[],
    systimeDate = new Date();

function date_isotogerman(i) {
    var t=/(\d{4})-(\d{2})-(\d{2})/.exec(i);
    return t[3]+'.'+t[2]+'.'+t[1];
    //return `${t[3]}.${t[2]}.${t[1]}`;
}

function date_isototimestamp(i) {
    var t=/(\d{4})-(\d{2})-(\d{2})/.exec(i);
    return new Date(t[1], t[2]-1, t[3]);
}

// Default to an empty object if nothing is provided, like function foo ({ a=1, b=2 } = {}) {}
function make_label_data(width, label, data, id=false) {
    return '<div class="row-10" style="margin-bottom: 5px;"><span class="label clear-row" style="min-width: '+width+'px;">'+label+':</span><span class="data"'+ (id ? ' id="'+id+'"' : '') +' style="margin-left: '+width+'px;">'+data+'</span></div>';  // label multiline
}

function make_action_label_data(width, label, data, labeltag=true) { // use labeltag==true for label font like "Geb.datum", if false it looks like data
    return "<div class='section' style='max-width: "+width+"px;'>"+ (labeltag ? "<label>" : "<div class='content'>") +label+ (labeltag ? "</label>" : "</div>") +"<div class='content'>"+data+"</div></div>";
}

function find_data(container, label) {
    return container.find("span:contains('"+label+"')").parent().find("span[class='data']").html();
}

// click DOM element:
var clickEvent = document.createEvent ("HTMLEvents");
clickEvent.initEvent ("click", true, true);
function clickElement(e) {
    e.dispatchEvent(clickEvent);
}

Array.max = function( array ){  // find biggest number in array
    return Math.max.apply( Math, array );
};

/*function findIdInObj(obj) {
    return obj.id === 'cherries';
}

console.log(inventory.find(findCherries));*/

function removeLeadingZeros(str) {
    while(str.charAt(0) === '0')
    {
        str = str.substring(1);
    }
    return str;
}

function insertQuickFacts(j) {  // responseTextJSON
    if ($('#temperember_quickfacts').length>0) {  // QuickFacts already inserted; delete and re-insert. This happens when data is being saved.
        console.log('refreshing QuickFacts div');
        $('#temperember_quickfacts').remove();
        $('#temperember_quickfacts_actioncolumn').remove();
    }

    var phys, history_date, j_nextapp;
    var lastTVB = EMPTY, einschaetzung = EMPTY, j_lastContact = EMPTY, lastContactNote = EMPTY, befunde = EMPTY + ' (wahrscheinlich keine Befunde erhalten)', andereanfragen = EMPTY, survey = EMPTY;
    var patname = (j.inquiry.patient_data_title ? j.inquiry.patient_data_title+' ' : '') + (j.inquiry.patient_data_first_name ? j.inquiry.patient_data_first_name+' ' : '') + (j.inquiry.patient_data_last_name ? j.inquiry.patient_data_last_name.toUpperCase() : EMPTY);
    //var patname = (j.inquiry.patient_data_title ? j.inquiry.patient_data_title+' ' : '') + (j.inquiry.patient_data_first_name ? j.inquiry.patient_data_first_name+' ' : '') + (j.inquiry.patient_data_last_name ? j.inquiry.patient_data_last_name : EMPTY);

    if (j.inquiry_physician_contact_entries.length>0) {
        phys = j.inquiry_physician_contact_entries[0];
        if (phys.contact_type != 'Q1') {
            lastTVB = phys.contact_type +' '+ date_isotogerman(phys.contact_date) + (phys.bd_responsible ? (' (empfohlen' + (phys.bd_organized_appointment ? ' &amp; vereinbart)' : ')') ): '') +': ID'+phys.physician_id;
        }
    }

    if (j.inquiry_contact_entries.length>0) {
        // find latest history entry (for loop is fastest method) https://jsperf.com/finding-the-max-value-an-array-of-objects
        let history_max = 0, h_ent = j.inquiry_contact_entries;
        for (let i = 0; i < h_ent.length; i++ ) {
            if (h_ent[i].id > history_max) {
                history_max = h_ent[i].id;
                j_lastContact = h_ent[i]; // maybe not most elegant solution
            }
        }

        // construct date of last history entry
        history_date = new Date(j_lastContact.created_at);
        //console.log(history_date);
        var day=history_date.getDate();
        if ((String(day)).length==1) day='0'+day;
        var month=history_date.getMonth()+1;
        if ((String(month)).length==1) month='0'+month;
        var hours=history_date.getHours();
        if ((String(hours)).length==1) hours='0'+hours;
        var minutes=history_date.getMinutes();
        if ((String(minutes)).length==1) minutes='0'+minutes;
        history_date = day+'.'+month+'.'+history_date.getFullYear()+' '+hours+':'+minutes;

        // scour History for data
        $.each(j.inquiry_contact_entries, function(k, v) {
            var n = v.note;
            //console.log(n);
            //if (n.indexOf('<div>')>-1) {  // only handwritten history entries have <div>...</div> // no, that's not correct
            n = n.replace(/&nbsp;|<\/?div>/g,'').replace(/(<br><br>)/g, '<br>');

            // look for "Befunde vorhanden"
            if ((/befund/i.test(n)) || (/arztbrief/i.test(n))) {
                n.split('<br>').forEach(function(e) {
                    var matched = e.match(/(^(?!keine))(befunde?|arztbriefe?).(?!kommen).*(vorhanden|erhalten|eingegangen).*$/gmi);  // multiline & case insensitive
                    if (matched) {
                        befunde='Befunde wohl vorhanden ("'+e+'", '+date_isotogerman(v.created_at)+')';  //befunde = matched.input;
                        return true;
                    }
                });
            }

            // look for Patienteneinschätzung (evtl auch "|| freundlich"?), skip "Was erwartet Pat.: differenzierte Beratung"
            if ((n.toLowerCase().indexOf('differenziert')>-1)) { // && (n.toLowerCase().indexOf('was erwartet pat')==-1)) {
                n.replace(/<\/?div>/g, '').split('<br>').forEach(function(e) {
                    if ((/differenziert/i.test(e)) && (!/was erwartet pat/i.test(e))) {
                        einschaetzung='"'+e.replace(/^PATIENT: /i,'')+'"';
                        return true;
                    }
                });
            }

            // look for weitere Anfragen
            const regex_weitereanfragen=/(\d+|erste|zweite|dritte|vierte|fünfte|sechste|siebste|achte|neunte)\.? *anfrage *(?:id)?:? *([A-Z\d-]*),? *(.*)/gi;
            n=n.replace(/<\/?strong>|<\/?h1>/g, ' ').replace(/<br>/gi, '\n').replace(/<a.*">/gi, '').replace(/<\/a>/gi, '').replace('  ',' ');
            var t;
            while ((t=regex_weitereanfragen.exec(n)) !== null) {
                if (andereanfragen==EMPTY) andereanfragen='';  // for first run
                if ((!andereanfragen.match(t[2])) && (t[2]!=j.inquiry.masked_id)) {  // ignore entry if ID has already been found in history or is the same as current inq.
                    switch(t[1].toLowerCase()) {
                        case 'erste':   t[1]=1; break;
                        case 'zweite':  t[1]=2; break;
                        case 'dritte':  t[1]=3; break;
                        case 'vierte':  t[1]=4; break;
                        case 'fünfte':  t[1]=5; break;
                        case 'sechste': t[1]=6; break;
                        case 'siebte':  t[1]=7; break;
                        case 'achte':   t[1]=8; break;
                        case 'neunte':  t[1]=9; break;
                    }
                    let baseLink = t[2].length >= 12 ? "/backstage/new/inquiries/search/?query=id%3A" : "/backstage/new/inquiries/";
                    andereanfragen+=`${t[1]}. Anfrage: <a href="${baseLink}${t[2]}" target="_blank">${t[2]}</a>, ${t[3].replace(/<br>/g, ' ').replace(/\(|\)/g, '').replace(/(, )/g, '')}<br>`;
                }
            }

            // look for Q0 surveys
            const regex_surveys=/www\.surveymonkey\.de\/r\/([a-z0-9]*)\?id=/gi;
            var split_survey = regex_surveys.exec(n);
            if (split_survey) {
                switch(split_survey[1]) {
                    /* keine Ahnung, wann und warum doppelte genutzt werden, aber es gibt sie */

                    case 'RWQYC2C':
                    case 'SPYDC7B': survey="Hüfte"; break;
                    case 'YJJTRQN':
                    case 'SHFP5YL': survey="Rücken"; break;
                    case 'HSG5FLJ':
                    case 'SH8J7GR': survey="Knie"; break;
                    case 'VRT5JLK':
                    case 'VT9DJ3W': survey="Ellbogen"; break;
                    case 'SPH8LGF': survey="Schulter"; break;
                    case 'S6MVW6T': survey="Hand/Handgelenk"; break;
                    case 'YJW2F65':
                    case 'SZXNP7D': survey="Fuß/Fußgelenk"; break;
                    case 'ZNKHPYV':
                    case 'SGHNSMX': survey="Allgemein"; break;
                    case 'SZVZDRW': survey="Prostata"; break;
                    case 'WXQMNNK': survey="Zahn"; break;
                }
                //console.log('survey: '+ split_survey[1] +' = '+ survey)
            }
        });

        lastContactNote = j_lastContact.note.replace(/<a [^>]*>|<\/a>|<\/?strong>/g,'').replace(/<\/?div>/g,'<br>').replace(/<br><br>/g, '<br>').substr(0,400);  // br is seperately replaced because div produces <br><br> sometimes; .replace(/&nbsp;/g,'')
    }

    // TODO: for each
    if (j.inquiry_appointments.length>0) {
        j_nextapp = j.inquiry_appointments["0"];
        if (j_nextapp.state == "completed") {
            j_nextapp = EMPTY;
        } else {
            j_nextapp = j_nextapp.appointment_type.toUpperCase()+' '+ date_isotogerman(j_nextapp.scheduled_date) +' '+j_nextapp.scheduled_timeslot;
        }
    } else
        j_nextapp = EMPTY;

    var insertactioncolumn = $("div[class~='column-actions']").has("div[class~='sections']").length===0;
    var combinedlasthistory = history_date ? (history_date + (j_lastContact.admin_id ? (" ("+array_admins[j_lastContact.admin_id]+")") : '') +": "+ lastContactNote) : EMPTY;

    var birthdate_age = j.inquiry.patient_data_birth_date ? (date_isotogerman(j.inquiry.patient_data_birth_date)+' (' +
        (Math.floor((systimeDate - date_isototimestamp(j.inquiry.patient_data_birth_date)) / 31536000000 )) + ')')  // convert age's milliseconds to years
        : EMPTY;

    var inquiry_id = (j.inquiry.masked_id.length>=10) ? j.inquiry.masked_id : j.inquiry.id;

    var versicherung = EMPTY;  // find primary insurance
    $.each(j.inquiry_insurances, function(k, v) {
        if (v.main === true) {
            versicherung = array_insurances[v.insurance_id];
            return;
        }
    });

//	console.log(j.admins[j.inquiry.responsible_ambassador_id]);
//    if (array_advisorleads[j.inquiry.responsible_ambassador_id]) {
//        console.log('is advisor: '+array_advisorleads[j.inquiry.responsible_ambassador_id]);
//    }
    //console.log(j.inquiry.responsible_ambassador_id].is_medical_advisor + ': '+ array_advisorleads);
    /*for (var i=0; i < j.admins.length; i++) {
        if (j.admins[i].id == responsible_ambassador_id) {
            if (j.admins[i].is_medical_advisor === true)
				for (var i2=0; i2 < j.admins.length; i2++) {
					if (j.admins[i2].id == j.admins[i].lead_ambassador_id) {
						console.log('lead: '+j.admins[i2].id +'='+j.admins[i].lead_ambassador_id);
					}
				}
        }
    }
	if (j.admins[j.inquiry.responsible_ambassador_id].is_medical_advisor === true) {
		console.log(array_admins[j.admins[j.inquiry.responsible_ambassador_id].lead_ambassador_id]);
	}*/

    $("div[class~='column-3'] > div[class~='column-content'] > div:first").before("<div id='temperember_quickfacts' class='ember-view'><h3 class='ember-view'>Quick Facts: "+ inquiry_id +"</h3><div class='content-box bordered'>" +
        "<div class='half-size'>" +
        (!insertactioncolumn ? make_label_data(100, 'Name', patname) : '') +
        make_label_data(100, 'Diagnose', (j.inquiry_diagnosis_entries.length>0 ? j.inquiry_diagnosis_entries["0"].new_diagnosis_name : EMPTY)) +  // can there more than one?!
        // (!insertactioncolumn ? make_label_data(100, 'Ambassador', array_admins[j.inquiry.responsible_ambassador_id]||EMPTY) : '') + //   alles nur IDs :(
        (!insertactioncolumn ? make_label_data(100, 'Ambassador',
            (array_advisorleads[j.inquiry.responsible_ambassador_id] ? array_admins[j.inquiry.responsible_ambassador_id]+' ('+array_advisorleads[j.inquiry.responsible_ambassador_id]+')' :
                array_admins[j.inquiry.responsible_ambassador_id]||EMPTY)) : '') + //   alles nur IDs :(
        make_label_data(100, 'Einschätzung', einschaetzung) +
        make_label_data(100, 'Befunde', befunde) +
        (!insertactioncolumn ? make_label_data(100, 'Körbchen', j.inquiry.state) : '') +
        (!insertactioncolumn ? '' : make_label_data(100, 'letzter Kontakt', combinedlasthistory)) +
        "</div> <div class='half-size'>" +
        make_label_data(160, 'Versicherung', versicherung) +
        make_label_data(160, 'Voucher', (array_vouchers[j.inquiry.voucher_id]||EMPTY+" ❗")) +  // if (voucher == EMPTY) { voucher = "&#9888; " + EMPTY + ' (noch in weiterer Entwicklung)'; }  // not elegant solution
        make_label_data(160, 'Q0-Survey versendet', survey) +
        make_label_data(160, 'weitere Anfragen', andereanfragen||EMPTY, 'otherinquiries') +
        make_label_data(160, 'aktuellstes Appointment', j_nextapp) +
        make_label_data(160, 'letzte TVB', lastTVB, (lastTVB!=EMPTY ? 'physician_'+phys.physician_id : '')) +
        "</div> <div style='clear: both;'>" +
        (!insertactioncolumn ? ("<span class='label clear-row' style='min-width: 100px;'>letzter Kontakt:</span><span class='data' style='margin-left: 100px;'>"+
            combinedlasthistory +"</span>") : '') +
        "</div></div></div>" );

    // insert persistent information next to inquiry buttons (accept/next/complete/rerun...) if not in Prepare or Research:
    if (insertactioncolumn) {
        var $buttonlocation;
        switch(j.inquiry.state) {
            case "triage":
            case "research_triage":
            case "admission_paused":
            case "research_paused":
            case "consultation_paused":
            case "doc_appointment":
                $buttonlocation = $("div[class~='column-actions'] button:first");
                break;
            case "waiting_q3":
            case "waiting_q4":
            case "waiting_q5":
            case "waiting_q6":
                $buttonlocation = $("div[class~='column-actions'] div:first");
                break;
            case "completed":
                $buttonlocation = $("div[class~='column-actions'] div[class~='button-group']");
                break;
            default:
                $buttonlocation = $("div[class~='column-actions'] button:last");
        }

        let sanitisedPhoneNumber = "", linkPhoneNumber ="∅";
        if (j.inquiry.phone_number) {
            sanitisedPhoneNumber = (j.inquiry.phone_number_prefix) ? removeLeadingZeros(j.inquiry.phone_number) : j.inquiry.phone_number;
            linkPhoneNumber = `<a href="tel:${j.inquiry.phone_number_prefix}${sanitisedPhoneNumber}">${j.inquiry.phone_number_prefix} ${sanitisedPhoneNumber}</a>`;
        }

        $buttonlocation.after("<div id='temperember_quickfacts_actioncolumn' class='inquiry-info ember-view'> <div class='sections'>" +
            make_action_label_data(115, inquiry_id, j.inquiry.state, false) +
            /*<div class="section" style="max-width: 250px;"><p style="
                display: inline-block;
                margin-right: 0.25em;
                font-weight: 700;
            ">Wolfgang </p><div style="
                display: inline-block;
                text-transform: uppercase;
                font-weight: 700;
            ">Daschner</div>*/
            /*            (!insertactioncolumn ? make_label_data(100, (array_advisorleads[j.inquiry.responsible_ambassador_id] ? 'Amb.' : 'Ambassador'),
                                                               (array_advisorleads[j.inquiry.responsible_ambassador_id] ? array_admins[j.inquiry.responsible_ambassador_id]+'('+array_advisorleads[j.inquiry.responsible_ambassador_id]+')' :
                                                                array_admins[j.inquiry.responsible_ambassador_id]||EMPTY)) : '') + //   alles nur IDs :( */
            //			make_action_label_data(250, patname, 'Ambassador: '+(array_admins[j.inquiry.responsible_ambassador_id]||EMPTY)) +

            make_action_label_data(250, patname, (array_advisorleads[j.inquiry.responsible_ambassador_id] ? '' : 'Ambassador: ') +
                (array_advisorleads[j.inquiry.responsible_ambassador_id] ? array_admins[j.inquiry.responsible_ambassador_id]+' ('+array_advisorleads[j.inquiry.responsible_ambassador_id]+')' :
                    array_admins[j.inquiry.responsible_ambassador_id]||EMPTY), false) + //   alles nur IDs :( */

            make_action_label_data(107, 'Geb.datum', birthdate_age) +
            make_action_label_data(130, 'Tel.nummer', linkPhoneNumber) +
            "</div></div>");
    }
    document.title = (j.inquiry.patient_data_last_name ? (inquiry_id+': '+j.inquiry.patient_data_last_name) : inquiry_id );
}

(function() {
    'use strict';
    unsafeWindow.$(document).ajaxSuccess (
        function (event, requestData) {
            var obj;
            try {
                obj = jQuery.parseJSON(requestData.responseText);
            }
            catch(e) {
                //console.log('ERROR: '+requestData.responseText);
                return;
            }

            try { // error handling for "Cannot use ‘in’ operator to search for ‘inquiry’ in ok"
                /*var currentemberuser = $("a[data-activates='current-admin-dropdown']").html();
                  currentemberuser = currentemberuser.substr(0,currentemberuser.indexOf('<i')).trim();*/
                if ('inquiry' in obj) {
                    var historyButton = $("h3[class~='collapsed'] button:contains('Histor')"); // check if history is collapsed and unfold it
                    if(historyButton.length>0) {
                        clickElement(historyButton[0]);
                    }

                    if (($("div[class~='history']").length>0) && ($('#temperember_quickfacts').length===0) && setting_showAllHistory) {  // open All tab in history if history is present and quickfacts are not (only the first time inquiry is opened)
                        let h=$("h3[class~='collapsed'] div:contains('Histor')");
                        if (h.length>0) { // in Initial Interview, the History is collapsed and needs to be expanded before "All" can be clicked, otherwise: "Cannot read property 'discatchEvent' of undefined"
                            clickElement(h[0]);
                        }
                        clickElement($("div[class~='history'] a:contains('All')")[0]);
                    }
                    insertQuickFacts( obj );
                }

                // replace physician id with name in "quickfacts last TVB":
                if ('physician' in obj) {
                    var p = obj.physician;
                    if (($("#physician_"+p.id).length>0) && ($('#temperember_quickfacts').length>0)) {
                        $("#physician_"+p.id).html( $("#physician_"+p.id).html().replace('ID'+p.id, (p.title ? p.title+' ' : '') + p.full_name + ', ' + p.city) );
                    }
                }

                // collect global admins, insurances and vouchers:
                if (('admins' in obj) && ('vouchers' in obj) && ('insurances' in obj)) {
                    // console.log(obj);
                    $.each(obj.admins, function(k, v) {
                        array_admins[v.id] = v.display_name;

                        if (v.is_medical_advisor === true) {  // collect all lead ambassador's names and their medical advisors's ID's
                            $.each(obj.admins, function(k2, v2) {
                                if (v2.id == v.lead_ambassador_id) {
                                    array_advisorleads[v.id] = v2.display_name;  //.shortcut
                                    return;
                                }
                            });
                        }
                    });
                    $.each(obj.vouchers, function(k, v) {
                        array_vouchers[v.id] = v.client_name+' ('+v.value+')';
                    });
                    $.each(obj.insurances, function(k, v) {
                        array_insurances[v.id] = (v.insurance_type=='private' ? 'PKV' : 'GKV') +' '+ v.name;
                    });
                }

                // calendar
                if ('availabilites' in obj) { // there's a typo in Ember ...
                    if (setting_sortCalendar) {
                        var $caladmins = $("#admins a");
                        var alphabeticallyOrderedDivs = $caladmins.sort(function (a, b) {
                            if ($(a).text()=="ALL") { return -1; } // put "ALL" at the top
                            return ($(a).text().replace("Dr. ","").replace("med. ","") > $(b).text().replace("Dr. ","").replace("med. ","") ? 1 : -1);
                        });
                        // console.log(alphabeticallyOrderedDivs);
                        $("#admins").append(alphabeticallyOrderedDivs);
                        //$(".midttable").append(alphabeticallyOrderedDivs);
                    }
                }

                if (('subject' in obj) && ('content')) { // maximize height of Send Email modal window
                    var $div_modal=$('div[class="modal "]:first');
                    $div_modal.css('max-height','700px');
                    $div_modal.find('div[class="modal-content"]').css('max-height','650px');
                }
            }
            catch(e) {
                console.log('ERROR: '+requestData.responseText);
                return;
            }

        }
    );

    var refreshIntervalId = setInterval(function() {
        if (location.hostname.indexOf("staging")>=0) $("div[class~='navbar-fixed'] nav").css("background", "red");  // mark navbar red on Staging
        if (location.hostname.indexOf("localhost")>=0) $("div[class~='navbar-fixed'] nav").css("background", "#1034A6");  // mark navbar blue on local
    }, 2500);

    if (location.href == "https://www.betterdoc.org/backstage/calendar") document.title = "Kalender";  // change window title to "Kalender" instead of "[PRODUCTION] Backstage"
})();
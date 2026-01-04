// ==UserScript==
// @name         PAWS
// @namespace    https://greasyfork.org/users/28298
// @version      3.9
// @description  Download photo and more!
// @author       Jerry
// @include      /^https:\/\/.*bannerssb.*.edu\/.*$/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @noframes
// @license      GNU GPLv3
// @require      https://greasyfork.org/scripts/456410-gmlibrary/code/GMLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/456029/PAWS.user.js
// @updateURL https://update.greasyfork.org/scripts/456029/PAWS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // var links = document.getElementsByClassName('bti-job-detail-link');
    // var links = document.links;
    // for (var i = 0; i < links.length; i++){
    //     links[i].target="_blank";
    // }
    // document.documentElement.innerHTML

    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    addbutton("Select Term", function () {
        window.location.href = window.location.origin + '/ssb8/bwlkostm.P_FacSelTerm';
    }, 0.01*h, 0.18*w, 100);

    addbutton("Select CRN", function () {
        window.location.href = window.location.origin + '/ssb8/bwlkocrn.P_FacCrnSel';
    }, 0.01*h+30, 0.18*w, 100);

    addbutton("PSY Classes", function () {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1; // getMonth() returns the month (0 to 11)
        var semester = '';
        const spring = [1, 2, 3, 4]; const summer = [5, 6, 7]; const fall = [8, 9, 10, 11]
        if (month == 12) {
          semester = year + 1 + '30';
        } else if (spring.includes(month)) {
          semester = year + '30';
        } else if (summer.includes(month)) {
          semester = year + '60';
        } else if (fall.includes(month)) {
          semester = year + '90';
        }
        // console.log(semester);
        window.location.href = window.location.origin + '/ssb8/bwckschd.p_get_crse_unsec?term_in=' + semester + '&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_crse=&sel_subj=PSY&sel_title=&sel_schd=%25&sel_from_cred=&sel_to_cred=&sel_levl=%25&sel_ptrm=%25&sel_instr=%25&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a';
    }, 0.01*h+30*2, 0.18*w, 100);

    addbutton("Grad Change", function () {
        window.location.href = window.location.origin + '/ssb8/eiumisc.zsahgrch.P_FacChgGrd';
    }, 0.01*h+30*2, 0.18*w+110*1, 100);

    addbutton("Grad Midterm", function () {
        window.location.href = 'https://banner.eiu.edu/FacultySelfService/ssb/GradeEntry#/midterm';
    }, 0.01*h, 0.18*w+110*1, 100);

    addbutton("Grad Final", function () {
        window.location.href = 'https://banner.eiu.edu/FacultySelfService/ssb/GradeEntry#/final';
    }, 0.01*h+30, 0.18*w+110*1, 100);

    addbutton("My Courses", function () {
        window.location.href = window.location.origin + '/ssb8/bwlkifac.P_FacSched';
    }, 0.01*h, 0.18*w+110*2, 100);

    addbutton("My Schedule", function () {
        window.location.href = window.location.origin + '/ssb8/bwlkifac.P_FacDaySched';
    }, 0.01*h+30, 0.18*w+110*2, 100);

    addbutton("S Name Photo", function () {
        window.location.href = window.location.origin + '/ssb8/eiuphoto.ZPeiu_PhotoClaList';
    }, 0.01*h, 0.18*w+110*3, 100);

    addbutton("S Name Email", function () {
        window.location.href = window.location.origin + '/ssb8/bwlkfcwl.P_FacClaListSum';
    }, 0.01*h+30, 0.18*w+110*3, 100);

    addbutton("List Advisees", function () {
        window.location.href = window.location.origin + '/ssb8/zwlkadvr.P_DispAdvisees';
    }, 0.01*h, 0.18*w+110*4, 100);

    addbutton("Workload", function () {
        window.location.href = window.location.origin + '/ssb8/eiumisc.aodparms_pkg.proc_aodparms';
    }, 0.01*h+30, 0.18*w+110*4, 100);

    addbutton("Pay Stub", function () {
        window.location.href = 'https://banner.eiu.edu/EmployeeSelfService/ssb/hrDashboard#/payStubSummary/list/';
    }, 0.01*h, 0.18*w+110*5, 100);

    addbutton("Tax Forms", function () {
        window.location.href = window.location.origin + '/ssb8/twbkwbis.P_GenMenu?name=pmenu.P_TaxMenu';
    }, 0.01*h+30, 0.18*w+110*5, 100);

    addbutton("Leave Report", function () {
        window.location.href = 'https://banner.eiu.edu/EmployeeSelfService/';
    }, 0.01*h, 0.18*w+110*6, 100);




    // photo  ------------------------------
    if (window.location.pathname==="/ssb8/eiuphoto.ZPeiu_PhotoClaList") {

    var imgs = [];
    var images = document.images;
    for (var i = 0; i < images.length; i++) {
        if (images[i].src.includes('/photos/')) {
            imgs.push(images[i].src)
        }
    }

    var names = [];
    var tds = document.getElementsByTagName('td');
    for (i = 0; i < tds.length; i++) {
        if (tds[i].innerHTML.includes('/photos/')) {
            let name = tds[i].innerText;
            let matches = name.match(/\n([\w\'\-\s]+)\, ([\w\'\-]+)/);
            names.push(matches[2]+' '+matches[1]);
        }
    }

    if (imgs.length>0) {
        addbutton("Download Photos", function () {
            for (i = 0; i < imgs.length; i++) {
                GM_download(imgs[i],names[i]+'.jpg');
            }
            names.sort()
            let clipboard = ""; let msg = "";
            for (i = 0; i < imgs.length; i++) {
                clipboard = clipboard + "\"" + names[i] + "\", ";
                GM_setClipboard(names[i],"text")
                msg = msg + names[i] + "\n";
                sleep(500); // to allow clipboard operation
            }
            GM_setClipboard(clipboard,"text")
            alert(clipboard + "\n---------\n" + msg)

        }, 0.27*h, 0.50*w);
    }

    }; // end download photos




    // email ------------------------------
    if (window.location.pathname==="/ssb8/bwlkfcwl.P_FacClaListSum") {

    var outputs = ""; var emails = ""; var names = ""; var eids = ""; var firsts = ""; var lasts = ""; var list = [];
    const regex = /^E\d+$/;
    var tds = document.getElementsByTagName('td');
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].innerHTML.includes('mailto:')) {
            let html = tds[i].innerHTML;
            let matches = html.match(/mailto:([\w@.]+)/);
            let email = matches[1];

            matches = html.match(/target=\"([\w \.\'\-]+)/);
            let name = matches[1];
            let full = matches[1].split(' ');
            let first = full[0];
            let last = full[full.length-1];
            if (full.length > 3) {last = full.slice(full.length - 2).join(" ");}; // some has space in last name!

            list.push({"first":first,"last":last,"name":name,"email":email})
        }

        // // eid is in another td, so cannot be obtained at the same time as above; ignore for now
        // if (regex.test(tds[i].innerText)) {
        //     var eid = tds[i].innerText;
        // }
    }

    // https://stackoverflow.com/a/11499391/2292993
    list.sort(function(a, b) {
          return a.first > b.first;
    });

    for (var i = 0; i<list.length; i++) {
        emails = emails + list[i].email + "\n";
        firsts = firsts + list[i].first + "\n";
        lasts = lasts + list[i].last + "\n";
        // names = names + list[i].name + "\n";
        names = names + list[i].first + " " + list[i].last + "\n";
        outputs = outputs + list[i].first + '\t' + list[i].last + '\t' + list[i].email + '\n';
    }

    GM_setClipboard(names,"text");
    sleep(500); // to allow clipboard operation(500); // to allow clipboard operation
    GM_setClipboard(emails,"text");
    sleep(500);
    GM_setClipboard(lasts,"text");
    sleep(500);
    GM_setClipboard(firsts,"text");
    sleep(500);
    GM_setClipboard(outputs,"text");
    var searchString = "Summary Class List";
    // Get the entire HTML content of the page
    var htmlContent = document.documentElement.innerHTML;
    // Check if the string exists in the HTML content
    var stringExists = htmlContent.includes(searchString);
    if (stringExists) {alert(names + "\n---------\n" + emails + "\n---------\nLast:\n" + lasts + "\n---------\nFirst:\n" + firsts + "\n---------\n" + outputs)}
    }; // end copy emails

})();


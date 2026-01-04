// ==UserScript==
// @name         Moodel UI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moodle UI
// @author       Gerard López
// @include      https://atenea.upc.edu/*
// @include      https://sso.upc.edu/CAS/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432770/Moodel%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/432770/Moodel%20UI.meta.js
// ==/UserScript==
var favicon = document.querySelectorAll('[rel="shortcut icon"]')[0].href;
var moodleid = favicon.split('/theme/').pop().split('/favicon')[0];
var ilist = document.images;
for(var i = 0; i < ilist.length; i++) {
    img=ilist[i]
    // Atenea Login Logo
    if(img.src == "https://atenea.upc.edu/pluginfile.php/1/core_admin/logo/0x200/" + moodleid + "/atenea_login.png") {
         img.src = "https://svgur.com/i/Wtd.svg";
    }
    // UPC Logo
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/theme/" + moodleid + "/upc_mig") {
         img.src = "https://svgur.com/i/S85.svg";
    }
    //Atenea Logo
    if(img.src == "https://atenea.upc.edu/pluginfile.php/1/core_admin/logocompact/0x70/" + moodleid + "/Head-SimbolATENEA-Blau.png") {
         img.src = "https://svgur.com/i/Wte.svg";
         //Alternative: https://svgur.com/i/S8F.svg
    }
    //Homepage Header
    if(img.src == "https://atenea.upc.edu/pluginfile.php/1/block_carousel/carousel/1/Franja-ATENEA.jpg") {
         img.src = "https://svgur.com/i/SDL.svg";
    }
    //EETAC Logo
    if(img.src == "https://atenea.upc.edu/local/upc/campus/campus_image.php?campus=EETAC") {
         img.src = "https://svgur.com/i/S7y.svg";
    }
    //File icons 
    //PDF
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/pdf-24") {
         img.src = "https://svgur.com/i/S6B.svg";
    }
    //Word
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/document-24") {
         img.src = "https://svgur.com/i/S89.svg";
    }
    //PP
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/powerpoint-24") {
         img.src = "https://svgur.com/i/S6C.svg";
    }
    //Excel
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/spreadsheet-24") {
         img.src = "https://svgur.com/i/S5e.svg";
    }
    //Image
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/jpeg-24") {
         img.src = "https://svgur.com/i/S8c.svg";
    }
    //Video
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/mpeg-24") {
         img.src = "https://svgur.com/i/SaB.svg";
    }
    //Picture
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/jpeg-24") {
         img.src = "https://svgur.com/i/S8c.svg";
    }
    //Website
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/url/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/S8H.svg";
    }
    //Task
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/quiz/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/S8B.svg";
    }
    //Assignment
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/assign/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/S8A.svg";
    }
    //Exam
    if(img.src == "https://atenea-examens.upc.edu/theme/image.php/campus/theme/" + moodleid + "/favicon") {
         img.src = "https://svgur.com/i/S8J.svg";
    }
    //Exam Alt
    if(img.src == "https://atenea-examens.upc.edu/theme/image.php/campus/theme/" + moodleid + "/favicon") {
         img.src = "https://svgur.com/i/S8J.svg";
    }
    //Folder
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/folder/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/S8D.svg";
    }
    //Folder (Small)
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/folder-24") {
         img.src = "https://svgur.com/i/S8D.svg";
    }
    //Undefined
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/html-24") {
         img.src = "https://svgur.com/i/S6r.svg";
    }
    //Star
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/png-24") {
         img.src = "https://svgur.com/i/S83.svg";
    }
    //Info
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/page/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/S6m.svg";
    }
    //Forum
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/forum/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/SJ9.svg";
    }
    //Assistencia
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/attendance/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/SHY.svg";
    }
    //Notes
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/book/" + moodleid + "/icon") {
         img.src = "https://svgur.com/i/SGa.svg";
    }
    //PDF Tiny
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/pdf") {
         img.src = "https://svgur.com/i/SJL.svg";
    }
    //PDF Big
    if(img.src == "https://atenea.upc.edu/theme/image.php/campus/core/" + moodleid + "/f/pdf-80") {
         img.src = "https://svgur.com/i/SJL.svg";
    }
    //SSO Login Logo
    if(img.src == "https://sso.upc.edu/themes/upc.20191223.RFC.940152.SAML2.nou.disseny.grafic.UPC/img/upc_logo_header.png") {
         img.src = "https://atenea.upc.edu/pluginfile.php/1/core_admin/logo/0x200/1613021561/atenea_login.png";
    }
    
}

/* 
PDF Square
https://atenea.upc.edu/theme/image.php/campus/core/1613021561/f/pdf 
Folder
https://svgur.com/i/S8D.svg
https://svgur.com/i/SHK.svg

PDF Big Submit
https://atenea.upc.edu/theme/image.php/campus/core/1613021561/f/pdf-80
*/





(function() {
let css = `
div[role=button]{
  outline: none;
}

*{
  outline: none;
}


/* MY COURSES */
/* Title */
.block_mycourses .card-title {
  display: NONE;
  } 
.card-deck .myoverviewimg {
  height: 25px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  }

/*Notifications*/
.popover-region-toggle::before, .popover-region-toggle::after {
display: none;
}
#page-my-index #region-main .block-region .block_announcements {
margin: 0px!important;
}
/*Side Images*/
.atto_image_button_text-top.img-responsive, .atto_image_button_middle.img-responsive, .atto_image_button_text-bottom.img-responsive {
max-width: 100%;
}

.block_html.block.card.mb-3 > div > div > div.no-overflow > p:last-child {
margin-bottom: 0rem;
}

/*LEFT MENU*/
/*Pop Ups*/
.bs-popover-right.show, .block_recentlyaccessedcourses{
display: none
}

/*Top Menu*/
#nav-drawer > nav > nav:nth-child(1){
margin-right: 10px;
margin-left: 10px;
width: calc(100% - 20px);
}
#nav-drawer > nav > nav:nth-child(1) > div{
color: #373a3c;
border-bottom: 0px;
border-bottom-color: transparent!important;
background-color: white;
border-bottom: 2px solid #ddd;
border-radius: 15px;
margin-top: 10px;
width: 100%;
text-align: center;
}
#nav-drawer > nav > nav:nth-child(1) > div > a{
margin-left: 15px;
margin-right: 15px;
}

/*Contents Menu*/
#nav-drawer > nav > nav:nth-child(2){
margin-right: 10px;
margin-left: 10px;
width: calc(100% - 20px);
margin-top: 25px!important;
}
#nav-drawer > nav > nav:nth-child(2) > a:nth-child(1){
border-top-right-radius: 15px;
border-top-left-radius: 15px;
}
#nav-drawer > nav > nav:nth-child(2) > a:last-child{
border-bottom-right-radius: 15px;
border-bottom-left-radius: 15px;
border-bottom-color: transparent!important;
}
#nav-drawer .dscurrent > media-left{
diplay: none!important;
}
#nav-drawer .dscurrent {
margin-left: 0em;
}

/*Tools Menu*/
#nav-drawer > nav > nav:nth-child(3){
margin-right: 10px;
margin-left: 10px;
width: calc(100% - 20px);
}
#nav-drawer > nav > nav:nth-child(3) > div{
color: #373a3c;
border-bottom: 0px;
border-bottom-color: transparent!important;
background-color: white;
border-bottom: 2px solid #ddd;
border-radius: 15px;
margin-top: 10px;
width: 100%;
text-align: center;
}
#nav-drawer > nav > nav:nth-child(3) > div > a{
margin-left: 15px;
margin-right: 15px;
}

/*Subject Menu*/
.list-group-item {
display: inline-block;
}
#nav-drawer > nav > nav:nth-child(4) > a > div{
margin-left: 0rem!important;
}

#nav-drawer > nav > nav:nth-child(4){
margin-right: 10px;
margin-left: 10px;
width: calc(100% - 20px);
margin-top: 25px!important;
}

#nav-drawer > nav > nav:nth-child(4) > div:nth-child(1), #nav-drawer > nav > nav:nth-child(2) > div{
display:none;
}
#nav-drawer > nav > nav:nth-child(4) > a:nth-child(2){
border-top-right-radius: 15px;
border-top-left-radius: 15px;
}
#nav-drawer > nav > nav:nth-child(4) > a:nth-last-child(4){
border-bottom-right-radius: 15px;
border-bottom-left-radius: 15px;
border-bottom-color: transparent!important;
}

#nav-drawer > nav > nav:nth-child(4) > a:nth-last-child(1), #nav-drawer > nav > nav:nth-child(4) > a:nth-last-child(2), #nav-drawer > nav > nav:nth-child(4) > a:nth-last-child(3){
display: none;
}

/*Header*/
.carousel-item.active, .carousel-item-next, .carousel-item-prev {
display: block;
background-color: #0078C1;
}
.carousel-caption {
background-image: url(https://svgur.com/i/Wuq.svg); /* Alternative: https://svgur.com/i/SDS.svg*/
margin-top: -9px;
}
.carousel-item h3 {
display: none;
}

/*Bredcrumps*/
#page-navbar > nav > ol > li:nth-child(0),
#page-navbar > nav > ol > li:nth-child(1),
#page-navbar > nav > ol > li:nth-child(2),
#page-navbar > nav > ol > li:nth-child(3)::before{
display: none;
}

/* Subject Radius */
.mycourse_course_container > div > .card > a > div {
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
  }
 
/* Subject BG Colors */
.mycourse_course_container > div:nth-child(1)  > .card > a > div {
  background-color: #0066FC!important;
  background-image: url("f")!important;
  }
.mycourse_course_container > div:nth-child(2)  > .card > a > div {
  background-color: #FFBA01!important;
  background-image: url("f")!important;
  }
.mycourse_course_container > div:nth-child(3)  > .card > a > div {
  background-color: #15D31C!important;
  background-image: url("f")!important;
  }
.mycourse_course_container > div:nth-child(4)  > .card > a > div {
  background-color: #7A40BA!important;
  background-image: url("f")!important;
  }
.mycourse_course_container > div:nth-child(5)  > .card > a > div {
  background-color: #FE7D00!important;
  background-image: url("f")!important;
  }
.mycourse_course_container > div:nth-child(6)  > .card > a > div {
  background-color: #FF2625!important;
  background-image: url("f")!important;
  }

/* Subject Border Colors */
.mycourse_course_container > div:nth-child(1)  > .card {
  border-color: #0066FC!important;
  }
.mycourse_course_container > div:nth-child(2)  > .card {
  border-color: #FFBA01!important;
  }
.mycourse_course_container > div:nth-child(3)  > .card {
  border-color: #15D31C!important;
  }
.mycourse_course_container > div:nth-child(4)  > .card {
  border-color: #7A40BA!important;
  }
.mycourse_course_container > div:nth-child(5)  > .card {
  border-color: #FE7D00!important;
  }
.mycourse_course_container > div:nth-child(6)  > .card {
  border-color: #FF2625!important;
  }
/*Interior Padding*/
body.drawer-open-left .drawer-pr-1, body.drawer-open-left .drawer-px-1 {
padding-right: 1.25rem!important;
padding-left: 1.25rem!important;
}

/* Subject Qualification Border Colors */

/**/
#coursefiltration  {
  display:none
}


/* Qualificacions Button */
li.list-group-item.justify-content-between.cattree {
  display: none;
  }
.list-group-item:last-child {
  margin-bottom: 0;
  border-radius: 15px;
  }

/* Space Between Subjects and Others */
#opencourses > div:nth-child(7) {
  margin-top: 80px;
}
#opencourses > div:nth-child(8) {
  margin-top: 80px;
}



/* TOP BAR */
.navbar {
  max-height: 80px;
  height: 80px;
  padding-top: 10px;
  }

#page-wrapper > nav > div.d-inline-block.mr-3 > button {
background-color: #fff;
border: 0px;
}

.icon.fa.fa-bars.fa-fw  {
color: #0377BB;
font-size: 20px
}



/*SIDE MENU
#nav-drawer > nav > a:nth-child(10),
#nav-drawer > nav > a:nth-child(11),
#nav-drawer > nav > a:nth-child(12),
#nav-drawer > nav > a:nth-child(13) {
display: none;
}
*/

/*PAGE HEADER*/
.page-header-box {
background-color: #07b;
background-image: url(https://svgur.com/i/SDL.svg);
background-size: cover; 
color: #fff;
padding-left: 2em;
border-radius: 0;
}
.page-context-header .page-header-headings, .page-context-header .header-button-group {
width: auto;
max-width: 700px;
}

/* FORM */
.form-control, #region-main, .card-body {
  border-radius: 15px;
  }

/*Confirmation Dialog*/
.modal-content, .moodle-dialogue-base .moodle-dialogue-wrap.moodle-dialogue-content {
border-radius: 15px;
padding: 10px;
}

/*FORUM*/
.forumpost {
border-radius: 15px;
}
#region-main > div > div > div:nth-child(2) > div.forumpost.clearfix.lastpost.firstpost.starter > div.row.header.clearfix > img {
border-radius: 50%;
}

/* FILE UPLOAD */
.btn-sm, .btn-group-sm > .btn, #page-grade-grading-manage .actions .btn-group-sm > .action, #rubric-rubric.gradingform_rubric #rubric-criteria .criterion .addlevel .btn-group-sm > input, #rubric-rubric.gradingform_rubric .btn-group-sm > .addcriterion {
  padding: .25rem .5rem;
  font-size: .8203125rem;
  line-height: 2.5;
  border-radius: 10px;
  border-radius: 10px;
}


/*DIALOGS*/
/*Alert Danger*/
.alert-danger, #page-admin-index .adminerror {
border-radius: 15px;
}


/* CHAT */
.badge-important {
  background-color: #E31E24 !important;
  border-radius: 15px !important;
  padding-right: 6px !important;
  padding-left: 6px !important;
  }
.popover-region-header-container {
  height: 44px;
  line-height: 25px;
  padding-left: 5px;
  padding-right: 5px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  align-content: center;
  padding-top: 8px;
  padding-left: 10px;
  }
.popover-region-header-text {
  float: left;
  margin: 0;
  font-size: 14px;
  line-height: 25px;
  font-weight: 800;
  }
.navbar .count-container {
  padding: 5px;
  border-radius: 15px;
  background-color: red;
  color: white;
  font-size: 12px;
  line-height: 10px;
  position: absolute;
  top: 10px;
  right: 0px;
  padding-right: 6px;
  padding-left: 6px;
  font-weight: 600;
  }
.mr-1, .mx-1 {
  margin-right: .25rem!important;
  margin-top: 0rem!important;
  font-size: 18px;
  vertical-align: middle;
  }
.navbar.fixed-top .dropdown .dropdown-menu {
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  border-radius: 15px;
  }
#action-menu-1-menu > a:last-child {
  display: block;
  width: 100%;
  padding: .25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: red;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  }
.popover-region-container {
  opacity: 1;
  visibility: visible;
  position: absolute;
  right: 0;
  top: 0;
  height: 500px;
  width: 380px;
  border: 1px solid #ddd;
  -webkit-transition: height .25s;
  -o-transition: height .25s;
  transition: height .25s;
  background-color: #fff;
  z-index: 1;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  }
.popover-region-footer-container {
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  background-color: #fff;
  padding-top: 7px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-left: -1px;
  margin-right: -1px;
  }
#page-wrapper > nav > a.navbar-brand.has-logo.px-1.px-md-3.mx-1 > span > img {
  max-height: 25px;
  max-width: 100%;
  margin-top: -10px!important;
  border-radius: 0;
  }
.list-group-item {
  position: relative;
  display: block;
  padding: .75rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 15px;
}
#section-0 {
  padding-top: unset;
  border: 0px
}
.course-content ul li.section.main {
  border-bottom: 1px solid #dee2e6;
  margin-top: 1rem;
  margin-right: 0px;
  border-radius: 15px;
  padding-right: 15px;
  padding-top: 20px;
}
#inst377330 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
#inst377331 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
#inst377332 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
/* BOTTOM PAGE (Directions)
.m-t-2, .m-y-2 {
margin-top: 2rem!important;
display: none;
}
*/

/* SUBJECT PANE*/
.section li.newsforum.activity {
margin-bottom: 1em;
border: 0px;
}
.ml-md-4, .mx-md-4 {
margin-left: 0rem!important;
}

#module-2419175 > div > div > div:nth-child(2) > div > div > div > div > div.morelink.ml-0.ml-md-4 {
display: none;
}

#page-header > div > div > div > div > div > div > div > h1 {
    margin-bottom: 0!important;
    background-color: #0377BB!important;
}
#section-0 > div.content > div.summary > div > div > h2 {
    padding-left: 20px!important;
}

.course-content ul li.section.main:last-child {
border-bottom: 1px solid #dee2e6;
}

.mt-3, .my-3 {
    margin-top:0rem !important
}
#page-my-index .block_html .content {
    padding-top:15px !important
}
.section_availability, .summary{
margin-left: 20px!important;
}
#section-0{
padding-top: 20px;
}
/*QUIZZES*/
body.drawer-open-left #region-main .card-body, body.drawer-open-left #region-main .userprofile .profile_tree section, .userprofile .profile_tree body.drawer-open-left #region-main section {
padding-right: 1rem;
}
/*Summary Box*/
#region-main > div > div > div:nth-child(2) > table.quizattemptsummary > caption{
display: none;
}

/*Questions*/
.alert-info, #page-admin-index .releasenoteslink, #adminsettings .form-overridden, .que .formulation {
  color: #2f6473;
  background-color: #def2f8;
  border-color: #d1edf6;
  border-radius: 15px;
  }
.outcome.clearfix {
  border-radius: 15px;
}

div.content > div.formulation.clearfix > div.ablock > fieldset > legend {
display:none;
}

div.content > div.formulation.clearfix > div.ablock > div.prompt {
display:none;
top: -100px;
}

.que .qtext {
margin-bottom: 0
}

/*Question Info Box*/
.que .info {
  float: left;
  width: 5em;
  padding: .5em;
  margin-bottom: 1.8em;
  background-color: #dee2e6;
  border: 1px solid #cad0d7;
  border-radius: 15px;
  }
.que .content {
    margin: 0 0 0 6.5em;
}
.questionflag.editable, .info > .grade, .que .info>div{
display: none
}
.que h3.no {
margin: 0;
font-size: .8em;
line-height: 1;
text-align: center;
}
.que span.qno{
font-size: 3.5em;
font-weight: 700;
}
.atto_image_button_text-bottom {
  vertical-align: text-bottom;
  margin: 0 ;
  border-radius: 15px;
  }

.card, #page-enrol-users #filterform, .que .history, .userprofile .profile_tree section, .groupinfobox, .well {
  border-radius: 15px;
  }
button, html [type="button"], [type="reset"], [type="submit"] {
  -webkit-appearance: button;
  border-radius: 15px;
  }
.custom-select {
  border-radius: 15px;
  }
#page-header>div {
  margin-top: 0px;
  padding-right: 25px;
  padding-left: 15px;
  }
.top-page {
  display: none;
  }
.tag-info, #page-admin-index .adminwarning.availableupdatesinfo .moodleupdateinfo.maturity200 .info.release, .assignfeedback_editpdf_widget .label {
  background-color: #5bc0de;
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
  }
.section .activity .availabilityinfo, .section .activity .contentafterlink {
  margin-top: 0em;
  margin-left: 30px;
  }
.section .label .mod-indent-outer {
  padding-left: 0px;
  padding-top: 15px;
  display: block;
  }
.div.left.side {
  width: 1px;
  }
.section > div.content > h3 {
margin-left: 20px!important;
}

#region-main > div > div > div > div > ul > li.section > div.left.side, #region-main > div > div > div > div > ul > li.section > div.right.side {
    display: none;
}



/*MOBILE*/
/*Subject List*/
@media (max-width: 544px) {
    #region-main-settings-menu.has-blocks, #region-main.has-blocks {
        width: calc(100% - 30px)!important;
        margin-left: 15px;
        margin-right: 15px;
    }
    #block-region-side-pre {
        padding-right: 15px;
        padding-left: 15px;
    }
}
/*Subject Page*/
@media (max-width: 544px) {
    #page-header > div > .card, #page-enrol-users #page-header > div > #filterform, .que #page-header > div > .history, .userprofile .profile_tree #page-header > div > section, #page-header > div > .groupinfobox, #page-header > div > .well {
        padding-left: 0!important;
    }
    #page-header>div {
        margin-top: 0px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .page-header-box {
        background-color: #07b;
        background-image: url(none);
        background-size: cover; 
        color: #fff;
        padding-left: 2em;
        border-radius: 15px;
    }
    #page-header > div > div > div > div.d-flex.flex-wrap {
        display: none!important;
    }
    .page-context-header .page-header-headings, .page-context-header .header-button-group {
    width: 100px;
}
    #page-header > div > div > div > div > div > div > div > h1 {
        margin-bottom: 0!important;
    }
    #region-main > div > div > div > div > ul > li.section {
        padding-right: 0px;
        padding: 10px;
        margin-top: 0px;
        margin-bottom: 10px;
    }
    .course-content ul.topics li.section .content, .course-content ul.weeks li.section .content {
    margin-top: 0px;
    }
    #region-main .content h3.sectionname {
        margin-left: 10px;
    }
    .course-content ul.topics li.section .summary, .course-content ul.weeks li.section .summary, .course-content ul.topics li.section .content > .availabilityinfo, .course-content ul.weeks li.section .content > .availabilityinfo {
        margin-left: 10px;
    }
    #region-main ul.section {
        padding-left: 0;
        margin: 1rem 10px;
    }
    #region-main > div > div {
        padding: 15px!important;
    }
    #section-0 {
    padding: 0px !important;
    }
    
    /*Left Panel*/
        #nav-drawer > nav > nav:nth-child(1) {
        margin-top: 10px!important;
    }
    #nav-drawer > nav > nav:nth-child(1) > a:nth-child(2){
        border-top-right-radius: 15px!important;
        border-top-left-radius: 15px!important;
    }
    #nav-drawer > nav > nav:nth-child(1) > a:nth-child(5){
        border-bottom-right-radius: 15px!important;
        border-bottom-left-radius: 15px!important;
        border-color: transparent!important;
    }
    #nav-drawer > nav > nav:nth-child(3){
        margin-top: 15px!important;
    }
    #nav-drawer > nav > nav:nth-child(3) > a:nth-child(2) {
        display: none;
    }
    #nav-drawer > nav > nav:nth-child(3) > a:nth-child(3){
        border-radius: 15px;
        border-color: transparent!important;
    }
}



/* MANTENIMENT
body {
background-image: url(https://i.ibb.co/9sZ1r2M/0b06397a3199bee4a5922ee4488ebf5a.jpg);
font-family: 'Open sans', arial, serif;
}
.box {
background: none repeat scroll 0 0 white;
color: #555;
box-shadow: 2px 2px 2px #666;
margin-top: 5%;
padding: 35px;
text-align: left;
width: 65%;
max-width: 700px;
border-radius: 15px;
font-family: -apple-system;
}

/* LOGIN PAGE */
#page-login-index .card-header{
  background-color: unset!important
}
#region-main > div > div.row.justify-content-center > div > div{
background-color: rgba(255, 255, 255, 0.75);
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(5px);
color: black
}
body#page-login-index>#page-wrapper {
  background: url('https://i.ibb.co/9sZ1r2M/0b06397a3199bee4a5922ee4488ebf5a.jpg') !important;
  }
.login-campus h2>img {
  max-width: 100%;
  margin-bottom: 20px;
  }
.justify-content-end {
  justify-content: center;
  }

/* Padding Top */
#maincontent {
 display: block;
 height: 0px;
 overflow: hidden;
 margin-top: 0px;
 }

/*SSO LOGIN*/
.login-sidebar .login-box {
display: block;
margin: 48px auto;
left: -7px;
bottom: auto;
position: relative;
min-height: auto;
width: 844px;
height: 479px;
background: rgba(250,250,250,.9);
border-radius: 15px;
padding-left: 45px;
padding-right: 45px;
}

.btn-info, .btn-info.disabled {
background: #07b;
border: #07b;
height: 52px;
}

.footer {
border-top: 0px ;
}

#wrapper {
background: url('https://i.ibb.co/9sZ1r2M/0b06397a3199bee4a5922ee4488ebf5a.jpg') !important;
}

/*Language*/
div.blue_bar {
display: none;
}

#titulo_3col, #holder, hr {
display: none;
}


`;

if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
    
    
    
})();

//Page Title
var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300016 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300205 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300206 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300207 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300208 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300219 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('(Curs Total)','');
document.title = newtitle;


var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300016-CUTotal','FT');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300022-CUTotal','CSD');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300209-CUTotal','TER');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300212-CUTotal','I2');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300213-CUTotal','ITA');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300242-CUTotal','AM2');
document.title = newtitle;


(function () {
    'use strict';

    var words = {
        // Burger Menu,
        '2021/22-01:EETAC-300016-CUTotal' : 'Fonaments de Telemàtica',
        '2021/22-01:EETAC-300022-CUTotal' : 'Circuits i Sistemes Digitals',
        '2021/22-01:EETAC-300209-CUTotal' : 'Termodinàmica',
        '2021/22-01:EETAC-300212-CUTotal' : 'Informàtica II',
        '2021/22-01:EETAC-300213-CUTotal' : 'Infraestructures Aeroespacials',
        '2021/22-01:EETAC-300242-CUTotal' : 'Ampliació de Mates II',
        '2017/18-00:EETAC-DABL-CU1' : "Delegació d'Alumnes",
        '2016/17-00:EETAC-EETACTU673-CUTotal' : 'Tutoria',
        // Subject List,
        "300016 - FONAMENTS DE TELEMÀTICA (Curs Total)" : 'Fonaments de Telemàtica',
        "300022 - CIRCUITS I SISTEMES DIGITALS (Curs Total)" : 'Circuits i Sistemes Digitals',
        "300209 - TERMODINÀMICA (Curs Total)" : 'Termodinàmica',
        "300212 - INFORMÀTICA 2 (Curs Total)" : 'Informàtica II',
        "300213 - INFRAESTRUCTURES DEL TRANSPORT AERI (Curs Total)" : 'Infraestructures del Transport Aeri',
        "AMPLIACIÓ DE MATEMÀTIQUES 2 (Curs Total)" : 'Ampliació de Matemàtiques II',
        "TUTORIA: ROYO CHIC, Pablo (Curs Total)" : 'Tutoria: Pablo Royo',
        "No s'ha respost encara" : "",
        "Puntuat sobre 1,00" : "",
        "Marca la pregunta" : ""
};
    //////////////////////////////////////////////////////////////////////////////
    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);
            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());


(function() {
let css = `

`;

}());


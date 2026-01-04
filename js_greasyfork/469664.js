// ==UserScript==
// @name        Better-Devinci
// @namespace   Better-Devinci Scripts
// @description A script to enhance everyday's life being at PULV
// @match       https://my.devinci.fr/*
// @match       https://learning.devinci.fr/*
// @match       https://adfs.devinci.fr/*
// @exclude     https://learning.devinci.fr/pluginfile.php/*/mod_resource/content/*/*.pdf
// @version     4.5.1
// @author      Better-Devinci
// @license     GNU GPLv3
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_info
// @downloadURL https://update.greasyfork.org/scripts/469664/Better-Devinci.user.js
// @updateURL https://update.greasyfork.org/scripts/469664/Better-Devinci.meta.js
// ==/UserScript==

// 

//beginning IIFE
(function () {
    'use strict';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.href, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            try{
            CheckPage() // lock page until full exec
            }
            catch(e){
                console.error(e)
                xhr.send(null);
            }
        }
    };
    xhr.send(null);
    function CheckPage(){
        setup();
        if(location.href.includes("my.devinci.fr/")){
            Portal_Setup()
            if(location.href === "https://my.devinci.fr/"){
                Portail_MainPage()
            }
            else if(location.href === "https://my.devinci.fr/?my=msg&Better-Devinci"){
                BetterDevinci_Page()
            }
            else if(location.href === "https://my.devinci.fr/?my=marks"){
                Marks()
            }
            else if(location.href === "https://my.devinci.fr/student/presences/"){
                Presence()
            }
            else if(location.href.includes("https://my.devinci.fr/student/cours/evaluations/")){
                Evaluations()
            }
            else if(location.href === 'https://my.devinci.fr/?my=edt'){
                EDT_Page()
            }
        }
        else if(location.href.includes("https://learning.devinci.fr")){
            Page_learning_devinci()
            if(location.href.includes("https://learning.devinci.fr/course/view.php?id=")||location.href.includes("https://learning.devinci.fr/mod") && !location.href.includes("https://learning.devinci.fr/mod/forum")){
                Courses()
            }
            else if(location.href.includes("https://learning.devinci.fr/my/")){
                Learning_Main_Page()
            }
        }
        else if(location.href.includes("https://adfs.devinci.fr/adfs/") && GM_getValue("ADFS_autologin")){
            ADFS()
        }
    }


    function setup(){
        const betterdevinciactualversion = GM_info.script.version;

        if(betterdevinciactualversion!=GM_getValue("Version_Better_Devinci")){

            GM_setValue("Version_Better_Devinci",betterdevinciactualversion)

            const CheckGM= function(Item,Base_value){
                if(GM_getValue(Item,undefined)===undefined){
                    GM_setValue(Item,Base_value)
                }
            }

            CheckGM("isFrench",true)

            CheckGM("ADFS_autologin",true)

            CheckGM("Hide_news",true)
            CheckGM("Hide_Slider",false) // Button for hide news
            CheckGM("Footer&Scrollbar",true)
            CheckGM("SideBar_Diminish",false)
            CheckGM("Better_Marks",true)
            CheckGM("Hide_sunday_calendar",false)
            CheckGM("Hide_inscription",false)
            CheckGM("Remove_guide",false)
            CheckGM("Scam_Warning",false)
            CheckGM("Dark_Mode",false)
            //for LMP still not fully implemented
            CheckGM("Better_Courses",true)
            CheckGM("Better_Courses_type",true)
            CheckGM("Better_Courses_completion",true)
            CheckGM("Better_Courses_name",true)
            CheckGM("LMP_News",true)
            CheckGM("LMP_Page_Header",true)
            CheckGM("LMP_Annonces",true)

            CheckGM("No_AutoDL",true)
            CheckGM("View_Images",true)
            CheckGM("Open_PDF",true)
            CheckGM("Hide_Locked",true)
        }
        const BasicStyle=`
:root{
 --main-bg-color: #161617;
 --main-color : white;
}



.p-3{
  padding-top: 0px!important;
}

#page:not(.drawers.show-drawer-left) #topofscroll, #page:not(.drawers.show-drawer-right) #topofscroll{
    max-width: 100%!important;
}

#main {
    padding-bottom: 0px!important;
}

#Slider_Button:active {
  background-color: #a0c7e4;
  box-shadow: none;
  color: #2c5777;
}
#Slider_Button {
  background-color: #e1ecf4;
  border-radius: 3px;
  border: 1px solid #7aa7c7;
  box-shadow: rgba(255, 255, 255, .7) 0 1px 0 0 inset;
  box-sizing: border-box;
  color: #39739d;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.15385;
  margin: 0;
  outline: none;

  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  white-space: nowrap;
}

#Slider_Button:hover{
  background-color: #b3d3ea;
  color: #2c5777;
}

`;
        GM_addStyle(BasicStyle)
    }

    function Portal_Setup(){
        if(GM_getValue("Dark_Mode")){

            const DarkMode = `
.table tbody tr.warning>td {
    background-color: rgb(56, 48, 0);
}

.table tbody tr.success > td {
    background-color: rgb(41, 60, 23);
}

.table th, .table td {
    border-top: 0px!important;
}

.panel .panel-heading {
    border-bottom: 0px!important;
}

.dd-module > .dd-handle{
color:white!important;
}

.dd-unite-student {
    background-color: #54545566;
}
.dd-handle {
color:var(--main-color)!important;
background: var(--main-bg-color)!important;
}
.b-dayview-day-container .b-calendar-cell.b-nonworking-day {
    background-color: #54545566!important;
}

.dropdown-menu>li>a {
color:var(--main-color)!important
}
.nav-indicators .nav-messages .dropdown-menu li {
    border-top: 0px!important;
}
.nav-indicators .nav-messages .dropdown-menu .nav-messages-footer {
background-color: var(--main-bg-color)!important;
}
.nav-indicators .nav-messages .dropdown-menu .nav-messages-header>a, .nav-indicators .nav-messages .dropdown-menu .nav-messages-header>a:hover, .nav-indicators .nav-messages .dropdown-menu .nav-messages-header>a:focus {
    color: var(--main-color)!important;
}

.nav-indicators .nav-messages .dropdown-menu .nav-messages-header {background-color: var(--main-bg-color)!important;}
.panel {
  background-color: var(--main-bg-color)!important;
}
.site-menu-title{
  color:var(--main-color)!important;
}
.site-menu{
  background-color:var(--main-bg-color)!important;
}
.dropdown-menu{
  background-color:var(--main-bg-color)!important;
}
.breadcrumb{
  color:var(--main-color)!important;
  background-color:var(--main-bg-color)!important;
}
.breadcrumb.no_margin{
border:0px;
}
.site-menu-icon{
  color:var(--main-color)!important;
}
.navbar-fixed-top{
  margin:0px;
}
.b-toolbar {
  background-color:var(--main-bg-color)!important;
}
.b-daycellcollecter .b-dayview-content {
  background-color:var(--main-bg-color)!important;
}
.b-dayview-day-container .b-calendar-cell:not(.b-last-cell) {
  border-right: 0px!important;
}
.b-dayview-day-container {
  border-left: 0px!important;
  background-image:none!important;
}
.b-calendarrow .b-cal-cell-header {
  background-color: var(--main-bg-color)!important;
}

.social-box {
  background-color: var(--main-bg-color)!important;
}
body{
  background-color:var(--main-bg-color)!important;
  color:var(--main-color)!important;
}
.b-panel>.b-panel-body-wrap{
background-color:var(--main-bg-color)!important;
}

.b-dayview-day-content{
border-top: 0px!important;
}

.b-calendar > * > .b-top-toolbar {
    border-bottom: 0px!important;
}

.b-dayview-schedule-container {
    border-left: 0px!important;
   }

  .table-striped tbody > tr:nth-child(odd) > td, .table-striped tbody > tr:nth-child(odd) > th {
    background-color: #f9f9f91a;
}

.accordion-heading {
    background-color: #f9f9f91a;
}


.b-dayview-day-container .b-calendar-cell .b-cal-event-body {
    background-color: rgb(27 27 41 / 90%) !important
}

.b-dayview-day-container .b-calendar-cell .b-cal-event {
    color: #aaa6a6!important;
}

#main > div.row-fluid > div > ul > div > a
{
    background-color: #460404!important;
    border: 0px!important;
}

.table tbody tr.success > td {
    background-color: rgb(41, 60, 23)!important;
}

.table tbody tr.warning>td {
    background-color: #a3380063 !important;
}

.alert-success {
    background-color: rgb(41, 60, 23) !important;
    border-color : rgb(41, 60, 23) !important;
}

.alert-danger, .alert-error {
    background-color: #a3380063 !important;
    border-color: #a3380063 !important;
}
`;
            if(location.href === "https://my.devinci.fr/student/cours/"){
                DarkMode +=`
.tab-content div > ol > li > div {
    background: #4086cf !important;
    border: 0px!important;
}

.tab-content div > ol > li > ol > li > div {
background: #4086cf75!important;
border: 0px!important;
}

.tab-content div > ol > li > ol > li > div {
background: #34994cab!important;
border: 0px!important;
}

.tab-content div > ol > li > ol > li > ol > li > div {
background: rgb(61, 46, 0)!important;
border: 0px!important;
}
`}
            GM_addStyle(DarkMode);
        }
        //test
        const test = `
#b-calendar-1 {
 height : 50rem!important
}
`

        GM_addStyle(test);
        if(GM_getValue("SideBar_Diminish")){
            if(document.querySelector(".social-sidebar"+".sidebar-full")){
                document.querySelector(".wraper"+".page-content"+".sidebar-full").className="wraper page-content"
                document.querySelector("body").style.overflowX='auto'
                document.querySelector("body").querySelector(".wraper"+".page-content").className = 'wraper page-content'
                document.querySelector(".social-sidebar").className = 'social-sidebar'
            }
        }
        if(GM_getValue("Footer&Scrollbar")){
            document.querySelector('html').style.height="0px" //remove the scrollbar when not necessary
            if(document.querySelector('#footer')){
                document.querySelector('#footer').remove()
            }
        }
        const BetterDevinci_link = document.createElement("button");
        BetterDevinci_link.id = "BetterDevinci_link"
        BetterDevinci_link.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        BetterDevinci_link.textContent = "+";
        BetterDevinci_link.style.color = 'red'
        BetterDevinci_link.style.fontWeight='bold'
        BetterDevinci_link.style.fontSize='20px'
        BetterDevinci_link.addEventListener('click', BetterDevinci_Page)
        if(document.querySelector(".navbar-inner-title")){
            document.querySelector(".navbar-inner-title").append(BetterDevinci_link)
        }

        if(document.querySelector(".social-sidebar"+".sidebar-full")!=null && GM_getValue("SideBar_Diminish")){
            document.querySelector(".switch-sidebar-icon"+".icon-align-justify").click()
        }
        //'isFrench'

        let observer_Page = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE ) {
                            if(node.matches("img") && node.src.includes("/images/flags") && node.parentElement.matches(".dropdown-toggle")){
                                node.src.includes("/fr") ? GM_setValue('isFrench',true) : GM_setValue('isFrench',false)
                            }
                            if(node.matches('#footer') && GM_getValue("Footer&Scrollbar")){
                                node.remove()
                            }
                            else if(node.matches(".navbar-inner-title")){
                                node.append(BetterDevinci_link)
                            }
                            else if(node.innerText && node.innerText.includes("let posting = $.ajax({\n")){
                                node.innerHTML=node.innerHTML.replace('let posting = $.ajax({\n ',"var posting = $.ajax({\n ")
                            }
                            else if(GM_getValue("SideBar_Diminish")){
                                if(node.matches(".wraper"+".page-content"+".sidebar-full")){
                                    node.classname='wraper page-content'
                                    document.querySelector("body").querySelector(".wraper"+".page-content").className = 'wraper page-content'
                                }
                                else if(node.matches(".social-sidebar"+".sidebar-full")){
                                    node.className = 'social-sidebar'
                                    document.querySelector("body").querySelector(".wraper"+".page-content").className = 'wraper page-content'
                                }
                                else if(node.matches("body") && node.parentElement!=document.querySelector("html")){
                                    node.style.overflowX='auto'
                                    document.querySelector("body").querySelector(".wraper"+".page-content").className = 'wraper page-content'
                                }
                            }
                        }
                    }
                }
            }
        });
        observer_Page.observe(document, { childList: true, subtree: true });
    }

    function BetterDevinci_Page(){

        if(document.querySelector("#Rewrite_Container")){
            return;
        }

        let Rewrite_Container = document.createElement("div");
        Rewrite_Container.id = "Rewrite_Container";
        Rewrite_Container.style.margin='10px'
        Rewrite_Container.style.paddingLeft='10px'

        const TextPresentation=document.createElement("div");
        TextPresentation.textContent = "This page lists everything Better-Devinci does on the portal and you can activate or deactivate these options";
        TextPresentation.style.color= 'red'
        TextPresentation.style.marginBottom='20px'
        Rewrite_Container.append(TextPresentation)

        const data = [
            { name : "ADFS_autologin",description : {en:"Adds the ability to autologin (email and password can only be accessed by the extension and nothing else)",fr:"Ajoute la possibilité de s'autologin (Email et mdp sont accessible que par l'extension), visible en bas de la page de login"}},
            { name: 'Footer&Scrollbar', description: {en:'Removes the footer. The scrollbar when useful',fr:'Enlève le footer en bas de la page. Et la barre de scroll si possible'} },
            { name: 'Hide_news', description: {en:'Adds the ability to hide & unhide the news panel with a button' ,fr:'Permet de cliquer sur un bouton pour toggle le panneau des news'}},
            { name: 'Better_Marks', description: {en:'Adds the ability to diminish by semester and module the marks',fr:"Permet de cliquer sur les semestre et module dans l'onglet note"} },
            { name: 'SideBar_Diminish', description: {en:'Diminish the sidebar when useful to have more place on the page',fr:'Réduit la barre sur le côté toujours, utile pour avoir plus de place' }},
            { name : "Hide_sunday_calendar", description:{en:"Remove the sunday on the calendar",fr:'Enlève le Dimanche du calendrier'}},
            {name : 'Hide_inscription',description : {en:'Removes the reinscription done message from the main page',fr:"Enlève le message de réinscription"}},
            { name : "Remove_guide", description : {en:'Removes the Documents student guide',fr:'Enlève le document Guide étudiant de la page principale'}},
            { name : "Scam_Warning", description : {en:'Removes the be careful of scam message',fr:"Enlève le message d'alerte au scam"}},
            { name: "Dark_Mode",description: {en:'(FEATURE IS BACK!) Enables the dark mode for the portal (refresh to apply changes)',fr:'Mode sombre pour le portail (rafraichir pour appliquer)'}},
        ]

        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        const nameHeaderCell = document.createElement('th');
        nameHeaderCell.textContent = 'Name';
        nameHeaderCell.style.height='50px'
        nameHeaderCell.style.width='200px'
        //headerRow.appendChild(nameHeaderCell);
        const descriptionHeaderCell = document.createElement('th');
        descriptionHeaderCell.textContent = 'Description';
        headerRow.appendChild(descriptionHeaderCell);
        const checkboxHeaderCell = document.createElement('th');
        checkboxHeaderCell.textContent = 'Checkbox';
        headerRow.appendChild(checkboxHeaderCell);

        table.appendChild(headerRow);

        data.forEach(item => {
            const row = document.createElement('tr');

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = item.description[GM_getValue("isFrench") ? 'fr' : 'en'];
            descriptionCell.style.textAlign = 'center';
            row.appendChild(descriptionCell);

            const checkboxCell = document.createElement('td');
            checkboxCell.style.display = 'flex'
            checkboxCell.style.justifyContent = 'center';
            const checkbox = document.createElement('input');
            checkbox.className='better-devinci-checkbox'
            checkbox.type = 'checkbox';
            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);

            if(GM_getValue(item.name)) {
                checkbox.checked = true;
            }

            checkbox.addEventListener('change', function() {
                if (GM_getValue(item.name)) {
                    GM_setValue(item.name,false)
                }
                else{
                    GM_setValue(item.name,true)
                }
            });

            table.appendChild(row);
        });

        Rewrite_Container.append(table);
        if(document.querySelector("#main") && document.querySelector("#main").querySelectorAll(".container-fluid")){
            if(document.querySelector("#main").querySelectorAll(".container-fluid")[1]){
                document.querySelector("#main").querySelectorAll(".container-fluid")[1].remove()
            }
            else{
                document.querySelector("#main").querySelectorAll(".container-fluid")[0].remove()
            }
        }
        if(document.querySelector("#main")){
            document.querySelector("#main").append(Rewrite_Container)
        }


        let observer_Page = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE ) {
                            if(node.matches(".container-fluid") && node.parentElement.matches("#main")){
                                if(node.parentElement.childElementCount==2){
                                    document.querySelector("#main").append(Rewrite_Container)
                                }
                                node.remove()
                            }
                        }
                    }
                }
            }
        });
        observer_Page.observe(document, { childList: true, subtree: true });
    }

    function Marks(){
        var toggleClass = (el, name) => {
            if (el.classList.contains(name)) {
                el.classList.remove(name)
            } else el.className+= " "+name
        }

        [...document.querySelectorAll(".dd-handle")].filter((obj) => !obj.parentElement.classList.toString().includes("dd-module"))
            .forEach((item) => { //make selesters togglable
            if (item.parentElement.className == "dd-item" || true) {
                item.onclick = () => {
                    [...item.parentElement.children].forEach((child) => {
                        toggleClass(child, "hide")
                    })
                    item.classList.remove("hide")}
            }
        })
        let observer_Page = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {

                            if (node.classList.toString().includes("dd-handle") && !node.parentElement.classList.toString().includes("dd-module") && !node.parentElement.classList.toString().includes("entry_elements")) {
                                node.onclick = (e) => {
                                    let target = e.target;
                                    while (target.classList != "dd-handle") {
                                        target = target.parentElement
                                    }
                                    [...target.parentElement.children].forEach((child) => {
                                        if (child.classList.toString().includes("dd-list")) {
                                            if (!child.classList.toString().includes("hide")) {
                                                child.classList.add("hide")
                                            } else child.classList.remove("hide")
                                        }

                                    })
                                }
                            }
                        }
                    }
                }
            }
        });
        observer_Page.observe(document, { childList: true, subtree: true });
    }

    function Portail_MainPage(){
        //Need to check if it's the login page
        if(document.querySelector("#login") && document.querySelector("#login").value==''){
            if(GM_getValue("Autologin email")){
                document.querySelector("#login").value=GM_getValue("Autologin email")
                if(document.querySelector("#login").value.toLowerCase().includes("edu.devinci.fr")){
                    setTimeout( ()=> document.querySelector("#btn_next").click(),300)
                }
            }
            return;
        }



        if(document.querySelector(".alert"+".alert-success")){
            const Inscription = document.querySelector(".alert"+".alert-success")
            if(GM_getValue("Hide_inscription")){
                if(GM_getValue('Inscription_interval') == Inscription.innerText.match(/\d\d\d\d-\d\d\d\d/g)[0] && Inscription.innerText.includes("Vous êtes maintenant réinscrit(e) en ")){
                    Inscription.parentElement.parentElement.parentElement.parentElement.remove()
                }
            }
            if(Inscription.innerText.match(/\d\d\d\d-\d\d\d\d/g)){
                if(Inscription.innerText.includes("Vous êtes maintenant réinscrit(e) en ")){
                    if(GM_getValue('Inscription_interval')!=Inscription.innerText.match(/\d\d\d\d-\d\d\d\d/g)[0]){
                        GM_setValue('Inscription_interval',Inscription.innerText.match(/\d\d\d\d-\d\d\d\d/g)[0])
                        GM_setValue("Hide_inscription",false)
                    }
                }
            }
        }
        const Documents_guid_etudiant = document.querySelector(".social-box.social-blue")
        if(Documents_guid_etudiant){
            if(Documents_guid_etudiant.innerText.includes("Guide de l'étudiant")){
                Documents_guid_etudiant.remove()
            }
        }


        let SliderButton = document.createElement("button");
        SliderButton.id = "Slider_Button";
        SliderButton.textContent = "Hide News";

        SliderButton.addEventListener("click", function() {
            if(GM_getValue("Hide_Slider")==false){
                SliderButton.innerHTML="Show News"
                let Sibling = document.querySelector("#Slider_Button").parentElement.querySelector(".social-box")
                Sibling.className+=' hide'
                GM_setValue("Hide_Slider",true)
            }
            else{
                SliderButton.innerHTML="Hide News"
                let Sibling = document.querySelector("#Slider_Button").parentElement.querySelector(".social-box")
                Sibling.className=Sibling.className.replace(" hide","")
                GM_setValue("Hide_Slider",false)
            }
        })

        if(GM_getValue("Hide_news")){
            const Body = document.querySelector(".body")

            if(Body && Body.parentElement && Body.parentElement.parentElement){

                if(GM_getValue("Hide_Slider")){
                    SliderButton.innerHTML="Show News"
                    Body.parentElement.className+=' hide'
                }
                Body.parentElement.parentElement.prepend(SliderButton);
            }
        }
        if(GM_getValue("Scam_Warning") && document.querySelector(".alert.alert-warning")){
            const node = document.querySelector(".alert.alert-warning")
            if(node.innerText.includes(".devinci.fr") && node.innerText.includes(".leonard-de-vinci.net") && node.innerText.includes("✅")){
                node.remove()
            }
        }
        let observer_Page = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE ) {
                            if(node.matches("#login")){
                                if(GM_getValue("Autologin email")){
                                    document.querySelector("#login").value=GM_getValue("Autologin email")
                                    let interval_login=setInterval(function(){
                                        if(document.querySelector("#login").value.toLowerCase().includes("edu.devinci.fr") && document.querySelector("#btn_next")){
                                            setTimeout( ()=> document.querySelector("#btn_next").click(),300)
                                            clearInterval(interval_login)
                                        }
                                    }, 20)
                                    }
                            }




                            else if(node.matches(".alert"+".alert-success")){
                                if(GM_getValue("Hide_inscription")){
                                    if(GM_getValue('Inscription_interval') == node.innerText.match(/\d\d\d\d-\d\d\d\d/g)[0] && node.innerText.includes("Vous êtes maintenant réinscrit(e) en ")){
                                        node.parentElement.parentElement.parentElement.parentElement.remove()
                                    }
                                }
                                if(node.innerText.match(/\d\d\d\d-\d\d\d\d/g)){
                                    if(node.innerText.includes("Vous êtes maintenant réinscrit(e) en ")){
                                        if(GM_getValue('Inscription_interval')!=node.innerText.match(/\d\d\d\d-\d\d\d\d/g)[0]){
                                            GM_setValue('Inscription_interval',node.innerText.match(/\d\d\d\d-\d\d\d\d/g)[0])
                                            GM_setValue("Hide_inscription",false)
                                        }
                                    }
                                }
                            }
                            else if(GM_getValue("Hide_news") && node.matches('.social-box') && node.className==='social-box'){
                                if(GM_getValue("Hide_Slider")){
                                    SliderButton.innerHTML="Show News"
                                    node.className+=' hide'
                                }
                                if(GM_getValue("Hide_news")){
                                    node.parentElement.prepend(SliderButton);
                                }
                            }
                            else if(GM_getValue("Hide_sunday_calendar") && node.matches(".b-last-cell") ){
                                node.remove()
                            }
                            else if(GM_getValue("Hide_sunday_calendar") && node.matches(".b-day-name-day") && node.innerText=="dim."){
                                node.parentElement.remove()
                            }
                            else if(GM_getValue("Remove_guide") &&node.matches("a") && node.textContent.includes("Guide de l'étudiant")){
                                node.parentElement.parentElement.remove()
                            }
                            else if(GM_getValue("Scam_Warning") && node.matches(".alert.alert-warning")){
                                if(node.innerText.includes(".devinci.fr") && node.innerText.includes(".leonard-de-vinci.net") && node.innerText.includes("✅")){
                                    node.remove()
                                }
                            }


                        }
                    }
                }
            }
        });
        observer_Page.observe(document, { childList: true, subtree: true });
    }

    function Presence(){
        if(document.querySelector(".icon-question-sign") && document.querySelector(".icon-question-sign")){
            document.querySelector(".icon-question-sign").parentElement.remove()
        }
        let observer_Page = new MutationObserver(function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE ) {
                            if(node.matches('.alert'+'.alert-info') && node.innerText===' Pour accéder aux détails de la séance et à la validation de présence, cliquez sur le bouton "Relevé de présence".'){
                                node.remove()
                            }
                        }
                    }
                }
            }
        });
        observer_Page.observe(document, { childList: true, subtree: true });
    }

    function Evaluations(){
        let interval_login=setInterval(function(){
            if(document.querySelectorAll("[id*='Tout à fait']")){
                document.querySelectorAll("[id*='Tout à fait']").forEach(function(UwU){UwU.click()})
                clearInterval(interval_login)
            }
        }, 20)
        }


    function EDT_Page(){
        if(GM_getValue("Hide_sunday_calendar")){
            let observer_EDT = new MutationObserver(function (mutationsList, observer) {
                for (var mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for (var node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE ) {
                                if(GM_getValue("Hide_sunday_calendar")){
                                    if(node.matches(".b-last-cell") ){
                                        node.remove()
                                    }
                                    else if(node.matches(".b-day-name-day") && node.innerText=="dim."){
                                        node.parentElement.remove()
                                    }
                                }
                            }
                        }
                    }
                }
            });
            observer_EDT.observe(document, { childList: true, subtree: true });
        }
    }


    function ADFS(){
        let username = document.createElement("input")
        username.id = "Better-devinci-username"
        username.className = "text fullWidth"
        username.placeholder = "B-D Autologin email"
        username.spellcheck = false

        let password = document.createElement("input")
        password.id = "Better-devinci-password"
        password.className = "text fullWidth"
        password.placeholder = "B-D Autologin password"
        password.spellcheck = false
        password.type= "password"

        let Save_ID = document.createElement("button")
        Save_ID.id = "Better-devinci-Save_ID-button"
        Save_ID.innerText = "Autologin save"

        Save_ID.addEventListener("click", function() {
            GM_setValue("Autologin email",username.value)
            GM_setValue("Autologin password",password.value)
            if(GM_getValue("Autologin email") && GM_getValue("Autologin password")){
                document.querySelector("#userNameInput").value = GM_getValue("Autologin email")
                document.querySelector("#passwordInput").value = GM_getValue("Autologin password")
                if(document.querySelector("#submitButton") && GM_getValue("Autologin email") && GM_getValue("Autologin password") && document.querySelector("#userNameInput").value!='' && document.querySelector("#passwordInput").value!=''){
                    document.querySelector("#submitButton").click()
                }
            }
        })
        if(document.querySelector("#footerPlaceholder")){
            document.querySelector("#footerPlaceholder").append(username)
            document.querySelector("#footerPlaceholder").append(password)
            document.querySelector("#footerPlaceholder").append(Save_ID)
            document.querySelector("#copyright").remove()

            if(GM_getValue("Autologin email") && GM_getValue("Autologin password")){
                document.querySelector("#userNameInput").value = GM_getValue("Autologin email")
                document.querySelector("#passwordInput").value = GM_getValue("Autologin password")
            }
        }
        if(document.querySelector("#submitButton") && GM_getValue("Autologin email") && GM_getValue("Autologin password") && document.querySelector("#errorText").innerText==''  && document.querySelector("#userNameInput").value!='' && document.querySelector("#passwordInput").value!=''){
            document.querySelector("#submitButton").click()
        }
        let observer_ADFS = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' ) {
                    for (let node of mutation.addedNodes) {
                        if(node.nodeType === Node.ELEMENT_NODE){
                            if(node.matches('#copyright')){
                                node.remove()
                            }
                            if(node.matches("#footerPlaceholder")){
                                document.querySelector("#footerPlaceholder").append(username)
                                document.querySelector("#footerPlaceholder").append(password)
                                document.querySelector("#footerPlaceholder").append(Save_ID)
                                if(GM_getValue("Autologin email") && GM_getValue("Autologin password") && document.querySelector("#userNameInput") && document.querySelector("#passwordInput")){
                                    username.value = GM_getValue("Autologin email")
                                    password.value = GM_getValue("Autologin password")
                                }
                                if(GM_getValue("Autologin email") && GM_getValue("Autologin password")){
                                    let interval_login=setInterval(function(){
                                        if(document.querySelector("#submitButton") && document.querySelector("#errorText").innerText==''){
                                            document.querySelector("#userNameInput").value = GM_getValue("Autologin email")
                                            document.querySelector("#passwordInput").value = GM_getValue("Autologin password")
                                            if(document.querySelector("#submitButton") && GM_getValue("Autologin email") && GM_getValue("Autologin password") && document.querySelector("#userNameInput").value!='' && document.querySelector("#passwordInput").value!=''){
                                                setTimeout(() => {
                                                    document.querySelector("#submitButton").click();
                                                }, 500);
                                                clearInterval(interval_login)
                                            }
                                        }
                                    }, 20)
                                    }
                            }
                        }
                    }
                }
            }
        });
        observer_ADFS.observe(document, { childList: true, subtree: true });
    }

    function Learning_Main_Page(){
        const BasicStyle=`

/*remove padding on every side of courses container*/
.block-myoverviewdevinci .paged-content-page-container {
  padding: 0rem 0rem;/*1rem 2rem*/
}

/*more condensed courses*/
.block-myoverviewdevinci .card-deck.dashboard-card-deck {
  row-gap: 0.5rem;/*1.5rem*/
  column-gap: 10px;/*12px*/
}

/*cards/courses display*/
.card.dashboard-card[data-region=course-content] {
    padding: 6px!important;/*1rem .75rem;*/
    gap: 1rem;/*1.375rem*/
}

/*remove padding from top of page*/
.block.block_myoverviewdevinci.card {
    padding-block: 0rem;/* 1.5rem*/
}
#topofscroll {
    margin-top: 0rem !important;
}
  `;
        GM_addStyle(BasicStyle)

        let observer_LMP = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' ) {
                    for (let node of mutation.addedNodes) {
                        if(node.nodeType === Node.ELEMENT_NODE){
                            if(node.matches(".dropdown") && node.parentElement.matches(".justify-content-end"+".w-100")){//option d'affichage, carte etc
                                if(document.querySelector('[for="favourites_only"]')?.parentElement?.parentElement){
                                    node.parentElement.remove()
                                    const newSpan = document.createElement("span");
                                    newSpan.classList.add("align-content-center");
                                    newSpan.textContent = "Afficher par :";
                                    document.querySelector('[for="favourites_only"]')?.parentElement?.parentElement.append(newSpan)
                                    document.querySelector('[for="favourites_only"]')?.parentElement?.parentElement.append(node)
                                }
                            }
                            if(node.matches(".devinci-subsection-title")){// suprime le Vos cours
                                node.parentElement.remove()
                            }
                            if(node.matches(".devinci-plugin-title")){
                                node.remove()
                            }
                            if(node.matches(".devinci-subsection-title")){
                                if(node.innerText=='Résultats de la recherche'){
                                    node.parentElement.remove()
                                    node.remove()
                                }
                                else if(node.innerText=='Affiner la recherche'){
                                    node.parentElement.remove()
                                    node.remove()
                                }
                            }
                            if(node.matches('[data-region="paged-content-page"]') && GM_getValue("Better_Courses")){
                                if(GM_getValue("Better_Courses_name")){
                                    document.querySelectorAll(".multiline").forEach(function(UwU){
                                        if(UwU.innerText.match(/\s\([a-zA-Z0-9-]+\)/g)){
                                            UwU.innerText=UwU.innerText.replace(UwU.innerText.match(/\s\([a-zA-Z0-9-]+\)/g)[0],"").trim()
                                        }
                                    })
                                    const left_style = `.dashboard-card-deck .dashboard-card a {justify-content: left;}`
                                    GM_addStyle(left_style)
                                }
                            }
                            /* old system
                            if(node.matches('[data-region="paged-content-page"]') && document.querySelectorAll(".dashboard-card-footer").length!=0 && GM_getValue("Better_Courses")) {
                                if(GM_getValue("Better_Courses_completion")){
                                    document.querySelectorAll(".dashboard-card-footer").forEach(function(UwU){UwU.remove()})
                                }
                                if(GM_getValue("Better_Courses_type")){
                                    document.querySelectorAll(".muted").forEach(function(UwU){UwU.remove()})
                                }
                                document.querySelectorAll('[data-region="course-content"]').forEach(function(UwU){
                                    UwU.style.margin='0px'
                                    UwU.style.paddingBottom='0px'
                                })
                                if(GM_getValue("Better_Courses_name")){
                                    document.querySelectorAll(".multiline").forEach(function(UwU){
                                        if(UwU.innerText.match(/\s\([a-zA-Z0-9-]+\)/g)){
                                            UwU.innerText=UwU.innerText.replace(UwU.innerText.match(/\s\([a-zA-Z0-9-]+\)/g)[0],"")
                                        }
                                    })
                                }
                                if(document.getElementsByClassName(" block_courses_discover block  card mb-3") && document.getElementsByClassName(" block_courses_discover block  card mb-3")[0]){
                                    document.getElementsByClassName(" block_courses_discover block  card mb-3")[0].remove()
                                }
                            }
                            */
                            else if( (node.matches("#page-header") && GM_getValue("LMP_Page_Header")) || (node.matches("#inst174") && GM_getValue("LMP_News")) || (GM_getValue("Better_Courses") && (node.matches("#instance-2524-header")|| node.matches(".mt-0"))) ){
                                node.remove()
                            }
                            else if(node.matches("#inst3124") && GM_getValue("LMP_Annonces")){
                                node.remove()
                                //node.parentElement.appendChild(node)
                            }
                            else if(false){//
                                if(node.matches('[id^="courses-view"]')){
                                    node.attributes["data-paging"].value = 99
                                }
                                else if(node.matches('.additional-data.d-none')){
                                    node.setAttribute('data-pagingoptions', '[99,4,8,16]');
                                }
                            }
                        }
                    }
                }
            }
        });
        observer_LMP.observe(document, { childList: true, subtree: true });
    }


    function Courses(){
        if(document.querySelector('#resourceobject'+'[src*="pdf"]') && GM_getValue("Open_PDF")){
            let OpenPdf = document.createElement("a");
            OpenPdf.id = "OpenPdf"
            OpenPdf.href= document.querySelector('#resourceobject'+'[src*="pdf"]').src
            OpenPdf.target = "_blank"
            OpenPdf.textContent = "Open Pdf";
            OpenPdf.className="btn mb-3"//mb-3 for padding bottom
            OpenPdf.style.color='red'
            let interval_Pdf=setInterval(function(){
                if(document.querySelector('[role="main"]')){
                    document.querySelector('[role="main"]').insertBefore(OpenPdf, document.querySelector('[role="main"]').children[2]);
                    clearInterval(interval_Pdf)
                }
            }, 20)
            }
        let HideLockedButton = document.createElement("button");
        HideLockedButton.id = "HideLockedButton";
        HideLockedButton.textContent = "Hide Locked";

        let observer_Courses = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' ) {
                    for (let node of mutation.addedNodes) {
                        if(node.nodeType === Node.ELEMENT_NODE){

                            if(node.matches('#resourceobject'+'[src*="pdf"]') && GM_getValue("Open_PDF")){
                                let OpenPdf = document.createElement("a");
                                OpenPdf.id = "OpenPdf"
                                OpenPdf.href= document.querySelector('#resourceobject'+'[src*="pdf"]').src
                                OpenPdf.target = "_blank"
                                OpenPdf.textContent = "Open Pdf";
                                OpenPdf.className="btn mb-3"//mb-3 for padding bottom
                                OpenPdf.style.color='red'
                                let interval_Pdf=setInterval(function(){
                                    if(document.querySelector('[role="main"]')){
                                        document.querySelector('[role="main"]').insertBefore(OpenPdf, document.querySelector('[role="main"]').children[2]);
                                        clearInterval(interval_Pdf)
                                    }
                                }, 20)
                                }
                            else if(node.matches(".no-announces")){
                                if(node.innerText==="Vous n'avez pas d'annonce disponible"){
                                    node.parentElement.previousElementSibling.remove()
                                    node.remove()
                                }
                            }
                            else if(node.matches(".container"+ ".focus-completion") && GM_getValue("Better_Courses_completion")){
                                node.remove()
                            }
                            else if(node.innerHTML.includes("restrictions") && GM_getValue("Hide_Locked")){

                                document.querySelector("#theme_boost-drawers-courseindex").childNodes[1].append(HideLockedButton);

                                HideLockedButton.addEventListener("click", function() {
                                    let all_Locked = document.querySelector("#theme_boost-drawers-courseindex").querySelectorAll(".restrictions")
                                    all_Locked.forEach((Locked_Module)=>{
                                        Locked_Module.style.setProperty("display", "none", "important");
                                    })
                                    HideLockedButton.textContent = "Locked are hidden";
                                    HideLockedButton.disabled = true;
                                })
                            }
                            else if(node.href && node.href.includes('.pdf?forcedownload=1') && GM_getValue("No_AutoDL")){
                                node.href=node.href.replace('?forcedownload=1',"")
                                node.target='_blank'
                            }
                            else if(node.href && node.href.includes(".PNG?forcedownload=1") && GM_getValue("View_Images")){
                                let img = document.createElement("img")
                                img.classList+="resourceimage"
                                img.loading="lazy"
                                img.src = node.href
                                img.style.display = "none";


                                let Hide_IMG = document.createElement("button");
                                Hide_IMG.setAttribute("onclick",`
                var img = this.nextElementSibling;
                if (img.style.display != "none") {
                  img.style.display = "none";
                  this.textContent = "Show Img";
                } else {
                  img.style.display = "block";
                  this.textContent = "Hide Img";
                }
              `)
                                Hide_IMG.style.border = "none"
                                Hide_IMG.style.borderRadius = "5px"
                                if(img.style.display != "none"){
                                    Hide_IMG.textContent = "Hide Img";
                                }
                                else{
                                    Hide_IMG.textContent = "Show Img";
                                }
                                node.parentElement.appendChild(Hide_IMG)
                                node.parentElement.appendChild(img)
                            }
                            else if(node.matches("iframe") && node.src.includes(".pptx") && GM_getValue("No_AutoDL")){
                                let noforcedllink = document.createElement("a")
                                noforcedllink.href = node.src
                                noforcedllink.innerText=node.title +".pptx"
                                node.parentElement.append(noforcedllink)
                                node.remove()
                                GM_addStyle(".btn-fullscreen{scale:0!important}")
                            }
                            else if(node.matches("iframe") && node.src.includes(".csv") && GM_getValue("No_AutoDL")){
                                let noforcedllink = document.createElement("a")
                                noforcedllink.href = node.src
                                noforcedllink.innerText=node.title +".csv"
                                node.parentElement.append(noforcedllink)
                                node.remove()
                                GM_addStyle(".btn-fullscreen{scale:0!important}")
                            }
                            else if(node.matches("iframe") && node.src.includes(".zip") && GM_getValue("No_AutoDL")){
                                let noforcedllink = document.createElement("a")
                                noforcedllink.href = node.src
                                noforcedllink.innerText=node.title +".zip"
                                node.parentElement.append(noforcedllink)
                                node.remove()
                                GM_addStyle(".btn-fullscreen{scale:0!important}")
                            }
                            else if(node.matches("iframe") && node.src.includes(".docx") && GM_getValue("No_AutoDL")){
                                let noforcedllink = document.createElement("a")
                                noforcedllink.href = node.src
                                noforcedllink.innerText=node.title +".docx"
                                node.parentElement.append(noforcedllink)
                                node.remove()
                                GM_addStyle(".btn-fullscreen{scale:0!important}")
                            }
                            else if(node.matches("iframe") && node.src.includes(".xlsx") && GM_getValue("No_AutoDL")){
                                let noforcedllink = document.createElement("a")
                                noforcedllink.href = node.src
                                noforcedllink.innerText=node.title +".xlsx"
                                node.parentElement.append(noforcedllink)
                                node.remove()
                                GM_addStyle(".btn-fullscreen{scale:0!important}")
                            }
                            else if(node.matches("iframe") && node.src.includes(".data") && GM_getValue("No_AutoDL")){
                                let noforcedllink = document.createElement("a")
                                noforcedllink.href = node.src
                                noforcedllink.innerText=node.title +".data"
                                node.parentElement.append(noforcedllink)
                                node.remove()
                                GM_addStyle(".btn-fullscreen{scale:0!important}")
                            }
                            else if(node.matches("iframe") && node.src.includes(".py") && GM_getValue("No_AutoDL")){
                                let noforcedllink = document.createElement("a")
                                noforcedllink.href = node.src
                                noforcedllink.innerText=node.title +".py"
                                node.parentElement.append(noforcedllink)
                                node.remove()
                                GM_addStyle(".btn-fullscreen{scale:0!important}")
                            }
                            else if(node.href && node.href.includes("https://learning.devinci.fr/course/view.php?id=") && node.parentElement.matches(".breadcrumb-item") && node.title.match(/\s\([a-zA-Z0-9-]+\)/g)!=null){
                                node.innerText=node.title.replace(node.title.match(/\s\([a-zA-Z0-9-]+\)/g)[0],'')
                            }
                        }
                    }
                }
            }
        });
        observer_Courses.observe(document, { childList: true, subtree: true });
    }

    function Page_learning_devinci(){
        let observer_Learning = new MutationObserver(function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' ) {
                    for (let node of mutation.addedNodes) {
                        if(node.nodeType === Node.ELEMENT_NODE){
                            if(node.href && node.href=="https://learning.devinci.fr/my/" && node.role=="menuitem"){
                                node.parentElement.parentElement//cible
                                let handler = document.createElement("li")
                                handler.className="nav-item"
                                handler.role="none"
                                node.parentElement.parentElement.append(handler)

                                let link = document.createElement("a")
                                link.role='menuitem'
                                link.classList='nav-link'
                                link.href="https://learning.devinci.fr/mod/forum/view.php?id=2018"
                                link.innerText='Annonces Learning'
                                link.previewlistener="true"
                                handler.append(link)
                            }
                        }
                    }
                }
            }
        });
        observer_Learning.observe(document, { childList: true, subtree: true });
    }




    //end IIFE
})();


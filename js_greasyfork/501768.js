// ==UserScript==
// @name         Brewer's life hacks
// @namespace    http://tampermonkey.net/
// @version      2024-11-14
// @description  Lots of little quality-of-life improvements
// @author       Alex Brewer
// @match        https://classroom.google.com/*
// @match        https://millennium.education/*
// @icon         https://millennium.education/favicon.ico
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/501768/Brewer%27s%20life%20hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/501768/Brewer%27s%20life%20hacks.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // set values here to customise the script settings:
    const highlightClasses = false; // true or false
    const hideClassImages = true; // true or false
    const defaultStaffroom = 1; // 1 or 2

    //Change Google Classroom URLS here to highlight on GC dashboard.
    var hClassList = `
a[href="/c/NjM2NTI5NzUxNjY4"] div,
a[href="/c/"] div,
a[href="/c/"] div,
a[href="/c/"] div,
a[href="/c/"] div,
a[href="/c/"] div,
a[href="/c/"] div
{
  color:black !important ;
  font-weight: 800 !important;
  background-color: yellow !important;
}`

    var currentURL = window.location.href;
    console.log(`Running Brewer's life hacks on ${currentURL}`);

    const r_timetable = /timetable6\.asp/g;
    const r_rollmarking = /attendance3\.asp/g;
    const r_millennium = /millennium/g;
    const r_gClassroom = /classroom\.google\.com((\/h)|(\/))*(\s|$)/g;

    if(r_rollmarking.test(currentURL)){
        console.log(`Enhancing: Roll marking - Truancy email links`);
        truancyEmailLinks();
    }
    if(r_millennium.test(currentURL)){
        console.log(`Enhancing: Site Header`);
        const newSiteHeader = enhanceSiteHeader().cloneNode(true);

        if(r_timetable.test(currentURL)){
            console.log(`Enhancing: Master timetable view`);
            masterTimetable(newSiteHeader);
        }
    }

    if(r_gClassroom.test(currentURL)){
        console.log("Attempting to enhance Google Classroom");
        var interval = setInterval(checkClassroomLoaded, 50);
    }

    function checkClassroomLoaded(){
        var links = document.getElementsByTagName("a");
        if(links.length>100){
            clearInterval(interval);
            interval = null;
            googleClassroomDashboard();
        }
    }

    function enhanceSiteHeader(){
        const siteHeader = document.getElementById("siteheader").children[0];

        // Deletes the redundant links on Millennium homepage
        if(document.getElementById("icons")){document.getElementById("icons").remove();}

        var links = [
            ["📢 NOTICES","https://millennium.education/admin/resources/notices.asp"],
            ["📆 CALENDAR", "https://millennium.education/admin/resources/calendar.asp"],
            ["📋 CLASSES", "https://millennium.education/admin/users/classes.asp"],
            ["⏰ TIMETABLE","https://millennium.education/admin/schedule/timetable6.asp"],
            ["🔗 LINKS","https://docs.google.com/spreadsheets/d/1xl3UWlmqFvaruLfgnHNLLuG9v9HVZwR5DvEAI2amztE/pubhtml?gid=1538152957&single=true"],
            ["🏠 HOME","https://millennium.education/admin/home/"],
        ];

        var modifiedHeader = document.createElement("div");

        for (var link of links){
            var newLink = document.createElement("a");
            newLink.href = link[1];
            newLink.innerText = link[0];
            newLink.classList.add("header-links");

            modifiedHeader.insertAdjacentElement("afterBegin", newLink);
        }
        const headerLinkStyle = `
        .header-links{
        color: #D75;
        flex-grow: 1;
        text-align: center;
        }`;

        var headerCss = document.createElement("style");
        headerCss.innerHTML = headerLinkStyle;
        document.body.append(headerCss);

        //Use querySelector to delete Millenium banner as name changes on each page
        var banners = document.querySelectorAll( '[ class^="banner_" ]');
        for(var ban of banners){ban.remove();}

        document.getElementById("plane").remove();

        //confusingly, I've named the new header 'siteheader', so use getElementById to access the original 'siteheader'
        document.getElementById("siteheader").style.margin = "0px 45px";
        document.getElementById("siteheader").style.padding = "0px";
        document.getElementById("siteheader").style.fontWeight = "800";
        document.getElementById("siteheader").style.fontSize = "1.2rem";
        document.getElementById("siteheader").style.display = "flex";
        document.getElementById("siteheader").style.flexFlow = "column-reverse";
        document.getElementById("siteheader").style.alignItems = "center";

        //small tweaks to save space on existing elements
        document.getElementsByClassName("school")[0].style.margin = "2px 12px 0 12px";
        document.getElementsByClassName("school")[0].style.lineHeight = 1;
        document.getElementsByClassName("margin")[0].style.padding = "0px 10px";

        siteHeader.innerHTML = '';
        siteHeader.style.width = "100%";
        siteHeader.append(modifiedHeader);
        window.scroll(0,0);


        modifiedHeader.style.display='flex'
        modifiedHeader.style.justifyContent = 'space-around';
        modifiedHeader.style.width = "100%";
        modifiedHeader.style.fontSize = "1.2rem";
        return document.getElementById("siteheader");
        //return siteHeader.cloneNode(true);
    }

    function masterTimetable(newHeader) {
        'use strict';

        const dateForm = document.getElementsByTagName("form")[0];
        const dateChanger = document.createElement("form");

        for(const atr of ["name", "method", "action"]){
            dateChanger.setAttribute(atr,dateForm.getAttribute(atr));
        }
        const dateChangerParts = new Set(["INPUT"]);
        for(var i=0 ;i<dateForm.children.length; i++){
            //console.log(dateForm.children[i].tagName);
            if(dateChangerParts.has(dateForm.children[i].tagName)){dateChanger.append(dateForm.children[i].cloneNode(true));}
        }
        dateChanger.style.display="inline-block";
        document.body.style.display="flex";
        document.body.style.flexDirection="column";

        const headerText = document.getElementById("siteheader").innerText;
        const reNum = /(?<=Week\s)\d\d?/;
        const weekno = headerText.match(reNum)[0];

        const reName = /(Week\s)\d\d?/;
        const weekName = headerText.match(reName)[0];
        const date = new Date();
        const day = date.getDay();

        const extractData = (tableId, mapper) => {
            const myTab = document.getElementById(tableId);
            if (myTab) {
                const data = [...myTab.rows].map((r) => [...r.cells].map((c) => c.innerHTML));
                return data.map(mapper);
            }
        };

        const data = extractData('DataTables_Table_0', (x) => (x));
        var datePicker = document.getElementsByTagName("form")[0];
        if(!data){
            console.log("no data exists");
        }
        else{

            //document.getElementById("root").remove();
            document.getElementById("root").style.display="none";
            document.body.append(newHeader);

            const toggleChangesBtn = document.createElement("button");
            toggleChangesBtn.innerText = " X - Close Faculty View";
            toggleChangesBtn.style.position="fixed";
            toggleChangesBtn.style.top="4px";
            toggleChangesBtn.style.left="45px";
            toggleChangesBtn.addEventListener("click", toggleChanges);
            document.body.append(toggleChangesBtn);

            function toggleChanges(){
                document.getElementById("root").style.display="block";
                document.getElementById("gridTimetable").style.display = "none";
                toggleChangesBtn.style.display="none";
            }

            //document.body.append(dateChanger);
            newHeader.insertAdjacentElement("afterBegin", dateChanger);

            var side = defaultStaffroom-1;

            var groupOne = [
                "Teacher", //Need this to include the table header
                "Brewer",                
                "Irini",
                "Atul",
                "Adil",
                "Irene",
                "Shamaila",
                "Zacharia"
            ];
            var groupTwo = [
                "Teacher", //Need this to include the table header
                "Andrew",
                "Beena",
                "Yunqin",
                "Han",
                "Stanton",
                "Fernandes",
                "Pillai"
            ];

            function checkNames(names,input){
                for(var name of names){
                    if(input.includes(name)){
                        return true;
                    }
                }
                return false;
            }

            function switchSides(){
                document.getElementById("gridTimetable").remove();
                if(side == 0){
                    makeTimetable(data,groupTwo);
                }
                else{
                    makeTimetable(data, groupOne);
                }
                side = 1-side;
            }

            if(defaultStaffroom == 1){
                makeTimetable(data, groupOne);
            }
            else{
                makeTimetable(data, groupTwo);
            }

            function addSwitchButton(){
                var label = "1️⃣|2️⃣";

                var corner = document.getElementById("cell0-0");
                var cell = document.getElementById("cell0-5");
                cell.innerText="P2";

                var btnOne = document.createElement("button");
                btnOne.innerHTML=(`${label}`);
                btnOne.addEventListener("click", switchSides);
                corner.append(btnOne);
            }

            function makeTimetable(data, group){
                var gridContainer = document.createElement("div");
                gridContainer.id="gridTimetable";
                gridContainer.style.fontSize = "1.4rem";
                gridContainer.style.display = "grid";

                //Need to count teachers found:
                var nameCount = 0;
                for(let x = 0; x<data.length; x++){
                    if(checkNames(group, data[x][0])){
                        nameCount+=1;
                    }
                }


                gridContainer.style.gridTemplateColumns = `4rem repeat(${nameCount-1}, 1fr)`;

                document.body.parentElement.style.height="100%"
                document.body.style.height="100%";
                gridContainer.style.height = "100%";
                //document.getElementById("siteheader").append(gridContainer);
                document.body.append(gridContainer);


                // Original loop used to display table data
                for(let y=0; y<data[0].length-1;y++){
                    for(let x = 0; x<data.length; x++){

                        //console.log(`(${x}, ${y}) - ${data[y][x]}`);
                        //if(checkNames(groupOne,data[x][0]).includes("Teacher")||data[x][0].includes("Brewer")||data[x][0].includes("Pillai")||data[x][0].includes("Irini")||data[x][0].includes("Atul")||data[x][0].includes("Adil")||data[x][0].includes("Irene")||data[x][0].includes("Shamaila")){
                        // if(x==weekno){
                        if(checkNames(group, data[x][0])){
                            if(y===0 || y===3 || y===5|| y===8|| y===9|| y===13|| y===15|| y===18|| y===19|| y===21|| y===22){
                                if(data[x][7].length > 4){
                                    data[x][8] = data[x][7];
                                }
                                if(data[x][11].length > 4){
                                    data[x][9] = data[x][11];
                                }
                                if(data[x][17].length > 4){
                                    data[x][18] = data[x][17];
                                }
                                if(data[x][20].length > 4){
                                    data[x][19] = data[x][20];
                                }
                                // Sometimes senior classes sit in the duplicate P1 or P2 column.
                                //These two if statements fix this issue by copying the value into the usual P1 or P2 column.
                                if(y==3){
                                    if(data[x][4].length>4){
                                        data[x][3]=data[x][4];
                                    }
                                }
                                if(y==5){
                                    if(data[x][6].length>4){
                                        data[x][5]=data[x][6];
                                    }
                                }

                                var tempDiv = document.createElement("div");
                                tempDiv.id=`cell${x}-${y}`;
                                tempDiv.style.boxSizing = "border-box";
                                tempDiv.style.backgroundColor = "#858585";
                                tempDiv.style.border = "1px solid black";
                                tempDiv.style.margin = "0px";
                                tempDiv.style.padding = "0px";
                                //tempDiv.style.height = "8%";
                                tempDiv.innerHTML = `${data[x][y]}`;//`${x},${y} - ${data[x][y]}`;
                                tempDiv.style.display="flex";
                                tempDiv.style.flexDirection="column";
                                tempDiv.style.justifyContent="center";
                                tempDiv.style.alignItems="center";
                                tempDiv.style.textAlign="center";



                                if(y==0 || x==0){
                                    tempDiv.style.backgroundColor="#a4f1ff";
                                }
                                if(x+y==0){
                                    tempDiv.innerHTML = "";
                                    tempDiv.style.backgroundColor="#858585";
                                }
                                if(y==0||y==5||y==9||y==15||y==19){
                                    tempDiv.style.borderBottom = "5px solid black";
                                }
                                if(x==0){
                                    tempDiv.style.borderRight = "5px solid black";
                                }
                                if(y==0){
                                    tempDiv.style.fontWeight = "600";
                                }
                                if(y>0){
                                    if(x==0){
                                        if(data[0][y].includes("a")||data[0][y].includes("b")){
                                            tempDiv.style.backgroundColor="hsl(0deg 65% 70%)";
                                        }}}


                                if(data[x][y].length===0){
                                    tempDiv.style.backgroundColor="#eee";
                                }
                                if(data[x][y].includes("Duty")){
                                    tempDiv.style.backgroundColor="hsl(0deg 70% 60%)";
                                }
                                else if(data[x][y].length>4){
                                    if(y>0){
                                        var yr = data[x][y][0];
                                        if(yr==7){yr=0}
                                        else if(yr==8){yr=1}
                                        else if(yr==9){yr=2}
                                        else if(yr==1){yr=3}
                                        else if(yr=="P"){yr=4}
                                        else if(yr=="H"){yr=5}
                                        tempDiv.style.backgroundColor = `hsl(${yr*60}deg 65% 80%)`;
                                    }}

                                gridContainer.append(tempDiv);


                            }
                        }
                    }
                }
                addSwitchButton();

            }







        } //End the 'else' containing main code
    }// End of Master Timetable script

    function truancyEmailLinks() {
        'use strict';

        const tablerows=document.getElementById("container").children[1].children[0].children[6].children[3].children[0].children

        //Get the text of the class selection field
        const classSelected = document.getElementsByClassName("chosen-single")[1].innerText
        const rclassName = /(\d+\w+\..)|(\w+\.\w\d)/;
        const rclassPeriod = /\d(?=:)/;
        const rspace = /\s/g;
        const rlparen = /\(/g;
        const rrparen = /\)/g;
        const className = classSelected.match(rclassName)[0];
        const classPeriod = classSelected.match(rclassPeriod)[0];
        const rnames = /([A-z]+-([A-z])+)|([A-Z][a-z]+)/g;

        function getTime(){
            var date = new Date;
            var currentTime = date.getHours()*100 + date.getMinutes();
            var currentHH = Math.floor(currentTime/100)%12;
            var AmPm;
            Math.floor(currentTime/100)>12 ? AmPm = 'pm' : AmPm = 'am';
            var currentMM = currentTime%100;
            if(currentHH==0){currentHH=12;}
            if(currentMM.toString().length==1){currentMM = `0${currentMM}`}
            var currentHHMM = currentHH+':'+currentMM;
            return `${currentHH}:${currentMM}${AmPm}`;
        }

        const address = '~SCH8291School.Truancy@det.nsw.edu.au';

        for (const row of tablerows) {

            var name=row.children[0].innerText; //Gets string from name fields
            if(name.includes(",")) //Limit to strings that are actually names
            {
                var names = name.match(rnames);
                var surname = names[0];
                var firstname=names[1];

                if(name.includes("["))
                {
                    firstname = names[2];
                }

                const subject = `${firstname} ${surname} - ${className} (P${classPeriod})`.replaceAll(rspace,'%20').replaceAll(rlparen,`%28`).replaceAll(rrparen,`%29`);
                var body = `${firstname} has walked out of class at ${getTime()}`.replaceAll(rspace,'%20');

                var link = document.createElement("a");
                link.innerText = "[T]";
                link.style.margin = "0px 2px";
                link.href = `mailto:${address}?subject=${subject}&body=${body}`;
                link.title = "Truant - walked out";

                body = `${firstname} has been marked present at school today, but has not yet arrived to Maths.`.replaceAll(rspace,'%20');
                var linktwo = document.createElement("a");
                linktwo.innerText = "[A]";
                linktwo.style.margin = "0px 3px";
                linktwo.href = `mailto:${address}?subject=${subject}&body=${body}`;
                linktwo.title = "Absent, but marked present at school";

                //Add button to create Millennium incident next to each student
                var studentUid = row.children[0].children[0].getAttribute("uid");
                var incidentBtn = document.createElement("a");
                incidentBtn.classList.add("add");
                incidentBtn.title="Add incident";
                incidentBtn.innerText="add";
                incidentBtn.href=`https://millennium.education/admin/register/incident.asp?uid=${studentUid}`


                row.children[0].insertAdjacentElement("afterbegin", linktwo);
                row.children[0].insertAdjacentElement("afterbegin", link);
                row.children[0].insertAdjacentElement("afterbegin", incidentBtn);

            }
        }
    } //End of Truancy email links script

    function googleClassroomDashboard() {
        'use strict';
        var styles = `/* Hide content and additional links for each card
-> Leave only header for class name/teacher*/
.TQYOZc, .SZ0kZe{
  display:none !important;
}

/*Change size of cards*/
.gHz6xd{
  height: 4.5rem !important;
  width: 18% important;
}

/*Remove padding around titles*/
.R4EiSb{
  padding-left:4px important;
  padding-top: 2px important;
  padding: 0.5rem 1rem 0rem important;
  padding-right: 0px important;
}

/*Allow cards to go right ot edges of screen*/
.JwPp0e{
  padding-left: 0rem !important;
}

/*Reduce gaps between cards*/
.gHz6xd{
  margin: 4px !important;
}

/* Resize nav pane on left
.Tabkde, .ideBx{
  width: 4em important;
}

.ideBx{
    flex: 0 0 6rem important;
}
*/
/*Remove elipses (...) from long class names */
.YVvGBb{
  text-overflow: clip !important;
}
.VfPpkd-dgl2Hf-ppHlrf-sM5MNb{
position: absolute;
top: 0;
right:0;
}
/*
.VfPpkd-Bz112c-LgbsSe{
  width:45px important;
}*/
`;


        const hideGCbannerImageStyle = `
/*Remove header images */
.OjOEXb{
  background-image: none !important;
}`;

        if(highlightClasses){
            styles +=hClassList;
        }
        if(hideClassImages){
            styles += hideGCbannerImageStyle;
        }

        //Required on Google Classroom due to required 'trusted HTML' policy (to prevent XSS / script injection attacks)
        const escapeHTMLPolicy = trustedTypes.createPolicy("myEscapePolicy", {
            createHTML: (string) => string.replace(/</g, "&lt;"),
        });
        const escaped = escapeHTMLPolicy.createHTML(styles);

        //Add rule to page
        var css = document.createElement("style");
        css.innerHTML = escaped;
        document.body.append(css);


    }//End of Google Classroom Dashboard script
})();
// ==UserScript==
// @name         Brewer's Web Enhancements
// @namespace    http://tampermonkey.net/
// @version      2025-02-10
// @description  Adds functionality to Millennium, Google Classroom and Edval
// @author       Alex Brewer
// @match        https://classroom.google.com/*
// @match        https://millennium.education/*
// @match        https://rousehillhs.edval.education/*
// @icon         https://millennium.education/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518061/Brewer%27s%20Web%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/518061/Brewer%27s%20Web%20Enhancements.meta.js
// ==/UserScript==


// UPDATES:
// Fixed regex to match class name for truancy email links - no longer breaks for (eg.) PMAA.A

(function() {
    //TODOS -> Edval block rooming, Google classroom - highlighting, settings modal
    // make a GC load prefs and collect prefs function? that works with a GC specific settings modal
    const userPrefKey = "BWE20241125";
    const pastUserPrefKeys = ["BWE20241120", "RHHS20241121", "RHHS20241120"];

    const highlightClasses = true; // true or false
    const hideClassImages = true; // true or false

    const linksDashboardLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8KQ5jFbMrgjLZL1Nr1Vyi9kTJxIXzTDA-yf1KO_vC7QAmhS1LaGXINN6NU0Bd5pOVscSaL1RnPPe/pubhtml?gid=0&single=true"

    var userData = {
        names: [{name:''}],
        namesTwo: [{name:''}],
        millenniumToggles:
        {
            header: true,
            truancy: true,
            timetable: true,
            photoRoll: true
        },
        customLink:{
            name: "🔗 LINKS",
            url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE8KQ5jFbMrgjLZL1Nr1Vyi9kTJxIXzTDA-yf1KO_vC7QAmhS1LaGXINN6NU0Bd5pOVscSaL1RnPPe/pubhtml?gid=0&single=true"
        },
        gClassroomToggles:
        {
            condenseCards: true,
            hideClasses: false,
            highlightClasses: false,
            hideImages: true
        },
        gClassroomCodes: []
    };

    var currentURL = window.location.href;
    console.log(`Running script - Brewer's Web Enhancements`);

    var existingUserPrefs = GM_getValue(userPrefKey, null);
    if(existingUserPrefs){
        var existingUserPrefObj = JSON.parse(existingUserPrefs);
        userData = existingUserPrefObj;
        console.log("Loaded preferences: ", userData);
    }
    else{
        console.log("Checking for older versions of user preference data");
        var prefsFound = false;
        for(var ver of pastUserPrefKeys){
            var verPrefs = GM_getValue(ver, null);
            if(verPrefs){
                userData = JSON.parse(verPrefs);
                console.log(`Loaded preference from version ${ver}`);
                console.log(userData);
                savePrefs(userData);
                prefsFound = true;
                break;
            }
        }
        if(!prefsFound){
            console.log("No preferences found - using defaults");
        }
    }

    const r_timetable = /timetable6\.asp/g;
    const r_rollmarking = /attendance3\.asp/g;
    const r_millennium = /millennium.education\/./g;
    const r_edval = /edval/g;
    const r_gClassroom = /classroom\.google\.com((\/h)|(\/))*(\s|$)/g;

    const popupHTMLcode = `
    <div class="popupcontainer">
    <form id="millenniumSettingsForm" onsubmit="return false;">
    <h2>Millennium Enhancements - Script Settings</h2>
    <div class="popuprow"><div>Change site header</div><div>
    <input type="radio" id="siteHeaderOn" name="siteHeader" value="true" checked />
    <label for="siteHeaderOn">Enable</label>
    <input type="radio" id="siteHeaderOff" name="siteHeader" value="false"/>
    <label for="siteHeaderOff">Disable</label>
    </div></div>
    <div class="popuprow"><div>Customise link in header</div>
    </div>
    <div class="popuprow"><div style="width:40%;"></div><label for="customLinkName">Link Title: </label><input type="text" id="customLinkName", id="customLinkName">
    </div>
    <div class="popuprow"><div style="width:40%;"></div><label for="customLinkURL">Link URL: </label><input type="text" id="customLinkURL", id="customLinkURL">
    </div>
    <div class="popuprow"><div>Add one-click truancy email links to rolls</div><div>
    <input type="radio" id="truancyLinksOn" name="truancyLinks" value="true" checked />
    <label for="truancyLinksOn">Enable</label>
    <input type="radio" id="truancyLinksOff" name="truancyLinks" value="false"/>
    <label for="truancyLinksOff">Disable</label>
    </div></div>
    <div class="popuprow"><div>Enable photo roll-marking checkbox</div><div>
    <input type="radio" id="photoRollsOn" name="photoRolls" value="true" checked />
    <label for="photoRollsOn">Enable</label>
    <input type="radio" id="photoRollsOff" name="photoRolls" value="false"/>
    <label for="photoRollsOff">Disable</label>
    </div></div>
    <div class="popuprow"><i> * Click "use photo roll" on roll-marking screen</i></div>
    <div class="popuprow"><div>Enable master timetable custom view</div><div>
    <input type="radio" id="masterTimetableOn" name="masterTimetable" value="true" checked />
    <label for="masterTimetableOn">Enable</label>
    <input type="radio" id="masterTimetableOff" name="masterTimetable" value="false"/>
    <label for="masterTimetableOff">Disable</label>
    </div></div>

    <div class="popuprow"></div>
    <h3>Master timetable - View settings</h3>

    <div class="popuprow"><p>Enter the names of staff to display on the master timetable view.<br>Separate each name with a comma ( , ).
    <br>
    <br> *You can use a partial name match
    <br> *Names are case sensitive
    <br> *If either group is left blank, *all* staff will be displayed for that group.</p></div>
    <div class="popuprow"></div>

    <div class="popuprow">
        <div>Timetable group 1:</div>
        <textarea id="namesInput" name="names" rows="5" cols="30" value=""></textarea>
    </div>
    <div class="popuprow">
        <div>Timetable group 2:</div>
        <textarea id="namesInputTwo" name="namesTwo" rows="5" cols="30" value=""></textarea>
    </div>
    <h2>Google Classroom - Script settings</h2>
    <div class="popuprow"><div>Compact dashboard view</div><div>
    <input type="radio" id="condenseCardsOn" name="condenseCards" value="true" checked />
    <label for="condenseCardsOn">Enable</label>
    <input type="radio" id="condenseCardsOff" name="condenseCards" value="false"/>
    <label for="condenseCardsOff">Disable</label>
    </div></div>
    <div class="popuprow"><div>Hide class images on dashboard</div><div>
    <input type="radio" id="hideImagesOn" name="hideImages" value="true" checked />
    <label for="hideImagesOn">Enable</label>
    <input type="radio" id="hideImagesOff" name="hideImages" value="false"/>
    <label for="hideImagesOff">Disable</label>
    </div></div>
    <div class="popuprow">
        <div>
            My Classes (url codes, comma separated) <br>
            <i>*Use the highlighted part of each class url:<br>
            eg. classroom.google.com/c/<mark>Nz2ZstCzNzk3</mark></i><br>
        </div>
        <div style="width:16px;"></div>
        <textarea id="classCodesInput" name="classCodesInput" rows="5" cols="30" value=""></textarea>
    </div>
    <div class="popuprow"><div>Hide other classes in sidebar</div><div>
    <input type="radio" id="hideClassesOn" name="hideClasses" value="true" checked />
    <label for="hideClassesOn">Enable</label>
    <input type="radio" id="hideClassesOff" name="hideClasses" value="false"/>
    <label for="hideClassesOff">Disable</label>
    </div></div>
    <div class="popuprow"><div>Highlight my classes on dashboard</div><div>
    <input type="radio" id="highlightClassesOn" name="highlightClasses" value="true" checked />
    <label for="highlightClassesOn">Enable</label>
    <input type="radio" id="highlightClassesOff" name="highlightClasses" value="false"/>
    <label for="highlightClassesOff">Disable</label>
    </div></div>
    <div class="popuprow"><div></div><div id="savedIndicator">Saved! -> Reload page to see changes</div></div>
    <div class="popuprow"><button id="closeSettings">CLOSE</button><input type="submit" value="submit" id="saveSettings"></input></div>
    </form>
    </div>
    `;
    const buttonHTMLcode = '<strong>Settings</strong>'

    function truancyEmailLinks() {

        const tablerows=document.getElementById("container").children[1].children[0].children[6].children[3].children[0].children

        //Get the text of the class selection field
        const classSelected = document.getElementsByClassName("chosen-single")[1].innerText
        const rclassName = /(\d+\w+\..)|(\w+\.\w\d)|(\w+\.\w)/;
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

    function savePrefs(prefs){
        var prefString = JSON.stringify(prefs);
        GM_setValue(userPrefKey, prefString);
    }

    function addMillenniumSettings(){

        var butt = document.createElement('button');
        var popup = document.createElement('dialog');
        popup.classList.add('popup');
        butt.classList.add('butt');

        butt.innerHTML=buttonHTMLcode;
        popup.innerHTML = popupHTMLcode;

        document.body.appendChild(butt);
        document.body.appendChild(popup);

        var currentUserPrefs = GM_getValue(userPrefKey, null);

        function collectPrefs(){
            var namesInputString = document.getElementById("namesInput").value;
            var namesInputArray = namesInputString.split(',');
            var trimmedArray = namesInputArray.map((x)=>{return x.trim();});
            var namesObj = []
            for(var item of trimmedArray){
                namesObj.push({"name":item});
            }
            userData.names = namesObj;

            var namesListTwo = document.getElementById("namesInputTwo").value.split(',');
            var trimmedListTwo = namesListTwo.map((x)=>{return x.trim();});
            var namesObjTwo = []
            for(var itemTwo of trimmedListTwo){
                namesObjTwo.push({"name":itemTwo});
            }
            userData.namesTwo = namesObjTwo;

            var gClassList = document.getElementById("classCodesInput").value.split(',');
            var trimmedgClassList = gClassList.map((x)=>{return x.trim();});
            var gClassListObj = []
            for(var gClassListItem of trimmedgClassList){
                gClassListObj.push(gClassListItem);
            }
            userData.gClassroomCodes = gClassListObj;

            userData.customLink.name = document.getElementById("customLinkName").value;
            userData.customLink.url = document.getElementById("customLinkURL").value;


            userData.millenniumToggles.header = document.getElementById("siteHeaderOn").checked;
            userData.millenniumToggles.truancy = document.getElementById("truancyLinksOn").checked;
            userData.millenniumToggles.photoRoll = document.getElementById("photoRollsOn").checked;
            userData.millenniumToggles.timetable = document.getElementById("masterTimetableOn").checked;

            userData.gClassroomToggles.condenseCards = document.getElementById("condenseCardsOn").checked;
            userData.gClassroomToggles.hideImages = document.getElementById("hideImagesOn").checked;
            userData.gClassroomToggles.hideClasses = document.getElementById("hideClassesOn").checked;
            userData.gClassroomToggles.highlightClasses = document.getElementById("highlightClassesOn").checked;

            savePrefs(userData);
            document.getElementById("savedIndicator").style.display="block";
        }

        function loadPrefs(){
            document.getElementById("savedIndicator").style.display="none";
            if(!currentUserPrefs){
                    var userName = document.getElementsByClassName('school')[0].innerText.split(":")[1].split(" ");
                    var userSurname = userName[userName.length-1];
                    userData.names.push({name:userSurname});

                    savePrefs(userData);
                    currentUserPrefs = userData;
                    loadPrefs();
                    collectPrefs();
                    window.location.reload();
            }
            else{
                currentUserPrefs = GM_getValue(userPrefKey, null);

                var userPrefObj = JSON.parse(currentUserPrefs);
                userData = userPrefObj;
            }

            if(userData.names){
                var nameString = '';
                for(var item of userData.names){
                    if(nameString.length==0){
                        nameString = nameString.concat('', item.name);
                    }
                    else{
                        nameString = nameString.concat(', ', item.name);
                    }
                }
                document.getElementById("namesInput").value=nameString;
            }
            if(userData.namesTwo){
                var nameStringTwo = '';
                for(var itemTwo of userData.namesTwo){
                    if(nameStringTwo.length==0){
                        nameStringTwo = nameStringTwo.concat('', itemTwo.name);
                    }
                    else{
                        nameStringTwo = nameStringTwo.concat(', ', itemTwo.name);
                    }
                }
                document.getElementById("namesInputTwo").value=nameStringTwo;
            }
            if(userData.gClassroomCodes){
                var classCodesString = '';
                for(var classCode of userData.gClassroomCodes){
                    if(classCodesString.length==0){
                        classCodesString = classCodesString.concat('', classCode);
                    }
                    else{
                        classCodesString = classCodesString.concat(', ', classCode);
                    }
                }
                document.getElementById("classCodesInput").value=classCodesString;
            }

            document.getElementById("customLinkName").value = userData.customLink.name;
            document.getElementById("customLinkURL").value = userData.customLink.url ;



            if(userData.millenniumToggles.header){
                document.getElementById("siteHeaderOn").checked = true;
            }
            else{
                document.getElementById("siteHeaderOff").checked = true;
            }
            if(userData.millenniumToggles.truancy){
                document.getElementById("truancyLinksOn").checked = true;
            }
            else{
                document.getElementById("truancyLinksOff").checked = true;
            }
            if(userData.millenniumToggles.photoRoll){
                document.getElementById("photoRollsOn").checked = true;
            }
            else{
                document.getElementById("photoRollsOff").checked = true;
            }
            if(userData.millenniumToggles.timetable){
                document.getElementById("masterTimetableOn").checked = true;
            }
            else{
                document.getElementById("masterTimetableOff").checked = true;
            }

            if(userData.gClassroomToggles.condenseCards){
                document.getElementById("condenseCardsOn").checked = true;
            }
            else{
                document.getElementById("condenseCardsOff").checked = true;
            }
            if(userData.gClassroomToggles.hideClasses){
                document.getElementById("hideClassesOn").checked = true;
            }
            else{
                document.getElementById("hideClassesOff").checked = true;
            }
            if(userData.gClassroomToggles.highlightClasses){
                document.getElementById("highlightClassesOn").checked = true;
            }
            else{
                document.getElementById("highlightClassesOff").checked = true;
            }

        }

        document.getElementById("closeSettings").addEventListener("click", ()=>{popup.close();});
        document.getElementById("millenniumSettingsForm").addEventListener("submit", ()=>{collectPrefs();});
        butt.addEventListener("click", ()=>{loadPrefs();popup.showModal();});
        loadPrefs();

    }

    function enhanceSiteHeader(){
        const siteHeader = document.getElementById("siteheader").children[0];

        // Deletes the redundant links on Millennium homepage
        if(userData.millenniumToggles.header){
            if(document.getElementById("icons")){document.getElementById("icons").remove();}
        }

        var links = [
            ["📢 NOTICES","https://millennium.education/admin/resources/notices.asp"],
            ["📆 CALENDAR", "https://millennium.education/admin/resources/calendar.asp"],
            ["📋 CLASSES", "https://millennium.education/admin/users/classes.asp"],
            ["✍️ ROLLS", "https://millennium.education/admin/schedule/attendance6.asp"],
            ["⏰ TIMETABLE","https://millennium.education/admin/schedule/timetable6.asp"],
            [userData.customLink.name, userData.customLink.url],
            // ["🔗 LINKS",linksDashboardLink],
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

        if(userData.millenniumToggles.header){
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
        }

        modifiedHeader.style.display='flex'
        modifiedHeader.style.justifyContent = 'space-around';
        modifiedHeader.style.width = "100%";
        modifiedHeader.style.fontSize = "1.2rem";
        return document.getElementById("siteheader");
    }

    function masterTimetable(newHeader) {

        const dateForm = document.getElementsByTagName("form")[0];
        const dateChanger = document.createElement("form");

        for(const atr of ["name", "method", "action"]){
            dateChanger.setAttribute(atr,dateForm.getAttribute(atr));
        }
        const dateChangerParts = new Set(["INPUT"]);
        for(var i=0 ;i<dateForm.children.length; i++){
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
            console.log("Error getting timetable - no data exists");
        }
        else{
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

            newHeader.insertAdjacentElement("afterBegin", dateChanger);

            var side = 0;

            var groupOne = ["Teacher"];
            for(var item of userData.names){
                groupOne.push(item.name);
            }

            var groupTwo = ["Teacher"];
            for(var itemTwo of userData.namesTwo){
                groupTwo.push(itemTwo.name);
            }

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

            if(side == 0){
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
                document.body.append(gridContainer);

                // Original loop used to display table data
                for(let y=0; y<data[0].length-1;y++){
                    for(let x = 0; x<data.length; x++){

                        // These numebrs seem arbitrary - they are the columns corresponding to the relevant periods on Millennium
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

                                // Add conditional formatting for periods based on contents
                                if(data[x][y].length===0){
                                    tempDiv.style.backgroundColor="#eee";
                                }
                                if(data[x][y].includes("Duty")){
                                    tempDiv.style.backgroundColor="hsl(0deg 70% 60%)";
                                }
                                else if(data[x][y].length>4){
                                    if(y>0){
                                        var yr = data[x][y][0]; // Colour by grade using first character
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

        }
    }// End of Master Timetable script

    function usePhotoRoll(){
        var theCheckbox=document.querySelector('input[name="hideCodes"]');
        document.querySelector('input[name="hideCodes"]').parentElement.id = "photoRollCheckbox";
        document.querySelector('input[name="hideCodes"]').parentElement.innerText=" Use photo roll";
        document.getElementById("photoRollCheckbox").insertAdjacentElement("afterbegin",theCheckbox);

        if(document.querySelector('input[name="hideCodes"]').checked){
            function areaOne(el){
                el.style.gridColumnStart="1";
                el.style.gridColumnEnd="4";
            }
            function areaTwo(el){
                el.style.gridColumnStart="4";
                el.style.gridColumnEnd="5";
            }
            function areaThree(el){
                el.style.gridColumnStart="1";
                el.style.gridColumnEnd="3";
            }
            function areaFour(el){
                el.style.gridColumnStart="3";
                el.style.gridColumnEnd="5";
            }
            function stretch(el){
                el.style.gridColumnStart="1";
                el.style.gridColumnEnd="5";
            }

            var theTable=document.getElementsByClassName("table1sm")[0].children[0];


            for(var notes of document.querySelectorAll('div.editnotes')){
                notes.style.width="200px";
                notes.style.display="inline-block";
                notes.style.background="#fff";
            }
            for(var studentName of document.querySelectorAll("a.student")){
                studentName.parentElement.style.fontSize="1.2rem";
                studentName.insertAdjacentElement("beforebegin",document.createElement("br"));
            }
            for(var pic of document.querySelectorAll('img.studentPhoto')){
                pic.style.height="150px";
            }
            for(var i=1;i<theTable.children.length-1;i++){
                theTable.children[i].style.border="2px solid grey";
                theTable.children[i].style.borderRadius="8px";
                let ouLabel = document.createElement("span");
                ouLabel.innerText = "Out of Uniform";
                let tbLabel = document.createElement("span");
                tbLabel.innerText = "Toilet Break";
                let noteLabel = document.createElement("span");
                noteLabel.innerText = "Notes ";
                theTable.children[i].children[7].insertAdjacentElement("afterbegin", ouLabel);
                theTable.children[i].children[11].insertAdjacentElement("afterbegin", tbLabel);

                theTable.children[i].children[13].insertAdjacentElement("afterbegin", noteLabel);
                stretch(theTable.children[i].children[0]);
                theTable.children[i].children[0].style.textWrap="wrap";
                theTable.children[i].children[0].style.textAlign="center";
                stretch(theTable.children[i].children[1]);
                stretch(theTable.children[i].children[4]);
                areaThree(theTable.children[i].children[5]);
                areaFour(theTable.children[i].children[6]);
                areaThree(theTable.children[i].children[7]);
                areaFour(theTable.children[i].children[11]);
                stretch(theTable.children[i].children[13]);
                stretch(theTable.children[i].children[14]);
                areaOne(theTable.children[i].children[15]);
                areaTwo(theTable.children[i].children[16]);
            }
            for(var i=0;i<theTable.children.length-1;i++){
                var offset = 0;
                for(var j=0;j<theTable.children[i].children.length+offset;j++){
                    if([2,3,8,9,10,12].includes(j)){
                        theTable.children[i].children[j-offset].remove();
                        offset+=1;
                    }
                }
                theTable.children[i].style.display='grid';
                theTable.children[i].style.justifyItems='center';
                theTable.children[i].style.justifyContent='center';
                theTable.children[i].style.gridTemplateColumns='1fr 1fr 1fr 32px';

            }
            theTable.children[0].remove();
            theTable.children[theTable.children.length-1].style.gridColumnStart="1";
            theTable.children[theTable.children.length-1].style.gridColumnEnd="3";
            theTable.style.display='grid';
            theTable.style.justifyContent = 'center';
            theTable.style.gap="4px";
            theTable.style.gridTemplateColumns='repeat(auto-fill, 270px)';
            theTable.style.width="calc(100% + 40px)";
            theTable.style.transform = "translateX(-12px)";
        }

    } // End of photo roll function

    var styles = ``;
    var compactDashboardStyles = `/* Hide content and additional links for each card
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
.topRightButton{
position: absolute !important;
top: 0 !important;
right:6px !important;
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


    function hideOtherClasses(){
        var currentURL = window.location.href;
        // Needs to not run on Class page - 'Grades' link disappears otherwise??
        if(!currentURL.includes('/c/')){
            var ClassList = [];
            for(var classCodeStub of userData.gClassroomCodes){
                ClassList.push(`/c/${classCodeStub}`);
            }
            //["/c/NjM2NTI5NzUxNjY4", "/c/NjM2NTAzNDY3MDc0", "/c/NTMwNDA4Nzc2NzU5", "/c/NTMwNDA4ODg5OTE3", "/c/NTMwNDYxNjg0NDA3", "/c/Njc3MzI1NDA0MDkw", "/c/Njc4MTc0NTcxNTA3"];
            var hrefList = []
            const hrefPrefix = "https://classroom.google.com";
            for(var classURL of ClassList){
                hrefList.push(hrefPrefix+classURL);
            }

            var els = document.querySelectorAll("a[href^='/c/']");

            for (var el of els) {
                if(!hrefList.includes(el.href)){el.style.display="none";}
            }

        }
    }
    function highlightDashboardClasses(){
        //Change Google Classroom URLS here to highlight on GC dashboard.
        var gcClassesList = userData.gClassroomCodes;
        var gcClasses = "";

        var commasAdded = 0;
        for(var classUrl of gcClassesList){
            if(commasAdded>0){
                gcClasses +=", ";
            }
            gcClasses+=`a[href="/c/${classUrl}"] > div:first-child`;
            commasAdded+=1;
        }

        var hClassList = `
${gcClasses}
{
  color:black !important ;
  font-weight: 800 !important;
  background-color: rgba(256 256 0 / 0.75);
  border-radius:16px;
  padding:0px 16px;
}
nav a > div{
background: none !important;
}
`
        return hClassList;
    }


    var stylesRules = `
.butt{
    position: absolute;
    top: 5px;
    right: 40px;
    z-index: 2;
    background-color: lime;
}

@media print{
    .butt{
        display: none !important;
    }
}
.popup, .popup p, .popup input{
    font-size:1.1rem;
}
.popup{
    border-radius: 32px;
    border: 6px solid grey;
    background: antiquewhite;
    max-height:90%;
}
.popup h2, .popup h3{
    color: green;
}
.popupcontainer{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.popupcontainer > form{
width: 100%;
}
.popuprow{
    width: 100%;
    display: flex;
    flex-direction: row;
    min-height: 1.5rem;
    justify-content: space-between;
    align-items: center;
}
::backdrop {
  background-image: linear-gradient(
    45deg,
    dodgerblue,
    green
  );
  opacity: 0.75;
}
#saveSettings{
    background-color:#0E4;
}
#savedIndicator{
    color:green;
    display:none;
}
#cell0-0, #cell0-3, #cell0-5, #cell0-8, #cell0-9, #cell0-13, #cell0-15, #cell0-18, #cell0-19, #cell0-21, #cell0-22 {
  position:sticky;
  left:0;
}
#gridTimetable{
    overflow-x: scroll;
}`;

    function addEdvalLinks(){
        const theDate = checkDate();
        const linkPrefix = "https://rousehillhs.edval.education/timetable#search/" + theDate + "/resourceTimetable/day/";

        const mainBlock = document.getElementsByClassName("top-bar-section")[0];
        const leftBlock = document.getElementsByClassName("left")[0];

        addButton("Me", "https://rousehillhs.edval.education/timetable");

        const links = [
            {
                name: "D-Block",
                groups:
                [
                    {
                        name: "⬆️ Upstairs",
                        rooms:["D101", "D104", "D109", "D110", "D112", "D113"]
                    },
                    {
                        name: "⬇️ Downstairs",
                        rooms: ["D1", "D4", "D9", "D10", "D12", "D13"]
                    },
                ]
            },
            {
                name: "E-Block",
                groups:
                [
                    {
                        name: "⬆️ Upstairs",
                        rooms:["E101", "E104", "E109", "E110", "E112"]
                    },
                    {
                        name: "⬇️ Downstairs",
                        rooms: ["E1", "E4", "E9", "E10", "E12"]
                    },
                ]
            },
            {
                name: "BMQ",
                groups:
                [
                    {
                        name: "B",
                        rooms:["B1", "B2", "B3", "B4", "B5", "B6"]
                    },
                    {
                        name: "M",
                        rooms: ["M1", "M2", "M3", "M4", "M5"]
                    },
                    {
                        name: "Q",
                        rooms: ["Q1", "Q2"]
                    },
                ]
            }
        ];

        for(var link of links){
            var targetLink = linkPrefix;
            if(link.groups){
                var linkHeading = addDropdown(link.name);
                for(var group of link.groups){
                    targetLink=linkPrefix;
                    if(group.staff){
                        targetLink += staffList(group.staff);
                    }
                    if(group.rooms){
                        targetLink += roomList(group.rooms);
                    }
                    addDropdownItem(linkHeading, group.name, targetLink);
                }
            }
            else{
                if(link.staff){
                    targetLink += staffList(link.staff);
                }
                if(link.rooms){
                    targetLink += roomList(link.rooms);
                }
                addButton(link.name, targetLink);
            }
        }

        function roomList(rooms){
            return "R!"+ rooms.join(",R!") + ",";
        }

        function staffList(staff){
            return "T!"+ staff.join(",T!") + ",";
        }

        function checkDate(){
            const today = new Date();
            const yyyy = String(today.getFullYear());
            var mm = String(today.getMonth()+1);
            var dd = String(today.getDate());
            if( mm.length == 1){
                mm = "0"+mm
            };
            if( dd.length == 1){
                dd = "0"+dd
            };
            const date = [dd,mm,yyyy].join('-');
            return date;
        }

        function addDropdown(title){
            var dropdown = document.createElement("li");
            dropdown.classList.add("has-dropdown");
            dropdown.classList.add("not-click");

            var dropdownLabel = document.createElement("a");
            dropdownLabel.href = "#";
            dropdownLabel.innerText = title;

            dropdown.appendChild(dropdownLabel);

            var droppedDown = document.createElement("ul");
            droppedDown.classList.add("dropdown");
            dropdown.appendChild(droppedDown);

            leftBlock.append(dropdown);
            return droppedDown;
        }

        function addDropdownItem(dropdown, label, target){
            var dropdownItem = document.createElement("li");
            var dItemLink = document.createElement("a");
            dItemLink.href = target;
            dItemLink.innerText = label;
            dropdownItem.appendChild(dItemLink);
            dropdown.appendChild(dropdownItem);
        }

        function addButton(title, target){
            var label = document.createElement("li");
            label.classList.add("not-click");

            var link = document.createElement("a");
            link.innerText = title;
            link.onclick = (()=>{window.location.href=target;});
            label.append(link);

            leftBlock.append(label);
        }
    }



    runFunctions();

    function runFunctions(){

        if(r_edval.test(currentURL)){
            addEdvalLinks();
        }

        if(r_millennium.test(currentURL)){
            var cssRules = document.createElement("style");
            cssRules.innerHTML = stylesRules;
            document.body.append(cssRules);

            addMillenniumSettings();

            if(r_rollmarking.test(currentURL)){

                if(userData.millenniumToggles.truancy){
                    try{
                        console.log(`Enhancing: Roll marking - Truancy email links`);
                        truancyEmailLinks();
                    }
                    catch(error){
                        console.log("Error in truancy links function");
                        console.log(error)
                    }
                }

                if(userData.millenniumToggles.photoRoll){
                    try{
                        console.log("Enhancing: Roll marking - Photo roll view");
                        usePhotoRoll();
                    }
                    catch(error){
                        console.log("Error in photo roll function");
                        console.log(error);
                    }
                }
            }

            console.log(`Enhancing: Site Header`);
            const newSiteHeader = enhanceSiteHeader().cloneNode(true);

            if(r_timetable.test(currentURL) && userData.millenniumToggles.timetable){
                try{
                    console.log(`Enhancing: Master timetable view`);
                    masterTimetable(newSiteHeader);
                }
                catch(error){
                    console.log("Error in master timetable view function");
                    console.log(error);
                }
            }
        }

        if(r_gClassroom.test(currentURL)){

            console.log("Attempting to enhance Google Classroom");

            // Required on Google Classroom due to required 'trusted HTML' policy (to prevent XSS / script injection attacks)
            const escapeHTMLPolicy = trustedTypes.createPolicy("myEscapePolicy", {
                createHTML: (string) => string.replace(/</g, "&lt;"),
            });
            const escaped = escapeHTMLPolicy.createHTML(styles);

            // Add rule to page
            var css = document.createElement("style");
            css.innerHTML = escaped;
            document.body.append(css);

            // Check that dashboard is loaded before running function
            var interval = setInterval(checkClassroomLoaded, 50);
            function checkClassroomLoaded(){
                var links = document.getElementsByTagName("a");
                if(links.length>100){
                    clearInterval(interval);
                    interval = null;
                    googleClassroomDashboard();

                }
            }

            function makeButtonsVisible(){
                var gcButtons = document.getElementsByClassName('VfPpkd-dgl2Hf-ppHlrf-sM5MNb');
                if(window.location.href.includes('/h')){
                    for(var gcButton of gcButtons){
                        gcButton.classList.add('topRightButton');
                    }
                }
                else{
                    for(var gcButton of gcButtons){
                        gcButton.classList.remove('topRightButton');
                    }
                }
            }
            var buttonInterval = setInterval(makeButtonsVisible, 3000);

            function googleClassroomDashboard() {
                if(userData.gClassroomToggles.condenseCards){
                    styles += compactDashboardStyles;
                }

                if(userData.gClassroomToggles.highlightClasses){
                    var hClassList = highlightDashboardClasses();
                    styles +=hClassList;
                }
                if(userData.gClassroomToggles.hideImages){
                    styles += hideGCbannerImageStyle;
                }
                if(userData.gClassroomToggles.hideClasses){
                    hideOtherClasses();
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
            }
        }//End of Google Classroom Dashboard script



    }


})();
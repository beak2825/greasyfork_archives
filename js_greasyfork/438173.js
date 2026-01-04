// ==UserScript==
// @name         Study Carrel Booker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Book Study Carrel
// @author       You
// @match        *libbs.cityu.edu.hk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438173/Study%20Carrel%20Booker.user.js
// @updateURL https://update.greasyfork.org/scripts/438173/Study%20Carrel%20Booker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styleSheet = `
        .box{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border: 1px solid #e4ecf3;
            width: 300px;
            height: auto;
            border-radius: 15px;
            overflow: hidden;
            background-color: rgb(250, 250, 250);
        }
        .title{
            width: 100%;
            background-color: #0097A7;
            padding: 10px 0;
            text-align: center;
            box-shadow: 0 5px 20px rgb(0 0 0 / 5%);
            color: white;
        }
        .innerBox{
            margin: 20px 20px;
        }
        .flexDiv{
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-bottom: 10px;

        }
        .checkbox{
            margin-top: 5px;
            transform: scale(1.4);
        }
        .lowerPart{
            text-align: center;
        }
        .seprate{
            margin-bottom: 10px;
            text-align: center;
        }
        .functionkey{
            cursor: pointer;
            color: #0097A7;
        }
    `;

    var initHTML = `
        <div class="box">
            <div class="title">Study Carrel Booker</div>
            <div class="innerBox">
                <div class="upperPart">

                </div>

                <div class="lowerPart">

                    <div class="flexDiv">
                        <div class="functionkey" id="addSelection">
                            + add
                        </div>

                        <div class="functionkey" id="clear">
                            × clear
                        </div>
                    </div>

                    <hr>

                    <div class="seprate">
                        <span class="title2">Action time</span>
                        <input type="datetime-local" id="actTime">
                    </div>

                    <hr>

                    <div class="seprate">
                        <span>Status</span>
                        <div id="RegStatus">Not running</div>
                    </div>

                    <hr>

                    <div class="seprate">
                        <button id="startBtn">Start Booking</button>
                        <button id="stopBtn" style="display: none">Stop Booking</button>
                    </div>

                </div>



            </div>
        </div>
    `;

    var innerHTML = `
        <div class="flexDiv">
            <div class="innerFlex">
                <div class="no">#1</div>
                <div class="checkBox">
                    <input type="checkbox" name="checkbox" id="checkbox" class="checkbox" style="display: none">
                </div>
            </div>
            <div class="innerFlex">
                <div>Room</div>
                <select name="room" id="room">
                    <option value="101">101</option>
                    <option value="102">102</option>
                    <option value="103">103</option>
                    <option value="104">104</option>
                    <option value="105">105</option>
                    <option value="106">106</option>
                    <option value="107">107</option>
                    <option value="108">108</option>
                    <option value="109">109</option>
                    <option value="110">110</option>
                    <option value="111">111(Big)</option>
                    <option value="112">112(Big)</option>
                    <option value="113">113</option>
                    <option value="114">114</option>
                    <option value="115">115</option>
                    <option value="116">116</option>
                    <option value="117">117</option>
                    <option value="118">118</option>
                </select>
            </div>
            <div class="innerFlex">
                <div>Time Slot</div>
                <select name="timeslot" id="timeslot">
                    <option value="0900">09:00-10:00</option>
                    <option value="1000">10:00-11:00</option>
                    <option value="1100">11:00-12:00</option>
                    <option value="1200">12:00-13:00</option>
                    <option value="1300">13:00-14:00</option>
                    <option value="1400">14:00-15:00</option>
                    <option value="1500">15:00-16:00</option>
                    <option value="1600">16:00-17:00</option>
                    <option value="1700">17:00-18:00</option>
                    <option value="1800">18:00-19:00</option>
                </select>
            </div>
        </div>
            `;

    //global variables
    var rooms;
    var btns;
    var timeslots;
    var actTime;
    var RegStatus;
    var upperPart;
    var startBtn;
    var stopBtn;
    var RunningStatus = false
    var pendingRegObjects = new Object()
    var theInterval
    var addSelection


    window.addEventListener('load', ()=>{
        initElement();
        initVar();
        readRegObjects()

        initGoToStudyCarrelPage();
        initRefresh();
        console.log(checkIfPageReady())
        initSelectLastDay();

        refreshToPreventLogOut();

    })

    function initVar(){
        RegStatus = document.getElementById("RegStatus");
    }

    function initFirstRow(){
        upperPart.innerHTML += innerHTML;

        /* var firstBtn = document.getElementsByName("checkbox")[0]
        firstBtn.onchange = ()=>{
            refreshFunc();
        } */
    }

    function initElement(){
        var theStyle = document.createElement("style");
        theStyle.innerHTML = styleSheet;
        document.head.appendChild(theStyle);

        var bookerBox = document.createElement("div");
        bookerBox.innerHTML = initHTML;
        document.body.appendChild(bookerBox);

        upperPart = document.getElementsByClassName("upperPart")[0]
        initFirstRow();

        //Add Sections
        addSelection = document.getElementById("addSelection");
        addSelection.onclick = () => {
            addSelectionsFunc();
        }

        //Clear All Sections
        var clearBtn = document.getElementById("clear");
        clearBtn.onclick = () => {
            clearSelectionsFunc();
            initFirstRow();
        }

        //Start Button
        startBtn = document.getElementById("startBtn")
        startBtn.onclick = () => {
            storeRegObjectsAndRun();
            //Pending LocalStorage 想法是 把储存封装成一个函数 然后调用的时候传入101 0900或者第1个需要取的值就ok
        }

        stopBtn = document.getElementById("stopBtn")
        stopBtn.onclick = () => {
            stopRunningFunc();
        }
    }

    function initRefresh(){ //Prevent Log out
        setTimeout(()=>{
            location.reload();
        }, 54000000);
    }

    // For adding a new row to input the room and time that the user want to book
    function addSelectionsFunc(){
        if(document.getElementsByClassName("checkbox").length >= 3){
            addSelection.style.display = "none";
        }

        var num = document.getElementsByClassName("checkbox").length + 1;
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = innerHTML.replace("#1", "#" + num);
        upperPart.appendChild(tempDiv);
    }

    function clearSelectionsFunc(){
        upperPart.innerHTML = "";
        addSelection.style.display = "block";
    }

    function refreshFunc(){
        btns = document.getElementsByName("checkbox");
        rooms = document.getElementsByName("room");
        timeslots = document.getElementsByName("timeslot");
        actTime = document.getElementById("actTime");
        RegStatus = document.getElementById("RegStatus")

        var length = btns.length;
        RegStatus.innerHTML = "";

        for(var i=0; i<length; i++){
            var room = rooms[i].selectedOptions[0].value;
            var timeslot = timeslots[i].selectedOptions[0].value;


            RegStatus.innerHTML += `Room: ${room}, Timeslot: ${timeslot} <br>`;
        }


    }

    function initGoToStudyCarrelPage(){
        if(RunningStatus && document.getElementById("WebContent_ddlRoom").children[0].innerText != 'Study Carrel'){
            window.location = "http://libbs.cityu.edu.hk/LibGeneralBooking.aspx"
        }
    }

    function initSelectLastDay(){
        if(!RunningStatus) return false

        var selectDateBox = document.getElementsByName("ctl00$WebContent$ddlDate")[0]
        if(selectDateBox.value != selectDateBox.length - 1){
            selectDateBox.value = selectDateBox.length - 1
            selectDateBox.onchange()
        }
    }

    function checkIfPageReady(){
        var selectDateBox = document.getElementsByName("ctl00$WebContent$ddlDate")[0]
        if(document.getElementById("WebContent_ddlRoom").children[0].innerText != 'Study Carrel') return false
        else if(selectDateBox.value != selectDateBox.length - 1) return false
        else return true
    }


    function storeRegObjectsAndRun(){
        function refreshRegObjects(){
            btns = document.getElementsByName("checkbox");
            rooms = document.getElementsByName("room");
            timeslots = document.getElementsByName("timeslot");
            actTime = document.getElementById("actTime");

            pendingRegObjects.room = []
            pendingRegObjects.time = []
            pendingRegObjects.actTime = actTime.value
            pendingRegObjects.runStatus = true

            for(var i=0; i<btns.length; i++){
                var room = rooms[i].selectedOptions[0].value;
                var timeslot = timeslots[i].selectedOptions[0].value;

                pendingRegObjects.room.push(room)
                pendingRegObjects.time.push(timeslot)
            }
        }
        refreshRegObjects()
        localStorage.bookHelperJSON = JSON.stringify(pendingRegObjects)
        startRunningFunc()
    }

    function readRegObjects(){
        if(localStorage.bookHelperJSON == void 0) return false

        pendingRegObjects = JSON.parse(localStorage.bookHelperJSON)
        clearSelectionsFunc()
        let actTime = document.getElementById("actTime");
        actTime.value = pendingRegObjects.actTime

        for(var i=0; i<pendingRegObjects.room.length; i++){
            addSelectionsFunc();
            let rooms = document.getElementsByName("room");
            let timeslots = document.getElementsByName("timeslot");

            let lastRoom = rooms[rooms.length - 1]
            let lastTime = timeslots[timeslots.length - 1]

            lastRoom.value = pendingRegObjects.room[i]
            lastTime.value = pendingRegObjects.time[i]

        }

        if(pendingRegObjects.runStatus){
            startRunningFunc()
        }
    }

    function startRunningFunc(){
        RunningStatus = true
        refreshFunc()
        toggleStartStopBtn(true)
        theInterval = setInterval(()=>{
            if(isTimePassed(pendingRegObjects.actTime)){
                initGoToStudyCarrelPage()
                doRegActions()
            }
        }, 1000)//Pending: build Interval

    }

    function stopRunningFunc(){
        RunningStatus = false
        pendingRegObjects.runStatus = false
        toggleStartStopBtn(false)
        localStorage.bookHelperJSON = JSON.stringify(pendingRegObjects)
        clearInterval(theInterval)
    }

    function toggleStartStopBtn(status){
        stopBtn = document.getElementById("stopBtn")
        startBtn = document.getElementById("startBtn")

        //Status == True: Start Running
        //Status == False: Stop Running
        if(status){
            startBtn.style.display = "none"
            stopBtn.style.display = "inline-block"
        } else{
            startBtn.style.display = "inline-block"
            stopBtn.style.display = "none"
        }
    }

    function isTimePassed(targetTime){
        targetTime = Date.parse(targetTime)
        let currentTime = new Date()
        if(targetTime - currentTime < 0) return true
        return false
    }

    // Convert Values to Table indices
    function formValuesToTableElements(room, time){
        var tableRow = room - 100
        var tableColumn = time/100 - 7

        return [tableRow, tableColumn]
    }

    function selectTableElement(coordinate){
        var row = coordinate[0]
        var column = coordinate[1]

        var theTable = document.getElementById("WebContent_StdBookGrid")
        theTable.children[0].children[row].children[column].children[0].click()
    }

    function isTableElementRegistered(coordinate){
        var row = coordinate[0]
        var column = coordinate[1]

        var theTable = document.getElementById("WebContent_StdBookGrid")
        if (theTable.children[0].children[row].children[column].style.backgroundColor == 'yellow') return true
        return false
    }

    function doRegActions(){
        if (!pendingRegObjects.runStatus) return false
        for(var i=0; i<pendingRegObjects.room.length; i++){
            var coord = formValuesToTableElements(pendingRegObjects.room[i], pendingRegObjects.time[i])
            if(isTableElementRegistered(coord)) continue
            selectTableElement(coord)
            return false
        }
        stopRunningFunc()
    }

    function refreshToPreventLogOut(){
        if(!RegStatus) return false
        setTimeout(()=>{location.reload()} ,10*6e4)
    }

})();
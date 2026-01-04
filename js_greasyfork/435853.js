// ==UserScript==
// @name         Auto Book
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Book automatically
// @author       Yaolang Zhong
// @match        https://sportwarwick.leisurecloud.net/Connect/*
// @icon         https://www.google.com/s2/favicons?domain=leisurecloud.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435853/Auto%20Book.user.js
// @updateURL https://update.greasyfork.org/scripts/435853/Auto%20Book.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let current_location = window.location.href
    let myStorage = window.sessionStorage
    let courtnumber = ["A4","A3","A2","A1","B4","B3","B2","B1","C4","C3","C2","C4","D4","D3","D2","D1"]
    //add button
    let applyUI = function () {
                var style = '._th-container ._th-item{margin-bottom:3px;position:relative;width:0;height:0;cursor:pointer;opacity:.3;background-color:aquamarine;border-radius:100%;text-align:center;line-height:30px;-webkit-transition:all .35s;-o-transition:all .35s;transition:all .35s;right:30px}._th-container ._th-item,._th-container ._th-click-hover,._th_cover-all-show-times ._th_times{-webkit-box-shadow:-3px 4px 12px -5px black;box-shadow:-3px 4px 12px -5px black}._th-container:hover ._th-item._item-x2{margin-left:18px;width:40px;height:40px;line-height:40px}._th-container:hover ._th-item._item-x-2{margin-left:17px;width:38px;height:38px;line-height:38px}._th-container:hover ._th-item._item-xx2{width:36px;height:36px;margin-left:16px;line-height:36px}._th-container:hover ._th-item._item-xx-2{width:32px;height:32px;line-height:32px;margin-left:14px}._th-container:hover ._th-item._item-reset{width:30px;line-height:30px;height:30px;margin-left:10px}._th-click-hover{position:relative;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;height:45px;width:45px;cursor:pointer;opacity:.3;border-radius:100%;background-color:aquamarine;text-align:center;line-height:45px;right:0}._th-container:hover{left:-5px}._th-container{font-size:12px;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;left:-35px;top:20%;position:fixed;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:100000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}._th-container ._th-item:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th-container ._th-item:active{opacity:.9;background-color:#1b3a26;color:aliceblue}._th-container:hover ._th-click-hover{opacity:.8}._th-container:hover ._th-item{opacity:.6;right:0}._th-container ._th-click-hover:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th_cover-all-show-times{position:fixed;top:0;right:0;width:100%;height:100%;z-index:99999;opacity:1;font-weight:900;font-size:30px;color:#4f4f4f;background-color:rgba(0,0,0,0.1)}._th_cover-all-show-times._th_hidden{z-index:-99999;opacity:0;-webkit-transition:1s all;-o-transition:1s all;transition:1s all}._th_cover-all-show-times ._th_times{width:300px;height:300px;border-radius:50%;background-color:rgba(127,255,212,0.51);text-align:center;line-height:300px;position:absolute;top:50%;right:50%;margin-top:-150px;margin-right:-150px}';


                // 在页面左边添加一个半圆便于修改
                var html = '<div class="_th-container">\n' +
                    '    <div class="_th-click-hover _item-input">\n' +
                    '        x\n' +
                    '    </div>\n' ;

        var stylenode = document.createElement('style');
                stylenode.setAttribute("type", "text/css");
                if (stylenode.styleSheet) {// IE
                    stylenode.styleSheet.cssText = style;
                } else {// w3c
                    var cssText = document.createTextNode(style);
                    stylenode.appendChild(cssText);
                }
                var node = document.createElement('div');
                node.innerHTML = html;

                var clickMapper = {
                    '_item-input': function () {
                        autoBook()
                    }
                };

                Object.keys(clickMapper).forEach(function (className) {
                    var exec = clickMapper[className];
                    var targetEle = node.getElementsByClassName(className)[0];
                    if (targetEle) {
                        targetEle.onclick = exec;
                    }
                });


                            document.head.appendChild(stylenode);
                            document.body.appendChild(node);

                            console.log('Time Hooker Works!');

            }


    let autoBook = function() {
        if (checkCurrentStatus()) {
            let string ="Auto Booking ongong for " + myStorage.getItem("RequestDate") + " " + myStorage.getItem("RequestT1") + " " + myStorage.getItem("RequestT2")
            alert(string)
        } else {
             let time = prompt("Please enter the date and time(please enter nothing if you don't want the auto booking start)", "23 Nov;14:00;15:00;C1")
             if (time != "") {
                 time = time.split(";")
                 let date = time[0]
                 let time1 = time[1]
                 let time2 = time[2]
                 let preferCourt = time[3]
                 myStorage.setItem("autoBook", true)
                 myStorage.setItem("RequestDate",date)
                 myStorage.setItem("RequestT1", time1)
                 myStorage.setItem("RequestT2", time2)
                 myStorage.setItem("Requestfullfill",0)
                 myStorage.setItem("Court",preferCourt)
                 console.log(date, time1, time2,preferCourt)
                 console.log("Session stored")
                 initAutoBook()
             } else {
                 alert("No input receive")
             }
        }
    }


    let checkCurrentStatus = function() {
        if(myStorage.getItem("autoBook")) {
           return true
        } else {
            return false
        }
    }

    let initAutoBook = function() {

        if (checkCurrentStatus()) {

            current_location = current_location.split("/")
            let precise_location = current_location[current_location.length - 1]
            console.log(precise_location)

            switch(precise_location) {

                case "memberHomePage.aspx":
                    window.location.href = "https://sportwarwick.leisurecloud.net/Connect/mrmselectActivityGroup.aspx"
                break

                case "mrmselectActivityGroup.aspx":
                    var allinput = document.querySelectorAll('input[type=submit]')
                    for (let i=0; i < allinput.length;i++) {
                        if (allinput[i].value == "Racquet Sports") {
                            allinput[i].click();
                        }
                    }
                    //document.getElementById("ctl00_MainContent_activityGroupsGrid_ctrl12_lnkListCommand").click();
                break

                case "mrmSelectActivity.aspx":
                    document.getElementById("ctl00_MainContent_activitiesGrid_ctrl0_lnkListCommand").click();
                break

                case "mrmResourceStatus.aspx":
                    var name
                    var temButton
                    for (let i = 0; i <20; i++) {
                        name = "ctl00_MainContent_cal_calbtn" + i
                        temButton = document.getElementById(name)
                        if(temButton.value == "Available") {
                            temButton.click()
                            break
                        }
                      }

                break

                case "mrmProductStatus.aspx":

                    var checkdate = function() {
                        var exactdate = document.getElementById("ctl00_MainContent_lblCurrentNavDate")
                        exactdate = exactdate.innerHTML
                        exactdate = exactdate.split(" ")
                        var currentdate = exactdate[1] + " " + exactdate[2]

                        if (currentdate == myStorage.getItem("RequestDate")) {
                            console.log("Correct day")
                            return true
                        } else {
                            console.log("Wrong day")
                            return false
                        }
                    }

                    var nextdate = function() {
                        if(!checkdate()) {
                          document.getElementById("ctl00_MainContent_Button2").click()
                          console.log("Move to next day")
                          checkdate()
                        } else {
                          console.log("Correct day")
                          startMonitoring()
                        }

                     }

                    var startMonitoring = function() {
                        var all_available = document.getElementsByClassName("itemavailable")
                        var requestT1 = myStorage.getItem("RequestT1")
                        var requestT2 = myStorage.getItem("RequestT2")
                        var requestfullfill = myStorage.getItem("Requestfullfill")
                        console.log(requestfullfill)
                        var availableList = []
                        var final_list = []
                        for (var i=0;i<all_available.length;i++) {
                            var available_time = all_available[i].childNodes[0].value
                            if (requestfullfill == "0") {
                                if (available_time == requestT1) {
                                    console.log("Booking First Court")
                                    availableList.push(all_available[i].childNodes[0])
                                 }
                            } else if (requestfullfill == "1") {
                                if (available_time == requestT2) {
                                    console.log("Booking Second Court")
                                    availableList.push(all_available[i].childNodes[0])
                                 }
                            } else {
                                console.log("Booking Completed")
                            }

                        }

                        if (availableList.length == 0) {
                          console.log("No court available")
                          setInterval(function() {location.reload()}, 10*1000)
                        } else {
                            console.log("time avialable")

                            //start from prefer court
                            for (var a=0; a < availableList.length; a++) {
                                var info = availableList[a].getAttribute("data-qa-id").split("=")
                                var this_court = info[info.length - 1]
                                this_court = this_court.split(" ")
                                var this_zone = this_court[1]
                                var this_court_no = this_court[3]
                                var prefer_zone = myStorage.getItem("Court")[0]
                                var prefer_court_no = myStorage.getItem("Court")[1]
                                if (this_zone == prefer_zone) {
                                    if (this_court_no == prefer_court_no) {
                                        console.log("zone and court",availableList[a])
                                        final_list.push(availableList[a])
                                        break
                                    }
                                }

                            }
                            //finding prefer zone
                            for (a=0; a < availableList.length; a++) {
                                info = availableList[a].getAttribute("data-qa-id").split("=")
                                this_court = info[info.length - 1]
                                this_court = this_court.split(" ")
                                this_zone = this_court[1]
                                this_court_no = this_court[3]
                                prefer_zone = myStorage.getItem("Court")[0]
                                prefer_court_no = myStorage.getItem("Court")[1]
                                if (this_zone == prefer_zone) {
                                    console.log("onlyzone",availableList[a])
                                    final_list.push(availableList[a])
                                    break
                                }
                            }
                            //finding any avaiable
                            final_list.push(availableList[0])

                            final_list[0].click()
                        }

                    }
                    var autoBook = myStorage.getItem("autoBook")
                   
                    nextdate()
                break

                case "mrmConfirmBooking.aspx":
                    if (checkCurrentStatus) {
                        document.getElementById("ctl00_MainContent_btnBasket").click()
                    } else {
                        window.location.href = "https://sportwarwick.leisurecloud.net/Connect/memberHomePage.aspx"
                    }

                break

                case "mrmBookingConfirmed.aspx":
                    var requestfullfill = myStorage.getItem("Requestfullfill")
                    requestfullfill = parseInt(requestfullfill) + 1
                    if(requestfullfill == "1") {
                        myStorage.setItem("Requestfullfill", requestfullfill)
                        window.location.href = "https://sportwarwick.leisurecloud.net/Connect/memberHomePage.aspx"
                    } else {
                        myStorage.setItem("Requestfullfill", 0)
                        myStorage.setItem("autoBook", false)
                        myStorage.setItem("RequestDate","")
                        myStorage.setItem("RequestT1", "")
                        myStorage.setItem("RequestT2", "")
                        myStorage.setItem("Court","")
                        window.location.href = "https://www.google.com/"
                    }


                break

                case "opInfo.aspx":
                   window.location.href = "https://sportwarwick.leisurecloud.net/Connect/memberHomePage.aspx"
                break


            }
        }
    }

    applyUI()
    initAutoBook()

})();
// ==UserScript==
// @name         Ghost-Trapper-Auto-Collect-And-Send-Badge
// @namespace    http://www.ghost-trappers.com/fb/request_badges.php
// @version      0.1
// @description  Auto send badge for ghost trapper, priority who send you request first. Still beta, more features comming soon
// @author       KoK9
// @match        http://www.ghost-trappers.com/fb/request_badges.php
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20365/Ghost-Trapper-Auto-Collect-And-Send-Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/20365/Ghost-Trapper-Auto-Collect-And-Send-Badge.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var userList;
    var users;
    var optionsList =[];
    var selectElement;


    // Your code here...
    init();
    compareAndSelect(users,optionsList);
    userList = convertUsers(users);
    setUserList(userList);

    /**
     * Function defined here
     */
    function compareAndSelect(users,optionsList){
        for(var i =1;i<optionsList.length;i++){
            for(var r = 0;r<users.length;r++){
                if(users[r].name == optionsList[i].name){
                    console.log(optionsList[i].name +" " +optionsList[i].value);
                    $("#request_fbid").val(optionsList[i].value).change();
                    document.getElementsByClassName("sendRequestButton")[0].click();
                    return;
                }
            }
        }
    }

    function init(){
        userList = getUserList();
        users = covertUserList(userList);
        var rawList = document.getElementsByClassName("badgeRequestTable")[1].getElementsByClassName("nameContainer");
        for(var i =0;i<rawList.length;i++){
            var name = rawList[i].innerText;
            checkAndIncrease(name);
        }
        users = users.sort(compare);
        /**
         * Get option list
         */
        optionsList = initOptionList();

    }
    function initOptionList(){
        var options = [];
        selectElement = document.getElementById("request_fbid");
        for(var i =0;i<selectElement.length;i++){
            var option ={name:"",value:0,select:function(){}};
            option.name = selectElement[i].innerText;
            option.value = selectElement[i].value;
            console.log("$option.name "+option.name+" $option.value "+option.value);
            option.select = function(){
                $("#request_fbid").val(option.value).change();
            };
            options.push(option);
        }
        return options;
    }
    function checkAndIncrease(name){
        for(var b = 0;b<users.length;b++){
            if(b.name==name)
            {
                b.count++;
                return;
            }
        }
        users.push({name:name,count:0});
    }
    function compare(a,b) {
        if (a.count < b.count)
            return -1;
        else if (a.count > b.count)
            return 1;
        else
            return 0;
    }
    function covertUserList(userList){
        if(userList==""||userList==null) return [];
        var user = [];
        var r = userList.split('@');
        for(var i =0;i< r.length;i++){
            user.push({name:r[i].split("|")[0],count:r[i].split("|")[1]});
        }
        return users;
    }
    function convertUsers(users){
        var userList ="";
        for(var i =0;i<users.length;i++){
            userList += users[i].name+"|";
            userList+= users[i].count+"@";
        }
        userList = userList.splice(userList.length-2,userList.length-1);
        return userList;
    }
    function getUserList(){
        return localStorage.getItem("userList");

    }
    function  setUserList(userList){

    }
})();

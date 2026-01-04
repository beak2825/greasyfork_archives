// ==UserScript==
// @name         Mr Booking PAN
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Autobooker
// @author       Defies logic
// @match        http://www.yonganpark.com.sg
// @match        http://www.yonganpark.com.sg/*
// @match        http://www.yonganpark.com.sg/index.php?page=popup
// @grant   GM_registerMenuCommand
// @require http://code.jquery.com/jquery-latest.js
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/38420/Mr%20Booking%20PAN.user.js
// @updateURL https://update.greasyfork.org/scripts/38420/Mr%20Booking%20PAN.meta.js
// ==/UserScript==
/* global $ ,alert */
/* global GM_config ,alert */
'use strict';

var test_array = [];
var date_time = [];
var timings_court = [];
var fieldDefs = {
    //user 1
    'user1': {
        'section' : 'USER DETAILS',
        'label': 'UNIT 1 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass1': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //user 2
    'user2': {
        'section' : [],
        'label': 'UNIT 2 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass2': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //user 3
    'user3': {
        'section' : [],
        'label': 'UNIT 3 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass3': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //user 4
    'user4': {
        'section' : [],
        'label': 'UNIT 4 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass4': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //user 5
    'user5': {
        'section' : [],
        'label': 'UNIT 5 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass5': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //user 6
    'user6': {
        'section' : [],
        'label': 'UNIT 6 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass6': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //user 7
    'user7': {
        'section' : [],
        'label': 'UNIT 7 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass7': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //user 8
    'user8': {
        'section' : [],
        'label': 'UNIT 8 | USERNAME',
        'labelPos': 'left',
        'type': 'text',
        'default': ''
    },
    'pass8': {
        'label': '    PASSWORD',
        'type': 'text',
        'default': ''
    },
    //datetime
    'day': {
        'section' : 'DATE OF BOOKING',
        'label': 'DAY',
        'type': 'select',
        'labelPos': 'above',
        'options': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        'default': '1'
    },
    'month': {
        'label': 'MONTH',
        'type': 'select',
        'labelPos': 'above',
        'options': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        'default': '1'
    },
    'year': {
        'label': 'YEAR',
        'type': 'select',
        'labelPos': 'above',
        'options': ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040', '2041', '2042', '2043', '2044', '2045', '2046', '2047', '2048', '2049', '2050', '2051', '2052', '2053', '2054', '2055', '2056', '2057', '2058', '2059', '2060', '2061', '2062', '2063', '2064', '2065', '2066', '2067', '2068', '2069'],
        'default': '2018'
    },




    //Timings to book
    'time_start1': {
        'section' : 'BOOK TIMINGS - COURT 1',
        'label': 'START TIME',
        'type': 'select',
        'labelPos': 'left',
        'options': ['NOT BOOKING','07:00', '08:00', '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
        'default': 'NOT BOOKING'
    },
    'duration1': {
        'label': 'duration',
        'type': 'select',
        'labelPos': 'left',
        'options': ['1 Hour', '2 Hour', '3 Hour', '4 Hour', '5 Hour', '6 Hour', '7 Hour', '8 Hour'],
        'default': '1 Hour'
    },
    'time_start2': {
        'section' : 'BOOK TIMINGS - COURT 2',
        'label': 'START TIME',
        'type': 'select',
        'labelPos': 'left',
        'options': ['NOT BOOKING','07:00', '08:00', '09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
        'default': 'NOT BOOKING'
    },
    'duration2': {
        'label': 'duration',
        'type': 'select',
        'labelPos': 'left',
        'options': ['1 Hour', '2 Hour', '3 Hour', '4 Hour', '5 Hour', '6 Hour', '7 Hour', '8 Hour'],
        'default': '1 Hour'
    },
    'sanity': {
        'section' : 'PRESS CHECK ENTRIES BEFORE CLOSING',
        'label': 'Check Entries',
        'type': 'button',
        'click': function() {
            check_today_date();
            add_to_stack();
        }
    },


    'User_array':
    {
        'type' : 'hidden',
        'default' : '0'
    },



};


function array_test()
{

    var temp = JSON.parse(sessionStorage.my_storage);
    if (temp.length == 0){
        //alert("HAHA ZERO");
    }
    else {
        alert(temp.shift());
    }
    sessionStorage.my_storage = JSON.stringify(temp);
}

function array_test_button()
{
    var NEWBABY=document.createElement("input");
    NEWBABY.type="button";
    NEWBABY.value="START BOOKING";
    NEWBABY.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:40px;");
    NEWBABY.addEventListener("click", initialise_my_stack, false);
    document.body.appendChild(NEWBABY);

    var NEWBABY2=document.createElement("input");
    NEWBABY2.type="button";
    NEWBABY2.value="RESET";
    NEWBABY2.setAttribute("style", "font-size:18px;position:absolute;top:170px;right:40px;");
    NEWBABY2.addEventListener("click", RESET_ALL, false);
    document.body.appendChild(NEWBABY2);
}
function create_config()
{
    var NEWBABY=document.createElement("input");
    NEWBABY.type="button";
    NEWBABY.value="ENTER DETAILS";
    NEWBABY.setAttribute("style", "font-size:18px;position:absolute;top:70px;right:40px;");
    NEWBABY.addEventListener("click", poopypants, false);
    document.body.appendChild(NEWBABY);
}

function poopypants()
{
    GM_config.open();
}

//sanity functions

function check_today_date(){
    GM_config.save();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var checksum = 0;

    if( (GM_config.get('month') == 4) || (GM_config.get('month') == 6) || (GM_config.get('month') == 9) || (GM_config.get('month') == 11) )
    {
        if (GM_config.get('day')>30){checksum = 1;}
    }
    else if (GM_config.get('month') == 2){
        if (GM_config.get('day')>29){checksum = 1;}
    }
    if (checksum){
        alert("wrong date! Check the date!");
        return;
    }
    checksum = 0;

    if( yyyy > GM_config.get('year') ){ checksum = 1;}
    else if( (mm > GM_config.get('month')) && (yyyy==GM_config.get('year')) ){checksum=1;}
    else if( (dd > GM_config.get('day')) && (mm == GM_config.get('month')) && (yyyy == GM_config.get('year')) ){checksum=1;}

    if (checksum){
        var todaydatehaha = dd+'/'+mm+'/'+yyyy;
        var your_date = GM_config.get('day')+'/'+GM_config.get('month')+'/'+GM_config.get('year');
        alert("wrong date!\r your date is: " + your_date + " \r Current date is: "+ todaydatehaha);
        return;
    }
    scan_users();
}

function scan_users(){
    var no_users = 0
    var no_pass = 0
    for (i = 1; i <= 8; i++) {
        var flag = 0;
        if (GM_config.get('user' + i) != "" ){
            flag++;
            no_users++;
        }
        if (GM_config.get('pass' + i) != "" ){
            flag++;
            no_pass++;
        }
        if(flag == 1){
            alert("User " + i + " is missing a username/password")
        }
    }
    if (no_users != no_pass){
        alert("Check Username and Password: Unequal number of username and password.");
        return;
    }

    //check which courts are used
    var playtime1 =  0;
    var playtime2 =  0;
    var long_clock1 = 0;
    var long_clock2 = 0;
    if (GM_config.get('time_start1') != 'NOT BOOKING'){
        playtime1 += parseInt(GM_config.get('duration1').charAt(0));
        long_clock1 += (parseInt(GM_config.get('time_start1').charAt(0)) * 10) + parseInt(GM_config.get('time_start1').charAt(1));
    };
    if (GM_config.get('time_start2') != 'NOT BOOKING'){
        playtime2 += parseInt(GM_config.get('duration2').charAt(0));
        long_clock2 += (parseInt(GM_config.get('time_start2').charAt(0)) * 10) + parseInt(GM_config.get('time_start2').charAt(1));
    };
    if (no_users<(playtime1+playtime2)){
        alert("Check duration: too little users to book " + (playtime1+playtime2) + " hours total");
        return;
    };
    if ((playtime1+long_clock1)>24){
        alert("Check duration: Court 1 closes at 23:00! "+ long_clock1);
        return;
    };
    if ((playtime2+long_clock2)>24){
        alert("Check duration: Court 2 closes at 23:00! "+ long_clock2);
        return;
    };
    alert("Check completed! Entries [OK]");
}
//init the gm thiny & misc & parsers
function init_the_GM(){

    GM_config.init(
        {
            id: 'GM_config',
            title: 'ENTER DETAILS',
            fields: fieldDefs,
            css: '#GM_config_section_0 .config_var, #GM_config_section_1 .config_var, #GM_config_section_2 .config_var,#GM_config_section_3 .config_var,'
            +'#GM_config_section_4 .config_var,#GM_config_section_5 .config_var,#GM_config_section_6 .config_var,#GM_config_section_7 .config_var,#GM_config_section_8 .config_var { margin: 0% !important;display: inline !important; }'
        });
}

function parse_date_time(){
    return date_time;
}
function time_plus_1_h(t_in){
    return (parseInt(t_in.charAt(0)) * 10) + parseInt(parseInt(t_in.charAt(1))+1) + ":00";
}
function add_to_stack(){
    var temp_arr = [];
    var user_arr = [];
    var pass_arr = [];
    var temp_court_arr = [];
    var playtime1 = parseInt(GM_config.get('duration1').charAt(0));
    var playtime2 = parseInt(GM_config.get('duration2').charAt(0));
    for (i=1; i<=8; i++){
        if (GM_config.get('user' + i) != "" ) {
            user_arr.push( GM_config.get('user' + i) );
            pass_arr.push( GM_config.get('pass' + i) );
        }
    }
    //input for court 1
    if (GM_config.get('time_start1') != 'NOT BOOKING'){
        for (i=0; i<playtime1; i++){
            temp_arr.push(user_arr.pop());
            temp_arr.push(pass_arr.pop());
            var long_clock = (parseInt(GM_config.get('time_start1').charAt(0)) * 10) + parseInt(GM_config.get('time_start1').charAt(1)) + i;
            var temp_str = ":00";
            if (long_clock<10){
                temp_str=long_clock+temp_str;
                temp_str = "0" + temp_str;
            }
            else
            {
                temp_str=long_clock+temp_str;
            }
            temp_arr.push(temp_str);
            temp_court_arr.push(46);
        }
    }
    //input for court 2
    if (GM_config.get('time_start2') != 'NOT BOOKING'){
        for (i=0; i<playtime2; i++){
            temp_arr.push(user_arr.pop());
            temp_arr.push(pass_arr.pop());
            var long_clock = (parseInt(GM_config.get('time_start2').charAt(0)) * 10) + parseInt(GM_config.get('time_start2').charAt(1)) + i;
            var temp_str = ":00";
            if (long_clock<10){
                temp_str=long_clock+temp_str;
                temp_str = "0" + temp_str;
            }
            else
            {
                temp_str=long_clock+temp_str;
            }
            temp_arr.push(temp_str);
            temp_court_arr.push(51);
        }
    }
    //alert(temp_arr);
    test_array = temp_arr;
    timings_court = temp_court_arr;

    var temp_DT_arr = [];
    var dae = GM_config.get('day');
    var mun = GM_config.get('month');
    var yar = GM_config.get('year');

    if (dae<10){
        dae = "0" + "" + dae;
    }
    if (mun<10){
        mun = "0" + "" + mun;
    }
    temp_DT_arr.push(dae);
    temp_DT_arr.push(mun);
    temp_DT_arr.push(yar);

    date_time = temp_DT_arr;
    //alert(test_array);
    //alert(date_time);
    //alert(timings_court);
}

function RESET_ALL(){
    test_array = [];
    date_time = [];
    timings_court =[];

    GM_config.set('User_array','0');
    GM_config.save();

    alert("internal cache cleared");
}

function EMERGENCY_EXIT(){
    test_array = [];
    date_time = [];
    timings_court =[];

    GM_config.set('User_array','0');
    GM_config.save();

    alert("EXIT DUE TIMEOUT");
}
function skip_booking(){
    test_array = [];
    date_time = [];
    timings_court =[];

    GM_config.set('User_array','0');
    GM_config.save();

    alert("EXIT DUE TIMEOUT");
}

//LOGIN FUNCTIONS

function click_logout(){
    $("[href *= 'index.php?mode=logout']")[0].click();
}

function click_login(){
    $("[name = 'submit']")[0].click();
}

function fill_user_pass(){
    $("[name = 'siteuser']").val( pop_session_stack() );
    $("[name = 'sitepassword']").val( pop_session_stack() );
}
function fill_user_pass_t(){
    alert(pop_session_stack() );
    alert(pop_session_stack() );
}
function pop_session_stack(){
    var temp = JSON.parse(sessionStorage.my_session_stack);
    if (temp.length == 0){

        GM_config.set('User_array','0');
        GM_config.save();
        sessionStorage.my_session_stack = JSON.stringify(temp);

    }
    else {
        var result = temp.shift();
        sessionStorage.my_session_stack = JSON.stringify(temp);
        return result;
    }
}
function pop_court_stack(){
    var temp = JSON.parse(sessionStorage.my_courts_stack);
    if (temp.length == 0){
        sessionStorage.my_courts_stack = JSON.stringify(temp);
    }
    else {
        var result = temp.shift();
        sessionStorage.my_courts_stack = JSON.stringify(temp);
        return result;
    }
}
function peek_session_stack(){
    var temp = JSON.parse(sessionStorage.my_session_stack);
    if (temp.length == 0){
        sessionStorage.my_session_stack = JSON.stringify(temp);

    }
    else {
        var result = temp[0];
        sessionStorage.my_session_stack = JSON.stringify(temp);
        return result;
    }
}
function peek_date_time_stack(){
    var temp = JSON.parse(sessionStorage.my_date_time_stack);
    if (temp.length == 0){
        sessionStorage.my_session_stack = JSON.stringify(temp);

    }
    else {
        var result = temp;
        sessionStorage.my_date_time_stack = JSON.stringify(temp);
        return result;
    }
}
function peek_court_stack(){
    var temp = JSON.parse(sessionStorage.my_courts_stack);
    if (temp.length == 0){
        sessionStorage.my_courts_stack = JSON.stringify(temp);

    }
    else {
        var result = temp[0];
        sessionStorage.my_courts_stack = JSON.stringify(temp);
        return result;
    }
}
function initialise_my_stack(){
    if ((test_array.length == 0) || (date_time.length == 0)){
        alert("Please Press Check Entries First!");
        return;
    }
    sessionStorage.my_date_time_stack = JSON.stringify(date_time);
    sessionStorage.my_session_stack = JSON.stringify(test_array);
    sessionStorage.my_courts_stack = JSON.stringify(timings_court);
    GM_config.set('User_array','1');
    GM_config.save();
    window.location.reload();
}

function autologin(){
    fill_user_pass();
    click_login();
}


function login_skipper()
{
    $("#agree")[0].click();
}

//actionscript
function Navigate(){
    if (window.location.href.includes("http://www.yonganpark.com.sg/index.php?page=home") )
    {
        //do the login
        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        autologin();
    }
    else if(window.location.href == "http://www.yonganpark.com.sg/index.php?page=popup" )
    {
        //do the login_skipper();
        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        login_skipper();
    }
    else if(window.location.href == "http://www.yonganpark.com.sg/index.php?page=bulletin" )
    {
        //go to facilities page
        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        $("[href *= 'index.php?page=facilities&mode=start']")[0].click();
    }
    else if(window.location.href.includes("http://www.yonganpark.com.sg/index.php?page=facilities&mode=start") )
    {
        //choose badminton court, default court 1
        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        $("[href *= 'index.php?page=facilities&mode=events&facid="+peek_court_stack()+"']")[0].click();
    }
    else if(window.location.href.includes("http://www.yonganpark.com.sg/index.php?page=facilities&mode=events&facid="+peek_court_stack()+"") )
    {
        //found court, picking day
        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        $("[href *= '?page=facilities&mode=browse&facid="+peek_court_stack()+"&curDay=" + peek_date_time_stack()[0] + "&curMonth=" + peek_date_time_stack()[1] + "&curYear=" + peek_date_time_stack()[2] + "']")[0].click();
    }
    else if(window.location.href.includes("http://www.yonganpark.com.sg/index.php?page=facilities&mode=browse&facid="+peek_court_stack()+"&curDay="+ peek_date_time_stack()[0] +"&curMonth="+ peek_date_time_stack()[1] +"&curYear="+peek_date_time_stack()[2]+"") )
    {
        //picking time
        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        $("[href *= '?page=facilities&mode=book&facid="+peek_court_stack()+"&curDay=" + peek_date_time_stack()[0] + "&curMonth=" + peek_date_time_stack()[1] + "&curYear=" + peek_date_time_stack()[2] + "&timeslot="+peek_session_stack()+"&endslot=']")[0].click();
    }
    else if(window.location.href.includes("http://www.yonganpark.com.sg/index.php?page=facilities&user=&mode=receipt&facid="+peek_court_stack()+"&curDay="+ peek_date_time_stack()[0] +"&curMonth="+ peek_date_time_stack()[1] +"&curYear="+peek_date_time_stack()[2]+ "&timeslot="+ peek_session_stack() + "&endslot="+ time_plus_1_h(peek_session_stack())) )
    {
        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        pop_session_stack();
        pop_court_stack();
        click_logout();
    }
    else if(window.location.href.includes("http://www.yonganpark.com.sg/index.php?page=facilities&mode=book&facid="+peek_court_stack()+"&curDay="+ peek_date_time_stack()[0] +"&curMonth="+ peek_date_time_stack()[1] +"&curYear="+peek_date_time_stack()[2]+ "&timeslot="+ peek_session_stack() + "&endslot=") )
    {
        //logout
        //alert(peek_session_stack());

        setTimeout(function(){ EMERGENCY_EXIT();window.location.reload(); }, 10000);
        $("[onclick *= 'formRedirect();']")[0].click();
        //alert(("http://www.yonganpark.com.sg/index.php?page=facilities&mode=book&facid="+peek_court_stack()+"&curDay="+ peek_date_time_stack()[0] +"&curMonth="+ peek_date_time_stack()[1] +"&curYear="+peek_date_time_stack()[2]+ "&timeslot="+ peek_session_stack() + "&endslot="+ time_plus_1_h(peek_session_stack())));
    }
}









$(document).ready(function() {

    init_the_GM();

    if ( GM_config.get('User_array') == '1' ){
        Navigate();
    }



    array_test_button();
    create_config();




});
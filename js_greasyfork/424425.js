// ==UserScript==
// @name         FCLM Intradays
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Add intraday(s) buttons
// @author       nowaratn
// @match        https://fclm-portal.amazon.com/*
// @icon         https://fclm-portal.amazon.com/resources/images/icon.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424425/FCLM%20Intradays.user.js
// @updateURL https://update.greasyfork.org/scripts/424425/FCLM%20Intradays.meta.js
// ==/UserScript==

// godzinki
var ds_start_hour = 6;
var ds_start_minute = 0;
var ds_end_hour = 16;
var ds_end_minute = 2;

var ns_start_hour = 18;
var ns_start_minute = 2;
var ns_end_hour = 5;
var ns_end_minute = 0;

if( localStorage.getItem("ds_start_hour") != null)
{
    ds_start_hour = localStorage.getItem("ds_start_hour");
    ds_start_minute = localStorage.getItem("ds_start_minute");
    ds_end_hour = localStorage.getItem("ds_end_hour");
    ds_end_minute = localStorage.getItem("ds_end_minute");

    ns_start_hour = localStorage.getItem("ns_start_hour");
    ns_start_minute = localStorage.getItem("ns_start_minute");
    ns_end_hour = localStorage.getItem("ns_end_hour");
    ns_end_minute = localStorage.getItem("ns_end_minute");
}


var interval = setInterval(function(){
    if(document.getElementsByClassName("cp-submit-row")[0] != undefined && document.getElementsByTagName("table")[0] != undefined)
    {
        if(document.getElementById("menu_div") == undefined)
        {

            // // Ustawiamy szerokosc na 850px, aby zmiescic wszystkie guziki
            // for (var i = 0;i<document.getElementsByTagName("table").length;i++)
            // {
            //     if(document.getElementsByTagName("table")[i].className == "")
            //     {
            //         document.getElementsByTagName("table")[i].style.width = "650px";
            //         i = 50;
            //     }
            // }

            // Usuwamy odnośnik do starej wersji (która i tak nie działa)
            if(document.getElementsByClassName("legacy-link")[0] != undefined)
            {
                document.getElementsByClassName("legacy-link")[0].remove();
            }

            // Dodajemy guzik menu konfiguracji godzin dla zmian
            var menubutton_div = document.createElement ('div');
            menubutton_div.id = "menubutton_div";
            menubutton_div.style = "display:contents;";
            menubutton_div.innerHTML = '<input type="button" id="menubutton" value="" class="" style="width:20px;float:left;background-image:url(https://drive-render.corp.amazon.com/view/nowaratn@/settings-cog.png);background-repeat:no-repeat;background-size:16px 16px;" />';
            document.getElementsByClassName("cp-submit-row")[0].appendChild(menubutton_div);

            document.getElementById("menubutton").addEventListener (
                "click", ButtonClick_menu, false
            );

            function ButtonClick_menu (zEvent)
            {
                if ( document.getElementById("menu_div").style.visibility == "visible")
                {
                    document.getElementById("menu_div").style.visibility = "hidden";
                }
                else
                {
                    document.getElementById("menu_div").style.visibility = "visible";
                }
            }


            // menu konfiguracji godzin dla zmian
            var menu_div = document.createElement ('div');
            menu_div.id = "menu_div";
            menu_div.style = "position:fixed;visibility:hidden;background-color:grey;border-style:solid;border-color:black;border-size:2px;width:auto;height:auto;left:100px;top:40%;z-index:999;";
            menu_div.innerHTML =
                '<div id="menu_divheader" style="text-align:center;border-style:solid !important;border:black;cursor:move;background-color:black;color:white;">FCLM Intradays by @nowaratn <input id="menu_hide" type="button" value="X" style="font-weight:bold;"></div>' +
                '<center>' +
                '<div id="menu_div" style="padding:5px;">' +
                '<input type="button" id="2-shifts" value="2-shift system" > <input type="button" id="3-shifts" value="3-shift system" >  <input type="button" id="4-shifts" value="4-shift system" > <hr>' +
                '<div id="shift_menu"></div>' +
                '<div style="margin-bottom:10%;" >' +
                '<input type="checkbox" id="adjust_plan_checkbox" >Adjust for intradays?<br>' +
                '<input type="checkbox" id="empty_lines_checkbox" style="">Hide empty lines?<br><br>' +
                '<input type="button" id="zapisz_button" value="Save settings" style="float:left;">' +
                '<input type="button" id="czysc_button" value="Clear" style="float:right;"></div></div>';
            document.getElementsByClassName("cp-submit-row")[0].appendChild(menu_div);
            dragElement(document.getElementById("menu_div"));


            document.getElementById("2-shifts").addEventListener (
                "click", TwoShifts, false
            );

            document.getElementById("3-shifts").addEventListener (
                "click", ThreeShifts, false
            );

            document.getElementById("4-shifts").addEventListener (
                "click", FourShifts, false
            );

            document.getElementById("menu_hide").addEventListener (
                "click", menu_hide, false
            );

            function menu_hide (zEvent)
            {
                document.getElementById("menu_div").style.visibility = "hidden";
            }

            function TwoShifts (zEvent)
            {
                localStorage.setItem("shift_type","2shifts");

                document.getElementById("shift_menu").innerHTML =
                    '<div style="text-align:left;">Start DS: <select id="startHourIntraday_ds" name="startHourIntraday1" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_ds" name="startMinuteIntraday1" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End DS: <select id="endHourIntraday_ds" name="startHourIntraday2" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_ds" name="startMinuteIntraday2" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>' +
                    '<div style="text-align:left;">Start NS: <select id="startHourIntraday_ns" name="startHourIntraday3" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_ns" name="startMinuteIntraday3" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End NS: <select id="endHourIntraday_ns" name="startHourIntraday4" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_ns" name="startMinuteIntraday4" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>';

                // Ustawiamy ustawienia według zapisanych zmiennych (dla przejrzystości konfiguracji)
                if( localStorage.getItem("ds_start_hour") != null)
                {
                    document.getElementById("startHourIntraday_ds").value = localStorage.getItem("ds_start_hour");
                    document.getElementById("startMinuteIntraday_ds").value = localStorage.getItem("ds_start_minute");
                    document.getElementById("endHourIntraday_ds").value = localStorage.getItem("ds_end_hour");
                    document.getElementById("endMinuteIntraday_ds").value = localStorage.getItem("ds_end_minute");

                    document.getElementById("startHourIntraday_ns").value = localStorage.getItem("ns_start_hour");
                    document.getElementById("startMinuteIntraday_ns").value = localStorage.getItem("ns_start_minute");
                    document.getElementById("endHourIntraday_ns").value = localStorage.getItem("ns_end_hour");
                    document.getElementById("endMinuteIntraday_ns").value = localStorage.getItem("ns_end_minute");
                }
            }

            function ThreeShifts (zEvent)
            {
                localStorage.setItem("shift_type","3shifts");

                document.getElementById("shift_menu").innerHTML =
                    '<div style="text-align:left;">Start Early: <select id="startHourIntraday_early" name="startHourIntraday1" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_early" name="startMinuteIntraday1" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End Early: <select id="endHourIntraday_early" name="startHourIntraday2" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_early" name="startMinuteIntraday2" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>' +
                    '<div style="text-align:left;">Start Late: <select id="startHourIntraday_late" name="startHourIntraday3" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_late" name="startMinuteIntraday3" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End Late: <select id="endHourIntraday_late" name="startHourIntraday4" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_late" name="startMinuteIntraday4" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>' +
                    '<div style="text-align:left;">Start Night: <select id="startHourIntraday_night" name="startHourIntraday5" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_night" name="startMinuteIntraday5" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End Night: <select id="endHourIntraday_night" name="startHourIntraday6" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_night" name="startMinuteIntraday6" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>';

                // Ustawiamy ustawienia według zapisanych zmiennych (dla przejrzystości konfiguracji)
                if(localStorage.getItem("early_start_hour") != null)
                {
                    document.getElementById("startHourIntraday_early").value = localStorage.getItem("early_start_hour");
                    document.getElementById("startMinuteIntraday_early").value = localStorage.getItem("early_start_minute");
                    document.getElementById("endHourIntraday_early").value = localStorage.getItem("early_end_hour");
                    document.getElementById("endMinuteIntraday_early").value = localStorage.getItem("early_end_minute");

                    document.getElementById("startHourIntraday_late").value = localStorage.getItem("late_start_hour");
                    document.getElementById("startMinuteIntraday_late").value = localStorage.getItem("late_start_minute");
                    document.getElementById("endHourIntraday_late").value = localStorage.getItem("late_end_hour");
                    document.getElementById("endMinuteIntraday_late").value = localStorage.getItem("late_end_minute");

                    document.getElementById("startHourIntraday_night").value = localStorage.getItem("night_start_hour");
                    document.getElementById("startMinuteIntraday_night").value = localStorage.getItem("night_start_minute");
                    document.getElementById("endHourIntraday_night").value = localStorage.getItem("night_end_hour");
                    document.getElementById("endMinuteIntraday_night").value = localStorage.getItem("night_end_minute");
                }
            }

            function FourShifts (zEvent)
            {
                localStorage.setItem("shift_type","4shifts");

                document.getElementById("shift_menu").innerHTML =
                    '<div style="text-align:left;">Start Early: <select id="startHourIntraday_early" name="startHourIntraday1" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_early" name="startMinuteIntraday1" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End Early: <select id="endHourIntraday_early" name="startHourIntraday2" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_early" name="startMinuteIntraday2" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>' +
                     '<div style="text-align:left;">Start Day: <select id="startHourIntraday_day" name="startHourIntraday7" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_day" name="startMinuteIntraday5" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End Day: <select id="endHourIntraday_day" name="startHourIntraday8" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_day" name="startMinuteIntraday6" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>' +
                    '<div style="text-align:left;">Start Late: <select id="startHourIntraday_late" name="startHourIntraday3" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_late" name="startMinuteIntraday3" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End Late: <select id="endHourIntraday_late" name="startHourIntraday4" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_late" name="startMinuteIntraday4" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>' +
                    '<div style="text-align:left;">Start Night: <select id="startHourIntraday_night" name="startHourIntraday5" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="startMinuteIntraday_night" name="startMinuteIntraday5" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select></br>' +
                    'End Night: <select id="endHourIntraday_night" name="startHourIntraday6" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option><option value="5">05</option><option value="6">06</option><option value="7">07</option><option value="8">08</option><option value="9">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select><select id="endMinuteIntraday_night" name="startMinuteIntraday6" class="cp-select no-expand "><option value="0" selected="selected">00</option><option value="1">15</option><option value="2">30</option><option value="3">45</option></select><hr>';

                // Ustawiamy ustawienia według zapisanych zmiennych (dla przejrzystości konfiguracji)
                if(localStorage.getItem("day_start_hour") != null)
                {
                    document.getElementById("startHourIntraday_early").value = localStorage.getItem("early_start_hour");
                    document.getElementById("startMinuteIntraday_early").value = localStorage.getItem("early_start_minute");
                    document.getElementById("endHourIntraday_early").value = localStorage.getItem("early_end_hour");
                    document.getElementById("endMinuteIntraday_early").value = localStorage.getItem("early_end_minute");

                    document.getElementById("startHourIntraday_late").value = localStorage.getItem("late_start_hour");
                    document.getElementById("startMinuteIntraday_late").value = localStorage.getItem("late_start_minute");
                    document.getElementById("endHourIntraday_late").value = localStorage.getItem("late_end_hour");
                    document.getElementById("endMinuteIntraday_late").value = localStorage.getItem("late_end_minute");

                    document.getElementById("startHourIntraday_night").value = localStorage.getItem("night_start_hour");
                    document.getElementById("startMinuteIntraday_night").value = localStorage.getItem("night_start_minute");
                    document.getElementById("endHourIntraday_night").value = localStorage.getItem("night_end_hour");
                    document.getElementById("endMinuteIntraday_night").value = localStorage.getItem("night_end_minute");

                    document.getElementById("startHourIntraday_day").value = localStorage.getItem("day_start_hour");
                    document.getElementById("startMinuteIntraday_day").value = localStorage.getItem("day_start_minute");
                    document.getElementById("endHourIntraday_day").value = localStorage.getItem("day_end_hour");
                    document.getElementById("endMinuteIntraday_day").value = localStorage.getItem("day_end_minute");
                }
            }

            document.getElementById("zapisz_button").addEventListener (
                "click", ButtonClick_zapisz, false
            );

            function ButtonClick_zapisz (zEvent)
            {
                if(localStorage.getItem("shift_type") == "2shifts")
                {
                    localStorage.setItem("ds_start_hour", document.getElementById("startHourIntraday_ds").value);
                    localStorage.setItem("ds_start_minute", document.getElementById("startMinuteIntraday_ds").value);
                    localStorage.setItem("ds_end_hour", document.getElementById("endHourIntraday_ds").value);
                    localStorage.setItem("ds_end_minute", document.getElementById("endMinuteIntraday_ds").value);

                    localStorage.setItem("ns_start_hour", document.getElementById("startHourIntraday_ns").value);
                    localStorage.setItem("ns_start_minute", document.getElementById("startMinuteIntraday_ns").value);
                    localStorage.setItem("ns_end_hour", document.getElementById("endHourIntraday_ns").value);
                    localStorage.setItem("ns_end_minute", document.getElementById("endMinuteIntraday_ns").value);
                }

                if(localStorage.getItem("shift_type") == "3shifts")
                {
                    localStorage.setItem("early_start_hour", document.getElementById("startHourIntraday_early").value);
                    localStorage.setItem("early_start_minute", document.getElementById("startMinuteIntraday_early").value);
                    localStorage.setItem("early_end_hour", document.getElementById("endHourIntraday_early").value);
                    localStorage.setItem("early_end_minute", document.getElementById("endMinuteIntraday_early").value);

                    localStorage.setItem("late_start_hour", document.getElementById("startHourIntraday_late").value);
                    localStorage.setItem("late_start_minute", document.getElementById("startMinuteIntraday_late").value);
                    localStorage.setItem("late_end_hour", document.getElementById("endHourIntraday_late").value);
                    localStorage.setItem("late_end_minute", document.getElementById("endMinuteIntraday_late").value);

                    localStorage.setItem("night_start_hour", document.getElementById("startHourIntraday_night").value);
                    localStorage.setItem("night_start_minute", document.getElementById("startMinuteIntraday_night").value);
                    localStorage.setItem("night_end_hour", document.getElementById("endHourIntraday_night").value);
                    localStorage.setItem("night_end_minute", document.getElementById("endMinuteIntraday_night").value);
                }

                if(localStorage.getItem("shift_type") == "4shifts")
                {
                    localStorage.setItem("early_start_hour", document.getElementById("startHourIntraday_early").value);
                    localStorage.setItem("early_start_minute", document.getElementById("startMinuteIntraday_early").value);
                    localStorage.setItem("early_end_hour", document.getElementById("endHourIntraday_early").value);
                    localStorage.setItem("early_end_minute", document.getElementById("endMinuteIntraday_early").value);

                    localStorage.setItem("late_start_hour", document.getElementById("startHourIntraday_late").value);
                    localStorage.setItem("late_start_minute", document.getElementById("startMinuteIntraday_late").value);
                    localStorage.setItem("late_end_hour", document.getElementById("endHourIntraday_late").value);
                    localStorage.setItem("late_end_minute", document.getElementById("endMinuteIntraday_late").value);

                    localStorage.setItem("night_start_hour", document.getElementById("startHourIntraday_night").value);
                    localStorage.setItem("night_start_minute", document.getElementById("startMinuteIntraday_night").value);
                    localStorage.setItem("night_end_hour", document.getElementById("endHourIntraday_night").value);
                    localStorage.setItem("night_end_minute", document.getElementById("endMinuteIntraday_night").value);

                    localStorage.setItem("day_start_hour", document.getElementById("startHourIntraday_day").value);
                    localStorage.setItem("day_start_minute", document.getElementById("startMinuteIntraday_day").value);
                    localStorage.setItem("day_end_hour", document.getElementById("endHourIntraday_day").value);
                    localStorage.setItem("day_end_minute", document.getElementById("endMinuteIntraday_day").value);
                }

                document.getElementById("menu_div").style.visibility = "hidden";
            }

            document.getElementById("czysc_button").addEventListener (
                "click", ButtonClick_czysc, false
            );

            function ButtonClick_czysc (zEvent)
            {
                localStorage.removeItem("ds_start_hour");
                localStorage.removeItem("ds_start_minute");
                localStorage.removeItem("ds_end_hour");
                localStorage.removeItem("ds_end_minute");

                localStorage.removeItem("ns_start_hour");
                localStorage.removeItem("ns_start_minute");
                localStorage.removeItem("ns_end_hour");
                localStorage.removeItem("ns_end_minute");

                localStorage.removeItem("early_start_hour");
                localStorage.removeItem("early_start_minute");
                localStorage.removeItem("early_end_hour");
                localStorage.removeItem("early_end_minute");

                localStorage.removeItem("late_start_hour");
                localStorage.removeItem("late_start_minute");
                localStorage.removeItem("late_end_hour");
                localStorage.removeItem("late_end_minute");

                localStorage.removeItem("night_start_hour");
                localStorage.removeItem("night_start_minute");
                localStorage.removeItem("night_end_hour");
                localStorage.removeItem("night_end_minute");

                localStorage.removeItem("day_start_hour");
                localStorage.removeItem("day_start_minute");
                localStorage.removeItem("day_end_hour");
                localStorage.removeItem("day_end_minute");

                //                 document.getElementById("startHourIntraday_ds").value = localStorage.getItem("ds_start_hour");
                //                 document.getElementById("startMinuteIntraday_ds").value = localStorage.getItem("ds_start_minute");
                //                 document.getElementById("endHourIntraday_ds").value = localStorage.getItem("ds_end_hour");
                //                 document.getElementById("endMinuteIntraday_ds").value = localStorage.getItem("ds_end_minute");

                //                 document.getElementById("startHourIntraday_ns").value = localStorage.getItem("ns_start_hour");
                //                 document.getElementById("startMinuteIntraday_ns").value = localStorage.getItem("ns_start_minute");
                //                 document.getElementById("endHourIntraday_ns").value = localStorage.getItem("ns_end_hour");
                //                 document.getElementById("endMinuteIntraday_ns").value = localStorage.getItem("ns_end_minute");
            }



            // Znikamy okienko z żółtą informacją
            if( document.getElementsByClassName("disclaimer")[0] != undefined)
            {
                document.getElementsByClassName("disclaimer")[0].style.display = "none"
            }

            var styl_dzien = 'background-image:url(https://drive-render.corp.amazon.com/view/nowaratn@/sun-icon.png);background-repeat:no-repeat;background-position:left;padding-left:26px;background-color:cornsilk;background-size:20px 20px;';
            var styl_noc = 'background-image:url(https://drive-render.corp.amazon.com/view/nowaratn@/moon-icon.png);background-repeat:no-repeat;background-position:left;padding-left:26px;background-color:skyblue;background-size:20px 20px;';
            var styl_late = 'background-image:linear-gradient(to right, cornsilk, skyblue);';

            var intradays_div = document.createElement ('div');
            intradays_div.id = "intradays_div";
            intradays_div.style = "display:contents;";

            if(localStorage.getItem("shift_type") == "2shifts")
            {
                intradays_div.innerHTML =
                    '<center style="float:left;">' +
                    '<input type="button" id="ds_wczoraj" value="Day Shift (yesterday)" class="cp-submit" style="float:left;font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="ns_wczoraj" value="Night Shift (yesterday)" class="cp-submit" style="float:left;font-size:11px;' + styl_noc + ';margin-bottom:10px;"><br>' +
                    '<input type="button" id="ds_dzisiaj" value="Day Shift (today)" class="cp-submit" style="float:left;font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="ns_dzisiaj" value="Night Shift (today)" class="cp-submit" style="float:left;font-size:11px;' + styl_noc + '">';

                setTimeout(function() {
                    document.getElementById("ds_wczoraj").addEventListener (
                        "click", ButtonClick_ds_wczoraj, false
                    );
                    document.getElementById("ns_wczoraj").addEventListener (
                        "click", ButtonClick_ns_wczoraj, false
                    );
                    document.getElementById("ds_dzisiaj").addEventListener (
                        "click", ButtonClick_ds_dzisiaj, false
                    );
                    document.getElementById("ns_dzisiaj").addEventListener (
                        "click", ButtonClick_ns_dzisiaj, false
                    );

                    TwoShifts();
                },500);
            }

            if(localStorage.getItem("shift_type") == "3shifts")
            {
                intradays_div.innerHTML =
                    '<center style="float:left;">' +
                    '<input type="button" id="early_wczoraj" value="Early Shift (yesterday)" class="cp-submit" style="font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="late_wczoraj" value="Late Shift (yesterday)" class="cp-submit" style="font-size:11px;' + styl_late + '">' +
                    '<input type="button" id="night_wczoraj" value="Night Shift (yesterday)" class="cp-submit" style="font-size:11px;' + styl_noc + ';margin-bottom:10px;"><br>' +

                    '<input type="button" id="early_dzisiaj" value="Early Shift (today)" class="cp-submit" style="font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="late_dzisiaj" value="Late Shift (today)" class="cp-submit" style="font-size:11px;' + styl_late + '">' +
                    '<input type="button" id="night_dzisiaj" value="Night Shift (today)" class="cp-submit" style="font-size:11px;' + styl_noc + '">';

                setTimeout(function() {
                    document.getElementById("early_wczoraj").addEventListener (
                        "click", ButtonClick_early_wczoraj, false
                    );
                    document.getElementById("early_dzisiaj").addEventListener (
                        "click", ButtonClick_early_dzisiaj, false
                    );
                    document.getElementById("late_wczoraj").addEventListener (
                        "click", ButtonClick_late_wczoraj, false
                    );
                    document.getElementById("late_dzisiaj").addEventListener (
                        "click", ButtonClick_late_dzisiaj, false
                    );
                    document.getElementById("night_wczoraj").addEventListener (
                        "click", ButtonClick_night_wczoraj, false
                    );
                    document.getElementById("night_dzisiaj").addEventListener (
                        "click", ButtonClick_night_dzisiaj, false
                    );

                    ThreeShifts();
                },500);
            }

            if(localStorage.getItem("shift_type") == "4shifts")
            {
                intradays_div.innerHTML =
                    '<center style="float:left;">' +
                    '<input type="button" id="early_wczoraj" value="Early Shift (yesterday)" class="cp-submit" style="font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="day_wczoraj" value="Day Shift (yesterday)" class="cp-submit" style="font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="late_wczoraj" value="Late Shift (yesterday)" class="cp-submit" style="font-size:11px;' + styl_late + '">' +
                    '<input type="button" id="night_wczoraj" value="Night Shift (yesterday)" class="cp-submit" style="font-size:11px;' + styl_noc + ';margin-bottom:10px;"><br>' +

                    '<input type="button" id="early_dzisiaj" value="Early Shift (today)" class="cp-submit" style="font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="day_dzisiaj" value="Day Shift (today)" class="cp-submit" style="font-size:11px;' + styl_dzien + '">' +
                    '<input type="button" id="late_dzisiaj" value="Late Shift (today)" class="cp-submit" style="font-size:11px;' + styl_late + '">' +
                    '<input type="button" id="night_dzisiaj" value="Night Shift (today)" class="cp-submit" style="font-size:11px;' + styl_noc + '">';

                setTimeout(function() {
                    document.getElementById("early_wczoraj").addEventListener (
                        "click", ButtonClick_early_wczoraj, false
                    );
                    document.getElementById("early_dzisiaj").addEventListener (
                        "click", ButtonClick_early_dzisiaj, false
                    );
                    document.getElementById("day_wczoraj").addEventListener (
                        "click", ButtonClick_day_wczoraj, false
                    );
                    document.getElementById("day_dzisiaj").addEventListener (
                        "click", ButtonClick_day_dzisiaj, false
                    );
                    document.getElementById("late_wczoraj").addEventListener (
                        "click", ButtonClick_late_wczoraj, false
                    );
                    document.getElementById("late_dzisiaj").addEventListener (
                        "click", ButtonClick_late_dzisiaj, false
                    );
                    document.getElementById("night_wczoraj").addEventListener (
                        "click", ButtonClick_night_wczoraj, false
                    );
                    document.getElementById("night_dzisiaj").addEventListener (
                        "click", ButtonClick_night_dzisiaj, false
                    );

                    FourShifts();
                },500);
            }

            document.getElementsByClassName("cp-submit-row")[0].appendChild(intradays_div);

            var temp = new Date();
            var temp2 = new Date();
            var dzisiaj = new Date();
            var wczoraj = new Date(temp2.setDate(temp2.getDate() - 1))
            var jutro = new Date(temp.setDate(temp.getDate() + 1))

            var dzisiaj_str;
            var wczoraj_str;
            var jutro_str;

            var dd = String(dzisiaj.getDate()).padStart(2, '0');
            var mm = String(dzisiaj.getMonth() + 1).padStart(2, '0');
            var yyyy = dzisiaj.getFullYear();

            var godzina = dzisiaj.getHours();
            if(godzina >=5 && godzina <=17)
            {
                // shift = "dzienna"
                if(localStorage.getItem("shift_type") == "2shift")
                {
                    document.getElementById("ds_dzisiaj").style.fontWeight = "900";
                }

            }
            else
            {
                // shift = "nocna"
                if(localStorage.getItem("shift_type") == "2shift")
                {
                    document.getElementById("ns_dzisiaj").style.fontWeight = "900";
                }

            }

            dzisiaj_str = yyyy + '/' + mm + '/' + dd;

            dd = String(wczoraj.getDate()).padStart(2, '0');
            mm = String(wczoraj.getMonth() + 1).padStart(2, '0');
            yyyy = wczoraj.getFullYear();

            wczoraj_str = yyyy + '/' + mm + '/' + dd;

            dd = String(jutro.getDate()).padStart(2, '0');
            mm = String(jutro.getMonth() + 1).padStart(2, '0');
            yyyy = jutro.getFullYear();

            jutro_str = yyyy + '/' + mm + '/' + dd;

            function ButtonClick_ds_wczoraj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = wczoraj_str;
                document.getElementById("endDateIntraday").value = wczoraj_str;
                document.getElementById("startHourIntraday").selectedIndex = ds_start_hour;
                document.getElementById("startMinuteIntraday").selectedIndex = ds_start_minute;
                document.getElementById("endHourIntraday").selectedIndex = ds_end_hour;
                document.getElementById("endMinuteIntraday").selectedIndex = ds_end_minute;
            }

            function ButtonClick_ns_wczoraj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = wczoraj_str;
                document.getElementById("endDateIntraday").value = dzisiaj_str;
                document.getElementById("startHourIntraday").selectedIndex = ns_start_hour;
                document.getElementById("startMinuteIntraday").selectedIndex = ns_start_minute;
                document.getElementById("endHourIntraday").selectedIndex = ns_end_hour;
                document.getElementById("endMinuteIntraday").selectedIndex = ns_end_minute;
            }

            function ButtonClick_ds_dzisiaj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = dzisiaj_str;
                document.getElementById("endDateIntraday").value = dzisiaj_str;
                document.getElementById("startHourIntraday").selectedIndex = ds_start_hour;
                document.getElementById("startMinuteIntraday").selectedIndex = ds_start_minute;
                document.getElementById("endHourIntraday").selectedIndex = ds_end_hour;
                document.getElementById("endMinuteIntraday").selectedIndex = ds_end_minute;
            }

            function ButtonClick_ns_dzisiaj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = dzisiaj_str;
                document.getElementById("endDateIntraday").value = jutro_str;
                document.getElementById("startHourIntraday").selectedIndex = ns_start_hour;
                document.getElementById("startMinuteIntraday").selectedIndex = ns_start_minute;
                document.getElementById("endHourIntraday").selectedIndex = ns_end_hour;
                document.getElementById("endMinuteIntraday").selectedIndex = ns_end_minute;
            }

            //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// ////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// ////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// ////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// ////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// //////////////////////////////////////////////////////// ////////////////////////////////////////////////////////

            function ButtonClick_early_dzisiaj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = dzisiaj_str;
                document.getElementById("endDateIntraday").value = dzisiaj_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("early_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("early_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("early_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("early_end_minute");
            }

            function ButtonClick_early_wczoraj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = wczoraj_str;
                document.getElementById("endDateIntraday").value = wczoraj_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("early_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("early_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("early_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("early_end_minute");
            }

            function ButtonClick_day_dzisiaj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = dzisiaj_str;
                document.getElementById("endDateIntraday").value = dzisiaj_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("day_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("day_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("day_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("day_end_minute");
            }

            function ButtonClick_day_wczoraj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = wczoraj_str;
                document.getElementById("endDateIntraday").value = wczoraj_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("day_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("day_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("day_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("day_end_minute");
            }


            function ButtonClick_late_dzisiaj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = dzisiaj_str;
                document.getElementById("endDateIntraday").value = dzisiaj_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("late_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("late_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("late_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("late_end_minute");
            }

            function ButtonClick_late_wczoraj(zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = wczoraj_str;
                document.getElementById("endDateIntraday").value = wczoraj_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("late_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("late_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("late_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("late_end_minute");
            }


            function ButtonClick_night_dzisiaj (zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = dzisiaj_str;
                document.getElementById("endDateIntraday").value = jutro_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("night_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("night_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("night_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("night_end_minute");
            }


            function ButtonClick_night_wczoraj(zEvent)
            {
                if(document.getElementsByName("spanType").length > 0)
                {
                    document.getElementsByName("spanType")[document.getElementsByName("spanType").length-1].checked = true;
                }
                document.getElementById("startDateIntraday").value = wczoraj_str;
                document.getElementById("endDateIntraday").value = dzisiaj_str;
                document.getElementById("startHourIntraday").selectedIndex = localStorage.getItem("night_start_hour");
                document.getElementById("startMinuteIntraday").selectedIndex = localStorage.getItem("night_start_minute");
                document.getElementById("endHourIntraday").selectedIndex = localStorage.getItem("night_end_hour");
                document.getElementById("endMinuteIntraday").selectedIndex = localStorage.getItem("night_end_minute");
            }



            // Zatrzymujemy sprawdzanie strony
            var elem = document.querySelector('table[role="presentation"]');
            elem.style.width = "";
            clearInterval(interval);
        }
    }
},100);


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
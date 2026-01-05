// ==UserScript==
// @name         AMT Searchbar
// @namespace    http://i.imgur.com/UNrCfvr.gif
// @version      1.01
// @description  A Simple Mturk/Greasyfork/MTG search bar
// @author       Ethraiel
// @contributor  R.Daneel
// @include      *.mturkgrind.*
// @include      *.reddit.*
// @include      *.mturk.*
// @require      https://code.jquery.com/jquery-3.0.0-alpha1.min.js
// @downloadURL https://update.greasyfork.org/scripts/21250/AMT%20Searchbar.user.js
// @updateURL https://update.greasyfork.org/scripts/21250/AMT%20Searchbar.meta.js
// ==/UserScript==
//press backtick [`] to toggle the searchbar
var theme_no = "0";//***0******1*******2******3*******4************5*******the names of the themes are below their respective numbers because im lazy :P
var theme_name = ["Custom","Dark","Frost","Mint","Ole'Greg","Dark_plain","",""];//set the theme_no to set the theme...
var search = "";//This is a default value for the searchbar, i.e. "survey" will make "survey" appear when you bring up the searchbar.
var minpay = ("0.00");//Same as above, but for the minimum pay field.
var qual = "false";//Set to "true" to automatically check the box "Qualled For" everytime you bring up the searchbar. *note any string other than "true" will return false.
var master = "false";//Same as above but for "Masters Only"

if ( localStorage.getItem("AMTSBtheme") ) {
    theme_no = localStorage.getItem("AMTSBtheme");
}

if (theme_no == "0"){
var panel_bg = "white";//CUSTOM********[theme_no = 0]*************CUSTOM
var text_color = "black";//sets the text color*note the above var sets the panel background color
var border_color = "grey";//the color of all the borders
var text_bg = "white";//sets the textfield background color
var button_bg = "white";//sets the button background color
var button_hover ="white";//sets the color of the button when hovered over
var button_hover_text = "blue";//sets the color of the text when the button is hovered over
var greyed_out_payfield_bg = "grey";//sets the color of the minpay field when disabled
}

else if (theme_no == 1){//Dark**********[ theme_no = 1 ]****************Dark
var panel_bg = "-webkit-linear-gradient(top,rgb(67, 66, 66) 0,rgb(32, 32, 32) 100%) repeat-y; background: -moz-linear-gradient(top,rgb(67, 66, 66) 0,rgb(32, 32, 32) 100%) repeat-y";
var text_bg = "-webkit-linear-gradient(top,rgb(56, 56, 56) 0,rgb(25, 25, 25) 100%) repeat-x; background: -moz-linear-gradient(top,rgb(56, 56, 56) 0,rgb(25, 25, 25) 100%) repeat-x";
var button_bg = "-webkit-linear-gradient(top,rgb(84, 83, 83) 0,rgb(48, 48, 48) 100%) repeat-x; background: -moz-linear-gradient(top,rgb(84, 83, 83) 0,rgb(48, 48, 48) 100%) repeat-x";
var border_color = "rgb(15, 15, 22)";
var text_color = "rgb(12, 144, 195)";
var button_hover ="-webkit-linear-gradient(top,rgb(85, 91, 101) 0,rgb(48, 48, 48) 100%) repeat-x; background: -moz-linear-gradient(top,rgb(85, 91, 101) 0,rgb(48, 48, 48) 100%) repeat-x";
var button_hover_text = "rgb(30, 165, 220)";
var greyed_out_payfield_bg = "rgb(60, 45, 45)";
}
else if (theme_no == 2){//Frost**********[ theme_no = 2 ]****************Frost
var panel_bg = "-webkit-linear-gradient(top,rgb(225, 244, 251) 0,rgb(121, 190, 255) 100%) repeat-x; background: -moz-linear-gradient(top,rgb(225, 244, 251) 0,rgb(121, 190, 255) 100%) repeat-x";
var text_bg = "-webkit-linear-gradient(top,rgb(241, 241, 241) 0,rgb(198, 216, 232) 100%) repeat-x !important; background: -moz-linear-gradient(top,rgb(241, 241, 241) 0,rgb(198, 216, 232) 100%) repeat-x !important";
var button_bg = "-webkit-linear-gradient(top,rgba(151, 182, 250, 0.97) 0,rgb(51, 95, 162) 100%) repeat-x; background: -moz-linear-gradient(top,rgba(151, 182, 250, 0.97) 0,rgb(51, 95, 162) 100%) repeat-x";
var border_color = "rgb(70, 110, 180)";
var text_color = "rgb(0, 57, 79)";
var button_hover ="-webkit-linear-gradient(top,rgba(175, 195, 255, 0.97) 0,rgb(70, 110, 180) 100%) repeat-x; background: -moz-linear-gradient(top,rgba(175, 195, 255, 0.97) 0,rgb(70, 110, 180) 100%) repeat-x";
var button_hover_text = "rgb(1, 69, 85)";
var greyed_out_payfield_bg = "rgb(210, 145, 145)";
}
else if (theme_no == 3){//Mint**********[ theme_no = 3 ]****************Mint
var panel_bg = "-webkit-linear-gradient(top,rgb(176, 251, 170) 0,rgb(142, 255, 151) 100%) repeat-x; background: -moz-linear-gradient(top,rgb(176, 251, 170) 0,rgb(142, 255, 151) 100%) repeat-x";
var text_bg = "-webkit-linear-gradient(top,rgba(233, 249, 235, 0.97) 0,rgb(245, 179, 234) 100%) repeat-x; background: -moz-linear-gradient(top,rgba(233, 249, 235, 0.97) 0,rgb(245, 179, 234) 100%) repeat-x";
var button_bg = "-webkit-linear-gradient(top,rgba(255, 200, 236, 0.97) 0,rgb(255, 108, 231) 100%) repeat-x; background: -moz-linear-gradient(top,rgba(255, 200, 236, 0.97) 0,rgb(255, 108, 231) 100%) repeat-x";
var border_color = "rgb(6, 170, 53)";
var text_color = "rgb(116, 27, 81)";
var button_hover ="-webkit-linear-gradient(top,rgba(255, 200, 236, 0.97) 0,rgb(255, 125, 255) 100%) repeat-x; background: -moz-linear-gradient(top,rgba(255, 200, 236, 0.97) 0,rgb(255, 125, 255) 100%) repeat-x";
var button_hover_text = "rgb(196, 47, 138)";
var greyed_out_payfield_bg = "rgb(150, 190, 75)";
}
else if (theme_no == 4){//Ole'Gregg**********[ theme_no = 4 ]****************Ole'Gregg
var panel_bg = "-webkit-linear-gradient(top,rgb(236, 69, 236) 0,rgb(159, 37, 119) 100%) repeat-x; background: -moz-linear-gradient(top,rgb(236, 69, 236) 0,rgb(159, 37, 119) 100%) repeat-x";
var text_bg = "-webkit-linear-gradient(top,rgba(158, 230, 79, 0.97) 0,rgb(143, 194, 141) 100%); background: -moz-linear-gradient(top,rgba(158, 230, 79, 0.97) 0,rgb(143, 194, 141) 100%)";
var button_bg = "-webkit-linear-gradient(top,rgba(130, 191, 64, 0.97) 0,rgb(10, 148, 4) 100%) repeat-x; background: -moz-linear-gradient(top,rgba(130, 191, 64, 0.97) 0,rgb(10, 148, 4) 100%) repeat-x";
var border_color = "rgb(48, 94, 48)";
var text_color = "rgb(75, 25, 75)";
var button_hover ="-webkit-linear-gradient(top,rgba(145, 210, 79, 0.97) 0,rgb(27, 159, 10) 100%) repeat-x; background: -moz-linear-gradient(top,rgba(145, 210, 79, 0.97) 0,rgb(27, 159, 10) 100%) repeat-x";
var button_hover_text = "rgb(55, 99, 55)";
var greyed_out_payfield_bg = "rgb(100, 55, 100)";
}
else if (theme_no == 5){//Dark_plain**********[ theme_no = 5 ]****************Dark_plain
var panel_bg = "rgb(45, 45, 45)";
var text_bg = "rgb(30, 30, 30)";
var button_bg = "rgb(40, 40, 40)";
var border_color = "rgb(15, 15, 22)";
var text_color = "rgb(12, 144, 195)";
var button_hover ="rgb(45, 45, 55)";
var button_hover_text = "rgb(30, 165, 220)";
var greyed_out_payfield_bg = "rgb(60, 45, 45)";
}
//note you can also add new custom themes here... simply add another "else if (theme_no == [your theme number]){" then copy and paste your custom theme under it and dont forget to add the closing "}"

var textfield_focus =  "";//".eJtextfields:focus {box-shadow: 0px 0px 7px 1.5px rgba(15, 15, 20, 0.75);}";(this is a style that i'd like to have on some themes and not on others... just replace "" with what comes after //)

//you can play with some of the finer details below, note that any changes you make will apply to all themes
var theme =`<style id= "Theme_No.`+theme_no+`" name="`+theme_name[theme_no]+`">
.eJmain {
    position: relative;
    color: `+text_color+`;
    box-sizing: initial;
    border-radius: 2em;
    font: bold 15px Arial;
    margin: 0;
    outline: none !important;
    padding: 2px !important;
    min-height: 0px;
    text-align: left;

}

.eJpanel {
    height: 85px;
    width: 440px;
    background: `+panel_bg+`;
    border: 2.5px solid `+border_color+`;
    box-shadow: 5px 7px 5px 3px rgba(15, 15, 20, 0.72);
    transition-property: height;
    transition-duration: 0.65s;
}

.eJtop_row {
    width: 500px;
    position: relative;
    top: 20px;
    left: 7.5px;
}

.eJtextfields {
    height: 18px;
    background: `+text_bg+` !important;
    border: .5px solid `+border_color+`;
    box-shadow: inset 0px 4px 6px -2px rgba(15, 15, 20, 0.8);
    font-stretch: normal;
    transition-property: border, background, box-shadow;
    transition-duration: 1s;
}
`+textfield_focus+`
.eJalign_right {
    text-align: right;
}

.eJbutton {
    height: 18px;
    width: 75px;
    background: `+button_bg+`;
    border: 0px solid `+border_color+`;
    box-shadow: 1.5px 1.5px 2px 1px rgba(15, 15, 20, 0.75);
    text-align: center;
}

.eJbutton:hover {
    box-shadow: 1.5px 2px 2px 1px rgba(15, 15, 20, 0.55);
    background: `+button_hover+`;
    color: `+button_hover_text+`;
    cursor:pointer;
}

.eJbutton:active {
    box-shadow: 1px 1px 0px 0px rgba(15, 15, 20, 0.55);
}

.eJtoggle_button {
    height: 15px;
    width: 15px;
}

.eJsecond_row {
    position: relative;
    top: 15px;
    left: 215px;
}

.eJanimate {
    height: 165px;
}

.eJsmallfont {
    font: bold 12px Arial;
    position: relative;
    top: 25px;
    left: 20px;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 1s;
}

.eJcheckbox {
    height: 14px;
    width: 14px;
    margin-left 15px;
    vertical-align: middle;
}

.eJdrop_menu {
    height: 18px;
    width: 100px;
    position: relative;
    top: 12.5px;
    left: 235px;
    opacity: 1;
    transition-property: opacity, display;
    transition-duration: 1s;
}
.eJdisable {
    background: `+greyed_out_payfield_bg+` !important;
    box-shadow: 0px 0px 0px 0px rgba(1, 1, 1, 0.0);
    border: none;
}

.eJhidden_menu {
    opacity: 0;
}

</style>`;


var AMT_Searchbar =/*div structure-you should only have to edit the theme dropdown menu if you want to add a theme to that menu*/`
<div id="eJAMTcapsule" class="cap" style="position: fixed; top: 24%; left: 31%; z-index: 3; display: none;">

     <div id="eJmain_panel" class="eJmain eJpanel">

        <div id="eJhomebar" class="eJtop_row">

            <input type="text" id="eJsearch_field" class="eJmain eJtextfields" size="30">
            <input type="text" id="eJpay_field" class="eJmain eJtextfields eJalign_right" size="3">
            <button type="button" id="eJsearch_button" class="eJmain eJbutton">Search</button>

                <div style="height: 1px;">
                    <select name="eJdropdown" id="eJgreasy_drop" class="eJmain eJtextfields eJdrop_menu eJhidden_menu">
                    <option value="">Relevance</option>
                    <option value="&sort=daily_installs">Daily Installs</option>
                    <option value="&sort=total_installs">Total Installs</option>
                    <option value="&sort=ratings">Ratings</option>
                    <option value="&sort=created">Created Date</option>
                    <option value="&sort=updated">Updated Date</option>
                    <option value="&sort=name">Name</option>
                    </select>
                </div>

        </div></br>

            <button type="button" id="eJanimate_button" class="eJmain eJbutton eJtoggle_button eJsecond_row">⇕</button>

        <div id="eJchecks" class="eJsmallfont eJhidden_menu">
            <input type="checkbox" id="eJqual_box" class="eJmain eJcheckbox" value="Qualed"> Qualified For
            <span style="display:inline-block; width: 180px;"></span>
            Search GreasyFork  <input type="checkbox" id="eJgreasy_box" class="eJmain eJcheckbox eJalign_right" value="urls"></br>
            <input type="checkbox" id="eJmaster_box" class="eJmain eJcheckbox" value="Masters"> Masters Only
            <span style="display:inline-block; width: 218px;"></span>
            Search MTG  <input type="checkbox" id="eJMTG_box" class="eJmain eJcheckbox eJalign_right" value="urls"></br></br>
            <button type="button" id="eJtheme_button" class="eJmain eJbutton eJtoggle_button"><img src="http://i.imgur.com/dvGS1s8.png"></button>
                    <select name="eJ1dropdown" id="eJtheme_drop" class="eJmain eJtextfields eJhidden_menu">
                    <option value="`+theme_no+`">`+theme_name[theme_no]+`</option>
                    <option value="0">`+theme_name[0]+`</option>
                    <option value="1">`+theme_name[1]+`</option>
                    <option value="2">`+theme_name[2]+`</option>
                    <option value="3">`+theme_name[3]+`</option>
                    <option value="4">`+theme_name[4]+`</option>
                    <option value="5">`+theme_name[5]+`</option>
                    </select>
        </div>

     </div>

</div>
;`;

$("head").append($(theme));
$("body").append($(AMT_Searchbar));
$("#eJgreasy_drop").prop("disabled", true);
$("#eJtheme_drop").prop("disabled", true);

var search1 = "";//Using the var "search" as a default would not work without this var. neither would using "" as a defualt clear the searchbar on toggle
var eJflag1 = -1;//flag used to control the dropdown of the hidden menu
var inject_search = "";//general var that will carry any of the URLs required for search

$.fn.extend({valid_num: function() {//to escape the minpay field of any invalid characters *Thanks R.Daneel*
    vn = this.val().replace(/[^\d\.]/g, '');
        return (vn.length > 0 && /\d/.test(vn)) ? vn : minpay;
}});

$.fn.extend({valid_srch: function() {//to make sure there are not just spaces typed into the searchbar (probably not needed, but i like it)
    vs = this.val();
        return (vs.trim().length > 0) ? vs : search;
}});

$.fn.extend({box_manager: function() {//this is important... it manages the url injection for "qualed" and "masters" as well as assigning the var "inject_search" with the proper URL later on
    cb = this.prop("checked");
    if ($(this).attr("id") === "eJqual_box"){
        return (cb === true) ? "qualifiedFor=on" : "";
    }
    else if ($(this).attr("id") === "eJmaster_box"){
        return (cb === true) ? "requiresMasterQual=on" : "";
    }
    else if ($(this).attr("id") === "eJgreasy_box"){
        return (cb === true) ? "https://greasyfork.org/en/scripts/search?q="+($("#eJsearch_field").valid_srch())+""+($("#eJgreasy_drop").val()) : "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords="+$("#eJsearch_field").valid_srch()+"&minReward="+$("#eJpay_field").valid_num()+"&"+$("#eJqual_box").box_manager()+"&"+$("#eJmaster_box").box_manager();
    }
    else if ($(this).attr("id") === "eJMTG_box"){
        return (cb === true) ? "http://www.mturkgrind.com/search/7230196/?q="+($("#eJsearch_field").valid_srch())+"&o=date" : inject_search;
    }
}});

$(document).keydown(function(e){//toggle function--- press[`] (backtick) to toggle the searchbar *note this is also responsible for applying most of the default values
     if (e.which == 192) {
         search1 = search;
       if (qual == "true"){
           $("#eJqual_box").prop("checked", true);
       }
       if (master == "true"){
           $("#eJmaster_box").prop("checked", true);
       }
       if (window.getSelection().toString() !== ""){//this will paste whatever you have selected on the page into the searchbar when you press the toggle button (select a requester name in the forum, then toggle the searchbar and the name will already be in the searchbar)
           search1 = window.getSelection().toString();
       }
         $("#eJsearch_field").val(search1);
         $("#eJpay_field").prop("readonly") === true ? $("#eJpay_field").val("") : $("#eJpay_field").val(minpay);
         $("#eJAMTcapsule").toggle();
         (e.preventDefault());
         $("#eJsearch_field").focus();//this can be changed to ".select();" to select all the text in the searchfield as you toggle the searchbar
     }
});

$(".eJcheckbox").click(function(e){//this messy logic makes sure that, when you change which site you want to search, the proper things happen...i.e. disabling the minpay field, toggling the hidden dropmenu... 
    if ($(this).attr("id") === "eJgreasy_box") {//this manages the greasyfork checkbox and everything that happens when you click it
        if (eJflag1 == 1) {
            $(this).prop("checked") === true ? ($("#eJpay_field").addClass("eJdisable").val("").prop("readonly", true)) : ($("#eJpay_field").removeClass("eJdisable").val(minpay).prop("readonly", false));
            $("#eJgreasy_drop").prop("disabled") === true ? ($("#eJgreasy_drop").prop("disabled", false).toggleClass("eJhidden_menu")) : ($("#eJgreasy_drop").prop("disabled", true).toggleClass("eJhidden_menu"));
            $("#eJMTG_box").prop("checked", false);
        }
        else (e.preventDefault());
    }
    if ($(this).attr("id") === "eJMTG_box") {//this manages the MTG checkbox and everything that happens when you click it
        if (eJflag1 == 1) {
            $(this).prop("checked") === true ? ($("#eJpay_field").addClass("eJdisable").val("").prop("readonly", true)) : ($("#eJpay_field").removeClass("eJdisable").val(minpay).prop("readonly", false));
            $("#eJgreasy_drop").prop("disabled") === true ?  $("#eJgreasy_drop").prop("disabled", true) : ($("#eJgreasy_drop").prop("disabled", true).toggleClass("eJhidden_menu"));
            $("#eJgreasy_box").prop("checked", false);
        }
        else (e.preventDefault());
    }
});


$(".eJbutton").click(function(e){//this makes things happen when you click any button
    if ($(this).attr("id") === "eJsearch_button") {//this is the search button
        inject_search = $("#eJgreasy_box").box_manager();
        inject_search = $("#eJMTG_box").box_manager();
        $("#eJAMTcapsule").toggle();
        window.open(inject_search);
    }
    if ($(this).attr("id") === "eJtheme_button") {//this is the theme changing button, click once to bring up the drop menu and select your theme, click again to save your theme...*note the line directly beneath this one places the text in the search bar when you click the theme button, you can change this text to whatever you like.
        $("#eJtheme_drop").prop("disabled") === true ? $("#eJsearch_field").val("Press again to save your theme...") : $("#eJsearch_field").val("Please refresh the page");
        $("#eJtheme_drop").prop("disabled") === true ? $("#eJtheme_drop").toggleClass("eJhidden_menu").prop("disabled", false) : $("#eJtheme_drop").toggleClass("eJhidden_menu").prop("disabled", true);
        localStorage.AMTSBtheme = $("#eJtheme_drop").val();
    }
    if ($(this).attr("id") === "eJanimate_button") {//this is the hidden menu toggle button
        if (eJflag1 == -1) {
            $("#eJmain_panel").toggleClass("eJanimate");
            setTimeout(function(){$(".eJsmallfont").toggleClass("eJhidden_menu");}, 500);
            eJflag1 = (eJflag1)*-1;
        }
            else {
                $(".eJsmallfont").toggleClass("eJhidden_menu");
                setTimeout(function(){$("#eJmain_panel").toggleClass("eJanimate");}, 650);
                eJflag1 = (eJflag1)*-1;
        }
    }
});

$(".eJtextfields").keyup(function(e){//this makes things happen when you press enter in a searchfield
    if (e.which == 13) {
      inject_search = $("#eJgreasy_box").box_manager();
      inject_search = $("#eJMTG_box").box_manager();
      $("#eJAMTcapsule").toggle();
      window.open(inject_search);
    }
});

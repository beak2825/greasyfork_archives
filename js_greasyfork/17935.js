// ==UserScript==
// @name         Artemis HIT Scraper
// @namespace    mobiusevalon.tibbius.com
// @version      1.0
// @author       Mobius Evalon <mobiusevalon@tibbius.com>
// @description  Various functions for scraping and hoarding HITs on Mechanical Turk
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @match        http://www.w3schools.com
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/17935/Artemis%20HIT%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/17935/Artemis%20HIT%20Scraper.meta.js
// ==/UserScript==

// basically only for internal use, put up here just so it's nearby the userscript @version
var artemis_version = "1.0";

/*
software license
    Original Artemis software developed by Ben "Mobius Evalon" Rothe.

    http://creativecommons.org/licenses/by-sa/4.0/

    Artemis is licensed under the attribution-share alike 4.0 creative commons license.  In short,
    this means that you are free to redistribute the software and/or edit it in any way as long as:
    -    all redistributions, edits, and forks use the same attribution 4.0 license
    -    all resources are properly attributed (credit given where due)
    -    all previous iterations of this block of attributions remains at the top of the file
         in their original unedited form and are included with all redistributions, edits, and
         forks

jQuery 1.12.4
    author:    Dave Methvin, et al.  <https://jquery.org/team/>
    file:      https://code.jquery.com/jquery-1.12.4.min.js
    license:   MIT                   <https://tldrlegal.com/license/mit-license>

jQuery UI 1.11.4
    author:    Scott Gonzalez, et al.<http://jqueryui.com/about/#jquery-ui-team>
    file:      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
    license:   MIT                   <https://tldrlegal.com/license/mit-license>

FontAwesome 4.6.3
    author:    Dave Gandy            <http://fontawesome.io/>
    file:      https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css
    license:   various               <http://fortawesome.github.io/Font-Awesome/license/>

Droid Sans
    author:    Steve Matteson        <https://profiles.google.com/107777320916704234605/about>
    file:      https://fonts.googleapis.com/css?family=Droid+Sans:400,700
    license:   Apache 2.0            <http://www.apache.org/licenses/LICENSE-2.0.html>

"panda accepted" sound
    author:    KIZILSUNGUR           <http://freesound.org/people/KIZILSUNGUR/>
    file:      SweetAlertSound1      <http://freesound.org/people/KIZILSUNGUR/sounds/72125/>
    license:   public domain         <http://creativecommons.org/publicdomain/zero/1.0/>
    edits:     reduced to monoaural 16 bit from stereo 32 bit to reduce file size

"alert" sound
    author:    KIZILSUNGUR           <http://freesound.org/people/KIZILSUNGUR/>
    file:      SweetAlertSound2      <http://freesound.org/people/KIZILSUNGUR/sounds/72126/>
    license:   public domain         <http://creativecommons.org/publicdomain/zero/1.0/>
    edits:     sample format reduced from 32 to 16 bits to reduce file size

"error" sound
    author:    Bertrof               <http://freesound.org/people/Bertrof/>
    file:      Game Sound Wrong.wav  <http://freesound.org/people/Bertrof/sounds/131657/>
    license:   attribution           <http://creativecommons.org/licenses/by/3.0/>
    edits:     reduced to monoaural 16 bit from stereo 32 bit to reduce file size; clipped to
               0.9 seconds
*/

// css_fluid contains the definitions that can change based on interaction with the settings dialog and via importing.  by separating
// these from the rest of the css, we're minimizing the size of the string that the text replace functions are used on later.
// all text inside angle braces directly map to properties in the object that is created when appearance settings are changed, imported,
// or loaded.
var css_fluid = "#artemis {font-family: [font_family]; font-size: [font_size]; background-color: [app_bg_color]; width: 300px; min-width: 300px; height: 100vh; overflow-y: hidden;} "+
    "#artemis #header {background-color: [app_title_color]; color: [app_text_color]; width: 100%; text-align: center; font-weight: bold; font-size: 125%; height: 28px; line-height: 28px; clear: right;} "+
    "#artemis #header .left_controls .button, #artemis #header .right_controls .button {border-color: [app_text_color]; width: 28px; height: 28px; line-height: 28px; font-size: 125%;} "+
    ".menu {background-color: [menu_bg_color]; color: [menu_text_color]; list-style-type: none; position: absolute !important; padding: 5px; min-width: 100px; border-radius: 0px 8px 8px 8px; z-index: 210; margin: 0px;} "+
    ".dialog {background-color: [dialog_bg_color]; color: [dialog_text_color]; border-color: [dialog_text_color]; padding: 5px; z-index: 185;} "+
    "#heads-up {background-color: [alert_bg_color]; color: [alert_text_color]; width: 200px; z-index: 205;} "+
    "#help {z-index: 190; background-color: [dialog_bg_color];} "+
    ".watcher_group, .ui-group-placeholder {background-color: [group_bg_color]; border: 1px solid [group_title_color]; border-radius: 0px 0px 8px 8px; padding: 0px; margin: 4px;} "+
    ".watcher_group .title {background-color: [group_title_color]; color: [group_text_color]; clear: right; display: inline-block; text-align: center; margin: auto 0px; font-size: 110%; width: 100%; height: 24px; line-height: 24px; font-weight: bold; position: relative;}"+
    ".watcher_group .title .left_controls .button, .watcher_group .title .right_controls .button {border-color: [group_text_color]; width: 24px; height: 24px; line-height: 24px; font-size: 110%;} "+
    ".watcher, .ui-watcher-placeholder {background-color: [watcher_bg_color]; color: [watcher_text_color]; overflow: hidden; clear: both; margin: 2px 0px; padding: 2px; border-radius: 3px;} "+
    ".watcher .controls {float: right; margin: 0px 0px 0px 2px; border-left: 1px solid [watcher_text_color]; padding: 0px 0px 0px 2px;} "+
    ".watcher .controls span {width: [font_size]; height: [font-size]; text-align: center; line-height: [font-size];} ",
    // css_static definitions are tacked onto the end of the style element after all of the angle-brace properties are replaced in css_fluid.
    // the entire contents of this variable must be valid css
    css_static = "body {padding: 0px; margin: 0px;} "+
    ".button {background-color: transparent; text-align: center; margin: 1px; display: inline-block; cursor: pointer;} "+
    "#interface {padding-bottom: 1px; overflow-y: auto; max-height: 95vh; width: 100%;} "+
    ".menu .item, .menu .divider {margin: 6px 0px; clear: both;} "+
    ".menu .divider {height: 7px;} "+
    ".menu .item {height: 14px; cursor: pointer; opacity: 0.5;} "+
    ".menu .item:hover {opacity: 1;} "+
    ".menu .item .icon {float: left; margin-right: 5px; display: inline-block; width: 15px; text-align: center;} "+
    ".floats {border-radius: 8px; border: 2px solid #000000; max-height: 550px; position: absolute !important;} "+
    ".dialog.narrow {width: 300px; min-width: 300px;} "+
    ".dialog.wide {width: 500px; min-width: 500px;} "+
    ".dialog .explain {margin-bottom: 5px;} "+
    ".dialog .scrolling-content {max-height: 350px; overflow-y: auto;} "+
    ".dialog .actions {margin: 10px auto 0px auto; padding: 0px; text-align: center; display: block;} "+
    ".dialog .actions input:not(:last-of-type) {margin-right: 15px;} "+
    ".dialog .head {padding: 0px; margin: 0px auto 10px auto; font-size: 150%; font-weight: bold; width: 100%; text-align: center; cursor: move;} "+
    ".dialog .input_group {margin: 5px 0px;} "+
    ".dialog .sequential {margin-left: 10px;} "+
    ".dialog .indent {margin-left: 20px;} "+
    ".dialog input.textbox {height: 18px; line-height: 18px;} "+
    ".dialog input.freeform {width: 200px;} "+
    ".dialog input.number {width: 50px;} "+
    ".dialog input.radio {width: 16px; height: 16px; line-height: 16px; text-align: center;} "+
    ".dialog label.textbox {height: 18px; line-height: 18px;} "+
    ".dialog label.radio {height: 16px; line-height: 16px;} "+
    "#edit_watcher label.fixed, #edit_group label.fixed {display: inline-block; width: 60px;} "+
    "#text_input label.fixed {display: inline-block; width: 90px;} "+
    "#text_input {width: 400px; min-width: 300px; z-index: 195;} "+
    "#ti_input {width: 395px; height: 125px;} "+
    "#heads-up .explain, #text_input .explain {text-align: center; width: 100%;} "+
    "#settings fieldset {margin-bottom: 10px;} "+
    "#settings fieldset legend .collapses_content {margin: 0px 6px; font-size: 125%;} "+
    "#settings fieldset legend .field_title {font-size: 125%;} "+
    "#settings fieldset legend .button {width: 20px; height: 20px; line-height: 20px; margin-right: 5px;} "+
    "#settings fieldset#color_settings label {display: inline-block; width: 130px;} "+
    "#settings fieldset#color_settings input.color {display: inline-block; width: 145px;} "+
    "#settings fieldset#sound_settings label {display: inline-block; width: 75px;} "+
    ".left_controls {float: left; overflow: hidden;} "+
    ".right_controls {float: right; overflow: hidden;} "+
    ".watcher_list {list-style-type: none; margin: 0px; min-height: 20px; padding: 2px 4px;}"+
    ".watcher .controls span:nth-child(odd):not(:last-of-type) {margin-right: 2px;} "+
    ".information {color: #ffffff; width: 18px; height: 18px; line-height: 18px; text-align: center; font-weight: bold; font-size: 120%; margin-left: 6px; cursor: help; display: inline-block;}"+
    ".help {color: #7676c4;} "+
    ".danger {color: #c47676;} "+
    ".test {color: #62a362; cursor: pointer;} "+
    "#edit_watcher .information, #edit_group .information {position: absolute; right: 4px;} "+
    "#edit_watcher .half, #edit_group .half {display: inline-block; text-align: center; width: 50%;} "+
    ".topic {text-decoration: underline; opacity: 0.7; cursor: pointer;} "+
    "#help ul {margin: 0px 0px 10px 0px;} "+
    "#help ul.attrib {list-style-type: none;} "+
    "#fallthrough {position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px; min-width: 100vw; min-height: 100vh; z-index: 200; display: none;} "+
    "h3 {font-size: 150%; font-weight: bold; padding: 0px; margin: 20px 0px 10px 0px;} "+
    ".spin {animation-name: spin; animation-duration: 1500ms; animation-iteration-count: infinite; animation-timing-function: linear;} "+
    ".pulse {animation-name: pulse; animation-duration: 350ms; animation-iteration-count: infinite; animation-timing-function: linear; animation-direction: alternate;}"+
    ".look {animation-name: look; animation-duration: 200ms; animation-iteration-count: 3; animation-timing-function: linear; animation-direction: alternate;}"+
    "@keyframes spin {from {transform: rotate(0deg);} to {transform: rotate(360deg);}} "+
    "@keyframes pulse {from {opacity: 1;} to {opacity: 0.25;}} "+
    "@keyframes look {from {transform: scale(0.95);} to {transform: scale(1.05);}} ";

var tooltips = {watcher_types:"HIT and Requester types only need the Amazon ID because the remainder of the address is inferred.  If the rest of the address is provided, it is stripped out automatically.<br><br>Search types should contain everything following the question mark in the URL: mturk.com/mturk/searchbar?[this is the part you want].  Like HIT and Requester types, all unneeded information before the question mark is automatically removed.<br><br>Scrape types will monitor the first page of results when the All HITs page is sorted by creation date.  You can scrape for anything that appears in a HIT capsule, whether it be a group ID, a requester ID, the name of a requester, specific text in the description of the HIT...",
                aggressive:"Passive watchers are mindful of page request limits and will automatically queue themselves to prevent problems.<br><br>Aggressive watchers operate above that restriction and will always maintain their schedule.  Make sure you know what you're doing if using aggressive watchers.",
                hoarding:"You can panda as many HITs as you want, from just taking a single HIT to attempting to hoard the entire group (with the value *).<br><br><em>This option has a lot of potential to cause problems</em>, so be extremely careful.  You could accidentally attempt to panda an entire page based on your query.",
                appearance:"Any format supported by CSS can be used in these text boxes.  If you don't know that much CSS, you can get a crash course in the pertinents of <a href=\"http://www.w3schools.com/cssref/css_colors.asp\" target=\"_blank\">colors</a> and <a href=\"http://www.w3schools.com/cssref/pr_font_font-family.asp\" target=\"_blank\">fonts</a> from the W3C.<br><br>The range of font sizes that will work properly is pretty small.  Anything above perhaps 18px is just going to kill the interface.<br><br>The output format shown in these boxes will always be in a single format when the Settings dialog is reopened.  I'm not sure if this is the fault of CSS or JQuery, but it's a minor display issue with a very annoying fix that I'm not interested in getting into with so much else to work on.  Maybe in the future when there's a feature lull.",
                localstorage:"This will only clear local storage data that the Artemis HIT Scraper has set itself and will not disturb any other script's or extension's data if it exists there.  If you have a resource explorer in your browser, using this function deletes all localstorage that begins with \"artemis_\" and nothing else.",
                json:"You cannot use the double quote or the forward slash.  Double quotes break the JSON storage between sessions and the forward slash creates a JavaScript problem because the character is used for escaping.",
                captcha:"If you are not a Masters worker, you are annoyed by a CAPTCHA after accepting approximately 35 jobs and must type in the characters to continue accepting work in any capacity, whether that is automatically with a panda or on your own by clicking a link.<br><br>The Artemis software will never support solving these CAPTCHAs for you.",
                logout:"The Mechanical Turk cookie only lasts for 12 hours and then you have to log back in again to continue working.<br><br>No legitimate software should ever ask for your login details to work around this problem, and there is also the extra added issue of the possibility of a CAPTCHA simply to login.  Artemis will never solve CAPTCHAs for you.",
                importing:"When importing watchers and/or groups, 'Append' mode will simply load data and add it to the system without changing or deleting anything that is presently there.  For example, setting up a bunch of watchers and then importing your Turkmaster list will simply combine all of the watchers together.<br><br>When importing groups or watchers in 'Overwrite' mode, existing data is lost.  For instance, if you have a complete interface set up with a bunch of groups and watchers, importing watchers in 'Overwrite' mode will delete all of your current watchers but leave the groups intact.<br><br>When importing Artemis data, the 'name' of the import type is important.  You'll notice that everything in an export starts with its name and a colon, such as 'watchers:'.",
                coloractions:"'Test' will use the current values of this Appearance section of textboxes and apply them to the Artemis interface for you to preview.  Anything 'in testing' will be lost if you do not save the application settings.<br><br>'Import' will allow you to import an appearance scheme from elsewhere (e.g., someone sharing theirs on reddit) without immediately overwriting settings, as would be the case when using the application import function from the main Artemis menu.  Successful imports will automatically 'Test' the given values.",
                settingsactions:"'Reset' will erase any changes and revert application settings back to what they were when the Settings window was opened.<br><br>'Defaults' will set all options to those originally defined by the Artemis software.<br><br>'Close' will dismiss the settings window.<br><br>Only the 'Save' button will commit any of the above settings.  It does not matter what or how much you change in this dialog because everything is lost if you do not use the Save button.",
                panda_sound:"Artemis will make this sound when a jobs are automatically accepted for you, whether it's a single job or a page of them.<br><br>Use the green icon to test the sound file currently in the box to the left.  It will play at the volume specified above.  If you hear nothing after a second or two, then the file could not be loaded for some reason.  There is <span class=\"topic\" data-tooltip=\"http_info\">more information</span> in another help topic.",
                alert_sound:"Artemis will make this sound when a watcher returns a positive result but it has not panda'd any jobs.<br><br>Use the green icon to test the sound file currently in the box to the left.  It will play at the volume specified above.  If you hear nothing after a second or two, then the file could not be loaded for some reason.  There is <span class=\"topic\" data-tooltip=\"http_info\">more information</span> in another help topic.",
                error_sound:"Artemis will make this sound when an error occurs with a watcher, such as a 404 page, a CAPTCHA, or when your Turk account is logged out.<br><br>Use the green icon to test the sound file currently in the box to the left.  It will play at the volume specified above.  If you hear nothing after a second or two, then the file could not be loaded for some reason.  There is <span class=\"topic\" data-tooltip=\"http_info\">more information</span> in another help topic.",
                http_info:"You can use any sound file on the internet (beginning with http:// or https://) for Artemis sound events, but some web servers have what is called hotlink protection that prevents precisely this kind of cross-site file loading.  If you're sure the address is correct and you do not hear any sound play when you test it, this is most likely the cause.<br><br>You cannot use a sound file on your computer.  When userscripts are inserted onto a webpage, they become attached to the domain of the page and cannot operate outside of it.  Artemis operates at mturk.com, which means that any file that does not begin with http:// or https:// will cause the browser and the program code to look for the file at mturk.com/c:\\users\\files\\etc which is obviously a bad URL.<br><br>If you need a place to upload small files, Dropbox is pretty great.  They have a 2 GB storage limit and a 20 GB daily bandwidth limit, which will be impossible to reach just by putting a couple sound effects in there.",
                volume:"This is a percentage of the original volume of the file, ranging from 0 (off) to 100 (full).  25 would be 1/4 volume, 50 would be half volume, etc.",
                about:"Artemis is developed by and property of Ben 'Mobius Evalon' Rothe.  It is licensed under <a href='http://creativecommons.org/licenses/by-sa/4.0/' target='_blank'>Creative Commons attribution-share alike 4.0</a>.  In short, it means that Artemis can be modified and redistributed freely as long as: <ul><li>you redistribute <i>under the same license</i>;</li><li>all resources are properly attributed (credit is given where due);</li><li>all previous iterations of the attributions at the beginning of the userscript file remain at the top of the file in their original unedited form and are included with any redistributions, edits, and forks.</li></ul>"+
                "<h3>Contact</h3>"+
                "Just make sure to mention Artemis or Turk or something, or I may dismiss you as a bot (i.e. don't just say 'hey are you there' on Skype because there's a good chance I won't respond to it.)<br>"+
                "<ul class='attrib'><li>Email: mobiusevalon@tibbius.com</li><li>Skype: mobiusevalon</li></ul>"+
                "<h3>Resources</h3>"+
                "<a href='https://code.jquery.com/jquery-1.12.4.min.js' target='_blank'>jQuery 1.12.4</a><ul class='attrib'><li>By <a href='https://jquery.org/team/' target='_blank'>Dave Methvin, et al.</a> [<a href='https://jquery.org/' target='_blank'>Homepage</a>]</li><li>License: <a href='https://tldrlegal.com/license/mit-license' target='_blank'>MIT</a></li></ul>"+
                "<a href='https://code.jquery.com/ui/1.11.4/jquery-ui.min.js' target='_blank'>jQuery UI 1.11.4</a><ul class='attrib'><li>By <a href='http://jqueryui.com/about/#jquery-ui-team' target='_blank'>Scott Gonzalez, et al.</a> [<a href='http://jqueryui.com/' target='_blank'>Homepage</a>]</li><li>License: <a href='https://tldrlegal.com/license/mit-license' target='_blank'>MIT</a></li></ul>"+
                "<a href='https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css' target='_blank'>FontAwesome 4.6.3</a><ul class='attrib'><li>By Dave Gandy [<a href='http://fontawesome.io' target='_blank'>Homepage</a>]</li><li>License: <a href='http://fortawesome.github.io/Font-Awesome/license/' target='_blank'>Various</a></li></ul>"+
                "<a href='https://fonts.googleapis.com/css?family=Droid+Sans:400,700' target='_blank'>Droid Sans</a><ul class='attrib'><li>By <a href='https://profiles.google.com/107777320916704234605/about'>Steve Matteson</a> [<a href='https://www.google.com/fonts/specimen/Droid+Sans' target='_blank'>Homepage</a>]</li><li>License: <a href='http://www.apache.org/licenses/LICENSE-2.0.html' target='_blank'>Apache 2.0</a></li></ul>"+
                "<a href='http://freesound.org/people/KIZILSUNGUR/sounds/72125/' target='_blank'>'Panda accepted' sound</a><ul class='attrib'><li>By <a href='http://freesound.org/people/KIZILSUNGUR/' target='_blank'>KIZILSUNGUR</a></li><li>License: <a href='http://creativecommons.org/publicdomain/zero/1.0/' target='_blank'>Public domain</a></li><li>Edits: reduced to monoaural 16 bit from stereo 32 bit to reduce file size</li></ul>"+
                "<a href='http://freesound.org/people/KIZILSUNGUR/sounds/72126/' target='_blank'>'Alert' sound</a><ul class='attrib'><li>By <a href='http://freesound.org/people/KIZILSUNGUR/' target='_blank'>KIZILSUNGUR</a></li><li>License: <a href='http://creativecommons.org/publicdomain/zero/1.0/' target='_blank'>Public domain</a></li><li>Edits: sample format reduced from 32 to 16 bits to reduce file size</li></ul>"+
                "<a href='http://freesound.org/people/Bertrof/sounds/131657/' target='_blank'>'Error' sound</a><ul class='attrib'><li>By <a href='http://freesound.org/people/Bertrof/' target='_blank'>Bertrof</a></li><li>License: <a href='http://creativecommons.org/licenses/by/3.0/' target='_blank'>Attribution 3.0</a></li><li>Edits: reduced to monoaural 16 bit from stereo 32 bit to reduce file size; clipped to 0.9 seconds</li></ul>"};

String.prototype.artemis_json_string = function(start,end)
{
    var b = this.indexOf(start);
    if(b > -1)
    {
        b += (start.length-1);
        var e = this.indexOf(end,b);
        if(e > -1)
        {
            e++;
            return this.slice(b,e);
        }
    }
    return "";
};

String.prototype.ucfirst = function()
{
    return (this.slice(0,1).toUpperCase()+this.slice(1));
};

function system_action(a)
{
    switch(a)
    {
        case "test_panda_sound": case "test_alert_sound": case "test_error_sound":
            var f = $("#sd_"+a.slice(a.indexOf("_")+1,a.lastIndexOf("_"))+"_file").val(),
                s,
                v = constrain_int($("#settings #sound_settings #sd_sound_volume").val(),0,100);
            if(f === $("#sfx_panda source").attr("src")) s = $("#sfx_panda").get(0);
            else if(f === $("#sfx_alert source").attr("src")) s = $("#sfx_alert").get(0);
            else if(f === $("#sfx_error source").attr("src")) s = $("#sfx_error").get(0);
            else s = $("<audio/>")
                .append($("<source/>")
                        .attr("src",f)
                       ).get(0);
            s.volume = (v/100);
            s.currentTime = 0;
            s.play();
            break;
    }
}

function system_heads_up(obj)
{
    if(obj_has_properties(obj,"text","type"))
    {
        $("#heads-up #hup-dismiss, #heads-up #hup-confirm").hide();
        $("#heads-up")
            .css({"left":(obj.hasOwnProperty("x") ? obj.x : "25vw"),
                  "top":(obj.hasOwnProperty("y") ? obj.y : "35vh")})
            .find(".head").text(obj.type === "confirm" ? "Are you sure?" : "Attention")
            .parent().find(".explain").text(obj.text)
            .parent().find("#hup-"+obj.type).show()
            .parent().find("#hup-element-id").val(obj.hasOwnProperty("target") ? obj.target : "")
            .parent().find("#hup-action").val(obj.hasOwnProperty("action") ? obj.action : "")
            .parent().find("#hup-"+(obj.type === "confirm" ? "no" : "ok")).focus();
        $("#heads-up").show();
        if(obj.type === "confirm") $("#fallthrough").show();
    }
}

function system_help(topic)
{
    if(tooltips.hasOwnProperty(topic))
    {
        $("#help .explain").html(tooltips[topic]);
        $("#help .explain .topic").each(function() {
            $(this).click(function() {system_help($(this).attr("data-tooltip"));});
        });
        show_dialog("#help");
    }
}

function saved_dialog_location(s)
{
    var p = localStorage.getItem("artemis_pos-"+s),
        a = ((p === null) ? [] : p.split(",")),
        x = (a.length ? a[0] : "25vw"),
        y = (a.length ? a[1] : "35vh");

    return {x:x,y:y};
}

function show_dialog(element,focus)
{
    var p = saved_dialog_location(element.slice(1));

    $(element)
        .css("left",p.x)
        .css("top",p.y)
        .show();
    if(focus !== undefined) $(element+" "+focus).focus();
}

function obj_has_properties()
{
    var obj = arguments[0];
    if($.type(obj) === "object")
    {
        for(var i=1;i<arguments.length;i++)
        {
            if(($.type(arguments[i]) !== "string") || !obj.hasOwnProperty(arguments[i])) return false;
        }
    }
    return true;
}

function json_obj(json)
{
    var obj;
    if($.type(json) === "string" && json.trim().length)
    {
        try {obj = JSON.parse(json);}
        catch(e) {console.log("Malformed JSON object.  Error message from JSON library: ["+e.message+"]");}
    }
    return obj;
}

function localstorage_obj(key)
{
    var obj = json_obj(localStorage.getItem(key));
    if($.type(obj) !== "object" && $.type(obj) !== "array")
    {
        localStorage.removeItem(key);
        return null;
    }
    return obj;
}

function constrain_int(num,min,max)
{
    if($.type(num) !== "number")
    {
        num = parseInt(num);
        if(isNaN(num)) num = max;
    }
    if(num < min) num = min;
    if(num > max) num = max;
    return Math.floor(num);
}

function uid()
{
    var u;
    do {u = (String.fromCharCode(random_int(97,122))+Math.random().toString(16).slice(2));}
    while($("#"+u).length); // in the extremely unlikely event that the generated id is a duplicate
    return u;
}

function random_int(min,max)
{
    return (Math.random()*(max-min)+min);
}

function abstract2boolean(a)
{
    if($.type(a) === "boolean") return a;
    else if(($.type(a) === "string") && a === "yes") return true;
    else if(($.type(a) === "number") && a === 0) return true;
    return false;
}

function boolean2yn(b)
{
    if(b === true) return "yes";
    return "no";
}

function artemis_css(style)
{
    // this works a ton better and is a lot cleaner than putting inline styles within each element
    $("#artemis_css").text(expand_css(style));
}

function expand_css(style)
{
    if($.type(style) !== "object") style = default_appearance_settings();

    var expanded_fluid_css = css_fluid;
    $.each(style, function(key,val) {expanded_fluid_css = expanded_fluid_css.replace(new RegExp(("\\["+key+"\\]"),"gi"),val);});
    return (expanded_fluid_css+css_static);
}

function app_settings(obj)
{
    if($.type(obj) === "object")
    {
        $("#settings #sd_sound_volume").val(obj.sound_volume);
        $("#settings #sd_panda_file").val(obj.panda_sound);
        $("#settings #sd_alert_file").val(obj.alert_sound);
        $("#settings #sd_error_file").val(obj.error_sound);
        $("#settings #gs_show_help").prop("checked",abstract2boolean(obj.show_help));
    }
    else return {sound_volume:$("#settings #sd_sound_volume").val(),
                 panda_sound:$("#settings #sd_panda_file").val(),
                 alert_sound:$("#settings #sd_alert_file").val(),
                 error_sound:$("#settings #sd_error_file").val(),
                 show_help:boolean2yn($("#settings #gs_show_help").prop("checked"))};
}

function default_appearance_settings()
{
    return {font_family:"'Droid Sans',sans-serif",
            font_size:"14px",
            app_bg_color:"rgb(182, 210, 217)",
            app_title_color:"rgb(182, 210, 217)",
            app_text_color:"rgb(85, 85, 85)",
            group_bg_color:"rgb(224, 238, 241)",
            group_title_color:"rgb(131, 173, 183)",
            group_text_color:"rgb(238, 238, 238)",
            watcher_bg_color:"rgb(186, 186, 226)",
            watcher_text_color:"rgb(0, 0, 0)",
            dialog_bg_color:"rgb(182, 182, 222)",
            dialog_text_color:"rgb(0, 0, 0)",
            menu_bg_color:"rgb(197, 236, 154)",
            menu_text_color:"rgb(0, 0, 0)",
            alert_bg_color:"rgb(241, 190, 209)",
            alert_text_color:"rgb(0, 0, 0)"};
}

function default_settings(a,b)
{
    if(a) app_settings({sound_volume:"100",
                        panda_sound:"https://dl.dropbox.com/s/2bvjw6rfa3yjjtd/panda.ogg",
                        alert_sound:"https://dl.dropbox.com/s/vwugmuncw5vptob/alert.ogg",
                        error_sound:"https://dl.dropbox.com/s/vdm1y43v57di83z/error.ogg",
                        show_help:true});
    if(b)
    {
        var color_obj = default_appearance_settings();
        artemis_css(color_obj);
        interface_settings(color_obj);
    }
}

function interface_settings(obj)
{
    if($.type(obj) === "object")
    {
        $("#settings #cv_font_family").val(obj.font_family);
        $("#settings #cv_font_size").val(obj.font_size);
        $("#settings #cv_app_header").val(obj.app_title_color);
        $("#settings #cv_app_text").val(obj.app_text_color);
        $("#settings #cv_app_background").val(obj.app_bg_color);
        $("#settings #cv_group_header").val(obj.group_title_color);
        $("#settings #cv_group_text").val(obj.group_text_color);
        $("#settings #cv_group_background").val(obj.group_bg_color);
        $("#settings #cv_watcher_background").val(obj.watcher_bg_color);
        $("#settings #cv_watcher_text").val(obj.watcher_text_color);
        $("#settings #cv_dialog_background").val(obj.dialog_bg_color);
        $("#settings #cv_dialog_text").val(obj.dialog_text_color);
        $("#settings #cv_menu_background").val(obj.menu_bg_color);
        $("#settings #cv_menu_text").val(obj.menu_text_color);
        $("#settings #cv_alert_background").val(obj.alert_bg_color);
        $("#settings #cv_alert_text").val(obj.alert_text_color);
    }
    else return {font_family:$("#settings #cv_font_family").val(),
                 font_size:$("#settings #cv_font_size").val(),
                 app_bg_color:$("#settings #cv_app_background").val(),
                 app_title_color:$("#settings #cv_app_header").val(),
                 app_text_color:$("#settings #cv_app_text").val(),
                 group_bg_color:$("#settings #cv_group_background").val(),
                 group_title_color:$("#settings #cv_group_header").val(),
                 group_text_color:$("#settings #cv_group_text").val(),
                 watcher_bg_color:$("#settings #cv_watcher_background").val(),
                 watcher_text_color:$("#settings #cv_watcher_text").val(),
                 dialog_bg_color:$("#settings #cv_dialog_background").val(),
                 dialog_text_color:$("#settings #cv_dialog_text").val(),
                 menu_bg_color:$("#settings #cv_menu_background").val(),
                 menu_text_color:$("#settings #cv_menu_text").val(),
                 alert_bg_color:$("#settings #cv_alert_background").val(),
                 alert_text_color:$("#settings #cv_alert_text").val()};
}

function save_colors()
{
    var obj = interface_settings();
    artemis_css(obj);
    localStorage.setItem("artemis_appearance",JSON.stringify(obj));
}

function store_groups(obj)
{
    var groups = "";
    $(".watcher_group").each(function () {
        var g = new group({id:$(this).attr("id")});
        groups += (g.json_string()+",");
    });
    localStorage.setItem("artemis_groups",("["+groups.slice(0,-1)+"]"));
}

function store_watchers(obj)
{
    var watchers = "";
    $(".watcher").each(function () {
        var w = new watcher({id:$(this).attr("id")});
        watchers += (w.json_string()+",");
    });
    localStorage.setItem("artemis_watchers",("["+watchers.slice(0,-1)+"]"));
}

function watcher(arg)
{
    if($.type(arg) === "object")
    {
        // we need the id first and foremost, whether it exists on the interface or if we have to make a new one
        if(arg.hasOwnProperty("id")) this.id = arg.id;
        else this.id = ""; // blank string forces generation of new id

        var $element = $("li#"+this.id);

        if($element.length)
        {
            this.group = $element.parent().parent().attr("id");
            this.name = $element.find(".name").first().text();
            this.type = $element.attr("data-type");
            this.query = $element.attr("data-query");
            this.aggressive = $element.attr("data-aggressive");
            this.timer = $element.attr("data-timer");
            this.sound_alert = $element.attr("data-sound-alert");
            this.browser_alert = $element.attr("data-browser-alert");
            this.desktop_alert = $element.attr("data-desktop-alert");
            this.panda = $element.attr("data-panda");
            this.stop = $element.attr("data-stop");
            this.index = ($("#"+this.group+" ul.watcher_list li.watcher").index($element)+1);
        }

        if(arg.hasOwnProperty("group")) this.group = arg.group;
        if(arg.hasOwnProperty("name")) this.name = decodeURIComponent(arg.name);
        if(arg.hasOwnProperty("type")) this.type = arg.type;
        if(arg.hasOwnProperty("query")) this.query = decodeURIComponent(arg.query);
        if(arg.hasOwnProperty("aggressive")) this.aggressive = arg.aggressive;
        if(arg.hasOwnProperty("timer")) this.timer = arg.timer;
        if(arg.hasOwnProperty("sound_alert")) this.sound_alert = arg.sound_alert;
        if(arg.hasOwnProperty("browser_alert")) this.browser_alert = arg.browser_alert;
        if(arg.hasOwnProperty("desktop_alert")) this.desktop_alert = arg.desktop_alert;
        if(arg.hasOwnProperty("panda")) this.panda = arg.panda;
        if(arg.hasOwnProperty("stop")) this.stop = arg.stop;
        if(arg.hasOwnProperty("index")) this.index = arg.index;

        this.commit_to_interface();
    }
    else console.log("Malformed object or unexpected argument in watcher constructor");
}

watcher.prototype = {
    get id() {return this._id;},
    set id(s)
    {
        if(s === undefined || !s.length) s = uid(); // generate new id
        this._id = s;
    },

    get index() {return this._index;},
    set index(n)
    {
        var l = $("#"+this.group+" ul.watcher_list li.watcher").length;

        this._index = constrain_int(n,1,l+1);
    },

    get name() {return this._name;},
    set name(s) {this._name = s;},

    get type() {return this._type;},
    set type(s)
    {
        if($.type(s) === "string")
        {
            s = s.replace(/[^a-z0-9]/gi,"").toLowerCase();
            switch(s)
            {
                case "hit": case "requester": case "search": case "scrape":
                    this._type = s;
                    break;
            }
        }
    },

    get query() {return this._query;},
    set query(s)
    {
        if($.type(s) === "string")
        {
            if(this.type === "hit" || this.type === "requester") s.replace(/[^A-Z0-9]/gi,"");
            this._query = s;
        }
    },

    get group() {return this._group;},
    set group(s)
    {
        if($.type(s) === "string") this._group = decodeURIComponent(s);
    },

    get aggressive() {return boolean2yn(this._aggressive);},
    set aggressive(a) {this._aggressive = abstract2boolean(a);},

    get timer() {return (this._timer);},
    set timer(n)
    {
        if($.type(n) !== "number") n = parseInt(n);
        n = Math.floor(n);
        if(n < 1000) n *= 1000;
        this._timer = n;
    },

    get sound_alert() {return boolean2yn(this._sound_alert);},
    set sound_alert(a) {this._sound_alert = abstract2boolean(a);},

    get browser_alert() {return boolean2yn(this._browser_alert);},
    set browser_alert(a) {this._browser_alert = abstract2boolean(a);},

    get desktop_alert() {return boolean2yn(this._desktop_alert);},
    set desktop_alert(a) {this._desktop_alert = abstract2boolean(a);},

    get panda() {return this._panda;},
    set panda(a)
    {
        if($.type(a) === "number") this._panda = Math.floor(a);
        else if($.type(a) === "string" && a === "*") this._panda = a;
    },

    get stop() {return boolean2yn(this._stop);},
    set stop(a) {this._stop = abstract2boolean(a);},

    json_string:function() {return JSON.stringify({group:this.group,
                                                   index:this.index,
                                                   name:encodeURIComponent(this.name),
                                                   type:this.type,
                                                   query:encodeURIComponent(this.query),
                                                   aggressive:this.aggressive,
                                                   timer:this.timer,
                                                   sound_alert:this.sound_alert,
                                                   browser_alert:this.browser_alert,
                                                   desktop_alert:this.desktop_alert,
                                                   panda:this.panda,
                                                   stop:this.stop});},

    orphaned:function()
    {
        if(!$("div#orphaned").length) new group({id:"orphaned",name:"Orphaned",index:""});
        this.group = "orphaned";
        this.index = "";
    },

    commit_to_interface:function()
    {
        var $element = this.insert_into_dom();

        $element.find(".name").first().text(this.name);
        $element.attr({"data-type":this.type,
                       "data-query":this.query,
                       "data-aggressive":this.aggressive,
                       "data-timer":this.timer,
                       "data-sound-alert":this.sound_alert,
                       "data-browser-alert":this.browser_alert,
                       "data-desktop-alert":this.desktop_alert,
                       "data-panda":this.panda,
                       "data-stop":this.stop});

        var icon;
        if(this.type === "hit") icon = "fa-file-text-o";
        if(this.type === "requester") icon = "fa-user";
        if(this.type === "search") icon = "fa-search";
        if(this.type === "scrape") icon = "fa-tags";
        $element.find(".icon").first()
            .removeClass()
            .addClass("icon fa "+icon)
            .attr("title",(this.type === "hit" ? this.type.toUpperCase() : this.type.ucfirst()));
    },

    insert_into_dom:function(ni)
    {
        if(($.type(this.group) !== "string") || !$("#"+this.group).length) this.orphaned();

        if(ni !== undefined) this.index = ni;
        if(isNaN(this.index)) this.index = "";

        var $e = this.dom_element(),
            $w = $("#"+this.group+" ul.watcher_list"),
            i = $w.children().index($e),
            l = ($w.children().length);

        if((this.index-1) !== i) // new position isn't the same as the current position
        {
            if(this.index <= 1) $w.prepend($e); // beginning of list
            else if(this.index > l) $w.append($e); // end of list
            else $w.eq(this.index-1).before($e);
        }

        return $e;
    },

    dom_element:function()
    {
        var $e = $("#"+this.id);
        if($e.length) return $e;
        else return $("<li/>")
            .attr({"id":this.id,
                   "class":"watcher ui-sortable-handle"})
            .append(
            $("<div/>")
            .attr("class","controls")
            .append($("<span/>")
                    .attr({"class":"icon fa fa-eye",
                           "title":"Watcher"}),
                    $("<span/>")
                    .attr({"class":"button status fa fa-close",
                           "title":"Start"})
                    .css("background-color","#c16f6f")
                    .click(function() {var $button = $(this);
                                       if($button.hasClass("fa-close")) $button
                                           .removeClass("fa-close")
                                           .addClass("fa-check")
                                           .css("background-color","#6fc16f")
                                           .attr("title","Stop watcher");
                                       else $button
                                           .removeClass("fa-check")
                                           .addClass("fa-close")
                                           .css("background-color","#c16f6f")
                                           .attr("title","Start watcher");
                                      }),
                    $("<br/>"),
                    $("<span/>")
                    .attr({"class":"button fa fa-pencil",
                           "title":"Edit"})
                    .click(function() {var $watcher = $(this).parent().parent(),
                                           $panda = $watcher.attr("data-panda"),
                                           $group = $watcher.parent().parent().attr("id");

                                       $("#edit_watcher #ew_name").val($watcher.find(".name").first().text());
                                       $("#edit_watcher #ew_query").val($watcher.attr("data-query"));
                                       $("#edit_watcher #ew_type").val($watcher.attr("data-type"));
                                       $("#edit_watcher input[type=radio][name=ew_persistence][value="+$watcher.attr("data-aggressive")+"]").prop("checked",true);
                                       $("#edit_watcher #ew_time").val($watcher.attr("data-timer")/1000);
                                       $("#edit_watcher #ew_sound_alert").prop("checked",($watcher.attr("data-sound-alert") === "yes"));
                                       $("#edit_watcher #ew_browser_alert").prop("checked",($watcher.attr("data-browser-alert") === "yes"));
                                       $("#edit_watcher #ew_panda").prop("checked",($panda !== "0"));
                                       $("#edit_watcher #ew_volume").val($panda !== "0" ? $panda : "");
                                       $("#edit_watcher #ew_stop_watcher").prop("checked",($watcher.attr("data-stop") === "yes"));
                                       $("#edit_watcher #ew_watcher_id").val($watcher.attr("id"));

                                       // find groups for dropdown
                                       $("#edit_watcher #ew_group option").remove();

                                       $(".watcher_group").each(function() {
                                           $("#edit_watcher #ew_group").append(
                                               $("<option/>")
                                               .attr("value",$(this).attr("id"))
                                               .text($(this).find("span.name").first().text())
                                           );
                                       });
                                       $("#edit_watcher #ew_group").val($group);

                                       if($("#edit_watcher #ew_group option").length) $("#edit_watcher #ew_group_container").show();
                                       else $("#edit_watcher #ew_group_container").hide();

                                       $("#edit_watcher h1.head").text("Edit watcher");

                                       $("#edit_group").hide();

                                       show_dialog("#edit_watcher","#ew_name");
                                      }),
                    $("<span/>")
                    .attr({"class":"button fa fa-trash-o",
                           "title":"Delete"})
                    .click(function(e) {$(this).parent().parent().addClass("pulse");
                                        system_heads_up({action:"w_delete",
                                                         target:$(this).parent().parent().attr("id"),
                                                         type:"confirm",
                                                         text:"Deleting this watcher cannot be undone without importing a backup."});
                                       })
                   ),
            $("<span/>")
            .attr("class","name")
            .text(this.name)
        );
/*
        else return $("<li/>")
            .attr({"id":this.id,
                   "class":"watcher ui-sortable-handle"})
            .append(
            $("<div/>")
            .attr("class","functions left_controls")
            .append(
                $("<span/>")
                .attr({"class":"icon fa fa-eye",
                       "title":"Watcher"})
            ),
            $("<span/>")
            .attr("class","name")
            .text(this.name),
            $("<div/>")
            .attr("class","functions right_controls")
            .append(
                $("<span/>")
                .attr({"class":"button fa fa-pencil",
                       "title":"Edit"})
                .click(function() {
                    var $watcher = $(this).parent().parent(),
                        $panda = $watcher.attr("data-panda"),
                        $group = $watcher.parent().parent().attr("id");

                    $("#edit_watcher #ew_name").val($watcher.find(".name").first().text());
                    $("#edit_watcher #ew_query").val($watcher.attr("data-query"));
                    $("#edit_watcher #ew_type").val($watcher.attr("data-type"));
                    $("#edit_watcher input[type=radio][name=ew_persistence][value="+$watcher.attr("data-aggressive")+"]").prop("checked",true);
                    $("#edit_watcher #ew_time").val($watcher.attr("data-timer")/1000);
                    $("#edit_watcher #ew_sound_alert").prop("checked",($watcher.attr("data-sound-alert") === "yes"));
                    $("#edit_watcher #ew_browser_alert").prop("checked",($watcher.attr("data-browser-alert") === "yes"));
                    $("#edit_watcher #ew_panda").prop("checked",($panda !== "0"));
                    $("#edit_watcher #ew_volume").val($panda !== "0" ? $panda : "");
                    $("#edit_watcher #ew_stop_watcher").prop("checked",($watcher.attr("data-stop") === "yes"));
                    $("#edit_watcher #ew_watcher_id").val($watcher.attr("id"));

                    // find groups for dropdown
                    $("#edit_watcher #ew_group option").remove();

                    $(".watcher_group").each(function() {
                        $("#edit_watcher #ew_group").append(
                            $("<option/>")
                            .attr("value",$(this).attr("id"))
                            .text($(this).find("span.name").first().text())
                        );
                    });
                    $("#edit_watcher #ew_group").val($group);

                    if($("#edit_watcher #ew_group option").length) $("#edit_watcher #ew_group_container").show();
                    else $("#edit_watcher #ew_group_container").hide();

                    $("#edit_watcher h1.head").text("Edit watcher");

                    $("#edit_group").hide();

                    show_dialog("#edit_watcher","#ew_name");
                }),
                $("<span/>")
                .attr({"class":"button fa fa-trash-o",
                       "title":"Delete"})
                .click(function(e) {$(this).parent().parent().addClass("pulse");
                                    system_heads_up({action:"w_delete",
                                                     target:$(this).parent().parent().attr("id"),
                                                     type:"confirm",
                                                     text:"Deleting this watcher cannot be undone without importing a backup."});
                }),
                $("<span/>")
                .attr({"class":"button status fa fa-close",
                       "title":"Start"})
                .css("background-color","#c16f6f")
                .click(function() {
                    var $button = $(this);
                    if($button.hasClass("fa-close")) $button
                        .removeClass("fa-close")
                        .addClass("fa-check")
                        .css("background-color","#6fc16f")
                        .attr("title","Stop watcher");
                    else $button
                        .removeClass("fa-check")
                        .addClass("fa-close")
                        .css("background-color","#c16f6f")
                        .attr("title","Start watcher");
                })
            )
        );
*/
    }
};

function group(arg)
{
    if($.type(arg) === "object")
    {
        if(arg.hasOwnProperty("id")) this.id = arg.id;
        else this.id = "";

        var $element = $("div#"+this.id);

        if($element.length)
        {
            this.name = $element.find(".name").first().text();
            this.visible = ($element.children(".watcher_list").first().css("display") === "block");
            this.index = ($(".watcher_group").index($element)+1);
        }

        if(arg.hasOwnProperty("name")) this.name = decodeURIComponent(arg.name);
        if(arg.hasOwnProperty("visible")) this.visible = arg.visible;
        if(arg.hasOwnProperty("index")) this.index = arg.index;

        this.commit_to_interface();
    }
    else console.log("Malformed object or unexpected argument in group constructor");
}

group.prototype = {
    get id() {return this._id;},
    set id(s)
    {
        if(s === undefined || !s.length) s = uid(); // generate new id
        this._id = s;
    },

    get name() {return this._name;},
    set name(s) {this._name = s;},

    get index() {return this._index;},
    set index(n)
    {
        var l = $(".watcher_group").length;

        this._index = constrain_int(n,1,l+1);
    },

    get visible() {return this._visible;},
    set visible(b) {this._visible = b;},

    json_string:function() {return JSON.stringify({id:this.id,
                                                   index:this.index,
                                                   visible:this.visible,
                                                   name:encodeURIComponent(this.name)});},

    commit_to_interface:function()
    {
        var $element = this.insert_into_dom();
        $element.find(".name").first().text(this.name);
        if(this.visible === false) $element.children(".watcher_list").first().hide();
    },

    insert_into_dom:function(ni)
    {
        if(ni !== undefined) this.index = ni;
        if(isNaN(this.index)) this.index = "";

        var $e = this.dom_element(),
            $w = $(".watcher_group"),
            i = $w.index($e),
            l = ($w.length);

        if((this.index-1) !== i) // new position isn't the same as the current position
        {
            if(this.index <= 1) $("#interface").prepend($e); // beginning of list
            else if(this.index > l) $("#interface").append($e); // end of list
            else $w.eq(this.index-1).before($e);
        }

        return $e;
    },

    dom_element:function()
    {
        var $e = $("#"+this.id);
        if($e.length) return $e;
        else return $("<div/>")
            .attr({"id":this.id,
                   "class":"watcher_group ui-sortable-handle"})
            .append(
            $("<div/>")
            .attr("class","title")
            .append(
                $("<div/>")
                .attr("class","left_controls")
                .append(
                    $("<span/>")
                    .attr({"class":"hamburger button fa fa-navicon",
                           "title":"Group menu"})
                    .click(function(e) {
                        var $group = $(this).parent().parent().parent(),
                            visible = ($group.children("ul").first().is(":visible"));
                        $("#gm_group_id").text($group.attr("id"));
                        $("#gm_visibility .name").text((visible ? "Collapse" : "Expand")+" group");
                        $("#gm_visibility .icon")
                            .removeClass("fa-"+(visible ? "pl" : "min")+"us-circle")
                            .addClass("fa-"+(visible ? "min" : "pl")+"us-circle");
                        $("#group_menu")
                            .css({"left":e.pageX,
                                  "top":e.pageY})
                            .show();
                        $("#fallthrough").show();
                    })
                ),
                $("<span/>")
                .attr("class","name")
                .text(this.name),
                $("<div/>")
                .attr("class","right_controls")
                .append(
                    $("<span/>")
                    .attr({"class":"stop_group button fa fa-pause",
                           "title":"Stop group"})
                    .click(function() {
                        $(this).parent().parent().parent().find(".status").each(function() {
                            if($(this).hasClass("fa-check")) $(this).click();
                        });
                    }),
                    $("<span/>")
                    .attr({"class":"start_group button fa fa-play",
                           "title":"Start group"})
                    .click(function() {
                        $(this).parent().parent().parent().find(".status").each(function() {
                            if($(this).hasClass("fa-close")) $(this).click();
                        });
                    })
                )
            ),
            $("<ul/>")
            .attr("class","watcher_list")
            .sortable({connectWith:".watcher_list",placeholder:"ui-watcher-placeholder",cancel:"ui-state-disabled"})
        );
    }
};

$(document).ready(function() {
    $("body").html("");
    $("head").html("");
    $("head").append(
        $("<meta/>").attr("charset","utf-8"),
        $("<link/>")
        .attr({"rel":"stylesheet",
               "type":"text/css",
               "href":"https://fonts.googleapis.com/css?family=Droid+Sans:400,700"}),
        $("<link/>")
        .attr({"rel":"stylesheet",
               "href":"https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"}),
        $("<style/>")
        .attr({"id":"artemis_css",
               "type":"text/css"})
        .text(expand_css()),
        $("<title/>").text("Artemis HIT Scraper")
    );
    $("body").append(
        $("<div/>")
        .attr("id","fallthrough")
        .click(function () {
            // the fallthrough div makes it extremely simple to close menus when the user clicks anything on the
            // interface besides a menu option.  just put the menus at the highest z-index and the fallthrough
            // directly below, problem solved
            var $menus = $("#group_menu, #artemis_menu").filter(":visible"),
                $dialog = $("#heads-up").filter(":visible").first();

            if($menus.length) $("#group_menu, #artemis_menu, #fallthrough").hide();
            else if($dialog.length)
            {
                $dialog.addClass("look");
                setTimeout(function() {$("#heads-up").removeClass("look");},1000);
            }
        }),
        $("<div/>")
        .attr("id","artemis")
    );
    $("#artemis").append(
        $("<audio/>")
        .attr("id","sfx_panda")
        .append(
            $("<source/>")
            .attr({"src":"https://dl.dropbox.com/s/2bvjw6rfa3yjjtd/panda.ogg",
                   "type":"audio/ogg; codecs=vorbis"})
        ),
        $("<audio/>")
        .attr("id","sfx_alert")
        .append(
            $("<source/>")
            .attr({"src":"https://dl.dropbox.com/s/vwugmuncw5vptob/alert.ogg",
                   "type":"audio/ogg; codecs=vorbis"})
        ),
        $("<audio/>")
        .attr("id","sfx_error")
        .append(
            $("<source/>")
            .attr({"src":"https://dl.dropbox.com/s/vdm1y43v57di83z/error.ogg",
                   "type":"audio/ogg; codecs=vorbis"})
        ),
        $("<div/>")
        .text("Artemis")
        .attr("id","header")
        .append(
            $("<div/>")
            .attr("class","left_controls")
            .append(
                $("<span/>")
                .attr({"class":"hamburger button fa fa-navicon",
                       "title":"Artemis menu"})
                .click(function(e) {
                    $("#artemis_menu")
                        .css({"left":e.pageX,
                              "top":e.pageY})
                        .show();

                    $("#fallthrough").show();
                })
            ),
            $("<div/>")
            .attr("class","right_controls")
            .append(
                $("<span/>")
                .attr({"class":"stop_all button fa fa-stop",
                       "title":"Stop all"})
                .click(function() {
                    $(".watcher .controls .status").each(function() {
                        if($(this).hasClass("fa-check")) $(this).click();
                    });
                }),
                $("<span/>")
                .attr({"class":"start_all button fa fa-forward",
                       "title":"Start all"})
                .click(function() {
                    $(".watcher .controls .status").each(function() {
                        if($(this).hasClass("fa-close") && $(this).parent().parent().parent().css("display") !== "none") $(this).click();
                    });
                })
            )
        ),
        $("<ul/>")
        .attr({"id":"artemis_menu",
               "class":"menu"})
        .append(
            $("<li/>")
            .attr("class","item")
            .text("New watcher")
            .click(function() {
                $("#artemis_menu, #edit_group, #fallthrough").hide();

                $("#edit_watcher input:radio, #edit_watcher input:checkbox").prop("checked",false);
                $("#edit_watcher input:text, #edit_watcher #ew_watcher_id").val("");
                $("#edit_watcher h1.head").text("New watcher");

                // find groups for dropdown
                $("#edit_watcher #ew_group option").remove();

                $(".watcher_group").each(function() {
                    $("#edit_watcher #ew_group").append(
                        $("<option/>")
                        .attr("value",$(this).attr("id"))
                        .text($(this).find("span.name").first().text())
                    );
                });

                show_dialog("#edit_watcher","#ew_name");
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-edit")
            ),
            $("<li/>")
            .attr("class","item")
            .text("New group")
            .click(function() {
                $("#artemis_menu, #edit_watcher, #fallthrough").hide();

                $("#edit_group input:text, #edit_group #eg_group_id").val("");
                $("#edit_group h1.head").text("New group");

                show_dialog("#edit_group","#eg_name");
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-edit")
            ),
            $("<li/>")
            .attr("class","divider"),
            $("<li/>")
            .attr("class","item")
            .text("Expand all")
            .click(function () {
                $("#artemis_menu, #fallthrough").hide();
                $(".watcher_list").show();
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-plus-circle")
            ),
            $("<li/>")
            .attr("class","item")
            .text("Collapse all")
            .click(function () {
                $("#artemis_menu, .watcher_list, #fallthrough").hide();
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-minus-circle")
            ),
            $("<li/>")
            .attr("class","divider"),
            $("<li/>")
            .attr("class","item")
            .text("Settings")
            .click(function() {
                $("#artemis_menu, #fallthrough").hide();

                // this is a nifty concept called short circuiting that the logical or operator lets me do
                var obj = (localstorage_obj("artemis_appearance") || default_appearance_settings());
                interface_settings(obj);
                localStorage.setItem("artemis_appearance-backup",JSON.stringify(obj));

                obj = localstorage_obj("artemis_settings");
                if($.type(obj) === "object") app_settings(obj);
                else default_settings(1,0);
                localStorage.setItem("artemis_settings-backup",JSON.stringify(obj));

                $("#settings").scrollTop(0);
                show_dialog("#settings");
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-gears")
            ),
            $("<li/>")
            .attr("class","item")
            .text("Export")
            .click(function(e) {
                $("#artemis_menu, #fallthrough").hide();
                var g = "",
                    w = "";

                $(".watcher_group").each(function() {
                    var obj = new group({id:$(this).attr("id")});
                    g += (obj.json_string()+",");
                });

                $(".watcher").each(function() {
                    var obj = new watcher({id:$(this).attr("id")});
                    w += (obj.json_string()+",");
                });

                GM_setClipboard("Artemis "+artemis_version+" data export\nsettings:"+JSON.stringify(app_settings())+"\nappearance:"+JSON.stringify(localstorage_obj("artemis_appearance") || default_appearance_settings())+"\ngroups:["+g.slice(0,-1)+"]\nwatchers:["+w.slice(0,-1)+"]");
                system_heads_up({type:"dismiss",text:"Exported data has been copied to your clipboard."});
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-sign-out")
            ),
            $("<li/>")
            .attr("class","item")
            .text("Import")
            .click(function() {
                $("#artemis_menu, #fallthrough").hide();
                $("#text_input .explain").html("Make certain that the correct source is selected from the dropdown.  If the source of the data you want to import is not listed in the dropdown, it is not supported in this version.<br><br>Watchers cannot be orphaned from a group, so any imported watchers with no defined group will be added to a group named \"Orphaned\".");
                $("#ti_input").val("");
                $("#text_input #action").val("application_import");
                $("#text_input #ti_import_options").show();
                show_dialog("#text_input");
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-sign-in")
            ),
            $("<li/>")
            .attr("class","divider"),
            $("<li/>")
            .attr("class","item")
            .text("About")
            .click(function() {
                $("#artemis_menu, #fallthrough").hide();
                system_help("about");
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-question")
            )
        )
        .hide(),
        $("<ul/>")
        .attr({"id":"group_menu",
               "class":"menu"})
        .append(
            $("<li/>")
            .attr("id","gm_group_id")
            .hide(),
            $("<li/>")
            .attr({"id":"gm_visibility",
                   "class":"item"})
            .click(function() {
                $("#group_menu, #fallthrough").hide();

                var gid = $("#gm_group_id").text(),
                    $group = $("#"+gid+" ul").first();

                if($group.is(":visible")) $group.hide();
                else $group.show();
            })
            .append(
                $("<span/>")
                .attr("class","name")
                .text("Collapse group"),
                $("<span/>")
                .attr("class","icon fa fa-minus-circle")
            ),
            $("<li/>")
            .attr("class","item")
            .text("Edit group")
            .click(function() {
                $("#group_menu, #edit_watcher, #fallthrough").hide();

                var $gid = $("#gm_group_id").text(),
                    $group = $("#"+$gid),
                    $group_list = $("div.watcher_group");

                $("#edit_group #eg_name").val($group.find(".name").first().text());
                $("#edit_group #eg_group_id").val($gid);

                $("#edit_group h1.head").text("Edit group");

                show_dialog("#edit_group","#eg_name");
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-pencil")
            ),
            $("<li/>")
            .attr("class","item")
            .text("Delete group")
            .click(function(e) {
                $("#group_menu, #fallthrough").hide();

                $("#"+$("#gm_group_id").text()).addClass("pulse");
                system_heads_up({action:"g_delete",
                                 target:$("#gm_group_id").text(),
                                 type:"confirm",
                                 text:"Deleting this group will also delete all watchers it contains, and cannot be undone without importing a backup."});
            })
            .append(
                $("<span/>")
                .attr("class","icon fa fa-trash")
            )
        )
        .hide(),
        $("<div/>")
        .attr({"id":"settings",
               "class":"dialog wide floats remembers"})
        .html('<h1 class="head">Settings</h1>'+
              '<div class="scrolling-content">'+
              '<fieldset>'+
              '<legend><span class="collapses_content fa fa-minus-square-o" title="Collapse"></span><span class="field_title">Application</span></legend>'+
              '<div class="content_container">'+
              'show help icons: <input type="checkbox" class="checkbox" id="gs_show_help"><br>'+
              'when a captcha is encountered: <span class="information help fa fa-info-circle" data-tooltip="captcha"></span><br>'+
              ' <input type="radio" name="captcha_stop" value="current" class="radio"> Stop current watcher <input type="radio" name="captcha_stop" value="all" class="radio"> Stop all watchers<br>'+
              ' <input type="checkbox" class="checkbox" id="sd_captcha_sound"> make a sound<br>'+
              ' <input type="checkbox" class="checkbox" id="sd_captcha_browser_notify"> display a notification<br>'+
              'when i become logged out: <span class="information help fa fa-info-circle" data-tooltip="logout"></span><br>'+
              ' <input type="radio" name="logout_stop" value="current" class="radio"> Stop current watcher <input type="radio" name="logout_stop" value="all" class="radio"> Stop all watchers<br>'+
              ' <input type="checkbox" class="checkbox" id="sd_logout_sound"> make a sound<br>'+
              ' <input type="checkbox" class="checkbox" id="sd_logout_browser_notify"> display a notification<br>'+
              '<input type="button" id="as_ls_clear" value="Purge localstorage"><span class="information help fa fa-info-circle" data-tooltip="localstorage"></span>'+
              '</div>'+
              '</fieldset>'+
              '<fieldset id="sound_settings">'+
              '<legend><span class="collapses_content fa fa-plus-square-o" title="Expand"></span><span class="field_title">Sounds</span><span class="information help fa fa-info-circle" data-tooltip="http_info"></span></legend>'+
              '<div class="content_container" style="display:none;">'+
              '<label for="sd_sound_volume">Volume:</label><input type="text" id="sd_sound_volume" class="number"><span class="information help fa fa-info-circle" data-tooltip="volume"></span><br>'+
              '<label for="sd_panda_file">Panda:</label><input type="text" id="sd_panda_file"><span class="information test fa fa-play" data-action="test_panda_sound"></span><span class="information help fa fa-info-circle" data-tooltip="panda_sound"></span><br>'+
              '<label for="sd_alert_file">Alert:</label><input type="text" id="sd_alert_file"><span class="information test fa fa-play" data-action="test_alert_sound"></span><span class="information help fa fa-info-circle" data-tooltip="alert_sound"></span><br>'+
              '<label for="sd_error_file">Error:</label><input type="text" id="sd_error_file"><span class="information test fa fa-play" data-action="test_error_sound"></span><span class="information help fa fa-info-circle" data-tooltip="error_sound"></span><br>'+
              '</div>'+
              '</fieldset>'+
              '<fieldset id="color_settings">'+
              '<legend><span class="collapses_content fa fa-plus-square-o" title="Expand"></span><span class="field_title">Appearance</span><span class="information help fa fa-info-circle" data-tooltip="appearance"></span></legend>'+
              '<div class="content_container" style="display:none;">'+
              '<label for="cv_app_header">font:</label><input type="text" id="cv_font_family" class="color"><br>'+
              '<label for="cv_app_header">font size:</label><input type="text" id="cv_font_size" class="color"><br>'+
              '<label for="cv_app_header">app header:</label><input type="text" id="cv_app_header" class="color"><br>'+
              '<label for="cv_app_background">app background:</label><input type="text" id="cv_app_background" class="color"><br>'+
              '<label for="cv_app_text">app text:</label><input type="text" id="cv_app_text" class="color"><br>'+
              '<label for="cv_group_header">group header:</label><input type="text" id="cv_group_header" class="color"><br>'+
              '<label for="cv_group_background">group background:</label><input type="text" id="cv_group_background" class="color"><br>'+
              '<label for="cv_group_text">group text:</label><input type="text" id="cv_group_text" class="color"><br>'+
              '<label for="cv_watcher_background">watcher background:</label><input type="text" id="cv_watcher_background" class="color"><br>'+
              '<label for="cv_watcher_text">watcher text:</label><input type="text" id="cv_watcher_text" class="color"><br>'+
              '<label for="cv_dialog_background">dialog background:</label><input type="text" id="cv_dialog_background" class="color"><br>'+
              '<label for="cv_dialog_text">dialog text:</label><input type="text" id="cv_dialog_text" class="color"><br>'+
              '<label for="cv_menu_background">menu background:</label><input type="text" id="cv_menu_background" class="color"><br>'+
              '<label for="cv_menu_text">menu text:</label><input type="text" id="cv_menu_text" class="color"><br>'+
              '<label for="cv_alert_background">alert background:</label><input type="text" id="cv_alert_background" class="color"><br>'+
              '<label for="cv_alert_text">alert text:</label><input type="text" id="cv_alert_text" class="color">'+
              '<div class="actions">'+
              '<input type="button" value="Test" id="cv_test"><input type="button" value="Import" id="cv_import"><span class="information help fa fa-info-circle" data-tooltip="coloractions"></span>'+
              '</div>'+
              '</div>'+
              '</fieldset>'+
              '</div>'+
              '<div class="actions">'+
              '<input type="button" value="Save" id="as_save"><input type="button" value="Reset" id="as_reset"><input type="button" value="Defaults" id="as_defaults"><input type="button" value="Close" id="as_close"><span class="information help fa fa-info-circle" data-tooltip="settingsactions"></span>'+
              '</div>')
        .hide(),
        $("<div/>")
        .attr({"id":"heads-up",
               "class":"dialog narrow floats"})
        .html('<h1 class="head">Heads up</h1>'+
              '<div class="explain"></div>'+
              '<div class="actions">'+
              '<input type="hidden" id="hup-element-id"><input type="hidden" id="hup-action">'+
              '<div id="hup-dismiss"><input type="button" value="OK" id="hup-ok"></div>'+
              '<div id="hup-confirm"><input type="button" value="No" id="hup-no"> <input type="button" value="Yes" id="hup-yes"></div>'+
              '</div>')
        .hide(),
        $("<div/>")
        .attr({"id":"help",
               "class":"dialog wide floats remembers"})
        .html('<h1 class="head">Artemis help</h1>'+
              '<div class="scrolling-content">'+
              '<div class="explain"></div>'+
              '</div>'+
              '<div class="actions">'+
              '<input type="button" value="Close" id="h_close">'+
              '</div>')
        .hide(),
        $("<div/>")
        .attr({"id":"text_input",
               "class":"dialog wide floats remembers"})
        .html('<h1 class="head">Import</h1>'+
              '<div class="explain"></div>'+
              '<textarea id="ti_input"></textarea>'+
              '<div id="ti_import_options">'+
              '<label for="ti_import_source" class="dropdown fixed">Data source:</label><select id="ti_import_source" class="dropdown">'+
              '<option value="artemis">Artemis</option>'+
              '<option value="turkmaster-donovanm">Turkmaster (DonovanM)</option>'+
              '<option value="new-hit-monitor-v2-kadauchi">New HIT Monitor v2 (Kadauchi)</option>'+
              '</select><br>'+
              '<label class="radio fixed">Import mode:</label>'+
              '<input type="radio" name="ti_import_type" id="ti_import_append" class="radio" value="append" checked="checked"><label for="ti_import_append" class="radio">Append</label>'+
              '<input type="radio" name="ti_import_type" id="ti_import_overwrite" class="radio sequential" value="overwrite"><label for="ti_import_overwrite" class="radio">Overwrite</label>'+
              '<span class="information help fa fa-question-circle" data-tooltip="importing"></span>'+
              '</div>'+
              '<div class="actions">'+
              '<input type="hidden" id="action">'+
              '<input type="button" value="Submit" id="ti_submit"> <input type="button" value="Cancel" id="ti_close">'+
              '</div>')
        .hide(),
        $("<div/>")
        .attr({"id":"edit_group",
               "class":"dialog narrow floats remembers"})
        .html('<h1 class="head">Group</h1>'+
              '<div class="input_group">'+
              '<label for="eg_name" class="textbox fixed">Name:</label>'+
              '<input type="text" id="eg_name" class="textbox freeform">'+
              '</div>'+
              '<div class="input_group">'+
              '<input type="hidden" id="eg_group_id">'+
              '<div class="half"><input type="button" value="Save" id="eg_save"></div><div class="half"><input type="button" value="Cancel" id="eg_close"></div>'+
              '</div>')
        .hide(),
        $("<div/>")
        .attr({"id":"edit_watcher",
               "class":"dialog narrow floats remembers"})
        .html('<h1 class="head">Watcher</h1>'+
              '<div class="input_group">'+
              '<label for="ew_name" class="textbox fixed">Name:</label>'+
              '<input type="text" id="ew_name" class="textbox freeform">'+
              '</div>'+
              '<div class="input_group">'+
              '<label for="ew_query" class="textbox fixed">Query:</label>'+
              '<input type="text" id="ew_query" class="textbox freeform">'+
              '</div>'+
              '<div class="input_group">'+
              '<label for="ew_type" class="dropdown fixed">Type:</label>'+
              '<select name="ew_type" id="ew_type" class="dropdown">'+
              '<option value="hit">HIT</option>'+
              '<option value="requester">Requester</option>'+
              '<option value="search">Search</option>'+
              '<option value="scrape">Scrape</option>'+
              '</select>'+
              '<span class="information help fa fa-info-circle" data-tooltip="watcher_types"></span>'+
              '</div>'+
              '<div class="input group" id="ew_group_container">'+
              '<label for="ew_group" class="dropdown fixed">Group:</label>'+
              '<select name="ew_group" id="ew_group" class="dropdown"></select>'+
              '</div>'+
              '<div class="input_group">'+
              'This watcher is:<br>'+
              '<div class="indent">'+
              '<input type="radio" name="ew_persistence" value="no" class="radio" id="ew_passive">'+
              '<label for="ew_passive" class="radio">Passive</label>'+
              '<input type="radio" name="ew_persistence" value="yes" class="radio sequential" id="ew_aggressive">'+
              '<label for="ew_aggressive" class="radio">Aggressive</label>'+
              '<span class="information danger fa fa-exclamation-triangle" data-tooltip="aggressive"></span>'+
              '</div>'+
              '</div>'+
              '<label for="ew_time" class="textbox">Check every</label><input type="text" class="textbox sequential number" id="ew_time"><label for="ew_time" class="textbox sequential">seconds</label>'+
              '<div class="input_group">'+
              'When this query returns a result:'+
              '<div class="indent">'+
              '<input type="checkbox" class="checkbox" id="ew_sound_alert">'+
              '<label for="ew_sound_alert">Alert me with a sound</label><br>'+
              '<input type="checkbox" class="checkbox" id="ew_browser_alert">'+
              '<label for="ew_browser_alert">Alert me with a popup</label><br>'+
              '<input type="checkbox" class="checkbox" id="ew_panda">'+
              '<label for="ew_panda" class="textbox">Panda</label>'+
              '<input type="text" id="ew_volume" class="textbox sequential number">'+
              '<label for="ew_volume" class="textbox sequential">HITs</label>'+
              '<span class="information danger fa fa-exclamation-triangle" data-tooltip="hoarding"></span><br>'+
              '<input type="checkbox" class="checkbox" id="ew_stop_watcher">'+
              '<label for="ew_stop_watcher">Stop this watcher</label>'+
              '</div>'+
              '</div>'+
              '<div class="input_group">'+
              '<input type="hidden" id="ew_watcher_id">'+
              '<div class="half"><input type="button" value="Save" id="ew_save"></div><div class="half"><input type="button" value="Cancel" id="ew_close"></div>'+
              '</div>')
        .hide(),
        $("<div/>")
        .attr("id","interface")
    );
    $("#edit_watcher #ew_save").click(function() {
        var id = $("#edit_watcher #ew_watcher_id").val();
        new watcher({id:id,
                     name:$("#edit_watcher #ew_name").val(),
                     group:$("#edit_watcher #ew_group").val(),
                     query:$("#edit_watcher #ew_query").val(),
                     type:$("#edit_watcher #ew_type").val(),
                     aggressive:$("#edit_watcher input[name=ew_persistence]:checked").val(),
                     timer:$("#edit_watcher #ew_time").val(),
                     sound_alert:$("#edit_watcher #ew_sound_alert").prop("checked"),
                     browser_alert:$("#edit_watcher #ew_browser_alert").prop("checked"),
                     stop:$("#edit_watcher #ew_stop_watcher").prop("checked"),
                     panda:$("#edit_watcher #ew_volume").val()});

        $("#edit_watcher").hide();
    });
    $("#edit_watcher #ew_close").click(function() {
        $("#edit_watcher").hide();
    });
    $("#edit_group #eg_close").click(function() {
        $("#edit_group").hide();
    });
    $("#edit_group #eg_save").click(function() {
        var id = $("#edit_group #eg_group_id").val(),
            obj = new group({id:id,name:$("#edit_group #eg_name").val()});

        $("#edit_group").hide();
    });
    $("#cv_test").click(function() {
        artemis_css(interface_settings());
    });
    $("#cv_import").click(function() {
        $("#text_input .explain").text("You can import a color scheme here to try it out without committing the changes immediately, as would be the case if you were to import it from the application menu.  Make sure this data does not contain anything but a color scheme, as the import will fail otherwise.");
        $("#ti_input").val("");
        $("#text_input #action").val("appearance_import");
        $("#text_input #ti_import_options").hide();
        show_dialog("#text_input");
    });
    $("#settings #as_save").click(function() {
        save_colors();

        var obj = app_settings();
        if(obj.show_help === "yes") $(".information").show();
        else $(".information").hide();

        localStorage.setItem("artemis_settings",JSON.stringify(obj));

        localStorage.removeItem("artemis_appearance-backup");
        localStorage.removeItem("artemis_settings-backup");

        $("#settings").hide();
    });
    $("#as_reset").click(function() {
        var obj = localstorage_obj("artemis_appearance-backup");
        if($.type(obj) === "object")
        {
            interface_settings(obj);
            artemis_css(obj);
        }

        obj = localstorage_obj("artemis_settings-backup");
        if($.type(obj) === "object") app_settings(obj);
    });
    $("#as_defaults").click(function() {
        default_settings(1,1);
    });
    $("#settings #as_close").click(function() {
        var obj = localstorage_obj("artemis_appearance-backup");
        if($.type(obj) === "object") artemis_css(obj);

        localStorage.removeItem("artemis_appearance-backup");
        localStorage.removeItem("artemis_settings-backup");
        $("#settings").hide();
    });
    $("#settings #as_ls_clear").click(function(e) {
        system_heads_up({action:"ls_purge",
                         type:"confirm",
                         text:"Clearing local storage cannot be undone.  However, you will still be able to export a working backup until you reopen Artemis because data exports are built from the visible interface and not simply pulled from local storage."});
    });
    $("#settings #gs_show_help").click(function() {if($(this).prop("checked") === true) $(".information").show();
                                                   else $(".information").hide();});
    $("#ti_submit").click(function(event) {
        $("#text_input").hide();

        var action = $("#text_input #action").val(),
            input = $("#text_input #ti_input").val(),
            obj;
        switch(action)
        {
            case "appearance_import":
                obj = json_obj(input.artemis_json_string("{","}"));
                if($.type(obj) === "object")
                {
                    interface_settings(obj);
                    artemis_css(obj);
                }
                else system_heads_up({type:"dismiss",text:"Supplied text is not JSON or is malformed.  Nothing was imported."});
                break;
            case "application_import":
                var source = $("#text_input #ti_import_source").val(),
                    mode = $("#text_input input[name=ti_import_type]:checked").val();

                switch(source)
                {
                    case "artemis":
                        var version = input.match(/^Artemis ([^a-z]{1,})/i);
                        if(version !== null) version = (version[1]*1);
                        if(version <= 1)
                        {
                            obj = json_obj(input.artemis_json_string("settings:{","}"));
                            if($.type(obj) === "object")
                            {
                                localStorage.setItem("artemis_settings",JSON.stringify(obj));
                                app_settings(obj);
                            }

                            obj = json_obj(input.artemis_json_string("appearance:{","}"));
                            if($.type(obj) === "object")
                            {
                                localStorage.setItem("artemis_appearance",JSON.stringify(obj));
                                artemis_css(obj);
                            }

                            obj = json_obj(input.artemis_json_string("groups:[","]"));
                            if(($.type(obj) === "array") && obj.length)
                            {
                                if(mode === "overwrite")
                                {
                                    $("li.watcher").each(function() {
                                        new watcher({id:$(this).attr("id")}).orphaned();
                                    });
                                    $("div.watcher_group").not("#orphaned").remove();
                                }

                                $.each(obj,function() {
                                    new group(this);
                                });

                                store_groups();
                            }

                            obj = json_obj(input.artemis_json_string("watchers:[","]"));
                            if(($.type(obj) === "array") && obj.length)
                            {
                                if(mode === "overwrite") $("li.watcher").remove();

                                $.each(obj,function() {
                                    new watcher(this);
                                });

                                store_watchers();
                            }
                        }
                        else system_heads_up({type:"dismiss",text:"Imported data is not a recognized version.  This is likely due to the required version declaration not being present (the 'Artemis xx.xx' line at the beginning.)"});
                        break;
                    case "turkmaster-donovanm":
                        obj = json_obj(input);
                        if(($.type(obj) === "array") && obj.length)
                        {
                            if(mode === "overwrite") $("li.watcher").remove();

                            $.each(obj,function() {
                                var query,
                                    panda = ((this.option.auto === true) ? 1 : 0);
                                if(this.type === "hit" || this.type === "requester") query = this.id;
                                else if(this.type === "url")
                                {
                                    this.type = "search";
                                    query = this.url.slice(this.url.indexOf("?"));
                                }

                                new watcher({name:this.name,
                                             type:this.type,
                                             query:query,
                                             aggressive:false,
                                             timer:this.time,
                                             sound_alert:true,
                                             browser_alert:this.option.alert,
                                             desktop_alert:false,
                                             panda:panda,
                                             stop:this.option.stopOnCatch});
                            });

                            store_watchers();
                        }
                        else system_heads_up({type:"dismiss",text:"Supplied TurkMaster data is not JSON or is malformed.  Nothing was imported."});
                        break;
                    case "new-hit-monitor-v2-kadauchi":
                        var watchers = input.slice(1,-1).split(",");
                        if(input.indexOf(",") > -1 && input.indexOf("|*|") > -1 && watchers.length)
                        {
                            $.each(watchers,function(i,v) {
                                var info = v.slice(1,-1).split("|*|");

                                if(info.length === 2) new watcher({name:info[0],
                                                                   type:"scrape",
                                                                   query:info[1],
                                                                   aggressive:false,
                                                                   timer:10000,
                                                                   sound_alert:true,
                                                                   browser_alert:false,
                                                                   desktop_alert:false,
                                                                   panda:0,
                                                                   stop:true});
                            });
                        }
                        else system_heads_up({type:"dismiss",text:"Supplied HIT Monitor data is not valid or is malformed.  Nothing was imported."});

                        store_watchers();
                        break;
                    default:
                        system_heads_up({type:"dismiss",text:"An unrecognized import source was selected.  This can probably only happen if you're tinkering with the interface or code, so quit that."});
                        break;
                }
                break;
        }
    });
    $("#ti_close").click(function() {
        $("#text_input").hide();
    });
    $("#h_close").click(function() {
        $("#help").hide();
    });

    $("#heads-up #hup-ok, #heads-up #hup-no").click(function() {
        $("#heads-up, #fallthrough").hide();

        if($("#hup-action").val().indexOf("_delete")) $("#"+$("#hup-element-id").val()).removeClass("pulse");
    });
    $("#heads-up #hup-yes").click(function() {
        $("#heads-up, #fallthrough").hide();

        var a = $("#heads-up #hup-action").val(),
            i = $("#heads-up #hup-element-id").val();

        switch(a)
        {
            case "w_delete":
                $("#"+i).remove();
                break;
            case "g_delete":
                $("#"+i+" .watcher_list .watcher").each(function() {
                    localStorage.removeItem("artemis_watcher-"+$(this).attr("id"));
                });
                $("#"+i).remove();
                break;
            case "ls_purge":
                $.each(localStorage, function(k,v) {
                    if(k.indexOf("artemis_") > -1) localStorage.removeItem(k);
                });
                break;
        }
    });

    $(".collapses_content").click(function() {
        var $button = $(this),
            $content = $(this).parent().parent().find(".content_container").first();
        if($button.hasClass("fa-minus-square-o"))
        {
            $content.hide();
            $button
                .removeClass("fa-minus-square-o")
                .addClass("fa-plus-square-o")
                .attr("title","Expand");
        }
        else
        {
            $content.show();
            $button
                .removeClass("fa-plus-square-o")
                .addClass("fa-minus-square-o")
                .attr("title","Collapse");
        }
    });

    console.log("Initializing Artemis interface");
    var obj = localstorage_obj("artemis_appearance");
    if($.type(obj) === "object")
    {
        artemis_css(obj);
        console.log("Appearance loaded");
    }
    obj = localstorage_obj("artemis_settings");
    if($.type(obj) === "object")
    {
        app_settings(obj);
        console.log("Settings loaded");
    }

    obj = localstorage_obj("artemis_groups");
    if($.type(obj) === "array")
    {
        $.each(obj,function() {new group(this);});
        console.log("Groups loaded");
    }

    obj = localstorage_obj("artemis_watchers");
    if($.type(obj) === "array")
    {
        $.each(obj,function() {new watcher(this);});
        console.log("Watchers loaded");
    }

    console.log("Artemis ready");

    //ui functions
    $("#artemis #interface").sortable({placeholder:"ui-group-placeholder",forcePlaceholderSize:true});
    $(".watcher_list").sortable({connectWith:".watcher_list",placeholder:"ui-watcher-placeholder",forcePlaceholderSize:true});
    $(".floats").draggable({handle:"h1.head"});
    $(".remembers").on("dragstop",function() {
        localStorage.setItem("artemis_pos-"+$(this).attr("id"),($(this).css("left")+","+$(this).css("top")));
    });
    $(".ui-draggable-handle, .ui-sortable-handle").disableSelection();

    $(".information").each(function() {
        if(this.hasAttribute("data-tooltip"))
        {
            $(this)
                .attr("title","Click to open this help topic")
                .click(function() {system_help($(this).attr("data-tooltip"));});
        }
        else if(this.hasAttribute("data-action")) $(this).click(function() {system_action($(this).attr("data-action"));});
    });

    $(window).unload(function() {
        store_groups();
        store_watchers();
    });
});
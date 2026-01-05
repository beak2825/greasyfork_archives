// ==UserScript==
// @name         osu! PP Save
// @version      1.5.1
// @description  A Simple script to save users pp to compare later.
// @author       Rafael Moreira Fonseca
// @match        https://osu.ppy.sh/*
// @icon         http://osu.ppy.sh/favicon.ico
// @namespace    https://twitter.com/RafaelMoreiraFo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15929/osu%21%20PP%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/15929/osu%21%20PP%20Save.meta.js
// ==/UserScript==
/*jslint browser: true*/
/*jslint jquery: true*/

/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * https://github.com/tzuryby/jquery.hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
 */

/*
 * One small change is: now keys are passed by object { keys: '...' }
 * Might be useful, when you want to pass some other data to your handler
 */

(function(jQuery) {

  jQuery.hotkeys = {
    version: "0.2.0",

    specialKeys: {
      8: "backspace",
      9: "tab",
      10: "return",
      13: "return",
      16: "shift",
      17: "ctrl",
      18: "alt",
      19: "pause",
      20: "capslock",
      27: "esc",
      32: "space",
      33: "pageup",
      34: "pagedown",
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
      45: "insert",
      46: "del",
      59: ";",
      61: "=",
      96: "0",
      97: "1",
      98: "2",
      99: "3",
      100: "4",
      101: "5",
      102: "6",
      103: "7",
      104: "8",
      105: "9",
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      112: "f1",
      113: "f2",
      114: "f3",
      115: "f4",
      116: "f5",
      117: "f6",
      118: "f7",
      119: "f8",
      120: "f9",
      121: "f10",
      122: "f11",
      123: "f12",
      144: "numlock",
      145: "scroll",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'"
    },

    shiftNums: {
      "`": "~",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      ";": ": ",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
      "\\": "|"
    },

    // excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
    textAcceptingInputTypes: [
      "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
      "datetime-local", "search", "color", "tel"],

    // default input types not to bind to unless bound directly
    textInputTypes: /textarea|input|select/i,

    options: {
      filterInputAcceptingElements: true,
      filterTextInputs: true,
      filterContentEditable: true
    }
  };

  function keyHandler(handleObj) {
    if (typeof handleObj.data === "string") {
      handleObj.data = {
        keys: handleObj.data
      };
    }

    // Only care when a possible input has been specified
    if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
      return;
    }

    var origHandler = handleObj.handler,
      keys = handleObj.data.keys.toLowerCase().split(" ");

    handleObj.handler = function(event) {
      //      Don't fire in text-accepting inputs that we didn't directly bind to
      if (this !== event.target &&
        (jQuery.hotkeys.options.filterInputAcceptingElements &&
          jQuery.hotkeys.textInputTypes.test(event.target.nodeName) ||
          (jQuery.hotkeys.options.filterContentEditable && jQuery(event.target).attr('contenteditable')) ||
          (jQuery.hotkeys.options.filterTextInputs &&
            jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1))) {
        return;
      }

      var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
        character = String.fromCharCode(event.which).toLowerCase(),
        modif = "",
        possible = {};

      jQuery.each(["alt", "ctrl", "shift"], function(index, specialKey) {

        if (event[specialKey + 'Key'] && special !== specialKey) {
          modif += specialKey + '+';
        }
      });

      // metaKey is triggered off ctrlKey erronously
      if (event.metaKey && !event.ctrlKey && special !== "meta") {
        modif += "meta+";
      }

      if (event.metaKey && special !== "meta" && modif.indexOf("alt+ctrl+shift+") > -1) {
        modif = modif.replace("alt+ctrl+shift+", "hyper+");
      }

      if (special) {
        possible[modif + special] = true;
      }
      else {
        possible[modif + character] = true;
        possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

        // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
        if (modif === "shift+") {
          possible[jQuery.hotkeys.shiftNums[character]] = true;
        }
      }

      for (var i = 0, l = keys.length; i < l; i++) {
        if (possible[keys[i]]) {
          return origHandler.apply(this, arguments);
        }
      }
    };
  }

  jQuery.each(["keydown", "keyup", "keypress"], function() {
    jQuery.event.special[this] = {
      add: keyHandler
    };
  });

})(jQuery || this.jQuery || window.jQuery);

// Script
$(window).ready(function() {
    
    var pathname = $.trim(window.location.pathname); 
    
    // Images
    var configImage = "data:image/png;base64,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";
    var configImageMini = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZ0lEQVR4XnWTzU8TURTFz7QzlQCaSUA21VVdQEssClsSxgVx574xdsEKlWAFCSHItwq0KKtq/QOIUUMtG2tj0najLmBj+gWJpgaHDWKK0lbtx3PuSycZSHqSycm59/duZ15uUU++x6vMu/KEkddjGGMw6WHJu7KhPUE9l0olXHe5uOtaXPYdaMwbnNSjJe9GMLTBXq8H2ez8g/25hYfs6bPn7G3kPXctU71KfeKIP/YGxWKx4fDwFxx2BxRFaXW7b6BPUXBKsqC3txeUFaVPoD5xxKMmoea2+9Nzmw6HXbZarTj6fcSnC4IAXc2nm6GqKpLJZG5+droHwBfDHVCoyl3OiygUioAgILOzg1Q6jcz2Nv7++8PrXU4nDZaJR02mmbkFNjk1w9raWnGUL8AiSchk0viW/br+6uWLa1nNs9ks1bV+HsQRT+f4gEqlgoGBAfT3X0WhWIBkkVAul5FOpVY/ffzwjrxUKlOd+sRxns6R+CcEAgHE43FYRAtEswhRFNF16bJ7YnLKSk6Z6tQnjnjjJXZTGB0b33S5XPzXc7kcEokE3wFJktDZ2QlZlvngtbU1+JYXe2qLtCUC2KJQZVWm7qrCufNWnG1pwRVFgS5WrfKL/b6r0qvn9DP6J2BsfOKgo71DaLe3Q93bQ0NjI0RJgslsJqfM69S32+2yxgePDcjn859NJhOi0SjC4XDO7/cjFAqhuamJO+VIJMJisRg0jhbpDE7INnhrKD5483YUgJPuZWjYw/Z//GTklOm5c3f0UGNiAC7oq2wUFW168IzcY8OeEUZuYJxGhm8r6qvbELbq/Z3/A4k5Pi5ig5d/AAAAAElFTkSuQmCC";

    // Create styles
    var styles = ".ppButton{background:rgba(0,0,0,0.07);border-radius:5px;border:1px solid rgba(0,0,0,0.07);padding: 1px 14px;font-size:13px;float:right;cursor:pointer;}";
        styles += ".deleteppButton{background: #ffe2fa;border-radius:5px;border: solid 1px #ffbff1;padding: 1px 14px;font-size:13px;float:right;cursor:pointer;}";
        styles += ".oldPP{font-size:80%;color:green;float:right;margin:2px 10px;}";
        styles += ".alertPP{font-size:80%;color:red;float:right;margin:2px 5px;}";
        styles += ".morePP{color: #3843a6;}";
        styles += ".arrow{font-family: Verdana,sans-serif;}";
        styles += ".saveAllPP{background:rgba(0,0,0,0.07);margin:3px;border-radius:5px;border:1px solid rgba(0,0,0,0.07);padding: 1px 14px;font-size:13px;float:right;cursor:pointer;}";
        styles += ".oldPPTable{color:green;margin-left:10px;float:right;}";
        styles += ".oldPPTableUpdated{color: #3843a6;margin-left:10px;float:right;}";
        styles += ".noPPTable{color:black;margin-left:10px;float:right;}";
        styles += ".alertReload{font-size:14px;color:red;float:right;margin:4px 5px;}";
        styles += ".updateAllButton, .saveAllButton{margin-top: 3px;margin-left:5px;}";
        styles += ".configIcon{background: rgba(0, 0, 0, 0.2) url('"+configImage+"') no-repeat 5px 10px;border:1px solid rgba(0, 0, 0, 0.3);border-top:0px;position:fixed;width:32px;height:32px;padding: 10px 5px 5px 5px;opacity:0.5;margin-right:15px;top:0;right:0;cursor:pointer;}";
        styles += ".configIcon:hover{opacity:1;}";
        styles += ".configIconMini{background: rgba(0, 0, 0, 0.2) url('"+configImageMini+"') no-repeat 5px 10px;border:1px solid rgba(0, 0, 0, 0.3);border-top:0px;position:fixed;width:16px;height:16px;padding: 10px 5px 5px 5px;opacity:0.5;margin-right:15px;top:0;right:0;cursor:pointer;}";
        styles += ".configIconMini:hover{opacity:1;}";
        styles += ".nanoModal {width:580px;position: absolute;top: 0px;display: none;z-index: 10000;padding: 15px 20px 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;background: #fff;}";
        styles += ".nanoModalOverlay {position: fixed;top: 0;left: 0;bottom:0;right:0;width: 100%;height: 100%;z-index: 9999;background: #000;display: none;-ms-filter: 'alpha(Opacity=50)';-moz-opacity: .5;-khtml-opacity: .5;opacity: .5;}";
        styles += ".nanoModalButtons {margin-top: 15px;text-align: right;position: absolute;right: 10px;top: -10px;}";
        styles += ".nanoModalButtons .nanoModalBtnPrimary {background-color: #efefef;color: #333;border: 1px solid silver;cursor: pointer;display: inline-block;font-size: 14px;margin: 8px 4px 0;padding: 6px 12px;text-align: center;vertical-align: middle;white-space: nowrap;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;-khtml-border-radius: 4px;border-radius: 4px;}";
        styles += ".nanoModalButtons .nanoModalBtnPrimary:hover {background-color:#e2e2e2;}";
        styles += ".copyrights{text-align:right;display:block;padding:5px 0px;font-size:11px;color: #777;font-weight:normal;}";
        styles += "#nanoModal .btnmain {cursor:pointer;padding:5px 10px;}";

    // Some JSON useful functions
    Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    }
    
    Storage.prototype.setObject = function(key, userName, gameMode, userValue) {
        var getValue = localStorage.getObject('usersPP');
        if(getValue == null){
            var getValue = {};
            getValue[userName] = {"gm-0":"", "gm-1":"", "gm-2":"", "gm-3":""};
        }else{
            if(getValue[userName] == null){
                getValue[userName] = {"gm-0":"", "gm-1":"", "gm-2":"", "gm-3":""};
            }
        }
        getValue[userName][gameMode] = userValue;
        this.setItem(key, JSON.stringify(getValue));
    }

    //Another Useful Functions
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
            return null;
        }
        else{
            return results[1] || 0;
        }
    }
    
    //Osu! website useful functions
    function saveCurrentGameMode(userPP){
        var userName = $.trim($(".profile-username").html());
        var userCurrentMode = $(".profileGameModes").find(".active").attr("id");

        localStorage.setObject('usersPP', userName, userCurrentMode, userPP);
        $("#saveUserPP").css("border","1px solid green");
        if(getConfigValue("reloadPage") == "yes"){
            location.reload();
        }else{
            showReloadAlert();
        }
    }
    
    function deleteCurrentUser(userName){
        var getValue = localStorage.getObject('usersPP');
        delete getValue[userName];
        localStorage.setItem('usersPP', JSON.stringify(getValue));
        
        $("#deleteUserPP").css("border","1px solid red");
        showReloadAlert();
    }
    
    function showReloadAlert(){
        var oldPP = $('.oldPP');
        if(oldPP.length > 0){
            oldPP.addClass("alertPP");
            oldPP.html("Reload the page.");
        }else{
            $(".profileStatLine").first().append("<span class='oldPP alertPP'>Reload the page.</span>");
        }
    }
        
    function showOldPP(){
        var userName = $.trim($(".profile-username").html());
        var userCurrentMode = $(".profileGameModes").find(".active").attr("id");
        var getValue = localStorage.getObject('usersPP');
        if(getValue != null){
            var oldPP = getValue[userName][userCurrentMode];
            $(".profileStatLine").first().append("<span class='oldPP'>"+oldPP+"</span>");
        }
        
    }
    
    function countProgress(currentPP, currentPerformance){
        var userName = $.trim($(".profile-username").html());
        var userCurrentMode = $(".profileGameModes").find(".active").attr("id");
        var getValue = localStorage.getObject('usersPP');
        if(getValue != null){
            var oldPP = getValue[userName][userCurrentMode];
            if(oldPP != ""){
                var justOldPP = parsePP(oldPP);
                var justNewPP = parsePP(currentPP);
                var countPP = justNewPP - justOldPP;
                
                var splitPP = currentPP.split("(");
                var arrow = "&#x25B2;";
                if(countPP < 0){ arrow = "&#x25BC;"; }
                var newCurrentPP = ": " +splitPP[0] + " <span class='morePP'>(<span class='arrow'>" + arrow + "</span>" + countPP + "pp)</span> " + splitPP[1].replace(")","");
                
                $(".profileStatLine b").first().html(currentPerformance+newCurrentPP);
            }
        }
    }
    
    function parsePP(numberPP){
        return parseInt($.trim($.trim(numberPP.split("(")[0]).replace("pp","").replace(",",""))); 
    }
    
    // Some Config useful functions
    function Initialize(){
        var getConfig = localStorage.getObject('config');
        if(getConfig == null){
            var config = { "changeTableColor" : "yes", "showConfigButton" : "yes", "reloadPage" : "no", "autoLeaveSave" : "no", "oddcolor" : "#A9A9FF", "evencolor" : "#b2b2ff", "hovercolor" : "#F0ECFA", "iconSize" : "32px", "configKey" : "shift+y" };
            localStorage.setItem('config', JSON.stringify(config));
        }
    }
    
    Initialize();
    
    function setConfigValue(configName, configValue){
        var getConfig = localStorage.getObject('config');
        getConfig[configName] = configValue;
        localStorage.setItem('config', JSON.stringify(getConfig));
    }
    
    function getConfigValue(configName){
        var getConfig = localStorage.getObject('config');
        return getConfig[configName];
    }
    
    // Table styles
    styles += ".oddTable{background-color:"+getConfigValue("oddcolor")+";}";
    styles += ".evenTable{background-color:"+getConfigValue("evencolor")+";}";
    styles += ".oddTable:hover, .evenTable:hover{background:"+getConfigValue("hovercolor")+"!important;}";
    
    $('<style type="text/css">'+styles+'</style>').appendTo($('head'));
    
    // Configuration
    if(getConfigValue("showConfigButton") == "yes"){
        if(getConfigValue("iconSize") == "32px"){
            $("body").prepend('<div class="configIcon" id="configButton"></div>');
        }else if(getConfigValue("iconSize") == "16px"){
            $("body").prepend('<div class="configIconMini" id="configButton"></div>');
        }
    }
    
    var windowWidth = $(window).width();
    var modalLeft = (windowWidth / 2) - 290;
    $("body").append('<div class="nanoModalOverlay nanoModalOverride" id="nanoModalOverlay" style="display:none;"></div>');
    $("body").append('<div class="nanoModal" id="nanoModal" style="display:none;left:'+modalLeft+'px;"></div>');
    $("#nanoModal").prepend('<div class="nanoModalButtons" style="display: block;"><button class="nanoModalBtnPrimary">x</button></div>');
    
    // Fields types
    var FieldTypes = {
        Text : 1,
        YesNo : 2,
        Select : 3,
        Textarea: 4
    };
    
    // Configuration fields
    function addConfig(fieldType, fieldText, fieldComment, fieldName, fieldValue){
        var fieldContent;
        switch(fieldType){
            case FieldTypes.Text:
                fieldContent = '<tr><td class="row1" width="35%"><b class="genmed">'+fieldText+': </b>';
                fieldContent += (fieldComment) ? '<br><span class="gensmall">'+fieldComment+'</span>' : '';
                fieldContent += '</td><td class="row2"><input class="post" type="text" name="'+fieldName+'" size="30" maxlength="255" value="'+fieldValue+'"></td></tr>';
                break;
            case FieldTypes.YesNo:
                fieldContent = '<tr><td class="row1" width="35%"><b class="genmed">'+fieldText+': </b>';
                fieldContent += (fieldComment) ? '<br><span class="gensmall">'+fieldComment+'</span>' : '';
                fieldContent += '</td><td class="row2"><input type="radio" class="radio" name="'+fieldName+'" value="1"';
                fieldContent += (fieldValue == "yes") ? "checked='checked'" : "";
                fieldContent += '><span class="genmed">Yes</span>&nbsp;&nbsp;<input type="radio" class="radio" name="'+fieldName+'" value="0"';
                fieldContent += (fieldValue == "no") ? "checked='checked'" : "";
                fieldContent += '><span class="genmed">No</span></td></tr>';
                break;
            case FieldTypes.Textarea:
                fieldContent = '<tr><td class="row1" width="35%"><b class="genmed">'+fieldText+': </b>';
                fieldContent += (fieldComment) ? '<br><span class="gensmall">'+fieldComment+'</span>' : '';
                fieldContent += '</td><td class="row2"><textarea class="post" name="'+fieldName+'" rows="3" cols="30">'+fieldValue+'</textarea></td></tr>';
                break;
        }
        $("#nanoModal .tablebg").append(fieldContent);
    }
    
    function addConfigSelect(fieldText, fieldComment, fieldName, fieldParams, fieldValue){
        var fieldContent;
        fieldContent = '<tr><td class="row1" width="35%"><b class="genmed">'+fieldText+': </b>';
        fieldContent += (fieldComment) ? '<br><span class="gensmall">'+fieldComment+'</span>' : '';
        fieldContent += '</td><td class="row2"><select name="'+fieldName+'">';
        for (i = 0; i < fieldParams.length; i++) {
            fieldContent += '<option value="'+fieldParams[i]+'"';
            fieldContent += fieldValue == fieldParams[i] ? 'selected="selected"' : '';
            fieldContent += '>'+fieldParams[i]+'</option>';
        }
        $("#nanoModal .tablebg").append(fieldContent);
    }
    
    function addConfigSpacer(){
        var fieldContent = '<tr><td colspan="2" class="spacer"></td></tr>';
        $("#nanoModal .tablebg").append(fieldContent);
    }
    
    function getConfig(fieldType, fieldName){
        switch(fieldType){
            case FieldTypes.Text:
                return $("input[name="+fieldName+"]").val();
                break;
            case FieldTypes.YesNo:
                return ($("input:radio[name="+fieldName+"]:checked").val() == "1") ? "yes" : "no";
                break;
            case FieldTypes.Select:
                return $("select[name="+fieldName+"]").val();
                break;
            case FieldTypes.Textarea:
                return $("textarea[name="+fieldName+"]").val();
                break;
        }
    }
    
    // Required HTML on Configuration
    $("#nanoModal").append('<h1>Script Configuration</h1>');
    $("#nanoModal").append('<table class="tablebg" width="100%" cellspacing="1"><tbody></tbody></table>');
    
    // Configurations
    addConfig(FieldTypes.YesNo, "Change ranking's table color?", "", "changeTableColor", getConfigValue("changeTableColor"));
    addConfig(FieldTypes.YesNo, "Show config button?", "Or you can press the shortcut.", "showConfigButton", getConfigValue("showConfigButton"));
    addConfig(FieldTypes.YesNo, "Reload page on Save/Update PP?", "Or just show the alert.", "reloadPage", getConfigValue("reloadPage"));
    addConfig(FieldTypes.YesNo, "AutoSave when leaving userpage?", "Or just save manually.", "autoLeaveSave", getConfigValue("autoLeaveSave"));
    addConfigSpacer();
    addConfig(FieldTypes.Text, "Table's Odd Row Color", "", "oddcolor", getConfigValue("oddcolor"));
    addConfig(FieldTypes.Text, "Table's Even Row Color", "", "evencolor", getConfigValue("evencolor"));
    addConfig(FieldTypes.Text, "Table's Hover Row Color", "", "hovercolor", getConfigValue("hovercolor"));
    addConfigSelect("Configuration icon size", "just for fun", "iconSize", ["16px", "32px"], getConfigValue("iconSize"));
    addConfigSpacer();
    addConfig(FieldTypes.Text, "Configuration shortchut", "This shortcut will open the configuration window.", "configKey", getConfigValue("configKey"));
    
    // Add Configuration Button
    $("#nanoModal .tablebg").append('<tr><td class="cat" colspan="2" align="center"><input class="btnmain" type="submit" name="updateScript" id="updateScript" value="Save"></td></tr>');
    
    // Add Copyrights
    $("#nanoModal").append('<div class="copyrights">Created by <a href="https://osu.ppy.sh/u/1458651">PixelRafael</a></div>');
    
    // Save configuration
    $("#updateScript").click(function(){
        setConfigValue("changeTableColor", getConfig(FieldTypes.YesNo, "changeTableColor"));
        setConfigValue("showConfigButton", getConfig(FieldTypes.YesNo, "showConfigButton"));
        setConfigValue("autoLeaveSave", getConfig(FieldTypes.YesNo, "autoLeaveSave"));
        setConfigValue("reloadPage", getConfig(FieldTypes.YesNo, "reloadPage"));
        setConfigValue("oddcolor", getConfig(FieldTypes.Text, "oddcolor"));
        setConfigValue("evencolor", getConfig(FieldTypes.Text, "evencolor"));
        setConfigValue("hovercolor", getConfig(FieldTypes.Text, "hovercolor"));
        setConfigValue("iconSize", getConfig(FieldTypes.Select, "iconSize"));
        setConfigValue("configKey", getConfig(FieldTypes.Text, "configKey"));
        if(getConfigValue("reloadPage") == "yes"){
            location.reload();
        }
    });
    
    // Functions open Modal
    function openModal(){
        var scrollTop = parseInt($(window).scrollTop());
        var modalTop = scrollTop + 20;
        $("#nanoModalOverlay").fadeIn(200);
        $("#nanoModal").css('top', modalTop+'px').fadeIn(200);
        $(".nanoModalButtons").fadeIn(200);
    }
    
    function closeModal(){
        $("#nanoModalOverlay").fadeOut(200);
        $("#nanoModal").fadeOut(200);
        $(".nanoModalButtons").fadeIn(200);
    }
    
    // Show config
    $("#configButton").click(function(){
        openModal();
    });
    
    // Close config
    $("#nanoModalOverlay, .nanoModalBtnPrimary, #updateScript").click(function(){
        closeModal();
    });
    
    // Configuration shortcut
    $(document).on('keydown', null, getConfigValue("configKey"), function(){
        if($("#nanoModalOverlay").is(":visible")){
            closeModal();
        }else{
            openModal();
        }
    });
    
    // Userpage
    if(pathname.indexOf("/u/") > -1){
        
        // Variable to save PP
        var currentPP;
        var currentPerformance;
        
    	// Add the button when the game mode changes
    	document.getElementById("general").addEventListener("DOMNodeInserted", function (ev) {
            
            // Check general div
    		if($('#saveUserPP').length == 0 && $('.profileStatLine').first().length > 0 && $('#chart1').length > 0){
                
                // Save current PP
                currentPP = $.trim($.trim($(".profileStatLine b").html()).split(":")[2]);
                
                // Check play
                if(currentPP != "-"){
                    currentPerformance = $(".profileStatLine b a")[0].outerHTML;

                    // Show save button
                    $(".profileStatLine").first().append("<div id='saveUserPP' class='ppButton'>SavePP</div>");
                    
                    //Show delete button
                    var getValue = localStorage.getObject('usersPP');
                    
                    try{
                        
                        var userName = $.trim($(".profile-username").html());
                        
                        if(userName in getValue){
                            
                             // Show delete button
                            $("<div id='deleteUserPP' class='deleteppButton'>DeletePP</div>").insertAfter($(".profileStatLine").first());

                            // Add click event to the delete button
                            $("#deleteUserPP").click(function(){
                                var deleteConfirm = confirm("Are you sure you want to delete?");
                                if(deleteConfirm){
                                    deleteCurrentUser(userName);
                                }
                            });
                            
                        }
                        
                    }catch(e){ }

                    // Add click event to the button
                    $("#saveUserPP").click(function(){
                        saveCurrentGameMode(currentPP);
                    });

                    // Show the old PP
                    showOldPP();

                    // Count
                    countProgress(currentPP, currentPerformance);
                    
                    // Auto save when leaves page
                    if(getConfigValue("autoLeaveSave") == "yes"){
                        var userCurrentMode = $(".profileGameModes").find(".active").attr("id");
                        localStorage.setObject('usersPP', userName, userCurrentMode, currentPP);
                    }
                }
    		}
    		
    	}, false);

        
   	}else if(pathname.indexOf("/p/pp") > -1){
        
        //getCurrentGameMode
        var userCurrentMode = $.urlParam("m");
        if(userCurrentMode == null){
            userCurrentMode = 0;
        }
        userCurrentMode = "gm-"+$.trim(userCurrentMode);
        
        // Add update button
        $("#tablist").append("<div id='addAllPP' class='ppButton saveAllButton'>Save All PPs</div><div id='saveAllPP' class='ppButton updateAllButton'>Update All PPs</div>");
        
        var getValue = localStorage.getObject('usersPP');
        
        
       // Add click event to the update button
        $("#addAllPP").click(function(){
            var saveConfirm = confirm("Are you sure you want to save all users pp and save it?");
            if(saveConfirm){
                $(".beatmapListing tr").each(function(){
                    var classList = $.trim($(this).attr("class")).toString().split(" ")[0];
                    if(classList == "row1p" || classList == "row2p"){
                        var userName = $.trim($(this).children(":nth-child(2)").children("a").text());
                        var currentPP = $.trim($(this).children(":nth-child(5)").children().contents().get(0).nodeValue);
                        var currentRank = $.trim($(this).children(":nth-child(1)").children("b").text());
                        var userCurrentRank = currentPP + " ("+ currentRank + ")";
                        localStorage.setObject('usersPP', userName, userCurrentMode, userCurrentRank);
                    }
                });
                $("#addAllPP").css("border","1px solid green");
                if(getConfigValue("reloadPage") == "yes"){
                    location.reload();
                }else{
                    var oldPP = $('.oldPP');
                    if(oldPP.length > 0){
                    }else{
                        $("#tablist").append("<span class='oldPP alertReload'>Reload the page.</span>");
                    }
                }
            }
        });
        
        // Add click event to the update button
        $("#saveAllPP").click(function(){
            var updateConfirm = confirm("Are you sure you want to update all users pp and save it?");
            if(updateConfirm){
                $(".beatmapListing tr").each(function(){
                    var classList = $.trim($(this).attr("class")).toString().split(" ")[0];
                    if(classList == "row1p" || classList == "row2p"){
                        var userName = $.trim($(this).children(":nth-child(2)").children("a").text());
                        if(getValue != null){
                            if(userName in getValue){
                                var currentPP = $.trim($(this).children(":nth-child(5)").children().contents().get(0).nodeValue);
                                var currentRank = $.trim($(this).children(":nth-child(1)").children("b").text());
                                var userCurrentRank = currentPP + " ("+ currentRank + ")";
                                localStorage.setObject('usersPP', userName, userCurrentMode, userCurrentRank);
                            }
                        }
                    }
                });
                $("#saveAllPP").css("border","1px solid green");
                if(getConfigValue("reloadPage") == "yes"){
                    location.reload();
                }else{
                    var oldPP = $('.oldPP');
                    if(oldPP.length > 0){
                    }else{
                        $("#tablist").append("<span class='oldPP alertReload'>Reload the page.</span>");
                    }
                }
            }
        });
        
        // Add scores on table
        $(".beatmapListing tr").each(function(){
            var classList = $(this).attr('class');
            if(classList == "row1p" || classList == "row2p"){
                
                var userName = $.trim($(this).children(":nth-child(2)").children("a").text());
                try{
                    if(getValue != null){
                        
                        // Show score
                        var oldPP = getValue[userName][userCurrentMode];
                        var currentPP = $.trim($(this).children(":nth-child(5)").text());
                        var oldPPCompare = $.trim(oldPP.split("(")[0]);
                        var classPP = "oldPPTable";
                        if(currentPP != oldPPCompare){
                            classPP = "oldPPTableUpdated";
                        }
                        $(this).children(":nth-child(5)").css("width","150px").children("span").append("<span class='"+classPP+"'>"+oldPP+"</span>");
                        
                        // Change table color
                        if(getConfigValue("changeTableColor") == "yes"){
                            if(classList == "row1p") $(this).addClass("evenTable");
                            if(classList == "row2p") $(this).addClass("oddTable");
                        }

                    }
                }catch(e){
                    $(this).children(":nth-child(5)").css("width","150px").children("span").append("<span class='noPPTable'> - </span>");
                }
            }
        });
        
    }
});
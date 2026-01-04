// ==UserScript==
// @name         ServiceNow Switch
// @namespace    snowswitch.quinten.vandenberghe.be
// @version      3.2.4
// @description  A command box for ServiceNow
// @author       Quinten Van den Berghe
// @match        https://*.service-now.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.notification
// @grant       GM_notification
// @downloadURL https://update.greasyfork.org/scripts/376937/ServiceNow%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/376937/ServiceNow%20Switch.meta.js
// ==/UserScript==

(function() {

    'use strict';


    //alert(JSON.stringify(GM_getValue('domaincontroller')));
    //GM_deleteValue('domaincontroller');


    // global commandMap
    var commandMap = {};

    // ++++++++++++++++++++++ COMMANDS ++++++++++++++++++++++ \\


            function getCurrentPrefix(){
        return location.host.replace('.service-now.com','');
    }

     function getDomainController(){
        return GM_getValue('domaincontroller');
    }

    function getAllDomains(){
        var domains = [];
        for(var d in getDomainController()){
            domains.push(d);
        }
        return domains;
    }

     function setDomainController(controller){
       GM_setValue('domaincontroller',controller);
    }

    function getDomainRecord(location){
       var newDom = (location) ? location: getCurrentPrefix();
       var controller = getDomainController();
        return controller[newDom];
    }

    function createDomain(location){
        var controller = getDomainController();
        var loc = {};
        loc.buttons = [];

        controller[location] = loc;
        setDomainController(controller);
    }

    function setDomainRecord(location, record){
        var controller = getDomainController();
        controller[location] = record;
        setDomainController(controller);
    }

    function initializeDomainController(){
        var obj = {};
     if(!getDomainController()){
        setDomainController(obj);
     }
    }

    function domainFound(location){
       if(getAllDomains().indexOf(location) > -1){
           return true;
       }
        return false;
    }

    function initializeDomain(domain){
        var domainController = getDomainController();
        var newDom = (domain) ? domain: getCurrentPrefix();

        if(!domainFound(newDom)){
        createDomain(newDom);
        }
    }

    function pushButton(domain, button){
        var controller = getDomainController();
        var domainRecord = getDomainRecord(domain);

        domainRecord.buttons.push(button);
        controller[domain] = domainRecord;

        for(var i = 0; i < domainRecord.buttons.length; i++){
       controller[domainRecord.buttons[i].prefix] = domainRecord;
        }
        setDomainController(controller);
    }


    function getDomainButtons(domain){
        var d = getDomainRecord(domain);
        return d.buttons
    }



    function resetDomain(domain, isCurrentDomain){

        var controller = getDomainController();
        var buttons = getDomainButtons(domain);
        for(var i = 0; i< buttons.length; i++){
           delete controller[buttons[i].prefix];
        }

        if(isCurrentDomain){
           delete controller[getCurrentPrefix()];
           }

        setDomainController(controller);
    }

    function buttonFound(domain,prefix){
     var record = getDomainRecord(domain.toLowerCase());
     var found = false;

        for(var i = 0; i < record.buttons.length; i++) {
            if (record.buttons[i].prefix == prefix) {
                found = true;
                break;
            }
        }

        return found;
    }

    function isIframe(){
        if (window.top != window.self){
            return true;
        }
       return false;
    }

    function resetDomainController(){
        var controller = {};
        setDomainController(controller);
        initializeDomain();
    }

    function getNewUrl(target){

        var targetDomain = target.replace('qvdb-switch-','');
        var parameters = (location.pathname+location.search).substr(1);
        var beginUrl = window.location.protocol + "//";
        var navUrl = beginUrl + targetDomain + ".service-now.com/" + parameters;
        return navUrl;
    }

    function getCurrentDomainUrl(){

        var targetDomain = getCurrentPrefix();
        var beginUrl = window.location.protocol + "//";
        var navUrl = beginUrl + targetDomain + ".service-now.com/";
        return navUrl;

    }


    function navigateUrl(url, newPage){
        if(newPage){
            var win = window.open(url, '_blank');
            win.focus();
        }else{
           window.location.href = url;
        }
    }

    function newTabEnabled(){
     return GM_getValue('snowswitch-new-page') == true;
    }

    function setNewTabEnabled(bool){
     GM_setValue('snowswitch-new-page',bool);
    }

    function getTextSize(){
        if(GM_getValue('snowswitch-text-size')){
           return GM_getValue('snowswitch-text-size')
        }else{
         return '';
        }
    }

    function setTextSize(size){
        GM_setValue('snowswitch-text-size', size);
    }

    function getCommandData(cmd){

        if(!cmd){
            return commandMap;
        }
        return commandMap[cmd];
    }

    function commandExists(command){
        return getCommandData().hasOwnProperty(command);
    }


    function initializeExportRecord(){

        var obj = {};
        obj.type = '';
        obj.data = '';
        return obj;
    }


    // ================================== END API =========================== //



     function cmdAddButton(){

         var prefix = this[1];
         var label = this[2];
         var bgColor = this[3];
         var fgColor = this[4];


         // check if domain already exists

         if(buttonFound(getCurrentPrefix(),prefix)){
             alert('this domain already exists!');
             return;
            }

         // add domain to list
         var domainButton = {};
         domainButton.prefix = prefix;
         domainButton.label = label;
         domainButton.bgColor = bgColor;
         domainButton.fgColor =fgColor;


         pushButton(getCurrentPrefix(),domainButton);
         generateButtons();

     }

       function cmdReset(data){

           var environment = this[1];

           switch(environment){
               case 'all':
               var confirm = window.prompt('WARNING: resetting wil clear all data! Are you sure?','no');
               if(confirm == 'yes'){
                resetDomainController();
                alert('Data wiped!');
               }
                   break;

               case 'this':

                   resetDomain(getCurrentPrefix(), true);
                   alert('current domain has been reset!');
                   generateButtons();
                   break;
           }

             generateButtons();
        }

        function toggleNewTab(data){

            if(newTabEnabled()){
                setNewTabEnabled(false);
                alert('Opening in new tabled disabled!');
               }else{
                setNewTabEnabled(true);
                alert('Opening in new tabled enabled!');
               }

        }


        function cmdSetSize(cmd){

            if(cmd.length < 2){
                alert('Please enter a size!');
                return;
            }

            var size = Number(cmd[1]);


            if(isNaN(size)){
                alert('This is not a number!');
                return;
            }

            setTextSize(size);
            alert('Size has been set to ' + size);
            generateButtons();
        }


        function cmdOpenRecord(data){

            var cmd = this;

            if(cmd.length < 2){
             alert('invalid syntax!');
                return;
            }

            if(cmd.length < 2){
              alert('Please enter a sys_id or table and sys_id');
                return;
            }

            var newUrl = '';

            if(cmd.length == 2){
                var recordId = cmd[1];
                newUrl = getCurrentDomainUrl() + "nav_to.do?uri=task.do?sys_id=" + recordId;
            }else{
                var table = cmd[1].toLowerCase();
                recordId = cmd[2].toLowerCase();
                newUrl = getCurrentDomainUrl() + "nav_to.do?uri=" + table + ".do?sys_id=" + recordId;
            }

            navigateUrl(newUrl,newTabEnabled());

        }

        function cmdHelp(data){

            var cmd = this[0];
            var subcmd = this[1];

            if(!subcmd){

                // NO sub command, only help

                var commands = Object.keys(getCommandData()).sort();
                var cmdString = 'Type: help <command>, to show more information of this command. \n\n';

                for(var i = 0; i < commands.length; i++){
                    cmdString += '- ' + commands[i] + '\n';
                }
                alert(cmdString);
                return;
            }

            if(!commandExists(subcmd)){
                alert('This command  does not exist!');
                return;
            }

            var cmdString2 ='';

            var commandData = getCommandData(subcmd);
            var usage = commandData.usage;
            var description = commandData.description;

            cmdString2 += 'Usage: ' + usage + '\n';
            cmdString2 += 'description: ' + description;

            alert(cmdString2);
        }

        function cmdShowVersion(){
            alert('You are running version: ' + GM_info.script.version);
        }


        function cmdUpdate(){
            navigateUrl('https://greasyfork.org/en/scripts/376937-servicenow-switch',true);
        }


        function cmdExport(data){

            var target = this[1];
            var exportData = getDomainController();
            prompt("Copy the following text somewhere to later on import using the import command",JSON.stringify(exportData));
        }


    function cmdImport(data){

            var dataToImport = prompt("Paste the JSON you had before","");
            var parsedData;

        try {
            parsedData = JSON.parse(dataToImport);
        } catch(e) {
            alert("This is not a valid JSON string!");
            return;
        }

        var ok = confirm("WARNING: Already existing domains will be overwrite with the new properties. Are you sure?");
        if(!ok){
            return;
        }

        var controller = getDomainController();

        for(var prop in parsedData){

            if(!domainFound(prop)){
                createDomain(prop);

                // re import the new data in the controller
                controller = getDomainController();
            }

            var controllerLength = controller[prop].buttons.length;
            var parsedDataLength = parsedData[prop].buttons.length;
            var currentDomain = controller[prop];
            var targetDomain = parsedData[prop];
            var domainName = prop;

            if(currentDomain.buttons.length <= targetDomain.buttons.length){
                controller[prop] = targetDomain;
            }else{

                if(parsedDataLength == 0){
                    continue;
                }

                var overwrite = confirm("WARNING: the amount of buttons found is more then the data to be imported!"+
                                        "\nDo you want to overwrite?" +
                                       "\nDOMAIN: " + domainName +
                                       "\nCurrent amount of buttons: " + controllerLength +
                                       "\nImported amount: " + parsedDataLength +
                                       "\n\nClick confirm to overwrite, click cancel to keep current settings");
                if(overwrite){
                     controller[prop] = targetDomain;
                }

            }
        }

        setDomainController(controller);
        generateButtons();
        alert('Data imported!');
    }


    // ++++++++++++++++++++++ END CMD ++++++++++++++++++++++ \\



    function pushCommand(cmd, usage, description,func,format){
        var obj = {};
        obj.usage = usage;
        obj.description = description;
        obj.func = func;
        obj.format = format;
        commandMap[cmd] = obj;
    }


    function cmdBookmark(data){

        var action = this[1];
        var name = this[2];
    }


    function processCommands(){
        pushCommand('help','help','open up the help menu', cmdHelp,/^help( \w+)?$/);
        pushCommand('addbutton','addbutton <prefix> <label> <bgcolor> <txtcolor>','add a new  button',cmdAddButton,/addbutton \w+ \w+ (#[0-9a-zA-Z]+|\w+) (#[0-9]+|\w+)/);
        pushCommand('reset','reset <all|this>','Reset data',cmdReset, /reset (this|all)/);
        pushCommand('newtab','newtab','Type new tab to toggle',toggleNewTab, /^newtab$/);
        pushCommand('openrecord','openrecord <table|sys_id> [sys_id]', 'Open a record', cmdOpenRecord,/^openrecord \w+ (\w{32})?$/)
        pushCommand('version','version','Show the current version',cmdShowVersion, /^version$/);
        pushCommand('update','update','Open up the tampermonkey page',cmdUpdate, /^update$/);
        pushCommand('export','export','Export the data',cmdExport,/^export$/);
        pushCommand('import','import','import the data',cmdImport,/^import$/);

        //pushCommand('bookmark','bookmark <add|remove|update> <name>','Add,remove or set a bookmark for this instance',cmdBookmark,/^bookmark (add|remove|set) \w+/);
    }

// START CODE =================================

// don't run if it is an iFrame
    if(isIframe()){
        return;
    }

    processCommands();

    var currentPrefix = getCurrentPrefix();
    var settingButtonId = "sn-qvdb-switch-settings";

    // create new domain controller if it does not exist yet (prevent NPE)
    initializeDomainController();

    // create new domain if not exist to prevent NPE
    initializeDomain();

        // generating the toolbar
        var toolBarStyle ="position:fixed; bottom: 20px; right: 40px; max-width:500px; height:40px;";
        var buttonToolbar = document.createElement("div");
        buttonToolbar.setAttribute("style",toolBarStyle);
        buttonToolbar.setAttribute("class","btn-group");
        buttonToolbar.setAttribute("id","sswitch-button-list");

        // generating the domain buttons
         generateButtons();

        function generateButtons(){
                initializeDomainController();
                initializeDomain();

            var domainRecord = getDomainRecord();
            buttonToolbar.innerHTML = '';



            for(var i = 0; i < domainRecord.buttons.length; i++){
                var buttonStyle ="background-color: {BG-COLOR}; color:{FG-COLOR}; border-width: 1px;"
                buttonStyle = buttonStyle
                    .replace('{BG-COLOR}',domainRecord.buttons[i].bgColor)
                    .replace('{FG-COLOR}',domainRecord.buttons[i].fgColor)
                    .replace('{FONT-SIZE}',getTextSize());

                if(getCurrentPrefix() != domainRecord.buttons[i].prefix){
                    buttonStyle = "background-color:white;color:black; border-width: 1px;"
                }

                var button = document.createElement("button");
                button.setAttribute("class","btn btn-default");
                button.setAttribute("id","qvdb-switch-" + domainRecord.buttons[i].prefix);
                button.setAttribute("type","button");
                button.addEventListener("click",function(event){

                    var url = getNewUrl(event.target.id);
                    navigateUrl(url, newTabEnabled());

                });

            // check if you are on the active page
               button.setAttribute("style",buttonStyle);

            var buttonText = document.createTextNode(domainRecord.buttons[i].label);
            button.appendChild(buttonText);
            buttonToolbar.appendChild(button);
        }
        // generating the settings button
        var settingsButton = document.createElement("button");
        settingsButton.setAttribute("style","background-color: white;");
        settingsButton.setAttribute("class","btn btn-default");
        settingsButton.setAttribute("id",settingButtonId);
        var settingSpan = document.createElement("span");
        settingSpan.setAttribute("class","input-group-addon-transparent icon-cog sysparm-search-icon");
        settingsButton.appendChild(settingSpan);
        buttonToolbar.appendChild(settingsButton);

        // adding the toolbar to the body
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(buttonToolbar);

        var sButton = document.getElementById(settingButtonId);
        sButton.addEventListener("click",function(){
        var command = prompt("Type 'help' for a list of commands");
        if(command == ''){
           return;
         }
         executeCommand(command);
           });
        }

    function executeCommand(command){

        var cmd = command.split(' ');
        var cmdLabel = cmd[0].toLowerCase();


        var commandData = commandMap[cmdLabel];
        var acceptedFormat = commandData.format;
        var usage = commandData.usage;

        if(!command.match(acceptedFormat)){
            alert('Invalid format! \nUse: ' + usage);
            return;
        }

        commandData.func.call(cmd);

    }

})();
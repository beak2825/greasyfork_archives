// ==UserScript==
// @name         	PlayIt-Monkey-Script
// @namespace    	https://github.com/rkaradas
// @version      	0.5
// @description  	Configurable frontend for PlayIt Service 
// @author       	Recep Karadas
// @include      	http*
// @include      	https*
// @connect 		*
// @require      	https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @resource    	customCSS https://raw.githubusercontent.com/rkaradas/PlayIt-Monkey-Script/master/playit.css
// @grant       	GM_addStyle
// @grant       	GM_getResourceText
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/23314/PlayIt-Monkey-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/23314/PlayIt-Monkey-Script.meta.js
// ==/UserScript==



/**/
var newCSS = GM_getResourceText ("customCSS");
GM_addStyle (newCSS);



// runs at the end
(function() {
    'use strict';
    var connections = [];
    var selectedConnectionIdx = -1;
    var editingObject;
    var selectedElement;
    
    $("head").append (`<link href="//cdnjs.cloudflare.com/ajax/libs/octicons/3.5.0/octicons.min.css" rel="stylesheet" type="text/css">`);    
    /*$("head").append (`<link href="//localhost/PlayIt_Tampermonkey/playit.css" rel="stylesheet" type="text/css">`);*/
    
    var container = `
<div class='play-it-container' >
<div class='play-it-container-inner' >
<div class='play-it-sidebar' >
  <div class='octicon octicon-triangle-right play-it-play-btn' title='Send to PlayIt'> </div>
  <div class='octicon octicon-settings play-it-settings-btn' title='Settings'> </div>
  <div class='octicon octicon-settings play-it-test-btn' style='display:none !important;' > </div>
  <a href='https://github.com/rkaradas/PlayIt-Monkey-Script' title='Show on GitHub' target='_blank'><div class='octicon octicon-mark-github'> </div></a>
  <div class='play-it-settings' >
    <div class='play-it-settings-wrapper'>
      <div class='play-it-settings-header'>SETTINGS</div>
      <div class='play-it-settings-content'>
        <div class='play-it-settings-add-connection'>
          <div class='play-it-settings-add-connection-row'>
            <div><input type='text' class="play-it-settings-add-name" placeholder='Connection name, e.g. Kitchen' /></div>
            <div><input type='text' class="play-it-settings-add-ip" placeholder='Ip address, e.g. 192.168.1.49' /></div>
            <div><input type='text' class="play-it-settings-add-port" placeholder='Port (default:8181)' /></div>
            <div class='play-it-settings-add-connection-actions'><button class='play-it-settings-add octicon octicon-plus'></button></div>
          </div>
        </div>
        <div class='play-it-settings-connections'>

        </div>

      </div>
      <div class='play-it-settings-actions'>
        <button class='play-it-settings-save'>SAVE</button>
        <button class='play-it-settings-close'>CLOSE</button>
        <button class='play-it-settings-clear'>CLEAR ALL</button>

      </div>
    </div>
  </div>

</div>

  <div class="play-it-footer">
    <div>&lt;&gt;</div>
    <div>with ❤️ by </div>
    <div>R.Karadas</div>
  </div>
</div>
</div>
`;  
    
    Init();

    function Init()
    {
        editingObject = null;
        let containerEl = $(container);//.addClass("play-it-play-btn");
        
        containerEl.mouseenter(function(){
            $(this).animate({left: 0});
        });
        containerEl.mouseleave(function(){
            $(this).animate({left: "-" + $(this).css("width")});
        });
        
        containerEl.find(".play-it-settings-btn").click(function(){
            toggleSettings();
        });
        containerEl.find(".play-it-play-btn").click(function(){
            sendToKodi(location.href);
        });
        containerEl.find(".play-it-test-btn").click(function(){
            let source = document.getElementsByTagName('html')[0].innerHTML;
            let mp4Links = source.match(/(https?:\/\/.*\.mp4)/gm);
            mp4Links.forEach((itm)=>
            {
                console.log(itm);
            });
            
            //sendToKodi(location.href);
        });
        containerEl.find(".play-it-settings-close").click(function(){
            toggleSettings();
        });
        containerEl.find(".play-it-settings-save").click(function(){
            saveSettings(true);
        });
        containerEl.find(".play-it-settings-add").click(function(){
            addConnection();
        });
        containerEl.find(".play-it-settings-clear").click(function(){
            clearSettings();
        });
        
        $("body").filter(function() {
            return (self==top);
        }).prepend(containerEl);
    }
    
    // Functions
    function sendToKodi(videoUrl)
    {
        if(!selectedElement)
            loadSelectedElement();
        
        // if
        if(selectedElement){
            
            var url= "http://" + selectedElement.ip +":"+selectedElement.port + "/PlayIt";//'http://192.168.1.102:8181/PlayIt';
            console.log(url);
            var request={version:'1.1',
                         method:'playHostedVideo',
                         id:1,
                         params:{videoLink:videoUrl}
                        };
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: JSON.stringify(request),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(response) {
                    console.log("onload");
                }
            });
        }
        else{
            alert("Please select a connection first");
        }
    }


    
    function toggleSettings()
    {
        let value = $('.play-it-settings').css('opacity') == 1 ? 0 : 1;
        let disp = (value==1?"block":"none");
        console.log("value: " + value + " - " + disp);
        if(disp=="block"){
            loadSettings();
            $('body').css("overflow","hidden");
            $('.play-it-settings').css("display",disp).animate({
                opacity: value
            });
        }else{
            $('.play-it-settings').animate({
                opacity: value
            },function(){ $(this).css("display",disp); $('body').css("overflow","visible"); } );
        }
            
        
    }
    function saveSettings(toggle)
    {
        GM_setValue("connections", JSON.stringify(connections));
        GM_setValue("selectedConnectionIdx", selectedConnectionIdx);

        if(toggle)
        {
            toggleSettings();
        }
        
    }
    // this function is needed, if the user does not go to the settings
    function loadSelectedElement()
    {
        connections = JSON.parse(GM_getValue("connections","[]"));
        selectedConnectionIdx = GM_getValue("selectedConnectionIdx",-1);
        connections.forEach((connection, idx)=>{
            if(selectedConnectionIdx == idx)
                selectedElement = connection;
        });
    }
    
    function loadSettings()
    {
        
        editingObject = null;
        $(".play-it-settings-connections").html("");
        connections = JSON.parse(GM_getValue("connections","[]"));
        selectedConnectionIdx = GM_getValue("selectedConnectionIdx",-1);
        connections.forEach((connection, idx)=>{
            console.log("selectedConnectionIdx: "+ selectedConnectionIdx + "|idx: "+idx);
            if(selectedConnectionIdx == idx){
                selectedElement = connection;
            }
            addConnectionVisual(connection, (selectedConnectionIdx == idx) );
        });
    }
    function clearSettings()
    {
        $(".play-it-settings-connections").html("");
        connections = [];
        selectedConnectionIdx = -1;
        GM_deleteValue("connections");
        GM_deleteValue("selectedConnectionIdx");
    }
    function addConnection()
    {
        
        let ip = $(".play-it-settings-add-ip").val().trim();
        if(isIpV4(ip)){
            let name = $(".play-it-settings-add-name").val().trim();
            let port = parseInt($(".play-it-settings-add-port").val().trim(),10);
            name = name?name:"Kodi";
            port = isNaN(port) ? 8181 : port;
            
            let connection = {
                name: name,
                ip: ip,
                port: port
            };
            addConnectionVisual(connection, true);
            connections.push(connection);

            $(".play-it-settings-add-name").val("");
            $(".play-it-settings-add-ip").val("");
            $(".play-it-settings-add-port").val("");
            saveSettings();
        }else
        {
            alert("Ip address must be a valid ipv4 address.");
        }
    }
    // UI functions
    function addConnectionVisual(connection, isSelected)
    {
        
        if(isSelected)
        {
            setSelectedConnection();
        }
        let connectionContainer = $(`
            <div class='play-it-settings-connection' >
              <div title='`+connection.name+ `'><span class='play-it-settings-connection-name'>`+connection.name+ `</span></div>
              <div title='`+connection.ip+ `'><span class='play-it-settings-connection-ip'>`+connection.ip+ `</span></div>
              <div title='`+connection.port+ `'><span class='play-it-settings-connection-port'>`+connection.port+ `</span></div>
              <div class="play-it-settings-connection-actions">
                <button title='Remove Connection' class='play-it-settings-connection-remove octicon octicon-trashcan'></button>
                <button title='Edit Connection' class='play-it-settings-connection-edit octicon octicon-pencil'></button>
                <button title='Save' class='play-it-settings-connection-save octicon octicon-check' style='display:none' ></button>
                <button title='Select' class='play-it-settings-connection-select octicon octicon-verified' `+(isSelected?`disabled`:``)+`  ></button>
              </div>
            </div>
        `);
        
        
        $(".play-it-settings-connections").append(connectionContainer);
        connectionContainer.find(".play-it-settings-connection-remove").click(function(){
            connectionRemoveClick($(this));
        });
        connectionContainer.find(".play-it-settings-connection-edit").click(function(){
            connectionEditClick($(this));
            
        });
        connectionContainer.find(".play-it-settings-connection-save").click(function(){
            connectionSaveClick($(this));
        });
        connectionContainer.find(".play-it-settings-connection-select").click(function(){
            connectionSelectClick($(this));
        });
        if(isSelected)
        {
            selectedElement = connections[selectedConnectionIdx];
            saveSettings();
        }
    }
    function clearSelectedConnection()
    {
        selectedElement = null;
        selectedConnectionIdx = -1;
        $('.play-it-settings-connection-select').prop("disabled",false);
    }
    function setSelectedConnection(el)
    {
        $('.play-it-settings-connection-select').prop("disabled",false);
        if(el) 
            el.prop("disabled", true);
    }
    
    /**
    BEGIN Connection editing click functions
    **/
    function connectionRemoveClick(el)
    {
        if(isInEditMode())
            return;
        let parent = el.closest(".play-it-settings-connection");
        let idx = $('.play-it-settings-connection').index(parent);
        if(selectedConnectionIdx == idx)
        {
            clearSelectedConnection();
        }
        console.log(idx);
        el.closest(".play-it-settings-connection").remove();
        connections.splice(idx,1);
        printConnections();
    }
    function connectionSelectClick(el)
    {
        if(isInEditMode())
            return;
        let parent = el.closest(".play-it-settings-connection");
        let idx = $('.play-it-settings-connection').index(parent);
        console.log(idx);
        selectedConnectionIdx = idx;

        setSelectedConnection(el);
        selectedElement = connections[idx];
        saveSettings();
    }
    function connectionSaveClick(el)
    {
        let parent = el.closest(".play-it-settings-connection");
            
        let ip = parent.find(".play-it-settings-connection-ip").val().trim();
        if(isIpV4(ip)){
            let name = parent.find(".play-it-settings-connection-name").val().trim();
            let port = parseInt(parent.find(".play-it-settings-connection-port").val().trim(),10);
            name = name?name:"Kodi";
            port = isNaN(port) ? 8181 : port;

            let connection = {
                name: name,
                ip: ip,
                port: port
            };
            if(editingObject.name != connection.name ||editingObject.ip != connection.ip ||editingObject.port != connection.port)
            {
                connections[editingObject.idx].name = connection.name;
                connections[editingObject.idx].ip = connection.ip;
                connections[editingObject.idx].port = connection.port;
            }
            replaceInputWithSpan(parent, "play-it-settings-connection-name");
            replaceInputWithSpan(parent, "play-it-settings-connection-ip");
            replaceInputWithSpan(parent, "play-it-settings-connection-port");
            editingObject = null;
            saveSettings();

            parent.find(".play-it-settings-connection-save").hide();
            $(".play-it-settings-connection-edit").show();
        }else
        {
            alert("something went wrong please fix the issues");
        }
    }
    function connectionEditClick(el)
    {
        if(isInEditMode())
            return;

        let parent = el.closest(".play-it-settings-connection");
        let idx = $('.play-it-settings-connection').index(parent);
        console.log(idx);
        editingObject = {idx:idx,
                         name: parent.find(".play-it-settings-connection-name").html(),
                         ip: parent.find(".play-it-settings-connection-ip").html(),
                         port: parent.find(".play-it-settings-connection-port").html()
                        };
        replaceSpanWithInput(parent, "play-it-settings-connection-name");
        replaceSpanWithInput(parent, "play-it-settings-connection-ip");
        replaceSpanWithInput(parent, "play-it-settings-connection-port");

        parent.find(".play-it-settings-connection-save").show();
        $(".play-it-settings-connection-edit").hide();
    }
    function isInEditMode()
    {
        if(editingObject){
            alert("Already in editing mode.\nPlease save changes, before you start editing the next element. ");
            return true;
        }
        return false;
    }
    /**
    END Connection editing click functions
    **/
    function replaceSpanWithInput(parent, spanClass)
    {
        var spanEl = parent.find("." + spanClass);
        let inp = $(`<input type='text' value='`+spanEl.html()+`' />`).addClass(spanClass);
        spanEl.replaceWith(inp);
    }
    function replaceInputWithSpan(parent, inputClass)
    {
        var inputEl = parent.find("." + inputClass);
        let span = $(`<span>`+inputEl.val()+`</span>`).addClass(inputClass);
        inputEl.replaceWith(span);
    }
    
    function printConnections()
    {
        connections.forEach((connection)=>{
            console.log(connection.name);
        });
    }
    
    function isIpV4(ip) {
        var x = ip.split("."), x1, x2, x3, x4;

        if (x.length == 4) {
            x1 = parseInt(x[0], 10);
            x2 = parseInt(x[1], 10);
            x3 = parseInt(x[2], 10);
            x4 = parseInt(x[3], 10);

            if (isNaN(x1) || isNaN(x2) || isNaN(x3) || isNaN(x4)) {
                return false;
            }

            if ((x1 >= 0 && x1 <= 255) && (x2 >= 0 && x2 <= 255) && (x3 >= 0 && x3 <= 255) && (x4 >= 0 && x4 <= 255)) {
                return true;
            }
        }
        return false;
    }   
})();

   
    
    
   
    
    
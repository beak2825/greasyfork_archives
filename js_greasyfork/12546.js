// ==UserScript==
// @name         Raffles Home Page
// @namespace    http://your.homepage/
// @version      0.3
// @description  enter something useful
// @author       You
// @match        https://scrap.tf/raffles
// @grant        none
// @grant    GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/12546/Raffles%20Home%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/12546/Raffles%20Home%20Page.meta.js
// ==/UserScript==

var autoStart = false;
var autoScroll = false; // can only start 40 max raffles
var autoRefresh = false;

var autoRefreshCountdown = 600; // 10 minutes
var startCountdown = 10; // 10 seconds

var autoStartTimer;
    
var ui = $(document.createElement('div'));
ui.attr("id", "botui");
$(".panel.panel-info > .panel-body:lt(1)").append(ui);
ui.css({
    'top': '0px',
    'z-index': 9999,
    'padding': '1em',
    'color': 'white',
    'background-color': 'red'
});
ui.css('background-color', '#FF0000');

var welcome = document.createElement('div');
welcome.setAttribute("id", "welcome");
$("#botui").append(welcome);
$("#welcome").text("Bot ready");
$("#welcome").css({
    'color': 'white'
});

var buttonRun = document.createElement('a');
buttonRun.setAttribute("id", "buttonRun");
$("#botui").append(buttonRun);
$("#buttonRun").text("Run");
$("#buttonRun").css({
    'background-color': 'white',
    'color': 'red',
    'padding': '1em',
    'display': 'inline-block'
});

var buttonRefresh = document.createElement('a');
buttonRefresh.setAttribute("id", "buttonRefresh");
$("#botui").append(buttonRefresh);
$("#buttonRefresh").text("Refresh");
$("#buttonRefresh").css({
    'background-color': 'white',
    'color': 'red',
    'padding': '1em',
    'display': 'inline-block'
});
$("#buttonRefresh").hide();

var divStats = document.createElement('div');
divStats.setAttribute("id", "divStats");
$("#botui").append(divStats);

var divOptions = $(document.createElement('div'));
$("#botui").append(divOptions);
//divOptions.css('background-color', 'grey');

//################## First Checkbox

var divCheckboxWrapper1 = $(document.createElement('div'));
divCheckboxWrapper1.attr('class', "cbWrapper");
divCheckboxWrapper1.css({
    'display':'inline-block',
    "margin-right": "1em"
});
divOptions.append(divCheckboxWrapper1);

var cbAuto = $(document.createElement('input'));
cbAuto.attr('type', 'checkbox');
cbAuto.attr('id', 'cbAuto');
cbAuto.css({
    'vertical-align':'middle',
    "display":"none"
});
divCheckboxWrapper1.append(cbAuto);

var labelCbAuto = $(document.createElement('Label'));
divCheckboxWrapper1.append(labelCbAuto);
labelCbAuto.attr("for", "cbAuto");
labelCbAuto.css({
    "margin": "0",
    "width": "20px",
    "height": "20px",
    "border-radius": "10px",
    "vertical-align": "middle",
    "display": "inline-block",
    "border": "2px solid #fff",
    "cursor": "pointer",
    "margin-right": ".5em"
});

divCheckboxWrapper1.append("auto start");

var cookieAuto = loadCookie("autoStart");
if(cookieAuto == "true"){
    cbAuto.prop("checked", true);
    autoStart = true;
}

cbAuto.change(function(){
    saveCookie("autoStart", this.checked);
    autoStart = this.checked;
    if(!autoStart){
        stopAutoStartTimer();
    }
});

//################## Second Checkbox

var divCheckboxWrapper2 = $(document.createElement('div'));
divCheckboxWrapper2.attr('class', "cbWrapper");
divCheckboxWrapper2.css({
    'display':'inline-block',
    "margin-right": "1em"
});
divOptions.append(divCheckboxWrapper2);

var cbAutoScroll = $(document.createElement('input'));
cbAutoScroll.attr('type', 'checkbox');
cbAutoScroll.attr('id', 'cbAutoScroll');
cbAutoScroll.css({
    'vertical-align':'middle',
    "display":"none"
});
divCheckboxWrapper2.append(cbAutoScroll);

var labelCbAutoScroll = $(document.createElement('Label'));
divCheckboxWrapper2.append(labelCbAutoScroll);
labelCbAutoScroll.attr("for", "cbAutoScroll");
labelCbAutoScroll.css({
    "margin": "0",
    "width": "20px",
    "height": "20px",
    "border-radius": "10px",
    "vertical-align": "middle",
    "display": "inline-block",
    "border": "2px solid #fff",
    "cursor": "pointer",
    "margin-right": ".5em"
});

divCheckboxWrapper2.append("auto scroll");

var cookieAutoScroll = loadCookie("autoScroll");
if(cookieAutoScroll == "true"){
    cbAutoScroll.prop("checked", true);
    autoScroll = true;
}

cbAutoScroll.change(function(){
    saveCookie("autoScroll", this.checked);
    autoScroll = this.checked;
});

//################## Third Checkbox

var divCheckboxWrapper3 = $(document.createElement('div'));
divCheckboxWrapper3.attr('class', "cbWrapper");
divCheckboxWrapper3.css({
    'display':'inline-block',
    "margin-right": "1em"
});
divOptions.append(divCheckboxWrapper3);

var cbAutoRefresh = $(document.createElement('input'));
cbAutoRefresh.attr('type', 'checkbox');
cbAutoRefresh.attr('id', 'cbAutoRefresh');
cbAutoRefresh.css({
    'vertical-align':'middle',
    "display":"none"
});
divCheckboxWrapper3.append(cbAutoRefresh);

var labelCbAutoRefresh = $(document.createElement('Label'));
divCheckboxWrapper3.append(labelCbAutoRefresh);
labelCbAutoRefresh.attr("for", "cbAutoRefresh");
labelCbAutoRefresh.css({
    "margin": "0",
    "width": "20px",
    "height": "20px",
    "border-radius": "10px",
    "vertical-align": "middle",
    "display": "inline-block",
    "border": "2px solid #fff",
    "cursor": "pointer",
    "margin-right": ".5em"
});

divCheckboxWrapper3.append("auto refresh");

var cookieAutoRefresh = loadCookie("autoRefresh");
if(cookieAutoRefresh == "true"){
    cbAutoRefresh.prop("checked", true);
    autoRefresh = true;
}

cbAutoRefresh.change(function(){
    saveCookie("autoRefresh", this.checked);
    autoRefresh = this.checked;
});

//################## END

$("#buttonRun").click(function(){
    start();
});

$("#buttonRefresh").click(function(){
    location.reload();
});

var stylesheet = document.styleSheets[0];
var selector = ".cbWrapper input[type=\"checkbox\"]:checked + label";
var rule = "{background-color: #fff;}";
stylesheet.insertRule(selector + rule, stylesheet.cssRules.length);

if(autoStart){
    $("#buttonRun").hide();
    $("#welcome").text("Stating in " + startCountdown + " seconds");
    autoStartTimer = setInterval(function(){
        startCountdown--;
        $("#welcome").text("Stating in " + startCountdown + " seconds");
        if(startCountdown === 0){
            stopAutoStartTimer();
            start();
        }
    }, 1000);
}

function start(){
    console.log("Starting...");
    $("#buttonRun").hide();
    $("#welcome").text("Bot is working...");
    if(autoScroll == false){
        startOpening();
    } else {
        setTimeout(function(){
            checkIfBottom();
        }, 1000);
    }
};

function startOpening(){
    console.log("Start Opening...");
    var raffles = $("#raffles-list .panel-raffle");
    var total = 0;
    var current = 0;
    $("#divStats").text("");
    raffles.each(function(){
        var style = $(this).attr("style");
        if(isAvailable(style)){
            total++;
        }
    });
    if(total == 0){
        stop();
    }
    var i = 0;
    raffles.each(function(){
        var id = $(this).attr("id");
        var style = $(this).attr("style");
        if(isAvailable(style)){
            i++;
            console.log(id);
            console.log("...is available");
            var code = getCode(id);
            console.log("..." + code);
            setTimeout(function(){
                current++;
                $("#divStats").text(current + "/" + total);
                GM_openInTab("https://scrap.tf/raffles/" + code, true);
                if(current == total){
                    stop();
                }
            }, i*3000);
        }
    });
};

function stopAutoStartTimer(){
    if(autoStartTimer){
        $("#buttonRun").show();
        clearInterval(autoStartTimer);
        $("#welcome").text("Bot ready");
    }
    autoStartTimer = false;
}

function stop(){
    console.log("Stoped");
    setTimeout(function(){
        $("#welcome").text("The work is done");
        $("#buttonRefresh").show();
    }, 10000);
    if(autoRefresh === true){
        setInterval(function(){
            autoRefreshCountdown--;
            $("#welcome").text("Reloading page in " + autoRefreshCountdown + " seconds");
            if(autoRefreshCountdown === 0){
                location.reload();
            }
        }, 1000);
    }
}

function scrollToBottom(){
    console.log("Scrolling to bottom...");
    window.scrollTo(0,document.body.scrollHeight);
    setTimeout(function(){
        checkIfBottom();
    }, 3000);
};

function checkIfBottom(){
    console.log("Checking if at the bottom...");
    var text = $(".panel-body.pag-done.pag-loading").text();
    if(text == " Loading more raffles..."){
        scrollToBottom();
    } else {
        console.log("Bot Ready");
        window.scrollTo(0,0);
        startOpening();
    }
};

function getCode(code){
    return code.substring(11,17);
};
    
function isAvailable(raffleStyle){
    if(raffleStyle === ""){
        return true;
    } else {
        return false;
    }
};

function saveCookie(key, value){
    //format d'une key value pair : key=value
    document.cookie= key + "=" + value;
};

function loadCookie(key){
    key += "=";
    values = document.cookie.split(';'); //découper le cookie sur les ';'
    //parcourir le cookie
    for(var i = 0; i < values.length; i++){
        //KVP = Key Value Pair
        KVP = values[i];
        //supprimer les espaces en début de chaine
        while (KVP.charAt(0) == ' ') KVP = KVP.substring(1);
        if(KVP.indexOf(key) === 0){ // si la clef est trouvée
            return KVP.substring(key.length, KVP.length);
        }
    }
    return "";
};
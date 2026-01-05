// ==UserScript==
// @name         Proxer-Massenupload-Tool
// @namespace    
// @version      1.0.5
// @description  Dieses Script fügt der Proxer-Navigation den Massenupload hinzu
// @author       Dominik Bissinger alias Nihongasuki
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*  
// @require      https://greasyfork.org/scripts/12981-proxer-userscript-anker/code/Proxer-Userscript-Anker.js?version=81145
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/10203/Proxer-Massenupload-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/10203/Proxer-Massenupload-Tool.meta.js
// ==/UserScript==

//Starte die Funktion "addButton" beim Laden der Seite
document.addEventListener('DOMContentLoaded', function(event) {
    addButton();
});

//Fügt den Button "Massenupload" zu "Anker" hinzu
var addButton = function() {
    var test = setInterval(function () {
        if (document.getElementById('anker') !== null) {
            var ul = document.getElementById("anker");
            var li = document.createElement("li");
            li.setAttribute("id","massenupload");
            ul.appendChild(li);
            document.getElementById('massenupload').innerHTML = '<a href="javascript:;">Massenupload</a>';
            document.getElementById('massenupload').addEventListener("mouseup",function (event) {
                if (event.which === 1 || event.button === 0) {
                    replaceMain(); //starte die Funktion "replaceMain" bei Klick
                }else if (event.which === 2 || event.button === 1) {
                    var url = window.location.href;
                    localStorage.setItem("Massenupload",1);
                    window.open(url,"_blank");
                };
            });
            var locStor = localStorage.getItem("Massenupload");
            if (locStor === "1") {
                replaceMain();
                localStorage.setItem("Massenupload",0);
            };
            clearInterval(test);
        };
    },100);
};

//Lade die Subgruppen aus der Datenbank (geht nicht ohne DB), und füge sie zum form-Feld "group" hinzu
var groups = function() {
     $(".groupSelect").autocomplete({
        source:function(request,response){
            $.ajax({
                url:"/translatorgroups?format=json&s=getSearchList&search="+request.term,
                success:function(data){
                    response(
                        $.map(
                            data.list,function(item){
                                return{label:item.name+' ('+item.country+')',value:item.name+' ('+item.country+') #'+item.id}
                            }
                        )
                    );
                }
            });
         }
    });
};
  
//Starte eine sich ständig wiederholende Funktion (Intervall: 0,5 Sekunden)
var t;
var startRepeat = function () {
    t = setInterval(repeat,500);
};

//Die sich wiederholende Funktion: Starte drei Funktionen
var repeat = function () {
    autoName();
    changeLanguage();
    chAnzCheck();
    autoNameCheck();
};

//Überprüfe, ob eine Startzahl eingegeben werden darf und stelle sie entsprechend ein
var autoName = function () {
    if (document.getElementById('autoName').checked === true) {
        var minChap = document.getElementById("minChap");
        var startNumber = document.getElementById('startNumber');
        document.getElementById('startNumber').disabled = false;
        startNumber.value = minChap.value;
        document.getElementById('startNumber').disabled = true;
    }else{var startNumber = document.getElementById('startNumber').disabled = false;};
};

//Korrigiere den Text des Formulars abhängig von der Sprache
var name = "Name";
var changeLanguage = function () {
    var langSelect = document.getElementById('langSelect');
    if (langSelect.options[langSelect.selectedIndex].value === "en") {
        document.getElementById('lang').innerHTML = "Chapter";
        name = "Chapter ";
    }else{
        document.getElementById('lang').innerHTML = "Kapitel";
        name = "Kapitel ";};
};

//Hide-Show Kapitelnamensliste
var chapNamesVisible = function () {
    if (document.getElementById("chapNames").style.display === "none") {
        document.getElementById("chapNames").style.display = "block";
        document.getElementById("skip").style.display = "inline";
    }else{
        document.getElementById("chapNames").style.display = "none";
        document.getElementById("skip").style.display = "none";
    };
};

//Managed die Anzahl und Art der Kapiteltitel
var y = 0;
var u = 0;
var l = "";

var chAnzCheck = function () {
    var minChap = document.getElementById("minChap");
    var maxChap = document.getElementById("maxChap");
    var x = (maxChap.valueAsNumber - minChap.valueAsNumber) + 1;
    var numbers = minChap.valueAsNumber;
    var z = document.getElementById("startNumber").valueAsNumber;
    if (x !== y || z !== u || l !== document.getElementById("langSelect").value) {
        y = x;
        u = z;
        l = document.getElementById("langSelect").value;
        var isChecked = document.getElementById('enableRename');
        console.debug(isChecked);
        var checkedString = '';
        if (isChecked === null || isChecked.checked === true) {
            checkedString = 'checked';
        }
        document.getElementById("chapNames").innerHTML = '<span class="numbers"></span><input type="text" class="form2" name="slot-1" id="slot-1" value="Chapter 0" style="display:none"><input type="checkbox" id="check-1" style="display:none" checked></input><input type="checkbox" id="enableRename" '+checkedString+'>Automatische Benennung erlauben</input><span id="skip">Automatische Benennung aussetzen?</span><br>';
        var master = document.getElementById("chapNames");
        var i = 0;
        while (i < x) {
            var br = document.createElement("br");
            var text = document.createTextNode(name + z);
            var textNumber = document.createTextNode(numbers+ ". ");
            var element = document.createElement("input");
            var check = document.createElement("input");
            var numberSlot = document.createElement("span");
            if (numbers > 9) {
                if (numbers > 99) {
                    numberSlot.setAttribute("class","h99");
                }else{numberSlot.setAttribute("class","l99");};
            }else{numberSlot.setAttribute("class","l9");};
            numberSlot.appendChild(textNumber);
            check.setAttribute("type","checkbox");
            check.setAttribute("id","check"+i);
            check.setAttribute("value",i);
            element.setAttribute("type","text");
            element.setAttribute("class","form2");
            element.setAttribute("name","slot" + i);
            element.setAttribute("id","slot" + i);
            element.setAttribute("value",name + z);
            element.appendChild(text);
            master.appendChild(numberSlot);
            master.appendChild(element);
            master.appendChild(check);
            master.appendChild(br);
            i++;
            z++;
            numbers++;
        };
    };
};

//Automatische Benennung
var o = -1;
var autoNameCheck = function () {
    if (document.getElementById('enableRename').checked !== true) {
        return;
    };
    var i = -1;
    while (i < y) {
        if (document.getElementById("check"+i).checked === true) {
            var q = i+1;
            var h = u + i - o;
            while (q < y) {
                if (document.getElementById("check"+q).checked !== true) {
                    document.getElementById("slot"+q).value = name + h;
                };
                q++;
                h++;
            };
            o++;
        };
        i++;
    };
    o = -1;
};

//ermöglicht, mehrere Subgruppen einzutragen
addGroup = function () {
    var parent = document.getElementById('group');
    var x = parent.getElementsByClassName('groupSelect').length;
    var id = x;
    var span = document.createElement('span');
    var p = document.createElement('p');
    span.innerHTML = '<span role="status" aria-live="polite" class="ui-helper-hidden-accessible">\
                      15 results are available, use up and down arrow keys to navigate.\
                      </span>\
                      <input type="text" class="groupSelect ui-autocomplete-input" id="group'+id+'" autocomplete="off"> \
                      Von Datei <input type="number" value="1" min="1" class="numberForm" id="group'+id+'min" name="group'+id+'min"></input>\
                      bis Datei <input type="number" value="1" min="1" class="numberForm" id="group'+id+'max" name="group'+id+'min"></input> \
                      <input type="button" id="group'+id+'button" name="group'+id+'button" value="+" style="position: relative; left: 10px"></input>';
    parent.appendChild(p);
    parent.appendChild(span);
    var i = id - 1;
    document.getElementById('group'+i+'button').style.display = "none";
    document.getElementById('group'+id+'button').addEventListener("click",function(){
        addGroup();
    });
    groups();
};









//Die Upload-Funktion
var upload = function (event) {
    //Clear Meldung
    document.getElementById('meldung').innerHTML = "";
    
    //Variablen laden
    var mId = document.getElementById('mId');
    var langSelect = document.getElementById('langSelect');
    var group = [];
    var minChap = document.getElementById("minChap");
    var maxChap = document.getElementById("maxChap");
    var startNumber = document.getElementById('startNumber');
    var chName = document.getElementById('chName');
    var chap = document.getElementById('chap');
    
    
    //Fehlermedlungen
    if ('files' in chap === false) {
        alert("Sorry, aber dieser Browser ist leider nicht für den Gebrauch dieses Tools geeignet. Bitte versuche es erneut mit einem anderen Browser.");
        return;};
    if (mId.value === "") {
        alert("Bitte trage eine Manga-ID ein");
        return;};
    if (mId.value.match(/^[0-9]+$/) === null) {
        alert("Die eingetragene Manga-ID ist ungültig");
        return;};
    if (minChap.valueAsNumber > maxChap.valueAsNumber) {
        alert("Fehlerhafte Kapielslotauswahl. Die Endzahl muss größer oder gleich der Anfangszahl sein (bei gleicher Zahl wird nur ein Kapitel hochgeladen)");
        return;};
    if (startNumber.valueAsNumber > minChap.valueAsNumber) {
        if (confirm("Die gewählte Nummer zur Kapitelbenennung ist größer als die Nummer des entsprechenden Kapitelslots. Bist du sicher, dass du fortfahren willst?") === false) {
        return;};};
    if (chap.files.length === 0) {
        alert("Keine Dateien ausgewählt");
        return;};
    if (chap.files.length < maxChap.valueAsNumber - minChap.valueAsNumber + 1) {
        if (confirm("Weniger Dateien als Kapitelslots ausgewählt. Die Kapitelslots, die nach dem Hochladen aller Dateien noch nicht bearbeitet wurden, werden leer belassen. Trotzdem fortfahren?") === false) {
        return;};};
    if (chap.files.length > maxChap.valueAsNumber - minChap.valueAsNumber + 1) {
        if (confirm("Mehr Dateien als Kapitelslots ausgewählt. Die Dateien, die nach dem Füllen aller Kapitelslots noch nicht hochgeladen sind, werden überhaupt nicht hochgeladen. Trotzdem fortfahren?") === false) {
        return;};};
    for (var j = 0; j < document.getElementsByClassName('groupSelect').length; j++) {
        var min = parseInt(document.getElementById('group'+j+'min').value);
        var max = parseInt(document.getElementById('group'+j+'max').value);
        if (min > max) {
            alert("Das Ende einer Subgruppeneintragung ist kleiner als der Anfang. Bitte korrigieren.");
            return;
        };
    };
        
    //Disable Timer
    clearInterval(t);
    t = 0;
        
    //Disable all
    var m = 0;
    while (m < y) {
        document.getElementById("slot"+m).disabled = true;
        document.getElementById("check"+m).disabled = true;
        m++;
    };
    m = 0;
    while (m < document.getElementsByClassName('groupSelect').length) {
        document.getElementById('group'+m).disabled = true;
        document.getElementById('group'+m+'min').disabled = true;
        document.getElementById('group'+m+'max').disabled = true;
        document.getElementById('group'+m+'button').disabled = true;
        m++;
    };
    m = 0;
    document.getElementById('mId').disabled = true;
    document.getElementById('langSelect').disabled = true;
    document.getElementById("minChap").disabled = true;
    document.getElementById("maxChap").disabled = true;
    document.getElementById('startNumber').disabled = true;
    document.getElementById('chap').disabled = true;
    document.getElementById('END').disabled = true;
    
    //Progress Handling
    var arrayLoaded = [];
    var arrayTotal = [];
    
    //Check Progress and display
    var progtime;
    var showProgress = function () {
        var x1 = 0;
        var loaded = 0;
        var total = 0;
        while (x1 < arrayLoaded.length) {
            loaded = loaded + arrayLoaded[x1];
            total = total + arrayTotal[x1];
            x1++;
        };
        var progressValue = Math.round((loaded/total)*100);
        document.getElementById('progress').innerHTML = progressValue + "%";
    };
    progtime = setInterval(showProgress,500);
    
    //Benennungsregel auswählen
    var title = [];
    var n = 0;
    while (n < y) {
        var data = document.getElementById("slot"+n).value;
        title.push(data);
        n++;
    };
        
    //Loop-Variablen erzeugen
    var i = minChap.valueAsNumber;
    var x = 0;
    var v = i;
    var z = 1;
    var xy = 1;
    var miss = [];
    var mangaID = mId.value;
    var language = langSelect.value;
    var length = chap.files.length;
    var xhr = [];
    var timeout = 0;
    var url = "";
    
    //END anhängen?
    if (document.getElementById('END').checked === true) {
        var END = 0;
    }else{var END = 1;};
    
    //Gruppen eintragen
    var groupsNumber = document.getElementsByClassName('groupSelect').length;
    for (var j = 0; j < groupsNumber; j++) {
        var id = document.getElementById('group'+j).value.split('#')[1];
        var min = document.getElementById('group'+j+'min').value -1;
        var max = document.getElementById('group'+j+'max').value -1;
        while (min <= max) {
            group[min] = id;
            min++;
        };
    };
    
    //Loop
        var loop = function () {
            if (i <= maxChap.valueAsNumber) {
                
                //END anfügen oder nicht? + FormData erstellen
                if (group[x] === undefined) {
                    group[x] = 0;
                }; 
                if (END === 0) {
                    if (i < maxChap.valueAsNumber) {
                        var formData = new FormData();
                        formData.append('chapter',chap.files[x]);
                        formData.append('title',title[x]);
                        formData.append('group',group[x]);
                    }else{
                        var formData = new FormData();
                        formData.append('chapter',chap.files[x]);
                        formData.append('title',title[x] + " [END]");
                        formData.append('group',group[x]);};
                }else{
                    var formData = new FormData();
                    formData.append('chapter',chap.files[x]);
                    formData.append('title',title[x]);
                    formData.append('group',group[x]);};
                
                //HTTP oder HTTPS?
                if (window.location.protocol != "https:") {
                    url = 'http://proxer.me/uploadmanga?id='+mangaID+'&c='+i+'&l='+language+'&format=json&s=submit';
                }else{
                    url = 'https://proxer.me/uploadmanga?id='+mangaID+'&c='+i+'&l='+language+'&format=json&s=submit';
                };
                
                //Tatsächlicher Upload
                document.getElementById('meldungStart').innerHTML = "Upload Datei "+z+" von "+length+" gestartet";
                $.ajax({
                    xhr: function()
                    {
                    xhr[x] = $.ajaxSettings.xhr();
                    //Upload progress
                        if (xhr[x].upload) {
                            var progFunc = function (xx) {
                                var xxx = xx +1;
                                xhr[xx].upload.addEventListener("progress",function (evt) {if (evt.lengthComputable) {arrayLoaded[xx] = evt.loaded; arrayTotal[xx] = evt.total;};},false);
                                xhr[xx].upload.addEventListener("error",function (evt) {miss.push("Upload von Kapitel "+xxx+" fehlgeschlagen");},false);
                            };
                            progFunc(x);
                        };
                        return xhr[x];
                    },
                    url: url,
                    method: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.error !== 0) {
                            miss.push(1); //Meldung im Falle eines Fehlers wie "Das Kapitel existiert bereits"
                        };
                        v++;
                        document.getElementById('meldung').innerHTML = "Upload Datei "+xy+" von "+length+" abgeschlossen"; //Status Ausgabe
                        xy++;
                        // Wenn letzter Upload abgeschlossen ist tue....
                        if (v === maxChap.valueAsNumber + 1) {
                            var misses = "Keine"
                            if (miss.length !== 0) {
                                misses = "Upload von " + miss.length + " Kapiteln fehlgeschlagen"
                            };
                            document.getElementById('meldung').innerHTML = "Upload abgeschlossen!"+"<br>"+"Fehler: "+misses; //Abschluss Meldung
                            document.getElementById('meldungStart').innerHTML = "";
                        
                            //Enable all
                            while (m < y) {
                                document.getElementById("slot"+m).disabled = false;
                                document.getElementById("check"+m).disabled = false;
                                m++;
                            };
                            m = 0;
                            while (m < document.getElementsByClassName('groupSelect').length) {
                                document.getElementById('group'+m).disabled = false;
                                document.getElementById('group'+m+'min').disabled = false;
                                document.getElementById('group'+m+'max').disabled = false;
                                document.getElementById('group'+m+'button').disabled = false;
                                m++;
                            };
                            m = 0;
                            document.getElementById('mId').disabled = false;
                            document.getElementById('langSelect').disabled = false;
                            document.getElementById('group').disabled = false;
                            document.getElementById('minChap').disabled = false;
                            document.getElementById('maxChap').disabled = false;
                            document.getElementById('startNumber').disabled = false;
                            document.getElementById('chap').disabled = false;
                            document.getElementById('END').disabled = false;
                        
                            //Enable Timer
                            t = setInterval(repeat, 500);
                            
                            //End Progress Update
                            clearInterval(progtime);
                            progtime = 0;
                        };
                    },
                    error: function () {
                        miss.push(1); //Meldung im Falle eines technischen Fehlers
                        v++;
                        xy++;
                    }
                });
                i++;
                x++;
                z++;
                timeout = 0;
                timeout = document.getElementById('slowNumber').valueAsNumber;
                timeout = timeout * 1000;
                setTimeout(loop,timeout);
            };
        };
        loop();
    };

//Ersetze den Seiteninhalt durch den Code des Tools (inklusive CSS)
var replaceMain = function() {
    document.getElementById('main').innerHTML = '<p>\
    <style>\
\
#all {\
    color: #000;\
    background-color: #777;\
    margin-left: 100px;\
    padding-left: 20px;\
    Padding-bottom: 10px;\
    padding-top: 6px;\
    padding-right: 20px;\
    padding-left: 20px;\
    margin-right: 100px;\
    border-style: solid;\
    border-color: #fff;\
    border-width: 1px;\
    border-radius: 8px;\
    box-shadow: -5px 5px 3px 1px #000;\
}\
\
#skip {\
    margin-left: 97px;\
}\
\
#logo {\
    margin-left: 100px;\
    margin-top: 10px;\
}\
\
#title {\
    padding-bottom: 50px;\
    margin-left: 20px;\
}\
\
#notes {\
    color: #fff;\
    background-color: #333;\
    margin-left: 100px;\
    margin-top: 20px;\
    padding-left: 20px;\
    margin-right: 100px;\
    border-style: solid;\
    border-color: #fff;\
    border-width: 1px;\
    border-radius: 8px;\
    box-shadow: -5px 5px 3px 1px #000;\
    padding-right: 20px;\
    margin-bottom: 20px;\
}\
\
small a {\
    color: hsl(180,100%,50%);\
}\
\
.heading {\
    font-size: 1.5em;\
    font-weight:bold;\
}\
\
#heading2 {\
    margin-left: 100px;\
    font-size: 1.5em;\
    font-weight:bold;\
    color: #aaa;\
}\
\
.fieldset {\
    margin-right: 20px;\
    border-style: none;\
}\
\
.form {\
    width: 300px;\
}\
.form2 {\
    width: 300px;\
    margin-bottom: 2.5px;\
    margin-top: 2.5px;\
    border-style: solid;\
    border-width: 1px;\
    border-color: #fff;\
}\
.l9 {\
    margin-right: 16px;\
}\
.l99 {\
    margin-right: 8px;\
}\
\
.numberForm {\
    width: 50px;\
}\
\
legend {\
    text-decoration:underline;\
    font-weight:bold;\
}\
#slowNumber {\
    width: 40px;\
}\
\
#autoName {\
    margin-left: 120px;\
}\
#progress {\
    font-size: 1.5em;\
    margin-top: 10px;\
    color: #aaa;\
};\
    </style>\
        <img id="logo" src="http://fs2.directupload.net/images/user/150601/sqll7kl6.png" width="100" height="100">\
        <img id="text" src="http://fs1.directupload.net/images/user/150608/z49mco5w.png" width="500" height="100">\
    </p>\
    <div id="all">\
        <p>\
            <span class="heading">Upload-Formular:<span>\
            <form name="upload" action="" method="post" id="uploadForm">\
            <fieldset class="fieldset">\
                <legend>Manga-ID:</legend>\
                <input class="form" type="text" name="mId" id="mId" placeholder="Bitte gib hier die Manga-ID ein"></input>\
            </fieldset>\
            <p>\
            <fieldset class="fieldset">\
                <legend>Sprache:</legend> \
                <select class="form" id="langSelect">\
                    <option id="english" value="en">Englisch</option>\
                    <option id="deutsch" value="de">Deutsch</option>\
                </select>\
            </fieldset>\
            <fieldset class="fieldset" id="group">\
                <legend>Scangruppe:</legend> \
                <span role="status" aria-live="polite" class="ui-helper-hidden-accessible">\
                15 results are available, use up and down arrow keys to navigate.\
                </span>\
                <input type="text" class="groupSelect ui-autocomplete-input" id="group0" autocomplete="off"> \
                Von Datei <input type="number" value="1" min="1" class="numberForm" id="group0min" name="group0min"></input>\
                bis Datei <input type="number" value="1" min="1" class="numberForm" id="group0max" name="group0max"></input> \
                <input type="button" id="group0button" name="group0button" value="+" style="position: relative; left: 10px"></input>\
            </fieldset>\
            </p>\
            <p>\
            <fieldset class="fieldset">\
                <legend>Kapitelauswahl:</legend>\
                    Von Kapitelslot Nummer <input value="1" min="1" class="numberForm" type="number" id="minChap" name="minChap"></input>\
                    bis Kapitelslot Nummer <input value="1" min="1" class="numberForm" type="number" id="maxChap" name="maxChap"></input>\
                    <br>\
                    Start bei Kapitelbenennung: "<span id="lang">Chapter</span> <input value="1" min="0" class="numberForm" type="number" id="startNumber" name="maxNumber"></input>"\
                    <input type="checkbox" name="autoName" id="autoName" checked>Entspricht Kapitelslotnummer</input>\
                    <input type="checkbox" name="END" id="END">an letztes Kapitel "[END]" anhängen</input>\
            </fieldset>\
            <fieldset class="fieldset">\
                <legend>Kapitelname:</legend>\
                <input type="button" name="chapNamesTrigger" id="chapNamesTrigger" value="Kapitel manuell benennen">\
                \
                <div id="chapNames"><input type="text" class="form2" name="slot-1" id="slot-1" value="Chapter 0"><input type="checkbox" id="check-1"></input><span id="skip">Automatische Benennung aussetzen?</span><br></div>\
            </fieldset>\
            <fieldset class="fieldset">\
                <legend>Dateiauswahl</legend>\
                <input id="chap" type="file" name="chap[]" multiple></input>\
            </fieldset>\
            </p>\
            <p>\
            <fieldset class="fieldset">\
                <legend>Upload:</legend>\
                <p>Schlechtes Internet? Uploads um <input type="number" name="slowNumber" id="slowNumber" min="0" value="0"></input> Sekunden verzögern.<br>\
                <small>Die Verzögerung des Uploads bewirkt, dass die Belastung über einen größeren Zeitraum verteilt wird, was im Endeffekt den Vorgang sogar beschleunigen kann. Welcher Wert ideal ist, muss man ausprobieren</small></p>\
                Alles kontrolliert? Dann starte den Upload:<br>\
                <input type="button" name="upload" id="upload" value="Upload"></input><br>\
            </fieldset>\
            </p>\
            </form>\
            <div id="meldungStart"></div><div id="meldung"></div><div id="progress"></div>\
        </p>\
    </div>\
    <footer id="notes">\
        <p>\
            <small id="small">'+
                'Autor: Dominik Bissinger alias Nihongasuki <br>'+
                ''+
                'Der Hauptzweck dieses Tools ist es, das Uploaden einer großen Anzahl'+
                'von Manga-Kapiteln möglichst einfach und schnell zu gestalten. <br>'+
                'Dieses Tool ist ausschließlich für den Gebrauch mit '+
                '<a href="http://proxer.me/" target="_blank">Proxer</a> gedacht. '+
                'Änderungen des Codes sind jedem Benutzer gestattet, allerdings sollte der '+
                'Hauptzweck des Tools bei jeder Änderung erhalten bleiben. Die Verwendung des Codes '+
                'für einen anderen Zweck ist nur nach Rückfrage beim <a href="http://proxer.me/user/258371#top" target="_blank">Autor</a> '+
                'gestattet, sofern dieser seine Erlaubnis erteilt.'+
                '<br>Da dies ein Userscript ist, kann direkt auf den Code zugegriffen werden. '+
                ''+
                '<br>Momentan ist das Tool ausschließlich für Proxer-Teammitglieder und vom '+
                'Proxer-Mangateam offiziell ernannte Uploader gedacht. Bitte gebt dieses Tool '+
                'niemandem, der nicht mindestens eines dieser Kriterien erfüllt. <br>'+
                'Durch die Verwendung dieses Tools bestätigt ihr, dass ihr '+
                'mit allen hier enthaltenen Regeln und Bestimmungen einverstanden seid. '+
            '</small>'+
        '</p>'+
    '</footer>';
    document.title = "Massenupload";
    document.getElementById("chapNames").style.display = "none";
    document.getElementById("skip").style.display = "none";
    groups(); //starte die Funktione groups
    startRepeat(); //starte die Funktione "startRepeat"
    document.getElementById('upload').addEventListener("click",function () {
    upload(); //füge einen Event-Listener zum Button "upload" hinzu
    });
    document.getElementById('chapNamesTrigger').addEventListener("click",function(){
        chapNamesVisible();
    });
    document.getElementById('group0button').addEventListener("click",function(){
        addGroup();
    });
    if (window.location.href.indexOf('info') > -1) {
        var string = window.location.href;
        var num = string.match(/\d+/);
        location.href = '/misc/mangamassenupload?id='+num+'#top';
    };
};
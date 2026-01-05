// ==UserScript==
// @name         Proxer-Longstrip-Reader
// @namespace    de.34749.proxer
// @version      0.7
// @description  Dieses Script fügt auf Proxer die Möglichkeit hinzu, Mangas im Longstrip-Format zu lesen
// @author       Dominik Bissinger alias Nihongasuki
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*
// lädt Anker
// @require      https://greasyfork.org/scripts/12981-proxer-userscript-anker/code/Proxer-Userscript-Anker.js?version=81145
// @run-at       document-start
// von Anker benötigt
// @grant        GM_setValue
// von Anker benötigt
// @grant        GM_getValue	
// @grant        GM_log
// @grant        unsafeWindow
// @history      0.6.11 Anbinden des generischen Ankers
// @downloadURL https://update.greasyfork.org/scripts/10366/Proxer-Longstrip-Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/10366/Proxer-Longstrip-Reader.meta.js
// ==/UserScript==

/*	Ruft die generischen Methoden des Ankers auf, um ein Member im Menü erzeugen zu lassen
	1.Parameter --> id des Members in der Menüleiste
	2.Parameter --> Angezeigter Text des Members
	3.Parameter --> Boolean: true -> mit Häckhen/Kreuz | false -> ohne Häckhen/Kreuz
	4.Parameter --> Methode die bei Initialisierung und Änderung der Speichervariable aufgerufen wird (An/Aus) WICHTIG KEINE '' oder ""
					Muss unique sein ratsam Programmname_actioControl zu nehmen, damit es nicht zu Problemen mit anderen Scripten kommen kann.
	5.Parameter --> Name der Speichervariable
	6.Parameter --> Initalwert der Speichervariable
*/
addAnkerMember('longstrip', 'Longstrip-Reader', true, longstrip_actionControl, 'longstrip', 0);

/*	Wird vom Anker aufgerufen
	change == true  --> Speicherwert wurde verändert
	change == false  --> Speicherwert unverändert (Initalisierung)
*/
function longstrip_actionControl(change){
	if(change === true){
		// Reader ausgeschaltet
		if(GM_getValue("longstrip",0) === 0){
			// nur in proxer.me/reader neu laden
			if (window.location.href.indexOf('read') > -1) {
				if (window.location.href.indexOf('forum') > -1) {
					return;
				};
				window.location.reload();
			}
		// Reader eingeschaltet
		} else {
			longstrip();
		}
	// Initialisierung
	} else {
		longstrip();
	}
}

//Longstrip-Reader
function longstrip() {
    var x = GM_getValue("longstrip",0);
	console.log('GM longstrip in reader='+x);
    if (x === 0) {
        return;
    };
    if (window.location.href.indexOf('read') > -1) {
        if (window.location.href.indexOf('forum') > -1) {
            return;
        };
        var href = window.location.href;
        var i = 1;
        var x = 0;
        
        //Lösche Seitenanzeige
        document.getElementById("navigation").style.display = "none";
        
        //Ändere die Navigationseinstellungen
        window.addEventListener("keydown", changeChapter, false);
        
        //setze die Bilder
        document.getElementById('reader').innerHTML = "<a href='javascript:;' onclick='return false;' id='master'></a>";
        
        //nächstes Kapitel bei Klick
        document.getElementById('master').addEventListener ("click", changeChapter);
		
        var master = document.getElementById('master');
        document.getElementById('reader').style.maxWidth = "none";
        document.getElementById('reader').style.textAlign = "center";
        var pagesNumber = unsafeWindow.pages.length;
        var loop = function () {
            var br = document.createElement("br");
            var element = document.createElement("img");
            var url = unsafeWindow.serverurl+unsafeWindow.pages[x][0];
            url = url.replace(/\+/g,' ');
            element.setAttribute("class","chapterImage");
            element.setAttribute("src",url);
            element.setAttribute("width",unsafeWindow.pages[x][2]);
            element.setAttribute("height",unsafeWindow.pages[x][1]);
            element.setAttribute("style","opacity: 1; max-width: 100%; text-align: center; height: auto;");
            master.appendChild(element);
            master.appendChild(br);
            i++;
            x++;
            if (i <= pagesNumber) {
                setTimeout(loop,1000);
            };
        };
        loop();
    };
};

//Weiterleitung zum nächsten Kapitel/zur Kapitelseite des momentanen Kapitels
var changeChapter = function (event) {
    var lang = "";
    if (window.location.href.indexOf('forum') > -1) {
        return;
    };
    if (window.location.href.indexOf('en') > -1) {
        lang = "en";
    }else if (window.location.href.indexOf('de') > -1) {
        lang = "de";
    };
    // D oder Weiter oder Linke Maustaste
    if (event.keyCode === 68 || event.keyCode === 39 || event.button === 0) {
        window.location = unsafeWindow.nextChapter+'/#top';
    // A oder Zurück
    }else if (event.keyCode === 65 || event.keyCode === 37) {
        var div = document.getElementById('breadcrumb');
        var a = div.getElementsByTagName('a');
        if (lang !== "") {
            window.location = a[1].href;
        }else{
            window.location = a[0].href;
        };
    };
};
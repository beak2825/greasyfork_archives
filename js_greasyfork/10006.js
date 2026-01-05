// ==UserScript==
// @name        WebMail Notify
// @namespace   type-style
// @description WebNotification Api for Webmail
// @include     https://support.euserv.de/webmail/
// @version     1.05
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10006/WebMail%20Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/10006/WebMail%20Notify.meta.js
// ==/UserScript==

var init = function () {
	
	if (check4Element()) { // greasemonkey fires init multiple times :-(   
        
        if (check4Storage()) {
            console.log("- get it started -");
            notificationPermission();            
            getIntervalStarted();
			context = new AudioContext();
			
        } else {
            console.log("--- no storage ---");            
        }
	} else {
        console.log("--- element not found initial ---");
	    context = new AudioContext();
        if (!check4Element() && check4LoggedOut()) {
            notificationPermission(); 
            throwNotification("Ausgeloggt", "Konnte Check nach neuen Mails nicht ausführen.", "https://media.giphy.com/media/MfSdxfJDocLu0/giphy.gif");  
            playNote(300, context.currentTime + 0.15, 0.35);
playNote(250, context.currentTime + 0.45, 0.4);

			window.setInterval(function() {
                 if (check4LoggedOut()) {
                     throwNotification("Ausgeloggt", "Konnte Check nach neuen Mails nicht ausführen.", "https://media.giphy.com/media/MfSdxfJDocLu0/giphy.gif");  
					playNote(300, context.currentTime + 0.15, 0.35);
playNote(250, context.currentTime + 0.45, 0.4);

                 }                
            }, 450000);                
        }		
	}
    
}


var check4Storage = function () {
    var storage = true;
    try {
        sessionStorage.setItem('storage', true);
    } 
    catch (e) {
        storage = false;
    }
    window.storage = true;
    return storage;
}
var getUnreadNr = function () {
    var el = check4Element()
    if (el) {
        var unreadNr = el.textContent;
        unreadNr = parseFloat(unreadNr.replace('(', ''), 10);
        return unreadNr;
    }
}
var check4Element = function() {
    var el = document.querySelector('.unreadcount');
	console.log(document.querySelector('.unreadcount'));
    if (el) {
       return el;
    } else {
       console.log("element not found");
       return false;
    }
}
var check4LoggedOut = function() {
    var el = document.querySelector('#login-form');
    if (el) {
       return true;
    } else {
       return false;
    }
}

var notificationPermission = function() {
    Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
            Notification.permission = status;
        }
    });
}

var throwNotification = function(title, text, img) {
    if (window.Notification && Notification.permission === 'granted') { 
        if (!img) {
           var img = 'data:image/gif,GIF89au%00l%00%A2%04%00%00%00%00%FF%FF%FF%B0%9F%84%FF%99%00%FF%FF%FF%00%00%00%00%00%00%00%00%00%21%FF%0BNETSCAPE2.0%03%01%08%00%00%21%FF%0BXMP%20DataXMP%3C%3Fxpacket%20begin%3D%22%EF%BB%BF%22%20id%3D%22W5M0MpCehiHzreSzNTczkc9d%22%3F%3E%20%3Cx%3Axmpmeta%20xmlns%3Ax%3D%22adobe%3Ans%3Ameta%2F%22%20x%3Axmptk%3D%22Adobe%20XMP%20Core%205.5-c021%2079.155772%2C%202014%2F01%2F13-19%3A44%3A00%20%20%20%20%20%20%20%20%22%3E%20%3Crdf%3ARDF%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%20%3Crdf%3ADescription%20rdf%3Aabout%3D%22%22%20xmlns%3Axmp%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2F%22%20xmlns%3AxmpMM%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2Fmm%2F%22%20xmlns%3AstRef%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2FsType%2FResourceRef%23%22%20xmp%3ACreatorTool%3D%22Adobe%20Photoshop%20CC%202014%20%28Windows%29%22%20xmpMM%3AInstanceID%3D%22xmp.iid%3AF1784492FFB811E497049013FA445462%22%20xmpMM%3ADocumentID%3D%22xmp.did%3AF1784493FFB811E497049013FA445462%22%3E%20%3CxmpMM%3ADerivedFrom%20stRef%3AinstanceID%3D%22xmp.iid%3AF1784490FFB811E497049013FA445462%22%20stRef%3AdocumentID%3D%22xmp.did%3AF1784491FFB811E497049013FA445462%22%2F%3E%20%3C%2Frdf%3ADescription%3E%20%3C%2Frdf%3ARDF%3E%20%3C%2Fx%3Axmpmeta%3E%20%3C%3Fxpacket%20end%3D%22r%22%3F%3E%01%FF%FE%FD%FC%FB%FA%F9%F8%F7%F6%F5%F4%F3%F2%F1%F0%EF%EE%ED%EC%EB%EA%E9%E8%E7%E6%E5%E4%E3%E2%E1%E0%DF%DE%DD%DC%DB%DA%D9%D8%D7%D6%D5%D4%D3%D2%D1%D0%CF%CE%CD%CC%CB%CA%C9%C8%C7%C6%C5%C4%C3%C2%C1%C0%BF%BE%BD%BC%BB%BA%B9%B8%B7%B6%B5%B4%B3%B2%B1%B0%AF%AE%AD%AC%AB%AA%A9%A8%A7%A6%A5%A4%A3%A2%A1%A0%9F%9E%9D%9C%9B%9A%99%98%97%96%95%94%93%92%91%90%8F%8E%8D%8C%8B%8A%89%88%87%86%85%84%83%82%81%80%7F~%7D%7C%7Bzyxwvutsrqponmlkjihgfedcba%60_%5E%5D%5C%5BZYXWVUTSRQPONMLKJIHGFEDCBA%40%3F%3E%3D%3C%3B%3A9876543210%2F.-%2C%2B%2A%29%28%27%26%25%24%23%22%21%20%1F%1E%1D%1C%1B%1A%19%18%17%16%15%14%13%12%11%10%0F%0E%0D%0C%0B%0A%09%08%07%06%05%04%03%02%01%00%00%21%F9%04%05%14%00%04%00%2C%00%00%00%00u%00l%00%00%03%FF%08%BA%DC%FE0%CAI%AB%BD8%EB%CD%BB%FF%60%28%8Edi%9Eh%AA%AEl%EB%BEp%2C%CFtm%DFx%AE%EF%7C%EF%FF%C0%A0pH%2C%1A%8F%C8%A4r%C9l%06%03%D0%A8tJ%ADZ%AF%D8%AC%16%5B%DAz%BF%E0%F0%B6%2B.%9B%CFW2z%CD%0E%AB%DB%F0x%F5-%AF%C7%E9S%81R%C0%25e%F5G%7C%7D%23Z%80D%82%83%22%5B%86A%88%89%21T%8EQ%8C%3E%92P%96x%00%96%01%94%3B%9BzT%99%9AU%9D8%9F%0A%A1~S%0B%A7%9E%A4%0B%A9%84%AB%AC%AF9%AD%A8%B3%B2R%0D%B75%BD%00%B1%8A%B9%B4%916%BF%C0%C3%90%C9%0A%C7.%CD%C1%CA%BB%0F%CD%2B%D4%D0%20%D7%C4y0%D4%C8%D2%BAQ%12%DD%25%E3%D9%1E%E6%DAR%A5%E4%B5%11%E8%1C%EF%CC%ED%27%E3%B8%DF%C2%F7%11%F5%1D%FB%DE%E1%AA%F9%F4%CD%13%D1%CF%1F%14Q%15%0AZP%18OCC%06%0A%27D%7C%88%81b%BAI%20%22%1A%0C%80%F0%FF%82F%5E%03%2BX%B40%F2%E2%25%0E%1F7v%C4%F01%A5J%80%FF6Dt%F9%12%DCA~%21%21%D0%AC%89%2F%A6L%2B%EB%20%02%3D%B7%ECCI%A1W%82%8EJ%DA%E1%E8%04%A7K%B1%AC%DB%B4m%03TwE%29P-%06r%91%D5%ACM%C1%0A%8C%D4%EB%D3%C7%AB%10J%B6%A2%2A%80%AD%3C%AE%17%D0%3E%18Y%16%0C%A3%89b%BF%06%1C%5B%15i%21%07%0C%F3%3A%14%FC%B6oW%A9%3As%CE%25%5C%91%F0%B8%AD%9C%C4%29n%20%D7A%C3~%96%94%9A%8C%FC%94q%DC%BC%1A%DBf%A8W%99%B2%D8%9D%2C%27%F3%8C%E6%F3%B0%3An%93K30%87%FA%27%5C%D3%7B%89%EE%AD%8D2%A7lX%CBx%E3%BCm%AF5%B6d%C2%3D%FC%FA%5D%FCf%E1%D7%B6%E61%AF%99%3C%C4%AD%E9%A9%AA%13%AC%85%7D%95%F6%11%A7%BA%ABSm%8A%94x%C4C%20%1B7%FA%C7%88z%8E0%C9%F7P%8F%07%3A%12%C8%F5%ED%E87%93%7F%BF%FF%2F%3A%FD%FD%27%E0%23%C7%0Dh%E0%18%F1%1D%A8%E0y%0B6%B8%9E%13%10F%28%E1%84%14Vh%E1%85%18f%A8%E1%86%1Cv%E8%E1%87%20%86%28%E2%88%24%96h%E2%89%28%A6%A8%E2%8A%24%24%00%00%21%F9%04%05%14%00%04%00%2C%15%00%1B%00L%006%00%00%03%E5H%AA%D3%FE0%CAI%AB%5D%18%DB%CD%7B%CF%20%E3%8D%24%17%9Ee%AA%3Ag%BB%BE%9E%EB%C2%F44%0Fw%AD%E78%AA%D7%BCF%F0G%1A%0A%7D%C4%92%91%85L~%9A%94%A5%13%22%A5B%A7%91j%F6%8A%3D%86R%DA%1D%F7%F9%EDzA%B0%F0J%7D%19%D3%D8%1B8%19M%94%B7%CBI%BB%CD%FD%E6%CF3f%3Dx%60~b%83%23z%2Av%89k%85%0F%8C%2Fj%90%91Z-%04%81%7B%96%15%96%22%98L%9C%97%12%A0%9D%98%A3%0B%5B%A6%9E%A6%1A%9F%AB%813%AB%80%82tS9%B1%A4%93%99%B4%AD%A0%A8%BB%40c%A9%A2%8E%7F%AC%BA%7C%B9%B3%B2w%CB%9B%C4Q%CF%8D%87%88%D1%94%D3%26%D5i%D5%C9E%CF%DCJ%8E%DF%84%D7%8F%D9NK%E2%D6%BFg%CD%9E%CC%ED%E9%C0x%F1%86h%F4%3F%B7%EE%EA%9C%FA%DA%FC%FD%FE%CC%01%F4E%20%01%00%3B'
        }
        var n = new Notification(title, { 
            body: text,
            icon: img
        }); 
    } else {
        console.log("Notification.requestPermission: " + Notification.requestPermission);
    }    
}

var playNote = function (frequency = 493.883, startTime = context.currentTime, duration = 0.3) {
	// https://gamedevelopment.tutsplus.com/tutorials/creating-dynamic-sound-with-the-web-audio-api--cms-24564 
    var osc1 = context.createOscillator(),
        osc2 = context.createOscillator(),
        volume = context.createGain();
 
    // Set oscillator wave type
    osc1.type = 'sine';
    osc2.type = 'sine';
 
    volume.gain.value = 0.1;    
 
    // Set up node routing
    osc1.connect(volume);
    osc2.connect(volume);
    volume.connect(context.destination);
 
    // Detune oscillators for chorus effect
    osc1.frequency.value = frequency + 1;
    osc2.frequency.value = frequency - 2;
 
    // Fade out
    volume.gain.setValueAtTime(0.1, startTime + duration - 0.05);
    volume.gain.linearRampToValueAtTime(0, startTime + duration);
 
    // Start oscillators
    osc1.start(startTime);
    osc2.start(startTime);
 
    // Stop oscillators
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
};


var getIntervalStarted = function() {
    if (check4Element()) {
        sessionStorage.setItem('unread', getUnreadNr()); // initial call
        var t = window.setInterval(function () {
            var oldNr = sessionStorage.getItem('unread'); // get old Status
            if (rcmail) { rcmail.command('checkmail'); } // check for newMails
            window.setTimeout(function () { // give some time
                sessionStorage.setItem('unread', getUnreadNr()); // get new Status and write it into storage
                // compare
                if (oldNr < sessionStorage.getItem('unread')) {
                    console.info('yes'); // there is more unread than before
                    // notification
                    
                    if (window.Notification && Notification.permission === 'granted') { 
                       var messageItems = document.getElementById("messagelist").querySelectorAll(".message");
                       var bodyText = "";
                       for (var i = 0; i <= messageItems.length -1; i++) { // scan messages find the first and get subject
                           if (messageItems[i].style.display != "none") {
                             bodyText = messageItems[i].querySelector(".subject a").textContent;
                             break;
                           }                    
                       }
                       throwNotification("New Mail", bodyText, 'data:image/gif,GIF89au%00l%00%A2%04%00%00%00%00%FF%FF%FF%B0%9F%84%FF%99%00%FF%FF%FF%00%00%00%00%00%00%00%00%00%21%FF%0BNETSCAPE2.0%03%01%08%00%00%21%FF%0BXMP%20DataXMP%3C%3Fxpacket%20begin%3D%22%EF%BB%BF%22%20id%3D%22W5M0MpCehiHzreSzNTczkc9d%22%3F%3E%20%3Cx%3Axmpmeta%20xmlns%3Ax%3D%22adobe%3Ans%3Ameta%2F%22%20x%3Axmptk%3D%22Adobe%20XMP%20Core%205.5-c021%2079.155772%2C%202014%2F01%2F13-19%3A44%3A00%20%20%20%20%20%20%20%20%22%3E%20%3Crdf%3ARDF%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%3E%20%3Crdf%3ADescription%20rdf%3Aabout%3D%22%22%20xmlns%3Axmp%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2F%22%20xmlns%3AxmpMM%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2Fmm%2F%22%20xmlns%3AstRef%3D%22http%3A%2F%2Fns.adobe.com%2Fxap%2F1.0%2FsType%2FResourceRef%23%22%20xmp%3ACreatorTool%3D%22Adobe%20Photoshop%20CC%202014%20%28Windows%29%22%20xmpMM%3AInstanceID%3D%22xmp.iid%3AF1784492FFB811E497049013FA445462%22%20xmpMM%3ADocumentID%3D%22xmp.did%3AF1784493FFB811E497049013FA445462%22%3E%20%3CxmpMM%3ADerivedFrom%20stRef%3AinstanceID%3D%22xmp.iid%3AF1784490FFB811E497049013FA445462%22%20stRef%3AdocumentID%3D%22xmp.did%3AF1784491FFB811E497049013FA445462%22%2F%3E%20%3C%2Frdf%3ADescription%3E%20%3C%2Frdf%3ARDF%3E%20%3C%2Fx%3Axmpmeta%3E%20%3C%3Fxpacket%20end%3D%22r%22%3F%3E%01%FF%FE%FD%FC%FB%FA%F9%F8%F7%F6%F5%F4%F3%F2%F1%F0%EF%EE%ED%EC%EB%EA%E9%E8%E7%E6%E5%E4%E3%E2%E1%E0%DF%DE%DD%DC%DB%DA%D9%D8%D7%D6%D5%D4%D3%D2%D1%D0%CF%CE%CD%CC%CB%CA%C9%C8%C7%C6%C5%C4%C3%C2%C1%C0%BF%BE%BD%BC%BB%BA%B9%B8%B7%B6%B5%B4%B3%B2%B1%B0%AF%AE%AD%AC%AB%AA%A9%A8%A7%A6%A5%A4%A3%A2%A1%A0%9F%9E%9D%9C%9B%9A%99%98%97%96%95%94%93%92%91%90%8F%8E%8D%8C%8B%8A%89%88%87%86%85%84%83%82%81%80%7F~%7D%7C%7Bzyxwvutsrqponmlkjihgfedcba%60_%5E%5D%5C%5BZYXWVUTSRQPONMLKJIHGFEDCBA%40%3F%3E%3D%3C%3B%3A9876543210%2F.-%2C%2B%2A%29%28%27%26%25%24%23%22%21%20%1F%1E%1D%1C%1B%1A%19%18%17%16%15%14%13%12%11%10%0F%0E%0D%0C%0B%0A%09%08%07%06%05%04%03%02%01%00%00%21%F9%04%05%14%00%04%00%2C%00%00%00%00u%00l%00%00%03%FF%08%BA%DC%FE0%CAI%AB%BD8%EB%CD%BB%FF%60%28%8Edi%9Eh%AA%AEl%EB%BEp%2C%CFtm%DFx%AE%EF%7C%EF%FF%C0%A0pH%2C%1A%8F%C8%A4r%C9l%06%03%D0%A8tJ%ADZ%AF%D8%AC%16%5B%DAz%BF%E0%F0%B6%2B.%9B%CFW2z%CD%0E%AB%DB%F0x%F5-%AF%C7%E9S%81R%C0%25e%F5G%7C%7D%23Z%80D%82%83%22%5B%86A%88%89%21T%8EQ%8C%3E%92P%96x%00%96%01%94%3B%9BzT%99%9AU%9D8%9F%0A%A1~S%0B%A7%9E%A4%0B%A9%84%AB%AC%AF9%AD%A8%B3%B2R%0D%B75%BD%00%B1%8A%B9%B4%916%BF%C0%C3%90%C9%0A%C7.%CD%C1%CA%BB%0F%CD%2B%D4%D0%20%D7%C4y0%D4%C8%D2%BAQ%12%DD%25%E3%D9%1E%E6%DAR%A5%E4%B5%11%E8%1C%EF%CC%ED%27%E3%B8%DF%C2%F7%11%F5%1D%FB%DE%E1%AA%F9%F4%CD%13%D1%CF%1F%14Q%15%0AZP%18OCC%06%0A%27D%7C%88%81b%BAI%20%22%1A%0C%80%F0%FF%82F%5E%03%2BX%B40%F2%E2%25%0E%1F7v%C4%F01%A5J%80%FF6Dt%F9%12%DCA~%21%21%D0%AC%89%2F%A6L%2B%EB%20%02%3D%B7%ECCI%A1W%82%8EJ%DA%E1%E8%04%A7K%B1%AC%DB%B4m%03TwE%29P-%06r%91%D5%ACM%C1%0A%8C%D4%EB%D3%C7%AB%10J%B6%A2%2A%80%AD%3C%AE%17%D0%3E%18Y%16%0C%A3%89b%BF%06%1C%5B%15i%21%07%0C%F3%3A%14%FC%B6oW%A9%3As%CE%25%5C%91%F0%B8%AD%9C%C4%29n%20%D7A%C3~%96%94%9A%8C%FC%94q%DC%BC%1A%DBf%A8W%99%B2%D8%9D%2C%27%F3%8C%E6%F3%B0%3An%93K30%87%FA%27%5C%D3%7B%89%EE%AD%8D2%A7lX%CBx%E3%BCm%AF5%B6d%C2%3D%FC%FA%5D%FCf%E1%D7%B6%E61%AF%99%3C%C4%AD%E9%A9%AA%13%AC%85%7D%95%F6%11%A7%BA%ABSm%8A%94x%C4C%20%1B7%FA%C7%88z%8E0%C9%F7P%8F%07%3A%12%C8%F5%ED%E87%93%7F%BF%FF%2F%3A%FD%FD%27%E0%23%C7%0Dh%E0%18%F1%1D%A8%E0y%0B6%B8%9E%13%10F%28%E1%84%14Vh%E1%85%18f%A8%E1%86%1Cv%E8%E1%87%20%86%28%E2%88%24%96h%E2%89%28%A6%A8%E2%8A%24%24%00%00%21%F9%04%05%14%00%04%00%2C%15%00%1B%00L%006%00%00%03%E5H%AA%D3%FE0%CAI%AB%5D%18%DB%CD%7B%CF%20%E3%8D%24%17%9Ee%AA%3Ag%BB%BE%9E%EB%C2%F44%0Fw%AD%E78%AA%D7%BCF%F0G%1A%0A%7D%C4%92%91%85L~%9A%94%A5%13%22%A5B%A7%91j%F6%8A%3D%86R%DA%1D%F7%F9%EDzA%B0%F0J%7D%19%D3%D8%1B8%19M%94%B7%CBI%BB%CD%FD%E6%CF3f%3Dx%60~b%83%23z%2Av%89k%85%0F%8C%2Fj%90%91Z-%04%81%7B%96%15%96%22%98L%9C%97%12%A0%9D%98%A3%0B%5B%A6%9E%A6%1A%9F%AB%813%AB%80%82tS9%B1%A4%93%99%B4%AD%A0%A8%BB%40c%A9%A2%8E%7F%AC%BA%7C%B9%B3%B2w%CB%9B%C4Q%CF%8D%87%88%D1%94%D3%26%D5i%D5%C9E%CF%DCJ%8E%DF%84%D7%8F%D9NK%E2%D6%BFg%CD%9E%CC%ED%E9%C0x%F1%86h%F4%3F%B7%EE%EA%9C%FA%DA%FC%FD%FE%CC%01%F4E%20%01%00%3B');
                    }
					playNote();
					playNote(400, context.currentTime + 0.1, 0.25);
					playNote(500, context.currentTime + 0.25, 0.2);
					playNote(650, context.currentTime + 0.35, 0.2);
                } else {
                   console.info('no');
                }
            }, 500)
        }, 15000);
    } else if (check4LoggedOut()) {
        throwNotification("Ausgeloggt", "Konnte Check nach neuen Mails nicht ausführen.");
		playNote(300, context.currentTime + 0.15, 0.35);
playNote(250, context.currentTime + 0.45, 0.4);

        window.setTimeOut(function() {
            getIntervalStarted();
        }, 450000);        
    }
}



if (document.readyState != 'loading') {
      window.setTimeout(function () { // give some time
          init();
      }, 2000);
} else { // not loaded
    window.addEventListener('load', function () {
        window.setTimeout(function () { // give some time
            init();
        }, 2000);
    });
}




// activate for testing 
// document.addEventListener('dblclick', init, false); 

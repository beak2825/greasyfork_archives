// ==UserScript==
// @name           Partis Admin dodatek (oficir)
// @version        2.10
// @description    Luksuz funkcije
// @author         NoBody & Oficir
// @include        *.partis.si/*
// @namespace https://greasyfork.org/users/2594
// @downloadURL https://update.greasyfork.org/scripts/16729/Partis%20Admin%20dodatek%20%28oficir%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16729/Partis%20Admin%20dodatek%20%28oficir%29.meta.js
// ==/UserScript==

var localpath = window.location.pathname;
var profil1 = new RegExp("/uporabnik/*");
var profil2 = new RegExp("/profil/prikazi/*");
var usertabela1 = new RegExp("/torrent/accounts/*");
var usertabela2 = new RegExp("/torrent/latest/*");
var dllist1 = new RegExp("/torrent/last50/*");
var dllist2 = new RegExp("/torrent/seznami*");
var cheatlist = new RegExp("/torrent/cheaters/*");
var comment1 = new RegExp("/torrent/podrobno/*");
var comment2 = new RegExp("/clanek/*");
var forum1 = new RegExp("/forums/*")
var forum2 = new RegExp("/topics/*")
var commentid = new RegExp("cdiv*");
var jokeid = new RegExp("jdiv*");


function addlinklist(hylink, besedilo, slika, isli) {
    if(localpath != "/skupnost/uporabniki"){
	if(profil1.test(localpath) || profil2.test(localpath)) {
    
		var el = document.getElementById("pollholder").getElementsByClassName("linklist")[0];
         
		var li = document.createElement("li");
		li.classList.add("linklistli");
		li.innerHTML = "<a href='" + hylink + "'><img src='" + slika + "' alt='Link'>" + besedilo + "</a>"; 
        if(isli==true) {
            var getbefore = document.getElementById("pollholder").getElementsByClassName("linklistli")[0];
        	li.innerHTML =  "<a href='javascript:void(0)'><img src='" + slika + "' alt='Link'>" + besedilo + "</a>"; 
        	el.insertBefore(li,getbefore);
            li.addEventListener("click", quickmsg, false);
    	} else {
			el.appendChild(li);
    	} 
    }
    }
}


function addlinklist2(hylink, besedilo, slika, isli) {
    if(localpath != "/skupnost/uporabniki"){
	if(comment1.test(localpath)) {
    
		var el = document.getElementsByClassName("menidesnobody")[0].getElementsByClassName("linklist")[0];
         
		var li = document.createElement("li");
		li.classList.add("linklistli");
		li.innerHTML = "<a href='" + hylink + "'><img src='" + slika + "' alt='Link'>" + besedilo + "</a>"; 
        if(isli==true) {
            var getbefore = document.getElementById("pollholder").getElementsByClassName("linklistli")[0];
        	li.innerHTML =  "<a href='javascript:void(0)'><img src='" + slika + "' alt='Link'>" + besedilo + "</a>"; 
        	el.insertBefore(li,getbefore);
            li.addEventListener("click", quickmsg, false);
    	} else {
			el.appendChild(li);
    	} 
    }
    }
}


function addmenuitem(hylink, besedilo, meni) {
    
    try{
		var el = document.getElementById("menu").getElementsByClassName(meni)[0];
        
		var li = document.createElement("li");
		li.style.width = '158px';
		li.innerHTML = "<a href='" + hylink + "'>" + besedilo + "</a>"; // "<a href='" + hylink + "'>" + besedilo + "</a>";
		el.appendChild(li);
    } catch(err) { }
}

function addmenuscript(action, besedilo, meni) {

    try{
		var el = document.getElementById("menu").getElementsByClassName(meni)[0];

		var li = document.createElement("li");
		li.style.width = '158px';
    	li.innerHTML = "<a href='javascript:void(0)' onclick='" + action + "'>" + besedilo + "</a>";
		el.appendChild(li);
    } catch(err) { }
}



function editip() {
    
	if(usertabela1.test(localpath) || usertabela2.test(localpath)) {
        
		var elem = document.getElementById("leechseedlist").getElementsByClassName("tabelcatd");
    
    	for (var i = 8; i <= elem.length - 1; i += 5)
		{
            if(elem[i].innerHTML != "" ){
				elem[i].innerHTML = "<a href=\"http://www.partis.si/ip?ip=" + elem[i].innerHTML + '\"/>' + elem[i].innerHTML + "</a>" + ' <a href=\"https://whatismyipaddress.com/ip/' + elem[i].innerHTML + '\" target=\"_blank\"><img src=\"http://saveotic.com/images/2013/09/27/dzZgj.png\" width="13" height="13"></a>';
            }
		}
    }
}



function editclosebutton(id) {
    
	if(dllist1.test(localpath) || usertabela1.test(localpath)  || cheatlist.test(localpath)) {
        
		var elem = document.getElementById("Login");
		elem.value = "                               Nazaj na uporabnika                               ";
        elem.setAttribute("onclick", "window.location=\"http://www.partis.si/uporabnik/" + id + "\"");
        elem.setAttribute("id","Login1");
        
        var elem2 = document.getElementById("Login");
		elem2.value = "                               Nazaj na uporabnika                               ";
        elem2.setAttribute("onclick", "window.location=\"http://www.partis.si/uporabnik/" + id + "\"");
                           
    }
	else if(dllist2.test(localpath)) {
        
        var elem = document.getElementById("Login");
		elem.value = "                               Nazaj na torrent                               ";
        elem.setAttribute("onclick", "window.location=\"http://www.partis.si/torrent/podrobno/" + id + "\"");
        elem.setAttribute("id","Login1");
        
        var elem2 = document.getElementById("Login");
		elem2.value = "                               Nazaj na torrent                               ";
        elem2.setAttribute("onclick", "window.location=\"http://www.partis.si/torrent/podrobno/" + id + "\"");
    }
}

function calcbytes() {
    if(localpath == "/torrent/announce") {
        
		var elem = document.getElementById("leechseedlist").getElementsByClassName("tabelcatd");
        
    	for (var i = 12; i <= elem.length - 1; i += 8) {
            var stev = elem[i].textContent;
            stev = stev / 1024 / 1024 / 1024;
            elem[i].innerHTML = elem[i].innerHTML.replace(elem[i].textContent, Math.round(stev) + " GB");
		}
        
    	for (var i = 13; i <= elem.length - 1; i += 8) {
            var stev = elem[i].textContent;
            stev = stev / 1024 / 1024 / 1024;
            elem[i].innerHTML = elem[i].innerHTML.replace(elem[i].textContent, Math.round(stev) + " GB");
		}
	}
    else if(cheatlist.test(localpath)) {
    	var elem = document.getElementById("leechseedlist").getElementsByClassName("tabelcatd");
    	for (var i = 7; i <= elem.length - 1; i += 3) {
            var stev = elem[i].textContent;
            stev = stev / 1024 / 1024;
            elem[i].innerHTML = elem[i].innerHTML.replace(elem[i].textContent, Math.round(stev * 100) / 100 + " MB");

		}
    }
}

function newdelbutton(torrentid) {
    if(comment1.test(localpath) || comment2.test(localpath)){
		setTimeout(function () {
			var allele = document.getElementsByTagName("*");      
            for (var i = 0; i < allele.length; i++) {  
               	if(allele[i].innerHTML.indexOf("Brišem komentar") != -1) {
                	if(commentid.test(allele[i].getAttribute('id')) || jokeid.test(allele[i].getAttribute('id'))) {
                        
                  		var currcomid = allele[i].getAttribute('id').replace("cdiv","");
                    	var getcomment = document.getElementById("c" + currcomid).getElementsByClassName("komentarcontent")[0];                 
                    	var getheader = document.getElementById("c" + currcomid).getElementsByClassName("komentarstatus")[0];
                    	var reasontxt = $.trim(getheader.textContent.replace("[  briši  ]","").replace(/'/g,"&#39;").replace(/"/g,'\\"')) + " :   " + $.trim(getcomment.textContent.replace(/'/g,"&#39;").replace(/"/g,'\\"'));
                    	var getcomuser = document.getElementById("c" + currcomid).getElementsByClassName("komentarlevo")[0];   
                    
						var reg = new RegExp("<a href=['\"]([^'\"]+)['\"]>");
						var hrefarray = reg.exec(getcomuser.innerHTML);
						var comuserid = hrefarray[0].replace(/[^0-9.]/g, "")
                    
                    	var actionnn = '$.post("https://www.partis.si/comment/delete/' + currcomid + '",{offset:\"0\",torrent_id:\"' + torrentid + '\"}); this.style.visibility=\"hidden\"; this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute(\"style\",\"opacity: 0.4;\")';
                    	if(comment2.test(localpath)){ actionnn = '$.post("https://www.partis.si/comment/delete/' + currcomid + '",{offset:\"0\",article_id:\"' + torrentid + '\"}); this.style.visibility=\"hidden\";';}
                                                 
                    	var besedilo = '<img src=\"http://shrani.si/f/1j/oL/2dn5nn50/brisi-komentar.png\"/>';
                      
                    	var action2 = '$.post(\"https://www.partis.si/user/warn/' + comuserid + '\",{time:\"240\",msg:\"' + reasontxt + '\"}); this.style.visibility=\"hidden\";';
                    	var besedilo2 = '<img src=\"https://www.partis.si/img/icons/exclamation.png\"/>';
                    	var action3 = 'if (confirm(\"Opozorim uporabnika? || ' + reasontxt.replace(/(\r\n|\n|\r)/gm,"") + '\")) { ' + action2 + ' }'
                         
                        //alert(allele[i].innerHTML + "\n" + "<a href='javascript:void(0)' onclick='" + actionnn + "'>" + besedilo + "</a>");
                    	allele[i].innerHTML = "<a href='javascript:void(0)' onclick='" + action3 + "'>" + besedilo2 + "</a><a href='javascript:void(0)' onclick='" + actionnn + "'>  " + besedilo + "</a>";
                	}
                }
			}
    	}, 1000);
    	
    } else if(localpath == "/skupnost/sale") {
		setTimeout(function () {
			var allele = document.getElementsByTagName("*");      
            for (var i = 0; i < allele.length; i++) {  
               	if(allele[i].innerHTML.indexOf("Brišem šalo") != -1) {
                	if(commentid.test(allele[i].getAttribute('id')) || jokeid.test(allele[i].getAttribute('id'))) {
                        
                  		var currcomid = allele[i].getAttribute('id').replace("jdiv","");
                    	var getcomment = document.getElementById("c" + currcomid).getElementsByClassName("komentarcontent")[0];                 
                    	var getheader = document.getElementById("c" + currcomid).getElementsByClassName("komentarstatus")[0];
                    	var reasontxt = $.trim(getheader.textContent.replace("[  briši  ]","").replace(/'/g,"&#39;").replace(/"/g,'\\"')) + " :   " + $.trim(getcomment.textContent.replace(/'/g,"&#39;").replace(/"/g,'\\"'));
                    	var getcomuser = document.getElementById("c" + currcomid).getElementsByClassName("komentarlevo")[0];   
                    
						var reg = new RegExp("<a href=['\"]([^'\"]+)['\"]>");
						var hrefarray = reg.exec(getcomuser.innerHTML);
						var comuserid = hrefarray[0].replace(/[^0-9.]/g, "")
                    
                    	var actionnn = '$.post("https://www.partis.si/skupnost/delete_joke/' + currcomid + '",{offset:\"0\"}); this.style.visibility=\"hidden\";';                         
                    	var besedilo = '<img src=\"http://shrani.si/f/14/iS/22bYwGcQ/9uxgq.png\"/>';
                      
                    	var action2 = '$.post(\"https://www.partis.si/user/warn/' + comuserid + '\",{time:\"240\",msg:\"' + reasontxt + '\"}); this.style.visibility=\"hidden\";';
                    	var besedilo2 = '<img src=\"https://www.partis.si/img/icons/exclamation.png\"/>';
                    	var action3 = 'if (confirm(\"Opozorim uporabnika? || ' + reasontxt.replace(/(\r\n|\n|\r)/gm,"") + '\")) { ' + action2 + ' }'
                         
                        //alert(allele[i].innerHTML + "\n" + "<a href='javascript:void(0)' onclick='" + actionnn + "'>" + besedilo + "</a>");
                    	allele[i].innerHTML = "<a href='javascript:void(0)' onclick='" + action3 + "'>" + besedilo2 + "</a><a href='javascript:void(0)' onclick='" + actionnn + "'>  " + besedilo + "</a>";
                	}
                }
			}
    	}, 1000);

    }
}

function addConfirm() {
    if(localpath != "/skupnost/uporabniki"){
	if(profil1.test(localpath) || profil2.test(localpath)) {
    
		var el = document.getElementById("pollholder").getElementsByClassName("linklistli");
  
		for (var i = 0; i < el.length; i++) {  
            
            if (el[i].innerHTML.indexOf("window.location=") != -1) {
				if (el[i].children.length <= 2) {
                	var opozorilotxt = el[i].children[0].textContent;
                	if($.trim(el[i].children[0].textContent) == "") { opozorilotxt = "Dodeli upload"; }
                    
                	el[i].children[0].setAttribute("original",el[i].children[0].getAttribute("onclick"));
                	el[i].children[0].setAttribute("onclick","window.location=");
                    el[i].children[0].setAttribute("opozorilo",opozorilotxt);
                    
                    el[i].addEventListener("click", prenovifunkcijo, false);
                }
                if (el[i].children.length == 2) {
                	var opozorilotxt = el[i].children[1].textContent;
                	if($.trim(el[i].children[1].textContent) == "") { opozorilotxt = "Dodeli upload"; }
                    
                    el[i].children[1].setAttribute("original",el[i].children[0].getAttribute("onclick"));               
                	el[i].children[1].setAttribute("onclick","window.location=");
                    el[i].children[1].setAttribute("opozorilo",opozorilotxt);
                    
                    el[i].addEventListener("click", prenovifunkcijo, false); 
                }
            
            } else if (el[i].innerHTML.indexOf("/user/del_comments/") != -1) {
                
                var oldhref = el[i].children[0].getAttribute("href");
                var newoc = 'window.location=\"' + oldhref + '\"';
                var opozorilotxt = el[i].children[0].textContent + " ?";
                var changedoc = 'if(confirm(\"' + opozorilotxt + '\")) { ' + newoc + ' }';
                
                el[i].children[0].setAttribute("href","javascript:void(0)");
                el[i].children[0].setAttribute("onclick",changedoc); 
            }
        }
    }
    }
}

function prenovifunkcijo(){
	var opozorilo = $(this.innerHTML).attr('opozorilo');
    var originalsc = $(this.innerHTML).attr('original');
    var id = document.URL.replace(/.*\//, '').replace(/\D/g, "").toString();
            
	if(opozorilo.indexOf("Opozorilo (") != -1){
        var reason = prompt(opozorilo + ": vpiši razlog");
    	if(confirm(opozorilo + " ?\n\nRazlog: " + reason)){ 
            if(opozorilo.indexOf("24") != -1) {
    			window.location.href = "http://www.partis.si/user/warn/" + id + "?time=24&msg=" + reason;
            } else if (opozorilo.indexOf("48") != -1) {
                window.location.href = "http://www.partis.si/user/warn/" + id + "?time=48&msg=" + reason;
            } else if (opozorilo.indexOf("1 teden") != -1) {
                window.location.href = "http://www.partis.si/user/warn/" + id + "?time=168&msg=" + reason;
            } else if (opozorilo.indexOf("14 dni") != -1) {
                window.location.href = "http://www.partis.si/user/warn/" + id + "?time=336&msg=" + reason;
            } else if (opozorilo.indexOf("1 mesec") != -1) {
                window.location.href = "http://www.partis.si/user/warn/" + id + "?time=720&msg=" + reason;
            } else if (opozorilo.indexOf("2 meseca") != -1) {
                window.location.href = "http://www.partis.si/user/warn/" + id + "?time=1440&msg=" + reason; 
            } 
    	}
    } else if (opozorilo.indexOf("Opozorilo za") != -1) {
        var reason = prompt(opozorilo + ": vpiši torrent");
    	if(confirm(opozorilo + " ?\n\nTorrent: " + reason)){
    		window.location.href = "http://www.partis.si/user/warn_hr/" + id + "?time=24&msg=" + reason;
    	}
    } else if (opozorilo.indexOf("Odstrani warn") != -1) {
        var reason = prompt(opozorilo + ": vpiši razlog");
    	if(confirm(opozorilo + " ?\n\nRazlog: " + reason)){
    		window.location.href = "http://www.partis.si/user/delwarn/" + id + "?msg=" + reason;
    	}
    } else if (opozorilo.indexOf("Ban uporabnika") != -1) {
        var reason = prompt(opozorilo + ": vpiši razlog");
    	if(confirm(opozorilo + " ?\n\nRazlog: " + reason)){
    		window.location.href = "http://www.partis.si/user/addban/" + id + "?msg=" + reason;
    	}
    } else if (opozorilo.indexOf("Dodeli upload") != -1 && this.innerHTML.indexOf("Dodeli download" ) == -1) {
        var amount1 = prompt(opozorilo + ": količina v GB");
        var reason = prompt(opozorilo + ": vpiši razlog");
        if(confirm(opozorilo + " ?\n\nKoličina: " + amount1 + " GB (" + Math.round(amount1 / 1024 * 100) / 100 + " TB)\nRazlog: " + reason)){
    		window.location.href = "http://www.partis.si/user/addupload/" + id + "?upload=" + amount1 + "&msg=" + reason;
    	}
    } else if (this.innerHTML.indexOf("Dodeli download") != -1) { //
        var amount1 = prompt("Dodeli download: količina v GB");
        var reason = prompt("Dodeli download: vpiši razlog");
        if(confirm("Dodeli download ?\n\nKoličina: " + amount1 + " GB (" + Math.round(amount1 / 1024 * 100) / 100 + " TB)\nRazlog: " + reason)){
    		window.location.href = "http://www.partis.si/user/adddownload/" + id + "?download=" + amount1 + "&msg=" + reason;
    	}
    } else if (opozorilo.indexOf("donacijo") != -1) {
        var amount1 = prompt(opozorilo + ": doniran znesek");
        var reason = prompt(opozorilo + ": način donacije");
        if(confirm(opozorilo + " ?\n\nZnesek: " + amount1 + " €\nNačin: " + reason)){
    		window.location.href = "http://www.partis.si/user/donation/" + id + "?amount=" + amount1 + "&msg=" + reason;
        }
    } else if (opozorilo.indexOf("Odstrani ban") != -1) {
        var reason = prompt(opozorilo + ": vpiši razlog");
    	if(confirm(opozorilo + " ?\n\nRazlog: " + reason)){
            var unbanid = originalsc.replace(/\D/g, "");
    		window.location.href = "http://www.partis.si/user/delban/" + unbanid + "?msg=" + reason;
    	}
    }
}

function quickmsg(){
    var el = document.getElementsByClassName("q4")[0].getElementsByClassName("q3")[0];
    var usern = $.trim(el.textContent);
    
    var msg1 = prompt("Sporočilo:");
    if(confirm("Zadeva: Sporočilo administratorja \n_____________________________\nSporočilo:\n" + msg1 + "\n_____________________________\nPošljem?")){
		$.post("https://www.partis.si/profil/sendmsg", {to: usern, subject: "Sporočilo administratorja", msg: msg1} );
	}
	
}

function fixizgled() {
    if(forum1.test(localpath) || forum2.test(localpath) || localpath == "/skupnost/forum") {
		document.getElementsByClassName("newz")[0].style.height="50px";
		document.getElementsByClassName("newztit2")[0].style.margin="25px 0 0 0";
	}
}

if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
	fixizgled();
}


function nastavbuttongmail() {
	if(localpath == "/torrent/latest") {
		var elema = document.getElementById("Login");
		elema.value = "Bris popularne domene";
        elema.addEventListener("click", brisdomene, false);
        
        elema.setAttribute("id","Login1");
        var elem2 = document.getElementById("Login");
		elem2.value = "          partis.si          ";
        elem2.setAttribute("onclick", "window.location=\"http://www.partis.si/\"");
	}
}

function brisdomene(){
    
	var elem = document.getElementById("leechseedlist").getElementsByClassName("tabelcatd");
	for (var i = 7; i <= elem.length - 1; i += 5)
	{
		if(elem[i].innerHTML.indexOf("gmail.com") != -1
           || elem[i].innerHTML.indexOf("hotmail.com") != -1
           || elem[i].innerHTML.indexOf("siol.net") != -1
           || elem[i].innerHTML.indexOf("yahoo.com") != -1
           || elem[i].innerHTML.indexOf("net.hr") != -1
           || elem[i].innerHTML.indexOf("outlook.com") != -1
           || elem[i].innerHTML.indexOf("amis.net") != -1
           || elem[i].innerHTML.indexOf("email.com") != -1
           || elem[i].innerHTML.indexOf("guest.arnes.si") != -1
           || elem[i].innerHTML.indexOf("t-2.net") != -1
           || elem[i].innerHTML.indexOf("volja.net") != -1
           || elem[i].innerHTML.indexOf("live.com") != -1) {
		elem[i].innerHTML = "";
		}
	}
}




nastavbuttongmail();

addConfirm();
                      
var id = document.URL.replace(/.*\//, '');
addlinklist("", "Hitro sporočilo", "http://www.partis.si/img/icons/email_go.png",true);
addlinklist("http://www.partis.si/torrent/oficir11/" + id, "Briši objave na forumu", "http://www.partis.si/img/icons/delete.png", false);
addlinklist("http://www.partis.si/torrent/oficir9/" + id, "", "http://shrani.si/f/2p/1g/2uqGn1WN/vzt9i.jpg", false);
addlinklist("http://www.partis.si/torrent/accounts/" + id, "Seznam računov", "http://shrani.si/f/2F/SF/3gwijXrE/d5niz.png",false);
addlinklist("http://www.partis.si/torrent/cheaters/" + id, "Goljufanje", "http://shrani.si/f/3r/P9/2rRsCyOB/qw.png",false);
addlinklist("http://www.partis.si/torrent/oficir2/" + id, "Počisti profil", "http://shrani.si/f/14/iS/22bYwGcQ/9uxgq.png",false);
addlinklist("http://www.partis.si/torrent/oficir/" + id, "Dodaj na izjeme", "http://www.partis.si/img/icons/table_multiple.png");
addlinklist("http://www.partis.si/torrent/protected/" + id, "Izjema?", "http://shrani.si/f/T/kQ/2bDIgqgY/pbief.png");
addlinklist("http://www.partis.si/torrent/oficir15/" + id, "Odstrani iz izjeme", "http://shrani.si/f/1N/Nk/3o7PcdKn/lznyg.gif", false);
addlinklist("http://www.partis.si/torrent/oficir3/" + id, "Potrdi uporabniški račun", "http://www.partis.si/img/icons/accept.png", false);
addlinklist("http://www.partis.si/torrent/oficir9/" + id, "", "http://shrani.si/f/2p/1g/2uqGn1WN/vzt9i.jpg", false);
addlinklist("http://www.partis.si/torrent/oficir4/" + id, "Odstrani donatorstvo", "http://www.partis.si/img/icons/coins_add.png", false);
addlinklist("http://www.partis.si/torrent/oficir6/" + id, "Email registracije", "http://www.partis.si/img/icons/information.png", false);
addlinklist("http://www.partis.si/torrent/last50/" + id, "Last50", "http://www.partis.si/img/icons/arrow_down.png", false);
addlinklist("http://www.partis.si/torrent/last100/" + id, "Last100", "http://www.partis.si/img/icons/arrow_down.png", false);
addlinklist("http://www.partis.si/torrent/last200/" + id, "Last200", "http://www.partis.si/img/icons/arrow_down.png", false);
addlinklist("http://www.partis.si/torrent/oficir10/" + id, "Prikaži sledilnik uporabnika", "http://www.partis.si/img/icons/group.png", false);
addlinklist("http://www.partis.si/torrent/oficir12/" + id, "Spremeni Passkey", "http://www.partis.si/img/load.gif", false);
addlinklist("https://www.partis.si/torrent/oficir14/" + id, "Spremeni geslo", "http://www.partis.si/img/icons/wrench.png", false);
addlinklist("https://www.partis.si/torrent/oficir8/" + id, "Pošlji ZS", "http://www.partis.si/img/icons/email.png", false);
addlinklist2("http://www.partis.si/torrent/seznami2/" + id, "Prenos po aktivnosti", "https://www.partis.si/img/icons/arrow_down.png", false);
addlinklist2("https://www.partis.si/torrent/seznami/" + id, "Po prenos podatkov", "https://www.partis.si/img/icons/arrow_down.png", false);
addlinklist2("http://www.partis.si/torrent/oficir9/" + id, "Kdo urejal", "http://www.partis.si/img/icons/pencil.png", false);
addlinklist2("http://www.partis.si/torrent/nfo/" + id, "NFO (prosti pogled)", "http://www.partis.si/img/icons/table_multiple.png", false);
addlinklist2("http://www.partis.si/torrent/oficir13/" + id, "Pobriši vse komentarje", "http://shrani.si/f/14/iS/22bYwGcQ/9uxgq.png", false);


calcbytes();
editip();
editclosebutton(id);


if(comment1.test(localpath) || comment2.test(localpath) ||localpath == "/skupnost/sale") {
$(document).ready(function(){    
    setInterval( function(){ newdelbutton(id); }, 2000);    
}); 
}


addmenuscript("window.location=\"http://www.partis.si/torrent/oficir7/\" + prompt(\"Vnesi sledilnik:\");", "Preveri ID uporabnika", "skupnost");
addmenuscript("window.location=\"http://www.partis.si/ip?ip=\" + prompt(\"Vnesi IP naslov:\");", "Preveri IP naslov", "skupnost");
addmenuitem("http://www.partis.si/torrent/latest", "Novi uporabniki", "skupnost");
addmenuitem("http://www.partis.si/torrent/announce", "Cheaters", "skupnost");
addmenuitem("http://www.partis.si/user/actions", "Trenutna dejanja", "partis");
addmenuitem("http://musi.partis.si/portal.php", "MuSi", "profil");
addmenuitem("http://www.partis.si/podpora/errors", "Napake", "podpora");
addmenuitem("http://www.partis.si/podpora/errors?status=fixed", "Odpravljene napake", "podpora");
addmenuitem("https://admin.google.com/partis.si/AdminHome", "Partis email", "skupnost");
addmenuitem("http://www.partis.si/news/list?page=10", "Sistemske novice", "partis");
addmenuitem("http://www.partis.si/news/new", "Nova sistemska novica", "partis");
addmenuscript("window.location=\"http://www.partis.si/torrent/oficir5/\" + prompt(\"Vnesi ID torrenta:\");", "Povrni torrent", "torrenti");
addmenuscript("window.location=\"http://www.partis.si/torrent/oficir1/\" + prompt(\"Vnesi ID torrenta:\");", "Kdo briše torrent", "torrenti");
addmenuitem("http://www.partis.si/logged_exceptions", "Logged exceptions", "partis");
addmenuitem("https://www.partis.si/ad/adlist", "Oglaševalci", "partis");
addmenuitem("http://announce.partis.si/mal", "SOL tracker", "partis");

if(dllist2.test(localpath)) {

//Get Table Header Elements
var head_ratio = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[1];
var head_povez = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[2];
var head_active = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[3];
var head_koncan = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[4];
var head_seeded = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[5];
var head_leeched = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[6];
var head_times = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[7];
var head_date = document.getElementsByClassName("tabelatrtop")[0].getElementsByTagName("*")[8];

//Resize table
head_ratio.setAttribute("style", "min-width: 120px;");
head_povez.setAttribute("style", "min-width: 120px;");
head_active.setAttribute("style", "min-width: 120px;");
head_koncan.setAttribute("style", "min-width: 120px;");
head_seeded.setAttribute("style", "min-width: 120px;");
head_leeched.setAttribute("style", "min-width: 120px;");
head_times.setAttribute("style", "min-width: 120px;");


/// Create Panel Elements ///

//Ratio
var opt1 = document.createElement("input");
opt1.type = "checkbox";
opt1.setAttribute("checked", "true");
opt1.setAttribute("id", "opt1");
head_ratio.insertBefore(document.createElement('p'), head_ratio.firstChild);
head_ratio.insertBefore(opt1, head_ratio.firstChild);

var numericc = document.createElement("input");
numericc.type = "number";
numericc.setAttribute("value", "0.40");
numericc.setAttribute("name", "maxratio");
numericc.setAttribute("step", "0.10");
numericc.setAttribute("style", "width:50px;");
numericc.setAttribute("min", "0");
head_ratio.appendChild(document.createTextNode(" pod"));
head_ratio.appendChild(document.createElement('br'));
head_ratio.appendChild(numericc);
head_ratio.appendChild(document.createElement('p'));

//Seeded
var opt2 = document.createElement("input");
opt2.type = "checkbox";
opt2.setAttribute("id", "opt2");
head_seeded.insertBefore(document.createElement('p'), head_seeded.firstChild);
head_seeded.insertBefore(opt2, head_seeded.firstChild);

var seededvar = document.createElement("input");
seededvar.type = "number";
seededvar.setAttribute("name", "seedlimit");
seededvar.setAttribute("step", "100");
seededvar.setAttribute("style", "width:60px;");
seededvar.setAttribute("min", "0");
head_seeded.appendChild(document.createTextNode(" pod"));
head_seeded.appendChild(document.createElement('br'));
head_seeded.appendChild(seededvar);
head_seeded.appendChild(document.createTextNode(" MB"));
head_seeded.appendChild(document.createElement('p'));

//Leeched
var opt3 = document.createElement("input");
opt3.type = "checkbox";
opt3.setAttribute("id", "opt3");
head_leeched.insertBefore(document.createElement('p'), head_leeched.firstChild);
head_leeched.insertBefore(opt3, head_leeched.firstChild);

var leechedvar = document.createElement("input");
leechedvar.type = "number";
leechedvar.setAttribute("name", "leechlimit");
leechedvar.setAttribute("step", "100");
leechedvar.setAttribute("style", "width:60px;");
leechedvar.setAttribute("min", "0");
head_leeched.appendChild(document.createTextNode(" nad"));
head_leeched.appendChild(document.createElement('br'));
head_leeched.appendChild(leechedvar);
head_leeched.appendChild(document.createTextNode(" MB"));
head_leeched.appendChild(document.createElement('p'));

//Connectable
var opt4 = document.createElement("input");
opt4.type = "checkbox";
opt4.setAttribute("id", "opt4");
head_povez.insertBefore(document.createElement('p'), head_povez.firstChild);
head_povez.insertBefore(opt4, head_povez.firstChild);

var connectvar = document.createElement("input");
connectvar.type = "checkbox";
connectvar.setAttribute("name", "ifconnect");
head_povez.setAttribute("align", "center");
head_povez.appendChild(document.createElement('br'));
head_povez.appendChild(connectvar);
head_povez.appendChild(document.createElement('p'));

//Active
var opt5 = document.createElement("input");
opt5.type = "checkbox";
opt5.setAttribute("checked", "true");
opt5.setAttribute("id", "opt5");
head_active.insertBefore(document.createElement('p'), head_active.firstChild);
head_active.insertBefore(opt5, head_active.firstChild);

var activever = document.createElement("input");
activever.type = "checkbox";
activever.setAttribute("name", "ifactive");
head_active.setAttribute("align", "center");
head_active.appendChild(document.createElement('br'));
head_active.appendChild(activever);
head_active.appendChild(document.createElement('p'));

//Ended
var opt6 = document.createElement("input");
opt6.type = "checkbox";
opt6.setAttribute("id", "opt6");
opt6.setAttribute("checked", "true");
head_koncan.insertBefore(document.createElement('p'), head_koncan.firstChild);
head_koncan.insertBefore(opt6, head_koncan.firstChild);

var koncanvar = document.createElement("input");
koncanvar.type = "checkbox";
koncanvar.setAttribute("name", "ifended");
koncanvar.setAttribute("checked", "true");
head_koncan.setAttribute("align", "center");
head_koncan.appendChild(document.createElement('br'));
head_koncan.appendChild(koncanvar);
head_koncan.appendChild(document.createElement('p'));

//Times
var opt7 = document.createElement("input");
opt7.type = "checkbox";
opt7.setAttribute("id", "opt7");
head_times.insertBefore(document.createElement('p'), head_times.firstChild);
head_times.insertBefore(opt7, head_times.firstChild);

var timesvar = document.createElement("input");
timesvar.type = "number";
timesvar.setAttribute("value", "0");
timesvar.setAttribute("name", "timeslimit");
timesvar.setAttribute("step", "1");
timesvar.setAttribute("style", "width:50px;");
timesvar.setAttribute("min", "0");
head_times.appendChild(document.createElement('br'));
head_times.appendChild(timesvar);
head_times.appendChild(document.createElement('p'));

//GoGoGadgetTM button
var gogovar = document.createElement("input");
gogovar.type = "button";
gogovar.setAttribute("name", "GoGoGadgetTM");
gogovar.setAttribute("value", "Filtriraj");
gogovar.setAttribute("style", "min-width: 150px;");
head_date.appendChild(document.createElement('br'));
head_date.appendChild(gogovar);
head_date.appendChild(document.createElement('p'));



function gogogo() {
    
	var elem = document.getElementsByClassName("tabelatr1");

	for (var i = 0; i <= elem.length - 1; i += 1) {
		var inner_elem = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[0];
		var inner_connect = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[1];
		var inner_active = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[2];
		var inner_ended = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[3];
		var inner_seeded = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[4];
		var inner_leeched = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[5];
		var inner_times = document.getElementsByClassName("tabelatr1")[i].getElementsByClassName("tabelcatd")[6];
        
        var isalltrue = true;
        
    	if (inner_elem.innerHTML.trim() != "Infinity" && isalltrue == true && opt1.checked) {
        	if (parseFloat(inner_elem.innerHTML.trim().replace(",", ".")) >= document.getElementsByName("maxratio")[0].value && isalltrue == true) {
        		isalltrue = false;
        	}
        //} else { isalltrue = false;
        }
        
        
        var checkConnect;
        if (inner_connect.innerHTML.indexOf("/img/icons/accept.png" && opt4.checked) != -1) {
            checkConnect = true;
        } else if (inner_connect.innerHTML.indexOf("/img/icons/delete.png") != -1 && opt4.checked) 
        { checkConnect = false; }
            
		if (document.getElementsByName("ifconnect")[0].checked != checkConnect && isalltrue == true && opt4.checked) {
			isalltrue = false;
		}
        
        var activeConnect;
        if (inner_active.innerHTML.indexOf("/img/icons/accept.png") != -1 && opt5.checked) {
            activeConnect = true;
        } else if (inner_active.innerHTML.indexOf("/img/icons/delete.png") != -1 && opt5.checked) 
        { activeConnect = false; }
            
		if (document.getElementsByName("ifactive")[0].checked != activeConnect && isalltrue == true && opt5.checked) {
			isalltrue = false;
		}
        
        var endConnect;
        if (inner_ended.innerHTML.indexOf("/img/icons/accept.png") != -1 && opt6.checked) {
            endConnect = true;
        } else if (inner_ended.innerHTML.indexOf("/img/icons/delete.png") != -1 && opt6.checked) 
        { endConnect = false; }
            
		if (document.getElementsByName("ifended")[0].checked != endConnect && isalltrue == true && opt6.checked) {
			isalltrue = false;
		}
        
        
        //Science stuff
        var my_num_seed = document.getElementsByName("seedlimit")[0].value;
        var seed_str = inner_seeded.innerHTML;
        var seed_str_spl = seed_str.split(" ");
        var seed_num = parseFloat(seed_str_spl[0].trim());
        var seed_unt = seed_str_spl[1].trim();
		var seed_num_mb;
        
        if (seed_unt == "Bytes") {
            seed_num_mb = 1;
        } else if (seed_unt == "KB") { 
            seed_num_mb = 1;
        } else if (seed_unt == "MB") { 
            seed_num_mb = seed_num;
        } else if (seed_unt == "GB") { 
            seed_num_mb = seed_num * 1024;
        } else if (seed_unt == "TB") { 
            seed_num_mb = seed_num * 1024 * 1024;
        }
            
		if (seed_num_mb >= my_num_seed && isalltrue == true && opt2.checked) {
			isalltrue = false;
		}
        
        var my_num_leech = document.getElementsByName("leechlimit")[0].value;
        var leech_str = inner_leeched.innerHTML;
        var leech_str_spl = leech_str.split(" ");
        var leech_num = parseFloat(leech_str_spl[0].trim());
        var leech_unt = leech_str_spl[1].trim();
		var leech_num_mb;
        
        if (leech_unt == "Bytes") {
            leech_num_mb = 1;
        } else if (leech_unt == "KB") { 
            leech_num_mb = 1;
        } else if (leech_unt == "MB") { 
            leech_num_mb = leech_num;
        } else if (leech_unt == "GB") { 
            leech_num_mb = leech_num * 1024;
        } else if (leech_unt == "TB") { 
            leech_num_mb = leech_num * 1024 * 1024;
        }
            
		if (leech_num_mb <= my_num_leech && isalltrue == true && opt3.checked) {
			isalltrue = false;
		}
        

        if (parseFloat(inner_times.innerHTML.trim().replace(",", ".")) == document.getElementsByName("timeslimit")[0].value && isalltrue == true && opt7.checked) {
        	isalltrue = false;
        }
        
        
        
        
/*
        if ( && isalltrue == true) {
            isalltrue = false;
        }
*/      
        
        
        if (isalltrue == true) {
        	elem[i].setAttribute("style", "");
        } else {
            elem[i].setAttribute("style", "display:none;");
        }
	}
    
}

gogovar.addEventListener("click", gogogo, false);
    
}
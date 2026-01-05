// ==UserScript==
// @name         Kurahen - idHighlight
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Podświetla ID
// @author       twoj stary
// @match       *://*.karachan.org/*
// @exclude     http://www.karachan.org/*/src/*
// @exclude     https://www.karachan.org/*/src/*
// @exclude     http://karachan.org/*/src/*
// @exclude     https://karachan.org/*/src/*

// @match       *://kara.8ch.net/*
// @exclude     http://kara.8ch.net/*/src/*
// @exclude     https://kara.8ch.net/*/src/*
// @exclude     http://kara.8ch.net/*/src/*
// @exclude     https://kara.8ch.net/*/src/*

// @grant        twoj stary
// @downloadURL https://update.greasyfork.org/scripts/26707/Kurahen%20-%20idHighlight.user.js
// @updateURL https://update.greasyfork.org/scripts/26707/Kurahen%20-%20idHighlight.meta.js
// ==/UserScript==

!function(a,b){function c(c,j,k){var n=[];j=1==j?{entropy:!0}:j||{};var s=g(f(j.entropy?[c,i(a)]:null==c?h():c,3),n),t=new d(n),u=function(){for(var a=t.g(m),b=p,c=0;q>a;)a=(a+c)*l,b*=l,c=t.g(1);for(;a>=r;)a/=2,b/=2,c>>>=1;return(a+c)/b};return u.int32=function(){return 0|t.g(4)},u.quick=function(){return t.g(4)/4294967296},u["double"]=u,g(i(t.S),a),(j.pass||k||function(a,c,d,f){return f&&(f.S&&e(f,t),a.state=function(){return e(t,{})}),d?(b[o]=a,c):a})(u,s,"global"in j?j.global:this==b,j.state)}function d(a){var b,c=a.length,d=this,e=0,f=d.i=d.j=0,g=d.S=[];for(c||(a=[c++]);l>e;)g[e]=e++;for(e=0;l>e;e++)g[e]=g[f=s&f+a[e%c]+(b=g[e])],g[f]=b;(d.g=function(a){for(var b,c=0,e=d.i,f=d.j,g=d.S;a--;)b=g[e=s&e+1],c=c*l+g[s&(g[e]=g[f=s&f+b])+(g[f]=b)];return d.i=e,d.j=f,c})(l)}function e(a,b){return b.i=a.i,b.j=a.j,b.S=a.S.slice(),b}function f(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(f(a[c],b-1))}catch(g){}return d.length?d:"string"==e?a:a+"\0"}function g(a,b){for(var c,d=a+"",e=0;e<d.length;)b[s&e]=s&(c^=19*b[s&e])+d.charCodeAt(e++);return i(b)}function h(){try{if(j)return i(j.randomBytes(l));var b=new Uint8Array(l);return(k.crypto||k.msCrypto).getRandomValues(b),i(b)}catch(c){var d=k.navigator,e=d&&d.plugins;return[+new Date,k,e,k.screen,i(a)]}}function i(a){return String.fromCharCode.apply(0,a)}var j,k=this,l=256,m=6,n=52,o="random",p=b.pow(l,m),q=b.pow(2,n),r=2*q,s=l-1;if(b["seed"+o]=c,g(b.random(),a),"object"==typeof module&&module.exports){module.exports=c;try{j=require("crypto")}catch(t){}}else"function"==typeof define&&define.amd&&define(function(){return c})}([],Math);

$(()=>{
	var useNames = true;
	var idWNawiasie = false;

	var opColor = "#ff8080";
	var names = ["Jan","Stanisław","Andrzej","Józef","Tadeusz","Jerzy","Zbigniew","Krzysztof","Henryk","Ryszard","Kazimierz","Marek","Marian","Piotr","Janusz","Władysław","Adam","Wiesław","Zdzisław","Edward","Mieczysław","Roman","Mirosław","Grzegorz","Czesław","Dariusz","Wojciech","Jacek","Eugeniusz","Tomasz","Stefan","Zygmunt","Leszek","Bogdan","Antoni","Paweł","Franciszek","Sławomir","Waldemar","Jarosław","Robert","Mariusz","Włodzimierz","Michał","Zenon","Bogusław","Witold","Aleksander","Bronisław","Wacław","Bolesław","Ireneusz","Maciej","Artur","Edmund","Marcin","Lech","Karol","Rafał","Arkadiusz","Leon","Sylwester","Lucjan","Julian","Wiktor","Romuald","Bernard","Ludwik","Feliks","Alfred","Alojzy","Przemysław","Cezary","Daniel","Mikołaj","Ignacy","Lesław","Radosław","Konrad","Bogumił","Szczepan","Gerard","Hieronim","Krystian","Leonard","Wincenty","Benedykt","Hubert","Sebastian","Norbert","Adolf","Łukasz","Emil","Teodor","Rudolf","Joachim","Jakub","Walenty","Alfons","Damian","Rajmund","Szymon","Zygfryd","Leopold","Remigiusz","Florian","Konstanty","Augustyn","Albin","Bohdan","Dominik","Gabriel","Teofil","Brunon","Juliusz","Walerian","Bartłomiej","Fryderyk","Eryk","Anatol","Maksymilian","Gustaw","Aleksy","Longin","Bartosz","Wilhelm","Ferdynand","Erwin","Klemens","Lechosław","Ernest","Seweryn","Herbert","Albert","Błażej","Izydor","Dionizy","Edwin","Ginter","Adrian","Mateusz","Walter","Helmut","Bazyli","Marceli","Sergiusz","Bonifacy","Werner","Eligiusz","Wawrzyniec","Kamil","Łucjan","Olgierd","Arnold","Jacenty","Dawid","Ewald","Manfred","Emilian","Klaudiusz","Zbysław","Igor","Benon","Jędrzej","Wit","Hilary","Apolinary","Fabian","Zenobiusz","Horst","Gerhard","Roland","Euzebiusz","Hipolit","Filip","Nikodem","Miron","January","Kajetan","Bazyl","Emanuel","Idzi","Donat","August","Dymitr","Ksawery","Ludomir","Narcyz","Lubomir","Witalis","Roch","Miłosz","Telesfor","Heronim","Ziemowit","Borys","Oskar","Zbyszko","Krystyn","Zbyszek","Cyryl","Gracjan","Patryk","Reinhold","Eliasz","Ewaryst","Felicjan","Rufin","Bruno","Herman","Beniamin","Kryspin","Rajnold","Apoloniusz","Engelbert","Cyprian","Walery","Medard","Gwidon","Celestyn","Jaromir","Tytus","Wiaczesław","Kornel","Wieńczysław","Maurycy","Oswald","Jeremi","Kurt","Ingrid","Klaus","Damazy","Eustachy","Otton","Korneliusz","Cezariusz","Tymoteusz","Justyn","Otto","Janisław","Anastazy","Ambroży","Polikarp","Heliodor","Jurek","Saturnin","Dieter","Winicjusz","Wolfgang","Gotfryd","Modest","Margot","Sylweriusz","Marcel","Radzisław","Bogusz","Witosław","Leonid","Serafin","Reinhard","Diter","Dyonizy","Wenancjusz","Olaf","Wasyl","Anatoliusz","Januariusz","Kacper","Oleg","Rościsław","Sławoj","Erazm","Dobiesław","Jurand","Karin","Aureliusz","Wilibald","Heinz","Rajnard","Dobrosław","Erhard","Radomir","Egon","Harald","Eustachiusz","Kordian","Napoleon","Roger","Onufry","Wendelin","Włodzisław","Eugieniusz","Wirgiliusz","Jeremiasz","Anzelm","Ruth","Lucjusz","Anatoli","Inez","Iwo","Irmgard","Sławek","Sylwin","Wieczysław","Wielisław","Zefiryn","Sylwiusz","Wawrzyn","Leoncjusz","Christian","Renard","Bertold","Faustyn","Orest","Patrycjusz","Wenanty","Gerwazy","Lubow","Reginald","Ronald","Urban","Dezyderiusz","Hans","Jozef","Lilli","Peter","Arseniusz","Georg","Harry","Józefat","Paulin","Bożydar","Chrystian","Donald","Ildefons","Ingeborg","Kalikst","Genadiusz","Lotar","Rajnhold","Berthold","Erich","Hugon","Mścisław","Paul","Dolores","Michael","Olech","Ładysław","Maks","Szczęsny","Kasper","Maksym","Milan","Renisław","Zbisław","Edgar","Melchior","Nelly","Oktawian","Sobiesław","Willi","Dietmar","Rut","Martin","Rene","Borysław","Richard","Darosław","Leonidas","Świętosław","Zachariasz","Armand","Astrid","Baltazar","Mieszko","Zacheusz","Lili","Miłosław","Rainhold","Waltraud","Bernardyn","Jordan","Jurgen","Waltraut","Beatrycze","Jarek","Jarogniew","Hannelore","Honorat","Inocenty","Lutosław","Makary","Nestor","Ditmar","Gabryel","Irosław","Rajner","Dobromir","Gunter","Josef","Lothar","Wadim","Wirginiusz","Ludwig","Rainer","Anneliese","Gilbert","Tomisław","Aleks","Ali","Kwiryn","Samuel","Światosław","Witaliusz","Aldon","Emeryk","Ernestyn","Franz","Oktawiusz","Rafael","Rajnhard","Renald","Symforian","Ariusz","Eberhard","Metody","Rosemarie","Wenecjusz","Witali","Algiment","Annemarie","Ariel","Armin","Carmen","Darek","Elisabeth","Elli","Lew","Nelli","Otmar","Pankracy","Ulrich","Olesław","Pius","Sabin","Władimir","Alwin","Andreas","Deonizy","Ernst","Jaremi","John","Olek","Siergiej","Sławian","Teobald","Ulryk","Żelisław","Doris","Edith","Eweryst","Ines","Lambert","Nel","Sigrid","Sławomierz","Tymon","Willibald","Andre","Dezydery","Edeltraud","Edeltraut","Ekspedyt","Gerd","Godzisław","Gothard","Hugo","Johann","Mamert","Marcjan","Odon","Serwacy","Stanislaw","Teodozjusz","Thomas","Amadeusz","Günter","Harold","Jacqueline","Jeremiusz","Radomił","Siegfried","Arno","Cezar","Danek","Felicytas","Fidelis","Gedymin","Georges","Kleofas"];
	var previevMode = false;

	var boardsWithId = ['*', 'z', 'b', 'элита'];
	if(boardsWithId.indexOf(board) == -1)return;

	$("body").click((e)=>{
		$(".post").css("opacity", "1");
		previevMode = false;
	});
		
	function escapeJqSel(str)  {
	    if (str)
	        return str.replace( /(:|\.|\/|\[|\]|,|=|@)/g, "\\$1" );   

	    return str;
	}

	function update(threadId){
		if($("#"+threadId+" .opContainer .posteruid").length){
			try{
				var opId = $("#"+threadId+" .opContainer .posteruid")[0].innerHTML.split("ID: ")[1].split(")")[0];
			} catch(err){
				var opId = $("#"+threadId+" .opContainer .posteruid")[0].id.split("uid_")[1];
			}
		} else {
			var opId = "adminSmiec";
		}

		var stats = [];
		$("#"+threadId+" .posteruid").each((i, el)=>{
			try{
				var id = el.innerHTML.split("ID: ")[1].split(")")[0];
			}catch(err){
				var id = el.title;
			}
			if(stats[id] == undefined){
				stats[id] = {"occurs": 0};
			}
			stats[id].occurs+=1;
		});

		$("#"+threadId+" .posteruid").each((i, el)=>{
			try{
				var id = el.innerHTML.split("ID: ")[1].split(")")[0];
			}catch(err){
				var id = el.title;
			}

			Math.seedrandom(id+"_"+threadId);
			var color = "hsl("+Math.floor(Math.random()*37)*10+", 90%, 61%)";

			var name = names[Math.floor(Math.random()*names.length)];

			var boxCss = {
				"padding": "2px 6px",
				"margin-right": "4px",
				"font-size": "11px",
				"cursor": "pointer",
				"background-color": id == opId ? opColor : color, 
				"border-radius": "6px",
				"color": "white",
				"text-shadow": "0px 0px 5px rgba(0, 0, 0, 1)",
				"font-weight": "bold" 
			};
			if(idWNawiasie)
				name += ' (' + id + ')';
			$(el).css(boxCss).html(id == opId ? "OP nitki" : useNames ? name : id);
			boxCss.cursor = "auto";
			if(inThread){
				if(!$(el).parent().find(".samefagCLabel").length)
					$("<span class='samefagCLabel'></span>").css(boxCss).text(stats[id].occurs).insertAfter($(el));
				else{
					$(el).parent().find(".samefagCLabel").text(stats[id].occurs);
				}
			}
			el.dataset.colored = "";
			el.id = "uid_"+id;
			el.title = id;
			$(el).click((e)=>{
				e.stopPropagation();
				var id = e.target.id;
				if(previevMode)return;
				$(".post:not(:has(#" + escapeJqSel(id) + "))").css("opacity", "0.3");
				previevMode = true;
			});
		});

		if(!inThread)return;
		var threadPostInfo = $(".thread#"+threadId+" .postInfo").first();
		if(!threadPostInfo.find(".threadStats").length){
			threadPostInfo.append("<span class='threadStats'></span>");
		}
		var uids = Object.keys(stats).length;
		var repls = $(".thread .postContainer").length;

		threadPostInfo.find(".threadStats").html(" [ "+repls+" replies / "+uids+" uniq IDs / "+ (repls/uids).toFixed(2) + " <a href=\"javascript:alert(\'samefag ratio, replies divided by uniq ids\')\">SFR</a> ]");
	}

	setInterval(()=>{
		$(".thread:has(.posteruid:not([data-colored]))").each((i, el)=>{
			update(el.id);
		});
	}, 1000);
});
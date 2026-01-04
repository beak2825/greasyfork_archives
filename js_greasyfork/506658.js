// ==UserScript==
// @name        IHKez
// @namespace   https://github.com/flushedface
// @match       https://bildung.ihk.de/webcomponent/dibe/AUSZUBILDENDER/berichtsheft/wochenansicht*
// @grant       none
// @version     1.0
// @author      flushedface
// @description Ein Tool welches das Schreiben von Berichtsheften erleichtert
// @downloadURL https://update.greasyfork.org/scripts/506658/IHKez.user.js
// @updateURL https://update.greasyfork.org/scripts/506658/IHKez.meta.js
// ==/UserScript==
window.DEBUG_LOG = [];
console.debug("IHKez")

class IHKezBerichtsheft {
  constructor(ctx,args) {
    if (ctx.__zone_symbol__xhrURL != "https://digbe.services.ihk.de/digitales-berichtsheft/erstellen-api/v1/berichtswoche") { return; }

    const berichtsheft = JSON.parse(args[0]);

    try {
      switch(true) {
        case berichtsheft.wochenBasis != "TAG":
          alert("Wochenberichte werden nicht Unterstützt")
          return;
          break;
      }
      console.debug(berichtsheft);
    }
    catch(e) {
      console.error(new Error(e));
    }
    this.berichtsheft = berichtsheft;
    this.tagesBerichte = berichtsheft.tagesBerichte;
    console.debug(this.berichtsheft,this.tagesBerichte)
  }

  copyBerichtsheft(stopAt=8) {
    for (let i in this.tagesBerichte) {
      // Überspringe den ersten eintrag
      i = (i == 0) ? 1 : i;
      // Wochenende Überspringen
      if (i >= stopAt) {break;}

      // Kopiere inhalt
      const copySrc = this.tagesBerichte[0];
      const copyKeys=["anwesenheit", "eintraege", "ort"];
      copyKeys.forEach((key) => this.tagesBerichte[i][key] = copySrc[key]);
    }

    this.berichtsheft.tagesBerichte = this.tagesBerichte;
    console.debug(this.berichtsheft.tagesBerichte);
  }

  clearBerichtsheft(stopAt=8) {
    for (let i in this.tagesBerichte) {
      // Wochenende Überspringen
      if (i >= stopAt) {break;}

      // Kopiere inhalt
      const copyKeys=["anwesenheit", "ort"];
      copyKeys.forEach((key) => this.tagesBerichte[i][key] = null);
      this.tagesBerichte[i]["eintraege"] = [];
    }

    this.berichtsheft.tagesBerichte = this.tagesBerichte;
    console.debug(this.berichtsheft.tagesBerichte);
  }

  toString() {
    return JSON.stringify(this.berichtsheft)
  }

  forArgument() {
    return [JSON.stringify(this.berichtsheft)];
  }
}



var buttons=[
	{
    "name": "Werktage multi-edit",
    "func": function() {
      hook = {
        apply(target,ctx,args) {
          let berichtsheft = new IHKezBerichtsheft(ctx,args);
          if(berichtsheft == undefined) { console.debug("Berichtsheft konnte nicht gefunden werden"); return Reflect.apply(...arguments)}

          alert(`${berichtsheft.tagesBerichte.length} einträge gefunden`)

          berichtsheft.copyBerichtsheft(5);
          // Objekt muss wieder in string umgewandelt werden welcher an stelle 0 des arrays ist
          const newArg = berichtsheft.forArgument();
          console.debug(newArg);

          const returnVal = Reflect.apply(target,ctx,newArg);
          setTimeout(() => location.reload(),3000);
          return returnVal;
        }
      }
      XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, hook);

      this.sendMessage("Bitte auf speichern drücken");
    }
	},
  {
    "name": "Alle Tage Multi-Edit (inkl. Samstag & Sonntag)",
    "func": function() {
     hook = {
        apply(target,ctx,args) {
          let berichtsheft = new IHKezBerichtsheft(ctx,args);
          if(berichtsheft == undefined) { console.debug("Berichtsheft konnte nicht gefunden werden"); return Reflect.apply(...arguments)}

          alert(`${berichtsheft.tagesBerichte.length} einträge gefunden`)

          berichtsheft.copyBerichtsheft();
          // Objekt muss wieder in string umgewandelt werden welcher an stelle 0 des arrays ist
          const newArg = berichtsheft.forArgument();
          console.debug(newArg);

          const returnVal = Reflect.apply(target,ctx,newArg);
          setTimeout(() => location.reload(),3000);
          return returnVal;
        }
      }
        XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, hook);

        this.sendMessage("Bitte auf speichern drücken und dann die seite neuladen !")
      }
    },
    {
    "name": "Woche löschen",
    "func": function() {
     hook = {
        apply(target,ctx,args) {
          let berichtsheft = new IHKezBerichtsheft(ctx,args);
          if(berichtsheft == undefined) { console.debug("Berichtsheft konnte nicht gefunden werden"); return Reflect.apply(...arguments)}

          alert(`${berichtsheft.tagesBerichte.length} einträge gefunden`)

          berichtsheft.clearBerichtsheft();
          // Objekt muss wieder in string umgewandelt werden welcher an stelle 0 des arrays ist
          const newArg = berichtsheft.forArgument();
          console.debug(newArg);

          const returnVal = Reflect.apply(target,ctx,newArg);
          setTimeout(() => location.reload(),3000);
          return returnVal;
        }
      }
      XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, hook);

      this.sendMessage("Bitte auf speichern drücken und dann die seite neuladen !")
    }
	},

] // Array End

function simpleUi(...args) {
	let IHKez = document.getElementById("IHKez");

	function createButton(buttonCallback) {
		console.debug(buttonCallback,'created');
		const name = buttonCallback.name;
		const elementId = `IHKez-${name}`;
		let button = document.createElement("button");
		button.id = elementId;
		button.innerHTML = `${name}`;

    button.addEventListener('notify', function (e) {
      const message = e.detail;
      const content = button.textContent;

      setTimeout(function() { button.textContent = content; button.classList.remove('notify'); button.onclick = button.onclick }, 5000);
      button.classList.add('notify');
      button.textContent = message;
    });

    let buttonFunction = function() {
      button.sendMessage = (message) => {
        this.dispatchEvent(new CustomEvent('notify', {
          "detail": message
        }));
      }
			buttonCallback.func.apply(button,...arguments);
		}

		button.onclick = buttonFunction;
		return button;
	}

	function createIHKez() {
		let container = document.createElement("div");
    let containerStyle = document.createElement("style");
    containerStyle.textContent = `
      #IHKez-title {
        width: 100%;
        letter-spacing: 4x;
        text-align: center;
        pointer-events: none;
        animation: mymove 5s infinite;
      }

      .notify {
        background-color: #cdef10;
        border-color: red;
      }

      #IHKez-buttons {
        display: flex;
        flex-wrap: wrap;
        position: absolute;
        width: 100%;
      }

      #IHKez-buttons button {
        flex-grow: 1;
        text-align: center;
      }

      @keyframes mymove {
        50% {letter-spacing: 50px;}
      }

      #IHKez-logo {
        width: 100%;
        height: 100%;
        position: absolute;
        pointer-events: none;
        opacity: 30%;
      }`;
		container.style.backgroundColor="white";
		container.style.display="block";
		container.style.position="fixed";
		container.style.width="30%";
		container.style.zIndex=100;
		container.id="IHKez";

    let title = document.createElement("h3");
    title.textContent = "IHKez";
    title.id = "IHKez-title";

    let logo = document.createElement("img");
    logo.src = "https://i.ibb.co/7YbBh2h/3dgifmaker49719.gif";
    logo.id = "IHKez-logo"

    container.appendChild(containerStyle);
    container.appendChild(logo);
    container.appendChild(title);


    let buttonContainer = document.createElement("div");
    buttonContainer.id = "IHKez-buttons"

		buttons.forEach((func) => {
      buttonContainer.appendChild( createButton(func) )
    });

    container.appendChild(buttonContainer);
		document.body.prepend(container);
	}



	if(IHKez == undefined) {
		createIHKez();
		IHKez = document.getElementById("IHKez");
	}

	switch (true) {
			// Auswahl UI erstellen
		default:
			break;
	}
}

simpleUi();

document["IHKezHelper"] = {
  "uniq": () => {
    test = [];
    window.DEBUG_LOG.forEach((log) => {
	    (log.ctx.name != undefined &! test.includes(log.ctx.name) ) ? test.push(log.ctx.name) : ""
    })
    return test;
  }
}





document["IHKezHelper"] = {
  "uniq": () => {
    test = [];
    window.DEBUG_LOG.forEach((log) => {
	    (log.ctx.name != undefined &! test.includes(log.ctx.name) ) ? test.push(log.ctx.name) : ""
    })
    return test;
  }
}

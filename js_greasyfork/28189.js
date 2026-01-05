// ==UserScript==
// @name	AnkiWeb Quiz
// @namespace	https://greasyfork.org/users/102866
// @description	Shows quiz on ankiweb.
// @match     https://ankiuser.net/*
// @match     https://ankiweb.net/*
// @author	TiLied
// @version	2.0.04
// @grant	GM_listValues
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_deleteValue
// @require	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant	GM.listValues
// @grant	GM.getValue
// @grant	GM.setValue
// @grant	GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/28189/AnkiWeb%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/28189/AnkiWeb%20Quiz.meta.js
// ==/UserScript==

class AnkiWebQuiz
{
	_Options = new Object();
	_Decks = new Object();
	_GlobalId = 0;

	_DeckId;

	constructor()
	{
		//GM.deleteValue("awqDecks");
		//GM.deleteValue("awqGlobalId");
		console.log("AnkiWeb Quiz v" + GM.info.script.version + " initialization");

		this._LoadOptionsAndDecks();
		this._SetCSS();

		globalThis.window.setTimeout(() =>
		{
			this._OptionsUI();
		}, 750);
	}

	_SetCSS()
	{
		globalThis.window.document.head.append("<!--Start of AnkiWeb Quiz v" + GM.info.script.version + " CSS-->");
			
			
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizGrid" +
		"{" +
			"display: grid;" +
			"grid-template-columns: repeat(4,auto);" +
			"grid-template-rows: auto;" +
			"grid-gap: 5px;" +
		"}</style>");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizButton" +
		"{" +
			"color: #fff !important;" +
			"background-color: #0275d8;" +
			"border-color: #0275d8;" +
			"font-size: 1rem;" +
			"border-radius: .3rem;" +
			"border: 1px solid transparent;" +
			"max-width:350px;" +
			"cursor: pointer;" +
			"max-height: 300px;" +
			"overflow: auto;" +
			"padding: 5px;" +
		"}</ style >");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizButton:hover" +
		"{" +
			"background-color: #025aa5;" +
		"}</ style >");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_true" +
		"{" +
			"background-color: #75d802;" +
		"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_true:hover" +
		"{" +
			"background-color: #5aa502;" +
		"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>.awq_trueBorder" +
		"{" +
			"border-color: #75d802;" +
			"border-width: 3px;" +
		"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_false" +
		"{" +
			"background-color: #d80275;" +
		"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_false:hover" +
		"{" +
			"background-color: #a5025a;" +
		"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>.awq_falseBorder" +
		"{" +
			"border-color: #d80275;" +
			"border-width: 3px;" +
		"}</style>");

		globalThis.window.document.head.append("<!--End of AnkiWeb Quiz v" + GM.info.script.version + " CSS-->");

	}
	async _LoadOptionsAndDecks() 
	{
		this._Options = await GM.getValue("awqOptions");
		this._Decks = await GM.getValue("awqDecks");
		this._GlobalId = await GM.getValue("awqGlobalId");

		if (this._Options == null)
		{
			this._Options = new Object();
			this._Options["Buttons"] = 8;
		}
		if (this._Decks == null)
			this._Decks = new Object();
		if (this._GlobalId == null)
			this._GlobalId = 0;

		//Console log prefs with value
		console.log("*prefs:");
		console.log("*-----*");

		let vals = await GM.listValues();

		for (let i = 0; i < vals.length; i++)
		{
			console.log("*" + vals[i] + ":" + await GM.getValue(vals[i]));
		}
		console.log("*-----*");
	}
	_OptionsUI() 
	{

		let nav = globalThis.window.document.body.querySelector(".navbar-nav");

		let num = `<label for=\"awqButtons\">Number of Buttons (4-12):</label>\r\n\r\n<input type=\"number\" id=\"awqButtons\" name=\"tentacles\" min=\"4\" max=\"12\" value=\"${this._Options["Buttons"]}\" />`;
		nav.insertAdjacentHTML("beforeend", num);

		let inputt = globalThis.window.document.querySelector("#awqButtons");

		inputt.addEventListener("change", (e) =>
		{

			let value = e.target["value"];
			console.log(value);
			this._Options["Buttons"] = value;
			GM.setValue("awqOptions", this._Options);

		}, false);

	}

	async Main() 
	{
		if (globalThis.window.document.location.pathname.startsWith("/decks"))
		{
			let strs = globalThis.window.document.querySelectorAll("button.btn-link");
			for (let i = 0; i < strs.length; i++)
			{
				let _node = strs[i];
				let _text = _node.textContent.trim().replaceAll(" ", "");

				if(this._Decks[_text] == null)
						this._Decks[_text] = new Object();

				_node.addEventListener("click", () => 
				{
					GM.setValue("awqDeckId", _text);
				}, true);

			}
			GM.setValue("awqDecks", this._Decks);
		}
		if (globalThis.window.document.location.pathname.startsWith("/study"))
		{
			this._DeckId = await GM.getValue("awqDeckId");
			if (this._DeckId == null) 
			{
				console.log("Deck id is null");
				return;
			}

			let _awq = globalThis.window.document.body.querySelector("#qa");	
			console.log(_awq);

			if (_awq == null) 
			{
				globalThis.window.setTimeout(() =>
				{
					this.Main();
				}, 1000);
				return;
			}
			let _inner = _awq.innerHTML;
			let _id = "";
			let keys = Object.keys(this._Decks[this._DeckId]);
			
			for (let i = 0; i < keys.length; i++)
			{
				if (_inner == this._Decks[this._DeckId][keys[i]]["question"]) 
				{
					_id = this._Decks[this._DeckId][keys[i]]["cardId"];
					break;
				}
			}

			if (_id == "") 
			{
				_id += this.GetId();

				this._Decks[this._DeckId][_id] = new Object();
				this._Decks[this._DeckId][_id]["cardId"] = _id;
				this._Decks[this._DeckId][_id]["question"] = _inner;
				this._Decks[this._DeckId][_id]["answer"] = "Use this deck more!";
			}

			this.Qiuz(_id);

			GM.setValue("awqDecks", this._Decks);
				
		}
	}

	Qiuz(id) 
	{
		this.PlayAudio();

		let cardsId = new Array();

		cardsId.push(id);

		let keys = Object.keys(this._Decks[this._DeckId]);

		let len = this._Options["Buttons"] - 1;
		if(len >= keys.length) 
		{
			len = keys.length- 1;
		}

		for(let i = 0; i < len; i++) 
		{
			let _randomInt = this.GetRandomInt(keys.length);
			let _id = keys[_randomInt];
			let _continue = false;

			for (let j = 0; j < cardsId.length; j++)
			{
				if (_id == cardsId[j])
				{
					i--;
					_continue = true;
					break;
				}
			}
			if (_continue)
				continue;
			else
				cardsId.push(_id);
		}
		//Console.WriteLine(cardsId);

		cardsId = this.Shuffle(cardsId);

		let before = globalThis.window.document.querySelector("#qa_box");
		let divGrid = globalThis.window.document.createElement("div");
		divGrid.classList.add("awq_quizGrid");

		before.parentNode.insertBefore(divGrid, before);

		let answer = globalThis.window.document.querySelector("button.btn-primary");
		if (!answer.classList.contains("awqEvent")) 
		{
			answer.classList.add("awqEvent");
			answer.addEventListener("click", () =>
			{
				let eases = globalThis.window.document.querySelectorAll("button.m-1");

				//Console.WriteLine(eases);
				for (let i = 0; i < eases.length; i++)
				{
					if (eases[i].classList.contains("awqEvent"))
						continue;

					eases[i].classList.add("awqEvent");
					eases[i].addEventListener("click", () =>
					{
						this.AddEventsForEases();
					}, false);
				}
			}, false);
		}

		for (let i = 0; i < cardsId.length; i++)
		{
			let div = globalThis.window.document.createElement("div");
			div.classList.add("awq_quizButton");
			div.id = cardsId[i];

			div.addEventListener("click", (e) => 
			{
				let _id = e.currentTarget.id;
				console.log(_id);

				let _button = globalThis.window.document.querySelector("button.btn-primary");
				_button.click();

				let _awq = globalThis.window.document.body.querySelector("#qa");
				this._Decks[this._DeckId][id]["answer"] = _awq.innerHTML;
				this.PlayAudio();

				globalThis.window.setTimeout(() =>
				{
					let _eases = globalThis.window.document.querySelectorAll("button.m-1");

					//Console.WriteLine(_eases);
					for (let i = 0; i < _eases.length; i++)
					{
						if (_eases[i].classList.contains("awqEvent"))
							continue;

						_eases[i].classList.add("awqEvent");
						_eases[i].addEventListener("click", () =>
						{
							this.AddEventsForEases();
						}, false);
					}

					if (_id == id)
					{
						div.classList.add("awq_true");
						div.classList.add("awq_trueBorder");

						_eases[1].classList.add("awq_trueBorder");
					}
					else
					{
						div.classList.add("awq_false");
						div.classList.add("awq_falseBorder");

						_eases[0].classList.add("awq_falseBorder");
					}
				}, 500);
				
			},false);

			let q = this._Decks[this._DeckId][cardsId[i]]["question"].replace("</awq>", "");
			let regex2 = new RegExp("style=", "g");
			let html = "<awq>" + this._Decks[this._DeckId][cardsId[i]]["answer"].replace(q, "").replace("\n\n<hr id=\"answer\">\n\n", "").replace("<img", "<img width=\"100%\"").replace(regex2, "data-style=");

			div.insertAdjacentHTML("beforeend", html);

			divGrid.append(div);
		}
	}

	AddEventsForEases() 
	{
		let grid = globalThis.window.document.querySelector(".awq_quizGrid");
		grid.remove();
		this.Main();
	}

	GetId()
	{
		let id = this._GlobalId++;
		GM.setValue("awqGlobalId", id);
		return id;
	}

	PlayAudio() 
	{
		let box = globalThis.window.document.body.querySelector("#qa_box");
		if (box != null)
		{
			let audio = box.querySelector("audio");
			if(audio != null)
				audio.play();
		}
	}

	GetRandomInt(max)
	{
		return Math.floor(Math.random() * max);
	}

	Shuffle(array)
	{
		for (let i = array.length- 1; i > 0; i--)
		{
			let _i = i + 1;
			let j = Math.floor(Math.random() * _i);
			let temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}

		return array;
	}
}


let awq;

window.onload = function ()
{
	awq = new AnkiWebQuiz();

	setTimeout(() =>
	{
		awq.Main();
		console.log(awq);
	}, 1000);
};
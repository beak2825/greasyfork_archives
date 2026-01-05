// ==UserScript==
// @name        Blur Title Reddit
// @namespace   https://greasyfork.org/users/102866
// @description Blurring a title which marked as spoiler in reddit, just like in fallout subreddit.
// @include     https://*.reddit.com/*
// @include     http://*.reddit.com/*
// @exclude     https://*.reddit.com/r/*/comments/*
// @exclude     http://*.reddit.com/r/*/comments/*
// @author      TiLied
// @version     0.8.00
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.listValues
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/27404/Blur%20Title%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/27404/Blur%20Title%20Reddit.meta.js
// ==/UserScript==

class BlurTitleReddit
{
	constructor()
	{
		console.log("Blur Title Reddit v" + GM.info.script.version + " initialization");

		this.Debug = false;

		this.btr_pTitle = false;
		this.asterisk = true;
		
		this.Scroll = 1;

		this._FirstTime();
		this._SetCSS();
	}

	_SetCSS()
	{
		document.head.append("<!--Start of Blur Title Reddit v" + GM.info.script.version + " CSS-->");

		document.head.insertAdjacentHTML("beforeend", `<style type="text/css">bdi.btr_title:hover \
	{                                         \
		color:inherit!important;          \
		background:transparent!important;     \
		text-decoration:none!important;       \
		text-shadow:0 0.1px 0 #dcddce         \
	}</style>`);

		document.head.insertAdjacentHTML("beforeend", `<style type="text/css">bdi.btr_title   { \
		color:rgba(255,60,231,0) !important;        \
		text-shadow: 0px 0px 1em black;               \
		padding: 0 2px;                               \
	}</style>`);

		document.head.insertAdjacentHTML("beforeend", `<style type="text/css">bdi.btr_trans                             \
	{                                         \
		transition: all 0.5s ease;            \
	}</style>`);

		document.head.insertAdjacentHTML("beforeend", `<style type="text/css">.btr_closeButton\
	{                         \
		cursor: pointer; \
		text-align: center; \
		font-size: 11px; \
		float:right;                           \
		margin-top:0px;                     \
		border:1px solid #AAA;               \
		width:16px;                         \
		height:16px;                        \
	}</style>`);

		document.head.insertAdjacentHTML("beforeend", `<style type="text/css">.btr_closeButton:hover                             \
	{                         \
		border:1px solid #999;               \
		background-color: #ddd;                          \
	}</style>`);

		document.head.insertAdjacentHTML("beforeend", `<style type="text/css">.title                                    \
	{                                         \
		overflow: visible !important;         \
	}</style>`);

		document.head.insertAdjacentHTML("beforeend", `<style type="text/css">"div.btr_opt { \
	position: fixed; bottom: 0; right: 0; border: 0; z-index: 500;\
	}</style>`);

		document.head.append("<!--End of Blur Title Reddit v" + GM.info.script.version + " CSS-->");
	}

	async _FirstTime()
	{
		if (this.HasValueGM("btr_GMTitle", false))
		{
			this.btr_pTitle = await GM.getValue("btr_GMTitle");
		}

		if (this.HasValueGM("btr_asterisk", true))
		{
			this.asterisk = await GM.getValue("btr_asterisk");
		}

		//Console log prefs with value
		console.log("*prefs:");
		console.log("*-----*");
		let vals = await GM.listValues();

		//Find out that var in for block is not local... Seriously js?
		for (let i = 0; i < vals.length; i++)
		{
			console.log("*" + vals[i] + ":" + await GM.getValue(vals[i]));
		}
		console.log("*-----*");
	}

	Main()
	{
		window.onscroll = function (ev)
		{
			if (window.pageYOffset >= window.innerHeight * btr.Scroll)
			{
				btr.Core();

				btr.Scroll += 1;
			}
		};

		this.Core();

		//Set UI of settings
		//TODO UI!
		//this.OptionsUI();
	}

	Core()
	{
		let _titlesDivQ = document.querySelectorAll("div.spoiler");
		let _titlesDiv = [];

		if (_titlesDivQ.length == 0)
		{
			function _IsSpoiler(_el)
			{
				let _spans = _el.querySelectorAll("span");

				if (btr.Debug)
					console.log(_el.querySelectorAll("span"));

				for (let i = 0; i <= _spans.length; i++)
				{
					if (i == _spans.length)
						return false;

					if (_spans[i].textContent == 'spoiler')
						return true;
				}
			}

			let _titles = document.querySelectorAll(".Post");

			for (let i = 0; i < _titles.length; i++)
			{
				if (_IsSpoiler(_titles[i]))
				{
					_titlesDiv.push(_titles[i]);
				}
			}
		} else
		{
			for (let i = 0; i < _titlesDivQ.length; i++)
			{
				_titlesDiv.push(_titlesDivQ[i]);
			}
		}

		if (_titlesDiv != this.titlesDiv)
		{
			if (this.Debug)
				console.log(_titlesDiv);

			this.titlesDiv = _titlesDiv;

			for (let i = 0; i < _titlesDiv.length; i++)
			{
				if (_titlesDiv[i].querySelectorAll(".btr_title").length > 0)
					continue;

				let _title = _titlesDiv[i].querySelectorAll("h3, a.title");

				if (this.Debug)
					console.log(_title);

				if (this.btr_pTitle == true)
				{
					let lengthOfIndexes = 0;

					this.ChangeString(_title[0].textContent.length, _title[0].textContent, _title[0], lengthOfIndexes);
				}
				else if (this.asterisk == true)
				{
					let lengthOfIndexes = this.GetAllIndexes(_title[0].textContent, "[", "(").length;

					lengthOfIndexes += this.GetAllIndexes(_title[0].textContent, "*", "even").length;

					this.ChangeString(_title[0].textContent.length, _title[0].textContent, _title[0], lengthOfIndexes);
				} else
				{
					let lengthOfIndexes = this.GetAllIndexes(_title[0].textContent, "[", "(").length;

					this.ChangeString(_title[0].textContent.length, _title[0].textContent, _title[0], lengthOfIndexes);
				}
			}
		}
	}

	ChangeString(l, sArr, tTitle, amountL)
	{
		const stringStartbdi = '<bdi class = "btr_main btr_title btr_trans">',
			stringEndbdi = '</bdi>';

		let amount = amountL;

		let string = "";

		if (amount > 3)
			amount = 1;

		let arrBeg = this.GetAllIndexes(sArr, "[", "(");
		let arrEnd = this.GetAllIndexes(sArr, "]", ")");

		if (this.asterisk === true)
		{
			arrBeg = arrBeg.concat(this.GetAllIndexes(sArr, "*", "even"));
			arrEnd = arrEnd.concat(this.GetAllIndexes(sArr, "*", "odd"));
		}

		arrBeg.sort(function (a, b)
		{
			return a - b;
		});

		arrEnd.sort(function (a, b)
		{
			return a - b;
		});

		if (amount === 0)
		{
			string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
			if (this.Debug)
			{
				console.info(string);
			}
			tTitle.innerHTML = string;
			return;
		}

		if (amount === 1)
		{
			if (this.Debug)
			{
				console.log("*words in brackets :", sArr.substring(arrBeg[0], arrEnd[0] + 1));
			}
			//IF WHOLE TITLE IN BRACKETS
			if (arrBeg[0] <= 2 && arrEnd[0] >= l - 2)
			{
				string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
				if (this.Debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}

			if (arrBeg[0] <= 2)
			{
				string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, l) + ' ' + stringEndbdi;
				if (this.Debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			} else if (arrEnd[0] >= l - 2)
			{
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
				if (this.Debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			} else
			{
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, l) + ' ' + stringEndbdi;
				if (this.Debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}
		}

		if (amount === 2)
		{
			let s = '';
			for (let a = 0; a < arrBeg.length; a++)
			{
				s += sArr.substring(arrBeg[a], arrEnd[a] + 1) + ' ';
			}
			if (this.Debug)
			{
				console.log("*words in brackets :", s);
			}

			//IF TITLE HAS ONE BRACKET WITHOUT CLOSING ONE
			if (arrBeg.length !== arrEnd.length)
			{
				ChangeString(l, sArr, tTitle, 1);
				return;
			}

			//IF WHOLE TITLE IN BRACKETS, NOT WORKING CORRECTLY TODO!
			if ((arrBeg[0] <= 2 && arrEnd[0] >= l - 2) || (arrBeg[1] <= 2 && arrEnd[1] >= l - 2))
			{
				string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
				if (this.Debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}

			if (arrBeg[0] <= 2)
			{
				if (arrEnd[0] + 4 > arrBeg[1])
				{
					string = sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				} else if (arrEnd[1] >= l - 2)
				{
					string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				} else
				{
					string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
			} else if (arrEnd[1] >= l - 2)
			{
				if (arrBeg[1] - 4 < arrEnd[0])
				{
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				} else if (arrBeg[0] <= 2)
				{
					string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				} else
				{
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
			} else
			{
				if (arrEnd[0] + 3 >= arrBeg[1])
				{
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				} else
				{
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, l) + ' ' + stringEndbdi;
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
			}
		}

		//Three groups of brackets
		//example sentence: "[spoiler0]_text1_[spoiler1]_text2_[spoiler2]"
		if (amount === 3)
		{
			let s = '';
			for (let a = 0; a < arrBeg.length; a++)
			{
				s += sArr.substring(arrBeg[a], arrEnd[a] + 1) + ' ';
			}
			if (this.Debug)
			{
				console.log("*words in brackets :", s);
			}

			//IF TITLE HAS ONE BRACKET WITHOUT CLOSING ONE
			if (arrBeg.length !== arrEnd.length)
			{
				ChangeString(l, sArr, tTitle, 1);
				return;
			}

			//IF WHOLE TITLE IN BRACKETS, NOT WORKING CORRECTLY TODO!
			if ((arrBeg[0] <= 2 && arrEnd[0] >= l - 2) || (arrBeg[1] <= 2 && arrEnd[1] >= l - 2) || (arrBeg[2] <= 2 && arrEnd[2] >= l - 2))
			{
				string = stringStartbdi + ' ' + sArr + ' ' + stringEndbdi;
				if (this.Debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}

			//case one:"[spoiler0]..."
			if (arrBeg[0] <= 2)
			{
				//case one:one:"[spoiler0][spoiler1]..."
				if (arrEnd[0] + 4 > arrBeg[1])
				{
					//case one:one:one:"[spoiler0][spoiler1][spoiler2]_text"
					if (arrEnd[1] + 4 > arrBeg[2])
					{
						//"[spoiler0][spoiler1][spoiler2]<blur>text</blur>"
						string = sArr.substring(arrBeg[0], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
						if (this.Debug)
						{
							console.info(string);
						}
						tTitle.innerHTML = string;
						return;
						//case one:one:two:"[spoiler0][spoiler1]_text_[spoiler2]"
					} else if (arrEnd[2] >= l - 2)
					{
						//"[spoiler0][spoiler1]<blur>text</blur>[spoiler2]"
						string = sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], l);
						if (this.Debug)
						{
							console.info(string);
						}
						tTitle.innerHTML = string;
						return;
						//case one:one:three:"[spoiler0][spoiler1]_text1_[spoiler2]_text2"
					} else
					{
						//"[spoiler0][spoiler1]<blur>text1</blur>[spoiler2]<blur>text2</blur>"
						string = sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
						if (this.Debug)
						{
							console.info(string);
						}
						tTitle.innerHTML = string;
						return;
					}
					//case one:two:"[spoiler0]...[spoiler2]"
					//"[spoiler0]...[spoiler1]":NEVER HAPPEND
				} else if (arrEnd[2] >= l - 2)
				{
					//case one:two:one:"[spoiler0]_text_[spoiler1][spoiler2]"
					if (arrEnd[1] + 4 > arrBeg[2])
					{
						//"[spoiler0]<blur>text</blur>[spoiler1][spoiler2]"
						string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], l);
						if (this.Debug)
						{
							console.info(string);
						}
						tTitle.innerHTML = string;
						return;
					}
					//case one:two:two:"[spoiler0]_text1_[spoiler1]_text2_[spoiler2]"
					else
					{
						//"[spoiler0]<blur>text1</blur>[spoiler1]<blur>text2</blur>[spoiler2]"
						string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], l);
						if (this.Debug)
						{
							console.info(string);
						}
						tTitle.innerHTML = string;
						return;
					}
					//case one:three:"[spoiler0]_text1_[spoiler1]_text2_[spoiler2]_text3"
				} else
				{
					//"[spoiler0]<blur>text1</blur>[spoiler1]<blur>text2</blur>[spoiler2]<blur>text3</blur>"
					string = sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
				//case two:"...[spoiler2]"
			} else if (arrEnd[2] >= l - 2)
			{
				//case two:one:"...[spoiler1][spoiler2]"
				if (arrEnd[1] + 4 > arrBeg[2])
				{
					//case two:one:one:"text_[spoiler0][spoiler1][spoiler2]"
					if (arrEnd[0] + 4 > arrBeg[1])
					{
						//"<blur>text</blur>[spoiler0][spoiler1][spoiler2]"
						string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], l);
						if (this.Debug)
						{
							console.info(string);
						}
						tTitle.innerHTML = string;
						return;
						//case two:one:one:"text1_[spoiler0]_text2_[spoiler1][spoiler2]"
						//"[spoiler0]_text_[spoiler1][spoiler2]":NEVER HAPPEND
					} else
					{
						//"<blur>text1</blur>[spoiler0]<blur>text2</blur>[spoiler1][spoiler2]"
						string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrEnd[1] + 1, l);
						if (this.Debug)
						{
							console.info(string);
						}
						tTitle.innerHTML = string;
						return;
					}
					//case two:two:"text1_[spoiler0][spoiler1]_text2_[spoiler2]"
				} else if (arrEnd[0] + 4 > arrBeg[1])
				{
					//"<blur>text1</blur>[spoiler0][spoiler1]<blur>text2</blur>[spoiler2]"
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrEnd[2] + 1, l);
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
					//case two:two:"text1_[spoiler0]_text2_[spoiler1]_text3_[spoiler2]"
				} else
				{
					//"<blur>text1</blur>[spoiler0]<blur>text2</blur>[spoiler1]<blur>text3</blur>[spoiler2]"
					string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], l);
					if (this.Debug)
					{
						console.info(string);
					}
					tTitle.innerHTML = string;
					return;
				}
				//case three:"text1_[spoiler0]_text2_[spoiler1]_text3_[spoiler2]_text4"
				//DO I NEED ALL CASES??? TODO!
			} else
			{
				//"<blur>text1</blur>[spoiler0]<blur>text2</blur>[spoiler1]<blur>text3</blur>[spoiler2]<blur>text4</blur>"
				string = stringStartbdi + ' ' + sArr.substring(0, arrBeg[0]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[0], arrEnd[0] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[0] + 1, arrBeg[1]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[1], arrEnd[1] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[1] + 1, arrBeg[2]) + ' ' + stringEndbdi + ' ' + sArr.substring(arrBeg[2], arrEnd[2] + 1) + ' ' + stringStartbdi + ' ' + sArr.substring(arrEnd[2] + 1, l) + ' ' + stringEndbdi;
				if (this.Debug)
				{
					console.info(string);
				}
				tTitle.innerHTML = string;
				return;
			}

		}
	}

	//second value can be "even" or "odd"
	GetAllIndexes(arr, val1, val2)
	{
		let indexes = [], temp = [], x, i;
		switch (val2)
		{
			case "even":
				for (x = 0; x < arr.length; x++)
					if (arr[x] === val1)
						temp.push(x);
				for (i = 0; i < temp.length; i++)
				{
					if (this.IsEven(i))
					{
						indexes.push(temp[i]);
					}
				}
				break;
			case "odd":
				for (x = 0; x < arr.length; x++)
					if (arr[x] === val1)
						temp.push(x);
				for (i = 0; i < temp.length; i++)
				{
					if (!this.IsEven(i))
					{
						indexes.push(temp[i]);
					}
				}
				break;
			default:
				for (x = 0; x < arr.length; x++)
					if (arr[x] === val1 || arr[x] === val2)
						indexes.push(x);
				break;
		}
		return indexes;
	}

	IsEven(n)
	{
		return n === parseFloat(n) ? !(n % 2) : void 0;
	}

	OptionsUI()
	{
		document.body.insertAdjacentHTML("beforeend", `<div id=btrSettings class='side jAyrXr'><div class=spaser ><div class=sidecontentbox><span class=btr_closeButton>&times</span> \
  <div class=title><h1>Settings of Blur Title Reddit` + GM.info.script.version + `</h1></div>\
  <ul class=content><li> \
  <form> \
  <br> \
  <p>Bluring option:</p>\
  <input type=radio name=title id=btr_showTitle >Show brackets</input><br> \
  <input type=radio name=title id=btr_hideTitle >Hide brackets</input><br><br> \
	<input type=checkbox name=asterisk id=asterisk >Show what between asterisks like brackets</input><br><br> \
  <input type=checkbox name=debug id=debug >Debug</input><br> \
  </form> <br> \
  <button id=btr_hide class=hauwm>Hide Settings</button></li></ul></div></div></div>`);


		//SET UI SETTINGS
		document.getElementById("debug").setAttribute("checked", this.Debug);
		document.getElementById("asterisk").setAttribute("checked", this.asterisk);
		

		if (this.btr_pTitle === true)
		{
			document.getElementById("btr_hideTitle").setAttribute("checked", true);
		} else
		{
			document.getElementById("btr_showTitle").setAttribute("checked", true);
		}

		document.getElementById("btrSettings").style.display = "none";

		//CHANGE SETTINGS BY INTERACT WITH UI
		document.getElementById("debug").addEventListener("click", async (e) =>
		{
			if (btr.Debug === true)
			{
				GM.setValue("btr_debug", false);
				btr.Debug = await GM.getValue("btr_debug");
			} else
			{
				GM.setValue("btr_debug", true);
				btr.Debug = await GM.getValue("btr_debug");
			}

			confirm("Settings has been changed.");
			if (btr.Debug)
			{
				console.log('debug: ' + await GM.getValue("btr_debug") + ' and debug: ' + btr.Debug);
			}
		});

		document.getElementById("asterisk").addEventListener("click", async (e) =>
		{
			if (btr.asterisk === true)
			{
				GM.setValue("btr_asterisk", false);
				btr.asterisk = await GM.getValue("btr_asterisk");
			} else
			{
				GM.setValue("btr_asterisk", true);
				btr.asterisk = await GM.getValue("btr_asterisk");
			}

			confirm("Settings has been changed.");
			if (btr.Debug)
			{
				console.log('btr_asterisk: ' + await GM.getValue("btr_asterisk") + ' and asterisk: ' + btr.asterisk);
			}
		});

		/* TODO!
		document.getElementById("#btr_showTitle").onclick((e) =>
		{
			GM.setValue("btr_GMTitle", false);
			btr_pTitle = await GM.getValue("btr_GMTitle");
			ReplaceOriginalTitles();
			MyFunction();
			alert("Settings has been changed. Now brackets showing.");
			if (debug)
			{
				console.log('btr_GMTitle: ' + await GM.getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
			}
		});
		

		$("#btr_hideTitle").change(async function ()
		{
			GM.setValue("btr_GMTitle", true);
			btr_pTitle = await GM.getValue("btr_GMTitle");
			ReplaceOriginalTitles();
			MyFunction();
			alert("Settings has been changed. Now brackets hiding.");
			if (debug)
			{
				console.log('btr_GMTitle: ' + await GM.getValue("btr_GMTitle") + ' and btr_pTitle: ' + btr_pTitle);
			}
		});
		*/

		//TODO ???
		//$(".side").append("<div class=spacer><div class=sidecontentbox><div class=title><h1>BLUR TITLE REDDIT</h1></div><ul class=content><li><button id=btr_show >Show settings</button></li></ul></div></div>");
		//console.log(currentLocation.pathname);
		//if (currentLocation.pathname === "/r/Steam")
		//{
		//    $(".debuginfo").after("<p><a id=btr_show style={float=right;}>show settings blur title reddit</a></p>");
		//} else {
		//$(".side").append("<div class=spacer><div class=account-activity-box><p><a id=btr_show >show settings blur title reddit</a></p></div></div>");
		//}

		document.querySelector("div[data-testid='subreddit-sidebar'], div.side").insertAdjacentHTML("beforeend", `<div class=spacer><div class=account-activity-box style=cursor:pointer;><p><a id=btr_show >show settings for blur title reddit</a></p></div></div>`);

		document.getElementById("btr_hide").addEventListener("click", (e) =>
		{
			document.getElementById("btrSettings").style.display = "none";
		});

		document.querySelector(".btr_closeButton").addEventListener("click", (e) =>
		{
			document.getElementById("btrSettings").style.display = "none";
		});

		document.getElementById("btr_show").addEventListener("click", (e) =>
		{
			document.getElementById("btrSettings").style.display = "block";

			if (!document.getElementById("btrSettings").classList.contains("btr_opt"))
				document.getElementById("btrSettings").className += " btr_opt";
		});
	}

	//Start
	//async Methods/Functions GM_VALUE
	async HasValueGM(nameVal, optValue)
	{
		let vals = await GM.listValues();

		if (vals.length === 0)
		{
			if (optValue !== undefined)
			{
				GM.setValue(nameVal, optValue);
				return true;
			} else
			{
				return false;
			}
		}

		if (typeof nameVal !== "string")
		{
			return alert("name of value: '" + nameVal + "' are not string");
		}

		for (let i = 0; i < vals.length; i++)
		{
			if (vals[i] === nameVal)
			{
				return true;
			}
		}

		if (optValue !== undefined)
		{
			GM.setValue(nameVal, optValue);
			return true;
		} else
		{
			return false;
		}
	}
	async DeleteValuesGM(nameVal)
	{
		let vals = await GM.listValues();

		if (vals.length === 0 || typeof nameVal !== "string")
		{
			return;
		}

		switch (nameVal)
		{
			case "all":
				for (let i = 0; i < vals.length; i++)
				{
					if (vals[i] !== "adm")
					{
						GM.deleteValue(vals[i]);
					}
				}
				break;
			case "old":
				for (let i = 0; i < vals.length; i++)
				{
					if (vals[i] === "debug" || vals[i] === "debugA")
					{
						GM.deleteValue(vals[i]);
					}
				}
				break;
			default:
				for (let i = 0; i < vals.length; i++)
				{
					if (vals[i] === nameVal)
					{
						GM.deleteValue(nameVal);
					}
				}
				break;
		}
	}
	async UpdateGM(what)
	{
		var gmVal;

		switch (what)
		{
			case "options":
				gmVal = JSON.stringify(options.values);
				GM.setValue("pp_options", gmVal);
				break;
			default:
				alert("class:Options.UpdateGM(" + what + "). default switch");
				break;
		}
	}
	//async Methods/Functions GM_VALUE
	//End
}

let btr;

window.onload = function ()
{
	btr = new BlurTitleReddit();

	setTimeout(() =>
	{
		btr.Main();
		console.log(btr);
	}, 1000);
};
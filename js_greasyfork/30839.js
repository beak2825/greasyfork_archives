// ==UserScript==
// @name	Pinterest Plus
// @namespace	https://greasyfork.org/users/102866
// @description	Show full size + open original image.
// @match     https://*.pinterest.com/*
// @match     https://*.pinterest.at/*
// @match     https://*.pinterest.ca/*
// @match     https://*.pinterest.ch/*
// @match     https://*.pinterest.cl/*
// @match     https://*.pinterest.co.kr/*
// @match     https://*.pinterest.co.uk/*
// @match     https://*.pinterest.com.au/*
// @match     https://*.pinterest.com.mx/*
// @match     https://*.pinterest.de/*
// @match     https://*.pinterest.dk/*
// @match     https://*.pinterest.es/*
// @match     https://*.pinterest.fr/*
// @match     https://*.pinterest.ie/*
// @match     https://*.pinterest.info/*
// @match     https://*.pinterest.it/*
// @match     https://*.pinterest.jp/*
// @match     https://*.pinterest.nz/*
// @match     https://*.pinterest.ph/*
// @match     https://*.pinterest.pt/*
// @match     https://*.pinterest.se/*
// @author	TiLied
// @version	0.7.02
// @grant	GM_openInTab
// @grant	GM_listValues
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_deleteValue
// @require	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant	GM.openInTab
// @grant	GM.listValues
// @grant	GM.getValue
// @grant	GM.setValue
// @grant	GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/30839/Pinterest%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/30839/Pinterest%20Plus.meta.js
// ==/UserScript==


class PinterestPlus
{
	static FirstInstance;

	_Urls = new Array();
	_BtnOn = false;

	_OldHash = "";
	_Check = 0;

	static 
	{
		this.FirstInstance = new PinterestPlus();
	}

	constructor() 
	{
		console.log("Pinterest Plus v" + GM.info.script.version + " initialization");
		
		this._SetCSS();
		this._FirstTime();
	}

	_SetCSS()
	{
		globalThis.window.document.head.append("<!--Start of Pinterest Plus v" + GM.info.script.version + " CSS-->");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'> button.ppTrue"+
		"{"+
		"border: 2px solid black!important;"+
		"}</ style >");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'> button.ppTrue"+
		"{"+
			"border: 2px solid black!important;"+
		"}</style>");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'> button.ppTrue"+
	"{"+
		"border: 2px solid black!important;"+
		"}</style>");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css' >#myBtn"+
	"{"+
		"pointer-events: auto; !important;"+
		"display: inherit; " +
		"align-items: center; "+
		"box-sizing: border - box; "+
		"color:#fff;"+
		"font-size: 16px; "+
		"font-weight: 700; "+
		"letter-spacing: -.4px; "+
		"margin-top: -4px; "+
		"border-style: solid; "+
		"border-width: 0px; "+
		"background-color: #e60023;"+
		"border-radius: 24px; "+
		"padding: 10px 14px; "+
		"will-change: transform; "+
		"margin-left: 8px; "+
	"}</style>");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>#myBtn:hover"+
	"{"+
		"background - color: #ad081b;"+
	"}</ style >");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>#pp_divFullSize"+
	"{"+
		"z-index: 500; !important;"+
		"justify-content: center;"+
		"display: grid;"+
	"}</ style >");

		globalThis.window.document.head.append("<!--End of Pinterest Plus v" + GM.info.script.version + " CSS-->");

	}

	async _FirstTime()
	{
		if (await this.HasValueGM("ppFullSize", false))
		{
			this._BtnOn = await GM.getValue("ppFullSize");
		}

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

	Main()
	{
		if (!globalThis.window.document.location.pathname.startsWith("/pin/"))
		{
			this.UrlHandler();
			return;
		}

		let buttonDiv = globalThis.window.document.createElement("div");
		let buttonButton = globalThis.window.document.createElement("button");
		let buttonText = globalThis.window.document.createTextNode("Full Size");
		
		
		
		let parentDiv;
		let shareButtonParent = globalThis.window.document.querySelector("div[data-test-id='share-button']");
		
		if (shareButtonParent != null)
		{
			parentDiv = shareButtonParent.parentElement;
		}
		else
		{
			parentDiv = globalThis.window.document.querySelector("div[data-test-id='closeupActionBar']>div>div," +
			"div[data-test-id='UnauthBestPinCardBodyContainer']>div>div>div," +
			"div.UnauthStoryPinCloseupBody__container>div>div," +
			"div[data-test-id='CloseupDetails']," +
			"div[data-test-id='CloseupMainPin']>div>div:last-child>div");
		}

		if (parentDiv == null)
		{
			globalThis.console.error("parentDiv:", parentDiv);
			return;
		}

		buttonButton.appendChild(buttonText);
		buttonDiv.appendChild(buttonButton);
		buttonButton.id = "myBtn";

		parentDiv.appendChild(buttonDiv);

		//
		//
		let queryCloseup = globalThis.window.document.querySelector("div[data-test-id='CloseupMainPin'], div.reactCloseupScrollContainer");

		if (queryCloseup == null)
		{
			globalThis.console.error("div[data-test-id='pin']:first, div.reactCloseupScrollContainer:", queryCloseup);
			return;
		}

		let div = globalThis.window.document.querySelector("#pp_divFullSize");

		if (div == null)
		{
			div = globalThis.window.document.createElement("div");

			div.id = "pp_divFullSize";

			queryCloseup.prepend(div);
		}

		div.style.setProperty("display", "none", "");

		if (this._BtnOn)
		{
			buttonButton.classList.add("ppTrue");

			div.style.setProperty("display", "grid", "");
		}

		this.Events(buttonButton);

		this.GetOrigRequest(buttonButton);

		this.UrlHandler();
	}

	async GetOrigRequest(btn)
	{
		let time = Date.now();

		let re = new RegExp("\\/(\\d+)\\/|pin\\/([\\w\\-]+)\\/?");
		let regU = re.exec(globalThis.window.document.location.href);


		let id = regU[1];

		if (id == null)
			id = regU[2];

		if (id == null)
		{
			globalThis.console.error("id is undefined");

			globalThis.console.log("Trying without request.");
			this.GetOrigNoRequest(btn);

			return;
		}
		
		let myHeaders = new Headers();
		myHeaders.append("X-Pinterest-PWS-Handler", "www/pin/[id].js");
		
		let init = {};
		init.method = "GET";
		init.headers = myHeaders;

		let urlRec = "https://" + globalThis.window.document.location.host + "/resource/PinResource/get/?source_url=%2Fpin%2F" + id + "%2F&data=%7B%22options%22%3A%7B%22id%22%3A%22" + id + "%22%2C%22field_set_key%22%3A%22detailed%22%2C%22noCache%22%3Atrue%7D%2C%22context%22%3A%7B%7D%7D&_=" + time;

		let res = await globalThis.window.fetch(urlRec, init);

		if (res.status != 200)
		{
			globalThis.console.error(`Request failed. Request: ${res}`);

			globalThis.console.log("Trying without request.");
			this.GetOrigNoRequest(btn);

			return;
		}

		let json = await res.json();
		let r = await json;
		if (r["resource_response"]["status"] == "success")
		{
			console.log(r["resource_response"]["data"]);

			let pin = r["resource_response"]["data"];

			if (pin["videos"] != null)
			{
				let k0 = Object.keys(pin["videos"]["video_list"])[0];

				this._Urls[0] = pin["videos"]["video_list"][k0]["url"];

				btn.setAttribute("title", "" + pin["videos"]["video_list"][k0]["width"] + "px x " + pin["videos"]["video_list"][k0]["height"] + "px");

				return;
			}

			if (pin["story_pin_data"] != null)
			{
				let sp = pin["story_pin_data"]["pages"];

				for (let i = 0; i < sp.length; i++)
				{
					if (this._Urls[0] == null)
					{
						this._Urls[0] = sp[i]["image"]["images"]["originals"]["url"];
						continue;
					}
					this._Urls.push(sp[i]["blocks"]["0"]["image"]["images"]["originals"]["url"]);
				}

				return;
			}

			this._Urls[0] = pin["images"]["orig"]["url"];

			btn.setAttribute("title", "" + pin["images"]["orig"]["width"] + "px x " + pin["images"]["orig"]["height"] + "px");

			if (this._BtnOn)
				this.Show(this._Urls[0]);

			return;
		}
		else
		{
			globalThis.console.error(r);
		}
	}

	GetOrigNoRequest(btn) 
	{
		let re = new RegExp("\\/\\d+x\\/");

		let imgs = globalThis.window.document.querySelectorAll("img");
		
		globalThis.console.log(imgs);
		
		if (imgs.length == 0)
		{
			globalThis.console.error("Query 'img' is null!");
			return;
		}

		let img =imgs[0];

		let scr = img.src;

		let match = re.exec(scr);
		if (match.length == 0)
		{
			globalThis.console.error(`No match. Url: ${scr}`);
			return;
		}

		scr = scr.replace(match[0], "/originals/");

		if (this._Urls[0] == null)
			this._Urls.push(scr);
		else
			this._Urls[0] = scr;

		if (this._BtnOn)
			this.Show(this._Urls[0]);
	}

	Events(btn)
	{
		btn.addEventListener("mousedown", (e) =>
		{
			if (e.button == 2)
			{
				if (this._BtnOn)
				{
					GM.setValue("ppFullSize", false);
					btn.classList.remove("ppTrue");
					this._BtnOn = false;
				}
				else
				{
					GM.setValue("ppFullSize", true);
					btn.classList.add("ppTrue");
					this._BtnOn = true;
				}

				//console.log("right");
			}
			if (e.button == 0)
			{
				this.Show(this._Urls[0]);

				let _div = globalThis.window.document.querySelector("#pp_divFullSize");

				if (_div.style.getPropertyValue("display") == "none")
					_div.style.setProperty("display", "grid", "");
				else
					_div.style.setProperty("display", "none", "");

				//console.log("left");
			}
			if (e.button == 1)
			{
				for (let i = 0; i < this._Urls.length; i++)
				{
					if (this._Urls[i] != null)
						GM.openInTab(this._Urls[i]);
				}

				//console.log("middle");
			}

			e.preventDefault();
		}, false);
	}

	Show(url)
	{
		let img = globalThis.window.document.querySelector("#pp_img");

		if (img != null)
		{
			img.setAttribute("src", url);
		}
		else
		{
			img = globalThis.window.document.createElement("img");

			img.id = "pp_img";
			img.setAttribute("src", url);

			let _div = globalThis.window.document.querySelector("#pp_divFullSize");
			_div.prepend(img);
		}
	}

	//Handler for url
	UrlHandler()
	{
		this._OldHash = globalThis.window.location.pathname;

		let that = this;
		let detect = () =>
		{
			if (that._OldHash != globalThis.window.location.pathname)
			{
				that._OldHash = globalThis.window.location.pathname;
				globalThis.window.setTimeout(() => 
				{ 
					this.Main();
				}, 1500);
			}
		};

		this._Check = globalThis.window.setInterval(() =>
		{
			detect();
		}, 250);
	}

	//Start
	//async Methods/Functions GM_VALUE
	async HasValueGM(nameVal, optValue)
	{
		let vals = await GM.listValues();

		if (vals.length == 0)
		{
			if (optValue != null)
			{
				GM.setValue(nameVal, optValue);
				return true;
			}
			else
			{
				return false;
			}
		}

		for (let i = 0; i < vals.length; i++)
		{
			if (vals[i] == nameVal)
			{
				return true;
			}
		}

		if (optValue != null)
		{
			GM.setValue(nameVal, optValue);
			return true;
		}
		else
		{
			return false;
		}
	}
	//async Methods/Functions GM_VALUE
	//End
}

window.onload = function ()
{
	setTimeout(() =>
	{
		PinterestPlus.FirstInstance.Main();
	}, 1250);
};
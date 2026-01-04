// ==UserScript==
// @name        Send Skype Credit+
// @namespace   V@no
// @author      V@no
// @description Speed up process sending skype credit: removed animation and remembering settings for each person.
// @include     https://secure.skype.com/send-credit
// @version     1.4.1
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/404116/Send%20Skype%20Credit%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/404116/Send%20Skype%20Credit%2B.meta.js
// ==/UserScript==
!function()
{
	'use strict';
	let log = console.log.bind(console),
			listDefault = [2, 1],
			list = {},
			prevId,
			noAuto,
			running,
			timer,
			userId = "",
			observer = new MutationObserver(function of(mutations, observer)
			{
				if (running || noAuto)
					return;

				if (!userIdLoad._inited)
				{
					clearTimeout(timer);
					userIdLoad();
					return timer = setTimeout(of);
				}
				running = true;
				let f,i = 1;
				for(let f in func)
				{
					func[f]();
				}
				prevId = list.id;
				running = false;
			}),
			func;

	func = {
//input username
		func1: function func1()
		{
			let qf = $$("quickFilterInput"),
					oe = $$("searchOptions"),
					ih = document.querySelector("div.input-holder"),
					bh = $$("clearFilterInput");

			function click(e)
			{
				if (!e.isTrusted)
					return;

				noAuto = true;
				if (e.target.id == "clearFilterInput" || e.target.parentNode.id == "clearFilterInput")
				{
					list.id = "";
					save();
				}
			}

			if (oe && !oe._inited)
			{
				oe.addEventListener("mousedown", function(e)
				{
					if (!e.isTrusted)
						return;

					let id = getId(e.target);
					if (!id)
						return;

					list.id = id;
					if (!list.data)
						list.data = listDefault.clone();

					save();
					prevId = null;
					noAuto = false;
				}, true);
				oe._inited = true;
			}

			if (ih && !ih._inited)
			{
				ih.addEventListener("click", click, true);
				ih._inited = true;
			}

			if (bh && !bh._inited)
			{
				bh.addEventListener("click", click, true);
				bh._inited = true;
			}

			if (qf && !qf._inited)
			{

				if (!noAuto && qf.value == "" && list.id)
				{
					qf.value = list.id;
					qf.dispatchEvent(new KeyboardEvent('keydown',{'key':'Shift'}));
				}
				qf._inited = true;
			}
		},//func1()

//pick user from list
		func2: function func2()
		{
			let obj = $$("contactListId-" + list.id);

			if (!obj || !list.data)
				return;

			obj.dispatchEvent(new MouseEvent('mousedown',{'button':0}));
		},//func2()

//select amount
		func3: function func3()
		{
			let obj = $$("offer-selection");

			if (!obj || obj._inited || !obj.children.length || !list.data)
				return;

			if (list.price < 0 || list.price > obj.children.length - 1)
				list.price = obj.children.length - 1;

			try
			{
				obj.children[list.price].click();
			}
			catch(e)
			{
				console.error(e);
				log(list.price);
			}
			obj.addEventListener("click", function(e)
			{
				if (!e.isTrusted)
					return;

				let c = findParent(e.target, obj),
						i = -1;

				if (c === null)
					return;

				while(obj.children[++i] != c);
				if (!list.data)
					return;

				list.price = i;
				save();
			}, true);
			obj._inited = true;
		},//func3()

//select design
		func4: function func4()
		{
			let obj = document.querySelector(".form-area.gift-card-holder");

			if (!obj || !list.data || !obj.children.length)
				return;

			if (!obj._inited)
			{
				let cb = document.createElement("input"),
						box = document.createElement("label"),
						r, //previous random index
						p = {
							get m(){return obj.children.length - 1},
							get i(){return Math.min(this.m, Math.max((list.design >> 1) - 1, 0))},
							set i(d){list.design = (list.design & 1) | (++d << 1)},
							get r(){return list.design & 1 ? true : false},
							set r(d){list.design = d ? list.design | 1 : list.design & ~1}
						},
//s = true: don't all current index get selected again
						sel = function (s)
						{
							let i = p.i;
							if (cb.checked)
							{
								let n = i;
								if (!s)
									n = r;

								while((i = rand(0, p.m)) == n || i == r);
								r = i;
//										i = rand(0, p.m);
							}
							if (obj.children[i])
								obj.children[i].click();
						};

				cb.type = "checkbox";
				cb.checked = p.r;
				cb.addEventListener("change", function(e)
				{
					p.r = cb.checked;
					sel();
				}, false);
				sel();
				box.appendChild(cb);
				box.appendChild(document.createTextNode("Random"));
				obj.parentNode.insertBefore(box, obj);
				obj.addEventListener("click", function(e)
				{
					if (!e.isTrusted && cb.checked)
					{
						p.r = true;
					}
					else
					{
						let c = findParent(e.target, obj),
								i = -1;

						if (c === null)
							return;

						while(obj.children[++i] != c);
						p.i = i;
						p.r = cb.checked = false;
					}
					save();
				}, true);
				obj._inited = true;
			}
		},//func4()

//click confirm
		func5: function func5()
		{
			let obj = $$("send-money");

			if (!obj)
				return;

			if (!obj._inited || prevId != list.id)
			{
				setTimeout(function()
				{
					obj.scrollIntoView(false);
				}, 300);
				obj._inited = true;
			}
//			obj.click();
		}//func5()
	};//func {}

	function $$(o)
	{
		return document.getElementById(o);
	}

	function ls(id, data, stringify)
	{
		let r;
		if (typeof(data) == "undefined")
		{
			r = localStorage.getItem(id);
			try
			{
				r = JSON.parse(r);
			}
			catch(e)
			{
				log(e);
				log([id, data, r]);
			}
			return r;
		}

		if (typeof(stringify) == "undefined" || stringify)
			data = JSON.stringify(data);

		r = localStorage.setItem(id, data);
		return r;
	}//ls()

	function rand(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function load()
	{
		let id = userId;
		list = ls("last");

		if (!list || typeof(list) != "object")
			list = {};

		if (!list[id])
			list[id] = {};

		let props = {
			l: {
				get()
				{
					return this[id];
				},
				set(x)
				{
					this[id][this.id] = x;
				}
			},
			data: {
				get()
				{
					return this[id][this.id];
				},
				set(x)
				{
					this[id][this.id] = x;
				}
			},
			id: {
				get()
				{
					return this[id][""];
				},
				set(x)
				{
					this[id][""] = x;
				}
			},
			price: {
				get()
				{
					return this.data && this.data[0];
				},
				set(x)
				{
					if (!this.data)
						this.data = listDefault.clone();

					this.data[0] = x;
				}
			},
			design: {
				get()
				{
					return this.data && this.data[1];
				},
				set(x)
				{
					if (!this.data)
						this.data = listDefault.clone();

					this.data[1] = x;
				}
			}
		};
		for (let p in props)
		{
			Object.defineProperty(list, p, props[p]);
		}
		if (!list.l)
			list.l = {"":""};

		let s = false;

//upgrade from old version
		for (let i in list)
		{
			if (i == "n")
			{
				if (!list.l[""])
					list.l[""] = list[i];

				delete list[i];
				s = true;
			}
			else if (Array.isArray(list[i]))
			{
				if (!list.l[i])
					list.l[i] = list[i];

				delete list[i];
				s = true;
			}
		}

//sanitize
		for (let m in list.l)
		{
			if (m == "")
				continue;

//old version
			if (m == "n")
			{
				if (!list.l[""])
					list.l[""] = list.l[m];

				delete list.l[m];
				s = true;
				continue;
			}
			let d = list.l[m],
					r = listDefault.clone();
				
			if (Array.isArray(d))
			{
				if (r.length != d.length)
					s = true;

				for(let i = 0; i < r.length; i++)
				{
					if (typeof(d[i]) == typeof(r[i]))
						r[i] = d[i];
					else
						s = true;
				}
			}
			list.l[m] = r;
		}
		if (s)
			save();

		userId = id;
	}//load()

	function userIdLoad()
	{
		if (userIdLoad._inited)
			return userId;

		userIdLoad.i = userIdLoad.i || 1000;
		userId = SKYPE.settings.storageKey;
		if (userId)
		{
			let n = "";
			for(let i = 0; i < userId.length; i++)
			{
				n += (parseInt(userId[i], 16) * i + 1).toString(36);
				i += parseInt(userId[i], 16);
			}
			for(let i = userId.length - 1; i >= 0; i--)
			{
				n += (parseInt(userId[i], 16) * i + i).toString(36);
				i -= parseInt(userId[i], 16);
			}
			let l = 10;//id length
			userId = n.substr(-Math.max(n.length / 2 + l / 2, l), l); //pick from middle of the string
		}
		else
		{
			let obj = document.querySelector("#injectedUhfPlugin > div > button"),
					u = "";
			if (obj && (u = obj.textContent.trim()))
			{
				userId = btoa(u);
			}

			else if (--userIdLoad.i)
				return;
		}

		load();
		userIdLoad._inited = true;
	}//userIdLoad()

	function save()
	{
		ls("last", list);
	}

	function getId(o)
	{
		if (!o)
			return;

		if(!o.id || !o.id.match("contactListId-"))
			return getId(o.parentNode);

		return o.id.replace("contactListId-", "");
	}

	function findParent(obj, parent)
	{
		if (!obj || !parent || obj == parent)
			return null;

		if (obj.parentNode == parent)
			return obj;

		return findParent(obj.parentNode, parent);
	}

	!function init()
	{
		Object.defineProperty(Object.prototype, "clone", {
			value: function()
			{
				return JSON.parse(JSON.stringify(this));
			}
		});

		Object.defineProperty(Array.prototype, "clone", {
			value: function()
			{
				return JSON.parse(JSON.stringify(this));
			}
		});

		if ($ && $.fn)
		{
			$.fn.animate = function(){};
		}

		observer.observe($$("container"), {
			subtree: true,
			childList: true
		});
		return true;
	}();

	//css
	let css = document.createElement("style");
	css.innerHTML = `
.offer-item
{
	height: unset;
	padding-top: 5px;
	padding-bottom: 5px;
}
.gift-card-span
{
	max-width: 22%;
	left: unset !important;
	right: unset !important;
	margin-top: unset;
}
.offers-footer,
.content-wrapper,
#amount-selector > div.row
{
	padding: 10px;
}
.gift-card-holder
{
	margin-top: 0.2em;
}

#design-selector > h3
{
	display: inline-block;
}
#design-selector > label
{
	float: right;
	line-height: initial;
	margin: 0;
	padding: 0;
	color: initial;
	font-weight: initial;
	width: initial;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
#design-selector > label,
#design-selector > label > input
{
	cursor: pointer;
}
#design-selector > label > input
{
	-webkit-appearance: checkbox;
}
.offer-item:not(.selected):hover
{
	background: initial;
}
#amount-selector span.balance-holder
{
	line-height: 1.7em;
	display: block;
}
#amount-selector span.balance-holder .user-balance
{
	font-size: 1.7em;
	vertical-align: text-bottom;
}
	`;
	document.head.appendChild(css);
}();
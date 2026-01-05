// ==UserScript==
// @name           BvS Hanafuda
// @namespace      Lunatrius
// @description    Highlight cards of the same suit, show all possible yaku and add click events (auto select a matching card from your hand with a card from the field and vice-versa).
// @include        http*://*animecubed.com/billy/bvs/partyhouse-hanafudaplay.html
// @include        http*://*animecubedgaming.com/billy/bvs/partyhouse-hanafudaplay.html
// @version        0.4.4
// @history        0.4.4 New domain - animecubedgaming.com - Channel28
// @history        0.4.3 Now https compatible (Updated by Channel28)
// @history        0.4.2 Fixed: Chrome/Opera bug
// @history        0.4.1 Fixed: You may use small cards now
// @history        0.4.1 Change: Added an option for card highlighting (all/only matching)
// @history        0.4.1 Change: Yaku/non-revealed cards can be moved to the right
// @history        0.4.1 Change: Changed June/September (alt: December/March) color a bit
// @history        0.4 Change: Most of the code is rewritten
// @history        0.4 Added: A config button and dialog (bellow the 'Forfeit' button)
// @history        0.4 Added: An alternate color set (south/north)
// @history        0.4 Added: Click event handlers
// @history        0.3.1 Added: show all non played cards
// @history        0.3.1 Fixed: P + A card would appear twice
// @history        0.3 Change: stretch the game field
// @history        0.2 Change: specific months have specific colors
// @history        0.1 Initial release
// @licence        MIT; http://www.opensource.org/licenses/mit-license.php
// @copyright      2011, Lunatrius
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/2466/BvS%20Hanafuda.user.js
// @updateURL https://update.greasyfork.org/scripts/2466/BvS%20Hanafuda.meta.js
// ==/UserScript==

// get an element by it's id
function $(id) {
	return document.getElementById(id);
}

// check if an item is in the array
Array.prototype.inArray = function(item) {
	for(var __i = 0, __la = this.length; __i < __la; __i++)
		if(this[__i] == item)
			return true;
	return false;
}

// check if an item is in the array
Array.prototype.count = function(item) {
	var __x = 0;
	for(var __i = 0, __la = this.length; __i < __la; __i++)
		if(this[__i].month == item.month)
			__x++;
	return __x;
}

// custom alert function - the default one is annoying
function cAlert(str) {
	var div = document.getElementById("cAlert");
	if(!div) {
		div = document.createElement("div");
		div.id = "cAlert";
		div.style.position = "fixed";
		div.style.right = "0px";
		div.style.bottom = "0px";
		div.style.fontFamily = "arial";
		div.style.fontSize = "12px";
		div.style.border = "1px solid black";
		div.style.backgroundColor = "white";
		div.innerHTML = "<b>Errors/Alerts</b> (one per line)";
		document.body.appendChild(div);
	}
	div.innerHTML = [div.innerHTML, str].join("<br/>");
}

// css style - browser compatibility
function addStyle(css) {
	var head = document.getElementsByTagName("head")[0];
	if (!head)
		return;
	var style = document.createElement("style");
	style.type = "text/css";
	style.textContent = css;
	head.appendChild(style);
}

// javascript - browser compatibility
function addJavaScript(js) {
	var head = document.getElementsByTagName("head")[0];
	if (!head)
		return;
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.textContent = js;
	head.appendChild(script);
}

// insert an element after a target element
function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if(parent.lastchild == targetElement)
		parent.appendChild(newElement);
	else
		parent.insertBefore(newElement, targetElement.nextSibling);
}

// add a class to the specified node
function addNodeClass(node, classname) {
	if((new RegExp(classname)).test(node.className))
		return;
	node.className = [node.className, classname].join(" ");
}

// remove a class from the specified node
function removeNodeClass(node, classname) {
	node.className = node.className.replace(new RegExp(classname, "i"), "");
}

// parse and save the pile node
function pileNode(node, pile, whos) {
	// regex
	var pileMatch = node.innerHTML.match(/billy.layout.hcards.thumbs.(\d+).jpg/gi);
	if(pileMatch)
		for(var _i = 0, pl = pileMatch.length; _i < pl; _i++) {
			var card = parseInt(pileMatch[_i].match(/\d+/));
			if(!pile.inArray(card))
				pile.push(card);
		}
}

// structure used for coloring, onclick events...
function Card(elm, mth) {
	this.element = elm;
	this.month = mth;
}

// parse out the month string
function getMonth(str) {
	var match = str.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
	if(match && match.length == 2)
		return match[1];
	return "unk";
}

// Storage
function Storage(namespace) {
	if (!namespace || (typeof(namespace) != "string" && typeof(namespace) != "number"))
		namespace = "ScriptStorage";

	this.set = function(key, value) {
		try {
			localStorage.setItem(escape(["BvS", namespace, key].join(".")), JSON.stringify(value));
		}
		catch(e) {
		}
	}

	this.get = function(key, defaultValue) {
		try {
			var value = localStorage.getItem(escape(["BvS", namespace, key].join(".")));
			if(value != null) {
				try {
					return JSON.parse(value);
				}
				catch(e) {
					return defaultValue;
				}
			}
			return defaultValue;
		}
		catch(e) {
			return defaultValue;
		}
	}

	this.del = function(key) {
		try {
			localStorage.removeItem(escape(["BvS", namespace, key].join(".")));
		}
		catch(e) {
		}
	}
}

// create an object - main code
function HanafudaMain() {
	// common css
	var COMMON_CSS = [
		".hand, .pile {background-color: rgba(0, 255, 0, 0.5);}",
		".field, .topcard {background-color: rgba(255, 255, 0, 0.5);}",
		".mycontrol {background-color: rgba(255, 127, 0, 0.5);}",
		".unk {background-color: rgb(200, 200, 200);}",
		".nomatch {opacity: 0.3;}"
	].join("\n");

	// css style - north
	var COLOR_CSS_NORTH = [
		COMMON_CSS,
		".jan {background-color: rgb(61, 133, 198);}",
		".feb {background-color: rgb(7, 55, 99); color: white;}",
		".mar {background-color: rgb(162, 235, 148);}",
		".apr {background-color: rgb(106, 168, 79);}",
		".may {background-color: rgb(39, 78, 19); color: white;}",
		".jun {background-color: rgb(255, 229, 70);}",
		".jul {background-color: rgb(241, 194, 50);}",
		".aug {background-color: rgb(127, 96, 0); color: white;}",
		".sep {background-color: rgb(249, 175, 95);}",
		".oct {background-color: rgb(230, 145, 56);}",
		".nov {background-color: rgb(120, 63, 4); color: white;}",
		".dec {background-color: rgb(159, 197, 232);}"
	].join("\n");

	// css style - south
	var COLOR_CSS_SOUTH = [
		COMMON_CSS,
		".jan {background-color: rgb(241, 194, 50);}",
		".feb {background-color: rgb(127, 96, 0); color: white;}",
		".mar {background-color: rgb(249, 175, 95);}",
		".apr {background-color: rgb(230, 145, 56);}",
		".may {background-color: rgb(120, 63, 4); color: white;}",
		".jun {background-color: rgb(159, 197, 232);}",
		".jul {background-color: rgb(61, 133, 198);}",
		".aug {background-color: rgb(7, 55, 99); color: white;}",
		".sep {background-color: rgb(162, 235, 148);}",
		".oct {background-color: rgb(106, 168, 79);}",
		".nov {background-color: rgb(39, 78, 19); color: white;}",
		".dec {background-color: rgb(255, 229, 70);}"
	].join("\n");

	// deck cards
	this.DECK = {
		"1"  : { month: "Jan", type: "B",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC34s8AfDUfB/4Y+ItG0/wzd6vD4asIdfsYLSHzt7W0cv2iTjG/c3zk/N+8WuJ0fwfod/ZpcXng/R9Plk+Zbd7SGSRV7bsLjdX1n+xbbabN4Y8L6fqEVg0tr4ZsbjT4diR7XliJuJNv/LR2SWNTJ/vr67p/id+yMVluNS+HlxbiL5ml0C6l2xKx5xBLz5f/AFzf5fRkr5PMsDUqx9rh2+bqrn6fkud0sJVlhsZ8Kbs/8z448beCfDtn4M8QTW/h/Sop49OuZEkSxiVlYRPggheDRXa/FzwV4m8J+BvFC654a1jTFj065jaSW0aSDcYiP9amY9vvuorzMIq8IONS6d+p9nicThKk1KlKLVu6Po74a+B7bTP2ZPCt3Loltqunaj4e0vU21Jk8240qZbGBScYZ/IPl8mP5k3yfIwrynxz8QtS+Br2/irSbvSopbhftVvJo3krp2oOzbmhVIGK7Sv3pJn+78yQo33cn9i79rm8sNN+HXwfkiS4u5rzyYr6fbIv2Vvn8nbkY25f5v9xa9Y+J0ng3wN4J8dXHjLwVpvi3wrpesWq2/wBqx5jWCs8MUQ2j/lncxyxrn5du3dX20anLF3W3kfhFePNVk13Z4z+1J+2gvxg/Z20fS9Ahl0K8177SdbhiuFkWKKDA8lXGNySO3/fMe2ivC/2ivHnhX4i+IbvUPBvh/wD4Rfwzb6LBZ2Ol+SkLRbUd2+WIlcF3fnPzfe/vUVnON2ezgJS9m/Ul/Y1t9AHxf0e+13xfpXhCKxtp7r+1r/UIYPIYQmKIR+YwXzN8m7H+zX1j8UNb8GeKPg58QvD/APwsLwC8BsI10WxXxTBc3d3LBcPdebLK02N0kjN8uKKKab5Sa+FpqtJeZ+d95cw2em3cMN3bSxNEyxR+crMqHnbj27f3aKKKynN3PYweDpxptJvc/9k=" },
		"2"  : { month: "Jan", type: "R(P)",  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1Pwxpfwm+HfwA+F3iPW/h14Y8Tz6vpNolwX0izV1lWyDu8srBiWJ3dfvVe8I+IvgJ4s1Kytbn4QeGNA0y4tpJH1iexsnhghiiMzsfk7on3vvVm/FawvZv2QvgXHE8LvdaPawp9o+aNc6UMdMf3N31r5b1vTbqz8BxW7XFzdQW95Bbq0s22SWUM6SEcD5S5+VG4/CvmK2KnSxUKUWrNrprqfo2GwNPEYCtipOXMuazT00PqO/HwU+K37PHxV1zw/4I8LaRrGj6ZqO1bbQ7eGeLNo5tpv3kQePLrtGz+NaK+K/AnjLUPAmg+IrqzTYuqaVrGj3cOx1WeGdJE+6f7j+VJz93y1SivWlHlsrng4KtN078z3O78JfHvXL7QdH8M6pYw3GmRro8MUmxla28q2ECSIcnfmM/PVvUrDT7nTfFei2uy7vF23CQzuzKzp+89P73WvGvDEMNzDextKiLJY2u9lR124i+857AN6ffavcNB1641680rUluPK3QSQ3tu/3fOjb94u3+/wDxf7tfPZnR9hKNeCt/ne/+Z9Xw/iFXVfBz7v7no/0PGd8b+EtTaPY6stz9x2m3ZUsMsfruC/8AAzRT/GFtdeD7nU/scT/Yb6zaS0W42TL9nmT5gkf8Oz5l3dvlNFe460qqjOmrprufOYfDfVnOjV0abM/w3qtrDD++vYYv3Vsq7rtPvBO3v/tN9yreleLf7Hv9QtdP1Owt7aaXzpVutkkMvypjb8r7T97n7396iit5KM1yTSa03M44dUa8qlObTv0YeLfFreKrOWO81u2u4rGCVkX5I181l2qqARoX4z/s0UUVz2jT92CSR6dGm6t5VJOTvu/kf//Z" },
		"3"  : { month: "Jan", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6y+AH7P8A8MNZ+A3w51C/+HfhPUL+78OadcXF1PolrJNPK1rGXZ3MeWYnqa74fs1/CUf80u8F/wDghtP/AI3Xxp/wTm/aMura8sfh7rs0I03UotujzfJH5V3HFt8k46+ZHFu/vbk/6a1+idcNpcq5krnq1KkueUeZ7s+evj/8APhhovwK+I1/YfDvwjZX1r4c1K4t7q10G2ilhlS2kZWVljyrBuQRRWF+3P8AHzSfht8OtV8HrKt1rXiPRb63lt9jPJBbvbzRLKcEbMv0/wCBUVlKVnaz+49PBzk4N834n5rfC7VbrwtpWj6xZzPb32l3P9oQyfLuV0mEi8D+Hd+LtX3lY/8ABRzSrb4raxpd/pU194K81vsmsWKfv44g20yGPH7xPod3+9XwB4VmWHQbePZvZmXbH93dlBk//XP+6tV7C2j8PX+nq3/EwnsVk+VU2wRRbY2/fqCN+77vJrt5eaHex4FaXLXl6s639oTx/ffFPxD4g8YXm9pdWvGkijZN3kW+wrbxYz8uI9uG+6frRXKeMHkm8NxNMkKStukZVTy1Vim5gNvC8n/V/lxRWNXdeh7GA/hv1KWm69Z2eg2kccsKXO5Wb7vy4Tbk/nVt7/TfsDrHe2zz3DLHLcPcJ5nPBPIztC7qKKIzZrVwNKVSUm3uw8Vaxp72Hl293bP+6dV8h1/uEbcAnH0/75bFFFFZVJvmPUweDpxptJvc/9k=" },
		"4"  : { month: "Jan", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6y/Z//Z/+F+s/Af4c6jqPw58J319deHNOuLi6utEtZZZpWtY2d3cx5ZierGvQf+GbfhL/ANEv8F/+E/af/G6Z+zf/AMm7/C7/ALFjS/8A0kjrjv2w/jbcfBn4VY0eXyvE+uS/2fp0n8UHGZJxn+JV+7n+N0riS5j1KtSXNL3jM+OPwR+E8HwE+JOq6L4D8Fx3Vn4f1SS3vrDRrRXhmjtpDlXWPKsjDrRXxT8Ff2j9XsfhX8TfBviTUH1DSPEHh7WobK4uHbdBex2kyr97nbIibTn+Py/4i1FZzi9Lo9DBVpODd2fdXwW+LHhXwf8AB74J+G9S1WFNe1nw1pMNpp6OGl+a3hVWZc5VNxxur5W/4KA+J5Na+Pdvo7MjWmh6PFGi7N3zzMZZdwH3lKeTuXr/ABD7tfJGiX+pf2xp999rmhn0vTLa4iummfzPOSIG2jV+eiRKifwqz7a9Y+N/xFtfiz8YvEXi7T0uUs9U+zTQLOnlsipbxxtjbn7siSc9R977rV0Uo8snqeNXdpyXmzyq5Rf+EP1CNXT7srM29pv77DLfxcdB/wADaikvJt/hjU2Z/lWKRdzurfMUBx8nAz7df9yilPc9bLv4T9TF0e80+z8NpNNcWyTrLFN5avub5MdVJP8Ad/hWtV7+x010+x6rZvYtKrLaxXG1rZ+fmj4XavzbqKKIzfKa1MDSlUlJt7spaxrFrc2E0dvepLL5UrbriZPlUoQQo4+Y0UUVhUm7nqYPB0402k3uf//Z" },
		"5"  : { month: "Feb", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzT4KfB+1+K2t+D/D9jpNgt1eRQNcXSW6TrEvlbnmlXk9P4dy5NffFv+xh8JtN8Cf8IbeaLokmuagskkesvplst88oYOzwjZ9xPl/djjb1rx74WxeM/ht8H/BE2i6hp3grSLjw9B4gupra2+0tqSi1h5eSYOd+6SPdFhFA+5uru/F3iI/tN+C/Dugt4lfwL4ss7j7dcxw20sdxcqqOpaybIbcV/wCWW7d8+x6+WwlbDyqVKCbc473X+Z9TmWbTxGIVOMuSKen+eh8a/tB/AtfhH4h8S6BNp+m3DWtjJfJfWtise5HiLIdpz5bA7xgf886K9M8afHFPG3wi1e11/wAN+Htfs9N8PXWkWerXTLNrSy/ZZBFclnkyp37N8fzbfmw70VNP2U3L2c9n93kfXYfF13Tj7Wm2+6tr/l6H1F8O/CMPxU/ZL+Gcely7r6y8PWMKbnaJWK2yRTQlsfL/ALLY+8iGvkH403kfw98Ty3WoeJYbTV7OJVXSYrSX7bPtYE+WUDwt8/pLwV+Vlau1+G+sa14/+DOleBfA/jOz8FeIbXTNP1yKzTWfI/tBFsUt7iNZEA8v50jlZT/y0kfd93dXzlqXhvxR8Ddbt7640T7Jq9uyzWV1qSfaY28tyfNgk+eOZP8Avr2rtrZZTqV1iVJxkrXStr99/wAD80xFKFaq4yXW1zT+KOg+LIbC41jxp4P1vSra80y52Qy27Wk985TzEurl13xvtl/etEu3/a+bc1Fe6fEH9sHXvEHw88bzalrNhqGjeIdFvtMOiRQtA2ntNbyLbSozR5fd1+Z/m/h6UVdCtSqpunprbVH0+GwmIow5Kkm+2t/kedXnjjS/ih8OvAul6pd+DftPhfTNPWxuH1SGwuZIUt0jnguTLKAzI6hlT+PZW6nie/0Xwb4rlh8QfDV9LvLNo/8AhGdS8WW17tldx/pVtEssiLLGi5+6rfvP4sUUUlh4zqqu2+az6u33G1VJRdG2jf6nzxr1z4d/s3VV024s/mgZljd0VmcwkORg8/OPl7/cooorpetrhQoqCai3uf/Z" },
		"6"  : { month: "Feb", type: "R(P)",  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1TwdofwT8HfB34Xt4q8IaEdV1jw7a3ksi+GEu55f3NuJJWl8p+pkz/vvisXxP8PPhX4x8TeIfFfw+0rSobvw74WvNQh8K6j4NSO0uZYonxI+9VR/neMlcbv6cp8Z9Ovb34EfBa1tbRLu8uvAlt5MfnNFwPIOWbI/vZp3we8caf4QsvE9xrniC20pbzwvf6bp+pT27bZ5WEO3EQJZ2OG6detfNvFS+tKjZW/4Fz9EeBvgJ43nlza+nxW/IofGzwx4Hs9YudSg8G6Jp1tefCd9WsbOw0u3hVr25V/3yjaMmHfnd99FiorhILDV/Fvw5vfEGh+Hde+16Toup276tdK8tp9h/s6WKaLzpY14iiLpx/Ht20V0QrusuZRcPVL7zjoxeHjyuopfNm9efE7VNeh+HXg+90220y20nwpZw2V4iO0s7S6fay+Y5OF2bU+VcfwferS+EPhnw74p8ZeFdG8XJNrelRax/Z80O9odrPEYUyUIO3eyGnfEPwh4in+DHw4+IX/CO/wBkWfhXw9otvLfRXCyNqFo9ujK7r1RVdmT/AGfO/wBmuU0pLfR9Y1W60+KztNIaCK+W8t90c0TH94snH3/m+b22142Pj7PExxHTTp23PpMqf1nBVsG3rd/jqvx+47z4rfFO78JeFvHvgDw/Eng3w1Y2eo2K+HbqJ7me+dkdZJZZZI8+Zs2yLtfai7fvUVjeN9M8SeNm8S/E/wCJcGia1BqXhLVLO0vmRYYtMvUt5Vit4l3ZM4YcAhvlffk0V6caTu37S6e2my7I8ChOMY8lSnqt9evW/mec+DPH8NhoOhWt5rthpT31nbaPe6l/a0UzLaSxRxGGeCMF2jjiG4qflT7n3qtfECTQ/hf4juvDej+JfD3i3w5b7m06+s9WSXdas24Qv5UmM8cqf4v9l6KKqnhKTpuM7u7vq3+BrOtUp1nOlLldraW2GRfHfT7rwr4y0PxAuj3+lappl01tDE5ka21L7O6W9wnzD5iGVG/9BbZRRRXUqcIJRitERTlOblOcm23d/wBI/9k=" },
		"7"  : { month: "Feb", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3r4X+EPhTong34A6NrHwp8LapqHjbQYN+sXGj2jMk0djDKTIWiJdpC1e7f8M2/CQc/wDCsPBf/ghtP/jdfI+sWfiTw5on7K3jHUNdtk8FW8Ph63htHfa1tM1onmO3y/MrIv8Aer7v8Q+ItK8J6ZLqOt6nZ6Rp0TKr3V/MsMSknAyzECuC+ux69WU/aP3m7nzz+0p8JPg34G+CHjS4bwT4I0TVrnQ9Ri0qZdHtIJ3u1s5pEWFggO8bNwxRXj/7YvxT0/40fCewvtHtJktrHVfEdiizuknntaafPG0wKn5UKM8i/wD2VFTKVna34Hp4LnlTb5uvc8/8c6vcWXw58EalNf23i3RNH8DaP9o0WK72yaR5ttawuzQgjdu8xW3D5v4Tt+Wu7+E3xHtPFvw1sfA3xh0/Vf8AhGrrU/8AiVaz9rlkntmV1SOGYnLKvPXe+3dtNdp4f8OfB7wh+zt4T1DxNp+/xD4u8E2FjNBYOWv7uJraAMYkZtq4KIS/H3K+EvEPhuRNV1qz0HWNS1jSNJ8pX1RdOaBYF3fu1k+X90+75T8/z/3nrzfq8lieelJJu3Mm2/d8l0LniYxouNSLsn7skup3t5b+Lm8E+KNN8I+F5rrwT4Jn8QxzXkG6eFReQvG2WHP7qFc7v++vvUV6j8LvjL4M8P8A7PXxX8Hm9v8AQpdQ8OX8enaPdbZbJZTaThhHMD/rJGP8QX/gVFenOLbvdr7h5fWjTpuLSeu+v/APGPAHjnWfiTH4N8P3HjLQfD8+l2cVrFrmt6yltFp9qkWxF2tIm5k7J81fVYs/C/gPwBd6Z4F+P/gH+3tW1FbjWL/UdYtFSe1CMqQKjSS/ICzFgfvb2/3aKK5/YU5T9rb3tr9R13KMnC+m9tO/oeYftW/C74Snwzqvib4a/ETwa1yLWRr3w3Br1s3mNs5a0Xzc/wDbL/vj+4SiiumTdzowOHhySXmf/9k=" },
		"8"  : { month: "Feb", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6y/Z//Z++GOs/Af4c6hqPw58J319d+HNOuLi6utEtZZZpWtY2d3do8sxPVq77/hmv4S/9Eu8F/wDghtP/AI3XG+BviL/wrD9lr4Mah9i+2/2hp/h3SdrS+WsX2iGKMyZwfurzivcdTmuLXTb2Wzg+1XkcUjQ2+/b5rhSVXPvXnHqTqzc5e91Phz4xfCnwPp/xK+OGm2Xgvw1aWOmfCuTVLGG30S1jW2u/9JHnxlYwyyfKvIorjp/GnjD4reMvjXrniTTofCuoWXwvvY7jT7XLLcwrFcIFYMx2fO+7/tnRRJxlZnq4VThFpzv8xviL44alq37KXw78N6Lpf9ra7oFtot/Le2GJLaLyQPKjKE/M4Xy9+D97ivpW5tvih8XP2XRc/arbTPGeoYvIf7Lm8hbu0LZWPerfu2dG/vfX+KvjKfwhbz+CNI0/QdA8T2uoR+ENM1i4+bz7C5U2kLXDqqqWCurtt5+Wb+GvSbL9tHXh/Z+paLcW3h/QdNtkt4fCflM0bWqfI7G48pm3r8i+Zwv+y1ebKrOmn9Yfut2XKn+P+ZrOhCpUvh4+8nzO/wCB5tr02rfB7xT400HVvDVzoOp3vgTUrC+itcSpPbvbSC3Zu339rnaxZNjrRXR3UN54k/4XOuhePLzxBPH8OmuLvVr/AGySbE2S3FjuUt0Rthbcfm3CiuilS+rQVOCbXm7nRRqU8TzTm0ne3XXzO88W/tO/DXRv2Vfhx4ObWv7a8Qr4e0tntdH1NIPsk0dvGNs83zbGDDBjA3/7v3q+V7SSx+MXxKuJW1vwx4Ui1i6867mvL63stOs/70oV5Bkj5sDczNRRXdB6XscFbCQ953eh9VaN/wAK1+EHwK+Nnh+x8efD/Un1DQb+30q8stbtpdT1DdazALKA/UsU2xpRRRWcm1odeEow5Xof/9k=" },
		"9"  : { month: "Mar", type: "B",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzuWWDwP8AD7wzozeAvCuny6ro9jqUF9qlvpl/qF40kSM8iyPGxiRvlKxOu/8Aefere+Ielwro/gjxNH4Q8IWFze2M8W3TNJ09ItQRHwjywurpHKR8/mAD+7trq7nU4/BvwT8JNcbNbgm8PWP7lfs/kNLLaRsS5lYsr28bR7tq/d8n7u7bXn/jC21T4m+Kr3xZbxQvFqF5LcJNLDb20UF0yF4/3ztiPy/l2uv3vl/ievCrRcb8krt207H6Dh3Gdude6m3zd32NHXfC1xqfw3vfGjWXw+tdKvNH1ix2v4ZtLaSLyk3xy27RIFaZ3byklGNv50V3Ov2+j+LfBHjrWLP+ytQl/sPUGmvGeVGnZNPnYNOkgx52/wDeRDG777f3qK7ndKKTTst+5y0ndya0127HG+GPEEesfBTwv4PuvD+iXsSpaXFrNYPNZXay3CiOXe0weCQlY0ZuY/4cfNXVeHrDwlfab4q0nS4vElhZ6tbafNZteaTDq3kTRN5jYubIn5Hij5j2bv4q4Pwfc3CeBtCW40qaW2/sy22tbus25fKTqnBq7c3Oh3M0S3XkpK33YbpGj/hK/dbC/dNe7QynA42KeFxUeZpJp2v57W6WS0Ir4TGUJXfMle600uUXTQfD3w38Vxt4tttQs7zTr61XS7+x1NZJ3ELyW9wkpgVfOWTZhX/hZtzUVc8Z6r/xRniDydYmlb+zLpf+P5pN2bUx4+9/cG2iuLEZJWwjjTTi9O7+fQ6aDrNOVSWrfocT4P8AijHpXhjR7WTU9HuPJs4I/LluFhkiURAbSef5V0sPxm8PvvjuLhIl/vJdwzK3/kQfyoor5epleGqx57Wb7Ox7FDN8bRk4c90u6X+RleKviL4J17wlrUcd3Zvdtp06w+bCvmeaUfbg+uaKKKzpYOFKPKpP7/8AgHoPMKla05xjf0P/2Q==" },
		"10" : { month: "Mar", type: "R(P)",  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwG21GzuPD2hLfaFoMXk6Otu0n9mQr5+XjKyTSpHnefmw/3/lYM9el+HodHubB2vvh1o97LCskNrJBb2MUc6GERfONobKONwl+83Xr81Ol8GXusW3gxtJfzba68N2M0DRSsqq8WlQefGwx82X3kAD72/13VqfEJJtV8W3V9peq6bDbLeXNrY6hLb7WnfcYQyrkbEKLuVa+SxFSvg/3l93ZXP1nC08Pjpeys9E27aNapb/M9K0T4Y+C7z9m34oay3g/QZVtdJ1FdKk/4R63j1KxuIbctLJJN5km5d7RlWT7v+x92ius0A6fon7G3jiPVNQtItV1az8SNZW9zL5bXOy0cOYkOdzL5eaK9SE3UhGb3aR8/Ti6VWrTjJ2UmlqWPgd8NZ9H8F/DjV9YTVfEWh6loFtrOqXTOkGnWNvbadH9ns3iUnzGbau5m+8vVa+e0SPXtSTVL64mtLlbr91HbzMsazyqJJF2/wAX3mX6V9GXnif/AIR39jrwTp0StFd+IfDelaaiA/62E2sbzs2Of9Wu0Mf+e9fN2jvJqWpXbSaZDp99cL8rLcbmgZm2fvOyPs+Y7f4Vrxs1qOrKNFb/AOeh9Bw9TVJV8VV2va+vTV/oO1D473118PdV8M3WkWMsGn6HrVnZSfZ2kmglvFmkecNuHWDcu3Hy/e+bbRUHjPXvh3o+j+M7XSXmt7RdH1DTbKaVH8mVnYtb/ISzQOdqJyvP3fl3NRXsUKaVNJyTPLqOEpufI4311v1Olg+J3gnxl4A8C2q+MH0e+8O+G7PTZlurnT1hZ1svMkFvE7B95eNI2dzjKx15/wCPNbsbZ7eTT/GGj32nssc0Uf261jkiuH371k8mTLKIznOF+9sb95xRRWVehSnFzcfe016l4WtVpWpKb5W3p0Hwv4P0fwHrd83i2zvdTuNHvIYrWC+so5FdrSaNBJ1ab5TjjB/4FRRRXRGKpxSih2525Sdz/9k=" },
		"11" : { month: "Mar", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDuPgVqvwgudG8JQ6l4O8Ia7ZR+FbFb63fwnG2pRXyQp51y7yRYlhY/K0m77+3+/urmPiL8V/BuleP7i10X4J+B7HQdPutrrdeGbOWWdRCkhDuvypnf8uz/AL6ryP8AZy8MeJPEMOoXHh/w/wD2rFpOkwNcaTbpNM18txLBE/zIysvyBn2r08uvr+bxJ8EPBviSDwj4k0iXxVrmm33lz6pLYpFDBLEoWOBFLLmBM+Wq/Moblv71eRJS9kuZqLbPruaj9Ynyp1Ek/wDh/kY83w18Fyfs2fEIar8O9Il8VWPhK91X/hJP+EKttLgWV7SSRIrdliB3RfL8360VR+If7T+q+MfhV8SrNtQ02/046Lf21yqWm1lae0mCRxOshO6Niqtuj+b523Y+6V0uLRWDVVRer+8+dfC154e+GN94K1SwupdV8La14Zs/7bsbKZ0lbfCEvrTIZW3iZPNX/gH8NXPDfwo1j4haVaa5cXtzaS6xPfR2jXSSz3K2/wByIQMx3XXz7osjL/dWqniHQbe8+Ffw8uLNHi1doNPsbTS7d4mj1DzoYzJJsQAxupC7mbdv8z5q9q1D9p3xd8L/AAr4K8E+GtAtNKbQ9Os4ZpmiS7bzSjiQo2SnlZXdvSliPZRpJ1VdKxxYenili5ww+7ujy9vh/rvgTwdqXjDxbps1tpetaBrVvYt8l2ttdvp08fkloi3l/PI2S+OY23fNRXrs/wC0LZ6l+zv490zQvDelaRo2q6Fq1xcW1jLcXDRtNFNH5nnP8rfPsJG0cP8Aw7fmKwhCNGNorR67noxnWrtyqb7HyL8L7/7R4w8Ff2f4q0rw/rLeVC+tXl3FBDZxJFtU3DSkBtnzjb/d+Vf4a+gvGPhvwV8TYdSt7Px74H0ptA1i50+xkv8AxDaW0V3ayRJ5tzCrNJIvzouPm2svSiiqhrRUHs7lYtezxPtYaPT0ObkbQfBvgjW9Jm+I/hm4vbjw9qnm6GmoW9/Yz4sJEtmjmiY7LwPuARvlO5dnNFFFS/ctFdDppQ5rzk7t6n//2Q==" },
		"12" : { month: "Mar", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1H4cr8MIvAHwb02D4R+FNan1Gy0qHxBr2raJaLHArWkZlmLFfMkYv8vmMNu/+Ksb433mkfAnUrfRdW+EHwqv9QuI5bxL618NxurQvKUhHlbU+ZcfN8392vlzw3481TTdN8P3F1qsNlfW+nW1rDIs21pbVceWPLGfN/wCeb7l6RotfaXxwkvNQ8Q2UPiK6/tu71jQLHVD4Zlt0kubGZR5cxtikyMiNlmk2sv8AvV5cZuvGSpaNdWfW1aP1PEQdV8ylfS+q/I898ReIfhn4+8EeLm07wV8M/Da2ngnUppraLQkjv11dYZAFgnMSonlnYRgl/mor568Z+CY7D/hO9J1CW20/T9HsWkS4tUeRbyUIGggiixhG3urSMW+TZL3orGDlUX7xK603O72UKf8ACk7PXqv69T234Ffs96D48+FemX39nvrFjcaBcx3XiK3/AHLeHLtLeG4VUiJzN5n3WfPP3flrzX4LWbeJPGb+dZPrep2+ktNaLPDLdx20sfl7mkVSW8sQ+agV0ZR93a1bPhL9obx/4B+H1p4Z0/xa+seH7zQraFPtljE0NirWKM8O/lto3+XnP/LL+Gum/Yf1jT0+N1vY6gj2UWsaVdabFudfvyIkiruX5fmRWx7110KkNaUN10PFx9DE0qv1iaum9/6/Ay9d/Z6W3s/HK3OqSadc2HhC+12ztpNPlja4s1ikYBQ2I4v3mz5euz/aor7k+K3g6y8Afsl+OvDtjPd3Vpp3hHVIIZr6bzZin2SU4LYH4e1FQoU4bK1/M9Cji6tVe/LbbRbHwi0HgfWfgj4Vv/EXirS7i60vSbW3trGLxJaSX2+aKFG324lz5EIX/VkiXd/cFeceMrfTfhx8Qbq20/xro+tS6f5EljrWiX0TRfKu+NkZWO10divL5oop2XN7S2pFeDrc1OUny3PtGb9rfwd8V/2RfG6a14q0LTfGUnhvU9OuNOk1CGKa8uPsjqjwRlsv5mR0/i+WiiinI1w2HhCLSP/Z" },
		"13" : { month: "Apr", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDZ/Z2/Z3g8a6b4KbVPAEyeHNd0KdZNY1HSLH9xOtlF5d2GWENtaST93vf95t3NXqHxf+A/wp+HvhbQrR/+EJXxxomi3MMdjdaNaQR6zcPb+Wk1wqJlNrfOuT9786wf2b/GPinx7p+hLpO97vw94GsbTQ7EuFWJ9lvDcXIVjseXbvK7/wDZX+9XReBIdO8H+NU8Tavo83ijTLyVVt7i6fffxXZZ18ySN/llcsu3ezfJ/Dur4/HZ5h8DVpU56Ko2uZ/Dp59+x9NWwmJ9rUUparW19ddTxf4sfCLQfDGieJf7B8IefZ2vhRtYebTtAtZldbi2kXzhcXERdY4Zl3Zi2vt/77or0z4wat8RfEHw/wDHHxA1DSpH0q68M6nYRWdw+FitJ4dmbaPILsmPNeYj5k3/AOzRXtUKv1qHPCLS81a/nqbYSVSMGpTf3ni3wh1O88Lf8I+2rWusWVjb6FZsy2D+Ut9FPbwyKG3SJuiKbfbcjV69J42W2sNBP9gX+m6DqltPIsg2SX8VqDuiRUGUj+Y/LIW/dr822vbPAHwV8N/F39m34Vx6vFNDdw+FdMjj1GzdY540NpHlMkEOp/usK5e+/Y6Fz4j8O6b4g8f6vq+keRcrFa/Z1VtiKmF+ZnX7v+xXwmZ8N1MXjKdaFpRTvaTdl8vXc9OrmlCtH3pONRaN239PkfPXxc+I8Xxf0fXrG0tLyHw94L8PahJFGjssis9q8Fu0caOy/Z/m2tks/wAjs7f3Su4+I1/oulfAfxRDp8VtaQWdjrS2uqQMunztFJEbdbS/W4DStP8AO37sD59ibdn8JX6AqdVRim1dLX/gHn4dwkn7OOlz3T4C/Hz4Z6L8Avh9p938RvCOn6ra+GbC3ltbzW7VJIZltI1ZZEMmVIYcrVX4dftC/D9PE11c6t8SvCc0/wBjWG4ur/WbdZIpRsLLHKZvLZGfzG2woF2rHu5ooqot8pwTw8HKTZzXxw+K3w98ReFPjFez+OPh/qb3XhCbT9BW01i0n1Bpfs1xvXhsli7rsC0UUVNV6nq4KhHke+5//9k=" },
		"14" : { month: "Apr", type: "R",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDE8HWGjw/C7wrr2veAvB62LWdtb29nLpPktrSxwo93vu2AkW7KRrJGylU+d1+ffSfGHT/BviLxBrup+GfhbDZaVeWsUi2bxWNp9meNSjRxiE/KjKWkZ/vbtn8Negi20jUv2V/DtjoWpXmqwQ+GYNQu9LS78hl1BYXjkluZJQPLto/O+7/y0/colclfo02lXar/AMtIJFX8Vr5bM8bVwLhyJe9vofpOS5ZTzV4h1pyTg9LP1Jfit4D+Gb+Cdb1jS9P03UNevvC0WoRaT4c0y3+zaDEtrJ+9a5TAnkaVfmP3gu59vyUV2vxXm8P3n7N9vpf/AAjSaJrnh/w299NcN5Ol21802niFbvIH70O11P5cY+Zpfl/vUV7c4c9nE8TA1aqhJcz37lv4eaSvi/8AZy8JR2sszrD4bkjluvHMqy6LY7PspabfGfnjQ/6uCRvkb+EV5p4evPtmiaZdb0l8y1ikZk+ZW+UdK9s+BXw11Y/DrwRpmlw+E9X1PVPCUWr2c2rW7xwQ7ltF/wBJtIhsuJI/urK3zN/F92uE+Ing24+H3xC13w/cbN0M/wBqiaJNsbRTfvQUXnam8yIB22V89n9Pmw8Kkfsv8z6ThTEKONrUJfa2+X/DmnP4euNX/Zh8QWKeJba6vtL8IajeGO8t4rvUba3Sa4SSCFpOEhPl/f8AvovC0U/wXf6ZB8F/jlphsrZNdk8KahdW98qbZ5bY2zC4i3H+EOqPt/6aUV62GxEq1CE4Pp+J5NbDvB4mtRkvtP7nseh/BL4w/CfTfhj8OrrUPF3hW01618Lafod3JdazbrdxQiGBpINnmLtXdv8AmPzq1Xfi14n+DnxelsLy5+KnhjR9XsVFut5a63YvJPbsN5V0d9mFPTDHncKKK3qRjVShNXTOCNH2Nb2tKTUk3qjyLx1oPwhsPhZ4wvtN+M9rea7HoWoraWMGo6bund7aRPJwmS/mK+3Cf+hUUUVlClCkuWCsj2Yqde86s3J+Z//Z" },
		"15" : { month: "Apr", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDJ8AfBfw74t8JeB7HTPDT6rrmraZFdS2eo29pbXOpxC3H2z7FII9qPHujaMzfM/wA716B4b+CEHinxZb+F9Y8H+FX1yb5bvSbPRrK0W008t5N55dxFF81zb74CrF2+bzK6f4ReGPh5qX7Ovh3SYdflhgsfC8upaxeS37Wktjeypp8xhM5AaKGT5U+X7y/3q7H4a+CvFHwfu4pLbR7yXWtQtrHZJBcRTaGt1PEYZXXDtMkXmPbM7bfm8j73zLXNGOmx6latV9rL3nufMvxA+FHgH4b+Etbt/wDhEtVvZdPs9Y0+w1K6t7WG7luEimT7XcQSKf8ARyx/dMDvH2d3X/ZK97+PWh2T/s5+ONS8OX+m+NPGGuefD4j8SOhjidrC0kNx5cf3UZYkdFVfl/Gis5x5ZWPVwdScqd5Sd79zkfhPDcw/Dbwfcanbwy3a+FP9Ck1nS/7YkVBFYtEIILc4usZ3JFN88G7+7Xvvxh03T9VuPCN5qk3h611e+0We1i1DVNUn0PVmlKBilvGmR94/NG33TXh3wVF9H8K7C+8KRW9hr03heCzubzw5qEUUUmyzsmWS8mlz9imjT774+cfd+avtDTLTS7fwro+pahLZ3T6bp6SJrF063LKvlDfKJmALbsctxurq5uWJ49Ve/P1Pnj4k6xdeJ/2bPiVdW+teEjpFr4ZlutK0vw7CyT2KSWkiTLMGY/eWRgPlWipvi14YhsP2SfGt1M8Ot+JbXQLnT9U1pNL/ALOvZ4lidoldXAfYN0J2/wAS0VyVbcx62X/w36nL/Dvx78IpvA/wXs9X1fwVdI/hm2sfELXevWkDQNHYweWlzA0oMxEke3a6nbXvrfHv4MNpT6a3xH8C/wBntB9n+yrr1msflbdu3Ak+7tooqpN8qOepQgpv1PIfjN48+Er/AAP8f6fYfFPQNYlfQdRFnpkWvWMjzXLWrqmdmHmkz93du/OiiisZtpnrYKhHke+5/9k=" },
		"16" : { month: "Apr", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCH4V/Cix1ZvB+mn4e6VrGsNo+n6lpia2lrZWmqxTWVu03mOtsXl2ySSbX3/wCz9+ut0X4Py6T4ylsbf4f+GPEGr6PebdYsU0Gx+zansdDJBYrcxq22GCaFWlDKzN8z7utdF4N0O38ffBzwbcTQ2fiy1/4Rez0u3v8AQ7tbC/0j7Ppwle3mnkby0xP5biU/dq94kXw14z17whqF/dX3i2z8TQf2P4hhtb5ru50+4t4IYYoLPYEff50nnvIF5+/92sY09Nj1K1aq6krye54l8ZR4L8ZeFfFd54V+G3hnQ9KkXUJLJtOSJbu58hC7TxzcovleTueCLjY796K7P4weGNc8JaD4o0XxJqthNqeg6FLC1q+ls2m/ZX0y9W3Fm5Xf58blsyYXc0z7vuUVzyjr7p7OArT9m/ee51/gXQtM0j4K+Cre+1/wlqt1feFLbUn/AOEjdraCBfKsvKhu0g/4+1T+BZBu/CprjU9ck8D2Gqa1fXi6q2mT2/27UdPi8PSSxNcWnlqLyIsGtm/g8keay/JXsf7MPwxTRfh/8JNc0c2en6LJ4Oi/tHTUt90l3dXMVrKZy+euYq8uv5pPCdtDqEOsaXrVja3+oLpmpXF9NrFhaStd26hEtGzO10mdoi5Qf6xdtd0JbdTw6rvOXzH/ABqNvYfCLxhD4UsvE2k2l74Z1e+vdFmtJV8iVlQTSb7td0UJxIz7T8/8G1mor2b9pHwldf8ACuviZ4mbWpjbf8IBqmmnStn7ln8mSTz85+9/DiiuSUtb2uepgpWptGN+z/8AH/4Y6L8CPhzp1/8AEfwnY31r4c063uLW6162ilglS2jDKytJlWB4INJ/wt34T2fxisNasfGXw5t9KXSbtbjUotesY7j7bJNDj5Q/OURsvRRRFsxqYeHtJLzD4/ftAfDDWvgP8RrDTviP4TvdQuvDWpW9va2uvW0kkkrW0iqqqsmWYtwAKKKK5ZyaZ7GCw0HBvXc//9k=" },
		"17" : { month: "May", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC18BP2H9S+JfhvQtS1bT9E0LSrjSrO+ivJYYruedZYUKkxpICueuXI/wB2vodv2Q/gV4Sn0LwzqnhK21XW9Qtrmb+0J38j5IEBknkCFVjTe8aDA/jrwz4mfFy++H3wt+EH/CFXFzZeM18BWFnqFxFLsjktLizXy/8AtpC6+cr8bP8Agdcd4w/aT1zxz428UfbIrzxBoN1axaDaSeT9kX7EGjuJQxADb5tm5k+9j5axoZY+WNo35j6PE5hjKs7c1tdLaI4X4rfCK4+GOlXun+IvC9tomoNpVzJDJ/Za+XLKi/M0Vwu4H73tRXvnxA/aQk+N/wALvFcEfh3R9XuYdA1NbTS7BEmh0qGK3cT6jNPIm6J/4YoE/wCBN86UV5M8vdGTjzM+ow2ce3h++h7y00Nfwb4X8H+Ofhjovhfxp4SsNP8AHmqfDqzbw14hV3kTULdLEFI1yf3c8R+8v8X3hXyTf63azWd3G2/WP7Wis9jXsK/uHGUk3f32+Xdvx9zdX1Cvh3WPFnwP+E0ejaxbWWvaZplnfaJDqMqsty4to90Vvcn/AFZ3Ku6Fvw4rxbwl8GfFXjy51XTbhX0TxT4dgjt7bT7y0/dxZV/+PiTp5Y3SfN/dk+WvOo8W4L2VSTrOCg7ST33t91+qPjauFre2lCPW9n0PfvDEHhD4S/sxeOvDpxdfEPxV4Q1LUr220638xrG0NnI0HnGP5YU2tv5/ik/3aK0EXSvhN+zn8WbPVpf7Q1XxDouog+KlQ+XqE7WkwSBR97apzhwNn+7RXp4THYfM6Sr4WXNHuu/zOvBr2UXGpozxX4VW/wAO9V8B6DL4p8Q+HLWL+zLW1S3/ALWhW/8AOCgttTzAsHTmST+7/u16V45+LvgebTrTw7Y+N9KtBcXlss/9l6tDJFZxFxvklmkJ+0ybOp+6tFFfmOLymhmuYzxGIk9LtJNct0u1vI9SVJYeEYwb36+b1PNPiX478P6j4b8XRy+OrPxFfLY31na3V1q0Ms0qeU6oqBSPve3/AI9RRRX7BguWjg6FOnFJKK2Vvnp1PFw2ApSnWlJttyfU/9k=" },
		"18" : { month: "May", type: "R",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDQ04aN4b8I+CLK1+HXw7u9/hfSb2W81bwzHc3M8s1ojuzvvXdlj3Feufs/eDPBfxNtPEcWufCzwI8+jS2q27aX4bhi3JKrjLK4k3srJ3OPWvCtO8CXngrRPBtw+qzX+la74Q0nUbKO4m8xrNjD+/iHogdty/79et/AL4r2vwo1LxhfXtrNdW02mW0kNva7fOnuFuhDHCueNzNdLXyFHEV/7TeHk7xey+Vz9UxODoyyX65TVp9X87HT/Hb4T/C3wx8E/GurReEfBmmyyaLfw6fJBolt9p+1/Zp5I/JdI871+82AuwJu3bVorj/EHxQs/jrD+0Tr00UzSeG/CV9p+iWs6744LSS3nWedNuf3skka5bslFfRSjqfJ4KpN02+Z7jfGXh+T/hnX4Fa8trsW30Kz015k/iWaxhmUnj+9Bt/4FXhfxO8y28MPqEctzE1m3mN9id1bn7rfKRu2v5b/APAKzvCWiXnir4HJ420/xBcy+I9Baxtb3w/vZV/s+NIYba42/wDLRN6eWW/hrsXhtfE+iOuzzbHUIP4k/gZa+Xx7lgcdSxcVe1vw/wCAfc5HOOPwOIwMt03a/n/wTltV+Bvja2+G/i3xBp+mPaW2l6Sv27T7rVHjuLaymtXkBZZDtbH39qnd++2baK7P4n/EK6+KOm/EOPVtQ/srSI9C/tDVod+3z9Qhtjb2duoH8BmMUu3/AOIor66WLr1rTdtdVZLZ6o+OwnPTUqclZp22NLx34k8G337Ovw113RfGXhmHxfovhux0W/0tdRt0nubWW2EcsMsSy722SHlSP77V8y22vWNzqUS/2nZ2kXmpJt+3Msf7xHYq22THyy/exRRWCfP7slcylhowquUJNNvozuLTVfDXiHxB8RZLnU9EsdGj0PU7q0tYr5Io7m5WznitxGHfc7bpY9qD/booorOc3F2R14egoxbu3d9z/9k=" },
		"19" : { month: "May", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6y/Z//Z++GOsfAj4c6hqPw58J319d+HNOuLi6utEtZZZpWtY2d3do8sxPVq74fs1/CX/ol3gv/wAENp/8brl/2UPih4V1/wDZ6+HMcOtWkU1rpVho0tvczJFJ9qjt41MW1j82fvLt6isbwx+0fceGLD7P4wS51fU7pNR1KCOwt189YlvRDZ2axoPneRWyrZ4H3v71csacpHqzqT55e89zM/ah+FHwk8BfAvxjcwfDvwnaaxc6RfwaY9loVotz9oFtK++MrHlfLVGlLfw7KK47xh41s/jlZfHzxEzpFB4P8E6joenaTLNE01tPLaSPezMFJ+beiwZ/6ZtRUShyux6mBqzUJK/U8C+IvwP/AOEX8H/B3xxaw2yeFfEXhfSodTaVGb7Jei2jcybV+8rr+82ZGXj965S28H6hf6xcQzXGsahLpemS3VxqHnSz20EULJLLOjk7NjqyfJ/upXvGnal4j8Jfs7eC9D8b3SeJPhd4m8PactnrkUK/afDV2beN4VfaP3kcbf8AAtvv8rcj8O/FN9pfwW+MWl3S7PK0yCxGx/MjdhconX/ttIPTatenRxtekowik4q61W3mjx51OWc156GXofhLWvh14A8RNYXFhcan4u+HGp317psVo8MWjWOySSSU/Mfmm2RrGvZnZm/2iqWl/FW81DwH8Tf7H09NQ8Qa74Zk07fdS/Lpui2unv5x6/edUTYtFcWIlKtPnnqz1cvlzU25Pqejahp/wm1X9l/w3c+HfiF4W8L+Oo/CtiuoafHrltCupSpbR+ZDc2xkC+cGHyuV376+WvD3jy3/ALN8QafcaxbIt1BbSKz3yrG2yUF48Fv9l9v/AGzoorOE5WM5YOnKpK7e4zwQuj61pni2zvPEtjpdja+Gb6XyWvooPt00dt/o0KgsPNYzJHhBRRRWVScrnpYbDQpxsmz/2Q==" },
		"20" : { month: "May", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6f/Zl+Efwi8c/AjwRfP8AD7wnqGpx6PYw6jNeaHbNP9p+zQs5kZoySXDrJk/eD7q9R/4Zs+Euf+SXeC//AAQ2n/xuvEPhBra/CUfBDVpn+z+HfHXgvTtJ1Bv4YtQtrON7aXp954y8X/AVr07RP2mNH8SfDW78QWdo9vri6Fda9b6LLuZpYY5ZIUO/AXl4/mX+HdXJ7OUlzRWmh6s6k+eWr3MT9oD9n/4Y6L8CviNf6f8ADvwjZX9r4c1K4t7q10G2ilhlS2kZWVhHlWDcgiiovjz8SF0D9kPX5vGt3Zp4j1nw5dae1vYDhr2W0f8AdqmT93dluflorOpHllY9PB1ZKD95nyz8VNJ8WfEf4MfC37Bp9/e/Dzw54E0vULjVtMmVVivVTyplVi4XzUCqD3X5q5H/AITzxpef8Ipov2uw0y+sdKudPtYVt/LlaK7dDtkkVtv3G3+aE+X71eo/BXU9O8H+D9C8L21/DqHgP4meDVtXjim3rY66likdwn+w7vt3L/ekX0rzO/1vSX+C1v4guHtv7QjsIPDcNw0PmTRQJLPcS7z/AHdkkajH/PT/AGa9injpUoKHs1K23z6vv6HkValqkotG38Gvh3d6j4C+NPjK70C8h0HT/A+rR6Rq1+jbZ7iWGZZGRv8AloyrG6mT737zmiuZ+I37RPjOTwBqXhfwzfzaR4Js9Fl0l9LgtEkXyWTy3muGZS2+Yv8A3vlaX/vorz8TN4iq6ktD1sDKLg3LuVfijqHhbwz4J+FGpeFPFuiyy3+g6Y2s6baanEZrHUre0jj850Vsxv8AN82f+ebV5ZbeM9PudKt9PmuLaL7O0d0/+kI0crPDCzLj2a32/wDAqKKyU3Yyq4KnKcpNu9z6L+DLfDPSf2Ovio2v+LPDMnjDXtKvFi0+51a1+1s8UJlhCpv3lmufmUd9kdFFFYynK56GEw0IxaTe5//Z" },
		"21" : { month: "Jun", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCr4Z8Tfs7y/Bzw19p+Gceo+Ol0yztZQzNDFczLDGJrh5IyyxjIduVzW34e/Y+sfHmhRXPhKHQdVu7WBl1DR7xIoL2Cbb8kfmrvikU/89Fwuf8AvmvRPgt+zLrvxG+Fnw71C+8R3nhq2hs9P1K2voobeSecfZoxHGpDMdij7u/bj+7/AHei+JfgjxF8P5tX0nwpaXNxHqdsyanfaRatHd3MT72lSJmYlJBhW+Vvn3/w18bOOKk+fEU1yK+kbuW+m36n2qzGWGm44ab315tV+P6Hzj49/Yy8Z6N8N/FHia88H6Pp8Gm6fPeTNut45VSO3LM8QiJX+HJ6f7NFVkm8QeE/hv4gvJNV8Q2+n6hpOsWcWiulwttEn2WaFo3U/IqKfm9d6c/3qK0w1SjODspKz2Z6kcbiZN6xfy/4c5Pxfp/jHwdonh26EWt6foGsaBodzHNZPNHBc7LG0KSKUOxnSROn3t1fXcH7eTaT4M8O2c2lef4sjtoI9bmv3aOCC45Gz5B9+TCuO37z+KvkDRNC+Inhzw34S1rVtP1u38L6hFYx28k8zRWlzm3jW1UAttkQbVf7tGq6VqF/vs5onlW1la3la1T+FthNwWIZo33fjt+7XXjsZOlJUoaX6nJleVUMZ7TEVdbSem33na/Gb9o34jfEK88YSWdlYaZpF5pl9Z3FnZWKSK0X2c+Yz3BCy+Z5avy+0bf4aK80vJpLPwfqGpXGoWzrJo93b+XEjNG26IxpI3dWfc+P9r/gVFGGxM60OaSu/Q6K+X0sHPkpuyeurOq+M3xH0HxN4X+F2n6brcMs+ieC9Os7hpdWhe2W4NtDujSDJ2PGfvk/Nu/3Kd8PvAdp4m8ZeHLfxN8RfC2kaD5ay3eqXnizT5JorfcN0OwyP+8fsp3bO+2iivSlGM176TseH7J0ZSlSnJX7M4H4nPbp/bE3/CQabdruurG3a11a1ufNSPzhxHFIdiNuXY235u1FFFZ3UPdirI9GhT5k5Tk2292z/9k=" },
		"22" : { month: "Jun", type: "R(B)",  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDiJb3Q9NsPB+jahpXhPStGvtA0eO6vIPC1pe3+ya3tTLceaYi5nZmuFX5vv9q9J0Lxf4Tt9Ht7e1+CHgG0tbdpI4odZ0nz79FjfYBPIT88nHz/AO1urm/DFr4C8IX3wN1jUPCeteEtXt59CvtR1i6uGl0nULQwpJ5/PAbzPLf/AGTuWpUv11WaW+j+7eTvdK395ZHL/wDs1e3w/l9HEzn7dcytdf0j6WdV16z+zbs9/M901z4c/D/xP+yj4t8WL8MvCela03h7V7hJNO0m3j8iWETojRMy71YbPM4b+lFfMv8Aw0b8QtS+FHiD4f6fcWCeHvsOqw7Xt0WRods80vzlt27YJOaK+ZxsIxryUdFd2+83wdabjLlk9+5z9n8aPiPbeENE8Lt4l1JNPk0W00uDQ5YUW0a3kiHlh4vL2tuR87mDbht+au+fy9KsHaP5IrWD5V/2UX/61eg+NNb0e/8Ag58GtDXTbO71yz8M6VfXWoNaJ59tF9jjEEHmctyxeT/vmvK/Fu6bSv7PXf5uoSra/unVZNp5dlz6IGr9Cye2By+rjKmis38kjHDUnKrJLVykcPFf2eheDNYkmt0+3TaFcxrcNELmFmmidH7uqSD+F12stFM8W2a6bpWsLcRTWkV5plyrMkLr58yIGQyGQ7vy/WivxyhWqzTm03d33Z9viKGFhJQTjFpWdrF/4lReD7DRPh9deG/FFtFeal4U05tWjtdeD+RexwRxSBkD/un2Inymuu+AXhLwH4g169k+IXjLRLLRY9Hlht/7R8Q2lxJLcXMRhBVWnOx4xvkYnbtby6KK+j+tVuTk5nbsfEVcLBVJavfucr48+Gmj+G7nW2h+IfhLxRoa6TeNDeWGs2TTSyrazmIG1Mu9HaTy1xHuHeiiiuSrLldkerhcPBRe71P/2Q==" },
		"23" : { month: "Jun", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDhdd1/UfA2ieBdNb4deBJrafQtF1CO8XwtaTz3MUlvCSbh3R2fc/mb9u1q2LD4p6Z/wlNvcf8ACsPh/qVtNdbU0lfDmnQJJEvy7fuPLEzPxuc/3a/Qf9ny3sdW/Zy+G2m3kNtexTeENM86znRX3RNaxj5kP8FeGaD+zxpPxI+PHxF8Vwumk2vhnxRaraK6CayuVSGN76GSM4G3d0/uV5dSlUqWlGVrdLH0dPGwoupGrDmvfXsaXjP4K6Kn7OPxM1PxT8Gfh/4S8RWPh7UZrSbQrG2m2stpIyurCIGN1YetFeyfH3VbPW/2aPiZe6fdw6hZzeFdUaK4t5VkjlX7JKMqy8GitJGmCnPkdpM/KL4dfELxN4Sv/CWsaTqd5/a9nFBDY30U0s7QRBgPIZeT5XLKyfdbpXoniT4ieJvE/hD/AIRJdQhi8O/2jealqt5Z2+2S+vbiXcWmTzirryyqv/jrVd8YeH9I8P6Z8O9N8PRJb6hrXgvR9UvhBtVo3+zbXID/ACvI+7fx9a4aawmub9JF8mWRZ5JLjT50eDzWRQEiVF3MyHC9UHFeHjMbVhV5IuyR9Nl+U4StQderHncn93l/me+aT+0X4b+Hn7Geq/D+6uNS13X9U0XU4YYbW2WODT4LgTpEC77N6KDv+Xc3zUV5Efgpq3j74YeMr7S30e3bwbZ3N5fWNxcCO5W3Fvv+SOMMu393n7336K9WhUdWmpz0ueW6EMLWqUqTuk/u8vkdH8VND8KeKvBPwX1fRPiD4cn1yfw9pOh6lo9xrlpAumvDaBvOlJlDR4O+N/8AgP8AFXbeP/hF8M9N+Dun2Phv4y+CvEvjXT7x7y51C/8AE0FvJd25icfZoSJjs+bZjJ+b+I0UV0uMZJOUU2eXKm6cpRhNpPzPOvgDrnhWw+G/xsv9V8VaPZai/hDUdJ061utWSOe+mmimZgkTSfvc4iAx3oooqJyaskdlCjGHNZvc/9k=" },
		"24" : { month: "Jun", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2q2+Gfwb0r9lj4c3/AIi0jQvCep6toOmSDxTH4Tt79kujbRuWmLQSL856+Z96vDtV+KfhLwTq/wDYX/CC/CTxnBZ3Pkr4itfC1u39pIVEijyowPLlAby9g3bmr7q+AUunx/s2fDGHUprNLa58K6dG8d46eXKotIyww33vl614H8edKsfhj+0Z4K8SeAfh0ni3UP7Hn1CbR9Dt0WLKny7W6YRqdq5f7wHXZXDKEqitF2PaWI9nWk6nvLXRvqaHjvwz8K/FPwZ+K0mn/BC38H6jpXhzU7qyvtU8IwWXm7beQpNDKE+Vg38PysKK9Z+KOua94h/ZI8f3vibR4fD+vzeENTku9JgufP8AsjNaS7VZsD5ttFEl5HXhKk+R2k/vPhDV/jgvxn/Z+8JeA7rw1Fb/APCI2dhLba0t9+7QRW4gfzkaP7zJvI27vpVX4PfFLxB8JNL8Uxw3MUOpa7pqaZpuqJNLcy6fCm8/uVTPlfNJv2Y4rE1zwtpXhnRvD9qiXe3VPDOm6g9rPNuVjJYQO06oePL3mVQ38LVlvZyJ5t8s1zd6ffbPmXa0l47OmPNjViybVHWPn/dr57FZhVhUcIuy9D63C5NhKtFVpx5pPz/yOXmv/EWsWfiNo73VXnvLGe4vYYr6bzJ4kt5m8yU5zKvl/wB8fdor6i+C/iHTrb4LfHvQb/ZZeJV8HXn2a3nRfOktEtLg/K4zu2+ZFkZor16df2sIzkrNo8CNBYSrUoQ1SZ88674stfE2r+Ev+Ef8Sxwz2/h7RdNeTUdThgWCWOxjjlSN5GURIHO07v8AbavXdE+D/h6+8GXs158Z/hxpXjWbWlk+0N4pgkj+wJDImBKjb/ndkbb/ALFFFdHLCesop/I56kJ0pOMJySu9LnKeGvCOk+FbDx7ceIfHXh6Z4fC+tf2bcaX4v0+5e8u3tnhjiZRKZZN6O4C7RRRRUy00R0YWiuVttttn/9k=" },
		"25" : { month: "Jul", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxfwl4Y0u80TR2j0rR3ZbO2klmureJtzlEZtxYD+9/tV7j4S+GngTwt4E8H6xqnw/0TxVd+K7rUFPmxXEbWSwv5MbIsfyum8b2ztY79q11P7M37N2saz4CsvE3iXwm+vaYvh6CbR9Nl1T7NJdyyLG0ZV0YeWuzd97+/VVPGusa3puj+GtWvXtPD+i6nP8AZ9DidbTz22sotIzGY5J2hY7laP5W/i+fbXyuFw84zc5vfoz9KzXMqc/3VDSz1afl0sZHxp+Gnhn4h/Cn7b4e8F+GfCHizQvDP9tapcWFjDbW19CbeR3hgTBPnR7N5/iH3d1Fcn4x1rxEfBniC3lsb/UPENnpWq/2rqH2dvKtvOt/LuGMjykNuiTZ9XTZuK/MV6cqCk7tHm4LFSjBx5tn5s978C+J/Ffgfw78Ob6HxQmk6NN4C0drazndZYJW+zwpt8hsfP5n8asv+uWtWf4qzeMLPy/iR4DsPGGlSTtZrcWFv5d7EoO9mRQxOz5N2FdXX+Ja5bWPF3hPVPgR8CBLb2mtf2ZpFra310s2Gs8WVr5sPyjd5nzRsvum3+KvR5tV0nWFdZrj7JdxxPG8Nx+4u7bcvzAo/wAyt+FfjnFGeZjkmYc+G5p0202rXS8vnv8AkLCYWliVJTtGS87M8D+PvgG3uvAnibxR4Q1efx54Jl0ycmFdR+yR+H1VT5SG2yN6p91V2f8Aj3zUVs/tG6b/AGP8L9b8VaKnlNeaZJau2xlaW1ltzEsJX0EbtJk90or7jJOJI5vhFX9nytOzXmi4YKeGvGLur3PL/hFr3hHwrYeDdW1DXtB1WC3s7GaXw/qms28kfm7US43oWUI6Iqsu4f7PzFK9a179t3wb45ufEF9q2n6PqHh+PR/sdj4X177LKv20P/rFkUFvLKH5v935aKK+qhCO9t9zDEYaDk5XdziNR+Jmg2/hHxHo5vfDi+H7jwrq02kx/wDCSWVzNYz3GnSBbZUWUvuD/u0DDd+9ooorkw+DoYRShRikm2/m9WdFGkpxvJs//9k=" },
		"26" : { month: "Jul", type: "R",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDT+Elx8PrXRPDJ1bwL4bvrKXRdGbUG1vw3bwy6fGtsBd3yy+UTOsjtFtzu3NKvFJquraO+sa0mk+Avhr/ZCahcw2Xn+DbeU+Sszoh37weVXdWxothNovw98G3t5aP9mu/CmmXWm2+o+IbaWG+eOyhV/Ks5QCuxtsgXecyQx/L92uH8PJN/Y+n/AGh3luZIlklkl3MzO3zMTnn7xr43NcVVw0IqlKzbP1TIsHTx2Jquurxil16/L0HeLVttR+H/AIqvI/h74QtJ30fUbW3ZfC1taRb4lkkkvLWZV3b44FI2+Z8r7cLRXQ32lW+m/s1eIbyzt9NfT9a0q6uv7W0vUHnW8v8A7PcPLa3cSl9ksaPvU4Xbs+ZsbqK9qmm6cee97HlQqwU6ipq8U3Y9S8X6V9s/Yi+HskeoQ6fqI0fRbeJlhW5llSW3RXiTzB+4yhZiydoq8I165aw0TUJreJ3lWBlhji+8zn5UA/4Ea7XV/Ga698K/hL4as9ktnofhvTri5kX5t13LaR4Vv9qONv8AyNTvhf8ADv8A4Wt4/h8P/wBuTeGzZ2b6tLqFrMI54NjBYmTP/TRlY/7KV8zj5PF46FCO0d/1PqMrisqyqvjJ6OV7fkvxPM/Fvg/VvCXwu1ixtbLxDo9y2mTzXtno135ml+QtqV86RstgSJtXy2f/AJZyf7K0Vu/Gnw3qWieDPGHhXXP7e0y5tVn1BrzxBqkO7XFgiuViljgbk/f+8jy/L9470Wivr56WPz/L3em35kEU3g/UtB+Gvl+IPBX7nw5azSrFfWVlPBNFZQ+ZDdGSXbJLJKHX96lX9J8S/DvwzefYbiXw3Ct1utbhrPX7S7Vlu4djWomE4YRR7vMM8h+RtyonqUVg4qEm0up6Lp89SVNt2V+pwPxU1+z8W+EvFDR+OtB8Rafp8SQ6at1qKrPxblZIraOZll2cRMPk2N/svRRRWk5O5phMLBQdm9z/2Q==" },
		"27" : { month: "Jul", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6y+AH7P3ww1j4FfDnUNR+HXhO+vrvw5p1xcXV1olrLLNK1rGzu7GMlmJ6msD4++Dfhr4BtLTSdB+E3gr+3tWikazvrjw9ZtaQOhUlZflB+dN+3/dr1r9nBwn7OfwwZm2KvhXTGZm+6v8AocdfOnxJ1uH4j/EHXfENrZTNYqn9j211FpzyNOlq4kuILmHdh2WUxPFJuRf3u3+9t87se05yc5OTbO1+JPwv+DviX9mPxz4t8LeA/CO3/hGtUuLLUrXw/b20iyxW8w3xnygykOvymil1vxnYp+yv468G393qS+KbHwJqN5dWOsWa2txHE8M6p8sf7r/ZCqfu7aKGubU78LKpaVpO1zwPQviHrnxP+C3g6xtbzVvDWj+HPDkWgaxpNrmeTVYWsgUuIocANxFzu+4HXbu31s/CzTbG80zT/EniY+G/Evw30GBbe7u7xLiO9SeKDKww25Yb3+7/AHgyf7u1fMvAXhu18f6D4H0mS98N+IGtdFtvJtX1S6gvby4+zySQWHzAL987PkG3737zc1elG7vr+7i+I2rW82q6vDa6ddJodgi+Xpk0E2xz9mMu9/3abmTHyfaZN7V0Rj7tjx6j5azd7WbOd+KPh7VPFPhTxh4g1Ky+1z3Wk6hrDWd1qO2O2R7eaSOaKZ/mmj2N5kcA+ZW+98tFa/xp03w/pHw113xJZ6hc3+ua34bvPsWg+JdMRZtKQqkV029SAkuw/u4+y/dX7oorhlvY+mwSnKleLSXnc8y+HPxA8I2Pgnw1D4q1vw94f1PQVtbzTL7RIYZ5599oB5FysEqNwyRu7SNvV02fxV2WufEDw4s2j3F74i8Can42vLGa8sfGWhamLD+yESItFHLFHsHn/eXDR7xvVfmNFFdcZy5TzamDpyqOTb3Od8e+OPCfjLwH4q+weLdCu9aGn3N3fSXWrfYp764a0jSeSPfHtmZ3h4gR/m3/APfBRRXPJXdz3cDTjGDiu5//2Q==" },
		"28" : { month: "Jul", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDpdYtfBPhv4WfCO2tfh34Tvrmfw9o+qajqEek2k97c3BtxI1tNuiYr5yjd5rf7VekfE3XvhH8OH0+ab4IeAbuy1LQ01bT5orWwbzZTy8LbYT8gX7si53Vxo0f7Z8OfA3nWGhH7R4C0eNLyK+K3Ow2O3GoQBtzQb+VeNc/Js/i217D4p8GWPj/9lvwx4gklmtNV8P6Yl9a3k9v9ik2om11dIFdthTkIn3vkrzNdT6BzfN7zvr3fU5/xT4Y+DXxA/Zw+KOv+HPhj4c0HUNK0bVli83QbKC7jlitXKzR7ASuG6NRXjnjvxRp/gvwj4n1C1vbP7Hr3hC90x5t893Iqy20/l2kQaNGT/STIztIo8tPJX/eKfyudmGbUXaR3WpQxeIP2dvhHr/hnT/BWqz6L4csbbV9Y1S78u50/yrSBygKuv3f4lO/02fNXP/Cj43zeA/8AhJWuL258QeB9SW81DxLqFgkq3MF3OzwwrbtIUZGOIvmZR/rP4fLrlvhFbXHgq58D6p9ntr67/sLT5v8AStMmjga1lso2uM7h5cz/AGZHjXDfMf8Aar0L4j+DdNttKT4n+ErK/wDEWgtEt1deEbi7gtrLw4rIkw86CMkbeFby9u3+Jt1bU5dJHlYunyTbi20eTeM4deufhdrunx6ZrFxBDpl9cWureNPKkaCy8mSUra5HyySIO27/AGGTdRXE+M9N0F/D2trpOoWeoa1NbajqmseIJ3l+yfPDJ5drFG6/61tuN8iht8ny/wB+ipqbnfl38J+p9FS+NPhyn7PPgHV7Xxj4TvPEem+E7Cx1PRdQ8WPA6xR2Q3xpbwzA/aA/y4x+tee+Gf2obfw/q+p+NLHWNH8hVlbU/C91fJGuuXE0rq0zIpYNsj8v6bPlX53ooqUy5YaMm0297HNfFfxz4H1V/Fui3XjNNV0iHTLy+0TTbCGyhtorqa0d0hEtvL83lvIiY2bX8tu9FFFZ1JvmPQwmEhGFk3v3P//Z" },
		"29" : { month: "Aug", type: "B",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDtP2RP2Q/C/wAXfAeieKvFGi2aaL9lgjhgitESXUJVRfNd5Nu7Zu+X5fmY7vmr3/xh/wAE/wD4Tavo7Dw/4as/DuqqpaG5WL7TEzbeBJHLu3L9Nre9Rf8ABP7xxp+r/ADw14ZDomr6LZp51u7/ADtFL+9jkH+z8+36rX0pqepWuj2M99fXEVpZ26tJNPK4VI0HJLE159ChR9itLp7n0WPx+MjjJ++1Z2SR+RvxF+HWj+HvD3i21uvC+lafq+l2t5byrFYxK0UyI4yrAdP4laiuv+O/iS38Xt8SvEFmjpaaol9cW+75W8rySiNj/aVN3/AqK+RoTcZVIwldKTsfry5qlGlOpG0nFN6dTzDwn8VJtF0Lw7/YtveWmoWNjbKmoedLbMrCIbthj+bt3wGroPEPx18eeO4YYdU8R/27axt5n9n3803ltjvgNtf8Qa8q0fXo4fD2mRtFbbY7WL777pFwg5xirUL29/c+dcXCbflZv3yrt/WvqqWCoxhZXs99WfkeMznFVa/P7qcXvyrp5vU7DxJ45mvPBviCG+0x4pJLG5j8y1m8xVYxH7wIDf8AoVFcl4hTT30HU47WV322c7fun8yP7h65P8qK4nl1Cm7U3ZH0eDz7GV6fNVs2tL2/yKvh7xPp82g6ZbyaxYW/l2sULQyzeW3ypjk5FSvqvh/f5cl3YWkrfdmsrtGj3e/daKK9inN8p89UwNKVSUm3uzM17WNNTR9QhXUNNuPMtZdirMjfMU7DPyt/n5qKKK5Kk3zHqYLBwjTaTe5//9k=" },
		"30" : { month: "Aug", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCf4Tfs02vxZ0fwxdaN8OrxVuNF05b7XvEEUNppzKtsnmtaRxwqzyGT/lq/m7vvNXTfEb4SaH+zn4j0XXtU+DWg+IrO6nbS7Wzle3+xStKyfOS+WaVVXhWh2/e27a7H4cftHeL/AAp4C+HvhnT9I0V1Twzo9vZWq3DX2o3LtZxnzJbeJg0MWOf4m/2a1tc8SWHif4uaJqXxWi0q40HT4nt1tb3TjD9mllljWGQRyvv8ot96TDfw7lQV8dinhI4yDlOansn73L8/s+S6n0s6le0tVbr3OL+Ivib4Sax8D/F95pXwZ8LWNzNot7Haazp1jYiNZTCwWWIsiTfI5/uA5or6I/aT+FvhVPgN8Q7210Cz0y9s/DeoyxXGnQpbSLstJSFPlgbl/wBluKK7KdLHwup1FLtpZ28/M7MJUpODvdP1Plb4Z/tc+Dvg/wDDbwlZ+CPh7bXfihtFsbfU9c1F1tFkuFt41lUHDSSLuT/ZX0o8Q/tx+NvGdmlnrXgXwlqeleasjWs8Nz8rK2VKP5mVbcPvba+a9Bdn8PaP5k0N3F9ji/crN5bL8g7Z5qWbTZpv3mn7LK2j3K6vK8bfiBnbXvxhFxPl68pe3lr1PsDxr+3FaeOvgr4/0LxH4XudE1PUPD2o2tvcWEy3MDSyW0ioHB2vHy3+1RXxpqUN9D4b1hW/exrZz/NL8v8AAemfmorCpFcx7mXXdJvzM3Ste0n/AIR7TIbeWz+0raxLK1xfJDtbZ83DNVj+2NL2O39sWCSrt+WXZNuX0z5tFFOM2OpgaUqkpO+7E17XtPm0TU411WzeWSzl/wBHtbhPL3FD/ePzH/cooornqTfMepg8HTjTaTe5/9k=" },
		"31" : { month: "Aug", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6y/Z//Z/+F+s/Aj4c6jqPw58J319d+HNOuLi6utDtZZZpWtY2d3cx5Zieprvv+GavhL/0S/wX/wCE/af/ABuk/Zv/AOTd/hd/2LGl/wDpJHXpAFecevOc+eXvdT56+P8A+z/8MdF+BXxHv9O+HfhGyvrXw5qdxb3VroNtFLBKlrIysrLGCrA8giiu+/aPH/GO3xP/AOxV1T/0kmopHfhZzUXaTPlDwh+3pp3gL4OeAvDvh7wvc63qGm6BYWt3eX9wttBE6W0aPsADPJ8w/wBmqF1/wUW8eRSrLH4a0GWDd/qhDcLx/vmX9QK+UNEmuE8PaO3mwvttotu63RtvyD0kzV17aS/m2s7zS/e2p978Q+NldlOMTxK7aqy16n1d4l/b6074jfBrx/4e8ReGJtF1PUNA1G1trrTrhbuB3ktpFQNna6c/71FfJ3iGwktvDGreZEjotnL80s25l+Q/7NFYVIx5j2cv5nSb8zK0fxDpKeHtPt/tcPmrZxK6y30SruCD+FjVt/FXh+HYs12lxKvzbftCeXu2/wCydgoorSnN8pVTA0pVJSbe7M/W/E+h3Oj6nHbvCk7Wssa7LtV3MU/8fooornqTfMepg8HTjTaTe5//2Q==" },
		"32" : { month: "Aug", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6y/Z//Z/+F+s/Aj4c6jqPw58J319d+HNOuLi6utDtZZZpWtY2d3cx5Zieprvv+GavhL/0S/wX/wCE/af/ABuj9m//AJN3+F3/AGLGl/8ApJHXo4FecevOc3OXvdT56+P/AOz/APDHRfgV8R7/AE74d+EbK+tfDmp3FvdWug20UsEqWsjKyssYKsDyCKK779o8f8Y7fE//ALFXVP8A0kmopHfhZzUXaTPlLwb+3Kvgv4N+AvD/AIZ8Kvqd5pug2FpcXmqXDQQb0to0by0jDM/zeu2uW/4eHfFL+0nVdP8ACTxfeW3+yTbvpu8/+lfPGg3LW3hjR/MuIdrWcS+Xs+Zv3Q461kzPcJ8qrDErN8qt+8X8hXZTjE8KvNqrL1PsLxZ+3Y3jf4PePfDnivwa+j32oaBqNnb32l3Hn2zSvbSKu9HCsnzf71FfJet215beEtTaO4SWNrOVnV9y/wAB+7kmisKkY8x7uXXdJvzMfR/ElrZ6Dpix3GjxTraxKyyujNwn8fND69pd4+6bULDd95lWZYV4/wB3/wCyoorSnN8oVMDSlUlJ33ZLr02hpoOofY9VsNzWsu2FLtN27Z0AFFFFclSb5j1MHg6cabSb3P/Z" },
		"33" : { month: "Sep", type: "A + P", image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDpP2adT+Afxi0Lwl4N8T/CvTrfxRaafBAmoWFvua+ZLVWmnnMIRsnYW+ff/vVi/FnwF8FNRdF0rQE+Ha287WaXUtmt7Bdq+wpM37zenl+XLnbn6fNXlfwy8L6bLqvhVtU1XKXWlRNLcWtwsMEEHkp99lIkVo/4l/i/h+9XrPiC7+EHxz1u11T4o3lpZaRFpUpsLizRIr2aYSuwuJ0UfvmaNYkVdp3+/WvjZZnQr4iOGpabXbjv5Xvo9HufWzhisHUc7tx1ej2PIPi78K9P8B6U8a2+lXX2zQv7Ut77TrSL7kivsWUSxoYn+RvuLmivp/4gfBv4V61+y1qVn4R8W21xrXhnQLrWI9jwrc+Q1pJMbZ7eLZ5SN8z7MfI9FddTCThL3dj6TA5pSxFFOu/eWnX9DwvwVDHrPgfwlMstt9gh0eW1t5rz7PBJPex2QmaJWRRIEDeWm7O77vPzMtcZqtnqk3hvT7PR5ftrWrNappsqK0NzEy7oi2fRHVg/Rdlb/gD4X+IP2pLPRtM8Ppoumz+HNA0yzu4UlRGnRz5bXQUfebydnmNn+D+9XcXnwR8ceG/EN/oNp4cvLxrC1bZcadE9zbT2W/aqZXl1+b5CmZEH3lrxZ5TPAz9tT95Sd9tt/wDMnKsfQnVrU6zULpI83+G9vowsvFGoRQzPLN4S12P97dvttrhdOu0+TeP3qPsfbRWj4t8Da5ongbxHDH4M8SWi2+mXPmyS6dcTQxKqlmlMpX5EC+Z9/bRXvYXETlT/AHsW9dL9jLF4ahTqXoTVmtbPS/U8v0fxJpv/AAj2mWtxqdmksdnGvly3C/3Bxuj5T8a9F+G/7THij4fXP2eHxh52lSfMdNn1l5o1bj7j5+X5R8v8P95aKK76tKGKoujVV4tHz1TCQjVck3uz6Rvv2z/DvxD+BXxK0TU9YsLTUbnw9qdtbQ3WoW6uztbSrGqfN+9Zj2FFFFeFgoSwsZUIzcoxenM7tLtff7z18PhKUo81tz//2Q==" },
		"34" : { month: "Sep", type: "R(B)",  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDltakXQPhv4Fu/+FbeE4LFvDNmzr/YdvNf6huij33rO8Jf73O77v3/AJvmr0v4caX8PfBsKL4u0DwndWdxpkF5p8N14NF3cz+YXlWdpYISsW7P+rYv8u1Ttr1L9nP41fDG2+EnhqS+vtIivtL8M6ZpGsTalE0bNalADH9394gkdx8gbdu+f+9XhfiTw9ceD/G3ifw60qXGn6PqL2OlMn3fsQUSQp1P3Vl208lydY7GP2tSWzdlt9x9M686s3RTtq7v5nk/xC+KEfifQdQ02H4a+DPCU/8AZUqzNZeGIYbnjefNVnVnQlVxuXptz3or0K8+Fmi+I/BnxD8Yaxrr6ZeWOmXNnpmntdpB9unTT7i4Yc/M+Afuj726ijMMNDDYmdGOqi7HVhJzjGUeZuz7nlnxE8OJ4f0DwrM9hbaF/anhnSrho4r77Q06G3T9+VTmLzfvbSP71enaJc31/pVpdalcTXGoXESzSyXH+s+bkKf91dq17R4j1LRdN/Zg+Ftq2n6Ve+Idc8LWdql01pE1zbWq28Ilk3kFv70ancuGl+78teJeJNVbR9HluIU828b9zaQp96WduEUV9hw9COGo1cdV0il17LVnBRp8tWc+7Z5Z8RfGFxr2m6rpq3cP2OxlvPJaJGZmVkEbqSO5a2/4CKK9T1uz8IzeFddvoXs7i8s/DF1ptvaxWnmQLLFYukkssq5Q3BfzHVl3c7cutFflv9s080nPEcrWr6Hp0cPUpJ3e7vsR+ItY0rw38IvBXiZPif4b8Raq2laZp8vh95Ua7swtoNkQ8qbKJFjDeYn365Dwf8YP+J9d319No8U7WMtnpjJqMSrZzSYBlO9wN0ifuvM/5ZqzNRRXr4vF1sXgXgqkv3bWy0/r9TP2Vqt1J6Py/wAj1ez0D4f6J8I/Hc8/xI8Myv8A2Lq39mabYeIYftN87QOIRNAG/vFiked2aKKK8TD4OjQpqMV9+7PQpXq3lJ9T/9k=" },
		"35" : { month: "Sep", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6F8LfBf4fw/sk+EPEKeAPCD603hfTrybU73R7Fm8020bvNI0sR8zJ+9/E3bmvmay1/QtP16y/tDwl4EuJ9QurZYvsHhO0mtJ7USzNx+6HluWPltna2Nu77u6voS81H4w2H7NPwu/4Qfwl4b8V+Hv+EX0lrq3vYWu7llW0jJ3W7YVl3dNm5q8+0z9qPT9A+Jej694/8FTaZ4u8M6Umj2fhXTLTyJvtFw8kjXCxMfkj8nylUfe3SvXi4jC1a9uSo42T2Pb+tuk5p63fU3dN8C6Jr/7OXxW1DXvhR4QtL/TtD1aSy1zS9CsYVgljt5GVQygSearc71jRflor2HxJ4+h+JH7JfxR1iPwZqvgeWTw5q3nafqliLZmf7HJmRcAeYP8AaxRW0IThCMZu7XXud2FrSlFu9rnL+Hvjde+BvgP8I/D+hQw3t7qHhWwhmvILtWm0qUWUDK7RCN+NhZsmvL/hv8YvEHhLx94w8QX2jw+JdV1LWLa6exs7eJnndoX8pYpdpZHSHYey/fxXhvg7xmvjvwxpWjzeIL/Sp7Wx06OKS4u/IsILe2tQJJJPLxlgIW24w33fmc1tX+vN4Y0T7V/aqWU95Y/2tpsN0iStKhmMDQb3iK+YcfeK/P5f3vmr4XH47MY4x06LtqklrrrvddHrc6PqtBQlOVn3fz/M3PiN+3v8QvFHhfxzoeseGLSLT9V0e60f+z4oXjbT3dDG8rSEkswUt8rbaK9H0r4ffCr4ufs4/E34oWHhWPTvEtr4cv7e4slvvOtra6gsX2zQop/i+98//wBlRX37lZJS3OHARUoPlfU+ffF3gX4a+HfhZ4b1e18X2Ovtrfhe2W60mz160W70rWPJRt81v1aL/lmR95NvvXsHx1+Gnw18f28Xibwt8XPBravdLa+bod/4hs4I4IktUiMaNv8AVd21qKKOZ3QquDpvmk27tsvfCjVPBnwy/ZH+Lml6t488Lf8ACVeINK1JU0u38SWNy8uLJ4odgikO53J6Ciiis5ydz0sHhoRg0r7n/9k=" },
		"36" : { month: "Sep", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0rUtJ+Gvgn9mr4ZyL4A8CXPiPXPDlg019qVjp8c+9rJGaYvKpO/d8251KmvP/AAGuifEfxbrVj4V+F+i+I2mvFZ4bDwzYxw2MTLEOJpomjT/VyDuqtux9/NfTOhaP4Rt/2Q/Auva/qFn4Ulg8K6Oo8Uf2dDc3Ns32eER48yJ93zcYryOw+HfiLx58UdY8K+HfjLaS6f4o0eDXJfFGk2iw3OoS2srwNb4hlUKw8zzH7n5fl+9XhVMJOvUU/aNRSWi/zPbni3Sbild3d7nrvxk+AngHT/2c/HuqzfDHwVoniC28M6jcbtO0m2b7JOtpIy+XKIUOVI+8KK5b4r+Ivhf+zp+z945+F9n4jmv/ABDf6NqInWV3ubie7uLST99K3RM4/D5aK7ZR1OzBVJuDfM9zx3Vv2l/DHj39k/SPhnpthcPrmnaLo8KteQy+VP5UcaztF5XIaN1/j+Vv++a8x8DaZcfB/W7TXLOXVb/U7r7da6ZqGjOvkT7oZEb5n+dWDmDCNtf7y/xbq6n4Z/sufEPwx8OoviBp0Vg+g3XhuK6WFbiLzp4ZrRJnYo0bjandeGaqkV7HJoVprXiTWk1fwm0scNtG1vbR3Mqq3zMyxKn/AD73CqyHf/00r5DPMbjMNOMKelN9r3b7Ky3+exph6FGblOcbu/c8u8S/CjxFp+m3ud+uxQ6Zf75NLm81YEt4izyySKPL/vfIrH5UaivevF2peIvBvwE8S+KIre203wl4g0V9J0m1R28yVbiHJKpIq/8ALJ5GeTblmjX5qK9rLamJr4aM8Wvf+7TpobUFCDl7PVNn0v8ABT43fC2L9nXwNoeqfEbwjZXP/CK2Njd2d7rdskkT/Y0R0kQygqwPBFfCXw5+D2g+K/E+q2evfErwV4d0q18+3XVrnXLJvtMqN8nlx+aHaJ87t/8A7NRRXsR0R5tTDQlKTd9zrda8WadqPhTUvhxrfjTwzqeh+APD2vyabqFrq0XlazcT2z/Y1hG873Qy4Cg/wNRRRUybuerhMPGMLJs//9k=" },
		"37" : { month: "Oct", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDIsf2e7X4l6H4Xj8K2+ha1ri+HNHkuNHs9JS0uFWS2tzJK023y5mDurSSFt43tXk3j/wCFC+Btd8QaLDDba7Y+Hbpre71yDTlWLcOPmY/dO/8Ad/N97ZxX0b8C9A8R+DNK086Trv8AwjVn/wAIrp1+2pWFuryM91bRSAOpB3N24Xd+7j+avevH1j8QNJ+CepHVLL+09J1Cf7dqa6pL59zaW6eTtVo2OPnZGZwC3l7sbD81fD4fN6ft69JUpOcL83VLsr92uiPqcXUxElGHtEo30Pzw8eeHpNBTWrPWtE0dL6Gz8xJtOsbeOOJHtUeNv3cSKxPmIf7y7qK0/HXhvxDdw+IobyyeW7jgn1BVgt22tbiKbfJCcndEmx/n/gXcn8NFdcKrrL2kU9dT6vDtRowjKS26n2t8J7OO4+HfhiH7R9nnk8K+H5FkifbLEy2ERSQH/eTj/cre8Q+IPHOsaU8mqeLbm3je2e1NrZ29vBA0ryhI96tG5bcG5U/LXF+KbfTvDvwT/Zz8ZTeYl3a6BpNiGidl+R0s87sdV2PKOf79eo3HwV03X/gdBrUl3qV7rhsf7bjkn1CXy97KZ/KCA7VUbtq8ZX5TX5xi8mzmWZ4qeX4hwpytNrztsj5+OKwvs4+3hdrRHFeONf1u2+G/xF0S8ttN1CEeBNYij1JrOG2u4LSG0wqhogFdGll/1e1dv3qK87+LPj6zuvgB4yW4uNmr6tA2mteSukatbw2skjKn+/cKm5R186OivsckxmIjl1FYufPUtq/m7fgbU6EZTm6SsrnmXjr9prw/49+BHw28D2apYT+HtM0+G7vL27t9rPDFbg7EDk/8s2+9XU+MP25rrW/hFaeB9LtNE0pl06DT7jUn1xZGaKNAsm1BGNu/b60UV9U6cVKUray3+48+rhIe0td6N/n6Hhfjb4ow+L/A3kyPpVpPa6c8MFnBfJNIqGL5gSzKGdmO5tq/7H8FFFFeHSpxinZH2+HgqVKMYaH/2Q==" },
		"38" : { month: "Oct", type: "R(B)",  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDyzwZ8L5dO03wXr93peiPBd2dtqVra6joyTLcoh8tvNG4b1dkk6/e3f7tfUvwN07wP8QfEusWniT4b/DWyFvawXVv9l0G3tBO3mlTHiUuOdv8ADt/4FXKeOm3/AA0+BbbtzHwNaws393ZFbNj/AL5mWvMtbttNd3a8Saa8ktmWxt0T93PMHGVc/wAP7t5Ofm+b+Fq9yWBwtLI3i4w99avXz+4+ylKrjaihKVm3a/bU9C+P37O3wa+CNj4uOpTza14u1Sx1W80rTLWxggttK8y3meFnWPHyq3ypz/wDC0V4h4w1WaHRPEc1w73DLYyw+dqW6Rp1e1KDblgw2jygox8vlr2or4GjjoV05NWPc/s2phEoOd311/I72/8AjNpvjPwx8HPDem+c8Wj+G1s7uS6Ty2+1fZ4crHyfkxb/APAi1dT8N7DRdS+J3hS38QWSahplxeNYvHKisqtcI8KSc/3XZK+ftM8H6x4f0HwlqzW81xqEn2G4tdLt/wDSJ2t5IhmQAH91uRtwX7zq33cfM3rzp9pT92/yttZJE9uVYYr9ZyN08Zl1XB3TauvvPmLVFzJpq7bTPTfiL+yFpPgD4G+NW1fWL++8R6bo95dW7aWiw2ixRQuUjKSH5v4d7r/uj7lFeU+J/wBrzxxN8NPHHg3xVb23iLVbqzubVdUncxy2kEsTiTCoPnjO/wCRm+6P73Yr84qYWOHm6fLax24PFYirFyqSbdzgPAHxFtdBsPDV1b67Z2Wr6fFatazT3dvJ86xY+ZZAwXY397/nnHXu8y/CXSvgX4ivNa1LwJqvjjyJJrK107xDFHJAzYWKMLDcBZHB/eMEwmPloorhy6U6EpSpyau+56+cxVVxg1ayWq39D5i8c+CrXwz4PXWG8R+G9Ql1CCS3+y2GvW1/fwYRinmhJHO1t2Bj7vzbtpaiiiu+pOU5Xk7s8/A4aEabSb3P/9k=" },
		"39" : { month: "Oct", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD234eeGvhUvwF+G39nfDvwR4m8Vaj4esWubi60q0l8qXyYVkec7CzSGR8bf4mrm/j1afD/AMN/DLQtKt/g94cfXta0eC8l1+z8PQ2VrFKV3funWI723DlN33PrR8Gprq2+GvghZYtNllk8PW0ktnFu+0zxfZtkGM4bad7Ly23fJ8nFe0eEPD/jrxB4Tn0/TWbTfCOpaG8MEOqXHmSKJLYrB9m/eO6Y3Ju8xtvotfleWZ9icxzGvhJU2oLRNK6ja9+bbe2h9XNLC1Y1XLms77tf1Y/NvxJoOi23h7xBdLolhaN9hVbeZYUb5vK3EhcDY38O7r+NFfXPxB/YpTw7+zr4q8QarrT23i6z0i81G8jt18+28qO3klFsMkfNu3fvf9v7uMUV9TRwteMfe/M+reZ4XEO8enr+h8k+APFWseG7PR5LHVZtHXbaSSyRP5ny+Vs8xoz/AKzCM20N977o/hr9evhPoek+G/hp4YsdC1B9W0iGxia11B3LNcqy7vN5J+9u3Y7V8efCr4i/Aib9mzw54d17wb9uvrHSreQ2clj+9vr5oo/MMU6klC7/AMRZPl/3a2PgV+0PZ/DTRPFtxqmn23h/4aaHAn2TTdOea9kW9mlOIkllkLNu2S/3EH3vlr04Twzqr2dueXby7nw1fCYqPtKsotRT3fme0/Hv4meHNb+Gfxs8G2epJN4j0XwjfzXlj91lSSzkZSv97quf7u6ivzk+M3xOk8YeNfGvi7SUm0pteguv3cHzNFC9v5TxSSFcfOm7dj/gPrRXVJanTgNabfmRaH4t0d/DGieTrelaReR6Zaw+XBcRL5TJCiOdjSffdh8+4/e+YR1638CfiJf6HqMs+h+N/BWlaTdSCO/tPE/iC2gtLtAigiS2MrPnb8u9UoorwcNQi66qXd3c+1zOr/skqVlZWNH49eB/hl4n8VfE7xVb/EHwJF4fTw5PPo+h6Nrdn5t3qC2OxESONhhRLGpx1c0UUV7dWck0fKYOhFU3Y//Z" },
		"40" : { month: "Oct", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDxLwlo+jzaJo8jaFpUqfYYLj7V5MUkksw2blKlX3Y2/N0HrX0TefDbS/hJoWqH4l+D/D6LqMUTWMLaBp8cdpGJk3SG6ii3tK33FjjZvvbm6rXO+DdN+FHgr4A6DfeK76bxf4s8QWMH2HT/AA/L5EmlREIjb5GGI33L8+4N9z5V/ir7q+N/w81f4iaR4c0rS4bC4tIL7zL5NU+aJIhbyIrbMHewZuPevk6uFrRo1Jptya0Sf9a+fQ+4zLNoYiSpUklZ6u39dbn5UfEu/wBDTUtd1DQdP0dLFrN7O3j/ALDhj8pDDtzs2/JKMPiX7/3G+9uor1z44fs46vo3jz4j6Loll/xJfD2gS6vcaksXkQRw/ZDMAVBI3M4njVf/AIjdRXpUaTVKEZXul1evzaOLBVqkoybk9zyHwBYap53h+PT9Me7vttpNa262nnSSuIvNG6Ly23psTj/Zr9Wf2dPFvxB8Z+BPt/xD0CHRdQ83bbSbWilu4v8Anq8B/wBTz/3197ateYfs5/s3+HLm0+E3xUSaaPUofCemedp+B5E9z/Z8MSXH+yyx8Y/GvZbf45eB7mxvby48RWelQWcrRytqj/Zt3zbRInmY3o38LLXdKpTVoyau9rs8WcZOrK3cq/tIj/jHf4pf9irqn/pJLRXyB8aP2kdTfVPjPb2urf8ACReCtb0i9060ht38yG2xZGJZ4Xzj77fP67/VaK5I4ihUb9+1mfTYbA4qlBOUfiszudD/AGltE8Gfs+/DG20zx74TSK18L2NvrFmup28moQSraRLtEW4sMHfuUIz5rybx1rPww12zsrlvFmhadc2cFrZ2mpQanFPJKohEbebbp82393n+Ciivis7wP1nGUpurKNtrNWV7X6PfzDC0o03KpDRrqeJ6/daX4j0LxPcWOu6Ir6dY3m2G/wBWt4pp0bcgWGPzNssh+9hPf+LZkoor6Wjg6cKaSufTRxVWTd32/JH/2Q==" },
		"41" : { month: "Nov", type: "1/2B",  image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD561y80HXtL8L2dnpWmxRWejwfabiKxihmnmFvHvZ2VQzYf5eep/vb91e7fs8/Dn4dWPwT8e6n8X9FsNH8J3UGmXWleIntBJeRtcq4UQSAF2w64Kf7PzV4N4Y0HzvhXrHiL5P3M+naLaqm5f8ASJE8ztz9xa+zLj9n9NVh+EfgvxXP4ksbG80COOG9gmga00i7ZZWjh+zyQN8742lvM3M1cFKl7OkoQV3rdt/M9XEYirOvPlk9GfOHxv8A2c9F+H3wf03xZoOv6L4qi8+5s7q90t0kj2Fm+y3G1Pub0+Ug/dfbRX2J4/8A2dvC/h79jf4h2trp/wDxUUOjyyanqlxue5nuLHLkliTtQ+X8qjjbRR/iWp62Bqz5H7z37ngv7L2saF4H+Duptq2n2et6hY6/pWtafa3UT7UY6eh8zIx5mzzPu1F8aPH3iXW/H97411nUprG5s54I7S1iuJY/s0DpG8ZtyrffZZd3Ndx8OfGa3nwk8JTaN4S8PXdtY6dpNu959mVrmeW3t4Dcxz7sq6/PJx8r+m6ue/aD+AXjaz+K2saXp1veeJ9IWJNXivHtzJKtvvTzJHK7RJIm1k4K/L0WvNqYyjmdL6vgpXlCVpO9vlrYyyym8DmFStjmuWUWordX7mjr/wC0X478RfDT4kW94miXumato+owzTWUO3z3+w7HmGGJjYKvOeGorpfjp4K1LS/2N/DFxN4aRNXt9Fulvry1t9vkQGJyokEZ7qVbe38S/wC1RX0MYQdOHMk3bX1+R5lKq1Vrct+XmdvJaHL6L8b/AIMaN4A8C2+p+M3fb4X0631jQ9Lt5fOiu4rRE81JRtj87jYVf5flrA8Yft0yeL00Tw/p+salp+i2t40ja1f6jEuoy7uYxJ5OxF2Hjd81FFfPzw1GFOq6cVFy1bWjv3Palh4yq+827HKfEj9p3xXr3gjxd/a3xHh1XVb5Z9IisbOWFbaWykhdZD5Ufy5YN97ruooorHL5ScJOUm2319EetHC0qatFH//Z" },
		"42" : { month: "Nov", type: "A",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDyn4m6BpNr8Pfhk0Ph/TbK+1TQraZ5ItMhSRmEMcfmSMo3SZ2vNu/i835q9m+Anwc0PxD8MfCkMngfRNY1XVL6+uIpLixt2uVt0QiAtvG6RPMj5H938q6+H4F2fxC+G/wN8WeKnfSPBnh3wMs2rXUPzTSr+58qJMDOXU7q938L/Fj4Wv4W0PxnY6Zf6PpekyT6VpMb2gWWVEQb5FjUlvLVR1fb/wCg1wVJ06UL1GkrXu2evUqV5VZuLdr2PzB+JHw9/wCEA8Q+JdDvLKGK50/7TauzW6L80edrDj+LNFe9f8FB7bSdV8eWXi7w/LDdWOvaVJI8i5Vo7iKJ45A6Ngo2wxZUjNFDcZpSi7pno4KpV5H7z3PStE+KHiK//Z88D+FtLWwt/DS+FLOLUbi6liaOTcrq2WfJRU8vt8277taFrP4a1dvB+n65qmlaHqepXS27Xkdk0LQZh3W4kR9u9Z2VG8zo3Y1vfsqfs7WfjD4XfD3XPEMHm6MukwTNpbu6rfXCtvt5XX+4qyfd7tGjVW/4KA/BCPXtT8H+L9PWa3ubjU7bQ9RaD5fNimlCRs3+6zV8Xj8kqYzELE4mbcYyVora1tU/V9i6HLUxDoX5bt6+Z4x+1p8HdStviInhy+1i21u5sfCWo+Ipb5NO+yfZkgt7g+UNsjbldk78L/Dt3UV1+q/23rnwi+IvibxFsm8feBvC2p+Atb8/5WuYpGja2u8990Ekv/AqK+pw9Glh6UaeHXLHsGHcqfNGb1ufRH7Pvx7+F+h/Aj4c6ff/ABE8KWN/a+HNOhuLW5162jlhlW3jDoymQFWDdRXY6t8dfgzr1oltqHxJ8EXcCypMI5fEFpt3o4dG/wBb2YUUV1Jc0dTmqUoqo3fqz5i/ap8deCYtB+M+u+FfHvhPVW8V+HtOsX0+w1u2nnnuIrlldljVyW/cyUUUVg3y7Hs4ShGpTvL+tj//2Q==" },
		"43" : { month: "Nov", type: "R",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC58NPCPwz8f/sR+brnh/SNK8VafeR2MOuWWhpJdyykLLB5jRLvdXX5GP8AWsj9kzRvA+m6X4v8M+PPA9hcahqn7vw/eapoEVzIspik+VZWjbZ/D1rE/ZpvDc/s8+PdPT/SJbG80fUH2/LtQzPE3Hskq8123hu/tdK8W+GtQvn2Wlnq1nNM3+wJkDf+OmvmcVjpYbEU6NlaVrt+p+iYHKo5jg8RiHUkpwbsr/M+RH0SP+ytYurXTIXaxik85ntPMWJHTrnopDPtU0V9LeF/D/8Awqzx1+0J4K1GB2ZvButwwNcbWVlS3MsRHvti30V61WPvbHgYGtU9naUn95qfs8eCrzwzrep+C5pfl+IHw1g1TR5vJ/5bi2hmPPfa/wAv/AKqvt1jSt0fyLdQbk/2dy8V1v7HWqw/Ffwf4E0a3unsviD8OLpdU0uSVPLW+0uY7bizLf8AAv8A0XVv4s+DG+H3xN8QaGyOsPntfWbN/FbTMXT/AL5bfH/2zr53PaMvZwrx+y9T63hXFRji6+El9vb5G/8AtUfDW8+KfwZ0z45eEWRPEEPhmeDXoUdo1ubVrcxXP/Aof33y9xRS+CviBHB+z38ZPA95Ltb/AIRjVtU0ze/3la0k8+IfR/3n/bRqK9ijiI16Ualr3R4c8LLA16mHk2rN/d0PCIfHei/AXxb8I/iZ4a8RaLrhl8PadFq2k22pxSXNpKunwwXMDxqxKbkTcGI/1n/Aa+zfid4s+A/xxtNF1K8+K/hzR7q3i3Q3EWt2Uc6wyKC0MiSMcdFOMZVqKK6ppVIKM1dM4XS9hWdWnJqSe9zyH4teDfghYfCvxhdaP8abHU9Zt9Fv2srO38Q6czTym2kURBUGW352bB1ooorn9lCj7tNWR6lKrVrrnqzcn5n/2Q==" },
		"44" : { month: "Nov", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDwrQdH0F/DeiLcaVZp9otYvtF5LaReYvyAsRux/wB9f5bY0F/Bmm/2hDqGhabcLCq3H2iLTvP+QqWCnMfycevWuU8Hpdal/Y8dwiPFHY/6n7se1UQquT/GRy3tVjxbptvo76hqVulzcLuW4umldlZtyZCkf3cncy/7dfMfVKVSu6XM7WT3P0utm+KoYNYiMY35nHboP8T6n4ZTwxqFxHoVhb3k0E8cMK2MKyRMeDIcfd29F/76orn/ABJYXSfaI1uPOWG1n/2ukXzD/dH/ALJRXd9UpUvdu/vOTDZ1ia8XOaW/Y6jwreW9no9v5n+oh0mBoY4vmkluGwTHtI+bd/F/s/71M1Xx3YX2sNaw3EMs8W1rmRZUk2zcAvIo+783NZXgmzkm0d9v+tjggk+/t3IERwp3Z/265i8tLjwgllo/hKW8vbGTUPOvJry0Ty1t2VdyM/XinRpx+tSlfWyPMx1Sp/ZyhbTnlqdD4h/0bRNVurPfcQfv7NpIn2sqbMbWBPP97NFVZodUh8MXa3HyQfZZ5olab+ALtBOP4jvorvnuceXfwn6m7pWvaPYaDpV1b6hZ295Z6dFHKtvcRLNKzpjaQxX7rDc2GzRNqWi395FeXVxo9xPNtZl+1xQx7h/eA37vbNFFfLKLjLmjJp66n6POFOrH2c4ppdOhX8STWusabrci+I9Ki8yzZlh+17mbYu8RIA235unIzRRRXRCpUa1m/vMvqmHjpGCR/9k=" },
		"45" : { month: "Dec", type: "B",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD580rRNPvNE0yRdHs9b1hrGBlt4LeGBVXygvz9Bn+9JJ1+9/ero4fhvY69psVx9n0q3+ZpJYbe0SGSJhvVlLMG+UZ/ubfuV2f7PHwx1TxJ8OvFc2m2/wDbHiqz0ezuLLQ1RWk+zu6eZPGrffkEW3b/ANdfl+bbXr8P7NviTUvhNe+IND8OarZeKob5rVNJv7cr/aUTsoE6rJtaHZ5nzc7H8rdXHmONlOhToZZHlaWrtv09b+dz9EpVYYes5YuSaula+19b+lj5D1XR9P8ADv8AbdxpumWF7BNpkvm28tusv2Z2i2EpIw++jHzV8vb8tFe6ftW+AdQ8OeIb3QdJ0p7u8sfClnqWtyaX+8WCVLJoLmST/YKLEd1FaSwOEqU6blO8ra9NbjoYuVROa0Tei7I9e+DdrbW3w98B+Ntd8PeKfh9r+m6VpOl23ibQfs89trNvMkMNtvibfu+Xy9+U/H7u3pPHHxUuPh747TxFdX2rabZ32otqH9n6dq0V3beIVgiMUDROmVgilzulR/lXyeK+X5f2hbrVtM8EW/8AYltNY+H/AA5YaUNtxNbTSwpbwmfzJUJGxnR9q7d2PmXmrniT4zeF/Hk1lp994Uv9M0FmtvKs7Ca3n+x2ittlgt3eKLy4pN25d7SfPtbbnc1dFCNKNue9nvY+Or1VKrLm2TPY/iY6eK/hZ8Spfh5e2JsdT0y81HXvFOv6gG1rV/It/OltI7cKDGiKyLx8n8NFfPPxI+Lun6r4M/4Rvw7pV/p+i6fZ6nDb3msujXuydg8kGYdioFeP0bfvaiuDEQo8/W3Q9jL6840mobXPQvhp8Lvgzb/CjTdQ1Xx9o19rtxo6XUmlT63aWka3DW3EMigiTKM23lq8k+HPh7TfFeqvG/izw5pUDKvm6hrGoW1ssQC4wFLBpP8Adxj/AGqKK/OMJicVQWJl7aUnJ6Xs+Xf4dLL53OrEYGhUmro9I+MHwZ+F9l4Q1288KfFbQLoW9jLcR6Ve6rb3M88qq7bUeOUFmOflBU0UUVtlOJxUaHLUrSnZ7ytf8Ejvo4OjGPuqx//Z" },
		"46" : { month: "Dec", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2Q+Afh34W/Zb+F2rjwd4NtfEeraVpLf2nqnha3u4bmU20ckq3EnlHyzIN37xv4q7r4b+Hvgn4p0+X+3Ph78ONI1OTWBptvZxaJb/8tl8y0iYtF/rpIvmKrTvh3rfhLVP2Y/hxfX/ji80G28MaHpK6mukzLIu+SzhUW91AY3Eivu+4VryO1+OOk6v8Nr7wdpthZ6fPpOpyX1uz2PmrqVpF5khlmYDfZ3G2Pfvx8nyLTpUJVYNxi2lu7Hq1J1OeVm9Geh+O/BXwb8X/ALPfxR1jQfht4W0fVdL0PVmiVtEsob2AxQzrHcLsUsisU3I1FeR6l+0R4S0/wL8XPCun6PClpf8AhOa0stStbT/iY3kxsXVpr3cd2HZmcf3VSiufE4apRnZxavqergvauDd2eT/DT45aX4es/C9rrGn6re+F7fTIv7Vt/Ni3XjJaCCNZSFUGAF22JJu+X5a7T4U/E74Y/CXxDDqFvLr2rancaZeW99dXUX2aVvMtowkX2bZh380MpbzNo+9uasD4L/ska54v+GVvrup3f9mQ3WmLdadbxbJLm5Yw5iJP3VjY7Ovzf7teRarZ3FhqSRzWk1u0LSrcRyo8bQNtywcZBX3yDXlZfxDg8dVrYTC1uZ0/iV/6vY8jF06tOo5TVk27HT658WdD06z1r+w/CU2nz3WlanazTX927SM11bTROoVAkaJD5r7F2Z/2qK6vx5+y7eaP8Cm8ZfaIdPuV06W+vtNv5fKZcq+wo3RnMexfL/KissNnuGzWMquHqcyi3H5o9rBYerGDuj6T+DXxj8Aaf8IfA1pd+OPDNrdwaDYW80E+sW8csTrbRhlZS+VYHqK4f4/fHT4GaBeWXiC7h0jx54oVk+zQ6TcCdeOhuXjYxlV9H3H+6KKK/Hsl4PwGIz51JVKi55SbSla991ok7eVz3KyTg0zz34ueLtC+NvgPxLd6x418OSi1sbm8sYJdTiV/OjQvGltbbg+9j8vI/wC+ulFFFfp2HqzwLnhcK+SnB2SSSSIw+HioXu9T/9k=" },
		"47" : { month: "Dec", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6v+APwD+Fup/AX4eapqfw78J3d5c+GtOuLq8utEtZJJHa1jaSSR2jyxJ6muI8TX/wf8MePl0eb4OfD8+G2e2uF8QLp9rLHNYSo/7+JI4G3t5y+WEX/arnvgV8YtW+GPwKia8t3utQutH0ibR9F13Uf9GubeOxVbg20qq42+XF5piO3a3yH/a5n9mvxnp+vfFNG1q3m03Q9Nun1C2jTU/7N0/Q1Rj+7ZHA8+LzJfkUv955Pk21pRwkpwlUsmlbqerVlU55We3meoftDeGvgd4a8D/EHQbfwH4R0rX4PCV/fWepRaLZQxrcCKREijlA3C4D8hRRXivj3XNF+KGg/EjVLTT9Ei8WW+la1cXEc9w0dhcqYpMajaRMSz3ElpG4wPut+8bbRXFWockrPQ9PBzmoO7Z5ba/GzRPD3hjQtN8J+ErM+X4Zs9P1C4upWnhnmnitftpNuVby/OMfkN5eC33q9Ksfi18OfGPgrxEuof2V4M8RzaBFptloqaGzxpLBKjrMl3BvaSQfdX5I6f8ACH9g3XvFfwQi8UXGupFfalpVtqGk6Ta7pPPUwxyIJJGH7rI+XYq/8Crw3wn4M8RfETxImk6Hpt5qWrzL5cOnqnzeUPvF+f3abvlYv92umjUlCN09tTw68pRqyt3ZPo3xcj8IaV41j/sKLUk1jQNR023uLm5ZZLZ50Ku8aMGw6KdrLuor3D9pD9h+4+HPw31PxRpOu2d3Y2OlNdanDql35UrXex/NMTBQrod3yRnn+EZzRWeIqVcRPnkr+dj3Mvc5U25b3Ppv4AftAfDHRfgP8ONOv/iN4Tsb618Oadb3Frda9bRSwypbRhlZWkyrA9Qa5v4n/tj/AAQ+AGn3t/4Xk0TxJ4h1ic3Etv4VeGbz5SeZbmeLIA78/N/dWiirwcI1KsYy2IeFpyqtPuzwD40eONH/AGhfAHi3UPEXxB8MyR2Wm3F9ptjJq0MbfaI4jJDFa2hYSb2YbDuGf977tFFFZ1cXWpS5YOyPSwdCMYuK7n//2Q==" },
		"48" : { month: "Dec", type: "P",     image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAoABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6v+APwD+Fup/AX4eapqfw78J3d5c+GtOuLq8utEtZJJHa1jaSSR2jyxJ6muI8TX/wf8MePl0eb4OfD8+G2e2uF8QLp9rLHNYSo/7+JI4G3t5y+WEX/arnvgV8YtW+GPwKia8t3utQutH0ibR9F13Uf9GubeOxVbg20qq42+XF5piO3a3yH/a5n9mvxnp+vfFNG1q3m03Q9Nun1C2jTU/7N0/Q1Rj+7ZHA8+LzJfkUv955Pk21pRwkpwlUsmlbqerVlU55We3meoftDeGvgd4a8D/EHQbfwH4R0rX4PCV/fWepRaLZQxrcCKREijlA3C4D8hRRXivj3XNF+KGg/EjVLTT9Ei8WW+la1cXEc9w0dhcqYpMajaRMSz3ElpG4wPut+8bbRXFWockrPQ9PBzmoO7Z5ba/GzRPD3hjQtN8J+ErM+X4Zs9P1C4upWnhnmnitftpNuVby/OMfkN5eC33q9Ksfi18OfGPgrxEuof2V4M8RzaBFptloqaGzxpLBKjrMl3BvaSQfdX5I6f8ACH9g3XvFfwQi8UXGupFfalpVtqGk6Ta7pPPUwxyIJJGH7rI+XYq/8Crw3wn4M8RfETxImk6Hpt5qWrzL5cOnqnzeUPvF+f3abvlYv92umjUlCN09tTw68pRqyt3ZPo3xcj8IaV41j/sKLUk1jQNR023uLm5ZZLZ50Ku8aMGw6KdrLuor3D9pD9h+4+HPw31PxRpOu2d3Y2OlNdanDql35UrXex/NMTBQrod3yRnn+EZzRWeIqVcRPnkr+dj3Mvc3Tblvc+m/gB+0B8MdF+A/w406/wDiN4Tsb618Oadb3Frda9bRSwypbRhlZWkyrA9Qa5v4n/tj/BD9n/T7u/8AC8uieJPEOsTtcS2/hV4ZfPlJ5luZ4sgevPzf3Vooq8HCNSrGMtiHhacqrT7s8F+NfjjQ/wBoX4deKtQ8QeP/AAzItlp9zf6bZyatDHJ9ojiLxQ29p5u/ezDZubn/AHvu0UUVNTFVacnCDskehhsPCKaXc//Z" }
	};

	// the yakus
	this.YAKU = {
		"Any 10 Plains":     { cards: [],           amount: 10, exact: false, bonus: "1 Point, +1 Point for each additional Plain" },
		"Any 5 Ribbons":     { cards: [],           amount: 5,  exact: false, bonus: "1 Point, +1 Point for each additional Ribbon" },
		"Any 5 Animals":     { cards: [],           amount: 5,  exact: false, bonus: "1 Point, +1 Point for each additional Animal" },
		"Any 3 Dry Brights": { cards: [],           amount: 3,  exact: false, bonus: "5 Points, +2 Points for the Rain Man, +3 Points for the other Dry Bright" },
		"3 Blue Ribbons":    { cards: [22, 34, 38], amount: 3,  exact: true,  bonus: "5 Points" },
		"3 Poetry Ribbons":  { cards: [2, 6, 10],   amount: 3,  exact: true,  bonus: "5 Points" },
		"RoShamBo":          { cards: [21, 25, 37], amount: 3,  exact: true,  bonus: "5 Points" },
		"The Loop":          { cards: [29, 44],     amount: 2,  exact: true,  bonus: "5 Points" },
		"The Sacrifice":     { cards: [17, 29],     amount: 2,  exact: true,  bonus: "5 Points" }
	};

	// some variables that we'll need later on
	this.container = null;
	this.containerYaku = null;
	this.form = null;
	this.yakuContainer = document.createElement("div");
	this.theirYakuContainer = document.createElement("div");
	this.notFoundContainer = document.createElement("div");
	this.configButton = document.createElement("a");
	this.configDiv = document.createElement("div");
	this.myTakenPile = [];
	this.theirTakenPile = [];
	this.myHand = [];
	this.field = [];
	this.topCard = [];
	this.cardsInMyControl = [];
	this.cardsInTheirControl = [];
	this.cardsNotFound = [];
	this.myHandElements = [];
	this.fieldElements = [];
	this.topCardElements = [];
	// set up the config
	this.config = new Storage("Hanafuda");

	// get cards of a specific type
	this.getCardsOfType = function(cards, type) {
		var matchingCards = [];
		for(var i = 0, cl = cards.length; i < cl; i++) {
			var cardType = this.DECK[cards[i]].type;
			switch(type) {
				case "P": {
					if(/P$/i.test(cardType))
						matchingCards.push(cards[i]);
				} break;
				case "R": {
					if(/^R/i.test(cardType))
						matchingCards.push(cards[i]);
				} break;
				case "A": {
					if(/^A/i.test(cardType))
						matchingCards.push(cards[i]);
				} break;
				case "B": {
					if(/B$/i.test(cardType))
						matchingCards.push(cards[i]);
				} break;
			}
		}
		return matchingCards;
	}

	// get the HTML code for a specific card
	this.getCardHTML = function(card, className) {
		var oCard = this.DECK[card];
		return ["<div style=\"display: inline-block; vertical-align: top; font-size: 10px; padding: 2px;\"", className ? [" class=\"", className, "\""].join("") : "", "><img title=\"", oCard.month, " ", oCard.type, "\" src=\"", oCard.image, "\" /><br/>", oCard.month, " ", oCard.type, "</div>"].join("");
	}

	// get the amount of cards that haven't been taken by them
	this.getYakuCardCount = function(yaku) {
		var count = 0;
		if(!this.YAKU[yaku])
			return 0;

		for(var i = 0, al = this.YAKU[yaku].cards.length; i < al; i++)
			if(!this.theirTakenPile.inArray(this.YAKU[yaku].cards[i]))
				count++;
		return count;
	}

	// create HTML for a yaku set
	this.getYakuHTML = function(yaku) {
		var availableCards = [];
		if(this.YAKU[yaku].exact == true ? (this.getYakuCardCount(yaku) == this.YAKU[yaku].amount) : (this.getYakuCardCount(yaku) >= this.YAKU[yaku].amount)) {
			var done = true;
			for(var i = 0, al = this.YAKU[yaku].cards.length; i < al; i++) {
				var iCard = this.YAKU[yaku].cards[i];
				if(!this.theirTakenPile.inArray(iCard)) {
					var loc = "unk";
					if(!this.myTakenPile.inArray(iCard))
						done = false;
					if(this.myTakenPile.inArray(iCard))
						loc = "pile";
					else if(this.myHand.inArray(iCard))
						loc = "hand";
					else if(this.field.inArray(iCard))
						loc = "field";
					else if(this.topCard.inArray(iCard))
						loc = "topcard";
					else if(this.cardsInMyControl.inArray(iCard))
						loc = "mycontrol";
					availableCards.push(this.getCardHTML(iCard, loc));
				}
			}
			if(done == true)
				availableCards = [];
		}
		if(availableCards.length > 0) {
			return ["<div style=\"display: inline-block; vertical-align: top; padding: 2px; margin: 2px; border: 1px solid black;\"><span title=\"header=[", yaku, "] body=[", this.YAKU[yaku].bonus, "] offsetx=[-310] offsety=[10]\">", yaku, " (", availableCards.length, ")</span><br/>", availableCards.join(" "), "</div> "].join("");
		}
		return "";
	}

	// get the amount of cards that haven't been taken by them
	this.getTheirYakuCardCount = function(yaku) {
		var count = 0;
		if(!this.YAKU[yaku])
			return 0;

		for(var i = 0, al = this.YAKU[yaku].cards.length; i < al; i++)
			if(!this.myTakenPile.inArray(this.YAKU[yaku].cards[i]) && !this.myHand.inArray(this.YAKU[yaku].cards[i]))
				count++;
		return count;
	}

	// create HTML for a yaku set
	this.getTheirYakuHTML = function(yaku, amount, exact) {
		var availableCards = [];
		if(this.YAKU[yaku].exact == true ? (this.getTheirYakuCardCount(yaku) == this.YAKU[yaku].amount) : (this.getTheirYakuCardCount(yaku) >= this.YAKU[yaku].amount)) {
			var done = true;
			for(var i = 0, al = this.YAKU[yaku].cards.length; i < al; i++) {
				var iCard = this.YAKU[yaku].cards[i];
				if(!this.myTakenPile.inArray(this.YAKU[yaku].cards[i]) && !this.myHand.inArray(this.YAKU[yaku].cards[i])) {
					var loc = "unk";
					if(!this.theirTakenPile.inArray(iCard))
						done = false;
					if(this.theirTakenPile.inArray(iCard))
						loc = "pile";
					else if(this.field.inArray(iCard))
						loc = "field";
					else if(this.cardsInTheirControl.inArray(iCard))
						loc = "mycontrol";
					availableCards.push(this.getCardHTML(iCard, loc));
				}
			}
			if(done == true)
				availableCards = [];
		}
		if(availableCards.length > 0) {
			return ["<div style=\"display: inline-block; vertical-align: top; padding: 2px; margin: 2px; border: 1px solid black;\"><span title=\"header=[", yaku, "] body=[", this.YAKU[yaku].bonus, "] offsetx=[-310] offsety=[10]\">", yaku, " (", availableCards.length, ")</span><br/>", availableCards.join(" "), "</div> "].join("");
		}
		return "";
	}

	// append the css style
	addStyle(this.config.get("alt.suit.color", false) ? COLOR_CSS_SOUTH : COLOR_CSS_NORTH);

	// create a temporary array with all cards
	var tmp = [];
	for(var i = 1; i <= 48; i++)
		tmp.push(i);

	// fill up the remaining yaku
	this.YAKU["Any 10 Plains"].cards = this.getCardsOfType(tmp, "P");
	this.YAKU["Any 5 Ribbons"].cards = this.getCardsOfType(tmp, "R");
	this.YAKU["Any 5 Animals"].cards = this.getCardsOfType(tmp, "A");
	this.YAKU["Any 3 Dry Brights"].cards = this.getCardsOfType(tmp, "B");

	// find the main table and save it
	var snapContainer = document.evaluate("//center/table[@width='720']/tbody/tr/td", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(snapContainer && snapContainer.snapshotLength == 1)
		this.container = snapContainer.snapshotItem(0);

	// display an error and stop if we don't have a container
	if(!this.container) {
		cAlert("Could not locate the main table!");
		return;
	}

	// change the table width to 100%
	this.container.parentNode.parentNode.parentNode.width = "100%";
	if(this.config.get("yaku.right", false) && !this.config.get("hide.all", false)) {
		this.containerYaku = document.createElement("td");
		this.containerYaku.vAlign = "top";
		this.container.parentNode.appendChild(this.containerYaku);
		this.container.style.width = "720px";
		this.container.vAlign = "top";
		var el = this.container.parentNode;
		var elName = el.tagName;
		do {
			if(el.tagName == "TABLE" || el.tagName == "TD")
				el.width = "100%";
			el = el.parentNode;
			elName = el.tagName;
		} while(elName != "BODY");
	}

	// get both piles, display an error and stop if we don't have 2 piles
	var snapPiles = document.evaluate(".//table[contains(./tbody/tr/td[1]/text(),'Plains') and contains(./tbody/tr/td[2]/text(),'Ribbons') and contains(./tbody/tr/td[3]/text(),'Animals') and contains(./tbody/tr/td[4]/text(),'Brights')]", this.container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(snapPiles.snapshotLength != 2) {
		cAlert("Could not locate your and their pile!");
		return;
	}

	// parse, save and remove my and their pile node
	pileNode(snapPiles.snapshotItem(0), this.myTakenPile, "your");
	pileNode(snapPiles.snapshotItem(1), this.theirTakenPile, "their");

	// add the yaku container and the cards not revealed container
	if(!this.config.get("hide.all", false)) {

		if(this.config.get("yaku.right", false)) {
			this.containerYaku.appendChild(this.yakuContainer);
			this.containerYaku.appendChild(this.theirYakuContainer);
			this.containerYaku.appendChild(this.notFoundContainer);
		}
		else {
			insertAfter(this.yakuContainer, snapPiles.snapshotItem(0));
			insertAfter(this.theirYakuContainer, snapPiles.snapshotItem(1));
			insertAfter(this.notFoundContainer, this.theirYakuContainer);
		}
	}

	// get the main form
	var snapForm = document.evaluate(".//form[@name='placecard']", this.container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(snapForm.snapshotLength != 1) {
		// cAlert("Could not locate the main form!");
		return;
	}

	// save the main form
	this.form = snapForm.snapshotItem(0);

	// get my hand cards
	var snapMyHand = document.evaluate(".//label[contains(@for,'handcard')]", this.form, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for(var i = 0, sl = snapMyHand.snapshotLength; i < sl; i++) {
		var el = snapMyHand.snapshotItem(i);
		this.myHandElements.push(new Card(el, getMonth(el.textContent)));

		var matchCard = el.innerHTML.match(/billy.layout.hcards.(thumbs.)?(\d+).jpg/i);
		if(!matchCard || matchCard.length != 3) {
			cAlert(["Could not parse the card ", i + 1, " in your hand!"].join(""));
			continue;
		}
		this.myHand.push(parseInt(matchCard[2]));
	}

	// get the field cards
	var snapField = document.evaluate(".//label[contains(@for,'cardinbutton')]", this.form, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for(var i = 0, sl = snapField.snapshotLength; i < sl; i++) {
		var el = snapField.snapshotItem(i);
		this.fieldElements.push(new Card(el, getMonth(el.textContent)));

		var matchCard = el.innerHTML.match(/billy.layout.hcards.(thumbs.)?(\d+).jpg/i);
		if(!matchCard || matchCard.length != 3) {
			if(!/billy.layout.hcards.(thumbs.)?hcard-blank.gif/i.test(el.innerHTML))
				cAlert(["Could not parse the card ", i + 1, " on the field!"].join(""));
			continue;
		}
		this.field.push(parseInt(matchCard[2]));
	}

	// get the deck card
	var snapDeck = document.evaluate(".//td[contains(./b/text(),'Game')]", this.form, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	for(var i = 0, sl = snapDeck.snapshotLength; i < sl; i++) {
		var el = snapDeck.snapshotItem(i);

		var matchCard = el.innerHTML.match(/billy.layout.hcards.(thumbs.)?(\d+).jpg/i);
		if(!matchCard || matchCard.length != 3) {
			if(!/billy.layout.hcards.(thumbs.)?0-1.jpg/i.test(el.innerHTML))
				cAlert(["Could not parse the card ", i + 1, "!"].join(""));
			continue;
		}
		this.topCard.push(parseInt(matchCard[2]));

		this.topCardElements.push(new Card(el, getMonth(el.textContent)));
	}

	// highlight all cards
	if(this.config.get("highlight.all", true)) {
		// add color classes - top card
		for(var i = 0, hl = this.topCardElements.length; i < hl; i++)
			addNodeClass(this.topCardElements[i].element, this.topCardElements[i].month);

		for(var i = 0, hl = this.myHandElements.length; i < hl; i++)
			addNodeClass(this.myHandElements[i].element.parentNode, this.myHandElements[i].month);

		for(var i = 0, hl = this.fieldElements.length; i < hl; i++)
			addNodeClass(this.fieldElements[i].element.parentNode, this.fieldElements[i].month);

		// we just drew a card
		if(this.topCardElements.length > 0) {
			for(var i = 0, hl = this.myHandElements.length; i < hl; i++)
				addNodeClass(this.myHandElements[i].element.parentNode, "nomatch");

			var match = false;
			for(var i = 0, hl = this.fieldElements.length; i < hl; i++)
				if(this.fieldElements[i].month == this.topCardElements[0].month)
					match = true;

			for(var i = 0, hl = this.fieldElements.length; i < hl; i++)
				if(match && this.fieldElements[i].month != this.topCardElements[0].month)
					addNodeClass(this.fieldElements[i].element.parentNode, "nomatch");
				else if(!match && this.fieldElements[i].month != "unk")
					addNodeClass(this.fieldElements[i].element.parentNode, "nomatch");
		}
		else {
			for(var i = 0, hl = this.myHandElements.length; i < hl; i++)
				addNodeClass(this.myHandElements[i].element.parentNode, "nomatch");

			for(var i = 0, hl = this.fieldElements.length; i < hl; i++)
				addNodeClass(this.fieldElements[i].element.parentNode, "nomatch");

			var match = false;
			for(var i = 0, hl = this.myHandElements.length; i < hl; i++) {
				var month = this.myHandElements[i].month;
				for(var j = 0, fl = this.fieldElements.length; j < fl; j++) {
					if(month == this.fieldElements[j].month) {
						removeNodeClass(this.myHandElements[i].element.parentNode, "nomatch");
						removeNodeClass(this.fieldElements[j].element.parentNode, "nomatch");
						match = true;
					}
				}
			}

			if(!match) {
				for(var i = 0, hl = this.myHandElements.length; i < hl; i++)
					removeNodeClass(this.myHandElements[i].element.parentNode, "nomatch");

				for(var i = 0, hl = this.fieldElements.length; i < hl; i++)
					if(this.fieldElements[i].month == "unk")
						removeNodeClass(this.fieldElements[i].element.parentNode, "nomatch");
			}
		}
	}
	// highlight only matching cards
	else {
		// add color classes - top card
		for(var i = 0, hl = this.topCardElements.length; i < hl; i++) {
			var month = this.topCardElements[i].month;
			for(var j = 0, fl = this.fieldElements.length; j < fl; j++) {
				if(month == this.fieldElements[j].month) {
					addNodeClass(this.topCardElements[i].element, month);
					addNodeClass(this.fieldElements[j].element.parentNode, month);
				}
			}
		}

		// add color classes - hand
		for(var i = 0, hl = this.myHandElements.length; i < hl; i++) {
			var month = this.myHandElements[i].month;
			for(var j = 0, fl = this.fieldElements.length; j < fl; j++) {
				if(month == this.fieldElements[j].month) {
					addNodeClass(this.myHandElements[i].element.parentNode, month);
					addNodeClass(this.fieldElements[j].element.parentNode, month);
				}
			}
		}
	}

	// find cards that are in your control
	for(var i = 1; i <= 48; i++) {
		if(!this.theirTakenPile.inArray(i))
			this.cardsInMyControl.push(i);

		if(!this.myTakenPile.inArray(i) && !this.myHand.inArray(i))
			this.cardsInTheirControl.push(i);

		if(!this.myTakenPile.inArray(i) && !this.myHand.inArray(i) && !this.field.inArray(i) && !this.topCard.inArray(i) && !this.theirTakenPile.inArray(i))
			this.cardsNotFound.push(i);
	}

	// put the HTML into the container
	var yakuHTML = [
		this.config.get("hide.sacrifice", true) ? "" : this.getYakuHTML("The Sacrifice"),
		this.config.get("hide.loop", true) ? "" : this.getYakuHTML("The Loop"),
		this.config.get("hide.roshambo", true) ? "" : this.getYakuHTML("RoShamBo"),
		this.config.get("hide.poetryribbons", true) ? "" : this.getYakuHTML("3 Poetry Ribbons"),
		this.config.get("hide.blueribbons", true) ? "" : this.getYakuHTML("3 Blue Ribbons"),
		this.config.get("hide.drybrights", true) ? "" : this.getYakuHTML("Any 3 Dry Brights"),
		this.config.get("hide.animals", true) ? "" : this.getYakuHTML("Any 5 Animals"),
		this.config.get("hide.ribbons", true) ? "" : this.getYakuHTML("Any 5 Ribbons"),
		this.config.get("hide.plains", true) ? "" : this.getYakuHTML("Any 10 Plains")
	].join("");
	if(yakuHTML.length > 0)
		this.yakuContainer.innerHTML = [
			this.config.get("yaku.right", false) ? "" : "<hr/>",
			"<b>-- Yaku in \"your control\" --</b><br/>",
			yakuHTML
		].join("");

	// put the HTML into the container
	var theirYakuHTML = [
		this.config.get("hide.sacrifice", true) ? "" : this.getTheirYakuHTML("The Sacrifice"),
		this.config.get("hide.loop", true) ? "" : this.getTheirYakuHTML("The Loop"),
		this.config.get("hide.roshambo", true) ? "" : this.getTheirYakuHTML("RoShamBo"),
		this.config.get("hide.poetryribbons", true) ? "" : this.getTheirYakuHTML("3 Poetry Ribbons"),
		this.config.get("hide.blueribbons", true) ? "" : this.getTheirYakuHTML("3 Blue Ribbons"),
		this.config.get("hide.drybrights", true) ? "" : this.getTheirYakuHTML("Any 3 Dry Brights"),
		this.config.get("hide.animals", true) ? "" : this.getTheirYakuHTML("Any 5 Animals"),
		this.config.get("hide.ribbons", true) ? "" : this.getTheirYakuHTML("Any 5 Ribbons"),
		this.config.get("hide.plains", true) ? "" : this.getTheirYakuHTML("Any 10 Plains")
	].join("");
	if(theirYakuHTML.length > 0)
		this.theirYakuContainer.innerHTML = [
			"<hr/><b>-- Yaku in \"their control\" --</b><br/>",
			theirYakuHTML
		].join("");

	// generate HTML for non played cards
	var cardsNotFoundHTML = [];
	for(var i = 0, la = this.cardsNotFound.length; i < la; i++)
		cardsNotFoundHTML.push(this.getCardHTML(this.cardsNotFound[i]));

	// put the HTML into the container
	this.notFoundContainer.innerHTML = [
		"<hr/><b>-- Cards that haven't been revealed yet --</b><br/>",
		cardsNotFoundHTML.join(" ")
	].join("");

	// get the main form
	var snapForfeitForm = document.evaluate(".//form[@name='forfeit']", this.container, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	if(snapForfeitForm.snapshotLength != 1) {
		cAlert("Could not locate the forfeit form!");
		return;
	}

	// add the config button
	insertAfter(this.configButton, snapForfeitForm.snapshotItem(0));
	this.configButton.style.color = "black";
	this.configButton.style.fontSize = "12px";
	this.configButton.href = "javascript:document.getElementById('configWindow').style.display = ''; void(0);";
	this.configButton.innerHTML = "<b>Configure script &gt;</b>";
	insertAfter(document.createElement("br"), snapForfeitForm.snapshotItem(0));

	// add the localStorage API to the page
	this.storageJS = [
		'function Storage(namespace) {',
		'	if (!namespace || (typeof(namespace) != "string" && typeof(namespace) != "number"))',
		'		namespace = "ScriptStorage";',

		'	this.set = function(key, value) {',
		'		try {',
		'			localStorage.setItem(escape(["BvS", namespace, key].join(".")), JSON.stringify(value));',
		'		}',
		'		catch(e) {',
		'		}',
		'	}',

		'	this.get = function(key, defaultValue) {',
		'		try {',
		'			var value = localStorage.getItem(escape(["BvS", namespace, key].join(".")));',
		'			if(value != null) {',
		'				try {',
		'					return JSON.parse(value);',
		'				}',
		'				catch(e) {',
		'					return defaultValue;',
		'				}',
		'			}',
		'			return defaultValue;',
		'		}',
		'		catch(e) {',
		'			return defaultValue;',
		'		}',
		'	}',

		'	this.del = function(key) {',
		'		try {',
		'			localStorage.removeItem(escape(["BvS", namespace, key].join(".")));',
		'		}',
		'		catch(e) {',
		'		}',
		'	}',
		'}',
		'',
		'var hanafudaConfig = new Storage("Hanafuda");'
	].join("\n");
	addJavaScript(this.storageJS);

	// add the config window to the page
	this.configDiv.id = "configWindow";
	this.configDiv.style.display = "none";
	this.configDiv.style.fontFamily = "arial";
	this.configDiv.style.fontSize = "12px";
	this.configDiv.style.position = "fixed";
	this.configDiv.style.right = "0px";
	this.configDiv.style.bottom = "0px";
	this.configDiv.style.backgroundColor = "white";
	this.configDiv.innerHTML = [
		"<span style=\"float: right; cursor: pointer;\" onclick=\"document.getElementById('configWindow').style.display='none';\"><b>Close [X]</b></span><br/>",
		"<table style=\"width: 250px; font-size: 12px;\">",
			"<tr>",
				"<td style=\"width: 200px;\"><b>Key</b></td>",
				"<td style=\"width: 50px;\"><b>Value</b></td>",
			"</tr>",
			"<tr>",
				"<td>Alternate suit colors</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('alt.suit.color', this.checked);\"", this.config.get("alt.suit.color", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Highlight all cards</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('highlight.all', this.checked);\"", this.config.get("highlight.all", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Move yaku cards to the right</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('yaku.right', this.checked);\"", this.config.get("yaku.right", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide all Yaku</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.all', this.checked);\"", this.config.get("hide.all", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide The Sacrifice</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.sacrifice', this.checked);\"", this.config.get("hide.sacrifice", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide The Loop</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.loop', this.checked);\"", this.config.get("hide.loop", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide RoShamBo</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.roshambo', this.checked);\"", this.config.get("hide.roshambo", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide 3 Poetry Ribbons</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.poetryribbons', this.checked);\"", this.config.get("hide.poetryribbons", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide 3 Blue Ribbons</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.blueribbons', this.checked);\"", this.config.get("hide.blueribbons", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Any 3 Dry Brights</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.drybrights', this.checked);\"", this.config.get("hide.drybrights", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide Any 5 Animals</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.animals', this.checked);\"", this.config.get("hide.animals", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide Any 5 Ribbons</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.ribbons', this.checked);\"", this.config.get("hide.ribbons", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
			"<tr>",
				"<td>Hide Any 10 Plains</td>",
				"<td><input type=\"checkbox\" onclick=\"hanafudaConfig.set('hide.plains', this.checked);\"", this.config.get("hide.plains", false) ? " checked=\"checked\"" : "", " /></td>",
			"</tr>",
		"</table>"
	].join("");
	document.body.appendChild(this.configDiv);

	// append click events - hand
	for(var i = 0, hl = this.myHandElements.length; i < hl; i++) {
		if(this.fieldElements.count(this.myHandElements[i]) == 1) {
			for(var j = 0, fl = this.fieldElements.length; j < fl; j++) {
				if(this.myHandElements[i].month == this.fieldElements[j].month) {
					this.myHandElements[i].element.setAttribute("fieldcard", this.fieldElements[j].element.getAttribute("for"));
					this.myHandElements[i].element.addEventListener("click", function() {
						$(this.getAttribute("fieldcard")).click();
					}, false);
					break;
				}
			}
		}
		else if(this.fieldElements.count(this.myHandElements[i]) == 0) {
			for(var j = 0, fl = this.fieldElements.length; j < fl; j++) {
				if("unk" == this.fieldElements[j].month) {
					this.myHandElements[i].element.setAttribute("fieldcard", this.fieldElements[j].element.getAttribute("for"));
					this.myHandElements[i].element.addEventListener("click", function() {
						$(this.getAttribute("fieldcard")).click();
					}, false);
					break;
				}
			}
		}
	}

	// append click events - field
	for(var i = 0, hl = this.fieldElements.length; i < hl; i++) {
		if(this.myHandElements.count(this.fieldElements[i]) == 1) {
			for(var j = 0, fl = this.myHandElements.length; j < fl; j++) {
				if(this.fieldElements[i].month == this.myHandElements[j].month) {
					this.fieldElements[i].element.setAttribute("fieldcard", this.myHandElements[j].element.getAttribute("for"));
					this.fieldElements[i].element.addEventListener("click", function() {
						$(this.getAttribute("fieldcard")).click();
					}, false);
					break;
				}
			}
		}
	}
}

// execute the script
try {
	var hanafudaMain = new HanafudaMain();
}
catch(e) {
	cAlert(e);
}

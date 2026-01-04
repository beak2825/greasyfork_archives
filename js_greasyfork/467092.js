// ==UserScript==
// @name         百年树人网络学习平台-bcvet-简单版
// @namespace    vx:shuake345
// @version      0.1
// @description  自动进课程|自动看完关闭课程|无自动切换功能|代刷vx:shuake345
// @author       vx:shuake345
// @match        *://www.bcvet.cn/web/*
// @match        *://www.bcvet.cn/webv3/*
// @icon         http://www.bcvet.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467092/%E7%99%BE%E5%B9%B4%E6%A0%91%E4%BA%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-bcvet-%E7%AE%80%E5%8D%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/467092/%E7%99%BE%E5%B9%B4%E6%A0%91%E4%BA%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-bcvet-%E7%AE%80%E5%8D%95%E7%89%88.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function gb() {
		window.close()
	}

	function sx() {
		window.location.reload()
	}

	const Tween = {
       Linear: function Linear(e, t, r, n) {
        return r * e / n + t;
       },
       Quad: {
        easeIn: function easeIn(e, t, r, n) {
         return r * (e /= n) * e + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return -r * (e /= n) * (e - 2) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return (e /= n / 2) < 1 ? r / 2 * e * e + t : -r / 2 * (--e * (e - 2) - 1) + t;
        }
       },
       Cubic: {
        easeIn: function easeIn(e, t, r, n) {
         return r * (e /= n) * e * e + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return r * ((e = e / n - 1) * e * e + 1) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return (e /= n / 2) < 1 ? r / 2 * e * e * e + t : r / 2 * ((e -= 2) * e * e + 2) + t;
        }
       },
       Quart: {
        easeIn: function easeIn(e, t, r, n) {
         return r * (e /= n) * e * e * e + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return -r * ((e = e / n - 1) * e * e * e - 1) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return (e /= n / 2) < 1 ? r / 2 * e * e * e * e + t : -r / 2 * ((e -= 2) * e * e * e - 2) + t;
        }
       },
       Quint: {
        easeIn: function easeIn(e, t, r, n) {
         return r * (e /= n) * e * e * e * e + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return r * ((e = e / n - 1) * e * e * e * e + 1) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return (e /= n / 2) < 1 ? r / 2 * e * e * e * e * e + t : r / 2 * ((e -= 2) * e * e * e * e + 2) + t;
        }
       },
       Sine: {
        easeIn: function easeIn(e, t, r, n) {
         return -r * Math.cos(e / n * (Math.PI / 2)) + r + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return r * Math.sin(e / n * (Math.PI / 2)) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return -r / 2 * (Math.cos(Math.PI * e / n) - 1) + t;
        }
       },
       Expo: {
        easeIn: function easeIn(e, t, r, n) {
         return 0 == e ? t : r * Math.pow(2, 10 * (e / n - 1)) + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return e == n ? t + r : r * (1 - Math.pow(2, -10 * e / n)) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return 0 == e ? t : e == n ? t + r : (e /= n / 2) < 1 ? r / 2 * Math.pow(2, 10 * (e - 1)) + t : r / 2 * (2 - Math.pow(2, -10 * --e)) + t;
        }
       },
       Circ: {
        easeIn: function easeIn(e, t, r, n) {
         return -r * (Math.sqrt(1 - (e /= n) * e) - 1) + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return r * Math.sqrt(1 - (e = e / n - 1) * e) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return (e /= n / 2) < 1 ? -r / 2 * (Math.sqrt(1 - e * e) - 1) + t : r / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + t;
        }
       },
       Elastic: {
        easeIn: function easeIn(e, t, r, n, a, o) {
         return 0 == e ? t : 1 == (e /= n) ? t + r : (o || (o = .3 * n), !a || a < Math.abs(r) ? (a = r,
          i = o / 4) : i = o / (2 * Math.PI) * Math.asin(r / a), -a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * n - i) * (2 * Math.PI) / o) + t);
         var i;
        },
        easeOut: function easeOut(e, t, r, n, a, o) {
         return 0 == e ? t : 1 == (e /= n) ? t + r : (o || (o = .3 * n), !a || a < Math.abs(r) ? (a = r,
          i = o / 4) : i = o / (2 * Math.PI) * Math.asin(r / a), a * Math.pow(2, -10 * e) * Math.sin((e * n - i) * (2 * Math.PI) / o) + r + t);
         var i;
        },
        easeInOut: function easeInOut(e, t, r, n, a, o) {
         return 0 == e ? t : 2 == (e /= n / 2) ? t + r : (o || (o = n * (.3 * 1.5)), !a || a < Math.abs(r) ? (a = r,
          i = o / 4) : i = o / (2 * Math.PI) * Math.asin(r / a), e < 1 ? a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * n - i) * (2 * Math.PI) / o) * -.5 + t : a * Math.pow(2, -10 * (e -= 1)) * Math.sin((e * n - i) * (2 * Math.PI) / o) * .5 + r + t);
         var i;
        }
       },
       Back: {
        easeIn: function easeIn(e, t, r, n, a) {
         return null == a && (a = 1.70158), r * (e /= n) * e * ((a + 1) * e - a) + t;
        },
        easeOut: function easeOut(e, t, r, n, a) {
         return null == a && (a = 1.70158), r * ((e = e / n - 1) * e * ((a + 1) * e + a) + 1) + t;
        },
        easeInOut: function easeInOut(e, t, r, n, a) {
         return null == a && (a = 1.70158), (e /= n / 2) < 1 ? r / 2 * (e * e * ((1 + (a *= 1.525)) * e - a)) + t : r / 2 * ((e -= 2) * e * ((1 + (a *= 1.525)) * e + a) + 2) + t;
        }
       },
       Bounce: {
        easeIn: function easeIn(e, t, r, n) {
         return r - Tween.Bounce.easeOut(n - e, 0, r, n) + t;
        },
        easeOut: function easeOut(e, t, r, n) {
         return (e /= n) < 1 / 2.75 ? r * (7.5625 * e * e) + t : e < 2 / 2.75 ? r * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + t : e < 2.5 / 2.75 ? r * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + t : r * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + t;
        },
        easeInOut: function easeInOut(e, t, r, n) {
         return e < n / 2 ? .5 * Tween.Bounce.easeIn(2 * e, 0, r, n) + t : .5 * Tween.Bounce.easeOut(2 * e - n, 0, r, n) + .5 * r + t;
        }
       }
      }

	function Zy() {
		var KC = document.querySelectorAll('div.button___1-Wab')
		for (var i = 0; i < KC.length; i++) {
			if (KC[i].innerText == '学习课程') {
				KC[i].click()
				break;
			}
		}
	}

	function Cy() {
		if (document.querySelectorAll('div.title>span')[0].innerText == '已完成') {
			setTimeout(gb, 2254)
		}
	}

	function Sy() {
		if (document.getElementsByTagName('video').length == 1) {
			if (document.getElementsByTagName('video')[0].volume !== 0) {
				document.getElementsByTagName('video')[0].volume = 0
				document.getElementsByTagName('video')[0].play()
			}
		}
		if (document.getElementById('spanLeavTimes').innerText.search('分钟') < 0) {
			setTimeout(gb, 2254)
		}
		if (document.getElementById('reStartStudy') !== null) {
			setTimeout(sx, 2254)
		}
	}

	function QT() {
		document.getElementsByClassName('titleName')[0].innerText = '代刷VX：shuake345'
		var d1 = document.getElementsByClassName('couInfoWrap')[0];
		var img = document.createElement("img");
		img.style = "width:230px; height:230px;"
		img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
		d1.appendChild(img);
	}
	setTimeout(QT, 2520)

	function Pd() {
		/*if(document.URL.search('video')>2){
        setInterval(Sy,8520)
    }else */
		if (document.URL.search('outCourse') > 2) {
			setInterval(Cy, 5230)
		} else if (document.URL.search('webv3') > 2) {
			setTimeout(Zy, 54)
		}
	}
	setTimeout(Pd, 3254)
    function Reg_Get(HTML, reg) {
      let RegE = new RegExp(reg);
      try {
        return RegE.exec(HTML)[1];
      } catch (e) {
        return "";
      }
    }
    function ACSetValue(key, value) {
      GM_setValue(key, value);
      if(key === 'Config'){
        if (value) localStorage.ACConfig = value;
      }
    }
    function getElementByXpath(e, t, r) {
      r = r || document, t = t || r;
      try {
        return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      } catch (t) {
        return void console.error("无效的xpath");
      }
    }
    function getAllElementsByXpath(xpath, contextNode) {
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      contextNode = contextNode || doc;
      var result = [];
      try {
        var query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < query.snapshotLength; i++) {
          var node = query.snapshotItem(i); //if node is an element node
          if (node.nodeType === 1) result.push(node);
        }
      } catch (err) {
        throw new Error(`Invalid xpath: ${xpath}`);
      } //@ts-ignore
      return result;
    }
function getAllElements(selector) {
      var contextNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;
      var _cplink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
      if (!selector) return []; //@ts-ignore
      contextNode = contextNode || doc;
      if (typeof selector === 'string') {
        if (selector.search(/^css;/i) === 0) {
          return getAllElementsByCSS(selector.slice(4), contextNode);
        } else {
          return getAllElementsByXpath(selector, contextNode, doc);
        }
      } else {
        var query = selector(doc, win, _cplink);
        if (!Array.isArray(query)) {
          throw new Error('Wrong type is returned by getAllElements');
        } else {
          return query;
        }
      }
    }
})();
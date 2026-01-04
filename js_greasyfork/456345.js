/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               Goda漫画下载
// @namespace          http://tampermonkey.net/
// @version            0.1
// @description        打开章节页面，一键下载全部章节
// @author             PY-DNG
// @license            MIT
// @match              http*://cn.godamanga.com/chapterlist/*
// @require            https://greasyfork.org/scripts/456034/code/script.js
// @connect            godamanga.com
// @connect            godamanga.online
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAFJBJREFUeF7tXQ2MHdV1/s6deW//bNexYOUs6+cne712FupaDuLHXhObuBRRmlIKiFB+wq8xCXEsQh2ELMtCYFGLEkIJbaOUQoAUQpFDEEVqhV0wNkEOoggWe1mc9XpZW8Z1F1ivd9+buac6M+9t3j7W9sx7M+/NeN+VLJbdOzP33vPdc84959xzCLU2qVeAJvXsa5NHDQCTHAQ1ANQAMMlXYJJPv8YBagCY5Cswyadf4wA1AEzyFZjk069xgBoAJvkKTPLpn9IcgAEl9N2G5aq545A6NjhoWo2N5jHLcn5fZzU5/5U2ah7Vzg9HGy00DVvNjY36UFezXo5tzu8JcP9+irVTBgBC7K6ODvOLTKbeGjWmENQMRdZMzXQagBYimsfQLQxqJKARQBIgBbACSANsAcgwMEKEIWbuJeD3DHWQCIeJeMCEOXj0KIbwafOIAONUAEWsASBE33Z6R6M5dWSGYSdbATvNoDNJYwETpRncQsAUAPVwucHYjvewkWXHO6AA8DmAfhD2AvwBs+pWmnsV64FjCevwit7eEQ/vi2SXWALgg46O5BefZZotUy1UjIWa6Y+JsADgVgDT3d0dWhthYJCAPgZ2E+N/tKHeUUa2K/PxrCMrsE1AE5sWKwDsamlpHE02tTNTp2IsY2AhgJkApvnc3UERSIgt3EHA8B4IbyjC9lFkeuPCFWIBACH8SLJxIbT6SwIuBDAnt9PNMig5CKAbgLBveY/8E84hIkMAJf/k/72KDdEfjhDQw4z/MJlePtb/1a6oc4TIAiAv3+sa9ULW9s2AWgli2e1CKK9EORE+XtO2Wm0lRg7JaWBUZ1VT0jQta3SKJnO6YpwGxc0A5jJhIZhSOREjwMiPYaJxiO4gekM/M20hQz9Tlzna/fWBgZEoKo2RA4AQ/rdtbVMsCx3E6kpougLkyPYgiD4GCCa8SqZ9w9KPPz50IpTIeH7X0lKvk9OnZe1sO5FazOCvA9SRUzJF5xAlc6ImIqKHgOeJ9K8T2eHdZw8MDJfBtQJ/NFIAEOXuf4cybSbRJcx0JVwZf7zFLWsxvAKg+CMOZ0qnpzVYdSmb9GIidS6DFwNoy4mliYA6RMy7GPQrTfxqZ99HcsSMhF0hMgDYenrHlGSDfTGI/waMTgAzgt71hcQsFQDj3gGona1nTodhL2DmToCXARAwiOgo1k80A4fA9Bob9DMLI29FQVGMBADeOqOtVRvqWibcCEY65GOcQ8MgAJAHQ15fMRoyKYPpHAL9BRMuACBGqOIm+sG7YDyJpP3CyURQWWzOw8NVBcBWLDcTsw4sIuI1AC4+zoJ5mIb/LkECoPDrW9PpelOpZsM2OplpFYDzJgC0sP+DxHgRBh47v7e7u1oioWoAeKutbZqVMS4m8F0AFlVi1wctAk6mPP72jLYWW6mrWOEGYrRPoM+IUWk7sd6cMazXqyESqgKAN+fObWbLuIoYsvPlTB+ohu+FH4TFAYq/LYrt/w1nFpNWN+e4XEvRfDUT3iemzZljxpYVn3YNeRl/UH0qDoC30x0zLW2tZuAWcdIENZES3vMKEvaNlZDBoiO8OWv+TAJfBsINOUWxWEnsJfCmUYteXDHQfbiE+ZT0SEUBIMqerYxVIL4jp+WXNOiAHqoYAPLjdUzZianngXktQBcCLF7JwrYXjMeQtJ+uBDDlwxUDgEN8g+4E6Du5Y1JAdCz5NRUHgIxUFN+G1gMdWmE1g68q2giiHPYB9HjG4n+pBCeoCABE5iNj3gni2yJCfKFFVQAgHxaR8FZ6QUqzvpUZN5Hr0Mo3DaZ+VrzZTOinzuvpEWdTaC10AGxtaT8tmeDbwSQK30Tn4tAmd5IXVw0A+XFtTaenJ+3kNSCsnUAZHiDwxqR19OkwzcehAkCse4n67LVEdC8AsedHqVUdAI5IkDVqtK4m4G64R8XC1sPE67L7zngpLK9iaAAQNrdzVvu3mLAJkGCNyLVIACAPgrqG7DUM2jDByehtVnrN0t6et8MwFoUGgDdnfe0skP04gCXVOOd7gFtkACBjFcOYzqg7GI44EF9CvlkEvGjbav2yT3ZL/EKgLRQAyFk/q62NAETjDzM8q5zFiBQAZCLbZ81vIdJrALo9F5CSn98REP6R7MRDS/o/OFLOpIufDRwAYgtPcPIWYqyPkMY/0ZpFDgCO2GydO0crYz0BckTMu8ItYt4OpnXn93fvClIUBAoAOePWtR5YqQ1+kBhnRZT158EQOQDIwAQEO9LzFjLTJhK3ONMRKH6ZNT3xlanGe2d2dYk3MbAWKADeSM2bQ6ANRegNbLABvyiSAJA5iv/gs6HsRRr4pgSamgn+r7DsAYEBQMycGbPp2uNosgHTLpDXRRYAzskgna5vMM3kuT09Q0Gy/FB0ACeOr3X+WbbihwEsjzjrj7QICATaPl4SCAcQtNbp5A8YEIOPhFXHoUWaA1RqAQMBwOuptg4D9BxAovjFpPFLSOhbK+V1i+qilA0A0fyTsw5sAPGPJgiEjOq8xQ+6JZPFrZXwuEV3EQJwB79xxoJ2MvWviJ0Q7vi0GgAcWpXFAZzdn/rkDkBtmiC4IdpgqAGgfAC8MWdOSlmm2PslorficX1lIawGgPIA4MS5zZ53GWn1MIhTZRGjGg/XAFAeACSYoc5O3sdEN8WO/bvCr6YElqMD7JzdtlizeiTC7t4T85UaAErnAI7TJzVwDQP3RzDSx5tAqQGgdADsaD1zhibrHiLcEUv2XxMBY5ukpGOgnP2VoR8CcKm37RbBXjUOUBoHcEKaU/Mu1KBHIxrr5w1tNQCUBgDnrttR63piPBiB2z3eiD1RrxoASgOAE8vOyfVgfD9Wtv9iENQAUBoAJHBRgR9lwuWlb78IPFkDQGkA2JFuX8A2ngA5iQ/i22oA8A8AUQC3p9qXKKZnYmn+LYCrZOcYtbGq5g72sYdz99wvJeIncxmxfDwdta78Qsai1TUA+KCLE7Kcmn8NwD8LK32bj+GU2bUGANce5qO50T8D3wc5R8By0rT6+GpYXWsA8A0AsQEMDmXvA+iHsfP/fwlHwQIgn0CyCY0TJrbMGqPjEkNmjhkTJoqsU4kv/X6smEXBHBpM80v9jn2W1FLswk+yKV8cwAWAJRZAye8TrwCQkAHgZD3LqqugaYWzs4gdAnEuI+i42H52/waSQhVjbexncgpYSC7DXD/pqt3Mojz+GTC0W9Ek93vW9N+d+/e85JVv+gKAc+/Prvs5EV/j9QPR7RcsB3CyoGQN8Y7eNBFRT7AOXlPGeurHTP/QuX/P3V7X3TcA6uzkM7E3AjmrEwoARDeSG9FVbPSTpX17JBuLp1YDQEAp2XIcYBIAQCefZPfqcsxbsBxAYiSYrLUgfZkjk52CVO5tX1feF+hMPPZzoR7l/szucyApZjXWxr/LPb7J70ThlJtYY30Z/OPOvo8kyYSn5psDJHVSooCrzOY8ze0knYIFgHOj9/PRFIxEs81aKWalDcP5r2LtEEgzK2JDaUN+x0qzUsqpWgZoJX9TSgBD0k+x8yjl/g4i59it4T7LTCYTziXg6nFJOAgPLN3XLVf0PDVfAHBcwUPZBwkknsDaKcDTEn+50xhX8PG81D4c1z3daybsxHeISOIy81lYNIHuWtK358deX+0LAG5274G/JYKkf6kZgryucgj93BwC9h0M3lxAC4uIb1iy76NnvX7SNwDqZh+4nplFDEQ194/HuQcrAjx+NLBuLje2fkSAZBbLc4cREP350n17XvP6IV8AyPkCLgf4iRhdAz/OWsQbAE7eYXOKsH8xyuXbIDP9aef+PbtCA4DEA9qgXxSlN/X6vaj0k7KvL4xa+G5cvYFy6gBl/p2JJCGH25j6iK1vLun/uMfrQvviAPLSN9PzFjHTk7G7DTx+RWIPgJ3pBWmt9X/milXlZ7cDCfuv/OQ88A2Agguhl3hFWQT7xR4AO2YvWMKsf1MYmMtMz9bbX9zqJ7ewbwA4yZ9N50ZQnB1CsQfA9tntkotRlPH8aUyyjD8wfapxn59Ucr4B4GYDm3obg++LsSIYawA4cRmzBx4By82sAgUQtGpp354X/GQV8w2AXKWvSwh4NMZxgbEGgJtSln8N4OwCAOxmpuv8nADkWd8AyCuC0I4FSmrjxbHFGgBvzpp3ARM9N+4kRtiiDWvNsr17+/wQpCQA5JJBiwgQn0AcLYKxBUDuZvYP2TUA5aOPpDD136mkfshvRtGSACCBIUmduA0gSQgdpSogXsEfWwDkMoo/DpBczM1bAPsBWpvp++oWv4UlSgKAIwZmz7+QwQ/H1B4QWwDsTM1bqUGi/UuxammamF9XrNac17/nPa87IN+vZACIGMjY9kNEfEUM/QKxBIBTXqbBupeA7/3hBEbDzPipYnNTKbUESgaAexr45BYiEs9gYYULvyCsRv9YAiCXlkfyMUt19Tz7L6uuUMkAEKq91Tp/oa2cSyJyHIlTfEDsACD2l5HElJuKCnFYAL9CWt/lx/5fuOPKAoDrkWraANAPYiYGYgcA51Ku5gcBEhN8/uR1BIz7M0bmp37uAgQGAHnRG6n2TgX8MmbJomIFAOfUZSeuZqJNBWd/CRN/R5Fedf6+nndKlaNlcQD5aM4v/U8Ari11EFV4ToPwfCaLO+PgDs55/uRCjuz+vKjNMPD3WZXZWOruL9kSWEywCS1TVaCqj09qZvo3xeadpWjOPr5TdteC0K9i38tusHHl0v0fvl/OR8rmAI4y2NY2zc4oiU2TWzFxsAwK+3yWdGJN1AHg1l+0fllUi0F2//3ZvpYH/Bp+isESCACcULHZ85eD9SMxKRoRCwA4+Zh03UaAxetXuLF22dA3XNDX01XO7g9MBMiL3CLRWAt2jBTTyh1YyM9HHgDORdwvrMtBEM5aWHf5CMAbMyr7z+XI/rItgcUEcosetp/NyqkVHPXCUZEGgJOLcXbbIpvVg+SuZX73W8R4CWyvK/XcH4oIyL/UMVYYTdcTOU6ilpB3cTmvjzQAHIeP4nvBuH5c0A2hm8H3fKUp8bKfqJ8TLVQgOkDhB0QU1BnYwOS4iqNaQSyyAHDzMGdvJ3KKSBd6Wg8z4+Gsa/QZLAf9gRqCJhqImIgtxQ8RcGFETcSRBIA4e5L12SvgctA5BWs7IvUNyLbXB8X6A9cBxnEBx1F04BIilqihdFBoDfA9kQOAE+gxa+BSJifQQwpw5Q0+MtZdILpnyb492/zE+3lZr8BFQKE+MGpO/R7A6yKYUzhSABDim6mB8xQgGdiLHWsDAK3LqNEXgtD6Q1UCi1/uRq9gHcBiIIqSPhAZADg7f/bBczTrjUUavyzn5yDebCT4J35Dvbzs/kDtABN90DkaptvbmbEBDEmcMGEGLa+DDbBfJACQ3/lywZPcANuCC7c0DOJ/TZB53zm9XQcDnPu4V4UmAvJf+UNhab0eUJdEpMJI1QHgms+Ni3IicnGRsvw5gOeVUvef37u7Nyzih84B8gN3oofS/WeTpnsAtTICIKgqACSfEGfU5UT4LkAdxcRnYAuxsXnJ/g+7glb6KqoDFJ8MRNYx9N1gx61ZzfwCVQGAY+FLL0hpm28GcD2IxcRbGEklO/9FQ9PD5/bveT9s4leMAxRygvrZ/Qs1k0QRXVRFnaDiAJCgjjquX8ysbwUcfWj6+N1IwwQ8ZcF+dFlfz+5KEL/iAJAPOp7D9LyFrGktwSk6UY3TgWbgaaUTa8N2BzvznTv3NLaMbxHjRoAWTSACB4nxtJ2wNnfu3dtfKeJXBQB5EGxPzUsrYBVAYjIWk2clg0qFAzxFOnFXmABwMqvCXAStVpNbX7l4nnKjtx+ExxLKeCpMbf94imTop4ATabDi705w8gpiWg3wWRXUC0IDgJM0+vSOxmQ9p6Hsb4MhaXWltnIRwGkY4F0APZo5Zry64tOuoTC1/UgCQAYlu6ReJzq1yw1WVqgQReAAyGcLT9h1bQS+AIS/BiDHuy/ZPhg4SMyvkDJ+/kdNaldQnr1SAFRVDlBoK9jZOncOG8aNYEcvEEdImKeEwADg3NWfu38GMiLbjWUgFv+9cLMiJc+ZbQZAlyTZ0qa9pdLyfiKARAIAY6cE15XcCcK32fUkhnXxtCwAOMattrYpmQxaTaizmfkbIJwDkLD6calbc3MTpfOQ7HqAn8uMJHdUi+VXzQ7glT3lU65qUiuJ6LqccyRobuAbAHkW32DVpbQBIfr54rVjIEXubj+emXsIoB0AfmHY9rZjn7QeLDeQ0+taeukXKQ5QOOA8EFiZlwP6OkDNAVgWOYjTgnMMpIR99/S6urHgikPDwwpHG000DZtS+cOyRqfYyphJhAUEfA2MRQDac+w9P5aJxqMBGgH4XQI/aZv2qzPq6w9WU9ZHVgk8GUrzDiVoXAbmP9NEQowZAegI74LpZSI+qiV7N8EkcBNA8u4WJrQSO8GtsruFrXsJdx8BcBigLib+jWnpLed+0jNQyXP9ydYz8iLgeBMQjnDkM50mU19AjG8AvOgEMtfrOhRW4SiVs1iO2xbYC+BdIt5KZOwY6Z3ZHyVWH1sOUDzwXJKqZoN0h5bqpYw/IVAHu0GosmNLJaRX0Eg/IfogEwag6X0C/04T3lYJuzvz8awjcSB8frKR1QFORo28wcVsyDZDGSll6w6R00xYCKY0iPOsOwhACMHFUDMIUDeI32fgQ9LcrRN2b8PIyGE/yRlPNrdK/j22AChcpJyGnqyzmhpttk+DoZsVKA3GfNfjRi0ApxiYTq62bsKp6FFYlUMqdbEQWsTCMJPIcgyQ5gEo/J5ZdUPZfazpkKWyRwCMLO/tzURZvnsB0ikBgOKJ5gsydHV0mKLZN5hmEscwLWNgWoJQbxOSZFMyX9FDS8k1rS1S2iLQiPzTNn1u1tlDU5NJUezQ0dUl4JC8ep6qd3lZ/Cj0OSUBEIWFjcsYagCIC6VCGmcNACEtbFxeWwNAXCgV0jhrAAhpYePy2hoA4kKpkMZZA0BICxuX19YAEBdKhTTOGgBCWti4vLYGgLhQKqRx1gAQ0sLG5bX/D+OJ8/m7Dr1lAAAAAElFTkSuQmCC
// @grant              GM_registerMenuCommand
// @grant              GM_xmlhttpRequest
// @grant              GM_download
// @downloadURL https://update.greasyfork.org/scripts/456345/Goda%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/456345/Goda%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	// Constances
	const CONST = {
		TextAllLang: {
			DEFAULT: 'zh-CN',
			'zh-CN': {
				DownloadAllChapters: '下载全部章节',
				FolderName: 'Goda漫画下载',
				DownloadFullName: '{FolderName}/{MangaName}/{ChapterName}/{ImageName}',
				ChapterFolderName: '{Number} - {Name}',
				ImageFileName: '{Number}.{Ext}'
			}
		}
	};

	// Init language
	const i18n = !Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

	main();
	function main() {
		GMXHRHook();
		GM_registerMenuCommand(CONST.Text.DownloadAllChapters, downloadAll);
	}

	function downloadAll() {
		const mangaName = $('header nav.ct-breadcrumbs a[href*="{URL}"] span'.replace('{URL}', $('.chapter_list_title').pathname)).innerText;
		const chapter_links = [...$All('ul.main.version-chaps a')].map(a => a.href).reverse();
		const len = chapter_links.length.toString().length;
		chapter_links.forEach((url, i) => downloadChapter(url, mangaName, fillNum(i+1, len)));
	}

	function downloadChapter(url, mangaName, chapterNo) {
		getDocument(url, function(oDom) {
			const chapterName = $(oDom, 'header nav.ct-breadcrumbs .last-item').innerText;
			const urls = [...$All(arguments[0], 'img[src*="/scomic/"]')].map(img => img.src);
			const len = urls.length.toString().length;
			urls.forEach((img_url, i) => downloadImage(img_url, mangaName, chapterName, chapterNo, fillNum(i+1, len)));
		});
	}

	function downloadImage(url, mangaName, title, chapterNo, imageNo, retry=3, err=null) {
		if (retry <= 0) {
			DoLog(LogLevel.Error, ['downloadImage: GM_xmlhttpRequest error(max retry reached)', err], true);
			return;
		}
		GM_xmlhttpRequest({
			url: url,
			responseType: 'blob',
			timeout: 20000,
			ontimeout: err => downloadImage(url, title, chapterNo, imageNo, retry-1, err),
			onerror: err => downloadImage(url, title, chapterNo, imageNo, retry-1, err),
			onload: (response) => {
				const blob = response.response;
				const dataUrl = URL.createObjectURL(blob);
				const ext = getExtname(blob.type.split(';')[0]) || 'unkown_filetype.jpg';
				const Text = CONST.Text;
				GM_download({
					name: replaceText(Text.DownloadFullName, {
						'{FolderName}': Text.FolderName,
						'{MangaName}': mangaName,
						'{ChapterName}': replaceText(Text.ChapterFolderName, {'{Number}' : chapterNo, '{Name}': title}),
						'{ImageName}': replaceText(Text.ImageFileName, {'{Number}': imageNo, '{Ext}': ext}),
					}),
					url: dataUrl
				})
			}
		});

		function getExtname(...args) {
			const map = {
				'image/png': 'png',
				'image/jpg': 'jpg',
				'image/gif': 'gif',
				'image/bmp': 'bmp',
				'image/jpeg': 'jpeg',
				'image/webp': 'webp',
				'image/tiff': 'tiff',
				'image/vnd.microsoft.icon': 'ico',
			};
			return map[args.find(a => map[a])];
		}
	}

	function fillNum(num, len) {
		const str = num.toString();
		return '0'.repeat(len-str.length) + str;
	}

	// Download and parse a url page into a html document(dom).
    // when xhr onload: callback.apply([dom, args])
    function getDocument(url, callback, args=[]) {
        GM_xmlhttpRequest({
            method       : 'GET',
            url          : url,
            responseType : 'blob',
			timeout      : 15 * 1000,
            onload       : function(response) {
                const htmlblob = response.response;
				parseDocument(htmlblob, callback, args);
            },
			onerror      : reqerror,
			ontimeout    : reqerror
        });

		function reqerror(e) {
			DoLog(LogLevel.Error, 'getDocument: Request Error');
			DoLog(LogLevel.Error, e);
			throw new Error('getDocument: Request Error')
		}
    }

	function parseDocument(htmlblob, callback, args=[]) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const htmlText = reader.result;
			const dom = new DOMParser().parseFromString(htmlText, 'text/html');
			args = [dom].concat(args);
			callback.apply(null, args);
			//callback(dom, htmlText);
		}
		const charset = document.characterSet;
		reader.readAsText(htmlblob, charset);
	}

	// GM_XHR HOOK: The number of running GM_XHRs in a time must under maxXHR
	// Returns the abort function to stop the request anyway(no matter it's still waiting, or requesting)
	// (If the request is invalid, such as url === '', will return false and will NOT make this request)
	// If the abort function called on a request that is not running(still waiting or finished), there will be NO onabort event
	// Requires: function delItem(){...} & function uniqueIDMaker(){...}
	function GMXHRHook(maxXHR=5) {
		const GM_XHR = GM_xmlhttpRequest;
		const getID = uniqueIDMaker();
		let todoList = [], ongoingList = [];
		GM_xmlhttpRequest = safeGMxhr;

		function safeGMxhr() {
			// Get an id for this request, arrange a request object for it.
			const id = getID();
			const request = {id: id, args: arguments, aborter: null};

			// Deal onload function first
			dealEndingEvents(request);

			/* DO NOT DO THIS! KEEP ITS ORIGINAL PROPERTIES!
			// Stop invalid requests
			if (!validCheck(request)) {
				return false;
			}
			*/

			// Judge if we could start the request now or later?
			todoList.push(request);
			checkXHR();
			return makeAbortFunc(id);

			// Decrease activeXHRCount while GM_XHR onload;
			function dealEndingEvents(request) {
				const e = request.args[0];

				// onload event
				const oriOnload = e.onload;
				e.onload = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnload ? oriOnload.apply(null, arguments) : function() {};
				}

				// onerror event
				const oriOnerror = e.onerror;
				e.onerror = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnerror ? oriOnerror.apply(null, arguments) : function() {};
				}

				// ontimeout event
				const oriOntimeout = e.ontimeout;
				e.ontimeout = function() {
					reqFinish(request.id);
					checkXHR();
					oriOntimeout ? oriOntimeout.apply(null, arguments) : function() {};
				}

				// onabort event
				const oriOnabort = e.onabort;
				e.onabort = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnabort ? oriOnabort.apply(null, arguments) : function() {};
				}
			}

			// Check if the request is invalid
			function validCheck(request) {
				const e = request.args[0];

				if (!e.url) {
					return false;
				}

				return true;
			}

			// Call a XHR from todoList and push the request object to ongoingList if called
			function checkXHR() {
				if (ongoingList.length >= maxXHR) {return false;};
				if (todoList.length === 0) {return false;};
				const req = todoList.shift();
				const reqArgs = req.args;
				const aborter = GM_XHR.apply(null, reqArgs);
				req.aborter = aborter;
				ongoingList.push(req);
				return req;
			}

			// Make a function that aborts a certain request
			function makeAbortFunc(id) {
				return function() {
					let i;

					// Check if the request haven't been called
					for (i = 0; i < todoList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: haven't been called
							delItem(todoList, i);
							return true;
						}
					}

					// Check if the request is running now
					for (i = 0; i < ongoingList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: running now
							req.aborter();
							reqFinish(id);
							checkXHR();
						}
					}

					// Oh no, this request is already finished...
					return false;
				}
			}

			// Remove a certain request from ongoingList
			function reqFinish(id) {
				let i;
				for (i = 0; i < ongoingList.length; i++) {
					const req = ongoingList[i];
					if (req.id === id) {
						ongoingList = delItem(ongoingList, i);
						return true;
					}
				}
				return false;
			}
		}
	}

	// Makes a function that returns a unique ID number each time
	function uniqueIDMaker() {
		let id = 0;
		return makeID;
		function makeID() {
			id++;
			return id;
		}
	}

	// Del a item from an array using its index. Returns the array but can NOT modify the original array directly!!
	function delItem(arr, delIndex) {
		arr = arr.slice(0, delIndex).concat(arr.slice(delIndex+1));
		return arr;
	}
})();
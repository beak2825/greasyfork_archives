// ==UserScript==
// @name           hwmBattleLinks
// @author         Tamozhnya1
// @namespace      Tamozhnya1
// @description    Быстрые ссылки на итоги боя; начало, конец, чат боя
// @version        4.9
// @encoding 	   utf-8
// @include        https://*.heroeswm.ru/*
// @include        https://*.lordswm.com/*
// @include        https://*hwmguide.ru/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @exclude        */auction.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant 		   GM.xmlHttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/481245/hwmBattleLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/481245/hwmBattleLinks.meta.js
// ==/UserScript==

const isEn = document.documentElement.lang == "en";

main();
function main() {
    addStyle(`span.undecorated> a { text-decoration: none; }`);
    addStyle(`span.undecorated> a > span { rotate: 0.5 1 0 180deg; display: inline-block; }`);
    processWarReferences();
    if(location.pathname == "/pl_warlog.php") {
        const hwm_no_zoom = document.querySelector("div#hwm_no_zoom");
        if(hwm_no_zoom) {
            observe(hwm_no_zoom, processWarReferences);
        }
    }
}
function processWarReferences() {
    const warRefs = Array.from(document.querySelectorAll("a[href*='warid=']:not(:has(+span[name=battleLinksSpan])):not([name=battleLink])")).filter(x => !getUrlParamValue(x.href, "show_enemy"));
    //console.log(`processWarReferences warRefs: ${warRefs.length}`);
    //console.log(warRefs);
    for(const warRef of warRefs) {
        const warId = getUrlParamValue(warRef.href, "warid");
        const show = getUrlParamValue(warRef.href, "show");
        const showForAll = getUrlParamValue(warRef.href, "show_for_all");
        const showForAllSnippet = (showForAll || show) ? `&show_for_all=${(showForAll || show)}` : "";
        const battleLinksSpan = addElement('span', { name: "battleLinksSpan", class: "undecorated" }, warRef, "afterend");
        battleLinksSpan.innerHTML = `&nbsp;[<a name=battleLink href="/war.php?warid=${warId}&lt=-1${showForAllSnippet}" title="${isEn ? "War begin reference" : "Ссылка на начало боя"}" target="_blank"><span>&#128299;</span></a><a
        name=battleLink href="/battlechat.php?warid=${warId}${showForAllSnippet}" title="${isEn ? "War chat reference" : "Ссылка на чат боя"}" target="_blank">&#128488;</a><a
        name=battleLink href="/war.php?warid=${warId}${showForAllSnippet}" title="${isEn ? "War end reference" : "Ссылка на конец бой"}" target="_blank">&#127937;</a><a
        name=battleLink href="/battle.php?warid=${warId}&lastturn=-3${showForAllSnippet}" title="${isEn ? "War log end reference" : "Ссылка на конец лога боя"}" target="_blank">&#13266;</a>]`;
        warRef.addEventListener("click", function(e) { e.preventDefault(); showBattleResult(this); });
    }
}
async function showBattleResult(warRef) {
    const warId = getUrlParamValue(warRef.href, "warid");
    const show = getUrlParamValue(warRef.href, "show");
    const showForAll = getUrlParamValue(warRef.href, "show_for_all");
    const showForAllSnippet = (showForAll || show) ? `&show_for_all=${(showForAll || show)}` : "";
    let battleContainer = document.getElementById(`battleContainer${warId}`);
    const isShown = battleContainer && battleContainer.style.display == "flex";
    Array.from(document.querySelectorAll("div[id^='battleContainer']")).forEach(x => { x.style.display = "none"; });
    if(battleContainer) {
        if(!isShown) {
            battleContainer.style.display = "flex";
        }
        return;
    }
    const warRefRect = warRef.getBoundingClientRect();
    battleContainer = addElement("div", { id: `battleContainer${warId}`, style: `position: absolute; left: ${warRefRect.left + window.scrollX + 10}px; top: ${warRefRect.bottom + window.scrollY + 1}px; border: 2px solid #000000; padding: 0; z-index: 3; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); display: flex;` }, document.body);
	const battleResultContainer = addElement("div", { innerHTML: getWheelImage(), style: "text-align: center;" }, battleContainer);
    const divClose = addElement("div", { title: isEn ? "Close" : "Закрыть", innerText: "x", style: "border: 1px solid #abc; flex-basis: 15px; height: 15px; text-align: center; cursor: pointer;" }, battleContainer);
    divClose.addEventListener("click", function() { battleContainer.style.display = "none"; }, false);

    const responseText = await getRequestText(`/battle.php?warid=${warId}&lastturn=-2${showForAllSnippet}`, "text/html; charset=UTF-8");
    const battleResultsStartIndex = responseText.indexOf("<font");
	if(battleResultsStartIndex == -1) {
		battleResultContainer.innerHTML = `<br>${isEn ? "Parse error." : "Результаты боя не найдены."}`;
		return;
	}
    const battleResults = responseText.substring(battleResultsStartIndex);
    const battleResultsParts = battleResults.split("|#", 2);
    let battleResult = battleResultsParts[0];
    if(isEn && battleResultsParts.length > 1 && battleResultsParts[1].startsWith("f_en")) {
        battleResult = battleResultsParts[1].substring(4);
    }
	battleResult = battleResult.replace(/ size="18"/g, '').replace(/font color="/g, 'font style="color: ');

	const battleResultParts = battleResult.split("<br />");
    const regexp_exp = isEn ? /([\d\,]+) exp/ : /([\d\,]+) опыт/;
    const regexp_skill = isEn ? /(\d*\.?\d+) skill/ : /(\d*\.?\d+) умени/;
    let i = 0;
	for(const battleResultPart of battleResultParts) {
        const exp1 = regexp_exp.exec(battleResultPart);
		if(exp1) {
			const skillNumber = parseFloat(regexp_skill.exec(battleResultPart)[1]);
			if(skillNumber > 0) {
                battleResultParts[i] = `${battleResultPart} <span title="${isEn ? "Experience number per skill point" : "Количество опыта на одно очко умения"}">(${Math.round(parseFloat(exp1[1].replaceAll(",", "")) / skillNumber)})</span>`;
			}
		}
        i++;
	}
	battleResultContainer.innerHTML = battleResultParts.join("<br />");
}
function getWheelImage() { return '<img border="0" align="absmiddle" height="11" src="https://dcdn.heroeswm.ru/css/loading.gif">'; }
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function addStyle(css) { addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
// MutationObserver
function observe(targets, handler, config = { childList: true, subtree: true }) {
    targets = Array.isArray(targets) ? targets : [targets];
    targets = targets.map(x => { if(typeof x === 'function') { return x(document); } return x; }); // Можем передавать не элементы, а их селекторы
    const ob = new MutationObserver(async function(mut, observer) {
        //console.log(`Mutation start`);
        observer.disconnect();
        if(handler.constructor.name === 'AsyncFunction') {
            await handler();
        } else {
            handler();
        }
        for(const target of targets) {
            if(target) {
                observer.observe(target, config);
            }
        }
    });
    for(const target of targets) {
        if(target) {
            ob.observe(target, config);
        }
    }
}

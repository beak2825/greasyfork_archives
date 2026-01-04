// ==UserScript==
// @name         GitHub Remark
// @namespace    https://greasyfork.org/zh-CN/scripts/443857-github-remark
// @version      0.1.0
// @description  GitHub remark
// @author       Dorad
// @license      MIT License
// @match        https://github.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @grant        GM_downlaod
// @grant        GM_xmlhttpRequest
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5klEQVRYR+2Xu49NURTGjZEomdC7iNZby8XUjKg9ghoRrQRRegStx4yaQSdB0CIepUe4/ANoROn7TfaSdfbZj3vGTCFxki/3zN5r7f2t95mRBfnnvbaWC/eEy8Lbgmxqa6kWdwnHhI3CAeFWLDiSObSn9Q/CIrd/U+8nhCXC+oBY/Y0WwDrhorDaCVzX+5FhCfQl+KSjxTXxxxIY/2cIEIKPwmjNrA77nUJADF9GOdDhrqToN62SjAO/m0tCKmDN396Y0G/lQYrAfilOzcPlduSGUCkzf6cI3Nb63nkkcEFnn7TzUwReaHNzRIC43Re+J4it0NqXDOF9Wl8V7TXCkCLwSwqLnZI1oNTlwzjqmoQOO8EqAZ+An50F5MbpgFZLdRdQQTeCVw4Frz3X75YgUyXwSII7g7D1757+9q15LBMO1B4K1vGYA1cEn9hVAt5l26X8NDqAS5KDJZD2IbTL+tqz1l5NQs92Qook326BqWiPrbulP681AkcledWkU0nIGMXdjGJj69dIxpWFEHgPmqe8UegOSgTYY45jMZdRRvySXHuEu0Lp2wCyWPlD4DuCx0q7NQ9yrRil8wLz/7VAUs62DE9J92w4Z0d8TokAJLYJlBRZT3uerFgfDJ75wYvHBRL5UiDRMiImANuF4SLf3SByUKCPEwq+enIeoTMS52cC4SKUuU7ZmgUcTufrBeapWCNDeS3z5rp3q/3MdnO5VAVfJZqK/TCjupHpJSa5HLDEeSVl2imewLX0A+JJmOwZhD1/VqPWZ0PA131KnxnxKXiIJHsgMMAoMwYPBpwbJgalKiDW00I8TjmXHOAhRJ4AHZKkmxMCZsBWvZD9PBAmBDkCkKHnzykB78l+uOA/gTvyBIka54CFoDFyS8lYa8Wxrk06yoySjAlQ//xDQ+fbJFTnRxcCWMVwmhTOCO+EnwKXQowvaapgbZCjTCFRfLoQwOVmEZOSzy7mPU2KPQhCwFq0l8+S+A28A6wh+zYOCgAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/443857/GitHub%20Remark.user.js
// @updateURL https://update.greasyfork.org/scripts/443857/GitHub%20Remark.meta.js
// ==/UserScript==

const key = 'GithubRemark-cache';
const defaultRemark = 'unset';

/**
 * API for cache data.
 */

function updateRemark(userToken, username, remark) {
    let cache = JSON.parse(localStorage.getItem(key));
	if(!cache){
		cache=[];
	}
	const matchedItemIdx = cache.findIndex(e => e.username==username && e.userToken==userToken)
    if(matchedItemIdx>-1){
        // 已存在
        cache[matchedItemIdx].remark = remark;
        cache[matchedItemIdx].updatedAt = new Date().getTime() / 1000
    }else{
        const item={
            userToken:userToken,
            username:username,
            remark:remark,
            updatedAt: new Date().getTime() / 1000
        }
		cache.push(item);
    }
	console.log(cache);
	localStorage.setItem(key, JSON.stringify(cache));
    // showRemarks(userToken);
}

function getRemark(userToken, username, callback) {
    let cache = JSON.parse(localStorage.getItem(key));
	if(!cache){
		callback(defaultRemark);
		return
	}
    const item = cache.find(e => e.username==username && e.userToken==userToken)
    if(item){
        callback(item.remark);
    }else{
        callback(defaultRemark);
    }
}

/**
 * 
 * page functions
 */

function getGithubLoginUsername() {
	var doc = document.querySelector("head > meta[name*='login']");
	return doc == null ? null : doc.content;
}

function hasLoginFrame() {
	var loginBtn = document.querySelector('div.HeaderMenu a[href*=login]');
	return loginBtn != null;
}

function getMasterOfPage(url) {
	var master = /github.com\/([^\/|^\?]+)/.exec(url);
	if (master !== null)
		master = master[1];
	return master;
}

function getCurrentTab() {
	var homepage = /github.com\/$/.exec(location.href);
	if (homepage !== null)
		return 'homepage';
	var tab = /[\?|\&]tab=([^\&]+)/.exec(location.href);
	if (tab !== null)
		tab = tab[1];
    if(/https:\/\/github.com\/orgs\/([\S\s]+)\/people/.exec(location.href))
        tab = 'orgs-people';
    if(/https:\/\/github.com\/orgs\/([\S\s]+)\/members/.exec(location.href))
        tab = 'orgs-members';
	return tab;
}

function insertAfter(newEl, targetEl) {
	var parentEl = targetEl.parentNode;
	if (parentEl.lastChild == targetEl) {
		parentEl.appendChild(newEl);
	} else {
		parentEl.insertBefore(newEl, targetEl.nextSibling);
	}
}

function generateRemarkSpan(className, userToken, username, remark){
    var span = document.createElement('span');
	span.className = className;
	span.textContent = '('+remark+')';
	span.title = '('+remark+')';
    span.addEventListener('dblclick', function (event) {
        console.log(event);
        const newRemark = changeRemarks(userToken, username, remark);
        if(newRemark!==remark){
            span.replaceWith(generateRemarkSpan(
                className,userToken, username,newRemark
            ));
        }
    }, false);
    return span;
}

function clearRemarkOfCurrentNode(div){
    if (!!div.querySelector('span.github-remarks'))
        div.removeChild(div.querySelector('span.github-remarks'));
}

/**
 * 
 * Show remark functions, adapted for each page
 */

function showRemarkInHomepage(userToken) {
	var news = document.querySelector("#dashboard > div.news");
	var userCount = document.querySelectorAll("div.flex-items-baseline > div > a[data-hovercard-type=user]").length;
	var observer = new MutationObserver(function (mutations, self) {
		var users = document.querySelectorAll("div.flex-items-baseline > div > a[data-hovercard-type=user]");
		if (userCount != users.length) {
			userCount = users.length
			users.forEach(function (element) {
                clearRemarkOfCurrentNode(element.parentNode);
				var username = getMasterOfPage(element.href);
				getRemark(userToken, username, function (remark) {
                    var remarkEl = generateRemarkSpan('link-gray pl-1 github-remarks', userToken, username, remark);
					insertAfter(remarkEl, element);
				});
			}, this);
		}
	});
	observer.observe(news, { childList: true, subtree: true });
}

function showRemarkInLeftPannel(userToken) {
	var vcard = document.querySelector('h1.vcard-names');//author in home page
	if (!!vcard) {
		if (vcard.childElementCount > 2)
			vcard.removeChild(vcard.querySelector('span.github-remarks'));
		var username = getMasterOfPage(location.href);
		getRemark(userToken, username, function (remark) {
			vcard.appendChild(generateRemarkSpan('vcard-username d-block github-remarks', userToken, username, remark));
		});
	}
}

function showRemarkInStarsTab(userToken) {
	var stars = document.querySelectorAll('div > h3 > a');//in star page
	if (stars !== null) {
		stars.forEach(function (element) {
            clearRemarkOfCurrentNode(element.parentNode);
			if (!!element.querySelector('span.text-normal')) {
				var text = element.querySelector('span.text-normal').textContent;
				var username = text.substring(0, text.indexOf(' /'));
				getRemark(userToken, username, function (remark) {
					insertAfter(generateRemarkSpan('link-gray pl-1 github-remarks', userToken, username, remark), element);
				});
			}
		}, this);
	}
}

function showRemarkInFollowersTab(userToken) {
	var followers = document.querySelectorAll('div.d-table > div:nth-child(2) > a');//in followers/following page
	if (!!followers) {
		followers.forEach(function (element) {
			clearRemarkOfCurrentNode(element.parentNode);
			var username = element.querySelector('span:last-child').textContent;
			getRemark(userToken, username, function (remark) {
				insertAfter(generateRemarkSpan('link-gray pl-1 github-remarks', userToken, username, remark), element);
			});
		}, this);
	}
}

function showRemarkInRepoStargazersPage(userToken) {
	var stargazers = document.querySelectorAll('div > h3 > span');
	if (!!stargazers) {
		stargazers.forEach(function (element) {
            clearRemarkOfCurrentNode(element.parentNode);
            var a = element.querySelector('a');
			var username = getMasterOfPage(a.href);
			getRemark(userToken, username, function (remark) {
				var remarkEl = generateRemarkSpan('link-gray pl-1 github-remarks', userToken, username, remark)
				insertAfter(remarkEl, a);
				//如果username太长，截断显示，为remark留点位置
				if (a.offsetWidth > element.clientWidth * 4 / 5) {
					a.style.width = element.clientWidth * 4 / 5 + 'px';
					a.className += 'css-truncate-target';
					remarkEl.style.width = element.clientWidth * 1 / 5 + 'px';
					remarkEl.className += 'css-truncate-target';
				}
			});
		}, this);
	}
}

function showRemarkInRepoDetailPage(userToken) {
	var author = document.querySelector('span.author > a');//in a repo page
	if (!!author) {
		var username = getMasterOfPage(location.href);
		getRemark(userToken, username, function (remark) {
			author.textContent = username + '(' + remark + ')';
		});
	}
	var repoDetail = /\/(stargazers|watchers)(\/you_know)?$/.exec(location.href);
	if (repoDetail !== null) {
		switch (repoDetail[1]) {
			case 'watchers':
			case 'stargazers':
				showRemarkInRepoStargazersPage(userToken);
				break;
		}
	}
}

function showRemarkInOrgPeople(userToken){
    var users = document.querySelectorAll('a[data-hovercard-type=user][id]');
    if(!!users){
        users.forEach(function (element) {
            clearRemarkOfCurrentNode(element.parentNode);
            var username = getMasterOfPage(element.href);
            if(element.href.indexOf('orgs')>-1){
                username = /https:\/\/github.com\/orgs\/([\S\s]+)\/people\/([\s\S]+)$/.exec(element.href)[2];
            }
            getRemark(userToken, username, function (remark) {
                insertAfter(generateRemarkSpan('link-gray pl-1 github-remarks', userToken, username, remark), element);
            });
		}, this)
    }
}

function showRemarkInOrgMembers(userToken){
    var users = document.querySelectorAll('ul.member-listing > li > div > a[data-hovercard-type=user]');
    if(!!users){
        users.forEach(function (element) {
            clearRemarkOfCurrentNode(element.parentNode);
            var username = /https:\/\/github.com\/orgs\/([\S\s]+)\/people\/([\s\S]+)$/.exec(element.href)[2];
            getRemark(userToken, username, function (remark) {
                insertAfter(generateRemarkSpan('link-gray pl-1 github-remarks', userToken, username, remark), element);
            });
		}, this)
    }
}

function changeRemarks(userToken, username, oldValue) {
	var newValue = window.prompt("请输入新备注 (Please input new remark):", oldValue);
	if (newValue !== null && newValue !== oldValue) {
		updateRemark(userToken, username, newValue);
        return newValue;
	}
    return oldValue;
}

function showRemarks(userToken) {
	showRemarkInLeftPannel(userToken);
	var tab = getCurrentTab();
	switch (tab) {
		case 'homepage':
			showRemarkInHomepage(userToken);
			break;
		case 'repositories':
			break;
		case 'stars':
			showRemarkInStarsTab(userToken);
			break;
		case 'following':
		case 'followers':
			showRemarkInFollowersTab(userToken);
			break;
        case 'orgs-members':
            showRemarkInOrgMembers(userToken);
            break;
        case 'orgs-people':
            showRemarkInOrgPeople(userToken);
            break;
		default:
			showRemarkInRepoDetailPage(userToken);
			break;
	}
	console.log(tab,'Show remarks')
}

(function () {
	console.log('GithubRemark-Dorad');
	var username = getGithubLoginUsername();
	if (username !== null && username != '') {
		showRemarks(username);
	} else if (hasLoginFrame()) {
		alert('你还未登陆github，请先登录你的github账户！\r\nYou have not log in to Github!\r\nPlease log in first.');
	}
}());


// ==UserScript==
// @name         Rename Tab
// @name:zh-CN   重命名标题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  rename the tab title
// @description:zh-cn    重命名浏览器标签页标题
// @author       Anc
// @run-at       document-start
// @include      http://*
// @include      https://*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/428017/Rename%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/428017/Rename%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //debugger;
    var pagename = getPageName();
	var sourceNameKey = "sourcename" + ";" + pagename;
	var tabNameKey = "tabname" + ";" + pagename;

    setTabName('tabname');

    GM_registerMenuCommand("Temp - Tab", renameTabTemp,"R");
    GM_registerMenuCommand("Forever - Site", renameSiteForever);
    GM_registerMenuCommand("Forever - Page", renamePageForever);
    GM_registerMenuCommand("Remove - Auto", removeName);



    function setTabName(tabname) {
        var tabnameTemp = sessionStorage.getItem(tabname);
        var tabnameForver = localStorage.getItem(tabname);
        var pagenameForver = localStorage.getItem(tabname + ";" + pagename);

        if(tabnameTemp && tabnameTemp != ""){
            document.title = tabnameTemp;
        }
        if(tabnameForver && tabnameForver != ""){
            document.title = tabnameForver;
        }
        if(pagenameForver && pagenameForver != ""){
            document.title = pagenameForver;
        }
    }

    function getPageName() {
		var pathnames = window.location.pathname.split("/");
		return pathnames[pathnames.length - 1];
    }

    function renameTabTemp() {
        var result = window.prompt("(Temp) Rename this tab as:", document.title);
        if (result) {
            sessionStorage.setItem('sourcename', document.title);
            document.title = result;
            sessionStorage.setItem('tabname', result);
        }
    }

    function renameSiteForever() {
        var result = window.prompt("(Forever) Rename this site as:", document.title);
        if (result) {
            var tabnameTemp = sessionStorage.getItem('sourcename');
            if(tabnameTemp && tabnameTemp != ""){
                localStorage.setItem('sourcename', tabnameTemp);
            } else {
                localStorage.setItem('sourcename', document.title);
            }

            document.title = result;
            localStorage.setItem('tabname', result);
        }
    }

    function renamePageForever() {
        var result = window.prompt("(Forever) Rename this page as:", document.title);
        if (result) {
            var tabnameTemp = sessionStorage.getItem('sourcename');
            if(tabnameTemp && tabnameTemp != ""){
                localStorage.setItem(sourceNameKey, tabnameTemp);
            } else {
                localStorage.setItem(sourceNameKey, document.title);
            }

            document.title = result;
            localStorage.setItem(tabNameKey, result);
        }
    }

    function removeName() {
		var tabnameTemp = localStorage.getItem(sourceNameKey);
		if(tabnameTemp && tabnameTemp != ""){
			localStorage.removeItem(tabNameKey);
			setTabName('sourcename');
			localStorage.removeItem(sourceNameKey);
		} else {
			localStorage.removeItem('tabname');
			sessionStorage.removeItem('tabname');
			setTabName('sourcename');
			sessionStorage.removeItem('sourcename');
			localStorage.removeItem('sourcename');
        }
    }

})();
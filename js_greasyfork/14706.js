// ==UserScript==
// @name         Easy Analysis Extension(Bookmarklet version)
// @version      0.9
// @description  Easy Analysis(http://analyzeit.azurewebsites.net/) Extension(Bookmarklet version)
// @icon         https://www.microsoft.com/favicon.ico?v2
// @license      GPL version 3
// @encoding     utf-8
// @date         12/09/2015
// @modified     12/09/2015
// @author       Myfreedom614 <openszone@gmail.com>
// @supportURL   http://openszone.com/
// @match        https://social.msdn.microsoft.com/Forums/*
// @match        https://social.technet.microsoft.com/Forums/*
// @exclude        https://social.msdn.microsoft.com/Forums/*/home*
// @exclude        https://social.technet.microsoft.com/Forums/*/home*
// @grant        none
// @copyright	 2015,Myfreedom614
// @namespace https://greasyfork.org/users/4544
// @downloadURL https://update.greasyfork.org/scripts/14706/Easy%20Analysis%20Extension%28Bookmarklet%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/14706/Easy%20Analysis%20Extension%28Bookmarklet%20version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function UserException(message) {
        this.message = message;
        this.name = "UserException";
    }

    function OpenLinkNewTab(link) {
        window.open(link, '_blank');
    }

    try {
        var siteurl = document.URL;
        var re = new RegExp("({{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}}{0,1})");
        if (siteurl.match(re)) {
            //alert("Successful match");
            var myArray = re.exec(siteurl);
            var isAdded = document.getElementById('earedirect');
            if(isAdded === null)
            {
                var div = document.getElementById('threadPageContainer').getElementsByTagName('h1')[0];
                div.innerHTML += "<a id='earedirect' target='_blank' href='http://analyzeit.azurewebsites.net/Redirection/Navigate/"+ myArray[0] +"?external=mt' style='cursor: pointer;margin-left: -10px;'><img src='http://findicons.com/icon/download/263492/tag_purple/32/png' class='icon' style='width: 25px;height: 25px;'></a>";
            }
            OpenLinkNewTab("http://analyzeit.azurewebsites.net/Redirection/Navigate/"+ myArray[0] +"?external=mt");
        }
        // else {
        //alert("No match");
        //throw new UserException("Can't extract the case id");
        //}
    }
    catch(err) {
        //alert(err.message);
        if (confirm(err.message + ', report it now ?')) {
            OpenLinkNewTab("https://github.com/dream-365/easy-analysis/issues");
        } else {
            // Do nothing!
        }
    }
})();
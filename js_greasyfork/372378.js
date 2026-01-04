// ==UserScript==
// @name         GCP Console Shortcuts
// @namespace    http://tampermonkey.net/
// @description  Google Cloud Platform Console shortcuts
// @author       nchicong
// @match        https://console.cloud.google.com/*
// @grant        none
// @version 0.2.26
// @license MIT
// @copyright 2018
// @downloadURL https://update.greasyfork.org/scripts/372378/GCP%20Console%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/372378/GCP%20Console%20Shortcuts.meta.js
// ==/UserScript==

var appendedCss = false;
var appendedDiv = false;
var match = "";
var subMenuClickTimeout = 100;
var snackBarCss = "#snackbar{visibility:hidden;min-width:250px;margin-left:-125px;background-color:#333;color:#fff;text-align:left;border-radius:2px;padding:16px;position:fixed;z-index:1;left:50%;bottom:30px;font-size:14px}#snackbar.show{visibility:visible;opacity:0.7;-webkit-animation:fadein 0.5s,fadeout 0.5s 5s;animation:fadein 0.5s,fadeout 0.5s 5s}@-webkit-keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:0.7}}@keyframes fadein{from{bottom:0;opacity:0}to{bottom:30px;opacity:0.7}}@-webkit-keyframes fadeout{from{bottom:30px;opacity:0.7}to{bottom:0;opacity:0}}@keyframes fadeout{from{bottom:30px;opacity:0.7}to{bottom:0;opacity:0}}";
var snackBarContent = "\
Hold Alt key and press:<br/>\
R - Quick refresh <br/>\
/ - Show hotkeys list<br/>\
1 - Compute Engine VMs <br/>\
2 - GKE Cluster <br/>\
3 - GKE Workloads <br/>\
4 - SQL Instances<br/>\
5 - Firewall Rules<br/>\
6 - IAM & Admin <br/>\
7 - BigQuery <br/>\
T - Clone this tab <br />\
L - View log from a GKE Deployment";

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function addEvent(el, type, handler) {
    if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
}

function addGlobalStyle(css) {
    if (appendedCss) {
        return;
    }
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    appendedCss = true;
}

function appendSnackbar() {
    if (appendedDiv) {
        return;
    }
    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.id="snackbar"
    div.innerHTML = snackBarContent;
    body.appendChild(div);
    appendedDiv = true;
}

function showSnackbar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){
        x.className = x.className.replace("show", "");
    }, 5 * 1000);
}

function fireEvent(ElementId, EventName){
    if( document.querySelector(ElementId) != null )
    {
        if( document.querySelector( ElementId ).fireEvent )
        {
            document.querySelector( ElementId ).fireEvent( 'on' + EventName );
        } else {
            var evObj = document.createEvent( 'Events' );
            evObj.initEvent( EventName, true, false );
            document.querySelector( ElementId ).dispatchEvent( evObj );
        }
    }
}

function preSubMenuClick(e) {
    e.preventDefault();
    fireEvent("button.pcc-platform-bar-button", "click");
}

(function() {
    window.addEventListener('keydown', function(e) {
        if (e.altKey && e.keyCode == 81) {
            preSubMenuClick(e);
        }

        if (e.altKey && e.keyCode == 49) {
            preSubMenuClick(e);
            setTimeout(function () {
              fireEvent('[aria-label="Compute Engine"]', "click");
            }, subMenuClickTimeout);
        }

        if (e.altKey && e.keyCode == 50) {
            window.location = "/kubernetes/clusters";
        }

        if (e.altKey && e.keyCode == 51) {
            window.location = "/kubernetes/workload";
        }

        if (e.altKey && e.keyCode == 52) {
            preSubMenuClick(e);
            match = document.querySelector("a[href^='/sql']");
            match.click();
        }

        if (e.altKey && e.keyCode == 53) {
            window.location = "/networking/firewalls/list";
        }

        if (e.altKey && e.keyCode == 54) {
            preSubMenuClick(e);
            setTimeout(function () {
              match = document.querySelector("a[href^='/iam-admin']");
              match.click();
            }, subMenuClickTimeout);
        }

        //7
        if (e.altKey && e.keyCode == 55) {
            preSubMenuClick(e);
            setTimeout(function () {
              match = document.querySelector("a[href^='/bigquery']");
              match.click();
            }, subMenuClickTimeout);
        }

        //refresh R
        if (e.altKey && e.keyCode == 82) {
            e.preventDefault();
            document.querySelector('[aria-label="Refresh"]').click();
        }

        //new tab
        if (e.altKey && e.keyCode == 84) {
            e.preventDefault();
            var win = window.open(location.href, '_blank');
            win.focus();
        }

        //view log
        if (e.altKey && e.keyCode == 76) {
            e.preventDefault();

            var $deploymentName = document.querySelector("gke-resource-status-header ng-transclude");
            if ($deploymentName) {
                var deploymentName = $deploymentName.textContent.trim();
                window.open("https://console.cloud.google.com/logs/viewer?interval=NO_LIMIT&advancedFilter=resource.type%3D%22container%22%0Aresource.labels.namespace_id%3D%22default%22%0Aresource.labels.container_name%3D%22" + deploymentName + "%22");
            }
        }

        //close left panel
        if (e.altKey && e.keyCode == 81) {
            e.preventDefault();
            match = document.querySelector("button.mat-icon-button[_ngcontent-c28]");
            match.click();
        }

        //help
        if (e.altKey && e.keyCode == 191) {
            var tabContent = "<title>GCP Console Shortcuts</title>" + snackBarContent;

            var x=window.open();
            x.document.open();
            x.document.write(tabContent);
            x.document.close();
        }

        if (e.altKey) {
            e.preventDefault();
            addGlobalStyle(snackBarCss);

            appendSnackbar();
            showSnackbar();
        }
    });

})();

// ==UserScript==
// @name         AWS-SSO-Console-User-Title-IAM-Alias
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Inspired by https://greasyfork.org/en/scripts/430620-aws-sso-console-user-title-fix but modified to require less maintenence
// @author       Nick Carpenter
// @match https://*.console.aws.amazon.com/*
// @match https://console.aws.amazon.com/*
// @run-at       document-end
// @license      MIT
// @noframes
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/459193/AWS-SSO-Console-User-Title-IAM-Alias.user.js
// @updateURL https://update.greasyfork.org/scripts/459193/AWS-SSO-Console-User-Title-IAM-Alias.meta.js
// ==/UserScript==

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function runWhenReady(readySelector, callback) {
    var numAttempts = 0;
    var tryNow = function() {
        var elem = document.querySelector(readySelector);
        if (elem) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            } else {
                //console.warn("Waiting....")
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}



function modify(elem) {
    'use strict';
    // console.log("======================================================")
    // The query selector might need to change.  But this is trying to find the span inside the button.
    //let nodes = document.querySelectorAll('[data-testid="awsc-nav-account-menu-button"]')
    //assert(nodes.length == 1, "Could not find proper span")
    assert(elem.tagName == 'SPAN', "Element passed in is not a span")
    assert (elem.children.length == 2, "Found the wrong number of children")
    let str = elem.parentElement.title
    assert(str != null, "String pulled from UI is null")


    // console.log(`Element: ${str})
    //AWSReservedSSO_11111111-Admin_123bdas34vffds/blah@company.com @ account-iam-alias
    let re = /\w+_(\w+-\w+)_\w+\/(.*)\s+@\s+(.*)/
    let results = re.exec(str)
    assert (results!=null, "String contents from span title attribute was not parsed properly by regular expression")
    let role = results[1]
    let username = results[2]
    let account = results[3]
    // console.log(`Username: ${username}  Account: ${account}  Role: ${role}`)
    // console.log("======================================================")
    elem.children[0].innerText = `${account} / ${role} / ${username}`

    let label = "unknown"
    let pieces = account.split("-")

    for(let x in pieces) {
        let y = pieces[x]

        switch(y){
            case "prod":
                label="prod";
                break;
            case "master":
                label="prod";
                break;
            case "stage":
                label="stage";
                break;
            case "qa":
                label="qa";
                break;
            case "shared":
                label = "shared";
                break;
            case "dev":
                label = "dev";
                break;
        }
    }

    const color = {unknown:"black",dev:'green',qa:'green',shared:'red',prod:'red',stage:'orange',master:'red'}[label];
    //console.log(color)
    //console.log(label)
    const o = document.createElement("div");
    o.innerHTML="<div style='position: absolute; top: 33px; right: 32px; background-color: "+color+"; color: white; z-index: 2000; font-family: sans-serif; padding: 5px;'>"+account+"</div>";
    //Disabled for now
    //elem.appendChild(o);

}

runWhenReady('[data-testid="awsc-nav-account-menu-button"]', modify)

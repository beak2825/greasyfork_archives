// ==UserScript==
// @name         BitBucket search my branches
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  To add a filter drop down to the bitbucket branches page to filter by users
// @author       Jessica Moolenschot
// @match        https://bitbucket.org/*
// @icon         https://d301sr5gafysq2.cloudfront.net/frontbucket/assets/present/build-favicon-default.df3a1f57.ico
// @grant        none
// @run-at       document-end
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443279/BitBucket%20search%20my%20branches.user.js
// @updateURL https://update.greasyfork.org/scripts/443279/BitBucket%20search%20my%20branches.meta.js
// ==/UserScript==

let main = "#userBranchDiv";
(function() {
    'use strict';
    let lastUrl = location.href;
    if(lastUrl.indexOf('/branches/') != -1)
    {
        setTimeout(function() {
            init();
        },1000);// need basic DOM to load, since bitbucket uses OnePAge application it needs time to load even with run at doc end
    }

    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if(url.indexOf('/branches/') != -1)
            {
                console.log("on branch tree");
                setTimeout(function() {
                    init();
                },1000);
            }
            console.log(`new url is ${lastUrl}`);
        }
    }).observe(document, {subtree: true, childList: true});
})();

function init()
{
    if($(main).html() === null)
    {
        addUI();
        addEvents();
        getUsersInWorkspace(0);
    }
}

function addFilteredBranch(branch)
{
    $("#filteredBranches").append(`
        <span>
            <a href="${branch.links.html.href}">${branch.name}</a>
        </span>
        </br>
    `);
}

function getBranchByUser(data)
{
    let jsondata = JSON.parse(data);
    let user = $(`#userList`).find(":selected").html();
    let promise = new Promise((resolve,reject) => {
        for(let i = 0; i < jsondata.values.length; i++)
        {
            if(jsondata.values[i].target.author.user.display_name == user) 
            {
                addFilteredBranch(jsondata.values[i]);
            }
        }
        resolve("yes");
    })

    //get selected user from selection menu
    //parse json data
    //add to filtered branches
}

function getUsersInWorkspace(page) //no easy internal API for this one, gotta scour the HTML
{
    let url = `https://bitbucket.org/${getCurrentWorkspace()}/workspace/members/?page=${page+1}`
    let userArray = [];
    let memberPage = null;
    //let url = `https://api.bitbucket.org/2.0/workspaces/${getCurrentWorkspace()}/members`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let dropdownHTML = $("#userList");
            memberPage= $(this.responseText);

            let memberCount = $(memberPage).find('#filter-pjax').find('p').text();
            memberCount = (memberCount.slice(memberCount.indexOf(':')+1, memberCount.length)).trim();

            let memberList = $(memberPage).find(".user");
            let i = memberCount / 30;
            let r = memberCount - (30 * page);
            if(r > 30)
            {
                r = 30;
                getUsersInWorkspace(page+1);
            }
            let users = $(memberList).find('.name--overflow-wrap');

            for(let user = 0; user < users.length; user++)
            {
                let u = $(users[user]).text().trim();
                dropdownHTML.append(`<option value=''>${u}</option>`);
            }

        }
    }
    url = encodeURL(url);
    xhttp.open("GET", url);
    xhttp.send();
}
function addEvents()
{
    $(`#filter`).on("click",function() {
        $("#filteredBranches").html("<span id='loading'>LOADING....</span><br/>");

        loadBranches();
    });
}
async function loadBranches()
{
    console.log("starting");
    Promise.all([branchPage(1),branchPage(2),branchPage(3),branchPage(4),branchPage(5)])
    .then(result => {
        $("#loading").text("DONE!");
    })
    .catch(error => {
        console.error("uh oh will you even see this through the slew of errors that bitbucket throws anyway?");
    });

}

async function branchPage(pageNo) //implicitly gets branch from the current branch url
{
 
    const finalPromise = await new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                resolve(this.responseText);
            }
        }
        let url = `https://bitbucket.org/!api/internal/repositories/${getCurrentRepo()}/branch-list/`
        +`?q=name != \"master\" AND (ahead > 0 OR ahead = null)`
        +`&page=${pageNo}`
        +`&pagelen=25`
        +`&fields=`
        +`-values.target.author.user.account_id,`
        +`+values.pullrequest.state,`
        +`+values.pullrequest.created_on,`
        +`+values.pullrequests.state,`
        +`+values.pullrequests.created_on,`
        +`+values.pullrequests.closed_on,`
        +`-values.statuses,`
        +`+values.default_merge_strategy,`
        +`+values.merge_strategies`;
    
        url = encodeURL(url);
        xhttp.open("GET", url);
        xhttp.send();
        
    });
    if(finalPromise) {
        console.log(finalPromise);
        const promise2 = await new Promise((resolve,reject) => {
            getBranchByUser(finalPromise);
            resolve();
        });
        return promise2;
    }
}
function encodeURL(url)
{
    let encoded = url;
    encoded = encoded.replace(/([+])/g,'%2B');
    encoded = encoded.replace(/([,])/g,'%2C');

    return encoded;
}
function addUI()
{
    $('div[role="search"]').parent().append(`
    <div id="userBranchDiv">
    </div>
    `);
    $(main).append(`<select id="userList"></select>`);
    $(main).append(`<input type="button" id="filter" value="Filter" style="padding:2px; margin-left:5px;"/>`);
    $(main).parent().parent().append(`<div id="filteredBranches"></div>`);

}
function getCurrentRepo()
{
    let url = window.location.href;
    url = url.replace('https://',''); //bitbucket.org/WORKSPACE/REPO/branches

    url = url.slice(url.indexOf('/')+1, url.length-1); //WORKSPACE/REPO/branches
    url = url.replace(url.slice(url.lastIndexOf('/branches'),url.length),''); //WORKSPACE/REPO
    return url;
}
function getCurrentWorkspace()
{
    let url = getCurrentRepo(); //WORKSPACE/REPO
    url = url.slice(0, url.indexOf('/')); //WORKSPACE
    return url;
}
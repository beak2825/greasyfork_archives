// ==UserScript==
// @name         Coursera Peer Admin Helper
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.0.0
// @description  When browsing the Course Manager > Peer Review Submissions
// @author       saibotshamtul (Michael Cimino)
// @match        https://www.coursera.org/learn/interactive-python-1/peer-admin/*
// @grant        none

// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/405992/Coursera%20Peer%20Admin%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405992/Coursera%20Peer%20Admin%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let $ = document.querySelector.bind(document),
        $$ = document.querySelectorAll.bind(document);

    window.Tampermonkey = window.Tampermonkey || {};
    window.Tampermonkey.CourseraPeerAdminHelper = window.Tampermonkey.CourseraPeerAdminHelper || {};

    window.Tampermonkey.CourseraPeerAdminHelper.FetchedData = window.Tampermonkey.CourseraPeerAdminHelper.FetchedData || {count:0,all:0,keys:[]};
    function PromiseGet(url) {

        window.Tampermonkey.CourseraPeerAdminHelper.FetchedData.all += 1;

        if (window.Tampermonkey.CourseraPeerAdminHelper.FetchedData.keys.indexOf(url)>-1){
            //console.log('PromiseGet ' + [window.Tampermonkey.CourseraForumPeerReview.FetchedData.all,window.Tampermonkey.CourseraForumPeerReview.FetchedData.count].join(" "))
            //this URL has already been requested
            //return THAT promise instead of a new one
            let current = window.Tampermonkey.CourseraPeerAdminHelper.FetchedData[url];//.then(()=>{})
            //window.Tampermonkey.CourseraForumPeerReview.FetchedData[url] = current;
            return current;
        }

        window.Tampermonkey.CourseraPeerAdminHelper.FetchedData.count += 1;
        //console.log('PromiseGet ' + [window.Tampermonkey.CourseraForumPeerReview.FetchedData.all,window.Tampermonkey.CourseraForumPeerReview.FetchedData.count].join(" "));

        // Return a new promise.
        let newPromise = new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();

            req.open('GET', url);

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                    console.log('PromiseGet ' + window.Tampermonkey.CourseraPeerAdminHelper.FetchedData.count + ' ' + url);
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
        window.Tampermonkey.CourseraPeerAdminHelper.FetchedData[url] = newPromise;
        window.Tampermonkey.CourseraPeerAdminHelper.FetchedData.keys.push(url);
        return newPromise;
    }
    window.PromiseGet = PromiseGet;

    // Your code here...
    function parsePeerAdminList(){
        let links = $$(".fixedDataTableRowLayout_rowWrapper a"),
            filteredLinks = Array.from(links).filter((a)=>{if (a.innerText.match(/\[a\]/)){return false;}else{return true;}});
        if (filteredLinks.length===0){
            return;
        }
        for (let a of filteredLinks){
            //original API call
            //https://www.coursera.org/api/onDemandPeerSubmissions.v1/       ~n2zunIlgEeWSMw6QLoDNsQ~vqRMl~-Imm2bYkEeqWVwqO-2OnMw/?fields=submission%2Ccontext%2CcreatorId%2CattachedAssignmentId%2CcreatedAt%2CupgradeSubmissionToLatestAssignment%2CblocksSubmit%2CvalidationErrors%2Cupvotes%2CisUpvotedByRequester%2CisDeleted%2CisLatestDeletedSubmissionDeletedByAdmin%2ConDemandPeerReviewSchemas.v1(reviewSchema)%2ConDemandPeerSubmissionSchemas.v1(submissionSchema)%2ConDemandSocialProfiles.v1(userId%2CexternalUserId%2CfullName%2CphotoUrl%2CcourseRole)&includes=submissionSchemas%2CreviewSchemas%2Cprofiles
            //simplified API call for our needs ... fullname and submission information
            //https://www.coursera.org/api/onDemandPeerSubmissions.v1/       ~n2zunIlgEeWSMw6QLoDNsQ~vqRMl~-Imm2bYkEeqWVwqO-2OnMw/?fields=submission%2ConDemandSocialProfiles.v1(fullName)&includes=submissionSchemas%2Cprofiles
            let location_pathname = a.href.split("/"), //["https:", "", "www.coursera.org", "learn", "interactive-python-1", "item", "vqRMl", "review", "-Imm2bYkEeqWVwqO-2OnMw"]
                apiUrl = `https://www.coursera.org/api/onDemandPeerSubmissions.v1/${ window.coursera.user.id }~${ window.coursera.courseId }~${ location_pathname[6] }~${ location_pathname[8] }/`;
            apiUrl += "?fields=submission%2ConDemandSocialProfiles.v1(fullName)&includes=submissionSchemas%2Cprofiles";
            PromiseGet(apiUrl).then((resp)=>{
                let json_resp = JSON.parse(resp),
                    submUrl = Object.entries(json_resp.elements[0].submission.parts)[0][1].definition.url,
                    submFullName = json_resp.linked['onDemandSocialProfiles.v1'][0].fullName;
                //a.innerHTML += `: ${ submFullName } [a]`;
                let newDiv = document.createElement('div');
                newDiv.setAttribute('class','submUrl');
                newDiv.setAttribute('style','font-size:10px');
                newDiv.innerHTML = `<a href="${ submUrl }">${ submUrl } [a]</a>`;
                //let row = a.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                //if (row.children.length>6){
                //    row.removeChild(row.children[6]);
                //}
                //row.appendChild(newDiv);

                //a.getBoundingClientRect()
                a.appendChild(newDiv);
            }).catch((e)=>{});
        }
    }
    setInterval(parsePeerAdminList, 500);

})();
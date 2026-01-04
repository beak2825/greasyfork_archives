// ==UserScript==
// @name         Coursera Forum Peer Review Helper
// @namespace    https://greasyfork.org/users/4756
// @version      0.4.4
// @description  When browsing the Coursera forum, looks for each peer review link, then tries to mark if it's ungraded, graded, or deleted.
// @author       saibotshamtul (Michael Cimino)
// @match        https://www.coursera.org/learn/interactive-python-1/discussions/*/threads/*
// @match        https://www.coursera.org/learn/interactive-python-2/discussions/*/threads/*
// @match        https://www.coursera.org/learn/interactive-python-1/course-manager
// @match        https://www.coursera.org/learn/interactive-python-2/course-manager
// @grant        none

// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/396942/Coursera%20Forum%20Peer%20Review%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/396942/Coursera%20Forum%20Peer%20Review%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //https://commons.wikimedia.org/wiki/Tango_icons


    window.Tampermonkey = window.Tampermonkey || {};
    window.Tampermonkey.CourseraForumPeerReview = window.Tampermonkey.CourseraForumPeerReview || {};

    window.Tampermonkey.CourseraForumPeerReview.FetchedData = window.Tampermonkey.CourseraForumPeerReview.FetchedData || {count:0,all:0,keys:[]};
    //function to create promise for a URL
    //let ajax = PromiseGet(url).then(((link)=>{return (response)=>{use link here}})(link))
    function PromiseGet(url) {

        window.Tampermonkey.CourseraForumPeerReview.FetchedData.all += 1;

        if (window.Tampermonkey.CourseraForumPeerReview.FetchedData.keys.indexOf(url)>-1){
            //console.log('PromiseGet ' + [window.Tampermonkey.CourseraForumPeerReview.FetchedData.all,window.Tampermonkey.CourseraForumPeerReview.FetchedData.count].join(" "))
            //this URL has already been requested
            //return THAT promise instead of a new one
            let current = window.Tampermonkey.CourseraForumPeerReview.FetchedData[url];//.then(()=>{})
            //window.Tampermonkey.CourseraForumPeerReview.FetchedData[url] = current;
            return current;
        }

        window.Tampermonkey.CourseraForumPeerReview.FetchedData.count += 1;
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
                    console.log('PromiseGet ' + window.Tampermonkey.CourseraForumPeerReview.FetchedData.count + ' ' + url);
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
        window.Tampermonkey.CourseraForumPeerReview.FetchedData[url] = newPromise;
        window.Tampermonkey.CourseraForumPeerReview.FetchedData.keys.push(url);
        return newPromise;
    }
    window.PromiseGet = PromiseGet;


    window.Tampermonkey.CourseraForumPeerReview.Helper = window.Tampermonkey.CourseraForumPeerReview.Helper || {count:0};
    window.Tampermonkey.CourseraForumPeerReview.Manager = window.Tampermonkey.CourseraForumPeerReview.Manager || {count:0};


    //https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS
    function StoredData(dataName){
        this.write = function writeData(data){
            let stored = localStorage.getItem(this.storageItem),
                JSONstr = JSON.stringify(data);
            if (JSONstr!=stored){
                localStorage.setItem(this.storageItem, JSON.stringify(data));
            }
        };
        this.read = function readData(){
            let JSONstr = localStorage.getItem(this.storageItem) || '{"keys":[],"threads":{}}',
                data = JSON.parse(JSONstr);
            this.write(data);
            return data;
        };


        //'init'
        this.storageItem = dataName;
        this.read();


        this.removeKey = function removeKey(threadId,div){
            let data = this.read();
            delete data.threads[threadId];
            data.keys = data.keys.filter((x)=>{return x!=threadId;});
            this.write(data);
            if (div!==null){
                div.parentNode.removeChild(div);
            }
        };
        this.addKey = function addKey(threadId){
            let data = this.read();
            data.threads[threadId] = {urls:0,links:[]};
            if (data.keys.indexOf(threadId)<0){
                data.keys.push(threadId);
            }
            this.write(data);
        };
        this.addUrl = function addUrl(threadId,addLink){
            let data = this.read(),
                threadData = data.threads[threadId];
            if (threadData.links.indexOf(addLink.a.href)<0){
                threadData.urls = threadData.urls + 1;
                threadData.links.push(addLink.a.href);
            }
            this.write(data);
        };
        this.decreaseUrlCount = function decreaseUrlCount(threadId,rmvLink){
            let data = this.read(),
                threadData = data.threads[threadId];
            if (threadData.links.indexOf(rmvLink.a.href)>-1){
                threadData.urls = threadData.urls - 1;
                threadData.links = threadData.links.filter((x)=>{return x!=rmvLink.a.href;});
                if (threadData.urls < 1){
                    this.removeKey(threadId);
                }
                this.write(data);
            }
        };
        this.keys = function getKeys(){
            let data = this.read();
            return data.keys;
        };
        this.threads = function getThreads(){
            let data = this.read();
            return data.threads;
        };
    }
    var CourseraForumPeerReview_data = new StoredData('CourseraForumPeerReviewHelperThreads');
    window.Tampermonkey.CourseraForumPeerReview.Helper.Data = CourseraForumPeerReview_data;
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    // ========== localStorage ==========
    // localStorage.setItem('CourseraForumPeerReviewHelperThreads',"")
    // JSON.parse(localStorage.getItem('CourseraForumPeerReviewHelperThreads'))


    let location_pathname = window.location.pathname.split("/");
    let thisThread = [location_pathname[2],location_pathname[6]].join(" ");
    window.thisThread = thisThread;
    //CourseraForumPeerReviewHelper holds the list of thread IDs
    if ([location_pathname[1],location_pathname.slice(3,6)].join(" ") == "learn discussions,all,threads"){
        CourseraForumPeerReview_data.addKey(thisThread);
    }
    if ([location_pathname[1],location_pathname[3]].join(" ")=="learn course-manager"){
        //dummy functions that will be called on course-manager page since we can't actually change the URL counts
        CourseraForumPeerReview_data.addUrl = function addUrl(threadId,addLink){};
        CourseraForumPeerReview_data.decreaseUrlCount = function decreaseUrlCount(threadId, rmvLink){};
    }

    //at the top of the thread, we want to add a custom mentor message
    function CustomMentorMessage(){
        this.elt = document.createElement("div");
        this.elt.setAttribute('class','rc-PendingThread mentor-message align-horizontal-center');
        this.elt.style.display='none';
        this.is_resolved = false;
        this.set_pending = function set_pending(){
            this.elt.style.backgroundColor="#0af";
            this.elt.style.borderColor="#08f";
            this.elt.style.display='';
            this.elt.innerHTML = "";
                let a_delete = document.createElement("a");
                a_delete.innerHTML = "<img width='16' src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Dialog-error.svg/48px-Dialog-error.svg.png' title='Remove this from pending.' />";
                a_delete.onclick = ((k,div)=>{return ()=>{
                    CourseraForumPeerReview_data.removeKey(k,null);
                    this.not_pending();
                };})(thisThread,this);
            this.elt.appendChild(a_delete);
            let spacer_div = document.createElement("div");
                spacer_div.innerHTML = "&nbsp;&nbsp;&nbsp;";
                spacer_div.style.display='inline';
            this.elt.appendChild(spacer_div);
            let message = document.createElement('span');
                message.textContent = "This thread is Pending Peer Reviews.";
            this.elt.appendChild(message);
        };
        this.not_pending = function not_pending(){
            this.elt.style.backgroundColor="#6b6";
            this.elt.style.borderColor="#080";
            this.elt.style.display='';
            this.elt.innerHTML = "";
                let message = document.createElement('span');
                message.innerHTML = "This thread is <b>not</b> Pending Peer Reviews.";
            this.elt.appendChild(message);
                let spacer_div = document.createElement("div");
                spacer_div.innerHTML = "&nbsp;&nbsp;&nbsp;";
                spacer_div.style.display='inline';
            this.elt.appendChild(spacer_div);
                let a_delete = document.createElement("a");
                a_delete.innerHTML = "<img width='16' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Ambox_emblem_plus.svg/48px-Ambox_emblem_plus.svg.png' title='Add this to pending.' />";
                a_delete.onclick = ((k,div)=>{return ()=>{
                    CourseraForumPeerReview_data.addKey(k);
                    this.set_pending();
                };})(thisThread,this);
            this.elt.appendChild(a_delete);
        };
        this.set_pending_wip = function set_pending_wip(){
            this.elt.style.backgroundColor="#0af";
            this.elt.style.borderColor="#08f";
            this.elt.style.display='';
            this.elt.innerHTML = "";
                let a_delete = document.createElement("a");
                a_delete.innerHTML = "<img width='16' src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Dialog-error.svg/48px-Dialog-error.svg.png' title='Remove this from pending.' />";
                a_delete.onclick = ((k,div)=>{return ()=>{
                    CourseraForumPeerReview_data.removeKey(k,null);
                    this.not_pending_wip();
                };})(thisThread,this);
            this.elt.appendChild(a_delete);
                let spacer_div = document.createElement("div");
                spacer_div.innerHTML = "&nbsp;&nbsp;&nbsp;";
                spacer_div.style.display='inline';
            this.elt.appendChild(spacer_div);
                let message = document.createElement('span');
                message.textContent = "URLs are still resolving, but This thread is currently Pending Peer Reviews.";
            this.elt.appendChild(message);
        };
        this.not_pending_wip = function not_pending(){
            this.elt.style.backgroundColor="#6b6";
            this.elt.style.borderColor="#080";
            this.elt.style.display='';
            this.elt.innerHTML = "";
                let message = document.createElement('span');
                message.innerHTML = "URLs are still resolving, but This thread is currently <b>not</b> Pending Peer Reviews.";
            this.elt.appendChild(message);
                let spacer_div = document.createElement("div");
                spacer_div.innerHTML = "&nbsp;&nbsp;&nbsp;";
                spacer_div.style.display='inline';
            this.elt.appendChild(spacer_div);
                let a_delete = document.createElement("a");
                a_delete.innerHTML = "<img width='16' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Ambox_emblem_plus.svg/48px-Ambox_emblem_plus.svg.png' title='Add this to pending.' />";
                a_delete.onclick = ((k,div)=>{return ()=>{
                    CourseraForumPeerReview_data.addKey(k);
                    this.set_pending_wip();
                };})(thisThread,this);
            this.elt.appendChild(a_delete);
        };
        window.onstorage = (event) => {
            // When local storage changes ...
            let storageKeys = CourseraForumPeerReview_data.keys();
            console.log("========== Storage ==========");
            console.log([storageKeys.indexOf(thisThread), this.is_resolved].join(" "));
            if (storageKeys.indexOf(thisThread)>-1){
                if (this.is_resolved){
                    this.set_pending();
                } else {
                    this.set_pending_wip();
                }
            } else {
                if (this.is_resolved){
                    this.not_pending();
                } else {
                    this.not_pending_wip();
                }
            }
        };
    }
    let new_message = new CustomMentorMessage();
    //window.Tampermonkey.CourseraForumPeerReview.CustomMentorMessage = [new_message];
    function InsertCustomMentorMessage(){
        let session_details = document.querySelector(".rc-SessionDetails");
        if (session_details!==null){
            session_details.insertAdjacentElement('afterend',new_message.elt);
            ResolvingWIP();
        } else {
            setTimeout(InsertCustomMentorMessage,2000);
        }
    }

    //    all peer review links have been resolved.
    function ResolvingDone(){
        if ([location_pathname[1],location_pathname.slice(3,6)].join(" ") == "learn discussions,all,threads"){
            // this is a peer thread
            new_message.not_pending();
            new_message.is_resolved = true;
            if (CourseraForumPeerReview_data.keys().indexOf(thisThread)>-1){
                // this is a peer thread, and this key exists
                if (CourseraForumPeerReview_data.threads()[thisThread].urls>0){
                    new_message.set_pending();
                }
            }
            /*
            window.onstorage = (event) => {
                //on a discussion thread ... we are done resolving ... so now check for storage changes
                console.log('===== ===== Storage ===== =====');
            }
            */
        }
    }
    function ResolvingWIP(){
        if ([location_pathname[1],location_pathname.slice(3,6)].join(" ") == "learn discussions,all,threads"){
            new_message.not_pending_wip();
            if (CourseraForumPeerReview_data.keys().indexOf(thisThread)>-1){
                //this thread is in the list of pending threads
                if (CourseraForumPeerReview_data.threads()[thisThread].urls>0){
                    new_message.set_pending_wip();
                }
            }
        }
    }

    // appends a status message to each peer review link
    // we can save the original innerHTML by setting isOriginal to true ... so that we can replace the status message without messing up the original HTML
    function AddMessage(link,message,isOriginal){
        if (isOriginal){
            link.originalIH = link.a.innerHTML;
        }
        link.a.innerHTML = link.originalIH + message;
        link.a.setAttribute('CourseraForumPeerReviewHelper','1');
    }

    // converts a millisecond timestamp into a relative message like "3 days ago"
    function RelativeTime(timestamp){
        let now = new Date(),
            then = new Date(timestamp),
            delta = now - then;

        let days = Math.trunc(delta/1000/60/60/24);
        if (days>0){
            return `${ days } days ago`;
        }
        delta -= days*1000*60*60*24;

        let hours = Math.trunc(delta/1000/60/60);
        if (hours>0){
            return `${ hours } hours ago`;
        }
        delta -= hours*1000*60*60;

        let minutes = Math.trunc(delta/1000/60);
        if (minutes>0){
            return `${ minutes } minutes ago`;
        }

        let seconds = Math.trunc(delta/1000);
        return `${ seconds } seconds ago`;
    }

    function SessionTime(subm){
        let sessionInfo = subm.session,
            createdAt = new Date(subm.createdAt),
            startedAt = new Date(sessionInfo.startedAt),
            endedAt = new Date(sessionInfo.endedAt),
            sessionDays = Math.trunc((endedAt - startedAt)/1000/60/60/24),
            title = '',
            submissDay = ''; //['test',createdAt,startedAt,endedAt,(createdAt > startedAt),(createdAt > endedAt)].join(" ");
        if (createdAt < startedAt){
            submissDay = `${ Math.trunc((startedAt - createdAt)/1000/60/60/24) } days before the start of the session.`;
            title = `${ createdAt.toDateString() } assignment submitted\n`;
            title += `${ startedAt.toDateString() } session started\n`;
            title += `${ endedAt.toDateString() } session ended`;
        }
        if (createdAt >= startedAt){
            submissDay = `on day ${ Math.trunc((createdAt - startedAt)/1000/60/60/24) }/${ sessionDays }.`;
            title = `${ startedAt.toDateString() } session started\n`;
            title += `${ createdAt.toDateString() } assignment submitted\n`;
            title += `${ endedAt.toDateString() } session ended`;
        }
        if (createdAt > endedAt){
            submissDay = `${ Math.trunc((createdAt - endedAt)/1000/60/60/24) } days after the end of the session.`;
            title = `${ startedAt.toDateString() } session started\n`;
            title += `${ endedAt.toDateString() } session ended\n`;
            title += `${ createdAt.toDateString() } assignment submitted`;
        }
        let message = `Submitted ${ RelativeTime(subm.createdAt) } ... ${ submissDay }`;
        return `<br/><span style="color:#444;" title="${ title }">${ message }</span>`;
    }

    //    Marks this as Deleted ...
    function HaveDeleted(memo_assignment14,link14){
        let deleted14 = memo_assignment14.deleted;
        if (deleted14[link14.sId]===undefined){
            //it's not deleted ... what?
            let message = '<span style="background:red;color:white;padding:0 5px 0 5px;margin:0 5px 0 5px;">What!</span>';
            //link14.a.innerHTML += message;
            AddMessage(link14,message,false);
            // we don't know what this is ... so decrease the URL count for thisThread
            CourseraForumPeerReview_data.decreaseUrlCount(thisThread,link14);
        } else {
            //console.log(['Submission',sId10,'has already been graded',graded10[sId10].reviewCount,'times.'].join(' '));
            let message = `<br><span style="background:gold;color:brown;padding:0 5px 0 5px;margin:0 5px 0 5px;">Deleted {${ deleted14[link14.sId].reviewCount }}</span>`;
            message += `<span style="color:#888;padding:0 5px 0 5px;margin:0 5px 0 5px;">Submitted ${ RelativeTime(deleted14[link14.sId].createdAt) }</span>`;
            //link14.a.innerHTML += message;
            AddMessage(link14,message,false);
            // this is deleted ... so decrease the URL count for thisThread
            CourseraForumPeerReview_data.decreaseUrlCount(thisThread,link14);
            window.pending_links.pending -= 1;
            //if ((window.pending_links.pending == 0)&(window.pending_links.total>0)){
            if (window.pending_links.pending === 0){
               ResolvingDone();
            }
        }
    }
    //.dr Reads and parses all of the Deleted ... calls HaveDeleted
    function HaveDeletedTotal(memo_assignment12,link12){
        //console.log('Deleted:\n'+link12.deletedURL + memo_assignment12.deleted_total);
        memo_assignment12.deleted = memo_assignment12.deleted || {};
        if (memo_assignment12.deleted[link12.sId]===undefined){
            link12.dr_ajax = PromiseGet(link12.deletedURL + memo_assignment12.deleted_total).then(((memo_assignment13,link13)=>{return (response)=>{
                link13.dr_response = response;
                let json_resp = JSON.parse(response);
                link13.dr_json = json_resp;

                //actually process all of the graded submissions
                let deleted = memo_assignment13.deleted;
                for (var subm of json_resp.elements){
                    deleted[subm.id] = {reviewCount:subm.reviewCount, createdAt:subm.createdAt};
                }
                HaveDeleted(memo_assignment13,link13);
            };})(memo_assignment12,link12));
        } else {
            HaveDeleted(memo_assignment12,link12);
        }
    }

    //.dt Marks this as Graded ... else Reads 1 Deleted to get the Deleted paging total ... calls HaveDeletedTotal
    function HaveGraded(memo_assignment10,link10){
        let graded10 = memo_assignment10.graded;
        if (graded10[link10.sId]===undefined){
            //it's not graded ... what?
            //let message = '<span style="background:red;color:white;padding:0 5px 0 5px;margin:0 5px 0 5px;">What!</span>';
            //link10.a.innerHTML += message;
            //let deletedURL = gradedURL10.replace('&reviewingCompletedFilter=true','').replace('&isDeletedFilter=false','&isDeletedFilter=true').replace('=reviewCount&','=reviewCount,isDeleted&')
            AddMessage(link10,'<span style="color:brown;padding:0 5px 0 5px;margin:0 5px 0 5px;">Is it Deleted?</span>',false);
            if (memo_assignment10.deleted_total===undefined){
                link10.dt_ajax = PromiseGet(link10.gradedURL+1).then(((memo_assignment11,link11)=>{return (response)=>{
                    link11.dt_response = response;
                    let json_resp = JSON.parse(response);
                    link11.dt_json = json_resp;
                    memo_assignment11.deleted_total = json_resp.paging.total;
                    HaveDeletedTotal(memo_assignment11,link11);
                };})(memo_assignment10,link10));
            } else {
                HaveDeletedTotal(memo_assignment10,link10);
            }
        } else {
            //console.log(['Submission',sId10,'has already been graded',graded10[sId10].reviewCount,'times.'].join(' '));
            let message = `<br><span style="background:green;color:white;padding:0 5px 0 5px;margin:0 5px 0 5px;">Graded {${ graded10[link10.sId].reviewCount }}</span>`;
            message += `<span style="color:#888;padding:0 5px 0 5px;margin:0 5px 0 5px;">Submitted ${ RelativeTime(graded10[link10.sId].createdAt) }</span>`;
            //link10.a.innerHTML += message;
            AddMessage(link10,message,false);
            // this is graded ... so decrease the URL count for thisThread
            //window.Tampermonkey.CourseraForumPeerReview.Helper.Threads.decreaseUrlCount(thisThread,link10);
            CourseraForumPeerReview_data.decreaseUrlCount(thisThread,link10);
            //window.pending_links.pending == window.pending_links.total
            window.pending_links.pending -= 1;
            //if ((window.pending_links.pending == 0)&(window.pending_links.total>0)){
            if (window.pending_links.pending === 0){
               ResolvingDone();
            }
        }
    }
    //.gr Reads and parses all of the Graded ... calls HaveGraded
    function HaveGradedTotal(memo_assignment8,link8){
        //console.log('Graded:\n'+link8.gradedURL + memo_assignment8.graded_total);
        memo_assignment8.graded = memo_assignment8.graded || {};
        if (memo_assignment8.graded[link8.sId]===undefined){
            link8.gr_ajax = PromiseGet(link8.gradedURL + memo_assignment8.graded_total).then(((memo_assignment9,link9)=>{return (response)=>{
                link9.gr_response = response;
                let json_resp = JSON.parse(response);
                link9.gr_json = json_resp;

                //actually process all of the graded submissions
                let graded = memo_assignment9.graded;
                for (var subm of json_resp.elements){
                    graded[subm.id] = {reviewCount:subm.reviewCount, createdAt:subm.createdAt};
                }
                HaveGraded(memo_assignment9,link9);
            };})(memo_assignment8,link8));
        } else {
            HaveGraded(memo_assignment8,link8);
        }
    }

    //.gt Marks this as Ungraded ... else Reads 1 Graded to get the Graded paging total ... calls HaveGradedTotal
    function HaveUngraded(memo_assignment6, link6){
        //console.log(['test',link, memo_assignment, submission,courseId,assignment].join('\n'));
        if (memo_assignment6[link6.sId]===undefined){
            AddMessage(link6,'<span style="color:green;padding:0 5px 0 5px;margin:0 5px 0 5px;">Is it Graded?</span>',true);

            if (memo_assignment6.graded_total===undefined){
                link6.gt_ajax = PromiseGet(link6.gradedURL+1).then(((memo_assignment7,link7)=>{return (response)=>{
                    link7.gt_response = response;
                    let json_resp = JSON.parse(response);
                    link7.gt_json = json_resp;
                    memo_assignment7.graded_total = json_resp.paging.total;
                    HaveGradedTotal(memo_assignment7,link7);
                };})(memo_assignment6,link6));
            } else {
                HaveGradedTotal(memo_assignment6,link6);
            }

        } else {
            //console.log(['Submission',sId6,'has been reviewed',memo_assignment6[sId6].reviewCount,'times.'].join(' '));
            //console.log(['Here\'s the API URL for ungraded data:',submissionURL6+memo_assignment6.paging_total].join('\n'));
            let message = `<br><span style="background:royalblue;color:white;padding:0 5px 0 5px;margin:0 5px 0 5px;">Reviewed ${ memo_assignment6[link6.sId].reviewCount } times.</span>`;
            //message += `<span style="color:#888;padding:0 5px 0 5px;margin:0 5px 0 5px;">Submitted ${ RelativeTime(memo_assignment6[link6.sId].createdAt) }</span>`;
            //message += `<br/><span style="color:#888;">${ SessionTime(memo_assignment6[link6.sId]) }</span>`
            let reviews_message = message,
                session_message = SessionTime(memo_assignment6[link6.sId]);
            message += session_message;
            AddMessage(link6,message,true);
            // this is not graded yet ... so we don't decrease the URL count for thisThread
            //window.pending_links.pending == window.pending_links.total
            window.pending_links.pending -= 1;
            //if ((window.pending_links.pending == 0)&(window.pending_links.total>0)){
            if (window.pending_links.pending === 0){
               ResolvingDone();
            }
            new_message.set_pending();

            link6.subm_ajax = PromiseGet(link6.submissionURL).then(((link60,reviews_message60,session_message60)=>{
                return (response)=>{
                    let json_resp = JSON.parse(response),
                        submUrl = Object.entries(json_resp.elements[0].submission.parts)[0][1].definition.url,
                        submFullName = json_resp.linked['onDemandSocialProfiles.v1'][0].fullName;
                    link60.submissionData = response;
                    link60.submissionJSON = json_resp;
                    link60.submUrl = submUrl;
                    link60.submFullName = submFullName;
                    let message = `<br><a href="${ submUrl }"><div style="background:darkgrey;color:#222;padding:5px;margin:0 5px;display:inline-block;border-radius:10px"><b>Submission</b>`;
                    message += `<br><b>Student Name:</b> ${ submFullName }`;
                    message += `<br><b>URL:</b> ${ submUrl }</div></a>`;
                    AddMessage(link60, reviews_message60 + message + session_message60,false);
                };})(link6,reviews_message,session_message));
        }
    }
    //.ur Reads and parses all of the Ungraded ... calls HaveUngraded
    function HavePagingTotal(memo_assignment4,link4){
        //console.log('Ungraded:\n'+link4.ungradedURL + memo_assignment4.paging_total);
        if (memo_assignment4[link4.sId]===undefined){
            link4.ur_ajax = PromiseGet(link4.ungradedURL + memo_assignment4.paging_total).then(((memo_assignment5,link5)=>{return (response)=>{
                link5.ur_response = response;
                let json_resp = JSON.parse(response);
                link5.ur_json = json_resp;

                //actually process all of the submissions
                for (var subm of json_resp.elements){
                    //console.log([subm.id,subm.reviewCount].join(" "));
                    //let sess = json_resp.linked['onDemandSessions.v1'].filter((sess)=>{if (sess.id==subm.sessionId){return true}else{return false}})[0];
                    let sess = json_resp.linked['onDemandSessions.v1'].filter(((sessionId)=>{return (sess)=>{if (sess.id==sessionId){return true;}else{return false;}};})(subm.sessionId))[0];
                    memo_assignment5[subm.id] = {reviewCount:subm.reviewCount, createdAt:subm.createdAt,
                                                 session:sess};
                }
                HaveUngraded(memo_assignment5, link5);
            };})(memo_assignment4,link4));
        } else {
            HaveUngraded(memo_assignment4, link4);
        }
    }

    //.pt Reads 1 Ungraded to get the Ungraded paging total ... calls HavePagingTotal
    function HaveCourseId(window_memo_course2,link2){
        if (window_memo_course2[link2.assignment].paging_total===undefined){
            link2.pt_ajax = PromiseGet(link2.ungradedURL+"1").then(((memo_assignment3,link3)=>{return (response)=>{
                link3.pt_response = response;
                let json_resp = JSON.parse(response);
                link3.pt_json = json_resp;
                memo_assignment3.paging_total = json_resp.paging.total;

                HavePagingTotal(memo_assignment3,link3);

            };})(window_memo_course2[link2.assignment],link2));
        } else {
            HavePagingTotal(window_memo_course2[link2.assignment],link2);
        }
    }

    function ScanForReviewLinks(){
        //convert non-link review URLs into links ... it may break the MathJax/LaTex in the paragraph
        let paras = document.querySelectorAll("div.rc-CML.styled p");
        for(let para of paras){
            html = para.innerHTML;
            let check = /(http.+:\/\/www\.coursera\.org\/learn\/[a-zA-z0-9-]*\/peer\/[a-zA-Z0-9-]*\/[a-zA-Z0-9-]*\/review\/[a-zA-Z0-9-_]+)/;
            let anchors = Array.from(para.innerHTML.matchAll(/[<]a [\s\S]{1,}[<]\/a[>]/g));
            let idx = 0;
            for (let anchor of anchors){
                html = html.replace(anchor,"<a " + idx + ">" + idx + "</a>");
                idx++;
            }
            var html = html.replace(check,'[a]<a href="$1">$1</a>[/a]');
            idx = 0;
            for (let anchor of anchors){
                html = html.replace("<a " + idx + ">" + idx + "</a>",anchor);
                idx++;
            }
            para.innerHTML = html;
        }

        let posted_links = document.querySelectorAll('.rc-CML a');
        window.posted_links = [];
        window.memo = {};
        window.pending_links = {'pending':0, 'total':0};

        window.Tampermonkey.CourseraForumPeerReview.Helper.count += 1 + ((posted_links.length||0) * 20);
        console.log('Peer Review Links ... '+window.Tampermonkey.CourseraForumPeerReview.Helper.count + ' ' + posted_links.length);
        if (window.Tampermonkey.CourseraForumPeerReview.Helper.count<15){
            setTimeout(ScanForReviewLinks,2000);
            return null;
        }
        let scribeEditors = document.querySelectorAll('.scribe-editor');
        if (scribeEditors.length>0){
            let now = new Date().toUTCString();
            scribeEditors[scribeEditors.length-1].innerHTML += `
<p>Hello,</p>
<p>2 RPSLS<br></p><p>Please remember to post these requests in&nbsp;<a href="https://www.coursera.org/learn/interactive-python-1/discussions/weeks/2/threads/VbGUE-C9EeWnSg7Jd1dn3w">the designated peer review thread</a>&nbsp;first, and review and follow the&nbsp;<a href="https://www.coursera.org/learn/interactive-python-1/discussions/all/threads/cQXJa7F3EembCxKg8Amuug">guidelines for seeking peer reviews</a>. Only make a new post if it's an emergency.</p>
<p>3 Guess the Number&nbsp;<br></p><p>Please remember to post these requests in <a href="https://www.coursera.org/learn/interactive-python-1/discussions/weeks/3/threads/HNV_z-C-EeWUBxLIsRX_2w">the designated peer review thread</a> first, and review and follow the <a href="https://www.coursera.org/learn/interactive-python-1/discussions/all/threads/cQXJa7F3EembCxKg8Amuug">guidelines for seeking peer reviews</a>. Only make a new post if it's an emergency.</p>
<p>4 Stopwatch</p><p>Please remember to post these requests in&nbsp;<a href="https://www.coursera.org/learn/interactive-python-1/discussions/weeks/4/threads/wF4fCeC-EeWmCgoFfSre2Q">the designated peer review thread</a>&nbsp;first, and review and follow the&nbsp;<a href="https://www.coursera.org/learn/interactive-python-1/discussions/all/threads/cQXJa7F3EembCxKg8Amuug">guidelines for seeking peer reviews</a>. Only make a new post if it's an emergency.</p>
<p>5 Pong<br></p><p>Please remember to post these requests in&nbsp;<a href="https://www.coursera.org/learn/interactive-python-1/discussions/weeks/5/threads/BGFQ5OC_EeWxqwqFyTkS7Q">the designated peer review thread</a>&nbsp;first, and review and follow the&nbsp;<a href="https://www.coursera.org/learn/interactive-python-1/discussions/all/threads/cQXJa7F3EembCxKg8Amuug">guidelines for seeking peer reviews</a>. Only make a new post if it's an emergency.</p>
<p>Thank you for understanding, and we hope you are enjoying the course! Keep up the good work!<br></p>`;
// <pre>$$\\style{background:green;color:white;padding:5px 16px 5px 5px;margin:5px;font-family:sans-serif}{\\text{Graded}}$$</pre>
// <pre>$$\\style{background:gold;color:brown;padding:5px 16px 5px 5px;margin:5px;font-family:sans-serif}{\\text{This submission was deleted}}$$</pre>
// <pre>$$\\style{background:royalblue;color:white;padding:5px 16px 5px 5px;margin:5px;font-family:sans-serif}{\\text{Reviewed x times as of ` + now + `}}$$</pre>
// `;
        }


        for (let a of posted_links){
            if (a.getAttribute('CourseraForumPeerReviewHelper')!==null){
                continue;
            }
            //console.log(a.href);
            let link = {};
            link.a = a;
            let groups = a.href.match(/coursera.org\/learn\/(\S*?)\/peer\/(\S*?)\/.*?\/review\/(\S*)/); // "...","interactive-python-1", "tajpO", "5bJwtlVREeqO6gqPIBlidw"
            link.groups = groups;
            if (groups){
                let wrapper = a.parentNode.parentNode.parentNode.parentNode;
                if (groups.length==4){
                    if ((wrapper.textContent.includes("\\text{Graded}"))|(wrapper.textContent.includes("\\text{This submission was deleted}"))){
                        //this link or post has been marked as graded.
                        //window.Tampermonkey.CourseraForumPeerReview.Helper.Threads.decreaseUrlCount(thisThread,link);
                        CourseraForumPeerReview_data.decreaseUrlCount(thisThread,link);
                        continue;
                    }
                    window.pending_links.pending += 1;
                    window.pending_links.total += 1;

                    let course = groups[1], assignment = groups[2], submission = groups[3];
                    //console.log([course,assignment,submission].join(' '));
                    //create window.memo["interactive-python-1"]
                    window.memo[course] = window.memo[course] || {};
                    //create window.memo["interactive-python-1"]["tajpO"]
                    window.memo[course][assignment] = window.memo[course][assignment] || {'submissions':{},'paging':0};
                    link.course = course;
                    link.assignment = assignment;
                    link.submission = submission;

                    // we have a review url so add it to the list
                    //window.Tampermonkey.CourseraForumPeerReview.Helper.Threads.addUrl(thisThread,link);
                    CourseraForumPeerReview_data.addUrl(thisThread,link);

                    if (window.memo[course].courseId===undefined){
                        link.cId_ajax = PromiseGet("https://www.coursera.org/api/onDemandCourseMaterials.v2/?q=slug&slug="+course)
                            .then(((window_memo_course1,link1)=>{return (response)=>{
                            link1.cId_response = response;
                            let json_resp = JSON.parse(response);
                            link1.cId_json = json_resp;

                            let courseId = json_resp.elements[0].id;
                            window_memo_course1.courseId = courseId;
                            let sId = [courseId,link1.assignment,link1.submission].join('~');
                            link.sId = sId;
                            //console.log(sId);

                            ////https://www.coursera.org/api/onDemandPeerAdminSubmissionSummaries.v1/?q=branch&branchId=n2zunIlgEeWSMw6QLoDNsQ&itemId=vqRMl&reviewingCompletedFilter=false&isDeletedFilter=false
                            let apiURL = "https://www.coursera.org/api/onDemandPeerAdminSubmissionSummaries.v1/?q=branch&branchId=" + courseId;
                            //submissionURL += "&itemId=" + link1.groups[2] + "&reviewingCompletedFilter=false&isDeletedFilter=false&fields=reviewCount&limit=";
                            //includes=session ... fields=sessionId,onDemandSessions.v1(startedAt,endedAt)
                            link.ungradedURL = apiURL + "&itemId=" + link1.assignment + "&includes=session&reviewingCompletedFilter=false&isDeletedFilter=false&fields=reviewCount,createdAt,sessionId,onDemandSessions.v1(startedAt,endedAt)&limit=";
                            //link.ungradedURL = apiURL + "&itemId=" + link1.assignment + "&reviewingCompletedFilter=false&isDeletedFilter=false&fields=reviewCount,createdAt&limit=";
                            link.gradedURL = apiURL + "&itemId=" + link1.assignment + "&reviewingCompletedFilter=true&isDeletedFilter=false&fields=reviewCount,createdAt&limit=";
                            link.deletedURL = apiURL + "&itemId=" + link1.assignment + "&isDeletedFilter=true&fields=reviewCount,isDeleted&limit=";

                            //let location_pathname = a.href.split("/"), //["https:", "", "www.coursera.org", "learn", "interactive-python-1", "item", "vqRMl", "review", "-Imm2bYkEeqWVwqO-2OnMw"]
                            //    apiUrl = `https://www.coursera.org/api/onDemandPeerSubmissions.v1/${ window.coursera.user.id }~${ window.coursera.courseId }~${ location_pathname[6] }~${ location_pathname[8] }/`;
                            //apiUrl += "?fields=submission%2ConDemandSocialProfiles.v1(fullName)&includes=submissionSchemas%2Cprofiles";
                            link.submissionURL = `https://www.coursera.org/api/onDemandPeerSubmissions.v1/${ window.coursera.user.id }~${ window.coursera.courseId }`;
                            link.submissionURL += `~${ link1.assignment }~${ link1.submission }/?fields=submission%2ConDemandSocialProfiles.v1(fullName)&includes=submissionSchemas%2Cprofiles`;

                            HaveCourseId(window_memo_course1, link1);

                        };})(window.memo[course], link));
                    } else {
                        HaveCourseId(window.memo[course],link);
                    }


                }
            }
            window.posted_links.push(link);
        }

        //make editing the question easier by adding an EditQues button to the action-area
        for (let d of document.querySelectorAll('.rc-DetailedQuestion')){
            //<button type="button" data-js="edit" aria-describedby="1343075~uh_Pun3OEeW-FwqtbgSK1Q~4T-RwnkWSga_kcJ5FgoGQg-post-legend">Edit</button>
            let detailedQuestionEdit = document.createElement("button");
                detailedQuestionEdit.onclick = function(){
                    //click on the dropdown
                    //this.parentNode.parentNode.parentNode.children[3].children[0].click();
                    this.parentNode.parentNode.parentNode.querySelector(".rc-Dropdown button").click();
                    //click on "Edit"
                    //this.parentNode.parentNode.parentNode.children[3].children[1].children[0].children[0].click();
                    this.parentNode.parentNode.parentNode.querySelector("[data-js='edit']").click();
                    setTimeout(()=>{
                        //click on "Editing for clarity"
                        //document.querySelector("#clarity").checked=true;
                        document.querySelector("#clarity").click();
                        //click on don't notify
                        //document.querySelector("#notify").checked=false;
                        //document.querySelector("#notify").value="off";
                        document.querySelector("#notify").click();
                        setTimeout(()=>{
                            document.querySelector("button.secondary[type='submit']").click();
                        },500);
                    },500);
                };
                detailedQuestionEdit.innerText="EditQues";
            //d.children[2].children[3].appendChild(detailedQuestionEdit);
            d.querySelector(".action-area").appendChild(detailedQuestionEdit);
        }
        //make editing posts easier by adding an EditPost button to the to the action-area
        for (let d of document.querySelectorAll(".reply-content")){
            let replyContentEdit = document.createElement("button");
                replyContentEdit.onclick = function(){
                    //click on the dropdown
                    this.parentNode.parentNode.querySelector(".rc-Dropdown button").click();
                    //click on "Edit"
                    this.parentNode.parentNode.parentNode.querySelector("[data-js='edit']").click();
                    setTimeout(()=>{
                        //click on "Editing for clarity"
                        document.querySelector("#clarity").click();
                        //click on don't notify
                        document.querySelector("#notify").click();
                        //click submit
                        setTimeout(()=>{
                            document.querySelector("button.secondary[type='submit']").click();
                        },500);
                    },500);
                };
                replyContentEdit.innerText="EditPost";
            //d.children[1].children[2].appendChild(replyContentEdit);
            d.querySelector(".action-area").appendChild(replyContentEdit);
        }


        if (window.pending_links.pending===0){
            ResolvingDone();
        }

    }

    // helper functions
    function CourseManager_CreateRowForKey(key){
        let item = document.createElement("div");
        item.setAttribute("class","item-row");
        item.style.padding = "10px";

            let item_div = document.createElement("div");
                let a_delete = document.createElement("a");
                a_delete.innerHTML = "<img width='16' src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Dialog-error.svg/48px-Dialog-error.svg.png' title='Delete this' />";
                //a_delete.onclick = ((k,div)=>{return ()=>{let p=confirm('Are you sure?');if(!p){return;}window.Tampermonkey.CourseraForumPeerReview.Helper.Threads.removeKey(k,div);};})(key,item);
                a_delete.onclick = ((k,div)=>{return ()=>{let p=confirm('Are you sure?');if(!p){return;}CourseraForumPeerReview_data.removeKey(k,div);};})(key,item);
            item_div.appendChild(a_delete);
            let spacer_div = document.createElement("div");
                spacer_div.innerHTML = "&nbsp;&nbsp;&nbsp;";
                spacer_div.style.display='inline';
            item_div.appendChild(spacer_div);
                let item_title = document.createElement("b");
                item_title.innerText = " Discussion Thread: [" + key.split(" ")[1] + "] ";
            item_div.appendChild(item_title);
                let thread_anchor = document.createElement("a");
                thread_anchor.setAttribute("href", window.location.origin + window.location.pathname.split("/").slice(0,3).join("/") + "/discussions/all/threads/" + key.split(" ")[1]);
                let threadId = key.split(" ")[1];
                thread_anchor.innerText = threadId;
                thread_anchor.ajax = PromiseGet("https://www.coursera.org/api/onDemandCourseForumQuestions.v1/"+window.coursera.user.id+"~"+window.coursera.courseId+"~"+threadId+"/?fields=content,state")
                    .then(((tAnchor)=>{return (response)=>{
                        let data = JSON.parse(response);
                        let title = data.elements[0].content.question;
                        //console.log(title + ' ' + data.elements[0].state.deleted)
                        if (not(data.elements[0].state.deleted===null)){
                            title = "[<span style='color:red;text-weight:bold;'>THREAD DELETED</span>]";
                        }
                        tAnchor.innerHTML = title;
                    };})(thread_anchor));
            item_div.appendChild(thread_anchor);
            item_div.appendChild(document.createElement("br"));
                //.rc-CML a
                let link_div = document.createElement("div");
                link_div.setAttribute("class","rc-CML");
                link_div.style.paddingLeft = "20px";
                //let threads = window.Tampermonkey.CourseraForumPeerReview.Helper.Threads.threads[key];
                let threads = CourseraForumPeerReview_data.threads()[key];
                for (var link of threads.links){
                    let split_link = link.split("/");
                    var review_item = document.createElement("a");
                    review_item.setAttribute("href",link);
                    review_item.innerText = [split_link[4],split_link[7],split_link[9]].join(" ");
                link_div.appendChild(review_item);
                link_div.appendChild(document.createElement("br"));
                }
            item_div.appendChild(link_div);
        item.appendChild(item_div);
        return item;
    }
    function CourseManager_CreateImportExportFooter(){
        let card_div_foot = document.createElement("div");
            let card_div_foot_import = document.createElement("a");
            card_div_foot_import.setAttribute("name","import");
            card_div_foot_import.href="#import";
            card_div_foot_import.innerText = "[Import Data from Text]";
            card_div_foot_import.onclick = ()=>{alert('import');};
        card_div_foot.appendChild(card_div_foot_import);
            let card_div_foot_space = document.createElement("span");
            card_div_foot_space.innerText = "   ";
        card_div_foot.appendChild(card_div_foot_space);
            let card_div_foot_export = document.createElement("a");
            card_div_foot_export.setAttribute("name","export");
            card_div_foot_export.href="#export";
            card_div_foot_export.innerText = "[Export Data to Text]";
            card_div_foot_export.onclick = ()=>{alert('export');};
        card_div_foot.appendChild(card_div_foot_export);
        card_div_foot.appendChild(document.createElement('br'));
            let card_div_foot_textarea = document.createElement('textarea');
            card_div_foot_textarea.setAttribute('cols',80);
            card_div_foot_textarea.setAttribute('rows',20);
            card_div_foot_textarea.setAttribute('id','CFPRH_raw_data');
            card_div_foot_textarea.style.marginLeft = "20px";
            card_div_foot_textarea.style.display = "none";
        card_div_foot.appendChild(card_div_foot_textarea);
        return card_div_foot;
    }
    // main function for Course Manager
    function CourseManagerAddPendingReviews(){
        let contents = document.querySelector('.contents');
        window.Tampermonkey.CourseraForumPeerReview.Manager.count += 1;
        console.log('Course Manager contents ... '+window.Tampermonkey.CourseraForumPeerReview.Manager.count);
        if (contents!==null){
            if (contents.children!==null){
                window.Tampermonkey.CourseraForumPeerReview.Manager.count += 20;
            }
        }
        if (window.Tampermonkey.CourseraForumPeerReview.Manager.count<15){
            setTimeout(CourseManagerAddPendingReviews,2000);
            return null;
        }
        while (contents.children.length > 3){
            // we've already added the child ... so remove child 4
            contents.removeChild(contents.children[3]);
        }


        //<div class="rc-PeerAssignmentList">
        let card = document.createElement("div");
        card.setAttribute("class","rc-ForumPeerReviewHelper");
            //<h5 class="tab-headline od-section"><span>Peer Review Submissions</span></h5>
            let h5 = document.createElement('h5');
            h5.setAttribute("class","tab-headline od-section");
                let h5span = document.createElement("span");
                h5span.innerText = "Coursera Forum Threads Pending Peer Reviews";
            h5.appendChild(h5span);
        card.appendChild(h5);
        contents.appendChild(card);

            //<div class="card-no-action comfy">
            let carddiv = document.createElement("div");
            carddiv.setAttribute("class","card-no-action comfy");
                let card_div_p = document.createElement("p");
                card_div_p.innerText = "These discussion threads contained pending peer review links ...";
            carddiv.appendChild(card_div_p);
        card.appendChild(carddiv);

        //API to find the thread title
        //e.g. https://www.coursera.org/api/onDemandCourseForumQuestions.v1/1~n2zunIlgEeWSMw6QLoDNsQ~GrXOPrX_Qmi1zj61__Jo1w/?fields=content
        //https://www.coursera.org/api/onDemandCourseForumQuestions.v1/1~courseId~threadId/?fields=content
        //cheating ... use window.coursera.courseId for the courseId
        //JSON.parse().content.question

        let thisCourse = window.location.pathname.split("/")[2];
        //for (let key of window.Tampermonkey.CourseraForumPeerReview.Helper.Threads.keys){
        let pendingKeys = {},
            deadKeys = {};
        for (let key of CourseraForumPeerReview_data.keys()){
            if (key.split(" ")[0]==thisCourse){
                //pendingKeys.push(key);
                let item = CourseManager_CreateRowForKey(key);
                pendingKeys[key] = item;
                carddiv.appendChild(item);
            }
        }

        //https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
        if (Object.keys(pendingKeys).length>0){
            window.onstorage = (event) => {
                // When local storage changes ...
                let storageKeys = CourseraForumPeerReview_data.keys();
                //console.log('========== Storage keys: ==========');
                //console.log(storageKeys);
                //console.log('Storage event keys' + Object.keys(event))
                //https://stackoverflow.com/questions/28230845/communication-between-tabs-or-windows

                // find keys that were removed
                for (let key of Object.keys(pendingKeys)){
                    if (storageKeys.indexOf(key)<0){
                        //we don't have to compare the courseId
                        let item = pendingKeys[key];
                        if (item.style.background!="#fcc"){
                            //item.parentNode.removeChild(item);
                            item.style.background="#fcc";
                            item.style.textDecoration = "line-through";
                            console.log('{}{} Key '+key+' removed');
                            deadKeys[key] = item;
                            delete pendingKeys[key];
                        }
                    }
                }

                // find keys that were revived
                for (let key of Object.keys(deadKeys)){
                    if (storageKeys.indexOf(key)>-1){
                        //we don't have to compare the courseId
                        let item = deadKeys[key];
                        if (item.style.background=="#fcc"){
                            item.style.background="lightyellow";
                            item.style.textDecoration = "";
                            console.log('{}{} Key '+key+' revived');
                            pendingKeys[key] = item;
                            delete deadKeys[key];
                        }
                    }
                }

                // add keys that were added
                for (let key of storageKeys){
                    if (Object.keys(pendingKeys).indexOf(key)<0){
                        if (key.split(" ")[0]==thisCourse){
                            let item = CourseManager_CreateRowForKey(key);
                            item.style.background="lightblue";
                            pendingKeys[key] = item;
                            carddiv.appendChild(item);
                            console.log('{}{} Key '+key+' added');
                        }
                    }
                }
            };
        }

        //let card_div_foot = CourseManager_CreateImportExportFooter();
        //carddiv.appendChild(card_div_foot);

        window.Tampermonkey.CourseraForumPeerReview.Helper.count = 14;
        setTimeout(ScanForReviewLinks,1000);
    }

    //https://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div
    function insertTextAtCaret(text) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                let node = document.createTextNode(text);
                range.insertNode( node );
                //window.temp = {'sel':sel, 'range':range, 'node':node};
                sel.collapseToEnd();
            }
        } else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = text ;
        }
    }
    function AddMentorWYSIWYGButtons(){
        //rc-CMLEditorToolbar
        let toolbars = document.querySelectorAll('div.rc-CMLEditorToolbar');
        for (let toolbar of toolbars){
            if (toolbar.getAttribute('MentorButtons') === null){
                //<button class="scribe-toolbar-button" style="background:green;color:white">G</button>
                let graded_button = document.createElement('button');
                    graded_button.setAttribute('class','scribe-toolbar-button');
                    graded_button.style.background="green";
                    graded_button.style.color="white";
                    graded_button.innerText = "G";
                    graded_button.onclick = ()=>{insertTextAtCaret("$$\\style{background:green;color:white;padding:5px 16px 5px 5px;margin:5px;font-family:sans-serif}{\\text{Graded}}$$");};
                toolbar.appendChild(graded_button);

                let deleted_button = document.createElement('button');
                    deleted_button.setAttribute('class','scribe-toolbar-button');
                    deleted_button.style.background="gold";
                    deleted_button.style.color="brown";
                    deleted_button.innerText = "D";
                    deleted_button.onclick = ()=>{insertTextAtCaret("$$\\style{background:gold;color:brown;padding:5px 16px 5px 5px;margin:5px;font-family:sans-serif}{\\text{This submission was deleted}}$$");};
                toolbar.appendChild(deleted_button);

                let reviewed_button = document.createElement('button');
                    reviewed_button.setAttribute('class','scribe-toolbar-button');
                    reviewed_button.style.background="royalblue";
                    reviewed_button.style.color="white";
                    reviewed_button.innerText = "R";
                    reviewed_button.onclick = ()=>{
                        let tim = prompt("Number of times reviewed?"),
                            now = new Date().toUTCString(),
                            msg = "$$\\style{background:royalblue;color:white;padding:5px 16px 5px 5px;margin:5px;font-family:sans-serif}{\\text{Reviewed " + tim + " times as of " + now + "}}$$";
                        insertTextAtCaret(msg);};
                toolbar.appendChild(reviewed_button);

                let invalid_button = document.createElement('button');
                    invalid_button.setAttribute('class','scribe-toolbar-button');
                    invalid_button.style.background="pink";
                    invalid_button.style.color="white";
                    invalid_button.innerText = "I";
                    invalid_button.onclick = ()=>{insertTextAtCaret("$$\\style{background:pink;color:white;padding:5px 16px 5px 5px;margin:5px;font-family:sans-serif}{\\text{Invalid Peer Review Link}}$$");};
                toolbar.appendChild(invalid_button);

                toolbar.setAttribute('MentorButtons','1');
            }
        }
    }

    if ([location_pathname[1],location_pathname.slice(3,6)].join(" ") == "learn discussions,all,threads"){
        // read each anchor ... see if it's a peer review link ... figure out how many reviews it still needs ... add that to the post
        setTimeout(ScanForReviewLinks,2000);
        //setTimeout(InsertCustomMentorMessage,2000);
        setInterval(AddMentorWYSIWYGButtons,2000);
    }

    if ([location_pathname[1],location_pathname[3]].join(" ")=="learn course-manager"){
        //https://www.coursera.org/learn/interactive-python-1/course-manager
        //setTimeout(CourseManagerAddPendingReviews,2000);
    }


})();
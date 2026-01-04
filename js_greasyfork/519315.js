// ==UserScript==
// @name        Automated MCM Population
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Fetch package diff from pipeline heat-map and populate mcm.
// @author      adityamz@
// @match      	https://code.amazon.com/version-sets/*/revisions/*
// @match      	https://pipelines.amazon.com/pipelines/*/heat_map
// @match      	https://pipelines.amazon.com/pipelines/*
// @match      	https://mcm.amazon.com/cms/new*
// @match      	https://mcm.amazon.com/cms/*/edit*
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519315/Automated%20MCM%20Population.user.js
// @updateURL https://update.greasyfork.org/scripts/519315/Automated%20MCM%20Population.meta.js
// ==/UserScript==

(function() {

    //========== This part is run in code.amazon.com ==========
    function addNewPackages(packageName, packageUrl) {
        unsafeWindow.packageDetails.push({
            "packageName": packageName,
            "type": "Added",
            "diffUrl": packageUrl,
            "owners": [],
            "commits": []
        });
    }

    function addRemovedPackages(packagename, packageUrl) {
        unsafeWindow.packageDetails.push({
            "packageName": packagename,
            "type": "Removed",
            "diffUrl": packageUrl,
            "owners": [],
            "commits": []
        });
    }

    function addBranchChangePackages(packageName, branchName, oldBranchName, startHash, endHash, diffUrl) {
               const asciURL = "https://pipelines.amazon.com/diff/pkg_changes?package_name=" + packageName
        + "&branch_name=" + branchName + "&old_commit_id=" + startHash + "&new_commit_id=" + endHash;
        GM.xmlHttpRequest({
            method: "GET",
            url: asciURL,
            onload: function() {
                if (this.readyState === 4 && this.status === 200) {
                   
                   const changes = [];

                   let resElem = document.createElement("div");
                   resElem.innerHTML = this.responseText;
                   const commits = resElem.querySelectorAll('li');
                    commits.forEach(function(commit){
                        let author = commit.querySelector('.author>a').textContent;
                        let description = commit.querySelector('.description').textContent;
                        let repoChangeId = commit.querySelector('.change-link>a').href.split('/').reverse()[0];
                        changes.push({author,description,repoChangeId});
                    });

                    let ownerList = [];
                    const commitList = [];
                    changes.forEach(function(change) {
                        const author = change.author;
                        const commit = author + '@: [' + change.description.split('\n')[0] + '](https://code.amazon.com/packages/'
                        + packageName + '/commits/' + change.repoChangeId + ')';
                        ownerList.push(author);
                        commitList.push(commit);
                    });
                    ownerList = ownerList.filter((v, i, a) => a.indexOf(v) === i);
                    const changeType = "Branch Changed (" + oldBranchName + " => " + branchName + ")";
                    unsafeWindow.packageDetails.push({
                        "packageName": packageName,
                        "type": changeType,
                        "diffUrl": diffUrl,
                        "owners": ownerList,
                        "commits": commitList
                    });
                }
            }
        });
    }

    function addModifiedPackages(packageName, branchName, startHash, endHash, diffUrl) {


        const asciURL = "https://pipelines.amazon.com/diff/pkg_changes?package_name=" + packageName
        + "&branch_name=" + branchName + "&old_commit_id=" + startHash + "&new_commit_id=" + endHash;


        GM.xmlHttpRequest({
            method: "GET",
            url: asciURL,
            onload: function(response) {
                //console.log(this.responseText);
                if(this.status === 400){
                    console.log(this.responseJSON);
                   $("#toastDiff").text("Diff API Throttled.");
                   $("#toastDiff").fadeIn("slow", function() { setTimeout(function() { $("#toastDiff").fadeOut("slow") }, 1500) });
                }
                if (this.readyState === 4 && this.status === 200) {

                    const changes = [];

                   let resElem = document.createElement("div");
                   resElem.innerHTML = this.responseText;
                   const commits = resElem.querySelectorAll('li');
                    commits.forEach(function(commit){
                        let author = commit.querySelector('.author>a').textContent;
                        let description = commit.querySelector('.description').textContent;
                        let repoChangeId = commit.querySelector('.change-link>a').href.split('/').reverse()[0];
                        changes.push({author,description,repoChangeId});
                    });
           
                    console.log("fetched details for :"+ packageName);
                    let ownerList = [];
                    const commitList = [];
                    changes.forEach(function(change) {
                        const author = change.author;
                        const commit = author + '@: [' + change.description.split('\n')[0] + '](https://code.amazon.com/packages/'
                        + packageName + '/commits/' + change.repoChangeId + ')';
                        ownerList.push(author);
                        commitList.push(commit);
                    });
                    ownerList = ownerList.filter((v, i, a) => a.indexOf(v) === i);
                    unsafeWindow.packageDetails.push({
                        "packageName": packageName,
                        "type": "Source Changed",
                        "diffUrl": diffUrl,
                        "owners": ownerList,
                        "commits": commitList
                    });
                }
            }
        });
    }

    function getPackageDiffOwners() {
        let allOwners = [];
        let diffOwnersString = "";
        let isPackageChecked = false;
        unsafeWindow.packageDetails.forEach(pkgDetail =>  {
            isPackageChecked = $("#" + pkgDetail.packageName + "Check").is(":checked");
            if (isPackageChecked) {
                diffOwnersString = diffOwnersString + "* [" + pkgDetail.packageName + "](https://code.amazon.com"
                    + pkgDetail.diffUrl + ") [" + pkgDetail.type + "]\n";
                pkgDetail.owners.forEach(owner => {
                    diffOwnersString = diffOwnersString + "  * " + owner + "\n";
                    allOwners.push(owner);
                })
            }
        })
        if (allOwners.length > 0) {
            allOwners = allOwners.filter((v, i, a) => a.indexOf(v) === i);
            diffOwnersString = diffOwnersString + "* All Owners\n";
            allOwners.forEach(owner => {
                diffOwnersString = diffOwnersString + "  * " + owner + "\n";
            })
        }
        unsafeWindow.commitOwners=JSON.stringify(allOwners)
        return copyToClipboard(diffOwnersString);
    }

    function getPackageDiffCommits() {
        let diffCommitsString = "";
        let isPackageChecked = false;
        unsafeWindow.packageDetails.forEach(pkgDetail =>  {
            isPackageChecked = $("#" + pkgDetail.packageName + "Check").is(":checked");
            if (isPackageChecked) {
                diffCommitsString = diffCommitsString + "* [" + pkgDetail.packageName + "](https://code.amazon.com"
                    + pkgDetail.diffUrl + ") [" + pkgDetail.type + "]\n";
                pkgDetail.commits.forEach(commit => {
                    diffCommitsString = diffCommitsString + "  * " + commit + "\n";
                })
            }

        })

        unsafeWindow.commitChanges = diffCommitsString;

        let pipelineDescription = getPipelineDescription(unsafeWindow.pipelineDetails, unsafeWindow.vsDetails)
        let commitDetailsDescription = getCommitDetailsDescription(diffCommitsString)

        return copyToClipboard(pipelineDescription + '\n'+commitDetailsDescription);
    }

    function copyToClipboard(text) {
        if (text !== "") {
            $("#toastDiff").text("Copied to clipboard!");
            $("#toastDiff").fadeIn("slow", function() { setTimeout(function() { $("#toastDiff").fadeOut("slow") }, 1500) });
            const textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand("copy");
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
            } finally {
                document.body.removeChild(textarea);
                return true;
            }
        } else {
            $("#toastDiff").text("No diff found! Try again.");
            $("#toastDiff").fadeIn("slow", function() { setTimeout(function() { $("#toastDiff").fadeOut("slow") }, 1500) });
            return false;
        }
    }

    unsafeWindow.packageDetails = [];
    unsafeWindow.pipelineDetails = {pipelineName:'',packages:[]};

    $('#packages tr.added-pkg').each(function(i, el) {
        const $tds = $(this).find("td");
        const packageUrl = $tds.eq(0).find("a").attr("href");
        const packageName = $tds.eq(0).text();
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", (packageName + "Check"));
        checkbox.setAttribute("style", "margin-right:5px");
        $tds.eq(0).prepend(checkbox);
        addNewPackages(packageName, packageUrl);
    })

    $('#packages tr.error').each(function(i, el) {
        const $tds = $(this).find('td');
        const packageUrl = $tds.eq(0).find('a').attr('href');
        const packageName = $tds.eq(0).text();
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", (packageName + "Check"));
        checkbox.setAttribute("style", "margin-right:5px");
        $tds.eq(0).prepend(checkbox);
        addRemovedPackages(packageName, packageUrl);
    })

    $('#packages tr.branch-change').each(function(i, el) {
        const $tds = $(this).find('td');
        const diffUrl = $tds.eq(5).find('a').attr('href').trim();
        const startHash = $tds.eq(1).find('a').attr('href').split('/')[4].trim();
        const endHash = $tds.eq(3).find('a').attr('href').split('/')[4].trim();
        const packageName = $tds.eq(0).text().trim();
        const oldBranchName = $tds.eq(6).text().split("->")[0].trim();
        const branchName = $tds.eq(6).text().split("->")[1].trim();
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", (packageName + "Check"));
        checkbox.setAttribute("style", "margin-right:5px");
        $tds.eq(0).prepend(checkbox);

        $(checkbox).change(function(){
            if(this.checked){
                addBranchChangePackages(packageName, branchName, oldBranchName, startHash, endHash, diffUrl);
            }

        })


    })

    $('#packages tr.source-change').each(function(i, el) {
        const $tds = $(this).find('td');
        const diffUrl = $tds.eq(5).find('a').attr('href').trim();
        const startHash = $tds.eq(1).find('a').attr('href').split('/')[4].trim();
        const endHash = $tds.eq(3).find('a').attr('href').split('/')[4].trim();
        const packageName = $tds.eq(0).text().trim();
        const branchName = $tds.eq(6).text().trim();
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", (packageName + "Check"));
        checkbox.setAttribute("style", "margin-right:5px");
        $tds.eq(0).prepend(checkbox);
        $(checkbox).change(function(){

            if(this.checked){
                addModifiedPackages(packageName, branchName, startHash, endHash, diffUrl);
            }


        })

    })


    function createMCMWithTemplate(mcm_id){
        let diffcommit = getPackageDiffCommits();
        let diffpackage = getPackageDiffOwners();

        window.location.href = "https://mcm.amazon.com/cms/new?from_template="+mcm_id+"&commitChanges="+encodeURIComponent(unsafeWindow.commitChanges)+"&commitOwners="+unsafeWindow.commitOwners+
        "&vsDetails=" + encodeURIComponent(JSON.stringify(unsafeWindow.vsDetails)) + "&pipelineDetails=" + encodeURIComponent(JSON.stringify(unsafeWindow.pipelineDetails));
       
    }

    function updateMCMWithExistingDraft(mcm_id){
       let diffcommit = getPackageDiffCommits();
        let diffpackage = getPackageDiffOwners();

        window.location.href = "https://mcm.amazon.com/cms/"+mcm_id+"/edit?commitChanges="+encodeURIComponent(unsafeWindow.commitChanges)+"&commitOwners="+unsafeWindow.commitOwners+
        "&vsDetails=" + encodeURIComponent(JSON.stringify(unsafeWindow.vsDetails)) + "&pipelineDetails=" + encodeURIComponent(JSON.stringify(unsafeWindow.pipelineDetails));
    }

    const vsRangeDiff = document.getElementById('vs_range_diff');
    if (vsRangeDiff) {
        const mainDiv = document.createElement('div');
        mainDiv.innerHTML = '<div><div style="overflow: visible;"><div class="text-right top-buffer-small" style="background: aliceblue;padding: 8px;filter: drop-shadow(2px 2px 2px black);"><div> <button type="button" class="btn btn-default" id="diffCommits"  style="width: 48%;float: left;">Copy Diff Commits</button> <button type="button" class="btn btn-default" id="diffOwners" style=" width: 48%;">Copy Diff Owners</button><input id="mcm_id" type="input" style="width: 100%;margin-top: 10px" placeholder="MCM template ID eg: MCM-78603254 or leave empty to use default template"/><button type="button" disabled class="btn btn-default" id="createMCM"  style="width: 100%;margin-top: 10px">Loading ...</button></div></div><div id="toastDiff" style="width: 180px; background-color: rgba(0, 0, 0, 0.8); height: 30px; position: absolute; margin: 20px 20px 20px 6%; border-radius: 50px; color: rgba(255, 255, 255, 0.8);text-align: center;padding-top: 6px; display: none;"></div></div></div>';
        vsRangeDiff.appendChild(mainDiv);

        unsafeWindow.pipelineDetails = JSON.parse(new URLSearchParams(window.location.search).get('pipelineDetails'));
        unsafeWindow.vsDetails = JSON.parse(new URLSearchParams(window.location.search).get('vsDetails'));

        //mark all the packages autobuilt in the pipeline as checked for diff creation
        window.addEventListener("load", ()=>{
            unsafeWindow.pipelineDetails.packages.forEach((pkg)=>{
                let pkgElements = document.querySelectorAll('#'+pkg+'Check');
                pkgElements.forEach((pkgElem)=>{
                     $(pkgElem).click();
                })
            });

            $('#createMCM').text('Create MCM');
            $('#createMCM').prop('disabled',false);

        });


        // adding click listener for diff commits
        $( "#diffCommits" ).click(function() {
            getPackageDiffCommits();
        });

        $( "#diffOwners" ).click(function() {
            getPackageDiffOwners();
        });

        $( "#createMCM" ).click(function() {
            const mcm_id = $('#mcm_id').val();
            if(mcm_id){
                updateMCMWithExistingDraft(mcm_id);
            }
            else {
              createMCMWithTemplate('7e9a85a5-bd0a-4560-8379-00a73ef82f1b');
            }  
        });


    }


    //========== This part is run in pipelines.amazon.com ==========
    function getVSDiffLink(href) {
        const splittedHref = href.split("&");
        const currVS = splittedHref[0].split("=")[1];
        const currRev = splittedHref[1].split("=")[1];
        const prevVS = splittedHref[3].split("=")[1];
        const prevRev = splittedHref[4].split("=")[1];
        const vsDetails = {};
        vsDetails.cur = currRev;
        vsDetails.prev = prevRev;
        vsDetails.name = prevVS;


        return "https://code.amazon.com/version-sets/" + currVS + "/revisions/" + currRev + "?previous=" + prevRev + "&previous_vs=" + prevVS +
            "&pipelineDetails=" + sessionStorage.getItem('pipelineDetails') +
            "&vsDetails=" + JSON.stringify(vsDetails);
    }

    const pipelineName = document.querySelector('.pipeline-name-header');

    if(pipelineName){
     unsafeWindow.pipelineDetails.pipelineName = pipelineName.innerText;
    }



    const packages = document.querySelector('#stage-name-Packages > div > h3 > span');
    if(packages){
        document.querySelectorAll('.autobuild .target-details > div.name').forEach((pkg)=>{
            let pkg_name = pkg.getAttribute('data-targetname').split('/')[0]
            unsafeWindow.pipelineDetails.packages.push(pkg_name)

        })

        sessionStorage.setItem("pipelineDetails",JSON.stringify(unsafeWindow.pipelineDetails))

    }

    const diffLinkElements = document.getElementsByClassName("diff-link");
    if (diffLinkElements && !packages) {
        for(let i=0; i < diffLinkElements.length; i++) {
            const element = diffLinkElements[i];
            const href = element.getElementsByTagName("a")[0].getAttribute("href");
            const vsDiffLink = getVSDiffLink(href);
            const aTag = document.createElement("a");
            aTag.setAttribute("href", vsDiffLink);
            aTag.innerText = "VS";
            element.appendChild(aTag);
        }
    }

    //this code part will run in mcm

    const insideMcm = $('.mcm-logo').length


    function getPipelineDescription(pipelineDetails, vsDetails){

        let pipelineDescription = ""

        pipelineDescription+= `## ${pipelineDetails.pipelineName}\n`
        pipelineDescription+= `- Pipeline Link - https://pipelines.amazon.com/pipelines/${pipelineDetails.pipelineName}\n`
        pipelineDescription+= `- Pipeline Diff -  [Link](https://pipelines.amazon.com/diff?new_name=${vsDetails.name}&new_revision=${vsDetails.cur}&new_type=VS&old_name=${vsDetails.name}&old_revision=${vsDetails.prev}&old_type=VS)\n`
        pipelineDescription+= `- Current VFI - ${vsDetails.name}@B${vsDetails.prev}\n`
        pipelineDescription+= `- VFI to be Deployed - ${vsDetails.name}@B${vsDetails.cur}\n`

        return pipelineDescription;





    }

    function getCommitDetailsDescription(commitDetails){

    let commitChanges = "";
        if(commitDetails){
          commitChanges+="#### Changes to be promoted in prod:\n"
          commitChanges+=commitDetails;
        }

        return commitChanges;
    }

    function updateDescription(commitDetails, vsDetails, pipelineDetails){
        const curr = $('#description').val()
        const rollbackId = "## Rollback Procedure";

        const pipelineDescription=getPipelineDescription(pipelineDetails, vsDetails);
        console.log(pipelineDescription);

        const pos = curr.indexOf('#### What is the purpose of this activity or change?')<0?curr.indexOf('Activity Details'):curr.indexOf('#### What is the purpose of this activity or change?');

        let commitChanges = getCommitDetailsDescription(commitDetails);

        let data = curr.substr(0, pos) + pipelineDescription+'\n'+ commitChanges+'\n' + curr.substr(pos);

        
        
        $('#description').val(data)

    }

    function updateMCMTitle(pipelineDetails){
        const title = $('#title')
        title.val(title.val()+pipelineDetails.pipelineName)

    }

    function addcommitOwners(commitOwners) {

        commitOwners.forEach((owner)=>{
            $('#add_approver_login').val(owner)
            $('#add_approver').click()
        })

    }

    if(insideMcm>0){
        const data = new URLSearchParams(window.location.search);
        const commitDetails = decodeURIComponent(data.get('commitChanges'));
        const versionSetDetails = JSON.parse(decodeURIComponent(data.get('vsDetails')));
        const pipelineDetails = JSON.parse(decodeURIComponent(data.get('pipelineDetails')));
        console.log(pipelineDetails);
        console.log(versionSetDetails);
        console.log(commitDetails);
        const commitOwners = JSON.parse(data.get('commitOwners'));
        updateMCMTitle(pipelineDetails);

        if(versionSetDetails){
            updateDescription(commitDetails, versionSetDetails, pipelineDetails)
        }
        if(commitOwners && commitOwners.length>0){
            addcommitOwners(commitOwners);
        }
    }

})();

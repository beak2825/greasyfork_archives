// ==UserScript==
// @name        Sentry Proguard Support
// @namespace   clientinfra
// @match       *://*sentry*/*
// @match       *://new-sentry.devops.xiaohongshu.com/*
// @version     1.2
// @grant       GM_xmlhttpRequest
// @description 由于Sentry查询Proguard消费链路过长，此插件可以帮助快捷下载Proguard文件
// @author      yijue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489209/Sentry%20Proguard%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/489209/Sentry%20Proguard%20Support.meta.js
// ==/UserScript==

const extractFirstProjectName = () => {
    const anchors = document.querySelectorAll('a');
    const pattern = /\/settings\/sentry\/projects\/(.*?)\//;

    for(const anchor of anchors) {
        const match = anchor.href.match(pattern);
        if(match) return match[1];
    }

    return null;
};

const getUuid = (images) => {
    for(const image of images){
        if(image.type === "proguard") return image.uuid;
    }

    return null;
};

const getBranch = (tags) => {
    for(const tag of tags) {
        if(tag[0] === "git_branch") return tag[1];
    }

    return null;
};

const getCommit = (tags) => {
    for(const tag of tags) {
        if(tag[0] === "git_commit") return tag[1];
    }

    return null;
};


async function addProguardLink() {
    try {
        const links = Array.from(document.links);
        const jsonLinkNode = links.find(link => link.textContent.startsWith("JSON"));

        if(!jsonLinkNode) return;

        const projectName = extractFirstProjectName();
        const jsonFilePath = jsonLinkNode.href;
        const jsonFileResponse = await fetch(jsonFilePath);
        const jsonFileData = await jsonFileResponse.json();
        const uuid = getUuid(jsonFileData.debug_meta.images);
        const branch = getBranch(jsonFileData.tags);
        const commit = getCommit(jsonFileData.tags);

        console.log(`branch: ${branch}
        commit: ${commit}`);

        if(!uuid) return;

        const baseUrl = `https://${window.location.host}/api/0/projects/sentry/${projectName}/files/dsyms/?file_formats=proguard&query=${uuid}`;
        console.log(baseUrl);
        const dsymsResponse = await fetch(baseUrl);
        const dsymsData = await dsymsResponse.json();

        const proguardNodeId = dsymsData ? dsymsData[0].id : null;

        if(!proguardNodeId) return;

        const proguardNodeUrl = `https://${window.location.host}/api/0/projects/sentry/${projectName}/files/dsyms/?id=${proguardNodeId}`;

        const proguardLinkNode = document.createElement('a');
        proguardLinkNode.textContent = 'ProGuard';
        proguardLinkNode.href = proguardNodeUrl;
        proguardLinkNode.className = jsonLinkNode.parentNode.className;
        jsonLinkNode.parentNode.parentNode.insertBefore(proguardLinkNode, jsonLinkNode.parentNode.nextSibling);
        console.log(proguardNodeUrl);
        if (branch && commit) {
            //增加branch链接
            const branchLinkNode = document.createElement('a');
            branchLinkNode.textContent = branch;
            branchLinkNode.href = `https://code.devops.xiaohongshu.com/android/REDAndroid/-/tree/${branch}`;
            branchLinkNode.className = jsonLinkNode.parentNode.className;
            // proguardLinkNode.parentNode.parentNode.insertBefore(branchLinkNode, proguardLinkNode.parentNode.nextSibling);
            jsonLinkNode.parentNode.parentNode.appendChild(branchLinkNode);
            //增加commit链接
            const commitLinkNode = document.createElement('a');
            commitLinkNode.textContent = commit;
            commitLinkNode.href = `https://code.devops.xiaohongshu.com/android/REDAndroid/-/commit/${commit}`;
            commitLinkNode.className = jsonLinkNode.parentNode.className;
            // branchLinkNode.parentNode.parentNode.insertBefore(commitLinkNode, branchLinkNode.parentNode.nextSibling);
            jsonLinkNode.parentNode.parentNode.appendChild(commitLinkNode);

        }
    }
    catch(error) {
        console.error('Fetching proguard link failed:', error);
    }
}

const waitForTabAndInsert = () => {
    const observer = new MutationObserver(() => {
        if(document.querySelector('.primary') !== null) {
            observer.disconnect();
            addProguardLink();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
}

waitForTabAndInsert();
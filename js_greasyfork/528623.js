// ==UserScript==
// @name         DeepSeek Chat to Telegraph
// @namespace    https://greasyfork.org/users/428487-cxumol
// @version      0.0.8
// @description  Add "Share" button to DeepSeek Chat to post your chat on Telegraph. 
// @description:zh-CN  DeepSeek 官网一键分享当前对话, 发布到 telegra.ph
// @author       cxumol
// @match        https://*.deepseek.com/a/chat/s/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAUCAMAAABPqWaPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAF3UExURU1r/k5r/k5s/k9s/k9t/lBt/lBu/lFu/lVx/lVy/lZy/ld0/lhz/lh0/lp2/lt3/lx3/l14/l55/l96/mB6/mB7/mJ9/mN9/miB/miC/mmB/mqD/muD/m6G/nGJ/nKK/nWM/nuR/n+U/oSZ/oWZ/ome/oqe/oue/o2g/o2h/o+h/o+i/pCi/pKk/pOl/pao/pip/pmq/pmr/p6v/qKx/qW0/qa1/qi2/qq4/qu5/qy5/q27/q+9/7G9/rG+/rTA/rXC/rbC/rnF/rrF/rvG/7zH/rzI/r3I/sXO/srS/svU/szU/szV/s3V/tDX/tHZ/tLZ/tPa/tPb/tTa/tXc/9jf/9ng/tzi/uLn/+Pn/uPn/+Po/+To/uTp/uTp/+Xp/ufr/+js/urt/uvu/uvu/+zv/u3w/+7w/u7w/+/y/vHz/vP1//T2//b3/vb4//f4/vf5//j5/vn6//r7//v7/vv8//z8//z9//39/v39//7+/v7+/////1hnCtYAAAEJSURBVBgZdcHVQgJRAEXRrYKJhZ3Y3d3dCnZ3d4sKnI937mC9sBaKBP362B+qTUyr9J4GZCAjeLL4GGzhW2lQFmT4wJHYut3vBFceZB5IQrbLYXB2aTWDcW0Uk3whIdt9ARA9pbOqcum2BPeTkPHRhG1btisXM0KGj7DMT9mWSAghowJSJ4uADtnuYRdZbuMg/W4pCaJGZatmAVlmsTQe1gOOQRlrzCBLNw431Hgx3HPXAb0wjxQK1lGoMv6klcABevDEQPzWezP/eQKoASP23N/OP5viCCjNh2lphB8xvRIruevSchZtkgYIyxiThGz+7CHpOYeUib7OniMZKGznRnrbO37VLxTJF42Gi4sQ++AKAAAAAElFTkSuQmCC
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.telegra.ph
// @require      https://update.greasyfork.org/scripts/506699/1534808/marked.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528623/DeepSeek%20Chat%20to%20Telegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/528623/DeepSeek%20Chat%20to%20Telegraph.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(`UserScript "DeepSeek Chat to Telegraph" loaded, version: ${GM_info.script.version}`);
    const _selectors={"titleBar":".f8d1e4c0"}; // Need update if chat.deepseek.com update; no gentle way to locate the title bar, pls lemme know if u got better idea.
    const _ds_headers={"x-client-platform":"web","x-client-version":"1.2.0-sse-hint","x-client-locale":"zh_CN","x-app-version":"20241129.1"}; // Alternative way bypassing 403 is to hook XHR https://greasyfork.org/scripts/523474
    // Function to create the overlay for displaying the Telegraph URL
    function showShareOverlay(url) {
        var overlay = document.createElement("div");
        var $=q=>overlay.querySelector(q);
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        overlay.innerHTML = `
            <div style="background-color: white; padding: 20px; border-radius: 5px; text-align: center;">
                <p>Share this link:</p>
                <p><a href="${url}" target="_blank">${url}</a></p>
                <button class="copy-button" style="margin-right:10px;">Copy URL</button>
                <button class="close-button">Close</button>
                <button class="delete-button" style="margin-left:10px;color:maroon;">Delete</button>
            </div>
        `;
        document.body.appendChild(overlay);
        $(".copy-button").onclick=()=>navigator.clipboard.writeText(url).then(()=>alert("URL copied!"));
        $(".close-button").onclick=()=>overlay.remove();
        $(".delete-button").onclick=()=>deleteTelegraph(url).then(()=>alert(`${url} is deleted!\nClick "Share" to share it again.`));
    }

    // Convert DeepSeek chat messages to Telegraph content format.
    function convertToTelegraphContent(messages) {
        let tgphData = [];
        messages.forEach(message => {
            const {role,content} = message; // role: system | assistant | user
            let text = `\`${role}\`: ${content}`;
            if(role.toLowerCase()==="assistant"&&message.thinking_enabled&&message.thinking_content)text=`\`${role}\`: \n\n${message.thinking_content.split("\n\n").map(e=>"> "+e).join("\n\n")}\n\n${content}`;
            tgphData = tgphData.concat(md2TgphNode(text));
        }); //console.log(tgphData);
        return JSON.stringify(tgphData);
    }
    var SUPPORTED_TGPH_TAGS = ["a","aside","b","blockquote","br","code","em","figcaption","figure","h3","h4","hr","i","iframe","img","li","ol","p","pre","s","strong","u","ul","video"];
    function md2TgphNode(c) {
        c=c.trim();
        var d=new DOMParser().parseFromString(marked.parse(c),"text/html");
        if(!d)throw new Error("Failed to parse HTML to DOM");
        var n=domToNode(d.body);
        if(!n)throw new Error(`Empty node content: ${d.body.textContent}`);
        if(typeof n==="string")return n;
        if(!n.children)throw new Error(`Empty content: ${c}`);
        return n.children;
    }
    function domToNode(el) {
        if(el.nodeType==Node.TEXT_NODE){var t=el.textContent;return el.parentElement?.tagName==="P"&&t?t.replace("\n"," "):t||null;}
        if(!(el instanceof Element))return null;
        var tg=el.tagName.toLowerCase();
        if(!SUPPORTED_TGPH_TAGS.includes(tg)&&tg!=="body") console.log("domToTelegraphNode: unsupported tag: ",el.tagName,el.innerHTML);
        var n={tag:tg};
        if(tg==="code"&&el.parentElement?.tagName==="PRE")n.tag="pre";
        var h=el.getAttribute("href");if(h!=null)n.attrs={href:h};
        var s=el.getAttribute("src");if(s!=null){n.attrs=n.attrs||{};n.attrs.src=s;}
        if(el.childNodes.length){
            n.children=[];
            for(var i=0;i<el.childNodes.length;i++){
                var cN=domToNode(el.childNodes[i]); if(cN&&cN!=="\n"&&(typeof cN==="string"||cN.tag))n.children.push(cN);
            }
        }
        return n;
    }

    // Upload chat to Telegraph.
    async function getTgphToken(){
        let token = GM_getValue('tgphToken');if(token){console.log("telegra.ph token from storage:", token);return token;}
        const data = await fetch('https://api.telegra.ph/createAccount?short_name=ds2ph&author_name=DeepSeekToTelegraph').then(r=>r.json());if(!data.ok)throw new Error(`Telegraph API error: ${data.error}`);
        token = data.result.access_token;
        GM_setValue('tgphToken', token); console.log("create new telegra.ph token:", token);
        return token;
    }
    async function uploadToTelegraph(title,content){
        var telegraphAccessToken=await getTgphToken();
        try{const r=await GM.xmlHttpRequest({method:'POST',url:'https://api.telegra.ph/createPage',headers:{'Content-Type':'application/json'},
                                             data:JSON.stringify({access_token:telegraphAccessToken,title:title,content:content,return_content:true,author_name:"DeepSeek Chat"}),responseType:'json',
                                             onerror:(e)=>{throw new Error(`Telegraph API request failed: ${e.status}`)}});
            if(r.status>299||r.status<200)throw new Error(`Telegraph API error: ${r.status}`)
            const data=r.response; if(!data.ok)throw new Error(`Telegraph API error: ${data.error}`);
            return `https://telegra.ph/${data.result.path}`;
        }catch(e){console.error("Error uploading to Telegraph:",e);throw e}
    }
    function deleteTelegraph(postUrl){
        var telegraphAccessToken=GM_getValue('tgphToken'); if(!telegraphAccessToken)throw new Error("telegraphAccessToken NOT FOUND, cannot delete the post!");
        return fetch(`https://api.telegra.ph/editPage/${postUrl.split('/').pop()}?access_token=${telegraphAccessToken}&title=Removed&author_name=&content=[{"tag":"p","children":["removed by author"]}]`
                    ).then(r=>r.json()).then(j=>{if(!j.ok)throw new Error(j.error);return j;}).catch(e=>{console.error("Error deleting Telegraph:",e);throw e;});
    }

    // Fetch chat history from DeepSeek API
    async function fetchChatHistory() {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("User token not found. Please make sure you are logged in.");
        const parsedToken = JSON.parse(token);

        // 1. Get current chat session ID.
        const sessionId = window.location.pathname.split('/').pop();
        if(sessionId.length<30)throw new Error(`Session ID not found from address bar, got: ${sessionId}`);
        // 2. Fetch messages using the session ID.
        const messagesResponse = await fetch(`https://chat.deepseek.com/api/v0/chat/history_messages?chat_session_id=${sessionId}`,
                                             {credentials: "include",headers:{"Authorization":`Bearer ${parsedToken.value}`,..._ds_headers}});
        if (!messagesResponse.ok) throw new Error(`Failed to fetch chat messages: ${messagesResponse.status}`);
        const messagesData = await messagesResponse.json();
        return { title: messagesData.data.biz_data.chat_session.title,
            messages: messagesData.data.biz_data.chat_messages};
    }

    // Main function to add the share button.
    function addShareButton() {
        const titleContainer = document.querySelector(_selectors.titleBar); //  The container of title.
        if (titleContainer && !document.getElementById('share-chat-button')) {
            const shareButton = document.createElement('button');
            shareButton.id = 'share-chat-button';
            shareButton.textContent = 'Share';
            shareButton.style.cssText = `
                margin-left: 10px;
                padding: 5px 10px;
                border-radius: 4px;
            `;
            titleContainer.appendChild(shareButton);

            shareButton.addEventListener('click', async () => {
                try {
                    shareButton.disabled = true;
                    shareButton.textContent = "Sharing...";
                    const chatHistory = await fetchChatHistory();
                    const telegraphContent = convertToTelegraphContent(chatHistory.messages);
                    const telegraphUrl = await uploadToTelegraph(chatHistory.title, telegraphContent);
                    showShareOverlay(telegraphUrl);
                } catch (error) {
                    alert(`Error sharing chat: ${error.message}`);
                    console.error(error);
                } finally {
                    shareButton.disabled = false;
                    shareButton.textContent = 'Share';
                }
            });
        }
    }
    // Observe changes in the DOM to add the button when the title bar appears.
    const observer = new MutationObserver(()=>addShareButton());
    observer.observe(document.body, { childList: true, subtree: true });
    // also call addShareButton for first time run
    addShareButton();
})();


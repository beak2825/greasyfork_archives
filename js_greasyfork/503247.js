// ==UserScript==
// @name         bili_comment_emoji2meow
// @namespace    http://tampermonkey.net/
// @version      2024-08-11
// @description  替换掉不喜欢的b站评论emoji.
// @author       the doticworks
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @resource
// @supportURL haha
// @contributionURL 
// @contributionAmount
// @compatible
// @incompatible
// @antifeature
// @downloadURL https://update.greasyfork.org/scripts/503247/bili_comment_emoji2meow.user.js
// @updateURL https://update.greasyfork.org/scripts/503247/bili_comment_emoji2meow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        getfeedinit();
    }
})();
async function getfeedinit(){
    function wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(ms)
            }, ms)
        })
    }
    let cmts= null;
    while(!cmts){
        await wait(1000);
        cmts=document.getElementsByTagName('bili-comments')[0];
    }
    let feed= cmts.shadowRoot.getElementById('feed');
    main_feedinit(feed);
}


function main_feedinit(nodefeed){
    feedop(nodefeed);feedop(nodefeed);

    var config = {childList: true};
    var callback = function(mutationsList) {
        setTimeout(()=>{feedop(nodefeed);feedop(nodefeed);},1000);
    };
    var observer = new MutationObserver(callback);
    observer.observe(nodefeed, config);
}
function feedop(nodefeed) {nodefeed.getElementsByTagName('bili-comment-thread-renderer').forEach(thrd=>threadop(thrd));}
function threadop(nodethread) {
    let mainrichtext=nodethread.shadowRoot.querySelector("#comment").shadowRoot.querySelector('#content').getElementsByTagName('bili-rich-text')[0];
    bilirichtextops(mainrichtext);
    let replyexpander=nodethread.shadowRoot.querySelector('#replies').children[0].shadowRoot.querySelector('#expander-contents');
    replyexpanderinit(replyexpander);

}
function replyexpanderinit(expandable) {
    replyexpanderop(expandable);
}
function replyexpanderop(expandable) {expandable.getElementsByTagName('bili-comment-reply-renderer').forEach(rep=>replyrdop(rep));}
function replyrdop(reprd) {
    let reprichtext=reprd.shadowRoot.querySelector('#main').children[1];
    bilirichtextops(reprichtext);
}

function bilirichtextops(noderichtext){
    let nodecontent=noderichtext.shadowRoot.querySelector("#contents");
    let emojiban=['[微笑]','[捂脸]','[OK]','[喜极而泣]','[吃瓜]','[思考]','[笑哭]','[辣眼睛]','[星星眼]','[疑惑]','[妙啊]','[抠鼻]','[呆]','[脸红]','[大笑]','[嗑瓜子]'];
    nodecontent.getElementsByTagName('img').forEach(ele=>{
        if(emojiban.indexOf(ele.alt)> -1){
            let meowspan= document.createElement('span');
            meowspan.innerText='喵~';
            nodecontent.replaceChild(meowspan,ele);
        }
    });
}
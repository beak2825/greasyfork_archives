// ==UserScript==
// @name         Google result tweaker
// @namespace    https://www.topcl.net/myapps/write-a-user-script-to-tweaker-google-result.html
// @version      0.24
// @description  Mark & re order spam sites
// @author       VJ
// @match        https://www.google.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375647/Google%20result%20tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/375647/Google%20result%20tweaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const resultSections=document.querySelectorAll('#rso');
    if(0==resultSections.length){ console.warn("No result found, google has page layout update?"); return; }
    const lastResultSection =resultSections[resultSections.length-1];

    const BlockList=[
        {hostname:"csdn.net",reason:"低质量社区",tobottom:true},
        {hostname:"iteye.com",reason:"低质量社区",tobottom:true},

        {hostname:"softonic.com",reason:"低相关度",tobottom:true},

        {hostname:"logphp.com",reason:"链接站",tobottom:true},

        {hostname:"outofmemory.cn",reason:"采集站",tobottom:true},
        {hostname:"ctolib.com",reason:"采集站",tobottom:true},
        {hostname:"voidcn.com",reason:"采集站",tobottom:true},
        {hostname:"saowen.com",reason:"采集站",tobottom:true},
        {hostname:"bbsmax.com",reason:"采集站",tobottom:true},

        {hostname:"stackoverrun.com",reason:"机翻采集站",tobottom:true},
        {hostname:"stackovernet.com",reason:"机翻采集站",tobottom:true},
        {hostname:"codeday.me",reason:"机翻采集站",tobottom:true},
        {hostname:"landcareweb.com",reason:"机翻采集站",tobottom:true},
        {hostname:"xbuba.com",reason:"机翻采集站",tobottom:true},
        {hostname:"kutu66.com",reason:"机翻采集站",tobottom:true},
        {hostname:"qastack.cn",reason:"机翻采集站",tobottom:true},
        {hostname:"stackoom.com",reason:"机翻采集站",tobottom:true},
        {hostname:"thinbug.com",reason:"机翻采集站",tobottom:true},

        {hostname:"91flac.com",reason:"不解释",tobottom:true},
        {hostname:"wenku.baidu.com",reason:"不解释",tobottom:true},
    ];

    const ExtractHandler=(resultContainer)=>resultContainer.querySelectorAll('div.g');

    const MatchHandler=(result,config)=>{
        const a=result.querySelector('div.rc div.r a');
        return 0 <= a.hostname.indexOf(config.hostname);
    };

    const BlockHandler=(result,config)=>{
        result.style.opacity='.5';
        const summary = result.querySelector('span.st');
        summary.innerHTML=`[${config.reason}]<br />`+summary.innerHTML
        if(config.tobottom){ lastResultSection.appendChild(result); }
    };

    const handledEntries=[];

    for(let c=0; c<resultSections.length; ++c)
    {
        const resultContainer = resultSections[c];
        //TODO: Skip links entry
        const items = ExtractHandler(resultContainer);
        for(let i=0;i<items.length;++i)
        {
            const resultEntry = items[i];
            if(-1!=handledEntries.indexOf(resultEntry)) continue;
            for(let j=0;j<BlockList.length;j++){
                const confEntry=BlockList[j];
                if(MatchHandler(resultEntry,confEntry)){
                    BlockHandler(resultEntry,confEntry);
                    handledEntries.push(resultEntry);
                    --i;
                    break;
                }
            }

        }
    }
})();
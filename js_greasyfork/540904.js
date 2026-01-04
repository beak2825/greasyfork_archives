// ==UserScript==
// @name LIHKG CSS
// @namespace github.com/openstyles/stylus
// @version 1.0.2
// @description A new userstyle
// @author Me
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.lihkg.com/*
// @downloadURL https://update.greasyfork.org/scripts/540904/LIHKG%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/540904/LIHKG%20CSS.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    
    a[href*="thread/"][title="前往最後回覆"] {
        background:#e1e1e1;
        color:#040708;
        font-size:80%;
        transition-duration: 0s;
        margin-left: -6px;
    }
    
    a[href*="thread/"][title="前往最後回覆"]:hover {
        background:#e1e1e1;
        color:#040708;
        transition-duration: 0s;
        outline: 2px solid #e27312;
        outline-offset:-2px;
    }
    form[action="#"] select:last-child {
        &, & > option {
            background: #68c2df;
            color: #18184e;
            opacity: 1;
            z-index: 0;
            appearance: none;
            padding: 0;
            border: 1px solid #66c2e8;
            box-sizing: border-box;
            text-align: center;
            outline: 0 !important;
        }
    }

    div[style]:only-of-type ~ a[class][href="/recall"],
    div[style]:only-of-type ~ a[class][href="/following"],
    div[style]:only-of-type ~ a[class][href="/outbox"],
    div[style]:only-of-type ~ a[class][href="/bookmarks"]
    {
        width: calc(50% - 4px);
        min-width: max-content;
        display: inline-block;
        padding: .4rem .5rem .4rem .75rem;
        display: inline-flex;
        font-size:80%;
      
    }
    
    div[class]:has(> div[style]:only-of-type ~ a[class][href="/recall"]) {
        
        
        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        column-gap: 0;
        /* margin-right: 12px; */
        padding: 16px 6px 6px 0px;
        background: #262626;
        margin-bottom: 16px;
        row-gap: 6px;
        
    }
    
    form[action] > i.i-magnify:first-child + input[type="text"] {
        
        font-size:80%;
        border: 1px solid;
        background: #424343 !important;
        border-color: #767676 !important;
        color: inherit;
        margin: 0;
        padding-left: 2.4rem;
        outline: 0 !important;
    }
    
    form[action] > i.i-magnify:first-child + input[type="text"]::placeholder {
        color: inherit;
        opacity: 0.66;
    }
    
    
    div:has(> form[action] > i.i-magnify:first-child + input[type="text"]) {
        padding:0 !important;
    }
    
    
    div:has(> a[href="/category/1"][class]:first-child + a[href^="/category/"][class]) {
        display:inline-flex;
        flex-direction:row;
        flex-wrap:wrap;
        justify-content: flex-start;
        gap: 0;
        box-sizing: border-box;
        column-gap: .2rem;
        row-gap: 0;
        margin-right: 12px;
        position:relative;
        
        & > a[href^="/category/"][class]  {
            padding: .5rem .5rem .5rem .5rem;
            display:inline-flex;
            width: calc(33.333% - 4px);
            min-width: max-content;
            box-sizing: border-box;
            font-size:80%;
            justify-content: center;

        }
    
        
        & >div{
            width:100%;
            display:block;
            
            box-sizing: border-box;
            padding: .5rem .5rem .5rem .5rem;
            color:#f5ee5e;
            text-align:center;
            font-size:80%;
        }
        
    }
    
   ._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU ._3D2lzCKDMcdgEkexZrTSUh, ._21IQKhlBjN2jlHS_TVgI3l ._3BIUupv2eU60xfDD6DeVK1 ._3D2lzCKDMcdgEkexZrTSUh {
       
       --dot-size: 7px;

         ._3-exuX3T7_fUJinbY7Y33X {
            height: var(--dot-size);
            width: var(--dot-size);
        }
    
        
        
         ._1t2QIlJNP-zhqLqtFipWJG {
            height: var(--dot-size);
            width: var(--dot-size);
        }
    }
    
    ._1ND4IvZZQRokGesVd9vq9W {
        display: none;
    }
    
    
    div[class]:has(> ul[class]:only-child > li[class] > a[href$="=now"]:first-child) {
 
        height: initial;
        line-height: initial; 
        ul[class]:only-child {
            font-size:80%;
            a[href] {
                height: auto;
                line-height: 2rem;
            }
        }
    }
    
    
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

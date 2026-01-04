// ==UserScript==
// @name         owohost
// @namespace    https://github.com/adrianmgg
// @version      1.0.1
// @description  owo
// @author       amgg
// @match        https://cohost.org/*
// @icon         https://cohost.org/static/a4f72033a674e35d4cc9.png
// @grant        none
// @run-at       document-start
// @compatible   firefox
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454589/owohost.user.js
// @updateURL https://update.greasyfork.org/scripts/454589/owohost.meta.js
// ==/UserScript==

/* eslint no-multi-spaces: "off" */

(function() {

// =============================================================================
// https://github.com/Schotsl/Uwuifier
// (MIT license)
// version 4.0.6
// built with:
//   "import * as esbuild from 'https://deno.land/x/esbuild@v0.15.10/mod.js';await esbuild.build({entryPoints: ['index.ts'], bundle: true, format: 'iife', minify: true, platform: 'browser', globalName: 'Uwuifier'}); Deno.exit(0);" | deno run -A -
//   (then swap `var Uwuifier =` for `const {default:Uwuifier} =` at the start)
// =============================================================================
const {default:Uwuifier} =
        // eslint-disable-next-line
        (()=>{var g=Object.defineProperty;var C=Object.getOwnPropertyDescriptor;var v=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var L=(i,t)=>{for(var e in t)g(i,e,{get:t[e],enumerable:!0})},W=(i,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of v(t))!x.call(i,s)&&s!==e&&g(i,s,{get:()=>t[s],enumerable:!(r=C(t,s))||r.enumerable});return i};var O=i=>W(g({},"__esModule",{value:!0}),i),d=(i,t,e,r)=>{for(var s=r>1?void 0:r?C(t,e):t,n=i.length-1,a;n>=0;n--)(a=i[n])&&(s=(r?a(t,e,s):a(s))||s);return r&&s&&g(t,e,s),s};var P={};L(P,{default:()=>f});var c=class{constructor(t){this.seeder=this.xmur3(t)}random(t=0,e=1){if(t>e)throw new Error("The minimum value must be below the maximum value");if(t===e)throw new Error("The minimum value cannot equal the maximum value");return this.denormalize(this.sfc32(),t,e)}randomInt(t=0,e=1){return Math.round(this.random(t,e))}denormalize(t,e,r){return t*(r-e)+e}xmur3(t){let e=1779033703^t.length;for(let r=0;r<t.length;r++)e=Math.imul(e^t.charCodeAt(r),3432918353),e=e<<13|e>>>19;return()=>(e=Math.imul(e^e>>>16,2246822507),e=Math.imul(e^e>>>13,3266489909),(e^=e>>>16)>>>0)}sfc32(){let t=this.seeder(),e=this.seeder(),r=this.seeder(),s=this.seeder();t>>>=0,e>>>=0,r>>>=0,s>>>=0;let n=t+e|0;return t=e^e>>>9,e=r+(r<<3)|0,r=r<<21|r>>>11,s=s+1|0,n=n+s|0,r=r+n|0,(n>>>0)/4294967296}};function I(i){return/^\p{L}/u.test(i)}function _(i){return i===i.toUpperCase()}function E(i){let t=0,e=0;for(let r of i)!I(r)||(_(r)&&e++,t++);return e/t}function b(){return(i,t)=>{let e=i[t],r=0;Object.defineProperty(i,t,{get:()=>e,set:a=>{if(typeof a=="object"&&(r=Object.values(a).reduce((u,h)=>u+h)),a<0||r<0||a>1||r>1)throw new Error(`${t} modifier value must be a number between 0 and 1`);e=a},enumerable:!0,configurable:!0})}}function w(i){if(!i||/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(i)||/%[^0-9a-f]/i.test(i)||/%[0-9a-f](:?[^0-9a-f]|$)/i.test(i))return!1;let t=i.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);if(!t)return!1;let[,e,r,s]=t;if(!(e&&e.length&&s.length>=0))return!1;if(r&&r.length){if(!(s.length===0||/^\//.test(s)))return!1}else if(/^\/\//.test(s))return!1;return!!/^[a-z][a-z0-9\+\-\.]*$/.test(e.toLowerCase())}function y(i){return i.charAt(0)==="@"}var o={SPACES:{faces:.05,actions:.075,stutters:.1},WORDS:1,EXCLAMATIONS:1},f=class{constructor({spaces:t=o.SPACES,words:e=o.WORDS,exclamations:r=o.EXCLAMATIONS}={spaces:o.SPACES,words:o.WORDS,exclamations:o.EXCLAMATIONS}){this.faces=["(\u30FB`\u03C9\xB4\u30FB)",";;w;;","OwO","UwU",">w<","^w^","\xDAw\xDA","^-^",":3","x3"];this.exclamations=["!?","?!!","?!?1","!!11","?!?!"];this.actions=["*blushes*","*whispers to self*","*cries*","*screams*","*sweats*","*twerks*","*runs away*","*screeches*","*walks away*","*sees bulge*","*looks at you*","*notices buldge*","*starts twerking*","*huggles tightly*","*boops your nose*"];this.uwuMap=[[/(?:r|l)/g,"w"],[/(?:R|L)/g,"W"],[/n([aeiou])/g,"ny$1"],[/N([aeiou])/g,"Ny$1"],[/N([AEIOU])/g,"Ny$1"],[/ove/g,"uv"]];this._spacesModifier=t??o.SPACES,this._wordsModifier=e??o.WORDS,this._exclamationsModifier=r??o.EXCLAMATIONS}uwuifyWords(t){return t.split(" ").map(s=>{if(y(s)||w(s))return s;let n=new c(s);for(let[a,u]of this.uwuMap)n.random()>this._wordsModifier||(s=s.replace(a,u));return s}).join(" ")}uwuifySpaces(t){let e=t.split(" "),r=this._spacesModifier.faces,s=this._spacesModifier.actions+r,n=this._spacesModifier.stutters+s;return e.map((u,h)=>{let p=new c(u),S=p.random(),[l]=u;if(S<=r&&this.faces)u+=" "+this.faces[p.randomInt(0,this.faces.length-1)],M();else if(S<=s&&this.actions)u+=" "+this.actions[p.randomInt(0,this.actions.length-1)],M();else if(S<=n&&!w(u)){let m=p.randomInt(0,2);return(l+"-").repeat(m)+u}function M(){if(l===l.toUpperCase()&&!(E(u)>.5))if(h===0)u=l.toLowerCase()+u.slice(1);else{let m=e[h-1],A=m[m.length-1];if(!new RegExp("[.!?\\-]").test(A))return;u=l.toLowerCase()+u.slice(1)}}return u}).join(" ")}uwuifyExclamations(t){let e=t.split(" "),r=new RegExp("[?!]+$");return e.map(n=>{let a=new c(n);return!r.test(n)||a.random()>this._exclamationsModifier||(n=n.replace(r,""),n+=this.exclamations[a.randomInt(0,this.exclamations.length-1)]),n}).join(" ")}uwuifySentence(t){let e=t;return e=this.uwuifyWords(e),e=this.uwuifyExclamations(e),e=this.uwuifySpaces(e),e}};d([b()],f.prototype,"_spacesModifier",2),d([b()],f.prototype,"_wordsModifier",2),d([b()],f.prototype,"_exclamationsModifier",2);return O(P);})();
// =============================================================================

// =============================================================================
const uwu = new Uwuifier({
    spaces: {
        actions: 0,
    },
});
// =============================================================================


// =============================================================================
// = originally written for https://github.com/adrianmgg/userscripts/tree/main/cohost.org/view_source
// = TODO: I should probably clean this up & put it somewhere on its own
// =============================================================================
function observer_helper(filter, on_node_found, options) {
    const once = options?.once ?? false;
    const subtree = options?.subtree ?? false;
    return (target) => {
        for(const node of target.childNodes) {
            if(filter(node)) {
                on_node_found(node);
                if(once) return; // don't need to bother setting up the observer
            }
        }
        const observer = new MutationObserver((mutations, observer) => {
            for(const mutation of mutations) {
                if(mutation.type === 'childList') {
                    for(const node of mutation.addedNodes) {
                        if(filter(node)) {
                            on_node_found(node);
                            if(once) {
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                }
            }
        });
        observer.observe(target, { childList: true, subtree: subtree });
    }
}
function observer_helper_chain(on_leaf_found, ...stuff) {
    let cur = observer_helper(stuff[stuff.length - 1][0], on_leaf_found, stuff[stuff.length - 1][1]);
    for(let i = stuff.length - 1 - 1; i >= 0; i--) {
        cur = observer_helper(stuff[i][0], cur, stuff[i][1]);
    }
    return cur;
}
function observer_helper_promise(target, filter, options) {
    return new Promise((resolve) => {
        observer_helper(filter, resolve, {...options, once: true})(target);
    });
}
// =============================================================================


// =============================================================================
// = misc utility functions
// =============================================================================
// returns ([false, string] | [true, RegExpExecArray])[]
// modified from code generated from regex101.com's code generator
function reMatchesAndInBetween(re, str) {
    const ret = [];
    let prevEndIdx = 0;
    let m;
    while ((m = re.exec(str)) !== null) {
        // special case to avoid infinite loops with zero-length matches
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        if (prevEndIdx < m.index) {
            ret.push([false, str.slice(prevEndIdx, m.index)]);
        }
        ret.push([true, m]);
        prevEndIdx = m.index + m[0].length;
    }
    if (prevEndIdx < str.length) {
        ret.push([false, str.substring(prevEndIdx)]);
    }
    return ret;
}
// =============================================================================


function uwuifyString(str) {
    return uwu.uwuifySentence(str);
}
function uwuifyI18nString(str) {
    const excludePartsPattern = /<\/?\d+>|{{.*?}}/gm;
    return (
        reMatchesAndInBetween(excludePartsPattern, str)
        .map(([isMatch, a]) => isMatch ? a[0] : uwuifyString(a))
        .join('')
    );
}
function uwuifyI18nStore(data) {
    for(const k in data) {
        const v = data[k];
        if(typeof v === 'string') {
            data[k] = uwuifyI18nString(v);
        } else {
            uwuifyI18nStore(v);
        }
    }
}

// wait for the body to exist, since that means the document head will have fully loaded
// TODO would be able to run slightly sooner if we just waited for target head elem to exist and then for the first sibling after that (to be sure it's loaded fully) but idk if that's necessary
observer_helper_chain(
    (body) => {
        const initialI18nStoreElem = document.getElementById('initialI18nStore');
        if(initialI18nStoreElem !== null) {
            const i18nData = JSON.parse(initialI18nStoreElem.textContent);
            uwuifyI18nStore(i18nData);
            initialI18nStoreElem.textContent = JSON.stringify(i18nData);
        }
    },
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'HTML', {once: true}],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'BODY', {once: true}],
)(document);

async function uwuifyI18nFetchResponse(response) {
    // TODO try-catch fallback to original
    const data = await response.json();
    uwuifyI18nStore(data);
    // TODO might need to clone headers
    return new Response(JSON.stringify(data), {status: response.status, statusText: response.statusText, headers: response.headers});
}

const window__fetch = window.fetch;
window.fetch = async function(resource, options) {
    try {
        // TODO better check than just a startsWith
        if(typeof resource === 'string' && resource.startsWith('/rc/locales/')) {
            const resp = await window__fetch.apply(this, arguments);
            const modified = await uwuifyI18nFetchResponse(resp);
            return null;
        }
    } catch(err) {
        // TODO double stacktrace on FF
        console.error('encountered error in fetch wrapper', err);
    }
    return window__fetch.apply(this, arguments);
};

observer_helper_chain(
    (txt) => {
        txt.data = uwuifyString(txt.data);
    },
    // TODO should probably make something to build these from a less verbose syntax
    // marked some of these as `once: true` for (hopefully, i assume,) a minor performance improvement,
    //  hopefully it doesn't break anything down the line
    // this part basically translates to a queryselector for
    //  html:scope > body > #root > #app > * > :not(header) > main > :nth-child(1) > ul > a > li
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'HTML',      {once: true }],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'BODY',      {once: true }],
    [n => n.nodeType === Node.ELEMENT_NODE && n.id === 'root',            {once: true }],
    [n => n.nodeType === Node.ELEMENT_NODE && n.id === 'app',             {once: true }],
    [n => n.nodeType === Node.ELEMENT_NODE,                               {once: false}],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName !== 'HEADER',    {once: true }],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'MAIN',      {once: false}],
    [n => n.nodeType === Node.ELEMENT_NODE && n.previousSibling === null, {once: true }],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'UL',        {once: true }],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'A',         {once: false}],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'LI',        {once: true }],
    // ...then grab a text node at the end
    [n => n.nodeType === Node.TEXT_NODE,                                  {once: true }],
)(document);

})();


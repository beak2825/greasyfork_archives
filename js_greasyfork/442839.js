// ==UserScript==
// @name         camDebugger
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license Amos
// @description  debug cam!
// @author       Amos
// @match        https://www.camstage.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/442839/camDebugger.user.js
// @updateURL https://update.greasyfork.org/scripts/442839/camDebugger.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

function findWordNode(word,node=document.body){
    if(node.firstChild&&node.firstChild.nodeValue&&node.firstChild.nodeValue.includes(word)){
        return node
    }
    if(node.style&&node.style.display){
        console.log(node.style.display)
    }
    if(node.children){
        for(let subNode of node.children){
            let wordInSubNode = findWordNode(word,subNode)
            if(wordInSubNode) return wordInSubNode
        }
    }
    return null
}

function showWord(word,translateWord){
    let node=findWordNode(word)
    forceDisplayNode(node)
    if(!node.firstChild.nodeValue.endsWith(`(${translateWord})`)){
        node.firstChild.nodeValue=node.firstChild.nodeValue+`(${translateWord})`
    }
    node.style='color:red'
}

function forceDisplayNode(node){
    let rootNode = null
    while(node){
        if(node.style&&node.style.display==='none'){
            node.style.display=''
        }
        rootNode=node
        node=node.parentNode
    }
}
let url = new URL(window.location.href)
let isDebug = url.searchParams.get('debug')
let zh=url.searchParams.get('zh')
let en=url.searchParams.get('en')
en=en?en:''
if(isDebug==='true'&&zh){
    setInterval(()=>{
        showWord(zh,en)
    },1000)
}





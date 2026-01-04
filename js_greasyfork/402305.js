// ==UserScript==
// @name         Geekhub Title fix
// @namespace    http://ora.moe/
// @version      0.1
// @description  修复Geekhub 标题问题
// @author       H503mc
// @match        https://*.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402305/Geekhub%20Title%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/402305/Geekhub%20Title%20fix.meta.js
// ==/UserScript==


try{
         document.title=document.querySelector(".p-3.text-xl.heading").innerText+" - Geekhub :: The stuff we care about"
    }catch(e){
        console.error("Error catched \n"+e.name+" "+e.message)
        document.title="Geekhub :: The stuff we care about"
    }

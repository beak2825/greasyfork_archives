// ==UserScript==
// @name        MTurk HIT DataBase Fixer READ DESCRIPTION!!!
// @namespace   localhost
// @description THIS WILL DELETE YOUR HITDB! ENSURE YOU HAVE A BACKUP BEFORE INSTALLING/RUNNING THIS SCRIPT! This is designed to help if your hitDB says "Script monkeys are preparing to work" or whatever, but never actually doing anything. If you look in your console, you should see things like "Uncaught NotfoundError: Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found." AFTER RUNNING THIS SCRIPT, DISABLE IT! YOU HAVE BEEN WARNED!!!
// @include     https://www.mturk.com/mturk/dashboard
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3794/MTurk%20HIT%20DataBase%20Fixer%20READ%20DESCRIPTION%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/3794/MTurk%20HIT%20DataBase%20Fixer%20READ%20DESCRIPTION%21%21%21.meta.js
// ==/UserScript==

if (confirm("THIS WILL DELETE YOUR HIT DATABASE! Seriously, deleted, like gone. Gone forever, never coming back. Back it up, export, copy, whatever you need to do, but if you confirm this box, your hitDB will be gone. Hopefully fixed, but still gone. Are you SURE SURE SURE you want to?")){
    indexedDB.deleteDatabase("HITDB");
    console.log("Deleted");
    alert("Hit database destroyed, please re-activate the HitDB script and reload the page.");
}
else{
    console.log("Not deleted");
    alert("Hit database NOT deleted. Disable this script and refresh the page to remove its influence. You might want to uninstall it too.");
}
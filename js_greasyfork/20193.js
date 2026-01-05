// ==UserScript==
// @name         ao3 work block
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.6.0
// @description  permanently hide selected works
// @author       scriptfairy
// @include      http://archiveofourown.org/*works*
// @include      https://archiveofourown.org/*works*
// @exclude      /https?://archiveofourown\.org/works/\d+/
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/20193/ao3%20work%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/20193/ao3%20work%20block.meta.js
// ==/UserScript==

var works = document.querySelectorAll('li.blurb');

// interface

var headerModule, blockLink, blockStyle;
for (var i=0;i<works.length;i++) {
    headerModule = works[i].getElementsByClassName('header module')[0];
    blockLink = document.createElement('div');
    blockLink.className = 'workblock';
    blockLink.innerHTML = '<a class="blockThis">block</a>';
    headerModule.parentNode.insertBefore(blockLink, headerModule.nextSibling);
}
blockStyle = document.createElement('style');
blockStyle.innerHTML = 'div.workblock {text-align: right; font-family:monospace; position:relative; top:-40px; right:5px;}';
document.head.appendChild(blockStyle);

var unblock = document.createElement('li');
unblock.innerHTML = '<a>Work Block</a><ul class="menu"><li id="clearLast"><a>Unblock last</a></li><li id="clearAll"><a>Unblock all</a></li></ul>';
unblock.className = 'dropdown workblock';
var search = document.getElementsByClassName('primary navigation actions')[0].getElementsByClassName('search')[0];
search.parentNode.insertBefore(unblock, search);

// block works

function blockThis(work) {
    var id = work.id;
    GM.setValue(id, id);
    GM.setValue('last', id);
}

async function blockSelected(works) {
    var blocked = await GM.listValues();
    for (j=0; j<works.length; j++) {
      var workId = works[j].id;
      if (blocked.find(function(id){return id == workId;})) {
        document.getElementById(workId).style.display = 'none';
      }
    }
    
}

// unblock works

async function clearAll(){
    var keys = await GM.listValues();
    for (k=0;k<keys.length; k++) {
        await GM.deleteValue(keys[k]);
    }
    location.reload();
}

async function clearLast() {
    var unblockId = await GM.getValue('last');
    await GM.deleteValue('last');
    await GM.deleteValue(unblockId);
    location.reload();
}

// run

blockSelected(works);

document.getElementById('clearLast').onclick = function() {clearLast();};
document.getElementById('clearAll').onclick = function() {clearAll();};

var blockLinks = document.getElementsByClassName('blockThis');
for (k=0; k<blockLinks.length; k++) {
    var blockLink = blockLinks[k];
    blockLink.onclick = function() {
        var work = this.parentNode.parentNode;
        blockThis(work);
        work.style.display = "none";
    };
}
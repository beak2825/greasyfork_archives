// ==UserScript==
// @name         Open in VSCode - OpenPAI
// @namespace    http://example.com/
// @version      0.2
// @description  This script enables to open a SSH remote window in VSCode with the SSH info in OpenPAI task details.
// @author       chenyaofo
// @match        http://*/job-detail.html*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/412813/Open%20in%20VSCode%20-%20OpenPAI.user.js
// @updateURL https://update.greasyfork.org/scripts/412813/Open%20in%20VSCode%20-%20OpenPAI.meta.js
// ==/UserScript==

(function() {

var originOpen = XMLHttpRequest.prototype.open;
var originSend = XMLHttpRequest.prototype.send;
var user = 'root';
var defaultpath = '/mnt/cephfs'
var start=new Date();
window.flag = false;

document.addEventListener('DOMContentLoaded',function(){
    setTimeout(()=>{
        var container = document.getElementsByClassName('tachyons-mt4--1DSMA tachyons-flex--1fEIE tachyons-justify-between--3nb4N tachyons-items-center--2_Sdr');
        var box = container[0].children[0];
        var line = document.createElement('div');
        line.setAttribute('class',"tachyons-bl--26VLQ tachyons-mh3--2_GwA");
        box.append(line);
        var node = document.createElement('a');
        node.setAttribute('class',"ms-Link root-151");
        node.innerText = 'Open in VSCode';
        node.setAttribute('href',`vscode://vscode-remote/ssh-remote+${user}@${window.server}:${window.port}${defaultpath}`);
        box.append(node);
    },1000);
});
// 重写open
XMLHttpRequest.prototype.open = function () {
  this.addEventListener('load', function (obj) {
    var url = obj.target.responseURL; // obj.target -> this
   if(url.indexOf('rest-server/api/v2/jobs/' > -1) && !url.endsWith('ssh') && !url.endsWith('config') && !url.endsWith('healthz')){
       //console.log('load===============', url, obj, obj.target.response);
       if(obj.target.response.length>10 && !window.flag){
           var data=JSON.parse(obj.target.response);
           window.server = data.taskRoles.taskrole.taskStatuses[0].containerIp;
           window.port = data.taskRoles.taskrole.taskStatuses[0].containerPorts.ssh;
           // console.log(data.taskRoles.taskrole.taskStatuses[0].containerIp,data.taskRoles.taskrole.taskStatuses[0].containerPorts.ssh);
           window.flag = true;
       }
   }

  });

  originOpen.apply(this, arguments);
};

})();
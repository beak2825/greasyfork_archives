// ==UserScript==
// @name         IPT Beautifier
// @version      1.0
// @include      *iptorrents.com/*
// @description  Trying to make iptorrents usable.
// @author       You
// @grant        none
// @namespace    https://greasyfork.org/en/users/246057-venstivensti
// @downloadURL https://update.greasyfork.org/scripts/377627/IPT%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/377627/IPT%20Beautifier.meta.js
// ==/UserScript==


//remove donate banner
document.querySelector('#body > tbody > tr > td > div:nth-child(1) > a > img').remove();

//top nav ugly image banner
document.querySelector('.banner').style = ('background-img: inherit');

//creates a <style> tag in the body to inject the css
function injectStyles(rule) {
  var div = $("<div />", {
    html: '&shy;<style>' + rule + '</style>'
  }).appendTo("body");
}

//here goes the css for the <style> tag
injectStyles('#body>tbody>tr>td>div>font>font>b,a.tnxBtn>b{font-weight:400!important}#iptStart .banner,#torrents,.Brtness .box,.Brtness .tTab th,.t1{box-shadow:none!important}.bannerPlaceholder{display:none!important}#iptStart .banner{background-color:#dcdde1!important;height:75px!important;border-radius:1px!important}body.Brtness{background:inherit!important;background-color:#f5f6fa!important}.Brtness #iptStart .butRow a span{border:0 solid!important}.Brtness #imdbInfo{background:inherit!important;background-color:#273c75!important}.Brtness #imdbInfo a{color:#fff!important}.dlBtn{border:5px solid!important;font-size:35px!important}.tnxBtn{border:.5px solid #ccc!important;border-radius:1px!important}.Brtness .tTab th{background:#dcdde1!important;text-shadow:none!important}.Brtness .tdet::before{border:none!important}div.banner>div>div:nth-child(1){padding-bottom:4px!important}.Brtness a{color:#273c75!important}#iptStart .topRow>a{font-size:12px!important;border-right:none!important}#iptStart .topRow{padding:0 0 8px!important}#iptStart{margin:10px auto!important}fa fa-refresh{font-family:FontAwesome,sans-serif!important;font-size:26px!important}.fa.fa-refresh:after{font-size:14px!important}.Brtness #toggleCatA,.Brtness #toggleTopA{border:.5px!important;color:#273c75!important}#catters label input+span:before{height:10px!important;width:10px!important}#toggleCatA::after,#toggleCatA::before,#toggleTopA:after,#toggleTopA:before{border-color:#273c75 transparent transparent!important;webkit filter:none!important;filter:none!important}#Search input:first-child{border-radius:1px 0 0 1px!important}#Search input,#Search select{border-radius:0 1px 1px 0!important}.optWrap{background-color:#273c75!important}.Brtness #iptStart .topRow .thmT div{background:inherit!important}html body div div#loginWrap div.flat-form div#login.form-action.show form ul li input::placeholder{color:inherit!important}html body div div#loginWrap div.flat-form div#login.form-action.show form ul li input{box-shadow:none!important;border-radius:5px!important}');

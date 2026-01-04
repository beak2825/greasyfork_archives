// ==UserScript==
// @name     Facebook (Show Timestamps on Posts)
// @match    https://www.facebook.com/*
// @match    http://www.facebook.com/*
// @icon     https://www.google.com/s2/favicons?domain=facebook.com
// @run-at   document-start
// @grant    GM_addStyle
// @author   JZersche
// @require  https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @version 1.0
// @namespace https://greasyfork.org/users/95175
// @description
// @description Show Full Timestamp Information on FB Posts
// @downloadURL https://update.greasyfork.org/scripts/424272/Facebook%20%28Show%20Timestamps%20on%20Posts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424272/Facebook%20%28Show%20Timestamps%20on%20Posts%29.meta.js
// ==/UserScript==

/////////////STYLESHEET////////////////
var styles = `.ijkhr0an.art1omkt.s13u9afw{background:#0000!important;box-shadow:none;opacity:1;} .d2edcug0.oo9gr5id.hzawbc8m{color:#fffc;background-image: linear-gradient(to left, white, green, white, blue, violet;);-webkit-background-clip: text;}`
var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)
///////////////////////////////////////

let ii = 0;
setInterval(function(){
setMutationHandler(document,'.tojvnm2t.a6sixzi8.abs2jz4q.a8s20v7p.t1p8iaqh.k5wvi7nf.q3lfd5jv.pk4s997a.bipmatt0.cebpdrjk.qowsmv63.owwhemhu.dp1hu0rb.dhp61c6y.iyyx5f41',Show_Timestamps,{processExisting:true});

 function Show_Timestamps(nodes) {

        for (let i = 0; i < nodes.length; i++) {
            var NODE = nodes[i];
            if(NODE.textContent.match(/(posts|photos)/)){
                try{
                    let event = new MouseEvent('mouseover',{bubbles:true})
                    let event2 = new MouseEvent('mouseout',{bubbles:true})
                    NODE.dispatchEvent(event);

                    if(NODE.children[0].children[0].children[0].children[1]) {
                        for (let i = 0; i < NODE.children[0].children[0].children[0].children[1].childElementCount; i++) {
                            if(NODE.children[0].children[0].children[0].children[1].children[i].style.top){

                                try{NODE.children[0].children[0].children[0].children[1].removeChild(NODE.children[0].children[0].children[0].children[1].children[i]);}catch(e){}

                                let stampAmount = document.getElementsByClassName('j34wkznp qp9yad78 pmk7jnqg kr520xx4 hzruof5a').length;
                                if(ii < stampAmount && window.location.href.length == 36) {NODE.children[0].children[0].children[0].setAttribute('style','border:1px solid #f00!important;border-radius:3px;padding:2px;'); NODE.children[0].children[0].children[0].children[1].textContent = ii+' '+document.getElementsByClassName('j34wkznp qp9yad78 pmk7jnqg kr520xx4 hzruof5a')[ii].textContent + ' (Estimated)'; ii++; }
                                if(ii < stampAmount && window.location.href.match(/posts/)[0]) {NODE.children[0].children[0].children[0].setAttribute('style','border:0px solid #0f0!important;border-radius:3px;padding:0px;'); NODE.children[0].children[0].children[0].children[1].textContent = ii+' '+document.getElementsByClassName('j34wkznp qp9yad78 pmk7jnqg kr520xx4 hzruof5a')[ii].textContent; ii++; }
                                if(ii > stampAmount) {NODE.children[0].children[0].children[0].setAttribute('style','border:1px solid #00f!important;border-radius:3px;padding:2px;'); NODE.children[0].children[0].children[0].children[1].textContent = ii+' '+document.getElementsByClassName('j34wkznp qp9yad78 pmk7jnqg kr520xx4 hzruof5a')[0].textContent; ii++}
                                console.log(NODE.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.children[0].children[ii].children[0].children[0].children[0].children[0].children[0].textContent);
                                //console.log(NODE.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.children[0].children[ii].children[0].children[0].children[0].children[0].children[0].textContent);
                                //console.log(NODE);
                                //NODE.children[0].children[0].children[0].children[1].textContent = 'aaa';
                            }
                            //if(!NODE.children[0].children[0].children[0].children[1].children[i].style.top){console.log(NODE.children[0].children[0].children[0].children[1].textContent)}
                        }
                        NODE.dispatchEvent(event); NODE.dispatchEvent(event2);
                    }
                } catch(e){}


            }
        }}
},3000)
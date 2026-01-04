// ==UserScript==
// @name         NGA显示备注者
// @version      0.3
// @description  UNNERF
// @author       zxcej
// @match        http*://bbs.nga.cn/nuke.php?func=ucp*
// @match        http*://bbs.ngacn.cc/nuke.php?func=ucp*
// @match        http*://nga.178.com/nuke.php?func=ucp*
// @match        http*://ngabbs.com/nuke.php?func=ucp*
// @grant        none
// @namespace https://greasyfork.org/users/325815
// @downloadURL https://update.greasyfork.org/scripts/448418/NGA%E6%98%BE%E7%A4%BA%E5%A4%87%E6%B3%A8%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/448418/NGA%E6%98%BE%E7%A4%BA%E5%A4%87%E6%B3%A8%E8%80%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', async function() {
    let x = document.querySelector(".inlineblock span").innerText.replace(/\D/g,'');
    let url = 'nuke.php?__lib=user_remark&__act=get&raw=1&uid='+x+'&__output=11';
    let ucpurl = 'nuke.php?__lib=ucp&__act=get&uid='+x+'&__output=11';
    let y = await fetch(ucpurl).then(res => res.json());
    let newmark = y.data[0].remark;
        console.log(newmark);
    //let newremarklength = y.data[0].remark.length;
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        let query = document.getElementById("ucpuser_remark_blockContent").querySelectorAll("a[href^='nuke.php']");
        for (var i =0,l = query.length;i<l;i++){
        for(var j =0, k = out.data[0].length;j<k;j++){
        let realperson = out.data[0][j].adminuid;
        let newid = newmark[i][0];
        let oldid = out.data[0][j].id;
        let newurl = "nuke.php?func=ucp&uid="+ realperson;
            if(newid > oldid){
                newurl = query[i].href;
                realperson = '等待缓存';
            }
            else if(newid < oldid){
                continue;
            }
        query[i].href=newurl ;
        query[i].text='['+ realperson +']';
        console.log(realperson);
            break;
        }
        }
}).catch(err => console.error(err));
        }, false);
})();
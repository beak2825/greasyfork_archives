// ==UserScript==
// @name         SSLink Get
// @namespace    http://jackxhe.cn
// @version      0.11
// @description  从free-ss生成全部分享的SS链接
// @author       JackXhE
// @include      *://free-ss.ml/
// @include      *://free-ss.tk/
// @include      *://free-ss.*/
// @grant        https://cdn.bootcss.com/Base64/1.0.1/base64.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/376146/SSLink%20Get.user.js
// @updateURL https://update.greasyfork.org/scripts/376146/SSLink%20Get.meta.js
// ==/UserScript==

(function() {
    let a=document.createElement("button");
    a.innerText="Wait~~~"
    a.id="sslink"
    a.style.marginLeft="1rem"
    a.setAttribute("ready",false);
    document.querySelectorAll("div>h3")[1].append(document.createElement("div").appendChild(a));
    a.onclick=function(){
        if(a.getAttribute("ready")=="false"){
            alert("Please Wait~");
            return;
        }
        let ss_link_tmp="";
        ssLinkArr.forEach(function(e,i){
            ss_link_tmp+=e+"\n";

        });
        GM_setClipboard(ss_link_tmp);
        alert("Ojbk")

    }

    var ssLinkArr=[]
    setTimeout(function(){
        let ssLinkIndex={
        };

        var arrTmp=[];
        document.querySelectorAll("table").forEach(function(e,i,a){
            arrTmp.push(e.offsetHeight)

        })
        let ssTable=document.querySelectorAll("table")[arrTmp.indexOf( Math.max.apply(null,arrTmp))]

        for(var i=0;i<ssTable.tHead.rows[0].children.length;i++){
            let a=ssTable.tHead.rows[0].children[i];
            if(/address/gi.test(a.innerText)){ssLinkIndex.ip=i;continue; }
            if(/port/gi.test(a.innerText)){ssLinkIndex.port=i;continue; }
            if(/method/gi.test(a.innerText)){ssLinkIndex.method=i;continue; }
            if(/password/gi.test(a.innerText)){ssLinkIndex.password=i;continue; }
            if(a.getElementsByClassName("fa-globe").length>0){ssLinkIndex.country=i;continue;}
        }


        for(let i=0;i<ssTable.tBodies[0].rows.length;i++){
            let ss=ssTable.tBodies[0].rows[i];
            let ss_ip=ss.children[ssLinkIndex.ip].innerText;
            let ss_port=ss.children[ssLinkIndex.port].innerText;
            let ss_method=ss.children[ssLinkIndex.method].innerText;
            let ss_password=ss.children[ssLinkIndex.password].innerText;
            let ss_country=ss.children[ssLinkIndex.country].innerText;
            let ss_link="ss://"+window.btoa(ss_method+":"+ss_password+"@"+ss_ip+":"+ss_port);
            log(ss_link);
            ssLinkArr.push(ss_link);

        }
        log(ssLinkArr)
        a.innerText="复制SsLink"
        a.setAttribute("ready",true);
    },2000);
    function log(t){
        console.log(t)
        return
    }
})();
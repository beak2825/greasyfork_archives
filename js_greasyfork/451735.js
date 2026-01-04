// ==UserScript==
// @name         Arcaea API Parser -C (lchzh ver.)
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  通过arcaea的api获取角色信息
// @author       lchzh3473
// @match        https://webapi.lowiro.com/webapi/user*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lowiro.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451735/Arcaea%20API%20Parser%20-C%20%28lchzh%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451735/Arcaea%20API%20Parser%20-C%20%28lchzh%20ver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a=JSON.parse(document.body.innerText);
    document.body.innerHTML='<style>*{font-family:monospace}</style>id,name,level,overdrive,prog,frag,sp1,sp2,sp3<br>';
    if(a.success){
        for(var idx=0;idx<a.value.character_stats.length;idx++){
            var i=a.value.character_stats[idx];
            var obj={};
            obj.id=i.character_id;
            obj.name=i.name;
            obj.level=i.level;
            obj.overdrive=i.overdrive;
            obj.prog=i.prog-(i.prog_tempest|0);
            obj.frag=i.frag;
            obj.sp1=Math.fround(obj.overdrive*13718);
            obj.sp2=Math.fround(obj.prog*13718);
            obj.sp3=Math.fround(obj.frag*13718);
            document.body.innerHTML+=obj.id+','+obj.name+','+obj.level+','+obj.overdrive+','+obj.prog+','+obj.frag+','+obj.sp1+','+obj.sp2+','+obj.sp3;
            document.body.innerHTML+='<br>';
        }
    }else {
        document.body.innerHTML='请先登录！<a href="https://arcaea.lowiro.com/zh/login">https://arcaea.lowiro.com/zh/login</a>';
    }
})();
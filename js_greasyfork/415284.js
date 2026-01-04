// ==UserScript==
// @name         test_1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  fx
// @author       You
// @match        http://xf.faxuan.net/sps/exercises/t/*
// @grant        none
// @require    https://cdn.staticfile.org/jquery/1.11.2/jquery.min.js
// @require    https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/415284/test_1.user.js
// @updateURL https://update.greasyfork.org/scripts/415284/test_1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.cookie.json=true;
    for(var i in $.cookie()){ if( (i.match("ex_per_")||i.match("ex_res_") ) && !i.match($.cookie("loginUser")["userAccount"]) ){$.removeCookie(i,{path:"/sps/"});$.removeCookie(i); } };  //清理上一个账户信息（切账号未关闭浏览器时需要）
    var index=null;
    function m(){
        var ti=$("#hids").val().split(",");
        if(ti.length>0) clearInterval(index); else return ;
		if($("#practicetime").length==0) return ;
        console.log('user: '+$.cookie("loginUser")["userAccount"]);
        console.log('考题: '+ti);
		var tis= {'547288': 'ABCD', '547289': 'BC', '547286': 'ABC', '547287': 'ABCD', '547282': 'D', '547280': 'B', '547281': 'A', '547299': 'ACD', '547351': 'A', '547354': 'B', '547355': 'A', '547356': 'B', '547357': 'B', '547350': 'A', '547298': 'ABCD', '547352': 'B', '547353': 'A', '547295': 'ABCD', '547294': 'ABC', '547297': 'ABCD', '547296': 'BC', '547358': 'B', '547290': 'ABC', '547293': 'ABCD', '547292': 'ABCD', '547291': 'ABCD', '547343': 'B', '547310': 'ABCD', '547341': 'B', '547340': 'B', '547347': 'B', '547346': 'B', '547345': 'B', '547344': 'A', '547349': 'B', '547348': 'B', '547251': 'D', '547250': 'D', '547326': 'ABCD', '547336': 'A', '547337': 'A', '547334': 'A', '547335': 'A', '547332': 'B', '547333': 'A', '547330': 'A', '547331': 'A', '547338': 'A', '547339': 'A', '547325': 'ABCD', '547324': 'ABCD', '547248': 'D', '547249': 'C', '547321': 'ABCD', '547320': 'ABC', '547323': 'ABCD', '547322': 'ABCD', '547246': 'C', '547247': 'D', '547245': 'D', '547329': 'A', '547259': 'B', '547311': 'ABCD', '547312': 'AB', '547313': 'BCD', '547314': 'ABCD', '547315': 'ABC', '547316': 'BCD', '547317': 'ABCD', '547318': 'ABCD', '547319': 'CD', '547253': 'B', '547252': 'B', '547255': 'C', '547254': 'A', '547257': 'A', '547256': 'A', '547264': 'B', '547265': 'D', '547266': 'B', '547267': 'D', '547260': 'B', '547261': 'B', '547262': 'A', '547263': 'D', '547268': 'A', '547269': 'B', '547258': 'A', '547309': 'ABCD', '547308': 'ABCD', '547307': 'ABCD', '547306': 'ABC', '547305': 'ABD', '547304': 'ABC', '547303': 'ABCD', '547302': 'ABCD', '547301': 'ABCD', '547300': 'ACD', '547342': 'A', '547273': 'D', '547272': 'C', '547271': 'A', '547270': 'A', '547277': 'D', '547276': 'D', '547275': 'C', '547274': 'D', '547279': 'C', '547278': 'A'};
		var ans={};
        var cuo=parseInt(Math.random()*5);         //随机做错0-4题
        console.log('错题数: '+cuo);
        var cuos=[];
        for(var i=1;i<=cuo;i++){cuos.push(ti[parseInt(Math.random()*ti.length)])}
        console.log('错题号: '+cuos);
		var sj_a_b=['A','B'];
        for(var i in ti){
	    let v=ti[i]; let aorb=sj_a_b[parseInt(Math.random()*2)];
	    if(v=="") break;
            ans[v]=tis[v]==undefined||cuos.indexOf(v)!=-1?aorb:tis[v];
		}
        console.log('答案: '+JSON.stringify(ans));
        $.cookie("ex_per_"+$.cookie("loginUser")["userAccount"],ans)
    }
    index=setInterval(m,1000)


})();
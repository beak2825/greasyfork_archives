// ==UserScript==
// @name         faxuan_test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto complete faxuan test
// @author       fangzister
// @match        http://xf.faxuan.net/sps/exercises/t/exercies_3*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368096/faxuan_test.user.js
// @updateURL https://update.greasyfork.org/scripts/368096/faxuan_test.meta.js
// ==/UserScript==

(function() {
    //type = 1 :
    //
    'use strict';
    var doc = document;
    var series = 0;
    function $getById(id){return doc.getElementById(id);}

    function selectAnswer(answer){
        let u = $getById('ti_item');
        let ipts = u.getElementsByTagName('input');
        for ( let i = 0 , l = ipts.length ; i<l;i++){
            let c= ipts[i];
            if(c.value == answer){
                c.click();
                return;
            }
        }
    }
    function chooseAnswer(questionId){
        var ul = $getById('ti_item');
        var opts = ul.getElementsByTagName('input');
        for (let i = 0 , l = opts.length ; i < l ; i ++ ){
            let o = opts[i];
        }
    }
    function queryAnswer(){
        var hid = $getById('ulhidden');
        var ipts = hid.getElementsByTagName('input');
        var idArray = [];
        for(let i = 0 , l = ipts.length; i < l ; i ++){
            //将题目id/options推入数组
            let id = ipts[i].id.substr(22);
            let v = ipts[i].value;
            idArray.push({"id":id,"options":v});
        }
        var ids = idArray.join(',');
        var paperId = $getById('hid').value;
        series = $.cookie('ex_range_'+paperId);
        sps.stopTiming();

        var res = $getById('restimer');
        let m = parseInt(Math.random() * 10) + 20;
        let s = parseInt(Math.random() * 10) + 10;
        let t = '00:' + m + ':' + s;
        res.innerHTML = t;
        sps.onlineHour = "00";
        sps.onlineMinute=String(m);
        sps.onlineSecond=String(s);
        jQuery.ajax({
            type: "post",
            url:"http://xf.faxuan.net/ess/service/getpaper?paperId=" + paperId + "&series=" + series + "_answer",
            success: function(e) {
                let v = e.split('\n');
                let n = v[2];
                let c = jQuery.parseJSON(n);
                console.log(c,c.length);
                var cok = [];

                for(let i = 0 , l = c.length ; i < l ; i ++ ) {
                    var o = c[i];
                    if (i == 0){
                        selectAnswer(o.answerNo);
                    }
                    let a = '';
                    if ( o.answerNo == '0'){
                        a = 'B';
                    }else if(o.answerNo == '1'){
                        a = 'A';
                    }else{
                        a = o.answerNo;
                    }
                    cok.push('"' + o.questionId + '":"' + a + '"');
                }
                let sCook = '{' + cok.join(',') + '}';
                let jCook = JSON.parse(sCook);

                var user = base.getCookie("loginUser").userAccount;
                var key = "ex_per_" + user;
                console.log(jCook);
                base.addCookie(key, jCook, {
                    path: "/sps/",
                    expires: 1
                });
            },
            error: function(g, f, h) {}
        });

        sps.myCommit = function() {
            var c = $("#hids").val();
            var a = false;
            var e = c.substring(0, c.length - 1).split(",");
            var b = parseInt($("#curti").text()) - 1;
            var d = e[e.length - 1];
            sps.saveLastexe(b);
            sps.myCommit1();
        };
    }

    function insertCheatButton(){
        var div = $getById('practicetime');
        var d = div.firstChild.nextSibling;
        var s = d.firstChild.nextSibling;
        var a = d.lastChild.previousSibling;
        var b = doc.createElement('a');
        s.style.width = '400px';
        b.href = 'javascript:;';
        b.innerHTML = '作弊模式';
        b.onclick = queryAnswer;
        b.style.marginLeft = '10px';
        d.insertBefore(b,a);
    }

    insertCheatButton();
})();
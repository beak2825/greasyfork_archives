// ==UserScript==
// @name         智慧作业微课抢题
// @namespace    Aice.Fu_jxeduyunTools
// @include      http://zj.jxeduyun.com/Web/index*
// @version      0.1.2
// @description  智慧作业微课自动预约抢题
// @author       Aice.Fu
// @match        http://zj.jxeduyun.com/Web/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428344/%E6%99%BA%E6%85%A7%E4%BD%9C%E4%B8%9A%E5%BE%AE%E8%AF%BE%E6%8A%A2%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/428344/%E6%99%BA%E6%85%A7%E4%BD%9C%E4%B8%9A%E5%BE%AE%E8%AF%BE%E6%8A%A2%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    var fdiv = getTargetByTAV('div','class','emptyrow');
    fdiv.id='J_Dtl';
    $('#J_Dtl').append('<dl>》&nbsp;&nbsp;间隔&nbsp;&nbsp;<input type="number" id="AiceCysTm" style="width:55px;" value="100"/>ms执行下一个预约&nbsp;&nbsp;<a style="padding:5px 28px;background:#efb8bb;color:#fff;cursor:pointer;font-size:1.5em" id="AiceQt">抢题</a></dl>');
    var cys = document.getElementById('AiceCysTm').value;
    var AiceQt = document.getElementById('AiceQt');
    AiceQt.addEventListener('click', function() {
        var fTli = document.getElementsByClassName("list-group-item");
        if (fTli !== null && typeof(fTli) === 'object'){
            var t1Cys = 1
            var t1 = setInterval(function() {
                if (t1Cys>=10){
                   clearInterval(t1);
                  }
                var idx = random(0, 9)
                var btn = fTli[idx].getElementsByClassName("btn btn-succes")[0];
                //var btn = fTli[idx].getElementsByClassName("btn btn-status0")[0];
                if (btn !== null && typeof(btn) === 'object'){
                    btn.click();
                }
                t1Cys++;
                console.log(new Date()+ "点击了第"+idx+"个预约");               
            },cys);
        }

    });

    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getTargetByTAV(t_tag,t_attr,t_value){
        var target = document.getElementsByTagName(t_tag);
        for(var i=0;i <target.length;i++){
            if(target[i].getAttribute(t_attr) == t_value){
                return target[i];
            }
        }
    }

})();
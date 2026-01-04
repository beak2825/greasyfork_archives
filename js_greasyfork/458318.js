// ==UserScript==
// @name         充值
// @namespace    xxx
// @version      0.2
// @description  后台充值
// @author       xxx
// @match        https://*/*/vip/distribution/viprecharge
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458318/%E5%85%85%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/458318/%E5%85%85%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var checkInterval = setInterval(()=>checkInit(),500);
    window.activity = null;
    function checkInit(){
        if($(".mui-select-selection-selected-value:contains('请选择活动类型')").length>0){
            clearInterval(checkInterval);
            window.activity=$(".mui-select-selection-selected-value:contains('请选择活动类型')");
            $(".mui-select-selection-selected-value:contains('请选择活动类型')").parent().parent().parent().parent().parent().after('<div class="diff-text" style="font-size: 1rem;display: inline-block;padding-left: 15px;color: red;"></div>');
            $(".mui-select-selection-selected-value:contains('请选择活动类型')").parent().parent().parent().parent().parent().after('<button class="diff-days mui-btn  mui-btn-primary" type="button" >获取与音乐包相差天数</button>');
            $(".diff-days").click(function () {
                if($(".mui-select-selection-selected-value:contains('用户Id')").length==0){
                    alert("仅支持用户ID查询");
                    return;
                }
                if(window.activity.text().indexOf("请选择活动类型")>-1){
                    alert("请先选择活动类型");
                    return;
                }
                if(!$(".mui-input").val()){
                    alert("请输入用户id");
                    return;
                }
                const url = "/api/mallmonitor/selfhelp/userinfoall?userId="+$(".mui-input").val();
                $.ajax(url).then(function (data) {
                    if(!data){
                        alert("查询用户音乐包信息失败");
                        return;
                    }
                    var d = JSON.parse(data);
                    if(!d || d.data.length==0){
                        alert("查询用户音乐包信息失败");
                        return;
                    }
                    var pkg = JSON.parse(d.data.filter(e=>e.bussinessName=="音乐包记录")[0].json);
                    if(!pkg || !pkg.data ||pkg.data.length==0){
                        alert("用户不是音乐包会员");
                        return;
                    }
                    var pkgExpireTime = Date.parse(pkg.data[0].expireTime);
                    var now = new Date().getTime();
                    if(now>pkgExpireTime){
                        $(".diff-text").text('用户'+$(".mui-input").val()+commonVipName+"与音乐包相差0天");
                        return;
                    }
                    let commomVip = {}
                    d.data.filter(e=>e.bussinessName=="通用会员类型展示")[0].content.forEach(record => {
                        commomVip[record[1]] = record[2];
                    })
                    console.log(commomVip)
                    var commonVipName = null;
                    if(window.activity.text().indexOf("2438160")>-1){
                    // if(window.activity.text().indexOf("车机")>-1){
                        commonVipName = '车机端会员';
                    }
                    if(window.activity.text().indexOf("2436160")>-1){
                    // if(window.activity.text().indexOf("音箱")>-1){
                        commonVipName = '云音乐音箱端会员';
                    }
                    if(window.activity.text().indexOf("2542160")>-1){
                    // if(window.activity.text().indexOf("有道")>-1){
                        commonVipName = '有道会员';
                    }
                    if(window.activity.text().indexOf("2437160")>-1){
                    // if(window.activity.text().indexOf("手表")>-1){
                        commonVipName = '云音乐手表端会员';
                    }
                    if(commonVipName==null){
                        alert("不支持的赠送类型");
                        return;
                    }
                    var diff = 0;
                    if(!commomVip[commonVipName]){
                        diff = pkgExpireTime - now
                    }else{
                        diff = pkgExpireTime - Math.max(Date.parse(commomVip[commonVipName]),now)
                    }
                    if(diff<=0){
                        $(".diff-text").text('用户'+$(".mui-input").val()+commonVipName+"与音乐包相差0天");
                        return;
                    }
                    var dayMills = 24*60*60*1000;
                    var needAddOne = (diff % dayMills) > 0;
                    var days = Math.floor(diff / dayMills) + (needAddOne ? 1 : 0);
                    $(".diff-text").text('用户'+$(".mui-input").val()+commonVipName+"与音乐包相差"+days+"天");
                    // $($('.mui-input-number-input')[2]).val(days);
                    // $($('.mui-input-number-input')[2]).trigger("input",days);


                });
            });

        }
    }


})();
// ==UserScript==
// @name         bangumi批量删除动态
// @description  在用户时间线上提供批量删除动态的选项。
// @version      0.2
// @author       1ra
// @include     /^https?://(bgm\.tv|bangumi\.tv|chii\.in)/.*$/
// @namespace https://greasyfork.org/users/797249
// @downloadURL https://update.greasyfork.org/scripts/429877/bangumi%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/429877/bangumi%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==
var uname=$(".avatar").attr("href").split("/").pop();
var delist=[];
function delTimeline(cnt,i=0){
    if(i==cnt) {
        alert("删除成功！");
        return location.reload();
    }
    $("a.l.rr.del").text(`正在删除... (${i+1}/${cnt})`);
    $.get(delist[i].attr("href"),function(){
        delist[i].parents(".tml_item").hide("fast");
        delTimeline(cnt,i+1);
    });
}

(function() {
    if(location.pathname!==`/user/${uname}/timeline`) return;
    $(".TsukkmiBox.clearit").after(`<a href="#" class="l rr del">批量删除</a>`);
    $("a.l.rr.del").click(function() {
        delist=[];
        $(".tml_del").each(function(){delist.push($(this));});
        if(delist.length==0) return;
        let cnt=prompt(`输入想要删除动态的数量：1-${delist.length}`);
        if(cnt==null || cnt==="") return;
        if(cnt!==parseInt(cnt).toString() || parseInt(cnt)<1 || parseInt(cnt)>delist.length) return alert("输入数值不合法！");
        cnt=parseInt(cnt);
        $(this).css("pointer-events","none");
        delTimeline(cnt);
    });
})();
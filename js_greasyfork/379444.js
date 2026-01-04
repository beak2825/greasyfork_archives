// ==UserScript==
// @name         京东抢购超强
// @namespace    mr.z.j.jd
// @version      0.1
// @description  京东抢购超强直接下单
// @require http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        *://item.jd.com/*.html*
// @match        *://*.m.jd.com/*
// @match        *://m.jd.com/*
// @match        *://wqs.jd.com/*
// @match        *://wq.jd.com/*
// @match        *://wqdeal.jd.com/*
// @author       Mr.z
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/379444/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E8%B4%AD%E8%B6%85%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/379444/%E4%BA%AC%E4%B8%9C%E6%8A%A2%E8%B4%AD%E8%B6%85%E5%BC%BA.meta.js
// ==/UserScript==

var popWin = {
    scrolling: 'no',
    //是否显示滚动条 no,yes,auto
    int: function () {
        this.mouseClose();
        this.closeMask();
        //this.mouseDown();

    },
    showWin: function (width, height, title, src) {
        var iframeHeight = height - 52;
        var marginLeft = 0;
        var marginTop = height / 2;
        var inntHtml = '';
        inntHtml += '<div id="maskTop" style="width: ' + width + 'px; height: ' + height + 'px; border: #999999 1px solid; background: #fff; color: #333; position: fixed; top: 50%; left: 15px; margin-left: -' + marginLeft + 'px; margin-top: -' + marginTop + 'px; z-index: 999999; filter: progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4); -moz-box-shadow: 2px 2px 10px #909090; -webkit-box-shadow: 2px 2px 10px #909090; box-shadow: 2px 2px 10px #909090;">'
        inntHtml += '<div id="maskTitle" style="height: 50px; line-height: 50px; font-family: Microsoft Yahei; font-size: 20px; color: #333333; padding-left: 20px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAyCAYAAABlG0p9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABvSURBVEhL1cq5DcAwDENR7T+sL9lOOoUbkCoCwwKewOJbiGe+31BkwgeDM18YgrPhxuBs4CkS4cQQZMKFwd0R+gzFJaFjcD+EfXgoMuHA4O4Iew/FJWHD4BJhwxDoYcNTIKwY3NGwYggQFgxODEt8xO1/6P+HHxEAAAAASUVORK5CYII=); border-bottom: 1px solid #999999; position: relative;">'
        inntHtml += '' + title + ''
        inntHtml += '<div id="popWinClose" style="width: 28px; height: 28px; cursor: pointer; position: absolute; top: -12px; right: -9px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJeSURBVEhLvZbPq2lRFMf9B4bSTTIxZiBSMlCI9ycoKX+Bod7w/il3YIL4NyhFmYmBKD2Sp0ix3vqes/e529n74t33Op9astevr3PO2tvxvcLtdquzfbAtyAV8IlYX6d+DG7yxvbP9Fr2fglxR8ybavAYX/GD7Jfr8NahFD9HuMZz4U9Q5jEYjqlarFA6HiVPuDD7EkOMGvTjna9xi8/mcstmsJvKVIRc1Kl+K4haIHItut0t+v9/Y+JGhBrUq6M2xT9iBAXGeGQrY/U+miqI3NNhvw4t3EbNuyXeuzG3ood5eaLDfhhfO6JueWbPZtGKFQkGLNRoN2u/3FI/HtRh6SaDBPkusLnzWpMlkaRC7XC5WfLVaUTqddmKVSoVOp5MVG4/HlEql7mph6vRCC4IfYm2Nt7vAzW63o2KxSLVaja7Xq/DatFotrR49JdCCoHNcmfZZPp+n9XotMmxwVVwnVjbD4ZAikYhWj54SaN1dgjtZWiaToe12K7J0JpOJUUyaykuCsFwuR8fjUWR+slgsKBAIGGukqbwsiGdmElwul5RIJIw10lReEsQ0ns9nkaVzOBys226qhak8HRrsM7ktJLPZjDabjVjZYLBKpZJWrw0NfzzcFvj1KtPp1HpmsVjM2iIq/X5fqzdti4cbHycINjUYDAYUCoWcGA4BHAag1+tRMBi8q4VpGx/wl4dHWzKZpHa7TdFoVIuVy2XqdDrGSTUebYAXnh/e3v49AXZ49wcs4YB3rxgStyjApGG8TfsUPsTUaZQ8FZPgFrB585oo4QLvXoTdcIP/9Krv8/0BDUSOirKWU6wAAAAASUVORK5CYII=);"></div>'
        inntHtml += '</div>'
        inntHtml += '<iframe width="' + width + '" height="' + iframeHeight + '" frameborder="0" scrolling="' + this.scrolling + '" src="' + src + '"></iframe>';
        $("body").append(inntHtml);
        this.int();
    },
    mouseClose: function () {
        $("#popWinClose").on('mouseenter',
            function () {
                $(this).css("background-image", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJwSURBVEhLvZbLSiNBFIb7DVyKiIgb17oQRRAXgor6CIIIeQKXMksfxYUbFbMZRh0Yb6ODMgEddCVmoWkRLzFekukxfay/+lRbqSqTVob+4CyqzuVPV59TaS8JYRhmhM0Ly5MB9tiX4fDPIQq0CpsT9sC1G4JYzmnlMskQCRPCrrnOh0EuanC5+ojAL5wXc5/LUW5qitba2ynreTWGPfgQY4JaXNaNKfZ0dkY7g4OWyHuGWOTovCuKI+AYib+8TF+bmpyF6xlykKuD2iwTITbQIPE7Q4Kr2EdMF0VtaLCcFJxjnzySzzyZaaihHy80WE4Kxq3vemcns7PStzsyYvn+zMxQUCzSRne35UMtBTSUWIb3ZKeZSRCrBoH0lwsF2u7vj32/JyepWi5L3/3hIW319dXkwvTuhRYE53kt29tMMAlub2lvdJRy09MUVqu8G3GxsGDlo6YCWhCMryvXnO0OD1PF9zkiQj5VGPIqonhwQOsdHVY+aiqgVfMIZrCy7YEBCm5uOMqmdHTkFFOmk0gQ9nNoiF4eHznyjed8nr41NztzlOkkFsQ7cwmWz89ps6fHmaNMJ5Gg7MZKhaNs/pVK8thduTCdhk2DOVNjoXg6PaW/V1e8ikBj7Y2NWflW06BVee0cC/x6nYfjY/nOfnR1yRHRucxmrXzXWNQdfNwgGGpwt79Pa21tsQ+XAC4D4K+s0GpLS00uzBp8vm3qXm1bvb1UWFyk752dlu/X+Dj5S0vOTnVebUAsUr+80/17AmIjvT9ghXCk94mhMEUBOg3t7ZpT7MGnd6OioZgCRyAsnc9EhUhI70PYRBT4T5/6nvcKYG1hElXAZggAAAAASUVORK5CYII=)");

            });
        $("#popWinClose").on('mouseleave',
            function () {
                $(this).css("background-image", "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJeSURBVEhLvZbPq2lRFMf9B4bSTTIxZiBSMlCI9ycoKX+Bod7w/il3YIL4NyhFmYmBKD2Sp0ix3vqes/e529n74t33Op9astevr3PO2tvxvcLtdquzfbAtyAV8IlYX6d+DG7yxvbP9Fr2fglxR8ybavAYX/GD7Jfr8NahFD9HuMZz4U9Q5jEYjqlarFA6HiVPuDD7EkOMGvTjna9xi8/mcstmsJvKVIRc1Kl+K4haIHItut0t+v9/Y+JGhBrUq6M2xT9iBAXGeGQrY/U+miqI3NNhvw4t3EbNuyXeuzG3ood5eaLDfhhfO6JueWbPZtGKFQkGLNRoN2u/3FI/HtRh6SaDBPkusLnzWpMlkaRC7XC5WfLVaUTqddmKVSoVOp5MVG4/HlEql7mph6vRCC4IfYm2Nt7vAzW63o2KxSLVaja7Xq/DatFotrR49JdCCoHNcmfZZPp+n9XotMmxwVVwnVjbD4ZAikYhWj54SaN1dgjtZWiaToe12K7J0JpOJUUyaykuCsFwuR8fjUWR+slgsKBAIGGukqbwsiGdmElwul5RIJIw10lReEsQ0ns9nkaVzOBys226qhak8HRrsM7ktJLPZjDabjVjZYLBKpZJWrw0NfzzcFvj1KtPp1HpmsVjM2iIq/X5fqzdti4cbHycINjUYDAYUCoWcGA4BHAag1+tRMBi8q4VpGx/wl4dHWzKZpHa7TdFoVIuVy2XqdDrGSTUebYAXnh/e3v49AXZ49wcs4YB3rxgStyjApGG8TfsUPsTUaZQ8FZPgFrB585oo4QLvXoTdcIP/9Krv8/0BDUSOirKWU6wAAAAASUVORK5CYII=)");

            });
    },
    closeMask: function () {
        $("#popWinClose").on('click',
            function () {
                $("#mask,#maskTop").fadeOut(function () {
                    $(this).remove();

                });

            });
    }
};
var loginfo = function (i, j) {
    if (!j) {
        console.log(i);
    }
    $("#qiangoumsg").text(i);
}

function appendBtn() {
    var btn = '<div id="kaiguandiv"><button class="mybtn" id="gotologin">→ 提前登录 ←</button><div class="mymsg" id="banben"></div><button class="mybtn" id="kaiguanbtn">→ 点我下单 ←</button></div>';
    $("body").append(btn);
    $("#kaiguandiv").css({
        'position': 'fixed',
        'top': '0px',
        'left': '0px',
        'z-index': '9999',
        'text-align': 'center',
        'width': '100%',
        'height': '100%',
        'background': '#000000',
        'font-size': '18px',
        'font-family': 'Microsoft YaHei',
        'overflow-y': 'scroll'
    });
    $(".mybtn").css({
        'width': '100%',
        'height': '40px',
        'border-width': '0px',
        'border-radius': '3px',
        'background': '#e4393c',
        'cursor': 'pointer',
        'outline': 'none',
        'color': 'white',
        'margin': '10% 0',
    });
    $(".mymsg").css({
        'width': '100%',
        'background': '#0a0707',
        'border-radius': '3px',
        'min-height': '30px',
        'padding-top': '10px',
        'color': '#02ff00',
    });
    $("#banben").css({
        'text-align': 'left',
    });
}

function appendMsg() {
    var btn = '<div id="kaiguandiv"><div id="qiangoumsg" class="mymsg"></div></div>';
    $("body").append(btn);
    $("#kaiguandiv").css({
        'position': 'fixed',
        'bottom': '10px',
        'left': '0px',
        'z-index': '9999',
        'text-align': 'center',
        'width': '100%',
        'font-size': '18px',
        'font-family': 'Microsoft YaHei',
    });
    $("#qiangoumsg").css({
        'width': '100%',
        'margin': '10% 0',
        'background': '#0a0707',
        'border-radius': '3px',
        'min-height': '30px',
        'padding-top': '10px',
        'color': '#02ff00',
    });
}

var host = window.location.host;
if (host == "item.m.jd.com") {
    appendBtn();
    var logined = false;
    setInterval(function () {
        logined = _isLogin && _isLogin == "1";
    }, 200);

    var href_sku = window.location.pathname.replace(/[^0-9]/ig, "");
    var skuIds = _itemOnly.item;
    $.each(skuIds.newColorSize, function (i, s) {
        var banben = s['1'] + s['2'] + s['3'];
        var sk = s.skuId;
        var checked = href_sku + '' == sk + '' ? "checked" : "";
        var ht = '<label style="cursor: pointer;white-space: nowrap;"><input name="banben" type="radio" value="' + sk + '" ' + checked + '/>' + banben + ' </label>';
        $("#banben").append(ht);
        $("#banben").append("<br>");
    });
    $("#gotologin").click(function () {
        var href = "https://plogin.m.jd.com/user/login.action?appid=300&returnurl=" + encodeURIComponent(window.location.href);
        window.location.href = href;
    });
    $("#kaiguanbtn").click(function () {
        var f = logined == true;
        if (!f) {
            alert("请先登录");
            var href = "https://plogin.m.jd.com/user/login.action?appid=300&returnurl=" + encodeURIComponent(window.location.href);
            window.location.href = href;
        } else {
            var sks = $('input[name=banben]:checked');
            $.each(sks, function (i, c) {
                var id = $(c).val();
                var openurl = "https://wqs.jd.com/order/s_confirm_miao.shtml?sceneval=2&scene=jd&isCanEdit=1&commlist=,,1," + id;
                window.location.href = openurl;
            });
        }
    });
} else if (host == "item.jd.com") {
    $("body").css("overflow-x", "hidden");
    var sku = window.location.pathname.replace(/[^0-9]/ig, "");
    popWin.showWin("300", $(window).height() - 50, "<font color=red>可以多开几个页面</font>", "https://item.m.jd.com/product/" + sku + ".html");
} else {
    var count = 1;
    var title = $("title").text();
    if (title == "确认订单") {
        appendMsg();
        $(function () {
            if ($("#btnPayOnLine").length == 1) {
                setInterval(function () {
                    var msg = "第" + count + "次！";
                    if ($(".mod_alert_v2").length > 0) {
                        msg += $(".mod_alert_v2 p").text();
                        $(".mod_alert_v2").hide();
                    }
                    if ($("#noStockTplModel").length > 0) {
                        msg += $("#noStockTplModel h3").text();
                        msg += $("#noStockTplModel p").text();
                        $("#noStockTplModel").remove();
                    }
                    $("#qiangoumsg").text(msg);
                    $(".mod_alert_v2_mask").remove();
                    $(".mod_alert_mask").remove();
                    if ($("#lineVoiceMobile").length == 1) {
                        var phone = $("#lineVoiceMobile").val();
                        if (phone == "") {
                            $("#lineVoiceMobile").val("13800138000");
                        }
                    }
                }, 100);
                setInterval(() => {
                    $("#btnPayOnLine").click();
                    count++;
                }, 800);
            } else {
                window.location.reload();
            }
        })

    }
}
setInterval(function () {
    if ($("#id-pcprompt-mask")) {
        $("#id-pcprompt-mask").remove();
    }
}, 100)
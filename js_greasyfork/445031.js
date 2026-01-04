// ==UserScript==
// @name         解锁稿定设计
// @namespace    Gaoding_Unlock
// @version      1.0
// @description  解锁稿定设计全姿势，互联网冲浪坚决不花钱 (‾◡◝)
// @author       zhihu
// @match        *://*.gaoding.com/design*
// @match        *://*.gaoding.com/*
// @match        *://*.gaoding.com/odyssey/design*
// @icon         https://www.gaoding.com//favicon.ico
// @require      https://cdn.staticfile.org/limonte-sweetalert2/11.1.9/sweetalert2.all.min.js
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @connect      tool.zhihupe.com
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/445031/%E8%A7%A3%E9%94%81%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/445031/%E8%A7%A3%E9%94%81%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1.meta.js
// ==/UserScript==
var href = window.location.href;

function GMaddScript(js) {
    let script = document.createElement('script');
    script.src = js;
    var docu = document.head || document.documentElement;
    docu.appendChild(script);
};

function GMaddStyle(css) {
    var addStyle = document.createElement('style');
    addStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(addStyle);
};

function GMsetValue(name, Value) {
    localStorage.setItem(name, Value);
}

function GMgetValue(name) {
    let StorageValue = localStorage.getItem(name);
    return StorageValue;
}

function GMdeleteValue(name) {
    localStorage.removeItem(name);
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function Toast(msg, duration = 3000) {
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(() => {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}
var css = `.swal2-show{background: url(https://st-gdx.dancf.com/assets/20191228-211030-3877.png);background-size: cover;}
          .swal2-confirm{background: linear-gradient(308deg,#cb913e,#d7ac6e)!important;color: #fff!important;font-weight: 700!important;box-shadow: 0 12px 20px 0 rgba(207,153,76,.3)!important;}
          .swal2-cancel{background-color: #fff!important;color: #222!important;font-weight: 700!important;}
         `
GMaddStyle(css);

async function addbtn() {
    await sleep(2500);
    var userid;
    var usertime;
    var strtotime;
    var usertimetip;
    if (GMgetValue("isvip") == 1 && GMgetValue("usertime") !="未开通会员"){
        var date = new Date();
        var nowtime = date.getTime()
        var endtime = new Date(GMgetValue("usertime"));
        var end_time = endtime.getTime();
        alert(nowtime)
        alert(end_time)
        if (nowtime > end_time) {
            GMsetValue("isvip", "0")
            GMsetValue("usertime", "未开通会员")
        }else{
          alert("会员")
        }
       }
    if (GMgetValue("userid") != null) {
        userid = GMgetValue("userid")
    }
    if(GMgetValue("usertime") !="未开通会员"){
      usertimetip =  GMgetValue("usertime")+"到期"
    }else{
      usertimetip=  GMgetValue("usertime")
    }
    var html1 = '<div style="display: flex;align-items: center;justify-content: space-between;"><h5 style="color: #825723;font-weight: 400;font-size: 16px;display: flex;line-height: 24px;">您好,<div style="display: inline-block;max-width: 130px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' + userid + ' </div></h5><h5 style="max-width: 220px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color: #825723;font-weight: 400;font-size: 14px;line-height: 24px;">' + usertimetip + '</h5></div><a><div id ="cancel" style="text-align: right;font-size: 16px;line-height: 24px;color: #825723;font-weight: 700;">切换账号</div></a>'
    var html2 = '<h5 style="margin-top: 20px;color: #825723;display: block;font-weight: 700;font-size: 16px;line-height: 24px;text-align: left;">手机号：</h5><input id="userid" type="number" style="box-sizing: border-box;margin: 0;font-variant: tabular-nums;list-style: none;position: relative;display: inline-block;padding: 4px 12px;font-size: 14px;line-height: 1.5;width: 360px;height: 48px;margin-top: 12px;border-radius: 4px;border: none;color: #825723;caret-color: #825723;background: linear-gradient(308deg,rgba(223,181,128,.67),rgba(231,197,155,.67));transition: background .25s ease;">'
    var main;
    if (GMgetValue("userid") != null) {
        main = html1
    } else {
        main = html2
    }
    var btnhtml = '<span id="jihuo" class="gm-layout-nav__link-container"><span class="g-popover__container"><span  class="gm-layout-nav__link"><span style="color:#f54531">激活会员</span></span></span></span>'
    $(".gm-layout-nav__main").prepend(btnhtml)
    $('body').on('click', '#cancel', function () {
       GMdeleteValue("userid");
       GMdeleteValue("usertime")
       GMsetValue("isvip", "0")
       window.location.reload()
    });
    $('body').on('click', '#jihuo', function () {
        var html = '<div>' + main + '<h5 style="margin-top: 15px;color: #825723;display: block;font-weight: 700;font-size: 16px;line-height: 24px;text-align: left;">激活码：</h5><input id="key"  type="text" style="box-sizing: border-box;margin: 0;font-variant: tabular-nums;list-style: none;position: relative;display: inline-block;padding: 4px 12px;font-size: 14px;line-height: 1.5;width: 360px;height: 48px;margin-top: 12px;border-radius: 4px;border: none;color: #825723;caret-color: #825723;background: linear-gradient(308deg,rgba(223,181,128,.67),rgba(231,197,155,.67));transition: background .25s ease;"></div>';
        Swal.fire({
            html: html,
            width: 418,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: '激活',
            cancelButtonText: '关闭',
            reverseButtons: true
        }).then((isConfirm) => {
            if (isConfirm.value) {
                userid = $("#userid").val();
                var key = $("#key").val();
                if (userid == null) {
                    userid = GMgetValue("userid")
                }
                var url;
                if (key == "") {
                    url = "http://tool.zhihupe.com/gaoding/api.php?m=API&userid=" + userid
                } else {
                    url = "http://tool.zhihupe.com/gaoding/api.php?m=API&userid=" + userid + "&key=" + key

                }
                if (userid != null) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            "Content-Type": "text/html; charset=utf-8"
                        },
                        onload: function (res) {
                                console.log(res.responseText)
                                var json = JSON.parse(res.responseText);

                                if (json.error == 1) {
                                    usertime = json.usertime
                                    GMsetValue("userid", userid);
                                    GMsetValue("usertime", usertime)
                                    GMsetValue("isvip", "1")
                                    window.location.reload()
                                    Toast("会员有效期至：" + usertime);
                                } else if (json.error == 2) {
                                    let msg = json.msg
                                    Toast(msg);
                                } else if (json.error == 3) {
                                    usertime = json.usertime
                                    GMsetValue("userid", userid);
                                    GMsetValue("usertime", usertime)
                                    GMsetValue("isvip", "0")
                                    window.location.reload()
                                    Toast(usertime);
                                } else if (json.error == 4) {
                                    usertime = json.usertime
                                     let msg = json.msg
                                    GMsetValue("userid", userid);
                                    GMsetValue("usertime", usertime)
                                    if(msg!="未开通会员"){
                                    GMsetValue("isvip", "1")
                                    }else{
                                    GMsetValue("isvip", "0")
                                    }
                                    Toast(msg);
                                    window.location.reload()

                                } else if (json.error == -1) {
                                    let msg = json.msg
                                    Toast(msg);
                                } else {
                                    Toast('服务器请求失败，请重试！');
                                }
                            },
                            onerror: function (err) {
                                Toast(err);
                            }
                    });
                } else {
                    Toast('请输入手机号！');
                }
            }
        });
    });
}
addbtn();

if (href.indexOf("design") > -1) {
    if (GMgetValue("isvip") == 1) {
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    let json = JSON.parse(result);
                    switch (true) {
                    case /\/risk_materials(.*?)/.test(arguments[1]):
                        json.product_materials.length = 0;
                        result = JSON.stringify(json);
                        break;
                    case /\/api\/users\/me(.*?)/.test(arguments[1]):
                        json.vip = {
                            vip_id: 3,
                            level: 80,
                        };
                        result = JSON.stringify(json);
                        break;
                    }
                    return result;
                },
            });
            return origOpen.apply(xhr, arguments);
        };
    }
}
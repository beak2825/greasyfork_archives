// ==UserScript==
// @name         解除B站區域限制輔助腳本（原名稱：自定義服務器）
// @version      0.7.6
// @description  以彈窗設定解除B站區域限制腳本設置的小工具，必須配合解除B站區域限制腳本一同使用。
// @author       i9602097
// @include      *://www.bilibili.com/video/av*
// @include      *://bangumi.bilibili.com/anime/*
// @include      *://www.bilibili.com/blackboard/html5player.html*
// @run-at       document-end
// @grant      GM_registerMenuCommand
// @grant      unsafeWindow
// @noframes
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/28907/%E8%A7%A3%E9%99%A4B%E7%AB%99%E5%8D%80%E5%9F%9F%E9%99%90%E5%88%B6%E8%BC%94%E5%8A%A9%E8%85%B3%E6%9C%AC%EF%BC%88%E5%8E%9F%E5%90%8D%E7%A8%B1%EF%BC%9A%E8%87%AA%E5%AE%9A%E7%BE%A9%E6%9C%8D%E5%8B%99%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/28907/%E8%A7%A3%E9%99%A4B%E7%AB%99%E5%8D%80%E5%9F%9F%E9%99%90%E5%88%B6%E8%BC%94%E5%8A%A9%E8%85%B3%E6%9C%AC%EF%BC%88%E5%8E%9F%E5%90%8D%E7%A8%B1%EF%BC%9A%E8%87%AA%E5%AE%9A%E7%BE%A9%E6%9C%8D%E5%8B%99%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==
//
console.log("Hello");
var balh_server = null;
var balh_mode = null;
var balh_blocked_vip = null;

function logCookie(argument) {
    if (unsafeWindow.bangumi_aera_limit_hack) {
        console.log("讀取的Cookie值為：" + argument + "=" + unsafeWindow.bangumi_aera_limit_hack.getCookie(argument));
        return unsafeWindow.bangumi_aera_limit_hack.getCookie(argument);
    } else {
        console.log("執行失敗\n還未加載解除B站區域限制腳本");
    }
}

function setDefaultText(argument) {
    if (argument) {
        return argument;
    } else {
        return 'https://www.biliplus.com';
    }
}

function setDefaultValue(argument) {
    if (argument) {
        return argument;
    } else {
        return 'default';
    }
}

function popupText(argument) {
    if (argument) {
        return "讀取的Cookie值為：" + argument + "\n將使用上述伺服器";
    } else {
        return "讀取的Cookie值為空白\n將使用預設伺服器";
    }
}

function warningText(argument) {
    if (argument) {
        return "\n請注意需再使用「打開異步登錄登入頁面」登入新伺服器";
    } else {
        return "";
    }
}

function modeText(argument) {
    switch (argument) {
        case 'default':
            return "默認模式";
            break;
        case 'replace':
            return "替換模式";
            break;
        case 'redirect':
            return "重定向模式";
            break;
        default:
            return "錯誤";
    }
}

function setHost(argument) {
    if (argument === null) {
        balh_server = logCookie('balh_server');
        alert("已取消操作\nCookie沒被修改\n" + popupText(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_server')));
    } else {
        if (unsafeWindow.bangumi_aera_limit_hack.setCookie('balh_server', argument) && unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_server') == argument) {
            balh_server = logCookie('balh_server');
            alert("操作成功\nCookie已經成功修改\n" + popupText(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_server')) + "\n將重新加載頁面" + warningText(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_blocked_vip')));
            unsafeWindow.location.reload(true);
        } else {
            balh_server = logCookie('balh_server');
            alert("操作失敗\n請檢查解除B站區域限制腳本是否正確");
            unsafeWindow.location.reload(true);
        }
    }
}

function changeServer() {
    if (unsafeWindow.bangumi_aera_limit_hack) {
        logCookie('balh_server');
        setHost(prompt("請輸入自定義服務器地址\n清空則清除Cookie值\n按取消鍵取消操作", setDefaultText(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_server'))));
    } else {
        alert("執行失敗\n請確定是否已安裝並打開解除B站區域限制腳本");
    }
}

function getMode() {
    if (unsafeWindow.bangumi_aera_limit_hack) {
        logCookie('balh_mode');
        if (setDefaultValue(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode')) == 'default' || setDefaultValue(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode')) == 'replace' || setDefaultValue(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode')) == 'redirect') {
            alert("正在使用" + modeText(setDefaultValue(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode'))));
        } else {
            balh_mode = logCookie('balh_mode');
            alert("Cookie值錯誤\n將重新加載頁面\n修正錯誤");
            unsafeWindow.location.reload(true);
        }
    } else {
        alert("執行失敗\n請確定是否已安裝並打開解除B站區域限制腳本");
    }
}

function setMode(argument) {
    if (unsafeWindow.bangumi_aera_limit_hack) {
        logCookie('balh_mode');
        if (setDefaultValue(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode')) != argument) {
            if (confirm("正在使用" + modeText(setDefaultValue(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode'))) + "\n是否把代理模式設定為" + modeText(setDefaultValue(argument)))) {
                if (unsafeWindow.bangumi_aera_limit_hack.setCookie('balh_mode', argument) && setDefaultValue(unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode')) == argument) {
                    balh_mode = logCookie('balh_mode');
                    alert("操作成功\n代理模式已設定為" + modeText(setDefaultValue(argument)) + "\n將重新加載頁面");
                    unsafeWindow.location.reload(true);
                } else {
                    balh_mode = logCookie('balh_mode');
                    alert("操作失敗\n請檢查解除B站區域限制腳本是否正確");
                    unsafeWindow.location.reload(true);
                }
            } else {
                alert("已取消操作");
            }
        } else {
            alert("不要沒事找事做");
        }
    } else {
        alert("執行失敗\n請確定是否已安裝並打開解除B站區域限制腳本");
    }
}

function setDefaultMode() {
    setMode('default');
}

function setReplaceMode() {
    setMode('replace');
}

function setRedirectMode() {
    setMode('redirect');
}

function changeAsyncLogin() {
    if (unsafeWindow.bangumi_aera_limit_hack) {
        logCookie('balh_blocked_vip');
        if (unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_blocked_vip')) {
            if (confirm("正在使用異步登錄\n是否關閉異步登錄")) {
                if (unsafeWindow.bangumi_aera_limit_hack.setCookie('balh_blocked_vip', '') && !unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_blocked_vip')) {
                    balh_blocked_vip = logCookie('balh_blocked_vip');
                    alert("操作成功\n異步登錄已關閉\n將重新加載頁面");
                    unsafeWindow.location.reload(true);
                } else {
                    balh_blocked_vip = logCookie('balh_blocked_vip');
                    alert("操作失敗\n請檢查解除B站區域限制腳本是否正確");
                    unsafeWindow.location.reload(true);
                }
            } else {
                alert("已取消操作");
            }
        } else {
            if (confirm("沒有使用異步登錄\n是否打開異步登錄")) {
                if (unsafeWindow.bangumi_aera_limit_hack.setCookie('balh_blocked_vip', 'true') && unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_blocked_vip')) {
                    balh_blocked_vip = logCookie('balh_blocked_vip');
                    alert("操作成功\n異步登錄已開打開\n將重新加載頁面\n如果是第一次使用這功能\n請注意在重新加載後\n使用「打開異步登錄登入頁面」登入代理伺服器");
                    unsafeWindow.location.reload(true);
                } else {
                    balh_blocked_vip = logCookie('balh_blocked_vip');
                    alert("操作失敗\n請檢查解除B站區域限制腳本是否正確");
                    unsafeWindow.location.reload(true);
                }
            } else {
                alert("已取消操作");
            }
        }
    } else {
        alert("執行失敗\n請確定是否已安裝並打開解除B站區域限制腳本");
    }
}

function checkCookie() {
    console.log("頁面發生改變\n檢查Cookie是否變化");
    if (unsafeWindow.bangumi_aera_limit_hack) {
        console.log("記錄的Cookie值為：balh_server=" + balh_server);
        console.log("記錄的Cookie值為：balh_mode=" + balh_mode);
        console.log("記錄的Cookie值為：balh_blocked_vip=" + balh_blocked_vip);
        logCookie('balh_server');
        logCookie('balh_mode');
        logCookie('balh_blocked_vip');
        if (unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_server') != balh_server || unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode') != balh_mode || unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_blocked_vip') != balh_blocked_vip) {
            balh_server = logCookie('balh_server');
            balh_mode = logCookie('balh_mode');
            balh_blocked_vip = logCookie('balh_blocked_vip');
            alert("Cookie值已改變\n將重新加載頁面\n以重新載入腳本命令項目");
            unsafeWindow.location.reload(true);
        } else {
            console.log("Cookie值沒改變");
        }
    } else {
        console.log("執行失敗\n還未加載解除B站區域限制腳本");
    }
}

function initFunction() {
    if (unsafeWindow.bangumi_aera_limit_hack) {
        balh_server = logCookie('balh_server');
        balh_mode = logCookie('balh_mode');
        balh_blocked_vip = logCookie('balh_blocked_vip');
        if (setDefaultValue(balh_mode) != 'default' && setDefaultValue(balh_mode) != 'replace' && setDefaultValue(balh_mode) != 'redirect') {
            console.log("Cookie值錯誤\n重設Cookie值");
            if (unsafeWindow.bangumi_aera_limit_hack.setCookie('balh_mode', '') && !unsafeWindow.bangumi_aera_limit_hack.getCookie('balh_mode')) {
                balh_mode = logCookie('balh_mode');
                console.log("成功重設Cookie值");
            } else {
                balh_mode = logCookie('balh_mode');
                console.log("重設Cookie值失敗");
            }
        }
        GM_registerMenuCommand('自定義服務器地址', changeServer);
        GM_registerMenuCommand('代理模式：' + modeText(setDefaultValue(balh_mode)), getMode);
        if (setDefaultValue(balh_mode) != 'default')
            GM_registerMenuCommand('更改代理模式為默認模式', setDefaultMode);
        if (setDefaultValue(balh_mode) != 'replace')
            GM_registerMenuCommand('更改代理模式為替換模式', setReplaceMode);
        if (setDefaultValue(balh_mode) != 'redirect')
            GM_registerMenuCommand('更改代理模式為重定向模式', setRedirectMode);
        if (balh_blocked_vip) {
            GM_registerMenuCommand('打開異步登錄登入頁面', unsafeWindow.bangumi_aera_limit_hack.login);
            GM_registerMenuCommand('清除異步登錄登入資料', unsafeWindow.bangumi_aera_limit_hack.logout);
            GM_registerMenuCommand('關閉異步登錄', changeAsyncLogin);
        } else {
            GM_registerMenuCommand('打開異步登錄', changeAsyncLogin);
        }
        unsafeWindow.addEventListener('focus', checkCookie, false);
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) checkCookie();
        }, false);
    } else {
        console.log("執行失敗\n還未加載解除B站區域限制腳本");
    }
}

function GM_wait(coun) {
    if (coun < 100) {
        console.log("第" + (coun + 1) + "次測試是否加載解除B站區域限制腳本");
        if (typeof unsafeWindow.bangumi_aera_limit_hack == 'undefined') {
            console.log("還未加載解除B站區域限制腳本\n延遲100毫秒");
            window.setTimeout(GM_wait(coun + 1), 100);
        } else {
            console.log("已加載解除B站區域限制腳本\n設置腳本命令");
            initFunction();
        }
    } else {
        console.log("已測試超過" + coun + "次還未加載\n放棄設置腳本命令");
    }
}
if (!unsafeWindow.bangumi_aera_limit_hack) {
    var bangumi_aera_limit_hack;
    console.log("還未加載解除B站區域限制腳本\n設置監聽");
    Object.defineProperty(unsafeWindow, 'bangumi_aera_limit_hack', {
        configurable: true,
        enumerable: true,
        set: function(v) {
            bangumi_aera_limit_hack = v;
            console.log("正在加載解除B站區域限制腳本\n設置腳本命令");
            initFunction();
        },
        get: function() {
            return bangumi_aera_limit_hack;
        }
    });
} else {
    console.log("已加載解除B站區域限制腳本\n設置腳本命令");
    initFunction();
}
// GM_wait(0);
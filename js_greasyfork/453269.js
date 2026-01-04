// ==UserScript==
// @name         腾讯企业邮箱自动登录
// @version      0.1.0
// @description  简单Demo，首次使用需要输入邮箱账号及密码（仅存储在油猴/脚本猫脚本存储中）。这届产品经理不行。
// @author       DreamNya
// @match        https://exmail.qq.com/login
// @icon         https://exmail.qq.com/exmail_logo.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/453269/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453269/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
/*global $*/
let email = GM_getValue("账号");
let password = GM_getValue("密码");
let auto = GM_getValue("自动登录");

while (!email) {
    email = prompt("首次登录需要输入邮箱账号（账号密码如果输错需要重装脚本或者修改脚本存储内容）")
    if (email) {
        GM_setValue("账号", email)
        break
    }
};
while (!password) {
    password = prompt("首次登录需要输入密码（仅存储在油猴/脚本猫脚本存储中）")
    if (password) {
        GM_setValue("密码", password)
        break
    }
};
if (auto == void 0) {
    auto = confirm("是否勾选5天内自动登录")
    GM_setValue("自动登录", auto)
};

!function ShowPassword() {
    if ($(".js_show_pwd_panel:first").length > 0) {
        $(".js_show_pwd_panel:first").click()
        !function AutoFill() {
            if ($("#inputuin").length + $("#pp").length + $("#auto_login_in_five_days_pwd").length + $("#btlogin").length == 4) {
                $("#inputuin").val(email)
                $("#pp").val(password)
                if (auto) {
                    $("#auto_login_in_five_days_pwd").click()
                }
                $("#btlogin").click()
            } else {
                setTimeout(AutoFill, 100)
            }
        }()
    } else {
        setTimeout(ShowPassword, 100)
    }
}();
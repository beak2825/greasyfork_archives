// ==UserScript==
// @name         小鹅通管理台快捷入口
// @version      1.1.6
// @description  筛选店铺
// @author       Zosah
// @icon         https://commonresource-1252524126.cdn.xiaoeknow.com/image/lhyaurs50zil.ico
// @match        *://admin.xiaoe-tech.com/login*
// @match        *://admin.xiaoe-tech.com/t/login*
// @match        *://admin.xiaoe-tech.com/muti_index*
// @match        *://admin.xiaoe-tech.com/t/account/muti_index*
// @match        *://admin.xiaoe-tech.com/*/*?app_id=*
// @grant        none
// @namespace https://greasyfork.org/users/878840
// @downloadURL https://update.greasyfork.org/scripts/470310/%E5%B0%8F%E9%B9%85%E9%80%9A%E7%AE%A1%E7%90%86%E5%8F%B0%E5%BF%AB%E6%8D%B7%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/470310/%E5%B0%8F%E9%B9%85%E9%80%9A%E7%AE%A1%E7%90%86%E5%8F%B0%E5%BF%AB%E6%8D%B7%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function () {
    // 生成账号节点
    generateAccountDom();
    // 移除绑定微信弹窗
    removeWxTips();
    // 重定向到列表页
    directionToListPage();
    // 生成店铺节点
    generateShopDom();
})();

function generateAccountDom() {
    const currentBtn = [
        {
            label: "通用",
            username: "15991672530",
            password: "¥%2023@xiaoet#@!",
            bgc: "#E0EBFF",
            color: "#000000"
        },
        {
            label: "自用",
            username: "13104997306",
            password: "aa123456789",
            bgc: "#cdf61e",
            color: "#000000"
        },
        {
            label: "电商1",
            username: "13311111111",
            password: "¥%2023@xiaoet#@!",
            bgc: "#6cad62",
            color: "#000000"
        },
        {
            label: "商家",
            username: "13322222222",
            password: "¥%2023@xiaoet#@!",
            bgc: "#a78e44",
            color: "#FFFFFF"
        },
        {
            label: "课程",
            username: "13355555555",
            password: "¥%2023@xiaoet#@!",
            bgc: "#7fecad",
            color: "#000000"
        },
        {
            label: "数据",
            username: "13377777777",
            password: "¥%2023@xiaoet#@!",
            bgc: "#f9906f",
            color: "#FFFFFF"
        },
        {
            label: "电商2",
            username: "13388888888",
            password: "¥%2023@xiaoet#@!",
            bgc: "#cea61e",
            color: "#000000"
        },
        {
            label: "直播",
            username: "13399999999",
            password: "¥%2023@xiaoet#@!",
            bgc: "#4d9bb1",
            color: "#FFFFFF"
        },
        {
            label: "助学",
            username: "14466666666",
            password: "¥%2023@xiaoet#@!",
            bgc: "#ef7a82",
            color: "#FFFFFF"
        },
    ]
    const url = window.location.href;
    if (url.indexOf('login') && url.indexOf('wx')) {
        window.location.href = url.replace("wx", "acount");
    }
    // 显示密码
    if (url.indexOf('login') && url.indexOf('acount')) {
        function checker() {
            let passwordInput = document.querySelector('input[placeholder="密码"]');
            if (passwordInput) {
                passwordInput.type = "text";
            } else {
                setTimeout(() => {
                    checker()
                }, 500)
            }
        }
        checker();
        // 根节点
        let box = document.getElementsByClassName("loginContainer")[0];
        if (!box) return;
        // 大盒子
        let obox = document.createElement('div')
        obox.style = "position:fixed;right:100px;top:250px;"
        box.appendChild(obox)
        // 按钮
        for (let i = 0; i < currentBtn.length; i++) {
            let btn = document.createElement('div')
            btn.innerText = currentBtn[i].username + `${currentBtn[i].label ? '-' + currentBtn[i].label : ''}`;
            btn.style = genStyle(currentBtn[i].bgc, currentBtn[i].color);
            obox.appendChild(btn)
            btn.addEventListener('click', (e) => {
                let usernameInput = document.querySelector('input[placeholder="手机号/账号"]');
                let passwordInput = document.querySelector('input[placeholder="密码"]');
                usernameInput.value = currentBtn[i].username;
                passwordInput.value = currentBtn[i].password;
                const inputEvent = new Event('input', { bubbles: true });
                usernameInput.dispatchEvent(inputEvent);
                passwordInput.dispatchEvent(inputEvent);
            })
        }
    }

}

function generateShopDom() {
    // 根节点
    let box = document.getElementsByClassName("account-header-wrapper")[0];
    if (!box) return;
    // 大盒子
    let obox = document.createElement('div')
    obox.style = "position:fixed;right:100px;top:250px;"
    box.appendChild(obox)
    // 按钮
    let currentBtn = getDomBtnArr();
    for (let i = 0; i < currentBtn.length; i++) {
        let btn = document.createElement('div')
        btn.innerText = currentBtn[i].name;
        btn.style = genStyle(currentBtn[i].bgc, currentBtn[i].color);
        obox.appendChild(btn)
        btn.addEventListener('click', (e) => {
            window.open(window.location.origin + "/xe.merchant-serve.shop_list.shop.choose/1.0.0?app_id=" + currentBtn[i].app_id);
        })
    }
};

function getDomBtnArr() {
    const btnArr = [
        {
            name: "现网蓝悦",
            app_id: "appAKLWLitn7978",
            bgc: "#1472ff",
            color: "white"
        },
        {
            name: "4581准现网",
            app_id: "apprnDA0ZDw4581",
            bgc: "#E0EBFF",
            color: "#000000"
        },
        {
            name: "直播独立车专用-旗舰版-1",
            app_id: "appimlhtl0w2710",
            bgc: "#f19f47",
            color: "white"
        },
        {
            name: "直播独立车专用-专业版-1",
            app_id: "appp1Fbyb975179",
            bgc: "#4b9f19",
            color: "white"
        },
        {
            name: "直播独立车专用-专业版-2",
            app_id: "appbndl6ixn7966",
            bgc: "#c8bfe1",
            color: "white"
        }
    ]
    return btnArr;
}

function genStyle(bgc, color) {
    return `
    min-width:180px;
    height:50px;
    line-height:50px;
    text-align:center;
    cursor: pointer;
    font-size: 16px;
    font-family: PingFangSC-Regular,PingFang SC;
    font-weight: 400;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 0px 10px;
    margin-bottom:10px;
    border-radius:5px;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;background:` + bgc + `;color:` + color + ";";
}

function directionToListPage() {
    if (window.location.href.indexOf("/xe.merchant-serve.shop_list.shop.choose/1.0.0?app_id=") !== -1) {
        let url = window.location.origin;
        url = url + "/live#/list?resource_type=4"
        window.location.href = url;
    }
}

function removeWxTips() {
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    document.cookie = "bind_wx_tips=1; expires=" + expirationDate.toUTCString() + "; path=/";
}

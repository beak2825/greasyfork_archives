// ==UserScript==
// @name         (新商盟)远程公告
// @version      23.11.22
// @description  XSM
// @match        *://*/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/467218/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E8%BF%9C%E7%A8%8B%E5%85%AC%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/467218/%28%E6%96%B0%E5%95%86%E7%9B%9F%29%E8%BF%9C%E7%A8%8B%E5%85%AC%E5%91%8A.meta.js
// ==/UserScript==

/*(function() {
    if (window.location.href.includes("xinshangmeng.com/xsm2/indexs.html?Version=") 
        || window.location.href.includes("xinshangmeng.com/xsm6/index-gz.html?Version=") 
        || window.location.href.includes("xinshangmeng.com/xsm6/indexs.html?Version=") 
        || window.location.href === "https://dh.sztobacco.cn/") {

        // 检测媒体查询字符串，判断当前设备是否为横屏
        var isLandscape = window.matchMedia("(orientation: landscape)").matches;

        // 根据检测结果设置 scale 和 top 的值
        var scale = isLandscape ? 1.1 : 2.1;
        var top = isLandscape ? "66%" : "50%";

        var popup = document.createElement("div");
        popup.style.cssText = "position: fixed; top: " + top + "; left: 50%; transform: translate(-50%, -50%) scale(" + scale + "); padding: 20px; background-color: #ffd936; border-radius: 10px; text-align: left; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);";
        var popupTitle = document.createElement("h2");
        popupTitle.innerText = "订烟神器活动通知:";
        popupTitle.style.cssText = "color: red; font-family: 'Microsoft YaHei'; font-weight: bold; font-size: 22px;";
        popup.appendChild(popupTitle);
        var popupContent = document.createElement("div");
        popupContent.innerText = "成功推荐2人，送1年版卡密1个(价值99元)；\n成功推荐4人，送5年版卡密1个(价值499元)；\n成功推荐6人，送终身版卡密1个(价值999元)";
        popupContent.style.cssText = "color: black; font-family: 'Microsoft YaHei'; font-weight: bold; font-size: 16px;";
        popup.appendChild(popupContent);

        // 新增标题和内容
        //var newPopupTitle = document.createElement("h3");
        //newPopupTitle.innerText = "订烟神器(深圳烟草安卓版23.8.5.2)已更新:";
        //newPopupTitle.style.cssText = "color: red; font-family: 'Microsoft YaHei'; font-weight: bold;";
        //popup.appendChild(newPopupTitle);
        //var newPopupContent = document.createElement("div");
        //newPopupContent.innerHTML = "1.优化了一些已知问题<br>2.<a href='https://wwun.lanzouw.com/iHHWv14ip3na'>点击此处下载更新</a>";
        //newPopupContent.style.cssText = "color: black; font-family: 'Microsoft YaHei'; font-weight: bold; font-size: 16px;";
        //popup.appendChild(newPopupContent);

        var closeButton = document.createElement("button");
        closeButton.innerText = "关闭";
        closeButton.style.cssText = "position: absolute; top: 10px; right: 10px;";
        closeButton.onclick = function() {
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);
        document.body.appendChild(popup);

        // 监听 #username 元素的点击事件
        var usernameElement = document.querySelector("#username");
        if (usernameElement) {
            usernameElement.addEventListener("click", function() {
                document.body.removeChild(popup);
            });
        }
    }

})();*/
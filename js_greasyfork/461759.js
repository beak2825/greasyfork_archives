// ==UserScript==
// @name        货捕头&淘洋网主图替换 Replace Img Src with Id
// @namespace   货捕头&淘洋网主图替换 方便一键下载图片
// @include     https://www.hznzcn.com/product-*.html
// @include     https://www.51taoyang.com/goods-*.html
// @match       https://www.hznzcn.com/product-*.html
// @grant       GM_registerMenuCommand
// @grant       GM_info
// @run-at document-end
// @version     1.0.2
// @author      -
// @description Replace img src attribute with id attribute in div id="imageMenu" 2023/3/13下午9:31:20
// @downloadURL https://update.greasyfork.org/scripts/461759/%E8%B4%A7%E6%8D%95%E5%A4%B4%E6%B7%98%E6%B4%8B%E7%BD%91%E4%B8%BB%E5%9B%BE%E6%9B%BF%E6%8D%A2%20Replace%20Img%20Src%20with%20Id.user.js
// @updateURL https://update.greasyfork.org/scripts/461759/%E8%B4%A7%E6%8D%95%E5%A4%B4%E6%B7%98%E6%B4%8B%E7%BD%91%E4%B8%BB%E5%9B%BE%E6%9B%BF%E6%8D%A2%20Replace%20Img%20Src%20with%20Id.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        try {
          if (window.location.href.includes("hznzcn.com")) {
            const div = document.querySelector("#imageMenu");
            const images = div.querySelectorAll("img");
            images.forEach(img => {
                // console.log(img.src);
                // 将 id 属性的值设置为 src 属性的值
                img.src = img.id;
            });

            // 获取id为J_playVideo的div元素
            const videoDiv = document.getElementById("J_playVideo");
            // 如果元素存在
            if (videoDiv) {
              const videoUrl = videoDiv.getAttribute("videourl");

              const newLink = document.createElement("a");
              newLink.setAttribute("href", videoUrl);
              newLink.setAttribute("target", "_blank");
              newLink.setAttribute("class", "aLabel buyShow");
              newLink.textContent = "视频地址";
              const oldLink = document.querySelector(".aLabel.buyShow");
              oldLink.parentNode.replaceChild(newLink, oldLink);


              const link = document.createElement("a");
              // 设置a元素的href属性为videourl属性值
              link.href = videoUrl;
              link.textContent = "视频地址";

              // 获取要插入链接的目标元素
              const target = document.querySelector(".shopData-li2");
              // 如果目标元素存在
              if (target) {
                target.appendChild(link);
              } else {
                console.log("目标元素不存在");
              }


            // 內置的下載 fix
            // 获取 allCount 元素
            const allCount = document.getElementById("allCount");
            // 创建一个新的 a 标签
            const downloadLink = document.createElement("a");
            downloadLink.id = "imagePackBtn";
            downloadLink.href = "javascript:;";
            downloadLink.rel = "nofollow";
            downloadLink.textContent = "立即下载";
            // 将新的 a 标签插入到 allCount 元素的后面
            allCount.insertAdjacentElement("afterend", downloadLink);


            } else {
              console.log("J_playVideo元素不存在");
            }
          }
          else if(window.location.href.includes("51taoyang.com")){
            /*<ul class="imglist" id="imglist" style="left: 0px;">
            <li> <a href="javascript:;" data-url="https://www.51taoyang.com/images/202303/goods_img/P_20230324125133_67.jpg"
                        onclick="window.open('images/202303/goods_img/P_20230324125133_67.jpg')" class="hover">
                          <img src="https://www.51taoyang.com/images/202303/thumb_img/P_20230324125133_67.jpg"  > </a>
            </li>
            </ul>*/
            // 获取所有的 img 标签
            const imgTags = document.querySelectorAll('#imglist li a img');
            // 遍历 img 标签，替换 src 属性
            imgTags.forEach(imgTag => {
              const dataUrl = imgTag.parentElement.getAttribute('data-url');
              imgTag.setAttribute('src', dataUrl);
            });
          }
          else{
            alert('作用域出错')
          }
        } catch (error) {
          console.error('出现错误：', error);
        }
    };



})();
// ==UserScript==
// @name bilibili缩略图一键生成工具
// @namespace http://tampermonkey.net/
// @version 0.1
// @description Split sprite sheet into multiple images
// @match https://www.bilibili.com/video/*
// @grant GM_xmlhttpRequest
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480472/bilibili%E7%BC%A9%E7%95%A5%E5%9B%BE%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480472/bilibili%E7%BC%A9%E7%95%A5%E5%9B%BE%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
const TABLE = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
const S = [11, 10, 3, 8, 4, 6];
const XOR = 177451812;
const ADD = 8728348608;
let tr = {};
for (let i = 0; i < 58; i++) {
    tr[TABLE[i]] = i;
}

function bv2av(x) {
    let r = 0;
    for (let i = 0; i < 6; i++) {
        r += tr[x[S[i]]] * Math.pow(58, i);
    }
    return (r - ADD) ^ XOR;
}

function getAid(bvid) {
    if (bvid.includes("BV")) {
        return bv2av(bvid).toString();
    } else {
        return bvid;
    }
}
(function() {
    'use strict';
    // create box to display images
    // create wrapper div
    var wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.zIndex = '9999';
    document.body.appendChild(wrapper);

    // create box to display images
    var box = document.createElement('div');
    box.style.height = '100vh';
    box.style.overflow = 'auto';
    box.style.backgroundColor = '#f0f0f0';
    box.style.padding = '10px';
    box.style.alignItems = 'start';
    box.style.position = 'relative';
    box.id = 'myBox';  // 设置一个唯一的id，以便我们在样式表中引用

    document.body.appendChild(box);  // 将box添加到文档中

    var style = document.createElement('style');  // 创建一个新的style元素
    style.innerHTML = `
  #myBox::after {  // 使用::after伪元素
    content: '';
    position: absolute;
    right: -10px;  // 这将箭头定位到右边框之外
    top: 50%;  // 这将箭头定位到box的中间
    border: 10px solid transparent;
    border-left-color: #000;  // 这将创建一个向右的箭头
    transform: translateY(-50%);  // 这将箭头垂直居中
  }
`;
    document.head.appendChild(style);
    wrapper.appendChild(box);
    const randomNumber = Math.ceil(Math.random()*100000000);
    let $viewboxReport = $("#arc_toolbar_report");
    let htmlText=`
						<div id="bilibili_exti_`+randomNumber+`">
							<span class="self_s_btn" id="download_s_`+randomNumber+`">下载视频（最高清）</span>
							<input class="self_s_btn" id="focus_s_`+randomNumber+`"></input>
                            <span class="self_s_btn" id="flash`+randomNumber+`">刷新</span>
						</div>
					`;
    let cssText = `
						#bilibili_exti_`+randomNumber+`{
							padding:10px;
						}
						#bilibili_exti_`+randomNumber+` >.self_s_btn{
							background-color:#FB7299;
							color:#FFF;
							font-size:10px;
							display:inline-block;
							margin-right:15px;
							padding:2px 4px;
							border-radius:3px;
							cursor:pointer;
						}
					`;
    setTimeout(()=>{ //延时的目的是让B站先加载完全
        const playerInterval = setInterval(()=>{
            let $viewboxReport = $("#arc_toolbar_report");
            $("body").prepend("<style>"+cssText+"</style>");
            $viewboxReport.before(htmlText);

            // create hide/show toggle button
            var toggleButton = $("#download_s_"+randomNumber);
            if(toggleButton.length > 0) { // check if toggleButton exists
                toggleButton.text('显示/隐藏缩略图');
                toggleButton.hover(
                    function() {
                        $(this).css('backgroundColor', '#0056b3');
                    }, function() {
                        $(this).css('backgroundColor', '#007BFF');
                    }
                );
                toggleButton.click(function() {
                    box.style.display = box.style.display === 'none' ? 'grid' : 'none';
                });
                clearInterval(playerInterval); // clear interval if button is found

            }
            var columnInput = $("#focus_s_"+randomNumber);
            var baseWidth = 200;  // Adjust as needed
            // Add event listener to change column count when input value changes
            columnInput.on('change', function() {

                box.style.gridTemplateColumns = `repeat(${columnInput.val()}, 1fr)`;
                box.style.width = `${baseWidth * columnInput.val()}px`;
            });
            box.style.gridTemplateColumns = `repeat(${columnInput.value}, 1fr)`;
            box.style.width = `${baseWidth * columnInput.value}px`;

            var flash = $("#flash"+randomNumber);
            flash.click(function() {
                // remove all existing images and timestamps
                while (box.firstChild) {
                    box.firstChild.remove();
                }

                // load the images again
                var url = new URL(window.location.href);
                var pathNameParts = url.pathname.split('/');
                var videoId = pathNameParts[2];
                var aId = getAid(videoId);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.bilibili.com/x/player/videoshot?aid=${aId}`,
                    onload: function(response) {
                        var res = JSON.parse(response.responseText);
                        var imageUrls = res.data.image; // get the image URLs from the JSON response
                        let totalTimeInSeconds = 0;
                        // loop through each image URL
                        for (let imageUrl of imageUrls) {
                            // load the image
                            var image = new Image();
                            image.crossOrigin = "anonymous"; // add this line
                            image.src = imageUrl;
                            image.onload = function() {
                                // Here you can add your image processing logic
                                console.log('Image is loaded: ', image);
                                // 确定雪碧图的网格大小
                                let rows = 10;
                                let cols = 10;

                                // 确定每个小图片的大小
                                let width = image.width / cols; // 这里假设所有的小图片都有同样的宽度
                                let height = image.height / rows; // 这里假设所有的小图片都有同样的高度

                                // 创建一个临时的 canvas 元素来保存每个小图片
                                let canvas = document.createElement('canvas');
                                let ctx = canvas.getContext('2d');
                                canvas.width = width;
                                canvas.height = height;



                                // 遍历雪碧图的每个网格
                                for(let r = 0; r < rows; r++) {
                                    for(let c = 0; c < cols; c++) {
                                        // 计算当前小图片在雪碧图中的位置
                                        let x = c * width;
                                        let y = r * height;

                                        // 将当前小图片从雪碧图中截取出来，并绘制到临时的 canvas 元素上
                                        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

                                        // 从临时的 canvas 元素中获取小图片的 Data URL
                                        let dataUrl = canvas.toDataURL('image/jpeg');

                                        // 创建一个新的 img 元素并将其添加到可折叠的框中
                                        // 创建一个新的 div 元素，用于包含图片和时间戳
                                        let div = document.createElement('div');
                                        div.style.position = 'relative';
                                        div.style.display = 'inline-block';

                                        // 创建一个新的 img 元素并将其添加到 div 元素中
                                        let img = document.createElement('img');
                                        img.src = dataUrl;
                                        img.style.width = '100%';
                                        div.appendChild(img);

                                        // 添加一个时间戳
                                        let timestamp = document.createElement('p');
                                        let hours = Math.floor(totalTimeInSeconds / 3600);
                                        let minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
                                        let seconds = totalTimeInSeconds % 60;
                                        timestamp.textContent = hours.toString().padStart(2, '0') + ':' +
                                            minutes.toString().padStart(2, '0') + ':' +
                                            seconds.toString().padStart(2, '0');
                                        timestamp.style.position = 'absolute';
                                        timestamp.style.bottom = '0px';
                                        timestamp.style.right = '0px';
                                        timestamp.style.transform = 'translate(-100%, -100%)';
                                        timestamp.style.color = 'white';
                                        timestamp.style.fontWeight = 'bold';
                                        timestamp.style.fontSize = '10';

                                        div.appendChild(timestamp);

                                        // 将 div 添加到 box 中
                                        box.appendChild(div);

                                        // 每张图片的时间间隔为5秒
                                        totalTimeInSeconds += 5;
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }, 100);
    }, 2800);

    // create hide/show toggle button

    //wrapper.appendChild(toggleButton);
    // 调整box的样式，设置右边框的宽度和颜色
    box.style.borderRight = '20px solid #f0f0f0';

    // 添加鼠标悬停事件
    box.addEventListener('mouseover', function(event) {
        // 检查鼠标是否在box的右边框上
        var rect = box.getBoundingClientRect();
        var isHoverInside = event.clientX < rect.right && event.clientX > rect.right - 30;
        if(isHoverInside) {
            // 如果鼠标在右边框上，显示提示信息
            box.title = '点击关闭';
        } else {
            box.title = '';
        }
    });

    // 在box元素上添加一个点击事件监听器
    box.addEventListener('click', function(event) {
        // 检查点击是否发生在box的右边框上
        var rect = box.getBoundingClientRect();
        var isClickInside = event.clientX < rect.right && event.clientX > rect.right - 30;
        if(isClickInside) {
            // 如果是在右边框上点击，则切换box的显示状态
            box.style.display = box.style.display === 'none' ? 'grid' : 'none';
        }
    });


    // Change box style to use CSS grid and set initial column count
    box.style.display = 'none';
    // Set initial box width based on column count
    box.style.gridGap = '10px';


    var url = new URL(window.location.href);
    var pathNameParts = url.pathname.split('/');
    var videoId = pathNameParts[2];
    var aId = getAid(videoId);
    console.log('https://api.bilibili.com/x/player/videoshot?aid='+aId);
    // Request the image from Bilibili's API
    GM_xmlhttpRequest({
        method: "GET",
        timeout: 50000, // 设置超时时间为5000毫秒，即5秒
        url: `https://api.bilibili.com/x/player/videoshot?index=1&aid=${aId}`,
        onload: function(response) {
            var res = JSON.parse(response.responseText);
            var imageUrls = res.data.image; // get the image URLs from the JSON response
            var time = res.data.index;
            let i = 0;
            let totalTimeInSeconds = 0;
            // loop through each image URL

            for (let imageUrl of imageUrls) {
                console.log(imageUrl);
                // load the image
                (function(url) {
                    var image = new Image();
                    image.crossOrigin = "anonymous"; // add this line
                    image.src = url;
                    image.onload = function() {
                        console.log('Image is loaded: ', image);
                        // 确定雪碧图的网格大小
                        let rows = 10;
                        let cols = 10;

                        // 确定每个小图片的大小
                        let width = image.width / cols; // 这里假设所有的小图片都有同样的宽度
                        let height = image.height / rows; // 这里假设所有的小图片都有同样的高度

                        // 创建一个临时的 canvas 元素来保存每个小图片
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        canvas.width = width;
                        canvas.height = height;

                        // 遍历雪碧图的每个网格
                        for(let r = 0; r < rows; r++) {
                            for(let c = 0; c < cols; c++) {
                                // 清除canvas内容
                                ctx.clearRect(0, 0, canvas.width, canvas.height);

                                // 计算当前小图片在雪碧图中的位置
                                let x = c * width;
                                let y = r * height;

                                // 将当前小图片从雪碧图中截取出来，并绘制到临时的 canvas 元素上
                                ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

                                // 从临时的 canvas 元素中获取小图片的 Data URL
                                let dataUrl = canvas.toDataURL('image/jpeg');

                                // 创建一个新的 div 元素，用于包含图片和时间戳
                                let div = document.createElement('div');
                                div.style.position = 'relative';
                                div.style.display = 'inline-block';

                                // 创建一个新的 img 元素并将其添加到 div 元素中
                                let img = document.createElement('img');
                                img.src = dataUrl;
                                img.style.width = '100%';
                                div.appendChild(img);

                                // 添加一个时间戳
                                let timestamp = document.createElement('p');
                                let hours = Math.floor(time[i] / 3600);
                                let minutes = Math.floor((time[i] % 3600) / 60);
                                let seconds = time[i] % 60;
                                timestamp.textContent = hours.toString().padStart(2, '0') + ':' +
                                    minutes.toString().padStart(2, '0') + ':' +
                                    seconds.toString().padStart(2, '0');
                                timestamp.style.position = 'absolute';
                                timestamp.style.bottom = '0px';
                                timestamp.style.right = '0px';
                                timestamp.style.transform = 'translate(-100%, -100%)';
                                timestamp.style.color = 'white';
                                timestamp.style.fontWeight = 'bold';
                                timestamp.style.fontSize = '10';

                                div.appendChild(timestamp);

                                // 将 div 添加到 box 中
                                box.appendChild(div);

                                // 每张图片的时间间隔为5秒
                                i ++;
                            }
                        }
                    };
                })(imageUrl);
            }
        }
    });



    // rest of the script...
})();
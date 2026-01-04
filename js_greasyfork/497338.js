// ==UserScript==
// @name         1688|阿里巴巴-图片批量采集
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  获取1688的主图和详情图片
// @author       无言
// @license MIT
// @match        https://detail.1688.com/offer/*
// @icon         data:image/x-icon;base64,AAABAAEAAAAAAAEAIAAiPgAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAEAAAABAAgGAAAAXHKoZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAACjRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2YmQ4YTkwMy04Mzc1LWIxNDgtODgxZS1hY2ZjNjlmMjAyM2IiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDE4NDU3MmYtM2E5ZS1mYjQ3LTlhMDgtMDE5MmVkNjYyNmU4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IkQ5NjhGRkU1NEZCODg2QUE0NEY0RDk0QTkyRTU5MTM4IiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMy0wMy0xMFQyMjoyODoyMiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDMtMTBUMjI6MzA6MzYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDMtMTBUMjI6MzA6MzYrMDg6MDAiIHRpZmY6SW1hZ2VXaWR0aD0iMTAyNCIgdGlmZjpJbWFnZUxlbmd0aD0iMTAyNCIgdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPSIyIiB0aWZmOlNhbXBsZXNQZXJQaXhlbD0iMyIgdGlmZjpYUmVzb2x1dGlvbj0iOTYvMSIgdGlmZjpZUmVzb2x1dGlvbj0iOTYvMSIgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIgZXhpZjpFeGlmVmVyc2lvbj0iMDIyMSIgZXhpZjpDb2xvclNwYWNlPSI2NTUzNSIgZXhpZjpQaXhlbFhEaW1lbnNpb249IjEwMjQiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxMDI0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDVkMzEzMWMtNWE4Yy05NTQyLTlmNTYtODRkMTQ3ZTVhMmYzIiBzdEV2dDp3aGVuPSIyMDIzLTAzLTEwVDIyOjI5OjU0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvanBlZyB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUyODczNmNlLTA1YTktZmU0ZS04NDFkLTYyNDRmNzFkMDdhNiIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0xMFQyMjoyOTo1NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MTg0NTcyZi0zYTllLWZiNDctOWEwOC0wMTkyZWQ2NjI2ZTgiIHN0RXZ0OndoZW49IjIwMjMtMDMtMTBUMjI6MzA6MzYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDVkMzEzMWMtNWE4Yy05NTQyLTlmNTYtODRkMTQ3ZTVhMmYzIiBzdFJlZjpkb2N1bWVudElEPSJEOTY4RkZFNTRGQjg4NkFBNDRGNEQ5NEE5MkU1OTEzOCIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJEOTY4RkZFNTRGQjg4NkFBNDRGNEQ5NEE5MkU1OTEzOCIvPiA8dGlmZjpCaXRzUGVyU2FtcGxlPiA8cmRmOlNlcT4gPHJkZjpsaT44PC9yZGY6bGk+IDxyZGY6bGk+ODwvcmRmOmxpPiA8cmRmOmxpPjg8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L3RpZmY6Qml0c1BlclNhbXBsZT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4YgkPT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
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/497338/1688%7C%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4-%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/497338/1688%7C%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4-%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==


(function () {
    window.setTimeout(()=>{
        main()
    }, 5000)
})();

function main(){
    console.log('莫知');
    var zhudivs = document.querySelectorAll('.detail-gallery-turn-wrapper');

    //建立一个空数组
    let imgsrclist = [];

    for (var i = 0; i < zhudivs.length; i++) {
        var div = zhudivs[i];
        var img = div.querySelector('img');
        //判断img是否存在
        if (img) {
            //判断是否是视频 是视频就继续下一个图片
            if (!img.classList.contains('video-icon')) {
                // 提取 img 标签的 src 属性
                var src = img.getAttribute('src');
                // console.log('图片网址:', src);
                imgsrclist.push(src)
            }
        }
    }
    // console.log(imgsrclist);

    let xiangimgsrclist=[];
    var xiangdivs = document.querySelectorAll('.content-detail div:nth-child(2) img');
    // console.log(xiangdivs);
    if (xiangdivs.length==0) {
        xiangdivs = document.querySelectorAll('.content-detail p img');
    }

    for (let i = 0; i < xiangdivs.length; i++) {
        var xiang=xiangdivs[i]
        var xiangimgsrc=xiang.getAttribute('data-lazyload-src')
        xiangimgsrclist.push(xiangimgsrc)
    }
    // console.log(xiangimgsrclist);



    // 创建按钮元素
    const button = document.createElement('button');

    // 设置按钮文本
    button.textContent = '下载主图';

    // 设置按钮样式
    button.style.position = 'fixed';
    button.style.bottom = '100px';
    button.style.right = '40px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.width = '100px';
    button.style.zIndex = '10001';


    // 添加点击事件监听器
    button.addEventListener('click', async function() {
        // 在控制台输出点击事件
        // console.log('点击了按钮！');


        const zip = new JSZip();
        const imgFolder = zip.folder("images1");
    
        for (let i = 0; i < imgsrclist.length; i++) {
            const url = imgsrclist[i];
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                imgFolder.file(`主图${i + 1}.jpg`, arrayBuffer);
            } catch (error) {
                console.error('下载出错：', error);
            }
        }
    
        zip.generateAsync({ type: "blob" }).then((content) => {
            const objectURL = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = `主图.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
            
        console.log('所有主图已下载完成！');
    });

    // 将按钮添加到 body 元素中
    document.body.appendChild(button);








     // 创建按钮元素
     const button1 = document.createElement('button');

     // 设置按钮文本
     button1.textContent = '下载详情';

     // 设置按钮样式
     button1.style.position = 'fixed';
     button1.style.bottom = '50px';
     button1.style.right = '40px';
     button1.style.padding = '10px';
     button1.style.backgroundColor = '#007bff';
     button1.style.color = '#fff';
     button1.style.border = 'none';
     button1.style.cursor = 'pointer';
     button1.style.width = '100px';
     button1.style.zIndex = '10001';



     // 添加点击事件监听器
     button1.addEventListener('click', async function() {
         // 在控制台输出点击事件
        //  console.log('点击了按钮！');

        const zip = new JSZip();
        const imgFolder = zip.folder("images2");
    
        for (let i = 0; i < xiangimgsrclist.length; i++) {
            const url = xiangimgsrclist[i];
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                imgFolder.file(`详情${i + 1}.jpg`, arrayBuffer);
            } catch (error) {
                console.error('下载出错：', error);
            }
        }
    
        zip.generateAsync({ type: "blob" }).then((content) => {
            const objectURL = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = `详情.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
         console.log('所有详情已下载完成！');
     });

     // 将按钮添加到 body 元素中
    document.body.appendChild(button1);



    // 创建按钮元素
    const button2 = document.createElement('button');

     // 设置按钮文本
    button2.textContent = '下载全部';

    // 设置按钮样式
    button2.style.position = 'fixed';
    button2.style.bottom = '5px';
    button2.style.right = '40px';
    button2.style.padding = '10px';
    button2.style.backgroundColor = '#007bff';
    button2.style.color = '#fff';
    button2.style.border = 'none';
    button2.style.cursor = 'pointer';
    button2.style.width = '100px';
    button2.style.zIndex = '10001';

     // 添加点击事件监听器
    button2.addEventListener('click', async function() {
        button1.click();
        button.click();
    });
    document.body.appendChild(button2);
}
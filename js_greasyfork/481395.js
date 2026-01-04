// ==UserScript==
// @name         1688-莫知
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  爬图片
// @author       莫知
// @license MIT
// @match        https://detail.1688.com/offer/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8dfAXwPPjS/uLi+1C00HwzpgW41TUbiQLHbKzNsjjBOZZX+YJEm5yEdtpVHIn8M+K4PCmrSx6TK1vp8YeSy86KMzPmVgMuVLBtv8AdKg4J2jO0er+BvhLovjC1Wz1yGaRd7PaqkpiPypumfPZgpj5HVVHHGTF4x/Y3m1ayY+GYtQaSzhkdo5YWkh/dguSJ1GwZG4gNjO1sEkV7dSSpS5IrVdf66HHTwtWpD2kdUdn+wz8btB0XVNM03xFHapcanehLTU5o1cwXRaaSIT8fOj9HJ+Y5J+8MP8AU37b3jXwr8BvA9na+JJoTqUjLNZ6Wo8y5J3LlU5Py7zt3k7QOOTwfy0W7uvD/wDolxEyzWl9DM8Eqj5HjLjaw+rdD29q9z8ZwroPjvUPEF9qWoeKPEly7Pb6hqzM62cCyYjVVbq67ApJwFZSMAgge1l+ZSVB07L1fRP8zxcVg1Kqpv7v62P0O/4Kp/8ABOPXPgB8FdE8YafZx2rWfmajP5Gzz5LhYVMcW1lJPCyEjgHCg5HFeO/s9/tD6HB8OF0nxj9n0G+gjd/t8ioun6tEwHy7VT91dYWVmSXJnwWGXOH/AF3/AOCtenTfF39iHRtaghVTfeRqEgBJhWKSwmbeuQG2kkAb1VumVB4r8MPE2nX+q634f0O3urezsrySK43yJGxs55LQLLcxyN8ytthDEKwDmOMENgColFV6H1mK9636nZhq88PX9g37t0eB/tlePr74g/FITarFpMcq2+xbmysvJ+1wOSYpX5JYmMggscjOOMYEUXxLHiSBrO8leSyW7kns5pIAsiPPJ5kiM+QWTezMDtAXPXHTnfjh4xufG3xOutUuLdorBJJbfT7Vx+7tbeKaWKKIeoXaM47k+tYFv4hl1K0kjumjZU6EIFKg9enH+e9ePGrKEm0dNa03r/wT/9k=
// @downloadURL https://update.greasyfork.org/scripts/481395/1688-%E8%8E%AB%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/481395/1688-%E8%8E%AB%E7%9F%A5.meta.js
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
    button.style.bottom = '200px';
    button.style.right = '40px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.width = '100px';


    // 添加点击事件监听器
    button.addEventListener('click', async function() {
        // 在控制台输出点击事件
        // console.log('点击了按钮！');


        // 创建一个包含下载任务的 Promise 数组
        const downloadTasks = imgsrclist.map((url, index) => {
            window.setTimeout( async ()=>{
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const objectURL = URL.createObjectURL(blob);

                    // 创建一个虚拟的下载链接
                    const link = document.createElement('a');
                    link.href = objectURL;

                    // 设置下载属性
                    link.download = `主图${index + 1}.jpg`;

                    // 将链接添加到文档中
                    document.body.appendChild(link);

                    // 模拟点击链接以触发下载
                    link.click();

                    // 删除链接
                    document.body.removeChild(link);
                } catch (error) {
                    console.error('下载出错：', error);
                }
            }, 200)
        });

        // 执行所有下载任务
        await Promise.all(downloadTasks);
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
     button1.style.bottom = '250px';
     button1.style.right = '40px';
     button1.style.padding = '10px';
     button1.style.backgroundColor = '#007bff';
     button1.style.color = '#fff';
     button1.style.border = 'none';
     button1.style.cursor = 'pointer';
     button1.style.width = '100px';


     // 添加点击事件监听器
     button1.addEventListener('click', async function() {
         // 在控制台输出点击事件
        //  console.log('点击了按钮！');

         // 创建一个文件夹名称
         // const folderName = 'D:/360安全浏览器下载/图片';

         // 创建一个包含下载任务的 Promise 数组
         const downloadTasks = xiangimgsrclist.map( (url, index) => {
            window.setTimeout(async ()=>{
                // button.click()
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const objectURL = URL.createObjectURL(blob);

                    // 创建一个虚拟的下载链接
                    const link = document.createElement('a');
                    link.href = objectURL;

                    // 设置下载属性
                    link.download = `详情${index + 1}.jpg`;

                    // 将链接添加到文档中
                    document.body.appendChild(link);

                    // 模拟点击链接以触发下载
                    link.click();

                    // 删除链接
                    document.body.removeChild(link);
                } catch (error) {
                    console.error('下载出错：', error);
                }
            }, 200)

         });

         // 执行所有下载任务
         await Promise.all(downloadTasks);
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
    button2.style.bottom = '150px';
    button2.style.right = '40px';
    button2.style.padding = '10px';
    button2.style.backgroundColor = '#007bff';
    button2.style.color = '#fff';
    button2.style.border = 'none';
    button2.style.cursor = 'pointer';
    button2.style.width = '100px';
     // 添加点击事件监听器
    button2.addEventListener('click', async function() {
        button1.click()
        window.setTimeout(()=>{
            button.click()
        }, (xiangimgsrclist.length+3)*200)
    });
    document.body.appendChild(button2);
}
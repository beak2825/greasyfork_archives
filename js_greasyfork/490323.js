// ==UserScript==
// @name         天锐绿盾魔法
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  天锐绿盾本地解密!
// @author       xiuyuan
// @match        *://*/*
// @noframes
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/490323/%E5%A4%A9%E9%94%90%E7%BB%BF%E7%9B%BE%E9%AD%94%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490323/%E5%A4%A9%E9%94%90%E7%BB%BF%E7%9B%BE%E9%AD%94%E6%B3%95.meta.js
// ==/UserScript==

function updateProgress(percentage) {
    return new Promise(resolve => {
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.width = `${percentage}%`;
        resolve();
    });
}

// 异步 延时 秒
function sleep1(time) {
    time*=1000
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

(function() {
    'use strict';
    function addCSS(styles) {
        var css = styles + '';
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    //添加css
    addCSS(`#progress-bar-container {
        width: 100%;
        background-color: #f3f3f3;
        border-radius: 5px;
        overflow: hidden;
        margin-top: 20px;
        display: none;
      }
      #progress-bar {
        height: 20px;
        width: 0;
        background-color: #1008f5;
        border-radius: 5px;
      }`);
    //添加进度条div
    var jindu = document.createElement('div');
    jindu.style.position = 'fixed';
    jindu.style.width = '200px';
    jindu.style.height = '30px';
    jindu.style.zIndex = '9999';
    jindu.style.right = '10px';
    jindu.style.bottom = '20px';
    jindu.innerHTML = `<div id="progress-bar-container">
    <div id="progress-bar"></div>`;

    // Create a new input element
	const input1 = document.createElement('input');
    input1.type='file';
    input1.style.display='none';

    const input2 = document.createElement('input');
    input2.type='file';
    input2.style.display='none';
    input2.multiple=true;//'directory webkitdirectory';
    input2.directory=true;
    input2.webkitdirectory=true;


    // Create a new button element
	const button = document.createElement('button');
	button.innerText = '魔法';
    const button2 = document.createElement('button');
	button2.innerText = '超级\n魔法';

	// Change the button style
	button.style.backgroundColor = 'black';
	button.style.color = 'white';
	button.style.position = 'fixed';
	button.style.bottom = '150px';
	button.style.right = '5px';
	button.style.zIndex = '9999';
    button.style.width ='60px';
    button.style.height = '30px';

    // Change the button2 style
	button2.style.backgroundColor = 'black';
	button2.style.color = 'white';
	button2.style.position = 'fixed';
	button2.style.bottom = '180px';
	button2.style.right = '5px';
	button2.style.zIndex = '9999';
    button2.style.width ='60px';
    button2.style.height = '50px';

	// Add the button to the page
	document.body.appendChild(input1);
    document.body.appendChild(button);
    document.body.appendChild(input2);
    document.body.appendChild(button2);
    document.body.appendChild(jindu);

    button.addEventListener('click', () => {input1.click();});
    button2.addEventListener('click', () => {input2.click();});

    input1.addEventListener('change', () => {
        var file = input1.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var renamedContent = file.name;
            console.log(renamedContent);
            var blob = new Blob([e.target.result], { type: file.type });
            var url = URL.createObjectURL(blob);

            var downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download =renamedContent;
            downloadLink.click();
        }

        reader.readAsArrayBuffer(file);
    });
    input2.addEventListener('change', async () => {
        const progress_s = document.getElementById('progress-bar-container');
        const progress_bar = document.getElementById('progress-bar');

        var files = input2.files;
        
        // 检查是否有文件被选中
        if(files.length==0){
            console.log("请选择文件");
            return;
        }
        var bo_set=-20;
        var move_flag=0;
        var download_flag=0;
        progress_s.style.display = 'block';
        var interid0=setInterval(() => {
            if(bo_set>=20){
                clearInterval(interid0);
                move_flag=1;
            }else{
                jindu.style.bottom = bo_set + 'px';
                bo_set+=5;
            }
        },20);
        await updateProgress(0);
        try{
            var zip = new JSZip();
            // jindu.style.display = 'block';
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                zip.file(file.webkitRelativePath, file); // 假设文件是Blob或ArrayBuffer类型
                await updateProgress((i + 1) / files.length * 100);
                // await sleep1(1);
            }

            //生成压缩文件
            progress_bar.style.background = 'green';
            zip.generateAsync({type: "blob"},metadata => {
                console.log(metadata.percent+'%');
                updateProgress(metadata.percent);
            })
            .then(async function(content) {
                // 创建下载链接
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.href = window.URL.createObjectURL(content);
                a.download = 'decfiles.zip';
                a.click();
                window.URL.revokeObjectURL(a.href);
                download_flag=1;
            });
        }catch(err){
            console.log(err);
            document.getElementById('progress-bar').style.background = 'red';
            download_flag=1;
        }
        setTimeout(() => {
            var interid1=setInterval(() => {
                if(move_flag==1 && download_flag==1){
                    if(bo_set<=-20){
                        progress_s.style.display = 'none';
                        clearInterval(interid1);
                    }else{
                        jindu.style.bottom = bo_set + 'px';
                        bo_set-=2;
                    }
                }
            },20);
        }, 1000);
    });
})();
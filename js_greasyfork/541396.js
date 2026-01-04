// ==UserScript==
// @name         B站個人主頁優化 (歸檔員自用)
// @namespace    http://yuhang0000.github.io/
// @version      v1.16_2025-9-12
// @description  Bili 個人主頁優化.
// @author       欲行肆灵
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        file:///*
// @grant        none
// @license      GPLv3
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACnklEQVRYR+2XX0hTURzHv9edXVuNNaFhm+CLiBXh8qXaUGRBD+YCX8oSwerm34cG+RKxMGlILxMEwYxuTVCazxV7S8Q0eskUscboIWOzWpDWck5n9rDuzXO3dbu4raA+cGHn+/ve8/vew93ZGfBXolIRNPd40P/kAzrcXmi0OqlFFo1Whw63F/2TYTT3eKBSEaklPZV1TRia3xQv58ikohAarQ7OkUlqjsq6JqkNAFKnystTUePSCis6B31wt9YgGvlM1aRotDp0DvpQWmGl9DQrwEgFAABRs7jiGUuaJDA9BXfbCUS/LFO6QLrmgekp3DxnQ3x9jdKRLgDw68lShVDq/8HPAETNwlbfBkvtWRSVHsSOndotvu2zuhJBMDCHp4/uY2z0lrAaiQAFhUW4PPAQxfsOUTdli4VXL9Dbbsen90EGRM2ia/RZzpoLLPhn0F1/hMB2ujXnzQGguMwM26kWAou9gSrMTvjAOzkshRcpfbvoDUZwLh7lVTWiZrE3MOBnYiBqVhQd1aaMNxfQG4zoGw+J4/hajFDNAWStOZA8N2HzU+5OuUQ+QHlVDTgXDwDgnRxmJ3wSB41CP4Oh+U1KaTpA74594yHoDUYAiSV0VJuouhQ5v6Sf/AoIk0k/p0OhXz5AlpEPsBReFJ9k+eM7STUZhX75AHevXQTn4vFtYwP3ulqk5SQU+uVfwkyj+CXMMv8DEMTX16jfA73BmLRnZ4rde/ZS49WVCMGb+ecoMR8VxQs37oB3cr/zFVJEQWERznffprRgYI7B8cZLaLzaRxVyxXCPgwFh8xNHsjKztJ5V3vpncb3+8B86lPpn0NtWmziUChA1i2Nn2mE92QhTyX7ka3ZtuWX7xKJfEXr9ElMPhvHYO5DqT8q/yXdT6gC1Lkc+ZAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/541396/B%E7%AB%99%E5%80%8B%E4%BA%BA%E4%B8%BB%E9%A0%81%E5%84%AA%E5%8C%96%20%28%E6%AD%B8%E6%AA%94%E5%93%A1%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541396/B%E7%AB%99%E5%80%8B%E4%BA%BA%E4%B8%BB%E9%A0%81%E5%84%AA%E5%8C%96%20%28%E6%AD%B8%E6%AA%94%E5%93%A1%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.debug_space = false;

    //这是延时
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 定义一个函数来检查和修改每个 .bili-album 元素 (北站又 TM 改界面，现在是检查 .bili-dyn-gallery 元素)
    function modifyAlbums() {
        const albums = document.querySelectorAll('.bili-dyn-gallery');

        albums.forEach(album => {
            if (album.querySelector('.bili-album__preview')) return; // 如果已经修改过，跳过
            fiximg(album,"bili-dyn-gallery");
        });

        //我恨以条动态放 18 张图

        const data_totals = document.querySelectorAll('div.bili-album__preview__picture.total-mask');
        data_totals.forEach(data_total => {
            let data_tota;
            data_tota = data_total.parentElement;
            let delDOM = data_tota;
            data_tota = data_tota.parentElement;
            delDOM.remove();
            delDOM = data_tota;
            data_tota = data_tota.lastChild;
            data_tota = data_tota.lastChild;
            data_tota = data_tota.querySelector('.bili-album__watch__track__slider');
            //data_tota = data_tota.firstChild;
            fiximg(data_tota,"18-img");
            delDOM = delDOM.querySelector('.bili-album__watch');
            delDOM.remove();
        });
    }


    function fiximg(album, style_div){

            // 新增代码块开始

            //图片组
            let imgPack = [];

            let imgclick = false;

            const newImgDiv = document.createElement('div');

            const divL = document.createElement('div');
            const divC = document.createElement('div');
            const divR = document.createElement('div');

            //图片左边
            divL.style.position = "absolute";
            divL.style.top = "0";
            divL.style.height = "100%";
            divL.style.cursor = "pointer";
            divL.style.left = "0";
            divL.style.width = "20%";
            //鼠标点击
            divL.addEventListener('click', function() {
                let divL1 = divL.parentElement;
                let firstChild = divL1.parentElement;
                divL1 = divL1.lastChild;
                divL.style.display = '';
                divR.style.display = '';
                if(firstChild.id != 0)
                {
                    divL1.src = imgPack[parseInt(firstChild.id) - 1];
                    firstChild.id = parseInt(firstChild.id) - 1;
                    if(firstChild.id == 0)
                    {
                        this.style.display = 'none';
                        this.style.cursor = 'zoom-out';
                    }
                }
                else
                {
                    imgclick = true;
                    this.style.cursor = 'zoom-out';
                    newImgDiv.style.display = 'none';
                }
            });
            //鼠标经过
            divL.addEventListener('mouseover', function() {
                let divL1 = divL.parentElement;
                let firstChild = divL1.parentElement;
                if(firstChild.id != 0)
                {
                 imgclick = false;
                 this.style.cursor = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAA8CAYAAAADm2gpAAAAAXNSR0IArs4c6QAAAsVJREFUaAXtmUur2kAUx5NYUXtFiwtx0UU30iLcRWlx4aa4E8W29wv0G/QLlO5vP0BpN1210G0X9YlQC4ILKYLQhctaaF0IPrjx/Uj/I02ITXI1cSZCyUBwPJnM+eU/J5k5GZ6zsRSLxbs8z7/dbDYPXS5Xb7VaXWYymXc2InBcLpdLAkTsdDrr+XwuDQYDqVqtXhUKhRcEhLeDhkBAgc/xePwsFAopLmezGQeYWTgcDgiKlVHFCIK483q9nNvtXnS73TtMQa6DICCLxYIcHqj18wYxsCj7ICRJ4prN5hjB+zqdTs+ZKHIIRKPRmIxGo68+n+8lEYJ6sB4KMRwOqx6P52kymVxRB7EKQRXkGAhqIMdCUAGhAXE0CC2Io0BoQlgGoQ1hCYQFhGkQVhCmQFhCHAzCGoKA7J30TEB8Uc8dpHMz5dpJzyTEhTyBmQGQ2xqC2AlBYHRB7IbQBTkFhAbkVBA7IKeEUEAOhBj/Xd4d9XQQp3qFL5fL95ACfvs3+ZEbk9U2FrpMIYgvAY7exGIxnzoDsxtiCwI1HkQiEd03LPKOYb/f/443JpPhkG94CyIIQm8ymahtSj0ajd5CAnSO8xnFyKgirNfrV61WS4QyGheBQIBLJBI3AfsRAf1Y04C2AZ8LPtRqNRFQCBltQUYmoc2YOQxc8w6M3vA6yuipQmyOMo4yRgoY2Z2Y+e+UyefzT4xuiordTMw4MFBrp8hLCEeZHVnwx1Fm37LTiRmjmMGe3iMqLzejTuB474K81+uR7OA36UP3Q41R52btBKZUKr33+/0XyI/OkB9puqhUKiSNOdee0TS1bkCWKKVSqWeiKH6q1+tjvSQOe78ubDBeWfdi4kr1MGEzUQmXdru9hGI10hXToVGzEhh8ArnE7/NgMLiYTqfCcrn8gSOdzWZ/2QYiQ+EpuY36fQB1sbvZxPBtk+4/aTj+WpXZtpcAAAAASUVORK5CYII=),pointer";
                }
                else
                {
                    imgclick = true;
                    this.style.cursor = 'zoom-out';
                }
                });
            //鼠标经出
            divL.addEventListener('mouseout', function() {
                 //this.style.cursor = 'default';
                 imgclick = true;
            });

            /*图片中间
            divC.style.position = "absolute";
            divC.style.top = "0";
            divC.style.height = "100%";
            divC.style.cursor = "pointer";
            divC.style.left = "20%";
            divC.style.width = "60%";
            divC.addEventListener('click', function() {
                 newImgDiv.style.display = 'none';
            });
            divC.addEventListener('mouseover', function() {
                 this.style.cursor = 'zoom-out';
            });
            divC.addEventListener('mouseout', function() {
                 //this.style.cursor = 'default';
            });
            */

            //图片右边
            divR.style.position = "absolute";
            divR.style.top = "0";
            divR.style.height = "100%";
            divR.style.cursor = "pointer";
            divR.style.left = "80%";
            divR.style.width = "20%";
            divR.addEventListener('click', function() {
                let divR1 = divR.parentElement;
                let firstChild = divR1.parentElement;
                divR1 = divR1.lastChild;
                divL.style.display = '';
                divR.style.display = '';
                if(firstChild.id != imgPack.length - 1)
                {
                    divR1.src = imgPack[parseInt(firstChild.id) + 1];
                    firstChild.id = parseInt(firstChild.id) + 1;
                    if(parseInt(firstChild.id) == imgPack.length - 1)
                    {
                        this.style.display = 'none';
                        this.style.cursor = 'zoom-out';
                    }
                }
                else
                {
                    imgclick = true;
                    this.style.cursor = 'zoom-out';
                    newImgDiv.style.display = 'none';
                }
            });
            divR.addEventListener('mouseover', function() {
                let divR1 = divR.parentElement;
                let firstChild = divR1.parentElement;
                if(parseInt(firstChild.id) != imgPack.length - 1)
                {
                    imgclick = false;
                    this.style.cursor = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAA8CAYAAAADm2gpAAAAAXNSR0IArs4c6QAAAhNJREFUaAXtmb9OwlAUxttLiYkV0plB4sgLODC5QRTiYqIbcXDyHXwMEyMMbg7GBfmzEBISIDHdGYU3KLQQEwp4LvHE5oJJIfTS4XQ5vdDe+/V3Ttp+PaoCW7PZ1BzHuY1Go2fz+bwfiUSKmUzmi/8na1Or1eoBY8w0DOMkkUjo4/HY7ff737PZrJDL5d5lCVFAyINpms7Csw2Hw0W9Xh+Xy+UrWUIYpOEimUzq3gXj8biSTqcPIVUvssQwVVWt6XTq1bHcj8ViUsUwEPHY6/UcqIm9i1FqtdpTq9VyXNf1VMrf7mg0klMzsKQKxVkiMWJREBmRCI6JDJIQI5ERieA4dGTgDlwMzU2PxGCdeCOvGSLjJYL7RAZJiJHIiERwTGSQhBg3JHPOz1fFSXY15mLghfxZ1/UbMGs6GLmVqS3LUrrdrgWG7pit/LujH8C4LbLZ7B146dd2uz1c55vAbyvcyNm2fRqYEH49XIzf69L8HrjNcfx5BKm5htQc/ZcaoKFAaj63md/XOb8PRduHe1wWq69JNz1oAxHBffYgEZg2IkEkkABGqgkigQQwUk0QCSSAkWqCSCABjGGpCd4m8fOiG9w7ZqVSuWw0GvsVAWlhmqbdp1Kptb6De45OpzOBLlchn8+/YRqDiLynZ0ATcWVumSL44gwM0MdgMJh4lcgWwdcOTQN6+VlCaMl/gU8tyW7J/wCJLeOSU2dAQgAAAABJRU5ErkJggg==),pointer";
                }
                else
                {
                    imgclick = true;
                    this.style.cursor = 'zoom-out';
                }
                });
            divR.addEventListener('mouseout', function() {
                 //this.style.cursor = 'default';
                 imgclick = true;
            });

            newImgDiv.className = 'bili-album__preview__picture__img b-img';
            newImgDiv.style.display = 'none';
            newImgDiv.style.marginBottom = '4px';

            //点击介个大图时
            newImgDiv.addEventListener('click', function() {
                if(imgclick == true){
                    newImgDiv.style.display = 'none';
                }
            });
            newImgDiv.addEventListener('mouseover', function() {
                 this.style.cursor = 'zoom-out';
            });

            const newPicture = document.createElement('picture');
            newPicture.className = 'b-img__inner';

            const newImg = document.createElement('img');
            newImg.src = 'none';
            newImg.loading = 'lazy';
            newImg.style.objectFit = 'cover';

            newPicture.appendChild(divL);
            //newPicture.appendChild(divC);
            newPicture.appendChild(divR);
            newPicture.appendChild(newImg);
            newImgDiv.appendChild(newPicture);
            let parent = album.parentElement;
            parent.appendChild(newImgDiv);

            // 将新增的元素置于最顶层
            if (style_div == "18-img"){
                parent = parent.parentElement;
                parent = parent.parentElement;
                parent.prepend(newImgDiv);
            }
            else{
                parent.prepend(newImgDiv);
            }

            // 新增代码块结束

            function imgclickink()
            {
                imgclick = true;
            }

            //先判断 div 类型再枚举 img
            let images;
            if (style_div == "18-img"){
                images = album.querySelectorAll('.bili-album__watch__track__item');
            }
            else{
                images = album.querySelectorAll('.b-img__inner');
            }

            //console.log(images)
            if (images.length == 3) {
                createPreviewLayout(album, images, 3, style_div);
            }
            else if (images.length <= 4) {
                createPreviewLayout(album, images, 2, style_div);
            }
            else {
                createPreviewLayout(album, images, 3, style_div);
            }

        // 创建预览布局的函数
        function createPreviewLayout(parent, images, gridType, style_div) {
        if(runtimes == 0 && window.debug_space == true)
        {
            console.log("===========================================================================");
        }
        runtimes = runtimes + 1
        if(window.debug_space == true){ console.log("No." + runtimes + "  Style: " + style_div); }
        const previewWrapper = document.createElement('div');
        previewWrapper.className = `bili-album__preview grid${gridType}`;

        //let imgPack = [];

        for (let i = 0; i < images.length; i++) {
            const pictureDiv = document.createElement('div');
            pictureDiv.className = 'bili-album__preview__picture';

            const imgDiv = document.createElement('div');
            imgDiv.className = 'bili-album__preview__picture__img b-img';
            imgDiv.appendChild(images[i]);

            let parent2 = images[i].lastChild;
            let imgraw;
            if (parent2.src.indexOf('@') !== -1) {
                imgraw = parent2.src.substring(0, parent2.src.indexOf('@'));
            }
            else
            {
                imgraw = parent2.src
            }
            imgPack.push(imgraw);
            if(window.debug_space == true){ console.log("第 " + i + " 张图片: " + imgPack[i]); }

            //图片点击放大事件
            function zoomimg(here){

                let parent = here.parentElement;
                parent = parent.parentElement;
                parent = parent.parentElement;
                parent = parent.parentElement;
                if (style_div == "bili-dyn-gallery")
                {
                    parent = parent.parentElement;
                }
                var firstChild = parent.firstChild;
                firstChild.style.display = '';
                firstChild.id = i;
                firstChild = firstChild.firstChild;
                //let divL = firstChild.firstChild;
                //let divR = firstChild.children[1];
                firstChild = firstChild.lastChild;
                let zoomimg;
                if (parent2.src.indexOf('@') !== -1) {
                    zoomimg = parent2.src.substring(0, parent2.src.indexOf('@'));
                }
                else
                {
                    zoomimg = parent2.src
                }
                firstChild.src = zoomimg;

                //判断是否显示 divL & divR

                if(i == 0)
                {
                    divL.style.display = 'none';
                    divR.style.display = '';
                }
                else if(i == imgPack.length - 1)
                {
                    divL.style.display = '';
                    divR.style.display = 'none';
                }
                else
                {
                    divL.style.display = '';
                    divR.style.display = '';
                }

                imgclickink();

            }

            // 添加点击事件监听器
            if (style_div == "18-img"){
                let fuckU = document.createElement('div');
                fuckU.className = "b-img__inner";
                images[i].parentElement.appendChild(fuckU);
                fuckU.appendChild(images[i].firstChild);
                fuckU.addEventListener('click',function(){zoomimg(this)});
                images[i].remove();
            }
            else{
                images[i].addEventListener('click',function(){zoomimg(this)});
            }

            pictureDiv.appendChild(imgDiv);
            previewWrapper.appendChild(pictureDiv);
        }

        parent.innerHTML = ''; // 清空原有内容
        if (style_div == "18-img"){
            let moveDOM = parent.parentElement;
            moveDOM = moveDOM.parentElement;
            moveDOM = moveDOM.parentElement;
            moveDOM = moveDOM.parentElement;
            moveDOM = moveDOM.firstChild;
            moveDOM.appendChild(previewWrapper);
        }
        else{
            parent.appendChild(previewWrapper);
        }
        if(window.debug_space == true){ console.log("总计 " + imgPack.length + " 张图片"); }
        if(window.debug_space == true){ console.log("==========================================================================="); }
        //return imgPack;
    }

    }

    // 初始化检查
    var runtimes = 0; //统计次数
    let outputpageitemnum = 0; //也是统计次数
    let outputpagenowtime = null; //该页面创建的时间
    let hide_new_space_entry_status = false //隐藏 '体验新版' btn
    let output_page_div; //info 界面父节点
    let topbarsize = 20; //默认顶栏尺寸
    if(window.location.href.split('/')[2] != 't.bilibili.com'){ //在動態首頁上禁用
        addoutputpage();
    }
    //modifyAlbums();

    //去除 @ 后面的
    function delat(text){
        if(text.indexOf('@') != -1){
            return text.substring(0,text.indexOf('@'));
        }
        else{
            return text;
        }
    }

    //添加 Outut_page
    async function addoutputpage(){
        output_page_div = document.createElement('div');
        output_page_div.innerHTML = `<div class="output_page_background close" style="
    position: fixed;
    top: 0;
    left: 0;
    animation-fill-mode: forwards;
    width: 100vw;
    height: 100vh;
    background-color: #00000044;
    display: flex;
    z-index: 99999;
	animation-fill-mode: forwards;">
	<div class="output_page" style="
	    position: fixed;
	    width: 80vw;
	    height: 80vh;
	    background-color: white;
	    display: block;
	    top: 10vh;
	    left: 10vw;
	    border-radius: 8px;
	    box-shadow: 0 0 24px 0px #00000055;">
	    <style>
	     .output_page_btn:hover {
	         background-color: var(--brand_blue_hover);
	     }
	     .output_page_btn.hover {
	         background-color: var(--brand_blue_hover);
	     }
	     .output_page_btn.ok:hover {
	         background-color: var(--Gr4);
	     }
	     .output_page_btn.ok {
	         background-color: var(--success_green);
	     }
	     .output_page_btn{
	         background-color: var(--brand_blue);
             user-select: none;
	     }
	     .output_page_btn_esc:hover {
	         background-color: var(--stress_red_hover);
	     }
	     .output_page_btn_esc{
	         background-color: var(--stress_red);
	     }
	     .output_page_text:hover {
	         border-color: #aaaaaaaa;
	     }
	     .output_page_text{
	         border-color: #aaaaaa33;
	     }
	     .output_page_background.close{
	         animation: output_page_close 0.5s;
	     }
	     .output_page_background{
	         animation: output_page_open 0.5s;
	     }
         .output_page_title::-webkit-scrollbar{
             display: none;
         }

	     @keyframes output_page_close{
	         0% {opacity: 1; display: block;}
	         100% {opacity: 0; display: none;}
	     }
	     @keyframes output_page_open{
	         100% {opacity: 1; display: block;}
	         0% {opacity: 0; display: block;}
	     }
	    </style>
	    <div style="
	    display: flex;
	    flex-direction: column;
	    height: 100%;">
	    	<div style="
	    	display: flex;
	    	flex-direction: row;
	    	align-items: center;
	    	flex-shrink: 0;
            margin: 2px 0px;">
                <div style="flex: 1;
                margin: 0px;
                padding: 24px 12px 24px 24px;
                container-type: inline-size;
                overflow: hidden;
                box-shadow: inset 0px 0px 12px 0px #fff;
                border-radius: 8px;">
                    <span class="output_page_title" style="
                    /*overflow: scroll;
	    		    text-overflow:ellipsis;
	    		    white-space:nowrap;*/
                    line-height: 1;
	    		    /*margin: 18px;
	    		    padding: 6px;*/
                    display: flex;
	    		    font-size: 1.45em;
                    width: 100%;
                    height: 20px;
                    transition: font-size 0.5s;
                    align-items: center;">Title</span>
                    <span class="output_page_title_hidden" style="
                    overflow: scroll;
                    line-height: 1;
                    display: block;
	    		    font-size: 1.45em;
                    width: 100%;
                    max-height: 20px;
                    position: absolute;
                    top: -100vh;">Title</span>
                </div>
	    		<div style="
                user-select: none;
	    		margin-right: 24px;">
	    			<div style="
                    position: relative;
                    overflow: hidden;
                    display: inline-flex;" title="拖拽以复制封面.">
                        <button class="output_page_btn output_page_btn_cover" style="
                        font-size: 1em;
                        color: white;
                        padding: 6px 16px;
                        border-style: none;
                        border-radius: 4px;
                        transition: background-color 0.5s;
                        ">封面</button>
                        <img class="output_page_btn_cover" src="none" style="
                        opacity: 0;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        inset: 0;
                        pointer-events: stroke;">
                    </div>
	    			<button class="output_page_btn output_page_btn_copy" style="
	    			margin-left: 12px;
	    			font-size: 1em;
	    			color: white;
	    			padding: 6px 16px;
	    			border-style: none;
	    			border-radius: 4px;
	    			transition: background-color 0.5s;">复制</button>
	    			<button class="output_page_btn output_page_btn_esc" style="
	    			margin-left: 12px;
	    			font-size: 1em;
	    			color: white;
	    			padding: 6px 16px;
	    			border-style: none;
	    			border-radius: 4px;
	    			transition: background-color 0.5s;">关闭</button>
	    		</div>
	    	</div>
	    	<div style="
	    	display: block;
	    	padding: 0 24px 24px 24px;
	    	width: 100%;
	    	height: 100%;
	    	flex-grow: 1;
	    	box-sizing: border-box;">
	    		<textarea class="output_page_text" style="
	    		height: 100%;
	    		width: 100%;
	    		display: block;
	    		background-color: #aaaaaa22;
	    		border-radius: 4px;
	    		border-style: double;
	    		font-size: 1em;
	    		font-family: monospace;
	    		padding: 4px;
	    		vertical-align: baseline;
	    		box-sizing: border-box;
	    		resize: none;
	    		line-height: 1.2em;
	    		transition: border-color 0.5s;" readonly></textarea>
	    	</div>
		</div>
	</div>
</div>`;
        output_page_div.style.visibility = 'hidden';
        document.body.appendChild(output_page_div);

        //那个封面 btn 还要单独做动画
        let output_page_btn_cover = output_page_div.querySelector('button.output_page_btn_cover');
        output_page_btn_cover.parentNode.addEventListener('mouseover', () => {
            output_page_btn_cover.classList.add('hover');
        });
        output_page_btn_cover.parentNode.addEventListener('mouseout', () => {
            output_page_btn_cover.classList.remove('hover');
        });

        //还是那个封面按钮
        output_page_btn_cover.parentNode.addEventListener('click', () => {
            let link = output_page_btn_cover.getAttribute('href');
            if(link != null){
                window.open(link, "_blank");
            }
        });

        //复制到剪切板
        let output_page_btn_copy = output_page_div.querySelector('button.output_page_btn_copy');
        let output_page_text = output_page_div.querySelector('.output_page_text');
        output_page_btn_copy.addEventListener('click', () => {
            if(output_page_text.value != null){
                let pos = [output_page_text.selectionStart,output_page_text.selectionEnd];
                output_page_text.select();
                document.execCommand('copy');
                output_page_text.setSelectionRange(pos[0], pos[1]);
                //output_page_text.blur();
                output_page_btn_copy.classList.add('ok');
                output_page_btn_copy.innerText = '完成';
            }
        });

        //关闭事件
        let output_page_btn_esc = output_page_div.querySelector('.output_page_btn_esc');
        let output_page_background = output_page_div.querySelector('.output_page_background');
        output_page_btn_esc.addEventListener('click', function(e){ closeoutputpage(e); } );
        output_page_background.addEventListener('click', function(e){ closeoutputpage(e); } );
        function closeoutputpage(e) {
            if(e.target == output_page_background || e.target == output_page_btn_esc){
                output_page_background.classList.add('close');
                output_page_btn_copy.classList.remove('ok');
                output_page_btn_copy.innerText = '复制';
            }
        }

        //await delay(2000);
        //output_page_div.style.visibility = 'visible';
    }

    async function addoutputpageitem(){
        //获取该页面创建时间
        if(window.location.href.indexOf('file://') != -1 && outputpagenowtime == null){
            let localinfo = document.querySelector('meta[id="localinfo"]');
            if(localinfo != -1){
                outputpagenowtime = new Date(localinfo.getAttribute('localdate'));
                console.log(outputpagenowtime);
            }
            else{
                outputpagenowtime = new Date();
                return;
            }
        }
        else if(outputpagenowtime == null){
            outputpagenowtime = new Date();
        }

        let items = document.querySelectorAll('.bili-dyn-list__item');
        let num = outputpageitemnum;
        let length = items.length; //真怕哪天会抽风
        for(let num1 = num; num1 < length; num1++){ //遍历循环每个动态
            let item = items[num1];
            let dyn_time = item.querySelector('.bili-dyn-time');
            if(dyn_time.innerText.indexOf('视频') == -1){
                continue;
            }

            let title = item.querySelector('.bili-dyn-card-video__title').innerText; //标题
            let intro = item.querySelector('.bili-dyn-card-video__desc'); //简介
            if(intro == null){
                intro = '-';
            }
            else{
                intro = intro.innerText;
            }
            let cover = delat(item.querySelector('.b-img__inner').querySelector('img').src); //封面
            let bvid = item.querySelector('a.bili-dyn-card-video').href.split('/'); //BV号
            bvid = bvid[bvid.length - 2];
            let aid = bv2av(bvid);
            let time = item.querySelector('.bili-dyn-time').innerText; //日期
            let duration = gettime(item.querySelector('.duration-time').innerText); //时长
            let playnum = item.querySelector('.bili-dyn-card-video__stat__item').innerText; //简写播放量
            let playnumfull = numstr2int(item.querySelector('.bili-dyn-card-video__stat__item').innerText); //播放量
            let danmaku = numstr2int(item.querySelector('.bili-dyn-card-video__stat__item.danmaku').innerText); //弹幕
            let comment = numstr2int(item.querySelector('.bili-dyn-action.comment').innerText); //评论
            let like = numstr2int(item.querySelector('.bili-dyn-action.like').innerText); //点赞
            let share = numstr2int(item.querySelector('.bili-dyn-action.forward').innerText); //转发
            let useruid = document.URL.split('/')[3]; //用户UID
            let username = document.querySelector('span[id="h-name"]').innerText; //用户ID
            let usericon = delat(document.querySelector('div.h-user').querySelector('img.bili-avatar-face').src); //用户头像

            if(window.debug_space == true){
                console.log('[' + bvid + '|AV' + aid + '] ' + title + '\n' + cover + '\n' + intro + '\n[' + gettime(time) + ']\t' + time + '\t 时长: ' + duration + '\n播放量: ' + playnumfull + '\t弹幕: ' +
                            danmaku + '\t评论: ' + comment + '\t点赞: ' + like + '\t转发: ' + share);
            }

            let morebtn_dom = item.querySelector('div.tp.bili-dyn-more__btn'); //选单父控件
            morebtn_dom.addEventListener('mousemove', () => {
                if(morebtn_dom.getAttribute('fixed') != 'true'){
                    morebtn_dom.setAttribute('fixed', 'true')
                    let options_dom = item.querySelector('div.bili-cascader-options'); //选单
                    createinfobtn(options_dom, [title, intro, cover, bvid, aid, time.substring(0,time.indexOf(' ')), duration, playnum, playnumfull, danmaku, comment, like, share, useruid, username, usericon]);
                }
            });
        }
        outputpageitemnum = length;
    }

    //获取时间戳的
    function gettime(time){
        let output;
        // HH:MM:SS 转 秒
        if(time.indexOf(':') != -1){
            let hhssmm = time.split(':');
            switch (hhssmm.length){
                case 2:
                    output = (Number(hhssmm[0]) * 60) + Number(hhssmm[1]);
                    break;
                case 3:
                    output = (Number(hhssmm[0]) * 3600) + (Number(hhssmm[1]) * 60) + Number(hhssmm[2]);
                    break;
            }
            return output;
        }

        // 日期转毫秒
        let now = outputpagenowtime;
        if(time.indexOf("刚刚") != -1){
            time = now.valueOf()
        }
        else if(time.indexOf("秒") != -1){
            time = now.valueOf() - (time.substring(0,time.indexOf("秒")) * 1000);
        }
        else if(time.indexOf("分钟") != -1){
            time = now.valueOf() - (time.substring(0,time.indexOf("分钟")) * 60 * 1000);
        }
        else if(time.indexOf("小时") != -1){
            time = now.valueOf() - (time.substring(0,time.indexOf("小时")) * 60 * 60 * 1000);
        }
        else if(time.indexOf("天") != -1){
            if(time.indexOf("昨天") != -1){
                time = now.valueOf() - now.getHours() * 60 * 60 * 1000;
            }
            else if(time.indexOf("前天") != -1){
                time = now.valueOf() - (now.getHours() * 60 * 60 * 1000) + 86400000;
            }
            else{
                time = now.valueOf() - (now.getHours() * 60 * 60 * 1000) + time.substring(0,time.indexOf("天")) * 86400000;
            }
        }
        else{
            time = time.replace(/\//g, "-");
            time = time.replace(/年/g, "-");
            time = time.replace(/月/g, "-");
            //time = time.replace(/日/g, "");
            if(time.indexOf("日") != -1){
                time = time.substring(0,time.indexOf("日"))
            }
            if((time.split("-").length - 1) == 1){
                time = now.getFullYear() + "-" +time;
            }
            let temptime = new Date(time);
            time = temptime.valueOf();
        }
        return time;
    }

    // 万 > 整数
    function numstr2int(text){
        let num;
        if(text.indexOf('万') != -1){
            text = text.substring(0,text.length - 1);
            num = parseFloat(text) * 10000
            /*if(text.indexOf('.') != -1){
                text = text.split('.');
                num = (Number(text[0]) * 10000) + (Number(text[1]) * 1000);
            }
            else{
                num = Number(text) * 10000
            }*/
            return num;
        }
        else if(text.indexOf('亿') != -1){
            text = text.substring(0,text.length - 1);
            num = parseFloat(text) * 100000000
            /*if(text.indexOf('.') != -1){
                text = text.split('.');
                num = (Number(text[0]) * 100000000) + (Number(text[1]) * 10000000);
            }
            else{
                num = Number(text) * 100000000
            }*/
            return num;
        }
        else{
            return text;
        }
    }

    //不喜欢 new-space-entry
    function hide_new_space_entry(){
        if(hide_new_space_entry_status == true){
            return;
        }
        let a = document.querySelector('.new-space-entry');
        if(a != null){
            a.remove();
            hide_new_space_entry_status = true;
        }
    }

    //创建 info 选单
    function createinfobtn(dom,data){
        //data: 标题, 简介, 封面, BVID, AVID, 日期, 时长, 简写播放量, 播放量, 弹幕, 评论, 点赞, 转发, UID, 昵称, 头像
        let item_div = document.createElement('div');
        item_div.innerHTML = `<div class="bili-cascader-options__item"><div class="bili-cascader-options__item-custom"><div><div class="bili-cascader-options__item-label">信息</div></div></div></div>`

        //点击事件
        item_div.addEventListener("click", () => {
            if(output_page_div == null){
                output_page_div = document.querySelector('.output_page_background').parentNode;
            }

            let output_page = output_page_div.querySelector('.output_page_background');
            let page_title = output_page.querySelector('.output_page_title');
            page_title.innerText = data[0]; //标题
            page_title.title = data[0];
            output_page_div.querySelector('.output_page_title_hidden').innerText = data[0];
            fixfontsize(output_page_div.querySelector('.output_page_title_hidden'), output_page_div.querySelector('.output_page_title'), topbarsize);

            let output_page_btn_cover_img = output_page_div.querySelector('img.output_page_btn_cover');
            let output_page_btn_cover_btn = output_page_div.querySelector('button.output_page_btn_cover');
            output_page_btn_cover_img.src = data[2]; //封面
            output_page_btn_cover_btn.setAttribute('href', data[2]);
            let output_text = `{
                "id": ${data[4]},
                "type": 2,
                "title": "${data[0]}",
                "cover": "${data[2]}",
                "intro": "${data[1]}",
                "page": -1,
                "duration": ${data[6]},
                "upper": {
                    "mid": ${data[13]},
                    "name": "${data[14]}",
                    "face": "${data[15]}"
                },
                "attr": 0,
                "cnt_info": {
                    "collect": -1,
                    "play": ${data[8]},
                    "danmaku": ${data[9]},
                    "vt": 0,
                    "play_switch": 0,
                    "reply": ${data[10]},
                    "like": ${data[11]},
                    "share": ${data[12]},
                    "view_text_1": "${data[7]}"
                },
                "link": "bilibili://video/${data[4]}",
                "ctime": ${gettime(data[5])},
                "pubtime": ${gettime(data[5])},
                "fav_time": -1,
                "bv_id": "${data[3]}",
                "bvid": "${data[3]}",
                "season": null,
                "ogv": null,
                "ugc": {
                    "first_cid": -1
                },
                "media_list_link": ""
            },`;
            let output_page_text = output_page.querySelector('.output_page_text');
            output_page_text.value = ''; //取消选择, 曲线救国 2333
            output_page_text.setSelectionRange(0,0)

            output_page_text.value = output_text;

            output_page_div.style.visibility = 'visible';
            output_page.classList.remove('close');
        });

        dom.appendChild(item_div);
    }

    //重复运行
    (async function autorun() {
        await modifyAlbums();
        if(window.location.href.split('/')[2] != 't.bilibili.com'){ //在動態首頁上禁用
            await addoutputpageitem();
        }
        await hide_new_space_entry(); //隐藏 "体验新版" btn
        setTimeout(autorun, 1000);
    })();

    //BV转AV
    function bv2av(bvid){
        if(bvid == null || bvid.length < 10 || bvid.length == 11 || bvid.length > 12){
            //console.log('无效的BVID');
            return null;
        }
        else if(bvid.length == 12){
            bvid = bvid.substring(2);
        }
        //let temp = new Array(10); //存储十个数
        /*let temp = bvid[2];
        bvid[2] = bvid[8];
        bvid[8] = temp;
        temp = bvid[3];
        bvid[3] = bvid[6];
        bvid[6] = temp;
        temp = 0n;*/
        let temp = 0n;
        let bv = [bvid[7],bvid[5],bvid[3],bvid[4],bvid[2],bvid[6],bvid[1],bvid[8],bvid[9]];
        //console.log(bv);

        /*for(let t = 0 ; t < 10 ; t++){
            //temp[t] = (bvdictionary[bvid[t]] * (58 ** bv58pow[t]) );
            temp = temp + BigInt(BigInt(bvdictionary[bvid[t]]) * BigInt(58n ** BigInt(bv58pow[t])) );
            //console.log(temp[t]);
        }
        //console.log(temp);
        temp = temp - 100618342136696320n;*/
        /*temp = BigInt(bvdictionary[bvid[1]]) * 58n ** 2n + BigInt(bvdictionary[bvid[2]]) * 58n ** 4n + BigInt(bvdictionary[bvid[4]]) * 58n ** 5n + BigInt(bvdictionary[bvid[6]]) * 58n ** 3n +
            BigInt(bvdictionary[bvid[8]]) * 58n + BigInt(bvdictionary[bvid[9]]);
        temp = temp - 8728348608n;*/
        for(let t of bv){
            temp = temp * 58n + BigInt(57 - bvdictionary[t]);
        }

        //二进制转换
        //console.log(temp);
        /*let temp2 = temp;
        temp = '';
        while (temp2 != 0){
            temp2 = temp2 / 2;
            if(String(temp2).indexOf('.') != -1){
                temp = temp + '1';
                temp2 = parseInt(temp2);
            }
            else{
                temp = temp + '0';
            }
        }*/
        temp = temp.toString(2);
        //let xor = '1010100100111011001100100100';
        //let xor = 177451812n.toString(2);
        //按位与运算
        let xor = (2n ** 51n - 1n).toString(2);
        if(xor.length < temp.length){ //长度不够就补零
            while(xor.length < temp.length){
                xor = '0' + xor;
            }
        }
        else if(xor.length > temp.length){ //长度不够就补零
            while(xor.length > temp.length){
                temp = '0' + temp;
            }
        }
        //console.log(temp);
        //console.log(xor);
        let temp2 = '';
        for(let tt = 0 ; tt < temp.length ; tt++){
            switch ( Number(xor[tt]) + Number(temp[tt]) ){
                case 2:
                    temp2 = temp2 + 1;
                    break;
                default:
                    temp2 = temp2 + 0;
                    break;
            }
        }

        //异或运算
        temp = temp2;
        xor = 23442827791579n.toString(2);
        if(xor.length < temp.length){ //长度不够就补零
            while(xor.length < temp.length){
                xor = '0' + xor;
            }
        }
        //console.log(temp);
        //console.log(xor);
        temp2 = '';
        for(let tt = 0 ; tt < temp.length ; tt++){
            switch ( Number(xor[tt]) + Number(temp[tt]) ){
                case 2:
                    temp2 = temp2 + 0;
                    break;
                case 1:
                    temp2 = temp2 + 1;
                    break;
                case 0:
                    temp2 = temp2 + 0;
                    break;
            }
        }
        //console.log(temp2);
        //console.log(parseInt(temp2,2));
        return parseInt(temp2,2);
    }

    //字典
    let bvdictionary = {
        '1':13,'2':12,'3':46,'4':31,'5':43,'6':18,'7':40,'8':28,'9':5,'A':54,'B':20,'C':15,'D':8,'E':39,'F':57,'G':45,'H':36,'J':38,'K':51,
        'L':42,'M':49,'N':52,'P':53,'Q':7,'R':4,'S':9,'T':50,'U':10,'V':44,'W':34,'X':6,'Y':25,'Z':1,'a':26,'b':29,'c':56,'d':3,'e':24,'f':0,
        'g':47,'h':27,'i':22,'j':41,'k':16,'m':11,'n':37,'o':2,'p':35,'q':21,'r':17,'s':33,'t':30,'u':48,'v':23,'w':55,'x':32,'y':14,'z':19
    };
    let bv58pow = [6,2,4,8,5,9,3,7,1,0];
    /*let bvdictionary = {
        '1':'31', '2':'12', '3':'46', '4':'31', '5':'43', '6':'18', '7':'40', '8':'28', '9':'5', 'A':'54', 'B':'20', 'C':'15', 'D':'8', 'E':'39', 'F':'57', 'G':'45', 'H':'36', 'J':'38', 'K':'51',
        'L':'42', 'M':'49', 'N':'52', 'P':'53', 'Q':'7', 'R':'4', 'S':'9', 'T':'50', 'U':'10', 'V':'44', 'W':'34', 'X':'6', 'Y':'25', 'Z':'1', 'a':'26', 'b':'29', 'c':'56', 'd':'3', 'e':'24', 'f':'0',
        'g':'47', 'h':'27', 'i':'22', 'j':'41', 'k':'16', 'm':'11', 'n':'37', 'o':'2', 'p':'35', 'q':'21', 'r':'17', 's':'33', 't':'30', 'u':'48', 'v':'23', 'w':'55', 'x':'32', 'y':'14', 'z':'19'
    };*/

    //AV转BV
    function av2bv(aid){
        if(aid == null){
            return null;
        }
        if(isNaN(aid) == true && aid.toLowerCase().indexOf('av') != -1){
            aid = aid.substring(2);
        }
        if(isNaN(aid) == true){
            return null;
        }
        let bvid = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0'];

        //按位或运算
        let temp = BigInt(aid).toString(2);
        let xor = (2n ** 51n).toString(2);
        if(xor.length < temp.length){ //长度不够就补零
            while(xor.length < temp.length){
                xor = '0' + xor;
            }
        }
        else if(xor.length > temp.length){ //长度不够就补零
            while(xor.length > temp.length){
                temp = '0' + temp;
            }
        }
        //console.log(temp);
        //console.log(xor);
        let temp2 = '';
        for(let tt = 0 ; tt < temp.length ; tt++){
            switch ( Number(xor[tt]) + Number(temp[tt]) ){
                case 0:
                    temp2 = temp2 + 0;
                    break;
                default:
                    temp2 = temp2 + 1;
                    break;
            }
        }

        //异或运算
        temp = temp2;
        xor = 23442827791579n.toString(2);
        if(xor.length < temp.length){ //长度不够就补零
            while(xor.length < temp.length){
                xor = '0' + xor;
            }
        }
        else if(xor.length > temp.length){ //长度不够就补零
            while(xor.length > temp.length){
                temp = '0' + temp;
            }
        }
        //console.log(temp);
        //console.log(xor);
        temp2 = '';
        for(let tt = 0 ; tt < temp.length ; tt++){
            switch ( Number(xor[tt]) + Number(temp[tt]) ){
                case 2:
                    temp2 = temp2 + 0;
                    break;
                case 1:
                    temp2 = temp2 + 1;
                    break;
                case 0:
                    temp2 = temp2 + 0;
                    break;
            }
        }
        temp = BigInt('0b' + temp2);
        //console.log(temp2);
        //console.log(temp);
        temp2 = ''; //暂存 base58 字符
        let temp3 = 0n;

        //以值求键
        let keymap = Object.keys(bvdictionary)
        function readkey(value){
            let key = null;
            for(let keys of keymap){
                if(bvdictionary[keys] === value){
                    key = keys;
                    break;
                }
            }
            return key;
        }

        while(temp > 0){
            temp3 = temp - 58n * (temp / 58n); //求余数
            temp = temp / 58n;
            temp2 = readkey(57 - parseInt(temp3)) + temp2;
        }

        //console.log(temp2);

        bvid[3] = temp2[6];
        bvid[4] = temp2[4];
        bvid[5] = temp2[2];
        bvid[6] = temp2[3];
        bvid[7] = temp2[1];
        bvid[8] = temp2[5];
        bvid[9] = temp2[0];
        bvid[10] = temp2[7];
        bvid[11] = temp2[8];

        return bvid.join('');
    }

    window.bv2av = bv2av;
    window.av2bv = av2bv;

    //URL 变化时, 重置计数
    window.addEventListener('hashchange', () => {
        outputpageitemnum = 0;
    });

    //监听键盘输入
    document.addEventListener('keydown', (e) => { //Ctrl + S
        if(e.ctrlKey && e.keyCode === 83){
            output_page_div.style.visibility = 'hidden';
            output_page_div.querySelector('.output_page_background').classList.add('close');
            output_page_div.querySelector('.output_page_btn_copy').classList.remove('ok');
            output_page_div.querySelector('.output_page_btn_copy').innerText = '复制';
        }
        else if(e.keyCode === 27){ //Esc
            //output_page_div.style.visibility = 'hidden';
            output_page_div.querySelector('.output_page_background').classList.add('close');
            output_page_div.querySelector('.output_page_btn_copy').classList.remove('ok');
            output_page_div.querySelector('.output_page_btn_copy').innerText = '复制';
        }
        else if(e.ctrlKey && e.shiftKey == false && e.keyCode === 67 && output_page_div.querySelector('.output_page_background').getAttribute('class').indexOf('close') == -1 &&
                output_page_div.querySelector('.output_page_text') != document.activeElement){ //Ctrl + C
            let output_page_btn_copy = output_page_div.querySelector('button.output_page_btn_copy');
            let output_page_text = output_page_div.querySelector('.output_page_text');
            if(output_page_text.value != null){
                let pos = [output_page_text.selectionStart,output_page_text.selectionEnd];
                output_page_text.select();
                document.execCommand('copy');
                output_page_text.setSelectionRange(pos[0], pos[1]);
                //output_page_text.blur();
                output_page_btn_copy.classList.add('ok');
                output_page_btn_copy.innerText = '完成';
            }
        }
    }, false);

    //自适应字体大小
    let fixfontsizerunning = false;
    async function fixfontsize (hiddendom, dom, size = 20, num = 0.05){ //操纵对象; 目标对象; 目标值; 累加常量.
        if(fixfontsizerunning != false || dom == null || hiddendom == null){
            return;
        }
        else{
            fixfontsizerunning = true;
            if(output_page_div.querySelector('.output_page_background').getAttribute('class').indexOf('close') != -1){ //等待控件初始化
                while(output_page_div.querySelector('.output_page_background').getAttribute('class').indexOf('close') != -1){
                    await delay(10);
                }
            }
            else if(hiddendom.scrollHeight == 0){
                fixfontsizerunning = false;
                return;
            }
        }

        if(hiddendom.scrollHeight > size){
            while(hiddendom.scrollHeight > size){
                hiddendom.style.fontSize = Number(hiddendom.style.fontSize.substring(0,hiddendom.style.fontSize.indexOf('em'))) - num + 'em';
                //hiddendom.offsetHeight;
            }
            if(hiddendom.scrollHeight < size){ //跳多了就缩回去
                hiddendom.style.fontSize = Number(hiddendom.style.fontSize.substring(0,hiddendom.style.fontSize.indexOf('em'))) + num + 'em';
            }
        }
        else if(hiddendom.scrollHeight < size){
            while(hiddendom.scrollHeight < size){
                hiddendom.style.fontSize = Number(hiddendom.style.fontSize.substring(0,hiddendom.style.fontSize.indexOf('em'))) + num + 'em';
                //hiddendom.offsetHeight;
            }
            if(hiddendom.scrollHeight > size){ //跳多了就缩回去
                hiddendom.style.fontSize = Number(hiddendom.style.fontSize.substring(0,hiddendom.style.fontSize.indexOf('em'))) - num + 'em';
            }
        }

        //await delay(10);
        dom.style.fontSize = hiddendom.style.fontSize;
        fixfontsizerunning = false;
    }


    //监听窗体尺寸变化
    let timer_resize;
    window.addEventListener('resize', () => {
        clearTimeout(timer_resize);
        timer_resize = setTimeout( () => { fixfontsize(output_page_div.querySelector('.output_page_title_hidden'), output_page_div.querySelector('.output_page_title'), topbarsize); } , 10);
    }, false);

    window.fixfontsize = fixfontsize;

})();
// ==UserScript==
// @name         网易云音乐免费下载
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  可以免费下载网易云音乐上的歌曲
// @author       remramEMT
// @match        https://music.163.com/
// @icon         https://s1.music.126.net/style/favicon.ico?v20180823
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/493455/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/493455/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    alert('[网易云音乐免费下载]:本脚本已失效,将无限期停用');
    //等待网页加载时间单位：秒（ms）,网络慢可以设置长一点
    const time = 1500;
    //从本地读取默认下载音质,没保存有就默认为standard
    let defaultDownloadLevel = localStorage.getItem('defaultDownloadLevel') || 'standard';
    //从本地读取默认下载文件格式,没保存有就默认为standard
    let defaultFormatSelect = localStorage.getItem('defaultFormatSelect') || '歌手名-歌曲名.文件名';
    console.log('当前选择音质：' + defaultDownloadLevel);
    console.log('当前选择下载文件格式：' + defaultFormatSelect);
    //创建侧边显示栏
    const box = document.createElement('div');
    box.style.width = '210px';
    box.style.top = '450px';
    box.style.position = 'fixed';//固定位置
    box.style.zIndex = '9999'; // 显示在最上层
    // 将侧边显示栏添加到页面上
    document.body.appendChild(box);
    var type_id;

    //创建音质选择按钮
    function createLevelSelectElement(downloadButton) {
        //创建一个select
        const selectElement = document.createElement('select');
        //音质选择按钮css样式
        selectElement.style.verticalAlign = 'middle';
        selectElement.style.width = 'auto';
        selectElement.style.height = 'auto';
        selectElement.style.display = 'inline-block';
        selectElement.style.backgroundColor = 'rgb(220, 30, 30)';
        selectElement.style.color = 'white';
        selectElement.style.width = '80px';
        selectElement.style.height = '31px';
        selectElement.style.border = 'none';
        selectElement.style.outline = 'none';
        selectElement.style.borderRadius = '0 4px 4px 0';
        //select添加选项
        selectElement.innerHTML = `<option value="standard">标准</option>
                             <option value="higher">较高</option>
                             <option value="exhigh">极高</option>
                             <option value="lossless">无损</option>
                             <option value="hires">Hi-Res</option>
                             <option value="jyeffect">高清环绕声</option>
                             <option value="sky">沉浸环绕声</option>
                             <option value="jymaster">超清母带</option>`;
        //添加选项改变事件
        selectElement.addEventListener('change', function () {
            //更改下载音质
            defaultDownloadLevel = this.value;
            //将更改选项保存到本地
            localStorage.setItem('defaultDownloadLevel', defaultDownloadLevel);
            console.log('当前选择音质：' + defaultDownloadLevel);
            //下载按钮恢复为可点击状态
            downloadButton.disabled = false;
            downloadButton.style.backgroundColor = 'rgb(220, 30, 30)';
        });
        // select设置为默认下载音质选项
        selectElement.value = defaultDownloadLevel;
        return selectElement;
    }

    //创建Title
    function createTitleElement() {
        const titleElement = document.createElement('div');
        // 下载按钮css样式
        titleElement.style.display = 'inline-block';;
        titleElement.textContent = '下载文件格式';
        titleElement.style.textAlign='center';
        titleElement.style.lineHeight = '31px'
        titleElement.style.height = '31px';
        titleElement.style.width = '80px';
        titleElement.style.marginTop = '5px';
        titleElement.style.backgroundColor = 'rgb(220, 30, 30)';
        titleElement.style.color = '#FFF'
        titleElement.style.borderRadius = '4px 0 0 4px';
        titleElement.style.borderRight='2px solid rgb(176, 24, 24)';
        titleElement.style.verticalAlign = 'middle';
        return titleElement;
    }

    //创建下载文件格式按钮
    function createFormatSelectElement(downloadButton) {
        //创建一个select
        const selectElement = document.createElement('select');
        //下载文件格式按钮css样式
        selectElement.style.verticalAlign = 'middle';
        selectElement.style.width = 'auto';
        selectElement.style.height = 'auto';
        selectElement.style.display = 'inline-block';
        selectElement.style.backgroundColor = 'rgb(220, 30, 30)';
        selectElement.style.color = 'white';
        selectElement.style.marginTop = '5px';
        selectElement.style.width = '135px';
        selectElement.style.height = '31px';
        selectElement.style.border = 'none';
        selectElement.style.outline = 'none';
        selectElement.style.borderRadius = '0 4px 4px 0';
        //select添加选项
        selectElement.innerHTML = `<option value="歌曲名-歌手名.文件名">歌曲名-歌手名.文件名</option>
                             <option value="歌手名-歌曲名.文件名">歌手名-歌曲名.文件名</option>
                             `;
        //添加选项改变事件
        selectElement.addEventListener('change', function () {
            //更改下载文件格式
            let Format = this.value;
            //将更改选项保存到本地
            localStorage.setItem('defaultFormatSelect', Format);
            console.log('当前选择下载文件格式：' + Format);
            //下载按钮恢复为可点击状态
            downloadButton.disabled = false;
            downloadButton.style.backgroundColor = 'rgb(220, 30, 30)';
        });
        // select设置为默认下载音质选项
        selectElement.value = defaultFormatSelect;
        return selectElement;
    }

    // 创建下载按钮
    function createDownloadButton() {
        // 创建下载按钮
        const downloadButton = document.createElement('button');
        // 下载按钮css样式
        downloadButton.title = '下载音乐';
        downloadButton.textContent = '免费下载';
        downloadButton.style.height = '31px';
        downloadButton.style.width = '59px';
        downloadButton.style.backgroundColor = 'rgb(220, 30, 30)';
        downloadButton.style.color = '#FFF'
        downloadButton.style.borderRadius = '4px 0 0 4px';
        //downloadButton.style.marginLeft = '44px';
        downloadButton.style.borderRight='2px solid rgb(176, 24, 24)';
        downloadButton.style.verticalAlign = 'middle';
        // 下载按钮添加点击事件
        downloadButton.onclick = function () {
            //设置为不可点击状态
            downloadButton.disabled = true;
            downloadButton.style.backgroundColor = '#EEE';
            //获取文件名
            const fileName = getSinger_SongTitle();
            console.log(`尝试下载:${fileName}`);
            //获取下载链接
            fetch(`https://csm.sayqz.com/api/?type=apiSongUrlV1&id=${type_id.id}&level=${defaultDownloadLevel}`)
                .then(response => response.text())
                .then(html => {
                //提取下载链接
                const downloadUrl = JSON.parse(html).data[0].url;
                //提取文件类型
                const type = JSON.parse(html).data[0].type;
                //显示下载提示
                const div = downloadInfoDisplay(`${fileName}.${type}`);
                fetch(downloadUrl)
                //下载，生成blob对象
                    .then(response => response.blob())
                    .then(blob => {
                    var url = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    //保存到硬盘（歌手 - 歌曲名.类型）
                    a.download = `${fileName}.${type}`;
                    a.click();
                    //取消下载提示
                    div.parentNode.removeChild(div);
                })
                    .catch(error => console.error('Error:', error));
            })
                .catch(error => console.error('Error:', error));
        };
        return downloadButton;
    }

    //获取文件名（歌手 - 歌曲名）
    function getSinger_SongTitle() {
        // 切换到iframe
        const iframeDocument = getiframe('g_iframe');
        // 在iframe中查找元素
        //获取歌手信息标签
        const singerElement = iframeDocument.evaluate("/html/body/div[3]/div[1]/div/div/div[1]/div[1]/div[2]/p[1]/span", iframeDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        //获取歌曲名信息标签
        const SongTitleElement = iframeDocument.evaluate("/html/body/div[3]/div[1]/div/div/div[1]/div[1]/div[2]/div[1]/div/em", iframeDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        //格式化歌手信息(去除' / ')
        const singer = singerElement.innerText.replace(/ \/ /g, ' ');
        //格式化歌曲名(去除' / ')
        const SongTitle = SongTitleElement.innerText.replace(/ \/ /g, ' ');
        //定义文件名（歌手 - 歌曲名）
        const fileName = localStorage.getItem('defaultFormatSelect') === '歌手名-歌曲名.文件名' ? `${singer} - ${SongTitle}` : `${SongTitle} - ${singer}`;
        return fileName;
    }

    //显示下载提示
    function downloadInfoDisplay(fileName_type) {
        //创建一个下载信息显示框
        const div = document.createElement('div');
        div.textContent = `本脚本已失效，无限期停用`;
        div.style.float = 'left';
        div.style.marginTop = `10px`;
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        div.style.color = '#FFF';
        div.style.borderRadius = '4px';
        // 将下载信息显示框添加到侧边显示栏
        box.appendChild(div);
        return div;
    }

    // 获取iframe
    function getiframe(name) {
        const iframe = document.getElementById(name);
        return iframe.contentDocument || iframe.contentWindow.document;
    }

    //获取id和URL类型
    function getTypeIdFromURL(url) {
        const hash = new URL(url).hash;
        //分割URL类型和id
        type_id = hash.split('id=');
        return {
            id: type_id[1],
            type: type_id[0]
        };
    }

    //显示下载按钮
    function downloadButton_is_Display() {
        //获取id和URL类型
        type_id = getTypeIdFromURL(window.location.href);
        //判断URL类型是否为音乐链接
        if (type_id.type === '#/song?') {
            //等待{time}毫秒网页加载
            setTimeout(function () {
                // 获取iframe
                const iframeDocument = getiframe('g_iframe');
                //获取按钮栏
                const divElement = iframeDocument.evaluate("/html/body/div[3]/div[1]/div/div/div[1]/div[1]/div[2]/div[2]/div", iframeDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                //获取原下载按钮
                const originalDownloadButton = divElement.querySelector('[data-res-action="download"]');
                //获取评论按钮
                const commentElement = originalDownloadButton.nextElementSibling;
                //删除原来的下载按钮
                originalDownloadButton.parentNode.removeChild(originalDownloadButton);
                //删除评论按钮
                commentElement.parentNode.removeChild(commentElement);
                //生成一个新下载按钮
                const downloadButton = createDownloadButton();
                //生成一个音质选择按钮
                const selectLevelElement = createLevelSelectElement(downloadButton);
                //生成一个下载文件格式选择按钮
                const selectFormatElement = createFormatSelectElement(downloadButton);
                //生成一个Title
                const titleElement = createTitleElement();
                // 将生成的元素添加到按钮栏上
                divElement.appendChild(downloadButton);
                divElement.appendChild(selectLevelElement);
                divElement.appendChild(titleElement);
                divElement.appendChild(selectFormatElement);
            }, time)
        }
    }

    //浏览器地址栏更变，判断是否显示下载按钮
    window.onhashchange = function () {
        downloadButton_is_Display();
    };
    downloadButton_is_Display();
})();
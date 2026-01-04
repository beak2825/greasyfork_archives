// ==UserScript==
// @name         豆瓣时光
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  查看豆瓣、时光网的原图。
// @icon         http://static1.mtime.cn/favicon.ico
// @author       cw2012
// @include      https://movie.douban.com/subject/*/photos/
// @include      https://movie.douban.com/photos/*
// @include      https://movie.douban.com/celebrity/*/photo/*
// @include      https://music.douban.com/musician/*/photo/*
// @include      http*://movie.mtime.com/*/posters_and_images/*
// @include      http*://people.mtime.com/*/photo_gallery/*/
// @grant        GM_xmlhttpRequest
// @connect      service.library.mtime.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/418946/%E8%B1%86%E7%93%A3%E6%97%B6%E5%85%89.user.js
// @updateURL https://update.greasyfork.org/scripts/418946/%E8%B1%86%E7%93%A3%E6%97%B6%E5%85%89.meta.js
// ==/UserScript==

(function() {
    let type = location.href.split('/')[3];
    switch(type){
        case 'subject':
            managePoster();
            break;
        case 'photos':
            replacePhoto(`https://img3.doubanio.com/view/photo/raw/public/p${location.href.match(/\d+/)[0]}.jpg`);
            break;
        case 'celebrity':
            replacePhoto(`https://img9.doubanio.com/view/photo/raw/public/p${location.href.match(/\d+/g)[1]}.jpg`);
            break;
        case 'musician':
            replacePhoto(`https://img9.doubanio.com/view/photo/raw/public/p${location.href.match(/\d+/g)[1]}.jpg`);
            break;
        default:
            setTimeout(replaceMtime, 200);
            break;
    }

    // 替换单幅图片
    function replacePhoto(rawPhotoUrl){
        let show = document.querySelectorAll('.update.magnifier .j.a_show_login')[0];
        show.href = rawPhotoUrl;
        show.parentNode.replaceChild(show.cloneNode(true), show);
        let zoom = document.querySelectorAll('.photo-zoom.j.a_show_login')[0];
        zoom.href = rawPhotoUrl;
        zoom.parentNode.replaceChild(zoom.cloneNode(true), zoom);
    }
    // 海报
    function managePoster(){
        let lis = document.querySelectorAll('#content .article li');
        if (lis){
            for (let li of lis) {
                li.getElementsByTagName("img")[0].src = `https://img3.doubanio.com/view/photo/raw/public/p${li.getAttribute('data-id')}.jpg`
                }
        }
    }
    // mtime
    function replaceMtime(){
        let picBox = document.querySelector('#imageRegion img');
        // 如果图片不对，再尝试替换
        let size = document.querySelector('#imageSize').innerText.match(/\d+x\d+/)[0];
        picBox.onerror = err=>{
            GM_xmlhttpRequest({
                // 电影和影人的参数略有不同
                url:`http://service.library.mtime.com/Comment.api?Ajax_CallBack=true&Ajax_CallBackType=Mtime.Library.Services&Ajax_CallBackMethod=`+
                    `${location.href.indexOf('movie')!=-1?'DownloadNoWatermarkImage':'DownloadPersonBigImage'}&Ajax_CrossDomain=1&Ajax_RequestUrl=`
                     +`${encodeURIComponent(location.href)}&t=${getTimeString()}&Ajax_CallBackArgument0=${location.href.split('/')[5]}`,
                method:'get',
                onload:res=>{
                    let text = res.responseText;
                    if(text.indexOf('{"success":true')!=-1){
                        let picUrl = text.substr(text.indexOf('src":"')+6,86);
                        picBox.src = picUrl;
                        picBox.style.height = '100%';
                    }else{
                        alert('获取数据出错,可能需要登录才能获取到图片');
                    }
                }
            });
        };
        picBox.src = picBox.src.replace(/\d+[xX]\d+\.jpg/, size + '.jpg');
        picBox.style.height = '100%';
    }
    function getTimeString(){
        let tmp = new Date();
        let month = tmp.getMonth + 1, date = tmp.getDate(), hour = tmp.getHours(), minute = tmp.getMinutes(), sec = tmp.getSeconds();
        // 2020122115411830739
        return `${tmp.getFullYear()}${(month>9?'':'0')+month}${(date>9?'':'0')+date}${(hour>9?'':'0')+hour}${(minute>9?'':'0')+minute}${(sec>9?'':'0')+sec}30739`;
    }
})();
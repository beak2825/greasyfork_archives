// ==UserScript==
// @name         必应每日一图一键下载-Bing Wallpaper Download
// @name:zh      必应每日一图一键下载
// @name:zh-CN   必应每日一图一键下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  必应每日一图一键下载,自动命名.
// @author       pruidong
// @match        http*://www.bing.com/?*
// @match        http*://www.bing.com/
// @match        http*://cn.bing.com
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjFFQkQ3QTNENEZCMTExRTZBNEFERERBQjI3RTJGQjU0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjFFQkQ3QTNFNEZCMTExRTZBNEFERERBQjI3RTJGQjU0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MUVCRDdBM0I0RkIxMTFFNkE0QUREREFCMjdFMkZCNTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MUVCRDdBM0M0RkIxMTFFNkE0QUREREFCMjdFMkZCNTQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7MJKjcAAAE9UlEQVR42uxXaWhcVRg99y0z72Wb2Cw00WikIW1MtSYWJLWKCFaUCiragvuWP8U/VcEfUq2KIP4RkaIWKVqstAVxBy0tdSG1FIsllmpMQExMapNMJsskb+Zt13PfTE1SJ3WChf6wj5x5+/3O/b7vnPsipJQ4n5uG87xdIGD8ffRcdQF65JfJAJ4LlJQCQvGVp4m/QTQTvxF7if3RO6M6cFuamAFSQBCY6Bq6H9OajVI3xJoDjTAcht361BkECm1BgMC2oZXGIU55DMvBE1KFt8hj05wn7yA2Q5e7kCY3Be1clCCdRn/zcnxx56NIrWeG2ieBcZJI6h5CMYaQZHwS87wa+O77GNE60MJsrc4C0+eCQBhCsgxjJfUY7SCBhzhw5zhwRdZDWr6JjABiZpSlULd5jBdw1wTQRFJTi+2B3FZOOIQfnQkBjSTi7gzMEV5iPLRyhivcdvysNZ0cbsUv1nXQLRdZpwytFQdvrr9kdDtG8Dl0fLrYDGwjBok+4hXCBE1KEVBEouAhOpDEZ5zdUVwZbpxZZWOsvA5ZZmCqYgmcWltR72R/fMKnjxH3LIbAmnwGLiOeIb6jCuzAYJJybvkicYhE1pMIwHbQpwJmx4HheYi5GehOkBOJiMZblVfHR0SiGAI98+543rVBZeXGwcbLEXcye3hlS9HiViTKiNLoWCnkCHHpvxH46h93dX2DbxjbIMMNRQfn7CUx3F0edZNe7SHwRXOUPZUJuTCB3cTO2VlI/slbhZSboh4oYtbRYxb3NUDv4Vq8tPYWJH8tR0V1Vt2+WAu0g5rUtpLkTYUIqO5/hHhd+ZkioOqvZFjUxHWJ7Aw9YiJ3vmz1CPadaMXHW9pRVpWBIXRMV/htydr08/D0HQvJULXXW8Q6ojrMB1d7qefdbYFkaCRQWedg/8sN6B1bhlNd5TkzpR7Vu4YXwA+HkYnFOWDNroWMSAU+QbSw/ohxHSgdS8KamoDmKMebrTPHjQYOdYPQ4YUxWAkfTesm8OV7K/FN33KsWdqH2584BtnvwEwNo2pIoGa4ioYV3FcoA1cTH8yboxADmu+XlUxPXGSIzOnWiN4SMXKYyMJOj8MypxC6GlLdJhpvmMSub7ejp3spVrb9gXhDiMHjAqHtoTxd/Y41WTkIwz9UiIBiVTW3CUlgjx+L7ZSB1i1Vh7FAUmWBjqz46JNZWCQQN0jAV6KhS/ZSgQ0urmnpj9YDd9SAMJWjmjvSZenOwKJfuLGCKmg7Q4JMu7O7Mpn8yTfNtczLn1FutFz6FXVpzJZA7dlpyj8R0qTCoZxZiVzfvMbfx0KdRiXkgjKsmnM8RQIPC8c5SgKgF3TxWjvxYaRjRYCTkJrg6Vkl2pNfqp+MKirFWRejp4nriWQukBxSHyScPV+USucnGetuWsmNFOwDpPig1IWh1gER8+F4pZFa8kbzA6Gk9nZeWUWthgfywDwz4qCuEYeX0CN7Fb2xr/GjfYR6v7emOmUY8cN8RsIJEkPmVe6zHPF7aq9n8Z9kBcWtQXA1TGSTWHKcBR2zIHoq1J3HYUnLHpiBrVQbcNrTsc1hItwb1uea9NwQYHrrBvpRP/g7REp9D9BcygLVOQ1Rqk09v+LgVfbEXq03QLiCdbbkrGf81wxorqtWRga2ZztYYl/eN9SHl1r73wUbkharrA8QxWdAXPjP6AKB/z2BvwQYAPV41FvHaIwpAAAAAElFTkSuQmCC
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_log
// @grant        GM_notification
// @noframes
// @connect     cdn.bootcdn.net
// @license     GPL
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/431609/%E5%BF%85%E5%BA%94%E6%AF%8F%E6%97%A5%E4%B8%80%E5%9B%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD-Bing%20Wallpaper%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/431609/%E5%BF%85%E5%BA%94%E6%AF%8F%E6%97%A5%E4%B8%80%E5%9B%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD-Bing%20Wallpaper%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ///
    /// 如果Windows 10 看不到通知,可能需要在右下角点通知,右上角管理通知,开启[获取来自应用和其他发送者的通知].
    ///
    /// 获取当前日期时间为文件名.
    function getCurrDateTime() {
      let dateTime;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes():new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds():new Date().getSeconds();
      dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf+':'+ss ;
      return dateTime;
    }
    /// 下载
    function download(){
        let currDateTime=getCurrDateTime();
        try{
            const imgUrl=$("#preloadBg").prop("href");
            if(imgUrl && imgUrl.lastIndexOf(".")!=-1){
                const fileExt=imgUrl.substr(imgUrl.lastIndexOf("."),imgUrl.length-1);
                currDateTime=currDateTime.replace(" ","-");
                currDateTime=currDateTime.replaceAll(":","-");
                const downloadFileName=`${currDateTime}${fileExt}`;
                GM_download(imgUrl,downloadFileName);
            }
        }catch(e){
            GM_notification({text:"图片下载出现了一点问题,请稍候重试~",title:"错误提示",timeout:3000});
            GM_log(`[${currDateTime}]错误信息:${e}`);
        }finally{
            GM_notification({text:"图片下载成功",title:"提示",timeout:3000});
        }
    }
    $("body").append("<div id='BillWallPaperDownloadDiv' style='width:50px;height:50px;position:fixed;top:50%;border-radius:5px;background-color:#fff;'><div style='width:48px;height:48px;background:url(data:image/png;base64,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) no-repeat #fff;background-size: auto;' id='downloadDiv'></div></div>");
    $("#downloadDiv").click(download);
    $('#BillWallPaperDownloadDiv,#downloadDiv').hover(
               function () {
                  $("#BillWallPaperDownloadDiv,#downloadDiv").css({"background-color":"#ccc"});
               },
               function () {
                  $("#BillWallPaperDownloadDiv,#downloadDiv").css({"background-color":"#fff"});
               }
     );
    let menu_feedBack_ID=null;
    registerMenuCommand();
    // 注册脚本菜单
    function registerMenuCommand() {
        if (menu_feedBack_ID) { // 如果反馈菜单ID不是 null，则删除所有脚本菜单
            GM_unregisterMenuCommand(menu_feedBack_ID);
        }
        menu_feedBack_ID = GM_registerMenuCommand(' 反馈 & 建议 [Github]', function () {window.GM_openInTab('https://github.com/pruidong/UserScript', {active: true,insert: true,setParent: true});window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/431609/feedback', {active: true,insert: true,setParent: true});});
    }
    

})();
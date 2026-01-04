// ==UserScript==
// @name         哔哩哔哩历史记录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  为已看过的视频打上“已看过”标签
// @author       pikaqian
// @match        https://*.bilibili.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAGTGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NzUzLCAyMDIxLzAyLzE1LTExOjUyOjEzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTExLTEyVDExOjUyOjA4KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTExLTEyVDExOjUyOjA4KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0xMS0xMlQxMTo1MjowOCswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjZWQxMGRkMy04MWExLTQxNGEtOGVjMC1mNzA5ZDIzZDdjYWIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjNjgwMjNjZi02OWRkLTUxNGQtOWY5Yy0xYjdjNjAyM2U1M2YiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYjU5ZTEwMC1mZTU2LWVhNDItOGZmYS1lOTVkMjhlNjYzOTkiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowYjU5ZTEwMC1mZTU2LWVhNDItOGZmYS1lOTVkMjhlNjYzOTkiIHN0RXZ0OndoZW49IjIwMjMtMTEtMTJUMTE6NTI6MDgrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4zIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2VkMTBkZDMtODFhMS00MTRhLThlYzAtZjcwOWQyM2Q3Y2FiIiBzdEV2dDp3aGVuPSIyMDIzLTExLTEyVDExOjUyOjA4KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDxyZGY6QmFnPiA8cmRmOmxpPjdCNTczQzA0Q0MwMTNBNTlEOEY1REM5QUU4QUU3RUMzPC9yZGY6bGk+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6RG9jdW1lbnRBbmNlc3RvcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HIppywAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGZQTFRFVlRld3ODYl1tx6ev7Kt+8LmEbWd4QT9OSEVWT0xedFdRNzRCUDo4l5it//fr98Sa1Kan46mo+uXVs4NsY0pG9aWd7ImJiWRcxZd3iYSR47u7nnZt48zPMCUr+sy61nN2vVletJSTkcIccQAAEoVJREFU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
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_listValues
// @grant        GM_deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/479573/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/479573/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //此脚本限制了不加载iframe中的内容！！！！

    function add_watched_tag(elemt,type){
        if(elemt.getElementsByClassName('view_tag').length==0){
            if(type=='user'){
                var tag=document.createElement('text')
                tag.className='view_tag'
                tag.innerText='已看过'
                tag.style=`position: absolute;width: 37px;height: 15px;background-color: rgb(222, 222, 222);padding: 3px 4px;font-weight: 550;border-radius: 4px;top: 15px;margin-left: 3px;transform: scale(0.9);z-index: 1;`
                elemt.appendChild(tag)
            }
            else if(type=='video'){
                tag=document.createElement('text')
                tag.className='view_tag'
                tag.innerText='已看过'
                tag.style=`position: absolute;width: 37px;height: 15px;background-color: rgb(222, 222, 222);padding: 3px 4px;font-weight: 550;border-radius: 4px;top: 5px;margin-left: 3px;transform: scale(0.9);z-index: 1;`
                elemt.appendChild(tag)
            }
            else if(type=='front'){
                tag=document.createElement('text')
                tag.className='view_tag'
                tag.innerText='已看过'
                tag.style=`position: absolute;width: 50px;height: 23px;background-color: rgb(222, 222, 222);padding: 3px 4px;font-weight: 550;border-radius: 4px;top: 10px;margin-left: 6px;transform: scale(0.9);z-index: 1;`
                elemt.appendChild(tag)
            }
        }
    }

    var old_id=''
    var saved_id=GM_getValue('BiliHistory')
    if(saved_id!=null){
        console.log('储存历史记录长度：'+saved_id.length)
    }
    if(saved_id!=null&&saved_id.length>=110000){
        //undefined,1CN4y1D71D,16v411W7RP,1YF411R7FE
        saved_id=saved_id.replace(/undefined\,/g,'').substring(5500,)
    }
    else if(saved_id>200000){
        var all_clear=confirm("历史记录过多（未自动清理），是否手动清空历史记录？")
        if(all_clear==true){
            GM_deleteValue('BiliHistory')
        }
    }

    window.addEventListener('load',function(){
        var load_card=setInterval(function(){
            console.log('a')
            var saved_id=GM_getValue('BiliHistory')
            if(window.location.href.match(/www\.bilibili.com\/video\//)!=null){
                var now_id=window.location.href.match(/(?<=av|aV|Av|AV|bv|bV|Bv|BV).{2,}?(?=\/|$|\?|\#)/)[0]
                if(now_id!=old_id){
                    old_id=now_id
                    if(saved_id==null||saved_id.match(now_id)==null){
                        saved_id+=','+now_id
                        GM_setValue('BiliHistory',saved_id)
                    }
                }
            }

            if(window.location.href.match(/www\.bilibili.com\/video\//)!=null){
                var video_page_id=''
                var video_page=document.getElementsByClassName('video-awesome-img')
                for(var i=0;i<video_page.length;i++){
                    video_page_id=video_page[i].href.match(/(?<=av|aV|Av|AV|bv|bV|Bv|BV).{2,}?(?=\/|$|\?|\#)/)[0]
                    if(saved_id.match(video_page_id)!=null){
                        //video_page[i].style.filter='blur(10px)'
                        add_watched_tag(video_page[i],'video')
                    }
                }
            }
            else if(window.location.href.match(/www\.bilibili\.com(?=\/|$)/)!=null){
                var front_page_id=''
                var front_page=document.getElementsByClassName('bili-video-card is-rcmd')
                var front_page_2=[]
                for(i=0;i<front_page.length;i++){
                    //front_page[i]=front_page[i].getElementsByTagName('a')[0]
                    front_page_2.push(front_page[i].getElementsByTagName('a')[0])
                }
                for(i=0;i<front_page_2.length;i++){
                    front_page_id=front_page_2[i].href.match(/(?<=av|aV|Av|AV|bv|bV|Bv|BV).{2,}?(?=\/|$|\?|\#)/)[0]
                    if(saved_id.match(front_page_id)!=null){
                        //front_page_2[i].style.filter='blur(10px)'
                        add_watched_tag(front_page_2[i],'front')
                    }
                }
            }
            else if(window.location.href.match(/space\.bilibili\.com/)!=null){
                var user_page_id=''
                var user_page=document.getElementsByClassName('small-item fakeDanmu-item')
                for(i=0;i<user_page.length;i++){
                    user_page_id=user_page[i].getAttribute('data-aid')
                    if(saved_id.match(user_page_id)!=null){
                        //user_page[i].style.filter='blur(10px)'
                        add_watched_tag(user_page[i],'user')
                    }
                }
            }
        },3000)
        })
/*
    window.addEventListener('keydown',function(e){
        if(e.keyCode==68&&e.altKey==true&&e.shiftKey==true){
            console.log(GM_getValue('BiliHistory'))
        }
        else if(e.keyCode==67&&e.altKey==true&&e.shiftKey==true){
            if(confirm('是否清除记录')){
                GM_deleteValue('BiliHistory')
            }
        }
    })
*/
})();
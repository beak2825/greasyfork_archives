// ==UserScript==
// @name         哔哩哔哩历史记录
// @namespace    BiliHistory
// @version      0.1
// @description  在哔哩哔哩视频页面上对已看过的视频添加标签
// @author       Pikaqian
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/456109/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/456109/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var old_id=window.location.href.match(/(?<=video\/(A|a|B|b)(V|v)).*(?=\/)/)[0]
    /*
    if(GM_getValue('BiliHistory').match(old_id)==null){
        GM_setValue('BiliHistory',GM_getValue('BiliHistory')+','+old_id)
    }
    */
    window.addEventListener('keydown',function(e){
        var add=``
        if(e.keyCode==69){
            console.log(GM_getValue('BiliHistory'))
        }
        /*
        if(e.keyCode==65){
            GM_setValue('BiliHistory',add)
            console.log('add')
        }
        */
    })

    window.addEventListener('load',function(){
        var load_card=setInterval(function(){
            console.log('load_card')
            var card=document.getElementsByClassName('video-page-card')[0]
            if(card!=null){
                var old_id=window.location.href.match(/(?<=video\/(A|a|B|b)(V|v)).*(?=\/)/)[0]
                if(GM_getValue('BiliHistory').match(old_id)==null){
                    GM_setValue('BiliHistory',old_id+','+GM_getValue('BiliHistory'))
                }

                card=document.getElementsByClassName('video-page-card')
                var last_card=[]
                for(var i=0;i<card.length;i++){
                    last_card[i]=card[i].getElementsByTagName('a')[0].href.match(/(?<=video\/(A|a|B|b)(V|v)).+(?=\/)/)[0]
                    if(GM_getValue("BiliHistory").match(last_card[i])!=null){
                        //card[i].getElementsByTagName('IMG')[0].style.filter='blur(10px)'
                        var tag=document.createElement('text')
                        tag.className='view_tag'
                        tag.innerText='已看过'
                        tag.style=`position: relative;width: 37px;height: 15px;background-color: rgb(222, 222, 222);padding: 3px 4px;font-weight: 550;border-radius: 4px;top: -75px;margin-left: 3px;transform: scale(0.9);`
                        card[i].getElementsByTagName('IMG')[0].parentNode.appendChild(tag)
                    }
                }
                console.log(last_card)
                clearInterval(load_card)
            }
        },1000)
        })

    window.addEventListener('click',function(e){
        if(e.target.closest('a')!=null&&e.target.closest('a').href.match(/video\/(A|a|B|b)(V|v).+/)!=null){
            //记录id部分


            //换页部分
            // old_id=window.location.href.match(/(?<=video\/(A|a|B|b)(V|v)).*(?=\/)/)[0]
            console.log(old_id)
            var pageInterval=setInterval(function(){
                var new_id=window.location.href.match(/(?<=video\/(A|a|B|b)(V|v)).*(?=\/)/)[0]
                console.log(new_id)
                if(old_id!=new_id){
                    old_id=new_id
                    if(GM_getValue('BiliHistory').match(old_id)==null){
                        GM_setValue('BiliHistory',old_id+','+GM_getValue('BiliHistory'))
                    }
                    var card_old=document.getElementsByClassName('video-page-card')[1].getElementsByTagName('a')[0].href.match(/(?<=video\/(A|a|B|b)(V|v)).+(?=\/)/)[0]
                    var card_change=setInterval(function(){
                        var card_new=document.getElementsByClassName('video-page-card')
                        if(card_old!=card_new[0].getElementsByTagName('a')[1].href.match(/(?<=video\/(A|a|B|b)(V|v)).+(?=\/)/)[0]){
                            var last=[]
                            //console.log(window.location.href)
                            for(var i=0;i<card_new.length;i++){
                                last[i]=card_new[i].getElementsByTagName('a')[0].href.match(/(?<=video\/(A|a|B|b)(V|v)).+(?=\/)/)[0]
                                if(GM_getValue("BiliHistory").match(last[i])!=null){
                                    //card_new[i].getElementsByTagName('IMG')[0].style.filter='blur(10px)'
                                    var tag=document.createElement('text')
                                    tag.className='view_tag'
                                    tag.innerText='已看过'
                                    tag.style=`position: relative;width: 37px;height: 15px;background-color: rgb(222, 222, 222);padding: 3px 4px;font-weight: 550;border-radius: 4px;top: -75px;margin-left: 3px;transform: scale(0.9);`
                                    card_new[i].getElementsByTagName('IMG')[0].parentNode.appendChild(tag)
                                    //`<text width="168" height="95" style="position: fixed;width: 37px;height: 15px;background-color: #dedede;padding-left: 4px;padding-right: 4px;padding-top: 3px;padding-bottom: 3px;font-weight: 550;border-radius: 4px;margin-top: -77px;margin-left: 1px;transform: scale(0.9);">已看过</text>`
                                }
                            }
                            console.log(last)
                            clearInterval(card_change)
                        }
                    },1000)
                    clearInterval(pageInterval)
                    // alert('aaa')
                }
            },1000)
            }
    })
})();
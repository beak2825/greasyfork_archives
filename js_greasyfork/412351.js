// ==UserScript==
// @name         转发评论抽奖
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       You
// @match        *://t.bilibili.com/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/412351/%E8%BD%AC%E5%8F%91%E8%AF%84%E8%AE%BA%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/412351/%E8%BD%AC%E5%8F%91%E8%AF%84%E8%AE%BA%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //本功能仅适用于bilibili视频站内UP主所发的动态进行抽奖
    //只有转发并且评论本条动态的用户才可参与抽奖
    //首先进入动态详情；使用前，请刷新页面，不要进行其他操作，待本功能组件加载完毕后，点击“开始抽奖”按钮
    //等待数秒后（参与用户的数量决定抽奖所需时间），页面即会展示中奖人员弹框
    //弹窗提示前请勿进行其他操作
    //本功能将持续优化
    
    let sendUserArr = []
    let commentUserArr = []
    let finalArr = []
    $('body').append('<div class="draw-container" style="display:none;">'+
                         '<div class="result-cover" style="width: 100%;height: 100%;background-color: rgba(0,0,0,0.6);position: fixed;top: 0;z-index: 10000;display: flex;justify-content: center;align-items: center;">'+
                             '<div class="result-box" style="background-color: #ffffff;border-radius: 4px;padding: 10px;min-width: 250px;min-height: 20px;">'+
                                 '<p class="waiting-tip" style="text-align: center;">抽奖中，请稍等...</p>'+
                                 '<div class="result-list" style="height: 200px;overflow-y: auto;display:none;"></div>'+
                             '</div>'+
                         '</div>'+
                    '</div>')
                    
    setTimeout(function() {
        $('.detail-card .card .main-content').append('<div style="margin: 10px 0 0 0;display: flex;justify-content: flex-start;align-items: center;">'+
                                            '<div style="height: 30px;display: flex;justify-content: flex-start;align-items: center;margin: 0 10px 0 0;">'+
                                                '抽取'+
                                                '<input style="width: 30px;height: 100%;margin: 0 3px;padding: 0 5px;border-radius: 3px;border: 1px solid #999;" class="will-num" type="text" value="1" />'+
                                                '人'+
                                            '</div>'+
                                            '<button class="start-draw" style="background-color: #007cff;border: 0;color: #ffffff;padding: 0 8px;border-radius: 4px;cursor: pointer;height: 30px;">开始抽奖</button>'+
                                            '<p style="padding: 0 0 0 10px;color: #848484;font-size: 12px;">提示：刷新页面后再点击抽奖，请勿进行其他操作</p>'+
                                        '</div>')
    }, 3000)
    
    $(document).on('click', '.start-draw', function() {
        if(parseInt($('.will-num').val())){
            $('.draw-container').show()
            $('.will-num').val(parseInt($('.will-num').val()))
            $('.waiting-tip').text('正在抽取 '+$('.will-num').val()+' 人，请稍等...')
            $('.single-button').eq(0).click()
            setTimeout(() => {
                scrollBottom()
            }, 1000)
        } else {
            alert('请输入数字！')
        }
    })
    
    function scrollBottom() {
        window.scrollTo(0, document.body.scrollHeight)
        if ($('.forw-more').children('a').hasClass('nomore')) {
            getSendUser()
        } else {
            setTimeout(() => {
                scrollBottom()
            }, 1000)
        }
    }

    function getSendUser(){
        let sendUserList = $('.forw-list .dynamic-list-item-wrap')
        for (let i = 0; i < sendUserList.length; i++) {
            const sendUserName = sendUserList.eq(i).children('.item-detail').children('.item-user').children('.user-name').text()
            if (sendUserArr.indexOf(sendUserName) < 0) {
                sendUserArr.push(sendUserName)
            }
        }
        $('.single-button').eq(1).click()
        setTimeout(() => {
            getCommentUser()
        }, 1000)
    }
    
    let allComment = []
    function getCommentUser(){
        let commentUserList = $('.comment-list .list-item')
        let flag = 0
        for (let i = 0; i < commentUserList.length; i++) {
            flag = flag + 1
            const commentUserName = commentUserList.eq(i).children('.con').children('.user').children('.name').text()
            if (allComment.indexOf(commentUserName) < 0) {
                allComment.push(commentUserName)
            }
            if (flag == commentUserList.length) {
                if ($('.bottom-page').children('a').hasClass('next')) {
                    $('.bottom-page').children('.next').click()
                    setTimeout(() => {
                        getCommentUser()
                    }, 800)
                } else {
                    setData()
                }
            }
        }
    }

    function setData(){
        allComment.forEach(element => {
            sendUserArr.forEach(ele => {
                if (element == ele) {
                    finalArr.push(ele)
                }
            })
        })
        getWinner()
    }

    function getWinner(){
        let sortData = []
        finalArr.forEach(element => {
            sortData.push({
                name: element,
                num: Math.random()
            })
        })
        sortData.sort(sortby)
        let finalWinners = []
        const chooseNum = $('.will-num').val()
        $('.waiting-tip').text('中奖用户')
        for(let i = 0;i<chooseNum;i++){
            finalWinners.push(sortData[i].name)
            $('.result-list').append('<p class="result-item" style="color: red;font-size: 24px;padding: 10px;text-align: center;border-bottom: 1px solid #dedede;"><span style="color: #ff7800;">'+ (parseInt(i) + 1) +'.</span>'+sortData[i].name+'</p>')
        }
        $('.result-list').show()
    }
    
    function sortby(a,b){
        return a.num-b.num
    }

})();
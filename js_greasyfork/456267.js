// ==UserScript==
// @name         湖南开放大学自动刷课（湖南省事业单位工作人员培训管理平台）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  学习视频（基于作者Aether代码修改）
// @author       Vita
// @match        *.hnsydwpx.cn/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456267/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/456267/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BC%88%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    let hre = location.href;
    if (hre.match("www.hnsydwpx.cn/center.html")) {
        setTimeout(() => {
            console.log('go to my course')
            document.querySelector('.center-main').childNodes[3].childNodes[5].childNodes[1].click()
        }, 2000)

        setTimeout(() => {
            try {
                if (document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').innerHTML != '0') {
                    //点击未完成
                    document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteCount').click()
                    //3秒后再操作 防止元素未加载出来
                    setTimeout(() => {
                        //判断进度<98%才点击
                        //因为有时候视频看完了，进度没有更新，需跳过此类视频，防止重复观看
                        var incompleteNodes = document.getElementsByClassName('iframe')[0].contentWindow.document.getElementById('LearnInCompleteArr').childNodes;
                        for(var i = 0; i < incompleteNodes.length; i++ ){
                            var incompleteNode = incompleteNodes.item(i);
                            var jindu = incompleteNode.getElementsByClassName('percent')[0].getElementsByTagName('span')[0].innerHTML
                            console.log(jindu)
                            jindu = parseInt(jindu.replace('%',''))
                            if(jindu < 98 ){
                                incompleteNode.getElementsByTagName('button')[0].click()
                                break
                            }
                        }
                    }, 2000)
                }
            } catch(err) {
                console.log(err)
                setTimeout(() =>{
                    window.location.reload();
                },1000)
            }
        }, 4000)
    }

    //此处修改为点击查看进度不是100%的部分
    if (hre.match("www.hnsydwpx.cn/play.html")) {
        setTimeout(() => {
            var courseCatalogue = document.getElementById('courseCatalogue').childNodes.item(3)
            var classItems = courseCatalogue.getElementsByClassName('classItem')
            //是否全部完成
            var allComplete = true;
            for(var i = 0; i < classItems.length; i++ ){
                var classItem = classItems[i];
                if(classItem.getElementsByClassName("progressNum")[0].innerHTML != '100%'){
                    allComplete = false;
                    classItem.getElementsByTagName('a')[0].click()
                    break;
                }
            }
            if(allComplete){
                window.location.replace('https://www.hnsydwpx.cn/center.html')
            }
            //全部播完了跳回去
        }, 5000)
    }

    if (hre.match("www.hnsydwpx.cn/getcourseDetails.html")) {
        setInterval(() => {
            console.log("start")
            var courceList = document.getElementById('courseCatalogue').querySelector('.list-item').querySelectorAll('.item-list')
            for(var j = 0; j < courceList.length; j ++) {
                var temp = courceList[j];
                var redborder = temp.getElementsByClassName('redborder');
                console.log(redborder)
                var jindu = temp.querySelector('.item-list-progress').innerHTML;
                console.log(jindu)
                //视频正在播放，且播放进度为100% 需要切换其他视频
                if (redborder.length > 0 && redborder[0].className.indexOf('hide') == -1 && jindu == '100%') {
                    //重新遍历此列表 找到一个不是100%的视频
                    var isComplete = true;
                    for(var k = 0; k < courceList.length; k ++) {
                        var temp2 = courceList[k];
                        if(temp2.querySelector('.item-list-progress').innerHTML != '100%'){
                            isComplete = false;
                            //点击看这个
                            temp2.click();
                            return;

                        }
                    }
                    if (isComplete) {
                        //全部已完成 跳转
                        console.log("back home page")
                        window.location.replace('https://www.hnsydwpx.cn/center.html')
                        return;
                    }
                }
            }

        }, 5000);
    }
})();
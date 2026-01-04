// ==UserScript==
// @name         河南专技辅助挂机
// @version      0.1
// @description  河南专技辅助挂机(自动完成单元测试)
// @author       xisp
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA6CAYAAADlTpoVAAAJIklEQVRoBe1a228c1Rn/zezVu76tLzi24zgkdpwLKYGEivQCLQ2kaqUK2qZPVXlASH3sS+kD75VA6gsP6R+AShFVywMtakUrJUi0KAkJJA4xiYkdx1cSe7O+rHd3bv19s17HdmZnjr3Likb9kvXO7jlzzvc73/2b1RwS7mPS72NsLrT/A/xfl/B9L8FwrSX0+S0Lv3svi4Wcg5jP7jkT6GzS8fIPkmiu07bMps8WW17T98ahaRMjty3fOaXBJgJrjG8dnKxTcxUdpgRV6ZGeMPTK8NUWYDrr4PKkGsAwj35PR+UKVlMJTmUs3JxTA1gf03CgK6Qq7LLzagpw+As1cMJtR6OO1mTl7FW+QtmzWz9gENvgJF2jIvVXQT1lq5oBLJgOPlW0P3Esx/ZFFY/Cf1rNAN5MW5hdsv25WRn96eE4Bjoqtz9ZriYAZxdtnDy1rARuf2cYv3g8rjRXZVLFfnjyjo0zowbuMASIamkb4laeqnl21MRYgPfUYONQTwQv/zCJUBWPfcsARSpvnsvjzIiBLxb8VU8wy8umwhhaFCHHRBgmCrzmsSAEC88eSeD5wxqS1TG9VeFuCeBZSuzk6WVMZ/yByS4h1tPpcAoRal1jBOgxZ3AbrchoYXQ5GTz2oIan98awv3OD6FdZrOxC22xF/8m4id++u4R5Jst+pFE2Ag7tLXhhbxrH9jeiPl4dx+G378axTUlwet7GK3/PBoIT6HHHRrKnFa8dN9CSTAFzN4Dh8zDyy66NaToV07YRys4CluEar6npiOQWYH79RRh17RiacRDVbdeuQzRusW/3xfV12qnYvLzkHOMRzU0OtgwwW3BcyaWzCmpJa8vU1+Pkd7IElwAuvIXCu7+Bk7lJi7P5j4zKKZC5rBaiXYpkReYaUoVlWAd/hj9+1ow3PrQQcXLumDgeAafzT2gFmHznAuSM3tYQXvlxPa/Wk7IE/zVUwDXFVCtE5ju6Y+hs4WbTQ1j+0wvI2RYZpBGWiEwKyZtOEQheXWOmc/A5oGkH/jKsI+xIaClOtFbPVWbeS+0N3q5XCeAcA/Q7Fwv3rurxjcjBpAMZoFa6dP4NGFRB2X4F08rA+jdhO2GZcA6dQCwew51FoKEo6/UTPT7Jusf2ertfb9gbFpmit1StAnQCHI014LnmMXcVc/ojvovyBZConu3AaOljzppDqEDbC77LXTTJymNnm7cDUwKoWoHLbmJbqaSG3dvbADMPY3YUNp1HMDEiJrch33YQr4/GEbcWgm9ZmbGHaZ2UV14UuDMPFUPT6mWOKGJbI1AvzuXaaSBdlKTX5qXvRL5Rh55033E0JOO4PkWZi0dRpH1M76RA9qIyX9+dush4d2lCrcwR9UyHEnimZc5dwBn7AJaVpxO5u57XlQzHGFbQ+zhMepM07S+84ni85m/87kBXeVcSCFBiX1AqtnbDbDSG73YXD8SY/JgOR7YIQEhh6QxDc9ufwqlxA/mFZcp01W2uXf6ea2lKbW8uD6P8yMpSV9gF2wylmJIN9LYDd8bhTA7yVn9VE/XUKT2tfQ9SPf14eyxGaVJdFUnUU7pv5cgXoJz7p5uowi2mzTua+Vei78QF2PNjgcITxmJMvvHgUcZJDfNMbHRHlF2N9m4LIRreIkCDpc5VxeAuWyzq9XiytWh/9swgMxTdjX9BrEp4yLZ/DTnDxA2WVVEYKoHFXXZXu3d4KO3pK8HxtA0pi9RJwyM76D2pcs74eVqRLB8sizAllj/wE7wzHoaWpf1JcqlADbS/bWxO+ZHv6CWqp6kcIZgYc8P9XUkgMwl75H2/fVfHpBZExwBSXb0Ym5GvI4ybq8O+FwNsTG1je9+PfEcHGR7UzpIFAe3voY48IqIxtz5DITtXTKh9dpe1JQ8Fsxehi7eYrtl5Sl4NYd8DtD/JvH2oLECR3HXFZwjF9XUc6V45jpF/0/6obgrHE2cSfrvvWYzNm7gykWP1IDmvP9MlPLvKpGelcXkvC/BzgpM+ixo5VKsIDnWtNIuun1YxPReGHk2g4aGncel2GBFTjqQsS+tYSSV05p/Bcz1nSJP2ypQJqQFVSJy6noihL2XBWc7AnjirJANXTtEmxNq2YyoN1FFdVe2vO6Wju9nfgwrvngAX8zY2E+DFjnZ1036iOrSb57DIolVFPUOOBYPJtcHw8LcRB3V2Vtn+upm9SLgNIk+AN2ZtjM+phwdRq6Od3EoS5Kv/5IXnsut4kQymzmaAP/EaRufDmJih2pTK/HUz7/0gjuWJfu/6b+NsT07eu1JQdjCSMxY0dqKZnbl04Q+rexSrQPkrfvHuSxQ/ggK0b7+ESMceXJtz0G7l2Ej0ZGd1vdLFo71hPLqjfIJdmifvnrMkgT3YHWYKRF9BbqRdIC8pnSz+Kb4XP+fyQKEtjoebFuEsFZCLxhFK9UDKs7DMp1RNwnFZl4qBXhMNnQgdfRE48nMssbB9+2NCo/dUqRvlcfYvn6hbi8H32rNtWLAIgryUSjIByf+rnlGuS58FbIi5YEKOymCDyFjiGOXFRpLOZqgWjrlzvcxlnhHh1feBTy7PsuoIdhgSY186nsS3+tb0doQvH/IE6DN/00PXbrNjmOUhEKH86CBB3gTYf1jUfjC4jEyGXTQF1QwT3K+eSuB7m3zq5Kmim0bhccO5MQt/vgycHTYoz2LXTKaJQ5LWfcxhxkIVKearHgus+aonFcLz34jjm7vVJVe6/UuR4Osf5vDmmWLSXIxroqCuUq/sK5C9lLbEVvF9J3udj+0M40cPx9BWr+aA1q8gjrmKP8YTW331H1mcuhrcYuxpCeHE4Rg62M8UW5d7SySX0mORRLrSx9hVVdHf84GMCrhWSuPXzyTQz2T5y6atyd2Dq9OU2l8vMmYo0JP9kZqAE1aqAlCev7/FZ4VrtMwX5u6AKtz35k0OVgXgRdaNY3wGr0KSRAS1GVTWUZ1TFYDX+fMs1cpfwInbrxVVBaDUjqok6lnNZ/BB+1YMUJ70jrH6UCEBJn2UWlLFAOXXE/JLCxWSKnyAfcxaUsUAP7rBX0swOVehVELDA2UeVKrcv5U5FeuLdLa+fyDKRNq/hpdQcrh387nkVkCtvaeqqdrahb8q1xWr6FcFSDk+/guPlBzroYmbjwAAAABJRU5ErkJggg==
// @match        *://*.ghlearning.com/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/750368
// @downloadURL https://update.greasyfork.org/scripts/423812/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E8%BE%85%E5%8A%A9%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/423812/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E8%BE%85%E5%8A%A9%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
//进入还没有学习的课程。。

    function enterCourse() {
        if (document.getElementsByClassName("item-box")[0]) {
            for (var i = 0; i < document.getElementsByClassName("item-box").length; i++) {
                if (document.getElementsByClassName("sr-only")[i * 2].innerText != "100.0%") {
                    document.getElementsByClassName("item-box")[i].click();
                    break;
                }
            }
            setTimeout(function () {
                console.log("恭喜您完成已选的所有课程！");
                clearInterval(myTimer);
                alert("恭喜您完成已选的所有课程！\n河南专技辅助挂机\n作者：xisp");
            }, 2000);
        }
    }

    var myTimer = setInterval(enterCourse, 3000);

    //自动返回课程目录
     function fh() {
         if (document.getElementsByClassName("btn btn-primary")[1].innerText == "返回课程列表") {
                //console.log('课程进度完成，即将返回课程列表');
                document.getElementsByClassName("btn btn-primary")[1].click()
               }
         if (document.getElementsByClassName("clearfix")[1].innerText == "您已完成该课程学习"){
           history.back(-1);//返回
             }
         }
    var fhTimer = setInterval(fh, 10000);
    //播放视频，刷新单元测试
   function bfang() {
        var text = document.getElementsByClassName("clearfix videoLi active")[0].innerText
        if (text.match(/[0-9]+%/)[0] == "100%"){
            for (var m = 0; m < document.getElementsByClassName("video-info ellipsis-1").length; m++) {
               if (document.getElementsByClassName("badge")[m].innerText != "100%"){
                document.getElementsByClassName("clearfix videoLi")[m].click()
                break;
                }
            }
        }
       if (document.getElementsByClassName("text-newBlue f24 center")[0].innerText == "单元测试"){
               window.location.reload();//刷新
        }
    }
     var bfTimer = setInterval(bfang, 3000); 
    })();
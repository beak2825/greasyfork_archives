// ==UserScript==
// @icon         http://9.url.cn/edu/lego_modules/edu-ui/0.0.1/img/nohash/logo_pc_rich.png
// @name         在线云课堂(腾讯、网易、慕课网...)增加多倍速/去除xxx正在播放/自动播放下一条视频
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  腾讯课堂、慕课网、网易云课堂添加多倍速播放(默认最大 2 倍速,支持到 4 倍速)/自动播放下一个视频(携带上一个视频的倍速);腾讯课堂去除漂浮水印;
// @author       Bamboo
// @include      /^http(s?)://www.imooc.com/(.*)$/
// @include      /^http(s?)://ke.qq.com/(.*)$/
// @include      /^http(s?)://study.163.com/(.*)$/
// @match        *://ke.qq.com/webcourse/*
// @match        *://study.163.com/course/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/404117/%E5%9C%A8%E7%BA%BF%E4%BA%91%E8%AF%BE%E5%A0%82%28%E8%85%BE%E8%AE%AF%E3%80%81%E7%BD%91%E6%98%93%E3%80%81%E6%85%95%E8%AF%BE%E7%BD%91%29%E5%A2%9E%E5%8A%A0%E5%A4%9A%E5%80%8D%E9%80%9F%E5%8E%BB%E9%99%A4xxx%E6%AD%A3%E5%9C%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E6%9D%A1%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/404117/%E5%9C%A8%E7%BA%BF%E4%BA%91%E8%AF%BE%E5%A0%82%28%E8%85%BE%E8%AE%AF%E3%80%81%E7%BD%91%E6%98%93%E3%80%81%E6%85%95%E8%AF%BE%E7%BD%91%29%E5%A2%9E%E5%8A%A0%E5%A4%9A%E5%80%8D%E9%80%9F%E5%8E%BB%E9%99%A4xxx%E6%AD%A3%E5%9C%A8%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E6%9D%A1%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
var website_url = window.location.href || document.location.href;
var website_host = window.location.host || document.location.host;

/**
 * 网易云课堂
 */
var StudyWy = {
    //添加多倍速播放
    addWyExtSpeedPlay() {
        $('.m-popover-rate').css('display', 'none');
        let appendHtml = '<select class="changePlayRateSelect" style="margin-left: 50px">' +
            '<option value="0.5">0.5倍速</option>' +
            '<option value="0.75">0.75倍速</option>' +
            '<option value="1">1倍速</option>' +
            '<option value="1.25">1.25倍速</option>' +
            '<option value="1.5">1.5倍速</option>' +
            '<option value="2">2倍速</option>' +
            '<option value="2.5">2.5倍速</option>' +
            '<option value="3">3倍速</option>' +
            '<option value="3.5">3.5倍速</option>' +
            '<option value="4">4倍速</option>' +
			'<option value="4.5">4.5倍速</option>' +
			'<option value="5">5倍速</option>' +
			'<option value="5.5">5.5倍速</option>' +
			'<option value="6">6倍速</option>' +
			'<option value="6.5">6.5倍速</option>' +
			'<option value="7">7倍速</option>' +
            '</select>';
        $('.j-aotoplaybox').after(appendHtml);
    }
}

/**
 * 腾讯课堂
 */
var Bamboo = {
    /**
    * 根据属性获取标签,列表返回。
    * tagName 要获取元素的标签
    * attrName 属性名
    * attrVal 属性值
    **/
    getDom(tagName, attrName, attrVal) {
        var selectElement = [];
        var element = document.getElementsByTagName(tagName);
        for (var i = 0; i < element.length; i++) {
            var tmpVal = element[i].getAttribute(attrName);
            if (attrVal === tmpVal) {
                selectElement.push(element[i]);
            }
        }

        return selectElement;
    },
    /**
    * 根据父 dom 元素获取子 dom 元素,
    * parentDom 要获取的父 dom 元素
    * tagName 要获取的子 dom 的标签
    * index 要获取子 dom 的索引(第几个元素,默认第 1 个元素-index=0)
    **/
    getChildDom(parentDom, tagName, index) {
        var children = parentDom.getElementsByTagName(tagName);
        if (children) {
            if (index) {
                return children[index]
            }
            return children[0]
        }
        return null;
    },
    removeWatermark() {
        var head = document.head
        var style = document.createElement("style")
        style.type = "text/css"
        var css = [
            "a[class*='marquee animation'],txpdiv[class*='player-inject'] {",
            "    display: none!important;",
            "}",
            "#x-tcp-container > txpdiv {",
            "    display: none!important;",
            "}",
        ].join("\n")
        var text = document.createTextNode(css)
        style.appendChild(text)
        head.appendChild(style)
    },
    liClickEvent() {
        var tmpList = document.querySelectorAll("div.loki-playbackrate");
        var tmpUlList;
        for (var i = 0; i < tmpList.length; i++) {
            var tmp = Bamboo.getChildDom(tmpList[i], 'ul');

            if (tmp) {
                tmpUlList = tmp
            }
        }

        var childNodes = tmpUlList.childNodes;
        for (var j = 0; j < childNodes.length; j++) {
            var li = childNodes[j];
            var attrVal = li.getAttribute("loki-menu-selected");
            var classAttrVal = li.getAttribute("class");
            if (classAttrVal && classAttrVal.indexOf('loki-menu-selected') > -1) {
                li.setAttribute('class', classAttrVal.substring(0, classAttrVal.indexOf('loki-menu-selected') - 1));
            }
        }
        var rateDiv = document.querySelector("div.loki-playbackrate");
		var rateVal = rateDiv.querySelectorAll('button.loki-rate-button')
        var classVal = this.getAttribute('class')
        classVal = classVal.concat("loki-menu-selected");

        var selectSpeedText = this.innerText;
        var selectSpeed = 1;
        rateVal[0].innerText = selectSpeedText;
        if (selectSpeedText) {
            selectSpeed = selectSpeedText.replace(/x/, '').replace(/倍/, '')
        }

        var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
        if (video) {
            video.play();
            video.playbackRate = selectSpeed;
        }
    },
    initFunc(){
        console.log('initFunc ----- bamboo')
        var ulList;
        //定义播放速度列表
        var extSpeedArr = [0.8, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7];
        var playSpeedList = document.querySelectorAll("div.loki-playbackrate");
        var button;
        for (var i = 0; i < playSpeedList.length; i++) {
            var tmp = Bamboo.getChildDom(playSpeedList[i], 'ul');
            var tmp1 = Bamboo.getChildDom(playSpeedList[i], 'button');
            if (tmp) {
                ulList = tmp
            }
            if (tmp1) {
                button = tmp1;
            }
        }
		if (!ulList || !ulList.innerHTML) {
			return
		}
        ulList.innerHTML = '';

        for (var j = 0; j < extSpeedArr.length; j++) {
            var appendLi = document.createElement('li');
            appendLi.setAttribute('class', 'vjs-menu-item')
            appendLi.setAttribute('tabindex', '-1')
            appendLi.setAttribute('role', 'menuitemcheckbox')
            appendLi.setAttribute('aria-live', 'polite')
            appendLi.setAttribute('aria-disabled', 'false')
            appendLi.setAttribute('aria-checked', 'false')

            var liSpan1 = document.createElement('span');
            liSpan1.setAttribute('class', 'vjs-menu-item-text');
            liSpan1.innerText = extSpeedArr[j] + 'x';
            appendLi.appendChild(liSpan1);

            var liSpan2 = document.createElement('span');
            liSpan2.setAttribute('class', 'vjs-control-text');
            appendLi.appendChild(liSpan1);
            appendLi.appendChild(liSpan2);

            ulList.append(appendLi)

            if (appendLi.addEventListener) {
                appendLi.addEventListener("click", Bamboo.liClickEvent, false);
            }
            if (appendLi.attachEvent) {
                appendLi.attachEvent("onclick", Bamboo.liClickEvent);
            }
        }
    }
};

/**
 * imooc 网
 */
//imooc 添加多倍速播放
let Mooc = {
    moocLiClickEvent(obj) {
        $(obj).parent().find('li').removeClass('current')
        $(obj).addClass('current');

        var currentSpeedText = $(obj).text();
        var currentSpeed = currentSpeedText.replace(/[^0-9]/ig, '');
        var cssAttrs = $('.vjs-playback-rate-value').attr('class');
        var rateNum = cssAttrs.replace(/[^0-9]/ig, '');

        $('.vjs-playback-rate-value').removeClass('rate' + rateNum + 'x').addClass('rate' + (currentSpeed * 10 > 100 ? (currentSpeed * 10 / 10) : currentSpeed * 10) + 'x')

        if (currentSpeed.length == 2) {
            currentSpeed = currentSpeed / 10;
        } else if (currentSpeed.length == 3) {
            currentSpeed = currentSpeed / 100;
        }
        $('.vjs-playback-rate-value').css('background-image', 'url()');
        $('.vjs-playback-rate-value').text(currentSpeed + 'x');

        var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
        if (video) {
            video.play();
            video.playbackRate = currentSpeed;
        }
    },
    addMoocExtSpeedPlay() {
        var extSpeedArr = ['2.5x', '3x', '3.5x', '4x','4.5x','5x','5.5x','6x','6.5x','7x'];
        var ulList = $('#vjsMenu').children('ul')
        var appendHtml = '<li class="vjs-menu-item" tabindex="-1" role="menuitem" aria-live="polite">?<span class="vjs-control-text"></span><i class="imv2-check"></i></li>';
        for (var i = 0; i < extSpeedArr.length; i++) {
            var appendLi = appendHtml.replace('?', extSpeedArr[i]);
            ulList.prepend(appendLi)
        }

        $('ul.vjs-menu-content').on('click', 'li', function () { //只要改这一行就可以了
            Mooc.moocLiClickEvent(this);
        });
    }
}

    ; (function () {
        'use strict';
        //网易云课堂
        if (website_host.indexOf('study.163.com') > -1) {
            setTimeout(function () {
                try {
                    StudyWy.addWyExtSpeedPlay();
                    $(document).ready(function () {
                        let speedText = $('.j-ratebtn_text').text().replace(/x/, '');
                        $(".changePlayRateSelect").find("option[value='" + speedText + "']").attr("selected", true);

                        $('.changePlayRateSelect').change(function () {
                            var val = $(this).children('option:selected').val();//这就是selected的值
                            $('.j-ratebtn_text').text(val + 'x');
                            var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
                            if (video) {
                                video.play();
                                video.playbackRate = val;
                            }
                        })
                    });

                    //自动播放下一个视频
                    var studyLoop = setInterval(function () {
                        let replayTxt = $('.j-replay').css('display');
                        if (replayTxt == 'block') {
                            document.getElementById("j-next").click();

                            setTimeout(() => {
                                //重置速度与显示,以及隐藏倍速切换
                                $('.m-popover-rate').css('display', 'none');

                                let speedVal = $('.changePlayRateSelect option:selected').val()
                                $('.j-ratebtn_text').text(speedVal + 'x');
                                var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
                                if (video) {
                                    video.play();
                                    video.playbackRate = speedVal;
                                }
                            }, 3000);
                        }
                    }, 1000);
                } catch (error) {
                }
            }, 5000);
        }

        //腾讯课堂
        if (website_host.indexOf('ke.qq.com') > -1) {
            try {
                Bamboo.removeWatermark();
                setTimeout(Bamboo.initFunc, 5000);


                //自动播放下一个视频
                var qqLoop = setInterval(function () {
                    if ($('.next-btn') != null && $('.next-btn') != undefined && $('.next-btn').length > 0) {
                        $('.next-btn').click();

                        let speedVal = $('.loki-playbackrate .loki-rate-button').html().replace(/x/, '');
                        setTimeout(() => {
                            if (speedVal != undefined && /[0-9]{1}\.{0,1}[0-9]{0,2}/.test(speedVal)) {
                                var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
                                if (video) {
                                    console.log('speedVal:' + speedVal)
                                    video.play();
                                    video.playbackRate = speedVal;
                                    Bamboo.initFunc();
                                }
                            }
                        }, 3000);
                    }
                }, 1000);
            } catch (error) {
            }
        }

        // 慕课网
        if (website_host.indexOf('imooc.com') > -1) {
            try {
                //imooc 自动播放下一条视频 参考372498，不过有的失效的地方我已经改掉
                var nextMask = document.querySelector('div.next-box.J_next-box');
                var moocLoop = setInterval(function () {
                    if (!nextMask.classList.contains('hide')) {
                        //写入 cookie
                        let speedVal = $('.vjs-playback-rate-value').html().replace(/x/, '');
                        let cookieVal = document.cookie;
                        if (cookieVal.indexOf('backPlayRate') > -1) {
                            let oldSpeedVal = cookieVal.split(";")[0].split("=")[1];
                            if (speedVal != oldSpeedVal ){
                                cookieVal = cookieVal.substring(cookieVal.indexOf(';'));
                                document.cookie = 'backPlayRate=' + speedVal + ';' + cookieVal;
                            }
                        } else {
                            document.cookie = 'backPlayRate=' + speedVal + ';' + cookieVal;
                        }

                        document.querySelector('span.J-next-btn.next-auto.moco-btn.moco-btn-green').click();
                    }
                }, 1000);
                //添加多倍速菜单
                setTimeout(function () {
                    Mooc.addMoocExtSpeedPlay();

                    //读取 cookie 设置播放速度
                    let cookieVal = document.cookie;
                    if (cookieVal.indexOf('backPlayRate') > -1) {
                        let speedVal = cookieVal.split(";")[0].split("=")[1];
                        if (speedVal != null && speedVal != undefined && /[0-9]{1}\.{0,1}[0-9]{0,2}/.test(speedVal)) {
                            var cssAttrs = $('.vjs-playback-rate-value').attr('class');
                            var rateNum = cssAttrs.replace(/[^0-9]/ig, '');

                            $('.vjs-playback-rate-value').removeClass('rate' + rateNum + 'x').addClass('rate' + (speedVal * 10 > 100 ? (speedVal * 10 / 10) : speedVal * 10) + 'x')

                            $('.vjs-playback-rate-value').css('background-image', 'url()');
                            $('.vjs-playback-rate-value').text(speedVal + 'x');

                            var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
                            if (video) {
                                video.play();
                                video.playbackRate = speedVal;
                            }
                        }
                    }
                }, 3000)
            } catch (error) {
            }
        }
    })();
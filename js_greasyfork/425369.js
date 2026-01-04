// ==UserScript==
// @name         zhaolu-auto
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  招录用户自动同步职位信息至第三方招聘网站
// @author       Zhaolu
// @match        *.zhaopin.com/job/publish*
// @match        *rd6.zhaopin.com/resume/detail*
// @match        *vip.gxrc.com/Position/PositionRelease*
// @require      https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js
// @connect      h5.zhaolu360.com
// @connect      zl.dingmatrix.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license GPL
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/425369/zhaolu-auto.user.js
// @updateURL https://update.greasyfork.org/scripts/425369/zhaolu-auto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push( callback );
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function(){
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }

    // e.g.
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                //console.log(66666, xhr.responseURL );
            }
        });

    });

    // Your code here...
    $(function () {
        var isZhaoPin = /zhaopin\.com/.test(location.host)
        var isZhaoPinJobPublish = isZhaoPin && /\/job\/publish/.test(location.pathname)
        var qZlKey = getUrlParameter('zl-key');
        console.log(qZlKey, location.href, location.pathname, location);
        if (isZhaoPinJobPublish && qZlKey) {
            setTimeout(function () {
                ZhaoPinJobPublish(qZlKey)
            }, 1000)
            return;
        }

        // is gxrc
        var isGxRC = /gxrc\.com/.test(location.host)
        if (isGxRC && qZlKey) {
            GxRCJobPublish(qZlKey)
            return;
        }
    })

    function GxRCJobPublish(qZlKey) {
        getPosition(qZlKey)
        .then(async (position) => {
            console.log('zhaolu-auto', position)
            var popper = null
            // wait for element
            var $ordinary = await waitFor('.select_position_ordinary')
            $ordinary.click()

            await sleep(1000)
            $('.button_nextstep_active').click()
            await sleep(1000)

            var $positionName = $('label[for=name]').parent().find('input')
            setNodeValue($positionName, position.positionName)

            var $company = $('label[for=company]').parent().find('input')
            $company.click()
            await sleep(200)
            $('.el-select__popper:visible').find('li').eq(0).click()

            await sleep(200)
            var $dept = $('label[for=department]').parent().find('input')
            $dept.click()
            await sleep(200)
            $('.el-select__popper:visible').find('li').eq(0).click()

            await sleep(200)
            var $location = $('label[for=location]').parent().find('input')
            $location.click()
            await sleep(200)
            $('.el-select__popper:visible').find('li').eq(0).click()

            var $number = $('label[for=number]').parent().find('input')
            setNodeValue($number, position.plan_count)

            // 性质
            await sleep(200)
            var nature = $('label[for=nature]').parent().find('input')
            nature.click()
            await sleep(200)
            popper = $('.el-select__popper:visible');
            var targetLi = popper.find(`li:contains("${position.workNatureStr}")`)
            if (targetLi.length) {
                targetLi.eq(0).click()
            }
            else {
                popper.find('li').eq(0).click()
            }

            var describe = $('label[for=describe]').parent().find('textarea')
            setNodeValue(describe, position.description)

            // 学历
            await sleep(200)
            var education = $('label[for=education]').parent().find('input')
            education.click()
            await sleep(200)
            popper = $('.el-select__popper:visible');
            targetLi = popper.find(`li:contains("${position.degreeName}")`)
            if (targetLi.length) {
                targetLi.eq(0).click()
            }
            else {
                popper.find('li').eq(0).click()
            }

            // 工龄
            await sleep(200)
            var workAge = $('label[for=work_age]').parent().find('input')
            workAge.click()
            await sleep(200)
            popper = $('.el-select__popper:visible');
            var workYear = position.workYearStr.split('-')[0]
            targetLi = popper.find(`li:contains("${workYear}")`)
            if (targetLi.length) {
                targetLi.eq(0).click()
            }
            else {
                popper.find('li').eq(0).click()
            }
        })
        .catch(err => {
            console.log('getPosition error', err)
        })
    }

    function waitFor(selector) {
        return new Promise(function (resolve, reject) {
            waitForKeyElements(selector, function (node) {
                console.log('find !!!!!', node)
                resolve(node)
            })
        })
    }

    function setNodeValue(node, value) {
        node.length && node.val(value).get(0).dispatchEvent(new Event('input'));
    }


    function sleep(timeout) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve()
            }, timeout)
        })
    }

    function ZhaoPinJobPublish(qZlKey) {
        getPosition(qZlKey)
        .then(function (position) {
            // 开始填充
            var $positionName = $('input[placeholder="请输入职位名称"]');
            if (!$positionName.length) {
                $positionName = $('input[placeholder="如: 人力资源经理，请勿超过30个字"]');
            }
            $positionName.length && $positionName.val(position.positionName).get(0).dispatchEvent(new Event('input'));

            $('.jqte_editor').html(position.description.replace(/\r|\n/g, '<br/>'));
            $('textarea').eq(0).val(position.description).get(0).dispatchEvent(new Event('input'));

            var $type = $('input[placeholder="建议选择推荐职位类别，有助于帮您更精准地匹配人才"],input[placeholder="请选择职位类别"]');
            $type.length > 0 && $type.val(position.type).get(0).dispatchEvent(new Event('input'));

            var $degreeName = $('input[placeholder="最低学历"],input[placeholder="请选择学历"]');
            $degreeName.length && $degreeName.val(position.degreeName).get(0).dispatchEvent(new Event('input'));

            var $workYear = $('input[placeholder="工作经验"],input[placeholder="请选择工作年限"]');
            $workYear.length && $workYear.val(position.workYearStr).get(0).dispatchEvent(new Event('input'));

            var $salaryMin = $('input[placeholder="最低"]');
            $salaryMin.length && $salaryMin.val(position.salaryMin).get(0).dispatchEvent(new Event('input'));

            var $salaryMax = $('input[placeholder="最高"]');
            $salaryMax.length && $salaryMax.val(position.salaryMax).get(0).dispatchEvent(new Event('input'));

            var $plan = $('input[placeholder="请输入招聘人数"]');
            $plan.length && $plan.val(position.plan_count || 1).get(0).dispatchEvent(new Event('input'));
        })
    }

    function setValue($item, label, value) {
        var $label = $item.find('.km-form-item__label');
        if ($label.text() === label) {
            var $input = $item.find('input,textarea');
            $input.val(value);
            console.log(label, $input.length);
        }
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    }

    function getPosition(qZlKey) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: "GET",
                //url: "https://h5.zhaolu360.com/zl/own/user/job?key=" + qZlKey,
                url: "http://zl.dingmatrix.com:8088/zl/own/user/job?key=" + qZlKey,
                onload: function(res) {
                    console.log('onload', res)
                    if (res.status == 200) {
                        var text = res.responseText;
                        var json = JSON.parse(text);
                        var position = json.data;
                        if (!position) {
                            reject()
                            return;
                        }

                        resolve(position)
                    }
                },
                onabort: reject,
                onerror: reject,
                ontimeout: reject,
            });
        })
    }

    function waitForKeyElements(
    selectorTxt,
     actionFunction,
     bWaitOnce,
     iframeSelector
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
                .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
            are new.
        */
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];
        console.log('waitFor', btargetsFound && bWaitOnce && timeControl)

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                                       actionFunction,
                                       bWaitOnce,
                                       iframeSelector
                                      );
                },
                                          300
                                         );
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
})();
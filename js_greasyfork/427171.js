// ==UserScript==
// @name         hlog
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  日志
// @author       You
// @include      *hlog.hellobike.cn*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/427171/hlog.user.js
// @updateURL https://update.greasyfork.org/scripts/427171/hlog.meta.js
// ==/UserScript==



(function () {
    'use strict';

    var appList = [
        { "appId": "AppLocalLifeBDService", "appName": null, "description": null },
        { "appId": "AppLocalOtaService", "appName": null, "description": null },
        { "appId": "AppLocalFulfillService", "appName": null, "description": null },
        { "appId": "AppMerchantPlatformService", "appName": null, "description": null },
    ];

    // #app > main
    var seletor = '#u_B2AF7FE1 > div > div > div.ant-list.ant-list-split > div > div > ul'
    waitForKeyElements(seletor, actionFunction);

    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
    ).set;

    XMLHttpRequest.prototype.originSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function (body) {
        var xhr = this;
        var originOnreadystatechange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.responseURL && xhr.responseURL.indexOf('hlog-portal.hellobike.cn/api/common/getAppIdList') != -1) {
                // 修改body
                var response = xhr.response;
                Object.defineProperty(xhr, 'responseText', {
                    get: () => xhr['_responseText'] == undefined ? response : xhr['_responseText'],
                    set: (val) => xhr['_responseText'] = val,
                    enumerable: true
                });

                Object.defineProperty(xhr, 'response', {
                    get: () => xhr['_response'] == undefined ? response : xhr['_response'],
                    set: (val) => xhr['_response'] = val,
                    enumerable: true
                });


                var resp = JSON.parse(response);
                var data = [];
                for (var appData of resp.data) {
                    var flag = true;
                    for (var myapp of appList) {
                        if (myapp.appId === appData.appId) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        data.push(appData);
                    }
                }

                for (var app of appList) {
                    data.unshift(app);
                }

                resp.data = data;

                xhr.responseText = JSON.stringify(resp);
                xhr.response = JSON.stringify(resp);
            }
            if (originOnreadystatechange) {
                originOnreadystatechange.apply(xhr);
            }

        }
        xhr.originSend(body);
    };

    function actionFunction() {
        $('#app > main').scroll(function () {
            // scroll at bottom

            if ($(this).height() + $(this).scrollTop() + 100 > this.scrollHeight)
                // load data
                var more = '#u_B2AF7FE1 > div > div > div.loadingMore___1NnH6 > div'
            if (more && $(more).text() === '加载更多...') {
                $(more).click();
            }

        });

        setInterval(fun, 1000);

    }



    function fun() {

        // 全部展开
        var contents = $('.panelContentDefault___153ib');

        if (!content) {
            return;
        }

        contents.attr('class', 'panelContentDefault___153ib panelContentExpand___3PzwX');
        $('.moreButton___p54Kd').remove();

        // traceId title 点击查询
        var antTags = $('.ant-tag.ant-tag-processing');
        if (antTags) {
            antTags.each(function (index, antTag) {

                var tag = $(antTag);

                var text = tag.text();
                if (text) {
                    if (text.indexOf('traceId=') != -1 && !tag.attr('traceIdButton')) {
                        tag.css('cursor', 'pointer')
                        tag.attr('traceIdButton', "true");
                        // traceId
                        tag.click(function () {
                            var traceId = text.slice(8, -1);
                            var traceIdInput = $('#traceId');

                            nativeInputValueSetter.call(traceIdInput[0], traceId);

                            traceIdInput[0].dispatchEvent(new Event('input', { bubbles: true }));

                            clearInput('traceId');

                            $('#u_C3D20BC3 > form > div:nth-child(2) > div > div > div > div > div > div > div:nth-child(1) > button').click();
                        });
                    }

                    if (text.indexOf('title=') != -1 && !tag.attr('titleButton')) {
                        tag.css('cursor', 'pointer')
                        tag.attr('titleButton', "true");
                        // title
                        tag.click(function () {
                            var title = text.slice(6, -1);
                            var titleInput = $('#title');

                            nativeInputValueSetter.call(titleInput[0], title);

                            titleInput[0].dispatchEvent(new Event('input', { bubbles: true }));

                            clearInput('title');

                            $('#u_C3D20BC3 > form > div:nth-child(2) > div > div > div > div > div > div > div:nth-child(1) > button').click();
                        });
                    }



                }
            })

        }


        // param result 高亮
        contents.each(function (index, content) {
            var text = $(this).text();
            if (text && !$(this).attr('setColor')) {
                if (text.indexOf('param') != -1 && text.indexOf('result') != -1 && text.indexOf('invoke') != -1) {
                    var newStr = text.replace('param', '<font color="red">param</font>');
                    newStr = newStr.replace('result', '<font color="red">result</font>');
                    $(this).html(newStr).attr('setColor', 'true');
                }
            }
        })

        // 异常
        var errorContents = $('.ERROR-panel-header___3lyNZ .panelContentDefault___153ib');
        var ideaUrl = 'http://localhost:63342/api/file/src/main/java/';
        var reg = /(\S+)\.\w+\(\S+:(\d+)\)/;
        errorContents.each(function (index, content) {
            var html = $(this).html();
            if (html && html.indexOf('exception') != -1 && !$(this).attr('setExpection')) {
                $(this).attr('setExpection', 'true');
                var match = '<br>at';
                var slices = html.split(match);

                if (slices && slices.length > 1) {
                    var newExption = slices[0];
                    for (var i = 1, len = slices.length; i < len; i++) {
                        var s = slices[i];
                        if (s && (s.indexOf('local') != -1) || s.indexOf('merchantplatform') != -1) {
                            var m = s.match(reg);
                            if (m && m.length == 3) {
                                var className = m[1];
                                if (className.indexOf('$') != -1) {
                                    className = className.split('$')[0];
                                }
                                var lineNo = m[2];
                                var relationPath = className.replaceAll('.', '/') + '.java:' + lineNo;
                                newExption += '<span idea = "true" ideapath="' + relationPath + '">' + '<font color="green">' + match + s + '</font>' + '</span>';
                            }
                        } else {
                            newExption += match + s;
                        }
                    }

                    $(this).html(newExption);
                    $('span[idea="true"]').css('cursor', 'pointer');
                    $('span[idea="true"]').click(function () {

                        var settings = {
                            "url": ideaUrl + $(this).attr('ideapath'),
                            "method": "GET",
                            "timeout": 0,
                            "dataType ": "json",
                            "headers": {
                                "accept": "application/json, text/plain, */*",
                                "content-type": "application/json;charset=UTF-8"
                            }
                        };

                        $.ajax(settings).done(function (response) {
                        });

                    })
                    $('span[idea="true"]').attr('idea', 'false');
                }

            }
        })

    }

    function clearInput(type) {

        // clear checkboxs
        var checkboxs = $('.ant-checkbox.ant-checkbox-checked');
        if (!checkboxs) {
            return;
        }
        checkboxs.each(function (index, checkbox) {
            var c = $(checkbox).attr('class');
            if (c && c === 'ant-checkbox ant-checkbox-checked') {
                $(checkbox).click();
            }
        })

        // clear other input

        var content = $('#content');
        nativeInputValueSetter.call(content[0], '');
        content[0].dispatchEvent(new Event('input', { bubbles: true }));


        var tags = $('#tags');
        nativeInputValueSetter.call(tags[0], '');
        tags[0].dispatchEvent(new Event('input', { bubbles: true }));

        var logName = $('#logName');
        nativeInputValueSetter.call(logName[0], '');
        logName[0].dispatchEvent(new Event('input', { bubbles: true }));


        if (type === 'traceId') {
            var title = $('#title');
            nativeInputValueSetter.call(title[0], '');
            title[0].dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            var traceId = $('#traceId');
            nativeInputValueSetter.call(traceId[0], '');
            traceId[0].dispatchEvent(new Event('input', { bubbles: true }));
        }
    }


    function waitForKeyElements(
        selectorTxt,    /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */
        actionFunction, /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */
        bWaitOnce,      /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */
        iframeSelector  /* Optional: If set, identifies the iframe to
                            search.
                        */
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
        }
        else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        }
        else {
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

})()

